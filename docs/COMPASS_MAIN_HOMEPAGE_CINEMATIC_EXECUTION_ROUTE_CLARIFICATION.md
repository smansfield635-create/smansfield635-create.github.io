# Compass Main Homepage Cinematic — Execution Route Clarification

Status: **CONTROLLING CLARIFICATION FOR V2 EXECUTION**  
Date: 2026-09-06

This clarification removes one specific ambiguity from the V2 documentation:

> **The V2 spine defines required evidence and proven deterministic semantics. It does not prescribe a default execution environment.**

Any wording in earlier V2 drafts or historical precedent that names an environment, workspace, builder, clone, CI carrier, or substrate is non-authoritative unless current `AI_ENTRYPOINT.json` explicitly registers that exact thing as the capability contract.

## Governing law

`REQUIRED_EVIDENCE → RESOLVE_CURRENT_AI_ENTRYPOINT → RESOLVE_CURRENTLY_AVAILABLE_AUTHORIZED_CAPABILITY → EXECUTE_IF_DIRECTLY_AVAILABLE → OTHERWISE_PRESERVE_EXACT_BOUNDARY_AND_STOP`

The route is capability-first, not environment-first.

Do not convert a missing capability into a recommendation to open, create, or move to a particular environment.

## Evidence target versus transport

Every D0/R0–R10 state names the evidence that must exist. That evidence requirement is authoritative.

Transport is selected dynamically from capabilities already authorized and actually available in the current room under current repository authority.

Historical transports prove solved semantics only. They are not standing instructions to recreate the historical transport.

A failure such as:

`Could not resolve host: github.com`

means only:

`CURRENT_ATTEMPT_COULD_NOT_ACQUIRE_REQUIRED_EXACT_HEAD`

It does **not** mean:

- use a particular hosted workspace;
- create a builder;
- create or dispatch a workflow;
- ask the owner to move files manually;
- redesign the verifier;
- bypass the verifier;
- infer PASS from passive CI.

## D0 — documentation adoption gate

Before V2 begins at R0, the controlling documentation candidate must be adopted to `main`.

For a `STATIC_EDITORIAL_MICRO` documentation candidate, D0 closes only when the exact repository-required static-editorial verifier returns PASS against the exact candidate and declared documentation paths.

Required result:

`D0_STATIC_EDITORIAL_VERIFIER_PASS`

The command identity/evidence contract is repository authority. The execution environment is not part of the cinematic strategy contract.

A room handling D0 must:

1. read current `AI_ENTRYPOINT.json`;
2. resolve exact current base and candidate heads;
3. resolve the current room's already-available authorized execution capabilities;
4. use an existing capability only if it can execute the required verifier against the exact repository state;
5. on PASS, proceed with normal adoption authority;
6. if no such capability exists, record the exact failure once and leave D0 unresolved.

Do not prescribe a specific environment as the next action. A later room resumes D0 and repeats capability resolution against whatever authorized tools actually exist there.

## Production states

The same rule governs capture, encode, binary ingress, qualification, and publication.

The spine preserves T9/T10, bounded-ingress, and publication precedent because they prove deterministic semantics. It must not be interpreted as requiring their historical carrier or any named environment.

If a direct authorized capability exists, use it. If it does not, stop on the evidence boundary. Do not turn transport selection into a new engineering project.

## Precedence

For execution-route questions:

1. current `AI_ENTRYPOINT.json`;
2. this clarification;
3. `COMPASS_MAIN_HOMEPAGE_CINEMATIC_V2_EXECUTION_SPINE_CURRENT.md`;
4. historical execution precedent.

This file changes no product, cinematic, MP4, player, hook, source-world, deployment, or publication state.