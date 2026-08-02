from __future__ import annotations

from pathlib import Path
from typing import Any, Mapping
import hashlib
import json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
MANIFEST_PATH = HERE / "PUBLIC_RELEASE_RECORD_MANIFEST_SHA256_v1.json"

RELEASE_ID = "IMI_H_EARTH_GROUND_INSPECTION_DEPLOYABLE_RELEASE_v1"
RELEASE_VERSION = "1.0.0"
RELEASE_BUNDLE_SHA256 = "8ce02a5cb9d791799332afaae26cd6aedccbd4a39bfe8f4c40577d3fec237017"
RELEASE_BUNDLE_FILE_COUNT = 35
RELEASE_DRIVE_FOLDER_ID = "1WuXOsXnOsXkVchDav09tEsStBOyh9PNP"
RELEASE_DRIVE_FILE_ID = "1XmVzeY6Pw-PNVuc6fTiXJipJNs0SgTt4"
IMI_PACKAGE_ID = "IMI_OBSERVER_GRADE_INSTRUMENT_v1"
IMI_PACKAGE_VERSION = "1.0.0"
IMI_ZIP_SHA256 = "0be0608fa9aab10d75eeba796530421e96efc7829364172e52f7925ca74d9c87"
IMI_ZIP_SIZE_BYTES = 38893
IMI_INTERNAL_MANIFEST_SHA256 = "fd4de96ec3c2827ca54aac3cf1928ff90eb6e79b3dc3d3aaadb2a80c2780e0c2"
PLATFORM_ID = "ROUTE_OPERATOR_RESEARCH_PLATFORM_v1"
PLATFORM_VERSION = "1.0.0"
PLATFORM_MERGE_COMMIT = "cffa9889430d6700c3fad548d29dfada3dd04e61"
ROUTE_ID = "H_EARTH_GROUND_CELL_001_PATH3_GROUND_CONDITION_READ"
ROUTE_VERSION = "1.0.0"

CONTROLLED_PATHS = {
    ".github/workflows/imi-h-earth-ground-inspection-v1-conformance.yml",
    "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/IMI_BYTE_CUSTODY_RECEIPT_v1.json",
    "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/IMI_EXECUTABLE_RELEASE_RECEIPT_v1.json",
    "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/README.md",
    "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/RELEASE_POINTER.json",
}


def canonical_sha256(value: Mapping[str, Any]) -> str:
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def file_sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_json(path: Path, errors: list[str]) -> dict[str, Any]:
    if not path.is_file():
        errors.append(f"MISSING_FILE:{path.relative_to(ROOT)}")
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        errors.append(f"INVALID_JSON:{path.relative_to(ROOT)}:{type(exc).__name__}")
        return {}
    if not isinstance(value, dict):
        errors.append(f"JSON_ROOT_NOT_OBJECT:{path.relative_to(ROOT)}")
        return {}
    return value


def require(condition: bool, code: str, errors: list[str]) -> None:
    if not condition:
        errors.append(code)


def require_fields(actual: Mapping[str, Any], expected: Mapping[str, Any], prefix: str, errors: list[str]) -> None:
    for field, value in expected.items():
        require(actual.get(field) == value, f"{prefix}_{field.upper()}_MISMATCH", errors)


def verify_receipt(receipt: Mapping[str, Any], label: str, errors: list[str]) -> None:
    claimed = receipt.get("receipt_sha256")
    require(isinstance(claimed, str) and len(claimed) == 64, f"{label}_RECEIPT_SHA256_INVALID", errors)
    if isinstance(claimed, str):
        payload = dict(receipt)
        payload.pop("receipt_sha256", None)
        require(canonical_sha256(payload) == claimed, f"{label}_RECEIPT_HASH_MISMATCH", errors)


def main() -> None:
    errors: list[str] = []
    manifest = load_json(MANIFEST_PATH, errors)
    files = manifest.get("files")
    require(manifest.get("release_id") == RELEASE_ID, "PUBLIC_MANIFEST_RELEASE_ID_MISMATCH", errors)
    require(manifest.get("manifest_version") == "1.0.0", "PUBLIC_MANIFEST_VERSION_MISMATCH", errors)
    require(isinstance(files, dict), "PUBLIC_MANIFEST_FILES_INVALID", errors)
    if isinstance(files, dict):
        require(set(files) == CONTROLLED_PATHS, "PUBLIC_MANIFEST_PATH_SET_MISMATCH", errors)
        for relative, expected in sorted(files.items()):
            require(isinstance(expected, str) and len(expected) == 64, f"PUBLIC_MANIFEST_DIGEST_INVALID:{relative}", errors)
            path = ROOT / relative
            require(path.is_file(), f"PUBLIC_MANIFEST_FILE_MISSING:{relative}", errors)
            if path.is_file() and isinstance(expected, str):
                require(file_sha256(path) == expected, f"PUBLIC_MANIFEST_SHA256_MISMATCH:{relative}", errors)

    pointer = load_json(HERE / "RELEASE_POINTER.json", errors)
    custody = load_json(HERE / "IMI_BYTE_CUSTODY_RECEIPT_v1.json", errors)
    release = load_json(HERE / "IMI_EXECUTABLE_RELEASE_RECEIPT_v1.json", errors)
    readme_path = HERE / "README.md"
    readme = readme_path.read_text(encoding="utf-8") if readme_path.is_file() else ""
    require(bool(readme), "README_MISSING_OR_EMPTY", errors)

    verify_receipt(custody, "BYTE_CUSTODY", errors)
    verify_receipt(release, "EXECUTABLE_RELEASE", errors)

    require_fields(pointer, {
        "release_id": RELEASE_ID,
        "release_version": RELEASE_VERSION,
        "release_bundle_sha256": RELEASE_BUNDLE_SHA256,
        "release_bundle_file_count": RELEASE_BUNDLE_FILE_COUNT,
        "drive_folder_id": RELEASE_DRIVE_FOLDER_ID,
        "drive_file_id": RELEASE_DRIVE_FILE_ID,
        "route_id": ROUTE_ID,
        "route_version": ROUTE_VERSION,
        "observer_grade_imi_instrument_available": True,
        "empirical_reliability_and_validity": "OPEN",
    }, "POINTER", errors)

    dependency = pointer.get("private_imi_dependency")
    require(isinstance(dependency, dict), "POINTER_DEPENDENCY_OBJECT_INVALID", errors)
    if isinstance(dependency, dict):
        require_fields(dependency, {
            "package_id": IMI_PACKAGE_ID,
            "package_version": IMI_PACKAGE_VERSION,
            "zip_sha256": IMI_ZIP_SHA256,
            "custody_state": "BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY",
            "repository_mirror": False,
            "runtime_mount_required": True,
        }, "POINTER_DEPENDENCY", errors)

    platform = pointer.get("platform_binding")
    require(isinstance(platform, dict), "POINTER_PLATFORM_BINDING_INVALID", errors)
    if isinstance(platform, dict):
        require_fields(platform, {
            "platform_id": PLATFORM_ID,
            "platform_version": PLATFORM_VERSION,
            "platform_merge_commit_sha": PLATFORM_MERGE_COMMIT,
        }, "POINTER_PLATFORM", errors)

    require_fields(custody, {
        "receipt_id": "IMI_BYTE_CUSTODY_RECEIPT_v1",
        "custody_state": "BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY",
        "drive_file_id": "14WDLwcbHbc32sKoqWrmTonqbfs6EHOj-",
        "expected_zip_sha256": IMI_ZIP_SHA256,
        "observed_zip_sha256": IMI_ZIP_SHA256,
        "observed_size_bytes": IMI_ZIP_SIZE_BYTES,
        "internal_manifest_sha256": IMI_INTERNAL_MANIFEST_SHA256,
        "manifest_entry_count": 10,
        "all_manifest_entries_match": True,
        "zip_hash_match": True,
        "unmanifested_payload_files": [],
    }, "CUSTODY", errors)
    classifications = custody.get("artifact_classification")
    require(isinstance(classifications, list) and len(classifications) >= 10, "CUSTODY_CLASSIFICATION_REGISTRY_INVALID", errors)
    if isinstance(classifications, list):
        paths = [item.get("path") for item in classifications if isinstance(item, dict)]
        require(len(paths) == len(set(paths)), "CUSTODY_CLASSIFICATION_DUPLICATE_PATH", errors)
        for item in classifications:
            require(isinstance(item, dict), "CUSTODY_CLASSIFICATION_ENTRY_INVALID", errors)
            if isinstance(item, dict):
                digest = item.get("sha256")
                require(isinstance(digest, str) and len(digest) == 64, f"CUSTODY_CLASSIFICATION_DIGEST_INVALID:{item.get('path')}", errors)

    require_fields(release, {
        "release_id": RELEASE_ID,
        "release_version": RELEASE_VERSION,
        "release_state": "PASS",
        "observer_grade_imi_instrument_available": True,
        "empirical_reliability_and_validity": "OPEN",
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "platform_merge_commit_sha": PLATFORM_MERGE_COMMIT,
        "imi_package_id": IMI_PACKAGE_ID,
        "imi_package_version": IMI_PACKAGE_VERSION,
        "zip_sha256": IMI_ZIP_SHA256,
        "route_id": ROUTE_ID,
        "route_version": ROUTE_VERSION,
        "original_snapshot_fixtures_passed": 29,
        "original_temporal_fixtures_passed": 4,
        "deployment_training_cases_passed": 16,
        "terminal_positive_training_cases": 1,
        "false_positive_terminal_cases": 0,
        "errors": [],
    }, "RELEASE", errors)
    checks = release.get("checks")
    require(isinstance(checks, dict) and bool(checks) and all(value is True for value in checks.values()), "RELEASE_CHECKS_NOT_ALL_TRUE", errors)
    require(pointer.get("executable_release_receipt_sha256") == release.get("receipt_sha256"), "POINTER_EXECUTABLE_RECEIPT_HASH_MISMATCH", errors)

    for token in [
        "OBSERVER_GRADE_IMI_INSTRUMENT_AVAILABLE", ROUTE_ID, IMI_ZIP_SHA256,
        RELEASE_BUNDLE_SHA256, RELEASE_DRIVE_FOLDER_ID, RELEASE_DRIVE_FILE_ID,
        "29 snapshot fixtures", "4 temporal fixtures", "16 deployment training cases",
        "zero false-positive IMI-7 cases",
    ]:
        require(token in readme, f"README_REQUIRED_TOKEN_MISSING:{token}", errors)

    errors = sorted(set(errors))
    result: dict[str, Any] = {
        "receipt_id": "IMI_REPOSITORY_RECORD_CONFORMANCE_RECEIPT_v1",
        "release_id": RELEASE_ID,
        "release_version": RELEASE_VERSION,
        "status": "PASS" if not errors else "FAIL",
        "observer_grade_imi_instrument_available": not errors,
        "empirical_reliability_and_validity": "OPEN",
        "platform_merge_commit_sha": PLATFORM_MERGE_COMMIT,
        "release_bundle_sha256": RELEASE_BUNDLE_SHA256,
        "release_bundle_file_count": RELEASE_BUNDLE_FILE_COUNT,
        "imi_dependency_sha256": IMI_ZIP_SHA256,
        "custody_state": custody.get("custody_state"),
        "executable_release_receipt_sha256": release.get("receipt_sha256"),
        "public_manifest_controlled_path_count": len(files) if isinstance(files, dict) else 0,
        "errors": errors,
    }
    result["receipt_sha256"] = canonical_sha256(result)
    print(json.dumps(result, indent=2, sort_keys=True))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
