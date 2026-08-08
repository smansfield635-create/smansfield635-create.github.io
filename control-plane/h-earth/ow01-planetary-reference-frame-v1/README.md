# Audralia Planetary Reference Frame v1

`STATUS = CANDIDATE_PENDING_DETERMINISTIC_VERIFICATION`

This package establishes a planet-wide geographic frame for climate, moving cloud systems, future weather, ecology, navigation, and any later seasonal/orbital work without moving the accepted Gratitude geometry.

## Frozen placement

Gratitude center is assigned:

- latitude: `30 degrees N`
- longitude: `0 degrees E`

At Gratitude center the existing authoring tangent directions become:

- `+X = east`
- `-X = west`
- `-Z = north`
- `+Z = south`
- `+Y = local up`

The north/rotation axis is `[0, 0.5, -0.8660254037844386]`.

The prime-meridian equatorial direction is `[0, 0.8660254037844386, 0.5]`.

No terrain, coastline, renderer, camera, or gesture coordinate is rewritten. The geographic frame is an interpretation layer over the already accepted spherical geometry.

## Cloud-program consequence

All persistent cloud systems may now own canonical `(longitude, latitude, altitude, time)` state and real compass-relative advection. Camera scale is observation only and must not alter cloud identity or orientation.

The full numerical weather program remains future research. It is not a prerequisite for the first research-grounded evolving cloud visual system.

## Deliberately unresolved

- rotation period;
- axial tilt;
- orbital season phase;
- detailed climate normals;
- ocean-current climatology.

These may be frozen later when required by seasons or deeper climate simulation. They must not be guessed by the cloud renderer.

## Verification

Run:

`node tools/h-earth-ow01-planetary-reference-frame/verify.mjs`

The verifier checks orthonormality, Gratitude's `30 N / 0 E` placement, local compass orientation, pole/equator derivation, round-trip geographic transforms, and the eastward positive-rotation convention.
