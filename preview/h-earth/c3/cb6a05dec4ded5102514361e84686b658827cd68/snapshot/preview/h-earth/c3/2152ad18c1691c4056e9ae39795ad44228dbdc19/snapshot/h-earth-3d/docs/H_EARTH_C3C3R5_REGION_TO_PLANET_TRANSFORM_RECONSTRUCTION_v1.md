# H-Earth C3C3R5 Region-to-Planet Transform Reconstruction v1

## Status

`CONSTRUCTION_ACTIVE / ROOT_SPATIAL_REPAIR`

Parent failed candidate: `c39ac363f9129163872f9d2dbcc9f274da7d989d` (C3C3R4 / PR #1211).

Governing root deficiency: `D5 — ROOT_SPATIAL_MODEL_MISMATCH`.

## Why C3C3R4 failed

C3C3R4 called its continuation planetary, but its transform retained local planar `x` and `z` and changed only vertical `y` by subtracting a radial sag term. This bent a Cartesian sheet downward without changing the world manifold, surface orientation, or local normal. The owner-observed convex ocean wall/dome was therefore consistent with the implementation.

The former implementation also treated `visibleHorizonRadius` as an independent constant, rather than deriving horizon distance from planet radius and observer height.

## Replacement law

C3C3R5 replaces the rejected law:

`X_Z_UNCHANGED + Y_SAG`

with:

`REGION COORDINATE -> TANGENT CHART -> SPHERICAL PLANET POINT XYZ + PLANET NORMAL`.

For radial local displacement `rho = hypot(x,z)` and planet radius `R`, the exact spherical continuation uses angular displacement `theta = rho / R` and reconstructs all coordinates:

- horizontal radius: `(R + h) * sin(theta)`;
- vertical position: `(R + h) * cos(theta) - R`;
- x/z direction: the normalized local radial direction multiplied by the spherical horizontal radius.

Thus x, y, and z all participate in curvature.

## Local playable preservation

The playable H-Earth remains an exact Cartesian tangent patch within `protectedTangentRadius = 1100` world units. No navigation, collision, shoreline, or local terrain authority is expanded or forced onto the sphere.

A deterministic `transitionWidth = 600` world-unit annulus blends local tangent coordinates into the exact spherical continuation. Outside that annulus, continuation is exact spherical geometry.

This creates two explicit spatial classes in one environment:

1. `LOCAL_TANGENT_PATCH` — existing playable/local authority;
2. `EXACT_SPHERICAL_CONTINUATION` — visible non-navigable planetary continuation;

with `TANGENT_TO_SPHERE_TRANSITION_ANNULUS` as the bounded handoff between them.

## Planet scale correction

C3C3R4 used an effective radius of `12000`, which placed the geometric horizon implausibly close to the observer and contributed to the dome/wall appearance.

C3C3R5 uses `exactSphereRadius = 420000` and `nominalObserverHeight = 12` world units. Horizon distance is no longer a free visual parameter. It is derived from:

`d = sqrt((R + h)^2 - R^2)`.

The resulting nominal geometric horizon is approximately 3.17k world units from the local observer, allowing the visible continuation to fall away gradually rather than rising into a conspicuous artificial wall.

## New transform interface

`planetary-world-frame.js` now exposes:

- `regionToHEarthPlanetPoint(point)` — full XYZ region-to-planet projection;
- `projectHEarthVisibleContinuationPoint(point)` — compatibility alias with new full-XYZ semantics;
- `getHEarthPlanetSurfaceNormal(point)` — planet-relative surface normal;
- `getHEarthPlanetRelativeUp(point)` — camera/up authority input;
- `getHEarthRegionTangentBasis(point)` — east/up/north tangent basis;
- `getHEarthDerivedHorizonDistance(observerHeight)` — geometric horizon derived from planet scale and observer altitude;
- compatibility horizon helpers whose radius is now derived, not independently declared.

## Immediate consumers

Existing OPEN_WATER and distant-land continuation already consume `projectHEarthVisibleContinuationPoint`. Because that function has been replaced at the shared authority, both consumers now receive the new full-XYZ spherical mapping without requiring another independent edge-specific curvature formula.

## Still required before owner inspection

This file does not claim the root-spatial repair is complete. The next construction objects must bind the deeper frame consistently through the rest of the stack:

1. camera/up orientation must consume `planetRelativeUp` / tangent basis rather than remaining permanently tied to global Cartesian +Y;
2. the renderer's screen-space curved-horizon substitution must be retired as globe authority;
3. distant continuation terminals must be verified to fall below/behind the derived geometric horizon rather than exposing authored far edges;
4. the mountain-pass ocean reveal must be explicitly composed and visually audited;
5. objective rendered comparison against the preserved owner baseline is mandatory before another owner inspection link is delivered.

## Acceptance law

`FUNCTIONAL_CORRECTNESS + ROOT_SPATIAL_COHERENCE + MATERIAL_VISUAL_DIFFERENCE + PRESERVATION = ELIGIBLE_FOR_OWNER_INSPECTION`.

Numeric curvature, metadata, perspective change, or machine-only assertions are insufficient.

## Prohibitions

- no return to y-only sag as planetary authority;
- no independently authored fixed horizon radius;
- no viewport/screen-space curve may qualify as proof of planetary geometry;
- no expansion of local navigation/collision merely to support visible continuation;
- no owner handoff until a visual/experiential audit establishes material improvement against the preserved baseline.
