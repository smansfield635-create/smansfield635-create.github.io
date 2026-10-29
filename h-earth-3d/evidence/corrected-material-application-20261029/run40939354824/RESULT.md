# Result: partial visible improvement; full repair not accepted

Run40939354824 succeeded on first attempt at dispatch83ff2dd3e8090071e6628d615f95fe855f584f55 using tooling3e2c347a930003532a1452b3f549d564b7c5edd9. All8images, exact scene/attribute identities, camera pairs and358applied source triangles pass custody checks. Original artifact SHA256:f671a1e1d9fb72f3a8c1ff1d4d634a04fc23e67551b6d06e4b4a9680143acc51.

Near: broad horizontal striping is visibly softer. Far: slanted tonal transitions have reduced contrast. Residual bands remain in both, particularly horizon and upper/middle ground. Independent review agrees. These are visual observations from frozen images, not a quantified severity reduction or an inference of map-wide success.

Protected meadow and coast are byte-identical and pixel-identical to their baseline PNGs. Vegetation is visible and unchanged in the meadow control. This proves preservation for these two frozen views only.

Disposition: retain as a bounded partial-improvement diagnostic; do not accept as the complete requested repair. PR6975 remains draft. No merge, publication, new render, or repeated transport solve.

Single next action: localize the remaining visible band transitions in these saved near/far images against the already saved original indexed source mesh and world-position evidence. Separate residual source-material transitions from original primitive boundaries before proposing another bounded change. Reuse the existing evidence; no camera search, color/gain tuning, numerical re-solve or automatic GPU retry.

The original capture receipt is stored losslessly as receipt.json.gz. capture-manifest.json binds the archived images and comparison sheets; independent-capture-review.json records the independent assessment.
