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
