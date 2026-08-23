# IMI v3 — Conditional Information Test Findings v1

**Status: VALID COMPLETED — PRIMARY VERDICT FAIL**

## Boundary tested

After the failed post-2020 joint Brier/AUROC replication, this analysis tested the narrower remaining claim: whether the frozen maneuverability augmentation carries prospective information **conditional on the conventional 103-feature history model's predicted risk**.

The protocol was frozen in `IMI_v3_CONDITIONAL_INFORMATION_TEST_PROTOCOL_v1.md` before this analysis was executed. No model was refit, no feature was changed, and no outcome threshold was tuned.

## Input authority

- Parent execution: GitHub Actions run `32610171122`
- Parent artifact: `9485298337`
- Parent artifact digest: `sha256:09c856a2e6dbf61089c2f6d2a456953dd673d9ffebe55806acd8cb4cf194ad82`
- Prediction file SHA-256: `59ee155b798043f5cc2d6c05fa0c868366efd505f9138c6a1f8793d02002957a`
- Held-out observations: **36,848**
- Held-out failures: **39**

## Frozen primary statistic

Within each held-out year, observations were deterministically assigned to 10 equal-count conventional-risk strata by `p_history`. For each observation:

- baseline residual: `r = y - p_history`
- augmentation adjustment: `d = p_aug - p_history`
- stratum-centered adjustment: `d_c = d - mean(d | year,stratum)`

The primary statistic was:

`T = sum(d_c * r)`

Positive `T` means that, among observations with comparable conventional predicted risk, the maneuverability-induced probability adjustment points toward the realized residual error.

Significance was evaluated with **100,000 conditional randomizations**, seed **256**, permuting outcomes only within each year×risk stratum while holding the two prediction vectors fixed.

## Result

- Pooled observed `T`: **100.7247251911**
- 2022 `T`: **13.6206926219**
- 2023 `T`: **87.1040325692**
- Pooled one-sided conditional-randomization p-value: **0.6430736**
- 2022 one-sided p-value: **0.6389736**
- 2023 one-sided p-value: **0.6562534**

Frozen PASS required pooled `p < 0.01`, positive pooled `T`, and positive `T` in both years.

The sign condition was satisfied, but the conditional-randomization requirement failed decisively.

# PRIMARY VERDICT: FAIL

There is **no statistically persuasive evidence in this held-out cohort that the maneuverability augmentation explains residual outcome variation once conventional predicted-risk strata are held fixed**.

## Secondary descriptive checks

Brier improvement within the 20 year×decile strata was sparse rather than broadly distributed:

- 2022: augmented model improved Brier in **3 of 10** conventional-risk strata.
- 2023: augmented model improved Brier in **1 of 10** strata.
- The strongest positive improvement in both years was concentrated in the highest conventional-risk decile.

The previously observed pooled Brier improvement therefore does not behave like a stable within-risk-stratum information gain. It is more consistent with a coarse probability redistribution / calibration effect concentrated in limited parts of the risk distribution.

## Scientific consequence

This closes the most material rescue boundary raised by the post-2020 replication.

Current evidence now supports the following hierarchy:

- Matched-output divergence / maneuverability variation: observed in prior work.
- Increment over simple current-state descriptions: observed in predecessor realizations.
- Increment over a strong conventional-history challenger: **not stable under frozen joint criteria**.
- Independent later temporal replication: **failed** because AUROC deteriorated despite Brier improvement.
- Conditional residual information within conventional-risk strata: **failed** in the frozen held-out test (`p=0.643`).
- Breakthrough-level distinct maneuverability law beyond conventional dynamics: **not established and materially weakened**.

The result does not prove that admissible transition geometry is useless. It does show that the strongest current empirical banking realization does **not** support the claim that its added predictive value survives conditioning on a strong conventional risk model in a stable prospective way.

Any further banking-domain work should now be treated as construct diagnosis, not as repeated attempts to rescue the same predictive claim. A materially stronger next boundary would require either (a) a new operationalization that directly represents admissible identity-preserving transitions rather than empirical nearest-neighbor geometry, frozen before outcome exposure, or (b) an independent domain in which admissible transitions can be enumerated or constrained mechanistically rather than inferred from historical similarity.
