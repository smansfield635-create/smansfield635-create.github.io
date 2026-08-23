# BT4 World/Runtime + Diagnostic/Qualification Entitlement — v1

## Purpose

Test whether the unchanged BT4 entitlement kernel governs two materially different existing Diamond Gate objects without inventing parallel state machines.

## Real object bindings

World/runtime object:
- `.github/ai-router/publication-surfaces/audralia.json`
- `showroom/globe/audralia/index.html`

Diagnostic/qualification object:
- `showroom/globe/audralia/diagnostic/index.inspection.authority.js`

Shared kernel:
- `preview/bt4/entitlement-v1/entitlement-engine.v1.mjs`

## Frozen hypotheses

H-WORLD-1: the real Audralia runtime contract can be projected through the common entitlement law.

H-WORLD-2: a runtime verification or source-identity failure contracts a requested `QUALIFIED` representation to `HELD`.

H-WORLD-3: repairing the operational condition without a fresh qualification receipt cannot immediately restore `QUALIFIED`; it is capped at `SUPPORTED` until receipt freshness is restored.

H-DIAG-1: the real Audralia diagnostic authority can be projected through the same entitlement law without granting it production or runtime mutation authority.

H-DIAG-2: a contract mismatch or missing required authority contracts a requested `QUALIFIED` diagnostic-integrity representation to `HELD`.

H-DIAG-3: repaired diagnostic conditions with a stale receipt remain capped at `SUPPORTED`; a fresh receipt restores `QUALIFIED`.

## Acceptance boundary

The experiment passes only if:
1. both lanes bind to current real repository objects;
2. both use the same unchanged entitlement kernel;
3. failure contracts representation;
4. repair without fresh receipt does not fully restore the strongest state;
5. fresh receipt restores the stronger state;
6. no production Audralia runtime or diagnostic source is mutated by the experiment.

## Non-claims

This test does not by itself prove live-browser runtime failure/recovery, public deployment entitlement, or universal domain invariance across all four BT4 object classes. Those require their separately governed empirical legs.
