# Laws back-page dual-carousel and continuity audit handoff

Status: audit complete; implementation not started  
Audit date: 2026-08-25  
Audited production head: `482756414d65a0aff3a5ba42f09ee5ec858629c6`  
Issue: [#2082](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/2082)  
Intake operation: `LAWS_BACK_PAGE_DUAL_CAROUSEL_AUDIT_HANDOFF_20260825_48275641_R1`  
Intake receipt: `ADMITTED_AND_LOCKED`, lock generation `1711`, workflow run `32904910379`

## Stop boundary for this room

This document is the only authorized repository change from the audit room. It does not authorize or perform production construction.

Do not merge this handoff as if it were the product change. Do not deploy from this room. Do not modify HTML, CSS, JavaScript, carousel runtime, verifiers, workflows, protected pages, or public routes under this operation.

The next construction room must enter through the repository AI entry point at the then-current exact `main` head, route every intended production path, obtain a fresh canonical intake, implement, independently qualify, explicitly merge/deploy only with the required authority, and verify the live pages.

## Owner decision to preserve

Every Laws article/back page that carries study and audit material should use exactly two coordinated carousels:

1. A study/material carousel for readable conceptual, explanatory, engineering, empirical, and boundary content.
2. An audit/checkpoint/artifact carousel for procedural, custody, source, evidence, receipt, and disposition material.

The carousels sit one above the other and quietly align by sequence. Page-level Previous and Next continuity controls sit below both carousels. Audit material remains inspectable without expanding into a continuous legacy page dump.

## Audit scope and method

The audit covered all 29 current, non-protected Laws back-page routes mounted by the shared carousel runtime at the audited commit. It combined exact-head source inspection with live DOM inspection at `https://diamondgatebridge.com`.

For each route, the audit recorded:

- shared carousel contract and mount state;
- primary carousel tab and word counts;
- audit disclosure count and payload size;
- legacy-source payload size;
- audit article and nested-disclosure counts;
- page-level continuity navigation presence and targets;
- current DOM order.

Protected routes were examined only to establish the boundary and must remain untouched:

- `/laws/`
- `/laws/research/methods-and-models/`

## Findings

- All 29 audited routes mount `LAWS_ROOM_CAROUSEL_BACK_PAGE_PARITY_v3`.
- 28 of 29 routes contain one audit disclosure. `/laws/research/` contains none.
- The primary carousel tracks contain 13,071 words total.
- The audit disclosures contain 23,866 words total, including 21,326 words inside legacy-source containers.
- Audit payload exceeds the primary carousel payload on 21 of 29 routes.
- The audit disclosures collectively contain 358 articles and 74 nested disclosures.
- 23 narrative routes have bottom `.lr-story-nav` continuity.
- All four family roots—Flow, Integrity, Reality, and Structure—lack bottom continuity controls.
- The Reality family root is the clearest failure: 366 primary-carousel words versus 1,619 audit words (4.42×), with 1,609 words in the legacy source, 27 articles, and 7 nested disclosures.
- No route currently carries a redundant “Laws narrative context” carousel stage; that earlier defect remains corrected.
- Current tab distribution is 24 routes with 5 stages, 4 routes with 4 stages, and `/laws/research/` with 3 stages.

The present narrative-route DOM order is:

1. primary carousel tab rail;
2. primary carousel viewport/stage;
3. page-level `.lr-story-nav`;
4. `details.lr-audit` containing the legacy source.

That order is structurally wrong for the two-carousel model. When the audit becomes the second carousel, page-level continuity must move below both carousels.

## Full route audit

`Audit structures` is `article count / nested details count`. `Bottom nav` means the page-level Previous/Next continuity control, not carousel stage controls.

| # | Route | Primary stages | Primary words | Audit words | Audit/primary | Audit structures | Bottom nav |
|---:|---|---:|---:|---:|---:|---:|---|
| 1 | `/laws/categories/flow/` | 5 | 362 | 1139 | 3.15× | 18 / 4 | absent |
| 2 | `/laws/categories/flow/cycles/` | 5 | 444 | 1492 | 3.36× | 21 / 6 | present |
| 3 | `/laws/categories/flow/feedback/` | 5 | 431 | 59 | 0.14× | 0 / 0 | present |
| 4 | `/laws/categories/flow/handoffs/` | 5 | 397 | 59 | 0.15× | 0 / 0 | present |
| 5 | `/laws/categories/flow/signals/` | 4 | 593 | 85 | 0.14× | 1 / 0 | present |
| 6 | `/laws/categories/integrity/` | 5 | 370 | 1482 | 4.01× | 23 / 0 | absent |
| 7 | `/laws/categories/integrity/accountability/` | 5 | 395 | 1060 | 2.68× | 16 / 0 | present |
| 8 | `/laws/categories/integrity/coherence/` | 5 | 410 | 1301 | 3.17× | 24 / 0 | present |
| 9 | `/laws/categories/integrity/consistency/` | 5 | 412 | 1105 | 2.68× | 16 / 0 | present |
| 10 | `/laws/categories/integrity/continuity/` | 5 | 410 | 1213 | 2.96× | 20 / 0 | present |
| 11 | `/laws/categories/reality/` | 5 | 366 | 1619 | 4.42× | 27 / 7 | absent |
| 12 | `/laws/categories/reality/battery-heldout-study/` | 4 | 251 | 437 | 1.74× | 0 / 11 | absent |
| 13 | `/laws/categories/reality/evidence.html` | 5 | 409 | 170 | 0.42× | 0 / 3 | present |
| 14 | `/laws/categories/reality/limits.html` | 5 | 419 | 152 | 0.36× | 0 / 2 | present |
| 15 | `/laws/categories/reality/measure.html` | 5 | 625 | 81 | 0.13× | 1 / 0 | present |
| 16 | `/laws/categories/reality/theory.html` | 5 | 389 | 1284 | 3.30× | 24 / 0 | present |
| 17 | `/laws/categories/structure/` | 5 | 364 | 1168 | 3.21× | 22 / 0 | absent |
| 18 | `/laws/categories/structure/boundaries.html` | 5 | 406 | 1033 | 2.54× | 16 / 5 | present |
| 19 | `/laws/categories/structure/constraints.html` | 5 | 407 | 1084 | 2.66× | 16 / 0 | present |
| 20 | `/laws/categories/structure/governance.html` | 5 | 404 | 1095 | 2.71× | 16 / 0 | present |
| 21 | `/laws/categories/structure/interfaces.html` | 5 | 403 | 1069 | 2.65× | 16 / 0 | present |
| 22 | `/laws/research/` | 3 | 226 | 0 | 0.00× | 0 / 0 | absent |
| 23 | `/laws/research/applied-investigations/` | 5 | 608 | 1048 | 1.72× | 24 / 12 | present |
| 24 | `/laws/research/evidence-and-sources/` | 5 | 529 | 929 | 1.76× | 21 / 6 | present |
| 25 | `/laws/research/findings-and-boundaries/` | 4 | 657 | 396 | 0.60× | 8 / 0 | present |
| 26 | `/laws/test/admission-and-baseline/` | 5 | 552 | 740 | 1.34× | 8 / 3 | present |
| 27 | `/laws/test/forward-construction/` | 5 | 527 | 579 | 1.10× | 3 / 1 | present |
| 28 | `/laws/test/result-and-record/` | 5 | 521 | 836 | 1.60× | 12 / 13 | present |
| 29 | `/laws/test/reverse-audit/` | 4 | 784 | 1151 | 1.47× | 5 / 1 | present |

## Required target information architecture

For each of the 28 audit-bearing routes, the required document order is:

1. Page header and bounded orientation material.
2. Study/material carousel.
3. Audit/checkpoint/artifact carousel.
4. Page-level Previous and Next continuity controls.
5. Footer or return links.

Do not place page-level Previous/Next continuity inside either carousel or create it as a final carousel stage.

### Study/material carousel

This is the primary reading experience. It owns readable explanation, conceptual structure, practical application, engineering interpretation, empirical result, and boundary/next-step material. Existing useful material should be redistributed into the available stages so the carousel is not visually sparse while the legacy source remains enormous below it.

### Audit/checkpoint/artifact carousel

This is the secondary inspection experience. It owns source custody, route identity, evidence status, method/procedure, checkpoints, receipts, negative or mixed findings, claim ceiling, prohibited claims, unresolved items, and implementation ownership.

The audit carousel must replace the one-shot legacy disclosure. A slide may contain a bounded “Inspect record” action or nested artifact view when necessary, but opening one control must never reveal the entire legacy page as a single continuous word dump.

### Coordination contract

- Each paired carousel on a route has the same stage count.
- Stage `N` in the study carousel corresponds to stage `N` in the audit carousel.
- Selecting stage `N` in either carousel updates the other to stage `N` without recursion or feedback loops.
- The relationship is quiet: no forced animation, auto-advance, or attention-grabbing synchronization treatment.
- One click, key action, or swipe advances one stage.
- Both carousels expose operable controls at mobile and desktop widths.
- Current stage, total stages, accessible name, selected tab state, focus order, and reduced-motion behavior remain correct for each carousel independently.
- Deep links and browser history must not produce conflicting paired indices.
- With JavaScript unavailable, all content remains reachable in a readable source order and the page-level continuity links remain usable.

### Stage semantics

Use the existing primary stage count on each page as the governing count. Distribute both tracks into the same sequence rather than inventing a universal extra stage:

1. Orientation / identity and custody.
2. Concept or relationship / sources and controls.
3. Practical or engineering reading / procedure and checkpoints.
4. Evidence or result / observed record and disposition.
5. Boundary or continuation / claim ceiling, unresolved items, and handoff.

Four-stage pages combine adjacent roles without losing custody or boundary material. `/laws/research/` is a three-stage hub with no audit record and is excluded from the mandatory second-carousel conversion.

## Bottom continuity contract

The 23 existing narrative Previous/Next pairs are correct and must be preserved exactly while moving below both carousels:

| Current route | Previous | Next |
|---|---|---|
| `/laws/categories/flow/cycles/` | `/laws/categories/flow/feedback/` | `/laws/categories/flow/handoffs/` |
| `/laws/categories/flow/feedback/` | `/laws/categories/flow/signals/` | `/laws/categories/flow/cycles/` |
| `/laws/categories/flow/handoffs/` | `/laws/categories/flow/cycles/` | `/laws/categories/integrity/consistency/` |
| `/laws/categories/flow/signals/` | `/laws/research/methods-and-models/` | `/laws/categories/flow/feedback/` |
| `/laws/categories/integrity/accountability/` | `/laws/categories/integrity/consistency/` | `/laws/categories/integrity/continuity/` |
| `/laws/categories/integrity/coherence/` | `/laws/categories/integrity/continuity/` | `/laws/categories/reality/theory.html` |
| `/laws/categories/integrity/consistency/` | `/laws/categories/flow/handoffs/` | `/laws/categories/integrity/accountability/` |
| `/laws/categories/integrity/continuity/` | `/laws/categories/integrity/accountability/` | `/laws/categories/integrity/coherence/` |
| `/laws/categories/reality/evidence.html` | `/laws/categories/reality/theory.html` | `/laws/categories/reality/measure.html` |
| `/laws/categories/reality/limits.html` | `/laws/categories/reality/measure.html` | `/laws/categories/structure/constraints.html` |
| `/laws/categories/reality/measure.html` | `/laws/categories/reality/evidence.html` | `/laws/categories/reality/limits.html` |
| `/laws/categories/reality/theory.html` | `/laws/categories/integrity/coherence/` | `/laws/categories/reality/evidence.html` |
| `/laws/categories/structure/boundaries.html` | `/laws/categories/structure/interfaces.html` | `/laws/categories/structure/governance.html` |
| `/laws/categories/structure/constraints.html` | `/laws/categories/reality/limits.html` | `/laws/categories/structure/interfaces.html` |
| `/laws/categories/structure/governance.html` | `/laws/categories/structure/boundaries.html` | `/laws/test/admission-and-baseline/` |
| `/laws/categories/structure/interfaces.html` | `/laws/categories/structure/constraints.html` | `/laws/categories/structure/boundaries.html` |
| `/laws/research/applied-investigations/` | `/laws/` | `/laws/research/evidence-and-sources/` |
| `/laws/research/evidence-and-sources/` | `/laws/research/applied-investigations/` | `/laws/research/methods-and-models/` |
| `/laws/research/findings-and-boundaries/` | `/laws/test/result-and-record/` | `/frontier/energy/battery-coherence-study/` |
| `/laws/test/admission-and-baseline/` | `/laws/categories/structure/governance.html` | `/laws/test/forward-construction/` |
| `/laws/test/forward-construction/` | `/laws/test/admission-and-baseline/` | `/laws/test/reverse-audit/` |
| `/laws/test/result-and-record/` | `/laws/test/reverse-audit/` | `/laws/research/findings-and-boundaries/` |
| `/laws/test/reverse-audit/` | `/laws/test/forward-construction/` | `/laws/test/result-and-record/` |

The four family roots must receive the category-spine continuity that Reality currently lacks:

| Family root | Previous | Next |
|---|---|---|
| `/laws/categories/flow/` | `/laws/categories/` | `/laws/categories/integrity/` |
| `/laws/categories/integrity/` | `/laws/categories/flow/` | `/laws/categories/reality/` |
| `/laws/categories/reality/` | `/laws/categories/integrity/` | `/laws/categories/structure/` |
| `/laws/categories/structure/` | `/laws/categories/reality/` | `/laws/` |

The labels should follow the established bottom navigation language and make both direction and destination visible. Reality must not be a family-root exception.

`/laws/categories/reality/battery-heldout-study/` has an audit disclosure but no current story navigation. Its canonical page-level Previous/Next placement is not established by the current narrative map. The construction room must resolve that route explicitly before batch mutation; it must not silently guess or leave it as an unexplained exception.

## Required construction sequence for the next room

1. Re-enter through `AGENTS.md` and `AI_ENTRYPOINT.json` at the then-current `main` head.
2. Reconfirm the protected-page boundary and the full intended production path list.
3. Route all intended HTML, shared carousel CSS/JS, verifier, and workflow paths.
4. Obtain a fresh canonical intake and single-flight lock for production construction.
5. Freeze the per-route stage map, including exact audit-to-study correspondence and the battery-wrapper continuity decision.
6. Implement one representative high-load page first: `/laws/categories/reality/`.
7. Prove paired carousel behavior, information density, continuity placement, accessibility, reduced motion, no-JavaScript reachability, and protected-page identity.
8. Expand to representative page types before the 28-route batch: family root, narrative child, Test page, Research page, and wrapper.
9. Batch only after representative qualification passes.
10. Independently verify exact-head source and rendered behavior at desktop and narrow mobile widths.
11. Obtain explicit merge/deployment authority, merge, deploy, and verify live route behavior and static asset identity.

## Acceptance criteria

The production change is complete only when all of the following pass:

- Exactly two coordinated carousels appear on every audit-bearing article/back page in scope.
- `/laws/research/` remains a hub and does not gain an invented empty audit carousel.
- No continuous legacy-source word dump remains outside the carousels.
- Study material is meaningfully distributed across its stages instead of leaving the primary carousel sparse.
- Audit material is meaningfully partitioned across the paired stages, not placed wholesale in one audit slide.
- The paired carousels share a stable per-page index and do not enter event loops.
- Page-level Previous/Next controls occur after both carousels, never as a carousel stage.
- All 23 established narrative link pairs remain exact.
- Flow, Integrity, Reality, and Structure roots receive the category-spine Previous/Next matrix above.
- The battery-wrapper continuity decision is explicit and verified.
- Keyboard, touch, swipe, focus, tab semantics, live announcements, reduced motion, and no-JavaScript reachability pass.
- Narrow mobile layouts show usable carousel and page-continuity controls without horizontal overflow or hidden content.
- `/laws/` and `/laws/research/methods-and-models/` are byte-identical to the construction base unless separately routed and explicitly authorized by the owner.
- Static asset references resolve to the qualified build and live responses match the deployed commit.
- Independent verification is recorded before merge and repeated against the public site after deployment.

## Explicit non-goals

- No redesign of the protected Laws landing page.
- No change to the protected Methods and Models page.
- No new study claims, causal claims, evidence upgrades, or research conclusions.
- No duplication of the complete Frontier study record.
- No third carousel.
- No auto-rotation.
- No production action from this audit room.

## Handoff state

The audit is complete. The defect is reproduced in source and live DOM. The product contract and continuity matrix are frozen in this document. Production construction, qualification, merge, deployment, and live verification remain for a separately authorized room.
