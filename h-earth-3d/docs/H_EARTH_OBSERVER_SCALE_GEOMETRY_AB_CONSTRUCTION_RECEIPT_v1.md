# H-Earth Observer-Scale Geometry A/B Construction Receipt v1

Status: CONSTRUCTION COMPLETE — QUALIFICATION HELD

Contract authority: PR #4621
Base main: 1851c48c87956c50f4bd67946a32c555857c3e62
Observer envelope: 0..18 world units

## A
Current main Run8B geometry: uniform 8-world-unit X/Z realization.

## B
Candidate Run8B geometry: 4-world-unit X/Z base realization using the same Run8B successor terrain field, renderer, compositor, observer/camera, materials, lighting, environment and downstream transport.

The construction changes only the Run8B geometry realization path. Each candidate vertex is sampled at its exact X/Z coordinate. The construction records base field elevation, any already-exposed Phase-3/visible elevation contribution on the authoritative sample, and final CPU elevation. It does not invent a new morphology law.

## Qualification required
The next execution must measure A and B over the fixed 0..18 observer envelope and fail closed unless it reports:
- vertex and triangle counts;
- nearest-neighbor spacing;
- triangle edge dimensions;
- samples at 0,2,4,6,8,10,12,14,16,18 units;
- CPU, immutable-package and GPU Float32 elevations;
- CPU→package→GPU deltas;
- world-space and projected visible facet size;
- exact A/B invariant identities for observer/camera/renderer/compositor/material/light/environment/transport;
- exact equality of shared 8-unit parent elevations.

No merge, deployment, publication or morphology escalation is authorized by construction alone.

## Deterministic module provenance

Repository: `smansfield635-create/smansfield635-create.github.io`

A authority:
- commit: `1851c48c87956c50f4bd67946a32c555857c3e62`
- product path: `showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js`
- product blob: `ec11e15611bea52dc1202e11d3b94a9503f1298f`
- exported constructor: `constructHEarthRun8BSuccessorTerrainAndMountain`
- exported sampling-axis function: `getHEarthRun8BSuccessorSamplingAxes`

B authority:
- branch: `h-earth-observer-scale-geometry-ab-construction-v1`
- product mutation commit: `3cee6115801476a72e0b2319daf446e08d8e5054`
- product path: `showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js`
- product blob after mutation: `56475897bfbf57a3fd3335db0d849e1d576ec97b`
- exported constructor: `constructHEarthRun8BSuccessorTerrainAndMountain`
- exported sampling-axis function: `getHEarthRun8BSuccessorSamplingAxes`
- PR: `#4622`

Terrain-field dependency held invariant:
- path: `h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js`
- main blob observed during construction: `4f929cd467edb447e2116de745d9b02c28daf219`
- sampling export: `sampleHEarthRun8BSuccessorTerrainField`

GPU-binding dependency held invariant:
- path: `showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js`
- main blob observed during construction: `21f7427cecb68547bf6697e841202e0ab0e4c371`
- binding export: `createHEarthRun8ER3D3LiveGpuBinding`

Qualification import law:
- A must import the product module from exact commit `1851c48c87956c50f4bd67946a32c555857c3e62`.
- B must import the same product path from PR #4622 head.
- The runner must not infer or search for an alternate Run8B geometry module.
- If either exact path/blob/export identity fails to resolve, qualification is FAIL-CLOSED.
