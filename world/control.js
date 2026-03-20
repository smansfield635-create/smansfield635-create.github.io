// DESTINATION FILE: /world/control.js

import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapAngle(value) {
  return Math.atan2(Math.sin(value), Math.cos(value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function getKernelConstants() {
  const constants = normalizeObject(WORLD_KERNEL?.constants);

  return Object.freeze({
    worldRadiusFactor: isFiniteNumber(constants.worldRadiusFactor) ? constants.worldRadiusFactor : 0.36,
    minPitch: isFiniteNumber(constants.minPitch) ? constants.minPitch : -(Math.PI / 2.2),
    maxPitch: isFiniteNumber(constants.maxPitch) ? constants.maxPitch : Math.PI / 2.2,
    initialYaw: isFiniteNumber(constants.initialYaw) ? constants.initialYaw : 0,
    initialPitch: isFiniteNumber(constants.initialPitch) ? constants.initialPitch : 0,
    dragSensitivity: isFiniteNumber(constants.dragSensitivity) ? constants.dragSensitivity : 0.0065,
    inertiaDecay: isFiniteNumber(constants.inertiaDecay) ? constants.inertiaDecay : 0.85,
    latSteps: Number.isInteger(constants.latSteps) ? constants.latSteps : 108,
    lonSteps: Number.isInteger(constants.lonSteps) ? constants.lonSteps : 216
  });
}

function getPlanetFieldShape() {
  const kernel = normalizeObject(WORLD_KERNEL);
  const constants = getKernelConstants();

  const rootWidth = Number.isInteger(kernel.width) ? kernel.width : null;
  const rootHeight = Number.isInteger(kernel.height) ? kernel.height : null;

  const planetField = normalizeObject(kernel.planetField);
  const fieldWidth = Number.isInteger(planetField.width) ? planetField.width : null;
  const fieldHeight = Number.isInteger(planetField.height) ? planetField.height : null;

  return Object.freeze({
    width: rootWidth ?? fieldWidth ?? constants.lonSteps,
    height: rootHeight ?? fieldHeight ?? constants.latSteps
  });
}

function latLonToSample(latDeg, lonDeg) {
  const shape = getPlanetFieldShape();

  const normalizedLon = (wrapAngle((lonDeg * Math.PI) / 180) + Math.PI) / (Math.PI * 2);
  const normalizedLat = (90 - latDeg) / 180;

  const sampleX = clamp(Math.floor(normalizedLon * shape.width), 0, shape.width - 1);
  const sampleY = clamp(Math.floor(normalizedLat * shape.height), 0, shape.height - 1);

  return Object.freeze({
    sampleX,
    sampleY
  });
}

export function createControlSystem() {
  const K = getKernelConstants();

  let yaw = K.initialYaw;
  let pitch = K.initialPitch;
  let yawVelocity = 0;
  let pitchVelocity = 0;
  let orbitPhase = 0;

  let zoomCurrent = 1;
  let zoomTarget = 1;
  let zoomMin = 1;
  let zoomMax = 1;

  let presentationMode = "round";

  const ZOOM_EASING = 0.12;

  const cameraState = {
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    radius: 0
  };

  let selectionState = Object.freeze({
    screenX: 0,
    screenY: 0,
    latDeg: 0,
    lonDeg: 0,
    sampleX: 0,
    sampleY: 0,
    row: 0,
    col: 0,
    cellIndex: 0,
    cellId: "0:0"
  });

  function clampPitch() {
    pitch = clamp(pitch, K.minPitch, K.maxPitch);
  }

  function clampZoomValue(value) {
    return clamp(value, zoomMin, zoomMax);
  }

  function getResolvedRadius() {
    return Math.max(1, cameraState.radius * zoomCurrent);
  }

  function resize(width, height) {
    cameraState.width = width;
    cameraState.height = height;
    cameraState.centerX = width * 0.5;
    cameraState.centerY = height * 0.5;
    cameraState.radius = Math.min(width, height) * K.worldRadiusFactor;
  }

  function setPresentationMode(mode = "round") {
    presentationMode =
      mode === "flat" || mode === "round" || mode === "observe"
        ? mode
        : "round";
  }

  function setZoomBounds(min, max) {
    if (!isFiniteNumber(min) || !isFiniteNumber(max)) return;
    zoomMin = Math.min(min, max);
    zoomMax = Math.max(min, max);
    zoomCurrent = clampZoomValue(zoomCurrent);
    zoomTarget = clampZoomValue(zoomTarget);
  }

  function setZoomAbsolute(nextZoom) {
    if (!isFiniteNumber(nextZoom)) return;
    zoomTarget = clampZoomValue(nextZoom);
  }

  function adjustZoomBy(delta) {
    if (!isFiniteNumber(delta)) return;
    setZoomAbsolute(zoomTarget + delta);
  }

  function applyDrag(deltaX, deltaY) {
    yaw = wrapAngle(yaw + deltaX * K.dragSensitivity);
    pitch += deltaY * K.dragSensitivity;

    yawVelocity = deltaX * K.dragSensitivity * 0.45;
    pitchVelocity = deltaY * K.dragSensitivity * 0.45;

    clampPitch();
  }

  function stepZoom() {
    zoomCurrent += (zoomTarget - zoomCurrent) * ZOOM_EASING;
    if (Math.abs(zoomTarget - zoomCurrent) < 0.0005) {
      zoomCurrent = zoomTarget;
    }
  }

  function stepInertia(dtMs = 16.6667) {
    const frameScale = clamp(dtMs / 16.6667, 0.25, 4);

    yaw = wrapAngle(yaw + yawVelocity * frameScale);
    pitch += pitchVelocity * frameScale;

    const decay = Math.pow(K.inertiaDecay, frameScale);
    yawVelocity *= decay;
    pitchVelocity *= decay;

    clampPitch();
    stepZoom();
  }

  function advanceOrbit(dtMs = 16.6667, angularVelocity = 0) {
    const velocity = isFiniteNumber(angularVelocity) ? angularVelocity : 0;
    orbitPhase = wrapAngle(orbitPhase + velocity * dtMs);
  }

  function getBasis() {
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    return Object.freeze({
      cosPitch,
      sinPitch
    });
  }

  function projectSphere(latDeg, lonDeg, radiusOffsetPx = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;

    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const cosLon = Math.cos(lon + yaw);
    const sinLon = Math.sin(lon + yaw);

    const { cosPitch, sinPitch } = getBasis();

    const x = cosLat * sinLon;
    const y0 = sinLat;
    const z0 = cosLat * cosLon;

    const y = y0 * cosPitch - z0 * sinPitch;
    const z = y0 * sinPitch + z0 * cosPitch;

    const resolvedRadius = Math.max(1, getResolvedRadius() + radiusOffsetPx);

    return Object.freeze({
      x: cameraState.centerX + x * resolvedRadius,
      y: cameraState.centerY - y * resolvedRadius,
      z,
      visible: z >= 0,
      horizonExcluded: z < 0,
      resolvedRadius,
      radiusOffsetPx
    });
  }

  function screenPointToNormalizedBody(screenX, screenY) {
    const resolvedRadius = getResolvedRadius();
    if (!resolvedRadius) return null;

    const dx = (screenX - cameraState.centerX) / resolvedRadius;
    const dy = -(screenY - cameraState.centerY) / resolvedRadius;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared > 1) return null;

    const dz = Math.sqrt(Math.max(0, 1 - distanceSquared));

    return Object.freeze({
      x: dx,
      y: dy,
      z: dz,
      visible: dz >= 0
    });
  }

  function bodyPointToLatLon(bodyPoint) {
    if (!bodyPoint) return null;

    const { cosPitch, sinPitch } = getBasis();

    const x = bodyPoint.x;
    const y = bodyPoint.y * cosPitch + bodyPoint.z * sinPitch;
    const z = -bodyPoint.y * sinPitch + bodyPoint.z * cosPitch;

    const lon = wrapAngle(Math.atan2(x, z) - yaw);
    const lat = Math.asin(clamp(y, -1, 1));

    return Object.freeze({
      latDeg: (lat * 180) / Math.PI,
      lonDeg: (lon * 180) / Math.PI
    });
  }

  function inverseProjection(screenX, screenY) {
    const bodyPoint = screenPointToNormalizedBody(screenX, screenY);
    if (!bodyPoint) return null;

    const latLon = bodyPointToLatLon(bodyPoint);
    if (!latLon) return null;

    const sample = latLonToSample(latLon.latDeg, latLon.lonDeg);
    const shape = getPlanetFieldShape();

    return Object.freeze({
      screenX,
      screenY,
      bodyPoint,
      latDeg: latLon.latDeg,
      lonDeg: latLon.lonDeg,
      visible: bodyPoint.visible,
      horizonExcluded: !bodyPoint.visible,
      sampleX: sample.sampleX,
      sampleY: sample.sampleY,
      row: sample.sampleY,
      col: sample.sampleX,
      cellIndex: sample.sampleY * shape.width + sample.sampleX,
      cellId: `${sample.sampleY}:${sample.sampleX}`
    });
  }

  function updateSelection(screenX = cameraState.centerX, screenY = cameraState.centerY) {
    const result = inverseProjection(screenX, screenY);
    if (!result) return selectionState;

    selectionState = Object.freeze({
      screenX: result.screenX,
      screenY: result.screenY,
      latDeg: result.latDeg,
      lonDeg: result.lonDeg,
      sampleX: result.sampleX,
      sampleY: result.sampleY,
      row: result.row,
      col: result.col,
      cellIndex: result.cellIndex,
      cellId: result.cellId
    });

    return selectionState;
  }

  function getCameraState() {
    return Object.freeze({
      width: cameraState.width,
      height: cameraState.height,
      centerX: cameraState.centerX,
      centerY: cameraState.centerY,
      radius: getResolvedRadius(),
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity,
      zoomCurrent,
      zoomTarget,
      zoomMin,
      zoomMax,
      mode: presentationMode
    });
  }

  function getProjectionSummary() {
    const centerSelection = updateSelection(cameraState.centerX, cameraState.centerY);

    return Object.freeze({
      latDeg: centerSelection.latDeg,
      lonDeg: centerSelection.lonDeg,
      sampleX: centerSelection.sampleX,
      sampleY: centerSelection.sampleY,
      row: centerSelection.row,
      col: centerSelection.col,
      cellIndex: centerSelection.cellIndex,
      cellId: centerSelection.cellId,
      mode: presentationMode
    });
  }

  function getCardinals() {
    const normalizedYaw = wrapAngle(yaw);
    const north = Math.max(0, Math.cos(pitch));
    const south = Math.max(0, -Math.sin(pitch));
    const east = Math.max(0, Math.sin(normalizedYaw));
    const west = Math.max(0, -Math.sin(normalizedYaw));

    let heading = "N";
    if (east > west && east > north && east > south) heading = "E";
    else if (west > east && west > north && west > south) heading = "W";
    else if (south > north && south > east && south > west) heading = "S";

    return Object.freeze({
      heading,
      north,
      south,
      east,
      west
    });
  }

  function getOrbitalState() {
    return Object.freeze({
      orbitPhase
    });
  }

  function getMotionState() {
    return Object.freeze({
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity,
      orbitPhase,
      zoomCurrent,
      zoomTarget,
      zoomMin,
      zoomMax,
      mode: presentationMode
    });
  }

  function setOrientation(input = {}) {
    const next = normalizeObject(input);

    if (isFiniteNumber(next.yaw)) yaw = wrapAngle(next.yaw);
    if (isFiniteNumber(next.pitch)) {
      pitch = next.pitch;
      clampPitch();
    }
    if (isFiniteNumber(next.yawVelocity)) yawVelocity = next.yawVelocity;
    if (isFiniteNumber(next.pitchVelocity)) pitchVelocity = next.pitchVelocity;
    if (isFiniteNumber(next.zoomCurrent)) zoomCurrent = clampZoomValue(next.zoomCurrent);
    if (isFiniteNumber(next.zoomTarget)) zoomTarget = clampZoomValue(next.zoomTarget);
    if (isFiniteNumber(next.orbitPhase)) orbitPhase = wrapAngle(next.orbitPhase);
  }

  function restoreMotionState(input = {}) {
    const next = normalizeObject(input);

    if (typeof next.mode === "string") {
      setPresentationMode(next.mode);
    }

    if (isFiniteNumber(next.yaw)) yaw = wrapAngle(next.yaw);
    if (isFiniteNumber(next.pitch)) {
      pitch = clamp(next.pitch, K.minPitch, K.maxPitch);
    }
    if (isFiniteNumber(next.yawVelocity)) yawVelocity = next.yawVelocity;
    if (isFiniteNumber(next.pitchVelocity)) pitchVelocity = next.pitchVelocity;
    if (isFiniteNumber(next.orbitPhase)) orbitPhase = wrapAngle(next.orbitPhase);
    if (isFiniteNumber(next.zoomCurrent)) zoomCurrent = clampZoomValue(next.zoomCurrent);
    if (isFiniteNumber(next.zoomTarget)) zoomTarget = clampZoomValue(next.zoomTarget);
  }

  return Object.freeze({
    resize,
    setPresentationMode,
    setZoomBounds,
    setZoomAbsolute,
    adjustZoomBy,
    applyDrag,
    stepInertia,
    advanceOrbit,
    setOrientation,
    restoreMotionState,
    projectSphere,
    inverseProjection,
    updateSelection,
    getCameraState,
    getProjectionSummary,
    getCardinals,
    getOrbitalState,
    getMotionState
  });
}

const DEFAULT_CONTROL_SYSTEM = createControlSystem();

export function projectSphere(latDeg, lonDeg, radiusOffsetPx = 0) {
  return DEFAULT_CONTROL_SYSTEM.projectSphere(latDeg, lonDeg, radiusOffsetPx);
}

export function inverseProjection(screenX, screenY) {
  return DEFAULT_CONTROL_SYSTEM.inverseProjection(screenX, screenY);
}
