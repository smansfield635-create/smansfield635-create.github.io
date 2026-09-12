# Compass Cinematic Video Room Ingress Boundary

Status: **CONTROLLING ADDENDUM**  
Date: 2026-09-05

This file corrects four ambiguities in the cinematic workflow:

1. **review videos are not repository assets and are not assumed to exist in the current room**;
2. **Codespaces are prohibited for cinematic work**;
3. **production capability must be evaluated across the entire room/tool environment, not just the GitHub connector**; and
4. **production must resume from one explicit traversal state rather than from a monolithic instruction such as “finish the cinematic.”**

Controlling execution documents:

- `docs/CINEMATIC_NO_CODESPACES_POLICY.md`
- `docs/CINEMATIC_PRODUCTION_EXECUTION_CONTRACT.md`
- `docs/COMPASS_CINEMATIC_PRODUCTION_TRAVERSAL_LEDGER.md`
- controlling production issue #2787

## 1. Where the videos come from

The owner supplies the review video directly in the **fresh review room that will perform the visual assessment**.

No video is carried automatically from an earlier room. No successor room should claim that a video has been supplied unless it is actually attached in that room.

The current planning/control room should remain video-free when preserving context budget is useful.

## 2. Correct review-room sequence

Use this sequence for **visual assessment of an already-produced review video**:

1. Finish repository-side handoff/protocol work without uploading the review video.
2. Open a fresh room dedicated to cinematic assessment.
3. Have that room read:
   - `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_SUCCESSOR_HANDOFF_CURRENT.md`
   - `docs/DETACHED_CINEMATIC_VIDEO_REVIEW_AND_PROGRESSION_PROTOCOL.md`
   - `docs/CINEMATIC_NO_CODESPACES_POLICY.md`
   - `docs/CINEMATIC_PRODUCTION_EXECUTION_CONTRACT.md`
   - `docs/COMPASS_CINEMATIC_PRODUCTION_TRAVERSAL_LEDGER.md`
   - this file.
4. Confirm explicitly: `CINEMATIC_CODESPACES = PROHIBITED`.
5. Only then does the owner upload the video into that fresh review room.
6. The room watches the video first, records timecoded findings, and limits the first repository pass to the top 1–3 material findings.
7. Persist a `CINEMATIC_REVIEW_CHECKPOINT` before broadening scope.

## 3. Correct production-room ingress

A room whose job is to **make or correct the cinematic master** is not a review-only room. It must enter the explicit T0-T13 traversal defined by `docs/COMPASS_CINEMATIC_PRODUCTION_TRAVERSAL_LEDGER.md`.

Before any product mutation, it must:

1. read the production contract and traversal ledger;
2. re-resolve exact current `main` and relevant cinematic candidate/artifact identities;
3. inventory the whole-room execution surface for browser/renderer, FFmpeg/encoder, orchestration runtime, transient filesystem, and GitHub binary ingress;
4. inspect durable state checkpoints beginning at T0;
5. find the first T-state without exact `PASS_EVIDENCE`;
6. state that one T-state and its material question as the next action;
7. perform only that state's `ALLOWED_MUTATION`.

The early capability inventory prevents blind infrastructure invention. It is not itself a reason to block T0-T6 construction.

The functional browser renderer is a hard gate at **T7**, after `CAPTURE_READY_SOURCE_COMPLETE`. If T7 fails, report `CAPTURE_READY_SOURCE_COMPLETE / FRAME_RENDER_BLOCKED` and stop. Do not redesign the cinematic or add another production layer to compensate for an environmental renderer failure.

A GitHub connector limitation does not establish a production blocker when the exact ledger state can still be completed using connected repository operations.

## 4. First-unpassed-state law

A fresh room does not restart production because it is fresh.

It must:

- preserve every state with exact PASS evidence;
- resume the first state without PASS evidence;
- never repeat source discovery already closed by an earlier state;
- never skip a failed state by broadening architecture;
- route a later defect backward only to the smallest responsible state named by the ledger regression map.

Conversation memory, screenshots, and room summaries are recovery aids only. The exact repository/artifact evidence named by the ledger determines whether a state is actually passed.

## 5. Anti-monolith law

The following are not executable production instructions by themselves:

- `fix the cinematic`;
- `correct the bounded beats`;
- `finish the master`;
- `render the film`;
- `qualify the cinematic`.

A lawful next instruction must name one T-state and one material question.

If two successive construction increments add preparation or machinery without producing a more complete visible cinematic candidate, stop with:

`ANTI_REINVENTION_CHECK_REQUIRED`

Then compare the proposed mechanism against About or another accepted cinematic precedent before proceeding.

## 6. Execution-substrate law

For this cinematic and all successor cinematic work, **do not use Codespaces**.

A room must not:

- create a Codespace;
- recommend a Codespace;
- claim a Codespace is required because one connector lacks local/native command execution;
- wait for a Codespace before continuing bounded cinematic work;
- reinterpret generic repository execution-substrate guidance as a cinematic Codespaces requirement;
- restart precedent discovery in order to justify a Codespace path already rejected by controlling cinematic precedent;
- infer `VIDEO_PRODUCTION_BLOCKED` from `GITHUB_API_CANNOT_ENCODE_VIDEO` without checking the whole execution environment and the exact ledger state.

If a room reaches the conclusion `NEED_CODESPACE`, that conclusion is itself a stop signal. Re-read the controlling execution documents, recover the first unpassed T-state, and continue only from that boundary.

Only a later explicit owner instruction that specifically authorizes Codespaces for a named cinematic operation may supersede this rule.

## 7. Context-budget rule

A room containing a large video should not also become a whole-estate engineering room.

After video upload:

- do not perform broad repository audits;
- do not rediscover settled precedent;
- do not inspect control-plane/browser infrastructure unless the current T-state genuinely requires it;
- do not search for the same source repeatedly once its state has passed;
- do not introduce Codespaces or another new execution environment as a substitute for cinematic progress;
- persist findings and source bindings early;
- if the room becomes context-heavy, stop at the checkpoint and continue in a fresh successor room from the first unpassed T-state.

## 8. Missing-video behavior

If the next task is visual assessment and no video is attached in the room, the room should say that the review video has not yet been supplied **to that room** and wait for the owner to upload it there.

It should not:

- infer that a prior-room video is available;
- ask the owner to upload the video into a different planning room;
- search the repository for a substitute recording;
- start a broad code audit in place of the missing visual evidence;
- open or request a Codespace while waiting.

This missing-review-video rule does **not** block a production room from completing T0-T6 capture-ready source construction when the assigned state can be completed without review video evidence.

## 9. Progress-truth rule

Branch creation, source discovery, or asset enumeration is not film progress.

A room may not say that the film was advanced, built, completed, rendered, or encoded unless the exact T-state's evidence supports that language.

Required status vocabulary includes:

- after T1 branch creation only: `BRANCH_CREATED / PRODUCT_CONSTRUCTION_NOT_STARTED`;
- after T6: `CAPTURE_READY_SOURCE_COMPLETE`;
- after failed T7: `CAPTURE_READY_SOURCE_COMPLETE / FRAME_RENDER_BLOCKED`;
- only after T11 verified media commit: `MASTER_CANDIDATE_PRODUCED`.

## 10. Operating law

> **Repository context travels across rooms through exact checkpoints. Large owner-review video evidence does not. Fresh rooms resume the first unpassed traversal state; they do not restart discovery. Review rooms review. Production rooms change one material thing at a time, preserve accepted floors, gate the renderer at T7, encode only after deterministic capture, and commit the master before claiming a candidate exists.**
