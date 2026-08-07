#!/usr/bin/env python3
"""Fail-closed verifier for Universal Coherence Invariant Proof v1."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

PACKAGE = Path(__file__).resolve().parent
MANIFEST = PACKAGE / "manifest.sha256"

REQUIRED_PACKAGE_FILES = {
    "README.md",
    "axioms-and-theorem.v1.md",
    "invariant-operator.v1.json",
    "trajectory-and-transition-law.v1.md",
    "evidence-ledger.v1.json",
    "falsification-and-status.v1.json",
    "verify-universal-coherence-invariant-proof-v1.py",
}

def fail(message: str) -> None:
    raise SystemExit(f"FAIL: {message}")

def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def load_json(name: str) -> dict:
    path = PACKAGE / name
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"{name} is not valid JSON: {exc}")

def verify_manifest() -> int:
    if not MANIFEST.is_file():
        fail("manifest.sha256 missing")
    entries = {}
    for number, raw in enumerate(MANIFEST.read_text(encoding="utf-8").splitlines(), 1):
        if not raw.strip():
            continue
        parts = raw.split("  ", 1)
        if len(parts) != 2:
            fail(f"manifest line {number} malformed")
        expected, relative = parts
        if len(expected) != 64:
            fail(f"manifest line {number} digest malformed")
        if relative in entries:
            fail(f"duplicate manifest entry: {relative}")
        entries[relative] = expected
    if set(entries) != REQUIRED_PACKAGE_FILES:
        fail(f"manifest scope mismatch: {sorted(entries)}")
    for relative, expected in entries.items():
        path = PACKAGE / relative
        if not path.is_file():
            fail(f"manifest file missing: {relative}")
        observed = sha256(path)
        if observed != expected:
            fail(f"hash mismatch for {relative}: {observed} != {expected}")
    return len(entries)

def verify_semantics() -> int:
    operator = load_json("invariant-operator.v1.json")
    evidence = load_json("evidence-ledger.v1.json")
    falsification = load_json("falsification-and-status.v1.json")

    checks = 0
    expected_expression = (
        "MEET_required_capacities("
        "JOIN_admissible_routes("
        "MEET(route_admissibility, required_relations)))"
    )
    if operator.get("lattice_expression") != expected_expression:
        fail("operator lattice expression changed")
    checks += 1

    if operator.get("formal_status") != "PROVED_CONDITIONALLY_FROM_FROZEN_AXIOMS":
        fail("formal status changed")
    checks += 1

    if operator.get("empirical_universality_status") != "NOT_ESTABLISHED":
        fail("empirical universality overclaimed")
    checks += 1

    required_invariants = {
        "CONJUNCTION_WITHIN_REQUIRED_ROUTE",
        "DISJUNCTION_ACROSS_ADMISSIBLE_ALTERNATIVE_ROUTES",
        "CONJUNCTION_ACROSS_IDENTITY_REQUIRED_CAPACITIES",
        "PROVENANCE_AND_SUPPORT_ARE_ROUTE_ADMISSIBILITY_PROPERTIES",
        "RESTORATION_REQUIRES_ROUTE_REOPENING_AND_REENTRY_CLEARANCE",
        "POST_OUTCOME_ROUTE_OR_BOUNDARY_REPAIR_PROHIBITED",
    }
    if not required_invariants.issubset(set(operator.get("invariants", []))):
        fail("required invariant missing")
    checks += len(required_invariants)

    record_ids = {record["id"] for record in evidence.get("records", [])}
    required_records = {
        "HOSPITAL_MEASURE_LEVEL_ROBUSTNESS",
        "FOUR_DOMAIN_PHASE3_EXTERNAL_TESTS",
        "AGRICULTURAL_CS4_TEMPORAL_BLOCK",
        "CMAPSS_FD001_UNTOUCHED_VALIDATION",
        "AGRICULTURAL_FACTORIAL_TEMPORAL_SUCCESSOR",
        "CONTROLLED_RELATION_DISRUPTION_GAUNTLET",
        "OBSERVER_BLINDED_HIDDEN_STRUCTURE_GAUNTLET",
        "EXTERNALLY_SOURCED_MULTI_SYSTEM_BRIDGE",
        "INDEPENDENT_ROUTE_IDENTIFICATION_PROTOCOL",
    }
    missing = required_records - record_ids
    if missing:
        fail(f"material evidence records missing: {sorted(missing)}")
    checks += len(required_records)

    disposition = evidence.get("portfolio_disposition", {})
    if disposition.get("global_multiplicative_operator") != "REJECTED_AS_UNIVERSAL":
        fail("negative operator result not preserved")
    checks += 1
    if disposition.get("universal_natural_law") != "NOT_ESTABLISHED":
        fail("universal law overclaimed")
    checks += 1

    terminal_ids = {item["id"] for item in falsification.get("terminal_failures", [])}
    required_terminal = {
        "NO_INDEPENDENT_IDENTIFIABILITY",
        "NO_SELECTIVE_CONSEQUENCE",
        "UNRELATED_COMPENSATION",
        "OUTPUT_HISTORY_OR_GENERIC_GRAPH_EQUIVALENCE",
        "POST_RESULT_REPAIR_REQUIRED",
    }
    if not required_terminal.issubset(terminal_ids):
        fail("terminal falsifier missing")
    checks += len(required_terminal)

    if falsification.get("current_result", {}).get("universal_proof") != "NOT_ESTABLISHED":
        fail("universal proof overclaimed")
    checks += 1

    texts = (
        (PACKAGE / "README.md").read_text(encoding="utf-8")
        + (PACKAGE / "axioms-and-theorem.v1.md").read_text(encoding="utf-8")
        + (PACKAGE / "trajectory-and-transition-law.v1.md").read_text(encoding="utf-8")
    )
    required_tokens = [
        "CONJUNCTION",
        "DISJUNCTION",
        "INVALID > UNEVALUABLE > NUMERIC",
        "post-result",
        "trajectory interval",
    ]
    for token in required_tokens:
        if token.lower() not in texts.lower():
            fail(f"required textual token missing: {token}")
        checks += 1

    return checks

def main() -> None:
    manifest_checks = verify_manifest()
    semantic_checks = verify_semantics()
    print(json.dumps({
        "operation": "UNIVERSAL_COHERENCE_INVARIANT_EXISTING_PORTFOLIO_PROOF_v1",
        "status": "PASS",
        "manifest_checks": manifest_checks,
        "semantic_checks": semantic_checks,
        "formal_status": "PROVED_CONDITIONALLY_FROM_FROZEN_AXIOMS",
        "empirical_universality_status": "NOT_ESTABLISHED",
    }, sort_keys=True))

if __name__ == "__main__":
    main()
