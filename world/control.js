import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapAngle(value) {
  return Math.atan2(Math.sin(value), Math.cos(value));
}

function shortestAngleDelta(fromValue, toValue) {
  return wrapAngle(toValue - fromValue);
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

const SCOPE_TABLE = Object.freeze({
  UNIVERSE: Object.freeze({
    name: "UNIVERSE",
    sizeKm: 256000000000,
    anchor: "UNIVERSE_ORIGIN"
  }),
  GALAXY: Object.freeze({
    name: "GALAXY",
    sizeKm: 256000000,
    anchor: "GALAXY_ORIGIN"
  }),
  GLOBAL: Object.freeze({
    name: "GLOBAL",
    sizeKm: 256000,
    anchor: "EARTH"
  }),
  LOCAL: Object.freeze({
    name: "LOCAL",
    sizeKm: 25600,
    anchor: "EARTH"
  })
});

const LENS_MODE_TABLE = Object.freeze({
  STANDARD: true,
  ATMOSPHERIC: true
});

function isValidScopeName(value) {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(SCOPE_TABLE, value);
}

function getScopeConfig(scopeName) {
  return SCOPE_TABLE[isValidScopeName(scopeName) ? scopeName : "GLOBAL"];
}

function normalizeLensTier(value) {
  const next = Math.round(isFiniteNumber(value) ? value : 1);
  return clamp(next, 1, 3);
}

function normalizeLensMode(value) {
  return typeof value === "string" && LENS_MODE_TABLE[value] ? value : "STANDARD";
}

function getKernelConstants() {
  const constants = normalizeObject(WORLD_KERNEL?.constants);

  return Object.freeze({
    worldRadiusFactor: isFiniteNumber(constants.worldRadiusFactor) ? constants.worldRadiusFactor : 0.36,
    minPitch: isFiniteNumber(constants.minPitch) ? constants.minPitch : -(Math.PI / 2.2),
    maxPitch: isFiniteNumber(constants.maxPitch) ? constants.maxPitch : Math.PI / 2.2,
    initialYaw: isFiniteNumber(constants.initialYaw) ? constants.initialYaw : 0,
    initialPitch: isFiniteNumber(constants.initialPitch) ? constants.initialPitch : 0,
    dragSensitivity: isFiniteNumber(constants.dragSensitivity) ? constants.dragSensitivity : 0.0082,
    inertiaDecay: isFiniteNumber(constants.inertiaDecay) ? constants.inertiaDecay : 0.992,
    autoSpinSpeed: isFiniteNumber(constants.autoSpinSpeed) ? constants.autoSpinSpeed : 0.000045,
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

  const HOME_PITCH = clamp(
    isFiniteNumber(K.initialPitch) ? K.initialPitch : 0,
    K.minPitch,
    K.maxPitch
  );

  let homeYaw = wrapAngle(isFiniteNumber(K.initialYaw) ? K.initialYaw : 0);
  let homePitch = HOME_PITCH;

  let yaw = homeYaw;
  let pitch = homePitch;
  let yawVelocity = 0;
  let pitchVelocity = 0;
  let orbitPhase = 0;

  let zoomCurrent = 1;
  let zoomTarget = 1;
  let zoomMin = 1;
  let zoomMax = 1;

  let presentationMode = "round";

  let activeScope = "GLOBAL";
  let scopeSizeKm = getScopeConfig(activeScope).sizeKm;
  let scopeAnchor = getScopeConfig(activeScope).anchor;
  let scopeTransitionState = null;

  let lensTier = 1;
  let lensMode = "STANDARD";

  let autoSpinEnabled = true;
  let autoSpinSpeed = K.autoSpinSpeed;

  let recoveryEnabled = true;
  let recoveryYawStrength = 0.0025;
  let recoveryPitchStrength = 0.0018;
  let recoveryVelocityThreshold = 0.0014;

  const ZOOM_EASING = 0.12;

  const YAW_TRACK_GAIN = 0.88;
  const PITCH_TRACK_GAIN = 0.74;

  const DRAG_BLEND_YAW = 0.86;
  const DRAG_BLEND_PITCH = 0.90;

  const RELEASE_YAW_GAIN = 1.35;
  const RELEASE_PITCH_GAIN = 0.72;

  const MAX_RELEASE_YAW_IMPULSE = 0.085;
  const MAX_RELEASE_PITCH_IMPULSE = 0.045;

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

  let dragActive = false;
  let lastDragYawStep = 0;
  let lastDragPitchStep = 0;
  let smoothedDragYaw = 0;
  let smoothedDragPitch = 0;

  function clampPitch() {
    pitch = clamp(pitch, K.minPitch, K.maxPitch);
  }

  function clampZoomValue(value) {
    return clamp(value, zoomMin, zoomMax);
  }

  function getResolvedRadius() {
    return Math.max(1, cameraState.radius * zoomCurrent);
  }

  function applyScopeDefaults(scopeName) {
    const config = getScopeConfig(scopeName);
    activeScope = config.name;
    scopeSizeKm = config.sizeKm;
    scopeAnchor = config.anchor;
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

  function setAutoSpinEnabled(value) {
    autoSpinEnabled = value === true;
  }

  function setAutoSpinSpeed(value) {
    if (!isFiniteNumber(value)) return;
    autoSpinSpeed = value;
  }

  function setLensTier(value) {
    lensTier = normalizeLensTier(value);
    return getLensState();
  }

  function setLensMode(value) {
    lensMode = normalizeLensMode(value);
    return getLensState();
  }

  function getLensState() {
    return Object.freeze({
      lensTier,
      lensMode,
      zoomCurrent,
      zoomTarget,
      zoomMin,
      zoomMax
    });
  }

  function startDrag() {
    dragActive = true;
  }

  function endDrag() {
    if (!dragActive) return;
    releaseDrag();
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
    dragActive = true;

    const yawStep = deltaX * K.dragSensitivity * YAW_TRACK_GAIN;
    const pitchStep = deltaY * K.dragSensitivity * PITCH_TRACK_GAIN;

    yaw = wrapAngle(yaw + yawStep);
    pitch += pitchStep;
    clampPitch();

    lastDragYawStep = yawStep;
    lastDragPitchStep = pitchStep;

    smoothedDragYaw =
      smoothedDragYaw * DRAG_BLEND_YAW +
      yawStep * (1 - DRAG_BLEND_YAW);

    smoothedDragPitch =
      smoothedDragPitch * DRAG_BLEND_PITCH +
      pitchStep * (1 - DRAG_BLEND_PITCH);

    yawVelocity = smoothedDragYaw * 0.28;
    pitchVelocity = smoothedDragPitch * 0.16;
  }

  function releaseDrag() {
    dragActive = false;

    yawVelocity =
      yawVelocity * 0.30 +
      smoothedDragYaw * 0.85 +
      lastDragYawStep * RELEASE_YAW_GAIN;

    pitchVelocity =
      pitchVelocity * 0.22 +
      smoothedDragPitch * 0.38 +
      lastDragPitchStep * RELEASE_PITCH_GAIN;

    yawVelocity = clamp(yawVelocity, -MAX_RELEASE_YAW_IMPULSE, MAX_RELEASE_YAW_IMPULSE);
    pitchVelocity = clamp(pitchVelocity, -MAX_RELEASE_PITCH_IMPULSE, MAX_RELEASE_PITCH_IMPULSE);
  }

  function stepZoom() {
    zoomCurrent += (zoomTarget - zoomCurrent) * ZOOM_EASING;
    if (Math.abs(zoomTarget - zoomCurrent) < 0.0005) {
      zoomCurrent = zoomTarget;
    }
  }

  function applyRecovery(frameScale) {
    if (!recoveryEnabled) return;
    if (dragActive) return;

    const velocityMagnitude = Math.hypot(yawVelocity, pitchVelocity);
    if (velocityMagnitude > recoveryVelocityThreshold) return;

    const yawDeltaToHome = shortestAngleDelta(yaw, homeYaw);
    const pitchDeltaToHome = homePitch - pitch;

    yawVelocity += yawDeltaToHome * recoveryYawStrength * frameScale;
    pitchVelocity += pitchDeltaToHome * recoveryPitchStrength * frameScale;
  }

  function stepInertia(dtMs = 16.6667) {
    const frameScale = clamp(dtMs / 16.6667, 0.25, 2.5);

    if (!dragActive) {
      if (autoSpinEnabled) {
        homeYaw = wrapAngle(homeYaw + autoSpinSpeed * frameScale);
        yawVelocity += autoSpinSpeed * frameScale;
      }

      applyRecovery(frameScale);

      yaw = wrapAngle(yaw + yawVelocity * frameScale);
      pitch += pitchVelocity * frameScale;

      const decay = Math.pow(K.inertiaDecay, frameScale);
      yawVelocity *= decay;
      pitchVelocity *= decay;

      if (Math.abs(yawVelocity) < 0.00000005) yawVelocity = 0;
      if (Math.abs(pitchVelocity) < 0.00000005) pitchVelocity = 0;

      clampPitch();
    }

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

  function getScopeState() {
    return Object.freeze({
      activeScope,
      scopeSizeKm,
      scopeAnchor,
      scopeTransitionState
    });
  }

  function setActiveScope(scopeName) {
    if (!isValidScopeName(scopeName)) return getScopeState();
    applyScopeDefaults(scopeName);
    scopeTransitionState = null;
    return getScopeState();
  }

  function beginScopeTransition(targetScope) {
    if (!isValidScopeName(targetScope)) return getScopeState();

    scopeTransitionState = Object.freeze({
      fromScope: activeScope,
      toScope: targetScope,
      status: "TRANSITIONING"
    });

    return getScopeState();
  }

  function completeScopeTransition() {
    if (!scopeTransitionState || !isValidScopeName(scopeTransitionState.toScope)) {
      return getScopeState();
    }

    applyScopeDefaults(scopeTransitionState.toScope);
    scopeTransitionState = null;
    return getScopeState();
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
      mode: presentationMode,
      autoSpinEnabled,
      autoSpinSpeed,
      dragActive,
      inertiaDecay: K.inertiaDecay,
      homeYaw,
      homePitch,
      recoveryEnabled,
      recoveryYawStrength,
      recoveryPitchStrength,
      recoveryVelocityThreshold,
      activeScope,
      scopeSizeKm,
      scopeAnchor,
      scopeTransitionState,
      lensTier,
      lensMode
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
      mode: presentationMode,
      autoSpinEnabled,
      autoSpinSpeed,
      dragActive,
      inertiaDecay: K.inertiaDecay,
      homeYaw,
      homePitch,
      recoveryEnabled,
      recoveryYawStrength,
      recoveryPitchStrength,
      recoveryVelocityThreshold
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
    if (isFiniteNumber(next.homeYaw)) homeYaw = wrapAngle(next.homeYaw);
    if (isFiniteNumber(next.homePitch)) homePitch = clamp(next.homePitch, K.minPitch, K.maxPitch);
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
    if (typeof next.autoSpinEnabled === "boolean") autoSpinEnabled = next.autoSpinEnabled;
    if (isFiniteNumber(next.autoSpinSpeed)) autoSpinSpeed = next.autoSpinSpeed;
    if (typeof next.dragActive === "boolean") dragActive = next.dragActive;
    if (isFiniteNumber(next.homeYaw)) homeYaw = wrapAngle(next.homeYaw);
    if (isFiniteNumber(next.homePitch)) homePitch = clamp(next.homePitch, K.minPitch, K.maxPitch);
    if (typeof next.recoveryEnabled === "boolean") recoveryEnabled = next.recoveryEnabled;
    if (isFiniteNumber(next.recoveryYawStrength)) recoveryYawStrength = next.recoveryYawStrength;
    if (isFiniteNumber(next.recoveryPitchStrength)) recoveryPitchStrength = next.recoveryPitchStrength;
    if (isFiniteNumber(next.recoveryVelocityThreshold)) recoveryVelocityThreshold = Math.max(0, next.recoveryVelocityThreshold);

    if (isValidScopeName(next.activeScope)) {
      applyScopeDefaults(next.activeScope);
    }

    if (typeof next.scopeAnchor === "string" && next.scopeAnchor.length > 0) {
      scopeAnchor = next.scopeAnchor;
    }

    if (isFiniteNumber(next.scopeSizeKm)) {
      scopeSizeKm = next.scopeSizeKm;
    }

    if (next.scopeTransitionState && typeof next.scopeTransitionState === "object") {
      const sts = normalizeObject(next.scopeTransitionState);
      if (isValidScopeName(sts.fromScope) && isValidScopeName(sts.toScope)) {
        scopeTransitionState = Object.freeze({
          fromScope: sts.fromScope,
          toScope: sts.toScope,
          status: typeof sts.status === "string" ? sts.status : "TRANSITIONING"
        });
      }
    } else if (next.scopeTransitionState === null) {
      scopeTransitionState = null;
    }

    if (next.lensTier !== undefined) {
      lensTier = normalizeLensTier(next.lensTier);
    }

    if (next.lensMode !== undefined) {
      lensMode = normalizeLensMode(next.lensMode);
    }
  }

  applyScopeDefaults("GLOBAL");

  return Object.freeze({
    resize,
    setPresentationMode,
    setAutoSpinEnabled,
    setAutoSpinSpeed,
    setLensTier,
    setLensMode,
    getLensState,
    startDrag,
    endDrag,
    setZoomBounds,
    setZoomAbsolute,
    adjustZoomBy,
    applyDrag,
    releaseDrag,
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
    getMotionState,
    getScopeState,
    setActiveScope,
    beginScopeTransition,
    completeScopeTransition
  });
}

const DEFAULT_CONTROL_SYSTEM = createControlSystem();

export function projectSphere(latDeg, lonDeg, radiusOffsetPx = 0) {
  return DEFAULT_CONTROL_SYSTEM.projectSphere(latDeg, lonDeg, radiusOffsetPx);
}

export function inverseProjection(screenX, screenY) {
  return DEFAULT_CONTROL_SYSTEM.inverseProjection(screenX, screenY);
}
