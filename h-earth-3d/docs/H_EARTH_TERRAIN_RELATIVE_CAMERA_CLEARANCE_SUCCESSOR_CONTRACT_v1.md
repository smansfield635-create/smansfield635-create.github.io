# H-Earth Terrain-Supported Locomotion Successor Contract v1

Operation: `H_EARTH_TERRAIN_SUPPORTED_LOCOMOTION_SUCCESSOR_20260818_001`

Protected predecessor head: `777d96d2990a4580071d11aadab83fa70370ca5a`.
Protected geographic floor: `e03363f42441cea7587a49623fd878e8ca51fe28`.
Failure evidence: `23892.mp4`, SHA-256 `3b804913c6069c123f3e881249cbac12a45d46a9e741b00fcd81bd8b447d0f22`.

## Causal correction

Generation 323 proved swept-path evaluation but still allowed camera elevation to behave as an independently carried state while the rendered ground rose beneath it. That permits the observer to occupy the terrain interior even when endpoint and path checks exist.

This successor makes ordinary ground locomotion terrain-supported. The accepted horizontal position determines the vertical support state rather than inheriting a stale camera Y.

For every accepted ground traversal state:

`cameraY >= max(presentedTerrainY + hardSupportOffset, clearanceReferenceY + minimumClearance, clearanceReferenceY + eyeHeight)`

The supplied/requested Y of an ordinary ground translation has no authority to place the observer below that support surface.

## Required behavior

- every accepted translated X/Z is projected onto the exact presented Gen311 terrain surface;
- rising rendered terrain forces camera elevation upward;
- reversing across the same terrain lowers camera elevation with the surface;
- a caller-supplied stale or arbitrarily low Y cannot create an interior state;
- movement remains swept at bounded spacing so intermediate terrain cannot be skipped;
- the generation-321 camera-volume and generation-322 observer-view protection stack remains intact;
- canonical terrain, Gen311 regional relief, geography, topology, navigation scale, renderer, route and deployment authority remain unchanged;
- no ordinary movement input may represent a camera state below presented terrain plus the hard support offset.

## Qualification

The exact harness `h-earth-3d/validation/h-earth.terrain-relative-camera-clearance.harness.mjs` must use the real presented terrain and prove:

1. an accessible real rising segment forces camera Y upward;
2. reversing that segment lowers camera Y;
3. deliberately supplying an extreme below-ground Y is overridden by terrain support;
4. every accepted state remains at or above the exact terrain-support floor;
5. long translations remain swept with sufficient intermediate samples;
6. ordinary directional traversal materially exercises terrain-supported swept movement;
7. the camera-volume and observer-view protections remain byte-preserved;
8. canonical terrain and Gen311 landscape bytes remain unchanged;
9. no geography, topology, navigation-scale, merge, deployment or production authority is created.

A machine PASS does not authorize release. Owner/browser inspection remains mandatory. The decisive browser behavior is simple: forward movement into a mountain must carry the observer upward with the rendered mountain; reverse movement must carry the observer downward; ordinary traversal must never enter the terrain interior.
