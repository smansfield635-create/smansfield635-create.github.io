# H-Earth coastal swell inspection record — 2026-09-27

This is progress and evidence history. It does not accept a visual candidate, change product authority, merge, deploy, or promote any branch. See issue #5086 for the individual measurement and correction comments.

## Preserved references

- `5501a191d3fa0adf7531f7d15a1c422603391706`: owner-accepted continuous still-water corridor. Unchanged.
- `11041e09…`: continuous animated surface-normal/lighting proof, not accepted as physical ocean motion.
- `49fda5a5…`: rejected separate wave overlay and unjustified orientation. Unchanged.
- The Variant-B H-Earth corridor at `preview/h-earth/corridor/38df744ba7402aabe7fd2eaee71b961a451350de/B/` remains the exact-commit visual inspection surface.

## Measured geometry and candidate sequence

| Commit | Scope | Result |
|---|---|---|
| `5b2ca665…` | Flat 2 m subdivision of 120 selected original ocean cells, conservative nearshore envelope. | Held: T-junctions at untouched coarse neighbors. No visual acceptance. |
| `75cc34c52fa456360f5ff22e0dd1d286b99d2d6d` | Retriangulated 47 adjacent transition cells on the same ocean surface. | Source check: 38,220 ocean vertices, 76,056 triangles, 382 expected outer edges, zero open internal edges, duplicate triangles, zero-area triangles, or inconsistent winding. This proves ocean internal adjacency only. Flat water. |
| `688b6341c8106ff7a3ab8c8b999b09a0ecd75354` | Diagnostic query toggle for the separate terrain refinement draw, based directly on accepted `5501…`. | Cloud browser failed at first-frame presentation before a valid same-camera A/B could be captured. No visual attribution proof. |
| `072b2a0b90e6919293f77e18159807a96a8c0a53` | Separate terrain correction experiment, based directly on `5501…`: omit the conflicting terrain overlay draw. | Source construction passes with 12,349 presented terrain vertices and 6,030 regional-relief vertices. No independent visual acceptance. |
| `9ea3bc1be791ac8752415394781c33e8b29b9c40` | Combine conforming 2 m ocean with no terrain overlay draw and animated geometric swell. | Rejected on phone: fragment shader compilation failed because a water variable named `cross` shadowed GLSL `cross()`. |
| `8d45276751e7a70e691629ec1bad4dda6420507b` | Rename only the water variable to `crossPhase` in selected renderer. | Phone starts and navigates; visual outcome remains experimental. Cloud browser compiles/draws but fails at presentation on that browser, so it cannot provide visual acceptance. |

The accepted `5501…` commit and rejected `49fda5a5…` reference were not rewritten. The combined `8d452767…` candidate is three topology/renderer commits plus the shader naming correction ahead of `5501…`; the total diff from `5501…` is limited to the corridor's `geometry-distant-context.js` and selected `persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`.

## Terrain join finding

The selected renderer's separate terrain refinement is a 128 m × 128 m, 4 m-grid patch centered on the initial camera, drawn after the packet's terrain and ocean. At initial local camera (28, -82), its snapped center is (28, -84), footprint x [-36, 92], z [-148, -20]. It samples the Run8B base elevation plus a 0.035 m lift. The already-presented terrain includes Gen311 regional relief that this overlay omits. At the inland patch perimeter z=-148, direct evaluation of that source relief law over x=-36..92 in 4 m steps ranges from -1.434 m to +2.640 m. This is a concrete geometry mismatch capable of producing a hard footprint border; it is not a GPU pixel-attribution measurement. Removing the overlay draw did not visually cure every hard shoreline band.

## Physical water construction

The combined candidate refines existing ocean cells in place and shares indices across the fine/coarse transition. It does not add a second ocean rectangle. A one-time per-vertex coordinate computes canonical shoreline offset and a bounded envelope: zero at 4 m or less from shore, full by 12 m, fade over 120–160 m offshore, and lateral fade over |x| 220–260 m. Vertex shader displacement uses 0.25 m amplitude, 20 m wavelength, and 5 s period. Time advances as one uniform per frame; the water mesh is not rebuilt or uploaded per frame. Fragment lighting derives a normal from displaced world position and retains the earlier fine lighting variation.

The stationary source check found displacement in [-0.2499996, +0.2499996] m and exactly zero at the shore, offshore, and lateral fade boundaries. The actual OW01 package at `9ea3…` was eligible with 54,912 total vertices, 42,233 role-4 water vertices, 20,462 active swell-envelope vertices, and zero nonfinite coordinates. These are construction checks, not proof of visible wave quality or mobile frame timing.

## Owner inspection

- `27325.mp4` (flat `75cc…`, 33.7 s): starts and navigates. Ocean looks continuous from some views, but is flat. Camera movement exposes a hard turquoise region and angular terrain/shore shapes. Owner rejected it as a visual candidate.
- `27326.mp4` (corrected moving candidate `8d452767…`, 46.4 s): starts and remains navigable. The ocean still reads more like one water body than the historical tile/overlay failures. A convincing travelling swell is not clearly perceptible in the moving-camera recording. Hard angular shoreline bands and the turquoise inland patch remain. The owner noticed a **modest performance regression**, explicitly not judged fundamental. The recording alone does not provide a measured frame rate.
- The initial combined `9ea3…` phone receipt failed at `FRAGMENT_SHADER_COMPILED` with `'cross' : function name expected`. `8d452767…` corrected only that naming collision. Cloud browser reached draw completion on both corrected and prior diagnostic routes but returned `DRAW_COMPLETED_NO_PRESENTATION`; no cloud-browser visual or performance conclusion is drawn from it.

## Current decision and next measurement

`8d452767…` is a working inspection experiment, **not accepted living water, terrain continuity, or promotion authority**. Do not merge or replace `5501…` on this evidence. The next bounded observation is a fixed ocean-facing camera for at least one complete 5 s wave cycle on the same exact commit, with renderer-owned frame timing and motion evidence if available. Judge whether the displaced crest actually changes the surface silhouette/highlight independently of camera movement, and quantify the modest performance cost on the phone. Separately map the remaining angular shoreline/turquoise patch to their owning primitives before changing more terrain or water geometry. A visual defect must not be declared fixed from ocean-only edge-incidence counts.
