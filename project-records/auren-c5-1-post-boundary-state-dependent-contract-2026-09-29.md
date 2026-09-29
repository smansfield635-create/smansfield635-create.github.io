# Auren C5.1 — Post-Boundary State-Dependent Auren Contract

Status: **FROZEN / IMPLEMENTATION NOT YET AUTHORIZED BY THIS RECORD**
Date: 2026-09-29

Controlling baseline: `2a37f73bb3bf203938f6927da6c7d321a480b5ac`

Parent:
- `project-records/auren-c5-successor-resolidification-2026-09-29.md`

## Purpose

Close the proven composition loop:

validated C4.4 privacy receipt
-> C4.4B receipt mapper
-> existing C3.2 relationship state
-> existing C3.4 state-dependent authored selection
-> Auren continuation.

No new relationship or mask engine is authorized.

## Existing APIs remain authoritative

C5.1 consumes:
- `AUREN_PRIVACY_RELATIONSHIP_MAPPING`
- `AUREN_RELATIONSHIP`
- `AUREN_STATE_DEPENDENT`
- existing Auren authored voice nodes.

C5.1 does not replace these APIs.

## Respect path

Input:
C4.4 choice semantic `RESPECT_BOUNDARY`.

C4.4B must first apply existing C3.2 `RESPECT_BOUNDARY`.

The continuation is then selected using the resulting relationship state.

When resulting phase is ENGAGED:
- mask = OPEN_MASK;
- Auren may acknowledge that the visitor accepted the line;
- Auren may speak more openly about his own responsibility, protection-versus-control tension, or why he keeps the line;
- no protected resident identity/private story is disclosed.

The continuation must not claim permanent trust or loyalty.

## Limited-context path

Input:
`REQUEST_LIMITED_CONTEXT`.

C4.4B remains relationship-neutral.

Relationship phase/revision must remain exactly unchanged.

Continuation is selected from the unchanged relationship state.

Auren may answer the lawful non-identifying question.

He must not:
- reward it with an invented relationship transition;
- claim increased trust;
- treat it as PRY;
- expose protected information.

## Press path

Input:
`PRESS_PROTECTED_INFORMATION`.

C4.4B must first apply existing C3.2 `PRY`.

Continuation is selected from resulting relationship state.

When resulting phase is GUARDED:
- mask = PROTECTIVE_MASK;
- Auren reasserts the privacy line;
- tone may become guarded/protective;
- protected information remains refused.

Auren must not:
- infer malicious motive;
- insult or morally score the visitor;
- fabricate threat;
- reveal the requested identity.

## Ordering law

Relationship mapping occurs before continuation selection.

The continuation must consume the post-mapping relationship state.

Forbidden order:
select continuation -> later mutate relationship.

## Authored continuation nodes

Preferred dedicated nodes:
- `privacyRespectContinuation`
- `privacyLimitedContinuation`
- `privacyPressContinuation`

Each node remains authored/canon-bound.

State-dependent selection may provide relationship variants where existing C3.4 machinery supports them.

No free-text generation.

## Archetype boundary

Privacy choices remain archetype-neutral in C5.1.

C3.3 revision/vector/observations must not change.

## Products boundary

Products remain available through normal topology and remain outside automatic relationship scoring.

C5.1 must not alter product dialogue or product authority.

## Choice ceiling

Every rendered bank remains <=3 choices.

C5.1 must not restore any hidden fourth-option defect.

## Timing

C2 typing/timing/delayed-choice behavior remains controlling.

Continuation assertions must synchronize with the stable post-response chamber state.

## Persistence

C3.5 remains omitted.

No localStorage, session relationship profile, cookie, account/cloud profile or cross-visit persistence.

## Replay

Replaying the same privacy receipt must not apply a second relationship transition.

No duplicate continuation may cause duplicate relationship evidence.

## Qualification

Exact-head qualification must prove:

1. RESPECT privacy receipt maps before continuation selection;
2. resulting relationship state is consumed by C3.4;
3. respect path uses ENGAGED / OPEN_MASK when starting PUBLIC;
4. respect continuation remains within Auren authority;
5. LIMITED_CONTEXT leaves relationship revision unchanged;
6. limited continuation uses unchanged relationship state;
7. limited context is not treated as PRY;
8. PRESS maps PRY before continuation;
9. press path uses GUARDED / PROTECTIVE_MASK when starting PUBLIC;
10. press continuation refuses protected information;
11. no motive/morality inference;
12. no protected identity/private story;
13. replay does not mutate relationship twice;
14. archetype unchanged;
15. Products invariant;
16. <=3 choices;
17. C2 timing/typing preserved;
18. no persistence;
19. C4.4/C4.4B receipt semantics preserved;
20. no page/runtime errors.

## Mutation scope

Preferred changes:
- Auren voice: dedicated post-boundary continuation nodes;
- Auren chamber: route privacy outcome into post-mapping continuation;
- optional narrow composition helper if necessary;
- verifier/workflow.

Do not mutate:
- C3.2 relationship transition law;
- C3.3 archetype engine;
- C4.4 privacy state semantics;
- C4.4B mapping semantics;
- world/custody/discovery state;
- CSS/room design.

## After C5.1

Re-audit before selecting C5.2.

No additional Manor pressure family, archetype mapping or persistence is pre-authorized.

## Terminal law

**MAP FIRST. SELECT SECOND.**

**POST-BOUNDARY AUREN MUST REFLECT THE RELATIONSHIP STATE THAT ACTUALLY EXISTS.**

**LIMITED CONTEXT REMAINS NEUTRAL.**

**PRESS PRODUCES PROTECTIVE GUARDING, NOT RETALIATION.**

**NO PERSISTENCE OR ARCHETYPE INFERENCE.**
