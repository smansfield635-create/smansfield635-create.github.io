# H-Earth Observer-View Stand-Off Successor Contract v1

Operation: `H_EARTH_OBSERVER_VIEW_STANDOFF_SUCCESSOR_20260818_004`

Predecessor operation `H_EARTH_CAMERA_VOLUME_CLEARANCE_SUCCESSOR_20260818_003` / generation 321 was machine-qualified but canonically `FAIL_CLOSED` after owner/browser evidence demonstrated that geometric camera-volume clearance did not guarantee a usable observer view beside steep terrain.

Protected predecessor head: `5f379351d93e1cb01b1eea1b3b72a37d0256ada0`.

Protected geographic floor: `e03363f42441cea7587a49623fd878e8ca51fe28`.

Failure evidence: `23890.mp4`, SHA-256 `f489523766c2f969a6e76e030907d91021871dd78ea28a8c6b9c19fb57b3420c`.

## Purpose

Preserve the successful Gen311 relief, terrain-relative clearance, and generation-321 dense camera-volume protection while repairing the remaining experiential defect: a camera can avoid literal terrain intersection yet remain so close to a steep slope that the terrain consumes the forward view and destroys useful observer-scale traversal.

The successor therefore adds an observer-view stand-off reference. It does not reduce mountains, change world geography, alter navigation scale, change route topology, or create camera/renderer authority.

## Governing invariant

For materially rising terrain in the protected camera corridor:

`cameraY >= max(h_visible_actual) + minimumTerrainClearance + observerViewStandOffMargin`

The margin is zero on low-relief terrain and activates only when the nearby visible-terrain maximum materially exceeds the terrain beneath the camera. It is bounded and derived solely from the presented terrain representation.

## Required behavior

- exact presented Gen311 terrain mesh remains the sampled physical surface;
- generation-321 camera-volume sampling remains active;
- actual terrain maximum is retained separately from the higher clearance-reference elevation;
- low-relief traversal is not arbitrarily raised;
- materially rising relief produces bounded additional observer stand-off;
- steep-slope approaches must retain usable forward-view separation or reject movement;
- rotation, strafing, ascent, descent, valley/pass traversal, and direction reversal preserve stand-off;
- bounded uphill response, controlled downhill settling, and deadband behavior are preserved;
- no abrupt vertical popping is introduced;
- camera/world navigation scale is unchanged.

## Protected surfaces

The operation may not mutate Gen311 relief construction, canonical terrain, shoreline/ocean topology, public route, deployment paths, or Experience Anchor authority. The exact Gen311 geographic floor and generation-321 predecessor remain protected inputs.

## Qualification

The exact harness `h-earth-3d/validation/h-earth.terrain-relative-camera-clearance.harness.mjs` must execute the established traversal battery plus an observer-view occupancy stress sequence.

The verifier must independently sample raw actual terrain around each accepted camera state rather than trusting the production clearance reference. It must prove:

1. camera-volume zero-penetration remains preserved;
2. observer-view stand-off materially activates on steep relief;
3. active stand-off states retain at least the required actual-terrain separation;
4. sustained uphill and downhill traversal remain bounded;
5. valley and pass crossing remain stable;
6. steep-slope adjacency, rotation, and strafing preserve usable view separation;
7. grade reversal remains stable;
8. downhill settling restores toward the bounded target;
9. protected navigation, Gen311 landscape preview, and canonical terrain bytes remain unchanged.

The native qualification receipt must identify operation `H_EARTH_OBSERVER_VIEW_STANDOFF_SUCCESSOR_20260818_004` exactly and report zero issues.

A machine PASS does not authorize merge or release. Owner/browser inspection remains required because both `23889.mp4` and `23890.mp4` demonstrated that progressively stronger geometric tests can still miss an experienced camera-view failure.
