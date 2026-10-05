# CARDIAC_MODEL_ABCD_SPECIFICATION_v1

**Mode:** Epistemic-control-plane governed model specification  
**Status:** LOCKED_FOR_PREIMPLEMENTATION · PATIENT_LEVEL_DATA_REVIEW_PENDING  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Candidate dataset:** GUIDE-IT  
**Primary endpoint:** Time to first adjudicated heart-failure hospitalization or cardiovascular mortality  
**Primary mode:** Time-to-event  
**Secondary horizons:** 30 days, 90 days

---

## 1. PURPOSE

Define the exact conceptual role, feature families, preprocessing boundaries, complexity limits, and fairness rules for Models A–D before any confirmatory fitting begins.

The purpose is not to maximize predictive performance at any cost.

The purpose is to isolate whether the proposed state/trajectory architecture adds reproducible value beyond:
- a snapshot,
- a credible conventional clinical comparator,
- ordinary longitudinal modeling.

---

## 2. SHARED MODEL CONTRACT

All Models A–D must use:

- the same patient eligibility rules,
- the same primary endpoint,
- the same index-time definitions,
- the same censoring rules,
- the same treatment-arm handling,
- the same development / validation partitions,
- the same leakage guards,
- the same outcome-assessment window,
- the same evaluation metrics.

No model may receive future information unavailable to the others.

---

## 3. MODEL A — SNAPSHOT

### Purpose

Establish the minimum contemporaneous-information benchmark.

### Candidate exact feature set

At each eligible index time:

- most recent NT-proBNP
- most recent systolic blood pressure
- most recent heart rate
- most recent creatinine
- most recent NYHA class
- most recent LVEF where available

### Optional covariates permitted only if required for fairness

- age
- sex
- randomized treatment arm

### Excluded from Model A

- slopes
- change-from-baseline variables
- rolling summaries
- measurement counts
- time-series statistics
- latent constructs
- future treatment changes

### Output

Risk / hazard estimate for the locked primary endpoint.

### Epistemic role

Model A answers:

> How much can the latest available state alone predict?

---

## 4. MODEL B — CONVENTIONAL CLINICAL BASELINE

### Purpose

Provide a clinically credible conventional comparator that is not intentionally weak.

### Core candidate features

Baseline/static patient characteristics:

- age
- sex
- randomized treatment arm
- relevant heart-failure history variables available in GUIDE-IT
- diabetes status where available
- renal-function context where available

Current clinical state:

- latest NT-proBNP
- latest LVEF
- latest systolic blood pressure
- latest heart rate
- latest creatinine
- latest NYHA class

Treatment state:

- loop-diuretic use / dose
- beta-blocker use / dose
- ACE inhibitor / ARB / ARNI-related treatment where available
- aldosterone antagonist use / dose
- other major HF therapy variables available and sufficiently complete

### Conventional-comparator rule

Model B must remain interpretable and clinically recognizable.

If a validated or accepted risk model can be reconstructed faithfully from available GUIDE-IT variables, that model should be tested as an additional Model-B benchmark.

### Excluded from Model B

- bespoke latent burden / pressure / integrity constructs
- architecture-specific trajectory fusion
- post-index information

### Epistemic role

Model B answers:

> Does the proposed architecture beat a serious conventional clinical model?

---

## 5. MODEL C — ORDINARY LONGITUDINAL

### Purpose

Separate the value of longitudinal information from the value of the proposed architecture.

### Feature families

For selected repeatedly measured variables such as:

- NT-proBNP
- systolic blood pressure
- heart rate
- creatinine
- NYHA class
- LVEF where repeated density permits
- treatment-dose variables where justified

compute only generic longitudinal features available before index time.

Candidate features:

- latest value
- baseline value
- absolute change from baseline
- percent change from baseline where mathematically appropriate
- simple slope
- recent slope
- rolling mean
- rolling variance / dispersion
- minimum
- maximum
- time since last measurement
- number of prior measurements
- time since baseline
- recent treatment-adjustment indicator where available

### Informative-sampling controls

Model C must include sensitivity analysis using:

- visit count
- time since previous visit
- treatment-adjustment-triggered visit indicator

This prevents the proposed architecture from receiving an unfair advantage from care-intensity signals.

### Excluded from Model C

- burden / pressure / integrity latent constructs
- directional architecture-specific state compression
- architecture-defined interaction rules

### Epistemic role

Model C answers:

> Is any apparent gain simply because longitudinal data are better than snapshots?

---

## 6. MODEL D — PROPOSED STATE / TRAJECTORY ARCHITECTURE

### Purpose

Test the incremental value of the proposed architecture itself.

Model D may use the same underlying raw variables available to Model C, but transforms them through a predefined state-and-trajectory representation.

### D1. BURDEN-LIKE STATE

Candidate inputs may include:

- NT-proBNP level relative to prespecified reference/within-cohort transformation
- creatinine / renal-stress context
- LVEF impairment where available
- NYHA functional burden
- cumulative treatment-intensity context where justified

### D2. PRESSURE-LIKE STATE

Candidate inputs may include:

- recent adverse slope in NT-proBNP
- recent blood-pressure instability
- recent heart-rate instability
- recent treatment escalation
- repeated instability events
- rapid worsening across multiple variables

### D3. INTEGRITY / RECOVERY-LIKE STATE

Candidate inputs may include:

- preserved / improving LVEF
- stable or improving hemodynamics
- decreasing NT-proBNP trajectory
- improving NYHA class
- reduced treatment-intensity need where interpretation is clinically valid

### D4. TRAJECTORY STATE

Candidate temporal descriptors:

- direction
- slope
- acceleration
- persistence
- excursion magnitude
- recovery time
- reversals
- time-above or time-below prespecified thresholds
- change from personal baseline

### D5. STATE INTERACTIONS

Only prespecified interactions may be used.

Examples:

- high burden + rising pressure + falling integrity
- declining burden + improving integrity
- stable burden + stable pressure + preserved integrity

No post hoc interaction mining is permitted in confirmatory analysis.

---

## 7. MODEL D NON-MECHANISM RULE

Burden, pressure, and integrity are modeling constructs.

They must not be described as discovered biological mechanisms.

Successful prediction permits:

**PREDICTIVE_ASSOCIATION**

not:

**MECHANISTIC_EVIDENCE**

unless separate mechanistic evidence exists.

---

## 8. FEATURE PROVENANCE REQUIREMENT

Every final feature must be traceable to:

- source variable
- source visit/timestamp
- transformation
- window
- missing-data handling
- normalization
- index-time eligibility

A feature without reproducible provenance is inadmissible.

---

## 9. PREPROCESSING CONTRACT

### Continuous variables

Permitted:
- clinically justified transformation
- log transformation for highly skewed biomarkers such as NT-proBNP where prespecified
- development-set-only scaling
- bounded winsorization only if prespecified

### Categorical variables

Permitted:
- clinically meaningful encoding
- one-hot / indicator encoding where appropriate

### Ordinal variables

Preserve ordinal interpretation where reasonable.

### Prohibited

- scaling on validation data
- feature transformation selected after looking at validation performance
- outcome-informed preprocessing
- future-value imputation

---

## 10. MISSING-DATA CONTRACT

Exact imputation method remains pending patient-level review.

Requirements:

- imputation fitted on development data only
- no future-value leakage
- missingness indicators considered where clinically justified
- sensitivity analysis against complete-case / alternative imputation where feasible
- variable exclusion considered if missingness is excessive

No model receives more favorable missing-data treatment than another.

---

## 11. COMPLEXITY LIMIT

Because GUIDE-IT has approximately 328 primary endpoint events before any analytic exclusions:

- unrestricted high-dimensional modeling is prohibited
- degrees of freedom must remain bounded
- feature count must be justified against effective event count
- penalization may be used if prespecified
- complexity must be comparable enough across models to permit fair inference

Model D may not win simply by being dramatically more parameterized.

---

## 12. MODEL FAMILY

Primary model family should be the simplest survival-model family compatible with the locked endpoint and assumptions.

Candidate first implementation:

- Cox proportional hazards or another prespecified survival model

If proportional-hazards assumptions materially fail, the alternative model class must be justified and applied consistently across A–D.

Black-box model families may be explored secondarily, but they do not replace the primary interpretable comparison without separate governance approval.

---

## 13. COMPETING-RISK IMPLEMENTATION

Still open pending final event structure review.

Permitted candidates:

- cause-specific hazard framework
- Fine-Gray subdistribution framework where justified

The selected implementation must be identical across Models A–D.

---

## 14. CALIBRATION STRATEGY

Required for every model:

- development calibration assessment
- temporal-holdout calibration assessment
- external-validation calibration assessment when available

Recalibration must be:
- explicit,
- performed only after primary transportability assessment,
- reported separately from original-model performance.

---

## 15. OUTPUT SCALE

All models must produce a comparable risk quantity suitable for the locked evaluation framework.

For survival analysis this may include:

- predicted cumulative incidence / event probability at prespecified times
- linear predictor / risk score
- hazard-related estimate

Comparisons must use equivalent prediction targets.

---

## 16. PRIMARY COMPARISON ORDER

The confirmatory interpretation order is:

### Test 1
Model C vs Model A

Question:
Does longitudinal information add value beyond snapshot state?

### Test 2
Model D vs Model B

Question:
Does the architecture beat conventional clinical prediction?

### Test 3
Model D vs Model C

Question:
Does the architecture add value beyond ordinary longitudinal modeling?

### Central requirement

Model D must pass Tests 2 and 3 by the predefined meaningful-effect threshold.

---

## 17. ABLATION CONTRACT

Required Model D ablations:

- D minus burden
- D minus pressure
- D minus integrity
- D minus trajectory
- D without interaction terms
- D using raw variables without latent compression

Variable-family ablations:

- remove biomarkers
- remove imaging / LVEF
- remove hemodynamics
- remove treatment variables
- remove renal/lab variables

Purpose:
identify whether the architecture contributes independent information or merely renames dominant raw predictors.

---

## 18. INFORMATIVE-SAMPLING SENSITIVITY

At minimum compare:

1. Model D without visit-density controls
2. Model D with visit-count / time-since-last-visit controls
3. Model D excluding adjustment-triggered visits where feasible

If performance collapses after controlling for visit density, classify the result as:

**CARE_INTENSITY_SIGNAL_SENSITIVE**

not architecture-specific physiological signal.

---

## 19. TREATMENT-ARM SENSITIVITY

Required:

- treatment arm included as covariate
- interaction test between treatment arm and Model D output
- stratified sensitivity analysis by randomized group

If architecture performance exists only in one treatment arm, this must be reported as subgroup-dependent rather than generalized.

---

## 20. LEAKAGE GUARDS

Hard exclusions:

- post-endpoint data
- future visits
- future medication changes
- event-adjudication fields
- outcome-derived labels disguised as predictors
- transformations fitted on validation cohorts
- patient overlap across development and validation partitions

---

## 21. MINIMUM MEANINGFUL EFFECT — STILL OPEN

The exact threshold remains pending:

- final model family
- event count after exclusions
- patient-level missingness
- clinical-use framing

The threshold must be locked before confirmatory outcome fitting.

---

## 22. MODEL STATUS CLASSIFICATION

### Model A
**SPECIFIED**

### Model B
**SPECIFIED_CONCEPTUALLY · EXACT VARIABLE LOCK PENDING DATA REVIEW**

### Model C
**SPECIFIED_CONCEPTUALLY · EXACT WINDOW LOCK PENDING DATA REVIEW**

### Model D
**SPECIFIED_CONCEPTUALLY · EXACT LATENT MAPPING LOCK PENDING DATA REVIEW**

No model is yet authorized for confirmatory fitting.

---

## 23. NEXT DETERMINISTIC ARTIFACT

**CARDIAC_FEATURE_DICTIONARY_AND_LATENT_MAPPING_LOCK_v1**

Must define, field by field:

- exact GUIDE-IT source variable
- model membership A/B/C/D
- transformation
- temporal window
- latent construct mapping
- units
- admissible range
- missingness rule
- evidence state
- leakage risk
- inclusion/exclusion status

This artifact is the final modeling-specification layer before patient-level data intake and implementation planning.

---

## FINAL STATE

**MODEL A = SPECIFIED**  
**MODEL B = STRUCTURALLY SPECIFIED**  
**MODEL C = STRUCTURALLY SPECIFIED**  
**MODEL D = STRUCTURALLY SPECIFIED**  
**COMPARATOR FAIRNESS = LOCKED**  
**ABLATION CONTRACT = LOCKED**  
**COMPLEXITY CONTROL = LOCKED**  
**LEAKAGE GUARDS = LOCKED**  
**CONFIRMATORY FITTING = NOT YET AUTHORIZED**
