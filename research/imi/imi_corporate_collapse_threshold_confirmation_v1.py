#!/usr/bin/env python3
import json,time
from pathlib import Path
import numpy as np
import pandas as pd
import requests

UA='IMI-collapse-confirmation/1.0 research@example.com'
BASE='https://data.sec.gov/api/xbrl/companyfacts/CIK{cik:010d}.json'
TM,TS=3,4
CASES=[
 {'name':'Bed Bath & Beyond','cik':886158,'group':'failure','terminal':'2023-04-23'},
 {'name':'Party City Holdco','cik':1592057,'group':'failure','terminal':'2023-01-17'},
 {'name':'Best Buy','cik':764478,'group':'turnaround','terminal':None},
 {'name':'Abercrombie & Fitch','cik':1018840,'group':'turnaround','terminal':None},
 {'name':'Gap','cik':39911,'group':'turnaround','terminal':None},
 {'name':'Walmart','cik':104169,'group':'healthy','terminal':None},
 {'name':'Costco','cik':909832,'group':'healthy','terminal':None},
 {'name':'Home Depot','cik':354950,'group':'healthy','terminal':None},
]
TAGS={
 'assets':['Assets'],'assets_current':['AssetsCurrent'],'liabilities':['Liabilities'],'liabilities_current':['LiabilitiesCurrent'],
 'cash':['CashAndCashEquivalentsAtCarryingValue','CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents'],
 'equity':['StockholdersEquity','StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest'],
 'debt_current':['LongTermDebtCurrent','ShortTermBorrowings'],'debt_noncurrent':['LongTermDebtNoncurrent','LongTermDebt'],
 'revenue':['Revenues','SalesRevenueNet','RevenueFromContractWithCustomerExcludingAssessedTax'],'op_income':['OperatingIncomeLoss'],
 'cfo':['NetCashProvidedByUsedInOperatingActivities']}
FLOW={'revenue','op_income','cfo'}

def req_json(url):
 r=requests.get(url,headers={'User-Agent':UA,'Accept-Encoding':'gzip, deflate'},timeout=90); r.raise_for_status(); time.sleep(.12); return r.json()
def qe(x): return pd.Timestamp(x).to_period('Q').end_time.normalize()
def fact(cf,key):
 f=cf.get('facts',{}).get('us-gaap',{})
 for tag in TAGS[key]:
  if tag in f:
   u=f[tag].get('units',{})
   if 'USD' in u:return u['USD']
   if u:return next(iter(u.values()))
 return []
def series(cf,key):
 rows=[]
 for x in fact(cf,key):
  if x.get('form') not in ('10-Q','10-K','10-Q/A','10-K/A') or not x.get('end') or x.get('val') is None:continue
  try:end=pd.Timestamp(x['end']); val=float(x['val'])
  except:continue
  if not np.isfinite(val):continue
  if key in FLOW:
   if not x.get('start'):continue
   try:days=(end-pd.Timestamp(x['start'])).days
   except:continue
   if days<55 or days>125:continue
  rows.append((qe(end),pd.Timestamp(x.get('filed',x['end'])),val))
 if not rows:return pd.Series(dtype=float)
 d=pd.DataFrame(rows,columns=['date','filed','val']).sort_values(['date','filed']).drop_duplicates('date',keep='last')
 return d.set_index('date').val.sort_index()
def map_imi(p):
 eps=1e-12
 p=p.copy(); p['current_ratio']=p.assets_current/(p.liabilities_current.abs()+eps); p['cash_to_cl']=p.cash/(p.liabilities_current.abs()+eps)
 p['liab_to_assets']=p.liabilities/(p.assets.abs()+eps); p['equity_to_assets']=p.equity/(p.assets.abs()+eps)
 p['debt_to_assets']=(p.debt_current.fillna(0)+p.debt_noncurrent.fillna(0))/(p.assets.abs()+eps); p['op_margin']=p.op_income/(p.revenue.abs()+eps); p['cfo_to_assets']=p.cfo/(p.assets.abs()+eps)
 clip=lambda x:np.clip(x,0,1)
 p['a_liquidity']=clip((p.current_ratio-.50)/1.50); p['a_cash']=clip(p.cash_to_cl/.50); p['a_solvency']=clip(1-(p.liab_to_assets-.40)/.80)
 p['a_equity']=clip((p.equity_to_assets+.25)/.75); p['a_debt']=clip(1-(p.debt_to_assets-.10)/.80); p['a_operations']=clip((p.op_margin+.20)/.40); p['a_cashflow']=clip((p.cfo_to_assets+.05)/.15)
 A=['a_liquidity','a_cash','a_solvency','a_equity','a_debt','a_operations','a_cashflow']; p['dims_observed']=p[A].notna().sum(axis=1)
 p['imi_level']=(p[A].lt(.333)&p[A].notna()).sum(axis=1).astype(float); p.loc[p.dims_observed<4,'imi_level']=np.nan
 p['decision_space']=p[A].mean(axis=1,skipna=True); p.loc[p.dims_observed<4,'decision_space']=np.nan
 p['imi_velocity']=p.imi_level.diff(); p['imi_acceleration']=p.imi_velocity.diff(); p['conventional_warning']=((p.current_ratio<1)|(p.equity_to_assets<0)|(p.op_margin<0)).astype(float)
 return p
def build(c):
 cf=req_json(BASE.format(cik=c['cik'])); ss={k:series(cf,k) for k in TAGS}; idx=sorted(set().union(*[set(s.index) for s in ss.values() if len(s)]));
 if not idx:return pd.DataFrame()
 p=pd.DataFrame(index=pd.DatetimeIndex(idx));
 for k,s in ss.items():p[k]=s.reindex(p.index)
 p=map_imi(p.sort_index()); p=p[p.index<=pd.Timestamp('2025-12-31')].copy()
 term=pd.Timestamp(c['terminal']) if c['terminal'] else pd.NaT
 if c['group']=='failure':p=p[p.index<term]
 p['company']=c['name'];p['group']=c['group'];p['terminal']=term
 if c['group']=='failure':p['quarters_to_terminal']=((term-p.index).days/91.3125);p['terminal_within_4q']=(p.quarters_to_terminal<=4.5).astype(int)
 else:p['quarters_to_terminal']=np.nan;p['terminal_within_4q']=0
 return p.reset_index(names='quarter')
def first_cross(g,k):
 z=g[g.imi_level>=k];return None if z.empty else z.quarter.min()
def persistent_ts(g):
 a=(g.imi_level>=TS).astype(int).to_numpy();return bool(np.any((a[:-1]+a[1:])==2)) if len(a)>1 else False
def reversible(g):
 g=g.sort_values('quarter').reset_index(drop=True); hits=[]
 for i,r in g.iterrows():
  if r.imi_level>=TS:
   fut=g.iloc[i+1:i+5];hits.append(bool(len(fut) and (fut.imi_level<TS).any()))
 return None if not hits else float(np.mean(hits))
def main():
 panels=[];errors=[]
 for c in CASES:
  try:
   p=build(c);print('CASE',c['name'],c['group'],'ROWS',len(p),flush=True)
   if len(p):panels.append(p)
  except Exception as e:errors.append({'company':c['name'],'error':repr(e)});print('ERROR',c['name'],repr(e),flush=True)
 d=pd.concat(panels,ignore_index=True).sort_values(['company','quarter']) if panels else pd.DataFrame(); findings={'thresholds':{'momentum':TM,'survivability':TS},'errors':errors}
 if d.empty:findings['verdict']='UNEVALUABLE'
 else:
  u=d.dropna(subset=['imi_level']).copy(); counts=u.groupby(['group','company']).size().reset_index(name='n'); eligible=counts[counts.n>=12]
  ne=eligible.groupby('group').size().to_dict(); evaluable=ne.get('failure',0)>=2 and ne.get('turnaround',0)>=2 and ne.get('healthy',0)>=2
  findings['usable_counts']=counts.to_dict('records');findings['eligible_counts']=ne
  if not evaluable:findings['verdict']='UNEVALUABLE'
  else:
   fail=u[u.group=='failure']; turn=u[u.group=='turnaround']; healthy=u[u.group=='healthy']
   frows=[]
   for name,g in fail.groupby('company'):
    g=g.sort_values('quarter');m=first_cross(g,TM);s=first_cross(g,TS);term=g.terminal.iloc[0]
    frows.append({'company':name,'TM':None if m is None else str(m.date()),'TS':None if s is None else str(s.date()),'ordered':bool(m is not None and s is not None and m<=s),'TS_within_8q':bool(s is not None and (term-s).days/91.3125<=8.5),'TM_lead_months':None if m is None else float((term-m).days/30.4375),'TS_lead_months':None if s is None else float((term-s).days/30.4375)})
   A=bool(len(frows)>=2 and all(x['ordered'] for x in frows) and any(x['TS_within_8q'] for x in frows))
   hrows=[]
   for name,g in healthy.groupby('company'):hrows.append({'company':name,'persistent_TS':persistent_ts(g),'TS_prevalence':float((g.imi_level>=TS).mean())})
   hp=float((healthy.imi_level>=TS).mean());B=bool(all(not x['persistent_TS'] for x in hrows) and hp<=.10)
   trows=[]
   for name,g in turn.groupby('company'):
    hit=bool((g.imi_level>=TS).any());rev=reversible(g);ok=(not hit) or (rev is not None and rev>0)
    trows.append({'company':name,'ever_TS':hit,'TS_reversibility_4q':rev,'passes':bool(ok)})
   C=bool(sum(x['passes'] for x in trows)>=2)
   q=u.sort_values(['company','quarter']).copy();q['future_TS4']=0
   for name,g in q.groupby('company'):
    ix=g.index.tolist()
    for pos,i in enumerate(ix):q.loc[i,'future_TS4']=int(any(q.loc[ix[j],'imi_level']>=TS for j in range(pos+1,min(pos+5,len(ix)))))
   stat=q[q.imi_level>=TM];dyn=stat[((stat.imi_velocity>0)|(stat.imi_acceleration>0))];p_static=float(stat.future_TS4.mean()) if len(stat) else np.nan;p_dyn=float(dyn.future_TS4.mean()) if len(dyn) else np.nan
   D=bool(len(stat)>=10 and len(dyn)>=5 and np.isfinite(p_static) and np.isfinite(p_dyn) and p_dyn-p_static>=.05)
   sev=[]
   for k in range(1,5):
    z=fail[fail.imi_level>=k];sev.append({'threshold':k,'n':int(len(z)),'terminal_4q_rate':float(z.terminal_within_4q.mean()) if len(z) else None})
   rates=[x['terminal_4q_rate'] for x in sev if x['terminal_4q_rate'] is not None];E=bool(len(rates)==4 and all(rates[i+1]>=rates[i]-1e-12 for i in range(3)))
   criteria={'A_failure_ordering':A,'B_TS_specificity':B,'C_turnaround_reversibility':C,'D_momentum_utility':D,'E_monotonic_severity':E}
   findings.update({'failure_results':frows,'healthy_results':hrows,'healthy_TS_prevalence':hp,'turnaround_results':trows,'momentum':{'n_static':int(len(stat)),'n_dynamic':int(len(dyn)),'p_future_TS_static':p_static,'p_future_TS_dynamic':p_dyn,'absolute_gain':None if not(np.isfinite(p_static) and np.isfinite(p_dyn)) else float(p_dyn-p_static)},'severity':sev,'criteria':criteria,'verdict':'CONFIRMED' if all(criteria.values()) else 'FAIL'})
  d.to_csv('imi_corporate_collapse_threshold_confirmation_panel_v1.csv',index=False)
 Path('imi_corporate_collapse_threshold_confirmation_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str));Path('IMI_CORPORATE_COLLAPSE_THRESHOLD_CONFIRMATION_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str));print(json.dumps(findings,indent=2,default=str),flush=True)
if __name__=='__main__':main()
