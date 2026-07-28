import { createHEarthRun8ER3AFrameUniformPacket } from '../../render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer } from '../../render/persistent-live-renderer.run8e-r3c.js';

export const H_EARTH_RUN_8E_R3D3_LIVE_GPU_BINDING_ID =
  'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_BINDING_v1';

const clone = (value) => JSON.parse(JSON.stringify(value));

export function createHEarthRun8ER3D3LiveGpuBinding({
  canvas,
  initialNavigationState,
  viewport = { width: 640, height: 360, pixelRatio: 1 },
  onFramePresented = null
} = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('R3D3_CANVAS_REQUIRED');
  if (!initialNavigationState || typeof initialNavigationState !== 'object') throw new TypeError('R3D3_INITIAL_NAVIGATION_STATE_REQUIRED');
  if (onFramePresented !== null && typeof onFramePresented !== 'function') throw new TypeError('R3D3_FRAME_CALLBACK_INVALID');

  const width = Number(viewport.width);
  const height = Number(viewport.height);
  const pixelRatio = Number(viewport.pixelRatio ?? 1);
  if (![width, height, pixelRatio].every(Number.isFinite) || width <= 0 || height <= 0 || pixelRatio <= 0) {
    throw new TypeError('R3D3_VIEWPORT_INVALID');
  }

  let frameSequence = 0;
  let latestNavigationState = initialNavigationState;
  let lastPngDataUrl = null;
  const frameRecords = [];
  const counters = {
    rendererInitializationCount: 0,
    navigationStateAcceptanceCount: 0,
    r3AFramePacketCount: 0,
    renderFrameCallCount: 0,
    gpuFramebufferPresentationCount: 0,
    diagnosticEvidenceReadbackCount: 0,
    rejectedProposalCount: 0,
    worldRebuildCount: 0,
    bitmapPreviewApplicationCount: 0,
    cssTransformPreviewCount: 0,
    deferredRenderCommitCount: 0,
    queuedFrameChainCount: 0,
    maximumSynchronousResponseMs: 0
  };

  const renderer = createHEarthRun8ER3CPersistentRenderer({ canvas, width, height });

  const presentNavigationState = (navigationState, source) => {
    const startedAt = performance.now();
    frameSequence += 1;
    const packet = createHEarthRun8ER3AFrameUniformPacket({
      navigationState,
      viewport: { width, height, pixelRatio },
      frameSequence
    });
    counters.r3AFramePacketCount += 1;
    renderer.renderFrame(packet);
    counters.renderFrameCallCount += 1;
    const capture = renderer.captureColorFrame(source.label);
    counters.gpuFramebufferPresentationCount += 1;
    counters.diagnosticEvidenceReadbackCount += 1;
    lastPngDataUrl = capture.pngDataUrl;
    const responseMs = performance.now() - startedAt;
    counters.maximumSynchronousResponseMs = Math.max(counters.maximumSynchronousResponseMs, responseMs);
    latestNavigationState = navigationState;
    const record = Object.freeze({
      frameSequence,
      sourceKind: source.kind,
      sourceSequence: source.sequence,
      inputClass: source.inputClass ?? null,
      navigationStateId: navigationState.stateId,
      navigationSequence: navigationState.sequence,
      cameraPosition: clone(packet.camera.position),
      verticalFovDegrees: packet.camera.verticalFovDegrees,
      viewProjectionMatrix: [...packet.camera.viewProjectionMatrix],
      worldBuiltBecauseCameraMoved: packet.worldBuiltBecauseCameraMoved,
      successorTerrainCameraReconciled: packet.successorTerrainCameraReconciled,
      responseMs,
      colorSummary: clone(capture.summary)
    });
    frameRecords.push(record);
    if (frameRecords.length > 64) frameRecords.shift();
    onFramePresented?.(record);
    return record;
  };

  const initialPacket = createHEarthRun8ER3AFrameUniformPacket({
    navigationState: initialNavigationState,
    viewport: { width, height, pixelRatio },
    frameSequence: 1
  });
  counters.r3AFramePacketCount += 1;
  const initialization = renderer.initialize(initialPacket);
  counters.rendererInitializationCount += 1;
  frameSequence = 0;
  presentNavigationState(initialNavigationState, {
    kind: 'INITIAL_NAVIGATION_STATE',
    sequence: initialNavigationState.sequence,
    label: 'initial'
  });

  const acceptNavigationState = (proposalRecord, navigationState) => {
    if (proposalRecord?.accepted !== true) {
      counters.rejectedProposalCount += 1;
      return null;
    }
    if (!navigationState || navigationState.stateId !== proposalRecord.afterStateId) {
      throw new Error('R3D3_PROPOSAL_NAVIGATION_STATE_MISMATCH');
    }
    counters.navigationStateAcceptanceCount += 1;
    return presentNavigationState(navigationState, {
      kind: 'ACCEPTED_NAVIGATION_PROPOSAL',
      sequence: proposalRecord.sequence,
      inputClass: proposalRecord.inputClass,
      label: `proposal-${proposalRecord.sequence}`
    });
  };

  const getReceipt = () => {
    const resources = renderer.getResourceReceipt();
    const distinctFrameHashCount = new Set(frameRecords.map((record) => record.colorSummary.byteHash)).size;
    return clone({
      receiptType: 'H_EARTH_RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_BROWSER_RECEIPT',
      eligible: true,
      status: 'RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_ACTIVE',
      bindingId: H_EARTH_RUN_8E_R3D3_LIVE_GPU_BINDING_ID,
      viewport: { width, height, pixelRatio },
      initialization,
      resources,
      latestNavigationState,
      frameRecords,
      distinctFrameHashCount,
      counters,
      correspondence: {
        acceptedNavigationProposalToR3APacket: true,
        r3APacketToPersistentRenderer: true,
        persistentRendererToGpuFramebufferBlit: true,
        synchronousProposalToVisibleFrame: true,
        packageUploadedOnce: resources.packageUploadedOnce,
        resourceIdentityStable: resources.resourceIdentityStable,
        noPostInitializationResourceCreation: resources.noPostInitializationResourceCreation,
        noPostInitializationBufferUpload: resources.noPostInitializationBufferUpload
      },
      boundaries: {
        bitmapPreviewApplied: false,
        cssCanvasTransformPreviewApplied: false,
        domImagePresentationCreated: false,
        publicRouteBound: false,
        publicRouteMutated: false,
        publicDirectManipulationMutated: false,
        navigationAuthorityMutated: false,
        r3AFramePacketSourceMutated: false,
        persistentRendererSourceMutated: false,
        deploymentPerformed: false,
        r3D4WorkStarted: false,
        run8EPassClosed: false
      },
      nextCheckpoint: 'RUN_8E_R3D4_NOT_STARTED',
      stoppingBoundary: 'STOP_BEFORE_INTERACTION_BROWSER_EXECUTION_R3D4'
    });
  };

  return Object.freeze({
    bindingId: H_EARTH_RUN_8E_R3D3_LIVE_GPU_BINDING_ID,
    acceptNavigationState,
    getReceipt,
    getLastPngDataUrl: () => lastPngDataUrl
  });
}

export default createHEarthRun8ER3D3LiveGpuBinding;
