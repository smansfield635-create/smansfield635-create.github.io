import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTRACT = 'LAWS_CP6_OSF_DERIVATIVE_METHODS_V1';
const SOURCE_REGISTRY = {
  registry_id: 'OSF_LAWS_CHAMBER_SOURCE_REGISTRY_v1',
  branch: 'agent/osf-laws-source-registry-001',
  pull_request: 466,
  pull_request_head: 'ae2ccedd4f74ef1afdcc5181a4056c30c83fa20d',
  source_snapshot_head: 'dbd508fc5cacaa463abed0c159812a1e02635c1d',
  claim_boundary: 'Source review and placement only. Registration, public availability, file recovery, or Chamber admission does not establish correctness, novelty, empirical validation, replication, or cross-domain generality.'
};

const CSS_LINK = '<link data-laws-derivative-methods-css="true" href="/laws/derivative-methods.css?v=LAWS_CP6_OSF_DERIVATIVE_METHODS_V1" rel="stylesheet"/>';
const SCOPE_MARKER = '<section aria-labelledby="scope-title" class="panel boundary">';

const PAGES = {
  admission: 'laws/test/admission-and-baseline/index.html',
  forward: 'laws/test/forward-construction/index.html',
  reverse: 'laws/test/reverse-audit/index.html',
  result: 'laws/test/result-and-record/index.html',
  evidence: 'laws/research/evidence-and-sources/index.html',
  methods: 'laws/research/methods-and-models/index.html'
};

const SOURCES = {
  '7jnxq': {
    title: 'Universal Law of Coherence Dynamics',
    source_class: 'FROZEN_REGISTRATION',
    admission_status: 'FILES_REVIEWED',
    method_class: 'FIXED_EVIDENCE_WINDOWS_AND_OBSERVER_PROTOCOL',
    empirical_status: 'REGISTRATION_IS_CUSTODY_NOT_VALIDATION',
    metadata_sha256: '467beb4017f844fddd7328d69b654483324235d4f941b031e4a7eb20004c5530',
    public_files: {
      'Diagnostic_Rules_Coherence_Framework.pdf': '514175c7c619adf7d208260fe47702771895e199d5bef36fd18dd3a81d2c6ced',
      'Methods_Appendix_Diagnostic_Framework.pdf': '5bb824f8c4291403ab486fd9412f2069aa9d2e49fbd4f508ada68f54caceb18f',
      'Diagnostic_Protocol_Rulebook.pdf': '8c1e9e23d58f88c2922eb949db0a7da70fa1b33b50365da74b4c3b16273da1a6',
      'Case_Selection_and_Evidence_Windows-1.pdf': '6de1a6f746dc0c9bbcbdcdd2a7b3631418f46cfc9b31ba211e3960d34d2fe2e3',
      'Observer_Replication_Guide.pdf': 'd4d7d5a005f300d5230ee6ace3711f1689583202b17cfbc538fa42a0113e6b55'
    },
    canonical_destinations: ['EVIDENCE_AND_SOURCES', 'METHODS_AND_MODELS', 'ADMISSION_AND_BASELINE', 'REVERSE_AUDIT']
  },
  '9ut2z': {
    title: 'Alignment Diagnostics, an Integrity-Based Platform',
    source_class: 'METHOD_SPECIFICATION',
    admission_status: 'ADMITTED_AS_METHOD',
    method_class: 'OBSERVE_HYPOTHESIZE_1_2_3_REDUCE_FALSIFY_ITERATE_TERMINATE_11_12_13',
    empirical_status: 'TWO_METHOD_PDFS_NO_VALIDATION_STUDY',
    metadata_sha256: '82735851ff27ee32bb19c5ac5cf99da57805d8dc3be48bdad83dd24be6799a2f',
    public_files: {
      'Integral_Platform_HOW_TO-2.pdf': '6bf9d21f9e06768e2eb829dae5641ac76bc3b74f98b1d4061910b09bb4ab8e3a',
      'Integral_Platform_Method_Explained.pdf': '13adead582dfca3140137ac7eb9d32774c53a74920cc5c104dc99a9216250343'
    },
    canonical_destinations: ['METHODS_AND_MODELS', 'FORWARD_CONSTRUCTION', 'RESULT_AND_RECORD']
  },
  '7vkgs': {
    title: 'As Easy as A–B–C–D: Diagnosing Coherence Before Collapse',
    source_class: 'METHOD_SPECIFICATION',
    admission_status: 'ADMITTED_AS_METHOD',
    method_class: 'ABCD_INTERNAL_COHERENCE_CONSTRAINT_ALIGNMENT_FRAGMENTATION_TRAJECTORY',
    empirical_status: 'PROCEDURE_ONLY',
    metadata_sha256: 'd77b87050afb73108e62c34aae8a54d93cc04756785c0bdc2dfc31b1900df979',
    public_files: {},
    canonical_destinations: ['METHODS_AND_MODELS', 'FORWARD_CONSTRUCTION', 'APPLIED_INVESTIGATIONS']
  },
  'n82xh': {
    title: 'Formal Falsification Path — Break This If You Can',
    source_class: 'METHOD_AND_STUDY_DESIGN',
    admission_status: 'ADMITTED_AS_METHOD',
    method_class: 'FORMAL_FALSIFICATION_PATH',
    empirical_status: 'PROTOCOL_WITHOUT_DATASET_OR_RESULTS',
    metadata_sha256: '12d75fd447aa5686c695264bf9387d35546d02933644eafbdaed251ed141cada',
    public_files: {},
    canonical_destinations: ['METHODS_AND_MODELS', 'REVERSE_AUDIT', 'APPLIED_INVESTIGATIONS']
  },
  'rjdms': {
    title: 'Methods Appendix: Diagnostic Application and Evaluation Protocol',
    source_class: 'METHOD_SPECIFICATION',
    admission_status: 'ADMITTED_AS_METHOD',
    method_class: 'ADMISSIBLE_EVIDENCE_FIXED_WINDOWS_OBSERVER_INVARIANCE',
    empirical_status: 'METHODS_SPECIFICATION_ONLY',
    metadata_sha256: '695a0d8ccb59b57135758a2ea89b54b5c27119f74024b98de6da1becc8bf437c',
    public_files: {},
    canonical_destinations: ['METHODS_AND_MODELS', 'ADMISSION_AND_BASELINE', 'REVERSE_AUDIT']
  }
};

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, value) {
  const target = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value, 'utf8');
}

function addCssLink(html) {
  if (html.includes(CSS_LINK)) return html;
  if (!html.includes('</head>')) throw new Error('HEAD_CLOSE_NOT_FOUND');
  return html.replace('</head>', `${CSS_LINK}\n</head>`);
}

function addRootFlag(html) {
  if (html.includes('data-osf-derivative-methods="v1"')) return html;
  return html.replace('<html ', '<html data-osf-derivative-methods="v1" ');
}

function insertMethodLayer(rel, block) {
  let html = read(rel);
  if (html.includes(`data-laws-derivative-contract="${CONTRACT}"`)) return;
  if (!html.includes(SCOPE_MARKER)) throw new Error(`SCOPE_MARKER_NOT_FOUND:${rel}`);
  const normalizedBlock = block.replace(/[ \t]+$/gm, '');
  html = addRootFlag(addCssLink(html));
  html = html.replace(SCOPE_MARKER, `${normalizedBlock}\n${SCOPE_MARKER}`);
  write(rel, html);
}

const methodHeader = (eyebrow, title, summary, chain) => `
<section aria-labelledby="derivative-methods-title" class="laws-method-layer" data-empirical-validation-claimed="false" data-laws-derivative-contract="${CONTRACT}">
  <header class="laws-method-layer__header">
    <p class="laws-method-layer__eyebrow">${eyebrow}</p>
    <h2 id="derivative-methods-title">${title}</h2>
    <p>${summary}</p>
    <div aria-label="Method chain" class="laws-method-chain">${chain.map((item) => `<span>${item}</span>`).join('<b aria-hidden="true">→</b>')}</div>
  </header>`;

const methodFooter = `
  <aside class="laws-method-boundary" data-laws-method-boundary="true">
    <strong>Derivative boundary</strong>
    <p>These page-native procedures preserve the recovered source method and its custody status. They do not create a new method, execute a study, establish replication, or upgrade any source into empirical validation.</p>
  </aside>
</section>`;

const meta = (id, extra = '') => `
<dl class="laws-method-meta">
  <div><dt>OSF source</dt><dd><a href="https://osf.io/${id}/">${id}</a></dd></div>
  <div><dt>Source class</dt><dd>${SOURCES[id].source_class}</dd></div>
  <div><dt>Admission</dt><dd>${SOURCES[id].admission_status}</dd></div>
  <div><dt>Empirical standing</dt><dd>${SOURCES[id].empirical_status}</dd></div>
  ${extra}
</dl>`;

const evidenceBlock = `${methodHeader(
  'Source custody · derivative method',
  'Begin with an inspectable source package.',
  'The frozen registration supplies protocol custody, fixed file identities, and explicit claim limits before any method is applied.',
  ['Registration', 'Protocol files', 'Hashes', 'Claim boundary']
)}
  <article class="laws-derivative-method" data-laws-method-id="7jnxq-source-package">
    <div class="laws-derivative-method__title"><span>01</span><div><h3>Frozen protocol source package</h3><p>Verify the registered source and each recovered protocol file before using any derivative procedure.</p></div></div>
    ${meta('7jnxq', '<div><dt>Registration state</dt><dd>FROZEN_REGISTRATION</dd></div>')}
    <h4>Required source set</h4>
    <ul class="laws-source-files">
      ${Object.entries(SOURCES['7jnxq'].public_files).map(([name, hash]) => `<li><strong>${name}</strong><code>${hash}</code></li>`).join('')}
    </ul>
    <h4>Custody procedure</h4>
    <ol class="laws-method-steps">
      <li>Confirm OSF registration identity <code>7jnxq</code>.</li>
      <li>Match all five recovered protocol filenames and SHA-256 values.</li>
      <li>Preserve the registration as provenance and chronology, not as a result.</li>
      <li>Carry the source class and claim boundary into every downstream derivative.</li>
    </ol>
    <p class="laws-method-output"><strong>Output:</strong> an inspectable source package eligible for method use. Registration alone does not establish correctness or validation.</p>
  </article>${methodFooter}`;

const admissionBlock = `${methodHeader(
  'Test · derivative method',
  'Fix the case and evidence window before analysis.',
  'Admission determines whether the observable record is sufficient, bounded, and comparable. No method proceeds through inferred intent or a moving evidence window.',
  ['Case eligibility', 'Admissible evidence', 'Fixed window', 'Admission record']
)}
  <article class="laws-derivative-method" data-laws-method-id="fixed-evidence-window-admission">
    <div class="laws-derivative-method__title"><span>01</span><div><h3>Case selection and evidence-window admission</h3><p>A direct derivative of the frozen registration and the diagnostic application appendix.</p></div></div>
    ${meta('7jnxq', '<div><dt>Supporting source</dt><dd>rjdms · Methods Appendix</dd></div>')}
    <h4>Inputs</h4>
    <p>A publicly documented system or event; declared constraints; observed outcomes; corrective actions; and a proposed temporal or event-based evidence window.</p>
    <h4>Ordered procedure</h4>
    <ol class="laws-method-steps">
      <li>Require records sufficient to identify declared constraints, observed outcomes, and corrective actions.</li>
      <li>Admit only externally observable, publicly documented evidence.</li>
      <li>Exclude cases that rely primarily on subjective accounts or inference of intent.</li>
      <li>Define the temporal or event-based evidence window before analysis begins.</li>
      <li>When evidence spans multiple periods, create separate windows and evaluate them independently.</li>
      <li>Reject comparisons that mix windows or retroactively adjust the window after analysis begins.</li>
    </ol>
    <p class="laws-method-output"><strong>Output:</strong> <code>ADMITTED_CASE_PACKET</code> or <code>NO_ADMISSION</code>, with the evidence window and exclusion reasons preserved.</p>
  </article>
  <article class="laws-derivative-method laws-derivative-method--compact" data-laws-method-id="rjdms-evaluation-guard">
    <div class="laws-derivative-method__title"><span>02</span><div><h3>Evaluation guard</h3><p>Apply the same evidentiary boundaries, admissible observables, and observer-convergence requirements across cases.</p></div></div>
    ${meta('rjdms')}
    <p class="laws-method-output"><strong>Cannot establish:</strong> causation, prediction, optimization, intervention efficacy, or validation from admission alone.</p>
  </article>${methodFooter}`;

const methodsBlock = `${methodHeader(
  'Research · derivative methods',
  'Use the recovered methods without merging their authorities.',
  'Four complementary methods are exposed here: disciplined inquiry, fixed diagnostics, A–B–C–D classification, and an explicit falsification program.',
  ['Observe', 'Reduce', 'Classify', 'Falsify', 'Record']
)}
  <article class="laws-derivative-method" data-laws-method-id="integral-scientific-method">
    <div class="laws-derivative-method__title"><span>01</span><div><h3>Integral Platform scientific method</h3><p>Inquiry is constrained to prevent contradiction from being defended as an answer.</p></div></div>
    ${meta('9ut2z')}
    <ol class="laws-method-steps laws-method-steps--named">
      <li><strong>Observe.</strong> Record what is present without interpretation.</li>
      <li><strong>Hypothesize.</strong> Propose a testable, reducible claim.</li>
      <li><strong>Reduce (1–2–3).</strong> State the claim; remove non-essential assumptions; test the remainder for contradiction.</li>
      <li><strong>Falsify.</strong> Allow a contradictory claim to collapse without defense or post-hoc justification.</li>
      <li><strong>Iterate (9-to-5).</strong> Remove error through ordinary, repeated work.</li>
      <li><strong>Terminate.</strong> Stop when continuation would require violating objectivity.</li>
      <li><strong>Compress (11–13).</strong> Consolidate invariants; remove duplicates; enforce integrity across the whole body of work.</li>
    </ol>
    <p class="laws-method-output"><strong>Success:</strong> clarity. A claim either stands without contradiction or collapses cleanly; neither outcome creates certainty or authority.</p>
  </article>
  <article class="laws-derivative-method" data-laws-method-id="five-diagnostic-set">
    <div class="laws-derivative-method__title"><span>02</span><div><h3>Five-diagnostic classification set</h3><p>Apply predefined rules uniformly, without weighting, tuning, or post-hoc adjustment.</p></div></div>
    ${meta('7jnxq')}
    <div class="laws-diagnostic-grid">
      <div><strong>C.A.D.</strong><span>Constraint Alignment</span><p>Correspondence between declared constraints and realized outcomes.</p></div>
      <div><strong>C.T.D.</strong><span>Constraint Transparency</span><p>Interpretability and clarity of constraints.</p></div>
      <div><strong>C.F.D.</strong><span>Constraint Fragmentation</span><p>Persistent divergence among constraints, behaviors, and outcomes.</p></div>
      <div><strong>I.M.D.</strong><span>Internal Misalignment</span><p>Coherence within individual or sub-unit decision structures.</p></div>
      <div><strong>T.D.</strong><span>Trajectory</span><p>Direction of system evolution across successive evidence windows.</p></div>
    </div>
    <p class="laws-method-output"><strong>Classification:</strong> coherence-preserving, marginally stable, or dissipative. Independent observers must converge on the same classification.</p>
  </article>
  <article class="laws-derivative-method" data-laws-method-id="abcd-diagnostic">
    <div class="laws-derivative-method__title"><span>03</span><div><h3>A–B–C–D diagnostic procedure</h3><p>Each step constrains the next. Skipping a step invalidates the diagnosis.</p></div></div>
    ${meta('7vkgs')}
    <ol class="laws-method-steps laws-method-steps--letters">
      <li><strong>A — Internal Coherence.</strong> Assess whether commitments, decisions, actions, and outcomes remain aligned.</li>
      <li><strong>B — Constraint Alignment.</strong> Assess whether stated constraints actually govern observed outcomes.</li>
      <li><strong>C — Fragmentation Under Load.</strong> Assess whether pressure amplifies misalignment into proliferation, inconsistency, or corrective escalation.</li>
      <li><strong>D — Trajectory.</strong> Assess whether successive observations indicate stabilization or sustained degradation.</li>
    </ol>
    <p class="laws-method-output"><strong>Output:</strong> diagnostic classification only—no prediction, prescription, causation, blame, or domain-specific interpretation.</p>
  </article>
  <article class="laws-derivative-method" data-laws-method-id="formal-falsification-path">
    <div class="laws-derivative-method__title"><span>04</span><div><h3>Formal falsification path</h3><p>Make the target easy to disprove under the strongest plausible conditions.</p></div></div>
    ${meta('n82xh')}
    <p><strong>Test target:</strong> in regulated systems, sustained loss of maneuverability produces trajectory narrowing detectable before observable failure.</p>
    <ol class="laws-method-steps">
      <li>Define state variables and constraints.</li>
      <li>Choose domain-appropriate maneuverability metrics.</li>
      <li>Define the lead-time window.</li>
      <li>Score trajectory narrowing.</li>
      <li>Compare the score against failure timestamps.</li>
    </ol>
    <p class="laws-method-output"><strong>Required outputs:</strong> protocols, scoring rubrics, datasets, false-positive and false-negative rates, and public revision or withdrawal if falsified. The recovered source contains the protocol, not those executed outputs.</p>
  </article>${methodFooter}`;

const forwardBlock = `${methodHeader(
  'Test · derivative method',
  'Construct a claim without protecting it from failure.',
  'This page composes the admitted inquiry and A–B–C–D procedures into one forward construction sequence while preserving their separate source identities.',
  ['Observation', 'Finite claim', 'Reduction', 'A–B–C–D', 'Falsification', 'Termination']
)}
  <article class="laws-derivative-method" data-laws-method-id="forward-construction-sequence">
    <div class="laws-derivative-method__title"><span>01</span><div><h3>Forward construction sequence</h3><p>A source-faithful composition of <code>9ut2z</code> and <code>7vkgs</code>.</p></div></div>
    ${meta('9ut2z', '<div><dt>Classification source</dt><dd>7vkgs · A–B–C–D</dd></div>')}
    <ol class="laws-method-steps">
      <li>Record the observation without interpretation.</li>
      <li>State one finite, testable, reducible claim.</li>
      <li>Remove every assumption not strictly required for the claim to stand.</li>
      <li>Test the remainder for internal contradiction.</li>
      <li>Apply A–B–C–D in order: internal coherence, constraint alignment, fragmentation under load, and trajectory.</li>
      <li>Allow contradiction to collapse the path; do not defend or reinterpret the claim.</li>
      <li>Iterate only while objectivity is preserved.</li>
      <li>Terminate when continuation would require violating objectivity.</li>
      <li>After repeated successful reductions, consolidate invariants, remove duplicates, and enforce whole-record integrity.</li>
    </ol>
    <p class="laws-method-output"><strong>Output:</strong> <code>FORWARD_METHOD_RECORD</code> containing the observation, finite claim, removed assumptions, classification, falsification result, and termination state.</p>
  </article>${methodFooter}`;

const reverseBlock = `${methodHeader(
  'Test · derivative methods',
  'Try to reproduce the classification—and break the claim.',
  'Reverse audit combines observer replication with decisive false-negative, false-positive, specificity, observer-dependence, and intervention checks.',
  ['Same evidence', 'Independent scoring', 'Convergence', 'Falsification', 'Revision']
)}
  <article class="laws-derivative-method" data-laws-method-id="observer-replication">
    <div class="laws-derivative-method__title"><span>01</span><div><h3>Observer replication procedure</h3><p>Independent observers use the same evidence window, rules, and diagnostic set.</p></div></div>
    ${meta('7jnxq', '<div><dt>Method appendix</dt><dd>rjdms</dd></div>')}
    <ol class="laws-method-steps">
      <li>Verify evidence admissibility.</li>
      <li>Apply C.A.D., C.T.D., C.F.D., I.M.D., and T.D. independently.</li>
      <li>Record classifications without weighting or aggregation.</li>
      <li>Compare convergence across observers.</li>
    </ol>
    <p class="laws-method-output"><strong>Replication criterion:</strong> observers converge on the same system classification. Persistent disagreement indicates falsification or rule ambiguity requiring a future version.</p>
  </article>
  <article class="laws-derivative-method" data-laws-method-id="decisive-falsification-audit">
    <div class="laws-derivative-method__title"><span>02</span><div><h3>Decisive falsification audit</h3><p>The target fails if any decisive condition is established.</p></div></div>
    ${meta('n82xh')}
    <ul class="laws-falsification-grid">
      <li><strong>False negative</strong><span>Failure occurs with no prior sustained maneuverability loss.</span></li>
      <li><strong>False positive</strong><span>Maneuverability loss repeatedly occurs without collapse.</span></li>
      <li><strong>Non-specificity</strong><span>The same signature appears in stable systems at similar rates.</span></li>
      <li><strong>Observer dependence</strong><span>Independent analysts cannot agree on scoring.</span></li>
      <li><strong>Intervention contradiction</strong><span>Restoring maneuverability does not alter trajectory.</span></li>
    </ul>
    <p><strong>Expected scope failures:</strong> exogenous shocks, systems without meaningful regulation, discontinuous redesigns or resets, and unobservable internal states. These are scope limits, not model successes.</p>
    <p class="laws-method-output"><strong>Required disposition:</strong> preserve and publish failure; no post-hoc reinterpretation.</p>
  </article>${methodFooter}`;

const resultBlock = `${methodHeader(
  'Test · derivative record',
  'Record whether the claim stood, collapsed, or terminated.',
  'The result record preserves the path taken and why inquiry stopped. It does not convert a clean method result into empirical validation.',
  ['Claim', 'Reduction', 'Contradiction', 'Termination', 'Invariant record']
)}
  <article class="laws-derivative-method" data-laws-method-id="integral-result-record">
    <div class="laws-derivative-method__title"><span>01</span><div><h3>Integral method result record</h3><p>A page-native record shape derived from the admitted <code>9ut2z</code> method.</p></div></div>
    ${meta('9ut2z')}
    <dl class="laws-result-record">
      <div><dt>Observation</dt><dd>What was recorded before interpretation.</dd></div>
      <div><dt>Finite claim</dt><dd>The testable, reducible hypothesis.</dd></div>
      <div><dt>Assumptions removed</dt><dd>Non-essential assumptions eliminated during 1–2–3 reduction.</dd></div>
      <div><dt>Contradiction result</dt><dd><code>STANDS_WITHOUT_CONTRADICTION</code> or <code>COLLAPSES_CLEANLY</code>.</dd></div>
      <div><dt>Iteration history</dt><dd>The ordinary error-removal steps completed.</dd></div>
      <div><dt>Termination reason</dt><dd>Why further inquiry would violate objectivity or add no lawful step.</dd></div>
      <div><dt>Invariants</dt><dd>What remained unchanged across successful reductions.</dd></div>
      <div><dt>Duplicate removal</dt><dd>Repeated structures or assumptions removed during 11–13 compression.</dd></div>
      <div><dt>Whole-record integrity</dt><dd>Whether the retained body remains non-contradictory.</dd></div>
    </dl>
    <p class="laws-method-output"><strong>Interpretation:</strong> success is clarity, not certainty or authority. A clean collapse is a correct result because it preserves integrity.</p>
  </article>${methodFooter}`;

insertMethodLayer(PAGES.evidence, evidenceBlock);
insertMethodLayer(PAGES.admission, admissionBlock);
insertMethodLayer(PAGES.methods, methodsBlock);
insertMethodLayer(PAGES.forward, forwardBlock);
insertMethodLayer(PAGES.reverse, reverseBlock);
insertMethodLayer(PAGES.result, resultBlock);

const landingPath = 'laws/index.html';
let landing = read(landingPath);
if (!landing.includes(`data-laws-local-compass-orientation="${CONTRACT}"`)) {
  landing = addRootFlag(addCssLink(landing));
  const practicalPattern = /<section aria-labelledby="laws-practical-opening-title" class="laws-use-stage"[\s\S]*?<\/section>/;
  if (!practicalPattern.test(landing)) throw new Error('LANDING_ORIENTATION_SECTION_NOT_FOUND');
  const orientation = `<section aria-labelledby="laws-practical-opening-title" class="laws-use-stage laws-local-compass-orientation" data-laws-experience-stage="use" data-laws-local-compass-orientation="${CONTRACT}">
<p class="laws-stage-number">01 / ORIENT</p>
<div>
<h2 id="laws-practical-opening-title">The Laws Compass uses the same navigation language as the Main Compass.</h2>
<p>Choose Flow, Integrity, Reality, or Structure to open a law family. Choose Test to inspect how claims are examined. Choose Research to inspect evidence, methods, findings, and boundaries.</p>
<ul class="laws-local-compass-orientation__steps">
<li><strong>Select a primary object</strong><span>Open its local family or supporting authority.</span></li>
<li><strong>Select a destination</strong><span>Review the response, then enter when ready.</span></li>
<li><strong>Drag the constellation</strong><span>Change your view without changing route authority.</span></li>
<li><strong>Select the center world</strong><span>Return to the Main Compass.</span></li>
</ul>
</div>
<div class="laws-stage-signal" aria-hidden="true"></div>
</section>`;
  landing = landing.replace(practicalPattern, orientation);
  write(landingPath, landing);
}

const css = `/* ${CONTRACT} */
.laws-method-layer{margin:clamp(1.2rem,3vw,2.5rem) 0;padding:clamp(1rem,2.4vw,2rem);border:1px solid rgba(190,215,255,.18);border-radius:1.25rem;background:linear-gradient(145deg,rgba(13,24,46,.93),rgba(8,15,31,.86));box-shadow:0 1.2rem 3rem rgba(0,0,0,.22)}
.laws-method-layer__header{max-width:66rem;margin:0 auto 1.25rem}.laws-method-layer__eyebrow{margin:0 0 .45rem;color:#a9c8ff;font-size:.76rem;font-weight:750;letter-spacing:.14em;text-transform:uppercase}.laws-method-layer__header h2{margin:.1rem 0 .55rem;font-size:clamp(1.55rem,3vw,2.6rem);line-height:1.05}.laws-method-layer__header>p:not(.laws-method-layer__eyebrow){max-width:58rem;color:rgba(238,245,255,.78);font-size:1rem;line-height:1.65}
.laws-method-chain{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap;margin-top:1rem}.laws-method-chain span{padding:.42rem .65rem;border:1px solid rgba(158,198,255,.22);border-radius:999px;background:rgba(101,145,216,.08);font-size:.78rem;font-weight:700}.laws-method-chain b{color:rgba(169,200,255,.55)}
.laws-derivative-method{max-width:66rem;margin:1rem auto 0;padding:clamp(1rem,2vw,1.5rem);border:1px solid rgba(165,198,246,.15);border-radius:1rem;background:rgba(3,10,24,.48)}.laws-derivative-method--compact{background:rgba(17,29,53,.52)}.laws-derivative-method__title{display:flex;gap:.9rem;align-items:flex-start}.laws-derivative-method__title>span{display:grid;place-items:center;min-width:2.15rem;height:2.15rem;border-radius:50%;background:rgba(133,177,245,.14);color:#c9ddff;font-size:.75rem;font-weight:800}.laws-derivative-method h3{margin:0;font-size:clamp(1.12rem,2vw,1.45rem)}.laws-derivative-method h4{margin:1.2rem 0 .55rem;color:#dbe9ff;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase}.laws-derivative-method p{line-height:1.62}.laws-derivative-method code{overflow-wrap:anywhere}
.laws-method-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin:1rem 0;padding:.85rem;border-radius:.8rem;background:rgba(118,157,218,.07)}.laws-method-meta div{min-width:0}.laws-method-meta dt{color:rgba(202,220,248,.62);font-size:.7rem;font-weight:760;letter-spacing:.07em;text-transform:uppercase}.laws-method-meta dd{margin:.16rem 0 0;color:#edf4ff;font-size:.86rem;overflow-wrap:anywhere}.laws-method-meta a{color:#b9d3ff}
.laws-method-steps{display:grid;gap:.55rem;padding-left:1.25rem}.laws-method-steps li{padding-left:.25rem;line-height:1.55}.laws-method-steps--named li strong,.laws-method-steps--letters li strong{color:#d7e6ff}.laws-method-output{margin:1rem 0 0;padding:.85rem 1rem;border-left:3px solid rgba(131,180,255,.62);background:rgba(89,132,204,.08)}
.laws-source-files{display:grid;grid-template-columns:minmax(0,1fr);min-width:0;max-width:100%;gap:.55rem;padding:0;list-style:none}.laws-source-files li{display:grid;grid-template-columns:minmax(0,1fr);min-width:0;max-width:100%;box-sizing:border-box;gap:.25rem;padding:.7rem;border:1px solid rgba(157,190,240,.12);border-radius:.7rem}.laws-source-files strong,.laws-source-files code{display:block;min-width:0;max-width:100%;white-space:normal;overflow-wrap:anywhere;word-break:break-word}.laws-source-files code{color:rgba(208,225,251,.7);font-size:.72rem}
.laws-diagnostic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem;margin-top:1rem}.laws-diagnostic-grid div{padding:.8rem;border:1px solid rgba(159,194,247,.13);border-radius:.75rem;background:rgba(98,137,196,.06)}.laws-diagnostic-grid strong{display:block;color:#cfe0ff}.laws-diagnostic-grid span{display:block;margin:.15rem 0 .35rem;font-size:.8rem;font-weight:700}.laws-diagnostic-grid p{margin:0;color:rgba(231,240,255,.72);font-size:.88rem}
.laws-falsification-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem;padding:0;list-style:none}.laws-falsification-grid li{display:grid;gap:.25rem;padding:.75rem;border:1px solid rgba(246,172,172,.16);border-radius:.75rem;background:rgba(116,42,55,.08)}.laws-falsification-grid strong{color:#ffd2d8}.laws-falsification-grid span{font-size:.9rem;line-height:1.45}
.laws-result-record{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem;margin-top:1rem}.laws-result-record div{padding:.75rem;border:1px solid rgba(159,194,247,.13);border-radius:.75rem}.laws-result-record dt{color:#cfe0ff;font-weight:750}.laws-result-record dd{margin:.25rem 0 0;color:rgba(231,240,255,.72);line-height:1.48}
.laws-method-boundary{max-width:66rem;margin:1rem auto 0;padding:.85rem 1rem;border:1px solid rgba(239,197,112,.22);border-radius:.8rem;background:rgba(112,77,25,.08)}.laws-method-boundary strong{color:#f1d79c}.laws-method-boundary p{margin:.25rem 0 0;color:rgba(238,244,255,.72);line-height:1.55}
.laws-local-compass-orientation__steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin:1rem 0 0;padding:0;list-style:none}.laws-local-compass-orientation__steps li{display:grid;gap:.18rem;padding:.7rem .8rem;border:1px solid rgba(168,201,247,.14);border-radius:.75rem;background:rgba(92,133,197,.06)}.laws-local-compass-orientation__steps strong{color:#e4efff}.laws-local-compass-orientation__steps span{color:rgba(226,237,255,.68);font-size:.86rem;line-height:1.4}
@media(max-width:720px){.laws-method-meta,.laws-diagnostic-grid,.laws-falsification-grid,.laws-result-record,.laws-local-compass-orientation__steps{grid-template-columns:1fr}.laws-method-layer{border-radius:1rem}.laws-method-chain b{display:none}.laws-method-chain span{font-size:.72rem}.laws-derivative-method__title{gap:.65rem}}
@media(prefers-reduced-motion:reduce){.laws-method-layer,.laws-derivative-method{scroll-behavior:auto}}
`;
write('laws/derivative-methods.css', css);

const manifest = {
  contract: CONTRACT,
  status: 'VERIFIED_PUBLISHED_CANDIDATE',
  source_registry: SOURCE_REGISTRY,
  first_slice_sources: SOURCES,
  landing_page_mutation: false,
  source_admission_receipt: {
    receipt_id: 'OSF_LAWS_CP6_PINNED_SOURCE_ADMISSION_RECEIPT_v1',
    path: 'laws/control-plane/osf-derivative-methods/PINNED_SOURCE_ADMISSION_RECEIPT.json',
    admission_mode: 'EXPLICIT_PINNED_SOURCE_ADMISSION',
    source_count: Object.keys(SOURCES).length,
    registry_pull_request_head: SOURCE_REGISTRY.pull_request_head,
    source_snapshot_head: SOURCE_REGISTRY.source_snapshot_head
  },
  derivative_destinations: {
    EVIDENCE_AND_SOURCES: ['7jnxq'],
    ADMISSION_AND_BASELINE: ['7jnxq', 'rjdms'],
    METHODS_AND_MODELS: ['7jnxq', '9ut2z', '7vkgs', 'n82xh', 'rjdms'],
    FORWARD_CONSTRUCTION: ['9ut2z', '7vkgs'],
    REVERSE_AUDIT: ['7jnxq', 'n82xh', 'rjdms'],
    RESULT_AND_RECORD: ['9ut2z']
  },
  claim_boundary: {
    empirical_validation_claimed: false,
    independent_replication_established: false,
    executed_study_established: false,
    public_dataset_recovered: false,
    public_analytic_code_recovered: false,
    executed_result_tables_recovered: false,
    derivative_is_new_method: false
  },
  archive_rule: 'Existing CP6-3 canonical content beginning at the scope-and-exclusions marker is preserved byte-for-byte on every child destination.'
};
const pinnedSourceAdmissionReceipt = {
  receipt_id: 'OSF_LAWS_CP6_PINNED_SOURCE_ADMISSION_RECEIPT_v1',
  status: 'PINNED_SOURCE_ADMITTED',
  admission_mode: 'EXPLICIT_PINNED_SOURCE_ADMISSION',
  admission_scope: 'PR_483_SOURCE_DERIVATIVE_USE_ONLY',
  admission_basis: {
    six_page_content_review: 'PASS',
    responsive_and_static_review: 'PASS',
    source_correspondence: 'VERIFIED'
  },
  source_registry: {
    ...SOURCE_REGISTRY,
    registry_state_at_admission: 'OPEN_DRAFT_UNMERGED'
  },
  admitted_sources: Object.fromEntries(Object.entries(SOURCES).map(([id, source]) => [id, {
    metadata_sha256: source.metadata_sha256,
    source_class: source.source_class,
    admission_status: source.admission_status
  }])),
  authorized_product: {
    contract: CONTRACT,
    pull_request: 483,
    destination_count: Object.keys(manifest.derivative_destinations).length,
    destinations: Object.keys(manifest.derivative_destinations),
    landing_page_mutation: false
  },
  evidence_boundary: manifest.claim_boundary,
  authority: {
    source_identity_admitted_for_this_candidate: true,
    source_registry_merge_required_for_this_candidate: false,
    product_merge_requires_technical_pass: true,
    merge_requires_expected_head_guard: true,
    correctness_or_validation_established: false
  }
};
write('laws/control-plane/osf-derivative-methods/PINNED_SOURCE_ADMISSION_RECEIPT.json', `${JSON.stringify(pinnedSourceAdmissionReceipt, null, 2)}\n`);
write('laws/control-plane/osf-derivative-methods/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

console.log(JSON.stringify({
  contract: CONTRACT,
  landing: landingPath,
  destinations: Object.values(PAGES),
  source_ids: Object.keys(SOURCES)
}, null, 2));
