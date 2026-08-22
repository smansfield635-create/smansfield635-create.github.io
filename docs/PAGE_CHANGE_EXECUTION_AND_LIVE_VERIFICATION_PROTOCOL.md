# PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL_v1

## Purpose

This record exists to prevent small page changes from turning into repeated multi-room recovery cycles.

The governing operational sequence for any public page change is:

`TRACE LIVE AUTHORITY -> CHANGE SMALLEST AUTHORITATIVE SURFACE -> VERIFY SOURCE -> MERGE -> AUTO-PUBLISH -> VERIFY PUBLIC EXACT SHA -> VERIFY LIVE BEHAVIOR`

A room is not finished at commit, PR, merge, deploy, cache-bust, or CI success. Completion requires the intended behavior to be visible and functional on the live page.

## Core distinction: publication versus behavior

These are separate questions and must be proven separately.

1. **Are the intended bytes live?**
   - exact approved/main SHA is published;
   - `.well-known/dgb-release.json` returns that exact SHA;
   - the relevant root asset identity is current where cache identity matters.

2. **Do those live bytes control the intended behavior?**
   - the code is attached to the actual controller/state/layout authority;
   - the state signal being observed is actually emitted where the code expects it;
   - the CSS selector targets the element whose rendered bounds cause the defect;
   - the live interaction visibly changes as intended.

Never infer question 2 from a PASS on question 1.

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

- `SOURCE_CHANGE_PRESENT`
- `AUTHORITATIVE_WIRING_PROVEN`
- `SOURCE_SANITY_PASS`
- `MERGED_EXACT_CANDIDATE`
- `PUBLIC_EXACT_SHA_VERIFIED`
- `LIVE_BEHAVIOR_PASS` or `LIVE_BEHAVIOR_FAIL`

Do not collapse these into one statement such as “deployed” or “done.”

## Failure branching

If `PUBLIC_EXACT_SHA_VERIFIED` fails:

- investigate publication, release workflow, target SHA, staging, or cache identity;
- do not rewrite product logic merely to force a visible difference.

If `PUBLIC_EXACT_SHA_VERIFIED` passes but `LIVE_BEHAVIOR_PASS` fails:

- publication/cache ambiguity is closed;
- inspect state ownership, event wiring, selector accuracy, stacking/layout authority, and runtime execution;
- do not add another cache-bust or deployment layer unless new evidence reopens publication ambiguity.

If two simple fixes in the same runtime surface both produce no visible effect after exact-head publication, first test whether both were attached to the wrong authority before assuming two independent product failures.

## Compass lesson — 2026-08-22

The Compass release-settlement and tablet-context cycle provides the controlling example.

The settlement patch listened for `data-orbit-gesture-active` on `[data-compass-root]`, but the controller did not publish that field as the expected root dataset transition. The patch therefore waited on a non-authoritative/non-emitted state signal and its release path never became active.

The tablet patch centered `.compass-estate__header`, `.compass-statement-orbit`, and `.compass-editorial-intro`, while the relevant statement stage already centered its own content. The patch therefore changed the wrong layout level and did not prove the exact child producing the left bias.

The correct interpretation was:

`LIVE BYTES CORRECT + WRONG STATE CHANNEL + WRONG LAYOUT LEVEL`

not:

`DEPLOYMENT FAILED`

and not:

`TWO SIMPLE FIXES MYSTERIOUSLY FAILED`.

## Compass-specific state precedent

For the constellation, Laws remains the direct precedent:

`gesture begin -> preview -> controller commit/cancel -> canonical settled orientation -> semantic ownership`

All four cardinal stars remain present. Exactly one settled/foreground cardinal owns the readable label.

Preview is not semantic selection. Release settlement belongs in the existing controller/renderer release transaction that already knows the nearest forward cardinal, not in a second observer-derived state machine.

## Room handoff requirement

Any room continuing page work must begin from repository evidence, not conversation memory alone.

At minimum it must read:

1. this protocol;
2. the page-specific takeover/audit record;
3. current `main`;
4. the exact current live/publication evidence when release state matters.

A room must not reopen a closed branch of diagnosis without new contradictory evidence. Examples:

- once exact SHA and fresh bootstrap identity are proven, do not blame cache again;
- once a state signal is proven absent from the observed DOM channel, do not keep adding observers to that channel;
- once a parent is proven centered, do not keep applying centering rules to that parent.

## Completion definition

For ordinary page work, the user should only need to describe the desired change and inspect the result.

Engineering completion means:

`AUTHORITATIVE CHANGE + EXACT PUBLICATION + LIVE BEHAVIORAL PROOF`

Anything less is an intermediate state and must be described as such.