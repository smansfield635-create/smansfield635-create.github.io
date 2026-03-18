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

function normalizeMode(value) {
  return value === "flat" ? "flat" : "round";
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
  let mode = "round";

  let yaw = WORLD_KERNEL.constants.initialYaw;
  let pitch = WORLD_KERNEL.constants.initialPitch;

  let yawVelocity = 0;
  let pitchVelocity = 0;

  let orbitPhase = 0;
  let orbitAngularVelocity = 0.00018;
  let orbitPresentationVelocity = 0.00018;

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
    sampleY: 0,
    visible: true,
    horizonExcluded: false
  });

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
    orbitPresentationVelocity = baseOrbitSpeed + correlated * 0.65;
  }

  function setMode(nextMode = "round") {
    mode = normalizeMode(nextMode);

    if (mode === "flat") {
      yawVelocity = 0;
      pitchVelocity = 0;
      orbitAngularVelocity = 0;
      orbitPresentationVelocity = 0;
    } else {
      recomputeOrbitalVelocity();
    }

    return mode;
  }

  function applyDrag(deltaX, deltaY) {
    if (mode !== "round") {
      return getMotionState();
    }

    yaw = wrapAngle(yaw + deltaX * WORLD_KERNEL.constants.dragSensitivity);
    pitch += deltaY * WORLD_KERNEL.constants.dragSensitivity;

    yawVelocity = deltaX * WORLD_KERNEL.constants.dragSensitivity * 0.45;
    pitchVelocity = deltaY * WORLD_KERNEL.constants.dragSensitivity * 0.45;

    clampPitch();
    recomputeOrbitalVelocity();

    return getMotionState();
  }

  function stepInertia(dtMs = 16.6667) {
    if (mode !== "round") {
      return getMotionState();
    }

    const frameScale = clamp(dtMs / 16.6667, 0.25, 4);

    yaw = wrapAngle(yaw + yawVelocity * frameScale);
    pitch += pitchVelocity * frameScale;

    const decay = Math.pow(WORLD_KERNEL.constants.inertiaDecay, frameScale);
    yawVelocity *= decay;
    pitchVelocity *= decay;

    clampPitch();
    recomputeOrbitalVelocity();

    orbitPhase = wrapAngle(orbitPhase + orbitAngularVelocity * dtMs);

    return getMotionState();
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
    if (mode !== "round") {
      const resolvedRadius = Math.max(1, cameraState.radius + radiusOffsetPx);
      const x = cameraState.centerX + ((lonDeg / 180) * resolvedRadius * 0.92);
      const y = cameraState.centerY - ((latDeg / 90) * resolvedRadius * 0.92);

      return Object.freeze({
        x,
        y,
        z: 1,
        visible: true,
        horizonExcluded: false,
        resolvedRadius,
        radiusOffsetPx
      });
    }

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

    const resolvedRadius = Math.max(1, cameraState.radius + radiusOffsetPx);

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
    if (!cameraState.radius) return null;

    const dx = (screenX - cameraState.centerX) / cameraState.radius;
    const dy = -(screenY - cameraState.centerY) / cameraState.radius;
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
    if (mode !== "round") {
      if (!cameraState.radius) return null;

      const dx = (screenX - cameraState.centerX) / (cameraState.radius * 0.92);
      const dy = -(screenY - cameraState.centerY) / (cameraState.radius * 0.92);

      const lonDeg = clamp(dx * 180, -180, 180);
      const latDeg = clamp(dy * 90, -90, 90);

      const sampleIndex = latLonToGrid(latDeg, lonDeg);
      const localGrid = latLonToLocalGrid(latDeg, lonDeg);

      return Object.freeze({
        screenX,
        screenY,
        bodyPoint: Object.freeze({ x: dx, y: dy, z: 1, visible: true }),
        latDeg,
        lonDeg,
        visible: true,
        horizonExcluded: false,
        sampleX: sampleIndex.x,
        sampleY: sampleIndex.y,
        row: localGrid.row,
        col: localGrid.col,
        cellIndex: localGrid.cellIndex,
        cellId: localGrid.cellId
      });
    }

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
      cellId: result.cellId,
      visible: result.visible,
      horizonExcluded: result.horizonExcluded
    });

    return selectionState;
  }

  function classifyPointerTarget(screenX, screenY, orbitalHits = []) {
    const dx = screenX - cameraState.centerX;
    const dy = screenY - cameraState.centerY;
    const radialDistance = Math.sqrt(dx * dx + dy * dy);

    for (let i = orbitalHits.length - 1; i >= 0; i -= 1) {
      const hit = orbitalHits[i];
      const hx = screenX - hit.x;
      const hy = screenY - hit.y;
      const d = Math.sqrt(hx * hx + hy * hy);
      if (d <= hit.radius) {
        return Object.freeze({
          family: "orbital",
          id: hit.id,
          label: hit.label,
          route: hit.route
        });
      }
    }

    if (mode === "round" && radialDistance <= cameraState.radius) {
      return Object.freeze({
        family: "globe",
        id: "planet_body"
      });
    }

    if (mode === "flat") {
      return Object.freeze({
        family: "flat_surface",
        id: "flat_projection"
      });
    }

    return Object.freeze({
      family: "ui_or_void",
      id: "ui_or_void"
    });
  }

  function getCameraState() {
    return Object.freeze({
      width: cameraState.width,
      height: cameraState.height,
      centerX: cameraState.centerX,
      centerY: cameraState.centerY,
      radius: cameraState.radius,
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity,
      mode
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
      mode
    });
  }

  function getCardinals() {
    if (mode !== "round") {
      return Object.freeze({
        heading: "N",
        north: 1,
        south: 0,
        east: 0,
        west: 0
      });
    }

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
        ((Math.abs(yawVelocity) + (Math.abs(pitchVelocity) * 0.5)) / 16.6667) * 0.95,
      mode
    });
  }

  function getMotionState() {
    return Object.freeze({
      mode,
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity,
      orbitPhase,
      orbitAngularVelocity,
      orbitPresentationVelocity
    });
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
    if (typeof next.mode === "string") {
      setMode(next.mode);
    }

    recomputeOrbitalVelocity();
  }

  function restoreMotionState(input = {}) {
    const next = normalizeObject(input);

    if (typeof next.mode === "string") mode = normalizeMode(next.mode);
    if (isFiniteNumber(next.yaw)) yaw = wrapAngle(next.yaw);
    if (isFiniteNumber(next.pitch)) pitch = clamp(next.pitch, WORLD_KERNEL.constants.minPitch, WORLD_KERNEL.constants.maxPitch);
    if (isFiniteNumber(next.yawVelocity)) yawVelocity = next.yawVelocity;
    if (isFiniteNumber(next.pitchVelocity)) pitchVelocity = next.pitchVelocity;
    if (isFiniteNumber(next.orbitPhase)) orbitPhase = wrapAngle(next.orbitPhase);
    if (isFiniteNumber(next.orbitAngularVelocity)) orbitAngularVelocity = Math.max(0, next.orbitAngularVelocity);
    if (isFiniteNumber(next.orbitPresentationVelocity)) orbitPresentationVelocity = Math.max(0, next.orbitPresentationVelocity);

    clampPitch();

    if (mode === "round") {
      recomputeOrbitalVelocity();
    } else {
      yawVelocity = 0;
      pitchVelocity = 0;
      orbitAngularVelocity = 0;
      orbitPresentationVelocity = 0;
    }
  }

  function buildTransitionHandoff(input = {}) {
    const next = normalizeObject(input);

    return Object.freeze({
      fromMode: mode,
      toMode: typeof next.toMode === "string" ? normalizeMode(next.toMode) : mode,
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity,
      orbitPhase,
      orbitAngularVelocity,
      orbitPresentationVelocity,
      projection: getProjectionSummary()
    });
  }

  return Object.freeze({
    resize,
    setMode,
    applyDrag,
    stepInertia,
    setOrientation,
    restoreMotionState,
    buildTransitionHandoff,
    classifyPointerTarget,
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
