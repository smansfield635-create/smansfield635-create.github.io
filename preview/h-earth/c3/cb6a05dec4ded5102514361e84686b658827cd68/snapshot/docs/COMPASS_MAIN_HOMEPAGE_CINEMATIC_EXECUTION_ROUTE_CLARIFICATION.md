# Compass Main Homepage Cinematic — Execution Route Clarification

Status: **CONTROLLING CLARIFICATION FOR V2 EXECUTION**  
Date: 2026-09-06

This clarification governs how V2 evidence gates are executed and resumed.

It removes two ambiguities:

1. the V2 spine defines required evidence but does not prescribe a default execution environment;
2. no room may declare a blocker merely because no single tool can perform the entire evidence chain.

The reusable cross-video rule is also captured in:

`docs/DETACHED_CINEMATIC_VIDEO_REVIEW_AND_PROGRESSION_PROTOCOL.md`

## Governing execution law

`REQUIRED_EVIDENCE`
→ `CURRENT_AI_ENTRYPOINT`
→ `INVENTORY_ALREADY_AUTHORIZED_AVAILABLE_CAPABILITIES_BY_FUNCTION`
→ `COMPOSE_CAPABILITIES_IF_EXACT_IDENTITY_AND_CANONICAL_INSTRUMENT_SEMANTICS_ARE_PRESERVED`
→ `RUN_CANONICAL_INSTRUMENT_UNCHANGED`
→ `ACCEPT_ONLY_ACTUAL_RECEIPT/RESULT`
→ `STOP_ONLY_IF_NO_LAWFUL_COMPOSITION_CAN_CLOSE_THE_EVIDENCE`

The route is capability-first and composition-aware, not environment-first and not single-tool-first.

## Capability composition

A room must decompose the evidence task into functions before deciding capability is absent.

Functions may include:

- exact commit/tree/blob retrieval;
- exact compare/diff resolution;
- file or binary acquisition;
- local filesystem or Git-object materialization;
- command execution;
- browser/render execution;
- artifact inspection;
- repository mutation.

Different already-authorized tools may lawfully perform different functions.

A composition is valid only when:

1. every participating capability is already authorized for the function it performs;
2. immutable repository/object identities remain exact across handoffs;
3. materialized objects are hash/object-identity verified where applicable;
4. the repository's canonical verifier/instrument runs unchanged;
5. no PASS is inferred, emulated, synthesized, or substituted;
6. no new standing infrastructure, workflow, bridge, or authority is created.

## Proven D0 composition

The D0 closure that adopted the V2 documentation established one valid capability composition:

`CONNECTED GITHUB EXACT OBJECT RETRIEVAL`
→ `LOCAL EXACT GIT OBJECT MATERIALIZATION`
→ `OBJECT HASH VERIFICATION`
→ `RUN tools/static-editorial-micro-verifier.v1.mjs UNCHANGED`
→ `COMMAND-EMITTED PASS`

This is reusable precedent when the same capability split exists. It is not a prescribed workspace, substrate, or transport.

The important law is the composition, not the names of the tools used in that historical room.

## Acquisition failure interpretation

A failure such as:

`Could not resolve host: github.com`

means only:

`THAT_ACQUISITION_PATH_FAILED`

It does not prove:

- the exact Git objects cannot be acquired through another already-authorized capability;
- the verifier cannot run locally once exact objects are materialized;
- the room must move to a named environment;
- the room should create a builder/workflow/bridge;
- the evidence gate is globally blocked.

Before stopping, resolve whether one capability can retrieve exact objects while another can execute the canonical instrument.

## Stop condition

`RECORD_EXACT_BOUNDARY_AND_STOP` is valid only after:

1. exact required evidence is named;
2. current `AI_ENTRYPOINT.json` is read;
3. available authorized capabilities are inventoried by function;
4. lawful capability composition has been considered;
5. no composition can preserve required exact identity and canonical instrument semantics;
6. no later durable receipt already closes the state.

Do not stop on the first failed transport.

Do not invent infrastructure merely to avoid a legitimate stop.

## D0 — documentation adoption gate

D0 closes only on the exact repository-required static-editorial verifier PASS for the exact candidate and declared paths.

Required result:

`D0_STATIC_EDITORIAL_VERIFIER_PASS`

That result was obtained for the adopted V2 documentation candidate and merged to `main` at:

`34fb82ae090bb7e2f40d6cd4c79eaf35d26e26ea`

Therefore D0 is historical closed evidence for this V2 lineage. A cold room must not stop on an earlier D0 blocker comment.

## Superseding-evidence precedence

For all D0/R0–R10 states:

`LATEST_EXACT_SUPERSEDING_EVIDENCE > EARLIER_BLOCKER_OR_STOP_RECORD`

A room resolving state must:

1. identify the exact state and candidate/head;
2. inspect later durable comments/checkpoints/receipts for that same identity;
3. honor explicit `supersedes`, PASS, adoption, merge, publication, rollback, or other terminal state transitions;
4. reject later evidence that belongs to a different candidate unless it explicitly rebinds the state;
5. resume from the latest exact controlling evidence.

Example:

`D0_UNRESOLVED`
followed by an exact same-candidate
`D0_STATIC_EDITORIAL_VERIFIER_PASS`
means D0 is closed.

A new room must not stop on the stale D0 record merely because it appears earlier in the PR timeline.

## Production states

The same composition and supersession laws govern:

- source-authority proof;
- capture;
- frame-manifest verification;
- deterministic encode;
- binary ingress/custody;
- thin-player qualification;
- publication verification.

Historical T9/T10, bounded-ingress, and publication paths prove deterministic semantics. They do not require recreating historical transports.

## Precedence

For execution-route questions:

1. current `AI_ENTRYPOINT.json`;
2. this clarification;
3. `docs/DETACHED_CINEMATIC_VIDEO_REVIEW_AND_PROGRESSION_PROTOCOL.md` for reusable multi-video practice;
4. `COMPASS_MAIN_HOMEPAGE_CINEMATIC_V2_EXECUTION_SPINE_CURRENT.md`;
5. latest exact durable state receipts/checkpoints;
6. historical execution precedent.

This file changes no product, cinematic, MP4, player, hook, source-world, deployment, or publication state.
