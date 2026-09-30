# H-Earth C3C3R5 Remaining-Layer Closure Cycle v1

## Scope

This cycle executes Discovery Manifest layers D5 through D12 before another owner inspection is allowed.

The cycle began from branch `repair/h-earth-c3c3r5-root-spatial-transform-20260816` after the true region-to-planet frame, live structural grid restoration, layered color composition, and screen-space horizon retirement were installed.

## D5 — live material projection

Audited authority: `showroom/globe/h-earth/render/live-render-package.run8e-r2.js`.

Finding: the canonical live package identifies the first neutral-package primitive as the terrain primitive and samples `sampleHEarthRun8CSuccessorSurfaceMaterial(vertex.x, vertex.z)` for every terrain vertex. The resulting base color, alpha, roughness, reflectance, wetness and curvature are written into immutable package buffers.

Therefore the Run 8C layered material signal is not merely descriptive; it is projected into the canonical live package.

Required closure proof is executable in `h-earth.c3c3r5.remaining-layer-provenance.audit.mjs`.

## D6 — GPU transport

Audited authority: `showroom/globe/h-earth/render/gpu-upload-views.run8e-r2d.js`.

Finding: positions, normals, base colors, material parameters, model codes, surface classes, primitive identities, role codes and indices are transported into typed GPU views. Normal/material numeric canonicalization is transport-only; base-color and position buffers are not retuned.

Required closure proof: buffer lengths and material/normal variation must survive canonical GPU transport.

## D7 — lighting / normal response

Audited authority: `showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js`.

Finding: the live WebGL geometry shader consumes `aNormal`, `aBaseColorLinear`, `aMaterialParameters` and role identity. Directional lighting uses the transported world-space normal. Therefore the structural grid can influence pixels through geometry-derived normals; no debug line overlay is required.

Remaining visual requirement: owner-height renders must prove the response is strong enough to preserve the intended grid/depth character. Machine presence alone cannot close perceptual legibility.

## D8 — atmosphere / fog

Audited authority: `h-earth-3d/environment/h-earth.atmosphere-state.js` plus the R3C shader.

Finding: fog begins at approximately the 640-world-unit regime and is bounded below full occlusion. Near-field grid terrain is therefore outside the intended heavy atmospheric regime. The previously fake viewport-space planetary horizon has already been retired; the fullscreen presentation pass supplies sky/air/sun only.

Visual closure still requires confirming that haze does not wash out local topology or create a false wall/dome.

## D9 — canonical live camera consumption

Audit exposed a real parallel-path defect.

Before this cycle, `functional-landscape-frame.js` had a planet-relative camera contract, but the canonical Run 8E live renderer obtains its frame packet through `live-renderer-contract.run8e-r3a.js`, which called `createHEarthFunctionalLandscapeCamera()`; that camera hard-coded `up: {x:0,y:1,z:0}`.

Therefore the earlier planet-camera repair existed in a parallel frame and was not proven to govern the canonical live renderer.

Repair installed in this cycle:
- `live-renderer-contract.run8e-r3a.js` now imports the shared planetary world-frame authority;
- canonical live camera `up` is replaced by `getHEarthPlanetRelativeUp(camera.position)`;
- the live camera packet records the planetary world-frame contract;
- the far plane is preserved at no less than 5600 for planetary visual continuation;
- navigation coordinates remain local and unchanged;
- packet evaluation now rejects a planet-relative-up mismatch.

This closes the known D9 authority split at code level, subject to exact-head qualification.

## D10 — final draw-set custody

Audit exposed the second major hidden authority split.

`previewHEarthFunctionalLandscape()` constructs:
- functional terrain;
- shoreline/open-water geometry;
- distant-context / connected-region continuation.

But `buildHEarthRun8ENeutralPackage()` in `run8e-successor-environment.js` currently builds the canonical Run 8E package from:
- one Run 8B successor terrain primitive;
- the seven shoreline primitives from the legacy/functional preview;
- grounded vegetation.

It does **not** include `legacy.componentResults.distantContext.primitives` in the canonical live package.

Consequences:
- OPEN_WATER can reach the live package because it is a shoreline primitive;
- the current connected-region / distant-land planetary continuation can exist and pass isolated geometry qualification while being absent from the canonical live draw set;
- this is a direct explanation for repeated code-level boundary repairs producing little or no visible landward change.

Disposition: `D10_REPAIR_REQUIRED`.

No owner inspection is lawful until the canonical live package includes the current distant planetary continuation and exact-head qualification proves its primitive identities are present in the draw ranges.

## D11 — macro composition

Not yet lawful to close while D10 is open.

Once D10 is repaired, macro composition must intentionally resolve:
- mountain/pass ocean reveal;
- former rectangular corner sectors;
- coastline wrap/headlands;
- visible but inaccessible neighboring-region continuation;
- absence of wall/dome/box perception.

## D12 — functional + visual qualification

Required final sequence:

`D10 LIVE DRAW-SET REPAIR -> EXACT-HEAD PROVENANCE AUDIT -> CP3D FUNCTIONAL QUALIFICATION -> BASELINE-BOUND VISUAL/EXPERIENTIAL AUDIT -> IMMUTABLE INTERACTIVE PREVIEW -> OWNER INSPECTION`

No machine PASS alone authorizes owner delivery.

## Executable audit

`showroom/globe/h-earth/render/h-earth.c3c3r5.remaining-layer-provenance.audit.mjs`

The audit checks D5-D10 and intentionally returns `REPAIR_REQUIRED` while either:
- the canonical live camera does not consume planetary up; or
- the canonical live draw set contains zero current distant-context primitives.

## Governing discovery

The repeated lack of visible improvement was not merely subjective. Two deeper repairs had been installed in parallel/non-governing paths:

1. the grid was first restored in a terrain provider not used as the canonical Run 8E terrain source;
2. the planet-relative camera was first installed in a frame path not used by the canonical Run 8E live packet;
3. the current distant-land planetary continuation is still excluded from the canonical Run 8E neutral/live package.

The Discovery Manifest is therefore validated by this cycle: every deep change must be traced all the way to owner pixels.

## Current lawful boundary

`D5 AUDITED -> D6 AUDITED -> D7 AUDITED -> D8 AUDITED -> D9 REPAIRED -> D10 REPAIR_REQUIRED`

The remaining-layer cycle is intentionally not pronounced closed while D10 remains unresolved.
