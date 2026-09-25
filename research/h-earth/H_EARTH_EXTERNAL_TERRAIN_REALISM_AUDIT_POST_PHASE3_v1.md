# H-Earth External Terrain Realism Audit — Post Phase 3 v1

MODE: READ-ONLY / DURABLE
DATE: 2026-09-23
PURPOSE: Cross-reference H-Earth's Phase 3 result against established terrain-rendering architecture before the internal 8/4/2/1 field-frequency audit.

## Sources audited
1. NVIDIA GPU Gems 2, Chapter 2 — GPU-Based Geometry Clipmaps.
2. Epic Games Unreal Engine 5.8 — Nanite Landscapes.
3. Epic Games Unreal Engine 5.8 — Nanite Tessellation / Static Displacement.
4. Epic Games Unreal Engine 5.8 — Nanite technical details.
5. Cesium QuantizedMeshTerrainData — tile edge, skirt, child/upsampling semantics.

## External findings

### A. More triangles do not create new terrain information
Epic states that Nanite Landscape using identical source data should not inherently produce a visual improvement or downgrade. Nanite is a representation/performance system; source landscape information remains decisive.

H-Earth correspondence:
The Phase 3 8→4 uniform subdivision result is expected to remain broadly planar if the underlying visible terrain signal contains no additional sub-cell geometric information.

### B. Tessellation and displacement are separate responsibilities
Epic's Nanite tessellation generates additional triangles only as required by current pixel density, but those triangles conform to displacement information. Epic also distinguishes static adaptive tessellation driven by displacement maps and exposes an error target rather than a fixed universal triangle spacing.

H-Earth correspondence:
A future representation should separate:
1. WHERE more geometry is warranted (screen-space/error/observer policy), from
2. WHAT new geometric elevation/relief that geometry should represent.

Uniform 4-unit sampling attempted to solve both with one mechanism and did not.

### C. Geometry clipmaps preserve steady cost through nested levels
NVIDIA geometry clipmaps use nested regular grids centered on the viewer. Only the finest level is a full square; coarser levels are hollow rings. Levels shift incrementally rather than rebuilding the terrain mesh on every camera movement.

H-Earth correspondence:
The successful post-READY resource lifecycle should eventually evolve toward persistent observer-centered levels/rings rather than one repeatedly reconstructed arbitrary patch.

### D. LOD boundaries require explicit continuity
NVIDIA uses transition regions near level perimeters and morphs fine geometry toward the coarser level to keep the mesh watertight and avoid temporal popping.

Cesium explicitly tracks tile edge indices and skirt heights, and distinguishes true child geometry from geometry merely upsampled from a parent.

H-Earth correspondence:
Boundary treatment is a first-class subsystem. A refinement patch cannot simply overlap or mask a base representation. Exact shared edges plus morph/stitch policy must be part of the representation contract.

### E. Fine detail can be synthesized as residual elevation
NVIDIA describes each fine clipmap level as a prediction obtained by upsampling the coarser level plus a residual detail signal. The system supports runtime detail synthesis on the GPU.

H-Earth correspondence:
This is the strongest architectural precedent for a lawful H-Earth relief layer:
canonical macro elevation
+ deterministic bounded residual geometric relief
= fine representation elevation.

The residual need not become new geography authority. It can remain a representation-level detail signal whose amplitude/frequency are bounded by terrain class and scale.

### F. Smooth upsampling matters
NVIDIA's clipmap implementation uses an interpolatory subdivision filter with C1 smoothness for coarse→fine prediction rather than naïve linear subdivision.

H-Earth correspondence:
If the internal field audit finds useful high-frequency canonical information, its fine representation should use a smooth reconstruction/filtering law. If it does not, smooth interpolation alone will still not create relief; a residual is required.

### G. Geometry and shading frequencies need not match
NVIDIA reports normal maps at twice the geometry resolution because one normal per vertex was too blurry.

Epic states that Nanite displacement does not itself supply correct shading; corresponding normals or normals derived from displacement derivatives are needed.

H-Earth correspondence:
Phase 2B's high-frequency normal/material response should remain a separate higher-frequency shading layer. Geometry relief should use a lower, physically plausible frequency band and normals should be recomputed/derived consistently from it.

### H. Fine levels should deactivate when they cannot help
NVIDIA deactivates unnecessarily fine clipmap levels as observer height increases because excessive geometry can alias and wastes work. Epic's tessellation similarly generates only as much triangle detail as current pixel density requires and supports displacement fading by on-screen size.

H-Earth correspondence:
The future system should use screen-space/observer-height error gates. A fixed 4-unit refinement patch should not be rendered merely because the camera is within a world-space radius.

### I. Error-driven refinement is preferable to fixed density
Epic's static displacement tessellator exposes relative error, and Nanite's technical controls include screen-space edge constraints. Both express geometry density in terms of visual/error requirements rather than one universal world spacing.

H-Earth correspondence:
The next representation contract should eventually use projected geometric error / displacement error, not simply 8→4→2 spacing.

## Architecture synthesized for H-Earth

CANONICAL MACRO TERRAIN
Run8B + accepted Gen311 visible relief
↓
COARSE→FINE RECONSTRUCTION
smooth predicted elevation
↓
BOUNDED RESIDUAL GEOMETRIC RELIEF
deterministic, terrain-aware, non-geography-authoritative
↓
ERROR-DRIVEN OBSERVER REPRESENTATION
persistent nested/ring/patch resources
↓
EXPLICIT LOD CONTINUITY
shared edge + morph/stitch policy
↓
PHASE 2B MATERIAL/NORMAL DETAIL
higher-frequency shading than geometry
↓
SHADOW / CONTACT DEPTH

## What the internal audit must now determine
For representative coastal, inland slope, ridge, valley, and mountain regions:
- sample the final visible terrain law at 8, 4, 2, and 1 world-unit spacing;
- compare each finer sample against a smooth prediction reconstructed from the next-coarser level;
- measure residual elevation amplitude;
- measure residual RMS and percentile distribution;
- measure first- and second-derivative change;
- measure curvature emergence;
- classify how much finer-level information is genuinely present versus interpolation;
- separate canonical/Gen311 signal from any proposed synthetic residual.

## Decision gate
CASE 1 — meaningful native residual exists below 8 units:
Expose that signal using adaptive/error-driven representation.

CASE 2 — native residual is negligible:
Do not continue uniform subdivision. Design a bounded deterministic geometric-residual layer derived from existing terrain causality (ridge/valley/watershed/foothill/drainage/exposure), with explicit amplitude and frequency ceilings.

CASE 3 — native residual exists only in specific terrain classes:
Use terrain-class/error-driven refinement and residual generation only where warranted.

## Explicitly rejected next moves
- another blind uniform 4-unit patch;
- increasing startup timeout;
- adding arbitrary boulders/trees as a realism substitute;
- adding more shader noise to conceal geometry;
- changing canonical geography to solve representation quality;
- combining water, atmosphere, shadows, and geometry in one pass.

## External-audit conclusion
The Phase 3 failure is consistent with mature terrain-rendering practice. The missing question is not simply mesh density; it is whether H-Earth has meaningful fine-scale elevation information for denser geometry to represent. The internal frequency/residual audit is therefore the correct next deterministic operation.
