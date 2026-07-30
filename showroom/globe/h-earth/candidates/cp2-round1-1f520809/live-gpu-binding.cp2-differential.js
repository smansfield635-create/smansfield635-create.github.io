import { createHEarthRun8ER3AFrameUniformPacket } from '../../render/live-renderer-contract.run8e-r3a.js';
import { createHEarthRun8ER3CPersistentRenderer } from 'https://cdn.jsdelivr.net/gh/smansfield635-create/smansfield635-create.github.io@1f52080969034c55855a70834cc0294791254c80/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.js';

export const H_EARTH_CP2_LIVE_DIFFERENTIAL_BINDING_ID =
  'H_EARTH_CP2_ROUND_1_LIVE_DIFFERENTIAL_BINDING_1F520809';
export const H_EARTH_CP2_ENGINEERING_HEAD =
  '1f52080969034c55855a70834cc0294791254c80';

const clone = (value) => JSON.parse(JSON.stringify(value));

export function createHEarthCp2LiveDifferentialBinding({
  canvas,
  initialNavigationState,
  viewport = { width: 640, height: 360, pixelRatio: 1 },
  onFramePresented = null
} = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('CP2_DIFFERENTIAL_CANVAS_REQUIRED');
  if (!initialNavigationState || typeof initialNavigationState !== 'object') {
    throw new TypeError('CP2_DIFFERENTIAL_INITIAL_NAVIGATION_STATE_REQUIRED');
  }
  if (onFramePresented !== null && typeof onFramePresented !== 'function') {
    throw new TypeError('CP2_DIFFERENTIAL_FRAME_CALLBACK_INVALID');
  }

  const width = Number(viewport.width);
  const height = Number(viewport.height);
  const pixelRatio = Number(viewport.pixelRatio ?? 1);
  if (
    ![width, height, pixelRatio].every(Number.isFinite) ||
    width <= 0 ||
    height <= 0 ||
    pixelRatio <= 0
  ) {
    throw new TypeError('CP2_DIFFERENTIAL_VIEWPORT_INVALID');
  }

  let frameSequence = 0;
  let latestNavigationState = initialNavigationState;
  let lastPngDataUrl = null;
  let latestColorSummary = null;
  const frameRecords = [];
  const evidenceRecords = [];
  const counters = {
    rendererInitializationCount: 0,
    navigationStateAcceptanceCount: 0,
    r3AFramePacketCount: 0,
    renderFrameCallCount: 0,
    gpuFramebufferPresentationCount: 0,
    diagnosticEvidenceReadbackCount: 0,
    diagnosticPngEncodingCount: 0,
    navigationFramesPresentedWithoutReadbackCount: 0,
    explicitEvidenceCaptureCount: 0,
    rejectedProposalCount: 0,
    worldRebuildCount: 0,
    bitmapPreviewApplicationCount: 0,
    cssTransformPreviewCount: 0,
    deferredRenderCommitCount: 0,
    queuedFrameChainCount: 0,
    maximumSynchronousResponseMs: 0,
    maximumPresentationOnlyResponseMs: 0,
    maximumEvidenceCaptureResponseMs: 0
  };

  const renderer = createHEarthRun8ER3CPersistentRenderer({ canvas, width, height });

  const captureEvidence = (label, sourceKind = 'EXPLICIT_DIAGNOSTIC_CAPTURE') => {
    const startedAt = performance.now();
    const capture = renderer.captureColorFrame(label, { includePng: true });
    const responseMs = performance.now() - startedAt;
    counters.diagnosticEvidenceReadbackCount += 1;
    counters.diagnosticPngEncodingCount += capture.pngDataUrl ? 1 : 0;
    counters.maximumEvidenceCaptureResponseMs = Math.max(
      counters.maximumEvidenceCaptureResponseMs,
      responseMs
    );
    lastPngDataUrl = capture.pngDataUrl;
    latestColorSummary = clone(capture.summary);
    const record = Object.freeze({
      evidenceSequence: evidenceRecords.length + 1,
      sourceKind,
      label,
      frameSequence,
      navigationStateId: latestNavigationState.stateId,
      navigationSequence: latestNavigationState.sequence,
      responseMs,
      colorSummary: latestColorSummary
    });
    evidenceRecords.push(record);
    if (evidenceRecords.length > 16) evidenceRecords.shift();
    return record;
  };

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
    renderer.presentColorFrame();
    counters.gpuFramebufferPresentationCount += 1;

    const responseMs = performance.now() - startedAt;
    counters.maximumSynchronousResponseMs = Math.max(
      counters.maximumSynchronousResponseMs,
      responseMs
    );
    counters.maximumPresentationOnlyResponseMs = Math.max(
      counters.maximumPresentationOnlyResponseMs,
      responseMs
    );
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
      colorSummary: null,
      diagnosticReadbackPerformed: false
    });
    frameRecords.push(record);
    if (frameRecords.length > 64) frameRecords.shift();

    if (source.captureEvidence === true) {
      captureEvidence(source.label, source.kind);
    } else {
      counters.navigationFramesPresentedWithoutReadbackCount += 1;
    }

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
    label: 'initial',
    captureEvidence: true
  });

  const acceptNavigationState = (proposalRecord, navigationState) => {
    if (proposalRecord?.accepted !== true) {
      counters.rejectedProposalCount += 1;
      return null;
    }
    if (!navigationState || navigationState.stateId !== proposalRecord.afterStateId) {
      throw new Error('CP2_DIFFERENTIAL_PROPOSAL_NAVIGATION_STATE_MISMATCH');
    }
    counters.navigationStateAcceptanceCount += 1;
    return presentNavigationState(navigationState, {
      kind: 'ACCEPTED_NAVIGATION_PROPOSAL',
      sequence: proposalRecord.sequence,
      inputClass: proposalRecord.inputClass,
      label: `proposal-${proposalRecord.sequence}`,
      captureEvidence: false
    });
  };

  const captureLatestEvidence = (label = `explicit-${frameSequence}`) => {
    counters.explicitEvidenceCaptureCount += 1;
    return clone(captureEvidence(label));
  };

  const getReceipt = () => {
    const resources = renderer.getResourceReceipt();
    const distinctFrameHashCount = new Set(
      evidenceRecords
        .map((record) => record.colorSummary?.byteHash)
        .filter(Boolean)
    ).size;
    return clone({
      receiptType: 'H_EARTH_CP2_ROUND_1_LIVE_DIFFERENTIAL_BINDING_BROWSER_RECEIPT',
      eligible: true,
      status: 'CP2_ROUND_1_LIVE_DIFFERENTIAL_BINDING_ACTIVE',
      bindingId: H_EARTH_CP2_LIVE_DIFFERENTIAL_BINDING_ID,
      engineeringHead: H_EARTH_CP2_ENGINEERING_HEAD,
      viewport: { width, height, pixelRatio },
      initialization,
      resources,
      latestNavigationState,
      frameRecords,
      evidenceRecords,
      latestColorSummary,
      distinctFrameHashCount,
      counters,
      correspondence: {
        acceptedNavigationProposalToR3APacket: true,
        r3APacketToPersistentRenderer: true,
        persistentRendererToGpuFramebufferBlit: true,
        synchronousProposalToVisibleFrame: true,
        continuousPresentationWithoutReadback:
          counters.navigationFramesPresentedWithoutReadbackCount > 0,
        diagnosticReadbackSeparatedFromPresentation:
          counters.diagnosticEvidenceReadbackCount <
          counters.gpuFramebufferPresentationCount,
        packageUploadedOnce: resources.packageUploadedOnce,
        resourceIdentityStable: resources.resourceIdentityStable,
        noPostInitializationResourceCreation: resources.noPostInitializationResourceCreation,
        noPostInitializationBufferUpload: resources.noPostInitializationBufferUpload
      },
      boundaries: {
        isolatedDifferentialRoute: true,
        acceptedPublicRouteMutated: false,
        cp2PrMerged: false,
        userDifferentialRecorded: false,
        physicalDispositionRecorded: false,
        bitmapPreviewApplied: false,
        cssCanvasTransformPreviewApplied: false,
        domImagePresentationCreated: false,
        navigationAuthorityMutated: false,
        r3AFramePacketSourceMutated: false,
        rendererIdentityMutated: false,
        renderPackageMutated: false
      },
      stoppingBoundary: 'STOP_AWAITING_CP2_USER_DIFFERENTIAL'
    });
  };

  return Object.freeze({
    bindingId: H_EARTH_CP2_LIVE_DIFFERENTIAL_BINDING_ID,
    acceptNavigationState,
    captureLatestEvidence,
    getReceipt,
    getLastPngDataUrl: () => lastPngDataUrl
  });
}

export default createHEarthCp2LiveDifferentialBinding;
