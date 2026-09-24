# H-EARTH PHASE 2 LOCAL-RELIEF CHECKPOINT / MATERIAL AUTHORITY AUDIT v1

STATUS: OWNER-INSPECTED CHECKPOINT + READ-ONLY MATERIAL AUDIT
DATE: 2026-09-23
PRODUCT MUTATION: NONE

## ACCEPTED LOCAL-RELIEF INSPECTION
Immutable occurrence: 2582dda13038c05fe9279177d5a737eb4e7eef73
Owner supplied a 40.3-second traversal.

Disposition:
LOCAL_TERRAIN_RELIEF = PASS
PROCEDURAL_NOISE_AVOIDANCE = PASS
PHASE1_MESO_PRESERVATION = PASS
TRAVERSAL = PASS
PERFORMANCE = PASS
VISIBLE_IMPROVEMENT = MODERATE_USEFUL
NEXT_DOMINANT_LIMITATION = SURFACE_MATERIAL_DIFFERENTIATION

Protected local-relief product lineage:
aa5020fa0d3c3212d2ed1bfb58b5915e1a8436c6
qualification head:
3c2d125d162ec03a121625adcab27523efb22638

## MATERIAL PIPELINE AUDIT

### Canonical source
h-earth.terrain-field.js assigns materialProfile from shoreline distance, elevation and slope:
OPEN_WATER
NEARSHORE_WATER
WET_SAND
DRY_SAND
STONE_AND_SPARSE_SOIL
COASTAL_SOIL
LOWLAND_SOIL

Finding:
real semantic differentiation exists, but it is coarse class-level assignment.

### World manifold
h-earth.world-manifold-domain.js preserves canonical materialProfile and surface class.

Finding:
material semantics survive into G_world.

### Run8C successor material/light path
lighting-material-successor-terrain.run8c.js consumes:
- successor surface material
- world/geometry normals
- slope/curvature
- wetness
- roughness
- reflectance
- atmosphere
- player-scale form lighting

Finding:
the successor presentation has substantial material-response infrastructure. It is not a single flat-color architecture.

### Unique baked material field
terrain-material-field.round2-baked.v1.js defines:
- 1024 x 1024 unique world material field
- 4,194,304 bytes
- canonical SHA-256
- world domain x [-256,256], z [-320,64]
- mipmaps required
- unique world coverage true
- one runtime texture sample per terrain fragment

Finding:
high-resolution world-space material data exists as an asset and loader.

### Active visual correspondence gap
The accepted browser traversal still presents broad visually uniform terrain despite:
- multiple canonical material classes;
- roughness/wetness/reflectance response;
- normal-driven lighting;
- a unique 1024x1024 baked field.

This means the next problem is not lack of material assets/capabilities. It is active successor correspondence and expression:
1. determine whether the baked field is bound into the live accepted renderer;
2. determine which channels/values reach the fragment path;
3. determine whether material-class differences are compressed by base-color mapping;
4. determine whether lighting/haze suppresses local contrast;
5. determine whether mip/UV/world-coordinate mapping erases local variation;
6. determine whether the active renderer instead consumes a fallback or reduced material representation.

### Secondary geometry
No active successor rock/boulder/talus placement authority was established by the prior local-definition audit.
This remains a later separate representation band and must not be solved by material mutation.

## FROZEN FOUNDATION
Do not alter during material diagnosis:
- Adaptive C geometry/topology;
- indexed presented-triangle clearance;
- Gen311 modest articulation;
- Phase1 meso morphology;
- Phase2 local terrain relief;
- camera/navigation;
- coast/mountain macro authority.

## NEXT DETERMINISTIC OPERATION
Trace the accepted immutable occurrence's actual material bytes through:
baked field / semantic surface source
-> material sampler
-> immutable package attributes/textures
-> GPU bindings
-> shader inputs
-> final fragment color.

Produce a correspondence receipt identifying the first stage at which world-space material differentiation is absent, collapsed, bypassed, or excessively compressed.

No material construction is authorized until that first-loss boundary is identified.
