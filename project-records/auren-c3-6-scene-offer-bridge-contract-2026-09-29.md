# Auren C3.6 — Scene-Offer Bridge Contract

Status: **FROZEN / IMPLEMENTATION_NOT_YET_AUTHORIZED_BY_THIS RECORD**
Date: 2026-09-29

Accepted C3.4 baseline: `1ff1000e5fda8c6e4332e89b29cea6c019a8743c`
C3.5 omission closure: `fd64688b892485013619ad649147fd301ce8fa5a`

## 1. Purpose

C3.6 connects Auren's qualified relationship conversation to an existing lawful Mirrorland destination without granting Auren world-admission authority.

C3.6 governs **Auren's willingness to offer** a scene opportunity.

Existing destination/world authority governs whether the visitor may actually enter and what becomes available there.

## 2. Initial corridor

The first C3.6 corridor is restricted to the strongest recovered world relationship:

**Mirror Manor ↔ Auren ↔ Jeeves**

Existing registered routes:
- Mirror Manor: `/characters/?scene=manor&entry=fade`
- Auren: `/characters/?scene=auren&entry=fade`
- Jeeves: `/characters/?scene=jeeves&entry=fade`

C3.6 SHALL NOT invent a new Auren-specific cardinal site/problem engine.

## 3. Offer versus admission

Two authorities remain distinct:

### Auren offer authority
C3.6 may decide whether Auren is willing to present a lawful scene/handoff option.

### World admission authority
The destination registry, narrative world state, scene transition and any destination-specific guards remain controlling for actual entry, revelation, discoveries and chronology.

An Auren offer is not proof of destination discovery availability.

## 4. Eligibility

Initial C3.6 offer eligibility requires:

- relationship phase = ENGAGED;
- visitor is currently in Learn About Auren mode/path;
- no currently controlling GUARDED state;
- destination is present in the existing destination registry;
- destination is within the authorized Manor/Auren/Jeeves corridor.

Archetype evidence is not required for scene eligibility.

Archetype evidence may affect C3.4 framing but cannot independently unlock a scene.

PUBLIC and GUARDED do not receive the relationship-gated scene offer.

## 5. First offer

The first bounded scene offer is:

**Mirror Manor**

Rationale:
- strongest recovered parent corridor;
- manor is central to Auren's Sanctuary Builder canon;
- visiting Manor already has world-state relationships to Auren and Jeeves;
- avoids fabricating a new Auren problem/discovery scene.

Auren may frame the offer in his own canon-bound voice as an opportunity to see the place connected to what he has been discussing.

## 6. Jeeves boundary

C3.6 may preserve/recognize Jeeves as a lawful connected destination in the corridor.

The first proof does not require Auren to offer Jeeves directly.

A future authored handoff to Jeeves may be added only if destination authority remains intact and no private/held knowledge is exposed.

## 7. No fabricated scene content

C3.6 SHALL NOT create:

- Auren-specific cardinal discoveries;
- new Manor discoveries;
- new Jeeves discoveries;
- hidden lineage;
- unsupported chronology;
- new occupancy facts;
- invented scene problems;
- invented world relationships.

It routes only to existing authority.

## 8. Offer placement

The offer must appear as a contextual authored choice inside Learn About Auren after an eligible relationship-bearing exchange.

Rules:
- <=3 contextual choices;
- no modal/global unlock banner;
- no Products-mode scene offer;
- no hidden route injection unrelated to authored conversation;
- ordinary navigation remains available.

## 9. Guarded behavior

When GUARDED:
- scene offer is absent;
- Auren may retain protective/boundary-conscious C3.4 dialogue;
- Products remain available;
- visitor may recover to ENGAGED through already-qualified C3.2 authored boundary-respect behavior.

After lawful recovery to ENGAGED, the offer may become eligible again.

## 10. PUBLIC behavior

PUBLIC receives no relationship-gated Manor offer.

This does not make the Manor route nonexistent or globally inaccessible. It only means Auren does not offer it through the C3.6 relationship bridge.

## 11. Destination validation

Before rendering an offer, C3.6 must validate the destination against existing registered destination authority.

Unknown/unregistered destination:
- no offer;
- fail closed;
- receipt records rejection;
- no fallback invented route.

## 12. Offer receipt

C3.6 exposes an inspectable receipt:

- contract;
- sourceNode;
- relationshipPhase;
- destinationId;
- destinationRoute;
- registryValidated;
- eligible;
- offered;
- reason.

Receipt is instrumentation, not required public UI.

## 13. Handoff behavior

When the visitor selects the Manor offer:

- use the existing route/entry mechanism;
- do not mutate relationship/archetype state merely because navigation occurred;
- do not claim scene admission succeeded before destination authority handles it;
- preserve existing fade/entry semantics where already supported.

C3.6 is not authorized to rewrite destination-registry or world-state law merely to make the offer pass.

## 14. Products invariance

No scene offer may appear in Products mode.

Product content, routes and Book -> Elara remain unchanged.

## 15. Persistence

C3.5 remains omitted.

The offer is computed from current in-memory state only.

Reload/new visit does not preserve eligibility.

## 16. Preferred implementation surface

Preferred new bridge:
- `products/auren/auren.scene-offer.js`

Minimal composition:
- `products/auren/auren.voice.js` — authored scene-offer node/label only;
- `products/auren/auren.chamber.js` — ask bridge for eligible offer and render through existing choice/handoff mechanism;
- `products/auren/index.html` — module-loading plumbing only.

Read-only use of existing destination registry/world authority is preferred.

No CSS/room redesign.

## 17. Qualification

Exact-head qualification must prove:

1. all C3.1–C3.4 invariants remain intact;
2. C3.5 persistence remains absent;
3. PUBLIC receives no relationship-gated Manor offer;
4. ENGAGED receives the Manor offer at the contracted authored point;
5. GUARDED receives no offer;
6. GUARDED -> ENGAGED recovery restores eligibility;
7. archetype state alone cannot unlock offer;
8. Products never receives scene offer;
9. destination is registry-validated;
10. unknown destination fails closed;
11. offered route equals existing Manor route exactly;
12. selecting offer uses existing route/entry semantics;
13. selection does not fabricate discovery/chronology/world state;
14. scene offer does not itself mutate relationship/archetype state;
15. <=3 contextual choices;
16. no persistence introduced;
17. no page errors.

## 18. Explicit non-goals

C3.6 does NOT authorize:
- new Auren problem/discovery engine;
- cardinal discovery changes;
- world-state rewrite;
- automatic scene admission;
- scene-to-relationship feedback;
- persistence;
- other-character rewrite;
- hidden discovery disclosure;
- new destination routes;
- CSS/room redesign.

## 19. C3 closure condition

C3 closes when:
- C3.6 exact-head qualification is green;
- qualified bytes are adopted;
- a terminal C3 closure record identifies accepted baselines and receipts for C3.1–C3.6;
- C3.5 is recorded as intentionally omitted.

Any scene behavior feeding back into relationship state belongs to a successor cycle and must be re-solidified after C3 closure.

## Terminal law

**AUREN MAY OFFER. WORLD AUTHORITY ADMITS.**

**FIRST CORRIDOR = MIRROR MANOR / AUREN / JEEVES.**

**FIRST OFFER = MIRROR MANOR.**

**NO NEW DISCOVERY ENGINE.**

**C3.5 REMAINS OMITTED.**
