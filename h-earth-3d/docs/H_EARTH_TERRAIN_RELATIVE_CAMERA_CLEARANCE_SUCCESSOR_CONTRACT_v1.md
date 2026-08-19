# H-Earth Terrain-Conforming Locomotion Successor Contract v1

Operation: `H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_SUCCESSOR_20260818_001`

Predecessor operation `H_EARTH_OBSERVER_VIEW_STANDOFF_SUCCESSOR_20260818_004` / generation 322 was machine-qualified but canonically `FAIL_CLOSED` after owner/browser evidence proved that camera clearance, camera-volume protection, and observer-view stand-off can all remain active while a horizontal movement transition still carries the observer into the presented terrain.

Protected predecessor head: `a233238aaa013109ced14b5e5ceeb3fcc2d083d3`.

Protected geographic floor: `e03363f42441cea7587a49623fd878e8ca51fe28`.

Failure evidence: `23891.mp4`, SHA-256 `7d4d8cc9298d5e162bb797a186690643838affe12adf38d2861bfbe0f370c0ae`.

## Causal failure

The predecessor resolved terrain only after accepting a requested horizontal destination. That ordering permits an invalid transition:

`movement intent -> accept X/Z -> react vertically`

The successor changes the ordering to:

`movement intent -> sweep presented terrain -> classify traversability -> surface-conforming motion or rejection -> camera clearance -> camera-volume protection -> observer-view stand-off`

The relevant invariant is therefore not merely camera height at an endpoint. No accepted movement segment may cross from the exterior side of the presented terrain representation into its interior.

## Governing locomotion law

For a requested translation from A to B, the exact presented terrain surface is sampled continuously at a bounded spacing before B is accepted.

For each consecutive sweep sample:

`grade = abs(delta terrain height) / horizontal run`

If every local grade is at or below the bounded traversable threshold, the movement is resolved incrementally along the surface and the existing camera-protection stack is applied at each intermediate position.

If any local grade exceeds the threshold, the requested translation is rejected before the observer position changes. A later successor may add deterministic lateral sliding, but rejection is sufficient for this operation because it preserves the exterior state and prevents tunneling.

## Required behavior

- horizontal movement may not be committed before swept presented-terrain evaluation;
- direct position proposals may not tunnel through intermediate terrain;
- climbable positive grades must produce surface-conforming ascent;
- climbable negative grades must produce surface-conforming descent;
- non-climbable grades must stop/reject before penetration;
- rejected movement preserves the last lawful exterior X/Z state;
- the exact Gen311 presented terrain mesh remains the traversal surface;
- generation-320 terrain-relative clearance remains active;
- generation-321 camera-volume protection remains active;
- generation-322 observer-view stand-off remains active;
- bounded vertical response and controlled downhill settling remain active;
- camera/world navigation scale is unchanged;
- no geography, topology, terrain, renderer, merge, deployment, or production authority is created.

## Protected surfaces

This operation may not mutate Gen311 terrain or relief construction, canonical terrain, shoreline/ocean topology, public route, deployment paths, or Experience Anchor authority. It also may not weaken the existing camera-volume or observer-view protections. The protected predecessor and geographic floor are immutable inputs.

## Qualification

The exact harness `h-earth-3d/validation/h-earth.terrain-relative-camera-clearance.harness.mjs` must use the actual presented terrain to discover and test real movement cases rather than fixed synthetic slopes.

It must prove:

1. a real positive climbable grade is accepted and gains terrain elevation;
2. a real climbable descent is accepted and loses terrain elevation;
3. accepted translations report swept evaluation before position acceptance;
4. a real non-climbable grade is rejected while preserving the prior X/Z position;
5. long movement proposals cannot bypass intermediate terrain through endpoint-only acceptance;
6. every accepted camera state remains outside both the actual terrain surface and the existing clearance/stand-off envelope;
7. ordinary directional locomotion materially exercises the swept path;
8. canonical terrain, Gen311 landscape, camera-volume protection, and observer-view stand-off remain preserved;
9. no accepted state can report an exterior-to-interior transition as representable.

The native receipt must identify operation `H_EARTH_TERRAIN_CONFORMING_LOCOMOTION_SUCCESSOR_20260818_001` exactly and report zero issues.

A machine PASS does not authorize merge or release. Owner/browser inspection remains mandatory. The decisive browser question is causal: when forward movement meets rising terrain, does the observer actually climb a traversable surface or stop at a non-traversable one, with no route into the terrain interior?
