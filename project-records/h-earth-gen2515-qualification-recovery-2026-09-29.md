# H-Earth Gen2515 qualification recovery — 2026-09-29

## Current product state

- Generation 2510: closed. Qualified vegetation population = 27,585 placements.
- Generation 2514: closed. Grounded vegetation geometry = 108 batches, 662,040 vertices, 331,020 triangles.
- Generation 2515: active qualification boundary.
- Exact H-Earth candidate remains `6fa5041082a1133accb2cabbd0072e193c181ea9`.
- No Gen2515 product assertion has failed in the executions recorded here.

## Active verifier

- Tooling head: `17c781fc2ff6d4157cffbe50cc712289afa8c839`.
- Descriptor: `H_EARTH_GEN2515_RENDER_PACKAGE_QUALIFICATION_DESCRIPTOR_V1`.
- Verifier: `tools/ai-room-transport/h-earth-gen2515-render-package-qualification.v1.mjs`.
- Expected terminal success: `GEN2515_RENDER_PACKAGE_CANDIDATE_PASS`.
- On a genuine product failure, return the first exact Gen2515 assertion and stop.

## Failed adequately-intended execution

- Dispatch carrier PR: #5225.
- Carrier head: `37a616c0e5c6da502b7de97731e80aa267b2b62a`.
- Bridge run: `36596121283` — success.
- Dispatched qualification run: `36596142359` — failed.
- The registered command ran for about nine minutes, then V8 failed near the ordinary ~4 GB heap ceiling:
  - Mark-Compact around 4040–4042 MB.
  - `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`.
- No Gen2515 assertion failed before the OOM.

## Deterministic trace result

The intended 12 GB setting did not reach the actual verifier Node process.

The verifier file begins with:

`#!/usr/bin/env -S node --max-old-space-size=12288`

But the authorized registry invokes it as:

`node tools/ai-room-transport/h-earth-gen2515-render-package-qualification.v1.mjs ...`

That explicit `node` invocation bypasses the verifier shebang. The fixed-command dispatcher uses `safeEnvironment()`, which can forward an existing `NODE_OPTIONS`, but run `36596142359` entered the dispatcher without such an override. The descriptor also correctly keeps `environmentOverridesAllowed: false`.

Therefore this is an execution-harness propagation defect, not an H-Earth product defect.

## Bounded repair

PR #5226 contains the narrow repair.

- Branch: `repair/gen2515-fixed-node-heap-20260929`
- Repair commit: `571cefbbbf32716063d3e808e51987ecda1f5808`
- Changed path only: `.github/ai-toolset-transport/authorized-toolset-registry.v1.json`
- Gen2515 descriptor change:
  - before: `"fixedArguments": []`
  - after: `"fixedArguments": ["--max-old-space-size=12288"]`
- No H-Earth product file changed.
- No candidate logic or Gen2515 assertion changed.
- No dispatcher environment policy was weakened.

This causes the registered fixed command to become:

`node --max-old-space-size=12288 tools/ai-room-transport/h-earth-gen2515-render-package-qualification.v1.mjs ...`

which places the heap flag on the actual Node process that performs package construction.

## Next deterministic boundary

1. Qualify and adopt the bounded registry repair from PR #5226 through the existing governed path.
2. Re-dispatch the identical Gen2515 request against candidate `6fa5041082a1133accb2cabbd0072e193c181ea9` using tooling head `17c781fc2ff6d4157cffbe50cc712289afa8c839`.
3. Do not rebuild Gen2510 or Gen2514.
4. Do not mutate the H-Earth product unless the adequately resourced verifier returns a genuine first Gen2515 assertion failure.
5. If it passes, persist the qualification receipt to #5086, update the H-Earth continuation reached from `AI_ENTRYPOINT.json`, and determine the existing Gen2515 closure procedure. Merge, deployment, release, and publication remain separate authorities.
