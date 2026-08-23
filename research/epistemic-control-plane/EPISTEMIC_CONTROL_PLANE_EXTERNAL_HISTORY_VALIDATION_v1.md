# Epistemic Control Plane External-History Validation v1

```text
MODE=EXTERNAL_SCIENTIFIC_VALIDATION
CLASS=EPISTEMIC_CONTROL_PLANE_EXTERNAL_HISTORY_TEST
BASELINE=OPERATIONAL_CORE_CONFIRMED
INITIAL_RESULT=3/6_PASS
INITIAL_VERDICT=EXTERNAL_HISTORY_VALIDATION_FAILED_REQUIRES_MODEL_REPAIR
REPAIR_RESULT=6/6_PASS
CURRENT_VERDICT=EXTERNAL_HISTORY_VALIDATION_CONFIRMED_FOR_FROZEN_SIX_CASE_SCOPE
FROZEN_CORPUS_SHA256=3771cd690383f0931c35daac7fe74f7c6b69e59c24e70287ae6f6d1bf5450a67
NOVELTY=NOT_EVALUATED_BY_THIS_TEST
```

## Purpose

Test whether the executable v1 entitlement function reconstructs defensible scientific claim states on histories that were not created by Diamond Gate.

This validation was intentionally capable of falsifying the executable mapping. The first run did so. The failed expected outcomes were then frozen and the claim-entitlement representation was repaired without changing the six histories, IDs, tests, or expected adjudications.

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

## Frozen six-case corpus

The benchmark target is fingerprint-locked over each case's:

```text
id
history
expected adjudication
test statement
```

The frozen corpus fingerprint is:

```text
3771cd690383f0931c35daac7fe74f7c6b69e59c24e70287ae6f6d1bf5450a67
```

The rerun aborts if that fingerprint changes.

## Initial run — falsification

| Case | Expected | initial v1 actual | Result |
|---|---|---|---|
| OPERA 2011 initial anomaly | OBSERVED | PREDICTIVE_INCREMENT_SUPPORTED | FAIL |
| OPERA 2012 timing fault + cross-experiment contradiction | OBSERVED | OBSERVED | PASS |
| STAP 2014 integrity/retraction state | OBSERVED | OBSERVED | PASS |
| STAP 2015 failed multilab replication | OBSERVED | OBSERVED | PASS |
| WHI 2002 randomized causal effect within declared trial scope | CAUSAL | PREDICTIVE_INCREMENT_SUPPORTED | FAIL |
| association-only control | ASSOCIATION_SUPPORTED | PREDICTIVE_INCREMENT_SUPPORTED | FAIL |

```text
INITIAL_PASS=3
INITIAL_TOTAL=6
```

The first external-history run therefore falsified the scalar entitlement implementation in two ways:

```text
QUALIFICATION != PREDICTION
CAUSAL_STRENGTH != REPLICATION_DEPTH != GENERALIZATION_BREADTH
```

## Representation repair

The executable entitlement object is now multidimensional across:

```text
EVIDENCE_MODE = {DESCRIPTIVE, ASSOCIATIONAL, PREDICTIVE, MECHANISTIC, CAUSAL}
REPLICATION_DEPTH = {NONE, REEXECUTION, REPRODUCTION, INDEPENDENT_REPLICATION}
GENERALIZATION_BREADTH = {NONE, SAME_DOMAIN_TRANSFER, CROSS_DOMAIN}
SCOPE
```

Authorization is conjunctive across dimensions. No scalar enum ordering is used to infer that replication, generalization, and causality are stages of one universal ladder.

A bounded causal design may authorize a causal claim in its declared scope without requiring prior generalization. Qualification alone defaults to descriptive entitlement rather than prediction. Association and prediction are separately encoded.

The only semantic binding required by the frozen corpus is the association-only control's explicit `ASSOCIATIONAL` evidence mode. Its history and expected result already stated that distinction before the repair; the old schema simply could not encode it.

## Frozen-corpus rerun

| Case | Expected | repaired actual | Result |
|---|---|---|---|
| OPERA 2011 initial anomaly | OBSERVED | OBSERVED | PASS |
| OPERA 2012 timing fault + cross-experiment contradiction | OBSERVED | OBSERVED | PASS |
| STAP 2014 integrity/retraction state | OBSERVED | OBSERVED | PASS |
| STAP 2015 failed multilab replication | OBSERVED | OBSERVED | PASS |
| WHI 2002 randomized causal effect within declared trial scope | CAUSAL | CAUSAL | PASS |
| association-only control | ASSOCIATION_SUPPORTED | ASSOCIATION_SUPPORTED | PASS |

```text
REPAIR_PASS=6
REPAIR_TOTAL=6
CORPUS_FROZEN_UNCHANGED=TRUE
```

The repaired operational core also passes 16/16 internal cases, adding explicit guards for:

```text
qualification_alone_does_not_imply_prediction
association_and_prediction_are_distinct
```

while preserving fail-closed provenance, threshold-integrity, contradiction, replication, generalization, causal-design, and lifecycle behavior.

## Scientific interpretation

The lawful conclusion is bounded:

```text
MULTIDIMENSIONAL_ENTITLEMENT_REPAIR=SUPPORTED_BY_FROZEN_RERUN
EXTERNAL_HISTORY_VALIDATION=6/6_PASS_FOR_DECLARED_SIX_CASE_SCOPE
ADVERSE_EVIDENCE_CONTRACTION=SUPPORTED_IN_TESTED_EXTERNAL_CASES
GENERAL_EXTERNAL_SCIENTIFIC_VALIDITY=NOT_YET_ESTABLISHED
NOVELTY_AUDIT=NOT_YET_COMPLETE
```

This result repairs the specific model defect exposed by the first external test. It does not establish general validity across scientific domains, expert agreement, superiority to existing workflow/provenance systems, or novelty.

## Next boundary

The next lawful scientific boundary is broader external validation under cases not used to motivate the repair, preferably including blinded expert adjudication and cross-domain transfer. Novelty analysis remains independently required before any breakthrough claim.
