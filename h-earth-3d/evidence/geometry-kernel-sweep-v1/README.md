# Geometry Kernel: swept-passage construction candidate v1

This opt-in companion adds reusable three-dimensional passage construction to
the existing kernel. It places a convex cross-section along a finite open route,
with an explicit horizontal and vertical scale at each station, and independently
selected start/end caps. It returns an ordinary South neutral geometry/primitive
record. Existing West admission remains a separate caller action.

Status: qualified engineering candidate; no product adoption, visual acceptance,
merge or live publication is established by this package.

## Use

```js
import {constructHEarthSweptPassageMesh} from
  './showroom/globe/h-earth/render/geometry-kernel.sweep.v1.js';

const result = constructHEarthSweptPassageMesh({
  primitiveId: 'passage-study',
  centerline: [
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: 10},
    {x: 5, y: 2, z: 20}
  ],
  profile: [
    {x: -2, y: -1}, {x: 2, y: -1},
    {x: 2, y: 3}, {x: -2, y: 3}
  ],
  scales: [{x: 1, y: 1}, {x: 1.2, y: 1}, {x: 1, y: 1.4}],
  initialUp: {x: 0, y: 1, z: 0},
  capStart: false,
  capEnd: false
});
```

The example assumes an importing module at the repository root. Import the
companion by its actual relative path from your consumer; it is not added to the
existing public facade.

## Construction contract

- Coordinates use the existing kernel coordinate frame and world units.
- Inputs are plain data records. The centerline contains 2–256 finite stations.
- The local XY profile has 3–64 strictly convex counterclockwise corners.
  Repeat the first corner neither at the end nor at another index.
- `scales`, when supplied, has exactly one positive finite `{x,y}` entry per
  station. Omission means unit scale at every station.
- `initialUp` defaults to positive Y. Supply another nonparallel direction for a
  route initially travelling along Y. A zero or parallel up vector is rejected.
- Both cap booleans are required. Neither cap gives a tube with two boundary
  loops; one cap gives one boundary loop; two caps require a closed outward mesh.
- Endpoint tangents follow adjacent segments. Interior tangents bisect adjacent
  segment directions. Frame axes undergo minimal-rotation parallel transport;
  there is no roll parameter or automatic profile repair.
- Rings are joined by piecewise linear triangle strips. No spline interpolation,
  smooth geometric fillet, adaptive tessellation or curvature guarantee is implied.
- Turns greater than 90 degrees, collapsed sections, ambiguous frames and locally
  folded side faces are rejected. A 90-degree turn may still fail the fold check
  when its section is too large for the available distance.
- North provides scale-aware tolerances. East validates/triangulates the local
  profile. South calls the existing East mesh/normal/topology analysis. West alone
  issues admission. The companion never issues an admission record itself.
- A supplied standard North tolerance context is copied. Extra context fields
  have no sweep meaning. Construction neither edits nor freezes caller inputs.

## What qualification proves

The tests independently check analytic coordinates and volume, outward face and
cap winding, boundary-edge degrees, opposite shared-edge directions, Euler
characteristics, ring scales, frame orthonormality/handedness, all six travel
axes, translation behavior, multiple convex profile sizes, deterministic output,
caller ownership, negative inputs, local fold rejection, and actual West admission.

The existing Laws spacecraft remains eight admitted primitives, 454 vertices and
876 triangles. Its complete geometry output digest and the protected source bytes
must match `baseline.json`. The existing mesh-shell parity verifier passes all
140 cases. These are local Node engineering results, not physical-phone results.

## Explicit limits and downstream work

Valid manifold topology does not prove no self-intersection. The candidate does
not certify collision clearance, traversability, watertight terrain excavation,
river flow, world placement, material quality, interior-facing rendering, GPU
cost, phone performance or visual improvement. Outward normals follow the existing
kernel's solid-shell convention; a cavern consumer must deliberately resolve its
interior rendering and collision semantics.

No scene, terrain binary, renderer, shader, navigation module, existing facade,
directional module or Laws consumer is changed. The module is not imported by a
live product. Adoption requires a separate bounded consumer operation with those
consumer-specific checks; the generic constructor must not take over H-Earth's
existing geological formation workstream.

## Reproduce

From the repository root:

```sh
node --test h-earth-3d/validation/geometry-kernel-sweep.v1.test.mjs
node h-earth-3d/validation/h-earth.mesh-shell-index-parity.v1.mjs
```

See issue #6402 and `operation-packet.json` for the exact admission provenance,
`review.json` for the independently reviewed source hashes, and `qualification.json`
for measured results and declared limits. Timings are observations, not speed
thresholds or a claim that this new constructor accelerates existing products.
