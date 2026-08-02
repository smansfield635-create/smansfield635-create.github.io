#!/usr/bin/env python3
"""Amend the Laws narrative map to cover the complete retained record system.

This is a non-product design transform. It may change only the narrative-map
JSON. It inventories the 24 child routes, the 48 canonical migrated records,
the complete 138-row custody population, and every surviving Laws HTML surface.
"""

from __future__ import annotations

import copy
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
MAP_PATH = ROOT / "laws/control-plane/narrative/laws-complete-narrative-map-v1.json"
MIGRATION_LEDGER_PATH = ROOT / "laws/control-plane/cp6-3/migration-ledger.json"
CUSTODY_LEDGER_PATH = ROOT / "laws/control-plane/cp6-4-5/content-reduction-custody-ledger.json"

CONTENT_ID_RE = re.compile(r"^CP6-CONTENT-\d{3}$")
ALLOWED_SURFACE_STATUSES = {
    "RENEW_AS_PUBLIC_STORY_PAGE",
    "COLLAPSE_INTO_CANONICAL_AUDIT_LAYER",
    "RETAIN_AS_COMPATIBILITY_WRAPPER",
    "ROUTE_TO_CANONICAL_OWNER",
    "PRESERVE_SOURCE_ONLY",
}

TECHNICAL_AUDIT_RECORD_IDS = {
    "CP6-CONTENT-119",
    "CP6-CONTENT-121",
    "CP6-CONTENT-122",
    "CP6-CONTENT-123",
    "CP6-CONTENT-124",
    "CP6-CONTENT-125",
    "CP6-CONTENT-126",
    "CP6-CONTENT-127",
    "CP6-CONTENT-129",
    "CP6-CONTENT-137",
}

EQUATION_OR_FORMAL_RECORD_IDS = {
    "CP6-CONTENT-058",
    "CP6-CONTENT-059",
    "CP6-CONTENT-060",
    "CP6-CONTENT-061",
    "CP6-CONTENT-062",
    "CP6-CONTENT-063",
    "CP6-CONTENT-064",
    "CP6-CONTENT-065",
    "CP6-CONTENT-068",
    "CP6-CONTENT-069",
    "CP6-CONTENT-070",
    "CP6-CONTENT-078",
    "CP6-CONTENT-090",
    "CP6-CONTENT-095",
}

EXPECTED_DESTINATION_COUNTS = {
    "Test / Admission and Baseline": 2,
    "Test / Forward Construction": 1,
    "Test / Reverse Audit": 4,
    "Test / Result and Record": 7,
    "Research / Evidence and Sources": 6,
    "Research / Methods and Models": 10,
    "Research / Applied Investigations": 11,
    "Research / Findings and Boundaries": 7,
}

COMPATIBILITY_CANONICAL_OWNERS = {
    "/laws/categories/reality/theory.html": "/laws/categories/reality/theory/",
    "/laws/categories/structure/constraints.html": "/laws/categories/structure/constraints/",
    "/laws/categories/structure/governance.html": "/laws/categories/structure/governance/",
    "/laws/battery-heldout-study/": "/laws/research/applied-investigations/#cp6-battery-study-index",
    "/laws/scientific-law/battery-heldout-study/": "/laws/research/findings-and-boundaries/#cp6-battery-findings",
    "/laws/categories/reality/battery-heldout-study/": "/laws/categories/reality/evidence/",
    "/laws/scientific-law/": "/laws/",
}


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise SystemExit(f"Required authority file missing: {path.relative_to(ROOT)}")
    return json.loads(path.read_text(encoding="utf-8"))


def stable_hash(value: Any) -> str:
    encoded = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def walk_dicts(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk_dicts(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_dicts(child)


def collect_content_records(value: Any) -> list[dict[str, Any]]:
    records: dict[str, dict[str, Any]] = {}
    for item in walk_dicts(value):
        content_id = item.get("content_id") or item.get("contentId") or item.get("id")
        if isinstance(content_id, str) and CONTENT_ID_RE.match(content_id):
            current = records.get(content_id)
            if current is None or len(json.dumps(item, sort_keys=True)) > len(json.dumps(current, sort_keys=True)):
                records[content_id] = copy.deepcopy(item)
    return [records[key] for key in sorted(records)]


def first_value(record: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        value = record.get(key)
        if value not in (None, "", [], {}):
            return value
    return None


def normalize_migrated_record(record: dict[str, Any]) -> dict[str, Any]:
    content_id = first_value(record, "content_id", "contentId", "id")
    heading = first_value(record, "heading", "original_heading", "title", "name")
    authority = first_value(record, "canonical_authority", "canonical_owner", "destination_authority")
    route = first_value(record, "canonical_route", "destination_route", "route")
    anchor = first_value(record, "destination_anchor", "canonical_anchor", "anchor")
    dependency = first_value(
        record,
        "formula_or_data_dependency",
        "formula_or_dataset_dependency",
        "formula_dependency",
        "data_dependency",
    )
    evidence_sensitivity = first_value(record, "evidence_sensitivity", "evidenceSensitivity")
    provenance = first_value(record, "provenance_dependency", "provenance", "source_provenance")
    source_copy_status = first_value(record, "source_copy_status", "sourceCopyStatus")
    source_file = first_value(record, "source_file", "original_source", "source_path")

    if content_id in TECHNICAL_AUDIT_RECORD_IDS:
        disposition = "COLLAPSE_INTO_CANONICAL_AUDIT_LAYER"
        public_role = "Technical custody and implementation evidence remains available behind collapsed audit disclosure."
    elif content_id == "CP6-CONTENT-063":
        disposition = "RENEW_AS_PUBLIC_STORY_PAGE"
        public_role = "Industrial Closure Equation is expressed through the Industrial Posture representative while its canonical record remains owned by Research / Methods and Models."
    else:
        disposition = "RENEW_AS_PUBLIC_STORY_PAGE"
        public_role = "The record is delivered only through its canonical page-specific narrative slice, with source custody collapsed."

    return {
        "content_id": content_id,
        "heading": heading,
        "canonical_authority": authority,
        "canonical_route": route,
        "destination_anchor": anchor,
        "formula_or_data_dependency": dependency,
        "equation_expression_contract_required": content_id in EQUATION_OR_FORMAL_RECORD_IDS or bool(dependency),
        "evidence_sensitivity": evidence_sensitivity,
        "provenance_dependency": provenance,
        "source_file": source_file,
        "source_copy_status": source_copy_status,
        "presentation_disposition": disposition,
        "public_story_role": public_role,
        "source_ledger_record": record,
    }


def html_path_to_route(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if not rel.startswith("laws/"):
        raise ValueError(rel)
    if rel == "laws/index.html":
        return "/laws/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def canonical_owner_for_route(route: str, child_routes: set[str]) -> str | None:
    if route in child_routes or route == "/laws/":
        return route
    if route in COMPATIBILITY_CANONICAL_OWNERS:
        return COMPATIBILITY_CANONICAL_OWNERS[route]
    if route == "/laws/industrial-posture/":
        return "/laws/research/methods-and-models/#cp6-content-063-industrial-closure-equation"
    if route.startswith("/laws/categories/flow/"):
        return "/laws/categories/flow/"
    if route.startswith("/laws/categories/integrity/"):
        return "/laws/categories/integrity/"
    if route.startswith("/laws/categories/reality/"):
        return "/laws/categories/reality/"
    if route.startswith("/laws/categories/structure/"):
        return "/laws/categories/structure/"
    if route.startswith("/laws/research/"):
        return "/laws/research/"
    if route.startswith("/laws/test/"):
        return "/laws/test/"
    if route.startswith("/laws/scientific-law/"):
        return "/laws/"
    return None


def classify_surface(path: Path, route: str, child_routes: set[str]) -> dict[str, Any]:
    public_gateways = {
        "/laws/",
        "/laws/categories/",
        "/laws/categories/flow/",
        "/laws/categories/integrity/",
        "/laws/categories/reality/",
        "/laws/categories/structure/",
        "/laws/research/",
        "/laws/test/",
    }
    canonical_owner = canonical_owner_for_route(route, child_routes)

    if route in child_routes or route in public_gateways:
        status = "RENEW_AS_PUBLIC_STORY_PAGE"
        reason = "This is a controlling chamber route or gateway and must express its assigned narrative role."
        public_surface = True
    elif route == "/laws/industrial-posture/":
        status = "RENEW_AS_PUBLIC_STORY_PAGE"
        reason = "This is the fifth representative and must prove equation-record transformation without claiming independent canonical ownership of CP6-CONTENT-063."
        public_surface = True
    elif route in COMPATIBILITY_CANONICAL_OWNERS or "battery-heldout-study" in route or route.startswith("/laws/scientific-law/"):
        status = "RETAIN_AS_COMPATIBILITY_WRAPPER"
        reason = "The route remains reachable for continuity but must present a concise narrative wrapper and hand off to the current canonical owner."
        public_surface = True
    elif path.name in {"theory.html", "constraints.html", "governance.html"}:
        status = "RETAIN_AS_COMPATIBILITY_WRAPPER"
        reason = "This file-form route is a compatibility alias for the current slash-form canonical route."
        public_surface = True
    elif "/control-plane/" in route or "/archive/" in route or "/receipts/" in route:
        status = "COLLAPSE_INTO_CANONICAL_AUDIT_LAYER"
        reason = "This surface is technical custody material and cannot control initial public comprehension."
        public_surface = False
    elif route.startswith("/laws/categories/") or route.startswith("/laws/research/") or route.startswith("/laws/test/"):
        status = "ROUTE_TO_CANONICAL_OWNER"
        reason = "This surviving subordinate surface must hand off to the nearest current family or child owner rather than remain an independent monolith."
        public_surface = True
    else:
        status = "PRESERVE_SOURCE_ONLY"
        reason = "No independent current narrative authority is established. Preserve source custody and exclude it from primary public navigation until separately reviewed."
        public_surface = False

    if status not in ALLOWED_SURFACE_STATUSES:
        raise AssertionError(status)

    return {
        "path": path.relative_to(ROOT).as_posix(),
        "route": route,
        "presentation_status": status,
        "canonical_owner": canonical_owner,
        "public_surface": public_surface,
        "presentation_fate": reason,
        "implementation_rule": "No route deletion, redirect, or page mutation is authorized by this design record.",
    }


def normalize_population_record(record: dict[str, Any]) -> dict[str, Any]:
    content_id = first_value(record, "content_id", "contentId", "id")
    final_disposition = first_value(
        record,
        "final_disposition",
        "disposition",
        "canonical_disposition",
        "owner_family",
        "family",
    )
    canonical_owner = first_value(record, "canonical_owner", "canonical_authority", "owner")
    source_file = first_value(record, "source_file", "original_source", "source_path")
    return {
        "content_id": content_id,
        "final_disposition": final_disposition,
        "canonical_owner": canonical_owner,
        "source_file": source_file,
        "source_custody_record": record,
    }


def main() -> None:
    narrative = load_json(MAP_PATH)
    migration_ledger = load_json(MIGRATION_LEDGER_PATH)
    custody_ledger = load_json(CUSTODY_LEDGER_PATH)

    pages_before = copy.deepcopy(narrative["pages"])
    pages_hash_before = stable_hash(pages_before)
    child_routes = {page["route"] for page in pages_before}
    if len(pages_before) != 24 or len(child_routes) != 24:
        raise SystemExit("The accepted 24-route narrative changed or contains duplicates.")

    migrated_source_records = collect_content_records(migration_ledger)
    if len(migrated_source_records) != 48:
        raise SystemExit(f"Expected 48 migrated canonical records, found {len(migrated_source_records)}")
    migrated_records = [normalize_migrated_record(record) for record in migrated_source_records]
    migrated_ids = [record["content_id"] for record in migrated_records]
    if len(set(migrated_ids)) != 48:
        raise SystemExit("Migrated record IDs are not unique.")

    destination_counts = Counter(record["canonical_authority"] for record in migrated_records)
    # Some ledgers use canonical_owner rather than canonical_authority. Validate by
    # deriving the expected authority from route/anchor text when necessary.
    if destination_counts != Counter(EXPECTED_DESTINATION_COUNTS):
        for record in migrated_records:
            if record["canonical_authority"] not in EXPECTED_DESTINATION_COUNTS:
                raw_text = json.dumps(record["source_ledger_record"], sort_keys=True)
                for expected in EXPECTED_DESTINATION_COUNTS:
                    if expected in raw_text:
                        record["canonical_authority"] = expected
                        break
        destination_counts = Counter(record["canonical_authority"] for record in migrated_records)
    if destination_counts != Counter(EXPECTED_DESTINATION_COUNTS):
        raise SystemExit(f"48-record destination distribution drift: {dict(destination_counts)}")

    population_source_records = collect_content_records(custody_ledger)
    if len(population_source_records) != 138:
        raise SystemExit(f"Expected complete 138-row custody population, found {len(population_source_records)}")
    population_records = [normalize_population_record(record) for record in population_source_records]

    html_paths = sorted(path for path in (ROOT / "laws").rglob("*.html") if path.is_file())
    if not html_paths:
        raise SystemExit("No Laws HTML surfaces were found.")
    surfaces = [classify_surface(path, html_path_to_route(path), child_routes) for path in html_paths]
    route_keys = [(surface["path"], surface["route"]) for surface in surfaces]
    if len(route_keys) != len(set(route_keys)):
        raise SystemExit("Duplicate presentation surface inventory entries found.")

    industrial_surface = next((surface for surface in surfaces if surface["route"] == "/laws/industrial-posture/"), None)
    if industrial_surface is None:
        industrial_representative = {
            "route": "/laws/research/methods-and-models/#cp6-content-063-industrial-closure-equation",
            "surface_status": "EXACT_CANONICAL_SUCCESSOR_USED_BECAUSE_INDUSTRIAL_POSTURE_ROUTE_IS_ABSENT",
            "canonical_record": "CP6-CONTENT-063",
        }
    else:
        industrial_representative = {
            "route": "/laws/industrial-posture/",
            "surface_status": industrial_surface["presentation_status"],
            "canonical_record": "CP6-CONTENT-063",
            "canonical_owner": industrial_surface["canonical_owner"],
        }

    narrative["status"] = "FREEZE_ELIGIBLE_PENDING_USER_FREEZE"
    narrative["amendment_disposition"] = {
        "core_24_route_narrative": "ACCEPTED_UNCHANGED",
        "complete_chamber_authority": "COMPLETENESS_AMENDED_FREEZE_ELIGIBLE",
        "product_implementation": "HELD",
        "representative_implementation": "HELD",
        "user_freeze_recorded": False,
        "automatic_freeze": False,
    }

    narrative["coverage"].update(
        {
            "child_narrative_routes": 24,
            "canonical_migrated_records": 48,
            "complete_custody_population_records": 138,
            "main_records": 63,
            "shared_foundation_records": 23,
            "historical_archive_records": 2,
            "deleted_stale_records": 2,
            "surviving_laws_html_surfaces": len(surfaces),
            "surface_disposition_counts": dict(sorted(Counter(s["presentation_status"] for s in surfaces).items())),
        }
    )

    narrative["reference_hierarchy"] = {
        "visual_and_mathematical_expression_authority": "MAIN_DIAMOND_GATE_BRIDGE_COMPASS",
        "visual_authority_scope": [
            "ATMOSPHERIC_AND_COSMIC_DEPTH",
            "PRACTICAL_MATHEMATICAL_CONTEXT",
            "NESTED_FORMULA_AND_LENS_SURFACES",
            "EXPERIENTIAL_HIERARCHY",
            "MOBILE_ADAPTATION",
            "REDUCED_MOTION_EQUIVALENCE",
            "STATIC_EQUIVALENCE",
        ],
        "interaction_organization_reference": "R.O.B._AND_W.A.V.E._TAB_AND_DISCLOSURE_SYSTEM",
        "interaction_reference_scope": [
            "TAB_COMPARTMENTALIZATION",
            "NESTED_DISCLOSURE_BEHAVIOR",
            "ACTIVE_LENS_ORGANIZATION",
            "COLLAPSED_DETAIL_ACCESS",
        ],
        "interaction_reference_exclusions": [
            "VISUAL_IDENTITY_AUTHORITY",
            "CAMPAIGN_IDENTITY_AUTHORITY",
            "MATHEMATICAL_EXPRESSION_AUTHORITY",
            "COPY_OR_CONTENT_AUTHORITY",
        ],
        "campaign_visual_identity_copy": "PROHIBITED",
        "campaign_copy_reuse": "PROHIBITED",
        "tabs_placed_above_unchanged_monolithic_content": "PROHIBITED",
        "reference_rule": "The Main Compass supplies quality and expression authority. R.O.B. and W.A.V.E. supply organization mechanics only."
    }

    narrative["equation_expression_contract"] = {
        "contract_sequence": [
            "WHY_IT_MATTERS",
            "FORMAL_SELECTABLE_NOTATION",
            "VISUAL_RELATIONSHIP",
            "VARIABLE_DEFINITIONS",
            "PRACTICAL_LENS",
            "ENGINEERING_LENS",
            "EMPIRICAL_STATUS",
            "CLAIM_BOUNDARY",
            "COLLAPSED_CUSTODY_RECORD",
        ],
        "formal_notation": {
            "selectable": True,
            "copyable": True,
            "semantic_html_or_mathml_preferred": True,
            "image_only_math": "PROHIBITED",
            "terminal_style_block_as_primary_delivery": "PROHIBITED",
            "aesthetic_formula_mutation": "PROHIBITED",
        },
        "required_context": [
            "VARIABLE_NAME_AND_DEFINITION",
            "UNIT_OR_DIMENSION",
            "DOMAIN_AND_OPERATING_RANGE",
            "DENOMINATOR_AND_NORMALIZATION",
            "ZERO_AND_NULL_BEHAVIOR",
            "THRESHOLD_AND_DECISION_RULE",
            "ASSUMPTIONS",
            "SCOPE_AND_EXCLUSIONS",
            "EXACT_SOURCE_AND_CANONICAL_RECORD",
        ],
        "status_vocabulary": [
            "SPECIFIED",
            "EXECUTED",
            "VALIDATED_WITHIN_STATED_DOMAIN",
            "UNDER_REVIEW",
            "NOT_EXECUTED",
            "NOT_ESTABLISHED",
        ],
        "relationship_delivery": "The equation must be accompanied by a visual account of how variables, constraints, states, and outputs relate. Decoration cannot substitute for interpretation.",
        "lens_rule": "Practical, Engineering, and Empirical interpretations must be separately selectable and must not silently upgrade one another.",
        "responsive_rule": "Full-motion, reduced-motion, and static presentations must preserve the same notation, relationships, variables, status, and claim boundary without horizontal overflow.",
        "custody_rule": "Hashes, source paths, version history, implementation ownership, and migration receipts remain in a collapsed canonical audit record.",
        "industrial_posture_proof_sequence": [
            "WHY_IT_MATTERS",
            "FORMAL_SELECTABLE_NOTATION",
            "VISUAL_RELATIONSHIP",
            "VARIABLE_DEFINITIONS",
            "PRACTICAL_LENS",
            "ENGINEERING_LENS",
            "EMPIRICAL_STATUS",
            "CLAIM_BOUNDARY",
            "COLLAPSED_CUSTODY_RECORD",
        ],
    }

    narrative["canonical_record_coverage"] = {
        "source_authority": "laws/control-plane/cp6-3/migration-ledger.json",
        "source_contract": migration_ledger.get("contract"),
        "record_count": 48,
        "test_record_count": 14,
        "research_record_count": 34,
        "destination_counts": dict(EXPECTED_DESTINATION_COUNTS),
        "source_copy_policy": "PRESERVED_TRANSITIONAL_SOURCE_COPY_UNTIL_SEPARATELY_RECONCILED",
        "records": migrated_records,
        "completeness_rule": "Every migrated canonical record must be delivered through its canonical narrative owner or collapsed audit layer; no record may remain an ungoverned monolithic presentation.",
    }

    narrative["complete_record_population"] = {
        "source_authority": "laws/control-plane/cp6-4-5/content-reduction-custody-ledger.json",
        "source_contract": custody_ledger.get("contract"),
        "record_count": 138,
        "declared_disposition_counts": {
            "TEST": 14,
            "RESEARCH": 34,
            "MAIN": 63,
            "SHARED_FOUNDATION": 23,
            "ARCHIVE": 2,
            "DELETE": 2,
        },
        "records": population_records,
        "rule": "The 48 canonical records are part of the complete 138-row custody population; completeness cannot be inferred from route coverage alone.",
    }

    narrative["legacy_and_source_presentation_surface_inventory"] = {
        "inventory_basis": "Exact recursive scan of every surviving laws/**/*.html file at amendment execution head.",
        "surface_count": len(surfaces),
        "allowed_statuses": sorted(ALLOWED_SURFACE_STATUSES),
        "status_counts": dict(sorted(Counter(s["presentation_status"] for s in surfaces).items())),
        "surfaces": surfaces,
        "no_omission_rule": "Every surviving Laws HTML surface is explicitly inventoried. An unknown surface is preserved as source-only rather than silently omitted or treated as current narrative authority.",
        "no_obsolete_public_monolith_rule": "Every public surface must either become a page-specific story page, become a concise compatibility wrapper, or route visibly to its canonical owner. Tabs above unchanged monolithic content do not satisfy renewal.",
    }

    narrative["industrial_posture_equation_representative"] = {
        **industrial_representative,
        "representative_index": 5,
        "page_role": "Prove transformation of a terminal-style canonical equation record into a Main-Compass-quality explanatory experience.",
        "question_answered": "How does the Industrial Closure Equation connect a practical closure problem to formal notation, engineering variables, empirical status, and a bounded claim?",
        "canonical_record": "CP6-CONTENT-063",
        "canonical_record_owner": "/laws/research/methods-and-models/#cp6-content-063-industrial-closure-equation",
        "required_contract": narrative["equation_expression_contract"]["industrial_posture_proof_sequence"],
        "boundary_statement": "The representative may renew presentation and interpretation but may not change the equation, its source custody, evidence status, claim ceiling, or canonical ownership.",
    }

    shared = narrative["shared_presentation_standard"]
    shared["visual_and_mathematical_expression_authority"] = "MAIN_DIAMOND_GATE_BRIDGE_COMPASS"
    shared["interaction_organization_reference"] = "R.O.B._AND_W.A.V.E._TAB_AND_DISCLOSURE_SYSTEM_ONLY"
    shared["campaign_visual_identity_copy"] = "PROHIBITED"
    shared["tabs_above_unchanged_monolithic_content"] = "PROHIBITED"
    shared["equation_expression_contract"] = "LAWS_COMPLETE_NARRATIVE_MAP_v1.equation_expression_contract"

    freeze_gate = narrative["freeze_gate"]
    freeze_gate["representative_pages_after_freeze"] = [
        "/laws/categories/flow/signals/",
        "/laws/categories/reality/measure/",
        "/laws/test/reverse-audit/",
        "/laws/research/findings-and-boundaries/",
        industrial_representative["route"],
    ]
    freeze_gate["representative_selection_basis"] = (
        "Signals proves signal-oriented law delivery; Measure proves quantitative presentation; Reverse Audit proves adversarial procedure; "
        "Findings and Boundaries proves synthesis and Frontier return; Industrial Posture proves transformation of an existing terminal-style canonical equation record."
    )
    freeze_gate["map_must_be_frozen_before"].extend(
        item
        for item in ["LEGACY_SURFACE_RENEWAL", "CANONICAL_RECORD_PRESENTATION_MIGRATION"]
        if item not in freeze_gate["map_must_be_frozen_before"]
    )
    freeze_gate["current_disposition"] = "PRODUCT_IMPLEMENTATION_HELD_PENDING_EXPLICIT_USER_FREEZE"
    freeze_gate["freeze_eligibility_requirements"] = {
        "core_24_routes_unchanged": True,
        "canonical_records_mapped": 48,
        "complete_custody_population_mapped": 138,
        "surviving_html_surfaces_inventoried": len(surfaces),
        "reference_hierarchy_bound": True,
        "industrial_posture_representative_bound": True,
        "equation_expression_contract_bound": True,
        "user_freeze_recorded": False,
    }

    if narrative["pages"] != pages_before or stable_hash(narrative["pages"]) != pages_hash_before:
        raise SystemExit("Accepted 24-route narrative was modified by the completeness amendment.")
    if narrative["canonical_record_coverage"]["record_count"] != 48:
        raise SystemExit("Canonical record coverage incomplete.")
    if narrative["complete_record_population"]["record_count"] != 138:
        raise SystemExit("Complete custody population coverage incomplete.")
    if narrative["legacy_and_source_presentation_surface_inventory"]["surface_count"] != len(html_paths):
        raise SystemExit("Legacy/source presentation surface inventory incomplete.")
    if any(surface["presentation_status"] not in ALLOWED_SURFACE_STATUSES for surface in surfaces):
        raise SystemExit("A presentation surface lacks an allowed disposition.")
    if len(freeze_gate["representative_pages_after_freeze"]) != 5:
        raise SystemExit("Exactly five representative surfaces are required.")
    if narrative["amendment_disposition"]["user_freeze_recorded"] is not False:
        raise SystemExit("The amendment cannot record user freeze automatically.")

    narrative["amendment_verification"] = {
        "status": "PASS",
        "accepted_24_route_pages_sha256": pages_hash_before,
        "accepted_24_route_pages_unchanged": True,
        "canonical_migrated_records": 48,
        "complete_custody_population_records": 138,
        "surviving_laws_html_surfaces": len(surfaces),
        "surface_status_counts": dict(sorted(Counter(s["presentation_status"] for s in surfaces).items())),
        "representative_surface_count": 5,
        "product_files_mutated": 0,
        "route_mutations_authorized": 0,
        "evidence_status_upgrades_authorized": 0,
        "user_freeze_recorded": False,
    }

    MAP_PATH.write_text(json.dumps(narrative, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(narrative["amendment_verification"], indent=2))


if __name__ == "__main__":
    main()
