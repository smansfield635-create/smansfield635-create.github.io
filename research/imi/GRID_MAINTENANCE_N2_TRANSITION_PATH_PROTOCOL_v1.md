# Grid Maintenance-State N-2 Transition-Path Severe Test — Frozen Protocol v1

## Scientific question

Does the geometry of admissible identity-preserving transition paths explain prospective resilience when the **pre-contingency topology itself varies**, rather than only the dispatch within one fixed topology?

This study follows the completed N-1 transition-path test, which was UNEVALUABLE because its path score had only two values and every dispatch state had the same survival fraction. That result remains permanent. This is a new study with a new outcome regime, frozen before outcome generation.

## External source

PowerAgentBench stressed IEEE 39-bus MATPOWER case pinned to commit `a93255d827292922165c05396b600904e0a6130e`.

## Pre-outcome feasibility amendment

The first execution attempt stopped **before any generated state or second-outage outcome was evaluated** because only four of the globally frozen 12 candidate lines admit a full-load feasible single-line maintenance topology under published generator bounds and branch ratings. The originally planned eight topology folds therefore do not exist in the source realization.

Because no outcome had been generated, the protocol is lawfully amended now to use **all four feasible maintenance topologies**, with the total planned state count preserved at 112 by generating 28 states per topology. The scientific feature definitions, outcome, action set, model family, and 5% primary improvement threshold are unchanged. Leave-one-maintenance-topology-out validation therefore contains four folds, and the preregistered fold-consistency requirements become 3 of 4 folds rather than 6 of 8. No further scientific changes are permitted after outcome generation begins.

## Maintenance-state construction

The globally ranked 12 non-islanding candidate lines are determined exactly as in the preceding transition-path study: highest absolute DC utilization under the deterministic balanced published stressed dispatch.

From that list, **every line whose single-line opening admits a full-load feasible dispatch using generator bounds and published branch ratings** becomes the frozen maintenance-topology set. The source feasibility audit established that this set contains four lines.

For each of the four maintenance topologies:

- the selected maintenance line is already open before the prospective event;
- 28 distinct feasible dispatch states are generated with fixed load and total generation;
- generation variation uses only balanced pairwise redispatch under the maintenance topology.

Total planned state count: **112**. Fresh seed: `20260826`.

## Transition-graph representation

For every maintenance state, use the same 12 globally frozen switch candidates, excluding lines already open.

A depth-1 transition exists when one additional candidate line can be opened, the network remains connected, and a balanced corrective redispatch bounded to 10% of each generator's Pmax-Pmin span restores full-load feasibility under published ratings.

A depth-2 path exists when a second distinct candidate line can then be opened and a second 10%-span corrective redispatch restores full-load feasibility.

The frozen transition-geometry feature block is:

1. `f1`: feasible depth-1 transitions / eligible first-step candidates;
2. `f2`: feasible ordered depth-2 paths / eligible ordered candidate pairs;
3. `branch_entropy`: normalized Shannon entropy of the distribution of feasible depth-2 children across feasible first-step branches;
4. `min_child_frac`: minimum second-step child fraction among feasible first-step branches;
5. `max_child_frac`: maximum second-step child fraction among feasible first-step branches.

These five variables represent branching geometry and redundancy rather than aggregate redispatch volume.

## Prospective N-2 outcome

Each maintenance state is exposed to every additional branch outage that leaves the already-maintained network connected before corrective action. The prospective event is therefore a second line loss (N-2 relative to the original intact network).

Survival requires preservation of full load with no load shedding. Recovery may use:

- bounded balanced redispatch up to 20% of generator span under the maintenance+outage topology; or
- one additional candidate line opening followed by the same bounded corrective redispatch.

All terminal networks must remain connected and satisfy generator bounds and published branch ratings. No emergency overload allowance is used in this study.

## Conventional challenger

The conventional feature set contains the same operating-state and prospective-outage descriptors used in prior stressed-grid studies, plus two topology-condition descriptors available without transition-graph enumeration:

- pre-event number of active branches; and
- utilization of the already-open maintenance line in the corresponding intact dispatch immediately before it was removed (`maintenance_intact_util`).

The five transition-geometry features are excluded from the conventional challenger and added only in the augmented model.

## Cross-validation

The primary validation is **leave-one-maintenance-topology-out** across the four feasible maintenance topologies. Every state and second-outage row from one maintenance topology is held out together. LightGBM hyperparameters are unchanged from prior studies.

## Evaluability

The study is evaluable only if:

- at least 20 distinct transition-geometry signatures occur across the 112 states;
- the pooled state-contingency failure rate lies between 5% and 95%; and
- at least 8 distinct state-level survival fractions occur.

Otherwise verdict = UNEVALUABLE.

## Frozen PASS rule

PASS requires all four:

1. pooled Brier error improves by at least 5% when the transition-geometry block is added;
2. pooled AUROC delta is nonnegative;
3. Brier improves in at least 3 of the 4 held-out maintenance-topology folds; and
4. the augmented model's mean state-level absolute calibration error is lower than the conventional model's in at least 3 of 4 held-out maintenance topologies.

Any failed criterion yields FAIL. No threshold or feature definition may change after outcome generation.

## Interpretation

A PASS would be the first strong evidence in this research program that explicit admissible transition **geometry**, rather than a scalar room measure, adds prospective resilience information beyond conventional condition variables in a topology-varying physical system. A FAIL would materially weaken the grid realization of the broader maneuverability theory and would favor moving to a genuinely different domain rather than further rescue on this benchmark.