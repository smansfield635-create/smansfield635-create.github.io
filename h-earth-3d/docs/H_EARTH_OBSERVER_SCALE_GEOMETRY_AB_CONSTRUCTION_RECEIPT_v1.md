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
