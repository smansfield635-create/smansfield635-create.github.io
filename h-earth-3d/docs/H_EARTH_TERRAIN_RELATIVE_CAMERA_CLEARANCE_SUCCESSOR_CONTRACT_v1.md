# H-Earth Terrain-Relative Camera Clearance Successor Contract v1

Operation: `H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_20260818_002`

Predecessor intake `_001` / generation 319 was canonically `VOIDED` for an admitted-subject anchor naming defect before product qualification. No product byte or behavior was rejected by that disposition.

Protected geographic floor: `e03363f42441cea7587a49623fd878e8ca51fe28`.

Failure evidence: `23888.mp4`, SHA-256 `f870e08673312fe521499221fd3c9f4a4a02d45c9812e277ff58d347e0b74570`.

## Purpose

Repair the adjacent-system traversal defect exposed by the Gen311 visible relief without changing the qualified Gen311 terrain representation. Camera clearance must follow the exact terrain mesh presented to the player rather than treating the untouched canonical terrain elevation as the rendered surface height.

## Governing invariant

For every accepted navigation state:

`cameraY >= visibleTerrainHeight(cameraX,cameraZ,envelope) + minimumTerrainClearance`

The visible-terrain envelope includes the camera footprint and bounded forward look-ahead. The sampler is representational only and creates no geography or topology authority.

## Required behavior

- exact presented Gen311 terrain mesh is the clearance surface;
- canonical terrain is retained separately for provenance and geography identity;
- minimum clearance is never violated by an accepted state;
- uphill response is bounded; movement that cannot remain safe within the bound must reject rather than penetrate;
- downhill settling is slower than uphill correction and converges to nominal eye clearance;
- a deadband prevents vertical chatter around the target;
- rotation beside relief, grade reversal, pass traversal, valley traversal, ascent, and descent remain stable;
- camera/world navigation scale is unchanged.

## Protected surfaces

The operation may not mutate Gen311 relief construction, canonical terrain, successor terrain semantics, shoreline/ocean topology, public route, deployment paths, or Experience Anchor authority. `e03363f...` remains the geographic comparison floor.

## Qualification

The exact harness `h-earth-3d/validation/h-earth.terrain-relative-camera-clearance.harness.mjs` must execute seven traces:

1. sustained uphill traversal;
2. sustained descent;
3. valley crossing;
4. pass crossing;
5. steep-slope adjacency;
6. rotation beside rising relief;
7. direction reversal on a grade.

Every accepted state must preserve visible-terrain clearance. The battery must also prove bounded vertical response, downhill restoration toward nominal clearance, deadband stability, visible-mesh identity, and byte preservation of protected Gen311 terrain files.

The native qualification receipt must identify operation `H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_20260818_002` exactly.

A machine PASS does not itself authorize merge or release. Owner/browser inspection remains required.
