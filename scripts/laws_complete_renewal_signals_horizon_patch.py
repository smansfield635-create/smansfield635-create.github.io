#!/usr/bin/env python3
# CP6_RECOVERY_TRIGGER_20260802
"""Add the exact 20-cycle study target to the accepted Signals empirical reading.

This is the one representative-page factual completeness correction authorized by
LAWS_COMPLETE_RENEWAL_SIGNALS_BATTERY_HORIZON_CORRECTION_v1. It does not alter
layout, tabs, metrics, evidence status, claim ceilings, route identity, or custody.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "laws/categories/flow/signals/index.html"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"
AUTHORITY = ROOT / "laws/control-plane/renewal/laws-complete-renewal-signals-battery-horizon-correction-v1.json"

OLD = (
    "In the selected battery study, a combined representation ranked the defined near-term event "
    "strongly in three complete cells excluded from development: AUROC 0.9394 across 1,653 final-test "
    "records. That is bounded held-out support for detection of the defined event, not proof of a "
    "distinct mechanism."
)

NEW = (
    "In the selected battery study, the defined near-term event was evaluated within the next 20 cycles. "
    "A combined representation ranked that event strongly in three complete cells excluded from "
    "development: AUROC 0.9394 across 1,653 final-test records. That is bounded held-out support for "
    "detection of the defined event, not proof of a distinct mechanism."
)


def main() -> int:
    if not TARGET.exists() or not RECEIPT.exists() or not AUTHORITY.exists():
        raise SystemExit("Signals correction prerequisites are incomplete.")

    authority = json.loads(AUTHORITY.read_text(encoding="utf-8"))
    if authority.get("status") != "AUTHORIZED_BY_COMPLETE_BATTERY_PATHWAY_REQUIREMENT":
        raise SystemExit("Signals correction authority is not active.")

    source = TARGET.read_text(encoding="utf-8")
    if NEW in source:
        changed = False
    else:
        if OLD not in source:
            raise SystemExit("The exact accepted Signals empirical paragraph was not found; refusing broad rewrite.")
        source = source.replace(OLD, NEW, 1)
        TARGET.write_text("\n".join(line.rstrip() for line in source.splitlines()) + "\n", encoding="utf-8")
        changed = True

    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))
    receipt["representative_battery_completeness_correction"] = {
        "status": "APPLIED_PENDING_EXECUTED_VERIFICATION",
        "authority": "LAWS_COMPLETE_RENEWAL_SIGNALS_BATTERY_HORIZON_CORRECTION_v1",
        "path": "laws/categories/flow/signals/index.html",
        "fact": "The defined near-term event was evaluated within the next 20 cycles.",
        "visual_structure_change": False,
        "tab_structure_change": False,
        "metric_change": False,
        "evidence_status_upgrade": False,
        "claim_ceiling_upgrade": False,
        "changed_in_this_run": changed,
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt["representative_battery_completeness_correction"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
