#!/usr/bin/env python3
"""Static acceptance verifier for the final Laws Checkpoint 6 synchronization."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NARRATIVE = ROOT / "laws/control-plane/narrative/laws-complete-narrative-map-v1.json"
BATTERY_SCOPE = ROOT / "laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"

STORY_TO_SERVED = {
    "/laws/categories/reality/theory/": "laws/categories/reality/theory.html",
    "/laws/categories/reality/evidence/": "laws/categories/reality/evidence.html",
    "/laws/categories/reality/measure/": "laws/categories/reality/measure.html",
    "/laws/categories/reality/limits/": "laws/categories/reality/limits.html",
    "/laws/categories/structure/constraints/": "laws/categories/structure/constraints.html",
    "/laws/categories/structure/interfaces/": "laws/categories/structure/interfaces.html",
    "/laws/categories/structure/boundaries/": "laws/categories/structure/boundaries.html",
    "/laws/categories/structure/governance/": "laws/categories/structure/governance.html",
}

INTEGRATED_ROUTES = [
    "/laws/",
    "/laws/categories/flow/",
    "/laws/categories/integrity/",
    "/laws/categories/reality/",
    "/laws/categories/structure/",
    "/laws/battery-heldout-study/",
    "/laws/scientific-law/battery-heldout-study/",
    "/laws/categories/reality/battery-heldout-study/",
    "/frontier/energy/battery-coherence-study/",
]

METHODS_SHOWROOM_ROUTE = "/laws/research/methods-and-models/"
METHODS_SHOWROOM_CONTRACT = "METHODS_MODELS_SINGLE_AXIS_EUCLIDEAN_CAROUSEL_v1"
METHODS_CANONICAL_ARCHIVE = "METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT"
ROOM_CAROUSEL_ASSET_IDENTITY = "LAWS_BACK_PAGE_CAROUSEL_CORRECTION_20260825A"
ROOM_CAROUSEL_CSS_HREF = f"/laws/room-carousel/room-carousel.v1.css?v={ROOM_CAROUSEL_ASSET_IDENTITY}"
ROOM_CAROUSEL_JS_SRC = f"/laws/room-carousel/room-carousel.v1.js?v={ROOM_CAROUSEL_ASSET_IDENTITY}"
FAMILY_CAROUSEL_ROUTES = [
    "/laws/categories/flow/",
    "/laws/categories/integrity/",
    "/laws/categories/reality/",
    "/laws/categories/structure/",
]

OBSOLETE = [
    ".github/workflows/laws-complete-renewal-batch-materialize.yml",
    ".github/workflows/laws-complete-renewal-batch-verification.yml",
    ".github/workflows/laws-complete-renewal-batch-verification-v3.yml",
    ".github/workflows/laws-complete-renewal-reverse-audit-comparator.yml",
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

PROTECTED_RUNTIME = {
    "laws/index.controller.js",
    "laws/index.interactions.js",
    "laws/index.compositor.js",
    "laws/index.cosmos.js",
    "laws/index.crystals.js",
    "laws/index.planet.js",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def served_route(route: str) -> str:
    if route in STORY_TO_SERVED:
        return f"/{STORY_TO_SERVED[route]}"
    return route


def route_path(route: str) -> Path:
    if route in STORY_TO_SERVED:
        return ROOT / STORY_TO_SERVED[route]
    raw = route.strip("/")
    if raw.endswith(".html"):
        return ROOT / raw
    return ROOT / raw / "index.html"


def source(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def main() -> int:
    narrative = json.loads(source(NARRATIVE))
    battery = json.loads(source(BATTERY_SCOPE))
    receipt = json.loads(source(RECEIPT))

    pages = narrative.get("pages", [])
    require(len(pages) == 24, f"NARRATIVE_CHILD_COUNT:{len(pages)}")
    child_routes = [page["route"] for page in pages]
    require(len(set(child_routes)) == 24, "DUPLICATE_CHILD_ROUTE")
    require(battery.get("public_surface_count") == 27, "BATTERY_SCOPE_NOT_27")

    integrated = list(INTEGRATED_ROUTES)
    for route in child_routes:
        if route not in integrated:
            integrated.append(route)
    require(len(integrated) == 33, f"INTEGRATED_ROUTE_COUNT:{len(integrated)}")

    missing = [route for route in integrated if not route_path(route).exists()]
    require(not missing, f"MISSING_INTEGRATED_ROUTES:{missing}")

    renewed_paths: list[Path] = []
    for route in integrated:
        path = route_path(route)
        text = source(path)
        require(re.search(r"<!doctype html>", text, re.I), f"DOCTYPE_MISSING:{path}")
        require(re.search(r"<h1\b", text, re.I), f"H1_MISSING:{path}")
        require("<title>" in text.lower(), f"TITLE_MISSING:{path}")
        if route != "/laws/":
            renewed_paths.append(path)
            if route == METHODS_SHOWROOM_ROUTE:
                require(
                    f'data-methods-models-contract="{METHODS_SHOWROOM_CONTRACT}"' in text,
                    f"METHODS_SHOWROOM_CONTRACT_MISSING:{path}",
                )
                require(
                    f'data-canonical-archive="{METHODS_CANONICAL_ARCHIVE}"' in text,
                    f"METHODS_CANONICAL_ARCHIVE_BINDING_MISSING:{path}",
                )
                require('data-source-completeness="open"' in text, f"METHODS_SOURCE_COMPLETENESS_DRIFT:{path}")
                manifest = source(ROOT / "laws/research/methods-and-models/canonical-records-v1.html")
                require('data-record-class="READ_ONLY_CANONICAL_MANIFEST"' in manifest, "METHODS_CANONICAL_MANIFEST_CONTRACT_MISSING")
                require(METHODS_CANONICAL_ARCHIVE in manifest, "METHODS_CANONICAL_MANIFEST_ARCHIVE_MISMATCH")
            else:
                if "battery-heldout-study" not in route:
                    require("lr-boundary" in text, f"BOUNDARY_MISSING:{path}")
                    require("lr-audit" in text, f"AUDIT_MISSING:{path}")
                require('aria-selected="true"' not in text, f"SOURCE_PRESELECTED_TAB:{path}")
                require('aria-expanded="true"' not in text, f"SOURCE_PREOPENED_CONTROL:{path}")

    story_carousel_pages = [page for page in pages if page["route"] != METHODS_SHOWROOM_ROUTE]
    story_carousel_routes = [page["route"] for page in story_carousel_pages]
    room_carousel_routes = (
        story_carousel_routes
        + ["/laws/research/", "/laws/categories/reality/battery-heldout-study/"]
        + FAMILY_CAROUSEL_ROUTES
    )
    require(len(story_carousel_routes) == 23, f"STORY_CAROUSEL_ROUTE_COUNT:{len(story_carousel_routes)}")
    require(len(FAMILY_CAROUSEL_ROUTES) == 4, f"FAMILY_CAROUSEL_ROUTE_COUNT:{len(FAMILY_CAROUSEL_ROUTES)}")
    require(len(room_carousel_routes) == 29, f"ROOM_CAROUSEL_ROUTE_COUNT:{len(room_carousel_routes)}")
    require(len(set(room_carousel_routes)) == 29, "DUPLICATE_ROOM_CAROUSEL_ROUTE")
    require(METHODS_SHOWROOM_ROUTE not in room_carousel_routes, "METHODS_SHOWROOM_ENTERED_SHARED_CAROUSEL")
    for route in room_carousel_routes:
        path = route_path(route)
        text = source(path)
        require(text.count("data-laws-room-carousel") == 1, f"ROOM_CAROUSEL_ROOT_COUNT:{path}")
        require(text.count(f'href="{ROOM_CAROUSEL_CSS_HREF}"') == 1, f"ROOM_CAROUSEL_CSS_IDENTITY:{path}")
        require(text.count(f'src="{ROOM_CAROUSEL_JS_SRC}"') == 1, f"ROOM_CAROUSEL_JS_IDENTITY:{path}")

    for page in story_carousel_pages:
        path = route_path(page["route"])
        text = source(path)
        story_nav = re.search(r'<nav class="lr-story-nav"[^>]*>(.*?)</nav>', text, re.S)
        require(story_nav is not None, f"STORY_NAVIGATION_MISSING:{path}")
        hrefs = re.findall(r'<a href="([^"]+)"', story_nav.group(1))
        expected_hrefs = [
            served_route(page["previous_story_beat"]["route"]),
            served_route(page["next_story_beat"]["route"]),
        ]
        require(hrefs == expected_hrefs, f"STORY_NAVIGATION_ROUTE_DRIFT:{path}:{hrefs}")
        require("Previous" in story_nav.group(1), f"STORY_NAVIGATION_BACKWARD_LABEL_MISSING:{path}")

    carousel_runtime = source(ROOT / "laws/room-carousel/room-carousel.v1.js")
    require(
        'details.lr-audit,.lr-story-nav,[data-lrc-depth]' in carousel_runtime,
        "STORY_NAVIGATION_CAROUSEL_ADOPTION_EXCLUSION_MISSING",
    )

    landing = source(ROOT / "laws/index.html")
    for marker in (
        "lr-battery-landing",
        "BATTERY_COHERENCE_HELDOUT_STUDY_v1",
        "3 held-out cells",
        "1,653 final-test cycle records",
        "20-cycle warning horizon",
        "AUROC 0.9394",
        "AUROC 0.9704",
        'data-laws-root-restoration="LAWS_EXPERIENTIAL_ARCHITECTURE_RESTORATION_v1"',
    ):
        require(marker in landing, f"LANDING_MARKER_MISSING:{marker}")

    renewal = source(ROOT / "assets/laws-destination/renewal.js")
    for marker in (
        "collapsePanels(buttons, panels)",
        "setupCollapsibleNavigation",
        "aria-expanded",
        "renewal-navigation.css",
    ):
        require(marker in renewal, f"RENEWAL_ENGINE_MARKER_MISSING:{marker}")
    require("activate(tabs, panels" not in renewal, "OBSOLETE_PRESELECTED_TAB_ENGINE")

    signals = source(ROOT / "laws/categories/flow/signals/index.html")
    measure = source(ROOT / "laws/categories/reality/measure.html")
    reverse = source(ROOT / "laws/test/reverse-audit/index.html")
    feedback = source(ROOT / "laws/categories/flow/feedback/index.html")
    require("defined near-term event was evaluated within the next 20 cycles" in signals, "SIGNALS_HORIZON_MISSING")
    require("event evaluated within the next 20 cycles" in measure, "MEASURE_HORIZON_MISSING")
    require("1,653 final-test cycle records from three held-out cells" in reverse, "REVERSE_SAMPLE_CONTEXT_MISSING")
    require("<strong>INPUT_(t+1)</strong>" in feedback, "INTERNAL_PLUS_NOT_PRESERVED")
    require("<strong>INPUT_(t</strong>" not in feedback, "BROKEN_INTERNAL_PLUS_FRAGMENT")

    final_sync = receipt.get("final_synchronization", {})
    require(final_sync.get("status") == "APPLIED_PENDING_EXACT_HEAD_VERIFICATION", "FINAL_SYNC_RECEIPT_MISSING")
    require(final_sync.get("zero_open_entry_preserved") is True, "FINAL_SYNC_ZERO_OPEN_DRIFT")
    require(final_sync.get("battery_public_surface_scope") == 27, "FINAL_SYNC_BATTERY_SCOPE_DRIFT")
    detail = receipt.get("final_detail_normalization", {})
    require(detail.get("status") == "APPLIED_PENDING_EXACT_HEAD_VERIFICATION", "DETAIL_NORMALIZATION_RECEIPT_MISSING")
    require(detail.get("zero_open_source_contract") is True, "DETAIL_ZERO_OPEN_DRIFT")
    require(detail.get("formula_node_split_rule") == "ARROWS_ONLY_INTERNAL_PLUS_PRESERVED", "FORMULA_SPLIT_RULE_DRIFT")

    for raw in OBSOLETE:
        require(not (ROOT / raw).exists(), f"OBSOLETE_CARRIER_REMAINS:{raw}")

    changed = set(subprocess.check_output(
        ["git", "diff", "--name-only", "origin/main...HEAD"], text=True
    ).splitlines())
    require(not (changed & PROTECTED_RUNTIME), f"PROTECTED_RUNTIME_MUTATION:{sorted(changed & PROTECTED_RUNTIME)}")
    deleted = subprocess.check_output(
        ["git", "diff", "--diff-filter=D", "--name-only", "origin/main...HEAD"], text=True
    ).splitlines()
    require(not deleted, f"ROUTE_OR_FILE_DELETION:{deleted}")

    result = {
        "contract": "LAWS_CP6_FINAL_SYNCHRONIZATION_STATIC_VERIFICATION_v1",
        "status": "PASS",
        "childRoutes": 24,
        "integratedRoutes": 33,
        "batteryPublicSurfaces": 27,
        "methodsModelsAlternateContract": "PASS",
        "roomCarouselRoutes": 29,
        "roomCarouselStoryRoutes": 23,
        "roomCarouselFamilyRoots": 4,
        "roomCarouselAssetIdentity": ROOM_CAROUSEL_ASSET_IDENTITY,
        "roomCarouselStaticBinding": "PASS",
        "roomCarouselBottomStoryNavigation": "PASS",
        "zeroOpenSourceContract": "PASS",
        "formulaNodeSplitRule": "ARROWS_ONLY_INTERNAL_PLUS_PRESERVED",
        "protectedRuntimeMutations": 0,
        "routeDeletions": 0,
        "obsoleteCarriers": 0,
        "verifiedHead": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
    }
    artifact = ROOT / "artifacts/laws-cp6-final-synchronization/static-result.json"
    artifact.parent.mkdir(parents=True, exist_ok=True)
    artifact.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
