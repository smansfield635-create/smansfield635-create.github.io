# Epistemic Control Plane Prospective Transfer Protocol v1

```text
MODE=PROSPECTIVE_CROSS_DOMAIN_TRANSFER
ARCHITECTURE_FREEZE_SHA=84fa8e19f8e6159f545302255e37c614b5682b06
MODEL_REPAIR_AFTER_CORPUS_EXPOSURE=PROHIBITED_UNTIL_COMPLETE_SCORING
PRIMARY_STATUS=PROTOCOL_FROZEN_BEFORE_SCORING
HUMAN_BLINDED_EXPERT_REFERENCE=NOT_YET_OBTAINED
NOVELTY_AUDIT=SEPARATE
```

## Scientific question

Does the frozen multidimensional epistemic-entitlement model transfer to unfamiliar scientific histories and preserve the strongest defensible claim state without architecture changes after exposure?

## Frozen architecture

The architecture under test is exactly the BT2 branch state at:

```text
84fa8e19f8e6159f545302255e37c614b5682b06
```

No modification to `epistemic_control_plane_validation_v1.py` is permitted between corpus exposure and complete transfer scoring.

## Unit of adjudication

Each case supplies an admissible scientific-history summary plus explicit semantic evidence facts. This tests the entitlement kernel, not autonomous natural-language fact extraction. The formal v1 specification explicitly permits human/domain processes to supply semantic facts while requiring the governance kernel to enforce their consequences.

Each reference entitlement is a vector:

```text
{
  evidence_mode,
  replication_depth,
  generalization_breadth,
  scope
}
```

The dimensions are not collapsed into a scalar ladder.

## Domains

The transfer corpus contains histories not present in the frozen six-case repair corpus and spans:

```text
particle physics
observational astrophysics / gravitational-wave astronomy
infectious-disease therapeutics
neurodegenerative-disease therapeutics / surrogate endpoints
cardiovascular nutrition trials
pharmacovigilance / drug safety
vaccine epidemiology / research integrity
astrobiology / microbial biochemistry
```

## Predetermined scoring

Primary score:

```text
VECTOR_EXACT_AGREEMENT = exact machine/reference entitlement-vector matches / N
```

Dimension scores:

```text
EVIDENCE_MODE_ACCURACY
REPLICATION_DEPTH_ACCURACY
GENERALIZATION_BREADTH_ACCURACY
SCOPE_ACCURACY
```

Over-entitlement is distinguished from under-entitlement. The following are severe errors:

```text
unsupported CAUSAL entitlement
unsupported PREDICTIVE entitlement
unsupported GENERALIZATION entitlement
scope expansion beyond the evidence
failure to contract after integrity/provenance failure
```

A machine vector is an overgrant when any ordered entitlement dimension exceeds the reference or its scope is broader than the reference.

## No-repair law

```text
NO_ARCHITECTURE_CHANGE_AFTER_TEST_CORPUS_EXPOSURE_UNTIL_FINAL_SCORING
```

If the frozen architecture performs poorly, the complete failure is preserved before any repair cycle begins.

## Independence boundary

The present executable cycle uses literature-grounded reference adjudications derived from authoritative scientific records. This is not represented as blinded human-expert validation.

The stronger external boundary remains:

```text
DOMAIN_QUALIFIED_HUMAN_REVIEWERS
+ BLINDED_TO_MACHINE_OUTPUT
+ PRECOMMITTED_ADJUDICATION_RUBRIC
+ FROZEN_REFERENCE_BEFORE_COMPARISON
```

No automated or assistant-generated reference may be relabeled as independent expert judgment.

## Transfer interpretation

A strong score on this corpus supports prospective structured transfer of the entitlement kernel only. It does not establish universality, autonomous scientific reasoning, or novelty.
