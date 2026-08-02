from __future__ import annotations

from pathlib import Path
from typing import Any, Mapping
import hashlib
import json

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[3]
MANIFEST = HERE / "PUBLIC_RELEASE_RECORD_MANIFEST_SHA256_v1.json"

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


def canonical_sha256(value: Mapping[str, Any]) -> str:
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def file_sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_json(path: Path, errors: list[str]) -> dict[str, Any]:
    if not path.is_file():
        errors.append(f"MISSING_FILE:{path.relative_to(REPO_ROOT)}")
        return {}
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        errors.append(f"INVALID_JSON:{path.relative_to(REPO_ROOT)}:{type(exc).__name__}")
        return {}
    if not isinstance(value, dict):
        errors.append(f"JSON_ROOT_NOT_OBJECT:{path.relative_to(REPO_ROOT)}")
        return {}
    return value


def verify_receipt(receipt: Mapping[str, Any], label: str, errors: list[str]) -> None:
    claimed = receipt.get("receipt_sha256")
    if not isinstance(claimed, str) or len(claimed) != 64:
        errors.append(f"{label}_RECEIPT_SHA256_INVALID")
        return
    payload = dict(receipt)
    payload.pop("receipt_sha256", None)
    if canonical_sha256(payload) != claimed:
        errors.append(f"{label}_RECEIPT_HASH_MISMATCH")


def require(condition: bool, code: str, errors: list[str]) -> None:
    if not condition:
        errors.append(code)


def verify_public_manifest(errors: list[str]) -> dict[str, Any]:
    manifest = load_json(MANIFEST, errors)
    files = manifest.get("files")
    if not isinstance(files, dict) or not files:
        errors.append("PUBLIC_MANIFEST_FILES_INVALID")
        return manifest
    require(manifest.get("release_id") == RELEASE_ID, "PUBLIC_MANIFEST_RELEASE_ID_MISMATCH", errors)
    require(manifest.get("manifest_version") == "1.0.0", "PUBLIC_MANIFEST_VERSION_MISMATCH", errors)
    expected_paths = {
        ".github/workflows/imi-h-earth-ground-inspection-v1-conformance.yml",
        "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/IMI_BYTE_CUSTODY_RECEIPT_v1.json",
        "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/IMI_EXECUTABLE_RELEASE_RECEIPT_v1.json",
        "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/README.md",
        "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/RELEASE_POINTER.json",
        "research/route-operator-platform-v1/deployments/imi-h-earth-ground-inspection-v1/verify_release_records_v1.py",
    }
    require(set(files) == expected_paths, "PUBLIC_MANIFEST_PATH_SET_MISMATCH", errors)
    for relative, expected in sorted(files.items()):
        if not isinstance(expected, str) or len(expected) != 64:
            errors.append(f"PUBLIC_MANIFEST_DIGEST_INVALID:{relative}")
            continue
        path = REPO_ROOT / relative
        if not path.is_file():
            errors.append(f"PUBLIC_MANIFEST_FILE_MISSING:{relative}")
        elif file_sha256(path) != expected:
            errors.append(f"PUBLIC_MANIFEST_SHA256_MISMATCH:{relative}")
    return manifest


def main() -> None:
    errors: list[str] = []
    manifest = verify_public_manifest(errors)

    pointer = load_json(HERE / "RELEASE_POINTER.json", errors)
    custody = load_json(HERE / "IMI_BYTE_CUSTODY_RECEIPT_v1.json", errors)
    release = load_json(HERE / "IMI_EXECUTABLE_RELEASE_RECEIPT_v1.json", errors)
    readme_path = HERE / "README.md"
    readme = readme_path.read_text(encoding="utf-8") if readme_path.is_file() else ""
    if not readme:
        errors.append("README_MISSING_OR_EMPTY")

    verify_receipt(custody, "BYTE_CUSTODY", errors)
    verify_receipt(release, "EXECUTABLE_RELEASE", errors)

    require(pointer.get("release_id") == RELEASE_ID, "POINTER_RELEASE_ID_MISMATCH", errors)
    require(pointer.get("release_version") == RELEASE_VERSION, "POINTER_RELEASE_VERSION_MISMATCH", errors)
    require(pointer.get("release_bundle_sha256") == RELEASE_BUNDLE_SHA256, "POINTER_BUNDLE_SHA256_MISMATCH", errors)
    require(pointer.get("release_bundle_file_count") == RELEASE_BUNDLE_FILE_COUNT, "POINTER_FILE_COUNT_MISMATCH", errors)
    require(pointer.get("drive_folder_id") == RELEASE_DRIVE_FOLDER_ID, "POINTER_DRIVE_FOLDER_MISMATCH", errors)
    require(pointer.get("drive_file_id") == RELEASE_DRIVE_FILE_ID, "POINTER_DRIVE_FILE_MISMATCH", errors)
    require(pointer.get("route_id") == ROUTE_ID, "POINTER_ROUTE_ID_MISMATCH", errors)
    require(pointer.get("route_version") == ROUTE_VERSION, "POINTER_ROUTE_VERSION_MISMATCH", errors)
    require(pointer.get("observer_grade_imi_instrument_available") is True, "POINTER_INSTRUMENT_AVAILABILITY_NOT_TRUE", errors)
    require(pointer.get("empirical_reliability_and_validity") == "OPEN", "POINTER_EMPIRICAL_STATUS_MISMATCH", errors)

    dependency = pointer.get("private_imi_dependency")
    if not isinstance(dependency, dict):
        errors.append("POINTER_DEPENDENCY_OBJECT_INVALID")
        dependency = {}
    require(dependency.get("package_id") == IMI_PACKAGE_ID, "POINTER_IMI_PACKAGE_ID_MISMATCH", errors)
    require(dependency.get("package_version") == IMI_PACKAGE_VERSION, "POINTER_IMI_PACKAGE_VERSION_MISMATCH", errors)
    require(dependency.get("zip_sha256") == IMI_ZIP_SHA256, "POINTER_IMI_ZIP_SHA256_MISMATCH", errors)
    require(dependency.get("custody_state") == "BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY", "POINTER_CUSTODY_STATE_MISMATCH", errors)
    require(dependency.get("repository_mirror") is False, "POINTER_REPOSITORY_MIRROR_NOT_FALSE", errors)
    require(dependency.get("runtime_mount_required") is True, "POINTER_RUNTIME_MOUNT_NOT_TRUE", errors)

    platform = pointer.get("platform_binding")
    if not isinstance(platform, dict):
        errors.append("POINTER_PLATFORM_BINDING_INVALID")
        platform = {}
    require(platform.get("platform_id") == PLATFORM_ID, "POINTER_PLATFORM_ID_MISMATCH", errors)
    require(platform.get("platform_version") == PLATFORM_VERSION, "POINTER_PLATFORM_VERSION_MISMATCH", errors)
    require(platform.get("platform_merge_commit_sha") == PLATFORM_MERGE_COMMIT, "POINTER_PLATFORM_COMMIT_MISMATCH", errors)

    require(custody.get("receipt_id") == "IMI_BYTE_CUSTODY_RECEIPT_v1", "CUSTODY_RECEIPT_ID_MISMATCH", errors)
    require(custody.get("custody_state") == "BYTE_VERIFIED_EXTERNAL_INSTRUMENT_DEPENDENCY", "CUSTODY_STATE_MISMATCH", errors)
    require(custody.get("drive_file_id") == "14WDLwcbHbc32sKoqWrmTonqbfs6EHOj-", "CUSTODY_DRIVE_FILE_MISMATCH", errors)
    require(custody.get("expected_zip_sha256") == IMI_ZIP_SHA256, "CUSTODY_EXPECTED_ZIP_MISMATCH", errors)
    require(custody.get("observed_zip_sha256") == IMI_ZIP_SHA256, "CUSTODY_OBSERVED_ZIP_MISMATCH", errors)
    require(custody.get("observed_size_bytes") == IMI_ZIP_SIZE_BYTES, "CUSTODY_SIZE_MISMATCH", errors)
    require(custody.get("internal_manifest_sha256") == IMI_INTERNAL_MANIFEST_SHA256, "CUSTODY_INTERNAL_MANIFEST_MISMATCH", errors)
    require(custody.get("manifest_entry_count") == 10, "CUSTODY_MANIFEST_ENTRY_COUNT_MISMATCH", errors)
    require(custody.get("all_manifest_entries_match") is True, "CUSTODY_MANIFEST_MATCH_NOT_TRUE", errors)
    require(custody.get("zip_hash_match") is True, "CUSTODY_ZIP_HASH_MATCH_NOT_TRUE", errors)
    require(custody.get("unmanifested_payload_files") == [], "CUSTODY_UNMANIFESTED_FILES_NOT_EMPTY", errors)
    classifications = custody.get("artifact_classification")
    require(isinstance(classifications, list) and len(classifications) >= 10, "CUSTODY_CLASSIFICATION_REGISTRY_INVALID", errors)
    if isinstance(classifications, list):
        paths = [item.get("path") for item in classifications if isinstance(item, dict)]
        require(len(paths) == len(set(paths)), "CUSTODY_CLASSIFICATION_DUPLICATE_PATH", errors)
        for item in classifications:
            if not isinstance(item, dict):
                errors.append("CUSTODY_CLASSIFICATION_ENTRY_INVALID")
                continue
            digest = item.get("sha256")
            require(isinstance(digest, str) and len(digest) == 64, f"CUSTODY_CLASSIFICATION_DIGEST_INVALID:{item.get('path')}", errors)

    require(release.get("release_id") == RELEASE_ID, "RELEASE_RECEIPT_ID_MISMATCH", errors)
    require(release.get("release_version") == RELEASE_VERSION, "RELEASE_RECEIPT_VERSION_MISMATCH", errors)
    require(release.get("release_state") == "PASS", "RELEASE_STATE_NOT_PASS", errors)
    require(release.get("observer_grade_imi_instrument_available") is True, "RELEASE_INSTRUMENT_AVAILABILITY_NOT_TRUE", errors)
    require(release.get("empirical_reliability_and_validity") == "OPEN", "RELEASE_EMPIRICAL_STATUS_MISMATCH", errors)
    require(release.get("platform_id") == PLATFORM_ID, "RELEASE_PLATFORM_ID_MISMATCH", errors)
    require(release.get("platform_version") == PLATFORM_VERSION, "RELEASE_PLATFORM_VERSION_MISMATCH", errors)
    require(release.get("platform_merge_commit_sha") == PLATFORM_MERGE_COMMIT, "RELEASE_PLATFORM_COMMIT_MISMATCH", errors)
    require(release.get("imi_package_id") == IMI_PACKAGE_ID, "RELEASE_IMI_PACKAGE_ID_MISMATCH", errors)
    require(release.get("imi_package_version") == IMI_PACKAGE_VERSION, "RELEASE_IMI_PACKAGE_VERSION_MISMATCH", errors)
    require(release.get("zip_sha256") == IMI_ZIP_SHA256, "RELEASE_IMI_ZIP_SHA256_MISMATCH", errors)
    require(release.get("route_id") == ROUTE_ID, "RELEASE_ROUTE_ID_MISMATCH", errors)
    require(release.get("route_version") == ROUTE_VERSION, "RELEASE_ROUTE_VERSION_MISMATCH", errors)
    require(release.get("original_snapshot_fixtures_passed") == 29, "RELEASE_SNAPSHOT_FIXTURE_COUNT_MISMATCH", errors)
    require(release.get("original_temporal_fixtures_passed") == 4, "RELEASE_TEMPORAL_FIXTURE_COUNT_MISMATCH", errors)
    require(release.get("deployment_training_cases_passed") == 16, "RELEASE_TRAINING_CASE_COUNT_MISMATCH", errors)
    require(release.get("false_positive_terminal_cases") == 0, "RELEASE_FALSE_POSITIVE_TERMINAL_NONZERO", errors)
    require(release.get("terminal_positive_training_cases") == 1, "RELEASE_TERMINAL_POSITIVE_COUNT_MISMATCH", errors)
    require(release.get("errors") == [], "RELEASE_ERRORS_NOT_EMPTY", errors)
    checks = release.get("checks")
    require(isinstance(checks, dict) and bool(checks) and all(value is True for value in checks.values()), "RELEASE_CHECKS_NOT_ALL_TRUE", errors)
    require(pointer.get("executable_release_receipt_sha256") == release.get("receipt_sha256"), "POINTER_EXECUTABLE_RECEIPT_HASH_MISMATCH", errors)

    required_readme_tokens = [
        "OBSERVER_GRADE_IMI_INSTRUMENT_AVAILABLE",
        ROUTE_ID,
        IMI_ZIP_SHA256,
        RELEASE_BUNDLE_SHA256,
        RELEASE_DRIVE_FOLDER_ID,
        RELEASE_DRIVE_FILE_ID,
        "29 snapshot fixtures",
        "4 temporal fixtures",
        "16 deployment training cases",
        "zero false-positive IMI-7 cases",
    ]
    for token in required_readme_tokens:
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
        "public_manifest_controlled_path_count": len(manifest.get("files", {})) if isinstance(manifest.get("files"), dict) else 0,
        "errors": errors,
    }
    result["receipt_sha256"] = canonical_sha256(result)
    print(json.dumps(result, indent=2, sort_keys=True))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
