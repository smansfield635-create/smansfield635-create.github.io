# Shared-edge material-input decision — 2026-10-29

Decision: NO ADDITIONAL NORMAL / COAST / CONTACT SEAM REPAIR WARRANTED on the 348 linked original near/far segments. Close this hypothesis. Preserve palette richness. Do not repeat the vertex classification or continue smoothing colors to reduce soft-band scores.

Continues cce526de02f123469144442e3f42920e15f0192a under existing operation H_EARTH_CORRECTED_MATERIAL_RENDERER_20261029_001. AI-entry read-only route executed. Frozen source renderer SHA256 fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec; original scene cb57c275b95d0d48883bc4da4dcfcf17cbec5060. Uses the previously hash-verified uploaded geometry and attributes.

The exact source contact generator was extracted and replayed on saved uploaded triangles, then passed through the source seam presentation. All 13 non-timing contact statistics match all eight saved capture views. The new contact buffer is reconstructed CPU evidence, not a newly read GPU buffer; its SHA256 is in replayed-contact-receipt.json.

348 overlapping indexed boundary segment pairs cover 2088.4898506417453 m. Compare both overlap endpoints and midpoint using linear interpolation of each side's actual Float32 attributes. Since each component difference is affine on each paired segment, the endpoint maximum bounds the whole segment; this is not just an arbitrary point-sampling claim.

| Channel | Maximum absolute difference |
| --- | ---: |
| Raw normal component, corrected for far sign | 2.9639499743439046e-8 |
| Coast distance | 0.000026233342168779927 m |
| Replayed contact distance | 0.0000014833188330953817 m |

These magnitudes are consistent with numerical precision. The renderer explicitly flips inward far normals before slope calculation. Ordinary near and far both take the shared worldSoilTerrain material path. The earlier far-specific base tint is overwritten by palette; materialSignal contributes zero to ordinary soil ambient. This source trace does not certify every later shader operation.

Independent paired review reproduced all 348 pair records and total length, checked absence of overlapping intervals, verified contact statistics against eight captures, and accepted closing the substantial normal/coast/contact discontinuity hypothesis. No blocking flaw found.

Limits: not a global visual certificate, not final-fragment equivalence, not new runtime qualification of the earlier contact-refresh repair. The two thin isolated mesh loops remain separate. Candidate correction is still restricted to 358 source faces. There is no evidence here that every other face needs this correction, and blindly extending the local atlas is not authorized by the result.

Next stage: product integration and coverage decision. Freeze the saved richer appearance and existing comparison, map the intended production correction to the active terrain consumers, and implement only the necessary admitted integration delta. If a capture is needed to validate that delta, use one bounded baseline/candidate comparison at frozen affected poses and healthy controls, immediately return verified run URL, exact commit, frame plan and artifact, then yield. Do not launch another broad diagnostic sweep. Resolve any required integration scope through the existing AI entry/intake; this report does not extend mutation paths or authorize publication.

Reproduction:
- node replay-contact.mjs <mesh-directory> <pinned-renderer.js> <terrain-seam-normal.v1.js> <output-prefix> <capture-receipt.json>
- python check-shared-edges.py boundary-inputs.py <mesh-directory> <capture-receipt.json> <vertex-output.json> <output-prefix.bin> <edge-output.json>

No product code changed in this checkpoint. No GPU run, merge or publication. Chamber display synchronization remains unverified.
