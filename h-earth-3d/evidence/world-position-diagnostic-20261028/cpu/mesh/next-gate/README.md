# H-Earth — exact source-mesh domain gate (research, not product)

## Result / decision

Preserved source branch: `h-earth/world-position-diagnostic-20261028`, exact head `33e752c712be61cd2a5c3f52a35b55da0354fe30`.
Frozen published-source anchor: `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`.

**The source-mesh closure gate is NOT yet passed.** The original uploaded position/index binary buffers, which are reproducible using the already-committed CPU mesh construction, are not present in this ChatGPT room's recovered ZIP archives. Running `mesh_domain_gate.py` against these archives correctly fails `MISSING_ORIGINAL_UPLOAD_POSITIONS`. Do not use the captured pixel positions as replacement triangle vertices.

The complete new, unchanged, source-bound world-coordinate archive is included in this packet. `audit_image_geometry.py` and its `image-geometry-audit.json` independently show why screen-derived quadrilaterals are unsafe for physical area:

- Six original inland near/far pixel patches, 4,320 image-derived pseudo triangles.
- 24 have exactly zero **nominal** area, and 3,974 have nonpositive *guaranteed lower area bounds* when the original XYZ scalar-code half widths are retained.
- This invalidates an image-grid source-area workaround, **not** the world-position capture or the 47 original-source-triangle associations proven in the committed CPU audit.

`mesh_domain_gate.py` is a new fail-closed CPU verification algorithm, not a shader or visual correction. It requires the exact source-upload positions/indices and 2,484 recorded sample-to-source associations before it can report a physically grounded result. All source input hashes and package identities are checked; triangles are never silently collapsed or corrected.

## Reproduction from the already frozen source and diagnostic evidence

1. From the published source commit `cb57c275`, materialize the existing original asset 
   `showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz`, exact SHA-256 `48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a`, and materialize the frozen ES modules. Use the repository's existing committed CPU instructions at
   `h-earth-3d/evidence/world-position-diagnostic-20261028/cpu/mesh/README.md` (branch `33e752c7`).
2. Re-run the **already committed** `reconstruct.mjs`, `reconstruct-direct.mjs`, `upload-replay.mjs`, `match-surface.py` against the same frozen source. The original 2,484 witness associations must retain all 2,575 memberships, including 86 ambiguous locations.
3. Run `python mesh_domain_gate.py --mesh-dir /tmp/mesh-cpu --report ./source-mesh-gate-result.json` using NumPy, SciPy and Shapely. Compare with the committed `cpu/mesh/domain-audit.json` (47 seed triangles and six verified near/far candidate links). A result failing to close the physical domain remains a **failed research gate**, not permission to widen tolerances or change rendering.
4. Run `python test_mesh_gate.py` (ten fixture/functional tests) and `python audit_image_geometry.py --archive ./h-earth-world-position-original-40790969812.zip --report ./image-geometry-audit.json` (verified source images and quantization-based no-go report).

## Acceptance law

A v2 independent seam audit corrected a near-edge loop-variable shadowing defect in the provisional gate, added near- and far-side partial-seam rejection and checks that verified sealed edges no longer count as open cut edges. Ten tests pass in the corrected version. The previous version remains preserved in Git history; do not use it for source-mesh acceptance.

The **mesh-domain** gate needs every selected source triangle from the original uploaded indices, positive Float32-source 3D area, nonoverlapping active terrain faces, source-indexed adjacency, verified near/far T-junction overlaps, protected/no-flux estate/oasis/route/grove zones and adequate influence-radius distance from artificial cuts. Ambiguous memberships may not be dropped. Candidate transport uses symmetric paired flux and one RGB gamut limiter, not clamping, and must maintain area-weighted RGB integral exactly. The conserved computation remains separate from material texture and appearance gates.

The **product-repair** gate is still later and separate. The paired complete source expression `P(c,f0),D(c,f0)` must be evaluated with sampler/mip/normal uncertainty over the resolved physical domain, then judged at both 1 m and 2 m with frozen near/far and healthy meadow controls. The rejected six-transect continuous proxy and the lost 31.7% local trial do not establish global appearance improvement.

No product sources, original vegetation, ocean, navigation, or assets were changed here. No GPU job was launched. No merge or deployment was performed. This packet is evidence and a reproducible gating implementation only.

## Known boundary of this room

The exact 141,373-vertex uploaded positions and 366,666-index binary buffers were **not included** in the prior recovered archives; original source modules/asset require the repository's CPU reconstruction. New code is tested on synthetic source-topology fixtures and real source-bound diagnostic PNGs, but has **not yet run on real uploaded mesh bytes**. Do not report the gate as qualified until that run succeeds and its receipt is independently reviewed.