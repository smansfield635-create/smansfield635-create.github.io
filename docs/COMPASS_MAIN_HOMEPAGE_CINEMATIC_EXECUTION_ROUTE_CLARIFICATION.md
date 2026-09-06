# Compass Main Homepage Cinematic — Execution Route Clarification

Status: **CONTROLLING CLARIFICATION FOR V2 EXECUTION**  
Date: 2026-09-06

This clarification exists to remove one specific ambiguity from the V2 documentation: **the execution spine defines required evidence and proven semantics; it does not prescribe a default execution environment.**

Any wording elsewhere in the V2 documentation that names an example environment or substrate is non-authoritative and is superseded by this file.

## Governing law

`REQUIRED_EVIDENCE → RESOLVE CURRENT AI_ENTRYPOINT → RESOLVE CURRENTLY AVAILABLE AUTHORIZED CAPABILITY → EXECUTE IF DIRECTLY AVAILABLE → OTHERWISE PRESERVE EXACT BOUNDARY AND STOP`

The route is capability-first, not environment-first.

Do not convert a missing execution capability into a recommendation to open, create, or move to a particular environment.

In particular, a room must not default to any named remote workspace, disposable builder, local clone, workflow carrier, CI path, or newly invented bridge merely because a prior command could not acquire the repository.

## Evidence target versus transport

For every D0/R0–R10 state, the state definition names the **evidence that must exist**. That evidence requirement is authoritative.

The transport used to obtain it is selected dynamically from the capabilities already authorized and actually available in the current room under the current `AI_ENTRYPOINT.json`.

Transport examples from historical precedent are evidence of solved semantics only. They are not standing instructions to recreate the historical transport.

A failure such as:

`Could not resolve host: github.com`

means only:

`CURRENT_ATTEMPT_COULD_NOT_ACQUIRE_REQUIRED_EXACT_HEAD`

It does **not** mean:

- open a particular hosted workspace;
- create a disposable builder;
- create or dispatch a workflow;
- ask the owner to move files manually;
- redesign the verifier;
- bypass the verifier;
- infer PASS from passive CI.

## D0 — documentation adoption gate

Before V2 begins at R0, the controlling documentation candidate must be adopted to `main`.

For a `STATIC_EDITORIAL_MICRO` documentation candidate, D0 closes only when the exact repository-required static editorial verifier returns PASS against the exact candidate and declared documentation paths.

Required result:

`D0_STATIC_EDITORIAL_VERIFIER_PASS`

The command identity is repository authority; the execution environment is not part of the creative or V2 strategy contract.

A room handling D0 must:

1. read current `AI_ENTRYPOINT.json`;
2. resolve exact current base and candidate heads;
3. resolve the current room's already-available authorized execution capabilities;
4. use an existing capability only if it can execute the required verifier against the exact repository state;
5. on PASS, proceed with normal adoption authority;
6. if no such capability is available, record the exact failure once and leave D0 unresolved.

Do not prescribe a specific environment as the next action. The next room resumes D0 and performs the same capability resolution against whatever authorized tools are actually available there.

## V2 production states

The same rule applies to capture, encode, binary ingress, qualification, and publication.

The execution spine may preserve historical T9/T10, bounded-ingress, and publication procedures because they prove deterministic semantics. It must not be interpreted as requiring the historical carrier or any particular environment.

If the current room has a direct authorized capability, use it. If it does not, stop on the evidence boundary. Do not turn transport selection into a new engineering project.

## Precedence

For execution-route questions, precedence is:

1. current `AI_ENTRYPOINT.json`;
2. this clarification;
3. `COMPASS_MAIN_HOMEPAGE_CINEMATIC_V2_EXECUTION_SPINE_CURRENT.md`;
4. historical execution precedent.

This file changes no product, cinematic, MP4, player, hook, source-world, deployment, or publication state.