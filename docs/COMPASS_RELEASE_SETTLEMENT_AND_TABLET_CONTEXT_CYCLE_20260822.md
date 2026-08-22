# Compass release settlement + tablet context cycle — 2026-08-22

## Scope

This cycle follows the same bounded publication path that successfully delivered the final label-state correction. It changes only two observed live defects:

1. constellation drag preview is correct while the pointer is held, but release can restore the prior committed cardinal instead of settling the cardinal that is forward;
2. the top-of-page Compass context/header region is visually biased left at tablet widths.

The second item does **not** authorize movement of the interactive constellation stage. The user's clarification is controlling: center the top-page context, not the Compass scene.

## Release-settlement diagnosis

The renderer already computes the nearest forward cardinal during drag and the controller already publishes two distinct state channels:

- `data-orbit-preview-focus` — current preview cardinal during manipulation;
- `data-orbit-focus` — committed settled cardinal.

The visible failure occurs at release: a valid preview can exist while the pointer is held, then the committed state remains/restores the prior cardinal. The correction therefore does not invent new geometry or a second snap calculation.

## Release-settlement correction

`assets/compass/compass.capability-carousel.js` now records the last valid `data-orbit-preview-focus` while `data-orbit-gesture-active=true`. When that same constellation gesture ends, it compares the last preview cardinal with committed `data-orbit-focus`.

- If the controller already committed the same cardinal, no action occurs.
- If release left a different committed cardinal, the existing controller API `DGB_COMPASS_CONTROLLER.requestOrbitFocus()` is invoked for the last forward cardinal.

This is a release-boundary completion bridge only. Controller authority remains canonical; renderer geometry and snap math are unchanged.

Receipt: `DGB_COMPASS_RELEASE_SETTLEMENT_BINDING`.

Policy: `RELEASE_COMMITS_LAST_FORWARD_CARDINAL_UNLESS_ALREADY_COMMITTED`.

## Tablet top-context correction

At 561–1024 px widths, the top context containers are explicitly centered with symmetric inline margins and bounded width:

- `.compass-estate__header`
- `.compass-statement-orbit`
- `.compass-editorial-intro`

No selector in this correction repositions `[data-compass-scene]` or the constellation geometry.

## Non-scope

- no Mirrorland change;
- no Laws change;
- no cardinal label-policy change;
- no route/navigation change;
- no readiness/capability redesign;
- no interactive scene translation;
- no publication-infrastructure change.

## Acceptance sequence

`CHANGE -> VERIFY -> MERGE -> AUTO-PUBLISH -> VERIFY LIVE -> OWNER VISUAL CHECK`

Live acceptance:

1. drag a constellation cardinal forward and hold: preview remains responsive;
2. release: the nearest/forward cardinal settles rather than returning to the old one;
3. repeated North/East/South/West transitions remain stable after release;
4. exactly one settled readable label continues to follow `data-orbit-focus`;
5. on tablet, the top context/header reads centered rather than left-biased;
6. the interactive constellation stage itself has not been shifted by the context correction;
7. Mirrorland and the previously accepted lower-page behavior remain unchanged.

Publication remains owned by the automatic exact-head release restored by PR #1621. The room remains responsible through live verification.