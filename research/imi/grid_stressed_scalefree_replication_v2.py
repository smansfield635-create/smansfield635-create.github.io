#!/usr/bin/env python3
import importlib.util, json
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.stats import spearmanr

ROOT=Path(__file__).resolve().parent
TARGET=ROOT/'grid_stressed_maneuverability_replication_v1.py'
spec=importlib.util.spec_from_file_location('gridv1',TARGET)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

SEED=20260824
RNG=np.random.default_rng(SEED)
N_STATES=300
mod.SEED=SEED
mod.RNG=RNG


def balanced_seed(m):
    gen=m['gen']; on=np.where(gen[:,mod.GEN_STATUS]>0)[0]
    q=gen[:,mod.PG].copy()
    q[on]=np.minimum(np.maximum(q[on],gen[on,mod.PMIN]),gen[on,mod.PMAX])
    target=float(m['bus'][:,mod.PD].sum()); delta=target-float(q[on].sum())
    if delta>0:
        for gi in on:
            take=min(delta,max(0.0,float(gen[gi,mod.PMAX]-q[gi]))); q[gi]+=take; delta-=take
            if delta<=1e-9: break
    elif delta<0:
        need=-delta
        for gi in on:
            take=min(need,max(0.0,float(q[gi]-gen[gi,mod.PMIN]))); q[gi]-=take; need-=take
            if need<=1e-9: break
        delta=-need
    if abs(delta)>1e-6: raise RuntimeError(f'cannot balance published load within generator bounds: {delta}')
    return mod.repair_feasible(m,q)


def make_states(m,n):
    base=balanced_seed(m); states=[base.copy()]; attempts=0
    while len(states)<n and attempts<50000:
        attempts+=1; q=states[int(RNG.integers(len(states)))].copy(); on=np.where(m['gen'][:,mod.GEN_STATUS]>0)[0]
        for _ in range(int(RNG.integers(2,10))):
            i,j=RNG.choice(len(on),2,replace=False); lim,_=mod.pair_step(m,q,int(i),int(j))
            if lim>1e-5:
                step=float(lim*RNG.uniform(.08,.95)); q[on[i]]+=step; q[on[j]]-=step
        if mod.feasible(m,q) and all(np.linalg.norm(q-s)>0.05 for s in states): states.append(q)
    if len(states)<n: raise RuntimeError(f'only generated {len(states)} fresh v2 states')
    return states


def permutation_p(sd, observed, nperm=10000):
    vals=sd['survival'].to_numpy().copy(); n=len(vals); q=n//4
    count=0
    for _ in range(nperm):
        p=RNG.permutation(vals)
        d=float(np.mean(p[:q])-np.mean(p[q:2*q]))
        if abs(d)>=abs(observed)-1e-15: count+=1
    return (count+1)/(nperm+1)


def main():
    raw,source_sha=mod.load_case(); m=mod.internalize(raw); states=make_states(m,N_STATES)
    rows=[]; srows=[]
    for sid,pg in enumerate(states):
        M=float(mod.maneuverability(m,pg)); sf=mod.state_features(m,pg); ys=[]
        for k,cf in mod.contingencies(m,pg):
            y=mod.survives(m,pg,k); ys.append(y); rows.append({'state':sid,'fold':sid%5,'M':M,'y':y,'branch':k,**sf,**cf})
        srows.append({'state':sid,'fold':sid%5,'M':M,'survival':float(np.mean(ys)),'n_cont':len(ys),**sf})
        if sid%25==0: print('V2_STATE',sid,'M',M,'SURV',np.mean(ys),flush=True)
    df=pd.DataFrame(rows); sd=pd.DataFrame(srows)
    failure_rate=float(1-df.y.mean()); distinct=int(sd.M.round(12).nunique())
    evaluable=bool(distinct>=20 and .05<=failure_rate<=.95)
    sd_sorted=sd.sort_values('M').reset_index(drop=True); q=len(sd_sorted)//4
    bottom=float(sd_sorted.iloc[:q].survival.mean()); top=float(sd_sorted.iloc[-q:].survival.mean()); quartile_diff=top-bottom
    # permutation uses fixed group sizes; sort order is irrelevant under null.
    vals=sd['survival'].to_numpy(); count=0
    for _ in range(10000):
        p=RNG.permutation(vals); d=float(np.mean(p[:q])-np.mean(p[q:2*q]))
        if abs(d)>=abs(quartile_diff)-1e-15: count+=1
    perm_p=(count+1)/10001
    rho,rhop=spearmanr(sd.M,sd.survival)
    folds=[]; preds=[]
    if evaluable:
        for fold in range(5):
            tr=df.fold!=fold; te=df.fold==fold; y=df.loc[te,'y'].to_numpy()
            a=mod.mdl(); b=mod.mdl(); a.set_params(random_state=SEED); b.set_params(random_state=SEED)
            a.fit(df.loc[tr,mod.XCOLS],df.loc[tr,'y']); b.fit(df.loc[tr,mod.XCOLS+['M']],df.loc[tr,'y'])
            p0=a.predict_proba(df.loc[te,mod.XCOLS])[:,1]; p1=b.predict_proba(df.loc[te,mod.XCOLS+['M']])[:,1]
            m0=mod.metrics(y,p0); m1=mod.metrics(y,p1); rel=(m0['brier']-m1['brier'])/m0['brier']
            folds.append({'fold':fold,'n':len(y),'failures':int((1-y).sum()),'base':m0,'aug':m1,'brier_rel_improve':rel})
            z=df.loc[te,['state','fold','M','y','branch']].copy(); z['p_base']=p0; z['p_aug']=p1; preds.append(z)
        pred=pd.concat(preds,ignore_index=True); pool0=mod.metrics(pred.y,pred.p_base); pool1=mod.metrics(pred.y,pred.p_aug)
        pooled_rel=(pool0['brier']-pool1['brier'])/pool0['brier']; auc_delta=pool1['auroc']-pool0['auroc']; wins=sum(x['aug']['brier']<x['base']['brier'] for x in folds)
        criteria={'brier_rel_improve_ge_5pct':bool(pooled_rel>=.05),'auroc_delta_nonnegative':bool(auc_delta>=0),'brier_wins_ge_4_of_5':bool(wins>=4),
                  'spearman_positive_p_lt_0_01':bool(rho>0 and rhop<.01),'top_quartile_higher_perm_p_lt_0_01':bool(quartile_diff>0 and perm_p<.01)}
        verdict='PASS' if all(criteria.values()) else 'FAIL'
    else:
        pred=pd.DataFrame(); pool0=pool1={}; pooled_rel=auc_delta=None; wins=0; criteria={}; verdict='UNEVALUABLE'
    findings={'verdict':verdict,'source_url':mod.SOURCE_URL,'source_commit':mod.SOURCE_COMMIT,'source_sha256':source_sha,'seed':SEED,'n_states':len(sd),'n_rows':len(df),
              'failure_rate':failure_rate,'M_min':float(sd.M.min()),'M_max':float(sd.M.max()),'M_range':float(sd.M.max()-sd.M.min()),'M_distinct':distinct,
              'spearman_rho':float(rho),'spearman_p':float(rhop),'bottom_M_quartile_survival':bottom,'top_M_quartile_survival':top,'quartile_survival_diff':quartile_diff,'quartile_permutation_p':perm_p,
              'pooled_base':pool0,'pooled_aug':pool1,'pooled_brier_rel_improve':pooled_rel,'pooled_auroc_delta':auc_delta,'fold_brier_wins':wins,'folds':folds,'criteria':criteria}
    Path('grid_stressed_scalefree_findings_v2.json').write_text(json.dumps(findings,indent=2)); df.to_csv('grid_stressed_scalefree_rows_v2.csv',index=False); sd.to_csv('grid_stressed_scalefree_states_v2.csv',index=False)
    if len(pred): pred.to_csv('grid_stressed_scalefree_predictions_v2.csv',index=False)
    Path('GRID_STRESSED_SCALEFREE_VERDICT_v2.txt').write_text(verdict+'\n'+json.dumps(findings,indent=2))
    print(json.dumps(findings,indent=2),flush=True)

if __name__=='__main__': main()
