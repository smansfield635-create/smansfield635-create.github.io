# CARDIAC_ENDPOINT_HORIZON_LOCK_v1

**Mode:** Epistemic-control-plane governed lock  
**Status:** LOCKED_FOR_FIRST_CONFIRMATORY_DESIGN  
**Program:** Multidomain State / Trajectory Validation Framework  
**Domain:** Cardiovascular  
**Dataset candidate:** GUIDE-IT  
**Purpose:** Freeze the primary endpoint, analysis mode, index-time logic, censoring rules, recurrent-event treatment, competing-risk posture, and treatment-arm handling for the first confirmatory design.

---

## 1. PRIMARY ENDPOINT — LOCKED

**PRIMARY_ENDPOINT = time to first adjudicated heart-failure hospitalization or cardiovascular mortality**

Rationale:
- clinically meaningful
- original GUIDE-IT primary endpoint
- adjudicated
- 328 documented primary endpoint events
- suitable for longitudinal prediction
- preserves hard clinical outcomes

The generic term **collapse** is not used as the confirmatory endpoint.

---

## 2. PRIMARY ANALYSIS MODE — LOCKED

**PRIMARY_ANALYSIS_MODE = time-to-event**

Reason:
- preserves event timing
- handles censoring
- avoids arbitrary compression into a single fixed horizon
- aligns with the original endpoint structure

The first confirmatory model should therefore be evaluated in a survival-analysis framework appropriate to the final model class.

---

## 3. SECONDARY FIXED HORIZONS — LOCKED

Secondary analyses:

- **30 days**
- **90 days**

These are secondary, not co-primary.

Any additional fixed horizons require explicit amendment before confirmatory analysis.

---

## 4. INDEX-TIME CONTRACT — LOCKED

Each prediction instance must be anchored at a clearly defined **INDEX_TIME**.

Allowed index times:

- baseline
- prespecified follow-up visits
- other protocol-defined visits only if included in the locked analysis plan

At each index time:
- only information available at or before that time may be used
- no post-index measurements may enter features
- no endpoint-adjudication information may enter features
- no future treatment changes may enter features

---

## 5. EVENT-FREE ELIGIBILITY AT INDEX — LOCKED

For prediction at a given index time:

A participant must be:
- alive,
- free of the primary endpoint,
- still under observation,
- not already censored.

Participants who already experienced the primary endpoint before an index time are not eligible for a new primary-event prediction instance after that event.

---

## 6. CENSORING CONVENTION — LOCKED

Primary censoring occurs at the earliest of:

- last known follow-up,
- administrative end of follow-up,
- withdrawal/loss to follow-up where applicable,
- non-cardiovascular death if treated as a competing event under the final survival model.

Exact dates must come from patient-level data.

No imputed event dates are permitted for the primary endpoint.

---

## 7. COMPETING-RISK POSTURE — LOCKED

Because the primary composite includes cardiovascular mortality, non-cardiovascular death can preclude future HF hospitalization.

Therefore:

**NON_CV_DEATH = COMPETING EVENT FOR HF_HOSPITALIZATION COMPONENT**

For the composite primary endpoint, analysis may use standard cause-specific or subdistribution approaches as appropriate, but the choice must be specified before model fitting.

The same competing-risk treatment must be applied consistently across Models A–D.

---

## 8. RECURRENT EVENTS — LOCKED AS SECONDARY

The primary endpoint uses **time to first event only**.

Recurrent HF hospitalization / recurrent CV hospitalization analyses are:

**SECONDARY_EXPLORATORY_OR_SECONDARY_CONFIRMATORY_ONLY_IF_SEPARATELY_PREDECLARED**

They do not replace the primary endpoint.

---

## 9. TREATMENT ARM — LOCKED HANDLING

GUIDE-IT treatment assignment must not be ignored.

Minimum handling:

1. include randomized treatment arm as a covariate in Models B–D,
2. report treatment-arm interaction with Model D score / architecture output,
3. perform stratified sensitivity analysis by treatment arm,
4. account for time-varying treatment adjustments where the model includes longitudinal treatment data.

Treatment arm must not be used as a post hoc rescue explanation for failed overall performance.

---

## 10. INFORMATIVE-SAMPLING CONTROL — LOCKED

Because therapy adjustment can trigger extra follow-up visits, visit density may encode worsening condition or treatment intensity.

Sensitivity variables must include where available:

- number of prior visits
- time since previous visit
- whether visit followed a treatment adjustment
- measurement count to date

A model that derives most of its signal from visit frequency rather than physiology must be identified as such.

---

## 11. MODEL-COMPARATOR FAIRNESS — LOCKED

The same endpoint definition, index-time logic, censoring convention, competing-risk posture, and treatment-arm handling must apply to:

- Model A
- Model B
- Model C
- Model D

No model receives privileged preprocessing or endpoint information.

---

## 12. PRIMARY PERFORMANCE DOMAINS — LOCKED

At minimum, primary evaluation must report:

### Discrimination
- time-dependent discrimination metric appropriate to the model

### Calibration
- calibration slope
- calibration intercept
- calibration curve
- Brier-type prediction error where appropriate

### Incremental utility
Model D must demonstrate predefined useful improvement over:
- Model B
- Model C

Statistical significance alone is insufficient.

---

## 13. SECONDARY 30-DAY / 90-DAY ANALYSES

For fixed-horizon analyses:

- define event as occurrence of the primary composite within horizon
- use only information available at index time
- handle censoring consistently
- report horizon-specific discrimination and calibration
- do not retune thresholds separately after inspecting outcomes

---

## 14. PRIMARY KILL RULE — LOCKED

The central architecture claim fails for GUIDE-IT if:

**Model D does not reproducibly demonstrate a predefined meaningful improvement over both Model B and Model C under the locked primary endpoint and analysis contract.**

This remains true even if Model D:
- outperforms Model A,
- has statistically significant coefficients,
- produces visually compelling trajectories.

---

## 15. WHAT IS NOW LOCKED

- primary endpoint
- primary analysis mode
- secondary fixed horizons
- index-time rule
- event-free eligibility
- censoring convention
- recurrent-event role
- competing-risk posture
- treatment-arm handling
- informative-sampling sensitivity requirement
- comparator fairness
- primary kill rule

---

## 16. WHAT REMAINS OPEN

Still requires patient-level data or final modeling design:

- exact cause-specific vs subdistribution competing-risk implementation
- exact time-dependent discrimination metric
- exact calibration estimator
- exact minimum meaningful effect threshold
- exact index-time schedule used in the final analysis
- exact missing-data method
- exact Model B specification
- exact Model C feature set
- exact Model D mapping
- exact development / temporal split

---

## 17. NEXT DETERMINISTIC ARTIFACT

**CARDIAC_MODEL_ABCD_SPECIFICATION_v1**

Must define:

### Model A
exact snapshot variables

### Model B
exact conventional clinical comparator

### Model C
exact ordinary longitudinal features

### Model D
exact proposed architecture features / latent mappings

And for all models:

- feature provenance
- preprocessing
- degrees-of-freedom / complexity limits
- leakage guards
- treatment handling
- calibration strategy
- output scale

---

## FINAL STATE

**PRIMARY_ENDPOINT = LOCKED**  
**PRIMARY_MODE = TIME_TO_EVENT**  
**SECONDARY_HORIZONS = 30D, 90D**  
**INDEX_TIME_CONTRACT = LOCKED**  
**CENSORING = LOCKED**  
**RECURRENT_EVENTS = SECONDARY**  
**TREATMENT_ARM_HANDLING = LOCKED**  
**INFORMATIVE_SAMPLING_CONTROL = REQUIRED**  
**CONFIRMATORY MODELING = STILL GATED PENDING MODEL A/B/C/D SPECIFICATION AND PATIENT-LEVEL DATA REVIEW**
