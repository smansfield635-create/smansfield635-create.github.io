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