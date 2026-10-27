# H-Earth Gen2940 — inland groundcover material-only band-continuity candidate

## Authority and identity
- Canonical intake `ADMITTED_AND_LOCKED`, generation 2940, [GitHub run #40600060401](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40600060401).
- Governing main before construction: `1b30c10fee76f4ec2c1dc3b9e1db7af853a1c936`.
- Immutable published Gen2928 product baseline: `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`.
- Published approved renderer SHA-256: `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`.
- Separate Gen2935 diagnostic PR #6923 is not part of this construction.
- Owner-approved source-stage evidence: run #40411050366 (artifact #12693448660) attributed a particular inland olive-colored ground material band to the procedural broad-groundcover mix expression. This does not prove all map-wide hard edges share that cause.

## One reversible material-only source edit
In `showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js` only the existing `groundcoverPatch=smoothstep` signal threshold changes from `smoothstep(0.20,0.66,...)` to `smoothstep(0.12,0.78,...)`, plus one explanatory comment. The Gen2928 attenuation `0.88 * groundcoverPatch * (1 - .25*patchContinuity)` remains identical, as do soil colors, eligibility, protection, coast, rock, grass/trees/habitat buffers, world geometry, navigation and water.

**Model-only expectation, not GPU proof:** with normalized organic input `[0,1]`, maximum derivative of color-blend weight drops approximately 30% while average weight remains within about 2% of the Gen2928 reference. The input distribution in the actual renderer is not uniform and world-space gradients may differ; only matched rendered views can establish whether the defect visually improves.

## Qualification and publication boundary
- Exact byte-invariance, easing and no-desert unit tests: `node --test h-earth-3d/validation/h-earth.groundcover-band-continuity.gen2940.test.mjs`.
- Validate exact rendered source-bound views of affected inland bands and separately healthy brown-earth, protected oasis/estate/grove, beach, mountain and coastal grass controls; preserve actual grass visible on control frames.
- Compare baseline versus candidate using immutable source/camera/asset/primitive identity and intermediate albedo/color stages, and explicitly classify remaining straight/polygonal hard boundaries as separate unresolved until proven.
- Independent West plus H-Earth experience-anchor acceptance required before owner exact-candidate KEEP/ONE_REPAIR/REJECT.
- **Not released.** No merge, Pages deployment, owner visual KEEP, Android device acceptance or map-wide fix claimed. Do not use production publication merely to produce preview.

## First incomplete checkpoint
Execute source qualification on the candidate exact head, then rebind the registered GPU comparator to this exact head using permitted paths/authority (without altering historic Gen2928 baselines), and return same-camera before/after artifact images for perceptual review.
