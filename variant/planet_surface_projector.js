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
    (width * 0.50) +
    ((eastProgress - 0.5) * width * 0.03);

  const centerY =
    lerp(height * 1.55, height * 1.35, northProgress);

  const radius =
    lerp(width * 1.25, width * 1.05, northProgress);

  const horizonY =
    centerY - (radius * 0.98);

  const visibleDepth =
    lerp(height * 0.78, height * 0.66, northProgress);

  return Object.freeze({
    width,
    height,
    centerX,
    centerY,
    radius,
    horizonY,
    visibleDepth,
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

  const u = (x / worldWidth) - 0.5;
  const v = clamp(y / worldHeight, 0, 1);

  const northDepth = 1 - v;
  const southDepth = v;

  const lateralScale =
    lerp(0.40, 1.02, Math.pow(v, 0.92));

  const archX =
    u * body.radius * lateralScale;

  const edgeDrop =
    (u * u) * body.radius * 0.12;

  const verticalTravel =
    Math.pow(v, 0.96) * body.visibleDepth;

  const northLift =
    northDepth * body.radius * 0.02;

  const screenX =
    body.centerX + archX;

  const screenY =
    body.horizonY +
    verticalTravel +
    edgeDrop -
    northLift;

  const scale =
    lerp(0.68, 1.18, Math.pow(v, 0.92));

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
  const bounds = getWorldBounds(runtime);
  const y = clamp(normalize(worldY, bounds.height * 0.5), 0, bounds.height);
  const v = y / bounds.height;

  const depthScale =
    lerp(0.72, 1.14, Math.pow(v, 0.92));

  return Math.max(0.5, normalize(value, 1) * depthScale);
}

function projectLineWidth(runtime, value, worldY) {
  return projectRadius(runtime, value, worldY);
}

function projectRect(runtime, x, y, width, height) {
  const center = projectSpherePoint(runtime, x + (width * 0.5), y + (height * 0.5));

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
