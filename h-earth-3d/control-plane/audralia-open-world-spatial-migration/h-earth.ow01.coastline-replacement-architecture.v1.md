# H-Earth OW01 Coastline Replacement Architecture v1

`DOCUMENT_ID = H_EARTH_OW01_COASTLINE_REPLACEMENT_ARCHITECTURE_v1`

`STATUS = FROZEN_FOR_IMPLEMENTATION`

`OPERATION = H_EARTH_V2_COASTAL_INTEGRATION_AND_POSITIONAL_IDENTITY_CLOSURE`

`PR = 742`

`MIRAGE_SOLVED_REFERENCE = 1cbc91a630557c2c89e6d860f68f347a44dd4df3`

`SAFE_IMPLEMENTATION_BASE = 30c00000b9b344abce5aad133a3149eabfe00f0b`

`FAILED_COAST_EXPERIMENT_HEAD = b90d6f6422ab413879e43d0f177650a27e55d00d`

`FAILED_COAST_EXPERIMENT_DISPOSITION = RESEARCH_REFERENCE_ONLY_DO_NOT_BUILD_FORWARD_FROM_ITS_COAST_ALGORITHM`

`GEOGRAPHIC_TRUTH_AUTHORITIES = 1`

`CAMERA_DISTANCE_CAN_CHANGE_GEOGRAPHY = FALSE`

`SEPARATE_BEACH_GEOMETRY = PROHIBITED`

`SEPARATE_WET_SAND_GEOMETRY = PROHIBITED`

`GLOBAL_WORLD_DENSIFICATION = PROHIBITED`

`NEW_GENERAL_TERRAIN_SYSTEM = PROHIBITED`

`NEW_LOD_FRAMEWORK = PROHIBITED`

`FULL_CONSTRAINED_DELAUNAY_SUBSYSTEM = DEFERRED_FALLBACK_ONLY`

---

## 1. Purpose

This document freezes the replacement coastline architecture before another OW01 coastline mutation is attempted.

The replacement must preserve the material gains already demonstrated at the safe implementation base while eliminating the regressions exposed by the failed coastline experiment.

The required result is not merely a smoother shoreline. It is a single topologically coherent geographic boundary that is consumed consistently by land, sand, sandbars, shallow water, ocean masking, and every camera scale.

The governing proposition is:

`DEFINE GEOGRAPHIC BOUNDARY ONCE -> BUILD LAND AND WATER FROM THAT SAME BOUNDARY -> NEVER RECONSTRUCT IT FROM CAMERA SCALE`

---

## 2. Controlling observed differential

The current evidence establishes the following:

`MIRAGE_FACTOR = MATERIAL_SOLVED_AT_1cbc91a6`

`LOCAL_FIDELITY = MATERIALLY_RESTORED_AT_1cbc91a6`

`GESTURE_INTENT_REPAIR = PRESERVE_FROM_30c00000`

`COASTLINE_BOXINESS = MATERIAL_DEFECT`

`COASTLINE_SHARDS = MATERIAL_DEFECT`

`SANDBAR_OVALIZATION = MATERIAL_REGRESSION`

`GRATITUDE_MACRO_BLOBIFICATION = MATERIAL_REGRESSION`

`NON_GRATITUDE_SOLID_BLOB_PRESENTATION = NOT_ACCEPTABLE_AS_AUTHORITATIVE_GEOGRAPHY`

`BEACH_RIBBON_REMOVAL = PRESERVE`

`SAND_AS_TERRAIN_MATERIAL = PRESERVE`

`SHALLOW_WATER_DIRECTION = PRESERVE`

`RESERVOIR_AND_WATERFALL_REGION = PROTECTED`

No implementation may improve coastline appearance by reopening the Mirage solution, reducing local terrain fidelity, restoring a separate beach object, or allowing planetary ocean geometry to overwrite canonical land.

---

## 3. Root-cause disposition

### 3.1 Sandbar ovalization

The current terrain candidate represents each sandbar through a rotated ellipse radius. Increased boundary fidelity therefore exposes the underlying ellipse rather than producing a more natural depositional form.

Disposition:

`ROTATED_ELLIPSE_AS_SANDBAR_LAND_AUTHORITY = REMOVE`

The existing centers, approximate lengths, orientations, and crest elevations may remain as migration inputs, but the final land boundary must not be an ellipse.

### 3.2 Gratitude macro blobification

The failed experiment applies one globally uniform cubic-Hermite tangent rule to a closed contour whose authoring-point spacing varies substantially. The result is continuous but over-rounded geography.

Disposition:

`GLOBAL_FIXED_TANGENT_HERMITE_COAST = REMOVE`

### 3.3 Local shards and hard cuts

The failed experiment independently subdivides selected coast cells and then clips triangles. Refined cell edges can contain vertices that their coarse neighbors do not share. Triangle-by-triangle clipping also makes the coastline an accidental result of arbitrary triangle diagonals.

Disposition:

`INDEPENDENT_CELL_EDGE_SUBDIVISION = REMOVE`

`TRIANGLE_BY_TRIANGLE_COAST_CLIPPING = REMOVE`

### 3.4 Large cyan/ocean wedges

The planetary ocean currently decides whether to retain entire coarse spherical triangles from approximate Gratitude land tests. One coarse ocean triangle can cover an area much larger than a local coastline feature.

Disposition:

`COARSE_PLANET_OCEAN_TRIANGLE_CULLING_AS_COAST_MASK = REMOVE`

### 3.5 Other-continent blobs

The present non-Gratitude continents are noncanonical radial/angular previews, not resolved continental coastline identities.

Disposition for OW01:

`NON_GRATITUDE_CONTINENTS = ATMOSPHERIC_UNRESOLVED_PRESENTATION`

They must not be visually promoted into crisp solid circular/blob landmasses. Their future canonical geography is outside this operation.

---

## 4. Architecture overview

The replacement has five layers:

1. `CANONICAL_COAST_AUTHORING_INPUTS`
2. `CANONICAL_COAST_LOOPS`
3. `CANONICAL_LAND_FIELD`
4. `BOUNDARY_CONFORMING_TERRAIN_MESH`
5. `SHARED_BOUNDARY_WATER_MASK`

The dependency direction is one-way:

```text
AUTHORING INPUTS
      |
      v
CANONICAL COAST LOOPS
      |
      +------> CANONICAL LAND FIELD / DISTANCE
      |
      +------> TERRAIN BOUNDARY
      |
      +------> OCEAN LAND MASK
      |
      +------> SHALLOW WATER DISTANCE
```

There is no local coastline, region coastline, continent coastline, and planetary coastline. There is one canonical coastline and multiple render views of it.

---

## 5. Canonical coast data model

The canonical coast model shall expose immutable geographic-space loops.

Conceptual contract:

```text
CanonicalCoastModel = {
  mainlandLoop,
  detachedLandLoops,
  allLoops,
  signedDistance(point),
  containsLand(point),
  nearestBoundary(point),
  boundaryIdentityHash
}
```

### 5.1 Loop laws

Every loop must satisfy:

- closed;
- deterministic;
- camera independent;
- stable ordering;
- no duplicate consecutive points;
- no zero-length edges;
- no local self-intersections;
- no global self-intersections;
- explicit winding convention;
- finite geographic coordinates;
- construction from frozen authoring inputs only.

`BOUNDARY_IDENTITY_HASH` must be calculated from the final canonical loop coordinates and exposed to both terrain and water evidence.

Land and water pass only if they report the same boundary identity.

---

## 6. Mainland coastline construction

### 6.1 Existing authoring anchors remain migration anchors

The existing `COAST_CONTROL_POINTS` are not discarded. They remain coarse authoring anchors for the wider Gratitude landmass.

They are not, however, the final renderer polygon.

### 6.2 No global fixed-tangent smoothing

The replacement macro curve shall use local, distance-aware interpolation.

Initial interpolation rule:

`CURVE_FAMILY = CENTRIPETAL_CATMULL_ROM`

`PARAMETERIZATION_ALPHA = 0.5`

Rationale: centripetal parameterization is specifically selected because it provides stronger behavior for unevenly spaced control points and avoids the local cusp/self-intersection behavior associated with less appropriate Catmull-Rom parameterizations.

### 6.3 Authoring-corridor guard

Interpolation is not allowed to freely redesign geography.

For each authoring segment `P_i -> P_(i+1)` define:

```text
segmentLength = |P_(i+1) - P_i|
allowedDeviation = clamp(0.15 * segmentLength, 6, 24)
```

Every resolved sample belonging to that segment must remain inside the union of the adjacent-segment corridor expanded by `allowedDeviation`.

If a candidate interpolated segment violates that corridor or introduces a global self-intersection:

`SEGMENT_FALLBACK = CHORD_LENGTH_INTERPOLATED_POLYLINE`

The renderer must prefer a less smooth but geographically faithful segment over a smooth blob.

### 6.4 Resolution

Resolved macro samples are geographic, not camera dependent.

Initial target spacing:

`MACRO_BOUNDARY_TARGET_CHORD = 6 authoring units`

with a bounded sample count per authoring segment:

`MIN = 4`

`MAX = 48`

The final sample count is derived from segment length, not camera distance.

### 6.5 Protected local coastline interval

Within the current detailed Gratitude coast, the already established shoreline function remains direct geographic authority.

For:

`u in [-320, 320]`

mainland boundary samples shall be taken directly from:

`resolveHEarthMapWideShorelineZ(u)`

at a fixed geographic spacing no greater than:

`LOCAL_COAST_SAMPLE_STEP = 2 authoring units`

The macro spline is prohibited from replacing or smoothing across this local interval.

The transition between direct local samples and macro samples must occur outside the protected local interval and must preserve the exact endpoint positions of both domains.

---

## 7. Sandbar replacement architecture

### 7.1 Governing rule

`SANDBAR = CURVED_VARIABLE_WIDTH_DEPOSITIONAL_FEATURE`

not:

`SANDBAR = ROTATED_ELLIPSE`

### 7.2 Migrated inputs

Each current sandbar may retain:

- current identifier;
- current center;
- current rotation as dominant axis direction;
- current `radius.x` as approximate half-length scale;
- current `radius.z` as approximate maximum half-width scale;
- current crest elevation.

These values seed the successor but do not define an ellipse boundary.

### 7.3 Centerline representation

Each sandbar shall have a deterministic centerline `C(s)`, `s in [0,1]`.

The centerline must:

- begin and end at tapered tips;
- preserve the current dominant orientation;
- contain bounded curvature;
- contain at least one asymmetric lateral displacement;
- remain within the prior sandbar migration envelope unless separately authorized.

A suitable implementation is a short centripetal Catmull-Rom centerline built from 4-5 points derived deterministically from the migrated center/orientation/length and an ID-specific bend phase.

### 7.4 Width profile

Let `s*` be the closest centerline parameter to point `p`.

The bar half-width is:

```text
w(s) = Wmax * taper(s) * irregularity(s)
```

where:

```text
taper(0) = 0
taper(1) = 0
max(taper) occurs away from exact center symmetry
0.80 <= irregularity(s) <= 1.18
```

The profile must not be mirror symmetric end-to-end.

The signed bar field is:

```text
phi_bar(p) = w(s*) - distance(p, C(s*))
```

A positive value denotes emerged sandbar land.

### 7.5 Anti-oval acceptance law

A sandbar implementation fails mechanically if its boundary can be represented by the old `rotatedEllipseRadius` function or if the successor land-authority path still calls that function.

`ROTATED_ELLIPSE_RADIUS_IN_CANONICAL_LAND_AUTHORITY = 0 CALLS`

The old function may remain only for historical comparison evidence until cleanup.

---

## 8. Canonical land field

The canonical field combines mainland and detached land loops.

Define:

```text
phi(p) > 0  => canonical land
phi(p) = 0  => canonical coastline
phi(p) < 0  => canonical ocean
```

The magnitude of `phi` is the distance to the nearest canonical coastline segment within the accuracy required by material classification.

The sign is determined from canonical loop containment.

The field is used for:

- land/ocean classification;
- coast-distance material influence;
- shallow-water color transition;
- sand material placement;
- terrain boundary construction;
- ocean masking.

The field does not define terrain elevation.

`TERRAIN_HEIGHT_AUTHORITY` remains the terrain source.

`COAST_FIELD_AUTHORITY` only determines geographic land/water boundary and distance from it.

---

## 9. Terrain boundary construction

### 9.1 Governing prohibition

The terrain mesh must no longer:

1. triangulate a cell;
2. discover afterward that a triangle crosses the coastline;
3. clip that individual triangle.

That architecture is removed.

### 9.2 Base terrain grid remains

The existing geographically fixed terrain grid may remain, including its current local high-density interval.

No whole-world density increase is permitted as part of this correction.

### 9.3 Coast construction occurs at cell level

For each terrain quad cell:

`CASE A: entirely land`

Emit its normal two terrain triangles.

`CASE B: entirely ocean`

Emit no land terrain triangle.

`CASE C: coastline intersects cell`

Construct the land polygon for the entire quad first, then triangulate that polygon.

The coastline is therefore a property of the cell boundary solution, not an arbitrary triangle diagonal.

### 9.4 Shared edge roots

Every coastline intersection with a terrain-cell edge must be resolved by one deterministic edge-root function.

Conceptually:

```text
solveEdgeZero(endpointA, endpointB)
```

Requirements:

- same ordered geographic endpoints -> same exact root result;
- fixed iteration count or fixed tolerance;
- root evaluated from canonical `phi`;
- result cached/keyed by canonical grid-edge identity;
- adjacent cells sharing an edge must consume the exact same intersection vertex.

Initial tolerance:

`EDGE_ROOT_TOLERANCE <= 0.01 authoring units`

This shared-edge rule is the principal anti-crack/T-junction invariant.

### 9.5 Cell topology cases

The cell solver shall follow the 16 marching-squares sign configurations at cell level.

The ambiguous diagonal cases must not be selected arbitrarily.

For the two ambiguous configurations, sample the canonical field at the cell center and choose connectivity from that value.

`AMBIGUOUS_CASE_DECIDER = CANONICAL_CENTER_FIELD`

The same inputs must always return the same topology.

### 9.6 Internal contour fidelity without T-junctions

A coast-crossing cell may add internal contour points to reduce visible chord error, but it may not add unmatched subdivision vertices to the cell's exterior edges.

The only additional exterior-edge vertex allowed is the canonical zero crossing itself.

Internal contour refinement must satisfy:

`MAX_BOUNDARY_CHORD_ERROR = 1.0 authoring unit` inside the protected local domain.

`MAX_BOUNDARY_CHORD_ERROR = 3.0 authoring units` outside the protected local domain.

Refinement is geographic and construction-time only; it is not camera dependent.

### 9.7 Cell polygon triangulation

After the ordered land polygon is assembled, triangulate it locally.

Because a coast-crossing quad produces a small bounded polygon, a deterministic local ear-clipping/fan strategy is sufficient for the primary implementation.

The triangulator must reject:

- zero-area triangles;
- reversed winding;
- duplicate indices;
- triangles whose centroid classifies as canonical ocean beyond numerical tolerance.

### 9.8 Constrained-Delaunay escalation rule

A general constrained-Delaunay/PSLG subsystem is not authorized for the first replacement.

It becomes eligible only if the cell-level conforming solver is demonstrated to fail one of these requirements after implementation:

- cannot remove visible shards without global densification;
- cannot preserve shared boundary vertices;
- cannot represent required concavities/topology;
- produces unacceptable sliver triangles despite local deterministic retriangulation.

This prevents a local coastline correction from expanding into a new geometry infrastructure program prematurely.

---

## 10. Water ownership and ocean masking

### 10.1 Governing rule

Land and ocean must consume the same canonical boundary identity.

The planetary ocean is prohibited from inferring Gratitude geography from its own coarse triangles.

### 10.2 Remove coarse ocean-triangle coastline authority

The current logic that drops whole planetary ocean triangles when some Gratitude land test succeeds must be removed.

`PLANETARY_OCEAN_TRIANGLE_CULLING_FOR_GRATITUDE_MASK = FALSE`

The planetary ocean may remain a coarse spherical water surface for rendering efficiency, but it no longer owns the coastline.

### 10.3 Canonical land footprint mask

Construct a footprint mask from the exact same canonical land polygons used by the terrain boundary.

The primary implementation shall use the shared canonical land footprint as a stencil/mask stage so that ocean fragments are suppressed wherever canonical Gratitude land exists, independent of terrain elevation.

This is required because reservoir/basin terrain can lie below sea level while remaining geographically inland. Depth testing alone therefore cannot determine ocean ownership.

The mask must include:

- Gratitude mainland;
- emerged sandbar loops;
- any other canonical detached Gratitude land loop.

The mask must not create a hole for the inland reservoir.

### 10.4 Boundary identity assertion

Terrain evidence and water-mask evidence must expose:

`boundaryIdentityHash`

and pass only when:

```text
terrain.boundaryIdentityHash === water.boundaryIdentityHash
```

### 10.5 Shallow-water color

Nearshore water remains a material/color phenomenon, not a new beach object.

The ocean color may use canonical coast distance:

```text
0..D_shallow -> shoreWater / shallow palette
>D_shallow    -> deep ocean palette
```

Initial bound:

`D_shallow = 110 authoring units`

No nearshore geometry is allowed to redefine coastline position.

---

## 11. Beach and sand material law

The successful ontology change remains permanent:

`SAND = TERRAIN MATERIAL CLASSIFICATION`

not:

`SAND = SEPARATE COASTAL OBJECT`

The terrain may use canonical coast distance, elevation, slope, and deterministic bounded variation to calculate sand influence.

Terrain elevation remains unchanged by sand classification.

The following remain prohibited:

- raised beach ribbon;
- wet-sand ribbon mesh;
- hand-maintained beach spline independent of canonical coast;
- sand flattening terrain;
- camera-dependent sand extent.

---

## 12. Non-Gratitude continent policy for OW01

The current radial/angular placeholder continents are not permitted to present as crisp authoritative solid blobs during this operation.

Until each future continent receives canonical geographic authorship, its presentation shall be one of:

- atmospheric haze;
- low-contrast unresolved land suggestion;
- partially obscured silhouette;
- omission from close geographic judgment.

`NON_GRATITUDE_PLACEHOLDER_SHAPE = NOT_A_CANONICAL_COASTLINE`

This operation must not invent exact future-continent geography merely to make placeholders prettier.

---

## 13. Camera, Mirage, and interaction locks

The coastline replacement is not authorized to change the Mirage solution.

The following are frozen from the successful reference / gesture successor:

- one canonical Gratitude geographic authority;
- fixed FOV across scale excursion;
- pure pinch changes camera distance without changing canonical target;
- two-finger gesture intent locking from `30c00000...`;
- no camera-distance geographic substitution;
- same Gratitude identity through LOCAL / REGION / CONTINENT / PLANETARY.

Any coastline implementation that requires changing these behaviors is architecturally invalid.

---

## 14. Protected environment locks

The replacement must not regress:

- high-density local terrain;
- accepted localized relief;
- waterfall/reservoir terrain relationship;
- bounded lighter inland reservoir water;
- mountain placement;
- estate terrain preparation;
- shallow-water direction;
- Harbor geographic relationship;
- sand-as-terrain behavior.

The replacement owns coastline topology only.

---

## 15. Mechanical acceptance gates

The successor must expose one deterministic receipt containing at least the following.

### Gate C1 - Single boundary authority

```text
canonicalBoundaryAuthorityCount == 1
```

### Gate C2 - Loop validity

```text
allLoopsClosed == true
allLoopsFinite == true
selfIntersectionCount == 0
zeroLengthEdgeCount == 0
```

### Gate C3 - Shared land/water identity

```text
terrainBoundaryHash == waterMaskBoundaryHash
```

### Gate C4 - No triangle clipping authority

```text
triangleByTriangleCoastClipping == false
```

### Gate C5 - No coast-cell T-junctions

Every grid edge containing a coastline intersection has exactly one canonical shared intersection identity used by all adjacent land cells.

```text
unmatchedCoastEdgeVertexCount == 0
```

### Gate C6 - Sandbar successor

```text
rotatedEllipseRadiusCallsInCanonicalLandAuthority == 0
sandbarCenterlineCount == 3
sandbarLoopsClosed == true
```

### Gate C7 - Ocean ownership

```text
planetaryOceanTriangleCullingForGratitudeMask == false
canonicalLandMaskActive == true
```

### Gate C8 - Geography/Mirage preservation

```text
scaleDependentGeographicSubstitution == false
canonicalTargetStableUnderPureZoom == true
fixedFovAcrossScale == true
```

### Gate C9 - No beach object regression

```text
separateBeachGeometryConstructed == false
separateWetSandGeometryConstructed == false
```

### Gate C10 - Bounded complexity

No noncoastal grid cell receives added coastline subdivision solely because the camera moved or because a global density constant was reduced.

The receipt must report:

- base terrain cell count;
- coast-crossing cell count;
- canonical loop sample count;
- coastline-added internal vertex count;
- final terrain triangle count;
- footprint-mask triangle count;
- construction time in the browser verifier.

No universal numeric performance threshold is frozen before first execution, but any material mobile responsiveness regression is a user-gate failure.

---

## 16. Perceptual acceptance gates

Automation cannot close the visual operation.

The user review must include the same physical places used in the current evidence.

### P1 - Mirage preservation

Perform:

`LOCAL -> REGION -> CONTINENT -> PLANETARY -> CONTINENT -> REGION -> LOCAL`

Pass only if the place remains physically identical and does not swim/recompose.

### P2 - Local coastline

Inspect Harbor, a concave inlet, a headland, and a long open-coast segment.

Pass only if:

- no large triangular shards;
- no cyan ocean wedges;
- no repeated staircase/sawtooth edge;
- no manufactured beach ribbon;
- no obvious grid-cell boxiness at normal local inspection distance.

### P3 - Sandbars

Pass only if each sandbar reads as a distinct elongated depositional feature rather than a rotated oval.

The three bars must not share the same silhouette family.

### P4 - Macro Gratitude identity

At region/continent/planetary view, Gratitude must preserve recognizable headlands, indentations, asymmetry, and geographic character.

Pass only if it does not collapse into a rounded blob.

### P5 - Local environment preservation

Mountains, reservoir, basin, relief, and terrain character must remain materially consistent with the protected successful reference.

### P6 - Interaction preservation

Forward/backward two-finger travel must remain responsive, and pinch must retain the Mirage solution.

---

## 17. Exact implementation sequence

The full replacement shall proceed in this order.

### Step 0 - Implementation baseline reconstruction

Use:

`SAFE_IMPLEMENTATION_BASE = 30c00000b9b344abce5aad133a3149eabfe00f0b`

as the product-code source for `renderer.mjs` coastline behavior.

Retain the new architecture document and the gesture repair.

Do not build forward from the `b90d6f64...` Hermite/refined-cell coastline algorithm.

### Step 1 - Canonical coast module inside existing OW01 renderer scope

Create the immutable canonical coast loops and boundary hash.

No visible mutation is considered successful until loop validity passes.

### Step 2 - Replace ellipse sandbar land authority

Migrate the three bars to centerline/variable-width fields and loops.

### Step 3 - Replace triangle-level clipping

Implement the cell-level shared-edge coastline solver and local polygon triangulation.

### Step 4 - Replace ocean triangle culling

Make planetary ocean rendering consume the canonical land footprint mask and shared boundary hash.

### Step 5 - Demote noncanonical continent blobs

Remove crisp authoritative blob presentation without inventing future canonical geography.

### Step 6 - Mechanical exact-head verification

Run existing repository intake, browser syntax/runtime verification, anchor/surface checks, and the new bounded coastline receipt.

### Step 7 - User differential

Only after mechanical pass expose an immutable review URL and request the combined visual/interaction differential.

---

## 18. Stop conditions

Stop implementation immediately if any of the following becomes necessary:

- changing camera scale semantics to hide coastline defects;
- restoring separate beach/wet-sand geometry;
- creating scale-specific coastlines;
- changing protected reservoir geometry to solve ocean masking;
- globally multiplying terrain resolution as the primary fix;
- inventing exact non-Gratitude continent geography;
- adding a general CDT/terrain framework before the bounded cell-level solver is proven insufficient.

A stop condition requires diagnosis before additional mutation.

---

## 19. Research basis

The architecture is informed by the following established geometry results and practices:

1. Cem Yuksel, Scott Schaefer, John Keyser, "Parameterization and applications of Catmull-Rom curves," Computer-Aided Design 43(7), 2011, DOI `10.1016/j.cad.2010.08.008`. Centripetal parameterization is selected for the macro interpolation candidate because its behavior is better controlled for unevenly spaced interpolation points and it avoids local cusp/self-intersection behavior within curve segments.

2. Marching-squares contour topology practice: coastline decisions are made at quad-cell level, including deterministic handling of the ambiguous diagonal cases, rather than clipping already-created triangles independently.

3. Jonathan Richard Shewchuk, Triangle / constrained Delaunay triangulation work. A PSLG-constrained triangulation is retained as a technically valid fallback if the bounded cell-conforming method proves insufficient, but it is deliberately not the first implementation because OW01 does not currently need a new general triangulation subsystem.

---

## 20. Terminal architectural statement

The replacement is governed by two identities:

`AUTHOR THE PLACE ONCE -> SAMPLE/RENDER IT MANY WAYS`

and:

`THE COASTLINE IS A GEOGRAPHIC BOUNDARY FIRST; TRIANGLES AND WATER MUST OBEY IT`

The implementation succeeds only when the existing Mirage solution, local fidelity, reservoir relationship, touch-travel correction, and sand-as-terrain ontology are all retained while coastline shards, hard boxiness, oval sandbars, and blobification are materially removed.
