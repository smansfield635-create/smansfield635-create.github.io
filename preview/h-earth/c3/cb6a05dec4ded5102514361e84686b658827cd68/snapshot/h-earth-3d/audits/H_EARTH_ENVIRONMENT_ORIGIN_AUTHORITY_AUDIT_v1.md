# H-Earth Environment Origin + Authority Audit v1

Status: FROZEN READ-ONLY AUDIT
Purpose: prohibit visual construction without tracing the authoritative source chain first.

## Canonical authority chain

1. **Canonical elevation + coastline truth**
   - `h-earth-3d/terrain/h-earth.terrain-field.js`
   - Contract: `H_EARTH_CANONICAL_TERRAIN_FIELD_RUN_6B_v1`
   - Owns world-space elevation, shoreline, derivatives and normal sampling.
   - Continuous functions: `sampleHEarthTerrainElevation(x,z)`, `sampleHEarthTerrainField(x,z)`, `getHEarthCanonicalShorelineZ(x)`.
   - Does **not** own geometry or renderer.

2. **World manifold / topology authority**
   - `h-earth-3d/terrain/h-earth.world-manifold-domain.js`
   - Contract: `H_EARTH_WORLD_MANIFOLD_DOMAIN_v1`
   - Topology ID: `H_EARTH_CANONICAL_WORLD_TOPOLOGY_G_WORLD_v1`.
   - Every distance representation must sample G_world before representation/planetary transform.

3. **Run 8B derivative terrain field**
   - `h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js`
   - Derives from G_world; explicitly owns no geography/topology.
   - Canonical elevation normalization occurs here.
   - Regional articulation is derived semantics only.

4. **Run 8A resolution contract**
   - `h-earth-3d/control-plane/run-8/h-earth.run8a.dimensional-reconciliation.js`
   - FULL_DETAIL requires base spacing 4 and refinement spacing 2, with refinement triggers for curvature, slope, mountain contribution and formation boundaries.
   - REDUCED_DETAIL is 8/4.
   - Run8B may choose higher resolution but may not choose lower resolution than the contract.

5. **Actual near-to-mid geometry constructor**
   - `showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js`
   - Currently sets `baseSpacingWorldUnits: Math.max(8, FULL_DETAIL.baseSpacingWorldUnits)` and `refinementSpacingWorldUnits: Math.max(4, FULL_DETAIL.refinementSpacingWorldUnits)`.
   - `buildTopology()` samples **only baseSpacingWorldUnits**. The exported refinement spacing and refinement triggers are not executed.
   - Therefore actual terrain is an 8-unit uniform grid, despite the controlling FULL_DETAIL contract requiring 4-unit base / 2-unit refinement.
   - This is the primary resolution-contract divergence.

6. **GEN311 regional relief projection**
   - `showroom/globe/h-earth/render/landscape-preview.js`
   - Adds derived regional relief to already-sampled vertices, then rebuilds the primitive.
   - It does not add samples. Consequently relief can only bend the existing 8-unit grid.
   - Afterwards terrain is projected to the single spherical world manifold.

7. **Shoreline + distant context**
   - Shoreline is constructed independently by `geometry-shoreline.js`, then projected to the same spherical presentation.
   - Distant context is non-navigable representation, not canonical local terrain.

8. **Neutral package + admission/transfer**
   - `run8e-successor-environment.js` composes terrain, shoreline, distant context and vegetation.
   - `h-earth.run8e-successor-environment-transfer.js` preserves membership/correspondence through West admission and Packet 002.

9. **Immutable live render package**
   - `live-render-package.run8e-r2.js` flattens admitted primitives into GPU-ready buffers and records primitive spans/draw ranges.
   - Terrain material is sampled from Run8C at each existing terrain vertex.
   - It is downstream of geometry and must not be used to invent terrain resolution.

10. **GPU upload projection**
    - `gpu-upload-views.run8e-r2d.js` canonicalizes transport, remaps presentation roles, and projects water color from canonical coast distance.
    - This layer is presentation transport, not geometry/topology authority.
    - Post-package triangle subdivision here is prohibited as a terrain-detail strategy.

11. **Renderer**
    - R3C consumes package geometry/materials. It owns drawing only.
    - Shader effects cannot repair missing elevation samples or silhouettes.

## Measured current terrain

Measurement run 35778948916:
- 10,573 terrain vertices
- 20,736 terrain triangles
- median edge 8.0142 units
- p95 edge 11.3694
- max edge 28.6658
- median adjacent-normal delta 0.5136 degrees
- p95 8.4345 degrees
- max 95.3143 degrees

These measurements are consistent with the 8-unit source sampling grid and subsequent spherical projection.

## Root finding

The current visual terrain is not suffering from an unknown source. The origin is fully traceable.

**Primary defect:** the active Run8B geometry constructor downgraded the controlling FULL_DETAIL 4/2 sampling contract to 8/4 and then never executes the refinement phase at all.

**Secondary defect:** GEN311 relief is evaluated only at those coarse vertices, so mountains inherit the coarse grid.

**Tertiary visual defect:** the renderer/material layer has been asked to compensate for missing geometric samples, which cannot repair silhouettes.

**Rejected experiment:** PR #4258 performed midpoint subdivision after package construction. It added no elevation truth and disturbed draw-range correspondence. It is closed and must not be revived.

## Construction law from this audit

The next terrain candidate MUST:
1. sample the existing canonical G_world/Run8B field upstream in `geometry-successor-terrain.run8b.js`;
2. honor FULL_DETAIL base spacing = 4;
3. implement the already-defined 2-unit refinement triggers, or explicitly qualify a bounded first candidate using 4-unit uniform sampling before adaptive refinement;
4. derive normals from the canonical field / rebuilt geometry after sampling;
5. apply GEN311 regional relief at the new source sample coordinates before spherical projection;
6. rebuild primitive spans/draw ranges naturally downstream through the existing package pipeline;
7. leave GPU upload topology unchanged;
8. leave production/live protected until immutable physical acceptance.

## Prohibited shortcuts

- no post-package midpoint subdivision as terrain detail;
- no shader-only substitute for geometry;
- no arbitrary new elevation function;
- no mutation of canonical G_world to improve appearance;
- no Pages deployment for candidate inspection;
- no promotion without same-view physical comparison.

