# IMI Structural-Regime Severe Test v1

## Purpose
Test whether the previously observed jurisdiction-specific A/S/H trajectory effects are concentrated in externally grounded, outcome-independent wastewater-system structures rather than in post-hoc statistical thresholds.

The prior universal A/S/H replication FAIL and the low-baseline-risk regime FAIL remain binding.

## Training and confirmation design
- Model-training jurisdictions: KS and OR, observations through 2022 only.
- Untouched confirmation jurisdictions: IA, KY, AZ, evaluation restricted to 2023-2025.
- Historical 2018-2022 records from confirmation jurisdictions may be used only to compute structural descriptors; no 2023-2025 outcome may define a structural rule.
- Outcome: same frozen prospective 3-observed-month violation outcome Y.
- Challenger: same frozen 147-feature strong challenger.
- Augmentation: same frozen A+S+H feature set from the localization work; no feature engineering after exposure.

## Five outcome-independent structural axes
Each permit receives descriptors computed only from its own pre-2023 history. Thresholds are medians learned only from KS/OR pre-2023 structural distributions.

1. COMPLEXITY: historical median monthly constraint count.
2. STRUCTURAL_VARIABILITY: historical standard deviation of monthly constraint count.
3. MONITORING_DENSITY: number of distinct observed permit-months during 2018-2022.
4. CONSTRAINT_CONCENTRATION: historical mean margin entropy.
5. HIGH_PRESSURE_EXPOSURE: historical fraction of months with near80_frac >= 0.25.

For each axis, both sides are evaluated, but the confirmatory family is defined prospectively as the side mechanistically expected to preserve path information:
- high COMPLEXITY
- high STRUCTURAL_VARIABILITY
- high MONITORING_DENSITY
- low CONSTRAINT_CONCENTRATION (more uneven bottleneck structure)
- high HIGH_PRESSURE_EXPOSURE

## Evaluability
Overall confirmation requires >=1500 observations, >=100 events, and each state >=300 observations and >=20 events. Each structural regime requires >=500 inside-regime observations and >=100 outside-regime observations.

## Primary test
For each structural regime compare strong challenger vs challenger+A/S/H inside and outside the regime.
Compute:
- Brier relative improvement inside and outside,
- AUROC delta inside and outside,
- interaction = per-observation Brier gain inside minus outside,
- 5000-permutation state-stratified interaction p-value.
Apply Holm correction across the five structural axes.

## Verdict
STRUCTURAL_REPLICATION requires at least one preregistered structural regime with:
1. Holm-adjusted interaction p < 0.05,
2. positive interaction,
3. inside-regime Brier improvement > 0,
4. inside-regime AUROC delta >= 0,
5. positive inside-regime Brier improvement in at least two of IA/KY/AZ, and
6. AUROC delta >= -0.002 in at least two of IA/KY/AZ.

If fully evaluable and no regime satisfies all criteria: FAIL.
If sample gates fail: UNEVALUABLE.

No axis, threshold direction, feature definition, jurisdiction, outcome, or criterion may be changed after 2023-2025 confirmation exposure.