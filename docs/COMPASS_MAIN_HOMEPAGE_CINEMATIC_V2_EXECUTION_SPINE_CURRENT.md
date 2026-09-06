# Compass Main Homepage Cinematic — V2 Execution Spine

Status: **CURRENT / EXECUTION-GRADE COMPANION**  
Date: 2026-09-06  
Documentation freeze base: `c3b6d28fae21e3c6e1814e1ea4551ff46f72cddf`  
Current cinematic live baseline: `99025b828629548be1ea066cd2e01dd16d855a03`

This file is the execution companion to:

`docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_NEXT_HOOK_DIRECT_STRATEGY_20260906.md`

The direct strategy governs **what the corrected successor must be**. This file governs **how another room resumes and produces it without rediscovering, conflating surfaces, or inventing new infrastructure**.

If these files appear to conflict, stop at the conflict and resolve current repository authority. Do not silently reinterpret either document.

---

## 1. Non-negotiable surface separation

There are four distinct surfaces. Never collapse them into one.

### Surface A — successor capture source

This is where the V2 film is constructed.

Film-level corrections belong here, including:

- the repeated `TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT` grammar;
- the missing early image program;
- correct Audralia construction-time source selection;
- Mirrorland → Audralia continuity;
- Brain / Trophy / House timing;
- all other pre-rendered visual/copy timing inside the film.

### Surface B — immutable pre-rendered MP4

The MP4 is an output of Surface A.

It has no live runtime asset bindings.

**Semantic law:**

> `SOURCE BINDING` in successor-film documentation means **construction-time source selection used to render/capture the V2 master**. It does not mean changing a runtime binding inside the existing V1 MP4.

Therefore:

- do not "rebind" V1;
- do not patch V1 media bytes in place;
- do not overwrite the V1 master path during V2 construction;
- produce a new immutable V2 master with new byte/hash/Git-blob identity.

### Surface C — thin-player entry preroll

The recovered/evolved 4.35-second tessellation transition is interactive homepage runtime behavior and remains **outside** the MP4.

This surface owns:

- Play ignition;
- entry-surface tessellation / fragment migration;
- Compass/star emergence;
- MP4 first-frame readiness gate;
- zero-blank-frame handoff;
- Skip/Escape/reduced-motion/restoration behavior appropriate to the thin player.

Do not put this preroll into the V2 MP4 merely because it visually precedes the film.

### Surface D — production hook / publication

This surface decides what ordinary homepage entry consumes.

The current V1 hook remains production authority during V2 construction.

The intended production transition is:

`CURRENT_HOOK_V1 → CORRECTED_HOOK_V2`

not:

`CURRENT_HOOK_V1 → NO_HOOK → CORRECTED_HOOK_V2`

unless a separate concrete production failure requires emergency rollback.

---

## 2. Current immutable V1 baseline

PR #2801 is the current cinematic publication baseline.

Merge commit:

`99025b828629548be1ea066cd2e01dd16d855a03`

Current production master:

`assets/compass/cinematic-media/compass-main-orientation-final-v1.mp4`

Frozen identity:

- bytes: `3,828,177`
- SHA-256: `6ada38eadeb6243b3809167f45dd8a74808c88ac677273683338772e7899b4e7`
- Git blob: `ca95d7c17ef54044a11bc456a949c33fa9820bc0`
- runtime: `38.0 s`

Current production player:

`assets/compass/compass.orientation-cinematic.js`

Current player contract:

`COMPASS_PRERENDERED_THIN_PLAYER_T12_v1`

Later unrelated `main` changes do not redefine this cinematic identity. Resolve current `main` at execution time and revalidate these exact cinematic identities before mutation.

---

## 3. Proven construction/capture donor — use as precedent, not as current source authority

The successful deterministic single-master capture surface exists at historical source commit:

`96c89ec797490a5dc0e3dd343f4d34a396adaa02`

Key donor paths:

- `preview/compass/single-master-traversal/index.html`
- `assets/compass/cinematic-master/master-source.mjs`

These paths are historical donor authority. They are **not guaranteed to exist on current `main`** and must not be assumed present there.

The historical source froze this 38-second shot envelope:

| Shot | Beat | Historical window |
|---|---|---:|
| S01 | Arrival | 0–4.5 s |
| S02 | Orientation | 4.5–9.5 s |
| S03 | Chapter One | 9.5–14.5 s |
| S04 | Choice / Readiness | 14.5–19.5 s |
| S05 | Threshold | 19.5–25.5 s |
| S06 | Elsewhere | 25.5–30.5 s |
| S07 | Breadth / Engagement | 30.5–34.0 s |
| S08 | Return / Handoff | 34.0–38.0 s |

That donor successfully established:

- one deterministic master clock;
- time-addressable capture via `renderAt(timeMs)`;
- a capture-ready handshake;
- accepted-primary / accepted-final renderer reuse;
- separate donor presentations for Mirrorland, Audralia, Brain, Trophy, and House;
- deterministic full-frame capture compatibility.

But the donor also contains the source decisions now known to be wrong for Audralia/Mirrorland. Therefore:

> **Do not wholesale cherry-pick or restore the T6 source as V2. Reuse the proven architecture and capture semantics while replacing the confirmed defective construction-time subjects.**

Historical donor identity is evidence of how to build/capture, not authority to reuse every historical visual source.

---

## 4. Source-authority freeze before V2 construction

Before changing the successor capture source, resolve and persist exact current source authority for every corrected subject.

For Audralia this is mandatory because the V1 film selected a retired river experiment.

At this documentation freeze, the live route exists under:

`showroom/globe/audralia/`

and current-main identities include:

- `showroom/globe/audralia/index.html` → blob `96bf20a3189182683bc94c08e2ad7c0dba740f07`
- `showroom/globe/audralia/index.js` → blob `9be7c8e1fca28fa4395d74b8d1e4151066e82ffa`

These two identities prove the current route state at the documentation freeze; they do **not** by themselves declare which subordinate module is the complete render authority.

Required V2 rule:

1. resolve the current live Audralia render composition once at V2 construction time;
2. persist exact repository head + path(s) + blob identity/identities that materially determine the world appearance used by the film;
3. use that same frozen world state for both:
   - the Audralia visible through the Mirrorland reveal; and
   - the subsequent full Audralia shot;
4. do not switch world state between those two shots;
5. do not mutate the live Audralia runtime merely to make the cinematic easier to render.

If `main` moves after the source freeze, do not silently substitute newer world bytes mid-master. Either preserve the frozen V2 source set or explicitly re-freeze and recapture the affected evidence.

---

## 5. Historical entry-transition authority

Two repository precedents establish the interaction.

### PR #2697 — original independent successor grammar

Recovered Begin sequence:

- `0–140 ms` — CONFIRM
- `140–820 ms` — TESSELLATE
- `820–1750 ms` — DISINTEGRATE
- `1350–2300 ms` — STARFIELD_FORM
- `1700–3550 ms` — COMPASS_FORM
- `3550–4350 ms` — SETTLE

Governing law:

`SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER`

Blank-frame allowance:

`0`

### PR #2743 — restored production implementation

Exact candidate head:

`589b50d8178539b3241ad42315e4a38120040522`

Historical production host:

`assets/compass/compass.orientation-cinematic.js`

Recovered implementation includes the established entry tessellation behavior and exact 4.35-second preroll outside the 38-second film. The first S01 frame was rendered before the entry surface was hidden.

For V2, adapt this historical interaction to the current thin-player architecture. Do not recreate the behavior from memory when repository implementation exists.

The successor evolution frozen by the direct strategy is:

`SOURCE_CELL_DISAPPEARS ↔ MATCHING_FRAGMENT_BECOMES_MOBILE`

That is an intentional V2 refinement of the historical interaction, not evidence that the historical implementation pixelated the entire homepage.

---

## 6. Proven deterministic frame → MP4 procedure

The V1 master was successfully produced by the T9/T10 deterministic path.

T10 evidence:

- PR #2796 — temporary encode carrier, closed unmerged;
- candidate head: `0ebae96adbf9455c2a5d72ffc114eb7a49393c3c`;
- successful run: `34049018018`;
- output artifact: `9994017177`;
- artifact digest: `sha256:cdaee3bb3c95dda17030826dc0b3d63579c50d66a071414af1d9722c761c3ecf`.

The proven semantics were:

1. capture exactly `1,140` frames for 38.0 s at 30 fps;
2. independently hash/revalidate every frame against the frame manifest;
3. pin the Aquarium soundtrack authority;
4. encode twice from identical inputs;
5. require the two MP4s to be bit-identical;
6. require H.264 High, 1280×720, 30 fps CFR, yuv420p, limited-range BT.709, AAC-LC stereo 48 kHz, fast-start;
7. full-decode the candidate with zero errors;
8. emit exact output identity.

### Current-execution-policy correction

The current root `AI_ENTRYPOINT.json` explicitly prohibits using GitHub Actions as agent execution/transport.

Therefore:

> PR #2796 is **proven encode semantics and evidence**, not standing permission for a future room to manually dispatch or recreate that Actions carrier.

For V2, run the same deterministic capture/encode semantics on the current authorized execution surface named by `AI_ENTRYPOINT.json` (native/connected tooling, authorized disposable builder/Codespace, or other permitted exact-head substrate).

Do not create a new workflow merely because the historical encode used one.

If the authorized execution substrate cannot presently perform the deterministic encode, report that execution boundary. Do not redesign the film, renderer, or binary format to work around an execution-carrier limitation.

---

## 7. Proven binary custody / Git ingress

Binary ingress is a solved design problem in this repository.

Current installed adapter:

`tools/ai-room-transport/bounded-binary-file-ingress.v1.mjs`

Current-main blob at this documentation freeze:

`54df8ad719066e468cf98843bbf1943b3153e4b3`

Properties:

- manifest schema `BOUNDED_BINARY_OBJECT_TRANSFER_MANIFEST_v1`;
- default chunk size `524,288` bytes;
- exact expected-target-head guard;
- `transfer/*` branch requirement;
- normalized repository-relative destination.

Current installed reconstruction/carrier implementation:

`tools/ai-room-transport/bounded-binary-object-transfer.v1.mjs`

Current-main blob at this documentation freeze:

`da3ec08f5fc9af71c72bba660a7871c3a7dd3f1f`

Properties:

- validates each chunk byte count, SHA-256, and Git-blob identity;
- reconstructs exact full bytes;
- verifies final SHA-256;
- creates and reads back the final Git blob;
- uses exact-head compare-and-swap semantics;
- rejects `main`, `master`, and `gh-pages` as transfer targets;
- verifies final destination identity;
- creates no merge/deployment/product-semantic authority.

Historical precedent:

- PR #1334 installed the file-ingress adapter.
- Issue #1323 records the bounded carrier invocation contract and operational proof.
- PR #1340 proved the temporary credential/file-co-location staging pattern for Chapter One.
- PR #2798 reused the same pattern for the V1 Compass master: exact T10 artifact → exact MP4 verification → eight bounded chunks → closed manifest.
- PR #2799 executed the unchanged installed carrier semantics when the historical trigger surface had drifted, yielding the exact final V1 Git blob.

### Governing ingress law

> **Credential/file co-location failure is not evidence that the approved binary must be regenerated or supplied by the owner.**

If a verified V2 MP4 exists but the active connector cannot ingest its mounted bytes directly:

1. prefer a current authorized file-capable/native ingress path;
2. otherwise run the already-installed bounded adapter/carrier semantics on an execution surface permitted by the current AI entrypoint;
3. preserve exact bytes, SHA-256, expected Git blob, transfer-branch guard, and destination readback;
4. do not ask the owner to upload/re-send the V2 master merely to solve repository custody;
5. do not invent a second binary-transfer architecture.

Historical temporary Actions stagers demonstrate the solved transport pattern but do not override the current prohibition on Actions as agent execution. Reuse the semantics through an authorized substrate unless a later repository authority explicitly permits replay.

---

## 8. Proven publication boundary

PR #2801 established the V1 bounded homepage publication.

Exact V1 candidate:

`1afdb58c4ac40f602e2c67f6988fd276a1b710e2`

Merge:

`99025b828629548be1ea066cd2e01dd16d855a03`

The PR explicitly treated publication as a separate boundary and instructed not to reopen encode/renderer/transfer infrastructure absent a concrete defect.

Current `AI_ENTRYPOINT.json` is controlling at execution time. At this documentation freeze it states:

- `BOUNDED_PAGE_RELEASE` does not require canonical operation intake;
- deployment capability: `PAGES_EXACT_HEAD_DEPLOY`;
- release sequence:
  `APPROVED_COMMIT → EXPLICIT_DEPLOYMENT → LIVE_EXACT_HEAD_VERIFICATION`;
- merge alone is **not** live release;
- Vercel is non-authoritative for this site’s release gate.

For V2, do not infer publication from merge. Verify the exact accepted successor head through the current AI-entry publication contract and live fetchback.

---

## 9. Anti-reinvention precedent

PR #2754 is the controlling anti-escalation precedent for this cinematic program. It incorporates:

- PR #2684 — bounded cinematic may be published for owner inspection with explicit rollback/waiver where appropriate;
- PR #2697 — noninteractive cinematic qualification is focused on relevant controls and focused smoke, not a full application matrix;
- PR #2713 — cinematic-scoped noninteractive playback can be proportionally classified as `BOUNDED_PAGE_RELEASE`;
- PR #2751 — compare a materially improved bounded candidate against the known-deficient baseline; do not construct a separate execution environment merely to eliminate residual uncertainty;
- PR #2752 / #2753 — cinematic activation is independently hookable/reversible.

Do not create, merely to finish V2:

- a new generic Playwright/browser substrate;
- a new CI workflow for agent execution;
- a new control-plane bridge;
- a new binary-transfer architecture;
- a new cinematic player architecture;
- a new Mirrorland interior environment;
- a new Audralia approximation;
- a new manifest-driven renderer abstraction not already required by the existing build.

A documentation timing/source map is allowed and useful. It does not become a new runtime/build system unless separately justified.

---

## 10. First-unpassed-state execution ladder

A new room must resume only the **first state without exact durable evidence**.

Do not repeat completed states merely because conversation context is absent.

### R0 — CURRENT STATE / DOCUMENT AUTHORITY

Required evidence:

- current `main` resolved;
- this execution spine and direct strategy located;
- current V1 hook/master identities revalidated;
- latest owner disposition checked.

Pass result:

`R0_CURRENT_STATE_CLOSED`

### R1 — V2 SOURCE AUTHORITY FREEZE

Required evidence:

- exact current source authority for every corrected visual subject;
- exact Audralia head/path/blob set frozen;
- same Audralia authority assigned to Mirrorland reveal and subsequent Audralia shot;
- retired river-model source explicitly excluded.

Pass result:

`R1_SOURCE_AUTHORITY_CLOSED`

### R2 — V2 EDITORIAL / SHOT MAP FREEZE

Required evidence:

- beat-by-beat `TEXT_IN`, `IMAGE_IN`, `TEXT_OUT`, `IMAGE_OUT` ordering;
- image carry/overlap explicitly closed;
- no early text-only desert;
- no late deferred-image pileup;
- Brain/Trophy/House breathing room protected;
- Mirrorland→Audralia continuity specified.

This may be a documentation ledger. Do not invent a new renderer schema just to represent it.

Pass result:

`R2_EDITORIAL_MAP_CLOSED`

### R3 — V2 CAPTURE SOURCE

Required evidence:

- deterministic capture source constructed using the proven T6 capture architecture as donor/reference;
- confirmed defective Audralia/Mirrorland historical donor choices removed;
- protected live runtimes remain read-only;
- capture source is time-addressable and deterministic.

Pass result:

`R3_CAPTURE_SOURCE_READY`

### R4 — REPRESENTATIVE VISUAL EVIDENCE

Inspect a small, high-value set before full capture:

- first story beat showing correct text→image grammar;
- an early beat proving the text-only desert is gone;
- Mirrorland reveal with Audralia visible;
- full Audralia shot from the same frozen world state;
- Brain;
- Trophy;
- House;
- final handoff.

Pass result:

`R4_REPRESENTATIVE_VISUALS_ACCEPTED_FOR_CAPTURE`

This is not final owner acceptance of the whole film.

### R5 — FULL DETERMINISTIC FRAME CAPTURE

Required evidence:

- complete frame sequence at frozen dimensions/fps/duration;
- frame manifest;
- exact frame count;
- per-frame identities/hashes as required by the proven capture path;
- zero capture/page errors material to the film.

Pass result:

`R5_FULL_CAPTURE_PASS`

### R6 — NEW IMMUTABLE V2 MASTER

Required evidence:

- deterministic encode from R5 frames;
- duplicate encode equality or current equivalent deterministic proof;
- media contract/decode verification;
- new V2 filename/path;
- exact bytes;
- SHA-256;
- expected Git blob identity.

Pass result:

`R6_V2_MASTER_PRODUCED`

Never overwrite the V1 master during this state.

### R7 — V2 GIT BINARY CUSTODY

Required evidence:

- exact R6 MP4 materialized as a Git blob through the proven bounded ingress semantics;
- exact bytes/hash/blob readback;
- clean successor/release branch contains that exact object;
- temporary transport carriers, if any were separately authorized, remain non-product and unmerged.

Pass result:

`R7_V2_GIT_CUSTODY_CLOSED`

### R8 — THIN PLAYER V2 / ENTRY PREROLL INTEGRATION

Required evidence:

- recovered/evolved 4.35 s preroll integrated at the thin-player boundary;
- preroll remains outside MP4 runtime;
- first V2 frame decoded/presentable before final entry material clears;
- zero blank frame;
- player points to exact R7 V2 master;
- V1 production hook remains live while this successor is reviewed detached.

Pass result:

`R8_COMPLETE_SUCCESSOR_READY_FOR_REVIEW`

### R9 — FOCUSED QUALIFICATION + OWNER REVIEW

Changed-surface qualification only:

- Play;
- Skip during relevant preroll/playing states;
- Escape equivalence where retained;
- natural completion;
- reduced motion;
- audio ownership/restoration;
- focus/restoration;
- URL/history/analytics invariance;
- representative desktop/tablet/portrait presentation;
- no blank handoff;
- exact V2 media request;
- no material console/runtime error caused by successor;
- owner watches the complete successor.

Owner disposition:

`READY_FOR_NEXT_HOOK` or `CONTINUE_REFINEMENT`

Pass result only after explicit acceptance:

`R9_OWNER_ACCEPTED_FOR_HOOK`

### R10 — DIRECT V1 → V2 PUBLICATION

Required evidence:

- exact accepted successor commit/head;
- direct replacement with no routine interim unhook;
- current AI-entry publication sequence followed;
- explicit exact-head deployment;
- live exact-head verification;
- live HTML/JS/CSS/media fetchback proves V2 identities;
- rollback target remains known.

Pass result:

`R10_LIVE_V2_EXACT_HEAD_VERIFIED`

---

## 11. Resume algorithm for any room

When entering this program without conversation context:

1. read `AI_ENTRYPOINT.json` from current `main`;
2. read `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_SUCCESSOR_HANDOFF_CURRENT.md`;
3. read `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_NEXT_HOOK_DIRECT_STRATEGY_20260906.md`;
4. read this execution spine;
5. resolve current `main` and current V1 production identities;
6. locate durable evidence for R0→R10;
7. stop at the first state lacking exact evidence;
8. execute only that state;
9. persist its receipt/checkpoint before moving to the next state.

Do not reconstruct intent from conversation memory when repository authority exists.

Do not repeat an equivalent probe after it failed without new evidence; current AI-entry efficiency rules require a strategy change.

---

## 12. Durable checkpoint format

After each material state, persist enough information that another room can resume without inference:

```text
COMPASS_CINEMATIC_V2_CHECKPOINT

Repository main:
Successor branch/head:
Current live cinematic baseline:
Current live hook state:

Last closed state: R# / RESULT
First unresolved state: R#

Frozen source authorities:
- subject → head / path / blob

Editorial map identity:
Capture source identity:
Frame evidence identity:
Master filename:
Master bytes:
Master SHA-256:
Master Git blob:

Thin-player/preroll candidate identity:
Qualification actually performed:
Owner disposition:

Known defects still open:
- ...

Next exact move:
- ...
```

Do not fill fields with assumptions. Use `NOT_YET_PRODUCED` / `NOT_YET_REVIEWED` where appropriate.

---

## 13. Uploaded-video evidence boundary

Owner recordings are high-value perceptual evidence and may establish visible defects.

They are not required construction dependencies once a defect/source decision is made durable in the repository.

Do not block V2 because a later room cannot access an earlier chat upload. Use repository-resident decisions and current source authority. Request a video again only when a specific unresolved perceptual question genuinely cannot be answered from durable evidence/current source.

---

## 14. One-line operating law

`READ CURRENT AUTHORITY → RESUME FIRST UNPASSED STATE → USE PROVEN CAPTURE/ENCODE/INGRESS/PUBLICATION SEMANTICS → NEVER PATCH V1 AS IF IT HAD LIVE ASSET BINDINGS → KEEP V1 LIVE UNTIL OWNER-ACCEPTED V2 IS READY → DIRECT V1→V2 HOOK`
