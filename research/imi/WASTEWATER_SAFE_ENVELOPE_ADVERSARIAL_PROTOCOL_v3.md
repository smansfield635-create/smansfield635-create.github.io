# Wastewater Safe-Envelope Adversarial Protocol v3

V1 (TN transfer) and v2 (IN transfer) remain UNEVALUABLE because their independent transfer holdouts did not reach the unchanged 500-observation floor. Neither run fit or exposed predictive model comparisons.

V3 is frozen before predictive outcomes. It preserves every v1/v2 feature, outcome, model, threshold, and evaluability rule. The only change is the independent transfer jurisdiction: Texas (TX), selected for a substantially larger EPA ICIS-NPDES DMR population.

Source remains EPA ECHO / ICIS-NPDES DMR+limit files, FY2018–FY2025. Jurisdictions are KS, OR, TX. Temporal evaluation trains all three through 2022 and tests 2023–2025. Transfer evaluation trains KS+OR through 2022 and tests TX in 2023–2025.

Evaluability remains temporal >=2000 observations with >=100 future events and transfer >=500 observations with >=30 future events.

PASS is unchanged: temporal Brier improvement >=5%; temporal AUROC delta >=0; transfer Brier improvement >=5%; transfer AUROC delta >=0; Brier improves separately in KS, OR, and TX; and the stratified residual association is positive with permutation p<0.01. Any failed criterion is FAIL. No post-outcome threshold change is allowed.