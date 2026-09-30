#!/usr/bin/env python3
"""Verify final Checkpoint 6 content and current Compass authority before browser execution."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTROL = ROOT / "laws/control-plane/cp6-context"


def read_json(name: str) -> dict:
    return json.loads((CONTROL / name).read_text(encoding="utf-8"))


def require_text(path: str, values: list[str]) -> None:
    text = (ROOT / path).read_text(encoding="utf-8")
    for value in values:
        if value not in text:
            raise SystemExit(f"{path}: missing required text: {value}")


def canonical_content_ids(path: str) -> set[str]:
    """Return canonical CP6 content identities declared by one destination.

    The complete renewal preserves canonical identities while allowing the
    public presentation markup to evolve. Verification therefore follows each
    destination's current canonical identity surface rather than assuming one
    presentation-row attribute.
    """
    text = (ROOT / path).read_text(encoding="utf-8")
    if path == "laws/research/methods-and-models/index.html":
        archive = "METHODS_MODELS_CANONICAL_ARCHIVE_v1_DRAFT"
        assert f'data-canonical-archive="{archive}"' in text, (
            f"{path}: missing canonical archive binding"
        )
        manifest_path = "laws/research/methods-and-models/canonical-records-v1.html"
        manifest = (ROOT / manifest_path).read_text(encoding="utf-8")
        assert 'data-record-class="READ_ONLY_CANONICAL_MANIFEST"' in manifest, (
            f"{manifest_path}: missing read-only canonical manifest contract"
        )
        assert archive in manifest, (
            f"{manifest_path}: canonical archive identity mismatch"
        )
        return set(re.findall(r"<span>(CP6-CONTENT-\d+)</span>", manifest))
    return set(re.findall(r'data-content-id="(CP6-CONTENT-\d+)"', text))


def main() -> None:
    crosswalk = read_json("laws-frontier-compatibility-crosswalk-v1.json")
    battery = read_json("laws-battery-study-contextual-interpretation-record-v1.json")
    successor = read_json("cp6-2-successor-chain-acceptance-v1.json")
    static_receipt = read_json("contextual-renewal-verification-v1.json")
    legacy = read_json("legacy-benchmark-disposition-v1.json")
    route_contract = json.loads(
        (ROOT / "laws/control-plane/cp6-1/cp6-2-route-contract.json").read_text(encoding="utf-8")
    )

    assert crosswalk["contract"] == "LAWS_FRONTIER_COMPATIBILITY_CROSSWALK_v1"
    assert len(crosswalk["mappings"]) == 11
    assert crosswalk["authority_boundary"]["route_deletion"] == 0
    assert crosswalk["authority_boundary"]["redirect_creation"] == 0
    assert crosswalk["authority_boundary"]["evidence_status_upgrade"] == 0

    assert battery["contract"] == "LAWS_BATTERY_STUDY_CONTEXTUAL_INTERPRETATION_RECORD_v1"
    assert battery["data_and_observation_units"]["held_out_cell_count"] == 3
    assert battery["data_and_observation_units"]["final_test_record_count"] == 1653
    assert battery["data_and_observation_units"]["warning_horizon_cycles"] == 20
    assert battery["baselines_and_comparators"][0]["auroc"] == 0.9394
    assert battery["baselines_and_comparators"][1]["auroc"] == 0.9704
    assert battery["execution_status"]["universal_law_validation_complete"] is False
    assert battery["execution_status"]["critical_system_validation_complete"] is False

    assert successor["contract"] == "LAWS_CP6_2_SUCCESSOR_CHAIN_ACCEPTANCE_v1"
    assert successor["standalone_cp6_2_receipt"]["located"] is False
    assert successor["standalone_cp6_2_receipt"]["reconstructed"] is False
    assert successor["acceptance_basis"]["final_checkpoint_closure_claimed"] is False
    assert successor["checkpoint_disposition"]["checkpoint_6"] == "OPEN"
    assert successor["successor_evidence"]["cp6_3_execution_commit"]["sha"] == "a76bb97f9a63c588b5e7131b3dc3461f8d1e36ee"
    assert successor["successor_evidence"]["cp6_3_merge_commit"]["sha"] == "19097ef47f17fd38b515a39ef62a524e5d19bc0c"

    assert route_contract["compatibility_binding_count"] == 9
    assert route_contract["bindings_with_complete_required_field_set"] == 9
    assert len(route_contract["test_routes"]) == 4
    assert len(route_contract["research_routes"]) == 4

    assert static_receipt["frontier_files_mutated"] == 0
    assert static_receipt["compass_runtime_files_mutated"] == 0
    assert static_receipt["evidence_status_upgrades"] == 0
    assert static_receipt["future_frontier_deployment_claims"] == 0

    assert legacy["current_compass_contract"]["top_level_authorities"] == 6
    assert legacy["current_compass_contract"]["law_authorities"] == 4
    assert legacy["current_compass_contract"]["outer_label_model"] == "single-active-primary-only"
    assert legacy["current_compass_contract"]["total_child_routes"] == 24
    assert legacy["four_compass_exact_head_regression"]["material_findings_after_classification"] == []
    assert legacy["four_compass_exact_head_regression"]["product_correction_required_from_this_run"] is False
    assert legacy["six_authority_benchmark"]["protected_compass_runtime_changed_in_current_pr"] is False
    assert legacy["six_authority_benchmark"]["product_correction_required_from_this_run"] is False
    assert legacy["first_test_benchmark"]["disposition"] == "REPLACED_FOR_CURRENT_PRODUCT_BY_EXACT_HEAD_CURRENT_CONTRACT_BROWSER_PROOF"
    assert legacy["authority_boundary"]["checkpoint_closed"] is False
    assert legacy["authority_boundary"]["merge_authorized"] is False

    require_text(
        "laws/research/applied-investigations/index.html",
        [
            "System examined",
            "Data or observations",
            "Current evidence status",
            "Primary Frontier authority",
            "/explore/frontier/energy/",
            "1,653 final-test cycle records",
            "AUROC 0.9394",
            "AUROC 0.9704",
        ],
    )

    relationships = {
        "laws/categories/flow/index.html": 2,
        "laws/categories/integrity/index.html": 3,
        "laws/categories/reality/index.html": 3,
        "laws/categories/structure/index.html": 2,
    }
    total = 0
    for path, expected in relationships.items():
        text = (ROOT / path).read_text(encoding="utf-8")
        assert text.count("<strong>Study:</strong> Battery health") == expected
        assert text.count("<strong>Primary Frontier domain:</strong> Power and Energy") == expected
        assert text.count("<strong>What the study observed:</strong>") == expected
        assert text.count("<strong>Where the claim stops:</strong>") >= expected
        total += expected
    assert total == 10

    destination_record_counts = {
        "laws/research/applied-investigations/index.html": 11,
        "laws/research/evidence-and-sources/index.html": 6,
        "laws/research/methods-and-models/index.html": 10,
        "laws/research/findings-and-boundaries/index.html": 7,
        "laws/test/admission-and-baseline/index.html": 2,
        "laws/test/forward-construction/index.html": 1,
        "laws/test/reverse-audit/index.html": 4,
        "laws/test/result-and-record/index.html": 7,
    }
    all_migrated_ids: set[str] = set()
    for path, expected in destination_record_counts.items():
        ids = canonical_content_ids(path)
        assert len(ids) == expected, f"{path}: expected {expected} canonical records, found {len(ids)}"
        assert all_migrated_ids.isdisjoint(ids), f"{path}: duplicate canonical record identity"
        all_migrated_ids.update(ids)
    migrated = len(all_migrated_ids)
    assert migrated == 48

    laws = (ROOT / "laws/index.html").read_text(encoding="utf-8")
    assert laws.count('id="cp6-work-behind-laws"') == 1
    assert laws.find('id="research-comes-first"') < laws.find('id="cp6-work-behind-laws"')
    assert laws.find('aria-label="Laws supporting orientation"') < laws.find('data-laws-supporting-panel="evidence-applied"') < laws.find('id="cp6-work-behind-laws"')
    assert 'data-laws-method-acronym="FIRST"' in laws
    assert 'data-laws-test-method="four-member-reversible-admissibility-cluster"' in laws
    assert 'data-laws-primary-star-count="4"' in laws
    assert 'data-laws-category-count="6"' in laws
    assert 'data-laws-nonlaw-member-count="8"' in laws
    assert 'data-laws-child-route-count="24"' in laws
    assert 'data-laws-first-disclosure' in laws
    assert 'data-laws-controller-navigation-authority="true"' in laws
    assert 'data-laws-evidence-claim-authority="false"' in laws

    interactions = (ROOT / "laws/index.interactions.js").read_text(encoding="utf-8")
    assert 'const D=Object.freeze(["flow","integrity","reality","structure","test","research"])' in interactions
    assert 'singleActiveOuterAuthorityLabel:true' in interactions
    assert 'primary-only-star-center-protected-tab' in interactions

    print(json.dumps({
        "contract": "LAWS_CP6_FINAL_CONTENT_CONTRACT_VERIFICATION_v1",
        "status": "PASS",
        "frontier_compatibility_surfaces": 11,
        "canonical_destinations": 8,
        "migrated_records": migrated,
        "canonical_record_identity_verification": "UNIQUE_IDS_WITH_FROZEN_PER_DESTINATION_COUNTS",
        "compatibility_bindings": 9,
        "material_law_relationships": total,
        "current_compass_contract": "SIX_AUTHORITY_SINGLE_ACTIVE_OUTER_LABEL",
        "legacy_benchmark_failures": "CLASSIFIED_WITH_NO_MATERIAL_PRODUCT_FINDINGS",
        "successor_chain_gap": "RECONCILED_PROCEDURALLY",
        "checkpoint_6": "OPEN_PENDING_BROWSER_USER_ACCEPTANCE_MERGE_DEPLOYMENT"
    }, indent=2))


if __name__ == "__main__":
    main()
