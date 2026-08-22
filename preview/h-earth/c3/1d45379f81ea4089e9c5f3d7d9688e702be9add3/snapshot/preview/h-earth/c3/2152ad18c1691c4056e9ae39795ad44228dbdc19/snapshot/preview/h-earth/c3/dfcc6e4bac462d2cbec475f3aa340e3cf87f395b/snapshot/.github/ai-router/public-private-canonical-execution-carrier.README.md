# Public → Private Canonical Execution Carrier v1

This carrier uses public GitHub-hosted compute only as execution transport. The private control plane remains the sole authority.

The public request contains no private intake payload. It contains only a closed locator: private issue number, private issue-comment ID, expected intake request ID, and exact private governing head. The privileged carrier mints a short-lived GitHub App token, fetches the frozen intake directly from `smansfield635-create/geodiametrics1`, verifies its identity and head, checks out that exact private head, runs the private repository-owned `tools/pre-registration-intake-bridge/canonical-intake-execution-bridge.v1.mjs`, and returns only a redacted public receipt plus the digest of the native private receipt.

Required public repository configuration:

- Variable: `PRIVATE_EXECUTION_APP_ID`
- Secret: `PRIVATE_EXECUTION_APP_PRIVATE_KEY`
- GitHub App installed only on `geodiametrics1`
- App repository permissions: Contents — Read and write; Issues — Read

The owner-comment router has no private credential. It can only dispatch the fixed privileged carrier workflow. The privileged workflow refuses non-owner actors, arbitrary repository/path/command inputs, caller-supplied ledger bytes, and caller-supplied authority results.

The GitHub App token is job-scoped and is revoked by the pinned token action after completion. The full private canonical receipt is never published to the public repository.

Success is not a public workflow success by itself. Success is the native private canonical receipt reporting the requested private result after the private bridge completes its own exact-head, canonical-gate, CAS, and readback checks.
