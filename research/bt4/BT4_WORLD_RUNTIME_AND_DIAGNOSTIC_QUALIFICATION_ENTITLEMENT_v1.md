# BT4 World/Runtime + Diagnostic/Qualification Entitlement — v1

## Purpose

Test whether the unchanged BT4 entitlement kernel governs two materially different existing Diamond Gate objects without inventing parallel state machines.

## Real object bindings

World/runtime object:
- `.github/ai-router/publication-surfaces/audralia.json`
- `showroom/globe/audralia/index.html`
- `showroom/globe/audralia/fap1-orbital-support-tuning-v1.mjs`
- `showroom/globe/audralia/loading-continuity-v3.css`

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

## Empirical execution record — 2026-08-23

The first execution failed before entitlement evaluation because the Audralia publication manifest contained a misplaced static assertion: `DIRECT_DENSITY_v4` was required in `/showroom/globe/audralia/`, while the actual identity belongs to the dedicated FAP1 module and was already independently checked there. The page-level duplicate assertion was removed; the FAP1 module assertion remains binding.

The second execution failed on a second stale manifest assertion: `loading-continuity-v3.css` currently declares `AUDRALIA_LOADING_CONTINUITY_v4`, while the manifest still required `AUDRALIA_LOADING_CONTINUITY_v3`. The manifest was corrected to the current v4 identity. These were release-contract drift findings, not BT4-kernel failures.

The verifier was then strengthened to validate every declared Audralia manifest path and to execute the real diagnostic authority source inside isolated controlled contexts. It derives the diagnostic authority's own required-global and expected-contract declarations from source, constructs a matching baseline family, then independently removes one required authority and perturbs one required contract.

Observed diagnostic authority behavior:
- baseline: `AVAILABLE`, `VALID`, `manualReviewRequired=false`, receipt `INSTALLED_WITH_RENEWED_FAMILY_OBSERVED`;
- missing `DGB_ENGINE_CONTRACT`: `HELD_MISSING_AUTHORITIES`, `absentCount=1`, `manualReviewRequired=true`, receipt `INSTALLED_WITH_FAMILY_ALIGNMENT_HELD`;
- mismatched `DGB_ENGINE`: `HELD_CONTRACT_MISMATCH`, `validationStatus=HELD`, `mismatchCount=1`, `manualReviewRequired=true`, receipt `INSTALLED_WITH_FAMILY_ALIGNMENT_HELD`.

The actual diagnostic outputs were then projected through the unchanged BT4 kernel. The final empirical run was GitHub Actions run `32674467245`, job `97280191689`, and completed `success`.

World/runtime entitlement results:
- baseline current runtime contract -> `QUALIFIED`;
- runtime verification failure -> `HELD`;
- repaired runtime with stale receipt -> `SUPPORTED`;
- fresh requalification receipt -> `QUALIFIED`;
- source-identity failure -> `HELD`.

Diagnostic/qualification entitlement results:
- baseline authority integrity -> `QUALIFIED`;
- actual contract-mismatch diagnostic outcome -> `HELD`;
- actual missing-authority diagnostic outcome -> `HELD`;
- repaired diagnostic condition with stale receipt -> `SUPPORTED`;
- fresh requalification receipt -> `QUALIFIED`.

Result:

`BT4_WORLD_RUNTIME_PROJECTION = PASS`

`BT4_DIAGNOSTIC_QUALIFICATION_PROJECTION = PASS`

`SAME_KERNEL = PASS`

`FAILURE_CONTRACTS_REPRESENTATION = PASS`

`REPAIR_WITH_STALE_RECEIPT_DOES_NOT_FULLY_RESTORE = PASS`

`FRESH_RECEIPT_RESTORES_STRONG_STATE = PASS`

The CI checkout was also bounded to the seven evidence files required by this verifier. This changed checkout from a full roughly 495,000-file working tree to a sparse evidence checkout and reduced the entitlement job to a few seconds.

## Non-claims / remaining boundary

This test now includes actual execution of the real diagnostic authority under controlled missing/mismatched dependencies. The world/runtime leg remains source-and-contract bound rather than a destructive live-runtime perturbation. It does not by itself prove live-browser runtime failure/recovery, public deployment entitlement, or universal domain invariance across all four BT4 object classes. Those remain separately governed empirical boundaries.
