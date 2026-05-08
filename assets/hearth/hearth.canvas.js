// /assets/hearth/hearth.canvas.js
// HEARTH_G3_10_CHAIN_ALIGNED_CANVAS_BIND_TNT_v1
// Full-file replacement.
// Purpose:
// - Preserve the current true-sphere canvas render logic.
// - Align active import keys with the G3.10 Hearth chain.
// - Load accepted terrain authority and G3.10 solid global hydration authority.
// - Retire stale G2 route/cache and G3.7 hydration cache from the canvas boot path.
// - Canvas owns projection, rotation, wrapped sampling, and proof render only.
// - Terrain owns body mass, elevation, mountain ranges, relief, and bathymetry.
// - Hydration owns solid global hydration, ocean material, shelves, basins, drainage, frozen storage, and saturation.
// - G3 only. G4 remains deferred: clouds, weather, climate.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_10_CHAIN_ALIGNED_CANVAS_BIND_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-10-chain-aligned-canvas-bind";
  const RECEIPT = "HEARTH_G3_10_CHAIN_ALIGNED_CANVAS_BIND_RECEIPT";

  const TERRAIN_SRC = "/assets/hearth/hearth.terrain.js?v=hearth-g3-4-accepted-terrain-authority";
  const HYDRATION_SRC = "/assets/hearth/hearth.hydration.js?v=hearth-g3-10-solid-global-hydration-field";

  const MAP_W = 900;
  const MAP_H = 450;
  const MIN_RENDER_SIZE = 300;
  const MAX_RENDER_SIZE = 720;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const TIC_TAC_TOE = Object.freeze({
    T1: "isolate Hearth chain alignment",
    T2: "preserve terrain authority",
    T3: "preserve hydration authority",
    T4: "retire G2 route/cache authority",
    T5: "retire G3.7 hydration cache key",
    T6: "bind G3.10 hydration into canvas",
    T7: "keep visual math frozen",
    T8: "hold G3 candidate until served-source proof",
    T9: "return one coherent receipt chain"
  });

  const QUAD_A = Object.freeze({
    authority: "/assets/hearth/hearth.canvas.js import chain only",
    axis: "Hearth G3.10 chain alignment",
    artifact: "canvas bound to current terrain and hydration authorities",
    attack: "reject stale G2 boot, stale G3.7 hydration key, mixed-generation live chain, visual rewrite drift"
  });

  [
    "__HEARTH_CANVAS_G3_10_DISPOSE__",
    "__HEARTH_CANVAS_G3_9_DISPOSE__",
    "__HEARTH_CANVAS_G3_8_DISPOSE__",
    "__HEARTH_CANVAS_G3_7_DISPOSE__",
    "__HEARTH_CANVAS_G3_6_DISPOSE__",
    "__HEARTH_CANVAS_G3_5_DISPOSE__",
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

    try { window[name] = null; } catch (_) {}
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

  function loadScriptOnce(globalName, src, markerName) {
    return new Promise((resolve) => {
      if (window[globalName]) {
        resolve(window[globalName]);
        return;
      }

      const baseSrc = src.split("?")[0];
      const existing = document.querySelector(`script[src*="${baseSrc}"]`);

      if (existing) {
        existing.addEventListener("load", () => resolve(window[globalName] || null), { once: true });
        existing.addEventListener("error", () => resolve(null), { once: true });

        setTimeout(() => {
          resolve(window[globalName] || null);
        }, 250);

        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.dataset[markerName] = "true";
      script.dataset.contract = CONTRACT;

      script.addEventListener("load", () => resolve(window[globalName] || null), { once: true });
      script.addEventListener("error", () => resolve(null), { once: true });

      document.head.appendChild(script);
    });
  }

  async function loadAuthorities() {
    const terrain = await loadScriptOnce("HEARTH_TERRAIN", TERRAIN_SRC, "hearthTerrainScript");
    const hydration = await loadScriptOnce("HEARTH_HYDRATION", HYDRATION_SRC, "hearthHydrationScript");
    return { terrain, hydration };
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

  function fallbackHydrationSample(_lon, _lat, terrainSample) {
    const land = !!terrainSample.land;
    const coast = clamp(terrainSample.coast || 0, 0, 1);
    const shelf = clamp(terrainSample.shelf || 0, 0, 1);
    const bathymetry = clamp(terrainSample.bathymetry || 0, 0, 1);
    const ice = clamp(terrainSample.ice || 0, 0, 1);
    const moisture = clamp(terrainSample.moisture || 0.5, 0, 1);

    return {
      land,
      ocean: land ? 0 : 1,
      shallowWater: land ? 0 : shelf,
      deepWater: land ? 0 : smoothstep(0.30, 0.92, bathymetry),
      abyssWater: land ? 0 : smoothstep(0.62, 1, bathymetry),
      coastalWetness: land ? coast * 0.65 + moisture * 0.2 : coast * 0.35 + shelf * 0.65,
      lake: 0,
      riverCandidate: 0,
      drainageCandidate: 0,
      wetland: 0,
      frozenStorage: land ? ice : 0,
      meltCandidate: 0,
      saturation: land ? coast * 0.2 + moisture * 0.2 : shelf * 0.55 + bathymetry * 0.35,
      surfaceCurrent: 0.4,
      roughWater: 0.25,
      material: land ? "dry-land" : "ocean"
    };
  }

  function colorForSample(t, h, lon, lat) {
    const nx = (lon + 180) / 360;
    const ny = (90 - lat) / 180;
    const texture = fbm(nx * 44 + 11, ny * 34 - 3, 13.9, 4);
    const fine = fbm(nx * 124, ny * 72, 19.4, 3);
    const waterTexture = fbm(nx * 64 + 5, ny * 43 - 8, 712.4, 3);

    if (t.land) {
      const green = clamp((t.moisture - 0.28) * 1.38 * (1 - t.aridity * 0.44), 0, 1);
      const highland = t.highland || smoothstep(0.42, 0.80, t.elevation);
      const mountain = t.mountain || 0;

      const hydroGreen = clamp((h.saturation || 0) * 0.44 + (h.wetland || 0) * 0.34, 0, 1);
      const wetEdge = clamp(
        (h.coastalWetness || 0) * 0.62 +
        (h.riverCandidate || 0) * 0.54 +
        (h.lake || 0) * 0.74 +
        (h.drainageCandidate || 0) * 0.26,
        0,
        1
      );
      const frozen = clamp(h.frozenStorage || t.ice || 0, 0, 1);

      let r = mix(132, 42, green);
      let g = mix(105, 122, green);
      let b = mix(58, 72, green);

      r = mix(r, 40, hydroGreen * 0.22);
      g = mix(g, 138, hydroGreen * 0.25);
      b = mix(b, 96, hydroGreen * 0.22);

      r = mix(r, 176, t.aridity * 0.42);
      g = mix(g, 142, t.aridity * 0.34);
      b = mix(b, 90, t.aridity * 0.26);

      r = mix(r, 118, highland * 0.28);
      g = mix(g, 116, highland * 0.24);
      b = mix(b, 104, highland * 0.22);

      r = mix(r, 94, mountain * 0.46);
      g = mix(g, 94, mountain * 0.42);
      b = mix(b, 94, mountain * 0.40);

      r = mix(r, 30, wetEdge * 0.22);
      g = mix(g, 154, wetEdge * 0.28);
      b = mix(b, 162, wetEdge * 0.30);

      r = mix(r, 236, frozen * 0.72);
      g = mix(g, 242, frozen * 0.72);
      b = mix(b, 236, frozen * 0.72);

      const grain = (texture - 0.5) * 21 + (fine - 0.5) * 9;

      return [
        clamp(r + grain, 0, 255),
        clamp(g + grain * 0.86, 0, 255),
        clamp(b + grain * 0.68, 0, 255)
      ];
    }

    const shallow = clamp(h.shallowWater || t.shelf || 0, 0, 1);
    const deep = clamp(h.deepWater || t.bathymetry || 0, 0, 1);
    const abyss = clamp(h.abyssWater || t.abyss || 0, 0, 1);
    const rough = clamp(h.roughWater || 0, 0, 1);
    const reef = shallow * smoothstep(0.55, 0.90, fbm(nx * 58, ny * 40, 88.1, 3));
    const current = (waterTexture - 0.5) * (10 + rough * 12);

    let r = mix(22, 6, deep);
    let g = mix(118, 54, deep);
    let b = mix(162, 132, deep);

    r = mix(r, 36, shallow * 0.92);
    g = mix(g, 202, shallow * 0.88);
    b = mix(b, 206, shallow * 0.84);

    r = mix(r, 6, abyss * 0.24);
    g = mix(g, 42, abyss * 0.22);
    b = mix(b, 112, abyss * 0.20);

    r = mix(r, 76, reef * 0.28);
    g = mix(g, 214, reef * 0.38);
    b = mix(b, 198, reef * 0.34);

    return [
      clamp(r + current * 0.10, 0, 255),
      clamp(g + current * 0.25, 0, 255),
      clamp(b + current * 0.48, 0, 255)
    ];
  }

  function buildMap(authorities) {
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

    const shallowWater = new Float32Array(len);
    const deepWater = new Float32Array(len);
    const saturation = new Float32Array(len);
    const coastalWetness = new Float32Array(len);
    const lake = new Float32Array(len);
    const river = new Float32Array(len);
    const drainage = new Float32Array(len);
    const frozenStorage = new Float32Array(len);
    const roughWater = new Float32Array(len);

    const terrainSample =
      authorities.terrain && typeof authorities.terrain.sample === "function"
        ? authorities.terrain.sample
        : fallbackTerrainSample;

    const hydrationSample =
      authorities.hydration && typeof authorities.hydration.sample === "function"
        ? authorities.hydration.sample
        : fallbackHydrationSample;

    for (let y = 0; y < MAP_H; y += 1) {
      const lat = 90 - (y / MAP_H) * 180;

      for (let x = 0; x < MAP_W; x += 1) {
        const lon = (x / MAP_W) * 360 - 180;
        const idx = y * MAP_W + x;

        const t = terrainSample(lon, lat);
        const h = hydrationSample(lon, lat, t);
        const c = colorForSample(t, h, lon, lat);

        r[idx] = c[0];
        g[idx] = c[1];
        b[idx] = c[2];

        land[idx] = t.land ? 1 : 0;
        coast[idx] = clamp(t.coast || 0, 0, 1);
        height[idx] = t.elevation || 0;
        relief[idx] = t.relief || 0;
        roughness[idx] = t.roughness || 0;
        bathymetry[idx] = t.bathymetry || 0;
        shelf[idx] = t.shelf || 0;
        ice[idx] = t.ice || 0;

        shallowWater[idx] = clamp(h.shallowWater || 0, 0, 1);
        deepWater[idx] = clamp(h.deepWater || 0, 0, 1);
        saturation[idx] = clamp(h.saturation || 0, 0, 1);
        coastalWetness[idx] = clamp(h.coastalWetness || 0, 0, 1);
        lake[idx] = clamp(h.lake || 0, 0, 1);
        river[idx] = clamp(h.riverCandidate || 0, 0, 1);
        drainage[idx] = clamp(h.drainageCandidate || 0, 0, 1);
        frozenStorage[idx] = clamp(h.frozenStorage || 0, 0, 1);
        roughWater[idx] = clamp(h.roughWater || 0, 0, 1);
      }
    }

    return {
      r, g, b, land, coast, height, relief, roughness, bathymetry, shelf, ice,
      shallowWater, deepWater, saturation, coastalWetness, lake, river, drainage,
      frozenStorage, roughWater
    };
  }

  function bilinear(map, key, u, v) {
    const x = (((u % 1) + 1) % 1) * MAP_W;
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

  function sampleMap(map, lonRadValue, latRadValue) {
    const u = (lonRadValue + Math.PI) / TAU;
    const v = (HALF_PI - latRadValue) / Math.PI;

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
      ice: bilinear(map, "ice", u, v),
      shallowWater: bilinear(map, "shallowWater", u, v),
      deepWater: bilinear(map, "deepWater", u, v),
      saturation: bilinear(map, "saturation", u, v),
      coastalWetness: bilinear(map, "coastalWetness", u, v),
      lake: bilinear(map, "lake", u, v),
      river: bilinear(map, "river", u, v),
      drainage: bilinear(map, "drainage", u, v),
      frozenStorage: bilinear(map, "frozenStorage", u, v),
      roughWater: bilinear(map, "roughWater", u, v)
    };
  }

  function reliefShade(map, lonRadValue, latRadValue, s, isLand) {
    const e = 0.0028;
    const hE = sampleMap(map, lonRadValue + e, latRadValue).height;
    const hW = sampleMap(map, lonRadValue - e, latRadValue).height;
    const hN = sampleMap(map, lonRadValue, latRadValue + e).height;
    const hS = sampleMap(map, lonRadValue, latRadValue - e).height;

    const dx = hW - hE;
    const dy = hS - hN;

    const base = isLand
      ? 1 + dx * 0.72 + dy * 0.52 + s.relief * 0.055
      : 1 + dx * 0.055 + dy * 0.045 - s.bathymetry * 0.006 + s.shallowWater * 0.018;

    return clamp(base, isLand ? 0.88 : 0.985, isLand ? 1.09 : 1.018);
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
    const prior = document.getElementById("hearth-g3-10-chain-aligned-canvas-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-10-chain-aligned-canvas-style";
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

      .hearth-g3-10-chip {
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
        .hearth-g3-10-chip { display: none; }
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

  function paintBackplate(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.50, h * 0.45, w * 0.05, w * 0.50, h * 0.50, w * 0.70);
    bg.addColorStop(0, "rgba(42, 85, 116, 0.22)");
    bg.addColorStop(0.52, "rgba(12, 30, 52, 0.62)");
    bg.addColorStop(1, "rgba(2, 7, 15, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.50;
    const cy = h * 0.50;

    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, w * (0.398 + i * 0.032), 0, TAU);
      ctx.strokeStyle = `rgba(102, 174, 225, ${0.050 - i * 0.012})`;
      ctx.lineWidth = Math.max(1, w * (0.0048 - i * 0.0007));
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
        const isLand = s.land > 0.5;

        let rr = s.r;
        let gg = s.g;
        let bb = s.b;

        const limb = Math.pow(1 - z, 1.8);
        const proofLight = 0.995 + Math.pow(z, 1.05) * 0.025;
        const reliefFactor = reliefShade(map, lon, lat, s, isLand);

        if (!isLand) {
          if (s.shallowWater > 0.06) {
            rr = mix(rr, 48, s.shallowWater * 0.10);
            gg = mix(gg, 206, s.shallowWater * 0.14);
            bb = mix(bb, 210, s.shallowWater * 0.12);
          }

          if (s.coast > 0.04) {
            const edge = Math.pow(s.coast, 1.05);
            rr = mix(rr, 64, edge * 0.06);
            gg = mix(gg, 202, edge * 0.10);
            bb = mix(bb, 210, edge * 0.09);
          }
        }

        if (isLand) {
          if (s.coastalWetness > 0.04) {
            rr = mix(rr, 42, s.coastalWetness * 0.08);
            gg = mix(gg, 150, s.coastalWetness * 0.11);
            bb = mix(bb, 142, s.coastalWetness * 0.10);
          }

          if (s.river > 0.04 || s.lake > 0.04 || s.drainage > 0.04) {
            const liquid = clamp(s.river * 0.58 + s.lake * 0.80 + s.drainage * 0.36, 0, 1);
            rr = mix(rr, 30, liquid * 0.18);
            gg = mix(gg, 144, liquid * 0.22);
            bb = mix(bb, 164, liquid * 0.24);
          }

          if (s.frozenStorage > 0.18) {
            const iceGlow = smoothstep(0.18, 0.9, s.frozenStorage) * 0.16;
            rr = mix(rr, 242, iceGlow * 0.16);
            gg = mix(gg, 248, iceGlow * 0.16);
            bb = mix(bb, 242, iceGlow * 0.14);
          }
        }

        rr *= proofLight * reliefFactor;
        gg *= proofLight * reliefFactor;
        bb *= proofLight * reliefFactor;

        rr = mix(rr, 72, limb * 0.035);
        gg = mix(gg, 150, limb * 0.040);
        bb = mix(bb, 196, limb * 0.050);

        const rim = Math.pow(limb, 2.1);
        rr = mix(rr, 70, rim * 0.08);
        gg = mix(gg, 184, rim * 0.12);
        bb = mix(bb, 232, rim * 0.14);

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
    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.003, 0, TAU);
    wctx.strokeStyle = "rgba(116, 207, 255, 0.28)";
    wctx.lineWidth = Math.max(1, size * 0.0048);
    wctx.stroke();

    wctx.beginPath();
    wctx.arc(cx, cy, radius * 1.037, 0, TAU);
    wctx.strokeStyle = "rgba(91, 174, 236, 0.08)";
    wctx.lineWidth = Math.max(1, size * 0.0075);
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

    paintBackplate(ctx, w, h);
    paintSphere(time);

    const drawSize = Math.min(w, h);
    const dx = (w - drawSize) * 0.5;
    const dy = (h - drawSize) * 0.5;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(runtime.work, dx, dy, drawSize, drawSize);
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

    const hydrationReceipt =
      window.HEARTH_HYDRATION && typeof window.HEARTH_HYDRATION.receipt === "function"
        ? window.HEARTH_HYDRATION.receipt()
        : null;

    window.HEARTH_CANVAS_RECEIPT = Object.freeze({
      receipt: RECEIPT,
      contract: CONTRACT,
      version: VERSION,
      route: location.pathname,
      renderOwner: "/assets/hearth/hearth.canvas.js",
      terrainOwner: "/assets/hearth/hearth.terrain.js",
      hydrationOwner: "/assets/hearth/hearth.hydration.js",
      terrainSrc: TERRAIN_SRC,
      hydrationSrc: HYDRATION_SRC,
      terrainContract: window.HEARTH_TERRAIN?.contract || "fallback",
      hydrationContract: window.HEARTH_HYDRATION?.contract || "fallback",
      terrainReceipt,
      hydrationReceipt,
      mount: "#hearthCanvasMount",
      generation: "G3.10-chain",
      ticTacToe: TIC_TAC_TOE,
      quadA: QUAD_A,
      canvasOwns: [
        "projection",
        "rotation",
        "true-sphere-composition",
        "wrapped-sampling",
        "proof-render"
      ],
      terrainOwns: [
        "map",
        "body-mass",
        "elevation",
        "mountain-ranges",
        "relief",
        "bathymetry"
      ],
      hydrationOwns: [
        "solid-global-hydration-field",
        "ocean-material",
        "shelves",
        "basins",
        "river-candidates",
        "drainage",
        "frozen-water-storage",
        "saturation"
      ],
      retired: [
        "hearth-g2-model-restore-v1",
        "HEARTH_G2_MODEL_RESTORE_HTML_JS_ASSET_TNT_v1",
        "hearth-g3-7-hydration-engine"
      ],
      renderPolicy: "sampled-map plus current hydration color plus relief shade plus rim only",
      g4Deferred: "clouds-weather-climate",
      noClouds: true,
      noWeather: true,
      noClimate: true,
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

    const authorities = await loadAuthorities();
    if (runtime.disposed) return;

    const mountEl = getMount();
    mountEl.replaceChildren();

    const canvas = document.createElement("canvas");
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.contract = CONTRACT;
    canvas.dataset.generation = "G3.10-chain";
    canvas.dataset.localScale = "hearth";
    canvas.dataset.terrainOwner = "/assets/hearth/hearth.terrain.js";
    canvas.dataset.hydrationOwner = "/assets/hearth/hearth.hydration.js";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G3.10 chain-aligned globe");

    const chip = document.createElement("div");
    chip.className = "hearth-g3-10-chip";
    chip.textContent =
      authorities.terrain && authorities.hydration
        ? "Hearth G3.10 · Chain Aligned"
        : "Hearth G3.10 · Authority Fallback";

    mountEl.append(canvas, chip);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.work = document.createElement("canvas");
    runtime.workCtx = runtime.work.getContext("2d", { alpha: true, willReadFrequently: false });
    runtime.map = buildMap(authorities);

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthRenderOwner = "/assets/hearth/hearth.canvas.js";
    mountEl.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    mountEl.dataset.hearthHydrationOwner = "/assets/hearth/hearth.hydration.js";
    mountEl.dataset.hearthTerrainLoaded = authorities.terrain ? "true" : "false";
    mountEl.dataset.hearthHydrationLoaded = authorities.hydration ? "true" : "false";
    mountEl.dataset.hearthGeneration = "G3.10-chain";
    mountEl.dataset.hearthGenerationFocus = "chain-aligned-canvas-bind";
    mountEl.dataset.hearthG2Retired = "true";
    mountEl.dataset.hearthG37HydrationRetired = "true";
    mountEl.dataset.g4Deferred = "clouds-weather-climate";
    mountEl.dataset.earthPlaceholder = "false";
    mountEl.dataset.audraliaMap = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthTerrainOwner = "/assets/hearth/hearth.terrain.js";
    document.documentElement.dataset.hearthHydrationOwner = "/assets/hearth/hearth.hydration.js";
    document.documentElement.dataset.hearthTerrainLoaded = authorities.terrain ? "true" : "false";
    document.documentElement.dataset.hearthHydrationLoaded = authorities.hydration ? "true" : "false";
    document.documentElement.dataset.hearthGeneration = "G3.10-chain";
    document.documentElement.dataset.hearthGenerationFocus = "chain-aligned-canvas-bind";
    document.documentElement.dataset.hearthG2Retired = "true";
    document.documentElement.dataset.hearthG37HydrationRetired = "true";
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

    const style = document.getElementById("hearth-g3-10-chain-aligned-canvas-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_10_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G3_10_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_9_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_8_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_7_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_6_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_5_DISPOSE__ = dispose;
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
