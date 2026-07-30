import { canonicalDigest, stableStringify } from './platform-core.mjs';
import toolRegistry, { getTool } from './tool-registry.mjs';
import { createProjectContext } from './project-context.mjs';
import sceneRegistry from './permanent-scene-registry.mjs';
import { buildEvidenceEnvelope } from './evidence-envelope.mjs';
import { createCrossToolSessionLedger } from './session-ledger.mjs';
import { CHANGE_CLASSES, routeChangeClass } from './change-class-router.mjs';
import { AUTHORITY_STATES, createAuthorityStateMachine, evaluateAuthorityTransition } from './authority-state-machine.mjs';
import { assembleBoundedCandidate } from './bounded-candidate-assembler.mjs';
import { evaluateBoundedLiveAdmission, evaluatePublicCandidateVerification, recordUserDifferential, evaluateDefaultPromotion, evaluatePublicDefaultReverification } from './terminal-controllers.mjs';
import { createInstrumentHost } from './instrument-adapters.mjs';
import { buildInstrumentPlatformPacket, downloadInstrumentPlatformPacket, serializeInstrumentPlatformPacket } from './export-platform-packet.mjs';
import postMergeProofAuthority from '../../control-plane/instrument-platform/H_EARTH_POST_MERGE_ENGINEERING_PROOF_001.v1.mjs';

const byId = (id) => document.getElementById(id);
const query = new URLSearchParams(location.search);
const sourceHead = query.get('head') || 'accdec74088120446bfc28f4441fc08a8210813f';
const candidateToken = query.get('candidate');
const postMergeProofMode = candidateToken === postMergeProofAuthority.candidateId;
const projectContext = createProjectContext({ sourceHead });
const ledger = createCrossToolSessionLedger({ projectContext, objective: 'OPERATE_H_EARTH_AS_ONE_GOVERNED_INSTRUMENT_PLATFORM' });
const stateMachine = createAuthorityStateMachine('SPECIFIED');
const host = createInstrumentHost(byId('instrument-frame'));
let latestObservation = null;
let latestCandidateAssembly = null;
let postMergeProofReceipt = null;
const terminalReceipts = [];

function parseJson(text, label) {
  try { return JSON.parse(text); }
  catch (error) { throw new Error(`${label}_JSON_INVALID:${error.message}`); }
}
function renderJson(node, value, className = '') {
  node.className = `compact result ${className}`.trim();
  node.textContent = stableStringify(value, 2);
}
function renderLedger() {
  byId('ledger').textContent = stableStringify(ledger.snapshot(), 2);
  byId('authority-state').textContent = stateMachine.getState();
}
function renderToolRegistry() {
  const list = byId('tool-list');
  list.innerHTML = '';
  for (const tool of toolRegistry.tools) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tool-button';
    button.dataset.toolId = tool.toolId;
    button.textContent = tool.displayName;
    button.addEventListener('click', () => activateTool(tool.toolId));
    list.appendChild(button);
  }
  byId('authority-partition').textContent = stableStringify(projectContext.authorityPartition, 2);
}
function renderActiveTool(tool) {
  document.querySelectorAll('.tool-button').forEach((button) => button.setAttribute('aria-current', String(button.dataset.toolId === tool.toolId)));
  byId('active-tool-name').textContent = tool.displayName;
  byId('active-tool-class').textContent = `${tool.applicationClass} · ${tool.route}`;
  byId('open-direct').onclick = () => window.open(tool.route, '_blank', 'noopener');
  byId('execute-tool').textContent = tool.actions[0] ? `Run: ${tool.actions[0].replaceAll('_', ' ')}` : 'No bounded action';
  byId('execute-tool').disabled = tool.actions.length === 0;
}
async function activateTool(toolId) {
  const tool = getTool(toolId);
  if (!tool) throw new Error(`TOOL_UNKNOWN:${toolId}`);
  renderActiveTool(tool);
  byId('instrument-result').textContent = `LOADING ${tool.toolId}`;
  try {
    latestObservation = await host.activate(toolId);
    ledger.recordToolInvocation({ toolId, action: 'ACTIVATE_AND_PROBE', route: tool.route, result: 'COMPLETE' });
    renderJson(byId('instrument-result'), latestObservation, 'ok');
    byId('admit-evidence').disabled = false;
  } catch (error) {
    ledger.recordToolInvocation({ toolId, action: 'ACTIVATE_AND_PROBE', route: tool.route, result: 'FAIL', error: String(error?.message || error) });
    byId('instrument-result').textContent = String(error?.stack || error);
    byId('instrument-result').className = 'compact result danger';
    byId('admit-evidence').disabled = true;
  }
  renderLedger();
  return latestObservation;
}
async function probeActiveTool() {
  const tool = host.getActiveTool();
  if (!tool) throw new Error('NO_ACTIVE_TOOL');
  latestObservation = await host.probe();
  ledger.recordToolInvocation({ toolId: tool.toolId, action: 'PROBE_READINESS', route: tool.route, result: 'COMPLETE' });
  renderJson(byId('instrument-result'), latestObservation, 'ok');
  byId('admit-evidence').disabled = false;
  renderLedger();
  return latestObservation;
}
async function executeActiveTool(action = null) {
  const tool = host.getActiveTool();
  if (!tool) throw new Error('NO_ACTIVE_TOOL');
  byId('execute-tool').disabled = true;
  try {
    latestObservation = await host.execute(action);
    ledger.recordToolInvocation({ toolId: tool.toolId, action: latestObservation.action, route: tool.route, result: 'COMPLETE' });
    renderJson(byId('instrument-result'), latestObservation, 'ok');
    byId('admit-evidence').disabled = false;
    return latestObservation;
  } finally {
    byId('execute-tool').disabled = false;
    renderLedger();
  }
}
function authorityClassForObservation(observation) {
  if (observation.toolId === 'H_EARTH_GAUGES') return 'SOURCE_AUTHORITY';
  if (observation.toolId === 'RUN_8E_R1_PROFILER') return observation.result?.physicalReceipt || observation.payload?.physicalReceipt ? 'DEVICE_BEHAVIOR_AUTHORITY' : 'RUNTIME_AUTHORITY';
  if (observation.toolId === 'FD_05_DIAGNOSTIC_AUTHORITY') return observation.result?.finalCompletionReceipt || observation.payload?.finalReceipt ? 'RUNTIME_AUTHORITY' : 'DIAGNOSTIC_ONLY';
  return 'DIAGNOSTIC_ONLY';
}
function admitLatestEvidence() {
  if (!latestObservation) throw new Error('NO_OBSERVATION_TO_ADMIT');
  const tool = getTool(latestObservation.toolId);
  const action = latestObservation.action ?? 'PROBE_READINESS';
  const envelope = buildEvidenceEnvelope({
    projectContextId: projectContext.projectContextId,
    sessionId: ledger.sessionId,
    toolId: latestObservation.toolId,
    operationId: `${latestObservation.toolId}_${action}`,
    changeClass: 'EVIDENCE_ONLY_OPERATION',
    authorityClass: authorityClassForObservation(latestObservation),
    sourceHead: projectContext.sourceHead,
    executedHead: projectContext.sourceHead,
    sceneRegistryVersion: sceneRegistry.schemaVersion,
    inputAuthorities: projectContext.protectedAuthorities,
    executionEnvironment: { userAgent: navigator.userAgent, viewport: { width: innerWidth, height: innerHeight, devicePixelRatio } },
    outputArtifacts: [{ type: 'IN_SESSION_INSTRUMENT_OBSERVATION', toolRoute: tool.route }],
    checks: [{ checkId: 'SAME_ORIGIN_INSTRUMENT_OBSERVED', passed: true }],
    failures: [],
    authorityEstablished: tool.authorityProduced,
    authorityNotEstablished: ['PRODUCT_ACCEPTANCE', 'PUBLIC_DEFAULT'],
    mutationsPerformed: [],
    liveStateChanged: false,
    userInputPresent: false,
    stopBoundary: 'STOP_AFTER_CROSS_TOOL_EVIDENCE_ADMISSION',
    payload: latestObservation
  });
  ledger.admitEvidence(envelope);
  renderJson(byId('instrument-result'), envelope, 'ok');
  renderLedger();
  return envelope;
}
function initializeRouter() {
  const select = byId('change-class');
  for (const changeClass of CHANGE_CLASSES) select.add(new Option(changeClass.replaceAll('_', ' '), changeClass));
  select.value = postMergeProofMode ? 'PUBLIC_ROUTE_CHANGE' : 'USER_PERCEPTUAL_COMPARISON';
  const render = () => renderJson(byId('route-result'), routeChangeClass(select.value));
  select.addEventListener('change', render);
  render();
}
function initializeStateMachine() {
  const select = byId('next-state');
  for (const state of AUTHORITY_STATES) select.add(new Option(state, state));
  select.value = 'SOURCE_IMPLEMENTED';
  byId('transition-evidence').value = stableStringify({ written: true, committed: true, fetchedBack: true, exactRepositoryVerified: true }, 2);
  byId('apply-transition').addEventListener('click', () => {
    try {
      const evidence = parseJson(byId('transition-evidence').value, 'TRANSITION_EVIDENCE');
      const result = stateMachine.transition(select.value, evidence);
      ledger.recordStateTransition(result);
      renderJson(byId('transition-result'), result, result.allowed ? 'ok' : 'danger');
      renderLedger();
    } catch (error) {
      byId('transition-result').textContent = String(error?.stack || error);
      byId('transition-result').className = 'compact result danger';
    }
  });
}
function candidateTemplate() {
  if (postMergeProofMode) return postMergeProofAuthority.candidateInput;
  return {
    operationId: 'H_EARTH_NEXT_BOUNDED_CANDIDATE', exactProjectContext: projectContext,
    establishedDiagnosis: { status: 'ESTABLISHED', statement: 'INSERT_ESTABLISHED_DIAGNOSIS' },
    perceptualTarget: { status: 'NOT_ESTABLISHED', statement: 'COMPLETE_THE_CP2_PERCEPTUAL_CORRESPONDENCE_TEST_FIRST' },
    causalTarget: { status: 'NOT_ESTABLISHED', statement: 'NO_CAUSAL_PRODUCT_TARGET_CURRENTLY_AUTHORIZED' },
    authorizedMutationManifest: { changeClass: 'MATERIAL_OR_LIGHTING_CHANGE', exactChangedPaths: [], expectedBlobIdentities: {} },
    protectedAuthoritySet: [{ authorityId: 'ACCEPTED_CP2_RENDERER', paths: [projectContext.acceptedRenderer.path] }, { authorityId: 'LIVE_HOST_AND_BINDING', paths: [projectContext.liveHost, projectContext.liveBinding] }],
    requiredVerificationMatrix: [], rollbackRelation: { baseHead: projectContext.sourceHead, rollbackTarget: projectContext.sourceHead },
    stopBoundary: 'STOP_AFTER_ISOLATED_CANDIDATE_ENGINEERING_PASS_BEFORE_LIVE_ADMISSION', presumesUserAcceptance: false
  };
}
function initializeCandidateAssembler() {
  byId('candidate-input').value = stableStringify(candidateTemplate(), 2);
  byId('evaluate-candidate').addEventListener('click', () => {
    try {
      latestCandidateAssembly = assembleBoundedCandidate(parseJson(byId('candidate-input').value, 'CANDIDATE_INPUT'));
      renderJson(byId('candidate-result'), latestCandidateAssembly, latestCandidateAssembly.authorized ? 'ok' : 'danger');
      ledger.recordToolInvocation({ toolId: 'H_EARTH_BOUNDED_CANDIDATE_ASSEMBLER', action: 'EVALUATE_CANDIDATE_ASSEMBLY', result: latestCandidateAssembly.classification });
      renderLedger();
    } catch (error) {
      byId('candidate-result').textContent = String(error?.stack || error);
      byId('candidate-result').className = 'compact result danger';
    }
  });
}
const terminalTemplates = {
  LIVE_ADMISSION: () => ({ currentAuthorityState: stateMachine.getState(), candidateId: 'CANDIDATE_ID', engineeringReceipt: { verificationMatrixPassed: false }, admissionManifest: { bounded: true, candidateRoute: null, candidateBinding: null }, rollbackRelation: { rollbackTarget: projectContext.sourceHead }, presumesAcceptance: false }),
  PUBLIC_CANDIDATE: () => ({ currentAuthorityState: stateMachine.getState(), candidateId: 'CANDIDATE_ID', publicRoute: '', publicBinding: '', routeVerified: false, bindingVerified: false, runtimeVerified: false }),
  USER_DIFFERENTIAL: () => ({ currentAuthorityState: stateMachine.getState(), baselineId: 'CP2', candidateId: 'CANDIDATE_ID', userDisposition: null, observations: [], comparisonContext: {}, automatedSubstitution: false }),
  DEFAULT_PROMOTION: () => ({ currentAuthorityState: stateMachine.getState(), candidateId: 'CANDIDATE_ID', userDifferentialReceipt: { userDisposition: null }, separatePromotionManifest: { separateOperation: true, targetDefaultRoute: null, targetBinding: null }, publicDefaultReverified: false }),
  PUBLIC_DEFAULT: () => ({ currentAuthorityState: stateMachine.getState(), candidateId: 'CANDIDATE_ID', defaultRouteVerified: false, defaultBindingVerified: false, defaultRuntimeVerified: false })
};
const terminalEvaluators = { LIVE_ADMISSION: evaluateBoundedLiveAdmission, PUBLIC_CANDIDATE: evaluatePublicCandidateVerification, USER_DIFFERENTIAL: recordUserDifferential, DEFAULT_PROMOTION: evaluateDefaultPromotion, PUBLIC_DEFAULT: evaluatePublicDefaultReverification };
function initializeTerminalControllers() {
  const select = byId('terminal-controller');
  const updateTemplate = () => { byId('terminal-input').value = stableStringify(terminalTemplates[select.value](), 2); };
  select.addEventListener('change', updateTemplate);
  updateTemplate();
  byId('evaluate-terminal').addEventListener('click', () => {
    try {
      const result = terminalEvaluators[select.value](parseJson(byId('terminal-input').value, 'TERMINAL_INPUT'));
      if (result.authorized) terminalReceipts.push(result);
      renderJson(byId('terminal-result'), result, result.authorized ? 'ok' : 'danger');
      ledger.recordToolInvocation({ toolId: `H_EARTH_${select.value}_CONTROLLER`, action: 'EVALUATE', result: result.classification });
      renderLedger();
    } catch (error) {
      byId('terminal-result').textContent = String(error?.stack || error);
      byId('terminal-result').className = 'compact result danger';
    }
  });
}
function buildCurrentPacket() { return buildInstrumentPlatformPacket({ projectContext, toolRegistry, sceneRegistry, sessionLedger: ledger.snapshot(), authorityState: stateMachine.getState(), candidateAssembly: latestCandidateAssembly, terminalReceipts }); }
function fixedClock() { return new Date('2026-07-30T20:00:00.000Z'); }
function runVerificationFixture() {
  const fixedContext = createProjectContext({ sourceHead: 'VERIFY_HEAD_000000000000000000000000000000000000' });
  const fixedLedger = createCrossToolSessionLedger({ projectContext: fixedContext, objective: 'VERIFY_UNIFIED_PLATFORM', sessionId: 'H_EARTH_SESSION_VERIFY', clock: fixedClock });
  for (const tool of toolRegistry.tools) {
    fixedLedger.recordToolInvocation({ toolId: tool.toolId, action: 'FIXTURE_PROBE', result: 'PASS' });
    fixedLedger.admitEvidence(buildEvidenceEnvelope({ projectContextId: fixedContext.projectContextId, sessionId: fixedLedger.sessionId, toolId: tool.toolId, operationId: `${tool.toolId}_FIXTURE`, changeClass: 'EVIDENCE_ONLY_OPERATION', authorityClass: 'DIAGNOSTIC_ONLY', sourceHead: fixedContext.sourceHead, executedHead: fixedContext.sourceHead, sceneRegistryVersion: sceneRegistry.schemaVersion, checks: [{ checkId: 'FIXTURE', passed: true }], authorityEstablished: tool.authorityProduced, authorityNotEstablished: ['PRODUCT_ACCEPTANCE'], stopBoundary: 'STOP_AFTER_FIXTURE', payload: { route: tool.route } }, { clock: fixedClock }));
  }
  const sourceTransition = evaluateAuthorityTransition({ from: 'SPECIFIED', to: 'SOURCE_IMPLEMENTED', evidence: { written: true, committed: true, fetchedBack: true, exactRepositoryVerified: true } });
  const prematureAcceptance = evaluateAuthorityTransition({ from: 'ENGINEERING_PASS', to: 'ACCEPTED', evidence: {} });
  const candidateRefusal = assembleBoundedCandidate({ ...candidateTemplate(), perceptualTarget: { status: 'NOT_ESTABLISHED', statement: 'UNRESOLVED' } });
  const candidatePass = assembleBoundedCandidate(postMergeProofAuthority.candidateInput);
  const differentialRefusal = recordUserDifferential({ currentAuthorityState: 'PUBLIC_CANDIDATE_VERIFIED', baselineId: 'CP2', candidateId: 'C1', userDisposition: 'ACCEPT', observations: [], automatedSubstitution: true });
  const differentialPass = recordUserDifferential({ currentAuthorityState: 'PUBLIC_CANDIDATE_VERIFIED', baselineId: 'CP2', candidateId: 'C1', userDisposition: 'ACCEPT', observations: ['VISIBLE_IMPROVEMENT_ACCEPTED'], automatedSubstitution: false });
  const firstPacket = buildInstrumentPlatformPacket({ projectContext: fixedContext, toolRegistry, sceneRegistry, sessionLedger: fixedLedger.snapshot(), authorityState: 'SPECIFIED', candidateAssembly: candidatePass, terminalReceipts: [differentialPass] });
  const secondPacket = buildInstrumentPlatformPacket({ projectContext: fixedContext, toolRegistry, sceneRegistry, sessionLedger: fixedLedger.snapshot(), authorityState: 'SPECIFIED', candidateAssembly: candidatePass, terminalReceipts: [differentialPass] });
  return { toolCount: toolRegistry.tools.length, sceneCount: sceneRegistry.scenes.length, evidenceEnvelopeCount: fixedLedger.snapshot().evidenceEnvelopes.length, sourceTransitionPass: sourceTransition.allowed, prematureAcceptanceRefused: prematureAcceptance.allowed === false, candidateRefusalPass: candidateRefusal.authorized === false, candidateAuthorizationPass: candidatePass.authorized === true, automatedDifferentialRefused: differentialRefusal.authorized === false, userDifferentialPass: differentialPass.authorized === true, deterministicExport: serializeInstrumentPlatformPacket(firstPacket) === serializeInstrumentPlatformPacket(secondPacket), firstPacket, candidateRefusal, candidatePass };
}
async function verifyInstrumentAdapters({ executeTerrainFixture = true } = {}) {
  const results = [];
  for (const tool of toolRegistry.tools) {
    const observation = await activateTool(tool.toolId);
    let execution = null;
    if (tool.toolId === 'TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH' && executeTerrainFixture) execution = await executeActiveTool('RUN_DETERMINISTIC_VERIFICATION_FIXTURE');
    const envelope = admitLatestEvidence();
    results.push({ toolId: tool.toolId, observation, execution, envelopeId: envelope.envelopeId });
  }
  return results;
}
async function sha256Text(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}
async function fetchSourceIdentity(relativeUrl, expectedSha256) {
  const url = new URL(relativeUrl, location.href);
  url.searchParams.set('proof', `${postMergeProofAuthority.candidateId}-${Date.now()}`);
  const response = await fetch(url, { cache: 'no-store' });
  const text = await response.text();
  const actualSha256 = await sha256Text(text);
  return { path: relativeUrl, httpStatus: response.status, ok: response.ok, expectedSha256, actualSha256, matches: response.ok && actualSha256 === expectedSha256 };
}
async function initializePostMergeProof() {
  document.documentElement.dataset.postMergeProofMode = String(postMergeProofMode);
  if (!postMergeProofMode) {
    document.documentElement.dataset.postMergeProofReady = 'true';
    return null;
  }
  const panel = byId('post-merge-proof-panel');
  panel.hidden = false;
  const indexIdentity = await fetchSourceIdentity('./index.html', postMergeProofAuthority.expectedSourceSha256[postMergeProofAuthority.indexPath]);
  const platformIdentity = await fetchSourceIdentity('./platform.mjs', postMergeProofAuthority.expectedSourceSha256[postMergeProofAuthority.platformPath]);
  const body = {
    schemaVersion: 'H_EARTH_POST_MERGE_RUNTIME_IDENTITY_RECEIPT_v1',
    operationId: postMergeProofAuthority.operationId,
    candidateId: postMergeProofAuthority.candidateId,
    executedSourceHead: sourceHead,
    controllingBaselineHead: postMergeProofAuthority.controllingBaseHead,
    platformAuthorityVersion: 'H_EARTH_INSTRUMENT_PLATFORM_AUTHORITY_v1',
    toolRegistryDigest: toolRegistry.registryDigest,
    sceneRegistryDigest: sceneRegistry.registryDigest,
    sessionLedgerDigest: ledger.snapshot().ledgerDigest,
    candidateAssemblyPlanDigest: postMergeProofAuthority.candidateAssembly.planDigest,
    candidateRoute: postMergeProofAuthority.candidateRoute,
    defaultRoute: postMergeProofAuthority.defaultRoute,
    sourceIdentities: [indexIdentity, platformIdentity],
    defaultPromotionPerformed: false,
    userDifferentialRecorded: false
  };
  postMergeProofReceipt = Object.freeze({ ...body, valid: postMergeProofAuthority.candidateAssembly.authorized === true && /^[0-9a-f]{40}$/i.test(sourceHead) && indexIdentity.matches && platformIdentity.matches && toolRegistry.registryDigest === postMergeProofAuthority.toolRegistryDigest && sceneRegistry.registryDigest === postMergeProofAuthority.sceneRegistryDigest, runtimeReceiptDigest: canonicalDigest(body) });
  byId('post-merge-proof-output').textContent = stableStringify(postMergeProofReceipt, 2);
  document.documentElement.dataset.postMergeProofIdentityValid = String(postMergeProofReceipt.valid);
  document.documentElement.dataset.postMergeProofReady = 'true';
  return postMergeProofReceipt;
}

byId('probe-tool').addEventListener('click', () => probeActiveTool().catch((error) => { byId('instrument-result').textContent = String(error?.stack || error); byId('instrument-result').className = 'compact result danger'; }));
byId('execute-tool').addEventListener('click', () => executeActiveTool().catch((error) => { byId('instrument-result').textContent = String(error?.stack || error); byId('instrument-result').className = 'compact result danger'; }));
byId('admit-evidence').addEventListener('click', () => { try { admitLatestEvidence(); } catch (error) { byId('instrument-result').textContent = String(error?.stack || error); byId('instrument-result').className = 'compact result danger'; } });
byId('export-platform').addEventListener('click', () => downloadInstrumentPlatformPacket(buildCurrentPacket()));
renderToolRegistry();
initializeRouter();
initializeStateMachine();
initializeCandidateAssembler();
initializeTerminalControllers();
renderLedger();
const api = Object.freeze({ projectContext, toolRegistry, sceneRegistry, ledger, stateMachine, postMergeProofAuthority, activateTool, probeActiveTool, executeActiveTool, admitLatestEvidence, buildCurrentPacket, runVerificationFixture, verifyInstrumentAdapters, getPostMergeProofReceipt: () => postMergeProofReceipt });
window.H_EARTH_INSTRUMENT_PLATFORM = api;
document.documentElement.dataset.instrumentPlatformReady = 'true';
initializePostMergeProof().catch((error) => {
  postMergeProofReceipt = Object.freeze({ valid: false, error: String(error?.stack || error) });
  const output = byId('post-merge-proof-output');
  if (output) output.textContent = stableStringify(postMergeProofReceipt, 2);
  document.documentElement.dataset.postMergeProofIdentityValid = 'false';
  document.documentElement.dataset.postMergeProofReady = 'true';
});
activateTool('H_EARTH_GAUGES').catch((error) => { byId('instrument-result').textContent = String(error?.stack || error); byId('instrument-result').className = 'compact result danger'; });
