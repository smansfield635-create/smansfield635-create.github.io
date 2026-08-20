from __future__ import annotations
import argparse, json
from pathlib import Path


def infer(catalog, training, heldout_cases):
    obs={o['case_id']:o for o in training['observations']}
    baseline=obs['T00_BASELINE']
    constitutive=[]
    decoys=[]
    support_masked=[]
    for rel in [r['relation_id'] for r in catalog['relations']]:
        disabled=obs[f'T_DISABLE_{rel}']
        supported=obs[f'T_SUPPORT_{rel}']
        if baseline['identity_challenge'] and not disabled['identity_challenge']:
            constitutive.append(rel)
            if supported['generic_output'] and not supported['identity_challenge'] and supported['support_draw']:
                support_masked.append(rel)
        else:
            decoys.append(rel)
    relation_map={r['relation_id']:r for r in catalog['relations']}
    boundary=sorted({relation_map[r]['source'] for r in constitutive}|{relation_map[r]['target'] for r in constitutive})
    incoming={relation_map[r]['target']:r for r in constitutive}
    outgoing={relation_map[r]['source']:r for r in constitutive}
    starts=[n for n in boundary if n not in incoming]
    route=[]
    if len(starts)==1:
        node=starts[0]
        seen=set()
        while node in outgoing and outgoing[node] not in seen:
            rid=outgoing[node]; route.append(rid); seen.add(rid); node=relation_map[rid]['target']

    constitutive_set=set(constitutive)
    predictions={}
    for case in heldout_cases['cases']:
        disrupted=bool(constitutive_set.intersection(case['disabled_relations']))
        pred={'generic_output':False,'identity_challenge':False}
        if case['prior_fracture_latched'] and not case['reentry_clearance']:
            pred['failure_code']='REENTRY_CLEARANCE_REQUIRED'
        elif not disrupted:
            pred={'generic_output':True,'identity_challenge':True}
            if case['prior_fracture_latched'] and case['reentry_clearance']:
                pred['clearance_used']=True
        elif case['functional_substitute']:
            pred={'generic_output':True,'identity_challenge':False,'substitute_draw':True}
        elif case['external_support']:
            pred={'generic_output':True,'identity_challenge':False,'support_draw':True}
        elif case['extra_capacity_units']>0:
            pred['failure_code']='UNRELATED_CAPACITY_CANNOT_REPAIR_ROUTE'
        else:
            pred['failure_code']='CONSTITUTIVE_ROUTE_CLOSED'
        predictions[case['case_id']]=pred

    return {
      'constitutive_relations':sorted(constitutive),
      'decoy_relations':sorted(decoys),
      'boundary_nodes':boundary,
      'ordered_original_route':route,
      'support_masked_relations':sorted(support_masked),
      'matched_output_discrimination':(
          obs['T00_BASELINE']['generic_output'] and obs['T_SUPPORT_R03']['generic_output'] and obs['T_SUBSTITUTE_R03']['generic_output']
          and len({(obs['T00_BASELINE']['identity_challenge'],obs['T00_BASELINE']['support_draw'],obs['T00_BASELINE']['substitute_draw']),
                   (obs['T_SUPPORT_R03']['identity_challenge'],obs['T_SUPPORT_R03']['support_draw'],obs['T_SUPPORT_R03']['substitute_draw']),
                   (obs['T_SUBSTITUTE_R03']['identity_challenge'],obs['T_SUBSTITUTE_R03']['support_draw'],obs['T_SUBSTITUTE_R03']['substitute_draw'])})==3
      ),
      'heldout_predictions':predictions,
    }


def main():
    p=argparse.ArgumentParser(); p.add_argument('--catalog',type=Path,required=True); p.add_argument('--training',type=Path,required=True); p.add_argument('--heldout-cases',type=Path,required=True); p.add_argument('--output',type=Path,required=True); a=p.parse_args()
    catalog=json.loads(a.catalog.read_text()); training=json.loads(a.training.read_text()); heldout=json.loads(a.heldout_cases.read_text())
    a.output.write_text(json.dumps(infer(catalog,training,heldout),indent=2,sort_keys=True)+"\n")

if __name__=='__main__': main()
