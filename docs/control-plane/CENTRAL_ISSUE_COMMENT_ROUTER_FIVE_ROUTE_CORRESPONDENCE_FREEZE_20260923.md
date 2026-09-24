# Central Issue Comment Router — Five-Route Correspondence Freeze

Status: READ_ONLY_AUDIT_FREEZE / NO_PRODUCTION_MUTATION_AUTHORITY
Date: 2026-09-23
Repository: smansfield635-create/smansfield635-create.github.io
Audited main: 4e6f94a422ef564c1316d1122759eab61dac4587

## Purpose

Freeze the finite Central Issue Comment Router migration-correspondence defect before any production repair.

This document creates no mutation, admission, merge, deployment, publication, product, semantic, scientific, or cross-repository authority.

## Exact audited identities

- .github/ai-router/issue-comment-router-registry.v1.json
  blob 945ae5a664f17078ad87d6234d421af1403eef7d
- .github/workflows/issue-comment-router-v1.yml
  blob 76480d39d8f9352a50dd9b7a237b7d5bd0a56100
- .github/workflows/ai-room-execution-transport.yml
  blob 22243c98605fade64b1a29a63e160c62339e3c7f
- .github/workflows/canonical-operation-intake-transport-v1.yml
  blob 3276823b357b72a7f0fbdc6deed1df0e329fdc15
- .github/workflows/public-private-successor-execution-v1.yml
  blob b5a54c8ff6d2b5c5497a37aefc2529e28316ae9e
- .github/workflows/public-private-terminal-closure-carrier-v1.yml
  blob 41c92df33d54d7b163525b204a2c66f377b71d51
- .github/workflows/remote-operation-terminal-closure-v1.yml
  blob 1aa32ab3e5ea3e6cfc5405fc5a0dff518dcbf4f5

## Root defect

The Central Issue Comment Router authenticates/classifies issue_comment events and invokes registered handlers through workflow_dispatch, but the five registered handler contracts were not reconciled end-to-end across that event boundary.

The defect has exactly three transport dimensions:

1. PAYLOAD_REPRESENTATION
2. DISPATCH_ELIGIBILITY
3. CALLBACK_CONTEXT

The router is the sole issue-comment authenticator/classifier. After that boundary, a migrated workflow_dispatch handler must not require the original github.event.comment or github.event.issue context for information that belongs to the authenticated source event.

## Frozen governing correspondence

issue_comment
-> authenticate association in Central Router
-> classify exactly one registered marker
-> normalize the route-declared payload representation
-> carry authenticated callback metadata as transport metadata
-> workflow_dispatch registered handler
-> handler revalidates bounded payload
-> execute existing registered function
-> return receipt to authenticated originating issue.

Callback identity MUST be router-produced transport metadata, not caller-controlled operation JSON.

## Five-route matrix

### R1 AI_ROOM_EXECUTION_REQUEST_V1

Workflow: ai-room-execution-transport.yml
Registry input: request_json
Current router payload: entire MARKER + JSON comment.
workflow_dispatch parser expectation: RAW JSON through --json-file.
Dispatch eligibility: reachable because workflow_dispatch is explicitly accepted.
Callback defect: receipt return is conditioned on github.event_name == issue_comment, so registered workflow_dispatch execution does not return the receipt through the migrated path.

Disposition:
BROKEN_PAYLOAD_REPRESENTATION
BROKEN_CALLBACK_CONTEXT

### R2 CANONICAL_OPERATION_INTAKE_REQUEST_V1

Workflow: canonical-operation-intake-transport-v1.yml
Registry input: request_json
Current router payload: MARKER + JSON.
Parser expectation: MARKER + JSON from inputs.request_json.
Dispatch eligibility defect: admit.if reads github.event.comment.body under workflow_dispatch.
Callback path also relies on issue event context when returning the receipt.

Disposition:
PAYLOAD_REPRESENTATION_COMPATIBLE
BROKEN_DISPATCH_ELIGIBILITY
BROKEN_CALLBACK_CONTEXT

### R3 PUBLIC_PRIVATE_SUCCESSOR_EXECUTION_REQUEST_V1

Workflow: public-private-successor-execution-v1.yml
Registry input: request_json
Current router payload: MARKER + JSON.
Dispatch eligibility defect: job if reads github.event.comment.body and author_association.
Parser defect: parser reads GITHUB_EVENT_PATH comment.body rather than inputs.request_json.
Callback defect: callback issue derives from original issue event context.

Disposition:
BROKEN_DISPATCH_ELIGIBILITY
BROKEN_PAYLOAD_CONSUMPTION
BROKEN_CALLBACK_CONTEXT

### R4 PRIVATE_TERMINAL_CLOSURE_REQUEST_V1

Workflow: public-private-terminal-closure-carrier-v1.yml
Registry input: request_json
Current router payload: MARKER + JSON.
Parser expectation: MARKER + JSON through inputs.request_json.
Dispatch eligibility defect: close.if reads github.event.comment.body and author_association.
Callback defect: receipt return derives issue number from original event context.

Disposition:
PAYLOAD_REPRESENTATION_COMPATIBLE
BROKEN_DISPATCH_ELIGIBILITY
BROKEN_CALLBACK_CONTEXT

### R5 REMOTE_OPERATION_TERMINAL_CLOSURE_REQUEST_V1

Workflow: remote-operation-terminal-closure-v1.yml
Registry input: request_json
Current router payload: MARKER + JSON.
Parser expectation: MARKER + JSON through inputs.request_json.
Dispatch eligibility defect: execute-closure.if reads github.event.comment.body and author_association.
Callback defect: ISSUE_NUMBER derives from github.event.issue.number.

Disposition:
PAYLOAD_REPRESENTATION_COMPATIBLE
BROKEN_DISPATCH_ELIGIBILITY
BROKEN_CALLBACK_CONTEXT

## Proven live failures

### Gen2490 terminal closure

Central Router run: 35933687415 — router dispatch succeeded.
Remote terminal closure run: 35933696922.
validate-contract skipped correctly for workflow_dispatch.
execute-closure skipped incorrectly because its job-level condition required issue_comment context.

No terminal closure occurred.

### Canonical packet compiler request

Owner source comment: issue #4624 comment 5804945701.
Central Router run: 35936236545 — succeeded.
AI Room transport run: 35936248562.
Failure: Parse bounded transport request.
Cause: router forwarded MARKER + JSON while workflow_dispatch parser requires RAW JSON.

Compiler did not execute.
No PACKET_READY receipt was produced.

## Required repair semantics

The existing registry/router architecture must explicitly bind, per route:

- source marker;
- downstream workflow;
- downstream input;
- authenticated associations;
- normalized payload representation;
- authenticated callback issue identity;
- authenticated source comment identity where provenance requires it.

Permitted representation classes are to be derived from the existing handler contracts; no arbitrary/generic command representation may be introduced.

The router must transform the authenticated issue-comment envelope into the route-declared downstream representation.

Handlers invoked through workflow_dispatch must consume dispatch inputs for migrated source-event data and must not consult github.event.comment.* or github.event.issue.* for that data.

Handlers retain their existing bounded payload/schema validation and execution semantics.

## Exact repair surface candidate

Known existing paths implicated by the complete five-route correspondence:

- .github/ai-router/issue-comment-router-registry.v1.json
- .github/workflows/issue-comment-router-v1.yml
- .github/workflows/ai-room-execution-transport.yml
- .github/workflows/canonical-operation-intake-transport-v1.yml
- .github/workflows/public-private-successor-execution-v1.yml
- .github/workflows/public-private-terminal-closure-carrier-v1.yml
- .github/workflows/remote-operation-terminal-closure-v1.yml

A later admitted repair may narrow this set if exact construction proves a file needs no mutation. It may not expand outside this set without new evidence and authority.

## Explicitly prohibited construction

No new:
- global issue-comment listener;
- router class;
- workflow class;
- executor;
- fallback;
- generic command capability;
- operation ledger;
- intake semantics;
- terminal-closure semantics;
- successor semantics;
- private-repository authority bridge;
- product/runtime mechanism.

No ledger hand-edit.
No Gen2490 scope expansion.
No weakening of association authentication.
No caller-controlled callback substitution.

## Positive qualification matrix

For every one of the five registered routes prove:

1. correct marker classification;
2. authenticated association acceptance;
3. exactly one route selected;
4. correct normalized representation;
5. correct workflow/input mapping;
6. workflow_dispatch job is reachable;
7. handler parser accepts the normalized representation;
8. handler retains bounded semantic/schema validation;
9. callback issue identity equals router-authenticated source issue;
10. receipt returns to that issue;
11. source comment identity is preserved where provenance requires it.

Required total correspondence surface:
5 routes x {classification, representation, dispatch eligibility, parser acceptance, callback/receipt routing}.

## Negative qualification

Prove fail-closed behavior for:

- unknown marker;
- unauthorized association;
- zero route;
- ambiguous/multiple route;
- malformed payload;
- representation mismatch;
- callback substitution attempt;
- unregistered workflow;
- arbitrary command input;
- handler attempt to use unavailable original issue_comment context as migrated dispatch authority.

## Static stale-context proof

After repair, inspect the migrated execution paths for authoritative use of:

- github.event.comment.*
- github.event.issue.*

Such references may remain only in an intentionally supported direct-event or PR-specific branch. They may not supply migrated workflow_dispatch authentication, payload parsing, callback identity, or execution eligibility.

## End-to-end smoke requirements

Static YAML/schema tests are insufficient.

At minimum execute through the Central Router:

1. AI_ROOM_EXECUTION_REQUEST_V1 using CANONICAL_PACKET_COMPILER_EXECUTION_V1.
   Required: parser reaches descriptor execution and returns the actual compiler payload receipt. The prior marker/raw-JSON failure must be absent.

2. REMOTE_OPERATION_TERMINAL_CLOSURE_REQUEST_V1 for Gen2490 after the repair is merged and the original closure request is redispatched.
   Required: execute-closure runs and canonical closure semantics are reached. Router success alone is not closure.

Other routes require bounded smoke/contract proof sufficient to establish the same normalized correspondence without creating unrelated authority or mutations.

## Closure

This migration repair closes only when all five registered routes have one unambiguous authenticated event-boundary correspondence and the two live exposing failures no longer reproduce.

After closure, resume the existing sequence:

compiler request
-> PACKET_READY
-> canonical intake
-> ADMITTED_AND_LOCKED
-> qualified bounded repair/merge
-> same Gen2490 terminal closure request
-> TERMINAL_CLOSURE_COMMITTED
-> canonical ledger readback
-> separately governed private C2/C3 convergence work.

## Authority boundary

This artifact is evidence only.

It does not authorize the seven-path repair candidate, compiler submission, canonical intake, branch construction, merge, Gen2490 closure, deployment, or publication.
