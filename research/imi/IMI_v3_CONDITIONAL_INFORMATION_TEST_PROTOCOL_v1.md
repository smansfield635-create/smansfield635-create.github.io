# IMI v3 — Conditional Information Test Protocol v1

Status: FROZEN BEFORE EXECUTION OF THIS ANALYSIS

Purpose: test the remaining material boundary after the failed post-2020 joint AUROC/Brier rule: whether the frozen maneuverability augmentation contains prospective information conditional on the conventional 103-feature history model's predicted risk.

Input authority: the held-out prediction artifact from GitHub Actions run 32610171122, artifact 9485298337, digest sha256:09c856a2e6dbf61089c2f6d2a456953dd673d9ffebe55806acd8cb4cf194ad82. No model is refit and no feature is changed.

Frozen analysis:
1. Analyze 2022 and 2023 held-out observations only.
2. Within each year, assign observations to 10 equal-count strata by p_history using deterministic rank order.
3. Define baseline residual r = y - p_history and maneuverability adjustment d = p_aug - p_history.
4. Within each year×stratum, center d by subtracting its stratum mean. Define the pooled conditional-alignment statistic T = sum(d_centered * r). Positive T means the maneuverability-induced adjustment points, within matched conventional-risk strata, toward the realized residual error.
5. Obtain an exact-design Monte Carlo conditional randomization p-value with seed 256 and 100,000 permutations by permuting y only within each year×risk stratum while holding p_history and p_aug fixed. One-sided alternative: T > 0.
6. Secondary descriptive checks, not used to change the primary conclusion: Brier improvement by conventional-risk decile; event rate in observations with positive vs negative d within each stratum after pooling; year-specific T and permutation p-values using the same procedure.

Primary decision rule:
- PASS if pooled one-sided conditional-randomization p < 0.01 AND T > 0 AND T is positive in both years.
- FAIL otherwise.

Interpretation constraint: A PASS establishes conditional prospective information in the augmentation relative to conventional predicted-risk strata; it does not retroactively convert the failed AUROC joint rule into a pass, prove causality, or establish a universal maneuverability law.
