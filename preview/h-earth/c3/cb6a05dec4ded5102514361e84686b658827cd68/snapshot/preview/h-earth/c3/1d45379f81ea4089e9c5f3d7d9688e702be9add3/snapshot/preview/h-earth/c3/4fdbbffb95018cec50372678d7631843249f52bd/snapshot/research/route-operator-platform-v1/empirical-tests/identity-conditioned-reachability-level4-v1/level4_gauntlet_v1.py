from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any, Dict, List

from level4_target_system_v1 import Condition, execute_condition

ROOT = Path(__file__).resolve().parent
OPERATION_ID = "IDENTITY_CONDITIONED_REACHABILITY_CONTROLLED_RELATION_DISRUPTION_GAUNTLET_v1"
VERSION = "1.0.0"


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")


def digest(value: Any) -> str:
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def load_json(name: str) -> Any:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def build_conditions(system_spec: Dict[str, Any]) -> List[Condition]:
    return [Condition(**item) for item in system_spec["conditions"]]


def evaluate_assertion(receipt: Dict[str, Any], assertion: Dict[str, Any]) -> bool:
    field = assertion["field"]
    operator = assertion["operator"]
    expected = assertion["value"]
    actual = receipt[field]
    if operator == "EQUALS":
        return actual == expected
    if operator == "NOT_EQUALS":
        return actual != expected
    if operator == "CONTAINS":
        return expected in actual
    if operator == "NOT_CONTAINS":
        return expected not in actual
    raise ValueError(f"UNKNOWN_ASSERTION_OPERATOR:{operator}")


def alternative_prediction(model: Dict[str, Any], receipt: Dict[str, Any]) -> Dict[str, Any]:
    model_id = model["model_id"]
    if model_id == "OUTPUT_ONLY_MODEL":
        predicted_class = "FUNCTIONALLY_CONTINUOUS" if receipt["output_status"] == "PASS" else "FAILED"
        correct = (
            (predicted_class == "FAILED" and receipt["identity_class"] == "FRACTURED")
            or (predicted_class == "FUNCTIONALLY_CONTINUOUS" and receipt["identity_class"] == "ENDOGENOUSLY_PRESERVED")
        )
        return {"model_id": model_id, "predicted_identity_class": predicted_class, "correct": correct}
    if model_id == "UNRESTRICTED_SUBSTITUTION_MODEL":
        predicted_original_challenge = receipt["output_status"] == "PASS"
        return {
            "model_id": model_id,
            "predicted_original_challenge_pass": predicted_original_challenge,
            "correct": predicted_original_challenge == receipt["original_challenge_pass"],
        }
    if model_id == "ADDITIVE_CAPACITY_MODEL":
        capacity = 4 + int(receipt["extra_capacity_units"])
        predicted_output = "PASS" if capacity >= int(model["pass_threshold"]) else "FAIL"
        return {
            "model_id": model_id,
            "predicted_output_status": predicted_output,
            "correct": predicted_output == receipt["output_status"],
        }
    if model_id == "PROVENANCE_AGNOSTIC_RELIABILITY_MODEL":
        predicted_route_available = receipt["output_status"] == "PASS"
        return {
            "model_id": model_id,
            "predicted_original_route_available": predicted_route_available,
            "correct": predicted_route_available == receipt["original_route_available"],
        }
    raise ValueError(f"UNKNOWN_ALTERNATIVE_MODEL:{model_id}")


def run() -> Dict[str, Any]:
    contract = load_json("frozen-contract.v1.json")
    system_spec = load_json("system-spec.v1.json")
    prediction_matrix = load_json("prediction-matrix.v1.json")
    alternatives = load_json("alternative-models.v1.json")

    receipts = [execute_condition(condition) for condition in build_conditions(system_spec)]
    by_id = {receipt["condition_id"]: receipt for receipt in receipts}

    prediction_results: List[Dict[str, Any]] = []
    for prediction in prediction_matrix["predictions"]:
        condition_receipt = by_id[prediction["condition_id"]]
        assertion_results = [
            {
                **assertion,
                "actual": condition_receipt[assertion["field"]],
                "pass": evaluate_assertion(condition_receipt, assertion),
            }
            for assertion in prediction["assertions"]
        ]
        prediction_results.append(
            {
                "prediction_id": prediction["prediction_id"],
                "condition_id": prediction["condition_id"],
                "pass": all(item["pass"] for item in assertion_results),
                "assertions": assertion_results,
            }
        )

    matched_output = {
        condition_id: {
            "output_status": by_id[condition_id]["output_status"],
            "identity_class": by_id[condition_id]["identity_class"],
            "provenance": by_id[condition_id]["provenance"],
        }
        for condition_id in ["C1_ENDOGENOUS_BASELINE", "C2_EXTERNAL_SUPPORT", "C3_FUNCTIONAL_SUBSTITUTE"]
    }
    matched_output_discrimination_pass = (
        len({item["output_status"] for item in matched_output.values()}) == 1
        and len({item["identity_class"] for item in matched_output.values()}) == 3
    )

    alternative_results: List[Dict[str, Any]] = []
    for model in alternatives["models"]:
        condition_results = [alternative_prediction(model, receipt) for receipt in receipts]
        alternative_results.append(
            {
                "model_id": model["model_id"],
                "correct_count": sum(1 for item in condition_results if item["correct"]),
                "total_count": len(condition_results),
                "condition_results": condition_results,
            }
        )

    theory_pass = all(item["pass"] for item in prediction_results) and matched_output_discrimination_pass
    result_category = (
        "ENGINEERED_LEVEL4_PREDICTIONS_SURVIVED"
        if theory_pass
        else "ENGINEERED_LEVEL4_PREDICTION_FAILURE"
    )

    result = {
        "operation_id": OPERATION_ID,
        "version": VERSION,
        "contract_id": contract["contract_id"],
        "scope": contract["scope"],
        "result_category": result_category,
        "theory_prediction_pass": theory_pass,
        "matched_output_discrimination_pass": matched_output_discrimination_pass,
        "matched_output_conditions": matched_output,
        "prediction_results": prediction_results,
        "alternative_model_results": alternative_results,
        "condition_receipts": receipts,
        "scientific_boundary": {
            "natural_system_validation": False,
            "cross_domain_validation": False,
            "independent_relation_recovery_tested": False,
            "controlled_causal_route_manipulation_tested": True,
            "matched_output_identity_discrimination_tested": True,
            "relation_specific_route_reopening_tested": True,
            "hysteretic_reentry_tested": True,
        },
        "core_mutation_performed": False,
        "archived_result_mutation_performed": False,
        "post_result_repair_performed": False,
    }
    result["execution_receipt_sha256"] = digest(result)
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = run()
    rendered = json.dumps(result, indent=2, sort_keys=True) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")
    return 0 if result["theory_prediction_pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
