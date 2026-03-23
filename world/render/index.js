```javascript
// /world/render/index.js
// MODE: RENDER BASELINE FILTER
// STATUS: AUTHORITATIVE SOUTH JUG (PURE)
// ROLE:
// - project + draw only
// - split coherence into layered hoses
// - NO diagnostics authority
// - NO compensation
// - NO upstream mutation
// - terrain = baseline land coverage
// - elevation = upward overlay
// - cut = incision overlay
// - hydration = water overlay (stubbed until implemented)
// - botany hose reserved but inactive until dedicated render packet exists

import { WORLD_KERNEL } from "../world_kernel.js";
import { resolveTerrainPacket  } from "./terrain/index.js";
import { resolveElevationPacket } from "./elevation_render_engine.js";
import { resolveCutPacket       } from "./cut_render_engine.js";

// Stub hydration until hydration_render_engine.js is implemented
function resolveHydrationPacket() {
  return null;
}

/* =========================
   UTIL
========================= */

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function isFiniteNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}

function normalizeObject(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function sampleGrid(field) {
  const rows = Array.isArray(field?.samples) ? field.samples : [];
  return Array.isArray(rows[0]) ? rows : [];
}

function getCanvasCssSize(ctx) {
  const canvas = ctx?.canvas;
  if (!canvas) return { width: 0, height: 0 };

  const rect =
    typeof canvas.getBoundingClientRect === "function"
      ? canvas.getBoundingClientRect()
      : null;

  const width =
    (rect?.width > 0 ? rect.width : 0) ||
    (canvas.clientWidth > 0 ? canvas.clientWidth : 0) ||
    (canvas.width > 0 ? canvas.width : 0);

  const height =
    (rect?.height > 0 ? rect.height : 0) ||
    (canvas.clientHeight > 0 ? canvas.clientHeight : 0) ||
    (canvas.height > 0 ? canvas.height : 0);

  return { width, height };
}

function withAlpha(color, alpha) {
  if (typeof color !== "string" || color.length === 0) {
    return `rgba(255,255,255,${clamp(alpha, 0, 1)})`;
  }

  const rgbaMatch = color.match(
    /^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i
  );
  if (rgbaMatch) {
    return `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},${clamp(alpha, 0, 1)})`;
  }

  const rgbMatch = color.match(
    /^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/i
  );
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]},${clamp(alpha, 0, 1)})`;
  }

  return color;
}

function packetRadius(packet, fallback) {
  return isFiniteNumber(packet?.radiusPx) ? packet.radiusPx : fallback;
}

function packetAlpha(packet, fallback = 0) {
  return isFiniteNumber(packet?.alpha) ? packet.alpha : fallback;
}

function packetColor(packet, fallback = "") {
  return typeof packet?.color === "string" && packet.color.length > 0
    ? packet.color
    : fallback;
}

/* =========================
   PROJECTION
========================= */

function getProjectionState(viewState = {}, ctx) {
  const state = normalizeObject(viewState);
  const { width, height } = getCanvasCssSize(ctx);

  return {
    width,
    height,
    centerX: isFiniteNumber(state.centerX) ? state.centerX : width * 0.5,
    centerY: isFiniteNumber(state.centerY) ? state.centerY : height * 0.5,
    radius: isFiniteNumber(state.radius)
      ? state.radius
      : Math.min(width, height) * (WORLD_KERNEL?.constants?.worldRadiusFactor ?? 0.36)
  };
}

function defaultProjectorFactory(p) {
  return function projectPoint(latDeg, lonDeg, offset = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const r = p.radius + offset;

    const nx = Math.cos(lat) * Math.sin(lon);
    const ny = Math.sin(lat);
    const nz = Math.cos(lat) * Math.cos(lon);

    return {
      x: p.centerX + nx * r,
      y: p.centerY - ny * r,
      z: nz,
      visible: nz >= 0
    };
  };
}

function resolveProjectPoint(projectPoint, projectionState) {
  return typeof projectPoint === "function"
    ? projectPoint
    : defaultProjectorFactory(projectionState);
}

/* =========================
   BASE DRAW
========================= */

function drawBackground(ctx, p) {
  const bg = ctx.createRadialGradient(
    p.centerX,
    p.centerY,
    p.radius * 0.2,
    p.centerX,
    p.centerY,
    Math.max(p.width, p.height) * 0.72
  );

  bg.addColorStop(0, "rgba(18,30,54,0.26)");
  bg.addColorStop(0.45, "rgba(8,14,28,0.16)");
  bg.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, p.width, p.height);
}

function drawPlanet(ctx, p) {
  const g = ctx.createRadialGradient(
    p.centerX - p.radius * 0.18,
    p.centerY - p.radius * 0.22,
    p.radius * 0.08,
    p.centerX,
    p.centerY,
    p.radius
  );

  g.addColorStop(0, "rgb(36,96,176)");
  g.addColorStop(0.52, "rgb(12,42,88)");
  g.addColorStop(1, "rgb(2,10,24)");

  ctx.beginPath();
  ctx.arc(p.centerX, p.centerY, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  const limb = ctx.createRadialGradient(
    p.centerX,
    p.centerY,
    p.radius * 0.78,
    p.centerX,
    p.centerY,
    p.radius * 1.08
  );
  limb.addColorStop(0, "rgba(88,164,255,0)");
  limb.addColorStop(0.72, "rgba(88,164,255,0.04)");
  limb.addColorStop(0.9, "rgba(110,190,255,0.16)");
  limb.addColorStop(1, "rgba(110,190,255,0)");

  ctx.beginPath();
  ctx.arc(p.centerX, p.centerY, p.radius * 1.03, 0, Math.PI * 2);
  ctx.fillStyle = limb;
  ctx.fill();

  const gloss = ctx.createRadialGradient(
    p.centerX - p.radius * 0.24,
    p.centerY - p.radius * 0.26,
    p.radius * 0.04,
    p.centerX - p.radius * 0.24,
    p.centerY - p.radius * 0.26,
    p.radius * 0.52
  );
  gloss.addColorStop(0, "rgba(255,255,255,0.22)");
  gloss.addColorStop(0.24, "rgba(255,255,255,0.08)");
  gloss.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  ctx.arc(p.centerX, p.centerY, p.radius, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = gloss;
  ctx.fillRect(p.centerX - p.radius, p.centerY - p.radius, p.radius * 2, p.radius * 2);
  ctx.restore();
}

/* =========================
   HOSE RESOLUTION
========================= */

function resolveBotanyPacket() {
  return null;
}

function resolveLayerPackets(sample, pointSizePx, grid, x, y, globalPrimitiveTime) {
  const terrainPacket   = resolveTerrainPacket?.({ sample, pointSizePx }) || null;
  const elevationPacket = resolveElevationPacket?.({ sample, pointSizePx }) || null;
  const cutPacket       = resolveCutPacket?.({ sample, pointSizePx }) || null;
  const hydrationPacket = resolveHydrationPacket({ sample, pointSizePx, grid, x, y, globalPrimitiveTime }) || null;
  const botanyPacket    = resolveBotanyPacket({ sample, pointSizePx, grid, x, y, globalPrimitiveTime }) || null;

  return Object.freeze({ terrainPacket, elevationPacket, cutPacket, hydrationPacket, botanyPacket });
}

/* =========================
   POINT STYLE
========================= */

function buildPointStyle(sample, point, baseSize, packets, p) {
  const terrainPacket   = normalizeObject(packets.terrainPacket);
  const elevationPacket = normalizeObject(packets.elevationPacket);
  const cutPacket       = normalizeObject(packets.cutPacket);
  const hydrationPacket = normalizeObject(packets.hydrationPacket);
  const botanyPacket    = normalizeObject(packets.botanyPacket);

  const depth = clamp((point.z + 1) * 0.5, 0, 1);
  const edgeDistance = Math.hypot(point.x - p.centerX, point.y - p.centerY);
  const edgeRatio = p.radius > 0 ? clamp(edgeDistance / p.radius, 0, 1) : 1;
  const limbFade = clamp(1 - Math.pow(edgeRatio, 1.75), 0.12, 1);
  const lightBias = clamp(0.36 + depth * 0.86, 0.18, 1.18);

  const elevation = clamp(sample?.elevation ?? 0, 0, 1);

  const terrainScale   = packetRadius(terrainPacket, baseSize)   / Math.max(baseSize, 0.0001);
  const elevationScale = packetRadius(elevationPacket, baseSize) / Math.max(baseSize, 0.0001);
  const cutScale       = packetRadius(cutPacket, baseSize)       / Math.max(baseSize, 0.0001);
  const hydrationScale = packetRadius(hydrationPacket, baseSize) / Math.max(baseSize, 0.0001);
  const botanyScale    = packetRadius(botanyPacket, baseSize)    / Math.max(baseSize, 0.0001);

  const radius = clamp(
    baseSize * (
      0.76 +
      depth * 0.58 +
      elevation * 0.16 +
      (terrainScale - 1) * 0.24 +
      (elevationScale - 1) * 0.22 +
      (cutScale - 1) * 0.12 +
      (hydrationScale - 1) * 0.14 +
      (botanyScale - 1) * 0.08
    ),
    0.9,
    6.4
  );

  const baseAlpha      = sample?.waterMask === 1 ? 0.24 : 0.78;
  const terrainAlpha   = packetAlpha(terrainPacket, 0);
  const elevationAlpha = packetAlpha(elevationPacket, 0);
  const cutAlpha       = packetAlpha(cutPacket, 0);
  const hydrationAlpha = packetAlpha(hydrationPacket, 0);
  const botanyAlpha    = packetAlpha(botanyPacket, 0);

  const alpha = clamp(
    (
      baseAlpha +
      terrainAlpha * 0.34 +
      elevationAlpha * 0.18 +
      cutAlpha * 0.14 +
      hydrationAlpha * 0.24 +
      botanyAlpha * 0.12
    ) * lightBias * limbFade,
    0.08,
    1
  );

  const blur = clamp((1 - depth) * 0.9 + (1 - limbFade) * 0.8, 0, 1.4);

  const color =
    packetColor(botanyPacket) ||
    packetColor(hydrationPacket) ||
    packetColor(cutPacket) ||
    packetColor(elevationPacket) ||
    packetColor(terrainPacket) ||
    (sample?.waterMask === 1
      ? "rgba(68,146,232,0.90)"
      : "rgba(188,206,142,0.94)");

  return Object.freeze({
    color,
    radius,
    alpha,
    blur,
    glowAlpha: clamp(alpha * (0.18 + depth * 0.18), 0, 0.32)
  });
}

function drawPoint(ctx, point, style) {
  if (style.glowAlpha > 0.01) {
    ctx.beginPath();
    ctx.fillStyle = withAlpha(style.color, style.glowAlpha);
    ctx.arc(point.x, point.y, style.radius * 1.9, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.filter = style.blur > 0.02 ? `blur(${style.blur.toFixed(2)}px)` : "none";
  ctx.beginPath();
  ctx.fillStyle = withAlpha(style.color, style.alpha);
  ctx.arc(point.x, point.y, style.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* =========================
   FILTER SPLITTER (CORE)
========================= */

function drawSurface(ctx, grid, projector, p, globalPrimitiveTime) {
  if (!grid.length) return baseReturn();

  const rows = grid.length;
  const cols = grid[0].length;
  const count = rows * cols;

  const baseSize = clamp(p.radius / Math.sqrt(count) * 1.28, 1.05, 4.2);

  let visible = 0;
  let emitted = 0;
  let waterFamilyCount = 0;
  let landFamilyCount = 0;
  let cryosphereCount = 0;
  let shorelineCount = 0;
  let elevationFamilyCount = 0;
  let cutFamilyCount = 0;
  let botanyFamilyCount = 0;

  const queue = [];

  for (let y = 0; y < rows; y += 1) {
    const row = grid[y];

    for (let x = 0; x < cols; x += 1) {
      const sample = row[x];
      if (!sample) continue;

      const point = projector(sample.latDeg, sample.lonDeg, sample.elevation * 8);
      if (!point || !point.visible) continue;

      visible += 1;

      const packets = resolveLayerPackets(sample, baseSize, grid, x, y, globalPrimitiveTime);
      const style = buildPointStyle(sample, point, baseSize, packets, p);

      queue.push({ point, style, z: point.z });

      if (sample.waterMask === 1 || packets.hydrationPacket) waterFamilyCount += 1;
      if (sample.landMask === 1 || packets.terrainPacket) landFamilyCount += 1;
      if (packets.elevationPacket) elevationFamilyCount += 1;
      if (packets.cutPacket) cutFamilyCount += 1;
      if (packets.botanyPacket) botanyFamilyCount += 1;

      if (
        sample.biomeType === "GLACIER" ||
        sample.terrainClass === "POLAR_ICE" ||
        sample.terrainClass === "GLACIAL_HIGHLAND"
      ) {
        cryosphereCount += 1;
      }

      if (sample.shoreline === true || sample.shorelineBand === true) {
        shorelineCount += 1;
      }

      emitted += 1;
    }
  }

  queue.sort((a, b) => a.z - b.z);

  for (let i = 0; i < queue.length; i += 1) {
    drawPoint(ctx, queue[i].point, queue[i].style);
  }

  return {
    visibleCellCount: visible,
    emittedCellCount: emitted,
    waterFamilyCount,
    landFamilyCount,
    cryosphereCount,
    shorelineCount,
    elevationFamilyCount,
    cutFamilyCount,
    botanyFamilyCount,
    primitiveType: "FILTER_SIGNAL",
    primitivePath: "render.filter.split"
  };
}

/* =========================
   RETURNS
========================= */

function baseReturn() {
  return {
    visibleCellCount: 0,
    emittedCellCount: 0,
    waterFamilyCount: 0,
    landFamilyCount: 0,
    cryosphereCount: 0,
    shorelineCount: 0,
    elevationFamilyCount: 0,
    cutFamilyCount: 0,
    botanyFamilyCount: 0,
    primitiveType: "NONE",
    primitivePath: "none"
  };
}

function buildReturn(p, density) {
  return {
    projectionState: p,
    primitive: {
      primitiveType: density.primitiveType,
      primitivePath: density.primitivePath,
      centerAnchored: true,
      rowColumnPathActive: true,
      sectorBandPathActive: false
    },
    topology: {
      visibleCellCount: density.visibleCellCount,
      emittedCellCount: density.emittedCellCount,
      skippedCellCount: 0
    },
    renderAuthority: {
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false,
      liveRenderPath: "render.filter"
    },
    density: {
      averageCellSpanPx: 2,
      subdivisionTier: 1,
      densityTier: "BASELINE"
    },
    audit: {
      sampleCount: density.emittedCellCount,
      waterFamilyCount: density.waterFamilyCount,
      landFamilyCount: density.landFamilyCount,
      cryosphereCount: density.cryosphereCount,
      shorelineCount: density.shorelineCount,
      elevationFamilyCount: density.elevationFamilyCount,
      cutFamilyCount: density.cutFamilyCount,
      botanyFamilyCount: density.botanyFamilyCount
    }
  };
}

/* =========================
   ENTRY
========================= */

export function createRenderer() {
  function renderPlanet({ ctx, planetField, projectPoint, viewState = {} }) {
    if (!ctx) throw new Error("ctx required");

    const p = getProjectionState(viewState, ctx);

    ctx.clearRect(0, 0, p.width, p.height);

    drawBackground(ctx, p);
    drawPlanet(ctx, p);

    if (!planetField) return buildReturn(p, baseReturn());

    const grid = sampleGrid(planetField);
    const projector = resolveProjectPoint(projectPoint, p);
    const density = drawSurface(
      ctx,
      grid,
      projector,
      p,
      viewState?.globalPrimitiveTime || null
    );

    return buildReturn(p, density);
  }

  return { renderPlanet };
}

const DEFAULT_RENDERER = createRenderer();

export function renderPlanet(options) {
  return DEFAULT_RENDERER.renderPlanet(options);
}

export default DEFAULT_RENDERER;
