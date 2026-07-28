const SESSION_ID = 'H_EARTH_GUIDED_INTERACTION_ACCEPTANCE_SESSION_v2';
const STORAGE_KEY = 'h-earth-guided-interaction-acceptance-v2';
const TESTS = Object.freeze([
  Object.freeze({ action: 'TURN_LEFT', label: 'Look left', instruction: 'Drag one finger toward the left.' }),
  Object.freeze({ action: 'TURN_RIGHT', label: 'Look right', instruction: 'Drag one finger toward the right.' }),
  Object.freeze({ action: 'PITCH_UP', label: 'Look up', instruction: 'Drag one finger upward.' }),
  Object.freeze({ action: 'PITCH_DOWN', label: 'Look down', instruction: 'Drag one finger downward.' }),
  Object.freeze({ action: 'MOVE_FORWARD', label: 'Move forward', instruction: 'Place two fingers on the landscape and slide upward.' }),
  Object.freeze({ action: 'MOVE_BACKWARD', label: 'Move backward', instruction: 'Place two fingers on the landscape and slide downward.' }),
  Object.freeze({ action: 'ZOOM_IN', label: 'Zoom in', instruction: 'Spread two fingers apart.' }),
  Object.freeze({ action: 'ZOOM_OUT', label: 'Zoom out', instruction: 'Bring two fingers together.' })
]);
const clone = (value) => JSON.parse(JSON.stringify(value));
const iso = () => new Date().toISOString();
const makeButton = (label, fn) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.addEventListener('click', fn); return button; };

export function installHEarthInteractionAcceptance({ routeApi, host } = {}) {
  if (!routeApi?.getIntakeReceipt || !routeApi?.getLiveGpuReceipt) throw new Error('INTERACTION_ACCEPTANCE_ROUTE_API_REQUIRED');
  if (!(host instanceof HTMLElement)) throw new Error('INTERACTION_ACCEPTANCE_HOST_REQUIRED');

  let state = 'IDLE';
  let activeIndex = 0;
  let startedAt = null;
  let completedAt = null;
  let startFrameCount = 0;
  let startProposalCount = 0;
  let proposalCursor = 0;
  let timer = null;
  let receipt = null;
  let advanceTimer = null;
  const counted = new Set();
  const results = new Map(TESTS.map((test, index) => [test.action, {
    action: test.action,
    stepNumber: index + 1,
    instructionPresented: false,
    attemptCount: 0,
    acceptedProposalCount: 0,
    responseConfirmedCount: 0,
    maximumMagnitude: 0,
    firstObservedAt: null,
    completedAt: null,
    skipReason: null,
    classification: 'NOT_COMPLETED'
  }]));

  const panel = document.createElement('section');
  panel.className = 'h-earth-startup-receipt';
  panel.setAttribute('aria-label', 'Guided interaction acceptance');
  const heading = document.createElement('h2');
  heading.textContent = 'Guided interaction acceptance';
  const body = document.createElement('div');
  body.className = 'h-earth-startup-receipt__body';
  const intro = document.createElement('p');
  intro.className = 'h-earth-runtime-diagnostics__summary';
  intro.textContent = 'Complete each interaction in order. There is no time limit.';
  const progress = document.createElement('p');
  progress.setAttribute('role', 'status');
  progress.style.fontFamily = 'var(--h-earth-mono, monospace)';
  const instruction = document.createElement('div');
  instruction.style.cssText = 'padding:1rem;border:1px solid currentColor;border-radius:.5rem;margin:.75rem 0;';
  const instructionTitle = document.createElement('strong');
  instructionTitle.style.cssText = 'display:block;font-size:1.15rem;margin-bottom:.4rem;';
  const instructionText = document.createElement('p');
  instructionText.style.margin = '0';
  const detection = document.createElement('p');
  detection.style.cssText = 'font-family:var(--h-earth-mono, monospace);font-weight:700;margin:.75rem 0 0;';
  instruction.append(instructionTitle, instructionText, detection);

  const ledger = document.createElement('ol');
  ledger.className = 'h-earth-startup-receipt__ledger';
  const rows = new Map();
  for (const test of TESTS) {
    const item = document.createElement('li');
    item.dataset.status = 'PENDING';
    const label = document.createElement('code');
    label.textContent = test.label;
    const output = document.createElement('output');
    output.textContent = 'NOT COMPLETED';
    item.append(label, output);
    ledger.append(item);
    rows.set(test.action, { item, output });
  }

  const skipReason = document.createElement('select');
  for (const [value, label] of [
    ['', 'Skip reason…'],
    ['NOT_RESPONDING', 'Not responding'],
    ['INSTRUCTION_UNCLEAR', 'Instruction unclear'],
    ['GESTURE_NOT_POSSIBLE', 'Gesture not possible'],
    ['USER_SKIPPED', 'User skipped'],
    ['OTHER', 'Other']
  ]) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    skipReason.append(option);
  }

  const controls = document.createElement('div');
  controls.className = 'h-earth-startup-receipt__actions';
  controls.style.flexWrap = 'wrap';
  const startButton = makeButton('Start guided test', start);
  const resumeButton = makeButton('Resume test', resume);
  const retryButton = makeButton('Retry current step', retryCurrent);
  const skipButton = makeButton('Skip current step', skipCurrent);
  const cancelButton = makeButton('Cancel test', cancel);
  const resetButton = makeButton('Reset', reset);
  const copyButton = makeButton('Copy receipt', copyReceipt);
  const downloadButton = makeButton('Download receipt', downloadReceipt);
  controls.append(startButton, resumeButton, retryButton, skipReason, skipButton, cancelButton, resetButton, copyButton, downloadButton);

  const technical = document.createElement('pre');
  technical.className = 'h-earth-startup-receipt__technical';
  technical.hidden = true;

  function activeTest() { return TESTS[activeIndex] ?? null; }
  function activeResult() { const test = activeTest(); return test ? results.get(test.action) : null; }
  function persist() {
    if (!['WAITING_FOR_STEP', 'STEP_DETECTED', 'ADVANCING'].includes(state)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ state: 'WAITING_FOR_STEP', activeIndex, startedAt, startFrameCount, startProposalCount, proposalCursor, results: [...results.entries()] }));
  }
  function clearPersisted() { sessionStorage.removeItem(STORAGE_KEY); }
  function restorePersisted() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !Array.isArray(saved.results)) return false;
      activeIndex = Math.max(0, Math.min(TESTS.length - 1, Number(saved.activeIndex) || 0));
      startedAt = saved.startedAt || iso();
      startFrameCount = Number(saved.startFrameCount) || 0;
      startProposalCount = Number(saved.startProposalCount) || 0;
      const intake = routeApi.getIntakeReceipt();
      proposalCursor = intake.proposals.length;
      for (const [action, value] of saved.results) if (results.has(action)) Object.assign(results.get(action), value);
      state = 'WAITING_FOR_STEP';
      return true;
    } catch { return false; }
  }
  function resetResults() {
    counted.clear();
    for (const [action, value] of results) {
      Object.assign(value, {
        action,
        stepNumber: TESTS.findIndex((test) => test.action === action) + 1,
        instructionPresented: false,
        attemptCount: 0,
        acceptedProposalCount: 0,
        responseConfirmedCount: 0,
        maximumMagnitude: 0,
        firstObservedAt: null,
        completedAt: null,
        skipReason: null,
        classification: 'NOT_COMPLETED'
      });
    }
  }
  function updateRows() {
    for (const [action, value] of results) {
      const row = rows.get(action);
      row.item.dataset.status = value.classification === 'PASS' ? 'PASS' : value.classification === 'SKIPPED' ? 'FAIL' : 'PENDING';
      row.output.textContent = value.classification.replaceAll('_', ' ');
    }
  }
  function render() {
    const test = activeTest();
    const resolved = [...results.values()].filter((value) => ['PASS', 'SKIPPED'].includes(value.classification)).length;
    progress.textContent = state === 'IDLE' ? 'IDLE · 0/8 resolved' : `${state.replaceAll('_', ' ')} · ${resolved}/8 resolved`;
    if (state === 'WAITING_FOR_STEP' && test) {
      const value = activeResult();
      value.instructionPresented = true;
      instructionTitle.textContent = `Step ${activeIndex + 1} of ${TESTS.length} · ${test.label}`;
      instructionText.textContent = test.instruction;
      detection.textContent = 'STATUS: WAITING FOR THIS GESTURE';
    } else if (state === 'STEP_DETECTED' && test) {
      instructionTitle.textContent = `Step ${activeIndex + 1} of ${TESTS.length} · ${test.label}`;
      instructionText.textContent = test.instruction;
      detection.textContent = 'STATUS: INPUT DETECTED AND CAMERA RESPONSE CONFIRMED';
    } else if (state === 'COMPLETE') {
      instructionTitle.textContent = 'Test complete';
      instructionText.textContent = 'All eight steps have been resolved.';
      detection.textContent = 'STATUS: RECEIPT READY';
    } else if (state === 'CANCELLED') {
      instructionTitle.textContent = 'Test cancelled';
      instructionText.textContent = 'The unfinished steps are recorded as not completed.';
      detection.textContent = 'STATUS: RECEIPT READY';
    } else {
      instructionTitle.textContent = 'Ready';
      instructionText.textContent = 'Start the guided test after the landscape is visible.';
      detection.textContent = 'STATUS: IDLE';
    }
    const hasSaved = Boolean(sessionStorage.getItem(STORAGE_KEY));
    startButton.hidden = state !== 'IDLE';
    resumeButton.hidden = state !== 'IDLE' || !hasSaved;
    retryButton.hidden = state !== 'WAITING_FOR_STEP';
    skipReason.hidden = state !== 'WAITING_FOR_STEP';
    skipButton.hidden = state !== 'WAITING_FOR_STEP';
    cancelButton.hidden = !['WAITING_FOR_STEP', 'STEP_DETECTED', 'ADVANCING'].includes(state);
    copyButton.disabled = !receipt;
    downloadButton.disabled = !receipt;
    updateRows();
  }
  function collect() {
    if (state !== 'WAITING_FOR_STEP') return;
    const intake = routeApi.getIntakeReceipt();
    const proposals = intake.proposals.slice(proposalCursor);
    proposalCursor = intake.proposals.length;
    const test = activeTest();
    const value = activeResult();
    for (const proposal of proposals) {
      if (counted.has(proposal.sequence)) continue;
      counted.add(proposal.sequence);
      if (proposal?.intent?.action !== test.action) continue;
      value.attemptCount += 1;
      value.firstObservedAt ??= iso();
      const magnitude = Number(proposal.intent?.magnitude ?? proposal.intent?.degrees ?? 0);
      if (Number.isFinite(magnitude)) value.maximumMagnitude = Math.max(value.maximumMagnitude, magnitude);
      if (proposal.accepted === true) value.acceptedProposalCount += 1;
      const responseConfirmed = proposal.accepted === true && proposal.afterStateId !== proposal.beforeStateId;
      if (!responseConfirmed) continue;
      value.responseConfirmedCount += 1;
      value.classification = 'PASS';
      value.completedAt = iso();
      state = 'STEP_DETECTED';
      persist();
      render();
      advanceTimer = setTimeout(advance, 650);
      return;
    }
    persist();
    render();
  }
  function advance() {
    if (advanceTimer) clearTimeout(advanceTimer);
    advanceTimer = null;
    if (!['STEP_DETECTED', 'WAITING_FOR_STEP'].includes(state)) return;
    if (activeIndex >= TESTS.length - 1) { finalize('COMPLETE'); return; }
    activeIndex += 1;
    state = 'WAITING_FOR_STEP';
    const intake = routeApi.getIntakeReceipt();
    proposalCursor = intake.proposals.length;
    persist();
    render();
  }
  function beginPolling() {
    if (timer) clearInterval(timer);
    timer = setInterval(collect, 150);
  }
  function start() {
    const gpu = routeApi.getLiveGpuReceipt();
    const frames = gpu.counters?.gpuFramebufferPresentationCount ?? 0;
    if (frames < 1) throw new Error('INTERACTION_ACCEPTANCE_VISIBLE_FRAME_REQUIRED');
    resetResults();
    clearPersisted();
    activeIndex = 0;
    startedAt = iso();
    completedAt = null;
    receipt = null;
    technical.hidden = true;
    const intake = routeApi.getIntakeReceipt();
    startProposalCount = intake.counters?.navigationProposalCount ?? intake.proposals.length;
    proposalCursor = intake.proposals.length;
    startFrameCount = frames;
    state = 'WAITING_FOR_STEP';
    beginPolling();
    persist();
    render();
  }
  function resume() {
    if (!restorePersisted()) return;
    receipt = null;
    technical.hidden = true;
    beginPolling();
    persist();
    render();
  }
  function retryCurrent() {
    if (state !== 'WAITING_FOR_STEP') return;
    const value = activeResult();
    value.attemptCount = 0;
    value.acceptedProposalCount = 0;
    value.responseConfirmedCount = 0;
    value.maximumMagnitude = 0;
    value.firstObservedAt = null;
    const intake = routeApi.getIntakeReceipt();
    proposalCursor = intake.proposals.length;
    persist();
    render();
  }
  function skipCurrent() {
    if (state !== 'WAITING_FOR_STEP' || !skipReason.value) return;
    const value = activeResult();
    value.classification = 'SKIPPED';
    value.skipReason = skipReason.value;
    value.completedAt = iso();
    skipReason.value = '';
    persist();
    advance();
  }
  function buildReceipt(terminalState) {
    const intake = routeApi.getIntakeReceipt();
    const gpu = routeApi.getLiveGpuReceipt();
    const context = gpu.resources?.context ?? {};
    const compact = {};
    let passCount = 0;
    let skippedCount = 0;
    let notCompletedCount = 0;
    for (const test of TESTS) {
      const value = results.get(test.action);
      compact[test.action] = clone(value);
      if (value.classification === 'PASS') passCount += 1;
      else if (value.classification === 'SKIPPED') skippedCount += 1;
      else notCompletedCount += 1;
    }
    const elapsedSeconds = startedAt && completedAt ? Math.max(0, (Date.parse(completedAt) - Date.parse(startedAt)) / 1000) : null;
    return {
      version: 'H_EARTH_GUIDED_INTERACTION_ACCEPTANCE_RECEIPT_v2',
      sessionId: SESSION_ID,
      sessionMode: 'COMPLETION_DRIVEN',
      terminalState,
      device: {
        userAgent: navigator.userAgent,
        pixelRatio: window.devicePixelRatio || 1,
        viewport: gpu.viewport ?? null,
        webglVendor: context.unmaskedVendor ?? context.vendor ?? null,
        webglRenderer: context.unmaskedRenderer ?? context.renderer ?? null
      },
      session: {
        startedAt,
        completedAt,
        elapsedSeconds,
        rendererReadyAtStart: startFrameCount > 0,
        visibleFrameAtStart: startFrameCount > 0,
        framesPresentedDuringSession: Math.max(0, (gpu.counters?.gpuFramebufferPresentationCount ?? 0) - startFrameCount),
        proposalsDuringSession: Math.max(0, (intake.counters?.navigationProposalCount ?? 0) - startProposalCount),
        stepsResolved: passCount + skippedCount,
        requiredStepCount: TESTS.length
      },
      results: compact,
      summary: {
        passCount,
        skippedCount,
        notCompletedCount,
        gestureFunctionalAcceptance: skippedCount === 0 && notCompletedCount === 0 ? 'PASS' : 'REQUIRES_REVIEW',
        gestureQualityAcceptance: skippedCount === 0 && notCompletedCount === 0 ? 'PASS' : 'REQUIRES_REVIEW'
      }
    };
  }
  function finalize(terminalState) {
    if (timer) clearInterval(timer);
    timer = null;
    if (advanceTimer) clearTimeout(advanceTimer);
    advanceTimer = null;
    completedAt = iso();
    state = terminalState;
    receipt = buildReceipt(terminalState);
    technical.hidden = false;
    technical.textContent = JSON.stringify(receipt, null, 2);
    clearPersisted();
    window.H_EARTH_INTERACTION_ACCEPTANCE_RECEIPT = clone(receipt);
    window.dispatchEvent(new CustomEvent('h-earth-interaction-acceptance-complete', { detail: clone(receipt) }));
    render();
    return clone(receipt);
  }
  function cancel() {
    if (!['WAITING_FOR_STEP', 'STEP_DETECTED', 'ADVANCING'].includes(state)) return;
    finalize('CANCELLED');
  }
  function reset() {
    if (timer) clearInterval(timer);
    timer = null;
    if (advanceTimer) clearTimeout(advanceTimer);
    advanceTimer = null;
    clearPersisted();
    resetResults();
    activeIndex = 0;
    state = 'IDLE';
    startedAt = null;
    completedAt = null;
    receipt = null;
    technical.hidden = true;
    technical.textContent = '';
    render();
  }
  async function copyReceipt() { if (receipt) await navigator.clipboard.writeText(JSON.stringify(receipt, null, 2)); }
  function downloadReceipt() {
    if (!receipt) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'h-earth-guided-interaction-acceptance-v2.json';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  body.append(intro, progress, instruction, ledger, controls, technical);
  panel.append(heading, body);
  host.append(panel);
  render();

  const api = Object.freeze({ start, resume, retryCurrent, skipCurrent, cancel, reset, getReceipt: () => receipt ? clone(receipt) : null, getState: () => state });
  window.H_EARTH_INTERACTION_ACCEPTANCE = api;
  return api;
}

function bootstrap() {
  const routeApi = window.H_EARTH_RUN8E_PUBLIC_ROUTE;
  const host = document.querySelector('.h-earth-3d-world-shell');
  if (routeApi && host) { installHEarthInteractionAcceptance({ routeApi, host }); return; }
  window.addEventListener('h-earth-run8e-ready', () => {
    const api = window.H_EARTH_RUN8E_PUBLIC_ROUTE;
    const target = document.querySelector('.h-earth-3d-world-shell');
    if (api && target && !window.H_EARTH_INTERACTION_ACCEPTANCE) installHEarthInteractionAcceptance({ routeApi: api, host: target });
  }, { once: true });
}
bootstrap();
