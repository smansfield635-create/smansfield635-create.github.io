# Audralia Open-World Spatial Migration — Continuity Instrument

This subtree is the durable cross-room source of truth for the H-Earth / Audralia open-world spatial migration. It is nonproduct instrumentation. It does not itself authorize terrain, runtime, traversal, deployment, or release mutation.

## Mandatory read order

Any room, model, agent, verifier, or successor entering this work must read, in order:

1. repository-root `AI_ENTRYPOINT.json` and `AGENTS.md`;
2. `h-earth-3d/AGENTS.md`;
3. `instrument.locator.v1.json`;
4. `authority-and-lineage.v1.json`;
5. `spatial-invariants.v1.json`;
6. `checkpoint-registry.v1.json`;
7. `continuity-state.v1.json`;
8. `successor-room-recovery.v1.json`;
9. `verification-contract.v1.json`.

Repository-resident state outranks room-private conversation state. A conversation, memory, summary, screenshot, or hand-written receipt is never sufficient authority to advance a checkpoint.

## Governing construct

`MIRRORLAND -> AUDRALIA -> 9 CONTINENTS -> GRATITUDE CONTINENT -> GRATITUDE ENTRY REGION -> CURRENT HIGH-RESOLUTION GRATITUDE BAY DEVELOPMENT FOOTPRINT`

H-Earth is the player-facing experience on Audralia, not a separate planet. The Nine Summits experience is internal to Gratitude and must never be mapped one-to-one onto the nine continents.

The current detailed Gratitude terrain is a development footprint, not a world boundary. Its local scale must not be compressed to fit a planetary view. Gratitude Harbor must bind to a true continental coast. The mountain and watershed system must continue inland beyond the current high-resolution footprint. Final continental morphology must be organic and compound rather than a radial blob.

## Checkpoint discipline

- Advance only the checkpoint identified by `continuity-state.v1.json`, unless a fresh admitted operation explicitly supersedes it.
- Every checkpoint mutation requires a fresh canonical repository-operation admission for its exact paths and current governing head.
- Before handoff, update durable checkpoint/state evidence under that admitted operation.
- A room may collapse, be replaced, or lose context without changing project truth; the next room recovers from this instrument.
- Any checkpoint that changes the live player experience remains open until the required user differential is recorded. Automated verification cannot substitute for user differential.
- Full-file replacements are required for files in this instrument. Do not perform partial or surgical edits.

## Traversal requirement

The spatial migration is incomplete unless downstream live integration materially expands traversal from the game's starting point. `STARTING_POINT_TRAVERSAL_RANGE_EXPANSION = REQUIRED`. Temporary development frontiers are permitted; permanent rectangular world boundaries are not.

## Review evidence

User-supplied screenshots and videos are review evidence. They do not authorize image generation or editing. Generative image tooling must not be invoked unless the user explicitly requests image generation or image editing.

## Authority boundary

This instrument may define invariants, checkpoint order, recovery, evidence requirements, and verification. It grants no inherited implementation authority. Product/runtime/terrain/live traversal work always requires its own fresh admitted operation.
