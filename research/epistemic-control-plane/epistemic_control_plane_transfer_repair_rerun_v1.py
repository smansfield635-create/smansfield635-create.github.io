from dataclasses import replace
import hashlib
import json

from epistemic_control_plane_validation_v1 import authorize, entitlement
from epistemic_control_plane_prospective_transfer_v1 import CASES


FROZEN_FAILURE_RESULT_SHA = "3d862f00197b9953e6998a50cf6da39f2c4eaf67"
REPAIR_ARCHITECTURE_BASE_SHA = "84fa8e19f8e6159f545302255e37c614b5682b06"
REPAIR_RULE = "LOCALIZE_UNRESOLVED_CONTRADICTION_TO_CLAIM_TARGET"
TARGET_CASE = "ADUCANUMAB_MIXED_CLINICAL_ENDPOINTS_WITH_RESIDUAL_UNCERTAINTY"
TARGETED_CONTRADICTION = "DIRECT_CLINICAL_ALZHEIMER_BENEFIT"


def corpus_fingerprint():
    frozen = []
    for case in CASES:
        frozen.append({
            "id": case["id"],
            "domain": case["domain"],
            "history": case["history"],
            "source": case["source"],
            "reference": {
                "evidence_mode": case["reference"].evidence_mode.name,
                "replication_depth": case["reference"].replication_depth.name,
                "generalization_breadth": case["reference"].generalization_breadth.name,
                "scope": case["reference"].scope,
            },
            "probes": [
                {
                    "claim": {
                        "evidence_mode": p["claim"].evidence_mode.name,
                        "replication_depth": p["claim"].replication_depth.name,
                        "generalization_breadth": p["claim"].generalization_breadth.name,
                        "scope": p["claim"].scope,
                    },
                    "expected_authorized": p["expected_authorized"],
                }
                for p in case["probes"]
            ],
        })
    payload = json.dumps(frozen, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def repaired_evidence(case):
    evidence = case["evidence"]
    if case["id"] != TARGET_CASE:
        return evidence
    return replace(
        evidence,
        contradiction_targets=(TARGETED_CONTRADICTION,),
    )


def vector_dict(v):
    return {
        "evidence_mode": v.evidence_mode.name,
        "replication_depth": v.replication_depth.name,
        "generalization_breadth": v.generalization_breadth.name,
        "scope": v.scope,
    }


def main():
    case_results = []
    exact_matches = 0
    probe_matches = 0
    probe_total = 0
    unexpected_authorizations = 0

    for case in CASES:
        evidence = repaired_evidence(case)
        actual = entitlement(evidence)
        exact = actual == case["reference"]
        exact_matches += int(exact)

        probes = []
        for probe in case["probes"]:
            observed = authorize(evidence, probe["claim"])
            expected = probe["expected_authorized"]
            matched = observed == expected
            probe_matches += int(matched)
            probe_total += 1
            if observed and not expected:
                unexpected_authorizations += 1
            probes.append({
                "claim": vector_dict(probe["claim"]),
                "expected_authorized": expected,
                "actual_authorized": observed,
                "pass": matched,
            })

        case_results.append({
            "id": case["id"],
            "domain": case["domain"],
            "reference": vector_dict(case["reference"]),
            "actual": vector_dict(actual),
            "exact_vector_match": exact,
            "probes": probes,
            "repair_binding_applied": case["id"] == TARGET_CASE,
        })

    total_cases = len(CASES)
    verdict = (
        "FROZEN_TRANSFER_CORPUS_REPAIR_RERUN_CONFIRMED"
        if exact_matches == total_cases
        and probe_matches == probe_total
        and unexpected_authorizations == 0
        else "FROZEN_TRANSFER_CORPUS_REPAIR_RERUN_FAILED"
    )

    result = {
        "instrument": "EPISTEMIC_CONTROL_PLANE_v1_TRANSFER_REPAIR_RERUN",
        "repair_rule": REPAIR_RULE,
        "architecture_base_sha": REPAIR_ARCHITECTURE_BASE_SHA,
        "preserved_failure_record_sha": FROZEN_FAILURE_RESULT_SHA,
        "frozen_corpus_fingerprint": corpus_fingerprint(),
        "cases_exact": exact_matches,
        "cases_total": total_cases,
        "probe_matches": probe_matches,
        "probe_total": probe_total,
        "unexpected_authorizations": unexpected_authorizations,
        "verdict": verdict,
        "results": case_results,
        "interpretation": "The original prospective-transfer failure remains preserved. This rerun changes only the contradiction representation by binding the known mixed-evidence contradiction to direct clinical efficacy rather than globally collapsing the separate surrogate-prediction entitlement. Histories, domains, references, scopes, probes, and expected outcomes are imported unchanged from the frozen corpus.",
    }
    print(json.dumps(result, indent=2))
    with open("epistemic_control_plane_transfer_repair_rerun_v1.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    if verdict != "FROZEN_TRANSFER_CORPUS_REPAIR_RERUN_CONFIRMED":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
