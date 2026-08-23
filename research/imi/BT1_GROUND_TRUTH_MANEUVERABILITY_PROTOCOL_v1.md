# BT1 Ground-Truth Maneuverability Benchmark v1

STATUS=FROZEN_BEFORE_OUTCOME_EXECUTION
PURPOSE=FALSIFICATION_GRADE_BT1_TEST

## Scientific question
Does a latent remaining viable-action quantity inferred from partial observational history add held-out fragility information beyond conventional state, recent trajectory, headroom, utilization/control effort, perturbation severity, and raw recent command-response history?

## System
Discrete double integrator with bounded position and velocity and hidden actuator authority alpha:

p[t+1] = p[t] + v[t] dt + 0.5 alpha u[t] dt^2
v[t+1] = v[t] + alpha u[t] dt

with u in [-1,1], |p| <= 1, |v| <= 1, dt=0.1, and episode-constant hidden alpha in [0.35,1.0].

This benchmark is chosen because bounded-control double-integrator viability is an established control-theory object and the viable set can be computed independently from the Diamond Gate instrument.

## Ground-truth maneuverability
For each current state (p,v) and true alpha, enumerate 401 candidate commands u over [-1,1]. A command is viable iff the one-step successor remains inside the analytic bounded-control viability kernel:

if v'>0: p' + v'^2/(2 alpha) <= 1
if v'<0: p' - v'^2/(2 alpha) >= -1
and |p'|<=1, |v'|<=1.

M_true is the fraction of candidate commands that are viable. This target is defined by the physical model and constraints, not by IMI or any learned Diamond Gate quantity.

## Partial-history inference
Each sample includes six preceding observed transitions with commanded u and observed (p,v). alpha is not exposed. Estimate alpha_hat only from the command-response history by least squares on dv = alpha*u*dt. Compute M_hat by substituting alpha_hat into the same independently specified viability calculation.

## Outcome
After the history window, apply an exogenous velocity impulse of signed severity z. Y=1 iff the post-impulse state is outside the true viability kernel under true alpha; otherwise Y=0. Perturbation severity and sign are exposed to all models.

## Frozen conventional predictors
Current p, v; absolute position and velocity headroom; six lagged p and v values; five recent dp and dv values; six commanded controls; mean absolute control effort; recent mean and slope of p and v; recent acceleration magnitude summaries; perturbation magnitude and sign.

No alpha_hat, M_hat, true alpha, true M, or viability-kernel-derived variable is allowed in the conventional baseline.

## Models
1. Logistic conventional baseline.
2. HistGradientBoosting conventional baseline (strong comparator).
3. Same logistic baseline + M_hat.
4. Same HistGradientBoosting baseline + M_hat.

Hyperparameters are frozen before outcome inspection. No post-hoc tuning.

## Split
Deterministic episode-level train/test split by RNG seed. Test episodes are never used for fitting. N=12000 samples target, 70/30 split.

## H1 tests
On held-out samples, report Pearson correlation, Spearman correlation, MAE, and RMSE between M_hat and M_true. H1 is supported within benchmark scope only if Pearson >=0.85, Spearman >=0.85, and normalized MAE <=0.10 of the unit maneuverability scale.

## H2 incremental tests
Report held-out AUROC and log loss for all four models. Primary comparison is strong conventional HistGradientBoosting versus the same model + M_hat.

Material incremental support requires both:
- AUROC improvement >=0.02; and
- log-loss improvement >=0.01.

A smaller positive increment is classified SUPPORTED_BUT_NOT_DISTINGUISHED unless it survives adverse controls strongly enough to justify otherwise.

## Adverse controls
- shuffled M_hat must not reproduce the increment;
- true M is evaluated only as an oracle upper-bound diagnostic, never as a fair predictor;
- perturbation severity is present in every baseline;
- recent command-response history is present in the strong conventional comparator.

## Falsification ruling
SUPPORTED: H1 passes and H2 materially passes against the strongest baseline with adverse controls clean.
SUPPORTED_BUT_NOT_DISTINGUISHED: H1 passes, but M_hat does not materially improve the strongest conventional comparator.
INCONCLUSIVE: evaluability or class-balance failure prevents a decisive test.
MATERIALLY_WEAKENED: H1 fails materially or H2 is negative enough to undermine the candidate while not proving impossibility.
FALSIFIED_WITHIN_TESTED_SCOPE: the latent target is not inferable under the declared observation process and/or adds no information even where the benchmark was explicitly designed to expose hidden control authority, with sufficient test power.

Negative results are binding. No threshold or feature changes after outcome exposure count as this frozen test.