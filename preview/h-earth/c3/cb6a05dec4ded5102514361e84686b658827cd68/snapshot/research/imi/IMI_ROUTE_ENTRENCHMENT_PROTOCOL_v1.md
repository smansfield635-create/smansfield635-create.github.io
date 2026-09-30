# IMI Route-Entrenchment Test v1

## Status
Frozen before execution. This study follows two binding negative results: the failed integer IMI 3→4 threshold confirmation and the failed continuous viable-decision-space (VDS) severe test. Neither result is modified, discarded, or reinterpreted as a success.

## Scientific question
Does the temporal structure of route loss — persistence across quarters plus failure to recover — discriminate impending corporate collapse from reversible stress better than instantaneous constraint count or continuous VDS magnitude?

This is deliberately not another scalar-cutoff search. No outcome-fitted threshold is calibrated.

## Measurement law
Use the same seven pre-existing availability dimensions and transformations already frozen in the corporate IMI studies: liquidity, cash reserve, solvency, equity buffer, debt capacity, operating performance, and operating cash-flow capacity. Each availability is bounded in [0,1].

A dimension is `constrained` when availability < 1/3, preserving the legacy IMI dimensional boundary.

For each dimension i and quarter t:

- `persistent_i(t) = 1` when the dimension is constrained in at least 3 of the current/prior 4 observed quarters, requiring at least 3 observations.
- `persistent_count(t)` is the number of persistent dimensions.
- `persistent_fraction(t) = persistent_count / observed_dimensions`.
- `pair_density(t) = k(k-1) / [n(n-1)]`, where k is persistent_count and n is observed_dimensions. This captures simultaneous multi-dimensional entrenchment rather than raw one-quarter count alone.
- A previously persistent dimension is `recovered_i(t) = 1` only when availability is >=1/3 in both t and t-1.
- `recovery_capacity(t)` is recovered previously-persistent dimensions divided by the number of dimensions persistent at t-1. If none were persistent at t-1, recovery capacity is 1.
- `recovery_deficit(t) = 1 - recovery_capacity(t)` when at least one dimension was persistent at t-1, otherwise 0.

The continuous route-lock score is frozen as:

`route_lock_score = [persistent_fraction + pair_density + persistent_fraction * recovery_deficit] / 3`

The structural state is frozen as:

- `entrenched(t) = persistent_count >= 3 AND recovery_deficit >= 0.50`
- `confirmed_entrenchment(t) = entrenched(t) AND entrenched(t-1)`

No coefficient, persistence window, count boundary, recovery definition, or state rule may change after confirmation data are opened.

## Untouched confirmation cohort
This cohort is not used in either prior corporate threshold confirmation or the VDS confirmation cohort.

Failures:
- Bed Bath & Beyond — Chapter 11, 2023-04-23
- Party City Holdco — Chapter 11, 2023-01-17
- Tuesday Morning — Chapter 11, 2023-02-14

Survivor/stress cases:
- Gap
- Best Buy
- Dick's Sporting Goods

Healthy controls:
- Walmart
- Home Depot
- Costco

Data source: SEC Company Facts, 10-Q/10-K quarterly observations through 2025-12-31, using the same accounting mappings and availability transformations as the prior VDS test.

## Outcomes
For failure companies, the prospective event label is bankruptcy within 4.5 quarters. Nonfailure observations remain zero through 2025-12-31.

## Acceptance criteria
All criteria must pass for `ENTRENCHMENT_CONFIRMED`.

A. Evaluable: at least three failures, two survivor/stress companies, and two healthy controls each provide at least 12 quarters with >=4 observed availability dimensions.

B. Failure reachability: every evaluable failure reaches confirmed entrenchment before bankruptcy, and at least two do so within 12.5 quarters of bankruptcy.

C. Healthy specificity: no evaluable healthy-control company reaches confirmed entrenchment.

D. Survivor reversibility: at least two survivor/stress companies either never reach confirmed entrenchment or, after reaching it, return to `persistent_count <= 1` for two consecutive observed quarters within six quarters.

E. Incremental discrimination: on the untouched confirmation panel, AUROC of route_lock_score for four-quarter collapse exceeds AUROC of both legacy integer IMI level and static VDS risk (1-VDS) by at least 0.03.

F. Structural severity: four-quarter collapse probability during confirmed entrenchment is at least 4x the probability outside confirmed entrenchment and at least 0.10 higher in absolute terms.

G. Temporal localization: among failures that reach confirmed entrenchment, median first-entry lead is between 2 and 12.5 quarters before bankruptcy. This prevents a ubiquitous long-horizon distress flag from being accepted as a collapse boundary.

## Verdict
- `ENTRENCHMENT_CONFIRMED`: A–G all pass.
- `FAIL`: evaluable but any required criterion fails.
- `UNEVALUABLE`: minimum cohort/data conditions fail.

No post-opening tuning is permitted.