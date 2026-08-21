# Compass Emergency Recovery Guardrail

The public Compass is in active incident recovery.

Until the incident is explicitly closed, agents working under `assets/compass/` must follow these rules:

1. Do not redesign, restructure, reparent, reorder, or dynamically reconcile Compass DOM.
2. Do not reintroduce Track B, `positionCapability()`, subtree-wide `MutationObserver` logic, or any presentation runtime that moves existing Compass nodes after load.
3. Do not modify multiple Compass product files speculatively. Diagnose first; make the smallest evidence-backed correction.
4. Preserve the known-good Track A runtime boundary and preserve the H-Earth canonical direct route `/showroom/globe/h-earth/`.
5. Treat publication/deployment synchronization separately from product repair. A stale live page is not evidence that current `main` should be redesigned again.
6. Do not merge a competing Compass recovery while another recovery is active. Re-read current `main` immediately before any write and abort if the target has moved materially.
7. Public recovery is not complete until the live page visibly renders the Compass and both interactive carousel/runtime layers operate in a browser.
8. The requested post-recovery presentation change—moving the capability section lower on the page—must be implemented only after the known-good Compass is live and verified, preferably as static HTML/CSS placement rather than runtime DOM movement.

Current priority: restore a visibly functional public Compass first. No feature work until then.
