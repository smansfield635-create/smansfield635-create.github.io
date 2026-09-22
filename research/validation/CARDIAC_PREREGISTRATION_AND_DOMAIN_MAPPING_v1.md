# CARDIAC_PREREGISTRATION_AND_DOMAIN_MAPPING_v1

**Mode:** Epistemic-control-plane governed preregistration scaffold  
**Status:** PRECONFIRMATORY / NOT YET OUTCOME-LOCKED  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Purpose:** Define the first admissible domain mapping and prospective validation contract before confirmatory outcome analysis.

---

## 1. PRIMARY RESEARCH QUESTION

Can a predefined multivariate cardiovascular state-and-trajectory model identify clinically meaningful deterioration, stability, and recovery beyond:

1. the latest observation alone,
2. conventional clinical variables / accepted risk models,
3. ordinary longitudinal features that do not use the proposed architecture?

The proposed architecture is not granted value by design coherence. It must demonstrate reproducible incremental predictive utility.

---

## 2. HYPOTHESIS SET

### H1 — Trajectory hypothesis
Longitudinal cardiovascular trajectories contain predictive information beyond isolated measurements.

**State:** MODELING_HYPOTHESIS

### H2 — Architecture hypothesis
A predefined multidimensional state-and-trajectory representation adds useful predictive information beyond conventional clinical baselines and ordinary longitudinal modeling.

**State:** MODELING_HYPOTHESIS

### H3 — Recovery-state hypothesis
Predefined recovery trajectories contain reproducible information distinguishable from deterioration trajectories.

**State:** MODELING_HYPOTHESIS

### H4 — Universality
No universality hypothesis is tested in this Phase II cardiac protocol.

**State:** QUARANTINED_HYPOTHESIS

---

## 3. UNIT OF ANALYSIS

Primary unit:
- patient-level longitudinal cardiovascular record

Candidate observation unit:
- timestamped clinical measurement event

Candidate modeling unit:
- predefined longitudinal window ending at an index time

Final unit definitions must be locked before confirmatory analysis.

---

## 4. POPULATION DEFINITION — REQUIRED LOCKS

The confirmatory protocol must explicitly define:

- age range
- inpatient / outpatient / mixed setting
- cardiovascular diagnosis requirements, if any
- baseline ventricular function requirements, if any
- minimum follow-up duration
- minimum number of longitudinal observations
- inclusion of device-supported patients
- pregnancy handling
- transplant status
- mechanical circulatory support status
- acute coronary syndrome handling
- congenital heart disease handling
- severe renal disease handling
- active malignancy handling

No subgroup may be introduced post hoc and treated as confirmatory.

---

## 5. CANDIDATE DOMAIN VARIABLES

Candidate variables are not automatically canonical.

### A. Cardiac function
- global longitudinal strain (GLS)
- ejection fraction
- stroke volume
- cardiac output
- ventricular volumes
- wall-motion or remodeling indices where available

### B. Hemodynamic state
- systolic blood pressure
- diastolic blood pressure
- mean arterial pressure
- resting heart rate
- pulse pressure
- orthostatic measures where consistently available

### C. Biomarker state
- BNP
- NT-proBNP
- troponin
- additional clinically justified biomarkers where prespecified

### D. Autonomic / rhythm state
- heart-rate variability
- rhythm classification
- ectopy / arrhythmia burden where available

### E. Remodeling / structural state
- chamber dimensions
- ventricular mass
- atrial size
- other standardized imaging indices

### F. Recovery / functional state
- return toward prior functional baseline
- reduction in biomarker burden
- improvement in imaging measures
- improved hemodynamic stability

### G. Covariates for fair comparison
As needed:
- age
- sex
- major comorbidities
- medications
- renal function
- diabetes status
- smoking status
- prior cardiovascular events
- relevant treatment changes

The comparator set must not be intentionally weakened.

---

## 6. LATENT-CONSTRUCT MAPPING

The prior terms "burden", "pressure", and "integrity" remain latent modeling constructs.

They must not be treated as physiological mechanisms.

### Burden
May only be operationalized from predefined measurable inputs.

Potential candidate classes:
- biomarker elevation
- structural abnormality
- accumulated comorbidity
- persistent functional impairment

### Pressure
May only be operationalized from predefined measurable stress/exposure variables.

Potential candidate classes:
- hemodynamic load
- rapid worsening
- acute event burden
- treatment escalation
- repeated instability events

### Functional integrity
May only be operationalized from predefined function/recovery measures.

Potential candidate classes:
- preserved ventricular performance
- stable hemodynamics
- recovery trajectory
- maintained autonomic / rhythm stability

### Governance rule
No latent construct may be defined using outcome information from the future.

---

## 7. ENDPOINT CONTRACT

The term "collapse" is prohibited as a confirmatory endpoint.

One primary endpoint must be selected and locked before confirmatory outcome analysis.

Candidate endpoint classes:

- hospitalization for cardiovascular decompensation
- predefined hemodynamic decompensation
- major decline in ventricular function
- initiation of mechanical circulatory support
- cardiovascular mortality
- prospectively defined validated composite endpoint

Secondary endpoints may be included only if prespecified.

### Endpoint requirements

Each endpoint must define:
- event date
- adjudication rule
- competing-risk handling where applicable
- censoring rule
- recurrent-event handling
- composite-component hierarchy
- whether treatment escalation alone qualifies

---

## 8. PREDICTION HORIZON CONTRACT

At least one primary prediction horizon must be fixed before confirmatory analysis.

Candidate horizons:
- 30 days
- 90 days
- 6 months
- 1 year

Multiple horizons may be studied if:
- one is designated primary,
- multiplicity is handled,
- thresholds are not reoptimized independently after outcome inspection.

---

## 9. COMPARATOR MODELS — LOCKED ARCHITECTURE

### MODEL A — SNAPSHOT
Latest available observation only.

### MODEL B — CONVENTIONAL CLINICAL BASELINE
Established clinical variables and/or accepted risk model appropriate to the population and endpoint.

### MODEL C — ORDINARY LONGITUDINAL
Longitudinal / trajectory features without the proposed state/trajectory architecture.

### MODEL D — PROPOSED ARCHITECTURE
Predefined multidimensional state + trajectory representation.

### Central empirical requirement

Model D must demonstrate predefined meaningful incremental value beyond both Model B and Model C.

If it does not, the central architecture hypothesis is weakened or rejected.

---

## 10. DATA-SPLIT CONTRACT

Preferred order:

1. development cohort / period
2. temporal validation cohort / later period
3. external validation cohort / independent site or system

Random train/test splitting alone is insufficient for the strongest claim.

### Leakage prohibition

No information from temporal or external validation data may influence:
- feature selection
- threshold selection
- scaling
- imputation parameters
- calibration fitting
- model architecture
- endpoint definition

---

## 11. NORMALIZATION CONTRACT

Normalization rules must be specified before validation.

Requirements:
- fit on development data only
- freeze before temporal validation
- carry unchanged into external validation
- document unit conversions
- document outlier handling
- document winsorization, clipping, or transformation if used
- preserve clinically meaningful absolute scales where relevant

---

## 12. MISSING-DATA CONTRACT

Required:

- quantify missingness by variable and time
- distinguish structural absence from incidental missingness
- prohibit future-value leakage
- prespecify imputation method
- sensitivity-test alternative imputation choices
- report missingness indicators if modeled
- report performance after removing high-missingness variables where feasible

A model whose apparent advantage is materially driven by undocumented missingness structure fails governance review.

---

## 13. TEMPORAL-FEATURE CONTRACT

Candidate temporal features may include:

- slope
- velocity
- acceleration
- variance
- persistence
- recovery time
- excursion magnitude
- time-above-threshold
- time-below-threshold
- direction reversals
- rolling burden
- rolling stability
- change from personal baseline

All temporal features must be computed without peeking beyond the index time.

---

## 14. ABLATION PLAN

Required ablations:

1. remove burden construct
2. remove pressure construct
3. remove integrity construct
4. remove trajectory features
5. remove cross-domain-style composite architecture while retaining raw longitudinal variables
6. remove one variable family at a time:
   - imaging
   - biomarkers
   - hemodynamics
   - autonomic / rhythm
   - covariates

Questions:
- Does each component add independent information?
- Is complexity justified?
- Does performance persist without one high-signal variable family?

---

## 15. PERFORMANCE METRICS

Metrics must be matched to endpoint type.

Candidate domains:

### Discrimination
- AUROC
- AUPRC where event imbalance warrants

### Calibration
- calibration slope
- calibration intercept
- calibration curve
- Brier score

### Clinical / decision utility
- sensitivity / specificity at predeclared thresholds
- PPV / NPV where prevalence is appropriate
- decision-curve / net-benefit analysis where justified

### Reclassification
Only if prospectively justified and clinically interpretable.

### Rule
Statistical significance alone is insufficient.

---

## 16. MINIMUM MEANINGFUL EFFECT

A minimum meaningful incremental effect must be declared before confirmatory analysis.

This may be expressed in terms of:
- discrimination improvement
- calibration improvement
- error reduction
- net clinical benefit
- prospectively justified composite criterion

Thresholds must be selected before confirmatory outcome inspection.

---

## 17. CALIBRATION GOVERNANCE

A model with good discrimination but poor calibration does not qualify as a successful predictive system.

Calibration must be:
- measured in development
- rechecked in temporal validation
- rechecked externally
- reported without hiding subgroup failures

Any recalibration performed after development must be explicit and separately reported.

---

## 18. SUBGROUP GOVERNANCE

Prespecified subgroup analyses may include:

- sex
- age bands
- heart-failure phenotype
- renal-function strata
- diabetes status
- treatment class
- site / geography where available

Subgroup analyses are exploratory unless powered and declared confirmatory in advance.

No subgroup rescue may be used to convert an overall failed hypothesis into an overall success.

---

## 19. TEMPORAL VALIDATION GATE

Required before strong domain-validity language.

Success requires:
- preserved direction of effect
- acceptable discrimination
- acceptable calibration
- no material dependence on leakage or post hoc thresholding
- comparator advantage retained

Failure requires demotion of claim state.

---

## 20. EXTERNAL VALIDATION GATE

At least one independent cohort / site is required before transportability claims.

External validation must preserve:
- variable definitions
- preprocessing logic
- architecture
- thresholds where applicable
- outcome definition

Site-specific retraining must be separately classified from transportability.

---

## 21. REPLICATION GATE

Replication requires an independent repeat confirmation after the initial external validation.

Only after replication may the cardiac architecture be classified as:

**REPLICATED_IN_CARDIOVASCULAR_DOMAIN**

This still does not establish universality.

---

## 22. MECHANISM BOUNDARY

Predictive success does not establish mechanism.

Mechanistic elevation requires separate evidence linking latent constructs to biological pathways.

Causal elevation requires intervention-sensitive evidence.

Allowed states:
- PREDICTIVE_ASSOCIATION
- TEMPORALLY_VALIDATED
- EXTERNALLY_VALIDATED
- REPLICATED

Separate mechanistic states:
- MECHANISTIC_HYPOTHESIS
- MECHANISTIC_EVIDENCE

Separate causal state:
- CAUSAL_EVIDENCE

---

## 23. KILL CRITERIA

The cardiac architecture is downgraded or rejected if:

- Model D does not outperform Models B and C by the predefined meaningful threshold
- temporal validation materially fails
- external validation materially fails
- calibration is unacceptable
- ablation shows no architecture-specific value
- the signal depends on post hoc thresholds
- leakage is detected
- missing-data handling drives the result
- performance is unstable across clinically relevant populations without explanation
- replication fails

---

## 24. PHASE II RESULT CLASSES

Allowed outcome classes:

- **PREDICTIVE_SIGNAL_ABSENT**
- **PREDICTIVE_SIGNAL_PRESENT_NOT_INCREMENTAL**
- **INCREMENTAL_SIGNAL_DEVELOPMENT_ONLY**
- **INCREMENTAL_SIGNAL_TEMPORALLY_VALIDATED**
- **INCREMENTAL_SIGNAL_EXTERNALLY_VALIDATED**
- **INCREMENTAL_SIGNAL_REPLICATED**

No stronger classification is permitted without satisfying its gate.

---

## 25. CONSTRUCTION STATUS

### Locked now
- research question
- comparator architecture
- validation sequence
- evidence-state boundaries
- falsification logic
- ablation requirement
- domain-specific validation requirement
- universality quarantine

### Still open
- exact cohort
- exact primary endpoint
- exact prediction horizon
- exact variable inclusion list
- exact normalization method
- exact missing-data method
- exact meaningful-effect threshold
- exact conventional risk-model comparator
- external dataset/site
- sample-size/power plan

---

## 26. NEXT DETERMINISTIC INPUT

**CARDIAC_DATA_SOURCE_AND_ENDPOINT_SELECTION_v1**

Must specify:

1. available dataset / cohort
2. accessible variables
3. outcome availability
4. follow-up density
5. candidate primary endpoint
6. candidate prediction horizon
7. sample size
8. site count
9. missingness profile
10. comparator model availability

No confirmatory modeling should proceed before those items are locked.

---

## FINAL STATE

**CARDIAC DOMAIN MAPPING = FORMALIZED**  
**PREREGISTRATION SCAFFOLD = CREATED**  
**OUTCOME LOCK = PENDING**  
**DATA-SOURCE LOCK = PENDING**  
**EMPIRICAL VALIDATION = NOT STARTED**
