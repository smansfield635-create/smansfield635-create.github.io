# BASELINE_R2_BENCH_CHARACTERIZATION_AND_PROTOTYPE_TEST_PLAN_v1

**Mode:** Non-human bench characterization · Prototype qualification · Non-drift  
**Program:** MASTER_NUTRITION_RESEARCH_ENGINEERING_PROGRAM_v1  
**Object:** OBJECT_B_BASELINE  
**Architecture authority:** BASELINE_R2_MINIMUM_SUFFICIENT_FORMULATION_ARCHITECTURE_v1  
**Status:** BENCH PLAN LOCKED · NO HUMAN-USE R2 FORMULA AUTHORIZED  
**Date:** 2026-09-22

---

## 1. PURPOSE

Define the non-human bench program required to compare:

- **P0 — water control**
- **P1 — acid + water**
- **P2 — acid + minimal palatability system**

before any specific R2 composition is advanced to qualified human-safety review.

This plan characterizes chemistry, reproducibility, physical stability, packaging interaction, and product-fit constraints.

It does not authorize tasting, swallowing, self-experimentation, or human dosing.

---

## 2. PRIMARY BENCH QUESTIONS

1. Can the acid-mediated system be prepared reproducibly?
2. What pH and titratable acidity correspond to each development condition?
3. Does the palatability system materially alter acid exposure?
4. Does the formulation remain physically stable over the intended observation windows?
5. Does packaging/contact material alter appearance, pH, acidity, or integrity?
6. Can the system remain low-mass, low-calorie, and operationally simple?
7. Is there a bench-defined candidate worth taking to qualified safety review?

---

## 3. PROTOTYPE IDENTITIES

### P0

**Water control**

Purpose:

- establish water-source baseline,
- validate measurement procedures,
- establish container/contact baseline.

### P1

**Acid + water**

Purpose:

- establish minimum acid-system chemistry,
- characterize pH/titratable acidity,
- establish reproducibility and physical behavior.

### P2

**Acid + water + minimal palatability system**

Purpose:

- determine whether product-fit improvements can be introduced without materially changing the acid system.

No electrolyte/mineral/dextrose component is included by default.

---

## 4. MATERIAL CONTROL

Before bench work, assign a material ID to every input.

Minimum fields:

| Field | Required |
|---|---|
| Material ID | Yes |
| Supplier/manufacturer | Yes |
| Product name | Yes |
| Catalog/SKU | Yes |
| Lot/batch | Yes where available |
| Specification | Yes |
| Assay/concentration | Yes for acid source |
| Expiration/retest | Yes where applicable |
| Storage conditions | Yes |
| Documentation source | Yes |

Do not use household-product variability as a substitute for controlled formulation materials if the goal is reproducible product development.

---

## 5. ACID-SOURCE QUALIFICATION

The acid source must be characterized before prototype comparison.

Record:

- identity,
- acetic-acid concentration/assay,
- source matrix,
- additional acids/components if present,
- density where needed for mass/volume conversion,
- lot,
- specification/COA where applicable.

If using a vinegar-derived research material rather than purified/standardized acetic-acid system, document all relevant non-acetic components that could affect:

- taste,
- pH,
- titratable acidity,
- color,
- stability,
- mechanism attribution.

No assumption is made that different vinegar sources are equivalent.

---

## 6. DEVELOPMENT CONCENTRATION SERIES

Do not begin with one prematurely final concentration.

Create a bounded bench series spanning the literature-informed mechanism region and formulation-development region.

The exact series is selected only after the acid-source assay is known.

Each level receives a unique code.

Example structure:

- A0 — water
- A1 — low development concentration
- A2 — intermediate development concentration
- A3 — upper development concentration

The plan deliberately does not publish a human-use dose.

The purpose is physicochemical mapping, not ingestion.

---

## 7. PREPARATION CONTROL

For every preparation record:

- prototype code,
- acid-source material ID/lot,
- acid-source measured mass/volume,
- water source/volume,
- palatability components if applicable,
- total preparation mass/volume,
- mixing method,
- mixing duration,
- preparation temperature,
- preparation time,
- operator,
- container.

Use the same preparation method for replicate samples.

---

## 8. REPLICATES

For each prototype/concentration condition:

**minimum bench target: 3 independently prepared replicates**

Replicates should be separate preparations, not three readings from one preparation.

Instrument repeat readings may additionally be used to assess measurement precision.

Purpose:

distinguish preparation reproducibility from instrument repeatability.

---

## 9. pH MEASUREMENT

Use a calibrated pH meter appropriate to the sample range.

Before each measurement series:

- document instrument ID,
- document calibration,
- use appropriate calibration buffers,
- record buffer lot/expiry where required,
- rinse/handle electrode consistently,
- record sample temperature.

For each independent preparation record:

- pH,
- temperature,
- time from preparation to measurement.

Do not rely on pH strips as the primary quantitative method.

---

## 10. TITRATABLE ACIDITY

pH alone is insufficient to characterize total acid burden.

A validated titratable-acidity method must be selected before comparative bench conclusions.

Record:

- sample amount,
- titrant identity/concentration,
- endpoint definition,
- titrant volume,
- calculation,
- result expressed in a predefined acid-equivalent unit.

Method details should be appropriate to the final matrix and reviewed by qualified formulation/analytical expertise before being treated as validated product data.

---

## 11. ACID ASSAY

Where practical during later development, independently verify acetic-acid content using an appropriate analytical method rather than inferring delivered acid solely from starting-material volume.

For early feasibility work, supplier assay plus controlled mass balance may be used as a provisional calculation, clearly labeled as calculated rather than independently assayed.

Final human-study material requires stronger verification.

---

## 12. PHYSICAL OBSERVATIONS

At every scheduled observation record:

- clarity,
- color,
- visible precipitate,
- phase separation,
- sediment,
- gas formation,
- container deformation,
- unusual odor change observed without intentional inhalation exposure,
- other visible change.

Use standardized descriptive categories and photographs where appropriate.

---

## 13. SHORT-TERM STABILITY WINDOWS

Initial feasibility observations:

- T0 — immediately after preparation
- T1 — 1 hour
- T2 — 4 hours
- T3 — 24 hours

If the intended product concept later requires storage, extend under a separately designed stability protocol.

At each relevant timepoint record:

- pH,
- physical observations,
- titratable acidity where appropriate,
- container/contact observations.

The 24-hour screen does not establish shelf life.

---

## 14. TEMPERATURE CONDITIONS

Initial feasibility:

- controlled room-temperature condition,
- refrigerated condition if relevant to intended product use.

Do not infer commercial shelf stability from these limited observations.

Temperature must be recorded.

---

## 15. PACKAGING / CONTACT SCREEN

Candidate contact materials should reflect plausible product packaging.

For each candidate:

- material type,
- supplier/product,
- closure type,
- contact duration,
- temperature,
- visual change,
- leakage,
- deformation,
- pH shift,
- titratable-acidity shift where measured.

Do not assume a package compatible with water is automatically compatible with an acidic formulation.

---

## 16. P2 PALATABILITY-SYSTEM BENCH RULES

P2 may introduce only the minimum support system required for product usability.

Every additive must have:

- material ID,
- defined role,
- concentration,
- calorie contribution,
- known effect on pH/acidity where applicable.

Compare P2 directly with its matched P1 acid level.

### P2 passes chemistry preservation only if:

- the acid exposure remains analytically comparable within prospectively defined formulation tolerance,
- no problematic precipitation/separation appears,
- the system remains reproducible,
- the support ingredient does not create a new dominant active mechanism.

Actual taste testing requires a separately appropriate safety-reviewed sensory-development protocol; this bench plan does not authorize ingestion.

---

## 17. CALORIC / MASS ACCOUNTING

For each prototype calculate:

- total non-water mass,
- active acid mass,
- support-component mass,
- carbohydrate mass,
- estimated calories.

Product-fit objective:

keep burden materially below protein/fiber-preload architectures.

No specific calorie ceiling is invented until the actual support system is known.

---

## 18. DENTAL-EXPOSURE CHARACTERIZATION

Bench work records the chemistry relevant to later dental review:

- pH,
- titratable acidity,
- acid concentration,
- intended serving volume,
- intended consumption duration concept.

Bench chemistry alone does not establish dental safety.

Before human-use advancement, qualified dental review should assess whether the proposed delivery/contact pattern is acceptable and what mitigation is scientifically appropriate.

---

## 19. GI / ESOPHAGEAL BOUNDARY

No bench measurement can establish GI or esophageal tolerability.

Therefore bench PASS language is limited to:

- chemically reproducible,
- physically stable within test window,
- product-engineering feasible.

It must not use:

- gentle,
- stomach-safe,
- reflux-safe,
- well tolerated,

without human evidence.

---

## 20. DATA TABLE — PREPARATION LEVEL

Minimum fields:

`prototype_code`  
`replicate`  
`material_lot`  
`acid_source`  
`acid_assay_declared`  
`acid_input_mass_or_volume`  
`water_volume`  
`support_materials`  
`total_volume`  
`prep_temperature`  
`prep_time`  
`container`  
`operator`

---

## 21. DATA TABLE — OBSERVATION LEVEL

Minimum fields:

`prototype_code`  
`replicate`  
`timepoint`  
`storage_temperature`  
`pH`  
`sample_temperature`  
`titratable_acidity`  
`clarity`  
`precipitate`  
`phase_separation`  
`color_change`  
`container_change`  
`notes`

---

## 22. PREDEFINED BENCH DECISION GATES

### Gate A — Reproducibility

PASS if independent preparations produce sufficiently consistent pH/acidity/physical state to justify further development.

Exact analytical tolerance must be set based on measurement-system capability before qualification testing.

### Gate B — Physical stability

PASS if no material precipitation, phase separation, uncontrolled gas formation, or package failure occurs during the defined feasibility window.

### Gate C — Mechanism preservation

P2 must not materially erase/neutralize the acid exposure relative to matched P1.

### Gate D — Product burden

PASS if total mass/calories/preparation complexity remain consistent with minimalist Baseline architecture.

### Gate E — Packaging feasibility

PASS if at least one plausible contact system survives the feasibility screen without obvious incompatibility.

---

## 23. BENCH CLASSIFICATION

Each prototype receives:

- **ADVANCE**
- **REVISE**
- **DROP**
- **UNINTERPRETABLE**

### ADVANCE

Chemistry is reproducible, physical behavior acceptable, mechanism preserved, product burden acceptable.

### REVISE

Correctable formulation/process problem exists.

### DROP

Architecture fails a core feasibility requirement.

### UNINTERPRETABLE

Measurement or material-control failure prevents conclusion.

---

## 24. PROTOTYPE PRIORITY

### P0

Required control.

### P1

First acid architecture to characterize.

### P2

Opened after a reproducible P1 concentration region exists.

### P3

Not opened unless P1/P2 identify a specific problem that a selectively retained R1 component can solve.

### P4

Remains held.

---

## 25. DOCUMENTATION / TRACEABILITY

Retain:

- material specifications,
- COAs where available,
- calibration records,
- preparation records,
- raw pH readings,
- titration records,
- calculations,
- photographs,
- container identifiers,
- deviations,
- analysis tables.

Every conclusion must be reconstructable from source records.

---

## 26. HUMAN-USE FIREWALL

This bench program may identify a candidate architecture.

It cannot by itself authorize:

- tasting,
- swallowing,
- consumer use,
- efficacy testing,
- human dosing,
- health claims.

A candidate that ADVANCES must next undergo:

1. exact formulation lock,
2. material verification,
3. safety/toxicology/formulation review appropriate to the ingredients/exposure,
4. dental/GI risk review as applicable,
5. human-subject protocol development/oversight before any human research.

---

## 27. CURRENT R2 PROGRAM STATE

Mechanism qualification:

**PASS**

Feasibility gate:

**CONDITIONAL PASS**

Minimum architecture:

**DEFINED**

Bench test plan:

**DEFINED**

Actual bench data:

**NONE**

Human-use formulation:

**NONE**

Therefore:

**R2 HAS ADVANCED FROM THEORY TO A TESTABLE NON-HUMAN FORMULATION-DEVELOPMENT PROGRAM, BUT NOT TO AN INGESTIBLE PRODUCT.**

---

## 28. NEXT DETERMINISTIC ACTION

The next step is no longer another theory artifact.

Execute the bench program once controlled acid-source materials and measurement equipment are available.

The first post-data artifact will be:

**BASELINE_R2_P0_P1_BENCH_RESULTS_AND_QUALIFICATION_v1**

Only after P1 produces a reproducible chemistry region should P2 palatability-system development begin.

R1 remains frozen and independent.
