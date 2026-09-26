# BT4 Live Browser Coupling Boundary — 2026-08-23

Purpose: test whether the served Diamond Gate BT4 nonproduction surface visibly obeys the same entitlement engine already proven in isolation.

Scope: nonproduction route only: `/preview/bt4/entitlement-v1/`.

## Required observable sequence

1. Baseline: `QUALIFIED`.
2. Corrupt provenance: served state contracts to `HELD`.
3. Presentation request for `QUALIFIED` is blocked while entitlement is `HELD`.
4. Repair conditions without fresh qualification receipt: served state rises only to `SUPPORTED`.
5. Issue fresh qualification receipt: served state returns to `QUALIFIED`.
6. Introduce adverse evidence: served state contracts to `CONTRADICTED`.
7. Repair after adverse evidence without fresh receipt: served state rises only to `SUPPORTED`.
8. Fresh receipt after repair: served state returns to `QUALIFIED`.

Verifier: `research/bt4/verify-bt4-live-browser.v1.mjs`.

## Executed evidence

GitHub Actions workflow: `BT4 Live Browser Coupling Verification`.

Run: `32670775424`.

Job: `97271191405`.

Live URL loaded by headless Chrome:

`https://diamondgatebridge.com/preview/bt4/entitlement-v1/`

Observed results:

- baseline: `QUALIFIED` — PASS
- provenance contraction: `HELD` — PASS
- requested `QUALIFIED` presentation blocked and served as `HELD` — PASS
- repaired conditions with stale receipt: `SUPPORTED` — PASS
- fresh receipt recovery: `QUALIFIED` — PASS
- adverse evidence contraction: `CONTRADICTED` — PASS
- post-adverse repair with stale receipt: `SUPPORTED` — PASS
- post-adverse fresh receipt recovery: `QUALIFIED` — PASS

Result: `8/8 PASS`.

## Binding dispositions

`BT4_LIVE_DOMAIN_SURFACE_RETRIEVABLE = DEMONSTRATED`

`BT4_LIVE_BROWSER_EVIDENCE_TO_PUBLIC_STATE_COUPLING = DEMONSTRATED_ON_NONPRODUCTION_TEST_OBJECT`

`BT4_STRONGER_PRESENTATION_OVERRIDE_BLOCKED_ON_SERVED_OBJECT = DEMONSTRATED`

`BT4_STALE_REQUALIFICATION_BLOCKED_ON_SERVED_OBJECT = DEMONSTRATED`

`BT4_FRESH_RECEIPT_RECOVERY_ON_SERVED_OBJECT = DEMONSTRATED`

`BT4_CANONICAL_CLAIM_UNIVERSAL_ENFORCEMENT = NOT_DEMONSTRATED`

`BT4_NOVELTY_SUPPORTED = FALSE`

`BT4_DISTINCTIVE_COMPOSITION_EMPIRICAL_SUPPORT = STRENGTHENED`

## Interpretation boundary

This closes the first end-to-end served-surface experiment. It proves that a Diamond Gate page served from the live domain can have its displayed claim state computed and forcibly contracted by evidence/provenance/qualification state, and that stale repair cannot restore `QUALIFIED` without a fresh qualification receipt.

It does not establish that all canonical Diamond Gate claims are already controlled by this architecture, nor does it establish novelty over all prior art. The next material boundary is cross-object generalization: bind the same entitlement law to a second heterogeneous nonproduction object or a bounded real research claim, then test whether the law remains invariant rather than being a one-off page behavior.
