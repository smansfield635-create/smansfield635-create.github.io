#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[5]
BASE = ROOT / "research/route-operator-platform-v1/registered-challenges/independent-constitutive-route-identification-challenge-v1/ucic-prospective-final-report-portfolio-v1"
MANIFEST = BASE / "manifest.sha256"


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    if not MANIFEST.is_file():
        fail("manifest missing")

    checks = 0
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        expected, relative = line.split("  ", 1)
        path = ROOT / relative
        if not path.is_file():
            fail(f"missing payload: {relative}")
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual != expected:
            fail(f"hash mismatch: {relative}")
        checks += 1

    portfolio = json.loads((BASE / "target-portfolio.v1.json").read_text())
    contract = json.loads((BASE / "adjudication-contract.v1.json").read_text())
    state = json.loads((BASE / "execution-state.v1.json").read_text())

    if portfolio["operation_id"] != "UCIC_PROSPECTIVE_FINAL_REPORT_TARGET_PORTFOLIO_v1":
        fail("operation identity")
    if portfolio["source_cutoff"] != "2026-08-06T20:34:00-05:00":
        fail("source cutoff")
    if len(portfolio["targets"]) != 5:
        fail("target count")
    if len({t["domain"] for t in portfolio["targets"]}) != 5:
        fail("domain diversity")
    if any(t["status_at_cutoff"] not in {"ONGOING", "CURRENT_FINAL_REPORT_ABSENT"} for t in portfolio["targets"]):
        fail("target status")
    if contract["operator_substitution_after_cutoff"] != "PROHIBITED":
        fail("operator substitution")
    if contract["domain_narrowing_after_result"] != "PROHIBITED":
        fail("domain narrowing")
    if state["prediction_freeze"] is not False:
        fail("prediction state")
    if state["outcome_access"] != "PROHIBITED":
        fail("outcome access")
    if state["scientific_result"] is not None:
        fail("premature result")

    print(json.dumps({
        "status": "PASS",
        "manifest_checks": checks,
        "targets": len(portfolio["targets"]),
        "domains": len({t["domain"] for t in portfolio["targets"]}),
        "source_cutoff": portfolio["source_cutoff"],
        "scientific_result": None
    }, sort_keys=True))


if __name__ == "__main__":
    main()
