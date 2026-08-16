# H-Earth C3C3R5 Renderer World-Space Horizon Reconciliation v1

## Governing deficiency

The root-spatial audit established that the prior persistent WebGL renderer drew an atmospheric horizon directly in viewport coordinates using a fullscreen fragment shader. That screen-space curve could visually contradict the actual region-to-planet transform and planet-relative camera, allowing the renderer to manufacture a false globe signal independently of world geometry.

## Change installed

`showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js` now removes the viewport-space curved-horizon formula from the atmospheric presentation shader.

The atmospheric pass now provides only:

- sky zenith-to-horizon color gradient;
- restrained lower-atmosphere haze;
- world-established sun presentation;
- low-amplitude aerial variation.

It no longer computes or paints a curved horizon line from `vUv`, lateral screen position, or any other fixed viewport formula.

## Authority law

Planetary horizon shape is now owned by:

`REGION_TO_PLANET_SPHERICAL_FRAME -> PLANET_RELATIVE_CAMERA -> WORLD_SPACE_OCEAN_AND_LAND_GEOMETRY -> DEPTH_OCCLUSION`

The renderer receipt now records:

- `screenSpaceCurvedHorizonAuthority: false`;
- `worldSpaceGeometryOwnsHorizon: true`;
- `planetRelativeCameraOwnsOrientation: true`.

The fullscreen atmospheric pass remains an enclosure/background only. It must not create, substitute, or reshape planetary geometry.

## Preservation law

This change does not alter navigation authority, collision authority, local terrain coordinates, shoreline authority, draw-range identity, GPU upload identity, or the existing offscreen/presentation transport.

## Acceptance requirements for this layer

1. No shader path may derive planetary curvature from viewport x/y coordinates.
2. World-space geometry must remain visible against the atmospheric background and therefore define the actual horizon silhouette through depth.
3. Renderer lifecycle/resource stability requirements remain unchanged.
4. The owner baseline sky/depth character must not collapse into gray or transparent fallback.
5. This layer alone does not establish product success; the terminal-edge, reveal-composition, functional qualification, and visual/experiential audit must still pass.

## Deterministic continuation

`TRUE REGION->PLANET XYZ TRANSFORM -> PLANET-RELATIVE CAMERA/UP -> SCREEN-SPACE HORIZON RETIRED -> TERMINAL EDGE / HORIZON AUDIT -> COMPOSED OCEAN REVEAL -> FUNCTIONAL QUALIFICATION -> VISUAL / EXPERIENTIAL AUDIT -> OWNER INSPECTION`

This document records implemented behavior. It does not authorize production merge or owner inspection by itself.
