# DGB Productivity Receipt v1 — Calibration Record

Date: 2026-09-29

Status: CALIBRATION_IN_PROGRESS

## First executed receipt

Period: 2026-09-24 through 2026-09-25
Measured main head: `1af00c24e8af9f133d934a43c7a2f5ff43bfbf18`
Dispatch bridge run: `36636306282`
Measurement run: `36636348422`
Artifact id: `11064666887`
Artifact digest: `sha256:a9f10c4c7eb9e8c60cb11f7bb5af6bda7a6490b669457b3654f6e94c28332313`
Execution result: SUCCESS

Observed v1 receipt:
- commitCount: 212
- identifiedAutomationCount: 54
- meaningfulActivityCount: 158
- productSignals: 94
- qualificationSignals: 57
- repairSignals: 53
- governanceSignals: 127
- publicationClosureSignals: 73
- productShare: 0.5949
- qualificationDensity: 0.3608
- repairBurden: 0.3354
- governanceCost: 0.8038

Closed historical audit reference for Sep. 24–25:
- non-analytics activity/day: 169.5
- product signal share: 28.0%
- qualification signal share: 28.6%
- governance signal share: 62.2%
- repair signal share: 21.5%

## Calibration finding

The workflow, fixture verifier, measurement script, receipt verifier, artifact upload, capability registration, and AI-entry dispatch transport all function successfully.

The v1 lexical classifier is **not yet historically calibrated**. Its current implementation classifies against commit message plus every changed file path. Broad path terms such as assets, index.html, governance, receipt, evidence, and control-plane cause a single commit to acquire multiple signals more aggressively than the earlier historical audit classifier.

Therefore:
- execution qualification: PASS;
- schema/receipt qualification: PASS;
- historical classifier calibration: HOLD;
- recurring scheduling: NOT AUTHORIZED.

No historical baseline is revised from this first automated result.

## Required repair

Before v1 is qualified, align automated classification semantics with the closed audit methodology or explicitly version the new methodology and establish a fresh baseline. Prefer the former so the successor instrument remains comparable to the audit it succeeds.
