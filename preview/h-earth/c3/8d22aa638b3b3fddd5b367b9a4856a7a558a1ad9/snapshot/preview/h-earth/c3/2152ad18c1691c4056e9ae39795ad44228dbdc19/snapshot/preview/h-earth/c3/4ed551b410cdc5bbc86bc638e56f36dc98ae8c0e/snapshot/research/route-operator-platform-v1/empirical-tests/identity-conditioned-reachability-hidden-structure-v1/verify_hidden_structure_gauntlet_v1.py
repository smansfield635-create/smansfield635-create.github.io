from __future__ import annotations
import hashlib, json, shutil, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parent

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def run(cmd,cwd=None): subprocess.run(cmd,cwd=cwd,check=True)

def main():
    manifest=json.loads((ROOT/'MANIFEST_SHA256.json').read_text())
    checks=[]
    for name,expected in manifest['files'].items(): checks.append((f'hash:{name}',sha(ROOT/name)==expected))
    with tempfile.TemporaryDirectory() as td:
        t=Path(td); public=t/'public'; hidden=t/'hidden'; public.mkdir(); hidden.mkdir()
        for name in ['public-relation-catalog.v1.json','observer_inference_v1.py']:
            shutil.copy2(ROOT/name,public/name)
        for name in ['hidden_system_v1.py','observation_generator_v1.py','hidden-truth.v1.json','heldout_evaluator_v1.py']:
            shutil.copy2(ROOT/name,hidden/name)
        training=t/'training-observations.json'; hcases=t/'heldout-cases.json'; outcomes=t/'heldout-outcomes.json'; inference=t/'observer-inference.json'; result=t/'result.json'
        run([sys.executable,str(hidden/'observation_generator_v1.py'),'--training',str(training),'--heldout-cases',str(hcases),'--heldout-outcomes',str(outcomes)],cwd=hidden)
        observer_dir=t/'observer-runtime'; observer_dir.mkdir()
        shutil.copy2(public/'public-relation-catalog.v1.json',observer_dir/'public-relation-catalog.v1.json')
        shutil.copy2(public/'observer_inference_v1.py',observer_dir/'observer_inference_v1.py')
        shutil.copy2(training,observer_dir/'training-observations.json')
        shutil.copy2(hcases,observer_dir/'heldout-cases.json')
        forbidden=['hidden_system_v1.py','hidden-truth.v1.json','heldout-outcomes.json']
        checks.append(('observer_isolation',all(not (observer_dir/x).exists() for x in forbidden)))
        run([sys.executable,'observer_inference_v1.py','--catalog','public-relation-catalog.v1.json','--training','training-observations.json','--heldout-cases','heldout-cases.json','--output',str(inference)],cwd=observer_dir)
        run([sys.executable,str(hidden/'heldout_evaluator_v1.py'),'--truth',str(hidden/'hidden-truth.v1.json'),'--inference',str(inference),'--outcomes',str(outcomes),'--output',str(result)],cwd=hidden)
        res=json.loads(result.read_text())
        checks.extend([
          ('relation_exact',res['constitutive_relation_exact_match']),
          ('boundary_exact',res['boundary_exact_match']),
          ('route_exact',res['ordered_route_exact_match']),
          ('matched_output',res['matched_output_discrimination']),
          ('heldout_6_of_6',res['heldout_predictions_passed']==6 and res['heldout_predictions_total']==6),
          ('result_category',res['result_category']=='OBSERVER_BLINDED_HIDDEN_STRUCTURE_PREDICTIONS_SURVIVED')
        ])
    failed=[n for n,p in checks if not p]
    print(json.dumps({'status':'PASS' if not failed else 'FAIL','checks_passed':len(checks)-len(failed),'checks_total':len(checks),'failed_checks':failed},indent=2,sort_keys=True))
    return 0 if not failed else 1

if __name__=='__main__': raise SystemExit(main())
