# Resident textures, native atlas addressing and captured camera inputs

This Gen3000 checkpoint carries forward geometry `854aed7…` and attributes `fe08a711…`. Product source stays at `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`. No product, asset, workflow, GPU or publication changes.

## Actual resident fields

`resident-fields.mjs` authenticates the packed precomputed grass and reproduces the native owner preparation before any WebGL calls. It appends native oasis-bank roots, rebuilds entrance additions using original baseline prefixes and captured palm placements, updates the habitat from full installed occupancy, and filters the finalized material field with the unchanged native function. The native raw planting package is separately reconstructed from the authenticated base-world asset for the oasis mask; its native package/input/pixel integrity gates all pass.

| Captured invariant | Reproduced |
|---|---:|
| Original roots | 2,858,738 |
| Oasis-bank additions | 1,571 |
| Entrance additions | 54,218 |
| Installed roots | 2,914,527 |
| Touched / raised / rejected habitat texels | 903 / 627 / 17 |

The full deterministic entrance and habitat receipts match the capture; only entrance generation duration is excluded. Native habitat and filtered material habitat remain separate R8 textures. Both use LINEAR and CLAMP_TO_EDGE with no mipmaps. Recovered pixel hashes:

- Native habitat: `3cb91cf926bf486d59ca4364223d380d195b03e9dc0c404a06d5bd2ea2f3593a`.
- Filtered material habitat: `ef09deb92d028249f96a6ba2623b68081dcf283c8cbf9d453c282805cc9a2f37`.
- Oasis soil mask: `fd528f619eabb1498d6aa20762600c9a89ee2967d90c93f08043987edf1ea13a`.

The input manifest pins78 modules and7 assets. CPU replay uses local authenticated files only. Generated texture bytes are reproducible intermediates, not new product assets.

## Atlas and margin inputs

`atlas-inputs.mjs` executes the unchanged, hash-bound renderer `preparePresentation` function. All imported module bytes are verified before execution. All358 charts apply; native duplication adds1,074 vertices; no chart parent is retired by geology. Every duplicated material attribute is checked against its original vertex. Native Float32 UVs, flat atlas IDs and retired/remapped indices are emitted without changing source geometry.

Near/far PNG bytes match the captured responses; images are4096×114 and4096×2248. The margin helper independently accepts the reconstructed source hashes and emits the exact97×97 RGBA16F field, hash `b3133bdccff6f6d936285d8ea27ea30ddc9b5897366303fc3d9874d97da2e28f`. The256×256 soil PNG is decoded at base level. Its GPU-generated mip levels are explicitly unresolved, never replaced with a hidden level-zero assumption.

## Camera/texture sampling adapter

`sampling.py` supplies a CPU bilinear filter with explicit CLAMP/REPEAT behavior and parent-plane ray intersections for captured2×2 derivative quads. It uses each actual384×688 canvas, the actual camera matrix converted to Float32 as uploaded, and bottom-left derivative coordinates. It rejects out-of-clip/out-of-viewport or invalid inputs.

All15 existing source comparison centers have one active support and resolved parent-plane inputs plus native-UV atlas samples. Three need helper extrapolation outside their parent triangle; those are marked. These inputs do not establish raster visibility, helper invocation ownership, fine/coarse derivative behavior, hardware filter rounding or full shader equivalence. Independent reprojection error is at most1.41e-10 pixels.

## Reproduce

Use original mesh artifact and capture receipts already pinned by the earlier checkpoints. The prepared source directory must include the native attribute closure as well as texture closure for the complete test suite.

```sh
python3 prepare-attributes.py /path/to/repo /tmp/source
python3 prepare-textures.py /path/to/repo /tmp/source
node resident-fields.mjs /tmp/source /path/to/original-mesh/mesh /path/to/baseline/receipt.json /tmp/texture-inputs
node atlas-inputs.mjs /tmp/source /tmp/source/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js /tmp/attribute-output /path/to/original-mesh/mesh /tmp/texture-inputs
python3 sampling.py /tmp/source /tmp/geometry-output /path/to/original-mesh/mesh /path/to/candidate/receipt.json /tmp/texture-inputs
EVALUATOR_SOURCE_DIR=/tmp/source EVALUATOR_ATTRIBUTE_OUTPUT=/tmp/attribute-output EVALUATOR_TEXTURE_OUTPUT=/tmp/texture-inputs EVALUATOR_RENDERER=/tmp/source/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js node --test attributes.test.mjs evaluate.test.mjs texture-inputs.test.mjs
```

Earlier README/ATTRIBUTES commands produce the geometry and attribute outputs. Reports and fixture hashes are committed; raw assets and emitted intermediates are not duplicated in this evidence directory. Twenty-two tests pass.

## Remaining material boundary

The next implementation is the ordered color-stage evaluator consuming these fields and reconstructed attributes. Keep the exact soil-mip and derivative limitations explicit. Full material coefficients are still `UNRESOLVED`: this checkpoint supplies inputs, not a completed fragment shader or a visibly improved surface. No expanded correction or new GPU run is justified by input recovery alone.
