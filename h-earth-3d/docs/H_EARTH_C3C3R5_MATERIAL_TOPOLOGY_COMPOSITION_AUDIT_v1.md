# H-Earth C3C3R5 Material / Topology Composition Audit v1

## Why this audit layer exists

Owner inspection established a separate perceptual regression that is not explained by the root spatial-frame defect alone: the terrain still contains explicit 16x16 cell-depth geometry, but the current color/presentation layer makes that structure difficult to perceive.

This audit therefore adds a distinct layer between geometry construction and final rendering:

`TERRAIN TOPOLOGY -> MATERIAL/TINT COMPOSITION -> LIGHTING/NORMAL RESPONSE -> ATMOSPHERIC PRESENTATION -> OWNER PERCEPTION`

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

This does not delete the geometric grid. However, it can perceptually mask the relief because the final visible terrain is dominated by broad, low-contrast color assignments at terrain-chunk scale while the cell relief is only 0.72 world units deep.

The present presentation therefore allows this failure mode:

`GRID GEOMETRY PRESENT + STRONG OPAQUE COLOR FIELD + WEAK LOCAL CONTRAST = GRID PERCEPTUALLY LOST`

## Finding M3 — simply lowering alpha is not the correct repair

The owner's intuition that the color layer should be "lighter" is directionally correct, but literal transparency is not the desired mechanism. Making opaque ground partially transparent would reveal sky/background through terrain rather than reveal the terrain's own topology.

The correct operation is to reduce how aggressively the color layer replaces the terrain's underlying material/light response.

The color should act as a tint/compositional contribution, not as a visually flattening replacement surface.

## Accepted deficiency

`D6 — MATERIAL_TOPOLOGY_PERCEPTUAL_OCCLUSION`

Definition:

The terrain cell topology is present in world-space geometry but is not reliably legible after subtropical material decoration, lighting and atmospheric composition. The presentation layer is therefore suppressing an intended spatial cue without deleting its source geometry.

## Governing repair strategy

The repair must preserve both layers simultaneously:

`TOPOLOGICAL DEPTH + ENVIRONMENTAL COLOR`

Required strategy:

1. Preserve the existing 16x16 world-space grid relief. Do not replace it with a literal line overlay.
2. Preserve subtropical regional color, but change it from a wholesale per-chunk replacement toward a bounded tint/composition model.
3. Increase local terrain-form readability through physically related cues: normal response, slope response, seam/shoulder micro-contrast, and restrained albedo variation.
4. Do not create black grid lines, board-game styling, neon seams, or technical overlays.
5. Do not use transparency to expose the grid.
6. Evaluate the ground from normal owner camera heights and headings; close-up debug views are insufficient.
7. Compare against the preserved positive baseline in which the grid/depth read clearly.

## Recommended implementation boundary

The first implementation target is `decorateSubtropicalPrimitive()` in `functional-landscape-frame.js`, not `geometry-landscape.js`.

Reason: geometry already contains the required topology. The suspected suppression is introduced after that geometry exists.

The material decorator should stop treating the palette as a complete replacement color and instead carry a bounded terrain tint/intensity contract that the render-material path can combine with terrain geometry/normal response.

If the current renderer transport cannot express tint strength or terrain-form modulation, that limitation must be surfaced as the next lower presentation-layer deficiency rather than altering the grid geometry to compensate.

## Qualification additions

A future C3C3R5 visual gate must separately prove:

- `gridGeometryPresent == true`
- `literalGridOverlay == false`
- `subtropicalColorPresent == true`
- `terrainTopologyVisuallyLegible == true`
- `colorDoesNotEraseTopology == true`
- `terrainNotTransparent == true`
- `normal/slope/seam response contributes to legibility == true`

Machine geometry checks alone cannot satisfy the last three perceptual requirements. Reference render comparison is mandatory.

## Deterministic continuation

The active root-spatial cycle now has two independent but converging repair tracks:

`ROOT SPATIAL COHERENCE`

and

`MATERIAL / TOPOLOGY COHERENCE`

They converge before owner inspection:

`TRUE PLANET FRAME + PLANET CAMERA + WORLD-SPACE HORIZON + TOPOLOGY-PRESERVING MATERIAL COMPOSITION -> COMPOSITION AUDIT -> VISUAL QUALITY AUDIT -> OWNER INSPECTION`

No production merge is authorized by this audit document alone.
