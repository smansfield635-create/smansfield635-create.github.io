function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function normalize(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function getNorthProgress(runtime) {
  const playerY = normalize(runtime?.player?.y, 770);
  return clamp((930 - playerY) / 930, 0, 1);
}

function getEastProgress(runtime) {
  const playerX = normalize(runtime?.player?.x, 544);
  return clamp((playerX - 150) / (960 - 150), 0, 1);
}

function getViewportWidth(runtime) {
  return normalize(runtime?.width, 1180);
}

function getViewportHeight(runtime) {
  return normalize(runtime?.height, 1240);
}

function getWorldBounds(runtime) {
  const width = normalize(runtime?.worldBounds?.width, 1180);
  const height = normalize(runtime?.worldBounds?.height, 1240);
  return { width, height };
}

function getPlanetBodyGeometry(runtime) {
  const width = getViewportWidth(runtime);
  const height = getViewportHeight(runtime);

  const northProgress = getNorthProgress(runtime);
  const eastProgress = getEastProgress(runtime);

  const centerX =
    lerp(width * 0.34, width * 0.22, northProgress) +
    ((eastProgress - 0.5) * width * 0.08);

  const centerY = lerp(height * 1.42, height * 1.10, northProgress);
  const radius = lerp(width * 1.18, width * 0.92, northProgress);
  const visibleLift = lerp(height * 0.10, height * 0.22, northProgress);
  const horizonY = centerY - radius + visibleLift;

  return Object.freeze({
    width,
    height,
    centerX,
    centerY,
    radius,
    horizonY,
    northProgress,
    eastProgress
  });
}

function projectSpherePoint(runtime, worldX, worldY) {
  const bounds = getWorldBounds(runtime);
  const body = getPlanetBodyGeometry(runtime);

  const worldWidth = bounds.width;
  const worldHeight = bounds.height;

  const x = clamp(normalize(worldX, worldWidth * 0.5), 0, worldWidth);
  const y = clamp(normalize(worldY, worldHeight * 0.5), 0, worldHeight);

  const northDepth = clamp((worldHeight - y) / worldHeight, 0, 1);
  const southDepth = 1 - northDepth;

  const lateralNorm = ((x / worldWidth) - 0.5) * 2;

  const longitudeRange = lerp(0.90, 1.18, body.northProgress);
  const longitude = lateralNorm * longitudeRange;

  const latitudeSouth = lerp(-0.18, -0.06, body.northProgress);
  const latitudeNorth = lerp(0.54, 0.86, body.northProgress);
  const latitude = lerp(latitudeSouth, latitudeNorth, northDepth);

  const cosLat = Math.cos(latitude);
  const sinLat = Math.sin(latitude);
  const sinLon = Math.sin(longitude);
  const cosLon = Math.cos(longitude);

  let sx = body.radius * sinLon * cosLat;
  let sy = -body.radius * sinLat;
  let sz = body.radius * cosLon * cosLat;

  const tilt = lerp(0.92, 1.10, body.northProgress);
  const cosTilt = Math.cos(tilt);
  const sinTilt = Math.sin(tilt);

  const rotatedY = (sy * cosTilt) - (sz * sinTilt);
  const rotatedZ = (sy * sinTilt) + (sz * cosTilt);

  const cameraDistance = body.radius * lerp(2.10, 2.55, body.northProgress);
  const perspective = cameraDistance / Math.max(1, cameraDistance - rotatedZ);

  const squash = lerp(1.00, 0.92, body.northProgress);
  const xShift = ((body.eastProgress - 0.5) * body.radius * 0.10) * northDepth;

  const screenX = body.centerX + (sx * perspective * squash) + xShift;
  const screenY = body.horizonY + lerp(body.radius * 0.86, body.radius * 0.36, northDepth) + (rotatedY * perspective * 0.92);

  const scale = clamp(perspective, 0.58, 1.32);

  return Object.freeze({
    x: screenX,
    y: screenY,
    scale,
    northDepth,
    southDepth,
    horizonY: body.horizonY
  });
}

function projectRadius(runtime, value, worldY) {
  const sample = projectSpherePoint(runtime, 590, normalize(worldY, 620));
  const northDepth = sample.northDepth;

  const depthScale = lerp(1.02, 0.62, northDepth);
  const projected = normalize(value, 1) * depthScale * sample.scale;

  return Math.max(0.5, projected);
}

function projectLineWidth(runtime, value, worldY) {
  return projectRadius(runtime, value, worldY);
}

function projectRect(runtime, x, y, width, height) {
  const center = projectSpherePoint(runtime, x + (width * 0.5), y + (height * 0.5));
  const projectedWidth = projectRadius(runtime, width, y + height);
  const projectedHeight = projectRadius(runtime, height, y + height);

  return Object.freeze({
    x: center.x - (projectedWidth * 0.5),
    y: center.y - (projectedHeight * 0.5),
    width: projectedWidth,
    height: projectedHeight
  });
}

export function createPlanetSurfaceProjector(runtime) {
  const body = getPlanetBodyGeometry(runtime);

  function point(x, y) {
    return projectSpherePoint(runtime, x, y);
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
