# CARDIAC_DATA_SOURCE_AND_ENDPOINT_SELECTION_v1

**Mode:** Epistemic-control-plane governed intake  
**Status:** DATA_SOURCE_SELECTION_OPEN · ENDPOINT_SELECTION_OPEN  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Purpose:** Lock the admissible criteria for selecting the first cardiac dataset/cohort and the first confirmatory endpoint before any outcome modeling begins.

---

## 1. CURRENT REPOSITORY RECEIPT

Repository search performed for existing cardiac data assets / explicit mappings using:

- GLS
- BNP / NT-proBNP
- troponin
- HRV
- stroke volume
- cardiac output
- cardiac / heart coherence

**Result:** No qualifying cardiac dataset or explicit cardiac data-source file was found in the active repository search surface.

Therefore:

**DATA_SOURCE_LOCK = PENDING**

No dataset is to be invented, assumed, or silently substituted.

---

## 2. DATA-SOURCE SELECTION OBJECTIVE

Select one first proving-ground dataset/cohort capable of supporting a fair test of:

- snapshot-only prediction,
- conventional clinical baseline prediction,
- ordinary longitudinal prediction,
- proposed state/trajectory architecture prediction.

The selected source must support at least one clinically meaningful endpoint and enough longitudinal structure to make the trajectory hypothesis testable.

---

## 3. MINIMUM DATA-SOURCE REQUIREMENTS

A candidate dataset is admissible only if it can document:

### A. Population
- cohort definition
- inclusion criteria
- exclusion criteria
- age range
- care setting
- site count
- study period

### B. Longitudinal structure
- repeated observations per patient/system
- timestamped measurements
- enough temporal density to calculate at least some trajectory features
- no forced use of synthetic longitudinal values as the primary evidence source

### C. Outcomes
At least one clinically meaningful endpoint with:
- event date or interval
- explicit definition
- follow-up
- censoring information where applicable

### D. Comparator variables
Enough conventional variables to build a credible Model B comparator.

### E. Governance
- provenance
- data-use permissions
- de-identification status
- reproducible extraction rules
- documented missingness

---

## 4. PREFERRED VARIABLE COVERAGE

The first dataset does not need every candidate variable.

Higher-value candidates include:

### Imaging / function
- GLS
- ejection fraction
- stroke volume
- cardiac output
- ventricular volumes
- remodeling indices

### Biomarkers
- BNP
- NT-proBNP
- troponin

### Hemodynamics
- systolic blood pressure
- diastolic blood pressure
- mean arterial pressure
- resting heart rate

### Autonomic / rhythm
- HRV
- rhythm class
- arrhythmia burden where consistently captured

### Covariates
- age
- sex
- renal function
- diabetes status
- smoking status
- major cardiovascular diagnoses
- medication/treatment exposure
- prior cardiovascular events

---

## 5. DATA-SOURCE ADMISSIBILITY SCORECARD

Each candidate source must be scored as:

- **PASS**
- **PARTIAL**
- **FAIL**

Across:

1. longitudinal density
2. endpoint quality
3. comparator fairness
4. variable coverage
5. missingness burden
6. temporal integrity
7. external-validation potential
8. legal / governance usability
9. reproducibility
10. sample-size adequacy

A source with a hard FAIL on endpoint validity, temporal integrity, or lawful usability is rejected.

---

## 6. PRIMARY ENDPOINT SELECTION RULE

The first confirmatory endpoint must be:

- clinically meaningful,
- objectively defined,
- timestamped,
- available at sufficient frequency,
- not created from the same variables used to construct the predictor in a circular way,
- locked before confirmatory outcome modeling.

The term **collapse** is not permitted as the endpoint label.

---

## 7. CANDIDATE PRIMARY ENDPOINT CLASSES

Candidate classes remain:

1. hospitalization for cardiovascular decompensation
2. predefined hemodynamic decompensation
3. major decline in ventricular function
4. initiation of mechanical circulatory support
5. cardiovascular mortality
6. prospectively defined validated composite

No candidate is selected yet.

---

## 8. ENDPOINT PRIORITIZATION ORDER

Preferred order for first selection:

### Tier 1
Hard clinical endpoints with clear adjudication:
- cardiovascular mortality
- mechanical circulatory support
- hospitalization for decompensation

### Tier 2
Well-defined functional deterioration:
- major decline in ventricular function
- predefined hemodynamic decompensation

### Tier 3
Composite endpoint
Only if components are individually defensible and the composite is justified prospectively.

---

## 9. PREDICTION-HORIZON SELECTION

Candidate horizons:

- 30 days
- 90 days
- 6 months
- 1 year

Selection rule:

Choose the horizon that best matches:
- data density,
- endpoint frequency,
- intended clinical use,
- plausible warning interval,
- adequate event count.

Exactly one horizon must be designated **PRIMARY** before confirmatory analysis.

Additional horizons remain secondary unless multiplicity is prespecified.

---

## 10. SAMPLE-SIZE / EVENT REQUIREMENT

No exact numeric threshold is locked yet.

Before modeling, the selected dataset must support:

- a development cohort,
- a temporal holdout cohort,
- enough endpoint events to avoid obviously unstable estimation,
- an external validation route if the study is to advance beyond development-only status.

A formal sample-size / power / precision plan is required once:
- the primary endpoint,
- prediction horizon,
- comparator model,
- model complexity,
- expected event frequency

are known.

---

## 11. EXTERNAL VALIDATION SOURCE

External validation must come from:

- a different site,
- different health system,
- different registry,
- or clearly independent cohort,

with comparable variable and endpoint definitions.

If no external source exists, the maximum admissible state after temporal validation is:

**INCREMENTAL_SIGNAL_TEMPORALLY_VALIDATED**

not externally validated or replicated.

---

## 12. MISSINGNESS PROFILE REQUIRED BEFORE LOCK

For each candidate data source, report:

- percentage missing by variable
- percentage missing by time window
- proportion of patients with repeated observations
- variables missing structurally by site or era
- endpoint completeness
- follow-up completeness

No data source may be locked without this profile.

---

## 13. DATA LEAKAGE EXCLUSIONS

Reject or re-engineer any source if:

- future values are mixed into index-time features
- endpoint adjudication uses predictor outputs
- post-event measurements are included in pre-event windows
- normalization uses test or external data
- repeated records from one patient cross development and validation boundaries improperly

---

## 14. MODEL-COMPARATOR AVAILABILITY CHECK

A candidate dataset must support:

### Model A
Latest observation only

### Model B
Conventional clinical baseline

### Model C
Ordinary longitudinal features

### Model D
Proposed architecture

If Model B cannot be built credibly, the dataset is not sufficient for the strongest Phase II comparison.

---

## 15. SELECTION OUTPUT TEMPLATE

When candidate data are identified, complete:

**DATA_SOURCE_NAME:**  
**OWNER / HOST:**  
**ACCESS METHOD:**  
**SITE COUNT:**  
**STUDY PERIOD:**  
**N PATIENTS:**  
**N EVENTS:**  
**MEDIAN FOLLOW-UP:**  
**MEDIAN OBSERVATIONS/PATIENT:**  
**VARIABLE FAMILIES AVAILABLE:**  
**PRIMARY ENDPOINT CANDIDATE:**  
**PRIMARY HORIZON CANDIDATE:**  
**MISSINGNESS SUMMARY:**  
**MODEL B COMPARATOR AVAILABLE:** YES / NO  
**TEMPORAL HOLDOUT POSSIBLE:** YES / NO  
**EXTERNAL VALIDATION SOURCE IDENTIFIED:** YES / NO  
**ADMISSIBILITY:** PASS / PARTIAL / FAIL

---

## 16. CURRENT GATE RESULT

**DATA_SOURCE = NOT YET LOCKED**

**PRIMARY ENDPOINT = NOT YET LOCKED**

**PRIMARY HORIZON = NOT YET LOCKED**

**SAMPLE-SIZE PLAN = PENDING**

**EXTERNAL VALIDATION SOURCE = NOT YET LOCKED**

Therefore:

**CONFIRMATORY MODELING = NOT AUTHORIZED**

---

## 17. NEXT DETERMINISTIC ARTIFACT

**CARDIAC_DATA_SOURCE_CANDIDATE_SURVEY_v1**

Purpose:

Identify and compare real candidate cohorts/datasets against the admissibility scorecard above.

Only after a candidate source passes intake may the program proceed to:

**CARDIAC_ENDPOINT_HORIZON_LOCK_v1**

---

## FINAL STATE

**DATA-SOURCE CRITERIA = LOCKED**  
**ENDPOINT-SELECTION CRITERIA = LOCKED**  
**NO DATASET INVENTED**  
**NO ENDPOINT INVENTED**  
**CONFIRMATORY MODELING REMAINS GATED**
