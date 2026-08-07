#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def ratio(n, d):
    if d <= 0:
        raise ValueError("denominator must be positive")
    return n / d

def main():
    contract = json.loads((ROOT / "adjudication-contract.v1.json").read_text())
    o = json.loads((ROOT / "outcome-ledger.v1.json").read_text())

    l4 = o["controlled_causal"]["level4_relation_disruption"]
    hs = o["controlled_causal"]["hidden_structure"]
    controlled_mechanism = (
        l4["frozen_predictions_correct"] == l4["frozen_predictions_total"] == 9
        and l4["matched_output_discrimination"]
        and l4["noncompensation"]
        and l4["relation_specific_restoration"]
        and l4["hysteresis_reentry"]
        and hs["relation_set"] == "EXACT_MATCH"
        and hs["boundary"] == "EXACT_MATCH"
        and hs["ordered_route"] == "EXACT_MATCH"
        and hs["held_out_predictions_correct"] == hs["held_out_predictions_total"] == 6
        and hs["observer_isolation"]
    )

    sw = o["external_software_bridge"]
    route_accuracy = ratio(sw["route_predictions_correct"], sw["route_predictions_total"])
    output_accuracy = ratio(sw["output_history_correct"], sw["output_history_total"])
    matched_route_accuracy = ratio(sw["matched_route_correct"], sw["matched_route_total"])
    matched_output_accuracy = ratio(sw["matched_output_correct"], sw["matched_output_total"])
    matched_advantage = matched_route_accuracy - matched_output_accuracy
    external_system_transfer = route_accuracy >= 0.90 and matched_advantage >= 0.25

    industrial = o["prospective_industrial_bridge"]
    general_observational_superiority = (
        industrial["route_beats_output_history"] >= 2
        and industrial["route_within_5pct_blackbox"] >= 2
    )

    temporal = o["temporal_operator_tests"]
    cmapss_product_better_additive = (
        temporal["cmapss_fd001"]["multiplicative_factorial_rmse"]
        < temporal["cmapss_fd001"]["additive_factorial_rmse"]
    )
    ag_product_better_additive = (
        temporal["agricultural_temporal_block"]["multiplicative_cs4_rmse"]
        < temporal["agricultural_temporal_block"]["additive_mean4_rmse"]
    )
    multiplicative_specificity = cmapss_product_better_additive and ag_product_better_additive

    cross = o["cross_sectional"]
    cross_domain_count = sum(
        1 for v in cross.values()
        if v.get("supports_nonredundancy_or_hidden_collapse", False)
    )
    cross_domain_measurement_signal = cross_domain_count >= 2

    negative_constraint_integrity = (
        not general_observational_superiority
        and not multiplicative_specificity
    )

    evidence_identity_ok = (
        o["evidence_identity"]["raw_data_reanalysis"] is False
        and o["evidence_identity"]["post_result_model_repair"] is False
    )

    continuation = (
        evidence_identity_ok
        and controlled_mechanism
        and external_system_transfer
        and negative_constraint_integrity
        and cross_domain_measurement_signal
    )

    if not evidence_identity_ok:
        disposition = "UNEVALUABLE_EVIDENCE_IDENTITY_FAILURE"
    elif not controlled_mechanism:
        disposition = "INVARIANT_REJECTED_BY_EXISTING_PORTFOLIO"
    elif not continuation:
        disposition = "CONTINUATION_NOT_JUSTIFIED"
    else:
        disposition = "SURVIVES_INTERNAL_RETROSPECTIVE_PORTFOLIO_ADJUDICATION_WITH_CONSTRAINTS"

    result = {
        "operation_id": contract["operation_id"],
        "classification": contract["classification"],
        "disposition": disposition,
        "continuation_justified": continuation,
        "controlled_mechanism_supported": controlled_mechanism,
        "external_system_transfer_supported_internal": external_system_transfer,
        "route_prediction_accuracy_external_software": route_accuracy,
        "output_history_accuracy_external_software": output_accuracy,
        "matched_output_route_advantage": matched_advantage,
        "cross_domain_measurement_signal_supported": cross_domain_measurement_signal,
        "cross_domain_supporting_studies": cross_domain_count,
        "general_observational_predictive_superiority": general_observational_superiority,
        "multiplicative_specificity": multiplicative_specificity,
        "fixed_invariant_operator_retained": continuation,
        "global_product_remains_rejected": not multiplicative_specificity,
        "independent_human_identifiability": "NOT_ESTABLISHED",
        "prospective_real_intervention_generality": "NOT_ESTABLISHED",
        "universal_empirical_law": "NOT_ESTABLISHED",
        "next_scientific_action": (
            "CONTINUE_TO_INDEPENDENT_HUMAN_AND_PROSPECTIVE_REAL_INTERVENTION_TESTS"
            if continuation else
            "STOP_OR_REDESIGN_ONLY_WITH_NEW_PREOUTCOME_JUSTIFICATION"
        )
    }
    rendered = json.dumps(result, indent=2, sort_keys=True) + "\n"
    expected = (ROOT / "RESULT.v1.json").read_text()
    if rendered != expected:
        raise SystemExit("committed RESULT.v1.json does not match recomputation")
    print(rendered, end="")

if __name__ == "__main__":
    main()
