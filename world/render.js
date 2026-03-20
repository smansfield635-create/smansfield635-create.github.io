import { WORLD_KERNEL } from "./world_kernel.js";
import { describeSurface, isLandSample } from "./terrain_appearance_engine.js";

let lastAuditPlanetField = null;
let lastAuditTopologyField = null;
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

function getTopologyGrid(topologyField) {
  const rows = Array.isArray(topologyField?.samples) ? topologyField.samples : [];
  return Array.isArray(rows[0]) ? rows : [];
}

function getCanvasCssSize(ctx) {
  const canvas = ctx?.canvas;
  if (!canvas) return { width: 0, height: 0 };

  const rect = typeof canvas.getBoundingClientRect === "function"
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
    observeMode: state.observeMode === true
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
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(p00.x, p00.y);
  ctx.lineTo(p10.x, p10.y);
  ctx.lineTo(p11.x, p11.y);
  ctx.lineTo(p01.x, p01.y);
  ctx.closePath();
  ctx.fill();
}

function isCryosphere(sample) {
  const tc = typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
  return (
    tc === "POLAR_ICE" ||
    tc === "GLACIAL_HIGHLAND" ||
    sample?.biomeType === "GLACIER" ||
    sample?.surfaceMaterial === "ICE" ||
    sample?.surfaceMaterial === "SNOW"
  );
}

function isShoreline(sample) {
  const tc = typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
  return tc === "SHORELINE" || tc === "BEACH" || sample?.shoreline === true || sample?.shorelineBand === true;
}

function resolveElevationOffsetPx(sample, topology = null) {
  const rawElevation = isFiniteNumber(sample?.elevation) ? sample.elevation : 0;
  const amplifiedElevation = isFiniteNumber(topology?.elevationAmplified)
    ? topology.elevationAmplified
    : rawElevation;

  const relief = clamp(topology?.reliefComposite ?? 0, 0, 1);
  const ridge = clamp(topology?.ridgeAmplified ?? 0, 0, 1);
  const summit = clamp(topology?.summitAmplified ?? 0, 0, 1);
  const basin = clamp(topology?.basinAmplified ?? 0, 0, 1);
  const canyon = clamp(topology?.canyonAmplified ?? 0, 0, 1);

  const reliefLift =
    relief * 4.2 +
    ridge * 2.6 +
    summit * 4.8 -
    basin * 1.6 -
    canyon * 1.0;

  const landBoost = isLandSample(sample) ? 1 : 0;
  const offset =
    clamp(amplifiedElevation, -1, 1) * 12 +
    landBoost * reliefLift;

  return clamp(offset, -10, 20);
}

function pointFromSample(sample, projectPoint, topology = null) {
  return projectPoint(sample.latDeg, sample.lonDeg, resolveElevationOffsetPx(sample, topology));
}

function getTopologySample(topologyGrid, x, y) {
  return topologyGrid?.[y]?.[x] || null;
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

  if (projectionState.observeMode) {
    rim.addColorStop(0.98, "rgba(132,188,255,0.06)");
    rim.addColorStop(1, "rgba(170,220,255,0.10)");
  } else {
    rim.addColorStop(0.98, "rgba(132,188,255,0.08)");
    rim.addColorStop(1, "rgba(170,220,255,0.16)");
  }

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
  ctx.strokeStyle = projectionState.observeMode
    ? "rgba(188,220,255,0.12)"
    : "rgba(188,220,255,0.18)";
  ctx.lineWidth = projectionState.observeMode ? 0.9 : 1.1;
  ctx.stroke();

  ctx.restore();
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

function drawSurfaceMesh(ctx, grid, topologyGrid, projectPoint) {
  if (!grid.length || !grid[0].length) return;

  const rowCount = grid.length;
  const rowStride = rowCount >= 100 ? 2 : 1;

  ctx.save();

  for (let y = 0; y < rowCount - rowStride; y += rowStride) {
    const row = grid[y];
    const nextRow = grid[y + rowStride];
    const rowLength = row.length;
    const colStride = rowLength >= 200 ? 2 : 1;

    for (let x = 0; x < rowLength; x += colStride) {
      const nextX = (x + colStride) % rowLength;

      const s00 = row[x];
      const s10 = row[nextX];
      const s01 = nextRow[x];
      const s11 = nextRow[nextX];

      const t00 = getTopologySample(topologyGrid, x, y);
      const t10 = getTopologySample(topologyGrid, nextX, y);
      const t01 = getTopologySample(topologyGrid, x, y + rowStride);
      const t11 = getTopologySample(topologyGrid, nextX, y + rowStride);

      const p00 = pointFromSample(s00, projectPoint, t00);
      const p10 = pointFromSample(s10, projectPoint, t10);
      const p01 = pointFromSample(s01, projectPoint, t01);
      const p11 = pointFromSample(s11, projectPoint, t11);

      if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

      const appearance = describeSurface(s00, p00, t00);
      const fillStyle = `rgb(${Math.round(clamp(appearance.fillColor.r, 0, 255))}, ${Math.round(clamp(appearance.fillColor.g, 0, 255))}, ${Math.round(clamp(appearance.fillColor.b, 0, 255))})`;

      drawQuad(ctx, p00, p10, p11, p01, fillStyle, appearance.fillAlpha);
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function buildRenderAudit(planetField, topologyField = null) {
  if (planetField === lastAuditPlanetField && topologyField === lastAuditTopologyField && lastAuditResult) {
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

  lastAuditPlanetField = planetField;
  lastAuditTopologyField = topologyField;
  lastAuditResult = {
    sampleCount: Array.isArray(planetField?.samples)
      ? planetField.samples.reduce((total, row) => total + (Array.isArray(row) ? row.length : 0), 0)
      : 0,
    waterFamilyCount,
    landFamilyCount,
    cryosphereCount,
    shorelineCount,
    continentCoverage,
    summary: normalizeObject(planetField?.summary),
    topologySummary: normalizeObject(topologyField?.summary)
  };

  return lastAuditResult;
}

function resolveOrbitalAltitudePx(orbitalSystem, projectionState) {
  const factor = isFiniteNumber(orbitalSystem?.altitudeFactor)
    ? orbitalSystem.altitudeFactor
    : 0.42;
  return projectionState.radius * factor;
}

function normalizeOrbitalHit(point, object, edgeVisibility) {
  const sizePx = isFiniteNumber(object?.sizePx) ? object.sizePx : 20;
  const scale = 0.88 + edgeVisibility * 0.28;
  const opacity = 0.52 + edgeVisibility * 0.44;

  return {
    id: typeof object?.id === "string" ? object.id : "",
    label: typeof object?.label === "string" ? object.label : "",
    route: typeof object?.route === "string" ? object.route : "",
    x: point.x,
    y: point.y,
    radius: sizePx * scale * 0.72,
    opacity,
    frontFacing: point.z >= 0,
    edgeVisibility,
    z: point.z
  };
}

function isAdmissibleOrbitalHit(hit) {
  return (
    typeof hit.id === "string" &&
    hit.id.length > 0 &&
    isFiniteNumber(hit.x) &&
    isFiniteNumber(hit.y) &&
    isFiniteNumber(hit.radius) &&
    hit.radius > 0 &&
    hit.frontFacing === true &&
    isFiniteNumber(hit.opacity) &&
    hit.opacity >= 0.62 &&
    isFiniteNumber(hit.edgeVisibility) &&
    hit.edgeVisibility >= 0.34 &&
    isFiniteNumber(hit.z) &&
    hit.z >= 0.08
  );
}

function buildOrbitalHits(orbitalSystem, projectPoint, projectionState) {
  const objects = Array.isArray(orbitalSystem?.objects) ? orbitalSystem.objects : [];
  if (!objects.length) {
    return {
      orbitalHits: [],
      orbitalAudit: {
        count: 0,
        frontVisibleCount: 0,
        emittedCount: 0,
        rejectedBackfaceCount: 0,
        rejectedWeakVisibilityCount: 0
      }
    };
  }

  const phase = isFiniteNumber(orbitalSystem?.phase) ? orbitalSystem.phase : 0;
  const altitudePx = resolveOrbitalAltitudePx(orbitalSystem, projectionState);

  const hits = [];
  let frontVisibleCount = 0;
  let rejectedBackfaceCount = 0;
  let rejectedWeakVisibilityCount = 0;

  for (const object of objects) {
    const baseLatDeg = isFiniteNumber(object?.baseLatDeg) ? object.baseLatDeg : 0;
    const baseLonDeg = isFiniteNumber(object?.baseLonDeg) ? object.baseLonDeg : 0;
    const bearingOffsetDeg = isFiniteNumber(object?.bearingOffsetDeg) ? object.bearingOffsetDeg : 0;
    const spinOffsetRad = isFiniteNumber(object?.spinOffsetRad) ? object.spinOffsetRad : 0;
    const spinMultiplier = isFiniteNumber(object?.spinMultiplier) ? object.spinMultiplier : 1;

    const lonDeg =
      baseLonDeg +
      bearingOffsetDeg +
      (((phase * spinMultiplier) + spinOffsetRad) * 180) / Math.PI;

    const point = projectPoint(baseLatDeg, lonDeg, altitudePx);
    const edgeVisibility = clamp((point.z + 1) * 0.5, 0, 1);

    if (point.z >= 0) {
      frontVisibleCount += 1;
    }

    if (point.z < 0.08) {
      rejectedBackfaceCount += 1;
      continue;
    }

    const hit = normalizeOrbitalHit(point, object, edgeVisibility);

    if (!isAdmissibleOrbitalHit(hit)) {
      rejectedWeakVisibilityCount += 1;
      continue;
    }

    hits.push(hit);
  }

  return {
    orbitalHits: hits,
    orbitalAudit: {
      count: objects.length,
      frontVisibleCount,
      emittedCount: hits.length,
      rejectedBackfaceCount,
      rejectedWeakVisibilityCount
    }
  };
}

export function createRenderer() {
  function renderPlanet({
    ctx,
    planetField,
    topologyField = null,
    projectPoint,
    viewState = {},
    orbitalSystem = null
  }) {
    if (!ctx || !planetField) {
      throw new Error("renderPlanet requires ctx and planetField.");
    }

    const grid = sampleGrid(planetField);
    const topologyGrid = getTopologyGrid(topologyField);
    const projectionState = getProjectionState(viewState, ctx);
    const projector = resolveProjectPoint(projectPoint, projectionState);

    ctx.clearRect(0, 0, projectionState.width, projectionState.height);

    drawPlanetRim(ctx, projectionState);
    drawPlanetBase(ctx, projectionState);

    withPlanetClip(ctx, projectionState, () => {
      drawSurfaceMesh(ctx, grid, topologyGrid, projector);
    });

    const orbitalReceipt = buildOrbitalHits(orbitalSystem, projector, projectionState);

    return {
      projectionState,
      orbitalHits: orbitalReceipt.orbitalHits,
      orbitalAudit: orbitalReceipt.orbitalAudit,
      audit: buildRenderAudit(planetField, topologyField)
    };
  }

  return {
    renderPlanet
  };
}

const DEFAULT_RENDERER = createRenderer();

export function renderPlanet(options) {
  return DEFAULT_RENDERER.renderPlanet(options);
}
