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
  const radius =
    isFiniteNumber(state.radius)
      ? state.radius
      : Math.min(width, height) * WORLD_KERNEL.constants.worldRadiusFactor;

  return Object.freeze({
    width,
    height,
    centerX: isFiniteNumber(state.centerX) ? state.centerX : width * 0.5,
    centerY: isFiniteNumber(state.centerY) ? state.centerY : height * 0.5,
    radius
  });
}

function defaultProjectorFactory(projectionState) {
  return function projectPoint(latDeg, lonDeg, radiusOffsetPx = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const resolvedRadius = projectionState.radius + radiusOffsetPx;

    const x = Math.cos(lat) * Math.sin(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);

    return Object.freeze({
      x: projectionState.centerX + x * resolvedRadius,
      y: projectionState.centerY - y * resolvedRadius,
      z,
      visible: z >= 0,
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

function colorForSample(sample) {
  if (sample.terrainClass === "water") {
    const runoff = clamp(sample.runoff ?? 0, 0, 1);
    const depth = clamp((sample.seaLevel ?? 0) - (sample.elevation ?? 0), 0, 1);
    const blue = Math.round(120 + depth * 90 + runoff * 20);
    const green = Math.round(80 + runoff * 70);
    return `rgb(40, ${green}, ${blue})`;
  }

  const diamond = clamp(sample.diamondDensity ?? 0, 0, 1);
  const opal = clamp(sample.opalDensity ?? 0, 0, 1);
  const granite = clamp(sample.graniteDensity ?? 0, 0, 1);
  const marble = clamp(sample.marbleDensity ?? 0, 0, 1);
  const elevation = clamp((sample.elevation ?? 0), 0, 1);
  const freeze = clamp(sample.freezePotential ?? 0, 0, 1);
  const shoreline = sample.shoreline === true ? 1 : 0;

  const r = Math.round(
    70 +
      diamond * 120 +
      opal * 80 +
      granite * 35 +
      marble * 50 +
      freeze * 50 +
      shoreline * 40
  );
  const g = Math.round(
    65 +
      opal * 110 +
      granite * 55 +
      marble * 35 +
      elevation * 35 +
      shoreline * 45
  );
  const b = Math.round(
    55 +
      diamond * 145 +
      opal * 120 +
      marble * 60 +
      freeze * 85 +
      shoreline * 35
  );

  return `rgb(${clamp(r, 0, 255)}, ${clamp(g, 0, 255)}, ${clamp(b, 0, 255)})`;
}

function alphaForSample(sample) {
  const rainfall = clamp(sample.rainfall ?? 0, 0, 1);
  const magnetic = clamp(sample.auroralPotential ?? 0, 0, 1);
  const freeze = clamp(sample.freezePotential ?? 0, 0, 1);
  return clamp(0.48 + rainfall * 0.08 + magnetic * 0.04 + freeze * 0.05, 0.35, 0.9);
}

function pointFromSample(sample, projectPoint, radiusScale = 1) {
  const elevation = clamp(sample.elevation ?? 0, -1, 1);
  const radiusOffset = radiusScale * elevation * 16;
  return projectPoint(sample.latDeg, sample.lonDeg, radiusOffset);
}

function shouldDrawQuad(points) {
  return points.some((point) => point?.visible === true);
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

function drawSpace(ctx, projectionState, viewState = {}) {
  ctx.save();

  const gradient = ctx.createLinearGradient(0, 0, 0, projectionState.height);
  gradient.addColorStop(0, "#020612");
  gradient.addColorStop(0.55, "#071428");
  gradient.addColorStop(1, "#0a1730");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);

  const seed = Math.round(
    (isFiniteNumber(viewState.seed) ? viewState.seed : 1) * 9973 +
      projectionState.width +
      projectionState.height
  );

  for (let i = 0; i < 120; i += 1) {
    const rx = Math.abs(Math.sin(seed + i * 13.17));
    const ry = Math.abs(Math.cos(seed + i * 7.91));
    const rs = 0.4 + (Math.abs(Math.sin(seed + i * 2.31)) * 1.8);
    const x = rx * projectionState.width;
    const y = ry * projectionState.height;
    const alpha = 0.18 + Math.abs(Math.cos(seed + i * 0.77)) * 0.5;

    ctx.beginPath();
    ctx.arc(x, y, rs, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx.fill();
  }

  ctx.restore();
}

function drawAtmosphere(ctx, projectionState) {
  ctx.save();

  const outerRadius =
    projectionState.radius *
    (1 + WORLD_KERNEL.constants.atmosphereThicknessFactor);

  const glow = ctx.createRadialGradient(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 0.8,
    projectionState.centerX,
    projectionState.centerY,
    outerRadius
  );

  glow.addColorStop(0, "rgba(40,120,255,0.00)");
  glow.addColorStop(0.65, "rgba(50,140,255,0.08)");
  glow.addColorStop(1, "rgba(80,170,255,0.18)");

  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    outerRadius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = glow;
  ctx.fill();

  ctx.restore();
}

function drawOceanBase(ctx, projectionState) {
  withPlanetClip(ctx, projectionState, () => {
    const oceanGradient = ctx.createRadialGradient(
      projectionState.centerX - projectionState.radius * 0.2,
      projectionState.centerY - projectionState.radius * 0.25,
      projectionState.radius * 0.1,
      projectionState.centerX,
      projectionState.centerY,
      projectionState.radius
    );

    oceanGradient.addColorStop(0, "rgb(56,118,190)");
    oceanGradient.addColorStop(0.55, "rgb(33,86,150)");
    oceanGradient.addColorStop(1, "rgb(16,45,92)");

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

function drawTerrainMesh(ctx, grid, projectPoint) {
  if (!grid.length || !grid[0].length) return;

  for (let y = 0; y < grid.length - 1; y += 1) {
    const row = grid[y];
    const nextRow = grid[y + 1];

    for (let x = 0; x < row.length - 1; x += 1) {
      const s00 = row[x];
      const s10 = row[x + 1];
      const s01 = nextRow[x];
      const s11 = nextRow[x + 1];

      const p00 = pointFromSample(s00, projectPoint, 1);
      const p10 = pointFromSample(s10, projectPoint, 1);
      const p01 = pointFromSample(s01, projectPoint, 1);
      const p11 = pointFromSample(s11, projectPoint, 1);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      const terrainBias =
        (s00.terrainClass === "water" ? 0 : 1) +
        (s10.terrainClass === "water" ? 0 : 1) +
        (s01.terrainClass === "water" ? 0 : 1) +
        (s11.terrainClass === "water" ? 0 : 1);

      if (terrainBias === 0) continue;

      const color = colorForSample(s00);
      const alpha = alphaForSample(s00);

      drawQuad(ctx, p00, p10, p11, p01, color, alpha);
    }
  }
}

function drawOceanMesh(ctx, grid, projectPoint) {
  if (!grid.length || !grid[0].length) return;

  for (let y = 0; y < grid.length - 1; y += 1) {
    const row = grid[y];
    const nextRow = grid[y + 1];

    for (let x = 0; x < row.length - 1; x += 1) {
      const s00 = row[x];
      const s10 = row[x + 1];
      const s01 = nextRow[x];
      const s11 = nextRow[x + 1];

      const waterBias =
        (s00.terrainClass === "water" ? 1 : 0) +
        (s10.terrainClass === "water" ? 1 : 0) +
        (s01.terrainClass === "water" ? 1 : 0) +
        (s11.terrainClass === "water" ? 1 : 0);

      if (waterBias === 0) continue;

      const p00 = pointFromSample(s00, projectPoint, 0.45);
      const p10 = pointFromSample(s10, projectPoint, 0.45);
      const p01 = pointFromSample(s01, projectPoint, 0.45);
      const p11 = pointFromSample(s11, projectPoint, 0.45);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      drawQuad(ctx, p00, p10, p11, p01, colorForSample(s00), 0.72);
    }
  }
}

function drawClouds(ctx, grid, projectPoint) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.18)";

  for (let y = 0; y < grid.length; y += 3) {
    for (let x = 0; x < grid[y].length; x += 3) {
      const sample = grid[y][x];
      const cloudiness = clamp(
        (sample.rainfall ?? 0) * 0.65 + (sample.evaporationPressure ?? 0) * 0.2,
        0,
        1
      );

      if (cloudiness < 0.42) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, projectionStateOffset(sample));
      if (!point.visible) continue;

      const radius = 1.5 + cloudiness * 6.5;
      ctx.globalAlpha = 0.08 + cloudiness * 0.18;

      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function projectionStateOffset(sample) {
  const elevation = clamp(sample.elevation ?? 0, -1, 1);
  return 10 + elevation * 10;
}

function drawLighting(ctx, projectionState) {
  ctx.save();

  const light = ctx.createRadialGradient(
    projectionState.centerX - projectionState.radius * 0.35,
    projectionState.centerY - projectionState.radius * 0.4,
    projectionState.radius * 0.05,
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 1.1
  );

  light.addColorStop(0, "rgba(255,255,255,0.22)");
  light.addColorStop(0.45, "rgba(255,255,255,0.08)");
  light.addColorStop(1, "rgba(0,0,0,0.16)");

  withPlanetClip(ctx, projectionState, () => {
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, projectionState.width, projectionState.height);
  });

  ctx.restore();
}

function drawPlanetOutline(ctx, projectionState) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = "rgba(190,220,255,0.38)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

function buildRenderAudit(planetField) {
  return Object.freeze({
    sampleCount: Array.isArray(planetField?.samples)
      ? planetField.samples.reduce((total, row) => total + (Array.isArray(row) ? row.length : 0), 0)
      : 0,
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

    drawSpace(ctx, projectionState, viewState);
    drawAtmosphere(ctx, projectionState);

    drawOceanBase(ctx, projectionState);

    withPlanetClip(ctx, projectionState, () => {
      drawOceanMesh(ctx, grid, projector);
      drawTerrainMesh(ctx, grid, projector);
      drawClouds(ctx, grid, projector);
      drawLighting(ctx, projectionState);
    });

    drawPlanetOutline(ctx, projectionState);

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
