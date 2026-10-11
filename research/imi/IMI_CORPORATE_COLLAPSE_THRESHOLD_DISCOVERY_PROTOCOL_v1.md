# IMI Corporate Collapse Threshold Discovery Protocol v1

Purpose: use the existing seven-step IMI constraint scale as a discovery coordinate system for systemic-collapse thresholds. This stage is discovery only; it cannot confirm a universal threshold.

Discovery cohort: Blockbuster, Borders, RadioShack, Sears Holdings. Bankruptcy dates are fixed from public Chapter 11 records. Quarterly financial facts are retrieved from SEC Companyfacts using only filings available before each bankruptcy date.

Seven decision-space availability dimensions: liquidity reserve, cash reserve, solvency buffer, equity buffer, debt burden, operating performance, operating cash-flow capacity. Each is mapped to [0,1] by fixed transforms specified in the execution script. An IMI level is the count (0–7) of observed dimensions below 0.333. At least four dimensions must be observable at a quarter for the IMI level to be admitted.

Candidate survivability threshold: among levels 1–7 meeting sample gates, choose the threshold maximizing the smoothed risk ratio for bankruptcy within four quarters for observations at-or-above versus below the threshold. Report four-quarter reversibility as the fraction of threshold-crossing observations that later fall below the threshold within the next four observed quarters.

Candidate momentum boundary: identify the IMI level with the largest mean next-quarter increase in IMI level among levels with at least three evaluable transitions.

Conventional warning comparator: current ratio < 1 OR equity/assets < 0 OR operating margin < 0. For each discovery firm, report the first IMI threshold crossing, first conventional warning, and lead time to bankruptcy.

Discovery verdicts: DISCOVERY_COMPLETE or UNEVALUABLE. No PASS claim is permitted at this stage. Any candidate threshold must be frozen and tested unchanged on a separate cohort containing failures, turnarounds/recoveries, and healthy controls before scientific promotion.
