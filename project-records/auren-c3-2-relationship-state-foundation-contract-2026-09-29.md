# Auren C3.2 — Relationship-State Foundation Contract

Status: **FROZEN / IMPLEMENTATION_NOT_YET_AUTHORIZED_BY_THIS RECORD**
Date: 2026-09-29

Accepted baseline: `c0a140925f25b5aa843f41e06194e6f5b61b9c69`

Parent architecture:
- `project-records/auren-c3-four-audit-crosswalk-resolidified-plan-2026-09-29.md`
- `project-records/auren-c3-step1-canon-audit-2026-09-29.md`
- `project-records/auren-c3-step2-four-archetype-audit-2026-09-29.md`
- `project-records/auren-c3-step3-conversation-game-mechanics-audit-2026-09-29.md`
- `project-records/auren-c3-step4-scene-handoff-audit-2026-09-29.md`
- `project-records/auren-c3-1-contract-freeze-2026-09-29.md`

## 1. Purpose

C3.2 establishes the first explicit Auren relationship-state substrate beneath the accepted progressive conversation runtime.

It does **not** yet deepen Auren by dynamically selecting trust-dependent dialogue. It creates the deterministic state and transition discipline that later C3 stages may consume.

C3.2 extends C3.1. It does not replace C2/C3.1 conversation state, timing, product topology, handoff ownership, or voice authority.

## 2. Controlling separation

**Conversation state** owns current node, authored navigation/history, pending sequence, timing and presentation.

**Relationship state** owns only explicit relationship events and their deterministic session-state consequences.

**Products mode** remains public utility and is outside automatic relationship scoring.

**Learn About Auren mode** is the only C3.2 relationship-enabled conversational mode.

Relationship state does not own product truth, visitor archetypes, world admission, destination authority, or another character's private canon.

## 3. Session-only schema

C3.2 relationship state is in-memory only.

Required logical fields:

- `contract`
- `mode`: `PUBLIC` or `RELATIONSHIP`
- `phase`: `PUBLIC`, `ENGAGED`, or `GUARDED`
- `events`: ordered bounded ledger of accepted authored relationship events
- `revision`: monotonically increasing integer
- `lastTransition`: most recent accepted transition receipt or null

No cross-session persistence is authorized.

No hidden browser storage, account memory, cloud memory, cookie, localStorage or sessionStorage relationship persistence is authorized.

## 4. No numeric trust score

C3.2 SHALL NOT invent a generalized numeric trust meter or arbitrary gain/loss weights.

The relationship foundation uses explicit qualitative state and event history.

The only C3.2 relationship phases are:

- **PUBLIC** — default public/low-trust relationship posture.
- **ENGAGED** — the visitor has participated in authored relationship-bearing conversation without a currently controlling boundary violation.
- **GUARDED** — an authored boundary-sensitive interaction has caused Auren to preserve more distance.

These phases are infrastructure states, not psychological diagnoses and not claims about the visitor's motives.

No visible meter is required or authorized.

## 5. Allowed authored relationship actions

The C3.2 transition vocabulary is deliberately small:

- `ENGAGE` — visitor deliberately enters/follows the Learn About Auren relationship path.
- `FOLLOW_UP` — visitor chooses an authored personal follow-up where the node explicitly marks the choice relationship-bearing.
- `RESPECT_BOUNDARY` — visitor chooses an authored option that explicitly accepts or respects a boundary Auren has stated.
- `CHALLENGE` — visitor chooses an authored challenge/question where the node explicitly marks it as a challenge.
- `RETREAT` — visitor deliberately leaves a relationship-bearing exchange through an authored retreat option.
- `PRY` — visitor chooses an authored option explicitly identified as pressing against a stated boundary.
- `RESET` — explicit relationship reset.

These names are event semantics supplied by authored node metadata. They are not inferred from button wording after the fact.

Unknown actions fail closed.

## 6. Navigation is not relationship evidence by default

The following MUST NOT automatically create relationship events:

- Products selection;
- product questions;
- product handoffs;
- generic Back;
- generic Products;
- ordinary route navigation;
- browser navigation;
- page reload;
- choosing a different product;
- reduced-motion behavior;
- elapsed time.

A Back action may carry relationship meaning only if a future authored node explicitly declares a relationship action for that exact choice.

C3.2 must never infer `RETREAT`, `PRY`, `CHALLENGE`, selfishness, avoidance, manipulation or any other motive from generic navigation.

## 7. Deterministic transition law

Initial state:

`PUBLIC / revision 0 / events []`

Allowed phase transitions:

- `PUBLIC + ENGAGE -> ENGAGED`
- `PUBLIC + FOLLOW_UP -> ENGAGED`
- `PUBLIC + RESPECT_BOUNDARY -> ENGAGED`
- `PUBLIC + CHALLENGE -> ENGAGED`
- `PUBLIC + RETREAT -> PUBLIC`
- `PUBLIC + PRY -> GUARDED`

- `ENGAGED + ENGAGE -> ENGAGED`
- `ENGAGED + FOLLOW_UP -> ENGAGED`
- `ENGAGED + RESPECT_BOUNDARY -> ENGAGED`
- `ENGAGED + CHALLENGE -> ENGAGED`
- `ENGAGED + RETREAT -> PUBLIC`
- `ENGAGED + PRY -> GUARDED`

- `GUARDED + ENGAGE -> GUARDED`
- `GUARDED + FOLLOW_UP -> GUARDED`
- `GUARDED + CHALLENGE -> GUARDED`
- `GUARDED + PRY -> GUARDED`
- `GUARDED + RETREAT -> PUBLIC`
- `GUARDED + RESPECT_BOUNDARY -> ENGAGED`

- `ANY + RESET -> PUBLIC`, clearing the relationship event ledger and returning revision to a new deterministic reset receipt state.

C3.2 does not claim these phases are permanent. They are the minimum deterministic substrate for later authored state-dependent Auren behavior.

## 8. Accepted/rejected transition receipt

Every attempted relationship transition must produce a structured receipt.

Required receipt fields:

- `contract`
- `accepted`: boolean
- `action`
- `sourceNode`
- `choiceId`
- `previousPhase`
- `nextPhase`
- `previousRevision`
- `nextRevision`
- `reason`

Accepted transitions append one bounded event and increment revision, except RESET which clears the ledger and deterministically records reset.

Rejected/unknown transitions:

- `accepted:false`
- preserve prior phase;
- preserve event ledger;
- preserve revision;
- identify a fail-closed reason.

## 9. Authored metadata requirement

Relationship consequences may occur only from explicit voice-node/choice metadata.

The runtime MUST NOT derive relationship semantics from:

- label text;
- prompt text;
- DOM position;
- route;
- node-name substring;
- timing;
- number of clicks.

The authoring surface must explicitly bind a choice to one of the allowed C3.2 actions.

This makes consequences inspectable and prevents accidental motive assignment.

## 10. Event ledger boundary

The event ledger is session-only and bounded.

Minimum required evidence per accepted event:

- action;
- source node;
- choice id;
- previous phase;
- next phase;
- resulting revision.

C3.2 implementation must set a finite ledger ceiling and deterministically discard oldest events if that ceiling is exceeded. The ceiling is an implementation constant, not user identity memory.

No transcript body, free-form personal disclosure, inferred identity, archetype result, or product history is stored in the relationship ledger.

## 11. Reset law

C3.2 must expose an explicit programmatic reset operation.

Reset:

- returns phase to PUBLIC;
- clears relationship events;
- invalidates no product state;
- changes no product authority;
- changes no world state;
- changes no archetype state;
- requires no page reload.

A visible Reset control is not required by C3.2 unless separately authorized.

## 12. Existing Learn About Auren dialogue

The accepted C3.1 Learn About Auren nodes remain the content baseline:

- About Auren
- What does that mean?
- What do you actually do?
- What's Mirrorland?
- Who else is here?
- Tell me about your room

C3.2 may add the minimum explicit metadata/options needed to exercise relationship transitions, but SHALL NOT use this stage to perform the broad state-dependent Auren rewrite reserved for C3.4.

Canon remains governed by the Step 1 recovery.

## 13. Products isolation

Qualification must prove that traversing Products—including ARCHCOIN, Five Flags, Education, Nutrition and Book/Elara—does not change relationship phase, revision, or event ledger unless the visitor separately enters an explicitly relationship-bearing Learn About Auren choice.

Public product facts and navigation remain available in PUBLIC and GUARDED states.

## 14. Preservation requirements

C3.2 must preserve:

- C3.1 opening modes;
- maximum three contextual choices;
- C2 typing indicator;
- C2 timing cadence;
- delayed choices until turn completion;
- reduced-motion behavior;
- all five Products reachability;
- four substantive product conversations;
- Book -> Elara;
- Five Flags/Education/Nutrition routes;
- existing destination authority;
- current Auren identity and canon boundaries.

## 15. Explicit non-goals

C3.2 does NOT authorize:

- visitor archetype scoring or inference;
- Strategist/Builder/Mitigator/Auditor assignment;
- pressure-break classification;
- numeric trust;
- visible trust meter;
- cross-session persistence;
- localStorage/cookie/cloud relationship memory;
- trust-dependent product access;
- broad trust-dependent dialogue selection;
- new secret/private canon;
- relationship-driven scene admission;
- rewriting Mirrorland/world authority;
- rewriting another character;
- changing product authorities;
- HTML/CSS/room redesign.

Those remain later staged work.

## 16. Bounded implementation scope

Preferred implementation surface:

- `products/auren/auren.relationship.js` — new pure relationship state/transition module.
- `products/auren/auren.voice.js` — only explicit relationship-action metadata/minimum authored exercise points.
- `products/auren/auren.chamber.js` — compose accepted authored choices with relationship transitions and expose receipt/state for qualification.

If loading a new module requires a script include in `products/auren/index.html`, that exact one-line/module-loading mutation may be separately admitted as implementation plumbing. No visual HTML/CSS/room mutation is authorized.

No other product file is in C3.2 scope without a new bounded finding.

## 17. Qualification contract

An exact-head browser qualification must prove at minimum:

1. accepted C3.1 baseline behavior remains intact;
2. initial relationship phase is PUBLIC with empty ledger;
3. Products traversal leaves relationship state unchanged;
4. entering Learn About Auren through explicit ENGAGE produces ENGAGED;
5. authored FOLLOW_UP is accepted deterministically;
6. authored PRY produces GUARDED;
7. generic Back/navigation does not itself mutate relationship state;
8. authored RESPECT_BOUNDARY can recover GUARDED -> ENGAGED;
9. authored RETREAT produces the contracted destination phase without inferred motive;
10. unknown action fails closed with state unchanged;
11. RESET clears ledger and restores PUBLIC;
12. revision/event receipts are deterministic;
13. ledger remains bounded;
14. no browser persistence is written;
15. no page errors occur;
16. C2 timing/typing/delayed-choice receipt remains true;
17. all contextual choice banks remain <=3.

Qualification must bind exact candidate SHA and exact accepted C3.1 baseline SHA.

## 18. Success condition

C3.2 succeeds when Auren has a deterministic, inspectable, session-only relationship substrate that later stages can consume without:

- guessing visitor motives;
- scoring Products;
- inventing numeric trust;
- changing public product access;
- leaking state across sessions;
- or prematurely implementing archetype/state-dependent/scene systems.

## 19. Next operation after freeze

After this contract is merged as architecture-only evidence:

1. implement the bounded C3.2 relationship module/composition;
2. create an exact-head verifier and dispatchable qualification;
3. qualify against accepted C3.1 baseline `c0a140925f25b5aa843f41e06194e6f5b61b9c69`;
4. repair only proven defects;
5. adopt only after a green exact-head receipt.

C3.3 visitor-archetype evidence does not begin until C3.2 is green and adopted.

## Terminal law

**C3.2 CONTRACT = RELATIONSHIP-STATE FOUNDATION ONLY.**

**PRODUCTS REMAIN UNSCORED.**

**GENERIC NAVIGATION IS NOT MOTIVE EVIDENCE.**

**NO NUMERIC TRUST. NO ARCHETYPE ENGINE. NO PERSISTENCE. NO SCENE GATE.**
