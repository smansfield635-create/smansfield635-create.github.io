# H-Earth C3C3R5 D12 Visual / Experiential Closure Protocol v1

## Purpose

D12 is the final gate between machine-correct construction and owner inspection. It exists because previous H-Earth cycles proved that valid geometry, metadata, and browser execution can still produce no meaningful visual improvement.

## Governing law

`FUNCTIONAL PASS != PRODUCT PASS`

`PERSPECTIVE CHANGE != OBJECTIVE IMPROVEMENT`

A C3C3R5 candidate may reach owner inspection only after both machine qualification and an independent multi-view visual audit establish a material improvement against the preserved owner baseline.

## Baseline-bound objectives

The audit must judge the candidate against the owner-defined objectives, not against arbitrary camera differences.

Required objective axes:

1. **Globe perception** — H-Earth must read as a region embedded in a curved world rather than a rectangular patch with decorated edges.
2. **No ocean dome/wall** — planetary curvature must not present as a giant convex water wall, bowl, curtain, or screen-space arc.
3. **No rectangular terminals** — former corners/edges must resolve as coastline wrap, headland, valley, distant silhouette, atmospheric occlusion, or planetary fall-away.
4. **Ocean reveal composition** — the east-facing mountain/pass composition must materially frame the existing open ocean from at least one ordinary owner viewpoint.
5. **Grid-depth legibility** — the terrain must visibly retain the structural grid/cell depth language from normal camera heights.
6. **Color/topology marriage** — regional/environmental color must remain present and spatially variant without erasing terrain depth.
7. **Preservation** — navigation, collision, shoreline authority, usable region scale, and established positive environmental qualities must not regress.

## Evidence capture

The exact-head workflow must capture multiple ordinary owner viewpoints from the actual public renderer, not isolated geometry-provider renders.

Required evidence:

- exact candidate SHA;
- initial owner-like view;
- a yaw scan covering the surrounding world;
- actual canvas pixels from the canonical live renderer;
- runtime-ready state during every captured view;
- no reliance on metadata as visual proof.

The capture harness is:

`h-earth-3d/validation/h-earth.c3c3r5.visual-audit-capture.browser.mjs`

Its receipt may state only `CAPTURE_COMPLETE_NOT_VISUAL_PASS`. Human/vision inspection of the captured pixels is required for the D12 disposition.

## Disposition rules

### PASS_TO_OWNER_INSPECTION

Allowed only when the evidence establishes all seven objective axes above and no material regression is visible.

### REPAIR_REQUIRED

Required when any of the following is true:

- the world still reads as a box;
- curvature is mathematically present but visually reads as a wall/dome;
- corners remain visibly rectangular;
- the intended ocean reveal is absent or trivial;
- terrain grid/depth remains suppressed;
- color remains cartoonishly dominant or visually flattening;
- a different camera angle is the only apparent change;
- the evidence does not actually show the live candidate.

## Inspection-route law

An immutable owner inspection route may be materialized only after D12 yields `PASS_TO_OWNER_INSPECTION`.

The preview must bind to the exact candidate tree that passed both machine qualification and visual audit. Preview materialization must not alter product bytes.

## Production law

Owner inspection remains authoritative after D12. Production merge is prohibited until explicit owner acceptance.
