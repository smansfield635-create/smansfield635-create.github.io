# Grid Transition-Path Topology Severe Test — Frozen Protocol v1

## Purpose

The prior exact-grid studies materially weakened aggregate balanced-generator redispatch volume as the operative maneuverability variable. This study tests the narrower structural proposition that prospective resilience depends on the **number of viable identity-preserving transition paths**, not merely the volume of instantaneous redispatch room.

This protocol is frozen before outcomes are generated. Prior negative results remain unchanged.

## External source

PowerAgentBench stressed IEEE 39-bus MATPOWER scenario, pinned to commit `a93255d827292922165c05396b600904e0a6130e`.

## State sample

- Fresh random seed: `20260825`.
- 160 distinct intact-feasible dispatch states.
- Published load vector and total generation are held fixed.
- State generation uses only balanced pairwise redispatch under intact generator and branch constraints.

## Allowed identity-preserving actions

Two physically explicit action classes are represented:

1. **Generator redispatch:** balanced corrective generator movements subject to Pmin/Pmax and a per-step movement cap equal to 10% of each generator's Pmax-Pmin span when constructing the pre-disturbance path graph; 20% per-step movement is allowed during post-contingency recovery.
2. **Transmission topology switching:** opening one non-islanding transmission branch from a globally frozen candidate set.

The candidate switching set is fixed before generated-state outcomes are evaluated: among branches whose opening does not island the published network, select the 12 branches with highest absolute DC utilization under the deterministic balanced published stressed dispatch. The same 12 branch identities are used for every generated state and every contingency.

No load shedding, generation outside generator bounds, storage, reactive-power action, or protection override is allowed.

## Pre-disturbance path geometry

For each intact state, construct a bounded depth-2 transition graph using the frozen switching set.

- A depth-1 edge exists when one candidate branch can be opened and a bounded 10%-span corrective redispatch can restore a full-load feasible DC state under published branch ratings.
- A depth-2 path exists when, after a feasible depth-1 transition, a second distinct candidate branch can be opened and another bounded corrective redispatch restores feasibility under published branch ratings.

Let `f1` be the fraction of the 12 candidate first-step switches that are feasible and `f2` the fraction of ordered distinct two-switch sequences that are feasible. The frozen path-richness score is

`P = 0.5 * (f1 + f2)`.

This is a discrete topology/path measure. It is not the prior aggregate redispatch-volume scalar.

## Prospective outcome

Every non-islanding N-1 branch outage is evaluated from every generated state. Survival means full load can be preserved through any lawful recovery path of depth 0, 1, or 2:

- depth 0: bounded 20%-span corrective redispatch under the outage topology and published branch ratings;
- depth 1: one additional candidate line opening followed by bounded corrective redispatch to a state satisfying published ratings;
- depth 2: a first candidate line opening and bounded redispatch may occupy a short-lived **emergency transition state** whose branch flows are no more than 120% of published ratings, followed by a second distinct candidate opening and bounded redispatch that restores all remaining branches to published ratings.

All intermediate and terminal networks must remain connected and respect generator bounds. The 120% emergency allowance is fixed before outcome generation and applies only to the single intermediate state of a depth-2 path. No load shedding is permitted.

## Conventional challenger

The conventional predictor `X` is frozen to the same operating-state and contingency descriptors used in the preceding stressed-grid studies: intact branch-utilization distribution, generator up/down headroom statistics, dispatch/headroom concentration, and outage branch utilization/rating/reactance/terminal degrees. `P` is excluded from X and added only in the augmented model.

## Validation

Five state-blocked folds are fixed by `state_id mod 5`; all contingencies from a state remain in one fold. LightGBM hyperparameters are unchanged from the preceding studies.

Direct state-level tests are also frozen:

1. Spearman correlation between P and each state's recovery-survival fraction.
2. Difference in mean survival between the top and bottom P quartiles, assessed by a two-sided 10,000-permutation state-label test with seed `20260825`.

## Evaluability

The test is evaluable only if:

- P has at least 20 distinct values across the 160 states;
- the state-contingency failure rate lies between 5% and 95%; and
- state-level survival has at least 20 distinct values.

Otherwise the verdict is UNEVALUABLE.

## Frozen PASS rule

PASS requires all five:

1. pooled Brier error improves by at least 5% when P is added to X;
2. pooled AUROC delta is nonnegative;
3. Brier improves in at least 4 of 5 state-blocked folds;
4. Spearman rho(P, state survival) > 0 with p < 0.01; and
5. top-P-quartile mean survival exceeds bottom-P-quartile mean survival with two-sided permutation p < 0.01.

Any failed criterion yields FAIL. No threshold may be changed after outcome generation.

## Interpretation boundary

A PASS would establish that discrete viable transition-path richness adds prospective resilience information on this stressed-grid realization beyond conventional operating-state variables. It would not yet establish a universal law. A FAIL would materially weaken the remaining grid-specific transition-geometry hypothesis and would make further rescue on this benchmark unwarranted without a new physical action class or independent domain.