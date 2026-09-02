# Grid Stressed Maneuverability Replication — Frozen Protocol v1

## Scientific boundary

This study is a new replication, not a reinterpretation of the failed standard-grid v1 severe test. The prior verdict remains FAIL.

The new study removes the identifiability defect exposed in v1 by using the externally published PowerAgentBench IEEE 39-bus **stressed benchmark scenario**, pinned to public commit `a93255d827292922165c05396b600904e0a6130e`. The benchmark itself is explicitly constructed with stressed loads, dispatch changes, and finite operational limits for N-1/N-2 security evaluation.

## Frozen hypothesis

For grid states with the same topology, same load vector and same total generation, larger exact admissible balanced-redispatch room M predicts greater prospective N-1 corrective survival beyond conventional operating-state and contingency variables.

## Source authority

- External benchmark: `Power-Agent/PowerAgentBench`.
- Pinned stressed MATPOWER case: `cases/case39/matpower/case39.m` at commit `a93255d827292922165c05396b600904e0a6130e`.
- The source is fetched by immutable raw GitHub commit URL at execution time and its SHA-256 is recorded.

## State construction

- Single stressed IEEE 39-bus topology.
- Preserve the benchmark load vector exactly.
- Preserve total generated MW exactly.
- Start from the benchmark dispatch with the slack generator deterministically rebalanced to total load.
- Generate 240 distinct intact-feasible dispatch states by random balanced pairwise redispatch moves under generator Pmin/Pmax and intact DC branch thermal constraints.
- Random seed: `20260823`.

## Exact maneuverability

For every state, M is the normalized bidirectional feasible pairwise redispatch volume over every online-generator pair. For each ordered generator transfer i→j, the maximum admissible MW step is solved analytically from:

1. source upward Pmax headroom;
2. sink downward Pmin headroom; and
3. all intact-grid DC branch thermal limits.

M is the sum of physically admissible bidirectional transfer distances divided by the corresponding generator-only transfer capacity. Thus 0 <= M <= 1 and M measures the fraction of nominal redispatch room that survives network constraints.

## Prospective outcome

Every non-islanding N-1 branch outage is evaluated after M and all conventional state features are fixed.

A state-contingency is a survival only if a corrective redispatch linear program can preserve:

- full served load; no shedding;
- active-power balance;
- generator Pmin/Pmax;
- a frozen corrective movement bound of 20% of each generator's Pmax-Pmin span; and
- every remaining branch thermal limit.

## Conventional challenger

The challenger excludes M and uses only conventional operating-state and contingency observables available before the corrective outcome:

- maximum, mean, standard deviation and 95th-percentile intact branch utilization;
- total upward and downward headroom ratios;
- minimum generator upward/downward fractional headroom;
- dispatch concentration and headroom concentration;
- outage pre-flow utilization, thermal rating, reactance and terminal degrees.

No feature derived from future corrective feasibility is allowed.

## Cross-validation

Five state-blocked folds are fixed by `state_id mod 5`. All contingencies belonging to one state remain in the same fold, preventing state leakage.

A frozen LightGBM classifier is fitted on four folds and evaluated on the fifth for:

- conventional X;
- conventional X + exact M.

## Matched-output severe comparison

States are greedily matched using standardized conventional state features only. Eligible pairs require |ΔM| >= 0.10. The higher-M member must be identified before comparing prospective N-1 survival fractions.

## Evaluability gate

The primary test is evaluable only if all are true:

1. M range >= 0.15 across generated states;
2. at least 5% and at most 95% of state-contingencies are failures; and
3. at least 30 informative matched pairs have unequal survival fractions.

If not, the verdict is UNEVALUABLE, not PASS.

## Frozen breakthrough-level success rule

PASS requires **all** of the following:

1. pooled relative Brier improvement from adding M >= 5%;
2. pooled AUROC delta >= 0;
3. Brier improves in at least 4 of 5 state-blocked folds;
4. higher-M states have higher survival in >= 70% of informative matched pairs; and
5. state-level Spearman correlation between M and N-1 survival is positive with p < 0.01.

Any failed criterion yields FAIL. No threshold or feature may change after outcome generation.

## Interpretation discipline

A PASS would establish a strong within-topology result on an externally stressed benchmark, not a universal law. A FAIL would materially weaken the exact-transition maneuverability hypothesis because the principal saturation defect of the standard-grid test has been removed.