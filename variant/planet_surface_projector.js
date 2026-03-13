function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function normalize(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function getViewportWidth(runtime) {
  return normalize(runtime?.width, 1180);
}

function getViewportHeight(runtime) {
  return normalize(runtime?.height, 1240);
}

function getWorldBounds(runtime) {
  return {
    width: normalize(runtime?.worldBounds?.width, 1180),
    height: normalize(runtime?.worldBounds?.height, 1240)
  };
}

function getPlayerNorthProgress(runtime) {
  const bounds = getWorldBounds(runtime);
  const playerY = normalize(runtime?.player?.y, bounds.height * 0.62);
  return clamp((bounds.height - playerY) / bounds.height, 0, 1);
}

function getPlayerEastProgress(runtime) {
  const bounds = getWorldBounds(runtime);
  const playerX = normalize(runtime?.player?.x, bounds.width * 0.5);
  return clamp(playerX / bounds.width, 0, 1);
}

function getOrbitLon(runtime) {
  if (Number.isFinite(runtime?.globeRotation?.lon)) return runtime.globeRotation.lon;
  if (Number.isFinite(runtime?.cameraOrbit?.lon)) return runtime.cameraOrbit.lon;
  if (Number.isFinite(runtime?.camera?.orbitLon)) return runtime.camera.orbitLon;

  const east = getPlayerEastProgress(runtime);
  return lerp(-0.22, 0.22, east);
}

function getOrbitLat(runtime) {
  if (Number.isFinite(runtime?.globeRotation?.lat)) return runtime.globeRotation.lat;
  if (Number.isFinite(runtime?.cameraOrbit?.lat)) return runtime.cameraOrbit.lat;
  if (Number.isFinite(runtime?.camera?.orbitLat)) return runtime.camera.orbitLat;

  const north = getPlayerNorthProgress(runtime);
  return lerp(0.08, -0.16, north);
}

function rotateY(point, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: (point.x * c) - (point.z * s),
    y: point.y,
    z: (point.x * s) + (point.z * c)
  };
}

function rotateX(point, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return {
    x: point.x,
    y: (point.y * c) - (point.z * s),
    z: (point.y * s) + (point.z * c)
  };
}

function getPlanetBodyGeometry(runtime) {
  const width = getViewportWidth(runtime);
  const height = getViewportHeight(runtime);

  const north = getPlayerNorthProgress(runtime);
  const orbitLat = getOrbitLat(runtime);

  const centerX = width * 0.5;
  const centerY = lerp(height * 1.28, height * 1.12, north) + (orbitLat * height * 0.06);
  const radius = lerp(width * 1.10, width * 0.96, north);
  const horizonY = centerY - (radius * 0.78);

  return Object.freeze({
    width,
    height,
    centerX,
    centerY,
    radius,
    horizonY,
    northProgress: north,
    eastProgress: getPlayerEastProgress(runtime)
  });
}

function getPatchAngles(runtime, worldX, worldY) {
  const bounds = getWorldBounds(runtime);

  const x = clamp(normalize(worldX, bounds.width * 0.5), 0, bounds.width);
  const y = clamp(normalize(worldY, bounds.height * 0.5), 0, bounds.height);

  const u = x / bounds.width;
  const v = y / bounds.height;

  const localYaw = (u - 0.5) * 1.92;
  const localPitch = (0.56 - v) * 1.04;

  return {
    u,
    v,
    localYaw,
    localPitch
  };
}

function projectPatchPoint(runtime, worldX, worldY) {
  const body = getPlanetBodyGeometry(runtime);
  const { localYaw, localPitch } = getPatchAngles(runtime, worldX, worldY);

  const baseYaw = 0.98;
  const basePitch = 0.20;

  const orbitLon = getOrbitLon(runtime);
  const orbitLat = getOrbitLat(runtime);

  const cosPitch = Math.cos(localPitch);
  const sinPitch = Math.sin(localPitch);
  const sinYaw = Math.sin(localYaw);
  const cosYaw = Math.cos(localYaw);

  let point = {
    x: body.radius * sinYaw * cosPitch,
    y: -body.radius * sinPitch,
    z: body.radius * cosYaw * cosPitch
  };

  point = rotateY(point, baseYaw + orbitLon);
  point = rotateX(point, basePitch + orbitLat);

  const cameraDistance = body.radius * 2.42;
  const perspective = cameraDistance / Math.max(1, cameraDistance - point.z);
  const visible = point.z > (-body.radius * 0.18);

  return Object.freeze({
    x: body.centerX + (point.x * perspective),
    y: body.centerY + (point.y * perspective),
    z: point.z,
    visible,
    scale: clamp(perspective, 0.54, 1.42),
    horizonY: body.horizonY
  });
}

function projectRadius(runtime, value, worldY = 620) {
  const sample = projectPatchPoint(runtime, 590, worldY);
  const projected = normalize(value, 1) * sample.scale;
  return Math.max(0.5, projected);
}

function projectLineWidth(runtime, value, worldY = 620) {
  return projectRadius(runtime, value, worldY);
}

function projectRect(runtime, x, y, width, height) {
  const center = projectPatchPoint(runtime, x + (width * 0.5), y + (height * 0.5));
  const projectedWidth = projectRadius(runtime, width, y + (height * 0.5));
  const projectedHeight = projectRadius(runtime, height, y + height);

  return Object.freeze({
    x: center.x - (projectedWidth * 0.5),
    y: center.y - (projectedHeight * 0.5),
    width: projectedWidth,
    height: projectedHeight,
    visible: center.visible
  });
}

export function createPlanetSurfaceProjector(runtime) {
  const body = getPlanetBodyGeometry(runtime);

  function point(x, y) {
    return projectPatchPoint(runtime, x, y);
  }

  function radius(value, y = 620) {
    return projectRadius(runtime, value, y);
  }

  function lineWidth(value, y = 620) {
    return projectLineWidth(runtime, value, y);
  }

  function rect(x, y, width, height) {
    return projectRect(runtime, x, y, width, height);
  }

  return Object.freeze({
    body,
    point,
    radius,
    lineWidth,
    rect
  });
}

export { getPlanetBodyGeometry };
