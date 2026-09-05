# Compass Cinematic Video Room Ingress Boundary

Status: **CONTROLLING ADDENDUM**  
Date: 2026-09-05

This file corrects one ambiguity in the cinematic review workflow: **review videos are not repository assets and are not assumed to exist in the current room.**

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
   - this file.
4. Only then does the owner upload the video into that fresh review room.
5. The room watches the video first, records timecoded findings, and limits the first repository pass to the top 1–3 material findings.
6. Persist a `CINEMATIC_REVIEW_CHECKPOINT` before broadening scope.

## 3. Context-budget rule

A room containing a large video should not also become a whole-estate engineering room.

After video upload:

- do not perform broad repository audits;
- do not rediscover settled precedent;
- do not inspect control-plane/browser infrastructure unless a proposed product change genuinely crosses into that authority;
- do not search for the same source repeatedly once bound;
- persist findings and source bindings early;
- if the room becomes context-heavy, stop at the checkpoint and continue in a fresh successor room from durable repository facts.

## 4. Missing-video behavior

If the next task is visual assessment and no video is attached in the room, the room should say that the review video has not yet been supplied **to that room** and wait for the owner to upload it there.

It should not:

- infer that a prior-room video is available;
- ask the owner to upload the video into a different planning room;
- search the repository for a substitute recording;
- start a broad code audit in place of the missing visual evidence.

## 5. Operating law

> **Repository context travels across rooms through durable handoffs and checkpoints. Large video evidence does not. The owner introduces the video only into the fresh room that needs to inspect it.**
