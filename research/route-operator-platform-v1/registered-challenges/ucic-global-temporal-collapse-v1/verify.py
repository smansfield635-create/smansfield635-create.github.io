#!/usr/bin/env python3
import hashlib, json, pathlib, statistics

ROOT = pathlib.Path(__file__).resolve().parent

def load(name):
    return json.loads((ROOT / name).read_text())

arm_a = load("arm-a-temporal-transfer.v1.json")
arm_b = load("arm-b-collapse-early-warning.v1.json")
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
assert arm_b["financial_collapse_cohort"]["failed_institutions"] == 11
assert arm_b["financial_collapse_cohort"]["status"] == "COHORT_FROZEN_LONGITUDINAL_SCORING_PENDING"
assert result["arm_a_portfolio_scores"] == portfolio
assert result["arm_b_first_warning_lead_days"] == 402
assert result["arm_b_latest_pre_event_warning_lead_days"] == 64
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
    "status":"PASS",
    "arm_a":arm_a["terminal_disposition"],
    "arm_a_portfolio":portfolio,
    "arm_b":arm_b["terminal_disposition"],
    "financial_cohort":arm_b["financial_collapse_cohort"]["status"],
}, sort_keys=True))
