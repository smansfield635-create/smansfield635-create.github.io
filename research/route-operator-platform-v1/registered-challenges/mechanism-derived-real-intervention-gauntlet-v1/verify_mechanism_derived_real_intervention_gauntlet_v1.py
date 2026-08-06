#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent

def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def load_json(name: str):
    with (ROOT / name).open("r", encoding="utf-8") as f:
        return json.load(f)

checks: list[tuple[str, bool]] = []

def check(label: str, condition: bool) -> None:
    checks.append((label, bool(condition)))

manifest = load_json("MANIFEST_SHA256.json")
check("operation id exact", manifest["operation_id"] == "MECHANISM_DERIVED_REAL_INTERVENTION_GAUNTLET_v1")
check("manifest frozen before admission", manifest["status"] == "FROZEN_BEFORE_SYSTEM_ADMISSION")
check("scientific result none", manifest["scientific_result"] == "NONE")
check("core mutation false", manifest["core_mutation_performed"] is False)
check("postoutcome repair false", manifest["postoutcome_repair_permitted"] is False)

for name, expected in manifest["files"].items():
    path = ROOT / name
    check(f"exists {name}", path.is_file())
    if path.is_file():
        check(f"hash {name}", sha256(path) == expected)

candidate = load_json("mechanism-candidate.v1.json")
relations = load_json("relation-derivation-contract.v1.json")
interventions = load_json("intervention-admissibility.v1.json")
tests = load_json("primary-tests.v1.json")
comparators = load_json("comparators.v1.json")
scoring = load_json("scoring-and-adjudication.v1.json")
hysteresis = load_json("hysteresis-operationalization.v1.json")
roles = load_json("role-separation-and-custody.v1.json")
failures = load_json("failure-ownership.v1.json")
state = load_json("gauntlet-state.v1.json")

check("candidate frozen", candidate["frozen"] is True)
check("five primary claims", len(candidate["claims"]) == 5)
check("independent relation analysts at least two", relations["derivation_roles"]["independent_relation_analyst"]["minimum_teams"] >= 2)
check("outcome labels redacted", "HELDOUT_OUTCOME_LABELS_REDACTED" in relations["source_requirements"])
check("real intervention required", "INTERVENTION_WAS_REAL_AND_SYSTEM_OWNER_AUTHORIZED_OR_HISTORICALLY_DOCUMENTED" in interventions["requirements"])
check("simulation only excluded", "NO_PRIMARY_LABEL_IS_SIMULATION_ONLY" in interventions["requirements"])
check("minimum systems four", interventions["portfolio_minimums"]["admissible_systems"] >= 4)
check("minimum domains two", interventions["portfolio_minimums"]["domains"] >= 2)
check("minimum episodes twenty", interventions["portfolio_minimums"]["admissible_intervention_episodes"] >= 20)
check("five primary tests", len(tests["tests"]) == 5)
check("test ids exact", [x["id"] for x in tests["tests"]] == [
    "T1_SELECTIVE_ROUTE_LOSS",
    "T2_UNRELATED_CAPACITY_NONCOMPENSATION",
    "T3_SUPPORTED_OUTPUT_WITH_INTERNAL_ROUTE_LOSS",
    "T4_RELATION_SPECIFIC_RESTORATION",
    "T5_HYSTERESIS",
])
check("four comparators", [x["id"] for x in comparators["comparators"]] == [
    "B1_OUTPUT_HISTORY",
    "B2_ADDITIVE_FEATURES",
    "B3_GRAPH_DEPENDENCY",
    "B4_BLACK_BOX",
])
check("graph comparator same documentation", "GRAPH_COMPARATOR_MAY_DERIVE_ITS_OWN_GRAPH_FROM_THE_SAME_DOCUMENTATION" in comparators["fairness_rules"])
check("weights sum one", abs(sum(scoring["component_weights"].values()) - 1.0) < 1e-12)
check("positive comparator increment", scoring["survival_thresholds"]["increment_over_strongest_comparator_min"] > 0)
check("bootstrap lower bound positive", scoring["survival_thresholds"]["increment_bootstrap_95_ci_lower_bound_gt"] == 0.0)
check("no critical failures allowed", scoring["survival_thresholds"]["critical_prediction_failures_max"] == 0)
check("five dispositions", len(scoring["dispositions"]) == 5)
check("disposition ids exact", [x["id"] for x in scoring["dispositions"]] == [
    "MECHANISM_FALSE",
    "MECHANISM_UNDERDEFINED",
    "MECHANISM_REDUNDANT",
    "SURVIVES_INITIAL_REAL_INTERVENTION_GAUNTLET",
    "UNEVALUABLE_CUSTODY_OR_POWER_FAILURE",
])
check("single disposition required", scoring["single_primary_disposition_required"] is True)
check("hysteresis no retrospective labeling", hysteresis["no_retrospective_labeling"] is True)
check("custodian cannot predict", "submit_primary_predictions" in roles["roles"]["documentation_and_outcome_custodian"]["may_not"])
check("protocol cannot access outcomes", "access_unblinded_outcomes_before_freeze" in roles["roles"]["protocol_authority"]["may_not"])
check("underdefinition is not survival", "UNDERDEFINITION_IS_NOT_SURVIVAL" in failures["anti_escape_rules"])
check("state not started", state["execution_status"] == "NOT_STARTED")
check("state no result", state["scientific_result"] == "NONE")
check("no system admitted", state["first_system_admitted"] is False)
check("no public package released", state["first_public_documentation_package_released"] is False)
check("no outcomes unblinded", state["first_heldout_outcome_unblinded"] is False)
check("no result artifacts", not any(
    p.name.startswith(("RESULT", "EXECUTION", "UNBLIND", "SCIENTIFIC_DISPOSITION"))
    for p in ROOT.iterdir()
    if p.is_file()
))

failed = [label for label, ok in checks if not ok]
for label, ok in checks:
    print(("PASS" if ok else "FAIL") + " | " + label)
print(f"SUMMARY | {len(checks) - len(failed)}/{len(checks)} PASS")
if failed:
    sys.exit(1)
