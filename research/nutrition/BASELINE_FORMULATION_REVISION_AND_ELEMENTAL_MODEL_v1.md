# BASELINE_FORMULATION_REVISION_AND_ELEMENTAL_MODEL_v1

**Mode:** Engineering revision · Non-drift · Evidence-bounded  
**Program:** MASTER_NUTRITION_RESEARCH_ENGINEERING_PROGRAM_v1  
**Object:** OBJECT_B_BASELINE  
**Status:** ENGINEERED CANDIDATE · NOT FINAL FORMULA  
**Date:** 2026-09-22

---

## 1. PURPOSE

Convert the recovered Baseline historical prototype into a chemically reconciled engineering model without inventing unsupported physiological claims.

This artifact:

- calculates elemental sodium and potassium from the recovered salts,
- models plausible elemental magnesium across known magnesium-citrate forms,
- estimates idealized osmolar contribution,
- challenges serving volume and carbohydrate load,
- preserves the four-ingredient minimalism unless evidence justifies a change,
- defines the exact information still required before manufacturer-facing lock.

It does **not** establish efficacy, clinical benefit, optimality, or final commercial differentiation.

---

## 2. RECOVERED HISTORICAL MASTER SPEC

Per serving:

| Component | Compound mass |
|---|---:|
| Sodium chloride | 750 mg |
| Potassium chloride | 250 mg |
| Magnesium citrate | 100 mg |
| Dextrose | 1.5 g |
| Water | 500 mL |
| Approx. total powder | ~2.6 g |

Historical status:

**EXACT RECOVERED PROTOTYPE · NOT FINAL CANON**

---

## 3. CHEMICAL REFERENCE VALUES

### Sodium chloride

Formula:
NaCl

Molecular weight:
58.44 g/mol

Sodium atomic contribution:
22.99 g/mol

Elemental sodium fraction:
~39.34%

Therefore:

750 mg NaCl
→ **~295 mg elemental sodium**

Reference:
PubChem Sodium Chloride, CID 5234.

### Potassium chloride

Formula:
KCl

Molecular weight:
74.55 g/mol

Potassium atomic contribution:
39.10 g/mol

Elemental potassium fraction:
~52.45%

Therefore:

250 mg KCl
→ **~131 mg elemental potassium**

Reference:
PubChem Potassium Chloride, CID 4873.

---

## 4. MAGNESIUM-CITRATE FORM UNCERTAINTY

The recovered phrase:

**magnesium citrate — 100 mg**

does not uniquely define elemental magnesium.

Public chemical references show multiple magnesium-citrate forms.

### Candidate reference form A
Trimagnesium dicitrate, anhydrous

Formula:
C12H10Mg3O14

Molecular weight:
451.12 g/mol

Approximate elemental magnesium fraction:
~16.16%

100 mg compound
→ **~16.2 mg elemental magnesium**

### Candidate reference form B
Trimagnesium dicitrate nonahydrate

Formula:
C12H28Mg3O23

Molecular weight:
613.25 g/mol

Approximate elemental magnesium fraction:
~11.89%

100 mg compound
→ **~11.9 mg elemental magnesium**

### Candidate reference form C
Magnesium citrate dibasic, anhydrous

Formula:
C6H6MgO7

Molecular weight:
214.41 g/mol

Approximate elemental magnesium fraction:
~11.34%

100 mg compound
→ **~11.3 mg elemental magnesium**

### Current engineering range

Until the exact raw material is selected:

100 mg magnesium citrate
→ approximately **11–16 mg elemental magnesium**

### Hard requirement

Manufacturer-facing specification must define:

- exact magnesium-citrate form,
- CAS / identity where appropriate,
- elemental magnesium assay,
- COA specification.

No finished label may infer elemental magnesium from the generic ingredient name alone.

---

## 5. RECOVERED ELEMENTAL PROFILE

Using the historical compound masses:

| Mineral | Approximate elemental amount |
|---|---:|
| Sodium | ~295 mg |
| Potassium | ~131 mg |
| Magnesium | ~11–16 mg, form-dependent |

Approximate elemental sodium:potassium mass ratio:

**2.25 : 1**

or potassium:sodium:

**0.44 : 1**

### Consequence

The historical formula is not accurately described as **potassium-forward** on an elemental-mass basis.

Current governance state:

**POTASSIUM_FORWARD = REJECTED FOR HISTORICAL FORMULA**

A future revised formula may earn a different characterization.

---

## 6. CARBOHYDRATE MODEL

Recovered dextrose:

**1.5 g per serving**

D-glucose molecular weight:
180.16 g/mol

This equals approximately:

**8.33 mmol glucose per serving**

At 500 mL:
- ~16.7 mmol/L glucose

The amount is materially lower than current Hydrant's 4 g sugar serving and vastly lower in mass than protein-based pre-meal products.

This does not prove a superior physiological effect.

---

## 7. FIRST-PASS IDEAL OSMOLARITY MODEL

This is an engineering approximation, not measured osmolality.

Assumptions:

- ideal dissociation,
- NaCl approximated as 2 particles,
- KCl approximated as 2 particles,
- glucose approximated as 1 particle,
- magnesium-citrate contribution modeled using plausible citrate forms,
- no activity-coefficient correction,
- no flavor/acids/excipients.

### Historical 500 mL preparation

Approximate ideal particle concentration:

**~83 mOsm/L**

depending modestly on magnesium-citrate form.

### Same powder mass at alternate volumes

| Water volume | Approx. ideal osmolarity |
|---|---:|
| 500 mL | ~83 mOsm/L |
| 350 mL | ~119 mOsm/L |
| 300 mL | ~139 mOsm/L |
| 250 mL | ~166–167 mOsm/L |

### Interpretation boundary

These values are calculated formulation-screening estimates only.

Final product requires:
- exact raw-material specification,
- complete finished formula,
- measured osmolality if osmolality is a design or claim variable.

---

## 8. SERVING-VOLUME CHALLENGE

Historical:
**500 mL**

### Advantages
- low concentration,
- straightforward dissolution,
- substantial water load,
- very low powder burden per unit water.

### Possible disadvantages
- 500 mL immediately before a meal may create avoidable stomach-volume burden,
- may reduce adherence,
- may blur product identity into ordinary hydration behavior.

### Candidate engineering volumes

#### R0 — Historical
500 mL

#### R1 — Compact pre-meal candidate
350 mL

#### R2 — Higher-concentration engineering test
250–300 mL

### Current preferred development candidate

**R1 = 350 mL**

Reason:
- preserves the exact recovered four-ingredient composition,
- reduces pre-meal fluid burden by 30%,
- remains dilute in the first-pass osmolarity model,
- changes only one variable,
- avoids unnecessary ingredient expansion.

This is an engineering candidate, not a validated physiological optimum.

---

## 9. CARBOHYDRATE CHALLENGE

Historical:
**1.5 g dextrose**

### Current decision

**RETAIN FOR R1**

Reason:
- preserves recovered architecture,
- remains very low in absolute carbohydrate mass,
- avoids unnecessary reformulation before comparative testing,
- retains a sodium/glucose transport-compatible carbohydrate source without converting Baseline into a sugary hydration drink.

### Not established

- optimal amount,
- necessity for pre-meal outcomes,
- superiority to zero-carbohydrate version.

Therefore a future bench/human comparator may test:

**R1 vs identical zero-dextrose formulation**

before making mechanism claims.

---

## 10. ELECTROLYTE-RATIO CHALLENGE

Current historical elemental approximation:

- Na ~295 mg
- K ~131 mg
- Mg ~11–16 mg

### Current decision

**DO NOT ALTER Na/K YET**

Reason:

Changing the electrolyte ratio solely to appear unique would violate the anti-bloat / evidence-first rule.

Before changing it, a revision must have one of:

- physiological rationale tied specifically to pre-meal use,
- tolerability rationale,
- palatability rationale,
- bench finding,
- manufacturer constraint,
- comparative pilot signal.

### Consequence

Material differentiation cannot be manufactured artificially by moving electrolyte numbers.

---

## 11. INGREDIENT-BY-INGREDIENT PURPOSE

### Sodium chloride

Current engineering role:
- sodium + chloride source,
- electrolyte contribution,
- simple low-cost mineral salt.

Pre-meal-specific benefit:
**NOT YET VALIDATED**

### Potassium chloride

Current engineering role:
- potassium source,
- supports a mixed electrolyte profile.

Pre-meal-specific benefit:
**NOT YET VALIDATED**

### Magnesium citrate

Current engineering role:
- low-dose magnesium contribution,
- citrate salt candidate.

Pre-meal-specific benefit:
**NOT YET VALIDATED**

Exact form:
**UNRESOLVED**

### Dextrose

Current engineering role:
- very small carbohydrate load,
- potential sodium/glucose transport support.

Pre-meal-specific benefit:
**NOT YET VALIDATED**

### Water

Current engineering role:
- delivery vehicle,
- hydration contribution.

Pre-meal-specific benefit:
**NOT YET VALIDATED**

---

## 12. DIRECT COMPETITOR CROSSWALK

### Baseline historical / R1

Approximate active profile:
- Na ~295 mg
- K ~131 mg
- Mg ~11–16 mg
- dextrose 1.5 g
- four active ingredients
- R1 target water: 350 mL
- intended pre-meal use

### Hydrant Hydrate

Current public product information:
- sodium ~260 mg
- potassium ~200 mg
- magnesium ~30 mg
- sugar 4 g
- plus zinc, juice/flavor/acids and other formulation ingredients
- general rapid-hydration positioning

### LMNT Raw / DIY reference

Current official recipe:
- 2,500 mg NaCl → 1,000 mg sodium
- 385 mg KCl → 200 mg potassium
- magnesium malate source → 60 mg magnesium
- high-sodium electrolyte positioning

### BOOST Pre-Meal

Current public product information:
- 125 mL ready-to-drink
- 10 g whey protein
- 45 calories
- 1 g sugar
- 10–30 min before meal
- hunger/satiety and GLP-1-response positioning

---

## 13. WHAT IS ACTUALLY DIFFERENT TODAY

Compared with current reference products, R1 would be:

- lower sodium than LMNT,
- lower potassium and magnesium than Hydrant,
- much lower carbohydrate than standard Hydrant,
- dramatically lower macronutrient burden than BOOST,
- ingredient-minimal,
- explicitly positioned as a pre-meal transition preparation.

### Critical finding

That is **not yet sufficient to establish material functional differentiation**.

The formula remains chemically close to the electrolyte-hydration category.

The distinction is currently strongest in:

**use architecture + low material burden + absence of protein/fiber/stimulant architecture**

rather than a proven unique mechanism.

---

## 14. MINIMUM VIABLE FORMULATION

The current minimum viable engineering candidate is:

### BASELINE R1

Per serving:

- Sodium chloride — **750 mg**
- Potassium chloride — **250 mg**
- Magnesium citrate — **100 mg**, exact form to be selected
- Dextrose — **1.5 g**
- Water — **350 mL**

Approximate elemental:
- sodium ~295 mg
- potassium ~131 mg
- magnesium ~11–16 mg depending material

Approximate ideal osmolarity:
- ~119 mOsm/L

Approximate powder:
- ~2.6 g

### Change from historical Master Spec v1

Only:

**500 mL water → 350 mL water**

No new active ingredients.

---

## 15. WHY R1 EXISTS

R1 is not claimed as superior.

It is the smallest rational revision because it tests whether the original minimalist chemistry can better fit a pre-meal use case with less fluid burden.

It preserves the project's stated principle:

**fewer ingredients, stronger reasons, clearer use-case engineering**

---

## 16. SAFETY BOUNDARY

This artifact is not a personalized-use instruction.

Before prototype consumption or commercialization, the formula requires an appropriate safety review covering at minimum:

- renal impairment,
- potassium-sensitive conditions or medications,
- magnesium-sensitive conditions,
- sodium-restricted conditions,
- medication interactions,
- intended population,
- pregnancy/pediatric exclusions unless separately validated.

For context, NIH ODS states that the adult UL for supplemental magnesium is 350 mg/day and that impaired renal function increases magnesium-toxicity risk; the current modeled magnesium amount is far below that UL, but total intake and individual context still matter.

---

## 17. MANUFACTURER QUESTIONS NOW AUTHORIZED

For R1, manufacturers may be asked:

1. Which food/supplement-grade magnesium citrate material do you recommend?
2. What is its elemental magnesium assay?
3. Can all four ingredients remain fully soluble at 350 mL?
4. What excipients, if any, are required?
5. Can an unflavored or very lightly flavored stick be produced?
6. What is the MOQ?
7. What pilot quantity is available?
8. What finished-product assays are standard?
9. Can measured osmolality be included in prototype testing?
10. What packaging is compatible with hygroscopicity/stability?

FDA CGMP requirements apply to dietary supplements, and human-food requirements differ depending on final regulatory classification; classification remains to be resolved before commercialization.

---

## 18. DIFFERENTIATION DISPOSITION

### R1 formulation status

**ENGINEERED CANDIDATE**

### Material differentiation status

**REVISE — CLOSEST TO PASS**

Reason:

R1 creates a cleaner pre-meal delivery format while preserving the four-ingredient skeleton, but changing water volume does not by itself create a materially different physiological product.

### What is still required to earn PASS

At least one of the following must become evidence-backed:

1. the exact electrolyte/carbohydrate architecture is specifically useful for pre-meal transition,
2. the lower-burden formulation produces a measurable advantage over water,
3. it produces a measurable advantage over generic hydration at matched conditions,
4. a bench/manufacturer finding supports a unique delivery characteristic material to the use case.

---

## 19. NO-COMPLEXITY ESCALATION RULE

Do not add:
- L-theanine,
- taurine,
- glycine,
- zinc,
- botanicals,
- stimulants,
- protein,
- fiber,

merely to create differentiation.

Any addition requires a new admission decision.

---

## 20. NEXT DETERMINISTIC ARTIFACT

**BASELINE_MANUFACTURER_PROTOTYPE_SPEC_AND_RFQ_v1**

Purpose:

Convert R1 into a one-page manufacturer-facing engineering request containing:

- formula,
- elemental targets,
- raw-material identity requirements,
- 350 mL serving target,
- powder/stick target,
- flavor preference,
- excipient constraint,
- measured osmolality request,
- prototype quantity request,
- MOQ request,
- stability/testing questions,
- explicit PROTOTYPE / NOT CLINICALLY VALIDATED status.

Parallel scientific work can continue afterward.

---

## FINAL STATE

**HISTORICAL FORMULA = CHEMICALLY RECONCILED**  
**ELEMENTAL SODIUM = ~295 mg**  
**ELEMENTAL POTASSIUM = ~131 mg**  
**ELEMENTAL MAGNESIUM = ~11–16 mg UNTIL EXACT MATERIAL LOCK**  
**HISTORICAL 500 mL IDEAL OSMOLARITY = ~83 mOsm/L**  
**R1 350 mL IDEAL OSMOLARITY = ~119 mOsm/L**  
**R1 = FOUR-INGREDIENT ENGINEERED CANDIDATE**  
**NO NEW ACTIVES ADDED**  
**DIFFERENTIATION = REVISE — CLOSEST TO PASS**  
**NEXT GATE = BASELINE_MANUFACTURER_PROTOTYPE_SPEC_AND_RFQ_v1**
