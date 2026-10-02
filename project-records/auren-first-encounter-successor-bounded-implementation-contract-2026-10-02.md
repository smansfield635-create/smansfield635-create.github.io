# Auren First Encounter Successor — Bounded Implementation Contract

Status: **FROZEN IMPLEMENTATION CONTRACT / NO RUNTIME MUTATION**
Date: 2026-10-02

## Authority chain

1. `project-records/mirrorland-character-interaction-law-immersive-relational-conversation-2026-10-02.md`
2. `project-records/auren-learn-about-interaction-law-audit-first-encounter-plan-2026-10-02.md`
3. This contract.

Base head frozen for contract derivation:

`c400cdf56625d9d0de082014804d8b05d57fa75f`

This contract authorizes the next implementation candidate only. It does not itself mutate runtime.

## Objective

Reconstruct only **Learn About Auren** as the first in-world relational encounter while preserving the existing Products mode and proven Auren cadence/mechanics.

The visitor must experience Auren handling a sanctuary responsibility rather than interrogating a biography tree.

No new diagnostic engine is authorized.

## Product-runtime allowlist

The successor implementation candidate may change only these product files:

1. `products/auren/auren.session-context.js` — **NEW**
2. `products/auren/auren.voice.js`
3. `products/auren/auren.chamber.js`
4. `products/auren/index.html`

No other file under `products/auren/` is authorized to change in the first implementation candidate.

### Frozen Auren product authorities

These remain byte-for-byte unchanged unless a later explicit contract reopens them:

- `products/auren/auren.relationship.js`
- `products/auren/auren.archetype.js`
- `products/auren/auren.state-dependent.js`
- `products/auren/auren.scene-offer.js`
- `products/auren/auren.return-context.js`
- `products/auren/auren.custody.js`
- `products/auren/auren.privacy.js`
- `products/auren/auren.privacy-relationship.js`
- `products/auren/auren.room.geometry.js`
- `products/auren/auren.room.presentation.js`
- `products/auren/auren.room.environment.js`
- `products/auren/index.css`

## Qualification-file allowance

The candidate may additionally add, but not repurpose unrelated qualification machinery:

- one dedicated verifier under the repository's existing verifier/script convention;
- one dedicated GitHub Actions workflow for exact-head qualification;
- the minimum control-plane registration required to dispatch that workflow, if repository precedent requires it.

Those qualification files are outside the four-file product-runtime boundary and do not grant additional product mutation authority.

## Session-context authority

Create a session-only continuity module:

`products/auren/auren.session-context.js`

It is not a diagnostic scorer and must not classify the visitor.

### Required state

The minimum state is:

- `revision`
- `visitedTopics`
- `deliveredBeats`
- `visitorActions`
- `establishedBoundaries`
- `unresolvedThreads`
- `offersMade`
- `handoffContext`
- `lastBeat`

Equivalent internal representations are allowed only if the verifier can establish the same semantics.

### Required operations

The module must support deterministic session-local operations sufficient to:

- mark a topic visited;
- mark an authored beat delivered;
- record a significant visitor action without personality labeling;
- record an established boundary;
- open/update/resolve an unresolved thread;
- record an offer;
- establish bounded handoff context;
- consume/acknowledge authorized return context without inventing off-surface knowledge;
- expose a read-only state snapshot;
- reset for a new session/test.

### Prohibited content

The session context must not store or expose:

- terminal scores;
- visitor archetype labels;
- relationship labels intended for display;
- personality verdicts;
- moral verdicts;
- fabricated knowledge from another character or external surface;
- permanent cross-session transcript memory.

Existing archetype and relationship engines remain separate cognition inputs.

## First encounter topology

The Learn About Auren branch must cease using the current `about -> who/work/mirrorland/people/room -> Back` graph as its primary interaction model.

### Entry

The root may continue to distinguish:

- Products
- Learn About Auren

Selecting Learn About Auren enters the encounter directly.

It must not first present a biography submenu.

### Encounter beat A — occupied arrival

Auren is already doing something in the chamber tied to sanctuary operation: checking or changing a door, route, sightline, access condition, room placement, or comparably ordinary detail with a protection consequence.

Auren acknowledges the visitor while remaining engaged with the problem.

No biography exposition is required.

### Encounter beat B — low-assumption visitor intent

Present one to three context-appropriate intents.

Authorized semantic forms include:

- ask about the immediate thing Auren is doing;
- offer a concrete assist;
- wait/observe;
- another equally low-assumption contextual action.

The option text must not manufacture the visitor's beliefs, morality, emotional state, personality, or archetype.

### Encounter beat C — human consequence

The sanctuary problem becomes consequential through an in-world event such as a message, knock, access condition, or arrival pressure.

Auren owns the responsibility.

The existing admission/custody material may inform this beat, but the runtime must not simply ask the visitor `What would you do?` as a diagnostic hypothetical.

### Encounter beat D — privacy/custody boundary

A protected person may become relevant without being identified.

Auren may state, enforce, or revisit a privacy/custody boundary naturally.

If an equivalent boundary was already established in the active session, the complete prior response must not mechanically replay.

### Encounter beat E — behavioral adaptation

Later Auren behavior must be materially conditioned by prior interaction.

Permitted expressions include changed:

- candor;
- caution;
- challenge;
- humor;
- willingness to explain;
- willingness to ask for help;
- willingness to offer the Manor;
- willingness to resume an unresolved subject.

No visible diagnostic explanation is required.

### Encounter beat F — continuation/handoff

The encounter may naturally:

- continue the sanctuary issue;
- deepen something Auren volunteered;
- connect to Mirrorland;
- offer the Manor;
- pivot into Products if the visitor makes the work relevant.

A handoff must record why it occurred and the originating unresolved thread when one exists.

## Revisit / anti-replay law

Before an authored encounter response is delivered, selection must consult session context.

If the same complete beat was already delivered, ordinary graph re-entry must not emit the same complete response again.

A revisit must instead do at least one of:

- acknowledge prior discussion;
- deepen;
- clarify;
- connect to an intervening event;
- challenge;
- redirect;
- resume;
- intentionally repeat for an authored contextual reason.

The verifier must prove this with an actual same-session revisit.

## Handoff law

### Manor

The existing Manor authority boundary remains intact.

Auren may know:

- that he offered the Manor;
- why he offered it;
- that an authorized return receipt says the visitor returned.

Auren may not infer private actions performed in the Manor beyond authorized return context.

On authorized return, the successor must be capable of resuming the originating unresolved thread rather than only saying a generic return acknowledgment.

### Products

Products remains a deliberate informational mode.

Existing product facts and product routes are not part of this rewrite unless required to preserve the transition into/out of Products.

### Elara / Book

Book -> Elara remains an authority handoff. No new cross-character knowledge is authorized.

## Visible relationship presentation

The underlying relationship engine remains frozen and active as cognition.

For the successor experience, `PUBLIC / ENGAGED / GUARDED` must not be presented to the visitor as a relationship gauge/label.

The implementation may remove the relationship presentation markup from `index.html` or make it non-user-facing through the bounded runtime/markup change.

Do not delete or redesign the relationship engine.

## Cadence invariants

Preserve absent a demonstrated incompatibility:

- progressive short-turn rendering;
- Auren typing indicator;
- delayed choices until Auren's turn completes;
- reading pause;
- maximum three contextual options;
- bounded active conversation stage;
- reduced-motion behavior;
- existing room/environment presentation.

The successor is a conversation-architecture change, not a visual redesign.

## Existing corpus treatment

The current `about`, `who`, `work`, `mirrorland`, `people`, `room`, admission and privacy material is source material, not required topology.

Implementation may:

- reuse lines where they arise naturally;
- split lines into contextual beats;
- create revisit variants;
- retire old Learn-path options from reachability.

It must not preserve an old node merely to satisfy legacy menu topology.

Products nodes remain outside the rewrite boundary except transition glue.

## Verifier obligations

The dedicated exact-head verifier must establish at minimum:

1. exact candidate head is loaded;
2. only the authorized product-runtime files changed from the frozen base, plus authorized qualification files;
3. Products remains reachable and its substantive product topology is preserved;
4. Learn About Auren enters an in-world encounter, not the old biography submenu;
5. the first encounter begins with Auren engaged in a sanctuary-relevant action/problem;
6. visitor options do not contain archetype names or forced personality/belief declarations;
7. session context records delivered beats/topics/actions;
8. revisiting a subject in the same session does not mechanically replay the same complete response;
9. an unresolved thread can survive at least one intervening beat and be resumed;
10. a previously established privacy/custody boundary changes the revisit response;
11. relationship/archetype machinery remains internal and operational;
12. no visible `PUBLIC / ENGAGED / GUARDED` relationship label is presented;
13. Manor offer can arise from encounter context;
14. authorized Manor return does not fabricate Manor-private knowledge;
15. authorized Manor return can resume the originating thread;
16. typing cadence and delayed-choice mechanics still operate;
17. no turn exposes diagnostic scores/archetype evidence/relationship phase as conversational explanation;
18. no terminal visitor evaluation/report is produced.

## Legacy qualification compatibility

The implementation must preserve proven C3-C5 mechanics where those tests assert mechanics rather than the superseded Learn-path topology.

If a legacy verifier fails solely because it requires the old interview/menu topology or visible relationship label, do not mutate the successor back toward the obsolete behavior merely to satisfy that assertion.

Instead:

1. identify the assertion;
2. demonstrate conflict with the merged Mirrorland law and this contract;
3. supersede that assertion in the successor verifier while preserving the underlying mechanic it was originally intended to protect.

## Failure conditions

The candidate fails architecture if any of the following is true:

- Learn About Auren is still primarily a menu of dossier questions;
- the visitor is marched through evenly distributed diagnostic choices;
- same-session node revisit mechanically replays the same complete answer;
- Auren's later behavior does not depend on accumulated context;
- relationship/archetype state is surfaced as visitor evaluation;
- visible PUBLIC/ENGAGED/GUARDED survives as the experience's relationship explanation;
- Back remains the principal conversation progression mechanism;
- Manor/Elara/external handoffs grant Auren unauthorized knowledge;
- Products is unnecessarily rewritten;
- frozen Auren authorities are changed without a successor contract.

## Exact implementation sequence

1. create the session-context module;
2. load it before `auren.chamber.js`;
3. bind chamber runtime to session context;
4. reconstruct Learn About Auren entry and first encounter beats in `auren.voice.js` / chamber selection;
5. remove visible relationship-phase presentation while preserving internal relationship state;
6. add exact-head verifier and workflow;
7. run qualification;
8. repair only demonstrated failures within this contract;
9. merge only after exact-head qualification passes.

## Terminal implementation boundary

**CHANGE THE EXPERIENCE, NOT THE DIAGNOSTIC MACHINERY.**

**MAKE HISTORY AUTHORITATIVE FOR CONVERSATION.**

**AUREN ACTS FIRST AS A CHARACTER IN A WORLD.**

**THE VISITOR RESPONDS WITHOUT BEING FORCED TO DECLARE WHO THEY ARE.**

**REVISITS REMEMBER. HANDOFFS RESUME. DIAGNOSTICS STAY INVISIBLE.**
