# H-EARTH ADAPTIVE C GEOMETRIC DEFINITION ACCEPTANCE v1

STATUS: OWNER-INSPECTED DEVELOPMENT CHECKPOINT
DATE: 2026-09-23
PRODUCT PUBLICATION AUTHORITY: NONE

## PURPOSE
Durably close the observer-scale geometric-definition recovery cycle before further landscape development.

## LINEAGE
- Observer-scale recovery: research/h-earth/H_EARTH_OBSERVER_LOCAL_GEOMETRIC_DEFINITION_RECOVERY_v1.md
- Geometry contract: PR #4621
- Uniform 4-unit construction/qualification: PR #4622
- 4-unit evidence/performance contract: PR #4623
- Uniform 4-unit immutable inspection: 55892ee3df8d9a65625f64fad1e8ea589a5ec019
- Adaptive-C topology candidate lineage: 404462d6a7c97ef5734e6762e1cf9595ac83b678 -> ab915dd95883bfccefb86825446555f47e4fd00b
- Topology-aware clearance repair: 8d55ebc0f2761afe2d9ada207ed298ef1e379067
- Clearance regression head: 5cd8477d735a9175799f33c2ae776d6ddfdef188
- Indexed clearance repair: 2b98563a011874b1a7b50b90113d46af4e917ec9
- Accepted immutable inspection occurrence: b6c859ac4b0c623fc9c33f39102e11e26a513956

## GEOMETRIC EVIDENCE
A uniform 8u:
- 10,573 vertices
- 20,736 triangles
- 0..18 observer envelope: 21 vertices / 60 triangles
- median facet area ~32 world-square-units

B uniform 4u:
- 41,881 vertices
- 82,944 triangles
- 0..18 observer envelope: 69 vertices / 170 triangles
- median facet area ~8 world-square-units
- owner: significant landscape-definition upgrade
- disposition: visually successful, performance unsuitable as uniform architecture

C adaptive 4u/8u:
- 12,301 vertices
- 24,192 triangles
- 0 degenerate triangles
- consistent winding
- 0 edges consumed >2
- 0 unexpected interior boundary edges
- 0 T-junctions
- approximately 17% more terrain triangles than A, versus B's 300% increase

## PERFORMANCE EVIDENCE
Static A/B/C qualification established C near A and materially below B through terrain construction, Gen311/presentation, immutable packaging, and GPU-view preparation.

Uniform B imposed approximately 3-4x cost through multiple preparation stages.

C removed roughly 70% of B terrain geometry and recovered most of that static preparation cost.

## FAILURE / REPAIR CHAIN
### C1 — adaptive geometry + legacy clearance
Result:
- improved definition retained
- performance recovered
- visible terrain traversal failed; observer could penetrate mountain

Cause:
visible-terrain-clearance.js assumed a uniform rectangular row*column lattice while C used adaptive vertex storage.

### C2 — topology-aware triangle clearance
Repair:
X/Z -> actual presented triangle -> barycentric presented Y.

Result:
- terrain support correctness restored
- performance regressed

Cause:
linear scan of ~24,192 triangles for each terrain-surface query.

Measured clearance envelope:
- 165 terrain-surface queries
- approximately 1.6M to 3.3M triangle-candidate tests per envelope depending on location
- swept movement could multiply this cost.

### C3 — spatially indexed topology-aware clearance
Repair:
- deterministic 8-world-unit X/Z spatial index built once per presented geometry
- X/Z -> spatial cell -> local candidate triangles -> unchanged barycentric interpolation

Qualification:
- A/B/C clearance correspondence PASS
- topology PASS
- hot-path acceleration PASS
- presented-triangle authority retained

## OWNER INSPECTION
Owner supplied a 35.9-second traversal of immutable occurrence b6c859ac4b0c623fc9c33f39102e11e26a513956.

Observed acceptance:
- landscape-definition improvement retained
- mountains readable across approach/view-angle changes
- mountain traversal remains supported by visible terrain
- prior mountain-penetration failure not reproduced
- severe uniform-4 responsiveness penalty no longer dominates traversal

Owner disposition: pleased with the progress.

## ACCEPTANCE
ADAPTIVE_C_GEOMETRIC_DEFINITION = ACCEPTED_DEVELOPMENT_BASELINE
NEAR_DEFINITION = 4_UNIT
OUTER_DEFINITION = 8_UNIT
TOPOLOGY = QUALIFIED
VISIBLE_TERRAIN_CLEARANCE = PRESENTED_TRIANGLE_AUTHORITY
CLEARANCE_ACCELERATION = SPATIALLY_INDEXED
OWNER_VISUAL_INSPECTION = PASS
OWNER_TRAVERSAL_INSPECTION = PASS
PERFORMANCE_RECOVERY = PASS_FOR_DEVELOPMENT
MORPHOLOGY = FROZEN_DURING_GEOMETRY_RECOVERY
PRODUCTION_PUBLICATION = NOT_AUTHORIZED_BY_THIS_ARTIFACT

## NEXT DEVELOPMENT BOUNDARY
Return to the durable landscape-definition roadmap from this geometric baseline.

Do not regress to:
- uniform 8u as the near-field definition solution;
- uniform 4u across the full Run8B domain;
- rectangular row*column assumptions for adaptive terrain consumers;
- linear full-mesh triangle search for runtime clearance;
- morphology changes intended to compensate for insufficient geometric representation.

Next work may address landscape-wide definition bands (meso morphology, local ground structure, secondary geometry, surface/material detail, vegetation, and atmospheric depth) while preserving Adaptive C as the geometric/traversal baseline.
