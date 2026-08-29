#!/usr/bin/env python3
"""Strict static gate for the Gen1751 Laws layered-information-grid reconstruction."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GOVERNING_HEAD = "0b855a29a7b082953eef2363eeddc02a58df2f22"
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
    require(not any(path.startswith("laws/research/methods-and-models/") for path in changed), "METHODS_MUTATED")
    require(git("diff", "--quiet", GOVERNING_HEAD, "--", "laws/index.html").returncode == 0, "LAWS_ROOT_BYTES")
    require(git("diff", "--quiet", GOVERNING_HEAD, "--", "laws/research/methods-and-models").returncode == 0, "METHODS_BYTES")

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
    require(
        reality_actions
        == {
            "theory": "/laws/categories/reality/theory.html",
            "evidence": "/laws/categories/reality/evidence.html",
            "measure": "/laws/categories/reality/measure.html",
            "limits": "/laws/categories/reality/limits.html",
        },
        f"REALITY_ACTIONS:{reality_actions}",
    )
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
        "state.layers[state.index] = 0",
        "state.stories[state.index] = 0",
        "layers:cards.map(() => 0)",
        "stories:cards.map(() => 0)",
        "↶ Return to Orbit",
        "audit.open = false",
    ):
        require(marker in runtime, f"RUNTIME_MARKER:{marker}")
    require("nativeChildren" not in runtime, "DIRECT_CHILD_CARD_INFERENCE_RETURNED")
    require("Identity / Meaning" not in runtime, "GENERIC_SCENE_INVENTORY_RETURNED")
    for marker in ("[data-lrc-inner-tabs]", "[data-lrc-story-rail]", "[data-lrc-story-tab]", "[data-lrc-grid-cell]", "[data-lrc-claim-boundary]", "data-lrc-family"):
        require(marker in stylesheet, f"STYLESHEET_MARKER:{marker}")

    subprocess.run(
        ["node", "laws/room-carousel/verify-contextual-delivery.v2.mjs", "--static-only"],
        cwd=ROOT,
        check=True,
    )
    result = {
        "contract": "LAWS_LAYERED_INFORMATION_GRID_STRICT_STATIC_MATRIX_v3",
        "status": "PASS",
        "governing_head": GOVERNING_HEAD,
        "routes": len(routes),
        "cards": 134,
        "story_counts": {
            "four": sum(1 for route in routes.values() for card in route["cards"] if len(card["stories"]) == 4),
            "five": sum(1 for route in routes.values() for card in route["cards"] if len(card["stories"]) == 5),
        },
        "cells": sum(len(card["stories"]) * 3 for route in routes.values() for card in route["cards"]),
        "card_counts": [4, 5, 6],
        "methods_byte_identical": True,
        "laws_root_protected": True,
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
