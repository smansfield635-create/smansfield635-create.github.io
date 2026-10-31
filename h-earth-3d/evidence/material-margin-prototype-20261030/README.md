# H-Earth material margin prototype

This implements the previously missing **bounded numerical locator and reconstruction**. It is an evidence-only prototype, not a renderer patch or a completed landscape repair.

Baseline: published H-Earth `260c66540b4471bb3d50cbc28cf82d160b732b19`.
Admission: operation H_EARTH_MATERIAL_MARGIN_PROTOTYPE_20261030_001, generation 2991, [authentic receipt](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6514306408).

## What is implemented

The detector finds concentrated dark/light color changes per world metre along the archived source transects. It uses current material coefficients, including the existing atlas, with a constant per-transect substrate reference to avoid locating photographic grain. A unique material label, exact selector contour or exact phone camera is unnecessary.

Inside a supported 12 m interval, the operator reconstructs `(A, B + D_atlas)` between the existing two sides. The original substrate P is evaluated at its original sample: `Qcandidate = Acandidate * P + Bcandidate`. It does not filter the photograph, delete a residual wholesale, or add the old atlas correction twice.

The central 6 m uses the endpoint bridge; compact quintic shoulders return to the unchanged baseline. The **correction** and its first derivative vanish at support limits. This does not establish globally C1 renderer output: inherited sampled-interpolant kinks and two-dimensional geometry remain outside the proof.

Ambiguous ownership, unsupported gaps/endpoints, overlapping supports and opposite transitions are explicit exclusions. Overlapping or opposing margins are not silently merged. A numerical envelope check prevents new coefficient extrema relative to the native samples and interpolated endpoints.

## Executed results

| Archived group | Retained transect intervals | Changed memberships | Unchanged memberships |
|---|---:|---:|---:|
| Near | 15 | 65 | 1049 |
| Far | 0 | 0 | 1461 |

These are sampled intervals, **not 15 independent map seams**. The retained intervals' maximum display-code gradient per metre decreases by a median 19.22%; individual decreases range from 0.37% to 56.42%. These are diagnostic model values, not a visual acceptance threshold. The far group has no qualified interval: endpoint/ownership coverage is inadequate or no qualifying concentration remains.

All unchanged samples are exact. P is unchanged. Full interval locations, endpoint coefficients, metrics and exclusions are in result.json.

## Independent tests and retained failure

Independent review executed the actual unmodified prototype against constant, gradual linear, narrow grayscale, narrow chromatic, forward/reverse step and irregularly sampled inputs. Constant/linear/narrow patches remain unchanged; isolated steps are reconstructed. Actual shoulder behavior and coefficient bounds pass.

The first opposing-transition check used luminance and could erase an equal-luminance colored patch. That failed assertion is preserved in prior-review-failure.json. The corrected guard projects RGB changes onto the detected transition direction, and the same counterexample now remains unchanged. The first permissive 48-interval run is superseded; it is not the reported result.

Reviewed prototype SHA-256: `b780c1867ca782163f237d63b2719dfac55df437feb30f91f5d7fe1881a56738`.

## Reproduce without a GPU

Requires Python, NumPy and Pillow.

1. Set up a workspace ROOT containing the current exact repository checkout at ROOT/repo.
2. Recover the already saved paired-material packet from [issue evidence](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6504179848) into ROOT/recovered/paired. ZIP SHA-256: `08b0c3ae8e1cc3c318b7fa1ada6d01e75370f5423745f2250db6354805b3fdef`.
3. Create ROOT/boundary-reconciliation.
4. Run `python3 sample_current_atlas.py ROOT`, then `python3 margin_prototype.py ROOT`.
5. Run `python3 independent_review.py` for the independent synthetic fixtures; it needs no saved world packet.

Outputs go to ROOT/boundary-reconciliation. Generated NPZ container hashes can vary with ZIP timestamps; compare named arrays and numerical records. Original archived input hashes and resulting source identities remain recorded.

The existing source-model assumptions about normals, derivative/LOD behavior and source membership remain. This stage ends before later material overlays and lighting.

## Next incomplete engineering boundary

Extend this sampled-path implementation to a continuous two-dimensional world-space margin field with adequate endpoints, while retaining source ownership and exclusions. Qualify corners/overlap and the currently unhandled far margins. Use the current atlas-inclusive coefficients throughout. The existing 1-D sampling cannot be installed as a general renderer field.

Only after that numerical coverage proof should an actual shader candidate and fixed final-lit comparison be built. Reuse the successful capture harness and old rejection ledger; do not repeat source recovery or stage attribution. This operation authorizes no GPU, product edit, merge, publication or claim that the owner's hard boundaries are fixed.
