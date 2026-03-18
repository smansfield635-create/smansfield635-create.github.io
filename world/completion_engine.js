// TNT — /world/control.js
// PURPOSE: projection, camera, interaction
// RULE: no WORLD_KERNEL grid assumptions

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function createControlSystem() {
  let width = 0;
  let height = 0;

  let yaw = 0;
  let pitch = 0;

  let yawVelocity = 0;
  let pitchVelocity = 0;

  let zoomCurrent = 1;
  let zoomTarget = 1;
  let zoomMin = 0.8;
  let zoomMax = 1.6;

  let orbitPhase = 0;

  function resize(w, h) {
    width = w;
    height = h;
  }

  function setZoomBounds(min, max) {
    zoomMin = min;
    zoomMax = max;
  }

  function setZoomAbsolute(v) {
    zoomCurrent = clamp(v, zoomMin, zoomMax);
    zoomTarget = zoomCurrent;
  }

  function adjustZoomBy(delta) {
    zoomTarget = clamp(zoomTarget + delta, zoomMin, zoomMax);
  }

  function applyDrag(dx, dy) {
    yaw += dx * 0.0025;
    pitch += dy * 0.0025;

    pitch = clamp(pitch, -Math.PI / 2.2, Math.PI / 2.2);

    yawVelocity = dx * 0.0008;
    pitchVelocity = dy * 0.0008;
  }

  function stepInertia(dt) {
    yaw += yawVelocity * dt;
    pitch += pitchVelocity * dt;

    yawVelocity *= 0.92;
    pitchVelocity *= 0.92;

    zoomCurrent += (zoomTarget - zoomCurrent) * 0.08;
  }

  function advanceOrbit(dt, speed) {
    orbitPhase += dt * speed;
  }

  function projectSphere(latDeg, lonDeg, radiusOffset = 0) {
    const lat = degToRad(latDeg);
    const lon = degToRad(lonDeg);

    const r = Math.min(width, height) * 0.36 * zoomCurrent + radiusOffset;

    const x =
      Math.cos(lat) * Math.sin(lon + yaw);

    const y =
      Math.sin(lat + pitch);

    const z =
      Math.cos(lat) * Math.cos(lon + yaw);

    return {
      x: width / 2 + x * r,
      y: height / 2 - y * r,
      z,
      visible: z > 0
    };
  }

  function getCameraState() {
    return {
      yaw,
      pitch,
      zoomCurrent
    };
  }

  function getMotionState() {
    return {
      yawVelocity,
      pitchVelocity,
      zoomCurrent
    };
  }

  function getOrbitalState() {
    return {
      orbitPhase
    };
  }

  function getProjectionSummary() {
    return {
      sampleX: Math.floor(width / 2),
      sampleY: Math.floor(height / 2)
    };
  }

  function setOrientation(state) {
    if (typeof state.zoomCurrent === "number") {
      zoomCurrent = state.zoomCurrent;
    }
    if (typeof state.zoomTarget === "number") {
      zoomTarget = state.zoomTarget;
    }
  }

  function setPresentationMode() {
    // no-op for now (mode handled in index)
  }

  function restoreMotionState(state) {
    if (!state) return;
    yaw = state.yaw ?? yaw;
    pitch = state.pitch ?? pitch;
    zoomCurrent = state.zoomCurrent ?? zoomCurrent;
    zoomTarget = zoomCurrent;
  }

  return Object.freeze({
    resize,
    setZoomBounds,
    setZoomAbsolute,
    adjustZoomBy,
    applyDrag,
    stepInertia,
    advanceOrbit,
    projectSphere,
    getCameraState,
    getMotionState,
    getOrbitalState,
    getProjectionSummary,
    setOrientation,
    setPresentationMode,
    restoreMotionState
  });
}
