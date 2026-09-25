# H-Earth Phase 3 Refinement Mesh Geometric Audit v1

MODE: READ-ONLY / DURABLE
AUDITED CANDIDATE: e1be941e196dfcf5405d8f58693506b84e08c8df
VISUAL EVIDENCE: 26932.mp4
PRODUCT MUTATION: NONE

## Decisive finding
The refinement patch is NOT sampling the same visible terrain surface as frozen Phase 2B.

The index topology itself is regular and internally valid. The catastrophic wedges/planes are caused by a source-surface mismatch before planetary projection.

## Exact mismatch
Frozen Phase 2B visible terrain is constructed in this order:

1. Run8B base terrain:
   sampleHEarthRun8BSuccessorTerrainField(x,z)
2. landscape-preview materializes Gen311 regional relief:
   regionalReliefDelta(v)
   projected local Y = base Run8B Y + regionalReliefDelta
3. the relief-modified vertex is then transformed through:
   regionToHEarthPlanetPoint(v)
4. triangle mesh normals are rebuilt from the relief-modified geometry.

The Phase 3 patch instead does:

1. sampleHEarthRun8BSuccessorTerrainField(x,z)
2. immediately call regionToHEarthPlanetPoint({x,y:t.elevation,z})
3. use t.normal from the pre-Gen311 terrain field.

Therefore the patch omits the entire Gen311 regional relief projection that the base visible mesh contains.

This is not a small numerical discrepancy. In the regional relief area the base path can add ridge/watershed/foothill elevation and subtract valley/pass elevation, including an elevation-dependent term. The patch can consequently intersect, undercut, or diverge materially from the base surface. When the base is fragment-masked away, those mismatches become visible as large planes/wedges.

## Index audit
Patch dimensions:
- spacing = 4
- radius = 64
- 33 x 33 vertices = 1089 vertices
- 32 x 32 cells
- 2048 triangles
- 6144 indices

Connectivity:
a = r*cols+c
b = a+1
d = (r+1)*cols+c+1
e = (r+1)*cols+c
triangles = [a,e,b] [b,e,d]

This matches the base Run8B grid winding/connectivity law. No out-of-range or cross-row index defect is evident.

Disposition: INDEX TOPOLOGY NOT PRIMARY FAILURE.

## Projection audit
Both base and patch ultimately call regionToHEarthPlanetPoint, so the spherical transform itself is consistent.

But the inputs differ:
- base: relief-modified local terrain vertex
- patch: raw Run8B terrain-field elevation

Disposition: PLANETARY TRANSFORM VALID; PRE-PROJECTION SURFACE INPUT INVALID.

## Normal audit
Base Phase 2B:
constructHEarthTriangleMesh(... normalMode FACE_AND_VERTEX ...) is executed after Gen311 relief is materialized, so normals correspond to the final visible relief geometry.

Patch:
uses t.normal directly from sampleHEarthRun8BSuccessorTerrainField before Gen311 relief.

Disposition: PATCH NORMALS DO NOT MATCH FINAL VISIBLE SURFACE.

## Material audit
The repaired candidate now samples Run8C material channels, which is directionally correct. However Run8C material sampling is based on Run8B terrain/regional causal signals, while the visible geometry includes the separate landscape-preview Gen311 relief projection. Material inheritance is no longer the catastrophic failure; geometry/normal parity is.

## Mask audit
The base suppression mask operates in vWorldPosition.xz after spherical projection but is parameterized by local-authoring x/z anchor and radius.

At the current small regional distances relative to a 420000-unit planet radius, projected x/z are numerically close to local x/z, but they are not formally the same coordinate system.

This is a latent boundary defect. The suppression decision should be performed using explicit local-authoring coordinates or a patch identity/mask attribute, not by comparing projected planetary x/z against local-authoring bounds.

Disposition: SECONDARY REPAIR REQUIRED before accepting a stitched LOD system.

## Required repair
Do not create another candidate until patch construction reuses the exact visible-terrain projection law.

Minimum lawful repair:
1. Export/share the Gen311 regionalReliefDelta law from landscape-preview (or move it to a common representation helper).
2. For every refinement vertex:
   base sample = sampleHEarthRun8BSuccessorTerrainField(x,z)
   visibleLocalY = base elevation + regionalReliefDelta({x,y:base elevation,z})
   projected = regionToHEarthPlanetPoint({x,y:visibleLocalY,z})
3. Recompute normals from the final refined mesh geometry, using the same face-and-vertex normal convention as the base representation. Do not reuse pre-relief t.normal.
4. Give the patch explicit local-authoring XZ attributes or deterministic patch membership so base suppression does not compare planetary projected coordinates with local coordinates.
5. Verify every patch vertex that coincides with an 8-unit base-grid vertex against the corresponding Phase 2B visible vertex. Position delta must be approximately zero before browser qualification.
6. Verify perimeter vertices are exact members of the base visible surface before rendering.

## Mandatory pre-browser parity gate
Before another public-route run, generate a deterministic receipt containing:
- coincident vertex count;
- maximum coincident position delta;
- mean coincident position delta;
- perimeter vertex count;
- maximum perimeter position delta;
- index range validity;
- triangle degeneracy count;
- normal finite/unit-length checks;
- maximum normal disagreement at coincident vertices;
- coordinate-space identity used by suppression.

Required:
- max coincident position delta <= 1e-5 world units;
- max perimeter position delta <= 1e-5;
- zero out-of-range indices;
- zero degenerate triangles;
- all normals finite;
- suppression coordinate space explicitly identical.

## Conclusion
The failed Phase 3 visual candidate does not invalidate local refinement or the post-READY lifecycle. It identifies a precise construction error: the patch refined raw Run8B terrain while Phase 2B displays Run8B plus Gen311 regional relief. The next implementation must refine the final visible terrain representation, not an upstream terrain field.
