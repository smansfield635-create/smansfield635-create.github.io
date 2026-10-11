# BT4 Real-Object Operating Integration Boundary — 2026-08-23

## Purpose

Test whether the unchanged BT4 entitlement kernel can govern an actual Diamond Gate public research object through a real served lifecycle rather than only synthetic test objects.

## Real object selected

Public credibility claim: `blinded-governance-generalization`.

Canonical evidence: `assets/credibility/governance-gen3-benchmark.v1.json`.

The canonical benchmark records a frozen 160-case blinded comparison plus a 40-case one-shot holdout and the disposition `GENERALIZATION_EVIDENCE_SUPPORTED_WITHIN_TESTED_BOUNDARY`.

The canonical claim registry and benchmark payload were not altered by the BT4 lifecycle experiment.

## Integration

PR #1828 bound the existing real claim and benchmark evidence to the unchanged BT4 entitlement kernel through a bounded public projection at:

`/evidence/readiness/governance-gen3-entitlement/`

Merge commit: `48947602dbb782e26a8ff236411e72aa61268b1e`.

AI Entry emits a deployment-time evidence identity receipt containing the real benchmark source path, Git blob identity, SHA-256, byte count, and release commit. The public projection derives entitlement from real claim authority, real benchmark disposition/protocol state, evidence identity, and receipt freshness.

## Baseline

Initial binding:

- expected evidence blob: `bb2e1fce04699165a099f82cb656b911e583b897`
- epoch: 1
- receipt epoch: 1
- expected served state: `QUALIFIED`

The first browser verification attempt raced deployment and timed out before the new surface was part of the served release. No entitlement contradiction was observed. The unchanged verification was rerun after deployment propagation and completed successfully.

Verification workflow run: `32671889294`.

Successful rerun job: `97275161873`.

Result: live real-object baseline = `QUALIFIED`.

## Phase 1 — evidence identity failure

Commit: `9f3d2951b472e8f708eec874f1b7853074feff59` — `BT4 real-object lifecycle: induce evidence identity mismatch`.

The governed binding was advanced to a new epoch with a deliberately invalid expected evidence identity while leaving the benchmark itself unchanged.

Required result: provenance/identity false -> maximum entitlement `HELD`; attempted `QUALIFIED` public representation must be blocked.

Verification PR #1830: `BT4: verify real-object HELD contraction`.

Verification workflow run: `32672162635`.

Result: `SUCCESS`.

Disposition: `QUALIFIED -> HELD` demonstrated on the live served projection of a real Diamond Gate claim.

## Phase 2 — identity repair with stale qualification receipt

Commit: `97603b20d517dc255377f18395d0e5b674650356` — `BT4 real-object lifecycle: repair identity with stale qualification receipt`.

The correct benchmark evidence identity was restored, but the qualification receipt remained from the old epoch.

Binding state after repair:

- expected evidence blob: `bb2e1fce04699165a099f82cb656b911e583b897`
- epoch: 3
- receipt epoch: 1
- expected served state: `SUPPORTED`
- phase: `REPAIRED_STALE_RECEIPT`

Required result: repair alone must not restore `QUALIFIED`; stale qualification must cap the public state at `SUPPORTED`.

Verification PR #1831: `BT4: verify real-object stale-receipt ceiling`.

Verification workflow run: `32672314788`.

Result: `SUCCESS`.

Disposition: evidence repair without fresh requalification -> `SUPPORTED`, with stronger public representation unavailable.

## Phase 3 — fresh requalification

PR #1832: `BT4 real-object lifecycle: fresh requalification`.

Lifecycle commit: `7aa9ab0422a2c441efae0fe175b4a7e8f1752811`.

Merge commit: `0afd668dcc84d291cf76bd986a5f45853d28014a`.

The benchmark evidence and canonical claim content remained unchanged. The bounded governance binding was updated so the receipt epoch matched the current required epoch:

- epoch: 3
- receipt epoch: 3
- expected served state: `QUALIFIED`
- phase: `FRESH_REQUALIFIED`

The same live Chrome verifier was rerun without changing the entitlement engine or verification semantics.

Verification workflow run: `32671889294`.

Successful final rerun job: `97275562237`.

Result: `SUCCESS`.

Disposition: fresh qualification at the current epoch restored the live public projection to `QUALIFIED`.

## Binding result

The complete real-object lifecycle is therefore:

`QUALIFIED`

-> evidence/identity failure

`HELD`

-> identity repair without fresh qualification

`SUPPORTED`

-> fresh qualification receipt at current epoch

`QUALIFIED`

All transitions were observed through a browser-visible surface served from the Diamond Gate production domain, while the canonical Generation 3 benchmark evidence and canonical public claim record remained intact.

## What this establishes

`BT4_REAL_DIAMOND_GATE_OPERATING_INTEGRATION = DEMONSTRATED_ON_ONE_REAL_OBJECT`

`UNCHANGED_ENTITLEMENT_KERNEL_ON_REAL_OBJECT = DEMONSTRATED`

`REAL_EVIDENCE_IDENTITY_FAILURE_FORCES_PUBLIC_CONTRACTION = DEMONSTRATED`

`REPAIR_WITH_STALE_RECEIPT_CANNOT_RESTORE_QUALIFIED = DEMONSTRATED`

`FRESH_REQUALIFICATION_RESTORES_QUALIFIED = DEMONSTRATED`

`PUBLIC_REPRESENTATION_AS_ENTITLEMENT_CONTROLLED_PROJECTION = EMPIRICALLY_SUPPORTED`

## Limits

This experiment demonstrates operating integration on one real Diamond Gate research object. It does not establish that every canonical Diamond Gate object is governed by BT4, does not establish universal site-wide enforcement, and does not establish novelty or legal inventorship.

The strongest defensible architectural status after this boundary is:

`BT4_OPERATIONAL_GOVERNANCE_ARCHITECTURE = EMPIRICALLY_SUPPORTED_ON_REAL_DIAMOND_GATE_OBJECT`

The remaining material questions are breadth of canonical adoption and external novelty/prior-art disposition, not whether the core real-object lifecycle is technically achievable inside Diamond Gate.
