# IMI Viable Decision-Space Test v1

## Status
Frozen before execution. This study follows the failed confirmation of the integer IMI 3→4 threshold law. It does not modify or erase that failure.

## Scientific question
Does a continuous proxy for remaining viable decision space discriminate impending corporate collapse and reversibility better than the integer count of constrained dimensions?

## Measurement law
Use the same seven pre-existing availability dimensions and transformations used in the corporate threshold studies: liquidity, cash reserve, solvency, equity buffer, debt capacity, operating performance, and operating cash-flow capacity. Each availability remains bounded in [0,1]. No transformation is outcome-fit.

For an observation with n available dimensions a_i:

- capacity_mass = mean(a_i)
- effective_routes = (sum a_i)^2 / sum(a_i^2), the inverse-Simpson effective number of available routes
- route_diversity = effective_routes / n
- VDS = capacity_mass * route_diversity

VDS therefore falls when either total capacity is depleted or viable capacity becomes concentrated into fewer effective routes. This is a proxy for viable decision-space volume, not a literal enumeration of management choices.

Dynamics are frozen as:
- contraction_t = VDS_{t-1} - VDS_t (positive = narrowing)
- acceleration_t = contraction_t - contraction_{t-1}
- dynamic_risk = (1 - VDS) + max(contraction,0) + 0.5*max(acceleration,0)

The legacy comparator is the unchanged integer IMI level: number of availability dimensions below 1/3.

## Stage 1: calibration only
Use only the prior discovery cohort: J.C. Penney, Pier 1 Imports, RadioShack, Sears Holdings. Calibrate a single VDS survivability cutoff by scanning observed VDS deciles and selecting the cutoff maximizing smoothed four-quarter collapse risk ratio, subject to at least 8 observations on each side. This cohort cannot confirm the hypothesis.

## Stage 2: untouched confirmation cohort
Failures:
- Tailored Brands — Chapter 11 2020-08-02
- Ascena Retail Group — Chapter 11 2020-07-23
- Stein Mart — Chapter 11 2020-08-12

Survivor/stress cases:
- Macy's
- Kohl's
- Nordstrom

Healthy controls:
- Target
- Lowe's
- TJX Companies

No company in this confirmation cohort was used in the prior corporate threshold discovery or confirmation cohorts.

## Outcomes
For failure companies, primary prospective outcome is collapse within 4.5 quarters. Nonfailure observations are coded zero through 2025-12-31.

## Acceptance criteria
All must pass for `VDS_CONFIRMED`.

A. Calibration yields an evaluable VDS cutoff and at least three confirmation failures, two survivor/stress cases, and two healthy controls each have >=12 usable quarters.

B. Failure reachability: every evaluable failure crosses below the frozen VDS cutoff before bankruptcy, and at least two failures cross within 8.5 quarters of bankruptcy.

C. Healthy specificity: pooled healthy-control prevalence below the cutoff is <=10%, with no healthy company having two consecutive quarters below the cutoff.

D. Reversibility: at least two survivor/stress companies either never cross below the cutoff or, after crossing, return above it within four observed quarters.

E. Decision-space discrimination: on the untouched confirmation panel, AUROC of continuous risk 1-VDS for four-quarter collapse must exceed AUROC of integer IMI level by at least 0.03.

F. Dynamic utility: AUROC of dynamic_risk must exceed static VDS risk by at least 0.02 and integer IMI by at least 0.05.

G. Threshold severity: four-quarter collapse probability below the frozen VDS cutoff must be at least 3x the probability above it and at least 0.10 higher in absolute terms.

## Verdict
- `VDS_CONFIRMED`: A–G all pass.
- `FAIL`: evaluable but any required criterion fails.
- `UNEVALUABLE`: minimum cohort/data conditions fail.

No threshold, formula, cohort, cutoff, or criterion may be changed after confirmation data are opened.