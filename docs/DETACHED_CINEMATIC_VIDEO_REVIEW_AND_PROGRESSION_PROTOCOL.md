# Detached Cinematic Video Review and Production Progression Protocol

Status: **ACTIVE PRODUCTION PRACTICE**  
Date: 2026-09-05

## Purpose

This protocol gives any new room a deterministic path from a user-supplied cinematic recording to a bounded repository change without turning visual refinement into an unnecessary infrastructure project.

It applies to Compass and to future page-intro films implemented as removable presentation layers in front of an otherwise authoritative page.

The governing principle is:

> **Use the video to decide what is wrong, use the repository only to bind the smallest correction, and use verification proportional to the actual production risk.**

This protocol does not create runtime authority, deployment authority, or a new governance class. Existing repository routing remains authoritative. Its purpose is to prevent ordinary cinematic refinement from escalating into unrelated engineering work.

Companion ingress rule:

`docs/COMPASS_CINEMATIC_VIDEO_ROOM_INGRESS_BOUNDARY.md`

---

## 1. Repository precedent

The following merged precedents control how bounded cinematic work should be interpreted.

### PR #2684 — publish for live owner inspection when the candidate is bounded

`Publish Compass main orientation cinematic` merged at `106e579019988a06cee82280f64d637cab6b3fe7`.

The owner explicitly waived the previously frozen browser matrix, the missing matrix was not represented as PASS, and the bounded cinematic was published for live owner inspection with rollback if rejected.

**Precedent rule:** a missing nonessential qualification artifact does not require inventing new infrastructure when the candidate is bounded, the limitation is disclosed, and live inspection is itself useful evidence.

### PR #2697 — noninteractive cinematic qualification is not an interactive application matrix

`Compass holographic orientation — full removable successor` merged at `2d214fe237aa748c16a07fd2ceafd6ec88ce95d7`.

Its controlling record states that a full interactive device matrix was not required for the noninteractive cinematic. Relevant paths were Begin, Skip, Replay, natural completion, and reduced motion. Focused smoke plus static verification was accepted for the removable film.

**Precedent rule:** cinematic controls and visible passage integrity are the relevant qualification surface. Do not automatically import the verification burden of a fully interactive application.

### PR #2713 — bounded cinematic playback is a proportional release class

`Repair bounded cinematic presentation classification` merged at `46c56e0519fc875eac877b4bc921e3151b019a2f`.

It repaired the classifier so explicitly noninteractive cinematic/film/video playback with cinematic-scoped executable paths can be `BOUNDED_PAGE_RELEASE`. Navigation, routing, controllers, shared application state, analytics, shared DOM authority, control-plane mutation, or ambiguity remain `RUNTIME_OR_AUTHORITY`.

**Precedent rule:** do not treat self-contained presentation playback as website runtime authority merely because JavaScript is involved.

### PR #2751 — compare against the known-bad production baseline, not theoretical perfection

`Repair Compass cinematic in place through S08` merged at `32053a2899a1376867ddcd0ff0acc37527c13a02`.

The candidate repaired concrete visual/runtime defects, retained the existing renderer, passed focused verification, and was judged technically credible through an exact-head source audit. Natural full-duration browser playback remained useful as an observational smoke test but was explicitly not treated as justification for constructing a separate execution environment or delaying a materially improved bounded release.

**Precedent rule:** when the live baseline is already known to be wrong, the release question is whether the candidate materially improves it without catastrophic regression—not whether every conceivable uncertainty has been eliminated.

### PR #2752 and PR #2753 — activation is separate from construction

PR #2752 hooked the finished cinematic to ordinary production entry. PR #2753 then unhooked it after owner review while preserving the full film behind the existing preview parameter.

**Precedent rule:** the intro and the page are separate production surfaces. A film can be present but unhooked, hooked live, or unhooked again without rebuilding the page or deleting the film.

---

## 2. Production states

Use these exact states for detachable intros:

- `INTRO_PRESENT_BUT_UNHOOKED` — cinematic code exists and can be reviewed, but ordinary visitors enter the page directly.
- `INTRO_HOOKED_LIVE` — ordinary page entry mounts the cinematic before handing control to the underlying page.
- `INTRO_REVIEW_PATCH_IN_PROGRESS` — cinematic remains unhooked while targeted visual changes are being made.

The default development state is `INTRO_PRESENT_BUT_UNHOOKED` or `INTRO_REVIEW_PATCH_IN_PROGRESS`.

Do not hook a film live merely because a code change is complete. Hooking is a separate owner-facing publication decision.

---

## 3. Video ingress and room-budget law

The review video is **not** a repository asset and is **not** assumed to travel across rooms.

Use this room sequence:

1. Keep the planning/control room video-free when preserving context budget is useful.
2. Open a fresh room dedicated to cinematic review.
3. Have that room read the current cinematic handoff, this protocol, and the video-ingress boundary.
4. Only then does the owner attach the large review video in that fresh review room.
5. The room reviews the video first and persists a checkpoint before broad repository work.

No room may say a video is “supplied,” “uploaded,” or “available” unless the file is actually attached in that room.

If visual review is the next task and no video is attached in the room, say that the video has not yet been supplied **to that room** and wait for the owner to attach it there.

Do not:

- infer availability from a prior room;
- ask for the large video in a different planning room;
- search the repository for a substitute recording;
- begin a broad code audit in place of the missing visual evidence.

A room containing a large video should not also become a whole-estate engineering room. After video upload, narrow the work to visible findings, exact source bindings, bounded patches, and early checkpoints.

---

## 4. Video-first review law

When the user supplies a recording in the review room, **review the video before broad repository inspection**.

The video is primary evidence for:

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
- mobile framing visible in the recording;
- whether the film feels materially better than the current production baseline.

Do not begin by auditing workflows, browser infrastructure, historical control-plane records, or the whole estate.

A visual review should first produce a bounded defect list with timecodes. Example:

| ID | Timecode | Observation | Severity | Desired correction |
| --- | --- | --- | --- | --- |
| V01 | 08.4–10.1 s | subject too small / unreadable | material | enlarge and hold longer |
| V02 | 19.7 s | transition snaps | material | preserve outgoing geometry into successor |
| V03 | 31–34 s | pacing drags | refinement | shorten hold by ~1 s |

Do not inspect source until the visible problem is named.

---

## 5. Minimal source-binding law

For each accepted video finding, bind only the source needed to change that finding.

Use this sequence:

1. Identify the visible defect and timecode.
2. Identify the shot/beat responsible.
3. Retrieve the current cinematic host/renderer source for that beat.
4. Identify the smallest function, constant, geometry block, timing range, or copy string that governs it.
5. Confirm protected page/runtime authorities that must remain untouched.
6. Implement the smallest coherent correction.

Prefer one defect → one source binding → one bounded patch.

Do not perform a whole-repository search after the source authority is known.

Do not reopen settled creative/source discovery unless the video reveals a new ambiguity.

---

## 6. Production acceptance standard

A cinematic revision is eligible to advance when all of the following are true:

1. It materially improves the observed problem relative to the current or captured baseline.
2. The change is bounded to the intended cinematic/presentation surface.
3. There is no evidence of a catastrophic regression such as a crash, blank passage, broken Skip/Play path, navigation mutation, persistent page lockout, or failed restoration.
4. The underlying page remains authoritative and recoverable.
5. The intro can remain unhooked while further refinement continues.

Perfection is not the acceptance standard.

A known-deficient live or captured baseline must not become an accidental quality floor that prevents progress. The question is:

> **Is this revision materially better, bounded, and safe enough to become the next review baseline?**

If yes, advance it.

---

## 7. Proportional verification ladder

Use the lowest verification level that actually answers the uncertainty introduced by the patch.

### Level A — source audit

Use for copy, timing constants, bounded geometry, camera parameters, known index errors, presentation-only state, cache identity, or similarly explicit repairs.

Verify exact changed paths, syntax/source invariants, protected-runtime nonmutation, and restoration logic where relevant.

### Level B — focused visual smoke

Use when the question is visible layout, scene fit, responsive framing, transition continuity, or a control path such as Play/Skip/Replay/reduced motion.

Use an already-available browser or rendered artifact if one exists. Do not create a new execution environment solely because a visual smoke test would be nice to have.

### Level C — broader runtime qualification

Use only when the proposed change actually touches or plausibly changes website runtime authority, navigation, routing, shared application state, controllers, gestures, shared DOM ownership, analytics, or another protected runtime surface.

That case is no longer merely a bounded cinematic refinement and should follow the repository's existing heavier route.

### Explicit anti-escalation rule

Do **not** create any of the following solely to approve a bounded film revision:

- a new Playwright/browser execution substrate;
- a new CI workflow;
- a new control-plane bridge;
- a new renderer framework;
- a new website runtime controller;
- a full estate audit;
- a full interactive device matrix.

If an existing instrument is unavailable, record that limitation. Do not turn the missing instrument into the product task.

---

## 8. Deterministic change loop

A review room should repeat this loop until the owner says the film is ready:

`WATCH → RECORD FINDINGS → PRIORITIZE → BIND SOURCE → PATCH → NARROW VERIFY → PERSIST CHECKPOINT → REVIEW AGAIN`

Rules:

- Work on the highest-value 1–3 findings per checkpoint.
- Do not accumulate a giant all-at-once redesign unless the owner explicitly requests one.
- Keep the cinematic unhooked while active refinement is underway.
- Preserve accepted scenes unless a later change genuinely depends on them.
- A successful visual improvement becomes the new review baseline; do not repeatedly re-litigate already accepted decisions.
- If the video-bearing room becomes context-heavy, checkpoint and move to a fresh successor room rather than broadening investigation in place.

---

## 9. Durable review checkpoint schema

Every room that performs material review or construction should leave a durable checkpoint before expanding scope.

Use this structure in the current handoff, PR body, or a dedicated review note:

```text
CINEMATIC_REVIEW_CHECKPOINT

Repository head:
Activation state:
Video evidence: <only if actually attached and reviewed in this room; filename / duration / capture date if known>
Review result: <CONTINUE_REFINEMENT | READY_TO_HOOK | KEEP_UNHOOKED>

Accepted strengths:
- ...

Findings:
- V01 | timecode | severity | observation | desired correction
- V02 | ...

Source bindings:
- V01 -> exact path / function / constant
- V02 -> ...

Patch scope:
- exact changed paths

Verification actually performed:
- ...

Verification not performed / not required:
- ...

Next material move:
- ...
```

The checkpoint must distinguish what was visually observed, what was changed, what was proven, and what remains a judgment call.

---

## 10. Room-collapse prevention

A room must persist progress before it starts a second broad line of investigation.

Warning signs that the room is drifting:

- more time is being spent on tooling than on the named visual defect;
- retrieval expands from the cinematic into unrelated workflows or infrastructure;
- the room starts proving facts already established by the current handoff;
- multiple equivalent source searches occur after authority is already known;
- a missing optional test becomes a proposal to build a new system;
- no durable checkpoint exists after several substantive conclusions;
- the room contains a large video and is also accumulating broad repository/control-plane context.

When any warning sign occurs, stop retrieval and write the current checkpoint.

Operating law:

> **Durable forward progress outranks maximum procedural completeness.**

---

## 11. Hook / unhook release pattern

The recommended lifecycle for future page intros is:

1. Build the intro as a detachable presentation layer.
2. Keep it unhooked during development.
3. Open a fresh review room and have the owner attach the review video there.
4. Review that captured video directly.
5. Apply targeted bounded corrections.
6. When owner review says it is ready, hook it live with the smallest activation change possible.
7. Capture/review the live result.
8. If rejected or still immature, unhook it without deleting the film or mutating the underlying page.

This pattern makes live inspection reversible and turns the underlying page into a stable fallback rather than a co-development dependency.

---

## 12. Default instruction for a new room

Before the video exists in the room:

1. Read the current cinematic handoff.
2. Read this protocol.
3. Read the video-room ingress boundary.
4. Confirm current `main` and activation state.
5. Wait for the owner to attach the review video **in that room**.

After the video is attached:

1. Watch it end to end.
2. Produce a timecoded, prioritized assessment before source retrieval.
3. Bind only the sources required for the top 1–3 findings.
4. Route the actual mutation according to the repository classifier; do not assume cinematic JavaScript means runtime authority.
5. Make the smallest coherent patch.
6. Use source audit and focused smoke proportional to the patch.
7. Persist a checkpoint.
8. Leave the intro unhooked unless the user explicitly asks to hook/publish it.

Do not create new engineering infrastructure unless a proposed product change genuinely requires that infrastructure.
