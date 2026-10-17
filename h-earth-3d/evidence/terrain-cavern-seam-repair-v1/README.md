# Gen2797 cavern threshold and full terrain perimeter — construction checkpoint

Operation: `H_EARTH_TERRAIN_CAVERN_SEAM_REPAIR_20261017_001`, generation2797.
Governing base: `18743dc582bfa0186e3b0ea19ddf5d1f8f53025a`.
Admission: issue6426/comment6242458566; lock commit `b24806fa16752f43086fcae08378394beeb7f30b`.
Published performance predecessor: `21682d6dda329d0dfe89a969d48093c349eb187f`.

## Cause and bounded repair

Actual first kernel ring has a broad floor. Before repair, the exterior field
at x38/z-260 is12.2747185m versus actual cave floor11.2878022m; at x42 it is
12.3347862m versus11.3453373m. The2m exterior mesh additionally interpolates
above unequal floor breakpoints. Forty lower threshold triangles close that
height difference, concealing the broad entrance floor and making a point.

Only the consumer bridge changes: the exterior12m approach blends to the
existing emitted ring's lower chain, with a3m shoulder transition. Front-row
boundary triangles split at every actual ring x breakpoint. Existing contact
generation consequently emits zero lower-cap triangles. The entire swept
gallery, upper mantle and kernels remain unchanged. Navigation samples the
same final projected exterior triangles and unchanged kernel floor/roof.

This is not an aesthetic acceptance result or a repair of all dark interior
appearance. Terrain perimeter/material continuity now has the additional
source correction below. River-corridor expansion remains separately
queued per owner evidence comment6242535155; no density expansion is included.

## Executed source/geometry qualification

Command:

```sh
node --test h-earth-3d/validation/h-earth.terrain-cavern-seam-repair.v1.test.mjs h-earth-3d/validation/h-earth.run8e-geology-integration.v1.test.mjs
```

Initial cavern checkpoint combined result24/25: geometry tests4/4PASS, existing integration
20/21PASS. One pre-existing assertion fails at integration test line161:
`assert(html.includes("parameters.get('arrival') === 'geological-cavern'"))`.
That historical coast-default copy assertion inspects unchanged published
index.html. Neither HTML nor the existing test changed. The published route
already uses the approved woodland entry. Do not report the whole suite passing
or restore old public behavior to satisfy this assertion. Independent W reviewed
this exact disjoint dependency; canonical failure classifier with observation
ROOM_LOCAL_EXECUTION/dependency NONE returns ADVISORY_NONBLOCKING,
ADVISORY_CONTINUE, reason DEPENDENCY_DISJOINT. No suite failure was hidden.

Measured new tests:

-140 independent emitted-triangle contact samples between every ring/grid
  breakpoint; maximum mismatch0.0000004211674m.
-909 actual support samples over9 traversal lanes across the mouth, tested
  forward/reverse; maximum height change per0.05m step0.005243933m.
-Minimum interior headroom4.015372502m in those tested lanes.
-No reversed/collapsed exterior triangles; unchanged approach-outside controls.
-Complete gallery geometry SHA256
  `708f8c281da7af1d520355e81e4462edb3f31384d508bcbfe26b0888567bf1bd`.
-Upper mantle geometry SHA256
  `b51280de6f32ad82ed78dc413f2e512e82a234aebaea7367e09754710c6158c0`.
-Canonical compressed world SHA256
  `48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a`.

Independent W working-source/test review found no blocker; immutable remote
readback follows this commit. Completed performance cache, scheduling, loader,
approved trees, world, route and population-generation source bytes are retained.
Approach vegetation contacts may adapt to the corrected shared support as
explicitly allowed; no new full-population benchmark is claimed.

## Pending exact-candidate work

Same-camera browser/pixel review from outside and inside, genuine traversal
presentation, and experience-anchor acceptance remain pending. No visual/device
PASS, visually completed terrain-border repair, merge, deployment or live release claimed.
Do not repeat admission or performance implementation.

## Full-perimeter attribute correction

The prior renderer faded only linear RGB toward original land at the patch
boundary. It still uploaded independently recomputed normals, constant material
parameters and coast/contact distances of140. The land's shared fragment shader
uses these other fields for slope, lighting and coastal presentation, explaining
why a color blend alone did not reconcile the long border and its corners.

The bridge now exposes its indexed original-terrain contact (source vertex IDs
and barycentric weights). Startup reconciliation takes the ACTUAL upload views,
including projected/canonicalized material and normal buffers and the actual
coast/contact buffers. It blends raw normals, all RGBA, all four material
channels, coast distance and contact distance through the existing12m rim.
Normals are not normalized before upload: fragment normalization remains in its
original place. All four edges and corners use the same rule. Interior vertices
at least12m inside and cavern/cliff/water attributes remain untouched. Terrain
role1 and sentinel IDs remain unchanged; W confirmed the categorical identity
signal is not consumed by that terrain shading path. No shader, geometry,
navigation, world, population, density, loader, cache or scheduler delta.

New measured qualification:6/6 testsPASS; existing integration20/21PASS;
combined26/27, retaining the same unchanged line161 historical copy assertion.
All368 emitted perimeter vertices across4sides/4corners match independently
located canonical triangle attributes within3.763978e-6 maximum absolute error.
Coast/contact interpolation is exercised with distinct synthetic stress fields;
those fields do not claim observed shoreline or actual GPU contact accuracy.
5520between-vertex diagnostic samples additionally compare emitted linear
interpolation to source contact interpolation: maximum raw-normal2.781622e-7,
RGBA6.165715e-8, material1.402681e-7, stress coast1.930229e-5,
stress contact8.039419e-5. This diagnostic reuses the source contact sampler;
the vertex oracle independently searches indexed terrain triangles.

These are CPU attribute/geometry proofs, not pixel or normal-derivative proofs.
Inverse authoring-space interpolation follows the existing terrain sampler;
exact GPU raster correspondence and derivative-sensitive material presentation
still require real same-camera browser review around all sides/corners and the
cavern approach/interior. Full gallery/upper-mantle hashes remain identical.
Independent W source review found no wiring/scope blocker and explicitly retained
these visual limitations. Source syntax and whitespace checks pass.

Local browser boundary: Playwright is installed, Chromium is absent. Its current
browser installer returned an invalid/truncated archive (reported0MiB), so no
local WebGL or screenshot execution occurred. Preserve this source candidate;
do not call that execution-surface failure a product failure, retry the same
download, or deploy production as a preview workaround. The registered neutral
runner exists but its existing root captures are not a full-perimeter/same-camera
acceptance harness; no irrelevant or duplicate run was launched.

One next action: execute bounded exact-candidate browser qualification for the
cavern and full perimeter using a lawful Chromium/WebGL-capable substrate, then
finish source-bound experience-anchor acceptance and the authorized release
sequence only on the required evidence. Keep Gen2797 active for bounded repair.
River-corridor extension remains separately queued, per owner comment6242535155;
the endpoint/horizon intent must be reconciled before any expansion writes.
