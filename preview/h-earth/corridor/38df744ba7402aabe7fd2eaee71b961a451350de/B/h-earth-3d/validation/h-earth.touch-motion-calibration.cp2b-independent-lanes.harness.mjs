import assert from 'node:assert/strict';
import {
  measurePhysicalInput,
  classifyMoveBackwardInput,
  deriveSystemOutcome,
  continuationForInputConformance,
  computeSignedTravel
} from '../../showroom/globe/h-earth/diagnostic/touch-motion-cp2b/physical-attempt-recorder.js';

const events = [
  { sequence: 1, type: 'pointerdown', pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100, timestamp: 0 },
  { sequence: 2, type: 'pointerdown', pointerId: 2, pointerType: 'touch', clientX: 200, clientY: 100, timestamp: 2 },
  { sequence: 3, type: 'pointermove', pointerId: 1, pointerType: 'touch', clientX: 102, clientY: 140, timestamp: 20 },
  { sequence: 4, type: 'pointermove', pointerId: 2, pointerType: 'touch', clientX: 202, clientY: 140, timestamp: 22 },
  { sequence: 5, type: 'pointerup', pointerId: 1, pointerType: 'touch', clientX: 102, clientY: 140, timestamp: 30 },
  { sequence: 6, type: 'pointerup', pointerId: 2, pointerType: 'touch', clientX: 202, clientY: 140, timestamp: 31 }
];

const measurement = measurePhysicalInput(events);
assert.equal(measurement.contactCount, 2);
assert.equal(classifyMoveBackwardInput(measurement), 'CONFIRMED');

const before = { x: 0, y: 2, z: 0 };
const forward = { x: 0, y: 0, z: -1 };
const wrongAfter = { x: 0, y: 2, z: -3 };
const signedTravel = computeSignedTravel(before, wrongAfter, forward);
assert.equal(signedTravel, 3);

const outcome = deriveSystemOutcome({
  requestedGesture: 'MOVE_BACKWARD',
  emittedActions: ['MOVE_BACKWARD'],
  signedTravel
});
assert.equal(outcome, 'WRONG_DIRECTION');

const continuation = continuationForInputConformance('CONFIRMED');
assert.equal(continuation.attemptEvidenceComplete, true);
assert.equal(continuation.mayContinue, true);
assert.equal(continuation.retryRequired, false);

assert.equal(deriveSystemOutcome({
  requestedGesture: 'MOVE_BACKWARD',
  emittedActions: ['MOVE_FORWARD'],
  signedTravel: -2
}), 'WRONG_GESTURE');

assert.equal(deriveSystemOutcome({
  requestedGesture: 'MOVE_BACKWARD',
  emittedActions: ['MOVE_BACKWARD'],
  signedTravel: null,
  automatedWorldResult: 'UNRESOLVED'
}), 'VISIBLE_RESULT_UNRESOLVED');

console.log(JSON.stringify({
  eligible: true,
  status: 'CP2B_INDEPENDENT_EVIDENCE_LANES_PASS',
  confirmedInputCanCompleteWithWrongDirection: true,
  expectedOutputRequiredForAdvancement: false,
  measurement,
  signedTravel,
  outcome,
  continuation
}, null, 2));
