# H-Earth Camera-Volume Terrain Clearance Successor Contract v1

Operation: `H_EARTH_CAMERA_VOLUME_CLEARANCE_SUCCESSOR_20260818_003`

Predecessor operation `H_EARTH_TERRAIN_RELATIVE_CAMERA_CLEARANCE_SUCCESSOR_20260818_002` / generation 320 was machine-qualified but canonically `FAIL_CLOSED` after owner/browser evidence demonstrated that camera-origin clearance did not guarantee rendered view-volume clearance.

Protected predecessor head: `d9d4c0ada0d97e98340c3b771a23153cef1ecb00`.

Protected geographic floor: `e03363f42441cea7587a49623fd878e8ca51fe28`.

Failure evidence: `23889.mp4`, SHA-256 `1f613e784906d44931bd5a2dbf75549d75091854d9d36cf4388f34e93788549b`.

## Purpose

Preserve the successful Gen311 relief and generation-320 terrain-relative vertical dynamics while repairing the remaining adjacent-system defect: a camera origin can be above a sparse sampled terrain envelope while the near camera/view volume intersects steep visible relief.

The successor therefore changes the clearance *sampling volume*, not world geography, terrain relief, camera/world scale, route topology, or deployment authority.

## Governing invariant

For every accepted navigation state, the camera safety corridor must remain above the exact presented terrain representation:

`cameraY >= max(h_visible(x,z) for (x,z) in cameraVolumeFootprint) + minimumTerrainClearance`

The camera-volume footprint includes dense longitudinal and lateral samples across the near/forward view corridor. The sampler remains representational and cannot become geography or collision/physics authority.

## Required behavior

- exact presented Gen311 terrain mesh remains the sampled surface;
- generation-320 navigation proposal and bounded vertical dynamics remain byte-identical unless a later admitted repair proves mutation necessary;
- sparse four-point clearance is replaced by a dense camera-volume corridor;
- steep terrain between the camera and the former look-ahead point must influence required clearance;
- side relief near the view corridor must influence required clearance;
- unsafe motion may be rejected rather than allowing penetration;
- bounded uphill response, controlled downhill settling, and deadband behavior are preserved;
- no abrupt vertical popping is introduced;
- camera/world navigation scale is unchanged.

## Protected surfaces

The operation may not mutate Gen311 relief construction, canonical terrain, successor terrain semantics, shoreline/ocean topology, public route, deployment paths, or Experience Anchor authority. The exact Gen311 geographic floor and generation-320 predecessor remain protected inputs.

## Qualification

The exact harness `h-earth-3d/validation/h-earth.terrain-relative-camera-clearance.harness.mjs` must execute the established traversal battery plus a dedicated camera-volume stress sequence:

1. sustained uphill traversal;
2. sustained descent;
3. valley crossing;
4. pass crossing;
5. steep-slope adjacency;
6. rotation beside rising relief;
7. direction reversal on a grade;
8. camera-volume/frustum stress with rotation plus short forward/lateral impulses.

The verifier must not merely trust the production envelope. It independently samples a denser raw terrain volume around each accepted camera state and requires zero camera-volume terrain intersection. It must also prove dense production sampling, bounded vertical response, downhill restoration, deadband stability, byte preservation of the protected navigation file, canonical terrain, and Gen311 landscape preview.

The native qualification receipt must identify operation `H_EARTH_CAMERA_VOLUME_CLEARANCE_SUCCESSOR_20260818_003` exactly and report zero issues.

A machine PASS does not authorize merge or release. Owner/browser inspection remains required because `23889.mp4` proved that a synthetic PASS can miss an experienced camera-volume failure.
