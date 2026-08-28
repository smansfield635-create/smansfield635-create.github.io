# H-Earth Ground Interaction Instrumentation — Direct Reference

Status: durable reference for future H-Earth ground-level work and related environment-control diagnosis.

## Purpose

When H-Earth returns to ground-level maneuvering work, do not reconstruct the interaction instrumentation from conversation history and do not begin by inventing a new gesture-analysis system.

The repository already contains a proven H-Earth-specific direct-inspection chamber from Run 8E. Preserve that original chamber and use it as the immediate first reference.

This document also records the reuse rule established during the Audralia Hook 5 camera/polar investigation: the original H-Earth chamber remains H-Earth-specific and must not be converted into generic infrastructure. If another environment needs equivalent instrumentation, derive a separate shell from the proven pattern while leaving the original H-Earth authority intact.

## Canonical H-Earth precedent

Primary accepted implementation:

- PR #204 — `Run 8E direct inspection restoration and render scheduling — pass`
- Product interaction source: `showroom/globe/h-earth/functional-landscape/direct-manipulation.js`
- Browser/mechanical harness: `h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.harness.mjs`
- Constructor: `h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.constructor.mjs`
- Accepted scope record: `h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.run8e-direct-inspection-restoration-scope.js`
- Durable receipt: `h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.receipt.json`

The original Run 8E interaction invariant was:

- one-finger continuous look;
- two-finger continuous forward/backward travel;
- pinch zoom;
- unobstructed environment inspection;
- no visible directional controller;
- navigation state changes during the active gesture;
- expensive successor rendering is coalesced and committed after gesture settlement rather than on every pointer movement.

## Existing instrumentation already available

`direct-manipulation.js` already records a useful interaction receipt including:

- pointer move count;
- navigation intent count;
- preview frame count;
- committed render count;
- coalesced commit count;
- maximum navigation latency;
- last navigation latency;
- last classified intent;
- active pointer count;
- pending intent state;
- preview-active state;
- last interaction error.

It exposes this through:

`window.H_EARTH_RUN8E_DIRECT_INSPECTION.getReceipt()`

The Run 8E harness already provides executable precedent for:

1. synthetic one-finger pointer sequences and verification of look-state change;
2. synthetic two-finger slide sequences and verification of travel-position change;
3. synthetic pinch sequences and verification of zoom/FOV change;
4. proof that navigation changes during the gesture;
5. proof that full successor rendering is suppressed during active pointer motion;
6. proof that a settled successor render follows the gesture;
7. maximum navigation-latency measurement;
8. Samsung portrait emulation at 412×915;
9. Samsung landscape emulation at 915×412;
10. browser/page/request error collection;
11. screenshots and a structured machine-readable receipt.

## Preservation rule

DO NOT refactor the Run 8E H-Earth chamber into a generic shared framework merely because another environment needs similar evidence.

Required doctrine:

`PRESERVE ORIGINAL H-EARTH CHAMBER -> DERIVE SEPARATE REUSABLE SHELL WHEN NEEDED -> ATTACH CAUSE-SPECIFIC ADAPTER`

The original H-Earth files remain the direct H-Earth ground-state reference and should stay available for the post-globe H-Earth update.

A derived shell for Audralia or another environment may copy the observational architecture, but it must not silently replace, mutate, or broaden the semantic authority of the H-Earth chamber.

## Audralia reuse precedent

During Audralia Hook 5 camera/polar work, owner-visible evidence raised the question of measuring finger motion against rendered camera response without opening a new engineering program.

The correct precedent is Run 8E. For Audralia, a derived diagnostic shell may map the same observational concepts onto Audralia state, for example:

`pointer/touch delta -> gesture classification -> camera yaw/pitch or geographic state delta -> first-response latency -> release/settlement response`

That derived instrumentation is diagnostic. It must not itself redefine Audralia's control law.

The current Audralia semantic repair remains separately governed: remove the false LOOK-pitch-to-pole-crossing coupling, then verify the existing geographic/two-finger travel owner before inventing a replacement pole-crossing controller.

## Immediate lookup rule for future H-Earth work

When H-Earth ground maneuvering resumes after globe work, begin here, then inspect in this order:

1. `docs/H_EARTH_GROUND_INTERACTION_INSTRUMENTATION_REFERENCE.md`
2. PR #204
3. `showroom/globe/h-earth/functional-landscape/direct-manipulation.js`
4. `h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.harness.mjs`
5. `h-earth-3d/validation/h-earth.run8e-direct-inspection-restoration.receipt.json`
6. the then-current H-Earth navigation/camera authority before adapting anything

Do not hunt through historical preview trees unless one of these canonical references proves insufficient.

## Scope warning

This document is a navigation/reference object. It does not authorize mutation of H-Earth, Audralia, globe, renderer, camera, navigation, weather, or publication code. Any future product mutation still requires the governing operation authority for that cause.
