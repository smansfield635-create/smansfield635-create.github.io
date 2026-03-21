import { WORLD_KERNEL } from "./world_kernel.js";
import { describeSurface, isLandSample } from "./terrain_appearance_engine.js";
import { resolveHydrationPacket } from "./render/hydation_render_engine.js";

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

  const activeScope = normalizeScopeName(state.activeScope);
  const lensTier = normalizeLensTier(state.lensTier);

  return {
    width,
    height,
    centerX: isFiniteNumber(state.centerX) ? state.centerX : width * 0.5,
    centerY: isFiniteNumber(state.centerY) ? state.centerY : height * 0.5,
    radius: isFiniteNumber(state.radius)
      ? state.radius
      : Math.min(width, height) * (WORLD_KERNEL?.constants?.worldRadiusFactor ?? 0.36),
    activeScope,
    lensTier,
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
  const result = drawFn();
  ctx.restore();
  return result;
}

function shouldDrawPoints(points, minimumVisible = 2) {
  let visibleCount = 0;
  for (let i = 0; i < points.length; i += 1) {
    if (points[i]?.visible === true) visibleCount += 1;
  }
  return visibleCount >= minimumVisible;
}

function drawPolygon(ctx, points, fillStyle, alpha = 1) {
  if (!points.length) return;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
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

function midpointPoint(a, b) {
  return {
    x: (a.x + b.x) * 0.5,
    y: (a.y + b.y) * 0.5,
    z: (a.z + b.z) * 0.5,
    visible: a.visible || b.visible,
    resolvedRadius: isFiniteNumber(a.resolvedRadius) && isFiniteNumber(b.resolvedRadius)
      ? (a.resolvedRadius + b.resolvedRadius) * 0.5
      : (a.resolvedRadius ?? b.resolvedRadius ?? 0)
  };
}

function averagePoint(points) {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const p of points) {
    x += p.x;
    y += p.y;
    z += p.z;
  }
  const n = points.length || 1;
  return {
    x: x / n,
    y: y / n,
    z: z / n
  };
}

function getLensConfig(activeScope, lensTier) {
  if (activeScope === "LOCAL") {
    if (lensTier === 3) {
      return {
        rowStrideCutoff: 999999,
        colStrideCutoff: 999999,
        ringScale: 1.0,
        tangentialSkew: 0.020,
        radialBias: 0.040,
        densityBias: 1.15
      };
    }
    if (lensTier === 2) {
      return {
        rowStrideCutoff: 180,
        colStrideCutoff: 320,
        ringScale: 1.0,
        tangentialSkew: 0.014,
        radialBias: 0.028,
        densityBias: 0.60
      };
    }
  }

  return {
    rowStrideCutoff: 120,
    colStrideCutoff: 220,
    ringScale: 1.0,
    tangentialSkew: 0.010,
    radialBias: 0.018,
    densityBias: 0.0
  };
}

function buildForwardSignalDiamond(centerPoint, northPoint, eastPoint, southPoint, westPoint, sample, projectionState) {
  const northMid = midpointPoint(centerPoint, northPoint);
  const eastMid = midpointPoint(centerPoint, eastPoint);
  const southMid = midpointPoint(centerPoint, southPoint);
  const westMid = midpointPoint(centerPoint, westPoint);

  const points = [northMid, eastMid, southMid, westMid];
  const center = averagePoint(points);

  const latitudeRad = (sample.latDeg * Math.PI) / 180;
  const latAbs = Math.abs(Math.sin(latitudeRad));
  const avgZ = clamp((northMid.z + eastMid.z + southMid.z + westMid.z) * 0.25, -1, 1);
  const edgeFactor = 1 - clamp((avgZ + 1) * 0.5, 0, 1);
  const curvatureFactor = clamp(latAbs * 0.55 + edgeFactor * 0.85, 0, 1);
  const lens = getLensConfig(projectionState.activeScope, projectionState.lensTier);

  const phase = ((sample.lonDeg + 180) / 360) * Math.PI * 2 + latitudeRad * 0.35;
  const tangential = Math.sin(phase) * lens.tangentialSkew * (0.35 + curvatureFactor * 0.65);
  const radialBias = lens.radialBias * (0.25 + curvatureFactor * 0.75);

  const ordered = [northMid, eastMid, southMid, westMid].map((point, index) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    const radialScale = 1 + radialBias * (index % 2 === 0 ? 0.9 : 1.0);
    const tx = -dy * tangential;
    const ty = dx * tangential;

    return {
      ...point,
      x: center.x + dx * radialScale + tx,
      y: center.y + dy * radialScale + ty
    };
  });

  return {
    points: ordered,
    curvatureFactor
  };
}

function resolveCellDensity(sample, polygonPoints, projectionState) {
  const latitudeRad = (sample.latDeg * Math.PI) / 180;
  const latAbs = Math.abs(Math.sin(latitudeRad));
  const avgZ = clamp(
    polygonPoints.reduce((sum, point) => sum + point.z, 0) / Math.max(1, polygonPoints.length),
    -1,
    1
  );
  const edgeFactor = 1 - clamp((avgZ + 1) * 0.5, 0, 1);

  let span = 0;
  for (let i = 0; i < polygonPoints.length; i += 1) {
    const a = polygonPoints[i];
    const b = polygonPoints[(i + 1) % polygonPoints.length];
    span = Math.max(span, Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  const lens = getLensConfig(projectionState.activeScope, projectionState.lensTier);
  const zoomFactor = clamp(
    projectionState.radius / Math.max(1, Math.min(projectionState.width, projectionState.height) * 0.28),
    0,
    3
  );

  return span / 16 + edgeFactor * 1.35 + latAbs * 0.75 + zoomFactor * 0.30 + lens.densityBias;
}

function measurePolygonSpan(points) {
  let span = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    span = Math.max(span, Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }
  return span;
}

function resolveDensityTier(averageCellSpanPx, emittedCellCount) {
  if (emittedCellCount <= 0) return "EMPTY";
  if (averageCellSpanPx <= 6) return "HIGH";
  if (averageCellSpanPx <= 12) return "MEDIUM";
  return "LOW";
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

  const isLocal = projectionState.activeScope === "LOCAL";
  const lensTier = projectionState.lensTier;

  if (isLocal && lensTier >= 2) {
    rim.addColorStop(0.98, "rgba(132,188,255,0.05)");
    rim.addColorStop(1, "rgba(170,220,255,0.08)");
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
  ctx.strokeStyle = isLocal && lensTier >= 2
    ? "rgba(188,220,255,0.11)"
    : "rgba(188,220,255,0.18)";
  ctx.lineWidth = isLocal && lensTier >= 2 ? 0.9 : 1.1;
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

/*
  EXPRESSION HUB CONTRACT

  render.js is the stable orchestrator.
  Downstream render engines may later plug into these resolver functions.

  Current baseline-preserving policy:
  - no downstream engine required
  - all cells resolve to full forward-signal diamonds
  - hooks exist now so downstream files can be attached later
*/

function normalizeHydrationInstruction(packet, signalCell, projectionState) {
  if (!packet || typeof packet !== "object") return null;

  const hydrationClass = typeof packet.hydrationClass === "string" ? packet.hydrationClass : "NONE";
  const primitivePoints = Array.isArray(packet.hydrationPrimitivePoints) ? packet.hydrationPrimitivePoints : null;

  if (
    hydrationClass === "NONE" ||
    hydrationClass === "NON_HYDRATION_DOMAIN" ||
    !primitivePoints ||
    primitivePoints.length < 3
  ) {
    return null;
  }

  return {
    primitiveType: typeof packet.hydrationPrimitiveType === "string" ? packet.hydrationPrimitiveType : "HYDRATION_SIGNAL",
    primitiveScale: clamp(isFiniteNumber(packet.hydrationBlendStrength) ? packet.hydrationBlendStrength : 1, 0, 1),
    primitivePoints,
    boundaryClass: typeof packet.hydrationBandClass === "string" ? packet.hydrationBandClass : "HYDRATION",
    subdivisionTier: isFiniteNumber(packet.subdivisionTier) ? packet.subdivisionTier : projectionState.lensTier,
    approxSpanPx: isFiniteNumber(packet.approxSpanPx) ? packet.approxSpanPx : measurePolygonSpan(primitivePoints),
    hydrationClass,
    hydrationBandClass: typeof packet.hydrationBandClass === "string" ? packet.hydrationBandClass : "NONE",
    hydrationOverlayClass: typeof packet.hydrationOverlayClass === "string" ? packet.hydrationOverlayClass : "NONE",
    shoreHandoffClass: typeof packet.shoreHandoffClass === "string" ? packet.shoreHandoffClass : "NONE",
    freezeThawClass: typeof packet.freezeThawClass === "string" ? packet.freezeThawClass : "NONE"
  };
}

function resolvePrimitiveInstruction({
  sample,
  signalCell,
  x,
  y,
  grid,
  topology,
  projectionState,
  globalPrimitiveTime = null
}) {
  const hydrationInstruction = normalizeHydrationInstruction(
    typeof resolveHydrationPacket === "function"
      ? resolveHydrationPacket({
          sample,
          signalCell,
          x,
          y,
          grid,
          topology,
          projectionState,
          globalPrimitiveTime
        })
      : null,
    signalCell,
    projectionState
  );

  if (hydrationInstruction) {
    return hydrationInstruction;
  }

  return {
    primitiveType: "FULL_DIAMOND",
    primitiveScale: 1,
    primitivePoints: signalCell.points,
    boundaryClass: "INTERIOR",
    subdivisionTier: projectionState.lensTier,
    approxSpanPx: measurePolygonSpan(signalCell.points),
    hydrationClass: "NONE",
    hydrationBandClass: "NONE",
    hydrationOverlayClass: "NONE",
    shoreHandoffClass: "NONE",
    freezeThawClass: "NONE"
  };
}

function emitCellPolygon(ctx, fillStyle, alpha, primitiveInstruction) {
  drawPolygon(ctx, primitiveInstruction.primitivePoints, fillStyle, alpha);
}

function renderSignalCell({
  ctx,
  sample,
  signalCell,
  topology,
  x,
  y,
  grid,
  projectionState,
  globalPrimitiveTime = null
}) {
  const appearance = describeSurface(sample, signalCell.points[0], topology);
  const fillStyle = `rgb(${Math.round(clamp(appearance.fillColor.r, 0, 255))}, ${Math.round(clamp(appearance.fillColor.g, 0, 255))}, ${Math.round(clamp(appearance.fillColor.b, 0, 255))})`;
  const alpha = appearance.fillAlpha * (0.95 + signalCell.curvatureFactor * 0.05);

  const primitiveInstruction = resolvePrimitiveInstruction({
    sample,
    signalCell,
    x,
    y,
    grid,
    topology,
    projectionState,
    globalPrimitiveTime
  });

  emitCellPolygon(ctx, fillStyle, alpha, primitiveInstruction);

  return {
    primitiveInstruction,
    polygonSpanPx: isFiniteNumber(primitiveInstruction.approxSpanPx)
      ? primitiveInstruction.approxSpanPx
      : measurePolygonSpan(primitiveInstruction.primitivePoints)
  };
}

function drawForwardSignalMesh(ctx, grid, topologyGrid, projectPoint, projectionState, globalPrimitiveTime = null) {
  if (!grid.length || !grid[0].length) {
    return {
      visibleCellCount: 0,
      emittedCellCount: 0,
      skippedCellCount: 0,
      averageCellSpanPx: 0,
      subdivisionTier: projectionState.lensTier,
      densityTier: "EMPTY",
      primitiveType: "FORWARD_SIGNAL",
      primitivePath: "forwardSignalDiamond",
      centerAnchored: true,
      rowColumnPathActive: true,
      sectorBandPathActive: false,
      topologyMode: "HYBRID",
      neighborLaw: "CROSS_GRID",
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false,
      liveRenderPath: "drawForwardSignalMesh"
    };
  }

  const rowCount = grid.length;
  const rowLength = grid[0].length;
  const lens = getLensConfig(projectionState.activeScope, projectionState.lensTier);
  const rowStride = rowCount >= lens.rowStrideCutoff ? 2 : 1;
  const colStride = rowLength >= lens.colStrideCutoff ? 2 : 1;

  let visibleCellCount = 0;
  let emittedCellCount = 0;
  let skippedCellCount = 0;
  let totalCellSpanPx = 0;
  let maxSubdivisionTier = projectionState.lensTier;
  let sawHydrationPrimitive = false;
  let sawHydrationBand = false;

  ctx.save();

  for (let y = rowStride; y < rowCount - rowStride; y += rowStride) {
    const row = grid[y];

    for (let x = 0; x < rowLength; x += colStride) {
      visibleCellCount += 1;

      const westX = (x - colStride + rowLength) % rowLength;
      const eastX = (x + colStride) % rowLength;

      const centerSample = row[x];
      const northSample = grid[y - rowStride]?.[x];
      const southSample = grid[y + rowStride]?.[x];
      const westSample = row[westX];
      const eastSample = row[eastX];

      if (!centerSample || !northSample || !southSample || !westSample || !eastSample) {
        skippedCellCount += 1;
        continue;
      }

      const centerTopology = getTopologySample(topologyGrid, x, y);
      const northTopology = getTopologySample(topologyGrid, x, y - rowStride);
      const southTopology = getTopologySample(topologyGrid, x, y + rowStride);
      const westTopology = getTopologySample(topologyGrid, westX, y);
      const eastTopology = getTopologySample(topologyGrid, eastX, y);

      const centerPoint = pointFromSample(centerSample, projectPoint, centerTopology);
      const northPoint = pointFromSample(northSample, projectPoint, northTopology);
      const southPoint = pointFromSample(southSample, projectPoint, southTopology);
      const westPoint = pointFromSample(westSample, projectPoint, westTopology);
      const eastPoint = pointFromSample(eastSample, projectPoint, eastTopology);

      if (!centerPoint.visible && !shouldDrawPoints([northPoint, eastPoint, southPoint, westPoint], 2)) {
        skippedCellCount += 1;
        continue;
      }

      const signalCell = buildForwardSignalDiamond(
        centerPoint,
        northPoint,
        eastPoint,
        southPoint,
        westPoint,
        centerSample,
        projectionState
      );

      if (!shouldDrawPoints(signalCell.points, 2)) {
        skippedCellCount += 1;
        continue;
      }

      const densityScore = resolveCellDensity(centerSample, signalCell.points, projectionState);
      if (densityScore < 0.2) {
        skippedCellCount += 1;
        continue;
      }

      const renderResult = renderSignalCell({
        ctx,
        sample: centerSample,
        signalCell,
        topology: centerTopology,
        x,
        y,
        grid,
        projectionState,
        globalPrimitiveTime
      });

      emittedCellCount += 1;
      totalCellSpanPx += renderResult.polygonSpanPx;
      maxSubdivisionTier = Math.max(
        maxSubdivisionTier,
        isFiniteNumber(renderResult.primitiveInstruction.subdivisionTier)
          ? renderResult.primitiveInstruction.subdivisionTier
          : projectionState.lensTier
      );

      if (renderResult.primitiveInstruction.hydrationClass !== "NONE") {
        sawHydrationPrimitive = true;
      }

      if (
        renderResult.primitiveInstruction.hydrationBandClass !== "NONE" ||
        renderResult.primitiveInstruction.shoreHandoffClass !== "NONE"
      ) {
        sawHydrationBand = true;
      }
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();

  const averageCellSpanPx = emittedCellCount > 0 ? totalCellSpanPx / emittedCellCount : 0;

  return {
    visibleCellCount,
    emittedCellCount,
    skippedCellCount,
    averageCellSpanPx,
    subdivisionTier: maxSubdivisionTier,
    densityTier: resolveDensityTier(averageCellSpanPx, emittedCellCount),
    primitiveType: sawHydrationPrimitive ? "HYDRATION_SIGNAL" : "FORWARD_SIGNAL",
    primitivePath: sawHydrationPrimitive ? "hydrationRenderEngine" : "forwardSignalDiamond",
    centerAnchored: true,
    rowColumnPathActive: true,
    sectorBandPathActive: sawHydrationBand,
    topologyMode: "HYBRID",
    neighborLaw: "CROSS_GRID",
    renderReadsScope: true,
    renderReadsLens: true,
    fallbackMode: false,
    liveRenderPath: "drawForwardSignalMesh"
  };
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

      return {
        projectionState,
        orbitalHits: [],
        orbitalAudit: {
          count: 0,
          frontVisibleCount: 0,
          emittedCount: 0,
          rejectedBackfaceCount: 0,
          rejectedWeakVisibilityCount: 0
        },
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

    if (!planetField) {
      throw new Error("renderPlanet requires planetField for GLOBAL/LOCAL scope.");
    }

    const grid = sampleGrid(planetField);
    const topologyGrid = getTopologyGrid(topologyField);
    const projector = resolveProjectPoint(projectPoint, projectionState);

    drawPlanetRim(ctx, projectionState);
    drawPlanetBase(ctx, projectionState);

    const density = withPlanetClip(ctx, projectionState, () => {
      return drawForwardSignalMesh(ctx, grid, topologyGrid, projector, projectionState, globalPrimitiveTime);
    });

    const orbitalReceipt = buildOrbitalHits(orbitalSystem, projector, projectionState);

    return {
      projectionState,
      orbitalHits: orbitalReceipt.orbitalHits,
      orbitalAudit: orbitalReceipt.orbitalAudit,
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
