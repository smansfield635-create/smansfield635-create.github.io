# Source-bound coastal margin comparison candidate

The renderer candidate now exists on this draft. No deployment or GPU/visual acceptance.

## What changed

The new material-margin-field.v1.js supplies a signed RG8 correction only inside world XZ bounds[144,-282,188,-250]. The renderer adds it to the coastal presentation coverage before the existing panel-edge, max-panel and protection composition. All preceding material/atlas stages remain inputs to the same final affine blend. Source native and baseline coastal bytes must match exactly; otherwise the correction is zero. Roots, roughness, geometry and navigation are unchanged.

## Retained fix and independent evidence

Every nonzero correction vertex has its entire bilinear basis inside the originally predefined margin. Complete-cell analysis and independent normalized-RG8 samples find zero core leakage. This fixes the earlier2,667-witness failure without redefining cores from changed output. The guarantee applies to the predefined bilinear source-width fields, the tested coordinates and level-zero LINEAR sampling; no mipmaps.

The final solver uses derivatives of the ORIGINAL atlas plus the correction on their overlaid cell partitions. It minimizes worst directional slope, then minimizes total alteration at that optimum. The prior resampled-baseline solver's apparent pass is rejected and retained separately.

Independent actual-source measurements: maximum gradient in the window0.191034→0.185205 (3.05%); selected-profile maximum0.190217→0.182404 (4.11%). Protected cores remain exact; sampled range, half-coverage classes and component/hole counts are preserved. Original half-contour residual is0.000369 coverage, approximately2mm first-order displacement; exact contour preservation is not claimed. This is a small local numerical improvement, not whole-landscape or perceptual acceptance.

The correction is89×65 RG8,11,570bytes, on texture unit15. Independent JavaScript/source review verifies exact embedded bytes, crop perimeter zeros, source-mismatch fallback, texture coordinates, LINEAR/no-mipmap configuration, binding and disposal. Shader JavaScript syntax passes. WebGL compilation/execution, performance and final-lit perceptual comparison have NOT run. Experience-anchor/release qualification remains outstanding; this draft must not be published from numerical evidence alone.

## Reproduction

The checked habitat fixture and earlier source scripts remain in this evidence directory. After unpacking the fixture: run signed_distance_habitat.py, adaptive_habitat.py, basis_safe_margin.py, then overlay_gradient_margin.py. NumPy, SciPy and contourpy are required. Run independent_gradient_review.py overlay-gradient-margin for the decoded-grid checks. Original-grid/contour reports separately retain the independent actual-source checks. The builder script is an exact original-workspace construction record with explicit paths, not a portable installer. The embedded module bytes and independent renderer report bind the actual candidate.

The full-coast expanded LP hit its45s budget and produced no valid new solution. Its older NPZ must not be paired with that failure report. The final candidate is the separately named local ORIGINAL-grid overlay solution only.

## Next checkpoint

Prepare the fixed final-lit comparison of this immutable candidate and unchanged baseline at the established source-bound views and healthy controls. Current generation2992 explicitly permits no remoteGPU, merge or publication, so a further remote comparison needs the existing canonical qualification admission. Do not repeat source recovery or interpret tests passing as the user's visual acceptance. Separate inland material-boundary work remains open.
