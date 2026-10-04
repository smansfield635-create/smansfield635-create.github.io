# Diamond Gate Bridge

**Applied AI, software systems, browser-native engineering, research, and governed agentic development**

Diamond Gate Bridge is an independently developed, AI-assisted software and research platform created by Sean Mansfield beginning in January 2026. It has evolved from a public web/product project into a multi-product engineering estate spanning browser applications, native 3D systems, conversational and diagnostic software, API integrations, automated qualification, engineering measurement, and a governed agentic software-production substrate.

This README is the human-facing entry point for **recruiters, hiring managers, engineering reviewers, collaborators, and other technical evaluators**. It is intentionally different from [`AI_ENTRYPOINT.json`](./AI_ENTRYPOINT.json), which is the machine/agent entry surface for repository routing and governance.

**Portfolio:** https://diamondgatebridge.com  
**Contact:** geodiametrics@gmail.com

## 60-second technical overview

| Area | Demonstrated work |
| --- | --- |
| Languages & runtimes | JavaScript / Node.js, Python, GLSL, browser-native JavaScript |
| APIs & integration | REST/HTTP, GraphQL, authenticated API workflows, JSON serialization/deserialization |
| Testing & CI | GitHub Actions, Playwright/Chromium, deterministic and adversarial qualification, cross-language conformance |
| Integrity & provenance | Exact Git identity, SHA-256/content-addressed verification, bounded evidence and publication receipts |
| Browser-native 3D | WebGL/WebGL2/GLSL environments, reusable geometry/runtime infrastructure, device/runtime diagnostics |
| Applied AI | Governed agentic workflows, conversational systems, AI evaluation, human-disposition and authority boundaries |
| Engineering measurement | Material Work Audit, Productivity Receipt, longitudinal production analysis, bounded human-leverage measurement |
| Commercial/product background | Product architecture, customer discovery, technical sales, training, business development |

## Start here: representative engineering evidence

The repository is large. These links are intended to let a reviewer inspect representative work without reconstructing the entire estate.

### Governed agentic engineering

Diamond Gate Bridge contains a governed software-production substrate that separates **intent, authority, execution, evidence, recovery, and closure** rather than treating an AI-generated change as accepted merely because it was produced.

The public Governance Model exposes an inspection-oriented projection of that substrate:

- **14 governance functions**
- **21 relationships**
- **8 operational traversals:** Admit, Change, Qualify, Execute, Materialize, Reconcile, Recover, Close
- **8 Failure Response classes** describing what a failure triggers, blocks, preserves, propagates, requires for recovery, and permits at closure

The public presentation is inspection-only; it does not itself create governance authority.

- [Open the live Governance Model](https://diamondgatebridge.com/governance-bridge/governance/)
- [Inspect the public governance catalog](./assets/compass/governance-panel.catalog.v1.json)
- [Inspect the Governance Panel implementation](./assets/compass/compass.governance-platform.js)
- [Inspect the publication/release contract](./.github/ai-router/publication-release-contract.v1.json)

The underlying governance system also distinguishes failure classes such as product defects, qualification-harness defects, control-plane defects, execution-substrate defects, authority defects, publication defects, and scientific/empirical defects. A tool or runner failure is therefore not automatically relabeled as a product failure.

### Engineering measurement

The project includes executable instrumentation for measuring an AI-assisted engineering operation without treating raw commit volume as equivalent to productivity.

**Material Work Audit**

The canonical conformance summary freezes **906 pull requests** and classifies **699 as material units**:

- 17 PARAMOUNT
- 682 STANDARD
- 207 SUPPORT
- 906 total
- 699 material

[Inspect the canonical Material Work Audit summary](./research/material-work-audit/material-work-audit-v1-conformance-summary.json)

**DGB Productivity Receipt**

The Productivity Receipt deterministically measures bounded first-parent repository activity, filters identified automation, classifies meaningful activity into product / qualification / repair / governance / publication-closure signals, records workstream breadth, and emits a bounded measurement disposition.

Human-leverage metrics are not inferred when the necessary human-intervention evidence is absent. They remain **UNKNOWN** unless an externally observed intervention count is supplied.

- [Inspect the Productivity Receipt implementation](./tools/dgb-productivity-receipt-v1.mjs)
- [Inspect its verifier](./tools/verify-dgb-productivity-receipt-v1.mjs)
- [Inspect the GitHub Actions workflow](./.github/workflows/dgb-productivity-receipt-v1.yml)
- [Inspect the deterministic fixture](./project-records/fixtures/dgb-productivity-receipt-v1.fixture.json)
- [Inspect the bounded longitudinal claim matrix](./evidence/agentic-frontier/research-records/longitudinal-single-operator-claim-matrix-v1.md)

### Browser-native software and 3D systems

Diamond Gate Bridge includes browser-native interactive environments built with JavaScript, WebGL/WebGL2, and GLSL rather than relying exclusively on a packaged game engine. The public estate includes H-Earth, Audralia, Laws, reusable geometry/runtime infrastructure, device controls, diagnostics, and qualification evidence.

- [Open the public H-Earth surface](https://diamondgatebridge.com/showroom/globe/h-earth/)
- [Open the Door / estate entry surface](https://diamondgatebridge.com/door/)

The Governance Model above is also a software artifact in its own right: its browser implementation loads and validates a versioned substrate catalog, constructs an interactive governance map, and provides operation and failure-response inspection. Claims about its specific 3D rendering implementation should be evaluated from the source rather than inferred from appearance.

### Conversational and diagnostic systems

The estate also includes stateful conversational experiences, contextual traversal, controlled information disclosure, client-side diagnostics, structured self-rating/scenario systems, and an English-learning architecture built around 1,001 foundational words and concepts.

These systems are part of the broader Diamond Gate Bridge product estate rather than isolated portfolio exercises.

## Repository architecture and access

Diamond Gate Bridge currently spans three GitHub repositories with different responsibilities. The separation reflects the system's evolution; it was not presented as a three-repository master plan from the project's first day.

### 1. Public product and evidence estate

**`smansfield635-create/smansfield635-create.github.io`** — this repository.

This is the primary public Diamond Gate Bridge repository and the repository linked for hiring review. It contains public products/runtime surfaces, representative source, research/evidence records, qualification infrastructure, engineering measurement systems, and public portions of the governance/runtime estate.

### 2. Canonical private control-plane and instrumentation estate

**`smansfield635-create/geodiametrics1`** — private.

This repository maintains canonical private custody for control-plane and instrumentation infrastructure, including product-neutral routing, operation intake, bounded authority, execution/continuity machinery, capability evidence, and private project instruments.

Private repository access is not promised publicly. Relevant private implementation and qualification evidence can be presented through **controlled technical review during an appropriate hiring or collaboration process**. Contact: geodiametrics@gmail.com.

### 3. Public historical / identity-redirect repository

[`smansfield635-create/geodiametrics`](https://github.com/smansfield635-create/geodiametrics) — public, non-authoritative.

This repository is retained as a historical/test and repository-identity redirect surface. Its own root documentation explicitly directs active Geodiametrics/control-plane work to the canonical private repository and public Diamond Gate Bridge product work to this repository. It should not be interpreted as a third authoritative production codebase.

## Project evolution

Diamond Gate Bridge began as a public philosophy, product, and web environment. Earlier development used **CoGrid** as a complementary structural/network layer for state relationships, navigation, and system organization. The current `cogrid.net` domain routes into the unified Diamond Gate Bridge experience through Door rather than presenting a separate current CoGrid product.

As the software estate expanded, engineering controls became increasingly formalized around exact state, bounded authority, qualification, provenance, recovery, publication, and eventually governed agentic execution. The current public/private repository separation reflects that later maturity.

## How to review this work

**Recruiter / hiring manager:** start with the 60-second overview, Governance Model, Material Work Audit, Productivity Receipt, and live product links.

**Software engineer:** inspect the implementation, verifier, workflow, publication contract, browser-native systems, and repository history.

**Applied AI / agentic reviewer:** inspect the governance model, machine entrypoint, Productivity Receipt, longitudinal claim matrix, authority/failure boundaries, and qualification/recovery machinery.

**Graphics / browser engineer:** inspect the live H-Earth environment and associated WebGL/WebGL2/GLSL runtime work.

**Private technical review:** additional private control-plane and instrumentation evidence can be reviewed in a controlled hiring/collaboration context where appropriate.

## Development and evidence boundaries

This repository makes extensive use of AI-assisted engineering. AI assistance is not represented as equivalent to manually typing every line of source code.

The evidence model intentionally separates:

- **what a human intends or accepts**
- **what governance authorizes**
- **what execution actually does**
- **what evidence proves**

Repository activity and commit counts are not treated as interchangeable units of productivity. Missing historical human-intervention evidence remains unknown rather than being estimated. Bounded experiments and qualification results are reported within their tested configurations rather than generalized into universal performance claims.

## Machine / agent entry

Human reviewers should begin with this README.

AI agents and governed repository operations should begin with [`AI_ENTRYPOINT.json`](./AI_ENTRYPOINT.json) and follow the repository-resident routing and authority rules.

---

**Sean Mansfield**  
Founder / Applied AI & Software Engineer  
Diamond Gate Bridge  
https://diamondgatebridge.com  
geodiametrics@gmail.com
