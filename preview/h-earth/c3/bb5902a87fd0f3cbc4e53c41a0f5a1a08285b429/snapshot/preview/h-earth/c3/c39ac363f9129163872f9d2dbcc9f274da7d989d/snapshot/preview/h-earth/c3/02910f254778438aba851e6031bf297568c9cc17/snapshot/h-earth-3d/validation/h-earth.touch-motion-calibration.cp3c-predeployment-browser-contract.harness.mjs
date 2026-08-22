import assert from 'node:assert/strict';
import { createGestureControlLattice } from '../../showroom/globe/h-earth/diagnostic/touch-motion-cp3a/touch-control-lattice.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const center = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

class Surface {
  constructor(width = 400, height = 800) {
    this.clientWidth = width;
    this.clientHeight = height;
    this.style = {};
    this.listeners = new Map();
  }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
  removeEventListener() {}
  setPointerCapture() {}
  dispatch(type, event) {
    event.preventDefault = () => {};
    for (const fn of this.listeners.get(type) ?? []) fn(event);
  }
}

let rafQueue = [];
let rafId = 0;
globalThis.requestAnimationFrame = (fn) => {
  rafQueue.push([++rafId, fn]);
  return rafId;
};
globalThis.cancelAnimationFrame = (id) => {
  rafQueue = rafQueue.filter(([candidate]) => candidate !== id);
};
const runFrame = (timestamp) => {
  const current = rafQueue;
  rafQueue = [];
  for (const [, fn] of current) fn(timestamp);
};
const resetRaf = () => {
  rafQueue = [];
  rafId = 0;
};

function installFixture({ surface, onProposal = null }) {
  let state = {
    sequence: 1,
    stateId: 'STATE_0001',
    position: { x: 0, y: 0, z: 0 },
    yawDegrees: 0,
    pitchDegrees: 0,
    verticalFovDegrees: 56
  };
  const contacts = new Map();
  const lattice = createGestureControlLattice();
  const proposals = [];
  let baseline = null;
  let activeIntent = 'NONE';
  let activeStrength = 0;
  let lastFrameTime = null;
  let destroyed = false;
  let frameHandle = null;
  const rates = Object.freeze({
    turnDegreesPerSecond: 72,
    pitchDegreesPerSecond: 54,
    travelWorldUnitsPerSecond: 7.5,
    zoomDegreesPerSecond: 30,
    maximumElapsedSeconds: 0.05
  });
  const counters = {
    boundedElapsedClampCount: 0,
    releaseTerminationCount: 0
  };

  const active = () => [...contacts.values()];
  const resetBaseline = () => {
    const list = active();
    baseline = list.length === 1
      ? { center: { x: list[0].x, y: list[0].y }, distance: 0 }
      : list.length >= 2
        ? { center: center(list[0], list[1]), distance: dist(list[0], list[1]) }
        : null;
  };
  const release = () => {
    if (activeIntent !== 'NONE') counters.releaseTerminationCount += 1;
    activeIntent = 'NONE';
    activeStrength = 0;
    lattice.reset();
  };
  const apply = (intent) => {
    const beforeState = structuredClone(state);
    const next = structuredClone(state);
    next.sequence += 1;
    next.stateId = `STATE_${String(next.sequence).padStart(4, '0')}`;
    switch (intent.action) {
      case 'MOVE_FORWARD': next.position.z -= intent.magnitude; break;
      case 'MOVE_BACKWARD': next.position.z += intent.magnitude; break;
      case 'TURN_LEFT': next.yawDegrees -= intent.degrees; break;
      case 'TURN_RIGHT': next.yawDegrees += intent.degrees; break;
      case 'PITCH_UP': next.pitchDegrees += intent.degrees; break;
      case 'PITCH_DOWN': next.pitchDegrees -= intent.degrees; break;
      case 'ZOOM_IN': next.verticalFovDegrees -= intent.degrees; break;
      case 'ZOOM_OUT': next.verticalFovDegrees += intent.degrees; break;
      default: break;
    }
    state = next;
    const record = Object.freeze({ intent, continuousIntent: activeIntent, beforeState, afterState: structuredClone(next) });
    proposals.push(record);
    onProposal?.(record, next);
  };
  const intentForFrame = (dt) => {
    if (activeIntent.startsWith('MOVE_')) return { action: activeIntent, magnitude: rates.travelWorldUnitsPerSecond * activeStrength * dt };
    if (activeIntent.startsWith('TURN_')) return { action: activeIntent, degrees: rates.turnDegreesPerSecond * activeStrength * dt };
    if (activeIntent.startsWith('PITCH_')) return { action: activeIntent, degrees: rates.pitchDegreesPerSecond * activeStrength * dt };
    if (activeIntent.startsWith('ZOOM_')) return { action: activeIntent, degrees: rates.zoomDegreesPerSecond * activeStrength * dt };
    return null;
  };
  const step = (timestamp) => {
    if (destroyed) return;
    if (lastFrameTime === null) lastFrameTime = timestamp;
    const raw = Math.max(0, (timestamp - lastFrameTime) / 1000);
    lastFrameTime = timestamp;
    const dt = Math.min(raw, rates.maximumElapsedSeconds);
    if (raw > rates.maximumElapsedSeconds) counters.boundedElapsedClampCount += 1;
    const intent = intentForFrame(dt);
    if (intent && dt > 0) apply(intent);
    frameHandle = requestAnimationFrame(step);
  };
  const classify = () => {
    const list = active();
    if (!baseline || list.length === 0) return;
    const width = Math.max(1, surface.clientWidth || 1);
    const height = Math.max(1, surface.clientHeight || 1);
    const diagonal = Math.hypot(width, height);
    const currentCenter = list.length === 1 ? list[0] : center(list[0], list[1]);
    const currentDistance = list.length >= 2 ? dist(list[0], list[1]) : 0;
    const sample = {
      contactCount: list.length,
      normalizedCentroidDelta: {
        x: (currentCenter.x - baseline.center.x) / width,
        y: (currentCenter.y - baseline.center.y) / height
      },
      normalizedDistanceDelta: list.length >= 2
        ? (baseline.distance - currentDistance) / diagonal
        : 0
    };
    activeIntent = lattice.classify(sample);
    activeStrength = activeIntent.startsWith('ZOOM_')
      ? clamp(Math.abs(sample.normalizedDistanceDelta) * 10, 0.2, 1)
      : clamp(Math.hypot(sample.normalizedCentroidDelta.x, sample.normalizedCentroidDelta.y) * 8, 0.2, 1);
  };

  surface.addEventListener('pointerdown', (event) => {
    contacts.set(event.pointerId, { x: event.clientX, y: event.clientY, pointerType: event.pointerType });
    release();
    resetBaseline();
  });
  surface.addEventListener('pointermove', (event) => {
    if (!contacts.has(event.pointerId)) return;
    contacts.set(event.pointerId, { x: event.clientX, y: event.clientY, pointerType: event.pointerType });
    classify();
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    surface.addEventListener(type, (event) => {
      if (!contacts.has(event.pointerId)) return;
      contacts.delete(event.pointerId);
      release();
      resetBaseline();
    });
  }
  frameHandle = requestAnimationFrame(step);

  return Object.freeze({
    getReceipt: () => structuredClone({ state, activeIntent, gestureLock: lattice.getLock(), proposals, counters, rates }),
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frameHandle);
    }
  });
}

const pointer = (pointerId, clientX, clientY) => ({ pointerId, clientX, clientY, pointerType: 'touch' });

function gestureFixture(setup, moves, expectedIntent) {
  resetRaf();
  const surface = new Surface();
  let presentationCount = 0;
  const fixture = installFixture({ surface, onProposal: () => { presentationCount += 1; } });
  runFrame(0);
  for (const event of setup) surface.dispatch('pointerdown', event);
  for (const [type, event] of moves) surface.dispatch(type, event);
  runFrame(16.6667);
  runFrame(33.3334);
  const receipt = fixture.getReceipt();
  assert.equal(receipt.proposals.at(-1)?.intent.action, expectedIntent);
  assert.ok(presentationCount > 0);
  fixture.destroy();
  return receipt;
}

const results = {
  turnLeft: gestureFixture([pointer(1, 200, 400)], [['pointermove', pointer(1, 120, 400)]], 'TURN_LEFT'),
  turnRight: gestureFixture([pointer(1, 200, 400)], [['pointermove', pointer(1, 280, 400)]], 'TURN_RIGHT'),
  pitchUp: gestureFixture([pointer(1, 200, 400)], [['pointermove', pointer(1, 200, 320)]], 'PITCH_UP'),
  pitchDown: gestureFixture([pointer(1, 200, 400)], [['pointermove', pointer(1, 200, 480)]], 'PITCH_DOWN'),
  moveForward: gestureFixture([pointer(1, 160, 500), pointer(2, 240, 500)], [['pointermove', pointer(1, 160, 400)], ['pointermove', pointer(2, 240, 400)]], 'MOVE_FORWARD'),
  moveBackward: gestureFixture([pointer(1, 160, 300), pointer(2, 240, 300)], [['pointermove', pointer(1, 160, 400)], ['pointermove', pointer(2, 240, 400)]], 'MOVE_BACKWARD'),
  zoomIn: gestureFixture([pointer(1, 160, 400), pointer(2, 240, 400)], [['pointermove', pointer(1, 100, 400)], ['pointermove', pointer(2, 300, 400)]], 'ZOOM_IN'),
  zoomOut: gestureFixture([pointer(1, 100, 400), pointer(2, 300, 400)], [['pointermove', pointer(1, 160, 400)], ['pointermove', pointer(2, 240, 400)]], 'ZOOM_OUT')
};

assert.ok(results.moveForward.state.position.z < 0);
assert.ok(results.moveBackward.state.position.z > 0);

resetRaf();
{
  const surface = new Surface();
  const fixture = installFixture({ surface });
  runFrame(0);
  surface.dispatch('pointerdown', pointer(1, 160, 500));
  surface.dispatch('pointerdown', pointer(2, 240, 500));
  surface.dispatch('pointermove', pointer(1, 160, 400));
  surface.dispatch('pointermove', pointer(2, 240, 400));
  assert.equal(fixture.getReceipt().activeIntent, 'MOVE_FORWARD');
  surface.dispatch('pointermove', pointer(1, 80, 390));
  surface.dispatch('pointermove', pointer(2, 320, 390));
  assert.equal(fixture.getReceipt().activeIntent, 'MOVE_FORWARD');
  fixture.destroy();
}

function travelAt(stepMilliseconds) {
  resetRaf();
  const surface = new Surface();
  const fixture = installFixture({ surface });
  runFrame(0);
  surface.dispatch('pointerdown', pointer(1, 160, 500));
  surface.dispatch('pointerdown', pointer(2, 240, 500));
  surface.dispatch('pointermove', pointer(1, 160, 400));
  surface.dispatch('pointermove', pointer(2, 240, 400));
  for (let timestamp = stepMilliseconds; timestamp <= 1000 + 1e-6; timestamp += stepMilliseconds) runFrame(timestamp);
  const z = fixture.getReceipt().state.position.z;
  fixture.destroy();
  return z;
}

const frameRateTravel = {
  hz30: travelAt(1000 / 30),
  hz60: travelAt(1000 / 60),
  hz120: travelAt(1000 / 120)
};
assert.ok(Math.max(...Object.values(frameRateTravel)) - Math.min(...Object.values(frameRateTravel)) < 0.02);

resetRaf();
{
  const surface = new Surface();
  const fixture = installFixture({ surface });
  runFrame(0);
  surface.dispatch('pointerdown', pointer(1, 160, 500));
  surface.dispatch('pointerdown', pointer(2, 240, 500));
  surface.dispatch('pointermove', pointer(1, 160, 400));
  surface.dispatch('pointermove', pointer(2, 240, 400));
  runFrame(1000);
  const receipt = fixture.getReceipt();
  assert.equal(receipt.counters.boundedElapsedClampCount, 1);
  assert.ok(Math.abs(receipt.state.position.z) <= 0.3750001);
  fixture.destroy();
}

resetRaf();
{
  const surface = new Surface();
  const fixture = installFixture({ surface });
  runFrame(0);
  surface.dispatch('pointerdown', pointer(1, 160, 500));
  surface.dispatch('pointerdown', pointer(2, 240, 500));
  surface.dispatch('pointermove', pointer(1, 160, 400));
  surface.dispatch('pointermove', pointer(2, 240, 400));
  runFrame(16.7);
  const before = fixture.getReceipt().proposals.length;
  surface.dispatch('pointerup', pointer(1, 160, 400));
  runFrame(33.4);
  runFrame(50.1);
  assert.equal(fixture.getReceipt().proposals.length, before);
  fixture.destroy();
}

console.log(JSON.stringify({
  status: 'PASS',
  allEightGesturesEmitCorrectIntent: true,
  forwardBackwardOppositeTravel: true,
  frameRateVariationMateriallyStable: true,
  frameRateTravel,
  pinchTravelLockStable: true,
  noUnboundedInputBacklog: true,
  releaseTermination: true,
  proposalToPresentationCorrespondence: true,
  cp2bObservableWitnesses: ['continuousIntent', 'intent', 'beforeState', 'afterState']
}, null, 2));
