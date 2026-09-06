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
SEED=20260829
RNG=np.random.default_rng(SEED)
TRAIN_STATES=['KS','OR']
FRESH_STATES=['PA','OH','FL']
ALL_STATES=TRAIN_STATES+FRESH_STATES
ASH=loc.A+loc.S+loc.H


def metrics(y,p):
    y=np.asarray(y,int); p=np.asarray(p,float)
    return {'n':int(len(y)),'events':int(y.sum()),'brier':float(brier_score_loss(y,p)),
            'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,
            'ap':float(average_precision_score(y,p)) if len(np.unique(y))>1 else None}


def fit_predict(train,test,bcols,extra):
    tr=train[train.Y.notna()].copy(); te=test[test.Y.notna()].copy()
    m=kill.model(); m.fit(tr[bcols+extra],tr.Y.astype(int))
    return te,m.predict_proba(te[bcols+extra])[:,1]


def structural_table(x):
    pre=x[x.year<=2022].copy()
    rows=[]
    for (permit,state),d in pre.groupby(['permit','STATE']):
        rows.append({
            'permit':permit,'STATE':state,
            'complexity':float(d.n_constraints.median()),
            'structural_variability':float(d.n_constraints.std(ddof=0)) if len(d)>1 else 0.0,
            'monitoring_density':float(d.month.nunique()),
            'constraint_concentration':float(d.margin_entropy.mean()),
            'high_pressure_exposure':float((d.near80_frac>=.25).mean()),
        })
    return pd.DataFrame(rows)


def rel_improve(m0,m1):
    return float((m0['brier']-m1['brier'])/m0['brier']) if m0['brier'] else 0.0


def interaction_p(df,mask,nperm=5000):
    gain=(df.Y.to_numpy(float)-df.p_base.to_numpy(float))**2-(df.Y.to_numpy(float)-df.p_ash.to_numpy(float))**2
    inside=np.asarray(mask,bool); states=df.STATE.to_numpy()
    obs=float(np.mean(gain[inside])-np.mean(gain[~inside]))
    ge=0
    for _ in range(nperm):
        mp=inside.copy()
        for s in np.unique(states):
            ix=np.where(states==s)[0]
            mp[ix]=RNG.permutation(mp[ix])
        st=float(np.mean(gain[mp])-np.mean(gain[~mp]))
        if st>=obs-1e-15: ge+=1
    return obs,float((ge+1)/(nperm+1))


def holm(ps):
    order=sorted(ps,key=lambda k:ps[k]); out={}; running=0.0; m=len(order)
    for i,k in enumerate(order):
        v=min(1.0,(m-i)*ps[k]); running=max(running,v); out[k]=running
    return out


def subset_result(df,mask):
    z=df.loc[mask].copy(); m0=metrics(z.Y,z.p_base); m1=metrics(z.Y,z.p_ash)
    ad=(m1['auroc']-m0['auroc']) if m0['auroc'] is not None and m1['auroc'] is not None else None
    return {'base':m0,'aug':m1,'brier_rel_improve':rel_improve(m0,m1),'auroc_delta':ad}


def main():
    raw=[]
    mod.STATES=ALL_STATES
    for s in ALL_STATES:
        for y in mod.YEARS: raw.append(mod.fetch_state_year(s,y))
    x=mod.agg_months(mod.prep_raw(pd.concat(raw,ignore_index=True)))
    x=loc.add_complements(kill.enrich(x))
    bcols=kill.strong_cols(x)
    struct=structural_table(x)
    trstruct=struct[struct.STATE.isin(TRAIN_STATES)].copy()
    thresholds={
        'complexity':float(trstruct.complexity.median()),
        'structural_variability':float(trstruct.structural_variability.median()),
        'monitoring_density':float(trstruct.monitoring_density.median()),
        'constraint_concentration':float(trstruct.constraint_concentration.median()),
        'high_pressure_exposure':float(trstruct.high_pressure_exposure.median()),
    }
    train=x[(x.STATE.isin(TRAIN_STATES))&(x.year<=2022)].copy()
    fresh=x[(x.STATE.isin(FRESH_STATES))&(x.year>=2023)&x.Y.notna()].copy()
    fresh=fresh.merge(struct,on=['permit','STATE'],how='left',validate='many_to_one')
    counts={s:{'n':int(len(fresh[fresh.STATE==s])),'events':int(fresh.loc[fresh.STATE==s,'Y'].sum())} for s in FRESH_STATES}
    overall_eval=(len(fresh)>=1500 and fresh.Y.sum()>=100 and all(v['n']>=300 and v['events']>=20 for v in counts.values()))
    findings={'evaluable':bool(overall_eval),'n_snapshots':int(len(x)),'train_n':int(len(train)),'fresh_n':int(len(fresh)),'fresh_events':int(fresh.Y.sum()),'state_counts':counts,'base_feature_count':len(bcols),'thresholds':thresholds}
    if not overall_eval:
        findings['verdict']='UNEVALUABLE'
    else:
        te,p0=fit_predict(train,fresh,bcols,[]); _,p1=fit_predict(train,fresh,bcols,ASH)
        te=te.copy(); te['p_base']=p0; te['p_ash']=p1
        for c in thresholds:
            if c not in te.columns:
                te=te.merge(fresh[['permit','STATE',c]].drop_duplicates(),on=['permit','STATE'],how='left')
        masks={
            'high_complexity':te.complexity>=thresholds['complexity'],
            'high_structural_variability':te.structural_variability>=thresholds['structural_variability'],
            'high_monitoring_density':te.monitoring_density>=thresholds['monitoring_density'],
            'low_constraint_concentration':te.constraint_concentration<thresholds['constraint_concentration'],
            'high_pressure_exposure':te.high_pressure_exposure>=thresholds['high_pressure_exposure'],
        }
        results={}; ps={}
        for name,mask in masks.items():
            mask=np.asarray(mask.fillna(False),bool); nin=int(mask.sum()); nout=int((~mask).sum())
            ev=bool(nin>=500 and nout>=100)
            r={'evaluable':ev,'inside_n':nin,'outside_n':nout}
            if ev:
                r['inside']=subset_result(te,mask); r['outside']=subset_result(te,~mask)
                obs,pv=interaction_p(te,mask); r['interaction_brier_gain']=obs; r['interaction_p']=pv; ps[name]=pv
                per_state={}
                for s in FRESH_STATES:
                    sm=(te.STATE==s).to_numpy() & mask
                    if sm.sum()>=100 and te.loc[sm,'Y'].sum()>=10:
                        per_state[s]=subset_result(te,sm)
                    else: per_state[s]={'evaluable':False}
                r['per_state_inside']=per_state
            else:
                ps[name]=1.0
            results[name]=r
        adj=holm(ps)
        qualifying=[]
        for name,r in results.items():
            if not r['evaluable']: continue
            r['holm_p']=adj[name]
            pswins=sum(1 for s,v in r['per_state_inside'].items() if v.get('evaluable',True) and v.get('brier_rel_improve',-1)>0)
            aucwins=sum(1 for s,v in r['per_state_inside'].items() if v.get('evaluable',True) and v.get('auroc_delta',-9)>=-.002)
            r['state_brier_wins']=pswins; r['state_auc_nonmaterial_loss']=aucwins
            inside=r['inside']
            ok=bool(adj[name]<.05 and r['interaction_brier_gain']>0 and inside['brier_rel_improve']>0 and inside['auroc_delta'] is not None and inside['auroc_delta']>=0 and pswins>=2 and aucwins>=2)
            r['qualifies']=ok
            if ok: qualifying.append(name)
        findings.update({'structural_results':results,'holm_adjusted_p':adj,'qualifying_regimes':qualifying,'overall_base':metrics(te.Y,te.p_base),'overall_ash':metrics(te.Y,te.p_ash),'verdict':'STRUCTURAL_REPLICATION' if qualifying else 'FAIL'})
        te[['permit','STATE','month','year','Y','p_base','p_ash','complexity','structural_variability','monitoring_density','constraint_concentration','high_pressure_exposure']].to_csv('imi_structural_regime_predictions_v1.csv',index=False)
    Path('imi_structural_regime_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_STRUCTURAL_REGIME_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
