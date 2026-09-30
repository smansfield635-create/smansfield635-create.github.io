# Admitted Operation Direct Construction Protocol

Status: repository-wide execution law.

## Purpose

Prevent an admitted operation from falling back into repository discovery after authority, governing source, scope, exact mutation targets, and executable write transport are resolved.

The repository contains many valid breadcrumbs. They are useful during diagnosis and admission, but they must not remain equally actionable after admission. Once an operation is `ADMITTED_AND_LOCKED`, AI Entry compiles the operative facts into one `EXECUTION_PACKET_v1`. That packet becomes the constructor's local authority until construction completes, blocks, is superseded, or the governing head changes incompatibly.

## Governing state transition

`DISCOVERY -> DIAGNOSIS -> ADMISSION -> WRITE_TRANSPORT_BINDING -> EXECUTION_PACKET_v1 -> DIRECT_CONSTRUCTION -> CANDIDATE_QUALIFICATION -> MERGE -> LIVE_QUALIFICATION -> TERMINAL_RECEIPT`

After `ADMITTED_AND_LOCKED`, generic product discovery is not a valid next state. If write transport is not yet bound, the only valid activity is bounded transport binding or explicit handoff to a write-capable executor.

## Required execution packet

Every admitted operation that authorizes repository mutation must emit or materialize an `EXECUTION_PACKET_v1` containing at minimum:

- operation id and lock generation;
- exact governing head;
- exact allowed paths;
- exact prohibited paths;
- exact target symbols/functions/regions when known;
- exact required mutations;
- required source reads, normally one exact read per target;
- prohibited post-admission actions;
- exact write primitive/capability;
- target repository and branch;
- whether the primary transport supports the allowed path/file characteristics;
- an executable fallback transport;
- explicit handoff target when no write-capable executor is present;
- next required repository-visible event;
- candidate qualification command/workflow;
- live qualification manifest/receipt when applicable;
- timeout/watchdog policy;
- explicit transport-unbound, tooling-block, and moving-head exits.

## Write transport binding

Direct Construction Mode MUST NOT begin until an executable write transport is bound.

A bound transport must identify:

1. the concrete write primitive;
2. target repository;
3. target admitted branch;
4. support for every allowed path and required file size/type;
5. an executable fallback path if the primary write primitive fails;
6. a handoff target when the current executor itself cannot write.

If those conditions are not satisfied, disposition is:

`EXECUTION_TRANSPORT_UNBOUND`

The operation remains in `TRANSPORT_BINDING` mode and must not pretend construction has begun. Product architecture search, precedent search, broad repository search, and web search remain prohibited because the product problem is already resolved.

## Direct Construction Mode

Direct Construction Mode begins only when all of the following are true:

1. admission result is `ADMITTED_AND_LOCKED`;
2. exact governing head is resolved;
3. allowed paths are fixed;
4. diagnosis identifies the concrete mutation targets or the packet explicitly authorizes one bounded source read to locate them;
5. execution transport status is `BOUND` and can mutate the admitted branch.

While Direct Construction Mode is active, the constructor MUST NOT perform generic web search, broad repository code search, architecture search, precedent search, workflow discovery, capability discovery, re-audit, or repeated source retrieval unless the actual bound write primitive and its declared fallback both fail.

Historical documentation and prior implementations remain available for audit/reference, but they are not valid reasons to postpone the next required mutation.

## Repository-visible watchdog

The watchdog observes repository state, not conversational activity.

For surgical operations, the default construction deadline is 120 seconds from Direct Construction Mode entry to the first allowed-path branch mutation. A project may declare a longer deadline for genuinely large construction, but it must be explicit in the packet.

If the deadline expires without an allowed-path mutation, the operation must emit:

`DIRECT_CONSTRUCTION_TIMEOUT`

with:

- operation id;
- governing head;
- last successful state;
- bound write transport;
- whether the primary write primitive was attempted;
- whether fallback transport was attempted;
- exact blocking reason if known;
- required recovery: `RESUME_EXACT_PACKET`, `EXECUTION_TOOLING_BLOCKED`, or write-capable handoff.

The constructor must not silently continue research after timeout.

## Tooling block

If an authorized mutation cannot be performed because both the primary bound write primitive and the declared fallback cannot perform the bounded change, stop with `EXECUTION_TOOLING_BLOCKED`. Only then may tooling/capability discovery resume, and it must be scoped strictly to obtaining an executable write path or performing an explicit write-capable handoff.

## Moving-head rule

If `main` moves after admission:

- disjoint changes may use the existing differential-continuity protocol;
- overlapping allowed-path changes invalidate direct construction until successor admission or explicit rebase authority is obtained.

## Acceptance separation

Direct construction does not weaken qualification. It only removes redundant discovery before a candidate exists.

`PRODUCT MUTATION -> SMALL/BOUNDED DIFF -> PRE-MERGE GATES -> MERGE -> PUBLIC BYTE PROOF -> LIVE RUNTIME PROOF -> TERMINAL RECEIPT`

A passing product mutation is not a live pass. A clean diff is not a behavioral pass. Publication is not public-byte proof.

## Repository locations

- `docs/` — human-readable history, standards, and audit narrative.
- `.github/ai-router/` — discovery, admission, transport binding, packet compilation, and validation.
- `.github/execution-packets/active/` — currently authoritative admitted execution packets.
- `.github/execution-packets/archive/` — terminal/superseded packet records when retained.
- `.github/live-qualification/` — post-construction and post-merge acceptance instrumentation.

## Constructor rule

When an active packet exists, the constructor should be able to answer two questions without searching the repository:

1. **What exact repository-visible action must happen next?**
2. **What exact executable write transport will perform it?**

If the packet cannot answer both questions, it is incomplete and Direct Construction Mode must not begin.
