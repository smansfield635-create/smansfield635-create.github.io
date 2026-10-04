# Diamond Gate Bridge

**Browser applications, custom 3D rendering, Python computational models, and tools for AI-assisted software development.**

Diamond Gate Bridge is a software and research project created by Sean Mansfield in January 2026. This public repository contains working browser experiences, JavaScript/Node and Python implementations, automated tests, GitHub Actions workflows, and recorded engineering results.

[Explore the website](https://diamondgatebridge.com) · [Enter the product estate](https://diamondgatebridge.com/door/) · [Contact Sean](mailto:geodiametrics@gmail.com)

## Start with the software

Each example below links the implementation to its tests and evidence.

| Example | What it does | Inspect |
| --- | --- | --- |
| **H-Earth** | Renders an interactive 3D environment with custom WebGL2/GLSL, staged vegetation loading, and touch navigation. | [Renderer][hearth-renderer] · [Browser tests][hearth-tests] · [Saved results][hearth-results] |
| **Python computational kernel** | Computes state transitions and validates ordered receipt chains, rejecting tampering, identity mismatches, and skipped stages. | [Implementation][kernel-source] · [16-test suite][kernel-tests] · [CI][kernel-ci] |
| **Auren conversation chamber** | Runs an authored, stateful conversation with paced delivery, contextual disclosure, history-aware responses, and product handoffs. | [Tested implementation][auren-historical] · [Browser qualification run][auren-run] |
| **Productivity Receipt** | Reads bounded Git history and emits a JSON report of repository activity, with explicit unknowns and measurement limits. | [Implementation][productivity-source] · [Verifier][productivity-tests] · [Observed run][productivity-run] |
| **Publication preflight** | Builds a release payload, checks its identity and dependencies, and executes registered readiness checks. | [Implementation][preflight-source] · [Fixture tests][preflight-tests] · [Observed run][preflight-run] |

The linked results identify particular tested versions. They do not serve as a blanket certification of the current repository or live website.

## Representative engineering work

### H-Earth — custom browser 3D

[Open H-Earth](https://diamondgatebridge.com/showroom/globe/h-earth/)

Source directory: `showroom/globe/h-earth/`.

The renderer acquires a WebGL2 context, compiles GLSL shaders, uploads geometry buffers, and draws indexed triangles. The [GPU binding][hearth-binding] selects the renderer and connects it to camera state; the [browser integration][hearth-integration] coordinates presentation and vegetation residency.

The [Playwright verifier][hearth-tests] checks exact checkout identity, readiness before vegetation completion, monotonic batch progress, final population counts, camera-relative touch movement, look/release/cancellation behavior, and runtime/request errors.

**Observed result:** the [saved browser receipts][hearth-results] contain passing desktop, constrained-mobile, and mobile-landscape profiles at candidate `e014ed9b55f24acb21b4fb7e7cf4eb0d46c612d7`. Each completes **27,585 instances across 108 batches**, with **zero dropped vegetation instances and zero world rebuilds**. A separate tablet-sized traversal checks movement during loading.

The instance count concerns vegetation placement, not animation frame drops.

These are Chromium/SwiftShader emulation results. They establish the tested behavior and population invariants; physical-device performance requires separate observations.

**Failure/recovery example:** the same evidence includes nine controlled startup cases. Elapsed delay remains a waiting state; actual shader, context, draw, constructor, and rejection faults retain their failure identity even if readiness arrives later. The test exercises the observer and loader rather than treating every timeout as a renderer defect.

### Python — executable state and receipt validation

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

### Auren — stateful conversational software

[Open the chamber](https://diamondgatebridge.com/products/auren/)

Source directory: `products/auren/`.

Auren combines authored dialogue with client-side session state. The [session context][auren-session] records semantic events such as topic revisits, boundary acknowledgments, pressure, and handoff returns. The chamber uses that history to select responses and pace delivery.

**Historical observed result:** [run 37076455035][auren-run] succeeded on October 2, 2026 at candidate `e2ededa143e5808db7b6658d5d9ed2e29df77b88`. Its Chrome traversal log reports PASS with an empty failure list, covering contextual choices, boundary handling and recovery, history-aware revisits, product navigation, and the Book → Elara handoff.

[Qualification record][auren-record] · [Current browser verifier][auren-tests] · [Workflow][auren-ci]

The live chamber and verifier have evolved since that run. The historical source link above preserves what the result applies to. The workflow's verifier retrieval from main also means product identity alone does not freeze the complete test environment.

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

## Research and project identity

DGB also contains philosophical writing, fictional characters, experimental models, and narrative environments. These provide the project's creative identity. Technical claims are evaluated through the relevant implementation, test, and evidence chain.

Supporting research includes the **Material Work Audit**, whose [conformance summary][material-summary] records **906 pull requests**, classified as 17 PARAMOUNT, 682 STANDARD, and 207 SUPPORT: **699 material units under that study's rubric**. The [reproducibility boundary][material-boundary] explains the frozen dataset, correction overlay, and unavailable row-level v0 comparison.

The [longitudinal claim matrix][longitudinal] records bounded claims about the project's development. Commit volume, material-work classifications, and human-leverage measurements have different meanings and should be read with their methods.

## Repository boundaries

| Repository | Responsibility |
| --- | --- |
| **This public repository** | Public applications, representative source, tests/workflows, research, and evidence. |
| **`smansfield635-create/geodiametrics1` — private** | Canonical private control-plane and instrumentation work. Relevant evidence may be available through an appropriate technical review; public links do not grant access. |
| **[`smansfield635-create/geodiametrics`](https://github.com/smansfield635-create/geodiametrics)** | Historical repository and identity redirect; active work is routed to the public product or private control-plane repository. |

## Development and review

DGB uses extensive AI-assisted engineering. Sean Mansfield created and develops the project; this README does not represent that contribution as manually typing every line of code.

For review, follow **implementation → test → workflow → observed result**. Evaluate the test's assertions and candidate identity alongside its PASS label. The examples above expose both the engineering work and its evidence boundaries.

Source links are pinned to the October 4 evidence baseline, `88f1432fbf7ef2bb9fa9bec51d8c2a12fc56c749`, except explicitly identified historical examples. Local source replays are separate from historical GitHub runs and live deployment verification.

AI agents performing repository work should begin with [`AI_ENTRYPOINT.json`](./AI_ENTRYPOINT.json) and follow [`AGENTS.md`](./AGENTS.md).

---

**Sean Mansfield**  
Founder / Applied AI & Software Engineer  
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
