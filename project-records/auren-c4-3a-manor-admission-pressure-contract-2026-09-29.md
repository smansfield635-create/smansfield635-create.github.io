# Auren C4.3A — Manor Admission Pressure Interaction Contract

Status: **FROZEN / IMPLEMENTATION NOT YET AUTHORIZED BY THIS RECORD**
Date: 2026-09-29

Controlling baseline: `632ff845cf442d53dcb4139a03c282ffe2f19052`

Parent:
- `project-records/auren-c4-3-manor-interaction-authority-audit-2026-09-29.md`

## 1. Scope

C4.3A authorizes exactly one bounded, authored Manor custody vignette:

**ADMISSION_PRESSURE_001**

No second vignette, quest system, discovery system or generalized Manor game is authorized.

## 2. Canonical premise

A person needs somewhere safe to stay.

Bringing them into the Manor immediately could increase exposure risk for people already under the Manor's protection.

Refusing them could leave the person without shelter.

No identity, age, biography, threat source, chronology or private reason for needing shelter is supplied.

The premise exists only to exercise Auren's source-authorized custody / protection-versus-control tension.

## 3. Authored public framing

Auren may present the dilemma in his own voice.

Required meaning:

- someone needs shelter;
- the Manor already protects people whose exposure matters;
- immediate admission carries exposure risk;
- refusal carries shelter/harm risk;
- the visitor is being asked what they would do.

The wording must not imply there is a hidden correct answer.

## 4. Exactly three choices

### Choice A — ADMIT_WITH_BOUNDARY

Public intent:
**Let them in, but contain the exposure.**

Semantic:
`ADMIT_WITH_BOUNDARY`

Direct custody consequence:
- shelterAccess = `GRANTED_CONDITIONALLY`
- exposurePosture = `CONTAINED`
- verificationPosture = `PARALLEL`
- autonomyPressure = `BOUNDED`

Tradeoff:
Shelter is provided immediately while protective boundaries remain active.

### Choice B — DELAY_FOR_VERIFICATION

Public intent:
**Verify first, then decide quickly.**

Semantic:
`DELAY_FOR_VERIFICATION`

Direct custody consequence:
- shelterAccess = `PENDING`
- exposurePosture = `CONTAINED`
- verificationPosture = `PRIOR`
- autonomyPressure = `TEMPORARY_HOLD`

Tradeoff:
Existing residents remain protected from immediate exposure, but the person seeking shelter remains outside/pending during verification.

### Choice C — REFUSE_ADMISSION

Public intent:
**Do not bring them into the Manor.**

Semantic:
`REFUSE_ADMISSION`

Direct custody consequence:
- shelterAccess = `DENIED`
- exposurePosture = `MINIMIZED`
- verificationPosture = `NOT_REQUIRED`
- autonomyPressure = `NONE_FROM_MANOR`

Tradeoff:
Existing Manor exposure is minimized, but the person seeking shelter receives no Manor shelter.

## 5. No moral ranking

C4.3A SHALL NOT label any choice:
- correct;
- wrong;
- good;
- bad;
- loyal;
- disloyal;
- brave;
- cowardly;
- trustworthy;
- untrustworthy.

The receipt records the chosen custody posture and tradeoff only.

## 6. Pure state schema

Preferred module:
`characters/manor-custody-state.mjs`

Required state fields:
- `version`
- `scenarioId`
- `phase`: `PRESENTED` or `DECIDED`
- `choiceId`
- `choiceSemantic`
- `custodyConsequence`
- `decisionCount`
- `lastReceipt`

No visitor identity/profile fields.

## 7. Event vocabulary

Exactly one event type is required:

`CHOOSE_ADMISSION_RESPONSE`

Input:
- scenarioId
- choiceId

Accepted choice ids:
- `admit-boundary`
- `delay-verify`
- `refuse-admission`

Unknown scenario, event or choice fails closed and preserves prior state.

## 8. Deterministic event receipt

Required receipt fields:
- `schema`
- `eventType`
- `scenarioId`
- `choiceId`
- `choiceSemantic`
- `accepted`
- `reason`
- `priorDecisionCount`
- `nextDecisionCount`
- `custodyConsequence`
- `sourceAuthority`

`sourceAuthority` must identify Auren's registered Sanctuary Builder/Custody canon, not a fabricated world event.

## 9. One decision only

The first proof is single-decision.

After an accepted choice:
- phase = DECIDED;
- another `CHOOSE_ADMISSION_RESPONSE` fails closed;
- no farming/re-scoring by repeatedly selecting alternatives.

Reset/replay is not required in C4.3A.

## 10. Auren reaction authority

Each accepted choice may have a distinct authored Auren reaction.

Auren may:
- identify the tradeoff;
- say what concern the choice protects;
- point out what risk remains;
- connect the decision to his protection-versus-control problem.

Auren may not:
- declare the visitor trustworthy/untrustworthy;
- mutate relationship state;
- assign an archetype;
- reveal protected identities;
- convert his agreement/disagreement into moral truth.

## 11. Relationship neutrality

Before and after the vignette:
- relationship phase unchanged;
- relationship revision unchanged;
- relationship event ledger unchanged.

C4.3A choice semantics are not C3.2 actions.

## 12. Archetype neutrality

Before and after:
- vector unchanged;
- observations unchanged;
- claims unchanged;
- provisional pattern unchanged;
- archetype revision unchanged.

C4.3A choices are not C3.3 evidence.

## 13. World/discovery neutrality

The vignette is a canon-grounded decision exercise, not a claim that a new canonical person actually arrived at the Manor.

Therefore it does not:
- add a visited destination;
- change narrative world state;
- create a resident;
- create a discovery;
- change cardinal availability;
- create chronology.

## 14. Entry boundary

C4.3A may be offered only from an appropriate Auren/Manor context established by the existing C4 corridor.

It must not appear in Products.

It must not replace the normal Auren opening for visitors with no relevant context unless a later contract explicitly authorizes broader entry.

Exact public placement will be frozen during implementation planning after source audit of the current C4.2 chamber topology.

## 15. Persistence

C3.5 remains omitted.

C4.3A state is in-memory only.

No localStorage, cookies, account memory, cloud memory or cross-visit visitor decision profile.

## 16. Qualification requirements

Exact-head qualification must prove:

1. only one scenario exists;
2. scenario id is `ADMISSION_PRESSURE_001`;
3. exactly three choices exist;
4. all three choice ids/semantics match this contract;
5. ADMIT_WITH_BOUNDARY produces exact contracted custody consequence;
6. DELAY_FOR_VERIFICATION produces exact contracted custody consequence;
7. REFUSE_ADMISSION produces exact contracted custody consequence;
8. no choice has moral/trust/archetype score;
9. accepted decision moves PRESENTED -> DECIDED;
10. second decision fails closed;
11. unknown event fails closed;
12. unknown scenario fails closed;
13. unknown choice fails closed;
14. deterministic identical state/event yields identical semantic receipt;
15. relationship state/revision unchanged;
16. archetype state/revision unchanged;
17. narrative world state unchanged;
18. cardinal discovery state unchanged;
19. no persistence;
20. Products do not expose the vignette;
21. <=3 public choices;
22. C2 timing/typing preserved;
23. C4.1/C4.2 invariants preserved;
24. no page/runtime errors.

## 17. Implementation boundary

Initial implementation may add:
- pure `characters/manor-custody-state.mjs`;
- bounded Auren authored vignette/reactions;
- minimal chamber integration;
- verifier/workflow.

It may not add:
- additional pressure families;
- relationship mapping;
- archetype mapping;
- discovery mechanics;
- new Manor resident data;
- persistent state;
- broad UI redesign.

## 18. After C4.3A

Only after green exact-head qualification and adoption should the next boundary be chosen.

Candidate next steps:
- additional Privacy/Control/Exposure vignette contracts; or
- a separate audit asking whether any explicit C4.3A event is legitimately relationship-bearing.

Neither is authorized now.

## Terminal law

**ONE DILEMMA.**

**THREE AUTHORED CHOICES.**

**RECORD CUSTODY CONSEQUENCE, NOT MOTIVE.**

**NO CORRECT ANSWER SCORE.**

**NO TRUST OR ARCHETYPE MUTATION.**

**NO NEW RESIDENT OR DISCOVERY.**
