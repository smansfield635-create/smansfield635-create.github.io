from __future__ import annotations

import copy
import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
FROZEN_FILES = [
    "README.md",
    "PREREGISTRATION.md",
    "frozen-contract.v1.json",
    "system-spec.v1.json",
    "prediction-matrix.v1.json",
    "alternative-models.v1.json",
    "failure-ownership.v1.json",
    "execution-receipt.schema.v1.json",
    "level4_target_system_v1.py",
    "level4_gauntlet_v1.py",
    "independent_reproducer_v1.py",
]


def load_json(name: str) -> Any:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def load_module(name: str, filename: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / filename)
    if spec is None or spec.loader is None:
        raise AssertionError("MODULE_LOAD_FAILED:" + name)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def main() -> int:
    checks = 0
    contract = load_json("frozen-contract.v1.json")
    system = load_json("system-spec.v1.json")
    matrix = load_json("prediction-matrix.v1.json")
    alternatives = load_json("alternative-models.v1.json")
    ownership = load_json("failure-ownership.v1.json")
    schema = load_json("execution-receipt.schema.v1.json")
    manifest = load_json("MANIFEST_SHA256.json")

    assert contract["status"] == "FROZEN_BEFORE_EXECUTION"
    assert contract["core_mutation_permitted"] is False
    assert contract["post_result_threshold_repair_permitted"] is False
    assert len(system["conditions"]) == 9
    assert len(matrix["predictions"]) == 9
    assert len(alternatives["models"]) == 4
    assert len(ownership["universal_candidate_failure_conditions"]) >= 6
    assert schema["properties"]["core_mutation_performed"]["const"] is False
    checks += 8

    condition_ids = [item["condition_id"] for item in system["conditions"]]
    prediction_condition_ids = [item["condition_id"] for item in matrix["predictions"]]
    assert len(condition_ids) == len(set(condition_ids))
    assert set(condition_ids) == set(prediction_condition_ids)
    checks += 2

    assert manifest["file_count"] == len(manifest["files"])
    for name, expected in manifest["files"].items():
        actual = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
        assert actual == expected, name
        checks += 1

    for name in FROZEN_FILES:
        assert (ROOT / name).is_file(), name
        checks += 1

    load_module("level4_target_system_v1", "level4_target_system_v1.py")
    gauntlet = load_module("level4_gauntlet_v1", "level4_gauntlet_v1.py")
    result = gauntlet.run()
    assert result["theory_prediction_pass"] is True
    assert result["matched_output_discrimination_pass"] is True
    assert len(result["condition_receipts"]) == 9
    assert len(result["prediction_results"]) == 9
    assert all(item["pass"] for item in result["prediction_results"])
    assert result["core_mutation_performed"] is False
    checks += 6

    conditions = {item["condition_id"]: item for item in result["condition_receipts"]}
    assert conditions["C1_ENDOGENOUS_BASELINE"]["output_status"] == "PASS"
    assert conditions["C2_EXTERNAL_SUPPORT"]["output_status"] == "PASS"
    assert conditions["C3_FUNCTIONAL_SUBSTITUTE"]["output_status"] == "PASS"
    assert len({conditions[key]["identity_class"] for key in [
        "C1_ENDOGENOUS_BASELINE", "C2_EXTERNAL_SUPPORT", "C3_FUNCTIONAL_SUBSTITUTE"
    ]}) == 3
    assert conditions["C5_UNRELATED_COMPENSATION"]["output_status"] == "FAIL"
    assert conditions["C7_SUPPORT_WITHDRAWAL"]["output_status"] == "FAIL"
    assert conditions["C8_HYSTERETIC_RESTORE_BEFORE_CLEARANCE"]["output_status"] == "FAIL"
    assert conditions["C9_HYSTERETIC_REENTRY_AFTER_CLEARANCE"]["output_status"] == "PASS"
    checks += 8

    mutated = copy.deepcopy(matrix)
    mutated["predictions"][0]["assertions"][0]["value"] = "FAIL"
    first_receipt = conditions[mutated["predictions"][0]["condition_id"]]
    assert not gauntlet.evaluate_assertion(first_receipt, mutated["predictions"][0]["assertions"][0])
    checks += 1

    with tempfile.TemporaryDirectory() as temp_dir:
        receipt_path = Path(temp_dir) / "receipt.json"
        receipt_path.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        completed = subprocess.run(
            [sys.executable, str(ROOT / "independent_reproducer_v1.py"), str(receipt_path)],
            check=False,
            capture_output=True,
            text=True,
        )
        assert completed.returncode == 0, completed.stdout + completed.stderr
        reproduced = json.loads(completed.stdout)
        assert reproduced["status"] == "PASS"
        checks += 2

    print(json.dumps({
        "status": "PASS",
        "operation_id": contract["operation_id"],
        "checks_passed": checks,
        "conditions": len(system["conditions"]),
        "predictions": len(matrix["predictions"]),
        "alternative_models": len(alternatives["models"]),
        "core_mutation_performed": False,
        "real_natural_system_adjudication_performed": False
    }, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
