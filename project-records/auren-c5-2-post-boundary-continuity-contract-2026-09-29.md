# Auren C5.2 — Post-Boundary Conversation Continuity Contract

Status: **FROZEN / IMPLEMENTATION NOT YET AUTHORIZED BY THIS RECORD**
Date: 2026-09-29

Baseline: `ed0e3f1de2f906b92dc07bebc1b2bf95b947331c`

## Product audit finding

C5.1 successfully composes privacy evidence -> relationship state -> state-dependent authored Auren.

However the three terminal privacy response nodes currently expose zero next choices.

The internal relationship loop works, but the public conversation stops immediately after:
- privacyRespect;
- privacyLimited;
- privacyPress.

This is a concrete product continuity defect.

## Objective

After every qualified C5.1 privacy response, restore a lawful progressive conversation path without exceeding three choices or creating new state engines.

## Required continuation

Each of the three privacy outcome nodes must offer a small authored continuation bank.

Preferred shared options:

1. **Back to Auren**
   -> `about`
   -> normal state-dependent Learn About Auren conversation.

2. **Products**
   -> `products`
   -> public product utility.

A third option is not required.

## Relationship preservation

Returning to `about` must preserve the current in-memory relationship phase.

Therefore:
- respect path returns to Auren as ENGAGED / OPEN_MASK;
- limited-context path returns with the unchanged prior phase;
- press path returns as GUARDED / PROTECTIVE_MASK.

No new relationship transition is attached merely to continuing.

## No duplicate privacy evidence

Continuation buttons carry:
- no privacyChoiceId;
- no relationshipAction;
- no archetypeEvidence.

The already-consumed privacy receipt is not replayed.

## Products law

Products remains unscored public utility.

Entering Products after any privacy outcome does not reset or mutate relationship state.

## Choice ceiling

Privacy outcome bank = exactly two authored choices.

Never >3.

## Timing

Existing C2 timed performance remains unchanged.

Choices appear only after Auren finishes the C5.1 response.

## Persistence

No persistence is added.

State continuity is only the existing in-memory session behavior.

## Qualification

Must prove:
1. all three privacy outcome nodes render exactly two continuation choices;
2. Back to Auren routes to `about`;
3. respect path preserves ENGAGED and selects OPEN_MASK at `about`;
4. limited path preserves its unchanged relationship state;
5. press path preserves GUARDED and selects PROTECTIVE_MASK at `about`;
6. continuation causes no extra relationship revision;
7. continuation causes no archetype revision;
8. Products remains reachable;
9. Products causes no relationship scoring;
10. privacy receipt is not consumed twice;
11. <=3 choices everywhere tested;
12. C2 timing preserved;
13. no persistence;
14. no runtime errors.

## Mutation scope

Preferred product mutation:
- `products/auren/auren.voice.js` only.

Verifier/workflow may be added.

Do not mutate:
- chamber runtime;
- relationship engine;
- archetype engine;
- state-dependent selector;
- privacy mapper;
- privacy state;
- world state;
- CSS/room.

## Terminal law

**C5.2 IS CONVERSATION CONTINUITY, NOT A NEW ENGINE.**

**POST-BOUNDARY RESPONSES MUST NOT DEAD-END THE VISITOR.**

**CONTINUING DOES NOT CREATE NEW RELATIONSHIP EVIDENCE.**

**CURRENT SESSION STATE MUST SURVIVE THE CONTINUATION.**
