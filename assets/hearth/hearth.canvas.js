// /assets/hearth/hearth.canvas.js
// HEARTH_G3_3_TERRAIN_FILE_CANVAS_BIND_TNT_v1
// Full-file replacement.
// Purpose:
// - Bind Hearth canvas renderer to /assets/hearth/hearth.terrain.js.
// - Canvas owns mount, projection, rotation, lighting, and render composition only.
// - Terrain file owns elevation, mountain ranges, relief, bathymetry, coastline, shelves, and polar/frozen terrain.
// - G3 only. G4 remains deferred for clouds/weather/climate.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_3_TERRAIN_FILE_CANVAS_BIND_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-3-terrain-file-canvas-bind";
  const RECEIPT = "HEARTH_G3_3_TERRAIN_FILE_CANVAS_BIND_RECEIPT";
  const TERRAIN_SRC = "/assets/hearth/hearth.terrain.js?v=hearth-g3-3-terrain-file";

  const MAP_W = 720;
  const MAP_H = 360;
  const MIN_RENDER_SIZE = 300;
  const MAX_RENDER_SIZE = 720;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const GENERATION = Object.freeze({
    previousAccepted: "G2",
    currentCandidate: "G3.3",
    focus: "terrain file bound to canvas renderer",
    g3Definition: "terrain, map, body mass, coastline, elevation, bathymetry, polar/frozen terrain",
    g4Deferred: "clouds, weather, climate, atmospheric systems"
  });

  [
    "__HEARTH_CANVAS_G3_3_DISPOSE__",
    "__HEARTH_CANVAS_G3_2_DISPOSE__",
    "__HEARTH_CANVAS_G3_1_DISPOSE__",
    "__HEARTH_CANVAS_G3_DISPOSE__",
    "__HEARTH_CANVAS_G4_DISPOSE__",
    "__HEARTH_CANVAS_DISPOSE__",
    "__HEARTH_G2_DISPOSE__"
  ].forEach((name) => {
    if (typeof window[name] === "function") {
      try { window[name](); } catch (_) {}
    }
  });

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
    const t = clamp((x - a) / ((b - a) || 1e-9), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function normalize3(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }

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

  function fbm(x, y, seed = 0, octaves = 4) {
    let sum = 0;
    let amp = 0.5;
    let freq = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      sum += valueNoise(x * freq, y * freq, seed + i * 17.71) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? sum / norm : 0;
  }

  const LIGHT = normalize3([-0.54, -0.34, 0.88]);
  const HALF_LIGHT = normalize3([LIGHT[0], LIGHT[1], LIGHT[2] + 1.18]);

  function loadTerrain() {
    return new Promise((resolve) => {
      if (window.HEARTH_TERRAIN && typeof window.HEARTH_TERRAIN.sample === "function") {
        resolve(window.HEARTH_TERRAIN);
        return;
      }

      const existing = document.querySelector(`script[src*="/assets/hearth/hearth.terrain.js"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.HEARTH_TERRAIN || null), { once: true });
        existing.addEventListener("error", () => resolve(null), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = TERRAIN_SRC;
      script.defer = true;
      script.dataset.hearthTerrainScript = "true";
      script.dataset.contract = CONTRACT;

      script.addEventListener("load", () => resolve(window.HEARTH_TERRAIN || null), { once: true });
      script.addEventListener("error", () => resolve(null), { once: true });

      document.head.appendChild(script);
    });
  }

  function fallbackTerrainSample(lon, lat) {
    const nx = (lon + 180) / 360;
    const ny = (90 - lat) / 180;
    const landValue =
      Math.sin(nx * 18.0 + 2.0) * 0.16 +
      Math.cos(ny * 14.0 - 1.5) * 0.12 +
      fbm(nx * 8, ny * 4, 10, 4) -
      0.48;

    const land = landValue > 0;
    const elevation = land ? clamp(landValue * 1.8, 0, 1) : -clamp(-landValue * 2.2, 0, 1);
    const coast = 1 - smoothstep(0.01, 0.13, Math.abs(landValue));

    return {
      land,
      signedDistance: landValue * 20,
      elevation,
      relief: land ? clamp(0.2 + elevation * 0.6, 0, 1) : 0.1,
      ridge: 0,
      mountain: land ? smoothstep(0.55, 0.9, elevation) : 0,
      shelf: land ? 0 : clamp(coast, 0, 1),
      slope: land ? 0 : smoothstep(0.15, 0.5, -landValue),
      abyss: land ? 0 : smoothstep(0.45, 0.9, -landValue),
      bathymetry: land ? 0 : clamp(-landValue * 2, 0, 1),
      coast: clamp(coast, 0, 1),
      ice: Math.abs(lat) > 66 || elevation > 0.82 ? 0.65 : 0,
      moisture: 0.5,
      aridity: 0.25,
      roughness: 0.4,
      biome: land ? "lowland" : "ocean",
      g4Deferred: true
    };
  }

  function colorForSample(s, lon, lat) {
    const nx = (lon + 180) / 360;
    const ny = (90 - lat) / 180;
    const terrainNoise = fbm(nx * 38 + 11, ny * 30 - 3, 13.9, 4);
    const fineNoise = fbm(nx * 124, ny * 72, 19.4, 3);
    const current = fbm(nx * 30 + 18, ny * 18 - 7, 31.6, 4);
    const reef = s.shelf * smoothstep(0.55, 0.90, fbm(nx * 58, ny * 40, 88.1, 3));

    let r;
    let g;
    let b;

    if (s.land) {
      const green = clamp((s.moisture - 0.28) * 1.38 * (1 - s.aridity * 0.44), 0, 1);
      const shore = smoothstep(0, 0.42, s.coast);
      const mountain = s.mountain;
      const highland = s.highland || smoothstep(0.42, 0.80, s.elevation);

      r = mix(132, 42, green);
      g = mix(105, 122, green);
      b = mix(58, 72, green);

      r = mix(r, 176, s.aridity * 0.48);
      g = mix(g, 142, s.aridity * 0.38);
      b = mix(b, 90, s.aridity * 0.30);

      r = mix(r, 120, highland * 0.28);
      g = mix(g, 118, highland * 0.25);
      b = mix(b, 106, highland * 0.22);

      r = mix(r, 100, mountain * 0.48);
      g = mix(g, 100, mountain * 0.44);
      b = mix(b, 98, mountain * 0.42);

      r = mix(r, 228, s.ice * 0.72);
      g = mix(g, 234, s.ice * 0.72);
      b = mix(b, 228, s.ice * 0.72);

      r = mix(r, 194, shore * 0.22);
      g = mix(g, 176, shore * 0.20);
      b = mix(b, 126, shore * 0.18);

      const grain = (terrainNoise - 0.5) * 25 + (fineNoise - 0.5) * 12;

      return [
        clamp(r + grain, 0, 255),
        clamp(g + grain * 0.86, 0, 255),
        clamp(b + grain * 0.68, 0, 255)
      ];
    }

    const depth = s.bathymetry;
    const shelf = s.shelf;
    const slope = s.slope;
    const abyss = s.abyss;

    r = mix(18, 0, depth);
    g = mix(102, 24, depth);
    b = mix(148, 80, depth);

    r = mix(r, 38, shelf * 0.86);
    g = mix(g, 174, shelf * 0.84);
    b = mix(b, 180, shelf * 0.80);

    r = mix(r, 12, slope * 0.34);
    g = mix(g, 84, slope * 0.34);
    b = mix(b, 142, slope * 0.34);

    r = mix(r, 2, abyss * 0.44);
    g = mix(g, 32, abyss * 0.36);
    b = mix(b, 88, abyss * 0.34);

    r = mix(r, 78, reef * 0.24);
    g = mix(g, 196, reef * 0.34);
    b = mix(b, 184, reef * 0.30);

    const flow = (current - 0.5) * 15;

    return [
      clamp(r + flow * 0.18, 0, 255),
      clamp(g + flow * 0.46, 0, 255),
      clamp(b + flow, 0, 255)
    ];
  }

  function buildMap(terrain) {
    const len = MAP_W * MAP_H;

    const r = new Uint8ClampedArray(len);
    const g = new Uint8ClampedArray(len);
    const b = new Uint8ClampedArray(len);
    const land = new Uint8ClampedArray(len);
    const coast = new Uint8ClampedArray(len);
    const height = new Float32Array(len);
    const relief = new Float32Array(len);
    const roughness = new Float32Array(len);
    const bathymetry = new Float32Array(len);
    const shelf = new Float32Array(len);
    const ice = new Float32Array(len);

    const sample = terrain && typeof terrain.sample === "function"
      ? terrain.sample
      : fallbackTerrainSample;

    for (let y = 0; y < MAP_H; y += 1) {
      const lat = 90 - (y / (MAP_H - 1)) * 180;

      for (let x = 0; x < MAP_W; x += 1) {
        const lon = (x / MAP_W) * 360 - 180;
        const idx = y * MAP_W + x;
        const s = sample(lon, lat);
        const color = colorForSample(s, lon, lat);

        r[idx] = color[0];
        g[idx] = color[1];
        b[idx] = color[2];

        land[idx] = s.land ? 255 : 0;
        coast[idx] = Math.round(clamp(s.coast || 0, 0, 1) * 255);
        height[idx] = s.elevation || 0;
        relief[idx] = s.relief || 0;
        roughness[idx] = s.roughness || 0;
        bathymetry[idx] = s.bathymetry || 0;
        shelf[idx] = s.shelf || 0;
        ice[idx] = s.ice || 0;
      }
    }

    return { r, g, b, land, coast, height, relief, roughness, bathymetry, shelf, ice };
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
    const prior = document.getElementById("hearth-g3-3-terrain-canvas-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-3-terrain-canvas-style";
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

      .hearth-g3-3-chip {
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
        .hearth-g3-3-chip { display: none; }
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

  function reliefShade(map, lon, lat, idx, isLand) {
    const e = 0.012;
    const hE = map.height[sampleIndex(lon + e, lat, 0)];
    const hW = map.height[sampleIndex(lon - e, lat, 0)];
    const hN = map.height[sampleIndex(lon, lat + e, 0)];
    const hS = map.height[sampleIndex(lon, lat - e, 0)];
    const dx = hW - hE;
    const dy = hS - hN;

    const base = isLand
      ? 1 + dx * 1.65 + dy * 1.15 + map.relief[idx] * 0.16
      : 1 + dx * 0.48 + dy * 0.36 - map.bathymetry[idx] * 0.10 + map.shelf[idx] * 0.08;

    return clamp(base, isLand ? 0.66 : 0.80, isLand ? 1.34 : 1.18);
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
        const depth = map.bathymetry[idx];
        const shelf = map.shelf[idx];
        const ice = map.ice[idx];

        let rr = map.r[idx];
        let gg = map.g[idx];
        let bb = map.b[idx];

        const light = clamp(nx * LIGHT[0] + ny * LIGHT[1] + z * LIGHT[2], 0, 1);
        const softLight = 0.35 + light * 0.74;
        const limb = Math.pow(1 - z, 1.72);
        const reliefFactor = reliefShade(map, lon, lat, idx, isLand);

        if (!isLand) {
          const current = map.roughness[currentIdx];
          const currentVeil = smoothstep(0.18, 0.31, current) * (1 - depth * 0.52);

          rr = mix(rr, 45, currentVeil * 0.10);
          gg = mix(gg, 142, currentVeil * 0.18);
          bb = mix(bb, 190, currentVeil * 0.20);

          if (shelf > 0.08) {
            rr = mix(rr, 42, shelf * 0.32);
            gg = mix(gg, 180, shelf * 0.42);
            bb = mix(bb, 188, shelf * 0.38);
          }

          if (coast > 0.04) {
            const edge = Math.pow(coast, 1.05);
            rr = mix(rr, 54, edge * 0.18);
            gg = mix(gg, 184, edge * 0.26);
            bb = mix(bb, 196, edge * 0.24);
          }

          const specDot = clamp(nx * HALF_LIGHT[0] + ny * HALF_LIGHT[1] + z * HALF_LIGHT[2], 0, 1);
          const specPower = lerp(94, 52, depth);
          const spec = Math.pow(specDot, specPower) * clamp(light + 0.10, 0, 1) * (0.58 - depth * 0.18);

          rr = mix(rr, 214, spec * 0.28);
          gg = mix(gg, 234, spec * 0.26);
          bb = mix(bb, 252, spec * 0.24);
        }

        if (isLand) {
          if (coast > 0.05) {
            rr = mix(rr, 162, coast * 0.17);
            gg = mix(gg, 150, coast * 0.15);
            bb = mix(bb, 114, coast * 0.13);
          }

          const ridgeLight = clamp((h * 0.84 + rough * 0.38) * light, 0, 1);
          rr = mix(rr, rr + 20, ridgeLight * 0.15);
          gg = mix(gg, gg + 16, ridgeLight * 0.13);
          bb = mix(bb, bb + 12, ridgeLight * 0.10);

          if (ice > 0.20) {
            const iceGlow = smoothstep(0.2, 0.9, ice) * (0.22 + light * 0.32);
            rr = mix(rr, 240, iceGlow * 0.20);
            gg = mix(gg, 246, iceGlow * 0.20);
            bb = mix(bb, 240, iceGlow * 0.18);
          }
        }

        rr *= softLight * reliefFactor;
        gg *= softLight * reliefFactor;
        bb *= softLight * reliefFactor;

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

    gx.addColorStop(0, "rgba(255,255,255,0.19)");
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

  function installStyle() {
    const prior = document.getElementById("hearth-g3-3-terrain-canvas-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-3-terrain-canvas-style";
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

      .hearth-g3-3-chip {
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
        .hearth-g3-3-chip { display: none; }
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

  function exposeReceipt(status) {
    const terrainReceipt =
      window.HEARTH_TERRAIN && typeof window.HEARTH_TERRAIN.receipt === "function"
        ? window.HEARTH_TERRAIN.receipt()
        : null;

    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      renderOwner: "/assets/hearth/hearth.canvas.js",
      terrainOwner: "/assets/hearth/hearth.terrain.js",
      terrainContract: window.HEARTH_TERRAIN?.contract || "fallback",
      terrainReceipt,
      mount: "#hearthCanvasMount",
      generation: GENERATION,
      canvasOwns: ["mount", "projection", "rotation", "lighting", "render-composition"],
      terrainOwns: ["elevation", "mountain-ranges", "relief", "bathymetry", "coast-shelves", "polar-frozen-terrain"],
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

  function loop(time) {
    if (runtime.disposed) return;

    if (!runtime.lastFrame || time - runtime.lastFrame > 30) {
      runtime.lastFrame = time;
      composite(time);
    }

    runtime.raf = requestAnimationFrame(loop);
  }

  async function mount() {
    installStyle();
    unlockScroll();

    const terrain = await loadTerrain();

    if (runtime.disposed) return;

    const mountEl = getMount();
    mountEl.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.generation = "G3.3-candidate";
    canvas.dataset.localScale = "hearth";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G3.3 terrain-file elevation and mountain range globe");

    const chip = document.createElement("div");
    chip.className = "hearth-g3-3-chip";
    chip.textContent = terrain
      ? "Hearth G3.3 · Terrain File"
      : "Hearth G3.3 · Terrain Fallback";

    mountEl.append(canvas, chip);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.work = document.createElement("canvas");
    runtime.workCtx = runtime.work.getContext("2d", { alpha: true, willReadFrequently: false });
    runtime.map = buildMap(terrain);

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mountEl.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    mountEl.dataset.hearthTerrainLoaded = terrain ? "true" : "false";
    mountEl.dataset.hearthGeneration = "G3.3-candidate";
    mountEl.dataset.hearthGenerationFocus = "terrain-file-elevation-mountain-ranges";
    mountEl.dataset.g4Deferred = "clouds-weather-climate";
    mountEl.dataset.earthPlaceholder = "false";
    mountEl.dataset.audraliaMap = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    document.documentElement.dataset.hearthTerrainLoaded = terrain ? "true" : "false";
    document.documentElement.dataset.hearthGeneration = "G3.3-candidate";
    document.documentElement.dataset.hearthGenerationFocus = "terrain-file-elevation-mountain-ranges";
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

    const style = document.getElementById("hearth-g3-3-terrain-canvas-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_3_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G3_3_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_2_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_1_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G4_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;
  window.__HEARTH_G2_DISPOSE__ = dispose;

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
