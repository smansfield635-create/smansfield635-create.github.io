#!/usr/bin/env python3
import importlib.util, json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score

ROOT=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('loc',ROOT/'imi_five_signal_localization_v1.py')
loc=importlib.util.module_from_spec(spec); spec.loader.exec_module(loc)
kill=loc.kill; mod=loc.mod
SEED=20260828
RNG=np.random.default_rng(SEED)
TRAIN_STATES=['KS','OR']
FRESH_STATES=['MO','WI','NC']
ALL_STATES=TRAIN_STATES+FRESH_STATES
CHANNELS={'A':loc.A,'S':loc.S,'H':loc.H}


def metrics(y,p):
    y=np.asarray(y,int); p=np.asarray(p,float)
    return {'n':int(len(y)),'events':int(y.sum()),'brier':float(brier_score_loss(y,p)),
            'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,
            'ap':float(average_precision_score(y,p)) if len(np.unique(y))>1 else None}


def fit_predict(train,test,bcols,extra):
    tr=train[train.Y.notna()].copy(); te=test[test.Y.notna()].copy()
    m=kill.model(); m.fit(tr[bcols+extra],tr.Y.astype(int));
    return te,m.predict_proba(te[bcols+extra])[:,1]


def cond_p(y,p0,p1,te,nperm=5000):
    st=loc.strata(te,p0); y=np.asarray(y,float); d=np.asarray(p1-p0,float); keys=st.key.to_numpy(); uniq=np.unique(keys)
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
    order=sorted(ps,key=lambda k:ps[k]); out={}; running=0.0; m=len(order)
    for i,k in enumerate(order):
        v=min(1.0,(m-i)*ps[k]); running=max(running,v); out[k]=running
    return out


def compare(train,test,bcols,extra,p0=None,te0=None):
    if p0 is None: te0,p0=fit_predict(train,test,bcols,[])
    te,p1=fit_predict(train,test,bcols,extra)
    assert np.array_equal(te.index.to_numpy(),te0.index.to_numpy())
    m0=metrics(te.Y,p0); m1=metrics(te.Y,p1)
    rel=(m0['brier']-m1['brier'])/m0['brier'] if m0['brier'] else 0.0
    ad=m1['auroc']-m0['auroc']
    return te,p1,{'base':m0,'aug':m1,'brier_rel_improve':float(rel),'auroc_delta':float(ad)}


def main():
    raw=[]
    for s in ALL_STATES:
        for y in mod.YEARS:
            raw.append(mod.fetch_state_year(s,y))
    x=mod.agg_months(mod.prep_raw(pd.concat(raw,ignore_index=True)))
    x=loc.add_complements(kill.enrich(x))
    bcols=kill.strong_cols(x)
    train=x[(x.STATE.isin(TRAIN_STATES))&(x.year<=2022)].copy()
    fresh=x[(x.STATE.isin(FRESH_STATES))&(x.year>=2023)&x.Y.notna()].copy()
    state_counts={s:{'n':int(len(fresh[fresh.STATE==s])),'events':int(fresh.loc[fresh.STATE==s,'Y'].sum())} for s in FRESH_STATES}
    evaluable=(len(fresh)>=1500 and fresh.Y.sum()>=100 and all(v['n']>=300 and v['events']>=20 for v in state_counts.values()))
    findings={'evaluable':bool(evaluable),'n_snapshots':int(len(x)),'train_n':int(len(train)),'fresh_n':int(len(fresh)),'fresh_events':int(fresh.Y.sum()),'state_counts':state_counts,'base_feature_count':len(bcols)}
    if not evaluable:
        findings['verdict']='UNEVALUABLE'
    else:
        te,pbase=fit_predict(train,fresh,bcols,[])
        pooled={}; ps={}; preds={}
        for name,cols in CHANNELS.items():
            _,p,r=compare(train,fresh,bcols,cols,pbase,te)
            obs,pv=cond_p(te.Y.to_numpy(),pbase,p,te); r.update({'conditional_stat':obs,'conditional_p':pv}); pooled[name]=r; ps[name]=pv; preds[name]=p
        adj=holm(ps)
        combined_cols=loc.A+loc.S+loc.H
        _,pcomb,comb=compare(train,fresh,bcols,combined_cols,pbase,te)
        per_state={}
        for s in FRESH_STATES:
            ts=fresh[fresh.STATE==s].copy(); tes,p0s=fit_predict(train,ts,bcols,[]); _,pcs,rs=compare(train,ts,bcols,combined_cols,p0s,tes); per_state[s]=rs
        channel_ok={k:bool(adj[k]<.05 and pooled[k]['brier_rel_improve']>0 and pooled[k]['auroc_delta']>=0) for k in CHANNELS}
        comb_ok=bool(comb['brier_rel_improve']>0 and comb['auroc_delta']>=0)
        state_brier=sum(1 for s in FRESH_STATES if per_state[s]['brier_rel_improve']>0)
        state_auc=sum(1 for s in FRESH_STATES if per_state[s]['auroc_delta']>=-.002)
        strong=bool(channel_ok['A'] and channel_ok['S'] and comb_ok and state_brier>=2 and state_auc>=2)
        partial=bool((channel_ok['A'] ^ channel_ok['S']) and comb_ok)
        verdict='STRONG_REPLICATION' if strong else ('PARTIAL_REPLICATION' if partial else 'FAIL')
        findings.update({'pooled_channels':pooled,'holm_adjusted_p':adj,'channel_ok':channel_ok,'combined_ASH':comb,'per_state_combined_ASH':per_state,'state_brier_wins':state_brier,'state_auc_nonmaterial_loss':state_auc,'verdict':verdict})
        out=te[['permit','STATE','month','year','Y','max_util','R']].copy(); out['p_base']=pbase; out['p_A']=preds['A']; out['p_S']=preds['S']; out['p_H']=preds['H']; out['p_ASH']=pcomb
        out.to_csv('imi_ash_fresh_jurisdiction_predictions_v1.csv',index=False)
    Path('imi_ash_fresh_jurisdiction_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_ASH_FRESH_JURISDICTION_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
