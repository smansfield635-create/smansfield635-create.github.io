# IMI Jurisdictional Architecture Meta-Test v1

Purpose: test whether the repeated jurisdiction-specific A+S+H effects are associated with externally observable wastewater-program composition rather than another outcome-selected internal threshold.

Prior negative results remain binding. This is a state-level explanatory meta-test, not a rescue of universal A/S/H.

## Frozen state effects

The state-level A+S+H effects are taken unchanged from completed artifacts and evaluated only where the prospective state sample had at least 300 observations. Eligible states are FL, GA, MN, MO, NC, OH, PA, WI. VA is excluded by the predeclared n>=300 gate. The input table is fixed in the analysis script and includes Brier relative improvement and AUROC delta from the original untouched prospective predictions.

## External data

For reporting years 2018-2022 only, retrieve EPA ECHO State Statistics CSVs from the Water Pollutant Loading Tool. These files are external to the IMI model and summarize individual NPDES permit populations by state.

## Five frozen architecture axes

1. `major_share`: majors / (majors + non-majors).
2. `log_permit_universe`: log1p(majors + non-majors).
3. `loading_coverage_gap`: percent majors with pollutant loadings minus percent non-majors with pollutant loadings.
4. `log_major_loading_per_permit`: log1p(total major pollutant loading / majors).
5. `log_major_toxic_per_permit`: log1p(total major toxic-weighted pounds / majors).

Each axis is averaged over 2018-2022 before association testing. No 2023+ state-statistics values are admitted.

## Severe association test

For each axis, compute Spearman correlation with state Brier improvement and with state AUROC delta. The two outcome correlations must have the same sign. The axis statistic is the smaller absolute correlation of the two; otherwise statistic=0. Obtain an exact permutation p-value by permuting the paired state outcome vectors across states. Apply Holm correction across the five axes.

A jurisdictional architecture axis qualifies only if:
- at least 8 eligible states have complete external data;
- Brier and AUROC correlations have the same sign;
- both absolute correlations are >=0.55;
- Holm-adjusted exact permutation p < 0.05.

Verdict:
- `JURISDICTIONAL_ARCHITECTURE_SIGNAL` if at least one axis qualifies;
- `FAIL` if evaluable but none qualifies;
- `UNEVALUABLE` otherwise.

This protocol forbids substituting axes, years, states, thresholds, or outcome metrics after external data exposure.