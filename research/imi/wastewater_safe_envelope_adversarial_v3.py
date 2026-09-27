#!/usr/bin/env python3
import importlib.util, json
from pathlib import Path
import pandas as pd
ROOT=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('wwv1',ROOT/'wastewater_safe_envelope_adversarial_v1.py')
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
mod.STATES=['KS','OR','TX']

def main():
    raw=[]
    for s in mod.STATES:
        for y in mod.YEARS: raw.append(mod.fetch_state_year(s,y))
    x=mod.agg_months(mod.prep_raw(pd.concat(raw,ignore_index=True)))
    train=x[x.year<=2022].copy(); temporal=x[x.year>=2023].copy()
    train_transfer=x[(x.year<=2022)&x.STATE.isin(['KS','OR'])].copy(); transfer=x[(x.year>=2023)&(x.STATE=='TX')].copy()
    evaluable=(len(temporal)>=2000 and temporal.Y.sum()>=100 and len(transfer)>=500 and transfer.Y.sum()>=30)
    findings={'evaluable':bool(evaluable),'n_snapshots':int(len(x)),'events':int(x.Y.sum()),'train_n':int(len(train)),'temporal_n':int(len(temporal)),'temporal_events':int(temporal.Y.sum()),'transfer_n':int(len(transfer)),'transfer_events':int(transfer.Y.sum())}
    if not evaluable:
        findings['verdict']='UNEVALUABLE'
    else:
        b0,b1,brel,bauc,p0,p1=mod.fit_eval(train,temporal); t0,t1,trel,tauc,_,_=mod.fit_eval(train_transfer,transfer)
        state_results={}; all_state_wins=True
        for s in mod.STATES:
            te=temporal[temporal.STATE==s]
            if len(te)<100 or te.Y.sum()<10: state_results[s]={'evaluable':False}; all_state_wins=False; continue
            m0,m1,rel,ad,_,_=mod.fit_eval(train,te); state_results[s]={'evaluable':True,'base':m0,'aug':m1,'brier_rel_improve':rel,'auroc_delta':ad}; all_state_wins &= (m1['brier']<m0['brier'])
        obs,pp=mod.strat_perm(temporal.Y.to_numpy(),p0,p1,temporal.max_util.to_numpy())
        criteria={'temporal_brier_ge_5pct':bool(brel>=.05),'temporal_auroc_nonnegative':bool(bauc>=0),'transfer_brier_ge_5pct':bool(trel>=.05),'transfer_auroc_nonnegative':bool(tauc>=0),'all_state_brier_wins':bool(all_state_wins),'stratified_residual_positive_p_lt_0_01':bool(obs>0 and pp<.01)}
        findings.update({'temporal':{'base':b0,'aug':b1,'brier_rel_improve':brel,'auroc_delta':bauc},'transfer_TX':{'base':t0,'aug':t1,'brier_rel_improve':trel,'auroc_delta':tauc},'state_results':state_results,'stratified_residual_stat':obs,'stratified_residual_p':pp,'criteria':criteria,'verdict':'PASS' if all(criteria.values()) else 'FAIL'})
        out=temporal[['permit','STATE','month','year','Y','max_util']].copy(); out['p_base']=p0; out['p_aug']=p1; out.to_csv('wastewater_safe_envelope_temporal_predictions_v3.csv',index=False)
    Path('wastewater_safe_envelope_findings_v3.json').write_text(json.dumps(findings,indent=2,default=str)); Path('WASTEWATER_SAFE_ENVELOPE_VERDICT_v3.txt').write_text(findings['verdict']+'\n'+json.dumps(findings,indent=2,default=str)); x.sample(min(20000,len(x)),random_state=mod.SEED).to_csv('wastewater_safe_envelope_snapshot_sample_v3.csv',index=False); print(json.dumps(findings,indent=2,default=str),flush=True)

if __name__=='__main__': main()
