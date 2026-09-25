# H-Earth R2 Final Read-Only Depth-Ownership Gate — 2026-09-25

## Immutable coordinate
- Repository: `smansfield635-create/smansfield635-create.github.io`
- Source commit: `53305f5dfcdce51406363cba21c665d4e44701ad`
- Camera: `(28, 10.5, -82) -> (-34, 5.5, -214)`
- FOV: `56 deg`
- Near/Far: `0.25 / 512`
- Geometry mutation: **HELD**

## Authorities read at the immutable coordinate
- `showroom/globe/h-earth/render/geometry-distant-context.js`
  - FAR ocean is a continuous indexed ocean field.
  - Near tessellation is 40 world units in X and 24 in Z.
  - Ocean presentation elevation input is `y=0.015` before the common spherical transform.
- `showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js`
  - Run8B is the near-to-mid indexed G_world terrain representation.
  - Domain: X `-384..384`, Z `-736..128`.
- `h-earth-3d/terrain/h-earth.terrain-field.js`
  - Supplies the canonical elevation law used by G_world / Run8B.
- `showroom/globe/h-earth/render/planetary-world-frame.js`
  - Common spherical presentation transform, radius `420000`.

## Frozen target FAR-ocean source triangles
`5937, 6160, 5936, 5935, 5713`.

The previously established exact R2 correspondence remains binding; e.g. source triangle 5937 -> R2 index offset 92931, and 6160 -> 93600.

## Depth comparison
For each target source cell, the canonical Run8B/G_world elevation and the FAR-ocean `y=0.015` surface were evaluated through the same spherical transform and frozen camera depth axis. 4,941 interior samples were evaluated per target cell.

Positive terrain advantage means Run8B is closer to the camera than FAR ocean at the corresponding physical sample.

| FAR ocean triangle | cell X | cell Z | min terrain advantage | median | max | canonical elevation range |
|---:|---|---|---:|---:|---:|---:|
| 5937 | 0..40 | -128..-104 | +0.06937 | +0.18808 | +0.24050 | 2.05486..7.07270 |
| 6160 | 0..40 | -104..-80 | -0.01098 | +0.08065 | +0.23720 | -0.30714..6.97484 |
| 5936 | 0..40 | -128..-104 | +0.06937 | +0.18808 | +0.24050 | 2.05486..7.07270 |
| 5935 | -40..0 | -128..-104 | +0.06149 | +0.18679 | +0.21237 | 1.82353..6.26566 |
| 5713 | 0..40 | -152..-128 | -0.04963 | +0.06213 | +0.46091 | -1.44662..13.57974 |

## Gate result
1. **5937, 5936 and 5935:** Run8B is strictly in front throughout the sampled cell interiors. FAR ocean is present in the near frustum but should not win ordinary depth-tested visible pixels there.
2. **6160 and 5713:** ownership is mixed. Their cells cross portions where canonical G_world elevation falls below the FAR-ocean `0.015` underlay. In those portions the FAR ocean is physically closer and can legitimately win depth-tested pixels.
3. Therefore the representation defect is narrower than “all giant FAR-ocean fragments are visible”: the FAR ocean improperly occupies the near physical depth domain, and where canonical terrain approaches/crosses sea level it can become the front-most representation. Large projected FAR triangles that remain behind positive-elevation Run8B terrain are occluded if the renderer's depth path is correct.

## Deterministic disposition
- `FAR_OCEAN_IN_ACTIVE_CAMERA_FRUSTUM = PROVEN`
- `FAR_OCEAN_NEAR_FIELD_PRESENCE = PROVEN`
- `FAR_OCEAN_SCREEN_SCALE_GIANT_POLYGONS = PROVEN`
- `RUN8B_DEPTH_OWNERSHIP_5937_5936_5935 = RUN8B_FRONT`
- `RUN8B_DEPTH_OWNERSHIP_6160_5713 = MIXED_WITH_FAR_OCEAN_FRONT_REGIONS`
- `GLOBAL_OCEAN_DENSITY_AS_ROOT_FIX = REJECTED`
- `REPRESENTATION_DOMAIN_OVERLAP_DEFECT = CONFIRMED`
- `GEOMETRY_MUTATION = HELD`

No geometry, renderer, route, deployment, or production authority was mutated by this receipt.
