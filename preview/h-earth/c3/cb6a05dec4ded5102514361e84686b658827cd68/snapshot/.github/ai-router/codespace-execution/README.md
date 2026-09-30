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

## Audralia Work bootstrap

Audralia Gen1754 has a repository-resident bootstrap for any capable Work room or disposable native shell. It pins Node `22.23.2`, `puppeteer-core` `24.15.0`, and Chromium Headless Shell for Testing `151.0.7922.34`. The browser archive is accepted only at SHA-256 `3cfc2bd00d1bafcf8a68dc74c9c92bb7150ddc8d26ade948a776316e1cec4f14`; extraction is followed by an explicit `chmod 0755`, exact version readback, SwiftShader/WebGL headless launch, and DOM probe.

From a clean clone of this repository, choose an install directory and receipt path outside the repository:

```sh
AUDRALIA_EXECUTOR_ROOT="$(mktemp -d)"
node .github/ai-router/codespace-execution/bootstrap-audralia-work-executor.v1.mjs \
  --operation-id AUDRALIA_WEATHER_POPULATION_SECOND_FAILING_CORPUS_20260827_001_SUCCESSOR_001 \
  --exact-target-head 41a63ace8b540f2b3ce7f73b6395f90234c7dc3f \
  --install-root "$AUDRALIA_EXECUTOR_ROOT/runtime" \
  --output "$AUDRALIA_EXECUTOR_ROOT/environment-receipt.json"
```

Continue only when the receipt is `THREE_TIER_CODESPACE_ENVIRONMENT_RECEIPT_v1` with `result=PASS_ENVIRONMENT_READY` and all three ready conditions true. Then prepend `receipt.runtime.commands.pathPrefix` to `PATH` and execute the project profile's `declaredCommand` unchanged. The bootstrap creates a `google-chrome-stable` alias to the pinned Headless Shell so the existing Hook 3 harness selects the proven browser directly.

The bootstrap proves environment readiness only. It does not consume Hook 3, reveal Hook 4, run the Audralia verifier, create project authority, or make the mutable room canonical.

## Authority boundary

This package supplies execution method and provenance only. It never grants product mutation, project construction, lock-ledger mutation, merge, deployment, release, unblinding, or scientific claim authority.

The workflow file under `templates/` is intentionally nonactive. Copying or activating it under `.github/workflows/` requires a separate admitted operation.
