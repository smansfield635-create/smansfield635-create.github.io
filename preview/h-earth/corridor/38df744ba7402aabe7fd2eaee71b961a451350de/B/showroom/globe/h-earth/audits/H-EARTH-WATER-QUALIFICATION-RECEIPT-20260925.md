# H-Earth Water Qualification Receipt — 2026-09-25

## Purpose

Durable receipt of the water investigation performed from the frozen H-Earth visual baseline. This document records the exact repository heads, architectural audits, experimental candidates, physical inspection outcomes, and disposition so no experimental lineage is mistaken for an accepted visual baseline.

## Frozen visual baseline

- Commit: `53305f5dfcdce51406363cba21c665d4e44701ad`
- Branch lineage: `h-earth-t43-clean-one-delta-20260924`
- This is the frozen parent for the water qualification sequence.
- Main/live was not modified by this sequence.
- Exact control inspection URL:
  https://rawcdn.githack.com/smansfield635-create/smansfield635-create.github.io/53305f5dfcdce51406363cba21c665d4e44701ad/preview/h-earth/corridor/38df744ba7402aabe7fd2eaee71b961a451350de/B/showroom/globe/h-earth/index.html?microrelief=v1&visual=terrain-relief-v2

## Durable audits

### Water standards audit

- Branch: `h-earth/water-standards-audit-20260924`
- Commit: `bb24ea5848b8db8cb81395dd4ab51344e5eecadf`
- Artifact:
  `preview/h-earth/corridor/38df744ba7402aabe7fd2eaee71b961a451350de/B/showroom/globe/h-earth/audits/H-EARTH-WATER-STANDARDS-AUDIT-20260924.md`
- Scope: external water-rendering standards plus repository application/gaps.
- Status: durable audit artifact; no product/runtime promotion.

### Full water audit

- Branch: `h-earth/water-full-audit-20260925`
- Commit: `fe68405f0d60a46491eb0aa66280d2eb498acd2a`
- Artifact:
  `preview/h-earth/corridor/38df744ba7402aabe7fd2eaee71b961a451350de/B/showroom/globe/h-earth/audits/H-EARTH-WATER-FULL-AUDIT-20260925.md`
- Disposition: **WATER DEFINITION CLOSED; WATER TEMPORAL PRESENTATION OPEN.**

### Water architecture/design audit

- Branch: `h-earth/water-architecture-audit-20260925`
- Commit: `50f9d5299d21af25e9006a32e274e36eab246891`
- PR: #4807
- Status: draft/unmerged.
- Key architectural conclusion: the active visible ocean is a coarse distant-context triangle field; canonical water state exists but is not wired into the accepted WebGL presentation path; source water role 2 is transported as GPU role 4; role 4 previously fell through the generic CP2 material branch.
- Required redesign boundary: dedicated water semantic first, then continuous world-space analytic temporal field; avoid global brute-force tessellation.

## Experimental heads and physical disposition

### W1 — dedicated GPU water presentation semantic

- Branch: `h-earth/water-w1-semantic-carrier-v1`
- Commit: `8f1c3ffd059b1074bdaaae5dfad55a85956adce9`
- PR: #4808
- Status: draft/open/unmerged.
- Changed only:
  - `render/gpu-upload-views.run8e-r2d.js`
  - `render/persistent-live-renderer.run8e-r3c.cp2-round1-1f520809.js`
- No geometry, tessellation, shoreline, terrain, meso, vegetation, navigation, camera, framebuffer, or renderer-selection changes.
- Semantic change: source water role 2 remains mapped to GPU role 4, and role 4 receives a dedicated active CP2 branch instead of the generic material branch.
- No temporal wave field was introduced.
- Exact immutable inspection URL:
  https://rawcdn.githack.com/smansfield635-create/smansfield635-create.github.io/8f1c3ffd059b1074bdaaae5dfad55a85956adce9/preview/h-earth/corridor/38df744ba7402aabe7fd2eaee71b961a451350de/B/showroom/globe/h-earth/index.html?microrelief=v1&visual=terrain-relief-v2
- Physical inspection receipt: the 2026-09-25 Android inspection produced the same visible environment as the control, including the exposed large polygon/linoleum-like water field. **FAIL / NOT VISUALLY QUALIFIED.**
- W1 remains unmerged and is not a new visual baseline.

### Water motion v1

- Branch: `h-earth/water-motion-qualification-v1`
- Commit: `9fe915d329616f436590e94ac30e0ac05e1612ae`
- PR: #4799
- Disposition: quarantined.
- Failure mode: modified a renderer path that the exact control query did not use.

### Water motion v2

- Branch: `h-earth/water-motion-qualification-v2`
- Commit: `7486baceb32f6b8c88d0308ea82c37e6f347bdb9`
- PR: #4800
- Disposition: quarantined.
- Failure mode: targeted the active CP2 role-2 branch, while canonical visible water is transported as role 4.

### Water motion v3

- Branch: `h-earth/water-motion-qualification-v3`
- Commit: `1bca697caf37477472321b4d4d492ac145cb07e4`
- PR: #4801
- Disposition: quarantined.
- Failure mode: targeted role 4 but used arbitrary multi-scale shader motion; physical result remained visually like shifting glass.

### Water motion v4 / natural-v1

- Branch: `h-earth/water-motion-qualification-v4-natural-v1`
- Commit: `2bb0e8f99c14cddac42f1ac5eb4fc965343ae5bf`
- PR: #4802
- Disposition: quarantined.
- Failure mode: active role-4 multi-scale temporal treatment still presented as shifting glass.

### Global ocean tessellation

- Branch: `h-earth/water-tessellation-qualification-v1`
- Commit: `ace6c79af9323f285012a65b0ee1a4dc0e8c2ee6`
- PR: #4803
- Disposition: closed / never merged.
- Change: global distant-ocean grid tightened from approximately X=40/Z=24 spacing to X=10/Z=6.
- Physical result: initialization/presentation failure at 39%, with no shader log, program-link log, WebGL error, framebuffer error, or context loss reported.
- Conclusion: global brute-force tessellation is not an acceptable qualification strategy.

### Irregular triangle field v1

- Branch: `h-earth/water-topology-qualification-v1-irregular-field`
- Commit: `32062659df9290efb8bd61551dc83091e86e72cc`
- PR: #4805
- Disposition: closed / never promoted.
- Change: deterministic interior vertex offsets plus alternating triangle diagonals.
- Physical/design result: topology remained visibly floor-like; it distorted the coarse field rather than eliminating the exposed tile structure.

### Irregular triangle field v2

- PR: #4806
- Base: frozen `53305f5dfcdce51406363cba21c665d4e44701ad`
- Disposition: closed / never promoted.
- Physical result: same large-polygon/linoleum character remained.
- Conclusion: irregularizing the coarse field alone does not satisfy the visual requirement.

## Canonical water architecture recorded by the audits

1. Canonical water state:
   `H_EARTH_CANONICAL_WATER_STATE_RUN_7D_v1`.
2. Water body:
   `H_EARTH_COASTAL_OCEAN_001`.
3. Canonical water classes:
   `NO_WATER`, `SHORELINE_CONTACT`, `SHALLOW_WATER`, `NEARSHORE_WATER`, `OPEN_WATER`.
4. Canonical class-dependent motion parameters and wind/shoreline-derived directions already exist in `h-earth-3d/environment/h-earth.water-state.js`.
5. `render/environment-water.js` already defines deterministic spatial + temporal water-wave presentation functions, but the accepted WebGL renderer did not consume them.
6. `render/geometry-distant-context.js` is the broad visible ocean field and is a coarse regular triangle mesh.
7. GPU upload preserves the established source water role by mapping source role 2 to GPU role 4.
8. The active CP2 renderer is selected by the proven query:
   `?microrelief=v1&visual=terrain-relief-v2`.
9. The active renderer chain is Phase5 microrelief -> CP2 persistent renderer.
10. The visual defect being qualified is therefore not a missing water identity or missing water definition; it is the presentation of a coarse water surface whose polygon topology remains perceptually exposed.

## Qualification rule

No candidate advances the visual baseline unless the exact immutable URL is physically inspected and the device shows:

- the established H-Earth world;
- stable shoreline/coastal relationship;
- continuous water rather than countable floor tiles;
- natural temporal motion rather than shifting-glass shimmer;
- no startup/presentation/performance regression;
- no unrelated terrain, meso, vegetation, navigation, camera, or framebuffer regression.

Mechanical correctness alone does not qualify a visual candidate.

## Current disposition

- Frozen baseline remains: `53305f5dfcdce51406363cba21c665d4e44701ad`.
- W1 remains: `8f1c3ffd059b1074bdaaae5dfad55a85956adce9`, **not accepted**.
- Architecture audit remains: `50f9d5299d21af25e9006a32e274e36eab246891`.
- Failed candidates remain quarantined/closed and are not lineage authorities.
- Main/live remains untouched by this qualification sequence.
- No water visual candidate has been promoted as an accepted successor to `53305f5...`.

## Receipt invariant

The repository now contains durable records for the standards audit, full water audit, architecture audit, and the experimental/physical qualification sequence. Future water work must start from the frozen baseline or from a physically accepted successor; failed experiment heads must not be used as parents.
