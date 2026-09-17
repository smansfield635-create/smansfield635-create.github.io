# Compass contextual-copy registry

This is the registered maintenance layer for contextual copy on the Compass.

It does not assume that every paragraph has the same ownership model. Each production block must first be inspected and registered with its exact dependency chain. Unregistered section IDs fail closed.

## Current production registration

`chapter-studio` is the only production registration in v1. It records the dependency chain already proven by the Studio maintenance seam:

- static owner: `index.html`;
- runtime owner: `assets/compass/compass.readiness-context-v1.js`;
- cache identity: derived from the resulting runtime Git blob SHA prefix;
- publication identity: synchronized in `.github/ai-router/publication-surfaces/compass-gen1862.json`;
- expected product diff: exactly those three files.

No other Chapter One block is implicitly registered by this architecture.

## Apply

```bash
node tools/compass-contextual-copy-sync.mjs \
  --section chapter-studio \
  --apply \
  --text-file /tmp/studio-paragraph.txt
```

Apply mode requires a clean worktree. It computes every resulting byte before the first write, updates only the owners declared by the selected registry entry, derives any declared cache identity from content, and fails closed unless the resulting changed-path set exactly matches the registry.

## Verify

```bash
node tools/compass-contextual-copy-sync.mjs \
  --section chapter-studio \
  --verify \
  --text-file /tmp/studio-paragraph.txt
```

For a committed candidate:

```bash
node tools/compass-contextual-copy-sync.mjs \
  --section chapter-studio \
  --verify \
  --text-file /tmp/studio-paragraph.txt \
  --base <base-sha> \
  --head <candidate-sha>
```

## Registering another contextual block

Before adding a production registration, inspect that block once and determine:

1. its canonical static owner;
2. every runtime owner that can replace or mirror the visible copy;
3. any cache/version identity coupled to those runtime bytes;
4. any publication manifest that verifies the identity;
5. the exact expected changed-path set.

Then add a bounded registry entry. Do not infer ownership from nearby sections and do not supply arbitrary paths at runtime.

A static-only block may declare only a `staticOwner` and one expected changed path. A runtime-owned block declares the additional owner and, when applicable, its content-derived asset identity and manifest dependency.

## Self-test

```bash
node tools/compass-contextual-copy-sync-self-test.mjs \
  tools/compass-contextual-copy-sync.mjs \
  tools/compass-contextual-copy-registry.v1.json
```

The self-test proves the real Studio mapping, an isolated static-only fixture, an isolated runtime-owned fixture, content-derived cache synchronization, dirty-worktree rejection, unregistered-section rejection, manifest tamper rejection, and exact-diff rejection when an unrelated path is introduced.

Publication remains a separate step. This registry creates no merge, deployment, or publication authority.
