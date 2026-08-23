from epistemic_control_plane_validation_v1 import ClaimLevel, EvidenceState, entitlement
import json


CASES = [
    {
        "id": "OPERA_2011_INITIAL_ANOMALY",
        "history": "OPERA initially reported an anomalous neutrino time-of-flight measurement and explicitly invited scrutiny; no independent replication or causal/generalized entitlement existed at that point.",
        "evidence": EvidenceState(True, True, True, True, True, True, True),
        "expected": ClaimLevel.OBSERVED,
        "test": "A qualified measurement must not silently become a predictive claim merely because integrity gates pass.",
    },
    {
        "id": "OPERA_2012_TIMING_FAULT_AND_CROSS_EXPERIMENT_CHECK",
        "history": "Subsequent investigation identified timing-system faults and four Gran Sasso experiments measured neutrino flight time consistent with light speed.",
        "evidence": EvidenceState(True, True, True, True, True, False, True),
        "expected": ClaimLevel.OBSERVED,
        "test": "Contradictory/adverse evidence must contract prior entitlement.",
    },
    {
        "id": "STAP_2014_RETRACTION_INTEGRITY_FAILURE",
        "history": "RIKEN/Nature identified critical errors and data misrepresentation affecting the STAP papers; the papers were retracted.",
        "evidence": EvidenceState(True, True, True, False, True, False, False),
        "expected": ClaimLevel.OBSERVED,
        "test": "Broken provenance/integrity and contradiction must fail closed.",
    },
    {
        "id": "STAP_2015_MULTILAB_FAILURE_TO_REPLICATE",
        "history": "Seven laboratories failed to replicate the STAP phenomenon and reanalysis identified discrepancies and contamination.",
        "evidence": EvidenceState(True, True, True, True, True, False, True, replicated=False),
        "expected": ClaimLevel.OBSERVED,
        "test": "Failed replication must not preserve a stronger prior claim.",
    },
    {
        "id": "WHI_2002_RANDOMIZED_CAUSAL_EFFECT_WITHIN_SCOPE",
        "history": "The randomized placebo-controlled WHI estrogen-plus-progestin trial found an unfavorable risk-benefit profile and was stopped early under prespecified monitoring rules.",
        "evidence": EvidenceState(True, True, True, True, True, True, True, causal_design=True),
        "expected": ClaimLevel.CAUSAL,
        "test": "A valid randomized causal design can support a bounded causal claim without first requiring cross-domain generalization.",
    },
    {
        "id": "ASSOCIATION_ONLY_CONTROL",
        "history": "Generic externally sourced control: a methodologically valid observational association with no predictive holdout, replication, generalization, or causal design.",
        "evidence": EvidenceState(True, True, True, True, True, True, True),
        "expected": ClaimLevel.ASSOCIATION_SUPPORTED,
        "test": "Association-only evidence must not be automatically promoted to predictive increment.",
    },
]


def main():
    results = []
    for case in CASES:
        actual = entitlement(case["evidence"])
        passed = actual == case["expected"]
        results.append({
            "id": case["id"],
            "test": case["test"],
            "expected": case["expected"].name,
            "actual": actual.name,
            "pass": passed,
        })

    passed = sum(r["pass"] for r in results)
    total = len(results)
    verdict = "EXTERNAL_HISTORY_VALIDATION_CONFIRMED" if passed == total else "EXTERNAL_HISTORY_VALIDATION_FAILED_REQUIRES_MODEL_REPAIR"
    output = {
        "instrument": "EPISTEMIC_CONTROL_PLANE_v1_EXTERNAL_HISTORY_VALIDATION",
        "passed": passed,
        "total": total,
        "verdict": verdict,
        "results": results,
        "interpretation": "This evaluates whether the executable v1 entitlement function reconstructs defensible claim strength on external scientific histories. Failure is evidence against the current operational mapping, not grounds to alter the historical expected state post hoc.",
    }
    print(json.dumps(output, indent=2))
    with open("epistemic_control_plane_external_history_validation_v1.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)
    if verdict != "EXTERNAL_HISTORY_VALIDATION_CONFIRMED":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
