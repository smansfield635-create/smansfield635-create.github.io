# Public → Private Canonical Execution Carrier v1

This carrier uses public GitHub-hosted compute only as execution transport. The private control plane remains the sole authority.

The carrier accepts only `PUBLIC_PRIVATE_CANONICAL_EXECUTION_REQUEST_v1`, fixed to `smansfield635-create/geodiametrics1`, checks out the exact requested private governing head, runs the private repository-owned `tools/pre-registration-intake-bridge/canonical-intake-execution-bridge.v1.mjs`, and returns only a redacted public receipt plus the digest of the native private receipt.

It must use a GitHub App installation token scoped only to `geodiametrics1` with the minimum permission required by the canonical private lock CAS. The public workflow must never receive arbitrary repository, path, command, ledger bytes, or authority-result inputs.

Required public repository configuration:

- Variable: `PRIVATE_EXECUTION_APP_ID`
- Secret: `PRIVATE_EXECUTION_APP_PRIVATE_KEY`
- GitHub App installed on `geodiametrics1`
- App repository permission: Contents — Read and write

The GitHub App token is job-scoped and must be revoked by the token action after completion.

Success is not a public workflow success by itself. Success is the native private canonical receipt reporting the requested private result, with post-write private verification performed by the private canonical bridge.
