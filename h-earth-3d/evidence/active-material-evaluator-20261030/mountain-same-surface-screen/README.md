# Gen3000 — historical mountain same-surface source screen (2026-10-30)

**Disposition:** HISTORICAL_MOUNTAIN_SCREEN_NEGATIVE; OWNER_HIGH_FOOTHILL_MATERIAL_DEFECT_REMAINS_OPEN.

The earlier Gen2942 historical mountain camera (x88,z-260,yaw118,pitch-13; source cb57c275, 529x980) captures a large ridgeEast / ridgeCentral diagonal. Its nearest native surface ray depth jumps at that boundary, so it is an occluding terrain silhouette, not a directly adjacent single-surface material seam. This second scan therefore sought different same-surface high-contrast edges in the historical frame without rerunning GPU or editing product.

## Data and bounded method

Exact byte-hashed original native mesh from `H-Earth-corrected-material-application-20261029.zip`, original eight-stage GPU images from run [40609718590](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40609718590), and ridge-color/source camera receipt from run [40613605067](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40613605067). Corrected original mesh ZIP SHA256 `5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c`. Eight-stage ZIP SHA256 `df23ee1d2b697ba09c3e805b42d790708900c04dd80d3b153953589bf4eda539`. Ridge ZIP SHA256 `08783a00f26d39a8145c58f5a7b8e35d4967c3f0bdb513e2b4da976436332d38`.

Preselector: reference-lit, post-worldsoil-unlit and post-identity-unlit; ordinary-terrain role mask; Gaussian sigma1 smoothing; horizontal and vertical +/-3 pixel pairs; up to 80 21-pixel-local maximum gradient peaks per stage and orientation; omit image border and pairs with scalar RGB contrast <=5. Deduplicate, source-ray each pair using exact uploaded 141373-vertex mesh and original normal interpolation, nearest positive hit, primitive span and stage-image values. Preliminary continuity requires same terrain role1 primitive, world separation <5m, depth difference <5m, and normal angle <35 degrees. Additional exploratory material-target screen requires world separation >=0.1m and post-worldsoil-unlit 8-bit RGB Euclidean contrast >=20. These are **heuristics**, not proof that all unexamined pixels or different world locations are sound.

## Executed result

354 unique 6px source pairs, all recovered with ordinary terrain role1. 305 pass preliminary geometry continuity and 49 fail. Among the 305, 273 span <0.1m world distance (near camera texture detail), **zero** span 0.1 to 1m, and 32 span 1 to 5m. None of the 32 reaches the >=20 post-worldsoil RGB contrast screening threshold. No valid same-surface high-foothill repair edge was established from this image.

Counterexamples: (344,968)->(350,968) is only 0.01721m on near ground despite post-worldsoil contrast 39.09; (259,144)->(265,144) spans ~3.13158m on a smoothly varying source triangle, with 12.806 post-worldsoil contrast; (33,400)->(34,400) is the known distant/foreground occlusion (~31.54m depth jump) and excluded by the new screen. Do not equate high-frequency surface texture, grazing-angle gradual variation and occluding silhouettes with a full-width tan/olive material cutoff.

## Present-day applicability and next boundary

Current candidate 3ea149e5's only new material margin supports X[-213,-165], Z[-759,-711], not the x88,-260 mountain reference. Gen2998 current-baseline/candidate archive run 41083373434 (ZIP SHA256 `c1ae9fd42efba75bcda13c49caac13539bbb3aed41f812e05a0d6f59f3eb1756`) has three camera origins at (-189,-724): not mountain coverage. Owner Android images `30106.jpg` and `30108.jpg`, reported in issue #6911 comment #6470960274, represent straight and curved material divisions but have **no proven camera telemetry** and cannot be equated with old Gen2942 view. Original source evidence is not current-world acceptance.

**Next lawful action:** Obtain source-registered current-head mountain camera/depth/material-stage evidence for the owner-priority straight 180-degree and curved/wedge bare-soil cuts, plus meadow and coast controls; screen genuine same-visible-surface adjacent world points. Only then propose a geographically supported bounded material correction through separate canonical mutation admission. Reuse the registered exact-head runner only with such an admission and return the genuine monitoring URL immediately after dispatch. No blind broad tint, geometry smoothing, GPU rerun on the old ridge, merge or publication.

## Reproduce offline

With Python 3 plus NumPy, SciPy and Pillow, and all three pinned archives:

```sh
python source_registered_screen.py --mesh-zip H-Earth-corrected-material-application-20261029.zip --stage-zip h-earth-gen2942-mountain-stage-archive.zip --ridge-zip github-actions-artifact-12783843240.zip --output portable_report.json
python -m unittest -v test_screen.py
```

`source_registered_screen.py` fails closed on exact ZIP SHA256, original mesh identities and original source renderer identity. `portable_report.json` preserves the 354 original-source ray hits and seven source-stage comparisons. The portable evidence ZIP contains script, result and unit tests; it does not redistribute original renderer asset bytes.