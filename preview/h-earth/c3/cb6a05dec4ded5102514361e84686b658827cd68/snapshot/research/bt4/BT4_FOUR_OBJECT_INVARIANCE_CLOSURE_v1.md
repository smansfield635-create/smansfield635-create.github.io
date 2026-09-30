# BT4 Four-Object Invariance Closure v1

Date: 2026-08-23

## Question
Can the unchanged BT4 entitlement kernel govern the strongest public state of materially heterogeneous Diamond Gate objects without object-specific entitlement exceptions?

Kernel: `preview/bt4/entitlement-v1/entitlement-engine.v1.mjs`

Invariant:

`PUBLIC REPRESENTATION <= CURRENT EVIDENCE + PROVENANCE/IDENTITY + EXECUTION/QUALIFICATION + AUTHORITY + FRESH RECEIPT`

## Object classes

1. Scientific claim — real `blinded-governance-generalization` claim and Generation 3 benchmark evidence.
   - Observed lifecycle: `QUALIFIED -> HELD -> SUPPORTED -> QUALIFIED`.
   - Identity failure contracted the public projection.
   - Identity repair with stale receipt did not restore QUALIFIED.
   - Fresh qualification receipt restored QUALIFIED.

2. World/runtime — real Audralia publication/runtime manifest.
   - Same kernel unchanged.
   - Runtime verification failure -> HELD.
   - Repaired runtime with stale receipt -> SUPPORTED.
   - Fresh requalification -> QUALIFIED.
   - Source identity failure -> HELD.

3. Diagnostic/qualification — real Audralia diagnostic authority executed under controlled perturbations.
   - Baseline authority execution -> AVAILABLE/VALID -> QUALIFIED projection.
   - Missing required authority -> HELD_MISSING_AUTHORITIES -> HELD projection.
   - Contract mismatch -> HELD_CONTRACT_MISMATCH -> HELD projection.
   - Repair with stale receipt -> SUPPORTED.
   - Fresh requalification -> QUALIFIED.

4. Software/release — real universal Diamond Gate publication contract and exact-head Pages workflow.
   - Binding: `AI_ENTRYPOINT.json` -> `.github/ai-router/publication-release-contract.v1.json` -> `.github/workflows/pages-exact-head-deploy-v3.yml`.
   - The real contract states MERGE_IS_NOT_DEPLOYMENT and DEPLOYMENT_IS_NOT_VERIFIED_LIVE_RELEASE.
   - Exact-head identity, surface-specific byte proof, and live verification are mandatory.
   - Under the unchanged BT4 kernel: merged-but-not-deployed -> HELD; exact-head identity failure -> HELD; post-deploy verification failure -> HELD; repaired-but-stale receipt -> SUPPORTED; fresh exact-head requalification -> QUALIFIED.
   - No production outage is induced; failure states are bounded control-plane perturbations of the existing release contract.

## Acceptance rule

PASS only if all four object classes use the same entitlement kernel, stronger representation contracts under supporting-state failure, stale recovery cannot fully restore the strong state, fresh qualification restores it, and no object-specific exception is added to the entitlement kernel.

## Disposition

If the release verifier passes on the exact candidate head, the four-object invariance boundary is closed as:

`BT4_DOMAIN_INVARIANCE = DEMONSTRATED_ACROSS_FOUR_HETEROGENEOUS_OBJECT_CLASSES`

This supports the architectural statement:

`Diamond Gate possesses a domain-independent entitlement layer capable of governing what heterogeneous public objects are allowed to represent.`

Limits remain:
- this is not proof that every public surface is already enrolled;
- the release failure perturbations are safely controlled rather than a deliberate production outage;
- novelty is not established by invariance alone.
