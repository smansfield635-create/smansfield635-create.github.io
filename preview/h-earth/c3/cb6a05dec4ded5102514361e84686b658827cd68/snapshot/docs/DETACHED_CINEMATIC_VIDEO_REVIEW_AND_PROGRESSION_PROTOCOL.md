# Detached Cinematic Video Review and Production Progression Protocol

Status: **ACTIVE PRODUCTION PRACTICE**  
Date: 2026-09-06

## Purpose

This protocol gives any new room a deterministic path from a user-supplied cinematic recording to a bounded repository change without turning visual refinement into an unnecessary infrastructure project.

It applies to Compass and to future page-intro films, cinematic overlays, pre-rendered presentation layers, and repeated owner-review video cycles.

The governing principle is:

> **Use the video to decide what is wrong, preserve those findings durably, bind only the smallest correction, and close required evidence by composing already-authorized capabilities before declaring a blocker.**

This protocol does not create runtime authority, deployment authority, or a new governance class. Current `AI_ENTRYPOINT.json` and project-specific repository authority remain controlling.

Companion ingress rule:

`docs/COMPASS_CINEMATIC_VIDEO_ROOM_INGRESS_BOUNDARY.md`

---

## 1. Reusable precedent

The following merged precedents control bounded cinematic work.

- **PR #2684** — a bounded cinematic may be published for live owner inspection with disclosed residual uncertainty and rollback; missing nonessential qualification is not automatically an infrastructure project.
- **PR #2697** — noninteractive cinematic qualification is centered on relevant controls, passage integrity, reduced motion, and focused smoke rather than a full application matrix.
- **PR #2713** — cinematic-scoped noninteractive playback can be `BOUNDED_PAGE_RELEASE`; navigation, routing, shared application state, analytics, controller authority, or ambiguity remain heavier classes.
- **PR #2751** — compare against the known-deficient baseline; do not delay a materially improved bounded candidate merely to eliminate every theoretical uncertainty.
- **PR #2752 / #2753** — cinematic construction and production activation are separable and reversible.
- **PR #2809 / merge `34fb82ae090bb7e2f40d6cd4c79eaf35d26e26ea`** — capability resolution is not environment-first. Required evidence may be closed by lawful composition of already-authorized capabilities when exact identity and canonical instrument semantics are preserved.

---

## 2. Production-state law

Use the actual owner disposition and current production state. Do not assume that refinement always requires an unhook.

Common states include:

- `INTRO_PRESENT_BUT_UNHOOKED` — cinematic exists but ordinary visitors enter the page directly.
- `INTRO_HOOKED_LIVE` — ordinary entry mounts the cinematic.
- `INTRO_REVIEW_PATCH_IN_PROGRESS` — targeted refinement is underway.
- `SUCCESSOR_DETACHED_WHILE_CURRENT_HOOK_REMAINS_LIVE` — an accepted current film stays live while a corrected successor is built and reviewed separately.

The production state is a repository fact plus owner disposition, not a protocol default.

Do not hook, unhook, or replace a film merely because a code or media change is complete. Activation is a separate owner-facing publication decision.

---

## 3. Video ingress and room-budget law

A review video is not automatically a repository asset and is not assumed to travel across rooms.

When a new recording is needed for a perceptual question:

1. use a room that can actually receive and inspect the recording;
2. review the video before broad repository inspection;
3. persist the material findings, timecodes, accepted strengths, and required corrections durably;
4. after those findings are durable, do not make later construction depend on continued access to that same chat attachment unless a new perceptual question genuinely requires it.

No room may claim a video is attached unless it is actually available in that room.

However, once a finding has been durably converted into a repository-resident defect/source/acceptance decision, absence of the original recording in a later room is **not** itself a blocker.

Request the video again only when the unresolved question is perceptual and cannot be answered from durable findings, current source, or new rendered evidence.

---

## 4. Video-first review law

When a recording is supplied, review it end to end before broad source retrieval.

Use the video as primary evidence for:

- pacing;
- composition;
- readability;
- transitions;
- object identity;
- continuity;
- visual hierarchy;
- dead time;
- abrupt cuts;
- weak or incorrect scenes;
- responsive framing visible in the recording;
- whether the candidate is materially better than the current baseline.

Produce a bounded defect list with timecodes before inspecting source.

Example:

| ID | Timecode | Observation | Severity | Desired correction |
| --- | --- | --- | --- | --- |
| V01 | 08.4–10.1 s | subject too small / unreadable | material | enlarge and hold longer |
| V02 | 19.7 s | transition snaps | material | preserve outgoing geometry into successor |
| V03 | 31–34 s | pacing drags | refinement | shorten hold by ~1 s |

Do not start with workflows, browser infrastructure, control-plane history, or a whole-estate audit.

---

## 5. Minimal source-binding law

For each accepted finding:

1. identify the visible defect and timecode;
2. identify the responsible shot/beat;
3. identify the current governing source for that beat;
4. identify the smallest function, constant, geometry block, timing interval, media source, or copy string that controls it;
5. identify protected authorities that must remain untouched;
6. make the smallest coherent correction.

Prefer:

`ONE FINDING → ONE SOURCE AUTHORITY → ONE BOUNDED CORRECTION`

For pre-rendered media, “source binding” means construction-time source selection for the successor master, not runtime rebinding of an already encoded MP4.

---

## 6. Production acceptance standard

A cinematic revision may advance when:

1. it materially improves the observed problem;
2. the change is bounded to the intended cinematic/presentation surface;
3. no catastrophic regression is observed or proven;
4. the underlying page remains recoverable;
5. current activation state and rollback semantics remain controlled;
6. required repository evidence for the changed surface is actually closed.

Perfection is not the acceptance standard.

The question is:

> **Is this revision materially better, bounded, and sufficiently evidenced to become the next review baseline?**

---

## 7. Proportional verification ladder

Use the lowest verification level that answers the uncertainty introduced by the patch.

### Level A — source/exact-head verification

Use for copy, timing constants, bounded geometry, source identity, camera parameters, known index errors, presentation-only state, cache identity, and documentation-only changes.

### Level B — focused visual/runtime smoke

Use for layout, scene fit, responsive framing, transition continuity, media handoff, Play/Skip/Replay, reduced motion, focus/restoration, and similar changed-surface behavior.

### Level C — broader runtime qualification

Use only when the change actually touches or plausibly changes navigation, routing, shared application state, controllers, gestures, shared DOM ownership, analytics, or another protected runtime authority.

Do not create a new Playwright substrate, workflow, control-plane bridge, renderer framework, binary-transfer architecture, or full device matrix solely to approve an ordinary bounded cinematic revision.

---

## 8. Capability-composition law

A room must not declare `NO_DIRECT_CAPABILITY` merely because no single tool can perform every step.

The governing resolution sequence is:

`REQUIRED_EVIDENCE`
→ `READ_CURRENT_AI_ENTRYPOINT`
→ `INVENTORY_ALL_ALREADY-AUTHORIZED_AVAILABLE_CAPABILITIES`
→ `DECOMPOSE_THE_EVIDENCE_TASK_BY_FUNCTION`
→ `COMPOSE_CAPABILITIES_WHEN_EXACT_IDENTITY_AND_CANONICAL_SEMANTICS_ARE_PRESERVED`
→ `EXECUTE_CANONICAL_INSTRUMENT_UNCHANGED`
→ `ACCEPT_ONLY_ITS_ACTUAL_RESULT`
→ `STOP_ONLY_IF_NO_LAWFUL_COMPOSITION_CAN_CLOSE_THE_EVIDENCE`

Typical capability functions may be split across tools:

- exact commit/tree/blob retrieval;
- repository compare/diff resolution;
- file or binary acquisition;
- local filesystem materialization;
- command execution;
- browser/render execution;
- artifact inspection;
- repository mutation.

No one capability has to own the entire chain.

A lawful composition must satisfy all of the following:

1. each capability is already authorized for the function it performs;
2. exact immutable identities are preserved across the handoff;
3. transferred objects are independently hash/object-identity checked when materialized;
4. the canonical repository instrument is executed unchanged;
5. no PASS is synthesized, inferred, or reimplemented;
6. the composition creates no new standing infrastructure or authority.

### Proven reusable composition pattern

The static-editorial closure that adopted the Compass V2 documentation demonstrated one valid pattern:

`CONNECTED GITHUB EXACT OBJECT RETRIEVAL`
→ `LOCAL EXACT GIT OBJECT MATERIALIZATION`
→ `OBJECT HASH VERIFICATION`
→ `RUN REPOSITORY VERIFIER UNCHANGED`
→ `COMMAND-EMITTED PASS`

This pattern is reusable when the same capability split exists. It is **not** a mandatory environment, workspace, or transport.

A failure such as `Could not resolve host: github.com` proves only that the attempted network-acquisition path failed. It does not prove that exact repository objects cannot be acquired through another already-authorized capability and then handed to an existing execution capability.

---

## 9. Stop condition

Use `RECORD_EXACT_BOUNDARY_AND_STOP` only after capability composition has been considered, not before.

A legitimate stop requires all of the following:

- the exact required evidence is named;
- current repository authority has been read;
- available authorized capabilities have been inventoried by function;
- no lawful composition can preserve the required identity/instrument semantics;
- no later durable evidence has already closed the state;
- the exact missing capability/evidence boundary is recorded once.

Do not stop because the first attempted transport failed.

Do not create new infrastructure merely to avoid a legitimate stop.

---

## 10. Superseding-evidence precedence

A cold room must not treat the first blocker comment, checkpoint, or failed attempt it finds as controlling state.

For any resumable evidence state, resolve durable records in chronological and identity-aware order.

Governing law:

`LATEST_EXACT_SUPERSEDING_EVIDENCE > EARLIER_BLOCKER_OR_STOP_RECORD`

Before concluding that a state is blocked:

1. resolve the exact state identifier and candidate/head it concerns;
2. inspect later durable comments/checkpoints/receipts for the same state and exact identity;
3. honor explicit `supersedes`, terminal PASS, adoption, merge, publication, rollback, or other later state transitions;
4. reject a later record if it concerns a different candidate/head and does not explicitly rebind the state;
5. resume from the latest exact controlling evidence, not from stale intermediate history.

Example:

`D0_UNRESOLVED`
followed later by
`D0_STATIC_EDITORIAL_VERIFIER_PASS`
for the same exact base/candidate
means D0 is **closed**. A new room must not stop on the earlier D0 blocker.

---

## 11. Deterministic repeated-video loop

For each new recording or review cycle:

`WATCH`
→ `TIME-CODE FINDINGS`
→ `PERSIST FINDINGS`
→ `PRIORITIZE`
→ `BIND SOURCE`
→ `PATCH`
→ `RESOLVE REQUIRED EVIDENCE`
→ `COMPOSE AUTHORIZED CAPABILITIES IF NEEDED`
→ `NARROW VERIFY`
→ `PERSIST SUPERSEDING CHECKPOINT`
→ `REVIEW AGAIN`

Rules:

- work on the highest-value bounded findings first;
- preserve accepted scenes and closed findings;
- do not require the original video after its material findings are durable unless a new perceptual question arises;
- do not repeat closed evidence merely because a new room lacks chat context;
- when a later receipt supersedes an earlier blocker, make the supersession explicit in the durable checkpoint.

---

## 12. Durable checkpoint schema

Use a repository-resident checkpoint, PR body/comment, or current handoff:

```text
CINEMATIC_REVIEW_CHECKPOINT

Repository main:
Candidate / successor head:
Activation state:
Video evidence: <attached-and-reviewed in this room | durable findings only | not required for current state>

State identifier:
Prior state record superseded: <id / none>
Current controlling result: <PASS | FAIL | BLOCKED | CONTINUE_REFINEMENT | READY_FOR_OWNER_REVIEW | READY_TO_HOOK>

Accepted strengths:
- ...

Findings:
- V01 | timecode | severity | observation | desired correction

Source bindings:
- V01 -> exact head / path / blob / function / timing authority

Patch scope:
- exact changed paths

Required evidence:
- ...

Capability composition used:
- capability A -> exact-object/data function
- capability B -> execution/render function
- identity checks -> ...

Verification actually performed:
- canonical instrument / rendered review / decode check / etc.

Evidence superseded by this checkpoint:
- ...

Known open defects:
- ...

Next exact move:
- ...
```

Do not fill unknown fields with assumptions.

---

## 13. Room-collapse prevention

Warning signs of drift include:

- tooling investigation exceeds work on the named visual defect;
- the room repeats already-closed evidence;
- one failed transport is mistaken for a global capability absence;
- a stale blocker is treated as current despite later receipts;
- a missing optional test becomes a proposal for new infrastructure;
- a large video room becomes a whole-estate engineering room;
- no durable checkpoint exists after material conclusions.

When drift appears, stop broad retrieval and persist the current exact state.

---

## 14. Hook/replacement pattern

There is no universal rule that a film must be unhooked during every refinement cycle.

Use the current owner disposition:

- build detached and keep current production hooked when that is explicitly desired;
- keep an unhooked film unhooked when that is the accepted development state;
- hook only on explicit publication disposition;
- unhook only for a concrete rollback/refinement decision;
- when an accepted successor is ready, direct replacement may be preferable to an unnecessary `HOOK → NO HOOK → NEW HOOK` gap.

Activation is independent from construction and review.

---

## 15. Default instruction for any new video-review room

1. Read current `AI_ENTRYPOINT.json`.
2. Read the current cinematic/project handoff and latest checkpoint.
3. Resolve the latest exact controlling evidence before acting.
4. If a new video is attached, watch it end to end before broad repository retrieval.
5. Persist timecoded findings before implementation.
6. Bind only the smallest source authority needed for the top material findings.
7. Route the actual mutation according to current repository classification.
8. For every required evidence gate, inventory and compose already-authorized capabilities before declaring a blocker.
9. Run canonical instruments unchanged and accept only their actual receipts/results.
10. Persist an explicit superseding checkpoint whenever a later result closes an earlier blocker.
11. Resume only the first genuinely unresolved state.
12. Preserve the current owner-approved hook/unhook/replacement disposition.

Operating law:

`VIDEO → DURABLE FINDINGS → BOUNDED CORRECTION → EXACT EVIDENCE → LAWFUL CAPABILITY COMPOSITION → LATEST SUPERSEDING STATE → NEXT UNRESOLVED MOVE`
