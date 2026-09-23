# H-EARTH LANDSCAPE DEFINITION / REAL-TIME TERRAIN WWW AUDIT v1

STATUS: DURABLE RESEARCH AUDIT
DATE: 2026-09-23
SCOPE: LANDSCAPE-WIDE DEFINITION · GEOMETRY · LOD · DISPLACEMENT · VEGETATION · ATMOSPHERE
PRODUCT MUTATION: NONE

## PURPOSE

Determine why H-Earth's continuous terrain intent is reaching the owner as large planar/faceted surfaces, and establish a landscape-wide definition architecture before further morphology construction.

This audit intentionally expands beyond mountain morphology. Mountains, foothills, valleys, plains, coast, drainage, vegetation, rocks, surface displacement, atmosphere and observer-local representation are treated as one multiscale landscape system.

## CURRENT H-EARTH EVIDENCE

B2:
- meso differentiation reached the rendered world;
- overlapping relief remained broad and synthetic.

B2.1:
- connected ridge/spur/drainage topology reached the rendered world;
- narrow carriers became wall/canyon-like at observer scale.

B2.2:
- broad-base hierarchy reduced the narrow-wall defect;
- large planar/faceted surfaces remained severe across inland terrain and were also visible outside the mountain system.

Inference:
- morphology remains important, but landscape definition is now constrained by representation/refinement as well as field design.
- freeze further B2.x morphology until the representation-loss boundary is traced.

## EXTERNAL EVIDENCE CROSSWALK

### Geometry clipmaps / viewer-centered refinement
Losasso & Hoppe's geometry clipmaps use nested regular grids centered on the viewer, incrementally updated as the viewpoint moves. The architecture is explicitly designed for visual continuity, controlled complexity and runtime synthesis of finer detail near the viewer.

H-Earth implication:
- observer-local refinement is not an optional polish layer;
- player-scale geometric spacing must be an explicit invariant;
- far-field density and near-field density should not be identical.

Sources:
- https://hhoppe.com/proj/geomclipmap/
- https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-2-terrain-rendering-using-gpu-based-geometry

### Adaptive tessellation / displacement
GPU Gems separates coarse topology refinement from displacement: tessellation supplies enough polygons; displacement moves those new vertices according to the continuous field. Detail cannot become geometric merely because the underlying displacement function contains it.

H-Earth implication:
- a high-information terrain field rendered on coarse triangles will remain faceted;
- first measure triangle size and refinement density, then decide which frequencies belong in geometry versus normals/materials.

Sources:
- https://developer.nvidia.com/gpugems/gpugems2/part-i-geometric-complexity/chapter-7-adaptive-tessellation-subdivision-surfaces
- https://developer.nvidia.com/gpugems/gpugems3/part-i-geometry/chapter-5-generic-adaptive-mesh-refinement

### Far Cry 5
Ubisoft's terrain renderer uses a GPU compute pipeline for LOD, culling, stitching and height-field rendering across distance. Critically, its architecture supports procedural cliff geometry and displacement geometry in addition to the base height field. Ubisoft's procedural world-generation pipeline also treats biomes, terrain texturing, freshwater networks and cliff rocks as coordinated landscape systems.

H-Earth implication:
- do not demand that one height field carry cliffs, macro terrain, local ground definition and all surface complexity;
- identify when supplemental geometry/displacement is required to break the height-map/faceted appearance;
- water networks, biome/material placement and terrain morphology should share landscape signals.

Sources:
- https://www.gdcvault.com/play/1025261/Terrain-Rendering-in-Far-Cry
- https://media.gdcvault.com/gdc2018/presentations/TerrainRenderingFarCry5.pdf
- https://www.gdcvault.com/play/1025557/Procedural-World-Gen

Notable Far Cry 5 finding:
- procedural cliff geometry was added specifically to create unique shape/variety and reduce the visible “height map” character.

### Unreal Engine / Nanite / Mesh Terrain
Current Unreal documentation distinguishes virtualized geometry from source landscape resolution: Nanite can improve runtime geometry handling, culling, streaming and LOD behavior but does not automatically create missing landscape resolution. Epic's experimental Mesh Terrain explicitly permits non-uniform resolution so important areas can carry more geometry than sparse distant terrain.

H-Earth implication:
- LOD machinery cannot recover detail never sampled into geometry;
- source/refinement density and runtime geometry management are separate responsibilities;
- observer-important terrain should be allowed materially higher resolution.

Sources:
- https://dev.epicgames.com/documentation/unreal-engine/nanite-in-unreal-engine
- https://dev.epicgames.com/documentation/unreal-engine/hybrid-nonnanite-and-nanite-content-workflows
- https://dev.epicgames.com/documentation/unreal-engine/mesh-terrain-in-unreal-engine

### Alan Wake 2 / Northlight
Remedy describes Northlight as using a GPU-based geometry rendering pipeline for expanding virtual worlds. Alan Wake 2 required Remedy to rethink geometry rendering for a primordial forest with open vistas. Remedy also built large-scale scattering for denser, richer environments with longer draw distances and GPU-based vegetation animation for dense detailed forests.

H-Earth implication:
- landscape definition is not terrain mesh alone;
- dense prop/vegetation scattering and geometric fidelity work together to establish scale;
- distant and near environmental density must be coordinated rather than treating vegetation as later decoration.

Sources:
- https://www.remedygames.com/northlight
- https://www.remedygames.com/article/how-northlight-makes-alan-wake-2-shine
- https://www.remedygames.com/article/explore-remedys-gdc2024-talks-on-creating-alan-wake-2
- https://www.enginearchitecture.org/2024.htm

### Horizon Zero Dawn / Decima
Guerrilla's runtime procedural placement dynamically assembles environments around the player on the GPU, including rocks, trees, sounds, effects, wildlife and gameplay elements. The point is a dense world around the observer, not merely a detailed base height field.

H-Earth implication:
- observer-local landscape definition should include secondary geometry and vegetation placement driven by terrain semantics;
- local density can be generated/selected around the player instead of globally paying maximum detail cost.

Sources:
- https://gdcvault.com/play/1024120/GPU-Based-Run-Time-Procedural
- https://www.guerrilla-games.com/read/gpu-based-procedural-placement-in-horizon-zero-dawn

### Ghost of Tsushima
Sucker Punch generates acres of individual grass blades on the GPU while controlling memory/performance and natural field appearance.

H-Earth implication:
- fine landscape definition can be represented by procedural secondary geometry rather than forcing all perceived detail into the ground mesh;
- vegetation density and variation are major scale cues.

Source:
- https://www.gdcvault.com/play/1027033/Advanced-Graphics-Summit-Procedural-Grass

### REDengine / The Witcher
CD Projekt RED's landscape work combines automated terrain/material workflows, procedurally generated vegetation, terrain shadowing and LOD management. Large-world visibility/streaming required explicit LOD architecture.

H-Earth implication:
- material variation, vegetation coverage, shadowing and geometry LOD are coupled contributors to landscape readability;
- landscape definition must have separate but coordinated geometry and surface-detail budgets.

Sources:
- https://www.gdcvault.com/play/1020394/Landscape-Creation-and-Rendering-in
- https://www.gdcvault.com/play/1020231/Solving-Visibility-and-Streaming-in

### Rockstar / Red Dead Redemption 2
Public Rockstar technical material confirms RDR2 exposes distinct controls for tessellation, geometry LOD, grass LOD, parallax/texture-related quality, volumetrics, water, shadows and other rendering dimensions. Rockstar's SIGGRAPH material describes a hierarchy of atmospheric techniques working in concert to create natural environments, with artist directability layered over physically motivated systems.

H-Earth implication:
- RDR2 should be treated as evidence for a layered environment stack, not as proof of a specific undocumented terrain algorithm;
- geometric definition, vegetation range, surface shading and atmospheric depth are separate controls that combine perceptually;
- H-Earth should likewise stop treating terrain elevation as the sole carrier of landscape realism.

Sources:
- https://support.rockstargames.com/articles/4dhIZ7x25mF7gO4NEhlUO9/graphics-performance-tuning-in-red-dead-redemption-2-on-pc
- https://www.advances.realtimerendering.com/s2019/index.htm

### Mass Effect: Andromeda / Frostbite
Public BioWare material confirms Andromeda moved to Frostbite. A production technical-art account describes outdoor maps whose base terrain came from WorldMachine while rock formations and additional level geometry were separately exported and combined; water, rivers and roads were also represented as separate layers.

H-Earth implication:
- use Mass Effect as another example of base terrain plus additional landscape geometry/layers rather than expecting the base height field to represent every formation;
- do not overstate this as a complete description of Frostbite's runtime terrain renderer.

Sources:
- https://blog.bioware.com/2015/06/15/introducing-mass-effect-andromeda/
- https://studiopyraxis.com/techart/mea-procedural-map/

### Modern mesh-shader / virtualized-geometry direction
AMD demonstrates procedural terrain where chunks vary vertex spacing by LOD and mesh shaders generate continuous terrain. Ubisoft's Anvil micropolygon work targets high fidelity, reduced LOD popping and GPU-driven streaming in a vast open world.

H-Earth implication:
- long-term architecture may move toward GPU-driven chunk refinement/meshlets;
- immediate repair does not require copying Nanite or Anvil, but H-Earth should adopt the capability principle: allocate geometry according to perceptual need.

Sources:
- https://gpuopen.com/learn/work_graphs_mesh_nodes/work_graphs_mesh_nodes-procedural_generation/
- https://gdcvault.com/play/1035671/Micropolygon-Rendering-in-Anvil

## SYNTHESIZED LANDSCAPE-DEFINITION MODEL

H-Earth should explicitly separate six spatial/presentation bands:

1. MACRO FIELD
   continents, coast, major plains, mountain systems, watershed basins.

2. MESO GEOMETRY
   ridges, foothills, terraces, river/drainage corridors, banks, gullies, cliff bodies.

3. OBSERVER-LOCAL GEOMETRIC REFINEMENT
   enough vertices/triangles near the player to represent slope breaks and meso/local displacement without giant planar facets.

4. SECONDARY GEOMETRY
   rocks, cliff meshes, boulders, debris, vegetation stems/blades, shoreline objects.

5. SURFACE DETAIL
   normals, roughness, albedo variation, sediment/soil/rock transitions, small displacement/parallax where appropriate.

6. ATMOSPHERIC/DEPTH CUES
   lighting, shadows, fog/haze, volumetrics, vegetation draw distance and density.

No single band is permitted to impersonate all six.

## H-EARTH FAILURE HYPOTHESES TO TEST

H1 — CPU vertex spacing near observer is too coarse.
H2 — Phase-3 residual contains useful frequencies that are not materialized as vertices.
H3 — triangulation produces large faces whose planar interpolation dominates visible terrain.
H4 — GPU binding receives the correct elevations but at insufficient sample density.
H5 — normal derivation/shading further flattens or exposes facets.
H6 — LOD/refinement selection is not sufficiently observer-centered or does not increase density enough.
H7 — secondary geometry/material/vegetation layers are too weak to provide local scale cues even where base geometry is adequate.
H8 — some landscape frequencies are assigned to the wrong representation band.

## REQUIRED CODE CROSSWALK

Trace, without construction:

canonical terrain field
-> Phase-3 residual/refinement
-> observer/refinement selection
-> CPU vertex generation
-> vertex spacing in world units
-> triangle/index generation
-> GPU buffer binding
-> vertex displacement/elevation consumption
-> normal generation
-> LOD transition/stitching
-> materials/surface detail
-> secondary geometry/vegetation
-> final visible geometry.

For each stage record:
- input authority;
- output authority;
- spatial sampling interval;
- whether new geometry is created;
- whether terrain frequencies are preserved, filtered or discarded;
- observer dependence;
- relevant hard caps/budgets;
- proof file/function.

## DEFINITION BUDGET TO DERIVE

Do not pick arbitrary AAA triangle counts.

Measure H-Earth first, then derive:
- near-observer vertex spacing;
- near-observer triangle edge length;
- mid-field spacing;
- far-field spacing;
- maximum representable terrain wavelength per band;
- Phase-3 residual wavelength/amplitude distribution;
- screen-space facet size at the established inspection observer;
- normal/material texel or procedural frequency;
- secondary-geometry density.

The acceptance target is perceptual and measurable:
- no dominant planar ground facets at ordinary player traversal distance;
- slope breaks/gullies/banks intended as geometry have enough samples to exist geometrically;
- near/mid/far landscape layers remain distinct;
- LOD transitions remain continuous;
- detail is allocated to geometry, secondary geometry or shading according to scale.

## DEVELOPMENT CONSEQUENCE

B2.2 morphology is FROZEN as the diagnostic terrain stimulus.

Do not construct B2.3 until the code crosswalk identifies the definition-loss boundary.

Next deterministic operation:
READ-ONLY H-Earth landscape-definition representation trace against B2.2 and the existing Phase-3/runtime authorities.

## DURABLE STATUS

WWW_AUDIT = COMPLETE
AAA_REFERENCE_SCOPE = RDR2 + ALAN_WAKE_2 + HORIZON + FAR_CRY_5 + GHOST_OF_TSUSHIMA + REDENGINE/WITCHER + MASS_EFFECT_ANDROMEDA + MODERN_UE/AMD/ANVIL
B2_2_MORPHOLOGY = FROZEN_DIAGNOSTIC_STIMULUS
NEXT_TASK = READ_ONLY_REPRESENTATION_TRACE
PRODUCTION_MUTATION_AUTHORITY = NONE
