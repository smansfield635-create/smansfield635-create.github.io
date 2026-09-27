# Wastewater Safe-Envelope Contraction — Adversarial Protocol v1

## Purpose

This is a severe test of the dynamic instrumentation, not a search for a favorable domain result. The hypothesis is that among currently compliant wastewater states with similar conventional condition and recent history, the cross-constraint geometry and contraction of the remaining enforceable operating envelope contains prospective information about future effluent violations.

The protocol is frozen before model outcomes are inspected. No threshold may be relaxed after execution.

## Public authority and source

Source is US EPA ECHO / ICIS-NPDES state-year DMR+limit downloads. EPA documents that DMR data identify permit conditions/limits, reported discharge values, and whether the reported amounts exceeded permit limits; DMR files are available by fiscal year since 2009. Only enforceable (`LIMIT_TYPE_CODE == ENF`) numeric limits in standard units are admitted.

State-year source pattern: `https://echo.epa.gov/files/echodownloads/NPDES_by_state_year/{STATE}_FY{YEAR}_NPDES_DMRS_LIMITS.zip`.

## Frozen jurisdictions and years

- Kansas (KS)
- Oregon (OR)
- Tennessee (TN)
- Fiscal years 2018–2025

These were chosen before outcomes for geographic/regulatory heterogeneity while keeping the execution tractable enough to preserve full raw-row logic.

## Unit of analysis

Permit-month, restricted to months that are currently compliant on all admitted enforceable numeric DMR values. Each raw constraint is identified by permit, permitted feature, parameter, monitoring location, statistical basis, value type and standard unit.

For each constraint-month, utilization is `DMR_VALUE_STANDARD_UNITS / LIMIT_VALUE_STANDARD_UNITS`; margin is `1-utilization`. Values with lower-bound qualifiers (`>` or `>=`) are excluded. Nonpositive limits are excluded. Duplicate raw observations are collapsed conservatively by retaining the maximum utilization for the same constraint-month.

## Prospective outcome

`Y=1` if the same permit has any admitted enforceable effluent exceedance during the next 3 observed permit-months; otherwise `Y=0`. The current month itself must have no admitted exceedance. The final three observed months of each permit are excluded because the outcome is not mature.

## Conventional challenger X

X is intentionally strong. It includes current aggregate condition and ordinary recent history: maximum, 90th percentile, mean and standard deviation of utilization; counts of constraints; fractions above 0.80 and 0.90 utilization; and 1-, 2-, and 3-observation lags of the principal aggregates, plus six-observation linear slopes of maximum utilization, mean utilization and near-binding fraction. State and calendar-month indicators are included.

## Dynamic envelope instrumentation E

E is frozen as cross-constraint geometry that is not reducible to the aggregate lag vector:

- 10th and 25th percentile remaining margin;
- effective margin breadth (normalized entropy of positive margins);
- fraction of matched constraints worsening since their prior observation;
- fraction worsening by at least 0.10 utilization;
- median and maximum matched-constraint utilization change;
- dispersion of matched-constraint changes;
- fraction of constraints crossing from utilization <0.80 to >=0.80;
- fraction recovering from >=0.80 to <0.80;
- number of matched constraints supporting the transition estimate.

No outcome variable enters E.

## Models

Frozen LightGBM classifier, identical hyperparameters for X and X+E except feature set. Class weighting is not tuned after outcome exposure. Missing values are handled natively.

## Adversarial evaluations

Three independent evaluation surfaces are required:

1. **Temporal holdout:** train on all jurisdictions through 2022; test on 2023–2025 mature snapshots.
2. **Jurisdiction transfer:** train on KS+OR through 2022; test on TN 2023–2025 mature snapshots.
3. **Matched-condition residual test:** on the temporal holdout, stratify observations by deciles of the frozen X-only predicted risk and deciles of current maximum utilization. Within occupied strata, test whether the out-of-sample augmentation increment `p(X+E)-p(X)` is positively associated with realized future violation using a stratified permutation test (10,000 permutations; seed 20260822).

## Evaluability

The study is evaluable only if the temporal holdout has at least 2,000 mature currently-compliant observations and at least 100 future violations, and the TN transfer holdout has at least 500 observations and 30 future violations.

## Frozen PASS rule

PASS requires all of the following:

1. Temporal pooled Brier relative improvement >= 5%.
2. Temporal AUROC delta >= 0.
3. TN jurisdiction-transfer Brier relative improvement >= 5%.
4. TN jurisdiction-transfer AUROC delta >= 0.
5. The dynamic-envelope augmentation improves Brier in each of KS, OR and TN on 2023–2025 mature snapshots.
6. Stratified residual association is positive with permutation p < 0.01.

Any failed criterion yields FAIL. Failed evaluability yields UNEVALUABLE.

## Interpretation

A PASS would be strong evidence that evolving cross-constraint safe-envelope geometry adds prospective information beyond present condition and ordinary history in a later, geographically heterogeneous public-record realization. It would not by itself establish a universal maneuverability law. A FAIL would materially weaken this instrumentation family and should not be answered by threshold tuning or another re-expression of the same DMR variables.