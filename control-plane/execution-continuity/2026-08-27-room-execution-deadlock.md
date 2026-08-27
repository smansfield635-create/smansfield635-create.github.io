# Room execution deadlock — 2026-08-27

## Disposition

`CONTROL_PLANE_EXECUTION_CONTINUITY_GAP_CONFIRMED`

The observed Audralia succession failures are not construction failures. They are routing failures in which executable work is assigned to rooms that do not possess an authorized native execution substrate.

The deadlock is:

`NO_LOCAL_REPOSITORY + NO_NATIVE_EXECUTOR + ACTIONS_PROHIBITED = CONSTRUCTION_IMPOSSIBLE`

## Durable conflict

`AI_ENTRYPOINT.json` is governing and prohibits GitHub Actions as AI agent execution transport. It requires native/non-Actions execution and fail-closed behavior when that surface is unavailable.

The shared procedure registry still contains `GITHUB_ACTIONS_FALLBACK`, which describes Actions as a backend when a local room cannot clone or run the repository. That procedure is stale for agent execution and must not override the AI entrypoint.

PR #2183 made the Audralia Gen1754 reproduction command deterministic, but its registered backend remained `GITHUB_ACTIONS_CLEAN_EXECUTION`. It therefore specified the command contract without supplying a currently authorized machine on which a room can execute it.

## Observed sequence

The compact succession checkpoint solved context hydration and room-crash amplification. Fresh rooms now recover the correct continuation state, find Hook 3, and then fail closed at the missing execution substrate. This is the correct current behavior and must not be treated as product drift.

Known evidence sequence:

- run `33049013195`: Actions executed but payload body was not durably returned;
- later Actions iterations repaired payload return and sparse materialization;
- run `33091711180`: reached the reproduction harness and timed out;
- after the Actions prohibition became governing, run `33094348910`: `NO_AUTHORIZED_BACKEND_AVAILABLE`;
- latest room: correctly recorded unavailable non-Actions substrate rather than dispatching Actions.

## New control-plane law

Before any executable hook is revealed or assigned, the room must possess a current `REPOSITORY_EXECUTION_CAPABILITY_RECEIPT_v1` bound to the exact governing head and operation.

A PASS requires all three conditions:

1. `REPOSITORY_MATERIALIZED = true`
2. `DEPENDENCIES_READY = true`
3. `COMMAND_EXECUTION_AVAILABLE = true`

and also:

`githubActionsUsedAsAgentExecutionTransport = false`

If any condition is false, the hook remains unrevealed/unassigned and the disposition is:

`EXECUTION_CAPABILITY_UNAVAILABLE_DO_NOT_REVEAL_EXECUTABLE_HOOK`

Repository connector read/write capability alone does not satisfy native execution capability. Historical successful Actions execution does not satisfy it. Prior-room success does not satisfy it.

## Required recovery order

1. Provision one genuinely available non-Actions native executor: authorized Codespace, disposable builder, or equivalent.
2. Materialize the exact governing and candidate commits.
3. Preinstall or make reproducibly available the locked Node/browser dependencies required by the declared command.
4. Issue `EXECUTION_CAPABILITY_READY` only after native command execution is proven available.
5. Reveal/assign the executable hook only after that receipt exists.
6. Rerun Audralia Hook 3 once against candidate `41a63ace8b540f2b3ce7f73b6395f90234c7dc3f`.
7. Accept only `CAUSAL_RUNTIME_PASS`, `FIRST_ASSERTION_CAPTURED`, or a fresh fail-closed infrastructure receipt.

## Precedence

For AI agent work:

`AI_ENTRYPOINT.json#/agentExecutionSurface` > shared backend suggestions.

`GITHUB_ACTIONS_FALLBACK` is therefore retired for AI agent execution. GitHub Actions remain eligible only for the roles explicitly allowed by `AI_ENTRYPOINT.json`: passive CI after repository change, historical evidence inspection, or separately authorized later replay.

## Scope boundary

This repair creates no Audralia product authority, no candidate mutation authority, no merge/deployment/release authority, and no Hook 4 authority. Its purpose is to prevent future rooms from being handed executable work before a real execution machine exists.
