# H-Earth Phase 2B Read-Only Bottleneck Adjudication v1

MODE: READ-ONLY / DURABLE
VISUAL EVIDENCE: user physical recording 26913.mp4
CODE AUTHORITY: 202480d2a4fd7298b4733b800b3e3914d7755a12
PRODUCT MUTATION: NONE

## Finding
Phase 2B has moved the dominant realism bottleneck. Surface/material shading is no longer the primary constraint. The next two constraints are (1) geometry/silhouette sampling and (2) missing cast/contact shadowing. Of these, geometry/silhouette is now the stronger immediate constraint in close and medium terrain views.

## Visual-to-code cross-reference

### 1. Material/shading — materially improved, no longer dominant
Visual evidence:
- close terrain carries nonperiodic breakup;
- exposed faces and sheltered ground separate better;
- prior horizontal painted-band dominance is absent;
- near-field surfaces retain variation through camera traversal.

Code:
Active Phase 2B terrain branch now contains derivative normal perturbation, nonperiodic multiscale relief, triplanar weights from shadingNormal, coarse/fine/micro triplanar signals, near-distance material envelope, weathering/fracture, exposed-rock and sheltered-soil response.

Disposition: preserve. Do not reopen broad shader architecture now.

### 2. Geometry/silhouette — dominant immediate bottleneck
Visual evidence:
- terrain ridgelines and coastal/foreground breaks expose long straight facets;
- some near slopes read as large planar pieces even though their material surface is improved;
- material microstructure cannot alter the actual silhouette;
- the closer the camera approaches, the more the underlying mesh resolution becomes visible.

Code:
`geometry-successor-terrain.run8b.js` constructs one connected indexed XZ height-field triangle mesh over:
x = -384..384
z = -736..128

Its profile sets:
`baseSpacingWorldUnits = Math.max(8, FULL_DETAIL.baseSpacingWorldUnits)`

The actual sampling axes use this base spacing uniformly across the full near-to-mid domain. The exported `refinementSpacingWorldUnits` exists, but `getHEarthRun8BSuccessorSamplingAxes()` does not use it; it samples only at `baseSpacingWorldUnits`.

Topology is two fixed triangles per grid cell. This is direct code evidence for the visible planar/faceted silhouette limitation.

Important: Phase 2B's shader can perturb normals but cannot create new silhouette vertices. Therefore further shader detail has diminishing returns on the visible faceting.

Disposition: NEXT BOUNDED CONSTRUCTION TARGET should be representation-level adaptive/refined sampling while preserving canonical terrain truth.

### 3. Cast/contact shadows — second bottleneck
Visual evidence:
- mountain forms are better shaded but still insufficiently grounded relative to real outdoor terrain;
- valleys and occluded relationships lack cast-shadow evidence;
- terrain-to-terrain depth is carried primarily by diffuse/normal response rather than occlusion.

Code:
Active renderer allocates a depth texture and geometry framebuffer, but the depth texture is used by a diagnostic depth-visualization program. The final terrain fragment shader does not sample a shadow map.
There is no light-space shadow pass, no shadow comparison, and no general AO pass.

Disposition: important, but second after geometry refinement because shadows cast by visibly coarse silhouettes will reinforce coarse geometry.

### 4. Atmosphere — not next
Visual evidence:
Current atmosphere provides usable distance separation. It is not the principal cause of near-field faceting.

Code:
Fog begins around the canonical ~640-unit regime and is applied downstream. Near terrain therefore exposes geometry directly, as intended.

Disposition: freeze.

### 5. Water/shoreline — independent later bottleneck
Visual evidence:
Water remains synthetic and shoreline transitions can remain angular, but terrain development is now progressing independently.

Code:
Water has a separate GPU optical projection and role handling. It should not be folded into terrain geometry refinement.

Disposition: freeze for next terrain pass.

## Adjudication
NEXT: geometry representation refinement.
AFTER: cast-shadow architecture.
THEN: geometry-derived contact/AO.
Atmosphere and water remain deferred.

## Geometry refinement boundary
This finding does NOT authorize changing canonical terrain truth, geography, mountain identity, coastline identity, navigation authority, or world topology semantics.

The lawful target is representation sampling only:
canonical terrain field
→ denser/adaptive near representation
→ same elevations sampled from the same field
→ recomputed continuous normals
→ same Phase 2B material shader

The first geometry experiment should prove that reducing near-field cell size improves silhouettes and planar-face appearance without changing geographic identity.

## Specific code target
Primary:
`showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js`

The key discrepancy to resolve is that `refinementSpacingWorldUnits` is defined but unused by the sampling-axis construction. A bounded near-field refinement can use the already-declared refinement concept rather than inventing a second terrain system.

## Acceptance
Physical A/B against Phase 2B must show:
- smoother ridgelines/silhouettes;
- fewer obvious planar terrain facets;
- preserved Phase 2B materials;
- unchanged coastline/world identity;
- no visible seams at refinement transitions;
- acceptable runtime/performance.

If these are not achieved, revert to Phase 2B and do not compensate with more shader noise.

## Conclusion
Phase 2B successfully exposed the next bottleneck. The immediate constraint is now representation geometry density, not final-pixel material design. This is the appropriate time to revisit geometry, but narrowly at the existing Run8B representation sampling layer—not canonical geography and not a replacement renderer.
