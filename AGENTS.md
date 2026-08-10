# Repository agent entrypoint

Before any repository mutation task—including branch creation, construction, editing, deletion, movement, lifecycle change, authority assertion, integration, workflow execution, merge, deployment, or production work—the request must first pass the repository operation intake gate and acquire its declared single-flight scope lock.

1. Read `AI_ENTRYPOINT.json`.
2. Resolve the operation request and its canonical construction-procedure locator.
3. Run the intake gate:

```text
node tools/operation-intake/repository-operation-intake-gate.v1.mjs --request <REQUEST.json> --procedure <PROCEDURE.json> --repository smansfield635-create/smansfield635-create.github.io --lock-ref refs/heads/operation-locks/repository-operation-intake-v1 --output <ADMISSION_RECEIPT.json>
```

No branch creation, repository write, workflow execution, or implementation inference is authorized unless the command-emitted receipt returns `ADMITTED_AND_LOCKED`. `INPUT_INCOMPLETE_NOT_STARTED` means no operation exists. `ACTIVE_SCOPE_ALREADY_LOCKED` blocks a competing operation in the same canonical scope. `BLOCKED_OPEN` retains the lock until a terminal closure receipt is committed.

## Moving-head successor continuity

If an already-active operation becomes stale because its recorded governing head is no longer the current `refs/heads/main`, do not manually close the predecessor and separately reacquire a replacement lock. Prepare a fresh successor operation request and construction procedure bound to the new exact `main`, plus a `REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1`, then run:

```text
GITHUB_TOKEN=<token> node .github/ai-router/operation-lifecycle/repository-operation-successor-gate.v1.mjs --transition <TRANSITION.json> --request <SUCCESSOR_REQUEST.json> --procedure <SUCCESSOR_PROCEDURE.json> --repository smansfield635-create/smansfield635-create.github.io --lock-ref refs/heads/operation-locks/repository-operation-intake-v1 --output <SUCCESSOR_RECEIPT.json>
```

Continue only if the command-emitted receipt returns `SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED`. That result means the exact predecessor was preserved in terminal history as `SUPERSEDED` and the fresh successor was admitted in the same compare-and-swap ledger transaction. The successor gate never carries old authority forward implicitly: `inheritedAuthority` must be empty, a fresh successor request and construction procedure are mandatory, and exact-head revalidation remains required. A stale-head transition does not convert predecessor evidence into evidence for the new head.

After ordinary admission or successful successor admission, run the repository entry router against every affected path:

```text
node tools/repository-ai-entry-router.mjs --path <repository-path> [--path <repository-path> ...]
```

For a proposed change, add `--mutation-intent`. For many paths, use `--paths-file <newline-delimited-file>`. Honor the router disposition and load every project entrypoint, nested `AGENTS.md`, registry, procedure, validator, and stopping boundary named in the receipt.

The intake gate establishes whether an operation may begin and atomically locks its declared scope. The successor gate establishes only moving-head continuity through a freshly validated successor request and an atomic supersession/admission transaction. Neither gate grants project-specific mutation, merge, canonicalization, runtime, renderer, deployment, or production authority. The root router remains a dispatcher, not a source of project authority. Shared GitHub procedures explain how to resolve commits, create clean checkouts, use GitHub Actions, retrieve artifacts, verify hashes, publish receipts, and verify rollback; they do not grant project authority.

## Progressive system continuity

For a shared infrastructure or control-plane change, inspect `.github/ai-router/system-continuity/gap-registry.v1.json` before declaring the surrounding system closed. If the proposed interfaces or paths intersect an `OPEN` gap, declare and reconcile that gap rather than creating a parallel workaround.

Extract both producer and consumer contracts. In particular, treat operation-ID policy, receipt schemas, authority semantics, lifecycle state, and invocation surfaces as interfaces that must compose. A local self-test or component PASS proves only local correctness unless the downstream transition is also proven.

Use the read-only continuity gate when evaluating shared-system closure:

```text
node .github/ai-router/system-continuity/progressive-system-continuity-gate.v1.mjs --input <ASSESSMENT_REQUEST.json> --output <ASSESSMENT_RECEIPT.json>
```

`LOCAL_CAPABILITY_CLOSED` is not `SYSTEM_GAP_CLOSED`. `SYSTEM_GAP_CLOSED` requires local correctness, producer-consumer interface compatibility, transition simulation, a real remote invocation proof, post-merge continuity proof, and no unresolved related open gap. The continuity track never grants repository writes, lifecycle or terminal-closure authority, successor authority, merge/deployment authority, product authority, semantic/scientific authority, or generic command authority.

The continuity track supplements rather than replaces repository intake, moving-head successor handling, canonical terminal closure, project routing, Page Excellence, or project-specific authority. Ordinary project work does not acquire extra authority from continuity PASS; continuity is mandatory only when a shared-system closure claim or shared control-plane interface change is being evaluated.

For remote read-only assessment after the track is installed, use an owner/member/collaborator issue comment beginning with `PROGRESSIVE_SYSTEM_CONTINUITY_REQUEST_V1` followed by the closed assessment JSON. The route may return a receipt to the triggering issue but may not mutate repository content or the operation ledger.

For H-Earth paths, the router delegates to the existing H-Earth registry and automatic preflight. Preserve all narrower instructions below `h-earth-3d/` and `showroom/globe/h-earth/`.

Intake outcomes:

- `ADMITTED_AND_LOCKED`: the complete request and canonical construction procedure passed intake, and the declared scope lock was atomically acquired. Continue only within the admitted paths and separately resolved project authority.
- `INPUT_INCOMPLETE_NOT_STARTED`: no operation has started; branch creation, writes, workflows, and implementation inference remain prohibited.
- `ACTIVE_SCOPE_ALREADY_LOCKED`: another operation owns the same scope; no competing operation may begin. If that exact active operation is stale only because `main` advanced, use the successor continuity gate rather than a manual close/re-admit sequence.
- `SUCCESSOR_ADMITTED_PREDECESSOR_SUPERSEDED`: the exact active predecessor was atomically preserved as `SUPERSEDED` and replaced by a freshly admitted exact-head successor. Continue only within the fresh successor request and separately resolved project authority.

Router dispositions after admission:

- `PASS`: project and procedure routing resolved; continue only within separately established authority.
- `REVIEW_REQUIRED`: routing is incomplete or the path is not yet registered; report the limitation before project-specific action.
- `BLOCK`: the requested action is prohibited by the resolved route.
- `STOP`: identity, scope, or authority resolution failed; do not proceed.
- `NOT_APPLICABLE`: no project-specific router controls the operation.

Conversation memory, screenshots, summaries, private working state, and manually reconstructed execution are not substitutes for repository-resident instructions or command-emitted receipts.

## Repository-backed project continuation

For a cold room start or device-lane recovery, read `.github/ai-router/project-continuation/strategy-index.v1.json` after `AI_ENTRYPOINT.json`, then load the resolved lane manifest and `.github/ai-router/project-continuation/protocol.v1.json`.

Other rooms are not continuity dependencies. Determine progress from live repository evidence, not from another conversation. Re-fetch current `main`, the canonical operation ledger on `refs/heads/operation-locks/repository-operation-intake-v1`, the lane project entrypoint and registries, relevant pull requests and branches, workflow runs and artifacts, and command-emitted receipts before deriving the current frontier.

The continuation layer is non-authoritative metadata. It never supplies a frozen next mutation and never grants mutation, merge, deployment, product, semantic, scientific, page, renderer, standards-conformance, or lifecycle authority. Before any mutation, re-run the current canonical intake or moving-head successor procedure as applicable, the root router for every affected path, and every narrower project gate resolved from the live repository. Stop rather than act from stale, ambiguous, contradictory, or incomplete frontier evidence.
