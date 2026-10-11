# Breakthrough 3 — BT3-C Adversarial Differentiation Boundary

Date: 2026-08-23
Status: MATERIAL ADVERSARIAL DIFFERENTIATION BOUNDARY 3
Authority: BT3 software/engineering invention investigation

## Frozen residual candidate

BT3-C residual after prior-art attack:

`continuous spatial projection + preview + settlement + discrete semantic commitment + authority separation`

The broad claim that a UI or graphical model can be driven by an executable state machine is established prior art and is not under test here.

## Repository implementation basis

`assets/compass/compass.controller.js` explicitly separates controller authority from rendering, hit-target calculation, pointer binding, drag classification, and spherical projection. It also defines orientation phases including `PREVIEW`, `SETTLING`, `COMMITTED`, and `CANCELLED`, and states that drag commitment does not itself open/close semantic clusters or select rooms.

## Adversarial question

Can spatial geometry reach a semantic target during preview while canonical semantic state remains unchanged when commitment is denied or cancelled?

If not, BT3-C collapses to ordinary UI/state-machine coupling.

## Harness

`research/bt3-software-invention/experiments/btc-spatial-preview-noncommit-v1.js`

The isolated harness starts with canonical semantic state:

`selected = north, phase = COMMITTED`

A continuous spatial preview moves exactly to the east target orientation (`-π/2`). The geometry records that the target was reached. The semantic commit decision is then made inadmissible and cancelled.

## Observed execution result

- `previewReachedTarget = true`
- `canonicalStateUnchanged = true`
- `semanticTargetCommitted = false`
- state digest before = `97b478c06a56fd6cbbb081ea74b0d54722da26791e1f5bb6451fbd64dab4e67b`
- state digest after = `97b478c06a56fd6cbbb081ea74b0d54722da26791e1f5bb6451fbd64dab4e67b`
- evidence digest = `1a9bb48ed1557f345cf16ad596a71dddc3ab0c41195f12b3ae3dd28cd850bcea`
- aggregate adversarial test = `PASS`

## Material interpretation

The test demonstrates a real separation between spatial reachability and semantic commitment.

`GEOMETRIC_TARGET_REACHED` does not imply `SEMANTIC_STATE_COMMITTED`.

The geometry may faithfully preview a candidate semantic target while controller authority still refuses promotion into canonical state. The preview event remains observable/evidenced without changing the authoritative state.

This is stronger than a UI merely displaying the current state, but it does not establish novelty. Prior art in statecharts, model-based interaction, transactional UI, gesture recognizers, speculative interaction, and robotics/control interfaces must still be attacked against this exact narrow property.

## Classification impact

BT3-C remains `DISTINCTIVE_INTEGRATION`, now with positive executable adversarial differentiation evidence.

No promotion to `POTENTIAL_INVENTION` or `NOVELTY_SUPPORTED` is authorized at this boundary.

## Aggregate BT3 adversarial evidence now available

1. BT3-B/X: byte-identical final state with unequal qualified custody — PASS.
2. BT3-A: successful CI/deployment/runtime with source/public byte mismatch; `PASS_CLOSED` refused — PASS.
3. BT3-C: exact spatial target preview with denied semantic commitment and unchanged canonical state — PASS.

BT3-D remains `INSUFFICIENT_EVIDENCE` pending an integrated unrelated portable artifact.

## Strongest next boundary

Return to prior-art attack using only the experimentally demonstrated narrow properties. In particular, attack BT3-B/X against authorization-aware provenance, reference monitors, policy-enforced event logs, proof systems, workflow provenance, capability security, and typed/effect authority systems. Attack BT3-C against transactional/speculative UI and spatial/robotic state interfaces. Attack BT3-A against software supply-chain attestation, in-toto/SLSA-style provenance, remote attestation, reproducible builds, and live deployment integrity systems.

Only after that comparison should any candidate be considered for `POTENTIAL_INVENTION`.

## Boundary disposition

`BT3_C_ADVERSARIAL_DIFFERENTIATION = PASS`

`GEOMETRIC_TARGET_REACHED = TRUE`

`SEMANTIC_TARGET_COMMITTED = FALSE`

`CANONICAL_STATE_UNCHANGED = TRUE`

`BT3_NOVELTY_SUPPORTED = FALSE`
