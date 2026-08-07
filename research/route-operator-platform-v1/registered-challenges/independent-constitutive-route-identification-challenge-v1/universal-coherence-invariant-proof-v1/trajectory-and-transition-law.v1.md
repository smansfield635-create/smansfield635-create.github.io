# Invariant trajectory and bounds law

## Principle

Trajectory is not a second theory. It is the time-indexed application of the same invariant coherence operator to structurally corresponding evidence.

For comparable times `t0 < t1`:

\[
\Delta C_I[t_0,t_1]=C_I(X,t_1)-C_I(X,t_0).
\]

Direct subtraction is prohibited if the identity criterion, system boundary, route topology, factor definition, normalization, or version correspondence changed without a frozen crosswalk.

## Interval propagation

Each admitted relation state is represented by a bounded interval:

\[
q_e(t)\in[q_e^-(t),q_e^+(t)]
\]

and each admissibility gate by:

\[
a_I(r,t)\in[a_I^-(r,t),a_I^+(r,t)].
\]

Because min and max are monotone, uncertainty propagates through the same invariant operator:

\[
C_I^-(t)
=
\min_k\max_r\min\left(a_I^-(r,t),\min_e q_e^-(t)\right),
\]

\[
C_I^+(t)
=
\min_k\max_r\min\left(a_I^+(r,t),\min_e q_e^+(t)\right).
\]

The trajectory interval is:

\[
\boxed{
\Delta C_I[t_0,t_1]
\in
\left[
C_I^-(t_1)-C_I^+(t_0),
C_I^+(t_1)-C_I^-(t_0)
\right]
}.
\]

This supplies one invariant trajectory-bounds methodology across domains. Domain evidence changes the input intervals, not the law.

## Classification

- `POSITIVE_MOMENTUM`: the lower trajectory bound is greater than zero and no identity-admissibility loss occurred.
- `DIGRESSION`: the upper trajectory bound is less than zero, or a previously available required capacity becomes unreachable.
- `STABLE_EQUIVALENT`: a predeclared equivalence margin derived from evidence reproducibility contains the full trajectory interval, with no boundary, route, provenance, support, or hysteresis transition.
- `INDETERMINATE`: the trajectory interval overlaps positive and negative change outside the equivalence decision, or required correspondence is incomplete.
- `SUPPORTED_CONTINUITY`: output coherence remains positive while identity-conditioned coherence is absent or externally gated.
- `RESTORATION_IN_PROGRESS`: intrinsic admissible route integrity is increasing but route reopening or reentry clearance is not complete.
- `RESTORED`: every required identity capacity is again reachable through an admissible route, support dependence satisfies the frozen rule, and hysteretic reentry has cleared.
- `FRACTURE`: at least one required identity capacity has no admissible operational route.

## Why fixed universal deltas were rejected

A universal raw threshold such as `0.01` ignores source resolution, natural variation, sampling cadence, and uncertainty. The invariant law instead requires a universal propagation rule and a predeclared evidence-resolution model.

The value of an evidence interval may differ across measurement systems. The classification logic and propagation equation may not.

## Bottleneck trajectory

The instrument must retain the active limiting capacity, limiting route, limiting relation, and transition cause:

\[
B_I(t)=
(k^*,r^*,e^*,C_I(t),a_I(r^*,t),\text{support},\text{hysteresis}).
\]

A minimum value without identity and topology is insufficient. A bottleneck that never changes identity may provide little predictive discrimination and must be reported as such.

## Terminal rule

No trajectory classification may convert an `INVALID` or required `UNEVALUABLE` input into a numeric result. No improvement classification may be promoted to restoration solely because `C_I(t)` increased.
