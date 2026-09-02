# IMI v3 — Post-2020 Independent Temporal Maneuverability Replication — Findings v1

**Status:** VALID EXECUTION — UNEVALUABLE PRIMARY COMPARISON

## Purpose
Execute the frozen new-temporal-cohort boundary for admissible identity-preserving maneuverability using an independently sourced 2019–2023 FFIEC Call Report reconstruction, the unchanged six-feature admissible-transition geometry, the fixed 103-feature conventional state/history challenger, an 8-quarter failure horizon, and the frozen joint success rule.

## Frozen success rule
A PASS required all three: (1) at least 5% pooled relative Brier improvement, (2) Brier wins in more than half of valid held-out years, and (3) AUROC delta >= -0.002.

## Source and execution
The independent FFIEC reconstruction produced 97,242 bank-quarter rows after core source QC. The six maneuverability geometry features were complete for 91,948 rows. The fixed challenger contained exactly 103 conventional state/history features. The held-out post-2020 cohorts were 2022 and 2023.

The source-specific implementation required three non-scientific repairs: canonical mapping of FFIEC metadata labels (`Reporting Period End Date`, `IDRSSD`, `FDIC Certificate Number`); mapping the export's Schedule RC B529 net-loan balance to the already-frozen net-loan concept because 2122 was absent from this subset; and direct use of the frozen embedded FDIC 2020–2025 failure-record fallback after the current BankFind HTML route resolved to a retired 404 API path. No geometry law, model class, horizon, success threshold, outcome definition, or model feature family was changed in response to performance.

## Result
The final workflow execution completed successfully at the infrastructure level and emitted the frozen result artifacts.

2022 held-out cohort: 18,656 evaluable test observations, 20 eight-quarter failures, but 0 leakage-purged mature training observations.

2023 held-out cohort: 18,157 evaluable test observations, 19 eight-quarter failures, but 0 leakage-purged mature training observations.

Because the independent source begins in 2019 while the challenger requires up to eight quarters of institution history and the training labels require an additional eight-quarter maturity window before each held-out year, no training observation can simultaneously satisfy the frozen history and outcome-maturity requirements for the 2022 or 2023 evaluations.

Therefore no model was fit and no Brier, AUROC, average-precision, or annual-win comparison exists for this realization.

## Primary verdict

**UNEVALUABLE.**

This result is neither PASS nor FAIL. It does not strengthen or weaken the substantive maneuverability signal. It establishes that the 2019–2023 independent FFIEC mirror is temporally too shallow to execute the frozen 103-feature / 8-quarter prospective comparison without importing an earlier training history.

## Scientific disposition
The prior evidence record remains unchanged:

- matched-output prospective divergence: supported;
- transition-geometry increment over current state: supported in predecessor realization;
- increment over strong conventional history: modest/mixed;
- disjoint-institution replication: failed the frozen joint criterion;
- post-2020 independent temporal replication: unevaluable because the independent source lacks sufficient pre-evaluation history for leakage-purged training;
- breakthrough-level distinct maneuverability construct: not established.

## Next lawful boundary
Do not tune this post-2020 realization or weaken its maturity/history rules. A decisive temporal replication now requires a source that supplies enough pre-2020 institution history to train the frozen 103-feature challenger while reserving 2022–2023 outcomes as untouched evaluation data, or an equivalently independent repeated-unit dataset with the same abstract transition-field law and sufficient temporal depth.

## Execution receipt
Workflow run: `32609729409`
Artifact: `imi-post2020-final-replication-v1`
Artifact ID: `9485166525`
Artifact SHA-256 digest: `5634a6d2ea7c4cbc964652e01057cf5d81af541d6df4ede4637b274b7b47132b`
Head commit: `602fba91fcfeb7198c86a59dc5b5773195c0247b`
