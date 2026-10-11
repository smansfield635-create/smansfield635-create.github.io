# GUIDE_IT_PATIENT_LEVEL_DATA_INTAKE_SPEC_v1

**Mode:** Epistemic-control-plane governed data intake contract  
**Status:** LOCKED_FOR_DATA_RECEIPT · PATIENT_LEVEL_DATA_NOT_YET_INGESTED  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Candidate dataset:** GUIDE-IT  
**Purpose:** Define the exact patient-level data ingestion contract so that provenance, joins, units, timing, missingness, exclusions, and leakage controls are verified before any modeling occurs.

---

## 1. INTAKE PRINCIPLE

Patient-level data are not considered model-ready on receipt.

They must pass:

1. provenance verification,
2. table inventory,
3. schema reconciliation,
4. identifier / join validation,
5. unit normalization,
6. temporal normalization,
7. outcome-field isolation,
8. missingness profiling,
9. temporal-density profiling,
10. exclusion-cascade accounting,
11. leakage review,
12. integrity receipt generation.

Only then may a modeling dataset be constructed.

---

## 2. EXPECTED SOURCE TABLE FAMILIES

Based on the GUIDE-IT public data dictionary, intake should expect some or all of the following logical table families:

- participant / baseline demographics
- randomization / treatment arm
- repeat visits
- NT-proBNP / BNP
- examination / vital signs
- laboratory results
- LVEF / cardiac function
- medications / therapy adjustments
- adjudicated endpoints
- hospitalization / recurrent-event records

Exact filenames may vary by delivered archive.

No table is assumed present until verified.

---

## 3. REQUIRED PROVENANCE RECEIPT

For the delivered dataset record:

- source organization
- study name
- data-release version/date
- request or accession identifier if applicable
- delivery date
- archive filename
- archive checksum
- extracted file list
- file sizes
- file checksums
- data-use agreement / restrictions
- codebook version
- protocol version
- dictionary version

### Rule

No downstream derivative dataset may lose traceability to the original delivered source files.

---

## 4. ARCHIVE INTEGRITY

On receipt:

1. compute checksum for original archive
2. preserve archive read-only
3. extract to versioned intake directory
4. compute checksum for every extracted file
5. generate immutable manifest

Suggested manifest fields:

- relative_path
- bytes
- checksum_algorithm
- checksum
- created_at
- source_archive_checksum

---

## 5. IDENTIFIER / JOIN KEY CONTRACT

Primary candidate patient identifier:

**deidnum**

Support keys may include:

- VISIT
- VISITNDX
- study-day / visit-day fields

### Required checks

- uniqueness where uniqueness is expected
- duplicate-key report
- orphan-record report
- one-to-many / many-to-many join detection
- patient count before and after every join
- row count before and after every join

### Hard stop

Any unexplained many-to-many join expansion stops intake.

---

## 6. FIELD WHITELIST

Only fields already admitted by the feature dictionary or required for provenance / joining may enter the working analysis layer.

### Core admitted categories

- identifiers
- visit / timing support
- treatment arm
- demographics
- NT-proBNP
- blood pressure
- heart rate
- NYHA class
- creatinine
- selected renal/electrolyte labs
- LVEF
- selected medications / treatment adjustments
- prespecified comorbidities
- endpoint fields reserved for outcome layer only

Any new field requires explicit amendment and evidence-state assignment.

---

## 7. OUTCOME BLACKLIST

The following fields are prohibited from predictor construction and must be isolated into the outcome-only layer:

- dthhfadj
- dhfadjdy
- dthhf30
- dthhf90
- dthcvadj
- dcvadjdy
- dthncadj
- dncadjdy
- hoshfadj
- cumhfhos
- DEATHADJ
- dadjdy
- recurrent-event outcome counts where they occur after index
- adjudication-derived outcome fields
- post-event outcome summaries

### Rule

Outcome-layer tables must not be merged into predictor tables until after predictor features are frozen for each index time.

---

## 8. TIME NORMALIZATION CONTRACT

All time variables must be normalized to a common study-time axis.

Preferred representation:

**days from randomization**

For every time-bearing field record:

- raw field name
- raw value
- source table
- normalized study day
- transformation rule

### Hard rules

- no calendar-date leakage
- no post-index values in predictors
- no future-treatment values in predictors
- no future-lab values in predictors
- no future-visit count in predictors

---

## 9. INDEX-TIME CONSTRUCTION

Each candidate index time must be generated from allowed predeclared visit points.

For each patient/index instance store:

- patient_id
- index_day
- index_visit
- alive_at_index
- endpoint_free_at_index
- followup_available
- eligible_for_prediction

### Exclude if

- primary endpoint occurred before index
- patient already censored
- no follow-up after index
- index time cannot be reconciled

---

## 10. UNIT RECONCILIATION

For every continuous clinical field:

- source variable
- source unit
- canonical unit
- conversion formula
- valid physiological range
- outlier flag rule

### Minimum unit checks

- NT-proBNP / BNP
- creatinine
- sodium
- potassium
- BUN / urea
- blood pressure
- heart rate
- LVEF

### Hard stop

A field with unresolved unit ambiguity may not enter modeling.

---

## 11. RANGE / PLAUSIBILITY CHECKS

Each clinical field must receive:

- min
- max
- median
- quartiles
- count outside plausible range
- count converted
- count excluded
- count set missing

Outlier handling must be prespecified and cannot be chosen after model-performance inspection.

---

## 12. DUPLICATE REPRESENTATION RESOLUTION

For each duplicate clinical construct, generate a reconciliation table.

Examples:

### Creatinine
- CRTRSLT
- CREAT / CREATVAL

### Sodium
- sodrslt
- SODIUM / SODVAL

### Potassium
- POTRSLT
- POTASS / POTVAL

### LVEF
- LVEF
- LVEFVAL
- efcontb
- other derived LVEF representations

### Required output

- overlap count
- agreement rate
- unit agreement
- missingness difference
- selected canonical field
- exclusion rationale for alternates

---

## 13. MISSINGNESS REPORT

For every admitted field compute:

- overall missing %
- missing % by visit
- missing % by treatment arm
- missing % by site
- missing % by calendar period / enrollment period
- patients with >=1 measure
- patients with >=2 measures
- patients with >=3 measures
- median measures/patient
- IQR measures/patient

Output:
**GUIDE_IT_MISSINGNESS_REPORT_v1**

---

## 14. TEMPORAL-DENSITY REPORT

For repeatedly measured variables compute:

- number of observations per patient
- median interval between observations
- IQR interval
- minimum interval
- maximum interval
- proportion meeting slope eligibility
- proportion meeting acceleration eligibility
- proportion meeting rolling-dispersion eligibility

Output:
**GUIDE_IT_TEMPORAL_DENSITY_REPORT_v1**

---

## 15. INFORMATIVE-SAMPLING REPORT

Required:

- visit count distribution
- NT-proBNP measurement count distribution
- treatment-adjustment visit frequency
- time since previous visit
- time since previous biomarker measure
- correlation between visit frequency and endpoint incidence
- correlation between treatment-adjustment visits and endpoint incidence

Purpose:
Detect whether care intensity itself is becoming a dominant predictive signal.

Output:
**GUIDE_IT_INFORMATIVE_SAMPLING_REPORT_v1**

---

## 16. ENDPOINT RECONCILIATION

Validate:

- event indicator consistency
- event-day consistency
- component-event consistency
- competing-death consistency
- 30-day indicator consistency
- 90-day indicator consistency

Required counts:

- total primary composite events
- HF hospitalization first events
- CV deaths
- non-CV deaths
- recurrent HF hospitalizations
- censored patients

Public benchmark:
approximately 328 primary composite events total before analytic exclusions.

Major discrepancy requires stop and reconciliation.

---

## 17. EXCLUSION CASCADE

Every intake run must produce:

1. source N
2. randomized N
3. endpoint-available N
4. baseline-index eligible N
5. longitudinally eligible N
6. core-feature eligible N
7. common-cohort eligible N
8. final development N
9. final temporal-validation N
10. retained primary events in each partition

Output:
**GUIDE_IT_EXCLUSION_CASCADE_v1**

No silent row loss.

---

## 18. TEMPORAL SPLIT INTAKE PREP

Before choosing the split:

- order patients by enrollment/randomization date
- quantify N by chronology
- quantify events by chronology
- quantify site distribution by chronology
- quantify treatment-arm balance by chronology
- quantify repeated-measure density by chronology

The split date remains unlocked until these receipts exist.

---

## 19. SITE DISTRIBUTION INTAKE

Produce:

- patients/site
- events/site
- treatment-arm balance/site
- median visits/site
- key-variable missingness/site

If site identifier is not available in the delivered dataset:
- record as unavailable
- do not invent site-level validation.

---

## 20. PATIENT-LEVEL DATA SAFETY

Repository rule:

- do not commit raw patient-level data to the public website repository
- do not commit row-level protected or restricted data
- only commit schemas, synthetic examples, aggregate receipts, code, and non-sensitive summaries unless data-use terms explicitly allow otherwise

Raw restricted data must remain in an approved access-controlled environment.

---

## 21. DERIVED DATA LAYERS

Recommended pipeline:

### L0 — RAW
Read-only delivered files.

### L1 — NORMALIZED
Units, names, timing harmonized.

### L2 — ELIGIBILITY
Index-time and event-free status.

### L3 — FEATURES
Pre-index snapshot / longitudinal / latent candidate features.

### L4 — OUTCOMES
Outcome labels and event-time data kept logically isolated.

### L5 — MODEL_MATRIX
Joined only after feature freeze for each index instance.

---

## 22. NO-LEAKAGE ASSERTIONS

Before modeling, machine-check and document:

- no post-index predictor timestamps
- no post-event predictor values
- no outcome fields in predictor namespace
- no future medication values
- no future visit-density counts
- no validation-derived scaling
- no cross-partition patient duplication

Output:
**GUIDE_IT_NO_LEAKAGE_RECEIPT_v1**

Any failed assertion blocks modeling.

---

## 23. INTAKE PASS CRITERIA

Patient-level intake passes only if:

- provenance complete
- archive checksums recorded
- joins reconciled
- units reconciled
- endpoint counts reconciled
- missingness report complete
- temporal-density report complete
- exclusion cascade complete
- leakage checks pass
- no unresolved hard-stop issue remains

---

## 24. INTAKE FAIL CONDITIONS

Fail intake if:

- provenance cannot be verified
- key tables cannot be joined reproducibly
- endpoint fields are inconsistent
- unit ambiguity remains unresolved
- unexpected row multiplication occurs
- outcome leakage is detected
- missingness prevents a credible comparator
- longitudinal density is insufficient for Models C/D
- patient-level use violates access terms

---

## 25. REQUIRED OUTPUT PACKAGE

On patient-level data receipt, generate:

1. SOURCE_MANIFEST
2. TABLE_INVENTORY
3. SCHEMA_REPORT
4. JOIN_INTEGRITY_REPORT
5. UNIT_RECONCILIATION_REPORT
6. DUPLICATE_FIELD_RECONCILIATION
7. MISSINGNESS_REPORT
8. TEMPORAL_DENSITY_REPORT
9. INFORMATIVE_SAMPLING_REPORT
10. ENDPOINT_RECONCILIATION
11. EXCLUSION_CASCADE
12. TEMPORAL_SPLIT_FEASIBILITY
13. SITE_DISTRIBUTION_REPORT
14. NO_LEAKAGE_RECEIPT
15. INTAKE_PASS_FAIL_RECEIPT

---

## 26. NEXT DETERMINISTIC ARTIFACT

If patient-level data are not yet accessible:

**GUIDE_IT_ACCESS_AND_DATA_REQUEST_PACKET_v1**

If patient-level data are received:

**GUIDE_IT_PATIENT_LEVEL_INTAKE_EXECUTION_v1**

No modeling branch is authorized until the intake package passes.

---

## FINAL STATE

**DATA INTAKE CONTRACT = LOCKED**  
**FIELD WHITELIST = LOCKED**  
**OUTCOME BLACKLIST = LOCKED**  
**JOIN GOVERNANCE = LOCKED**  
**UNIT GOVERNANCE = LOCKED**  
**TEMPORAL GOVERNANCE = LOCKED**  
**NO-LEAKAGE ASSERTIONS = LOCKED**  
**RAW PATIENT DATA PUBLIC-COMMIT PROHIBITION = LOCKED**  
**PATIENT_LEVEL_DATA = NOT YET INGESTED**  
**MODELING = NOT AUTHORIZED**
