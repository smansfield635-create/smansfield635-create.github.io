// /assets/hearth/hearth.canvas.js
// HEARTH_G3_CANVAS_EXECUTION_RESTORE_TNT_v1
// Full-file replacement.
// Purpose:
// - Restore executable Hearth canvas body after asset truncation.
// - Mount into #hearthCanvasMount.
// - Load accepted terrain authority and current hydration authority.
// - Render one continuous G3 Hearth globe.
// - No half-globe mask, no terminator, no panel overlay, no generated image, no GraphicBox.
// - G3 only: terrain, bathymetry, hydration, shelves, wetness, frozen storage.
// - G4 deferred: clouds, weather, climate.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_CANVAS_EXECUTION_RESTORE_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-canvas-execution-restore";
  const RECEIPT = "HEARTH_G3_CANVAS_EXECUTION_RESTORE_RECEIPT";

  const TERRAIN_SRC = "/assets/hearth/hearth.terrain.js?v=hearth-g3-4-accepted-terrain-authority";
  const HYDRATION_SRC = "/assets/hearth/hearth.hydration.js?v=hearth-g3-10-solid-global-hydration-field";

  const MAP_W = 720;
  const MAP_H = 360;
  const MIN_SIZE = 300;
  const MAX_SIZE = 720;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  [
    "__HEARTH_CANVAS_G3_DISPOSE__",
    "__HEARTH_CANVAS_G3_10_DISPOSE__",
    "__HEARTH_CANVAS_DISPOSE__",
    "__HEARTH_G2_DISPOSE__"
  ].forEach((name) => {
    if (typeof window[name] === "function") {
      try { window[name](); } catch (_) {}
    }
    try { window[name] = null; } catch (_) {}
  });

  const runtime = {
    disposed: false,
    mounted: false,
    raf: 0,
    mount: null,
    canvas: null,
    ctx: null,
    work: null,
    workCtx: null,
    image: null,
    size: 0,
    map: null,
    observer: null,
    lastFrame: 0
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

  function noise(x, y, seed = 0) {
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
      sum += noise(x * freq, y * freq, seed + i * 19.19) * amp;
      norm += amp;
      amp *= 0.52;
      freq *= 2.03;
    }

    return norm ? sum / norm : 0.5;
  }

  function loadScriptOnce(globalName, src, marker) {
    return new Promise((resolve) => {
      if (window[globalName]) {
        resolve(window[globalName]);
        return;
      }

      const base = src.split("?")[0];
      const existing = document.querySelector(`script[src*="${base}"]`);

      if (existing) {
        existing.addEventListener("load", () => resolve(window[globalName] || null), { once: true });
        existing.addEventListener("error", () => resolve(null), { once: true });
        setTimeout(() => resolve(window[globalName] || null), 300);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.dataset[marker] = "true";
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

  function fallbackTerrain(lon, lat) {
    const u = (lon + 180) / 360;
    const v = (90 - lat) / 180;

    const continent =
      Math.sin(u * TAU * 2.2 + 0.8) * 0.22 +
      Math.cos(v * TAU * 1.7 - 0.4) * 0.18 +
      Math.sin((u + v) * TAU * 1.35) * 0.18 +
      fbm(u * 7.5, v * 4.5, 3.7, 5) * 0.64 -
      0.48;

    const land = continent > 0;
    const coast = 1 - smoothstep(0.012, 0.105, Math.abs(continent));
    const elevation = land ? clamp(continent * 2.2, 0, 1) : -clamp(-continent * 2.4, 0, 1);
    const ridgeField = fbm(u * 26.0 + 3, v * 18.0 - 2, 41.2, 4);
    const mountain = land ? smoothstep(0.68, 0.92, ridgeField) * smoothstep(0.22, 0.86, elevation) : 0;
    const moisture = clamp(0.58 + Math.cos(lat * Math.PI / 90) * 0.18 + fbm(u * 8, v * 7, 12.2, 3) * 0.25 - 0.12, 0, 1);
    const aridity = land ? clamp(fbm(u * 5 + 12, v * 5 - 9, 77.8, 4) * 0.65 - moisture * 0.28, 0, 1) : 0;

    return {
      land,
      elevation,
      relief: land ? clamp(elevation * 0.55 + mountain * 0.40, 0, 1) : 0,
      ridge: mountain,
      mountain,
      shelf: land ? 0 : clamp(coast * 0.94, 0, 1),
      slope: land ? 0 : smoothstep(0.12, 0.58, -continent),
      abyss: land ? 0 : smoothstep(0.48, 0.95, -continent),
      bathymetry: land ? 0 : clamp(-continent * 2.1, 0, 1),
      coast: clamp(coast, 0, 1),
      ice: Math.abs(lat) > 66 || (land && mountain > 0.62) ? 0.68 : 0,
      moisture,
      aridity,
      roughness: clamp(fbm(u * 34, v * 20, 91.6, 4), 0, 1),
      biome: land ? "terrain" : "ocean"
    };
  }

  function fallbackHydration(_lon, _lat, terrain) {
    const land = !!terrain.land;
    const coast = clamp(terrain.coast || 0, 0, 1);
    const shelf = clamp(terrain.shelf || 0, 0, 1);
    const bathymetry = clamp(terrain.bathymetry || 0, 0, 1);
    const moisture = clamp(terrain.moisture || 0.5, 0, 1);
    const ice = clamp(terrain.ice || 0, 0, 1);
    const elevation = clamp(terrain.elevation || 0, 0, 1);

    const lake = land ? smoothstep(0.30, 0.72, moisture) * smoothstep(0.08, 0.40, 1 - Math.abs(elevation - 0.18)) * 0.32 : 0;
    const river = land ? clamp(coast * 0.16 + moisture * 0.22 + lake * 0.28, 0, 1) : 0;
    const frozenStorage = land ? clamp(ice * 0.72 + terrain.mountain * 0.22, 0, 1) : 0;

    return {
      land,
      ocean: land ? 0 : 1,
      shallowWater: land ? 0 : shelf,
      deepWater: land ? 0 : smoothstep(0.26, 0.88, bathymetry),
      abyssWater: land ? 0 : smoothstep(0.62, 1, bathymetry),
      coastalWetness: land ? clamp(coast * 0.60 + moisture * 0.22, 0, 1) : clamp(coast * 0.25 + shelf * 0.68, 0, 1),
      lake,
      riverCandidate: river,
      drainageCandidate: river * 0.75,
      wetland: land ? clamp(coast * 0.32 + lake * 0.44 + moisture * 0.18, 0, 1) : 0,
      frozenStorage,
      meltCandidate: frozenStorage * 0.18,
      saturation: land ? clamp(coast * 0.25 + lake * 0.38 + river * 0.26 + moisture * 0.12, 0, 1) : clamp(shelf * 0.58 + bathymetry * 0.32, 0, 1),
      surfaceCurrent: 0.44,
      roughWater: land ? river * 0.22 : clamp(0.22 + bathymetry * 0.18, 0, 1),
      material: land ? "terrain" : "ocean"
    };
  }

  function terrainSample(authorities, lon, lat) {
    if (authorities.terrain && typeof authorities.terrain.sample === "function") {
      try {
        return authorities.terrain.sample(lon, lat);
      } catch (_) {}
    }
    return fallbackTerrain(lon, lat);
  }

  function hydrationSample(authorities, lon, lat, terrain) {
    if (authorities.hydration && typeof authorities.hydration.sample === "function") {
      try {
        return authorities.hydration.sample(lon, lat, terrain);
      } catch (_) {}
    }
    return fallbackHydration(lon, lat, terrain);
  }

  function colorFor(t, h, lon, lat) {
    const u = (lon + 180) / 360;
    const v = (90 - lat) / 180;
    const grain = fbm(u * 48 + 3, v * 34 - 2, 23.5, 4) - 0.5;
    const fine = fbm(u * 122, v * 90, 62.7, 3) - 0.5;

    if (t.land) {
      const green = clamp((t.moisture - 0.25) * 1.25 - t.aridity * 0.28, 0, 1);
      const wet = clamp((h.saturation || 0) * 0.34 + (h.coastalWetness || 0) * 0.22 + (h.lake || 0) * 0.42, 0, 1);
      const high = clamp(t.elevation || 0, 0, 1);
      const mountain = clamp(t.mountain || 0, 0, 1);
      const frozen = clamp(h.frozenStorage || t.ice || 0, 0, 1);

      let r = mix(154, 60, green);
      let g = mix(122, 132, green);
      let b = mix(72, 84, green);

      r = mix(r, 184, t.aridity * 0.42);
      g = mix(g, 150, t.aridity * 0.34);
      b = mix(b, 92, t.aridity * 0.28);

      r = mix(r, 106, high * 0.22);
      g = mix(g, 104, high * 0.18);
      b = mix(b, 96, high * 0.16);

      r = mix(r, 86, mountain * 0.36);
      g = mix(g, 86, mountain * 0.34);
      b = mix(b, 86, mountain * 0.32);

      r = mix(r, 36, wet * 0.20);
      g = mix(g, 146, wet * 0.24);
      b = mix(b, 148, wet * 0.24);

      r = mix(r, 236, frozen * 0.70);
      g = mix(g, 242, frozen * 0.70);
      b = mix(b, 238, frozen * 0.70);

      const g1 = grain * 20 + fine * 8;

      return [
        clamp(r + g1, 0, 255),
        clamp(g + g1 * 0.85, 0, 255),
        clamp(b + g1 * 0.65, 0, 255)
      ];
    }

    const shallow = clamp(h.shallowWater || t.shelf || 0, 0, 1);
    const deep = clamp(h.deepWater || t.bathymetry || 0, 0, 1);
    const abyss = clamp(h.abyssWater || t.abyss || 0, 0, 1);
    const reef = shallow * smoothstep(0.56, 0.92, fbm(u * 56, v * 42, 88.1, 3));

    let r = mix(24, 4, deep);
    let g = mix(116, 52, deep);
    let b = mix(164, 126, deep);

    r = mix(r, 38, shallow * 0.92);
    g = mix(g, 204, shallow * 0.88);
    b = mix(b, 206, shallow * 0.84);

    r = mix(r, 5, abyss * 0.22);
    g = mix(g, 38, abyss * 0.20);
    b = mix(b, 100, abyss * 0.18);

    r = mix(r, 76, reef * 0.24);
    g = mix(g, 214, reef * 0.34);
    b = mix(b, 196, reef * 0.30);

    const flow = (fbm(u * 70 + 11, v * 44 - 7, 91.2, 3) - 0.5) * 12;

    return [
      clamp(r + flow * 0.08, 0, 255),
      clamp(g + flow * 0.18, 0, 255),
      clamp(b + flow * 0.32, 0, 255)
    ];
  }

  function buildMap(authorities) {
    const len = MAP_W * MAP_H;
    const keys = [
      "r", "g", "b", "land", "height", "relief", "roughness", "bathymetry",
      "coast", "shallowWater", "deepWater", "saturation", "coastalWetness",
      "lake", "river", "drainage", "frozenStorage"
    ];

    const map = {};
    keys.forEach((k) => { map[k] = new Float32Array(len); });

    for (let y = 0; y < MAP_H; y += 1) {
      const lat = 90 - (y / MAP_H) * 180;

      for (let x = 0; x < MAP_W; x += 1) {
        const lon = (x / MAP_W) * 360 - 180;
        const idx = y * MAP_W + x;

        const t = terrainSample(authorities, lon, lat);
        const h = hydrationSample(authorities, lon, lat, t);
        const c = colorFor(t, h, lon, lat);

        map.r[idx] = c[0];
        map.g[idx] = c[1];
        map.b[idx] = c[2];
        map.land[idx] = t.land ? 1 : 0;
        map.height[idx] = t.elevation || 0;
        map.relief[idx] = t.relief || 0;
        map.roughness[idx] = t.roughness || 0;
        map.bathymetry[idx] = t.bathymetry || 0;
        map.coast[idx] = t.coast || 0;
        map.shallowWater[idx] = h.shallowWater || 0;
        map.deepWater[idx] = h.deepWater || 0;
        map.saturation[idx] = h.saturation || 0;
        map.coastalWetness[idx] = h.coastalWetness || 0;
        map.lake[idx] = h.lake || 0;
        map.river[idx] = h.riverCandidate || 0;
        map.drainage[idx] = h.drainageCandidate || 0;
        map.frozenStorage[idx] = h.frozenStorage || 0;
      }
    }

    return map;
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

  function sampleMap(map, lonRad, latRad) {
    const u = (lonRad + Math.PI) / TAU;
    const v = (HALF_PI - latRad) / Math.PI;

    return {
      r: bilinear(map, "r", u, v),
      g: bilinear(map, "g", u, v),
      b: bilinear(map, "b", u, v),
      land: bilinear(map, "land", u, v),
      height: bilinear(map, "height", u, v),
      relief: bilinear(map, "relief", u, v),
      roughness: bilinear(map, "roughness", u, v),
      bathymetry: bilinear(map, "bathymetry", u, v),
      coast: bilinear(map, "coast", u, v),
      shallowWater: bilinear(map, "shallowWater", u, v),
      deepWater: bilinear(map, "deepWater", u, v),
      saturation: bilinear(map, "saturation", u, v),
      coastalWetness: bilinear(map, "coastalWetness", u, v),
      lake: bilinear(map, "lake", u, v),
      river: bilinear(map, "river", u, v),
      drainage: bilinear(map, "drainage", u, v),
      frozenStorage: bilinear(map, "frozenStorage", u, v)
    };
  }

  function reliefShade(map, lon, lat, s) {
    const e = 0.003;
    const hE = sampleMap(map, lon + e, lat).height;
    const hW = sampleMap(map, lon - e, lat).height;
    const hN = sampleMap(map, lon, lat + e).height;
    const hS = sampleMap(map, lon, lat - e).height;
    const dx = hW - hE;
    const dy = hS - hN;

    if (s.land > 0.5) {
      return clamp(1 + dx * 0.70 + dy * 0.52 + s.relief * 0.055, 0.88, 1.10);
    }

    return clamp(1 + dx * 0.05 + dy * 0.04 - s.bathymetry * 0.006 + s.shallowWater * 0.018, 0.985, 1.018);
  }

  function installStyle() {
    const old = document.getElementById("hearth-g3-canvas-execution-restore-style");
    if (old) old.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-canvas-execution-restore-style";
    style.textContent = `
      html, body {
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
  }

  function getMount() {
    const mount =
      document.getElementById("hearthCanvasMount") ||
      document.querySelector("[data-hearth-mount]") ||
      document.querySelector("[data-render='hearth']");

    if (mount) return mount;

    const fallback = document.createElement("section");
    fallback.id = "hearthCanvasMount";
    fallback.dataset.hearthMount = "true";
    fallback.style.position = "relative";
    fallback.style.width = "100%";
    fallback.style.aspectRatio = "1 / 1";
    fallback.style.minHeight = "300px";

    const parent = document.getElementById("hearth-main") || document.querySelector("main") || document.body;
    parent.appendChild(fallback);
    return fallback;
  }

  function resize() {
    if (!runtime.mount || !runtime.canvas) return;

    const rect = runtime.mount.getBoundingClientRect();
    const cssSize = Math.max(
      MIN_SIZE,
      Math.floor(Math.min(rect.width || MIN_SIZE, rect.height || rect.width || MIN_SIZE))
    );

    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const px = Math.max(MIN_SIZE, Math.floor(cssSize * dpr));
    const workSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, px));

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

    const bg = ctx.createRadialGradient(w * 0.50, h * 0.48, w * 0.04, w * 0.50, h * 0.50, w * 0.70);
    bg.addColorStop(0, "rgba(42, 85, 116, 0.22)");
    bg.addColorStop(0.52, "rgba(12, 30, 52, 0.62)");
    bg.addColorStop(1, "rgba(2, 7, 15, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;

    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, w * (0.398 + i * 0.032), 0, TAU);
      ctx.strokeStyle = `rgba(102,174,225,${0.052 - i * 0.012})`;
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

        let rr = s.r;
        let gg = s.g;
        let bb = s.b;

        const isLand = s.land > 0.5;
        const limb = Math.pow(1 - z, 1.8);
        const proofLight = 0.995 + Math.pow(z, 1.05) * 0.025;
        const rel = reliefShade(map, lon, lat, s);

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
        } else {
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

        rr *= proofLight * rel;
        gg *= proofLight * rel;
        bb *= proofLight * rel;

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

    runtime.workCtx.save();
    runtime.workCtx.beginPath();
    runtime.workCtx.arc(cx, cy, radius * 1.003, 0, TAU);
    runtime.workCtx.strokeStyle = "rgba(116,207,255,0.28)";
    runtime.workCtx.lineWidth = Math.max(1, size * 0.0048);
    runtime.workCtx.stroke();

    runtime.workCtx.beginPath();
    runtime.workCtx.arc(cx, cy, radius * 1.037, 0, TAU);
    runtime.workCtx.strokeStyle = "rgba(91,174,236,0.08)";
    runtime.workCtx.lineWidth = Math.max(1, size * 0.0075);
    runtime.workCtx.stroke();
    runtime.workCtx.restore();
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
      generation: "G3",
      executionRestored: true,
      renderPolicy: "single continuous sphere; no hemisphere mask; no terminator; no panel overlay",
      g4Deferred: "clouds-weather-climate",
      noClouds: true,
      noWeather: true,
      noClimate: true,
      externalImages: false,
      nasaAsset: false,
      generatedImage: false,
      graphicBox: false,
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
    canvas.dataset.generation = "G3";
    canvas.dataset.localScale = "hearth";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth Generation 3 executable canvas globe");

    const chip = document.createElement("div");
    chip.className = "hearth-g3-chip";
    chip.textContent =
      authorities.terrain && authorities.hydration
        ? "Hearth G3 · Executable"
        : "Hearth G3 · Fallback";

    mountEl.append(canvas, chip);

    runtime.mount = mountEl;
    runtime.canvas = canvas;
    runtime.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    runtime.work = document.createElement("canvas");
    runtime.workCtx = runtime.work.getContext("2d", { alpha: true, willReadFrequently: false });
    runtime.map = buildMap(authorities);

    mountEl.dataset.hearthCanvasContract = CONTRACT;
    mountEl.dataset.hearthCanvasReceipt = RECEIPT;
    mountEl.dataset.hearthGeneration = "G3";
    mountEl.dataset.hearthExecutionRestored = "true";
    mountEl.dataset.hearthTerrainLoaded = authorities.terrain ? "true" : "false";
    mountEl.dataset.hearthHydrationLoaded = authorities.hydration ? "true" : "false";
    mountEl.dataset.hearthGeneratedImage = "false";
    mountEl.dataset.hearthGraphicBox = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G3";
    document.documentElement.dataset.hearthExecutionRestored = "true";
    document.documentElement.dataset.hearthTerrainLoaded = authorities.terrain ? "true" : "false";
    document.documentElement.dataset.hearthHydrationLoaded = authorities.hydration ? "true" : "false";
    document.documentElement.dataset.hearthGeneratedImage = "false";
    document.documentElement.dataset.hearthGraphicBox = "false";

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

    const style = document.getElementById("hearth-g3-canvas-execution-restore-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

  window.__HEARTH_CANVAS_G3_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_G3_10_DISPOSE__ = dispose;
  window.__HEARTH_CANVAS_DISPOSE__ = dispose;

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
