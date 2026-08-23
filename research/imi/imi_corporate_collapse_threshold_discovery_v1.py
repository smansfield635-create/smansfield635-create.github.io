#!/usr/bin/env python3
import json, math, time
from pathlib import Path
from datetime import datetime
import numpy as np
import pandas as pd
import requests

UA='IMI-collapse-research/1.0 research@example.com'
BASE='https://data.sec.gov/api/xbrl/companyfacts/CIK{cik:010d}.json'

DISCOVERY=[
    {'name':'J.C. Penney','cik':1166126,'bankruptcy':'2020-05-15'},
    {'name':'Pier 1 Imports','cik':278130,'bankruptcy':'2020-02-17'},
    {'name':'RadioShack','cik':96289,'bankruptcy':'2015-02-05'},
    {'name':'Sears Holdings','cik':1310067,'bankruptcy':'2018-10-15'},
]

TAGS={
 'assets':['Assets'],
 'assets_current':['AssetsCurrent'],
 'liabilities':['Liabilities'],
 'liabilities_current':['LiabilitiesCurrent'],
 'cash':['CashAndCashEquivalentsAtCarryingValue','CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents'],
 'equity':['StockholdersEquity','StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest'],
 'debt_current':['LongTermDebtCurrent','ShortTermBorrowings'],
 'debt_noncurrent':['LongTermDebtNoncurrent','LongTermDebt'],
 'revenue':['Revenues','SalesRevenueNet','RevenueFromContractWithCustomerExcludingAssessedTax'],
 'op_income':['OperatingIncomeLoss'],
 'cfo':['NetCashProvidedByUsedInOperatingActivities'],
}

BALANCE={'assets','assets_current','liabilities','liabilities_current','cash','equity','debt_current','debt_noncurrent'}
FLOW={'revenue','op_income','cfo'}


def req_json(url):
    r=requests.get(url,headers={'User-Agent':UA,'Accept-Encoding':'gzip, deflate'},timeout=90)
    r.raise_for_status(); time.sleep(.12)
    return r.json()


def best_usgaap_fact(cf,key):
    facts=cf.get('facts',{}).get('us-gaap',{})
    for tag in TAGS[key]:
        if tag in facts:
            units=facts[tag].get('units',{})
            for unit in ['USD','USD/shares','shares']:
                if unit in units:
                    return units[unit]
            if units:
                return next(iter(units.values()))
    return []


def quarter_end(ts):
    d=pd.Timestamp(ts)
    return d.to_period('Q').end_time.normalize()


def select_series(cf,key):
    arr=best_usgaap_fact(cf,key)
    rows=[]
    for x in arr:
        if x.get('form') not in ('10-Q','10-K','10-Q/A','10-K/A'): continue
        if not x.get('end') or x.get('val') is None: continue
        try:
            end=pd.Timestamp(x['end']); val=float(x['val'])
        except Exception: continue
        if not np.isfinite(val): continue
        if key in FLOW:
            if not x.get('start'): continue
            try: days=(end-pd.Timestamp(x['start'])).days
            except Exception: continue
            if days<55 or days>125: continue
        rows.append({'date':quarter_end(end),'filed':pd.Timestamp(x.get('filed',x['end'])),'val':val})
    if not rows: return pd.Series(dtype=float)
    d=pd.DataFrame(rows).sort_values(['date','filed']).drop_duplicates('date',keep='last')
    return d.set_index('date').val.sort_index()


def availability(panel):
    eps=1e-12
    p=panel.copy()
    p['current_ratio']=p.assets_current/(p.liabilities_current.abs()+eps)
    p['cash_to_cl']=p.cash/(p.liabilities_current.abs()+eps)
    p['liab_to_assets']=p.liabilities/(p.assets.abs()+eps)
    p['equity_to_assets']=p.equity/(p.assets.abs()+eps)
    p['debt_to_assets']=(p.debt_current.fillna(0)+p.debt_noncurrent.fillna(0))/(p.assets.abs()+eps)
    p['op_margin']=p.op_income/(p.revenue.abs()+eps)
    p['cfo_to_assets']=p.cfo/(p.assets.abs()+eps)
    p['rev_yoy']=p.revenue/p.revenue.shift(4)-1

    def clip01(x): return np.clip(x,0,1)
    p['a_liquidity']=clip01((p.current_ratio-.50)/1.50)
    p['a_cash']=clip01(p.cash_to_cl/.50)
    p['a_solvency']=clip01(1-(p.liab_to_assets-.40)/.80)
    p['a_equity']=clip01((p.equity_to_assets+.25)/.75)
    p['a_debt']=clip01(1-(p.debt_to_assets-.10)/.80)
    p['a_operations']=clip01((p.op_margin+.20)/.40)
    p['a_cashflow']=clip01((p.cfo_to_assets+.05)/.15)
    A=['a_liquidity','a_cash','a_solvency','a_equity','a_debt','a_operations','a_cashflow']
    p['dims_observed']=p[A].notna().sum(axis=1)
    p['imi_level']=(p[A].lt(.333) & p[A].notna()).sum(axis=1).astype(float)
    p.loc[p.dims_observed<4,'imi_level']=np.nan
    p['decision_space']=p[A].mean(axis=1,skipna=True)
    p.loc[p.dims_observed<4,'decision_space']=np.nan
    p['imi_velocity']=p.imi_level.diff()
    p['imi_acceleration']=p.imi_velocity.diff()
    p['conventional_warning']=((p.current_ratio<1.0)|(p.equity_to_assets<0)|(p.op_margin<0)).astype(float)
    return p


def build_company(c):
    cf=req_json(BASE.format(cik=c['cik']))
    series={k:select_series(cf,k) for k in TAGS}
    idx=sorted(set().union(*[set(s.index) for s in series.values() if len(s)]))
    if not idx: return pd.DataFrame()
    p=pd.DataFrame(index=pd.DatetimeIndex(idx))
    for k,s in series.items(): p[k]=s.reindex(p.index)
    p=p.sort_index()
    p=availability(p)
    b=pd.Timestamp(c['bankruptcy'])
    p=p[p.index<b].copy()
    p['company']=c['name']; p['cik']=c['cik']; p['bankruptcy']=b
    p['quarters_to_bankruptcy']=np.maximum(0,((b-p.index).days/91.3125)).astype(float)
    p['collapse_within_4q']=(p.quarters_to_bankruptcy<=4.5).astype(int)
    p['collapse_within_8q']=(p.quarters_to_bankruptcy<=8.5).astype(int)
    return p.reset_index(names='quarter')


def threshold_scan(d):
    out=[]
    z=d.dropna(subset=['imi_level']).copy()
    for k in range(1,8):
        hi=z[z.imi_level>=k]; lo=z[z.imi_level<k]
        if len(hi)<5 or len(lo)<5: continue
        p_hi=float(hi.collapse_within_4q.mean()); p_lo=float(lo.collapse_within_4q.mean())
        rr=(p_hi+.02)/(p_lo+.02)
        rev=[]
        for _,g in z.groupby('company'):
            g=g.sort_values('quarter').reset_index(drop=True)
            for i,r in g.iterrows():
                if r.imi_level>=k:
                    fut=g.iloc[i+1:i+5]
                    if len(fut): rev.append(bool((fut.imi_level<k).any()))
        rev_rate=float(np.mean(rev)) if rev else None
        out.append({'threshold':k,'n_high':int(len(hi)),'n_low':int(len(lo)),'p_collapse_4q_high':p_hi,'p_collapse_4q_low':p_lo,'risk_ratio_smoothed':float(rr),'reversibility_4q':rev_rate})
    return out


def company_crossings(d,k):
    rows=[]
    for name,g in d.groupby('company'):
        g=g.sort_values('quarter')
        hit=g[g.imi_level>=k]
        conv=g[g.conventional_warning>=1]
        first_imi=hit.quarter.min() if len(hit) else pd.NaT
        first_conv=conv.quarter.min() if len(conv) else pd.NaT
        b=g.bankruptcy.iloc[0]
        def lead(dt): return None if pd.isna(dt) else float((b-dt).days/30.4375)
        rows.append({'company':name,'threshold':int(k),'first_imi_crossing':None if pd.isna(first_imi) else str(first_imi.date()),'first_conventional_warning':None if pd.isna(first_conv) else str(first_conv.date()),'imi_lead_months_to_bankruptcy':lead(first_imi),'conventional_lead_months_to_bankruptcy':lead(first_conv),'lead_advantage_months':None if pd.isna(first_imi) or pd.isna(first_conv) else float((first_conv-first_imi).days/30.4375)})
    return rows


def main():
    panels=[]; errors=[]
    for c in DISCOVERY:
        try:
            p=build_company(c)
            print('COMPANY',c['name'],'ROWS',len(p),flush=True)
            if len(p): panels.append(p)
        except Exception as e:
            errors.append({'company':c['name'],'error':repr(e)})
            print('ERROR',c['name'],repr(e),flush=True)
    if panels:
        d=pd.concat(panels,ignore_index=True).sort_values(['company','quarter'])
    else:
        d=pd.DataFrame()
    findings={'design':'IMI corporate collapse threshold discovery v1','discovery_companies':[c['name'] for c in DISCOVERY],'errors':errors}
    if d.empty:
        findings['verdict']='UNEVALUABLE'
    else:
        usable=d.dropna(subset=['imi_level'])
        counts=usable.groupby('company').size().to_dict()
        scan=threshold_scan(d)
        eligible=[x for x in scan if x['n_high']>=8 and x['n_low']>=8]
        candidate=max(eligible,key=lambda x:x['risk_ratio_smoothed']) if eligible else None
        findings.update({'n_rows':int(len(d)),'n_usable':int(len(usable)),'usable_by_company':{k:int(v) for k,v in counts.items()},'threshold_scan':scan})
        if candidate is None or len(counts)<3:
            findings['verdict']='UNEVALUABLE'
        else:
            k=int(candidate['threshold'])
            crossings=company_crossings(d,k)
            mom=[]
            q=usable.sort_values(['company','quarter']).copy()
            q['next_delta']=q.groupby('company').imi_level.shift(-1)-q.imi_level
            for lv,g in q.groupby('imi_level'):
                if g.next_delta.notna().sum()>=3:
                    mom.append({'level':int(lv),'mean_next_delta':float(g.next_delta.mean()),'n':int(g.next_delta.notna().sum())})
            momentum=max(mom,key=lambda x:x['mean_next_delta']) if mom else None
            findings.update({'candidate_survivability_threshold':candidate,'candidate_threshold_crossings':crossings,'candidate_momentum_shift':momentum,'verdict':'DISCOVERY_COMPLETE'})
        d.to_csv('imi_corporate_collapse_discovery_panel_v1.csv',index=False)
    Path('imi_corporate_collapse_threshold_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_CORPORATE_COLLAPSE_THRESHOLD_DISCOVERY_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
