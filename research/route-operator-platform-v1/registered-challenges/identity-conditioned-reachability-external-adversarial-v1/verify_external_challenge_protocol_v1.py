#!/usr/bin/env python3
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "MANIFEST_SHA256.json"

def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def load_json(name: str):
    with (ROOT / name).open("r", encoding="utf-8") as f:
        return json.load(f)

checks = []

def check(label: str, condition: bool):
    checks.append((label, bool(condition)))

manifest = load_json("MANIFEST_SHA256.json")
check("manifest status frozen", manifest["status"] == "FROZEN_BEFORE_EXTERNAL_REGISTRATION")
check("no result permitted", manifest["scientific_result"] == "NONE")
check("core mutation false", manifest["core_mutation_performed"] is False)
check("postdata repair false", manifest["postdata_repair_permitted"] is False)

for name, expected in manifest["files"].items():
    path = ROOT / name
    check(f"exists {name}", path.is_file())
    if path.is_file():
        check(f"hash {name}", sha256(path) == expected)

candidate = load_json("universal-candidate.v1.json")
admissibility = load_json("admissibility-contract.v1.json")
roles = load_json("role-separation-and-custody.v1.json")
baselines = load_json("baseline-models.v1.json")
scoring = load_json("prediction-and-scoring.v1.json")
adjudication = load_json("adjudication.v1.json")
state = load_json("challenge-state.v1.json")

check("candidate frozen", candidate["frozen"] is True)
check("minimum systems four", admissibility["primary_result_minimums"]["admissible_systems"] >= 4)
check("minimum domains two", admissibility["primary_result_minimums"]["domains"] >= 2)
check("independent author teams two", admissibility["primary_result_minimums"]["independent_system_author_teams"] >= 2)
check("independent observer teams two", admissibility["primary_result_minimums"]["independent_observer_teams"] >= 2)
check("separate custodian required", admissibility["primary_result_minimums"]["separate_custodian_required"] is True)
check("theory team excluded from primary systems", "NO_THEORY_TEAM_AUTHORSHIP_FOR_PRIMARY_SYSTEMS" in admissibility["system_requirements"])
check("observer cannot access truth", "access_hidden_truth" in roles["roles"]["observer_team"]["may_not"])
check("protocol authority cannot author systems", "author_primary_systems" in roles["roles"]["protocol_authority"]["may_not"])
check("five baselines frozen", len(baselines["baselines"]) == 5)
check("black box baseline included", any(x["id"] == "B5_BLACK_BOX" for x in baselines["baselines"]))
check("weights sum one", abs(sum(scoring["component_scores"].values()) - 1.0) < 1e-12)
check("positive baseline increment required", scoring["survival_thresholds"]["increment_over_strongest_baseline_min"] > 0)
check("uncertainty closure required", scoring["survival_thresholds"]["increment_bootstrap_95_ci_lower_bound_gt"] == 0.0)
check("no critical failures allowed", scoring["survival_thresholds"]["critical_prediction_failures_max"] == 0)
check("five adjudication categories", len(adjudication["categories"]) == 5)
check("single disposition required", adjudication["single_primary_disposition_required"] is True)
check("state not started", state["execution_status"] == "NOT_STARTED")
check("state no result", state["scientific_result"] == "NONE")
check("no external observations released", state["first_external_observation_released"] is False)
check("no result files", not any(p.name.startswith(("RESULT", "EXECUTION", "UNBLIND")) for p in ROOT.iterdir() if p.is_file()))

failed = [label for label, ok in checks if not ok]
for label, ok in checks:
    print(("PASS" if ok else "FAIL") + " | " + label)
print(f"SUMMARY | {len(checks) - len(failed)}/{len(checks)} PASS")
if failed:
    sys.exit(1)
