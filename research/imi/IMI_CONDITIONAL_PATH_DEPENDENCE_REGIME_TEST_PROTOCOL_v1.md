# IMI Conditional Path-Dependence Regime Test v1

Status: FROZEN BEFORE CONFIRMATORY OUTCOME EXPOSURE.

Purpose: test whether the failed universal A/S/H replication hides an identifiable, reproducible regime in which trajectory history has prospective value. This does not replace or soften the prior fresh-jurisdiction FAIL.

## Fixed architecture

Training jurisdictions: KS, OR through 2022 only.

Discovery jurisdictions: MO, WI, NC during 2023-2024 only.

Untouched confirmation jurisdictions: VA, GA, MN during 2023-2025.

Outcome: any admitted wastewater violation in the next three observed permit-months, identical to the prior severe tests.

Baseline: the frozen 147-feature strong challenger from the trajectory-residue program.

Trajectory augmentation: the previously frozen A+S+H feature set without mutation.

## Frozen candidate regime axes

Five mechanistically distinct pre-outcome descriptors are allowed:

1. PRESSURE = current max_util.
2. COMPLEXITY = log1p(n_constraints).
3. VOLATILITY = total_variation12.
4. HISTORY_DEPTH = obs_age.
5. BASELINE_RISK = challenger predicted probability.

For each axis, the discovery threshold is its discovery-cohort median. Both low and high sides are evaluated. A side is eligible only with at least 300 discovery observations and 50 events.

The discovery-selected regime is the eligible axis/side with the largest positive mean per-observation Brier advantage of A+S+H over baseline, where advantage = (y-p_base)^2 - (y-p_ash)^2. This is explicitly discovery, not confirmation.

The selected axis, threshold, and side are then frozen and applied unchanged to VA/GA/MN.

## Confirmation test

Primary interaction statistic on untouched confirmation data:

mean advantage inside selected regime minus mean advantage outside selected regime.

Significance is assessed by 10,000 permutations of the inside/outside regime labels within jurisdiction. PASS requires all of:

- selected confirmation regime has >=600 observations and >=75 events;
- inside-regime A+S+H Brier improves over baseline;
- inside-regime AUROC change >= 0;
- inside-vs-outside Brier-advantage interaction > 0 with permutation p < 0.01;
- at least 2 of 3 confirmation jurisdictions have positive inside-regime Brier improvement;
- at least 2 of 3 have inside-regime AUROC change >= -0.002.

Verdicts: CONDITIONAL_REPLICATION, FAIL, or UNEVALUABLE.

No alternate axis, threshold, side, feature mutation, state substitution, or outcome definition may be chosen after confirmation outcomes are examined.