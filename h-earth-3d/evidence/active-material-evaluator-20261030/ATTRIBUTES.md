# Native material-attribute reconstruction

Gen3000 continues within the existing source-evaluator admission and unchanged product candidate `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`. The prior geometry checkpoint is `854aed7bf1a59070a897aafad78acdba454c6b4f`.

The evaluator now reproduces the renderer's original GPU upload preparation, exposed-water contact generation, base near/far seam presentation, eroded/overburden normal and color construction, rim blending, and final geological coast presentation. It executes native module code and two unchanged source blocks extracted from the hash-verified active renderer. Source-block hashes are pinned separately. The dependency closure has 65 modules, including the eight already qualified modules.

Four attribute states must remain distinct:

| State | Source and use |
|---|---|
| Raw upload | Native canonical preparation, woodland clearing enabled; authoritative input to geology rim blending. |
| Base GPU presentation | Native near/far normal, coast and contact seam reconciliation. |
| Generated support | Native Float32 normal/color/material construction, then rim reconciliation against raw source attributes. |
| Generated GPU presentation | Same support attributes except coast is independently interpolated from original terrain across every eroded/overburden vertex. |

The renderer contact field uses **original unretired TERRAIN against open ocean**, before geology, with no refinement patch. Its 434 contact segments, 62,308 overlap tests and all other nontiming statistics match the saved baseline capture. It is not a replacement active-shoreline or freshwater field. Initial generated coast/contact values of140 are authentic source behavior; no new zero or constant placeholder is introduced.

The base seam matches all captured receipt fields, including349 matched vertices. Normal/coast buffer hashes match the previously verified upload evidence. Raw source arrays remain unchanged. Generated positions and indices match the prior geometry checkpoint byte-for-byte.

| Attribute change | Eroded terrain vertices | Overburden vertices |
|---|---:|---:|
| Rim normals | 4,353 | 0 |
| Rim base color | 3,607 | 0 |
| Rim material parameters | 4,353 | 0 |
| Rim coast/contact | 4,353 | 0 |
| Final GPU coast versus support coast | 24,218 | 45 |

These are changed attribute counts, not defects, visible improvements or repaired pixels. Float32 writes and the unnormalized post-rim normals are preserved. The six emitted states contain66 binary buffers with hashes, sizes and finite ranges recorded in `attributes.json`. They are reproducible scratch outputs, not committed assets.

## Reproduce and check

Use the same original artifact and baseline receipt pinned by `source-manifest.json`. Source preparation reads Git objects locally and performs no network requests.

```sh
python3 prepare-attributes.py /path/to/git-checkout /tmp/evaluator-source
node attributes.mjs /tmp/evaluator-source /path/to/original-mesh/mesh /path/to/baseline/receipt.json /tmp/evaluator-attributes
EVALUATOR_SOURCE_DIR=/tmp/evaluator-source EVALUATOR_ATTRIBUTE_OUTPUT=/tmp/evaluator-attributes node --test attributes.test.mjs evaluate.test.mjs
```

The suite checks source-slice corruption, actual contact/seam results, geometry identity, GPU/support separation, every emitted buffer's digest and finite values, boundary interpolation from raw inputs, unchanged interior controls, and the prior geometry/affine invariants. Sixteen tests pass. Independent review reproduced the report and all66 binary buffers byte-for-byte, and independently verified all65 source-module hashes against the frozen candidate.

## Remaining boundary

This is exact source arithmetic reconstruction, not hardware buffer readback or complete shader equivalence. Base attributes precede corrected-atlas vertex duplication; UV/addressing and atlas values remain to be supplied. Resident soil/coverage/habitat textures, canopy inputs, camera-dependent derivatives and later material composition remain unresolved. The full-material output must continue returning `UNRESOLVED` until those real inputs are available. No expanded correction texture, GPU capture, product change or visual acceptance follows from this checkpoint.
