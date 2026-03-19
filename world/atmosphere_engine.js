export function createAtmosphereEngine(config = {}) {
  const OUTER_SCALE = Number.isFinite(config.outerScale) ? config.outerScale : 1.16;
  const INNER_SCALE = Number.isFinite(config.innerScale) ? config.innerScale : 0.92;
  const HAZE_ALPHA = Number.isFinite(config.hazeAlpha) ? config.hazeAlpha : 0.18;
  const RIM_ALPHA = Number.isFinite(config.rimAlpha) ? config.rimAlpha : 0.18;
  const AURORA_ALPHA = Number.isFinite(config.auroraAlpha) ? config.auroraAlpha : 0.12;

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

  function drawGlowShell(ctx, projectionState) {
    const outerRadius = projectionState.radius * OUTER_SCALE;
    const innerRadius = projectionState.radius * INNER_SCALE;
    const shellAlpha = projectionState.observeMode ? 0.10 : 0.16;

    const shell = ctx.createRadialGradient(
      projectionState.centerX,
      projectionState.centerY,
      innerRadius,
      projectionState.centerX,
      projectionState.centerY,
      outerRadius
    );

    shell.addColorStop(0, "rgba(0,0,0,0)");
    shell.addColorStop(0.52, `rgba(110,170,255,${(shellAlpha * 0.45).toFixed(3)})`);
    shell.addColorStop(0.82, `rgba(170,220,255,${shellAlpha.toFixed(3)})`);
    shell.addColorStop(1, "rgba(170,220,255,0)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(projectionState.centerX, projectionState.centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = shell;
    ctx.fill();
    ctx.restore();
  }

  function drawLowerHaze(ctx, projectionState) {
    const hazeHeight = projectionState.radius * 0.72;
    const hazeWidth = projectionState.radius * 2.1;
    const y = projectionState.centerY + projectionState.radius * 0.34;
    const alpha = projectionState.observeMode ? HAZE_ALPHA * 0.68 : HAZE_ALPHA;

    const grad = ctx.createRadialGradient(
      projectionState.centerX,
      y,
      hazeHeight * 0.10,
      projectionState.centerX,
      y,
      hazeWidth * 0.52
    );

    grad.addColorStop(0, `rgba(210,235,255,${(alpha * 0.70).toFixed(3)})`);
    grad.addColorStop(0.42, `rgba(150,190,255,${(alpha * 0.34).toFixed(3)})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.save();
    ctx.translate(projectionState.centerX, y);
    ctx.scale(hazeWidth / Math.max(hazeHeight, 1), 1);
    ctx.beginPath();
    ctx.arc(0, 0, hazeHeight, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function drawRimScatter(ctx, projectionState) {
    const outerRadius = projectionState.radius * 1.028;
    const alpha = projectionState.observeMode ? RIM_ALPHA * 0.70 : RIM_ALPHA;

    const rim = ctx.createRadialGradient(
      projectionState.centerX - projectionState.radius * 0.18,
      projectionState.centerY - projectionState.radius * 0.22,
      projectionState.radius * 0.82,
      projectionState.centerX,
      projectionState.centerY,
      outerRadius
    );

    rim.addColorStop(0.94, "rgba(0,0,0,0)");
    rim.addColorStop(0.985, `rgba(150,204,255,${(alpha * 0.55).toFixed(3)})`);
    rim.addColorStop(1, `rgba(210,238,255,${alpha.toFixed(3)})`);

    ctx.save();
    ctx.beginPath();
    ctx.arc(projectionState.centerX, projectionState.centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = rim;
    ctx.fill();
    ctx.restore();
  }

  function drawAuroraScatter(ctx, grid, projectPoint) {
    ctx.save();

    for (let y = 0; y < grid.length; y += 5) {
      for (let x = 0; x < grid[y].length; x += 5) {
        const sample = grid[y][x];
        const aurora = clamp(sample?.auroralPotential ?? 0, 0, 1);
        if (aurora < 0.62) continue;

        const point = projectPoint(sample.latDeg, sample.lonDeg, 18);
        if (!point.visible) continue;

        const radius = 1.8 + aurora * 3.2;
        const alpha = AURORA_ALPHA * aurora;

        const grad = ctx.createRadialGradient(
          point.x,
          point.y,
          radius * 0.15,
          point.x,
          point.y,
          radius
        );
        grad.addColorStop(0, `rgba(140,255,196,${(alpha * 0.72).toFixed(3)})`);
        grad.addColorStop(0.50, `rgba(96,220,255,${(alpha * 0.42).toFixed(3)})`);
        grad.addColorStop(1, "rgba(96,220,255,0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function drawAtmosphere({
    ctx,
    planetField,
    projectPoint,
    viewState = {}
  }) {
    if (!ctx || !planetField) {
      throw new Error("drawAtmosphere requires ctx and planetField.");
    }

    const projectionState = getProjectionState(viewState, ctx);
    const projector = resolveProjectPoint(projectPoint, projectionState);
    const grid = sampleGrid(planetField);

    drawGlowShell(ctx, projectionState);
    drawLowerHaze(ctx, projectionState);
    drawRimScatter(ctx, projectionState);
    drawAuroraScatter(ctx, grid, projector);

    return Object.freeze({
      shellScale: OUTER_SCALE,
      hazeAlpha: HAZE_ALPHA,
      rimAlpha: RIM_ALPHA,
      auroraAlpha: AURORA_ALPHA
    });
  }

  return Object.freeze({
    drawAtmosphere
  });
}

const DEFAULT_ATMOSPHERE_ENGINE = createAtmosphereEngine();

export function drawAtmosphere(options) {
  return DEFAULT_ATMOSPHERE_ENGINE.drawAtmosphere(options);
}
