#!/usr/bin/env python3
import importlib.util, json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score

ROOT=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('kill',ROOT/'imi_trajectory_residue_markov_kill_test_v1.py')
kill=importlib.util.module_from_spec(spec); spec.loader.exec_module(kill)
mod=kill.mod
SEED=20260827
RNG=np.random.default_rng(SEED)

A=['pos_path12','recovery_path12','full_pos_rate','full_recovery_rate']
P=['longest_high_run12','ordered_area12','turn_count12','full_turn_rate']
H=['prior_peak_gap','total_variation12','excursion_count12','full_excursion_rate']


def add_complements(x):
    x=x.copy()
    x['G_A_constraints']=x['pos_path12']*np.log1p(x['n_constraints'])
    x['G_P_near80']=x['longest_high_run12']*x['near80_frac']
    x['G_H_entropy']=x['prior_peak_gap']*x['margin_entropy']
    x['G_exc_near90']=x['excursion_count12']*x['near90_frac']
    x['S_recovery_headroom']=x['recovery_path12']*(1-x['max_util'])
    x['S_peakgap_headroom']=x['prior_peak_gap']*(1-x['max_util'])
    x['S_pressure_headroom']=x['longest_high_run12']*(1-x['max_util'])
    x['S_recovery_minus_current']=x['recovery_path12']-x['max_util']
    return x

G=['G_A_constraints','G_P_near80','G_H_entropy','G_exc_near90']
S=['S_recovery_headroom','S_peakgap_headroom','S_pressure_headroom','S_recovery_minus_current']
CHANNELS={'A':A,'P':P,'H':H,'G':G,'S':S}


def metrics(y,p):
    y=np.asarray(y,int); p=np.asarray(p,float)
    return {'n':int(len(y)),'events':int(y.sum()),'brier':float(brier_score_loss(y,p)),
            'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,
            'ap':float(average_precision_score(y,p)) if len(np.unique(y))>1 else None}


def fit_preds(train,test,ycol,cols):
    tr=train[train[ycol].notna()].copy(); te=test[test[ycol].notna()].copy()
    m=kill.model(); m.fit(tr[cols],tr[ycol].astype(int)); return te,m.predict_proba(te[cols])[:,1]


def strata(te,p0):
    z=pd.DataFrame(index=te.index)
    z['risk']=pd.qcut(pd.Series(p0,index=te.index),10,labels=False,duplicates='drop')
    z['cur']=pd.qcut(te['max_util'],5,labels=False,duplicates='drop')
    z['slp']=pd.qcut(te['max_util_slope6'],3,labels=False,duplicates='drop')
    for c in z.columns: z[c]=z[c].map(lambda v:'NA' if pd.isna(v) else str(v))
    z['key']=z['risk']+'|'+z['cur']+'|'+z['slp']; return z


def cond_p(y,p0,p1,st,nperm=5000):
    y=np.asarray(y,float); d=np.asarray(p1-p0,float); keys=st['key'].to_numpy(); uniq=np.unique(keys)
    def stat(yy):
        num=den=0.0
        for k in uniq:
            ix=np.where(keys==k)[0]
            if len(ix)<8: continue
            dd=d[ix]-d[ix].mean(); yz=yy[ix]-yy[ix].mean(); num+=len(ix)*float(np.mean(dd*yz)); den+=len(ix)
        return num/max(den,1)
    obs=stat(y); ge=0
    for _ in range(nperm):
        yp=y.copy()
        for k in uniq:
            ix=np.where(keys==k)[0]; yp[ix]=RNG.permutation(yp[ix])
        if stat(yp)>=obs-1e-15: ge+=1
    return float(obs),float((ge+1)/(nperm+1))


def holm(ps):
    names=list(ps); order=sorted(names,key=lambda k:ps[k]); out={}
    running=0.0; m=len(order)
    for i,k in enumerate(order):
        val=min(1.0,(m-i)*ps[k]); running=max(running,val); out[k]=running
    return out


def eval_channel(train,test,ycol,bcols,chcols,pbase,tebase):
    te,p=fit_preds(train,test,ycol,bcols+chcols)
    assert np.array_equal(te.index.to_numpy(),tebase.index.to_numpy())
    m0=metrics(te[ycol],pbase); m1=metrics(te[ycol],p)
    rel=(m0['brier']-m1['brier'])/m0['brier']; ad=m1['auroc']-m0['auroc']
    st=strata(te,pbase); obs,pv=cond_p(te[ycol].to_numpy(),pbase,p,st)
    return {'base':m0,'aug':m1,'brier_rel_improve':float(rel),'auroc_delta':float(ad),'conditional_stat':obs,'conditional_p':pv},p


def main():
    raw=[]
    mod.STATES=['KS','OR','TX']
    for s in mod.STATES:
        for y in mod.YEARS: raw.append(mod.fetch_state_year(s,y))
    x=mod.agg_months(mod.prep_raw(pd.concat(raw,ignore_index=True)))
    x=add_complements(kill.enrich(x)); x['Y1']=x['future1_viol']
    bcols=kill.strong_cols(x)
    train=x[x.year<=2022].copy(); temporal=x[x.year>=2023].copy()
    train_tx=x[(x.year<=2022)&x.STATE.isin(['KS','OR'])].copy(); transfer=x[(x.year>=2023)&(x.STATE=='TX')].copy()
    te,pbase=fit_preds(train,temporal,'Y',bcols)
    tt,pbase_tx=fit_preds(train_tx,transfer,'Y',bcols)
    results={}; txresults={}; channel_preds={}
    for name,cols in CHANNELS.items():
        r,p=eval_channel(train,temporal,'Y',bcols,cols,pbase,te); results[name]=r; channel_preds[name]=p
        rt,_=eval_channel(train_tx,transfer,'Y',bcols,cols,pbase_tx,tt); txresults[name]=rt
    adj=holm({k:v['conditional_p'] for k,v in results.items()})
    coherent={k:bool(adj[k]<.05 and results[k]['auroc_delta']>=0 and results[k]['brier_rel_improve']>=-.005) for k in CHANNELS}
    allcols=sum(CHANNELS.values(),[])
    teall,pall=fit_preds(train,temporal,'Y',bcols+allcols)
    mall=metrics(teall.Y,pall)
    loo={}
    for name,cols in CHANNELS.items():
        keep=[c for c in allcols if c not in cols]
        _,p=fit_preds(train,temporal,'Y',bcols+keep)
        m=metrics(teall.Y,p)
        loo[name]={'brier_without':m['brier'],'auroc_without':m['auroc'],
                   'removal_brier_worsening':float(m['brier']-mall['brier']),
                   'removal_auroc_worsening':float(mall['auroc']-m['auroc'])}
    localized=[k for k in CHANNELS if coherent[k] and (loo[k]['removal_brier_worsening']>0 or loo[k]['removal_auroc_worsening']>0)]
    verdict='LOCALIZED' if localized else 'DIFFUSE_OR_NULL'
    findings={'verdict':verdict,'localized_channels':localized,'n_snapshots':int(len(x)),'temporal_n':int(len(te)),'temporal_events':int(te.Y.sum()),'transfer_n':int(len(tt)),'transfer_events':int(tt.Y.sum()),'base_feature_count':len(bcols),'channels':results,'transfer_TX':txresults,'holm_adjusted_p':adj,'coherent':coherent,'all_five':mall,'leave_one_out':loo}
    Path('imi_five_signal_localization_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_FIVE_SIGNAL_LOCALIZATION_VERDICT_v1.txt').write_text(verdict+'\n'+json.dumps(findings,indent=2,default=str))
    out=te[['permit','STATE','month','year','Y','max_util','R']].copy(); out['p_base']=pbase
    for k,p in channel_preds.items(): out['p_'+k]=p
    out.to_csv('imi_five_signal_localization_temporal_predictions_v1.csv',index=False)
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
