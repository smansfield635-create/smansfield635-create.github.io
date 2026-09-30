# COMPASS_TAKEOVER_BOUNDARY_v7

## Authority

This file is a page-specific takeover contract, not a self-updating substitute for source readback.

Before any Compass audit or mutation, resolve current `refs/heads/main`, pin the exact SHA, and direct-read the decision-critical Compass files at that SHA. GitHub code search is discovery only and may lag current `main`.

The controlling source-freshness protocol is:

`docs/SOURCE_AUTHORITY_AND_INDEX_FRESHNESS_PROTOCOL.md`

The controlling cross-page execution protocol is:

`docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`

At the 2026-08-22 indexing incident, direct branch authority showed current `main` at `cf5d751049159621f2b206206c4461fe288babd4` while Compass code-search results were still bound to `13edc454c33aa31c037b966bb9d06744abd38280`. The mismatch was therefore an index-freshness problem, not lost project context.

Do not treat the literal SHA above as current after this timestamp; always re-resolve `main`.

## Laws precedent

The Laws Compass remains the direct interaction/state precedent:

`gesture begin -> preview -> controller commit/cancel -> canonical settled orientation -> semantic ownership`

For the main Compass:

**ALL FOUR CARDINAL STARS PRESENT + ONE SETTLED READABLE LABEL.**

Preview motion is not semantic selection.

## State/navigation authority

`assets/compass/compass.controller.js` remains the canonical state/navigation authority for the main Compass state machine. Presentation helpers render controller state; they must not establish competing state machines.

The current implementation must be assessed from exact-ref source, not from this document's historical description.

## Release-settlement authority

The failed Gen1592 bridge established an important negative precedent: a helper must not infer gesture completion from a DOM dataset field unless the controller actually publishes that field.

The required architecture is direct-authority settlement:

`renderer/controller release transaction -> nearest forward cardinal -> canonical controller commit -> settled label presentation`

No additional MutationObserver release bridge should be introduced when the renderer/controller release transaction already owns the gesture and forward-cardinal calculation.

If exact-current source already contains a direct release path such as `finishConstellationDrag() -> nearestPrimaryWing() -> settledConstellationQuaternion() -> controller commit`, do not reopen a construction task merely because an older audit document predates it. Verify the exact-current implementation and its live behavior instead.

## Tablet layout authority

The failed tablet centering patch established the corresponding layout precedent: do not center an already-centered ancestor and assume the visible bias is fixed.

Before mutation identify the exact biased rendered child and record:

- viewport dimensions;
- target selector;
- target bounding rectangle;
- parent/containing-block rectangle;
- active width/margin/transform/position declarations;
- intended alignment reference.

Correct the declaration/element actually producing the offset. Do not move the interactive Compass scene unless rendered evidence identifies the scene itself as the source.

## Cardinal label authority

All four star bodies remain rendered. Exactly one settled/foreground cardinal owns the readable label. Inactive labels leave visual/focus/pointer ownership without removing the underlying star geometry.

A blank inactive label shell is not acceptable. A second presentation observer that reverses another owner's state is not acceptable.

## Mirrorland contract

Mirrorland passes only when:

1. the surrounding page is suppressed while the four decisions become the sole interaction authority;
2. the chooser remains crisp/unfiltered above its backdrop;
3. Narrative reaches `/showroom/`;
4. Demo reaches `/showroom/globe/h-earth/`;
5. World Map reaches `/showroom/globe/audralia/`;
6. Return removes chooser/backdrop ownership before Compass restoration;
7. no underlying stale control/focus target competes with the chooser;
8. navigation remains under declared/controller authority rather than a duplicate capture-phase shim.

## Source/index freshness boundary

The following evidence order is mandatory for current-state Compass work:

1. current branch-head resolution;
2. exact-ref direct readback of affected Compass source;
3. exact commit/compare evidence where ancestry matters;
4. documentation as contract/history evidence;
5. code search only as discovery/supporting evidence after its embedded ref is checked against the governing SHA;
6. publication exact-SHA evidence;
7. live rendered/interaction evidence.

If search is older than the governing SHA, classify `INDEX_STALE_FOR_CURRENT_HEAD` and continue with exact-ref source. Do not infer project stall, missing implementation, or architectural rollback from that mismatch.

If `main` advances during a multi-file audit, keep the audit pinned to one snapshot and use differential continuity before carrying results forward.

## Publication boundary

The default page publication path is the automatic exact-head release restored by PR #1621. The fallback AI-entry exact-head dispatch remains a recovery path.

The publication sequence is:

`MERGE TO MAIN -> AUTOMATIC EXACT-HEAD RELEASE -> PUBLIC RELEASE MARKER == TARGET SHA -> LIVE BEHAVIORAL VERIFICATION`

Publication success does not establish behavioral success. Conversely, after exact-SHA publication is proven, unchanged behavior stays in product-authority diagnosis unless new evidence reopens publication ambiguity.

## Preserved surfaces

The 19/19 foreground-star -> information coverage was previously closed and should not be re-proven absent regression evidence.

Brain/Trophy/House should be preserved unless new evidence identifies a concrete defect.

TRL/TRA remains subject to whole-page carousel continuity and regression qualification.

## Acceptance

Acceptance is whole-page and behavioral, not patch-local.

Required distinctions:

- exact governing SHA resolved;
- exact-ref source readback complete;
- search-index freshness classified;
- source exists at exact governing SHA;
- source is wired to actual authority;
- exact candidate is merged;
- exact SHA is published;
- intended rendered/interactive behavior passes.

A successor is not accepted merely because named defects were edited, CI passed, or a deployment succeeded.

## Evidence spine

Read in this order:

1. `docs/SOURCE_AUTHORITY_AND_INDEX_FRESHNESS_PROTOCOL.md`
2. `docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`
3. `docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md`
4. `docs/COMPASS_RELEASE_SETTLEMENT_AND_TABLET_CONTEXT_CYCLE_20260822.md`
5. `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md`
6. `docs/MASTER_PAGE_AND_COMPASS_CONTINUITY_LEDGER.md`
7. `docs/PUBLICATION_AUTHORITY_BOUNDARY.md`

Any current-state conclusion must resolve against exact-current source first. Historical documents remain useful evidence but may not override a newer exact-ref implementation.

## Completion law

For this page:

`PINNED SOURCE AUTHORITY + AUTHORITATIVE PRODUCT CHANGE + EXACT PUBLICATION + LIVE BEHAVIORAL PROOF = COMPLETE`

Anything less is an intermediate state.