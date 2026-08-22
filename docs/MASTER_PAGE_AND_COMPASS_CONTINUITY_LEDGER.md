# MASTER_PAGE_AND_COMPASS_CONTINUITY_LEDGER_v1

Purpose: persistent repository-visible continuity record for all rooms working on the Diamond Gate Bridge master page, Compass, Mirrorland threshold, and public environment ingress.

## Mandatory read/update rule

Before making or evaluating any material Compass/master-page change, read this file and current `main`. After every material source change, qualification result, deployment, user-observed improvement, or newly discovered regression, update this ledger as part of the work. Do not rely on room memory or commit messages alone.

Every new entry must state:

`TIME / GENERATION / OPERATION / EXACT HEAD / PATHS CHANGED / PREVIOUS STATE / NEW STATE / PROGRESS / REGRESSION / UNRESOLVED / LIVE STATUS / USER-OBSERVED STATUS / NEXT LAWFUL BOUNDARY`

Allowed status labels:

- `PROGRESS`
- `REGRESSION`
- `UNRESOLVED`
- `SOURCE_ONLY`
- `LIVE_PROVEN`
- `USER_OBSERVED`

Never erase a regression because it was later repaired. Preserve the regression, then record the repair as a subsequent event.

## Master-page distinction

Record separately whether each operation changes:

1. `index.html` / master-page structure
2. Compass presentation assets
3. Compass runtime/controller behavior
4. deployment/publication machinery
5. H-Earth/environment runtime
6. navigation destinations

Do not state that the master page changed when only CSS, presentation runtime, deployment, or another subordinate asset changed.

## Baseline history retained

### Gen1578 — runtime single-owner consolidation

- Removed duplicate Compass/Mirrorland runtime ownership.
- Regression subsequently observed: constellation labels failed to follow the active star; older Mirrorland presentation resurfaced.
- Preserve this regression history even though later generations repair it.

### Gen1579 — renderer-driven label repair

- Restored renderer-owned foreground cardinal / room-label presentation without restoring shadow runtime ownership.
- User later reported live behavior still did not meet the accepted clone standard.

### Gen1582 — corrected clone-aligned Compass presentation

- Merge: `fe4244574308e48653a548435dc8fe215c2a9fdc`.
- Corrected foreground-star label behavior and clone-aligned Compass presentation.
- Preserved single controller/navigation ownership.
- Direct rendered proof reported passed on byte-identical corrected CSS.

### Gen1583 — demo publication + cluster-label repair

- Merge: `5719676af0527ebcb76b303f9ad43f05436ea865`.
- Restored the proven projected room label as sole cluster-label owner.
- Modified `.github/workflows/pages-direct-deploy.yml` so the accepted H-Earth subtree is staged directly at `/showroom/globe/h-earth/` instead of redirecting users into the excluded carrier tree.
- Deployment verifier was strengthened to require the canonical H-Earth demo page itself.
- No controller/navigation/geometry mutation in this generation.

### Gen1584 — integrated Mirrorland threshold + TRL/TRA presentation

- Authoritative `main` at ledger creation: `7be7bb4b064d110e1107d12b636dc963ec74688a`.
- Integrated existing controller-owned Mirrorland routes into the visual threshold.
- Restored distinct TRL and TRA evidence carousels/deep evidence routes.
- Unified lower entrance surfaces and tightened mobile hierarchy.
- Commit declares no controller, renderer, H-Earth runtime, navigation-destination, or deployment-ownership changes.

## Current master-page record

At ledger creation, comparison from pre-Gen1582 head `744961bd34be67a58037f685f2eda618dff58b10` through Gen1584 `7be7bb4b064d110e1107d12b636dc963ec74688a` shows changes in:

- `.github/workflows/pages-direct-deploy.yml`
- `assets/compass/compass.capability-carousel.js`
- `assets/compass/compass.css`
- `assets/compass/compass.presentation-convergence.js`

`index.html` is not in that comparison. Therefore these generations must not be described as master-page structural changes unless a later exact diff proves otherwise.

## Known regression history that must remain visible

- `REGRESSION`: constellation labels became missing/stuck during the runtime-cleanup sequence.
- `REGRESSION`: preferred smoother Mirrorland presentation was lost and older behavior resurfaced.
- `REGRESSION`: H-Earth public ingress returned 404 because the public entry redirected into an excluded publication tree.
- `PROGRESS`: Gen1582/Gen1583/Gen1584 are subsequent repairs/reconciliations; they do not erase the regression record.

## Current operating rule

If another room advances `main`, all older room-local heads and construction assumptions are stale until revalidated. Reconcile against the newest authoritative state before writing. Do not create competing repairs from stale branches.

The purpose of this file is strict continuity: at all times we must be able to identify exactly what was built, what became live, what improved, what digressed, what remains broken, and which implementation is authoritative.

## 2026-08-21 20:42 CDT / Gen1585 / Compass presentation ownership reconciliation

- `EXACT HEAD`: `731f1f177ebb66e00636c1d60d3e2a6bde7699f9`.
- `PATHS CHANGED`: `assets/compass/compass.presentation-convergence.js`, `assets/compass/compass.capability-carousel.css`, and this continuity ledger only.
- `PREVIOUS STATE`: Gen1584 placed the four Mirrorland choices over the stained-glass scene instead of inside the existing THRESHOLD/Mirrorland panel; TRL and TRA were separate in data but rendered as ordinary stacked content cards rather than the established cinematic carousel language; brain/trophy/house capability transitions exposed adjacent plaque pixels/captions; user also observed missing cluster state transitions and one extra label exposed at a time.
- `NEW STATE`: source candidate moves the existing controller-owned Mirrorland route node into the existing threshold panel, preserves route/state ownership, renders TRL and TRA as two independent front/rear orbit carousels with keyboard/pointer controls, follows existing controller modes for cluster presentation transitions and single-label exclusivity, and makes inactive capability plaques presentation-inert while retaining the existing carousel geometry owner.
- `PROGRESS`: exact Gen1585 product blobs were reparented unchanged after main advanced only by creation of this continuity ledger.
- `REGRESSION`: Gen1584 presentation regressions remain recorded and are not erased by this successor.
- `UNRESOLVED`: rendered qualification and user-visible inspection are still required; source presence alone is not acceptance.
- `LIVE STATUS`: `SOURCE_ONLY`; not merged and not deployed at this entry.
- `USER-OBSERVED STATUS`: user video `24104.mp4` is the governing visual regression evidence for this successor.
- `NEXT LAWFUL BOUNDARY`: qualify exact candidate `c5136948dccfc519c0eed4d59d51e5cc5debbe1b` (plus this documentation-only ledger update), revalidate current main, merge only if presentation behavior passes, then exact-head GitHub Pages deploy and user visual inspection.

## 2026-08-21 21:02 CDT / Gen1586 / Compass state-focus reconciliation

- `EXACT HEAD`: `c448de505e718793cc84bb024318ef0dfe936a7b`.
- `PATHS CHANGED`: `assets/compass/compass.presentation-convergence.js`, `assets/compass/compass.capability-carousel.js`, and this continuity ledger only.
- `PREVIOUS STATE`: Gen1585 materially improved the bottom carousels, but user videos `24109.mp4` and `24110.mp4` prove six remaining presentation defects: TRL/TRA still expose visible Previous/Next controls; brain/trophy/house still bleeds or transitions poorly; Mirrorland choice state does not clearly take visual focus; cluster rotation leaves stale/extra labels; the lower Selected Path panel does not transition with the 19 foreground room stars; and the upper Compass reads optically left of the page axis.
- `NEW STATE`: Gen1586 source candidate keeps controller/navigation ownership unchanged while making visible TRL/TRA navigation swipe-only, turning Mirrorland FOCUSED into a dimmed modal four-way fork with alternating destination glow and existing Back-to-Compass reversal, enforcing one projected room label, deriving lower-panel presentation atomically from controller-owned cluster primary/preview datasets for all 19 rooms, making inactive brain/trophy/house plaques/canvases presentation-inert, and optically centering the interactive Compass scene.
- `PROGRESS`: no new navigation, controller, renderer, H-Earth runtime, deployment owner, or destination route was introduced; presentation follows existing controller datasets and existing route controls.
- `REGRESSION`: Gen1585 residual defects remain recorded until rendered/user proof closes them.
- `UNRESOLVED`: exact rendered qualification is required for modal focus, swipe-only behavior, 19-room state transitions, label exclusivity, capability carousel single-foreground behavior, and mobile centering.
- `LIVE STATUS`: `SOURCE_ONLY`; branch `compass-gen1586-state-focus-reconciliation-20260821` only at this entry.
- `USER-OBSERVED STATUS`: `24109.mp4` and `24110.mp4` are governing visual evidence.
- `NEXT LAWFUL BOUNDARY`: open exact-head Gen1586 PR, inspect diff, run rendered interaction qualification against the candidate, revalidate current `main`, and promote only if all six acceptance conditions pass without H-Earth or route regression.
