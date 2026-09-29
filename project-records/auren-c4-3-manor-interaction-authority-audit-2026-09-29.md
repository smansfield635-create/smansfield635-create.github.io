# Auren C4.3 — Manor Interaction Authority Audit and Contract Boundary

Status: **AUDIT CLOSED / INTERACTION AUTHORITY NARROWLY ESTABLISHED / IMPLEMENTATION NOT YET AUTHORIZED**
Date: 2026-09-29

Accepted C4.2 baseline: `0a212f1d0e75750fe007bdafc2e51cc73fdfe661`

## 1. Audit question

Can Auren's canonical custody/admission/protection pressures lawfully become explicit Mirror Manor interaction events without inventing world truth?

**Answer: yes, narrowly.**

The character authority is stronger than the currently implemented Manor event machinery, but it supports Auren-owned decision pressures rather than hidden-resident discoveries.

## 2. Canonical authority recovered

`control-plane/whole-estate/character-registry-v1/profiles/auren-vale.v1.json` binds:

- storyRole/coreClass: Sanctuary Builder;
- primaryTrait: Custody;
- governingTension: protection versus control;
- centralQuestion: "Can a sanctuary scale without becoming a prison?";
- duty: Auren decides who gets shelter, what stays hidden, and whether the manor becomes protection or control;
- originEvent: a child arrives whom Auren cannot safely turn away; estate becomes live sanctuary;
- strength: protective deception;
- weakness: overprotection;
- specialSkill: turns wealth, land, public misdirection and room control into a living shield;
- primaryBond: hidden residents;
- conflictMeter: exposure versus protection;
- development authority: sanctuary/custody logic and protection-versus-control review.

This is sufficient authority for interactions about Auren's **decision logic**.

## 3. World authority remains narrower

Existing Manor world state proves:
- Manor visit;
- architecture/world expression;
- Auren/Jeeves revelation;
- corridor relationships.

It does not yet define:
- named hidden resident identity;
- specific resident chronology;
- a solved Manor crisis;
- a discovery card;
- a canonical visitor success/failure.

Therefore C4.3 cannot authorize those as interaction content.

## 4. Lawful first Manor interaction vocabulary

A future bounded implementation may define hypothetical/situational Auren-owned decision events in the Manor using only canon already bound to him.

Initial lawful event families:

### ADMISSION_PRESSURE
A person needs shelter and Auren must decide whether/how to admit them without exposing existing residents.

Authority source:
Auren duty + origin event + custody role.

### PRIVACY_PRESSURE
A request for information conflicts with the obligation to keep protected people hidden.

Authority source:
what stays hidden + primary bond + protective deception.

### CONTROL_PRESSURE
A protective measure may keep people safe but risks turning sanctuary into confinement.

Authority source:
protection versus control + sanctuary/prison central question + overprotection weakness.

### EXPOSURE_PRESSURE
A public-facing choice can preserve cover or increase exposure.

Authority source:
public misdirection + room control + conflict meter.

These are **pressure families**, not discoveries and not pre-authored outcomes.

## 5. Required interaction form

The first implementation should be a bounded authored decision vignette, not a free-roaming Manor simulation.

Each vignette must:
- present only Auren-owned canon facts;
- offer <=3 authored choices;
- record the visitor's explicit choice;
- produce a deterministic event receipt;
- avoid declaring a universal right answer unless canon explicitly supplies one;
- preserve contradiction/tradeoff where appropriate.

## 6. Event receipt versus relationship evidence

The Manor interaction event receipt may record:
- pressure family;
- prompt/scenario id;
- choice id;
- choice semantic;
- explicit consequence category within the hypothetical vignette;
- source authority;
- accepted/rejected validity.

It does not automatically record:
- trust gained/lost;
- respect;
- loyalty;
- personality/archetype;
- moral worth.

Any later conversion from a Manor choice into Auren relationship evidence requires a separately frozen mapping contract.

## 7. Lawful choice semantics

Initial semantic vocabulary may include:

- `ADMIT_WITH_BOUNDARY`
- `REFUSE_ADMISSION`
- `DELAY_FOR_VERIFICATION`
- `PRESERVE_PRIVACY`
- `DISCLOSE_LIMITED_CONTEXT`
- `REFUSE_DISCLOSURE`
- `TIGHTEN_CONTROL`
- `PRESERVE_AGENCY`
- `REDUCE_RESTRICTION`
- `MAINTAIN_COVER`
- `ACCEPT_EXPOSURE`
- `SEEK_ALTERNATE_COVER`

These describe explicit choices in authored scenarios.

They are not inferred motives.

## 8. Forbidden scenario content

Do not invent:
- protected resident names;
- protected resident biography;
- exact hidden-resident count;
- private chronology;
- medical/legal/criminal facts;
- lineage;
- another character's private motivation;
- cardinal discoveries;
- a real attack/threat event not already sourced;
- a canonical betrayal not already sourced.

Use abstract but concrete-enough scenario roles such as:
- "someone asking for shelter";
- "a visitor asking who is staying here";
- "a security rule that would restrict everyone";
- "a public explanation that could reveal too much."

## 9. No fixed moral scoring

C4.3 does not authorize a morality score.

The protection/control tension is intentionally real.

A choice may preserve one value while increasing another risk.

Receipts should record tradeoff semantics, not GOOD/BAD visitor labels.

## 10. Relationship mapping deferred

C3.2 relationship actions remain authored conversation events.

C4.3 Manor interaction choices do not mutate C3.2 state by default.

A later stage may ask whether specific explicit Manor choices legitimately map to:
- RESPECT_BOUNDARY;
- CHALLENGE;
- PRY;
- or a new relationship event vocabulary.

That mapping must be separately justified and qualified.

## 11. Archetype mapping deferred

C4.3 does not automatically score Strategist/Builder/Mitigator/Auditor.

A later stage may determine whether explicit decision semantics constitute valid C3.3 evidence.

No such mapping is authorized here.

## 12. Preferred implementation architecture

A future C4.3 implementation should prefer a pure Manor interaction state module, separate from:
- cardinal scene state;
- Auren relationship state;
- archetype evidence state.

Candidate surface:
- `characters/manor-interaction-state.mjs`

It should own:
- vignette ids;
- pressure family;
- <=3 authored choice semantics;
- deterministic event receipt;
- bounded in-memory interaction state;
- fail-closed validation.

It should not own:
- relationship state;
- archetype state;
- discoveries;
- destination registry;
- persistent memory.

## 13. Initial proof recommendation

The smallest useful proof is one **ADMISSION_PRESSURE** vignette.

Example authority-safe premise:

"Someone needs somewhere safe to stay. Bringing them in immediately could expose people already under the Manor's protection. Refusing them could leave them without shelter."

Potential authored choices:
- admit with a boundary/protective protocol;
- delay briefly for verification;
- refuse admission.

This directly exercises Auren's canon without inventing a named resident, attacker, chronology or discovery.

The vignette must not declare that one choice is canonically correct.

## 14. Qualification requirements for future implementation

At minimum:
1. only admitted Auren canon is used;
2. no protected identity/private chronology appears;
3. <=3 choices;
4. exact explicit choice semantics;
5. deterministic receipt;
6. unknown scenario/choice fails closed;
7. no relationship mutation;
8. no archetype mutation;
9. no cardinal discovery mutation;
10. no destination/world-state mutation;
11. no persistence;
12. no morality score;
13. tradeoff preserved;
14. C4.1/C4.2 invariants preserved.

## 15. Deterministic next stage

Freeze **C4.3A — Manor Admission Pressure Interaction Contract**.

C4.3A should authorize exactly one bounded Admission Pressure vignette and its pure state/receipt machinery.

Only after C4.3A is green should additional Privacy/Control/Exposure vignettes be considered.

## Terminal law

**AUREN CAN OWN CUSTODY DECISIONS.**

**HE CANNOT INVENT THE PEOPLE BEING PROTECTED.**

**MANOR INTERACTION MAY RECORD EXPLICIT CHOICE, NOT INFERRED MOTIVE.**

**NO AUTOMATIC TRUST, ARCHETYPE OR MORAL SCORE.**

**FIRST PROOF = ONE ADMISSION PRESSURE VIGNETTE.**
