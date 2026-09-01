from __future__ import annotations
import argparse, json
from pathlib import Path
from hidden_system_v1 import Case, execute


def training_cases():
    cases=[Case("T00_BASELINE")]
    for relation_id in [f"R{i:02d}" for i in range(1,9)]:
        cases.append(Case(f"T_DISABLE_{relation_id}",(relation_id,)))
        cases.append(Case(f"T_SUPPORT_{relation_id}",(relation_id,),external_support=True))
    cases.extend([
        Case("T_SUBSTITUTE_R03",("R03",),functional_substitute=True),
        Case("T_CAPACITY_R04",("R04",),extra_capacity_units=100),
        Case("T_LATCH_R02",("R02",)),
        Case("T_RESTORE_NO_CLEARANCE",(),prior_fracture_latched=True),
        Case("T_RESTORE_WITH_CLEARANCE",(),prior_fracture_latched=True,reentry_clearance=True),
    ])
    return cases


def heldout_cases():
    return [
        Case("H01_TWO_RELATIONS_WITH_SUPPORT",("R02","R04"),external_support=True),
        Case("H02_DECOY_ONLY",("R07",)),
        Case("H03_CAPACITY_CANNOT_REPAIR",("R05",),extra_capacity_units=1000),
        Case("H04_SUBSTITUTE_MATCHED_OUTPUT",("R01",),functional_substitute=True),
        Case("H05_LATCHED_RESTORE_NO_CLEARANCE",(),prior_fracture_latched=True),
        Case("H06_LATCHED_RESTORE_WITH_CLEARANCE",(),prior_fracture_latched=True,reentry_clearance=True),
    ]


def serialize_case(case):
    return {
        "case_id":case.case_id,
        "disabled_relations":list(case.disabled_relations),
        "external_support":case.external_support,
        "functional_substitute":case.functional_substitute,
        "extra_capacity_units":case.extra_capacity_units,
        "prior_fracture_latched":case.prior_fracture_latched,
        "reentry_clearance":case.reentry_clearance,
    }


def main():
    p=argparse.ArgumentParser(); p.add_argument('--training',type=Path,required=True); p.add_argument('--heldout-cases',type=Path,required=True); p.add_argument('--heldout-outcomes',type=Path,required=True); a=p.parse_args()
    training=[execute(c) for c in training_cases()]
    a.training.write_text(json.dumps({"observations":training},indent=2,sort_keys=True)+"\n")
    hcases=heldout_cases()
    a.heldout_cases.write_text(json.dumps({"cases":[serialize_case(c) for c in hcases]},indent=2,sort_keys=True)+"\n")
    a.heldout_outcomes.write_text(json.dumps({"outcomes":[execute(c) for c in hcases]},indent=2,sort_keys=True)+"\n")

if __name__=='__main__': main()
