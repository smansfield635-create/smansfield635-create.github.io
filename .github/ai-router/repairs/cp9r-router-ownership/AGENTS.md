# CP9 exact router-ownership repair

This directory is a nonproduct, separately authorized repair instrument arising from issue #580.

## Exact product

The repair may append only the frozen 22 Operation A paths in `frozen-operation-a-paths.v1.json` to the H-Earth project's `ownedExactPaths` array in `.github/ai-router/router.v1.json`.

## Mandatory boundaries

- Do not add a new owned prefix.
- Do not grant ownership of `.github/**`, `.github/ai-toolset-transport/**`, `tools/**`, or `tools/h-earth-registry-two-path-toolset/**` as prefixes.
- Do not weaken `unregisteredPathPolicy.mutationDisposition = BLOCK`.
- Do not change ambiguity precedence or the router-infrastructure ownership domain.
- Do not register a toolset descriptor or modify any Operation A toolset path.
- Do not create CP9 branch authority, Operation B authority, merge authority, product authority, terrain authority, deployment authority, or release authority.
- Every frozen path must route unambiguously to `H_EARTH` with disposition `PASS`.
- Neighboring undeclared paths must remain `UNREGISTERED/BLOCK`.
- Existing router self-tests must continue to pass.
- Fresh independent verification must reproduce the builder fingerprint before activation can be considered.
