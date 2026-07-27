import {
  H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
  proposeHEarthFunctionalLandscapeNavigation
} from '../functional-landscape/navigation.js';
import {
  createHEarthRun8ER3AFrameUniformPacket
} from './live-renderer-contract.run8e-r3a.js';

export const H_EARTH_RUN_8E_R3D_DIRECT_INTERACTION_ID =
  'H_EARTH_RUN_8E_R3D_DIRECT_GPU_INTERACTION_ADAPTER_v1';

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const distance = (left, right) => Math.hypot(right.x - left.x, right.y - left.y);
const centroid = (left, right) => ({
  x: (left.x + right.x) / 2,
  y: (left.y + right.y) / 2
});
const clone = (value) => JSON.parse(JSON.stringify(value));

export function createHEarthRun8ER3DDirectInteraction({
  canvas,
  renderer,
  initialNavigationState,
  viewport = { width: 640, height: 360, pixelRatio: 1 }
} = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('R3D_CANVAS_REQUIRED');
  if (!renderer || typeof renderer.renderFrame !== 'function' || typeof renderer.getResourceReceipt !== 'function') {
    throw new TypeError('R3D_PERSISTENT_RENDERER_REQUIRED');
  }
  if (initialNavigationState?.contractId !== H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID) {
    throw new TypeError('R3D_INITIAL_NAVIGATION_STATE_INVALID');
  }
  if (![viewport.width, viewport.height, viewport.pixelRatio].every(finite)) {
    throw new TypeError('R3D_VIEWPORT_INVALID');
  }

  canvas.style.touchAction = 'none';
  const pointers = new Map();
  const listeners = [];
  const intentQueue = [];
  const actionCounts = Object.create(null);
  const pointerTypeCounts = Object.create(null);
  const frameReceipts = [];
  let navigationState = initialNavigationState;
  let singleLast = null;
  let multiLast = null;
  let frameSequence = 2;
  let frameScheduled = false;
  let earliestQueuedAt = null;
  let destroyed = false;

  const diagnostics = {
    adapterId: H_EARTH_RUN_8E_R3D_DIRECT_INTERACTION_ID,
    pointerDownCount: 0,
    pointerMoveCount: 0,
    pointerUpCount: 0,
    pointerCancelCount: 0,
    wheelEventCount: 0,
    intentCount: 0,
    acceptedProposalCount: 0,
    rejectedProposalCount: 0,
    gpuFrameCount: 0,
    requestAnimationFrameScheduleCount: 0,
    maximumInputToFrameLatencyMilliseconds: 0,
    lastInputToFrameLatencyMilliseconds: 0,
    bitmapPreviewTransformCount: 0,
    cpuRasterRefreshCount: 0,
    drawImageCount: 0,
    canvas2DContextRequestCount: 0,
    imageBitmapCreateCount: 0,
    worldRebuildCount: 0,
    publicRouteRefreshCount: 0,
    publicRouteBindingCount: 0,
    navigationAuthorityMutationCount: 0,
    cameraAuthorityCreationCount: 0
  };

  const add = (type, handler, options) => {
    canvas.addEventListener(type, handler, options);
    listeners.push([type, handler, options]);
  };

  const recordPointerType = (pointerType) => {
    const key = pointerType || 'unknown';
    pointerTypeCounts[key] = (pointerTypeCounts[key] ?? 0) + 1;
  };

  const submitIntent = (intent, source) => {
    if (destroyed) return;
    intentQueue.push({
      intent,
      source,
      queuedAt: performance.now()
    });
    diagnostics.intentCount += 1;
    actionCounts[intent.action] = (actionCounts[intent.action] ?? 0) + 1;
    if (earliestQueuedAt === null) earliestQueuedAt = intentQueue[0].queuedAt;
    scheduleFrame();
  };

  const scheduleFrame = () => {
    if (frameScheduled || destroyed) return;
    frameScheduled = true;
    diagnostics.requestAnimationFrameScheduleCount += 1;
    requestAnimationFrame((timestamp) => {
      frameScheduled = false;
      const queued = intentQueue.splice(0);
      if (queued.length === 0) {
        earliestQueuedAt = null;
        return;
      }

      for (const entry of queued) {
        const proposal = proposeHEarthFunctionalLandscapeNavigation(
          navigationState,
          entry.intent
        );
        if (proposal?.ok === true) {
          navigationState = proposal.state;
          diagnostics.acceptedProposalCount += 1;
        } else {
          diagnostics.rejectedProposalCount += 1;
        }
      }

      const packet = createHEarthRun8ER3AFrameUniformPacket({
        navigationState,
        viewport,
        frameSequence
      });
      frameSequence += 1;
      renderer.renderFrame(packet);
      diagnostics.gpuFrameCount += 1;
      if (packet.worldBuiltBecauseCameraMoved === true) diagnostics.worldRebuildCount += 1;
      if (packet.navigationAuthorityMutated === true) diagnostics.navigationAuthorityMutationCount += 1;
      if (packet.canonicalCameraAuthorityCreated === true) diagnostics.cameraAuthorityCreationCount += 1;

      const latency = earliestQueuedAt === null
        ? 0
        : Math.max(0, timestamp - earliestQueuedAt);
      diagnostics.lastInputToFrameLatencyMilliseconds = latency;
      diagnostics.maximumInputToFrameLatencyMilliseconds = Math.max(
        diagnostics.maximumInputToFrameLatencyMilliseconds,
        latency
      );
      frameReceipts.push({
        frameSequence: packet.frameSequence,
        navigationSequence: packet.navigationSequence,
        navigationStateId: packet.navigationStateId,
        action: navigationState.action,
        inputSources: queued.map((entry) => entry.source),
        intentActions: queued.map((entry) => entry.intent.action),
        latencyMilliseconds: latency,
        cameraPosition: clone(packet.camera.position),
        verticalFovDegrees: packet.camera.verticalFovDegrees,
        worldBuiltBecauseCameraMoved: packet.worldBuiltBecauseCameraMoved
      });
      earliestQueuedAt = intentQueue.length > 0 ? intentQueue[0].queuedAt : null;
      if (intentQueue.length > 0) scheduleFrame();
    });
  };

  const resetBaselines = () => {
    const active = [...pointers.values()];
    if (active.length === 1) {
      singleLast = { ...active[0] };
      multiLast = null;
    } else if (active.length >= 2) {
      multiLast = {
        center: centroid(active[0], active[1]),
        distance: distance(active[0], active[1])
      };
      singleLast = null;
    } else {
      singleLast = null;
      multiLast = null;
    }
  };

  add('pointerdown', (event) => {
    event.preventDefault();
    diagnostics.pointerDownCount += 1;
    recordPointerType(event.pointerType);
    pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      pointerType: event.pointerType
    });
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Browser automation and some mobile engines may not expose capture.
    }
    resetBaselines();
  }, { capture: true, passive: false });

  add('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    event.preventDefault();
    diagnostics.pointerMoveCount += 1;
    pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      pointerType: event.pointerType
    });

    const active = [...pointers.values()];
    if (active.length === 1 && singleLast) {
      const deltaX = active[0].x - singleLast.x;
      const deltaY = active[0].y - singleLast.y;
      if (Math.abs(deltaX) >= 2) {
        submitIntent({
          action: deltaX > 0 ? 'TURN_RIGHT' : 'TURN_LEFT',
          degrees: Math.min(8, Math.max(0.5, Math.abs(deltaX) / 9))
        }, 'ONE_FINGER_LOOK_HORIZONTAL');
      }
      if (Math.abs(deltaY) >= 2) {
        submitIntent({
          action: deltaY < 0 ? 'PITCH_UP' : 'PITCH_DOWN',
          degrees: Math.min(8, Math.max(0.5, Math.abs(deltaY) / 9))
        }, 'ONE_FINGER_LOOK_VERTICAL');
      }
      singleLast = { ...active[0] };
      return;
    }

    if (active.length >= 2) {
      const center = centroid(active[0], active[1]);
      const currentDistance = distance(active[0], active[1]);
      if (multiLast) {
        const centerDeltaY = center.y - multiLast.center.y;
        const distanceDelta = currentDistance - multiLast.distance;
        const pinchDominant = Math.abs(distanceDelta) >
          Math.max(3, Math.abs(centerDeltaY) * 0.65);
        if (pinchDominant && Math.abs(distanceDelta) >= 4) {
          submitIntent({
            action: distanceDelta > 0 ? 'ZOOM_IN' : 'ZOOM_OUT',
            degrees: Math.min(6, Math.max(1, Math.abs(distanceDelta) / 12))
          }, 'TWO_FINGER_PINCH');
        } else if (Math.abs(centerDeltaY) >= 4) {
          submitIntent({
            action: centerDeltaY < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD',
            magnitude: Math.min(10, Math.max(1, Math.abs(centerDeltaY) / 10))
          }, 'TWO_FINGER_TRAVEL');
        }
      }
      multiLast = { center, distance: currentDistance };
    }
  }, { capture: true, passive: false });

  const releasePointer = (event, cancelled = false) => {
    if (!pointers.has(event.pointerId)) return;
    event.preventDefault();
    if (cancelled) diagnostics.pointerCancelCount += 1;
    else diagnostics.pointerUpCount += 1;
    pointers.delete(event.pointerId);
    resetBaselines();
  };
  add('pointerup', (event) => releasePointer(event, false), { capture: true, passive: false });
  add('pointercancel', (event) => releasePointer(event, true), { capture: true, passive: false });

  add('wheel', (event) => {
    event.preventDefault();
    diagnostics.wheelEventCount += 1;
    submitIntent(event.ctrlKey
      ? {
          action: event.deltaY < 0 ? 'ZOOM_IN' : 'ZOOM_OUT',
          degrees: Math.min(6, Math.max(1, Math.abs(event.deltaY) / 80))
        }
      : {
          action: event.deltaY < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD',
          magnitude: Math.min(10, Math.max(1, Math.abs(event.deltaY) / 70))
        }, event.ctrlKey ? 'WHEEL_ZOOM' : 'WHEEL_TRAVEL');
  }, { passive: false });

  const getReceipt = () => {
    const resources = renderer.getResourceReceipt();
    return clone({
      adapterId: H_EARTH_RUN_8E_R3D_DIRECT_INTERACTION_ID,
      ready: !destroyed,
      navigationState,
      activePointerCount: pointers.size,
      queuedIntentCount: intentQueue.length,
      frameScheduled,
      actionCounts,
      pointerTypeCounts,
      frameReceipts,
      diagnostics,
      canvas: {
        width: canvas.width,
        height: canvas.height,
        cssTransform: canvas.style.getPropertyValue('transform'),
        touchAction: canvas.style.touchAction
      },
      rendererResources: resources,
      correspondence: {
        navigationContractPreserved:
          navigationState.contractId === H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,
        samePersistentRendererRetained: resources.resourceIdentityStable === true,
        canonicalPackageUploadedOnce: resources.packageUploadedOnce === true,
        noPostInitializationResourceCreation:
          resources.noPostInitializationResourceCreation === true,
        noPostInitializationBufferUpload:
          resources.noPostInitializationBufferUpload === true,
        directGpuFrameCountMatches: diagnostics.gpuFrameCount === frameReceipts.length,
        noBitmapPreview:
          diagnostics.bitmapPreviewTransformCount === 0 &&
          diagnostics.drawImageCount === 0 &&
          diagnostics.canvas2DContextRequestCount === 0 &&
          diagnostics.imageBitmapCreateCount === 0 &&
          canvas.style.getPropertyValue('transform') === '',
        noCpuRasterRefresh:
          diagnostics.cpuRasterRefreshCount === 0 &&
          diagnostics.publicRouteRefreshCount === 0
      },
      boundaries: {
        publicRouteBound: false,
        publicRouteMutated: false,
        publicDirectManipulationMutated: false,
        navigationAuthorityMutated: diagnostics.navigationAuthorityMutationCount > 0,
        cameraAuthorityCreated: diagnostics.cameraAuthorityCreationCount > 0,
        liveRenderPackageMutated: false,
        gpuTransportAdapterMutated: false,
        deploymentPerformed: false,
        r3EWorkStarted: false,
        run8EPassClosed: false
      }
    });
  };

  const destroy = () => {
    destroyed = true;
    for (const [type, handler, options] of listeners) {
      canvas.removeEventListener(type, handler, options);
    }
    pointers.clear();
    intentQueue.length = 0;
  };

  return Object.freeze({
    adapterId: H_EARTH_RUN_8E_R3D_DIRECT_INTERACTION_ID,
    getNavigationState: () => navigationState,
    getReceipt,
    destroy
  });
}

export default createHEarthRun8ER3DDirectInteraction;
