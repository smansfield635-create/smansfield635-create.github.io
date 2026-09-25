# Breakthrough 3 — Adversarial Differentiation Boundary

Date: 2026-08-23
Status: MATERIAL ADVERSARIAL DIFFERENTIATION BOUNDARY
Authority: BT3 software/engineering invention investigation

## Frozen input

Prior-art attack left narrow residual candidates:

- BT3-A — source/public/live-runtime authority-bound qualification chain
- BT3-B — qualification-jurisdiction-aware computational custody
- BT3-C — continuous spatial preview with authority-separated semantic commitment
- BT3-D — held for insufficient integrated implementation
- BT3-X — machine-expressible jurisdiction for computational claims

## Test executed

Primary test: `BT3-B/X equal final state / unequal qualified custody`.

Harness:

`research/bt3-software-invention/experiments/btx-equal-state-unequal-custody-v1.js`

The harness constructs two executions over the same minimal state model.

Lawful history:

1. controller lawfully commits `SET_MODE=ACTIVE`;
2. controller lawfully commits `SET_VALUE=7`.

Unauthorized history:

1. controller lawfully commits `SET_MODE=ACTIVE`;
2. renderer writes the factually correct value `7` even though renderer has no authority to make state-setting claims;
3. controller later lawfully commits `SET_VALUE=7`, causing terminal state convergence.

The adversarial requirement is deliberately stronger than output mismatch detection: both histories must terminate in exactly the same canonical state and terminal digest.

## Observed execution result

Execution environment: Node.js using deterministic canonical JSON-like serialization and SHA-256 custody/state digests.

Observed result:

- `terminalStateEqual = true`
- `terminalDigestEqual = true`
- lawful terminal state digest = `b818594e23ead3dff2b09d527f6d029d0a14da7e9de2e4bacb1bcba97214727a`
- unauthorized terminal state digest = `b818594e23ead3dff2b09d527f6d029d0a14da7e9de2e4bacb1bcba97214727a`
- lawful qualified = `true`
- unauthorized qualified = `false`
- lawful custody digest = `25c0d5cfe6ec398da7061cfa02a3af3a820c63ec7c69a8f046d9aad63b347752`
- unauthorized custody digest = `b09e97fbc253f7926b09ead70fd3967214ee08e7e9c080dd1baceacc658ee66d`
- custody digests equal = `false`
- aggregate adversarial test = `PASS`

## Material interpretation

Ordinary terminal-state comparison is unable to distinguish the two executions because their final canonical states and state digests are identical.

The authority-aware custody layer distinguishes them because the renderer-originated state claim is outside its declared jurisdiction. Later lawful convergence does not erase the earlier jurisdiction violation.

This demonstrates the narrow differentiating property sought after the prior-art attack:

`FINAL_STATE_EQUIVALENCE DOES NOT IMPLY QUALIFIED_CUSTODY_EQUIVALENCE`.

It also demonstrates the BT3-X proposition:

`FACTUAL_CORRECTNESS DOES NOT CONFER CLAIM AUTHORITY`.

The renderer wrote the same value eventually established by the authorized controller. Its value was factually correct, yet the execution remained unqualified because the renderer lacked jurisdiction to establish that state transition.

## What this test does not establish

This result does not establish novelty.

It does not establish that prior art lacks equivalent authority-aware provenance mechanisms.

It does not establish independent generality because the harness was deliberately derived from the extracted BT3 law.

It does not establish BT3-A, BT3-C, or BT3-D.

It does not establish that every unauthorized transition must permanently poison qualification in a future production design; that is the v1 adversarial law used to test distinguishability.

## Classification impact

### BT3-B

Prior: `DISTINCTIVE_INTEGRATION`.

After this test: remains `DISTINCTIVE_INTEGRATION`, with positive adversarial differentiation evidence.

The experiment shows a real capability beyond final-state equality and ordinary replay/output comparison: custody qualification can remain different after exact state convergence.

Promotion to `POTENTIAL_INVENTION` is not yet authorized because stronger prior-art attack against authorization-aware provenance, security monitors, proof systems, workflow provenance, and policy-enforced event logs is still required.

### BT3-X

Prior: `DISTINCTIVE_INTEGRATION`.

After this test: remains `DISTINCTIVE_INTEGRATION`, with positive executable evidence for machine-expressible claim jurisdiction.

The key surviving property is not separation of concerns. It is the ability to encode which actor may establish which claim class and preserve that jurisdiction in computational custody so a factually correct unauthorized claim remains distinguishable from an authorized claim.

### BT3-A

No classification change. Test not yet executed.

### BT3-C

No classification change. Test not yet executed.

### BT3-D

Remains `INSUFFICIENT_EVIDENCE`.

## Boundary classification

`BT3_BX_ADVERSARIAL_DIFFERENTIATION = PASS`

`TERMINAL_STATE_EQUALITY = TRUE`

`TERMINAL_STATE_DIGEST_EQUALITY = TRUE`

`QUALIFIED_CUSTODY_EQUALITY = FALSE`

`UNAUTHORIZED_FACTUALLY_CORRECT_CLAIM_DETECTED = TRUE`

`BT3_NOVELTY_SUPPORTED = FALSE`

## Strongest next boundary

Run BT3-A adversarial deployment-custody differentiation:

1. establish approved source identity and successful build/deployment record;
2. serve altered public bytes while retaining the successful external deployment status;
3. require ordinary deployment status to appear successful;
4. require BT3-A qualification to refuse `PASS_CLOSED` because public bytes break source/executable custody;
5. preserve a machine-readable receipt identifying the exact broken edge.

After A, run BT3-C spatial-preview/semantic-commit adversarial differentiation.

Then return to prior-art attack with the experimentally demonstrated B/X property stated narrowly enough for serious comparison.

## Boundary disposition

`BT3_ADVERSARIAL_DIFFERENTIATION_BOUNDARY_1 = CLOSED`

The first residual property survived a deliberately state-convergent attack. This is material implementation evidence, not a novelty ruling.
