# Canonical agents must actually be invoked

Owner requirement: every repository task uses the appropriate canonical agents, including reading, diagnosis, static edits, construction, verification, adoption and publication. See issue #3209.

The frozen identities are Alaric/N (Navigation), Elara/E (Signal), Tarian/S (Continuity), and Soren/W (Boundary). The other twelve bearings are compositions of adjacent functions. They do not represent twelve more workers. Dispatch the functions a bounded task needs through the existing native agent tools; retain the actual native task identity.

The existing functional router validates coordinates and authority preservation. Its `FUNCTIONAL_BEARING_EXECUTION_RECEIPT_v1` reports `ROUTE_RESOLVED` or `EXEMPT`; it does not invoke an agent. Its historical schema and frozen source bytes remain unchanged. Its exemptions do not exempt the separate mandatory native invocation procedure.

## At each task boundary

1. Read the entrypoint, root instructions, invocation contract and frozen identity mapping. Resolve current main and native tool availability. This is the minimal bootstrap; it does not permit product inspection or writes.
2. Freeze an assignment with exact target/head, function, lifecycle, capability, authority, required output, evidence, unresolved conditions and handoff.
3. Actually invoke the available native spawn/followup capability. Retain the returned native task identity and source event. If no native invocation is available, stop substantive work and report that boundary.
4. Let the assigned worker perform its bounded work. An unchanged task can continue across multiple tool calls; a new worker per file read is unnecessary.
5. Before claiming completion, retain the returned output and digest and obtain independent native source readback. The observer must actually run and inspect the invocation and output events. Separate opposed decisions and required independent verification.
6. Report the function, actual task identity and completed output or unresolved condition.

The coordinator manages intake, transport and handoff under its declared operation. It must not silently perform the assigned agents' work and describe them as invoked.

## Evidence checks and their limits

`evidence-gate.v1.mjs` validates records and compares supplied observations. It never launches an agent. File-only validation returns `STRUCTURE_VALID_EXECUTION_UNVERIFIED`; matching provided readback returns `MATCHES_PROVIDED_OBSERVATIONS`. Neither result authenticates where supplied data came from, proves actual execution, or grants authority.

```sh
node .github/ai-router/agent-invocation/evidence-gate.v1.mjs --input /outside/record.json
node .github/ai-router/agent-invocation/self-test.v1.mjs
```

An attempt to use the validator as authorization (`--authorize`) fails closed. The tests use labeled synthetic observations and prove validator behavior only. A handwritten task ID, `invoked: true`, admission receipt, CI run or router output cannot substitute for source-observed native invocation.

Use `CANONICAL_NATIVE_AGENT_EXECUTION_EVIDENCE_v1` for linked assignment/invocation/output records. Exact timestamps should be recorded when supplied by the native tool. If the native source exposes an event identity but no timestamp, retain the event identity and state the limit; never invent a timestamp.

## Preserve the existing control plane

Native invocation does not grant mutation, merge, deployment or scientific authority. Applicable canonical intake and project qualification still apply. Read-only and static work retain their proportional paths. Passive CI and fixed intake are not intelligent agent workers.

A failed or withdrawn task may still release its lock using the canonical lifecycle tools. Do not require a successful agent output to reduce authority or release a finished mutation scope. Such release does not establish qualification.

## Enforcement boundary

Root `AGENTS.md`, `AI_ENTRYPOINT.json` and the shared procedure require this behavior prospectively once adopted. They cannot intercept arbitrary direct GitHub API calls from an unrestricted host. The gap `CANONICAL_NATIVE_AGENT_INVOCATION_HOST_ENFORCEMENT` remains OPEN.

Closing that gap requires evidence at the actual host/connector boundary, or an explicitly narrower enforceable claim. Do not call this repair a universal autonomous dispatcher or claim that all existing rooms comply merely because a contract or validator exists.

The installation record distinguishes actual native tasks observed during this repair from synthetic tests, repository adoption, and unproven host-wide enforcement. It does not retroactively assert agent execution for the cloud candidate.

