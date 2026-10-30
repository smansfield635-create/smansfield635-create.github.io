# Active terrain source evaluator — Gen3000

This checkpoint reconstructs the active soil geometry omitted by the previous original-only sampler. It does not build a new correction texture or qualify a world-wide material repair. Frozen product candidate: `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`. Admission: issue6911 comment6527846342, operation `H_EARTH_ACTIVE_MATERIAL_EVALUATOR_20261030_001`.

The original geological constructor and its eight-module dependency closure are extracted from the exact candidate, hashed and executed unchanged. The evaluator applies the native index-retirement function and inverse spherical coordinate transform. The active cp2 renderer is separately hash-verified as the authority for role mappings and affine expressions. No renderer or asset bytes change.

| Local grid support class | Points of 40,960 |
|---|---:|
| Surviving original near terrain | 31,456 |
| Eroded replacement terrain | 9,472 |
| Mountain overburden replacement | 32 |
| Original far continuation | 0 |

The grid has one hook-eligible layer at each center, with shared triangle edges collapsed within a mesh. It has no unresolved multiple hook-eligible interiors at these centers. Another 782 centers also intersect excluded rock or water geometry. This is **not** a depth visibility result: the evaluator never silently chooses among soil, water and rock layers. The 2-unit grid is not continuous area, full boundary coverage, or walking eligibility proof.

The construction matches the saved capture's 3,058 retired triangles and six attached geological meshes. Every retired index triplet becomes degenerate and every unretired index is checked unchanged. All generated and surviving vertices round-trip through the native local/spherical conversion with maximum error `1.1641532182693481e-10`. Original vertex inversion followed by planar authoring interpolation matches the native CPU convention; it is not the inverse of every interpolated GPU fragment. This resolves the prior coordinate caveat for this CPU support census only.

The downstream algebra evaluator carries **RGB A and RGB B** and preserves stage order. Site B's RGB gain passes 10,000 deterministic direct-expression comparisons. Zero/full-mask controls, missing-input rejection, invalid-value rejection, hash corruption, coordinate boundary cases, layer ambiguity and role exclusions are tested. The unchanged local correction still uses its valid pre-overlay four-channel representation.

Three declared synthetic camera states evaluate four native shader distance envelopes on the same supported triangle hits. Their differences establish camera-input dependence, not complete material-coefficient or pixel differences. These are CPU sensitivity inputs, not navigation-qualified capture poses. No GPU run was launched.

## Attribute follow-up

The next source-attribute checkpoint is now implemented in [ATTRIBUTES.md](ATTRIBUTES.md). It reconstructs raw upload, base seam, generated rim and final GPU coast attributes. The geometry results below remain unchanged.

## Texture and camera follow-up

[INPUTS.md](INPUTS.md) now records the reproduced final habitat/mask fields, native atlas addressing and captured parent-plane camera inputs. Geometry and attribute evidence carry forward.

## Ordered material follow-up

[MATERIAL.md](MATERIAL.md) records the implemented conditional RGB coefficient evaluator from the symbolic pre-identity soil substrate through all downstream color stages. Its source-model results and remaining hardware/visibility limits supersede the ordered-composition gap below; previous checkpoint reports remain immutable evidence.

## Original checkpoint boundary (historical)

**Complete material coefficients remain unresolved for all grid points.** The attribute follow-up now supplies rendered rim normals, coast/contact fields, base colors and material parameters. Actual shoreline/habitat textures and native atlas addressing are now supplied by the texture follow-up. Ordered stage composition, general camera derivatives and exact soil mip sampling remain unresolved. Unknown stages return `UNRESOLVED` with null coefficients; they are never assumed to have zero influence. Dynamic refinement and final lighting are outside this snapshot.

The next bounded evaluator increment is to implement ordered material-stage evaluation using the reconstructed attributes and texture inputs, retaining explicit mip/derivative limits. Carry forward these geometry results. Do not repeat original-mesh recovery or the 48-unit specimen capture. No broader correction texture can be justified by this checkpoint alone.

## Reproduce

Requirements: Node with ES modules, Python3, NumPy and Shapely2.1.2. A Git checkout must contain the frozen candidate object. Obtain original run40909501175 artifact12913811096 (ZIP hash in manifest), and Gen2998 run41083373434 artifact12991506650. These retained GitHub artifacts are inputs; they are not claimed permanently stored in this evidence directory. `mesh/package.json`, upload arrays and baseline receipt must match the pinned hashes. The raw geometry binaries emitted below are reproducible intermediates and are not committed.

```sh
python3 prepare.py /path/to/git-checkout /tmp/evaluator-source
node evaluate.mjs /tmp/evaluator-source /path/to/original-mesh/mesh /path/to/baseline/receipt.json /tmp/evaluator-output
python3 census.py /tmp/evaluator-output /tmp/evaluator-output/census.json
EVALUATOR_SOURCE_DIR=/tmp/evaluator-source node --test evaluate.test.mjs
```

Compare `geometry.json` and `census.json` to committed reports. `source-manifest.json` pins the full imported module closure and raw inputs. Source preparation performs no network requests and does not reconstruct authority. Do not import the old snapshot as current without these checks.

The capture's absence of refinement is specific to that capture. The report does not establish absence for arbitrary camera states. Product, merge, deployment and visual acceptance remain unchanged.
