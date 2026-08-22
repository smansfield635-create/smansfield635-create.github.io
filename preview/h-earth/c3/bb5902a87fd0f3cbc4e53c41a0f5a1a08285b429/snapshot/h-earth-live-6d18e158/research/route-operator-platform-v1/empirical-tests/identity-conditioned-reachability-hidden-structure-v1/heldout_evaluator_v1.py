from __future__ import annotations
import argparse, json
from pathlib import Path


def main():
    p=argparse.ArgumentParser(); p.add_argument('--truth',type=Path,required=True); p.add_argument('--inference',type=Path,required=True); p.add_argument('--outcomes',type=Path,required=True); p.add_argument('--output',type=Path,required=True); a=p.parse_args()
    truth=json.loads(a.truth.read_text()); inf=json.loads(a.inference.read_text()); outcomes={o['case_id']:o for o in json.loads(a.outcomes.read_text())['outcomes']}
    rel_ok=inf['constitutive_relations']==sorted(truth['constitutive_relations'])
    boundary_ok=inf['boundary_nodes']==sorted(truth['boundary_nodes'])
    route_ok=inf['ordered_original_route']==truth['ordered_original_route']
    case_results=[]
    for cid,pred in inf['heldout_predictions'].items():
        actual=outcomes[cid]
        checks={k:(actual.get(k)==v) for k,v in pred.items()}
        case_results.append({'case_id':cid,'passed':all(checks.values()),'checks':checks})
    passed=sum(1 for x in case_results if x['passed'])
    total=len(case_results)
    result={
      'result_category':'OBSERVER_BLINDED_HIDDEN_STRUCTURE_PREDICTIONS_SURVIVED' if rel_ok and boundary_ok and route_ok and passed==total and inf['matched_output_discrimination'] else 'OBSERVER_BLINDED_HIDDEN_STRUCTURE_PREDICTIONS_NOT_FULLY_SUPPORTED',
      'constitutive_relation_exact_match':rel_ok,
      'boundary_exact_match':boundary_ok,
      'ordered_route_exact_match':route_ok,
      'matched_output_discrimination':inf['matched_output_discrimination'],
      'heldout_predictions_passed':passed,
      'heldout_predictions_total':total,
      'case_results':case_results,
      'scientific_boundary':{
        'computational_process_isolation':True,
        'independent_human_observer_recovery':False,
        'natural_system_validity':False,
        'universal_law_established':False
      }
    }
    a.output.write_text(json.dumps(result,indent=2,sort_keys=True)+"\n")
    print(json.dumps(result,indent=2,sort_keys=True))
    return 0 if result['result_category'].endswith('SURVIVED') else 1

if __name__=='__main__': raise SystemExit(main())
