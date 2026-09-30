# BASELINE_R1_FORMULATION_VERIFICATION_AND_ELEMENTAL_MASS_LEDGER_v1

**Mode:** Formulation verification · Elemental-mass accounting · Non-drift  
**Program:** MASTER_NUTRITION_RESEARCH_ENGINEERING_PROGRAM_v1  
**Object:** OBJECT_B_BASELINE  
**Protocol authority:** BASELINE_R1_WATER_COMPARATOR_PILOT_PROTOCOL_v1  
**Parameter authority:** BASELINE_R1_PILOT_PARAMETER_LOCK_v1  
**Status:** THEORETICAL Na/K MASS VERIFIED · Mg MATERIAL IDENTITY OPEN · LOT/COA VERIFICATION OPEN  
**Date:** 2026-09-22

---

## 1. PURPOSE

Resolve exactly what is present in one R1 serving and distinguish:

1. weighed raw-material mass,
2. theoretical elemental mass from chemical stoichiometry,
3. supplier-declared assay,
4. certificate-of-analysis verified mass,
5. final released per-serving composition.

No human dosing is authorized by this ledger.

R2 remains **NOT YET AUTHORIZED**.

---

## 2. FROZEN R1 RAW-MATERIAL TARGETS

Per serving:

| Material | Target raw-material mass |
|---|---:|
| Sodium chloride | 750.0 mg |
| Potassium chloride | 250.0 mg |
| Magnesium citrate material | 100.0 mg |
| Dextrose | 1,500.0 mg |
| Water | 350 mL |

Total specified dry material:

**2,600.0 mg**

This is a raw-material total, not an elemental-mineral total.

---

## 3. ACCOUNTING LAW

For a chemically defined mineral salt:

**elemental mass = raw-material mass × verified assay fraction × elemental stoichiometric fraction**

If the material is not 100% pure/anhydrous or its hydration/specification differs, nominal stoichiometry alone is insufficient for final release.

For supplier products whose specification directly states elemental mineral content, use the verified supplier assay/COA and reconcile it against the chemical identity.

Do not confuse the mass of a mineral-containing compound with the mass of the elemental mineral.

---

## 4. SODIUM CHLORIDE — THEORETICAL LEDGER

Assumed chemical identity for theoretical calculation:

**NaCl**

Reference atomic/molar values used for ledger arithmetic:

- Na ≈ 22.9898 g/mol
- Cl ≈ 35.45 g/mol
- NaCl ≈ 58.4398 g/mol

Theoretical sodium fraction:

**22.9898 / 58.4398 ≈ 0.39339**

For 750.0 mg nominal pure NaCl:

**elemental sodium ≈ 295.0 mg**

Theoretical chloride fraction:

**35.45 / 58.4398 ≈ 0.60661**

For 750.0 mg nominal pure NaCl:

**chloride ≈ 455.0 mg**

### Release status

- chemical calculation: **VERIFIED THEORETICALLY**
- supplier identity: **OPEN**
- purity/assay: **OPEN**
- lot/COA: **OPEN**
- final release value: **NOT YET VERIFIED**

Final elemental sodium must be recalculated from the actual ingredient specification/assay if materially different from nominal purity.

---

## 5. POTASSIUM CHLORIDE — THEORETICAL LEDGER

Assumed chemical identity for theoretical calculation:

**KCl**

Reference atomic/molar values used for ledger arithmetic:

- K ≈ 39.0983 g/mol
- Cl ≈ 35.45 g/mol
- KCl ≈ 74.5483 g/mol

Theoretical potassium fraction:

**39.0983 / 74.5483 ≈ 0.52447**

For 250.0 mg nominal pure KCl:

**elemental potassium ≈ 131.1 mg**

Theoretical chloride fraction:

**35.45 / 74.5483 ≈ 0.47553**

For 250.0 mg nominal pure KCl:

**chloride ≈ 118.9 mg**

### Release status

- chemical calculation: **VERIFIED THEORETICALLY**
- supplier identity: **OPEN**
- purity/assay: **OPEN**
- lot/COA: **OPEN**
- final release value: **NOT YET VERIFIED**

The potassium amount is material to safety screening. It must be treated as approximately 131 mg only under the nominal pure-KCl assumption until supplier verification is complete.

---

## 6. MAGNESIUM CITRATE — DO NOT INFER

Frozen raw-material target:

**100.0 mg magnesium citrate material**

Elemental magnesium:

**UNKNOWN UNTIL MATERIAL IDENTITY AND ASSAY ARE VERIFIED**

“Magnesium citrate” is not enough information for final elemental accounting. The material specification must establish the actual chemical/product form and its declared/assayed elemental magnesium content.

The ledger therefore prohibits assigning a guessed elemental-magnesium value.

Required before release:

- exact product name,
- manufacturer/supplier,
- catalog/SKU,
- chemical form/specification,
- hydration state where applicable,
- assay/purity specification,
- declared elemental magnesium percentage or equivalent,
- lot number,
- COA,
- calculation reconciliation.

NIH ODS notes that supplement labels declare elemental magnesium rather than the total mass of the magnesium-containing compound; that distinction is adopted as an accounting control here.

### Release status

- raw-material target: **LOCKED — 100.0 mg**
- chemical identity: **OPEN**
- elemental fraction: **OPEN**
- elemental magnesium: **OPEN**
- lot/COA: **OPEN**
- final release: **BLOCKED**

---

## 7. DEXTROSE LEDGER

Target:

**1,500.0 mg dextrose material**

Before release verify:

- exact product identity,
- anhydrous versus monohydrate/specification where relevant,
- food/pharmaceutical grade as appropriate to study setting,
- purity/assay,
- supplier,
- lot,
- COA/specification.

The pilot does not treat this 1.5 g quantity as evidence of glycemic buffering.

### Release status

- target mass: **LOCKED**
- supplier/specification: **OPEN**
- lot/COA: **OPEN**
- final release: **BLOCKED**

---

## 8. WATER LEDGER

Target final serving vehicle:

**350 mL water**

Freeze before execution:

- source/type,
- preparation procedure,
- measured volume method,
- acceptable volume tolerance,
- serving-temperature range.

The same water source and procedure must be used for R1 and comparator where practical.

---

## 9. THEORETICAL PER-SERVING SUMMARY

Under nominal pure-salt assumptions only:

| Quantity | Theoretical amount |
|---|---:|
| NaCl raw material | 750.0 mg |
| Elemental sodium from NaCl | ≈295.0 mg |
| Chloride from NaCl | ≈455.0 mg |
| KCl raw material | 250.0 mg |
| Elemental potassium from KCl | ≈131.1 mg |
| Chloride from KCl | ≈118.9 mg |
| Total theoretical chloride from NaCl + KCl | ≈573.9 mg |
| Magnesium citrate material | 100.0 mg |
| Elemental magnesium | **UNKNOWN** |
| Dextrose material | 1,500.0 mg |
| Total dry material | 2,600.0 mg |
| Water | 350 mL |

These values are formulation-accounting values, not clinical claims.

---

## 10. SUPPLIER / LOT VERIFICATION TABLE

Complete one row for each ingredient actually used.

| Field | NaCl | KCl | Magnesium citrate | Dextrose |
|---|---|---|---|---|
| Supplier | OPEN | OPEN | OPEN | OPEN |
| Product name | OPEN | OPEN | OPEN | OPEN |
| SKU/catalog | OPEN | OPEN | OPEN | OPEN |
| Lot | OPEN | OPEN | OPEN | OPEN |
| Chemical form | NaCl* | KCl* | OPEN | OPEN |
| Grade/specification | OPEN | OPEN | OPEN | OPEN |
| Assay/purity | OPEN | OPEN | OPEN | OPEN |
| Elemental fraction | theoretical only | theoretical only | OPEN | N/A |
| COA obtained | No | No | No | No |
| COA accepted | OPEN | OPEN | OPEN | OPEN |
| Release status | BLOCKED | BLOCKED | BLOCKED | BLOCKED |

*Identity still requires supplier/COA confirmation.

---

## 11. COA ACCEPTANCE GATE

A material cannot be released merely because its package name resembles the formulation name.

Verify at minimum:

- supplier/manufacturer identity,
- ingredient identity,
- lot match,
- assay/purity,
- relevant contaminant/microbiological specifications appropriate to the material and study setting,
- expiration/retest date,
- storage requirements,
- document authenticity/completeness.

Any discrepancy between purchase label, specification sheet, and COA is resolved before use.

---

## 12. WEIGHING CONTROL

Before preparation for any human study:

- use equipment suitable for the required masses,
- document scale readability and capacity,
- verify/calibrate according to the study quality procedure,
- define acceptable weighing tolerances prospectively,
- retain batch/serving preparation records,
- use independent check or equivalent verification where required by the study setting.

This ledger does not authorize kitchen-scale approximation of milligram quantities.

---

## 13. BATCH / SERVING TRACEABILITY

Each prepared R1 serving must be traceable to:

- preparation ID,
- date/time,
- preparer/operator,
- ingredient lot numbers,
- target masses,
- actual recorded masses,
- water volume,
- final volume/procedure if separately controlled,
- deviations,
- release/check status.

No anonymous or untraceable ingredient transfer is permitted.

---

## 14. ELEMENTAL-MASS RELEASE FORMULA

For each mineral ingredient, final release uses:

**Released elemental amount (mg) = actual raw-material target (mg) × accepted assay factor × accepted elemental fraction**

Where the supplier assay directly expresses elemental content, document the conversion and avoid double-applying an elemental fraction.

All calculations require an independent arithmetic check before the formulation is marked verified.

---

## 15. SAFETY INTERPRETATION BOUNDARY

The ledger establishes composition; it does not establish safety for a particular person.

Potassium-containing products require particular caution in people with kidney disease and with medications/conditions affecting potassium handling. NIH ODS specifically notes hyperkalemia risk in susceptible people and that potassium chloride is a common supplemental form.

The pilot's exclusion/safety review remains controlling.

---

## 16. LABEL / CLAIM BOUNDARY

Do not describe:

- 750 mg NaCl as “750 mg sodium,”
- 250 mg KCl as “250 mg potassium,”
- 100 mg magnesium citrate material as “100 mg magnesium.”

Elemental nutrient amounts and compound masses are different quantities.

NIH ODS explicitly uses elemental nutrient amounts for supplement-label mineral declarations; this ledger follows that distinction.

---

## 17. FORMULATION VERIFICATION STATE

### Sodium chloride
**THEORETICAL ELEMENTAL MASS RESOLVED · MATERIAL VERIFICATION OPEN**

### Potassium chloride
**THEORETICAL ELEMENTAL MASS RESOLVED · MATERIAL VERIFICATION OPEN**

### Magnesium citrate
**ELEMENTAL MASS UNRESOLVED · MATERIAL VERIFICATION OPEN**

### Dextrose
**TARGET MASS RESOLVED · MATERIAL VERIFICATION OPEN**

### Water
**TARGET VOLUME RESOLVED · SOURCE/MEASUREMENT SOP OPEN**

Overall:

**FORMULATION NOT RELEASED FOR HUMAN EXECUTION**

---

## 18. HARD BLOCKERS

Human execution remains blocked until all of the following are complete:

- [ ] NaCl supplier/specification/lot/COA accepted
- [ ] KCl supplier/specification/lot/COA accepted
- [ ] magnesium-citrate exact identity resolved
- [ ] magnesium elemental fraction/assay resolved
- [ ] magnesium lot/COA accepted
- [ ] dextrose specification/lot/COA accepted
- [ ] water source/measurement procedure frozen
- [ ] elemental-mass ledger recalculated from accepted material data
- [ ] arithmetic independently checked
- [ ] weighing tolerances/equipment SOP frozen
- [ ] preparation/traceability record validated
- [ ] qualified safety/human-subject review complete

---

## 19. NO FORMULATION DRIFT

If supplier verification reveals that the actual magnesium-citrate material or another ingredient materially differs from what was assumed, do not silently substitute a new mass to preserve a desired elemental amount.

That would constitute a formulation change.

Required response:

1. document discrepancy,
2. determine whether R1 requires amendment,
3. perform safety/mechanism review,
4. version the formulation if changed,
5. update protocol documents prospectively.

R1 remains the frozen object until such an amendment is explicitly authorized.

---

## 20. NEXT DETERMINISTIC ARTIFACT

**BASELINE_R1_MATERIAL_SOURCE_AND_COA_ACCEPTANCE_REGISTER_v1**

Purpose:

- identify candidate/source materials,
- capture supplier and catalog identifiers,
- capture lot/COA records,
- reconcile specifications against this ledger,
- mark each material ACCEPT / REJECT / PENDING,
- prevent unverified material from entering a human pilot.

Until that register is complete and the other human-study gates are satisfied:

**NOT CLEARED FOR HUMAN EXECUTION.**

R2 remains **NOT YET AUTHORIZED**.
