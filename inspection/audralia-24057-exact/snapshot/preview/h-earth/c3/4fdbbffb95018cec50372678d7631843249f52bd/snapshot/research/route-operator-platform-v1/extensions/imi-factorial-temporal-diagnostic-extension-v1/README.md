# IMI Factorial-Temporal Diagnostic Extension v1

This package standardizes the empirically supported distinction among current condition, direction, persistence, and bottleneck while preserving the frozen IMI core.

## Authority boundary

The extension consumes a time-ordered series of immutable core snapshot receipts. It verifies exact route and version comparability, calculates change from the existing snapshot values, classifies direction under a route-specific meaningful-change threshold, classifies persistence under a frozen observation window, and reports the current bottleneck from the preserved factor vector.

It does not recalculate the core score, alter factors, alter normalizers, alter archived studies, define universal temporal thresholds, or claim restoration from score movement alone.

## Current operation

```text
OPERATION =
IMI_FACTORIAL_TEMPORAL_DIAGNOSTIC_EXTENSION_AND_PORTFOLIO_ELIGIBILITY_AUDIT_v1

REAL_REANALYSIS = NONE
NEXT_CANDIDATE =
AGRICULTURAL_FACTORIAL_TEMPORAL_RETROSPECTIVE_SUCCESSOR_REANALYSIS_v1
```

## Verification

Run from the repository root:

```bash
python research/route-operator-platform-v1/extensions/imi-factorial-temporal-diagnostic-extension-v1/verify_factorial_temporal_extension_v1.py
```
