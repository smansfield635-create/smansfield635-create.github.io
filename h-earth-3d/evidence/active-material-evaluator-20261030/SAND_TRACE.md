# Rank1 sand boundary source trace — Gen3000

The strongest pair in the conditional coefficient ranking is a native wet-contact sand fade. It has not been established as one of the visible inland seams requiring repair. Preserve it as an explained source transition, without changing the product.

Frozen product `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`; prior evaluator checkpoint `6d73b6012b40e9ddd7fa7ce84db7bcd979fcdab9`; existing admission `H_EARTH_ACTIVE_MATERIAL_EVALUATOR_20261030_001` / generation3000 / receipt6527846342. Remote evaluator and main were checked unchanged at entry. Writes remain inside this admitted evidence directory.

## Mechanism and continuous terrain support

The local segment (-165,-129) to (-165,-127) crosses two surviving original-near triangles,11397 and11588, at approximately t=0.5. Affine triangle clipping checks the entire segment, not only sampled centers. Native world position, normal, contact/coast attributes and atlas/margin inputs agree at the shared edge to floating-point precision. World arc length is calculated on the two interpolated native planes rather than assuming the local two-unit distance is the same.

Signed contact distance decreases from0.590059 to-1.112783. Continuous bounds give slope below0.003374 and height below0.022942m. Consequently the slope/height suitability, inland fade and hillside-suppression factors are identically1 on this segment. Sand coverage reduces to the native `smoothstep(-1,0,contactDistance)` gate. Its full transition spans approximately1.162861m of world arc; the10–90% span is0.700515m. This describes the existing smooth coverage gate, not perceived smoothness of final rendered color.

The frozen renderer constructs contact distance from geometric terrain/water intersections, signs vertices below water negative, uploads Float32 values and interpolates them across triangles. Its own source labels this a per-vertex linear approximation. Thus the interpolated zero contour is not automatically an exact water intersection or a visible shoreline location.

The complete piecewise segment is outside the native grove, oasis, estate and route protection fringes, established by conservative continuous distance bounds. Fine material samples corroborate the sand expression; they do not prove continuous behavior for every other procedural stage.

The retained census contains eight surfaces and omits the original ocean. A separate check now intersects its authenticated uploaded span in native world XZ. Ocean projection covers the entire segment across three terrain-piece/ocean-triangle intersections. Terrain minus ocean height changes from+0.060399m to-0.107189m, crossing at approximately t=0.234623; the full sand fade begins later, at t=0.355489. Thus the source geometry places the fade below the ocean plane. This is geometric context, not a camera-specific raster visibility or transparency verdict. No defect or repair target is established by this pair.

## Verification

All28 Node tests pass, including four new Python regressions for clipping/reversal/tangency, conservative slope bounds, join clustering and sand-gate reduction. See `sand-tests.txt`.

Independent West review uses GEOS polygon-line intersections rather than the candidate halfspace clipper. It reproduces two terrain and three ocean-piece intersections, checks all72 reported native-attribute/sand-gain queries, and verifies continuous slope, height, protection and threshold calculations. Maximum compared numeric difference is5.684342e-14. It does not independently replay every downstream material coefficient. See `sand-trace-review.json`, `independent-sand-geometry.json` and the reusable reviewer scripts.

## Reproduce

Reuse the authenticated source/geometry/attributes/textures and retained artifact inputs from previous checkpoints. From this evidence directory:

```sh
python3 trace_sand.py . /tmp/source /tmp/geometry-output /tmp/attribute-output /tmp/texture-inputs /path/to/original-mesh/mesh /path/to/candidate/receipt.json /tmp/sand-trace.json
python3 independent_sand_review.py . /tmp/source /tmp/geometry-output /tmp/attribute-output /tmp/texture-inputs /path/to/original-mesh/mesh /path/to/candidate/receipt.json /tmp/independent-sand-geometry.json
python3 finalize_sand_review.py . /tmp/independent-sand-geometry.json /tmp/sand-trace.json /tmp/sand-trace-review.json
```

The report binds script and dependency hashes; the prior full census is preserved. No full-grid replay is required for this bounded trace. Final substrate RGB, hardware derivatives/precision, lighting and raster visibility remain unresolved.

## One next action

Use the preserved census arrays to select and attribute the strongest eligible pair whose native sand coverage is exactly zero at both endpoints (sand gain exactly1), then validate its source context before proposing a correction. This is a source-only candidate selection criterion, not proof that the entire connecting segment is inland or visible. Preserve original dark/light cores, texture, protected regions and the earlier local correction. Do not rerun the unchanged full census or broaden the correction field.

No product mutation, GPU run, merge, deployment, publication or visual acceptance occurred. Chamber publication synchronization remains unverified; the authorized project continuation retains this evidence.
