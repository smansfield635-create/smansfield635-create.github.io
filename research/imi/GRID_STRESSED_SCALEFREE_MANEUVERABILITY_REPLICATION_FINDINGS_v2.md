# Grid Stressed Scale-Free Maneuverability Replication — Findings v2

**Status: VALID COMPLETED — PRIMARY VERDICT FAIL**

## Purpose

This fresh-state study closed the remaining scale issue left by the stressed-grid v1 execution. V1 remains permanently UNEVALUABLE under its frozen absolute-M-span gate. V2 used a new seed and 300 new intact-feasible dispatch states, retained the same exact physical maneuverability definition, and replaced no v1 threshold. Its confirmatory tests were independently frozen as scale-free rank, quartile, and state-blocked predictive comparisons before v2 outcomes were generated.

The external source remained the PowerAgentBench stressed IEEE 39-bus benchmark pinned to commit `a93255d827292922165c05396b600904e0a6130e`.

## Execution population

- Fresh seed: `20260824`
- States: **300**
- Non-islanding N-1 state-contingency rows: **10,500**
- Failure rate: **42.8571%**
- Distinct exact-M values: **300 / 300**
- M range: **0.0246629 to 0.1319872**

The test was therefore fully evaluable under the frozen v2 criteria.

## Controlling predictive result

| Metric | Conventional X | X + exact M | Result |
|---|---:|---:|---:|
| Brier | 0.0000177991 | 0.0000166045 | **6.71% improvement** |
| AUROC | 1.0000 | 1.0000 | **Δ 0.0000** |
| Average precision | 1.0000 | 1.0000 | unchanged |
| Fold Brier wins | — | **5 / 5** | passes |

Thus exact M cleared the predictive calibration criteria: pooled Brier improved by 6.71%, AUROC did not degrade, and Brier improved in every state-blocked fold.

## Decisive failure

The direct state-level tests failed completely.

Every generated state had the same N-1 survival fraction:

- bottom M quartile mean survival: **0.5714285714**
- top M quartile mean survival: **0.5714285714**
- quartile difference: **0.0000**
- two-sided permutation p: **1.0000**

Because state survival was constant, Spearman rho(M, survival) was undefined. The frozen requirement for a positive significant monotonic relation therefore failed.

This means the 42.86% failures were determined by **which line was outaged**, not by the dispatch state's exact redispatch-room value. The conventional state+contingency challenger already separated the outcomes perfectly (AUROC 1.0). Adding M made probability estimates numerically slightly sharper, but it did not alter prospective state resilience at all.

## Frozen criteria

- pooled Brier improvement >= 5%: **PASS**
- pooled AUROC delta >= 0: **PASS**
- Brier wins in >= 4/5 folds: **PASS (5/5)**
- positive Spearman rho with p < 0.01: **FAIL**
- top-M quartile survival > bottom-M quartile survival with permutation p < 0.01: **FAIL**

## Scientific verdict

**STRESSED-GRID SCALE-FREE REPLICATION v2 = FAIL.**

This closes the principal stressed-grid rescue route for the current exact balanced-generator-redispatch definition. The earlier standard-grid failure cannot be explained away solely by benchmark saturation, and the stressed-grid v1 unevaluable result cannot be rescued merely by using scale-free M comparisons.

The strongest surviving observation is narrower: M can slightly improve probability calibration even when the conventional contingency description already ranks outcomes perfectly. That is not evidence that higher maneuvering room causes or reliably predicts greater state-level N-1 resilience.

The current exact-grid evidence therefore does **not** support a general law that greater admissible balanced redispatch volume produces greater prospective resilience at matched output.

## What this does and does not falsify

This result materially weakens the present operationalization of maneuverability as **aggregate normalized balanced generator-redispatch volume**. It does not test every possible definition of admissible identity-preserving transitions. In particular, it does not include topology switching, storage/state-of-charge actions, load flexibility, reactive-power/voltage actions, protection logic, or multi-step transition sequences.

Any subsequent study must therefore change the represented transition set for an independently justified physical reason; further threshold or statistical rescue of this same generator-redispatch scalar would be outcome-driven and is not warranted.

## Execution receipt

- GitHub Actions run: `32611915049`
- Artifact: `grid-stressed-scalefree-replication-v2`
- Artifact ID: `9485767960`
- Artifact digest: `sha256:9975a1344d8966624e0eb0b0cbf335a9774d7adcda9464539d19bbe7befe08ca`
- Execution head: `fe7fc1768408302824452dda15e5a907ef596184`
- Research PR: `#1724`

The negative verdict and all positive secondary metrics are preserved without post-outcome threshold changes.