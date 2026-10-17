# H-Earth fine-grass continuity candidate — Gen2785

Status: source/CPU and software GLES qualified candidate; not merged, adopted, published, or owner accepted.

Operation `H_EARTH_FINE_GRASS_CELL_CONTINUITY_20261017_001`, governing main `f0fe69232f5249f8f5c7ca15a2b87c983ffeb3ae`, branch `h-earth/gen2785-fine-grass-continuity`. Native canonical admission commit `45feec6a308e306f1bb3d08c000945db0f4fbc07`, sole ledger blob `924cc76f1e819f520de2a65a25c17a7ffbaa7067`, owner source comment <https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6426#issuecomment-6229331350>. Planner bytes, exact parent, sole path and independent owner provenance were read back and verified before product construction.

## Problem and resulting behavior

The old selector snapped the camera to4m cells and abruptly changed the selected root set. The actual unmodified selector reproduced2286disappearing and2265appearing roots across a2mm boundary crossing in a synthetic fixture. Deterministic A-B-A regeneration did not establish temporal visual continuity.

The candidate uses continuous importance evaluated at the actual camera position. The first excluded (K+1)th importance is the cutoff: roots exchange selection membership at zero coverage. A64-level ordered screen-door shader controls coverage without moving root coordinates or changing blade height, width, bend, color or geometry. Root priority is derived from the existing Float32 angle using the same integer arithmetic in CPU and GLSL; no additional GPU root texture is allocated. The former GLSL local variable `packed` is renamed `rootRecord` because Mesa treats the former as reserved.

Nearby fine detail fades14–20m, inside the unchanged24m complete cache core even with a4m snapped-center offset:20+sqrt(8)<24. Approved woodland retains56–62m support. Two owner groups share existing1024-parent/64-root texture capacity and conservative128-slot padding reserve. The shorter nearby detail range is a deliberate visual tradeoff requiring rendered acceptance against global coarse cover.

Root selection textures upload only when packed membership changes. Explicit opt-in reuse avoids repacking unchanged membership while updating the cutoff; default selector callers retain independent returned storage. Priority/support limits are cached; impossible roots are rejected before expensive score evaluation. CPU telemetry separately reports the optional8bytes/root support cache beyond the existing44bytes/root prepared arrays.

## Verification and limits

Command:

```sh
node --test h-earth-3d/validation/h-earth.fine-grass-continuity.v1.test.mjs h-earth-3d/validation/h-earth.cavern-vegetation-repair.v1.test.mjs h-earth-3d/validation/h-earth.planting-pilot.v1.test.mjs
```

54tests passed,0failed,0skipped on the available runtime, including13new independently authored West cases. Coverage includes2mm x/z crossings, capacity rank swaps/ties, independently sorted K+1 cutoff, capacities0/1/2/3/1024, maximum texture bounds, root uniqueness/padding, exact xyz/angle preservation, A-B-A/presentation isolation, nearby support guard, explicit packed reuse, and renderer wiring. Node syntax and whitespace checks pass.

The reproducible optional software GLES probe is embedded in the new test. It extracts actual shader source, compiles and links it, then executes512transform-feedback coverage comparisons on OpenGL ES3.2 Mesa25.2.8 llvmpipe. Maximum CPU/driver coverage difference0.000003922079949925106; zero expected-zero/nonzero mismatches. This is software GLES evidence, not browser, whole-scene pixels, physical Android or driver-general precision proof. The test explicitly skips when the needed Python/EGL substrate is absent.

Independent N/E review confirmed continuous fixed-population scoring/cutoff and cache support reasoning; E verified unchanged blade geometry. W independently authored and executed the new tests. Their review does not replace the Experience Anchor or owner acceptance.

A synthetic160000-root moving-camera benchmark of the intermediate candidate measured19.27ms median/72.16ms worst sample. The optimized candidate with renderer-style packed reuse measured12.35ms median/28.06ms worst over20samples after4warmups. These measurements compare candidate iterations, not production baseline or Android performance; they expose remaining frame-budget risk. Fixture:400world4mtiles from[-40,40)²,400roots/tile on20x20grid at.2mspacing, angle=fround(sequence*.0001); camera advances.002m/sample. No target-device performance pass is claimed.

## Preserved scope and unfinished acceptance

Canonical records, terrain, geology, water, trees, habitat admission, global cover module, loading/readiness scheduling and release tooling are unchanged. Prior Gen2782/2783/2784 production closures remain complete. Registry facade has no exact node for these newer files; root router resolves H_EARTH and admitted exact paths provide scope; no persistent registry or policy change was manufactured.

Continuity applies to a fixed available root population and completed nearby cache support. Startup partial-install changes, moving faster than preparation, and global/pilot handoff remain separate qualification cases. The full startup/loading repairs from the audit are not implemented here.

Next action: qualify this exact immutable candidate in the existing owner-controlled browser/device review route with one continuous walk across x/z cell and woodland/cache boundaries, then back. Measure actual selection/upload/frame costs, inspect dither and14–20m transition against coarse cover, and establish Experience Anchor visual/interaction/continuity evidence before acceptance or release. No passing Experience Anchor receipt has been fabricated; its reserved allowed path remains unwritten until actual required evidence exists. Preserve the candidate and active admission if preview transport is unavailable. No production deployment as a preview workaround.

## Exact reviewed source identities

- `showroom/globe/h-earth/render/woodland-fine-grass.v1.js` SHA-256 `70ffab96bda51d5fb287097b03c088c1fd9aae8c348006aaf351f3a879766ed4`
- `showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js` SHA-256 `9187f16a441960a1fd636bf14ac0e38d53890989a5677345f69c84767ee2fcf1`
- `h-earth-3d/validation/h-earth.fine-grass-continuity.v1.test.mjs` SHA-256 `4f9beeafaebd3fd2510fcdd78769fbb809a3ee01b023523520fb116f1d9a50b6`
