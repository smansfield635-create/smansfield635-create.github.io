# COMPASS_TAKEOVER_BOUNDARY_v6

## Authority

This boundary supersedes the earlier Gen1589-only stopping point. The Compass has since crossed deterministic bootstrap repair, automatic publication restoration, exact-head publication proof, and a later failed release-settlement/tablet-context correction.

The current controlling records are:

1. `docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md`
2. `docs/COMPASS_RELEASE_SETTLEMENT_AND_TABLET_CONTEXT_CYCLE_20260822.md`
3. `docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`
4. `docs/PUBLICATION_AUTHORITY_BOUNDARY.md`
5. `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md`
6. `docs/MASTER_PAGE_AND_COMPASS_CONTINUITY_LEDGER.md`

Conversation memory is not execution proof.

## Settled Laws precedent

The Laws page remains the direct interaction/state precedent:

`gesture begin -> preview -> controller commit/cancel -> canonical settled orientation -> semantic ownership`

Preview motion is not semantic selection.

For the main Compass constellation:

**ALL FOUR CARDINAL STARS PRESENT + EXACTLY ONE SETTLED READABLE LABEL.**

The inactive three labels leave visual/focus/pointer ownership, but the star bodies remain present.

## Ownership invariant

One controller state owner. One presentation owner for each visual surface. One active text/label owner per text region. Presentation helpers render canonical state; they do not establish a parallel state machine.

A second observer, click handler, navigation shim, or compensating presentation layer is not an acceptable substitute when the existing controller/renderer transaction already owns the behavior.

## Gen1591/bootstrap lesson — closed

The earlier source-to-live ambiguity was real: product source could merge without becoming the deterministic runtime owner. Gen1591 corrected the root bootstrap/presentation ownership chain, and PR #1621 restored automatic exact-head publication for accepted `main` pushes.

That publication architecture is now recorded separately in `docs/PUBLICATION_AUTHORITY_BOUNDARY.md`.

Do not reopen the old “merge versus publish” or stale-root-bootstrap branch of diagnosis without new contradictory evidence.

## Current release-settlement diagnosis

A later bounded correction attempted to make the nearest/forward cardinal remain settled after drag release.

The implementation added a bridge in `assets/compass/compass.capability-carousel.js` that expected `data-orbit-gesture-active` to transition on `[data-compass-root]`.

Post-live audit established that this is not the authoritative emitted DOM state channel. Gesture-active state exists inside controller state/receipt rather than as the expected root dataset transition.

Result:

`RELEASE FIX = WIRED TO NON-AUTHORITATIVE / NON-EMITTED SIGNAL`

The next repair must be placed directly in the renderer/controller release transaction that already knows the nearest forward cardinal.

Required path:

`pointer release -> existing nearest-forward-cardinal result -> controller commit -> canonical data-orbit-focus -> one readable settled label`

Do not add another MutationObserver bridge. Do not create a second snap calculation.

## Current tablet-layout diagnosis

The same cycle attempted to center tablet top-context by centering:

- `.compass-estate__header`
- `.compass-statement-orbit`
- `.compass-editorial-intro`

Post-live audit established that the statement-orbit stage already centers its own content. The correction therefore operated at the wrong layout level and did not identify the exact rendered child producing the left bias.

Result:

`TABLET FIX = APPLIED TO WRONG LAYOUT LEVEL`

Before further CSS mutation, identify the exact biased child and record its bounding rectangle, containing-block rectangle, and active width/margin/transform/position/inset declarations. Correct that child/declaration only.

If an ancestor is already centered, do not center it again.

## Publication/cache branch — closed for the failed cycle

The release-settlement/tablet-context product changes were present in the live lineage. The root capability-loader URL was advanced to a fresh identity. Exact-head publication was subsequently proven through the Pages release marker and live verification.

Therefore the governing interpretation of that failed cycle is:

`LIVE BYTES CORRECT + WRONG STATE CHANNEL + WRONG LAYOUT LEVEL`

not:

`DEPLOYMENT FAILED`

and not:

`CACHE FAILED`.

No further cache-bust or publication-infrastructure work is authorized for those two defects unless new evidence reopens that branch.

## Mirrorland standing contract

Mirrorland remains governed by the earlier audit unless newer rendered evidence explicitly supersedes it.

Acceptance requires:

1. background suppression while the four decisions become the sole interaction authority;
2. chooser itself remains crisp/unfiltered;
3. Narrative reaches `/showroom/`;
4. Demo reaches `/showroom/globe/h-earth/`;
5. World Map reaches `/showroom/globe/audralia/`;
6. Return removes chooser/backdrop ownership before Compass restoration;
7. no duplicate navigation or focus owner competes with the active chooser.

Do not redesign Mirrorland merely while correcting release settlement or tablet alignment.

## Other preserved surfaces

The 19/19 foreground-star -> information coverage was previously closed and should not be re-proven absent regression evidence.

Brain/Trophy/House should be preserved unless new evidence identifies a concrete defect.

TRL/TRA remains subject to whole-page carousel continuity and regression qualification.

## Governing cross-page execution protocol

Every further Compass change must use:

`docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`

The required cycle is:

`TRACE LIVE AUTHORITY -> CHANGE SMALLEST AUTHORITATIVE SURFACE -> VERIFY SOURCE -> MERGE -> AUTO-PUBLISH -> VERIFY PUBLIC EXACT SHA -> VERIFY LIVE BEHAVIOR`

The room must record these states separately:

- `SOURCE_CHANGE_PRESENT`
- `AUTHORITATIVE_WIRING_PROVEN`
- `SOURCE_SANITY_PASS`
- `MERGED_EXACT_CANDIDATE`
- `PUBLIC_EXACT_SHA_VERIFIED`
- `LIVE_BEHAVIOR_PASS` or `LIVE_BEHAVIOR_FAIL`

Do not call a cycle complete merely because source, merge, workflow, or deployment passed.

## Next bounded Compass correction

The next correction is narrow:

1. trace the actual pointer-release transaction in the renderer/controller;
2. commit the already-known nearest forward cardinal in that authoritative transaction;
3. remove/retire the ineffective observer-derived release bridge when the direct owner is in place;
4. inspect the exact live tablet child producing the left bias;
5. correct that exact layout declaration only;
6. regression-check four-cardinal one-label semantics, Mirrorland, and preserved lower-page behavior;
7. merge through the normal accepted path;
8. allow automatic exact-head publication;
9. verify public exact SHA;
10. verify the actual live behavior before declaring success.

## Completion law

For this page:

`AUTHORITATIVE PRODUCT CHANGE + EXACT PUBLICATION + LIVE BEHAVIORAL PROOF = COMPLETE`

Anything less is an intermediate state.