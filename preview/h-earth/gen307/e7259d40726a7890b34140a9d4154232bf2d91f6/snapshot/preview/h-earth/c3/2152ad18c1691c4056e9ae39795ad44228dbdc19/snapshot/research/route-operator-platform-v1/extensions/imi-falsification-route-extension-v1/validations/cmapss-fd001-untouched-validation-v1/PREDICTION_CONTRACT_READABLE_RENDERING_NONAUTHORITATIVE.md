# IMI C-MAPSS Untouched Validation Contract v1

STATUS = READABLE_RENDERING_ONLY
AUTHORITATIVE_FROZEN_OBJECT = PREDICTION_CONTRACT_FROZEN_BEFORE_OUTCOME_ACCESS.md
AUTHORITY = NONAUTHORITATIVE_POSTEXECUTION_RENDERING
MUTATION_OF_FROZEN_CONTRACT = PROHIBITED

CONTRACT_ID = IMI_CMAPSS_FD001_FACTORIAL_TEMPORAL_RUL_UNTOUCHED_VALIDATION_v1
FROZEN_STATUS = FROZEN_BEFORE_TEST_OUTCOME_ACCESS
DATA_SOURCE = NASA C-MAPSS Turbofan Engine Degradation Simulation, FD001
DEVELOPMENT_SET = train_FD001.txt, 100 complete run-to-failure trajectories
UNTOUCHED_VALIDATION_FEATURE_SET = test_FD001.txt, 100 truncated trajectories
UNTOUCHED_VALIDATION_OUTCOME = RUL_FD001.txt

OUTCOME_ACCESS_RULE = RUL_FD001.txt must not be opened or parsed until all feature definitions, model classes, hyperparameter procedures, material margins, and analysis code are frozen and hashed.

## Scope

This contract tests a bounded utility claim. It does not test support dependence, substitution, route identity, restoration, successor formation, or the universal parent theory.

PRIMARY_CLAIM = A factorial temporal representation derived from multidimensional intrinsic condition, including current constraint severity, direction, and persistence, materially improves untouched remaining-useful-life prediction beyond an age-only baseline.

MULTIPLICATIVE_SPECIFICITY_CLAIM = The multiplicative IMI severity representation materially outperforms the corresponding additive severity representation under identical temporal features and fitting procedures.

## Factor architecture

1. Use FD001 only, which contains one operating condition and one fault mode.
2. Determine candidate sensors from training data only.
3. Exclude sensors with near-zero training variability.
4. Determine degradation direction from the training-set early-versus-late median difference.
5. Require absolute training monotonicity with normalized life progress greater than or equal to 0.40.
6. Prevent duplicate-factor overweighting by retaining one sensor from any absolute-correlation cluster greater than or equal to 0.95, choosing the sensor with stronger training monotonicity.
7. Construct each availability factor a_i in [0,1] using training-only nominal and degraded anchors:

   severity_i = clip(direction_i * (x_i - nominal_i) / scale_i, 0, 1)

   availability_i = 1 - severity_i

   nominal_i = pooled median of the first 20 percent of each training trajectory

   degraded_anchor_i = pooled median of the final 10 percent of each training trajectory

   scale_i = direction_i * (degraded_anchor_i - nominal_i), required greater than 0

8. Multiplicative condition severity:

   CS = 1 - product(a_i)

9. Additive condition severity:

   MEAN_SEVERITY = mean(1 - a_i)

10. Weakest-factor severity:

   WEAKEST_SEVERITY = 1 - min(a_i)

11. Direction = ordinary least-squares slope of the relevant severity over the final min(10, observed_cycles) cycles.
12. Persistence = fraction of positive severity increments over the final min(10, observed_cycles) cycles.
13. UNKNOWN or UNEVALUABLE is required if fewer than three observed cycles exist or no factors survive training admission.

## Development sampling

For each complete training engine, construct deterministic pseudo-test endpoints at 40, 55, 70, 80, and 90 percent of observed lifetime, floored with a minimum endpoint of cycle 3. The target is true cycles remaining at that endpoint. No test outcomes may participate in feature selection, normalization, model fitting, or hyperparameter selection.

## Competing models

M0_AGE_ONLY = current cycle only.

M1_IMI_CONDITION = cycle plus multiplicative condition severity CS.

M2_IMI_FACTORIAL = cycle plus multiplicative CS plus CS direction plus CS persistence.

M3_ADDITIVE_FACTORIAL = cycle plus additive mean severity plus additive direction plus additive persistence.

M4_WEAKEST_FACTORIAL = cycle plus weakest-factor severity plus weakest-factor direction plus weakest-factor persistence.

M5_FULL_SENSOR_RIDGE = cycle plus admitted current sensor severities plus admitted sensor slopes over the final 10 cycles.

All models use ridge regression with intercept. Alpha is selected independently for each model from {0, 0.01, 0.1, 1, 10, 100} by grouped five-fold cross-validation on training engines only, minimizing RMSE. Identical development rows and folds are used for every model.

## Outcome and metrics

OUTCOME = true remaining useful life in cycles for each of 100 FD001 test engines.

PRIMARY_METRIC = RMSE.

SECONDARY_METRICS = MAE, Spearman correlation, calibration intercept, calibration slope, and mean error.

PAIRED_COMPARISON = engine-level squared-error and absolute-error differences.

UNCERTAINTY = paired engine bootstrap with 10,000 resamples, fixed seed 256, reporting 95 percent confidence intervals.

## Materiality

A model materially improves on a comparator only if both conditions hold:

1. Relative RMSE improvement is at least 5 percent.
2. The paired bootstrap 95 percent confidence interval for RMSE improvement is greater than zero.

FACTORIAL_TEMPORAL_UTILITY_SUPPORTED if M2 materially improves over M0 and M1.

MULTIDIMENSIONAL_CONDITION_UTILITY_SUPPORTED if M1 materially improves over M0.

MULTIPLICATIVE_SPECIFICITY_SUPPORTED if M2 materially improves over M3.

OPERATOR_NOT_DISTINGUISHED if M2 improves over M0 but does not materially improve over M3.

FULL_COMPLEXITY_INCREMENT_SUPPORTED if M5 materially improves over the best compressed model.

CLAIM_NOT_SUPPORTED if M2 does not materially improve over M0.

## Personal continuation interpretation

This interpretation remains outside the scientific disposition.

CONTINUE is supported if untouched validation establishes at least one material distinctive advantage for M2 over simple baselines without M2 being dominated by M3 or M5.

NARROW_AND_REDESIGN_BEFORE_FURTHER_INVESTMENT is supported if multidimensional or temporal information is useful but multiplication is not distinctive, or if only the full sensor model performs materially better.

STOP_OR_FUNDAMENTALLY_REDESIGN is supported if no IMI-derived compressed model materially improves over age-only and additive or simple alternatives on untouched outcomes.
