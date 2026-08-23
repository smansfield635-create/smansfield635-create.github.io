# Wastewater Safe-Envelope Adversarial Protocol v2

V1 is preserved as UNEVALUABLE because the Tennessee transfer holdout had 415 observations versus the frozen 500-observation floor. V1 did not fit or expose model comparisons.

V2 is frozen before predictive outcomes. It changes only the independent transfer jurisdiction from TN to IN; all feature definitions, outcome horizon, model hyperparameters, evaluation rules, and thresholds remain identical to v1.

Source: EPA ECHO / ICIS-NPDES DMR+limit files, FY2018–FY2025. Jurisdictions: KS, OR, IN.

Temporal evaluation: train all jurisdictions through 2022; test 2023–2025 mature compliant snapshots.

Transfer evaluation: train KS+OR through 2022; test IN in 2023–2025.

Evaluability remains temporal >=2000 observations and >=100 events; transfer >=500 observations and >=30 events.

PASS still requires: temporal Brier improvement >=5%; temporal AUROC delta >=0; transfer Brier improvement >=5%; transfer AUROC delta >=0; Brier improvement separately in KS, OR, and IN; and positive stratified residual association with permutation p<0.01. Any failed criterion is FAIL. No post-outcome threshold change is permitted.