# BASELINE_R1_PILOT_READINESS_AUDIT_v1

**Mode:** Cross-artifact readiness audit · Non-drift · Execution gate  
**Program:** MASTER_NUTRITION_RESEARCH_ENGINEERING_PROGRAM_v1  
**Object:** OBJECT_B_BASELINE  
**Status:** AUDIT COMPLETE · SCIENTIFIC DESIGN SUBSTANTIALLY COMPLETE · EMPIRICAL EXECUTION BLOCKED  
**Date:** 2026-09-22

---

## 1. PURPOSE

Crosswalk the complete R1 pilot package and determine:

- what is complete,
- what remains open,
- what is blocked by real-world evidence or oversight,
- what is not applicable,
- the minimum sufficient path from protocol development to legitimate empirical execution.

Allowed audit states:

- **COMPLETE**
- **OPEN**
- **BLOCKED**
- **NOT APPLICABLE**

This audit does not itself authorize human research.

---

## 2. ARTIFACT INVENTORY

| Artifact | Function | Audit state |
|---|---|---|
| BASELINE_STATE_TRANSITION_MECHANISM_MAP_v1 | Defines transition scenarios and R1/R2 boundaries | COMPLETE |
| BASELINE_R1_WATER_COMPARATOR_PILOT_PROTOCOL_v1 | Defines experimental architecture | COMPLETE |
| BASELINE_R1_PILOT_MEASUREMENT_INSTRUMENT_v1 | Defines data capture | COMPLETE |
| BASELINE_R1_PILOT_PARAMETER_LOCK_v1 | Freezes timing/exposure constants | COMPLETE |
| BASELINE_R1_STANDARDIZED_MEAL_SPECIFICATION_v1 | Defines controlled meal architecture | COMPLETE / source details open |
| BASELINE_R1_FORMULATION_VERIFICATION_AND_ELEMENTAL_MASS_LEDGER_v1 | Defines composition accounting | COMPLETE / material verification open |
| BASELINE_R1_MATERIAL_SOURCE_AND_COA_ACCEPTANCE_REGISTER_v1 | Defines material acceptance | COMPLETE / 0 materials accepted |
| BASELINE_R1_CANDIDATE_MATERIAL_EVIDENCE_SHORTLIST_v1 | Identifies candidate-source evidence | COMPLETE |
| BASELINE_R1_EVIDENCE_AND_HYPOTHESIS_REGISTER_v1 | Separates evidence from hypothesis | COMPLETE |
| BASELINE_R1_PILOT_STATISTICAL_AND_DECISION_FRAMEWORK_v1 | Defines analysis and A/B/C/D decision logic | COMPLETE |

The scientific architecture is therefore not missing a major conceptual layer.

---

# 3. SCIENTIFIC QUESTION

### Gate
Is the primary question explicit and falsifiable?

### State
**COMPLETE**

Locked question:

> Does frozen R1 add measurable value beyond 350 mL matched water during a controlled fasted-to-meal transition?

The comparator directly addresses the largest obvious confound: water/preload volume.

---

# 4. MECHANISM / CLAIM BOUNDARY

### State
**COMPLETE**

R1 may investigate:

- fluid-preload transition,
- hunger,
- thirst,
- fullness,
- pacing/eating behavior,
- meal intake,
- GI/post-meal comfort.

R1 does not currently claim:

- sodium buffering,
- glycemic buffering,
- high-fat vascular buffering,
- nutritional balancing,
- disease treatment/prevention,
- clinical dehydration treatment.

R2 remains **NOT YET AUTHORIZED**.

---

# 5. EXPERIMENTAL DESIGN

### State
**COMPLETE**

Locked:

- randomized/counterbalanced crossover,
- R1 versus 350 mL matched water,
- same participant receives both conditions,
- morning testing,
- controlled overnight food-free interval,
- standardized meal,
- prospective outcome set,
- prospective A/B/C/D interpretation.

No additional design invention is required before the operational gates are addressed.

---

# 6. TIMING / EXPOSURE PARAMETERS

### State
**COMPLETE**

Locked:

- 10–14 h overnight food-free interval,
- 350 mL intervention volume,
- ≤5 min intervention consumption window,
- 30 ±2 min preload-to-meal interval,
- 30 min maximum meal observation,
- T0 / T1 / T2 / T3 / T4,
- T3 = 30 min post-meal,
- T4 = 60 min post-meal,
- ≥72 h paired-session spacing,
- target 3–7 days.

---

# 7. MEASUREMENT SYSTEM

### State
**COMPLETE**

Locked:

- 0–10 subjective scales,
- hunger,
- thirst,
- fullness,
- GI discomfort,
- transition/post-meal discomfort,
- gravimetric meal intake,
- meal duration,
- eating rate in g/min where valid,
- adverse events,
- deviations,
- acceptability,
- paired condition coding,
- export schema.

---

# 8. STATISTICAL / DECISION SYSTEM

### State
**COMPLETE**

Locked:

- paired evaluable primary set,
- all-dosed safety set,
- sensitivity set,
- paired contrasts,
- descriptive statistics,
- uncertainty reporting,
- missing-data rules,
- outlier rules,
- baseline comparability,
- sequence/order inspection,
- tolerability precedence,
- no post hoc composite,
- no p-value-only qualification.

Final decision must be:

A — signal for further R1 investigation  
B — no detectable added advantage  
C — tolerability failure  
D — uninterpretable

---

# 9. STANDARDIZED MEAL — ARCHITECTURE

### State
**COMPLETE**

Locked meal structure:

- 2 large eggs,
- 5.0 g unsalted butter,
- 2 slices whole-wheat bread,
- 120 ±5 g banana,
- 170 g plain Greek yogurt.

Preparation and gravimetric rules are defined.

---

# 10. STANDARDIZED MEAL — PHYSICAL SOURCE LOCK

### State
**OPEN**

Still required:

- exact egg source/size/package,
- exact butter brand/SKU,
- exact bread brand/SKU,
- exact yogurt brand/SKU/fat percentage,
- actual Nutrition Facts,
- allergen statements,
- lot/date records where applicable,
- final offered mass,
- final nutrient calculation,
- validated cooking/service-temperature SOP.

### Block type
**REAL-WORLD PROCUREMENT / SOURCE RECORD**

This does not require more theoretical research.

---

# 11. R1 FORMULATION DEFINITION

### State
**COMPLETE**

Frozen raw-material targets:

- 750.0 mg sodium chloride,
- 250.0 mg potassium chloride,
- 100.0 mg magnesium citrate material,
- 1,500.0 mg dextrose,
- 350 mL water.

No reformulation is authorized.

---

# 12. R1 ELEMENTAL ACCOUNTING

### State
**PARTIALLY COMPLETE → AUDIT CLASSIFICATION: OPEN**

Theoretical nominal values resolved:

- Na ≈295.0 mg from 750 mg nominal pure NaCl,
- K ≈131.1 mg from 250 mg nominal pure KCl.

Unresolved:

- actual assays for received NaCl/KCl,
- exact magnesium-citrate identity,
- elemental Mg fraction,
- actual dextrose form/specification.

Because released composition requires actual materials:

**OPEN**

---

# 13. MATERIAL ACCEPTANCE

### State
**BLOCKED**

Current:

- R1-M01 NaCl — PENDING
- R1-M02 KCl — PENDING
- R1-M03 magnesium citrate — PENDING
- R1-M04 dextrose — PENDING
- R1-M05 water — PENDING

Accepted:

**0 / 5**

Reason:

No actual selected/received lot-specific evidence has been adjudicated.

### Minimum resolution

For each dry material:

1. select exact product,
2. obtain specification,
3. obtain actual lot,
4. obtain lot-specific COA/equivalent quality evidence,
5. reconcile label/specification/COA,
6. accept/reject.

For water:

1. select source,
2. freeze quality/handling basis,
3. freeze measurement procedure.

---

# 14. MAGNESIUM-CITRATE IDENTITY

### State
**BLOCKED**

This is the most important formulation-specific unresolved item.

Need:

- exact administration-appropriate product,
- chemical/product form,
- hydration/specification if relevant,
- elemental magnesium declaration/assay,
- lot,
- COA.

Do not guess elemental Mg.

Do not change the frozen 100 mg mass silently.

If the desired material requires a mass change, that is a new formulation version.

---

# 15. DEXTROSE IDENTITY

### State
**OPEN**

Candidate public evidence demonstrated that dextrose monohydrate exists as a tightly specified material.

But frozen R1 currently states only:

**dextrose — 1.5 g**

Before material acceptance, explicitly resolve:

- anhydrous vs monohydrate/other specification,
- supplier/product,
- lot/COA.

If choosing the form materially changes the defined scientific object, version/amend prospectively.

---

# 16. WEIGHING / PREPARATION QUALITY SYSTEM

### State
**OPEN**

Need:

- suitable milligram-scale weighing equipment,
- calibration/verification procedure,
- prospectively defined tolerances,
- preparation worksheet,
- independent arithmetic/material check where appropriate,
- ingredient-lot traceability,
- serving preparation ID,
- water-volume measurement SOP.

This is operational laboratory/compounding work, not mechanism research.

---

# 17. RANDOMIZATION CUSTODY

### State
**OPEN**

The method is defined but the actual sequence list has not been generated.

Need:

- participant sequence-generation procedure,
- allocation list,
- custodian,
- condition-key custody,
- unmasking rule.

Do not generate participant assignments until the actual pilot is approved to proceed and enrollment structure is known.

---

# 18. PARTICIPANT SCREENING

### State
**OPEN**

Core exclusion architecture exists.

Need actual controlled screening document covering:

- age/consent,
- kidney/electrolyte concerns,
- sodium/potassium restrictions,
- diabetes/glucose regulation,
- relevant medications,
- pregnancy/lactation,
- GI disease,
- eating-disorder concerns,
- allergies/intolerances,
- acute illness,
- other safety-review triggers.

The final screen must fit the actual oversight/study setting.

---

# 19. INFORMED CONSENT

### State
**BLOCKED**

No final study-setting-approved consent document exists.

Need:

- purpose,
- procedures,
- foreseeable risks/discomforts,
- voluntary participation,
- withdrawal,
- privacy/data handling,
- contact/escalation information,
- compensation/cost if applicable,
- appropriate review/approval.

Consent language should be finalized under the applicable human-subject framework.

---

# 20. HUMAN-SUBJECT / SAFETY OVERSIGHT

### State
**BLOCKED**

This is the principal execution gate.

Before recruiting or dosing people, determine the actual study setting and applicable oversight path.

Depending on who conducts the study, why, where, and how results will be used, this may require institutional review, IRB determination/review, qualified clinical oversight, or other applicable requirements.

This audit does not make that legal/regulatory determination.

The protocol should be taken to the appropriate qualified human-research/safety authority for that determination before execution.

---

# 21. ADVERSE-EVENT RESPONSIBILITY

### State
**OPEN / DEPENDENT ON OVERSIGHT**

The event fields and stop rules exist.

Need:

- named responsible reviewer/role,
- escalation pathway,
- emergency procedure,
- documentation responsibility,
- follow-up responsibility,
- suspension/restart authority.

---

# 22. DATA CAPTURE IMPLEMENTATION

### State
**OPEN**

The measurement instrument and schema are defined.

Need an actual validated implementation:

- electronic or paper case-report form,
- field validation,
- participant coding,
- access controls,
- condition masking,
- version control,
- backup/storage,
- dataset freeze procedure.

---

# 23. PILOT SAMPLE SIZE

### State
**OPEN**

The statistical framework correctly avoids inventing a confirmatory efficacy threshold.

However, the operational pilot still requires a prospectively selected recruitment target.

That target should be justified as a feasibility/variance-estimation pilot rather than a powered efficacy trial unless a formal primary effect/variance assumption is established.

The sample-size rationale should be finalized before enrollment.

---

# 24. DRY RUN

### State
**OPEN**

Before analyzable participant 001:

Conduct a no-data/non-analyzable rehearsal of:

- ingredient custody,
- weighing,
- beverage preparation,
- timing,
- meal preparation,
- meal weighing,
- questionnaire administration,
- adverse-event workflow,
- data entry,
- condition masking,
- post-meal timing,
- dataset export.

Repair procedural ambiguity before enrollment.

---

# 25. READINESS MATRIX

| Domain | State |
|---|---|
| Scientific question | COMPLETE |
| Mechanism map | COMPLETE |
| Claim boundaries | COMPLETE |
| Comparator | COMPLETE |
| Crossover design | COMPLETE |
| Timing parameters | COMPLETE |
| Measurement instrument | COMPLETE |
| Statistical framework | COMPLETE |
| Decision framework | COMPLETE |
| Meal architecture | COMPLETE |
| Meal physical source lock | OPEN |
| Formulation target | COMPLETE |
| Elemental ledger | OPEN |
| Material acceptance | BLOCKED |
| Magnesium identity | BLOCKED |
| Dextrose identity | OPEN |
| Weighing/preparation SOP | OPEN |
| Randomization custody | OPEN |
| Participant screen | OPEN |
| Consent | BLOCKED |
| Human-subject/safety oversight | BLOCKED |
| AE responsibility | OPEN |
| Data-capture implementation | OPEN |
| Pilot sample-size rationale | OPEN |
| Dry run | OPEN |
| R2 | NOT APPLICABLE / NOT AUTHORIZED |

---

# 26. PROGRAM READINESS ASSESSMENT

### Scientific design readiness

**HIGH**

The major conceptual, mechanistic, comparator, measurement, and statistical architecture is already built.

### Operational readiness

**PARTIAL**

The remaining work is primarily implementation, sourcing, quality control, oversight, and study operations.

### Human execution readiness

**NO**

The pilot should not recruit or dose participants yet.

The blocking issues are concrete and finite rather than conceptual.

---

# 27. MINIMUM SUFFICIENT PATH TO EXECUTION

Do not create more theory documents unless a real gap appears.

The shortest legitimate path is:

### Gate 1 — Material selection
Select actual NaCl, KCl, magnesium citrate, dextrose, and water sources.

### Gate 2 — Material evidence
Acquire specifications and lot-specific COAs/equivalent records.

### Gate 3 — Material adjudication
Run `BASELINE_R1_MATERIAL_ACCEPTANCE_ADJUDICATION_v1`.

### Gate 4 — Operational lock
Freeze exact commercial meal products, weighing/preparation SOP, and data-capture implementation.

### Gate 5 — Human-research package
Finalize screening, consent, adverse-event responsibility, and sample-size rationale.

### Gate 6 — Oversight determination
Submit the complete package to the appropriate qualified human-subject/safety authority for the actual study setting.

### Gate 7 — Dry run
Execute the full non-analyzable rehearsal.

### Gate 8 — Final readiness review
Verify every required row is COMPLETE before participant 001.

Only then:

**EMPIRICAL PILOT EXECUTION**

---

# 28. WHAT SHOULD HAPPEN NOW

The next work should not be another speculative mechanism document.

The program has enough scientific architecture.

The next actionable branch is:

**BASELINE_R1_OPERATIONAL_EXECUTION_PACKAGE_v1**

This package should consolidate the remaining non-material operational work that can be completed before physical lots arrive:

- participant screening draft,
- consent-information draft for later oversight review,
- adverse-event/escalation worksheet,
- preparation batch record,
- weighing/volume SOP,
- standardized meal source-lock worksheet,
- data-capture case-report form,
- randomization-custody specification,
- pilot sample-size rationale framework,
- dry-run checklist.

That lets the project continue while material sourcing/COAs proceed separately.

---

## 29. FINAL AUDIT STATE

**SCIENTIFIC ARCHITECTURE: SUBSTANTIALLY COMPLETE**

**OPERATIONAL PACKAGE: INCOMPLETE**

**PHYSICAL MATERIAL VERIFICATION: BLOCKED PENDING REAL SOURCES/LOTS**

**HUMAN-SUBJECT/SAFETY OVERSIGHT: BLOCKED PENDING ACTUAL STUDY-SETTING REVIEW**

**EMPIRICAL EXECUTION: NOT AUTHORIZED**

**R2: NOT YET AUTHORIZED**

Next deterministic artifact:

**BASELINE_R1_OPERATIONAL_EXECUTION_PACKAGE_v1**
