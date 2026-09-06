# Compass Main Homepage Cinematic — Current Successor Handoff

Status: **CURRENT / CONTROLLING**  
Date: 2026-09-06

Read current `AI_ENTRYPOINT.json` first.

Then read these three controlling V2 documents:

1. **WHAT V2 must be**  
   `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_NEXT_HOOK_DIRECT_STRATEGY_20260906.md`
2. **HOW V2 is produced and resumed**  
   `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_V2_EXECUTION_SPINE_CURRENT.md`
3. **HOW execution transport is resolved without defaulting to an environment**  
   `docs/COMPASS_MAIN_HOMEPAGE_CINEMATIC_EXECUTION_ROUTE_CLARIFICATION.md`

For execution-route questions, the clarification supersedes any example environment/substrate wording in older V2 documentation.

## Current product state

Current cinematic live baseline remains PR #2801:

`99025b828629548be1ea066cd2e01dd16d855a03`

Current state:

`INTRO_HOOKED_LIVE — PRERENDERED_THIN_PLAYER`

Current master:

`assets/compass/cinematic-media/compass-main-orientation-final-v1.mp4`

Identity:

- bytes: `3,828,177`
- SHA-256: `6ada38eadeb6243b3809167f45dd8a74808c88ac677273683338772e7899b4e7`
- Git blob: `ca95d7c17ef54044a11bc456a949c33fa9820bc0`
- runtime: `38.0 s`

The current cinematic stays hooked while V2 is built and reviewed detached.

Target release choreography:

`CURRENT_HOOK_V1 → CORRECTED_HOOK_V2`

No routine interim unhook.

## Critical semantic separation

Do not collapse these surfaces:

`V2 CAPTURE SOURCE → NEW IMMUTABLE V2 MP4`

`THIN-PLAYER 4.35 s ENTRY PREROLL → FIRST V2 FRAME READY → VIDEO PLAYBACK`

`PRODUCTION HOOK / PUBLICATION → ORDINARY HOMEPAGE ENTRY`

“Source binding” means construction-time source selection for the V2 capture source. The existing V1 MP4 has no live website asset binding to switch.

## Confirmed V2 corrections

- restore the repeating text-led/image-lagged cadence: `TEXT_IN < IMAGE_IN < TEXT_OUT < IMAGE_OUT`;
- remove the early text-only desert and late image pileup;
- protect Brain/Trophy/House breathing room;
- reject the retired Audralia river-model state;
- freeze one current live-authoritative Audralia world state and use it both through the Mirrorland reveal and in the succeeding full Audralia shot;
- remove the fabricated Mirrorland grid/interior environment while preserving the window/dissolve threshold concept;
- recover/evolve the historical 4.35-second entry transition from PR #2697/#2743;
- preserve `SELECTED_CONTROL_CELLS_BECOME_SUCCESSOR_STAR_AND_COMPASS_MATTER` as the historical law while evolving the visual causality so actual source cells disappear as matching fragments become mobile;
- require the first V2 MP4 frame to be decoded/presentable before final entry material clears;
- keep zero blank frame.

## D0 — documentation adoption comes before R0

The V2 strategy/spine/clarification are not production authority until their documentation candidate is adopted to `main`.

For the current documentation candidate, D0 requires the exact repository static-editorial verifier to PASS against the exact base/head and declared documentation paths.

Required result:

`D0_STATIC_EDITORIAL_VERIFIER_PASS`

A passive CI success is not a substitute for this result.

### Capability-first execution law

D0 does **not** prescribe an execution environment.

The lawful sequence is:

`REQUIRED VERIFIER EVIDENCE → CURRENT AI_ENTRYPOINT → CURRENT ROOM'S ALREADY-AUTHORIZED CAPABILITIES → EXECUTE IF DIRECTLY AVAILABLE → OTHERWISE RECORD EXACT BOUNDARY AND STOP`

Do not translate an acquisition failure such as `Could not resolve host: github.com` into “use a particular hosted workspace,” “open a builder,” “create a workflow,” or any other default transport.

A named environment is not the next action.

The next action is always the unresolved evidence requirement itself. A later room resumes D0 and resolves whatever authorized execution capability is actually available there.

If no current capability can run the required verifier against the exact repository state, leave D0 unresolved and keep the documentation candidate draft. Do not bypass or relabel the proof.

## R0→R10 production ladder

Only after D0 adoption closes does V2 begin:

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

The execution spine defines the required evidence and proven deterministic semantics for each state. The execution-route clarification governs how a room chooses transport: **capability-first, never environment-first**.

## Historical precedent — use semantics, not default transports

Reusable authorities include:

- deterministic capture donor: `96c89ec797490a5dc0e3dd343f4d34a396adaa02`;
- entry interaction: PR #2697 / PR #2743 candidate `589b50d8178539b3241ad42315e4a38120040522`;
- anti-reinvention protocol: PR #2754;
- deterministic encode semantics: PR #2796 / run `34049018018`;
- installed bounded binary ingress and reconstruction mechanisms;
- binary-custody precedent: #1334, #1323, #1340, #2798, #2799;
- V1 publication boundary: PR #2801.

Historical workflows/carriers prove semantics and evidence. They are not standing instructions to recreate their transport under the current AI entrypoint.

## Immediate instruction for any new room

1. Read current `AI_ENTRYPOINT.json`.
2. Read this handoff.
3. Read the direct strategy.
4. Read the V2 execution spine.
5. Read the execution-route clarification.
6. Determine whether D0 documentation adoption is already closed on `main`.
7. If D0 is unresolved, resume D0 only; do not begin R0/R1.
8. Resolve the current room's already-authorized capabilities without naming or creating a default environment.
9. If D0 is closed, locate R0→R10 evidence and execute only the first unresolved state.
10. Persist the exact checkpoint before advancing.
11. Keep V1 live until an owner-accepted V2 is ready for direct replacement.

Operating law:

`NO DEFAULT SUBSTRATE → NO INFRASTRUCTURE INVENTION → CLOSE THE REQUIRED EVIDENCE WITH WHATEVER CURRENT AUTHORIZED CAPABILITY ACTUALLY EXISTS → OTHERWISE STOP AT THAT EXACT STATE`
