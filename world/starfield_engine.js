export function createStarfieldEngine(config = {}) {
  const DEFAULT_BANDS = Number.isFinite(config.bandCount) ? config.bandCount : 3;
  const DEFAULT_SEED = Number.isFinite(config.seed) ? config.seed : 1337;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function normalizeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function hashUnit(seed, a, b, c = 0) {
    const n = Math.sin((seed * 0.001) + (a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
    return n - Math.floor(n);
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
      observeMode: state.observeMode === true
    });
  }

  function bandOpacity(index, observeMode) {
    if (observeMode) {
      if (index === 0) return 0.12;
      if (index === 1) return 0.08;
      return 0.05;
    }

    if (index === 0) return 0.22;
    if (index === 1) return 0.15;
    return 0.09;
  }

  function bandScale(index) {
    if (index === 0) return 260;
    if (index === 1) return 340;
    return 420;
  }

  function bandDrift(index) {
    if (index === 0) return 0.85;
    if (index === 1) return 0.52;
    return 0.28;
  }

  function bandCount(index, width, height) {
    const areaFactor = (width * height) / (1280 * 720);
    const base = index === 0 ? 64 : index === 1 ? 42 : 28;
    return Math.max(12, Math.round(base * areaFactor));
  }

  function drawBackgroundWash(ctx, state) {
    const gradient = ctx.createRadialGradient(
      state.centerX,
      state.centerY * 0.82,
      Math.min(state.width, state.height) * 0.04,
      state.centerX,
      state.centerY,
      Math.max(state.width, state.height) * 0.72
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.020)");
    gradient.addColorStop(0.18, "rgba(120,160,255,0.026)");
    gradient.addColorStop(0.42, "rgba(90,110,170,0.014)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);
    ctx.restore();
  }

  function drawNebulaMist(ctx, state, nowMs) {
    const time = nowMs * 0.00002;

    const clouds = [
      {
        x: state.width * (0.14 + Math.sin(time * 0.9) * 0.02),
        y: state.height * (0.18 + Math.cos(time * 0.7) * 0.015),
        rx: state.width * 0.22,
        ry: state.height * 0.14,
        color: rgba(255, 210, 150, 0.06)
      },
      {
        x: state.width * (0.72 + Math.cos(time * 0.8) * 0.016),
        y: state.height * (0.12 + Math.sin(time * 0.5) * 0.010),
        rx: state.width * 0.18,
        ry: state.height * 0.11,
        color: rgba(180, 150, 255, 0.05)
      },
      {
        x: state.width * (0.24 + Math.sin(time * 0.4) * 0.014),
        y: state.height * (0.72 + Math.cos(time * 0.6) * 0.012),
        rx: state.width * 0.16,
        ry: state.height * 0.10,
        color: rgba(255, 160, 130, 0.04)
      }
    ];

    ctx.save();
    for (const cloud of clouds) {
      const grad = ctx.createRadialGradient(
        cloud.x,
        cloud.y,
        Math.min(cloud.rx, cloud.ry) * 0.06,
        cloud.x,
        cloud.y,
        Math.max(cloud.rx, cloud.ry)
      );
      grad.addColorStop(0, cloud.color);
      grad.addColorStop(0.45, cloud.color.replace(/0\.\d+\)$/, "0.020)"));
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.translate(cloud.x, cloud.y);
      ctx.scale(cloud.rx / Math.max(cloud.ry, 1), 1);
      ctx.beginPath();
      ctx.arc(0, 0, cloud.ry, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.restore();
  }

  function drawStarBloom(ctx, x, y, radius, alpha, tint) {
    const core = ctx.createRadialGradient(
      x,
      y,
      radius * 0.08,
      x,
      y,
      radius
    );

    core.addColorStop(0, rgba(tint.r, tint.g, tint.b, alpha));
    core.addColorStop(0.28, rgba(tint.r, tint.g, tint.b, alpha * 0.55));
    core.addColorStop(0.68, rgba(tint.r, tint.g, tint.b, alpha * 0.18));
    core.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCrossGlow(ctx, x, y, span, alpha, tint) {
    ctx.save();
    ctx.strokeStyle = rgba(tint.r, tint.g, tint.b, alpha);
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(0.8, span * 0.08);

    ctx.beginPath();
    ctx.moveTo(x - span * 0.5, y);
    ctx.lineTo(x + span * 0.5, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y - span * 0.5);
    ctx.lineTo(x, y + span * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  function starTint(seed, bandIndex, i) {
    const warm = hashUnit(seed + 19, bandIndex, i, 1);
    const cool = hashUnit(seed + 31, bandIndex, i, 2);
    const violet = hashUnit(seed + 47, bandIndex, i, 3);

    const r = 236 + warm * 18 + violet * 4;
    const g = 228 + cool * 14;
    const b = 218 + cool * 20 + violet * 12;

    return {
      r: clamp(r, 220, 255),
      g: clamp(g, 220, 255),
      b: clamp(b, 220, 255)
    };
  }

  function drawBand(ctx, state, bandIndex, nowMs, seed) {
    const count = bandCount(bandIndex, state.width, state.height);
    const scale = bandScale(bandIndex);
    const drift = bandDrift(bandIndex);
    const baseOpacity = bandOpacity(bandIndex, state.observeMode);
    const time = nowMs * 0.00003 * drift;

    for (let i = 0; i < count; i += 1) {
      const nx = hashUnit(seed + 101, bandIndex, i, 0);
      const ny = hashUnit(seed + 211, bandIndex, i, 1);
      const sizeNoise = hashUnit(seed + 307, bandIndex, i, 2);
      const twinkle = hashUnit(seed + 401, bandIndex, i, 3);
      const swayX = Math.sin(time + (nx * Math.PI * 2) + i * 0.13) * (bandIndex === 0 ? 8 : bandIndex === 1 ? 5 : 3);
      const swayY = Math.cos(time * 0.84 + (ny * Math.PI * 2) + i * 0.09) * (bandIndex === 0 ? 6 : bandIndex === 1 ? 4 : 2);

      const x = nx * state.width + swayX;
      const y = ny * state.height + swayY;

      const radius =
        bandIndex === 0
          ? 1.4 + sizeNoise * 2.2
          : bandIndex === 1
            ? 1.1 + sizeNoise * 1.6
            : 0.9 + sizeNoise * 1.2;

      const alpha = baseOpacity * (0.72 + Math.sin(time * 1.6 + twinkle * 9.0) * 0.18 + twinkle * 0.20);
      const tint = starTint(seed, bandIndex, i);

      drawStarBloom(ctx, x, y, radius * scale * 0.01, alpha, tint);

      if (bandIndex === 0 && sizeNoise > 0.78) {
        drawCrossGlow(ctx, x, y, radius * 8, alpha * 0.36, tint);
      }
    }
  }

  function drawMicroClusters(ctx, state, nowMs, seed) {
    const time = nowMs * 0.000025;

    for (let i = 0; i < 9; i += 1) {
      const cx = hashUnit(seed + 509, i, 0, 0) * state.width;
      const cy = hashUnit(seed + 601, i, 0, 1) * state.height;
      const spread = 18 + hashUnit(seed + 701, i, 0, 2) * 24;
      const count = 4 + Math.floor(hashUnit(seed + 809, i, 0, 3) * 5);

      for (let j = 0; j < count; j += 1) {
        const angle = hashUnit(seed + 907, i, j, 0) * Math.PI * 2 + time * 0.2;
        const distance = hashUnit(seed + 1009, i, j, 1) * spread;
        const x = cx + Math.cos(angle) * distance;
        const y = cy + Math.sin(angle) * distance;
        const radius = 2.2 + hashUnit(seed + 1103, i, j, 2) * 2.2;
        const tint = starTint(seed + 1201, i, j);
        drawStarBloom(ctx, x, y, radius, 0.08, tint);
      }
    }
  }

  function drawStarfield({ ctx, viewState = {}, nowMs = performance.now() }) {
    if (!ctx) {
      throw new Error("drawStarfield requires ctx.");
    }

    const state = buildProjectionState(viewState, ctx);

    ctx.save();
    drawBackgroundWash(ctx, state);
    drawNebulaMist(ctx, state, nowMs);

    for (let bandIndex = DEFAULT_BANDS - 1; bandIndex >= 0; bandIndex -= 1) {
      drawBand(ctx, state, bandIndex, nowMs, DEFAULT_SEED);
    }

    drawMicroClusters(ctx, state, nowMs, DEFAULT_SEED + 3000);
    ctx.restore();

    return Object.freeze({
      bandCount: DEFAULT_BANDS,
      width: state.width,
      height: state.height,
      observeMode: state.observeMode
    });
  }

  return Object.freeze({
    drawStarfield
  });
}

const DEFAULT_STARFIELD_ENGINE = createStarfieldEngine();

export function drawStarfield(options) {
  return DEFAULT_STARFIELD_ENGINE.drawStarfield(options);
}
