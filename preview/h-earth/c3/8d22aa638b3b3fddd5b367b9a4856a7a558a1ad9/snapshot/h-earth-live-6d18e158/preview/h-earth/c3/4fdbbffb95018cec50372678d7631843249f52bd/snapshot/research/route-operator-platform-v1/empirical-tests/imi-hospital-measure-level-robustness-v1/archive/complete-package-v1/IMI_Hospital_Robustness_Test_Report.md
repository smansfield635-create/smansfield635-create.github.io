# IMI Hospital Measure-Level Robustness Test

## Execution identity

- Operation: `HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B`
- Classification: exploratory empirical test
- Source file: `Complications_and_Deaths-Hospital.csv`
- Source bytes: `21,641,635`
- Source SHA-256: `0ba1b358e54e8812c9d1cf72c37f715b7bfeb3da12009bb6705158f0d15f91b5`
- Rows: `90,611`
- Hospitals: `4,769`
- Measures: `19`
- Duplicate Facility ID × Measure ID rows: `0`

## Frozen primary route

Mortality factor:

`MORT_30_AMI, MORT_30_CABG, MORT_30_COPD, MORT_30_HF, MORT_30_PN, MORT_30_STK`

Safety/complication factor:

`COMP_HIP_KNEE, PSI_03, PSI_06, PSI_08, PSI_09, PSI_10, PSI_11, PSI_12, PSI_13, PSI_14, PSI_15`

Excluded from the primary route:

- `PSI_90`, because it is a composite overlapping component PSI measures.
- `PSI_04`, because its label crosses mortality and complication semantics. It is tested separately under both possible assignments.

For each factor:

`availability = non-worse comparable measures / comparable measures`

Primary score:

`IMI = a_MORT × a_SAFETY`

Complement:

`CS = 1 - IMI`

Hard collapse:

`a_MORT = 0 OR a_SAFETY = 0`

A measure is comparable when CMS classifies it as Better, Worse, or No Different from the national rate/value. Not Available and Number of Cases Too Small are not treated as favorable observations.

## Main results

| threshold | evaluatable | unevaluable | mean IMI | variance | median | exact IMI=1 | hard collapse |
|---|---:|---:|---:|---:|---:|---:|---:|
| ANY_COMPARABLE | 2,973 | 1,796 | 0.956454 | 0.009951 | 1.000 | 77.262% | 3 |
| AT_LEAST_50_PERCENT | 2,459 | 2,310 | 0.951154 | 0.009689 | 1.000 | 73.404% | 0 |
| AT_LEAST_75_PERCENT | 1,734 | 3,035 | 0.942017 | 0.010726 | 1.000 | 67.532% | 0 |
| ALL_REQUIRED | 662 | 4,107 | 0.921107 | 0.012696 | 1.000 | 54.230% | 0 |

## Finding 1 — Missingness materially changes the apparent distribution

The permissive rule requiring only one comparable measure in each factor evaluates 2,973 hospitals (62.3%). Under that rule, 77.3% receive an exact IMI of 1.

Requiring all 17 primary measures evaluates only 662 hospitals (13.9%). The exact-1 ceiling falls to 54.2%, while variance rises from 0.00995 to 0.01270.

Across hospitals with at least one comparable measure in each factor, total comparable-measure count and IMI have Spearman correlation `-0.311` with p-value `1.632e-67`. More complete observation exposes more worse classifications. This is a coverage-opportunity effect, not evidence that data completeness causes poorer care.

## Finding 2 — The multiplicative rule exposes collapse hidden by an additive average

Under the permissive evaluability rule, 3 hospitals have a factor availability of zero. Their measure-weighted additive non-worse fractions range from `0.75` to `0.80`, while multiplicative IMI is exactly zero.

The additive comparator is now explicitly resolved as:

`(MORT_nonworse + SAFETY_nonworse) / (MORT_comparable + SAFETY_comparable)`

It is not the unweighted average of `a_MORT` and `a_SAFETY`.

All three collapse examples are numeric only under `ANY_COMPARABLE`; all are `UNEVALUABLE` under the 50%, 75%, and complete-coverage rules.

Across all permissively evaluatable hospitals:

- Pearson correlation, additive versus multiplicative: `0.928`
- Spearman correlation: `0.995`
- Additive score exceeds multiplicative IMI in `22.7%`
- Maximum additive-minus-multiplicative difference: `0.800`

## Finding 3 — Mortality and safety are empirically nonredundant factors

Among the 662 complete-coverage hospitals, the Pearson correlation between mortality and safety availability is `0.042` and the Spearman correlation is `0.029`.

## Finding 4 — Semantic and overlap decisions are measurable

| variant | changed scores | changed % | mean absolute delta | rank correlation |
|---|---:|---:|---:|---:|
| PSI04_TO_MORT | 253 | 8.510% | 0.004210 | 0.983663 |
| PSI04_TO_SAFETY | 405 | 13.623% | 0.002290 | 0.988131 |
| PSI90_INCLUDED | 435 | 14.632% | 0.004822 | 0.991878 |
| ALL_SENSITIVITY | 606 | 20.383% | 0.008542 | 0.976484 |

## Determination

`HOSPITAL_ROBUSTNESS_EXTENSION = EMPIRICALLY_VALUABLE`

`INDEPENDENT_CROSS_DOMAIN_TEST = NOT_SATISFIED`

`PERMISSIVE_ANY_COMPARABLE_ROUTE = NOT_CONFIRMATORY`

`COMPLETE_COVERAGE_ROUTE = TOO_SELECTIVE_FOR_GENERAL_HOSPITAL_RANKING`

`RECOMMENDED_NEXT_HOSPITAL_RULE = PREDECLARED_COVERAGE_THRESHOLD + COVERAGE_RECEIPT + SEPARATE_UNEVALUABLE_STATE`

`RECOMMENDED_NEXT_MAJOR_TEST = NEW_DOMAIN_WITH_REPEATED_TIME_OBSERVATIONS_AND_GREATER_CONTINUOUS_VARIATION`

## Limitations

1. Observational public reporting data, not causal evidence.
2. Better/no-different/worse classifications are coarse and ceiling-concentrated.
3. Measurement windows differ.
4. Complete-reporting hospitals are a selected subset.
5. No temporal trajectory can be inferred from one reporting window.
6. The original execution did not perform a paired Facility-ID comparison with the earlier general-information file.
