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
  const py = normalize(runtime?.player?.y, 770);
  return clamp((930 - py) / 930, 0, 1);
}

function getEastProgress(runtime) {
  const px = normalize(runtime?.player?.x, 544);
  return clamp((px - 150) / (960 - 150), 0, 1);
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

function computePlanetBody(runtime) {
  const width = getViewportWidth(runtime);
  const height = getViewportHeight(runtime);

  const northProgress = getNorthProgress(runtime);
  const eastProgress = getEastProgress(runtime);

  const centerX =
    lerp(width * 0.50, width * 0.50, northProgress) +
    ((eastProgress - 0.5) * width * 0.06);

  const centerY = lerp(height * 1.34, height * 1.12, northProgress);

  const radius = lerp(width * 1.16, width * 0.96, northProgress);

  const horizonY = centerY - (radius * 0.78);

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

function projectSphere(runtime, worldX, worldY) {
  const bounds = getWorldBounds(runtime);
  const body = computePlanetBody(runtime);

  const worldWidth = bounds.width;
  const worldHeight = bounds.height;

  const x = clamp(normalize(worldX, worldWidth * 0.5), 0, worldWidth);
  const y = clamp(normalize(worldY, worldHeight * 0.5), 0, worldHeight);

  const u = x / worldWidth;
  const v = y / worldHeight;

  const northDepth = clamp(1 - v, 0, 1);
  const southDepth = 1 - northDepth;

  const longitudeSpan = lerp(1.14, 1.34, body.northProgress);
  const latitudeSpan = lerp(0.84, 1.08, body.northProgress);

  const longitude = (u - 0.5) * longitudeSpan;
  const latitude = (0.5 - v) * latitudeSpan;

  const cosLat = Math.cos(latitude);
  const sinLat = Math.sin(latitude);
  const sinLon = Math.sin(longitude);
  const cosLon = Math.cos(longitude);

  const sx = body.radius * sinLon * cosLat;
  const sy = -body.radius * sinLat;
  const sz = body.radius * cosLon * cosLat;

  const tilt = lerp(0.92, 1.08, body.northProgress);

  const cosTilt = Math.cos(tilt);
  const sinTilt = Math.sin(tilt);

  const rotatedY = (sy * cosTilt) - (sz * sinTilt);
  const rotatedZ = (sy * sinTilt) + (sz * cosTilt);

  const cameraDistance = body.radius * lerp(2.18, 2.58, body.northProgress);

  const perspective =
    cameraDistance /
    Math.max(1, cameraDistance - rotatedZ);

  const screenX =
    body.centerX + (sx * perspective);

  const screenY =
    body.centerY + (rotatedY * perspective);

  const scale =
    clamp(perspective, 0.58, 1.36);

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
  const sample = projectSphere(runtime, 590, normalize(worldY, 620));

  const northDepth = sample.northDepth;

  const depthScale = lerp(1.00, 0.68, northDepth);

  const projected =
    normalize(value, 1) *
    depthScale *
    sample.scale;

  return Math.max(0.5, projected);
}

function projectLineWidth(runtime, value, worldY) {
  return projectRadius(runtime, value, worldY);
}

function projectRect(runtime, x, y, width, height) {
  const center =
    projectSphere(runtime, x + (width * 0.5), y + (height * 0.5));

  const projectedWidth =
    projectRadius(runtime, width, y + (height * 0.5));

  const projectedHeight =
    projectRadius(runtime, height, y + height);

  return Object.freeze({
    x: center.x - (projectedWidth * 0.5),
    y: center.y - (projectedHeight * 0.5),
    width: projectedWidth,
    height: projectedHeight
  });
}

export function createPlanetSurfaceProjector(runtime) {

  const body = computePlanetBody(runtime);

  function point(x, y) {
    return projectSphere(runtime, x, y);
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

export { computePlanetBody };
