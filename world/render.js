import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function sampleGrid(planetField) {
  const rows = Array.isArray(planetField?.samples) ? planetField.samples : [];
  return Array.isArray(rows[0]) ? rows : [];
}

function getProjectionState(viewState = {}, ctx) {
  const state = normalizeObject(viewState);
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  return Object.freeze({
    width,
    height,
    centerX: isFiniteNumber(state.centerX) ? state.centerX : width * 0.5,
    centerY: isFiniteNumber(state.centerY) ? state.centerY : height * 0.5,
    radius: isFiniteNumber(state.radius)
      ? state.radius
      : Math.min(width, height) * (WORLD_KERNEL?.constants?.worldRadiusFactor ?? 0.36),
    observeMode: state.observeMode === true
  });
}

function defaultProjectorFactory(projectionState) {
  return function projectPoint(latDeg, lonDeg, radiusOffsetPx = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const resolvedRadius = projectionState.radius + radiusOffsetPx;

    const nx = Math.cos(lat) * Math.sin(lon);
    const ny = Math.sin(lat);
    const nz = Math.cos(lat) * Math.cos(lon);

    return Object.freeze({
      x: projectionState.centerX + nx * resolvedRadius,
      y: projectionState.centerY - ny * resolvedRadius,
      z: nz,
      visible: nz >= 0,
      resolvedRadius
    });
  };
}

function resolveProjectPoint(projectPoint, projectionState) {
  return typeof projectPoint === "function"
    ? projectPoint
    : defaultProjectorFactory(projectionState);
}

function withPlanetClip(ctx, projectionState, drawFn) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius,
    0,
    Math.PI * 2
  );
  ctx.clip();
  drawFn();
  ctx.restore();
}

function shouldDrawQuad(points) {
  let visibleCount = 0;
  for (let i = 0; i < points.length; i += 1) {
    if (points[i]?.visible === true) visibleCount += 1;
  }
  return visibleCount >= 3;
}

function drawQuad(ctx, p00, p10, p11, p01, fillStyle, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(p00.x, p00.y);
  ctx.lineTo(p10.x, p10.y);
  ctx.lineTo(p11.x, p11.y);
  ctx.lineTo(p01.x, p01.y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
}

function rgb(r, g, b) {
  return { r, g, b };
}

function rgbString(color) {
  return `rgb(${Math.round(clamp(color.r, 0, 255))}, ${Math.round(clamp(color.g, 0, 255))}, ${Math.round(clamp(color.b, 0, 255))})`;
}

function mixRgb(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t
  };
}

function terrainClass(sample) {
  return typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
}

function isLandSample(sample) {
  if (sample?.landMask === 1) return true;
  if (sample?.waterMask === 1) return false;

  const tc = terrainClass(sample);
  return tc !== "WATER" && tc !== "SHELF";
}

function isCryosphere(sample) {
  const tc = terrainClass(sample);
  return (
    tc === "POLAR_ICE" ||
    tc === "GLACIAL_HIGHLAND" ||
    sample?.biomeType === "GLACIER" ||
    sample?.surfaceMaterial === "ICE" ||
    sample?.surfaceMaterial === "SNOW"
  );
}

function isShoreline(sample) {
  const tc = terrainClass(sample);
  return tc === "SHORELINE" || tc === "BEACH" || sample?.shoreline === true || sample?.shorelineBand === true;
}

function resolveElevationOffsetPx(sample) {
  const elevation = isFiniteNumber(sample?.elevation) ? sample.elevation : 0;
  return clamp(elevation, -1, 1) * 10;
}

function pointFromSample(sample, projectPoint) {
  return projectPoint(sample.latDeg, sample.lonDeg, resolveElevationOffsetPx(sample));
}

function resolveBaseWaterColor(sample) {
  const depth = Math.abs(clamp(sample?.oceanDepthField ?? -0.2, -1, 0));
  let color = rgb(12, 42, 98);

  if (terrainClass(sample) === "SHELF") {
    color = rgb(34, 88, 136);
  } else if (depth > 0.30) {
    color = rgb(4, 18, 46);
  } else if (depth > 0.12) {
    color = rgb(8, 30, 76);
  }

  return isShoreline(sample)
    ? mixRgb(color, rgb(60, 118, 152), 0.18)
    : color;
}

function resolveBaseLandColor(sample) {
  const tc = terrainClass(sample);
  const biome = typeof sample?.biomeType === "string" ? sample.biomeType : "NONE";
  const surface = typeof sample?.surfaceMaterial === "string" ? sample.surfaceMaterial : "NONE";

  let color = rgb(118, 154, 92);

  if (biome === "TROPICAL_RAINFOREST") color = rgb(24, 74, 40);
  else if (biome === "TROPICAL_GRASSLAND") color = rgb(126, 132, 72);
  else if (biome === "TEMPERATE_FOREST") color = rgb(48, 80, 54);
  else if (biome === "TEMPERATE_GRASSLAND") color = rgb(130, 134, 88);
  else if (biome === "DESERT") color = rgb(154, 124, 80);
  else if (biome === "TUNDRA") color = rgb(116, 118, 112);
  else if (biome === "WETLAND") color = rgb(60, 82, 68);
  else if (biome === "BOREAL_FOREST") color = rgb(52, 70, 58);
  else if (biome === "GLACIER") color = rgb(214, 222, 230);

  if (surface === "BEDROCK") color = mixRgb(color, rgb(118, 114, 112), 0.42);
  else if (surface === "GRAVEL") color = mixRgb(color, rgb(134, 126, 112), 0.28);
  else if (surface === "SAND") color = mixRgb(color, rgb(182, 160, 114), 0.34);
  else if (surface === "SILT") color = mixRgb(color, rgb(144, 130, 110), 0.26);
  else if (surface === "CLAY") color = mixRgb(color, rgb(140, 100, 82), 0.32);
  else if (surface === "SOIL") color = mixRgb(color, rgb(92, 74, 56), 0.18);
  else if (surface === "ICE") color = rgb(222, 228, 234);
  else if (surface === "SNOW") color = rgb(244, 246, 250);

  if (tc === "BEACH") color = rgb(188, 166, 118);
  else if (tc === "SHORELINE") color = mixRgb(color, rgb(166, 150, 108), 0.26);
  else if (tc === "BASIN") color = mixRgb(color, rgb(72, 88, 68), 0.38);
  else if (tc === "CANYON") color = mixRgb(color, rgb(144, 88, 68), 0.46);
  else if (tc === "RIDGE") color = mixRgb(color, rgb(112, 106, 98), 0.30);
  else if (tc === "PLATEAU") color = mixRgb(color, rgb(132, 118, 94), 0.28);
  else if (tc === "MOUNTAIN") color = mixRgb(color, rgb(136, 132, 128), 0.52);
  else if (tc === "SUMMIT") color = mixRgb(color, rgb(188, 186, 188), 0.62);
  else if (tc === "GLACIAL_HIGHLAND" || tc === "POLAR_ICE") color = rgb(208, 218, 230);

  return color;
}

function applyFacing(color, point) {
  const factor = clamp(0.72 + point.z * 0.24, 0.56, 1.06);
  return rgb(color.r * factor, color.g * factor, color.b * factor);
}

function resolveFillColor(sample, point) {
  const base = isLandSample(sample)
    ? resolveBaseLandColor(sample)
    : resolveBaseWaterColor(sample);

  return applyFacing(base, point);
}

function resolveFillAlpha(sample) {
  const tc = terrainClass(sample);

  if (!isLandSample(sample)) return tc === "SHELF" ? 0.70 : 0.64;
  if (tc === "SUMMIT" || tc === "MOUNTAIN" || tc === "GLACIAL_HIGHLAND") return 0.88;
  if (tc === "RIDGE" || tc === "CANYON" || tc === "BASIN") return 0.84;
  if (tc === "BEACH" || tc === "SHORELINE") return 0.78;
  return 0.74;
}

function drawPlanetBase(ctx, projectionState) {
  withPlanetClip(ctx, projectionState, () => {
    const oceanGradient = ctx.createRadialGradient(
      projectionState.centerX - projectionState.radius * 0.24,
      projectionState.centerY - projectionState.radius * 0.28,
      projectionState.radius * 0.06,
      projectionState.centerX,
      projectionState.centerY,
      projectionState.radius
    );

    oceanGradient.addColorStop(0, "rgb(22,68,126)");
    oceanGradient.addColorStop(0.42, "rgb(10,38,88)");
    oceanGradient.addColorStop(0.82, "rgb(4,18,46)");
    oceanGradient.addColorStop(1, "rgb(2,10,24)");

    ctx.beginPath();
    ctx.arc(
      projectionState.centerX,
      projectionState.centerY,
      projectionState.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = oceanGradient;
    ctx.fill();
  });
}

function drawSurfaceMesh(ctx, grid, projectPoint) {
  if (!grid.length || !grid[0].length) return;

  for (let y = 0; y < grid.length - 1; y += 1) {
    const row = grid[y];
    const nextRow = grid[y + 1];

    for (let x = 0; x < row.length; x += 1) {
      const nextX = (x + 1) % row.length;

      const s00 = row[x];
      const s10 = row[nextX];
      const s01 = nextRow[x];
      const s11 = nextRow[nextX];

      const p00 = pointFromSample(s00, projectPoint);
      const p10 = pointFromSample(s10, projectPoint);
      const p01 = pointFromSample(s01, projectPoint);
      const p11 = pointFromSample(s11, projectPoint);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      const color = rgbString(resolveFillColor(s00, p00));
      const alpha = resolveFillAlpha(s00);

      drawQuad(ctx, p00, p10, p11, p01, color, alpha);
    }
  }
}

function drawCloudLayer(ctx, grid, projectPoint, projectionState) {
  ctx.save();

  for (let y = 0; y < grid.length; y += 4) {
    for (let x = 0; x < grid[y].length; x += 4) {
      const sample = grid[y][x];
      const cloudiness = clamp(
        (sample?.rainfall ?? 0) * 0.50 +
        (sample?.evaporationPressure ?? 0) * 0.16 +
        (sample?.maritimeInfluence ?? 0) * 0.14,
        0,
        1
      );

      if (cloudiness < 0.60) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, 10);
      if (!point.visible) continue;

      const radius = 0.85 + cloudiness * (projectionState.observeMode ? 2.4 : 2.8);
      const alpha = projectionState.observeMode
        ? 0.010 + cloudiness * 0.028
        : 0.014 + cloudiness * 0.040;

      const grad = ctx.createRadialGradient(
        point.x - radius * 0.2,
        point.y - radius * 0.25,
        radius * 0.15,
        point.x,
        point.y,
        radius
      );
      grad.addColorStop(0, `rgba(255,255,255,${(alpha * 1.2).toFixed(3)})`);
      grad.addColorStop(0.55, `rgba(248,250,255,${alpha.toFixed(3)})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawPolarGlow(ctx, grid, projectPoint, projectionState) {
  ctx.save();

  for (let y = 0; y < grid.length; y += 5) {
    for (let x = 0; x < grid[y].length; x += 5) {
      const sample = grid[y][x];
      const aurora = clamp(sample?.auroralPotential ?? 0, 0, 1);
      if (aurora < 0.56) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, 12);
      if (!point.visible) continue;

      const radius = 0.95 + aurora * (projectionState.observeMode ? 2.0 : 2.4);
      const alpha = projectionState.observeMode
        ? 0.008 + aurora * 0.024
        : 0.010 + aurora * 0.032;

      const grad = ctx.createRadialGradient(
        point.x,
        point.y,
        radius * 0.12,
        point.x,
        point.y,
        radius
      );
      grad.addColorStop(0, `rgba(136,255,186,${(alpha * 1.08).toFixed(3)})`);
      grad.addColorStop(0.55, `rgba(96,220,255,${(alpha * 0.88).toFixed(3)})`);
      grad.addColorStop(1, "rgba(96,220,255,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawPlanetRim(ctx, projectionState) {
  ctx.save();

  const outerRadius = projectionState.radius * 1.018;
  const rim = ctx.createRadialGradient(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 0.965,
    projectionState.centerX,
    projectionState.centerY,
    outerRadius
  );

  if (projectionState.observeMode) {
    rim.addColorStop(0.98, "rgba(132,188,255,0.04)");
    rim.addColorStop(1, "rgba(170,220,255,0.08)");
  } else {
    rim.addColorStop(0.98, "rgba(132,188,255,0.06)");
    rim.addColorStop(1, "rgba(170,220,255,0.12)");
  }

  ctx.beginPath();
  ctx.arc(projectionState.centerX, projectionState.centerY, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = projectionState.observeMode
    ? "rgba(188,220,255,0.10)"
    : "rgba(188,220,255,0.14)";
  ctx.lineWidth = projectionState.observeMode ? 0.75 : 0.85;
  ctx.stroke();

  ctx.restore();
}

function buildRenderAudit(planetField) {
  const grid = sampleGrid(planetField);

  let waterFamilyCount = 0;
  let landFamilyCount = 0;
  let cryosphereCount = 0;
  let shorelineCount = 0;
  const continentCoverage = {};

  for (const row of grid) {
    for (const sample of row) {
      const landFamily = isLandSample(sample);
      const waterFamily = !landFamily;
      const cryosphere = isCryosphere(sample);
      const shoreline = isShoreline(sample);
      const continentId = typeof sample?.continentId === "string" ? sample.continentId : "";

      if (waterFamily) waterFamilyCount += 1;
      if (landFamily) landFamilyCount += 1;
      if (cryosphere) cryosphereCount += 1;
      if (shoreline) shorelineCount += 1;

      if (continentId) {
        continentCoverage[continentId] = (continentCoverage[continentId] ?? 0) + 1;
      }
    }
  }

  return Object.freeze({
    sampleCount: Array.isArray(planetField?.samples)
      ? planetField.samples.reduce((total, row) => total + (Array.isArray(row) ? row.length : 0), 0)
      : 0,
    waterFamilyCount,
    landFamilyCount,
    cryosphereCount,
    shorelineCount,
    continentCoverage: Object.freeze(continentCoverage),
    summary: normalizeObject(planetField?.summary)
  });
}

export function createRenderer() {
  function renderPlanet({
    ctx,
    planetField,
    projectPoint,
    viewState = {}
  }) {
    if (!ctx || !planetField) {
      throw new Error("renderPlanet requires ctx and planetField.");
    }

    const grid = sampleGrid(planetField);
    const projectionState = getProjectionState(viewState, ctx);
    const projector = resolveProjectPoint(projectPoint, projectionState);

    ctx.clearRect(0, 0, projectionState.width, projectionState.height);

    drawPlanetRim(ctx, projectionState);
    drawPlanetBase(ctx, projectionState);

    withPlanetClip(ctx, projectionState, () => {
      drawSurfaceMesh(ctx, grid, projector);
      drawCloudLayer(ctx, grid, projector, projectionState);
      drawPolarGlow(ctx, grid, projector, projectionState);
    });

    return Object.freeze({
      projectionState,
      audit: buildRenderAudit(planetField)
    });
  }

  return Object.freeze({
    renderPlanet
  });
}

const DEFAULT_RENDERER = createRenderer();

export function renderPlanet(options) {
  return DEFAULT_RENDERER.renderPlanet(options);
}
