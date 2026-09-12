# Compass V2 — R3/R4/R5 Persistence Current State

Status: **CURRENT / FAIL-CLOSED PERSISTENCE HANDOFF**  
Date: 2026-09-06

Canonical durable checkpoint issue:

`#2828 — Compass V2 R3–R5 persistence — durable packet source checkpoint`

Reusable persistence protocol:

`docs/CINEMATIC_BINARY_PERSISTENCE_RESTART_PROTOCOL.md`

## Current coordinates

Current repository `main` at this documentation checkpoint:

`24eba044e3c4943756ee2412cb81f35a440f9608`

R3/R4/R5 construction base and bounded branch:

`f6dfa02fbb1d15ee4093d696f4ce3f6fe99a6d9c`

`compass/v2-r3-r5-capture-20260906`

The bounded branch still points exactly to `f6dfa02f...`; no R3/R4/R5 evidence commit is currently reachable from it.

## Frozen technical result

`R3 = TECHNICALLY COMPLETE`

`R4 = TECHNICALLY COMPLETE`

`R5 = TECHNICALLY COMPLETE`

R5 identity:

- `1,140` frames
- `1280x720`
- `30 fps`
- `38,000 ms`
- total frame bytes `117,353,354`
- sequence SHA-256 `d1befa40243baa55470c73052ba43d4ebf4693ca0e2662575930c4ccd8b007bc`
- frame 0 SHA-256 `d315b8ed487db3177fd0b31b9035894cc96054cce3e7f75bf31f95aec26b7094`
- frame 1139 SHA-256 `aacda72fba3aef72a25a40278fafc3c72bc70b891379eae10c92227e782dbaaf`
- manifest SHA-256 `514a3e18f55d936eab9272ba311397de3ec7b1848b6f0c5380f2f094f3beea96`
- R4 sheet SHA-256 `621370941380ba5cefd2356f34b83baf4bf5fe1299d86cca72182c332f3e6cde`

Lossless combined R3/R4/R5 packet identity:

- bytes `118,560`
- SHA-256 `208510e35adbfa177d61f571c8b7fbb027201fe2cd24c4a0e70e3cba53818341`

## Corrected durability state

`IDENTITY = PASS`

`AVAILABILITY = NOT PROVEN`

`REACHABILITY = NOT PROVEN`

The prior `7/30` upload sequence is non-authoritative as a progress checkpoint. Seven small unreferenced blobs were created during a noncanonical ~4 KB decomposition, but the branch never advanced. A later part-07 mismatch stopped the attempt fail-closed.

Do not resume part-07.

Do not describe the seven uploads as durable progress.

## Fresh-room source audit

At issue #2828 creation, fresh searches found no durable locator for the exact packet:

- no repository issue hit for full packet SHA-256;
- no repository issue hit for byte count `118560`;
- no repository code-search hit for full packet SHA-256;
- no packet/evidence commit on the bounded branch;
- zero workflow runs on the bounded branch;
- no matching packet file in current cross-chat File Library search.

Therefore current stop code:

`PACKET_SOURCE_NOT_DURABLY_LOCATED`

This is the only unresolved persistence question before any binary-ingress work.

## Exact next move for a fresh room

Read current `AI_ENTRYPOINT.json`, issue #2828, and this file.

Then answer only:

`WHERE_ARE_THE_EXACT_118560_PACKET_BYTES_DURABLY_ADDRESSABLE?`

A valid answer must name a concrete durable locator and allow fresh retrieval reproducing:

- byte count `118,560`
- SHA-256 `208510e35adbfa177d61f571c8b7fbb027201fe2cd24c4a0e70e3cba53818341`

Do not search broad history merely to find something with the same hash. Do not infer bytes from the hash. Do not reconstruct from the seven orphan blobs.

Once exact packet bytes are durably available:

`VERIFY PACKET`
→ `COMPUTE EXPECTED COMPLETE GIT BLOB SHA`
→ `USE ONE-CHUNK CANONICAL INGRESS SEMANTICS UNLESS A REAL SIZE LIMIT FAILS`
→ `VERIFY RETURNED BLOB SHA`
→ `TREE/COMMIT IMMEDIATELY`
→ `READ BACK FROM EXACT COMMIT`
→ `VERIFY BYTE COUNT + SHA-256 + GIT BLOB SHA`
→ `POST SUPERSEDING R3/R4/R5 CHECKPOINT`
→ `ADVANCE TO R6`

If the exact packet itself is no longer durably recoverable, recover the smallest exact constituent artifact set required to reproduce the same packet. Do not recapture/rebuild cinematic work unless those constituent bytes are genuinely unavailable.

## Governing ladder

`R0 CLOSED`
→ `R1 CLOSED`
→ `R2 CLOSED`
→ `R3/R4/R5 TECHNICALLY COMPLETE`
→ `R3/R4/R5 DURABILITY OPEN — PACKET_SOURCE_NOT_DURABLY_LOCATED`
→ `R6 NOT STARTED`

V1 remains hooked. This handoff creates no product/runtime/media/hook/deployment/publication authority.
