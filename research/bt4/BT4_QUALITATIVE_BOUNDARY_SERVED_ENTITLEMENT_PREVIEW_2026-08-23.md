# BT4 Qualitative Boundary — Served Entitlement Preview

Status: `QUALITATIVE_BOUNDARY_EXECUTED`
Date: 2026-08-23

## Purpose

Test whether the isolated BT4 machine-entitlement mechanism can be bound to a publicly served nonproduction preview such that presentation is downstream of current evidence/provenance/reproduction/authority/qualification state.

This record does not assert novelty, production deployment, canonical scientific standing, or Stencila influence.

## Stencila causal-influence clarification

The chronology audit supports parallel 2026 architectural convergence. No citation, access trail, commit reference, issue, discussion, acknowledgement, or other evidence has been found establishing that Stencila consumed or reacted to Diamond Gate updates. Similarity and timing are not evidence of copying.

Disposition: `STENCILA_USED_DIAMOND_GATE_UPDATES = NO_EVIDENCE_FOUND`.

## Public preview implementation

An isolated, noindex, explicitly NONPRODUCTION preview was added under:

`preview/bt4/entitlement-v1/`

Relevant main commits:

- `60b6969055cbe0e9a5ae48e839b24ef818dc95be` — initial served-state preview wrapper.
- `55f1f5c6a34c13a50912b92e8c4f0e0f6192b3f4` — shared entitlement engine.
- `50801e49ac9d31be5dd80f728098890af935c901` — presentation bound to shared engine.
- `7411f95d1514520328ccf95a9b0ca2ef10a454f9` — shared-engine verifier.

The browser presentation always requests `QUALIFIED`; the shared engine computes the maximum permitted state and blocks any stronger requested presentation.

## Adversarial state behavior

The shared engine/verifier checks seven required behaviors:

1. valid evidence + provenance + reproduction + authority + fresh receipt => `QUALIFIED`;
2. provenance/source corruption => `HELD`;
3. reproduction failure => `HELD`;
4. admissible adverse evidence => `CONTRADICTED`;
5. requested `QUALIFIED` presentation while entitlement is lower => blocked;
6. repaired conditions with stale receipt => only `SUPPORTED`;
7. fresh receipt at the current epoch => `QUALIFIED` restored.

CI run `32665950268` (`BT4 Entitlement Preview Verification`, run 10) completed successfully. The shared entitlement-engine step passed and the immutable public-preview transport step passed.

Binding result:

`SHARED_ENTITLEMENT_ENGINE_ADVERSARIAL_CHECKS = 7/7 PASS`

`STRONGER_PRESENTATION_THAN_CURRENT_ENTITLEMENT = BLOCKED`

`RECOVERY_WITH_STALE_RECEIPT = BLOCKED_AT_SUPPORTED`

`RECOVERY_WITH_FRESH_RECEIPT = QUALIFIED`

## Transport failure and correction

The first attempted custom-domain verification failed lawfully. CI run `32665637886` showed repeated HTTP 404 responses from:

`https://diamondgatebridge.com/preview/bt4/entitlement-v1/`

A control diagnostic then showed the older H-Earth `/preview/...` control also returned 404 on the custom domain, while the repository user-site endpoint redirected. Therefore the failure was not specific to BT4; `/preview/...` is not presently part of the custom-domain publication surface.

The qualification target was corrected to the repository's established immutable-preview pattern: commit-pinned static CDN transport.

Qualified immutable preview identity:

`d6f75966b5bec8ede5d210a7a42e401c314b1a34`

Public preview HTML:

`https://rawcdn.githack.com/smansfield635-create/smansfield635-create.github.io/d6f75966b5bec8ede5d210a7a42e401c314b1a34/preview/bt4/entitlement-v1/index.html`

The relative browser import resolves the entitlement module from the same immutable commit. CI independently fetched the served HTML and served module and verified the expected experiment marker and `computeEntitlement` implementation.

## Binding disposition

`ISOLATED_PUBLICLY_SERVED_MACHINE_ENTITLEMENT_COMPOSITION = DEMONSTRATED`

`PUBLIC_PREVIEW_PRESENTATION_BOUND_TO_SAME_VERIFIED_ENGINE = DEMONSTRATED`

`IMMUTABLE_PUBLIC_PREVIEW_TRANSPORT = PASS`

`DIAMONDGATEBRIDGE.COM_PREVIEW_ROUTE = NOT_PART_OF_CURRENT_PUBLICATION_SURFACE`

`CANONICAL_DIAMOND_GATE_PUBLIC_INSTITUTION_INTEGRATION = NOT_YET_DEMONSTRATED`

`BT4_STRONG_FORM_AS_CANONICAL_DEPLOYED_SYSTEM = NOT_YET_PROVED`

`BT4_NOVELTY_SUPPORTED = FALSE`

`BT4_DISTINCTIVE_COMPOSITION_ROUTE = EMPIRICALLY_ADVANCED`

## Interpretation

This boundary crosses an important line: the surviving BT4 composition is no longer only a conceptual design or local harness. A public outsider can load an immutable nonproduction browser object whose displayed entitlement is computed by the same fail-closed engine that passed adversarial verification.

It does not yet establish the strongest claim, because the object is not integrated into the canonical Diamond Gate served institution. The next material boundary is canonical-but-noncritical integration: route one explicitly experimental public claim through the entitlement engine on the actual Diamond Gate publication surface, then perform evidence degradation and fresh-requalification recovery without allowing a stronger public state to remain visible.
