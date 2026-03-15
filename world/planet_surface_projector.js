import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapAngle(value) {
  return Math.atan2(Math.sin(value), Math.cos(value));
}

export function createPlanetSurfaceProjector() {
  let yaw = WORLD_KERNEL.constants.initialYaw;
  let pitch = WORLD_KERNEL.constants.initialPitch;
  let yawVelocity = 0;
  let pitchVelocity = 0;

  const state = {
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    radius: 0
  };

  function resize(width, height) {
    state.width = width;
    state.height = height;
    state.centerX = width * 0.5;
    state.centerY = height * 0.5;
    state.radius = Math.min(width, height) * WORLD_KERNEL.constants.worldRadiusFactor;
  }

  function clampPitch() {
    pitch = clamp(pitch, WORLD_KERNEL.constants.minPitch, WORLD_KERNEL.constants.maxPitch);
  }

  function applyDrag(deltaX, deltaY) {
    yaw = wrapAngle(yaw + deltaX * WORLD_KERNEL.constants.dragSensitivity);
    pitch += deltaY * WORLD_KERNEL.constants.dragSensitivity;
    yawVelocity = deltaX * WORLD_KERNEL.constants.dragSensitivity * 0.45;
    pitchVelocity = deltaY * WORLD_KERNEL.constants.dragSensitivity * 0.45;
    clampPitch();
  }

  function stepInertia() {
    yaw = wrapAngle(yaw + yawVelocity);
    pitch += pitchVelocity;
    yawVelocity *= WORLD_KERNEL.constants.inertiaDecay;
    pitchVelocity *= WORLD_KERNEL.constants.inertiaDecay;
    clampPitch();
  }

  function getBasis() {
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    return Object.freeze({
      cosPitch,
      sinPitch
    });
  }

  function computeProjectedPoint(lon, lat, radiusOffsetPx = 0) {
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

    const resolvedRadius = Math.max(1, state.radius + radiusOffsetPx);

    return Object.freeze({
      x: state.centerX + x * resolvedRadius,
      y: state.centerY - y * resolvedRadius,
      z,
      visible: z >= 0,
      horizonExcluded: z < 0,
      radiusOffsetPx,
      resolvedRadius
    });
  }

  function projectSphere(lon, lat) {
    return computeProjectedPoint(lon, lat, 0);
  }

  function projectSphereWithOffset(lon, lat, radiusOffsetPx = 0) {
    return computeProjectedPoint(lon, lat, radiusOffsetPx);
  }

  function screenPointToNormalizedBody(x, y) {
    const dx = (x - state.centerX) / state.radius;
    const dy = -(y - state.centerY) / state.radius;
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

  function bodyPointToLonLat(bodyPoint) {
    if (!bodyPoint) return null;

    const { cosPitch, sinPitch } = getBasis();
    const x = bodyPoint.x;
    const y = bodyPoint.y * cosPitch + bodyPoint.z * sinPitch;
    const z = -bodyPoint.y * sinPitch + bodyPoint.z * cosPitch;

    const lon = wrapAngle(Math.atan2(x, z) - yaw);
    const lat = Math.asin(clamp(y, -1, 1));

    return Object.freeze({ lon, lat });
  }

  function inverseProject(screenX, screenY) {
    const bodyPoint = screenPointToNormalizedBody(screenX, screenY);
    if (!bodyPoint) return null;

    const lonLat = bodyPointToLonLat(bodyPoint);
    if (!lonLat) return null;

    return Object.freeze({
      screenX,
      screenY,
      bodyPoint,
      lon: lonLat.lon,
      lat: lonLat.lat,
      visible: bodyPoint.visible,
      horizonExcluded: !bodyPoint.visible
    });
  }

  function lonLatToSurfaceCoordinates(lon, lat) {
    const normalizedLon = (wrapAngle(lon) + Math.PI) / (Math.PI * 2);
    const normalizedLat = (lat + Math.PI / 2) / Math.PI;

    return Object.freeze({
      u: clamp(normalizedLon, 0, 1),
      v: clamp(1 - normalizedLat, 0, 1)
    });
  }

  function surfaceCoordinatesToLocalCell(surfaceCoordinates) {
    const row = clamp(Math.floor(surfaceCoordinates.v * 4), 0, 3);
    const col = clamp(Math.floor(surfaceCoordinates.u * 4), 0, 3);
    const cellIndex = row * 4 + col;

    return Object.freeze({
      row,
      col,
      cellIndex,
      cellId: WORLD_KERNEL.localGrid.cellIds[cellIndex]
    });
  }

  function getCardinalWeights() {
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

  function getOrientation() {
    return Object.freeze({
      yaw,
      pitch,
      yawVelocity,
      pitchVelocity
    });
  }

  function getProjectionSummary() {
    const bandIndex = clamp(Math.floor(((pitch + Math.PI / 2) / Math.PI) * 4), 0, 3);
    const sectorIndex = clamp(Math.floor(((wrapAngle(yaw) + Math.PI) / (Math.PI * 2)) * 4), 0, 3);
    const cellIndex = bandIndex * 4 + sectorIndex;

    return Object.freeze({
      cellId: WORLD_KERNEL.localGrid.cellIds[cellIndex],
      sector: sectorIndex,
      bandIndex,
      stateByte: cellIndex,
      row: bandIndex,
      col: sectorIndex,
      cellIndex
    });
  }

  function getOrbitalViewState() {
    return Object.freeze({
      centerX: state.centerX,
      centerY: state.centerY,
      radius: state.radius,
      fullCircle: true
    });
  }

  function attachBodyRelative(lon, lat) {
    const projected = projectSphere(lon, lat);
    const surface = lonLatToSurfaceCoordinates(lon, lat);
    const localCell = surfaceCoordinatesToLocalCell(surface);

    return Object.freeze({
      projected,
      surface,
      localCell
    });
  }

  function getWorldStateHandoff(screenX = state.centerX, screenY = state.centerY) {
    const inverse = inverseProject(screenX, screenY);
    const summary = getProjectionSummary();

    return Object.freeze({
      body: getOrbitalViewState(),
      orientation: getOrientation(),
      cardinals: getCardinalWeights(),
      projection: summary,
      inverse,
      fullCircle: true
    });
  }

  return Object.freeze({
    state,
    resize,
    applyDrag,
    stepInertia,
    projectSphere,
    projectSphereWithOffset,
    inverseProject,
    lonLatToSurfaceCoordinates,
    surfaceCoordinatesToLocalCell,
    getCardinalWeights,
    getOrientation,
    getProjectionSummary,
    getOrbitalViewState,
    attachBodyRelative,
    getWorldStateHandoff
  });
}
