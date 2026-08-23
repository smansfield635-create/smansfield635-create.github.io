#!/usr/bin/env python3
import io, json, math, os, re, hashlib, warnings
from urllib.parse import quote
import numpy as np
import pandas as pd
import requests
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score
from lightgbm import LGBMClassifier
warnings.filterwarnings('ignore')

BASE='https://raw.githubusercontent.com/joshevanbarker/Call_Report_Data_Project/main/FFIEC%20CDR%20Call%20Data/'
YEARS=[2019,2020,2021,2022,2023]
GEOM=['joint_upside_q90','safe_transition_fraction','positive_reachable_room_q90','transition_dispersion','direction_entropy','downside_q10']
DOM=['capital','asset_quality','earnings','liquidity']
STATE=DOM+['log_assets','loan_output']
SUCCESS={'min_rel_brier_improvement':0.05,'min_year_win_fraction_strictly_gt':0.5,'min_auroc_delta':-0.002}

# Frozen before outcome acquisition in this execution.
PROTOCOL={
 'primary_horizon_quarters':8,
 'evaluation_years':[2022,2023],
 'geometry':'six unchanged empirical admissible-transition summaries from prior similar states',
 'neighbor_k':50,
 'challenger':'103-feature conventional state/history model',
 'learner':'LightGBM 180 trees, lr=.05, 31 leaves, seed=256',
 'success_rule':SUCCESS,
 'missingness':'complete-case; no outcome-informed imputation or threshold tuning'
}
open('post2020_final_protocol.json','w').write(json.dumps(PROTOCOL,indent=2))

def get_file(year,half):
    name=f'FFIEC CDR Call Subset of Schedules {year}({half} of 2).txt'
    url=BASE+name.replace(' ','%20')
    r=requests.get(url,timeout=180); r.raise_for_status()
    return pd.read_csv(io.BytesIO(r.content),sep='\t',dtype=str,low_memory=False)

def numeric(s): return pd.to_numeric(s,errors='coerce')
def coalesce(df,cands):
    out=pd.Series(np.nan,index=df.index,dtype=float)
    for c in cands:
        if c in df: out=out.fillna(numeric(df[c]))
    return out

def load_panel():
    rows=[]
    for y in YEARS:
        a,b=get_file(y,1),get_file(y,2)
        # description row is first row in each annual file
        a=a.iloc[1:].copy(); b=b.iloc[1:].copy()
        keys=[c for c in ['ID_RSSD','AS_OF_DT'] if c in a.columns and c in b.columns]
        if len(keys)<2: raise RuntimeError(f'identity keys unavailable {y}: {keys}')
        keep_b=keys+[c for c in ['RIAD4340','RIAD4300'] if c in b.columns]
        m=a.merge(b[keep_b],on=keys,how='left',suffixes=('','_b'))
        m['year_source']=y
        rows.append(m)
    d=pd.concat(rows,ignore_index=True)
    d['date']=pd.to_datetime(d['AS_OF_DT'],errors='coerce')
    d['id']=pd.to_numeric(d['ID_RSSD'],errors='coerce').astype('Int64')
    certcol='FDIC_CERTIFICATE' if 'FDIC_CERTIFICATE' in d else None
    d['cert']=pd.to_numeric(d[certcol],errors='coerce').astype('Int64') if certcol else pd.Series(pd.NA,index=d.index,dtype='Int64')
    d['assets']=coalesce(d,['RCFD2170','RCON2170'])
    d['equity']=coalesce(d,['RCFD3210','RCON3210'])
    d['deposits']=coalesce(d,['RCFN2200','RCON2200','RCFD2200'])
    # 2122 is loans/leases net of unearned income and allowance in this CDR subset when available.
    d['loans']=coalesce(d,['RCFD2122','RCON2122','RCFD2125','RCON2125'])
    d['nonaccrual']=coalesce(d,['RCFD1403','RCON1403']).fillna(0)
    d['pd90']=coalesce(d,['RCFD1407','RCON1407']).fillna(0)
    d['net_income']=coalesce(d,['RIAD4340','RIAD4300'])
    # If 2122 is absent in a filing type, use deposits-scaled loan proxy only where 2125 exists; otherwise invalid.
    d=d.dropna(subset=['id','date','assets','equity','deposits','loans','net_income']).copy()
    d=d[(d.assets>0)&(d.deposits>0)&(d.loans>0)].copy()
    d=d.sort_values(['id','date']).drop_duplicates(['id','date'],keep='last')
    # raw health quantities, then contemporaneous ranks to preserve regime-relative realization.
    d['capital_raw']=d.equity/d.assets
    d['aq_bad_raw']=(d.nonaccrual+d.pd90)/d.loans
    d['earnings_raw']=d.net_income/d.assets
    d['liq_bad_raw']=d.loans/d.deposits
    d['log_assets']=np.log(d.assets.clip(lower=1))
    d['loan_output']=d.loans/d.assets
    for dt,gix in d.groupby('date').groups.items():
        idx=list(gix)
        d.loc[idx,'capital']=d.loc[idx,'capital_raw'].rank(pct=True,method='average')
        d.loc[idx,'asset_quality']=1-d.loc[idx,'aq_bad_raw'].rank(pct=True,method='average')
        d.loc[idx,'earnings']=d.loc[idx,'earnings_raw'].rank(pct=True,method='average')
        d.loc[idx,'liquidity']=1-d.loc[idx,'liq_bad_raw'].rank(pct=True,method='average')
    d['wmi']=d[DOM].min(axis=1)
    return d.reset_index(drop=True)

def add_history(d):
    d=d.sort_values(['id','date']).copy(); g=d.groupby('id',group_keys=False)
    feats=[]
    # current 6
    feats += STATE
    # exact lags
    for lag in [1,2,4,8]:
        for c in STATE:
            n=f'{c}_lag{lag}'; d[n]=g[c].shift(lag); feats.append(n)
    # changes
    for lag in [1,2,4]:
        for c in STATE:
            n=f'{c}_chg{lag}'; d[n]=d[c]-g[c].shift(lag); feats.append(n)
    # slopes over 4 observations and local acceleration
    for c in STATE:
        n=f'{c}_slope4'; d[n]=(d[c]-g[c].shift(3))/3.0; feats.append(n)
    for c in STATE:
        n=f'{c}_accel'; d[n]=(d[c]-g[c].shift(1))-(g[c].shift(1)-g[c].shift(2)); feats.append(n)
    # 4q rolling stats
    for c in STATE:
        roll=g[c].rolling(4,min_periods=4)
        for stat,ser in [('min4',roll.min()),('max4',roll.max()),('std4',roll.std())]:
            n=f'{c}_{stat}'; d[n]=ser.reset_index(level=0,drop=True); feats.append(n)
        n=f'{c}_draw4'; d[n]=d[c]-d[f'{c}_max4']; feats.append(n)
    # weakest-factor conventional history
    feats.append('wmi')
    for lag in [1,2,4,8]:
        n=f'wmi_lag{lag}'; d[n]=g['wmi'].shift(lag); feats.append(n)
    for lag in [1,2,4]:
        n=f'wmi_chg{lag}'; d[n]=d.wmi-g['wmi'].shift(lag); feats.append(n)
    roll=g['wmi'].rolling(4,min_periods=4)
    for stat,ser in [('min4',roll.min()),('max4',roll.max()),('std4',roll.std())]:
        n=f'wmi_{stat}'; d[n]=ser.reset_index(level=0,drop=True); feats.append(n)
    d['wmi_draw4']=d.wmi-d.wmi_max4; feats.append('wmi_draw4')
    # expanding institution summaries, shifted to prior history
    for c in STATE+['wmi']:
        ex=g[c].expanding(min_periods=4)
        for stat,ser in [('expmean',ex.mean()),('expmin',ex.min()),('expstd',ex.std())]:
            n=f'{c}_{stat}'; d[n]=ser.reset_index(level=0,drop=True); d[n]=g[n].shift(1); feats.append(n)
    # deterministic exact 103-feature challenger: stable ordered truncation after all declared classes exist.
    # The declaration above is outcome-blind; if >103, keep first 103. If <103, fail.
    if len(feats)<103: raise RuntimeError(f'only {len(feats)} history features')
    return d,feats[:103]

def transitions(d):
    d=d.sort_values(['id','date']).copy(); g=d.groupby('id',group_keys=False)
    for c in DOM:
        d[f'd_{c}']=g[c].shift(-1)-d[c]
    d['next_date']=g['date'].shift(-1)
    # exact adjacent quarter only (80-100d)
    gap=(d.next_date-d.date).dt.days
    return d[(gap>=80)&(gap<=100)&d[[f'd_{c}' for c in DOM]].notna().all(axis=1)].copy()

def entropy_sign(delta):
    bits=(delta>=0).astype(int)
    codes=bits[:,0]*8+bits[:,1]*4+bits[:,2]*2+bits[:,3]
    cnt=np.bincount(codes,minlength=16); p=cnt[cnt>0]/cnt.sum()
    return float(-(p*np.log(p)).sum())

def add_geometry(d):
    tr=transitions(d)
    out=[]
    dates=sorted(d.date.unique())
    for dt in dates:
        targets=d[d.date==dt]
        prior=tr[tr.date<dt].dropna(subset=STATE)
        if len(prior)<100 or targets.empty: continue
        X=prior[STATE].to_numpy(float); T=targets[STATE].to_numpy(float)
        mu=np.nanmean(X,axis=0); sd=np.nanstd(X,axis=0); sd[sd==0]=1
        Xz=(X-mu)/sd; Tz=(T-mu)/sd
        k=min(50,len(prior))
        nn=NearestNeighbors(n_neighbors=k,algorithm='auto').fit(Xz)
        _,ix=nn.kneighbors(Tz)
        deltas=prior[[f'd_{c}' for c in DOM]].to_numpy(float)
        for row_i, neigh in zip(targets.index,ix):
            z=deltas[neigh]
            mn=z.min(axis=1)
            pos=np.linalg.norm(np.maximum(z,0),axis=1)
            worst=z.min(axis=1)
            cov=np.cov(z,rowvar=False) if len(z)>1 else np.zeros((4,4))
            out.append((row_i,
                float(np.quantile(mn,.90)),
                float(np.mean((z>=-.05).all(axis=1))),
                float(np.quantile(pos,.90)),
                float(np.sqrt(max(0,np.trace(cov)))),
                entropy_sign(z),
                float(np.quantile(worst,.10))))
    gd=pd.DataFrame(out,columns=['idx']+GEOM).set_index('idx')
    return d.join(gd)

def failure_table():
    # Official FDIC BankFind HTML, fixed 2020-2025 window. Outcome is opened only after protocol file is written.
    url=('https://banks.data.fdic.gov/explore/failures?aggReport=detail&displayFields='
         'NAME%2CCERT%2CFAILDATE&startFailYear=2020&endFailYear=2025&sortField=FAILDATE&sortOrder=asc')
    r=requests.get(url,timeout=120); r.raise_for_status()
    tabs=pd.read_html(io.StringIO(r.text))
    f=None
    for t in tabs:
        cols=[str(c).upper() for c in t.columns]
        if any('CERT' in c for c in cols) and any('FAIL' in c or 'EFFECTIVE' in c for c in cols): f=t; break
    if f is None:
        # exact official records copied from the FDIC BankFind result surface; no model-performance contingency.
        rec=[
          (15426,'2020-10-23'),(16748,'2020-10-16'),(14361,'2020-04-03'),(18265,'2020-02-14'),
          (24735,'2023-03-10'),(57053,'2023-03-12'),(59017,'2023-05-01'),(25851,'2023-07-28'),(8758,'2023-11-03'),
          (27332,'2024-04-26'),(4134,'2024-10-18'),(28611,'2025-01-17'),(5520,'2025-06-27')]
        return pd.DataFrame(rec,columns=['cert','faildate']).assign(faildate=lambda x:pd.to_datetime(x.faildate))
    certc=[c for c in f.columns if 'CERT' in str(c).upper()][0]
    datec=[c for c in f.columns if 'FAIL' in str(c).upper() or 'EFFECTIVE' in str(c).upper()][0]
    q=pd.DataFrame({'cert':pd.to_numeric(f[certc],errors='coerce'),'faildate':pd.to_datetime(f[datec],errors='coerce')}).dropna()
    return q

def label(d,f):
    fmap=f.groupby('cert').faildate.min().to_dict()
    y=[]
    for cert,dt in zip(d.cert,d.date):
        fd=fmap.get(int(cert)) if pd.notna(cert) else None
        y.append(int(fd is not None and fd>dt and fd<=dt+pd.Timedelta(days=730)))
    d['failure8q']=y
    # observations need full outcome horizon visible through 2025-12-31
    d=d[d.date<=pd.Timestamp('2023-12-31')].copy()
    return d

def fit_eval(d,features):
    rows=[]; preds=[]
    for yr in [2022,2023]:
        test=d[(d.date.dt.year==yr)].dropna(subset=features+GEOM+['failure8q'])
        cutoff=pd.Timestamp(f'{yr}-01-01')
        # label maturity: report date +730d must precede cutoff
        train=d[(d.date+pd.Timedelta(days=730)<cutoff)].dropna(subset=features+GEOM+['failure8q'])
        if len(test)<100 or train.failure8q.nunique()<2 or test.failure8q.nunique()<2:
            rows.append({'year':yr,'status':'UNEVALUABLE','n_train':len(train),'train_events':int(train.failure8q.sum()),'n_test':len(test),'test_events':int(test.failure8q.sum())})
            continue
        kw=dict(n_estimators=180,learning_rate=.05,num_leaves=31,random_state=256,verbosity=-1,n_jobs=2)
        m0=LGBMClassifier(**kw); m1=LGBMClassifier(**kw)
        m0.fit(train[features],train.failure8q); m1.fit(train[features+GEOM],train.failure8q)
        p0=m0.predict_proba(test[features])[:,1]; p1=m1.predict_proba(test[features+GEOM])[:,1]
        for ix,a,b in zip(test.index,p0,p1): preds.append((ix,yr,int(test.loc[ix,'failure8q']),a,b))
        b0=brier_score_loss(test.failure8q,p0); b1=brier_score_loss(test.failure8q,p1)
        rows.append({'year':yr,'status':'VALID','n_train':len(train),'train_events':int(train.failure8q.sum()),'n_test':len(test),'test_events':int(test.failure8q.sum()),
          'brier_history':b0,'brier_aug':b1,'rel_brier_improvement':(b0-b1)/b0,
          'auroc_history':roc_auc_score(test.failure8q,p0),'auroc_aug':roc_auc_score(test.failure8q,p1),
          'ap_history':average_precision_score(test.failure8q,p0),'ap_aug':average_precision_score(test.failure8q,p1)})
    met=pd.DataFrame(rows); pr=pd.DataFrame(preds,columns=['idx','year','y','p_history','p_aug'])
    if pr.empty:
        return met,pr,{'status':'UNEVALUABLE','reason':'No held-out year had both outcome classes with mature leakage-purged training.'}
    b0=brier_score_loss(pr.y,pr.p_history); b1=brier_score_loss(pr.y,pr.p_aug)
    au0=roc_auc_score(pr.y,pr.p_history); au1=roc_auc_score(pr.y,pr.p_aug)
    ap0=average_precision_score(pr.y,pr.p_history); ap1=average_precision_score(pr.y,pr.p_aug)
    valid=met[met.status=='VALID']
    wins=int((valid.brier_aug<valid.brier_history).sum()); years=len(valid)
    rel=(b0-b1)/b0; aud=au1-au0
    passed=(rel>=.05 and wins>years/2 and aud>=-.002)
    pooled={'status':'PASS' if passed else 'FAIL','n':len(pr),'events':int(pr.y.sum()),'brier_history':b0,'brier_aug':b1,'rel_brier_improvement':rel,
            'annual_brier_wins':wins,'valid_years':years,'auroc_history':au0,'auroc_aug':au1,'auroc_delta':aud,
            'ap_history':ap0,'ap_aug':ap1,'ap_delta':ap1-ap0,'success_rule':SUCCESS}
    return met,pr,pooled

def main():
    d=load_panel(); source_rows=len(d)
    d,features=add_history(d)
    d=add_geometry(d)
    f=failure_table(); d=label(d,f)
    met,pr,pooled=fit_eval(d,features)
    met.to_csv('post2020_year_metrics.csv',index=False); pr.to_csv('post2020_predictions.csv',index=False)
    finding={'protocol':PROTOCOL,'source_rows_after_core_qc':source_rows,'panel_rows_after_history_geometry':int(len(d)),
             'geometry_complete_rows':int(d[GEOM].notna().all(axis=1).sum()),'failure_records_2020_2025':int(len(f)),
             'challenger_feature_count':len(features),'challenger_features':features,'annual':met.to_dict(orient='records'),'pooled':pooled}
    open('post2020_final_findings.json','w').write(json.dumps(finding,indent=2,default=str))
    verdict=pooled.get('status','UNEVALUABLE')
    text=f'''IMI v3 POST-2020 INDEPENDENT TEMPORAL MANEUVERABILITY REPLICATION — FINAL FINDINGS\n\nSTATUS: {verdict}\n\nThis execution used an independently sourced 2019-2023 FFIEC Call Report reconstruction, official FDIC failure outcomes, the frozen six-feature empirical admissible-transition geometry, a fixed 103-feature conventional state/history challenger, leakage-purged 8-quarter label maturity, and deterministic LightGBM.\n\nPooled result:\n{json.dumps(pooled,indent=2)}\n\nAnnual result:\n{met.to_string(index=False)}\n\nInterpretation rule: PASS requires >=5% pooled Brier improvement, Brier wins in more than half of valid held-out years, and AUROC delta >= -0.002. UNEVALUABLE is not converted into success or failure. No threshold or feature redesign is permitted after this result.\n'''
    open('POST2020_FINAL_VERDICT.txt','w').write(text)
    print(text)
if __name__=='__main__': main()
