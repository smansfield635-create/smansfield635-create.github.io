# Diamond Gate Character Acoustic Registry v1

Status: CONSTRUCTION_CANDIDATE
Public product mutation: false
First production qualification: Jeeves / Compass Chapter 01

## Purpose

This package is the resumable control-plane home for the Diamond Gate Voice Engine acoustic layer. It does not replace narrative canon, character language authority, or existing `*.voice.js` files. It translates already-governed character identity into acoustic parameters that a replaceable TTS renderer can consume.

## Governing relationship

NARRATIVE CANON -> CHARACTER LANGUAGE / EXPRESSION AUTHORITY -> ACOUSTIC PROFILE -> DELIVERY MODE -> TTS ADAPTER -> AUDIO ARTIFACT

Character identity belongs to the narrative system. Acoustic rendering is subordinate to that identity.

## Sources

Primary governing sources:
- `control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/narrative-journey-map.v1.json`
- `control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/relationship-crosswalk.v1.json`
- `control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/baseline-identities.v1.json`
- `characters/index.html`

Existing linguistic/personality voice authorities:
- `assets/hearth/jeeves/jeeves.voice.js`
- `assets/hearth/jeeves/jeeves.expression.js`
- `elara/elara.voice.js`

## Construction law

1. One replaceable TTS engine/adaptor may render many characters.
2. Character identity must never be owned by a TTS model.
3. Acoustic fields unsupported by canon remain `UNRESOLVED`; they are not inferred from biography.
4. Reference audio must be authorized and provenance-recorded before cloning/conditioning.
5. Named real-person references may guide high-level qualities only; the production voice must remain an original Diamond Gate identity and must not imitate a recognizable living person.
6. Approved film/dialogue lines are immutable qualification inputs unless the owning narrative authority changes them.
7. Approved audio artifacts are addressed by engine/profile/text/settings identity so later engine changes cannot silently replace an accepted performance.
8. No public website integration is authorized by this package alone.

## Resume protocol

A fresh room or later construction cycle should read, in order:
1. this README;
2. `character-acoustic-registry.v1.json`;
3. the selected character profile under `profiles/`;
4. `engine-adapter-contract.v1.json`;
5. the latest qualification record under `qualifications/`.

The registry field `nextLawfulAction` is the authoritative local continuation pointer for this instrument.

## Current boundary

Jeeves is the only character admitted for acoustic construction. Other roster identities are registered for continuity but remain unconstructed until separately activated.
