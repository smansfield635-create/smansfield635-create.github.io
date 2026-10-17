# Completed continuity replay capture — Gen2787

Operation: H_EARTH_CONTINUITY_CAPTURE_REPAIR_20261017_001. Admitted native canonical lock commit 32c1957267d59d7bbbaff1f64b766bb722210bd9; current sole-ledger blob 2eda612b658692229492563829b8132f29e18f47 independently read back with Gen2787 ADMITTED_LOCKED. Owner request: issue6426 comment6229559223. The earlier hosted intake returned INPUT_INCOMPLETE_NOT_STARTED; the subsequent native admission is preserved separately, not inferred from that failed transport.

Base main: f0fe69232f5249f8f5c7ca15a2b87c983ffeb3ae. Three admitted tooling/evidence paths only. All product files remain identical to this base. Product candidate PR6455 ab3d31795dd3ec51f75dc2e429a9b8627fdf1239 and source-preflight repair PR6456 910a362a7380c15c8222b3e292c8787e14ff3571 remain separately preserved.

## Defect and repair

The existing runner recognizes active GPU/startup readiness before the selected continuity replay finishes. It could close Chromium after the initial/later snapshots without waiting for the terminal walking receipt.

Only qualification=vegetation-continuity-v1 enters the new capture path. It requires vegetation-trace=v1, waits at most600000ms for a terminal replay object, then obtains the actual replay, final canvas hash, full live renderer receipt and bounded frame timing before browser close. Timeout, failed/missing replay, incomplete or reordered forward/return steps, disabled trace, no movement/cache crossing, missing rendered frame evidence and disagreement between final runtime evidence and replay all fail capture. The JSON receipt is written before this failure sets the process exit code. A concurrent manual residency exercise is rejected because it changes the observation window. Ordinary routes perform no new continuity browser operations.

Frame timings are browser requestAnimationFrame intervals, not GPU duration or Android performance. At most2048 intervals are retained for quantiles, explicitly the first2048; count/sum/maximum aggregate the entire wait. Final existing renderer counters, upload telemetry and trace events are retained in the final live receipt. Diagnostic trace drops and observer limitations remain visible. Capture completion never means visual acceptance or publication approval.

## Verification

31 independent West tests pass, zero failures/skips, extracting the actual workflow helper functions and exercising completed/missing/failed/timeout evidence, route order, final consistency and default-route isolation. North/East independent source review passes. The complete embedded Node browser script passes node --check. These are tooling/source checks, not hosted browser evidence.

Command: node --test h-earth-3d/validation/h-earth.continuity-capture.v1.test.mjs

## Execution boundary and next action

The registered H_EARTH_NEUTRAL_EXACT_HEAD_RUN capability fixes workflow ref to main. target_sha selects checked-out product bytes, not the workflow definition. Therefore this draft cannot execute as the repaired hosted runner before separately authorized tooling adoption. Current Gen2787 admission explicitly forbids merge, deployment and publication. No workflow ref override, alternate transport, production deployment, or new registry is introduced.

Next: obtain bounded tooling-adoption authority for this exact reviewed draft, adopt only these paths, then use the existing registered runner against preserved preflight candidate910a362a7380c15c8222b3e292c8787e14ff3571 with vegetation-trace=v1&qualification=vegetation-continuity-v1 and exercise_vegetation_residency=false. End the room turn after dispatch, saving the run ID; inspect its artifact in a subsequent turn. A hosted diagnostic capture still does not establish owner/device visual acceptance. Prior release closures stay complete.

Known unchanged limitation: navigation/initial-sampling exceptions outside the repaired capture helper retain the baseline exception behavior and may bypass final receipt construction. This candidate does not claim universal runner crash recovery.
