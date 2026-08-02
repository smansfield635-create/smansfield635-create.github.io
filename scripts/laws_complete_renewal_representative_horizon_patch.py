#!/usr/bin/env python3
"""Apply the remaining exact 20-cycle facts to accepted battery representatives.

Authorized by LAWS_COMPLETE_RENEWAL_REPRESENTATIVE_BATTERY_HORIZON_COMPLETENESS_SUCCESSOR_v1.
The patch changes one public factual sentence per target page and refuses any broad rewrite.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUTHORITY = ROOT / "laws/control-plane/renewal/laws-complete-renewal-representative-battery-horizon-completeness-successor-v1.json"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

PATCHES = {
    "laws/categories/reality/measure.html": {
        "old": (
            "The selected battery study reported ranking metrics for one defined near-term event. "
            "The values below remain inseparable from the cell-disjoint evaluation, event definition, "
            "comparators, and unresolved transfer conditions."
        ),
        "new": (
            "The selected battery study reported ranking metrics for one defined near-term event evaluated "
            "within the next 20 cycles. The values below remain inseparable from the cell-disjoint evaluation, "
            "event definition, comparators, and unresolved transfer conditions."
        ),
        "fact": "The defined near-term battery event was evaluated within the next 20 cycles."
    },
    "laws/test/reverse-audit/index.html": {
        "old": (
            "<h3>The selected battery result did not survive every interpretation.</h3>\n"
            "            <div class=\"lr-metric-grid\">"
        ),
        "new": (
            "<h3>The selected battery result did not survive every interpretation.</h3>\n"
            "            <p>The defined battery event was evaluated within the next 20 cycles before the result "
            "was challenged against simpler explanations, component ablations, and threshold behavior.</p>\n"
            "            <div class=\"lr-metric-grid\">"
        ),
        "fact": "The defined battery event was evaluated within the next 20 cycles before reverse challenge."
    }
}


def main() -> int:
    if not AUTHORITY.exists() or not RECEIPT.exists():
        raise SystemExit("Representative horizon correction prerequisites are incomplete.")

    authority = json.loads(AUTHORITY.read_text(encoding="utf-8"))
    if authority.get("status") != "ACTIVE_FOR_PR_493":
        raise SystemExit("Representative horizon successor is not active.")

    outcomes: list[dict[str, object]] = []
    for raw_path, patch in PATCHES.items():
        path = ROOT / raw_path
        source = path.read_text(encoding="utf-8")
        changed = False
        if patch["new"] not in source:
            if patch["old"] not in source:
                raise SystemExit(f"Exact accepted target not found for {raw_path}; refusing broad rewrite.")
            source = source.replace(patch["old"], patch["new"], 1)
            source = "\n".join(line.rstrip() for line in source.splitlines()) + "\n"
            path.write_text(source, encoding="utf-8")
            changed = True
        outcomes.append({
            "path": raw_path,
            "fact": patch["fact"],
            "changed_in_this_run": changed,
            "visual_structure_change": False,
            "tab_structure_change": False,
            "metric_change": False,
            "evidence_status_upgrade": False,
            "claim_ceiling_upgrade": False
        })

    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))
    receipt["representative_battery_horizon_completeness_successor"] = {
        "status": "APPLIED_PENDING_EXECUTED_VERIFICATION",
        "authority": "LAWS_COMPLETE_RENEWAL_REPRESENTATIVE_BATTERY_HORIZON_COMPLETENESS_SUCCESSOR_v1",
        "predecessor_signals_correction_preserved": True,
        "corrections": outcomes,
        "final_authorized_representative_paths": [
            "laws/categories/flow/signals/index.html",
            "laws/categories/reality/measure.html",
            "laws/test/reverse-audit/index.html"
        ],
        "other_representative_html_mutations": 0,
        "representative_visual_structure_mutations": 0
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt["representative_battery_horizon_completeness_successor"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
