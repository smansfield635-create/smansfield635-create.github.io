# Operator guide

## Authority boundary

```text
BASELINE_HEAD = ab636b11e32253ece8e00f05993d980f747fa980
BASELINE_DISPOSITION = PRESERVE_AS_OPERATIONAL_SPATIAL_REFERENCE
PUBLIC_METHODS_MUTATION = PROHIBITED
BASELINE_ARCHITECTURE_MUTATION = PROHIBITED
MERGE = PROHIBITED
USER_REVIEW = HELD
FULL_1575_STATE_CERTIFICATION = HELD
```

The carrier imports the baseline extractor, registry builder, registry validator, resolver, native bridge, and return-snapshot constructor. It does not copy a second canonical model registry and does not change public Methods.

## Canonical chain

```text
CANONICAL_MODEL_RECORD
  → CONTENT_PRESERVING_RENDERER_DESCRIPTOR
    → LIFECYCLE_SPECIFIC_SPATIAL_PROJECTION
```

Every semantic descriptor contains the exact canonical model values for title, question, statement, equation, equation label, Practical, Engineering, Evidence, purpose, symbols, architecture, operation, failure, limits, source state, and status. Renderer-owned additions are limited to equation-form classification and deterministic canonical-source reference.

## Explicit equation-form mappings

| Canonical model | Form class |
|---|---|
| envelope-451 | ENVELOPE |
| gate-448 | GATE_OR_MINIMUM |
| spine-minimum | GATE_OR_MINIMUM |
| collapse-qualified | GATE_OR_MINIMUM |
| membrane-61 | BOUNDARY_OR_NO_MATCH |
| anchors-9 | BOUNDARY_OR_NO_MATCH |
| pressure-field | MULTIPLICATIVE |
| capacity-field | MULTIPLICATIVE |
| pcr | RATIO |
| stability | COMPLEMENT |
| hazard | COMPLEMENT |
| complement | COMPLEMENT |
| zero-aware | MULTIPLICATIVE |
| mass-ledger | LEDGER |
| residual-u | LEDGER |
| closure-threshold | THRESHOLD |
| energy-loop | CYCLE |
| useful-output | THRESHOLD |
| first | DIAGNOSTIC_PATH |
| integral-method | FALSIFICATION_PATH |
| diagnostic-five | DIAGNOSTIC_PATH |
| abcd | DIAGNOSTIC_PATH |
| falsification | FALSIFICATION_PATH |
| no-match | BOUNDARY_OR_NO_MATCH |
| fixtures | FALSIFICATION_PATH |

An unknown, missing, or inadmissible mapping throws and fails validation.

## Projection states

`Overview` keeps all four family regions, every model destination, all 25 equation signatures, source-state distribution, family title/question, and relationship structure present in the scene.

`Browse` retains the native family/model/lens identity and uses the baseline resolver to center the active model with immediate neighbors and family context. Lens changes replace only the active canonical Practical, Engineering, or Evidence projection.

`Inspection` exposes the complete canonical record in a foreground workbench. The source-state, status, equation-form class, and canonical source reference remain visible. Closing inspection uses the preserved immutable snapshot and all twelve exact-return predicates.

## Source-state expression

```text
confirmed → PRESERVED_CONFIRMED_ARCHITECTURE
hold      → PRESERVED_ARCHITECTURE_WITH_VISIBLE_RECOVERY_BOUNDARY
```

Source-held records remain present, navigable, inspectable, mathematically legible, and spatially related. Their environmental boundary uses dashed custody geometry and a recovery-field material. It does not label them false, invalid, absent, disabled, failed, or disproven.

## Evidence outputs

Static validation emits:

- canonical source digest;
- extracted catalog digest;
- 25-model canonical-to-descriptor crosswalk;
- 25-model equation-form mapping;
- semantic completeness report;
- source-state preservation report;
- placeholder/fallback absence report;
- semantic static-gate result.

Browser observation emits:

- desktop and mobile state captures;
- complete desktop and mobile inspection captures;
- desktop and mobile exact-return receipts;
- cross-family representative evidence;
- observer result with console, page, and request failure records.

A successful workflow establishes semantic embodiment only. It does not establish beauty, final art direction, user acceptance, empirical validation, public promotion, merge readiness, or complete 1,575-state certification.
