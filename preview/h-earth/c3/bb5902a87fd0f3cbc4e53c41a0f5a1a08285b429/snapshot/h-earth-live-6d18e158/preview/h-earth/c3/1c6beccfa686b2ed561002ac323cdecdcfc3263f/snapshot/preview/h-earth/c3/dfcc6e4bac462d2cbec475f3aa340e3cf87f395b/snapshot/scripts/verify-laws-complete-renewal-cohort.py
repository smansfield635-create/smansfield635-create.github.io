#!/usr/bin/env python3
"""Verify the bounded five-page Laws renewal cohort.

This verifier is intentionally static and dependency-free. Browser/device execution
remains a separate acceptance layer.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

BASELINE = "8b2e2d872a968643c8e17a78f8e0df6060027730"

CONTROL = {
    "laws/control-plane/renewal/laws-complete-renewal-representative-implementation-authority-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-cross-compatibility-matrix-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-route-shape-reconciliation-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-rollback-and-protected-paths-v1.json",
}
ASSETS = {
    "assets/laws-destination/renewal.css",
    "assets/laws-destination/renewal.js",
}
PAGES = {
    "laws/categories/flow/signals/index.html": {
        "route": "/laws/categories/flow/signals/",
        "family": "LAW_CHILD",
        "ids": [],
    },
    "laws/categories/reality/measure.html": {
        "route": "/laws/categories/reality/measure.html",
        "family": "LAW_CHILD",
        "ids": [],
    },
    "laws/test/reverse-audit/index.html": {
        "route": "/laws/test/reverse-audit/",
        "family": "TEST_CHILD",
        "ids": ["CP6-CONTENT-119", "CP6-CONTENT-121", "CP6-CONTENT-122", "CP6-CONTENT-137"],
    },
    "laws/research/findings-and-boundaries/index.html": {
        "route": "/laws/research/findings-and-boundaries/",
        "family": "RESEARCH_CHILD",
        "ids": [
            "CP6-CONTENT-071", "CP6-CONTENT-080", "CP6-CONTENT-082",
            "CP6-CONTENT-083", "CP6-CONTENT-084", "CP6-CONTENT-085",
            "CP6-CONTENT-086",
        ],
    },
    "laws/industrial-posture/index.html": {
        "route": "/laws/industrial-posture/",
        "family": "EQUATION_OR_MODEL_SURFACE",
        "ids": ["CP6-CONTENT-063"],
    },
}
SCRIPT = "scripts/verify-laws-complete-renewal-cohort.py"
ALLOWED = CONTROL | ASSETS | set(PAGES) | {SCRIPT}
PROTECTED_PREFIXES = (
    "frontier/",
    "laws/index.controller.js",
    "laws/index.compositor.js",
    "laws/index.crystals.js",
    "laws/index.interactions.js",
    "laws/index.cosmos.js",
    "laws/index.planet.js",
    "assets/audralia/audralia.planet.js",
)


def fail(message: str) -> None:
    raise AssertionError(message)


def read(path: str) -> str:
    return Path(path).read_text(encoding="utf-8")


def count(text: str, needle: str) -> int:
    return text.count(needle)


def git_changed() -> set[str]:
    result = subprocess.run(
        ["git", "diff", "--name-only", f"{BASELINE}...HEAD"],
        check=True,
        text=True,
        capture_output=True,
    )
    return {line.strip() for line in result.stdout.splitlines() if line.strip()}


def verify_scope() -> dict[str, object]:
    changed = git_changed()
    unauthorized = sorted(changed - ALLOWED)
    missing = sorted((CONTROL | ASSETS | set(PAGES)) - changed)
    protected = sorted(path for path in changed if path.startswith(PROTECTED_PREFIXES))
    if unauthorized:
        fail(f"Unauthorized changed paths: {unauthorized}")
    if missing:
        fail(f"Expected cohort paths missing from diff: {missing}")
    if protected:
        fail(f"Protected paths changed: {protected}")
    return {"changed_paths": sorted(changed), "protected_path_diffs": protected}


def verify_page(path: str, spec: dict[str, object]) -> dict[str, object]:
    text = read(path)
    route = str(spec["route"])
    family = str(spec["family"])
    required = (
        f'data-route="{route}"',
        f'data-page-family="{family}"',
        "/assets/laws-destination/renewal.css",
        "/assets/laws-destination/renewal.js",
        'class="lr-hero"',
        'class="lr-boundary"',
        'class="lr-story-nav"',
        'class="lr-audit"',
        "data-lr-tabs",
    )
    for needle in required:
        if needle not in text:
            fail(f"{path}: missing {needle}")
    if '<meta http-equiv="refresh"' in text.lower() or "location.replace(" in text:
        fail(f"{path}: redirect behavior remains")
    if 'class="lr-panel" hidden' in text or 'role="tabpanel" hidden' in text:
        fail(f"{path}: no-JavaScript reading layer hidden in source")
    tabs = count(text, 'role="tab"')
    panels = count(text, 'role="tabpanel"')
    selected = count(text, 'aria-selected="true"')
    if tabs == 0 or tabs != panels:
        fail(f"{path}: tab/panel mismatch {tabs}/{panels}")
    if selected != 1:
        fail(f"{path}: expected exactly one requested active tab, got {selected}")
    for content_id in spec["ids"]:
        if content_id not in text:
            fail(f"{path}: missing canonical record {content_id}")
    return {
        "path": path,
        "route": route,
        "family": family,
        "tabs": tabs,
        "panels": panels,
        "canonical_records": list(spec["ids"]),
        "static_all_panels_present": True,
    }


def verify_shared_assets() -> dict[str, object]:
    css = read("assets/laws-destination/renewal.css")
    js = read("assets/laws-destination/renewal.js")
    for needle in (
        "@media (max-width: 920px)",
        "@media (max-width: 680px)",
        "@media (prefers-reduced-motion: reduce)",
        ".lr-tab[aria-selected=\"true\"]",
        ".lr-audit",
        ".lr-boundary",
    ):
        if needle not in css:
            fail(f"renewal.css missing {needle}")
    for needle in (
        "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End",
        "prefers-reduced-motion: reduce", "aria-selected", "panel.hidden",
    ):
        if needle not in js:
            fail(f"renewal.js missing {needle}")
    for forbidden in ("setInterval(", "requestAnimationFrame(loop", "canvas.getContext"):
        if forbidden in js:
            fail(f"renewal.js contains prohibited runtime pattern {forbidden}")
    return {
        "shared_css": True,
        "shared_js": True,
        "responsive_breakpoints": [920, 680],
        "reduced_motion": True,
        "keyboard_keys": ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"],
        "continuous_render_loop": False,
    }


def verify_specific_contracts() -> dict[str, object]:
    signals = read("laws/categories/flow/signals/index.html")
    measure = read("laws/categories/reality/measure.html")
    reverse = read("laws/test/reverse-audit/index.html")
    findings = read("laws/research/findings-and-boundaries/index.html")
    industrial = read("laws/industrial-posture/index.html")

    if "/laws/categories/flow/#signals" not in signals:
        fail("Signals historical family owner not preserved")
    if 'data-narrative-route="/laws/categories/reality/measure/"' not in measure:
        fail("Measure narrative identity missing")
    if "LAWS_COMPASS_WORLD_PASS_PLANET_AND_SHOWROOM_COSMOS_READY_HTML_RECEIPT_v2_3_0" not in reverse:
        fail("Reverse Audit structural provenance receipt missing")
    if "1,653 final-test records" not in findings or "AUROC 0.9394" not in findings:
        fail("Findings bounded battery result missing")

    equation = (
        "M_in = M_out + M_dest + ΔM_inv ± ε\n\n"
        "U = M_in - (M_out + M_dest + ΔM_inv)\n\n"
        "Closed if |U| &lt;= 3ε\n"
        "Open if |U| &gt; 3ε"
    )
    if equation not in industrial:
        fail("Industrial exact canonical equation identity missing")
    if "2c4caa3dea93fc96fcfd259c7bcdf000ccbc43ce826484298ae9cc9e72551657" not in industrial:
        fail("Industrial canonical payload hash missing")
    return {
        "signals_family_owner_preserved": True,
        "measure_html_route_preserved": True,
        "reverse_structural_receipt_preserved": True,
        "findings_bounded_result_preserved": True,
        "industrial_equation_identity_preserved": True,
    }


def main() -> int:
    receipt = {
        "contract": "LAWS_COMPLETE_RENEWAL_REPRESENTATIVE_STATIC_VERIFICATION_v1",
        "baseline": BASELINE,
        "scope": verify_scope(),
        "shared_assets": verify_shared_assets(),
        "pages": [verify_page(path, spec) for path, spec in PAGES.items()],
        "specific_contracts": verify_specific_contracts(),
        "browser_execution": "NOT_PERFORMED_BY_STATIC_VERIFIER",
        "user_visual_acceptance": "REQUIRED_BEFORE_MERGE",
        "batch_migration": "HELD",
    }
    print(json.dumps(receipt, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (AssertionError, OSError, subprocess.CalledProcessError) as exc:
        print(f"VERIFY_FAIL: {exc}", file=sys.stderr)
        sys.exit(1)
