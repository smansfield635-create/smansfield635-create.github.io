# Ground attachment qualification

Operation H_EARTH_GROUND_ATTACHMENT_20261025_001, admission generation 2891. Published comparison baseline: 7631fda70e7712eebc5598bd96276ca3553638db.

Walking now stays at local supporting ground plus the existing 2.25 metre eye height. Heading and distant view-clearance requirements cannot raise the observer. The existing local clearance guard rejects obstructed movement instead. Surface walking uses a 1:1 grade limit with a 0.04 metre seam allowance; cavern and portal traversal retain their tighter existing policy. Geometry and portal contracts are unchanged.

The active-geology browser comparison recorded 18.765551 metres maximum excess height in the predecessor and zero in the candidate heading grid. Six full turns at quarter-degree increments produced zero height change. Eighteen long routes completed across both directions and 120/60/30 Hz. Three uphill routes stopped on local clearance; their three reverse seeds were ineligible. Four additional exterior obstruction cases rejected movement while preserving the original state. These blocked cases are not successful traversals.

Preserved coverage includes paired surface/interior samples, 12 upper-surface traversals, portal round trips and refined crossings, side/back rejection, prior boundary regressions and six renderer receipts. See qualification.json and independent west-review.json for counts, exact identities and limitations. Supporting heights are checked independently against visible terrain or explicit geological support. The final production navigation blob is 3912671a7d6fe380a3605e33fd6547e2f672f319; all five index aliases bind it.

This is bounded desktop software-GPU evidence, not physical-phone acceptance or an exhaustive collision proof. Diagnostic seeds exercise navigation; normal drag-to-unlock and entry also succeeded. The owner's footage has no measured coordinates, so the numerical baseline is not a measurement of that video. The grade and seam allowances are walkability policy and can affect outcomes by step size.

Run the committed evidence/source checks from repository root:

    node --test h-earth-3d/evidence/ground-attachment-v1/*.test.mjs

To reproduce browser measurements, install puppeteer-core in an external test environment, provide CHROME_BIN, H_EARTH_CANDIDATE_ROOT (this checkout), and H_EARTH_ASSET_CACHE (an asset cache dedicated to baseline 7631fda70e7712eebc5598bd96276ca3553638db), then run replay.mjs. It starts a local server on port 8766 and fetches missing baseline assets. Inspect qualification.json failures and run the evidence checks afterward. Replay overwrites local measurement files. The renderer hook only exposes existing presentation for diagnostic receipts.

Roles: North coordinated the admitted scope and qualification; East designed and South implemented the navigation change through east_camera; West independently reviewed final source and evidence through west_camera. Independent review passed with documented limits.
