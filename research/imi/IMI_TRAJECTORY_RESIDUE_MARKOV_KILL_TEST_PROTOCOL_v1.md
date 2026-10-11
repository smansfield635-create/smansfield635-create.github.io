# IMI Trajectory Residue / Markov-Sufficiency Kill Test — Frozen Protocol v1

## Purpose

This study is a make-or-break test of the path-dependent IMI trajectory hypothesis. It does **not** test instantaneous maneuvering room. Prior banking, grid, transition-path, and wastewater safe-envelope verdicts remain unchanged.

The target proposition is:

> Among systems matched on present condition and local dynamics, accumulated trajectory history contains prospective information about future viability.

Equivalently, the null is a Markov-sufficiency claim:

`P(Y[t+h] | Z[t], H*[t]) = P(Y[t+h] | Z[t])`

where `Z[t]` contains present condition, strong recent dynamics, seasonality, age/exposure, and a rich lag history, while `H*[t]` is an explicitly order-sensitive trajectory-residue representation.

## Domain and source

EPA ECHO / ICIS-NPDES public DMR + enforceable-limit files, using the already-qualified Kansas, Oregon, and Texas FY2018–FY2025 realization from the wastewater adversarial program.

No new domain is introduced.

## Prospective outcomes

Only currently compliant facility-month snapshots are admitted.

- Primary horizon `Y3`: any effluent violation in the next 3 observed permit-months.
- Replication horizon `Y1`: violation in the next observed permit-month.

The later temporal holdout is calendar year 2023 onward. Training is calendar year 2022 and earlier.

## Strong Markov challenger Z

The challenger intentionally contains substantially more history than the earlier wastewater model:

1. current utilization / constraint-distribution variables;
2. exact lags 1–12 for max utilization, mean utilization, q90 utilization, near-80 fraction, and near-90 fraction where available;
3. 3-, 6-, and 12-observation slopes;
4. rolling 6- and 12-observation mean, standard deviation, minimum, and maximum;
5. facility observation age;
6. cumulative prior fraction of observations above 0.80 and 0.90 utilization;
7. cumulative prior mean utilization;
8. month-of-year;
9. the earlier safe-envelope/current-transition descriptors.

This challenger is deliberately strong. A positive result against a weak static model does not count.

## Frozen trajectory-residue H*

`H*` is order-sensitive. It is computed from the ordered max-utilization path using only information available at or before time t.

The frozen residue features are:

- cumulative positive path length over the prior 12 observations;
- cumulative recovery path length over the prior 12 observations;
- total variation over the prior 12 observations;
- number of direction reversals over the prior 12 observations;
- longest run at or above 0.80 over the prior 12 observations;
- number of completed or initiated 0.80 excursions over the prior 12 observations;
- recency-weighted path area minus unweighted path mean over the prior 12 observations;
- prior-peak memory gap;
- full-history positive-path rate;
- full-history recovery-path rate;
- full-history reversal rate;
- full-history 0.80-excursion rate.

The preregistered scalar used only for direct hysteresis comparisons is:

`R = pos_path12 - 0.5*recovery_path12 + longest_high_run12/12 + excursion_count12/12`.

The predictive augmented model receives the full H* vector, not only R.

## Temporal and transfer tests

Primary training: all KS/OR/TX snapshots through 2022.

Primary untouched temporal test: all KS/OR/TX snapshots from 2023 onward.

Geographic transfer replication: train KS+OR through 2022 and test TX from 2023 onward.

## Direct same-state / same-local-dynamics test

For the temporal holdout, observations are stratified using quantities that do not include H*:

- decile of baseline predicted risk;
- quintile of current max utilization;
- tertile of six-observation max-utilization slope.

Within every usable stratum, observations above versus below the stratum median R are contrasted. The pooled high-R minus low-R event-rate difference is weighted by usable stratum size. Significance is obtained from a one-sided 10,000-permutation test that permutes outcomes only within the frozen strata.

This is the confirmatory hysteresis comparison: approximately same present/risk/local trend, different accumulated ordered history.

## Conditional-residual test

A second confirmatory statistic tests whether the augmented-minus-baseline probability increment covaries positively with outcome after conditioning on baseline-risk decile, current-utilization quintile, and local-slope tertile. The same 10,000 within-stratum permutations are used.

## Evaluability

The study is evaluable only if all hold:

- temporal Y3 test has at least 2,000 observations and 100 events;
- temporal Y1 test has at least 2,000 observations and 50 events;
- Texas transfer Y3 has at least 500 observations and 30 events;
- at least 1,000 temporal observations have finite R and are assigned to usable same-state strata;
- R has at least 50 distinct values in the temporal holdout.

Otherwise the verdict is UNEVALUABLE.

## Frozen PASS rule

PASS requires **all** of the following:

1. temporal Y3 pooled Brier error improves by at least 5% when H* is added to Z;
2. temporal Y3 AUROC delta is nonnegative;
3. temporal Y3 conditional-residual statistic is positive with permutation p < 0.01;
4. same-state / same-local-dynamics high-R observations have higher Y3 event rate than low-R observations with permutation p < 0.01;
5. temporal Y1 Brier improves and AUROC delta is nonnegative;
6. Texas transfer Y3 Brier improves and AUROC delta is nonnegative.

Any failed criterion yields FAIL. No criterion may be changed after outcome exposure.

## Interpretation

A PASS would establish prospective path dependence in this wastewater realization beyond present state, rich local dynamics, ordinary lag history, age, and cumulative exposure. It would not establish a universal law; it would justify independent-domain replication.

A FAIL would materially damage the stronger IMI trajectory-residue hypothesis in its present form. It would mean that, in this severe realization, a strong state/local-history representation is effectively sufficient and the separately engineered path-residue representation adds no material prospective value.
