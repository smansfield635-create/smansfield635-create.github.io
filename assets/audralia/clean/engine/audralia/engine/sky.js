// /assets/audralia/clean/engine/sky.js
// AUDRALIA_G2_5_SKY_CHILD_ENGINE_TNT_v1
// Child engine for Audralia clean-canvas stack.
// Owns: rim glow, haze, clouds/weather, lighting tint, atmospheric veil, and future weather inheritance toward H-Earth.
// Does not own: mount, canvas creation, continents, sea level, motion, route bridge, HTML, or parent Globe.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_SKY_CHILD_ENGINE_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_5_SKY_CHILD_ENGINE_RECEIPT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-g2-5-sky-child-engine-v1";

  const SKY = Object.freeze({
    seed: 25645161,
    rimStrength: 0.86,
    hazeStrength: 0.16,
    cloudStrength: 0.18,
    weatherStrength: 0.20,
    lightTintStrength: 0.14,
    futureHEarthWeatherInheritance: true,
    ownsAtmosphere: true,
    ownsWeather: true,
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });

  const state = {
    appliedCount: 0,
    atmosphereDrawCount: 0,
    lastAppliedAt: null,
    lastAtmosphereDrawAt: null,
    lastWeatherState: null,
    weatherState: {
      mode: "forming",
      cloudBandA: 0.16,
      cloudBandB: -0.30,
      shimmer: 0.42,
      pressure: 0.55,
      inheritanceTarget: "H-Earth"
    }
  };

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function now() {
    return new Date().toISOString();
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.00001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
      lerp(a[3] ?? 1, b[3] ?? 1, t)
    ];
  }

  function normalize3(v) {
    const x = Number(v?.x || 0);
    const y = Number(v?.y || 0);
    const z = Number(v?.z || 0);
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function hash2(x, y, seed = SKY.seed) {
    let n = Math.imul(x ^ seed, 374761393) ^ Math.imul(y + seed, 668265263);
    n = (n ^ (n >>> 13)) >>> 0;
    n = Math.imul(n, 1274126177) >>> 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function valueNoise(x, y, scale, seedOffset = 0) {
    const sx = x * scale;
    const sy = y * scale;
    const x0 = Math.floor(sx);
    const y0 = Math.floor(sy);
    const tx = fade(sx - x0);
    const ty = fade(sy - y0);

    const a = hash2(x0, y0, SKY.seed + seedOffset);
    const b = hash2(x0 + 1, y0, SKY.seed + seedOffset);
    const c = hash2(x0, y0 + 1, SKY.seed + seedOffset);
    const d = hash2(x0 + 1, y0 + 1, SKY.seed + seedOffset);

    return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
  }

  function fbm(x, y, baseScale, octaves, seedOffset = 0) {
    let total = 0;
    let amp = 0.5;
    let scale = baseScale;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x, y, scale, seedOffset + i * 997) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= 2.03;
    }

    return total / Math.max(0.0001, norm);
  }

  function getSurfaceUV(surface, worldNormal = null) {
    if (Number.isFinite(surface?.u) && Number.isFinite(surface?.v)) {
      return { u: surface.u, v: surface.v };
    }

    const n = normalize3(worldNormal || surface?.normal || { x: 0, y: 0, z: 1 });
    const lon = Math.atan2(n.x, n.z);
    const lat = Math.asin(Math.max(-1, Math.min(1, n.y)));

    return {
      u: lon / Math.PI,
      v: lat / (Math.PI / 2)
    };
  }

  function computeCloud(surface = {}, worldNormal = null, context = {}) {
    const uv = getSurfaceUV(surface, worldNormal);
    const n = normalize3(worldNormal || surface.normal || { x: 0, y: 0, z: 1 });

    const weather = context.weatherState || state.weatherState;
    const cloudBandA = Number(weather.cloudBandA ?? state.weatherState.cloudBandA);
    const cloudBandB = Number(weather.cloudBandB ?? state.weatherState.cloudBandB);
    const pressure = Number(weather.pressure ?? state.weatherState.pressure);

    const beltA = 1 - Math.abs(uv.v - cloudBandA) * 5.4;
    const beltB = 1 - Math.abs(uv.v - cloudBandB) * 4.8;
    const streak = fbm(uv.u * 1.42 + 2.2, uv.v * 0.82 - 0.5, 10.0, 4, 2600);
    const fine = fbm(uv.u - 8.3, uv.v + 3.8, 24.0, 3, 3200);
    const broken = fbm(uv.u + 12.1, uv.v - 4.4, 37.0, 2, 3700);

    return clamp01(
      Math.max(beltA, beltB) * 0.34 +
      streak * 0.27 +
      fine * 0.09 +
      pressure * 0.06 -
      Math.abs(n.x) * 0.06 +
      n.z * 0.06 -
      smoothstep(0.68, 0.92, broken) * 0.08
    );
  }

  function computeLighting(surface = {}, worldNormal = null, context = {}) {
    const n = normalize3(worldNormal || surface.normal || { x: 0, y: 0, z: 1 });
    const light = normalize3(context.light || { x: -0.64, y: -0.46, z: 0.62 });
    const ridgeNoise = Number(surface.ridgeNoise ?? 0.5);
    const grain = Number(surface.grain ?? 0.5);

    const perturbed = normalize3({
      x: n.x + (ridgeNoise - 0.5) * 0.028,
      y: n.y + (grain - 0.5) * 0.022,
      z: n.z
    });

    const raw = dot3(perturbed, light);
    const lightAmount = clamp01(raw * 0.72 + 0.36);
    const terminator = smoothstep(-0.18, 0.78, raw);

    return Object.freeze({
      light,
      raw,
      lightAmount,
      terminator,
      normal: perturbed
    });
  }

  function applySkyColor(color, surface = {}, lighting = null, context = {}) {
    const view = context.viewNormal || context.screenNormal || surface.viewNormal || surface.normal || { x: 0, y: 0, z: 1 };
    const viewNormal = normalize3(view);
    const rr = clamp01(Number(context.radiusRatio ?? (viewNormal.x * viewNormal.x + viewNormal.y * viewNormal.y)));

    const skyLighting = lighting || computeLighting(surface, surface.normal || viewNormal, context);
    const atmosphereStrength = Number(context.hazeStrength ?? SKY.hazeStrength);
    const cloudStrength = Number(context.cloudStrength ?? SKY.cloudStrength);
    const tintStrength = Number(context.lightTintStrength ?? SKY.lightTintStrength);

    const nightBlue = [1, 7, 17, 1];
    const atmosphereTint = [126, 232, 202, 1];
    const cloudWhite = [235, 248, 235, 1];
    const warmLight = [255, 244, 216, 1];

    const limb = Math.pow(clamp01(1 - rr), 0.32);
    const edgeDark = smoothstep(0.98, 0.35, rr);

    let lit = skyLighting.lightAmount * (0.58 + skyLighting.terminator * 0.56);
    lit *= 0.76 + limb * 0.32;
    lit *= 0.78 + edgeDark * 0.28;

    let out = mixColor(nightBlue, color, clamp01(lit));

    const atmosphericLift = Math.pow(clamp01(rr), 3.4) * atmosphereStrength;
    out = mixColor(out, atmosphereTint, atmosphericLift * 0.16);

    const cloud = computeCloud(surface, surface.normal || viewNormal, context);

    if (cloud > 0.64) {
      const cloudAlpha = clamp01((cloud - 0.64) * 0.30) * cloudStrength;
      out = mixColor(out, cloudWhite, cloudAlpha);
    }

    const haze = Math.pow(clamp01(rr), 5.8) * atmosphereStrength;
    out = mixColor(out, atmosphereTint, haze);

    const sunlightTint = clamp01(skyLighting.terminator * tintStrength);
    out = mixColor(out, warmLight, sunlightTint * 0.05);

    state.appliedCount += 1;
    state.lastAppliedAt = now();

    return out;
  }

  function drawAtmosphere(ctx, geometry = {}, context = {}) {
    if (!ctx) return false;

    const cx = Number(geometry.cx ?? geometry.centerX ?? 0);
    const cy = Number(geometry.cy ?? geometry.centerY ?? 0);
    const r = Number(geometry.r ?? geometry.radius ?? 0);
    const size = Number(geometry.size ?? Math.max(r * 2, 1));

    if (!r) return false;

    const rimStrength = Number(context.rimStrength ?? SKY.rimStrength);
    const hazeStrength = Number(context.hazeStrength ?? SKY.hazeStrength);

    const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.13);
    rim.addColorStop(0, "rgba(143,240,195,0)");
    rim.addColorStop(0.66, `rgba(143,240,195,${0.052 * rimStrength})`);
    rim.addColorStop(0.88, `rgba(141,216,255,${0.18 * rimStrength})`);
    rim.addColorStop(1, "rgba(143,240,195,0)");

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.13, 0, Math.PI * 2);
    ctx.fillStyle = rim;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.004, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(208,255,236,${0.22 * rimStrength})`;
    ctx.lineWidth = Math.max(1, size * 0.0032);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.038, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(141,216,255,${0.12 * rimStrength})`;
    ctx.lineWidth = Math.max(1, size * 0.003);
    ctx.stroke();

    const veil = ctx.createRadialGradient(cx, cy, r * 0.28, cx, cy, r * 1.02);
    veil.addColorStop(0, "rgba(255,255,255,0)");
    veil.addColorStop(0.58, `rgba(143,240,195,${0.020 * hazeStrength})`);
    veil.addColorStop(1, `rgba(141,216,255,${0.045 * hazeStrength})`);

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = veil;
    ctx.fill();

    ctx.restore();

    state.atmosphereDrawCount += 1;
    state.lastAtmosphereDrawAt = now();

    return true;
  }

  function drawWeatherVeil(ctx, geometry = {}, context = {}) {
    if (!ctx) return false;

    const cx = Number(geometry.cx ?? geometry.centerX ?? 0);
    const cy = Number(geometry.cy ?? geometry.centerY ?? 0);
    const r = Number(geometry.r ?? geometry.radius ?? 0);
    const rotation = Number(context.rotationLon ?? 0);

    if (!r) return false;

    const weatherStrength = Number(context.weatherStrength ?? SKY.weatherStrength);
    if (weatherStrength <= 0) return false;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.18 + rotation * 0.08);

    const bands = [
      { y: -0.32, width: 0.84, alpha: 0.030 },
      { y: 0.03, width: 0.92, alpha: 0.024 },
      { y: 0.31, width: 0.70, alpha: 0.020 }
    ];

    bands.forEach((band) => {
      const grad = ctx.createLinearGradient(-r * band.width, 0, r * band.width, 0);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.28, `rgba(235,248,235,${band.alpha * weatherStrength})`);
      grad.addColorStop(0.52, `rgba(143,240,195,${band.alpha * weatherStrength * 0.68})`);
      grad.addColorStop(0.82, `rgba(235,248,235,${band.alpha * weatherStrength})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.save();
      ctx.scale(1, 0.22);
      ctx.beginPath();
      ctx.ellipse(0, band.y * r, r * band.width, r * 0.14, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();

    return true;
  }

  function setWeatherState(nextState = {}) {
    state.weatherState = Object.freeze({
      ...state.weatherState,
      ...nextState,
      updatedAt: now()
    });

    state.lastWeatherState = state.weatherState;

    const global = win();
    global.AUDRALIA_WEATHER_STATE = state.weatherState;
    global.H_EARTH_INHERITED_AUDRALIA_WEATHER_STATE = state.weatherState;

    return state.weatherState;
  }

  function getWeatherState() {
    return state.weatherState;
  }

  function getSkyStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      route: ROUTE,
      sky: SKY,
      appliedCount: state.appliedCount,
      atmosphereDrawCount: state.atmosphereDrawCount,
      lastAppliedAt: state.lastAppliedAt,
      lastAtmosphereDrawAt: state.lastAtmosphereDrawAt,
      weatherState: state.weatherState,
      futureHEarthWeatherInheritance: SKY.futureHEarthWeatherInheritance,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const AUDRALIA_SKY_ENGINE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    route: ROUTE,
    sky: SKY,
    computeCloud,
    computeLighting,
    applySkyColor,
    drawAtmosphere,
    drawWeatherVeil,
    setWeatherState,
    getWeatherState,
    getSkyStatus,
    getStatus: getSkyStatus
  });

  const global = win();

  global.AUDRALIA_SKY_ENGINE = AUDRALIA_SKY_ENGINE;
  global.AudraliaSkyEngine = AUDRALIA_SKY_ENGINE;
  global.audraliaSkyEngine = AUDRALIA_SKY_ENGINE;
  global.AUDRALIA_WEATHER_STATE = state.weatherState;
  global.H_EARTH_INHERITED_AUDRALIA_WEATHER_STATE = state.weatherState;
})();
