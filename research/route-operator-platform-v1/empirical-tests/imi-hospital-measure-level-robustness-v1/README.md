# IMI Hospital Measure-Level Robustness Extension 1B

## Controlling status

`OPERATION = HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B`

`EXECUTION_GATE = PASS_CLOSED`

`CLASSIFICATION = EXPLORATORY_EMPIRICAL_ROBUSTNESS_TEST`

`INDEPENDENT_CROSS_DOMAIN_VALIDATION = NOT_SATISFIED`

`STUDY_CUSTODY = GITHUB_PRIMARY_WITH_HASH_BOUND_EXTERNAL_LARGE_BYTE_REDUNDANCY`

This directory is the primary operational record for Extension 1B. It is separate from the frozen IMI instrument and can be inspected, executed, extended, or compared without modifying that instrument.

## What GitHub contains directly

- frozen route definition and source identity;
- executable reconstruction and dependencies;
- primary summary, complete sensitivity results, collapse examples, and measure dictionary;
- complete report and resolved-clarifications receipt;
- complete successor manifest and exact File Library custody pointers;
- execution and publication receipts;
- the exact Drive successor ZIP encoded as text, with a checksum-enforcing materializer.

To reconstruct the exact successor ZIP:

```bash
python archive/complete-package-v1/materialize_complete_package.py
```

Expected ZIP SHA-256:

`e818c9b16b8b493d27da9e2d37f9503944b0d7699497a705ad5ec9ddbfefe32d`

## Large-byte custody

The raw CMS source and original complete hospital-level output remain in hash-bound external custody rather than being duplicated in ordinary Git history. Their identities are frozen here and the source-hash-bound executable regenerates the results.

- Source: `Complications_and_Deaths-Hospital.csv`
- Source bytes: `21,641,635`
- Source SHA-256: `0ba1b358e54e8812c9d1cf72c37f715b7bfeb3da12009bb6705158f0d15f91b5`
- Full hospital-level results SHA-256: `d8efa1e9db284294f49cd64542955bba7aaa6858f77a17bdf07c7eabeedf4f12`
- Full sensitivity results SHA-256: `9923812fa22bcf968dd01f1f334cbcffedb436f22fae1a44a8ec0ef33636a7f3`

## Resolved clarifications

The additive comparator is measure-weighted:

`(MORT_nonworse + SAFETY_nonworse) / (MORT_comparable + SAFETY_comparable)`

It is not the simple average of `a_MORT` and `a_SAFETY`.

All three hard-collapse cases were numeric only under `ANY_COMPARABLE`. They were `UNEVALUABLE` under the 50%, 75%, and complete-coverage rules.

## Main empirical findings

| Coverage rule | Evaluatable | Mean IMI | Variance | Median | Exact IMI = 1 |
|---|---:|---:|---:|---:|---:|
| At least one measure per factor | 2,973 | 0.9565 | 0.00995 | 1.000 | 77.3% |
| At least 50% per factor | 2,459 | 0.9512 | 0.00969 | 1.000 | 73.4% |
| At least 75% per factor | 1,734 | 0.9420 | 0.01073 | 1.000 | 67.5% |
| Every required measure | 662 | 0.9211 | 0.01270 | 1.000 | 54.2% |

The study established a coverage-opportunity effect, observed real-data concealment of required-factor collapse by an additive aggregate, supported empirical nonredundancy of mortality and safety factors, and confirmed that overlap and semantic-assignment rules are consequential.

## Determination

`HOSPITAL_ROBUSTNESS_EXTENSION = EMPIRICALLY_VALUABLE`

`NONCOMPENSATORY_COLLAPSE_CLAIM = OBSERVED_IN_REAL_DATA`

`MISSINGNESS_DISCIPLINE = NECESSARY`

`NEXT_MAJOR_INSTRUMENT_TEST = ANOTHER_DOMAIN`

No IMI-0 through IMI-7 ordinal state is assigned from this static dataset because it lacks the temporal and terminal evidence required by the scale.
