#!/usr/bin/env python3
import hashlib
import json
import pathlib
import statistics

ROOT = pathlib.Path(__file__).resolve().parent


def load(name):
    return json.loads((ROOT / name).read_text())


arm_a = load("arm-a-temporal-transfer.v1.json")
arm_b = load("arm-b-collapse-early-warning.v1.json")
fdic = load("arm-b-fdic-longitudinal-terminal.v1.json")
protocol = load("arm-b-fdic-longitudinal-protocol.v1.json")
result = load("RESULT.v1.json")

assert arm_a["fixed_operator_changed"] is False
assert arm_a["outcome_blindness"] == "NOT_ESTABLISHED"
assert len(arm_a["cases"]) == 4

scores = arm_a["case_scores"]
for case, record in arm_a["cases"].items():
    p = set(record["predicted_failed_relations"])
    f = set(record["final_supported_relations"])
    hit = len(p & f) / len(p)
    coverage = len(p & f) / len(f)
    false_route = len(p - f) / len(p)
    true_score = (hit + coverage) / 2
    decoy = sum(record["decoy_scores"]) / len(record["decoy_scores"])
    expected = {
        "route_hit_rate": hit,
        "causal_coverage": coverage,
        "false_route_rate": false_route,
        "true_route_score": true_score,
        "mean_decoy_score": decoy,
        "true_minus_decoy_advantage": true_score - decoy,
    }
    assert scores[case] == expected

portfolio = {
    "median_route_hit_rate": statistics.median(v["route_hit_rate"] for v in scores.values()),
    "median_causal_coverage": statistics.median(v["causal_coverage"] for v in scores.values()),
    "median_true_minus_decoy_advantage": statistics.median(v["true_minus_decoy_advantage"] for v in scores.values()),
    "positive_true_minus_decoy_cases": sum(v["true_minus_decoy_advantage"] > 0 for v in scores.values()),
    "cases_false_route_rate_gt_0_50": sum(v["false_route_rate"] > 0.50 for v in scores.values()),
}
assert arm_a["portfolio_scores"] == portfolio
assert arm_a["terminal_disposition"] == "UCIC_CROSS_DOMAIN_TEMPORAL_ROUTE_TRANSFER_SUPPORTED_WITH_LIMITATIONS"

pilot = arm_b["systemic_collapse_pilot"]
assert pilot["first_warning_lead_days"] == 402
assert pilot["latest_pre_event_warning_lead_days"] == 64
assert pilot["stress_without_comparable_collapse_control"]["system_operator_initiated_load_shed_mw"] == 0

assert protocol["protocol_status"] == "FROZEN_BEFORE_BANK_QUARTER_VALUE_EXTRACTION"
assert hashlib.sha256((ROOT / "arm-b-fdic-longitudinal-protocol.v1.json").read_bytes()).hexdigest() == "4df693a6e313ca87f32474a8e37d45de0b950143d925260f3ae41ddaf3e4c36c"

assert arm_b["financial_collapse_cohort"]["failed_institutions"] == 11
assert arm_b["financial_collapse_cohort"]["status"] == "LONGITUDINAL_SCORING_CLOSED_NOT_SUPPORTED"
assert arm_b["financial_collapse_cohort"]["terminal_disposition"] == "FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED"
assert arm_b["terminal_disposition"] == "SYSTEMIC_COLLAPSE_EARLY_WARNING_PILOT_SUPPORTED_FINANCIAL_EXTENSION_NOT_SUPPORTED"

assert fdic["terminal_disposition"] == "FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED"
assert fdic["portfolio"]["failed_institutions"] == 11
assert fdic["portfolio"]["evaluable_failures"] == 11
assert fdic["portfolio"]["evaluable_matched_control_trajectories"] == 35
assert fdic["portfolio"]["warning_failures"] == 3
assert fdic["portfolio"]["warning_controls"] == 1
assert fdic["metrics"]["failure_sensitivity"] == 0.2727272727272727
assert fdic["metrics"]["control_false_positive_rate"] == 0.02857142857142857
assert fdic["metrics"]["median_failure_lead_time_days"] == 578.0
assert fdic["metrics"]["balanced_accuracy"] == 0.622077922077922
assert fdic["metrics"]["ucic_minus_best_comparator_balanced_accuracy"] == 0.02857142857142847
assert fdic["frozen_threshold_failure"]["threshold_passed"] is False
assert fdic["protocol_freeze"]["post_result_scientific_repair_permitted"] is False

assert result["arm_a_portfolio_scores"] == portfolio
assert result["arm_b_first_warning_lead_days"] == 402
assert result["arm_b_latest_pre_event_warning_lead_days"] == 64
assert result["arm_b_financial_cohort_status"] == "LONGITUDINAL_SCORING_CLOSED_NOT_SUPPORTED"
assert result["arm_b_financial_terminal_disposition"] == "FDIC_LONGITUDINAL_EARLY_WARNING_NOT_SUPPORTED"
assert result["global_multiplicative_operator"] == "REMAINS_REJECTED"
assert result["universal_law"] == "NOT_ESTABLISHED"

manifest = {}
for line in (ROOT / "manifest.sha256").read_text().splitlines():
    if not line.strip():
        continue
    digest, rel = line.split("  ", 1)
    manifest[rel] = digest
for rel, digest in manifest.items():
    data = (ROOT / rel).read_bytes()
    assert hashlib.sha256(data).hexdigest() == digest, rel

print(json.dumps({
    "status": "PASS",
    "arm_a": arm_a["terminal_disposition"],
    "arm_a_portfolio": portfolio,
    "arm_b": arm_b["terminal_disposition"],
    "fdic_financial_extension": fdic["terminal_disposition"],
    "fdic_failure_sensitivity": fdic["metrics"]["failure_sensitivity"],
    "fdic_control_false_positive_rate": fdic["metrics"]["control_false_positive_rate"],
    "fdic_median_lead_days": fdic["metrics"]["median_failure_lead_time_days"],
    "fdic_post_result_scientific_repair_permitted": fdic["protocol_freeze"]["post_result_scientific_repair_permitted"],
}, sort_keys=True))
