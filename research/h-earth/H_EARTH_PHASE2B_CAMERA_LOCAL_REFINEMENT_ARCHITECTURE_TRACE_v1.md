# H-Earth Phase 2B Camera-Local Refinement Architecture Trace v1

MODE: READ-ONLY / DURABLE
SOURCE: 202480d2a4fd7298b4733b800b3e3914d7755a12
TRIGGER: two eager densification startup failures
PRODUCT MUTATION: NONE

## Failure evidence
Full refinement missed FIRST_FRAME_PRESENTED. Bounded near/coastal eager refinement reached first-frame work but missed READY_PUBLISHED within 20 seconds. No shader, framebuffer, WebGL, context-loss, or network failure occurred. Eager package construction is therefore the wrong insertion point.

## Existing live lifecycle
1. R3A creates a frame packet for every accepted navigation state.
2. Each packet contains localAuthoringPosition/localAuthoringTarget plus planetary camera coordinates.
3. R3D3 receives every accepted navigation proposal synchronously and calls presentNavigationState.
4. presentNavigationState creates the new R3A packet, renders, and presents.
5. R3E2 owns onProposal and onFramePresented callbacks and publishes FIRST_FRAME/READY.
6. The persistent renderer requires the canonical package to be uploaded once and explicitly prohibits world rebuild per camera move.

## Existing refinement-relevant authorities
### Spatial lifecycle
h-earth.spatial-lifecycle.js already defines observer-distance lifecycle classes:
- ACTIVE_DETAIL maximum 72
- ACTIVE_REDUCED maximum 180
with hysteresis and update cadence.

It explicitly does not own geometry. It can therefore supply policy semantics but should not become a mesh constructor.

### World representation plan
h-earth.world-representation-plan.js already defines distance-weighted NEAR/MID/FAR representation and declares:
- SPATIALLY_OVERLAPPED_LOD_AUTHORITY
- TOPOLOGY_PRESERVING_LOD
- REPRESENTATION_BOUNDARY_INVISIBILITY
- NO_CAMERA_RELATIVE_WORLD_RECENTERING

This is direct architectural precedent inside H-Earth for observer-dependent representation without changing canonical topology.

### Run8B terrain representation
Current Run8B mesh is eager, single-package, and static. Its declared refinement spacing cannot simply be activated globally because package construction occurs before READY and scales startup cost.

## Critical constraint
R3A/R3C contracts currently require:
- package uploaded once;
- no CPU world rebuild because camera moved;
- stable GPU resource identity.

Therefore camera-local refinement must NOT rebuild or replace the canonical package on each navigation event.

## Lawful insertion architecture
Keep Phase 2B canonical package and base terrain resident exactly as today.

After READY:
1. derive observer-local refinement need from R3A localAuthoringPosition and existing lifecycle/representation distance laws;
2. construct a bounded refinement patch from the SAME canonical Run8B terrain field;
3. upload that patch to a separate persistent refinement GPU buffer/VAO owned by the existing renderer;
4. render it in the same shader/material program as Phase 2B;
5. suppress/z-bias or mask the coincident base cells beneath the patch to prevent z-fighting;
6. update/refill the patch only when observer crosses a coarse refinement anchor/hysteresis boundary, not every frame;
7. keep canonical base mesh continuously resident so patch failure can fall back without blanking the world.

This is an additive representation refinement inside the existing renderer, not a second renderer or second geography.

## Recommended first proof
Do not implement a moving clipmap immediately.

First prove one bounded post-READY refinement patch around the initial coastal observer:
- radius/order derived from ACTIVE_DETAIL (~72 world units);
- refinement spacing = existing Run8B refinementSpacingWorldUnits;
- same canonical terrain field and Gen311 relief projection;
- same Phase 2B material shader;
- patch construction deferred until after first frame/READY;
- base world visible immediately;
- refinement patch appearance can be toggled for A/B evidence.

If this initializes within the unchanged startup budget and visibly improves nearby silhouettes/facets, then generalize the patch into observer-anchored hysteretic updates.

## Required contract evolution
The current 'packageUploadedOnce' law should remain true for the canonical package. A new bounded refinement-resource contract may allow post-READY GPU resource creation/update while explicitly preserving:
- canonical package identity;
- no canonical world rebuild;
- no camera-relative world recentering;
- no geography mutation;
- bounded patch count and memory;
- deterministic anchor transitions;
- fallback to base terrain.

## Non-targets
Do not change:
- Phase 2B shader during the geometry proof;
- canonical terrain field;
- coastline/water;
- atmosphere;
- navigation/camera authority;
- public route;
- startup timeout;
- READY semantics.

Increasing the timeout would hide the architectural problem and is prohibited.

## Next construction target
A post-READY, initial-observer, bounded ACTIVE_DETAIL terrain refinement patch implemented as an additive representation resource inside the existing persistent renderer path.

The proof must show:
BASE READY ON CURRENT BUDGET
→ REFINEMENT PATCH BUILT AFTER READY
→ SAME CANONICAL TERRAIN TRUTH
→ SAME PHASE 2B MATERIALS
→ VISIBLE NEAR-FIELD SILHOUETTE/FACET IMPROVEMENT
→ NO SEAM/Z-FIGHT
→ BASE FALLBACK PRESERVED.
