# H-Earth Gen2928 — source-bound material factor survey and reversible candidate

Operation: `H_EARTH_GROUNDCOVER_BAND_CONTINUITY_REPAIR_20261026_001`. Authentic Gen2928 admission: https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6433107959

## Baseline evidence (not a candidate acceptance)

Actual completed GPU capture: https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40514307979 ; artifact ID `12739776958`. Original product head `60b3c07f0216645119a1b92b16dac82cae739145`; shader SHA-256 `7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2`. `MAPWIDE_SCOUT_V1` generated 4 frozen diagnostic poses × 5 modes = 20 PNGs at 529×980, with matching camera/asset/source receipts. All 20 captured PNG SHA-256 identities independently checked against `receipt.json`. `result=DIAGNOSTIC_CAPTURE_COMPLETE_FACTOR_REVIEW_PENDING`, no owner visual acceptance, product mutation or publication.

Raster methodology: classify terrain only where the `groundcover-weight-raw` factor GPU image returns a neutral grayscale scalar. On those pixels compare `before-groundcover-unlit` and `after-groundcover-unlit` RGB; use `patch-weight-raw` and `groundcover-weight-raw` scalar channels / 255. Sky and water are excluded by the land/grayscale filter; each view is a fixed diagnostic observer, not an owner-confirmed screenshot camera.

| Pose | Terrain pixels | Mean patch | Mean actual blend | Changed terrain pixels | Mean absolute RGB change per channel |
| --- | ---: | ---: | ---: | ---: | ---: |
| inland-seam-near | 392,605 | 0.217 | 0.191 | 99.27% | 4.93 |
| inland-seam-far | 286,419 | 0.743 | 0.653 | 99.63% | 17.44 |
| coastal-seam-east | 368,439 | 0.992 | 0.003 | 1.33% | 0.08 |
| coast-oblique | 190,448 | 0.972 | 0.000 | 0.00% | 0.00 |

**Supported at sampled views:** organic patch amplitude is the principal difference between these two inland shader-weight fields; coastal masks suppress even strong patch scores at the protected coast. Both inland views already contain brown earth before groundcover. The relative heavy darkening of the far field is attributable to the actual groundcover mix at these camera views. **Not supported globally:** one mechanism for every user-reported straight/polygonal/curved material transition, exact owner screenshots, owner satisfaction, preservation across the entire map, or physical Android proof. Issue #6911's map-wide scope remains open.

## One reversible provisional product experiment

Change only the existing groundcover mixing formula inside the original Run8E fragment shader, leaving its noise/patch construction, soil family, moisture/dry tone, slope/rock/coast masks, protected oasis/estate/route/grove and all physical vegetation untouched:

- Before: `groundcoverWeight = 0.88 * patch * suitability * protection`.
- Draft: `groundcoverWeight = 0.88 * patch * (1 - 0.25*smoothstep(0.30,0.85,patch)) * suitability * protection`.

The attenuation is smooth, bounded, monotonic in patch amplitude, and zero at patch=0. At patch=1, maximum permitted blend decreases from 0.88 to 0.66. This does **not** flatten or globally overwrite soil color, remove actual vegetation, or add GPU draw calls. Applying this analytical response to the source-bound factor rasters predicts mean blend weight reductions (before → provisional): inland-near 0.1908 → 0.1820, inland-far 0.6534 → 0.5107, coastal edge 0.0028 → 0.0023, protected coast 0 → 0. These are **formula predictions**, not yet measured candidate GPU pixels or visual improvements.

The comparator reconstructs the exact published renderer by reversing this one expression and requiring its original frozen SHA-256; any other shader change fails closed. Candidate capture must checkout the exact PR head from the immutable event and capture at the same cameras/modes/viewport, then compare actual GPU PNGs to artifact #12739776958. The existing Gen2925 profile remains unchanged.

## Current gate / stop

Candidate is DRAFT_ONLY, never published or owner-approved. Require selected Node test suite, actual candidate 20-frame GPU artifacts, matched source/camera/asset comparison, coastal/sand/vegetation/terrain and experience-anchor preservation, independent West review, and the applicable physical preview and owner `KEEP | ONE_REPAIR | REJECT` disposition before considering separate merge and release authorization. The map-wide material discontinuity claim stays open for other boundary classes even if this known inland band improves.
