# Cinematic Binary Persistence and Restart Protocol

Status: **ACTIVE REUSABLE PRODUCTION PRACTICE**  
Date: 2026-09-06

This protocol governs persistence of cinematic evidence packets, frame manifests, encoded masters, and other binary artifacts that must survive room changes. Current `AI_ENTRYPOINT.json` remains controlling.

## Three-part durability law

A binary artifact is durably persisted only when all three are true:

1. **IDENTITY** — exact bytes are known and independently verifiable.
2. **AVAILABILITY** — a fresh room can retrieve those exact bytes from a durable addressable locator using an authorized read capability.
3. **REACHABILITY** — accepted Git state references the object through tree/commit/ref and committed readback reproduces the identity.

`KNOWN_HASH != AVAILABLE_BYTES`

`CREATED_GIT_BLOB != REACHABLE_GIT_STATE`

`SUCCESSFUL_API_CALL != DURABLE_CHECKPOINT`

## Fresh-room restart test

Before declaring persistence closed, prove:

> A completely fresh room, possessing only current AI entry authority, the named durable handoff/checkpoint, the named ref or storage locator, and ordinary authorized read capabilities, can determine exactly what completed, retrieve every byte required to continue, independently verify those bytes, and execute the next state without predecessor-room memory or scratch state.

If this test fails, the checkpoint does not exist.

## Durable source locator requirement

Every binary persistence checkpoint must name an actual byte locator, not merely an identity.

Acceptable locator classes when currently authorized and readable include:

- committed repository path + exact commit/ref;
- exact still-live workflow artifact ID + repository/run identity;
- persistent connected-storage file identifier/path;
- another durable content-addressable source retrievable by a fresh room.

SHA-256 alone, byte count alone, screenshots, prior-room prose, and unreferenced blob counts are not locators.

When no durable locator is known, stop with:

`SOURCE_BYTES_NOT_DURABLY_LOCATED`

Do not perform broad repository/workflow archaeology merely because a hash is known. A hash proves identity, not location.

## Small-object path

Repository precedent establishes default ingress chunk size `524,288` bytes and accepted configured range `65,536..1,048,576` bytes. Issue #1323 proves a one-chunk case; PR #1334 used 30 chunks for a 15,365,888-byte master; PR #2798 used eight 524,288-byte chunks for a 3,828,177-byte master.

Chunk count follows object size; it is not a ritual requirement.

For an object that fits one canonical transfer unit, prefer:

`DURABLE SOURCE BYTES`
→ `VERIFY BYTE COUNT + SHA-256`
→ `COMPUTE EXPECTED GIT BLOB SHA`
→ `CREATE ONE BINARY GIT BLOB`
→ `VERIFY RETURNED BLOB SHA`
→ `TREE-ATTACH IMMEDIATELY`
→ `COMMIT / ADVANCE BOUNDED REF`
→ `READ BACK FROM EXACT COMMIT`
→ `VERIFY BYTE COUNT + SHA-256 + GIT BLOB SHA`
→ `DECLARE PERSISTENCE CLOSED`

Do not split a small object into many tiny pieces without a concrete payload-size failure or exact repository requirement.

## Chunking fallback

Chunk only for a demonstrated transport/request-size limit or genuinely large object. Before upload, durably freeze for every part: index, exact byte range, exact byte count, SHA-256, and expected Git blob SHA.

If partial transfer must survive room changes, accepted progress must become branch-reachable incrementally:

`COMMITTED MANIFEST`
→ `UPLOAD PART N`
→ `VERIFY PART N`
→ `TREE-ATTACH PART N`
→ `COMMIT / ADVANCE STAGING REF`
→ `READ BACK PART N`
→ `NEXT PART`
→ `ASSEMBLE + VERIFY FINAL`
→ `FINAL COMMIT`

Do not hand off a count of orphan blobs as durable progress.

A statement such as `7/30 complete` is permitted only when a fresh room can enumerate and retrieve those exact seven accepted units from durable referenced state and continue with unit eight. Otherwise the correct state is:

`API_OPERATIONS_OCCURRED / DURABLE_PROGRESS_ZERO`

## Checkpoint schema

```text
BINARY_PERSISTENCE_CHECKPOINT
Artifact role:
Byte count:
SHA-256:
Expected Git blob SHA:
IDENTITY: <PASS|FAIL|UNKNOWN>
AVAILABILITY: <PASS|FAIL|UNKNOWN>
Durable source locator:
Fresh retrieval verified: <yes/no>
REACHABILITY: <PASS|FAIL|UNKNOWN>
Target ref:
Committed path:
Commit SHA:
Committed blob SHA:
Committed readback verified: <yes/no>
Chunking used: <no|yes + reason>
Prior record superseded:
Current result:
Next exact move:
```

## Room-collapse rule

Before a long upload/render/encode/transfer loop, ask:

`IF THIS ROOM DISAPPEARS AFTER THE NEXT OPERATION, WHAT EXACT DURABLE OBJECT WILL THE SUCCESSOR READ?`

If the answer is only chat prose, a local path, orphan blob, temporary variable, or remembered counter, persist state first.

## Precedent interpretation

Issue #1323 explicitly separated `TRANSFER_CORE_PASS` from `SOURCE_INGRESS_NOT_YET_CLOSED`; downstream transfer machinery does not prove upstream source availability. Issue #2787 separately establishes that branch creation or transport activity is not cinematic production progress without an observable committed artifact.

## Operating law

`IDENTIFY EXACT BYTES`
→ `PROVE DURABLE SOURCE AVAILABILITY`
→ `CHOOSE SMALLEST CANONICAL TRANSFER REPRESENTATION`
→ `MAKE ACCEPTED BYTES TREE-REACHABLE IMMEDIATELY`
→ `VERIFY COMMITTED READBACK`
→ `ONLY THEN DECLARE PERSISTENCE CLOSED`
