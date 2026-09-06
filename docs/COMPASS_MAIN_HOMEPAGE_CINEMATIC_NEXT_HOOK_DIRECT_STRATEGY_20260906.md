# Compass Main Homepage Cinematic — Next-Hook Direct Strategy

Status: **CURRENT / CONTROLLING DIRECT STRATEGY**  
Date: 2026-09-06  
Repository `main` at documentation freeze: `c3b6d28fae21e3c6e1814e1ea4551ff46f72cddf`  
Cinematic live baseline: `99025b828629548be1ea066cd2e01dd16d855a03`

This document freezes the owner-reviewed defect model and the direct path to the next Compass homepage cinematic hook.

The current production cinematic remains hooked while the corrected successor is constructed and reviewed. Do **not** insert an interim unhook merely because the successor is being repaired.

The intended release pattern is:

`CURRENT HOOK REMAINS LIVE → BUILD CORRECTED SUCCESSOR DETACHED → VERIFY CORRECTED SUCCESSOR → OWNER REVIEW → AT NEXT HOOK, REPLACE CURRENT HOOK WITH CORRECTED SUCCESSOR`

There should be no unnecessary live gap in which the cinematic is removed only to be restored later.

---

## 1. Current live authority

The current cinematic live baseline is the merge of PR #2801:

`99025b828629548be1ea066cd2e01dd16d855a03`

Current production player:

`assets/compass/compass.orientation-cinematic.js`

Current player contract:

`COMPASS_PRERENDERED_THIN_PLAYER_T12_v1`

Current production master:

`assets/compass/cinematic-media/compass-main-orientation-final-v1.mp4`

Frozen current-master identity:

- bytes: `3,828,177`
- SHA-256: `6ada38eadeb6243b3809167f45dd8a74808c88ac677273683338772e7899b4e7`
- Git blob: `ca95d7c17ef54044a11bc456a949c33fa9820bc0`
- source head: `96c89ec797490a5dc0e3dd343f4d34a396adaa02`
- master runtime: `38.0 s`

Later unrelated repository work may advance `main` without changing this cinematic baseline. Resolve current `main` at execution time and revalidate cinematic identities before mutation.

The current thin player mounts on ordinary homepage entry. That hooked state is intentionally retained while successor work proceeds.

The current live artifact is the inspection baseline, not the target final state.

---

## 2. Governing owner disposition

Owner disposition for this cycle:

`LEAVE_CURRENT_CINEMATIC_HOOKED_WHILE_SUCCESSOR_IS_CORRECTED`

This replaces the prior operating assumption that refinement requires the cinematic to be unhooked first.

Do not perform a standalone unhook operation as a preparatory step.

Unhook remains an emergency rollback capability if the live baseline itself becomes unacceptable or broken. It is not the normal next move.

---

## 3. Corrected defect model

The current master has two primary defect classes plus one entry-transition regression.

### A. Editorial implementation defect — CONFIRMED

The designed repeating grammar is staggered and text-led:

`Diamond Gate Bridge title/bridge dissolve → text appears → image follows → text dissolves first → image remains briefly → next text appears before visual rhythm fully resets → next image follows`

The intended invariant is:

`TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT`

with the next text allowed to begin during the preceding image's carry interval.

What shipped instead behaves materially like:

`bridge/title dissolve → text → text → text → text → imagery finally begins → image/text beats compress rapidly`

Result:

- first half reads visually empty;
- images that should answer individual statements are absent or deferred;
- second half becomes crowded;
- late Brain / Trophy / House material absorbs timing debt created upstream;
- the film loses the designed editorial continuity.

Required correction:

- text leads every applicable beat;
- corresponding image follows after a deliberate short delay;
- text exits before its image;
- image carries the thought forward briefly;
- next text may begin while the prior image still remains;
- the grammar repeats throughout the story;
- no long text-only run;
- no late image pileup;
- no compression of Brain / Trophy / House to compensate for omitted earlier visuals.

Do **not** repair this by globally sliding the entire image track earlier. Restore the authored local relationship beat by beat.

### B. Source-authority defects — CONFIRMED

Some images that do appear are not bound to the current authoritative website state.

The successor must correct source authority independently of editorial timing. Correct timing using the wrong source still fails.

### C. Start-transition regression — CONFIRMED

The current thin player hides the gate and starts the MP4 directly. The established entry-transition law was lost.

The historical transition is recoverable from repository authority and should inform the successor entry layer.

---

## 4. Audralia — confirmed wrong-model regression

Classification:

`AUDRALIA_SOURCE_BINDING_DEFECT = CONFIRMED_WRONG_MODEL_REGRESSION`

The current cinematic Audralia shot uses a retired river-model state containing dark, unnaturally straight branching channel forms across the terrain. The current live Audralia authority does not present the world that way.

Freeze the repair as:

- cinematic beat: **keep**;
- established camera/composition: **keep**;
- established timing concept: **keep**, except as required by the separate editorial cadence repair;
- cinematic world model currently used: **reject**;
- retired river-model source: **reject**;
- required source: **current live-authoritative Audralia world**.

Governing implementation rule:

`KEEP SHOT → REPLACE MODEL SOURCE → VERIFY AGAINST LIVE AUDRALIA AUTHORITY`

Do not redesign the Audralia beat merely because its source was wrong.

Do not recreate an approximate Audralia model for the cinematic if the live authority can be bound directly or deterministically derived.

---

## 5. Mirrorland — confirmed presentation/source defect and preferred continuity correction

Classification:

`MIRRORLAND_PRESENTATION_SOURCE_AUTHORITY_DEFECT = CONFIRMED`

The existing cinematic reveal degrades into a low-detail, placeholder-like outlined portal / green grid environment that does not faithfully represent the current live Mirrorland presentation.

The dissolve/reveal idea remains valuable. The fabricated revealed interior does not.

Preferred correction:

`Mirrorland window → panes dissolve / window enlarges → current live Audralia becomes visible through the window → window / viewport expands → Audralia fills the frame → continue directly into the established Audralia shot`

Freeze the following:

- preserve Mirrorland's recognizable window framing and dissolve language long enough to establish the threshold;
- remove the fabricated grid/interior environment entirely;
- reject the simplified placeholder-like revealed geometry;
- reveal **current live-authoritative Audralia** through the Mirrorland panes/window;
- use progressive window expansion, camera push, or equivalent continuity so the Audralia image naturally becomes the next full-frame scene;
- use the **same underlying Audralia authority** in the Mirrorland reveal and subsequent Audralia shot;
- scale/crop/camera treatment may differ during the handoff, but the underlying world state must not swap;
- preserve the text-led / image-lagged editorial grammar around the transition.

Governing source law:

`ONE AUDRALIA AUTHORITY → MIRRORLAND REVEAL + AUDRALIA SHOT`

This is not permission to construct a new Mirrorland interior environment.

It is a continuity correction using existing authoritative subjects.

---

## 6. Entry transition — historical law preserved, presentation evolved

### 6.1 Recovered historical authority

PR #2697 and PR #2743 recover the established entry-transition law:

`SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER`

The historical recovered timing is:

- `0.000–0.140 s`: selected control response / hold;
- `0.140 s`: tessellation onset;
- `0.820 s`: initial diamond-cell formation complete;
- through `2.300 s`: cells migrate toward successor targets;
- `1.700–3.550 s`: Compass geometry progressively emerges;
- starfield strengthens while the entry card fades/scales slightly;
- `4.350 s`: interactive preroll completes;
- first successor frame must already be presentable before the entry surface disappears;
- the 38-second film clock begins only after that handoff.

The `4.35 s` preroll remains **outside** the MP4 runtime.

Historical particle/source behavior:

- staggered diamond cells originate from the selected Play/Begin control;
- approximately `62%` route toward Compass targets;
- remainder route toward Fibonacci-style star targets;
- cells shrink, rotate, arc, and fade during travel;
- Compass progressively coheres;
- entry card fades and scales slightly;
- no blank frame is permitted between preroll and film.

### 6.2 Corrected understanding of the historical effect

Do not describe the historical implementation as "the entire homepage pixelates away."

The recovered implementation tessellated the selected control while the surrounding card independently faded.

That distinction is resolved.

### 6.3 Preferred successor evolution

For the next hook, preserve the historical law but improve the causality.

The successor interpretation is:

`SELECTED_CONTROL_INITIATES_ENTRY_SURFACE_TESSELLATION_INTO_SUCCESSOR_STAR_AND_COMPASS_MATTER`

The desired visual behavior is:

`ENTRY_READY → Play selected → button begins fragmenting → fragmentation propagates into its containing entry card/stage → actual visible entry surface disappears cell-by-cell → corresponding fragments become mobile → fragments migrate toward Compass/star targets → successor field is revealed underneath → Compass coheres → first MP4 frame is ready/presentable → final remnants clear → zero-blank-frame handoff → MP4 clock starts → PLAYING`

The key improvement is not "more particles." It is a one-to-one source/material relationship:

`SOURCE_CELL_DISAPPEARS ↔ MATCHING_FRAGMENT_BECOMES_MOBILE`

No free-floating particle should appear without a visually traceable source region disappearing from the entry surface.

Preferred propagation grammar:

`Play control → action row → lower card → headline/body region → card perimeter → residual stage`

with enough irregularity that it does not read as a rectangular wipe.

Fragments should inherit visual information from their source where practical:

- warm/gold control or border material may become warmer Compass matter;
- bright typography may become brighter stellar fragments;
- darker stage/card regions should produce restrained low-luminance fragments rather than uniform bright particles.

The successor field should already exist underneath at very low intensity so the film appears latent behind the interface rather than loaded after it.

The historical `4.35 s` envelope remains the default timing floor. Do not lengthen it automatically.

### 6.4 Thin-player readiness boundary

The current architecture is a pre-rendered MP4 plus thin player. Keep that architecture.

Do not re-edit the master merely to implement the interactive entry transition.

The historical condition "S01 frame 0 rendered before gate removal" becomes:

`FIRST_MP4_FRAME_DECODED_AND_PRESENTABLE_BEFORE_ENTRY_SURFACE_REMOVAL`

The entry layer remains present until that condition is satisfied.

No fall-through-to-black is permitted.

The visitor experience therefore remains:

`4.35 s interactive preroll + 38.0 s cinematic master`

not a longer MP4.

---

## 7. Next-master editorial construction contract

The corrected successor master must restore the staggered cadence as a repeated local grammar, not merely at the opening.

For every applicable narrative beat define four ordered events:

1. `TEXT_IN`
2. `IMAGE_IN`
3. `TEXT_OUT`
4. `IMAGE_OUT`

Required relation:

`TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT`

The next beat's `TEXT_IN` may occur before the previous beat's `IMAGE_OUT` to create continuity.

Every beat should be inspected for:

- statement lead time;
- image response delay;
- text dwell;
- image carry;
- overlap into next statement;
- sufficient late-film breathing room.

There must be no accumulated upstream timing debt that forces Brain, Trophy, House, or the return/handoff to rush.

The objective is not simultaneous text/image synchronization.

The objective is a deliberate text-led, image-lagged rhythm.

---

## 8. Direct successor construction strategy while the current hook stays live

### Phase N0 — freeze current live baseline

Treat PR #2801 / cinematic baseline `99025b828629548be1ea066cd2e01dd16d855a03` as the live inspection baseline unless a later explicit cinematic replacement supersedes it.

Do not mutate it merely to begin successor work.

### Phase N1 — construct corrected master detached from the live hook

Build the corrected cinematic master from the current accepted creative structure, applying:

- beat-by-beat staggered editorial cadence restoration;
- current authoritative Audralia source binding;
- Mirrorland-to-Audralia continuity redesign using the same Audralia authority;
- preserved Brain / Trophy / House breathing room;
- no fabricated substitute environments;
- no unrelated site/runtime redesign.

The new master must receive a new immutable identity. Do not overwrite the existing frozen PR #2801 master in place during construction.

### Phase N2 — construct the evolved entry preroll in the thin player

Adapt the recovered historical 4.35-second entry grammar to the current pre-rendered player architecture.

Keep the MP4 itself independent of the preroll.

The entry implementation must preserve:

- Play as the ignition point;
- surface-to-fragment correspondence;
- Compass/star target split derived from the historical model;
- progressive field emergence;
- first-frame readiness gate;
- no blank-frame handoff;
- Skip, Escape, reduced-motion, focus/restoration, URL/history invariance, and fail-open behavior appropriate to the current thin-player contract.

### Phase N3 — detached review of the complete successor

Review the corrected master and entry transition as one visitor experience while still detached from ordinary production activation.

Required review questions:

- Does the text→image→text-out→image-carry grammar repeat consistently?
- Is there any text-only desert?
- Is there any late image pileup?
- Does Mirrorland naturally become Audralia rather than revealing a fabricated interior?
- Does Audralia visibly match current live authority?
- Do Brain / Trophy / House retain intended pacing?
- Does the entry surface genuinely become successor matter rather than particles appearing over a fading card?
- Does the first MP4 frame appear without black/blank interruption?
- Does the combined experience still feel like one continuous homepage-to-film handoff?

### Phase N4 — proportional qualification

Use the established bounded cinematic precedent. Do not turn residual cinematic uncertainty into an infrastructure project.

Verify only what the changed surfaces materially require, including:

- exact master identity and decode integrity;
- source-authority bindings;
- editorial timing contract;
- entry transition timing and readiness boundary;
- Play;
- Skip from armed/preroll/playing as applicable;
- Escape equivalence where retained;
- natural completion;
- reduced motion;
- restoration/focus;
- no navigation/history/analytics mutation;
- desktop/tablet/portrait presentation at focused acceptance points;
- no black/blank handoff.

Do not create a new generic browser substrate, new control-plane bridge, or unrelated runtime architecture merely to approve this bounded successor.

### Phase N5 — owner disposition

Only after the complete successor has been reviewed should the owner choose:

`READY_FOR_NEXT_HOOK` or `CONTINUE_REFINEMENT`

Do not infer hook authority from construction completion alone.

### Phase N6 — next hook is a direct replacement, not an unhook/re-hook cycle

When the successor is accepted:

- keep the existing current hook active until the corrected successor is ready to become production authority;
- perform the smallest bounded production replacement needed to point ordinary entry at the accepted successor player/master;
- do not insert a standalone unhook commit between the current and successor films;
- preserve rollback capability to the current known baseline or another explicitly frozen predecessor if the new live result is rejected.

Target transition:

`CURRENT_HOOK_V1 → CORRECTED_HOOK_V2`

not:

`CURRENT_HOOK_V1 → NO_HOOK → CORRECTED_HOOK_V2`

---

## 9. Acceptance matrix for the next hook

| Dimension | Required result |
|---|---|
| Current live state during construction | Remains hooked |
| Master architecture | Pre-rendered MP4 retained |
| Interactive preroll | Outside MP4 runtime |
| Entry timing floor | Historical 4.35 s envelope unless material review justifies change |
| Entry causality | Actual visible entry surface fragments into successor matter |
| First-frame boundary | MP4 first frame decoded/presentable before entry removal |
| Blank frame | None |
| Editorial cadence | Text leads; image follows; text exits first; image carries |
| Early visual density | No long text-only sequence |
| Late visual density | No deferred image pileup |
| Brain / Trophy / House | No compression caused by upstream omissions |
| Audralia | Current live-authoritative world model |
| Mirrorland revealed subject | Live-authoritative Audralia, not fabricated grid environment |
| Mirrorland→Audralia continuity | Same Audralia authority through reveal and full-frame shot |
| Fabricated substitute environment | Prohibited for this correction |
| MP4 modification for entry effect | Prohibited; preroll belongs to thin player |
| Navigation/history/analytics mutation | None unless separately authorized |
| Next release choreography | Direct hook replacement after acceptance |

---

## 10. Protected boundaries

This strategy does not authorize unrelated changes to:

- Compass controller authority;
- Compass crystals;
- navigation/routing;
- analytics;
- durable/shared application state;
- unrelated Mirrorland product runtime;
- unrelated Audralia product runtime;
- Research Frontier;
- Governance;
- control-plane infrastructure.

Source authority may be **read/consumed** for the cinematic without mutating those live authorities unless a separately admitted operation explicitly says otherwise.

Do not confuse "use the current live source" with "rewrite the live source."

---

## 11. Image-generation boundary

No image generation is required or authorized by this strategy.

The correction is source-bound:

- use current live-authoritative website imagery/geometry/content;
- use the existing cinematic design language;
- remove fabricated placeholder environments;
- do not create substitute concept art to solve source-binding defects.

---

## 12. Failure / rollback posture

Keeping the current film hooked during successor construction does not eliminate rollback discipline.

If the current live film develops a concrete production failure independent of successor work, use the established reversible hook/unhook boundary proportionally.

If the next hooked successor is rejected after publication, roll back to an explicitly frozen known baseline rather than improvising a third presentation in production.

Do not treat a visual rejection as evidence that the website runtime itself must be redesigned.

---

## 13. Durable defect ledger

At this strategy freeze, the material ledger is:

`D01 — EDITORIAL_STAGGERED_CADENCE_NOT_IMPLEMENTED_CONSISTENTLY — CONFIRMED`

Required: restore repeated local `TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT` grammar with image carry and no late pileup.

`D02 — AUDRALIA_WRONG_MODEL_REGRESSION — CONFIRMED`

Required: preserve cinematography; replace retired river-model binding with current live-authoritative Audralia.

`D03 — MIRRORLAND_PRESENTATION_SOURCE_AUTHORITY_DEFECT — CONFIRMED`

Required: preserve dissolve/window concept; remove placeholder grid/interior; reveal current Audralia and expand directly into the Audralia shot.

`D04 — ENTRY_TRANSITION_HISTORICAL_REGRESSION — CONFIRMED`

Historical authority: `SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER`, 4.35-second preroll outside the master.

Successor refinement: actual entry surface tessellates into corresponding mobile fragments rather than particles simply appearing over an independently fading surface.

`D05 — CURRENT_HOOK_STATE_DURING_SUCCESSOR_WORK — OWNER_DISPOSITION`

Required: leave the current PR #2801 cinematic hooked until the accepted successor is ready for direct replacement.

---

## 14. Immediate next material move

Do **not** unhook the current production cinematic.

The next material move is:

**Construct the corrected successor as a detached next-hook candidate, beginning with a complete beat-by-beat timing/source map that restores the text-led image-lagged editorial grammar and binds the Mirrorland→Audralia sequence to one current live Audralia authority. In parallel, adapt the recovered 4.35-second entry law into a true entry-surface tessellation layer for the existing thin-player architecture. Preserve the current live hook until that successor is reviewed and explicitly accepted for direct replacement.**

Operating shorthand:

`KEEP CURRENT HOOK → CORRECT SOURCES + CADENCE → EVOLVE ENTRY PREROLL → REVIEW DETACHED SUCCESSOR → DIRECT NEXT HOOK`
