# Methods and Models Page Implementation Candidate v1

Status: `NONPUBLIC_PRODUCT_CANDIDATE`

This directory contains the bounded successor product candidate for the Methods and Models information system. It is isolated under `control-plane/` and does not alter the public Methods page, public routing, workflows, deployment configuration, release configuration, or the default branch.

## Immutable source binding

- Final materialized candidate head: `d84e2a2c0e73ff443993e134f6695d2ab08e4b41`
- Source package fingerprint: `4fc8e2280057b426e1573ab5ac4f710e0b0d1881264d443a56fb25b9f560f79e`
- Final repository fingerprint: `0d5bb1f3b916f3f702dbb77c9b329d721395aedf1a179f680186b2691e35e329`
- Source audit head: `7eee0e3f7a8c37e548e7721f1f5c2df69b2a310a`
- Canonical corpus blob: `5037da7a0ad32dcb6eee2d25dc2b236bd9574965`

## Materialized files

- `candidate/index.html`, `styles.css`, `app.mjs`, and `state.mjs` form the isolated interactive product surface and exact-return runtime.
- `candidate/candidate-data.mjs`, `records-1.mjs`, `records-2.mjs`, `model-core.mjs`, `model-graph.mjs`, `model-routing.mjs`, and `model-development.mjs` form the repository-resident normalized information model.
- `validate.mjs` reproduces the deterministic contract, source-binding, static product, syntax, and exact-return checks.
- `candidate-package.v1.json` records the frozen product contract, exact-return schema, validation results, known limits, rollback, and authority boundary.
- `README.md` records package orientation and custody.

## Implemented lifecycle

`ORIENTATION → CORPUS_BROWSE → QUESTION_OR_RECORD_SELECTION → LAWFUL_FOCUS → IMMERSIVE_INSPECTION → DEVELOPMENTAL_TRANSLATION → EXACT_RETURN`

The candidate exposes 25 formal records, four family browse frames, 16 question-intent routes, three contextual lenses, 15 admitted dependency edges, four explicit nonedges, six open hold classes, computational boundaries, invocation conditions, and developmental translation.

Visual proximity and shared family membership do not create formal dependencies. Adopted records are not presented as empirically validated claims.

## Exact return

Selection captures and cryptographically seals the 13 required state fields. Exact return rejects stale content versions or mutated snapshots instead of silently approximating the prior state.

## Validation

From this directory, run:

```bash
node validate.mjs
for file in candidate/*.mjs; do node --check "$file"; done
```

All 30 deterministic checks and all nine JavaScript module syntax checks passed during construction.

The following gates remain open and are not claimed: browser runtime matrix, screen-reader execution, human keyboard traversal, responsive perceptual equivalence, measured performance, and product perceptual acceptance. A headless Chromium attempt did not complete in the execution environment and was not treated as passing evidence.

## Rollback and removal

Delete this directory from the candidate branch, or delete the candidate branch. No public-path restoration is required because no public file is modified.

## Authority boundary

`PUBLIC_PAGE_MUTATION = NONE`

`MERGE = NOT_AUTHORIZED`

`DEPLOYMENT = NONE`

`RELEASE = NONE`

`PUBLICATION = NOT_AUTHORIZED`
