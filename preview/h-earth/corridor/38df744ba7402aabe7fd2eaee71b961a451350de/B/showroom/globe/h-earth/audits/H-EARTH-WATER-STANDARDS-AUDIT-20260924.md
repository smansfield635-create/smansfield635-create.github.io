# H-Earth Water Standards Audit — 2026-09-24

Status: DURABLE READ-ONLY AUDIT  
Repository: `smansfield635-create/smansfield635-create.github.io`  
Audit branch: `h-earth/water-standards-audit-20260924`  
Audit base: `53305f5dfcdce51406363cba21c665d4e44701ad`  
Live/main mutation: NONE

## 1. Audit purpose

Establish a durable external-standard crosswalk for the H-Earth water layer before any water implementation work.

Primary constraint:

> Preserve the existing H-Earth water definition and established colors. Improve animation/motion before considering any replacement of the water definition.

The audit therefore distinguishes:

1. water geometry/topology,
2. water optical/color authority,
3. real-time animation,
4. reflection/Fresnel behavior,
5. refraction/distortion,
6. physical-device/performance constraints.

The target is not to make H-Earth conform to another engine's water system. The target is to determine which established real-time water practices are already satisfied by H-Earth and which can be added without disturbing its existing visual authority.

---

## 2. External standards / established real-time practice

### A. Dynamic surface motion

NVIDIA GPU Gems describes real-time water simulation using geometric undulation of a base mesh combined with a dynamic normal map.

Source:
https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models

Relevant standard:
- A water surface may remain the same underlying surface while time-varying wave structure supplies motion.
- Geometry motion and/or dynamic normals are established real-time techniques.
- GPU execution is appropriate for repeated water-surface evaluation.

H-Earth implication:
- We do not need to replace the existing water mesh to make it feel alive.
- A time-varying shader signal applied to the existing water surface is a standards-aligned first candidate.

### B. Fresnel response

Epic's material documentation describes the characteristic Fresnel behavior of water: reflection becomes stronger at grazing/view-parallel angles and weaker when viewed more directly.

Source:
https://dev.epicgames.com/documentation/unreal-engine/using-fresnel-in-your-unreal-engine-materials

Relevant standard:
- Water reflection should vary with view angle rather than behave as a uniformly reflective surface.
- Normal variation can modulate the Fresnel response.

H-Earth implication:
- The current renderer already has camera position, surface normal, sun/sky inputs, and a water material path.
- Fresnel-style modulation can be introduced without changing the canonical water color anchors, provided it is treated as a bounded lighting/reflection contribution rather than a palette replacement.

### C. Refraction / surface distortion

Epic documents refraction as the optical bending of light at a water/air boundary and specifically discusses normal-map-driven refraction.

Sources:
https://dev.epicgames.com/documentation/en-us/unreal-engine/using-refraction?application_version=4.27
https://dev.epicgames.com/documentation/en-us/refraction-using-pixel-normal-offset?application_version=4.27

Relevant standard:
- Surface normals can drive localized distortion.
- Large flat water surfaces require care because naive physical refraction can cause screen-edge/off-screen artifacts.

H-Earth implication:
- Refraction is a later layer, not the first motion requirement.
- If introduced, it must be bounded and mobile-safe.
- It must not become a prerequisite for making the existing water animate.

### D. Real-time reflection cost/quality tradeoff

Epic's reflection documentation notes that dynamic reflection methods can be expensive and that the appropriate reflection method depends on quality requirements and target platform.

Source:
https://dev.epicgames.com/documentation/en-us/unreal-engine/reflections-environment-in-unreal-engine

Relevant standard:
- Reflection quality must be selected in relation to target hardware.
- Flat reflective surfaces expose reflection inaccuracies more readily.
- Roughness/normal detail can help avoid harsh reflection artifacts.

H-Earth implication:
- Full dynamic planar/environment reflection is not justified merely to animate the existing water.
- A bounded Fresnel/specular treatment is a lower-risk first step.
- Mobile physical-device inspection remains authoritative.

### E. Water as a distinct surface layer

Epic's water-system documentation separates the water surface mesh from its surface material/behavior and describes interaction between the water surface and surrounding terrain.

Source:
https://dev.epicgames.com/documentation/en-us/water-system-in-unreal-engine

Relevant standard:
- Water has a spatial surface definition.
- Its rendering/material behavior is distinct from the underlying terrain.
- Water/terrain interaction is an explicit relationship.

H-Earth implication:
- H-Earth already has a stronger version of this separation: canonical terrain/shoreline definitions feed derived water presentation rather than water inventing geography.

### F. GPU-friendly optical effects

NVIDIA's water-caustics work emphasizes per-pixel techniques that decouple some water visual detail from geometric complexity.

Source:
https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-2-rendering-water-caustics

Relevant standard:
- Some water appearance can be produced in the fragment stage rather than by increasing mesh complexity.
- Visual detail should not automatically require additional surface geometry.

H-Earth implication:
- This strongly supports an animation-first shader treatment over a new water mesh.
- Existing topology should remain frozen while motion is evaluated in the GPU.

---

## 3. Repository crosswalk

### 3.1 Canonical geography / shoreline — PASS

Repository evidence:

`showroom/globe/h-earth/h-earth-3d/terrain/h-earth.world-manifold-domain.js`

Commit/base:
`53305f5dfcdce51406363cba21c665d4e44701ad`

The world-manifold contract declares:
- one canonical geographic field,
- one continuous world manifold,
- topology-preserving LOD,
- ocean-sector classification,
- water sampling through the canonical terrain field.

The water layer therefore does not independently invent the coastline.

### 3.2 Shoreline bands — PASS

Repository evidence:

`showroom/globe/h-earth/render/geometry-shoreline.js`

The current definition explicitly declares:
- dry sand,
- damp transition,
- wet sand,
- foam contact,
- shallow water,
- nearshore water,
- open water.

The water bands are derived from the canonical shoreline and carry explicit material references.

The visible water ribbon itself is intentionally not the final water authority; the contract delegates visible ocean presentation to the continuous ocean.

### 3.3 Continuous ocean — PASS

Repository evidence:

`showroom/globe/h-earth/render/geometry-distant-context.js`

The current implementation declares:
- `ONE_CONTINUOUS_OCEAN_SURFACE`,
- world-space continuous ocean field,
- canonical-coast distance optical law,
- preserved historical 23923 color anchors,
- no lateral color termination,
- prohibition on visible rectangular termination,
- derived representation only.

This is directly aligned with the standard that water should be a coherent surface rather than disconnected decorative patches.

### 3.4 Existing color authority — PASS / FROZEN

Repository evidence:

`showroom/globe/h-earth/render/geometry-shoreline.js`

Current optical anchors are:

- shallow: RGB `[58, 168, 181]`
- shelf: RGB `[31, 116, 154]`
- deep: RGB `[15, 57, 96]`

The GPU upload layer explicitly identifies this as:

`RESTORE_23923_COAST_DISTANCE_OPTICS_ON_ACTIVE_WEBGL_PATH`

and declares:
- source package mutation: false,
- geometry mutation: false,
- material retuning: false,
- transport-encoding-only behavior.

**Audit requirement:** these three anchor colors remain immutable visual authority for future water work.

### 3.5 Deterministic GPU transport — PASS

Repository evidence:

`showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js`

The water optical projection is performed into the active WebGL GPU base-color view without mutating the source package.

This is a strong architectural fit for animation because a future time-varying signal can operate on the shader's water response while the canonical base color remains fixed.

### 3.6 Water semantic attribution — PASS

Repository evidence:

`showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.water-index-span-attribution-v1.js`

The renderer identifies four water primitive IDs:

- `H_EARTH_FUNCTIONAL_SHORELINE:SHALLOW_WATER`
- `H_EARTH_FUNCTIONAL_SHORELINE:NEARSHORE_WATER`
- `H_EARTH_FUNCTIONAL_SHORELINE:OPEN_WATER`
- `H_EARTH_WORLD_MANIFOLD:FAR_OCEAN_CONTINUATION`

This establishes that water is already addressable as a distinct rendering semantic.

### 3.7 Existing animated-water mechanism — PROTOTYPE EXISTS / NOT BASELINE

The same water-attribution renderer contains a time-varying `uOceanProofPhase` uniform and derives:

- broad wave,
- cross wave,
- capillary wave,
- animated noise,
- composite wave,
- Fresnel response,
- broken crest/foam response.

The runtime advances phase deterministically from frame sequence.

This is important: **the repository already contains an implementation pattern capable of putting the existing water surface into motion.**

However, it is not the accepted baseline renderer. It lives behind the diagnostic `water-index-span=v1` path and is explicitly a proof/attribution renderer.

Therefore:

- animation capability: **PROVEN IN A DIAGNOSTIC CARRIER**
- accepted production water animation: **NOT YET QUALIFIED**
- visual authority: **DO NOT inherit the diagnostic palette as-is**

The diagnostic water shader currently introduces its own hard-coded colors, including approximately `[19,102,122]` and `[5,29,52]`. Those are **not** the canonical H-Earth optical anchors and therefore must not become the new water palette.

### 3.8 Accepted baseline renderer — STATIC WATER — GAP

Repository evidence:

`showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js`

The accepted baseline renderer's fragment shader uses the uploaded water base color and role-dependent lighting but contains no water-specific time phase, wave deformation, or dynamic normal term.

Therefore the current accepted baseline satisfies:

- water geometry: yes
- water semantic separation: yes
- water color authority: yes
- static shading: yes
- animated water surface: **no**

This is the clearest current standards gap.

---

## 4. Standards matrix

| Area | External standard | H-Earth status | Disposition |
|---|---|---|---|
| Canonical water surface | coherent water surface tied to terrain | PASS | Preserve |
| Shoreline relationship | water derived from terrain/coast | PASS | Preserve |
| Depth/color continuity | continuous optical law | PASS | Preserve |
| GPU execution | water detail suitable for shader execution | PASS | Preserve |
| Dynamic surface signal | time-varying waves/normals | PROTOTYPE EXISTS | Promote carefully |
| Fresnel | view-angle-dependent response | PROTOTYPE EXISTS | Qualify after motion |
| Refraction | bounded surface distortion | NOT QUALIFIED | Later |
| Dynamic reflection | platform-aware reflection | NOT REQUIRED YET | Later |
| Fluid simulation | physically simulated fluid | NOT PRESENT | Not required for current objective |
| Mobile performance | bounded GPU cost / physical inspection | ARCHITECTURE READY, VISUAL QUALIFICATION PENDING | Required gate |

---

## 5. What the audit says we should actually do

The standards do **not** require us to rebuild H-Earth water.

The repository evidence points to a much narrower next step:

### Candidate W1 — animate the existing definition

Start from the accepted H-Earth baseline and make exactly one visual change:

**add bounded, world-space time variation to the existing water shading while retaining the existing base-color projection and all three canonical color anchors.**

The first candidate should preferably:

1. leave water geometry unchanged;
2. leave shoreline geometry unchanged;
3. leave water primitive identity unchanged;
4. leave the three RGB anchors unchanged;
5. leave the existing depth/coast-distance color law unchanged;
6. add a low-amplitude, world-space phase signal;
7. use that signal primarily for normal/specular/Fresnel modulation;
8. avoid hard-coded replacement water colors;
9. avoid new reflection buffers;
10. avoid refraction initially;
11. avoid new draw classes;
12. remain deterministic from frame time/sequence;
13. be inspected on the physical device.

The diagnostic renderer is useful as evidence for the motion mechanism, but its water palette must **not** be copied into the accepted baseline.

---

## 6. First deficiency identified

**The water definition itself is substantially complete. Its principal standards gap is temporal behavior.**

In other words:

> H-Earth already has the water. It does not yet have the water moving in the accepted baseline.

This supports the user's proposed direction: **animate the existing definition before changing the definition.**

That is lower-risk than another geometry rebuild and is directly supported by established real-time water-rendering practice.

---

## 7. Promotion gate for the first water candidate

A water-motion child may become the next visual baseline only if all are true:

- existing H-Earth world remains visible;
- coastline remains unchanged;
- water colors remain visually consistent with the established palette;
- no new color regime replaces the canonical anchors;
- motion is visible but not noisy or unstable;
- water remains coherent during camera traversal;
- no terrain/meso regression appears;
- no water/terrain seam is introduced;
- no blank/init state appears;
- no new renderer ownership is introduced;
- no extra water geometry is required unless later justified;
- physical-device inspection passes.

Automated semantic/structural PASS is insufficient for promotion.

**The physical device remains the final visual gate.**

---

## 8. Immutable evidence refs

Accepted H-Earth working lineage:
`1b590d64bcd961b9079d4615ddf9a706175c2598`

Current clean T4.3 child used as the audit base:
`53305f5dfcdce51406363cba21c665d4e44701ad`

Continuous-ocean implementation:
`7609594b9f624cb2a72c437da143e337c0ead602`

Recovered water optical projection:
`a4c72d6f9865dcd24dedb4727a675951559b113f`

Water index-span attribution proof:
`05aee876629ae26980a8d173886736aa4a84744d`

No main/live promotion is part of this audit.

---

## 9. Audit conclusion

**DURABLE AUDIT RESULT: WATER DEFINITION IS READY FOR MOTION-FIRST DEVELOPMENT.**

The repository already satisfies the major structural standards: canonical shoreline derivation, continuous ocean representation, explicit water semantics, preserved optical anchors, and deterministic GPU transport.

The remaining high-value gap is temporal presentation.

The technically appropriate next experiment is therefore not a new water model and not a new color palette.

It is:

> **Take the existing water definition, keep its colors and geometry, and make it move.**

The diagnostic water renderer demonstrates that the codebase already contains a viable motion pattern. The next development child should transplant only the necessary motion concept into the accepted renderer, with the canonical color law left intact.

Main/live remain untouched.
