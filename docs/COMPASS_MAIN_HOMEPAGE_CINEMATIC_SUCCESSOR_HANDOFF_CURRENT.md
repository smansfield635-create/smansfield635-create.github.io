# Compass Main Homepage Cinematic — Current Successor Handoff

Status: **CURRENT / CONTROLLING**  
Date: 2026-09-05

This document supersedes the immediate execution instructions in the September 4 successor handoff. The earlier files remain historical/creative records and should not be used to restart completed specification or construction work.

Primary operating protocol:

`docs/DETACHED_CINEMATIC_VIDEO_REVIEW_AND_PROGRESSION_PROTOCOL.md`

Historical creative record:

`docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_SUCCESSOR_HANDOFF_20260904.md`

---

## 1. Current product state

Product baseline before this documentation update:

`fe01438904cb9572ac6d949b2f8d2144532c178b`

That commit is PR #2753, which intentionally returned the homepage to:

`INTRO_PRESENT_BUT_UNHOOKED`

The cinematic remains in the repository and is still reviewable through:

`?compassCinematicConstruction=1`

Ordinary homepage visitors enter the website directly.

The film itself was not deleted, reverted, or replaced when it was unhooked.

The completed current film remains the 45-second S01–S08 Compass orientation cinematic constructed through PR #2751, including the repaired S05 Mirrorland path, camera-facing S02 stars, direct Play-control tessellation into S01, the stretched Brain → Trophy → House passage, Skip behavior, fail-open restoration, and final handoff.

---

## 2. Latest owner disposition

The owner reviewed the hooked production film, captured the video, and determined:

- the work is substantially successful;
- the film is not yet finished;
- substantial refinement remains;
- it should be unhooked while that refinement continues.

Therefore the next room is **not** being asked to publish, re-hook, reconstruct, respecify, or build new qualification infrastructure.

The next room is being asked to **assess the supplied video and make deterministic, bounded improvements to the existing film while it remains detached from ordinary production entry.**

---

## 3. Controlling precedent

Do not rediscover this history unless a specific conflict requires it.

- **PR #2684** established that a bounded cinematic may be published for live owner inspection with an explicitly disclosed browser-matrix waiver and rollback if rejected. Missing nonessential qualification was not converted into an infrastructure project.
- **PR #2697** established that a noninteractive cinematic does not require a full interactive application matrix. Begin, Skip, Replay, natural completion, reduced motion, focused smoke, and static verification were the relevant controls/evidence.
- **PR #2713** repaired the repository classifier so cinematic-scoped, noninteractive presentation playback can be `BOUNDED_PAGE_RELEASE`; navigation/controller/shared-state/analytics/authority changes remain the heavier class.
- **PR #2751** established the proportional release standard for this exact successor: compare a materially improved candidate against the known-wrong live baseline, use exact source audit and focused verification, and do not construct a separate browser environment merely to eliminate every residual uncertainty.
- **PR #2752 / #2753** proved that cinematic activation is independently hookable and reversible. The film may be reviewed live, then unhooked without rebuilding the page.

These are not exceptions to work around. They are the operating precedent.

---

## 4. Immediate workflow for the next room

When the owner uploads the captured cinematic video:

1. **Watch the video end to end before broad repository retrieval.**
2. Produce a timecoded list of visible strengths and defects.
3. Prioritize the top 1–3 material defects.
4. For each defect, bind only the exact cinematic source that governs it.
5. Preserve accepted scenes and protected Compass/page authorities.
6. Make the smallest coherent changes that address those defects.
7. Verify proportionally using source audit and focused visual evidence appropriate to the change.
8. Persist a `CINEMATIC_REVIEW_CHECKPOINT` before expanding to another defect group.
9. Keep the intro unhooked unless the owner explicitly requests another live hook.

The loop is:

`WATCH → FINDINGS → PRIORITIZE → SOURCE BIND → PATCH → NARROW VERIFY → CHECKPOINT → WATCH AGAIN`

---

## 5. What not to do

Do not:

- restart the shot-construction specification;
- recreate the film from scratch;
- build another generic animatic;
- create a new Playwright/browser execution substrate merely to approve a film change;
- create a new CI workflow merely to approve a film change;
- create a new control-plane bridge merely to approve a film change;
- audit the entire repository when a visible defect already points to a known shot;
- treat every JavaScript cinematic change as website runtime authority;
- require theoretical perfection before advancing a material improvement;
- re-hook the film automatically after a patch;
- delete the cinematic because it is not live.

If a proposed change actually touches navigation, controller authority, shared application state, analytics, shared DOM ownership, routing, or other protected runtime behavior, stop and route that **specific change** through the heavier repository path. Do not preemptively escalate the entire cinematic.

---

## 6. Production standard

The next review baseline should advance when it is:

- materially better than the captured/current baseline;
- bounded to the cinematic presentation surface;
- free of known catastrophic regression;
- restorable to the underlying page;
- still detachable from normal production entry.

The standard is not “prove the film is perfect.”

The standard is:

> **Make the next version materially better without breaking the page, then let the owner review the actual result.**

---

## 7. Durable checkpoint requirement

After each material group of changes, persist:

```text
CINEMATIC_REVIEW_CHECKPOINT

Repository head:
Activation state: INTRO_REVIEW_PATCH_IN_PROGRESS | INTRO_PRESENT_BUT_UNHOOKED
Video evidence:
Review result: CONTINUE_REFINEMENT | READY_TO_HOOK | KEEP_UNHOOKED

Accepted strengths:
- ...

Findings:
- V01 | timecode | severity | observation | desired correction

Source bindings:
- V01 -> exact path / function / constant

Patch scope:
- exact changed paths

Verification actually performed:
- ...

Verification not performed / not required:
- ...

Next material move:
- ...
```

A room must write a checkpoint before it begins a second broad investigation path.

---

## 8. Recovery rule

If a room collapses, the successor room should:

1. read this file;
2. read the detached cinematic review protocol;
3. resolve current `main`;
4. find the most recent cinematic review checkpoint/PR;
5. resume from the first unresolved video finding;
6. avoid repeating accepted source discovery or closed findings;
7. request the video only when visual assessment is the next task and the recording is not available in the room.

Do not reconstruct lost private reasoning. Continue from durable video findings, source bindings, and commits.

Operating law:

> **Durable forward progress outranks maximum procedural completeness.**

---

## 9. Immediate instruction

The next material task is:

**Review the owner's captured 45-second Compass cinematic, identify the highest-value visual/creative corrections with timecodes, bind those findings to the existing cinematic source, and implement the first bounded refinement group while the intro remains unhooked.**

Do not spend the next room rebuilding approval infrastructure.