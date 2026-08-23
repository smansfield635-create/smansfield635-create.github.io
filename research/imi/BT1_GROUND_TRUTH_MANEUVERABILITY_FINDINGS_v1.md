# BT1 Ground-Truth Maneuverability Findings v1

STATUS=COMPLETE
VERDICT=SUPPORTED_BUT_NOT_DISTINGUISHED
PROTOCOL_FROZEN_COMMIT=415ad5dbe3891f6a6e427ce22eb2d18fbeded3b6

## What was tested
A bounded double-integrator system with hidden episode-level actuator authority alpha in [0.35,1.0]. Ground-truth remaining viable maneuverability M_true was defined independently as the fraction of 401 candidate commands whose successor remained inside the analytic bounded-control viability kernel. The observation process exposed six prior state transitions and commanded controls but not alpha.

M_hat was reconstructed from partial command-response history via an alpha estimate and then mapped through the predeclared viability calculation. The outcome was whether a signed exogenous velocity perturbation moved the system outside the true viability kernel.

N=12,000 samples; deterministic 70/30 held-out split; held-out N=3,600; event prevalence=0.229.

## H1: observational inferability
Held-out M_hat versus independently computed M_true:

- Pearson correlation: 0.9999999999999987
- Spearman correlation: 1.0
- MAE: 0.0
- RMSE: 0.0

H1 passes within this noiseless declared observation model. Because the physical transition equation is deterministic and command-response history identifies alpha exactly here, this is a best-case identifiability result, not evidence that real systems will permit exact recovery.

## H2: incremental fragility value
Held-out results:

| Model | AUROC | Log loss |
|---|---:|---:|
| Logistic conventional | 0.8305849724 | 0.4192439922 |
| Logistic + M_hat | 0.8341636706 | 0.4175420132 |
| HistGradientBoosting conventional | 0.9959023775 | 0.0793945233 |
| HistGradientBoosting + M_hat | 0.9967631711 | 0.0667134087 |
| HistGradientBoosting + shuffled M_hat | 0.9957992047 | 0.0823855315 |
| HistGradientBoosting + true M oracle | 0.9967631711 | 0.0667134087 |

Primary strong-comparator increment from M_hat:

- AUROC delta: +0.0008607936
- log-loss improvement: +0.0126811146

The frozen material-support rule required BOTH AUROC >= +0.02 and log-loss improvement >= 0.01. The log-loss condition passes; the AUROC condition fails by a large margin. Therefore H2 does not achieve material incremental distinction against the strongest conventional comparator.

The shuffled-M adverse control does not reproduce the improvement. The true-M oracle equals M_hat in this noiseless benchmark, confirming that estimation error is not what limits incremental discrimination.

## Strongest conventional comparator
The strongest conventional comparator is HistGradientBoosting using current position/velocity, headroom, six-lag state history, recent deltas, six controls, control effort, recent slopes and acceleration summaries, and perturbation magnitude/sign. It reaches AUROC 0.995902 and log loss 0.079395 before M is supplied.

## Alternative explanation
The benchmark exposes the central reduction risk directly: recent command-response history contains enough information for a flexible conventional learner to reconstruct almost all fragility-relevant consequences of hidden actuator authority. M then acts largely as an explicit geometric synthesis of information already latent in the conventional history. The log-loss improvement suggests useful compression/calibration, but the near-saturated AUROC and tiny AUROC increment do not support a claim that M contains strongly non-reducible predictive information in this benchmark.

## Falsification ruling
SUPPORTED_BUT_NOT_DISTINGUISHED

H1 is strongly supported within the idealized deterministic scope: latent viable maneuverability is observationally inferable when control inputs and exact state responses are available.

H2 is not distinguished within the tested scope. Maneuverability adds a measurable calibration/log-loss benefit, but not the predeclared material discrimination increment beyond a strong flexible state/history/control-response comparator.

## Claim entitlement
Diamond Gate is entitled to say:

1. In a controlled system with independently known viability geometry and hidden control authority, remaining viable maneuverability can be recovered from partial command-response history under idealized noiseless conditions.
2. Explicit maneuverability can improve probabilistic fragility calibration beyond conventional state/history features in this benchmark.
3. This benchmark does NOT establish maneuverability as a distinct non-reducible latent state variable; a flexible conventional model nearly reconstructs the relevant information without receiving M explicitly.

Diamond Gate is not entitled to claim H2 confirmed, universal latent maneuverability, real-world transfer, or causal precedence from this result.
