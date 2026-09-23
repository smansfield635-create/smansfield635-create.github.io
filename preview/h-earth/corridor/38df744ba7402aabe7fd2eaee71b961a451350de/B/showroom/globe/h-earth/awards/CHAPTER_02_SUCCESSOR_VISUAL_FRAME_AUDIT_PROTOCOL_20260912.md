# Chapter 02 Successor — Deterministic Visual Frame Audit Protocol

Status: `FROZEN_POST_MASTER_PRE_INTEGRATION_VISUAL_GATE`
Date: `2026-09-12`
Controlling corrective issue: `#3182`
Editorial authority: `CHAPTER_02_SUCCESSOR_MUSIC_AND_SHOT_TABLE_20260912.md`

This protocol replaces owner-specific visual acceptance as the mandatory pre-integration visual gate for the Chapter 02 successor.

Owner review remains available as an optional observation surface. It is not required for the candidate to advance when this deterministic visual audit and all mechanical/media qualification gates pass.

---

## 1. Recovered precedent

The governing precedent is the Compass V2 R3/R4/R5 cinematic qualification sequence recorded in issue `#2828`.

That process separated visual evidence into two layers:

### R4 — representative visual qualification

Representative frames were inspected across the complete semantic sequence, including:

- Arrival
- Compass
- Chapter One
- Research
- Readiness
- Mirrorland
- Audralia
- Brain
- Trophy
- House
- final Compass handoff

The resulting R4 visual sheet was frozen by SHA-256.

### R5 — full deterministic capture

The complete 38.000-second film was captured at `1280x720 / 30 fps` as exactly `1,140` deterministic frames.

The frame sequence, first frame, last frame, full frame manifest, and representative visual sheet were all hash-bound.

The important production law is:

`REPRESENTATIVE_VISUAL_AUDIT != FULL_FRAME_IDENTITY`

Both are required.

Representative review proves that the intended scenes actually read correctly.

Full deterministic capture proves that no uninspected temporal region can hide a flash, wrong source, stale frame, unreadable transition, or other short-lived defect.

---

## 2. Chapter 02 application

Frozen successor runtime:

`40.200 s`

Frozen frame rate:

`30 fps`

Therefore exact decoded/captured frame count is:

`40.200 × 30 = 1,206 frames`

Required full-frame set:

`FRAME_0000 ... FRAME_1205`

No candidate advances to Chapter 02 integration unless all `1,206` frames are successfully captured or decoded from the exact candidate master and included in the audit manifest.

---

## 3. Whole-film visual atlas

In addition to all-frame custody, create a human-inspectable visual atlas covering the entire film.

### Regular temporal sampling

Sample one frame every `0.500 s` across the entire `40.200 s` master.

At 30 fps this is every `15` frames.

Regular atlas set:

`FRAME_0000, FRAME_0015, FRAME_0030, ...`

through the final available 0.5-second sample before `FRAME_1205`.

### Mandatory exact-event inserts

The atlas must also include exact or nearest-frame captures at every frozen editorial boundary and every high-risk event, regardless of whether they coincide with the 0.5-second sample grid:

- film `00:00.000` opening;
- text 1 on/off boundaries;
- S01→S02 transition;
- text 2 on/off boundaries;
- film `00:10.000` / canonical music `02:47.000` H-Earth thematic-entry anchor;
- S03 H-Earth entry midpoint;
- S03→S04 transition;
- text 3 on/off boundaries;
- H-Earth traversal midpoint;
- S05→S06 withdrawal transition;
- text 4 on/off boundaries;
- restored globe at end of S06B;
- collage spin establishment;
- Characters approach / dominant-hold midpoint / recede;
- Mirrorland approach / dominant-hold midpoint / recede;
- Brain approach / dominant-hold midpoint / recede;
- Manor approach / dominant-hold midpoint;
- URL appearance;
- `FRAME_1205` terminal frame.

If any transition or effect can produce a visible state shorter than 0.5 seconds, its beginning, midpoint, and end must be inserted into the atlas explicitly.

---

## 4. Visual audit dimensions

The atlas and full frame sequence are audited against the following noncompensatory dimensions.

### A. Source fidelity

PASS only if:

- `23774.mp4` visibly owns the globe/Audralia approach and return beats;
- `23775.mp4` visibly owns the H-Earth entry/traversal proof beats;
- no procedural reconstruction silently substitutes for experiential footage;
- the collage objects match their frozen source identities.

### B. Retired-geography exclusion

FAIL if any frame visibly contains the retired synthetic three-river Gratitude presentation or any equivalent stale landscape derived from:

- `GRATITUDE_RIVER_WEST`
- `GRATITUDE_RIVER_CENTRAL`
- `GRATITUDE_RIVER_EAST`

No amount of later correct footage compensates for one stale frame.

### C. Geographic continuity

The sequence must read coherently as:

`GLOBE -> AUDRALIA -> H-EARTH -> H-EARTH TRAVERSAL -> WITHDRAWAL -> SAME GLOBE`

FAIL if entry or withdrawal reads as an unrelated replacement world.

### D. H-Earth interaction proof

The H-Earth section must visibly demonstrate spatial movement/traversal/depth.

FAIL if it reads only as a scenic still, generic flyover, menu, or abstract world illustration.

### E. Typography coherence

For each of the four frozen conceptual statements:

- the sentence is complete and readable;
- the viewer is not forced to reconstruct syntax from rapidly separated fragments;
- text does not obscure the principal visual subject;
- text dwell is visibly sufficient at representative phone-scale composition;
- no stale Gen2128 text behavior appears.

### F. Transition cleanliness

FAIL on any:

- black or white unintended flash;
- stale preceding frame;
- wrong-source single frame;
- visible browser/Android/debug chrome introduced by a crop transition;
- abrupt aspect/crop discontinuity not justified by the storyboard;
- blank or incomplete render state.

### G. Cyclone / collage recognition

Each selected object must visibly complete this grammar:

`SPIN -> APPROACH -> BACKGROUND SOFTENS -> OBJECT DOMINATES -> HOLD -> RECEDE`

Required dominant-readable durations remain:

- Characters: `1.4 s`
- Mirrorland: `1.4 s`
- Brain: `1.5 s`
- Manor: `1.8 s`

FAIL if motion continues so aggressively during the hold that the object cannot be inspected, even if nominal timing is correct.

### H. Context hierarchy

During a selected-object hold:

- selected object must be the obvious visual subject;
- background field must remain recognizable as context but subordinate;
- blur/softening may not make the entire image muddy;
- selected object may not remain too small to identify.

### I. Terminal coherence

The final state must end with:

- Manor still resolved as the dominant visual subject;
- `DIAMONDGATEBRIDGE.COM` readable;
- no extra black slide;
- no stale tail;
- no post-music visual continuation.

---

## 5. Music/frame synchronization audit

The visual atlas is timestamped against the frozen continuous soundtrack window:

`157.000 s -> 197.200 s`

Mandatory synchronization invariant:

`film 00:10.000 == canonical Vivaldi 02:47.000`

The exact frame at or nearest film `00:10.000` must show the H-Earth entry/thematic-arrival state required by the shot table.

The terminal frame must correspond to the end of the continuous `03:17.200` music window.

No wrap to source `00:00` is permitted.

---

## 6. Evidence outputs

A passing audit produces and freezes at minimum:

1. exact candidate MP4 SHA-256;
2. exact decoded frame count = `1,206`;
3. full-frame manifest covering `FRAME_0000...FRAME_1205`;
4. full-frame manifest SHA-256;
5. first-frame SHA-256;
6. terminal-frame SHA-256;
7. whole-film visual atlas image(s);
8. visual atlas SHA-256 identity/identities;
9. event-boundary frame index table;
10. visual-audit receipt containing PASS/FAIL for dimensions A–I;
11. exact list of any defect frame numbers if FAIL.

The evidence package must be sufficient for a fresh room to determine exactly what was inspected without relying on private conversation memory.

---

## 7. Failure handling

Any visual defect produces:

`VISUAL_FRAME_AUDIT_FAIL_CLOSED`

The receipt must identify:

- exact frame number(s);
- film timestamp(s);
- violated audit dimension;
- source/transition/text/collage element responsible where determinable.

Repair authority is bounded to the demonstrated failure.

After repair:

`RE-ENCODE -> RECAPTURE ALL 1,206 FRAMES -> REBUILD ATLAS -> RE-RUN COMPLETE VISUAL AUDIT`

Do not inspect only the repaired frames. A new master requires a new complete audit because encoding/editorial changes can affect neighboring transitions.

---

## 8. Passing disposition

Required result:

`PASS_CLOSED_DETERMINISTIC_VISUAL_MASTER`

Only after this result **and** deterministic media/profile/audio qualification may the candidate advance to Awards Chapter 02 integration.

Mandatory owner-specific visual approval is not part of this gate.

Owner review may still occur voluntarily before or after integration, but absence of such review does not block a candidate that has satisfied the frozen deterministic evidence standard.

---

## 9. Revised production sequence

The relevant production path is now:

`FROZEN SHOT/MUSIC TABLE`
`-> LOW-COST PROOF CUT`
`-> PROOF COHERENCE REVIEW`
`-> ACCEPTED EXACT CONFORM`
`-> FINAL MASTER ENCODE`
`-> MEDIA/PROFILE/AUDIO QUALIFICATION`
`-> R4-STYLE REPRESENTATIVE VISUAL QUALIFICATION`
`-> R5-STYLE FULL 1,206-FRAME DETERMINISTIC CAPTURE`
`-> WHOLE-FILM VISUAL ATLAS + FRAME AUDIT`
`-> PASS_CLOSED_DETERMINISTIC_VISUAL_MASTER`
`-> CHAPTER 02 REBIND`
`-> AWARDS/TROPHY INTEGRATION QUALIFICATION`
`-> EXACT QUALIFIED MERGE`
`-> EXPLICIT EXACT-HEAD PAGES DEPLOYMENT`
`-> LIVE_EXACT_HEAD_VERIFIED`

This sequence supersedes any earlier Chapter 02 recovery language requiring owner-specific review before integration or republication.