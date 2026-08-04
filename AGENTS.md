# Repository agent entrypoint

Before any repository mutation task—including branch creation, construction, editing, deletion, movement, lifecycle change, authority assertion, integration, workflow execution, merge, deployment, or production work—the request must first pass the repository operation intake gate and acquire its declared single-flight scope lock.

1. Read `AI_ENTRYPOINT.json`.
2. Resolve the operation request and its canonical construction-procedure locator.
3. Run the intake gate:

```text
node tools/operation-intake/repository-operation-intake-gate.v1.mjs --request <REQUEST.json> --procedure <PROCEDURE.json> --repository smansfield635-create/smansfield635-create.github.io --lock-ref refs/heads/operation-locks/repository-operation-intake-v1 --output <ADMISSION_RECEIPT.json>
```

No branch creation, repository write, workflow execution, or implementation inference is authorized unless the command-emitted receipt returns `ADMITTED_AND_LOCKED`. `INPUT_INCOMPLETE_NOT_STARTED` means no operation exists. `ACTIVE_SCOPE_ALREADY_LOCKED` blocks a competing operation in the same canonical scope. `BLOCKED_OPEN` retains the lock until a terminal closure receipt is committed.

After admission, run the repository entry router against every affected path:

```text
node tools/repository-ai-entry-router.mjs --path <repository-path> [--path <repository-path> ...]
```

For a proposed change, add `--mutation-intent`. For many paths, use `--paths-file <newline-delimited-file>`. Honor the router disposition and load every project entrypoint, nested `AGENTS.md`, registry, procedure, validator, and stopping boundary named in the receipt.

The intake gate establishes whether an operation may begin and atomically locks its declared scope. It does not grant project-specific mutation, merge, canonicalization, runtime, renderer, deployment, or production authority. The root router remains a dispatcher, not a source of project authority. Shared GitHub procedures explain how to resolve commits, create clean checkouts, use GitHub Actions, retrieve artifacts, verify hashes, publish receipts, and verify rollback; they do not grant project authority.

For H-Earth paths, the router delegates to the existing H-Earth registry and automatic preflight. Preserve all narrower instructions below `h-earth-3d/` and `showroom/globe/h-earth/`.

Intake outcomes:

- `ADMITTED_AND_LOCKED`: the complete request and canonical construction procedure passed intake, and the declared scope lock was atomically acquired. Continue only within the admitted paths and separately resolved project authority.
- `INPUT_INCOMPLETE_NOT_STARTED`: no operation has started; branch creation, writes, workflows, and implementation inference remain prohibited.
- `ACTIVE_SCOPE_ALREADY_LOCKED`: another operation owns the same scope; no successor operation may begin.

Router dispositions after admission:

- `PASS`: project and procedure routing resolved; continue only within separately established authority.
- `REVIEW_REQUIRED`: routing is incomplete or the path is not yet registered; report the limitation before project-specific action.
- `BLOCK`: the requested action is prohibited by the resolved route.
- `STOP`: identity, scope, or authority resolution failed; do not proceed.
- `NOT_APPLICABLE`: no project-specific router controls the operation.

Conversation memory, screenshots, summaries, private working state, and manually reconstructed execution are not substitutes for repository-resident instructions or command-emitted receipts.
