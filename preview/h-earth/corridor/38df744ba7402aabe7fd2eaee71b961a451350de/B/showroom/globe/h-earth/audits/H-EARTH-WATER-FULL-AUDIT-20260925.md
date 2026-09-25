# H-Earth Water Systems — Full Repository Audit
## 2026-09-25

## Scope
Read-only audit of the water-related H-Earth code in the accepted working lineage and its active WebGL presentation path. Covers canonical water state, shoreline classification and geometry, continuous ocean representation, 23923 optical/color recovery, foam-contact geometry, GPU transport/canonicalization, renderer role attribution, water presentation contracts, renderer selection/query routing, CP2 / Phase-5 execution, and the failed water-motion candidates.

Main/live is not modified and this audit does not authorize merging any water candidate.

## Executive finding
H-Earth already contains a substantially complete water definition stack: canonical water-body identity, shoreline-distance classification, depth/flow/wave parameters, foam intensity, continuous-ocean geometry, preserved 23923 coast-distance color anchors, deterministic GPU transport, and a presentation contract that explicitly defines deterministic water motion.

The primary failure is runtime coupling. The accepted GPU transport deliberately remaps canonical shoreline role code 2 to GPU role code 4 so the active CP2 fragment shader will not enter its hard-coded teal water branch. That role-2 branch is therefore not the authoritative visible water path.

This directly explains both failed motion candidates:
- 9fe915d modified persistent-live-renderer.run8e-r3c.js, which the authoritative inspection path does not execute.
- 7486bace modified the active CP2 renderer, but inserted temporal behavior inside vRoleCode==2u.
- Canonical water is remapped from source role 2 to GPU role 4 before the shader runs.
- Therefore the new temporal branch is bypassed by canonical visible water.

The physical-device observation that the inspection remained still is consistent with the repository control flow.

Conclusion: v2 is a correctly scoped but incorrectly attributed water-motion experiment. It must not be merged. The next candidate must animate the actual GPU role-4 water path while preserving canonical uploaded colors and all water geometry.

## 1. Canonical water state
Source: h-earth-3d/environment/h-earth.water-state.js
Contract: H_EARTH_CANONICAL_WATER_STATE_RUN_7D_v1
Water body: H_EARTH_COASTAL_OCEAN_001

Declared classes:
- NO_WATER
- SHORELINE_CONTACT
- SHALLOW_WATER
- NEARSHORE_WATER
- OPEN_WATER

The state contract owns water-body identity, water-surface elevation, bed correspondence, depth, flow, waves, turbidity, shoreline transfer, foam intensity, and underwater state.

Existing motion profiles:
| Class | Flow | Wave amplitude | Wave frequency | Foam base |
|---|---:|---:|---:|---:|
| SHORELINE_CONTACT | 0.08 | 0.08 | 0.62 | 0.88 |
| SHALLOW_WATER | 0.18 | 0.18 | 0.50 | 0.54 |
| NEARSHORE_WATER | 0.28 | 0.34 | 0.40 | 0.20 |
| OPEN_WATER | 0.36 | 0.52 | 0.30 | 0.05 |

Wave direction already derives from atmospheric wind plus shoreline waterward normal. Flow direction derives from shoreline tangent plus waterward normal.

Status: DEFINED; not currently the active renderer animation driver.

## 2. Shoreline geometry
Source: render/geometry-shoreline.js
Contract: H_EARTH_FUNCTIONAL_SHORELINE_GEOMETRY_PROVIDER_COASTAL_CONTINUITY_v2

Defined bands include FOAM_CONTACT, SHALLOW_WATER, NEARSHORE_WATER, and OPEN_WATER.

Waterward bands are bounded approximately as:
- shallow: 3.2 to 22 units
- nearshore: 22 to 58 units
- open: 58 to 320 units

Canonical 23923 optical anchors:
- shallow RGB 58,168,181
- shelf RGB 31,116,154
- deep RGB 15,57,96

Finite shoreline water ribbons deliberately delegate visible ocean presentation to the continuous-ocean representation.

Status: COMPLETE and correctly decomposed.

## 3. Continuous ocean
Source: render/geometry-distant-context.js

The distant-context representation constructs a continuous ocean field using world-space sampling rather than a finite radial patch.

Declared protections include:
- one continuous ocean surface
- distance-from-canonical-coast optical law
- preserved 23923 anchors
- world-space near-coast tessellation
- ocean underlay to close representation gaps
- no lateral color termination
- no visible rectangular termination
- continuous ocean to geometric horizon

Ocean vertices derive from the world manifold and pass through the spherical presentation frame.

Status: COMPLETE and structurally sound.

The ocean surface does not need replacement geometry merely to obtain motion.

## 4. Foam/contact layer
Source: render/geometry-foam.js

The foam provider is tied to the exact environment-owned shared shoreline boundary. It constructs a shoreline foam ribbon from shared shoreline samples and derives waterward offsets from canonical shoreline orientation.

The foam primitive is not an independent geography authority and cannot redefine the coast.

Status: COMPLETE as a contact representation.

Gap: temporal foam animation is not established in the accepted visible renderer. Geometry exists, but the active shader has no time-varying foam term.

## 5. Canonical optical/color transport
Source: render/gpu-upload-views.run8e-r2d.js

The GPU upload layer explicitly restores 23923 coast-distance optics on the active WebGL path.

It projects colors for:
- H_EARTH_FUNCTIONAL_SHORELINE:SHALLOW_WATER
- H_EARTH_FUNCTIONAL_SHORELINE:NEARSHORE_WATER
- H_EARTH_FUNCTIONAL_SHORELINE:OPEN_WATER
- H_EARTH_WORLD_MANIFOLD:FAR_OCEAN_CONTINUATION

It reconstructs RGB from canonical shoreline distance and writes the result into baseColorsLinear.

It explicitly declares:
- source package mutation false
- geometry mutation false
- material retuning false
- normal retuning false
- deterministic transport encoding true

Status: COMPLETE and should remain frozen.

### Critical role remapping
The same GPU transport contains projectGpuRoleCodes(source). For every source role code it applies:
source code 2 -> GPU code 4.

The receipt records:
- source shoreline role code: 2
- GPU depth/color-preserving role code: 4
- semantic package role mutation: false

Its stated purpose is BYPASS_CP2_HARDCODED_TEAL_WATER_OVERRIDE.

This is the decisive finding in the animation failure.

## 6. Active CP2 fragment shader
Source: render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js

The fragment shader contains a water-specific branch for vRoleCode==2u. That branch contains a static spatial sine wave and hard-coded teal colors.

But GPU upload changes canonical water role code 2 to role code 4 before upload.

Therefore canonical visible water does not enter that role-2 branch.

The role-2 branch is effectively a legacy/diagnostic path for the active canonical water transport, not the authoritative visible water implementation.

### Consequence for 7486bace
7486bace added temporal phase, wave mixing, and animated-normal logic inside the same vRoleCode==2u branch.

Because canonical water is uploaded as role 4, the candidate's new code is not executed for canonical water.

This is the direct root cause of the still-frame inspection.

The frame counter and uniform transport were not the primary failure. Branch attribution was.

## 7. Renderer frame timing
The CP2 renderer already has a deterministic frame counter:
- frameCount starts at zero
- renderFrame completes draw ranges
- frameCount increments after the draw
- presentColorFrame blits the geometry framebuffer to the visible framebuffer

The live binding also maintains a frame sequence and passes it into the renderer.

Status: PRESENT and suitable for water motion.

A new animation loop, framebuffer, or renderer-selection architecture is not required.

## 8. Authoritative renderer selection
Exact inspection query:
microrelief=v1&visual=terrain-relief-v2

The live binding selects:
persistent-live-renderer.run8e-r3c.phase5-microrelief-v1.js

Phase 5 imports:
persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js

and delegates renderFrame directly to CP2.

Active chain:
authoritative query → Phase 5 → CP2 renderer → GPU upload views → GPU role/color buffers → fragment shader → geometry framebuffer → visible presentation

This confirms:
- 9fe915d modified the wrong renderer file.
- 7486bace modified the correct renderer file but the wrong water role branch.

## 9. Water presentation adapter
Source: render/environment-water.js
Contract: H_EARTH_LOW_COST_WATER_PRESENTATION_RUN_7D_v1

The adapter declares:
- depth-sensitive water color
- shoreline foam modulation
- deterministic water surface motion
- horizon-consistent water extent
- underwater presentation classification

computeHEarthWaterWavePhase already accepts time and computes spatial phase, temporal phase, normalized sine offset, and surface presentation offset.

It explicitly does not own the renderer loop.

This architecture is correct: water state defines behavior; renderer consumes it.

However, the accepted WebGL renderer does not currently consume this presentation adapter's wave result.

Status: DEFINED but not wired to active runtime.

## 10. Water subsystem status
| Subsystem | Status |
|---|---|
| Water-body identity | PASS |
| Water classes | PASS |
| Shoreline relationship | PASS |
| Shoreline bands | PASS |
| Continuous ocean | PASS |
| Horizon continuity | PASS |
| 23923 colors | PASS / FROZEN |
| Deterministic GPU transport | PASS |
| Foam geometry | PASS |
| Flow definition | PASS |
| Wave definition | PASS |
| Deterministic frame timing | PASS |
| Active renderer identification | PASS |
| Visible temporal water motion | GAP |
| State-to-renderer wave wiring | GAP |
| Animated foam | GAP |
| Depth-responsive animated normal | GAP |
| Underwater rendering | DEFINED; runtime coverage unverified |
| Water interaction/ripples | NOT IMPLEMENTED |

## 11. External standards cross-check
Current rendering documentation supports separating water surface representation from material/shading behavior, using GPU-driven or procedural wave behavior for macro motion, and using material-level normal detail for fine motion. Epic's documentation also describes continuous water meshes, water-body transitions, depth-related wave attenuation, and wave assets that drive surface behavior.

Sources:
- NVIDIA GPU Gems, Effective Water Simulation: https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models
- Epic Water Meshing System and Surface Rendering: https://dev.epicgames.com/documentation/unreal-engine/water-meshing-system-and-surface-rendering
- Epic Water Body Actors: https://dev.epicgames.com/documentation/en-us/unreal-engine/water-body-actors
- Epic Simulating Waves Using the Water Waves Asset: https://dev.epicgames.com/documentation/en-us/unreal-engine/simulating-waves-using-the-water-waves-asset

These standards support preserving H-Earth's existing water geometry and adding temporal presentation at the shader/material layer before introducing large geometric displacement.

## 12. Root-cause chain
### Candidate 9fe915d
Modified persistent-live-renderer.run8e-r3c.js.
Problem: authoritative inspection uses Phase 5 → CP2, so that file is bypassed.
Result: no visible change.

### Candidate 7486bace
Modified persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js.
That is the correct renderer.
But temporal logic was inserted into vRoleCode==2u.
GPU upload converts canonical water role 2 → 4.
Result: canonical visible water bypasses the new temporal branch and remains visually static.

## 13. Required next implementation boundary
The next candidate should be a clean child of 53305f5dfcdce51406363cba21c665d4e44701ad with the accepted environment frozen.

Preserve:
- water geometry
- shoreline geometry
- continuous ocean geometry
- 23923 color anchors
- GPU color projection
- GPU role remapping
- renderer identity
- Phase-5 selection
- framebuffer architecture
- terrain and meso
- vegetation
- navigation
- atmosphere

Add only:
1. deterministic temporal treatment to the active canonical water role-4 path;
2. bounded world-space wave phase;
3. subtle animated normal perturbation;
4. restrained luminance/specular modulation;
5. no replacement of uploaded water base color;
6. no geometry displacement initially.

The canonical water-state wave direction and frequency should ultimately become the source of truth rather than inventing an unrelated second water model.

## 14. Physical acceptance gates
The next candidate must demonstrate on the physical device:
1. same H-Earth terrain and coastline;
2. same established water color progression;
3. visible water evolution while camera is stationary;
4. subtle rather than diagnostic-looking motion;
5. motion during traversal;
6. stable shoreline contact;
7. no moving coastline;
8. no rectangular ocean termination;
9. no horizon shimmer;
10. no large-scale water displacement;
11. no vegetation or terrain regression;
12. no renderer-path change;
13. no new framebuffer/resource architecture;
14. no main/live promotion before physical acceptance.

## 15. Final disposition
Water definition is not the problem. Water runtime attribution is the problem.

The repository already contains enough water infrastructure to support the next layer:
canonical water state → shoreline relationship → continuous ocean → canonical optical transport → deterministic frame timing → active WebGL renderer.

The missing link is:
canonical GPU role-4 water → temporal shader treatment.

The failed inspection was diagnostically useful because it exposed a deeper coupling missed by the earlier audit.

Disposition: WATER DEFINITION CLOSED; WATER TEMPORAL PRESENTATION OPEN.

No production/live change is authorized by this audit.
