# Compass Main Homepage Cinematic — V2 Execution Spine

Status: **CURRENT / EXECUTION-GRADE COMPANION**  
Date: 2026-09-06  
Current cinematic live baseline: `99025b828629548be1ea066cd2e01dd16d855a03`

This file is the execution companion to:

`docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_NEXT_HOOK_DIRECT_STRATEGY_20260906.md`

The direct strategy governs **what the corrected successor must be**. This file governs **how another room resumes and produces it without rediscovering, conflating surfaces, defaulting to a named execution environment, or inventing new infrastructure**.

For execution-route selection, also read:

`docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_EXECUTION_ROUTE_CLARIFICATION.md`

That clarification supersedes any historical/example transport wording. The governing rule is capability-first, not environment-first.

---

## D0. Documentation adoption gate — before R0

The V2 documentation must be adopted to `main` before the production ladder begins.

For a `STATIC_EDITORIAL_MICRO` documentation candidate, D0 closes only when the repository-required static-editorial verifier returns PASS against the exact base/head and declared documentation paths.

Required result:

`D0_STATIC_EDITORIAL_VERIFIER_PASS`

The authoritative target is the verifier PASS, **not a particular place to run it**.

Execution route:

`REQUIRED EVIDENCE → CURRENT AI_ENTRYPOINT → CURRENT ROOM'S ALREADY-AUTHORIZED CAPABILITIES → EXECUTE IF DIRECTLY AVAILABLE → OTHERWISE RECORD EXACT CAPABILITY BOUNDARY AND STOP`

Do not turn a repository-acquisition or network failure into an instruction to open/create/move to a particular workspace, builder, clone, workflow, CI carrier, or bridge.

If a current room cannot execute the verifier against the exact repository state, preserve the exact failure once, keep D0 unresolved, and stop. A later room resumes D0 and resolves whatever authorized capability actually exists there.

Passive CI is not a substitute for the required verifier unless current repository authority explicitly says it is.

---

## 1. Non-negotiable surface separation

There are four distinct surfaces. Never collapse them into one.

### Surface A — successor capture source

This is where the V2 film is constructed.

Film-level corrections belong here, including:

- repeated `TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT` grammar;
- missing early imagery;
- correct Audralia construction-time source selection;
- Mirrorland → Audralia continuity;
- Brain / Trophy / House timing;
- all other pre-rendered visual/copy timing inside the film.

### Surface B — immutable pre-rendered MP4

The MP4 is an output of Surface A. It has no live runtime asset bindings.

`SOURCE BINDING` means construction-time source selection used to render/capture V2. It does not mean changing a runtime binding inside V1.

Therefore:

- do not rebind V1;
- do not patch V1 media bytes in place;
- do not overwrite the V1 master path during V2 construction;
- produce a new immutable V2 master with new byte/hash/Git-blob identity.

### Surface C — thin-player entry preroll

The recovered/evolved 4.35-second tessellation transition is interactive homepage runtime behavior and remains outside the MP4.

This surface owns:

- Play ignition;
- entry-surface tessellation / fragment migration;
- Compass/star emergence;
- MP4 first-frame readiness gate;
- zero-blank-frame handoff;
- Skip/Escape/reduced-motion/restoration behavior appropriate to the thin player.

### Surface D — production hook / publication

This surface decides what ordinary homepage entry consumes.

The current V1 hook remains production authority during V2 construction.

Target:

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

Current player:

`assets/compass/compass.orientation-cinematic.js`

Current player contract:

`COMPASS_PRERENDERED_THIN_PLAYER_T12_v1`

Later unrelated `main` changes do not redefine this cinematic identity. Resolve current `main` at execution time and revalidate these exact cinematic identities before mutation.

---

## 3. Proven construction/capture donor — architecture precedent only

Historical deterministic single-master capture authority:

`96c89ec797490a5dc0e3dd343f4d34a396adaa02`

Key donor paths:

- `preview/compass/single-master-traversal/index.html`
- `assets/compass/cinematic-master/master-source.mjs`

The donor established:

- one deterministic master clock;
- time-addressable capture via `renderAt(timeMs)`;
- capture-ready handshake;
- accepted-primary/final renderer reuse;
- deterministic full-frame capture compatibility.

Historical 38-second envelope:

| Shot | Beat | Window |
|---|---|---:|
| S01 | Arrival | 0–4.5 s |
| S02 | Orientation | 4.5–9.5 s |
| S03 | Chapter One | 9.5–14.5 s |
| S04 | Choice / Readiness | 14.5–19.5 s |
| S05 | Threshold | 19.5–25.5 s |
| S06 | Elsewhere | 25.5–30.5 s |
| S07 | Breadth / Engagement | 30.5–34.0 s |
| S08 | Return / Handoff | 34.0–38.0 s |

The donor also contains the now-rejected Audralia/Mirrorland source choices.

Rule:

`REUSE CAPTURE ARCHITECTURE / DO NOT WHOLESALE RESTORE HISTORICAL VISUAL SOURCES`

---

## 4. Source-authority freeze before V2 construction

Before changing the capture source, resolve and persist exact current source authority for every corrected subject.

For Audralia:

1. resolve the current live render composition once;
2. persist exact repository head + materially determining path/blob identities;
3. use the same frozen world state inside the Mirrorland reveal and the succeeding full Audralia shot;
4. do not switch world state between those beats;
5. do not mutate live Audralia merely to simplify cinematic capture.

At the prior documentation freeze, route-level identities included:

- `showroom/globe/audralia/index.html` → `96bf20a3189182683bc94c08e2ad7c0dba740f07`
- `showroom/globe/audralia/index.js` → `9be7c8e1fca28fa4395d74b8d1e4151066e82ffa`

Those are historical freeze evidence only. Re-resolve current authority at R1.

If `main` moves after source freeze, do not silently substitute newer bytes mid-master. Preserve the frozen set or explicitly re-freeze and recapture affected evidence.

---

## 5. Historical entry-transition authority

PR #2697 establishes:

- `0–140 ms` — CONFIRM
- `140–820 ms` — TESSELLATE
- `820–1750 ms` — DISINTEGRATE
- `1350–2300 ms` — STARFIELD_FORM
- `1700–3550 ms` — COMPASS_FORM
- `3550–4350 ms` — SETTLE

Historical law:

`SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER`

Blank-frame allowance:

`0`

PR #2743 candidate:

`589b50d8178539b3241ad42315e4a38120040522`

The recovered production implementation kept the 4.35-second preroll outside the 38-second film and rendered the first successor frame before hiding the entry surface.

For V2, reuse repository authority rather than reconstructing from memory.

Successor refinement:

`SOURCE_CELL_DISAPPEARS ↔ MATCHING_FRAGMENT_BECOMES_MOBILE`

---

## 6. Proven deterministic frame → MP4 semantics

V1 T9/T10 precedent proves the deterministic procedure.

T10 evidence:

- PR #2796;
- candidate `0ebae96adbf9455c2a5d72ffc114eb7a49393c3c`;
- run `34049018018`;
- artifact `9994017177`.

Proven semantics:

1. exactly 1,140 frames for 38.0 s at 30 fps;
2. frame-manifest revalidation;
3. pinned Aquarium soundtrack authority;
4. duplicate encode from identical inputs;
5. bit-identical outputs;
6. H.264 High, 1280×720, 30 fps CFR, yuv420p, limited-range BT.709, AAC-LC stereo 48 kHz, fast-start;
7. full decode with zero errors;
8. exact output identity.

Historical workflow transport is not standing authority.

For V2, preserve these deterministic semantics using whichever **already-authorized capability is actually available under current `AI_ENTRYPOINT.json`**.

Do not prescribe or create an execution environment merely because the historical run used one or because another room lacked network acquisition.

If the current room cannot perform the required encode proof, preserve the exact capability boundary and leave the state unresolved. Do not redesign the film or binary format around the transport limitation.

---

## 7. Proven binary custody / Git ingress semantics

Binary ingress is solved design precedent.

Installed adapter:

`tools/ai-room-transport/bounded-binary-file-ingress.v1.mjs`

Installed reconstruction/carrier:

`tools/ai-room-transport/bounded-binary-object-transfer.v1.mjs`

Historical precedent:

- PR #1334;
- issue #1323;
- PR #1340;
- PR #2798;
- PR #2799.

Governing law:

`CREDENTIAL/FILE CO-LOCATION FAILURE ≠ REGENERATE MASTER ≠ ASK OWNER TO RESUPPLY MASTER`

If a verified V2 MP4 exists but the current room cannot ingest the bytes directly:

1. resolve current `AI_ENTRYPOINT.json`;
2. inspect already-authorized file-capable/native/connected capabilities actually available now;
3. use the installed bounded ingress semantics if an existing authorized capability can execute them;
4. preserve exact bytes, SHA-256, expected Git blob, branch guard, and destination readback;
5. otherwise stop on `R7_EXECUTION_CAPABILITY_UNAVAILABLE`;
6. do not invent a second transfer architecture or prescribe a specific environment.

---

## 8. Proven publication boundary

PR #2801 established the V1 bounded homepage publication.

V1 candidate:

`1afdb58c4ac40f602e2c67f6988fd276a1b710e2`

Merge:

`99025b828629548be1ea066cd2e01dd16d855a03`

Current `AI_ENTRYPOINT.json` is controlling at publication time.

At the prior freeze it specified:

`APPROVED_COMMIT → EXPLICIT_DEPLOYMENT → LIVE_EXACT_HEAD_VERIFICATION`

with `PAGES_EXACT_HEAD_DEPLOY` as the registered deployment capability.

Merge alone is not publication.

Do not infer publication transport from historical runs; resolve the currently registered capability from current repository authority.

---

## 9. Anti-reinvention / capability-first rule

PR #2754 remains controlling anti-escalation precedent.

Do not create merely to finish V2:

- a new generic browser substrate;
- a new CI workflow for agent execution;
- a new control-plane bridge;
- a new binary-transfer architecture;
- a new cinematic player architecture;
- a new Mirrorland interior environment;
- a new Audralia approximation;
- a new renderer abstraction not already required by the build;
- a new execution environment merely because the current room lacks one capability.

The strategy names evidence and semantics. It does not assign infrastructure.

Capability resolution happens at execution time from current `AI_ENTRYPOINT.json` and current room tools.

---

## 10. First-unpassed-state execution ladder

Resume only the first state without exact durable evidence.

### R0 — CURRENT STATE / DOCUMENT AUTHORITY

Required evidence:

- D0 already closed on `main`;
- current `main` resolved;
- controlling strategy/spine/handoff located;
- current V1 identities revalidated;
- latest owner disposition checked.

Pass:

`R0_CURRENT_STATE_CLOSED`

### R1 — V2 SOURCE AUTHORITY FREEZE

Required evidence:

- exact current source authority for every corrected subject;
- exact Audralia head/path/blob set;
- same Audralia authority assigned to Mirrorland reveal + full Audralia shot;
- retired river-model source excluded.

Pass:

`R1_SOURCE_AUTHORITY_CLOSED`

### R2 — V2 EDITORIAL / SHOT MAP FREEZE

Required evidence:

- beat-by-beat `TEXT_IN`, `IMAGE_IN`, `TEXT_OUT`, `IMAGE_OUT`;
- image carry/overlap closed;
- no early text-only desert;
- no late image pileup;
- Brain/Trophy/House breathing room protected;
- Mirrorland→Audralia continuity specified.

Pass:

`R2_EDITORIAL_MAP_CLOSED`

### R3 — V2 CAPTURE SOURCE

Required evidence:

- deterministic capture source using proven donor architecture;
- rejected historical Audralia/Mirrorland sources removed;
- protected live runtimes read-only;
- source time-addressable/deterministic.

Pass:

`R3_CAPTURE_SOURCE_READY`

### R4 — REPRESENTATIVE VISUAL EVIDENCE

Inspect:

- first correct text→image beat;
- an early beat proving text-only desert is gone;
- Mirrorland reveal;
- full Audralia shot from same frozen world;
- Brain;
- Trophy;
- House;
- final handoff.

Pass:

`R4_REPRESENTATIVE_VISUALS_ACCEPTED_FOR_CAPTURE`

### R5 — FULL DETERMINISTIC FRAME CAPTURE

Required evidence:

- complete frame sequence;
- frame manifest;
- exact frame count;
- per-frame identities/hashes;
- zero material capture/page errors.

Pass:

`R5_FULL_CAPTURE_PASS`

### R6 — NEW IMMUTABLE V2 MASTER

Required evidence:

- deterministic encode from R5;
- duplicate equality/current equivalent deterministic proof;
- media/decode verification;
- new V2 path;
- exact bytes, SHA-256, expected Git blob.

Pass:

`R6_V2_MASTER_PRODUCED`

Never overwrite V1.

### R7 — V2 GIT BINARY CUSTODY

Required evidence:

- exact R6 MP4 materialized as Git blob through proven bounded semantics;
- bytes/hash/blob readback;
- clean successor/release branch contains exact object.

Pass:

`R7_V2_GIT_CUSTODY_CLOSED`

### R8 — THIN PLAYER V2 / ENTRY PREROLL

Required evidence:

- recovered/evolved 4.35 s preroll;
- preroll outside MP4 runtime;
- first V2 frame decoded/presentable before final entry material clears;
- zero blank frame;
- player requests exact R7 master;
- V1 remains live while successor is reviewed detached.

Pass:

`R8_COMPLETE_SUCCESSOR_READY_FOR_REVIEW`

### R9 — FOCUSED QUALIFICATION + OWNER REVIEW

Changed-surface qualification only:

- Play;
- Skip in relevant states;
- Escape equivalence where retained;
- natural completion;
- reduced motion;
- audio ownership/restoration;
- focus/restoration;
- URL/history/analytics invariance;
- representative desktop/tablet/portrait presentation;
- no blank handoff;
- exact V2 media request;
- no material successor-caused runtime error;
- owner watches complete successor.

Owner disposition:

`READY_FOR_NEXT_HOOK` or `CONTINUE_REFINEMENT`

Pass only after explicit acceptance:

`R9_OWNER_ACCEPTED_FOR_HOOK`

### R10 — DIRECT V1 → V2 PUBLICATION

Required evidence:

- exact accepted successor head;
- direct replacement with no routine interim unhook;
- current AI-entry publication sequence;
- explicit exact-head deployment;
- live exact-head verification;
- live fetchback proves V2 identities;
- rollback target known.

Pass:

`R10_LIVE_V2_EXACT_HEAD_VERIFIED`

---

## 11. Resume algorithm

When entering without conversation context:

1. read current `AI_ENTRYPOINT.json`;
2. read current handoff;
3. read direct strategy;
4. read this execution spine;
5. read execution-route clarification;
6. determine whether D0 is closed on `main`;
7. if not, resume D0 only;
8. if yes, resolve current V1 identities and durable R0→R10 evidence;
9. stop at first unresolved state;
10. execute only that state using an already-authorized capability actually available now;
11. persist checkpoint before advancing.

Do not reconstruct intent from chat memory when repository authority exists.

Do not repeat equivalent failed probes without new evidence.

Do not name an environment as the next step unless current repository authority explicitly makes that environment the capability contract itself.

---

## 12. Durable checkpoint

```text
COMPASS_CINEMATIC_V2_CHECKPOINT

Repository main:
Successor branch/head:
Current live cinematic baseline:
Current live hook state:

D0 state:
Last closed R-state:
First unresolved state:

Required evidence for unresolved state:
Authorized capability actually used:
Exact failure if capability unavailable:

Frozen source authorities:
Editorial map identity:
Capture source identity:
Frame evidence identity:
Master filename:
Master bytes:
Master SHA-256:
Master Git blob:
Thin-player/preroll identity:
Qualification actually performed:
Owner disposition:
Known defects still open:
Next exact evidence requirement:
```

Use `NOT_YET_PRODUCED` / `NOT_YET_REVIEWED` where appropriate. Do not fill fields with assumptions.

---

## 13. Uploaded-video boundary

Owner recordings are high-value perceptual evidence but are not permanent construction dependencies once findings are durable.

Do not block V2 because an earlier chat upload is unavailable. Request video again only for a specific unresolved perceptual question that cannot be answered from durable evidence/current source.

---

## 14. One-line law

`NO DEFAULT SUBSTRATE → RESOLVE CURRENT AUTHORITY/CAPABILITIES → CLOSE ONLY THE REQUIRED EVIDENCE → RESUME FIRST UNPASSED STATE → KEEP V1 LIVE → DIRECT V1→V2 HOOK`
