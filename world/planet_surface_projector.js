import { WORLD_KERNEL } from "./world_kernel.js";

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
    pitch = Math.max(WORLD_KERNEL.constants.minPitch, Math.min(WORLD_KERNEL.constants.maxPitch, pitch));
  }

  function applyDrag(deltaX, deltaY) {
    yaw += deltaX * WORLD_KERNEL.constants.dragSensitivity;
    pitch += deltaY * WORLD_KERNEL.constants.dragSensitivity;
    yawVelocity = deltaX * WORLD_KERNEL.constants.dragSensitivity * 0.45;
    pitchVelocity = deltaY * WORLD_KERNEL.constants.dragSensitivity * 0.45;
    clampPitch();
  }

  function stepInertia() {
    yaw += yawVelocity;
    pitch += pitchVelocity;
    yawVelocity *= WORLD_KERNEL.constants.inertiaDecay;
    pitchVelocity *= WORLD_KERNEL.constants.inertiaDecay;
    clampPitch();
  }

  function projectSphere(lon, lat) {
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

    return {
      x: state.centerX + x * state.radius,
      y: state.centerY - y * state.radius,
      z,
      visible: z >= 0
    };
  }

  function getCardinalWeights() {
    const normalizedYaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
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
    const bandIndex = Math.max(0, Math.min(7, Math.floor(((pitch + Math.PI / 2) / Math.PI) * 8)));
    const sectorIndex = Math.max(0, Math.min(7, Math.floor(((yaw + Math.PI) / (Math.PI * 2)) * 8)));
    const cellId = `B${bandIndex}-S${sectorIndex}`;
    const stateByte = bandIndex * 16 + sectorIndex;

    return Object.freeze({
      cellId,
      sector: sectorIndex,
      bandIndex,
      stateByte
    });
  }

  return Object.freeze({
    state,
    resize,
    applyDrag,
    stepInertia,
    projectSphere,
    getCardinalWeights,
    getOrientation,
    getProjectionSummary
  });
}
