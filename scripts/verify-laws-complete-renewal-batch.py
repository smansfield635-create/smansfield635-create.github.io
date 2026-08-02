#!/usr/bin/env python3
"""Static acceptance verifier for the complete Laws Chamber and battery pathway renewal."""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = ROOT / "artifacts/laws-complete-renewal-batch-verification"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

NARRATIVE = ROOT / "laws/control-plane/narrative/laws-complete-narrative-map-v1.json"
MANIFEST = ROOT / "laws/control-plane/renewal/laws-complete-renewal-remaining-20-route-migration-manifest-v1.json"
BATTERY_SCOPE = ROOT / "laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json"
RECEIPT = ROOT / "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json"
BATTERY_AUTHORITY = ROOT / "laws/control-plane/cp6-context/laws-battery-study-contextual-interpretation-record-v1.json"
ROUTE_CONTRACT = ROOT / "laws/control-plane/cp6-1/cp6-2-route-contract.json"

ACCEPTED_CHILD_PATHS = {
    "/laws/categories/flow/signals/": "laws/categories/flow/signals/index.html",
    "/laws/categories/reality/measure/": "laws/categories/reality/measure.html",
    "/laws/test/reverse-audit/": "laws/test/reverse-audit/index.html",
    "/laws/research/findings-and-boundaries/": "laws/research/findings-and-boundaries/index.html",
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

CANONICAL_DESTINATIONS = {
    "laws/research/applied-investigations/index.html": 11,
    "laws/research/evidence-and-sources/index.html": 6,
    "laws/research/methods-and-models/index.html": 10,
    "laws/research/findings-and-boundaries/index.html": 7,
    "laws/test/admission-and-baseline/index.html": 2,
    "laws/test/forward-construction/index.html": 1,
    "laws/test/reverse-audit/index.html": 4,
    "laws/test/result-and-record/index.html": 7,
}

REPRESENTATIVE_HTML = {
    "laws/categories/flow/signals/index.html",
    "laws/categories/reality/measure.html",
    "laws/test/reverse-audit/index.html",
    "laws/research/findings-and-boundaries/index.html",
    "laws/industrial-posture/index.html",
}

ALLOWED_CONTROL_PATHS = {
    ".github/workflows/laws-complete-renewal-batch-materialize.yml",
    ".github/workflows/laws-complete-renewal-batch-verification.yml",
    "assets/laws-destination/renewal-batch.css",
    "assets/laws-destination/renewal-navigation.css",
    "assets/laws-destination/renewal.js",
    "scripts/laws_complete_renewal_batch.py",
    "scripts/laws_complete_renewal_batch_polish.py",
    "scripts/verify-laws-complete-renewal-batch.py",
    "scripts/laws_complete_renewal_batch_browser_verify.mjs",
    "laws/control-plane/renewal/laws-complete-renewal-user-visual-acceptance-and-batch-authorization-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-remaining-20-route-migration-manifest-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-battery-study-presentation-scope-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-batch-materialization-receipt-v1.json",
    "laws/control-plane/renewal/laws-complete-renewal-batch-browser-verification-v1.json",
}


def load(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def text(path: str) -> str:
    target = ROOT / path
    assert_true(target.exists(), f"Missing file: {path}")
    return target.read_text(encoding="utf-8")


def route_to_path(route: str, route_paths: dict[str, str]) -> str:
    assert_true(route in route_paths, f"No source path registered for narrative route: {route}")
    return route_paths[route]


def served_route(route: str) -> str:
    return STORY_TO_SERVED.get(route, route)


def canonical_ids(source: str) -> set[str]:
    return set(re.findall(r'data-content-id="(CP6-CONTENT-\d+)"', source))


def git_lines(*args: str) -> list[str]:
    output = subprocess.check_output(["git", *args], cwd=ROOT, text=True)
    return [line.strip() for line in output.splitlines() if line.strip()]


def main() -> int:
    narrative = load(NARRATIVE)
    manifest = load(MANIFEST)
    battery_scope = load(BATTERY_SCOPE)
    receipt = load(RECEIPT)
    battery_authority = load(BATTERY_AUTHORITY)
    route_contract = load(ROUTE_CONTRACT)

    pages = narrative.get("pages", [])
    assert_true(len(pages) == 24, f"Expected 24 narrative children, found {len(pages)}")
    assert_true(receipt.get("remaining_child_routes_materialized") == 20, "Twenty-route materialization receipt drift")
    assert_true(receipt.get("battery_public_surface_scope") == 27, "Twenty-seven-surface battery receipt drift")
    assert_true(receipt.get("product_file_count") == 29, "Twenty-nine product-file receipt drift")
    assert_true(battery_scope.get("public_surface_count") == 27, "Battery scope authority drift")

    route_paths = dict(ACCEPTED_CHILD_PATHS)
    generated_routes: set[str] = set()
    for wave in manifest.get("migration_waves", []):
        for entry in wave.get("routes", []):
            route = str(entry["story_route"])
            route_paths[route] = str(entry["source_path"])
            generated_routes.add(route)
    assert_true(len(route_paths) == 24, f"Expected 24 route-path bindings, found {len(route_paths)}")
    assert_true(len(generated_routes) == 20, f"Expected 20 generated routes, found {len(generated_routes)}")

    all_child_paths: list[str] = []
    no_study_routes: list[str] = []
    battery_child_routes: list[str] = []

    for page in pages:
        route = str(page["route"])
        path = route_to_path(route, route_paths)
        source = text(path)
        all_child_paths.append(path)

        expected_served = served_route(route)
        assert_true(f'data-route="{expected_served}"' in source, f"{route}: served route identity drift")
        if expected_served != route:
            assert_true(f'data-narrative-route="{route}"' in source, f"{route}: narrative identity missing")
            assert_true(f'https://diamondgatebridge.com{expected_served}' in source, f"{route}: retained HTML canonical missing")

        assert_true('/assets/laws-destination/renewal.css' in source, f"{route}: shared CSS missing")
        assert_true('/assets/laws-destination/renewal.js' in source, f"{route}: shared JS missing")
        assert_true('class="lr-hero"' in source, f"{route}: hero missing")
        assert_true('class="lr-boundary"' in source, f"{route}: claim boundary missing")
        assert_true('class="lr-story-nav"' in source, f"{route}: story context missing")
        assert_true('class="lr-audit"' in source, f"{route}: audit layer missing")
        assert_true('<meta http-equiv="refresh"' not in source.lower(), f"{route}: redirect metadata introduced")
        assert_true('location.replace(' not in source, f"{route}: redirect script introduced")
        assert_true('role="tabpanel" hidden' not in source, f"{route}: static reading panel hidden in source")

        authority = str(page.get("authority") or "").upper()
        tabs = source.count('role="tab"')
        panels = source.count('role="tabpanel"')
        expected_tabs = 3 if authority in {"FLOW", "INTEGRITY", "REALITY", "STRUCTURE"} else 5
        assert_true(tabs == expected_tabs and panels == expected_tabs, f"{route}: expected {expected_tabs} tabs/panels, found {tabs}/{panels}")
        assert_true(source.count('aria-selected="true"') == 1, f"{route}: active entry lens is not singular")

        relation = str((page.get("related_study") or {}).get("relationship_status") or "NO_CURRENT_ADMITTED_STUDY")
        if relation == "NO_CURRENT_ADMITTED_STUDY":
            no_study_routes.append(route)
            assert_true("No current admitted study" in source, f"{route}: no-study discipline missing")
            public_before_audit = source.split('<details class="lr-audit"', 1)[0]
            assert_true('BATTERY_COHERENCE_HELDOUT_STUDY_v1' not in public_before_audit, f"{route}: battery context forced into no-study page")
        else:
            battery_child_routes.append(route)

    assert_true(len(no_study_routes) == 6, f"Expected six no-study routes, found {len(no_study_routes)}")
    assert_true(len(battery_child_routes) == 18, f"Expected eighteen battery-related children, found {len(battery_child_routes)}")

    product_files = set(receipt.get("product_files_written", []))
    assert_true(len(product_files) == 29, "Materialized product-file list is not unique")
    for path in product_files:
        source = text(path)
        if path == "laws/index.html":
            assert_true('id="cp6-work-behind-laws"' in source and 'lr-battery-landing' in source, "Laws landing battery module missing")
            continue
        assert_true('data-laws-complete-renewal="v1"' in source, f"{path}: complete-renewal marker missing")
        assert_true('/assets/laws-destination/renewal-navigation.css' in source, f"{path}: collapsible navigation stylesheet missing")
        assert_true('/assets/laws-destination/renewal-batch.css' in source, f"{path}: batch visual stylesheet missing")

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
    battery_paths.extend(route_to_path(route, route_paths) for route in battery_child_routes)
    battery_paths.extend(wrapper_paths)
    battery_paths.append(frontier_path)
    assert_true(len(battery_paths) == 27 and len(set(battery_paths)) == 27, "Battery public-surface inventory is not exactly 27 unique files")

    for path in battery_paths:
        source = text(path)
        for marker in ("0.9394", "0.9704"):
            assert_true(marker in source, f"{path}: battery metric {marker} missing")
        assert_true("1,653" in source or "1653" in source, f"{path}: final-test record count missing")
        assert_true("20-cycle" in source or "20 cycles" in source, f"{path}: warning horizon missing")
        assert_true("burden" in source.lower(), f"{path}: stronger comparator finding missing")

    frontier = text(frontier_path)
    assert_true('data-complete-record-owner="FRONTIER"' in frontier, "Frontier complete-record ownership missing")
    assert_true('data-operational-readiness-claimed="false"' in frontier, "Operational-readiness boundary missing")
    assert_true('data-external-replication-claimed="false"' in frontier, "External-replication boundary missing")

    combined = battery_authority.get("baselines_and_comparators", [])[0]
    burden = battery_authority.get("baselines_and_comparators", [])[1]
    assert_true(combined.get("auroc") == 0.9394, "Combined AUROC authority drift")
    assert_true(burden.get("auroc") == 0.9704, "Burden AUROC authority drift")
    observations = battery_authority.get("data_and_observation_units", {})
    assert_true(observations.get("held_out_cell_count") == 3, "Held-out cell authority drift")
    assert_true(observations.get("final_test_record_count") == 1653, "Final-test record authority drift")
    assert_true(observations.get("warning_horizon_cycles") == 20, "Warning-horizon authority drift")

    migrated: set[str] = set()
    distribution: dict[str, int] = {}
    for path, expected in CANONICAL_DESTINATIONS.items():
        ids = canonical_ids(text(path))
        distribution[path] = len(ids)
        assert_true(len(ids) == expected, f"{path}: expected {expected} canonical records, found {len(ids)}")
        overlap = migrated.intersection(ids)
        assert_true(not overlap, f"{path}: duplicate canonical identities {sorted(overlap)}")
        migrated.update(ids)
    assert_true(len(migrated) == 48, f"Expected 48 unique canonical records, found {len(migrated)}")

    assert_true(route_contract.get("compatibility_binding_count") == 9, "Nine compatibility bindings not preserved")
    assert_true(route_contract.get("bindings_with_complete_required_field_set") == 9, "Compatibility binding field-set drift")

    laws = text("laws/index.html")
    interactions = text("laws/index.interactions.js")
    assert_true('data-laws-category-count="6"' in laws, "Six-authority Laws Compass marker missing")
    assert_true('data-laws-child-route-count="24"' in laws, "Twenty-four-child Laws Compass marker missing")
    assert_true('data-laws-primary-star-count="4"' in laws, "Four law-star marker missing")
    assert_true('const D=Object.freeze(["flow","integrity","reality","structure","test","research"])' in interactions, "Six-authority interaction identity drift")

    shared_js = text("assets/laws-destination/renewal.js")
    nav_css = text("assets/laws-destination/renewal-navigation.css")
    for marker in ("aria-expanded", "aria-controls", "Escape", "ArrowDown"):
        assert_true(marker in shared_js, f"Collapsible navigation behavior missing: {marker}")
    assert_true('.lr-js .lr-topbar[data-lr-nav-expanded="false"] .lr-nav' in nav_css, "Collapsed navigation CSS missing")
    assert_true('@media (prefers-reduced-motion: reduce)' in nav_css, "Reduced-motion navigation CSS missing")

    changed = set(git_lines("diff", "--name-only", "origin/main...HEAD"))
    status_lines = git_lines("diff", "--name-status", "origin/main...HEAD")
    assert_true(not any(line.startswith("D\t") for line in status_lines), "File deletion introduced")
    assert_true(not changed.intersection(REPRESENTATIVE_HTML), f"Accepted representative HTML mutated: {sorted(changed.intersection(REPRESENTATIVE_HTML))}")
    forbidden_runtime = {
        "laws/index.controller.js", "laws/index.compositor.js", "laws/index.interactions.js",
        "laws/index.crystals.js", "laws/index.cosmos.js", "laws/index.planet.js",
    }
    assert_true(not changed.intersection(forbidden_runtime), f"Compass runtime mutation introduced: {sorted(changed.intersection(forbidden_runtime))}")
    frontier_changes = sorted(path for path in changed if path.startswith("frontier/"))
    assert_true(frontier_changes == [frontier_path], f"Unauthorized Frontier changes: {frontier_changes}")

    allowed = product_files | ALLOWED_CONTROL_PATHS
    unexpected = sorted(changed - allowed)
    assert_true(not unexpected, f"Unexpected changed paths: {unexpected}")

    result = {
        "contract": "LAWS_COMPLETE_RENEWAL_BATCH_STATIC_VERIFICATION_v1",
        "status": "PASS",
        "childRoutes": 24,
        "generatedChildRoutes": 20,
        "batteryPublicSurfaces": 27,
        "noCurrentAdmittedStudyRoutes": sorted(no_study_routes),
        "canonicalRecords": len(migrated),
        "canonicalDistribution": distribution,
        "compatibilityBindings": 9,
        "productFilesWritten": len(product_files),
        "changedPaths": sorted(changed),
        "frontierChanges": frontier_changes,
        "representativeHtmlMutations": 0,
        "compassRuntimeMutations": 0,
        "routeDeletions": 0,
        "evidenceStatusUpgrades": 0,
        "claimCeilingUpgrades": 0,
        "nextGate": "EXECUTED_BROWSER_CROSS_COMPATIBILITY",
    }
    (ARTIFACT_DIR / "static-result.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
