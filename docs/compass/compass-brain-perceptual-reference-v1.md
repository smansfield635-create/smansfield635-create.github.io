# Compass Brain Perceptual Reference V1

Identity: `COMPASS_BRAIN_PERCEPTUAL_REFERENCE_V1`
Status: FROZEN PROJECTION-SPACE REFERENCE BOUNDARY
Successor line: `ANATOMICAL_BASIS_GEN1`

## 1. Purpose

This contract ends the use of construction-recipe compliance as a proxy for anatomical fidelity. It defines what the supplied Compass Brain comparison image is allowed to govern, what it cannot govern, and the noncompensating qualification order for every successor candidate.

The governing distinction is:

- the anatomical 3D dataset constrains hidden three-dimensional form;
- this reference image constrains visible projection morphology and appearance;
- the independent evaluator determines admissibility.

The reference image is therefore authoritative in image space and explicitly non-authoritative for unseen 3D geometry.

## 2. Source identity

Source: owner-supplied `COMPASS BRAIN COMPARISON — INCUMBENT (LIVE) vs BRAIN V9 SUCCESSOR (ISOLATED)` image.

- raster dimensions: 1536 × 1024 pixels;
- SHA-256: `338b5811efd421d0945afbc36934ed0ab7f2e6f62163fb13c27367090409c18b`;
- authority is limited to the right-hand successor brain depictions;
- annotations and textual claims in the image are not anatomical evidence.

Any future extraction presented as V1 evidence must bind to this exact source digest.

## 3. Authority classes

### A1 — directly measurable projection geometry

Binding after extraction/freeze:

- binary silhouette mask;
- normalized bounding box;
- projected width:height ratio;
- normalized centroid;
- occupied-area fraction;
- extreme points;
- hemisphere-envelope limits where observable;
- visible cerebellum and brainstem envelope;
- fixed crop and framing.

### A2 — bounded perceptual morphology and appearance

Binding only as tolerance-banded descriptors:

- temporal descent;
- cerebellar nesting;
- fissure prominence;
- frontal and occipital curvature profiles;
- projected cortical density;
- fold-frequency bands and orientation distribution;
- apparent sulcal depth;
- cerebellar foliation;
- highlight width;
- shadow-field distribution;
- local surface-curvature character;
- broad material response.

### A3 — nonbinding generated-image detail

The following cannot qualify anatomy:

- exact individual gyrus trajectories;
- tiny local shadow boundaries;
- ambiguous anatomical edges;
- generated details that cannot be separated reliably from image-generation artifacts;
- any text annotation claiming anatomical accuracy.

## 4. Frozen first-pass panel measurements

The four right-hand depictions are independent projection fixtures. They are not assumed to be calibrated renders from one known camera rig.

| Fixture | Projected W:H | Normalized centroid | Authority role |
| --- | ---: | --- | --- |
| Primary lateral | 1.242 | (0.501, 0.387) | A1 primary morphology |
| Superior/top | 0.890 | (0.499, 0.499) | independently normalized cross-view constraint |
| Posterior/rear | 1.115 | (0.470, 0.461) | independently normalized cross-view constraint |
| Oblique | 1.458 | (0.518, 0.468) | independently normalized cross-view constraint |

Primary lateral first-pass envelope:

- isolated silhouette: approximately 421 × 339 pixels;
- normalized bounding box: approximately `x=[0.075,0.883]`, `y=[0.066,0.955]` within its local crop;
- role: `I_primary`, the highest-authority projection-morphology fixture.

These values are frozen as the owner-approved first-pass extraction. Higher-resolution or algorithmically refined measurements may narrow their uncertainty only through a versioned successor reference; they may not silently overwrite V1.

## 5. Multi-view consistency law

The panels are visually coherent but are not presumed to be exact projections of one guaranteed hidden mesh. Therefore:

1. each panel is normalized independently;
2. no candidate is required to achieve pixel-perfect cross-panel correspondence;
3. the primary lateral fixture carries the strongest projection authority;
4. top, rear and oblique fixtures constrain compatible morphology within explicit tolerance bands;
5. where a generated projection conflicts with validated human anatomy, anatomy outranks the image.

## 6. Immutable fixture split

### `MORPHOLOGY_FIXTURE`

Contains only geometry-in-projection evidence:

- masks;
- normalized landmarks;
- contour samples;
- projected ratios;
- component relationships;
- curvature samples;
- fold-scale descriptors.

### `APPEARANCE_FIXTURE`

Contains rendering/test-fixture evidence:

- camera model and projection class;
- crop;
- target center and object occupancy;
- background luminance;
- dominant key-light direction;
- key/fill relationship;
- environment/ambient contribution;
- highlight envelope;
- shadow softness;
- exposure/tone response;
- material roughness/specular bands.

An appearance failure may not be repaired by deforming qualified anatomy.

## 7. Camera and lighting law

For qualification, camera, projection, framing and lighting are test-fixture variables, not candidate optimization variables.

Once the fixture is frozen for a given view, a candidate may not move the camera, change FOV, alter crop, relight, re-expose or change tone response to improve morphology scores.

## 8. Noncompensating qualification

For each required view `v`, let the reference descriptor be:

`R_v = {M_v, L_v, R_v, C_v, F_v, H_v}`

where:

- `M`: silhouette;
- `L`: landmarks;
- `R`: structural ratios;
- `C`: contour/curvature;
- `F`: fold-frequency/surface character;
- `H`: lighting/shading/material appearance.

Qualification is conjunctive, not a weighted composite:

`PASS = Q_S>=tau_S AND Q_L>=tau_L AND Q_R>=tau_R AND Q_C>=tau_C AND Q_F>=tau_F AND Q_H>=tau_H`

Critical A1 failures are terminal. Later categories cannot rescue an earlier failure.

Examples:

- lighting cannot rescue a wrong silhouette;
- cortical detail cannot rescue an incorrect temporal or occipital envelope;
- a plausible cerebrum cannot rescue a misplaced cerebellum or brainstem;
- camera changes cannot rescue anatomical mismatch.

## 9. Qualification hierarchy

The successor line is governed by:

- `G0`: gross anatomical identity;
- `G1`: regional anatomical relationships;
- `G2`: major fissure/fold organization;
- `G3`: surface correspondence;
- `G4`: native runtime/package integrity;
- `G5`: Diamond Gate expression.

`G(n+1)` cannot compensate for failure of `G(n)`.

`G0` and `G1` must pass before any Diamond Gate styling or expressive deformation is admissible.

## 10. Required next extraction record

Before the first `ANATOMICAL_BASIS_GEN1` mesh is authored, the V1 morphology fixture must receive version-bound measurements for:

- cerebral anterior/posterior/superior/inferior extrema;
- temporal-pole position;
- cerebellar bounding box and centroid;
- cerebellar/cerebral projected overlap and posterior-inferior offset;
- brainstem centerline and projected width profile;
- visible brainstem insertion relationship;
- interhemispheric fissure width where observable;
- frontal and occipital curvature samples;
- normalized contour samples;
- regional fold-frequency descriptors.

The appearance fixture must receive:

- normalized luminance field descriptors;
- dominant light direction/elevation estimate;
- key/fill relationship;
- highlight-width distribution;
- shadow-softness distribution;
- background luminance;
- cortical spatial-frequency maps/bands;
- material-response tolerance bands.

Unknown or ambiguous quantities must be marked `UNRESOLVED`; they may not be filled by procedural assumption.

## 11. Threshold freeze law

`NO_DERIVED_THRESHOLD_FROM_FIRST_CANDIDATE`

Acceptance thresholds must be frozen from the reference measurements and independently defensible anatomical tolerances before the first Gen1 candidate is judged. A first candidate may not be used to redefine the gate around itself.

## 12. Construction separation

The evaluator is construction-independent. It receives candidate geometry/render evidence and does not award credit for how the candidate was built.

In particular, conformance to splines, ellipsoids, cages, sectional profiles, primitives, procedural folds, or any other construction recipe is not evidence of anatomical fidelity.

## 13. Lineage disposition

The V9–V11 procedural reconstruction line is preserved as negative evidence. Its prior ALCM/CCM results demonstrate scaffold compliance, not external anatomical resemblance, and must not qualify `ANATOMICAL_BASIS_GEN1`.

The current live brain remains protected. This reference contract does not integrate, replace or modify the live Compass carousel.

## 14. Next lawful boundary

After this reference contract is frozen, the next material boundary is `ANATOMICAL_BASIS_GEN1_SOURCE_SELECTION_AND_BINDING`:

1. select a credible, licensable human-brain 3D surface source;
2. bind source provenance and license;
3. normalize source coordinates without redesigning anatomy;
4. define semantic component/landmark mapping and native multi-buffer conversion;
5. render the unstyled inherited anatomy under the fixed perceptual fixtures;
6. require `G0` and `G1` to pass before any expressive deformation.

No new procedural brain geometry is authorized by this reference boundary.
