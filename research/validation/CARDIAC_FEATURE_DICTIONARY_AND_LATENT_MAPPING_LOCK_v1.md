# CARDIAC_FEATURE_DICTIONARY_AND_LATENT_MAPPING_LOCK_v1

**Mode:** Epistemic-control-plane governed feature lock  
**Status:** LOCKED_FOR_PREIMPLEMENTATION · PATIENT_LEVEL_COMPLETENESS_REVIEW_PENDING  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Dataset candidate:** GUIDE-IT  
**Purpose:** Map exact documented GUIDE-IT source fields into Models A–D and freeze the first-pass latent-construct architecture before patient-level fitting.

---

## 1. SOURCE AUTHORITY

Primary source:
- GUIDE-IT 2020 BioLINCC data dictionary

Repository policy:
- exact source variable names are taken from the public data dictionary
- undocumented fields are not invented
- fields with uncertain completeness remain provisional until patient-level data review
- GLS is excluded from first-pass lock because uniform availability is not established

---

## 2. IDENTIFIERS / INDEXING

### Patient identifier
**deidnum**
- label: Deidentified PATIENT NUMBER
- role: patient linkage only
- model membership: NONE
- leakage risk: NONE if used only as key
- status: LOCKED

### Visit identifier
**VISIT**
- role: visit label
- model membership: support only
- status: LOCKED

### Repeat visit index
**VISITNDX**
- label: unique repeat-visit index
- role: temporal ordering / join support
- model membership: support only
- status: LOCKED

### Visit study-day fields
Examples include:
- PBNPDT_DDY / PBNPDT_TDY
- EFDT_DDY / EFDT_TDY
- VSITDT_DDY / VSITDT_TDY
- CLABDAY where available

Role:
- temporal alignment
- feature-window construction
- index-time eligibility

Status:
**LOCKED_AS_TIME_SUPPORT_FIELDS**

---

## 3. ENDPOINT FIELDS

Dataset:
**best_endpoints_ads.sas7bdat**

### Primary composite indicator
**dthhfadj**
- label: CV Death or Hospitalization due to Heart Failure — Adjudicated
- role: primary endpoint event indicator
- model membership: OUTCOME ONLY
- leakage risk: CRITICAL
- status: LOCKED

### Primary composite event time
**dhfadjdy**
- label: Days from Randomization to CV Death or HF Hospitalization — Adjudicated
- role: primary event time
- model membership: OUTCOME ONLY
- leakage risk: CRITICAL
- status: LOCKED

### 30-day composite
**dthhf30**
- role: secondary 30-day endpoint
- model membership: OUTCOME ONLY
- status: LOCKED

### 90-day composite
**dthhf90**
- role: secondary 90-day endpoint
- model membership: OUTCOME ONLY
- status: LOCKED

### CV death
**dthcvadj**
- role: component endpoint / competing-risk support
- status: LOCKED

### CV death time
**dcvadjdy**
- role: component event timing
- status: LOCKED

### Non-CV death
**dthncadj**
- role: competing-event indicator
- status: LOCKED

### Non-CV death time
**dncadjdy**
- role: competing-event timing
- status: LOCKED

### First HF hospitalization
**hoshfadj**
- role: primary composite component
- status: LOCKED

### Competing-risk indicator for HF hospitalization
**cumhfhos**
- role: competing-risk support
- status: LOCKED

### Recurrent HF hospitalization count
**hospnum**
- role: secondary recurrent-event analysis only
- status: LOCKED_SECONDARY

### Recurrent CV hospitalization count
**hospcvnum**
- role: secondary recurrent-event analysis only
- status: LOCKED_SECONDARY

---

## 4. TREATMENT ARM / RANDOMIZATION

### Treatment arm
**ARM**
- label: Treatment Arm
- role: required covariate / stratification variable
- model membership: B, C, D
- status: LOCKED

### Randomized subject flag
**randfl**
- role: eligibility / data integrity
- model membership: support only
- status: LOCKED

Treatment-arm rule:
- ARM is included in Models B–D
- treatment interaction with Model D output must be tested
- stratified sensitivity analysis required

---

## 5. DEMOGRAPHICS / BASELINE COVARIATES

### Age
**age**
- role: conventional baseline covariate
- model membership: B, C, D
- transformation: continuous unless prespecified otherwise
- status: LOCKED

### Sex
**sex** and/or **GENDER**
- public dictionary documents both derived and source-style representations
- role: baseline covariate
- model membership: B, C, D
- final canonical field chosen after patient-level table reconciliation
- status: LOCKED_CONCEPT / FIELD_RECONCILIATION_PENDING

### Diabetes
**DIABETES**
- role: conventional comorbidity
- model membership: B, C, D where completeness permits
- status: LOCKED_CANDIDATE

### Atrial fibrillation baseline / history
Candidate fields:
- **afibbase**
- **AFIB**
- **CRHYTM** for current AF/flutter state

Role:
- Model B conventional risk context
- Model C/D longitudinal rhythm context if repeated density permits

Status:
**LOCKED_CANDIDATE / TABLE_RECONCILIATION_REQUIRED**

### Smoking history
**SMOKEHX**
- role: conventional baseline covariate
- membership: B where useful
- status: PROVISIONAL_UNTIL_COMPLETENESS_REVIEW

### HF etiology
**HFETIOL** / **hfetiold**
- role: conventional clinical context
- membership: B
- status: LOCKED_CANDIDATE

---

## 6. NT-proBNP / BNP CORE

Dataset:
**probnp.sas7bdat**

### NT-proBNP measurement flag
**PBNPRSTD**
- role: measurement availability
- model membership: support / missingness
- status: LOCKED

### NT-proBNP result
**PBNPRSLT**
- role: primary longitudinal biomarker
- units: verify from dictionary / dataset metadata at intake
- model membership: A, B, C, D
- status: LOCKED

### NT-proBNP test day
**PBNPDT_DDY** / **PBNPDT_TDY**
- role: temporal alignment
- status: LOCKED

Other documented derived threshold fields may include:
- pbnp1500
- pbnp2000
- pbnp2500
- pbnp999

Rule:
Threshold flags are not preferred over the continuous raw value for primary modeling unless prespecified.

### BNP / proBNP event-related fields
Examples documented:
- PROBNPD2
- PRBNPVA2
- BNPDON2
- BNPVAL2

Role:
- secondary/contextual only unless table provenance confirms appropriate longitudinal use

Status:
PROVISIONAL

---

## 7. HEMODYNAMIC / EXAM CORE

Dataset:
**exam.sas7bdat**

### Heart rate
**HRVALUE**
- role: current hemodynamic state
- models: A, B, C, D
- status: LOCKED

### Systolic blood pressure
**BPSYS**
- role: current hemodynamic state
- models: A, B, C, D
- status: LOCKED

### Diastolic blood pressure
**BPDIA**
- role: secondary hemodynamic context
- models: C, D; B optional
- status: LOCKED_CANDIDATE

### NYHA class
**NYHACD**
- role: functional state
- models: A, B, C, D
- status: LOCKED

### Atrial fibrillation / flutter
**CRHYTM**
- role: current rhythm state
- models: C, D; B optional
- status: LOCKED_CANDIDATE

### Oxygen saturation
**SPO2**
- role: secondary physiological state
- models: C, D if completeness adequate
- status: PROVISIONAL

---

## 8. RENAL / LAB CORE

Derived analysis dataset:
**labs_ads.sas7bdat**

### Creatinine
**CRTRSLT**
- units: mg/dL
- role: renal function / conventional risk context
- models: A, B, C, D
- status: LOCKED

### Potassium
**POTRSLT**
- units: mmol/L
- role: electrolyte / treatment context
- models: C, D; B optional
- status: LOCKED_CANDIDATE

### Sodium
**sodrslt**
- units: mmol/L
- role: congestion / electrolyte context
- models: C, D; B optional
- status: LOCKED_CANDIDATE

### BUN / urea
**BUNRSLT**
- units: mg/dL
- role: renal / congestion context
- models: B, C, D if completeness adequate
- status: LOCKED_CANDIDATE

Raw labs dataset also documents:
- CREAT / CREATVAL
- POTASS / POTVAL
- SODIUM / SODVAL
- BUNUR / BUNVAL

Rule:
Prefer one canonical analysis-ready representation after patient-level table reconciliation; never mix duplicate representations without explicit reason.

---

## 9. LVEF / CARDIAC FUNCTION

Dataset:
**ef.sas7bdat**

### Most recent LVEF indicator / value
**LVEF**
**LVEFVAL**
- role: ventricular systolic function
- models: A, B, C, D
- status: LOCKED_CANDIDATE

### Method of LV function
**METHLV**
- role: measurement-method adjustment / sensitivity
- model membership: support
- status: LOCKED_CANDIDATE

### Baseline continuous LVEF
**efcontb**
- role: baseline comparator
- models: B
- status: LOCKED_CANDIDATE

### GLS
No uniformly documented GLS variable has been established in the reviewed public dictionary.

**GLS = EXCLUDED_FROM_FIRST_PASS**

It may be added only by amended field lock after verified availability.

---

## 10. MEDICATION / TREATMENT FEATURES

Dataset:
**meds_ads.sas7bdat**

### Beta blocker
**BETAB**
**BBDOSE**
**bbpct**

### ACE inhibitor
**ACE**
**ACEDOSE**
**acepct**

### ARB
**ARB**
**ARBDOSE**
**arbpct**

### Aldosterone antagonist
**ALDOS**
**ALDODOSE**
**aldpct**

### Loop / diuretic treatment
**FUROSND**
**FUROSE**
**TORSEND**
**TORSEDD**
**BUMETA**
**BUMETAND**
**diurdose**
**diur80**

### Ivabradine
**ivause**

### Sacubitril/valsartan
**valsart**

### Combined therapy intensity
**acearbpt**
**double**
**triple**

Role:
- Model B: current treatment state
- Model C: longitudinal treatment state / change
- Model D: pressure-like context only if prespecified

Hard rule:
Treatment intensity is not automatically physiology.
It can encode clinician behavior and disease severity simultaneously.

Status:
**LOCKED_WITH_CONFOUNDING_WARNING**

---

## 11. VISIT / INFORMATIVE-SAMPLING FEATURES

Candidate support fields:

- VISIT
- VISITNDX
- visitnum
- PBNPDT_DDY / PBNPDT_TDY
- VSITDT_DDY / VSITDT_TDY
- VISTTYP
- PBNPADJ
- pbnpadj
- mdchang1
- MEDADJ
- mediuadj

Derived sensitivity features:

- visits_to_date
- time_since_prior_visit
- time_since_prior_NTproBNP
- treatment_adjustment_since_prior_visit
- adjustment_triggered_visit
- measurement_count_to_date

Role:
- Model C/D sensitivity controls
- never primary latent physiology without separate justification

Status:
**LOCKED_AS_INFORMATIVE_SAMPLING_CONTROLS**

---

## 12. MODEL A EXACT FIRST-PASS FIELD SET

Required if available at index:

1. PBNPRSLT
2. BPSYS
3. HRVALUE
4. CRTRSLT
5. NYHACD
6. LVEFVAL or canonical LVEF representation

Fairness covariates:
7. age
8. sex/GENDER canonicalized
9. ARM

No trajectory features.

**MODEL_A_FIELD_SET = LOCKED_FIRST_PASS**

---

## 13. MODEL B EXACT FIRST-PASS FIELD SET

Core:

- age
- sex/GENDER canonicalized
- ARM
- DIABETES
- AF history/current status where canonicalized
- HF etiology where available
- PBNPRSLT
- LVEFVAL / canonical LVEF
- BPSYS
- HRVALUE
- CRTRSLT
- NYHACD

Treatment state:

- BETAB / BBDOSE or bbpct
- ACE / ACEDOSE or acepct
- ARB / ARBDOSE or arbpct
- ALDOS / ALDODOSE or aldpct
- diurdose
- ivause
- valsart where availability permits

Rule:
Exact treatment representation must be simplified to avoid redundant collinearity.

**MODEL_B_FIELD_SET = STRUCTURALLY_LOCKED · REDUNDANCY_PRUNING_PENDING**

---

## 14. MODEL C EXACT FIRST-PASS VARIABLE FAMILIES

Longitudinal variables:

- PBNPRSLT
- BPSYS
- HRVALUE
- CRTRSLT
- NYHACD
- LVEFVAL if repeated density supports
- selected treatment-dose/intensity variables

For each admissible repeated variable, compute only prespecified generic features:

- latest
- baseline
- absolute change
- percent change where valid
- simple slope
- recent slope
- rolling mean
- rolling dispersion
- minimum
- maximum
- time since last measure
- observation count

Plus informative-sampling controls.

**MODEL_C_FEATURE_FAMILY = LOCKED**

Exact windows remain pending patient-level visit-density review.

---

## 15. MODEL D LATENT MAPPING — FIRST-PASS LOCK

### BURDEN-like state

Purpose:
Represent current accumulated adverse state.

Candidate inputs:

- log-transformed PBNPRSLT
- NYHACD
- LVEF impairment
- CRTRSLT / BUNRSLT renal context
- persistent high diuretic intensity as contextual feature only

Rules:
- higher value must consistently mean greater burden
- treatment variables cannot dominate the construct without explicit sensitivity analysis

State:
**MODELING_HYPOTHESIS · MAPPING_LOCKED_FIRST_PASS**

---

### PRESSURE-like state

Purpose:
Represent recent adverse directional load / worsening.

Candidate inputs:

- recent NT-proBNP slope
- recent rise in creatinine
- recent adverse BP trend / instability
- recent adverse HR trend / instability
- treatment escalation
- repeated therapy adjustment
- worsening NYHA class

Rules:
- only pre-index data
- pressure is trajectory/load, not a claimed biological mechanism
- treatment escalation must be sensitivity-tested because it reflects clinician behavior

State:
**MODELING_HYPOTHESIS · MAPPING_LOCKED_FIRST_PASS**

---

### INTEGRITY-like state

Purpose:
Represent preserved or recovering functional capacity.

Candidate inputs:

- higher / improving LVEF
- lower / falling NT-proBNP
- stable BP
- stable HR
- improving NYHACD
- stable/improving renal function

Rules:
- orient all inputs so higher integrity consistently represents better function
- do not define integrity using future event-free survival

State:
**MODELING_HYPOTHESIS · MAPPING_LOCKED_FIRST_PASS**

---

### TRAJECTORY state

Purpose:
Represent temporal direction and persistence.

Candidate derived features:

- slope
- recent slope
- acceleration where at least 3 suitable timepoints exist
- persistence of worsening/improvement
- excursion from personal baseline
- recovery toward personal baseline
- reversals
- time above/below prespecified biomarker or clinical thresholds

State:
**MODELING_HYPOTHESIS · FEATURE_FAMILY_LOCKED**

---

## 16. LATENT CONSTRUCT NORMALIZATION

First-pass rule:

Each component entering a latent construct must be oriented into a common direction before combination.

Potential transformation sequence:

1. unit reconciliation
2. clinically justified transform
3. development-only scaling
4. sign orientation
5. bounded combination

No outcome-derived weighting is permitted in the confirmatory architecture unless explicitly classified as model fitting and applied identically within development-only data.

---

## 17. LATENT COMBINATION RULE

Primary confirmatory implementation should begin with the simplest transparent combination capable of testing the hypothesis.

Preferred sequence:

1. equal-weight / prespecified-weight composite
2. sensitivity analysis with alternative bounded weights
3. learned weights only as secondary modeling if governed separately

Reason:
The first test should evaluate architecture, not hide it inside unrestricted optimization.

**TRANSPARENCY_PRIORITY = LOCKED**

---

## 18. MODEL D INTERACTIONS

Permitted first-pass interactions:

- burden × pressure
- burden × integrity
- pressure × integrity
- burden × pressure × integrity only if complexity budget permits

Interpretive examples:

- high burden + rising pressure + falling integrity
- falling burden + improving integrity
- stable burden + stable pressure + preserved integrity

No interaction mining after outcome inspection.

---

## 19. PERSONAL BASELINE

Where enough pre-index measurements exist, Model C and Model D may use patient-specific baseline / deviation features.

Rules:

- personal baseline must be calculated only from observations before index time
- minimum observation requirement must be prespecified
- if insufficient history exists, fallback behavior must be predefined
- no future averaging

Status:
**ADMISSIBLE_WITH_WINDOW_LOCK_PENDING**

---

## 20. FEATURE EXCLUSION LIST

Excluded from predictors:

- dthhfadj
- dhfadjdy
- dthhf30
- dthhf90
- DEATHADJ
- dadjdy
- dthcvadj
- dcvadjdy
- dthncadj
- dncadjdy
- hoshfadj
- cumhfhos
- endpoint-adjudication fields
- post-event values
- future visit data
- future treatment changes

These are outcome or leakage fields only.

---

## 21. FIELD-LEVEL EVIDENCE STATES

### LOCKED
- deidnum
- VISIT / VISITNDX for temporal support
- PBNPRSLT
- PBNPDT_DDY / PBNPDT_TDY
- HRVALUE
- BPSYS
- NYHACD
- CRTRSLT
- ARM
- endpoint fields

### LOCKED_CANDIDATE
- BPDIA
- CRHYTM
- LVEF / LVEFVAL
- METHLV
- DIABETES
- AF history fields
- HF etiology fields
- sodium / potassium / BUN
- medication fields

### PROVISIONAL
- SPO2
- smoking history
- event-related BNP/proBNP duplicates
- advanced derived treatment-intensity composites

### EXCLUDED_FIRST_PASS
- GLS
- any undocumented variable
- any field lacking reproducible temporal provenance

---

## 22. MISSINGNESS GATE

No exact field is promoted from LOCKED_CANDIDATE to final active model field until patient-level data review establishes:

- completeness
- temporal density
- unit consistency
- join integrity
- reasonable missingness

The feature dictionary is structurally locked but still subject to data-completeness pruning.

---

## 23. NEXT DETERMINISTIC ARTIFACT

**CARDIAC_MISSINGNESS_TEMPORAL_DENSITY_AND_SAMPLE_SIZE_PLAN_v1**

Must define:

1. per-field missingness thresholds
2. repeated-measure density thresholds
3. minimum observations required for slope/acceleration
4. canonical duplicate-field resolution
5. event-free sample after exclusions
6. effective event count
7. complexity / degrees-of-freedom budget
8. temporal split rule
9. site sensitivity plan
10. minimum meaningful effect threshold strategy

---

## FINAL STATE

**EXACT PUBLIC FIELD MAPPING = LOCKED_FIRST_PASS**  
**MODEL A FIELD SET = LOCKED_FIRST_PASS**  
**MODEL B STRUCTURE = LOCKED**  
**MODEL C FEATURE FAMILY = LOCKED**  
**MODEL D LATENT MAPPING = LOCKED_FIRST_PASS AS MODELING HYPOTHESIS**  
**OUTCOME/LEAKAGE FIELD EXCLUSIONS = LOCKED**  
**GLS = EXCLUDED_FIRST_PASS**  
**PATIENT_LEVEL COMPLETENESS PRUNING = PENDING**  
**CONFIRMATORY FITTING = NOT YET AUTHORIZED**
