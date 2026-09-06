# Compass Main Homepage Cinematic — Current Successor Handoff

Status: **CURRENT / CONTROLLING**  
Date: 2026-09-06

Read current `AI_ENTRYPOINT.json` first.

Then read these three controlling V2 documents:

1. **WHAT V2 must be**  
   `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_NEXT_HOOK_DIRECT_STRATEGY_20260906.md`
2. **HOW V2 is produced and resumed**  
   `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_V2_EXECUTION_SPINE_CURRENT.md`
3. **HOW execution capability is resolved without defaulting to an environment**  
   `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_EXECUTION_ROUTE_CLARIFICATION.md`

For execution-route questions, the clarification supersedes any historical/example substrate wording.

## Current production state

Current cinematic live baseline remains PR #2801:

`99025b828629548be1ea066cd2e01dd16d855a03`

State:

`INTRO_HOOKED_LIVE — PRERENDERED_THIN_PLAYER`

Current master:

`assets/compass/cinematic-media/compass-main-orientation-final-v1.mp4`

Identity:

- bytes: `3,828,177`
- SHA-256: `6ada38eadeb6243b3809167f45dd8a74808c88ac677273683338772e7899b4e7`
- Git blob: `ca95d7c17ef54044a11bc456a949c33fa9820bc0`
- runtime: `38.0 s`

V1 stays hooked while V2 is built and reviewed detached.

Target release choreography:

`CURRENT_HOOK_V1 → CORRECTED_HOOK_V2`

No routine interim unhook.

## Surface separation

Do not collapse:

`V2 CAPTURE SOURCE → NEW IMMUTABLE V2 MP4`

`THIN-PLAYER 4.35 s ENTRY PREROLL → FIRST V2 FRAME READY → VIDEO PLAYBACK`

`PRODUCTION HOOK / PUBLICATION → ORDINARY HOMEPAGE ENTRY`

“Source binding” means construction-time source selection for V2. V1 cannot be runtime-rebound.

## Confirmed V2 corrections

- restore `TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT` throughout;
- remove early text-only desert and late image pileup;
- preserve Brain/Trophy/House breathing room;
- reject retired Audralia river-model state;
- freeze one current live-authoritative Audralia world state for both Mirrorland reveal and succeeding Audralia shot;
- remove fabricated Mirrorland grid/interior while keeping window/dissolve threshold concept;
- recover/evolve PR #2697/#2743 4.35-second entry interaction;
- historical law remains `SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER`;
- successor causality: `SOURCE_CELL_DISAPPEARS ↔ MATCHING_FRAGMENT_BECOMES_MOBILE`;
- first V2 frame decoded/presentable before entry material clears;
- zero blank frame.

## D0 — documentation adoption before R0

V2 production must not begin until the controlling documentation candidate is adopted to `main`.

For `STATIC_EDITORIAL_MICRO`, D0 requires exact PASS from the repository-required static-editorial verifier against exact base/head and declared documentation paths.

Required result:

`D0_STATIC_EDITORIAL_VERIFIER_PASS`

Passive CI is not a substitute unless current repository authority explicitly says otherwise.

### Capability-first law

D0 does **not** prescribe an execution environment.

Lawful route:

`REQUIRED VERIFIER EVIDENCE → CURRENT AI_ENTRYPOINT → CURRENT ROOM'S ALREADY-AUTHORIZED CAPABILITIES → EXECUTE IF DIRECTLY AVAILABLE → OTHERWISE RECORD EXACT BOUNDARY AND STOP`

An acquisition failure such as:

`Could not resolve host: github.com`

is only evidence that that attempt could not acquire the exact repository state.

It is **not** an instruction to use any named workspace, builder, clone, workflow, CI path, or bridge.

A named environment is not the next action.

The unresolved evidence requirement is the next action. A later room resumes D0 and resolves whatever authorized capability actually exists there.

If no capability in the current room can execute the verifier against the exact repository state, keep D0 unresolved and the candidate draft. Do not bypass, relabel, or invent infrastructure.

## R0→R10 production ladder

Only after D0 closes:

`R0 CURRENT STATE`
→ `R1 SOURCE AUTHORITY`
→ `R2 EDITORIAL MAP`
→ `R3 CAPTURE SOURCE`
→ `R4 REPRESENTATIVE VISUALS`
→ `R5 FULL CAPTURE`
→ `R6 IMMUTABLE V2 MASTER`
→ `R7 GIT BINARY CUSTODY`
→ `R8 THIN PLAYER / PREROLL`
→ `R9 FOCUSED QUALIFICATION + OWNER REVIEW`
→ `R10 DIRECT V1→V2 PUBLICATION`

Resume only the first state lacking exact durable evidence.

The spine defines evidence and deterministic semantics. The execution-route clarification governs transport selection: **capability-first, never environment-first**.

## Historical precedent

Reusable authority includes:

- capture donor `96c89ec797490a5dc0e3dd343f4d34a396adaa02`;
- entry interaction PR #2697 / PR #2743 candidate `589b50d8178539b3241ad42315e4a38120040522`;
- anti-reinvention PR #2754;
- deterministic encode semantics PR #2796 / run `34049018018`;
- installed bounded binary ingress/reconstruction mechanisms;
- binary custody precedent #1334, #1323, #1340, #2798, #2799;
- publication boundary PR #2801.

Historical transports prove semantics. They are not standing instructions to recreate their execution environment.

## Immediate instruction for any new room

1. Read current `AI_ENTRYPOINT.json`.
2. Read this handoff.
3. Read direct strategy.
4. Read V2 execution spine.
5. Read execution-route clarification.
6. Determine whether D0 is closed on `main`.
7. If D0 is unresolved, resume D0 only; do not start R0/R1.
8. Resolve only already-authorized capabilities actually available in the current room.
9. Do not name, create, or recommend a default execution environment because one capability is absent.
10. If D0 is closed, locate R0→R10 evidence and execute only the first unresolved state.
11. Persist the exact checkpoint before advancing.
12. Keep V1 live until owner-accepted V2 is ready for direct replacement.

Operating law:

`NO DEFAULT SUBSTRATE → NO INFRASTRUCTURE INVENTION → CLOSE THE REQUIRED EVIDENCE WITH A CURRENTLY AUTHORIZED AVAILABLE CAPABILITY → OTHERWISE STOP AT THAT EXACT STATE`
