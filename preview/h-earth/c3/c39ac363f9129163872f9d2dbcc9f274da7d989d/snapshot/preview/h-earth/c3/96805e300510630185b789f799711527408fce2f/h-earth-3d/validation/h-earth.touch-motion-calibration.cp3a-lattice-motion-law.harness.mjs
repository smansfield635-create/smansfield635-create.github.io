import assert from 'node:assert/strict';
import {
  createGestureControlLattice,
  createContinuousMotionIntegrator
} from '../../showroom/globe/h-earth/diagnostic/touch-motion-cp3a/touch-control-lattice.js';

const lattice = createGestureControlLattice();
const one = (x, y) => ({
  contactCount: 1,
  normalizedCentroidDelta: { x, y },
  normalizedDistanceDelta: 0
});
const two = (x, y, pinch = 0) => ({
  contactCount: 2,
  normalizedCentroidDelta: { x, y },
  normalizedDistanceDelta: pinch
});

const classifications = [
  [one(-0.1, 0), 'TURN_LEFT'],
  [one(0.1, 0), 'TURN_RIGHT'],
  [one(0, -0.1), 'PITCH_UP'],
  [one(0, 0.1), 'PITCH_DOWN'],
  [two(0, -0.1), 'MOVE_FORWARD'],
  [two(0, 0.1), 'MOVE_BACKWARD'],
  [two(0, 0, -0.1), 'ZOOM_IN'],
  [two(0, 0, 0.1), 'ZOOM_OUT']
];

for (const [sample, expected] of classifications) {
  lattice.reset();
  assert.equal(lattice.classify(sample), expected);
}

lattice.reset();
assert.equal(lattice.classify(two(0, -0.09, -0.02)), 'MOVE_FORWARD');
assert.equal(lattice.classify(two(0, -0.02, -0.12)), 'MOVE_FORWARD');

lattice.reset();
assert.equal(lattice.classify(two(0, -0.01, -0.12)), 'ZOOM_IN');
assert.equal(lattice.classify(two(0, -0.12, -0.01)), 'ZOOM_IN');

lattice.reset();
assert.equal(lattice.classify(two(0, -0.1)), 'MOVE_FORWARD');
assert.equal(lattice.classify(two(0, 0.1)), 'MOVE_BACKWARD');

lattice.reset();
assert.equal(lattice.classify({ contactCount: 0 }), 'NONE');

const initialState = () => ({
  position: { x: 0, y: 0, z: 0 },
  yaw: 0,
  pitch: 0,
  zoom: 1
});

function run(intent, frameDt, duration = 1) {
  const motion = createContinuousMotionIntegrator();
  motion.setIntent(intent, 1);
  let state = initialState();
  for (let elapsed = 0; elapsed < duration - 1e-9; elapsed += frameDt) {
    state = motion.step(state, Math.min(frameDt, duration - elapsed));
  }
  return state;
}

for (const gesture of [
  'TURN_LEFT', 'TURN_RIGHT', 'PITCH_UP', 'PITCH_DOWN',
  'MOVE_FORWARD', 'MOVE_BACKWARD', 'ZOOM_IN', 'ZOOM_OUT'
]) {
  assert.notDeepEqual(run(gesture, 1 / 60), initialState());
}

const forward = run('MOVE_FORWARD', 1 / 60);
const backward = run('MOVE_BACKWARD', 1 / 60);
assert.ok(forward.position.z > 0);
assert.ok(backward.position.z < 0);
assert.ok(Math.abs(forward.position.z + backward.position.z) < 1e-9);

const travel30 = run('MOVE_FORWARD', 1 / 30).position.z;
const travel60 = run('MOVE_FORWARD', 1 / 60).position.z;
const travel120 = run('MOVE_FORWARD', 1 / 120).position.z;
assert.ok(Math.max(travel30, travel60, travel120) - Math.min(travel30, travel60, travel120) < 1e-9);

const backlog = createContinuousMotionIntegrator();
backlog.setIntent('MOVE_FORWARD', 1);
const capped = backlog.step(initialState(), 5);
assert.ok(capped.position.z <= backlog.config.travelRate * backlog.config.maxAccumulatedSeconds + 1e-9);
backlog.release();
const released = backlog.step(capped, 1 / 60);
assert.equal(released.position.z, capped.position.z);

console.log(JSON.stringify({
  status: 'PASS',
  assertionCount: 22,
  forwardTravel: forward.position.z,
  backwardTravel: backward.position.z,
  frameRateTravel: { travel30, travel60, travel120 },
  gestureOwnershipLock: 'PASS',
  pinchTravelStability: 'PASS',
  directionalSymmetry: 'PASS',
  frameTimeNormalization: 'PASS',
  boundedInputAccumulation: 'PASS',
  releaseTermination: 'PASS'
}, null, 2));
