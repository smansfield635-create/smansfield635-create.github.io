# Diamond Gate Bridge

**Browser applications, custom 3D rendering, diagnostic and business dashboards, Python computational models, and tools for AI-assisted software development.**

Diamond Gate Bridge is Sean Mansfield's software and research project exploring how human-directed AI development can produce working applications with testable behavior and controlled releases. This public repository contains browser experiences, JavaScript/Node and Python implementations, automated tests, GitHub Actions workflows, and recorded engineering results.

**Technologies:** JavaScript · Node.js · Python · WebGL2 / GLSL · Playwright / Chromium · GitHub Actions

**Ownership and development:** Sean originated DGB's concepts and directs its strategy, architecture, product requirements, development, and acceptance. He develops the project entirely from **phone and tablet**, using AI tools and remote execution for implementation, testing, and technical analysis. He identifies defects, directs revisions, and evaluates whether the software meets the intended behavior.

**Project history:** this repository's [root commit][first-commit] is dated **January 27, 2026 (UTC)**. By October 2026, the work spans interactive graphics, computational models, conversation software, and engineering tools.

[Explore the website](https://diamondgatebridge.com) · [Enter the product estate](https://diamondgatebridge.com/door/) · [Contact Sean](mailto:geodiametrics@gmail.com)

## Start with the software

Each example below links the implementation to its tests and evidence.

| Example | What it does | Inspect |
| --- | --- | --- |
| **H-Earth** | Renders a touch-navigable 3D world, with staged loading so the environment can become usable before all vegetation finishes. | [Renderer][hearth-renderer] · [Browser tests][hearth-tests] · [Saved results][hearth-results] |
| **Audralia — spatial weather and graphics research** | Preserves weather-object identity across viewing scales while limiting expensive local volumetric rendering. | [Model][audralia-model] · [Executable assertions and browser workflow][audralia-ci] |
| **Full Bird Kernel v3.2 — Python state and receipt validation** | Computes state transitions and validates ordered receipt chains, rejecting tampering, identity mismatches, and skipped stages. | [Implementation][kernel-source] · [16-test suite][kernel-tests] · [CI][kernel-ci] |
| **Auren — stateful conversation application** | Runs an authored, stateful conversation with paced delivery, contextual disclosure, history-aware responses, and product handoffs. | [Tested implementation][auren-historical] · [Browser qualification run][auren-run] |
| **Productivity Receipt** | Reads bounded Git history and emits a JSON report of repository activity, with explicit unknowns and measurement limits. | [Implementation][productivity-source] · [Verifier][productivity-tests] · [Observed run][productivity-run] |
| **Publication preflight** | Builds a release payload, checks its identity and dependencies, and executes registered readiness checks. | [Implementation][preflight-source] · [Fixture tests][preflight-tests] · [Observed run][preflight-run] |

The linked results identify particular tested versions. They do not serve as a blanket certification of the current repository or live website.

## Engineering decisions in practice

| Problem | Engineering response | Evidence |
| --- | --- | --- |
| A visible 3D scene can still be loading, with different costs on phone and tablet. | Separate first frame, vegetation residency, geometry construction, and completion; check movement during loading and diagnose actual startup faults. | [Device observations and browser receipts][hearth-results] · [Verifier][hearth-tests] |
| Rich weather graphics need consistent behavior as viewing scale changes. | Keep stable object identities, blend level-of-detail representations, and cap local volumetric objects. | [Audralia model][audralia-model] · [Deterministic and browser checks][audralia-ci] |
| A release can package successfully while still containing broken dependencies. | Test transitive module/CSS closure, missing assets, identity errors, server readiness, and early exit with positive and negative fixtures. | [Preflight implementation][preflight-source] · [Self-tests][preflight-tests] |

These examples connect product decisions to debugging, performance investigation, test design, and release engineering.

## Representative engineering work

### H-Earth — custom browser 3D

[Open H-Earth](https://diamondgatebridge.com/showroom/globe/h-earth/)

Source directory: `showroom/globe/h-earth/`.

The renderer acquires a WebGL2 context, compiles GLSL shaders, uploads geometry buffers, and draws indexed triangles. The [GPU binding][hearth-binding] selects the renderer and connects it to camera state; the [browser integration][hearth-integration] coordinates presentation and vegetation residency.

The [Playwright verifier][hearth-tests] checks exact checkout identity, readiness before vegetation completion, monotonic batch progress, final population counts, camera-relative touch movement, look/release/cancellation behavior, and runtime/request errors.

**Observed result:** the [saved browser receipts][hearth-results] contain passing desktop, constrained-mobile, and mobile-landscape profiles at candidate `e014ed9b55f24acb21b4fb7e7cf4eb0d46c612d7`. Each completes **27,585 instances across 108 batches**, with **zero dropped vegetation instances and zero world rebuilds**. A separate tablet-sized traversal checks movement during loading.

The instance count concerns vegetation placement, not animation frame drops.

These are Chromium/SwiftShader emulation results. They establish the tested behavior and population invariants.

**Physical-device investigation:** the same [public record][hearth-results] separately preserves owner-supplied phone and tablet observations. Both report all **27,585 instances and 108 batches**, zero dropped instances, no world rebuilds, and no context loss. The measurements separate first frame from complete loading and identify different construction costs on each device. Owner observations describe smooth movement after completion; loading responsiveness remains a distinct engineering problem.

DGB's device work combines phone/tablet/desktop qualification profiles with selected physical-device retests. Private excellence and awards-admission instruments support that process; their proprietary implementation is outside this public repository. These checks establish particular behaviors and candidates, rather than universal frame-rate or named-award certification.

**Failure/recovery example:** the same evidence includes nine controlled startup cases. Elapsed delay remains a waiting state; actual shader, context, draw, constructor, and rejection faults retain their failure identity even if readiness arrives later. The test exercises the observer and loader rather than treating every timeout as a renderer defect.

### Audralia — spatial detail and bounded rendering

Source directory: `showroom/globe/audralia/canonical-weather-spatial-lod-proof/`.

Audralia's [weather model][audralia-model] represents the same weather objects at local, regional, and planetary viewing scales. It normalizes representation weights and caps expensive local volumetric objects at **two**, while retaining stable identities and terrain-relative placement.

The [workflow][audralia-ci] contains executable assertions for deterministic state, normalized weights, the local rendering cap, and outside/inside/exit ray behavior. Its browser check changes viewing distance and checks object identity, terrain depth, errors, and runtime invariants.

**Observed local result:** an October 4 replay of the workflow's existing structural assertions against the pinned model passed. This establishes those mathematical and state invariants. The browser job specifies Chromium/SwiftShader; it is separate from physical-device performance evidence.

### Full Bird Kernel v3.2 — Python state transitions and receipt validation

The [Full Bird Kernel v3.2 implementation][kernel-source] uses Python's standard library to calculate transitions between exact eight-bit states and validate a lifecycle through successive receipts.

The [conformance suite][kernel-tests] includes:

- All **65,536 ordered numeric state pairs**.
- Phase-count and engine-occupancy fixtures.
- A valid complete receipt chain.
- Rejection of malformed states, tampered records, identity mismatches, skipped stages, and incomplete closure.

Run the existing suite from the repository root:

```bash
cd laws/research/methods-and-models/full_bird_kernel_v3_2
python3 -m unittest -v test_fbk_v3_2.py
```

The [GitHub Actions workflow][kernel-ci] runs the same suite. An October 4, 2026 replay of the source at the evidence baseline passed **16/16 tests**.

This is a computational reference. Its [claim manifest][kernel-claims] distinguishes executable conformance from empirical calibration, domain validity, and authenticated issuer/signature trust.

### Auren conversation chamber — stateful conversational software

[Open the chamber](https://diamondgatebridge.com/products/auren/)

Source directory: `products/auren/`.

Auren combines authored dialogue with client-side session state. The [session context][auren-session] records semantic events such as topic revisits, boundary acknowledgments, pressure, and handoff returns. The chamber uses that history to select responses and pace delivery.

**Historical observed result:** [run 37076455035][auren-run] succeeded on October 2, 2026 at candidate `e2ededa143e5808db7b6658d5d9ed2e29df77b88`. Its Chrome traversal log reports PASS with an empty failure list, covering contextual choices, boundary handling and recovery, history-aware revisits, product navigation, and the Book → Elara handoff.

[Qualification record][auren-record] · [Current browser verifier][auren-tests] · [Workflow][auren-ci]

The live chamber and verifier have evolved since that run. The historical source link above preserves what the result applies to. The workflow's verifier retrieval from main also means product identity alone does not freeze the complete test environment.

### Native Chat — historical browser-local model prototype

[Historical source](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/d9847a69ff46fbf31a70e71ad9216f7695bbea2e/products/on-your-side-ai/native-chat/index.js)

Native Chat integrated local language-model loading and generation in the browser, streamed responses, cancellation, recent conversation context, CPU fallback, and diagnostic timing.

Recorded tests established generation but also exposed slow responses, repetition, and follow-up reasoning failures. [Issue #3913](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/3913) records those acceptance failures; [PR #3919](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/3919) withdrew the public prototype and removed its runtime files. Historical source remains inspectable. This is model-integration and failure-investigation experience, not a current deployed conversational product or evidence of reliable reasoning.

### Productivity Receipt — bounded engineering measurement

The [Node implementation][productivity-source] reads first-parent Git history for a UTC date range, excludes identified automation, classifies commit-message signals, and writes a JSON receipt. Categories cover product, qualification, repair, governance, and publication/closure activity.

[Verifier][productivity-tests] · [Fixture][productivity-fixture] · [Workflow][productivity-ci]

**Observed result:** [run 36637958229][productivity-run] measured September 26–29, 2026 at `400af711f70d7c1a938d198346e646a3005993ef`. Its log records **232 meaningful activity entries**, a **0.7543 product-signal share**, and `PASS_MEASURED_WITH_LIMITATIONS`.

The verifier checks receipt structure and ranges. Message-based categories overlap and measure activity signals; they do not measure engineering labor or independently establish productivity. Human-intervention ratios remain **UNKNOWN** unless an externally observed count is supplied.

## Governance implemented as software

As DGB grew, its development process added controls for exact candidate identity, allowed change scope, qualification, recovery, and publication. The architectural term used within the project is **governed software-production substrate**.

A concrete public example is [publication preflight][preflight-source]. It constructs the payload, excludes configured non-public material, preserves approved runtime dependency closures, writes release identity, checks payload size, and invokes registered verification.

The [self-test][preflight-tests] contains positive and negative fixtures for transitive module/CSS dependencies, missing dependencies, invalid identity inputs, delayed server readiness, and early server exit. The October 4 source replay passed **40 checks**.

```bash
node tools/publication-preflight-self-test.v1.mjs
```

**Observed workflow result:** [run 37215437200][preflight-run] produced `PREFLIGHT_PASS` for the H-Earth staged payload at `311ea2e53ad8d769e3f2f70ede40d46fb55aae7a`, with `deploymentPerformed=false`.

[Preflight workflow][preflight-ci] · [Publication/release contract][release-contract]

Within this process, qualification, merge, deployment, and live verification are distinct steps. A preflight pass establishes the selected checks, and repository policy does not by itself demonstrate enforcement across every host or execution path.

The [public Governance Model](https://diamondgatebridge.com/governance-bridge/governance/) provides an inspection interface for the architecture. Its [catalog][governance-catalog] and [browser implementation][governance-ui] describe and display the relationships; the executable tools above demonstrate specific operational behavior.

### Evidence validation and adversarial qualification

The evidence evaluator checks whether supplied records support acceptance, conflict with one another, or leave required facts unresolved. It checks candidate and artifact identities and refuses unsupported closure when required evidence is missing or contradictory.

**Verified recorded result:** [qualification run 36270130663](https://github.com/smansfield635-create/geodiametrics/actions/runs/36270130663) succeeded at `818f44eac587645f95f237038301e517b0c501e1`. Readback of its execution output matched all **22 frozen synthetic cases** against the expected result, primary failure class, and consequent failure classes: **22 exact matches, zero mismatches**. The logs also record evaluator, runner, and packet hash checks and the absence of sealed expected answers from the execution checkout.

This is a bounded test of structured evidence classification, not a general truth detector or an evaluation of language-model answer quality. The historical public carrier is a separate execution environment under the same owner; it is not independent human review. The current implementation and frozen expected answers reside in the private engineering repository and require access for inspection.

### Dataset acquisition and held-out outcome protection

A Python workflow acquired and validated NASA C-MAPSS FD001 training and test data, checking archive layout, numerical shape, unit counts, and file identity while withholding outcome-label content from the handoff.

**Verified recorded result:** private [source-binding run 31459262254](https://github.com/smansfield635-create/geodiametrics1/actions/runs/31459262254), job `93679331453`, succeeded with `SOURCE_BOUND_SAFE_HANDOFF_READY`. Its receipt records **20,631 training rows** and **13,096 test rows**, each with **26 columns and 100 units**, plus SHA-256 file identities. Outcome bytes were not read, extracted, or handed off.

This establishes an executed acquisition and validation workflow. This run alone does not establish predictive model quality. The source and logs require private repository access; no fresh download or model-training result is claimed here.

### Browser recording repair and verified recovery

A browser recording tool stalled because it blocked the local server supplying the page. Sean directed the repair and its qualification. The repaired tool recorded an actual public application page, and the captured files were retrieved from GitHub and checked byte-for-byte. A regression test also checked decoded image pixels to detect recordings that failed to show the intended page.

The coordinated verification covered four practical questions:

| Question | Recorded result |
| --- | --- |
| Can the available execution tools run the selected work? | The execution path was tested and its saved records were read back. |
| Can existing proof survive an unrelated repository change? | Existing proof remained valid for a tested change outside the files and inputs it depended on. Relevant changes still require fresh review. |
| Can an actual consumer record a page and preserve the captured files? | Browser capture and byte-for-byte retrieval passed. |
| Are current workflows and failed or empty runs accounted for? | The inventory and tracking rules passed the checks defined for the current workflows. |

**Adopted result:** private engineering-tools [PR #660](https://github.com/smansfield635-create/geodiametrics1/pull/660) merged at `81e9d4442449be422765c7fa9de06387881e22b3`, recording all four current gaps as `CLOSED_BOUNDED`. The closure applies to the current behavior covered by those tests. The earlier historical review remains on hold (Gen492 HOLD); it was not reopened, and no independent human review is claimed. The implementation and evidence are private and require repository access for technical inspection.

### Repository maintenance

Completed maintenance includes [removing 2,600 proven duplicate files](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/5698), reducing logical content by 111.28 MB while retaining identical surviving copies and recovery history. Later changes [retired four obsolete diagnostic interfaces](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/5732) with forwarding to the current Coherence Diagnostic and [removed ten unavailable links from four support-product pages](https://github.com/smansfield635-create/smansfield635-create.github.io/pull/5739). Registered deployment checks passed for those later changes; direct verification of the four forwarding pages and four support-product pages remained open at the recorded checkpoint because workspace access was blocked. Archive consolidation and the remaining asset review are ongoing.

## Diagnostic dashboards and observability

Sean directed AI-assisted development of browser diagnostic workbenches and operates their live interfaces to inspect components, investigate failures, and evaluate evidence.

| Tool | Implemented capability | Inspect |
| --- | --- | --- |
| **Estate Laboratory** | Nine selectable instruments: seven lightweight HTTP/content checks plus separate Audralia runtime and evidence-carousel interactions; timed reports with evidence, absence, and next steps. | [Source](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/instruments/laboratory.js) |
| **Hearth Diagnostic** | Thirty selectable audits across six categories, with component/alias inspection, targeted method invocation, reports, and archive views. | [Source](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/showroom/globe/hearth/diagnostic/index.js) |
| **Audralia Diagnostic** | Participant and runtime inspection, shared report lanes, direct execution, and conductor-managed nine-station receipts that retain held or missing evidence. | [Source](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/showroom/globe/audralia/diagnostic/index.js) |
| **H-Earth FD_05** | Captures resource bytes and SHA-256 hashes before ordered native-module imports; separates transport, parser, linker, and transitive-module evidence. | [Capture](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/showroom/globe/h-earth/diagnostic/capture-runtime.js) · [Import diagnosis](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/showroom/globe/h-earth/diagnostic/h-earth.fd-05-module-import-track.js) |
| **Startup observer and performance probes** | Separates context, shader, resource, draw, presentation, and ready stages; bounded CPU/worker/WebGL probes and browser interaction metrics. | [Observer](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/showroom/globe/h-earth/diagnostic/renderer-startup-observer.v1.js) · [Profiler](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/showroom/globe/h-earth/diagnostic/run8e-r1/profiler.js) |
| **Unified instrument platform** | Coordinates four registered tools through session records, evidence envelopes, readiness transitions, and export packets. | [Tool registry](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/h-earth-3d/tools/instrument-platform/tool-registry.mjs) · [Evidence envelopes](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/h-earth-3d/tools/instrument-platform/evidence-envelope.mjs) |
| **Terrain-analysis workbench** | Eight fixed scenes and seven material families; computed slope, curvature, landform, flow-accumulation, and other model descriptors, with structured visual assessments. | [Terrain atlas](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/h-earth-3d/tools/terrain-workbench/terrain-atlas.mjs) · [Scene comparisons](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/h-earth-3d/tools/terrain-workbench/scene-lab.mjs) |

**October 5 verification:** all 109 inspected JavaScript/MJS files passed syntax checks. The existing [renderer-startup tests](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/showroom/globe/h-earth/diagnostic/renderer-startup-progress.test.mjs) passed five tests: four source/integration contracts and one executed deterministic geometry fixture. A separate private observability self-test passed projection, contradiction preservation, immutability, and invalid-event checks.

Owner-supplied browser footage demonstrates laboratory checks, Audralia runtime readiness and report generation, carousel interaction, FD_05 capture/cycle operation, and Hearth interface use. In that recording, FD_05's exact-nine receipt structure passed while missing engineering evidence correctly kept the terminal result held. Sean reports additional live diagnostic sessions; the recording does not cover every selectable mode.

These counts describe instruments and inspection views, not independently passed benchmark suites. Some Audralia selections share report lanes; a Hearth direct-run flag records method invocation rather than necessarily completed asynchronous work. SHA-256 capture establishes recorded-byte identity; comparison requires a known expected digest. Browser-side timings are not GPU execution timings, and generated-terrain measurements do not establish real-world geographic validity.

## Business dashboards and analytical models

The estate also contains implemented business software prototypes and spreadsheet research models, developed with extensive AI assistance under Sean's product direction.

| Project | Implemented capability | Inspect |
| --- | --- | --- |
| **Synthetic roofing CRM demonstration** | Searchable customer/job/branch records, status filters, activity history, document references, operating metrics, and evidence qualification. Its 111 records and company/financial assumptions are explicitly fictional. | [CRM source](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/prototypes/abc-roofing/crm-v1.js) · [Synthetic data](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/prototypes/abc-roofing/crm-data-v1.json) |
| **Construction operations prototype** | Job editing/archive, contracts/change records, invoices/payments, trade payables, attachments, local IndexedDB storage, JSON backup/restore, and production-readiness checks. | [Dashboard](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/prototypes/evan-job-stage/dashboard-v2.js) · [Calculations](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/prototypes/evan-job-stage/calc-v4.js) · [Readiness](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/prototypes/evan-job-stage/roofing-readiness-v1.js) |
| **Website analytics dashboard** | Validated snapshots, last-valid-state preservation, freshness states, daily history, equal complete-week comparisons, and page/referrer reporting backed by a Cloudflare collector. | [Dashboard](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/analytics/dashboard.js) · [Tests](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/analytics/dashboard.test.cjs) · [Data snapshot](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a/analytics/data/latest.json) |

**October 5 calculation checks:** the construction fixture and direct calculation replay matched their expected amounts; all seven roofing-readiness tests passed. Analytics tests passed **16 of 17**: the remaining test expects an older publication-trigger arrangement that differs from the current publisher workflow. That mismatch remains unresolved; it does not alone establish a live-dashboard failure.

**Spreadsheet modeling:** inspection of the Google Sheets agricultural-trajectory working model found 61 entered formula cells across its analysis and summary tabs, including regression, correlation, rank comparisons, held-out quarters, and error measurements. Its inspected summary range had no effective cell errors and reported **material improvement not established**. Some older import workbooks have connection/reference errors; populated tables are not automatically working statistical models.

The CRM is a synthetic demonstration and the construction application is a prototype. Some CRM management buttons lack action handlers in the inspected implementation. These projects establish software and operational-modeling work, not commercial adoption, enterprise CRM platform proficiency, or measured sales-conversion gains. They are DGB projects; this audit does not attribute their construction to Sean's earlier employers.

## Research and project identity

DGB also contains philosophical writing, fictional characters, experimental models, and narrative environments. These provide the project's creative identity. Technical claims are evaluated through the relevant implementation, test, and evidence chain.

Sean directed AI-assisted development and evaluation of operational safeguards. In the [bounded 36-case comparison](https://github.com/smansfield635-create/smansfield635-create.github.io/blob/fed13a2d6e2d9dbcbf3d6f05026b5f89dfebd722/evidence/agentic-frontier/reproduction/do-the-safeguards-earn-their-cost/manifest.json), full safeguards recorded **36/36 correct next actions and 36/36 recoveries**, versus **24/36 and 12/36** for the baseline. Mean checks rose from **8 to 17.889**. Component results were mixed; this operational test does not establish scientific validity or general production superiority.

Supporting research includes the **Material Work Audit**, whose [conformance summary][material-summary] records **906 pull requests**, classified as 17 PARAMOUNT, 682 STANDARD, and 207 SUPPORT: **699 material units under that study's rubric**. The [reproducibility boundary][material-boundary] explains the frozen dataset, correction overlay, and unavailable row-level v0 comparison.

The [longitudinal claim matrix][longitudinal] records bounded claims about the project's development. Commit volume, material-work classifications, and human-leverage measurements have different meanings and should be read with their methods.

## Repository boundaries

| Repository | Responsibility |
| --- | --- |
| **This public repository** | Public applications, representative source, tests/workflows, research, and evidence. |
| **`smansfield635-create/geodiametrics1` — private** | Canonical private control-plane and instrumentation work. Relevant evidence may be available through an appropriate technical review; public links do not grant access. |
| **[`smansfield635-create/geodiametrics`](https://github.com/smansfield635-create/geodiametrics)** | Historical repository and identity redirect; active work is routed to the public product or private control-plane repository. |

## Development and review

Sean Mansfield owns DGB's conception, strategy, product direction, and development decisions. AI tools contribute extensively to implementation, testing, and technical analysis. Sean defines requirements, evaluates behavior, identifies defects, directs revisions, and decides whether results meet the project's acceptance criteria. This describes project authorship and responsibility; it does not claim that he manually wrote every implementation or test.

For review, follow **implementation → test → workflow → observed result**. Evaluate the test's assertions and candidate identity alongside its PASS label. The examples above expose both the engineering work and its evidence boundaries.

The diagnostic and business-dashboard source links above are pinned to the October 5 inspection head, `ff89b731dfcae5cc72c4f2d5abd3b778dc118b2a`. Unless separately dated or identified as historical/private, other source links are pinned to the October 4 evidence baseline, `88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749`, except explicitly identified historical examples. Local source replays are separate from historical GitHub runs and live deployment verification.

AI agents performing repository work should begin with [`AI_ENTRYPOINT.json`](./AI_ENTRYPOINT.json) and follow [`AGENTS.md`](./AGENTS.md).

---

**Sean Mansfield**  
Founder / AI-Assisted Software Development  
[Diamond Gate Bridge](https://diamondgatebridge.com) · [geodiametrics@gmail.com](mailto:geodiametrics@gmail.com)

[hearth-renderer]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js
[hearth-binding]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js
[hearth-integration]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/showroom/globe/h-earth/functional-landscape/public-live-gpu-integration.run8e-r3e.js
[hearth-tests]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/tools/h-earth-full-environment-touch-verification.mjs
[hearth-results]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/h-earth-3d/experience-anchor/evidence/h-earth-full-environment-live-promotion-20261003.json
[kernel-source]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/laws/research/methods-and-models/full_bird_kernel_v3_2/fbk_v3_2.py
[kernel-tests]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/laws/research/methods-and-models/full_bird_kernel_v3_2/test_fbk_v3_2.py
[kernel-ci]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/.github/workflows/full-bird-kernel-v3-2-conformance.yml
[kernel-claims]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/laws/research/methods-and-models/full_bird_kernel_v3_2/claim_manifest.json
[auren-historical]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/e2ededa143e5808db7b6658d5d9ed2e29df77b88/products/auren/auren.chamber.js
[auren-session]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/e2ededa143e5808db7b6658d5d9ed2e29df77b88/products/auren/auren.session-context.js
[auren-tests]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/.github/live-qualification/verifiers/auren-successor-exact-head.v1.mjs
[auren-ci]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/.github/workflows/auren-successor-exact-head-qualification.yml
[auren-run]: https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/37076455035
[auren-record]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/project-records/auren-immersive-relational-successor-exact-head-qualification-closure-2026-10-02.md
[productivity-source]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/tools/dgb-productivity-receipt-v1.mjs
[productivity-tests]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/tools/verify-dgb-productivity-receipt-v1.mjs
[productivity-fixture]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/project-records/fixtures/dgb-productivity-receipt-v1.fixture.json
[productivity-ci]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/.github/workflows/dgb-productivity-receipt-v1.yml
[productivity-run]: https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/36637958229
[preflight-source]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/tools/publication-preflight.v1.mjs
[preflight-tests]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/tools/publication-preflight-self-test.v1.mjs
[preflight-ci]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/.github/workflows/publication-preflight-v1.yml
[preflight-run]: https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/37215437200
[release-contract]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/.github/ai-router/publication-release-contract.v1.json
[governance-catalog]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/assets/compass/governance-panel.catalog.v1.json
[governance-ui]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/assets/compass/compass.governance-platform.js
[material-summary]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/research/material-work-audit/material-work-audit-v1-conformance-summary.json
[material-boundary]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/research/material-work-audit/material-work-audit-v1-reproducibility-boundary.md
[longitudinal]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/evidence/agentic-frontier/research-records/longitudinal-single-operator-claim-matrix-v1.md

[first-commit]: https://github.com/smansfield635-create/smansfield635-create.github.io/commit/7c569431bf342e38225b30d67f35bd5b600854b5
[audralia-model]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/showroom/globe/audralia/canonical-weather-spatial-lod-proof/weather-model.mjs
[audralia-ci]: https://github.com/smansfield635-create/smansfield635-create.github.io/blob/88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749/.github/workflows/audralia-canonical-weather-spatial-lod-proof.yml
