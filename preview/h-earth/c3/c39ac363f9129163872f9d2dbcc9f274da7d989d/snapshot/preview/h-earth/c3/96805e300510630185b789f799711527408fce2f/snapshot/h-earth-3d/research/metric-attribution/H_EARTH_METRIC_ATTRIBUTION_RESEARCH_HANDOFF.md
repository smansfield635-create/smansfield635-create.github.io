# H-Earth Metric Attribution Audit — Research Handoff

## Controlling disposition

```text
AUDIT = MA0_THROUGH_MA6
ACCEPTED_LIVE_PRODUCT = CP2
ROUND2_VISIBLE_ADVANCEMENT = ZERO
LIVE_STATE_CHANGED = FALSE
USER_DIFFERENTIAL_REQUIRED = FALSE

METRIC_ATTRIBUTION = MATERIAL_DOMINANT_WITH_GEOMETRY_LIGHTING_SECONDARY
PRIMARY_RESULT = MATERIAL_CAUSE_ESTABLISHED_FOR_CURRENT_METRIC
SECONDARY_RESULT = GEOMETRY_LIGHTING_INTERACTION_ESTABLISHED_FOR_CURRENT_METRIC
STRUCTURAL_GEOMETRY_CAUSE = NOT_ESTABLISHED_BY_CURRENT_METRIC
CAMERA_VISIBLE_MACRO_FORM_CAUSE = NOT_ESTABLISHED_BY_CURRENT_METRIC
HUMAN_VISIBLE_DEFECT_CAUSE = NOT_FULLY_ESTABLISHED

NEW_PRODUCT_CANDIDATE_AUTHORIZED = FALSE
LIVE_ADMISSION_AUTHORIZED = FALSE
```

The audit establishes what the existing scalar repetition metric is primarily measuring. It does not establish that the entire human-visible defect is purely material, and it does not authorize another product implementation.

## Why this audit was required

The previous Round 2 candidates changed procedural presentation, phase, control fields, a baked material map, and bounded terrain elevation. None materially improved the accepted live product. B4 then showed that the 4% and 8% morphology probes changed the measured heightfield repetition by only `0.0107%` and `0.0321%`, while final-frame response remained effectively zero and slightly negative.

That sequence left one unresolved question: which visible information source actually reproduces the final-frame repetition score?

The audit answered that question using the accepted CP2 environment without rebuilding the world, modifying a product source, or requiring user action.

## Frozen audit basis

The audit reused the exact accepted CP2 renderer, Run 8B terrain, canonical render package, GPU upload views, navigation authority, permanent eight scenes, cameras, viewport, metric bands, orientation grid, and lag grid.

```text
VIEWPORT = 960_BY_540
NORMALIZED_ANALYSIS = 256_BY_256
GAUSSIAN_BANDS = 2_8_24_PIXELS
ORIENTATIONS = 0_22.5_45_67.5_90_112.5_135_157.5_DEGREES
LAGS = 4_8_12_16_24_32_48_64_PIXELS
ACCEPTED_CP2_AGGREGATE_SCORE = 0.8081230868576569
```

MA1 reproduced that score exactly across all eight deterministic scenes.

## Diagnostic passes

| Pass | Isolated information |
|---|---|
| A | Heightfield as grayscale elevation |
| B | Slope magnitude |
| C | Surface-normal components |
| D | Projected depth |
| E | Silhouette and major geometric edges |
| F | Constant material with accepted lighting |
| G | Accepted CP2 material with flat lighting |
| H | Exact accepted CP2 final frame |

MA2 verified that all eight diagnostic passes were deterministic, A–G were distinct from H, and diagnostic H reproduced the official accepted renderer's color and depth exactly. MA3 and MA4 then produced 64 fixed outputs across the permanent eight-scene suite.

## Mechanical match gate

A diagnostic pass qualifies as reproducing H only when all of the following pass:

```text
EXACT_BAND_ORIENTATION_LAG_FRACTION >= 0.75
MEAN_BAND_GRID_PEARSON >= 0.75
SCENE_SCORE_PEARSON >= 0.75
MEAN_PEAK_STRENGTH_RATIO >= 0.85
DOMINANT_SCENE_EXACT_MATCH_FRACTION >= 0.75
AGGREGATE_SCORE_RATIO >= 0.90
```

The primary pass is the qualifying pass with the highest correspondence composite.

## Correspondence result

| Rank | Pass | Composite | Exact band matches | Grid Pearson | Scene-score Pearson | Aggregate ratio | Gate |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | G — accepted material, flat lighting | 0.951688 | 23/24 | 0.979521 | 0.992369 | 0.994535 | PASS |
| 2 | F — constant material, accepted lighting | 0.856769 | 17/24 | 0.806672 | 0.801229 | 0.903744 | FAIL — 17/24 = 0.7083 < 0.75 |
| 3 | C — surface normals | 0.818452 | 18/24 | 0.782356 | 0.954252 | 0.917117 | PASS |
| 4 | A — elevation | 0.746460 | 16/24 | 0.723533 | 0.086046 | 0.876109 | FAIL |
| 5 | E — silhouette and edges | 0.710858 | 18/24 | 0.690371 | 0.223227 | 0.891274 | FAIL |
| 6 | B — slope magnitude | 0.683853 | 18/24 | 0.713430 | -0.043138 | 0.887954 | FAIL |
| 7 | D — depth | 0.652307 | 16/24 | 0.689473 | -0.136190 | 0.878935 | FAIL |

Pass G reproduced H's dominant orientation and lag in 7 of 8 scenes and in 23 of 24 scene-band comparisons. Its aggregate repetition score was within approximately `0.55%` of H even after directional lighting, rim, specular, fog, and atmospheric haze were removed.

Pass C passed and establishes secondary geometry-lighting sensitivity through surface normals. Pass F was strong across grid, scene-score, peak-strength, dominant-scene, and aggregate terms, but it did not qualify because `17/24 = 0.7083` is below the frozen `0.75` exact-band threshold. Elevation, slope, depth, and silhouette did not pass the complete gate.

## What is established

```text
FACT_1 = THE_CURRENT_SCALAR_REPETITION_SCORE_IS_PRIMARILY_REPRODUCED_BY_THE_ACCEPTED_CP2_SPATIAL_MATERIAL_FIELD

FACT_2 = SURFACE_NORMALS_ESTABLISH_SECONDARY_GEOMETRY_LIGHTING_SENSITIVITY

FACT_2A = CONSTANT_MATERIAL_WITH_ACCEPTED_LIGHTING_WAS_STRONG_BUT_DID_NOT_PASS_THE_FROZEN_EXACT_BAND_GATE

FACT_3 = ELEVATION_SLOPE_DEPTH_AND_MAJOR_EDGES_DO_NOT_PASS_THE_FULL_CORRESPONDENCE_GATE

FACT_4 = THE_BOUNDED_MORPHOLOGY_PROGRAM_TARGETED_A_VARIABLE_THAT_THE_CURRENT_FINAL_FRAME_METRIC_DOES_NOT_PRIMARILY_MEASURE
```

This explains why moving thousands of terrain Y values produced essentially no change in the final-frame repetition score: the score is dominated by a material signature that those probes preserved.

## What is not established

```text
NOT_ESTABLISHED_1 = THE_HUMAN_VISIBLE_REPETITION_COMPLAINT_IS_PURELY_MATERIAL
NOT_ESTABLISHED_2 = THE_ACCEPTED_CP2_MATERIAL_SHOULD_BE_REMOVED_WHOLESALE
NOT_ESTABLISHED_3 = ANOTHER_SHADER_OR_MAP_WILL_IMPROVE_THE_LIVE_PRODUCT
NOT_ESTABLISHED_4 = THE_TARGET_IS_INFEASIBLE
```

The current metric is now causally interpretable, but it is not sufficient as the sole product objective. It strongly detects the accepted CP2 material pattern, including useful Manor, Cavern, contact, contour, slope, and terrain-readability cues. Before altering the product, research must separate the unwanted repeated signal from those accepted cues.

## Exact next research operation

```text
OPERATION = H_EARTH_ACCEPTED_CP2_MATERIAL_SUBSIGNAL_ATTRIBUTION_RESEARCH_v1
CLASS = DIAGNOSTIC_ONLY_NO_PRODUCT_MUTATION
REFERENCE_PASSES = G_AND_H
```

Primary question:

```text
WHICH_ACCEPTED_CP2_MATERIAL_SUBSIGNALS_GENERATE_THE_MATCHED_REPETITION_SIGNATURE
WITHOUT_CARRYING_THE_USEFUL_MANOR_CAVERN_AND_TERRAIN_READABILITY_CUES
```

### RMA0 — Freeze material-family authority

Freeze pass G, pass H, the eight scenes, and this family registry:

1. Broad, medium, grain, macro, meso, and detail fields.
2. Strata, cross-grain, and face-band signals.
3. Crest, terrace, and contact signals.
4. Contour and slope-rake signals.
5. Manor-local material and contact cues.
6. Cavern-local material and contact cues.
7. Base-color and role blending.

Stop after the family-registry receipt.

### RMA1 — One-family diagnostic ablations

Disable or neutralize exactly one material family per diagnostic pass while preserving geometry, cameras, lighting, viewport, scenes, and metric parameters. These are diagnostic renders only; no accepted renderer or live source changes.

Stop after the complete ablation matrix.

### RMA2 — Subsignal causal classification

Identify which family or bounded combination carries the matched orientation, lag, grid correspondence, and peak strength observed between G and H.

Stop after a mechanical subsignal classification. Do not build a product candidate.

### RMA3 — Useful-cue retention

Verify whether removing the identified repeated subsignal preserves:

- Manor-site differentiation and contact cues.
- Cavern exterior relation and threshold cues.
- Terrain scale, slope, and route readability.
- The permanent regression scenes.

Stop with a research disposition. Product implementation remains unauthorized until this retention question is resolved.

## Research-room instruction

```text
ACCEPT_THIS_PACKET_AS_THE_CONTROLLING_METRIC_ATTRIBUTION_HANDOFF.

DO_NOT_AUTHORIZE_ANOTHER_PRESENTATION_OR_TERRAIN_CANDIDATE.

BEGIN_ONLY_THE_BOUNDED_RMA0_THROUGH_RMA3_DIAGNOSTIC_MATERIAL_SUBSIGNAL_ATTRIBUTION_SEQUENCE.

RETURN_WITH_A_SUBSIGNAL_CAUSAL_AND_USEFUL_CUE_RETENTION_DISPOSITION_BEFORE_ANY_PRODUCT_IMPLEMENTATION.
```

## Durable evidence ledger

| Checkpoint | Merge | Workflow / job | Canonical receipt | Artifact / SHA-256 |
|---|---|---|---|---|
| MA0 | `6cf0b743bad7c70aa20937485cbe968777db159e` | `30562267369 / 90938012385` | `00f54a4cf4696996745cde6f3faf6926f4283439b27dfeaa0855b91c445286da` | `8767361371 / 9ab7cb95de23420320029aaad7ea578c482761ed210716a97f575528082fc4bf` |
| MA1 | `b78cf4b878a116c7fe4005c680df8dc01869e6ee` | `30563938676 / 90943626721` | `45cf157eff7b6d7a967d43c1f5a5a89111e86d1153173bf614528e1e912afeab` | `8768048581 / fd98a6fe4e7fabe11329a9b7de80aa708b8d55a857a50e486abb7d96918c5e73` |
| MA2 | `1f3c5b5b1333a39495c1aabde427b8e95ff89c92` | `30564640690 / 90945981245` | `9351a5ba3d53f9f0635b5f56b23517cdaef5d3ab76052370637843d601e18307` | `8768334586 / 231b0cc64238b3ce6d32e198315afc277b478f513a743324eed86f0163c88304` |
| MA3 | `e4dbc19f5eabfdc8584edbf23977e5bb05c405d3` | `30565119792 / 90947594738` | `e85c7cdcc9ea3b22686b63542ef43b25c3b546614ff0fe5c4f706755d1630ba6` | `8768511411 / 5e9d8f04c2bccaaa3dc103dc696bcf0c4f610c9079a34e93a54663e769e1d094` |
| MA4 | `ad151f7ba98c0d16badf3ba0183ed3e21b516559` | `30565504244 / 90948893637` | `2ad7f10e86a3e8bdd1e9e06c415daa55da870b9f977155b247da8907fe4bc958` | `8768674259 / 7cdf75ae0d85eddcdc4633a6d8a344e4ee7097bd3d78bf0a9dbd8e0bc59398ad` |
| MA5 | `30750006bce953c002f47d89f314faca83b224f1` | `30567031631 / 90954013381` | `7c4913af311c77ba4121c31c2c29f86b265bae76bc6bf11e783360bdfdf959cc` | `8769245958 / 1358f3ea4b9a5668134ace5a77c809f52496a4eb2eb048a132b4c43de4e9fdee` |

MA5 canonical matrix SHA-256: `9463cf860a13cdbd38f3f5f7f24b27b15b958ecf1d3a3324557906fe8f940811`

MA6's execution run, canonical closure receipt, artifact, and final merge accompany this document in the merged pull request and should be retained with it. They are excluded from the document body to avoid a self-referential digest.

Canonical machine-readable packet:

`h-earth-3d/research/metric-attribution/H_EARTH_METRIC_ATTRIBUTION_RESEARCH_PACKET.v1.json`
