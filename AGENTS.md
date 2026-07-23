# Repository agent entrypoint

For any operation that touches `/h-earth-3d/` or `/showroom/globe/h-earth/`, automatically execute the H-Earth registry preflight before substantive analysis, construction, editing, deletion, movement, lifecycle change, authority assertion, or integration work. The user does not need to request registry or validator use.

Run:

```text
node --experimental-default-type=module tools/h-earth-repository-registry-auto-preflight.mjs --path <repository-path> [--path <repository-path> ...]
```

For a proposed change, pass `--mutation-intent`. This records that separate mutation authority is required; it does not create that authority. For multiple changed paths, pass every path or use `--paths-file <newline-delimited-file>`.

Honor the emitted disposition:

- `PASS`: continue only within separately established authority.
- `REVIEW_REQUIRED`: report the limitation before continuing.
- `BLOCK`: do not perform the proposed governed action.
- `STOP`: do not proceed until the unresolved scope or identity is corrected.
- `NOT_APPLICABLE`: this H-Earth preflight does not control the operation.

The preflight is read-only. It grants no source, mutation, merge, canonicalization, runtime, renderer, deployment, or production authority. Continue to follow the narrower `AGENTS.md` files below `h-earth-3d/` and `showroom/globe/h-earth/`.
