# C2-R1 registry base-node lineage repair

This directory is a nonproduct repair envelope for issue #571 and repair seed #572.

- Only paths in `changed-path-manifest.v1.json` may change.
- The exact historical candidate-path overlay must retain git blob `a195eea704df0a3f754f626817181b63114178fd`.
- The repair may reconnect registry lineage and validate read-only preflight only.
- PR #570 and head `7c0b8871928b21cd9b2806f058bce34eed11f2ba` are immutable subjects and may not be altered.
- Terrain, renderer, runtime, product, manor, route, deployment, release, promotion, user differential, and merge actions are prohibited.
- Existing C2-R1 authority limitations may be preserved or narrowed, never broadened.
- Builder and verifier must use distinct holders. The verifier may not repair output.
- Temporary repair authority terminates after matching successful receipts.
