from __future__ import annotations

"""Public Route Operator Platform v1 API.

The implementation core remains in ``route_operator_platform_core_v1``.
This public layer enforces the scientific-custody rule that pointer-only
locks may support computational comparison but cannot support a scientific
disposition.
"""

from pathlib import Path
from typing import Any, Mapping, Sequence
import json

import route_operator_platform_core_v1 as _core
from route_operator_platform_core_v1 import *  # noqa: F401,F403


EXPECTED_MANIFEST_PATHS = frozenset({
    ".github/workflows/route-operator-platform-v1-conformance.yml",
    "research/route-operator-platform-v1/ARCHITECTURE.md",
    "research/route-operator-platform-v1/IMI_PACKAGE_POINTER.json",
    "research/route-operator-platform-v1/PLATFORM_AUTHORITY.json",
    "research/route-operator-platform-v1/README.md",
    "research/route-operator-platform-v1/demo_route_operator_platform_v1.py",
    "research/route-operator-platform-v1/route_operator_platform_core_v1.py",
    "research/route-operator-platform-v1/route_operator_platform_v1.py",
    "research/route-operator-platform-v1/test_pointer_custody_v1.py",
    "research/route-operator-platform-v1/test_route_operator_platform_v1.py",
})


def evaluate_theory(
    *,
    study: StudyIdentity,
    theory: TheoryRecord,
    observed: Mapping[str, Any],
    executed_analysis_code_sha256: str,
    boundary_conditions_met: bool = True,
) -> dict[str, Any]:
    """Evaluate a theory while enforcing scientific data-custody eligibility."""
    result = _core.evaluate_theory(
        study=study,
        theory=theory,
        observed=observed,
        executed_analysis_code_sha256=executed_analysis_code_sha256,
        boundary_conditions_met=boundary_conditions_met,
    )
    if result.get("state") == State.INVALID.value:
        return result

    output = dict(result)
    if study.data_lock_mode == "POINTER_ONLY":
        output.update({
            "state": State.UNEVALUABLE.value,
            "confirmatory_eligible": False,
            "scientific_custody_state": State.UNEVALUABLE.value,
            "scientific_disposition": None,
            "scientific_disposition_blocked": True,
            "custody_disposition": (
                "INCONCLUSIVE_DATA_CUSTODY_NOT_CRYPTOGRAPHICALLY_VERIFIED"
            ),
            "unevaluable_reasons": ["DATA_CUSTODY_POINTER_ONLY"],
        })
    else:
        output.update({
            "confirmatory_eligible": True,
            "scientific_custody_state": "VERIFIED",
            "scientific_disposition_blocked": False,
        })
    return _core._rehash(output)


def summarize_study(crosswalks: Sequence[Mapping[str, Any]]) -> dict[str, Any]:
    """Summarize crosswalks with INVALID > UNEVALUABLE > NUMERIC precedence."""
    counts: dict[str, int] = {}
    invalid_count = 0
    unevaluable_count = 0
    for item in crosswalks:
        state = item.get("state")
        if state == State.INVALID.value:
            invalid_count += 1
            disposition = "INVALID"
        elif state == State.UNEVALUABLE.value:
            unevaluable_count += 1
            disposition = str(item.get("custody_disposition", "UNEVALUABLE"))
        else:
            disposition = str(item.get("scientific_disposition", "UNKNOWN"))
        counts[disposition] = counts.get(disposition, 0) + 1

    if invalid_count:
        state = State.INVALID.value
    elif unevaluable_count:
        state = State.UNEVALUABLE.value
    else:
        state = State.NUMERIC.value

    return _core._rehash({
        "platform_id": PLATFORM_ID,
        "platform_version": PLATFORM_VERSION,
        "empirical_engine_version": EMPIRICAL_ENGINE_VERSION,
        "state": state,
        "crosswalk_count": len(crosswalks),
        "invalid_crosswalk_count": invalid_count,
        "unevaluable_crosswalk_count": unevaluable_count,
        "disposition_counts": counts,
    })


def validate_theory_crosswalk(crosswalk: Mapping[str, Any]) -> list[str]:
    errors = _core.validate_theory_crosswalk(crosswalk)
    verification = crosswalk.get("data_lock_verification")
    if verification == "EXPLICIT_POINTER_ONLY":
        if crosswalk.get("state") != State.UNEVALUABLE.value:
            errors.append("POINTER_ONLY_CROSSWALK_NOT_UNEVALUABLE")
        if crosswalk.get("scientific_disposition") is not None:
            errors.append("POINTER_ONLY_SCIENTIFIC_DISPOSITION_PRESENT")
        if crosswalk.get("confirmatory_eligible") is not False:
            errors.append("POINTER_ONLY_CONFIRMATORY_ELIGIBILITY_INVALID")
        if "DATA_CUSTODY_POINTER_ONLY" not in crosswalk.get(
            "unevaluable_reasons", []
        ):
            errors.append("POINTER_ONLY_REASON_MISSING")
    elif crosswalk.get("state") == State.NUMERIC.value:
        if crosswalk.get("confirmatory_eligible") is not True:
            errors.append("VERIFIED_CROSSWALK_NOT_CONFIRMATORY_ELIGIBLE")
    return sorted(set(errors))


def verify_platform_manifest(
    repository_root: Path,
    manifest_path: Path | None = None,
) -> list[str]:
    manifest_path = manifest_path or (
        repository_root
        / "research/route-operator-platform-v1/MANIFEST_SHA256.json"
    )
    errors: list[str] = []
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return ["MANIFEST_UNREADABLE"]

    if manifest.get("platform_id") != PLATFORM_ID:
        errors.append("MANIFEST_PLATFORM_ID_MISMATCH")
    if manifest.get("platform_version") != PLATFORM_VERSION:
        errors.append("MANIFEST_PLATFORM_VERSION_MISMATCH")
    files = manifest.get("files")
    if not isinstance(files, dict):
        return sorted(set(errors + ["MANIFEST_FILES_INVALID"]))
    if set(files) != EXPECTED_MANIFEST_PATHS:
        errors.append("MANIFEST_PATH_SET_MISMATCH")

    for relative_path, expected_digest in files.items():
        if not is_sha256(expected_digest):
            errors.append(f"MANIFEST_DIGEST_INVALID:{relative_path}")
            continue
        path = repository_root / relative_path
        if not path.is_file():
            errors.append(f"MANIFEST_FILE_MISSING:{relative_path}")
            continue
        if file_sha256(path) != expected_digest:
            errors.append(f"MANIFEST_DIGEST_MISMATCH:{relative_path}")
    return sorted(set(errors))
