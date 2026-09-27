# IMI A/S/H Fresh-Jurisdiction Replication Protocol v1

Status: FROZEN BEFORE RESULT EXPOSURE.

Purpose: test whether the localized wastewater history signal generalizes beyond the jurisdictions used to discover/localize it.

No new domain and no feature engineering. The feature definitions, strong challenger, learner family, outcome, and channel membership are inherited unchanged from `imi_five_signal_localization_v1.py`.

Training jurisdictions: KS and OR, observations through 2022 only.

Fresh evidence jurisdictions: MO, WI, NC. Their 2018-2022 records may be used only to construct each facility's historical features; no fresh-jurisdiction outcome is used for model fitting. Evaluation is restricted to 2023-2025 current-compliant observations with the same prospective 3-observation violation outcome.

Frozen channels:
- A: accumulation/depletion balance = `pos_path12`, `recovery_path12`, `full_pos_rate`, `full_recovery_rate`.
- S: support/compensation divergence proxy = `S_recovery_headroom`, `S_peakgap_headroom`, `S_pressure_headroom`, `S_recovery_minus_current`.
- H: hysteresis/recovery residue candidate = `prior_peak_gap`, `total_variation12`, `excursion_count12`, `full_excursion_rate`.

Primary comparisons: strong challenger vs challenger+A, challenger+S, challenger+H, and challenger+A+S+H. Evaluate pooled fresh evidence and each jurisdiction separately.

Conditional residual test: same risk/current-state/local-slope stratified permutation test used in localization. Multiplicity across A/S/H is controlled by Holm correction.

Evaluability: pooled fresh test >=1500 observations and >=100 events, with each jurisdiction >=300 observations and >=20 events.

Strong replication requires all of the following on pooled fresh evidence: (1) A Holm-adjusted conditional p < .05, Brier improvement > 0, AUROC delta >= 0; (2) S same criteria; (3) A+S+H combined Brier improvement > 0 and AUROC delta >= 0; (4) combined model improves Brier in at least 2 of 3 fresh jurisdictions and does not reduce AUROC by more than .002 in at least 2 of 3.

Partial replication: exactly one of A or S satisfies its pooled frozen criteria while the combined model remains nonnegative on pooled Brier and AUROC.

FAIL: evaluable but neither strong nor partial. UNEVALUABLE: evaluability gate fails.

H is an independently preregistered candidate and is reported but is not required for strong replication because it did not localize coherently in the discovery run.

No thresholds, states, channels, or model settings may be changed after this protocol is executed.