# Repository agent entrypoint

Read `AI_ENTRYPOINT.json` first and classify the requested page mutation before escalating into repository-operation authority.

## Canonical abstraction before implementation

Before constructing any control-plane workaround, determine whether `AI_ENTRYPOINT.json`, its registered router/procedure registries, or an existing canonical workflow already exposes the required capability. Existing canonical abstractions outrank room-invented lower-level mechanisms.

For canonical operation admission, the operation ledger is an implementation detail of the registered intake gate. Do **not** reconstruct, truncate, partially rewrite, synthesize, or directly mutate the canonical operation ledger merely because a room can inspect it or because its connector cannot perform the desired low-level Git operation. Use the canonical operation-intake transport/gate declared by `AI_ENTRYPOINT.json` and continue only on its authentic command-emitted receipt.

A direct operation-ledger mutation is permitted only under separate explicit control-plane repair authority that names the intake implementation itself as the repair target. Without that authority, any attempted descent into blob/tree/commit/ref manipulation must fail closed and return to canonical intake.

If canonical intake transport is unavailable or fails, preserve the exact transport/gate failure and report `CANONICAL_INTAKE_TRANSPORT_UNAVAILABLE_OR_FAILED`. Do not treat transport/tool limitation as authority to invent a replacement admission mechanism. Before spending material execution time on a workaround, ask: `DOES_THE_CANONICAL_SPINE_ALREADY_EXPOSE_THIS_CAPABILITY?` If yes, use it. If no—or the registered capability demonstrably fails—escalate that capability as the repair target rather than bypassing it.

Durable incident/lesson record: issue #2191.

## Procedural execution efficiency

Load `.github/ai-router/execution-efficiency-policy.v1.json` and apply shared procedure `EVIDENCE_BEARING_EXECUTION` to diagnostics, GitHub Actions inspection, workflow-log retrieval, publication verification, and control-plane troubleshooting.

A probe counts as progress only when it yields new evidence: a new immutable identity, exact assertion, log/artifact content, state transition, or newly eliminated hypothesis. After a probe yields `NO_NEW_EVIDENCE`, do not repeat an equivalent probe. At most one second attempt may pursue the same evidence purpose, and only if it changes transport, identifier resolution, evidence source, or query surface. Rephrasing the same retrieval is not a strategy change.

For a failed workflow, localize the first failed step and extract its exact assertion or strongest available machine evidence before proposing repair. Downstream skipped steps are consequences, not separate diagnoses. Do not blind-rerun an unchanged failure, create serial equivalent dispatch carriers, or mutate product/runtime bytes from a verification failure before fault localization.

If evidence remains unavailable after the allowed escalation, stop repetition and report the exact missing evidence boundary. Do not describe repeated retrieval attempts as investigation progress. When a lawful execution step is available, execute it rather than returning status only. Every execution report should state what completed, what new evidence was obtained or that none was obtained, the current boundary, and the next lawful action or blocker.

For a deterministically classified `STATIC_EDITORIAL_MICRO` change—such as bounded copy, wording, label, headline, instructions, typo, punctuation, or non-runtime static presentation work—the canonical operation intake gate and Page Excellence are **not required**. These changes must instead remain exact-head bound, touch only the declared static paths, contain no executable/runtime delta, contain no unrelated diff, and pass `tools/static-editorial-micro-verifier.v1.mjs` before adoption.

For any `RUNTIME_OR_AUTHORITY` change—including executable files, runtime behavior, navigation, routing, event handling, state machines, gestures, DOM authority, control-plane/governance work, mixed changes, or anything ambiguous—the existing governed path remains mandatory. Ambiguity fails closed into `RUNTIME_OR_AUTHORITY`; static classification never creates runtime or project authority and never bypasses project registration.

Use the root router for mutation classification:

```text
node tools/repository-ai-entry-router.mjs --mutation-intent --task <BOUNDED_TASK_DESCRIPTION> --path <repository-path> [--path <repository-path> ...]
```

If the receipt classifies the request as `STATIC_EDITORIAL_MICRO`, construct only the declared static diff and verify it against the exact base and candidate heads:

```text
node tools/static-editorial-micro-verifier.v1.mjs --base <EXACT_BASE_SHA> --head <EXACT_CANDIDATE_SHA> --path <declared-path> [--path ...]
```

Continue only on verifier `PASS`. If the classifier returns `RUNTIME_OR_AUTHORITY`, follow the canonical intake procedure below and continue only after `ADMITTED_AND_LOCKED`.

1. Read `AI_ENTRYPOINT.json`.
2. Resolve the operation request and its canonical construction-procedure locator.
3. For governed mutations, run the intake gate:

```text
node tools/operation-intake/repository-operation-intake-gate.v1.mjs --request <REQUEST.json> --procedure <PROCEDURE.json> --repository smansfield635-create/smansfield635-create.github.io --lock-ref refs/heads/operation-locks/repository-operation-intake-v1 --output <ADMISSION_RECEIPT.json>
```

For governed mutations, no branch creation, repository write, workflow execution, or implementation inference is authorized unless the command-emitted receipt returns `ADMITTED_AND_LOCKED`. `INPUT_INCOMPLETE_NOT_STARTED` means no governed operation exists. `ACTIVE_SCOPE_ALREADY_LOCKED` blocks a competing governed operation in the same canonical scope. `BLOCKED_OPEN` retains the lock until a terminal closure receipt is committed.

### Release mutation scope before read-only evidence waits

A governed mutation lock protects repository mutation, not the elapsed duration of downstream read-only evidence collection. Once every authorized repository write is complete, the exact candidate head is immutable, and no further mutation is authorized while CI, browser, Page Excellence, Awards, or other read-only evidence executes, close the active mutation scope through canonical terminal closure with `MUTATION_CLOSED_EVIDENCE_CONTINUES` before waiting on that evidence. This disposition must release the active scope and preserve the operation in terminal history; it does not convert pending evidence into a pass and does not grant any new authority.

Evidence collected after this release remains bound to the exact frozen candidate. If that evidence identifies a defect requiring any repository mutation, obtain a fresh ordinary admission or lawful successor before changing bytes. Do not use `MUTATION_CLOSED_EVIDENCE_CONTINUES` while an authorized write, candidate-finalization step, or mutation-dependent commit is still pending.

## Moving-head successor continuity

If an already-active governed operation becomes stale because its recorded governing head is no longer the current `refs/heads/main`, do not manually close the predecessor and separately reacquire a replacement lock. Prepare a fresh successor operation request and construction procedure bound to the new exact `main`, plus a `REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1`, then run:

```text
GITHUB_TOKEN=<token> node .github/ai-router/operation-lifecycle/repository-operation-successor-gate.v1.mjs --transition <TRANSITION.json> --request <SUCCESSOR_REQUEST.json> --procedure <SUCCESSOR_PROCEDURE.json> --repository smansfield635-create/smansfield635-create.github.io --lock-ref refs/heads/operation-locks/repository-operation-intake-v1 --output <SUCCESSOR_RECEIPT.json>
```

Continue only if the command-emitted receipt returns `SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED`. That result means the exact predecessor was preserved in terminal history as `SUPERSEDED` and the fresh successor was admitted in the same compare-and-swap ledger transaction. The successor gate never carries old authority forward implicitly: `inheritedAuthority` must be empty, a fresh successor request and construction procedure are mandatory, and exact-head revalidation remains required. A stale-head transition does not convert predecessor evidence into evidence for the new head.

After ordinary admission or successful successor admission, run the repository entry router against every affected path:

```text
node tools/repository-ai-entry-router.mjs --path <repository-path> [--path <repository-path> ...]
```

For a proposed change, add `--mutation-intent` and a bounded `--task` description so the proportional classifier can resolve the mutation class. For many paths, use `--paths-file <newline-delimited-file>`. Honor the router disposition and load every project entrypoint, nested `AGENTS.md`, registry, procedure, validator, and stopping boundary named in the receipt.

The intake gate establishes whether a governed operation may begin and atomically locks its declared scope. The successor gate establishes only moving-head continuity through a freshly validated successor request and an atomic supersession/admission transaction. Neither gate grants project-specific mutation, merge, canonicalization, runtime, renderer, deployment, or production authority. The root router remains a dispatcher and proportional classifier, not a source of project authority. Shared GitHub procedures explain how to resolve commits, create clean checkouts, use GitHub Actions, retrieve artifacts, verify hashes, publish receipts, and verify rollback; they do not grant project authority.

## Whole-estate narrative and display continuity

For every applicable public or experiential construction task, after proportional classification and repository routing are resolved—and after canonical intake when the mutation class requires it—load the whole-estate continuity context before visual construction begins:

- `.github/ai-router/display-continuity-constitution-v1/display-constitution.v1.json`
- `.github/ai-router/display-continuity-constitution-v1/README.md`
- `control-plane/whole-estate/narrative-continuity-development-map-v1/map.v1.json`
- `control-plane/whole-estate/narrative-spine-constitution-v1/narrative-spine.v1.json` when the narrative relation is material.

This requirement applies to new public pages, material public-page renewals, frontiers, products, rooms, worlds, campaigns, Showroom work, navigation and transition changes, persistent-object work, responsive composition, shared visual systems, and any estate-wide display-coherence or continuity claim. It does not convert a bounded static editorial micro change into a Page Excellence operation.

Before construction, resolve the route display contract declared by the constitution: local identity, narrative relation, orientation relation, display role, runtime ceiling, persistent objects, transition meaning, progressive disclosure, mobile composition, reduced-motion equivalence, explicit return, claim boundary, local visual identity, and continuity hook.

Preserve the authority separation: Compass owns global orientation and narrative anchoring; Governance is the public information-design and bounded-interaction reference; Evidence anchors claims and proof; Laws supplies runtime and semantic ceilings. Runtime classes are ceilings, not requirements. Semantic object identity may persist across transitions when continuity adds meaning, but continuity does not require one renderer or one universal page shell. Mobile is a distinct composition, reduced motion must preserve complete semantics, visual polish cannot create claim authority, and discovery may reveal depth without silently changing the public cardinal map.

This global context does not widen mutation scope, create project authority, grant renderer/runtime authority, alter scientific standing, create claim authority, or substitute for project-specific entrypoints, nested `AGENTS.md`, evidence boundaries, or existing validation gates. If a task is not visual or experiential, do not invent display work merely because the constitution is globally discoverable.

## Progressive system continuity

For a shared infrastructure or control-plane change, inspect `.github/ai-router/system-continuity/gap-registry.v1.json` before declaring the surrounding system closed. If the proposed interfaces or paths intersect an `OPEN` gap, declare and reconcile that gap rather than creating a parallel workaround.

Extract both producer and consumer contracts. In particular, treat operation-ID policy, receipt schemas, authority semantics, lifecycle state, and invocation surfaces as interfaces that must compose. A local self-test or component PASS proves only local correctness unless the downstream transition is also proven.

Use the read-only continuity gate when evaluating shared-system closure:

```text
node .github/ai-router/system-continuity/progressive-system-continuity-gate.v1.mjs --input <ASSESSMENT_REQUEST.json> --output <ASSESSMENT_RECEIPT.json>
```

`LOCAL_CAPABILITY_CLOSED` is not `SYSTEM_GAP_CLOSED`. `SYSTEM_GAP_CLOSED` requires local correctness, producer-consumer interface compatibility, transition simulation, a real remote invocation proof, post-merge continuity proof, and no unresolved related open gap. The continuity track never grants repository writes, lifecycle or terminal-closure authority, successor authority, merge/deployment authority, product authority, semantic/scientific authority, or generic command authority.

The continuity track supplements rather than replaces proportional classification, repository intake where required, moving-head successor handling, canonical terminal closure, project routing, Page Excellence where required, or project-specific authority. Ordinary project work does not acquire extra authority from continuity PASS; continuity is mandatory only when a shared-system closure claim or shared control-plane interface change is being evaluated.

For remote read-only assessment after the track is installed, use an owner/member/collaborator issue comment beginning with `PROGRESSIVE_SYSTEM_CONTINUITY_REQUEST_V1` followed by the closed assessment JSON. The route may return a receipt to the triggering issue but may not mutate repository content or the operation ledger.

For H-Earth and Audralia/globe experience paths, the router delegates to the existing H-Earth registry and automatic preflight. Preserve all narrower instructions below `h-earth-3d/` and `showroom/globe/h-earth/`. Before any experience-changing H-Earth or Audralia/globe upgrade, the operation must additionally load and satisfy `h-earth-3d/experience-anchor/H_EARTH_EXPERIENCE_ANCHOR_v1.json`; the `H-Earth Experience Anchor Gate` is a hard acceptance boundary and may not be bypassed or weakened without explicit user authorization replacing the anchor.

Governed intake outcomes:

- `ADMITTED_AND_LOCKED`: the complete request and canonical construction procedure passed intake, and the declared scope lock was atomically acquired. Continue only within the admitted paths and separately resolved project authority.
- `INPUT_INCOMPLETE_NOT_STARTED`: no governed operation has started; governed branch creation, writes, workflows, and implementation inference remain prohibited.
- `ACTIVE_SCOPE_ALREADY_LOCKED`: another governed operation owns the same scope; no competing governed operation may begin. If that exact active operation is stale only because `main` advanced, use the successor continuity gate rather than a manual close/re-admit sequence.
- `SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED`: the exact active predecessor was atomically preserved as `SUPERSEDED` and replaced by a freshly admitted exact-head successor. Continue only within the fresh successor request and separately resolved project authority.

Router dispositions:

- `PASS`: project/procedure routing resolved, or a static editorial micro mutation was deterministically classified; continue only within the applicable bounded authority and verification rules.
- `REVIEW_REQUIRED`: routing is incomplete or the path is not yet registered; report the limitation before project-specific action.
- `BLOCK`: the requested action is prohibited by the resolved route.
- `STOP`: identity, scope, or authority resolution failed; do not proceed.
- `NOT_APPLICABLE`: no project-specific router controls the operation.

Conversation memory, screenshots, summaries, private working state, and manually reconstructed execution are not substitutes for repository-resident instructions or command-emitted receipts.