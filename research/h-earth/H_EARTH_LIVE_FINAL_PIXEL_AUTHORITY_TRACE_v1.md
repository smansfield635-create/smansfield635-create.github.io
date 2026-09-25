# H-Earth Live Final-Pixel Authority Trace v1

MODE: READ-ONLY FINDINGS / DURABLE TRACE
SOURCE AUTHORITY: `7c692cef3888d065f856b2a8a8c001cfa1679f2a`
PUBLIC ROUTE: `/showroom/globe/h-earth/`
PRODUCT MUTATION: NONE

## Purpose
Identify, without altering product behavior, the exact existing authority chain that turns canonical H-Earth terrain truth into the pixels visible in the accepted live environment. This trace exists to prevent further speculative edits and replacement-renderer drift.

## Executive finding
The current live terrain's final visible appearance is controlled primarily by the existing persistent WebGL2 renderer's terrain branch, not by a missing external renderer.

The critical final-pixel authority is:

`showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`

The public route defaults to `?visual=terrain-relief-v2`. The live GPU binding sees that query and dynamically selects the file above.

This renderer already contains procedural terrain micro-normal perturbation, slope/elevation palette logic, multiple procedural face bands, contour darkening, presentation-specific manor/cavern/ravine coloration, direct sun, ambient term, rim light, specular, fog, desaturation and haze. Therefore the next realism work is not a new renderer. It is a bounded replacement/refinement of the terrain fragment-shading branch already drawing the live pixels.

## Authority chain

### 1. Public route
`showroom/globe/h-earth/index.html`

Default presentation sets `visual=terrain-relief-v2` unless an explicit renderer diagnostic is requested.

It loads:
`functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js`

### 2. Public integration
`showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.receipt.js`

Loads the arrival/startup observer and then:
`public-live-gpu-integration.run8e-r3e.js`

### 3. Canvas/runtime integration
`showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js`

Acquires the existing live canvas and creates the R3D3 live GPU binding. Camera/navigation proposals flow through this binding; no world rebuild is required for camera movement.

### 4. Renderer selection
`showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js`

Selection law:
- `visual=terrain-relief-v2` → `persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`
- absent diagnostics → accepted baseline renderer.

The public HTML default means the terrain-relief-v2 renderer is the active visible authority in the accepted live presentation.

### 5. Canonical live render package
`showroom/globe/h-earth/render/live-render-package.run8e-r2.canonical.js`
→ `live-render-package.run8e-r2.js`

The package contains immutable arrays for:
- positions
- normals
- baseColorsLinear
- materialParameters
- materialModelCodes
- surfaceClassCodes
- primitiveIndices
- roleCodes
- indices

Terrain is role `TERRAIN` and receives the Run8C intrinsic terrain material model.

### 6. Terrain material authority before GPU
`h-earth-3d/environment/h-earth.successor-surface-material.run8c.js`

For every terrain vertex the package samples:
`sampleHEarthRun8CSuccessorSurfaceMaterial(x,z)`

Existing material channels include:
- base color
- roughness
- reflectance
- wetness
- water saturation
- rock exposure
- soil depth
- slope pressure
- curvature pressure
- ridge/pass/valley/watershed/foothill response
- drainage retention
- orographic exposure
- meso/local nonperiodic variation

Important: these channels already exist. The renderer currently underuses several of them. `vMaterialParameters` carries roughness, reflectance, wetness and curvature, but the final shader mostly collapses them into a small generic `materialSignal` rather than physically differentiating terrain response.

### 7. GPU transport
`showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js`

This stage canonicalizes normals/material parameters for Float32 transport. It explicitly declares:
- materialRetuning: false
- normalRetuning: false
- transportEncodingOnly: true

Therefore this is not the correct realism-edit authority.

It does contain a bounded water color projection and remaps shoreline role code 2 → 4 to bypass a hardcoded water override. That is relevant to a later water pass, not the first terrain-material pass.

### 8. Final terrain vertex shader
Active renderer:
`persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`

Vertex shader passes existing world position, normal, base color, material parameters, material model, surface class, primitive index and role code unchanged to the fragment shader.

There is no hidden terrain tessellation or geometry modification here.

### 9. Final terrain fragment shader — PRIMARY REALISM AUTHORITY
The terrain branch is `if(vRoleCode==1u)`.

It currently performs all of the following:

#### Existing micro-normal system
Functions:
- `perturbTerrainNormal(...)`
- `limitTerrainNormalDeviation(...)`

Three periodic micro directions generate `microReliefHeight`.
Deviation is hard-limited to 22 degrees.
Distance and antialias envelopes suppress the effect with distance.

This is the exact existing location for high-frequency normal realism. No new renderer is required.

#### Existing palette system
The shader defines generic:
- lowland
- upland
- rock

It blends by elevation and slope, then applies procedural noise and bands.

#### Existing procedural surface treatment
The live shader already contains:
- broad/medium/grain noise
- macro/meso/detail fields
- strata
- cross-grain
- faceBandA/B/C
- crest signal
- terrace signal
- contour lines
- slope rake

This explains the painted/cartoon failure mode: substantial visual structure is being encoded as multiplicative color bands rather than physically plausible material/normal response.

#### Existing scene-specific painted features
The terrain shader also paints presentation responses around:
- manor
- cavern
- ravine/route

These are color/contact treatments in the final shader, not necessarily independent physical geometry.

This is a major realism risk: final terrain color is carrying semantic scene structure that should not dominate geological surface response.

### 10. Existing lighting
After terrain shading:
- geometric diffuse and relief-normal diffuse are mixed
- relief contribution is clamped to ±0.28 around geometric diffuse
- terrain specular exponent = 18
- terrain specular gain = 0.07–0.14
- ambient = 0.26 + upward-normal term + materialSignal
- directional gain = 0.90
- rim gain = 0.18

No true shadow map exists in this renderer.
No ambient-occlusion pass exists in this renderer.
No triplanar texture sampling exists in this renderer.
No environment map exists in this renderer.

### 11. Atmosphere
Canonical source:
`h-earth-3d/environment/h-earth.atmosphere-state.js`

Current defaults include:
- default time: 15.25
- view distance: 3328
- fog start: 640
- fog falloff: 0.00065
- max fog: 0.82
- distance desaturation: 0.34

The renderer further scales terrain fog to 0.54 and mixes haze at 0.48 of fog.

Atmosphere is downstream of terrain lighting. It should not be the first edit target.

### 12. Draw path
Renderer initialization compiles the existing VS/FS once and uploads the canonical package once.

Each frame:
- binds geometry framebuffer
- clears color/depth
- enables depth test
- disables culling
- updates only camera uniforms
- iterates existing draw ranges
- draws indexed triangles
- presents the color frame

This proves the live terrain pixels are produced directly by this shader/program. There is no later terrain material compositor hiding its output.

## Why prior geometry experiments were low-yield
Geometry changes occur upstream of:
- Run8C material sampling
- GPU packaging
- the extremely strong procedural terrain fragment branch
- fog/haze

The final terrain shader adds enough patterned coloration and bounded normal perturbation that modest morphology changes can remain visually subordinate. This is consistent with the repeated baseline-identical inspections.

## Exact first construction target
Do NOT alter:
- canonical terrain geometry
- landscape-preview relief
- GPU upload transport
- camera
- controls
- coastline
- water
- atmosphere
- public integration
- renderer selection
- route
- loading system

Modify only the existing `vRoleCode==1u` terrain branch in:
`persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`

First pass should:
1. preserve geometry and existing material inputs;
2. reduce/remove contour, stripe and face-band color dominance;
3. use existing roughness/reflectance/wetness channels directly in specular response;
4. replace strongly periodic micro-normal waves with multi-scale nonperiodic normal detail derived from the existing noise functions;
5. strengthen slope-driven rock exposure without painting horizontal bands;
6. preserve the current sun/atmosphere contract initially;
7. make the result intentionally visible enough for direct A/B inspection.

## Subsequent bounded passes
Only after the first material/normal pass visibly improves the real route:
- add triplanar material-space projection inside the same terrain shader;
- add bounded shadow architecture;
- add AO/contact depth;
- tune atmosphere;
- then address water optics separately.

## Non-targets
The standalone Gen-2 renderer, bridge renderer, diagnostic loading-screen experiments and replacement-shell work are not part of this trace or the next live realism pass.

## Deterministic conclusion
The repository already has the correct insertion point for the next realism experiment. The active live terrain fragment shader is the final visible authority. The next cycle should modify that existing shader branch directly, with geometry frozen.


# Web Cross-Reference Addendum v1

## Scope
Cross-reference the repository final-pixel trace against established terrain-rendering practices audited from NVIDIA GPU Gems, Three.js documentation, and Cesium terrain/atmosphere documentation. This addendum does not change product code.

## Finding matrix

### A. High-frequency normal detail
External precedent: GPU Gems 2 geometry clipmaps explicitly uses a normal map at twice the geometric resolution because one normal per terrain vertex is too blurry. It also describes GPU-synthesized residual detail and normal updates.

Repository state: the active terrain fragment shader already has derivative-based micro-normal perturbation, but it is synthesized from three strongly periodic sine directions, distance-suppressed, and hard-limited to 22 degrees.

Cross-reference: architecture is directionally correct (fine shading detail independent of geometry), implementation is the weak point. Replace periodic wave relief with nonperiodic/multiscale detail before increasing geometry.

Disposition: FIRST-PASS TARGET.

### B. Terrain material projection / triplanar
External precedent: GPU Gems 3 identifies planar projection stretching on arbitrary terrain and recommends triplanar projection blended by surface normal; bump vectors can be blended in the same pass.

Repository state: active terrain shader has no texture/triplanar projection. It creates perceived geology mainly through procedural color multiplication (strata, face bands, contour, rake).

Cross-reference: current painted-band approach is not equivalent to mature terrain material projection and plausibly explains the stylized/train-set read.

Disposition: SECOND PASS, after proving direct material/normal authority.

### C. Physically meaningful roughness/reflectance
External precedent: modern PBR practice uses per-fragment roughness and physically based light/material response; Three.js MeshStandardMaterial documents roughness and environment contribution as central material inputs.

Repository state: Run8C already computes roughness, reflectance, wetness and other causal material channels per terrain vertex and uploads them as vMaterialParameters. Active shader reduces them mostly to a generic materialSignal; terrain specular remains largely fixed by exponent/gain constants.

Cross-reference: H-Earth already owns much of the data needed for a better material model. New upstream material architecture is unnecessary for the first pass.

Disposition: FIRST-PASS TARGET. Consume existing channels rather than inventing replacements.

### D. Terrain normals + directional light
External precedent: Cesium terrain uses vertex normals specifically for terrain lighting and relief readability. Its terrain examples emphasize directional/hillside lighting to expose peaks and valleys.

Repository state: normals and a canonical sun already reach the final shader; diffuse is computed, but terrain relief lighting is clamped to ±0.28 around geometric diffuse and mixed with strong painted palette operations.

Cross-reference: the core ingredients already exist. First pass should make normal-driven light carry more of the perceived form while reducing painted form cues.

Disposition: FIRST-PASS TARGET.

### E. Shadows
External precedent: CSM is an established large-scene shadow technique; Three.js exposes cascades/frustum splitting specifically for WebGLRenderer.

Repository state: active raw WebGL2 renderer has depth testing and a depth texture used for diagnostics/presentation, but no terrain shadow-map sampling in the final terrain fragment shader.

Cross-reference: lack of cast shadows is a real realism gap, but adding CSM/shadow architecture is a larger renderer change than the first material/normal proof.

Disposition: DEFER until first direct shader pass proves improvement.

### F. Ambient occlusion/contact depth
External precedent: GTAO/SSAO-style ambient occlusion is used to reinforce contact and local depth; current Three.js docs characterize GTAO as higher quality but more expensive than SSAO.

Repository state: H-Earth uses hand-authored/procedural presentationContact terms for manor/cavern/ravine and darkens those areas, but there is no general geometry-derived AO pass.

Cross-reference: current contact darkening is semantic/procedural rather than general physical depth evidence.

Disposition: DEFER. Later replace/reduce semantic contact painting with geometry-derived AO if performance permits.

### G. Atmosphere
External precedent: Cesium treats atmosphere as a realism and distance cue, but also documents cases where fog/atmosphere can obscure terrain relief; lighting and normals remain essential for readable terrain.

Repository state: H-Earth already has a coherent atmosphere authority and applies fog, desaturation and haze downstream of terrain lighting.

Cross-reference: atmosphere is not missing. It should remain frozen during the first shader pass so terrain-material changes can be judged without confounding haze changes.

Disposition: FREEZE FIRST PASS; tune later.

### H. Water separation
External precedent: Cesium treats water effects separately using water masks and normal-driven waves/specular response.

Repository state: H-Earth already separates shoreline/water primitives and R2D contains a dedicated coast-distance water optical projection. GPU role remapping intentionally bypasses an older hardcoded water override.

Cross-reference: water should not be folded into the terrain-material experiment.

Disposition: FREEZE FIRST PASS; independent later pass.

### I. Geometry LOD
External precedent: GPU geometry clipmaps use nested regular grids to maintain approximately screen-space-uniform triangle sizes and allow runtime synthesis.

Repository state: current live package uploads immutable geometry once; camera movement does not rebuild terrain. No geometry clipmap LOD exists.

Cross-reference: this may become relevant for close-range geometric fidelity, but it is not required to test whether final-frame shading is the present realism bottleneck.

Disposition: DEFER until material/normal/shadow work establishes remaining geometric deficit.

## Cross-referenced construction order
1. Existing active terrain fragment branch only.
2. Replace periodic micro-normal waves with nonperiodic multiscale shading detail.
3. Consume existing Run8C roughness/reflectance/wetness materially.
4. Reduce contour/face-band/stripe color dominance.
5. Preserve existing geometry, camera, water, atmosphere, controls and route.
6. Direct A/B physical inspection.
7. If successful, add triplanar material projection.
8. Then evaluate cast shadows/CSM-equivalent architecture.
9. Then geometry-derived AO/contact depth.
10. Then atmosphere tuning.
11. Then water optics.
12. Only then determine whether geometry LOD/clipmaps are still necessary.

## Cross-reference conclusion
The web audit and repository trace converge on the same diagnosis: H-Earth does not need another renderer to begin improving realism. Its active renderer already has the correct final-pixel insertion point and already receives normals, sun state and rich material channels. The immediate defect is how those inputs are converted into terrain appearance: procedural color bands dominate, existing material channels are underused, and fine normal detail is periodic rather than naturalistic.

The smallest evidence-producing next mutation is therefore a one-file, terrain-fragment-branch-only rewrite with all upstream geometry and downstream atmosphere held constant.
