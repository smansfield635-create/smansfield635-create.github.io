# Compass Cinematic Video Room Ingress Boundary

Status: **CONTROLLING ADDENDUM**  
Date: 2026-09-05

This file corrects two ambiguities in the cinematic workflow:

1. **review videos are not repository assets and are not assumed to exist in the current room**; and
2. **Codespaces are prohibited for cinematic work.**

Controlling execution-substrate policy:

`docs/CINEMATIC_NO_CODESPACES_POLICY.md`

## 1. Where the videos come from

The owner supplies the review video directly in the **fresh review room that will perform the visual assessment**.

No video is carried automatically from an earlier room. No successor room should claim that a video has been supplied unless it is actually attached in that room.

The current planning/control room should remain video-free when preserving context budget is useful.

## 2. Correct room sequence

Use this sequence:

1. Finish repository-side handoff/protocol work without uploading the review video.
2. Open a fresh room dedicated to cinematic assessment.
3. Have that room read:
   - `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_SUCCESSOR_HANDOFF_CURRENT.md`
   - `docs/DETACHED_CINEMATIC_VIDEO_REVIEW_AND_PROGRESSION_PROTOCOL.md`
   - `docs/CINEMATIC_NO_CODESPACES_POLICY.md`
   - this file.
4. Confirm explicitly: `CINEMATIC_CODESPACES = PROHIBITED`.
5. Only then does the owner upload the video into that fresh review room.
6. The room watches the video first, records timecoded findings, and limits the first repository pass to the top 1–3 material findings.
7. Persist a `CINEMATIC_REVIEW_CHECKPOINT` before broadening scope.

## 3. Execution-substrate law

For this cinematic and all successor cinematic work, **do not use Codespaces**.

A room must not:

- create a Codespace;
- recommend a Codespace;
- claim a Codespace is required because local/native command execution is unavailable;
- wait for a Codespace before continuing bounded cinematic work;
- reinterpret generic repository execution-substrate guidance as a cinematic Codespaces requirement;
- restart precedent discovery in order to justify a Codespace path already rejected by controlling cinematic precedent.

If a room reaches the conclusion `NEED_CODESPACE`, that conclusion is itself a stop signal. Re-read `docs/CINEMATIC_NO_CODESPACES_POLICY.md`, recover the last durable cinematic checkpoint, and continue from the first unresolved bounded cinematic boundary.

Only a later explicit owner instruction that specifically authorizes Codespaces for a named cinematic operation may supersede this rule.

## 4. Context-budget rule

A room containing a large video should not also become a whole-estate engineering room.

After video upload:

- do not perform broad repository audits;
- do not rediscover settled precedent;
- do not inspect control-plane/browser infrastructure unless a proposed product change genuinely crosses into that authority;
- do not search for the same source repeatedly once bound;
- do not introduce Codespaces or another new execution environment as a substitute for cinematic progress;
- persist findings and source bindings early;
- if the room becomes context-heavy, stop at the checkpoint and continue in a fresh successor room from durable repository facts.

## 5. Missing-video behavior

If the next task is visual assessment and no video is attached in the room, the room should say that the review video has not yet been supplied **to that room** and wait for the owner to upload it there.

It should not:

- infer that a prior-room video is available;
- ask the owner to upload the video into a different planning room;
- search the repository for a substitute recording;
- start a broad code audit in place of the missing visual evidence;
- open or request a Codespace while waiting.

## 6. Operating law

> **Repository context travels across rooms through durable handoffs and checkpoints. Large video evidence does not. Codespaces are not part of the cinematic production path. The owner introduces the video only into the fresh room that needs to inspect it.**
