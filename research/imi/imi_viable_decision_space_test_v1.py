#!/usr/bin/env python3
import json,time,math
from pathlib import Path
import numpy as np
import pandas as pd
import requests

UA='IMI-vds-research/1.0 research@example.com'
BASE='https://data.sec.gov/api/xbrl/companyfacts/CIK{cik:010d}.json'

CALIB=[
 {'name':'J.C. Penney','cik':1166126,'group':'failure','terminal':'2020-05-15'},
 {'name':'Pier 1 Imports','cik':278130,'group':'failure','terminal':'2020-02-17'},
 {'name':'RadioShack','cik':96289,'group':'failure','terminal':'2015-02-05'},
 {'name':'Sears Holdings','cik':1310067,'group':'failure','terminal':'2018-10-15'},
]
CONFIRM=[
 {'name':'Tailored Brands','cik':884217,'group':'failure','terminal':'2020-08-02'},
 {'name':'Ascena Retail Group','cik':1498301,'group':'failure','terminal':'2020-07-23'},
 {'name':'Stein Mart','cik':884940,'group':'failure','terminal':'2020-08-12'},
 {'name':'Macys','cik':794367,'group':'survivor','terminal':None},
 {'name':'Kohls','cik':885639,'group':'survivor','terminal':None},
 {'name':'Nordstrom','cik':72333,'group':'survivor','terminal':None},
 {'name':'Target','cik':27419,'group':'healthy','terminal':None},
 {'name':'Lowes','cik':60667,'group':'healthy','terminal':None},
 {'name':'TJX Companies','cik':109198,'group':'healthy','terminal':None},
]

TAGS={
 'assets':['Assets'],'assets_current':['AssetsCurrent'],'liabilities':['Liabilities'],'liabilities_current':['LiabilitiesCurrent'],
 'cash':['CashAndCashEquivalentsAtCarryingValue','CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents'],
 'equity':['StockholdersEquity','StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest'],
 'debt_current':['LongTermDebtCurrent','ShortTermBorrowings'],'debt_noncurrent':['LongTermDebtNoncurrent','LongTermDebt'],
 'revenue':['Revenues','SalesRevenueNet','RevenueFromContractWithCustomerExcludingAssessedTax'],'op_income':['OperatingIncomeLoss'],
 'cfo':['NetCashProvidedByUsedInOperatingActivities']}
FLOW={'revenue','op_income','cfo'}
A_COLS=['a_liquidity','a_cash','a_solvency','a_equity','a_debt','a_operations','a_cashflow']

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
  if x.get('form') not in ('10-Q','10-K','10-Q/A','10-K/A') or not x.get('end') or x.get('val') is None: continue
  try:end=pd.Timestamp(x['end']); val=float(x['val'])
  except: continue
  if not np.isfinite(val): continue
  if key in FLOW:
   if not x.get('start'): continue
   try:days=(end-pd.Timestamp(x['start'])).days
   except: continue
   if days<55 or days>125: continue
  rows.append((qe(end),pd.Timestamp(x.get('filed',x['end'])),val))
 if not rows:return pd.Series(dtype=float)
 d=pd.DataFrame(rows,columns=['date','filed','val']).sort_values(['date','filed']).drop_duplicates('date',keep='last')
 return d.set_index('date').val.sort_index()

def map_state(p):
 eps=1e-12; p=p.copy()
 p['current_ratio']=p.assets_current/(p.liabilities_current.abs()+eps); p['cash_to_cl']=p.cash/(p.liabilities_current.abs()+eps)
 p['liab_to_assets']=p.liabilities/(p.assets.abs()+eps); p['equity_to_assets']=p.equity/(p.assets.abs()+eps)
 p['debt_to_assets']=(p.debt_current.fillna(0)+p.debt_noncurrent.fillna(0))/(p.assets.abs()+eps)
 p['op_margin']=p.op_income/(p.revenue.abs()+eps); p['cfo_to_assets']=p.cfo/(p.assets.abs()+eps)
 clip=lambda x:np.clip(x,0,1)
 p['a_liquidity']=clip((p.current_ratio-.50)/1.50); p['a_cash']=clip(p.cash_to_cl/.50); p['a_solvency']=clip(1-(p.liab_to_assets-.40)/.80)
 p['a_equity']=clip((p.equity_to_assets+.25)/.75); p['a_debt']=clip(1-(p.debt_to_assets-.10)/.80); p['a_operations']=clip((p.op_margin+.20)/.40); p['a_cashflow']=clip((p.cfo_to_assets+.05)/.15)
 p['dims_observed']=p[A_COLS].notna().sum(axis=1)
 p['imi_level']=(p[A_COLS].lt(.333)&p[A_COLS].notna()).sum(axis=1).astype(float); p.loc[p.dims_observed<4,'imi_level']=np.nan
 vals=p[A_COLS].to_numpy(float)
 vds=[]; eff=[]; mass=[]
 for row,n in zip(vals,p.dims_observed):
  z=row[np.isfinite(row)]
  if len(z)<4: vds.append(np.nan);eff.append(np.nan);mass.append(np.nan);continue
  s=float(z.sum()); ss=float(np.square(z).sum()); m=float(z.mean())
  e=(s*s/ss) if ss>1e-12 else 0.0
  div=e/len(z)
  vds.append(m*div); eff.append(e); mass.append(m)
 p['capacity_mass']=mass;p['effective_routes']=eff;p['vds']=vds
 p['contraction']=-p.vds.diff();p['acceleration']=p.contraction.diff()
 p['dynamic_risk']=(1-p.vds)+p.contraction.clip(lower=0).fillna(0)+0.5*p.acceleration.clip(lower=0).fillna(0)
 p['conventional_warning']=((p.current_ratio<1)|(p.equity_to_assets<0)|(p.op_margin<0)).astype(float)
 return p

def build(c):
 cf=req_json(BASE.format(cik=c['cik'])); ss={k:series(cf,k) for k in TAGS}; idx=sorted(set().union(*[set(s.index) for s in ss.values() if len(s)]))
 if not idx:return pd.DataFrame()
 p=pd.DataFrame(index=pd.DatetimeIndex(idx))
 for k,s in ss.items():p[k]=s.reindex(p.index)
 p=map_state(p.sort_index()); p=p[p.index<=pd.Timestamp('2025-12-31')].copy();term=pd.Timestamp(c['terminal']) if c['terminal'] else pd.NaT
 if c['group']=='failure':p=p[p.index<term]
 p['company']=c['name'];p['group']=c['group'];p['terminal']=term
 if c['group']=='failure':p['quarters_to_terminal']=((term-p.index).days/91.3125);p['terminal_within_4q']=(p.quarters_to_terminal<=4.5).astype(int)
 else:p['quarters_to_terminal']=np.nan;p['terminal_within_4q']=0
 return p.reset_index(names='quarter')

def auc(y,s):
 y=np.asarray(y,int);s=np.asarray(s,float);ok=np.isfinite(s);y=y[ok];s=s[ok];npos=int(y.sum());nneg=len(y)-npos
 if npos==0 or nneg==0:return None
 ranks=pd.Series(s).rank(method='average').to_numpy();return float((ranks[y==1].sum()-npos*(npos+1)/2)/(npos*nneg))
def calibrate(d):
 z=d.dropna(subset=['vds']).copy();qs=sorted(set(np.quantile(z.vds,np.arange(.1,1,.1)).tolist()));out=[]
 for k in qs:
  lo=z[z.vds<=k];hi=z[z.vds>k]
  if len(lo)<8 or len(hi)<8:continue
  pl=float(lo.terminal_within_4q.mean());ph=float(hi.terminal_within_4q.mean());rr=(pl+.02)/(ph+.02)
  out.append({'cutoff':float(k),'n_low':len(lo),'n_high':len(hi),'p4_low':pl,'p4_high':ph,'smoothed_rr':rr})
 return max(out,key=lambda x:x['smoothed_rr']) if out else None,out
def first_below(g,k):
 z=g[g.vds<=k];return None if z.empty else z.quarter.min()
def persistent_below(g,k):
 a=(g.sort_values('quarter').vds<=k).astype(int).to_numpy();return bool(np.any((a[:-1]+a[1:])==2)) if len(a)>1 else False
def reversible(g,k):
 g=g.sort_values('quarter').reset_index(drop=True);hits=[]
 for i,r in g.iterrows():
  if r.vds<=k:
   fut=g.iloc[i+1:i+5];hits.append(bool(len(fut) and (fut.vds>k).any()))
 return None if not hits else float(np.mean(hits))

def main():
 errors=[];cal=[];con=[]
 for stage,cases,sink in [('calibration',CALIB,cal),('confirmation',CONFIRM,con)]:
  for c in cases:
   try:
    p=build(c);print(stage.upper(),c['name'],c['group'],'ROWS',len(p),flush=True)
    if len(p):sink.append(p)
   except Exception as e:errors.append({'stage':stage,'company':c['name'],'error':repr(e)});print('ERROR',stage,c['name'],repr(e),flush=True)
 findings={'design':'IMI viable decision-space test v1','errors':errors,'formula':'VDS = mean availability * normalized inverse-Simpson effective route count'}
 if not cal or not con:
  findings['verdict']='UNEVALUABLE'
 else:
  cd=pd.concat(cal,ignore_index=True).sort_values(['company','quarter']); cutoff,scan=calibrate(cd); findings['calibration_scan']=scan;findings['frozen_vds_cutoff']=cutoff
  d=pd.concat(con,ignore_index=True).sort_values(['company','quarter']);u=d.dropna(subset=['vds','imi_level']).copy();counts=u.groupby(['group','company']).size().reset_index(name='n');elig=counts[counts.n>=12];ne=elig.groupby('group').size().to_dict();A=bool(cutoff and ne.get('failure',0)>=3 and ne.get('survivor',0)>=2 and ne.get('healthy',0)>=2)
  findings['confirmation_usable_counts']=counts.to_dict('records');findings['eligible_counts']=ne
  if not A:
   findings['criteria']={'A_evaluable':False};findings['verdict']='UNEVALUABLE'
  else:
   k=float(cutoff['cutoff']);fail=u[u.group=='failure'];surv=u[u.group=='survivor'];healthy=u[u.group=='healthy']
   frows=[]
   for name,g in fail.groupby('company'):
    g=g.sort_values('quarter');x=first_below(g,k);term=g.terminal.iloc[0]
    frows.append({'company':name,'first_below':None if x is None else str(x.date()),'crossed':x is not None,'within_8q':bool(x is not None and (term-x).days/91.3125<=8.5),'lead_months':None if x is None else float((term-x).days/30.4375)})
   B=bool(len(frows)>=3 and all(x['crossed'] for x in frows) and sum(x['within_8q'] for x in frows)>=2)
   hrows=[{'company':name,'persistent_below':persistent_below(g,k),'prevalence':float((g.vds<=k).mean())} for name,g in healthy.groupby('company')];hp=float((healthy.vds<=k).mean());C=bool(hp<=.10 and all(not x['persistent_below'] for x in hrows))
   srows=[]
   for name,g in surv.groupby('company'):
    hit=bool((g.vds<=k).any());rev=reversible(g,k);ok=(not hit) or (rev is not None and rev>0);srows.append({'company':name,'ever_below':hit,'reversibility_4q':rev,'passes':bool(ok)})
   D=bool(sum(x['passes'] for x in srows)>=2)
   y=u.terminal_within_4q.to_numpy();auc_v=auc(y,1-u.vds.to_numpy());auc_i=auc(y,u.imi_level.to_numpy());auc_d=auc(y,u.dynamic_risk.to_numpy())
   E=bool(auc_v is not None and auc_i is not None and auc_v-auc_i>=.03);F=bool(auc_d is not None and auc_v is not None and auc_i is not None and auc_d-auc_v>=.02 and auc_d-auc_i>=.05)
   low=u[u.vds<=k];high=u[u.vds>k];pl=float(low.terminal_within_4q.mean()) if len(low) else np.nan;ph=float(high.terminal_within_4q.mean()) if len(high) else np.nan;rr=(pl+.01)/(ph+.01) if np.isfinite(pl) and np.isfinite(ph) else np.nan;G=bool(np.isfinite(rr) and rr>=3 and pl-ph>=.10)
   criteria={'A_evaluable':A,'B_failure_reachability':B,'C_healthy_specificity':C,'D_survivor_reversibility':D,'E_vds_beats_integer_imi':E,'F_dynamic_utility':F,'G_threshold_severity':G}
   findings.update({'failure_results':frows,'healthy_results':hrows,'healthy_below_prevalence':hp,'survivor_results':srows,'auc':{'static_vds':auc_v,'integer_imi':auc_i,'dynamic_vds':auc_d},'threshold_confirmation':{'p4_below':pl,'p4_above':ph,'smoothed_rr':rr,'n_below':int(len(low)),'n_above':int(len(high))},'criteria':criteria,'verdict':'VDS_CONFIRMED' if all(criteria.values()) else 'FAIL'})
  cd.to_csv('imi_vds_calibration_panel_v1.csv',index=False);d.to_csv('imi_vds_confirmation_panel_v1.csv',index=False)
 Path('imi_viable_decision_space_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str));Path('IMI_VIABLE_DECISION_SPACE_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str));print(json.dumps(findings,indent=2,default=str),flush=True)
if __name__=='__main__':main()
