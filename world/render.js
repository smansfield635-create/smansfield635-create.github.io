// /world/render.js
// MODE: RENDER BASELINE FILTER
// STATUS: AUTHORITATIVE SOUTH JUG (PURE)
// ROLE:
// - project + draw only
// - split coherence into tubes (no ownership)
// - NO diagnostics authority
// - NO compensation
// - NO upstream mutation

import { WORLD_KERNEL } from "./world_kernel.js";
import { resolveHydrationPacket } from "./render/hydration_render_engine.js";
import { resolveTerrainPacket } from "./render/terrain_render_engine.js";

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

function drawPlanet(ctx, p) {
  const g = ctx.createRadialGradient(
    p.centerX,
    p.centerY,
    p.radius * 0.1,
    p.centerX,
    p.centerY,
    p.radius
  );

  g.addColorStop(0, "rgb(22,68,126)");
  g.addColorStop(1, "rgb(2,10,24)");

  ctx.beginPath();
  ctx.arc(p.centerX, p.centerY, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
}

/* =========================
   FILTER SPLITTER (CORE)
========================= */

function drawSurface(ctx, grid, projector, p, globalPrimitiveTime) {
  if (!grid.length) return baseReturn();

  const rows = grid.length;
  const cols = grid[0].length;
  const count = rows * cols;

  const size = clamp(p.radius / Math.sqrt(count) * 1.2, 1.2, 4);

  let visible = 0;
  let emitted = 0;

  for (let y = 0; y < rows; y++) {
    const row = grid[y];

    for (let x = 0; x < cols; x++) {
      const sample = row[x];
      if (!sample) continue;

      const point = projector(sample.latDeg, sample.lonDeg, sample.elevation * 8);

      if (!point || !point.visible) continue;

      visible++;

      /* BASE */
      ctx.fillStyle = sample.waterMask === 1
        ? "rgba(34,102,170,0.25)"
        : "rgba(86,150,86,0.85)";

      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();

      /* TUBE 1 — TERRAIN */
      const terrainPacket = resolveTerrainPacket?.({
        sample,
        pointSizePx: size
      });

      if (terrainPacket) {
        ctx.globalAlpha = terrainPacket.alpha;
        ctx.fillStyle = terrainPacket.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, terrainPacket.radiusPx, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* TUBE 2 — HYDRATION */
      const hydrationPacket = resolveHydrationPacket?.({
        sample,
        pointSizePx: size,
        grid,
        x,
        y,
        globalPrimitiveTime
      });

      if (hydrationPacket) {
        ctx.globalAlpha = hydrationPacket.alpha;
        ctx.fillStyle = hydrationPacket.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, hydrationPacket.radiusPx, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* TUBE 3 — FAUNA (stub) */
      /* TUBE 4 — ANIMAL (stub) */
      /* TUBE 5 — COSMOS (stub) */

      emitted++;
    }
  }

  return {
    visibleCellCount: visible,
    emittedCellCount: emitted,
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
      waterFamilyCount: 0,
      landFamilyCount: 0,
      cryosphereCount: 0,
      shorelineCount: 0
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
