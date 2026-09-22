# BASELINE_R1_PILOT_STATISTICAL_AND_DECISION_FRAMEWORK_v1

**Mode:** Prospective statistical framework · Decision control · Non-drift  
**Program:** MASTER_NUTRITION_RESEARCH_ENGINEERING_PROGRAM_v1  
**Object:** OBJECT_B_BASELINE  
**Protocol authority:** BASELINE_R1_WATER_COMPARATOR_PILOT_PROTOCOL_v1  
**Measurement authority:** BASELINE_R1_PILOT_MEASUREMENT_INSTRUMENT_v1  
**Parameter authority:** BASELINE_R1_PILOT_PARAMETER_LOCK_v1  
**Evidence authority:** BASELINE_R1_EVIDENCE_AND_HYPOTHESIS_REGISTER_v1  
**Status:** ANALYSIS FRAMEWORK LOCKED · PRE-DATA  
**Date:** 2026-09-22

---

## 1. PURPOSE

Prospectively define how R1-versus-350-mL-water pilot data will be summarized, compared, quality-controlled, and converted into a bounded advancement decision.

This is an exploratory pilot framework.

It is not a confirmatory efficacy analysis and does not authorize clinical claims.

No outcome-specific threshold may be invented after condition identities or results are inspected.

R2 remains **NOT YET AUTHORIZED**.

---

## 2. PRIMARY ANALYTIC QUESTION

> Within the same participant, does the frozen R1 condition produce a coherent and tolerable difference from matched water on prespecified fasted-to-meal transition outcomes?

The primary unit of evidence is the **paired within-participant contrast**.

Between-person comparisons are secondary/descriptive because the design is crossover.

---

## 3. ANALYSIS POPULATIONS

### 3.1 Paired evaluable set — primary

Include participants who:

- complete both conditions,
- have both sessions classified analyzable under prospectively frozen rules,
- have the required outcome data for the outcome being analyzed.

This is the primary pilot analysis set.

### 3.2 All-dosed set — safety/tolerability

Include every participant who consumes any amount of either assigned study condition.

Use this set for:

- adverse events,
- discontinuations,
- intolerance,
- serious/unexpected events.

Safety data are not discarded because a session later becomes analytically invalid.

### 3.3 Sensitivity set

Contains sessions prospectively classified as sensitivity-only because of predefined deviations.

Sensitivity analyses may test robustness but may not replace the primary paired evaluable analysis merely because they produce a more favorable result.

---

## 4. CONDITION MASKING AND DATA FREEZE

Before X/Y identities are unmasked:

1. source records are reconciled,
2. transcription errors are corrected,
3. session eligibility is frozen,
4. deviations are adjudicated,
5. missingness is documented,
6. invalid eating-rate calculations are flagged,
7. paired evaluability is frozen,
8. the analytic dataset is versioned and timestamped.

Only after these steps may X/Y be mapped to R1/water.

No post-unmasking exclusion is permitted except correction of a demonstrable data error, which must be documented with an audit trail.

---

## 5. PRESPECIFIED OUTCOMES

### Core transition outcomes

- T0→T1 hunger change
- T0→T1 thirst change
- T0→T1 fullness change
- T0→T1 GI-discomfort change
- T0→T1 meal-transition-discomfort change
- meal duration
- meal amount consumed
- eating rate, if valid
- T2 fullness
- T2 GI discomfort
- T2 post-meal discomfort
- T2 thirst
- T3 fullness
- T3 GI discomfort
- T3 post-meal discomfort
- T3 thirst
- T4 fullness
- T4 GI discomfort
- T4 post-meal discomfort
- T4 thirst

### Supporting outcomes

- ease of consumption
- acceptability
- participant preference after both sessions
- adverse-event incidence
- session discontinuation

No new efficacy endpoint may be promoted to primary status after data inspection.

---

## 6. DERIVED VARIABLES

For each condition:

**ΔHunger = T1 hunger − T0 hunger**

**ΔThirst = T1 thirst − T0 thirst**

**ΔFullness = T1 fullness − T0 fullness**

**ΔGI = T1 GI discomfort − T0 GI discomfort**

**ΔTransition discomfort = T1 transition discomfort − T0 transition discomfort**

Meal consumption:

**Consumed_g = Offered_g − Remaining_g**

Eating rate:

**EatingRate_g_min = Consumed_g / MealDuration_min**

For every outcome (Y), define the paired formulation contrast:

**D_Y = Y_R1 − Y_Water**

For change outcomes:

**D_ΔY = ΔY_R1 − ΔY_Water**

Direction is interpreted according to the construct; positive does not automatically mean favorable.

---

## 7. DIRECTION MAP

For interpretation only:

| Outcome | Nominal favorable direction for R1 vs water |
|---|---|
| Hunger at T1 / Δ hunger | lower |
| Thirst at T1 / Δ thirst | lower |
| Fullness at T1 / Δ fullness | higher, subject to comfort |
| GI discomfort | lower |
| Transition discomfort | lower |
| Meal duration | no universal favorable direction |
| Eating rate | slower may support pacing hypothesis, but not automatically beneficial |
| Meal amount consumed | no universal favorable direction |
| Post-meal discomfort | lower |
| Acceptability | higher |
| Adverse events | fewer/less severe |

Meal intake reduction, slower eating, or increased fullness cannot independently be labeled a health benefit.

---

## 8. DESCRIPTIVE STATISTICS

For each condition and paired contrast, report as appropriate:

- n
- mean
- standard deviation
- median
- interquartile range
- minimum
- maximum

For paired contrasts additionally report:

- mean paired difference
- median paired difference
- confidence interval for the mean paired difference when appropriate
- individual participant paired differences

Graphical displays should preserve individual paired responses rather than showing group means alone.

---

## 9. INFERENTIAL STATISTICS

The pilot is exploratory.

Where assumptions are reasonable, paired continuous outcomes may be summarized with a paired t-based confidence interval/test.

Where distributional assumptions are poor or sample size makes parametric interpretation fragile, use an appropriate paired nonparametric method such as the Wilcoxon signed-rank procedure, with the limitation that it addresses a distributional/location hypothesis rather than serving as a universal substitute for an effect-size estimate.

Exact method choice must be documented and should prioritize estimation and uncertainty.

### Statistical-significance rule

A p-value below a conventional threshold is **not sufficient** for R1 advancement.

A p-value above a conventional threshold is **not sufficient** to declare equivalence or no effect.

The pilot emphasizes:

- magnitude,
- direction,
- consistency,
- uncertainty,
- tolerability,
- feasibility.

---

## 10. MULTIPLE OUTCOMES

The pilot deliberately measures several related transition domains.

It is not designed to manufacture a positive result by searching across them.

Therefore:

- all prespecified outcomes are reported,
- no single isolated favorable p-value is treated as proof,
- no endpoint is hidden because it is unfavorable,
- no post hoc composite score is created,
- no multiplicity-adjusted confirmatory claim is attempted from this exploratory pilot.

Any later confirmatory study must identify a much narrower primary endpoint structure prospectively.

---

## 11. MISSING DATA

Do not impute missing primary pilot outcomes with invented values.

For each outcome:

- report the number of available pairs,
- identify why data are missing,
- distinguish measurement failure from participant discontinuation and protocol exclusion.

Primary analysis is based on available valid pairs for that outcome.

If missingness is substantial or asymmetric between conditions, the relevant domain may be classified uninterpretable.

---

## 12. OUTLIERS

Do not remove a value solely because it is extreme or unfavorable.

An observation may be excluded only when a prospectively applicable reason exists, such as:

- confirmed measurement/device failure,
- transcription error that can be corrected from source,
- predefined protocol-invalid session.

Otherwise retain the value and, where useful, report a sensitivity analysis showing its influence.

---

## 13. BASELINE COMPARABILITY

Because the same participant completes both conditions, inspect paired-session T0 values for:

- hunger,
- thirst,
- fullness,
- GI discomfort,
- transition discomfort,
- fasting duration,
- relevant water exposure,
- sleep duration.

Do not use ordinary significance testing of baseline differences as a gate.

Instead, identify material systematic asymmetry that could undermine interpretation.

If one condition consistently begins from a different physiological state because of procedural failure, classify the affected analysis accordingly.

---

## 14. SEQUENCE / ORDER INSPECTION

Record and inspect:

- XY vs YX sequence,
- session 1 vs session 2 response,
- condition-by-period pattern,
- major carryover concerns.

This pilot is not expected to provide high-powered formal carryover modeling.

However, a strong systematic period/sequence pattern can make the formulation contrast unreliable.

If the apparent R1 signal exists primarily because R1 disproportionately occurred in a favorable period/order context, the result is not treated as clean advancement evidence.

---

## 15. TOLERABILITY INTEGRATION

R1 advancement requires acceptable tolerability.

Summarize in the all-dosed set:

- any adverse event,
- event type,
- severity,
- serious/unexpected status,
- discontinuation,
- GI intolerance,
- acceptability.

A favorable hunger/fullness/intake signal does not override a clinically or practically concerning tolerability pattern.

---

## 16. RESPONSE CONSISTENCY

For each important outcome, report the number/proportion of paired participants whose R1-minus-water difference is:

- favorable,
- approximately neutral,
- unfavorable.

Do not define “responder” retrospectively from the observed distribution.

If a responder threshold is desired later, it must be prospectively defined in a future study.

Individual-response plots are preferred for this pilot.

---

## 17. PRACTICAL-MEANINGFULNESS CONTROL

No validated R1-specific minimal clinically important difference currently exists.

Therefore v1 will not invent one.

A candidate signal must instead satisfy all of the following:

1. directionally coherent with the prespecified hypothesis,
2. visible in paired raw differences rather than generated solely by modeling,
3. not driven by one or two extreme observations,
4. sufficiently large relative to observed variability to justify replication,
5. not contradicted by a coherent worsening in related outcomes,
6. compatible with acceptable tolerability.

The pilot estimates may later be used to design and power a confirmatory study.

They may not be used retrospectively to redefine this pilot's success threshold.

---

## 18. DECISION ENGINE

After all outcomes are reported, the pilot receives exactly one protocol-level classification.

### A. SIGNAL FOR FURTHER R1 INVESTIGATION

Required:

- analyzable paired dataset of adequate quality,
- acceptable safety/tolerability,
- at least one prespecified transition domain shows a coherent R1-over-water signal of nontrivial magnitude,
- individual paired responses provide reasonable consistency,
- the signal is not explained by major baseline/order/protocol asymmetry,
- related outcomes do not show a pattern that negates the apparent benefit.

Meaning:

**R1 earns replication/refinement testing.**

It does not earn a clinical efficacy claim.

### B. NO DETECTABLE ADDED ADVANTAGE

Use when:

- data quality is adequate,
- R1 and water are materially similar across the measured transition domains,
- uncertainty and observed magnitudes do not provide a compelling R1-specific signal worthy of immediate advancement.

Meaning:

**The active formulation has not earned added-effect attribution beyond matched water under the tested conditions.**

This is not proof that the effect is mathematically zero.

### C. TOLERABILITY FAILURE

Use when:

- R1 produces a concerning adverse-event/tolerability pattern,
- or a formulation-related disadvantage is large enough that unchanged R1 should not advance.

Meaning:

**Stop unchanged R1 advancement pending review.**

### D. UNINTERPRETABLE

Use when:

- too few valid pairs,
- major missingness,
- material protocol asymmetry,
- measurement failure,
- strong unresolved period/order effects,
- uncontrolled meal/preload exposure,
- or variability/uncertainty prevents a defensible formulation comparison.

Meaning:

**Repair and repeat; do not infer R1 success or failure.**

No fifth decision category may be created after seeing results.

---

## 19. DECISION PRECEDENCE

Safety has precedence.

If a result otherwise satisfies A but also satisfies a material tolerability-failure condition:

**classification = C**

If data integrity prevents reliable interpretation:

**classification = D**

Do not force A or B from unusable data.

---

## 20. WHAT MAY INFORM A LATER CONFIRMATORY STUDY

The pilot may legitimately estimate:

- recruitment/retention feasibility,
- protocol adherence,
- outcome variance,
- paired effect-size distribution,
- missing-data rate,
- tolerability rate,
- meal-intake variability,
- likely useful endpoint(s),
- likely sample-size requirements.

A later confirmatory protocol may use these estimates prospectively.

It must not present pilot-derived endpoint selection as if it had been prespecified before the pilot.

---

## 21. WHAT THE PILOT MAY NOT ESTABLISH

Regardless of statistical result, v1 cannot establish:

- disease treatment/prevention,
- clinical dehydration treatment,
- sodium-load buffering,
- glycemic buffering,
- vascular protection,
- high-fat-meal buffering,
- nutritional balancing,
- ingredient-specific causality within R1,
- long-term weight-loss efficacy.

---

## 22. REPORTING TEMPLATE

The final pilot report should contain:

1. participant flow,
2. analysis populations,
3. protocol deviations,
4. baseline/session comparability,
5. condition exposure,
6. complete prespecified outcome table,
7. paired individual-response displays,
8. effect estimates and uncertainty,
9. sequence/order inspection,
10. adverse events/tolerability,
11. missingness,
12. sensitivity analyses,
13. protocol-level A/B/C/D classification,
14. claim boundary,
15. next scientific action.

Null and unfavorable findings are reported with the same completeness as favorable findings.

---

## 23. CURRENT STATUS

Statistical architecture:

**LOCKED**

Outcome data:

**NONE**

Material acceptance:

**PENDING**

Human-study clearance:

**NOT COMPLETE**

Therefore:

**ANALYSIS PLAN READY · PILOT NOT YET CLEARED FOR HUMAN EXECUTION**

---

## 24. NEXT DETERMINISTIC ARTIFACT

**BASELINE_R1_PILOT_READINESS_AUDIT_v1**

Its job is to crosswalk every required gate and classify each as:

- COMPLETE,
- OPEN,
- BLOCKED,
- NOT APPLICABLE.

The audit should identify the minimum remaining work required before the program can legitimately transition from protocol development into empirical execution.

R2 remains **NOT YET AUTHORIZED**.
