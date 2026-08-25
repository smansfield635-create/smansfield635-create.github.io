# Diamond Gate material-work audit v1

Status: research record; Layer A only.

Primary methodology issue: #2052.

## Evidence precedence

For software-production facts:

`repository evidence > room recollection`

For actual human-attention measurement:

`room/video/conversation evidence > repository timestamps`

Layer A must be reproducible by a fresh audit room with GitHub access and no dependence on prior conversation memory.

## Audit chain

`merged PR population -> PR metadata/body -> exact diff -> qualification evidence -> merge/publication evidence -> classification`

## Principal class decision procedure

### 1. SUPPORT exclusion gate

Classify SUPPORT when the durable net effect is exclusively execution/dispatch transport, scope/router registration only, verifier/test-only work, receipt/evidence custody, manifest/cache/version identity correction, ancestry synchronization, deployment/publication transport, workflow/CI/locality repair, restoration-only rollback/revert, or exact identity/binding correction with no material behavior change.

Large diffs, large test counts, or broad repository importance do not rescue a support-only operation.

Exception: a control-plane change that creates a new durable reusable execution capability used by future operations is material engineering work and proceeds to the materiality gate.

### 2. STANDARD materiality gate

STANDARD is the default material class. A PR is material when it independently delivers at least one usable product/runtime/interaction/rendering/content/system behavior change, or creates a durable reusable engineering subsystem that changes how future work can actually execute, qualify, admit, or publish.

### 3. PARAMOUNT escalation

A material PR becomes PARAMOUNT only when BOTH are established from repository evidence:

A. Meaningful system-boundary crossing: shared implementation across multiple public surfaces; material integration of independent authority domains; new system-level architectural capability; or closure/replacement of a major multi-stage architectural layer.

B. Broad consequence evidence: at least two of the following are positively established:
- MULTI_SURFACE true;
- normally at least five materially participating changed paths, excluding receipts/workflows/transports, unless a smaller shared-authority diff proves equivalent breadth;
- qualification spanning at least three materially distinct runtime/device/state profiles or an equivalent broad deterministic matrix;
- independent integration/publication/live exact-head evidence;
- a named reusable architecture or system contract consumed beyond the local change.

If either A or the two-part B threshold is absent, the result remains STANDARD.

## Anti-inflation laws

- Test count alone cannot create PARAMOUNT.
- Changed-path count alone cannot create PARAMOUNT.
- LIVE alone cannot create PARAMOUNT.
- A large support repair remains SUPPORT if it creates no new reusable capability.
- Superseded, retired, or reverted occurrences are not independent delivered material output unless a surviving intended capability remains at the audit endpoint. Restoration reverts are SUPPORT.
- When two classes remain plausible, choose the lower class unless the higher-class predicate is positively established.

## Secondary flags

QUALIFIED: the exact candidate/head has controlling machine qualification evidence that passed. Syntax/static checks alone count only when they are the complete controlling qualification.

LIVE: repository evidence binds the merged result or exact descendant publication occurrence to the live surface and verifies deployed identity or runtime behavior.

MULTI_SURFACE: the material change itself affects at least two independently addressable public surfaces, or a shared implementation is proven to govern at least two. Test-only coverage of many routes does not count.

AUTONOMOUS_END_TO_END: repository evidence shows the same governed operation traversed construction/repair -> qualification -> merge -> publication/live verification without a separate human-authored code-transfer step. If GitHub cannot establish this, mark UNRESOLVED and allow Layer B to resolve it.

CHANGED_PATHS: exact merged diff count.

MATERIAL_CHANGED_PATHS: changed paths excluding receipts, pure workflow/transport, generated evidence, manifests and cache-only files.

AFFECTED_SURFACES: exact count when recoverable from repository evidence; otherwise UNRESOLVED.

VERIFICATION_BREADTH: retain raw facts such as profiles, runtime executions, assertions/checks, no-JS states, and live checks rather than compressing them into one opaque score.

## Frozen reproducibility criterion

A fresh independent Layer-A audit should achieve:
- at least 90% exact three-class agreement overall;
- at least 85% agreement on PARAMOUNT versus non-PARAMOUNT.

Systematic disagreement requires prospective rubric revision before any public benchmark claim. Prior results remain associated with the rubric version under which they were produced.

## Existing v0 aggregate audit

Calendar window: 2026-07-25 through 2026-08-25.

GitHub merged population: 906.

Original frozen-rubric classification recorded in issue #2052:
- PARAMOUNT: 143
- STANDARD: 253
- SUPPORT: 510
- material units: 396

Confirmatory pre-transition window 2026-07-25..2026-08-03:
- PARAMOUNT 42
- STANDARD 84
- SUPPORT 112
- material rate 12.6/day

Initial automation-installation window 2026-08-04..2026-08-13:
- PARAMOUNT 12
- STANDARD 26
- SUPPORT 169
- material rate 3.8/day

Exploratory mature window 2026-08-15..2026-08-24:
- PARAMOUNT 78
- STANDARD 127
- SUPPORT 193
- material rate 20.5/day

The mature-window uplift is exploratory, not a causal treatment estimate.

## Current research boundary

The next Layer-A task is a second classification pass using this stricter v1 decision procedure, preserving per-PR records and disagreements rather than overwriting the original audit. Layer B remains separate and is used only for operator-attention denominators and concurrency/intervention measurements.