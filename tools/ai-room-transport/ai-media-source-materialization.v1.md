# AI_MEDIA_SOURCE_MATERIALIZATION_v1

Status: GOVERNING AI ENTRY PROCEDURE

## Purpose
Make large canonical media recovery a first-class AI entry operation rather than room-local knowledge.

## Closed-world operation
`MATERIALIZE_REGISTERED_MEDIA_SOURCE(source_id)`

The operation accepts only a source identifier present in `ai-media-source-registry.v1.json`. It does not accept arbitrary URLs, arbitrary Drive IDs, shell commands, or destination paths.

## Required execution sequence
1. Resolve `source_id` from the closed-world registry.
2. Invoke the authorized Google Drive raw-file fetch for the registered Drive URL with raw download enabled and inline base64 disabled.
3. Consume the returned streamed connector-file reference into the execution workspace.
4. Verify exact byte size against registry.
5. Verify SHA-256 against registry.
6. Run ffprobe directly against the materialized binary.
7. Emit `AI_MEDIA_SOURCE_MATERIALIZATION_RECEIPT_v1` containing source id, local runtime path, bytes, SHA-256, probe result, and PASS/FAIL_CLOSED.
8. Only PASS may satisfy C0 `SOURCE_BINARY_AVAILABLE`.

## Prohibited fallbacks
- Do not request a registered large media object as inline base64 merely because the streamed reference is unfamiliar.
- Do not treat connector or message transfer ceilings as source-size limits.
- Do not use an unverified public download response as a substitute.
- Do not fabricate frames, proxy pixels, or metadata-only success when materialization has not passed.

## Compass known-good recovery
`COMPASS_CH01_CANONICAL_SOURCE` resolves to Drive file `23619.mp4`, ID `1nQKAfKJ2ORMSpIhjyt5A_gy4neYFrh7A`, 91,348,244 bytes, SHA-256 `c5caa176633209bdc618f505f64cafef5535e400ce2bf1728cde79582169c9a3`.

This recovery path has been successfully exercised in an AI execution room. The successful raw Drive fetch returned a streamed file reference which materialized as `/mnt/data/23619.mp4` in that execution workspace.

## Relationship to media transport substrate
Source materialization is upstream of transport admission:
`AI ENTRY -> REGISTERED SOURCE MATERIALIZATION -> LOCAL SOURCE VERIFICATION -> MEDIA TRANSPORT/CONSTRUCTION`.

GitHub is not the source carrier and GitHub Actions is not required.
