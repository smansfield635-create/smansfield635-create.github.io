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

function getLocalGridCell(row, col) {
  const safeRow = clamp(row, 0, WORLD_KERNEL.constants.localGridRows - 1);
  const safeCol = clamp(col, 0, WORLD_KERNEL.constants.localGridCols - 1);
  const cellIndex = safeRow * WORLD_KERNEL.constants.localGridCols + safeCol;

  return Object.freeze({
    row: safeRow,
    col: safeCol,
    cellIndex,
    cellId: WORLD_KERNEL.localGrid.cellIds[cellIndex]
  });
}

export function createControlSystem() {
  let yaw = WORLD_KERNEL.constants.initialYaw;
  let pitch = WORLD_KERNEL.constants.initialPitch;
  let yawVelocity = 0;
  let pitchVelocity = 0;

  let orbitPhase = 0;
  let orbitAngularVelocity = 0.00018;
  let orbitPresentationVelocity = 0.00018;

  let presentationMode = "round";
  let observationMode = false;

  let zoomCurrent = 1;
  let zoomTarget = 1;

  const ZOOM_EASING = 0.12;
  const ROUND_ZOOM_MIN = 0.86;
  const ROUND_ZOOM_MAX = 1.52;
  const OBSERVE_ZOOM_MIN = 1.04;
  const OBSERVE_ZOOM_MAX = 1.34;

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
    row: 0,
    col: 0,
    cellIndex: 0,
    cellId: WORLD_KERNEL.localGrid.cellIds[0],
    sampleX: 0,
    sampleY: 0
  });

  function getZoomBounds(mode = presentationMode) {
    if (mode === "observe") {
      return Object.freeze({
        min: OBSERVE_ZOOM_MIN,
        max: OBSERVE_ZOOM_MAX
      });
    }

    if (mode === "flat") {
      return Object.freeze({
        min: 1,
        max: 1
      });
    }

    return Object.freeze({
      min: ROUND_ZOOM_MIN,
      max: ROUND_ZOOM_MAX
    });
  }

  function clampZoomForMode(value, mode = presentationMode) {
    const bounds = getZoomBounds(mode);
    return clamp(value, bounds.min, bounds.max);
  }

  function getResolvedRadius() {
    return Math.max(1, cameraState.radius * zoomCurrent);
  }

  function updatePresentationDerivedState() {
    observationMode = presentationMode === "observe";
    orbitPresentationVelocity = observationMode
      ? orbitAngularVelocity * 0.52
      : orbitAngularVelocity;
  }

  function forceModeZoomState() {
    if (presentationMode === "flat") {
      zoomCurrent = 1;
      zoomTarget = 1;
      return;
    }

    zoomCurrent = clampZoomForMode(zoomCurrent);
    zoomTarget = clampZoomForMode(zoomTarget);

    if (presentationMode === "observe" && zoomCurrent < OBSERVE_ZOOM_MIN) {
      zoomCurrent = OBSERVE_ZOOM_MIN;
    }

    if (presentationMode === "observe" && zoomTarget < OBSERVE_ZOOM_MIN) {
      zoomTarget = OBSERVE_ZOOM_MIN;
    }
  }

  function resize(width, height) {
    cameraState.width = width;
    cameraState.height = height;
    cameraState.centerX = width * 0.5;
    cameraState.centerY = height * 0.5;
    cameraState.radius = Math.min(width, height) * WORLD_KERNEL.constants.worldRadiusFactor;
  }

  function clampPitch() {
    pitch = clamp(
      pitch,
      WORLD_KERNEL.constants.minPitch,
      WORLD_KERNEL.constants.maxPitch
    );
  }

  function recomputeOrbitalVelocity() {
    const baseOrbitSpeed = 0.00018;
    const correlated =
      ((Math.abs(yawVelocity) + (Math.abs(pitchVelocity) * 0.5)) / 16.6667) * 0.95;

    orbitAngularVelocity = baseOrbitSpeed + correlated;
    updatePresentationDerivedState();
  }

  function applyDrag(deltaX, deltaY) {
    yaw = wrapAngle(yaw + deltaX * WORLD_KERNEL.constants.dragSensitivity);
    pitch += deltaY * WORLD_KERNEL.constants.dragSensitivity;

    yawVelocity = deltaX * WORLD_KERNEL.constants.dragSensitivity * 0.45;
    pitchVelocity = deltaY * WORLD_KERNEL.constants.dragSensitivity * 0.45;

    clampPitch();
    recomputeOrbitalVelocity();
  }

  function setZoomAbsolute(nextZoom) {
    if (presentationMode === "flat") return;

    zoomTarget = clampZoomForMode(nextZoom);
  }

  function adjustZoomBy(delta) {
    if (presentationMode === "flat") return;
    setZoomAbsolute(zoomTarget + delta);
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

    const decay = Math.pow(WORLD_KERNEL.constants.inertiaDecay, frameScale);
    yawVelocity *= decay;
    pitchVelocity *= decay;

    clampPitch();
    recomputeOrbitalVelocity();
    stepZoom();

    orbitPhase = wrapAngle(orbitPhase + orbitPresentationVelocity * dtMs);
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

    if (distanceSquared > 1) {
      return null;
    }

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

  function latLonToGrid(latDeg, lonDeg) {
    const width = WORLD_KERNEL.planetField.width;
    const height = WORLD_KERNEL.planetField.height;

    const normalizedLon = (wrapAngle((lonDeg * Math.PI) / 180) + Math.PI) / (Math.PI * 2);
    const normalizedLat = (latDeg + 90) / 180;

    const x = clamp(Math.floor(normalizedLon * width), 0, width - 1);
    const y = clamp(Math.floor((1 - normalizedLat) * height), 0, height - 1);

    return Object.freeze({ x, y });
  }

  function latLonToLocalGrid(latDeg, lonDeg) {
    const normalizedLon = (wrapAngle((lonDeg * Math.PI) / 180) + Math.PI) / (Math.PI * 2);
    const normalizedLat = (latDeg + 90) / 180;

    const row = clamp(
      Math.floor((1 - normalizedLat) * WORLD_KERNEL.constants.localGridRows),
      0,
      WORLD_KERNEL.constants.localGridRows - 1
    );

    const col = clamp(
      Math.floor(normalizedLon * WORLD_KERNEL.constants.localGridCols),
      0,
      WORLD_KERNEL.constants.localGridCols - 1
    );

    return getLocalGridCell(row, col);
  }

  function inverseProjection(screenX, screenY) {
    const bodyPoint = screenPointToNormalizedBody(screenX, screenY);
    if (!bodyPoint) return null;

    const latLon = bodyPointToLatLon(bodyPoint);
    if (!latLon) return null;

    const sampleIndex = latLonToGrid(latLon.latDeg, latLon.lonDeg);
    const localGrid = latLonToLocalGrid(latLon.latDeg, latLon.lonDeg);

    return Object.freeze({
      screenX,
      screenY,
      bodyPoint,
      latDeg: latLon.latDeg,
      lonDeg: latLon.lonDeg,
      visible: bodyPoint.visible,
      horizonExcluded: !bodyPoint.visible,
      sampleX: sampleIndex.x,
      sampleY: sampleIndex.y,
      row: localGrid.row,
      col: localGrid.col,
      cellIndex: localGrid.cellIndex,
      cellId: localGrid.cellId
    });
  }

  function updateSelection(screenX = cameraState.centerX, screenY = cameraState.centerY) {
    const result = inverseProjection(screenX, screenY);

    if (!result) {
      return selectionState;
    }

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
      mode: presentationMode,
      observationMode,
      zoomCurrent,
      zoomTarget
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
      orbitPhase,
      orbitAngularVelocity,
      orbitPresentationVelocity,
      correlatedFromGlobe:
        ((Math.abs(yawVelocity) + (Math.abs(pitchVelocity) * 0.5)) / 16.6667) * 0.95
    });
  }

  function getMotionState() {
    return Object.freeze({
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity,
      orbitPhase,
      orbitAngularVelocity,
      orbitVelocity: orbitAngularVelocity,
      orbitPresentationVelocity,
      mode: presentationMode,
      observationMode,
      zoomCurrent,
      zoomTarget
    });
  }

  function setPresentationMode(mode = "round") {
    const next =
      mode === "flat" || mode === "round" || mode === "observe"
        ? mode
        : "round";

    presentationMode = next;
    updatePresentationDerivedState();
    forceModeZoomState();
  }

  function setOrientation(input = {}) {
    const next = normalizeObject(input);

    if (isFiniteNumber(next.yaw)) {
      yaw = wrapAngle(next.yaw);
    }
    if (isFiniteNumber(next.pitch)) {
      pitch = next.pitch;
      clampPitch();
    }
    if (isFiniteNumber(next.yawVelocity)) {
      yawVelocity = next.yawVelocity;
    }
    if (isFiniteNumber(next.pitchVelocity)) {
      pitchVelocity = next.pitchVelocity;
    }
    if (isFiniteNumber(next.zoomCurrent)) {
      zoomCurrent = clampZoomForMode(next.zoomCurrent);
    }
    if (isFiniteNumber(next.zoomTarget)) {
      zoomTarget = clampZoomForMode(next.zoomTarget);
    }
    recomputeOrbitalVelocity();
    forceModeZoomState();
  }

  function restoreMotionState(input = {}) {
    const next = normalizeObject(input);

    if (typeof next.mode === "string") {
      setPresentationMode(next.mode);
    } else {
      setPresentationMode("round");
    }

    if (isFiniteNumber(next.yaw)) yaw = wrapAngle(next.yaw);
    if (isFiniteNumber(next.pitch)) {
      pitch = clamp(next.pitch, WORLD_KERNEL.constants.minPitch, WORLD_KERNEL.constants.maxPitch);
    }
    if (isFiniteNumber(next.yawVelocity)) yawVelocity = next.yawVelocity;
    if (isFiniteNumber(next.pitchVelocity)) pitchVelocity = next.pitchVelocity;
    if (isFiniteNumber(next.orbitPhase)) orbitPhase = wrapAngle(next.orbitPhase);
    if (isFiniteNumber(next.orbitAngularVelocity)) orbitAngularVelocity = next.orbitAngularVelocity;
    if (isFiniteNumber(next.zoomCurrent)) zoomCurrent = clampZoomForMode(next.zoomCurrent);
    if (isFiniteNumber(next.zoomTarget)) zoomTarget = clampZoomForMode(next.zoomTarget);

    clampPitch();
    recomputeOrbitalVelocity();
    forceModeZoomState();
  }

  updatePresentationDerivedState();
  forceModeZoomState();

  return Object.freeze({
    resize,
    applyDrag,
    stepInertia,
    setOrientation,
    setPresentationMode,
    restoreMotionState,
    projectSphere,
    inverseProjection,
    updateSelection,
    getCameraState,
    getProjectionSummary,
    getCardinals,
    getOrbitalState,
    getMotionState,
    setZoomAbsolute,
    adjustZoomBy,
    getZoomBounds
  });
}

const DEFAULT_CONTROL_SYSTEM = createControlSystem();

export function projectSphere(latDeg, lonDeg, radiusOffsetPx = 0) {
  return DEFAULT_CONTROL_SYSTEM.projectSphere(latDeg, lonDeg, radiusOffsetPx);
}

export function inverseProjection(screenX, screenY) {
  return DEFAULT_CONTROL_SYSTEM.inverseProjection(screenX, screenY);
}
