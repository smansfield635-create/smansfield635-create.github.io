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
    fallback.dataset.he
