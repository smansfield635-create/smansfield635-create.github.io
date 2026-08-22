# Admitted Operation Direct Construction Protocol

Status: repository-wide execution law.

## Purpose

Prevent an admitted operation from falling back into repository discovery after authority, governing source, scope, and exact mutation targets are already resolved.

The repository contains many valid breadcrumbs. They are useful during diagnosis and admission, but they must not remain equally actionable after admission. Once an operation is `ADMITTED_AND_LOCKED`, AI Entry compiles the operative facts into one `EXECUTION_PACKET_v1`. That packet becomes the constructor's local authority until construction completes, blocks, is superseded, or the governing head changes incompatibly.

## Governing state transition

`DISCOVERY -> DIAGNOSIS -> ADMISSION -> EXECUTION_PACKET_v1 -> DIRECT_CONSTRUCTION -> CANDIDATE_QUALIFICATION -> MERGE -> LIVE_QUALIFICATION -> TERMINAL_RECEIPT`

After `ADMITTED_AND_LOCKED`, generic discovery is not a valid next state.

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
- next required repository-visible event;
- candidate qualification command/workflow;
- live qualification manifest/receipt when applicable;
- timeout/watchdog policy;
- explicit tooling-block and moving-head exits.

## Direct Construction Mode

Direct Construction Mode begins immediately when all of the following are true:

1. admission result is `ADMITTED_AND_LOCKED`;
2. exact governing head is resolved;
3. allowed paths are fixed;
4. the diagnosis identifies the concrete mutation targets or the packet explicitly authorizes one bounded source read to locate them.

While Direct Construction Mode is active, the constructor MUST NOT perform generic web search, broad repository code search, architecture search, precedent search, workflow discovery, capability discovery, re-audit, or repeated source retrieval unless the packet explicitly authorizes that action or the actual write primitive fails.

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
- whether a write primitive was attempted;
- exact blocking reason if known;
- required recovery: `RESUME_EXACT_PACKET` or `EXECUTION_TOOLING_BLOCKED`.

The constructor must not silently continue research after timeout.

## Tooling block

If an authorized mutation cannot be performed because the available write primitive fails or cannot represent the required bounded change, stop with `EXECUTION_TOOLING_BLOCKED`. Only then may tooling/capability discovery resume, and it must be scoped to the failed write operation.

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
- `.github/ai-router/` — discovery, admission, packet compilation, and validation.
- `.github/execution-packets/active/` — currently authoritative admitted execution packets.
- `.github/execution-packets/archive/` — terminal/superseded packet records when retained.
- `.github/live-qualification/` — post-construction and post-merge acceptance instrumentation.

## Constructor rule

When an active packet exists, the constructor should be able to answer one question without searching the repository:

**What exact repository-visible action must happen next?**

If the packet cannot answer that question, the packet is incomplete and construction must not begin.