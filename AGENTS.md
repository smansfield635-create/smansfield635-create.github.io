# Repository agent entrypoint

Before substantive repository analysis, construction, editing, deletion, movement, lifecycle change, authority assertion, integration, merge, deployment, or production work:

1. Read `AI_ENTRYPOINT.json`.
2. Run the repository entry router against every affected path:

```text
node tools/repository-ai-entry-router.mjs --path <repository-path> [--path <repository-path> ...]
```

For a proposed change, add `--mutation-intent`. For many paths, use `--paths-file <newline-delimited-file>`. Honor the router disposition and load every project entrypoint, nested `AGENTS.md`, registry, procedure, validator, and stopping boundary named in the receipt.

The root router is a dispatcher, not a source of project authority. Shared GitHub procedures explain how to resolve commits, create clean checkouts, use GitHub Actions, retrieve artifacts, verify hashes, publish receipts, and verify rollback; they do not authorize project mutation, merge, canonicalization, runtime, renderer, deployment, or production actions.

For H-Earth paths, the router delegates to the existing H-Earth registry and automatic preflight. Preserve all narrower instructions below `h-earth-3d/` and `showroom/globe/h-earth/`.

Dispositions:

- `PASS`: project and procedure routing resolved; continue only within separately established authority.
- `REVIEW_REQUIRED`: routing is incomplete or the path is not yet registered; report the limitation before project-specific action.
- `BLOCK`: the requested action is prohibited by the resolved route.
- `STOP`: identity, scope, or authority resolution failed; do not proceed.
- `NOT_APPLICABLE`: no project-specific router controls the operation.

Conversation memory, screenshots, summaries, private working state, and manually reconstructed execution are not substitutes for repository-resident instructions or command-emitted receipts.
