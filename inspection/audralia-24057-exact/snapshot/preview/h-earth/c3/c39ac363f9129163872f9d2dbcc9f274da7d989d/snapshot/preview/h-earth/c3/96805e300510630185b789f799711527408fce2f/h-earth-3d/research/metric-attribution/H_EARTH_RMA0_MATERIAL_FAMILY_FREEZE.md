# H-Earth RMA0 Material-Family Freeze

```text
OPERATION = H_EARTH_ACCEPTED_CP2_MATERIAL_SUBSIGNAL_ATTRIBUTION_RESEARCH_v1
CHECKPOINT = RMA0
CLASS = DIAGNOSTIC_ONLY_NO_PRODUCT_MUTATION
REFERENCE_PASSES = G_ACCEPTED_MATERIAL_WITH_FLAT_LIGHTING, H_ACCEPTED_CP2_FINAL_FRAME
```

RMA0 freezes the accepted CP2 audit basis and the seven material families that may be neutralized one at a time in RMA1:

1. `BROAD_MEDIUM_GRAIN_MACRO_MESO_DETAIL_FIELDS`
2. `STRATA_CROSS_GRAIN_FACE_BANDS`
3. `CREST_TERRACE_CONTACT_SIGNALS`
4. `CONTOUR_AND_SLOPE_RAKE`
5. `MANOR_LOCAL_MATERIAL_AND_CONTACT_CUES`
6. `CAVERN_LOCAL_MATERIAL_AND_CONTACT_CUES`
7. `BASE_COLOR_AND_ROLE_BLEND`

The exact eight scenes, cameras, viewport, analysis size, Gaussian bands, orientation grid, lag grid, accepted renderer, terrain, render package, GPU views, navigation authority, diagnostic renderer utility, directional metric utility, MA6 packet, and MA6 handoff remain frozen.

RMA1 may create diagnostic fragment shaders in validation sources only. It may not mutate the accepted renderer or any product, terrain, material, lighting, camera, navigation, live-host, live-binding, or public-route source.

The frozen single-family causal gate requires all terms:

```text
AGGREGATE_REPETITION_REDUCTION >= 0.06
MEAN_BAND_GRID_PEARSON_DROP_FROM_G >= 0.08
EXACT_BAND_MATCH_DROP_FROM_G >= 3
SCENE_SCORE_REDUCTION_COUNT >= 5_OF_8
CAUSAL_IMPACT_COMPOSITE >= 0.08
```

When no single family passes, RMA2 may execute exactly one diagnostic combination containing only the top two single-family effects. A third family, parameter tuning, a product candidate, or a live candidate is prohibited.

RMA3 will classify one of three outcomes: removable culprit, signal separation required, or perceptual comparison required.
