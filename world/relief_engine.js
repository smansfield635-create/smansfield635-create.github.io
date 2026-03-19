export function createReliefEngine(config = {}) {
  const LAND_SHADE = Number.isFinite(config.landShade) ? config.landShade : 0.22;
  const RIDGE_BOOST = Number.isFinite(config.ridgeBoost) ? config.ridgeBoost : 0.34;
  const BASIN_BOOST = Number.isFinite(config.basinBoost) ? config.basinBoost : 0.28;
  const SUMMIT_BOOST = Number.isFinite(config.summitBoost) ? config.summitBoost : 0.24;
  const COAST_BOOST = Number.isFinite(config.coastBoost) ? config.coastBoost : 0.18;

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
      radius: isFiniteNumber(state.radius) ? state.radius : Math.min(width, height) * 0.36,
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

  function terrainClass(sample) {
    return typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
  }

  function isLandSample(sample) {
    if (sample?.landMask === 1) return true;
    if (sample?.waterMask === 1) return false;

    const tc = terrainClass(sample);
    return tc !== "WATER" && tc !== "SHELF";
  }

  function resolveElevationOffsetPx(sample) {
    const elevation = isFiniteNumber(sample?.elevation) ? sample.elevation : 0;
    return clamp(elevation, -1, 1) * 12;
  }

  function pointFromSample(sample, projectPoint) {
    return projectPoint(sample.latDeg, sample.lonDeg, resolveElevationOffsetPx(sample));
  }

  function reliefStrength(sample) {
    const ridge = clamp(sample?.ridgeStrength ?? 0, 0, 1);
    const basin = clamp(sample?.basinStrength ?? 0, 0, 1);
    const slope = clamp(sample?.slope ?? 0, 0, 1);
    const summit = clamp(sample?.strongestSummitScore ?? 0, 0, 1);
    const canyon = clamp(sample?.canyonStrength ?? 0, 0, 1);
    const shoreline = sample?.shoreline === true || sample?.shorelineBand === true;

    return Object.freeze({
      ridge,
      basin,
      slope,
      summit,
      canyon,
      shoreline
    });
  }

  function drawRidgeHighlight(ctx, point, amount) {
    const radius = 1.4 + amount * 4.4;
    const alpha = 0.022 + amount * 0.070;

    const grad = ctx.createRadialGradient(
      point.x - radius * 0.22,
      point.y - radius * 0.26,
      radius * 0.12,
      point.x,
      point.y,
      radius
    );
    grad.addColorStop(0, `rgba(255,244,224,${(alpha * 1.25).toFixed(3)})`);
    grad.addColorStop(0.52, `rgba(255,214,168,${alpha.toFixed(3)})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBasinShadow(ctx, point, amount) {
    const radius = 1.6 + amount * 4.8;
    const alpha = 0.024 + amount * 0.076;

    const grad = ctx.createRadialGradient(
      point.x + radius * 0.18,
      point.y + radius * 0.22,
      radius * 0.14,
      point.x,
      point.y,
      radius
    );
    grad.addColorStop(0, `rgba(32,48,52,${(alpha * 0.95).toFixed(3)})`);
    grad.addColorStop(0.56, `rgba(22,28,34,${alpha.toFixed(3)})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSummitAccent(ctx, point, amount) {
    const radius = 1.1 + amount * 3.0;
    const alpha = 0.028 + amount * 0.080;

    const grad = ctx.createRadialGradient(
      point.x,
      point.y,
      radius * 0.08,
      point.x,
      point.y,
      radius
    );
    grad.addColorStop(0, `rgba(255,255,255,${(alpha * 1.20).toFixed(3)})`);
    grad.addColorStop(0.44, `rgba(236,240,248,${alpha.toFixed(3)})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCoastSeparation(ctx, point, amount) {
    const radius = 1.2 + amount * 2.6;
    const alpha = 0.016 + amount * 0.046;

    const grad = ctx.createRadialGradient(
      point.x,
      point.y,
      radius * 0.12,
      point.x,
      point.y,
      radius
    );
    grad.addColorStop(0, `rgba(255,240,190,${(alpha * 0.92).toFixed(3)})`);
    grad.addColorStop(0.50, `rgba(160,218,255,${(alpha * 0.82).toFixed(3)})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRelief({
    ctx,
    planetField,
    projectPoint,
    viewState = {}
  }) {
    if (!ctx || !planetField) {
      throw new Error("drawRelief requires ctx and planetField.");
    }

    const projectionState = getProjectionState(viewState, ctx);
    const projector = resolveProjectPoint(projectPoint, projectionState);
    const grid = sampleGrid(planetField);

    ctx.save();

    for (let y = 0; y < grid.length; y += 2) {
      for (let x = 0; x < grid[y].length; x += 2) {
        const sample = grid[y][x];
        if (!isLandSample(sample)) continue;

        const point = pointFromSample(sample, projector);
        if (!point.visible) continue;

        const relief = reliefStrength(sample);
        const facing = clamp(0.70 + point.z * 0.24, 0.58, 1.04);

        const ridgeAmount = clamp((relief.ridge * RIDGE_BOOST + relief.slope * LAND_SHADE) * facing, 0, 1);
        const basinAmount = clamp((relief.basin * BASIN_BOOST + relief.canyon * 0.18) * facing, 0, 1);
        const summitAmount = clamp(relief.summit * SUMMIT_BOOST * facing, 0, 1);
        const coastAmount = relief.shoreline ? clamp(COAST_BOOST * facing, 0, 1) : 0;

        if (ridgeAmount > 0.06) drawRidgeHighlight(ctx, point, ridgeAmount);
        if (basinAmount > 0.06) drawBasinShadow(ctx, point, basinAmount);
        if (summitAmount > 0.04) drawSummitAccent(ctx, point, summitAmount);
        if (coastAmount > 0.04) drawCoastSeparation(ctx, point, coastAmount);
      }
    }

    ctx.restore();

    return Object.freeze({
      landShade: LAND_SHADE,
      ridgeBoost: RIDGE_BOOST,
      basinBoost: BASIN_BOOST,
      summitBoost: SUMMIT_BOOST,
      coastBoost: COAST_BOOST
    });
  }

  return Object.freeze({
    drawRelief
  });
}

const DEFAULT_RELIEF_ENGINE = createReliefEngine();

export function drawRelief(options) {
  return DEFAULT_RELIEF_ENGINE.drawRelief(options);
}
