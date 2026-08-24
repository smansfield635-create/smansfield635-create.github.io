# H-Earth C3C3R5 Planet-Relative Camera Integration v1

## Governing deficiency

The root-spatial audit established that C3C3R4 changed distant geometry while the camera remained an ordinary Cartesian look-at camera with an independently authored up vector and screen-space horizon substitution. That allowed planetary continuation and camera orientation to disagree.

## Change installed

`showroom/globe/h-earth/render/functional-landscape-frame.js` now binds every functional-landscape camera to `H_EARTH_C3C3R5_REGION_TO_PLANET_SPHERICAL_FRAME_v1`.

The camera layer now consumes the same planetary authority used by OPEN_WATER and distant land. It derives:

- camera `up` from `getHEarthPlanetRelativeUp(position)`;
- local tangent basis from `getHEarthRegionTangentBasis(position)`;
- observer height from the camera position;
- geometric horizon distance from planet radius and observer height;
- camera/target spatial classes from `regionToHEarthPlanetPoint()`.

## Preservation law

The playable H-Earth remains an exact local Cartesian tangent patch. Navigation/collision extents are not expanded. Since ordinary navigation stays inside the protected tangent radius, normal local movement retains the established local coordinate behavior while the camera is now mathematically bound to the planetary frame.

## Horizon authority correction

The functional frame now declares:

- `geometricWorldSpaceHorizonRequired: true`;
- `screenSpaceCurvedHorizonAuthorityProhibited: true`;
- `curvedHorizonHazeRequired: false`.

The frame no longer treats an independently authored screen-space curved haze line as planetary truth. The next renderer-layer repair must remove the fullscreen shader's fixed viewport-space curved-horizon formula and render atmosphere without overriding the world-space geometric horizon.

## Acceptance requirements for this layer

1. Functional frame camera `up` must equal the shared planet-relative up derived at the camera position.
2. Camera tangent basis and geometric horizon distance must be present in the frame receipt.
3. Local navigation/collision authority must remain unchanged.
4. No fixed screen-space horizon may be declared authoritative by the frame.
5. The renderer must be repaired next so it does not visually contradict this camera/world model.

## Deterministic continuation

`TRUE REGION->PLANET XYZ TRANSFORM -> PLANET-RELATIVE CAMERA/UP -> RETIRE SCREEN-SPACE HORIZON -> WORLD-SPACE ATMOSPHERE/HORIZON -> COMPOSITION AUDIT -> OWNER INSPECTION`

This document records implemented behavior; it does not authorize production merge or owner inspection by itself.
