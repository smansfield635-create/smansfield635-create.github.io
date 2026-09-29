# Auren C3 Step 3 — Conversation / Game-Mechanics Audit

Status: **STEP_3_CLOSED / READ_ONLY EVIDENCE RECOVERY COMPLETE**

Date: 2026-09-29

Parent plan: `project-records/auren-c3-four-audit-recovery-plan-2026-09-29.md`

Step 1: `project-records/auren-c3-step1-canon-audit-2026-09-29.md`

Step 2: `project-records/auren-c3-step2-four-archetype-audit-2026-09-29.md`

This record closes Step 3 only. It authorizes no C3 implementation.

## Governing purpose

Recover existing conversation and game-mechanics precedent before designing C3.

C2 remains the accepted Auren conversational-performance baseline. This audit does not reopen its cadence.

## Primary recovered surfaces

### Current accepted Auren C2

- `products/auren/index.html`
- `products/auren/auren.chamber.js`
- `products/auren/auren.voice.js`

Accepted C2 lineage includes the September 29 conversation integration and cache-identity successors.

The C2 runtime receipt explicitly declares:

- conversation primary;
- progressive runtime;
- bounded active stage;
- timed performance;
- typing indicator;
- choices delayed until turn complete;
- maximum three contextual choices;
- `historyMode:"MEMORY_NOT_ACTIVE_TRANSCRIPT"`.

### Historical June Auren product-floor lineage

The June lineage provides earlier conversation precedent including:

- product-floor chat shell;
- local response bank;
- one-tap-one-line pacing;
- typing state;
- timed bubble sequencing;
- manual tap-to-advance;
- focused product menus;
- silent return navigation;
- product routing;
- explicit outside-product handoffs.

### Character/world state surfaces

- `characters/cardinal-scene-state.mjs`
- `characters/narrative-world-state.mjs`
- `characters/scene-transition.mjs`
- `characters/destination-registry.mjs`

These provide deterministic world/scene state precedent separate from Auren's current chamber.

### Neighbor conversation surfaces checked

- `elara/index.js`
- `showroom/globe/hearth/jeeves/index.js`

They reinforce timed/register-aware progressive conversation and contextual routing precedent. The bounded check found no trust, affinity, reputation, cross-session relationship persistence, remembered-history, or relationship-unlock machinery in those runtimes.

---

# REUSE_AS_IS

## C2 timed conversational performance

The accepted Auren C2 runtime already provides:

- three-dot typing indication;
- timed typing and reading performance;
- delayed options until Auren finishes the turn;
- progressive authored dialogue nodes;
- visitor prompt rendered into the conversation;
- maximum three contextual choices;
- reduced-motion handling;
- deterministic node lookup through the voice bank.

**Disposition: REUSE_AS_IS.**

C2 timing/cadence remains frozen unless a later explicit defect reopens it.

## Progressive conversation topology

`auren.voice.js` already models a progressive node graph rather than presenting every possible prompt simultaneously.

Current root separation includes Products and About Auren, with deeper follow-ups revealed contextually.

**Disposition: REUSE_AS_IS as structural precedent/current runtime.**

C3 may expand authored topology but should not discard the progressive conversation model merely to expose all possible questions at once.

## Proven route handoff mechanism

Current C2 can produce route options and hand authority to the destination page.

ARCHCOIN is an explicit current example.

Historical June Auren also contains explicit handoff knowledge/routes for:

- Coherence Diagnostic;
- Sean / Elara;
- Nine Summits;
- Book;
- Jeeves;
- Products.

Destination truth remains owned by the destination authority.

**Disposition: REUSE_AS_IS for the handoff mechanism.**

Which destinations C3 may expose remains Step 4 territory.

---

# EXTEND_EXISTING

## In-memory conversation state/history

C2 maintains:

- current node;
- busy/sequence state;
- an in-memory `history[]` of transitions.

The runtime itself labels this history:

`MEMORY_NOT_ACTIVE_TRANSCRIPT`.

It is not persistent relationship memory.

**Disposition: EXTEND_EXISTING** if C3 needs richer session state.

Do not misrepresent the current history array as trust, affinity, relationship memory, or cross-visit persistence.

## Deterministic state-transition model

`characters/cardinal-scene-state.mjs` provides a pure deterministic state machine with accepted/rejected transition receipts.

Recovered phases/actions include:

- survey hub;
- signal/site selection;
- encounter preview;
- scene transition;
- character scene;
- local inspection;
- knowledge card;
- return to hub;
- relation travel.

Invalid or unauthorized transitions fail closed and preserve prior state.

**Disposition: EXTEND_EXISTING / reusable architectural precedent.**

C3 relationship mechanics can lawfully learn from this state-transition discipline without claiming that the cardinal state machine already implements relationships.

## Session-state preservation

Cardinal scene state preserves selections/discoveries/card state during the active in-memory session.

It explicitly declares:

`IN_MEMORY_ONLY_NO_CROSS_SESSION_HIDDEN_KNOWLEDGE_LEAK`.

**Disposition: EXTEND_EXISTING for session-state architecture.**

This is evidence for controlled state preservation, not authority for cross-session relationship persistence.

## Visited/revealed world-state mechanics

`characters/narrative-world-state.mjs` derives world state from visited destinations.

Visited destinations can reveal related destinations and alter signal state such as:

- UNSEEN;
- ACTIVE;
- VISITED;
- REVEALED_RELATED.

The manor can reveal Auren and Jeeves; other destination rules expose related world elements.

**Disposition: EXTEND_EXISTING / strong game-state precedent.**

This proves state-dependent revelation exists in the world architecture. It does not prove trust-dependent revelation.

## Explicit scene-entry guards

Cardinal state distinguishes selecting a destination from entering its scene.

Scene entry requires the proper phase and selected site. Discoveries also require source-authorized availability.

Relation travel requires an explicitly revealed relation.

**Disposition: EXTEND_EXISTING / strong admission-and-gating precedent.**

C3 may later integrate with proven scene gates, but Step 3 does not authorize relationship-driven gates.

---

# PRECEDENT_ONLY

## Historical silent returns

The June Auren product-floor lineage deliberately implemented silent Back/return behavior: navigation could restore the appropriate conversational menu without forcing Auren to repeat dialogue.

**Disposition: PRECEDENT_ONLY.**

Current C2 does not make this the controlling relationship mechanic.

## Manual tap-to-advance

The June runtime allowed a visitor tap to advance one pending line while preserving paced sequencing.

**Disposition: PRECEDENT_ONLY.**

C2 timed performance is controlling unless explicitly reopened.

## Route-transition sessionStorage

`characters/scene-transition.mjs` uses `sessionStorage` for a narrow route-handoff marker so fade-to-black can continue as fade-from-black after navigation.

This is presentation/transition continuity.

**Disposition: PRECEDENT_ONLY.**

It is not relationship persistence or remembered conversational state.

## Neighbor character conversation runtimes

Elara and Jeeves contain substantial progressive dialogue, pacing, follow-up, mode/register and contextual-route machinery.

**Disposition: PRECEDENT_ONLY where their mechanisms are not already represented by C2.**

They do not establish a hidden relationship engine for Auren.

---

# NOT_PRESENT / NEW DEVELOPMENT REQUIRED

The bounded current-tree and historical-surface audit did not recover an existing implementation of the following as an Auren/character conversational relationship system:

## Trust / affinity / reputation score

No existing trust, affinity, or reputation state machine was recovered.

**Disposition: NOT_PRESENT / NEW DEVELOPMENT REQUIRED.**

Auren's canon contains trust tests and betrayed trust as narrative/game concerns, but Step 3 found no existing numerical or persistent relationship engine implementing them.

## Cross-session relationship persistence

No recovered Auren, Elara, Jeeves, or cardinal-scene runtime persists relationship state across browser sessions.

Cardinal state explicitly prohibits cross-session hidden-knowledge leakage.

**Disposition: NOT_PRESENT / NEW DEVELOPMENT REQUIRED.**

The provisional same-browser/device persistence proposal remains future design.

## Remembered conversational choices across visits

C2's history is in-memory only. No durable visitor-choice ledger was recovered.

**Disposition: NOT_PRESENT / NEW DEVELOPMENT REQUIRED.**

## Trust-dependent dialogue

No runtime was recovered in which Auren's available dialogue changes because of a trust/affinity/reputation score.

**Disposition: NOT_PRESENT / NEW DEVELOPMENT REQUIRED.**

## Trust-dependent disclosure

No implemented relationship score currently controls personal/canonical disclosure depth.

**Disposition: NOT_PRESENT / NEW DEVELOPMENT REQUIRED.**

Any such mechanism must remain subordinate to Step 1 knowledge/disclosure authority.

## Archetype accumulation from conversation

Step 2 recovered the Coherence Diagnostic's visitor-recognition framework, but Step 3 found no current conversation runtime accumulating Strategist/Builder/Mitigator/Auditor evidence from Auren dialogue choices.

**Disposition: NOT_PRESENT / NEW DEVELOPMENT REQUIRED.**

## Relationship-driven scene unlocking

Existing world architecture supports deterministic revelation, explicit availability, guarded scene entry and revealed relation travel.

No evidence was recovered that these gates currently depend on Auren trust or conversational relationship state.

**Disposition: NOT_PRESENT / NEW DEVELOPMENT REQUIRED.**

## Location + problem selection as an Auren relationship mechanic

Existing character/world systems support site selection, encounter preview and scene entry.

Step 3 did not recover a current Auren conversation mechanism where relationship state leads to a location/problem choice.

**Disposition: NOT_PRESENT AS C3 RELATIONSHIP MECHANIC / EXISTING WORLD PRECEDENT ONLY.**

Step 4 must inventory actual scene/location/problem destinations before any handoff design.

---

# CHOICES WITH CONSEQUENCES — PRECISE BOUNDARY

The repository does contain choices that alter immediate state:

- conversation node selection changes the next dialogue/options;
- cardinal site selection changes scene state;
- discoveries can be opened and retained during the session;
- visited destinations alter revealed world state;
- invalid state transitions fail closed;
- revealed relationships can permit later travel.

Therefore **stateful consequence precedent exists**.

However, Step 3 did not recover a generalized moral, selfish/selfless, motive, affinity, trust, or relationship-consequence engine.

Those concepts remain C3 design territory unless later evidence establishes otherwise.

---

# BACK / NAVIGATION BOUNDARY

Navigation is already part of interaction architecture, but no evidence establishes that Back itself currently changes trust or relationship state.

Recovered precedent:

- historical silent return;
- current contextual node navigation;
- route handoffs;
- exact survey-hub restoration with session state preserved.

Therefore:

**navigation-as-state-transition = existing precedent.**

**navigation-as-trust-transaction = NEW C3 POSSIBILITY.**

---

# REUSABLE OWNERSHIP BOUNDARIES

Auren C2 owns its conversation runtime and voice-node behavior.

Destination pages own their factual/product/world truth.

Character/world state machinery owns its own scene/world transition rules.

C3 must not duplicate those authorities merely to add relationship behavior.

The preferred future architecture is extension/composition across these existing boundaries rather than a parallel replacement engine.

---

# Step 3 terminal conclusions

1. Auren already has an accepted progressive C2 conversation runtime.
2. C2 typing/timing cadence, delayed choices and bounded contextual choices are reusable as-is.
3. Progressive authored conversation topology already exists.
4. Route handoff machinery already exists.
5. C2 has in-memory transition history, but not active transcript memory or persistent relationship memory.
6. Historical Auren provides silent-return and manual-advance precedent.
7. Cardinal scene state provides deterministic, fail-closed game-state transitions and guarded scene entry.
8. Narrative world state provides visited/revealed state-dependent world progression.
9. Session-state preservation exists; cross-session relationship persistence does not.
10. Scene-transition `sessionStorage` is narrow presentation continuity, not relationship memory.
11. No trust/affinity/reputation engine was recovered.
12. No trust-dependent dialogue/disclosure engine was recovered.
13. No conversational archetype-accumulation engine was recovered.
14. No relationship-driven scene unlocking was recovered.
15. Stateful consequence precedent exists, but a generalized relationship-consequence engine does not.
16. Current Elara/Jeeves conversation surfaces do not contradict these findings.
17. C3 should extend/compose existing conversation and world-state mechanisms rather than manufacture a parallel replacement architecture.

## Handoff

**STEP 3 = CLOSED.**

Next controlling operation:

**STEP 4 — SCENE AND HANDOFF AUDIT.**

Step 4 remains read-only and must inventory actual destinations before C3 scene/handoff architecture is frozen.

No C3 implementation, trust engine, persistence engine, archetype-conversation engine, or relationship scene gate is authorized by this closure.
