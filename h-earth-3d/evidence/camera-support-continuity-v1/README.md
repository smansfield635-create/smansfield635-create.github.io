# Camera support continuity — generation 2888

Operation: `H_EARTH_CAMERA_SUPPORT_CONTINUITY_20261025_001`.
Base: `8da1b0cd0fbae0799b111bd95c2beed0ba84df99`.
Admission: issue 6783, comment 6400966680; workflow 40217703471.

The previous audit reproduced 17.818 m and 12.673 m jumps when a small movement changed which camera-height rule applied. Geological exterior used local ground plus eye height; ordinary terrain used a forward-looking clearance envelope.

The candidate applies a common exterior envelope, sampling the actual geological ground/water replacement where installed. A 2 m inward collar makes only its optional view reference continuous at resident mesh seams. The actual physical ground remains unmodified and clamps camera height independently. The existing specialized cave floor, walls and headroom remain controlling indoors.

The far-view allowance is suppressed around the finite cave collision domain before its footprint can intersect the roof/void. It returns smoothly over the existing 12 m approach scale. A local 17-point physical support guard remains hard in this area. Only an exact-rim missing-triangle query may use the highest eligible physical neighbor within 20 micrometres; interior collision failures are never overridden. Sweeps now compare their first sample with the starting support.

## Evidence and limits

- `baseline-audit.json`, `baseline-navigation.json`: preserved original active-geology audit and 48 submitted-camera cases.
- `candidate3-survey.json`: 204 routes / 44,596 comparisons after the common-height, bounded cave and optional-reference corrections. The final delta only repairs missing nearby-guard samples at the exact rim; targeted tests are rerun for that delta.
- `qualification.json`: final exact-source refined crossings, real movement/reversal sequences at 120/60/30 Hz increments, fine turns, local support/headroom checks, and 75 exact ordinary-ground comparisons.
- `navigation-verification.json`: final actual scene camera submissions for the original 48 crossing cases. The harness exposes the existing `present` function diagnostically; it does not replace renderer or navigation formulas.
- `source-manifest.json`: exact source digests. 334 cached code dependencies matched the admitted main tree before replay.

Refined crossings use 0.05, 0.01, 0.002 and 0.0004 m offsets on each side. A camera change must tend below 1 cm, or be a same-direction physical-ground step below 25 cm with no amplification beyond 1 cm. This admits the mathematical effect of clamping a continuous reference against an existing stepped physical floor. It cannot excuse a large rule-switch jump. The underlying mesh has approximately 12–21 cm seams at some boundaries; this operation does not alter terrain.

Movement rejection is compared against the original navigation using the same installed geological support. Original missing-support failures remain recorded, not called successful traversal. Fine turns must stay below 0.2 m per 0.25 degrees at the selected sites; real movement increments must stay below 0.6 m. Coarse 2 m terrain and 15-degree turn survey changes are not automatically discontinuities.

This is desktop Chromium with software WebGL. It establishes neither physical phone responsiveness nor an exhaustive collision proof. The local guard is sampled protection. It does not claim all possible world coordinates, slopes or camera framing are ideal.

## Replay

Install `puppeteer-core` in an external test environment, then set:

- `CHROME_BIN`: Chromium executable.
- `H_EARTH_CANDIDATE_ROOT`: exact candidate checkout.
- `H_EARTH_ASSET_CACHE`: source-pinned asset cache (all unmodified cached code must match the manifest's base).

Run `node replay.mjs` from this directory. It starts the local source server, loads the actual scene, performs the normal drag-to-unlock entry check, submits the crossing cameras, and writes measurements. Missing assets are fetched from the pinned base. Run `node --test h-earth-3d/evidence/camera-support-continuity-v1/*.test.mjs` from repository root to validate the saved measurement and exact source bindings.

Publication remains separate: qualified candidate, guarded merge, registered exact-head Pages deployment, then live release verification.
