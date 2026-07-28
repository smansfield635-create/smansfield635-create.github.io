const SESSION_ID = 'H_EARTH_INTERACTION_ACCEPTANCE_SESSION_v1';
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
const clone = value => JSON.parse(JSON.stringify(value));
const iso = () => new Date().toISOString();

function button(label, action) {
  const node = document.createElement('button');
  node.type = 'button';
  node.textContent = label;
  node.addEventListener('click', action);
  return node;
}

export function installHEarthInteractionAcceptance({ routeApi, host } = {}) {
  if (!routeApi?.getIntakeReceipt || !routeApi?.getLiveGpuReceipt) throw new Error('INTERACTION_ACCEPTANCE_ROUTE_API_REQUIRED');
  if (!(host instanceof HTMLElement)) throw new Error('INTERACTION_ACCEPTANCE_HOST_REQUIRED');

  let state = 'IDLE';
  let durationSeconds = 60;
  let startedAt = null;
  let completedAt = null;
  let deadline = 0;
  let startProposalCount = 0;
  let proposalCursor = 0;
  let startFrameCount = 0;
  let timer = null;
  let receipt = null;
  const countedSequences = new Set();
  const results = new Map(TESTS.map(([action]) => [action, {
    action,
    attempts: 0,
    acceptedProposalCount: 0,
    maximumMagnitude: 0,
    firstObservedAt: null,
    lastObservedAt: null,
    classification: 'NOT_DETECTED'
  }]));

  const panel = document.createElement('details');
  panel.className = 'h-earth-startup-receipt';
  panel.open = true;
  const heading = document.createElement('summary');
  heading.textContent = 'Interaction acceptance · 30 or 60 seconds';
  const body = document.createElement('div');
  body.className = 'h-earth-startup-receipt__body';
  const explanation = document.createElement('p');
  explanation.className = 'h-earth-runtime-diagnostics__summary';
  explanation.textContent = 'Start only after the landscape is visible. Perform left, right, up, down, forward, backward, zoom in, and zoom out.';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.style.fontFamily = 'var(--h-earth-mono, monospace)';
  const instructions = document.createElement('ol');
  instructions.className = 'h-earth-startup-receipt__ledger';
  const rows = new Map();
  for (const [action, label] of TESTS) {
    const item = document.createElement('li');
    item.dataset.status = 'PENDING';
    const code = document.createElement('code');
    code.textContent = label;
    const output = document.createElement('output');
    output.textContent = 'PENDING';
    item.append(code, output);
    instructions.append(item);
    rows.set(action, { item, output });
  }
  const controls = document.createElement('div');
  controls.className = 'h-earth-startup-receipt__actions';
  controls.style.flexWrap = 'wrap';
  const technical = document.createElement('pre');
  technical.className = 'h-earth-startup-receipt__technical';
  technical.hidden = true;

  function resetResults() {
    countedSequences.clear();
    for (const value of results.values()) {
      value.attempts = 0;
      value.acceptedProposalCount = 0;
      value.maximumMagnitude = 0;
      value.firstObservedAt = null;
      value.lastObservedAt = null;
      value.classification = 'NOT_DETECTED';
      const row = rows.get(value.action);
      row.item.dataset.status = 'PENDING';
      row.output.textContent = 'PENDING';
    }
  }

  function classify(value) {
    if (value.acceptedProposalCount < 1) return 'NOT_DETECTED';
    return value.attempts > 2 ? 'WEAK_RESPONSE' : 'PASS';
  }

  function updateRows() {
    for (const value of results.values()) {
      const classification = classify(value);
      const row = rows.get(value.action);
      row.item.dataset.status = classification === 'PASS' ? 'PASS' : classification === 'NOT_DETECTED' ? 'PENDING' : 'FAIL';
      row.output.textContent = classification;
    }
  }

  function renderStatus() {
    const detected = [...results.values()].filter(value => value.acceptedProposalCount > 0).length;
    const remaining = state === 'RUNNING' ? Math.max(0, Math.ceil((deadline - performance.now()) / 1000)) : 0;
    status.textContent = state === 'RUNNING'
      ? `RUNNING · ${remaining}s remaining · ${detected}/8 detected`
      : `${state} · ${detected}/8 detected`;
  }

  function collect() {
    if (state !== 'RUNNING') return;
    const intake = routeApi.getIntakeReceipt();
    const proposals = intake.proposals.slice(proposalCursor);
    proposalCursor = intake.proposals.length;
    for (const proposal of proposals) {
      if (countedSequences.has(proposal.sequence)) continue;
      countedSequences.add(proposal.sequence);
      const value = results.get(proposal?.intent?.action);
      if (!value) continue;
      value.attempts += 1;
      value.firstObservedAt ??= iso();
      value.lastObservedAt = iso();
      const magnitude = Number(proposal.intent?.magnitude ?? proposal.intent?.degrees ?? 0);
      if (Number.isFinite(magnitude)) value.maximumMagnitude = Math.max(value.maximumMagnitude, magnitude);
      if (proposal.accepted === true) value.acceptedProposalCount += 1;
    }
    updateRows();
    renderStatus();
    if (performance.now() >= deadline) finalize('COMPLETE');
  }

  function buildReceipt(terminalState) {
    const intake = routeApi.getIntakeReceipt();
    const gpu = routeApi.getLiveGpuReceipt();
    const compactResults = {};
    let passCount = 0;
    let weakResponseCount = 0;
    let failureCount = 0;
    for (const [action] of TESTS) {
      const value = results.get(action);
      value.classification = classify(value);
      compactResults[action] = clone(value);
      if (value.classification === 'PASS') passCount += 1;
      else if (value.classification === 'WEAK_RESPONSE') weakResponseCount += 1;
      else failureCount += 1;
    }
    const context = gpu.resources?.context ?? {};
    return {
      version: 'H_EARTH_INTERACTION_ACCEPTANCE_RECEIPT_v1',
      sessionId: SESSION_ID,
      terminalState,
      device: {
        userAgent: navigator.userAgent,
        pixelRatio: window.devicePixelRatio || 1,
        viewport: gpu.viewport ?? null,
        webglVendor: context.unmaskedVendor ?? context.vendor ?? null,
        webglRenderer: context.unmaskedRenderer ?? context.renderer ?? null
      },
      session: {
        durationSeconds,
        startedAt,
        completedAt,
        rendererReadyAtStart: startFrameCount > 0,
        visibleFrameAtStart: startFrameCount > 0,
        framesPresentedDuringSession: Math.max(0, (gpu.counters?.gpuFramebufferPresentationCount ?? 0) - startFrameCount),
        proposalsDuringSession: Math.max(0, (intake.counters?.navigationProposalCount ?? 0) - startProposalCount)
      },
      results: compactResults,
      summary: {
        passCount,
        weakResponseCount,
        failureCount,
        gestureFunctionalAcceptance: failureCount === 0 ? 'PASS' : 'REQUIRES_REVIEW',
        gestureQualityAcceptance: weakResponseCount === 0 && failureCount === 0 ? 'PASS' : 'REQUIRES_REVIEW'
      }
    };
  }

  function finalize(terminalState = 'COMPLETE') {
    if (state !== 'RUNNING') return receipt;
    clearInterval(timer);
    timer = null;
    collect();
    completedAt = iso();
    state = terminalState;
    receipt = buildReceipt(terminalState);
    technical.hidden = false;
    technical.textContent = JSON.stringify(receipt, null, 2);
    window.H_EARTH_INTERACTION_ACCEPTANCE_RECEIPT = clone(receipt);
    window.dispatchEvent(new CustomEvent('h-earth-interaction-acceptance-complete', { detail: clone(receipt) }));
    updateRows();
    renderStatus();
    return clone(receipt);
  }

  function start(seconds) {
    const gpu = routeApi.getLiveGpuReceipt();
    const frames = gpu.counters?.gpuFramebufferPresentationCount ?? 0;
    if (frames < 1) throw new Error('INTERACTION_ACCEPTANCE_VISIBLE_FRAME_REQUIRED');
    if (timer) clearInterval(timer);
    resetResults();
    durationSeconds = seconds;
    state = 'RUNNING';
    startedAt = iso();
    completedAt = null;
    receipt = null;
    technical.hidden = true;
    const intake = routeApi.getIntakeReceipt();
    startProposalCount = intake.counters?.navigationProposalCount ?? intake.proposals.length;
    proposalCursor = intake.proposals.length;
    startFrameCount = frames;
    deadline = performance.now() + seconds * 1000;
    timer = setInterval(collect, 200);
    renderStatus();
  }

  function reset() {
    if (timer) clearInterval(timer);
    timer = null;
    state = 'IDLE';
    receipt = null;
    startedAt = null;
    completedAt = null;
    resetResults();
    technical.hidden = true;
    technical.textContent = '';
    renderStatus();
  }

  async function copyReceipt() {
    if (receipt) await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2));
  }

  function downloadReceipt() {
    if (!receipt) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `h-earth-interaction-acceptance-${durationSeconds}s.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  controls.append(
    button('Start 30 seconds', () => start(30)),
    button('Start 60 seconds', () => start(60)),
    button('End now', () => finalize('COMPLETE_WITH_CONCERNS')),
    button('Reset', reset),
    button('Copy receipt', copyReceipt),
    button('Download receipt', downloadReceipt)
  );
  body.append(explanation, status, instructions, controls, technical);
  panel.append(heading, body);
  host.append(panel);
  renderStatus();

  const api = Object.freeze({ start30: () => start(30), start60: () => start(60), endNow: () => finalize('COMPLETE_WITH_CONCERNS'), reset, getReceipt: () => receipt ? clone(receipt) : null, getState: () => state });
  window.H_EARTH_INTERACTION_ACCEPTANCE = api;
  return api;
}

function bootstrap() {
  const routeApi = window.H_EARTH_RUN8E_PUBLIC_ROUTE;
  const host = document.querySelector('.h-earth-3d-world-shell');
  if (routeApi && host) {
    installHEarthInteractionAcceptance({ routeApi, host });
    return;
  }
  window.addEventListener('h-earth-run8e-ready', () => {
    const readyApi = window.H_EARTH_RUN8E_PUBLIC_ROUTE;
    const readyHost = document.querySelector('.h-earth-3d-world-shell');
    if (readyApi && readyHost && !window.H_EARTH_INTERACTION_ACCEPTANCE) installHEarthInteractionAcceptance({ routeApi: readyApi, host: readyHost });
  }, { once: true });
}

bootstrap();
