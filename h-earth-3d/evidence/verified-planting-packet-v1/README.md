# Gen2800 verified planting packet

The saved packet is integrated into both package startup paths on `h-earth/gen2800-verified-planting-packet-20261017`. This candidate remains a draft: no merge, deployment or publication is authorized by these checks.

Checkpoints: `06e6a35a64c48909a61b2a33c19a10e85950543f` saved the lossless modules; `aa49d4072ccd1d2c7c25c05f6f5550e73216cfdc` connected startup and runtime consumers. The commit containing this document adds qualification/evidence only. Both data modules and all runtime source remain unchanged from those checkpoints. Existing admission, packet, census and differential-continuity evidence are reused.

## Integrated CPU results

The actual production grass builder ran against the archived Float32 canonical base, the exact candidate geological exterior, rendered beach signals and shared ground admission. Every one of 525,142 candidates was accepted without rejection: 385,944 woodland and 139,198 ravine roots. The selected-cell atlas contains 12,577 cells and preserves woodland texels.

The full packed roots and seed/region sidecar matched the preserved packet byte for byte. Woodland identity also matched exactly:

- Woodland: `e40321b7e6d05793f66431f38c669055a563c3229970aa6ecda3d838c3d298a5`
- Root bytes: `d90752a5e4d9c4f1f3e0bcc56edac6bc53cff09e07f1c70c0b1f12f9fff06dde`
- Seed/region bytes: `fbdd8604fb367bfce0528edfa01f13d5b797ad9d6a0804e7dfbc57806ac09417`

The actual owner packer produced 1,770 tiles, maximum 816 roots/tile and 8,402,272 packed bytes. Instrumented GL calls from the production owner requested one buffer of exactly that size and uploaded those bytes in bounded slices. Camera A-B-A produced the same selection, with zero per-frame uploads. This is CPU submission evidence, not successful GPU allocation, shader compilation, rasterization, frame-rate or peak-memory evidence.

All four original trees remain intact and four distinct proposed tree IDs are added. Sector geometry totals 79,052 triangles, below 105,000. Every tree's six lower-cylinder vertices has actual Float32 ground support; new-tree minimum measured burial is 0.1694517136 m. This vertex test does not prove every point of the ground seal.

Continuous grass-versus-bark separation is bounded using actual Float32 bark triangles clipped below the highest nearby grass tip. A conservative radial envelope covers every point of each clipped face; a 0.071 m grass horizontal envelope covers width, bend and planetary-up displacement. All bark is asserted inside the 5 m neighborhood used for the proof. All eight trees pass; the minimum new-tree separation lower bound is 1.4540668906 m. The nearest new-tree root center is 2.1188068542 m, beyond the saved 2.108 m exclusion.

## Complete preparation execution and remaining color difference

The complete production canonical module executed in separate Node workers through verified precomputed hydration and a deliberately forced generated fallback. Both complete with 141,373 vertices, 122,222 triangles and eight tree footprints. All positions, normals, indices, material-parameter/model buffers and new canonical tree colors agree. Browser Worker transport and main-thread adoption were not exercised.

Full package byte parity does **not** pass:

| Branch | Raw digest | Canonical digest |
| --- | --- | --- |
| Precomputed | `fnv1a32:86c9b4f2` | `fnv1a32:4f1b7ff2` |
| Generated | `fnv1a32:0c547a91` | `fnv1a32:27d493d6` |

The only differing buffer is `baseColorsLinear`: raw old-prefix 63,172 components and appended 14,079; canonical old-prefix 22,239 and appended zero. Maximum canonical difference is 0.0933173299. The adapter preserves each input prefix, so the old-prefix albedo divergence is inherited archive-versus-source behavior. Independent review found no Gen2800 adapter repair warranted. Changing approved terrain/archive colors would extend this planting packet's remit. Record `INHERITED_BASE_ALBEDO_DIVERGENCE_RECORDED_NOT_REPAIRED`; do not call this unconditional cross-startup byte parity or merge readiness.

## Reproduction

The existing test file now includes opt-in production CPU and full preparation-module checks:

```sh
H_EARTH_PLANTING_FULL_QUALIFICATION=1 node --test h-earth-3d/validation/h-earth.verified-planting-packet.v1.test.mjs
```

Default execution retains the four fast adapter checks and skips the two full checks. `H_EARTH_PLANTING_SOURCE_DIR` and `H_EARTH_EXACT_WORLD_BINARY` select an isolated exact-source mirror and the unchanged archive when needed. The expanded suite passed 6/6 (zero skips). The final clearance-neighborhood assertion was added after suite launch and separately evaluated PASS on the same eight geometry results. Source custody was checked across 80 imported production files against immutable GitHub blobs and the complete disjoint compare from the local base.

## Remaining acceptance

Browser main-thread adoption, real WebGL behavior/resources, current camera refinement, continuous tree ground seals and tablet/perceptual experience-anchor acceptance remain unverified. No local Chromium executable or cached Playwright Chromium was found during this continuation. This preview-execution limitation preserves the candidate and does not authorize production deployment as a workaround.

Next: review the draft exact candidate on an authorized browser/device substrate, including disposition of the inherited fallback terrain-color difference, then complete experience-anchor acceptance. Reuse the packet/admission/CPU proofs. Do not regenerate the packet, repeat census/admission, merge, deploy or publish.
