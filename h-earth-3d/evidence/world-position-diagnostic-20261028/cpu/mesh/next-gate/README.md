# H-Earth source-mesh gate v3 — adverse-flux correction

Research status: executable mesh gate and conservation tests **PASS SYNTHETIC_ONLY**; original uploaded H-Earth mesh and source-defined 2D color correction **NOT QUALIFIED**. This is evidence, not a product patch.

## New exact assertion and repair

Version 2 incorrectly used **net** requested per-node RGB flux to determine available incoming and outgoing color capacity. Different per-edge coefficients could break the cancellation and create out-of-gamut output. A deterministic 6-node dense-graph witness (seed 1, trial 1) fails with `POST_GAMUT` on v2. Simply raising tolerance or post-clamping would conceal the defect and violate conservation.

Version 3 instead computes total *gross* positive and negative mass at each node/channel before limiting any edge. For a requested signed flux F_ij, incoming capacity is area_i*(1-Q_i), outgoing capacity is area_i*Q_i. Each undirected RGB edge receives a single common coefficient no greater than the smallest of its source/outflow and destination/inflow ratios across all three channels; equal and opposite accepted flux is then applied to both nodes. This conservatively guarantees 0<=Q'<=1 and exact paired area-mass conservation up to floating point roundoff, even with opposing requested fluxes. Protected incident edges remain zero.

Reproduction: `python3 -m unittest test_mesh_gate -v`; Python3, NumPy, SciPy, Shapely. 12 tests pass, including 10,000 seeded dense six-face gamut/mass trials, 200 prior mass tests and near/far seam, nonmanifold, overlap and zero-area tests. Synthetic tests do not prove real-source mesh closure.

## Immutable input dependency and source custody

The original frozen approved source is `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`, original world file `showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz`, expected SHA256 `48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a`, size 11,736,235 bytes, Git blob SHA `3d11947ad94f98736035cbdf0e021e5f324659fb`. GitHub connected text API provides file/blob metadata but no binary bytes for this file; the alternative recovered Gen2824 candidate is hash `e4ff829a51c98b1f0383c9cf4f30f321aa8ecb833fbc108b460a7538d98bef67` and **must not** be substituted. The older recovered Git bundle lacks prerequisite parent `12357909b2cbaab16052b6c30459065547fe9440`. Neither source is a qualified replacement.

Once the exact original 11.7 MB asset and frozen renderer modules are materialized, run the *already committed* 
`cpu/mesh/reconstruct.mjs`, `reconstruct-direct.mjs`, `upload-replay.mjs`, `match-surface.py` to regenerate original buffers. Verify `upload-positions.bin` SHA256 `342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83`, `upload-indices.bin` SHA256 `483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c` and all 2,484 samples / 2,575 candidate memberships. Then run `mesh_domain_gate.py --mesh-dir ... --report ...`, independently audit each seam cut and 40m influence boundary, and only afterward evaluate fully paired source-defined P(c,f0)/D(c,f0) and actual mesh-area 2m/1m appearance/conservation. Do not infer success from the older 1D proxy.

No new GPU run, shader/geometry/vegetation mutation, render publication, or source-asset approximation. Keep v1/v2 in Git history as rejected intermediate implementations.

## Gen2967 source-native support-domain qualification (2026-10-29)

The first actual source-native mesh replay, GitHub Actions #40889517193, regenerated the exact original 141,373 Float32 uploaded positions and 366,666 Uint32 indices; both pinned SHA-256 checks matched. The original 2,484 observations and all 2,575 memberships survived. The V3 gate stopped with `SOURCE_SEED_OUTSIDE_SUPPORT` **before** computing final topology closure.

Read-only examination of those exact uploaded buffers proved that the 48m **centroid** selection excluded 3 of the 47 source face seeds, all large FAR continuation triangles: their centroids were about 71–149m from the nearest observation, while the observations themselves lay within at most 0.0452m of the actual source triangle footprints. That is an invalid centroid-selection proxy, not invalid source geometry.

The versioned source-selection correction keeps the **original fixed 48m radius** but uses the real 2D projected source-triangle distance to any of the archived witness XZ positions. A KD tree and source triangle's maximum centroid-to-vertex distance are only an exclusion-safe prefilter; the exact Shapely triangle-to-point distance decides admission. This selects 358 original faces instead of 317, and retains all 47 seeds, with no screenshot-triangle substitution or source mesh modification. A large-triangle positive fixture and distant-face negative fixture are now required regression tests; failure JSON is preserved even for an early assertion.

**Important independent negative finding:** the expanded exact source domain also exposes 18 NEAR/FAR projected overlap polygon pairs, combined projected area about 0.0005452 m², maximum pair about 0.00014483 m². Their interpolated elevations differ by no more than about 0.00000905 m and occur in a narrow band near Z=-736. They are retained as original Float32 seam witnesses. The existing V3 `no_duplicate_projected_area` test and epsilon `1e-12` remain UNCHANGED. Do not report closure by tolerating, clipping or erasing them without a separately proved single-ownership conservative domain.

Evidence: `source-physical-support-audit.py` and `source-physical-support-audit.json`, run #40889517193 and original artifact #12903309782. The actual 40m artificial cut influence, complete near/far seam closure, primitive retirements, paired source P(c,f0)/D(c,f0), and physical 1m/2m appearance **remain unqualified**. No product/GPU modifications or publication authority.
