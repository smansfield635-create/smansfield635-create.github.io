# H-Earth RMA1 Single-Family Ablation Matrix

```text
OPERATION = H_EARTH_ACCEPTED_CP2_MATERIAL_SUBSIGNAL_ATTRIBUTION_RESEARCH_v1
CHECKPOINT = RMA1
CLASS = DIAGNOSTIC_ONLY_NO_PRODUCT_MUTATION
REFERENCE_PASSES = G, H
ABLATED_FAMILIES = 7
SCENES = 8
OUTPUTS = 72
```

RMA1 neutralizes exactly one frozen CP2 material family per diagnostic pass. Geometry, normals, cameras, lighting authority, scenes, viewport, analysis resolution, Gaussian bands, orientation grid, lag grid, accepted renderer, and product sources remain unchanged.

The seven family passes are compared with pass G and pass H using:

- Aggregate repetition score.
- Per-scene repetition scores.
- Micro, meso, and macro dominant orientation and lag.
- Full orientation/lag-grid Pearson correspondence.
- Peak-strength correspondence.
- Dominant-scene correspondence.
- Deterministic frame and depth identities.

RMA1 records whether each family satisfies the RMA0 single-family causal gate, but it does not authorize a product candidate or make the final RMA2 causal disposition. If no single family passes, RMA2 may execute exactly one combination containing only the two highest-impact single families.

The complete numerical matrix, screenshots, receipt, and ranked family keys are supplied by the RMA1 workflow artifact and pull-request closure evidence.
