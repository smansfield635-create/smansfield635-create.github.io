# EDUCATION PROGRAM-WIDE PLACEMENT EXPRESSION CONTRACT v1

STATUS: FROZEN EXPRESSION CONSTRUCTION AUTHORITY
BASE: 32dcfb6693c19e785240a923eacf92e4a2ac6034
SCOPE: Learner-facing expression only
MATRIX MUTATION: PROHIBITED

## 1. Governing learner journey

The public placement journey is:

Starting Point
→ Adaptive Placement
→ Placement Result
→ Program Position
→ Learning Availability

Equivalent localized wording may be used, but these semantic states must remain distinct.

## 2. Placement identity

The placement instrument is program-wide. It MUST NOT be generically named "Phase 1 Demo", "Phase 1 placement", or any wording that implies its diagnostic range is limited to Phase 1.

Phase 1 may be named only when referring specifically to Phase-1 instructional curriculum or a Phase-1 placement result.

## 3. Result classes

The expression layer must support these result classes without altering their underlying qualified state:

D1: Phase 1 · Receive
D2: Receive → Place transition
D3: Phase 2 · Place
D4: Place → Use transition
D5: Phase 3 · Use
D6: Use → Own transition
D7: Phase 4 · Own
CAPSTONE_PASS: Upper program placement boundary exceeded
UNCERTAIN_BOUNDARY: More evidence required

CAPSTONE_NOT_ESTABLISHED preserves D7 / Phase 4 · Own and may explain that the upper integration boundary was not established.

## 4. Availability and access

Placement, availability, and access are separate learner-facing facts.

Current Phase 1:
curriculum_availability = PUBLIC_AVAILABLE
access_status = FREE_PUBLIC

Current Phases 2–4:
curriculum_availability = NOT_CURRENTLY_AVAILABLE
access_status = NOT_AVAILABLE

Unavailable curriculum MUST NOT lower or rewrite placement.

## 5. Instructional entry CTA

A Phase-1 instructional-entry action may be visible only when:
- resolved curriculum_availability is PUBLIC_AVAILABLE; and
- resolved access_status is FREE_PUBLIC.

The generic post-placement label "Enter Phase 1 Demo" is prohibited.

Authorized Phase-1 CTA default:
"Start Phase 1"

For unavailable later phases, no instructional-entry CTA may imply access. The learner receives truthful placement plus availability information.

## 6. Public progress labels

Replace the legacy placement/demo sequence with:

Starting Point
Adaptive Placement
Placement Result
Program Position
Learning Availability

The final state is availability/routing, not generic "Demo Entry".

## 7. Required phrase crosswalk

LEGACY: Phase 1 Demo
REPLACEMENT WHEN NAMING PLACEMENT: English Placement / Placement
REPLACEMENT WHEN NAMING ACTUAL INSTRUCTION: Phase 1 Learning

LEGACY: Enter Phase 1 Demo
REPLACEMENT: Start Phase 1
CONDITION: only eligible Phase-1 public/free result

LEGACY: Phase 1 learning demo
REPLACEMENT WHEN GLOBAL FOOTER/PLACEMENT CONTEXT: English Fluency Accelerator
REPLACEMENT WHEN INSTRUCTION-SPECIFIC: Phase 1 Learning

LEGACY: Demo Entry
REPLACEMENT: Learning Availability

LEGACY: Phase-1 vertical-slice language implying placement scope
REPLACEMENT: wording that states placement spans the program while currently available instruction is Phase 1.

LEGACY: "Your starting point is ready."
AUTHORIZED: may remain when it describes placement result, but the accompanying program-position and availability states must be explicit.

LEGACY: "Start Learning"
AUTHORIZED: conditional only after availability/access resolution; Phase-1 eligible default is "Start Phase 1".

## 8. Result expression

Every resolved result must visibly distinguish:
1. placement/program position;
2. curriculum availability;
3. instructional action, if authorized.

A transition result must be expressed as a transition, not arbitrarily collapsed into one adjacent phase.

An unresolved result must request more evidence rather than invent placement.

A Capstone pass must not claim universal English mastery, certification, or that the learner never needs English instruction.

## 9. Localization

Changed learner-facing shell strings must remain available in EN/ES/ZH wherever the current shell localizes the corresponding control or state.

Target-English diagnostic evidence remains English. Help-language localization must not translate the evidence being scored.

## 10. Frozen non-regression

This expression cycle MUST NOT modify:
- D1-D7 question content;
- Capstone question content;
- scoring;
- adaptive thresholds;
- D7-to-Capstone admission;
- placementCoordinate mapping;
- curriculum availability authority;
- access authority;
- evidence classifications.

It MUST NOT reintroduce:
- scalar D8;
- P1S1-P1S8 placement authority;
- PHASE_1_ONLY;
- ABOVE_PHASE_1;
- generic Phase-1-only placement framing.

## 11. Qualification requirements

Before merge, prove:
- all nine result classes render without contradiction;
- Phase-1 eligible result exposes Start Phase 1;
- later-phase result exposes truthful placement and no unauthorized entry;
- transition results remain transitions;
- Capstone pass shows upper-bound result without overclaim;
- uncertain result requests additional evidence;
- EN/ES/ZH changed shell controls remain coherent;
- responsive/mobile/tablet/desktop expression remains usable;
- qualified placement matrix and scoring are byte/semantic unchanged within the frozen boundaries.

## 12. Next lawful action

Perform a read-only phrase-location crosswalk against the exact base, then execute one bounded expression mutation from that crosswalk.
