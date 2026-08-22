# PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL_v2

## Purpose

This record exists to prevent small page changes from turning into repeated multi-room recovery cycles.

The governing operational sequence for any public page change is:

`RESOLVE CURRENT HEAD -> PIN EXACT SHA -> DIRECT SOURCE READBACK -> TRACE LIVE AUTHORITY -> CHANGE SMALLEST AUTHORITATIVE SURFACE -> VERIFY SOURCE -> MERGE -> AUTO-PUBLISH -> VERIFY PUBLIC EXACT SHA -> VERIFY LIVE BEHAVIOR`

A room is not finished at search result, commit, PR, merge, deploy, cache-bust, CI success, or documentation update. Completion requires the intended behavior to be visible and functional on the live page.

## Source-authority and freshness rule

The controlling cross-repository source protocol is:

`docs/SOURCE_AUTHORITY_AND_INDEX_FRESHNESS_PROTOCOL.md`

GitHub code search is discovery only. Every current-state conclusion must first resolve the current `main` SHA and directly read decision-critical files at that exact SHA.

A search result whose URL embeds a different commit than the governing SHA is `INDEX_STALE_FOR_CURRENT_HEAD`. It may explain history but may not establish current implementation state.

`NO SEARCH RESULT` is never proof that a current file/function does not exist. Absence requires exact-ref readback, exact tree/directory inspection, or an explicit compare proving removal.

A multi-file audit must use one pinned SHA. If `main` advances during the audit, finish the pinned snapshot, compare it to new `main`, and carry the result forward only when the cumulative change is proven disjoint from the audited dependency surface. Otherwise re-read the affected files at the new exact head.

Documentation is contract/history evidence, not a self-updating source snapshot. If documentation and exact-ref source disagree about what currently exists, exact-ref source controls implementation state and the documentation contradiction must be classified and repaired if it purports to describe current authority.

A filtered workflow lookup is not exhaustive. An empty PR-triggered run lookup, for example, cannot prove that no push-triggered release occurred.

## Core distinction: source, publication, and behavior

These are separate questions and must be proven separately.

1. **What bytes are actually in the governing repository generation?**
   - resolve current `main`;
   - pin its exact SHA;
   - read the relevant source directly at that SHA;
   - do not infer current state from a lagging search index.

2. **Are the intended bytes live?**
   - exact approved/main SHA is published;
   - `.well-known/dgb-release.json` returns that exact SHA;
   - the relevant root asset identity is current where cache identity matters.

3. **Do those live bytes control the intended behavior?**
   - the code is attached to the actual controller/state/layout authority;
   - the state signal being observed is actually emitted where the code expects it;
   - the CSS selector targets the element whose rendered bounds cause the defect;
   - the live interaction visibly changes as intended.

Never infer question 3 from a PASS on question 2, and never infer question 1 from code search.

## Live-authority-first rule

Before changing behavior, identify the exact live authority that owns it.

For state/interaction defects, trace:

`input event -> controller/renderer transaction -> authoritative state channel -> presentation consumer -> visible result`

For layout defects, trace:

`viewport -> exact rendered child bounds -> containing block -> active CSS declaration -> visible offset`

Do not patch an ancestor merely because it is nearby. Do not observe a dataset attribute unless the controller actually publishes that attribute. Do not add a second observer, click handler, state machine, or compensating presentation layer when an existing controller transaction owns the behavior.

## Direct-authority repair rule

When the existing controller/renderer already computes the desired result, fix the release/commit transaction there.

Preferred:

`existing controller state -> existing commit path -> existing presentation owner`

Avoid:

`controller state -> inferred DOM proxy -> MutationObserver -> second commit bridge -> presentation`

A bridge is acceptable only when the authoritative state is deliberately exposed through that bridge contract and no direct owner exists.

## Layout targeting rule

A visual alignment change must identify the exact rendered element producing the offset before CSS mutation.

Required evidence:

- viewport width/height;
- target element selector;
- target bounding rectangle;
- parent/containing-block rectangle;
- active margin/transform/width/position declarations;
- comparison against the intended centered/aligned reference.

If a parent is already centered, do not center it again. Correct the biased child or the declaration actually creating the bias.

## Cache and bootstrap rule

Cache is not a default explanation.

Use a cache/root bootstrap identity change only when the changed runtime asset can otherwise retain an old URL identity. Once an exact-head deployment and fresh root identity are proven, cache/CDN/device explanations are closed for that cycle.

After that point, unchanged behavior is a product-authority problem until contrary evidence appears.

## Publication rule

The automatic release path restored in PR #1621 is the default path for accepted `main` changes.

Expected sequence:

`MERGE TO MAIN -> AI Entry / automatic exact-head release -> checkout exact github.sha -> stage bounded Pages payload -> stamp release marker -> deploy -> verify public marker`

Do not create a separate deployment carrier, dummy release commit, release-branch nudge, or manual-owner deployment step for an ordinary accepted page change.

The fallback AI-entry exact-head dispatch capability may be used when the automatic release path requires recovery, but it must still target exact current approved `main` and must end in public exact-SHA verification.

## Acceptance ladder

Every page-change cycle should record these states separately:

- `GOVERNING_SHA_RESOLVED`
- `EXACT_REF_SOURCE_READBACK_COMPLETE`
- `SEARCH_INDEX_FRESHNESS_CLASSIFIED`
- `SOURCE_CHANGE_PRESENT`
- `AUTHORITATIVE_WIRING_PROVEN`
- `SOURCE_SANITY_PASS`
- `MERGED_EXACT_CANDIDATE`
- `PUBLIC_EXACT_SHA_VERIFIED`
- `LIVE_BEHAVIOR_PASS` or `LIVE_BEHAVIOR_FAIL`

Do not collapse these into one statement such as “deployed” or “done.”

## Failure branching

If source/search evidence conflicts:

- resolve current `main` directly;
- pin that SHA;
- direct-read the disputed files at that SHA;
- classify older search refs as stale rather than reopening architecture;
- compare only if `main` moved after the pinned snapshot.

If `PUBLIC_EXACT_SHA_VERIFIED` fails:

- investigate publication, release workflow, target SHA, staging, or cache identity;
- do not rewrite product logic merely to force a visible difference.

If `PUBLIC_EXACT_SHA_VERIFIED` passes but `LIVE_BEHAVIOR_PASS` fails:

- publication/cache ambiguity is closed;
- inspect state ownership, event wiring, selector accuracy, stacking/layout authority, and runtime execution;
- do not add another cache-bust or deployment layer unless new evidence reopens publication ambiguity.

If two simple fixes in the same runtime surface both produce no visible effect after exact-head publication, first test whether both were attached to the wrong authority before assuming two independent product failures.

## Compass lessons — 2026-08-22

Two separate precedents now control.

### Product-authority precedent

The Compass settlement patch listened for `data-orbit-gesture-active` on `[data-compass-root]`, but the controller did not publish that field as the expected root dataset transition. The patch therefore waited on a non-authoritative/non-emitted state signal.

The tablet patch centered already-centered outer containers rather than first identifying the exact child producing the left bias.

The correct interpretation was:

`LIVE BYTES CORRECT + WRONG STATE CHANNEL + WRONG LAYOUT LEVEL`

not deployment failure.

### Source-index precedent

A later audit compared a page-specific document with GitHub code-search results indexed at an older commit while `main` had already advanced. Direct exact-ref readback showed that current source contained a renderer/controller release path absent from the older evidence context.

The correct interpretation was:

`PROJECT CONTEXT INTACT + SEARCH INDEX STALE + MIXED-SNAPSHOT COMPARISON`

not a missing construction cycle.

## Compass-specific state precedent

For the constellation, Laws remains the direct interaction precedent:

`gesture begin -> preview -> controller commit/cancel -> canonical settled orientation -> semantic ownership`

All four cardinal stars remain present. Exactly one settled/foreground cardinal owns the readable label.

Preview is not semantic selection. Release settlement belongs in the existing controller/renderer release transaction that already knows the nearest forward cardinal, not in a second observer-derived state machine.

## Room handoff requirement

Any room continuing page work must begin from repository evidence, not conversation memory alone.

At minimum it must:

1. resolve exact current `main`;
2. pin that SHA for the audit;
3. read `docs/SOURCE_AUTHORITY_AND_INDEX_FRESHNESS_PROTOCOL.md`;
4. read this protocol;
5. read the page-specific takeover/audit record;
6. direct-read decision-critical product files at the pinned SHA;
7. classify any code-search result against that SHA before using it;
8. read exact current live/publication evidence when release state matters.

A room must not reopen a closed branch of diagnosis without new contradictory evidence.

## Completion definition

For ordinary page work, the user should only need to describe the desired change and inspect the result.

Engineering completion means:

`PINNED SOURCE AUTHORITY + AUTHORITATIVE CHANGE + EXACT PUBLICATION + LIVE BEHAVIORAL PROOF`

Anything less is an intermediate state and must be described as such.