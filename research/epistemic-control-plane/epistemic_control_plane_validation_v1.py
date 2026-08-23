from dataclasses import dataclass
from enum import IntEnum
import json


class EvidenceMode(IntEnum):
    DESCRIPTIVE = 0
    ASSOCIATIONAL = 1
    PREDICTIVE = 2
    MECHANISTIC = 3
    CAUSAL = 4


class ReplicationDepth(IntEnum):
    NONE = 0
    REEXECUTION = 1
    REPRODUCTION = 2
    INDEPENDENT_REPLICATION = 3


class GeneralizationBreadth(IntEnum):
    NONE = 0
    SAME_DOMAIN_TRANSFER = 1
    CROSS_DOMAIN = 2


class ClaimLevel(IntEnum):
    # Compatibility/reporting labels only. Authorization is not computed by
    # ordinal comparison across this enum.
    OBSERVED = 0
    ASSOCIATION_SUPPORTED = 1
    PREDICTIVE_INCREMENT_SUPPORTED = 2
    REPLICATED = 3
    GENERALIZED = 4
    CAUSAL = 5


@dataclass(frozen=True)
class ClaimEntitlement:
    evidence_mode: EvidenceMode
    replication_depth: ReplicationDepth = ReplicationDepth.NONE
    generalization_breadth: GeneralizationBreadth = GeneralizationBreadth.NONE
    scope: str = "DECLARED_SCOPE"

    def report_level(self) -> ClaimLevel:
        if self.evidence_mode == EvidenceMode.CAUSAL:
            return ClaimLevel.CAUSAL
        if self.generalization_breadth > GeneralizationBreadth.NONE:
            return ClaimLevel.GENERALIZED
        if self.replication_depth >= ReplicationDepth.INDEPENDENT_REPLICATION:
            return ClaimLevel.REPLICATED
        if self.evidence_mode == EvidenceMode.PREDICTIVE:
            return ClaimLevel.PREDICTIVE_INCREMENT_SUPPORTED
        if self.evidence_mode == EvidenceMode.ASSOCIATIONAL:
            return ClaimLevel.ASSOCIATION_SUPPORTED
        return ClaimLevel.OBSERVED


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
    evidence_mode: EvidenceMode = EvidenceMode.DESCRIPTIVE
    replication_depth: ReplicationDepth = ReplicationDepth.NONE
    generalization_breadth: GeneralizationBreadth = GeneralizationBreadth.NONE
    scope: str = "DECLARED_SCOPE"
    causal_design: bool = False
    replicated: bool = False
    generalized: bool = False
    contradiction_targets: tuple[str, ...] = ()

    def normalized_replication_depth(self) -> ReplicationDepth:
        if self.replication_depth > ReplicationDepth.NONE:
            return self.replication_depth
        if self.replicated:
            return ReplicationDepth.INDEPENDENT_REPLICATION
        return ReplicationDepth.NONE

    def normalized_generalization_breadth(self) -> GeneralizationBreadth:
        if self.generalization_breadth > GeneralizationBreadth.NONE:
            return self.generalization_breadth
        if self.generalized:
            return GeneralizationBreadth.SAME_DOMAIN_TRANSFER
        return GeneralizationBreadth.NONE

    def contradiction_blocks_scope(self, scope: str) -> bool:
        if self.contradiction_clear:
            return False
        # Backward-compatible fail-closed law: an unresolved contradiction
        # without a target remains globally blocking.
        if not self.contradiction_targets:
            return True
        return scope in self.contradiction_targets


def integrity_fail_closed(e: EvidenceState) -> bool:
    required = (
        e.design_frozen,
        e.execution_verified,
        e.evidence_complete,
        e.provenance_verified,
        e.threshold_locked,
        e.qualification_passed,
    )
    return not all(required)


def fail_closed(e: EvidenceState, scope: str | None = None) -> bool:
    claim_scope = e.scope if scope is None else scope
    return integrity_fail_closed(e) or e.contradiction_blocks_scope(claim_scope)


def entitlement(e: EvidenceState) -> ClaimEntitlement:
    if fail_closed(e, e.scope):
        return ClaimEntitlement(EvidenceMode.DESCRIPTIVE, scope=e.scope)

    mode = e.evidence_mode

    if e.causal_design:
        mode = EvidenceMode.CAUSAL
    elif mode == EvidenceMode.CAUSAL:
        mode = EvidenceMode.DESCRIPTIVE

    return ClaimEntitlement(
        evidence_mode=mode,
        replication_depth=e.normalized_replication_depth(),
        generalization_breadth=e.normalized_generalization_breadth(),
        scope=e.scope,
    )


def authorize(e: EvidenceState, claim: ClaimEntitlement) -> bool:
    if claim.scope != e.scope:
        return False
    if fail_closed(e, claim.scope):
        return claim == ClaimEntitlement(EvidenceMode.DESCRIPTIVE, scope=claim.scope)
    allowed = entitlement(e)
    if claim.evidence_mode > allowed.evidence_mode:
        return False
    if claim.replication_depth > allowed.replication_depth:
        return False
    if claim.generalization_breadth > allowed.generalization_breadth:
        return False
    return True


def report_level(e: EvidenceState) -> ClaimLevel:
    return entitlement(e).report_level()


def lifecycle_transition_allowed(source: str, target: str) -> bool:
    if source not in LIFECYCLE or target not in LIFECYCLE:
        return False
    return LIFECYCLE.index(target) == LIFECYCLE.index(source) + 1


def run_case(name, condition):
    return {"case": name, "pass": bool(condition)}


def main():
    predictive = EvidenceState(
        True, True, True, True, True, True, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
    )
    replicated = EvidenceState(
        True, True, True, True, True, True, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
        replication_depth=ReplicationDepth.INDEPENDENT_REPLICATION,
    )
    generalized = EvidenceState(
        True, True, True, True, True, True, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
        replication_depth=ReplicationDepth.INDEPENDENT_REPLICATION,
        generalization_breadth=GeneralizationBreadth.SAME_DOMAIN_TRANSFER,
    )
    causal = EvidenceState(
        True, True, True, True, True, True, True,
        evidence_mode=EvidenceMode.CAUSAL,
        causal_design=True,
    )
    missing_provenance = EvidenceState(
        True, True, True, False, True, True, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
    )
    threshold_drift = EvidenceState(
        True, True, True, True, False, True, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
    )
    contradicted = EvidenceState(
        True, True, True, True, True, False, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
    )
    localized_other = EvidenceState(
        True, True, True, True, True, False, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
        scope="SURROGATE_PREDICTION",
        contradiction_targets=("DIRECT_CLINICAL_EFFICACY",),
    )
    localized_same = EvidenceState(
        True, True, True, True, True, False, True,
        evidence_mode=EvidenceMode.PREDICTIVE,
        scope="DIRECT_CLINICAL_EFFICACY",
        contradiction_targets=("DIRECT_CLINICAL_EFFICACY",),
    )

    tests = [
        run_case("valid_next_stage_advances", lifecycle_transition_allowed("DESIGN_FROZEN", "EXECUTING")),
        run_case("stage_skip_blocked", not lifecycle_transition_allowed("DESIGN_FROZEN", "RESULT_AVAILABLE")),
        run_case("reverse_transition_blocked", not lifecycle_transition_allowed("RESULT_AVAILABLE", "EXECUTING")),
        run_case(
            "qualified_predictive_evidence_allows_bounded_predictive_claim",
            authorize(predictive, ClaimEntitlement(EvidenceMode.PREDICTIVE)),
        ),
        run_case(
            "qualified_predictive_evidence_blocks_replication_overclaim",
            not authorize(
                predictive,
                ClaimEntitlement(
                    EvidenceMode.PREDICTIVE,
                    replication_depth=ReplicationDepth.INDEPENDENT_REPLICATION,
                ),
            ),
        ),
        run_case(
            "replication_expands_replication_dimension",
            authorize(
                replicated,
                ClaimEntitlement(
                    EvidenceMode.PREDICTIVE,
                    replication_depth=ReplicationDepth.INDEPENDENT_REPLICATION,
                ),
            ),
        ),
        run_case(
            "replication_alone_blocks_generalization_dimension",
            not authorize(
                replicated,
                ClaimEntitlement(
                    EvidenceMode.PREDICTIVE,
                    replication_depth=ReplicationDepth.INDEPENDENT_REPLICATION,
                    generalization_breadth=GeneralizationBreadth.SAME_DOMAIN_TRANSFER,
                ),
            ),
        ),
        run_case(
            "generalization_requires_transfer_evidence",
            authorize(
                generalized,
                ClaimEntitlement(
                    EvidenceMode.PREDICTIVE,
                    replication_depth=ReplicationDepth.INDEPENDENT_REPLICATION,
                    generalization_breadth=GeneralizationBreadth.SAME_DOMAIN_TRANSFER,
                ),
            ),
        ),
        run_case(
            "noncausal_generalization_blocks_causal_dimension",
            not authorize(generalized, ClaimEntitlement(EvidenceMode.CAUSAL)),
        ),
        run_case(
            "bounded_causal_claim_requires_causal_design_not_generalization",
            authorize(causal, ClaimEntitlement(EvidenceMode.CAUSAL)),
        ),
        run_case(
            "missing_provenance_fails_closed",
            fail_closed(missing_provenance) and report_level(missing_provenance) == ClaimLevel.OBSERVED,
        ),
        run_case(
            "posthoc_threshold_drift_fails_closed",
            fail_closed(threshold_drift) and report_level(threshold_drift) == ClaimLevel.OBSERVED,
        ),
        run_case(
            "unlocalized_contradiction_retains_global_fail_closed_behavior",
            fail_closed(contradicted) and report_level(contradicted) == ClaimLevel.OBSERVED,
        ),
        run_case(
            "negative_evidence_cannot_silently_preserve_strong_claim",
            not authorize(contradicted, ClaimEntitlement(EvidenceMode.PREDICTIVE)),
        ),
        run_case(
            "qualification_alone_does_not_imply_prediction",
            report_level(EvidenceState(True, True, True, True, True, True, True)) == ClaimLevel.OBSERVED,
        ),
        run_case(
            "association_and_prediction_are_distinct",
            report_level(
                EvidenceState(
                    True, True, True, True, True, True, True,
                    evidence_mode=EvidenceMode.ASSOCIATIONAL,
                )
            ) == ClaimLevel.ASSOCIATION_SUPPORTED,
        ),
        run_case(
            "contradiction_on_other_target_does_not_collapse_current_entitlement",
            report_level(localized_other) == ClaimLevel.PREDICTIVE_INCREMENT_SUPPORTED,
        ),
        run_case(
            "contradiction_on_current_target_contracts_current_entitlement",
            report_level(localized_same) == ClaimLevel.OBSERVED,
        ),
    ]

    passed = sum(t["pass"] for t in tests)
    verdict = "OPERATIONAL_CORE_CONFIRMED" if passed == len(tests) else "FAIL"
    result = {
        "instrument": "EPISTEMIC_CONTROL_PLANE_v1_TARGET_LOCALIZED_CONTRADICTION",
        "tests": tests,
        "passed": passed,
        "total": len(tests),
        "verdict": verdict,
        "entitlement_dimensions": [
            "evidence_mode",
            "replication_depth",
            "generalization_breadth",
            "scope",
            "contradiction_target",
        ],
        "scope": "formal operational core only; external scientific validation and novelty remain bounded",
    }
    print(json.dumps(result, indent=2))
    with open("epistemic_control_plane_validation_v1.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    if verdict != "OPERATIONAL_CORE_CONFIRMED":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
