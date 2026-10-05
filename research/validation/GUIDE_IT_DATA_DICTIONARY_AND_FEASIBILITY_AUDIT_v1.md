# GUIDE_IT_DATA_DICTIONARY_AND_FEASIBILITY_AUDIT_v1

**Mode:** Epistemic-control-plane governed feasibility audit  
**Status:** FEASIBILITY_PASS_WITH_CONDITIONS  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Candidate dataset:** GUIDE-IT  
**Purpose:** Determine whether GUIDE-IT is sufficiently structured to serve as the first clean proving-ground dataset for the state/trajectory architecture.

---

## 1. SOURCE RECEIPTS REVIEWED

Primary public source surfaces reviewed:

1. NHLBI BioLINCC GUIDE-IT study page
2. GUIDE-IT 2020 data dictionary
3. GUIDE-IT protocol
4. Primary randomized-trial publication

The audit is based on public study documentation and does **not** substitute for inspection of the requested patient-level dataset after access is granted.

---

## 2. COHORT SIZE

Publicly documented enrollment:

- **N = 894**
- 446 randomized to NT-proBNP-guided treatment
- 448 randomized to usual care
- 45 sites in the United States and Canada
- median follow-up approximately 15 months

The trial stopped early for prespecified futility relative to its treatment-strategy question.

### Feasibility consequence

The cohort is large enough to support a bounded first test, but it is not large enough to justify unconstrained high-dimensional modeling.

**MODEL_COMPLEXITY = MUST_BE_BOUNDED**

---

## 3. PRIMARY ENDPOINT EVENT COUNT

Primary endpoint:

**time to first heart-failure hospitalization or cardiovascular mortality**

Published trial result:

- 164 primary events in the guided-treatment arm
- 164 primary events in usual care
- **328 primary endpoint events total**

### Feasibility consequence

This is a meaningful event count for a constrained time-to-event modeling program.

However:

- feature count must be limited,
- internal validation must be rigorous,
- temporal or pseudo-temporal holdout must preserve adequate event counts.

**PRIMARY_EVENT_COUNT = 328**

---

## 4. VISIT / TEMPORAL STRUCTURE

Public study design documents report:

- initial follow-up visits at approximately 2 weeks and 6 weeks,
- visits every 3 months thereafter,
- additional 2-week reassessment after heart-failure therapy adjustment,
- blinded core-laboratory NT-proBNP measurement at each study visit for both groups.

The data dictionary includes:
- visit identifiers,
- repeat-visit indices,
- days from randomization to NT-proBNP test,
- number of visits per patient,
- visit dates / study days,
- follow-up variables extending through 24 months.

### Feasibility consequence

The dataset is genuinely longitudinal and supports trajectory construction.

The irregularity introduced by therapy-triggered visits must be explicitly modeled or controlled because visit density may itself encode clinical deterioration or treatment intensity.

**LONGITUDINAL_STRUCTURE = PASS**

---

## 5. NT-proBNP / BNP AVAILABILITY

The data dictionary confirms:

- repeated NT-proBNP result
- study-day timing of NT-proBNP testing
- absolute and percent change from baseline
- threshold indicators
- BNP / PROBNP fields
- core-lab and local-lab related variables

### Feasibility consequence

GUIDE-IT directly supports testing whether biomarker trajectories add predictive information beyond snapshot values.

**NT_PROBNP_TRAJECTORY = PASS**

---

## 6. ENDPOINT AVAILABILITY

The data dictionary contains adjudicated endpoint variables including:

- cardiovascular death
- first heart-failure hospitalization
- composite CV death or HF hospitalization
- days from randomization to composite endpoint
- all-cause death
- first hospitalization
- recurrent cardiovascular hospitalizations
- recurrent HF hospitalizations
- 30-day composite indicator
- 90-day composite indicator

### Feasibility consequence

GUIDE-IT can support:

1. primary time-to-event modeling,
2. fixed-horizon 30-day analysis,
3. fixed-horizon 90-day analysis,
4. recurrent-event secondary analysis if separately prespecified.

**ENDPOINT_QUALITY = PASS**

---

## 7. CARDIAC FUNCTION / IMAGING VARIABLES

The data dictionary confirms:

- baseline continuous LVEF
- repeat-visit LVEF dataset
- most recent LVEF
- method of LV function
- echo-performed indicators

### Important limitation

The public dictionary reviewed does **not** establish uniform GLS availability.

Therefore:

**GLS = NOT ASSUMED**

The first GUIDE-IT model should not depend on GLS unless patient-level access or additional documentation confirms usable coverage.

### Feasibility consequence

**LVEF = PASS**  
**GLS = UNRESOLVED / NOT REQUIRED FOR FIRST TEST**

---

## 8. HEMODYNAMIC / EXAM VARIABLES

The data dictionary confirms repeat-visit examination variables including:

- heart rate
- systolic blood pressure
- diastolic blood pressure
- respiratory rate
- NYHA class
- atrial fibrillation / flutter indicator
- oxygen saturation
- jugular venous pressure collection indicator

### Feasibility consequence

GUIDE-IT supports a clinically credible conventional comparator and multivariate state representation beyond NT-proBNP alone.

**HEMODYNAMIC_COVERAGE = PASS**

---

## 9. LABORATORY VARIABLES

The data dictionary confirms repeat-visit laboratory fields including:

- creatinine
- potassium
- sodium
- BUN / urea
- hemoglobin
- hematocrit
- platelets
- WBC
- uric acid
- total cholesterol

### Feasibility consequence

Renal function and electrolyte state can be included in Model B / Model C where prespecified, reducing the risk of constructing an intentionally weak comparator.

**LAB_COVERAGE = PASS**

---

## 10. MEDICATION / TREATMENT VARIABLES

The data dictionary confirms treatment variables including:

- loop diuretics and doses
- beta blockers and doses
- ACE inhibitors and doses
- ARBs and doses
- aldosterone antagonists and doses
- ivabradine
- sacubitril/valsartan-related field
- treatment-adjustment indicators
- neurohormonal adjustment measures

### Feasibility consequence

Medication and treatment changes are available and **must** be considered because:

- treatment changes can alter biomarker trajectories,
- treatment intensity may reflect worsening condition,
- treatment arm influenced clinical management,
- treatment adjustment can create time-varying confounding.

**TREATMENT_COVARIATE_COVERAGE = PASS**

---

## 11. MODEL B COMPARATOR FEASIBILITY

GUIDE-IT contains enough documented conventional clinical variables to construct a nontrivial baseline comparator using combinations of:

- age
- sex
- baseline / recent LVEF
- systolic BP
- heart rate
- creatinine
- NYHA class
- treatment variables
- prior high-risk HF status
- baseline NT-proBNP

Exact Model B specification remains to be locked.

### Audit result

**MODEL_B_FEASIBILITY = PASS**

The comparator must be clinically credible and not deliberately weakened.

---

## 12. MODEL C ORDINARY LONGITUDINAL FEASIBILITY

Candidate ordinary longitudinal features can be generated from repeated measures without invoking the proposed latent architecture:

- latest value
- baseline value
- change from baseline
- slope
- rolling mean
- rolling variance
- time since last measure
- number of measurements
- simple time-varying covariates

### Audit result

**MODEL_C_FEASIBILITY = PASS**

This is essential because the proposed architecture must beat ordinary longitudinal modeling, not merely a snapshot.

---

## 13. MODEL D FEASIBILITY

The proposed architecture can be built from pre-outcome data using predefined mappings for:

- burden-like state
- pressure-like state
- integrity / recovery state
- trajectory features

But these constructs remain modeling hypotheses.

### Hard rule

No Model D feature may use:
- future outcome information,
- post-event measurements,
- endpoint adjudication variables,
- future treatment changes.

### Audit result

**MODEL_D_FEASIBILITY = PASS_WITH_MAPPING_LOCK_REQUIRED**

---

## 14. MISSINGNESS

The public data dictionary establishes variable existence, not patient-level completeness.

Therefore this audit cannot honestly report:

- percent missing by variable,
- percent missing by visit,
- percent with repeated NT-proBNP,
- percent with repeated LVEF,
- endpoint completeness by patient,
- site-specific missingness.

### Audit result

**MISSINGNESS_PROFILE = BLOCKED_PENDING_DATA_ACCESS**

This is the principal unresolved feasibility item.

---

## 15. TEMPORAL VALIDATION FEASIBILITY

GUIDE-IT ran from 2012 to 2016.

A chronology-based holdout may be possible using enrollment or study time, but the public documentation reviewed does not establish whether a split can preserve:

- enough patients,
- enough events,
- sufficient site diversity,
- sufficient longitudinal measurements.

### Audit result

**TEMPORAL_HOLDOUT = PLAUSIBLE_NOT_LOCKED**

After patient-level access:
- order patients by enrollment date,
- define development and later temporal holdout without patient overlap,
- verify event counts before finalizing the split.

If event counts become inadequate, internal resampling may be used for development, but the evidence state must remain below temporal validation.

---

## 16. SITE-BASED VALIDATION FEASIBILITY

GUIDE-IT enrolled participants at 45 sites.

A site-based internal transportability test may be possible.

However, a subset of held-out GUIDE-IT sites is not equivalent to a fully independent external cohort.

### Audit result

**SITE_HOLDOUT = PLAUSIBLE**  
**EXTERNAL_VALIDATION = NOT SATISFIED BY GUIDE_IT ALONE**

---

## 17. ACCESS / GOVERNANCE

BioLINCC classifies GUIDE-IT as an open BioLINCC study requiring a data request / account process.

Public study metadata indicate:

- no commercial-use data restriction
- no area-of-research restriction

Actual use remains subject to the executed BioLINCC data-use terms.

### Audit result

**ACCESS = REQUEST_REQUIRED**  
**PUBLIC_DOCUMENTATION = AVAILABLE**  
**PATIENT_LEVEL_DATA = NOT YET IN REPOSITORY**

---

## 18. PRIMARY ENDPOINT RECOMMENDATION

Based on the trial design and event structure, the strongest first endpoint is:

**TIME TO FIRST ADJUDICATED HF HOSPITALIZATION OR CARDIOVASCULAR MORTALITY**

Rationale:

- clinically meaningful
- original primary trial endpoint
- adjudicated
- 328 documented events
- compatible with longitudinal biomarker history
- preserves time-to-event information

### Recommendation

**ENDPOINT_RECOMMENDATION = LOCK_CANDIDATE**

Final lock should occur in the next gate.

---

## 19. PREDICTION-HORIZON RECOMMENDATION

For the first test:

### Primary
**TIME-TO-EVENT MODELING**

Reason:
- preserves the original endpoint timing,
- avoids an arbitrary fixed horizon,
- uses censored follow-up correctly.

### Secondary fixed horizons
- 30 days
- 90 days

Reason:
- the data dictionary contains adjudicated 30-day and 90-day composite indicators.

Longer fixed horizons may be considered only after event-density and follow-up review.

### Recommendation

**PRIMARY_HORIZON_MODE = TIME_TO_EVENT**  
**SECONDARY_HORIZONS = 30_DAY, 90_DAY**

Not yet final until patient-level feasibility is confirmed.

---

## 20. TREATMENT-ARM GOVERNANCE

Treatment assignment cannot be ignored.

Required options to prespecify:

1. include treatment arm as a covariate,
2. test treatment-arm interaction,
3. perform stratified sensitivity analysis,
4. account for time-varying treatment adjustments where appropriate.

The original trial's null treatment-strategy result does not imply that trajectories lack predictive information.

---

## 21. VISIT-DENSITY / INFORMATIVE-SAMPLING RISK

GUIDE-IT contains protocol visits plus extra visits after therapy adjustment.

This creates a critical risk:

**sicker or more actively managed patients may be measured more often.**

Therefore:

- measurement count,
- time since previous visit,
- adjustment-triggered visit status

should be considered in sensitivity analyses.

Otherwise, a model may learn care intensity instead of underlying physiological trajectory.

**INFORMATIVE_SAMPLING_RISK = MATERIAL**

---

## 22. PROVISIONAL MODEL COMPLEXITY LIMIT

With 328 primary events, Model D must remain bounded.

Before final modeling:
- determine effective event count after exclusions,
- determine complete / imputed sample,
- define degrees-of-freedom budget,
- avoid unrestricted feature expansion.

High-dimensional black-box modeling is not authorized by this feasibility audit.

---

## 23. FEASIBILITY SCORECARD

| Criterion | Result |
|---|---|
| Longitudinal density | PASS |
| Endpoint quality | PASS |
| Comparator fairness | PASS |
| Variable coverage | PASS |
| Missingness burden | PENDING DATA ACCESS |
| Temporal integrity | PASS WITH STRICT INDEXING |
| Temporal holdout | PLAUSIBLE / NOT LOCKED |
| External validation | REQUIRES OTHER COHORT |
| Legal / governance usability | PASS SUBJECT TO DUA |
| Reproducibility | PASS |
| Sample-size adequacy | PASS FOR BOUNDED FIRST TEST |
| Model B feasibility | PASS |
| Model C feasibility | PASS |
| Model D feasibility | PASS WITH MAPPING LOCK |
| Informative sampling risk | MATERIAL / MUST CONTROL |

---

## 24. FINAL AUDIT CLASSIFICATION

**GUIDE_IT = FEASIBILITY_PASS_WITH_CONDITIONS**

The dataset is suitable to remain the first-choice clean proving ground if patient-level data confirm:

1. acceptable missingness,
2. sufficient repeated NT-proBNP density,
3. adequate usable event count after exclusions,
4. feasible chronology/site holdout,
5. sufficient conventional variables for Model B,
6. no unexpected endpoint or access limitation.

---

## 25. NEXT DETERMINISTIC ARTIFACT

**CARDIAC_ENDPOINT_HORIZON_LOCK_v1**

Proposed lock candidates:

**PRIMARY ENDPOINT**  
time to first adjudicated heart-failure hospitalization or cardiovascular mortality

**PRIMARY ANALYSIS MODE**  
time-to-event

**SECONDARY HORIZONS**  
30 days  
90 days

The next gate must also freeze:
- censoring convention
- index-time definition
- event-free eligibility at index
- recurrent-event treatment
- competing-risk treatment
- treatment-arm handling

---

## FINAL STATE

**GUIDE_IT_FEASIBILITY_AUDIT = COMPLETE**  
**GUIDE_IT = PASS_WITH_CONDITIONS**  
**PRIMARY ENDPOINT CANDIDATE = STRONG**  
**TIME_TO_EVENT = PREFERRED PRIMARY MODE**  
**MISSINGNESS PROFILE = PENDING DATA ACCESS**  
**EXTERNAL VALIDATION = STILL REQUIRED**  
**CONFIRMATORY MODELING = NOT YET AUTHORIZED**
