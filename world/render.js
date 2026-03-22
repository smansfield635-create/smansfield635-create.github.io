// /world/render.js
// MODE: RENDER BASELINE CONTRACT RENEWAL
// STATUS: AUTHORITATIVE SOUTH JUG
// ROLE:
// - render visible globe baseline
// - preserve runtime/gauges receipt contract
// - own no truth, no control, no runtime
// - attach hydration sidestream
// - attach terrain sidestream
// - keep bridge ownership in render only

import { WORLD_KERNEL } from "./world_kernel.js";
import { resolveHydrationPacket } from "./render/hydration_render_engine.js";
import { resolveTerrainPacket } from "./render/terrain_render_engine.js";

let lastAuditPlanetField = null;
let lastAuditResult = null;

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

function getCanvasCssSize(ctx) {
  const canvas = ctx?.canvas;
  if (!canvas) return { width: 0, height: 0 };

  const rect =
    typeof canvas.getBoundingClientRect === "function"
      ? canvas.getBoundingClientRect()
      : null;

  const width =
    (rect && isFiniteNumber(rect.width) && rect.width > 0 ? rect.width : 0) ||
    (isFiniteNumber(canvas.clientWidth) && canvas.clientWidth > 0 ? canvas.clientWidth : 0) ||
    (isFiniteNumber(canvas.width) && canvas.width > 0 ? canvas.width : 0);

  const height =
    (rect && isFiniteNumber(rect.height) && rect.height > 0 ? rect.height : 0) ||
    (isFiniteNumber(canvas.clientHeight) && canvas.clientHeight > 0 ? canvas.clientHeight : 0) ||
    (isFiniteNumber(canvas.height) && canvas.height > 0 ? canvas.height : 0);

  return { width, height };
}

function normalizeScopeName(value) {
  if (typeof value !== "string") return "GLOBAL";
  const upper = value.toUpperCase();
  if (upper === "UNIVERSE") return "UNIVERSE";
  if (upper === "GALAXY") return "GALAXY";
  if (upper === "GLOBAL") return "GLOBAL";
  if (upper === "LOCAL") return "LOCAL";
  return "GLOBAL";
}

function normalizeLensTier(value) {
  if (typeof value === "string") {
    const upper = value.toUpperCase();
    if (upper === "L1") return 1;
    if (upper === "L2") return 2;
    if (upper === "L3") return 3;
  }

  if (isFiniteNumber(value)) {
    if (value <= 1) return 1;
    if (value === 2) return 2;
    if (value >= 3) return 3;
  }

  return 1;
}

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
      : Math.min(width, height) * (WORLD_KERNEL?.constants?.worldRadiusFactor ?? 0.36),
    activeScope: normalizeScopeName(state.activeScope),
    lensTier: normalizeLensTier(state.lensTier),
    scopeSizeKm: isFiniteNumber(state.scopeSizeKm) ? state.scopeSizeKm : null,
    scopeAnchor: typeof state.scopeAnchor === "string" ? state.scopeAnchor : null,
    scopeTransitionState: state.scopeTransitionState ?? null
  };
}

function defaultProjectorFactory(projectionState) {
  return function projectPoint(latDeg, lonDeg, radiusOffsetPx = 0) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const resolvedRadius = projectionState.radius + radiusOffsetPx;

    const nx = Math.cos(lat) * Math.sin(lon);
    const ny = Math.sin(lat);
    const nz = Math.cos(lat) * Math.cos(lon);

    return {
      x: projectionState.centerX + nx * resolvedRadius,
      y: projectionState.centerY - ny * resolvedRadius,
      z: nz,
      visible: nz >= 0,
      resolvedRadius
    };
  };
}

function resolveProjectPoint(projectPoint, projectionState) {
  if (typeof projectPoint === "function") {
    return projectPoint;
  }

  return defaultProjectorFactory(projectionState);
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

  const result = drawFn();

  ctx.restore();
  return result;
}

function drawDarkContainer(ctx, projectionState, activeScope) {
  ctx.save();

  const bg = ctx.createRadialGradient(
    projectionState.centerX,
    projectionState.centerY,
    0,
    projectionState.centerX,
    projectionState.centerY,
    Math.max(projectionState.width, projectionState.height) * 0.72
  );

  if (activeScope === "UNIVERSE") {
    bg.addColorStop(0, "rgb(3,5,10)");
    bg.addColorStop(0.45, "rgb(1,2,5)");
    bg.addColorStop(1, "rgb(0,0,0)");
  } else {
    bg.addColorStop(0, "rgb(5,7,14)");
    bg.addColorStop(0.45, "rgb(2,3,8)");
    bg.addColorStop(1, "rgb(0,0,0)");
  }

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, projectionState.width, projectionState.height);
  ctx.restore();
}

function drawPlanetRim(ctx, projectionState) {
  ctx.save();

  const outerRadius = projectionState.radius * 1.024;
  const rim = ctx.createRadialGradient(
    projectionState.centerX,
    projectionState.centerY,
    projectionState.radius * 0.955,
    projectionState.centerX,
    projectionState.centerY,
    outerRadius
  );

  rim.addColorStop(0.98, "rgba(132,188,255,0.08)");
  rim.addColorStop(1, "rgba(170,220,255,0.16)");

  ctx.beginPath();
  ctx.arc(
    projectionState.centerX,
    projectionState.centerY,
    outerRadius,
    0,
    Math.PI * 2
  );
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
  ctx.strokeStyle = "rgba(188,220,255,0.18)";
  ctx.lineWidth = 1.1;
  ctx.stroke();

  ctx.restore();
}

function drawPlanetBaseFill(ctx, projectionState) {
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
}

function drawPlanetBase(ctx, projectionState) {
  withPlanetClip(ctx, projectionState, function drawPlanetBaseClipped() {
    drawPlanetBaseFill(ctx, projectionState);
    return null;
  });
}

function sampleElevationOffsetPx(sample) {
  const elevation = isFiniteNumber(sample?.elevation) ? sample.elevation : 0;
  const landBoost = sample?.landMask === 1 ? 1 : 0;
  return clamp(elevation * 10 + landBoost * 1.25, -8, 14);
}

function sampleColor(sample) {
  const terrainClass = typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
  const biomeType = typeof sample?.biomeType === "string" ? sample.biomeType : "NONE";
  const surfaceMaterial = typeof sample?.surfaceMaterial === "string" ? sample.surfaceMaterial : "NONE";

  if (sample?.waterMask === 1) {
    if (terrainClass === "SHELF") return "rgba(54,132,196,0.82)";
    return "rgba(34,102,170,0.28)";
  }

  if (
    terrainClass === "POLAR_ICE" ||
    terrainClass === "GLACIAL_HIGHLAND" ||
    biomeType === "GLACIER" ||
    surfaceMaterial === "ICE" ||
    surfaceMaterial === "SNOW"
  ) {
    return "rgba(224,238,248,0.90)";
  }

  if (terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN") {
    return "rgba(158,164,148,0.92)";
  }

  if (terrainClass === "RIDGE" || terrainClass === "PLATEAU") {
    return "rgba(126,148,96,0.88)";
  }

  if (terrainClass === "BEACH" || terrainClass === "SHORELINE" || surfaceMaterial === "SAND") {
    return "rgba(222,202,136,0.88)";
  }

  if (biomeType === "WETLAND") {
    return "rgba(78,132,92,0.90)";
  }

  if (biomeType === "DESERT") {
    return "rgba(184,154,88,0.90)";
  }

  if (biomeType === "TROPICAL_RAINFOREST") {
    return "rgba(52,132,72,0.92)";
  }

  if (biomeType === "BOREAL_FOREST") {
    return "rgba(74,116,86,0.90)";
  }

  return "rgba(86,150,86,0.88)";
}

function resolvePointSizePx(projectionState, sampleCount) {
  const base = projectionState.radius / Math.max(24, Math.sqrt(Math.max(1, sampleCount)));
  return clamp(base * 1.35, 1.2, 4.6);
}

function classifyDensityTier(averageCellSpanPx, emittedCellCount) {
  if (emittedCellCount <= 0) return "EMPTY";
  if (averageCellSpanPx <= 3) return "HIGH";
  if (averageCellSpanPx <= 6) return "MEDIUM";
  return "LOW";
}

function drawTerrainOverlay(ctx, packet, point) {
  if (!packet || packet.engineKey !== "terrain") return false;

  ctx.save();
  ctx.globalAlpha = packet.alpha;
  ctx.fillStyle = packet.color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, packet.radiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return true;
}

function drawHydrationOverlay(ctx, packet, point) {
  if (!packet || packet.engineKey !== "hydration") return false;

  ctx.save();
  ctx.globalAlpha = packet.alpha;
  ctx.fillStyle = packet.color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, packet.radiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return true;
}

function resolveTerrainDominance(sample, terrainPacket) {
  if (!terrainPacket) return false;
  if (sample?.landMask !== 1) return false;

  const heightClass = typeof terrainPacket?.heightClass === "string" ? terrainPacket.heightClass : "NONE";
  const cutClass = typeof terrainPacket?.cutClass === "string" ? terrainPacket.cutClass : "NONE";
  const packetSeparationWeight = isFiniteNumber(terrainPacket?.packetSeparationWeight)
    ? terrainPacket.packetSeparationWeight
    : 0;

  return (
    heightClass !== "LOWLAND" ||
    cutClass !== "NONE" ||
    packetSeparationWeight >= 0.42
  );
}

function resolveHydrationDominance(sample, hydrationPacket) {
  if (!hydrationPacket) return false;

  const hydrationClass = typeof hydrationPacket?.hydrationClass === "string" ? hydrationPacket.hydrationClass : "NONE";
  const hydrationBandClass = typeof hydrationPacket?.hydrationBandClass === "string" ? hydrationPacket.hydrationBandClass : "NONE";
  const flowClass = typeof hydrationPacket?.flowClass === "string" ? hydrationPacket.flowClass : "NONE";
  const retentionClass = typeof hydrationPacket?.retentionClass === "string" ? hydrationPacket.retentionClass : "NONE";
  const packetSeparationWeight = isFiniteNumber(hydrationPacket?.packetSeparationWeight)
    ? hydrationPacket.packetSeparationWeight
    : 0;

  if (sample?.waterMask === 1) return true;

  if (
    flowClass === "RIVER" ||
    flowClass === "STREAM" ||
    flowClass === "BROOK" ||
    flowClass === "LAKE"
  ) {
    return true;
  }

  if (
    retentionClass === "MAJOR_LAKE" ||
    retentionClass === "LAKE" ||
    retentionClass === "WETLAND" ||
    retentionClass === "MICRO_RESERVOIR"
  ) {
    return true;
  }

  if (
    hydrationBandClass === "CHANNEL_CORE" ||
    hydrationBandClass === "STREAM_THREAD" ||
    hydrationBandClass === "SEA_EDGE" ||
    hydrationBandClass === "LAKE_EDGE" ||
    hydrationBandClass === "LAKE_CORE" ||
    hydrationBandClass === "WETLAND_BAND" ||
    hydrationBandClass === "COAST_EDGE" ||
    hydrationBandClass === "COAST_BAND" ||
    hydrationBandClass === "RIVER_BANK" ||
    hydrationBandClass === "LAKE_MARGIN"
  ) {
    return true;
  }

  if (
    hydrationClass === "RIVER" ||
    hydrationClass === "STREAM" ||
    hydrationClass === "LAKE" ||
    hydrationClass === "WETLAND" ||
    hydrationClass === "LITTORAL_WATER" ||
    hydrationClass === "COASTAL_HYDRATION_EDGE"
  ) {
    return true;
  }

  return packetSeparationWeight >= 0.46;
}

function drawBaseSample(ctx, point, pointSizePx, baseColor) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.arc(point.x, point.y, pointSizePx, 0, Math.PI * 2);
  ctx.fill();
}

function drawSuppressedTerrainOverlay(ctx, terrainPacket, point) {
  const terrainAlpha = isFiniteNumber(terrainPacket.alpha)
    ? clamp(terrainPacket.alpha * 0.28, 0, 1)
    : 0.28;

  ctx.save();
  ctx.globalAlpha = terrainAlpha;
  ctx.fillStyle = terrainPacket.color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, terrainPacket.radiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawVisibleSurface(ctx, grid, projectPoint, projectionState, globalPrimitiveTime = null) {
  if (!grid.length || !grid[0].length) {
    return {
      visibleCellCount: 0,
      emittedCellCount: 0,
      skippedCellCount: 0,
      averageCellSpanPx: 0,
      subdivisionTier: projectionState.lensTier,
      densityTier: "EMPTY",
      primitiveType: "FORWARD_SIGNAL",
      primitivePath: "drawVisibleSurface",
      centerAnchored: true,
      rowColumnPathActive: true,
      sectorBandPathActive: false,
      topologyMode: "HYBRID",
      neighborLaw: "CROSS_GRID",
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false,
      liveRenderPath: "drawVisibleSurface"
    };
  }

  const rowCount = grid.length;
  const colCount = grid[0].length;
  const sampleCount = rowCount * colCount;
  const pointSizePx = resolvePointSizePx(projectionState, sampleCount);
  const stride = sampleCount > 32000 ? 2 : 1;

  let visibleCellCount = 0;
  let emittedCellCount = 0;
  let skippedCellCount = 0;
  let totalSpan = 0;
  let sawHydrationSignal = false;
  let sawTerrainSignal = false;
  let sawSectorBand = false;

  ctx.save();

  for (let y = 0; y < rowCount; y += stride) {
    const row = grid[y];

    for (let x = 0; x < colCount; x += stride) {
      const sample = row[x];

      if (!sample) {
        skippedCellCount += 1;
        continue;
      }

      const point = projectPoint(
        sample.latDeg,
        sample.lonDeg,
        sampleElevationOffsetPx(sample)
      );

      if (!point || point.visible !== true || point.z <= 0) {
        skippedCellCount += 1;
        continue;
      }

      visibleCellCount += 1;

      const baseColor = sampleColor(sample);

      const terrainPacket =
        typeof resolveTerrainPacket === "function"
          ? resolveTerrainPacket({
              sample,
              pointSizePx,
              baseColor
            })
          : null;

      const hydrationPacket =
        typeof resolveHydrationPacket === "function"
          ? resolveHydrationPacket({
              sample,
              pointSizePx,
              grid,
              x,
              y,
              globalPrimitiveTime,
              baseColor
            })
          : null;

      const terrainDominant = resolveTerrainDominance(sample, terrainPacket);
      const hydrationDominant = resolveHydrationDominance(sample, hydrationPacket);
      const drawBaseFirst = !(terrainDominant || hydrationDominant);

      if (drawBaseFirst) {
        drawBaseSample(ctx, point, pointSizePx, baseColor);
      }

      if (terrainPacket && !hydrationDominant) {
        if (drawTerrainOverlay(ctx, terrainPacket, point)) {
          sawTerrainSignal = true;
        }
      }

      if (hydrationPacket) {
        if (drawHydrationOverlay(ctx, hydrationPacket, point)) {
          sawHydrationSignal = true;

          if (
            hydrationPacket?.hydrationBandClass !== "NONE" ||
            hydrationPacket?.shoreHandoffClass !== "NONE"
          ) {
            sawSectorBand = true;
          }
        }
      }

      if (terrainPacket && hydrationDominant) {
        drawSuppressedTerrainOverlay(ctx, terrainPacket, point);
        sawTerrainSignal = true;
      }

      if (!drawBaseFirst && !terrainPacket && !hydrationPacket) {
        drawBaseSample(ctx, point, pointSizePx, baseColor);
      }

      const terrainRadius = terrainPacket?.radiusPx;
      const hydrationRadius = hydrationPacket?.radiusPx;
      const resolvedSpanRadius = Math.max(
        isFiniteNumber(terrainRadius) ? terrainRadius : 0,
        isFiniteNumber(hydrationRadius) ? hydrationRadius : 0,
        pointSizePx
      );

      totalSpan += resolvedSpanRadius * 2;
      emittedCellCount += 1;
    }
  }

  ctx.restore();

  const averageCellSpanPx = emittedCellCount > 0 ? totalSpan / emittedCellCount : 0;

  let primitiveType = "FORWARD_SIGNAL";
  let primitivePath = "drawVisibleSurface";

  if (sawTerrainSignal && sawHydrationSignal) {
    primitiveType = "MULTI_ENGINE_SIGNAL";
    primitivePath = "terrainRenderEngine+hydrationRenderEngine";
  } else if (sawTerrainSignal) {
    primitiveType = "TERRAIN_SIGNAL";
    primitivePath = "terrainRenderEngine";
  } else if (sawHydrationSignal) {
    primitiveType = "HYDRATION_SIGNAL";
    primitivePath = "hydrationRenderEngine";
  }

  return {
    visibleCellCount,
    emittedCellCount,
    skippedCellCount,
    averageCellSpanPx,
    subdivisionTier: projectionState.lensTier,
    densityTier: classifyDensityTier(averageCellSpanPx, emittedCellCount),
    primitiveType,
    primitivePath,
    centerAnchored: true,
    rowColumnPathActive: true,
    sectorBandPathActive: sawSectorBand,
    topologyMode: "HYBRID",
    neighborLaw: "CROSS_GRID",
    renderReadsScope: true,
    renderReadsLens: true,
    fallbackMode: false,
    liveRenderPath: "drawVisibleSurface"
  };
}

function buildRenderAudit(planetField) {
  if (planetField === lastAuditPlanetField && lastAuditResult) {
    return lastAuditResult;
  }

  const grid = sampleGrid(planetField);

  let waterFamilyCount = 0;
  let landFamilyCount = 0;
  let cryosphereCount = 0;
  let shorelineCount = 0;
  const continentCoverage = {};

  for (const row of grid) {
    for (const sample of row) {
      const isLand = sample?.landMask === 1;
      const isWater = sample?.waterMask === 1;
      const terrainClass = typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
      const continentId = typeof sample?.continentId === "string" ? sample.continentId : "";

      if (isWater) waterFamilyCount += 1;
      if (isLand) landFamilyCount += 1;

      if (
        terrainClass === "POLAR_ICE" ||
        terrainClass === "GLACIAL_HIGHLAND" ||
        sample?.biomeType === "GLACIER" ||
        sample?.surfaceMaterial === "ICE" ||
        sample?.surfaceMaterial === "SNOW"
      ) {
        cryosphereCount += 1;
      }

      if (
        sample?.shoreline === true ||
        sample?.shorelineBand === true ||
        terrainClass === "SHORELINE" ||
        terrainClass === "BEACH"
      ) {
        shorelineCount += 1;
      }

      if (continentId) {
        continentCoverage[continentId] = (continentCoverage[continentId] ?? 0) + 1;
      }
    }
  }

  lastAuditPlanetField = planetField;
  lastAuditResult = {
    sampleCount: Array.isArray(planetField?.samples)
      ? planetField.samples.reduce((total, row) => total + (Array.isArray(row) ? row.length : 0), 0)
      : 0,
    waterFamilyCount,
    landFamilyCount,
    cryosphereCount,
    shorelineCount,
    continentCoverage,
    summary: normalizeObject(planetField?.summary)
  };

  return lastAuditResult;
}

function buildEmptyOrbitalAudit() {
  return {
    count: 0,
    frontVisibleCount: 0,
    emittedCount: 0,
    rejectedBackfaceCount: 0,
    rejectedWeakVisibilityCount: 0
  };
}

function buildEmptyPlacementAudit() {
  return {
    markerRequired: false,
    placementPlaced: 0,
    markerCollisionCount: 0,
    placementReservedReject: 0,
    placementViewportReject: 0,
    placementPass: false
  };
}

function buildScopeOnlyReturn(projectionState, liveRenderPath) {
  return {
    projectionState,
    orbitalHits: [],
    orbitalAudit: buildEmptyOrbitalAudit(),
    placementAudit: buildEmptyPlacementAudit(),
    primitive: {
      primitiveType: "NONE",
      primitivePath: liveRenderPath,
      centerAnchored: false,
      rowColumnPathActive: false,
      sectorBandPathActive: false
    },
    topology: {
      topologyMode: "NONE",
      neighborLaw: "NONE",
      visibleCellCount: 0,
      emittedCellCount: 0,
      skippedCellCount: 0
    },
    renderAuthority: {
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false,
      liveRenderPath
    },
    density: {
      averageCellSpanPx: 0,
      subdivisionTier: 0,
      densityTier: "EMPTY"
    },
    audit: {
      sampleCount: 0,
      waterFamilyCount: 0,
      landFamilyCount: 0,
      cryosphereCount: 0,
      shorelineCount: 0
    }
  };
}

function buildSurfaceReturn(projectionState, density, planetField) {
  return {
    projectionState,
    orbitalHits: [],
    orbitalAudit: buildEmptyOrbitalAudit(),
    placementAudit: buildEmptyPlacementAudit(),
    primitive: {
      primitiveType: density.primitiveType,
      primitivePath: density.primitivePath,
      centerAnchored: density.centerAnchored,
      rowColumnPathActive: density.rowColumnPathActive,
      sectorBandPathActive: density.sectorBandPathActive
    },
    topology: {
      topologyMode: density.topologyMode,
      neighborLaw: density.neighborLaw,
      visibleCellCount: density.visibleCellCount,
      emittedCellCount: density.emittedCellCount,
      skippedCellCount: density.skippedCellCount
    },
    renderAuthority: {
      renderReadsScope: density.renderReadsScope,
      renderReadsLens: density.renderReadsLens,
      fallbackMode: density.fallbackMode,
      liveRenderPath: density.liveRenderPath
    },
    density: {
      averageCellSpanPx: density.averageCellSpanPx,
      subdivisionTier: density.subdivisionTier,
      densityTier: density.densityTier
    },
    audit: buildRenderAudit(planetField)
  };
}

export function createRenderer() {
  function renderPlanet({
    ctx,
    planetField,
    projectPoint,
    viewState = {}
  }) {
    if (!ctx) {
      throw new Error("renderPlanet requires ctx.");
    }

    const projectionState = getProjectionState(viewState, ctx);
    const activeScope = projectionState.activeScope;
    const globalPrimitiveTime =
      viewState && typeof viewState === "object" && viewState.globalPrimitiveTime
        ? viewState.globalPrimitiveTime
        : null;

    ctx.clearRect(0, 0, projectionState.width, projectionState.height);

    if (activeScope === "UNIVERSE" || activeScope === "GALAXY") {
      drawDarkContainer(ctx, projectionState, activeScope);

      const liveRenderPath =
        activeScope === "UNIVERSE"
          ? "darkContainerUniverse"
          : "darkContainerGalaxy";

      return buildScopeOnlyReturn(projectionState, liveRenderPath);
    }

    if (!planetField) {
      throw new Error("renderPlanet requires planetField for GLOBAL/LOCAL scope.");
    }

    const grid = sampleGrid(planetField);
    const projector = resolveProjectPoint(projectPoint, projectionState);

    drawPlanetRim(ctx, projectionState);
    drawPlanetBase(ctx, projectionState);

    const density = withPlanetClip(
      ctx,
      projectionState,
      function renderVisibleSurfaceClipped() {
        return drawVisibleSurface(
          ctx,
          grid,
          projector,
          projectionState,
          globalPrimitiveTime
        );
      }
    );

    return buildSurfaceReturn(projectionState, density, planetField);
  }

  return {
    renderPlanet
  };
}

const DEFAULT_RENDERER = createRenderer();

export function renderPlanet(options) {
  return DEFAULT_RENDERER.renderPlanet(options);
}

export default DEFAULT_RENDERER;
