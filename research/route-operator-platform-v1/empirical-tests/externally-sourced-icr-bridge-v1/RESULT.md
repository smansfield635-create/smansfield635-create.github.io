# Externally sourced ICR bridge v1 — result

## Terminal disposition

`BRIDGE_MIXED`

The prospective exact-head UCI bridge executed all three externally authored systems at scientific head `2c1e34a60b6270f43709e3104669558b3d6131f9`.

The frozen route-relational model beat the output-history model on `1/3` systems and remained within 5% of the unrestricted black-box model on `1/3` systems. It therefore did not satisfy the frozen survival threshold and was not uniformly redundant or inferior.

## Per-system results

### AI4I 2020 predictive maintenance

Primary metric: average precision.

- output history: `0.38602327297984906`
- route relational: `0.3666094301733127`
- black-box full: `0.711114894796124`

The route-relational representation did not beat output history and substantially trailed the black-box model.

### Hydraulic test rig

Primary metric: macro F1 for internal pump leakage.

- output history: `0.5865665169841687`
- route relational: `0.22356091030789826`
- black-box full: `0.6050106121551703`

The frozen route-relational representation performed materially worse than both comparators.

### Naval propulsion simulator

Primary metric: normalized RMSE; lower is better.

- output history: `1.7138000958868318`
- route relational: `0.7118341932938196`
- black-box full: `0.7483337941639205`

The route-relational representation materially beat output history and slightly outperformed the black-box model on the frozen primary metric. All three models had negative held-out R², so absolute temporal generalization remained poor.

## Interpretation

The externally sourced observational bridge does not support a broad claim that the frozen route-relational feature representation generally outperforms output history or unrestricted prediction. It produced one strong relative success and two failures, including one severe failure.

This result constrains the research program. The parent theory may still concern causal constitutive relations that these observational feature partitions do not identify, but this specific externally sourced predictive route is not generally successful and must not be upgraded or repaired after outcome inspection.

The exploratory externally authored software bridge remains a separate bounded result: 4/4 exact relation recovery, 24/24 held-out route-aware predictions, and 12/12 matched-output discrimination under theory-team-designed interventions. It is not independent or natural-system validation.
