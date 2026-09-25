# H-Earth R2 final read-only depth-ownership gate v1

Status: EVIDENCE DURABLE / GEOMETRY MUTATION HELD

## Immutable coordinate
- repository: smansfield635-create/smansfield635-create.github.io
- source commit: 53305f5dfcdce51406363cba21c665d4e44701ad
- camera: (28, 10.5, -82) -> (-34, 5.5, -214)
- vertical FOV: 56 degrees
- near/far: 0.25 / 512

## Frozen FAR-ocean witnesses
Source triangles: 5937, 6160, 5936, 5935, 5713.
R2 identity already established by primitiveSpans/index correspondence; e.g. 5937 -> R2 index offset 92931 and 6160 -> 93600.

## Authority read
At the immutable coordinate:
- FAR_OCEAN_CONTINUATION is constructed as a continuous underlay over every ocean-grid cell, including cells with zero water votes. The constructor explicitly increments landUnderlayCellCount but still emits both triangles for those cells.
- Run8B is one connected indexed XZ height field over x [-384,384], z [-736,128]. Therefore every witness cell lies inside Run8B's physical coverage.
- FAR ocean uses regionToHEarthPlanetPoint({x,y:0.015,z}) on radius 420000. At these near-field radii its surface is approximately y=0.015-r^2/(2R), i.e. essentially sea level.
- Run8B samples the canonical G_world terrain field at the same X/Z coordinates.

## Witness depth ownership
Canonical Run8B corner elevations (world units; values shown to 3 decimals):

| FAR ocean source triangle/cell | Run8B corner elevation evidence | Depth-owner disposition |
|---|---|---|
| 5937: X 0..40, Z -128..-104 | (0,-128)=3.402; (40,-128)=6.596; (0,-104)=4.393; (40,-104)=6.980 | RUN8B in front throughout the cell; FAR ocean is underlay |
| 5936: X 0..40, Z -128..-104 | same cell as 5937 | RUN8B in front throughout the cell; FAR ocean is underlay |
| 5935: X -40..0, Z -128..-104 | (-40,-128)=5.822; (0,-128)=3.402; (-40,-104)=1.807; (0,-104)=4.393 | RUN8B in front throughout the cell; FAR ocean is underlay |
| 5713: X 0..40, Z -152..-128 | (0,-152)=0.526; (40,-152)=13.622; (0,-128)=3.402; (40,-128)=6.596 | RUN8B in front throughout the cell; FAR ocean is underlay |
| 6160: X 0..40, Z -104..-80 | inland corners: (0,-104)=4.393; (40,-104)=6.980. Near z=-80 the canonical shoreline is z=-79.255 at x=0 and z=-69.453 at x=40; terrain samples are (0,-80)=-0.311 and (40,-80)=1.072. | MIXED coastal cell. Run8B owns inland pixels; FAR ocean can legitimately become the front surface only across the water/coastal transition where canonical terrain drops below the ocean surface. |

The depth comparison is geometric rather than label-based: both representations occupy the same physical X/Z domain, and the Run8B surface is several world units above the FAR-ocean spherical underlay in 5937/5936/5935/5713. For 6160 the cell straddles the canonical coast, so ownership changes within the cell.

## Final gate result
- FAR_OCEAN_IN_ACTIVE_CAMERA_FRUSTUM = PROVEN
- FAR_OCEAN_WITHIN_NEAR_FIELD = PROVEN
- FAR_OCEAN_SCREEN_SCALE_GIANT_POLYGONS = PROVEN
- R2_EXACT_TRIANGLE_IDENTITY = PROVEN
- RUN8B_OVERLAP_AT_WITNESS_CELLS = PROVEN
- 5937_DEPTH_OWNER = RUN8B
- 5936_DEPTH_OWNER = RUN8B
- 5935_DEPTH_OWNER = RUN8B
- 5713_DEPTH_OWNER = RUN8B
- 6160_DEPTH_OWNER = MIXED_BY_CANONICAL_COAST
- GLOBAL_OCEAN_DENSITY_AS_ROOT_FIX = REJECTED
- FAR_OCEAN_NEAR_FIELD_REPRESENTATION_LAW_DEFECT = PROVEN
- GEOMETRY_MUTATION = HELD

## Interpretation
The largest near-field FAR-ocean fragments are physically present, but four of the five strongest witnesses are not themselves expected to win visible pixels where Run8B covers them: Run8B is geometrically above the ocean underlay there. The fifth witness, 6160, crosses the canonical coast and can own water-side pixels.

Therefore the final gate narrows the visible-facet defect further: screen-filling FAR-ocean source triangles are a demonstrated representation-law defect, while visible-pixel ownership is constrained to gaps/coastal transitions or any renderer/depth correspondence failure. A root repair must enforce representation ownership/near-field exclusion rather than globally densify the ocean.

No geometry, camera, renderer, material, route, or deployment authority was mutated by this evidence operation.
