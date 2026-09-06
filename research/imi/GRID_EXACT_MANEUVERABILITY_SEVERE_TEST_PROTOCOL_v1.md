# Grid Exact Maneuverability Severe Test — Frozen Protocol v1

## Hypothesis
For electrical grids with matched delivered load/output and comparable conventional operating-condition variables, the size of the exact pre-contingency admissible redispatch set contains prospective resilience information not captured by conventional state variables alone.

## Benchmark systems
Use standard MATPOWER/PYPOWER transmission cases: IEEE 14-bus, IEEE 30-bus, New England 39-bus, IEEE 57-bus, and IEEE 118-bus. These are public benchmark systems distributed with MATPOWER/PYPOWER.

## Model
Use a DC power-flow model with the benchmark topology, branch reactances and thermal limits, generator Pmin/Pmax bounds, and fixed bus loads. States preserve total delivered load and total generation. Generator redispatches are identity-preserving transitions: they change only active-power dispatch, preserve balance, remain inside generator bounds, and must leave every in-service branch inside its thermal limit.

## State generation
For each topology, begin from a DC-OPF-feasible dispatch. Generate at least 80 distinct feasible matched-output dispatch states by balanced random generator transfers. Retain only states feasible under the intact topology. The load vector and total generation remain fixed within each topology.

## Exact maneuverability M
Freeze a deterministic library of balanced pairwise redispatch directions for every online generator pair. For each direction, calculate the maximum admissible step from the current state subject simultaneously to generator bounds and all intact-grid branch thermal constraints. M is the normalized sum of bidirectional feasible step lengths across all generator-pair directions, divided by the corresponding unconstrained generator-bound step capacity. M therefore measures available admissible identity-preserving transition room under explicit physical constraints, not historical similarity.

## Prospective outcome
For each retained state, expose it to a predeclared set of non-islanding N-1 branch contingencies. A contingency is a success if a corrective redispatch exists after the outage that: (1) preserves full load, (2) preserves power balance, (3) respects generator Pmin/Pmax and a frozen corrective-ramp bound equal to 20% of each generator's Pmax-Pmin range, and (4) respects all remaining branch thermal limits. Feasibility is solved as a linear program. No load shedding is permitted in the primary endpoint.

## Conventional challenger X
State-only challenger variables are frozen as: intact maximum branch utilization, mean branch utilization, standard deviation of branch utilization, 95th-percentile branch utilization, total upward generator headroom ratio, total downward headroom ratio, minimum individual upward headroom fraction, minimum individual downward headroom fraction, generator-dispatch Herfindahl index, generator-headroom Herfindahl index, bus count, branch count, generator count, and topology identifier. Contingency descriptors are branch pre-outage utilization, branch rate, absolute reactance, and endpoint bus degrees. These variables may not include M or any derivative of the redispatch feasibility library.

## Primary predictive comparison
Rows are state-contingency pairs with binary survival outcome. Fit the same regularized gradient-boosted binary classifier to X and to X+M. Evaluation is leave-one-topology-out: each benchmark topology is held out in turn, models train only on the other topologies, and predictions are pooled only after all five held-out folds are complete.

## Matched-output severe test
Within each topology, form pairs of states nearest in standardized conventional state variables subject to an absolute M difference of at least 0.15. For every matched pair, compare N-1 survival fraction. The direction is correct when the higher-M state has the higher survival fraction.

## Frozen success rule
A breakthrough-level PASS requires all of the following:
1. pooled leave-one-topology-out Brier score improves by at least 5% for X+M versus X;
2. pooled AUROC delta is >= 0;
3. Brier improves in at least 4 of 5 held-out topologies;
4. in the matched-output severe test, higher-M states have higher contingency survival in at least 70% of informative pairs, with positive mean survival difference in at least 4 of 5 topologies;
5. Spearman correlation between M and state-level N-1 survival fraction is positive in at least 4 of 5 topologies.

Any criterion missed => primary verdict FAIL. If execution cannot satisfy benchmark/state/QC requirements, verdict is UNEVALUABLE, not PASS.

## Anti-rescue rule
No feature, threshold, contingency set, ramp bound, benchmark selection, matching criterion, or success rule may be changed after outcome generation to improve the result. Secondary analyses must be labeled secondary and cannot alter the primary verdict.

## Sources
Benchmark-case provenance and solver conventions follow MATPOWER documentation and public case distributions. The execution record must preserve exact software versions, random seed, case names, sample counts, metrics, and artifacts regardless of sign.