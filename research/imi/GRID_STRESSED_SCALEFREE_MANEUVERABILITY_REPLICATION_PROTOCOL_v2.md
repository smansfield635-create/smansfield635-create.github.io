# Grid Stressed Scale-Free Maneuverability Replication — Frozen Protocol v2

## Why v2 exists

The prior stressed-grid v1 execution is permanently retained as **UNEVALUABLE** because its preregistered absolute M-span and absolute pair-gap gates were not met. It nevertheless showed that the stressed benchmark solved the earlier saturation problem: the N-1 failure rate was 42.88%, and exact M varied roughly fivefold from about 0.025 to 0.123. No v1 criterion is changed here.

This v2 study is a new replication on a **fresh random state sample** and uses only scale-free tests of M. It is frozen before the v2 outcomes are generated.

## External source

PowerAgentBench stressed IEEE 39-bus MATPOWER scenario, pinned to commit `a93255d827292922165c05396b600904e0a6130e`.

## State sample

- Fresh seed: `20260824`.
- 300 distinct intact-feasible dispatch states.
- Published load vector and total generation are held fixed.
- Published Pg is deterministically mapped into the balanced DC realization by clipping to Pmin/Pmax, filling residual imbalance in generator-table order from available headroom, then applying the intact feasibility LP. This source adapter is fixed before outcome evaluation.
- Subsequent states are generated only by balanced pairwise redispatch under intact generator and branch constraints.

## Exact maneuverability

Same physical measure as v1: normalized bidirectional feasible balanced generator-redispatch volume under Pmin/Pmax and intact DC branch thermal constraints. No feature or geometry definition changes.

## Prospective outcome

Every non-islanding N-1 branch outage is tested. Survival requires a corrective redispatch LP to preserve full load, power balance, generator limits, a 20% generator-span corrective movement bound, and all remaining branch thermal limits.

## Conventional challenger

Unchanged from v1: conventional intact utilization statistics, aggregate/minimum generator headroom statistics, dispatch/headroom concentration, and pre-outage branch utilization/rating/reactance/terminal degrees. M is excluded from X and added only in the augmented model.

## Cross-validation

Five state-blocked folds fixed by `state_id mod 5`; all contingencies from a state remain in one fold. Frozen LightGBM hyperparameters remain the same as v1.

## Scale-free severe comparisons

Two direct tests are frozen:

1. **Rank monotonicity:** Spearman correlation between M and each state's N-1 survival fraction.
2. **Extreme-quartile contrast:** compare mean N-1 survival of the top 25% of states by M with the bottom 25%. Significance is assessed by a two-sided 10,000-permutation state-label test with seed `20260824`.

These comparisons use ranks/quantiles and therefore do not depend on an arbitrary absolute M span.

## Evaluability

The primary v2 test is evaluable if:

- exact M has at least 20 distinct values across the 300 states; and
- the state-contingency failure rate is between 5% and 95%.

No absolute M-span threshold is used.

## Frozen PASS rule

PASS requires all five:

1. pooled Brier error improves by at least 5% after adding M;
2. pooled AUROC delta is nonnegative;
3. Brier improves in at least 4 of 5 state-blocked folds;
4. Spearman rho(M, state survival) > 0 with p < 0.01; and
5. top-M-quartile mean survival exceeds bottom-M-quartile mean survival, with two-sided permutation p < 0.01.

Any failed criterion yields FAIL. If evaluability fails, verdict is UNEVALUABLE.

A PASS would establish a strong scale-free within-topology result on a fresh stressed-grid realization, not a universal law. A FAIL would close the principal remaining stressed-grid rescue route for the present exact balanced-redispatch definition.