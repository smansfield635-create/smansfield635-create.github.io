# Website-building room source custody

Status: source handoff only.

This directory preserves thread-derived source material from the Rich Manor and Estate / Website Building and Implementation room so later repository-native systems can consume it without relying only on conversation memory.

This custody set is intentionally docs-only. It creates no runtime mutation, no public-surface mutation, no registry mutation, no Pages publication authority, and no deployment request.

## AI Entry boundary

The repository `AI_ENTRYPOINT.json` was consulted before this custody branch was opened. The relevant controlling reads for this work are:

- the repository AI entrypoint is active fail-closed;
- conversation memory is not required for normal repository operation, therefore important room/thread material must be made repository-resident before it can be treated as durable source;
- GitHub Actions are not authorized as an agent-execution substitute;
- native/connected GitHub API work is the preferred execution surface when available;
- merge and publication authority are not created by this docs-only handoff.

## Scope in this directory

This directory preserves:

1. PSALM hierarchy and terminology custody;
2. ACK_PACK and quadrilateral routing law;
3. thread artifact custody index for items recovered in this room;
4. AI Entry source-custody receipt for this docs-only preservation branch.

## Explicit exclusions

This directory does not create or modify:

- `AI_ENTRYPOINT.json`;
- `.github/ai-router/` router state;
- runtime JavaScript;
- public page HTML/CSS;
- gauges;
- character registry files;
- issue #2378 character-registry source assembly.

Character-registry material remains separate from this room/source-custody path unless a later authorized registry operation explicitly consumes it.

## Terminology lock

Canonical term: `PSALM`.

Forbidden canonical substitutions in this custody set: `SONG`, `SOM`, `SUN`, `SON`.

Canonical packet term: `ACK_PACK`.

`ACT_PACK` is not the canonical term for this room's route packet unless a later owner-authorized source explicitly rebinds it.
