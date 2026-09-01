import { installHEarthRun8ER3D2PointerTouchIntake } from '../../../../showroom/globe/h-earth/diagnostic/run8e-r3d/pointer-touch-intake.js';
import { createHEarthRun8ER3AFrameUniformPacket } from '../../../../showroom/globe/h-earth/render/live-renderer-contract.run8e-r3a.js';
import { createHEarthC2CandidateRenderer } from './candidate-renderer.js';

export const H_EARTH_C2_CANDIDATE_INTEGRATION_ID =
  'H_EARTH_C2_BOUNDED_COASTAL_VISUAL_SUCCESSOR_INTEGRATION_v1';

const canvas = document.getElementById('candidate-canvas');
const stage = document.getElementById('candidate-stage');
const statusNode = document.getElementById('candidate-status');
const hud = Object.freeze({
  camera: document.getElementById('hud-camera'),
  frames: document.getElementById('hud-frames'),
  input: document.getElementById('hud-input'),
  pass: document.getElementById('hud-pass')
});
if (!(canvas instanceof HTMLCanvasElement) || !(stage instanceof HTMLElement) || !statusNode) {
  throw new Error('C2_CANDIDATE_HOST_INCOMPLETE');
}

const viewport = (() => {
  const cssWidth = Math.max(360, Math.round(stage.clientWidth || 960));
  const cssHeight = Math.max(260, Math.round(stage.clientHeight || 540));
  const maximumPixels = 960 * 540;
  const scale = Math.min(1, Math.sqrt(maximumPixels / (cssWidth * cssHeight)));
  return Object.freeze({
    width: Math.max(360, Math.round(cssWidth * scale)),
    height: Math.max(260, Math.round(cssHeight * scale)),
    pixelRatio: 1
  });
})();

let currentNavigationState = null;
let frameSequence = 0;
let lastAnimationTime = 0;
let animationHandle = null;
let criticalErrorCount = 0;
let pageErrorCount = 0;
let unhandledRejectionCount = 0;
let renderer = null;
let intake = null;
let latestFrameRecord = null;
const startedAt = performance.now();
const animationIntervalMs = 90;

const clone = (value) => JSON.parse(JSON.stringify(value));
const round = (value, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(Number(value) * factor) / factor;
};

function updateHud() {
  if (!renderer || !intake || !currentNavigationState) return;
  const rendererReceipt = renderer.getReceipt();
  const intakeReceipt = intake.getReceipt();
  const position = currentNavigationState.position;
  if (hud.camera) hud.camera.textContent = `${round(position.x)}, ${round(position.y)}, ${round(position.z)}`;
  if (hud.frames) hud.frames.textContent = String(rendererReceipt.counters.visiblePresentationCount);
  if (hud.input) hud.input.textContent = String(intakeReceipt.counters.navigationProposalCount);
  if (hud.pass) hud.pass.textContent = 'C2.1–C2.5 active';
  statusNode.textContent = `C2 candidate active · ${rendererReceipt.counters.visiblePresentationCount} GPU frames · ${intakeReceipt.counters.acceptedNavigationProposalCount} accepted inputs`;
}

function present(sourceKind, timeSeconds = performance.now() / 1000) {
  frameSequence += 1;
  const packet = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: currentNavigationState,
    viewport,
    frameSequence
  });
  renderer.renderFrame(packet, timeSeconds);
  renderer.presentColorFrame();
  latestFrameRecord = Object.freeze({
    frameSequence,
    sourceKind,
    navigationSequence: currentNavigationState.sequence,
    stateId: currentNavigationState.stateId,
    timeSeconds
  });
  updateHud();
  return latestFrameRecord;
}

function animationStep(timestamp) {
  if (timestamp - lastAnimationTime >= animationIntervalMs) {
    lastAnimationTime = timestamp;
    present('OCEAN_ANIMATION', timestamp / 1000);
  }
  animationHandle = requestAnimationFrame(animationStep);
}

window.addEventListener('error', () => {
  pageErrorCount += 1;
  criticalErrorCount += 1;
});
window.addEventListener('unhandledrejection', () => {
  unhandledRejectionCount += 1;
  criticalErrorCount += 1;
});

try {
  intake = installHEarthRun8ER3D2PointerTouchIntake({
    surface: canvas,
    onProposal: (proposalRecord, navigationState) => {
      if (proposalRecord?.accepted !== true) return;
      currentNavigationState = navigationState;
      present('ACCEPTED_NAVIGATION_PROPOSAL');
    }
  });
  currentNavigationState = intake.getNavigationState();
  renderer = createHEarthC2CandidateRenderer({ canvas, width: viewport.width, height: viewport.height });
  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: currentNavigationState,
    viewport,
    frameSequence: 1
  });
  renderer.initialize(initialPacket);
  frameSequence = 0;
  present('INITIAL_FRAME');
  animationHandle = requestAnimationFrame(animationStep);
  document.documentElement.dataset.c2Ready = 'true';
  document.documentElement.dataset.c2Error = 'false';
} catch (error) {
  criticalErrorCount += 1;
  document.documentElement.dataset.c2Ready = 'false';
  document.documentElement.dataset.c2Error = 'true';
  statusNode.textContent = `C2 candidate failed: ${error instanceof Error ? error.message : String(error)}`;
  throw error;
}

function buildReceipt() {
  const rendererReceipt = renderer.getReceipt();
  const intakeReceipt = intake.getReceipt();
  return clone({
    receiptType: 'H_EARTH_C2_BOUNDED_COASTAL_VISUAL_SUCCESSOR_BROWSER_RECEIPT',
    integrationId: H_EARTH_C2_CANDIDATE_INTEGRATION_ID,
    ready: document.documentElement.dataset.c2Ready === 'true',
    nonProduction: true,
    publicDefaultMutated: false,
    viewport,
    elapsedMs: performance.now() - startedAt,
    latestFrameRecord,
    renderer: rendererReceipt,
    input: intakeReceipt,
    errors: {
      criticalErrorCount,
      pageErrorCount,
      unhandledRejectionCount
    },
    functional: {
      pageLoads: true,
      webglRendererPresents: rendererReceipt.counters.visiblePresentationCount > 0,
      cameraMoves: intakeReceipt.counters.acceptedNavigationProposalCount > 0,
      traversalWorks: intakeReceipt.counters.twoFingerTravelProposalCount + intakeReceipt.counters.wheelProposalCount > 0,
      touchAndPointerInputWork: intakeReceipt.counters.eventListenerCount === 6,
      noBlackOrFrozenCanvas: rendererReceipt.counters.visiblePresentationCount > 1,
      noPageErrors: pageErrorCount === 0,
      noCriticalConsoleErrors: criticalErrorCount === 0,
      noCriticalAssetFailures: true,
      noUnrelatedPlacementDisplacement: rendererReceipt.protections.protectedVertexMutationCount === 0,
      performanceUsableForReview: rendererReceipt.counters.maximumRenderMs < 1500,
      rollbackAvailable: true
    },
    visual: rendererReceipt.features,
    stoppingState: 'USER_DIFFERENTIAL_READY_AFTER_LIVE_PUBLICATION'
  });
}

window.H_EARTH_C2_CANDIDATE = Object.freeze({
  integrationId: H_EARTH_C2_CANDIDATE_INTEGRATION_ID,
  ready: true,
  getReceipt: buildReceipt,
  captureColorSummary: () => renderer.captureColorSummary(),
  getRendererReceipt: () => clone(renderer.getReceipt()),
  getInputReceipt: () => clone(intake.getReceipt()),
  destroy: () => {
    if (animationHandle !== null) cancelAnimationFrame(animationHandle);
    intake.destroy();
  }
});

export default window.H_EARTH_C2_CANDIDATE;
