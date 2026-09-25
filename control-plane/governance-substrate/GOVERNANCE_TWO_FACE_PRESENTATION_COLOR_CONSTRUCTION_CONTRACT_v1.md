# Governance Substrate — Two-Face Presentation and Color Semantics Construction Contract v1

Status: FROZEN CONSTRUCTION AUTHORITY
Scope: presentation-only construction boundary.
Frozen parent authority: control-plane/governance-substrate/GOVERNANCE_TOPOLOGY_PRESENTATION_AUDIT_AUTHORITY_v1.md
Construction base: 1f0af5f8b7ab822445c9c7773033a33069ed78ee

## Deterministic purpose

Convert the standalone Governance Substrate into one reversible two-face explanatory object without changing governance topology, catalog authority, runtime authority, operation semantics, or Failure Response law.

FRONT = GOVERNED OPERATION / PROCEDURES
BACK = FAILURE RESPONSE
FLIP = CHANGE OF EXPLANATORY PERSPECTIVE ONLY
FLIP != TOPOLOGY CHANGE
RETURN TO GOVERNANCE BRIDGE = EXIT/NAVIGATION
X/CLOSE = EXIT/CLOSE; X MUST NOT SELECT FAILURE RESPONSE

The existing Procedures | Failure Response same-face mode switch is superseded by the two-face interaction and may be removed only as part of the bounded construction described here.

## Immutable canonical substrate

Construction MUST preserve:
- exactly 14 canonical nodes;
- exactly 21 canonical directed edges;
- exactly 8 Procedures;
- exactly 8 frozen Failure Response classes;
- the existing catalog identities and canonical sources;
- all frozen failure laws and six-part grammar;
- Failure Response as presentation state over the same topology.

No catalog mutation is authorized.
No canonical node or edge addition, deletion, reversal, or substitution is authorized.
No product/runtime/control-plane/governance-authority mutation is authorized.

Canonical reusable catalog remains:
- assets/compass/governance-panel.catalog.v1.json

## Two-face interaction contract

1. Both faces MUST render the same canonical 14-node/21-edge substrate.
2. Front-face selection state is Procedure presentation state.
3. Back-face selection state is Failure Response presentation state.
4. Flipping MUST NOT mutate catalog data, governance authority, operation state, topology, evidence, candidate state, or failure classification.
5. Flip state is local presentation state only.
6. Flip MUST be deterministic and reversible.
7. Close/exit and flip MUST be separate controls and separate state transitions.
8. The existing close animation may inform the visual language, but the current rotateY close transition MUST NOT be reinterpreted as Failure Response state.
9. Keyboard, pointer, touch, and reduced-motion behavior MUST preserve equivalent access to both faces.
10. A face hidden by rotation MUST not remain an ambiguous interactive/focus surface.

## Color-state grammar

Color is evidence-bounded presentation semantics, not decoration and not independent authority.

- CANONICAL_CONTEXT = cyan/neutral family. Means the canonical substrate exists in context.
- CURRENT_FOCUS = gold family. Means selected/currently examined only.
- ESTABLISHED_PROGRESSION = green family. Means the selected presentation has established progression/correspondence through that canonical relationship. It MUST NOT mean universal correctness, formal proof, or whole-system PASS.
- HELD_UNPROVEN_PENDING = amber family. Means held, unresolved, pending, or unproven according to the selected presentation.
- PROVEN_BLOCKING_FAILURE = red family. Means the selected Failure Response class establishes the blocking/failure locus. Red MUST NOT automatically propagate to preserved evidence, preserved candidates, or downstream topology.
- DEEMPHASIZED_CONTEXT = dim/neutral. Means canonical but not currently emphasized. It MUST NOT mean failed, absent, invalid, or unauthorized.

A Failure Response presentation MAY simultaneously contain green, red, amber, cyan/neutral, gold, and dim states where repository-supported semantics require the distinctions.

Color MUST NOT create a new edge, route, propagation claim, preservation vector, boundary, guarantee, or authority.

## Failure Response presentation law

For each of the eight classes, the back face must retain:
TRIGGER -> BLOCKS -> PRESERVES -> PROPAGATES? -> RECOVERY -> CLOSURE STATUS

Highlighted nodes and edges remain presentation emphasis over canonical topology.

Failure does not automatically propagate.
Preservation does not imply a routing vector.
Execution-surface failure does not imply product failure.
Component correctness does not prove interface continuity.
Unknown authority/dependency/failure remains fail-closed.

## Unsupported presentation removal

The following current presentation elements are not authorized to survive as structural claims:

- .governance-boundary-shell: REMOVE. Its dashed lower-right enclosure can imply an unsupported mathematical/global recovery/closure boundary.
- GOVERNED ACTION and EVIDENCE + CONTINUITY macro-plane labels: REMOVE or redesign only as non-structural explanatory copy. They MUST NOT visually assert canonical architectural partitions.

The canonical edges Materialization -> Boundary and Closure -> Boundary remain preserved. No replacement boundary geometry is authorized.

## Bounded mutation surface

Only these presentation assets are authorized for construction:
- assets/compass/compass.governance-platform.js
- assets/compass/compass.governance-platform.css

The standalone route may consume the resulting assets without acquiring Governance state.

No other file is authorized for product construction unless a subsequent read-only dependency finding proves it mechanically necessary and the construction authority is amended before mutation.

## Required construction behavior

The candidate must:
- provide an explicit Front <-> Failure Response flip control;
- make the face identity obvious before interaction;
- preserve Procedure controls on the front;
- preserve all eight Failure Response selections on the back;
- remove the redundant same-face Procedures | Failure Response toggle;
- preserve explicit close/exit behavior independently of flip;
- preserve Return to Governance Bridge navigation independently of flip;
- remove the unsupported boundary shell;
- remove/redesign unsupported macro-plane presentation;
- apply semantic color classes without modifying topology;
- prevent hidden-face focus/pointer ambiguity;
- preserve usable mobile behavior.

## Qualification gates

Construction is not publishable until all of the following pass:

1. TOPOLOGY_IDENTITY: 14 nodes and 21 directed edges on both faces.
2. CATALOG_IDENTITY: canonical catalog unchanged.
3. PROCEDURE_IDENTITY: all 8 Procedures retained.
4. FAILURE_IDENTITY: all 8 frozen Failure Response classes retained.
5. FACE_TOPOLOGY_PARITY: front/back use the same canonical substrate.
6. ZERO_INVENTED_TOPOLOGY: no new explanatory node/edge becomes canonical structure.
7. FLIP_STATE_ISOLATION: repeated flip cycles mutate presentation state only.
8. CLOSE_FLIP_SEPARATION: close/exit cannot select Failure Response and flip cannot close/navigate away.
9. COLOR_SEMANTICS: green/red/amber/gold/cyan/dim conform to this contract.
10. NO_COLOR_PROPAGATION_INFERENCE: failure color does not automatically spread beyond supported locus/dependency.
11. PRESERVATION_NONROUTING: preserved candidate/evidence is not rendered as a directional route.
12. BOUNDARY_CORRESPONDENCE: Materialization -> Boundary and Closure -> Boundary remain canonical and no shell substitutes for them.
13. UNSUPPORTED_SHELL_ABSENT.
14. UNSUPPORTED_MACRO_PLANES_ABSENT_OR_NONSTRUCTURAL.
15. EIGHT_CLASS_RENDER: every failure class remains inspectable with the six-part grammar.
16. ACCESSIBILITY: keyboard focus, labels, face visibility, pointer/touch behavior, and reduced motion remain coherent.
17. MOBILE: two-face interaction remains usable at current mobile breakpoints.
18. STANDALONE_OWNERSHIP: Governance state remains owned by the standalone Governance surface.
19. NO_RUNTIME_OR_AUTHORITY_MUTATION.
20. REVERSIBILITY: front -> back -> front returns to coherent presentation without topology/state drift.

Any failed gate holds publication.

## Construction sequence

1. Construct one bounded candidate touching only the authorized JS/CSS assets.
2. Run static identity and topology checks.
3. Run two-face interaction/color qualification.
4. Inspect the candidate presentation.
5. Repair only residual defects inside this contract.
6. Requalify.
7. Only after all gates pass: authorize merge/publication.
8. Inspect the live standalone environment after deployment.

NEXT AUTHORIZED STEP = CONSTRUCT_BOUNDED_TWO_FACE_GOVERNANCE_PRESENTATION_CANDIDATE
