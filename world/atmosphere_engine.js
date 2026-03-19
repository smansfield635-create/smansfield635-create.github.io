export function createAtmosphereEngine(config = {}) {
  const OUTER_SCALE = Number.isFinite(config.outerScale) ? config.outerScale : 1.018;
  const INNER_SCALE = Number.isFinite(config.innerScale) ? config.innerScale : 0.965;
  const MIST_HEIGHT_FACTOR = Number.isFinite(config.mistHeightFactor) ? config.mistHeightFactor : 0.34;
  const SHELL_ALPHA = Number.isFinite(config.shellAlpha) ? config.shellAlpha : 1;
  const MIST_ALPHA = Number.isFinite(config.mistAlpha) ? config.mistAlpha : 1;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function normalizeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function rgba(r, g, b, a) {
    return `rgba(${Math.round(clamp(r, 0, 255))}, ${Math.round(clamp(g, 0, 255))}, ${Math.round(clamp(b, 0, 255))}, ${clamp(a, 0, 1).toFixed(3)})`;
  }

  function buildProjectionState(viewState = {}, ctx) {
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

  function drawShellGlow(ctx, state) {
    const outerRadius = state.radius * OUTER_SCALE;
    const innerRadius = state.radius * INNER_SCALE;

    const gradient = ctx.createRadialGradient(
      state.centerX,
      state.centerY,
      innerRadius,
      state.centerX,
      state.centerY,
      outerRadius
    );

    if (state.observeMode) {
      gradient.addColorStop(0.94, rgba(132, 188, 255, 0.030 * SHELL_ALPHA));
      gradient.addColorStop(0.98, rgba(156, 210, 255, 0.050 * SHELL_ALPHA));
      gradient.addColorStop(1.00, rgba(176, 224, 255, 0.075 * SHELL_ALPHA));
    } else {
      gradient.addColorStop(0.92, rgba(132, 188, 255, 0.045 * SHELL_ALPHA));
      gradient.addColorStop(0.97, rgba(156, 210, 255, 0.085 * SHELL_ALPHA));
      gradient.addColorStop(1.00, rgba(176, 224, 255, 0.130 * SHELL_ALPHA));
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }

  function drawHorizonBand(ctx, state) {
    const bandRadius = state.radius * 1.004;
    const lineWidth = state.observeMode ? 0.70 : 0.95;

    ctx.save();
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, bandRadius, 0, Math.PI * 2);
    ctx.strokeStyle = state.observeMode
      ? rgba(188, 220, 255, 0.090)
      : rgba(188, 220, 255, 0.150);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  }

  function drawInteriorScatter(ctx, state) {
    withPlanetClip(ctx, state, () => {
      const gradient = ctx.createRadialGradient(
        state.centerX - state.radius * 0.18,
        state.centerY - state.radius * 0.22,
        state.radius * 0.08,
        state.centerX,
        state.centerY,
        state.radius * 1.02
      );

      if (state.observeMode) {
        gradient.addColorStop(0.00, rgba(210, 230, 255, 0.020));
        gradient.addColorStop(0.38, rgba(140, 190, 255, 0.015));
        gradient.addColorStop(1.00, rgba(0, 0, 0, 0.000));
      } else {
        gradient.addColorStop(0.00, rgba(210, 230, 255, 0.035));
        gradient.addColorStop(0.36, rgba(140, 190, 255, 0.024));
        gradient.addColorStop(1.00, rgba(0, 0, 0, 0.000));
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(state.centerX, state.centerY, state.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawMistVeil(ctx, state) {
    const veilHeight = state.radius * MIST_HEIGHT_FACTOR;
    const top = state.centerY + state.radius * 0.52;
    const left = state.centerX - state.radius * 1.08;
    const width = state.radius * 2.16;

    const gradient = ctx.createLinearGradient(0, top, 0, top + veilHeight);
    if (state.observeMode) {
      gradient.addColorStop(0.00, rgba(180, 220, 255, 0.000));
      gradient.addColorStop(0.28, rgba(170, 214, 255, 0.018 * MIST_ALPHA));
      gradient.addColorStop(0.72, rgba(210, 236, 255, 0.028 * MIST_ALPHA));
      gradient.addColorStop(1.00, rgba(255, 255, 255, 0.000));
    } else {
      gradient.addColorStop(0.00, rgba(180, 220, 255, 0.000));
      gradient.addColorStop(0.24, rgba(170, 214, 255, 0.028 * MIST_ALPHA));
      gradient.addColorStop(0.70, rgba(210, 236, 255, 0.050 * MIST_ALPHA));
      gradient.addColorStop(1.00, rgba(255, 255, 255, 0.000));
    }

    withPlanetClip(ctx, state, () => {
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(left, top, width, veilHeight);
      ctx.restore();
    });
  }

  function drawAtmosphere({ ctx, viewState = {} }) {
    if (!ctx) {
      throw new Error("drawAtmosphere requires ctx.");
    }

    const state = buildProjectionState(viewState, ctx);

    drawShellGlow(ctx, state);
    drawInteriorScatter(ctx, state);
    drawMistVeil(ctx, state);
    drawHorizonBand(ctx, state);

    return Object.freeze({
      shellOuterScale: OUTER_SCALE,
      mistHeightFactor: MIST_HEIGHT_FACTOR,
      observeMode: state.observeMode
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
