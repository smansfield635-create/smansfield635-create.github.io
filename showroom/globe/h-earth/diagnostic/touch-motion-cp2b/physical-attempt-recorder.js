export const H_EARTH_TOUCH_MOTION_CP2B_RECORDER_ID =
  'H_EARTH_TOUCH_MOTION_CP2B_INDEPENDENT_EVIDENCE_LANE_RECORDER_v1';

const clone = (value) => JSON.parse(JSON.stringify(value));
const freeze = (value) => Object.freeze(value);
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

const INPUT_CONFORMANCE = freeze(['CONFIRMED', 'PARTIAL', 'AMBIGUOUS', 'NOT_SUPPLIED']);
const SYSTEM_OUTCOMES = freeze([
  'EXPECTED_RESULT',
  'WRONG_DIRECTION',
  'NO_MOVEMENT',
  'WRONG_GESTURE',
  'MIXED_GESTURE',
  'VISIBLE_RESULT_UNRESOLVED'
]);

function summarizeContacts(events) {
  const byPointer = new Map();
  for (const event of events) {
    if (!byPointer.has(event.pointerId)) byPointer.set(event.pointerId, []);
    byPointer.get(event.pointerId).push(event);
  }
  const contacts = [...byPointer.entries()].map(([pointerId, samples]) => {
    const first = samples[0];
    const last = samples[samples.length - 1];
    return {
      pointerId,
      pointerType: first.pointerType,
      sampleCount: samples.length,
      start: { x: first.clientX, y: first.clientY, timestamp: first.timestamp },
      end: { x: last.clientX, y: last.clientY, timestamp: last.timestamp },
      displacement: {
        x: last.clientX - first.clientX,
        y: last.clientY - first.clientY,
        magnitude: Math.hypot(last.clientX - first.clientX, last.clientY - first.clientY)
      }
    };
  });
  return { byPointer, contacts };
}

function pairSeries(events) {
  const active = new Map();
  const samples = [];
  for (const event of events) {
    if (event.type === 'pointerup' || event.type === 'pointercancel' || event.type === 'lostpointercapture') {
      active.delete(event.pointerId);
    } else {
      active.set(event.pointerId, { x: event.clientX, y: event.clientY });
    }
    if (active.size >= 2) {
      const pair = [...active.values()].slice(0, 2);
      samples.push({
        timestamp: event.timestamp,
        centroid: { x: (pair[0].x + pair[1].x) / 2, y: (pair[0].y + pair[1].y) / 2 },
        distance: distance(pair[0], pair[1])
      });
    }
  }
  return samples;
}

export function measurePhysicalInput(events = []) {
  const ordered = [...events].sort((a, b) => a.sequence - b.sequence);
  const { contacts } = summarizeContacts(ordered);
  const pairs = pairSeries(ordered);
  const firstPair = pairs[0] ?? null;
  const lastPair = pairs.at(-1) ?? null;
  const startTime = ordered[0]?.timestamp ?? null;
  const endTime = ordered.at(-1)?.timestamp ?? null;
  return freeze({
    eventCount: ordered.length,
    eventOrdering: ordered.map((event) => ({ sequence: event.sequence, type: event.type, pointerId: event.pointerId })),
    pointerIds: contacts.map((contact) => contact.pointerId),
    contactCount: contacts.length,
    contacts,
    gestureDurationMs: finite(startTime) && finite(endTime) ? Math.max(0, endTime - startTime) : null,
    centroidStart: firstPair?.centroid ?? null,
    centroidEnd: lastPair?.centroid ?? null,
    centroidDisplacement: firstPair && lastPair ? {
      x: lastPair.centroid.x - firstPair.centroid.x,
      y: lastPair.centroid.y - firstPair.centroid.y,
      magnitude: distance(firstPair.centroid, lastPair.centroid)
    } : null,
    distanceBetweenContactsStart: firstPair?.distance ?? null,
    distanceBetweenContactsEnd: lastPair?.distance ?? null,
    distanceBetweenContactsChange: firstPair && lastPair ? lastPair.distance - firstPair.distance : null
  });
}

export function classifyMoveBackwardInput(measurement) {
  const dy = measurement?.centroidDisplacement?.y;
  const dx = measurement?.centroidDisplacement?.x;
  const distanceChange = measurement?.distanceBetweenContactsChange;
  if (measurement?.contactCount < 2 || !finite(dy)) return 'NOT_SUPPLIED';
  const downward = dy >= 12;
  const materiallyMoved = Math.abs(dy) >= 8;
  const verticalDominant = Math.abs(dy) >= Math.abs(dx ?? 0) * 1.2;
  const pinchSubordinate = !finite(distanceChange) || Math.abs(distanceChange) <= Math.max(8, Math.abs(dy) * 0.65);
  if (downward && verticalDominant && pinchSubordinate) return 'CONFIRMED';
  if (materiallyMoved && (verticalDominant || pinchSubordinate)) return 'PARTIAL';
  if (measurement.contactCount >= 2 && measurement.eventCount > 0) return 'AMBIGUOUS';
  return 'NOT_SUPPLIED';
}

export function deriveSystemOutcome({
  requestedGesture,
  emittedActions = [],
  signedTravel = null,
  movementEpsilon = 0.02,
  automatedWorldResult = null
} = {}) {
  const uniqueActions = [...new Set(emittedActions.filter(Boolean))];
  if (automatedWorldResult === 'UNRESOLVED' || !finite(signedTravel)) return 'VISIBLE_RESULT_UNRESOLVED';
  if (uniqueActions.length > 1) return 'MIXED_GESTURE';
  if (uniqueActions.length === 1 && uniqueActions[0] !== requestedGesture) return 'WRONG_GESTURE';
  if (Math.abs(signedTravel) <= movementEpsilon) return 'NO_MOVEMENT';
  if (requestedGesture === 'MOVE_BACKWARD') return signedTravel < 0 ? 'EXPECTED_RESULT' : 'WRONG_DIRECTION';
  if (requestedGesture === 'MOVE_FORWARD') return signedTravel > 0 ? 'EXPECTED_RESULT' : 'WRONG_DIRECTION';
  return 'VISIBLE_RESULT_UNRESOLVED';
}

export function continuationForInputConformance(inputConformance) {
  if (!INPUT_CONFORMANCE.includes(inputConformance)) throw new TypeError('CP2B_INPUT_CONFORMANCE_INVALID');
  return freeze({
    attemptEvidenceComplete: inputConformance === 'CONFIRMED',
    retryRequired: inputConformance === 'NOT_SUPPLIED',
    retryRecommended: inputConformance === 'PARTIAL',
    retryOrAcceptAmbiguous: inputConformance === 'AMBIGUOUS',
    mayContinue: inputConformance !== 'NOT_SUPPLIED'
  });
}

export function computeSignedTravel(beforePosition, afterPosition, beforeForwardVector) {
  if (![beforePosition, afterPosition, beforeForwardVector].every(Boolean)) return null;
  const delta = {
    x: afterPosition.x - beforePosition.x,
    y: afterPosition.y - beforePosition.y,
    z: afterPosition.z - beforePosition.z
  };
  return dot3(delta, beforeForwardVector);
}

export function createCP2BPhysicalAttemptRecorder({
  requestedGesture = 'MOVE_BACKWARD',
  expectedInputPattern = 'TWO_CONTACT_DOWNWARD_CENTROID_MOTION',
  expectedWorldResult = 'NEGATIVE_SIGNED_TRAVEL',
  viewport = null,
  orientation = null,
  devicePixelRatio = 1,
  now = () => performance.now()
} = {}) {
  const attemptId = `CP2B_ATTEMPT_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
  const startedAt = now();
  const rawEvents = [];
  const systemWitnesses = [];
  const frameWitnesses = [];
  let userVisibleResult = null;
  let closed = false;

  const capturePointerEvent = (event) => {
    if (closed) throw new Error('CP2B_ATTEMPT_ALREADY_CLOSED');
    rawEvents.push({
      sequence: rawEvents.length + 1,
      type: event.type,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      clientX: event.clientX,
      clientY: event.clientY,
      pressure: event.pressure,
      buttons: event.buttons,
      isPrimary: event.isPrimary,
      timestamp: finite(event.timeStamp) ? event.timeStamp : now()
    });
  };

  const captureSystemWitness = (witness) => {
    if (closed) throw new Error('CP2B_ATTEMPT_ALREADY_CLOSED');
    systemWitnesses.push(clone(witness));
  };

  const capturePresentedFrame = (frame) => {
    if (closed) throw new Error('CP2B_ATTEMPT_ALREADY_CLOSED');
    frameWitnesses.push(clone(frame));
  };

  const setUserVisibleResult = (value) => {
    if (closed) throw new Error('CP2B_ATTEMPT_ALREADY_CLOSED');
    userVisibleResult = value;
  };

  const close = ({ beforeState = null, afterState = null, beforeForwardVector = null, automatedWorldResult = null } = {}) => {
    if (closed) throw new Error('CP2B_ATTEMPT_ALREADY_CLOSED');
    closed = true;
    const physicalInput = measurePhysicalInput(rawEvents);
    const inputConformance = requestedGesture === 'MOVE_BACKWARD'
      ? classifyMoveBackwardInput(physicalInput)
      : 'AMBIGUOUS';
    const signedTravel = computeSignedTravel(beforeState?.position, afterState?.position, beforeForwardVector);
    const emittedActions = systemWitnesses.map((witness) => witness?.intent?.action ?? witness?.action).filter(Boolean);
    const systemOutcome = deriveSystemOutcome({ requestedGesture, emittedActions, signedTravel, automatedWorldResult });
    const continuation = continuationForInputConformance(inputConformance);
    return freeze({
      receiptType: 'H_EARTH_TOUCH_MOTION_CP2B_PHYSICAL_ATTEMPT_RECEIPT',
      recorderId: H_EARTH_TOUCH_MOTION_CP2B_RECORDER_ID,
      attemptId,
      requestedGesture,
      expectedInputPattern,
      expectedWorldResult,
      laneA: {
        userIntentPreserved: true,
        physicalInput,
        inputConformance
      },
      laneB: {
        systemWitnesses: clone(systemWitnesses),
        frameWitnesses: clone(frameWitnesses),
        navigationStateBefore: clone(beforeState),
        navigationStateAfter: clone(afterState),
        cameraForwardVectorBefore: clone(beforeForwardVector),
        signedTravel,
        automatedWorldResult: automatedWorldResult ?? (finite(signedTravel) ? 'RESOLVED' : 'UNRESOLVED'),
        userVisibleResult,
        systemOutcome
      },
      environment: { viewport: clone(viewport), orientation, devicePixelRatio },
      continuation,
      attemptStatus: continuation.attemptEvidenceComplete && systemOutcome !== 'EXPECTED_RESULT'
        ? 'COMPLETE_WITH_RESULT_DIVERGENCE'
        : continuation.attemptEvidenceComplete
          ? 'COMPLETE'
          : continuation.retryRequired
            ? 'INCOMPLETE_RETRY_REQUIRED'
            : 'COMPLETE_WITH_INPUT_QUALIFICATION',
      startedAt,
      closedAt: now(),
      laws: {
        expectedOutputRequiredForAdvancement: false,
        wrongDirectionAllowedAsCompleteResult: true,
        userObservationBoundToSameAttempt: true
      }
    });
  };

  return freeze({ attemptId, capturePointerEvent, captureSystemWitness, capturePresentedFrame, setUserVisibleResult, close });
}

export default createCP2BPhysicalAttemptRecorder;
