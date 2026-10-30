# H-Earth Gen3000 — source-derived steep-side camera shortlist

**Disposition: CPU_SOURCE_CAMERA_HYPOTHESES_PASS; CURRENT_GPU_VISIBILITY_AND_OWNER_PHOTO_MATCH_HELD** (October 30, 2026). This is an evidence-only continuation of the authenticated Gen3000 evaluator branch, not a new GPU run, new canonical capture admission, altered product, owner visual approval, merge, or release.

## Frozen identities and exclusions

- Frozen current product candidate: `3ea149e5b56e8cc0d5aac192bce0cdd47da7e626`; original published source reference `cb57c275b95d0d48883bc4da4dcfcf17cbec5060`.
- Original archived 141,373-vertex, 366,666-index source package and 20,736 original near-terrain triangles in `/H-Earth/H-Earth-corrected-material-application-20261029.zip`; archive SHA256 `5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c`. Native position/index hash checks are enforced by the reproducer.
- Previous x=88,z=-260,yaw118,pitch-13 historical mountain camera is excluded. Its conspicuous diagonal was shown to cross a foreground/background depth-ownership edge, **not** establish a continuous-surface tan/olive material discontinuity. Previous Gen2998 capture x=-189,z=-724 is geographically inapplicable to these foothill sources.
- Owner's October 28 phone images `30106.jpg` (straight ground partition) and `30108.jpg` (curved/wedge material border) have no proven camera telemetry. **None** of the following three views is claimed to match those photographs or to reproduce the defects.

## Reproducible three-pose plan

Each candidate camera is an *original-source* 1.65 m eye-height observer, using the navigation yaw convention `dir=(sin(yaw)*cos(pitch), sin(pitch), -cos(yaw)*cos(pitch))`, 56° vertical FOV, and a 529×980 phone-like viewport. Each target is 1 m above a native source-sampled surface. Camera/target X coordinates are all >100 (outside the x≤96 Site B geological region), and Z is near the underdeveloped steep foothills, not the protected short-foothill meadow. All line-of-sight clearances below are 39-sample **CPU original-mesh** elevations, not GPU depth ownership.

| ID | Camera (X,Y,Z) | Yaw° | Pitch° | Target X,Z | Target Y | Source slope | Minimum sampled clearance |
|---|---|---:|---:|---|---:|---:|---:|
| west_flank | (110, 8.346906, -310) | 153.4349 | +20.2645 | (145,-240) | 36.241942 | 0.370 | 2.397 m |
| central_approach | (150, 6.664072, -318) | 183.6678 | +21.3665 | (145,-240) | 36.241942 | 0.370 | 2.369 m |
| east_oblique | (210, 6.979883, -310) | 199.6538 | +11.1038 | (185,-240) | 20.568022 | 0.278 | 1.999 m |

All three target samples have positive source slopes and geometrically clear source-interpolated centerline sight. They span two surface regions from three headings; this is **coverage planning**, not source-verified visual defect selection, nor an inference that the owner images were shot from these positions. Real production has generated geometry/depth/vegetation and must be independently tested in the current candidate world packet before any claim of visibility or travel eligibility.

## Test and reproduction

Input archive must remain byte-identical. From this folder with NumPy and SciPy installed:

```bash
python steep_side_camera_plan.py --archive /path/to/H-Earth-corrected-material-application-20261029.zip --output /tmp/steep_camera_plan.json
python -m unittest -v test_steep_side_camera_plan.py
```

The attached `test_steep_side_camera_plan.py` runs eight deterministic tests on the verified local archive. The unit-test source path uses a fixed local input location for this executed evidence environment, and will require corresponding staging when run elsewhere. The source-only executable rejects mismatched archive/position/index hashes, missing terrain triangles, an occluded centerline, and disallowed historical camera reuse. It never edits source product or invokes WebGL/GPU.

## Next lawful execution boundary

1. **New canonical diagnostic admission, not inherited from Gen3000.** Select a registered exact-current-head read-only capture capability after validating source/asset/head/runner identities. First prove each camera's true current scene eye height, visible depth/primitive/role, and actual rendered geographic support. Any incompatible camera must be rejected or source-corrected *before* the expensive render.
2. Capture a minimal exploratory set of current-candidate grass-visible lit images at these **source hypotheses**, plus already preserved meadow/coast controls. Require observable *same-visible-surface* straight or curved bare-ground border before further modes. Do not use source-only analytic peaks, the old occluding ridge, or a live-source-camera guess as a substitute for that visible acceptance target.
3. Only once a real defect is visible and world-registered: collect target-pair depth, native primitive/role, pre/post-worldsoil, identity, groundcover, habitat, normals and lighting. Reject any pair that crosses different visible depth-owner surfaces. Distinguish both owner defect classes separately.
4. Only after a causal source expression and genuinely geographically relevant candidate are established seek a separately authorized bounded renderer repair and frozen-pose baseline/candidate GPU qualification. Preserve trees, grass, soft meadow, coast, terrain height and approved color variation. Owner KEEP/ONE_REPAIR/REJECT remains a later perceptual gate.

**No new GPU job, runtime mutation, workflow dispatch, merge, or publication occurred for this source shortlist.** The recorded camera Y is from the preserved **original** terrain package, not an independently checked current candidate navigation state.