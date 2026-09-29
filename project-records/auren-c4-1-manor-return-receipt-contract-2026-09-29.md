# Auren C4.1 — Manor Return Receipt Foundation Contract

Status: **FROZEN / IMPLEMENTATION_NOT_YET_AUTHORIZED_BY_THIS RECORD**
Date: 2026-09-29

Controlling baseline: `cf40f6f6e724375c2714b714844aff83fe35e49b`

Parent:
- `project-records/auren-c3-terminal-closure-2026-09-29.md`
- `project-records/auren-c4-successor-resolidification-2026-09-29.md`

## 1. Purpose

C4.1 creates a narrow world-owned receipt proving only source-authorized navigation/world facts for the C3.6 Auren -> Mirror Manor corridor and an explicit lawful return to Auren.

C4.1 does not interpret the visitor.

C4.1 does not mutate Auren.

C4.1 creates the evidence envelope that a later C4.2 may consume.

## 2. Authority sources

C4.1 may derive truth only from existing authority:

### Destination registry
`characters/destination-registry.mjs`

Controlling Manor destination:
- id: `manor`
- title: `Mirror Manor`
- enterable: true
- route: `/characters/?scene=manor&entry=fade`

Controlling Auren destination:
- id: `auren`
- route: `/characters/?scene=auren&entry=fade`

### Narrative world state
`characters/narrative-world-state.mjs`

Existing Manor visit consequences:
- physicalExpression: `manor-mass`
- arrivalExpression: `architecture-emerges`
- worldEffects: `manor-horizon-legible`
- reveals: `auren`, `jeeves`
- sensoryState: `window-glow`

### Existing visit bookkeeping / route runtime
Existing world visit history and scene-transition/navigation authority remain controlling for whether a destination was actually visited.

C4.1 may not substitute an Auren-side claim for world proof.

## 3. Receipt ownership

The receipt belongs to world/transition authority.

Preferred implementation is a pure world-side module under `characters/`, not an Auren relationship module.

Auren may later read a validated receipt.

Auren SHALL NOT mint, upgrade or reinterpret the world receipt.

## 4. Receipt schema

Required logical schema:

- `schema`
- `receiptId`
- `sourceDestinationId`
- `offeredDestinationId`
- `offeredRoute`
- `destinationRegistryValidated`
- `destinationVisited`
- `visitedDestinationId`
- `worldStateVersion`
- `worldSignals`
  - `physicalExpression`
  - `arrivalExpression`
  - `worldEffects`
  - `reveals`
  - `sensoryState`
- `returnDestinationId`
- `returnRoute`
- `returnRegistryValidated`
- `returned`
- `complete`
- `reason`

The receipt must be deterministic from validated inputs.

No free-form visitor interpretation field is authorized.

## 5. Receipt lifecycle

### OFFER_PROVEN
C3.6 offer provenance may establish:
- sourceDestinationId = `auren`;
- offeredDestinationId = `manor`;
- offeredRoute = exact registered Manor route.

This alone does not set destinationVisited.

### MANOR_VISIT_PROVEN
Only world/visit authority may set:
- destinationVisited = true;
- visitedDestinationId = `manor`;
- source-authorized Manor worldSignals.

A route click or offer alone is insufficient.

### RETURN_PROVEN
Only explicit navigation through a validated Auren destination route may set:
- returnDestinationId = `auren`;
- returnRoute = exact registered Auren route;
- returnRegistryValidated = true;
- returned = true.

Browser Back alone is not automatically a C4.1 return receipt unless existing world authority explicitly resolves it as an Auren destination entry.

### COMPLETE
`complete=true` only when:
- offer provenance is valid;
- Manor visit is world-proven;
- explicit Auren return is registry-validated and proven.

## 6. Exact routes

C4.1 freezes the initial routes:

Manor:
`/characters/?scene=manor&entry=fade`

Auren:
`/characters/?scene=auren&entry=fade`

Unknown, malformed or mismatched routes fail closed.

No route aliases are inferred.

## 7. World signals

When Manor visit is proven, C4.1 may report exactly the existing Manor-derived signals from narrative-world-state authority.

It may not transform those signals into:
- emotional interpretation;
- trust interpretation;
- visitor behavior classification;
- discovery claims;
- chronology claims.

The receipt reports what the world authority says happened to world presentation after a Manor visit.

## 8. No relationship mutation

C4.1 SHALL NOT call or mutate:
- `AUREN_RELATIONSHIP`;
- relationship phase;
- relationship event ledger;
- relationship revision.

Receipt creation, Manor visit and Auren return are relationship-neutral.

## 9. No archetype mutation

C4.1 SHALL NOT call or mutate:
- `AUREN_ARCHETYPE_EVIDENCE`;
- vector;
- claims;
- provisional primary/support;
- disposition;
- confidence;
- archetype revision.

World navigation is not archetype evidence.

## 10. No discovery upgrade

C4.1 does not create or upgrade:
- cardinal discovery availability;
- Manor discovery slots;
- hidden lineage;
- character presence chronology;
- private biography;
- scene completion metrics.

Manor remains outside the four cardinal-site state machine unless separately authorized.

## 11. Persistence boundary

C3.5 remains omitted.

C4.1 may use the existing narrow world/session visit bookkeeping already required by Mirrorland navigation.

It may not introduce persistent relationship/archetype/profile memory.

If the existing world runtime already persists visited destination IDs for its own navigation/world rendering, C4.1 may read that existing authority but may not broaden its retention purpose or payload.

The C4.1 receipt itself is in-memory/session-scoped unless a later contract separately authorizes durable receipt persistence.

## 12. Fail-closed validation

Receipt construction rejects or remains incomplete when:
- source destination is not Auren;
- offered destination is not Manor;
- offered route mismatches registry;
- destination is not world-proven visited;
- visited destination is not Manor;
- return destination is not Auren;
- return route mismatches registry;
- world-state version is unknown;
- required Manor world signals cannot be derived from authority.

Failure preserves source state and creates no relationship/archetype consequences.

## 13. Deterministic receipt identity

Receipt identity must derive deterministically from the bounded session operation inputs/state.

C4.1 SHALL NOT use a random identifier as semantic authority.

The implementation may use a stable structured identifier/version + transition counter or equivalent deterministic mechanism.

## 14. Preferred implementation surface

Preferred new module:

- `characters/manor-return-receipt.mjs`

Preferred characteristics:
- pure functions;
- imports destination registry and narrative world-state authority;
- no DOM;
- no Auren module imports;
- no relationship/archetype imports;
- no network;
- no new persistence;
- no prose generation.

Minimal existing-world composition may be admitted only after implementation audit proves where authoritative visited/return state is available.

## 15. C4.1 qualification

Exact-head qualification must prove at minimum:

1. terminal C3 files remain unchanged;
2. exact Manor registry route validates;
3. exact Auren registry route validates;
4. offer provenance alone does not prove visit;
5. route click alone does not prove visit without world visit evidence;
6. proven Manor visit yields exactly existing Manor world signals;
7. Manor visit reveals only what existing narrative-world-state derives;
8. explicit validated Auren return can complete the receipt;
9. browser Back/non-Auren route does not automatically count as return;
10. malformed Manor route fails closed;
11. malformed Auren return route fails closed;
12. unknown destination fails closed;
13. incomplete evidence yields `complete=false`;
14. complete lawful corridor yields `complete=true`;
15. receipt generation does not mutate relationship state;
16. receipt generation does not mutate archetype state;
17. no cardinal discovery availability changes;
18. no new persistence surface is introduced;
19. deterministic identical inputs produce identical semantic receipt;
20. no world-state law is rewritten.

## 16. C4.1 non-goals

C4.1 does NOT authorize:
- Auren acknowledgment dialogue;
- relationship gain/loss;
- archetype evidence;
- Manor gameplay;
- custody/admission challenge;
- discovery cards;
- new Manor scene mechanics;
- Jeeves interaction changes;
- C3.6 offer changes;
- persistence expansion;
- scene outcome interpretation.

Those remain later C4 boundaries.

## 17. C4.2 handoff

After C4.1 is implemented, exact-head qualified and adopted, C4.2 may be frozen.

C4.2 candidate:
**Auren Return Acknowledgment**

It may consume a validated complete C4.1 receipt to establish shared visit context.

C4.2 still must not mutate relationship/archetype state merely because the visitor visited and returned.

## Success condition

C4.1 succeeds when the system can prove:

**Auren lawfully offered Manor -> world authority proves Manor visit -> existing Manor world consequences are captured -> world authority proves explicit Auren return**

without adding any interpretation of why the visitor did it or what it means about them.

## Terminal law

**WORLD FACTS ONLY.**

**VISIT IS NOT MOTIVE.**

**RETURN IS NOT TRUST.**

**NO RELATIONSHIP OR ARCHETYPE MUTATION.**

**NO MANOR DISCOVERY ENGINE.**

**C4.1 PRODUCES EVIDENCE; C4.2 MAY LATER ACKNOWLEDGE IT.**
