# IMI Corporate Collapse Threshold Confirmation Protocol v1

## Purpose
Confirm or reject the discovery-only IMI collapse-threshold architecture on an untouched cohort. No threshold, mapping, criterion, company, or outcome may be changed after execution begins.

## Frozen discovery thresholds
- Momentum boundary: **T_M = IMI 3**.
- Survivability/collapse boundary: **T_S = IMI 4**.
- IMI remains the count (0-7) of materially constrained dimensions using the exact discovery mapping and one-third availability cutoff.

## Untouched confirmation cohort
Failures: Bed Bath & Beyond (CIK 886158; Chapter 11 2023-04-23), Party City Holdco (CIK 1592057; Chapter 11 2023-01-17).

Turnaround/survivor stress cases: Best Buy (CIK 764478), Abercrombie & Fitch (CIK 1018840), Gap (CIK 39911).

Healthy controls: Walmart (CIK 104169), Costco (CIK 909832), Home Depot (CIK 354950).

Failure companies are censored at their bankruptcy dates. Non-failure companies are evaluated across all available 10-Q/10-K Companyfacts observations through 2025-12-31.

## Frozen seven dimensions
Liquidity reserve, cash reserve, solvency buffer, equity buffer, debt burden, operating performance, operating cash-flow capacity. Formulas and transforms are byte-for-byte equivalent in meaning to discovery v1.

## Primary confirmation criteria
A. **Failure ordering:** both evaluable failure companies must cross T_M before or no later than T_S, and at least one must reach T_S within eight observed quarters before bankruptcy.

B. **T_S specificity:** across healthy controls, no company may show persistent T_S (IMI >=4 for two consecutive observed quarters), and pooled healthy-control quarter prevalence at T_S must be <=10%.

C. **Turnaround reversibility:** at least two of three evaluable turnaround/survivor cases must either never reach T_S or, after reaching it, return below T_S within four observed quarters.

D. **Momentum utility:** among all nonterminal observations at T_M or above, the dynamic warning (IMI >=3 AND velocity>0 OR acceleration>0) must have a higher probability of reaching T_S within four observed quarters than static IMI>=3 alone, with an absolute improvement >=5 percentage points.

E. **Monotonic severity:** pooled four-quarter terminal-event rate in the failure cohort must not decrease across frozen thresholds IMI>=1, >=2, >=3, >=4.

## Secondary endpoints
- First crossing dates and months-to-bankruptcy for T_M, T_S, and the frozen conventional warning comparator.
- T_S four-quarter reversibility by cohort.
- Decision-space change before and after threshold crossings.
- False-alarm burden in controls.

## Verdict
`CONFIRMED` only if A-E all pass.
`FAIL` if evaluable and any criterion fails.
`UNEVALUABLE` if fewer than 2 failures, 2 turnaround/survivors, or 2 healthy controls have at least 12 usable quarters.

This confirmation cannot modify the discovery thresholds. A failure is binding evidence against the present threshold architecture.