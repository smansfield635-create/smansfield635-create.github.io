# Auren C4.4 — Privacy Boundary Interaction Contract

Status: **FROZEN / IMPLEMENTATION NOT YET AUTHORIZED BY THIS RECORD**
Date: 2026-09-29

Controlling baseline: `5682d7b168d1b943ae20bd9b1993a13045307d1a`

Parent:
- `project-records/auren-c4-3b-custody-relationship-mapping-audit-2026-09-29.md`

## 1. Purpose

C4.4 creates one bounded Manor privacy interaction in which Auren explicitly states a disclosure boundary.

The interaction proves an interpersonal boundary exists.

C4.4 itself does NOT yet map the visitor's response into C3.2 relationship state.

## 2. Canonical authority

Auren canon already binds:
- Custody;
- what stays hidden;
- hidden residents;
- protective deception;
- exposure versus protection;
- public misdirection;
- responsibility for whether protection becomes control.

Therefore Auren may explicitly say that protected residents' identities/private stories are not his to disclose.

He may discuss his own responsibility and non-identifying Manor context.

## 3. Scenario

Scenario id:

`PRIVACY_BOUNDARY_001`

Auren states, in authored voice, the equivalent of:

"There are people the Manor protects. I can tell you what protecting them requires from me. I am not giving you their names or private stories."

This is the explicit relational boundary.

No protected identity or private fact is supplied.

## 4. Exactly three visitor choices

### Choice A — RESPECT_BOUNDARY

Public intent:
**Fair. Tell me what the responsibility requires from you.**

Semantic:
`RESPECT_BOUNDARY`

Interaction consequence:
- boundaryPosture = `RESPECTED`
- disclosureScope = `AUREN_RESPONSIBILITY_ONLY`
- protectedInformationRequested = false
- continuation = `LAWFUL_CONTEXT`

### Choice B — REQUEST_LIMITED_CONTEXT

Public intent:
**Can you explain the situation without identifying anyone?**

Semantic:
`REQUEST_LIMITED_CONTEXT`

Interaction consequence:
- boundaryPosture = `OBSERVED`
- disclosureScope = `NON_IDENTIFYING_CONTEXT`
- protectedInformationRequested = false
- continuation = `LAWFUL_CONTEXT`

This is not PRY merely because the visitor asks a follow-up.

### Choice C — PRESS_PROTECTED_INFORMATION

Public intent:
**Who are they? Tell me who you're protecting.**

Semantic:
`PRESS_PROTECTED_INFORMATION`

Interaction consequence:
- boundaryPosture = `PRESSED`
- disclosureScope = `REFUSED`
- protectedInformationRequested = true
- continuation = `BOUNDARY_REASSERTED`

Auren refuses the protected information.

## 5. No protected disclosure

No choice may reveal:
- resident names;
- ages;
- biographies;
- family identities;
- reason for protection;
- chronology;
- medical/legal/criminal information;
- hidden lineage;
- another character's private story.

The PRESS choice produces refusal, not secret content.

## 6. No trick question

The public choices must accurately communicate their intent.

The visitor must not unknowingly incur a boundary event through ambiguous wording.

No hidden trap design.

## 7. Pure privacy state

Preferred module:
`characters/manor-privacy-state.mjs`

Required fields:
- `version`
- `scenarioId`
- `phase`: PRESENTED / DECIDED
- `choiceId`
- `choiceSemantic`
- `privacyConsequence`
- `decisionCount`
- `lastReceipt`

Single decision only.

## 8. Event type

`CHOOSE_PRIVACY_RESPONSE`

Accepted choice ids:
- `respect-boundary`
- `limited-context`
- `press-protected`

Unknown event/scenario/choice fails closed.

Second decision fails closed.

## 9. Deterministic receipt

Required fields:
- schema;
- eventType;
- scenarioId;
- choiceId;
- choiceSemantic;
- accepted;
- reason;
- priorDecisionCount;
- nextDecisionCount;
- privacyConsequence;
- sourceAuthority.

Source authority:
Auren Sanctuary Builder / Custody / hidden-resident protection canon.

No motive/personality field.

## 10. Auren authored reactions

### RESPECT_BOUNDARY
Auren may acknowledge that the visitor accepted the line and continue with his own responsibility.

### REQUEST_LIMITED_CONTEXT
Auren may answer with non-identifying context about his responsibility, the Manor, protection versus control, or exposure management.

### PRESS_PROTECTED_INFORMATION
Auren explicitly refuses and reasserts the boundary.

He may be more guarded in tone.

He does not reveal the requested information.

## 11. Relationship mapping deferred one gate

C4.4 records explicit interpersonal boundary posture, making later relationship mapping materially more grounded than C4.3A.

However C4.4 itself does not mutate C3.2.

After C4.4 qualification, a separate **C4.4B Relationship Mapping Contract** may evaluate:

- RESPECT_BOUNDARY -> candidate `RESPECT_BOUNDARY`;
- REQUEST_LIMITED_CONTEXT -> candidate neutral/FOLLOW_UP;
- PRESS_PROTECTED_INFORMATION -> candidate `PRY`.

Those mappings are NOT authorized until C4.4B is frozen.

## 12. Archetype neutrality

C4.4 does not score Strategist/Builder/Mitigator/Auditor.

Privacy behavior and archetype evidence remain separate.

## 13. World/discovery neutrality

This is a decision/dialogue interaction.

It does not:
- create a resident;
- create a discovery;
- change visited destinations;
- change narrative world state;
- change cardinal state;
- create chronology.

## 14. Entry context

C4.4 may be exposed only after the existing validated Manor-return/Auren context.

It must not appear in Products.

It must not replace ordinary Auren entry absent relevant return context.

It may coexist with C4.3A only within <=3 contextual choices.

Implementation must audit the current post-return choice bank before placement and must not displace existing choices silently.

## 15. Persistence

In-memory only.

No localStorage, cookies, account/cloud memory, or cross-visit privacy profile.

## 16. Qualification

Exact-head qualification must prove:

1. exactly one privacy scenario;
2. exact scenario id;
3. exactly three choices;
4. exact choice semantics;
5. RESPECT consequence exact;
6. LIMITED_CONTEXT consequence exact;
7. PRESS consequence exact;
8. PRESS never reveals protected information;
9. LIMITED_CONTEXT remains non-identifying;
10. public labels are non-deceptive;
11. one decision only;
12. malformed inputs fail closed;
13. deterministic receipt;
14. no relationship mutation;
15. no archetype mutation;
16. no world/discovery mutation;
17. no persistence;
18. Products exclusion;
19. <=3 contextual choices;
20. C4.1/C4.2/C4.3A preservation;
21. no page/runtime errors.

## 17. Implementation boundary

May add:
- pure privacy state module;
- browser composition if needed;
- three authored reactions;
- minimal contextual placement;
- verifier/workflow.

May not add:
- relationship mapping;
- archetype mapping;
- protected resident data;
- additional privacy scenarios;
- broad UI redesign.

## 18. Next boundary

After green C4.4 adoption:

**C4.4B — Privacy Boundary to Relationship Mapping Contract**

That stage may finally determine whether the explicit interpersonal choices lawfully map into C3.2 transitions.

## Terminal law

**AUREN STATES THE BOUNDARY FIRST.**

**THE VISITOR KNOWS WHAT EACH CHOICE MEANS.**

**LIMITED CONTEXT IS NOT PRY.**

**PRESSING FOR PROTECTED IDENTITY GETS REFUSAL, NOT DISCLOSURE.**

**C4.4 RECORDS BOUNDARY POSTURE; C4.4B MAY LATER MAP RELATIONSHIP EFFECT.**
