# H-Earth R2 Physical Primitive Attribution — Frozen Evidence

Status: READ-ONLY AUDIT EVIDENCE  
Geometry mutation: HELD  
Repair mutation: HELD  
Immutable source coordinate: `53305f5dfcdce51406363cba21c665d4e44701ad`

## Audit purpose

Identify the exact physical primitive whose indexed triangles correspond to the giant visible facets before authorizing any geometry or representation-law mutation.

The audit does not reason from NEAR/MID/FAR labels. It follows physical geometry into R2 through primitive identity, indexed vertices, projection, clipping, and depth.

## Authority chain established

The historical Packet 001 wet-sand corridor establishes the original provider → South neutral geometry → West/admission → Packet 002 architecture, but Packet 001 is not the current terrain/ocean geometry authority.

For the current environment:

- Run8B constructs successor terrain sampling before South.
- `geometry-shoreline.js` constructs seven shoreline bands before South.
- `geometry-distant-context.js` constructs FAR land and the continuous ocean field before South.
- South triangulates supplied vertices/indices; it does not create coarse sampling.
- West/Packet 002 preserve admitted geometry identity.
- R2 flattens the admitted primitives while preserving exact `primitiveSpans`.
- R2 canonicalization canonicalizes numeric buffers; it does not resample topology.
- The renderer consumes the resulting geometry; it does not create new topology.
- The present 256-cell lattice is semantic/address authority, not runtime geometry creation authority.

## R2 identity invariant

At the frozen source coordinate, `live-render-package.run8e-r2.js` creates one `primitiveSpan` per admitted primitive containing:

- `primitiveIndex`
- `primitiveId`
- `geometryId`
- role / roleCode
- `vertexStart`
- `vertexCount`
- `indexStart`
- `indexCount`
- `triangleCount`

Those spans establish exact primitive identity through the flattened R2 buffers. Attribution does not require guessing vertex ownership.

## Physical primitive measurements

Measured landscape-family results:

| Primitive | Representation | Vertex start/count | Index start/count | Triangles | Approx. X bounds | Approx. Y bounds | Approx. Z bounds | Indexed edge min / median / P90 / max |
| --- | --- | ---: | ---: | ---: | --- | --- | --- | --- |
| Run8B successor terrain | NEAR_TO_MID_OVERLAP | 0 / 10,573 | 0 / 62,208 | 20,736 | -384…384 | -13…78 | -736…128 | 8.0 / 8.0 / 11.3 / 36.1 |
| DRY_SAND_EDGE | NEAR | 10,573 / 514 | 62,208 / 1,536 | 512 | -1024…1024 | -1.5…20.6 | -161.9…-64.4 | 8.0 / 20.0 / 22.3 / 36.0 |
| DAMP_TRANSITION | NEAR | 11,087 / 514 | 63,744 / 1,536 | 512 | -1024…1024 | -2.0…8.1 | -141.9…-54.4 | 8.0 / 10.0 / 13.5 / 26.4 |
| WET_SAND | NEAR | 11,601 / 514 | 65,280 / 1,536 | 512 | -1024…1024 | -2.0…3.9 | -131.9…-50.4 | 4.0 / 8.1 / 9.8 / 20.7 |
| FOAM_CONTACT | NEAR | 12,115 / 514 | 66,816 / 1,536 | 512 | -1024…1024 | -1.2…0.0 | -127.9…-47.2 | 3.2 / 8.1 / 9.4 / 20.0 |
| SHALLOW_WATER | NEAR | 12,629 / 514 | 68,352 / 1,536 | 512 | -1024…1024 | -1.2…0.0 | -124.7…-28.4 | 8.0 / 18.8 / 21.1 / 34.9 |
| NEARSHORE_WATER | NEAR | 13,143 / 514 | 69,888 / 1,536 | 512 | -1024…1024 | -1.2…0.0 | -105.9…7.6 | 8.0 / 36.0 / 37.6 / 51.7 |
| OPEN_WATER | MID | 13,657 / 514 | 71,424 / 1,536 | 512 | -1024…1024 | -1.3…0.0 | -69.9…269.6 | 8.0 / 262.0 / 262.9 / 277.2 |
| FAR_LAND_CONTINUATION | FAR | 14,171 / 415 | 72,960 / 2,160 | 720 | -5987…5987 | -36.5…105.4 | -6001.9…-70.2 | 23.6 / 340.1 / 1264.3 / 1636.0 |
| FAR_OCEAN_CONTINUATION | FAR | 14,586 / 9,040 | 75,120 / 53,088 | 17,696 | -6799.7…6799.7 | -113.4…0.015 | -6799.7…6999.7 | 24.0 / 40.0 / 701.1 / 1697.1 |

These measurements rule out Run8B as the source of kilometer-scale physical facets. They also show that both FAR families have capacity for extremely coarse physical triangles.

## Shoreline control result

The three shoreline water ribbons remain geometrically present, but `SHALLOW_WATER`, `NEARSHORE_WATER`, and `OPEN_WATER` are assigned the invisible translucent water material. Visible water authority is delegated to the continuous ocean.

Therefore the visible continuous ocean, not those finite ribbons, is the critical water primitive for foreground attribution.

## Continuous-ocean overlap law

At the frozen coordinate, `geometry-distant-context.js` constructs the ocean from a nonuniform rectangular field:

- dense central X sampling: -1920…1920 at 40 world units
- dense central Z sampling: -440…920 at 24 world units
- additional coarse outer coordinates reaching approximately X ±6800 and Z -6800…7000

The constructor explicitly records `oceanUnderlayClosesRepresentationGaps = true`.

Critically, every ocean grid cell is indexed. A zero-water-vote cell increments `landUnderlayCellCount` but is still emitted through:

`indices.push(a,e,b,b,e,d)`

Thus FAR ocean physically overlaps near/coastal coordinates and can extend beneath cells classified entirely as land. The FAR label does not spatially restrict it to a distant annulus.

## Frozen camera authority

The immutable `capacity.js` coordinate establishes the public-stage initial projection:

- position: `(28, 10.5, -82)`
- target: `(-34, 5.5, -214)`
- up: `(0, 1, 0)`
- vertical FOV: `56°`
- near: `0.25`
- far: `512`

The renderer consumes compositor-resolved camera authority and performs camera transformation, six-plane clipping, projection, and depth handling.

## FAR-ocean frustum attribution

Using that frozen camera and the immutable ocean geometry, 414 FAR-ocean source triangles survive the camera frustum.

Strong foreground witnesses include:

| Ocean source triangle | Source cell X/Z | Physical edges | Post-clip camera depth | Projected NDC coverage |
| ---: | --- | --- | --- | --- |
| 5937 | X 0→40, Z -128→-104 | 24, 40, 46.65 | 18.6→36.9 | X -0.585→1.0, Y -1.0→-0.472 |
| 6160 | X 0→40, Z -104→-80 | 24, 40, 46.65 | 18.6→32.2 | X -1.0→0.822, Y -1.0→-0.550 |
| 5936 | X 0→40, Z -128→-104 | 24, 40, 46.65 | 32.2→53.9 | X -0.585→0.970, Y -0.550→-0.302 |
| 5935 | X -40→0, Z -128→-104 | 24, 40, 46.65 | 32.2→53.9 | X -1.0→-0.126, Y -0.550→-0.302 |
| 5713 | X 0→40, Z -152→-128 | 24, 40, 46.65 | 36.9→58.6 | X -0.126→0.970, Y -0.472→-0.273 |

These witnesses prove that FAR ocean is not merely a distant backdrop. Ordinary central 24×40-unit ocean cells can become screen-scale projected polygons because the continuous underlay is admitted immediately beside the observer.

Exact R2 correspondence recovered for triangle 5937:

- primitive: `H_EARTH_WORLD_MANIFOLD:FAR_OCEAN_CONTINUATION`
- R2 primitive vertexStart: `14586`
- local vertices: `2995, 3107, 3108`
- flattened R2 vertices: `17581, 17693, 17694`
- R2 primitive indexStart: `75120`
- exact R2 index offset for source triangle 5937: `92931`

Triangle 6160 begins at R2 index offset `93600`.

## Current evidentiary state

Established:

- Packet 001 is historical lineage, not current ocean authority.
- 256 semantic lattice is not the physical facet source.
- South does not introduce the coarse sampling.
- West / Packet 002 preserve geometry.
- R2 does not resample geometry.
- Run8B giant physical facets are ruled out by measured edge scale.
- FAR ocean near-field overlap is proven by construction and projection.
- FAR ocean includes land-underlay triangles.
- FAR ocean produces screen-scale fragments inside the active camera frustum.
- Global ocean densification is not established as the root repair and is held.

Not yet established:

- Whether the identified FAR-ocean fragments actually win the renderer depth test over Run8B at the exact shared projected pixels.
- Whether FAR land wins any of the specific giant-facet pixels in the observed capture.

## Final read-only gate

For ocean source triangles `5937`, `6160`, `5936`, `5935`, and `5713`:

1. Rasterize/project according to the frozen renderer law.
2. Identify Run8B source triangles covering the same projected pixels.
3. Compare interpolated camera-space depth at each shared pixel.
4. Record ocean depth, terrain depth, winning primitive, winning source triangle, and won-pixel coverage.
5. Perform the same check for relevant FAR-land fragments.
6. Do not authorize a repair until the visible giant-facet pixel ownership is identified.

## Gate

`GEOMETRY_MUTATION = HELD`

`REPRESENTATION_LAW_REPAIR = HELD`

`IMMUTABLE_COORDINATE = 53305f5dfcdce51406363cba21c665d4e44701ad`

`NEXT = EXACT_OCEAN_VS_RUN8B_VS_FAR_LAND_DEPTH_OWNERSHIP`
