#!/usr/bin/env python3
"""Strict static gate for Gen1843 frozen-Methods dimensional Laws continuity."""

from __future__ import annotations

import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GOVERNING_HEAD = os.environ.get("EXECUTION_BASE", "24c1bca8858499c86262a2534c5a84b54be537f2")
MAP_PATH = ROOT / "laws/room-carousel/route-card-map.v2.json"
ASSET_IDENTITY = "LAWS_LAYERED_INFORMATION_GRID_GEN1751_20260827"
SHARED_ALLOWED = {
    "laws/room-carousel/preconstruction-contract.v1.json",
    "laws/room-carousel/room-carousel.v1.css",
    "laws/room-carousel/room-carousel.v1.js",
    "laws/room-carousel/route-card-map.v2.json",
    "laws/room-carousel/verify-contextual-delivery.v2.mjs",
    "laws/room-carousel/verify.v1.mjs",
    "scripts/laws_cp6_final_browser_verify.mjs",
    "scripts/verify-laws-cp6-final-synchronization.py",
}


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def route_path(route: str) -> Path:
    return ROOT / (route.strip("/") if route.endswith(".html") else f"{route.strip('/')}/index.html")


def git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=True)


def main() -> int:
    manifest = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    routes = manifest["routes"]
    require(manifest["schema"] == "LAWS_LAYERED_INFORMATION_GRID_ROUTE_CARD_MAP_v3", "MAP_SCHEMA")
    require(len(routes) == 29, f"ROUTE_COUNT:{len(routes)}")
    require(sum(len(route["cards"]) for route in routes.values()) == 134, "CARD_TOTAL")
    require({len(route["cards"]) for route in routes.values()} == {4, 5, 6}, "VARIABLE_CARD_COUNTS")

    route_files = {str(route_path(route).relative_to(ROOT)) for route in routes}
    allowed = route_files | SHARED_ALLOWED
    changed = git("diff", "--name-only", GOVERNING_HEAD).stdout.splitlines()
    outside = sorted(set(changed) - allowed)
    require(not outside, f"OUT_OF_SCOPE_PATHS:{outside}")
    require("laws/index.html" not in changed, "LAWS_ROOT_MUTATED")
    methods_changed = {path for path in changed if path.startswith("laws/research/methods-and-models/")}
    require(not methods_changed, f"METHODS_MUST_BE_BYTE_FROZEN:{sorted(methods_changed)}")
    require(git("diff", "--quiet", GOVERNING_HEAD, "--", "laws/index.html").returncode == 0, "LAWS_ROOT_BYTES")
    require(git("diff", "--quiet", GOVERNING_HEAD, "--", "laws/research/methods-and-models/").returncode == 0, "METHODS_TREE_BYTES")
    require(git("diff", "--quiet", GOVERNING_HEAD, "--", "laws/room-carousel/route-card-map.v2.json").returncode == 0, "GEN1833_ROUTE_CARD_MAP_BYTES")
    for route_file in route_files:
        require(git("diff", "--quiet", GOVERNING_HEAD, "--", route_file).returncode == 0, f"GEN1833_CONTEXT_BYTES:{route_file}")

    generic = {"hero", "primary relationship", "reading layers", "study", "claim boundary"}
    for route, spec in routes.items():
        path = route_path(route)
        require(path.exists(), f"MISSING_ROUTE:{route}")
        source = path.read_text(encoding="utf-8")
        ids = " ".join(card["id"] for card in spec["cards"])
        declarations = {
            "data-lrc-route": route,
            "data-lrc-cards": ids,
            "data-lrc-internal-tabs": "practical engineering empirical",
            "data-lrc-story-axis": "vertical",
            "data-lrc-custody-selector": "details.lr-audit",
            "data-lrc-greater-navigation-selector": ".lr-story-nav",
        }
        for name, value in declarations.items():
            require(source.count(f'{name}="{value}"') == 1, f"DECLARATION:{route}:{name}")
        require(source.count(f"room-carousel.v1.css?v={ASSET_IDENTITY}") == 1, f"CSS_IDENTITY:{route}")
        require(source.count(f"room-carousel.v1.js?v={ASSET_IDENTITY}") == 1, f"JS_IDENTITY:{route}")
        require(source.count("data-lrc-static") == 1, f"SEMANTIC_GRID_COUNT:{route}")
        require(source.count("Source custody") == 1, f"COMPACT_CUSTODY_COUNT:{route}")
        require("lr-legacy-source" not in source, f"RAW_LEGACY_MIRROR:{route}")
        labels = {card["label"].strip().lower() for card in spec["cards"]}
        require(not labels.intersection(generic), f"GENERIC_CARD:{route}:{labels.intersection(generic)}")
        for card in spec["cards"]:
            stories = card.get("stories", [])
            require(4 <= len(stories) <= 5, f"STORY_COUNT:{route}:{card['id']}:{len(stories)}")
            require(len({story["id"] for story in stories}) == len(stories), f"STORY_IDS:{route}:{card['id']}")
            require(len({story["label"] for story in stories}) == len(stories), f"STORY_LABELS:{route}:{card['id']}")
            for story in stories:
                require(not re.search(r"\bboundary \d+\b", story["label"], re.I), f"PLACEHOLDER_STORY:{route}:{card['id']}:{story['id']}")
                for lens in ("practical", "engineering", "empirical"):
                    require(story.get("readings", {}).get(lens, "").strip(), f"EMPTY_CELL:{route}:{card['id']}:{story['id']}:{lens}")

    reality = routes["/laws/categories/reality/"]["cards"]
    reality_actions = {card["id"]: card.get("href") for card in reality if card.get("href")}
    require(reality_actions == {
        "theory": "/laws/categories/reality/theory.html",
        "evidence": "/laws/categories/reality/evidence.html",
        "measure": "/laws/categories/reality/measure.html",
        "limits": "/laws/categories/reality/limits.html",
    }, f"REALITY_ACTIONS:{reality_actions}")
    require(not next(card for card in reality if card["id"] == "audit").get("href"), "INVENTED_AUDIT_ROUTE")
    reality_source = route_path("/laws/categories/reality/").read_text(encoding="utf-8")
    require('href="/laws/categories/integrity/"' in reality_source, "REALITY_PREVIOUS_CONTINUITY")
    require('href="/laws/categories/structure/"' in reality_source, "REALITY_NEXT_CONTINUITY")

    runtime = (ROOT / "laws/room-carousel/room-carousel.v1.js").read_text(encoding="utf-8")
    stylesheet = (ROOT / "laws/room-carousel/room-carousel.v1.css").read_text(encoding="utf-8")
    for marker in (
        "route-card-map.v2.json",
        "routeMap.cards.map",
        "[data-lrc-inner-tab]",
        "[data-lrc-story-tab]",
        "[data-lrc-grid-cell]",
        "depth-tab-keyboard",
        "sameObjectContinuity:true",
        "↶ Return to Orbit",
        "audit.open = false",
        "METHODS_AND_MODELS_PROGRESSIVE_CARD_ARCHITECTURE_TWO_EXCEPTION_CONTINUITY",
    ):
        require(marker in runtime, f"RUNTIME_MARKER:{marker}")
    select_story = re.search(r"function selectStory[\s\S]*?\n    }", runtime)
    open_inspection = re.search(r"function openInspection[\s\S]*?\n    }", runtime)
    require(select_story and "state.layers[cardIndex] = 0" not in select_story.group(0), "STORY_RESETS_LENS")
    require(open_inspection and "state.layers[state.index] = 0" not in open_inspection.group(0), "OPEN_RESETS_LENS")
    require(open_inspection and "state.stories[state.index] = 0" not in open_inspection.group(0), "OPEN_RESETS_STORY")
    require("nativeChildren" not in runtime, "DIRECT_CHILD_CARD_INFERENCE_RETURNED")
    require("Identity / Meaning" not in runtime, "GENERIC_SCENE_INVENTORY_RETURNED")
    for marker in ("[data-lrc-inner-tabs]", "[data-lrc-story-rail]", "[data-lrc-story-tab]", "[data-lrc-grid-cell]", "[data-lrc-claim-boundary]", "data-lrc-family"):
        require(marker in stylesheet, f"STYLESHEET_MARKER:{marker}")
    for marker in (
        "LAWS_LAYERED_INFORMATION_GRID_GEN1843_METHODS_FROZEN_DIMENSIONAL_GRAMMAR",
        "width:clamp(17rem,30vw,27rem)",
        "height:clamp(24rem,52vh,34rem)",
        "width:min(72vw,27rem)",
        "height:31rem",
        "@media (max-width: 760px)",
        "width:min(82vw,21rem)",
        "height:29rem",
        "@media (max-width: 440px)",
        "width:min(86vw,19.5rem)",
    ):
        require(marker in stylesheet, f"METHODS_GEOMETRY_MARKER:{marker}")
    require("width:min(55vw,25rem)" not in stylesheet, "OBSOLETE_TABLET_CARD_WIDTH_RETURNED")
    require("height:25rem !important" not in stylesheet, "OBSOLETE_TABLET_CARD_HEIGHT_RETURNED")

    methods_polish = (ROOT / "laws/research/methods-and-models/carousel-final-polish.css").read_text(encoding="utf-8")
    methods_index = (ROOT / "laws/research/methods-and-models/index.html").read_text(encoding="utf-8")
    require("top: calc(39% + 3rem)" in methods_polish, "METHODS_REFERENCE_SETTLEMENT_MISSING")
    require('class="mm-story-nav"' in methods_index, "METHODS_BOTTOM_CONTINUITY_MISSING")

    subprocess.run(["node", "laws/room-carousel/verify-contextual-delivery.v2.mjs", "--static-only"], cwd=ROOT, check=True)
    result = {
        "contract": "LAWS_METHODS_FROZEN_DIMENSIONAL_CONTINUITY_STATIC_MATRIX_v1",
        "status": "PASS",
        "governing_head": GOVERNING_HEAD,
        "routes": len(routes),
        "cards": 134,
        "cells": sum(len(card["stories"]) * 3 for route in routes.values() for card in route["cards"]),
        "card_counts": [4, 5, 6],
        "gen1833_context_corpus_preserved": True,
        "methods_tree_byte_frozen": True,
        "laws_root_protected": True,
        "methods_geometry_conformance_required": True,
        "internal_lens_state_independent": True,
        "reopen_state_restoration_required": True,
        "reality_existing_deep_routes": sorted(reality_actions),
        "reality_previous_next": ["/laws/categories/integrity/", "/laws/categories/structure/"],
    }
    artifact = ROOT / "artifacts/laws-cp6-final-synchronization/static-result.json"
    artifact.parent.mkdir(parents=True, exist_ok=True)
    artifact.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())