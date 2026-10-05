# CARDIAC_MISSINGNESS_TEMPORAL_DENSITY_AND_SAMPLE_SIZE_PLAN_v1

**Mode:** Epistemic-control-plane governed planning artifact  
**Status:** LOCKED_FOR_DATA_INTAKE · PATIENT_LEVEL_COUNTS_PENDING  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Dataset candidate:** GUIDE-IT  
**Purpose:** Lock the missingness rules, temporal-density requirements, duplicate-field resolution, event-count budgeting, complexity limits, temporal split rules, site-sensitivity plan, and meaningful-effect strategy before patient-level data intake.

---

## 1. MISSINGNESS GOVERNANCE

Patient-level missingness must be quantified before any field is promoted into a final active feature set.

For every candidate field, calculate:

- overall percent missing
- percent missing by visit
- percent missing by treatment arm
- percent missing by site
- percent missing by calendar period
- percent of patients with at least 1 observation
- percent with at least 2 observations
- percent with at least 3 observations
- median observations per patient
- interquartile range of observations per patient

### Hard rule

No feature is retained solely because it appears in the public data dictionary.

---

## 2. PROVISIONAL FIELD-MISSINGNESS THRESHOLDS

These are preimplementation screening thresholds, not scientific truth.

### Tier A — Core fields
Preferred:
- <= 20% missing overall

May remain under conditional review:
- >20% to <=35% if clinically central and recoverable without unstable imputation

Generally exclude from confirmatory first pass:
- >35% missing unless there is a compelling prespecified reason and sensitivity analysis

### Tier B — Secondary / exploratory fields
Preferred:
- <=30% missing

Generally exclude:
- >50% missing

### Hard-fail condition

A feature with severe site- or era-structural missingness cannot be treated as universally available across the cohort.

---

## 3. TEMPORAL DENSITY REQUIREMENTS

### Latest-value features
Minimum:
- 1 admissible pre-index observation

### Change-from-baseline
Minimum:
- baseline + 1 later admissible observation

### Simple slope
Minimum:
- 2 distinct pre-index timepoints

### Recent slope
Minimum:
- 2 observations inside the locked recent window

### Acceleration
Minimum:
- 3 distinct pre-index timepoints

### Rolling variance / dispersion
Minimum:
- 3 observations inside the locked window

### Recovery-time / reversal features
Minimum:
- enough sequential observations to establish:
  1. excursion,
  2. direction change,
  3. return toward baseline

Exact minimum count:
**>=3 sequential observations**

---

## 4. PERSONAL-BASELINE REQUIREMENT

For patient-specific baseline deviation features:

Preferred baseline definition:
- earliest stable pre-index measurement or prespecified baseline visit

If multiple baseline-period observations exist:
- use prespecified aggregation only
- no outcome-informed selection

If no usable personal baseline exists:
- feature becomes missing or uses predefined cohort-reference fallback
- fallback must be identical across Models C and D where comparable

---

## 5. DUPLICATE-FIELD RESOLUTION LAW

Where the dictionary contains raw and analysis-ready representations of the same clinical construct:

### Rule
Choose one canonical representation before modeling.

Examples:
- creatinine: CRTRSLT vs raw CREAT / CREATVAL
- sodium: sodrslt vs SODIUM / SODVAL
- potassium: POTRSLT vs POTASS / POTVAL
- LVEF: LVEFVAL vs efcontb / other derived fields

### Selection order
1. analysis-ready field with clear units and provenance
2. raw source field if analysis-ready field is incomplete or transformed incompatibly
3. never combine duplicate representations as independent predictors unless explicitly justified

### Required receipt
For each duplicate cluster record:
- chosen field
- rejected alternate(s)
- reason
- unit
- table
- completeness

---

## 6. EVENT-FREE ANALYTIC SAMPLE

Before fitting, compute:

- total N
- N randomized
- N with endpoint data
- N eligible at baseline index
- N eligible at each follow-up index
- N excluded for missing required core fields
- N excluded for no follow-up
- N excluded for prior event before index
- final event-free risk-set size
- final number of primary events

No complexity budget may be set from the nominal N=894 alone.

---

## 7. EFFECTIVE EVENT COUNT

Primary event count from public sources:
- 328 total primary events before analytic exclusions

Required after patient-level intake:
- effective primary event count in development set
- effective primary event count in temporal holdout
- effective primary event count by treatment arm
- effective primary event count by major subgroup
- effective event count after complete-case sensitivity analysis

---

## 8. COMPLEXITY / DEGREES-OF-FREEDOM BUDGET

### Governing principle

Model D may not win by vastly exceeding comparator complexity.

### First-pass rule

Before final fitting, define:
- candidate parameter count
- effective degrees of freedom
- events per effective parameter
- penalization strategy if used

### Preferred posture

Use the smallest model capable of testing the architecture.

### Prohibited

- unrestricted interaction search
- unrestricted spline search
- feature explosion without prespecified shrinkage
- post hoc feature selection against validation outcomes
- black-box optimization as the sole confirmatory analysis

---

## 9. PENALIZATION

If effective degrees of freedom exceed the bounded budget:

Permitted:
- ridge
- elastic net
- lasso where justified

Requirements:
- tuning only inside development data
- same tuning protocol across comparable models
- tuning parameters frozen before temporal validation

Penalization does not authorize uncontrolled feature expansion.

---

## 10. TEMPORAL SPLIT RULE

Preferred split:
- development = earlier-enrolled participants
- temporal validation = later-enrolled participants

### Requirements

The split must preserve:
- no patient overlap
- sufficient primary events in both sets
- adequate treatment-arm representation
- adequate site diversity
- enough longitudinal density for Models C and D

### Provisional target

Aim for approximately:
- 70–80% development
- 20–30% temporal validation

Exact cut point must be chosen by enrollment chronology and event adequacy, not random optimization.

### Hard rule

The temporal cut date is locked before model fitting.

---

## 11. SITE-SENSITIVITY PLAN

GUIDE-IT includes 45 sites.

Required analyses where feasible:

### A. Site distribution check
Report:
- patients/site
- events/site
- treatment-arm balance/site
- missingness/site

### B. Cluster-robust sensitivity
Consider site clustering in uncertainty estimation where appropriate.

### C. Held-site sensitivity
If event counts permit:
- hold out a subset of sites for internal transportability stress testing

### Boundary
Held GUIDE-IT sites do not count as full external validation.

---

## 12. INFORMATIVE-SAMPLING DENSITY AUDIT

Required patient-level variables / derived features:

- total visit count
- NT-proBNP measurement count
- time between visits
- time between NT-proBNP tests
- treatment-adjustment-triggered visit status
- number of treatment adjustments

Required questions:

1. Do higher-risk patients receive more measurements?
2. Does visit frequency predict the endpoint by itself?
3. Does Model D remain superior after including visit-density controls?
4. Does performance remain after excluding adjustment-triggered visits where feasible?

If not:

**RESULT_CLASS = CARE_INTENSITY_SIGNAL_SENSITIVE**

---

## 13. MISSING-DATA METHOD SELECTION

Exact method remains pending missingness profile.

Candidate hierarchy:

### Low missingness
- complete-case sensitivity + simple development-only imputation

### Moderate missingness
- multiple imputation or other prespecified model-based method fit on development only

### Longitudinal missingness
- explicitly preserve observation timing
- no forward filling across clinically unjustified intervals
- no backward filling from future visits

### Required sensitivity
At minimum compare:
- primary imputation approach
- complete-case analysis where feasible
- alternate reasonable imputation approach

---

## 14. MISSINGNESS AS SIGNAL

Missingness indicators may be modeled only if:

- they are defined before outcome fitting
- they are available at index time
- their use is disclosed
- performance is sensitivity-tested without them

Reason:
missingness can encode care intensity or site behavior rather than physiology.

---

## 15. MODEL-SPECIFIC DENSITY RULES

### Model A
Requires only latest admissible value.

### Model B
May use current + static conventional variables.

### Model C
Requires enough repeated measures to calculate prespecified ordinary longitudinal features.

### Model D
Requires enough repeated measures for the locked latent/trajectory architecture.

### Fairness rule
Patients lacking sufficient longitudinal history for Models C/D must be handled by a prespecified policy.

Options:
- restrict all model comparisons to a common longitudinally eligible cohort
- perform paired primary comparison on common cohort
- separately report broader Model A/B performance

Preferred:
**COMMON_COHORT_PRIMARY_COMPARISON**

This prevents sample-composition differences from masquerading as model differences.

---

## 16. MEANINGFUL-EFFECT THRESHOLD STRATEGY

The exact numeric threshold is not yet locked.

It must be selected before confirmatory fitting using:

- clinical interpretability
- expected baseline performance
- event rate
- model uncertainty
- calibration
- decision utility

### Required principle

Model D must show more than statistical significance.

A meaningful-effect criterion should include at least one of:

- prespecified discrimination improvement
- prespecified prediction-error reduction
- prespecified net-benefit improvement
- prespecified calibration improvement where baseline calibration is poor

### Hard rule

A visually compelling score separation is not sufficient.

---

## 17. SAMPLE-SIZE / PRECISION PLAN

Once patient-level counts are available, calculate:

- development N
- validation N
- development events
- validation events
- effective parameter count
- anticipated optimism
- confidence interval width for primary performance metric
- power/precision for Model D vs Model B
- power/precision for Model D vs Model C

The plan must be framed as precision / validation adequacy, not only classical hypothesis-test power.

---

## 18. EXCLUSION CASCADE RECEIPT

Every analytic run must report exclusions in order:

1. source N
2. randomized / eligible N
3. endpoint-available N
4. index-eligible N
5. longitudinally eligible N
6. model-feature-eligible N
7. final common-cohort N
8. primary events retained

This prevents silent cohort shrinkage.

---

## 19. PREIMPLEMENTATION LOCKS

Now locked:

- missingness profiling requirements
- provisional field-level missingness thresholds
- temporal density thresholds
- slope / acceleration observation requirements
- personal-baseline rule
- duplicate-field resolution law
- event-count budgeting
- complexity governance
- temporal split principle
- site-sensitivity plan
- informative-sampling audit
- common-cohort fairness rule
- meaningful-effect selection strategy
- exclusion cascade

---

## 20. STILL OPEN

Requires patient-level data:

- actual missingness percentages
- actual observation-density distributions
- actual event-free analytic sample
- actual effective event counts
- actual site distribution
- actual chronological split date
- exact imputation method
- exact degrees-of-freedom ceiling
- exact meaningful-effect numeric threshold

---

## 21. NEXT DETERMINISTIC ARTIFACT

**GUIDE_IT_PATIENT_LEVEL_DATA_INTAKE_SPEC_v1**

Purpose:

Define the exact ingestion contract for the requested GUIDE-IT dataset, including:

1. expected source tables
2. join keys
3. field whitelist
4. outcome blacklist
5. date/day normalization
6. duplicate-resolution rules
7. unit checks
8. missingness report
9. temporal-density report
10. exclusion cascade
11. no-leakage assertions
12. data-receipt checksum / provenance

No patient-level modeling should occur before the intake report passes.

---

## FINAL STATE

**MISSINGNESS GOVERNANCE = LOCKED**  
**TEMPORAL DENSITY RULES = LOCKED**  
**SAMPLE / EVENT BUDGETING = LOCKED**  
**COMPLEXITY GOVERNANCE = LOCKED**  
**TEMPORAL SPLIT PRINCIPLE = LOCKED**  
**SITE SENSITIVITY = LOCKED**  
**COMMON-COHORT FAIRNESS = LOCKED**  
**PATIENT-LEVEL COUNTS = PENDING**  
**CONFIRMATORY FITTING = NOT YET AUTHORIZED**
