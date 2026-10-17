# Gen2797 cavern threshold — bounded construction checkpoint

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
appearance. Terrain perimeter/material continuity is the next separate step
inside the existing operation. River-corridor expansion remains separately
queued per owner evidence comment6242535155; no density expansion is included.

## Executed source/geometry qualification

Command:

```sh
node --test h-earth-3d/validation/h-earth.terrain-cavern-seam-repair.v1.test.mjs h-earth-3d/validation/h-earth.run8e-geology-integration.v1.test.mjs
```

Actual combined result24/25: new geometry tests4/4PASS, existing integration
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
PASS, completed terrain-border repair, merge, deployment or live release claimed.
Do not repeat admission or performance implementation. Preserve this candidate
before proceeding with the next terrain-border delta under the existing scope.
