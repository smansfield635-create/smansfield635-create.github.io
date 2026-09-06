# Compass Pre-Rendered Master — Input Freeze

Status: **FROZEN FOR PRODUCTION**  
Date: 2026-09-05  
Production branch: `cinematic/compass-pre-rendered-master-20260905-001`  
Exact base `main`: `db6589484f25d7af324ea97cff1fda63cbfd8865`  
Creative authority: issue #2756  
Execution authority: `docs/CINEMATIC_PRODUCTION_EXECUTION_CONTRACT.md`

## Production target

Produce one corrected self-contained pre-rendered Compass homepage cinematic master, followed only later by a thin Play / Skip / Replay / reduced-motion presentation layer that hands off to the unchanged live Compass.

This freeze does **not** authorize homepage activation, publication, timing redesign, destination-runtime mutation, navigation mutation, analytics mutation, or protected Compass authority mutation.

## Frozen correction set

Only these visual/semantic corrections are admitted for the master:

1. Mirrorland — replace the underdeveloped threshold-only representation with a source-true mature Mirrorland treatment while preserving the canonical 21-pane threshold identity and accepted crossing cinematography.
2. Audralia — replace the simplified 2D reconstruction with a faithful presentation derived from the mature Audralia/H-Earth world authority while preserving the accepted planetary-arrival cinematography.
3. Brain / Coheriscope — preserve approved anatomical geometry; correct compositing, context, and responsive presentation only.
4. Trophy / Awards — preserve approved trophy geometry; correct compositing, context, and responsive presentation only.
5. House / characters — use the mature Phase-3 House authority or a faithful derivative; preserve contextual/in-estate presentation and the visitor meaning `Meet the characters. Choose who you want to speak with.`
6. Persistent tour-context spine — preserve one restrained two-line semantic/typographic grammar across S01–S08, but choreograph its spatial placement shot-by-shot rather than fixing it to one lower-third position; no second application state machine or destination authority.

## Frozen source authorities

### Existing Compass cinematography / construction floor
- `assets/compass/compass.orientation-cinematic.js`
- `assets/compass/compass.orientation-cinematic.css`
- `assets/compass/compass.orientation-cinematic.render.js`
- `assets/compass/compass.orientation-cinematic.final.js`
- `assets/compass/compass.orientation-cinematic.media.js`
- `assets/compass/cinematic-media/manifest.v1.json`

### Mirrorland
- `assets/shared/mirrorland-window.geometry.js`
- `assets/compass/compass.mirrorland-window.js`
- `characters/index.html`
- `characters/app.mjs`
- `characters/cloud-system.mjs`

### Audralia
- `showroom/globe/audralia/index.html`
- `showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs`
- `inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs`

### Brain / Coheriscope
- `assets/compass/compass.hra-brain-scene.js`

### Trophy / Awards
- `assets/compass/compass.trophy-scene.js`

### House / characters
- `assets/compass/compass.house-scene.js`
- `assets/manor-blueprint/manor.estate.neutral-blockout.mjs`
- `assets/manor-blueprint/manor.estate.gothic-detail-phase1.mjs`
- `assets/manor-blueprint/manor.estate.gothic-detail-phase1b.mjs`
- `assets/manor-blueprint/manor.estate.gothic-detail-phase2.mjs`
- `assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs`

## Frozen semantic jobs

- S01 — Diamond Gate Bridge / establish arrival.
- S02 — Find your way / Compass orients the experience.
- S03 — Start here / Chapter One is the guided introduction.
- S04 — See what we're testing / see what's ready, without expanding claim ceilings.
- S05 — Cross into Mirrorland / enter the narrative world.
- S06 — Enter Audralia / explore a continuous planetary world.
- S07-A — Discover your Coherence Index / take a free coherence assessment.
- S07-B — Enter the Awards Chamber / see the work recognized and why.
- S07-C — Meet the characters / choose who you want to speak with.
- S08 — Return agency to the visitor through the Compass.

## Context choreography freeze

The word **persistent** in issue #2756 means persistent semantic and typographic continuity. It does **not** mean a permanently visible caption or a fixed lower-third anchored to the bottom of every shot.

The incumbent `assets/compass/compass.orientation-cinematic.css` lower-left / bottom-anchored tour-context implementation belongs to the existing construction floor only. Its fixed placement is explicitly **not** final-master placement authority.

For the pre-rendered master, contextual expression must be composed to the cinematography and the awards-quality visual hierarchy of each shot.

### Spatial law

Context placement is selected shot-by-shot and, where a shot contains materially distinct sub-beats, sub-beat-by-sub-beat. Placement must respond to:

- available negative space;
- the primary subject silhouette and focal plane;
- camera direction and anticipated object/camera movement;
- viewer eye-trace into and out of the shot;
- title-safe and action-safe margins;
- local contrast and legibility;
- transition direction and the next shot's visual entry.

The context may therefore appear left, right, upper, lower, centered, or withdraw completely for a visual peak or transition. Repetition of one bottom position across the film is prohibited unless independently justified by the composition of each affected shot.

### Hierarchy law

Continuity comes from a common typographic and motion grammar, not a common screen coordinate.

- Primary outcome/action remains the dominant line.
- Secondary explanation remains subordinate.
- Copy remains concise enough to be read without delaying the cinematic.
- Context must remain subordinate to the visual subject and may never read as a subtitle strip, UI card stack, documentation panel, or persistent page chrome.
- Context should enter after the subject has been visually established when that improves comprehension, and should clear before a visual climax or transition when continued presence would weaken the shot.
- Typography, spacing, weight, and transition behavior should feel authored as part of the same awards-oriented film even when anchor position changes.

### Shot-specific composition law

No shot inherits another shot's context position merely for implementation convenience.

S07-A Brain, S07-B Trophy, and S07-C House are separately composed engagement beats. Each receives an independently selected context position around its active object and camera framing. Their semantic distinction must be reinforced by composition rather than flattened into one repeated caption location.

The same rule applies to S05 Mirrorland and S06 Audralia: the context must support the threshold/world reveal without occupying the visual path through which the viewer is meant to travel.

### Responsive law

Phone and tablet context are independent cinematic compositions, not scaled desktop placements.

For each target viewport, placement may move to a different safe region if necessary to preserve the subject, eye-trace, and reading order. The semantic hierarchy and typographic family remain continuous even when the spatial solution differs.

### Acceptance test

A context treatment fails the master-quality bar if it looks like text placed on top of a finished film after the fact.

The intended result is:

`ONE SEMANTIC GRAMMAR + SHOT-AWARE SPATIAL CHOREOGRAPHY + CINEMATIC TIMING`

not:

`ONE PERMANENT LOWER THIRD ACROSS S01–S08`.

## Protected surfaces

Read-only unless separately authorized:

- `assets/compass/compass.controller.js`
- `assets/compass/compass.crystals.js`
- live Compass cardinal/navigation authority
- live readiness/capability authority
- Characters/Mirrorland product runtime
- Audralia/H-Earth product runtime
- Brain/Trophy/House source geometry authorities
- analytics/history/navigation

## Production order

`FREEZE -> MATERIALIZE EXACT SOURCE DONORS LOCALLY -> CONSTRUCT SELF-CONTAINED MASTER RENDERER -> RENDER FRAMES -> ENCODE MASTER -> VERIFY MEDIA -> COMMIT MASTER -> THIN PLAYER -> RESPONSIVE OWNER REVIEW`

No precedent rediscovery, canonical intake, Codespaces, GitHub Actions agent execution, historical-runtime reconstruction, broad media scavenging, or animation retiming may intervene before the first complete master candidate unless a tested concrete blocker is encountered.

## Current boundary

`INPUT_SET = FROZEN`  
`SOURCE_MATERIALIZATION = COMPLETE`  
`CONTEXT_CHOREOGRAPHY = FROZEN`  
`MASTER_CONSTRUCTION = NOT_STARTED`
