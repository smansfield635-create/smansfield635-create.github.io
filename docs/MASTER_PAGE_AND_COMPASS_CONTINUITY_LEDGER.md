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

## 2026-08-21 21:24 CDT / Gen1586 / qualification correction and promotion boundary

- `EXACT HEAD`: candidate product head `31122206ca6aa9f14fd24981dc06d5eed19ad3d0` on base `c448de505e718793cc84bb024318ef0dfe936a7b`; this ledger update follows that product head.
- `PATHS CHANGED`: same Gen1586 scope only: `assets/compass/compass.presentation-convergence.js`, `assets/compass/compass.capability-carousel.js`, and this continuity ledger. A disposable phone-overflow diagnostic workflow was created and removed before promotion and is not part of the candidate diff.
- `PREVIOUS STATE`: first Gen1586 centering attempt used auto margins/inset overrides on the relative Compass scene and collapsed the desktop interaction hit box to 2 px wide. This was a candidate-specific regression and was not promoted.
- `NEW STATE`: centering correction preserves a full-width canonical Compass scene hit box while keeping the surrounding presentation aligned; TRL/TRA visible controls are now strictly swipe-only (progress dots hidden; keyboard arrows remain accessibility fallback); other Gen1586 state-focus behaviors remain unchanged.
- `PROGRESS`: interaction qualification after the centering correction successfully opens the Compass and reaches the same boundary as Gen1585, then stops on the pre-existing H-Earth proxy assertion `href:null` while `data-route` remains `/showroom/globe/h-earth/`. Capability rendered qualification passes desktop and tablet brain/trophy/house WebGL, swipe sequence, no arrows, and guidance `Swipe to rotate.`
- `REGRESSION`: the 2 px scene-hitbox regression discovered in the first Gen1586 candidate was corrected before merge. Phone capability qualification still reports 108 px horizontal overflow, but exact Gen1585 baseline run #505 reports the identical 108 px overflow; therefore it is preserved as a pre-existing condition, not attributed to Gen1586.
- `UNRESOLVED`: final user-visible inspection remains required after deployment for the Mirrorland four-way fork, alternating glow, 19-room panel transitions, single-label visual exclusivity, optical centering, and swipe-only TRL/TRA presentation. The stale H-Earth proxy assertion and pre-existing phone overflow remain separate legacy qualification debt.
- `LIVE STATUS`: `SOURCE_ONLY`; not merged or deployed at this entry.
- `USER-OBSERVED STATUS`: the successor is specifically constructed against user evidence `24109.mp4` and `24110.mp4` plus the explicit Mirrorland modal-fork instruction.
- `NEXT LAWFUL BOUNDARY`: revalidate current `main`; if still exact `c448de505e718793cc84bb024318ef0dfe936a7b`, merge only PR #1583 exact head and perform exact-head GitHub Pages deployment, then require user visual inspection before declaring the six presentation defects closed.

## 2026-08-21 21:26 CDT / Gen1586 / exact-head revalidation

- `EXACT HEAD`: current `main` revalidated as `c448de505e718793cc84bb024318ef0dfe936a7b`; PR #1583 remains based on that exact head.
- `PATHS CHANGED`: no new product scope beyond the two Gen1586 presentation assets; this entry is documentation-only.
- `PREVIOUS STATE`: qualification had reached the promotion boundary but exact-head authority still required a final main readback.
- `NEW STATE`: governing base remains unchanged; no competing main mutation has invalidated Gen1586.
- `PROGRESS`: exact-head condition satisfied for PR #1583 promotion.
- `REGRESSION`: none introduced by this documentation-only readback.
- `UNRESOLVED`: live deployment and user visual inspection remain required.
- `LIVE STATUS`: `SOURCE_ONLY` until merge and exact-head Pages deployment complete.
- `USER-OBSERVED STATUS`: unchanged; six visual acceptance conditions remain pending live inspection.
- `NEXT LAWFUL BOUNDARY`: merge exact PR #1583 head, deploy the resulting main SHA through GitHub Pages exact-head transport, verify live publication, then return to user visual validation.

## 2026-08-21 21:43 CDT / Gen1586 / post-deployment visual correction record

- `EXACT HEAD`: deployed Gen1586 product head `9312ddec57cd44db0b43843d877589aef6d6492a`; repository documentation head later advanced by evidence-log commits only.
- `PATHS CHANGED`: documentation only — `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md` and this ledger. No product, controller, renderer, route, H-Earth, or deployment mutation in this entry.
- `PREVIOUS STATE`: source/CI qualification suggested closure of several Gen1586 presentation goals, but owner video `24117.mp4` and screenshots show that those claims were too broad.
- `NEW STATE`: visual authority is corrected and centralized in `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md`. The detailed `24117` audit reduces fourteen observed collision moments to four systemic failure classes: stale Compass labels under active labels; Coheriscope control/body-copy collision; fixed TRL/TRA headings sharing space with active carousel headings; and outgoing/incoming carousel states coexisting during transitions.
- `PROGRESS`: visible Previous/Next controls remain removed from TRL/TRA; basic Compass rotation and previously working route continuity remain present. These are not double-counted where earlier evidence already proves them.
- `REGRESSION`: Gen1586 Mirrorland modal is user-observed blurry/weak and its four actions are reported nonfunctional; stale Mirrorland labeling persists under active room/cardinal labels; TRL/TRA and capability text layers overlap; global horizontal oversizing remains visible.
- `UNRESOLVED`: 19/19 foreground-room information transitions, exact single-label ownership, Mirrorland interaction/presentation, Coheriscope layout reservation, TRL/TRA single-state text ownership, capability containment, and upper-page width/centering.
- `LIVE STATUS`: `LIVE_PROVEN` only for publication of Gen1586, not for closure of these presentation defects.
- `USER-OBSERVED STATUS`: `USER_OBSERVED REGRESSION / UNRESOLVED`. Governing evidence is `24117.mp4` plus owner screenshots; earlier `24097.mp4` and `24104.mp4` remain the baseline for determining what predated later generations.
- `NEXT LAWFUL BOUNDARY`: any successor must repair ownership/layout rather than move individual words: one active owner per text region, reserved height for active content, outgoing state removed from visual flow before incoming state enters, controls excluded from body-copy space, and user-visible proof required before closure. Reference the visual timeline rather than duplicating frame-by-frame details here.

## 2026-08-21 21:48 CDT / Gen1586 / takeover qualification lock

- `EXACT HEAD`: Gen1586 deployed product head `9312ddec57cd44db0b43843d877589aef6d6492a`; documentation-only successors do not alter the product baseline.
- `PATHS CHANGED`: documentation only — takeover acceptance language in `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md` and this ledger.
- `PREVIOUS STATE`: publication and post-deployment visual regressions were recorded, but a takeover room could still misread successful exact-head deployment as evidence that Gen1586 itself had qualified.
- `NEW STATE`: authoritative takeover classification is now explicit: `GEN1586 = DEPLOYED EVIDENCE BASELINE, NOT ACCEPTED SUCCESSOR`.
- `PROGRESS`: takeover continuity is deterministic: chronology, preserved earlier behavior, Gen1586 regressions, ownership/layout contract, and next-cycle repair scope are repository-resident.
- `REGRESSION`: none introduced; documentation-only operation.
- `UNRESOLVED`: Gen1586 qualification/diagnostic runs did not establish acceptance across the relevant rendered/static, interaction/browser, continuity/recovery, and state-focus surfaces. A later room must not inherit Gen1586 as qualified merely because it was deployed.
- `LIVE STATUS`: Gen1586 remains deployed evidence only; `LIVE_PROVEN` publication is