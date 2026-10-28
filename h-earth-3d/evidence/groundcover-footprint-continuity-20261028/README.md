# Groundcover footprint continuity candidate

Status: candidate under qualification; no visual repair, owner acceptance, merge or publication claimed.

## Custody

- Governing source: `873eeb5f1ff66f477d40968ccc96ac14e40c41ce`.
- Approved comparison scene: Gen2928 `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`.
- Approved renderer SHA-256: `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`; current main has the same renderer bytes.
- [Owner source-first, repository-durable directive](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6472173332).
- [Predecessor closure](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6472749418): Gen2944 superseded; historical evidence preserved.
- [Authentic admission](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6472782590): operation `H_EARTH_GROUNDCOVER_FOOTPRINT_CONTINUITY_20261028_001`, generation2953, run40713550505. Compiler inputs, exact generated envelope/comment and packet receipt are beside this record. Packet readiness alone is not admission.
- Parent coordinates North; native East source inventory, South builder and independent West reviewer are separate agents. Their execution is not repository authority.

## Source inventory and treatment

All locations below refer to `showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js` unless stated otherwise. This inventory covers the active consumers of the identified groundcover stage; it is not a claim that all owner-observed boundary classes have been solved.

| Mechanism / active consumer | Evidence and treatment |
| --- | --- |
| Ordinary near terrain | Main fragment shader, `worldSoilTerrain`, then `!geologicalEarthRock`; receives shared patch-factor filtering. |
| Exact FAR continuation | Same fragment shader and groundcover calculation; receives same repair, no separate tint. |
| ERODED_TERRAIN / MOUNTAIN_OVERBURDEN | Uploads primitive62000 / role1; ordinary groundcover path. |
| NATURAL_CLIFF_FACE / CAVERN_PHYSICAL_SHELL | Uploads primitive62001; geological rock predicate excludes groundcover. Preserve real rock and cavity behavior. |
| Woodland / global-cover / preview grass | Derive shader text from common FS, but vertices set primitive65535 / role3; bypass terrain groundcover. No grass asset or root changes. |
| Water | Role4, excluded. No water or shoreline change. |
| Near/far normals and T-junctions | Previously corrected; preserve qualified geometry. Raw base-color mismatch is not final-pixel proof because shared palette overwrites it. |
| Geological terrain rim | Existing `reconcileGeologicalTerrainRim` already blends normals, RGBA, material, coast and contact across the full perimeter (368vertices / 5520samples). Preserve. Earlier categorical-rock override hypothesis was withdrawn after executing actual upload expressions. |
| Identity / soil / habitat / shoreline / optional refinement | Audited alternatives retained as exclusions below. No indiscriminate smoothing or palette flattening. |

## Accepted evidence and unsuccessful attempts

1. [Gen2917 run40411050366](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40411050366): staged GPU output first introduces the inland olive band at `palette=mix(palette,groundcoverTone,groundcoverWeight)`. Later unlit output is identical. Archived ray trace crosses one FAR triangle24914, low nearly constant slope, coast about620m; this example is not a triangle or coast-threshold boundary.
2. [Gen2925 run40442633983](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40442633983): removing groundcover restores the pre-groundcover image. This establishes the stage for one class, not every owner photograph.
3. [Gen2928 PR6920](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/6920): attenuated high patch weight; reduced intensity while retaining contours. This is the approved comparison baseline.
4. [Gen2940 PR6931](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/6931): widened smoothstep thresholds, 40 verified images; insufficient visible improvement. Do not repeat another scalar/threshold adjustment as new causal evidence.
5. [Gen2944 image review](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6471844284): broad mountain soil darkening did not remove the conspicuous division; healthy selected controls unchanged does not make it successful. Do not promote that tint.
6. [Corrected geological interpretation and preserved exclusions](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6472271066): terrain-rim surfaces do not use primitive62001. Preserve shoreline perimeter-zero, ravine occlusion, inactive refinement, small contact counterfactual and prior habitat/identity investigations. The approximately34m world-position jump at a diagnostic mountain diagonal does not prove the owner's material cutoffs are silhouettes.

## Declared delta and falsifiable hypothesis

The existing procedural patch is point-sampled even when one pixel covers multiple field cells. The candidate averages the **nonlinear patch-factor contribution**, using four Gauss points spanning the world-space pixel derivatives. It does not average patch before nonlinear attenuation, alter material tones, widen the original patch thresholds, or change center suitability/protection. Derivatives are evaluated before divergent fragment branches. Below activation onset the original calculation is retained exactly; zero protection remains zero.

Activation is `smoothstep(.25,.75,max(length(dx*.082),length(dy*.082)))`. These are candidate constants, not an established diagnosis. Four taps are an approximation and may fail under extreme minification. This experiment tests undersampling; prior stage attribution does not prove that hypothesis.

Three explicitly marked additive source blocks reconstruct the approved baseline byte-for-byte when removed. The comparator rejects any unrelated source delta. Historical comparator profiles remain unchanged; the new `GROUNDCOVER_FOOTPRINT_V1` explicitly pins the approved Gen2928 baseline instead of silently reusing the older pre-Gen2928 default.

## Qualification and rejection rules

- Run `node --test tools/h-earth-ground-material-comparison.v1.test.mjs tools/h-earth-groundcover-factor-overlay.test.mjs`.
- Existing neutral exact-head workflow runs the new profile only for this exact candidate branch, checking out immutable PR head and immutable baseline.
- Reuse archived inland near/far views plus exact archived Gen2944 protected-meadow and protected-coast controls. Capture both labels with final lit vegetation-visible, groundcover albedo and raw filter-activation modes. Preserve asset and actual projected camera identity, renderer hashes, frame sequence, image hashes and full receipts.
- Raw activation readback at archived inland scan rows260–300 must show that the filter actually operates at the defect. If inactive, this experiment does not test the target and must not be called a correction.
- Inspect actual before/after pixels. Reject if the conspicuous band persists, if broad palette shifts replace edge removal, or healthy controls regress. A technical pass does not satisfy visual acceptance.
- Compare quadrature with a dense reference integral, exact close-view behavior, finite bounded factors and zero protection. Record software GPU finish timings separately from CPU submission time. Neither proves Android performance.
- Preserve all geometry, precomputed world, grass/tree assets, roots, water, navigation, acoustic/narrative identities and the experience anchor video SHA-256 `7757fb4fe731456b3058ec595369133f5c2136c99b282eb6b4df108600bca573`.
- A successful inland-band result is still partial until the other owner-observed straight/curved classes are source-resolved and reviewed. No map-wide repair claim from one view. No merge/deploy from green CI.

OW01 mapping: D01/D02 and S01/S06 (continuity and comparative qualification); preserve D03/D04 causal subtropical expression and all other geographic/narrative/acoustic truths. No global morphology or accessibility change.

## First GPU execution and bounded correction

Run40716213632 (candidate42071d278563f15052958bab1da367a6cf1fc329) captured all twelve baseline frames with no baseline browser errors, then candidate compilation failed because `patch` is reserved in GLSL. The helper identifier is corrected to `patchCoverage`. Genuine local Mesa/EGL GLES compilation accepts the corrected extracted helper and rejects the original reserved identifier; this is not a full-runtime link result. The corrected Node suites pass34/34.

The twelve successful baseline PNGs, pinned manifest and compressed unmodified partial-run receipt are preserved in `baseline-run40716213632/`. Subsequent capture inherits those exact bytes after verifying every hash and scene parity. Candidate images remain pending. Baseline activation is nonzero at the known inland scan row260 but zero at tested rows270–300: the filter does not operate over much of the foreground taper. This is evidence against treating footprint filtering as a complete solution even if it improves horizon chatter.

Independent reinspection of original Gen2925 factor images distinguishes thin horizon stripes from the broad high-weight lobe around rows250–280. Suitability and protection are uniformly1 across rows250–310. Removing only horizon chatter is not a successful repair of that broad band.
