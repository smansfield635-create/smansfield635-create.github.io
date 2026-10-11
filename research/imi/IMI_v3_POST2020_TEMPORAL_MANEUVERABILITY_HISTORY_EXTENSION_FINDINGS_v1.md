# IMI v3 — Post-2020 Temporal Maneuverability History-Extension Findings v1

**Status: VALID COMPLETED — PRIMARY VERDICT FAIL / LARGE CALIBRATION IMPROVEMENT WITH DISCRIMINATION DEGRADATION**

## Purpose

This study completed the previously unevaluable post-2020 independent temporal replication by adding only the pre-2019 FFIEC history required to form leakage-purged mature training rows. The 2022–2023 held-out evaluation cohort, six maneuverability geometry features, exact 103-feature conventional-history challenger, 8-quarter horizon, LightGBM learner, and frozen success thresholds were not changed.

Historical 2014–2018 inputs were obtained from the official FFIEC CDR four-period tab-delimited bulk product. The already-qualified 2019–2023 independent Call Report realization remained the held-out source layer. Failure outcomes were obtained from the official FDIC failed-bank listing.

## Frozen success rule

PASS required all three:

1. pooled relative Brier improvement >= 5%;
2. Brier wins in more than half of valid held-out years; and
3. AUROC delta >= -0.002.

No criterion was changed after outcome opening.

## Execution population

- Core-QC bank-quarter rows: **216,697**
- Complete maneuverability-geometry rows: **210,044**
- Pooled held-out observations: **36,848**
- Pooled held-out 8-quarter failure events: **39**
- 2022 training observations: **88,981** with **104** positive labels
- 2022 held-out observations: **18,673** with **20** failures
- 2023 training observations: **108,840** with **111** positive labels
- 2023 held-out observations: **18,175** with **19** failures

## Controlling pooled result

| Metric | State + 103-feature history | State + history + maneuverability | Delta |
|---|---:|---:|---:|
| Brier | 0.003911908 | 0.003357440 | **14.17% relative improvement** |
| AUROC | 0.473023 | 0.460119 | **-0.012904** |
| Average precision | 0.00193384 | 0.00413974 | **+0.00220590** |
| Annual Brier wins | — | **2 / 2** | — |

The augmentation therefore cleared the Brier magnitude threshold by a wide margin and won Brier in both valid years, but failed the frozen discrimination non-degradation requirement because AUROC declined by 0.012904, substantially beyond the allowed -0.002.

## Annual results

### 2022

- Relative Brier improvement: **39.17%**
- History AUROC: **0.212510**
- Augmented AUROC: **0.357227**
- History AP: **0.00082249**
- Augmented AP: **0.00118996**

Maneuverability strongly improved calibration and partially repaired an exceptionally poor conventional-history ranking, but absolute ranking remained below chance-level orientation.

### 2023

- Relative Brier improvement: **6.27%**
- History AUROC: **0.539574**
- Augmented AUROC: **0.399526**
- History AP: **0.00395892**
- Augmented AP: **0.00694549**

Maneuverability again improved calibration and average precision, but materially worsened AUROC ranking.

## Scientific verdict

**PRIMARY TEMPORAL REPLICATION = FAIL.**

The post-2020 result does not establish a breakthrough-level distinct maneuverability construct beyond strong conventional dynamics. The incremental signal is nevertheless not null: the frozen six-feature geometry produced a **14.17% pooled Brier improvement**, won both held-out years, and more than doubled pooled average precision, while failing because rank discrimination deteriorated materially.

The new evidence sharpens the construct's current empirical character:

- **Matched-output prospective divergence:** supported by prior work.
- **Transition-geometry increment over current state:** supported in the predecessor realization.
- **Increment over strong conventional history:** repeatedly present in calibration, but unstable in discrimination.
- **Independent-institution replication:** failed the frozen joint rule.
- **Independent later temporal replication:** failed the frozen joint rule despite large calibration gains.
- **Breakthrough-level distinct maneuverability law:** **not established**.

## Most material interpretation

Across the strongest adversarial tests so far, maneuverability repeatedly behaves more like an incremental **probability/calibration signal** than a stable universal **rank-ordering signal**. The later temporal test makes this distinction more pronounced rather than resolving it. The next lawful high-value study should therefore test whether the geometry contributes stable prospective information conditional on conventional predicted-risk strata or calibration residuals, using a newly frozen analysis that cannot be tuned to rescue AUROC. It should not alter the failed v1 criterion or retroactively redefine this execution as a pass.

## Execution receipt

- GitHub Actions run: `32610171122`
- Artifact: `imi-post2020-history-extension-v1`
- Artifact ID: `9485298337`
- Artifact digest: `sha256:09c856a2e6dbf61089c2f6d2a456953dd673d9ffebe55806acd8cb4cf194ad82`
- Execution head: `81062d22d2b053412b2e576e75179fef594d494e`
- Research PR: `#1717`

This record preserves the failed primary verdict and the mixed positive secondary signal without post-outcome threshold or feature redesign.
