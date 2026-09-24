# H-EARTH PHASE 2 SEMANTIC MATERIAL FIELD CONSTRUCTION CONTRACT v1

STATUS: BINDING CONSTRUCTION CONTRACT
DATE: 2026-09-23
PRODUCT MUTATION: HELD UNTIL CONSTRUCTION
PRODUCTION MUTATION: NONE

## EVIDENCE CLOSED
Accepted geometry/landscape baseline:
2582dda13038c05fe9279177d5a737eb4e7eef73

Existing baked material field:
- canonical asset integrity: PASS
- numerical RGB/A variance: PASS
- observer-scale numerical variance: PASS
- mip contrast: PASS
- shader delivery: PASS
- expression-isolation delivery: PASS
- owner-visible semantic differentiation: INSUFFICIENT
- final-material authority: REJECTED

Expression-isolation witness:
634149f9c18824d720a8cfa617e269a89f1a4086
Owner video: existing field remains dominated by broad brown/olive treatment and does not clearly express meaningful soil/sediment/rock/moisture families.

## PURPOSE
Construct a new world-space material field whose variation is geographically and physically meaningful rather than merely numerically variable.

No geometry, morphology, camera, navigation, topology, clearance, Gen311, or renderer architecture mutation is authorized.

## REQUIRED MATERIAL FAMILIES
At minimum:
1. WET_SHORELINE_SAND
2. DRY_SAND_BACKSHORE
3. LOWLAND_SOIL_GROUNDCOVER
4. DRAINAGE_SEDIMENT_MOIST_GROUND
5. FOOTHILL_SOIL_STONE
6. EXPOSED_MOUNTAIN_ROCK

Water remains governed by existing water optics and is outside this terrain-material construction.

## INPUT AUTHORITIES
Material classification must derive from existing world truth:
- canonical shoreline distance;
- canonical elevation;
- canonical slope;
- canonical curvature;
- accepted drainage corridor context;
- accepted lowland context;
- accepted foothill context;
- accepted mountain/high-relief context.

No screen-space painting.
No camera-relative classification.
No random material-family assignment.

## LOCAL VARIATION LAW
Deterministic world-space variation is permitted only within a resolved material family.

Variation may influence:
- albedo/palette;
- roughness;
- wetness;
- reflectance;
- contact/soil-rock mixture.

Variation must not change the semantic family itself unless a physically meaningful transition signal crosses a defined boundary.

## TRANSITION LAW
Family transitions must be continuous blends, not hard color bands.

Required transitions:
wet shore -> dry backshore
dry backshore -> lowland
lowland -> drainage sediment where drainage context increases
lowland -> foothill
foothill -> exposed rock as slope/elevation/curvature justify it

## ASSET / RUNTIME LAW
A new baked world-space field may be generated from the semantic classifier if it remains:
- content-addressed;
- deterministic;
- world-aligned;
- mipmapped;
- one texture sample per terrain fragment in the first candidate;
- bounded to the existing material-field domain unless measurement proves expansion necessary.

The old baked field must not be silently overwritten. A new asset identity/version is required.

## MEASUREMENT BEFORE VISUAL ACCEPTANCE
For deterministic witnesses at coast, backshore, lowland, drainage, foothill and mountain:
- resolved family weights;
- RGB;
- roughness/wetness/reflectance encoding;
- pairwise perceptual/color separation;
- 2/4/8/16/32-unit within-family variance;
- transition continuity;
- mip contrast.

The six witness families must not collapse to effectively the same palette.

## PERFORMANCE LAW
First candidate remains one terrain texture sample per fragment.
No dynamic procedural octave loops.
No new per-frame material construction.
No geometry rebuild.
No additional navigation cost.

## ACCEPTANCE
Owner must be able to distinguish material character in ordinary traversal without side-by-side pixel scrutiny.

A numerically different but perceptually indistinguishable result fails.

## NEXT DETERMINISTIC OPERATION
Construct the semantic material classifier and measurement instrument first.
Do not generate or bind a replacement baked asset until the classifier proves six-family separation and continuous transitions.
