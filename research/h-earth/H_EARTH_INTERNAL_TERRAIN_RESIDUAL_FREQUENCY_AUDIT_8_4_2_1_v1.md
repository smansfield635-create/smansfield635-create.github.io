# H-Earth Internal Terrain Residual/Frequency Audit 8→4→2→1 v1

MODE: READ-ONLY / DURABLE
AUTHORITY: frozen Phase 2B source laws
DATE: 2026-09-23
PRODUCT MUTATION: NONE

## Method
Reconstructed the exact canonical terrain elevation law from h-earth.terrain-field.js and the accepted visible Gen311 regional relief law from landscape-preview.js.

Representative 64×64-world-unit windows were sampled around:
- coast: (0,-100)
- slope/hill: (72,-172)
- primary ridge: (86,-235)
- valley: (2,-198)
- foothill: (-52,-180)
- mountain/ridge east: (148,-224)

For each scale transition 8→4, 4→2, and 2→1, finer visible elevation was compared against bilinear prediction from the next-coarser lattice. Metrics are residual RMS, 95th percentile absolute residual, and maximum absolute residual.

This is a representation-information audit, not a renderer test.

## Results (world units)

| Region | Scale | RMS | P95 abs | Max abs |
|---|---:|---:|---:|---:|
| coast | 8→4 | 0.197 | 0.455 | 0.721 |
| coast | 4→2 | 0.062 | 0.133 | 0.486 |
| coast | 2→1 | 0.043 | 0.040 | 1.316 |
| slope/hill | 8→4 | 1.294 | 2.637 | 9.382 |
| slope/hill | 4→2 | 0.693 | 0.873 | 5.207 |
| slope/hill | 2→1 | 0.493 | 0.182 | 6.896 |
| ridge | 8→4 | 2.232 | 5.245 | 10.436 |
| ridge | 4→2 | 1.169 | 2.625 | 7.444 |
| ridge | 2→1 | 0.894 | 1.259 | 7.633 |
| valley | 8→4 | 1.108 | 2.345 | 5.408 |
| valley | 4→2 | 0.910 | 1.399 | 7.568 |
| valley | 2→1 | 1.025 | 1.382 | 8.527 |
| foothill | 8→4 | 0.643 | 1.383 | 2.994 |
| foothill | 4→2 | 0.463 | 0.510 | 6.125 |
| foothill | 2→1 | 0.408 | 0.190 | 7.015 |
| mountain | 8→4 | 1.608 | 2.898 | 11.400 |
| mountain | 4→2 | 0.703 | 1.072 | 8.036 |
| mountain | 2→1 | 0.586 | 0.377 | 7.207 |

## Finding 1 — native sub-8-unit information exists
The terrain is not merely an 8-unit coarse surface. Ridge, slope, valley, foothill and mountain windows contain substantial 8→4 residual elevation. Ridge RMS exceeds 2.2 world units with P95 above 5.2; mountain RMS exceeds 1.6.

Therefore the Phase 3 conclusion is NOT “the terrain field contains no finer information.”

## Finding 2 — useful residual is terrain-class dependent
The coast has little residual compared with inland relief. The ridge, valley and mountain classes carry much stronger residuals.

This supports terrain/error-driven refinement rather than uniform refinement.

## Finding 3 — residual remains below 4 units, but distribution becomes sparse/structured
4→2 residual remains material in inland terrain. 2→1 RMS also remains nonzero, particularly ridge/valley, but several regions show low P95 with comparatively large maxima.

That pattern indicates localized high-curvature/transition events rather than uniformly useful one-unit detail. It argues for error metrics and feature-aware refinement rather than blanket 1-unit geometry.

## Finding 4 — Gen311 itself creates scale-sensitive discontinuity pressure
Gen311 regional articulation is derived using an 8-unit neighborhood and includes classification-like ridge/valley/pass/watershed signals. The visible relief delta then applies comparatively large gains:
ridge ×24
watershed ×9
foothill ×13
valley ×−14
pass ×−7
plus positive elevation ×0.22.

When this law is evaluated continuously at newly introduced 4/2/1 coordinates, its semantic signals can change sharply between nearby samples. This explains why denser sampling can expose spikes/wedges or excessive local shape changes even when the patch samples the same function.

The large maximum residuals at finer scales are therefore not automatically desirable “real detail.” Some are evidence that an 8-unit regional classifier is being re-evaluated at coordinates for which the accepted coarse visible mesh never previously materialized vertices.

## Finding 5 — direct resampling is the wrong reconstruction law
External precedent says a fine level should be predicted smoothly from its accepted coarse parent and then receive a bounded residual.

H-Earth Phase 3 instead directly re-evaluated the full visible law at every new fine vertex. That allows Gen311 semantic relief to create large departures from the accepted coarse surface.

This is the central internal/external reconciliation.

## Correct next architecture
For a fine vertex:

PREDICTED_FINE_ELEVATION
= smooth reconstruction of accepted Phase 2B coarse visible terrain

NATIVE_RESIDUAL
= exact finer visible-law sample − predicted elevation

ADMITTED_RESIDUAL
= terrain/error-aware bounded/filter version of NATIVE_RESIDUAL

FINAL_FINE_ELEVATION
= predicted elevation + admitted residual

The accepted coarse vertices remain exact invariants.

## Required residual controls
A construction contract should define:
- coarse-vertex exact preservation;
- terrain-class-specific residual amplitude ceilings;
- smooth residual filtering / continuity;
- screen-space or projected-error admission;
- residual fade/morph at LOD boundary;
- suppression of isolated classifier spikes;
- derivative/normal recomputation from final admitted geometry;
- Phase 2B shading retained at higher frequency.

## Decision
CASE 3 from the external audit is supported:
NATIVE RESIDUAL EXISTS, BUT IT IS STRONGLY TERRAIN-CLASS / FEATURE DEPENDENT.

Do not invent a wholly synthetic displacement field yet.
Do not directly materialize the raw fine Gen311 law either.

The next proof should use the native residual, but bound and filter it against the accepted Phase 2B coarse parent.

## Next deterministic task
Construct a residual-admission contract and an offline/read-only proof over the same six windows before any browser/runtime mutation.

The proof must show that admitted 4-unit geometry:
- exactly preserves every 8-unit Phase 2B vertex;
- retains meaningful ridge/mountain residual;
- suppresses isolated excessive spikes;
- has bounded first/second derivative change;
- creates no new coastline/geography authority;
- produces watertight coarse/fine boundary conditions.

Only after that numerical proof should a new Phase 3 renderer candidate be authorized.
