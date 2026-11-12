# H-Earth Gen-2 Realism Successor Construction Contract v1

STATUS: ACTIVE CONSTRUCTION AUTHORITY
PRODUCTION: FROZEN / NON-TARGET
BLOCKOUT RENDERER: RETIRED

## Objective
Build the next Gen-2 vertical slice as a materially realistic coastal environment, not a feature demo.

## Canonical truth
Read-only source: `../terrain/h-earth.terrain-field.js`.
Do not mutate production H-Earth, R3C, Run8E, compositor, or public route.

## Required scene composition
1. ocean horizon and physically distinct water surface
2. wave/surf/contact band
3. wet sand, dry sand, tide pools
4. irregular shoreline boulders and offshore stacks
5. beach-to-lowland transition
6. eroded bluff/cliff geology
7. valleys, ridges, foothills and distant headlands
8. cavern integrated into rock geometry (not a box proxy)
9. ecological scatter sufficient to establish scale
10. atmospheric distance hierarchy

## Renderer architecture
Successor must use a modern PBR scene stack rather than the retired custom blockout shader.

Required capabilities:
- displaced terrain geometry with effective sub-grid detail
- recomputed/derived normals after displacement
- albedo + normal + roughness material response
- directional shadow map
- ambient/contact occlusion
- water depth/reflection/fresnel variation
- instanced geological/ecological assets
- atmospheric fog/haze
- mobile-capable fallback

## Visual admission gate
Do not return a live owner-inspection URL until all are true in a normal ground-level view:
- terrain grid/faceting is not perceptible
- beach has recognizable local surface detail
- rock geology is irregular and non-primitive
- water has depth/reflection variation and shoreline contact
- terrain has multi-scale erosion/ridge structure
- scene contains enough ecological/material density to establish real-world scale
- no proxy boxes or obvious debug geometry
- scene no longer reads as a blockout/train set

## Evidence gate
Before owner inspection:
- exact-SHA immutable route
- browser initialization pass
- screenshot captured at ground-level coastal view
- screenshot internally reviewed against admission gate
- if gate fails, continue construction without owner interruption

## Promotion
No production authority. Owner inspection does not itself authorize production promotion.
