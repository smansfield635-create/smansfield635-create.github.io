# Productivity Receipt V1 — Classification and Persistence Contract

Date: 2026-09-29
Status: PROPOSED / READ-ONLY INSTRUMENTATION
Scope: repository measurement only; no product authority

## Purpose

Measure qualified software-production activity without turning measurement into a new engineering subsystem. V1 is a repository-derived evidence instrument. It does not alter product behavior, governance authority, qualification authority, or publication authority.

The classifier is hypothesis-neutral. Longitudinal hypotheses consume receipts after classification; they do not influence classification.

## Evidence unit

Every classified event preserves:
- commit SHA
- repository timestamp
- commit subject
- relevant changed paths when required to resolve ambiguity
- zero or more category flags
- rule/evidence that caused each flag
- period identifier
- regime label as descriptive metadata only
- classification confidence: DETERMINISTIC, EVIDENCE_SUPPORTED, or UNCLASSIFIED

Merge commits are transport evidence and are not counted again as substantive activity when their underlying commits are present.

Known automated telemetry/snapshot commits are excluded from the meaningful-development denominator and retained in raw evidence as EXCLUDED_AUTOMATION.

An event may carry multiple flags. Categories are not mutually exclusive.

## V1 categories

1. PRODUCT_CONSTRUCTION
   Activity that advances an actual product, user-facing surface, runtime behavior, presentation, renderer, character/chamber, environment, or other deliverable surface.

2. QUALIFICATION
   Verification, proof, verifier, receipt, qualification workflow, evidence production, or qualification baseline work.

3. REPAIR_REWORK
   Correction, repair, recovery, reconciliation, normalization, regression repair, failed-candidate repair, or rework of previously attempted behavior/infrastructure.

4. GOVERNANCE_OVERHEAD
   Work whose immediate object is control/governance machinery: admission, authority, routing, dispatch, capability registration, control-plane/governance contracts, ledgers, fail-closed machinery, or governance substrate construction/repair.

5. PUBLICATION_CLOSURE
   Evidence that a substantive operation reaches qualified adoption, publication, deployment, terminal closure, durable handoff, or equivalent usable completion.

6. REUSE_LEVERAGE
   Awarded only when repository evidence identifies an existing capability, workflow, component, contract, asset, qualified surface, or other durable artifact being consumed/recombined. Message keywords alone are insufficient.

7. NEW_REUSABLE_CAPABILITY
   Awarded only when durable repository evidence establishes an artifact/capability intended and structured for subsequent consumption. Creation alone is insufficient.

8. UNCLASSIFIED
   Evidence is insufficient to classify without guessing.

## Derived indicators

All percentages must publish numerator, denominator, event count, excluded-event count, and unclassified count.

- Product Share = PRODUCT_CONSTRUCTION / meaningful repository activity
- Qualification Density = QUALIFICATION / meaningful repository activity
- Repair Burden = REPAIR_REWORK / meaningful repository activity
- Governance Cost = GOVERNANCE_OVERHEAD / meaningful repository activity
- Closure Rate = closed substantive operations / substantive operations eligible for closure
- Reused Capabilities = evidence-supported REUSE_LEVERAGE occurrences, deduplicated by operation + capability
- New Reusable Capabilities = evidence-supported NEW_REUSABLE_CAPABILITY occurrences

Because flags can overlap, category percentages are not expected to sum to 100%.

## Period and regime metadata

Every receipt carries:
- period_start
- period_end
- period_kind (daily, weekly, bounded retrospective)
- classification_contract_version
- source repository/ref
- regime_id
- regime_description

Regime metadata is descriptive and must never alter classification rules.

Initial retrospective validation regimes:
- 2026-09-16..2026-09-23: pre-concentrated-governance reference period
- 2026-09-24..2026-09-25: governance-substrate concentration period
- 2026-09-26..2026-09-29: immediate post-governance observation period

Previously reported manual-audit values are validation references, not classifier inputs:
- Sep 16–23: Product 48.6%; Qualification 23.8%; Repair 18.5%; Governance 8.5%
- Sep 24–25: Product 30.4%; Qualification 28.5%; Repair 32.9%; Governance 71.5%
- Sep 26–29: Product 75.4%; Qualification 37.5%; Repair 24.1%; Governance 21.1%

V1 must report disagreements rather than tune rules to reproduce these values.

## Persistence test

The post-governance hypothesis is downstream analysis, not part of classification.

Future weekly receipts permit testing whether:
- Product Share remains materially recovered.
- Qualification Density remains high.
- Governance Cost remains below the governance-construction spike.
- Repair Burden remains bounded rather than exploding.
- Closure Rate remains healthy.
- Reuse/Leverage increases or remains materially present.

No single threshold in this contract declares the hypothesis proven. Persistence is evaluated longitudinally from frozen-contract receipts.

## Human mechanical intervention

Repository evidence alone cannot reliably prove how much mechanical execution returned to the human operator. V1 therefore does not infer this quantity.

A future receipt version may add DELEGATION_DEPTH or HUMAN_MECHANICAL_INTERVENTION only when explicit operation receipts provide authoritative evidence. It must not be reconstructed from commit volume alone.

## V1 validation gate

Before automatic snapshots are authorized:
1. Exhaustively traverse the selected retrospective repository windows.
2. Preserve raw evidence for every included/excluded event.
3. Apply this frozen contract without using target percentages.
4. Produce receipts for all three September validation regimes.
5. Compare results with the prior manual audit.
6. Inspect and explain disagreements and UNCLASSIFIED events.
7. Revise the contract only for general classification defects, never to force agreement.
8. Re-run the full retrospective set after any contract revision.

Only after this gate passes should recurring daily/weekly snapshot automation be considered.

## Non-goals

V1 does not create a dashboard.
V1 does not mutate product surfaces.
V1 does not change control-plane or governance authority.
V1 does not claim causal proof from observational repository history.
V1 does not establish permanent productivity improvement from the four-day Sep 26–29 observation.
