# Epistemic Control Plane External-History Validation v1

```text
MODE=EXTERNAL_SCIENTIFIC_VALIDATION
CLASS=EPISTEMIC_CONTROL_PLANE_EXTERNAL_HISTORY_TEST
BASELINE=OPERATIONAL_CORE_CONFIRMED
RESULT=3/6_PASS
VERDICT=EXTERNAL_HISTORY_VALIDATION_FAILED_REQUIRES_MODEL_REPAIR
NOVELTY=NOT_EVALUATED_BY_THIS TEST
```

## Purpose

Test whether the executable v1 entitlement function reconstructs defensible scientific claim states on histories that were not created by Diamond Gate.

This is intentionally capable of falsifying the executable mapping. Expected outcomes are fixed from the external scientific record before comparing them with the control-plane output.

## External histories

### OPERA neutrino time-of-flight anomaly

CERN reported the September 2011 anomaly as a measurement placed before the broader community for scrutiny. By June 2012, Borexino, ICARUS, LVD and OPERA reported neutrino flight times consistent with the speed of light, and CERN attributed the original anomaly to a faulty element of the fibre-optic timing system.

Source: CERN, `OPERA experiment reports anomaly in flight time of neutrinos from CERN to Gran Sasso`, 23 September 2011, updated 8 June 2012.

### STAP cells

Nature retracted the 2014 STAP papers after critical errors and RIKEN findings undermined the integrity of the evidence. Subsequent multilaboratory work failed to replicate the claimed phenomenon and identified discrepancies/contamination.

Sources: Nature, `Retraction Note: Stimulus-triggered fate conversion of somatic cells into pluripotency`, 2 July 2014; Nature, `Failure to replicate the STAP cell phenomenon`, 2015.

### Women's Health Initiative hormone-therapy trial

The randomized placebo-controlled estrogen-plus-progestin arm was stopped early after prespecified monitoring showed an unfavorable risk-benefit profile, including increased coronary heart disease and other harms. This provides a bounded causal-design case rather than a mere predictive or associational case.

Sources: NHLBI/NIH Women's Health Initiative records; Writing Group for the Women's Health Initiative randomized controlled trial, JAMA 2002.

## Frozen cases and results

| Case | Expected | v1 actual | Result |
|---|---|---|---|
| OPERA 2011 initial anomaly | OBSERVED | PREDICTIVE_INCREMENT_SUPPORTED | FAIL |
| OPERA 2012 timing fault + cross-experiment contradiction | OBSERVED | OBSERVED | PASS |
| STAP 2014 integrity/retraction state | OBSERVED | OBSERVED | PASS |
| STAP 2015 failed multilab replication | OBSERVED | OBSERVED | PASS |
| WHI 2002 randomized causal effect within declared trial scope | CAUSAL | PREDICTIVE_INCREMENT_SUPPORTED | FAIL |
| association-only control | ASSOCIATION_SUPPORTED | PREDICTIVE_INCREMENT_SUPPORTED | FAIL |

```text
PASS=3
TOTAL=6
```

## Scientific interpretation

The v1 operational core survives the external adverse-evidence tests: contradiction, provenance failure, and failed replication contract entitlement rather than silently preserving a stronger claim.

However, the external-history test falsifies the current claim-strength mapping in two material ways.

### Failure 1 — qualification is incorrectly treated as prediction

The v1 executable function initializes every fully qualified, non-contradicted evidence state at:

```text
PREDICTIVE_INCREMENT_SUPPORTED
```

This means a valid descriptive measurement or a valid observational association is automatically promoted to predictive status even when no predictive design, holdout, or incremental prediction evidence exists.

Required repair:

```text
QUALIFICATION != PREDICTION
```

Evidence mode must be represented explicitly.

### Failure 2 — causality is incorrectly nested under replication and generalization

The v1 executable function permits `CAUSAL` only if:

```text
replicated
AND generalized
AND causal_design
```

That imposes a scalar ladder inconsistent with the formal specification's own partial-order requirement. A randomized experiment can support a bounded causal claim in its study population without first establishing cross-domain generalization. Replication depth, generalization breadth and causal strength are distinct dimensions.

Required repair:

```text
CAUSAL_STRENGTH
REPLICATION_DEPTH
GENERALIZATION_BREADTH
```

must not be encoded as one scalar promotion ladder.

## Preserved positive result

The external-history run does support one important part of v1:

```text
ADVERSE_EVIDENCE_CONTRACTION = EXTERNALLY_BEHAVIORALLY_SUPPORTED_IN_TESTED_CASES
```

This is narrower than external validation of the complete epistemic control plane.

## Current boundary

The lawful status is:

```text
FORMAL_SPECIFICATION=PASS
SYNTHETIC_OPERATIONAL_CORE=14/14_PASS
EXTERNAL_HISTORY_VALIDATION=3/6_FAIL
ROOT_CAUSE=CLAIM_ENTITLEMENT_REPRESENTATION_TOO_COARSE
EXTERNAL_VALIDATION_COMPLETE=NO
NOVELTY_AUDIT=NOT_YET_COMPLETE
```

The next scientific move is a model repair, not a threshold adjustment and not a reinterpretation of the failed histories.

The repair must preserve the failed cases unchanged and replace the scalar claim ladder with a claim-entitlement representation that separates at minimum:

```text
EVIDENCE_MODE = {DESCRIPTIVE, ASSOCIATIONAL, PREDICTIVE, MECHANISTIC, CAUSAL}
REPLICATION_DEPTH
GENERALIZATION_BREADTH
SCOPE
```

After the repair, the exact frozen six-case external-history corpus must be rerun unchanged.
