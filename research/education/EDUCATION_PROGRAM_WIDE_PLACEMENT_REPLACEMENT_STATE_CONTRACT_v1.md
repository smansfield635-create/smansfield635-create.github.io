# EDUCATION PROGRAM-WIDE PLACEMENT REPLACEMENT STATE CONTRACT v1

STATUS: FROZEN CONSTRUCTION AUTHORITY
SCOPE: Education placement ontology and routing
SUPERSEDES: placement semantics that equate D1-D8 with P1S1-P1S8 or restrict placement authority to Phase 1

## 1. Governing separation

The Education placement instrument is program-wide.

The following authorities are independent and MUST NOT be collapsed:

1. DIAGNOSTIC_BANDS — demonstrated placement evidence.
2. PROGRAM_PHASES — instructional curriculum territories.
3. PHASE_ENTRY_MAP — mapping from demonstrated placement to curriculum position.
4. CURRICULUM_STATE — whether mapped curriculum exists and is public/available.
5. ACCESS_STATUS — whether the learner may enter available curriculum.
6. TEACHING_UNITS — instructional content belonging to a curriculum phase.

Placement MUST NOT be changed because curriculum is unavailable or access is restricted.
Curriculum availability MUST NOT grant or alter placement.
Access entitlement MUST NOT grant or alter placement.

## 2. Diagnostic authority

Ordinary diagnostic bands are D1 through D7.

D1: foundational recognition and functional meaning.
D2: Receive -> Place transition evidence.
D3: relational/form placement.
D4: Place -> Use transition evidence.
D5: applied Use evidence.
D6: Use -> Own transition evidence.
D7: independent Own evidence / upper ordinary placement boundary.

D8 is RETIRED as an ordinary scalar diagnostic band.

## 3. Capstone Integration Gate

CAPSTONE is a separate upper-bound integration gate and is not D8.

Admission requires establishment of D7 under the qualified placement rules.

CAPSTONE evaluates integrated independent written performance across unfamiliar material, including meaning, grammar/form, transfer, inference, register, evidence discipline, and practical judgment within the measurable written-language boundary.

CAPSTONE_PASS means the learner has exceeded the ordinary D1-D7 instructional placement range measured by this instrument.

CAPSTONE_PASS MUST NOT be represented as universal English mastery, fluency certification, or unrestricted program completion.

CAPSTONE_NOT_ESTABLISHED MUST preserve D7 as the learner's demonstrated ordinary placement. It MUST NOT demote previously established evidence.

## 4. Program phases

The four instructional phases are:

PHASE_1_RECEIVE — recognition/acquisition of foundational English.
PHASE_2_PLACE — relationships, forms, context, and structural placement.
PHASE_3_USE — construction and practical application.
PHASE_4_OWN — independent retrieval, selection, transfer, and intentional expression.

Phase identity is curriculum identity, not diagnostic difficulty numbering.

## 5. Placement-to-phase crosswalk

D1 -> PHASE_1_RECEIVE / ESTABLISHED
D2 -> PHASE_1_RECEIVE_TO_PHASE_2_PLACE / TRANSITION
D3 -> PHASE_2_PLACE / ESTABLISHED
D4 -> PHASE_2_PLACE_TO_PHASE_3_USE / TRANSITION
D5 -> PHASE_3_USE / ESTABLISHED
D6 -> PHASE_3_USE_TO_PHASE_4_OWN / TRANSITION
D7 -> PHASE_4_OWN / ESTABLISHED
CAPSTONE_PASS -> UPPER_PROGRAM_PLACEMENT_BOUNDARY_EXCEEDED

Transition results are first-class placement results. They MUST NOT be arbitrarily collapsed downward or upward merely to fit a phase label.

## 6. Canonical resolved state

A resolved placement MUST preserve separate fields equivalent to:

diagnostic_position
program_phase
phase_position
entry_position
placement_confidence
curriculum_availability
access_status
support_state
placement_evidence
probe_history

Legacy P1S* identifiers MUST NOT be placement authority.

The following legacy values are superseded as placement ontology:
P1S1 through P1S8
PHASE_1_ONLY
ABOVE_PHASE_1
Phase 1 Completion as D8
Advanced Phase 1 demonstration as an upper placement result

## 7. Curriculum availability

At this authority generation:

Phase 1 is the only public/free instructional phase.

A learner may truthfully resolve into Phase 2, Phase 3, Phase 4, a transition involving those phases, or CAPSTONE_PASS even when the corresponding instructional curriculum is not presently public, developed, or accessible.

Unavailable curriculum MUST produce an availability message, not a placement demotion.

The implementation MUST keep availability status explicit enough to distinguish at minimum:
PUBLIC_AVAILABLE
NOT_CURRENTLY_AVAILABLE

Future subscription or entitlement states may extend access routing without changing placement semantics.

## 8. Access

Placement is not entitlement.

A placement result MUST NOT imply that a learner automatically receives access to a later phase.

For currently public Phase 1:
curriculum_availability = PUBLIC_AVAILABLE
access_status = FREE_PUBLIC

For later phases until separately authorized:
curriculum_availability = NOT_CURRENTLY_AVAILABLE
access_status = NOT_AVAILABLE

Future paid/subscription access MUST be introduced as an access-state change, not a placement-rule change.

## 9. Routing

After placement resolves:

1. preserve demonstrated diagnostic position;
2. map it to phase/transition position;
3. determine curriculum availability;
4. determine access status;
5. route only if the mapped curriculum is both available and accessible.

Phase 1 learners may enter the public Phase-1 teaching runtime.

Learners placed above currently available curriculum receive their truthful placement plus availability/access information. They MUST NOT be silently routed into Phase 1 as though Phase 1 represented their demonstrated level.

CAPSTONE_PASS receives an upper-bound result and no false instructional entry.

## 10. Instructional runtime

TEACHING_UNITS MUST be decoupled from diagnostic-band indexing.

Phase-1 instructional units may continue to exist, but they MUST have Phase-1 curriculum identifiers independent of D1-D7.

A diagnostic band may inform an entry recommendation, but diagnostic identifiers MUST NOT double as lesson identifiers.

## 11. Evidence boundary

The current product may measure only capabilities physically supported by its runtime.

Written reading comprehension and written/selected/constructed expression may be claimed only to the extent actually measured.

Speech, pronunciation, listening comprehension, oral retrieval, and oral conversational fluency remain outside the current evidence boundary unless separately implemented and qualified.

## 12. Persistence truth

If learner/placement/teaching state is stored in localStorage, the public/runtime declaration MUST NOT claim no persistence.

Client-local persistence MUST be distinguished from durable server-side persistence.

## 13. Required reconciliation surface

Construction under this contract MUST reconcile:

- document data attributes describing placement/demo range;
- STAGES/P1S diagnostic authority;
- D8 scalar traversal and ABOVE behavior;
- resolveAdaptiveBoundary;
- obsolete resolveIndependence path;
- renderIndependence;
- enterDemo;
- teachingState diagnostic indexing;
- public Phase-1-only placement language;
- result localization affected by new phase outcomes;
- publication/runtime verification expectations.

D1-D5 question content is frozen unless a later qualified matrix operation explicitly authorizes change.
D6-D7 development work may be reconciled from the bounded D6-D8 candidate after cross-authority review.
CAPSTONE content requires separate qualification as an upper-bound gate.

## 14. Non-regression

The following remain required:

- demonstrated performance outranks self-report;
- answer position must not reveal correctness;
- help-language shell must not contaminate target-English evidence;
- uncertain boundaries remain unresolved rather than guessed;
- previously demonstrated evidence is not erased by a harder failed probe;
- placement, availability, access, and instruction remain separate;
- no unavailable curriculum is represented as available;
- no placement result is lowered to match available product inventory.

## 15. Next lawful operation

Perform a read-only cross-authority reconciliation between:
- current main;
- D6-D8 development candidate d132cf99514a6b54ec0c7f4c6e62fd832da5bc3b;
- this frozen replacement-state contract.

Produce an exact mutation plan before product-code mutation.
