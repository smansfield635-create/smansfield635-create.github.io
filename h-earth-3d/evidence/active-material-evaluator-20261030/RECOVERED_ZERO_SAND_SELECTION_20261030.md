# H-Earth Gen3000 — exact recovered census and zero-sand selection

**2026-10-30 CDT · source/evidence only · no Work-credit GPU/census rerun**  
**Controlling original operation:** `H_EARTH_ACTIVE_MATERIAL_EVALUATOR_20261030_001`, canonical admission Gen3000, #6911 comment [6527846342](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6527846342).  
**Frozen candidate product:** `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626` (no product mutation).  
**Branch predecessor:** `ca344fcea6e002ab242c384fcc6c137a033aeec3`; all writes must remain under `h-earth-3d/evidence/active-material-evaluator-20261030/**`.  
**Before this recovery:** completed rank1 sand explanation in [issue comment 6529898980](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6529898980): original top transition was underwater shoreline, not an authorized inland fix.

## Recovery from exhausted Work session

The owner uploaded video `30308.mp4` of the preceding Workroom losing usage. It showed that Work had found the original approximately 63 MB `classification.intermediates.npz` and verified seven array hashes before the account became unable to continue. The original Workroom had already created an artifact in the user's persistent ChatGPT Library at:

`/H-Earth/H-Earth-Gen3000-recovered-census.zip` (Library file ID `file_000000006bf481f6b7ad52cb3bc05d3d`).

Recovered, materialized and independently reverified the actual Library ZIP:
- ZIP bytes: **9,156,772**; SHA256 `8b00fb2feada749635148d18ee47dac92a7df13f30e1fd5abe29968e5fa3ad5b`; ZIP CRC PASS; five entries.
- Original uncompressed `classification.intermediates.npz`: **65,742,562** bytes, SHA256 `1b992493a7f2de7d511d171baf7a2d5d000d39743a1e68df21f22b56059545a0`.
- `classification.json` SHA256 `fbea66904b490c2852e8b99cfd5e5a32af9e102c4cc9ef5466cdfa96ef30db8b`.
- `classification-review.json` SHA256 `e0e2fa5bc9b342b6de394f6db5314b16e76da49a71c39301a8066b59fc112bea`.
- All **seven NumPy array SHA256 hashes** independently MATCH original `classification.json` and independent `classification-review.json`. No recomputation or substitute source.
- The original top-20 *all-sand* ranking, including exact index pairs and order, was reproduced by a separate vectorized right/down edge ranker before applying the zero-sand filter.

Source reference hash list from preserved reports:
`coefficients=261889b042500c6d92ba25e7653cdf9d6cca465757b374453b9f8a8897f350cb`;
`contributions=6cbfccebce15cf123d14692abc9d1841d6a36fbc435c8fc6ce2f61a7e06ef285`;
`operands=9bb11062cb1f2c62299740468d06460e643d25e783b4af15d031929d2ca799b2`;
`eligible=1d37f28b96fd024d6c9691da1a2ffc7bc5b0d6683e4d0d3093408e8cf1e76bdd`;
`world=9d4ff632107fb865bc0a7cd40200a391b1df5c1b8a5fc3bee2074aaad73202d0`;
`coords=471834a62bc6fb9a9f3962b6af7650b17ec6c930e904cd30901dc6089b7526ea`;
`owners=499a2609e6cfcf716b50ed0e65d5611af1b6cec01ae1ee264f210bc4728ec1df`.

## Reranking completed without a new census

Filter exactly on both endpoints: original eligibility, same source owner, native sand-stage gain `[1,1,1]`, native sand-stage bias `[0,0,0]`. **No epsilon/tolerance relaxation.** Then compute original coefficient score `max(abs(deltaB),abs(deltaA+deltaB))/worldDistance`, sorting descending by score and ascending by source indices.

| Result | Count |
|---|---:|
| Original eligible same-owner edges | 77,644 |
| Strict zero-sand eligible edges | **63,707** |
| Excluded from zero-sand set | 13,937 |
| Zero-sand grid endpoints (including ineligible endpoints) | 34,105 |

The exact first ten zero-sand pairs from the hash-verified original dataset:
1. `(95,-113)→(95,-111)` score **0.30753047598266176**, stage **steep-bank**.
2. `(111,-121)→(111,-119)` score **0.30453854115829265**, stage **steep-bank**.
3. `(97,-113)→(97,-111)` score **0.2531710637038406**, stage **steep-bank**.
4. `(77,-209)→(77,-207)` score **0.16947999870305386**, stage **habitat**.
5. `(19,-147)→(21,-147)` score **0.14778073081250673**, stage **steep-bank / shoreline-root-soil**.
6. `(75,-209)→(75,-207)` score **0.1435877316231655**, stage **habitat**.
7. `(-1,-195)→(-1,-193)` score **0.1381021978779088**, stage **steep-bank**.
8. `(-11,-183)→(-9,-183)` score **0.13667787436573284**, stage **steep-bank / shoreline-root-soil**.
9. `(21,-155)→(23,-155)` score **0.13537321945073633**, stage **steep-bank / shoreline-root-soil**.
10. `(-9,-187)→(-7,-187)` score **0.13350678996509108**, stage **steep-bank / shoreline-root-soil**.

**Do not blindly repair the highest dry pair**: source-world geometry and native protection must be checked. For physical context, downloaded only the ORIGINAL already qualified Gen2969 artifact #12913811096 (ZIP SHA256 `e1eb8a2fdbaacce663783440e2189b17e487eacb6c13fd50907d07cdb640bc4a`) and read exact original uploaded Float32 positions, indices and coast-distance samples.

- Ranks **1–3**: exact NEAR terrain intersects/descends **below authored FAR_OCEAN** along the segment; e.g. rank1 endpoint terrain minus ocean ranges from +0.2749 m to **−0.7130 m**. Strong steep-bank coefficient transition is a water/shoreline candidate, not proven visible inland.
- Rank **4** (77,-209)→(77,-207) and nearby rank6/14: source ocean is below land, but x/z are **inside the native protected estate rectangle** x18..132,z−210..−125, where native protection factor is zero. Do not select as a repair target.
- Independently screened all 63,707 zero-sand edges for **both** endpoint terrain presentation height above +1 m and **native material protection factor >0.999** at both endpoints. **52,439** survived this *preliminary* source-only exclusion. The strongest is `(-113,-307)→(-113,-305)`, coefficient score **0.0855876** (see reproduced ranking for exact value), dominant stage **woodland-litter**; subordinate environmental-identity and groundcover contributions.
- Exact original indexed NEAR terrain gives one triangle covering the complete two-metre candidate `(-113,-307)→(-113,-305)`; exact original FAR_OCEAN gives one triangle covering the same whole segment. Source-affine heights make terrain **5.56633–5.60280 m above** original ocean across the segment. Native coast-distance is **198.060→196.138 m**; no separate shallow-water mesh was found at the nine sampled points. Both endpoints have original zero-sand operands; continuous no-sand, other active generated source layers, raster owner/visibility and final RGB **remain to be independently checked**.
- Source-algebra attribution for that tentative pair: **woodland-litter 0.08519584** conditional bound/m; **environmental-identity 0.00246325**; **groundcover 0.00130976**. Its woodland-litter gain changes from approximately **0.93117→0.52096** over 2m, meaning a strong localized source-material transition. This could be an *intended woodland ecotone*, not necessarily the owner's reported inland band. Do not change it absent defect-camera correspondence.

The earlier frozen 48m margin candidate near z−728 and 15 saved Gen2998 crossings are OUTSIDE the Gen3000 local census z−400..−80. Nothing here supersedes previous accepted local improvement or constitutes map-wide repair.

## Verifier and limits

The independent local rerank uses the recovered original seven SHA-qualified NumPy arrays, reproduces the published top20 before strict sand filtering, and rejects nonfinite coefficients. This is **local source evidence**, not a hosted GitHub Actions regression receipt. Original authored `select_zero_sand.py` at the predecessor branch has its own fail-closed hash guards; do not equate this handoff with a newly hosted validation of that script.

The first mathematically ranked zero-sand segment was **source-rejected for underwater/shoreline context**. The highest strongly dry and unprotected *preliminary* candidate is woodland-driven and has not been tied to a frozen defect image or independently checked for all active generated geometry and native procedural operands. Product/GPU, renderer, terrain, original source identities, protected cores, dark/light interiors, recovery ZIP and all tests remain untouched.

**Exactly one next action:** correlate `(-113,-307)→(-113,-305)` with the actual frozen owner-reported defect poses and verify complete active native woodland-litter coverage, same-source support, protected coast/habitat context and actual raster depth ownership. If it is an intended natural woodland boundary or off-camera, reject it and continue to the next hash-ranked zero-sand unprotected edge from the original recovered array—**without a new census/GPU**. A new material implementation or GPU comparison needs a separately admitted, exact-head operation and the owner's visual acceptance.

**Disposition:** ORIGINAL_CENSUS_RECOVERED_AND_SEVEN_HASHES_PASS; DRY_EDGE_RERANK_EXECUTED; STRONGEST_RAW_EDGE_UNDERWATER; STRONGEST_ABOVE_WATER_EDGE_PROTECTED; PRELIMINARY_UNPROTECTED_WOODLAND_EDGE_SELECTED_FOR_SOURCE_CONTEXT; NO_PRODUCT_REPAIR_OR_RELEASE.
