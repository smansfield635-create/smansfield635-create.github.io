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

    // 🔥 TUNED FOR REAL GLOBE PHYSICS
    dragSensitivity: isFiniteNumber(constants.dragSensitivity) ? constants.dragSensitivity : 0.012,
    inertiaDecay: isFiniteNumber(constants.inertiaDecay) ? constants.inertiaDecay : 0.975,

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

  function clampPitch() {
    pitch = clamp(pitch, K.minPitch, K.maxPitch);
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

  // 🔥 CORE FIX — TRUE MOMENTUM MODEL
  function applyDrag(deltaX, deltaY) {
    const dx = deltaX * K.dragSensitivity;
    const dy = deltaY * K.dragSensitivity;

    // Immediate response
    yaw = wrapAngle(yaw + dx);
    pitch += dy;

    // 🔥 ACCUMULATE momentum instead of overwrite
    yawVelocity += dx * 1.4;
    pitchVelocity += dy * 1.4;

    // Clamp to prevent runaway spin
    yawVelocity = clamp(yawVelocity, -0.08, 0.08);
    pitchVelocity = clamp(pitchVelocity, -0.08, 0.08);

    clampPitch();
  }

  function stepZoom() {
    zoomCurrent += (zoomTarget - zoomCurrent) * ZOOM_EASING;
    if (Math.abs(zoomTarget - zoomCurrent) < 0.0005) {
      zoomCurrent = zoomTarget;
    }
  }

  // 🔥 CORE FIX — NATURAL DECAY (NO HARD STOP)
  function stepInertia(dtMs = 16.6667) {
    const frameScale = clamp(dtMs / 16.6667, 0.25, 4);

    yaw = wrapAngle(yaw + yawVelocity * frameScale);
    pitch += pitchVelocity * frameScale;

    const decay = Math.pow(K.inertiaDecay, frameScale);
    yawVelocity *= decay;
    pitchVelocity *= decay;

    // ❌ REMOVED hard cutoff → preserves natural glide

    clampPitch();
    stepZoom();
  }

  function projectSphere(latDeg, lonDeg, radiusOffsetPx = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;

    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    const cosLon = Math.cos(lon + yaw);
    const sinLon = Math.sin(lon + yaw);

    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    const x = cosLat * sinLon;
    const y0 = sinLat;
    const z0 = cosLat * cosLon;

    const y = y0 * cosPitch - z0 * sinPitch;
    const z = y0 * sinPitch + z0 * cosPitch;

    const resolvedRadius = Math.max(1, getResolvedRadius() + radiusOffsetPx);

    return {
      x: cameraState.centerX + x * resolvedRadius,
      y: cameraState.centerY - y * resolvedRadius,
      z,
      visible: z >= 0
    };
  }

  function getCameraState() {
    return {
      width: cameraState.width,
      height: cameraState.height,
      centerX: cameraState.centerX,
      centerY: cameraState.centerY,
      radius: getResolvedRadius(),
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity
    };
  }

  return Object.freeze({
    resize,
    applyDrag,
    stepInertia,
    projectSphere,
    getCameraState
  });
}

const DEFAULT_CONTROL_SYSTEM = createControlSystem();

export function projectSphere(latDeg, lonDeg, radiusOffsetPx = 0) {
  return DEFAULT_CONTROL_SYSTEM.projectSphere(latDeg, lonDeg, radiusOffsetPx);
}
