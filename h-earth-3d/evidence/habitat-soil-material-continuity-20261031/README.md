# H-Earth Gen3030 — habitat soil material continuity candidate

Status: SOURCE_CANDIDATE_ONLY / NO_GPU_A_B / NO_VISUAL_KEEP / NOT_PUBLISHED

## Authority and preserved source

- Operation: `H_EARTH_HABITAT_SOIL_SOURCE_CONTINUITY_REPAIR_20261031_001`, authentic canonical admission Gen3030, issue #6911 receipt [6549292630](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6549292630).
- Exact governing main: `c3a60da70487bfb2e0c8be66eba2c0a06888e40f`.
- Original production shader Git blob: `85ee835060d5106a670077a5f4352b7ad202b49b`; candidate shader blob after one source patch: `dbd1bc8e9a011a2e8ffb73ccb26a96a28ea2b12a`.
- Native habitat-material presentation remains unchanged at Git blob `3fc89b5fa6b41455445efc5c3a08346508f119aa`; Gaussian sigma 2m / support 6m, panel-local no leakage, original installed root atlas unchanged.
- Diagnostic predecessor Gen3029 closed and released its lock at commit `4ef69e0f648ac8343fde0505e16048b7c7c43c14`; its temporary tooling PR #7068 remains unmerged.
- Direct source-positive: Gen3029 [evidence receipt](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/7068#issuecomment-6549173566); 20 images verified; original central RGB separation before habitat 4.2 and after habitat 32.1; west 3.3 to 14.7. Grass was hidden in these images. The healthy coast control was pixel-identical.

## Bounded candidate

Only one fragment shader block inside `if(worldSoilTerrain&&uWoodlandHabitatEnabled==1)` changes. The original root/roughness `habitatCoverage` and the separately filtered `habitatMaterialCoverage` path are preserved. The shader no longer paints `landscapeCoverPalette(...) * .72` directly onto the soil when habitat occupancy changes.

The candidate uses the original world-position soil palette as a chromatic pigment and scales it to the luminance of the preceding native soil albedo. This retains local terrain/soil detail and prevents an externally imposed dark-luminance jump. The occupancy weight is transformed by cubic Hermite `t*t*(3-2*t)`, with zero derivative at both material support endpoints, before its existing 0.68 blend budget. The same world-space protection and material-presentation masks remain. No screen-space blur, global tint, new asset, root mutation, geometry mutation, water edit, or navigation change.

This is a source-based C1 support-endpoint construction, not a proof that every texture sampling cell has a globally C1 derivative or that every visible diagonal is corrected.

## Source-only checks / explicit limitations

The new dedicated test covers exact insertion/boundary identity, mask/roughness custody, zero slopes at support endpoints, positive habitat hue response, zero-coverage healthy controls, native habitat presentation unchanged, and protected geological/grass/water markers. The pre-existing environmental identity test remains selected.

A numerical **illustration** using the frozen central sampled before/after upper/lower values and a pigment reconstructed from the original absolute .72 shader blend gives an old RGB separation 32.139 and hypothetical source-model separation 18.687. This is not a GPU capture, not a measured result of the candidate, and not sufficient for KEEP.

## First remaining executable gate

1. Run the exact selected Node tests and independently inspect the final source path diff.
2. Verify the same-camera same-geometry baseline versus exact candidate through the **existing** registered fixed neutral H-Earth GPU route, with hillside west/central positives and coast, foothill, meadow/grove controls. Do not re-run Gen3029's already-consumed stage diagnostic or create a new workflow.
3. Require direct image evidence that the target hard edge materially improves, and preserve nearby healthy palettes, coast, grove, root identities, draw budget and terrain. If pixel evidence is unavailable or negative, STOP / ONE_REPAIR instead of declaring a fix.
4. Geographic map-wide strata and physical Android owner `KEEP | ONE_REPAIR | REJECT` are separate required gates. No merge, deployment or publication under this candidate.

The production site and separate Gen3010 grass candidate remain unchanged.
