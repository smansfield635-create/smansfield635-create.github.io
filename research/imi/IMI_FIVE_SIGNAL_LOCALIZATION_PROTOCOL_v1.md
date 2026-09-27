# IMI Five-Signal Localization Protocol v1

Purpose: localize the statistically detectable history residue from the completed wastewater Markov-sufficiency kill test without changing the outcome, temporal split, learner, or conventional challenger.

Five frozen channels:

1. A — accumulation/depletion balance: pos_path12, recovery_path12, full_pos_rate, full_recovery_rate.
2. P — persistence/path pressure: longest_high_run12, ordered_area12, turn_count12, full_turn_rate.
3. H — hysteresis/recovery residue: prior_peak_gap, total_variation12, excursion_count12, full_excursion_rate.
4. G — topology/constraint interaction: theory-specified interactions between A/P/H history and current constraint topology (n_constraints, margin_entropy, near80_frac, near90_frac).
5. S — support/compensation proxy: theory-specified interactions expressing low current utilization after prior burden/recovery, using (1-max_util), prior_peak_gap, recovery_path12, and longest_high_run12.

The primary analysis adds each channel separately to the same strong challenger used in the kill test and evaluates the untouched 2023+ holdout. Secondary analysis evaluates unseen-Texas transfer. Each channel gets Brier, AUROC, AP, and a risk/current/slope-stratified conditional-residual permutation test. A leave-one-channel-out analysis tests whether any channel uniquely contributes after all five are present.

Multiplicity is controlled across five primary channels with Holm correction on the five conditional-residual p-values. A signal is called COHERENT only if: (a) Holm-adjusted p<0.05, (b) temporal AUROC delta is nonnegative, and (c) temporal Brier does not worsen by more than 0.5%. Transfer direction is reported but not required for localization. The overall localization verdict is LOCALIZED if at least one channel is COHERENT and its leave-one-out removal worsens either Brier or AUROC; otherwise DIFFUSE_OR_NULL. No post-outcome feature tuning is permitted.