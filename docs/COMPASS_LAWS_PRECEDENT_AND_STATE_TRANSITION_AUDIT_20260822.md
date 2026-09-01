# Compass / Laws Precedent and State-Transition Audit — 2026-08-22

## Authority and scope

This audit records the missing precedent review requested after the prior audit room stopped. It is anchored to public `main` at `76021a66e43aedecd255755bfe5775b7bdb702a8` (`Gen1589 — repair final four Compass defects`). It does **not** declare Gen1589 visually accepted.

Scope:

1. Laws-page Compass state transitions.
2. Laws-page one-label-at-a-time constellation behavior.
3. Main Compass state ownership and transition behavior.
4. Four-cardinal star/label presentation.
5. Mirrorland four-way chooser blur, focus ownership, routes, and return sequencing.
6. Interaction-owner conflicts introduced by layered Gen1588/Gen1589 repair code.

Owner-supplied rendered evidence on 2026-08-22 remains presentation authority. The evidence shows that the main Compass still has visible presentation defects despite source-level repair work. Source presence is not visual acceptance.

---

## 1. Laws page is the direct precedent for the Compass interaction grammar

### 1.1 Laws controller owns state and transitions

`laws/index.controller.js` explicitly divides responsibilities:

- interactions determine motion;
- controller determines authority;
- controller owns canonical runtime state, legal transitions, route authorization, selection, gesture transaction begin/preview/commit/cancel, and semantic publication.

The Laws state set is:

- `CONSTELLATION`
- `CLUSTER_OPEN`
- `LAW_SELECTED`
- `SYSTEM_HELD`

The Laws presentation mapping is:

| State | Presentation mode | Outer authorities active | Active child cluster | Child selection permitted |
|---|---|---:|---:|---:|
| `CONSTELLATION` | `CONSTELLATION` | yes | no | no |
| `CLUSTER_OPEN` | `CLUSTER` | no | yes | yes |
| `LAW_SELECTED` | `CLUSTER` | no | yes | yes |
| `SYSTEM_HELD` | `HELD` | no | no | no |

Legal transitions are explicitly bounded:

- `CONSTELLATION -> CONSTELLATION | CLUSTER_OPEN | SYSTEM_HELD`
- `CLUSTER_OPEN -> CLUSTER_OPEN | LAW_SELECTED | CONSTELLATION | SYSTEM_HELD`
- `LAW_SELECTED -> LAW_SELECTED | CLUSTER_OPEN | CONSTELLATION | SYSTEM_HELD`
- `SYSTEM_HELD -> SYSTEM_HELD` only

The important behavioral precedent is not merely the names of the states. It is the transaction rule: a pointer movement may create a **preview**, but preview is not semantic selection. The controller separately accepts a commit or cancel, settles the canonical orientation, and only then publishes the resulting semantic state.

For the outer constellation the transaction is:

`beginOrbitGesture -> requestOrbitPreview -> requestOrbitCommit OR requestOrbitCancel -> canonical settled orientation`

The cluster has the same separation:

`beginClusterGesture -> requestClusterPreview -> requestClusterCommit OR requestClusterCancel -> canonical settled orientation`

This is the transition grammar the main Compass should preserve: **motion preview, canonical settlement, then semantic ownership**. A presentation helper must not become a second state machine.

### 1.2 Laws one-label-at-a-time behavior

`laws/index.interactions.js` is versioned `1.6.0-single-active-outer-label` and identifies build `LAWS_COMPASS_CHECKPOINT_5_SINGLE_ACTIVE_OUTER_LABEL_v1`.

Its accepted contract is precise:

- all six top-level authority identities remain installed in the scene (`flow`, `integrity`, `reality`, `structure`, `test`, `research`);
- six projected outer-authority label elements are installed;
- **exactly the current primary/readable authority label is visible**;
- the remaining authority labels are hidden and removed from focus/pointer ownership;
- the underlying authority objects are not deleted merely to hide their labels.

The runtime receipt explicitly carries:

- `projectedCategoryLabelsInstalled`
- `singleActiveOuterAuthorityLabel: true`
- `visibleOuterAuthorityLabelCount`
- `activeOuterAuthorityLabelId`
- root policy `data-laws-constellation-labels="single-primary-only"`

The repository benchmark `verification/benchmark-tools/laws-compass-cp5-single-active-label-v1/laws-compass-cp5-single-active-label.mjs` encodes the same requirement and exercises phone portrait, phone landscape, tablet, and desktop profiles.

### Governing translation to the main Compass

The Laws precedent means:

> **ALL FOUR MAIN-COMPASS STARS REMAIN PRESENT. ONE READABLE STAR OWNS ONE LABEL.**

The main Compass must **not** implement “one label at a time” by hiding three of the four star owners. The stars are scene geometry; the label is semantic projection. Those are separate responsibilities.

Required main-Compass invariant in `CONSTELLATION`:

- four cardinal stars remain rendered and geometrically present;
- exactly one cardinal is the readable/foreground authority;
- exactly one cardinal label is visible;
- three non-readable labels are absent from visual/focus/pointer ownership;
- changing the readable cardinal performs a clean outgoing-label -> settled state -> incoming-label handoff;
- no blank label shell remains;
- no competing label owner flashes during transition.

---

## 2. Main Compass already has the correct authoritative state machine

`assets/compass/compass.controller.js` already defines the correct primary authority boundary. Its states are:

- `CONSTELLATION`
- `CLUSTER_OPEN`
- `ROOM_SELECTED`
- `MIRRORLAND_REVEALING`
- `MIRRORLAND_FOCUSED`
- `MIRRORLAND_WITHDRAWING`
- `NAVIGATING`
- `HELD`

The controller contract already states that it owns constellation state, cluster state, selection, panel presentation, spherical orientation commitment, Mirrorland lifecycle, navigation, and receipts.

Its own comments preserve the essential lifecycle rules:

- constellation and cluster orientations survive Mirrorland reveal/focus/withdrawal/failure;
- Return To Orbit is distinct from constellation restoration;
- prior cardinal/room panel content is restored after Mirrorland withdrawal/failure;
- Mirrorland Back remains available during reveal/focus;
- ordinary drag release is not a return gesture.

`assets/compass/compass.cosmos.js` independently respects this ownership boundary: it will provide cardinal context in `CONSTELLATION`, but it will not overwrite panel state while a cluster, selected room, or Mirrorland state owns the panel.

Therefore the repair should **not create another state machine**. The main controller is already the accepted state owner. Presentation code should render controller state and nothing more.

---

## 3. Main Compass source already contains the correct four-star / one-label concept

`index.html` declares all four semantic cardinal controls simultaneously:

- North — Orientation
- East — Worlds
- South — Instruments
- West — Frontier

The root also publishes `data-readable-cardinal` and `data-rendered-foreground-cardinal`.

The inline Compass CSS already expresses the correct conceptual rule:

- hide the text spans on all cardinal wing controls in `CONSTELLATION`;
- reveal the spans only on `.is-readable-cardinal`;
- make non-readable semantic shells visually transparent rather than removing the rendered crystal stars.

That matches the Laws precedent substantially better than the later Gen1588 shell-hiding policy.

---

## 4. The cardinal regression is an ownership conflict introduced by presentation convergence

`assets/compass/compass.presentation-convergence.js` v7 currently declares:

`constellationPolicy: 'EXACTLY_ONE_VISIBLE_CARDINAL_SHELL'`

and `syncConstellationOwners()` does the following in `CONSTELLATION`:

- computes the readable cardinal;
- marks only that wing `data-gen1588-cardinal-visible="true"`;
- sets the other three wing controls `hidden=true`;
- sets the other three `aria-hidden=true`;
- sets the other three `tabIndex=-1`.

That is **not** the Laws single-label precedent. It hides three cardinal semantic star owners rather than hiding only their labels.

Gen1589 then attempts to undo that behavior from a different file, `assets/compass/compass.capability-carousel.js`:

- forces every cardinal wing visible again;
- removes `hidden` / `aria-hidden`;
- removes `data-gen1588-cardinal-visible`;
- toggles `.is-readable-cardinal` so only one wing's spans display.

This produces two competing presentation owners:

1. v7 says “only one cardinal shell may exist visibly.”
2. Gen1589 says “all four cardinal shells must be restored; only one label is readable.”

The second behavior is directionally correct, but it is implemented as a compensating observer/shim rather than by correcting the source owner. The result is an avoidable state tug-of-war whenever observed attributes change.

### Required repair

The repair must be made in the actual constellation presentation owner, not as an after-the-fact capability-carousel shim:

- retire `EXACTLY_ONE_VISIBLE_CARDINAL_SHELL`;
- preserve all four star owners in `CONSTELLATION`;
- adopt the Laws rule: `ALL_CARDINAL_STARS_ONE_PRIMARY_LABEL`;
- have one function own the readable-label handoff;
- remove the Gen1589 compensating cardinal visibility mutation after the source owner is corrected;
- ensure non-readable label controls are non-focusable without removing the visual star geometry.

---

## 5. Mirrorland routes are already declaratively present and correct in `index.html`

The four intended choices already exist in the main page source:

| Choice | Declared destination |
|---|---|
| Enter the Narrative | `/showroom/` |
| Enter the Demo | `/showroom/globe/h-earth/` |
| See the World Map | `/showroom/globe/audralia/` |
| Return to Compass | `#compass` with `data-compass-mirrorland-inline-back` |

`compass.presentation-convergence.js` v7 also reasserts the first three hrefs and implements a pre-return teardown path for the Return choice.

Therefore the primary Mirrorland failure is not the absence of destination declarations. It is presentation/focus ownership and layered interaction authority.

---

## 6. Mirrorland blur failure: probable stacking-context cause

The current v7 overlay architecture creates:

- a body-level fixed `.compass-mirrorland-focus-backdrop` using `backdrop-filter: blur(4px) saturate(.72)`;
- a visually fixed `.compass-mirrorland-routes.is-gen1588-fork` with a nominally higher z-index.

However, the chooser remains structurally nested inside `.compass-panel` in `index.html`.

A fixed child cannot necessarily escape an ancestor stacking context created by positioned/transformed/filtered presentation layers. If the panel or one of its ancestors establishes a lower stacking context, the body-level backdrop can remain above the entire ancestor context even when the nested chooser carries a numerically larger z-index.

That produces exactly the reported symptom:

- the page behind blurs as intended;
- the chooser itself appears blurred/dim because it is still compositionally behind the body-level backdrop;
- increasing the chooser's child z-index does not reliably solve it.

This is a **probable source-level cause consistent with the rendered symptom**, not a visual PASS claim. It must be confirmed in rendered qualification.

### Correct overlay precedent

When `MIRRORLAND_FOCUSED` owns interaction:

1. The backdrop and chooser must be siblings in the same top-level overlay layer, preferably a dedicated body-level portal host.
2. Backdrop receives the blur and sits below the chooser.
3. Chooser itself is never inside the blurred stacking context.
4. Underlying scene/panel/page content is `inert` and `aria-hidden` as appropriate.
5. The chooser is the only focus/pointer authority.
6. On exit, portal content is torn down/restored deterministically.

This is the same ownership principle used elsewhere in the estate: background suppression belongs to one layer; active modal content sits above it unfiltered.

---

## 7. Mirrorland current ownership conflict

v7's `suppressForMirrorland()` is directionally correct: it suppresses the scene and panel siblings while excluding the routes node, then restores prior `inert` / `aria-hidden` values on exit.

Gen1589 adds another repair from `compass.capability-carousel.js` which, while focused, walks upward from the routes node and removes `inert` and `aria-hidden` from ancestors. It also installs a capture-phase click handler which directly executes `window.location.assign(...)` for three Mirrorland links.

Those changes create two new problems:

- ancestor unsuppression can weaken v7's “chooser is sole authority” state;
- direct capture navigation becomes a second navigation authority even though the Compass controller is explicitly the navigation owner and the hrefs already exist.

The fix should therefore **remove compensating ancestor unsuppression and duplicate navigation authority**, not add more click interception.

---

## 8. Mirrorland return sequencing precedent is already present and should be preserved

v7 defines `hideMirrorlandBeforeReturn(routes)` and the inline Return link uses it in capture phase while `MIRRORLAND_FOCUSED`.

That path first:

- marks departure;
- hides the routes;
- removes the focused-fork class;
- removes the active backdrop;
- clears the document-level Mirrorland-focus marker;

before allowing restoration to proceed.

This is the correct user-requested order:

`CHOOSER TEARDOWN -> BACKDROP TEARDOWN -> COMPASS RESTORATION`

The repair should retain this sequencing while moving the chooser to a true top-level overlay/portal.

---

## 9. Required unified transition contract for the main Compass

### Constellation

`CONSTELLATION / settled cardinal A`

-> pointer/gesture preview

-> controller commits or cancels

-> renderer settles foreground/readable cardinal B

-> outgoing label leaves

-> **only after settled ownership**, incoming label B appears

At every frame, all four visual stars remain present; only one readable label owns visual/focus text.

### Cluster

`CONSTELLATION`

-> primary cardinal activation

-> `CLUSTER_OPEN`

-> one foreground room owns one room label

-> room selection

-> `ROOM_SELECTED`

-> Return To Orbit restores the cluster without fabricating a new constellation state.

### Mirrorland

prior Compass state

-> `MIRRORLAND_REVEALING`

-> `MIRRORLAND_FOCUSED`

-> body-level chooser becomes sole interaction authority

-> one of:

- Narrative -> controller-authorized navigation to `/showroom/`
- Demo -> controller-authorized navigation to `/showroom/globe/h-earth/`
- World Map -> controller-authorized navigation to `/showroom/globe/audralia/`
- Return -> chooser teardown -> `MIRRORLAND_WITHDRAWING` -> restore preserved Compass state

No presentation shim may independently mutate controller state or become a parallel navigation authority.

---

## 10. Acceptance matrix for the next successor

A successor is not accepted until rendered evidence demonstrates all of the following.

### Cardinal constellation

- all four star bodies remain visible throughout rotation;
- exactly one cardinal label is visible after settlement;
- no second label, blank tab shell, or stale label is visible;
- no label collision during preview/settlement;
- correct foreground label follows the actual settled cardinal;
- touch drag, mouse drag, keyboard/direct focus where supported, and reduced-motion path remain coherent.

### Cluster / room transitions

- preserve already-closed 19/19 foreground-room information coverage;
- one foreground room -> one visible room label;
- no predecessor-room flash;
- no panel overwrite by cosmos/presentation helpers.

### Mirrorland

- background page visibly darkens/blurs;
- chooser itself remains crisp, bright, luminous, and unfiltered;
- chooser is the only active focus/pointer surface;
- Narrative reaches `/showroom/`;
- Demo reaches `/showroom/globe/h-earth/`;
- World Map reaches `/showroom/globe/audralia/`;
- Return tears down chooser before restoration animation;
- no stale/hidden underlying panel control remains focusable;
- no duplicate capture-navigation authority remains.

### Device profiles

At minimum repeat the Laws benchmark viewport family and the owner-observed devices:

- phone portrait;
- phone landscape;
- tablet portrait;
- desktop;
- touch and pointer;
- keyboard/focus;
- reduced motion.

---

## 11. Bounded implementation order

1. Make `compass.presentation-convergence.js` the single presentation owner for constellation label visibility and remove its three-star shell hiding.
2. Port the Laws `single-primary-only` label semantics to the four main cardinal labels.
3. Remove Gen1589's compensating cardinal observer/visibility override once the source owner is corrected.
4. Portal the Mirrorland focused chooser to a body-level overlay host sibling to the backdrop; preserve original declarative routes.
5. Keep underlying page/scene/panel inert while focused; do not remove suppression from ancestors as a repair tactic.
6. Remove duplicate Gen1589 capture navigation and route through the declared/controller-owned navigation path.
7. Preserve v7 teardown-before-return semantics.
8. Re-run whole-page rendered qualification. Do not reopen 19/19 room coverage unless regression evidence appears.
9. Only after rendered evidence passes may the successor be recorded as accepted.

---

## Final audit disposition

The missing precedent is now explicit:

**Laws does not hide the constellation to achieve one label. It preserves the full authority field and projects one active label from settled state.**

The current main Compass has the right underlying controller state model and the right declarative Mirrorland routes, but Gen1588/Gen1589 layered presentation repairs introduced competing owners. The remaining repair is therefore not another cosmetic overlay. It is an ownership consolidation:

`ONE CONTROLLER STATE OWNER + ONE PRESENTATION OWNER + ALL STARS PRESENT + ONE SETTLED LABEL + ONE TOP-LEVEL MIRRORLAND MODAL OWNER`.

Until that consolidation is rendered and verified, `76021a66e43aedecd255755bfe5775b7bdb702a8` remains **source evidence, not accepted visual success**.
