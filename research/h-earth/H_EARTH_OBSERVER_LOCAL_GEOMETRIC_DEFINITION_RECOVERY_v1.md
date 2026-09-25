# H-Earth Observer-Local Geometric Definition Recovery v1

Status: DURABLE READ-ONLY AUDIT RECOVERY
Base main SHA at recovery: 6d1bf5672e7ba07c47b3c8b55b5ac6c1d27e0e9f
Product mutation authority: NONE
Merge/deployment/publication authority: NONE

## Purpose

Freeze the recovered answer to the observer-local geometric-definition question before any further B2 morphology construction. This record is an audit artifact only. It does not modify H-Earth runtime, terrain, renderer, compositor, camera, navigation, GPU transport, or production publication.

## Recovered chain

The relevant authority chain is:

Run 8A sampling/refinement contract
→ Run 8B successor terrain geometry construction
→ South neutral indexed triangle mesh
→ downstream admission/package/GPU/renderer transport
→ observer/camera.

The older East/South height-field kernels establish the same fundamental rule: field information becomes visible geometry only where samples become vertices; cells between those vertices are planar indexed triangles.

## Deterministic findings

### 1. Run 8A specifies a refinement law

Source:
`h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js`

FULL_DETAIL declares:
- base spacing: 4 world units
- refinement spacing: 2 world units
- triggers: curvature > 0.04, slope > 0.22, mountain contribution > 8, or formation boundary within 8 world units
- maximum vertical approximation error: 0.75
- maximum normal angular error: 6 degrees

REDUCED_DETAIL declares 8/4 spacing.
DISTANT_PROXY declares 16/8 silhouette spacing.

Run 8B is allowed to choose higher resolution, but not lower resolution than the contract.

### 2. The current main Run 8B implementation does not materialize the Run 8A FULL_DETAIL refinement law

Source:
`showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js`

Current main defines:
- near-to-mid domain x = -384..384
- near-to-mid domain z = -736..128
- base spacing = max(8, FULL_DETAIL.baseSpacing) = 8
- refinement spacing = max(4, FULL_DETAIL.refinementSpacing) = 4

But `getHEarthRun8BSuccessorSamplingAxes()` currently constructs BOTH x and z axes using only `baseSpacingWorldUnits`.

Therefore the current main Run 8B representation is a uniform 8-world-unit grid. The declared 4-world-unit `refinementSpacingWorldUnits` is metadata only in this implementation path. No curvature/slope/mountain/boundary trigger is consulted by the topology builder.

This is the primary recovered geometric-definition bottleneck.

### 3. Current main has no observer-local terrain refinement

The Run 8B topology builder receives no observer/camera position and performs no camera-distance test. It builds one static global indexed XZ grid for the near-to-mid representation.

Therefore near-player vertex spacing on current main Run 8B is 8 world units in X and 8 world units in Z, except for terminal-axis effects if a domain endpoint is not divisible by the spacing.

There is no observer-local tessellation, adaptive subdivision, quadtree/clipmap, camera-centered patch, or distance-dependent terrain geometry in this path.

### 4. The observer scale makes the mismatch material

The canonical morphology audit records:
- observer eye height: 2.25 world units
- look distance: 18 world units.

At 8-unit grid spacing:
- one terrain cell spans about 3.56 observer eye heights;
- the 18-unit canonical look distance spans only 2.25 grid cells per axis;
- each rectangular cell is rendered as two planar triangles.

Thus the terrain field can contain meaningful structure below an 8-unit wavelength and the visible mesh can either miss it at sample locations or reduce it to interpolation across large planar faces.

### 5. Historical Run 8B evidence proves finer geometry existed, but it is not the current-main implementation

Receipt:
`h-earth-3d/validation/h-earth.run8b.successor-neutral-geometry.receipt.json`

The historical closed receipt records:
- 120 rows
- 203 columns
- 24,360 vertices
- 48,076 triangles
- X spacing min/max 2/4
- Z spacing min/max 2/4
- world bounds x -256..256, z -320..64.

This is evidence that a materially denser Run 8B construction was previously executed. It must not be confused with current main, whose present source has since evolved to the larger -384..384 / -736..128 representation and uniform 8-unit sampling.

The historical receipt is therefore recovery evidence, not current-runtime proof.

### 6. Phase-3 PR #4575 independently identified and attempted the same missing materialization

Draft PR #4575:
`H-Earth Phase 3: bounded residual geometry integration`
head `8386dfc5fc43e6972684b1b1e7b870f3941aa56b`
base `10f9b47b241e2a6197e2acd36c4fe7ca4338fa60`

Its stated purpose is to integrate 4-unit residual geometry into authoritative Run 8B while preserving 8-unit parents and downstream transport.

The candidate changes sampling axes so:
- X becomes 4-unit spacing across the representation;
- rear Z remains 8-unit;
- near Z from -220 through 128 becomes 4-unit;
- new refined vertices receive bounded Phase-3 residuals.

This is direct evidence that the Phase-3 program recognized that residual information had to be materialized as actual vertices rather than remaining field-only information.

However PR #4575 is draft, open, unmerged, and its own contract holds qualification/merge pending residual and CPU→GPU correspondence proof. It is NOT current authority and must not be silently adopted.

### 7. B2 morphology and geometric definition are separate variables

The B2 family changes terrain-field information. The recovered geometry audit shows that field sophistication and visible geometric bandwidth are not equivalent.

Therefore further gullies, terraces, erosion, microrelief, or similar field-level morphology must not be treated as a reliable route to visible improvement until geometric sampling is explicitly qualified at observer scale.

## Current deterministic answer

CURRENT_MAIN_RUN8B_NEAR_PLAYER_VERTEX_SPACING = 8 world units
CURRENT_MAIN_RUN8B_NEAR_PLAYER_CELL_SIZE = 8 x 8 world units
CURRENT_MAIN_RUN8B_TRIANGLES_PER_CELL = 2
CURRENT_MAIN_RUN8B_OBSERVER_LOCAL_ADAPTATION = NONE
CURRENT_MAIN_RUN8B_DECLARED_REFINEMENT_SPACING = 4 world units
CURRENT_MAIN_RUN8B_DECLARED_REFINEMENT_MATERIALIZED = NO
RUN8A_FULL_DETAIL_REQUIRED_BASE_SPACING = 4 world units
RUN8A_FULL_DETAIL_REQUIRED_REFINEMENT_SPACING = 2 world units
CURRENT_MAIN_VS_RUN8A_FULL_DETAIL_CONFORMANCE = NOT DEMONSTRATED
HISTORICAL_RUN8B_2_TO_4_UNIT_GEOMETRY = PROVEN_BY_RECEIPT_BUT_NOT_CURRENT
PHASE3_4_UNIT_NEAR_REFINEMENT = DRAFT_UNMERGED_CANDIDATE_ONLY

## Construction hold

Until a new construction contract explicitly addresses this recovered mismatch:

- freeze B2/B2.1/B2.2 morphology escalation;
- do not add more terrain-field frequency merely to seek visible definition;
- do not claim the existing `refinementSpacingWorldUnits` is active refinement;
- do not infer observer-local LOD from field-level residual proofs;
- do not merge PR #4575 merely because it contains denser geometry;
- preserve Variant-B camera/observer/renderer/compositor authority for visual comparison.

## Next deterministic construction question

Construct and qualify an observer-scale geometric-definition contract before another morphology pass.

That contract must separately prove:
1. actual vertex spacing within the observer's immediate 0..18 world-unit view;
2. actual triangle edge-length distribution in that region;
3. whether Run 8A 4/2 FULL_DETAIL requirements are to be restored literally or superseded by a newly justified sampling law;
4. where refinement occurs: static regional, field-triggered, observer-local, or a bounded combination;
5. continuity at every 2↔4↔8 transition;
6. CPU vertex/index counts before package transfer;
7. exact GPU position/index counts after binding;
8. no downstream decimation or alternate coarse terrain substitution;
9. same fixed Variant-B observer/camera/FOV/compositor/renderer during A/B inspection;
10. measurable visible-definition gain without changing terrain morphology in the first geometry-only experiment.

## Recovery rule

If a later room loses context, begin from this artifact and current repository state. Do not reconstruct the geometric-definition problem from chat memory.
