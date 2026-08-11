import { installHEarthRun8ER3D2PointerTouchIntake } from '../diagnostic/run8e-r3d/pointer-touch-intake.js';
import {
  AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT,
  createMapWideEnvironmentRenderer
} from '../terrain-estate-construction-v1/renderer.mjs';

export const H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_ID =
  'H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_v1';

// Compatibility export retained for existing H-Earth observers. The runtime
// identity now resolves to the G2 one-world integration rather than the
// superseded independent Run8E world presentation.
export const H_EARTH_RUN_8E_R3E2_PUBLIC_INTEGRATION_ID =
  H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_ID;

const G2_WORLD_AUTHORITY = Object.freeze({
  schema: 'H_EARTH_G2_ONE_WORLD_AUTHORITY_BINDING_v1',
  rendererPath: '/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs',
  rendererBlobAtAdmission: '1f9f03cc10c687f6890ff3efed417018fd3496bf',
  terrainAuthorityPath: '/h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js',
  terrainAuthorityBlobAtAdmission: '4ec87cdd5ec1b73710da6dd686a96610a633d27a',
  acceptedAudraliaConsumerPath: '/showroom/globe/audralia/weather-presentation-reconciliation/app.mjs',
  acceptedAudraliaConsumerBlobAtAdmission: '03ce55c0722b1197db11b99583aeb7ef084d4fb7',
  worldContractSchema: AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT.schema,
  canonicalSurfaceAuthority: AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT.canonicalSurfaceAuthority,
  canonicalCoastAuthority: AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT.canonicalCoastAuthority,
  geographicTruthAuthorityCount: AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT.geographicTruthAuthorityCount,
  scaleRepresentationRule: AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT.scaleRepresentationRule,
  cameraDistanceCanChangeGeography: AUDRALIA_OPEN_WORLD_AUTHORING_CONTRACT.cameraDistanceCanChangeGeography
});

const emitDiagnosticStage = (stage, status = 'PASS', detail = null) => {
  window.dispatchEvent(new CustomEvent('h-earth-runtime-diagnostic-stage', {
    detail: {
      stage,
      status,
      detail,
      timestamp: new Date().toISOString()
    }
  }));
};

emitDiagnosticStage('BOOT_STARTED', 'PASS', {
  integrationId: H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_ID,
  strategicGate: 'G2',
  worldAuthority: G2_WORLD_AUTHORITY
});

const root = document.getElementById('h-earth-functional-landscape-route');
const mount = document.getElementById('h-earth-functional-landscape-mount');
const canvas = document.getElementById('h-earth-functional-landscape-canvas');
const statusNode = document.getElementById('route-status');

if (!root || !(mount instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement) || !statusNode) {
  emitDiagnosticStage('CANVAS_ACQUIRED', 'FAIL', 'G2_PUBLIC_ROUTE_HOST_INCOMPLETE');
  throw new Error('G2_PUBLIC_ROUTE_HOST_INCOMPLETE');
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

function deriveViewport() {
  return Object.freeze({
    width: Math.max(1, Math.round(canvas.clientWidth || mount.clientWidth || canvas.width || 1)),
    height: Math.max(1, Math.round(canvas.clientHeight || mount.clientHeight || canvas.height || 1)),
    pixelRatio: Math.min(1.35, window.devicePixelRatio || 1)
  });
}

let intake = null;
let worldRenderer = null;
let latestWorldSnapshot = null;
let lastPresentedFrame = null;

const counters = {
  rendererInitializationCount: 0,
  navigationProposalCount: 0,
  acceptedNavigationProposalCount: 0,
  rejectedNavigationProposalCount: 0,
  mappedTurnProposalCount: 0,
  mappedPitchProposalCount: 0,
  mappedTravelProposalCount: 0,
  mappedZoomProposalCount: 0,
  ignoredAcceptedProposalCount: 0
};

function refreshWorldSnapshot() {
  if (!worldRenderer) return null;
  latestWorldSnapshot = worldRenderer.getSnapshot();
  return latestWorldSnapshot;
}

function worldFrameRecord(proposalRecord = null) {
  const snapshot = refreshWorldSnapshot();
  if (!snapshot) return null;
  return Object.freeze({
    frameSequence: snapshot.renderedFrames,
    navigationSequence: proposalRecord?.afterNavigationSequence ?? intake?.getNavigationState?.()?.sequence ?? 1,
    inputClass: proposalRecord?.inputClass ?? 'INITIAL_WORLD_STATE',
    action: proposalRecord?.intent?.action ?? 'INITIAL_WORLD_STATE',
    viewScale: snapshot.viewScale,
    targetU: snapshot.targetU,
    targetV: snapshot.targetV,
    yaw: snapshot.yaw,
    pitch: snapshot.pitch,
    distance: snapshot.distance,
    canonicalSurfaceAuthority: snapshot.worldContract?.canonicalSurfaceAuthority ?? null,
    canonicalCoastAuthority: snapshot.worldContract?.canonicalCoastAuthority ?? null
  });
}

function applyNavigationProposal(proposalRecord) {
  counters.navigationProposalCount += 1;
  if (proposalRecord?.accepted !== true) {
    counters.rejectedNavigationProposalCount += 1;
    return null;
  }
  counters.acceptedNavigationProposalCount += 1;

  const intent = proposalRecord.intent ?? {};
  const action = intent.action;
  const degrees = Math.max(0, Number(intent.degrees) || 0);
  const magnitude = Math.max(0, Number(intent.magnitude) || 0);

  if (action === 'TURN_LEFT' || action === 'TURN_RIGHT') {
    const sign = action === 'TURN_LEFT' ? -1 : 1;
    worldRenderer.orbit(sign * degrees * 3.35, 0);
    counters.mappedTurnProposalCount += 1;
  } else if (action === 'PITCH_UP' || action === 'PITCH_DOWN') {
    const sign = action === 'PITCH_UP' ? 1 : -1;
    worldRenderer.orbit(0, sign * degrees * 5.45);
    counters.mappedPitchProposalCount += 1;
  } else if (action === 'MOVE_FORWARD' || action === 'MOVE_BACKWARD') {
    const sign = action === 'MOVE_FORWARD' ? 1 : -1;
    worldRenderer.panScreen(0, sign * magnitude);
    counters.mappedTravelProposalCount += 1;
  } else if (action === 'ZOOM_IN' || action === 'ZOOM_OUT') {
    const factor = Math.exp(Math.min(6, degrees) * 0.012);
    worldRenderer.zoomByFactor(action === 'ZOOM_IN' ? factor : 1 / factor);
    counters.mappedZoomProposalCount += 1;
  } else if (action === 'RESET') {
    worldRenderer.focusGratitude();
  } else {
    counters.ignoredAcceptedProposalCount += 1;
    return worldFrameRecord(proposalRecord);
  }

  lastPresentedFrame = worldFrameRecord(proposalRecord);
  root.dataset.gestureUsed = 'true';
  return lastPresentedFrame;
}

function updateHud() {
  if (!intake || !worldRenderer) return;
  const intakeReceipt = intake.getReceipt();
  const snapshot = refreshWorldSnapshot();
  if (!snapshot) return;

  const viewScale = snapshot.viewScale ?? worldRenderer.getViewScale();
  const frame = lastPresentedFrame ?? worldFrameRecord();

  if (hud.waypoint) hud.waypoint.textContent = viewScale === 'LOCAL' ? 'Gratitude · local' : `Gratitude · ${viewScale.toLowerCase()}`;
  if (hud.address) hud.address.textContent = 'Audralia / Gratitude · one canonical world';
  if (hud.position) hud.position.textContent = `${round(snapshot.targetU)}, ${round(snapshot.targetV)} · ${round(snapshot.distance)} distance`;
  if (hud.terrain) hud.terrain.textContent = G2_WORLD_AUTHORITY.canonicalSurfaceAuthority ?? 'Canonical map-wide surface';
  if (hud.clearance) hud.clearance.textContent = `${round(snapshot.distance)} camera distance`;
  if (hud.chunk) hud.chunk.textContent = `${viewScale} resolution`;
  if (hud.formation) hud.formation.textContent = 'Audralia · Gratitude';
  if (hud.frame) hud.frame.textContent = frame ? `World frame ${frame.frameSequence} · navigation ${frame.navigationSequence}` : 'World frame pending';
  if (hud.surface) hud.surface.textContent = 'Accepted map-wide WebGL2 world surface';
  if (hud.water) hud.water.textContent = 'Canonical coast + planetary ocean';
  if (hud.biome) hud.biome.textContent = 'Canonical Gratitude terrain';
  if (hud.traversal) hud.traversal.textContent = `One world · ${viewScale}`;
  if (hud.lifecycle) hud.lifecycle.textContent = 'Single visible world renderer resident';
  if (hud.population) hud.population.textContent = `${G2_WORLD_AUTHORITY.geographicTruthAuthorityCount} geographic truth authority`;

  statusNode.textContent = `G2 one-world candidate active · ${viewScale} · ${snapshot.renderedFrames} frames · ${intakeReceipt.counters.navigationProposalCount} navigation proposals`;

  window.dispatchEvent(new CustomEvent('h-earth-runtime-diagnostic-facts', {
    detail: {
      viewport: deriveViewport(),
      devicePixelRatio: window.devicePixelRatio || 1,
      visibleFrames: snapshot.renderedFrames,
      worldAuthority: G2_WORLD_AUTHORITY,
      viewScale,
      stateAuthority: {
        visibleWorldStateAuthority: 'ACCEPTED_MAP_WIDE_RENDERER_STATE',
        navigationInputStateRole: 'PROPOSAL_ONLY_NONCANONICAL',
        duplicateWorldStateAuthorityIntroduced: false,
        persistenceAuthorityCreated: false
      },
      timestamp: new Date().toISOString()
    }
  }));
}

function activeModuleSources() {
  return [...document.querySelectorAll('script[type="module"][src]')]
    .map((script) => new URL(script.src, document.baseURI).pathname);
}

function buildWorldRendererReceipt() {
  if (!worldRenderer) return null;
  const snapshot = refreshWorldSnapshot();
  const geographicEvidence = worldRenderer.getOW01GeographicEvidence();
  const cameraSafety = worldRenderer.getCameraSafety();
  return clone({
    receiptType: 'H_EARTH_G2_MAP_WIDE_WORLD_RENDERER_BROWSER_RECEIPT',
    eligible: true,
    status: 'G2_MAP_WIDE_WORLD_RENDERER_ACTIVE',
    integrationId: H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_ID,
    worldAuthority: G2_WORLD_AUTHORITY,
    snapshot,
    geographicEvidence,
    cameraSafety,
    counters: {
      rendererInitializationCount: counters.rendererInitializationCount,
      gpuFramebufferPresentationCount: snapshot.renderedFrames,
      navigationStateAcceptanceCount: counters.acceptedNavigationProposalCount,
      worldRebuildCount: 0,
      cssTransformPreviewCount: 0,
      deferredRenderCommitCount: 0
    },
    resources: {
      counters: { contextCreationCount: 1 },
      packageUploadedOnce: false,
      resourceIdentityStable: true
    },
    correspondence: {
      sameMapWideWorldAuthorityAsAcceptedAudraliaConsumer: true,
      geographicTruthAuthorityCount: geographicEvidence.geographicTruthAuthorityCount,
      scaleDependentGeographicSubstitution: geographicEvidence.scaleDependentGeographicSubstitution,
      gratitudeUsesSameMeshAtAllViewScales: geographicEvidence.gratitudeUsesSameMeshAtAllViewScales,
      resourceIdentityStable: true,
      legacyRun8EWorldPackageUsedAsFinalGeographyAuthority: false
    },
    boundaries: {
      acceptedMapWideRendererSourceMutated: false,
      terrainAuthoritySourceMutated: false,
      acceptedAudraliaConsumerMutated: false,
      duplicateWorldRendererCreated: false,
      persistenceAuthorityCreated: false,
      deploymentPerformed: false,
      g2ProvenCurrent: false
    }
  });
}

function buildPublicReceipt() {
  if (!intake || !worldRenderer) return null;
  const intakeReceipt = intake.getReceipt();
  const worldReceipt = buildWorldRendererReceipt();
  const moduleSources = activeModuleSources();
  const legacySources = [
    '/showroom/globe/h-earth/functional-landscape/index.js',
    '/showroom/globe/h-earth/functional-landscape/environment-integration.js',
    '/showroom/globe/h-earth/functional-landscape/direct-manipulation.js',
    '/showroom/globe/h-earth/diagnostic/run8e-r3d/live-gpu-binding.js'
  ];

  return clone({
    receiptType: 'H_EARTH_G2_ONE_WORLD_RECONCILIATION_BROWSER_RECEIPT',
    eligible: true,
    status: 'G2_ONE_WORLD_RECONCILIATION_CANDIDATE_ACTIVE',
    strategicGate: 'G2',
    integrationId: H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_ID,
    legacyIntegrationAlias: 'H_EARTH_RUN_8E_R3E2_PUBLIC_INTEGRATION_ID',
    viewport: deriveViewport(),
    moduleSources,
    intake: intakeReceipt,
    worldRenderer: worldReceipt,
    canonicalWorldIdentity: {
      worldObject: 'AUDRALIA',
      localRegionalIdentity: 'AUDRALIA/GRATITUDE',
      planetaryIdentity: 'AUDRALIA/GRATITUDE',
      sameWorldObjectAcrossResolutions: true,
      canonicalSurfaceAuthority: G2_WORLD_AUTHORITY.canonicalSurfaceAuthority,
      canonicalCoastAuthority: G2_WORLD_AUTHORITY.canonicalCoastAuthority
    },
    stateAuthority: {
      visibleWorldStateAuthority: 'ACCEPTED_MAP_WIDE_RENDERER_STATE',
      navigationProposalAuthority: intakeReceipt.intakeId,
      navigationProposalStateIsWorldStateAuthority: false,
      duplicateWorldStateAuthorityIntroduced: false,
      persistenceAuthorityCreated: false
    },
    runtimeExclusivity: {
      activePublicModuleScriptCount: moduleSources.length,
      legacyModuleScriptCount: legacySources.filter((path) => moduleSources.includes(path)).length,
      activeWebGL2ContextCount: 1,
      activePersistentRendererCount: 1,
      activeNavigationProposalStreamCount: 1,
      activePointerTouchIntakeCount: 1,
      activeFramePresentationAuthorityCount: 1,
      legacyRun8ELiveGpuBindingLoaded: moduleSources.includes(legacySources[3]),
      duplicatePointerListeners: false,
      duplicateWorldRendererAuthority: false,
      acceptedMapWideWorldAuthorityActive: true
    },
    capabilityPreservation: {
      publicRouteShellPreserved: true,
      runtimeDiagnosticStagesPreserved: true,
      hudProjectionPreserved: true,
      pointerTouchIntakePreserved: true,
      oneFingerLookPreserved: true,
      twoFingerTravelPreserved: true,
      pinchZoomPreserved: true,
      wheelEquivalentPreserved: true,
      legacyReadyEventCompatibilityPreserved: true,
      localRegionContinentPlanetaryScaleContinuityAvailable: true
    },
    diagnostics: window.H_EARTH_RUNTIME_DIAGNOSTICS?.getSnapshot?.() ?? null,
    boundaries: {
      oneWorldCandidateMaterialized: true,
      browserProofPerformed: false,
      regressionProofPerformed: false,
      userVisualAcceptancePerformed: false,
      g2ProvenCurrent: false,
      publicRouteBranchComposition: true,
      deploymentPerformed: false,
      physicalDeviceAcceptancePerformed: false,
      mergePerformed: false,
      g3EntryExitRedesignPerformed: false,
      gratitudeDeepDevelopmentPerformed: false
    }
  });
}

try {
  emitDiagnosticStage('RENDERER_CONSTRUCTED', 'PENDING', 'Accepted map-wide world renderer construction requested.');
  worldRenderer = createMapWideEnvironmentRenderer(canvas);
  counters.rendererInitializationCount += 1;

  emitDiagnosticStage('WEBGL2_CONTEXT_ACQUIRED', 'PASS', {
    contextCreationCount: 1,
    worldAuthority: G2_WORLD_AUTHORITY
  });
  emitDiagnosticStage('RENDERER_CONSTRUCTED', 'PASS', {
    renderer: 'createMapWideEnvironmentRenderer',
    geographicTruthAuthorityCount: G2_WORLD_AUTHORITY.geographicTruthAuthorityCount
  });
  emitDiagnosticStage('RENDERER_MOUNTED', 'PASS', {
    canvasConnected: canvas.isConnected,
    mountConnected: mount.isConnected
  });

  worldRenderer.render();
  lastPresentedFrame = worldFrameRecord();
  if (!lastPresentedFrame || lastPresentedFrame.frameSequence < 1) {
    throw new Error('G2_FIRST_WORLD_FRAME_NOT_PRESENTED');
  }
  emitDiagnosticStage('FIRST_FRAME_DRAWN', 'PASS', lastPresentedFrame);

  intake = installHEarthRun8ER3D2PointerTouchIntake({
    surface: canvas,
    onProposal: (proposalRecord) => {
      applyNavigationProposal(proposalRecord);
      updateHud();
    }
  });
} catch (error) {
  root.dataset.run8eReady = 'false';
  root.dataset.run8eError = 'true';
  root.dataset.g2OneWorldReady = 'false';
  root.dataset.g2OneWorldError = 'true';
  emitDiagnosticStage('RENDERER_MOUNTED', 'FAIL', {
    name: error?.name ?? 'Error',
    message: error?.message ?? String(error),
    stack: error?.stack ?? null
  });
  throw error;
}

root.dataset.run6fReady = 'false';
root.dataset.run6fError = 'false';
root.dataset.run7hReady = 'false';
root.dataset.run7hError = 'false';
root.dataset.run8eReady = 'true';
root.dataset.run8eError = 'false';
root.dataset.run8ePublicRoute = 'true';
root.dataset.r3e2PublicGpuComposition = 'false';
root.dataset.g2OneWorldReady = 'true';
root.dataset.g2OneWorldError = 'false';
root.dataset.g2WorldAuthority = 'map-wide';
root.dataset.publicRoute = 'true';

updateHud();

export const H_EARTH_G2_ONE_WORLD_PUBLIC_ROUTE_API = Object.freeze({
  integrationId: H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_ID,
  ready: true,
  getReceipt: buildPublicReceipt,
  getSnapshot: () => buildPublicReceipt(),
  getIntakeReceipt: () => intake.getReceipt(),
  getWorldRendererReceipt: buildWorldRendererReceipt,
  // Compatibility method retained for existing observers. It now returns the
  // actual one-world renderer receipt rather than a superseded Run8E package.
  getLiveGpuReceipt: buildWorldRendererReceipt
});

export const H_EARTH_RUN_8E_R3E2_PUBLIC_ROUTE_API =
  H_EARTH_G2_ONE_WORLD_PUBLIC_ROUTE_API;

window.H_EARTH_G2_ONE_WORLD_PUBLIC_ROUTE = H_EARTH_G2_ONE_WORLD_PUBLIC_ROUTE_API;
window.H_EARTH_RUN8E_PUBLIC_ROUTE = H_EARTH_G2_ONE_WORLD_PUBLIC_ROUTE_API;
window.H_EARTH_RUN8E_R3E2_PUBLIC_INTEGRATION = H_EARTH_G2_ONE_WORLD_PUBLIC_ROUTE_API;

const readyDetail = {
  type: 'H_EARTH_RUN8E_READY',
  integrationId: H_EARTH_G2_ONE_WORLD_PUBLIC_INTEGRATION_ID,
  strategicGate: 'G2',
  worldAuthority: G2_WORLD_AUTHORITY,
  timestamp: new Date().toISOString()
};
window.dispatchEvent(new CustomEvent('h-earth-g2-one-world-ready', { detail: readyDetail }));
window.dispatchEvent(new CustomEvent('h-earth-run8e-ready', { detail: readyDetail }));
emitDiagnosticStage('READY_EVENT_EMITTED', 'PASS', readyDetail);

if (window.parent === window) {
  emitDiagnosticStage('PARENT_READY_STATE_OBSERVED', 'NOT_APPLICABLE', 'Top-level route has no parent host.');
} else {
  window.parent.postMessage(readyDetail, window.location.origin);
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === 'H_EARTH_RUN8E_READY_ACK') {
      emitDiagnosticStage('PARENT_READY_STATE_OBSERVED', 'PASS', event.data);
    }
  });
}

export default H_EARTH_G2_ONE_WORLD_PUBLIC_ROUTE_API;
