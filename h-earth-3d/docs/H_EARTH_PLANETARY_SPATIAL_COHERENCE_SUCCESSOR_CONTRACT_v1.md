# H-Earth Planetary Spatial Coherence Successor Contract v1

Operation: `H_EARTH_PLANETARY_SPATIAL_COHERENCE_SUCCESSOR_20260819_001`

Protected parent: `13d1a4af631d5282b741325a57a5f42852e4342c`

Protected geographic floor: `e03363f42441cea7587a49623fd878e8ca51fe28`

Controlling owner/browser evidence: `23894.mp4`, SHA-256 `8b230cde50b6adc57bab5de57b5df09417e5058153d823293381aa3231cee364`.

## Required repair

This successor closes two adjacent presentation defects without reopening Gen311 geography or Gen324/325 locomotion.

1. Elevated views must reveal a true planetary world. Curvature is produced by full region-to-sphere XYZ projection, rotating planet normal/up, and a horizon derived from planet radius plus observer altitude. Screen-space curved-horizon effects and y-only sag are prohibited as globe authority.
2. Distant-world geometry must remain spatially continuous while the observer moves. Far continuation is anchored to one fixed planetary tangent origin. Camera movement may change visibility/distance weighting and frame uniforms, but may not rebuild/recenter the world around the camera.

## Spatial law

The playable Gratitude surface remains an exact local Cartesian tangent patch through radius 1100 world units. A 600-unit annulus transitions into exact spherical continuation of radius 420000. Outside the annulus, x, y and z all participate in spherical projection.

`LOCAL_TANGENT_PATCH -> TANGENT_TO_SPHERE_TRANSITION_ANNULUS -> EXACT_SPHERICAL_CONTINUATION`

## Camera law

Gen325 terrain-supported navigation Y remains a protected floor. R3A may not lower it. Presentation up is derived from the planetary surface normal. Projection far-plane reach must include the derived geometric horizon and the admitted distant continuation envelope.

## Continuity law

For identical world-manifold ring/sector identities, changing only camera position must not change the generated distant geometry coordinates.

`camera move != world-anchor move`

Repeated deterministic inputs must therefore produce stable world geometry and bounded adjacent camera transforms.

## Prohibitions

- no terrain flattening or geography/topology mutation;
- no navigation/collision shrink or expansion;
- no reintroduction of the stale Run8B camera-Y override;
- no camera-relative recentering of far geometry;
- no screen-space fake globe curve;
- no y-only planetary sag;
- no route, deployment, or production authority.

## Qualification

`node h-earth-3d/validation/h-earth.planetary-spatial-coherence.harness.mjs`

PASS requires local tangent preservation, multi-azimuth full-XYZ spherical continuation, normalized planet-relative up, monotonic derived horizon distance, camera-independent far-geometry identity, Gen325 terrain-supported camera-Y preservation through R3A, bounded adjacent presentation states, and zero forbidden authority acquisition.

Owner/browser inspection remains mandatory after machine PASS.