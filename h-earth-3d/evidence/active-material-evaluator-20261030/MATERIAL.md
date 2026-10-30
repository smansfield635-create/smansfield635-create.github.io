# Ordered ground-material evaluation — Gen3000

The ordered CPU evaluator is implemented. It carries RGB coefficients from the saved pre-identity substrate through all fifteen downstream color operations in the frozen renderer. It does not change the product or supply final rendered colors.

Frozen product: `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`. Prior input checkpoint: `ed3e708a2c9e1bf098a3675b8806a2cc34312e95`. Existing admission remains `H_EARTH_ACTIVE_MATERIAL_EVALUATOR_20261030_001`, generation 3000. All additions are inside the admitted evidence directory.

## What is now calculated

For fixed source attributes, resident fields and the declared derivative model, the material is represented as `A * P + B`, with separate RGB values for A and B. P is the existing `materialMarginSubstrate`, captured before environmental identity. It retains the original soil texture and earlier soil construction symbolically.

The stage order is environmental identity, groundcover, corrected atlas, material margin, four manor operations, Site B, steep bank, sand, shoreline root soil, woodland litter, habitat, and bank gravel. The atlas adds to B. The margin adds to A and B relative to the original P; it does **not** multiply the already-composed palette. Later color layers attenuate both corrections normally. Habitat disablement also disables bank gravel, matching the native branch.

The evaluator reproduces the procedural micro-normal/triplanar inputs before the later soil-normal update. It consumes the reconstructed native normals, coast/contact fields, habitat textures, oasis mask, uploaded atlas coordinates and decoded half-float margin values. The additional rendered-beach helper is hash-bound in `ordered-source-manifest.json`; earlier source, geometry, attribute and resident-field guards carry forward.

## Qualified scope and exclusions

`ordered-material.json` contains 18 reproducible conditional evaluations:

- 15 saved-camera queries evaluated at their actual pixel-center parent-plane lanes, with attributes and atlas samples interpolated at that same lane. Requested source centers are retained as provenance, not substituted for pixel positions.
- 3 separately labeled synthetic source probes: eroded replacement terrain, mountain overburden and far continuation. Each uses the largest native triangle of its class and a declared tangent quad. These are algebra probes, not screenshots or visibility tests.

One saved-camera selected lane lies outside its parent triangle. It is explicitly `EXTRAPOLATED_PARENT_PLANE`, with barycentric weights and the selected-lane flag retained. Other helper extrapolations remain individually counted. No record establishes a raster depth winner, hardware helper ownership or physical-device acceptance.

At the saved-camera source-model queries, all post-margin overlay weights are zero: those local queries do not demonstrate the operation of the resident habitat and other later layers elsewhere. The generated-terrain probes do have nonzero resident habitat contributions. This distinguishes the local specimen from the wider active terrain; it does not diagnose every remaining visible boundary.

The following remain unresolved:

- final P and final RGB, including GPU-generated soil mip levels and texture filtering;
- binary64 procedural noise versus GPU highp arithmetic;
- exact hardware derivative mode and helper ownership;
- manor's nested derivative behavior when its envelope is active (explicit uncertainty tag);
- lighting, depth visibility and map-wide visual repair.

No new correction field, product write, GPU capture, merge or deployment was performed.

## Validation

The full checkpoint suite passes 25 Node tests, including 18 Python regression tests. Tests cover original-substrate margin semantics, downstream attenuation, per-channel Site B gain, strict/inclusive texture bounds, missing active operands, protected grove masks, far-normal orientation, matched pixel lanes, complete stage order and exact fixture replay. Independent checks compare 1,000 native foothill/hillside helper cases and 1,000 random-substrate compositions. These checks qualify the stated CPU model; they do not upgrade it to hardware or visual equivalence.

Independent reviewer reproduces the complete report byte-for-byte from the authenticated inputs. See `material-review.json` for final reviewed identities and results.

## Reproduce

First follow the existing README, ATTRIBUTES and INPUTS procedures to materialize authenticated source and intermediate arrays from the two retained GitHub artifacts. Their hashes and committed checkpoint outputs remain unchanged. Then:

```sh
python3 prepare-material.py /path/to/repo /tmp/source
python3 build_material_inputs.py . /tmp/source /tmp/geometry-output /tmp/attribute-output /tmp/texture-inputs /path/to/original-mesh/mesh /path/to/candidate/receipt.json /tmp/ordered-material.json
EVALUATOR_SOURCE_DIR=/tmp/source EVALUATOR_ATTRIBUTE_OUTPUT=/tmp/attribute-output EVALUATOR_TEXTURE_OUTPUT=/tmp/texture-inputs EVALUATOR_RENDERER=/tmp/source/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js node --test *.test.mjs
```

The new fixture and formula tests also run without raw artifact recovery:

```sh
python3 -m unittest -v test_material_stages.py test_material_replay.py
```

## One next action

Use this evaluator on the already-reconstructed active terrain census to classify candidate transition margins by contributing stage, maintaining the distinction between symbolic coefficients and final color. Bind camera/derivative assumptions and exclude unsupported ownership cases explicitly. Preserve dark/light cores, native texture and the previous local improvement. Do not repeat the unchanged local capture or generate an expanded correction texture until the source classification establishes its supported boundary and mechanism.
