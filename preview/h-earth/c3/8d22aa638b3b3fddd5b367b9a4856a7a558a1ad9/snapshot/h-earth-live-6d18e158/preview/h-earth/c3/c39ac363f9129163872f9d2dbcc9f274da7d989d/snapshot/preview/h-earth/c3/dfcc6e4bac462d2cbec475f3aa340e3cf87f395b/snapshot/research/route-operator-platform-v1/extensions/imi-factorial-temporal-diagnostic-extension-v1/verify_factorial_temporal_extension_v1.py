from __future__ import annotations

import copy
import hashlib
import importlib.util
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

ROOT = Path(__file__).resolve().parent


def load_json(name: str) -> Any:
    return json.loads((ROOT / name).read_text(encoding="utf-8"))


def load_module():
    path = ROOT / "temporal_extension_v1.py"
    spec = importlib.util.spec_from_file_location("temporal_extension_v1", path)
    if spec is None or spec.loader is None:
        raise AssertionError("MODULE_LOAD_FAILED")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def sha_for(index: int) -> str:
    return hashlib.sha256(f"fixture-{index}".encode("utf-8")).hexdigest()


def make_records(values: List[float]) -> List[Dict[str, Any]]:
    records: List[Dict[str, Any]] = []
    for index, value in enumerate(values):
        vector = {
            "F1": min(1.0, value + 0.1),
            "F2": value,
            "F3": min(1.0, value + 0.2),
        }
        wmi = min(vector.values())
        records.append(
            {
                "case_id": "SYNTHETIC_CASE",
                "timepoint": float(index),
                "core_receipt_sha256": sha_for(index),
                "route_id": "SYNTHETIC_ROUTE",
                "route_version": "1.0.0",
                "factor_dictionary_version": "1.0.0",
                "normalization_version": "1.0.0",
                "source_registry_version": "1.0.0",
                "temporal_protocol_version": "1.0.0",
                "implementation_version": "1.0.0",
                "IMI": value,
                "CS": 1.0 - value,
                "WMI": wmi,
                "factor_vector": vector,
            }
        )
    return records


def expect_failure(module, records, rules, expected_fragment: str) -> None:
    try:
        module.analyze_series(records, rules)
    except module.TemporalExtensionError as error:
        if expected_fragment not in str(error):
            raise AssertionError(f"EXPECTED_{expected_fragment}_GOT_{error}") from error
    else:
        raise AssertionError("NEGATIVE_FIXTURE_DID_NOT_FAIL:" + expected_fragment)


def main() -> int:
    module = load_module()
    checks = 0

    contract = load_json("extension-contract.v1.json")
    audit = load_json("eligibility-audit.v1.json")
    registry = load_json("portfolio-study-registry.v1.json")
    synthetic = load_json("synthetic-fixtures.v1.json")
    negative = load_json("negative-fixtures.v1.json")
    schema = load_json("temporal-receipt.schema.v1.json")
    eligibility_schema = load_json("study-eligibility.schema.v1.json")
    manifest = load_json("MANIFEST_SHA256.json")

    assert contract["extension_id"] == module.EXTENSION_ID
    assert contract["version"] == module.EXTENSION_VERSION
    assert contract["authority_boundary"]["modifies_core_package"] is False
    assert contract["authority_boundary"]["performs_real_study_reanalysis_in_this_operation"] is False
    assert audit["summary"]["real_reanalysis_performed"] is False
    assert audit["summary"]["archived_result_mutation"] is False
    assert len(audit["studies"]) == 6
    assert len(registry["studies"]) == 6
    assert schema["properties"]["core_mutation_performed"]["const"] is False
    assert eligibility_schema["properties"]["governing_head"]["pattern"] == "^[0-9a-f]{40}$"
    assert manifest["core_mutation_performed"] is False
    assert manifest["real_reanalysis_performed"] is False
    assert manifest["file_count"] == len(manifest["files"])
    for name, expected_sha in manifest["files"].items():
        actual_sha = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
        assert actual_sha == expected_sha, name
        checks += 1
    checks += 13

    for fixture in synthetic["fixtures"]:
        result = module.analyze_series(make_records(fixture["imi_values"]), synthetic["rules"])
        assert result["latest_direction"] == fixture["expected_direction"]
        assert result["persistence"] == fixture["expected_persistence"]
        assert result["core_recalculation_performed"] is False
        assert result["core_mutation_performed"] is False
        assert len(result["receipt_sha256"]) == 64
        checks += 5

    base_records = make_records([0.4, 0.5, 0.6])
    rules = synthetic["rules"]

    mutations = [
        ("route_id", "OTHER_ROUTE", "COMPARABILITY_MISMATCH:route_id"),
        ("route_version", "2.0.0", "COMPARABILITY_MISMATCH:route_version"),
        ("factor_dictionary_version", "2.0.0", "COMPARABILITY_MISMATCH:factor_dictionary_version"),
        ("normalization_version", "2.0.0", "COMPARABILITY_MISMATCH:normalization_version"),
        ("source_registry_version", "2.0.0", "COMPARABILITY_MISMATCH:source_registry_version"),
        ("temporal_protocol_version", "2.0.0", "COMPARABILITY_MISMATCH:temporal_protocol_version"),
        ("implementation_version", "2.0.0", "COMPARABILITY_MISMATCH:implementation_version"),
    ]
    for field, value, expected in mutations:
        records = copy.deepcopy(base_records)
        records[-1][field] = value
        expect_failure(module, records, rules, expected)
        checks += 1

    records = copy.deepcopy(base_records)
    records[-1]["factor_vector"]["F4"] = 0.2
    records[-1]["WMI"] = 0.2
    expect_failure(module, records, rules, "FACTOR_VECTOR_IDENTITY_MISMATCH")
    checks += 1

    records = copy.deepcopy(base_records)
    records[-1]["timepoint"] = records[-2]["timepoint"]
    expect_failure(module, records, rules, "NONINCREASING_TIME_ORDER")
    checks += 1

    records = copy.deepcopy(base_records)
    records[-1]["timepoint"] = 3.0
    expect_failure(module, records, rules, "NONCOMPARABLE_OBSERVATION_INTERVAL")
    checks += 1

    records = copy.deepcopy(base_records)
    records[-1]["IMI"] = 1.2
    expect_failure(module, records, rules, "IMI_OUT_OF_RANGE")
    checks += 1

    records = copy.deepcopy(base_records)
    records[-1]["CS"] = 0.9
    expect_failure(module, records, rules, "CS_IMI_COMPLEMENT_MISMATCH")
    checks += 1

    records = copy.deepcopy(base_records)
    records[-1]["WMI"] = 0.9
    expect_failure(module, records, rules, "WMI_FACTOR_VECTOR_MISMATCH")
    checks += 1

    records = copy.deepcopy(base_records)
    records[-1]["core_receipt_sha256"] = "not-a-hash"
    expect_failure(module, records, rules, "INVALID_CORE_RECEIPT_SHA256")
    checks += 1

    expect_failure(module, base_records[:2], rules, "INSUFFICIENT_OBSERVATIONS")
    checks += 1

    bad_rules = dict(rules)
    bad_rules["meaningful_change_threshold"] = 0
    expect_failure(module, base_records, bad_rules, "INVALID_MEANINGFUL_CHANGE_THRESHOLD")
    checks += 1

    assert len(negative["fixture_ids"]) == 16
    assert negative["expected_result"] == "ALL_FAIL_CLOSED"
    checks += 2

    required_paths = [
        "README.md",
        "PORTFOLIO_ELIGIBILITY_REPORT.md",
        "extension-contract.v1.json",
        "temporal-receipt.schema.v1.json",
       "study-eligibility.schema.v1.json",
        "portfolio-study-registry.v1.json",
        "eligibility-audit.v1.json",
        "synthetic-fixtures.v1.json",
        "negative-fixtures.v1.json",
        "temporal_extension_v1.py",
        "verify_factorial_temporal_extension_v1.py",
        "MANIFEST_SHA256.json",
    ]
    for name in required_paths:
        assert (ROOT / name).is_file(), name
        checks += 1

    print(
        json.dumps(
            {
                "status": "PASS",
                "extension_id": module.EXTENSION_ID,
                "checks_passed": checks,
                "positive_fixtures": len(synthetic["fixtures"]),
                "negative_fixtures": len(negative["fixture_ids"]),
                "study_count": len(audit["studies"]),
                "real_reanalysis_performed": False,
                "core_mutation_performed": False,
            },
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
