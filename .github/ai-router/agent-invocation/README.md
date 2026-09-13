# Canonical agents must actually be invoked

Owner requirement: every repository task uses the appropriate canonical agents, including reading, diagnosis, static edits, construction, verification, adoption and publication. See issue #3209.

The frozen identities are Alaric/N (Navigation), Elara/E (Signal), Tarian/S (Continuity), and Soren/W (Boundary). The other twelve bearings are compositions of adjacent functions. They do not represent twelve more workers. Dispatch the functions a bounded task needs through the existing native agent tools; retain the actual native task identity.

The existing functional router validates coordinates and authority preservation. Its `FUNCTIONAL_BEARING_EXECUTION_RECEIPT_v1` reports `ROUTE_RESOLVED` or `EXEMPT`; it does not invoke an agent. Its historical schema and frozen source bytes remain unchanged. Its exemptions do not exempt the separate mandatory native invocation procedure.

## At each task boundary

1. Read the entrypoint, root instructions, invocation contract and frozen identity mapping. Resolve current main and follow the contract's `startupDiscovery`. This is the minimal bootstrap; it does not permit product inspection or writes.
2. Freeze an assignment with exact target/head, function, lifecycle, capability, authority, required output, evidence, unresolved conditions and handoff.
3. Actually invoke the available native spawn/followup capability. Retain the returned native task identity and source event. Report incomplete discovery, an unexposed capability or an actual failed invocation separately, preserving the exact failure.
4. Let the assigned worker perform its bounded work. An unchanged task can continue across multiple tool calls; a new worker per file read is unnecessary.
5. Before claiming completion, retain the returned output and digest and obtain independent native source readback. The observer must actually run and inspect the invocation and output events. Separate opposed decisions and required independent verification.
6. Report the function, actual task identity and completed output or unresolved condition.

The coordinator manages intake, transport and handoff under its declared operation. It must not silently perform the assigned agents' work and describe them as invoked.

## Discover the tools this room actually exposes

Read directly advertised native tool definitions first. If the needed callable is still unresolved, inspect any available deferred discovery facility. `ALL_TOOLS` can omit tools advertised directly in the conversation; an empty registry search alone does not establish absence. Do not require a registry match before using a directly exposed capability, and do not invent a tool-search facility when none is advertised.

Use the actual namespace and argument schema. For example, when this host directly advertises `collaboration.spawn_agent` or `collaboration.followup_task`, call it directly, outside `functions.exec` and `tools.*`. The names are examples conditioned on actual host availability, not APIs to manufacture on another host.

| Observed boundary | Required action |
| --- | --- |
| `NATIVE_AGENT_TOOL_AVAILABLE` | Freeze the assignment and invoke the exposed callable; availability is not execution proof. |
| `NATIVE_AGENT_DISCOVERY_INCOMPLETE` | Inspect the remaining advertised surface or preserve its discovery failure; do not claim tool absence or start substantive work. |
| `NATIVE_AGENT_CAPABILITY_UNEXPOSED` | After successful inspection of all available discovery surfaces, report `NATIVE_AGENT_INVOCATION_UNAVAILABLE_STOP_SUBSTANTIVE_WORK`. |
| `NATIVE_AGENT_INVOCATION_CALL_FAILED` | Preserve exact callable, error and source event; stop the unresolved assignment without pretending the capability was unexposed. |

No repository edit attaches missing collaboration tools. An actual returned task identity, attributable output and independent native source readback remain necessary.

## Discover complementary offices when applicable

The contract's `complementaryOfficeDiscovery` links to the existing private entry, capability crosswalk, runtime contract and production entry contract. It preserves the complete sixteen-station constitution and adds orientation to the complementary offices:

| Office | Existing responsibility |
| --- | --- |
| Equipment Room | Select capability classes and evidence instruments. |
| North Return / Alaric | Final admissibility after the cardinal runtime. |
| Lab Execution / Dextrion | Implementation discipline and execution preparation. |
| Canonical execution substrate | The existing bounded materialization backend. |
| Post-materialization verification / Soren | Independently verify the realized candidate. |
| Estate Steward / Jeeves | Contextual return and relay to the owner, preserving technical disposition. |
| ACK Return | Evidence closure and return to origin. |

These offices are not extra cardinal identities, new backends, or mandatory participants in every public task. After the initial canonical native invocation, the assigned task resolves private sources only if their capabilities or an integrated-route claim are applicable. Resolve current private main, read private `AI_ENTRYPOINT.json` and `AGENTS.md`, then the three source contracts at that exact head. The recorded historical head is provenance, not current authority. Source contracts prevail over this discovery summary.

Public pointers grant no private access, private execution or cross-repository authority. If a required private source is unavailable, stop that dependent step as `REQUIRED_PRIVATE_SOURCE_UNAVAILABLE`; preserve unrelated authorized public work. Dextrion and Jeeves are not execution backends. Jeeves's relay does not alter technical disposition or establish a new initial-intake duty.

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

Closing that gap requires evidence at the actual host/connector boundary, or an explicitly narrower enforceable claim. Untested tablet/device rooms remain unproven; this room's successful invocation and synthetic startup checks do not certify them. The broader integrated route requires its own source-bound execution evidence. Do not call this repair a universal autonomous dispatcher or claim that all existing rooms comply merely because a contract or validator exists.

The installation record distinguishes actual native tasks observed during this repair from synthetic tests, repository adoption, and unproven host-wide enforcement. It does not retroactively assert agent execution for the cloud candidate.

