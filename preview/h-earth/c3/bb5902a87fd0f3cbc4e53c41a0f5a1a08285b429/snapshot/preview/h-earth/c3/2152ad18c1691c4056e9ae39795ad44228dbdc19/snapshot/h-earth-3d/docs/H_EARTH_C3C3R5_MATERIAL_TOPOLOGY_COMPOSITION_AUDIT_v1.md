# H-Earth C3C3R5 Material / Topology Composition Audit v1

## Why this audit layer exists

Owner inspection established a separate perceptual regression that is not explained by the root spatial-frame defect alone: the terrain still contains explicit 16x16 cell-depth geometry, but the current color/presentation layer makes that structure difficult to perceive.

This audit therefore adds a distinct layer between geometry construction and final rendering:

`TERRAIN TOPOLOGY -> STRUCTURAL BASE MATERIAL -> TRANSLUCENT REGIONAL COLOR COMPOSITION -> LIGHTING/NORMAL RESPONSE -> ATMOSPHERIC PRESENTATION -> OWNER PERCEPTION`

The question is not whether the grid exists. The question is whether the presentation stack allows the existing terrain topology to remain visually legible while adding the required environmental color.

## Finding M1 — the grid is real geometry, not an overlay

`showroom/globe/h-earth/render/geometry-landscape.js` already constructs the 16x16 perceptual cell structure in world-space geometry.

The governing profile is:

- `cellCountPerAxis: 16`
- `seamWidthWorldUnits: 7.5`
- `seamDepthWorldUnits: 0.72`
- `shoulderWidthWorldUnits: 18`
- `shoulderLiftWorldUnits: 0.14`
- `literalOverlayProhibited: true`

The relief is added directly to terrain vertex elevation through `perceptualGridRelief(x,z)`. Therefore the grid is not missing from the underlying geometry.

## Finding M2 — the current color layer is applied after geometry and can perceptually suppress it

`showroom/globe/h-earth/render/functional-landscape-frame.js` decorates admitted terrain after geometry construction.

For terrain and distant land it assigns a new `renderMaterial` using one of several muted subtropical RGBA palettes and declares `transparencyClass: OPAQUE`.

This does not delete the geometric grid. However, it can perceptually mask the relief because the final visible terrain is dominated by broad, low-contrast opaque color assignments at terrain-chunk scale while the cell relief is only 0.72 world units deep.

The present presentation therefore allows this failure mode:

`GRID GEOMETRY PRESENT + OPAQUE COLOR REPLACEMENT + WEAK LOCAL CONTRAST = GRID PERCEPTUALLY LOST`

## Finding M3 — translucency belongs to the color layer, not to the structural ground

Owner direction clarifies the intended material architecture: the environmental color itself should be translucent and spatially variant, while the structural terrain underneath remains an opaque depth-bearing surface.

The rejected architecture is:

`ONE TERRAIN SURFACE WITH ITS ENTIRE MATERIAL MADE PARTIALLY TRANSPARENT`

That would allow sky or unrelated background geometry to leak through the ground.

The accepted architecture is a two-layer composition:

`OPAQUE STRUCTURAL TERRAIN + TRANSLUCENT REGIONAL COLOR LAYER`

The structural base carries geometry, cell seams, shoulder relief, normals, slope response, lighting and depth. The translucent color layer carries climate/region chroma and varies according to location, terrain role and environmental causes. Because the color layer is composited over the same terrain topology rather than replacing it, the grid can perform the depth work while the color performs the chromatic work.

## Accepted deficiency

`D6 — MATERIAL_TOPOLOGY_PERCEPTUAL_OCCLUSION`

Definition:

The terrain cell topology is present in world-space geometry but is not reliably legible after opaque subtropical material decoration, lighting and atmospheric composition. The presentation layer is suppressing an intended spatial cue without deleting its source geometry.

## Governing repair strategy

The repair must preserve both layers simultaneously:

`TOPOLOGICAL DEPTH + ENVIRONMENTAL COLOR`

Required strategy:

1. Preserve the existing 16x16 world-space grid relief. Do not replace it with a literal line overlay.
2. Preserve an opaque structural terrain base so depth, normals, slope, seams and occlusion remain physically coherent.
3. Replace the current opaque color-replacement treatment with a translucent regional color composition layered over the structural terrain.
4. Make the color spatially variant. Chroma/intensity may vary by terrain chunk, physical role, elevation, slope, drainage/coastal influence and other already-authorized environmental causes; it must not collapse into one uniform wash.
5. The translucent color layer must not create see-through ground. Its compositing target is the structural terrain surface, not the sky/background.
6. Increase local terrain-form readability through normal response, slope response, seam/shoulder micro-contrast and restrained albedo variation in the structural base.
7. Do not create black grid lines, board-game styling, neon seams, or technical overlays.
8. Evaluate the ground from normal owner camera heights and headings; close-up debug views are insufficient.
9. Compare against the preserved positive baseline in which the grid/depth read clearly.

## Recommended implementation boundary

The first implementation target remains `decorateSubtropicalPrimitive()` in `functional-landscape-frame.js`, but the material contract must now separate structural material authority from color-composition authority.

The required downstream representation is conceptually:

- `structuralMaterial`: opaque, topology/depth-bearing;
- `regionalColorOverlay`: translucent, spatially variant, non-depth-authoritative;
- both bound to the same terrain geometry identity.

If the current renderer transport supports only one RGBA material per primitive, that is now an explicit lower-layer limitation and must be repaired in the material/render transport rather than forcing the geometry to compensate.

A lawful implementation may use a second draw/material pass or an equivalent shader composition, provided the structural surface remains depth-authoritative and the color overlay does not become a separate floating geometric sheet.

## Qualification additions

A future C3C3R5 visual gate must separately prove:

- `gridGeometryPresent == true`
- `literalGridOverlay == false`
- `opaqueStructuralTerrainPresent == true`
- `translucentRegionalColorCompositionPresent == true`
- `regionalColorSpatiallyVariant == true`
- `terrainTopologyVisuallyLegible == true`
- `colorDoesNotEraseTopology == true`
- `groundBackgroundLeakage == false`
- `normal/slope/seam response contributes to legibility == true`

Machine geometry checks alone cannot satisfy the perceptual requirements. Reference render comparison is mandatory.

## Deterministic continuation

The active root-spatial cycle now has two independent but converging repair tracks:

`ROOT SPATIAL COHERENCE`

and

`MATERIAL / TOPOLOGY COHERENCE`

The material track is now explicitly:

`WORLD-SPACE GRID RELIEF -> OPAQUE STRUCTURAL TERRAIN -> TRANSLUCENT SPATIALLY-VARIANT COLOR -> LIGHTING/NORMAL RESPONSE -> FINAL COMPOSITION`

They converge before owner inspection:

`TRUE PLANET FRAME + PLANET CAMERA + WORLD-SPACE HORIZON + OPAQUE DEPTH BASE + TRANSLUCENT VARIANT COLOR -> COMPOSITION AUDIT -> VISUAL QUALITY AUDIT -> OWNER INSPECTION`

No production merge is authorized by this audit document alone.
