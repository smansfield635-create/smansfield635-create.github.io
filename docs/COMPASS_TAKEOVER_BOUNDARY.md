# COMPASS_TAKEOVER_BOUNDARY_v5

## Authority

**GEN1589 = CURRENT PRODUCT SOURCE BASELINE, NOT ACCEPTED VISUAL SUCCESSOR.**

Gen1589 merged at `76021a66e43aedecd255755bfe5775b7bdb702a8` with the stated purpose `repair final four Compass defects`. A subsequent docs-only audit commit records the missing Laws-page precedent and does not alter product behavior. Publication, source presence, and visual/product qualification remain separate facts.

The controlling supplementary audit is now:

`docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md`

That audit supersedes any prior interpretation that “one label at a time” means hiding three of the four cardinal stars or star owners.

## Current user-observed disposition — 2026-08-22

The newest owner evidence and exact-source audit establish:

- **19/19 foreground-star -> information coverage = PASS.** Do not spend another cycle re-proving the already-closed 19-state path unless a regression is observed.
- **Four-cardinal constellation presentation = FAIL / ownership conflict.** All four star bodies must remain present. Exactly one settled/readable cardinal may own a visible label. The Laws Compass is the direct precedent: full constellation remains present while one projected outer label is active. Gen1588's `EXACTLY_ONE_VISIBLE_CARDINAL_SHELL` policy is therefore not the target behavior, and Gen1589's compensating visibility shim is not an acceptable final ownership architecture.
- **Brain/Trophy/House capability carousel = presently acceptable.** Preserve it unless regression evidence identifies a concrete defect; it is not the primary next-cycle target.
- **Mirrorland = primary remaining product defect.** The four-choice chooser must be functionally hardwired to Narrative, Demo, World Map, and Return to Compass. When the page darkens, the four choices must become the luminous visual authority and remain crisp/unfiltered. Underlying content must become visually/focus inert while the chooser owns the state. On Return to Compass, the chooser must disappear before restoration begins.
- **Mirrorland source diagnosis = probable stacking/ownership failure.** The chooser is structurally nested in the Compass panel while the blur backdrop is body-level. A nested fixed element can remain trapped below a body-level backdrop by an ancestor stacking context. The next successor should use a body-level modal/portal host where chooser and backdrop are siblings, backdrop below chooser. Rendered qualification must confirm the diagnosis.
- **TRL/TRA = structurally improved but still requires rendered whole-page qualification.** Preserve the one-stage / active-family / inner-carousel contract and reject clipping, stale neighboring family residue, or broken slide navigation.

## Laws precedent — now explicit

`laws/index.controller.js` provides the state-transaction precedent:

`gesture begin -> preview -> controller commit/cancel -> canonical settled orientation -> semantic ownership`

Preview motion is not semantic selection.

`laws/index.interactions.js` provides the label precedent:

**ALL AUTHORITIES PRESENT + SINGLE ACTIVE OUTER LABEL.**

The main Compass translation is:

**ALL FOUR CARDINAL STARS PRESENT + ONE SETTLED READABLE LABEL.**

The inactive three labels must leave visual/focus/pointer ownership, but their star geometry must not disappear merely to achieve one-label semantics.

## Ownership/layout invariant

One controller state owner. One presentation owner for each visual surface. One active text/label owner per text region and one active content card per state. Active content reserves its own layout height. Outgoing text/card state leaves visual/layout/focus flow before incoming state enters.

For the constellation specifically, the star bodies are geometry rather than competing text tabs: all four remain rendered; only the settled foreground cardinal owns the readable label.

A blank inactive label shell is not acceptable. A second presentation observer that reverses the first owner's state is also not acceptable.

## Main Compass transition invariant

The existing `assets/compass/compass.controller.js` remains the canonical state/navigation authority for:

- `CONSTELLATION`
- `CLUSTER_OPEN`
- `ROOM_SELECTED`
- `MIRRORLAND_REVEALING`
- `MIRRORLAND_FOCUSED`
- `MIRRORLAND_WITHDRAWING`
- `NAVIGATING`
- `HELD`

Presentation helpers must render those states rather than establish a parallel state machine.

For constellation rotation:

`preview motion -> controller settlement -> outgoing label removed -> incoming settled label shown`

For Mirrorland return:

`chooser teardown -> backdrop teardown -> MIRRORLAND_WITHDRAWING / Compass restoration`

## Site-wide carousel continuity standard

Compass MUST NOT invent a separate carousel interaction language. Methods & Models is the reference stage/orbit language; Developer, Evidence, and Governance carry the repository-documented `PUBLIC_LEGITIMACY_CONTEXTUAL_CAROUSEL_V3` family.

**ONE STAGE + TABS + ONE ACTIVE CARD + SWIPE/KEYBOARD + STATE-DERIVED HEADING.**

Brain/Trophy/House already approximates this standard sufficiently for the present cycle and should be preserved. Readiness remains subject to the same whole-page rule: outer `TRL | TRA` selects the readiness family, while inner carousel states within the selected family use established site grammar.

## Mirrorland acceptance contract

Mirrorland passes only when all of the following are demonstrated in rendered evidence:

1. The chooser darkens/suppresses the surrounding page while the four decisions visibly glow/sparkle/reveal as the sole interaction authority.
2. The chooser itself remains crisp and is not affected by the background blur.
3. `Enter the Narrative` reaches `/showroom/`.
4. `Enter the Demo` reaches `/showroom/globe/h-earth/`.
5. `See the World Map` reaches `/showroom/globe/audralia/`.
6. `Return to Compass` first removes the chooser/backdrop ownership, then begins Compass restoration.
7. No underlying Mirrorland copy, stale control, hidden/blank label shell, or focus target competes with the active chooser.
8. Navigation remains under the declared/controller authority; no duplicate capture-phase navigation shim remains as a second owner.

## Next bounded construction cycle

The next product successor should make the smallest ownership-consolidating repair:

1. Correct `compass.presentation-convergence.js` at the source so it preserves all four cardinal stars and owns only the one-label handoff.
2. Remove the Gen1589 compensating cardinal visibility override after the source owner is corrected.
3. Move/portal the focused Mirrorland chooser into a body-level overlay host sibling to its backdrop.
4. Preserve underlying inert/focus suppression without stripping suppression from ancestors as a repair tactic.
5. Preserve the declarative Narrative/Demo/World Map routes and controller-owned navigation.
6. Preserve teardown-before-return sequencing.
7. Regression-check 19/19 room states and Brain/Trophy/House without redesigning already-passing surfaces.
8. Qualify TRL/TRA and the whole page across phone portrait/landscape, tablet, desktop, touch, pointer, keyboard/focus, and reduced motion.

## Publication boundary

The obsolete push-triggered Pages authority remains retired. `.github/workflows/pages-direct-deploy.yml(target_sha=<exact approved current main>)` is the surviving explicit publication authority. Release proof still requires the matching public `.well-known/dgb-release.json` exact-SHA marker and successful live exact-head verification.

No product mutation should be published merely because the source audit is complete. Construction, qualification, merge, publication, and live visual acceptance remain separate boundaries.

## Acceptance

Acceptance is whole-page, not patch-local. A successor is not accepted merely because named defects were edited.

Acceptance still requires no text collision, clipping, stale state, broken control, predecessor flash, inactive-carousel residue, blank competing label shell, blurred active chooser, duplicate interaction owner, or newly introduced regression anywhere in the exercised page.

User-observed rendered evidence is the presentation authority. Source presence, CI assertions, merge success, exact-head deployment, and publication are necessary evidence where applicable but are not visual acceptance.

## Evidence spine

Read, in order:

1. `docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md` — Laws transition/label precedent and current ownership diagnosis.
2. `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md` — timestamped visual chronology.
3. `docs/MASTER_PAGE_AND_COMPASS_CONTINUITY_LEDGER.md` — generation/change continuity.
4. `docs/PUBLICATION_AUTHORITY_BOUNDARY.md` — release/control-plane disposition.

Any further construction, qualification conclusion, or release claim must resolve against current `main`, current rendered owner evidence, and this repository-resident audit spine rather than room memory.