# AI_EXECUTION_CAPSULE_SOURCE_MATERIALIZATION_v1

Status: GOVERNING AI ENTRY PROCEDURE — CLOSED WORLD / FAIL CLOSED

## Purpose
Materialize one explicitly registered immutable execution capsule into an AI execution workspace without requiring that room's shell to contact GitHub.

## Closed-world operation
`MATERIALIZE_REGISTERED_EXECUTION_CAPSULE_SOURCE(source_id)`

The operation accepts only a `source_id` present in `ai-execution-capsule-source-registry.v1.json`. It does not accept arbitrary URLs, arbitrary Google Drive IDs, shell commands, destination paths, or unregistered archives.

## Provider handoff
A registered source may use Google Drive streamed raw-file retrieval or another separately authorized provider-to-workspace byte handoff. Provider connectivity is transport only and creates no repository, project, Hook, mutation, merge, deployment, release, or claim authority.

## Required qualification sequence
1. Resolve `source_id` from the closed-world registry.
2. Fetch only the registered provider object in streamed raw-file mode; inline base64 is prohibited for large capsules.
3. Materialize the returned connector-file reference into the execution workspace.
4. Verify exact capsule byte size.
5. Verify exact capsule SHA-256.
6. Open the registered manifest path from the capsule and validate its schema and manifest digest.
7. Verify exact candidate identity, base identity, fixed-command identity, and reproduction-tooling identities declared by the registry and manifest.
8. Verify every declared Hook execution path is present and its SHA-256 matches the manifest.
9. Verify the pinned runtime identities declared by the source: Node, Puppeteer, browser product/version/archive digest, executable mode, and any other bounded runtime members.
10. With repository/provider network disabled or otherwise unavailable, prove exact candidate/base/tooling readback or checkout solely from capsule bytes.
11. Prove the exact registered fixed command is locally available without dependency installation or repository-network access.
12. Emit `AI_EXECUTION_CAPSULE_SOURCE_MATERIALIZATION_RECEIPT_v1`.

## Terminal predicate
A source may PASS only when all are true:

`REGISTERED_ID && LOCAL_FILE_READABLE && CAPSULE_BYTE_SIZE_MATCH && CAPSULE_SHA256_MATCH && MANIFEST_VALID && CANDIDATE_IDENTITY_VALID && BASE_IDENTITY_VALID && TOOLING_IDENTITY_VALID && DECLARED_PATHS_COMPLETE && PINNED_RUNTIME_VALID && NO_NETWORK_EXACT_CHECKOUT_OR_READBACK_PASS && FIXED_COMMAND_AVAILABLE`

`git cat-file -e <commit>` by itself is explicitly insufficient to satisfy repository materialization because partial clones may contain the commit object while omitting required blobs.

## Prohibited substitutions
- No `ffprobe` predicate; this is not a media route.
- No arbitrary provider ID or URL.
- No network fetch to fill missing repository blobs after capsule materialization.
- No npm/package-manager install after capsule materialization as a substitute for pinned runtime completeness.
- No GitHub Actions execution fallback.
- No metadata-only receipt if any declared path or runtime byte is absent.

## Closure distinction
A registered capsule and a passing materialization receipt establish capsule readiness only. `ROOM_INDEPENDENT_EXECUTION_CONTINUITY` additionally requires a genuinely fresh GitHub-disconnected room to retrieve the registered capsule, PASS this predicate, execute the exact fixed command, and emit the declared execution result.
