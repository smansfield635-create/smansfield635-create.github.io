# Estate Soundtrack Shared Custody

Canonical authority: Issue #2141 — `CANONICAL_ESTATE_SOUNDTRACK_AUTHORITY_v1`.
Current construction coordination: Issue #2233.
Project route: `ESTATE_SOUNDTRACK`.
Asset root: `assets/audio/estate-soundtrack/`.

This directory is the repository-wide custody surface for rights-verified soundtrack masters. It is not page-binding, excerpt, runtime, deployment, publication, or release authority.

Custody law:

`RIGHTS-VERIFIED MASTER -> ONE-TIME INGEST -> SHARED ESTATE AUDIO SURFACE -> PROVENANCE/LICENSE MANIFEST -> PAGE-SPECIFIC BINDING/CLIP`

A settled recording identity must not be replaced by a substitute master. Pages must bind to or derive from the shared master rather than reacquiring an external recording independently.

## Current custody state

### Gymnopédie No. 1 — Teknopazzo

Recording identity and rights are frozen and verified under Issue #2141. The expected exact original is the Wikimedia Commons Ogg/FLAC master at `https://upload.wikimedia.org/wikipedia/commons/b/b7/Gymnopedie_No._1..ogg`, CC0 1.0, duration `204.799546` seconds, exact byte length `6502597`, expected SHA-256 `13e4e03797169392166b9f11d9bf9c421c022b48ad87d9b10bd441ce068502da`.

Repository ingest is **not yet complete**. The current connected runtime can verify the source identity and licensing page but cannot retrieve the 6.5 MB Ogg payload through its permitted native source-fetch surfaces. No placeholder, transcoded copy, or substitute recording is permitted. The repository master path remains reserved as `assets/audio/estate-soundtrack/gymnopedie-no1-teknopazzo-cc0.ogg` until the exact byte-identical object can be transferred and verified.

When the exact object is available, ingestion is complete only after repository readback proves both:

- byte length = `6502597`;
- SHA-256 = `13e4e03797169392166b9f11d9bf9c421c022b48ad87d9b10bd441ce068502da`.

### Swan Lake Suite, Op. 20a — Gene/Eugene Gajewski

The exact recording identity is frozen to IMSLP file `#917973`, CC0 1.0, listed duration/size `24:13 / 33.10 MB`. Exact binary ingestion remains `PENDING_INGEST_EXTERNAL_GATE`. No substitute recording is permitted, and no repository master is claimed to exist yet.

## Manifest

`manifest.v1.json` is the machine-readable provenance and custody ledger. Actual repository hashes and byte lengths remain null until a master has been physically ingested and verified by repository readback; expected source identities and expected hashes are recorded separately so metadata cannot falsely imply custody that has not occurred.
