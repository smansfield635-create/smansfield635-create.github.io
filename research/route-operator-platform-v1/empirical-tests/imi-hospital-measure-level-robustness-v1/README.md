# IMI Hospital Measure-Level Robustness Test

## Execution identity

- Operation: `HOSPITAL_MEASURE_LEVEL_IMI_ROBUSTNESS_EXTENSION_1B`
- Classification: exploratory empirical test
- Route: `HOSPITAL_COMPARATIVE_NONWORSE_MEASURE_LEVEL_ROUTE_v1`
- Source file: `Complications_and_Deaths-Hospital.csv`
- Source bytes: `21,641,635`
- Source SHA-256: `0ba1b358e54e8812c9d1cf72c37f715b7bfeb3da12009bb6705158f0d15f91b5`
- Rows: `90,611`
- Hospitals: `4,769`
- Measures: `19`
- Duplicate Facility ID × Measure ID rows: `0`

## Primary route

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

| threshold           | evaluatable | unevaluable | percent_evaluatable | mean_IMI | sd_IMI   | variance_IMI | minimum_IMI | q1_IMI   | median_IMI | q3_IMI   | maximum_IMI | exact_IMI_1 | exact_IMI_1_percent | hard_collapse_count | any_worse_count | unique_IMI_scores |
|:--------------------|:------------|:------------|:--------------------|:---------|:---------|:-------------|:------------|:---------|:-----------|:---------|:------------|:------------|:--------------------|:--------------------|:----------------|:------------------|
| ANY_COMPARABLE      | 2973        | 1796        | 62.340113           | 0.956454 | 0.099757 | 0.009951     | 0.000000    | 1.000000 | 1.000000   | 1.000000 | 1.000000    | 2297        | 77.262025           | 3                   | 676             | 36                |
| AT_LEAST_50_PERCENT | 2459        | 2310        | 51.562172           | 0.951154 | 0.098432 | 0.009689     | 0.200000    | 0.909091 | 1.000000   | 1.000000 | 1.000000    | 1805        | 73.403823           | 0                   | 654             | 35                |
| AT_LEAST_75_PERCENT | 1734        | 3035        | 36.359824           | 0.942017 | 0.103564 | 0.010726     | 0.200000    | 0.909091 | 1.000000   | 1.000000 | 1.000000    | 1171        | 67.531719           | 0                   | 563             | 31                |
| ALL_REQUIRED        | 662         | 4107        | 13.881317           | 0.921107 | 0.112678 | 0.012696     | 0.318182    | 0.909091 | 1.000000   | 1.000000 | 1.000000    | 359         | 54.229607           | 0                   | 303             | 17                |

## Finding 1 — Missingness materially changes the apparent distribution

The permissive rule requiring only one comparable measure in each factor evaluates 2,973 hospitals (62.3%). Under that rule, 77.3% receive an exact IMI of 1.

Requiring all 17 primary measures evaluates only 662 hospitals (13.9%). The exact-1 ceiling falls to 54.2%, while variance rises from 0.00995 to 0.01270.

Across hospitals with at least one comparable measure in each factor, total comparable-measure count and IMI have Spearman correlation `-0.311` with p-value `1.632e-67`. More complete observation exposes more worse classifications. This is a coverage-opportunity effect, not evidence that data completeness causes poorer care.

## Finding 2 — The multiplicative rule exposes collapse hidden by an additive average

Under the permissive evaluability rule, 3 hospitals have a factor availability of zero.

Their additive non-worse averages range from `0.75` to `0.80`, while multiplicative IMI is exactly zero.

Across all permissively evaluatable hospitals:

- Pearson correlation, additive versus multiplicative: `0.928`
- Spearman correlation: `0.995`
- Additive score exceeds multiplicative IMI in `22.7%`
- Maximum additive-minus-multiplicative difference: `0.800`

The collapse examples are retained in `results/IMI_Additive_Hidden_Collapse_Examples.csv`.

## Finding 3 — Mortality and safety are empirically nonredundant factors

Among the 662 complete-coverage hospitals, the Pearson correlation between mortality and safety availability is `0.042` and the Spearman correlation is `0.029`.

The factors therefore do not appear interchangeable, although both remain heavily ceiling-concentrated.

## Finding 4 — Semantic and overlap decisions are measurable but do not resolve the ceiling

| variant         | common_numeric_hospitals | changed_score_count | changed_score_percent | mean_delta | mean_absolute_delta | maximum_absolute_delta | spearman_rank_correlation | lowered_count | raised_count |
|:----------------|:-------------------------|:--------------------|:----------------------|:-----------|:--------------------|:-----------------------|:--------------------------|:--------------|:-------------|
| PSI04_TO_MORT   | 2973                     | 253                 | 8.509923              | 0.000362   | 0.004210            | 0.200000               | 0.983663                  | 46            | 207          |
| PSI04_TO_SAFETY | 2973                     | 405                 | 13.622603             | 0.000077   | 0.002290            | 0.090909               | 0.988131                  | 46            | 359          |
| PSI90_INCLUDED  | 2973                     | 435                 | 14.631685             | -0.003321  | 0.004822            | 0.119048               | 0.991878                  | 170           | 265          |
| ALL_SENSITIVITY | 2973                     | 606                 | 20.383451             | -0.002958  | 0.008542            | 0.200000               | 0.976484                  | 208           | 398          |

Assigning `PSI_04` to either factor changes a minority of scores and has a small mean absolute effect. Including `PSI_90` changes more scores and produces a small downward mean shift, but it introduces known evidence overlap. High rank correlations indicate broad ordering robustness, not permission to double-count evidence.

## Prior-study comparison

The prior hospital-general-information run reported 3,083 numeric cases, median IMI 0.909, and exact IMI 1 in 47.5%.

A paired merge was not performed because that prior source file was not present in this execution runtime. The comparison is descriptive.

The measure-level file does not produce a broader or cleaner primary IMI distribution:

- permissive route: median 1.000; exact 1 in 77.3%
- complete-coverage route: median 1.000; exact 1 in 54.2%

Its empirical value is different: it tests missingness discipline, component decomposition, semantic ownership, overlap control, and additive-versus-multiplicative collapse behavior.

## Determination

`HOSPITAL_ROBUSTNESS_EXTENSION = EMPIRICALLY_VALUABLE`

`INDEPENDENT_CROSS_DOMAIN_TEST = NOT_SATISFIED`

`PERMISSIVE_ANY_COMPARABLE_ROUTE = NOT_CONFIRMATORY`

`COMPLETE_COVERAGE_ROUTE = TOO_SELECTIVE_FOR_GENERAL_HOSPITAL_RANKING`

`RECOMMENDED_NEXT_HOSPITAL_RULE = PREDECLARED_COVERAGE_THRESHOLD + COVERAGE_RECEIPT + SEPARATE_UNEVALUABLE_STATE`

`RECOMMENDED_NEXT_MAJOR_TEST = NEW_DOMAIN_WITH_REPEATED_TIME_OBSERVATIONS_AND_GREATER_CONTINUOUS_VARIATION`

## Limitations

1. This is observational public reporting data, not causal evidence.
2. Better/no-different/worse classifications are coarse and highly ceiling-concentrated.
3. Measurement windows differ: mortality and most PSI measures end June 30, 2023, while hip/knee complications end March 31, 2023.
4. Hospitals with complete reporting are a selected subset.
5. No temporal trajectory can be inferred from one reporting window.
6. The prior hospital-general-information file was unavailable for a paired Facility ID comparison.
7. No ordinal IMI-0 through IMI-7 state is assigned because this static file does not supply the temporal and terminal evidence required for that scale.
