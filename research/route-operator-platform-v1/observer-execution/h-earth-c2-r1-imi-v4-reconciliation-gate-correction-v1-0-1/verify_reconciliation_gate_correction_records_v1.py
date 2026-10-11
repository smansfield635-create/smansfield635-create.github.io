from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
from typing import Any, Mapping

HERE = Path(__file__).resolve().parent

EXPECTED_OPERATION = "H_EARTH_C2_R1_IMI_V4_RECONCILIATION_GATE_LOGIC_CORRECTION_001"
EXPECTED_PACKAGE_SHA256 = "e206ba9999b743525825e3601daabb1c77d6346c77144d462e44f2b5ccf4fe2c"
EXPECTED_SOURCE_SHA256 = "5193b73129d75ce167ec62ba89115f916ffbcb7b837f0935ef828b2d62d2f6d0"
EXPECTED_CURRENT_RECONCILIATION_SHA256 = "39a6823f4d6b3880599a84bccaa98dc4dcdb4dcd28f8409db4de7d52d05eb562"
EXPECTED_CURRENT_ROLE5_GATE_SHA256 = "7853d78a5693ea302a9a9ad749c28a24022ba1b9a7f6346d71a718f332bb82a7"
EXPECTED_CUSTODY_SHA256 = "6425dabf76bfec40e644e8577b05c105f13d90f7c077b391ffbf036fcf9ad128"
EXPECTED_VALIDATOR_SHA256 = "b590cd64198dc50131fb0782b55a73f6aef5224a26aaeeb7e19c522981e92007"


def canonical_sha256(value: Mapping[str, Any]) -> str:
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    ).hexdigest()


def file_sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(name: str, errors: list[str]) -> dict[str, Any]:
    path = HERE / name
    if not path.is_file():
        errors.append("MISSING_FILE:" + name)
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        errors.append(f"INVALID_JSON:{name}:{type(exc).__name__}")
        return {}
    if not isinstance(value, dict):
        errors.append("JSON_ROOT_NOT_OBJECT:" + name)
        return {}
    return value


def verify_receipt(value: Mapping[str, Any], label: str, errors: list[str]) -> None:
    claimed = value.get("receipt_sha256")
    if not isinstance(claimed, str) or len(claimed) != 64:
        errors.append(label + "_RECEIPT_SHA256_INVALID")
        return
    payload = dict(value)
    payload.pop("receipt_sha256", None)
    if canonical_sha256(payload) != claimed:
        errors.append(label + "_RECEIPT_HASH_MISMATCH")


def require(condition: bool, code: str, errors: list[str]) -> None:
    if not condition:
        errors.append(code)


def main() -> None:
    errors: list[str] = []
    result = load("CORRECTION_RESULT_v1.json", errors)
    current = load("CURRENT_CASE_ROLE4_RECONCILIATION_RECEIPT_v1_0_1.json", errors)
    gate = load("CURRENT_CASE_ROLE5_INTAKE_GATE_v1_0_1.json", errors)
    custody = load("SUCCESSOR_PACKAGE_CUSTODY_RECEIPT_v1.json", errors)
    pointer = load("RELEASE_POINTER.json", errors)
    manifest = load("PUBLIC_RECORD_MANIFEST_SHA256_v1.json", errors)

    for label, value in [
        ("CORRECTION_RESULT", result),
        ("CURRENT_RECONCILIATION", current),
        ("CURRENT_ROLE5_GATE", gate),
        ("CUSTODY", custody),
        ("RELEASE_POINTER", pointer),
    ]:
        if value:
            verify_receipt(value, label, errors)

    manifest_claim = manifest.get("manifest_sha256")
    manifest_payload = dict(manifest)
    manifest_payload.pop("manifest_sha256", None)
    require(canonical_sha256(manifest_payload) == manifest_claim, "PUBLIC_MANIFEST_RECEIPT_HASH_MISMATCH", errors)
    files = manifest.get("files")
    expected_names = {
        "CORRECTION_RESULT_v1.json",
        "CURRENT_CASE_ROLE4_RECONCILIATION_RECEIPT_v1_0_1.json",
        "CURRENT_CASE_ROLE5_INTAKE_GATE_v1_0_1.json",
        "README.md",
        "RELEASE_POINTER.json",
        "SUCCESSOR_PACKAGE_CUSTODY_RECEIPT_v1.json",
    }
    require(isinstance(files, dict) and set(files) == expected_names, "PUBLIC_MANIFEST_PATH_SET_MISMATCH", errors)
    if isinstance(files, dict):
        for name, metadata in files.items():
            path = HERE / name
            require(path.is_file(), "PUBLIC_MANIFEST_FILE_MISSING:" + name, errors)
            if path.is_file() and isinstance(metadata, dict):
                require(file_sha256(path) == metadata.get("sha256"), "PUBLIC_MANIFEST_SHA256_MISMATCH:" + name, errors)
                require(path.stat().st_size == metadata.get("size_bytes"), "PUBLIC_MANIFEST_SIZE_MISMATCH:" + name, errors)

    require(result.get("operation_id") == EXPECTED_OPERATION, "RESULT_OPERATION_ID_MISMATCH", errors)
    require(result.get("source_package_sha256") == EXPECTED_SOURCE_SHA256, "RESULT_SOURCE_SHA256_MISMATCH", errors)
    require(result.get("package_sha256") == EXPECTED_PACKAGE_SHA256, "RESULT_PACKAGE_SHA256_MISMATCH", errors)
    require(result.get("v4_semantics_changed") is False, "RESULT_V4_SEMANTICS_CHANGED", errors)
    require(result.get("v4_gap_discovered") is False, "RESULT_V4_GAP_DISCOVERED", errors)
    require(result.get("observer_receipts_changed") is False, "RESULT_OBSERVER_RECEIPTS_CHANGED", errors)
    require(result.get("observer_reexecution_performed") is False, "RESULT_OBSERVER_REEXECUTION", errors)
    require(result.get("truth_table_fixture_count") == 7, "RESULT_TRUTH_TABLE_COUNT_MISMATCH", errors)
    require(result.get("truth_table_fixture_result") == "PASS", "RESULT_TRUTH_TABLE_NOT_PASS", errors)
    require(result.get("validator_result") == "PASS", "RESULT_VALIDATOR_NOT_PASS", errors)
    require(result.get("validator_receipt_sha256") == EXPECTED_VALIDATOR_SHA256, "RESULT_VALIDATOR_SHA256_MISMATCH", errors)
    require(result.get("current_case_reconciliation_result") == "VALID_CONCORDANT_CONTROLLING_DEFECT", "RESULT_CURRENT_RECONCILIATION_MISMATCH", errors)
    require(result.get("current_case_role5_gate") == "HOLD", "RESULT_CURRENT_ROLE5_GATE_NOT_HOLD", errors)
    require(result.get("current_case_reconciliation_receipt_freezable") is True, "RESULT_CURRENT_RECEIPT_NOT_FREEZABLE", errors)
    require(result.get("product_mutation") is False, "RESULT_PRODUCT_MUTATION", errors)
    require(result.get("pr_512_mutation_or_merge") is False, "RESULT_PR512_MUTATION", errors)

    require(current.get("receipt_sha256") == EXPECTED_CURRENT_RECONCILIATION_SHA256, "CURRENT_RECONCILIATION_SHA256_MISMATCH", errors)
    require(current.get("observer_a_receipt_sha256") == "686a388e46e6f737ed49bf82aeb391ccaf511dcdbb54ae52b80d338225a778d9", "OBSERVER_A_SHA256_MISMATCH", errors)
    require(current.get("observer_b_receipt_sha256") == "2085169150fbe077e2dc2ed485095823dcc852a56f347d61d7837c73243f1c26", "OBSERVER_B_SHA256_MISMATCH", errors)
    require(current.get("observer_agreement_gate") == "PASS_CLOSED", "OBSERVER_AGREEMENT_GATE_MISMATCH", errors)
    require(current.get("third_observer_required") is False, "THIRD_OBSERVER_NOT_FALSE", errors)
    require(current.get("unresolved_controlling_defect") is True, "CONTROLLING_DEFECT_NOT_TRUE", errors)
    require(current.get("controlling_factor") == "INLAND_ANCHOR_OCCLUSION_CLEARANCE", "CONTROLLING_FACTOR_MISMATCH", errors)
    require(current.get("controlling_factor_value") == 0.8, "CONTROLLING_FACTOR_VALUE_MISMATCH", errors)
    require(current.get("accepted_unobstructed_fraction") == 0.6959409401844713, "UNOBSTRUCTED_FRACTION_MISMATCH", errors)
    require(current.get("imi_result") == 0.8, "IMI_RESULT_MISMATCH", errors)
    require(current.get("role5_gate") == "HOLD", "CURRENT_ROLE5_GATE_NOT_HOLD", errors)
    require(current.get("reconciliation_receipt_freezable") is True, "CURRENT_RECONCILIATION_NOT_FREEZABLE", errors)

    predicates = current.get("role5_gate_predicates") if isinstance(current.get("role5_gate_predicates"), dict) else {}
    required_open = [
        "receipts_valid", "independence_valid", "identities_valid", "agreement_pass",
        "invalid_state_false", "unevaluable_state_false", "cross_observer_contamination_false",
        "pending_disagreement_route_false", "unresolved_controlling_defect_false",
        "reconciliation_receipt_valid_and_freezable",
    ]
    derived_gate = "OPEN" if all(predicates.get(key) is True for key in required_open) else "HOLD"
    require(derived_gate == current.get("role5_gate") == gate.get("gate_result"), "CORRECTED_GATE_DERIVATION_MISMATCH", errors)
    require(gate.get("receipt_sha256") == EXPECTED_CURRENT_ROLE5_GATE_SHA256, "CURRENT_ROLE5_GATE_SHA256_MISMATCH", errors)
    require(gate.get("role4_reconciliation_receipt_sha256") == current.get("receipt_sha256"), "CURRENT_GATE_RECONCILIATION_LINK_MISMATCH", errors)

    require(custody.get("receipt_sha256") == EXPECTED_CUSTODY_SHA256, "CUSTODY_RECEIPT_SHA256_MISMATCH", errors)
    require(custody.get("package_sha256") == EXPECTED_PACKAGE_SHA256, "CUSTODY_PACKAGE_SHA256_MISMATCH", errors)
    require(custody.get("fetchback_verified") is True, "CUSTODY_FETCHBACK_NOT_TRUE", errors)
    require(custody.get("fetchback_validator_result") == "PASS", "CUSTODY_VALIDATOR_NOT_PASS", errors)
    require(pointer.get("successor_package_sha256") == EXPECTED_PACKAGE_SHA256, "POINTER_PACKAGE_SHA256_MISMATCH", errors)
    require(pointer.get("product_pr") == 512 and pointer.get("product_pr_required_state") == "OPEN_DRAFT_UNMERGED", "POINTER_PR512_STATE_MISMATCH", errors)

    readme = (HERE / "README.md").read_text(encoding="utf-8") if (HERE / "README.md").is_file() else ""
    for token in [
        "VALID_CONCORDANT_CONTROLLING_DEFECT", "Role 5 gate: `HOLD`",
        EXPECTED_PACKAGE_SHA256, "PR #512 remains draft and unmerged",
    ]:
        require(token in readme, "README_TOKEN_MISSING:" + token, errors)

    errors = sorted(set(errors))
    receipt: dict[str, Any] = {
        "receipt_id": "H_EARTH_C2_R1_IMI_V4_RECONCILIATION_GATE_CORRECTION_REPOSITORY_CONFORMANCE_RECEIPT_v1",
        "operation_id": EXPECTED_OPERATION,
        "github_head_sha": os.getenv("GITHUB_SHA"),
        "status": "PASS" if not errors else "FAIL",
        "errors": errors,
        "successor_package_sha256": EXPECTED_PACKAGE_SHA256,
        "source_package_sha256": EXPECTED_SOURCE_SHA256,
        "truth_table_fixture_count": 7,
        "truth_table_fixture_result": "PASS" if not errors else "FAIL",
        "current_case_reconciliation_result": current.get("reconciliation_result"),
        "current_case_role5_gate": current.get("role5_gate"),
        "current_case_reconciliation_receipt_freezable": current.get("reconciliation_receipt_freezable"),
        "public_manifest_controlled_record_count": len(files) if isinstance(files, dict) else 0,
        "v4_semantics_changed": False,
        "observer_receipts_changed": False,
        "product_mutation": False,
    }
    receipt["receipt_sha256"] = canonical_sha256(receipt)
    print(json.dumps(receipt, indent=2, sort_keys=True))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
