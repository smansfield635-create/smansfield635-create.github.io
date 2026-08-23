# IMI Multivariate Trajectory Test v1

## Status
Frozen successor boundary after three binding negative results: integer threshold, continuous VDS threshold, and route-entrenchment threshold. None are modified or erased.

## Scientific question
Does ordered multivariate history across the seven existing availability dimensions predict near-term collapse better than the same current state observed without history?

## Design law
This is a prospective company-level confirmation test. The training/calibration set contains only companies already opened in prior IMI corporate studies. The confirmation companies are new to those studies.

The seven availability dimensions and their transformations are unchanged: liquidity, cash reserve, solvency, equity buffer, debt capacity, operating performance, and operating cash-flow capacity.

For each usable quarter, construct a four-observation trajectory ending at the current quarter.

State-only model inputs:
- seven current availability values;
- seven current missingness indicators.

Sequence model inputs:
- the same current-state inputs;
- availability values and missingness indicators from each of the prior three observed quarters;
- quarter-to-quarter signed changes for all seven dimensions across the three transitions;
- path length across the three transitions;
- directional persistence = norm(net displacement) / total path length.

Missing availability values are imputed only from training-set medians. Scaling parameters are fit only on the training set. Both models use the same frozen logistic-regression procedure with balanced class weights and C=1.0.

Outcome: collapse within 4.5 quarters. Known failure firms are labeled prospectively before their terminal event; nonfailure observations are zero through 2025-12-31.

## Training/calibration cohort
Previously opened companies only.

Failures: J.C. Penney, Pier 1 Imports, RadioShack, Sears Holdings, Tailored Brands, Ascena Retail Group, Stein Mart, Bed Bath & Beyond, Party City Holdco, Tuesday Morning.

Nonfailures: Macy's, Kohl's, Nordstrom, Target, Lowe's, TJX Companies, Gap, Best Buy, Dick's Sporting Goods, Walmart, Home Depot, Costco.

A sequence alert threshold is calibrated from training predictions as the lowest score achieving at least 90% specificity with nonzero sensitivity. Confirmation data cannot alter it.

## Untouched confirmation cohort
Failures:
- Big Lots — Chapter 11 2024-09-09
- Rite Aid — Chapter 11 2023-10-15
- Revlon — Chapter 11 2022-06-15

Survivor/stress:
- Abercrombie & Fitch
- Foot Locker
- Ross Stores

Healthy controls:
- Kroger
- AutoZone
- Tractor Supply

## Acceptance criteria
All must pass for `TRAJECTORY_CONFIRMED`.

A. Evaluable: at least three failure, two survivor, and two healthy confirmation companies each provide >=12 usable trajectory observations, with both outcome classes represented.

B. Incremental AUROC: sequence AUROC exceeds state-only AUROC by at least 0.05.

C. Incremental average precision: sequence average precision exceeds state-only average precision by at least 0.05.

D. Failure localization: all evaluable failures alert before bankruptcy and at least two alert within 8.5 quarters before bankruptcy.

E. Healthy specificity: pooled healthy alert prevalence <=10%, and no healthy company has two consecutive alert quarters.

F. Survivor distinction: at least two survivor/stress firms either never alert or return below threshold within four observed quarters after first alert.

G. History ablation: independently permuting the three historical observations inside each confirmation trajectory, while preserving current state, across 100 deterministic permutations must reduce mean AUROC by at least 0.03 versus intact sequence AUROC.

## Verdict
- `TRAJECTORY_CONFIRMED`: A-G all pass.
- `FAIL`: evaluable but any required criterion fails.
- `UNEVALUABLE`: minimum data/class conditions fail.

No cohort, feature, model, threshold, coefficient, seed, or criterion may be changed after confirmation execution begins.
