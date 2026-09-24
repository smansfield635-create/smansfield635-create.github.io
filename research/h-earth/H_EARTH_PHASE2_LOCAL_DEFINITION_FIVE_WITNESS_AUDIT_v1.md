# H-EARTH PHASE 2 LOCAL-DEFINITION FIVE-WITNESS AUTHORITY AUDIT v1

STATUS: READ-ONLY AUDIT
ACCEPTED BASELINE: 4ef0614941d414ec783948acf474b895f1fca0ad
PRODUCT MUTATION: NONE

## PIPELINE FINDINGS

### Canonical local frequencies
The canonical terrain field provides central-difference slope/curvature and the accepted macro/meso morphology. It does not currently expose a dedicated erosion-scale/local-relief band separate from meso geography.

Classification: EXISTS_BUT_INSUFFICIENT.

### Run8B / Phase-3
Current Run8B samples the world manifold and canonicalizes elevation. In the accepted path there is no separately authoritative Phase-3 local residual module surfaced by the terrain directory; the geometry builder will consume phase3Elevation if present, but current Run8B field output is principally G_world-derived.

Classification: EXISTS_BUT_DISCONNECTED / no current dedicated local-frequency authority demonstrated in this accepted path.

### Adaptive-C geometry
Near-field 4-unit geometry is sufficient to carry some local terrain features with wavelength materially above the 4-unit sample interval, but should not be used to represent debris/rock or microtexture.

Classification: EXISTS_AND_WORKS for bounded local terrain relief; WRONG_REPRESENTATION_BAND for rock/microtexture.

### Normals and lighting
Canonical field derives normals from a 0.5-unit central difference. Run8C uses geometry normals plus slope/curvature-aware form lighting.

Classification: EXISTS_AND_WORKS structurally, but local normal variation is limited by the smooth source field and current material inputs.

### Materials
Run8C has a real surface-material/light pipeline with wetness, roughness, reflectance, slope/curvature response and multiple surface classes.
A 1024x1024 unique baked material field also exists with one runtime texture sample per terrain fragment.

Classification: EXISTS_AND_WORKS as infrastructure; EXISTS_BUT_INSUFFICIENT in visible local differentiation in the accepted inspection.

### Secondary geometry
The active successor terrain path does not expose a dedicated rock/boulder/debris placement system in the inspected render authority. Older landscape code contains semantic material intents but is not evidence of active successor secondary-geometry realization.

Classification: MISSING in the accepted successor visual path.

## FIVE WITNESSES

### COAST / BERM
Accepted meso: berm/shelf/bank/toe progression.
Local gap:
- sand/soil breakup remains visually smooth;
- shoreline-local erosion/deposition texture is weak;
- no active pebble/rock/debris geometry established.

Best representation:
surface/material first; very shallow local terrain relief only where it represents actual berm/rill shape.

### LOWLAND
Accepted meso: broad rise/swale/rolling grade.
Local gap:
- large areas retain uniform smooth-ground character;
- limited small undulation/surface breakup.

Best representation:
bounded low-amplitude terrain-local relief plus material/normal differentiation.

### DRAINAGE BANK
Accepted meso: routed corridor and banks.
Local gap:
- bank edges remain analytically smooth;
- no secondary rills/erosion cuts tied to the drainage direction;
- sediment/material response is underexpressed.

Best representation:
local terrain geometry for coherent rills/bank cuts; material layer for sediment/wetness.

### FOOTHILL BENCH
Accepted meso: lower/upper benches and slope transitions.
Local gap:
- bench surfaces and breaks remain smooth;
- rocky exposure lacks secondary geometry.

Best representation:
small terrain slope-break/erosion relief plus later rock geometry/material exposure.

### MOUNTAIN SLOPE
Accepted macro/meso: articulated range and readable slopes.
Local gap:
- slopes still lack rock bodies/talus/debris-scale silhouette breakup;
- using the height field alone for those objects would be the wrong band.

Best representation:
secondary geometry + material differentiation; only coherent erosion channels belong in terrain-local geometry.

## REPRESENTATION DECISION

First Phase-2 construction should NOT be a blanket noise pass.

The smallest useful first construction is a bounded LOCAL TERRAIN RELIEF field targeted only to:
- lowland subtle undulation;
- drainage-aligned rills/bank cuts;
- foothill slope-break/erosion variation.

Coast should initially remain material-led except for already accepted meso cross-section.
Mountain rock/talus should remain held for secondary geometry rather than terrain displacement.

The local terrain relief must:
- have zero/near-zero contribution at shoreline authority;
- not move macro ridge/pass/basin identities;
- remain low amplitude relative to Phase-1 meso relief;
- use deterministic world-space functions;
- be representable by Adaptive-C 4u near geometry;
- be measured at 2/4/8-unit windows;
- preserve terrain-support correspondence automatically through presented-triangle clearance.

## NEXT DETERMINISTIC OPERATION

Construct a bounded local-terrain-relief candidate for LOWLAND + DRAINAGE BANK + FOOTHILL only.
Do not yet mutate material, secondary geometry, vegetation, renderer, Adaptive C, Gen311, coast macro/meso, or mountain macro/meso.
