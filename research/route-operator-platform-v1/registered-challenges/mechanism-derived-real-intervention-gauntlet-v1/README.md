# Mechanism-Derived Real Intervention Gauntlet v1

## Operation

`MECHANISM_DERIVED_REAL_INTERVENTION_GAUNTLET_v1`

## Status

- Protocol: `FROZEN_BEFORE_SYSTEM_ADMISSION`
- Experiment execution: `NOT_STARTED`
- Scientific result: `NONE`
- Core instrument mutation: `FALSE`
- Post-outcome repair: `PROHIBITED`

## Purpose

This operation tests whether identity-conditioned reachability adds mechanism-specific predictive value under real, independently documented faults and component changes.

It is not a synthetic demonstration and it is not a new fit of the frozen IMI core. Relation candidates must be derived from independent system documentation, intervention episodes must correspond to actual documented faults or component changes, and all theory and comparator predictions must be frozen before held-out intervention outcomes are unblinded.

## Primary tests

1. `SELECTIVE_ROUTE_LOSS`
2. `UNRELATED_CAPACITY_NONCOMPENSATION`
3. `SUPPORTED_OUTPUT_WITH_INTERNAL_ROUTE_LOSS`
4. `RELATION_SPECIFIC_RESTORATION`
5. `HYSTERESIS`

## Frozen comparators

1. `OUTPUT_HISTORY`
2. `ADDITIVE_FEATURES`
3. `GRAPH_DEPENDENCY`
4. `BLACK_BOX`

Every comparator receives the same public documentation, observations, intervention descriptors, training material, and prediction deadline. No model may use hidden truth or held-out outcomes.

## Decisive question

Can a relation-and-route representation prospectively identify which functions will fail, which will remain intact, whether visible output is intrinsic or supported, what repair will restore endogenous reachability, and whether the system returns to its prior state after reversal—better than simpler output, additive, graph, or black-box alternatives?

## Primary dispositions

- `MECHANISM_FALSE`
- `MECHANISM_UNDERDEFINED`
- `MECHANISM_REDUNDANT`
- `SURVIVES_INITIAL_REAL_INTERVENTION_GAUNTLET`
- `UNEVALUABLE_CUSTODY_OR_POWER_FAILURE`

Survival means only that the candidate survived this preregistered initial gauntlet. It does not establish universal validity or causal completeness.

## Lineage

This operation is a separately versioned descendant of the frozen external adversarial challenge at exact head `85c7ae8092e7a9e7b305f89526e250bf72abe428`. It does not modify that protocol or create a scientific result for it.
