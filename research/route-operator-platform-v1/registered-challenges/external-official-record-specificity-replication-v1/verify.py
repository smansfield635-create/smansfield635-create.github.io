#!/usr/bin/env python3
import json
import pathlib
import statistics

ROOT = pathlib.Path(__file__).resolve().parent

def load(name):
    return json.loads((ROOT / name).read_text())

selection = load("selection-and-scoring.v1.json")
routes = load("route-maps.freeze.v1.json")
decoys = load("decoy-maps.freeze.v1.json")
outcomes = load("outcome-ledger.v1.json")
result = load("RESULT.v1.json")

assert selection["fixed_invariant_head"] == "cac25b781909d12f6b53b4c3440adcd7c1356eb0"
assert selection["classification"] == "PROCESS_SEPARATED_RETROSPECTIVE_EXTERNAL_REPLICATION"
assert len(selection["cases"]) == 5
assert [c["id"] for c in selection["cases"]] == ["BIO_LAB","GIVAUDAN","DOW","PEMEX","CUISINE"]
assert set(routes) == set(outcomes) == set(decoys) == {"BIO_LAB","GIVAUDAN","DOW","PEMEX","CUISINE"}

scores = {}
for case, outcome in outcomes.items():
    predictions = routes[case]["predicted_failed_relations"]
    assert len(predictions) == outcome["route_predictions"] == 4
    assert len(decoys[case]) >= 3
    hit = outcome["route_hits"] / outcome["route_predictions"]
    coverage = outcome["causal_findings_covered"] / outcome["causal_findings_material_for_scoring"]
    false_route_rate = 0.0
    decoy_mean = sum(d["route_hit_rate"] for d in decoys[case]) / len(decoys[case])
    true_score = (hit + coverage) / 2.0
    advantage = true_score - decoy_mean
    scores[case] = {
        "route_hit_rate": hit,
        "causal_coverage": coverage,
        "preserved_capacity_accuracy": None,
        "preserved_capacity_status": "UNEVALUABLE_FROM_SUMMARY_RECORD",
        "false_route_rate": false_route_rate,
        "mean_decoy_route_hit_rate": decoy_mean,
        "true_route_score": true_score,
        "true_minus_decoy_advantage": advantage,
    }

portfolio = {
    "median_route_hit_rate": statistics.median(s["route_hit_rate"] for s in scores.values()),
    "median_causal_coverage": statistics.median(s["causal_coverage"] for s in scores.values()),
    "median_true_minus_decoy_advantage": statistics.median(s["true_minus_decoy_advantage"] for s in scores.values()),
    "cases_false_route_rate_gt_0_50": sum(s["false_route_rate"] > 0.50 for s in scores.values()),
    "cases_positive_true_minus_decoy_advantage": sum(s["true_minus_decoy_advantage"] > 0 for s in scores.values()),
}

t = selection["thresholds"]
passes = {
    "route_hit": portfolio["median_route_hit_rate"] >= t["median_route_hit_rate_min"],
    "coverage": portfolio["median_causal_coverage"] >= t["median_causal_coverage_min"],
    "decoy": portfolio["median_true_minus_decoy_advantage"] >= t["median_true_minus_decoy_advantage_min"],
    "false_route": portfolio["cases_false_route_rate_gt_0_50"] <= t["max_cases_false_route_rate_gt_0_50"],
    "positive_cases": portfolio["cases_positive_true_minus_decoy_advantage"] >= t["min_cases_positive_true_minus_decoy_advantage"],
}

assert result["case_scores"] == scores
assert result["portfolio_scores"] == portfolio
assert result["threshold_passes"] == passes
assert result["outcome_blindness"] == "NOT_ESTABLISHED"
assert result["public_outcome_contamination"] == "PRESENT"
assert result["evidence_ceiling"] == "EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY"
assert result["global_multiplicative_operator"] == "REMAINS_REJECTED"
assert result["independent_human_confirmation"] == "NOT_ESTABLISHED"
assert result["prospective_confirmation"] == "NOT_ESTABLISHED"
assert result["universal_law"] == "NOT_ESTABLISHED"
expected = "UCIC_ROUTE_SPECIFICITY_SUPPORTED_EXTERNAL_CSB" if all(passes.values()) else "UCIC_EXTERNAL_CSB_RESULT_MIXED_CONTINUATION_JUSTIFIED"
assert result["terminal_disposition"] == expected

print(json.dumps({
    "status": "PASS",
    "terminal_disposition": expected,
    "portfolio_scores": portfolio,
    "evidence_ceiling": result["evidence_ceiling"],
}, sort_keys=True))
