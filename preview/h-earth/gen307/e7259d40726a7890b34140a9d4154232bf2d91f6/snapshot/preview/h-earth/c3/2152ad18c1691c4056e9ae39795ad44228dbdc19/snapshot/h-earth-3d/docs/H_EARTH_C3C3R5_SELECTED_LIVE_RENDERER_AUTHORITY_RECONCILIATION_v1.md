# H-Earth C3C3R5 Selected Live Renderer Authority Reconciliation v1

## Discovery

The D12 multi-view evidence exposed another parallel-path authority.

The public H-Earth route automatically promotes the query contract:

`visual=terrain-relief-v2`

The Run 8E live GPU binding therefore selects:

`showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js`

rather than using `persistent-live-renderer.run8e-r3c.js` directly.

The selected wrapper still contained a fullscreen C3C3 enclosure pass that generated:

- a viewport-space curved horizon;
- a viewport-space synthetic distant ridge;
- a screen-derived connected-region boundary silhouette;
- three post-geometry depth/haze curtain passes.

Those effects remained active even after the canonical base renderer had retired its fake horizon and the real distant-context geometry had been admitted into the live draw set.

## Consequence

This parallel presentation authority could continue to make the world read as a decorated rectangular enclosure even while the underlying world-space geometry, camera, material and planet-frame repairs were correct.

It also violated the deep-change provenance law:

`SOURCE AUTHORITY -> CONSUMER -> LIVE PACKAGE -> GPU TRANSPORT -> ACTUAL SELECTED SHADER/COMPOSITION -> OWNER PIXELS`

Auditing only the base renderer was insufficient because it was not the complete selected presentation path.

## Repair

The public `visual=terrain-relief-v2` contract remains stable.

Its selected renderer wrapper now delegates rendering directly to the canonical persistent world-space renderer and adds no independent screen-space world-shape pass.

Retired as visual authorities:

- viewport-space horizon geometry;
- synthetic screen-space distant ridge;
- screen-pinned regional boundary silhouette;
- post-geometry depth curtains.

Retained:

- canonical persistent renderer;
- actual live geometry draw set including distant context;
- actual world-space terrain normals and materials;
- canonical atmosphere;
- planet-relative camera;
- public query compatibility.

## Governing law

`SELECTED LIVE RENDERER MAY PRESENT THE WORLD; IT MAY NOT INVENT A SECOND WORLD SHAPE.`

## Qualification

The next exact-head D12 evidence must prove the rendered result after this reconciliation. The previous multi-view evidence is `REPAIR_REQUIRED` and cannot be used as a product pass because it was captured through the obsolete screen-space enclosure authority.
