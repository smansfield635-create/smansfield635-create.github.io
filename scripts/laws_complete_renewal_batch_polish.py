#!/usr/bin/env python3
"""Apply bounded presentation corrections to an already materialized Laws batch.

This script never regenerates or rewraps pages. It only corrects presentation labels,
formula-stage tokenization, compatibility-page titles, and links between frozen slash-form
story identities and the retained public .html route shapes.
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

TITLE_REPLACEMENTS = {
    "laws/battery-heldout-study/index.html": "Battery health held-out study · Laws",
    "laws/scientific-law/battery-heldout-study/index.html": "Battery health held-out study · Scientific Law · Laws",
    "laws/categories/reality/battery-heldout-study/index.html": "Battery health held-out study · Reality · Laws",
}

STORY_TO_SERVED = {
    "/laws/categories/reality/theory/": "/laws/categories/reality/theory.html",
    "/laws/categories/reality/evidence/": "/laws/categories/reality/evidence.html",
    "/laws/categories/reality/measure/": "/laws/categories/reality/measure.html",
    "/laws/categories/reality/limits/": "/laws/categories/reality/limits.html",
    "/laws/categories/structure/constraints/": "/laws/categories/structure/constraints.html",
    "/laws/categories/structure/interfaces/": "/laws/categories/structure/interfaces.html",
    "/laws/categories/structure/boundaries/": "/laws/categories/structure/boundaries.html",
    "/laws/categories/structure/governance/": "/laws/categories/structure/governance.html",
}

SOURCE_TO_STORY = {
    "laws/categories/reality/theory.html": "/laws/categories/reality/theory/",
    "laws/categories/reality/evidence.html": "/laws/categories/reality/evidence/",
    "laws/categories/reality/limits.html": "/laws/categories/reality/limits/",
    "laws/categories/structure/constraints.html": "/laws/categories/structure/constraints/",
    "laws/categories/structure/interfaces.html": "/laws/categories/structure/interfaces/",
    "laws/categories/structure/boundaries.html": "/laws/categories/structure/boundaries/",
    "laws/categories/structure/governance.html": "/laws/categories/structure/governance/",
}

ARROWS = re.compile(r"\s*(?:→|←|↔|⇄)\s*")
RAW_PHASE = re.compile(r'(<p class="lr-kicker">[^<]+ · )([A-Z0-9_]+)(</p>)')


def escape(value: str) -> str:
    return html.escape(value, quote=True)


def humanize_phase(match: re.Match[str]) -> str:
    phase = match.group(2).replace("_", " ").title()
    return f"{match.group(1)}{phase}{match.group(3)}"


def formula_nodes(expression: str) -> str:
    plain = html.unescape(re.sub(r"<[^>]+>", "", expression)).strip()
    parts = [part.strip() for part in ARROWS.split(plain) if part.strip()]
    if len(parts) <= 1:
        return (
            '<div class="lr-visual-board__node"><strong>Formal relationship</strong>'
            '<span>Read the exact selectable notation above.</span></div>'
        )
    return "".join(
        '<div class="lr-visual-board__node"><strong>'
        + escape(part)
        + '</strong><span>Distinct stage in the declared relationship.</span></div>'
        for part in parts[:8]
    )


def polish_formula_boards(text: str) -> str:
    lines = text.splitlines()
    formula: list[str] | None = None
    collecting = False

    for index, line in enumerate(lines):
        if '<pre class="lr-formula"><code>' in line:
            collecting = True
            formula = [line.split('<pre class="lr-formula"><code>', 1)[1]]
            if '</code></pre>' in formula[0]:
                formula[0] = formula[0].split('</code></pre>', 1)[0]
                collecting = False
            continue

        if collecting and formula is not None:
            if '</code></pre>' in line:
                formula.append(line.split('</code></pre>', 1)[0])
                collecting = False
            else:
                formula.append(line)
            continue

        if formula is not None and 'class="lr-visual-board__nodes"' in line:
            indent = line[: len(line) - len(line.lstrip())]
            expression = "\n".join(formula)
            lines[index] = f'{indent}<div class="lr-visual-board__nodes">{formula_nodes(expression)}</div>'
            formula = None

    return "\n".join(lines) + "\n"


def set_title(text: str, title: str) -> str:
    return re.sub(r"<title>.*?</title>", f"<title>{escape(title)}</title>", text, count=1, flags=re.I | re.S)


def reconcile_route_links(text: str, raw_path: str) -> str:
    for story_route, served_route in STORY_TO_SERVED.items():
        text = text.replace(f'href="{story_route}"', f'href="{served_route}"')
        text = text.replace(
            f'href="https://diamondgatebridge.com{story_route}"',
            f'href="https://diamondgatebridge.com{served_route}"',
        )

    story_route = SOURCE_TO_STORY.get(raw_path)
    if story_route:
        served_route = STORY_TO_SERVED[story_route]
        text = text.replace(f'data-route="{story_route}"', f'data-route="{served_route}"', 1)
        if f'data-narrative-route="{story_route}"' not in text:
            text = text.replace(
                f'data-route="{served_route}"',
                f'data-route="{served_route}" data-narrative-route="{story_route}"',
                1,
            )
    return text


def main() -> int:
    if not RECEIPT.exists():
        raise SystemExit("Materialization receipt is missing; polish cannot run safely.")

    receipt = json.loads(RECEIPT.read_text(encoding="utf-8"))
    changed: list[str] = []

    for raw_path in receipt["product_files_written"]:
        path = ROOT / raw_path
        text = path.read_text(encoding="utf-8")
        before = text

        text = RAW_PHASE.sub(humanize_phase, text)
        text = polish_formula_boards(text)
        text = reconcile_route_links(text, raw_path)
        if raw_path in TITLE_REPLACEMENTS:
            text = set_title(text, TITLE_REPLACEMENTS[raw_path])

        text = "\n".join(line.rstrip() for line in text.splitlines()) + "\n"
        if text != before:
            path.write_text(text, encoding="utf-8")
            changed.append(raw_path)

    receipt["presentation_polish"] = {
        "status": "APPLIED_PENDING_EXECUTED_VERIFICATION",
        "formula_node_split_rule": "ARROWS_ONLY_PLUS_SIGNS_PRESERVED",
        "raw_story_phase_labels_humanized": True,
        "compatibility_titles_corrected": sorted(TITLE_REPLACEMENTS),
        "route_shape_reconciliation": {
            "story_identity_preserved": True,
            "retained_html_public_routes": STORY_TO_SERVED,
            "redirects_created": 0,
        },
        "changed_files": sorted(changed),
    }
    RECEIPT.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt["presentation_polish"], indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
