import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState
} from '../../functional-landscape/navigation.js';

export const H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ID =
  'H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE_v1';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const distance = (left, right) => Math.hypot(right.x - left.x, right.y - left.y);
const centroid = (left, right) => ({ x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 });
const clone = (value) => JSON.parse(JSON.stringify(value));

export function installHEarthRun8ER3D2PointerTouchIntake({ surface, onProposal = null } = {}) {
  if (!(surface instanceof HTMLElement)) throw new TypeError('R3D2_SURFACE_REQUIRED');
  if (onProposal !== null && typeof onProposal !== 'function') throw new TypeError('R3D2_PROPOSAL_CALLBACK_INVALID');

  const initial = createHEarthFunctionalLandscapeNavigationState({ waypointId: 'COAST' });
  if (initial?.ok !== true) throw new Error(`R3D2_INITIAL_NAVIGATION_REJECTED:${initial?.issues?.join(',')}`);

  let navigationState = initial.state;
  const pointers = new Map();
  let singleLast = null;
  let multiLast = null;
  let destroyed = false;
  const proposals = [];
  const counters = {
    eventListenerCount: 0,
    pointerDownCount: 0,
    pointerMoveCount: 0,
    pointerUpCount: 0,
    pointerCancelCount: 0,
    wheelEventCount: 0,
    touchPointerEventCount: 0,
    mousePointerEventCount: 0,
    penPointerEventCount: 0,
    navigationProposalCount: 0,
    acceptedNavigationProposalCount: 0,
    rejectedNavigationProposalCount: 0,
    oneFingerLookProposalCount: 0,
    twoFingerTravelProposalCount: 0,
    pinchProposalCount: 0,
    wheelProposalCount: 0,
    maximumActivePointerCount: 0,
    deferredCommitCount: 0,
    queuedNavigationChainCount: 0
  };

  surface.style.touchAction = 'none';

  const classifyPointer = (event) => {
    if (event.pointerType === 'touch') counters.touchPointerEventCount += 1;
    else if (event.pointerType === 'pen') counters.penPointerEventCount += 1;
    else counters.mousePointerEventCount += 1;
  };

  const resetBaselines = () => {
    const active = [...pointers.values()];
    if (active.length === 1) {
      singleLast = { ...active[0] };
      multiLast = null;
    } else if (active.length >= 2) {
      multiLast = { center: centroid(active[0], active[1]), distance: distance(active[0], active[1]) };
      singleLast = null;
    } else {
      singleLast = null;
      multiLast = null;
    }
  };

  const emitProposal = (intent, inputClass) => {
    const before = navigationState;
    const result = proposeHEarthFunctionalLandscapeNavigation(before, intent);
    counters.navigationProposalCount += 1;
    if (result?.ok === true) {
      const evaluation = evaluateHEarthFunctionalLandscapeNavigationState(result.state);
      if (evaluation?.eligible !== true) throw new Error(`R3D2_NAVIGATION_STATE_REJECTED:${evaluation?.issues?.join(',')}`);
      navigationState = result.state;
      counters.acceptedNavigationProposalCount += 1;
    } else {
      counters.rejectedNavigationProposalCount += 1;
    }
    if (inputClass === 'ONE_FINGER_LOOK') counters.oneFingerLookProposalCount += 1;
    if (inputClass === 'TWO_FINGER_TRAVEL') counters.twoFingerTravelProposalCount += 1;
    if (inputClass === 'PINCH_ZOOM') counters.pinchProposalCount += 1;
    if (inputClass === 'WHEEL_DIAGNOSTIC_EQUIVALENT') counters.wheelProposalCount += 1;
    const record = Object.freeze({
      sequence: counters.navigationProposalCount,
      inputClass,
      intent: clone(intent),
      accepted: result?.ok === true,
      status: result?.status ?? 'UNKNOWN',
      beforeStateId: before.stateId,
      afterStateId: result?.state?.stateId ?? before.stateId,
      afterNavigationSequence: result?.state?.sequence ?? before.sequence
    });
    proposals.push(record);
    if (proposals.length > 64) proposals.shift();

    // Browser input can be delivered re-entrantly while a slow mobile GPU is
    // constructing. Publish the accepted proposal in the next microtask so the
    // public integration has completed assignment of its live GPU binding.
    if (onProposal) {
      counters.deferredCommitCount += 1;
      queueMicrotask(() => {
        counters.deferredCommitCount -= 1;
        if (!destroyed) onProposal(record, navigationState);
      });
    }
    return record;
  };

  const onPointerDown = (event) => {
    if (destroyed) return;
    event.preventDefault();
    counters.pointerDownCount += 1;
    classifyPointer(event);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, pointerType: event.pointerType });
    counters.maximumActivePointerCount = Math.max(counters.maximumActivePointerCount, pointers.size);
    resetBaselines();
    try { surface.setPointerCapture?.(event.pointerId); } catch { }
  };

  const onPointerMove = (event) => {
    if (destroyed || !pointers.has(event.pointerId)) return;
    event.preventDefault();
    counters.pointerMoveCount += 1;
    classifyPointer(event);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, pointerType: event.pointerType });
    const active = [...pointers.values()];

    if (active.length === 1 && singleLast) {
      const deltaX = active[0].x - singleLast.x;
      const deltaY = active[0].y - singleLast.y;
      singleLast = { ...active[0] };
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 3) return;
      const horizontal = Math.abs(deltaX) >= Math.abs(deltaY);
      emitProposal({
        action: horizontal
          ? (deltaX > 0 ? 'TURN_RIGHT' : 'TURN_LEFT')
          : (deltaY < 0 ? 'PITCH_UP' : 'PITCH_DOWN'),
        degrees: clamp(Math.abs(horizontal ? deltaX : deltaY) / 9, 0.5, 8)
      }, 'ONE_FINGER_LOOK');
      return;
    }

    if (active.length >= 2) {
      const center = centroid(active[0], active[1]);
      const currentDistance = distance(active[0], active[1]);
      if (multiLast) {
        const centerDeltaY = center.y - multiLast.center.y;
        const distanceDelta = currentDistance - multiLast.distance;
        const pinchDominant = Math.abs(distanceDelta) > Math.max(3, Math.abs(centerDeltaY) * 0.65);
        if (pinchDominant && Math.abs(distanceDelta) >= 5) {
          emitProposal({
            action: distanceDelta > 0 ? 'ZOOM_IN' : 'ZOOM_OUT',
            degrees: clamp(Math.abs(distanceDelta) / 12, 1, 6)
          }, 'PINCH_ZOOM');
        } else if (Math.abs(centerDeltaY) >= 8) {
          emitProposal({
            action: centerDeltaY < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD',
            magnitude: clamp(Math.abs(centerDeltaY) / 10, 1, 10)
          }, 'TWO_FINGER_TRAVEL');
        }
      }
      multiLast = { center, distance: currentDistance };
    }
  };

  const releasePointer = (event, cancelled = false) => {
    if (destroyed || !pointers.has(event.pointerId)) return;
    event.preventDefault();
    classifyPointer(event);
    if (cancelled) counters.pointerCancelCount += 1;
    else counters.pointerUpCount += 1;
    pointers.delete(event.pointerId);
    resetBaselines();
  };

  const onPointerUp = (event) => releasePointer(event, false);
  const onPointerCancel = (event) => releasePointer(event, true);
  const onWheel = (event) => {
    if (destroyed) return;
    event.preventDefault();
    counters.wheelEventCount += 1;
    const intent = event.ctrlKey
      ? {
          action: event.deltaY < 0 ? 'ZOOM_IN' : 'ZOOM_OUT',
          degrees: clamp(Math.abs(event.deltaY) / 80, 1, 6)
        }
      : {
          action: event.deltaY < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD',
          magnitude: clamp(Math.abs(event.deltaY) / 70, 1, 10)
        };
    emitProposal(intent, 'WHEEL_DIAGNOSTIC_EQUIVALENT');
  };

  const bindings = [
    ['pointerdown', onPointerDown, { passive: false }],
    ['pointermove', onPointerMove, { passive: false }],
    ['pointerup', onPointerUp, { passive: false }],
    ['pointercancel', onPointerCancel, { passive: false }],
    ['lostpointercapture', onPointerCancel, { passive: false }],
    ['wheel', onWheel, { passive: false }]
  ];
  for (const [type, listener, options] of bindings) {
    surface.addEventListener(type, listener, options);
    counters.eventListenerCount += 1;
  }

  const getReceipt = () => clone({
    receiptType: 'H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_NAVIGATION_PROPOSAL_INTAKE_BROWSER_RECEIPT',
    eligible: true,
    status: 'RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ACTIVE',
    intakeId: H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ID,
    currentNavigationState: navigationState,
    proposals,
    counters,
    semantics: {
      oneFingerLook: true,
      twoFingerForwardBackTravel: true,
      pinchZoom: true,
      wheelDiagnosticEquivalent: true,
      touchConsumedThroughPointerEvents: true,
      existingNavigationProposalAuthorityConsumed: true,
      immediateProposalIntake: true,
      proposalPublicationSerializedBehindStartup: true
    },
    boundaries: {
      webGLContextCreated: false,
      persistentRendererInitialized: false,
      liveGpuCameraBindingCreated: false,
      gpuDrawExecuted: false,
      bitmapPreviewExecuted: false,
      canvasTransformPreviewCreated: false,
      publicRouteBound: false,
      publicRouteMutated: false,
      publicDirectManipulationMutated: false,
      navigationAuthorityMutated: false,
      persistentRendererMutated: false,
      r3D3WorkStarted: false,
      run8EPassClosed: false
    },
    nextCheckpoint: 'RUN_8E_R3D3_NOT_STARTED',
    stoppingBoundary: 'STOP_BEFORE_LIVE_GPU_CAMERA_BINDING_R3D3'
  });

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    for (const [type, listener, options] of bindings) surface.removeEventListener(type, listener, options);
    pointers.clear();
    resetBaselines();
  };

  return Object.freeze({
    intakeId: H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ID,
    getNavigationState: () => navigationState,
    getReceipt,
    destroy
  });
}

export default installHEarthRun8ER3D2PointerTouchIntake;
