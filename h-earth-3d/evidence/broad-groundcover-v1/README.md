# Broad terrain groundcover

Operation `H_EARTH_BROAD_GROUNDCOVER_20261024_001`, admitted generation 2881 by run [40062427848](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40062427848), canonical return [6379854306](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6675#issuecomment-6379854306). Exact source baseline: `405374758079c1d89000fb24af7d1f6862ea504c`, the published oasis accepted by the owner. Owner authorizes broad terrain-material construction, qualification and publication; no physical-review checkpoint is declared.

The shared near/far terrain shader blends sage, olive and straw into suitable inland ground. It reuses existing world-position macro/meso fields, shelter, wetness, slope, exposed rock and material grain. Bare patches remain; beaches, steep faces and exposed mineral reject added cover. Coverage is independent of camera distance. The original world roles, exact far-land primitive selection and all geometry remain unchanged. The far continuation remains nonnavigable context.

The accepted oasis mask rectangle and its outward feather, the four-tree grove, navigable estate and approach footpath are protected. Existing sand, bank, habitat and tree-floor treatments still execute in their original order. Water, boulders, roots, prepared assets, camera, navigation, audio, interaction and world extent are unchanged. The only entry-page change is the two import-map renderer content hashes.

## Evidence and limits

`groundcover.test.mjs` evaluates the actual inserted scalar shader expressions through `sample-shader.mjs`. It checks bounded finite deterministic weights, feather continuity, near/far eligible examples, bare patches, coast/slope/mineral exclusions, protected oasis/grove/estate/path samples, exact renderer preservation outside the insertion, and the two cache aliases. South executed six passing tests and JavaScript syntax validation. Independent review and immutable-candidate browser results are recorded in the PR/issue continuation, rather than rewriting this artifact after qualification.

The original generation2881 introduced no new geometry, texture sampling, noise sampling, uniforms, resource allocations, draw calls or grass roots. The generation2883 repair below adds one scalar noise sample. Additional fragment arithmetic is not free; these checks do not measure phone GPU frame time. Numeric material evidence is not a rendered scene screenshot or owner aesthetic acceptance. The existing exact-candidate publication preflight remains required before publication and checks real browser shader/startup/entry behavior.

## Anchor and construction continuity

The controlling experience anchor and its repository visual proxy were reviewed. This bounded material treatment retains the same navigable world, camera, horizons, geography and direct interaction. Exact source comparison establishes preservation of those mechanisms; it does not newly certify every planetary/regional experience or device. Anchor invariants are carried forward for unchanged mechanisms from the accepted live baseline. The owner is requesting this change in ground appearance within that world.

East reviewed the applicable OW01 construction context, reciprocal baseline, narrative/world binding, environmental acoustic contract, preconstruction record, display constitution and public narrative map/spine. This delta addresses D02/S01 distant material continuity, D03-D04/S02 environmental balance and D06/S04 local-field-based treatment. It creates no new geography, narrative facts, audio or access rights and does not close unrelated morphology deficiencies or the whole OW01 program.

## Reproduction

```sh
node --test h-earth-3d/evidence/broad-groundcover-v1/groundcover.test.mjs
node --check showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js
```

Tests require the exact baseline Git object and resident prepared-vegetation manifest. No prepared grass/vegetation rebuild is needed for this shader-only change.

## Olive palette correction

Operation `H_EARTH_OLIVE_GROUNDCOVER_20261024_001`, admitted generation 2882 by run [40064221356](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40064221356), canonical return [6380091345](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6675#issuecomment-6380091345). Exact source baseline: `03de8e0ace21ccf5e2bafdb55786ef4a32a9ef93`. The correction changes only the three groundcover color constants to muted olive and dry-grass tones, then updates both renderer cache aliases. Coverage, all protected regions, resources, geometry and prepared assets remain byte-identical.

Exact baseline replacement proof confirms only these RGB triplets change: sage `(0.150,0.215,0.100)` to `(0.135,0.155,0.105)`; moist `(0.095,0.170,0.065)` to `(0.095,0.120,0.075)`; straw `(0.310,0.265,0.130)` to `(0.245,0.225,0.160)`. The six existing focused tests and syntax check pass. Prior independent coverage/resource findings are retained for their unchanged scope. New palette review and exact-candidate browser qualification are separate; this record does not claim aesthetic or physical-device acceptance.

## Organic dark-earth repair

Operation `H_EARTH_ORGANIC_GROUND_20261024_001`, generation2883; admission run [40109450454](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40109450454), canonical receipt [6386345561](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6675#issuecomment-6386345561). Baseline `68e3a38eb51f43c50fadd019eac9103b69dbe102`.

A rotated domain warped by the resident broad/macro signals supplies one additional `noise2` sample. The patch blend widens from0.24–0.62 to0.20–0.66. This targets Cartesian field bias rather than changing coordinates, mesh normals, world geometry or lighting. The protected oasis/grove/estate/path expressions, suitability gates, maximum blend, moisture/dry logic and existing texture grain remain unchanged. Colors become woodland-inspired earth/sage `(0.110,0.118,0.075)`, moist olive `(0.075,0.090,0.055)` and dry litter `(0.175,0.150,0.095)`. Existing woodland material is untouched.

South compared scalar coverage maps over600m and180m spans, including stronger warp1.2. The selected0.65 warp shows irregular connected boundaries; stronger warp introduced more narrow fragmented patches without a clear advantage. These maps isolate the scalar material field, not the rendered scene. Rotation alone does not prove improvement: the source-derived survey also measures peak orientation concentration and open/covered fractions.

`field-survey.mjs` evaluates the actual candidate patch expressions and source field declarations through the reviewed CPU adapter; the baseline patch expression is read from the pinned Git source. In361,201 samples, axial transition gradients decrease27.04%→23.99% (uniform reference22.22%), and the largest10-degree orientation bin decreases7.10%→6.11%. Transition samples increase121,106→139,965; almost-bare remains10.09%, almost-covered27.997%, and mean patch weight0.604. These are scalar field distribution measurements, not terrain-area measurements, GPU results or aesthetic acceptance. See `organic-field-survey.json`.

The six retained checks plus one source-derived distribution test pass, as does JS syntax validation. The sampler uses a source-identity-checked CPU-double adapter for resident GLSL noise, not native GLSL execution. Independent West review and exact-candidate browser/rendered near/mid/far evidence remain separate qualification steps. No rendered visual success or device frame-time claim is made here.

Cost: one extra value-noise call (four hash evaluations plus interpolation), a rotated/warped domain and scalar arithmetic per applicable terrain fragment. No new textures, texture reads, uniforms, resources, geometry, draw calls or roots. No prepared asset changes or rebuild. This is a bounded arithmetic increase, not a claim of zero performance cost.

Reproduce with `node --test h-earth-3d/evidence/broad-groundcover-v1/*.test.mjs` and `node h-earth-3d/evidence/broad-groundcover-v1/field-survey.mjs`. Tests pin the current baseline and prove exact preservation outside the bounded block and two cache aliases, with unchanged protected-mask/suitability/moisture expressions inside it.

## Controlled browser material check

North compiled and linked the exact baseline and candidate vertex/fragment shaders, resolving all three imported GLSL fragments from their actual module exports. Chrome for Testing156.0.8078.47 / SwiftShader rendered both at120m,600m and2400m spans with no WebGL draw errors. The120m and600m cases select the near-terrain role;2400m selects the exact far-continuation shader branch. `browser-material-result.json` records conditions and results; `browser-material-comparison.png` shows the controlled comparison. Candidate RGB means are lower in all three channels at every scale. The comparison shows darker irregular material distribution under those conditions.

The fixture is a flat plane with constant normal and gray soil texture, fixed lighting and no fog. It does not reproduce the live mesh, grazing views, habitat textures, scene startup or phone performance. The full-scene exact-candidate preflight remains required. Residual geometry/lighting facets remain an open audit item; this repair does not claim that all screenshot boxes are gone.

Reproduce the harness with `python h-earth-3d/evidence/broad-groundcover-v1/browser-material-probe.py /tmp/h-earth-material-probe`, then open the generated `browser-probe.html` with WebGL2 enabled. Headless execution used `--enable-unsafe-swiftshader --use-angle=swiftshader --screenshot --dump-dom`; the result is emitted in the page's `result` element.
