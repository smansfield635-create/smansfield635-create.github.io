# CARDIAC_PHASE_II_VALIDATION_PROTOCOL_v1

**Status:** Pre-registration scaffold  
**Purpose:** Use the cardiovascular system as the first concrete proving ground for the state/trajectory architecture.

## Primary research question

Can a predefined multivariate state-and-trajectory model identify clinically meaningful cardiovascular deterioration, stability, and recovery beyond established individual measurements and conventional risk models?

## Candidate measurement domains

Potential variables may include:

- global longitudinal strain (GLS)
- BNP / NT-proBNP
- troponin
- heart-rate variability (HRV)
- stroke volume
- cardiac output
- blood pressure
- ventricular remodeling measures
- recovery trajectories
- other established clinical covariates required for comparator fairness

No variable is automatically canonical. Inclusion must be justified and pre-specified.

## Endpoint requirement

The term **collapse** is not an endpoint.

A confirmatory protocol must define a clinically meaningful endpoint before outcome inspection.

Candidate endpoint classes may include:

- hospitalization for cardiovascular decompensation
- predefined hemodynamic decompensation
- major deterioration in ventricular function
- need for mechanical circulatory support
- cardiovascular mortality
- a validated composite endpoint

## Prediction horizon

The prediction horizon must be fixed prospectively.

Examples may include:
- 30 days
- 90 days
- 6 months
- 1 year

The horizon should be selected based on the intended clinical use case and available data density.

## Comparator models

### Model A — Snapshot
Latest observation only.

### Model B — Conventional clinical baseline
Established clinical variables and/or accepted risk model.

### Model C — Longitudinal conventional
Trajectory or time-series features without the proposed architecture.

### Model D — Proposed state/trajectory architecture
Predefined multidimensional representation using the locked mapping.

## Required comparison

Model D must demonstrate reproducible incremental value beyond both:
- Model B, and
- Model C.

If it does not, the central architecture claim is weakened or rejected.

## Pre-registration requirements

Before confirmatory outcome analysis, lock:

- cohort definition
- inclusion criteria
- exclusion criteria
- variable definitions
- time windows
- normalization rules
- missing-data handling
- censoring rules
- endpoint definition
- prediction horizon
- comparator models
- model complexity limits
- performance metrics
- subgroup analyses
- ablation plan
- calibration plan
- external-validation plan
- kill thresholds

## Missing-data governance

Missing-data handling must be specified before outcome analysis.

At minimum:
- quantify missingness by variable and time
- distinguish structural absence from incidental missingness
- prohibit leakage from future values
- sensitivity-test imputation choices
- report performance with and without high-missingness variables where feasible

## Normalization governance

Normalization must be fit only on training/development data and carried forward unchanged into temporal/external validation.

No test-cohort information may influence scaling or threshold selection.

## Temporal validation

A later time period must be held out as unseen validation data.

Purpose:
- test drift
- test prospective-like robustness
- reduce optimistic leakage from random splits

## External validation

At least one independent cohort/site should be used before broader claims are made.

A single-site result cannot establish transportability.

## Ablation analysis

Remove each major component or latent axis one at a time.

Questions:
- Does burden add independent information?
- Does pressure add independent information?
- Does integrity add independent information?
- Do trajectory features add value beyond snapshots?
- Does the combined architecture add value beyond ordinary longitudinal modeling?

## Performance domains

Use task-appropriate metrics such as:

- discrimination
- calibration
- Brier/error measures
- sensitivity/specificity at predeclared thresholds
- decision-curve or net-benefit analysis where appropriate
- clinically meaningful reclassification only where justified

Statistical significance alone is insufficient.

## Falsification conditions

The Phase II hypothesis fails if:

- Model D does not outperform Model B and Model C by a predeclared meaningful margin;
- calibration is unacceptable;
- temporal validation materially degrades;
- external validation fails;
- ablation shows architecture components are redundant;
- results depend on post hoc thresholds or leakage;
- endpoint definitions change after outcome inspection.

## Mechanism boundary

Even if Model D predicts successfully, this establishes predictive association only.

Mechanistic claims require separate evidence tying latent constructs to biological pathways.

Causal claims require intervention-sensitive evidence beyond observational prediction.

## Phase II output classes

- **PREDICTIVE_SIGNAL_ABSENT**
- **PREDICTIVE_SIGNAL_PRESENT_NOT_INCREMENTAL**
- **INCREMENTAL_SIGNAL_TEMPORALLY_VALIDATED**
- **INCREMENTAL_SIGNAL_EXTERNALLY_REPLICATED**

Only the final class supports serious consideration of broader domain transfer.

## Final posture

Cardiology is a proving ground, not proof of universality.
