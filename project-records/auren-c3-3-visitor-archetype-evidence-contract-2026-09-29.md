# Auren C3.3 — Visitor-Archetype Evidence Contract

Status: **FROZEN / IMPLEMENTATION_NOT_YET_AUTHORIZED_BY_THIS RECORD**
Date: 2026-09-29

Accepted C3.2 baseline: `e1995aa86ff2fc3c04c4462d644f41f0128c5d25`

Controlling evidence:
- `project-records/auren-c3-four-audit-crosswalk-resolidified-plan-2026-09-29.md`
- `project-records/auren-c3-step2-four-archetype-audit-2026-09-29.md`
- `project-records/auren-c3-step3-conversation-game-mechanics-audit-2026-09-29.md`
- `project-records/auren-c3-2-relationship-state-foundation-contract-2026-09-29.md`

## 1. Purpose

C3.3 adds a session-only visitor-recognition evidence substrate to Auren's Learn About Auren path.

It does not assign a personality identity. It accumulates explicit authored evidence for four existing public patterns:

- Strategist
- Builder
- Mitigator
- Auditor

Auren remains Auren. These archetypes describe provisional visitor decision patterns only.

## 2. Separation of authorities

**Relationship state (C3.2)** remains responsible for PUBLIC / ENGAGED / GUARDED and authored relationship events.

**Visitor-recognition state (C3.3)** owns only archetype evidence, self-claim if explicitly supplied, provisional primary/support, confidence/disposition and revision evidence.

**C3.4** will later decide whether and how Auren uses these states to select authored dialogue. C3.3 itself SHALL NOT alter Auren's tone, mask depth, disclosure or product access based on archetype evidence.

Products remain outside automatic relationship and archetype evidence.

## 3. Canonical archetypes

Exactly four public archetypes are admitted:

### Strategist
Structure / Sequence / Decision.

### Builder
Action / Construction / Visible Progress.

### Mitigator
Stability / Risk Reduction / Continuity.

### Auditor
Evidence / Contradiction / Proof.

No fifth archetype is authorized.

Pressure-break/fragmentation signals are not archetypes and are outside the first C3.3 implementation unless separately contracted.

## 4. Session-only state schema

Required logical fields:

- `contract`
- `vector`: nonnegative evidence totals for all four archetypes
- `observations`: bounded ordered ledger of accepted authored evidence events
- `claimedPrimary`: null or one canonical archetype
- `claimedSupport`: null or one canonical archetype distinct from claimedPrimary
- `provisionalPrimary`: null or one canonical archetype
- `provisionalSupport`: null or one canonical archetype
- `disposition`: `INSUFFICIENT`, `MIXED`, or `LEADING`
- `confidence`: `NONE`, `LOW`, `MODERATE`, or `HIGH`
- `revision`
- `lastReceipt`

No persistence beyond the active page/session is authorized.

## 5. Self-claim versus observed evidence

Self-description and observed authored choices MUST remain separate.

A visitor may explicitly claim a primary/support pattern only through a future authored claim operation.

Claimed archetypes:

- do not add observed evidence points;
- do not overwrite the observed vector;
- do not force provisionalPrimary/provisionalSupport;
- may later be compared with observed evidence.

C3.3 must preserve disagreement between claim and observation.

A visitor is never told that a provisional result is their fixed identity.

## 6. Evidence authoring law

Evidence may be added only by explicit voice-choice metadata.

A choice may carry an `archetypeEvidence` object whose keys are canonical archetypes and whose values are bounded positive integers.

The runtime MUST NOT infer archetype evidence from:

- label wording;
- node name;
- route;
- relationship action;
- Products choice;
- click speed;
- timing;
- navigation;
- Back;
- browser behavior;
- personal data.

No hidden natural-language classifier is authorized.

## 7. C3.3 evidence weights

The Coherence Diagnostic's ×2 first-move / ×1 support weighting is instrument-specific and SHALL NOT be copied automatically.

For C3.3 the first implementation uses the smallest deterministic evidence unit:

- one explicitly authored archetype-bearing choice contributes **1 point** to each archetype explicitly bound to that choice;
- a choice may support one or two archetypes;
- no single choice may add more than 1 point to any archetype;
- choices without explicit evidence metadata add zero.

This is conversational evidence accumulation, not diagnostic scoring.

## 8. Vector and ranking

The vector always preserves all four totals.

Ranking is deterministic:

1. higher evidence total;
2. canonical name order only as a stable technical tie ordering.

Technical tie ordering MUST NOT convert a substantive tie into a claimed psychological winner.

The derived state must separately detect ties/near ties.

## 9. Disposition

- **INSUFFICIENT**: fewer than 3 accepted archetype-bearing observations.
- **MIXED**: sufficient observations exist but the top two evidence totals are tied or separated by no more than 1 point.
- **LEADING**: sufficient observations exist and the top evidence total exceeds the second by at least 2 points.

These are evidence dispositions, not personality certainty.

## 10. Confidence

Confidence describes stability of the current evidence pattern, not truth about the person.

- **NONE**: disposition INSUFFICIENT.
- **LOW**: sufficient evidence but fewer than 5 observations.
- **MODERATE**: 5–7 observations and a LEADING disposition.
- **HIGH**: at least 8 observations, LEADING disposition, and top exceeds second by at least 3 points.

MIXED remains LOW regardless of observation count in C3.3.

These thresholds are explicit C3.3 engineering rules, not recovered Coherence Diagnostic law.

## 11. Provisional primary/support

When INSUFFICIENT:
- provisionalPrimary = null
- provisionalSupport = null

When sufficient:
- provisionalPrimary = highest observed archetype unless the highest total is tied, in which case null;
- provisionalSupport = second-highest archetype only when its total is greater than zero and is not tied with another candidate for second; otherwise null.

The full vector remains authoritative evidence. Primary/support are summaries only.

## 12. Revision and contradiction

Every accepted evidence or claim operation increments revision.

Later evidence may change provisionalPrimary, provisionalSupport, disposition or confidence.

That change is lawful revision, not an error.

C3.3 must not lock the visitor into the first provisional pattern.

The observation ledger must preserve enough bounded evidence to prove that revision occurred from authored choices.

## 13. Fail-closed operations

Allowed operations:

- `OBSERVE`
- `CLAIM`
- `RESET_ARCHETYPE_EVIDENCE`

Unknown operation, unknown archetype, invalid weight, duplicate claimed primary/support, malformed metadata or noncanonical key must fail closed:

- no vector change;
- no observation change;
- no claim change;
- no revision change;
- rejected receipt with reason.

## 14. Reset

Explicit archetype reset:

- zeroes all four vector totals;
- clears observations;
- clears claims;
- clears provisional primary/support;
- returns disposition to INSUFFICIENT;
- returns confidence to NONE;
- increments/reset-records deterministically.

It MUST NOT reset C3.2 relationship state.

C3.2 relationship reset MUST NOT implicitly reset C3.3 archetype evidence.

The two state systems remain composable but independently owned.

## 15. Products isolation

All Products traversals MUST leave:

- archetype vector;
- observations;
- claims;
- provisional primary/support;
- disposition;
- confidence;
- revision

unchanged.

Product choices cannot silently become visitor-assessment questions.

## 16. Authored Learn About Auren evidence

C3.3 may add a bounded set of explicit evidence-bearing choices to the Learn About Auren topology.

The purpose is to prove the evidence substrate with natural choices that are already meaningful in conversation.

Authoring rules:

- no question should announce or expose the archetype being scored;
- choices must remain plausible conversational choices;
- metadata must be inspectable in source;
- choices may support at most two archetypes;
- generic navigation remains zero evidence;
- relationship-action metadata and archetype-evidence metadata are separate fields.

C3.3 SHALL NOT broaden into the C3.4 state-dependent response rewrite.

## 17. No identity labeling

Forbidden C3.3 output includes:

- "You are a Strategist."
- "Your personality type is Builder."
- presenting a provisional pattern as diagnosis;
- implying clinical, psychological or immutable identity;
- hiding mixed evidence to force a winner.

Qualification/debug receipts may expose canonical archetype names because they are evidence instrumentation.

Public conversational disclosure of the provisional model is not required in C3.3.

## 18. Bounded ledger

Observation ledger must be finite.

Each accepted observation records at minimum:

- sourceNode;
- choiceId;
- evidence object;
- previous vector;
- next vector;
- resulting revision.

No free-form transcript, personal disclosure text, product history, or inferred identity is stored.

## 19. Preferred implementation surface

Preferred new module:

- `products/auren/auren.archetype.js`

Minimal composition changes may occur in:

- `products/auren/auren.voice.js` — explicit `archetypeEvidence` metadata only/minimum authored proof choices;
- `products/auren/auren.chamber.js` — pass explicit metadata to archetype module and expose state/receipts;
- `products/auren/index.html` — module-loading plumbing only.

C3.2 relationship module should not be rewritten absent a proven integration defect.

No CSS/room redesign is authorized.

## 20. Qualification requirements

Exact-head browser qualification against accepted C3.2 baseline `e1995aa86ff2fc3c04c4462d644f41f0128c5d25` must prove:

1. C3.2 qualification invariants remain intact;
2. initial four-vector is all zero;
3. Products traversal leaves archetype state unchanged;
4. explicitly authored evidence adds exactly contracted unit evidence;
5. choices without metadata add zero;
6. fewer than 3 observations remains INSUFFICIENT/NONE;
7. tied or near-tied sufficient evidence yields MIXED;
8. clear evidence lead yields LEADING;
9. provisional primary/support follow the contract and remain nullable on ties;
10. later contradictory evidence can revise the provisional pattern;
11. self-claim remains separate from observed vector;
12. claim disagreement is preserved rather than overwritten;
13. malformed/unknown operations fail closed;
14. archetype reset does not reset relationship state;
15. relationship reset does not implicitly reset archetype state;
16. observation ledger remains bounded;
17. no localStorage/sessionStorage/cookie/cloud persistence is introduced;
18. all contextual choice banks remain <=3;
19. C2 timing/typing/delayed-choice receipt remains true;
20. no page errors occur.

## 21. Explicit non-goals

C3.3 does NOT authorize:

- state-dependent Auren tone;
- mask-depth changes;
- trust/archetype-dependent disclosure;
- dynamic product framing;
- scene offers;
- scene admission;
- persistence;
- visible archetype meter;
- public diagnosis;
- pressure-break classification;
- copying Coherence Diagnostic scoring wholesale;
- rewriting the Coherence Diagnostic;
- other-character mutation.

Those remain later stages or outside C3.

## 22. Success condition

C3.3 succeeds when Auren has an inspectable, deterministic, revisable, session-only four-archetype evidence model that:

- preserves the full vector;
- separates claim from observation;
- represents mixed evidence;
- revises with new evidence;
- never treats the model as fixed identity;
- leaves Products untouched;
- composes cleanly with C3.2.

## 23. Next operation after freeze

After this architecture-only contract is merged:

1. implement the bounded archetype evidence module/composition;
2. add exact-head verifier and qualification workflow;
3. register the qualification capability without merging the product candidate;
4. qualify against `e1995aa86ff2fc3c04c4462d644f41f0128c5d25`;
5. repair only proven defects;
6. adopt only after green exact-head evidence.

Only then freeze C3.4 State-Dependent Auren.

## Terminal law

**C3.3 = PROVISIONAL VISITOR EVIDENCE, NOT IDENTITY.**

**FOUR ARCHETYPES ONLY.**

**FULL VECTOR SURVIVES.**

**CLAIM != OBSERVATION.**

**PRODUCTS REMAIN UNSCORED.**

**C3.4 OWNS STATE-DEPENDENT AUREN.**
