from __future__ import annotations

from pathlib import Path
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parent
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
EXPECTED = {
    "extension_id": "IMI_FALSIFICATION_ROUTE_EXTENSION_v1",
    "extension_version": "1.0.0",
    "zip_sha256": "74a1cf877d10788c3e455fb3318d8eabd3fefdb91a9a7a0e918fe2f860492e8e",
    "zip_size_bytes": 29812,
    "package_file_count": 21,
    "drive_file_id": "1K07Nt5NL46TV_LtypRJ-R4hMOMvhJqG7",
    "drive_parent_folder_id": "1GwAuA0ZEqNRhH0Oj7e_00nner0esAYdQ",
    "core_package_sha256": "0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87",
}


def load(name: str) -> dict:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    errors: list[str] = []
    checks = 0

    required = [
        "EXTENSION_PACKAGE_POINTER.json",
        "RATIFICATION_POINTER.json",
        "EXTENSION_POINTER_MANIFEST_SHA256.json",
        "README.md",
    ]
    for name in required:
        checks += 1
        if not (ROOT / name).is_file():
            errors.append(f"MISSING_REQUIRED_FILE:{name}")

    if errors:
        print(json.dumps({"verification_status": "FAIL", "checks_executed": checks, "errors": errors}, indent=2))
        return 1

    pointer = load("EXTENSION_PACKAGE_POINTER.json")
    ratification = load("RATIFICATION_POINTER.json")
    manifest = load("EXTENSION_POINTER_MANIFEST_SHA256.json")

    exact_pointer = {
        "package_id": EXPECTED["extension_id"],
        "package_version": EXPECTED["extension_version"],
        "zip_sha256": EXPECTED["zip_sha256"],
        "zip_size_bytes": EXPECTED["zip_size_bytes"],
        "package_file_count": EXPECTED["package_file_count"],
        "drive_file_id": EXPECTED["drive_file_id"],
        "drive_parent_folder_id": EXPECTED["drive_parent_folder_id"],
        "core_package_sha256": EXPECTED["core_package_sha256"],
        "ratification_status": "PASS_CLOSED",
        "operational_status": "ACTIVE_READY_FOR_FIRST_FROZEN_PILOT",
        "real_outcome_adjudication": "HELD",
        "core_mutation_performed": False,
        "core_output_schema_mutation_performed": False,
        "custody_readback_status": "PASS_EXACT_SHA256_AND_SIZE",
    }
    for key, expected in exact_pointer.items():
        checks += 1
        if pointer.get(key) != expected:
            errors.append(f"POINTER_MISMATCH:{key}")

    checks += 1
    if not SHA256_RE.fullmatch(str(pointer.get("zip_sha256", ""))):
        errors.append("INVALID_ZIP_SHA256")

    exact_ratification = {
        "extension_id": EXPECTED["extension_id"],
        "extension_version": EXPECTED["extension_version"],
        "verification_status": "PASS",
        "ratification_status": "PASS_CLOSED",
        "operational_status": "ACTIVE_READY_FOR_FIRST_FROZEN_PILOT",
        "checks_executed": 52,
        "negative_fixtures_total": 19,
        "negative_fixtures_passed": 19,
        "positive_fixtures_passed": 1,
        "schema_count": 9,
        "manifest_integrity": "PASS",
        "package_checksums": "PASS",
        "operational_cli": "PASS",
        "core_nonmutation": "PASS",
        "core_mutation_performed": False,
        "core_output_schema_mutation_performed": False,
        "real_outcome_adjudication": "HELD",
        "real_outcome_adjudication_performed": False,
    }
    for key, expected in exact_ratification.items():
        checks += 1
        if ratification.get(key) != expected:
            errors.append(f"RATIFICATION_MISMATCH:{key}")

    for key in ["internal_verification_receipt_sha256", "internal_ratification_receipt_sha256"]:
        checks += 1
        if not SHA256_RE.fullmatch(str(ratification.get(key, ""))):
            errors.append(f"INVALID_RECEIPT_SHA256:{key}")

    checks += 1
    if manifest.get("status") != "PASS_CLOSED_OPERATIONAL_POINTER":
        errors.append("MANIFEST_STATUS_MISMATCH")
    checks += 1
    if manifest.get("core_mutation_performed") is not False:
        errors.append("MANIFEST_CORE_MUTATION")

    declared = manifest.get("artifacts", [])
    checks += 1
    if not isinstance(declared, list) or len(declared) != 3:
        errors.append("MANIFEST_ARTIFACT_SET_INVALID")
    else:
        for item in declared:
            path = ROOT / str(item.get("path", ""))
            checks += 3
            if not path.is_file():
                errors.append(f"MANIFEST_FILE_MISSING:{item.get('path')}")
                continue
            if item.get("sha256") != digest(path):
                errors.append(f"MANIFEST_HASH_MISMATCH:{item.get('path')}")
            if item.get("bytes") != path.stat().st_size:
                errors.append(f"MANIFEST_SIZE_MISMATCH:{item.get('path')}")

    result = {
        "extension_id": EXPECTED["extension_id"],
        "verification_status": "FAIL" if errors else "PASS",
        "ratification_status": ratification.get("ratification_status"),
        "operational_status": ratification.get("operational_status"),
        "checks_executed": checks,
        "core_mutation_performed": False,
        "real_outcome_adjudication": "HELD",
        "errors": errors,
    }
    print(json.dumps(result, indent=2, sort_keys=True))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
