import { WORLD_KERNEL } from "./world_kernel.js";
import { describeSurface, isLandSample } from "./terrain_appearance_engine.js";

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

function interpolateSample(s00, s10, s01, s11, fx, fy, crossesSeam = false) {
  if (crossesSeam) {
    const sx = fx < 0.5 ? 0 : 1;
    const sy = fy < 0.5 ? 0 : 1;
    if (sx === 0 && sy === 0) return Object.freeze({ ...s00 });
    if (sx === 1 && sy === 0) return Object.freeze({ ...s10 });
    if (sx === 0 && sy === 1) return Object.freeze({ ...s01 });
    return Object.freeze({ ...s11 });
  }

  const oneMinusFx = 1 - fx;
  const oneMinusFy = 1 - fy;

  return Object.freeze({
    latDeg:
      s00.latDeg * oneMinusFx * oneMinusFy +
      s10.latDeg * fx * oneMinusFy +
      s01.latDeg * oneMinusFx * fy +
      s11.latDeg * fx * fy,
    lonDeg:
      s00.lonDeg * oneMinusFx * oneMinusFy +
      s10.lonDeg * fx * oneMinusFy +
      s01.lonDeg * oneMinusFx * fy +
      s11.lonDeg * fx * fy,
    elevation:
      (isFiniteNumber(s00.elevation) ? s00.elevation : 0) * oneMinusFx * oneMinusFy +
      (isFiniteNumber(s10.elevation) ? s10.elevation : 0) * fx * oneMinusFy +
      (isFiniteNumber(s01.elevation) ? s01.elevation : 0) * oneMinusFx * fy +
      (isFiniteNumber(s11.elevation) ? s11.elevation : 0) * fx * fy,
    oceanDepthField:
      (isFiniteNumber(s00.oceanDepthField) ? s00.oceanDepthField : 0) * oneMinusFx * oneMinusFy +
      (isFiniteNumber(s10.oceanDepthField) ? s10.oceanDepthField : 0) * fx * oneMinusFy +
      (isFiniteNumber(s01.oceanDepthField) ? s01.oceanDepthField : 0) * oneMinusFx * fy +
      (isFiniteNumber(s11.oceanDepthField) ? s11.oceanDepthField : 0) * fx * fy,
    terrainClass: s00.terrainClass,
    biomeType: s00.biomeType,
    surfaceMaterial: s00.surfaceMaterial,
    shoreline: s00.shoreline,
    shorelineBand: s00.shorelineBand,
    landMask: s00.landMask,
    waterMask: s00.waterMask,
    auroralPotential: s00.auroralPotential,
    rainfall: s00.rainfall,
    evaporationPressure: s00.evaporationPressure,
    maritimeInfluence: s00.maritimeInfluence,
    continentId: s00.continentId
  });
}

function interpolateTopology(t00, t10, t01, t11, fx, fy, crossesSeam = false) {
  if (crossesSeam) {
    const sx = fx < 0.5 ? 0 : 1;
    const sy = fy < 0.5 ? 0 : 1;
    if (sx === 0 && sy === 0) return Object.freeze({ ...(t00 || {}) });
    if (sx === 1 && sy === 0) return Object.freeze({ ...(t10 || {}) });
    if (sx === 0 && sy === 1) return Object.freeze({ ...(t01 || {}) });
    return Object.freeze({ ...(t11 || {}) });
  }

  const a = t00 || t10 || t01 || t11 || {};
  const b = t10 || t00 || t11 || t01 || a;
  const c = t01 || t11 || t00 || t10 || a;
  const d = t11 || t01 || t10 || t00 || a;

  const oneMinusFx = 1 - fx;
  const oneMinusFy = 1 - fy;

  function blend(key) {
    return (
      (isFiniteNumber(a[key]) ? a[key] : 0) * oneMinusFx * oneMinusFy +
      (isFiniteNumber(b[key]) ? b[key] : 0) * fx * oneMinusFy +
      (isFiniteNumber(c[key]) ? c[key] : 0) * oneMinusFx * fy +
      (isFiniteNumber(d[key]) ? d[key] : 0) * fx * fy
    );
  }

  return Object.freeze({
    ridgeAmplified: blend("ridgeAmplified"),
    basinAmplified: blend("basinAmplified"),
    summitAmplified: blend("summitAmplified"),
    canyonAmplified: blend("canyonAmplified"),
    coastAmplified: blend("coastAmplified"),
    reliefComposite: blend("reliefComposite"),
    squareMaskStrength: blend("squareMaskStrength"),
    elevationAmplified: blend("elevationAmplified")
  });
}

function resolveStableSubdiv(c00, c10, c11, c01) {
  const minZ = Math.min(
    c00?.z ?? -1,
    c10?.z ?? -1,
    c11?.z ?? -1,
    c01?.z ?? -1
  );

  if (minZ > 0.42) return 2;
  return 1;
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

  for (let y = 0; y < grid.length - 1; y += 1) {
    const row = grid[y];
    const nextRow = grid[y + 1];

    for (let x = 0; x < row.length; x += 1) {
      const nextX = (x + 1) % row.length;
      const crossesSeam = x === row.length - 1;

      const s00 = row[x];
      const s10 = row[nextX];
      const s01 = nextRow[x];
      const s11 = nextRow[nextX];

      const t00 = getTopologySample(topologyGrid, x, y);
      const t10 = getTopologySample(topologyGrid, nextX, y);
      const t01 = getTopologySample(topologyGrid, x, y + 1);
      const t11 = getTopologySample(topologyGrid, nextX, y + 1);

      const c00 = pointFromSample(s00, projectPoint, t00);
      const c10 = pointFromSample(s10, projectPoint, t10);
      const c01 = pointFromSample(s01, projectPoint, t01);
      const c11 = pointFromSample(s11, projectPoint, t11);

      if (!shouldDrawQuad([c00, c10, c11, c01])) continue;

      const subdiv = crossesSeam ? 1 : resolveStableSubdiv(c00, c10, c11, c01);

      for (let sy = 0; sy < subdiv; sy += 1) {
        for (let sx = 0; sx < subdiv; sx += 1) {
          const fx0 = sx / subdiv;
          const fy0 = sy / subdiv;
          const fx1 = (sx + 1) / subdiv;
          const fy1 = (sy + 1) / subdiv;

          const sm00 = interpolateSample(s00, s10, s01, s11, fx0, fy0, crossesSeam);
          const sm10 = interpolateSample(s00, s10, s01, s11, fx1, fy0, crossesSeam);
          const sm01 = interpolateSample(s00, s10, s01, s11, fx0, fy1, crossesSeam);
          const sm11 = interpolateSample(s00, s10, s01, s11, fx1, fy1, crossesSeam);

          const tm00 = interpolateTopology(t00, t10, t01, t11, fx0, fy0, crossesSeam);
          const tm10 = interpolateTopology(t00, t10, t01, t11, fx1, fy0, crossesSeam);
          const tm01 = interpolateTopology(t00, t10, t01, t11, fx0, fy1, crossesSeam);
          const tm11 = interpolateTopology(t00, t10, t01, t11, fx1, fy1, crossesSeam);

          const p00 = pointFromSample(sm00, projectPoint, tm00);
          const p10 = pointFromSample(sm10, projectPoint, tm10);
          const p01 = pointFromSample(sm01, projectPoint, tm01);
          const p11 = pointFromSample(sm11, projectPoint, tm11);

          if (!shouldDrawQuad([p00, p10, p11, p01])) continue;

          const appearanceA = describeSurface(sm00, p00, tm00);
          const appearanceB = describeSurface(sm11, p11, tm11);
          const blendedColor = {
            r: appearanceA.fillColor.r + (appearanceB.fillColor.r - appearanceA.fillColor.r) * 0.08,
            g: appearanceA.fillColor.g + (appearanceB.fillColor.g - appearanceA.fillColor.g) * 0.08,
            b: appearanceA.fillColor.b + (appearanceB.fillColor.b - appearanceA.fillColor.b) * 0.08
          };
          const fillStyle = `rgb(${Math.round(clamp(blendedColor.r, 0, 255))}, ${Math.round(clamp(blendedColor.g, 0, 255))}, ${Math.round(clamp(blendedColor.b, 0, 255))})`;
          const alpha = appearanceA.fillAlpha;

          drawQuad(ctx, p00, p10, p11, p01, fillStyle, alpha);
        }
      }
    }
  }
}

function drawCloudLayer(ctx, grid, projectPoint, projectionState) {
  ctx.save();

  for (let y = 0; y < grid.length; y += 4) {
    for (let x = 0; x < grid[y].length; x += 4) {
      const sample = grid[y][x];
      const cloudiness = clamp(
        (sample?.rainfall ?? 0) * 0.52 +
        (sample?.evaporationPressure ?? 0) * 0.18 +
        (sample?.maritimeInfluence ?? 0) * 0.14,
        0,
        1
      );

      if (cloudiness < 0.58) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, 12);
      if (!point.visible) continue;

      const radius = 1.2 + cloudiness * (projectionState.observeMode ? 2.8 : 3.2);
      const alpha = projectionState.observeMode
        ? 0.014 + cloudiness * 0.03
        : 0.02 + cloudiness * 0.046;

      const grad = ctx.createRadialGradient(
        point.x - radius * 0.2,
        point.y - radius * 0.25,
        radius * 0.1,
        point.x,
        point.y,
        radius
      );
      grad.addColorStop(0, `rgba(255,255,255,${(alpha * 1.3).toFixed(3)})`);
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
      if (aurora < 0.54) continue;

      const point = projectPoint(sample.latDeg, sample.lonDeg, 14);
      if (!point.visible) continue;

      const radius = 1.2 + aurora * (projectionState.observeMode ? 2.2 : 2.8);
      const alpha = projectionState.observeMode
        ? 0.01 + aurora * 0.026
        : 0.014 + aurora * 0.036;

      const grad = ctx.createRadialGradient(
        point.x,
        point.y,
        radius * 0.1,
        point.x,
        point.y,
        radius
      );
      grad.addColorStop(0, `rgba(136,255,186,${(alpha * 1.12).toFixed(3)})`);
      grad.addColorStop(0.55, `rgba(96,220,255,${(alpha * 0.94).toFixed(3)})`);
      grad.addColorStop(1, "rgba(96,220,255,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function buildRenderAudit(planetField, topologyField = null) {
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
    summary: normalizeObject(planetField?.summary),
    topologySummary: normalizeObject(topologyField?.summary)
  });
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

  return Object.freeze({
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
  });
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
    return Object.freeze({
      orbitalHits: Object.freeze([]),
      orbitalAudit: Object.freeze({
        count: 0,
        frontVisibleCount: 0,
        emittedCount: 0,
        rejectedBackfaceCount: 0,
        rejectedWeakVisibilityCount: 0
      })
    });
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

  return Object.freeze({
    orbitalHits: Object.freeze(hits),
    orbitalAudit: Object.freeze({
      count: objects.length,
      frontVisibleCount,
      emittedCount: hits.length,
      rejectedBackfaceCount,
      rejectedWeakVisibilityCount
    })
  });
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
      drawCloudLayer(ctx, grid, projector, projectionState);
      drawPolarGlow(ctx, grid, projector, projectionState);
    });

    const orbitalReceipt = buildOrbitalHits(orbitalSystem, projector, projectionState);

    return Object.freeze({
      projectionState,
      orbitalHits: orbitalReceipt.orbitalHits,
      orbitalAudit: orbitalReceipt.orbitalAudit,
      audit: buildRenderAudit(planetField, topologyField)
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
