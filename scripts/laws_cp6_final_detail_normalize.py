#!/usr/bin/env python3
"""Normalize the final Laws CP6 migrated cohort to the accepted presentation contract.

Bounded corrections:
- every migrated interactive reading starts source-neutral (`aria-selected=false`,
  `aria-expanded=false`);
- explanatory copy states that no reading is open on entry;
- visual relationship nodes are rebuilt from the declared expression by splitting
  arrows only, never internal plus signs;
- obsolete batch construction and superseded verifier scripts are removed.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

OBSOLETE = [
    "scripts/laws_complete_renewal_batch.py",
    "scripts/laws_complete_renewal_batch_browser_verify.mjs",
    "scripts/laws_complete_renewal_batch_browser_verify_v2.mjs",
    "scripts/laws_complete_renewal_batch_polish.py",
    "scripts/laws_complete_renewal_representative_horizon_patch.py",
    "scripts/laws_complete_renewal_reverse_audit_comparator_patch.py",
    "scripts/laws_complete_renewal_signals_horizon_patch.py",
    "scripts/verify-laws-complete-renewal-batch.py",
    "scripts/verify-laws-complete-renewal-batch-v2.py",
    "scripts/verify-laws-complete-renewal-batch-v3.py",
]

COPY_REPLACEMENTS = {
    "One lens is active on entry. The other readings remain available without being treated as interchangeable.":
        "No reading is open on entry. Each reading remains available without being treated as interchangeable.",
    "One page-family lens is active on entry. No reading surface may silently upgrade another.":
        "No reading is open on entry. No reading surface may silently upgrade another.",
}

BOARD_PATTERN = re.compile(
    r'(?P<expression><p class="lr-visual-board__expression">(?P<value>.*?)</p>)'
    r'(?P<middle>.*?)'
    r'<div class="lr-visual-board__nodes">'
    r'(?P<nodes>(?:<div class="lr-visual-board__node">.*?</div>)+)'
    r'</div>',
    flags=re.S,
)
ARROWS = re.compile(r"\s*(?:→|←|↔|⇄)\s*")


def plain_text(value: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", value)).strip()


def nodes_for(expression: str) -> str:
    parts = [part.strip() for part in ARROWS.split(plain_text(expression)) if part.strip()]
    if not parts:
        raise SystemExit(f"EMPTY_VISUAL_EXPRESSION:{expression}")
    return "".join(
        '<div class="lr-visual-board__node"><strong>'
        + html.escape(part)
        + '</strong><span>Distinct stage in the declared relationship.</span></div>'
        for part in parts[:12]
    )


def normalize_board(match: re.Match[str]) -> str:
    expression = match.group("value")
    return (
        match.group("expression")
        + match.group("middle")
        + '<div class="lr-visual-board__nodes">'
        + nodes_for(expression)
        + '</div>'
    )


def normalize_page(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    before = text

    text = text.replace('aria-selected="true"', 'aria-selected="false"')
    text = re.sub(
        r'(<button\b[^>]*\bclass="[^"]*lr-tab[^"]*"[^>]*)(>)',
        lambda match: (
            match.group(1)
            if 'aria-expanded=' in match.group(1)
            else match.group(1) + ' aria-expanded="false"'
        ) + match.group(2),
        text,
    )
    text = text.replace('aria-expanded="true"', 'aria-expanded="false"')

    for old, new in COPY_REPLACEMENTS.items():
        text = text.replace(old, new)

    text, board_count = BOARD_PATTERN.subn(normalize_board, text)
    text = "\n".join(line.rstrip() for line in text.splitlines()) + "\n"

    if text != before:
        path.write_text(text, encoding="utf-8")

    return {
        "path": path.relative_to(ROOT).as_posix(),
        "changed": text != before,
        "visual_boards_normalized": board_count,
        "selected_true_remaining": text.count('aria-selected="true"'),
        "expanded_true_remaining": text.count('aria-expanded="true"'),
    }


def main() -> int:
    if not RECEIPT.exists():
        raise SystemExit("MISSING_BATCH_RECEIPT")
    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))

    raw_paths = list(receipt.get("product_files_written", [])) + [
        "laws/categories/flow/signals/index.html",
        "laws/categories/reality/measure.html",
        "laws/test/reverse-audit/index.html",
    ]
    unique_paths: list[str] = []
    for raw in raw_paths:
        if raw.endswith(".html") and raw not in unique_paths:
            unique_paths.append(raw)

    results: list[dict[str, object]] = []
    for raw in unique_paths:
        path = ROOT / raw
        if not path.exists():
            raise SystemExit(f"MISSING_MIGRATED_PAGE:{raw}")
        results.append(normalize_page(path))

    failures = [
        result for result in results
        if result["selected_true_remaining"] or result["expanded_true_remaining"]
    ]
    if failures:
        raise SystemExit(f"ZERO_OPEN_SOURCE_NORMALIZATION_FAILED:{failures}")

    deleted: list[str] = []
    for raw in OBSOLETE:
        path = ROOT / raw
        if path.exists():
            path.unlink()
            deleted.append(raw)

    changed_pages = [result["path"] for result in results if result["changed"]]
    receipt["final_detail_normalization"] = {
        "contract": "LAWS_CP6_FINAL_DETAIL_NORMALIZATION_v1",
        "status": "APPLIED_PENDING_EXACT_HEAD_VERIFICATION",
        "zero_open_source_contract": True,
        "formula_node_split_rule": "ARROWS_ONLY_INTERNAL_PLUS_PRESERVED",
        "changed_page_count": len(changed_pages),
        "changed_pages": changed_pages,
        "obsolete_scripts_removed": deleted,
        "evidence_status_upgrade": False,
        "claim_ceiling_upgrade": False,
        "route_mutation": False,
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")

    feedback = (ROOT / "laws/categories/flow/feedback/index.html").read_text(encoding="utf-8")
    if "<strong>INPUT_(t+1)</strong>" not in feedback:
        raise SystemExit("INTERNAL_PLUS_FORMULA_REPAIR_FAILED")
    if 'aria-selected="true"' in feedback or 'aria-expanded="true"' in feedback:
        raise SystemExit("FEEDBACK_ZERO_OPEN_REPAIR_FAILED")

    print(json.dumps({
        "page_count": len(results),
        "changed_page_count": len(changed_pages),
        "obsolete_scripts_removed": deleted,
        "results": results,
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
