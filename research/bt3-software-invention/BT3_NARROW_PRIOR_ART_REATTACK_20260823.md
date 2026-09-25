# Breakthrough 3 — Narrow Prior-Art Reattack After Adversarial Differentiation

Date: 2026-08-23
Status: MATERIAL NARROW PRIOR-ART REATTACK BOUNDARY
Authority: BT3 software/engineering invention investigation

## Frozen experimental input

Three residual BT3 properties have survived adversarial execution:

1. BT3-A: CI/deployment/runtime may all pass while public bytes differ from approved source; qualification refuses `PASS_CLOSED` at the broken source→public-bytes custody edge.
2. BT3-B/X: two executions may terminate in byte-identical canonical state while qualified custody differs because one path contains a factually correct but unauthorized claim.
3. BT3-C: spatial preview may geometrically reach a semantic target while commitment is denied/cancelled and canonical semantic state remains unchanged.

The purpose of this boundary is not to repeat broad prior-art searches. It attacks only these experimentally demonstrated properties.

## BT3-A — narrow reattack

### Demonstrated property

`CI_PASS + DEPLOYMENT_PASS + RUNTIME_PASS` does not imply qualified executable identity when the public bytes differ from the approved source artifact.

### Strong prior art

The in-toto framework already models a software supply chain as authorized steps whose actors and artifact rules are declared in a signed layout. It records attestations for those steps and verifies the attestations against the layout. It also supports inspections and multiple predicate types beyond build provenance.

SLSA provenance explicitly tracks artifacts back to source/build inputs and provides verifiable information describing where, when, and how an artifact was produced.

The in-toto attestation framework additionally defines runtime-trace predicates for monitored software supply-chain operations, plus verification/test/result predicates. These mechanisms are designed for automated policy engines.

Therefore the ingredients needed to reject a deployed artifact whose observed identity no longer matches the authorized supply-chain subject are established engineering.

### Residual distinction

Diamond Gate's exact chain joins source identity, merge/publication identity, source/public byte equality, live browser/runtime assertions, authority-scoped acceptance, and a terminal `PASS_CLOSED` receipt in one repository-wide acceptance semantics.

This may remain a useful integration, but the narrow adversarial capability itself is not sufficient for an invention claim.

### Classification

`BT3-A = DISTINCTIVE_INTEGRATION`

No promotion is authorized.

## BT3-B / BT3-X — narrow reattack

### Demonstrated property

Two histories terminate in byte-identical state. One contains a factually correct mutation from an actor without jurisdiction. Later lawful convergence does not erase the custody violation.

### Strong prior art

Open Policy Agent provides machine-evaluated authorization/policy decisions, unique decision IDs, policy/bundle revision metadata, decision logs, audit trails, and replay/debug support. OPA also exposes runtime provenance such as build commit and policy bundle revision.

Policy-aware provenance literature predates Diamond Gate. Provenance-policy access-control systems explicitly combine provenance of alteration/origin with policy enforcement and accountability for data-alteration events.

These families establish that the following are known separately and in combination:

- machine-readable actor/action authorization;
- policy-version-bound decisions;
- persistent decision/audit records;
- provenance of changes;
- reconstruction of why an action was allowed or denied.

### Residual distinction

The strongest surviving BT3 property is narrower than ordinary authorization:

`CLAIM-TYPE JURISDICTION + COMPUTATIONAL CUSTODY + NON-ERASURE BY LATER STATE CONVERGENCE`.

Diamond Gate encodes not merely whether an operation is allowed, but whether a subsystem is authorized to establish a particular *class of computational claim* (for example, renderer observation versus canonical state authority, verifier infrastructure failure versus product rejection, digest equality versus execution proof). The custody record preserves this distinction even after byte-identical state convergence.

The current search found close prior art in policy decision logs and provenance-policy systems, but did not establish a materially identical general architecture for typed claim-jurisdiction ceilings propagated through replay/qualification across heterogeneous subsystem roles.

That absence is not novelty proof. It is enough to keep the object alive for unrelated-implementation testing and a deeper literature/patent search.

### Classification

`BT3-B = DISTINCTIVE_INTEGRATION`

`BT3-X = POTENTIAL_INVENTION`

BT3-X is promoted only as a research candidate, not to `NOVELTY_SUPPORTED`.

Reason for promotion: unlike A and C, the experimentally demonstrated property survived the narrowed comparison without a direct materially equivalent architecture being identified. The candidate is now sufficiently specific and falsifiable to justify independent implementation C.

## BT3-C — narrow reattack

### Demonstrated property

Spatial geometry reaches a target during preview while semantic state remains unchanged after denial/cancellation.

### Direct prior art

Apple's `UIPreviewInteraction` explicitly defines a state machine with preview, commit, complete, and cancelled phases. The preview transition can progress continuously from 0 to 1 while the UI is updated, and the interaction can be cancelled before completion.

Android predictive back likewise provides a continuous gesture preview, a commit threshold, and explicit cancellation/non-commit behavior that restores the original state.

Gesture recognizer state machines also distinguish continuous gesture progress from cancelled/failed/ended semantic outcomes.

These are materially equivalent to the core adversarial property tested for BT3-C: visible/spatial transition progress is not itself semantic commitment.

The Compass remains an unusually rich application of the pattern, but the tested minimum object is established engineering.

### Classification

`BT3-C = KNOWN_ENGINEERING`

The broad Compass architecture may still contain design value, but this candidate is removed from the active novelty track unless a stronger property is later extracted.

## BT3-D

No change.

`BT3-D = INSUFFICIENT_EVIDENCE`

## Updated classification ledger

| Candidate | Classification | Status after narrow reattack |
|---|---|---|
| BT3-A | `DISTINCTIVE_INTEGRATION` | useful end-to-end qualification composition; direct invention claim not supported |
| BT3-B | `DISTINCTIVE_INTEGRATION` | custody/replay remains useful but neighboring authorization/provenance prior art is strong |
| BT3-C | `KNOWN_ENGINEERING` | preview/commit/cancel semantic separation has direct platform prior art |
| BT3-D | `INSUFFICIENT_EVIDENCE` | integrated portable artifact still not demonstrated |
| BT3-X | `POTENTIAL_INVENTION` | typed computational claim-jurisdiction with non-erasing custody survives as the smallest researchable object |

## Smallest surviving object

The active BT3 research object is now:

`MACHINE-EXPRESSIBLE TYPED CLAIM JURISDICTION`.

Minimum proposed law:

> Every subsystem has an explicit set of computational claim types it is authorized to establish. A result outside that jurisdiction cannot acquire authoritative status merely by being factually correct, visually persuasive, byte-equivalent, or later convergent with a lawful state. Custody records preserve jurisdictional validity across the computation.

This is narrower than separation of concerns, ordinary RBAC/ABAC, event sourcing, runtime verification, or provenance alone.

## Required next boundary

Construct an intentionally unrelated implementation C that does not use Diamond Gate, H-Earth, Compass, planetary, scientific, website, or rendering semantics.

Implementation C must use only the extracted BT3-X law and demonstrate:

1. multiple subsystem roles;
2. typed claim jurisdictions;
3. one factually correct unauthorized claim;
4. later state/output convergence;
5. preserved custody distinction;
6. no Diamond Gate-specific vocabulary or architecture dependencies.

If C requires changing the extracted law, generality fails.

If C succeeds unchanged, BT3-X earns cross-lineage generality evidence and can undergo the next deep prior-art/patent attack.

## Boundary disposition

`BT3_NARROW_PRIOR_ART_REATTACK = CLOSED`

`BT3-C = KNOWN_ENGINEERING`

`BT3-A = DISTINCTIVE_INTEGRATION`

`BT3-B = DISTINCTIVE_INTEGRATION`

`BT3-X = POTENTIAL_INVENTION`

`BT3_NOVELTY_SUPPORTED = FALSE`
