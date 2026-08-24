export const GESTURES = Object.freeze([
  'TURN_LEFT','TURN_RIGHT','PITCH_UP','PITCH_DOWN',
  'MOVE_FORWARD','MOVE_BACKWARD','ZOOM_IN','ZOOM_OUT','NONE'
]);

const clamp = (value, lower, upper) => Math.min(upper, Math.max(lower, value));
const magnitude2D = (x, y) => Math.hypot(x, y);

export function createGestureControlLattice(options = {}) {
  const config = Object.freeze({
    axisThreshold: options.axisThreshold ?? 0.06,
    pinchThreshold: options.pinchThreshold ?? 0.045,
    dominanceRatio: options.dominanceRatio ?? 1.25,
    reversalThreshold: options.reversalThreshold ?? 0.08
  });

  let gestureLock = null;
  let lastPrimaryValue = 0;

  function classify(sample) {
    const contactCount = sample.contactCount ?? 0;
    if (contactCount <= 0) return 'NONE';

    const dx = Number(sample.normalizedCentroidDelta?.x ?? 0);
    const dy = Number(sample.normalizedCentroidDelta?.y ?? 0);
    const pinch = Number(sample.normalizedDistanceDelta ?? 0);

    if (gestureLock) {
      const primaryValue = gestureLock.startsWith('ZOOM')
        ? pinch
        : (Math.abs(dx) >= Math.abs(dy) ? dx : dy);
      const materialReversal = Math.sign(primaryValue) !== 0
        && Math.sign(lastPrimaryValue) !== 0
        && Math.sign(primaryValue) !== Math.sign(lastPrimaryValue)
        && Math.abs(primaryValue) >= config.reversalThreshold;

      if (!materialReversal) {
        lastPrimaryValue = primaryValue || lastPrimaryValue;
        return gestureLock;
      }
      gestureLock = null;
    }

    if (contactCount === 1) {
      if (magnitude2D(dx, dy) < config.axisThreshold) return 'NONE';
      gestureLock = Math.abs(dx) >= Math.abs(dy)
        ? (dx < 0 ? 'TURN_LEFT' : 'TURN_RIGHT')
        : (dy < 0 ? 'PITCH_UP' : 'PITCH_DOWN');
      lastPrimaryValue = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
      return gestureLock;
    }

    const travelMagnitude = magnitude2D(dx, dy);
    const pinchMagnitude = Math.abs(pinch);

    if (pinchMagnitude >= config.pinchThreshold
        && pinchMagnitude >= travelMagnitude * config.dominanceRatio) {
      gestureLock = pinch < 0 ? 'ZOOM_IN' : 'ZOOM_OUT';
      lastPrimaryValue = pinch;
      return gestureLock;
    }

    if (Math.abs(dy) >= config.axisThreshold && Math.abs(dy) >= Math.abs(dx)) {
      gestureLock = dy < 0 ? 'MOVE_FORWARD' : 'MOVE_BACKWARD';
      lastPrimaryValue = dy;
      return gestureLock;
    }

    return 'NONE';
  }

  return Object.freeze({
    classify,
    reset() {
      gestureLock = null;
      lastPrimaryValue = 0;
    },
    getLock: () => gestureLock,
    config
  });
}

export function createContinuousMotionIntegrator(options = {}) {
  const config = Object.freeze({
    turnRate: options.turnRate ?? 1.2,
    pitchRate: options.pitchRate ?? 1.0,
    travelRate: options.travelRate ?? 6,
    zoomRate: options.zoomRate ?? 1.5,
    maxDt: options.maxDt ?? 1 / 20,
    maxAccumulatedSeconds: options.maxAccumulatedSeconds ?? 0.1,
    releaseDecaySeconds: options.releaseDecaySeconds ?? 0.08
  });

  let intent = 'NONE';
  let intentMagnitude = 0;
  let pendingSeconds = 0;

  function setIntent(nextIntent, nextMagnitude = 1) {
    intent = GESTURES.includes(nextIntent) ? nextIntent : 'NONE';
    intentMagnitude = clamp(Number(nextMagnitude) || 0, 0, 1);
  }

  function release() {
    intent = 'NONE';
  }

  function step(state, elapsedSeconds) {
    pendingSeconds = Math.min(
      config.maxAccumulatedSeconds,
      pendingSeconds + Math.max(0, elapsedSeconds)
    );

    const nextState = {
      ...state,
      position: { ...state.position }
    };

    while (pendingSeconds > 1e-9) {
      const dt = Math.min(config.maxDt, pendingSeconds);
      pendingSeconds -= dt;
      const amount = intentMagnitude;

      switch (intent) {
        case 'TURN_LEFT':
          nextState.yaw -= config.turnRate * amount * dt;
          break;
        case 'TURN_RIGHT':
          nextState.yaw += config.turnRate * amount * dt;
          break;
        case 'PITCH_UP':
          nextState.pitch -= config.pitchRate * amount * dt;
          break;
        case 'PITCH_DOWN':
          nextState.pitch += config.pitchRate * amount * dt;
          break;
        case 'MOVE_FORWARD':
          nextState.position.x += Math.sin(nextState.yaw) * config.travelRate * amount * dt;
          nextState.position.z += Math.cos(nextState.yaw) * config.travelRate * amount * dt;
          break;
        case 'MOVE_BACKWARD':
          nextState.position.x -= Math.sin(nextState.yaw) * config.travelRate * amount * dt;
          nextState.position.z -= Math.cos(nextState.yaw) * config.travelRate * amount * dt;
          break;
        case 'ZOOM_IN':
          nextState.zoom -= config.zoomRate * amount * dt;
          break;
        case 'ZOOM_OUT':
          nextState.zoom += config.zoomRate * amount * dt;
          break;
        default:
          break;
      }
    }

    return Object.freeze(nextState);
  }

  return Object.freeze({
    setIntent,
    release,
    step,
    getIntent: () => intent,
    config
  });
}
