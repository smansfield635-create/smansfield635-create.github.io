#!/usr/bin/env python3
"""Replace the bounded Reverse Audit challenge sentence with complete comparator context."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "laws/test/reverse-audit/index.html"
AUTHORITY = ROOT / "laws/control-plane/renewal/laws-complete-renewal-reverse-audit-battery-comparator-successor-v1.json"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

OLD = (
    "The defined battery event was evaluated within the next 20 cycles before the result was challenged "
    "against simpler explanations, component ablations, and threshold behavior."
)
NEW = (
    "The defined battery event was evaluated within the next 20 cycles, and reverse challenge preserved "
    "the stronger conventional aging-burden comparator at AUROC 0.9704 against the combined model at "
    "AUROC 0.9394 before component ablations and threshold behavior were considered."
)


def main() -> int:
    if not TARGET.exists() or not AUTHORITY.exists() or not RECEIPT.exists():
        raise SystemExit("Reverse Audit comparator correction prerequisites are incomplete.")

    authority = json.loads(AUTHORITY.read_text(encoding="utf-8"))
    if authority.get("status") != "ACTIVE_FOR_PR_493":
        raise SystemExit("Reverse Audit comparator successor is not active.")

    source = TARGET.read_text(encoding="utf-8")
    changed = False
    if NEW not in source:
        if OLD not in source:
            raise SystemExit("Exact previously authorized Reverse Audit sentence not found; refusing broad rewrite.")
        source = source.replace(OLD, NEW, 1)
        source = "\n".join(line.rstrip() for line in source.splitlines()) + "\n"
        TARGET.write_text(source, encoding="utf-8")
        changed = True

    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))
    receipt["reverse_audit_battery_comparator_successor"] = {
        "status": "APPLIED_PENDING_EXECUTED_VERIFICATION",
        "authority": "LAWS_COMPLETE_RENEWAL_REVERSE_AUDIT_BATTERY_COMPARATOR_SUCCESSOR_v1",
        "path": "laws/test/reverse-audit/index.html",
        "required_public_sentence": NEW,
        "changed_in_this_run": changed,
        "visual_structure_change": False,
        "tab_structure_change": False,
        "metric_change": False,
        "evidence_status_upgrade": False,
        "claim_ceiling_upgrade": False
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt["reverse_audit_battery_comparator_successor"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
