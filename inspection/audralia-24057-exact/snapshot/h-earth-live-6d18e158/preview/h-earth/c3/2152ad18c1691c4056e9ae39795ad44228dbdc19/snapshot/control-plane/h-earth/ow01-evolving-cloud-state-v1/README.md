# H-Earth OW01 Evolving Cloud State v1

Status: `NONPRODUCT_STATE_AUTHORITY_CANDIDATE`

Issue: `#753`

Governing main: `def62786f469a5a9d0027898810d4878642dbf32`

Protected visual parent: `8381f3323261b4facf70ec1f236c015b7d5df5a9`

## Purpose

This package is the immediate bridge between the frozen Audralia planetary reference frame and the next live cloud candidate.

It intentionally does **not** construct a full numerical weather model. It freezes the persistent state that believable moving clouds require so the visual system can move, grow, shear, mature, decay and transition without camera-dependent regeneration.

## Governing chain

`PLANETARY REFERENCE FRAME`

→ `LIGHTWEIGHT WORLD-ANCHORED ENVIRONMENTAL DRIVER`

→ `PERSISTENT CLOUD SYSTEM STATE`

→ `ONE 3D DENSITY AUTHORITY`

→ `ORBITAL / LOCAL OBSERVATION`

## Cloud identity

Each cloud system has a durable ID and a deterministic seed. Its position is longitude/latitude plus physical base/top altitude. Its motion is expressed as east/north wind in the frozen planetary frame. Its lifecycle and morphology may evolve, but changing camera distance cannot change its identity.

## WMO genera

The contract contains all ten cloud genera:

`Ci Cc Cs Ac As Ns Sc St Cu Cb`

The genus table defines broad physical altitude/morphology/phase constraints for visual weather. It is not a numerical forecast model and does not claim exact meteorological reproduction.

## Evolution

Lifecycle phases are:

`FORMING -> GROWING -> MATURE -> DECAYING -> DISSIPATED`

Motion uses spherical east/north tangent advection. Density, size, shear, optical depth and vertical extent can vary continuously with support and lifecycle phase.

Declared genus transitions are bounded. Examples include `Cu -> Cb`, Cumulonimbus high-level outflow expressed as `Ci/Cs`, `As -> Ns`, and `St <-> Sc`.

## Noise boundary

Procedural structure may erode or detail an already-supported cloud volume. Noise may not create cloud support or replace cloud-system identity.

## Rendering boundary

The physical cloud state is stored in km. This package deliberately does not freeze the authoring-space vertical exaggeration/clearance used by the first renderer candidate. That mapping must be calibrated against the accepted terrain and atmosphere while preserving the same cloud state.

Both orbital and local rendering must observe the same state/density authority.

## Full weather simulation

The deeper research in issue #746 / PR #748 / PR #750 remains available as a future environmental driver. It does not gate the visual cloud program.

## Verification

Run:

`node tools/h-earth-ow01-evolving-cloud-state/verify.mjs`

The verifier checks taxonomy completeness, altitude validity, camera-independence, lifecycle ordering, declared transitions, deterministic spherical advection, longitude wrapping, latitude bounds and identical repeated evaluation of a fixed cloud fixture.
