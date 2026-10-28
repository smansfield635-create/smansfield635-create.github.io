# Groundcover attribution from archived captures — 2026-10-28

The next investigation is complete without another GPU capture. On the approved baseline, changing groundcover weight is a quantitatively dominant contributor at localized broad boundaries. This does not establish a sole cause for all bands or prove a repair.

## Evidence reconciliation

- Baseline: `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`, renderer SHA256 `fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec`.
- Existing contribution run [40739898768](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40739898768), artifact 12839995220, ZIP SHA256 `6c3ffd91d89e8309e5f486844804935834753670162f68bdd860d7014a4d3a74`.
- That run uses rejected resident-field source `1e39f93a07eb2cc5156483b899094937ba2149db`, renderer SHA256 `b4bda2b8953b5bcc3cd65e101a447a878c2d033ec683af53a93ff211c13cdf70`.
- Relative to baseline, its renderer changes only the groundcover organic/patch field. Incoming P and target T calculations are unchanged; resident weight and final image are NOT baseline evidence.
- Both full-frame archived incoming images exactly equal the approved identity-result images: zero differing RGBA pixels.
- Source/pose/camera/asset checks and independently reconstructed target-color intervals support reusing T. All 2,484 selected target pixels agree with the reconstruction; independent review records the details.
- The newer candidate `57c18e56` widens fertility endpoints. These results describe the approved baseline, not an invented direct measurement of that candidate.

## Method and results

For each sampled pixel, invert Q=(1-W)P+WT using the independently available P and T and the baseline final Q. Bound each RGB channel with the existing +/-1 output-code convention, evaluate ratio extrema, intersect the three channel intervals with 0<=W<=0.88, and reject an empty intersection. These are inferred weights, not captured baseline weights.

Then evaluate the exact finite-difference identity:

`deltaQ=(1-meanW)*deltaP + meanW*deltaT + deltaW*(meanT-meanP)`.

Use near rows260..300, far470..520, columns132/264/396 +/-4, lags1 and16. All450 overlapping comparisons are retained in groundcover-attribution.json. No sampled color is clipped; every sampled pixel admits a shared RGB-consistent weight interval. Final Q was used to infer W, so this is NOT an independent final-image reconstruction test.

| View | Column | Broad pairs where weight lower bound exceeds incoming + target upper bounds |
|---|---:|---:|
| Near |132|3/25|
| Near |264|2/25|
| Near |396|10/25|
| Far |132|11/35|
| Far |264|17/35|
| Far |396|10/35|

Total:53/180 lag16 comparisons. No lag1 comparison clears this conservative dominance criterion. Overlapping comparisons are not independent observations, a prevalence estimate, or a perceptual metric.

At the previously identified far-center witness, columns260..268, rows481->497:

| Contribution | Conservative linear RGB L1 bounds |
|---|---:|
| Incoming soil |0.007512..0.039996|
| Target-color change |0..0.005651|
| Changing weight |0.069596..0.130928|

The weight lower bound exceeds the combined alternatives' upper bound by0.023948. Bounds are conditional on the stated quantization assumption, not measured GPU floating-point error.

## What this changes

The decisive branch is coverage-driven palette replacement at these witnesses. Changing target color is too small to explain them. A smooth weight still produces a strong boundary when multiplied by the large difference between groundcover target and incoming soil. The earlier resident-field diagnostic found this in a rejected experiment; this investigation establishes it on the approved baseline using reconciled evidence.

Do not repeat the failed residual-only repair: earlier captures showed upstream identity bands surviving it. Do not infer that changing the noise hash, broad noise frequency, distance fade or normal weighting will solve all observed transitions.

## Additional decisive exclusion: procedural patch change is required

The independent review reconstructed the resident patch from captured meso/detail factors and divided resident W by its patch amplitude to bound the shared suitability/protection mask M. This does not transplant resident W to baseline.

At all nine far-center pixels, baseline weight increase is at least0.257376..0.296735. If patch amplitude were constant, mask variation could produce at most0.028226..0.050262. Every pixel excludes that explanation by at least0.216498. Therefore changing procedural patch amplitude is required at this witness. Mask=1 is consistent, but exact mask constancy is not claimed.

Both independent scripts and numeric output are retained. Independent review reran the main attribution exactly and verified53/180 broad comparisons and0/270 adjacent comparisons.

Next prepare a source-bound repair design for the coupled patch-driven palette-replacement and upstream identity paths. It must explain how the ecological color and fine soil detail remain while the measured broad contrasts are removed. Test its predicted contributions offline against these frozen witnesses before any GPU dispatch. Avoid repeating already rejected isolated field substitution, residual removal or fertility widening. A new GPU comparison requires applicable successor scope/budget; the current one-run budget is consumed.

## Reproduction and custody

Extract the three hash-pinned archives into ledger-capture/, diagnostic/ and recovered/ beside groundcover-attribution.py, then run `python groundcover-attribution.py` (Python, NumPy, Pillow). The output includes all input image SHA256 values and all450 comparisons. Diagnostic archive is run40773251264/artifact12854046080; comparison archive is run40779962491/artifact12857186591. Existing comparison-recovery-review.json and spatial-web-audit.json retain their provenance.

No runtime source was edited, no new GPU run launched, and no merge/deployment or visual acceptance is claimed. Current candidate remains reviewer-recommended REJECT; formal owner disposition is not inferred. Public Chamber synchronization is unverified; this repository continuation is the current evidence record.
