# Compass emergency recovery guardrail — 2026-08-20

This directory is under an active emergency recovery boundary for the main Compass page.

## Immediate recovery objective

Restore the main Compass to the last known-good Track A presentation/runtime without reverting unrelated repository work.

Permitted recovery actions are narrowly bounded to the Compass presentation/runtime files implicated in the Track B experiment. Preserve unrelated H-Earth, Audralia, Pages publication-authority, governance, evidence, and other estate work.

The known-good Track A reference used for file-level comparison is:

`734498affe60b36e412337c1b3be947565ab5859`

This is a file-level recovery reference, not authority to reset or roll back the repository to that commit.

## Required preservation

Do not revert or replace `assets/compass/compass.gen1537.recovery.js` as part of the Track B rollback. Its later H-Earth direct-route correction prevents reintroduction of the raw.githack.com external-content intercept.

Do not roll back `main`, do not reset unrelated files to the Track A commit, and do not use a repository-wide revert as an emergency shortcut.

## Track B rollback boundary

The Track B experiment introduced presentation/runtime authority through:

- modifications to `assets/compass/compass.capability-carousel.js` that dynamically load Track B;
- `assets/compass/compass.track-b.js`;
- `assets/compass/compass.track-b.css`.

Emergency recovery should restore the Track A capability runtime and remove the Track B runtime assets and loader behavior only, subject to exact diff verification.

Before merge or publication, verify the resulting diff contains no unrelated product/world/governance/deployment changes.

## Successor architecture after recovery

Do not repair Track B by creating another dynamic DOM-reconstruction runtime.

The intended editorial improvements may be rebuilt only after a known-good live Track A recovery is proven. The successor must use static integration:

`static Compass HTML -> existing Compass DOM -> existing interaction controllers`

The successor must not use:

- subtree-wide `MutationObserver` reconciliation for presentation construction;
- live movement/reparenting of existing Compass interactive nodes after boot;
- dynamic loading of a second presentation runtime from the capability carousel;
- duplicate authority over Compass guidance or navigation state;
- runtime creation/replacement of the upper-page narrative shell when equivalent markup can exist statically;
- changes to Track A carousel behavior solely to achieve editorial layout.

The approved editorial goals remain valid: stronger Compass title treatment, Chapter One introduction, expandable Diamond Gate explanation, clearer upper-page hierarchy, operating guidance, and a cleaner transition into the capability carousel. Implement those goals as static HTML/CSS around the known-good interactive core.

## Verification boundary

A recovery is not complete merely because the repository diff looks correct. Before any successor presentation work begins, obtain live confirmation that the main Compass page renders coherently on the public domain and that the core Compass interaction remains usable.

If the recovery branch begins touching unrelated files or reintroducing dynamic Track B reconstruction, stop and re-scope before continuing.
