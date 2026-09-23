# H-Earth Post-READY Terrain Refinement Resource Contract v1

MODE: CONSTRUCTION CONTRACT
BASE AUTHORITY: 202480d2a4fd7298b4733b800b3e3914d7755a12
STATUS: AUTHORIZED FOR BOUNDED PROOF ONLY

## Purpose
Permit observer-local terrain representation refinement without weakening the canonical Run8E package residency contract or moving expensive geometry construction into startup.

## Canonical package invariants
The existing canonical package remains:
- immutable;
- uploaded exactly once during renderer initialization;
- nine canonical GPU buffers;
- stable package identity/content digest;
- never rebuilt because camera moves;
- continuously renderable as fallback.

Existing counters for canonical package uploads remain semantically unchanged.

## New resource class
One additive resource class is authorized:
`H_EARTH_ACTIVE_DETAIL_REFINEMENT_RESOURCE_v1`

It is representation-only. It creates no geography, terrain-field, navigation, coastline, water, atmosphere, or renderer authority.

## Lifecycle
1. Canonical Phase 2B world reaches FIRST_FRAME and READY using the existing startup path.
2. Only after READY may refinement construction be requested.
3. Initial proof uses one patch centered on the initial local-authoring observer anchor.
4. Patch is sampled from the same canonical Run8B terrain field and Gen311 relief law.
5. Patch uses the existing declared refinement spacing.
6. Patch is uploaded to separately accounted persistent GPU buffers/VAO.
7. Patch uses the same Phase 2B geometry shader/fragment shader and environment uniforms.
8. Base terrain remains resident and is the immediate fallback.

## Bounds
Proof patch radius: <= 72 world units from anchor.
Maximum simultaneous refinement patches: 1.
Maximum refinement vertex count: 4096.
Maximum refinement triangle count: 8192.
Maximum refinement GPU buffer sets: 1.
No unbounded allocation.
No per-frame allocation.
No per-frame terrain rebuild.

## Anchor/update law
Initial proof: fixed initial observer anchor only.
Generalization, if later authorized, must use hysteresis and coarse anchor transitions; camera movement alone must not rebuild geometry every frame.

## Rendering law
Refinement geometry must not create a second renderer.
It is drawn by the existing WebGL2 renderer/program.
It must preserve Phase 2B material behavior.
Coincident base terrain must be handled deterministically to avoid z-fighting; patch failure must never blank the base world.

## Receipt evolution
Existing fields:
- packageUploadedOnce
- canonical package buffer count
remain authoritative for the canonical package.

Add separately:
- refinementResourceAuthorized
- refinementResourceCreated
- refinementResourceBufferUploadCount
- refinementPatchVertexCount
- refinementPatchTriangleCount
- refinementAnchor
- refinementFallbackAvailable
- canonicalPackageMutated=false
- worldRebuiltBecauseCameraMoved=false

The old global `noPostInitializationResourceCreation` / `noPostInitializationBufferUpload` predicates must not be silently reinterpreted. They are superseded only for this explicitly named refinement resource while remaining true for canonical resources.

## Startup law
No refinement work may delay FIRST_FRAME or READY.
Startup timeout may not be increased to accommodate refinement.

## Proof acceptance
A candidate passes only if:
- base Phase 2B reaches READY within existing budget;
- refinement begins after READY;
- canonical package identity is unchanged;
- patch remains within all ceilings;
- same terrain truth/material authority is used;
- physical A/B shows improved near-field facets/silhouette;
- no visible seam or z-fighting;
- base fallback remains valid;
- navigation/camera behavior remains unchanged.

## Non-targets
No changes to canonical terrain field, geography, coastline, water, atmosphere, Phase 2B shader design, camera, controls, public route semantics, or production deployment.

## Failure
Any startup regression immediately rejects the candidate and returns authority to frozen Phase 2B.
