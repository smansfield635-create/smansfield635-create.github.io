#!/usr/bin/env python3
import importlib.util, json, math
from pathlib import Path
import numpy as np
import pandas as pd
from lightgbm import LGBMClassifier
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score

ROOT=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wwv1',ROOT/'wastewater_safe_envelope_adversarial_v1.py')
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
mod.STATES=['KS','OR','TX']
SEED=20260826
RNG=np.random.default_rng(SEED)

SEQ_COLS=['max_util','mean_util','q90_util','near80_frac','near90_frac']
H_COLS=['pos_path12','recovery_path12','total_variation12','turn_count12','longest_high_run12','excursion_count12','ordered_area12','prior_peak_gap','full_pos_rate','full_recovery_rate','full_turn_rate','full_excursion_rate']


def _slope(v):
    v=np.asarray(v,float)
    if len(v)<2 or not np.all(np.isfinite(v)): return np.nan
    return float(np.polyfit(np.arange(len(v),dtype=float),v,1)[0])


def _longest_run(a):
    best=cur=0
    for z in a:
        if z: cur+=1; best=max(best,cur)
        else: cur=0
    return float(best)


def _path_features(v):
    v=np.asarray(v,float)
    v=v[np.isfinite(v)]
    if len(v)<2:
        return {k:np.nan for k in H_COLS}
    w=v[-12:]
    d=np.diff(w)
    pos=float(np.maximum(d,0).sum())
    rec=float(np.maximum(-d,0).sum())
    signs=np.sign(d[np.abs(d)>1e-12]); turns=float(np.sum(signs[1:]!=signs[:-1])) if len(signs)>1 else 0.0
    hi=w>=.8
    excursions=float(np.sum((~hi[:-1]) & hi[1:])) if len(w)>1 else 0.0
    weights=np.arange(1,len(w)+1,dtype=float); weights/=weights.sum()
    ordered=float(np.sum(weights*w)-np.mean(w))
    all_d=np.diff(v); all_sign=np.sign(all_d[np.abs(all_d)>1e-12])
    all_turn=float(np.sum(all_sign[1:]!=all_sign[:-1])) if len(all_sign)>1 else 0.0
    all_hi=v>=.8; all_exc=float(np.sum((~all_hi[:-1])&all_hi[1:])) if len(v)>1 else 0.0
    denom=max(len(v)-1,1)
    return {
        'pos_path12':pos,'recovery_path12':rec,'total_variation12':float(np.abs(d).sum()),'turn_count12':turns,
        'longest_high_run12':_longest_run(hi),'excursion_count12':excursions,'ordered_area12':ordered,
        'prior_peak_gap':float(np.max(v[:-1])-v[-1]) if len(v)>1 else 0.0,
        'full_pos_rate':float(np.maximum(all_d,0).sum()/denom),'full_recovery_rate':float(np.maximum(-all_d,0).sum()/denom),
        'full_turn_rate':float(all_turn/denom),'full_excursion_rate':float(all_exc/denom),
    }


def enrich(x):
    x=x.sort_values(['permit','month']).copy().reset_index(drop=True)
    gb=x.groupby('permit',group_keys=False)
    for c in SEQ_COLS:
        for k in range(1,13):
            name=f'{c}_lag{k}'
            if name not in x: x[name]=gb[c].shift(k)
        for win in [3,6,12]:
            x[f'{c}_slope{win}_strong']=gb[c].transform(lambda s: s.rolling(win,min_periods=win).apply(_slope,raw=True))
        for win in [6,12]:
            roll=gb[c].rolling(win,min_periods=win)
            x[f'{c}_rmean{win}']=roll.mean().reset_index(level=0,drop=True)
            x[f'{c}_rstd{win}']=roll.std(ddof=0).reset_index(level=0,drop=True)
            x[f'{c}_rmin{win}']=roll.min().reset_index(level=0,drop=True)
            x[f'{c}_rmax{win}']=roll.max().reset_index(level=0,drop=True)
    x['obs_age']=gb.cumcount().astype(float)+1.0
    x['cum_high80_prior']=gb['max_util'].transform(lambda s: (s.shift(1)>=.8).expanding().mean())
    x['cum_high90_prior']=gb['max_util'].transform(lambda s: (s.shift(1)>=.9).expanding().mean())
    x['cum_mean_util_prior']=gb['max_util'].transform(lambda s: s.shift(1).expanding().mean())
    feats=[]
    for _,d in x.groupby('permit',sort=False):
        vals=d['max_util'].to_numpy(float)
        hist=[]
        for i in range(len(vals)):
            hist.append(_path_features(vals[:i+1]))
        feats.extend(hist)
    hf=pd.DataFrame(feats,index=x.index)
    for c in H_COLS: x[c]=hf[c]
    x['R']=x['pos_path12']-.5*x['recovery_path12']+x['longest_high_run12']/12.0+x['excursion_count12']/12.0
    return x


def strong_cols(x):
    cols=list(mod.X)+list(mod.E)
    for c in SEQ_COLS:
        for k in range(1,13): cols.append(f'{c}_lag{k}')
        for win in [3,6,12]: cols.append(f'{c}_slope{win}_strong')
        for win in [6,12]:
            cols += [f'{c}_rmean{win}',f'{c}_rstd{win}',f'{c}_rmin{win}',f'{c}_rmax{win}']
    cols += ['obs_age','cum_high80_prior','cum_high90_prior','cum_mean_util_prior']
    return list(dict.fromkeys([c for c in cols if c in x.columns]))


def model():
    return LGBMClassifier(n_estimators=500,learning_rate=.025,num_leaves=15,min_child_samples=80,subsample=.9,colsample_bytree=.85,reg_lambda=10,reg_alpha=2,random_state=SEED,verbosity=-1)


def metrics(y,p):
    y=np.asarray(y,int); p=np.asarray(p,float)
    return {'n':int(len(y)),'events':int(y.sum()),'brier':float(brier_score_loss(y,p)),'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,'ap':float(average_precision_score(y,p)) if len(np.unique(y))>1 else None}


def fit_eval(train,test,ycol,bcols):
    tr=train[train[ycol].notna()].copy(); te=test[test[ycol].notna()].copy()
    a=model(); b=model(); a.fit(tr[bcols],tr[ycol].astype(int)); b.fit(tr[bcols+H_COLS],tr[ycol].astype(int))
    p0=a.predict_proba(te[bcols])[:,1]; p1=b.predict_proba(te[bcols+H_COLS])[:,1]
    m0=metrics(te[ycol],p0); m1=metrics(te[ycol],p1)
    rel=(m0['brier']-m1['brier'])/m0['brier'] if m0['brier']>0 else 0.0
    ad=float(m1['auroc']-m0['auroc']) if m0['auroc'] is not None else np.nan
    return te,m0,m1,float(rel),ad,p0,p1


def strata_frame(te,p0):
    z=pd.DataFrame(index=te.index)
    z['risk']=pd.qcut(pd.Series(p0,index=te.index),10,labels=False,duplicates='drop')
    z['cur']=pd.qcut(te['max_util'],5,labels=False,duplicates='drop')
    try:
        z['slp']=pd.qcut(te['max_util_slope6'],3,labels=False,duplicates='drop')
    except Exception:
        z['slp']=(te['max_util_slope6']>0).astype(int)
    for c in ['risk','cur','slp']:
        z[c]=z[c].map(lambda v: 'NA' if pd.isna(v) else str(v))
    z['key']=z['risk']+'|'+z['cur']+'|'+z['slp']
    return z


def conditional_residual_p(y,p0,p1,strata,nperm=10000):
    y=np.asarray(y,float); d=np.asarray(p1-p0,float); keys=strata['key'].to_numpy(); uniq=np.unique(keys)
    def stat(yy):
        num=den=0.0
        for k in uniq:
            ix=np.where(keys==k)[0]
            if len(ix)<8: continue
            dd=d[ix]-d[ix].mean(); yz=yy[ix]-yy[ix].mean(); num += len(ix)*float(np.mean(dd*yz)); den += len(ix)
        return num/max(den,1)
    obs=stat(y); ge=0
    for _ in range(nperm):
        yp=y.copy()
        for k in uniq:
            ix=np.where(keys==k)[0]
            yp[ix]=RNG.permutation(yp[ix])
        if stat(yp)>=obs-1e-15: ge+=1
    return float(obs),float((ge+1)/(nperm+1))


def matched_hysteresis_p(te,ycol,p0,strata,nperm=10000):
    y=te[ycol].to_numpy(float); r=te['R'].to_numpy(float); keys=strata['key'].to_numpy(); uniq=np.unique(keys)
    usable=[]
    for k in uniq:
        ix=np.where(keys==k)[0]
        ix=ix[np.isfinite(r[ix])]
        if len(ix)<12: continue
        med=np.median(r[ix]); hi=ix[r[ix]>med]; lo=ix[r[ix]<=med]
        if len(hi)<4 or len(lo)<4: continue
        usable.append((hi,lo))
    def stat(yy):
        num=den=0.0
        for hi,lo in usable:
            d=float(np.mean(yy[hi])-np.mean(yy[lo])); w=len(hi)+len(lo); num+=w*d; den+=w
        return num/max(den,1)
    obs=stat(y); ge=0
    for _ in range(nperm):
        yp=y.copy()
        for k in uniq:
            ix=np.where(keys==k)[0]; yp[ix]=RNG.permutation(yp[ix])
        if stat(yp)>=obs-1e-15: ge+=1
    nuse=int(sum(len(h)+len(l) for h,l in usable))
    return float(obs),float((ge+1)/(nperm+1)),nuse,len(usable)


def main():
    raw=[]
    for s in mod.STATES:
        for y in mod.YEARS: raw.append(mod.fetch_state_year(s,y))
    x=mod.agg_months(mod.prep_raw(pd.concat(raw,ignore_index=True)))
    x=enrich(x)
    x['Y1']=x['future1_viol']
    bcols=strong_cols(x)
    train=x[x.year<=2022].copy(); temporal=x[x.year>=2023].copy()
    train_transfer=x[(x.year<=2022)&x.STATE.isin(['KS','OR'])].copy(); transfer=x[(x.year>=2023)&(x.STATE=='TX')].copy()
    t3=temporal[temporal.Y.notna()]; t1=temporal[temporal.Y1.notna()]; tx3=transfer[transfer.Y.notna()]
    finite_r=int(np.isfinite(t3.R).sum()); distinct_r=int(t3.R.round(10).nunique())
    prelim=(len(t3)>=2000 and t3.Y.sum()>=100 and len(t1)>=2000 and t1.Y1.sum()>=50 and len(tx3)>=500 and tx3.Y.sum()>=30 and finite_r>=1000 and distinct_r>=50)
    findings={'evaluable_prelim':bool(prelim),'n_snapshots':int(len(x)),'base_feature_count':len(bcols),'history_feature_count':len(H_COLS),'temporal_y3_n':int(len(t3)),'temporal_y3_events':int(t3.Y.sum()),'temporal_y1_n':int(len(t1)),'temporal_y1_events':int(t1.Y1.sum()),'transfer_y3_n':int(len(tx3)),'transfer_y3_events':int(tx3.Y.sum()),'finite_R':finite_r,'distinct_R':distinct_r}
    if not prelim:
        findings['verdict']='UNEVALUABLE'
    else:
        te3,m30,m31,rel3,ad3,p30,p31=fit_eval(train,temporal,'Y',bcols)
        te1,m10,m11,rel1,ad1,p10,p11=fit_eval(train,temporal,'Y1',bcols)
        tet,mt0,mt1,relt,adt,pt0,pt1=fit_eval(train_transfer,transfer,'Y',bcols)
        strata=strata_frame(te3,p30)
        cres,cp=conditional_residual_p(te3.Y.to_numpy(),p30,p31,strata)
        hdiff,hp,nuse,nstr=matched_hysteresis_p(te3,'Y',p30,strata)
        evaluable=bool(nuse>=1000)
        criteria={
          'temporal_y3_brier_ge_5pct':bool(rel3>=.05),
          'temporal_y3_auroc_nonnegative':bool(ad3>=0),
          'conditional_residual_positive_p_lt_0_01':bool(cres>0 and cp<.01),
          'matched_hysteresis_positive_p_lt_0_01':bool(hdiff>0 and hp<.01),
          'temporal_y1_brier_improves_auroc_nonnegative':bool(rel1>0 and ad1>=0),
          'TX_transfer_y3_brier_improves_auroc_nonnegative':bool(relt>0 and adt>=0),
        }
        verdict='UNEVALUABLE' if not evaluable else ('PASS' if all(criteria.values()) else 'FAIL')
        findings.update({'evaluable':evaluable,'temporal_y3':{'base':m30,'aug':m31,'brier_rel_improve':rel3,'auroc_delta':ad3},'temporal_y1':{'base':m10,'aug':m11,'brier_rel_improve':rel1,'auroc_delta':ad1},'TX_transfer_y3':{'base':mt0,'aug':mt1,'brier_rel_improve':relt,'auroc_delta':adt},'conditional_residual_stat':cres,'conditional_residual_p':cp,'matched_hysteresis_event_diff':hdiff,'matched_hysteresis_p':hp,'matched_hysteresis_n':nuse,'matched_hysteresis_strata':nstr,'criteria':criteria,'verdict':verdict})
        out=te3[['permit','STATE','month','year','Y','max_util','max_util_slope6','R']].copy(); out['p_base']=p30; out['p_aug']=p31; out.to_csv('imi_trajectory_residue_temporal_predictions_v1.csv',index=False)
    Path('imi_trajectory_residue_markov_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_TRAJECTORY_RESIDUE_MARKOV_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    x.sample(min(20000,len(x)),random_state=SEED).to_csv('imi_trajectory_residue_snapshot_sample_v1.csv',index=False)
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
