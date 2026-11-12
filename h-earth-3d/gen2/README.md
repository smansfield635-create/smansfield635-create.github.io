# H-Earth Terrain Renderer Gen 2 — Prototype v1

Parallel isolated prototype. Production H-Earth remains frozen.

This prototype consumes `sampleHEarthTerrainField()` from the canonical Run 6B terrain authority read-only and constructs its own GPU terrain presentation. It imports no R3C renderer, Run8E live render package, Gen311 landscape-preview relief, compositor, or production renderer.

Prototype milestone: one interactive mountain/valley study proving that canonical H-Earth elevation can drive visibly displaced geometry with derived normals, physically motivated material response, directional sunlight, atmospheric distance, and terrain self-shadow approximation.

Route: `/h-earth-3d/gen2/`

## Gen-2 renderer implementation reset — v2

The hand-written prototype renderer is now a retired blockout implementation. It proved canonical-data independence and visible mutation propagation, but it is not the realism architecture.

The next implementation target is a modern PBR scene stack with: physically based terrain materials, displacement + matching normals, shadow maps, AO, physically modeled water, instanced geology/ecology, and atmospheric depth. The production H-Earth route remains frozen.

Hard visual admission gate: no owner-inspection successor until a normal ground-level view has non-faceted terrain, recognizable beach surface detail, irregular geological rocks, water with depth/reflection variation, and sufficient ecological/material density to stop reading as a blockout.
