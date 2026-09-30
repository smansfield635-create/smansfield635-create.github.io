from __future__ import annotations

import argparse
import hashlib
import hmac
import json
from pathlib import Path
from typing import Any, Dict

ORIGINAL_KEY = b"ICR_ORIGINAL_LINEAGE_KEY_v1"
CHALLENGE_NONCE = b"ICR_ORIGINAL_LINEAGE_CHALLENGE_v1"


def canonical_bytes(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")


def receipt_digest(value: Dict[str, Any]) -> str:
    copy = dict(value)
    copy.pop("receipt_sha256", None)
    return hashlib.sha256(canonical_bytes(copy)).hexdigest()


def original_challenge_expected() -> str:
    return hmac.new(ORIGINAL_KEY, CHALLENGE_NONCE, hashlib.sha256).hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("receipt", type=Path)
    args = parser.parse_args()
    result = json.loads(args.receipt.read_text(encoding="utf-8"))
    checks = []

    conditions = {item["condition_id"]: item for item in result["condition_receipts"]}
    expected_classes = {
        "C1_ENDOGENOUS_BASELINE": "ENDOGENOUSLY_PRESERVED",
        "C2_EXTERNAL_SUPPORT": "EXTERNALLY_SUSTAINED",
        "C3_FUNCTIONAL_SUBSTITUTE": "FUNCTIONALLY_SUBSTITUTED",
        "C4_UNSUPPORTED_FRACTURE": "FRACTURED",
        "C5_UNRELATED_COMPENSATION": "FRACTURED",
        "C6_RELATION_SPECIFIC_RESTORATION": "ENDOGENOUSLY_PRESERVED",
        "C7_SUPPORT_WITHDRAWAL": "FRACTURED",
        "C8_HYSTERETIC_RESTORE_BEFORE_CLEARANCE": "FRACTURED",
        "C9_HYSTERETIC_REENTRY_AFTER_CLEARANCE": "RESTORED_WITH_HYSTERESIS",
    }
    for condition_id, expected in expected_classes.items():
        checks.append((condition_id + ":class", conditions[condition_id]["identity_class"] == expected))
        checks.append((condition_id + ":receipt_hash", conditions[condition_id]["receipt_sha256"] == receipt_digest(conditions[condition_id])))

    matched = [conditions[key]["output_status"] for key in [
        "C1_ENDOGENOUS_BASELINE", "C2_EXTERNAL_SUPPORT", "C3_FUNCTIONAL_SUBSTITUTE"
    ]]
    checks.append(("matched_output", matched == ["PASS", "PASS", "PASS"]))
    checks.append(("support_withdrawal_exposes_failure", conditions["C7_SUPPORT_WITHDRAWAL"]["output_status"] == "FAIL"))
    checks.append(("unrelated_capacity_does_not_reopen", not conditions["C5_UNRELATED_COMPENSATION"]["original_route_available"]))
    checks.append(("relation_restoration_reopens", conditions["C6_RELATION_SPECIFIC_RESTORATION"]["original_route_available"]))
    checks.append(("substitute_fails_original_challenge", not conditions["C3_FUNCTIONAL_SUBSTITUTE"]["original_challenge_pass"]))
    checks.append(("baseline_challenge_available", conditions["C1_ENDOGENOUS_BASELINE"]["original_challenge_pass"]))
    checks.append(("hysteretic_preclearance_held", conditions["C8_HYSTERETIC_RESTORE_BEFORE_CLEARANCE"]["failure_reason"] == "REENTRY_CLEARANCE_REQUIRED"))
    checks.append(("hysteretic_reentry_path", "reentry_clearance" in conditions["C9_HYSTERETIC_REENTRY_AFTER_CLEARANCE"]["route_steps"]))
    checks.append(("theory_disposition", result["result_category"] == "ENGINEERED_LEVEL4_PREDICTIONS_SURVIVED"))

    failed = [name for name, passed in checks if not passed]
    output = {
        "status": "PASS" if not failed else "FAIL",
        "checks_passed": len(checks) - len(failed),
        "checks_total": len(checks),
        "failed_checks": failed,
        "execution_receipt_sha256": result["execution_receipt_sha256"],
    }
    print(json.dumps(output, indent=2, sort_keys=True))
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
