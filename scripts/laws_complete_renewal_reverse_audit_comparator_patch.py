#!/usr/bin/env python3
"""Replace the predecessor Reverse Audit sentence with complete sample and comparator context."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "laws/test/reverse-audit/index.html"
AUTHORITY = ROOT / "laws/control-plane/renewal/laws-complete-renewal-reverse-audit-battery-sample-successor-v2.json"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

OLD = (
    "The defined battery event was evaluated within the next 20 cycles, and reverse challenge preserved "
    "the stronger conventional aging-burden comparator at AUROC 0.9704 against the combined model at "
    "AUROC 0.9394 before component ablations and threshold behavior were considered."
)
NEW = (
    "The defined battery event was evaluated within the next 20 cycles across 1,653 final-test cycle records "
    "from three held-out cells, and reverse challenge preserved the stronger conventional aging-burden "
    "comparator at AUROC 0.9704 against the combined model at AUROC 0.9394 before component ablations and "
    "threshold behavior were considered."
)


def main() -> int:
    if not TARGET.exists() or not AUTHORITY.exists() or not RECEIPT.exists():
        raise SystemExit("Reverse Audit sample-context correction prerequisites are incomplete.")

    authority = json.loads(AUTHORITY.read_text(encoding="utf-8"))
    if authority.get("status") != "ACTIVE_FOR_PR_493":
        raise SystemExit("Reverse Audit sample-context successor is not active.")
    if authority.get("required_public_sentence") != NEW:
        raise SystemExit("Reverse Audit sample-context authority sentence drift.")

    source = TARGET.read_text(encoding="utf-8")
    changed = False
    if NEW not in source:
        if OLD not in source:
            raise SystemExit("Exact predecessor Reverse Audit sentence not found; refusing broad rewrite.")
        source = source.replace(OLD, NEW, 1)
        source = "\n".join(line.rstrip() for line in source.splitlines()) + "\n"
        TARGET.write_text(source, encoding="utf-8")
        changed = True

    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))
    receipt["reverse_audit_battery_sample_successor_v2"] = {
        "status": "APPLIED_PENDING_EXECUTED_VERIFICATION",
        "authority": "LAWS_COMPLETE_RENEWAL_REVERSE_AUDIT_BATTERY_SAMPLE_SUCCESSOR_v2",
        "predecessor": "LAWS_COMPLETE_RENEWAL_REVERSE_AUDIT_BATTERY_COMPARATOR_SUCCESSOR_v1",
        "path": "laws/test/reverse-audit/index.html",
        "required_public_sentence": NEW,
        "changed_in_this_run": changed,
        "held_out_cells": 3,
        "final_test_cycle_records": 1653,
        "warning_horizon_cycles": 20,
        "combined_model_auroc": 0.9394,
        "burden_comparator_auroc": 0.9704,
        "visual_structure_change": False,
        "tab_structure_change": False,
        "metric_change": False,
        "evidence_status_upgrade": False,
        "claim_ceiling_upgrade": False
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt["reverse_audit_battery_sample_successor_v2"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
