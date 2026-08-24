# Route Operator Research Platform v1

Release class: `PLATFORM_CORE_WITH_EXTERNAL_FROZEN_IMI_AUTHORITY`

Status: `PRE_EMPIRICAL_RESEARCH_PLATFORM_v1`

Mode: `READ_ONLY_SHADOW_RESEARCH`

This release establishes a common route-operator platform with four separated surfaces:

1. An immutable identity, Drive location, and approved SHA-256 pointer for the already-built observer-grade IMI instrument.
2. The MCCI mathematical-component-continuity scoring kernel.
3. The GESI graphic-expression-stability scoring kernel.
4. An empirical research engine for identity-bound theory records, receipt locks, temporal priority, and theory-result crosswalks.

The complete IMI manual, classifier, temporal rules, schemas, registry, fixtures, implementation, and reliability-pilot protocol remain in the private frozen Drive package. They are not repository-native in this PR.

MCCI and GESI are scoring kernels and read-only adapters, not yet observer-grade empirical instruments. Their factor dictionaries, normalization manuals, source-admission manuals, observer guides, reliability protocols, and study-specific fixture lattices remain successor work.

H-Earth and Four Compass connect only through read-only adapters. Native systems remain authoritative for native facts and verdicts. The platform does not mutate runtime state, rendering, benchmark authority, deployment, or production surfaces.

## Enforced controls

The platform enforces:

- `INVALID > UNEVALUABLE > NUMERIC` for snapshots and series;
- exact study/instrument/route/version compatibility before theory evaluation;
- cryptographic verification of the observed receipt and declared data lock;
- explicit analysis-code SHA-256 reconciliation;
- `THEORY_FROZEN_AT < DATA_LOCKED_AT <= ANALYSIS_STARTED_AT <= ANALYSIS_COMPLETED_AT`;
- registered source classes, exact Booleans, nonempty identifiers, finite ranges, and nonnegative tolerances;
- explicit native hard-gate rules rather than nonzero-value inference;
- executable source-manifest and private IMI-pointer verification in CI.

A pointer-only data lock must be explicitly declared as `POINTER_ONLY`. It is reported as pointer-only, not as locally recomputed data custody.

## Run

```bash
cd research/route-operator-platform-v1
python -m unittest -v test_route_operator_platform_v1.py
python demo_route_operator_platform_v1.py
```

## First-release boundary

This release proves the platform architecture through synthetic H-Earth and Four Compass receipts. It does not establish observer reliability, criterion validity, predictive validity, production mappings, or empirical results.
