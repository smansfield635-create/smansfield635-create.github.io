// /assets/hearth/hearth.canvas.js
// HEARTH_G3_4_MAP_GENERATION_CANVAS_BIND_TNT_v1
// Full-file replacement.
// Purpose:
// - Bind Hearth canvas to the G3.4 terrain authority.
// - Fix visible map seam by using wrapped bilinear sampling.
// - Canvas owns projection, rotation, lighting, and render only.
// - Terrain owns map, elevation, mountains, relief, bathymetry.
// - G3 only. G4 remains deferred: clouds, weather, climate.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_4_MAP_GENERATION_CANVAS_BIND_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-4-map-generation-canvas";
  const RECEIPT = "HEARTH_G3_4_CANVAS_BIND_RECEIPT";
  const TERRAIN_SRC = "/assets/hearth/hearth.terrain.js?v=hearth-g3-4-map-generation";

  const MAP_W = 900;
  const MAP_H = 450;
  const MIN_RENDER_SIZE = 300;
  const MAX_RENDER_SIZE = 720;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  [
    "__HEARTH_CANVAS_G3_4_DISPOSE__",
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

      document.querySelectorAll('script[src*="/assets/hearth/hearth.terrain.js"]').forEach((n) => n.remove());

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
    const field =
      Math.sin(nx * 15 + 1.2) * 0.15 +
      Math.cos(ny * 11 - 0.7) * 0.14 +
      fbm(nx * 7, ny * 4, 10, 4) -
      0.50;

    const land = field > 0;
    const coast = 1 - smoothstep(0.01, 0.12, Math.abs(field));

    return {
      land,
      elevation: land ? clamp(field * 1.9, 0, 1) : -clamp(-field * 2.3, 0, 1),
      relief: land ? 0.25 + clamp(field * 1.6, 0, 1) * 0.6 : 0.1,
      ridge: 0,
      mountain: land ? smoothstep(0.50, 0.90, field * 1.9) : 0,
      shelf: land ? 0 : clamp(coast, 0, 1),
      slope: land ? 0 : smoothstep(0.12, 0.45, -field),
      abyss: land ? 0 : smoothstep(0.40, 0.9, -field),
      bathymetry: land ? 0 : clamp(-field * 2.0, 0, 1),
      coast: clamp(coast, 0, 1),
      ice: Math.abs(lat) > 66 ? 0.65 : 0,
      moisture: 0.5,
      aridity: 0.25,
      roughness: 0.4,
      biome: land ? "lowland" : "ocean"
    };
  }

  function colorForSample(s, lon, lat) {
    const nx = (lon + 180) / 360;
    const ny = (90 - lat) / 180;
    const texture = fbm(nx * 44 + 11, ny * 34 - 3, 13.9, 4);
    const fine = fbm(nx * 124, ny * 72, 19.4, 3);
    const current = fbm(nx * 30 + 18, ny * 18 - 7, 31.6, 4);
    const reef = s.shelf * smoothstep(0.55, 0.90, fbm(nx * 58, ny * 40, 88.1, 3));

    if (s.land) {
      const green = clamp((s.moisture - 0.28) * 1.38 * (1 - s.aridity * 0.44), 0, 1);
      const shore = smoothstep(0, 0.42, s.coast);
      const highland = s.highland || smoothstep(0.42, 0.80, s.elevation);
      const mountain = s.mountain || 0;

      let r = mix(132, 42, green);
      let g = mix(105, 122, green);
      let b = mix(58, 72, green);

      r = mix(r, 176, s.aridity * 0.48);
      g = mix(g, 142, s.aridity * 0.38);
      b = mix(b, 90, s.aridity * 0.30);

      r = mix(r, 118, highland * 0.30);
      g = mix(g, 116, highland * 0.26);
      b = mix(b, 104, highland * 0.24);

      r = mix(r, 96, mountain * 0.50);
      g = mix(g, 96, mountain * 0.46);
      b = mix(b, 96, mountain * 0.44);

      r = mix(r, 230, s.ice * 0.70);
      g = mix(g, 236, s.ice * 0.70);
      b = mix(b, 230, s.ice * 0.70);

      r = mix(r, 194, shore * 0.20);
      g = mix(g, 176, shore * 0.18);
      b = mix(b, 126, shore * 0.16);

      const grain = (texture - 0.5) * 24 + (fine - 0.5) * 11;

      return [
        clamp(r + grain, 0, 255),
        clamp(g + grain * 0.86, 0, 255),
        clamp(b + grain * 0.68, 0, 255)
      ];
    }

    const depth = s.bathymetry || 0;
    const shelf = s.shelf || 0;
    const slope = s.slope || 0;
    const abyss = s.abyss || 0;

    let r = mix(18, 0, depth);
    let g = mix(102, 24, depth);
    let b = mix(148, 80, depth);

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
    const r = new Float32Array(len);
    const g = new Float32Array(len);
    const b = new Float32Array(len);
    const land = new Float32Array(len);
    const coast = new Float32Array(len);
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
      const lat = 90 - (y / MAP_H) * 180;

      for (let x = 0; x < MAP_W; x += 1) {
        const lon = (x / MAP_W) * 360 - 180;
        const idx = y * MAP_W + x;
        const s = sample(lon, lat);
        const c = colorForSample(s, lon, lat);

        r[idx] = c[0];
        g[idx] = c[1];
        b[idx] = c[2];

        land[idx] = s.land ? 1 : 0;
        coast[idx] = clamp(s.coast || 0, 0, 1);
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

  function bilinear(map, key, u, v) {
    const x = ((u % 1) + 1) % 1 * MAP_W;
    const y = clamp(v, 0, 0.999999) * MAP_H;

    const x0 = Math.floor(x) % MAP_W;
    const y0 = Math.floor(y);
    const x1 = (x0 + 1) % MAP_W;
    const y1 = Math.min(MAP_H - 1, y0 + 1);

    const tx = x - Math.floor(x);
    const ty = y - Math.floor(y);

    const arr = map[key];

    const a = arr[y0 * MAP_W + x0];
    const b = arr[y0 * MAP_W + x1];
    const c = arr[y1 * MAP_W + x0];
    const d = arr[y1 * MAP_W + x1];

    return lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
  }

  function sampleMap(map, lonRad, latRad) {
    const u = (lonRad + Math.PI) / TAU;
    const v = (HALF_PI - latRad) / Math.PI;

    return {
      r: bilinear(map, "r", u, v),
      g: bilinear(map, "g", u, v),
      b: bilinear(map, "b", u, v),
      land: bilinear(map, "land", u, v),
      coast: bilinear(map, "coast", u, v),
      height: bilinear(map, "height", u, v),
      relief: bilinear(map, "relief", u, v),
      roughness: bilinear(map, "roughness", u, v),
      bathymetry: bilinear(map, "bathymetry", u, v),
      shelf: bilinear(map, "shelf", u, v),
      ice: bilinear(map, "ice", u, v)
    };
  }

  function reliefShade(map, lonRad, latRad, s, isLand) {
    const e = 0.0028;
    const hE = sampleMap(map, lonRad + e, latRad).height;
    const hW = sampleMap(map, lonRad - e, latRad).height;
    const hN = sampleMap(map, lonRad, latRad + e).height;
    const hS = sampleMap(map, lonRad, latRad - e).height;
    const dx = hW - hE;
    const dy = hS - hN;

    const base = isLand
      ? 1 + dx * 1.65 + dy * 1.15 + s.relief * 0.16
      : 1 + dx * 0.48 + dy * 0.36 - s.bathymetry * 0.10 + s.shelf * 0.08;

    return clamp(base, isLand ? 0.66 : 0.80, isLand ? 1.34 : 1.18);
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
    const prior = document.getElementById("hearth-g3-4-map-canvas-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-4-map-canvas-style";
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

      .hearth-g3-4-chip {
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
        .hearth-g3-4-chip { display: none; }
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

        const s = sampleMap(map, lon, lat);
        const current = sampleMap(map, lon + currentShift * TAU, lat);

        const isLand = s.land > 0.5;
        const light = clamp(nx * LIGHT[0] + ny * LIGHT[1] + z * LIGHT[2], 0, 1);
        const softLight = 0.35 + light * 0.74;
        const limb = Math.pow(1 - z, 1.72);
        const reliefFactor = reliefShade(map, lon, lat, s, isLand);

        let rr = s.r;
        let gg = s.g;
        let bb = s.b;

        if (!isLand) {
          const currentVeil = smoothstep(0.18, 0.31, current.roughness) * (1 - s.bathymetry * 0.52);

          rr = mix(rr, 45, currentVeil * 0.10);
          gg = mix(gg, 142, currentVeil * 0.18);
          bb = mix(bb, 190, currentVeil * 0.20);

          if (s.shelf > 0.08) {
            rr = mix(rr, 42, s.shelf * 0.32);
            gg = mix(gg, 180, s.shelf * 0.42);
            bb = mix(bb, 188, s.shelf * 0.38);
          }

          if (s.coast > 0.04) {
            const edge = Math.pow(s.coast, 1.05);
            rr = mix(rr, 54, edge * 0.18);
            gg = mix(gg, 184, edge * 0.26);
            bb = mix(bb, 196, edge * 0.24);
          }

          const specDot = clamp(nx * HALF_LIGHT[0] + ny * HALF_LIGHT[1] + z * HALF_LIGHT[2], 0, 1);
          const specPower = lerp(94, 52, s.bathymetry);
          const spec = Math.pow(specDot, specPower) * clamp(light + 0.10, 0, 1) * (0.58 - s.bathymetry * 0.18);

          rr = mix(rr, 214, spec * 0.28);
          gg = mix(gg, 234, spec * 0.26);
          bb = mix(bb, 252, spec * 0.24);
        }

        if (isLand) {
          if (s.coast > 0.05) {
            rr = mix(rr, 162, s.coast * 0.17);
            gg = mix(gg, 150, s.coast * 0.15);
            bb = mix(bb, 114, s.coast * 0.13);
          }

          const ridgeLight = clamp((s.height * 0.84 + s.roughness * 0.38) * light, 0, 1);
          rr = mix(rr, rr + 20, ridgeLight * 0.15);
          gg = mix(gg, gg + 16, ridgeLight * 0.13);
          bb = mix(bb, bb + 12, ridgeLight * 0.10);

          if (s.ice > 0.20) {
            const iceGlow = smoothstep(0.2, 0.9, s.ice) * (0.22 + light * 0.32);
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

  function loop(time) {
    if (runtime.disposed) return;

    if (!runtime.lastFrame || time - runtime.lastFrame > 30) {
      runtime.lastFrame = time;
      composite(time);
    }

    runtime.raf = requestAnimationFrame(loop);
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
      generation: "G3.4-candidate",
      canvasOwns: ["mount", "projection", "rotation", "lighting", "render-composition"],
      terrainOwns: ["map", "body-mass", "elevation", "mountain-ranges", "relief", "bathymetry"],
      seamFix: "wrapped bilinear sampling plus seam-safe terrain authority",
      g4Deferred: "clouds-weather-climate",
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false,
      earthPlaceholder: false,
      audraliaMap: false,
      status
    });
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
    canvas.dataset.generation = "G3.4-candidate";
    canvas.dataset.localScale = "hearth";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G3.4 map generation terrain globe");

    const chip = document.createElement("div");
    chip.className = "hearth-g3-4-chip";
    chip.textContent = terrain ? "Hearth G3.4 · Map Terrain" : "Hearth G3.4 · Terrain Fallback";

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
    mountEl.dataset.hearthGeneration = "G3.4-candidate";
    mountEl.dataset.hearthGenerationFocus = "map-generation-terrain";
    mountEl.dataset.g4Deferred = "clouds-weather-climate";
    mountEl.dataset.earthPlaceholder = "false";
    mountEl.dataset.audraliaMap = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    document.documentElement.dataset.hearthTerrainLoaded = terrain ? "true" : "false";
    document.documentElement.dataset.hearthGeneration = "G3.4-candidate";
    document.documentElement.dataset.hearthGenerationFocus = "map-generation-terrain";
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

    const style = document.getElementById("hearth-g3-4-map-canvas-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_4_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G3_4_DISPOSE__ = dispose;
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
