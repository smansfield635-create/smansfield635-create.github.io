# H-Earth corridor and bank expansion — Gen2798

Operation: `H_EARTH_CORRIDOR_BANK_COVERAGE_EXPANSION_20261017_001`.
Admission: canonical lock commit `e2831dd316fe492535634ac02afecf9a88ef6cb1`, generation2798; owner source [6426/6243060593](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6426#issuecomment-6243060593). Exact base: `eb024844b1dbd2ceaaea1f822cc18b8a1913b252`. Existing published source18139014 and prior cavern/perimeter/performance work are preserved. Construction branch: `h-earth/corridor-bank-expansion-20261017`.

## Bounded product change

Append32 authored2m dry-channel stations, from(-80,-352) to(-80,-416), with strictly descending bed1.835374→1.579374m. Patch/sampler limits become z=-440/-448. Original78 D8 survey stations plus the portal head remain79 unchanged runtime drainage points. An explicit separate111-point vegetation corridor adds no survey, flow or outlet authority. Existing water routes and emitted water meshes remain identical; rear water stays paused. Natural terrain returns behind the channel before the new perimeter.

Ravine atlas now reaches z=-440 with stronger organically warped banks. Independent woodland450000/ravine150000 caps replace shared450000 starvation. Combined hard ceiling600000, packed9.6MB, tile1600. Preserve original woodland grid, thinning, ownership, shader, upload scheduling and movement behavior. The existing renderer binds the enlarged atlas bounds dynamically; no renderer/loader/scheduler changes.

## Reproducible source and CPU evidence

Run `node --test h-earth-3d/validation/h-earth.corridor-bank-expansion.v1.test.mjs h-earth-3d/validation/h-earth.terrain-cavern-seam-repair.v1.test.mjs`.

The new tests reuse the actual production habitat derivation and existing canonical Float32 beach/contact fixture, including actual water, material, slope and footprint admission. Canonical gzip SHA256 remains `48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a`.

Actual generated population:385944 woodland +150000 ravine =535944 roots;53506 ravine roots lie beyond the original z=-352 endpoint. Each16m authored section contains10623/11206/9849/8627 roots. All535944 roots have finite, duplicate-free spatial identity, admitted final visible support, clear protected footprints and no water intersection; maximum y/contact discrepancy0 in this Float32 fixture. Maximum tile816; packed allocation8575104 bytes.

Woodland raster/candidate digests match exact-base derivation. Woodland persistent XYZ/angle/seed digest: `e40321b7e6d05793f66431f38c669055a563c3229970aa6ecda3d838c3d298a5`. Expanding the indexed patch renumbers some support triangle metadata; that metadata is not a persistent root or GPU identity.

Independent geometry comparison found8195 original bridge terrain samples outside the intended join/cut unchanged exactly. Survey and complete drainage JSON remain identical. Cavern, mountain mantle, cliff, original river and oasis mesh position/index hashes remain identical. Existing threshold tests preserve140 mouth contacts(max4.21e-7m),909 support samples(minheadroom4.015m), all four terrain edges/corners with432 attribute-corresponding perimeter vertices(max1.90e-6).

The historical seam suite contains one intentionally superseded assertion: zMin=-376. New exact bounds zMin=-440 are directly asserted by this operation's new test. No unrelated historical test is edited. Legacy habitat/owner fixtures containing old64000/450000 combined budgets or loader revisions are not evidence against the admitted new budget; focused unchanged owner/resource tests are retained. The old registry's unregistered-candidate-path read-only projection does not override canonical admission and root router candidate-path recognition; no registration or control-plane repair is introduced.

## Experience, continuity and limits

Reviewed against the immutable experience anchor and its repository visual proxy. Same world, planetary/regional entry, direct travel, camera/input, four trees, shoreline/bare-beach admission, boulders, cavern/gallery and performance contracts carry forward from unchanged exact source. This operation advances the existing bank/channel deficiencies in the pinned OW01 context; it does not change world placement, narrative state, withheld map information, climate or audio. The dry extension is authored landform, not newly surveyed hydrology. No new parallel product or UI is introduced.

These are source/CPU/actual-root proofs, not GPU pixels or tablet performance. The535944 population is19.1% above prior449944. Packed bytes are bounded; frame rate, loading time, visible density quality and device acceptance remain unmeasured. Registered exact staged publication preflight and authorized release/live verification remain separate. Do not repeatedly monitor external runs; provide their links and resume when completion is reported.

One next action after immutable seven-path save and independent West readback: registered `PUBLICATION_FAST_PREFLIGHT` for the exact candidate and surface `h-earth-simple`; after an actual successful result, use the authorized guarded merge and exact release/live verification sequence.
