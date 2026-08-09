# Three-tier Codespace execution substrate v1

This package is shared nonproduct execution instrumentation for repository-governed work.

Its purpose is:

`FROZEN INPUT -> DECLARED ENVIRONMENT -> DECLARED COMMAND -> OUTPUT HASH -> INDEPENDENT REEXECUTION -> EQUALITY RECEIPT`

The substrate deliberately separates two concepts:

`EXECUTION SUBSTRATE != CHATGPT TERMINAL TRANSPORT`

Repository code can standardize exact-head checkout, clean/disposable environments, fixed commands, bounded permissions, immutable receipts, fresh verification, equality comparison, environment destruction/non-authority, and GitHub Actions replay. Repository code cannot manufacture a native ChatGPT Codespaces terminal connector.

## Execution flow

1. An operation is independently admitted and locked.
2. The project router resolves the applicable project profile.
3. A builder environment checks out the exact target commit detached and verifies a clean worktree.
4. Only the declared project command is executed.
5. Environment and command receipts bind target, command, backend, runtime, exit status, output hashes, and side effects.
6. A fresh verifier uses a distinct mutable environment and independently executes the same frozen target and command.
7. Equality compares the declared immutable output domain.
8. The mutable environment is destroyed when possible, or explicitly marked detached and nonauthoritative when the caller lacks destruction transport.
9. GitHub Actions may replay the same operation when a separately authorized active workflow exists.

A user-owned Codespace may be a bootstrap execution surface, but no named long-lived Codespace is encoded as permanent authority and no specific Codespace is required by the package.

## Authority boundary

This package supplies execution method and provenance only. It never grants product mutation, project construction, lock-ledger mutation, merge, deployment, release, unblinding, or scientific claim authority.

The workflow file under `templates/` is intentionally nonactive. Copying or activating it under `.github/workflows/` requires a separate admitted operation.
