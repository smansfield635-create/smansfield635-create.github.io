# BASELINE_R1_MATERIAL_SOURCE_AND_COA_ACCEPTANCE_REGISTER_v1

**Mode:** Material-source control · COA acceptance · Non-drift  
**Program:** MASTER_NUTRITION_RESEARCH_ENGINEERING_PROGRAM_v1  
**Object:** OBJECT_B_BASELINE  
**Ledger authority:** BASELINE_R1_FORMULATION_VERIFICATION_AND_ELEMENTAL_MASS_LEDGER_v1  
**Status:** REGISTER LOCKED · ALL MATERIALS PENDING SOURCE/COA EVIDENCE  
**Date:** 2026-09-22

---

## 1. PURPOSE

Create the controlled acceptance register for every material entering Baseline R1.

This register prevents an ingredient from being treated as study-ready merely because its commercial name resembles the frozen formulation.

Every material must terminate in exactly one status:

- **ACCEPT**
- **REJECT**
- **PENDING**

No human-study serving may contain a material still marked PENDING or REJECT.

This artifact does not authorize purchasing, compounding, dosing, recruitment, or R2 development.

---

## 2. FROZEN R1 MATERIAL SET

| Material ID | Frozen material | Target per serving | Current status |
|---|---|---:|---|
| R1-M01 | Sodium chloride | 750.0 mg | PENDING |
| R1-M02 | Potassium chloride | 250.0 mg | PENDING |
| R1-M03 | Magnesium citrate material | 100.0 mg | PENDING |
| R1-M04 | Dextrose | 1,500.0 mg | PENDING |
| R1-M05 | Water | 350 mL | PENDING |

No additional active ingredient is authorized.

---

## 3. ACCEPTANCE LAW

A dry material can be marked **ACCEPT** only after the study record contains enough evidence to verify:

1. exact supplier/manufacturer,
2. exact product/catalog identity,
3. intended chemical/material identity,
4. grade/specification appropriate to the intended research use,
5. lot identity,
6. current COA or equivalent lot-specific quality documentation,
7. assay/purity where applicable,
8. relevant elemental declaration/calculation where applicable,
9. expiration/retest status,
10. storage requirements,
11. material/COA/label consistency,
12. acceptance review signature or controlled reviewer identity.

Water follows a separate source/quality/measurement acceptance path defined below.

---

## 4. DECISION DEFINITIONS

### ACCEPT

All mandatory evidence is present and internally consistent, and the material matches the frozen R1 identity closely enough to enter the preparation system without changing the formulation.

### REJECT

Evidence establishes that the material is unsuitable, mismatched, expired/out-of-specification, inadequately documented, or would require a formulation change.

### PENDING

Evidence is incomplete or unresolved.

**PENDING is not provisional acceptance.**

---

# 5. R1-M01 — SODIUM CHLORIDE REGISTER

### Frozen identity

Target compound:

**Sodium chloride (NaCl)**

Target raw-material mass:

**750.0 mg/serving**

Nominal theoretical elemental sodium under pure-NaCl assumption:

**≈295.0 mg**

### Source record

| Field | Record |
|---|---|
| Supplier | PENDING |
| Manufacturer if different | PENDING |
| Product name | PENDING |
| Catalog/SKU | PENDING |
| Grade/specification | PENDING |
| Lot number | PENDING |
| Manufacture date | PENDING |
| Expiration/retest date | PENDING |
| Storage requirement | PENDING |
| Package/label archived | PENDING |
| Specification sheet archived | PENDING |
| COA archived | PENDING |

### Identity / quality reconciliation

| Check | Result |
|---|---|
| Identity explicitly NaCl | PENDING |
| Lot on container matches COA | PENDING |
| Assay/purity documented | PENDING |
| Assay within supplier specification | PENDING |
| Relevant contaminant limits reviewed | PENDING |
| Relevant microbiological criteria reviewed where applicable | PENDING |
| Storage/expiry acceptable | PENDING |
| Ledger elemental calculation reconciled | PENDING |

### Final decision

**PENDING**

Reviewer: ______  
Date: ______  
Rationale: ______

---

# 6. R1-M02 — POTASSIUM CHLORIDE REGISTER

### Frozen identity

Target compound:

**Potassium chloride (KCl)**

Target raw-material mass:

**250.0 mg/serving**

Nominal theoretical elemental potassium under pure-KCl assumption:

**≈131.1 mg**

### Source record

| Field | Record |
|---|---|
| Supplier | PENDING |
| Manufacturer if different | PENDING |
| Product name | PENDING |
| Catalog/SKU | PENDING |
| Grade/specification | PENDING |
| Lot number | PENDING |
| Manufacture date | PENDING |
| Expiration/retest date | PENDING |
| Storage requirement | PENDING |
| Package/label archived | PENDING |
| Specification sheet archived | PENDING |
| COA archived | PENDING |

### Identity / quality reconciliation

| Check | Result |
|---|---|
| Identity explicitly KCl | PENDING |
| Lot on container matches COA | PENDING |
| Assay/purity documented | PENDING |
| Assay within supplier specification | PENDING |
| Relevant contaminant limits reviewed | PENDING |
| Relevant microbiological criteria reviewed where applicable | PENDING |
| Storage/expiry acceptable | PENDING |
| Ledger elemental calculation reconciled | PENDING |

### Final decision

**PENDING**

Reviewer: ______  
Date: ______  
Rationale: ______

---

# 7. R1-M03 — MAGNESIUM CITRATE REGISTER

### Frozen identity

Target description:

**Magnesium citrate material**

Target raw-material mass:

**100.0 mg/serving**

Elemental magnesium:

**UNRESOLVED**

This is the highest-priority material-identity gate.

### Mandatory identity fields

| Field | Record |
|---|---|
| Supplier | PENDING |
| Manufacturer if different | PENDING |
| Product name | PENDING |
| Catalog/SKU | PENDING |
| Lot number | PENDING |
| Exact chemical/product form | PENDING |
| Hydration state/specification where applicable | PENDING |
| Molecular/formula information where applicable | PENDING |
| Grade/specification | PENDING |
| Assay/purity | PENDING |
| Declared elemental Mg % or equivalent | PENDING |
| Manufacture date | PENDING |
| Expiration/retest date | PENDING |
| Storage requirement | PENDING |
| Package/label archived | PENDING |
| Specification sheet archived | PENDING |
| COA archived | PENDING |

### Reconciliation

Required calculation:

**elemental Mg per 100.0 mg material = verified elemental Mg fraction × 100.0 mg**

Do not assign an elemental value until the actual material documentation supports it.

| Check | Result |
|---|---|
| “Magnesium citrate” identity resolved beyond marketing name | PENDING |
| Lot matches COA | PENDING |
| Assay/purity documented | PENDING |
| Elemental Mg content resolved | PENDING |
| Elemental calculation independently checked | PENDING |
| Relevant contaminants reviewed | PENDING |
| Relevant microbiological criteria reviewed where applicable | PENDING |
| Storage/expiry acceptable | PENDING |
| Material fits frozen R1 without mass change | PENDING |

### Formulation-drift gate

If the verified product would require changing the frozen 100.0 mg raw-material mass to achieve a preferred elemental-magnesium target:

**STOP.**

That is a formulation amendment, not material verification.

### Final decision

**PENDING**

Reviewer: ______  
Date: ______  
Rationale: ______

---

# 8. R1-M04 — DEXTROSE REGISTER

### Frozen identity

Target:

**Dextrose material — 1,500.0 mg/serving**

### Mandatory source fields

| Field | Record |
|---|---|
| Supplier | PENDING |
| Manufacturer if different | PENDING |
| Product name | PENDING |
| Catalog/SKU | PENDING |
| Lot number | PENDING |
| Exact specification/form | PENDING |
| Anhydrous/monohydrate status where relevant | PENDING |
| Grade | PENDING |
| Assay/purity | PENDING |
| Manufacture date | PENDING |
| Expiration/retest date | PENDING |
| Storage requirement | PENDING |
| Package/label archived | PENDING |
| Specification sheet archived | PENDING |
| COA archived | PENDING |

### Reconciliation

| Check | Result |
|---|---|
| Identity consistent with frozen dextrose material | PENDING |
| Lot matches COA | PENDING |
| Form/specification resolved | PENDING |
| Assay/purity acceptable | PENDING |
| Relevant contaminants reviewed | PENDING |
| Relevant microbiological criteria reviewed where applicable | PENDING |
| Storage/expiry acceptable | PENDING |
| No formulation mass change required | PENDING |

### Final decision

**PENDING**

Reviewer: ______  
Date: ______  
Rationale: ______

---

# 9. R1-M05 — WATER REGISTER

Target:

**350 mL/serving**

The same accepted source should be used for R1 and matched-water comparator where practical.

### Source record

| Field | Record |
|---|---|
| Water source/type | PENDING |
| Supplier/system | PENDING |
| Quality documentation appropriate to setting | PENDING |
| Container/source lot where applicable | PENDING |
| Storage procedure | PENDING |
| Measurement device | PENDING |
| Volume tolerance | PENDING |
| Serving-temperature procedure | PENDING |
| R1/comparator source matched | PENDING |

### Final decision

**PENDING**

Reviewer: ______  
Date: ______  
Rationale: ______

---

## 10. DOCUMENT CUSTODY

For every accepted material, retain or link:

- product label/package record,
- supplier specification,
- lot-specific COA where available/required,
- safety/handling documentation where applicable,
- receipt/purchase record where relevant,
- acceptance review,
- elemental calculation worksheet for mineral ingredients.

Documents should be named so the ingredient and lot can be reconstructed without relying on memory.

Suggested naming convention:

`R1_[MATERIAL_ID]_[SUPPLIER]_[LOT]_[DOCUMENT_TYPE]_[DATE]`

---

## 11. COA DISCREPANCY RULE

If any of the following disagree:

- container label,
- supplier product page/specification,
- COA,
- invoice/product identifier,

the material remains:

**PENDING**

until the discrepancy is resolved.

Do not choose whichever document best preserves the desired formulation.

---

## 12. LOT CHANGE RULE

Acceptance is lot-specific where lot-specific quality documentation is used.

A new lot requires:

1. new lot entry,
2. document reconciliation,
3. expiry/retest check,
4. assay review,
5. elemental recalculation if assay affects elemental amount,
6. acceptance decision.

Previous-lot acceptance does not automatically release a new lot.

---

## 13. MATERIAL SUBSTITUTION RULE

A different supplier, chemical form, hydration state, grade, or materially different assay/specification is not automatically interchangeable.

Classify the change as either:

### Equivalent source change

Documentation demonstrates the material remains within the frozen formulation definition and does not materially alter delivered composition.

or

### Formulation amendment

The change alters the scientific object being tested.

Formulation amendments require prospective versioning and protocol review.

---

## 14. ACCEPTANCE SUMMARY

| Material ID | Material | Decision | Critical unresolved item |
|---|---|---|---|
| R1-M01 | Sodium chloride | PENDING | supplier/lot/COA |
| R1-M02 | Potassium chloride | PENDING | supplier/lot/COA |
| R1-M03 | Magnesium citrate | PENDING | exact identity + elemental Mg + COA |
| R1-M04 | Dextrose | PENDING | exact form + supplier/lot/COA |
| R1-M05 | Water | PENDING | source/quality/measurement SOP |

Released materials:

**0 / 5**

---

## 15. HUMAN-EXECUTION GATE

Material release alone is insufficient to begin a human pilot.

Human execution remains blocked until the broader program gates are also complete, including:

- qualified human-subject/safety review appropriate to the setting,
- participant screening and consent,
- standardized meal commercial-product lock,
- preparation/weighing SOP,
- randomization custody,
- adverse-event responsibility,
- validated data capture.

Current status:

**MATERIAL REGISTER ESTABLISHED · ZERO MATERIALS ACCEPTED · NOT CLEARED FOR HUMAN EXECUTION**

---

## 16. NEXT DETERMINISTIC ACTION

The register cannot honestly advance to ACCEPT without real supplier/lot documentation.

Therefore the next gate is evidentiary rather than theoretical:

**Acquire and attach the exact candidate product specification and lot/COA evidence for R1-M01 through R1-M04, plus the intended water-source specification for R1-M05.**

Once those records exist, perform:

**BASELINE_R1_MATERIAL_ACCEPTANCE_ADJUDICATION_v1**

That adjudication will mark each material ACCEPT / REJECT / PENDING and recalculate the released elemental ledger from actual material evidence.

R2 remains **NOT YET AUTHORIZED**.
