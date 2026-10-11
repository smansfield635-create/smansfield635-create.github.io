# CARDIAC_DATA_SOURCE_CANDIDATE_SURVEY_v1

**Mode:** Epistemic-control-plane governed candidate survey  
**Status:** CANDIDATE_SURVEY_COMPLETE · NO FINAL DATASET LOCK  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Purpose:** Compare real cardiac datasets/cohorts against the locked admissibility criteria before selecting the first proving-ground dataset.

---

## 1. SURVEY METHOD

Candidate sources were evaluated against the existing gate:

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

A source with a hard FAIL on endpoint validity, temporal integrity, or lawful usability is not admissible for confirmatory use.

No source is declared final in this survey.

---

## 2. CANDIDATE A — MIMIC-IV + MIMIC-IV-ECHO

### Source identity

PhysioNet MIMIC-IV clinical database linked to MIMIC-IV-ECHO.

### Publicly documented strengths

- MIMIC-IV-ECHO contains structured echocardiographic measurements from 206,488 echocardiogram studies across 91,372 unique patients.
- Echocardiograms span 2008–2022.
- Structured measurements include chamber sizes and volumes, systolic and diastolic function, valvular measures, and Doppler-derived hemodynamics.
- MIMIC-IV-ECHO is linkable to MIMIC-IV clinical data, enabling multimodal longitudinal clinical analyses.
- Credentialed access is required.

### Potential fit

Strong for:
- imaging-rich state modeling
- repeated echo observations in a subset
- hemodynamic and structural variables
- hospitalization / inpatient outcome derivation
- temporal prediction
- large sample size

Potential limitations:
- highly clinical/inpatient population
- some candidate variables such as GLS may require report parsing or may not be uniformly present
- longitudinal density varies substantially by patient
- endpoint design would need careful avoidance of treatment / encounter leakage

### Admissibility screen

- longitudinal density: PASS / VARIABLE BY PATIENT
- endpoint quality: PASS
- comparator fairness: PASS
- variable coverage: PASS
- missingness burden: PARTIAL / REQUIRES PROFILING
- temporal integrity: PASS WITH STRICT INDEXING
- external-validation potential: PASS
- legal / governance usability: PASS WITH CREDENTIALED ACCESS
- reproducibility: PASS
- sample-size adequacy: PASS

### Provisional classification

**HIGH-PRIORITY CANDIDATE**

---

## 3. CANDIDATE B — GUIDE-IT

### Source identity

NHLBI BioLINCC: Guiding Evidence Based Therapy Using Biomarker Intensified Treatment in Heart Failure.

### Publicly documented strengths

- high-risk HFrEF cohort
- NT-proBNP measured at each study visit in a core laboratory
- primary endpoint: time to first heart-failure hospitalization or cardiovascular mortality
- median follow-up approximately 15 months
- study protocol, operations manual, forms, and data dictionary available
- trial was stopped for prespecified inefficacy of the biomarker-guided treatment strategy

### Potential fit

Strong for:
- repeated biomarker trajectory modeling
- predefined hard heart-failure endpoint
- direct testing of longitudinal biomarker state
- clean comparator architecture

Potential limitations:
- narrower disease population
- smaller sample than large EHR datasets
- may not provide the full imaging / HRV / hemodynamic variable spectrum
- trial design and treatment assignment require careful covariate handling

### Admissibility screen

- longitudinal density: PASS
- endpoint quality: PASS
- comparator fairness: PASS
- variable coverage: PARTIAL
- missingness burden: REQUIRES DATA-DICTIONARY / DATA PROFILE
- temporal integrity: PASS
- external-validation potential: PASS IF PAIRED WITH INDEPENDENT SOURCE
- legal / governance usability: PASS SUBJECT TO BIOLINCC ACCESS TERMS
- reproducibility: PASS
- sample-size adequacy: LIKELY PASS FOR BOUNDED MODELS / REQUIRES EVENT COUNT CONFIRMATION

### Provisional classification

**HIGH-PRIORITY CANDIDATE FOR CLEAN FIRST TEST**

---

## 4. CANDIDATE C — HF-ACTION

### Source identity

NHLBI BioLINCC: Heart Failure — A Controlled Trial Investigating Outcomes of Exercise Training.

### Publicly documented strengths

- heart-failure cohort with left ventricular systolic dysfunction
- repeated clinic visits every 3 months for the first 2 years and yearly thereafter up to 4 years
- repeated functional assessments including cardiopulmonary exercise testing and 6-minute walk testing
- primary endpoint: all-cause mortality or all-cause hospitalization
- secondary endpoints include cardiovascular mortality / hospitalization and cardiovascular mortality / heart-failure hospitalization

### Potential fit

Strong for:
- rich longitudinal functional trajectories
- longer follow-up
- repeated clinical measurements
- hard outcomes
- recovery / deterioration modeling

Potential limitations:
- not centered on the full candidate biomarker / echo set
- exercise intervention adds treatment-trajectory complexity
- endpoint hierarchy must be selected carefully

### Admissibility screen

- longitudinal density: PASS
- endpoint quality: PASS
- comparator fairness: PASS
- variable coverage: PASS FOR FUNCTIONAL TRACK / PARTIAL FOR FULL CARDIAC VECTOR
- missingness burden: REQUIRES PROFILE
- temporal integrity: PASS
- external-validation potential: PASS
- legal / governance usability: PASS SUBJECT TO BIOLINCC TERMS
- reproducibility: PASS
- sample-size adequacy: LIKELY PASS / REQUIRES EVENT COUNT CONFIRMATION

### Provisional classification

**HIGH-PRIORITY CANDIDATE FOR TRAJECTORY / RECOVERY TESTING**

---

## 5. CANDIDATE D — JACKSON HEART STUDY

### Source identity

NHLBI BioLINCC: Jackson Heart Study.

### Publicly documented strengths

- visit-based longitudinal examinations
- annual follow-up communications
- mortality, heart-disease, and stroke event follow-up
- baseline plus follow-up examination cycles
- population-based epidemiology design

### Potential fit

Strong for:
- long-horizon cardiovascular risk trajectories
- repeated epidemiologic measurements
- event follow-up
- external validation against more acute clinical cohorts

Potential limitations:
- lower-frequency measurement than hospital EHR / trial datasets
- may be less suited to short-horizon decompensation prediction
- commercial-use and area-of-research restrictions are tiered

### Admissibility screen

- longitudinal density: PARTIAL
- endpoint quality: PASS
- comparator fairness: PASS
- variable coverage: PASS FOR EPIDEMIOLOGIC TRACK / PARTIAL FOR ACUTE PHYSIOLOGY
- missingness burden: REQUIRES PROFILE
- temporal integrity: PASS
- external-validation potential: PASS
- legal / governance usability: PARTIAL / ACCESS RESTRICTIONS
- reproducibility: PASS
- sample-size adequacy: PASS

### Provisional classification

**SECONDARY / EXTERNAL-VALIDATION CANDIDATE**

---

## 6. CANDIDATE E — FRAMINGHAM HEART STUDY, THIRD GENERATION / RELATED COHORTS

### Source identity

NHLBI BioLINCC: Framingham Heart Study Third Generation, OMNI 2, and New Offspring cohorts.

### Publicly documented strengths

- repeated examination cycles
- blood pressure, ECG, laboratory measurements
- adjudicated cardiovascular events
- cardiovascular outcomes include coronary disease, stroke, hypertension, peripheral arterial disease, and congestive heart failure

### Potential fit

Strong for:
- long-horizon trajectory modeling
- conventional risk comparator construction
- external replication
- population-level validation

Potential limitations:
- lower temporal density than acute-care sources
- less suitable for near-term decompensation prediction
- variable availability differs from richer inpatient and heart-failure trial sources

### Admissibility screen

- longitudinal density: PARTIAL
- endpoint quality: PASS
- comparator fairness: PASS
- variable coverage: PASS FOR RISK / PARTIAL FOR FULL STATE VECTOR
- missingness burden: REQUIRES PROFILE
- temporal integrity: PASS
- external-validation potential: PASS
- legal / governance usability: PASS SUBJECT TO ACCESS TERMS
- reproducibility: PASS
- sample-size adequacy: PASS

### Provisional classification

**SECONDARY / EXTERNAL-VALIDATION CANDIDATE**

---

## 7. CANDIDATE F — DIGITALIS INVESTIGATION GROUP (DIG)

### Source identity

NHLBI BioLINCC: Digitalis Investigation Group.

### Publicly documented strengths

- 7,788 heart-failure patients
- multicenter clinical trial across 302 centers
- mortality and hospitalization outcomes
- no commercial-use restriction listed on BioLINCC page

### Potential fit

Strong for:
- hard outcome modeling
- multicenter external validation
- conventional heart-failure comparator work

Potential limitations:
- older study era
- candidate trajectory-variable richness may be limited
- temporal measurement density requires confirmation from data dictionary

### Admissibility screen

- longitudinal density: PARTIAL / REQUIRES CONFIRMATION
- endpoint quality: PASS
- comparator fairness: PASS
- variable coverage: PARTIAL
- missingness burden: REQUIRES PROFILE
- temporal integrity: PASS
- external-validation potential: PASS
- legal / governance usability: PASS
- reproducibility: PASS
- sample-size adequacy: PASS

### Provisional classification

**SECONDARY / EXTERNAL-VALIDATION CANDIDATE**

---

## 8. CANDIDATE COMPARISON

| Candidate | Best use | Main strength | Main limitation | Provisional rank |
|---|---|---|---|---|
| MIMIC-IV + ECHO | broad multimodal development | scale + echo + clinical linkage | heterogeneous density / inpatient bias | HIGH |
| GUIDE-IT | clean first longitudinal HF test | repeated NT-proBNP + hard HF endpoint | narrower variable spectrum | HIGH |
| HF-ACTION | trajectory / recovery testing | repeated longitudinal functional measures | intervention complexity | HIGH |
| JHS | population external validation | longitudinal events + epidemiology | lower temporal density | SECONDARY |
| Framingham Gen III | population risk / replication | established event structure | lower temporal density | SECONDARY |
| DIG | multicenter hard-outcome validation | size + mortality/hospitalization | older era / variable depth | SECONDARY |

---

## 9. SURVEY DECISION

No dataset is yet formally locked.

However, the survey identifies three distinct high-value roles:

### ROLE A — CLEAN FIRST TEST
**GUIDE-IT**

Reason:
- repeated NT-proBNP
- explicit heart-failure hospitalization / cardiovascular mortality endpoint
- relatively clean longitudinal test of trajectory value

### ROLE B — BROAD MULTIMODAL DEVELOPMENT
**MIMIC-IV + MIMIC-IV-ECHO**

Reason:
- large scale
- imaging-rich structure
- clinical linkage
- supports broader state-vector development

### ROLE C — RECOVERY / FUNCTIONAL TRAJECTORY TEST
**HF-ACTION**

Reason:
- repeated functional follow-up
- longer trajectory structure
- hard clinical endpoints

---

## 10. PROVISIONAL SEQUENCE

Recommended research sequence:

1. **GUIDE-IT**
   - first clean test of longitudinal state/trajectory value

2. **MIMIC-IV + MIMIC-IV-ECHO**
   - larger multimodal development and stress test

3. **HF-ACTION**
   - trajectory / recovery replication

4. **JHS / Framingham / DIG**
   - external transportability / replication depending endpoint and variable compatibility

This is a research-sequencing recommendation, not a final data lock.

---

## 11. ENDPOINT CANDIDATE FROM SURVEY

For the first clean test, the strongest already-defined candidate endpoint is:

**time to first heart-failure hospitalization or cardiovascular mortality**

Source:
GUIDE-IT

Reason:
- hard clinical outcome
- prospectively defined in the original study
- clinically meaningful
- suitable for time-to-event modeling
- directly compatible with longitudinal NT-proBNP trajectories

**ENDPOINT_LOCK = NOT YET FINAL**

The exact confirmatory endpoint remains gated until:
- GUIDE-IT variable availability is reviewed,
- event count is confirmed,
- missingness is profiled,
- comparator feasibility is confirmed.

---

## 12. HORIZON CANDIDATE

No horizon is locked.

GUIDE-IT follow-up and event density must be inspected before selecting:
- fixed-horizon prediction, or
- time-to-event modeling.

Do not force a 30-day / 90-day / 6-month / 1-year horizon before data feasibility is established.

---

## 13. NEXT DETERMINISTIC ARTIFACT

**GUIDE_IT_DATA_DICTIONARY_AND_FEASIBILITY_AUDIT_v1**

Required outputs:

1. exact N
2. exact event count
3. exact NT-proBNP visit structure
4. available imaging variables
5. available hemodynamic variables
6. available medication / treatment variables
7. missingness by key variable
8. follow-up structure
9. Model B comparator feasibility
10. temporal split feasibility
11. endpoint adjudication details
12. access / use restrictions

If GUIDE-IT fails feasibility, proceed to:

**MIMIC_IV_ECHO_FEASIBILITY_AUDIT_v1**

---

## FINAL STATE

**CANDIDATE SURVEY = COMPLETE**  
**HIGH-PRIORITY SOURCES = IDENTIFIED**  
**FINAL DATASET LOCK = PENDING**  
**PRIMARY ENDPOINT LOCK = PENDING**  
**NEXT GATE = GUIDE_IT FEASIBILITY AUDIT**
