# Gen3000 — original mountain diagonal: world-depth and material-stage adjudication (2026-10-30)

**Status:** HISTORICAL_RAY_SURFACE_REGISTRATION_AND_STAGE_TRIAGE_PASS; CURRENT_OWNER_PHOTO_MATCH_AND_CURRENT_CANDIDATE_RENDER_HELD.

This is **source-only evidence** under existing admitted Gen3000 evidence scope; **not** a new product candidate, geometry edit, GPU run, merge, release or owner acceptance. It extends camera applicability commit `abb10c49c2d42518654983263265e1fae8badbf3` and GitHub Issue #6911 comments #6532550860 and #6532592599. Do not reopen the already closed inland-far material witness.

## Original byte custody
- Original frozen product: `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`, actual original renderer SHA256 `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`.
- Historical same-source mountain ridge GPU run [40613605067](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40613605067), artifact 12783843240; ZIP SHA256 `08783a00f26d39a8145c58f5a7b8e35d4967c3f0bdb513e2b4da976436332d38`; original lit image SHA256 `d1ce1ce1f23a20e8ae58a428ee24d9a5b52d2b01f7accad148616f9f6ad2ae17`; ridge mask SHA256 `e3af8ba43a42e24dd18b062e13dcd7407bf02a2a9792771207887ceaa2fd32eb`.
- Historical same-source eight-stage GPU run [40609718590](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40609718590), artifact 12782906740; verified ZIP SHA256 `df23ee1d2b697ba09c3e805b42d790708900c04dd80d3b153953589bf4eda539`. Includes pre-worldsoil, post-worldsoil, post-identity, reference-lit, worldsoil-weight, identity-weight, and primitive-role source-interception images. Both branches in receipt point to original cb57; NOT a current candidate A/B.
- Archived native mesh/source pack `/H-Earth/H-Earth-paired-material-executed-20261029.zip`, SHA256 `08b0c3ae8e1cc3c318b7fa1ada6d01e75370f5423745f2250db6354805b3fdef`. Authenticated native package/spans `/H-Earth/H-Earth-corrected-material-application-20261029.zip`, SHA256 `5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c`. CPU ray analysis used the exact uploaded 141373 vertex `upload-positions.bin`, 366666-index `upload-indices.bin`, original normals, and package primitive indexStart/indexCount spans. Native source positions/index SHA256 `342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83` / `483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c`.

## Exact ray method (top-left PNG pixel indexing)
Original run receipt: camera XYZ `(88.00614407254056,29.26418157783337,-260.0181529415971)`, yaw 118°, pitch -13°, FOV 56° vertical, backing 529×980. Use original frozen `showroom/globe/h-earth/functional-landscape/navigation.js` to form camera forward `(sin(yaw)*cos(pitch),sin(pitch),-cos(yaw)*cos(pitch))`; right `normalize(cross(forward,worldUp))`; up `cross(right,forward)`. For pixel (x,y), ray direction is normalize of forward plus `((2*(x+.5)/529-1)*529/980*tan(28°))*right` plus `((1-2*(y+.5)/980)*tan(28°))*up`. Intersect against every uploaded triangle using double-sided Möller–Trumbore, retain positive-near candidates and nearest projected terrain hit; barycentrically interpolate the original three uploaded normals. Map triangle index to source primitive via authenticated spans, independent of renderer symbol guesses. This is a CPU geometric reconstruction, not GPU raster/depth readback.

## New measured result
The conspicuous red-to-green ridge transition occurs at a **foreground/background occlusion edge**. At four adjacent-pixel samples the nearest intersection jumps to a wholly different world point:
| Source PNG pixels (left/right) | Left world XYZ | Right world XYZ | Camera distance m (left/right) | Normal angle | Original reference-lit RGB difference (right minus left) |
| --- | --- | --- | --- | ---: | --- |
| (33,400)/(34,400) | (133.50,23.32,-248.78) | (103.11,27.29,-256.27) | 47.24 / 15.69 | 24.29° | (+23,+13,+11) |
| (260,140)/(261,140) | (134.37,36.41,-235.61) | (100.55,31.20,-253.40) | 52.89 / 14.31 | 52.65° | (-6,-5,-8) |
| (356,30)/(357,30) | (136.00,42.99,-228.55) | (99.49,32.55,-252.48) | 59.01 / 14.12 | 63.65° | (+12,+10,+6) |
| (190,220)/(191,220) | (133.33,32.11,-240.23) | (101.56,30.11,-254.09) | 49.54 / 14.82 | 45.94° | (-7,-5,-8) |

Every listed hit belongs to the *same source primitive* `H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001`, ordinary terrain role 1, and is a positive-distance, positive-front-facing source triangle. Source ridge-East versus ridge-Central Gaussian value predictions agree with the archived red/green dominant-ridge PNG for **36/36** independently sampled pixels; this supports optical/source registration, not complete GPU ownership proof.

At (33,400)→(34,400): saved eight-stage display-byte RGB deltas are **pre-worldsoil (-1,-1,-1)**, **post-worldsoil (+7,+8,+7)**, **post-identity (+6,+5,+5)**, and **reference-lit (+23,+13,+11)**; worldsoil weight changes 209→192 (8-bit source visualization), identity weight 125→129. At (260,140)→(261,140): pre-worldsoil (-1,-1,-3), post-worldsoil (-9,-13,-15), post-identity (-9,-10,-12), reference-lit (-6,-5,-8); worldsoil weight 140→188, identity weight 154→128. The visual contrast amplification is not uniform. Comparing display-code differences does not prove a direct additive material or lighting contribution; these are ordered source-intercept stage outputs from the **original** renderer.

## Decision and remaining repair target
- **Exclude** this archived foreground-occluding silhouette from the class of continuous single-surface tan/olive albedo seams. Do not widen the old inland material margin or recolor by ridge winner or smooth terrain to hide this projected crease.
- Original source material does have different ground-soil weight across the two *nonadjacent world locations*; sunlight and normals further vary. This cannot be promoted to a current present-day owner photo diagnosis or a single repair mechanism.
- Source-prioritize a true **same visible surface / same depth-owner** hard material boundary on the current steep-foothill side; get side-by-side world XYZ, primitive/role, contact/coast, geometric normal, pre- and post-material colors and protected meadow/coast controls. Compare on comparable continuous surface coordinates before any proposed product change.
- Current candidate `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626` remains geographically inapplicable at this mountain area (margin only X[-213,-165], Z[-759,-711]). No new GPU, no product edit, no merge or publication. A future qualified candidate requires separate canonical mutation admission and protected controls.

**Acceptance:** A historical archived diagonal has a source-supported depth/occlusion explanation. Owner's map-wide hard single-surface boundaries are **NOT fixed or closed**.
