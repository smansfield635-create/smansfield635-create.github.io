# CPU material reconstruction conditioned on captured factors

`reconstruct.py` verifies the immutable approved renderer, image hashes, pose/camera/assets, and exact baseline/resident source parity outside the patch-field substitution. It then recomputes the identity expression and groundcover target at the existing 2,484 near/far samples. The calibrated Y values replace inversion of the old RGB8 height proxy.

Result: zero conditional interval contradictions in all identity gates, precise-height identity target/result, and groundcover target. Nominal errors remain below one displayed output code. This is a source-equation reconstruction using measured intermediate factors, not an independent mesh/texture shader replay.

Dependencies: Python, NumPy, Pillow; `identity-model.py` is the unchanged source-bound identity analyzer from the earlier diagnostic. Supply `--identity`, `--world`, `--ledger`, `--renderer`, `--resident`, and `--output` to use other materialized locations. The defaults identify this workspace's preserved inputs. The renderer must hash to fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec. The resident source must match its receipt and differ only in the documented patch region.

## Source replay and attribution

`source-fields.py` implements explicit nonfused Float32 hash21/noise2 and a coordinate-box field screen. All 7,452 archived macro/meso/detail values overlap its conditional envelopes. This is not a certified GPU arithmetic bound.

`full-p-screen.py` implements one nominal full incoming-soil P expression, including source microrelief, triplanar fields, nominal source-mesh normals, recovered photographic soil, and a declared CPU mip/trilinear sampler. Its result is **NOMINAL_REPLAY_NOT_QUALIFIED**: 458 of 2,484 pixels exceed one display code in at least one channel. This is a concrete emulator discrepancy, not a rejection of source or capture. Higher-frequency coordinates, implicit derivatives/helper lanes, nominal normals, and browser sampler arithmetic remain uncertain. Source recovery is complete for this bounded ordinary-soil expression; source availability is not presented as the blocker.

`attribute-p.py` reruns the same expression with four fixed archived-factor substitutions. It reads and instruments the baseline script in memory, asserts each injection occurs exactly once, does not alter that script, and preserves baseline files. See `attribution-result.json`. Baseline near/far counts over one output code are 286/172; triFine substitution yields 286/173, variation 286/172, both 285/172, and both plus macro/meso 275/175. Thus the conspicuous triFine intermediate mismatch does not explain the incoming-P mismatch in this screen. RGB8 bin centers are measurements, not exact shader values; substitution results cannot qualify autonomous replay or P(c,f0).

`verify-mesh.py` independently checks source-triangle association with polygon clipping (not the parent's LP method) and checks all four uploaded-buffer hashes. All 2,484 candidate sets match, retaining 86 ambiguous samples. See `mesh-independent-review.json`.

### Reproduction

Python 3 with NumPy and Pillow suffices for these scripts. The parent mesh reconstruction additionally needs Node and SciPy. Execute from any directory:

```sh
python /tmp/material-cpu/reconstruct.py --renderer /tmp/world-renderer.js
python /tmp/material-cpu/source-fields.py
python /tmp/material-cpu/full-p-screen.py
python /tmp/material-cpu/attribute-p.py
python /tmp/material-cpu/verify-mesh.py
```

Required source and measured inputs:

- `/tmp/world-renderer.js`: approved cb57c275b95d0d48883bc4da4dcfcf17cbec5060 renderer, SHA256 fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec.
- `/tmp/old-diagnostic/`: 20 archived identity-factor images and receipt.
- `/tmp/diagnostic/`: eight precise world-coordinate/coast images and receipt, run 40790969812.
- `/tmp/hearth-ledger/capture/`: resident diagnostic input/target parity evidence; resident weight/final are not accepted baseline.
- `/workspace/scratch/9baa27da97f1/resident-renderer.js`: source needed only by capture-conditioned parity verification.
- `/tmp/material-cpu/identity-model.py`: unchanged earlier source-bound analyzer.
- `/tmp/mesh-cpu/`: source package, upload buffers, upload receipt, surface samples, and full-size near/far nominal normal NPY arrays. Normal arrays carry source mesh association but are nominal per-fragment estimates, not hardware readback.
- `/tmp/material-cpu/soil.png`: exact `showroom/globe/h-earth/render/assets/woodland-clearing-soil.png` from the approved source, SHA256 494ad35121ec33c7de85635e5564cae127b4a3a265414da36e4de7e0c64d9cce. Renderer sampler uses RGBA8, generated mipmaps, LINEAR_MIPMAP_LINEAR, LINEAR, REPEAT. CPU mip rounding and implicit LOD are declared approximations.
- `/tmp/h-earth-scene-cb57`: exact detached source tree used by parent's original-module mesh reconstruction.

The field and full-P scripts use these fixed paths intentionally. Preserve input receipts and exact images when relocating; adapt paths explicitly. No observed composite color is replaced by an invented mean. No new GPU run, product edit, appearance acceptance, fine-reference qualification or release occurred.

## Follow-up: mip arithmetic and source-primitive derivatives

The original 458-failure result remains unchanged. `mip-attribution.py` compares four declared arithmetic models without fitting shader values. Recursive half-up gives 458 failures, recursive round-even gives one, unquantized recursion gives 25, and direct-base box round-even gives 135. Independent integer quotient/remainder arithmetic confirms the accumulated rounding difference: the final half-up mip is RGB [105,88,63], while half-even is [104,88,62]. These are CPU models; the capture did not include GPU mip bytes.

`source-audit-v2.json` identifies an unintended NumPy Int64-to-Float64 promotion in the normal perturbation orientation. `replay-v2.py` explicitly corrects it to Float32 and declares the round-even mip model, leaving the original script and outputs intact. Its one retained exception is far pixel (400,496), on source FAR triangle 73902. Independent source geometry places its visible lower quad partner on NEAR triangle 144. Visible-neighbor texture derivatives therefore mix distinct primitives. The corresponding model LOD is about 5.88, versus about 4.92 using extrapolated source-triangle helper positions.

`helper-attribution.py` is only a one-quad backward-stencil experiment. It is not the qualifying uniform model. `primitive-lod-screen.py` instead applies one source-triangle quad derivative rule to all 2,484 samples and every retained triangle membership, including all 86 ambiguous samples. All candidates are within one output code: maximum channel error is 0.8281. It retains measured center UVs and uses the uploaded source projection only for nominal same-primitive derivatives. This is conditional source-model compatibility, not proof of hardware equivalence. The earlier failed absolute-ray screen still applies; no projected coordinate is promoted to certified measured position.

Reproduce the new evidence with `python mip-attribution.py`, `python replay-v2.py`, `python helper-attribution.py`, and `python primitive-lod-screen.py`. The last three instrument the preserved baseline in memory with explicit substitutions. The mesh sibling contains `helper-lane-review.py` and its independent review. Source expression audit, mip arithmetic review and uniform-derivative review are preserved separately.

Independent forward-projection/perspective-barycentric verification covers all 2,575 candidate memberships with maximum LOD disagreement below 2.77e-11. Ambiguity is propagated through LOD only: nominal normals and the procedural palette are not independently enumerated over all memberships. Consequently this is not full all-candidate material qualification.

The observed baseline mismatch is localized to the emulator's mip/derivative assumptions; this does not identify the cause of the visible terrain band. A source fine-reference contract, protected closed mesh integration domain, and candidate appearance comparison are still outstanding. No product shader change, GPU dispatch, publication or appearance acceptance was performed.
