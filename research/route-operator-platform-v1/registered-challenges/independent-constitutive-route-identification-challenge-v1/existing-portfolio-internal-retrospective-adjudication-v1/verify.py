#!/usr/bin/env python3
import hashlib
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REQUIRED = [
    "README.md",
    "adjudication-contract.v1.json",
    "outcome-ledger.v1.json",
    "RESULT.v1.json",
    "adjudicate.py",
    "verify.py",
]

def fail(msg):
    raise SystemExit(msg)

def main():
    for name in REQUIRED:
        p = ROOT / name
        if not p.is_file():
            fail(f"missing required file: {name}")

    contract = json.loads((ROOT / "adjudication-contract.v1.json").read_text())
    if contract["governing_invariant_head"] != "cac25b781909d12f6b53b4c3440adcd7c1356eb0":
        fail("wrong governing invariant head")
    if contract["independent_human_replication"] is not False:
        fail("independence classification corrupted")
    if contract["fixed_invariant"]["operator_substitution_after_outcomes"] != "PROHIBITED":
        fail("operator substitution prohibition missing")
    if contract["fixed_invariant"]["global_product_revival"] != "PROHIBITED":
        fail("global product revival prohibition missing")

    result = json.loads((ROOT / "RESULT.v1.json").read_text())
    if result["disposition"] != "SURVIVES_INTERNAL_RETROSPECTIVE_PORTFOLIO_ADJUDICATION_WITH_CONSTRAINTS":
        fail("unexpected terminal disposition")
    if result["continuation_justified"] is not True:
        fail("continuation decision not true")
    if result["general_observational_predictive_superiority"] is not False:
        fail("negative industrial constraint lost")
    if result["multiplicative_specificity"] is not False:
        fail("negative operator constraint lost")
    if result["independent_human_identifiability"] != "NOT_ESTABLISHED":
        fail("independence boundary lost")
    if result["universal_empirical_law"] != "NOT_ESTABLISHED":
        fail("universal claim boundary lost")

    proc = subprocess.run(
        [sys.executable, str(ROOT / "adjudicate.py")],
        check=False,
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        fail("adjudication recomputation failed:\n" + proc.stdout + proc.stderr)

    manifest_path = ROOT / "manifest.sha256"
    if not manifest_path.is_file():
        fail("missing manifest.sha256")
    for line in manifest_path.read_text().splitlines():
        if not line.strip():
            continue
        digest, rel = line.split("  ", 1)
        target = ROOT / rel
        if not target.is_file():
            fail(f"manifest target missing: {rel}")
        actual = hashlib.sha256(target.read_bytes()).hexdigest()
        if actual != digest:
            fail(f"hash mismatch: {rel}")

    print("PASS_EXISTING_PORTFOLIO_INTERNAL_RETROSPECTIVE_ADJUDICATION_v1")
    print(proc.stdout, end="")

if __name__ == "__main__":
    main()
