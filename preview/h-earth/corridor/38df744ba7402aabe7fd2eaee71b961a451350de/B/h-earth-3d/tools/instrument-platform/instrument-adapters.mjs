import { clone, deepFreeze, nowIso } from './platform-core.mjs';
import { getTool } from './tool-registry.mjs';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitUntil(predicate, { timeout = 180000, interval = 100, label = 'CONDITION' } = {}) {
  const started = performance.now();
  while (performance.now() - started < timeout) {
    try {
      const value = predicate();
      if (value) return value;
    } catch {}
    await sleep(interval);
  }
  throw new Error(`INSTRUMENT_WAIT_TIMEOUT:${label}`);
}
function frameRealm(frame) {
  const windowObject = frame.contentWindow;
  const documentObject = frame.contentDocument;
  if (!windowObject || !documentObject) throw new Error('INSTRUMENT_FRAME_REALM_UNAVAILABLE');
  return { windowObject, documentObject };
}
function resolvedToolUrl(tool) {
  const url = new URL(tool.route, location.href);
  if (tool.toolId === 'H_EARTH_GAUGES') {
    const sourceHead = new URLSearchParams(location.search).get('head');
    if (sourceHead) url.searchParams.set('head', sourceHead);
    url.searchParams.set('platform', 'H_EARTH_INSTRUMENT_PLATFORM_v1');
  }
  return url;
}
async function ensureLoaded(frame, tool) {
  const target = resolvedToolUrl(tool);
  let current = null;
  try {
    const currentUrl = new URL(frame.contentWindow?.location?.href ?? 'about:blank');
    current = `${currentUrl.pathname}${currentUrl.search}`;
  } catch {}
  const targetIdentity = `${target.pathname}${target.search}`;
  if (current !== targetIdentity) {
    frame.src = target.href;
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`INSTRUMENT_LOAD_TIMEOUT:${tool.toolId}`)), 180000);
      frame.addEventListener('load', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
    });
  }
  return frameRealm(frame);
}
async function probeGauges(frame) {
  const { windowObject, documentObject } = frameRealm(frame);
  const api = await waitUntil(
    () => windowObject.H_EARTH_CURRENT_AUTHORITY_GAUGE,
    { label: 'CURRENT_AUTHORITY_GAUGE_API' }
  );
  const receipt = await waitUntil(() => {
    const value = api.getReceipt?.() ?? null;
    if (value) return value;
    if (documentObject.documentElement.dataset.currentAuthorityGaugeReceipt === 'UNRESOLVED') {
      throw new Error('CURRENT_AUTHORITY_GAUGE_UNRESOLVED');
    }
    return null;
  }, { timeout: 600000, label: 'CURRENT_AUTHORITY_GAUGE_RECEIPT' });
  const read = (id) => documentObject.getElementById(id)?.textContent ?? null;
  return {
    ready: true,
    contract: api.contractId,
    receipt: api.receiptId,
    version: api.version,
    executedSourceHead: receipt?.executedSourceHead ?? null,
    readiness: Number(receipt?.readiness?.readinessPercent ?? 0),
    mergeEligible: receipt?.readiness?.mergeEligible === true,
    counts: {
      required: Number(receipt?.readiness?.requiredApplicableChecks ?? read('requiredCount') ?? 0),
      pass: Number(receipt?.readiness?.requiredApplicablePasses ?? read('passCount') ?? 0),
      held: Number(receipt?.readiness?.counts?.HELD_BY_CURRENT_AUTHORITY ?? read('heldCount') ?? 0),
      superseded: Number(documentObject.documentElement.dataset.gaugesSuperseded ?? 0),
      fail: Number(receipt?.readiness?.requiredApplicableFailures ?? read('failCount') ?? 0),
      unresolved: Number(receipt?.readiness?.requiredApplicableUnresolved ?? read('unresolvedCount') ?? 0)
    },
    receiptDigest: receipt?.receiptDigest ?? null,
    legacyDispositions: clone(api.legacyDispositions),
    derivedAuthorityRecords: clone(receipt?.derivedAuthorityRecords ?? []),
    currentAuthorityResults: clone(receipt?.results ?? []),
    receiptObject: clone(receipt),
    receiptText: read('receipt')
  };
}
async function probeFd05(frame) {
  const { windowObject } = frameRealm(frame);
  const api = await waitUntil(() => windowObject.H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API, { label: 'FD05_RUNTIME_API' });
  return { ready: true, contractId: api.contractId, sourceFile: api.sourceFile, manifestId: api.manifestId, manifestDigest: api.manifestDigest, state: clone(api.getState()), finalReceipt: clone(api.inspect.getFinalReceipt?.() ?? null), terminalReceipt: clone(api.cycle.inspect.getTerminalReceipt?.() ?? null) };
}
async function probeProfiler(frame) {
  const { windowObject, documentObject } = frameRealm(frame);
  await waitUntil(() => documentObject.getElementById('run-probes'), { label: 'PROFILER_CONTROLS' });
  return { ready: true, profileState: documentObject.getElementById('profile-state')?.textContent ?? null, architectureReceipt: clone(windowObject.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT ?? null), physicalReceipt: clone(windowObject.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT ?? null), controls: { runProbesDisabled: documentObject.getElementById('run-probes')?.disabled ?? null, startPhysicalDisabled: documentObject.getElementById('start-physical')?.disabled ?? null, stopPhysicalDisabled: documentObject.getElementById('stop-physical')?.disabled ?? null } };
}
async function probeTerrain(frame) {
  const { windowObject, documentObject } = frameRealm(frame);
  const api = await waitUntil(() => documentObject.documentElement.dataset.terrainWorkbenchReady === 'true' && windowObject.H_EARTH_TERRAIN_WORKBENCH, { timeout: 600000, label: 'TERRAIN_WORKBENCH_API' });
  return { ready: true, fixedGates: clone(api.fixedGates), renderedSceneCount: api.sceneLab.getRenderedSceneCount(), sceneIds: clone(api.sceneLab.sceneIds), correspondenceValidation: clone(api.correspondence.getValidation()) };
}
const probes = { H_EARTH_GAUGES: probeGauges, FD_05_DIAGNOSTIC_AUTHORITY: probeFd05, RUN_8E_R1_PROFILER: probeProfiler, TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH: probeTerrain };
const executeGauges = (frame) => probeGauges(frame);
async function executeFd05(frame, action) {
  const { windowObject } = frameRealm(frame);
  const api = await waitUntil(() => windowObject.H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API, { label: 'FD05_RUNTIME_API' });
  if (action === 'RUN_GOVERNED_CAPTURE') return clone(await api.runCapture());
  if (action === 'RUN_EXACT_NINE_CYCLE') return clone(await api.runCycle());
  throw new Error(`FD05_ACTION_UNSUPPORTED:${action}`);
}
async function executeProfiler(frame, action) {
  const { windowObject, documentObject } = frameRealm(frame);
  if (action === 'RUN_ARCHITECTURE_PROBES') {
    documentObject.getElementById('run-probes')?.click();
    return clone(await waitUntil(() => windowObject.H_EARTH_RUN8E_R1_ARCHITECTURE_RECEIPT, { timeout: 600000, label: 'PROFILER_ARCHITECTURE_RECEIPT' }));
  }
  if (action === 'START_PHYSICAL_SESSION') {
    documentObject.getElementById('start-physical')?.click();
    return { started: true, state: documentObject.getElementById('profile-state')?.textContent ?? null };
  }
  if (action === 'STOP_PHYSICAL_SESSION') {
    documentObject.getElementById('stop-physical')?.click();
    return clone(await waitUntil(() => windowObject.H_EARTH_RUN8E_R1_PHYSICAL_RECEIPT, { timeout: 180000, label: 'PROFILER_PHYSICAL_RECEIPT' }));
  }
  throw new Error(`PROFILER_ACTION_UNSUPPORTED:${action}`);
}
async function executeTerrain(frame, action) {
  const { windowObject } = frameRealm(frame);
  const api = await waitUntil(() => windowObject.H_EARTH_TERRAIN_WORKBENCH, { timeout: 600000, label: 'TERRAIN_WORKBENCH_API' });
  if (action === 'RUN_DETERMINISTIC_VERIFICATION_FIXTURE') return clone(api.completeVerificationFixture());
  if (action === 'RECORD_USER_PERCEPTUAL_CORRESPONDENCE') return clone(api.buildPacket());
  throw new Error(`TERRAIN_ACTION_UNSUPPORTED:${action}`);
}
const executors = { H_EARTH_GAUGES: executeGauges, FD_05_DIAGNOSTIC_AUTHORITY: executeFd05, RUN_8E_R1_PROFILER: executeProfiler, TERRAIN_INTELLIGENCE_AND_PERCEPTUAL_WORKBENCH: executeTerrain };
export function createInstrumentHost(frame, options = {}) {
  if (!(frame instanceof HTMLIFrameElement)) throw new Error('INSTRUMENT_HOST_IFRAME_REQUIRED');
  let activeTool = null;
  async function activate(toolId) {
    const tool = getTool(toolId);
    if (!tool) throw new Error(`INSTRUMENT_UNKNOWN:${toolId}`);
    await ensureLoaded(frame, tool);
    activeTool = tool;
    return probe();
  }
  async function probe() {
    if (!activeTool) throw new Error('INSTRUMENT_NOT_ACTIVE');
    const payload = await probes[activeTool.toolId](frame);
    return deepFreeze({ toolId: activeTool.toolId, route: activeTool.route, observedAt: nowIso(options.clock), payload });
  }
  async function execute(action = null) {
    if (!activeTool) throw new Error('INSTRUMENT_NOT_ACTIVE');
    const selectedAction = action ?? activeTool.actions[0];
    if (!activeTool.actions.includes(selectedAction)) throw new Error(`INSTRUMENT_ACTION_NOT_REGISTERED:${activeTool.toolId}:${selectedAction}`);
    const result = await executors[activeTool.toolId](frame, selectedAction);
    return deepFreeze({ toolId: activeTool.toolId, action: selectedAction, executedAt: nowIso(options.clock), result });
  }
  return Object.freeze({ activate, probe, execute, getActiveTool: () => activeTool });
}
export default createInstrumentHost;
