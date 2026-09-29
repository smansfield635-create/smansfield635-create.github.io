# Auren C4.4B — Privacy Boundary Relationship Mapping

Status: FROZEN CONTRACT / NO IMPLEMENTATION YET
Date: 2026-09-29

Accepted C4.4 baseline: 2ac840ac72192c54b44be0f2e83c37e7a085beda
Qualified C4.4 run: 36638372777

## Purpose

Map only validated C4.4 privacy-event receipts into the existing C3.2 relationship engine.

The privacy receipt is evidence. Dialogue text is not parsed as evidence.

## Exact mappings

### RESPECT_BOUNDARY
When an accepted PRIVACY_BOUNDARY_001 receipt records:
- choiceSemantic = RESPECT_BOUNDARY
- boundaryPosture = RESPECTED
- protectedInformationRequested = false

mapped C3.2 action:
RESPECT_BOUNDARY

### REQUEST_LIMITED_CONTEXT
When an accepted receipt records:
- choiceSemantic = REQUEST_LIMITED_CONTEXT
- boundaryPosture = OBSERVED
- disclosureScope = NON_IDENTIFYING_CONTEXT
- protectedInformationRequested = false

relationship result:
NO TRANSITION

This lawful follow-up is explicitly neutral.

### PRESS_PROTECTED_INFORMATION
When an accepted receipt records:
- choiceSemantic = PRESS_PROTECTED_INFORMATION
- boundaryPosture = PRESSED
- disclosureScope = REFUSED
- protectedInformationRequested = true

mapped C3.2 action:
PRY

## Validation

Mapping requires:
- exact C4.4 receipt schema;
- accepted receipt;
- scenario PRIVACY_BOUNDARY_001;
- exact known semantic;
- exact matching privacy consequence.

Mismatch or unknown input fails closed with no relationship mutation.

## Existing relationship authority

C4.4B does not create a new relationship engine.

It submits the mapped action to the existing C3.2 Auren relationship transition authority.

The existing engine determines the resulting phase and revision.

## Single application

One accepted privacy receipt may be mapped at most once in the current session.

Repeated consumption is a no-op/fail-closed result.

No relationship farming.

## Mapping receipt

The mapper must expose:
- contract
- privacy receipt identity/schema
- scenarioId
- choiceSemantic
- validated
- mappedAction
- applied
- relationship phase before/after
- relationship revision before/after
- reason

For REQUEST_LIMITED_CONTEXT:
- mappedAction = null
- applied = false
- revision unchanged
- reason = RELATIONSHIP_NEUTRAL_LAWFUL_CONTEXT

## Preserved boundaries

C4.4B does not:
- score morality;
- infer motive;
- score archetypes;
- map C4.3A admission choices;
- mutate privacy/custody/world/discovery state;
- introduce persistent visitor profiles.

C3.5 no-persistence law remains controlling.

## Qualification

Exact-head qualification must prove:
1. RESPECT maps only to RESPECT_BOUNDARY;
2. LIMITED_CONTEXT produces no transition;
3. PRESS maps only to PRY;
4. malformed/rejected/mismatched receipts fail closed;
5. receipt evidence is used rather than dialogue text;
6. each receipt applies at most once;
7. existing C3.2 engine remains transition authority;
8. archetype state unchanged;
9. privacy/custody/world state unchanged;
10. no persistence;
11. C4.4 behavior remains intact;
12. no runtime errors.

## Terminal law

EXPLICIT PRIVACY-BOUNDARY RESPONSE MAY BECOME RELATIONSHIP EVIDENCE.

RESPECT -> RESPECT_BOUNDARY.

LAWFUL LIMITED CONTEXT -> NEUTRAL.

PRESS PAST THE STATED PRIVACY LINE -> PRY.

RECEIPT, NOT TEXT, IS THE EVIDENCE.
