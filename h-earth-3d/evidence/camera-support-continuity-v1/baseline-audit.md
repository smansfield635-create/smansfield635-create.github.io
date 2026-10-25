# H-Earth elevation camera audit — 2026-10-25

## Outcome

A shared support-boundary defect is reproduced in the published camera source. A 0.05-metre movement across the northern geological boundary can change camera height by 17.818 metres while local ground changes by -0.0329 metres. Actual navigation accepts the transition in both directions. Renderer submission receipts retain the large height difference.

No product source was changed or published by this audit.

## Baseline and method

- Source: smansfield635-create/smansfield635-create.github.io at 7617b4b01e75890358cd23d49353fea4d3b45f16.
- Local source-pinned browser with the real geological support bridge installed, and the same query-qualified module instances as the scene.
- Domain bounds: x [-256,256], z [-400,-80]. Survey traverses x [-248,248], z [-392,-88]; it does not exhaust every coordinate or edge.
- 204 bidirectional routes, 2-metre steps; fixed-position turn samples at 15 degrees. Together 44,596 valid adjacent comparisons and 452 invalid adjacent comparisons.
- Largest movement cases refined to 0.05-metre increments.
- 48 actual navigation proposal cases: six crossing/control pairs, four headings, both directions. All accepted. Existing render function exposed diagnostically, without changing navigation or renderer formulas.
- Browser uses desktop software GPU, not phone touch timing. Submitted camera coordinates undergo the existing render coordinate conversion and differ slightly from navigation coordinates.

## Confirmed examples

| Crossing | Movement | Maximum absolute camera height change across tested headings | Ground change forward |
| --- | --- | --- | --- |
| Northern mountain, x=88, z=-260.05 to -260 | 0.05 m | 17.8181 m | -0.0329 m |
| Northern foothill, x=24, z=-260.05 to -260 | 0.05 m | 12.6728 m | +0.2452 m |
| Eastern boundary, x=95.95 to96.05,z=-300 | 0.10 m | 0.5057 m | -0.1232 m |
| Western boundary, x=-120.05 to-119.95,z=-300 | 0.10 m | 0.2641 m | +0.1195 m |
| Cave portal, x=40,z=-260.05 to-259.95 | 0.10 m | 0.0013 m | +0.0013 m |
| Flat control, x=0,z=-110 to-109.95 | 0.05 m | 0.0112 m | -0.0112 m |

## Shared cause and qualification gap

Ordinary terrain uses a yaw-dependent forward-looking clearance envelope. Geological exterior support uses local ground/water height plus eye height. The resolver switches directly between these height rules at the support boundary. The navigation sweep does not reject the reproduced exterior/ordinary height discontinuity. Pitch remains fixed in these cases.

Earlier gen323 qualification explicitly excluded active geological formation support from its detached module survey. Its passing result therefore did not cover this failure class.

Coarse survey changes above one metre are not automatically bugs: slope and 15-degree yaw samples can produce legitimate differences. A turn case changed camera height by 5.897 metres at fixed ground over15 degrees; finer angular and actual-input verification remains necessary before classifying it as a discontinuity. The user video has no coordinate telemetry, so this audit establishes the same class of abrupt height change, not identity with the video's exact location.

## Deterministic correction and qualification

1. Admit a shared camera-support correction covering navigation and clearance code; the old gen323 scope did not authorize navigation.js changes.
2. Reconcile physical ground clearance and optional forward-looking camera lift consistently across support regions. Preserve cave headroom, water rules, terrain geometry, and collision safety. Avoid blanket interpolation that could move the camera through terrain.
3. Replay these routes and refined boundary cases on the candidate with geological support active. Add small-angle turn sweeps and actual movement/turn input sequences at multiple time steps, including reversals and rapid gestures.
4. Record accepted navigation state and displayed-frame camera position separately, plus ground, support class, pitch and clearance. Set explicit continuity and safety bounds before qualification.
5. Require zero support-switch discontinuities, no terrain penetration or cave regression, and unchanged flat-ground behavior within the chosen tolerances. Preserve exact-source receipts and publish through the established qualification path.

## Included evidence

elevation-audit.json contains grouped measurements, worst cases and refined samples. navigation-verification.json contains actual proposals and submitted-frame receipts. run-audit.mjs, verify-navigation.mjs and serve.py reproduce the diagnostic on the pinned source; adjust machine-specific workspace and Chrome paths. Install puppeteer-core from the included package lock. serve.py fetches pinned source assets on demand; the cache and browser binaries are intentionally omitted.
