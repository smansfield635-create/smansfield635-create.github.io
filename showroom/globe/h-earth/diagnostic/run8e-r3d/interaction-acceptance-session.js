export const H_EARTH_INTERACTION_ACCEPTANCE_SESSION_ID =
  'H_EARTH_INTERACTION_ACCEPTANCE_SESSION_v1';

const TESTS = Object.freeze([
  ['TURN_LEFT', 'Look left with one finger'],
  ['TURN_RIGHT', 'Look right with one finger'],
  ['PITCH_UP', 'Look up with one finger'],
  ['PITCH_DOWN', 'Look down with one finger'],
  ['MOVE_FORWARD', 'Move forward with two fingers'],
  ['MOVE_BACKWARD', 'Move backward with two fingers'],
  ['ZOOM_IN', 'Pinch outward to zoom in'],
  ['ZOOM_OUT', 'Pinch inward to zoom out']
]);

const clone = (value) => JSON.parse(JSON.stringify(value));
const nowIso = () => new Date().toISOString();

function makeButton(label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', action);
  Object.assign(button.style, {
    minHeight: '44px',
    border: '1px solid rgba(255,255,255,.28)',
    borderRadius: '999px',
    padding: '.65rem .9rem',
    background: 'rgba(255,255,255,.08)',
    color: 'inherit',
    font: 'inherit'
  });
  return button;
}

export function installHEarthInteractionAcceptanceSession({ routeApi, root } = {}) {
  if (!routeApi || typeof routeApi.getIntakeReceipt !== 'function' || typeof routeApi.getLiveGpuReceipt !== 'function') {
    throw new TypeError('H_EARTH_INTERACTION_ACCEPTANCE_ROUTE_API_REQUIRED');
  }
  if (!(root instanceof HTMLElement)) throw new TypeError('H_EARTH_INTERACTION_ACCEPTANCE_ROOT_REQUIRED');

  let state = 'IDLE';
  let durationSeconds = 60;
  let startedAt = null;
  let completedAt = null;
  let deadline = 0;
  let baselineProposalCount = 0;
  let baselineFrameCount = 0;
  let intervalId = null;
  let receipt = null;
  const observations = new Map(TESTS.map(([action]) => [action, {
    action,
    attempts: 0,
    acceptedProposalCount: 0,
    maximumMagnitude: 0,
    firstObservedAt: null,
    lastObservedAt: null,
    classification: 'NOT_DETECTED'
  }]));

  const section = document.createElement('section');
  section.dataset.hEarthInteractionAcceptance = 'true';
  Object.assign(section.style, {
    margin: '1rem 0',
    padding: '1rem',
    border: '1px solid rgba(255,255,255,.18)',
    borderRadius: '1.25rem',
    background: 'rgba(8,13,17,.92)',
    color: '#f5f7f8'
  });

  const title = document.createElement('h2');
  title.textContent = 'Interaction acceptance session';
  title.style.margin = '0 0 .5rem';

  const summary = document.createElement('p');
  summary.textContent = 'Run a compact 30- or 60-second test after the first visible frame.';

  const status = document.createElement('output');
  status.style.display = 'block';
  status.style.margin = '.75rem 0';
  status.style.fontFamily = 'monospace';

  const instructions = document.createElement('ol');
  instructions.style.paddingLeft = '1.35rem';
  for (const [, label] of TESTS) {
    const item = document.createElement('li');
    item.textContent = label;
    instructions.append(item);
  }

  const controls = document.createElement('div');
  Object.assign(controls.style, { display: 'flex', flexWrap: 'wrap', gap: '.55rem' });

  const receiptOutput = document.createElement('pre');
  receiptOutput.hidden = true;
  Object.assign(receiptOutput.style, {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    maxHeight: '24rem',
    overflow: 'auto',
    padding: '.75rem',
    borderRadius: '.75rem',
    background: 'rgba(0,0,0,.35)'
  });

  function resetObservations() {
    for (const value of observations.values()) {
      value.attempts = 0;
      value.acceptedProposalCount = 0;
      value.maximumMagnitude = 0;
      value.firstObservedAt = null;
      value.lastObservedAt = null;
      value.classification = 'NOT_DETECTED';
    }
  }

  function renderStatus() {
    const remaining = state === 'RUNNING' ? Math.max(0, Math.ceil((deadline - performance.now()) / 1000)) : 0;
    const detected = [...observations.values()].filter((item) => item.acceptedProposalCount > 0).length;
    status.textContent = state === 'RUNNING'
      ? `RUNNING · ${remaining}s remaining · ${detected}/8 detected`
      : `${state} · ${detected}/8 detected`;
  }

  function collect() {
    if (state !== 'RUNNING') return;
    const intakeReceipt = routeApi.getIntakeReceipt();
    const proposals = intakeReceipt.proposals.slice(baselineProposalCount);
    for (const proposal of proposals) {
      const action = proposal?.intent?.action;
      const observation = observations.get(action);
      if (!observation || proposal.__interactionAcceptanceCounted) continue;
      proposal.__interactionAcceptanceCounted = true;
      observation.attempts += 1;
      observation.firstObservedAt ??= nowIso();
      observation.lastObservedAt = nowIso();
      const magnitude = Number(proposal.intent?.magnitude ?? proposal.intent?.degrees ?? 0);
      if (Number.isFinite(magnitude)) observation.maximumMagnitude = Math.max(observation.maximumMagnitude, magnitude);
      if (proposal.accepted === true) observation.acceptedProposalCount += 1;
    }
    renderStatus();
    if (performance.now() >= deadline) finalize('COMPLETE');
  }

  function classify(observation) {
    if (observation.acceptedProposalCount < 1) return 'NOT_DETECTED';
    if (observation.attempts > 2) return 'WEAK_RESPONSE';
    return 'PASS';
  }

  function buildReceipt(terminalState) {
    const intakeReceipt = routeApi.getIntakeReceipt();
    const gpuReceipt = routeApi.getLiveGpuReceipt();
    const results = {};
    let passCount = 0;
    let weakCount = 0;
    let failureCount = 0;
    for (const [action] of TESTS) {
      const observation = observations.get(action);
      observation.classification = classify(observation);
      results[action] = clone(observation);
      if (observation.classification === 'PASS') passCount += 1;
      else if (observation.classification === 'WEAK_RESPONSE') weakCount += 1;
      else failureCount += 1;
    }
    const resources = gpuReceipt.resources ?? {};
    const context = resources.context ?? {};
    return {
      version: 'H_EARTH_INTERACTION_ACCEPTANCE_RECEIPT_v1',
      sessionId: H_EARTH_INTERACTION_ACCEPTANCE_SESSION_ID,
      terminalState,
      device: {
        userAgent: navigator.userAgent,
        pixelRatio: window.devicePixelRatio || 1,
        viewport: gpuReceipt.viewport ?? null,
        webglVendor: context.unmaskedVendor ?? context.vendor ?? null,
        webglRenderer: context.unmaskedRenderer ?? context.renderer ?? null
      },
      session: {
        durationSeconds,
        startedAt,
        completedAt,
        rendererReadyAtStart: baselineFrameCount > 0,
        visibleFrameAtStart: baselineFrameCount > 0,
        framesPresentedDuringSession: Math.max(0, (gpuReceipt.counters?.gpuFramebufferPresentationCount ?? 0) - baselineFrameCount),
        proposalsDuringSession: Math.max(0, (intakeReceipt.counters?.navigationProposalCount ?? 0) - baselineProposalCount)
      },
      results,
      summary: {
        passCount,
        weakResponseCount: weakCount,
        failureCount,
        gestureFunctionalAcceptance: failureCount === 0 ? 'PASS' : 'REQUIRES_REVIEW',
        gestureQualityAcceptance: weakCount === 0 && failureCount === 0 ? 'PASS' : 'REQUIRES_REVIEW'
      }
    };
  }

  function finalize(terminalState = 'COMPLETE') {
    if (state !== 'RUNNING') return receipt;
    clearInterval(intervalId);
    intervalId = null;
    collect();
    completedAt = nowIso();
    state = terminalState;
    receipt = buildReceipt(terminalState);
    receiptOutput.hidden = false;
    receiptOutput.textContent = JSON.stringify(receipt, null, 2);
    window.H_EARTH_INTERACTION_ACCEPTANCE_RECEIPT = clone(receipt);
    window.dispatchEvent(new CustomEvent('h-earth-interaction-acceptance-complete', { detail: clone(receipt) }));
    renderStatus();
    return clone(receipt);
  }

  function start(seconds) {
    const gpuReceipt = routeApi.getLiveGpuReceipt();
    const visibleFrames = gpuReceipt.counters?.gpuFramebufferPresentationCount ?? 0;
    if (visibleFrames < 1) throw new Error('H_EARTH_INTERACTION_ACCEPTANCE_VISIBLE_FRAME_REQUIRED');
    if (intervalId) clearInterval(intervalId);
    resetObservations();
    durationSeconds = seconds;
    state = 'RUNNING';
    startedAt = nowIso();
    completedAt = null;
    receipt = null;
    receiptOutput.hidden = true;
    const intakeReceipt = routeApi.getIntakeReceipt();
    baselineProposalCount = intakeReceipt.proposals.length;
    baselineFrameCount = visibleFrames;
    deadline = performance.now() + seconds * 1000;
    intervalId = setInterval(collect, 250);
    renderStatus();
  }

  function reset() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    state = 'IDLE';
    receipt = null;
    startedAt = null;
    completedAt = null;
    resetObservations();
    receiptOutput.hidden = true;
    receiptOutput.textContent = '';
    renderStatus();
  }

  async function copyReceipt() {
    if (!receipt) return;
    await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
  }

  function downloadReceipt() {
    if (!receipt) return;
    const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `h-earth-interaction-acceptance-${durationSeconds}s-${Date.now()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  controls.append(
    makeButton('Start 30 seconds', () => start(30)),
    makeButton('Start 60 seconds', () => start(60)),
    makeButton('End now', () => finalize('COMPLETE_WITH_CONCERNS')),
    makeButton('Reset', reset),
    makeButton('Copy receipt', copyReceipt),
    makeButton('Download receipt', downloadReceipt)
  );

  section.append(title, summary, status, instructions, controls, receiptOutput);
  root.append(section);
  renderStatus();

  const api = Object.freeze({
    sessionId: H_EARTH_INTERACTION_ACCEPTANCE_SESSION_ID,
    start30: () => start(30),
    start60: () => start(60),
    endNow: () => finalize('COMPLETE_WITH_CONCERNS'),
    reset,
    getReceipt: () => receipt ? clone(receipt) : null,
    getState: () => state
  });
  window.H_EARTH_INTERACTION_ACCEPTANCE = api;
  return api;
}

export default installHEarthInteractionAcceptanceSession;
