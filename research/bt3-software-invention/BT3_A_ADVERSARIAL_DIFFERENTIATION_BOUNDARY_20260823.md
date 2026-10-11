# Breakthrough 3 — BT3-A Adversarial Differentiation Boundary

Date: 2026-08-23
Status: MATERIAL ADVERSARIAL DIFFERENTIATION BOUNDARY
Authority: BT3 software/engineering invention investigation

## Frozen candidate

BT3-A residual after prior-art attack:

`source/public/live-runtime authority-bound qualification chain`

Broad self-certifying executable claims were already collapsed by prior art. This boundary tests only the narrower custody property.

## Test question

Can a qualification architecture refuse terminal acceptance when ordinary build/deployment/runtime indicators are all successful but the publicly served executable bytes differ from the approved source bytes?

Required outcome:

- CI remains PASS;
- deployment remains PASS;
- runtime assertion remains PASS;
- source/public byte identity fails;
- `PASS_CLOSED` is refused;
- the broken custody edge is identified explicitly.

## Harness

`research/bt3-software-invention/experiments/bt3a-public-byte-custody-adversarial-v1.mjs`

The harness contains a control execution and an adversarial execution.

Control:

- approved source bytes and public bytes are identical;
- CI = PASS;
- deployment = PASS;
- runtime assertion = PASS;
- expected terminal qualification = `PASS_CLOSED` equivalent.

Adversarial:

- approved source bytes are unchanged;
- public bytes are altered;
- CI remains PASS;
- deployment remains PASS;
- runtime assertion remains PASS;
- expected terminal qualification = REJECTED because custody is broken.

## Observed execution result

The executable fixture was run in Node.js before repository commit.

Control:

- source digest = `dd6dcadcd3f3f53e644c54ebff7b34ede8ec89f9b90d06b8339a9394f90cb131`
- public digest = `dd6dcadcd3f3f53e644c54ebff7b34ede8ec89f9b90d06b8339a9394f90cb131`
- byte identity = PASS
- CI = PASS
- deployment = PASS
- runtime = PASS
- terminal qualification = PASS

Adversarial:

- source digest = `dd6dcadcd3f3f53e644c54ebff7b34ede8ec89f9b90d06b8339a9394f90cb131`
- public digest = `5a0af46447e6b0bff286217474a03e8eadd4898947c3818223f21de7b25aa5a7`
- CI = PASS
- deployment = PASS
- runtime = PASS
- byte identity = FAIL
- broken edge = `SOURCE_BYTES_TO_PUBLIC_BYTES_IDENTITY`
- terminal qualification = REJECTED

All seven assertions passed.

## Material result

`SUCCESSFUL_BUILD_DEPLOYMENT_AND_RUNTIME_DO_NOT_IMPLY_QUALIFIED_PUBLIC_EXECUTABLE_IDENTITY`.

The architecture distinguishes operational success from custody success.

The adversarial executable could be outwardly healthy and runtime-functional while still being disqualified because the public bytes were not the approved executable bytes.

This is materially stronger than ordinary deployment status alone, but it does not establish novelty.

## What this test does not establish

- It does not prove that no supply-chain/security framework already performs equivalent source-to-deployed-artifact attestation.
- It does not prove intrinsic self-qualification; the test models a qualification engine operating over executable identity and runtime evidence.
- It does not exercise a real public network deployment; the byte mismatch is an isolated deterministic adversarial fixture.
- It does not establish BT3-B, BT3-C, or BT3-D.

## Classification impact

Prior classification:

`BT3-A = DISTINCTIVE_INTEGRATION`

Post-test classification:

`BT3-A = DISTINCTIVE_INTEGRATION_WITH_POSITIVE_ADVERSARIAL_EVIDENCE`

No promotion to `POTENTIAL_INVENTION` or `NOVELTY_SUPPORTED` is authorized yet.

## Boundary classification

`BT3_A_ADVERSARIAL_DIFFERENTIATION = PASS`

`CI_STATUS = PASS`

`DEPLOYMENT_STATUS = PASS`

`RUNTIME_STATUS = PASS`

`SOURCE_PUBLIC_BYTE_IDENTITY = FAIL`

`PASS_CLOSED = REJECTED`

`BROKEN_EDGE = SOURCE_BYTES_TO_PUBLIC_BYTES_IDENTITY`

`BT3_NOVELTY_SUPPORTED = FALSE`

## Strongest next boundary

Run BT3-C adversarial differentiation:

1. construct a spatial state projection with a candidate semantic target;
2. allow continuous geometric preview to reach the target pose;
3. cancel or deny semantic commitment;
4. require visual/spatial pose evidence to show the target was reached in preview;
5. require canonical semantic state to remain unchanged;
6. require renderer/control layers to remain incapable of promoting preview into committed state.

After BT3-C, return the experimentally demonstrated A/B/C/X residuals to a second, narrower prior-art attack.

## Boundary disposition

`BT3_ADVERSARIAL_DIFFERENTIATION_BOUNDARY_2 = CLOSED`

BT3-A survived the custody-mismatch attack as a differentiating integration property. This is implementation evidence, not novelty support.
