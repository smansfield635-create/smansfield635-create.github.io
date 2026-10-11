#!/usr/bin/env python3
import io, json, math, zipfile, warnings
from pathlib import Path
import numpy as np
import pandas as pd
import requests
from lightgbm import LGBMClassifier
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score

warnings.filterwarnings('ignore')
SEED=20260822
RNG=np.random.default_rng(SEED)
STATES=['KS','OR','TN']
YEARS=list(range(2018,2026))
BASE='https://echo.epa.gov/files/echodownloads/NPDES_by_state_year/{s}_FY{y}_NPDES_DMRS_LIMITS.zip'

REQ=['EXTERNAL_PERMIT_NMBR','PERM_FEATURE_NMBR','PARAMETER_CODE','MONITORING_LOCATION_CODE','MONITORING_PERIOD_END_DATE','LIMIT_VALUE_STANDARD_UNITS','DMR_VALUE_STANDARD_UNITS','LIMIT_TYPE_CODE']
OPTIONAL=['STATISTICAL_BASE_CODE','VALUE_TYPE_CODE','STANDARD_UNIT_CODE','DMR_VALUE_QUALIFIER_CODE','NPDES_VIOLATION_ID','VIOLATION_CODE','EXCEEDANCE_PCT']


def fetch_state_year(s,y):
    url=BASE.format(s=s,y=y)
    r=requests.get(url,timeout=180,headers={'User-Agent':'Mozilla/5.0 wastewater-research/1.0'})
    r.raise_for_status()
    z=zipfile.ZipFile(io.BytesIO(r.content))
    chosen=None
    for name in z.namelist():
        if not name.lower().endswith('.csv'): continue
        with z.open(name) as fh:
            header=pd.read_csv(fh,nrows=0,encoding_errors='ignore').columns.tolist()
        if all(c in header for c in REQ):
            chosen=name; break
    if chosen is None:
        raise RuntimeError(f'No DMR CSV with required schema in {url}; files={z.namelist()[:10]}')
    usecols=lambda c: c in set(REQ+OPTIONAL)
    with z.open(chosen) as fh:
        df=pd.read_csv(fh,usecols=usecols,low_memory=False,encoding_errors='ignore')
    df['STATE']=s; df['FY']=y
    print('LOADED',s,y,len(df),chosen,flush=True)
    return df


def prep_raw(df):
    for c in OPTIONAL:
        if c not in df: df[c]=np.nan
    df['date']=pd.to_datetime(df['MONITORING_PERIOD_END_DATE'],errors='coerce')
    df['month']=df['date'].dt.to_period('M').dt.to_timestamp()
    df['limit']=pd.to_numeric(df['LIMIT_VALUE_STANDARD_UNITS'],errors='coerce')
    df['value']=pd.to_numeric(df['DMR_VALUE_STANDARD_UNITS'],errors='coerce')
    df=df[(df['LIMIT_TYPE_CODE'].astype(str).str.upper()=='ENF') & df['limit'].gt(0) & df['value'].notna() & df['month'].notna()].copy()
    q=df['DMR_VALUE_QUALIFIER_CODE'].astype(str).str.strip()
    df=df[~q.isin(['>','>='])].copy()
    df['util']=df['value']/df['limit']
    df=df[np.isfinite(df['util']) & (df['util']>=0) & (df['util']<100)].copy()
    df['viol']=((pd.to_numeric(df['EXCEEDANCE_PCT'],errors='coerce').fillna(0)>0) | df['NPDES_VIOLATION_ID'].notna() | df['VIOLATION_CODE'].notna() | (df['util']>1.0+1e-12)).astype(int)
    parts=['PERM_FEATURE_NMBR','PARAMETER_CODE','MONITORING_LOCATION_CODE','STATISTICAL_BASE_CODE','VALUE_TYPE_CODE','STANDARD_UNIT_CODE']
    for c in parts: df[c]=df[c].fillna('').astype(str)
    df['ckey']=df[parts].agg('|'.join,axis=1)
    keep=['EXTERNAL_PERMIT_NMBR','STATE','month','ckey','util','viol']
    df=df[keep].sort_values(['EXTERNAL_PERMIT_NMBR','ckey','month','util'])
    # conservative collapse: max utilization and any violation for duplicate constraint-month rows
    g=df.groupby(['EXTERNAL_PERMIT_NMBR','STATE','month','ckey'],as_index=False).agg(util=('util','max'),viol=('viol','max'))
    g=g.sort_values(['EXTERNAL_PERMIT_NMBR','ckey','month'])
    g['prev_util']=g.groupby(['EXTERNAL_PERMIT_NMBR','ckey'])['util'].shift(1)
    g['du']=g['util']-g['prev_util']
    g['cross80']=((g['prev_util']<.8)&(g['util']>=.8)).astype(float)
    g['recover80']=((g['prev_util']>=.8)&(g['util']<.8)).astype(float)
    return g


def entropy_norm(margins):
    x=np.clip(np.asarray(margins,float),0,None)
    if len(x)<=1 or x.sum()<=0:return 0.0
    p=x/x.sum(); h=-np.sum(p*np.log(np.clip(p,1e-15,None)))
    return float(h/np.log(len(x)))


def agg_months(g):
    rows=[]
    for (permit,state,month),d in g.groupby(['EXTERNAL_PERMIT_NMBR','STATE','month']):
        u=d['util'].to_numpy(float); m=1-u; du=d['du'].dropna().to_numpy(float)
        rows.append({
            'permit':permit,'STATE':state,'month':month,'current_viol':int(d['viol'].max()),
            'max_util':float(np.max(u)),'q90_util':float(np.quantile(u,.9)),'mean_util':float(np.mean(u)),'std_util':float(np.std(u)),
            'n_constraints':int(len(u)),'near80_frac':float(np.mean(u>=.8)),'near90_frac':float(np.mean(u>=.9)),
            'margin_q10':float(np.quantile(m,.1)),'margin_q25':float(np.quantile(m,.25)),'margin_entropy':entropy_norm(m),
            'n_matched':int(len(du)),'frac_worsening':float(np.mean(du>0)) if len(du) else np.nan,
            'frac_big_worsening':float(np.mean(du>=.10)) if len(du) else np.nan,
            'median_du':float(np.median(du)) if len(du) else np.nan,'max_du':float(np.max(du)) if len(du) else np.nan,'std_du':float(np.std(du)) if len(du) else np.nan,
            'cross80_frac':float(d.loc[d['du'].notna(),'cross80'].mean()) if len(du) else np.nan,
            'recover80_frac':float(d.loc[d['du'].notna(),'recover80'].mean()) if len(du) else np.nan,
        })
    x=pd.DataFrame(rows).sort_values(['permit','month']).reset_index(drop=True)
    # outcome: any violation in next 3 observed permit-months
    by=x.groupby('permit',group_keys=False)
    for k in [1,2,3]: x[f'future{k}_viol']=by['current_viol'].shift(-k)
    x['Y']=x[[f'future{k}_viol' for k in [1,2,3]]].max(axis=1,skipna=False)
    # current compliant only
    x=x[x['current_viol']==0].copy()
    # ordinary historical challenger lags
    lagcols=['max_util','q90_util','mean_util','std_util','near80_frac','near90_frac','n_constraints']
    for c in lagcols:
        for k in [1,2,3]: x[f'{c}_lag{k}']=x.groupby('permit')[c].shift(k)
    # six-observation slopes, past+current, using only history
    def slope6(s):
        a=s.to_numpy(float); n=len(a)
        out=np.full(n,np.nan)
        t=np.arange(6,dtype=float)
        for i in range(5,n):
            v=a[i-5:i+1]
            if np.all(np.isfinite(v)): out[i]=np.polyfit(t,v,1)[0]
        return pd.Series(out,index=s.index)
    for c in ['max_util','mean_util','near80_frac']:
        x[f'{c}_slope6']=x.groupby('permit',group_keys=False)[c].apply(slope6)
    x['month_num']=x['month'].dt.month.astype(int)
    x['year']=x['month'].dt.year.astype(int)
    x=x[x['Y'].notna()].copy(); x['Y']=x['Y'].astype(int)
    # conservative current compliance based on admitted rows; keep max_util <=1
    x=x[x['max_util']<=1.0+1e-12].copy()
    return x

X=['max_util','q90_util','mean_util','std_util','n_constraints','near80_frac','near90_frac','month_num']
for c in ['max_util','q90_util','mean_util','std_util','near80_frac','near90_frac','n_constraints']:
    for k in [1,2,3]: X.append(f'{c}_lag{k}')
X += ['max_util_slope6','mean_util_slope6','near80_frac_slope6']
E=['margin_q10','margin_q25','margin_entropy','n_matched','frac_worsening','frac_big_worsening','median_du','max_du','std_du','cross80_frac','recover80_frac']


def model():
    return LGBMClassifier(n_estimators=350,learning_rate=.03,num_leaves=15,min_child_samples=80,subsample=.9,colsample_bytree=.9,reg_lambda=8,reg_alpha=2,random_state=SEED,verbosity=-1)

def metrics(y,p):
    return {'n':int(len(y)),'events':int(np.sum(y)),'brier':float(brier_score_loss(y,p)),'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,'ap':float(average_precision_score(y,p)) if len(np.unique(y))>1 else None}

def fit_eval(train,test):
    a=model(); b=model(); a.fit(train[X],train.Y); b.fit(train[X+E],train.Y)
    p0=a.predict_proba(test[X])[:,1]; p1=b.predict_proba(test[X+E])[:,1]
    m0=metrics(test.Y.to_numpy(),p0); m1=metrics(test.Y.to_numpy(),p1)
    rel=(m0['brier']-m1['brier'])/m0['brier'] if m0['brier']>0 else 0
    return m0,m1,rel,float(m1['auroc']-m0['auroc']),p0,p1

def strat_perm(y,p0,p1,maxu,nperm=10000):
    d=p1-p0
    q0=pd.qcut(pd.Series(p0),10,labels=False,duplicates='drop')
    qu=pd.qcut(pd.Series(maxu),10,labels=False,duplicates='drop')
    strata=pd.Series(q0.astype(str)+'|'+qu.astype(str))
    # statistic: within-stratum covariance of augmentation increment and outcome
    def stat(yy):
        total=0.0; weight=0
        for s in strata.unique():
            ix=np.where(strata.to_numpy()==s)[0]
            if len(ix)<5: continue
            dd=d[ix]-np.mean(d[ix]); yz=yy[ix]-np.mean(yy[ix]); total+=len(ix)*float(np.mean(dd*yz)); weight+=len(ix)
        return total/max(weight,1)
    obs=stat(np.asarray(y,float)); ge=0
    y0=np.asarray(y,float)
    for _ in range(nperm):
        yp=y0.copy()
        for s in strata.unique():
            ix=np.where(strata.to_numpy()==s)[0]; yp[ix]=RNG.permutation(yp[ix])
        if stat(yp)>=obs-1e-15: ge+=1
    return float(obs),(ge+1)/(nperm+1)


def main():
    raw=[]
    for s in STATES:
        for y in YEARS:
            try: raw.append(fetch_state_year(s,y))
            except Exception as e:
                print('DOWNLOAD_FAIL',s,y,repr(e),flush=True); raise
    df=pd.concat(raw,ignore_index=True)
    g=prep_raw(df); x=agg_months(g)
    print('SNAPSHOTS',len(x),'EVENTS',int(x.Y.sum()),'STATES',x.STATE.value_counts().to_dict(),flush=True)
    train=x[x.year<=2022].copy(); temporal=x[x.year>=2023].copy()
    train_transfer=x[(x.year<=2022)&x.STATE.isin(['KS','OR'])].copy(); transfer=x[(x.year>=2023)&(x.STATE=='TN')].copy()
    evaluable=(len(temporal)>=2000 and temporal.Y.sum()>=100 and len(transfer)>=500 and transfer.Y.sum()>=30)
    findings={'evaluable':bool(evaluable),'n_snapshots':int(len(x)),'events':int(x.Y.sum()),'train_n':int(len(train)),'temporal_n':int(len(temporal)),'temporal_events':int(temporal.Y.sum()),'transfer_n':int(len(transfer)),'transfer_events':int(transfer.Y.sum())}
    if not evaluable:
        findings['verdict']='UNEVALUABLE'
    else:
        b0,b1,brel,bauc,p0,p1=fit_eval(train,temporal)
        t0,t1,trel,tauc,_,_=fit_eval(train_transfer,transfer)
        state_results={}
        all_state_wins=True
        for s in STATES:
            te=temporal[temporal.STATE==s]
            if len(te)<100 or te.Y.sum()<10:
                state_results[s]={'evaluable':False}; all_state_wins=False; continue
            m0,m1,rel,ad,_,_=fit_eval(train,te)
            state_results[s]={'evaluable':True,'base':m0,'aug':m1,'brier_rel_improve':rel,'auroc_delta':ad}
            all_state_wins &= (m1['brier']<m0['brier'])
        obs,pp=strat_perm(temporal.Y.to_numpy(),p0,p1,temporal.max_util.to_numpy())
        criteria={
            'temporal_brier_ge_5pct':bool(brel>=.05),
            'temporal_auroc_nonnegative':bool(bauc>=0),
            'transfer_brier_ge_5pct':bool(trel>=.05),
            'transfer_auroc_nonnegative':bool(tauc>=0),
            'all_state_brier_wins':bool(all_state_wins),
            'stratified_residual_positive_p_lt_0_01':bool(obs>0 and pp<.01),
        }
        findings.update({'temporal':{'base':b0,'aug':b1,'brier_rel_improve':brel,'auroc_delta':bauc},'transfer_TN':{'base':t0,'aug':t1,'brier_rel_improve':trel,'auroc_delta':tauc},'state_results':state_results,'stratified_residual_stat':obs,'stratified_residual_p':pp,'criteria':criteria,'verdict':'PASS' if all(criteria.values()) else 'FAIL'})
        out=temporal[['permit','STATE','month','year','Y','max_util']].copy(); out['p_base']=p0; out['p_aug']=p1; out.to_csv('wastewater_safe_envelope_temporal_predictions_v1.csv',index=False)
    Path('wastewater_safe_envelope_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('WASTEWATER_SAFE_ENVELOPE_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    x.sample(min(20000,len(x)),random_state=SEED).to_csv('wastewater_safe_envelope_snapshot_sample_v1.csv',index=False)
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
