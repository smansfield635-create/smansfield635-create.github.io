# Static Asset Identity and Live-Byte Protocol

Status: GOVERNING REPOSITORY-WIDE DELIVERY CONTRACT

## Purpose

A source merge, successful deployment, or exact-head release marker does not prove that a browser received newly changed static runtime bytes. A stable asset URL can remain stale at a browser, CDN, edge, service-worker, or intermediary cache even when the deployed repository head is current.

This protocol applies to every project and every browser-loaded static asset in this repository, not only Compass.

## Governing law

When the bytes of a browser-loaded JS, CSS, module, image, media manifest, worker, or other behavior/presentation asset change, every production reference that is expected to consume the new bytes MUST acquire a new request identity before the candidate is merge-eligible.

A request identity may be changed by:

1. a content-addressed filename/path; or
2. a query identity whose value changes with the asset content/release.

Changing source bytes while leaving the production request URL unchanged is `STALE_ASSET_IDENTITY_BLOCKED`.

## Required sequence

MEASURE/QUALIFY PRODUCT -> CHANGE ASSET BYTES -> CHANGE REQUEST IDENTITY -> VERIFY SOURCE REFERENCE -> MERGE -> PUBLISH -> VERIFY PUBLIC RELEASE HEAD -> VERIFY PUBLIC ASSET BYTES/IDENTITY -> VERIFY LIVE BEHAVIOR.

No earlier state implies a later state.

## Acceptance states

- SOURCE_ACCEPTED: intended source bytes and references are correct at one exact SHA.
- PRODUCT_BEHAVIOR_ACCEPTED: pre-merge behavioral/visual qualification passes.
- CACHE_IDENTITY_ACCEPTED: every changed browser-loaded asset has a fresh production request identity or content-addressed path.
- PUBLICATION_ACCEPTED: public release marker equals the intended production head.
- PUBLIC_BYTES_ACCEPTED: public page references the expected asset identity and the served asset corresponds to accepted source.
- LIVE_BEHAVIOR_ACCEPTED: public URL demonstrates the intended user-visible behavior.

A project is not live-accepted until all applicable states pass.

## Prohibitions

- Do not tell the owner to clear browser cache as a substitute for request-identity correctness.
- Do not infer fresh asset bytes from a fresh HTML/release marker alone.
- Do not call merge, CI, deployment, or exact-SHA publication a live behavioral repair.
- Do not use a post-merge recursive bot commit as the normal mechanism for identity repair. Identity must be correct in the candidate before merge.
- Do not mix repository heads while comparing source and public evidence.

## Historical diagnosis — 2026-08-22

The Compass incident demonstrated the failure mode. A later runtime repair changed `assets/compass/compass.capability-carousel.js` while root `index.html` continued requesting the previously established Gen1592 URL. Earlier visible recovery occurred when the root loader URL itself was advanced to a fresh identity. The differential established that exact-head publication and cache identity are separate controls.

PR/commit #1649 remains a cleanup/non-operative attempt for its intended visual repair. The later measurable repair remains valid source/product work; absence of its live delta under the old request identity is a delivery-identity defect, not evidence that the measured source repair never existed.

## Permanent rule

`REFERENCED_ASSET_BYTES_CHANGED => REQUEST_IDENTITY_CHANGED_BEFORE_MERGE`

The repository should fail closed when this implication is violated.
