# Prospective UCI data bridge protocol

## External systems

1. AI4I 2020 Predictive Maintenance, UCI dataset 601.
2. Condition monitoring of hydraulic systems, UCI dataset 447.
3. Condition-based maintenance of naval propulsion plants, UCI dataset 316.

The exact-head workflow obtains the data through the UCI repository after this protocol and code are frozen.

## Model families

### Output-history model

Uses a restricted set of visible operating or output variables.

### Route-relational model

Uses internal measurements and deterministic relational transforms such as temperature gaps, load interactions, pressure spans, temperature spans, differences, and ratios.

### Black-box full model

Uses the full admitted feature field through a random forest. It serves as a strong unrestricted predictive comparator, not an identity model.

## Split

The first 70% of each dataset in source order is training evidence. The final 30% is held out. There is no shuffling.

## Primary metrics

- AI4I: average precision for machine failure.
- Hydraulic rig: macro F1 for pump leakage condition.
- Naval propulsion: normalized RMSE for the first decay coefficient; lower is better.

## Terminal bridge dispositions

- `BRIDGE_SURVIVES_EXTERNAL_DATA_TEST`
- `BRIDGE_REDUNDANT_OR_INFERIOR`
- `BRIDGE_MIXED`
- `UNEVALUABLE_DATA_OR_EXECUTION_FAILURE`

No threshold or model-family change is permitted after the first successful external data retrieval.
