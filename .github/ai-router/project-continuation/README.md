# Repository-backed project continuation

This directory is the experimental shared continuity layer for three concurrent implementation lanes. It is repository memory, not project authority.

The governing rule is:

`CONVERSATION_MEMORY_OPTIONAL; REPOSITORY_CONTINUITY_MANDATORY.`

The three permanent device assignments are:

- S26 Ultra -> H-Earth product lane.
- A19 tablet -> instrument research / instrumentation platform lane.
- S25 Ultra -> contextual 3D orbital-layout work surrounding the Laws chamber.

A cold room starts at `AI_ENTRYPOINT.json`, follows `projectContinuation.strategyIndex`, resolves its device/lane, loads the lane manifest, then re-fetches live repository evidence before deriving a frontier. Other rooms are not continuity dependencies. A room may observe work performed elsewhere only through repository evidence such as the canonical operation ledger, commits, branches, pull requests, workflow runs, artifacts, registries, and command-emitted receipts.

The manifests deliberately contain no frozen next operation, generation, branch, or mutation. Any apparent frontier must be recomputed from live evidence. If live evidence is stale, contradictory, incomplete, multiply active without a unique lawful ordering, or inconsistent with the lane manifest, the room stops rather than guessing.

This layer grants no mutation, merge, deployment, product, semantic, scientific, standards-conformance, renderer, page, or lifecycle authority. Every mutation still requires canonical operation intake, moving-head successor handling when applicable, the repository router, and all narrower project gates resolved by the live project entrypoint.

The static verifier is:

```text
node .github/ai-router/project-continuation/verify.v1.mjs --verify-static
```

A successful static receipt proves only that the continuation metadata is internally fail-closed and discoverable. It does not prove that a device room recovered correctly. After merge, each of the three rooms must perform a repository-only cold recovery test against the then-current `main` and report its derived lawful frontier without a private room-to-room handoff before the installation can be terminally closed.
