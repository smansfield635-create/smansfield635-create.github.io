import {
  createHEarthFunctionalLandscapeNavigationState,
  proposeHEarthFunctionalLandscapeNavigation,
  evaluateHEarthFunctionalLandscapeNavigationState
} from '../../functional-landscape/navigation.js';
import {
  createGestureControlLattice
} from '../touch-motion-cp3a/touch-control-lattice.js';

export const H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ID =
  'H_EARTH_RUN_8E_CP3B_LOCKED_CONTINUOUS_POINTER_TOUCH_INTAKE_v1';

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
  const lattice = createGestureControlLattice();
  let baseline = null;
  let activeIntent = 'NONE';
  let activeStrength = 0;
  let lastFrameTime = null;
  let frameHandle = null;
  let destroyed = false;
  const proposals = [];

  const rates = Object.freeze({
    turnDegreesPerSecond: 72,
    pitchDegreesPerSecond: 54,
    travelWorldUnitsPerSecond: 7.5,
    zoomDegreesPerSecond: 30,
    maximumElapsedSeconds: 0.05
  });

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
    animationFrameCount: 0,
    activeIntentFrameCount: 0,
    gestureLockTransitionCount: 0,
    releaseTerminationCount: 0,
    boundedElapsedClampCount: 0,
    deferredCommitCount: 0,
    queuedNavigationChainCount: 0
  };

  surface.style.touchAction = 'none';

  const classifyPointer = (event) => {
    if (event.pointerType === 'touch') counters.touchPointerEventCount += 1;
    else if (event.pointerType === 'pen') counters.penPointerEventCount += 1;
    else counters.mousePointerEventCount += 1;
  };

  const snapshotContacts = () => [...pointers.values()];

  const resetBaseline = () => {
    const active = snapshotContacts();
    if (active.length === 1) {
      baseline = { count: 1, center: { x: active[0].x, y: active[0].y }, distance: 0 };
    } else if (active.length >= 2) {
      baseline = { count: 2, center: centroid(active[0], active[1]), distance: distance(active[0], active[1]) };
    } else {
      baseline = null;
    }
  };

  const releaseIntent = () => {
    if (activeIntent !== 'NONE') counters.releaseTerminationCount += 1;
    activeIntent = 'NONE';
    activeStrength = 0;
    lattice.reset();
  };

  const emitProposal = (intent, inputClass, frameFacts = null) => {
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
      continuousIntent: activeIntent,
      continuousStrength: activeStrength,
      frameFacts: frameFacts ? clone(frameFacts) : null,
      accepted: result?.ok === true,
      status: result?.status ?? 'UNKNOWN',
      beforeStateId: before.stateId,
      afterStateId: result?.state?.stateId ?? before.stateId,
      afterNavigationSequence: result?.state?.sequence ?? before.sequence
    });
    proposals.push(record);
    if (proposals.length > 128) proposals.shift();
    if (onProposal) {
      counters.deferredCommitCount += 1;
      queueMicrotask(() => {
        counters.deferredCommitCount -= 1;
        if (!destroyed) onProposal(record, navigationState);
      });
    }
    return record;
  };

  const intentForFrame = (elapsedSeconds) => {
    const amount = activeStrength;
    if (activeIntent === 'MOVE_FORWARD' || activeIntent === 'MOVE_BACKWARD') {
      return { action: activeIntent, magnitude: rates.travelWorldUnitsPerSecond * amount * elapsedSeconds };
    }
    if (activeIntent === 'TURN_LEFT' || activeIntent === 'TURN_RIGHT') {
      return { action: activeIntent, degrees: rates.turnDegreesPerSecond * amount * elapsedSeconds };
    }
    if (activeIntent === 'PITCH_UP' || activeIntent === 'PITCH_DOWN') {
      return { action: activeIntent, degrees: rates.pitchDegreesPerSecond * amount * elapsedSeconds };
    }
    if (activeIntent === 'ZOOM_IN' || activeIntent === 'ZOOM_OUT') {
      return { action: activeIntent, degrees: rates.zoomDegreesPerSecond * amount * elapsedSeconds };
    }
    return null;
  };

  const animationStep = (timestamp) => {
    if (destroyed) return;
    counters.animationFrameCount += 1;
    if (lastFrameTime === null) lastFrameTime = timestamp;
    const rawElapsed = Math.max(0, (timestamp - lastFrameTime) / 1000);
    lastFrameTime = timestamp;
    const elapsedSeconds = Math.min(rawElapsed, rates.maximumElapsedSeconds);
    if (rawElapsed > rates.maximumElapsedSeconds) counters.boundedElapsedClampCount += 1;
    const intent = intentForFrame(elapsedSeconds);
    if (intent && elapsedSeconds > 0) {
      counters.activeIntentFrameCount += 1;
      emitProposal(intent,
        activeIntent.startsWith('MOVE_') ? 'TWO_FINGER_TRAVEL' :
          activeIntent.startsWith('ZOOM_') ? 'PINCH_ZOOM' : 'ONE_FINGER_LOOK',
        { timestamp, rawElapsedSeconds: rawElapsed, appliedElapsedSeconds: elapsedSeconds }
      );
    }
    frameHandle = requestAnimationFrame(animationStep);
  };

  const classifyCurrentMotion = () => {
    const active = snapshotContacts();
    if (!baseline || active.length === 0) return;
    const width = Math.max(1, surface.clientWidth || 1);
    const height = Math.max(1, surface.clientHeight || 1);
    const diagonal = Math.hypot(width, height);
    const center = active.length === 1 ? { x: active[0].x, y: active[0].y } : centroid(active[0], active[1]);
    const currentDistance = active.length >= 2 ? distance(active[0], active[1]) : 0;
    const sample = {
      contactCount: active.length,
      normalizedCentroidDelta: {
        x: (center.x - baseline.center.x) / width,
        y: (center.y - baseline.center.y) / height
      },
      normalizedDistanceDelta: active.length >= 2 ? (baseline.distance - currentDistance) / diagonal : 0
    };
    const previousLock = lattice.getLock();
    const classified = lattice.classify(sample);
    if (lattice.getLock() !== previousLock) counters.gestureLockTransitionCount += 1;
    activeIntent = classified;
    activeStrength = classified.startsWith('ZOOM_')
      ? clamp(Math.abs(sample.normalizedDistanceDelta) * 10, 0.2, 1)
      : clamp(Math.hypot(sample.normalizedCentroidDelta.x, sample.normalizedCentroidDelta.y) * 8, 0.2, 1);
  };

  const onPointerDown = (event) => {
    if (destroyed) return;
    event.preventDefault();
    counters.pointerDownCount += 1;
    classifyPointer(event);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, pointerType: event.pointerType });
    counters.maximumActivePointerCount = Math.max(counters.maximumActivePointerCount, pointers.size);
    releaseIntent();
    resetBaseline();
    try { surface.setPointerCapture?.(event.pointerId); } catch { }
  };

  const onPointerMove = (event) => {
    if (destroyed || !pointers.has(event.pointerId)) return;
    event.preventDefault();
    counters.pointerMoveCount += 1;
    classifyPointer(event);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, pointerType: event.pointerType });
    classifyCurrentMotion();
  };

  const releasePointer = (event, cancelled = false) => {
    if (destroyed || !pointers.has(event.pointerId)) return;
    event.preventDefault();
    classifyPointer(event);
    if (cancelled) counters.pointerCancelCount += 1;
    else counters.pointerUpCount += 1;
    pointers.delete(event.pointerId);
    releaseIntent();
    resetBaseline();
  };

  const onWheel = (event) => {
    if (destroyed) return;
    event.preventDefault();
    counters.wheelEventCount += 1;
    const action = event.ctrlKey
      ? (event.deltaY < 0 ? 'ZOOM_IN' : 'ZOOM_OUT')
      : (event.deltaY < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD');
    emitProposal(action.startsWith('ZOOM_')
      ? { action, degrees: clamp(Math.abs(event.deltaY) / 80, 1, 6) }
      : { action, magnitude: clamp(Math.abs(event.deltaY) / 70, 1, 10) },
    'WHEEL_DIAGNOSTIC_EQUIVALENT');
  };

  const bindings = [
    ['pointerdown', onPointerDown, { passive: false }],
    ['pointermove', onPointerMove, { passive: false }],
    ['pointerup', (event) => releasePointer(event, false), { passive: false }],
    ['pointercancel', (event) => releasePointer(event, true), { passive: false }],
    ['lostpointercapture', (event) => releasePointer(event, true), { passive: false }],
    ['wheel', onWheel, { passive: false }]
  ];
  for (const [type, listener, options] of bindings) {
    surface.addEventListener(type, listener, options);
    counters.eventListenerCount += 1;
  }
  frameHandle = requestAnimationFrame(animationStep);

  const getReceipt = () => clone({
    receiptType: 'H_EARTH_RUN_8E_CP3B_LOCKED_CONTINUOUS_POINTER_TOUCH_INTAKE_BROWSER_RECEIPT',
    eligible: true,
    status: 'RUN_8E_CP3B_LOCKED_CONTINUOUS_TOUCH_ACTIVE',
    intakeId: H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ID,
    currentNavigationState: navigationState,
    activeIntent,
    activeStrength,
    gestureLock: lattice.getLock(),
    proposals,
    counters,
    rates,
    semantics: {
      gestureOwnershipLock: true,
      viewportNormalization: true,
      orientationIndependentScaling: true,
      frameTimeNormalization: true,
      boundedElapsedAccumulation: true,
      continuousMotionOutput: true,
      releaseTermination: true,
      forwardBackwardDirectionalSymmetry: true,
      existingNavigationProposalAuthorityConsumed: true,
      cp2bObservationCompatible: true
    },
    boundaries: {
      navigationAuthorityMutated: false,
      persistentRendererMutated: false,
      cameraCoordinateConventionMutated: false,
      worldGeometryMutated: false,
      cp2bDiagnosticRemoved: false,
      physicalAcceptancePerformed: false,
      cp3CStarted: false
    },
    nextCheckpoint: 'CP3C_PREDEPLOYMENT_EXECUTABLE_VERIFICATION',
    stoppingBoundary: 'STOP_BEFORE_DEPLOYMENT_OR_PHYSICAL_ACCEPTANCE'
  });

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    if (frameHandle !== null) cancelAnimationFrame(frameHandle);
    for (const [type, listener, options] of bindings) surface.removeEventListener(type, listener, options);
    pointers.clear();
    releaseIntent();
  };

  return Object.freeze({
    intakeId: H_EARTH_RUN_8E_R3D2_POINTER_TOUCH_INTAKE_ID,
    getNavigationState: () => navigationState,
    getReceipt,
    destroy
  });
}

export default installHEarthRun8ER3D2PointerTouchIntake;
