#!/usr/bin/env python3
"""Strict static gate for the Gen1788 Laws Methods-derived visual reconstruction."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GOVERNING_HEAD = "a72822e5413684fa885b5f6c65e03795cf5ece8b"
MAP_PATH = ROOT / "laws/room-carousel/route-card-map.v2.json"
ASSET_IDENTITY = "LAWS_LAYERED_INFORMATION_GRID_GEN1751_20260827"
METHODS_ALLOWED = "laws/research/methods-and-models/carousel-final-polish.css"
SHARED_ALLOWED = {
    "laws/room-carousel/preconstruction-contract.v1.json",
    "laws/room-carousel/room-carousel.v1.css",
    "laws/room-carousel/room-carousel.v1.js",
    "laws/room-carousel/route-card-map.v2.json",
    "laws/room-carousel/verify-contextual-delivery.v2.mjs",
    "laws/room-carousel/verify.v1.mjs",
    "laws/room-carousel/information-depth.v1.css",
    "scripts/laws_cp6_final_browser_verify.mjs",
    "scripts/verify-laws-cp6-final-synchronization.py",
    METHODS_ALLOWED,
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
    methods_changed = sorted(path for path in changed if path.startswith("laws/research/methods-and-models/"))
    require(methods_changed in ([], [METHODS_ALLOWED]), f"METHODS_SCOPE_DRIFT:{methods_changed}")
    require(git("diff", "--quiet", GOVERNING_HEAD, "--", "laws/index.html").returncode == 0, "LAWS_ROOT_BYTES")
    for path in (
        "laws/research/methods-and-models/index.html",
        "laws/research/methods-and-models/carousel.js",
        "laws/research/methods-and-models/carousel-data.js",
        "laws/research/methods-and-models/carousel.css",
        "laws/research/methods-and-models/carousel-coherence.css",
        "laws/research/methods-and-models/carousel-progressive.css",
    ):
        require(git("diff", "--quiet", GOVERNING_HEAD, "--", path).returncode == 0, f"METHODS_PROTECTED_BYTES:{path}")

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
        "route-card-map.v2.json", "routeMap.cards.map", "[data-lrc-inner-tab]", "[data-lrc-story-tab]",
        "[data-lrc-grid-cell]", "state.layers[state.index] = 0", "state.stories[state.index] = 0",
        "internalStateIndependent: true", "↶ Return to Orbit", "audit.open = false",
    ):
        require(marker in runtime, f"RUNTIME_MARKER:{marker}")
    require("nativeChildren" not in runtime, "DIRECT_CHILD_CARD_INFERENCE_RETURNED")
    require("Identity / Meaning" not in runtime, "GENERIC_SCENE_INVENTORY_RETURNED")
    for marker in ("[data-lrc-inner-tabs]", "[data-lrc-story-rail]", "[data-lrc-story-tab]", "[data-lrc-grid-cell]", "[data-lrc-claim-boundary]", "data-lrc-family"):
        require(marker in stylesheet, f"STYLESHEET_MARKER:{marker}")
    for marker in ("Georgia", "perspective:3200px", "var(--lrc-family-accent)", "radial-gradient", "subordinate"):
        require(marker in stylesheet, f"METHODS_DERIVED_STYLE_MARKER:{marker}")

    methods_polish = (ROOT / METHODS_ALLOWED).read_text(encoding="utf-8")
    require("calc(39% + .5in)" in methods_polish, "METHODS_DESKTOP_HALF_INCH_DELTA")
    require("calc(48% + .5in)" in methods_polish, "METHODS_TABLET_HALF_INCH_DELTA")
    require("calc(49% + .5in)" in methods_polish, "METHODS_PHONE_HALF_INCH_DELTA")
    require('data-inspecting="true"' in methods_polish and "top: 50%" in methods_polish, "METHODS_INSPECTION_POSITION_PRESERVED")

    subprocess.run(["node", "laws/room-carousel/verify-contextual-delivery.v2.mjs", "--static-only"], cwd=ROOT, check=True)
    result = {
        "contract": "LAWS_METHODS_DERIVED_VISUAL_RECONSTRUCTION_STRICT_STATIC_MATRIX_v1",
        "status": "PASS",
        "governing_head": GOVERNING_HEAD,
        "operation": "LAWS_METHODS_DERIVED_VISUAL_RECONSTRUCTION_20260828_001",
        "lock_generation": 1788,
        "routes": len(routes),
        "cards": 134,
        "cells": sum(len(card["stories"]) * 3 for route in routes.values() for card in route["cards"]),
        "card_counts": [4, 5, 6],
        "methods_bounded_half_inch_adjustment": True,
        "methods_other_bytes_protected": True,
        "methods_derived_shared_visual_grammar": True,
        "laws_root_protected": True,
        "reality_representative": True,
    }
    artifact = ROOT / "artifacts/laws-cp6-final-synchronization/static-result.json"
    artifact.parent.mkdir(parents=True, exist_ok=True)
    artifact.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
