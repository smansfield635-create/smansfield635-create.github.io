#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "MANIFEST_SHA256.json"

REQUIRED_FILES = {
    "README.md",
    "PREREGISTRATION.md",
    "protocol.v1.json",
    "route-submission-schema.v1.json",
    "execution-state.v1.json",
}

def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")

def load_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"{path.name}: invalid JSON: {exc}")

def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main() -> int:
    manifest = load_json(MANIFEST)
    entries = manifest.get("files")
    if not isinstance(entries, dict):
        fail("manifest files must be an object")
    if set(entries) != REQUIRED_FILES:
        fail(f"manifest file set mismatch: {sorted(entries)}")

    for name, expected in sorted(entries.items()):
        path = ROOT / name
        if not path.is_file():
            fail(f"missing file: {name}")
        actual = sha256(path)
        if actual != expected:
            fail(f"hash mismatch for {name}: expected {expected}, got {actual}")

    protocol = load_json(ROOT / "protocol.v1.json")
    state = load_json(ROOT / "execution-state.v1.json")
    schema = load_json(ROOT / "route-submission-schema.v1.json")

    checks = {
        "operation_id": protocol.get("operation_id") == "INDEPENDENT_CONSTITUTIVE_ROUTE_IDENTIFICATION_CHALLENGE_v1",
        "claim_scope": protocol.get("claim_scope", {}).get("classification") == "UNIVERSAL_IDENTIFIABILITY",
        "no_scalar_test": protocol.get("equations_under_test", {}).get("imi_scalar") is False,
        "no_trajectory_test": protocol.get("equations_under_test", {}).get("trajectory") is False,
        "no_restoration_test": protocol.get("equations_under_test", {}).get("restoration") is False,
        "outcome_leak_invalid": protocol.get("custody", {}).get("material_leak_disposition") == "STUDY_INVALID",
        "chance_null_constrained": protocol.get("chance_null", {}).get("method") == "CONSTRAINED_PERMUTATION",
        "target_thresholds_not_operational": protocol.get("threshold_calibration", {}).get("target_scoring_authorized") is False,
        "support_not_validity": protocol.get("terminal_dispositions", {}).get("ROUTE_IDENTIFICATION_SUPPORTED", {}).get("does_not_establish") == "CONSTITUTIVE_VALIDITY",
        "execution_not_started": state.get("scientific_result") == "NONE" and state.get("execution", {}).get("target_analyst_access_started") is False,
        "outcomes_blinded": state.get("execution", {}).get("outcomes_unblinded") is False,
        "schema_requires_falsifiers": "falsifiers" in schema.get("$defs", {}).get("route", {}).get("required", []),
        "schema_requires_attestation": "independence_attestation" in schema.get("required", []),
    }
    failed = [name for name, ok in checks.items() if not ok]
    if failed:
        fail("contract checks failed: " + ", ".join(failed))

    print(f"PASS: {len(entries)} hashes and {len(checks)} protocol checks")
    return 0

if __name__ == "__main__":
    sys.exit(main())
