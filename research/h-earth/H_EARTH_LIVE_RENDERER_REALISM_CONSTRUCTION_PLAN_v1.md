# H-Earth Live Renderer Realism Construction Plan v1

MODE: DURABLE CONSTRUCTION AUTHORITY
SOURCE BASELINE: 7c692cef3888d065f856b2a8a8c001cfa1679f2a
TRACE AUTHORITY: research/h-earth/H_EARTH_LIVE_FINAL_PIXEL_AUTHORITY_TRACE_v1.md
STATUS: READY FOR CONSTRUCTION
PRODUCTION MUTATION: PROHIBITED UNTIL EXPLICIT PROMOTION

## Objective
Improve the physical visible realism of the accepted live H-Earth environment without replacing its renderer architecture, world, geometry authority, camera, controls, route, coastline, water, atmosphere, or presentation shell.

## Primary mutation authority
Only the existing active terrain fragment-shading branch in:

showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js

Primary branch:
if(vRoleCode==1u)

No parallel renderer, Gen-2 shell, bridge renderer, invented loading system, or replacement world is authorized by this plan.

## Frozen first-pass surfaces
The following remain byte-identical to the accepted live baseline unless a later phase explicitly unlocks them:
- canonical terrain/geography
- landscape geometry and topology
- coastline/shoreline geometry
- water system
- atmosphere authority
- camera
- controls/navigation
- public route/presentation
- GPU transport architecture
- renderer selection architecture
- vegetation/population
- semantic manor/cavern/ravine geography

## Phase 1 — Terrain final-pixel realism proof
Purpose: prove that direct mutation of the existing final terrain shader materially improves the actual live image.

Allowed:
1. Replace periodic three-direction sine microrelief with deterministic nonperiodic multiscale normal detail using existing shader-space/world-space inputs.
2. Preserve derivative-based normal perturbation and anti-alias/distance bounding.
3. Consume existing vMaterialParameters channels as real material inputs:
   - roughness
   - reflectance
   - wetness
   - curvature
4. Reduce or retire dominant painted geology terms:
   - contourLine
   - strata/crossGrain color multiplication
   - faceBandA/B/C dominance
   - crest/terrace striping
   - slopeRake color striping
5. Preserve broad geographic/material identity and existing base-color authority.
6. Preserve current sun and atmosphere contracts.
7. Make the change strong enough for an unmistakable physical A/B result without changing geography.

Forbidden:
- geometry mutation
- new renderer
- new assets
- random boulders/trees
- new cavern proxy
- new water
- camera changes
- loading-screen changes
- production deployment

Pass gate:
A physical exact-route A/B capture must show a materially different terrain surface while preserving the same world composition. A byte/code receipt alone is insufficient.

Failure handling:
Compile/runtime/harness failures are repaired and rerun autonomously. Owner review occurs only after a physical visual candidate exists.

## Phase 2 — Triplanar material projection
Entry condition: Phase 1 produces a visible improvement.

Introduce triplanar terrain material-space projection inside the same active terrain shader architecture. Blend by surface normal/slope. Establish differentiated rock/soil/lowland response and normal detail without texture stretching.

No geometry mutation.

## Phase 3 — Cast-shadow architecture
Entry condition: Phase 2 accepted.

Add bounded outdoor terrain shadowing. Prefer cascaded/frustum-aware resolution management or equivalent architecture appropriate to the existing raw WebGL2 renderer.

Preserve canonical sun authority.

## Phase 4 — Geometry-derived contact depth
Entry condition: Phase 3 accepted.

Evaluate bounded SSAO/GTAO-equivalent geometry-derived contact depth. Reduce semantic/procedural contact painting where physical depth evidence supersedes it.

Performance qualification is mandatory.

## Phase 5 — Atmosphere reconciliation
Entry condition: terrain lighting/material/shadow depth accepted.

Tune existing fog, desaturation, haze and aerial perspective against the improved terrain. Atmosphere must reveal distance without erasing terrain relief.

## Phase 6 — Water realism
Independent water pass after terrain/atmosphere stability:
- normal-driven surface variation
- Fresnel/specular response
- shoreline contact
- shallow/shelf/deep optical continuity

Preserve water as a separate rendering system.

## Phase 7 — Geometry/LOD adjudication
Only after Phases 1–6.

Determine from physical evidence whether remaining realism deficit is actually geometric. If yes, evaluate geometry-clipmap or equivalent LOD architecture. Do not globally increase mesh density without a measured need.

## Qualification law
Every phase follows:
FROZEN LIVE BASELINE
→ ONE BOUNDED RENDERING MUTATION
→ EXACT-SHA BUILD/RUNTIME QUALIFICATION
→ PHYSICAL PUBLIC-ROUTE A/B EVIDENCE
→ OWNER INSPECTION
→ ACCEPT / REPAIR / REJECT

A successful automated run does not equal visual acceptance.

## Stop conditions
Stop the current phase and diagnose if:
- public route identity changes;
- camera/controls regress;
- coastline/world composition changes unintentionally;
- visual result is effectively identical;
- result becomes more stylized/cartoon-like;
- a replacement renderer/shell is introduced;
- qualification cannot demonstrate actual physical pixels.

## External precedent incorporated
The plan incorporates the read-only cross-reference already recorded in the trace:
- NVIDIA GPU Gems geometry clipmaps / higher-frequency normal detail
- NVIDIA GPU Gems triplanar terrain projection
- PBR roughness/material response precedent
- Cesium terrain-normal/directional-light precedent
- cascaded shadow precedent
- GTAO/SSAO contact-depth precedent
- atmosphere-after-terrain-lighting sequencing
- independent water rendering

## Immediate deterministic next task
Construct Phase 1 on an isolated branch rooted directly at the accepted live baseline. Modify only the active terrain fragment branch in the existing persistent renderer. Produce exact-route A/B physical evidence before any owner inspection.

## Authority boundary
This plan authorizes construction experiments only. It does not authorize merge into production, publication to the live production route, or retirement of the accepted baseline.
