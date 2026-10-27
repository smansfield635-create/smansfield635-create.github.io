# Gen2928 — accepted groundcover amendment, global shader reach, proportional release evidence

Operation: `H_EARTH_GROUNDCOVER_BAND_CONTINUITY_REPAIR_20261026_001`; canonical admission generation 2928, [authentic receipt](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6433107959). Frozen visually approved renderer on PR #6920: source commit `d540c7c05ea77bbcab83d7489100d7aa8082b747`; shader SHA-256 `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`.

## Owner scope and conditional publication direction

Owner first positively approved the actual before/after Gen2928 candidate images, [recorded verbatim](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/6920#issuecomment-6449187145): “Yes, these look great. These look like the changes we were looking for.”

On 2026-10-27 owner further clarified: “I don't know that we need to go that far because vegetation was never the problem. And it's a separate problem than the one we're dealing with. So if we've expanded it through the full environment, we should publish it. If not, that should likely be our next step.”

Interpretation: accept the **bounded groundcover material** appearance and direct publication **conditional on the correction being wired to the shared terrain runtime**; do not make new vegetation design or physical-vegetation redevelopment a product goal. This is not approval to weaken the hard experience anchor, falsify a physical test, or claim every other hard-edge class solved. Further distinct map-wide hard regions remain in #6911.

## Actual world application — source proof, not inferred from four pictures

At the frozen candidate, renderer `showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js` defines `worldSoilTerrain=geologicalEarthRock || vRoleCode==1u || int(vPrimitiveIndex)==uGlobalCoverFarPrimitiveIndex`. The authored near terrain **and exact far-land continuation** enter the same shader's `worldSoilTerrain` material path. Its existing `!geologicalEarthRock` environmental/groundcover path computes the one changed scalar:

```glsl
float groundcoverPatchContinuity=smoothstep(0.30,0.85,groundcoverPatch);
float groundcoverWeight=0.88*groundcoverPatch*
  (1.0-0.25*groundcoverPatchContinuity)*
  groundcoverSuitability*groundcoverProtection;
```

This is not scoped to the fixed GPU camera points. It operates on every eligible rendered groundcover fragment using the active shared terrain material, including near and far world-soil. Local rock/coast/shoreline and protected oasis/estate/route/grove exclusions intentionally remain in force. The geological exposed-rock branch, water roles, foliage roles and subsequent local habitat/shoreline overlays have their own material logic and are **not** asserted to inherit this same attenuation. No global fix to every known polygonal/curved material boundary is claimed.

## Exact candidate A/B qualification and owner acceptance

- Original published source GPU run: [40514307979](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40514307979), 20 source-bound reference frames, artifact `12739776958`.
- Exact candidate GPU run: [40544837764](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40544837764), 20 candidate frames, artifact `12753941463`; both complete/success, source/camera/asset guards and matched factor views passed.
- At inland far, effective mean blend attenuated from 0.653448 to 0.510697, measured actual GPU mean RGB delta 4.129/255/channel. Inland near: 0.190767 to 0.182028, delta 0.255/255/channel. Healthy coast control: zero effective weight and pixel-identical. Another coastal observer: delta 0.016/255/channel.
- Before-groundcover albedo and patch-weight input images match exactly at all four viewpoints; source guard verifies that the **only renderer difference** is the single bounded groundcover formula. No geometry, planting roots, vegetation, navigation, coast, assets or user interaction files changed from the baseline.
- Owner accepts **the shown material improvement**, rather than the unknown full map-wide defect outcome. These diagnostic images hid grass intentionally to isolate the changed material; they are **not** a physical device simulation or an Android traversal claim.

## Experience-anchor evidence reuse and honest boundary

[H-Earth's controlling anchor](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/d540c7c05ea77bbcab83d7489100d7aa8082b747/h-earth-3d/experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json) and its repository contact-sheet proxy require one canonical navigable world, continuous topology, and unchanged embodied interaction across planet/region/ground scales. Compare the exact one-expression material change with the existing [terrain-seam publication anchor acceptance](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/d540c7c05ea77bbcab83d7489100d7aa8082b747/h-earth-3d/experience-anchor/receipts/terrain-seam-publication-v1.json), which explicitly carried forward unchanged navigation/scale continuity using source custody and previously captured normal views without falsely asserting a fresh physical Android run.

The *affected invariant* here is soil color only. The original runtime navigation, world geometry, globe/region flow, user controls, water and plant draw ownership remain byte-identical. Reuse the previously qualified identity and interaction evidence at `h-earth-3d/evidence/terrain-seam-publication-v1/near-far.test.mjs`, `h-earth-3d/evidence/terrain-seam-publication-v1/source-custody.test.mjs`, and `h-earth-3d/evidence/terrain-seam-publication-v1/evidence.json`, expressly as **inherited source/runtime continuity**, not as a test freshly run on the new SHA. This is a proportionate anchor review for a material-only change and does not expand the change into vegetation.

**Limitations and remaining release separation:** No new grass-on Android physical acceptance, no newly executed planet-to-ground navigation replay, and no independent West model instance is asserted by this record. The originally registered independent West review and applicable release authority remain separate from owner approval and exact-GPU evidence. Existing anchor gate #40544837413 failed because the *candidate-specific receipt was missing*; do not waive the gate. Classify the bark-template/frozen hash/path-resolver CI results by direct dependency before allowing them to block the shader. Release only through the existing eligible merge + exact-head Pages deployment + live-source verification. This document is evidence, not a deployment.

## Browser cache-binding completion (publication dependency)

On the candidate at `aba0773fa40d622af8be27e498548f29195fcd7e`, the actual H-Earth entry page’s two import-map identities for the persistent terrain renderer still pointed to `rev=internal-coast-7ac013645110fc91ac9d`, the earlier shader identity. A changed source blob served with the same browser request URL risks reusing old cached bytes, so material integration in source alone is insufficient for dependable publication. The exact two import-map target URLs in `showroom/globe/h-earth/index.html` are therefore changed to `rev=groundcover-fa6acc426c75c3b2292b` within the **already-admitted index path**, leaving map keys, runtime logic and all other import-map identities unchanged. The corrected HTML SHA-256 is `b706cd0c9462abd80ae6ccab916ce987541e08e5e162d9141f81bd0fdc398ec8`. The candidate-specific anchor receipt binds both HTML and the previously qualified, unchanged GLSL shader hash. This is browser asset-identity correction, not vegetation or material redesign. The new exact commit must be freshly checked before merge and deployment.
