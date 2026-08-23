# Epistemic Control Plane Prospective Structured Transfer Result v1

```text
MODE=PROSPECTIVE_CROSS_DOMAIN_TRANSFER
ARCHITECTURE_FREEZE_SHA=84fa8e19f8e6159f545302255e37c614b5682b06
CORPUS_CASES=21
CORPUS_FINGERPRINT_SHA256=bee172993fafa5f689e902a6572ac713df66b2e34c5a1af609da4f2a86cc7758
VECTOR_EXACT_MATCHES=20/21
VECTOR_EXACT_AGREEMENT=0.9523809524
PROBE_MATCHES=41/42
PROBE_ACCURACY=0.9761904762
SEVERE_OVERGRANTS=0
VERDICT=PROSPECTIVE_STRUCTURED_TRANSFER_NOT_CONFIRMED_PRESERVE_FAILURE
HUMAN_BLINDED_EXPERT_REFERENCE=NO
MODEL_REPAIR_AFTER_EXPOSURE=NO
```

## Boundary

This cycle tested the architecture frozen at `84fa8e19f8e6159f545302255e37c614b5682b06` on a new 21-case corpus spanning particle physics, gravitational-wave astronomy, infectious-disease therapeutics, neurodegenerative therapeutics, cardiovascular nutrition, drug safety, vaccine epidemiology, and astrobiology/microbiology.

The corpus is separate from the frozen six-case repair corpus. The architecture was not changed after prospective-corpus exposure.

The reference type is literature-grounded predeclared adjudication. It is not represented as blinded independent human-expert adjudication.

## Scores

```text
VECTOR EXACT AGREEMENT        = 20/21 = 95.24%
EVIDENCE MODE ACCURACY        = 20/21 = 95.24%
REPLICATION DEPTH ACCURACY    = 21/21 = 100%
GENERALIZATION ACCURACY       = 21/21 = 100%
SCOPE ACCURACY                = 21/21 = 100%
AUTHORIZATION PROBE ACCURACY  = 41/42 = 97.62%
SEVERE OVERGRANTS             = 0
```

## Preserved failure

The sole failed case is:

```text
ADUCANUMAB_MIXED_CLINICAL_ENDPOINTS_WITH_RESIDUAL_UNCERTAINTY
```

Reference entitlement:

```text
EVIDENCE_MODE=PREDICTIVE
REPLICATION_DEPTH=NONE
GENERALIZATION_BREADTH=NONE
SCOPE=CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE
```

Frozen-machine entitlement:

```text
EVIDENCE_MODE=DESCRIPTIVE
REPLICATION_DEPTH=NONE
GENERALIZATION_BREADTH=NONE
SCOPE=CLINICAL_ALZHEIMER_BENEFIT_FROM_SURROGATE
```

The corresponding predictive authorization probe was expected to pass and was blocked.

## Structural diagnosis

The failure exposes a new representational issue distinct from the earlier scalar-ladder defects.

The current fail-closed function treats `contradiction_clear=False` as a global collapse of the entire entitlement state to descriptive status.

That is too coarse for mixed evidence in which:

```text
DIRECT_CLINICAL_CAUSAL_ENTITLEMENT = UNCERTAIN_OR_CONTRADICTED
```

while simultaneously:

```text
SURROGATE_BASED_PREDICTIVE_ENTITLEMENT = STILL_SUPPORTED_WITH_RESIDUAL_UNCERTAINTY
```

The aducanumab regulatory history is a concrete example: direct clinical endpoints contained substantial uncertainty, including a negative high-dose Study 301 result, while FDA still treated amyloid reduction as a surrogate reasonably likely to predict clinical benefit under accelerated approval.

Therefore the current architecture lacks a sufficiently local contradiction model. Contradiction is represented as a single Boolean applying to the complete evidence state rather than being bound to a claim target, entitlement dimension, evidence channel, or proposition subclaim.

Provisional diagnosis:

```text
GLOBAL_CONTRADICTION_FLAG_TOO_COARSE
```

Candidate future repair boundary, not executed in this cycle:

```text
CONTRADICTION_STATE must become claim-target/dimension/evidence-channel bound
rather than globally collapsing every entitlement dimension.
```

## Scientific interpretation

The result is strong but not a pass under the predeclared all-cases transfer criterion.

The correct status is therefore:

```text
PROSPECTIVE_STRUCTURED_TRANSFER = HIGH_AGREEMENT_WITH_ONE_PRESERVED_STRUCTURAL_FAILURE
PROSPECTIVE_TRANSFER_CONFIRMED = NO
GENERAL_VALIDITY = NOT_CLAIMED
BLINDED_HUMAN_EXPERT_VALIDATION = NOT_YET_COMPLETE
NOVELTY = NOT_YET_COMPLETE
```

The zero severe-overgrant count is important: the frozen kernel did not grant unsupported causality, prediction, generalization, or broader scope in the declared transfer probes. Its only failure was conservative under-entitlement in a mixed contradictory/predictive case.

No model repair is performed here. The failure record is frozen before any next repair cycle.
