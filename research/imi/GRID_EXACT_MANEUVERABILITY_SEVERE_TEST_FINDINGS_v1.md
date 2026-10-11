# Grid Exact Maneuverability Severe Test — Findings v1

**Status: VALID COMPLETED — PRIMARY VERDICT FAIL**

## Purpose

This study tested the maneuverability hypothesis in a domain where admissible identity-preserving transitions can be calculated directly from physical constraints rather than inferred from historical similarity. The protocol was frozen before execution.

Five standard MATPOWER/PYPOWER transmission benchmarks were used: IEEE 14-bus, IEEE 30-bus, New England 39-bus, IEEE 57-bus, and IEEE 118-bus. Within each topology, 80 feasible matched-output dispatch states preserved the same load vector and total generation. Maneuverability M was the normalized bidirectional volume of feasible balanced generator redispatch across all online-generator pairs, subject simultaneously to generator Pmin/Pmax and intact-grid branch thermal constraints.

Prospective resilience was then evaluated under every non-islanding N-1 branch outage. A state-contingency survived only when a corrective redispatch LP could preserve full load, balance, generator limits, a frozen 20% corrective-ramp bound, and all remaining branch limits with no load shedding.

## Frozen success rule

Breakthrough-level PASS required all of the following:

1. pooled leave-one-topology-out Brier improvement >= 5%;
2. pooled AUROC delta >= 0;
3. Brier improvement in at least 4 of 5 held-out topologies;
4. higher-M states win at least 70% of informative matched-output pairs, with positive mean matched survival difference in at least 4 of 5 topologies;
5. M has positive Spearman correlation with state-level N-1 survival in at least 4 of 5 topologies.

No criterion was changed after outcome generation.

## Execution population

- Benchmark topologies: **5**
- Feasible matched-output states per topology: **80**
- Total states: **400**
- State-contingency rows: **27,840**
- Overall N-1 survival rate: **0.99220546**
- Random seed: `20260823`

## Primary predictive result

| Metric | Conventional operating state X | X + exact maneuverability M | Delta |
|---|---:|---:|---:|
| Brier | 0.0077246243 | 0.0077423623 | **-0.23% relative improvement (worse)** |
| AUROC | 0.89037537 | 0.88720129 | **-0.00317407** |
| Average precision | 0.99739521 | 0.99783854 | +0.00044333 |

Exact maneuverability did not improve pooled probability accuracy and slightly worsened pooled discrimination.

## Leave-one-topology-out folds

- **IEEE 14-bus:** all 1,520 non-islanding N-1 state-contingencies survived; no discrimination endpoint was available. Brier changed only at numerical-near-zero scale.
- **IEEE 30-bus:** 2,978 / 3,040 survived. Brier worsened by **0.64%** with M; AUROC fell from **0.735618** to **0.724214**.
- **New England 39-bus:** 2,645 / 2,800 survived. Brier worsened by **0.07%** with M; AUROC fell from **0.845299** to **0.825121**.
- **IEEE 57-bus:** all 6,320 contingencies survived; no discrimination endpoint was available.
- **IEEE 118-bus:** all 14,160 contingencies survived; no discrimination endpoint was available.

## Matched-output severe test

- Matched pairs satisfying |ΔM| >= 0.15: **64**
- Informative pairs with unequal survival: **36**
- Fraction where the higher-M state had higher N-1 survival: **55.56%**
- Topologies with positive mean matched survival difference: **1 / 5**

The frozen 70% directional threshold was not approached.

## Monotonicity

State-level Spearman correlation between M and N-1 survival:

- IEEE 14-bus: rho = **0.0000** (M and survival saturated)
- IEEE 30-bus: rho = **0.321125**, p = **0.00368**
- New England 39-bus: rho = **0.108564**, p = **0.33777**
- IEEE 57-bus: rho = **0.0000** (M and survival saturated)
- IEEE 118-bus: rho = **0.0000** (M and survival saturated)

Only **2 / 5** topologies had positive rho, versus the frozen requirement of 4 / 5.

## Important identifiability finding

Three benchmark systems — IEEE 14, IEEE 57, and IEEE 118 — had effectively non-binding branch limits for the generated dispatch family under this DC realization. Their exact maneuverability measure saturated at **M = 1.0 for all 80 states**, and every tested non-islanding N-1 contingency survived. These systems therefore contributed essentially no identifying variation for the maneuverability hypothesis.

The informative systems were IEEE 30 and New England 39. Their M ranges were approximately:

- IEEE 30: **0.53684 to 0.97924**
- New England 39: **0.30475 to 0.80341**

IEEE 30 showed a statistically clear positive state-level M/survival association, while New England 39 showed a weak positive association, but neither produced incremental leave-one-topology-out predictive improvement when M was added to the conventional challenger.

## Scientific verdict

**PRIMARY EXACT-GRID SEVERE TEST = FAIL.**

This execution does not establish a breakthrough-level law that the volume of admissible balanced redispatch transitions adds general prospective resilience information beyond conventional operating-state variables across standard grid benchmarks.

The result is stronger than the earlier banking proxy in one important respect: M was physically defined and exactly calculated within the DC model. The failure therefore cannot be attributed to nearest-neighbor or historical-similarity proxy construction.

However, the execution also exposed a benchmark-identifiability limitation. Three of five standard systems were too unconstrained under their published thermal limits to generate meaningful variation in either M or N-1 survival. The clean next boundary is therefore a separately frozen **stressed-grid replication using benchmark systems with explicit binding operational limits**, not a redefinition of this failed v1 result. The v1 verdict remains FAIL regardless of any later study.

## Execution receipt

- GitHub Actions run: `32611147419`
- Artifact: `grid-exact-maneuverability-severe-test-v1`
- Artifact ID: `9485584867`
- Artifact digest: `sha256:48bf0f13ecac0593d7432c8ce2547ee25750bacac4e3493cf475de4bca01c5eb`
- Execution head: `be81ab7e844e10fd9c6d0a3e0aca6058d24e22c8`
- Research PR: `#1722`

This record preserves the primary failure, the informative positive IEEE-30 secondary association, and the saturation limitation without post-outcome rescue or threshold changes.