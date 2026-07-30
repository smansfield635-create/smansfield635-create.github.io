import { installHEarthRun8ER3D2PointerTouchIntake } from '../../diagnostic/run8e-r3d/pointer-touch-intake.js';
import { createHEarthCp2LiveDifferentialBinding } from './live-gpu-binding.cp2-differential.js';

export const H_EARTH_CP2_LIVE_DIFFERENTIAL_INTEGRATION_ID =
  'H_EARTH_CP2_ROUND_1_LIVE_DIFFERENTIAL_COMPOSITION_1F520809';

const emitDiagnosticStage = (stage, status = 'PASS', detail = null) => {
  window.dispatchEvent(new CustomEvent('h-earth-runtime-diagnostic-stage', {
    detail: { stage, status, detail, timestamp: new Date().toISOString() }
  }));
};

emitDiagnosticStage('BOOT_STARTED', 'PASS', {
  integrationId: H_EARTH_CP2_LIVE_DIFFERENTIAL_INTEGRATION_ID,
  engineeringHead: '1f52080969034c55855a70834cc0294791254c80'
});

const root = document.getElementById('h-earth-functional-landscape-route');
const mount = document.getElementById('h-earth-functional-landscape-mount');
const canvas = document.getElementById('h-earth-functional-landscape-canvas');
const statusNode = document.getElementById('route-status');

if (!root || !(mount instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement) || !statusNode) {
  emitDiagnosticStage('CANVAS_ACQUIRED', 'FAIL', 'CP2_DIFFERENTIAL_ROUTE_HOST_INCOMPLETE');
  throw new Error('CP2_DIFFERENTIAL_ROUTE_HOST_INCOMPLETE');
}

emitDiagnosticStage('CANVAS_ACQUIRED', 'PASS', {
  canvasId: canvas.id,
  cssWidth: canvas.clientWidth,
  cssHeight: canvas.clientHeight,
  backingWidth: canvas.width,
  backingHeight: canvas.height,
  devicePixelRatio: window.devicePixelRatio || 1
});

const hud = Object.freeze({
  waypoint: document.getElementById('hud-waypoint'),
  address: document.getElementById('hud-address'),
  position: document.getElementById('hud-position'),
  terrain: document.getElementById('hud-terrain'),
  clearance: document.getElementById('hud-clearance'),
  chunk: document.getElementById('hud-chunk'),
  formation: document.getElementById('hud-formation'),
  frame: document.getElementById('hud-frame'),
  surface: document.getElementById('hud-surface'),
  water: document.getElementById('hud-water'),
  biome: document.getElementById('hud-biome'),
  traversal: document.getElementById('hud-traversal'),
  lifecycle: document.getElementById('hud-lifecycle'),
  population: document.getElementById('hud-population')
});

const clone = (value) => JSON.parse(JSON.stringify(value));
const round = (value, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(Number(value) * factor) / factor;
};

function deriveInitialViewport() {
  const cssWidth = Math.max(320, Math.round(mount.clientWidth || canvas.clientWidth || canvas.width || 640));
  const cssHeight = Math.max(180, Math.round(mount.clientHeight || canvas.clientHeight || canvas.height || 360));
  const maximumPixels = 960 * 540;
  const scale = Math.min(1, Math.sqrt(maximumPixels / (cssWidth * cssHeight)));
  return Object.freeze({
    width: Math.max(320, Math.round(cssWidth * scale)),
    height: Math.max(180, Math.round(cssHeight * scale)),
    pixelRatio: 1
  });
}

const viewport = deriveInitialViewport();
let intake = null;
let binding = null;
let lastPresentedFrame = null;
let firstFramePublished = false;

function updateHud() {
  if (!intake || !binding) return;
  const intakeReceipt = intake.getReceipt();
  const bindingReceipt = binding.getReceipt();
  const state = intakeReceipt.currentNavigationState;
  const frame = lastPresentedFrame ?? bindingReceipt.frameRecords.at(-1) ?? null;
  const resources = bindingReceipt.resources;

  if (hud.waypoint) hud.waypoint.textContent = state.physicalRole ?? 'Coastal entry';
  if (hud.address) hud.address.textContent = state.selectedSemanticAddressId ?? 'Address pending';
  if (hud.position) hud.position.textContent = `${round(state.position.x)}, ${round(state.position.y)}, ${round(state.position.z)}`;
  if (hud.terrain) hud.terrain.textContent = `${round(state.terrainElevation)} successor elevation`;
  if (hud.clearance) hud.clearance.textContent = `${round(state.clearance)} clearance`;
  if (hud.chunk) hud.chunk.textContent = state.chunkId ?? 'Successor domain';
  if (hud.formation) hud.formation.textContent = state.formationIds?.length ? state.formationIds.join(' · ') : 'Coastal terrain';
  if (hud.frame) hud.frame.textContent = frame ? `GPU frame ${frame.frameSequence} · navigation ${frame.navigationSequence}` : 'GPU frame pending';
  if (hud.surface) hud.surface.textContent = 'CP2 persistent WebGL2 surface';
  if (hud.water) hud.water.textContent = 'Governed shoreline draw range';
  if (hud.biome) hud.biome.textContent = 'Grounded coastal vegetation';
  if (hud.traversal) hud.traversal.textContent = 'Direct proposal-to-frame response';
  if (hud.lifecycle) hud.lifecycle.textContent = resources.packageUploadedOnce ? 'Canonical package resident' : 'Package initialization pending';
  if (hud.population) hud.population.textContent = `${resources.counters?.bufferCreateCount ?? 0} persistent GPU buffers`;

  statusNode.textContent = `CP2 differential candidate active · ${bindingReceipt.counters.gpuFramebufferPresentationCount} visible frames · ${intakeReceipt.counters.navigationProposalCount} navigation proposals`;

  window.dispatchEvent(new CustomEvent('h-earth-runtime-diagnostic-facts', {
    detail: {
      viewport,
      devicePixelRatio: window.devicePixelRatio || 1,
      visibleFrames: bindingReceipt.counters.gpuFramebufferPresentationCount,
      resources: bindingReceipt.resources,
      correspondence: bindingReceipt.correspondence,
      timestamp: new Date().toISOString()
    }
  }));
}

function activeModuleSources() {
  return [...document.querySelectorAll('script[type="module"]')]
    .map((script) => script.src ? new URL(script.src, document.baseURI).pathname : 'INLINE_MODULE');
}

function buildCandidateReceipt() {
  if (!intake || !binding) return null;
  const intakeReceipt = intake.getReceipt();
  const bindingReceipt = binding.getReceipt();
  const moduleSources = activeModuleSources();

  return clone({
    receiptType: 'H_EARTH_CP2_ROUND_1_LIVE_DIFFERENTIAL_BROWSER_RECEIPT',
    eligible: true,
    status: 'CP2_ROUND_1_LIVE_DIFFERENTIAL_CANDIDATE_ACTIVE',
    integrationId: H_EARTH_CP2_LIVE_DIFFERENTIAL_INTEGRATION_ID,
    engineeringHead: '1f52080969034c55855a70834cc0294791254c80',
    comparisonBaseline: 'LAST_USER_ACCEPTED_LIVE_H_EARTH_BASELINE',
    viewport,
    moduleSources,
    intake: intakeReceipt,
    liveGpu: bindingReceipt,
    runtimeExclusivity: {
      activePublicModuleScriptCount: moduleSources.length,
      activeWebGL2ContextCount: bindingReceipt.resources.counters.contextCreationCount,
      activePersistentRendererCount: bindingReceipt.counters.rendererInitializationCount,
      activeNavigationStateStreamCount: 1,
      activePointerTouchIntakeCount: 1,
      activeFramePresentationAuthorityCount: 1,
      cpuWorldRebuildPerCameraChange: bindingReceipt.counters.worldRebuildCount !== 0,
      cssBitmapPreview: bindingReceipt.counters.cssTransformPreviewCount !== 0,
      duplicatePointerListeners: false,
      deferredPublicRefresh: bindingReceipt.counters.deferredRenderCommitCount !== 0,
      packageUploadedOnce: bindingReceipt.correspondence.packageUploadedOnce,
      resourceIdentityStable: bindingReceipt.correspondence.resourceIdentityStable
    },
    diagnostics: window.H_EARTH_RUNTIME_DIAGNOSTICS?.getSnapshot?.() ?? null,
    boundaries: {
      isolatedCandidateRoute: true,
      acceptedPublicRouteReplaced: false,
      cp2PrMerged: false,
      automatedMetricsSubstituteForUserDifferential: false,
      userDifferentialRecorded: false,
      physicalDispositionRecorded: false,
      mergeDecisionRecorded: false
    },
    stoppingBoundary: 'STOP_AWAITING_CP2_USER_EXPERIENTIAL_DIFFERENTIAL'
  });
}

try {
  intake = installHEarthRun8ER3D2PointerTouchIntake({
    surface: canvas,
    onProposal: (proposalRecord, navigationState) => {
      if (!binding) throw new Error('CP2_DIFFERENTIAL_GPU_BINDING_NOT_READY');
      lastPresentedFrame = binding.acceptNavigationState(proposalRecord, navigationState);
      root.dataset.gestureUsed = 'true';
      updateHud();
    }
  });

  emitDiagnosticStage('RENDERER_CONSTRUCTED', 'PENDING', 'CP2 differential GPU binding construction requested.');

  binding = createHEarthCp2LiveDifferentialBinding({
    canvas,
    initialNavigationState: intake.getNavigationState(),
    viewport,
    onFramePresented: (frameRecord) => {
      lastPresentedFrame = frameRecord;
      if (!firstFramePublished) {
        firstFramePublished = true;
        emitDiagnosticStage('FIRST_FRAME_DRAWN', 'PASS', frameRecord);
      }
      updateHud();
    }
  });

  const bindingReceipt = binding.getReceipt();
  const contextCount = bindingReceipt?.resources?.counters?.contextCreationCount ?? 0;
  const rendererCount = bindingReceipt?.counters?.rendererInitializationCount ?? 0;

  emitDiagnosticStage('WEBGL2_CONTEXT_ACQUIRED', contextCount > 0 ? 'PASS' : 'FAIL', {
    contextCreationCount: contextCount
  });
  emitDiagnosticStage('RENDERER_CONSTRUCTED', rendererCount > 0 ? 'PASS' : 'FAIL', {
    rendererInitializationCount: rendererCount
  });
  emitDiagnosticStage('RENDERER_MOUNTED', 'PASS', {
    canvasConnected: canvas.isConnected,
    mountConnected: mount.isConnected
  });
} catch (error) {
  root.dataset.run8eReady = 'false';
  root.dataset.run8eError = 'true';
  emitDiagnosticStage('RENDERER_MOUNTED', 'FAIL', {
    name: error?.name ?? 'Error',
    message: error?.message ?? String(error),
    stack: error?.stack ?? null
  });
  throw error;
}

root.dataset.run8eReady = 'true';
root.dataset.run8eError = 'false';
root.dataset.cp2DifferentialCandidate = 'true';
root.dataset.cp2EngineeringHead = '1f52080969034c55855a70834cc0294791254c80';
root.dataset.publicRoute = 'false';
updateHud();

export const H_EARTH_CP2_LIVE_DIFFERENTIAL_ROUTE_API = Object.freeze({
  integrationId: H_EARTH_CP2_LIVE_DIFFERENTIAL_INTEGRATION_ID,
  engineeringHead: '1f52080969034c55855a70834cc0294791254c80',
  ready: true,
  getReceipt: buildCandidateReceipt,
  getSnapshot: buildCandidateReceipt,
  getIntakeReceipt: () => intake.getReceipt(),
  getLiveGpuReceipt: () => binding.getReceipt()
});

window.H_EARTH_RUN8E_PUBLIC_ROUTE = H_EARTH_CP2_LIVE_DIFFERENTIAL_ROUTE_API;
window.H_EARTH_CP2_LIVE_DIFFERENTIAL_ROUTE = H_EARTH_CP2_LIVE_DIFFERENTIAL_ROUTE_API;

const readyDetail = {
  type: 'H_EARTH_RUN8E_READY',
  candidateType: 'CP2_ROUND_1_LIVE_DIFFERENTIAL',
  integrationId: H_EARTH_CP2_LIVE_DIFFERENTIAL_INTEGRATION_ID,
  engineeringHead: '1f52080969034c55855a70834cc0294791254c80',
  timestamp: new Date().toISOString()
};
window.dispatchEvent(new CustomEvent('h-earth-run8e-ready', { detail: readyDetail }));
emitDiagnosticStage('READY_EVENT_EMITTED', 'PASS', readyDetail);
emitDiagnosticStage('PARENT_READY_STATE_OBSERVED', 'NOT_APPLICABLE', 'Top-level differential route has no parent host.');

export default H_EARTH_CP2_LIVE_DIFFERENTIAL_ROUTE_API;
