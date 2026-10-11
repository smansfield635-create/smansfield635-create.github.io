# Pre-registration canonical intake execution bridge

This directory is a bounded genesis package created under `USER_ORIGIN_PRE_REGISTRATION_BRIDGE_GENESIS_AUTHORITY_2026_08_04_v1` to repair the repository-operation intake bootstrap liveness defect.

The package may only execute the existing canonical intake gate at `tools/operation-intake/repository-operation-intake-gate.v1.mjs` with blob `f0b22e6b9574507632f1ad07647710971a4d63de`. It may not reproduce admission logic, edit the lock ledger directly, create branches, mutate implementation files, mutate pull requests, merge, deploy, release, or rewrite an admission result.

The construction branch is inactive. Activation and merge require a separate checkpoint and separate authority. Only the exact paths in `construction-manifest.v1.json` belong to this construction operation.
