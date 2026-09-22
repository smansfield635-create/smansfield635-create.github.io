# BASELINE_R1_PILOT_MEASUREMENT_INSTRUMENT_v1

**Mode:** Measurement instrument · Non-drift · Prospective lock  
**Program:** MASTER_NUTRITION_RESEARCH_ENGINEERING_PROGRAM_v1  
**Object:** OBJECT_B_BASELINE  
**Protocol authority:** BASELINE_R1_WATER_COMPARATOR_PILOT_PROTOCOL_v1  
**Status:** MEASUREMENT INSTRUMENT LOCKED · PRE-DATA  
**Date:** 2026-09-22

---

## 1. PURPOSE

Operationalize the R1-versus-350-mL-water crossover pilot into one reproducible participant/session record.

This instrument measures only the outcomes authorized by the pilot protocol. It does not add mechanisms, endpoints, ingredients, or R2 authority.

---

## 2. CONDITION CODES

Use masked analytic codes during collection:

- **Condition X**
- **Condition Y**

The condition-key file mapping X/Y to R1/water must be stored separately from the working analytic sheet where practical.

Crossover sequence:

- **XY**
- **YX**

Do not relabel conditions after data inspection.

---

## 3. PARTICIPANT MASTER RECORD

Record once per participant:

| Field | Entry |
|---|---|
| Participant code | |
| Consent completed | Yes / No |
| Eligibility screen completed | Yes / No |
| Eligible under frozen criteria | Yes / No |
| Clinician/safety review required | Yes / No |
| Required review completed | Yes / No / N/A |
| Randomized sequence | XY / YX |
| Standardized meal code | |
| Notes affecting eligibility | |

No analyzable dosing session proceeds if required consent, eligibility, or safety review is incomplete.

---

## 4. SESSION HEADER

Complete separately for each condition.

| Field | Entry |
|---|---|
| Participant code | |
| Session number | 1 / 2 |
| Condition code | X / Y |
| Date | YYYY-MM-DD |
| Scheduled start | |
| Actual baseline time | |
| Time of day comparable to paired visit | Yes / No |
| Washout/session-spacing rule satisfied | Yes / No |
| Standardized meal code | |
| Observer/operator code | |

---

## 5. PRE-SESSION COMPLIANCE

| Field | Entry |
|---|---|
| Last caloric intake date/time | |
| Food-free interval achieved | hours:min |
| Frozen minimum interval satisfied | Yes / No |
| Water policy satisfied | Yes / No |
| Water consumed during controlled interval | mL |
| Caffeine policy satisfied | Yes / No / N/A |
| Nicotine policy satisfied | Yes / No / N/A |
| Exercise policy satisfied | Yes / No |
| Alcohol restriction satisfied | Yes / No |
| Unapproved electrolyte/appetite/digestion product used | Yes / No |
| Acute illness/new symptoms | Yes / No |
| Sleep duration | hours |
| Other prespecified deviation | Yes / No |

If any answer violates the frozen protocol, record the deviation before dosing and apply the predefined continuation/exclusion rule.

---

## 6. SUBJECTIVE SCALE SYSTEM

Use the same scale for every subjective rating:

**0–10 numeric rating scale**

0 and 10 are anchored separately for each construct.

### Hunger
- 0 = not hungry at all
- 10 = extremely hungry

### Thirst
- 0 = not thirsty at all
- 10 = extremely thirsty

### Fullness
- 0 = not full at all
- 10 = extremely full

### GI discomfort
- 0 = no GI discomfort
- 10 = extreme GI discomfort

### General meal-transition discomfort
- 0 = completely comfortable
- 10 = extremely uncomfortable

### Post-meal discomfort
- 0 = completely comfortable
- 10 = extremely uncomfortable

Operators read/use the same wording at every visit. Do not coach participants toward a desired score.

---

## 7. BASELINE — T0

Record immediately before assigned preload.

| Outcome | Value |
|---|---:|
| Hunger | 0–10 |
| Thirst | 0–10 |
| Fullness | 0–10 |
| GI discomfort | 0–10 |
| General meal-transition discomfort | 0–10 |

Additional baseline symptoms:

| Symptom | None / Mild / Moderate / Severe |
|---|---|
| Nausea | |
| Abdominal pain/cramping | |
| Bloating | |
| Dizziness/lightheadedness | |
| Headache | |
| Other | |

Other symptom text: ________

---

## 8. PRELOAD ADMINISTRATION

| Field | Entry |
|---|---|
| Assigned condition code | X / Y |
| Target volume | 350 mL |
| Actual volume prepared | mL |
| Start time | |
| Finish time | |
| Consumption window satisfied | Yes / No |
| Entire assigned volume consumed | Yes / No |
| Estimated unconsumed volume | mL |
| Serving temperature within frozen range | Yes / No |
| Correct container format | Yes / No |
| Immediate intolerance | Yes / No |

If R1 is the underlying condition, lot/raw-material traceability must be available outside the masked participant instrument.

---

## 9. PRE-MEAL TRANSITION — T1

Record at the frozen preload-to-meal interval, immediately before meal exposure.

| Outcome | Value |
|---|---:|
| Hunger | 0–10 |
| Thirst | 0–10 |
| Fullness | 0–10 |
| GI discomfort | 0–10 |
| General meal-transition discomfort | 0–10 |

Immediate symptoms since preload:

| Symptom | None / Mild / Moderate / Severe |
|---|---|
| Nausea | |
| Abdominal pain/cramping | |
| Bloating | |
| Dizziness/lightheadedness | |
| Headache | |
| Other | |

---

## 10. STANDARDIZED MEAL RECORD

| Field | Entry |
|---|---|
| Meal code | |
| Meal amount offered | g |
| Meal start time | |
| Meal stop time | |
| Meal duration | min:sec |
| Meal amount remaining | g |
| Meal amount consumed | g |
| Permitted beverage offered | mL |
| Beverage consumed during meal | mL |
| Meal protocol followed | Yes / No |

### Derived fields

**Meal amount consumed (g)** = amount offered − amount remaining

**Eating rate (g/min)** = meal amount consumed / meal duration in minutes

Do not calculate eating rate if meal timing or mass measurement is unreliable.

If a bite-count method is separately frozen before enrollment, record:

| Field | Entry |
|---|---|
| Total standardized bites | |
| Bites/min | |

Otherwise leave bite-count fields unused.

---

## 11. IMMEDIATE POST-MEAL — T2

Record immediately after meal completion.

| Outcome | Value |
|---|---:|
| Fullness | 0–10 |
| GI discomfort | 0–10 |
| Post-meal discomfort | 0–10 |
| Thirst | 0–10 |

Symptoms:

| Symptom | None / Mild / Moderate / Severe |
|---|---|
| Nausea | |
| Abdominal pain/cramping | |
| Bloating | |
| Dizziness/lightheadedness | |
| Headache | |
| Other | |

---

## 12. LATER POST-MEAL TIMEPOINTS

The exact post-meal intervals must be frozen before participant 001 becomes analyzable.

Use the same fields at every authorized post-meal timepoint.

### T3 — frozen interval: ______ min after meal completion

| Outcome | Value |
|---|---:|
| Fullness | 0–10 |
| GI discomfort | 0–10 |
| Post-meal discomfort | 0–10 |
| Thirst | 0–10 |

### T4 — frozen interval: ______ min after meal completion

| Outcome | Value |
|---|---:|
| Fullness | 0–10 |
| GI discomfort | 0–10 |
| Post-meal discomfort | 0–10 |
| Thirst | 0–10 |

Additional timepoints require prospective protocol amendment before outcome inspection; they may not be added retrospectively to rescue a hypothesis.

---

## 13. PALATABILITY / ACCEPTABILITY

Record after the condition's main outcome collection so it does not prime earlier ratings.

| Field | Value |
|---|---:|
| Ease of consumption | 0–10 |
| Overall acceptability | 0–10 |

Anchors:

- Ease: 0 = extremely difficult; 10 = extremely easy
- Acceptability: 0 = completely unacceptable; 10 = completely acceptable

Optional free-text observation:

________

Do not treat preference or taste as proof of physiological efficacy.

---

## 14. ADVERSE-EVENT RECORD

For every new or worsened symptom after preload:

| Field | Entry |
|---|---|
| Event ID | |
| Symptom/event | |
| Onset date/time | |
| Resolution date/time | |
| Severity | Mild / Moderate / Severe |
| Serious/unexpected | Yes / No |
| Action taken | |
| Medical evaluation required | Yes / No |
| Session stopped | Yes / No |
| Outcome | |
| Reviewer notes | |

Any serious or unexpected adverse event invokes the protocol stop/safety rule.

Causality should not be asserted casually; use the study's qualified review process.

---

## 15. PROTOCOL-DEVIATION RECORD

| Field | Entry |
|---|---|
| Deviation ID | |
| Deviation category | |
| Description | |
| Identified before or after dosing | |
| Could affect safety | Yes / No |
| Could affect primary outcome interpretation | Yes / No |
| Session classification | Include / Exclude / Sensitivity-only / Pending review |
| Adjudicator | |
| Rationale | |

Deviation categories may include:

- food-free interval,
- water policy,
- intervention volume,
- intervention timing,
- meal composition,
- meal timing,
- measurement timing,
- measurement failure,
- prohibited intake,
- acute illness,
- other.

The inclusion rule must follow the prospectively frozen protocol; it may not be selected based on whether the data favor R1.

---

## 16. WITHIN-PARTICIPANT DERIVED OUTCOMES

For each session:

- Δ hunger pre-meal = T1 hunger − T0 hunger
- Δ thirst pre-meal = T1 thirst − T0 thirst
- Δ fullness pre-meal = T1 fullness − T0 fullness
- Δ GI discomfort pre-meal = T1 GI discomfort − T0 GI discomfort
- Δ transition discomfort = T1 transition discomfort − T0 transition discomfort
- meal duration
- meal amount consumed
- eating rate, if valid
- T2/T3/T4 post-meal outcomes

After both sessions:

For each outcome, compute the within-person contrast using the unmasked condition key:

**R1 value − Water value**

Direction must be interpreted according to the construct. A positive number is not automatically favorable.

---

## 17. PAIRED-SESSION COMPLETION RECORD

Complete only after both sessions.

| Field | Entry |
|---|---|
| Both sessions completed | Yes / No |
| Both sessions analyzable under frozen rules | Yes / No |
| Sequence | XY / YX |
| Material order effect suspected | Yes / No |
| Material protocol asymmetry | Yes / No |
| Participant asked which condition they preferred | Yes / No |
| Preference | X / Y / No preference |
| Preference reason | |

Preference is supporting evidence only.

---

## 18. ANALYTIC EXPORT SCHEMA

Minimum one-row-per-session export fields:

`participant_code`  
`session_number`  
`sequence`  
`condition_code`  
`date`  
`food_free_interval_min`  
`controlled_water_ml`  
`sleep_hours`  
`protocol_eligible_session`  
`t0_hunger`  
`t0_thirst`  
`t0_fullness`  
`t0_gi_discomfort`  
`t0_transition_discomfort`  
`preload_actual_ml`  
`preload_duration_sec`  
`t1_hunger`  
`t1_thirst`  
`t1_fullness`  
`t1_gi_discomfort`  
`t1_transition_discomfort`  
`meal_offered_g`  
`meal_remaining_g`  
`meal_consumed_g`  
`meal_duration_sec`  
`eating_rate_g_min`  
`meal_beverage_ml`  
`t2_fullness`  
`t2_gi_discomfort`  
`t2_postmeal_discomfort`  
`t2_thirst`  
`t3_fullness`  
`t3_gi_discomfort`  
`t3_postmeal_discomfort`  
`t3_thirst`  
`t4_fullness`  
`t4_gi_discomfort`  
`t4_postmeal_discomfort`  
`t4_thirst`  
`ease_consumption`  
`acceptability`  
`adverse_event_any`  
`serious_unexpected_event`  
`protocol_deviation_any`  
`analysis_classification`

A separate participant-level table retains sequence, eligibility, paired completion, and final preference.

---

## 19. DATA-QUALITY GATES

A session cannot be classified as clean if any required primary field is missing without explanation.

Before unmasking X/Y:

1. resolve data-entry errors,
2. lock deviation classifications,
3. identify invalid eating-rate measurements,
4. document missing values,
5. lock analyzable-session status,
6. freeze the analysis dataset.

No data cleaning decision may depend on knowledge that X or Y is R1.

---

## 20. PILOT ADJUDICATION OUTPUT

After unmasking and analysis, the instrument must support exactly four protocol-level exits:

### A — SIGNAL FOR FURTHER R1 INVESTIGATION
Coherent, tolerable R1 advantage of meaningful magnitude on prespecified transition outcomes.

### B — NO DETECTABLE ADDED ADVANTAGE
R1 does not demonstrate a practically meaningful advantage over matched water under tested conditions.

### C — TOLERABILITY FAILURE
R1 produces clinically or practically concerning tolerability/safety disadvantage.

### D — UNINTERPRETABLE
Protocol, measurement, adherence, missingness, order, or variability prevents a defensible comparison.

No fifth category may be invented after results are known.

---

## 21. CLAIM CONTROL

This instrument cannot generate evidence for claims it does not measure.

It does not establish:

- high-sodium buffering,
- glycemic buffering,
- high-fat vascular buffering,
- nutritional balancing,
- disease treatment/prevention,
- correction of clinical dehydration,
- generalized appetite suppression,
- generalized weight-loss benefit.

R2 remains **NOT YET AUTHORIZED**.

---

## 22. PRE-DATA LOCK ITEMS

The instrument is structurally complete, but the following protocol constants must be populated and frozen before analyzable enrollment:

- [ ] exact food-free interval
- [ ] exact pre-session water allowance
- [ ] exact caffeine/nicotine/exercise rules
- [ ] exact standardized meal and mass
- [ ] exact preload consumption window
- [ ] exact preload-to-meal delay
- [ ] exact T3 interval
- [ ] exact T4 interval
- [ ] exact washout/session-spacing rule
- [ ] practical-meaningfulness thresholds
- [ ] final eligibility/exclusion implementation
- [ ] qualified safety/human-subject review appropriate to study setting
- [ ] R1 raw-material/elemental-mineral specification

Until those constants are frozen, the instrument is **READY FOR PARAMETERIZATION, NOT HUMAN EXECUTION**.

---

## 23. NEXT DETERMINISTIC ARTIFACT

**BASELINE_R1_PILOT_PARAMETER_LOCK_v1**

Its sole job is to resolve the remaining blank protocol constants prospectively, with scientific rationale and safety boundaries, before participant 001 is analyzable.

No R2 formulation work is authorized by this instrument.
