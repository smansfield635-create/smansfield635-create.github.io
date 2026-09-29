# Auren C4.2 — Validated Manor Return Acknowledgment Contract

Status: **FROZEN / IMPLEMENTATION_NOT_YET_AUTHORIZED BY THIS RECORD**
Date: 2026-09-29

Accepted C4.1 baseline: `8298800254c0f6a36a7814100b10aaafb3b3d79f`

Qualified C4.1 run: `36631037420`

## Purpose

C4.2 allows Auren to acknowledge a **validated complete C4.1 Manor Return Receipt** as shared visit context.

C4.2 is acknowledgment only.

It does not interpret the visit as trust, respect, archetype evidence, success, failure or discovery.

## Required input authority

The only C4.2 world-return input is a receipt with:

- schema = `AUREN_C4_1_MANOR_RETURN_RECEIPT_V1`;
- destinationRegistryValidated = true;
- destinationVisited = true;
- visitedDestinationId = `manor`;
- returnDestinationId = `auren`;
- returnRegistryValidated = true;
- returned = true;
- complete = true;
- exact Manor and Auren routes;
- source-authorized Manor world signals.

Incomplete or malformed receipts fail closed to ordinary C3 conversation.

## Acknowledgment authority

Auren may say, in authored canon-bound language, that:
- the visitor has now seen/reached the Manor;
- they are back with Auren;
- the Manor is the place connected to what he was describing;
- source-authorized visible/world facts contained in the receipt may be referenced.

Auren may not say that the visitor:
- earned his trust;
- proved loyalty;
- respected a boundary;
- passed a test;
- failed a test;
- discovered a secret;
- demonstrated an archetype;
- now deserves deeper disclosure.

## Relationship invariance

Consuming/acknowledging a C4.1 receipt SHALL NOT mutate:
- relationship phase;
- relationship events;
- relationship revision.

A later authored conversational choice may still carry an ordinary C3.2 relationship action, but the return receipt itself carries none.

## Archetype invariance

Consuming/acknowledging a C4.1 receipt SHALL NOT mutate:
- archetype vector;
- claims;
- observations;
- provisional primary/support;
- disposition/confidence;
- archetype revision.

## World invariance

C4.2 is a consumer.

It does not:
- add visited destinations;
- change world signals;
- change reveal state;
- change destination registry;
- create discoveries;
- alter cardinal state.

## Persistence

C3.5 remains omitted.

C4.2 does not add persistent visitor memory.

A validated receipt may be consumed only through the bounded current-session handoff mechanism separately proven in implementation.

No account/cloud/localStorage relationship profile is authorized.

## Authored response

Preferred implementation adds a dedicated authored Auren return acknowledgment node/variant.

It should sound like Auren and may reference the Manor at the level already authorized by C4.1.

It must not become a generic system message.

## Entry behavior

When a valid complete C4.1 receipt is present on Auren entry:
- acknowledge the return before or as part of the normal Learn About Auren continuation;
- preserve Products availability;
- preserve <=3 contextual choices;
- preserve C2 timing/typing;
- preserve C3.4 mask law from current relationship state.

When no valid complete receipt is present:
- baseline C3 Auren behavior remains unchanged.

## Receipt consumption

C4.2 should expose an inspectable acknowledgment receipt:

- contract;
- c4_1ReceiptId;
- c4_1Validated;
- acknowledged;
- acknowledgmentNode;
- relationshipRevisionBefore;
- relationshipRevisionAfter;
- archetypeRevisionBefore;
- archetypeRevisionAfter;
- reason.

Successful acknowledgment requires relationship/archetype revisions to remain identical.

## Preferred implementation surface

Preferred new module:
- `products/auren/auren.return-context.js`

Minimal composition:
- `products/auren/auren.voice.js` — authored return acknowledgment;
- `products/auren/auren.chamber.js` — validate/consume bounded return context at entry;
- `products/auren/index.html` — loading plumbing only if required.

C4.1 world module remains authoritative and should not be rewritten absent a proven defect.

No CSS/room redesign.

## Qualification

Exact-head qualification must prove:

1. C4.1 receipt contract remains unchanged;
2. valid complete C4.1 receipt is accepted;
3. incomplete receipt is rejected;
4. malformed receipt is rejected;
5. wrong routes are rejected;
6. valid return produces authored Auren acknowledgment;
7. acknowledgment references only authorized Manor/shared-return facts;
8. no trust/respect/test/archetype/discovery claim is emitted;
9. relationship revision unchanged by acknowledgment;
10. archetype revision unchanged by acknowledgment;
11. world state unchanged by acknowledgment;
12. Products remain available;
13. <=3 choices;
14. C2 timing/typing preserved;
15. C3.4 mask law preserved;
16. no persistence expansion;
17. absent receipt preserves baseline C3 behavior;
18. no page errors.

## Non-goals

C4.2 does not authorize:
- scene-derived relationship mutation;
- Manor interaction/gameplay;
- custody/admission tests;
- discovery mechanics;
- Jeeves changes;
- persistence;
- world-state changes;
- free-text generative dialogue.

## C4.3 handoff

After C4.2 is green and adopted, C4.3 performs the already re-solidified **Manor Interaction Authority Audit / Contract**.

C4.3 must determine whether any canonical Auren custody/admission/protection pressures can lawfully become explicit Manor event semantics.

## Terminal law

**ACKNOWLEDGE WORLD FACT; DO NOT INTERPRET VISITOR MOTIVE.**

**RETURN CONTEXT DOES NOT CHANGE TRUST.**

**RETURN CONTEXT DOES NOT CHANGE ARCHETYPE EVIDENCE.**

**C4.1 PRODUCES WORLD EVIDENCE. C4.2 ONLY ACKNOWLEDGES IT.**
