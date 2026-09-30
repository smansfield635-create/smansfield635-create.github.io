# Compass release settlement + tablet context cycle — 2026-08-22

## Scope

This cycle follows the bounded publication path that carried the changes to the live site. It targeted two observed defects:

1. constellation drag preview is correct while the pointer is held, but release can restore the prior committed cardinal instead of settling the cardinal that is forward;
2. the top-of-page Compass context/header region is visually biased left at tablet widths.

The second item does **not** authorize movement of the interactive constellation stage. Center the top-page context, not the Compass scene.

## Original release-settlement diagnosis

The renderer already computes the nearest forward cardinal during drag and the controller publishes preview and committed orientation state.

The original repair attempted to bridge release settlement from `assets/compass/compass.capability-carousel.js` by watching DOM attributes and then calling the existing controller API.

## Original release-settlement correction — now classified FAIL

The bridge recorded `data-orbit-preview-focus` while it expected `data-orbit-gesture-active=true` on `[data-compass-root]`, then intended to call `DGB_COMPASS_CONTROLLER.requestOrbitFocus()` when that gesture flag became false.

Post-publication audit established that the controller does **not** publish `orbitGestureActive` through the expected root dataset attribute. The authoritative gesture-active state exists in the controller state/receipt instead.

Therefore:

`gestureWasActive` in the bridge never reliably enters its active state, and the release commit path does not become authoritative.

Classification:

`RELEASE FIX = WIRED TO NON-AUTHORITATIVE / NON-EMITTED DOM STATE SIGNAL`

This is not a cache failure and not a publication failure.

## Correct release-settlement authority

The next repair must live in the existing renderer/controller release transaction that already knows the nearest forward cardinal at pointer release.

Required state path:

`pointer/drag release -> existing nearest-forward-cardinal calculation -> controller commit -> data-orbit-focus / canonical settled orientation -> presentation label`

Do not add another MutationObserver bridge. Do not infer release from a DOM attribute that the controller does not publish. Do not create a second snap calculation if the renderer/controller already has the correct nearest-forward cardinal.

## Original tablet top-context correction — now classified FAIL

The original CSS centered these containers at 561–1024 px:

- `.compass-estate__header`
- `.compass-statement-orbit`
- `.compass-editorial-intro`

Post-publication audit established that the statement-orbit runtime already centers its own stage/content with symmetric auto margins. The correction therefore operated largely at an already-centered outer level and did not prove which rendered child actually creates the tablet left bias.

Classification:

`TABLET FIX = APPLIED TO WRONG LAYOUT LEVEL`

This is not evidence that centering is impossible. It is evidence that the wrong element was mutated.

## Correct tablet authority

Before the next CSS change, capture the exact live child producing the bias:

- selector;
- bounding rectangle;
- containing-block rectangle;
- active width, margin, transform, position and inset rules;
- comparison with the intended centered reference.

Then change that exact child/declaration only.

If the parent is already centered, do not center the parent again.

## Publication evidence — closed branch

The product changes were merged, the root capability loader was cache-busted, and exact-head publication was subsequently proven live. The publication path reached a current-main exact-SHA release and the public exact-head verification passed.

Therefore, for this cycle:

`NEW FILE = LIVE`

`PUBLICATION/CACHE AMBIGUITY = CLOSED`

`VISIBLE PRODUCT EFFECT = FAIL`

Do not reopen cache, CDN, device-cache, or publication as the explanation for these two defects unless new contradictory evidence appears.

## Governing lesson

The contradiction is resolved as:

`LIVE BYTES CORRECT + WRONG STATE CHANNEL + WRONG LAYOUT LEVEL`

not:

`DEPLOYMENT FAILED`

and not:

`TWO SIMPLE FIXES MYSTERIOUSLY FAILED`.

This cycle is now the Compass-specific example for `docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`.

## Non-scope for the next correction

- no cache work;
- no publication-infrastructure work;
- no new observer;
- no second state machine;
- no Mirrorland change unless separately evidenced;
- no Laws change;
- no route/navigation change;
- no readiness/capability redesign;
- no speculative movement of the interactive constellation stage.

## Next acceptance sequence

`TRACE ACTUAL AUTHORITY -> DIRECT PATCH -> SOURCE SANITY -> MERGE -> AUTO-PUBLISH -> PUBLIC EXACT-SHA VERIFY -> LIVE BEHAVIOR VERIFY`

Live acceptance:

1. drag a constellation cardinal forward and hold: preview remains responsive;
2. release: the nearest/forward cardinal settles rather than returning to the old one;
3. repeated North/East/South/West transitions remain stable after release;
4. exactly one settled readable label continues to follow canonical settled `data-orbit-focus` while all four stars remain present;
5. on tablet, the actual biased child is centered/aligned as intended;
6. the interactive constellation stage itself has not been shifted by the context correction;
7. Mirrorland and previously accepted lower-page behavior remain unchanged.

Publication remains automatic for accepted `main` changes. The room remains responsible through public exact-SHA proof and live behavioral verification.