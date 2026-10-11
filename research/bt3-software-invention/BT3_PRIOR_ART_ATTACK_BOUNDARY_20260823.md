# Breakthrough 3 — Software/Engineering Invention Prior-Art Attack

Date: 2026-08-23
Status: MATERIAL PRIOR-ART ATTACK BOUNDARY
Authority: BT3 software/engineering invention investigation

## Governing objective

Determine the smallest genuinely novel software object, if any, already present in Diamond Gate. Sophistication is not novelty. Scientific use is not required for value.

## Frozen extraction input

The invention-extraction boundary produced these candidates:

- BT3-A — evidence-bound executable qualification / proposed self-qualifying executable
- BT3-B — governed computational chain of custody / executable state provenance and replay
- BT3-C — spatially projected governed state machine / executable spatial state-control interface
- BT3-D — portable governed computational artifact
- BT3-X — underlying invariant: computational authority separation

Repository evidence includes:

- `docs/REPOSITORY_LIVE_QUALIFICATION_ENGINE.md`
- `docs/QUALIFICATION_CHECK_AUTHORITY_AND_RELEVANCE_PROTOCOL.md`
- `h-earth-3d/runtime/h-earth.deterministic-runtime.js`
- `h-earth-3d/runtime/h-earth.canonical-replay.js`
- `h-earth-3d/runtime/h-earth.canonical-state-serialization-law.js`
- `assets/compass/compass.controller.js`
- `docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md`

## Prior-art attack method

A candidate survives only if its distinguishing property is not materially provided by established work under different terminology. The attack explicitly includes runtime verification, proof-carrying code, self-certifying programs, event sourcing, deterministic replay, provenance, statecharts, executable UI models, digital twins, executable specifications, and reproducible computation.

## BT3-A — Self-qualifying executables

### Diamond Gate extracted property

The repository qualification engine binds a terminal `PASS_CLOSED` result to a chain from source identity through candidate qualification, asset identity, merge identity, publication, public bytes, and live runtime. Receipts bind evidence to one SHA and include source/public digests, runtime assertions, workflow/run identity, and a receipt digest.

### Prior art found

1. Proof-Carrying Code (Necula/Lee, 1990s) already establishes executable code accompanied by a machine-checkable certificate proving policy-relevant properties. Reference: https://www.cs.cmu.edu/~fox/pcc.html
2. Certified PCC work has long automated certificate construction and independent checking. Reference: https://www.sciencedirect.com/science/article/pii/S0304397506005512
3. Self-certifying programs explicitly produce a correctness certificate on every execution, independently checkable from the generating execution environment. Reference: https://doi.org/10.1145/3689624
4. Recent proof-carrying action/runtime-governance work binds pre-action admissibility, execution, approval, outcome closure, runtime receipts, and replay-ready proof. Reference: https://arxiv.org/abs/2606.04104

### Attack result

The broad claim "an executable carries evidence that it satisfies requirements" is established prior art.

Diamond Gate therefore does **not** presently support novelty for the broad self-qualifying-executable claim.

The remaining potentially distinctive property is narrower: qualification that binds one executable identity across source bytes, publication bytes, live runtime behavior, authoritative-check scope, and a terminal acceptance state while preventing non-authoritative verifier failures or deployment status from manufacturing acceptance/rejection.

### Current classification

`BT3-A = DISTINCTIVE_INTEGRATION` (provisional; not novelty-supported)

Reason: the broad idea is known, but the exact source→publication-bytes→live-runtime→authority-scoped terminal receipt integration remains eligible for narrower comparison.

### Distinguishing test to run

Create two outwardly identical deployments where one serves bytes different from the approved source but still inherits a successful CI/deployment record. A qualifying BT3-A architecture must reject terminal qualification of the mismatched live instance and produce evidence identifying the break in custody.

## BT3-B — Executable state provenance and replay

### Diamond Gate extracted property

H-Earth separates deterministic runtime, canonical serialization, replay, and qualification authority. It records deterministic intent handling, version envelopes, canonical state evidence, replay support, and claim ceilings.

### Prior art found

1. Event Sourcing records every state-changing event in an append-only authoritative event store and reconstructs present or historical state by replay. Microsoft reference: https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
2. AWS documents the same pattern: immutable chronologically ordered events, replay processors, point-in-time reconstruction, and snapshots. Reference: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/event-sourcing-pattern.html
3. NautilusTrader records state-affecting messages, run identity, correlation/causation IDs, manifests, replay metadata, snapshot anchors, and verification/recovery semantics. Reference: https://nautilustrader.io/docs/latest/concepts/event_sourcing/
4. Theseus describes deterministic runtime lineage where every output is traceable to inputs, logic version, and trigger, with recorded state changes and replay identity verification. Reference: https://theseus-labs.com/platform

### Attack result

The broad claim "state + ordered history + identity + replay reconstructs how the system got here" is established engineering.

Executable identity, manifests, replay, lineage, and causation are also not individually sufficient to rescue novelty.

The surviving narrow question is whether Diamond Gate binds **qualification jurisdiction and evidentiary claim ceilings** to the replayed transition chain in a way that established event-sourcing/provenance systems do not: i.e. reconstructing not only what happened, but which transitions were authorized to count as qualified and which observations were legally incapable of promoting the state.

### Current classification

`BT3-B = DISTINCTIVE_INTEGRATION` (provisional; broad claim collapsed)

### Distinguishing test to run

Construct two histories that reach byte-identical final state. In history 1 all transitions are admitted by the governing authority. In history 2 one transition is produced by a non-authoritative subsystem or an invalid qualification path, then later compensated so final state bytes match. Ordinary replay should reconstruct both; BT3-B must distinguish qualified custody from merely equivalent output/state.

## BT3-C — Executable spatial state-control interfaces

### Diamond Gate extracted property

Compass separates geometric preview from semantic commitment. Its controller owns canonical state, legal transition semantics, orientation commitment, navigation, and receipts; renderer/pointer/geometry layers do not own those meanings. Spatial orientation can project semantic state and propose transitions without becoming state until lawful commitment.

### Prior art found

1. Statecharts have executable semantics dating to the 1980s/1990s, with diagrams driving simulation, dynamic testing, and code generation. Reference: https://weizmann.elsevierpure.com/en/publications/the-statemate-semantics-of-statecharts/
2. SCXML and executable-statechart tooling explicitly support one behavioral source driving runtime behavior and visual diagrams. Reference: https://statecharts.dev/
3. Model-based gesture navigation has used declarative statecharts transformed to runtime state machines for directly executable multimodal interaction. Reference: https://www.researchgate.net/publication/265178686_Model-based_Design_and_Generation_of_a_Gesture-based_User_Interface_Navigation_Control
4. Executable model-based interactors map state-machine UI models to pointing, gesture, drag/drop, and directional navigation. Reference: https://www.researchgate.net/publication/221099747_Building_Multimodal_Interfaces_Out_of_Executable_Model-Based_Interactors_and_Mappings
5. Prior patents describe graphical state-machine representations of GUIs whose states/events drive executable UI behavior and code generation. Reference: https://patents.google.com/patent/US20060235548A1

### Attack result

The broad claim "a graphical/spatial interface is represented by and executes a state machine" is established prior art.

The Compass can survive only if the relevant property is stronger and specifically spatial: geometry is not merely a diagram or control mapping but a constrained projection of the governed state graph, with continuous spatial preview separated from discrete semantic commitment and with state authority remaining outside the renderer/control layer.

This narrower property has not yet been shown novel.

### Current classification

`BT3-C = DISTINCTIVE_INTEGRATION` (provisional)

### Distinguishing test to run

Implement the same state graph twice: (1) conventional statechart + GUI controls, and (2) BT3-C spatial projection where reachable geometry, preview, settlement, and admissible transitions are coupled. Introduce a spatial pose that visually reaches a semantic target but is cancelled or inadmissible. BT3-C must preserve semantic state while retaining spatial preview evidence and must do so without a presentation subsystem gaining transition authority.

## BT3-D — Portable governed computational artifacts

### Diamond Gate extracted property

Candidate package: model/state + runtime + controls + representation + qualification + replay, executable in standardized browser capabilities without proprietary application engine dependency.

### Prior art found

1. Executable Digital Twins are already described as stand-alone, self-contained executable representations extracted from digital twins. Reference: https://arxiv.org/abs/2210.17402
2. Dynamic executable UI models have been described as self-contained models containing static structure, dynamic state information, and execution logic. Reference: prior model-based UI/runtime literature.
3. Reproducible executable capsules and browser-native evidence chambers exist in contemporary engineering systems.

### Attack result

Native browser execution, self-contained executable models, portable simulations, reproducible capsules, and executable digital twins are all prior-art neighborhoods.

Diamond Gate has not yet demonstrated an unrelated portable artifact containing the complete governed object and preserving qualification/replay semantics after transfer.

### Current classification

`BT3-D = INSUFFICIENT_EVIDENCE`

No further novelty claim is authorized until an integrated artifact exists and is transferred to an unrelated implementation environment.

## BT3-X — Computational authority separation

### Diamond Gate extracted invariant

No subsystem may promote its representation, observation, or control result into authoritative state outside its declared jurisdiction. Examples in the repository include:

- renderer != canonical state owner
- gesture preview != committed transition
- canonical byte equality != lawful execution proof
- deployment success != live acceptance
- verifier infrastructure failure != product failure
- replay descriptor != replay proof

### Prior-art neighborhood

Separation of concerns, reference monitors, trusted computing bases, CQRS read/write separation, model-view-controller, runtime verification, formal specification/execution separation, event-source projections, and proof checkers all embody pieces of this principle.

### Attack result

The broad maxim is not plausibly novel by itself.

The researchable residual is a **machine-expressible authority lattice for computational claims**, where each subsystem's admissible claim types and promotion boundaries are encoded and receipts preserve whether a result was emitted within jurisdiction.

This narrower object has not yet been demonstrated independently of Diamond Gate terminology or compared exhaustively enough for novelty support.

### Current classification

`BT3-X = POTENTIAL_INVENTION` only as a research hypothesis, **not** as a terminal novelty classification.

For the required terminal ladder at this boundary, use `DISTINCTIVE_INTEGRATION` until unrelated implementation and stronger prior-art attack are complete.

## Boundary classifications

| Candidate | Classification at this boundary | Result |
|---|---|---|
| BT3-A | `DISTINCTIVE_INTEGRATION` | broad self-certification claim collapsed; source→public-bytes→live-runtime authority-bound receipt remains |
| BT3-B | `DISTINCTIVE_INTEGRATION` | broad provenance/replay claim collapsed; qualification-jurisdiction-aware custody remains |
| BT3-C | `DISTINCTIVE_INTEGRATION` | executable/state-machine UI known; continuous spatial projection + authority-separated semantic commitment remains |
| BT3-D | `INSUFFICIENT_EVIDENCE` | full portable governed artifact not independently demonstrated |
| BT3-X | `DISTINCTIVE_INTEGRATION` | broad authority separation known; machine-expressible claim-jurisdiction lattice remains researchable |

No candidate receives `NOVELTY_SUPPORTED`.

## Strongest next material boundary

Adversarial differentiation should now attack the three residual properties rather than the collapsed broad claims:

1. BT3-B: equal final state / unequal qualified custody.
2. BT3-A: successful build/deploy / live-byte or authority-chain mismatch.
3. BT3-C: spatially equivalent preview / semantically noncommitted or inadmissible transition.
4. BT3-X: non-authoritative subsystem emits a factually correct result and attempts to promote it into an authoritative claim; architecture must reject the promotion because correctness does not confer jurisdiction.

After these adversarial tests, construct an unrelated implementation C using only the extracted laws. Generality is not established by H-Earth + Compass because they share lineage.

## Boundary disposition

`BT3_PRIOR_ART_ATTACK_BOUNDARY = CLOSED`

`BT3_MONOLITHIC_BREAKTHROUGH = NOT_SUPPORTED`

`BT3_NOVELTY_SUPPORTED = FALSE`

`BT3_SURVIVING_RESEARCH_OBJECTS = A_NARROW, B_NARROW, C_NARROW, X_NARROW`

The smallest currently interesting object is not a scientific runtime standard. It is the possibility of a machine-expressible jurisdiction system for computational claims, integrated with replay and qualification so that equivalent outputs cannot erase differences in lawful computational custody.
