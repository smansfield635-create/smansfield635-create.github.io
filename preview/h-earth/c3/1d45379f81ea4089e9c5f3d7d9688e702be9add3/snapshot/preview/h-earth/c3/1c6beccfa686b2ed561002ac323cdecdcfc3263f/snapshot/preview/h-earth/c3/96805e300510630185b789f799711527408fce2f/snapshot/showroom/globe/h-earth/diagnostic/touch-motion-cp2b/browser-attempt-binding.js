import {
  createCP2BPhysicalAttemptRecorder
} from './physical-attempt-recorder.js';

export const H_EARTH_TOUCH_MOTION_CP2B_BROWSER_BINDING_ID =
  'H_EARTH_TOUCH_MOTION_CP2B_PHYSICAL_BROWSER_ATTEMPT_BINDING_v1';

const clone = (value) => JSON.parse(JSON.stringify(value));

function forwardVectorFromState(state) {
  if (!state) return null;
  const yaw = Number(state.yawDegrees) * Math.PI / 180;
  const pitch = Number(state.pitchDegrees) * Math.PI / 180;
  const horizontal = Math.cos(pitch);
  return {
    x: Math.sin(yaw) * horizontal,
    y: Math.sin(pitch),
    z: -Math.cos(yaw) * horizontal
  };
}

export function installCP2BPhysicalBrowserAttemptBinding({
  surface,
  routeApi = window.H_EARTH_RUN8E_PUBLIC_ROUTE,
  requestedGesture = 'MOVE_BACKWARD',
  onAttemptReady = null
} = {}) {
  if (!(surface instanceof HTMLElement)) throw new TypeError('CP2B_SURFACE_REQUIRED');
  if (!routeApi?.getIntakeReceipt || !routeApi?.getLiveGpuReceipt) {
    throw new TypeError('CP2B_RUN8E_ROUTE_API_REQUIRED');
  }

  let active = null;
  let beforeState = null;
  let beforeForwardVector = null;
  let destroyed = false;
  let eventSequence = 0;
  const attempts = [];
  const listeners = [];

  const snapshotRoute = () => ({
    intake: routeApi.getIntakeReceipt(),
    liveGpu: routeApi.getLiveGpuReceipt()
  });

  const beginAttempt = () => {
    if (destroyed) throw new Error('CP2B_BINDING_DESTROYED');
    if (active) throw new Error('CP2B_ATTEMPT_ALREADY_ACTIVE');
    const snapshot = snapshotRoute();
    beforeState = clone(snapshot.intake.currentNavigationState);
    beforeForwardVector = forwardVectorFromState(beforeState);
    active = createCP2BPhysicalAttemptRecorder({
      requestedGesture,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        surfaceWidth: surface.clientWidth,
        surfaceHeight: surface.clientHeight
      },
      orientation: screen.orientation?.type ?? `${window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait'}-unknown`,
      devicePixelRatio: window.devicePixelRatio || 1
    });
    eventSequence = 0;
    return active.attemptId;
  };

  const capture = (event) => {
    if (!active || destroyed) return;
    eventSequence += 1;
    active.capturePointerEvent({
      type: event.type,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      clientX: event.clientX,
      clientY: event.clientY,
      pressure: event.pressure,
      buttons: event.buttons,
      isPrimary: event.isPrimary,
      timeStamp: event.timeStamp,
      diagnosticSequence: eventSequence
    });
  };

  for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture']) {
    const listener = (event) => capture(event);
    surface.addEventListener(type, listener, { capture: true, passive: true });
    listeners.push([type, listener]);
  }

  const captureSystemDelta = (beforeSnapshot, afterSnapshot) => {
    const beforeProposalCount = beforeSnapshot.intake.proposals?.length ?? 0;
    const newProposals = (afterSnapshot.intake.proposals ?? []).slice(beforeProposalCount);
    for (const proposal of newProposals) active.captureSystemWitness(proposal);

    const beforeFrameCount = beforeSnapshot.liveGpu.frameRecords?.length ?? 0;
    const newFrames = (afterSnapshot.liveGpu.frameRecords ?? []).slice(beforeFrameCount);
    for (const frame of newFrames) active.capturePresentedFrame({
      ...frame,
      capturedAt: performance.now(),
      presentationCounter: afterSnapshot.liveGpu.counters?.gpuFramebufferPresentationCount ?? null
    });
  };

  const finishAttempt = async ({ userVisibleResult = null, settleFrames = 2 } = {}) => {
    if (!active) throw new Error('CP2B_NO_ACTIVE_ATTEMPT');
    const beforeSnapshot = {
      intake: { currentNavigationState: beforeState, proposals: [] },
      liveGpu: { frameRecords: [] }
    };
    for (let index = 0; index < settleFrames; index += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    const afterSnapshot = snapshotRoute();
    captureSystemDelta(beforeSnapshot, afterSnapshot);
    active.setUserVisibleResult(userVisibleResult);
    const receipt = active.close({
      beforeState,
      afterState: afterSnapshot.intake.currentNavigationState,
      beforeForwardVector,
      automatedWorldResult: null
    });
    attempts.push(receipt);
    active = null;
    beforeState = null;
    beforeForwardVector = null;
    if (onAttemptReady) onAttemptReady(receipt);
    window.dispatchEvent(new CustomEvent('h-earth-touch-motion-cp2b-attempt-ready', { detail: receipt }));
    return receipt;
  };

  const cancelAttempt = () => {
    active = null;
    beforeState = null;
    beforeForwardVector = null;
  };

  const getReceipt = () => clone({
    receiptType: 'H_EARTH_TOUCH_MOTION_CP2B_BROWSER_BINDING_RECEIPT',
    bindingId: H_EARTH_TOUCH_MOTION_CP2B_BROWSER_BINDING_ID,
    activeAttemptId: active?.attemptId ?? null,
    completedAttempts: attempts,
    laws: {
      inputLaneIndependentFromSystemOutcome: true,
      confirmedInputAdvancesRegardlessOfOutput: true,
      wrongDirectionIsEvidenceComplete: true,
      userObservationBoundToAttempt: true
    },
    boundaries: {
      productionTouchImplementationMutated: false,
      navigationAuthorityMutated: false,
      cameraAuthorityMutated: false,
      rendererMutated: false,
      motionCalibrationStarted: false
    }
  });

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    for (const [type, listener] of listeners) {
      surface.removeEventListener(type, listener, { capture: true });
    }
    cancelAttempt();
  };

  return Object.freeze({ beginAttempt, finishAttempt, cancelAttempt, getReceipt, destroy });
}

export default installCP2BPhysicalBrowserAttemptBinding;
