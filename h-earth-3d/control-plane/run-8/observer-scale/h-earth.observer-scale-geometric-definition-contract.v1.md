# H-Earth Observer-Scale Geometric Definition Contract v1

Status: CONSTRUCTION CANDIDATE — GEOMETRY-ONLY A/B
Base authority: current main
Observer envelope: 0..18 world units
Morphology authority: PRESERVE EXISTING B2.2 / CURRENT FIELD AUTHORITY
Merge/deployment/publication: HELD PENDING QUALIFICATION

## Purpose

Determine whether the current visible-definition bottleneck is geometric realization rather than morphology by changing only terrain vertex realization.

## Controlled A/B

A — CURRENT AUTHORITY
- current Run8B 8-world-unit X/Z grid
- current B2.2/current-authority terrain field unchanged
- current observer/camera/FOV unchanged
- current renderer/compositor/material/light/environment unchanged
- current package/GPU transport unchanged

B — FIRST GEOMETRIC-DEFINITION CANDIDATE
- identical terrain field and morphology authority as A
- identical observer/camera/FOV
- identical renderer/compositor/material/light/environment
- identical package/GPU transport
- Run8B base geometric realization = 4 world units in X and Z
- each B vertex samples the authoritative field at that exact (x,z)
- Phase-3 elevation information must be materialized at the 4-unit vertices rather than existing only between 8-unit parents
- no morphology retuning, new erosion/gully/terrace law, material retuning, lighting change, camera change, or shader displacement is admissible

## Phase-3 rule

PR #4575 is evidence, not authority. Its residual formulation may be reused only if it is proven to represent already-established Phase-3 elevation information and does not introduce a new morphology variable. Parent 8-unit vertices must remain numerically identical to A. New 4-unit vertices must record:
- base field elevation
- Phase-3 elevation/residual contribution
- final CPU vertex elevation
- final GPU-bound Float32 elevation

## Observer-scale measurement

For the fixed canonical observer and the direct 0..18-world-unit view envelope, both A and B must emit:
1. terrain vertices in envelope
2. terrain triangles intersecting envelope
3. nearest-neighbor vertex spacing distribution
4. all triangle edge lengths and min/median/p95/max
5. longitudinal samples across view distance at 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 world units where field sampling is valid
6. CPU elevation at each measured terrain vertex
7. corresponding immutable-package elevation
8. corresponding GPU-bound Float32 elevation
9. maximum absolute CPU→package and package→GPU elevation delta
10. visible facet size, defined geometrically as triangle world-space area plus projected screen-space area when browser qualification is executed

## Required cardinality proof

The measurement must separately report full terrain primitive vertex/triangle/index counts and 0..18 envelope counts. It must prove that B contains the expected 4-unit materialization and that no downstream stage decimates, substitutes, or restores the 8-unit terrain.

## Invariants

A and B must share exact identities/hashes where applicable for:
- field/morphology source
- observer/navigation state
- camera and FOV
- renderer
- compositor
- material inputs
- lighting/environment inputs
- non-terrain geometry
- GPU transport implementation

The only intended product delta is terrain topology density plus sampling of already-authorized Phase-3 elevation information onto the new vertices.

## Qualification gates

PASS requires all of:
- A proves 8-unit current authority.
- B proves 4-unit base realization in the observer envelope.
- A/B 8-unit parent coordinates and elevations are identical within canonical numeric tolerance.
- B's new 4-unit vertices carry the established Phase-3 elevation information.
- CPU terrain vertex/index counts equal package terrain span counts.
- package terrain positions equal GPU-bound terrain positions subject only to Float32 transport.
- no renderer/material/camera/environment mutation.
- measurement receipt contains every observer-envelope metric above.

Any missing correspondence is FAIL-CLOSED. Visual preference alone cannot qualify B.

## Stopping boundary

Do not merge, deploy, publish, or resume morphology escalation from this contract alone. First construct B and produce the geometry-only A/B measurement receipt.
