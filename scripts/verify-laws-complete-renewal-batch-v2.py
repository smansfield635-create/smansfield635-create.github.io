#!/usr/bin/env python3
"""Public-layer static verifier for the complete Laws and battery-study renewal."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts/laws-complete-renewal-batch-verification"
OUT.mkdir(parents=True, exist_ok=True)


def load(path: str) -> dict[str, Any]:
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def read(path: str) -> str:
    target = ROOT / path
    if not target.exists():
        raise AssertionError(f"Missing file: {path}")
    return target.read_text(encoding="utf-8")


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def git_lines(*args: str) -> list[str]:
    output = subprocess.check_output(["git", *args], cwd=ROOT, text=True)
    return [line.strip() for line in output.splitlines() if line.strip()]


narrative = load("laws/control-plane/narrative/laws-complete-narrative-map-v1.json")
manifest = load("laws/control-plane/renewal/laws-complete-renewal-remaining-20-route-migration-manifest-v1.json")
battery_scope = load("laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json")
receipt = load("laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json")
battery = load("laws/control-plane/cp6-context/laws-battery-study-contextual-interpretation-record-v1.json")
route_contract = load("laws/control-plane/cp6-1/cp6-2-route-contract.json")

story_to_served = {
    "/laws/categories/reality/theory/": "/laws/categories/reality/theory.html",
    "/laws/categories/reality/evidence/": "/laws/categories/reality/evidence.html",
    "/laws/categories/reality/measure/": "/laws/categories/reality/measure.html",
    "/laws/categories/reality/limits/": "/laws/categories/reality/limits.html",
    "/laws/categories/structure/constraints/": "/laws/categories/structure/constraints.html",
    "/laws/categories/structure/interfaces/": "/laws/categories/structure/interfaces.html",
    "/laws/categories/structure/boundaries/": "/laws/categories/structure/boundaries.html",
    "/laws/categories/structure/governance/": "/laws/categories/structure/governance.html",
}

route_paths = {
    "/laws/categories/flow/signals/": "laws/categories/flow/signals/index.html",
    "/laws/categories/reality/measure/": "laws/categories/reality/measure.html",
    "/laws/test/reverse-audit/": "laws/test/reverse-audit/index.html",
    "/laws/research/findings-and-boundaries/": "laws/research/findings-and-boundaries/index.html",
}
for wave in manifest["migration_waves"]:
    for entry in wave["routes"]:
        route_paths[entry["story_route"]] = entry["source_path"]

require(len(narrative["pages"]) == 24, "Narrative map no longer contains 24 child routes")
require(len(route_paths) == 24, "Route-shape inventory no longer contains 24 child bindings")
require(receipt["remaining_child_routes_materialized"] == 20, "Twenty-route materialization drift")
require(receipt["battery_public_surface_scope"] == 27, "Battery receipt scope drift")
require(receipt["product_file_count"] == 29, "Materialized product-file count drift")
require(battery_scope["public_surface_count"] == 27, "Battery authority scope drift")

no_study: list[str] = []
battery_children: list[str] = []
child_paths: list[str] = []

for page in narrative["pages"]:
    story_route = page["route"]
    served_route = story_to_served.get(story_route, story_route)
    path = route_paths[story_route]
    source = read(path)
    public = source.split('<details class="lr-audit"', 1)[0]
    child_paths.append(path)

    require(f'data-route="{served_route}"' in source, f"{story_route}: served route identity drift")
    if served_route != story_route:
        require(f'data-narrative-route="{story_route}"' in source, f"{story_route}: narrative identity missing")
        require(f'https://diamondgatebridge.com{served_route}' in source, f"{story_route}: retained .html canonical missing")

    for marker in (
        '/assets/laws-destination/renewal.css',
        '/assets/laws-destination/renewal.js',
        'class="lr-hero"',
        'class="lr-boundary"',
        'class="lr-story-nav"',
        'class="lr-audit"',
    ):
        require(marker in source, f"{story_route}: missing {marker}")
    require('<meta http-equiv="refresh"' not in source.lower(), f"{story_route}: redirect metadata introduced")
    require('location.replace(' not in source, f"{story_route}: redirect script introduced")
    require('role="tabpanel" hidden' not in public, f"{story_route}: public static panel hidden in source")

    authority = page["authority"]
    expected_tabs = 3 if authority in {"FLOW", "INTEGRITY", "REALITY", "STRUCTURE"} else 5
    tabs = public.count('role="tab"')
    panels = public.count('role="tabpanel"')
    require((tabs, panels) == (expected_tabs, expected_tabs), f"{story_route}: expected {expected_tabs} public tabs/panels, found {tabs}/{panels}")
    require(public.count('aria-selected="true"') == 1, f"{story_route}: public active lens is not singular")

    relation = (page.get("related_study") or {}).get("relationship_status", "NO_CURRENT_ADMITTED_STUDY")
    if relation == "NO_CURRENT_ADMITTED_STUDY":
        no_study.append(story_route)
        require("No current admitted study" in public, f"{story_route}: no-study discipline missing")
        require("BATTERY_COHERENCE_HELDOUT_STUDY_v1" not in public, f"{story_route}: battery study forced into public layer")
    else:
        battery_children.append(story_route)

require(len(no_study) == 6, f"Expected six no-study routes, found {len(no_study)}")
require(len(battery_children) == 18, f"Expected eighteen battery-related children, found {len(battery_children)}")

product_files = set(receipt["product_files_written"])
require(len(product_files) == 29, "Product file list contains duplicates")
for path in product_files:
    source = read(path)
    if path == "laws/index.html":
        require('id="cp6-work-behind-laws"' in source and 'lr-battery-landing' in source, "Laws landing battery module missing")
    else:
        require('data-laws-complete-renewal="v1"' in source, f"{path}: renewal marker missing")
        require('/assets/laws-destination/renewal-navigation.css' in source, f"{path}: collapsible nav CSS missing")
        require('/assets/laws-destination/renewal-batch.css' in source, f"{path}: batch visual CSS missing")

family_paths = [
    "laws/categories/flow/index.html",
    "laws/categories/integrity/index.html",
    "laws/categories/reality/index.html",
    "laws/categories/structure/index.html",
]
wrapper_paths = [
    "laws/battery-heldout-study/index.html",
    "laws/scientific-law/battery-heldout-study/index.html",
    "laws/categories/reality/battery-heldout-study/index.html",
]
frontier_path = "frontier/energy/battery-coherence-study/index.html"
battery_paths = ["laws/index.html", *family_paths]
battery_paths += [route_paths[route] for route in battery_children]
battery_paths += wrapper_paths + [frontier_path]
require(len(battery_paths) == 27 and len(set(battery_paths)) == 27, "Battery public inventory is not 27 unique surfaces")

for path in battery_paths:
    source = read(path)
    require("0.9394" in source and "0.9704" in source, f"{path}: held-out/comparator metrics missing")
    require("1,653" in source or "1653" in source, f"{path}: final-test record count missing")
    require("20-cycle" in source or "20 cycles" in source, f"{path}: warning horizon missing")
    require("burden" in source.lower(), f"{path}: stronger comparator finding missing")

frontier = read(frontier_path)
require('data-complete-record-owner="FRONTIER"' in frontier, "Frontier ownership marker missing")
require('data-operational-readiness-claimed="false"' in frontier, "Operational-readiness boundary missing")
require('data-external-replication-claimed="false"' in frontier, "External-replication boundary missing")

observations = battery["data_and_observation_units"]
require(observations["held_out_cell_count"] == 3, "Held-out cell count drift")
require(observations["final_test_record_count"] == 1653, "Final-test record count drift")
require(observations["warning_horizon_cycles"] == 20, "Warning horizon drift")
require(battery["baselines_and_comparators"][0]["auroc"] == 0.9394, "Combined AUROC drift")
require(battery["baselines_and_comparators"][1]["auroc"] == 0.9704, "Burden AUROC drift")

canonical_destinations = {
    "laws/research/applied-investigations/index.html": 11,
    "laws/research/evidence-and-sources/index.html": 6,
    "laws/research/methods-and-models/index.html": 10,
    "laws/research/findings-and-boundaries/index.html": 7,
    "laws/test/admission-and-baseline/index.html": 2,
    "laws/test/forward-construction/index.html": 1,
    "laws/test/reverse-audit/index.html": 4,
    "laws/test/result-and-record/index.html": 7,
}
seen: set[str] = set()
distribution: dict[str, int] = {}
for path, expected in canonical_destinations.items():
    ids = set(re.findall(r'data-content-id="(CP6-CONTENT-\d+)"', read(path)))
    require(len(ids) == expected, f"{path}: expected {expected} canonical records, found {len(ids)}")
    require(not seen.intersection(ids), f"{path}: duplicate canonical identities")
    seen.update(ids)
    distribution[path] = len(ids)
require(len(seen) == 48, f"Expected 48 unique canonical records, found {len(seen)}")
require(route_contract["compatibility_binding_count"] == 9, "Compatibility binding count drift")
require(route_contract["bindings_with_complete_required_field_set"] == 9, "Compatibility field-set drift")

laws = read("laws/index.html")
interactions = read("laws/index.interactions.js")
require('data-laws-category-count="6"' in laws, "Six-authority marker missing")
require('data-laws-child-route-count="24"' in laws, "Twenty-four-child marker missing")
require('data-laws-primary-star-count="4"' in laws, "Four-law-star marker missing")
require('const D=Object.freeze(["flow","integrity","reality","structure","test","research"])' in interactions, "Six-authority runtime identity drift")

shared_js = read("assets/laws-destination/renewal.js")
nav_css = read("assets/laws-destination/renewal-navigation.css")
for marker in ("aria-expanded", "aria-controls", "Escape", "ArrowDown"):
    require(marker in shared_js, f"Collapsible nav behavior missing: {marker}")
require('.lr-js .lr-topbar[data-lr-nav-expanded="false"] .lr-nav' in nav_css, "Collapsed nav CSS missing")
require('@media (prefers-reduced-motion: reduce)' in nav_css, "Reduced-motion nav CSS missing")

changed = set(git_lines("diff", "--name-only", "origin/main...HEAD"))
statuses = git_lines("diff", "--name-status", "origin/main...HEAD")
require(not any(line.startswith("D\t") for line in statuses), "File deletion introduced")
representatives = {
    "laws/categories/flow/signals/index.html",
    "laws/categories/reality/measure.html",
    "laws/test/reverse-audit/index.html",
    "laws/research/findings-and-boundaries/index.html",
    "laws/industrial-posture/index.html",
}
require(not changed.intersection(representatives), f"Accepted representative HTML mutated: {sorted(changed.intersection(representatives))}")
compass_runtime = {
    "laws/index.controller.js", "laws/index.compositor.js", "laws/index.interactions.js",
    "laws/index.crystals.js", "laws/index.cosmos.js", "laws/index.planet.js",
}
require(not changed.intersection(compass_runtime), f"Compass runtime mutation: {sorted(changed.intersection(compass_runtime))}")
frontier_changes = sorted(path for path in changed if path.startswith("frontier/"))
require(frontier_changes == [frontier_path], f"Unauthorized Frontier changes: {frontier_changes}")

allowed_controls = {
    ".github/workflows/laws-complete-renewal-batch-materialize.yml",
    ".github/workflows/laws-complete-renewal-batch-verification.yml",
    "assets/laws-destination/renewal-batch.css",
    "assets/laws-destination/renewal-navigation.css",
    "assets/laws-destination/renewal.js",
    "scripts/laws_complete_renewal_batch.py",
    "scripts/laws_complete_renewal_batch_polish.py",
    "scripts/verify-laws-complete-renewal-batch.py",
    "scripts/verify-laws-complete-renewal-batch-v2.py",
    "scripts/laws_complete_renewal_batch_browser_verify.mjs",
    "scripts/laws_complete_renewal_batch_browser_verify_v2.mjs",
    "laws/control-plane/renewal/laws-complete-renewal-user-visual-acceptance-and-batch-authorization-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-remaining-20-route-migration-manifest-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-batch-browser-verification-v1.json",
}
unexpected = sorted(changed - product_files - allowed_controls)
require(not unexpected, f"Unexpected changed paths: {unexpected}")

result = {
    "contract": "LAWS_COMPLETE_RENEWAL_BATCH_STATIC_VERIFICATION_v2",
    "status": "PASS",
    "childRoutes": 24,
    "generatedChildRoutes": 20,
    "batteryPublicSurfaces": 27,
    "noCurrentAdmittedStudyRoutes": sorted(no_study),
    "canonicalRecords": 48,
    "canonicalDistribution": distribution,
    "compatibilityBindings": 9,
    "productFilesWritten": 29,
    "frontierChanges": frontier_changes,
    "representativeHtmlMutations": 0,
    "compassRuntimeMutations": 0,
    "routeDeletions": 0,
    "nextGate": "EXECUTED_BROWSER_CROSS_COMPATIBILITY",
}
(OUT / "static-result.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
print(json.dumps(result, indent=2))
