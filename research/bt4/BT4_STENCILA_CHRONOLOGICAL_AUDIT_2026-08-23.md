# BT4 Stencila Chronological Audit — 2026-08-23

Status: `EVIDENCE_DERIVED_CHRONOLOGY_v1`

Purpose: establish the public Git chronology of Diamond Gate / Geodiametrics mechanisms relevant to BT4 and compare them with corresponding Stencila mechanisms. This document records chronology only. It does not assert copying, access, causal influence, patent priority, or legal inventorship.

## Governing interpretation

Three questions are kept separate:

1. Did a mechanism exist in older literature or software before either project?
2. Which project has the earlier public Git evidence for the specific formulation compared here?
3. Is there evidence that one project knew of or copied the other?

A positive answer to (2) is not evidence for (3), and it does not erase older prior art under (1).

## Executive finding

The audit rejects the simple narrative that Diamond Gate entered a fully pre-existing 2026 Stencila architecture. Stencila itself is much older and has substantial older executable-publication prior art, but several of the Stencila capabilities most closely overlapping Diamond Gate's current provenance / evidence-governance architecture were added publicly during May-June 2026, after Diamond Gate had already committed explicit evidence-governance rules in January 2026 and an executable authority-receipt / deterministic replay verifier in March 2026.

Current disposition:

`STENCILA_AS_PREEXISTING_PRIOR_ART_FOR_FULL_DIAMOND_GATE_ARCHITECTURE = NOT_SUPPORTED`

`STENCILA_OLDER_EXECUTABLE_RESEARCH_FOUNDATIONS = CONFIRMED`

`2026_PARALLEL_ARCHITECTURAL_CONVERGENCE = SUPPORTED`

`CAUSAL_INFLUENCE_OR_COPYING = NOT_ESTABLISHED`

## Chronology

### 2026-01-27 — Diamond Gate / Geodiametrics: evidence-governed advancement is already explicit

Commit `f5eeac2d4f5489ba0f441ea7aaa896895d45bdb4` publicly states:

- `Receipts block silent change.`
- `Drift is observable.`
- `Trajectory is admissibility-bounded.`
- `CHECK → RECEIPT → LOG → SEARCH → PROOF.`
- `Boundary rule enforced.`

Commit URL: https://github.com/smansfield635-create/smansfield635-create.github.io/commit/f5eeac2d4f5489ba0f441ea7aaa896895d45bdb4

The same January system describes empirical outcomes as reproducible / verifiable and treats execution and visibility as state bands.

Commit `df036c947344482952fbee249f72d6ea03ffcf5e` defines a Receipt as a proof token emitted by a valid state transition and states that absence invalidates advancement.

Commit URL: https://github.com/smansfield635-create/smansfield635-create.github.io/commit/df036c947344482952fbee249f72d6ea03ffcf5e

This is the earliest presently located Diamond Gate evidence for the core semantic relation:

`EVIDENCE / RECEIPT STATE -> TRANSITION ADMISSIBILITY`

### 2026-01-27 — Diamond Gate / Geodiametrics: provenance is already a publication condition

Commit `d659a49484b5c408e63686175d256783bd9b7d8c` states that each published artifact is traceable, that no artifact ships without provenance, and identifies a Receipt/Log Chain Demo as a provenance pipeline.

Commit URL: https://github.com/smansfield635-create/smansfield635-create.github.io/commit/d659a49484b5c408e63686175d256783bd9b7d8c

Disposition: Diamond Gate public provenance language predates Stencila's 2026 Content Credentials implementation. This does not imply provenance as a general concept was novel.

### 2026-01-28 — Diamond Gate / Geodiametrics: explicit admissibility gates and authoritative state

Commit `5b1a1880fc70fef7dcfd937911d3ae5911cddac7` describes a four-core execution architecture whose first core is an `Admissibility gate`, whose inputs are admitted or rejected, and whose commitment stage marks state as authoritative.

Commit URL: https://github.com/smansfield635-create/smansfield635-create.github.io/commit/5b1a1880fc70fef7dcfd937911d3ae5911cddac7

This strengthens the January chronology from descriptive provenance toward governed state transitions.

### 2026-03-17/18 — Diamond Gate / Geodiametrics: executable authority receipts and deterministic replay verification

Commit `1137097d545033bb59594c92b33d7a569a5c68c1`, titled `Implement authority receipt engine and verifier`, implements:

- deterministic canonical state serialization;
- FNV-1a state hashing;
- state receipts containing `STATE_HASH`, `PREV_HASH`, execution identity fields, tick and configuration facts;
- replay verification;
- explicit rejection of state-hash, enum-version and numeric-mode mismatches.

Commit URL: https://github.com/smansfield635-create/smansfield635-create.github.io/commit/1137097d545033bb59594c92b33d7a569a5c68c1

This is direct executable evidence for:

`STATE -> RECEIPT -> IDENTITY CHAIN -> REPLAY / MISMATCH VERIFICATION`

### 2026-03-18 — Stencila: durable workflow run history / resume functionality

Commit `9e2957ec6b89c4361d19e3c9750546e1df3974a8` adds workflow run listing and resumable workflow execution backed by stored run state.

Commit URL: https://github.com/stencila/stencila/commit/9e2957ec6b89c4361d19e3c9750546e1df3974a8

Disposition: Stencila clearly had sophisticated durable workflow state by March 2026. This is relevant prior art for durable execution/workflow history, but it is not the same mechanism as Diamond Gate's evidence-governed authority receipts.

### 2026-05-08 — Stencila: initial Content Credentials implementation

Commit `8f8b9fea87b00e3975971f98eac59919aa16947c` is titled `feat(content credentials): initial version of content credentials crate`.

Commit URL: https://github.com/stencila/stencila/commit/8f8b9fea87b00e3975971f98eac59919aa16947c

This is the beginning of the specific Stencila Content Credentials lineage that later became the strongest overlap with Diamond Gate's source/execution/artifact identity work.

### 2026-05-09 — Stencila: provenance snapshots and signed exported assets

Commit `644d6e015b677de33c8f90a25dad92abd6d18bea` adds provenance snapshots carrying document, execution, workflow, environment, I/O, verification and privacy facts.

Commit URL: https://github.com/stencila/stencila/commit/644d6e015b677de33c8f90a25dad92abd6d18bea

Commit `4c3d45d954d2cabd55e9f13fa55cf652d6fa272d` adds signing for encoded assets.

Commit URL: https://github.com/stencila/stencila/commit/4c3d45d954d2cabd55e9f13fa55cf652d6fa272d

Chronological relation: these Stencila mechanisms occur more than three months after Diamond Gate's January evidence-governance/provenance rules and about seven weeks after Diamond Gate's executable authority-receipt verifier.

### 2026-05-10/11 — Stencila: per-asset execution provenance and deterministic structural identity

Commit `32d5b04d90f45414d531a153eb04d9d75d37d021` adds per-asset credential provenance carrying originating node, execution, inputs, outputs and environment facts.

Commit URL: https://github.com/stencila/stencila/commit/32d5b04d90f45414d531a153eb04d9d75d37d021

Commit `4b64ab4d405d912d810b74b3d05a79beca0df629` stabilizes node identities and exposes persistent IDs in signed assertions.

Commit URL: https://github.com/stencila/stencila/commit/4b64ab4d405d912d810b74b3d05a79beca0df629

Commit `3f78c268f23d7092d319bee87a0e95486dec80a0` reserves an exact-reproducibility verification contract but explicitly returns unavailable until the checks exist.

Commit URL: https://github.com/stencila/stencila/commit/3f78c268f23d7092d319bee87a0e95486dec80a0

### 2026-05-14/16 — Stencila: tighter source and environment provenance

Commit `e24f9c674810ad3cf65fbf71535e2154c8c95975` separates export-time provenance into source, executed-code and component ingredients.

Commit URL: https://github.com/stencila/stencila/commit/e24f9c674810ad3cf65fbf71535e2154c8c95975

Commit `ba3b19f613f57ec102a80628ba7a9621f794bbc5` adds a signed execution-environment ingredient.

Commit URL: https://github.com/stencila/stencila/commit/ba3b19f613f57ec102a80628ba7a9621f794bbc5

Commit `55de1f559ea144b3906ce5a54bcd4db719c7ae79` records environment manifest digests, repository commit context and immutable informational URIs.

Commit URL: https://github.com/stencila/stencila/commit/55de1f559ea144b3906ce5a54bcd4db719c7ae79

### 2026-05-16/17 — Stencila: Content Credentials become a website/public-surface feature

Commit `edaf74e566620d79f12b03f76fa46c38ea83f0a5` adds site Content Credentials configuration.

Commit URL: https://github.com/stencila/stencila/commit/edaf74e566620d79f12b03f76fa46c38ea83f0a5

Commit `d4f7d18c3ceae4dd36588a8628442b659890f1ab` signs and annotates rendered site images and exposes credential details and verification actions on the web surface.

Commit URL: https://github.com/stencila/stencila/commit/d4f7d18c3ceae4dd36588a8628442b659890f1ab

### 2026-05-22 through 2026-05-27 — Stencila: graph-based research provenance

Commit `759af727f24fd4fe4e80ccbc8ccd1e596b5bcdf9` adds workspace graph extraction across code, documents, workflows and environments.

Commit URL: https://github.com/stencila/stencila/commit/759af727f24fd4fe4e80ccbc8ccd1e596b5bcdf9

Commit `2b41a80c724780231bc0bb03f7b270f70e6e2ea8` records repository/path/commit/worktree source metadata in graph roots.

Commit URL: https://github.com/stencila/stencila/commit/2b41a80c724780231bc0bb03f7b270f70e6e2ea8

Commit `1cc80fffc97200cbe766ac6e5c9bbdccf94d7565` imports C2PA provenance into workspace graphs.

Commit URL: https://github.com/stencila/stencila/commit/1cc80fffc97200cbe766ac6e5c9bbdccf94d7565

Commit `d3e5439539b6326b909ee9cb589ed28891aa0380` moves Content Credentials to graph provenance assertions.

Commit URL: https://github.com/stencila/stencila/commit/d3e5439539b6326b909ee9cb589ed28891aa0380

### 2026-06-11 — Stencila: modern ResearchObject / Claim / Evidence relation layer

Commit `3865a01ccd443ef3be0d92dea9732fa334c791ce` adds `ResearchObject`, `ResearchObjectRelation`, relation kinds, `Evidence`, `Protocol`, `Question`, and `Request`, and makes `Claim` extend `ResearchObject`.

Commit URL: https://github.com/stencila/stencila/commit/3865a01ccd443ef3be0d92dea9732fa334c791ce

This is the first presently located Stencila commit for the modern structured Claim/Evidence research-object relation machinery that appeared especially close in the BT4 comparison.

## Mechanism-by-mechanism disposition

| Mechanism | Earliest located Diamond Gate evidence | Earliest located Stencila evidence relevant to this audit | Chronological disposition |
|---|---|---|---|
| Evidence/receipt required for advancement | 2026-01-27 `df036c9`, `f5eeac2` | No first-class equivalent located | Diamond Gate earlier on this formulation |
| Explicit admissibility gate / authoritative transition state | 2026-01-28 `5b1a188` | Workflow gates pre-exist in Stencila lineage; exact epistemic-entitlement equivalent not located | Mixed prior art; DG formulation remains distinct |
| Public artifact provenance requirement | 2026-01-27 `d659a49` | Content Credentials begins 2026-05-08 `8f8b9fe` | DG earlier in 2026 formulation; provenance itself old prior art |
| Deterministic state receipt | 2026-03-17 `1137097` | Content Credentials provenance snapshots 2026-05-09 `644d6e0` | DG earlier for state-receipt mechanism |
| Replay mismatch detection | 2026-03-17 `1137097` | Verification / asset binding expands May 2026 | DG earlier for this exact replay-hash formulation |
| Durable workflow run history / resume | DG later lifecycle-control-plane work; exact earlier date not fixed here | 2026-03-18 `9e2957e` | Stencila earlier / confirmed prior art |
| Source/execution/output provenance | DG roots present Jan-Mar; exact full-chain milestone requires finer file-level mapping | 2026-05-09 onward | Unresolved at full-chain granularity |
| Execution-environment provenance | DG exact first implementation not fixed in this audit | 2026-05-16 `ba3b19f`, `55de1f5` | Unresolved |
| Workspace/research provenance graph | DG later repository-awareness/lifecycle lineage | 2026-05-22 `759af72` onward | Requires exact DG PR dating |
| Structured Claim/Evidence research objects | DG claim-boundary semantics precede; exact typed relation implementation requires mapping | 2026-06-11 `3865a01` | Unresolved at typed-schema level |
| Evidence state constrains public claim standing | Semantic precursor 2026-01-27: absence invalidates advancement; later explicit claim ceilings documented in repository epochs | No mature Stencila equivalent located | Surviving Diamond Gate boundary |
| Evidence degradation automatically contracts public representation | Later Diamond Gate implementation still requires decisive closed-loop demonstration | No mature Stencila equivalent located | BT4 make-or-break route remains open |

## Important negative findings

1. Stencila is not new. Its executable-document, computational-publication, buildpack/image, workflow and reproducibility lineage predates Diamond Gate by years.
2. Durable workflows are not a Diamond Gate invention. Stencila had durable workflow run/resume machinery by March 18, 2026, and broader workflow concepts predate both projects.
3. Provenance, signed artifacts, content-addressed identity, reproducibility and research-object graphs have substantial external prior art beyond Stencila.
4. No repository evidence reviewed here establishes that Stencila accessed, cited, copied, or reacted to Diamond Gate.
5. Chronological precedence in Git is not by itself legal priority or proof of invention.

## Material positive findings

1. Diamond Gate's evidence-governance semantics are publicly timestamped no later than January 27, 2026.
2. The January system already couples receipts to admissible advancement rather than treating provenance as passive metadata.
3. Diamond Gate's executable authority-receipt and deterministic replay verifier is publicly timestamped March 17/18, 2026.
4. Stencila's specific Content Credentials implementation begins May 8, 2026 and expands rapidly through May.
5. Stencila's modern structured ResearchObject / Evidence / Claim relation layer is publicly timestamped June 11, 2026.
6. Therefore, several capabilities previously treated as long-standing Stencila prior art are actually contemporaneous 2026 developments, some demonstrably later than corresponding Diamond Gate concepts or implementations.
7. The evidence currently supports parallel architectural convergence much more strongly than a simple predecessor/successor story.

## Existing Diamond Gate internal chronology corroboration

The repository already contains `docs/CANONICAL_ARCHITECTURAL_CHRONOLOGY_v1.md`, merged in commit `1f360e79bf8af7e3a2f8beae443b10b417bd8db9` (PR #1002). It independently describes early direct product/diagnostic construction as developing exact source identity, bounded mutation, deterministic evidence, diagnostic instrumentation, correction ownership and explicit claim ceilings, followed by repository awareness, lifecycle transitions, retained-state auditing, deployment proof, canonical intake, fail-closed routing, independent reproduction, evidence-standing separation, continuity and retirement governance.

Commit URL: https://github.com/smansfield635-create/smansfield635-create.github.io/commit/1f360e79bf8af7e3a2f8beae443b10b417bd8db9

This prior chronology is descriptive and does not itself create priority; it is useful corroboration and an index to underlying PR/commit evidence.

## Current BT4 ruling

The chronology materially changes how Stencila should be used as a control.

Rejected framing:

`STENCILA_ALREADY_OCCUPIED_THE_FULL_DIAMOND_GATE_ARCHITECTURE_BEFORE_DIAMOND_GATE`

Supported framing:

`DIAMOND_GATE_AND_STENCILA_INDEPENDENTLY_CONVERGED_DURING_2026_ON_OVERLAPPING_PROVENANCE_EXECUTION_AND_RESEARCH_OBJECT_PROBLEMS`

with Diamond Gate demonstrably earlier on the presently located evidence for:

- receipt-bounded advancement semantics;
- explicit drift / admissibility laws;
- provenance as a publication condition;
- executable deterministic authority receipts and replay mismatch verification.

The strongest surviving Diamond Gate-specific hypothesis remains:

`CURRENT EVIDENCE + QUALIFICATION + PROVENANCE + AUTHORITY -> PERMISSIBLE PUBLIC CLAIM STATE`

and especially the closed loop:

`EVIDENCE DEGRADATION -> EPISTEMIC STATE DEGRADATION -> FORCED PUBLIC REPRESENTATION CONTRACTION -> LAWFUL REQUALIFICATION -> RESTORATION`

No mature Stencila equivalent for that complete loop has been located.

## Next evidentiary boundary

The remaining chronology work is narrower than this audit: identify the exact earliest Diamond Gate commits/PRs for (a) source-to-live identity, (b) environment identity, (c) explicit claim ceilings, (d) held/rejected public states, and (e) automated public contraction. Those should then be compared against older non-Stencila prior art before any invention or priority claim is made.
