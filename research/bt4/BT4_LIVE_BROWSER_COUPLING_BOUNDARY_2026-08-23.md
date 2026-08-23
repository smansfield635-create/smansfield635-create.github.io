# BT4 Live Browser Coupling Boundary — 2026-08-23

Purpose: test whether the served Diamond Gate BT4 nonproduction surface visibly obeys the same entitlement engine already proven in isolation.

Scope: nonproduction route only: `/preview/bt4/entitlement-v1/`.

Required observable sequence:

1. Baseline: `QUALIFIED`.
2. Corrupt provenance: served state contracts to `HELD`.
3. Presentation request for `QUALIFIED` is blocked while entitlement is `HELD`.
4. Repair conditions without fresh qualification receipt: served state rises only to `SUPPORTED`.
5. Issue fresh qualification receipt: served state returns to `QUALIFIED`.
6. Introduce adverse evidence: served state contracts to `CONTRADICTED`.
7. Repair after adverse evidence without fresh receipt: served state rises only to `SUPPORTED`.
8. Fresh receipt after repair: served state returns to `QUALIFIED`.

Verifier: `research/bt4/verify-bt4-live-browser.v1.mjs`.

Binding rule: no BT4 deployed-system claim may advance unless the headless browser loads the live Diamond Gate domain and all eight observable checks pass against the served object.

Current disposition before run: `PENDING_LIVE_BROWSER_VERIFICATION`.
