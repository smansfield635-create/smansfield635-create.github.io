# Compass Studio copy sync

Canonical maintenance seam for the Compass Studio paragraph.

Use this tool instead of hand-editing the three dependent surfaces:

```bash
node tools/compass-studio-copy-sync.mjs --apply --text-file /tmp/studio-paragraph.txt
```

The apply mode is transactional and fail-closed. It requires a clean worktree, then atomically:

1. updates the Studio paragraph in `index.html`;
2. updates the runtime-owned Studio paragraph in `assets/compass/compass.readiness-context-v1.js`;
3. derives the cache token from the resulting runtime file's Git blob SHA prefix;
4. writes that same asset identity into `index.html` and `.github/ai-router/publication-surfaces/compass-gen1862.json`;
5. requires the resulting diff to contain exactly those three files and no others.

Verification:

```bash
node tools/compass-studio-copy-sync.mjs --verify --text-file /tmp/studio-paragraph.txt
```

For a committed candidate:

```bash
node tools/compass-studio-copy-sync.mjs --verify --text-file /tmp/studio-paragraph.txt --base <base-sha> --head <candidate-sha>
```

Self-test:

```bash
node tools/compass-studio-copy-sync-self-test.mjs tools/compass-studio-copy-sync.mjs
```

Successful execution returns `COMPASS_STUDIO_COPY_SYNC_RECEIPT_v1` with `PASS_CLOSED`. Do not manually synchronize one owner at a time when this seam is available.
