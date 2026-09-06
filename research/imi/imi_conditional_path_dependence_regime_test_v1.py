#!/usr/bin/env python3
import importlib.util, json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.metrics import brier_score_loss, roc_auc_score, average_precision_score

ROOT=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('rep',ROOT/'imi_ash_fresh_jurisdiction_replication_v1.py')
rep=importlib.util.module_from_spec(spec); spec.loader.exec_module(rep)
loc=rep.loc; kill=rep.kill; mod=rep.mod
SEED=20260829
RNG=np.random.default_rng(SEED)
TRAIN_STATES=['KS','OR']
DISCOVERY_STATES=['MO','WI','NC']
CONFIRM_STATES=['VA','GA','MN']
ALL_STATES=TRAIN_STATES+DISCOVERY_STATES+CONFIRM_STATES
ASH=loc.A+loc.S+loc.H


def metrics(y,p):
    y=np.asarray(y,int); p=np.asarray(p,float)
    return {
        'n':int(len(y)), 'events':int(y.sum()),
        'brier':float(brier_score_loss(y,p)),
        'auroc':float(roc_auc_score(y,p)) if len(np.unique(y))>1 else None,
        'ap':float(average_precision_score(y,p)) if len(np.unique(y))>1 else None,
    }


def fit_model(train, cols):
    tr=train[train.Y.notna()].copy()
    m=kill.model(); m.fit(tr[cols],tr.Y.astype(int)); return m


def predict_pair(base_model, ash_model, d, bcols):
    z=d[d.Y.notna()].copy()
    z['p_base']=base_model.predict_proba(z[bcols])[:,1]
    z['p_ash']=ash_model.predict_proba(z[bcols+ASH])[:,1]
    z['adv']=((z.Y-z.p_base)**2)-((z.Y-z.p_ash)**2)
    z['PRESSURE']=z['max_util']
    z['COMPLEXITY']=np.log1p(z['n_constraints'].astype(float))
    z['VOLATILITY']=z['total_variation12']
    z['HISTORY_DEPTH']=z['obs_age']
    z['BASELINE_RISK']=z['p_base']
    return z


def subset_metrics(d):
    m0=metrics(d.Y,d.p_base); m1=metrics(d.Y,d.p_ash)
    rel=(m0['brier']-m1['brier'])/m0['brier'] if m0['brier']>0 else 0.0
    ad=(m1['auroc']-m0['auroc']) if (m0['auroc'] is not None and m1['auroc'] is not None) else np.nan
    return {'base':m0,'ash':m1,'brier_rel_improve':float(rel),'auroc_delta':float(ad),'mean_advantage':float(d.adv.mean())}


def discover_rule(d):
    axes=['PRESSURE','COMPLEXITY','VOLATILITY','HISTORY_DEPTH','BASELINE_RISK']
    candidates=[]
    for axis in axes:
        finite=d[np.isfinite(d[axis])].copy()
        if len(finite)<600: continue
        thr=float(finite[axis].median())
        for side in ['LOW','HIGH']:
            sub=finite[finite[axis]<=thr] if side=='LOW' else finite[finite[axis]>thr]
            if len(sub)<300 or int(sub.Y.sum())<50: continue
            sm=subset_metrics(sub)
            candidates.append({'axis':axis,'threshold':thr,'side':side,'n':int(len(sub)),'events':int(sub.Y.sum()),'mean_advantage':sm['mean_advantage'],'brier_rel_improve':sm['brier_rel_improve'],'auroc_delta':sm['auroc_delta']})
    if not candidates: return None,[]
    candidates=sorted(candidates,key=lambda r:(r['mean_advantage'],r['brier_rel_improve']),reverse=True)
    return candidates[0],candidates


def apply_rule(d,rule):
    a=d[rule['axis']]
    inside=(a<=rule['threshold']) if rule['side']=='LOW' else (a>rule['threshold'])
    return d.assign(inside=inside.fillna(False).astype(bool))


def interaction_perm(d,nperm=10000):
    inside=d.inside.to_numpy(bool); adv=d.adv.to_numpy(float); states=d.STATE.astype(str).to_numpy()
    if inside.sum()==0 or (~inside).sum()==0: return np.nan,1.0
    obs=float(np.mean(adv[inside])-np.mean(adv[~inside]))
    ge=0
    uniq=np.unique(states)
    for _ in range(nperm):
        ip=inside.copy()
        for s in uniq:
            ix=np.where(states==s)[0]
            ip[ix]=RNG.permutation(ip[ix])
        st=float(np.mean(adv[ip])-np.mean(adv[~ip]))
        if st>=obs-1e-15: ge+=1
    return obs,float((ge+1)/(nperm+1))


def main():
    raw=[]
    mod.STATES=ALL_STATES
    for s in ALL_STATES:
        for y in mod.YEARS:
            raw.append(mod.fetch_state_year(s,y))
    x=mod.agg_months(mod.prep_raw(pd.concat(raw,ignore_index=True)))
    x=loc.add_complements(kill.enrich(x))
    bcols=kill.strong_cols(x)
    train=x[(x.STATE.isin(TRAIN_STATES))&(x.year<=2022)&x.Y.notna()].copy()
    discovery=x[(x.STATE.isin(DISCOVERY_STATES))&(x.year>=2023)&(x.year<=2024)&x.Y.notna()].copy()
    confirm=x[(x.STATE.isin(CONFIRM_STATES))&(x.year>=2023)&x.Y.notna()].copy()

    base=fit_model(train,bcols); ash=fit_model(train,bcols+ASH)
    dd=predict_pair(base,ash,discovery,bcols)
    cc=predict_pair(base,ash,confirm,bcols)
    rule,candidates=discover_rule(dd)

    findings={
      'n_snapshots':int(len(x)), 'train_n':int(len(train)),
      'discovery_n':int(len(dd)), 'discovery_events':int(dd.Y.sum()),
      'confirmation_n':int(len(cc)), 'confirmation_events':int(cc.Y.sum()),
      'base_feature_count':len(bcols), 'ash_feature_count':len(ASH),
      'discovery_state_counts':{s:{'n':int(len(dd[dd.STATE==s])),'events':int(dd.loc[dd.STATE==s,'Y'].sum())} for s in DISCOVERY_STATES},
      'confirmation_state_counts':{s:{'n':int(len(cc[cc.STATE==s])),'events':int(cc.loc[cc.STATE==s,'Y'].sum())} for s in CONFIRM_STATES},
      'selected_rule':rule,
      'discovery_candidates':candidates,
    }
    if rule is None:
        findings['verdict']='UNEVALUABLE'
    else:
        cc=apply_rule(cc,rule)
        inside=cc[cc.inside].copy(); outside=cc[~cc.inside].copy()
        evaluable=(len(inside)>=600 and int(inside.Y.sum())>=75 and len(outside)>=300)
        findings['evaluable']=bool(evaluable)
        findings['inside_n']=int(len(inside)); findings['inside_events']=int(inside.Y.sum()); findings['outside_n']=int(len(outside)); findings['outside_events']=int(outside.Y.sum())
        if not evaluable:
            findings['verdict']='UNEVALUABLE'
        else:
            ins=subset_metrics(inside); out=subset_metrics(outside); obs,pv=interaction_perm(cc)
            per_state={}; brier_wins=0; auc_ok=0
            for s in CONFIRM_STATES:
                z=inside[inside.STATE==s].copy()
                if len(z)<100 or int(z.Y.sum())<10:
                    per_state[s]={'evaluable':False}; continue
                r=subset_metrics(z); r['evaluable']=True; per_state[s]=r
                brier_wins += int(r['brier_rel_improve']>0)
                auc_ok += int(r['auroc_delta']>=-.002)
            criteria={
              'inside_brier_improves':bool(ins['brier_rel_improve']>0),
              'inside_auroc_nonnegative':bool(ins['auroc_delta']>=0),
              'interaction_positive_p_lt_0_01':bool(obs>0 and pv<.01),
              'state_brier_wins_ge_2':bool(brier_wins>=2),
              'state_auc_ok_ge_2':bool(auc_ok>=2),
            }
            verdict='CONDITIONAL_REPLICATION' if all(criteria.values()) else 'FAIL'
            findings.update({'inside_metrics':ins,'outside_metrics':out,'interaction_advantage_difference':obs,'interaction_p':pv,'per_state_inside':per_state,'state_brier_wins':brier_wins,'state_auc_ok':auc_ok,'criteria':criteria,'verdict':verdict})
            outcsv=cc[['permit','STATE','month','year','Y','max_util','n_constraints','total_variation12','obs_age','p_base','p_ash','adv','inside']].copy()
            outcsv.to_csv('imi_conditional_path_dependence_regime_predictions_v1.csv',index=False)
    Path('imi_conditional_path_dependence_regime_findings_v1.json').write_text(json.dumps(findings,indent=2,default=str))
    Path('IMI_CONDITIONAL_PATH_DEPENDENCE_REGIME_VERDICT_v1.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str))
    print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
