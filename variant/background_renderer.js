(function () {
  "use strict";

  const TAU = Math.PI * 2;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function fract(v) {
    return v - Math.floor(v);
  }

  function hash(n) {
    return fract(Math.sin(n * 127.1) * 43758.5453123);
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function createState() {
    return {
      lanterns: [],
      clouds: [],
      mountains: [],
      sun: { x: 0, y: 0, glow: 0.72 },
      moon: { x: 0, y: 0, glow: 0.86 },
    };
  }

  function initLanterns(state, width, height) {
    const w = Math.max(1, width || window.innerWidth || 1);
    const h = Math.max(1, height || window.innerHeight || 1);
    const count = Math.max(16, Math.round(w / 120));
    state.lanterns = [];

    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      const depthBand = i % 3;
      const depth = depthBand === 0 ? 1 : depthBand === 1 ? 0.78 : 0.58;

      state.lanterns.push({
        x: hash(seed * 2.17) * w,
        y: h * (0.5 + hash(seed * 3.91) * 0.36),
        size: (18 + hash(seed * 5.31) * 12) * depth,
        speed: (0.1 + hash(seed * 6.17) * 0.16) * (0.7 + depth * 0.75),
        sway: (8 + hash(seed * 7.33) * 18) * (0.8 + depth * 0.45),
        phase: hash(seed * 8.07) * TAU,
        flame: hash(seed * 9.07) * TAU,
        depth,
        tilt: (hash(seed * 10.11) - 0.5) * 0.16,
      });
    }

    return state.lanterns;
  }

  function initClouds(state, width, height) {
    const w = Math.max(1, width || window.innerWidth || 1);
    const h = Math.max(1, height || window.innerHeight || 1);
    const count = Math.max(8, Math.round(w / 190));
    state.clouds = [];

    for (let i = 0; i < count; i++) {
      const seed = i + 1;
      const layer = i % 3;
      state.clouds.push({
        x: hash(seed * 12.1) * w,
        y:
          h *
          (layer === 0
            ? 0.16 + hash(seed * 1.8) * 0.1
            : layer === 1
            ? 0.23 + hash(seed * 2.8) * 0.1
            : 0.3 + hash(seed * 3.8) * 0.1),
        size:
          (110 + hash(seed * 13.7) * 120) *
          (layer === 0 ? 1.2 : layer === 1 ? 0.95 : 0.72),
        speed:
          (0.1 + hash(seed * 14.3) * 0.12) *
          (layer === 0 ? 0.22 : layer === 1 ? 0.38 : 0.6),
        alpha: layer === 0 ? 0.1 : layer === 1 ? 0.14 : 0.18,
        phase: hash(seed * 15.1) * TAU,
        layer,
      });
    }

    return state.clouds;
  }

  function initMountains(state, width, height, preset) {
    const w = Math.max(1, width || window.innerWidth || 1);
    const h = Math.max(1, height || window.innerHeight || 1);
    const horizon = h * ((preset && preset.horizon) || 0.66);
    state.mountains = [];

    for (let band = 0; band < 3; band++) {
      const pts = [];
      const baseY = horizon + (band === 0 ? 22 : band === 1 ? 44 : 68);
      const step = 80 - band * 12;

      for (let x = -120; x <= w + 120; x += step) {
        const seed = (band + 1) * 1000 + x;
        const peak = (hash(seed * 0.013) - 0.5) * (band === 0 ? 58 : band === 1 ? 44 : 30);
        pts.push({ x, y: baseY + peak });
      }

      state.mountains.push({ band, pts });
    }

    return state.mountains;
  }

  function syncCelestials(state, env, tick) {
    if (env && typeof env.tick === "function") {
      const snapshot = env.tick(1);
      if (snapshot) {
        state.sun.x = window.innerWidth * 0.5 + snapshot.sun.x * 0.18;
        state.sun.y = window.innerHeight * 0.24 + snapshot.sun.y * 0.1;
        state.sun.glow = snapshot.sun.glow;

        state.moon.x = window.innerWidth * 0.5 + snapshot.moon.x * 0.2;
        state.moon.y = window.innerHeight * 0.22 + snapshot.moon.y * 0.1;
        state.moon.glow = snapshot.moon.glow;

        return snapshot;
      }
    }

    const sunA = tick * 0.0035;
    const moonA = tick * 0.0028 + Math.PI;

    state.sun.x = window.innerWidth * 0.5 + Math.cos(sunA) * (1100 * 0.24);
    state.sun.y = window.innerHeight * 0.22 + Math.sin(sunA) * (1100 * 0.06);
    state.sun.glow = 0.72;

    state.moon.x = window.innerWidth * 0.5 + Math.cos(moonA) * (980 * 0.26);
    state.moon.y = window.innerHeight * 0.2 + Math.sin(moonA) * (980 * 0.07);
    state.moon.glow = 0.86;

    return null;
  }

  function drawSky(ctx, width, height, tick, preset, state) {
    const w = width;
    const h = height;
    const warmMix = 0.28 + Math.sin(tick * 0.002) * 0.04;
    const g = ctx.createLinearGradient(0, 0, 0, h);

    g.addColorStop(0, `rgba(${Math.round(18 + 25 * warmMix)},${Math.round(8 + 10 * warmMix)},${Math.round(22 + 34 * (1 - warmMix))},1)`);
    g.addColorStop(0.14, `rgba(${Math.round(36 + 18 * warmMix)},${Math.round(11 + 8 * warmMix)},${Math.round(30 + 18 * (1 - warmMix))},1)`);
    g.addColorStop(0.36, `rgba(${Math.round(72 + 28 * warmMix)},${Math.round(18 + 10 * warmMix)},${Math.round(46 + 10 * (1 - warmMix))},1)`);
    g.addColorStop(0.58, `rgba(${Math.round(124 + 34 * warmMix)},${Math.round(34 + 18 * warmMix)},${Math.round(68 + 6 * (1 - warmMix))},1)`);
    g.addColorStop(0.78, `rgba(${Math.round(192 + 28 * warmMix)},${Math.round(88 + 24 * warmMix)},${Math.round(74 + 4 * (1 - warmMix))},1)`);
    g.addColorStop(1, "rgba(26,6,6,1)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const horizonY = h * preset.horizon;
    const glow = ctx.createLinearGradient(0, horizonY - 150, 0, horizonY + 110);

    glow.addColorStop(0, "rgba(255,175,88,0)");
    glow.addColorStop(0.22, `rgba(108,140,255,${0.09 * state.moon.glow})`);
    glow.addColorStop(0.48, `rgba(255,152,62,${0.16 * state.sun.glow})`);
    glow.addColorStop(0.72, `rgba(255,112,48,${0.2 * state.sun.glow})`);
    glow.addColorStop(1, "rgba(255,96,36,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, horizonY - 150, w, 260);

    for (let i = 0; i < 22; i++) {
      const sx = hash(i * 3.17) * w;
      const sy = hash(i * 4.11) * h * 0.42;
      const a = 0.03 + hash(i * 5.7) * 0.08;
      ctx.fillStyle = `rgba(255,245,228,${a})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8 + hash(i * 6.1) * 1.1, 0, TAU);
      ctx.fill();
    }
  }

  function drawSun(ctx, width, height, state) {
    const x = state.sun.x || width * 0.2;
    const y = state.sun.y || height * 0.18;
    const r = Math.min(width, height) * 0.045;

    ctx.save();

    const halo = ctx.createRadialGradient(x, y, r * 0.28, x, y, r * 2.8);
    halo.addColorStop(0, `rgba(255,190,110,${0.22 * state.sun.glow})`);
    halo.addColorStop(0.45, `rgba(255,146,82,${0.14 * state.sun.glow})`);
    halo.addColorStop(1, "rgba(255,146,82,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.8, 0, TAU);
    ctx.fill();

    ctx.shadowBlur = 54;
    ctx.shadowColor = `rgba(255,180,120,${0.18 * state.sun.glow})`;

    const grad = ctx.createRadialGradient(x - r * 0.22, y - r * 0.22, r * 0.08, x, y, r * 1.1);
    grad.addColorStop(0, "rgba(255,248,214,0.92)");
    grad.addColorStop(0.55, "rgba(255,204,130,0.88)");
    grad.addColorStop(1, "rgba(226,122,72,0.86)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function drawMoon(ctx, width, height, state) {
    const x = state.moon.x || width * 0.8;
    const y = state.moon.y || height * 0.15;
    const r = Math.min(width, height) * 0.074;

    ctx.save();

    const halo = ctx.createRadialGradient(x, y, r * 0.35, x, y, r * 2.4);
    halo.addColorStop(0, "rgba(255,244,215,0.20)");
    halo.addColorStop(0.45, "rgba(255,226,176,0.14)");
    halo.addColorStop(1, "rgba(255,226,176,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.4, 0, TAU);
    ctx.fill();

    ctx.shadowBlur = 78;
    ctx.shadowColor = "rgba(255,224,170,0.28)";

    const moonGrad = ctx.createRadialGradient(x - r * 0.28, y - r * 0.22, r * 0.08, x, y, r * 1.05);
    moonGrad.addColorStop(0, "rgba(255,252,236,0.96)");
    moonGrad.addColorStop(0.56, "rgba(255,238,200,0.95)");
    moonGrad.addColorStop(1, "rgba(228,206,164,0.94)");

    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "rgba(180,150,122,0.90)";

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + 0.2;
      ctx.beginPath();
      ctx.ellipse(
        x + Math.cos(a) * r * 0.35,
        y + Math.sin(a) * r * 0.22,
        r * (0.08 + hash(i * 9.1) * 0.1),
        r * (0.05 + hash(i * 10.2) * 0.08),
        a * 0.6,
        0,
        TAU
      );
      ctx.fill();
    }

    ctx.restore();
  }

  function drawCloudBank(ctx, cloud, tick, drift) {
    const x = cloud.x + Math.sin(tick * 0.0016 + cloud.phase) * 18;
    const y = cloud.y + Math.cos(tick * 0.0012 + cloud.phase) * 4;
    const scale = cloud.size;

    ctx.save();
    ctx.globalAlpha = cloud.alpha;

    const g = ctx.createLinearGradient(x, y - scale * 0.25, x, y + scale * 0.28);
    g.addColorStop(0, "rgba(255,235,222,0.18)");
    g.addColorStop(0.42, "rgba(255,223,210,0.12)");
    g.addColorStop(1, "rgba(255,220,208,0.04)");
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.ellipse(x - scale * 0.78, y, scale * 0.5, scale * 0.18, 0, 0, TAU);
    ctx.ellipse(x - scale * 0.34, y - scale * 0.11, scale * 0.42, scale * 0.2, 0, 0, TAU);
    ctx.ellipse(x + scale * 0.06, y - scale * 0.13, scale * 0.48, scale * 0.22, 0, 0, TAU);
    ctx.ellipse(x + scale * 0.48, y - scale * 0.04, scale * 0.58, scale * 0.23, 0, 0, TAU);
    ctx.ellipse(x + scale * 0.92, y + scale * 0.01, scale * 0.34, scale * 0.14, 0, 0, TAU);
    ctx.fill();

    ctx.globalAlpha = cloud.alpha * 0.42;
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    ctx.beginPath();
    ctx.ellipse(x - scale * 0.06, y - scale * 0.16, scale * 0.28, scale * 0.08, -0.12, 0, TAU);
    ctx.ellipse(x + scale * 0.42, y - scale * 0.1, scale * 0.3, scale * 0.08, -0.08, 0, TAU);
    ctx.fill();

    ctx.globalAlpha = cloud.alpha * 0.22;
    ctx.fillStyle = "rgba(255,230,212,0.26)";
    ctx.beginPath();
    ctx.ellipse(x + scale * 0.1, y + scale * 0.06, scale * 0.7, scale * 0.18, 0.02, 0, TAU);
    ctx.fill();

    ctx.restore();

    cloud.x += cloud.speed * 0.12 * drift;
    if (cloud.x - cloud.size > window.innerWidth + cloud.size * 1.6) {
      cloud.x = -cloud.size * 1.4;
    }
  }

  function drawClouds(ctx, state, tick, envSnapshot) {
    const drift = envSnapshot && envSnapshot.weather ? envSnapshot.weather.cloudDrift || 0.26 : 0.26;
    for (let i = 0; i < state.clouds.length; i++) {
      drawCloudBank(ctx, state.clouds[i], tick, drift);
    }
  }

  function drawLanterns(ctx, state, tick, northBoost) {
    const h = window.innerHeight;

    for (let i = 0; i < state.lanterns.length; i++) {
      const ln = state.lanterns[i];
      const driftY = (tick * ln.speed) % (h * 0.86 + 180);
      const y = ln.y - driftY < -120 ? ln.y - driftY + h * 0.86 + 200 : ln.y - driftY;
      const x = ln.x + Math.sin(tick * 0.008 + ln.phase) * ln.sway;
      const flicker =
        (0.82 +
          Math.sin(tick * 0.09 + ln.flame) * 0.12 +
          Math.sin(tick * 0.043 + ln.flame * 0.7) * 0.06) *
        northBoost;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ln.tilt + Math.sin(tick * 0.01 + ln.phase) * 0.04);

      ctx.globalAlpha = 0.38 * ln.depth;
      ctx.strokeStyle = "rgba(255,214,160,0.42)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -ln.size * 1.1);
      ctx.lineTo(0, -ln.size * 0.62);
      ctx.stroke();

      ctx.globalAlpha = 0.95 * ln.depth;
      ctx.fillStyle = "rgba(105,15,18,0.88)";
      roundedRectPath(ctx, -ln.size * 0.42, -ln.size * 0.62, ln.size * 0.84, ln.size * 1.1, ln.size * 0.2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,218,148,0.74)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.fillStyle = "rgba(255,230,195,0.10)";
      roundedRectPath(ctx, -ln.size * 0.2, -ln.size * 0.38, ln.size * 0.4, ln.size * 0.64, ln.size * 0.1);
      ctx.fill();

      ctx.globalAlpha = 0.58 * ln.depth;
      ctx.strokeStyle = "rgba(255,228,188,0.26)";
      ctx.beginPath();
      ctx.moveTo(-ln.size * 0.22, -ln.size * 0.22);
      ctx.lineTo(ln.size * 0.22, -ln.size * 0.22);
      ctx.moveTo(-ln.size * 0.22, 0);
      ctx.lineTo(ln.size * 0.22, 0);
      ctx.moveTo(-ln.size * 0.22, ln.size * 0.22);
      ctx.lineTo(ln.size * 0.22, ln.size * 0.22);
      ctx.stroke();

      ctx.shadowBlur = 26 * ln.depth;
      ctx.shadowColor = `rgba(255,196,96,${0.32 * flicker})`;
      ctx.globalAlpha = 0.54 * ln.depth;
      ctx.fillStyle = `rgba(255,196,96,${0.30 * flicker})`;
      roundedRectPath(ctx, -ln.size * 0.18, -ln.size * 0.3, ln.size * 0.36, ln.size * 0.54, ln.size * 0.1);
      ctx.fill();

      ctx.globalAlpha = 0.86 * ln.depth;
      ctx.fillStyle = "rgba(255,244,216,0.95)";
      ctx.beginPath();
      ctx.moveTo(0, -ln.size * 0.18);
      ctx.quadraticCurveTo(ln.size * 0.09, 0, 0, ln.size * 0.16);
      ctx.quadraticCurveTo(-ln.size * 0.09, 0, 0, -ln.size * 0.18);
      ctx.fill();

      ctx.restore();
    }
  }

  function drawMountains(ctx, width, height, state, preset) {
    const w = width;
    const h = height;
    const horizon = h * preset.horizon;

    for (let i = state.mountains.length - 1; i >= 0; i--) {
      const band = state.mountains[i];
      ctx.beginPath();
      ctx.moveTo(-140, h);
      for (let p = 0; p < band.pts.length; p++) {
        ctx.lineTo(band.pts[p].x, band.pts[p].y);
      }
      ctx.lineTo(w + 140, h);
      ctx.closePath();
      ctx.fillStyle =
        band.band === 0
          ? "rgba(22,14,18,0.82)"
          : band.band === 1
          ? "rgba(28,16,20,0.62)"
          : "rgba(34,18,20,0.44)";
      ctx.fill();
    }

    const haze = ctx.createLinearGradient(0, horizon - 18, 0, horizon + 110);
    haze.addColorStop(0, "rgba(255,182,126,0.10)");
    haze.addColorStop(0.45, "rgba(34,18,20,0.12)");
    haze.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, horizon - 18, w, 140);
  }

  function drawWater(ctx, width, height, tick, preset, state, envSnapshot) {
    const w = width;
    const h = height;
    const horizon = h * preset.horizon;
    const base = h * 0.8;
    const waveEnergy = envSnapshot && envSnapshot.weather ? envSnapshot.weather.waveEnergy || 0.34 : 0.34;

    const g = ctx.createLinearGradient(0, horizon - 24, 0, h);
    g.addColorStop(0, "rgba(56,20,20,0.46)");
    g.addColorStop(0.16, "rgba(28,14,18,0.84)");
    g.addColorStop(0.54, "rgba(11,8,14,0.96)");
    g.addColorStop(1, "rgba(5,4,8,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, horizon - 24, w, h - (horizon - 24));

    ctx.save();
    ctx.globalAlpha = 0.16;
    const moonReflectionX = state.moon.x || w * 0.8;
    const refl = ctx.createLinearGradient(moonReflectionX - 80, horizon, moonReflectionX + 120, h);
    refl.addColorStop(0, "rgba(255,220,160,0)");
    refl.addColorStop(0.48, "rgba(255,220,160,0.30)");
    refl.addColorStop(1, "rgba(255,220,160,0)");
    ctx.fillStyle = refl;
    ctx.beginPath();
    ctx.moveTo(moonReflectionX - 72, horizon + 6);
    ctx.lineTo(moonReflectionX + 22, horizon + 6);
    ctx.lineTo(moonReflectionX + 110, h);
    ctx.lineTo(moonReflectionX - 146, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    for (let layer = 0; layer < 10; layer++) {
      const depth = layer / 9;
      const yBase = base + layer * 14;
      const amp = lerp(2.0, 9.6, depth) * (0.8 + waveEnergy * 0.6);
      const f1 = lerp(0.008, 0.024, depth);
      const f2 = lerp(0.004, 0.013, depth);

      ctx.beginPath();
      for (let x = 0; x <= w; x += 10) {
        const wave1 = Math.sin(x * f1 + tick * (0.01 + depth * 0.028) + layer * 0.72) * amp;
        const wave2 = Math.sin(x * f2 - tick * (0.006 + depth * 0.01) + layer * 1.22) * amp * 0.52;
        const wave3 = Math.sin(x * 0.017 + tick * 0.017 + layer * 0.45) * amp * 0.18;
        const y = yBase + wave1 + wave2 + wave3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(255,${Math.round(110 + depth * 70)},${Math.round(88 + depth * 40)},${0.018 + depth * 0.046})`;
      ctx.lineWidth = 1.35 + depth * 1.0;
      ctx.stroke();
    }

    for (let crest = 0; crest < 5; crest++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 14) {
        const y =
          base +
          crest * 22 +
          Math.sin(x * 0.02 + tick * 0.026 + crest * 0.9) * 4.2 * (0.85 + waveEnergy * 0.5) +
          Math.sin(x * 0.006 - tick * 0.009 + crest * 1.4) * 2.0;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255,228,176,${0.032 - crest * 0.004})`;
      ctx.lineWidth = 0.95;
      ctx.stroke();
    }

    for (let foam = 0; foam < 3; foam++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 18) {
        const y =
          base +
          foam * 28 +
          Math.sin(x * 0.028 + tick * 0.038 + foam) * 2.2 +
          Math.sin(x * 0.011 - tick * 0.012 + foam * 1.8) * 1.0;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(255,244,214,${0.02 - foam * 0.003})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  window.OPENWORLD_BACKGROUND_RENDERER = Object.freeze({
    version: "OPENWORLD_BACKGROUND_RENDERER_v1",
    createState,
    initLanterns,
    initClouds,
    initMountains,
    syncCelestials,
    drawSky,
    drawSun,
    drawMoon,
    drawClouds,
    drawLanterns,
    drawMountains,
    drawWater,
  });
})();
