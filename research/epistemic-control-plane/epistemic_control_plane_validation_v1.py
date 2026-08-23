from dataclasses import dataclass
from enum import IntEnum
import json


class ClaimLevel(IntEnum):
    OBSERVED = 0
    ASSOCIATION_SUPPORTED = 1
    PREDICTIVE_INCREMENT_SUPPORTED = 2
    REPLICATED = 3
    GENERALIZED = 4
    CAUSAL = 5


LIFECYCLE = [
    "INTAKE",
    "OPERATIONALIZED",
    "DESIGN_FROZEN",
    "EXECUTING",
    "RESULT_AVAILABLE",
    "EVIDENCE_QUALIFIED",
    "CLAIM_ADJUDICATED",
    "REPLICATION_OR_CHALLENGE",
    "CURRENT_SCIENTIFIC_STATE",
]


@dataclass(frozen=True)
class EvidenceState:
    design_frozen: bool
    execution_verified: bool
    evidence_complete: bool
    provenance_verified: bool
    threshold_locked: bool
    contradiction_clear: bool
    qualification_passed: bool
    replicated: bool = False
    generalized: bool = False
    causal_design: bool = False


def fail_closed(e: EvidenceState) -> bool:
    required = (
        e.design_frozen,
        e.execution_verified,
        e.evidence_complete,
        e.provenance_verified,
        e.threshold_locked,
        e.contradiction_clear,
        e.qualification_passed,
    )
    return not all(required)


def entitlement(e: EvidenceState) -> ClaimLevel:
    if fail_closed(e):
        return ClaimLevel.OBSERVED
    level = ClaimLevel.PREDICTIVE_INCREMENT_SUPPORTED
    if e.replicated:
        level = ClaimLevel.REPLICATED
    if e.replicated and e.generalized:
        level = ClaimLevel.GENERALIZED
    if e.replicated and e.generalized and e.causal_design:
        level = ClaimLevel.CAUSAL
    return level


def authorize(e: EvidenceState, claim: ClaimLevel) -> bool:
    return claim <= entitlement(e)


def lifecycle_transition_allowed(source: str, target: str) -> bool:
    if source not in LIFECYCLE or target not in LIFECYCLE:
        return False
    return LIFECYCLE.index(target) == LIFECYCLE.index(source) + 1


def run_case(name, condition):
    return {"case": name, "pass": bool(condition)}


def main():
    base = EvidenceState(True, True, True, True, True, True, True)
    replicated = EvidenceState(True, True, True, True, True, True, True, replicated=True)
    generalized = EvidenceState(True, True, True, True, True, True, True, replicated=True, generalized=True)
    causal = EvidenceState(True, True, True, True, True, True, True, replicated=True, generalized=True, causal_design=True)
    missing_provenance = EvidenceState(True, True, True, False, True, True, True)
    threshold_drift = EvidenceState(True, True, True, True, False, True, True)
    contradicted = EvidenceState(True, True, True, True, True, False, True)

    tests = [
        run_case("valid_next_stage_advances", lifecycle_transition_allowed("DESIGN_FROZEN", "EXECUTING")),
        run_case("stage_skip_blocked", not lifecycle_transition_allowed("DESIGN_FROZEN", "RESULT_AVAILABLE")),
        run_case("reverse_transition_blocked", not lifecycle_transition_allowed("RESULT_AVAILABLE", "EXECUTING")),
        run_case("qualified_evidence_allows_bounded_claim", authorize(base, ClaimLevel.PREDICTIVE_INCREMENT_SUPPORTED)),
        run_case("qualified_evidence_blocks_replication_overclaim", not authorize(base, ClaimLevel.REPLICATED)),
        run_case("replication_expands_entitlement", authorize(replicated, ClaimLevel.REPLICATED)),
        run_case("replication_alone_blocks_generalization", not authorize(replicated, ClaimLevel.GENERALIZED)),
        run_case("generalization_requires_replication_and_transfer", authorize(generalized, ClaimLevel.GENERALIZED)),
        run_case("noncausal_generalization_blocks_causal_claim", not authorize(generalized, ClaimLevel.CAUSAL)),
        run_case("causal_claim_requires_causal_design", authorize(causal, ClaimLevel.CAUSAL)),
        run_case("missing_provenance_fails_closed", fail_closed(missing_provenance) and entitlement(missing_provenance) == ClaimLevel.OBSERVED),
        run_case("posthoc_threshold_drift_fails_closed", fail_closed(threshold_drift) and entitlement(threshold_drift) == ClaimLevel.OBSERVED),
        run_case("contradiction_contracts_entitlement", fail_closed(contradicted) and entitlement(contradicted) == ClaimLevel.OBSERVED),
        run_case("negative_evidence_cannot_silently_preserve_strong_claim", not authorize(contradicted, ClaimLevel.PREDICTIVE_INCREMENT_SUPPORTED)),
    ]

    passed = sum(t["pass"] for t in tests)
    verdict = "OPERATIONAL_CORE_CONFIRMED" if passed == len(tests) else "FAIL"
    result = {
        "instrument": "EPISTEMIC_CONTROL_PLANE_v1",
        "tests": tests,
        "passed": passed,
        "total": len(tests),
        "verdict": verdict,
        "scope": "formal operational core only; external scientific validation and novelty remain unclaimed",
    }
    print(json.dumps(result, indent=2))
    with open("epistemic_control_plane_validation_v1.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    if verdict != "OPERATIONAL_CORE_CONFIRMED":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
