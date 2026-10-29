# Immutable scene CPU reconstruction

This evidence advances source reconstruction; it does not qualify a product repair. The original source package and validator reproduce package `4f1b7ff2` (141,373 vertices, 122,222 triangles). Original upload and normal/coast seam operations match the captured seam receipt. Independent polygon clipping agrees with all 2,484 coordinate-box associations: 2,398 unique and 86 ambiguous. The 47 selected source triangles survive the audited retirement scopes. Their areas are not pixel quadrature weights.

## Reproduction inputs

Use Node.js and Python with NumPy, Pillow and SciPy. Materialize repository commit `cb57c275b95d0d48883bc4da4dcfcf17cbec5060` at `/tmp/h-earth-scene-cb57`; `source-paths.txt` lists the source files. The review compares all 716 listed files against that commit. Scripts preserve their original execution paths; materialize this directory at `/tmp/mesh-cpu` and the sibling material evidence at `/tmp/material-cpu`.

From that commit, extract `showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz` to `/tmp/base-world.json.gz` (SHA256 `48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a`), `live-render-package.run8e-r2.js` from the render directory to `/tmp/raw-package.js`, `verified-planting-packet.v1.js` to `/tmp/verified-planting-packet.mjs`, and `persistent-live-renderer.run8e-r3c.js` to `/tmp/world-renderer.js`. Extract the original `assets/woodland-clearing-soil.png` to both CPU directories. Its SHA256 is `494ad35121ec33c7de85635e5564cae127b4a3a265414da36e4de7e0c64d9cce`.

Unpack the already archived world run 40790969812 to `/tmp/diagnostic`. Material checks also use archived identity run 40773251264 (artifact 12854046080) at `/tmp/old-diagnostic` and ledger run 40739898768 (artifact 12839995220) under `/tmp/hearth-ledger/capture`; preserve original receipts and image names. `material/reconstruct.py` accepts explicit input paths, including its receipt-bound resident renderer. These older inputs are dependencies, not newly generated captures.

Run `node reconstruct.mjs`, then `node reconstruct-direct.mjs`, then `node upload-replay.mjs`. The first creates the reproducible package/buffers; the second imports unmodified original ES modules and compares every buffer. Run `python match-surface.py`, `python domain-audit.py`, and `python independent-mesh-review.py`. The independent script uses polygon clipping rather than the association script's linear programming. Run `python nominal-normals.py` before the material full-P screen.

Generated package, buffers and nominal arrays are omitted from Git because these scripts regenerate them from immutable source. JSON reports, sample membership, source list and review scripts are preserved. Contact distances were not reconstructed: a zero placeholder is used only for the independent normal/coast seam operations. Pre-retirement indices are used only after selected-domain scope review.

The material screen uses nominal measured coordinate centers, approximate derivatives and sampler behavior. It is not a GPU-equivalent evaluator. No fine-reference split, closed transport integration domain, appearance acceptance, shader edit, new GPU run, or deployment follows from these results.
