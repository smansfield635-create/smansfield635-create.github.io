#!/usr/bin/env python3
import json,time
from pathlib import Path
import numpy as np
import pandas as pd
import requests

UA='IMI-route-entrenchment-research/1.0 research@example.com'
BASE='https://data.sec.gov/api/xbrl/companyfacts/CIK{cik:010d}.json'

CONFIRM=[
 {'name':'Bed Bath & Beyond','cik':886158,'group':'failure','terminal':'2023-04-23'},
 {'name':'Party City Holdco','cik':1592058,'group':'failure','terminal':'2023-01-17'},
 {'name':'Tuesday Morning','cik':878726,'group':'failure','terminal':'2023-02-14'},
 {'name':'Gap','cik':39911,'group':'survivor','terminal':None},
 {'name':'Best Buy','cik':764478,'group':'survivor','terminal':None},
 {'name':'Dicks Sporting Goods','cik':1089063,'group':'survivor','terminal':None},
 {'name':'Walmart','cik':104169,'group':'healthy','terminal':None},
 {'name':'Home Depot','cik':354950,'group':'healthy','terminal':None},
 {'name':'Costco','cik':909832,'group':'healthy','terminal':None},
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
 r=requests.get(url,headers={'User-Agent':UA,'Accept-Encoding':'gzip, deflate'},timeout=90)
 r.raise_for_status(); time.sleep(.12); return r.json()

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

def auc(y,s):
 y=np.asarray(y,int); s=np.asarray(s,float); ok=np.isfinite(s); y=y[ok]; s=s[ok]
 npos=int(y.sum()); nneg=len(y)-npos
 if npos==0 or nneg==0:return None
 ranks=pd.Series(s).rank(method='average').to_numpy()
 return float((ranks[y==1].sum()-npos*(npos+1)/2)/(npos*nneg))

def map_state(p):
 eps=1e-12; p=p.copy()
 p['current_ratio']=p.assets_current/(p.liabilities_current.abs()+eps)
 p['cash_to_cl']=p.cash/(p.liabilities_current.abs()+eps)
 p['liab_to_assets']=p.liabilities/(p.assets.abs()+eps)
 p['equity_to_assets']=p.equity/(p.assets.abs()+eps)
 p['debt_to_assets']=(p.debt_current.fillna(0)+p.debt_noncurrent.fillna(0))/(p.assets.abs()+eps)
 p['op_margin']=p.op_income/(p.revenue.abs()+eps)
 p['cfo_to_assets']=p.cfo/(p.assets.abs()+eps)
 clip=lambda x:np.clip(x,0,1)
 p['a_liquidity']=clip((p.current_ratio-.50)/1.50)
 p['a_cash']=clip(p.cash_to_cl/.50)
 p['a_solvency']=clip(1-(p.liab_to_assets-.40)/.80)
 p['a_equity']=clip((p.equity_to_assets+.25)/.75)
 p['a_debt']=clip(1-(p.debt_to_assets-.10)/.80)
 p['a_operations']=clip((p.op_margin+.20)/.40)
 p['a_cashflow']=clip((p.cfo_to_assets+.05)/.15)
 p['dims_observed']=p[A_COLS].notna().sum(axis=1)
 p['imi_level']=(p[A_COLS].lt(1/3)&p[A_COLS].notna()).sum(axis=1).astype(float)
 p.loc[p.dims_observed<4,'imi_level']=np.nan
 vals=p[A_COLS].to_numpy(float); vds=[]
 for row in vals:
  z=row[np.isfinite(row)]
  if len(z)<4:vds.append(np.nan);continue
  s=float(z.sum()); ss=float(np.square(z).sum()); m=float(z.mean()); e=(s*s/ss) if ss>1e-12 else 0.0
  vds.append(m*(e/len(z)))
 p['vds']=vds

 persistent_cols=[]
 for a in A_COLS:
  c=a.replace('a_','c_'); q=a.replace('a_','p_')
  z=pd.Series(np.where(p[a].notna(),(p[a]<(1/3)).astype(float),np.nan),index=p.index)
  cnt=z.rolling(4,min_periods=3).count(); sm=z.rolling(4,min_periods=3).sum()
  p[c]=z
  p[q]=np.where((cnt>=3)&p[a].notna(),(sm>=3).astype(float),np.nan)
  persistent_cols.append(q)

 p['persistent_observed']=p[persistent_cols].notna().sum(axis=1)
 p['persistent_count']=p[persistent_cols].fillna(0).sum(axis=1)
 p.loc[p.persistent_observed<4,'persistent_count']=np.nan
 p['persistent_fraction']=p.persistent_count/p.persistent_observed.replace(0,np.nan)
 k=p.persistent_count; n=p.persistent_observed
 p['pair_density']=np.where((n>=2)&k.notna(),(k*(k-1))/(n*(n-1)),np.nan)

 recovery_capacity=[]; recovery_deficit=[]
 for i in range(len(p)):
  if i==0:
   recovery_capacity.append(1.0); recovery_deficit.append(0.0); continue
  prev=p.iloc[i-1]; cur=p.iloc[i]; eligible=0; recovered=0
  for a,q in zip(A_COLS,persistent_cols):
   pv=prev[q]
   if pd.isna(pv) or pv<1: continue
   eligible+=1
   if i>=1 and pd.notna(cur[a]) and pd.notna(prev[a]) and cur[a]>=(1/3) and prev[a]>=(1/3): recovered+=1
  if eligible==0:
   rc=1.0; rd=0.0
  else:
   rc=recovered/eligible; rd=1-rc
  recovery_capacity.append(rc); recovery_deficit.append(rd)
 p['recovery_capacity']=recovery_capacity
 p['recovery_deficit']=recovery_deficit
 p['route_lock_score']=(p.persistent_fraction+p.pair_density+p.persistent_fraction*p.recovery_deficit)/3
 p['entrenched']=((p.persistent_count>=3)&(p.recovery_deficit>=.50)).astype(float)
 p.loc[p.persistent_count.isna(),'entrenched']=np.nan
 prev_ent=p.entrenched.shift(1)
 p['confirmed_entrenchment']=((p.entrenched==1)&(prev_ent==1)).astype(float)
 p.loc[p.entrenched.isna()|prev_ent.isna(),'confirmed_entrenchment']=np.nan
 return p

def build(c):
 cf=req_json(BASE.format(cik=c['cik']))
 ss={k:series(cf,k) for k in TAGS}
 idx=sorted(set().union(*[set(s.index) for s in ss.values() if len(s)]))
 if not idx:return pd.DataFrame()
 p=pd.DataFrame(index=pd.DatetimeIndex(idx))
 for k,s in ss.items():p[k]=s.reindex(p.index)
 p=map_state(p.sort_index())
 p=p[p.index<=pd.Timestamp('2025-12-31')].copy()
 term=pd.Timestamp(c['terminal']) if c['terminal'] else pd.NaT
 if c['group']=='failure':p=p[p.index<term]
 p['company']=c['name']; p['group']=c['group']; p['terminal']=term
 if c['group']=='failure':
  p['quarters_to_terminal']=(term-p.index).days/91.3125
  p['terminal_within_4q']=(p.quarters_to_terminal<=4.5).astype(int)
 else:
  p['quarters_to_terminal']=np.nan; p['terminal_within_4q']=0
 return p.reset_index(names='quarter')

def first_confirmed(g):
 z=g[g.confirmed_entrenchment==1]
 return None if z.empty else z.quarter.min()

def survivor_escape(g):
 g=g.sort_values('quarter').reset_index(drop=True)
 hits=list(g.index[g.confirmed_entrenchment==1])
 if not hits:return {'entered':False,'escaped':True,'escape_quarters':None}
 i=hits[0]
 for j in range(i+1,min(len(g),i+7)):
  if j>=1 and g.loc[j,'persistent_count']<=1 and g.loc[j-1,'persistent_count']<=1:
   return {'entered':True,'escaped':True,'escape_quarters':int(j-i)}
 return {'entered':True,'escaped':False,'escape_quarters':None}

def main():
 errors=[]; frames=[]
 for c in CONFIRM:
  try:
   p=build(c); print('CONFIRMATION',c['name'],c['group'],'ROWS',len(p),flush=True)
   if len(p):frames.append(p)
  except Exception as e:
   errors.append({'company':c['name'],'error':repr(e)}); print('ERROR',c['name'],repr(e),flush=True)
 findings={'design':'IMI route-entrenchment test v1','errors':errors,'frozen_state_rule':'confirmed entrenchment = two consecutive entrenched observed quarters; entrenched = persistent_count>=3 and recovery_deficit>=0.50'}
 if not frames:
  findings['verdict']='UNEVALUABLE'
 else:
  d=pd.concat(frames,ignore_index=True).sort_values(['company','quarter'])
  u=d.dropna(subset=['persistent_count','route_lock_score','imi_level','vds']).copy()
  counts=u.groupby(['group','company']).size().reset_index(name='n')
  elig=counts[counts.n>=12]; ne=elig.groupby('group').size().to_dict()
  A=bool(ne.get('failure',0)>=3 and ne.get('survivor',0)>=2 and ne.get('healthy',0)>=2)
  findings['usable_counts']=counts.to_dict('records'); findings['eligible_counts']=ne
  if not A:
   findings['criteria']={'A_evaluable':False}; findings['verdict']='UNEVALUABLE'
  else:
   fail=u[u.group=='failure']; surv=u[u.group=='survivor']; healthy=u[u.group=='healthy']
   frows=[]; leads=[]
   for name,g in fail.groupby('company'):
    x=first_confirmed(g); term=g.terminal.iloc[0]
    lead=None if x is None else float((term-x).days/91.3125)
    if lead is not None:leads.append(lead)
    frows.append({'company':name,'first_confirmed':None if x is None else str(x.date()),'crossed':x is not None,'lead_quarters':lead,'within_12_5q':bool(x is not None and lead<=12.5)})
   B=bool(len(frows)>=3 and all(x['crossed'] for x in frows) and sum(x['within_12_5q'] for x in frows)>=2)
   hrows=[]
   for name,g in healthy.groupby('company'):
    ever=bool((g.confirmed_entrenchment==1).any()); hrows.append({'company':name,'ever_confirmed_entrenchment':ever})
   C=bool(len(hrows)>=2 and all(not x['ever_confirmed_entrenchment'] for x in hrows))
   srows=[]
   for name,g in surv.groupby('company'):
    r=survivor_escape(g); r['company']=name; srows.append(r)
   D=bool(sum(x['escaped'] for x in srows)>=2)
   y=u.terminal_within_4q.to_numpy()
   auc_r=auc(y,u.route_lock_score.to_numpy()); auc_i=auc(y,u.imi_level.to_numpy()); auc_v=auc(y,1-u.vds.to_numpy())
   E=bool(auc_r is not None and auc_i is not None and auc_v is not None and auc_r-auc_i>=.03 and auc_r-auc_v>=.03)
   locked=u[u.confirmed_entrenchment==1]; open_=u[u.confirmed_entrenchment!=1]
   pl=float(locked.terminal_within_4q.mean()) if len(locked) else np.nan
   po=float(open_.terminal_within_4q.mean()) if len(open_) else np.nan
   rr=(pl+.01)/(po+.01) if np.isfinite(pl) and np.isfinite(po) else np.nan
   F=bool(np.isfinite(rr) and rr>=4 and pl-po>=.10)
   med=float(np.median(leads)) if leads else np.nan
   G=bool(np.isfinite(med) and med>=2 and med<=12.5)
   criteria={'A_evaluable':A,'B_failure_reachability':B,'C_healthy_specificity':C,'D_survivor_reversibility':D,'E_incremental_discrimination':E,'F_structural_severity':F,'G_temporal_localization':G}
   findings.update({'failure_results':frows,'healthy_results':hrows,'survivor_results':srows,'auc':{'route_lock_score':auc_r,'integer_imi':auc_i,'static_vds':auc_v},'structural_severity':{'p4_confirmed_entrenchment':pl,'p4_outside':po,'smoothed_rr':rr,'n_locked':int(len(locked)),'n_outside':int(len(open_))},'median_failure_lead_quarters':med,'criteria':criteria,'verdict':'ENTRENCHMENT_CONFIRMED' if all(criteria.values()) else 'FAIL'})
  d.to_csv('imi_route_entrenchment_confirmation_panel_v1.csv',index=False)
 Path('imi_route_entrenchment_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
 Path('IMI_ROUTE_ENTRENCHMENT_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
 print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__':main()
