# Repository Live Qualification Engine

The repository-wide rule is that the instrumentation itself is the receipt. Rooms, operators, and project-specific workflows may request qualification, but they may not independently manufacture or restate PASS.

## Governing state chain

`SOURCE_IDENTITY -> CANDIDATE_QUALIFICATION -> ASSET_IDENTITY -> MERGE_IDENTITY -> PUBLICATION -> PUBLIC_BYTES -> LIVE_RUNTIME -> PASS_CLOSED`

A terminal `PASS_CLOSED` receipt is valid only when every project-required state is PASS and each state carries exact evidence bound to one SHA.

## Generalized architecture

The engine is manifest-driven. Each project supplies only project-specific declarations:

- project id and public route;
- allowed changed paths;
- staging adapter when the default site stage is insufficient;
- browser-loaded asset identities that must advance when bytes change;
- source/public byte assertions;
- viewport and runtime verifier adapter;
- required interaction and visual assertions.

The reusable engine owns:

- exact-main binding and exact checkout;
- candidate/source identity verification;
- static-asset request-identity enforcement;
- production staging and publication;
- public release-marker verification;
- source/public byte hashing and equality;
- live browser/runtime invocation;
- receipt assembly, digest, and artifact retention.

## Receipt minimum fields

Every terminal receipt must record at least:

- schema version;
- project id;
- manifest path and manifest SHA-256;
- requested SHA and observed current-main SHA;
- candidate and merge SHA when applicable;
- public release-marker SHA;
- source/public digest pairs for every required asset;
- runtime assertion results and viewport identities;
- GitHub workflow, run, attempt, and job identity;
- terminal disposition;
- receipt SHA-256.

## Acceptance law

Merge success, CI success, deployment success, cache clearing, or a release marker alone are not live acceptance.

`PASS_CLOSED` requires the manifest-declared evidence chain through public-byte equality and live-runtime qualification.

Project-specific publication workflows should become thin wrappers around the reusable engine instead of implementing their own acceptance semantics.
