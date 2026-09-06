# Compass Cinematic Production Traversal Ledger

Status: **CONTROLLING EXECUTION COMPANION**  
Date: 2026-09-05  
Governing production contract: `docs/CINEMATIC_PRODUCTION_EXECUTION_CONTRACT.md`  
Precedent authority: issue #2592 / PR #2593 (About cinematic), issue #2787  
Scope: Compass single-master successor only

## Purpose

This ledger converts the cinematic production plan into a state-by-state traversal so a fresh room can continue from the first unresolved material boundary without restarting discovery, broadening scope, or inventing another production architecture.

The governing rule is:

`ONE STATE = ONE MATERIAL QUESTION = ONE ACCEPTANCE CONDITION = ONE NEXT STATE`

A successor room must not resume from a narrative summary. It must find the first state below that lacks repository/artifact-backed PASS evidence and continue there.

## Required state record

Every state checkpoint must record exactly these fields:

- `ENTRY_IDENTITY` — exact base/candidate/artifact identity consumed by the state.
- `ALLOWED_MUTATION` — exact bounded paths or artifact operation permitted in that state.
- `PASS_EVIDENCE` — exact evidence required to advance.
- `FAIL_STOP_CODE` — deterministic stop disposition if the state cannot pass.

Optional commentary may explain evidence, but commentary cannot replace these four fields.

## Global invariants

These invariants apply to every state:

- About precedent governs anti-reinvention: preserve an accepted floor and replace only the deficient object/beat.
- No Codespaces.
- No GitHub Actions as agent-execution transport unless separately and explicitly authorized.
- No destination application/runtime becomes a playback or manufacturing dependency when a smaller authoritative source donor can produce the same visible truth.
- No wrapper-on-wrapper architecture merely because a previous branch already contains wrappers.
- No historical cinematic-runtime reconstruction as a prerequisite to the single-master target.
- No animation/timing redesign unless separately authorized after corrected source truth is visible.
- Branch creation, source enumeration, provenance notes, copied renderers, and infrastructure diagnosis are not film progress.
- Browser/render qualification is not a prerequisite to constructing the complete capture-ready source. It becomes a hard gate at T7.
- A failed environmental renderer probe does not authorize creative/runtime redesign.
- If two consecutive construction increments add machinery/preparation without yielding a more complete visible cinematic candidate, stop with `ANTI_REINVENTION_CHECK_REQUIRED` before another increment.

## Frozen correction set

Only the following correction set is in scope for the master unless later owner authority explicitly changes it:

1. Mirrorland source-truth representation.
2. Audralia source-truth representation.
3. Brain presentation/compositing while preserving geometry.
4. Trophy presentation/compositing while preserving geometry.
5. House mature-source representation and visitor meaning.
6. One shot-aware tour-context grammar across S01-S08.

Protected unless separately authorized:

- live Compass controller/cardinal/navigation authority;
- readiness/capability authority;
- analytics/history/navigation;
- Characters/Mirrorland product runtime;
- Audralia/H-Earth product runtime;
- Brain/Trophy/House source-geometry authorities.

---

## T0 — Recover exact accepted floor

**Material question:** What exact current repository state and accepted cinematic floor are we continuing from?

`ENTRY_IDENTITY`
- exact current `refs/heads/main` SHA;
- issue #2756 storyboard/source authority;
- issue #2787 production/precedent authority;
- exact accepted film-floor source paths and frozen timing/shot boundaries;
- exact protected path set.

`ALLOWED_MUTATION`
- none; read-only recovery only.

`PASS_EVIDENCE`
- current `main` SHA resolved;
- accepted cinematic floor identified by exact commit/blob/path identities;
- correction set and protected surfaces restated without expansion;
- no unresolved ambiguity about whether the target is one pre-rendered master plus a later thin player.

`FAIL_STOP_CODE`
- `T0_ACCEPTED_FLOOR_IDENTITY_UNRESOLVED`

**Next state:** T1.

---

## T1 — Open one bounded successor

**Material question:** Is there exactly one clean production candidate rooted at T0?

`ENTRY_IDENTITY`
- T0 exact `main` SHA.

`ALLOWED_MUTATION`
- create one bounded successor branch only.

`PASS_EVIDENCE`
- branch root equals T0 SHA;
- branch has no product delta immediately after creation;
- status reported truthfully as `BRANCH_CREATED / PRODUCT_CONSTRUCTION_NOT_STARTED`.

`FAIL_STOP_CODE`
- `T1_BRANCH_ROOT_NOT_EXACT`

**Next state:** T2.

---

## T2 — Correct Mirrorland only

**Material question:** Can S05 become source-true without importing the full Characters application as a manufacturing dependency?

`ENTRY_IDENTITY`
- accepted T1 floor plus authoritative Mirrorland threshold/world donors.

`ALLOWED_MUTATION`
- only the minimum cinematic paths required to replace the S05 visual representation.

`PASS_EVIDENCE`
- canonical 21-pane threshold identity remains recognizable;
- mature/source-true Mirrorland treatment is visible in the candidate source;
- approved crossing cinematography and timing remain intact;
- no full Characters application/runtime dependency unless exact evidence proves no smaller donor can satisfy the frame;
- exact diff shows no unrelated beat or protected-surface mutation.

`FAIL_STOP_CODE`
- `T2_MIRRORLAND_REQUIRES_UNJUSTIFIED_APPLICATION_DEPENDENCY`

**Next state:** T3.

---

## T3 — Correct Audralia only

**Material question:** Can S06 use authoritative planetary/world truth without a cartoon reconstruction or full destination application dependency?

`ENTRY_IDENTITY`
- accepted T2 floor plus authoritative Audralia/H-Earth renderer donor.

`ALLOWED_MUTATION`
- only the minimum cinematic paths required for the S06 replacement.

`PASS_EVIDENCE`
- visible Audralia is derived from an authoritative world/planet renderer or faithful direct derivative;
- no bespoke simplified 2D/cartoon substitute remains as final authority;
- no full Audralia destination application dependency merely for visual fidelity;
- accepted arrival cinematography/timing remains intact;
- T2 Mirrorland correction remains intact.

`FAIL_STOP_CODE`
- `T3_AUDRALIA_SOURCE_TRUTH_NOT_ACHIEVED`

**Next state:** T4A.

---

## T4A — Brain presentation

**Material question:** Can Brain read cinematically while preserving the approved anatomical geometry?

`ENTRY_IDENTITY`
- accepted T3 floor plus approved Brain renderer/geometry authority.

`ALLOWED_MUTATION`
- Brain cinematic presentation/compositing only.

`PASS_EVIDENCE`
- approved Brain geometry unchanged;
- light/white card or iframe read removed from the visible composition;
- visitor meaning preserved: `Discover your Coherence Index.` / `Take a free coherence assessment.`;
- no new diagnostic/claim authority created.

`FAIL_STOP_CODE`
- `T4A_BRAIN_GEOMETRY_OR_CLAIM_BOUNDARY_CHANGED`

**Next state:** T4B.

---

## T4B — Trophy presentation

**Material question:** Can Trophy read cinematically while preserving the approved trophy geometry?

`ENTRY_IDENTITY`
- accepted T4A floor plus approved Trophy renderer/geometry authority.

`ALLOWED_MUTATION`
- Trophy cinematic presentation/compositing only.

`PASS_EVIDENCE`
- Trophy geometry unchanged;
- light/card presentation removed;
- Awards Chamber meaning is distinct from Brain and House;
- no new recognition claim is created.

`FAIL_STOP_CODE`
- `T4B_TROPHY_GEOMETRY_OR_AWARDS_CLAIM_CHANGED`

**Next state:** T4C.

---

## T4C — House source correction

**Material question:** Can the mature House source replace the weaker reconstruction while preserving the visitor-facing character meaning?

`ENTRY_IDENTITY`
- accepted T4B floor plus mature Phase-3 House authority.

`ALLOWED_MUTATION`
- House cinematic representation only.

`PASS_EVIDENCE`
- mature Phase-3 House source/faithful derivative is used;
- weaker partial-phase reconstruction is not final authority;
- composition remains contextual/in-estate rather than a generic card;
- visitor meaning is explicit: `Meet the characters.` / `Choose who you want to speak with.`;
- no character canon or navigation authority is invented.

`FAIL_STOP_CODE`
- `T4C_HOUSE_MATURE_SOURCE_NOT_PRESERVED`

**Next state:** T5.

---

## T5 — Install shot-aware context choreography

**Material question:** Can one semantic grammar explain the tour without becoming subtitles, page chrome, or a second state machine?

`ENTRY_IDENTITY`
- accepted T4C floor plus frozen S01-S08 semantic jobs.

`ALLOWED_MUTATION`
- context copy, placement, responsive presentation, and timing keyed only to the existing film clock/shot identity.

`PASS_EVIDENCE`
- one common typographic/motion grammar;
- shot-aware placement rather than one permanent lower-third;
- S07-A/S07-B/S07-C independently composed;
- no second clock, navigation state, application state machine, or destination authority;
- phone/tablet placement may differ while meaning remains identical.

`FAIL_STOP_CODE`
- `T5_CONTEXT_BECAME_SECOND_RUNTIME_OR_FIXED_OVERLAY`

**Next state:** T6.

---

## T6 — Capture-ready source integration freeze

**Material question:** Is there now one complete self-contained cinematic source that can be handed to a renderer without further architecture work?

`ENTRY_IDENTITY`
- accepted T5 floor.

`ALLOWED_MUTATION`
- integration-only reconciliation required to make the corrected source internally complete; no new feature or donor class.

`PASS_EVIDENCE`
- S01-S08 all present;
- Mirrorland, Audralia, Brain, Trophy, House and context corrections all integrated;
- frozen master duration and shot boundaries preserved unless separately authorized;
- no destination application/runtime playback dependency;
- no protected runtime/navigation/analytics mutation;
- exact changed-path set recorded;
- source loads from one bounded cinematic composition surface;
- no known placeholder/stand-in remains in an approved correction beat.

On PASS, the exact status is:

`CAPTURE_READY_SOURCE_COMPLETE`

Before T6 PASS, the phrases `MASTER_CONSTRUCTION_COMPLETE`, `MASTER_BUILT`, or equivalent are prohibited.

`FAIL_STOP_CODE`
- `T6_CAPTURE_READY_SOURCE_NOT_COMPLETE`

**Next state:** T7.

---

## T7 — Functional renderer preflight

**Material question:** Can this execution environment produce at least one real browser-rendered frame?

`ENTRY_IDENTITY`
- exact T6 capture-ready source head;
- exact renderer/browser executable identity.

`ALLOWED_MUTATION`
- no cinematic mutation; environment probe only.

`PASS_EVIDENCE`
- one trivial controlled local HTML frame rendered successfully by the intended browser/renderer;
- output file exists and decodes as an image;
- renderer invocation and version recorded.

If the probe fails after the permitted evidence-bearing attempts, stop at:

`CAPTURE_READY_SOURCE_COMPLETE / FRAME_RENDER_BLOCKED`

Do not reopen T2-T6 or add production layers to compensate for an environmental failure.

`FAIL_STOP_CODE`
- `T7_FUNCTIONAL_BROWSER_RENDERER_UNAVAILABLE`

**Next state:** T8.

---

## T8 — Representative-frame proof

**Material question:** Do the critical corrected beats render correctly before full-film expenditure?

`ENTRY_IDENTITY`
- exact T6 source head + T7 renderer identity.

`ALLOWED_MUTATION`
- render representative frames only; if a specific beat fails visually/source-semantically, repair only that beat under its corresponding T-state and then return here.

`PASS_EVIDENCE`
Representative frames must include at minimum:
- S01 arrival;
- S05 threshold entry/reveal;
- S06 Audralia;
- S07-A Brain;
- S07-B Trophy;
- S07-C House;
- S08 Compass handoff.

Each must preserve source identity, composition, context legibility, and transition-safe framing.

`FAIL_STOP_CODE`
- `T8_REPRESENTATIVE_FRAME_DEFECT_LOCALIZED`

**Next state:** T9.

---

## T9 — Full deterministic frame capture

**Material question:** Can the exact frozen T6 source be rendered end-to-end without creative/source changes during capture?

`ENTRY_IDENTITY`
- exact T6 source head;
- exact T7 renderer identity;
- representative-frame PASS from T8.

`ALLOWED_MUTATION`
- transient frame/capture artifacts only.

`PASS_EVIDENCE`
- full expected frame count produced for the frozen duration/frame rate;
- deterministic frame naming/order;
- no missing/corrupt frame;
- no creative/source mutation occurred during capture.

`FAIL_STOP_CODE`
- `T9_FULL_FRAME_CAPTURE_INCOMPLETE`

**Next state:** T10.

---

## T10 — Encode and verify master

**Material question:** Can the complete frame sequence become one verified delivery master?

`ENTRY_IDENTITY`
- exact T9 frame set;
- exact encoder/version/command identity.

`ALLOWED_MUTATION`
- media encoding and verification artifacts only.

`PASS_EVIDENCE`
- expected duration;
- expected dimensions;
- expected frame rate;
- required codec/container profile;
- full decode succeeds;
- fast-start/moov placement verified when applicable;
- media SHA-256 recorded;
- no frame-order or duration drift.

`FAIL_STOP_CODE`
- `T10_MASTER_ENCODE_OR_MEDIA_VERIFY_FAILED`

**Next state:** T11.

---

## T11 — Commit the master artifact

**Material question:** Is there now a repository-addressable immutable master candidate?

`ENTRY_IDENTITY`
- exact T10 verified media hash;
- exact T6 source head.

`ALLOWED_MUTATION`
- commit the verified master media and minimal custody metadata to the bounded production branch.

`PASS_EVIDENCE`
- concrete repository media path;
- Git blob identity;
- SHA-256;
- source head identity;
- branch ahead-of-base count greater than zero;
- changed paths remain bounded;
- no protected-surface mutation.

Only after T11 PASS may status be:

`MASTER_CANDIDATE_PRODUCED`

`FAIL_STOP_CODE`
- `T11_MASTER_NOT_COMMITTED_OR_CUSTODY_INCOMPLETE`

**Next state:** T12.

---

## T12 — Thin homepage player

**Material question:** Can the homepage present the verified master without recreating the film or changing Compass authority?

`ENTRY_IDENTITY`
- exact T11 media blob/hash;
- exact then-current homepage/Compass handoff identity.

`ALLOWED_MUTATION`
- minimal Play / Skip / Replay / reduced-motion presentation and media request identity only.

`PASS_EVIDENCE`
- player consumes the committed master;
- no destination runtime import;
- no film recreation in the player;
- single audio ownership with no overlap;
- Skip and natural completion converge on unchanged Compass handoff;
- Replay is bounded to the master;
- reduced-motion semantics remain complete;
- no navigation/history/analytics authority expansion.

`FAIL_STOP_CODE`
- `T12_THIN_PLAYER_EXPANDED_RUNTIME_AUTHORITY`

**Next state:** T13.

---

## T13 — Focused qualification and owner review

**Material question:** Does the exact master/player combination satisfy the bounded cinematic acceptance surface?

`ENTRY_IDENTITY`
- exact T12 candidate head;
- exact T11 media blob/hash.

`ALLOWED_MUTATION`
- none during qualification. Any defect requiring bytes returns to the specific responsible state under a fresh bounded candidate as required by repository policy.

`PASS_EVIDENCE`
At minimum:
- Play;
- Skip;
- Replay;
- natural completion;
- reduced motion;
- responsive phone/tablet/desktop presentation as applicable;
- audio ownership/no overlap;
- unchanged Compass handoff;
- focused transition inspection for S05/S06/S07;
- no protected runtime/navigation/analytics regression;
- owner visual inspection.

Do not expand this automatically into a full interactive-application matrix unless an actual runtime-authority change requires that class.

`FAIL_STOP_CODE`
- `T13_FOCUSED_CINEMATIC_ACCEPTANCE_FAILED`

**Terminal boundary on PASS:**

`SINGLE_MASTER_CINEMATIC_READY_FOR_OWNER_DISPOSITION`

---

## First-unpassed-state continuation rule

Every fresh production room must:

1. read this ledger and the governing production contract;
2. re-resolve exact current `main` and relevant candidate/artifact identities;
3. inspect recorded checkpoints beginning at T0;
4. find the first state without exact PASS evidence;
5. resume only that state;
6. never repeat a passed state merely because the room is new;
7. never skip a failed state by broadening architecture.

A state is not PASS because a previous room said it was complete. PASS requires the evidence named in that state's `PASS_EVIDENCE` section.

## Regression routing rule

If T8-T13 expose a defect, route it backward to the smallest responsible state:

- Mirrorland fidelity -> T2.
- Audralia fidelity -> T3.
- Brain presentation -> T4A.
- Trophy presentation -> T4B.
- House presentation -> T4C.
- context composition -> T5.
- integration/dependency problem -> T6.
- environment renderer failure -> T7 only; do not mutate cinematic source.
- frame capture failure -> T9.
- media encode/verification failure -> T10.
- custody/commit failure -> T11.
- player/handoff defect -> T12.

No defect discovered after T6 authorizes a whole-film reconstruction by default.

## Anti-monolith law

The following phrases are not executable states and must not be used as the sole next instruction:

- `fix the cinematic`;
- `correct the bounded beats`;
- `finish the master`;
- `render the film`;
- `qualify the cinematic`.

Every next instruction must name one ledger state and its material question.

## Durable production law

> **Resume from the first unpassed state. Preserve every accepted floor. Change one material thing at a time. Do not invent a new path when precedent already supplies the production method. Do not call preparation film progress. Do not reopen creative architecture after capture-ready source freeze unless a localized defect routes back to a named state.**
