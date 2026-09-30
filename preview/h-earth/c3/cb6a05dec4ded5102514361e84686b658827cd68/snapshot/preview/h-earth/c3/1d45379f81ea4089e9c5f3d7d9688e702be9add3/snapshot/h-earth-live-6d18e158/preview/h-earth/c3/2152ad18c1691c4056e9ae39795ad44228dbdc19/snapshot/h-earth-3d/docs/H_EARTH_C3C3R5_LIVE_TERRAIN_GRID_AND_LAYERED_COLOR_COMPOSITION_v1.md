# H-Earth C3C3R5 Live Terrain Grid and Layered Color Composition v1

## Governing objective

The visual target is the combination of two previously separated strengths:

`DEPTH / GRID CHARACTER + ENVIRONMENTAL COLOR / REGIONAL DIFFERENTIATION`

The terrain grid owns spatial depth. The color layer owns chromatic/environmental expression. Neither is permitted to erase the other.

## Deeper audit finding

The previously restored 16x16 perceptual grid existed in `showroom/globe/h-earth/render/geometry-landscape.js`, but the canonical Run 8E live render package does not use that provider as its terrain primitive. The live package instead constructs its terrain from:

`run8e-successor-environment.js -> geometry-successor-terrain.run8b.js -> h-earth.successor-terrain-field.run8b.js`

Therefore prior grid-restoration work could be technically present while remaining absent from the actual live successor terrain rendered by the persistent WebGL2 path.

This is an important provenance correction: the depth cue had been repaired in a non-governing terrain layer.

## Construction installed

### 1. Grid relief moved into the actual live successor terrain path

`showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js` now applies the established 16x16 perceptual relief directly to the playable successor terrain surface before South neutral mesh construction.

The profile preserves:

- 16 cells per axis;
- 7.5 world-unit seam width;
- 0.72 world-unit recessed seam depth;
- 18 world-unit shoulder width;
- 0.14 world-unit shoulder lift;
- no literal line overlay;
- no grid warping of the mountain/continuation zone outside the playable legacy-domain successor surface.

The successor terrain receipt now records grid-relief vertex count and maximum applied grid depth, and fails if the relief is absent or materially below the established depth.

### 2. Environmental color is now a translucent compositional contribution, not a replacement surface

`h-earth-3d/environment/h-earth.successor-surface-material.run8c.js` now separates:

`OPAQUE STRUCTURAL TERRAIN`

from

`TRANSLUCENT SPATIALLY-VARIANT ENVIRONMENTAL TINT`

The translucency is compositional rather than framebuffer transparency. The structural material remains physically opaque, preventing sky/background leakage. The tint is mathematically alpha-composited over the intrinsic Run 7B material profile before GPU transport.

The material sample now exposes:

- `structuralBaseColorProfile`;
- `environmentalTintColorProfile`;
- `environmentalTintStrength`;
- `environmentalTintAlphaEquivalent`;
- `spatialTintVariation`;
- `colorCompositionModel`;
- `structuralTerrainOpaque: true`;
- `framebufferBackgroundLeakage: false`.

Tint strength is bounded between 0.18 and 0.56 for soil/stone terrain. It varies causally with shoreline moisture, elevation, slope, rock exposure, and world position. Water and sand retain their structural material path rather than being forced through the terrain tint law.

## Governing law

`GRID OWNS DEPTH; COLOR OWNS CHROMATIC EXPRESSION; NEITHER MAY ERASE THE OTHER.`

The successful visual result must therefore read as one surface with two simultaneously legible layers:

`WORLD-SPACE GRID / NORMAL / SLOPE DEPTH + SUBTROPICAL SPATIALLY-VARIANT COLOR`

## What is prohibited

- opaque chunk-level color replacement that visually flattens topology;
- actual ground transparency that leaks sky/background through the terrain;
- literal black/neon grid lines;
- moving the grid back into a non-live provider while leaving the canonical live successor terrain unchanged;
- claiming success from metadata alone without rendered comparison.

## Qualification requirement

Before owner inspection, the candidate must prove from the exact live render path that:

- the Run 8B successor terrain primitive carries material grid relief;
- maximum grid depth is at least 0.70 world units;
- the live material samples retain opaque structural alpha;
- environmental tint strength varies across sampled world positions;
- tint strength remains within the bounded range;
- no background-leaking terrain transparency is introduced;
- normal/slope response remains active;
- the visual audit demonstrates both terrain depth and environmental color simultaneously from ordinary owner camera positions.

## Deterministic continuation

`TRUE PLANET FRAME -> PLANET CAMERA -> WORLD-SPACE HORIZON -> LIVE SUCCESSOR GRID RELIEF -> LAYERED ENVIRONMENTAL TINT -> TERMINAL-EDGE / REVEAL COMPOSITION -> FUNCTIONAL QUALIFICATION -> VISUAL QUALITY AUDIT -> OWNER INSPECTION`

This document records implemented construction. It does not authorize production merge or owner inspection by itself.
