# Laws back-page information-depth and continuity audit handoff

Status: audit complete; architecture reconciled; implementation not started  
Audit date: 2026-08-25  
Audited production head: `482756414d65a0aff3a5ba42f09ee5ec858629c6`  
Issue: #2082  
Draft PR: #2084  
Original intake operation: `LAWS_BACK_PAGE_DUAL_CAROUSEL_AUDIT_HANDOFF_20260825_48275641_R1`  
Original intake receipt: `ADMITTED_AND_LOCKED`, lock generation `1711`, workflow run `32904910379`

## Stop boundary for this room

This document remains a documentation-only audit and construction handoff. It does not authorize or perform production construction.

Do not merge this handoff as if it were the product change. Do not deploy from this room. Do not modify production HTML, CSS, JavaScript, carousel runtime, verifiers, workflows, protected pages, or public routes under the original audit operation.

The construction room must enter through the repository AI entry point at the then-current exact `main` head, route every intended production path, obtain a fresh canonical intake, implement, independently qualify, explicitly merge/deploy only with the required authority, and verify the live pages.

## Architecture reconciliation — controlling construction direction

The audit began under a two-coordinated-carousel remedy. That proposal is preserved as historical design reasoning, but it is superseded for construction by the later owner-directed comparison against the existing Methods and Models information-depth architecture.

The controlling production target is:

`ONE PRIMARY CAROUSEL → METHODS-AND-MODELS-STYLE PROGRESSIVE INFORMATION INLAY → PAGE-LEVEL PREVIOUS/NEXT CONTINUITY`

The audit diagnosis, route inventory, measurements, continuity matrix, protected-page boundary, and representative-first construction discipline remain authoritative. Only the proposed second-carousel remedy is superseded.

### Why the remedy changed

The two-carousel model correctly recognized that study material and audit/custody material must correspond by stage, but it represented one intellectual object as two synchronized navigation systems. Source inspection of the current shared back-page runtime and the protected Methods and Models reference established a simpler path:

- the current shared back-page carousel already has a stage summary state and a bounded stage inspection state;
- Methods and Models demonstrates progressive information depth inside one selected object: plain-language reading first, then deeper engineering/evidence/failure/limits material;
- therefore stage correspondence can be intrinsic rather than synchronized: each stage owns both its readable interpretation and its corresponding record depth;
- this removes paired-index synchronization, duplicate tab/focus systems, paired history state, and mobile coordination burden;
- it also preserves a single narrative axis from orientation through evidence and boundary to page-level continuation.

The Methods and Models page is an architectural reference, not a code template. It remains protected and must not be modified under this construction.

## Audit scope and method

The audit covered all 29 current, non-protected Laws back-page routes mounted by the shared carousel runtime at the audited commit. It combined exact-head source inspection with live DOM inspection at the public host.

For each route, the audit recorded:

- shared carousel contract and mount state;
- primary carousel tab and word counts;
- audit disclosure count and payload size;
- legacy-source payload size;
- audit article and nested-disclosure counts;
- page-level continuity navigation presence and targets;
- current DOM order.

Protected routes were examined only to establish the boundary and reference architecture and must remain untouched:

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

That order is structurally wrong because the audit record is detached from the stage it qualifies and appears after story continuation. Under the reconciled model, audit/custody material moves into the appropriate stage inspection depth and page-level continuity remains below the complete carousel experience.

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

For each audit-bearing route, the target document order is:

1. Page header and bounded orientation material.
2. One primary carousel with the existing page-specific stage count.
3. Within each stage: concise reading surface plus bounded progressive inspection depth containing the corresponding evidence/audit/custody material.
4. Page-level Previous and Next continuity controls below the complete carousel experience.
5. Footer or return links.

No second carousel is required. No continuous legacy audit/source dump remains beneath the carousel. Page-level Previous/Next is not a carousel stage.

### Three information depths

The shared conceptual model is:

1. **Orbit / summary** — identity, orientation, stage title, short synopsis, and one clear inspection action.
2. **Reading / interpretation** — plain-language meaning, relationship, practical or engineering interpretation, and why the material matters.
3. **Record / inspection** — the stage-specific evidence, method/procedure, source/custody, checkpoints, disposition, failure behavior, limits/claim ceiling, unresolved items, and bounded artifact/receipt access where warranted.

The stage is the unit of meaning. Do not force every possible record heading into every stage. Use the common semantic vocabulary only where the source material warrants it.

### Stage semantics

Use the existing primary stage count on each page as the governing count. Redistribute the useful legacy record into the stage it actually qualifies:

1. Orientation / identity / custody.
2. Concept or relationship / sources and controls.
3. Practical or engineering reading / procedure and checkpoints.
4. Evidence or result / observed record and disposition.
5. Boundary or continuation / claim ceiling, unresolved items, and handoff.

Four-stage pages combine adjacent roles without losing custody or boundary material. `/laws/research/` remains a three-stage hub with no audit record and does not gain invented record depth.

### Progressive-inlay contract

- One carousel index remains authoritative per route.
- Each stage owns its own corresponding record depth; no cross-carousel synchronization exists.
- Entering inspection does not navigate to a detached reader or expose the entire page audit wholesale.
- A stage may contain one major progressive-depth action and only the bounded nested artifact disclosures actually needed by that stage.
- Returning from inspection restores the same stage and predictable focus.
- One click, key action, or swipe advances one carousel stage.
- Current stage, total stages, accessible name, selected tab state, focus order, keyboard operation, touch behavior, and reduced-motion behavior remain correct.
- Deep links and browser history have one carousel index, not competing paired indices.
- The existing shared back-page runtime should be extended rather than replaced unless qualification proves that impossible.

### Source-first / no-JavaScript law

Methods and Models is the information-depth reference, but its JavaScript-generated progressive markup must not be copied as the only source of the record.

For converted back pages:

`SOURCE HTML = COMPLETE AUTHORITATIVE RECORD`

`JAVASCRIPT = PRESENTATION AND SPATIAL ENHANCEMENT`

With JavaScript unavailable, all substantive material must remain reachable in readable source order and page-level continuity links must remain usable. Enhancement may compact, reveal, arrange, or spatially present the record; it must not be the sole custody location for that record.

### Anti-word-dump rules

- Do not move a 1,000–1,600-word legacy audit wholesale into a prettier inspection card.
- Decompose legacy material by semantic relationship to the existing stages.
- Do not replace one word dump with a stack of empty or repetitive cards.
- Do not duplicate substantial prose between summary, reading, and record depth.
- Preserve exact evidence standing, negative findings, claim ceilings, receipts, custody, and unresolved items even when prose is compressed.
- Raw or unusually large artifacts may receive a bounded inspect action, but one action must never reveal the entire legacy page as a continuous uncontrolled body.

## Visual continuity contract

The owner video comparison establishes Methods and Models as the visual reference for the stronger star-field/background treatment. Construction should reconcile the reusable Laws cosmic/star treatment across the applicable back-page family without copying protected page-specific motion or changing Methods and Models itself.

Priority is the background field and spatial depth. Motion parity is secondary. The visual change must not compromise text contrast, interaction stability, reduced-motion behavior, mobile performance, or content reachability.

## Bottom continuity contract

The 23 existing narrative Previous/Next pairs are correct and must be preserved exactly:

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
| `/laws/categories/structure/governance