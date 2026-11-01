# H-Earth Gen3037 — soil-relative groundcover pigment endpoint

## Scope and authority

Canonical operation `H_EARTH_GROUNDCOVER_SOIL_RELATIVE_ENDPOINT_REPAIR_20261031_001`, generation 3037 `ADMITTED_AND_LOCKED`, source issue #6911 comment #6552942407. Exact governing main `eb1987b6a44fd5d6b0ec4a37f23d744e1455d4ca`. The intervening main commit `4469c5c4680a487ee9e79ec522de86d52bedfed0` changed only Cloudflare analytics and reporting data, disjoint from this candidate. This is a separate single candidate from the existing Gen3030 habitat draft #7074; do not stack, merge, or publish the drafts as if mutually qualified.

## One code-level change

In the shared H-Earth renderer, replace the absolute olive RGB `groundcoverTone` (source stage `H_EARTH_BROAD_GROUNDCOVER_V1`) with `groundcoverTone = palette * groundcoverSoilTint` using bounded moisture/dry spectral tint factors. Preserve all existing groundcover weight and geographic protection formulas and keep original triplanar/grain, ecological soil families, physical grass, roots, coasts, geometry, navigation, shading, and separately applied habitat atlas. Exactly one source anchor is replaced; reverse byte identity must reconstruct baseline renderer Git blob `85ee835060d5106a670077a5f4352b7ad202b49b`.

## Cause and claim ceiling

Gen2917 (issue #6911 comment #6428986452) proves first onset of one conspicuous inland olive band at this exact stage using actual staged GPU images. Gen2925 (#6433023611) independently supports that attribution. The owner-observed straight/curved foreground Android defect classes may also contain habitat, geometry, local mask or other contributions. W1 original-mesh same triangle #12031 has source-modeled weight 0.397228→0.069890 across 2m. With identical *assumed* source soil across the two points, the proposed pigment reduces the W1 source-linear weight-only contrast 0.111980→0.009614 (about 91.4%); this is **not an actual sampled final GPU image**. A parallel ruler-straight estate-protection mask is left spatially unchanged, with its strong pigment endpoint replaced rather than blurred or geographically moved.

## Qualification requirements

The new Node regression test must check exact baseline reversal, preservation of all other renderer source bytes, bounded soil-relative spectral tint, identity at weight=0, W1 model contrast and no new texture/noise/geometry operations. Independently verify source/test changes and controls. Actual matched candidate GPU and owner Android visual acceptance are required before release, with healthy meadow/short-foothill, grove and coast, plus real foreground straight/curved target classes. **Do not publish or claim a map-wide repair from numeric/source test success.**

Current operational state: code candidate prepared on admitted non-main branch. This readme records intended gates, not completed GPU/Android review.
