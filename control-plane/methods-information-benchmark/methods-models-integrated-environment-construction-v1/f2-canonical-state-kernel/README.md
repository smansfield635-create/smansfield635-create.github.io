# F2 — Canonical State Kernel

Program: `METHODS_MODELS_INTEGRATED_ENVIRONMENT_CONSTRUCTION_v1`

Preserved target: `TEXT_FIRST_STATEFUL_METHODS_MODELS_ENVIRONMENT_v1`

Input authority: F1 `PASS_CLOSED`, exact final-program head `82ad9ca532003bb66845ab4002d395ec4c630ca3`.

## Purpose

F2 freezes the complete state vocabulary and shape required to represent one exact Methods & Models environment state without allowing representation, navigation, or interface state to rewrite scientific meaning.

The required 13 axes are:

`SYSTEM`, `SCIENTIFIC_OBJECT`, `MODEL`, `METHOD_STAGE`, `EVIDENCE`, `EXECUTION`, `CUSTODY`, `CLAIM_CEILING`, `SUPPORT_MODE`, `LENS`, `VIEW_MODE`, `ROUTE_HISTORY`, `CONTENT_VERSION`.

## Structural reconciliation

The 13-axis envelope is the complete restorable environment state. It is not a claim that all 13 axes are scientific-identity axes.

The kernel therefore separates state planes:

- `SCIENTIFIC_REFERENT`: system and scientific-object identity;
- `ANALYTIC_CONTEXT`: model, method stage, and support/substitution classification;
- `EVIDENTIARY_STATE`: evidence, execution, custody, and claim ceiling;
- `REPRESENTATION`: lens and view mode;
- `NAVIGATION`: route history;
- `CONTENT_BINDING`: content version.

CP6 `AUTHORITY` is preserved as mandatory per-axis provenance metadata (`authorityRef`), not added as a fourteenth state axis. CP6 `OBJECT_CLASS` is represented inside `SCIENTIFIC_OBJECT.value.objectClass`.

## F2 boundaries

F2 defines state structure, axis semantics, provenance requirements, mutation-authority classes, and shape-level conformance only.

F2 does **not** define defaults, precedence, cross-axis validity resolution, silent fallback, canonicalization algorithms, or runtime restoration behavior. Those belong to F3.

F2 does not bind scientific page content; that belongs to F4. It does not construct navigation, accessibility, spatial geometry, or the integrated environment.

## Non-negotiable distinctions

- `UNSET` is not `UNEVALUABLE`.
- `UNEVALUABLE` is not `NOT_APPLICABLE`.
- protocol/execution state is not evidence standing.
- custody state is not interface availability.
- support/substitution classification is not output success.
- lens/view/route changes may change presentation or location but may not change scientific meaning.
- content version participates in exact restoration but is not evidentiary strength.

## Advancement

F3 may consume this package only after the F2 fail-closed verifier passes and the F2 terminal receipt becomes effective. No F3 artifact is authorized by package construction alone.
