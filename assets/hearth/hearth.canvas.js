// /assets/hearth/hearth.canvas.js
// HEARTH_G3_BODY_MASS_TERRAIN_MAP_DYNAMIC_TNT_v1
// Full-file replacement.
// Purpose:
// - Reclassify prior invalid G4 attempt as not accepted.
// - Raise Hearth from G2 to G3 by improving body mass, terrain, map shape, coastline, bathymetry, elevation, and polar/ice terrain.
// - Do NOT add G4 clouds/weather/climate systems.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_BODY_MASS_TERRAIN_MAP_DYNAMIC_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-body-mass-terrain-map";
  const RECEIPT = "HEARTH_G3_BODY_MASS_TERRAIN_MAP_RECEIPT";

  const MAP_W = 1080;
  const MAP_H = 540;
  const MIN_RENDER_SIZE = 300;
  const MAX_RENDER_SIZE = 720;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const GENERATION = Object.freeze({
    prior: "G2 accepted",
    current: "G3 candidate",
    g3Definition: "body mass, terrain map, coastlines, elevation, bathymetry, polar terrain",
    g4Deferred: "clouds, weather, climate, atmospheric systems"
  });

  if (typeof window.__HEARTH_CANVAS_G3_DISPOSE__ === "function") {
    try { window.__HEARTH_CANVAS_G3_DISPOSE__(); } catch (_) {}
  }

  if (typeof window.__HEARTH_CANVAS_G4_DISPOSE__ === "function") {
    try { window.__HEARTH_CANVAS_G4_DISPOSE__(); } catch (_) {}
  }

  if (typeof window.__HEARTH_CANVAS_DISPOSE__ === "function") {
    try { window.__HEARTH_CANVAS_DISPOSE__(); } catch (_) {}
  }

  const runtime = {
    mounted: false,
    disposed: false,
    raf: 0,
    lastFrame: 0,
    mount: null,
    canvas: null,
    ctx: null,
    work: null,
    workCtx: null,
    image: null,
    size: 0,
    map: null,
    observer: null
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, clamp(t, 0, 1)));

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function normalize3(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }

  function wrapLon(lon) {
    let v = lon;
    while (v < -180) v += 360;
    while (v > 180) v -= 360;
    return v;
  }

  function lonDelta(a, b) {
    return wrapLon(a - b);
  }

  const LIGHT = normalize3([-0.52, -0.34, 0.88]);
  const HALF_LIGHT = normalize3([LIGHT[0], LIGHT[1], LIGHT[2] + 1.18]);

  function hash2(x, y, seed = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed = 0) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed = 0, octaves = 5) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      sum += valueNoise(x * freq, y * freq, seed + i * 19.77) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? sum / norm : 0;
  }

  function ellipse(lon, lat, cx, cy, rx, ry, amp = 1, softness = 1) {
    const dx = lonDelta(lon, cx) / rx;
    const dy = (lat - cy) / ry;
    const q = 1 - (dx * dx + dy * dy);
    return amp * smoothstep(-0.35 * softness, 0.95, q);
  }

  function ridge(lon, lat, x1, y1, x2, y2, width, amp) {
    const px = lon;
    const py = lat;
    const ax = x1;
    const ay = y1;
    const bx = x2;
    const by = y2;
    const vx = lonDelta(bx, ax);
    const vy = by - ay;
    const wx = lonDelta(px, ax);
    const wy = py - ay;
    const c1 = wx * vx + wy * vy;
    const c2 = vx * vx + vy * vy || 1;
    const t = clamp(c1 / c2, 0, 1);
    const sx = ax + vx * t;
    const sy = ay + vy * t;
    const d = Math.hypot(lonDelta(px, sx), py - sy);
    return amp * (1 - smoothstep(width * 0.30, width, d));
  }

  function landMassField(lon, lat) {
    let f = 0;

    f += ellipse(lon, lat, -106, 52, 43, 22, 1.08);
    f += ellipse(lon, lat, -98, 35, 31, 20, 0.88);
    f += ellipse(lon, lat, -88, 18, 17, 14, 0.58);
    f += ellipse(lon, lat, -136, 58, 20, 11, 0.42);
    f += ellipse(lon, lat, -42, 72, 15, 9, 0.52);

    f += ellipse(lon, lat, -61, -15, 20, 37, 0.98);
    f += ellipse(lon, lat, -70, -38, 13, 25, 0.55);
    f += ellipse(lon, lat, -50, 3, 18, 16, 0.44);

    f += ellipse(lon, lat, 18, 4, 27, 35, 0.95);
    f += ellipse(lon, lat, 31, -23, 18, 23, 0.62);
    f += ellipse(lon, lat, 7, 24, 20, 18, 0.45);

    f += ellipse(lon, lat, 53, 49, 43, 18, 0.86);
    f += ellipse(lon, lat, 92, 52, 60, 22, 1.08);
    f += ellipse(lon, lat, 79, 24, 28, 22, 0.70);
    f += ellipse(lon, lat, 110, 24, 38, 22, 0.72);
    f += ellipse(lon, lat, 127, 8, 20, 18, 0.42);
    f += ellipse(lon, lat, 139, 38, 8, 14, 0.24);

    f += ellipse(lon, lat, 134, -25, 24, 17, 0.72);
    f += ellipse(lon, lat, 146, -42, 8, 5, 0.16);
    f += ellipse(lon, lat, 171, -42, 9, 8, 0.18);

    f += ellipse(lon, lat, 0, -82, 180, 12, 0.98);
    f += ellipse(lon, lat, -58, -63, 22, 8, 0.24);
    f += ellipse(lon, lat, 72, -49, 17, 9, 0.24);

    f -= ellipse(lon, lat, -39, 23, 42, 44, 0.55, 1.3);
    f -= ellipse(lon, lat, -152, -6, 32, 62, 0.45, 1.2);
    f -= ellipse(lon, lat, 65, -22, 36, 36, 0.45, 1.1);
    f -= ellipse(lon, lat, 34, 39, 12, 9, 0.30, 0.8);
    f -= ellipse(lon, lat, -83, 11, 12, 8, 0.22, 0.7);
    f -= ellipse(lon, lat, 118, -4, 18, 11, 0.20, 0.8);

    return f;
  }

  function elevationBoost(lon, lat) {
    let e = 0;

    e += ridge(lon, lat, -76, 8, -70, -54, 7, 0.50);
    e += ridge(lon, lat, -126, 52, -106, 28, 10, 0.33);
    e += ridge(lon, lat, 67, 30, 94, 34, 9, 0.55);
    e += ridge(lon, lat, 38, -5, 30, -30, 7, 0.22);
    e += ridge(lon, lat, 8, 45, 22, 46, 6, 0.18);
    e += ridge(lon, lat, 136, -20, 149, -36, 8, 0.18);

    return e;
  }

  function buildMap() {
    const len = MAP_W * MAP_H;
    const r = new Uint8ClampedArray(len);
    const g = new Uint8ClampedArray(len);
    const b = new Uint8ClampedArray(len);
    const land = new Uint8ClampedArray(len);
    const coast = new Uint8ClampedArray(len);
    const height = new Float32Array(len);
    const roughness = new Float32Array(len);
    const oceanDepth = new Float32Array(len);
    const ice = new Float32Array(len);

    for (let y = 0; y < MAP_H; y += 1) {
      const lat = 90 - (y / (MAP_H - 1)) * 180;
      const latAbs = Math.abs(lat);

      for (let x = 0; x < MAP_W; x += 1) {
        const lon = (x / MAP_W) * 360 - 180;
        const nx = x / MAP_W;
        const ny = y / MAP_H;
        const idx = y * MAP_W + x;

        const mass = landMassField(lon, lat);
        const continentalNoise = (fbm(nx * 16, ny * 11, 21.4, 5) - 0.5) * 0.18;
        const coastlineNoise = (fbm(nx * 60, ny * 38, 33.7, 4) - 0.5) * 0.075;
        const islandNoise = smoothstep(0.74, 0.93, fbm(nx * 86, ny * 44, 92.1, 3)) * 0.09;
        const ridgeLift = elevationBoost(lon, lat);
        const polarLift = latAbs > 66 ? ((latAbs - 66) / 24) * 0.06 : 0;

        const h = mass + continentalNoise + coastlineNoise + islandNoise + ridgeLift + polarLift - 0.52;
        const isLand = h > 0;

        height[idx] = h;
        land[idx] = isLand ? 255 : 0;

        const coastBand = 1 - smoothstep(0.010, 0.115, Math.abs(h));
        coast[idx] = Math.round(coastBand * 255);

        const terrainNoise = fbm(nx * 44 + 11, ny * 36 - 3, 13.9, 5);
        const fineNoise = fbm(nx * 144, ny * 84, 19.4, 3);
        const wet = fbm(nx * 12.5 - 4, ny * 8.2 + 5, 22.5, 5);
        const arid =
          smoothstep(8, 30, latAbs) *
          (1 - smoothstep(31, 57, latAbs)) *
          (1 - wet * 0.55);

        const glacialLat = smoothstep(63, 84, latAbs);
        const highSnow = isLand ? smoothstep(0.36, 0.82, h + terrainNoise * 0.18) : 0;
        const iceValue = clamp(glacialLat * 0.80 + highSnow * 0.42, 0, 1);
        ice[idx] = iceValue;

        if (isLand) {
          const elevation = clamp(h * 1.9, 0, 1);
          const mountain = smoothstep(0.36, 0.86, elevation + ridgeLift * 1.2);
          const green = clamp((wet - 0.28) * 1.38 * (1 - arid * 0.42), 0, 1);
          const shore = smoothstep(0, 0.050, h) * (1 - smoothstep(0.050, 0.18, h));

          let rr = mix(132, 42, green);
          let gg = mix(104, 120, green);
          let bb = mix(58, 70, green);

          rr = mix(rr, 174, arid * 0.48);
          gg = mix(gg, 140, arid * 0.38);
          bb = mix(bb, 88, arid * 0.30);

          rr = mix(rr, 112, mountain * 0.52);
          gg = mix(gg, 108, mountain * 0.48);
          bb = mix(bb, 104, mountain * 0.56);

          rr = mix(rr, 224, iceValue * 0.78);
          gg = mix(gg, 231, iceValue * 0.78);
          bb = mix(bb, 223, iceValue * 0.78);

          rr = mix(rr, 190, shore * 0.36);
          gg = mix(gg, 172, shore * 0.32);
          bb = mix(bb, 122, shore * 0.28);

          const grain = (terrainNoise - 0.5) * 23 + (fineNoise - 0.5) * 8;

          r[idx] = clamp(rr + grain, 0, 255);
          g[idx] = clamp(gg + grain * 0.86, 0, 255);
          b[idx] = clamp(bb + grain * 0.68, 0, 255);

          roughness[idx] = clamp(0.30 + terrainNoise * 0.42 + Math.max(0, h) * 0.35 + ridgeLift * 0.45, 0, 1);
          oceanDepth[idx] = 0;
        } else {
          const depth = clamp(-h * 2.45, 0, 1);
          const shelf = 1 - smoothstep(0.020, 0.17, -h);
          const current = fbm(nx * 32 + 18, ny * 18 - 7, 31.6, 5);
          const abyss = fbm(nx * 9, ny * 7, 35.0, 6);
          const reef = shelf * smoothstep(0.55, 0.90, fbm(nx * 62, ny * 42, 88.1, 3));

          let rr = mix(12, 0, depth);
          let gg = mix(88, 24, depth);
          let bb = mix(134, 78, depth);

          rr = mix(rr, 34, shelf * 0.76);
          gg = mix(gg, 154, shelf * 0.72);
          bb = mix(bb, 166, shelf * 0.70);

          rr = mix(rr, 3, abyss * depth * 0.42);
          gg = mix(gg, 38, abyss * depth * 0.32);
          bb = mix(bb, 102, abyss * depth * 0.30);

          rr = mix(rr, 74, reef * 0.20);
          gg = mix(gg, 184, reef * 0.30);
          bb = mix(bb, 174, reef * 0.26);

          const flow = (current - 0.5) * 18;

          r[idx] = clamp(rr + flow * 0.20, 0, 255);
          g[idx] = clamp(gg + flow * 0.52, 0, 255);
          b[idx] = clamp(bb + flow, 0, 255);

          roughness[idx] = clamp(0.10 + current * 0.18, 0, 1);
          oceanDepth[idx] = depth;
        }
      }
    }

    return { r, g, b, land, coast, height, roughness, oceanDepth, ice };
  }

  function sampleIndex(lonRad, latRad, xShift = 0) {
    let u = ((lonRad + Math.PI) / TAU + xShift) % 1;
    if (u < 0) u += 1;

    const v = clamp((HALF_PI - latRad) / Math.PI, 0, 0.999999);
    const x = Math.floor(u * MAP_W) % MAP_W;
    const y = Math.floor(v * MAP_H);

    return y * MAP_W + x;
  }

  function getMount() {
    const mount =
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-mount]") ||
      document.querySelector("[data-render='hearth']");

    if (mount) return mount;

    const main = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
    const fallback = document.createElement("section");
    fallback.id = "hearthCanvasMount";
    fallback.dataset.hearthMount = "";
    fallback.dataset.hearthFallbackMount = "true";
    fallback.dataset.contract = CONTRACT;
    fallback.style.position = "relative";
    fallback.style.width = "100%";
    fallback.style.aspectRatio = "1 / 1";
    fallback.style.minHeight = "300px";
    fallback.style.overflow = "hidden";
    main.appendChild(fallback);
    return fallback;
  }

  function installStyle() {
    const prior = document.getElementById("hearth-g3-body-mass-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-body-mass-style";
    style.textContent = `
      html,
      body {
        overflow-x: hidden !important;
        overflow-y: auto !important;
        touch-action: pan-y !important;
        -webkit-overflow-scrolling: touch !important;
      }

      #hearthCanvasMount,
      [data-hearth-mount] {
        position: relative;
        overflow: hidden;
        isolation: isolate;
        touch-action: pan-y !important;
      }

      #hearthCanvasMount canvas[data-hearth-canvas],
      [data-hearth-mount] canvas[data-hearth-canvas] {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        touch-action: pan-y !important;
      }

      .hearth-g3-chip {
        position: absolute;
        left: 14px;
        bottom: 12px;
        z-index: 4;
        padding: 6px 8px;
        border-radius: 999px;
        border: 1px solid rgba(135, 187, 221, 0.18);
        background: rgba(4, 14, 25, 0.42);
        color: rgba(214, 232, 244, 0.72);
        font: 800 10px/1.1 ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        pointer-events: none;
        user-select: none;
      }

      @media (max-width: 520px) {
        .hearth-g3-chip { display: none; }
      }
    `;

    document.head.appendChild(style);
  }

  function unlockScroll() {
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.touchAction = "pan-y";

    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";
    document.body.style.touchAction = "pan-y";
    document.body.style.overscrollBehaviorY = "auto";
    document.body.style.webkitOverflowScrolling = "touch";

    document.body.dataset.hearthScrollUnlocked = "true";
  }

  function resize() {
    if (!runtime.mount || !runtime.canvas) return;

    const rect = runtime.mount.getBoundingClientRect();
    const cssSize = Math.max(
      MIN_RENDER_SIZE,
      Math.floor(Math.min(rect.width || MIN_RENDER_SIZE, rect.height || rect.width || MIN_RENDER_SIZE))
    );

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const px = Math.max(MIN_RENDER_SIZE, Math.floor(cssSize * dpr));
    const workSize = Math.max(MIN_RENDER_SIZE, Math.min(MAX_RENDER_SIZE, px));

    runtime.canvas.width = px;
    runtime.canvas.height = px;

    if (runtime.size !== workSize) {
      runtime.size = workSize;
      runtime.work.width = workSize;
      runtime.work.height = workSize;
      runtime.image = runtime.workCtx.createImageData(workSize, workSize);
    }
  }

  function paintBackplate(ctx, w, h, time) {
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.50, h * 0.45, w * 0.05, w * 0.50, h * 0.50, w * 0.70);
    bg.addColorStop(0, "rgba(42, 85, 116, 0.34)");
    bg.addColorStop(0.52, "rgba(12, 30, 52, 0.78)");
    bg.addColorStop(1, "rgba(2, 7, 15, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.50;
    const cy = h * 0.50;
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.0011);

    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, w * (0.392 + i * 0.031), 0, TAU);
      ctx.strokeStyle = `rgba(102, 174, 225, ${0.088 - i * 0.016 + pulse * 0.010})`;
      ctx.lineWidth = Math.max(1, w * (0.006 - i * 0.0008));
      ctx.stroke();
    }
  }

  function paintSphere(time) {
    const size = runtime.size;
    const image = runtime.image;
    const map = runtime.map;

    if (!size || !image || !map) return;

    const data = image.data;
    data.fill(0);

    const cx = size * 0.5;
    const cy = size * 0.505;
    const radius = size * 0.405;
    const spin = time * 0.000048;
    const currentShift = (time * 0.000003) % 1;
    const tilt = -0.10;

    const cosA = Math.cos(spin);
    const sinA = Math.sin(spin);
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    const yMin = Math.max(0, Math.floor(cy - radius - 2));
    const yMax = Math.min(size - 1, Math.ceil(cy + radius + 2));
    const xMin = Math.max(0, Math.floor(cx - radius - 2));
    const xMax = Math.min(size - 1, Math.ceil(cx + radius + 2));

    for (let y = yMin; y <= yMax; y += 1) {
      const sy = (y - cy) / radius;
      const sy2 = sy * sy;

      for (let x = xMin; x <= xMax; x += 1) {
        const sx = (x - cx) / radius;
        const d2 = sx * sx + sy2;

        if (d2 > 1) continue;

        const z = Math.sqrt(1 - d2);

        let nx = sx;
        let ny = -sy;
        let nz = z;

        const ty = ny * cosT - nz * sinT;
        const tz = ny * sinT + nz * cosT;
        ny = ty;
        nz = tz;

        const rx = nx * cosA + nz * sinA;
        const rz = -nx * sinA + nz * cosA;

        const lat = Math.asin(clamp(ny, -1, 1));
        const lon = Math.atan2(rx, rz);

        const idx = sampleIndex(lon, lat, 0);
        const currentIdx = sampleIndex(lon, lat, currentShift);

        const isLand = map.land[idx] > 0;
        const coast = map.coast[idx] / 255;
        const h = map.height[idx];
        const rough = map.roughness[idx];
        const depth = map.oceanDepth[idx];
        const ice = map.ice[idx];

        let rr = map.r[idx];
        let gg = map.g[idx];
        let bb = map.b[idx];

        const light = clamp(nx * LIGHT[0] + ny * LIGHT[1] + z * LIGHT[2], 0, 1);
        const softLight = 0.36 + light * 0.72;
        const limb = Math.pow(1 - z, 1.72);

        if (!isLand) {
          const current = map.roughness[currentIdx];
          const currentVeil = smoothstep(0.18, 0.29, current) * (1 - depth * 0.48);
          rr = mix(rr, 45, currentVeil * 0.12);
          gg = mix(gg, 145, currentVeil * 0.20);
          bb = mix(bb, 190, currentVeil * 0.22);

          if (coast > 0.05) {
            const shelf = Math.pow(coast, 1.08);
            rr = mix(rr, 42, shelf * 0.30);
            gg = mix(gg, 174, shelf * 0.40);
            bb = mix(bb, 186, shelf * 0.36);
          }

          const specDot = clamp(nx * HALF_LIGHT[0] + ny * HALF_LIGHT[1] + z * HALF_LIGHT[2], 0, 1);
          const specPower = lerp(92, 52, depth);
          const spec = Math.pow(specDot, specPower) * clamp(light + 0.12, 0, 1) * (0.62 - depth * 0.20);

          rr = mix(rr, 214, spec * 0.32);
          gg = mix(gg, 234, spec * 0.30);
          bb = mix(bb, 252, spec * 0.28);
        }

        if (isLand) {
          if (coast > 0.05) {
            rr = mix(rr, 160, coast * 0.16);
            gg = mix(gg, 148, coast * 0.14);
            bb = mix(bb, 112, coast * 0.12);
          }

          const relief = clamp((h * 0.80 + rough * 0.34) * light, 0, 1);
          rr = mix(rr, rr + 17, relief * 0.13);
          gg = mix(gg, gg + 15, relief * 0.11);
          bb = mix(bb, bb + 11, relief * 0.09);

          if (ice > 0.20) {
            const iceGlow = smoothstep(0.2, 0.9, ice) * (0.25 + light * 0.35);
            rr = mix(rr, 238, iceGlow * 0.22);
            gg = mix(gg, 244, iceGlow * 0.22);
            bb = mix(bb, 238, iceGlow * 0.20);
          }
        }

        rr *= softLight;
        gg *= softLight;
        bb *= softLight;

        rr = mix(rr, 22, limb * 0.30);
        gg = mix(gg, 88, limb * 0.31);
        bb = mix(bb, 145, limb * 0.43);

        const atmosphere = Math.pow(limb, 2.35);
        rr = mix(rr, 40, atmosphere * 0.36);
        gg = mix(gg, 158, atmosphere * 0.48);
        bb = mix(bb, 226, atmosphere * 0.54);

        const terminator = smoothstep(0.0, 0.36, light);
        rr *= 0.72 + terminator * 0.34;
        gg *= 0.72 + terminator * 0.34;
        bb *= 0.76 + terminator * 0.30;

        const alpha = smoothstep(1.01, 0.985, d2);
        const out = (y * size + x) * 4;

        data[out] = clamp(rr, 0, 255);
        data[out + 1] = clamp(gg, 0, 255);
        data[out + 2] = clamp(bb, 0, 255);
        data[out + 3] = Math.round(alpha * 255);
      }
    }

    runtime.workCtx.putImageData(image, 0, 0);

    const wctx = runtime.workCtx;

    wctx.save();
    wctx.globalCompositeOperation = "screen";

    const gx = wctx.createRadialGradient(
      cx - radius * 0.22,
      cy - radius * 0.38,
      radius * 0.05,
      cx,
      cy,
      radius * 0.62
    );

    gx.addColorStop(0, "rgba(255,255,255,0.20)");
    gx.addColorStop(0.25, "rgba(142,205,250,0.07)");
    gx.addColorStop(1, "rgba(0,0,0,0)");

    wctx.fillStyle = gx;
    wctx.beginPath();
    wctx.arc(cx, cy, radius, 0, TAU);
    wctx.fill();
    wctx.restore();

    wctx.save();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.003, 0, TAU);
    wctx.strokeStyle = "rgba(116, 207, 255, 0.40)";
    wctx.lineWidth = Math.max(1, size * 0.006);
    wctx.stroke();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.045, 0, TAU);
    wctx.strokeStyle = "rgba(91, 174, 236, 0.15)";
    wctx.lineWidth = Math.max(1, size * 0.010);
    wctx.stroke();

    wctx.restore();
  }

  function composite(time) {
    const canvas = runtime.canvas;
    const ctx = runtime.ctx;

    if (!canvas || !ctx || !runtime.image) return;

    const w = canvas.width;
    const h = canvas.height;

    if (!w || !h) return;

    paintBackplate(ctx, w, h, time);
    paintSphere(time);

    const drawSize = Math.min(w, h);
    const dx = (w - drawSize) * 0.5;
    const dy = (h - drawSize) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(runtime.work, dx, dy, drawSize, drawSize);
    ctx.restore();

    const cx = w * 0.5;
    const cy = h * 0.505;
    const radius = drawSize * 0.405;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const halo = ctx.createRadialGradient(cx, cy, radius * 0.90, cx, cy, radius * 1.46);
    halo.addColorStop(0, "rgba(0,0,0,0)");
    halo.addColorStop(0.38, "rgba(62,154,226,0.12)");
    halo.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.46, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function loop(time) {
    if (runtime.disposed) return;

    if (!runtime.lastFrame || time - runtime.lastFrame > 30) {
      runtime.lastFrame = time;
      composite(time);
    }

    runtime.raf = requestAnimationFrame(loop);
  }

  function exposeReceipt(status) {
    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      renderOwner: "/assets/hearth/hearth.canvas.js",
      mount: "#hearthCanvasMount",
      generation: GENERATION,
      cloudsWeatherClimate: "deferred-to-G4",
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false,
      earthPlaceholder: false,
      audraliaMap: false,
      status
    });
  }

  function mount() {
    installStyle();
    unlockScroll();

    const mountEl = getMount();
    mountEl.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.generation = "G3-candidate";
    canvas.dataset.localScale = "hearth";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G3 body mass terrain map dynamic globe");

    const chip = document.createElement("div");
    chip.className = "hearth-g3-chip";
    chip.textContent = "Hearth G3 · Body Mass";

    mountEl.append(canvas, chip);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.work = document.createElement("canvas");
    runtime.workCtx = runtime.work.getContext("2d", { alpha: true, willReadFrequently: false });
    runtime.map = buildMap();

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mountEl.dataset.hearthGeneration = "G3-candidate";
    mountEl.dataset.hearthGenerationFocus = "body-mass-terrain-map";
    mountEl.dataset.g4Deferred = "clouds-weather-climate";
    mountEl.dataset.earthPlaceholder = "false";
    mountEl.dataset.audraliaMap = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G3-candidate";
    document.documentElement.dataset.hearthGenerationFocus = "body-mass-terrain-map";
    document.documentElement.dataset.hearthG4Deferred = "clouds-weather-climate";
    document.documentElement.dataset.hearthExternalImages = "false";
    document.documentElement.dataset.hearthNasaAsset = "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";
    document.documentElement.dataset.hearthEarthPlaceholder = "false";

    runtime.observer = new ResizeObserver(resize);
    runtime.observer.observe(mountEl);
    window.addEventListener("resize", resize, { passive: true });

    resize();
    exposeReceipt("mounted");

    runtime.mounted = true;
    runtime.raf = requestAnimationFrame(loop);
  }

  function dispose() {
    runtime.disposed = true;
    cancelAnimationFrame(runtime.raf);
    window.removeEventListener("resize", resize);

    if (runtime.observer) runtime.observer.disconnect();

    const style = document.getElementById("hearth-g3-body-mass-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G3_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;
  window.__HEARTH_G2_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G4_DISPOSE__ = dispose;

  function boot() {
    if (runtime.mounted || runtime.disposed) return;
    mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
