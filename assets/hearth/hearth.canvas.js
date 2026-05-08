// /assets/hearth/hearth.canvas.js
// HEARTH_G3_1_CARTOGRAPHIC_BODY_MASS_TNT_v1
// Full-file replacement.
// Purpose:
// - Correct the failed G3 candidate.
// - Move Hearth from blob-first mass logic to cartographic-scaffold-first body mass.
// - G3 scope only: terrain, map, body mass, coastlines, elevation, bathymetry, polar terrain.
// - G4 deferred: clouds, weather, climate.
// - No JPG. No NASA asset. No generated image. No GraphicBox.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_G3_1_CARTOGRAPHIC_BODY_MASS_TNT_v1";
  const VERSION = "2026-05-08.hearth-g3-1-cartographic-body-mass";
  const RECEIPT = "HEARTH_G3_1_CARTOGRAPHIC_BODY_MASS_RECEIPT";

  const MAP_W = 840;
  const MAP_H = 420;
  const MIN_RENDER_SIZE = 300;
  const MAX_RENDER_SIZE = 720;
  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI / 2;

  const GENERATION = Object.freeze({
    previousAccepted: "G2",
    currentCandidate: "G3.1",
    g3Definition: "cartographic body mass, terrain map, coastline, elevation, bathymetry, polar terrain",
    g4Deferred: "clouds, weather, climate"
  });

  const TIC_TAC_TOE = Object.freeze({
    T1: "isolate Hearth only",
    T2: "freeze G3 definition",
    T3: "reject blob-first landmass",
    T4: "install cartographic scaffold",
    T5: "roughen coastlines only after scaffold",
    T6: "add elevation and bathymetry",
    T7: "stress against Earth/NASA bleed",
    T8: "keep G4 deferred",
    T9: "return visual proof"
  });

  const QUAD_A = Object.freeze({
    authority: "/assets/hearth/hearth.canvas.js only",
    axis: "Hearth local scale only",
    artifact: "visible G3.1 terrain/body-mass correction",
    attack: "reject clouds, weather, climate, NASA JPG, Earth placeholder, Audralia bleed, duplicate lower frame"
  });

  [
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
    const t = clamp((x - a) / (b - a), 0, 1);
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

  function fbm(x, y, seed = 0, octaves = 5) {
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

  function wrapLon(lon) {
    let v = lon;
    while (v < -180) v += 360;
    while (v > 180) v -= 360;
    return v;
  }

  function lonDelta(a, b) {
    return wrapLon(a - b);
  }

  function pointInPolygon(lon, lat, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];

      const intersects =
        yi > lat !== yj > lat &&
        lon < ((xj - xi) * (lat - yi)) / ((yj - yi) || 1e-9) + xi;

      if (intersects) inside = !inside;
    }

    return inside;
  }

  function distanceToSegment(lon, lat, ax, ay, bx, by) {
    const vx = lonDelta(bx, ax);
    const vy = by - ay;
    const wx = lonDelta(lon, ax);
    const wy = lat - ay;

    const c1 = wx * vx + wy * vy;
    const c2 = vx * vx + vy * vy || 1;
    const t = clamp(c1 / c2, 0, 1);

    const sx = ax + vx * t;
    const sy = ay + vy * t;

    return Math.hypot(lonDelta(lon, sx), lat - sy);
  }

  function signedDistanceToPolygon(lon, lat, polygon) {
    let minD = Infinity;

    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const d = distanceToSegment(lon, lat, a[0], a[1], b[0], b[1]);
      if (d < minD) minD = d;
    }

    return pointInPolygon(lon, lat, polygon) ? minD : -minD;
  }

  function ellipseMask(lon, lat, cx, cy, rx, ry) {
    const dx = lonDelta(lon, cx) / rx;
    const dy = (lat - cy) / ry;
    return 1 - (dx * dx + dy * dy);
  }

  function ridge(lon, lat, x1, y1, x2, y2, width, amp) {
    const vx = lonDelta(x2, x1);
    const vy = y2 - y1;
    const wx = lonDelta(lon, x1);
    const wy = lat - y1;
    const c1 = wx * vx + wy * vy;
    const c2 = vx * vx + vy * vy || 1;
    const t = clamp(c1 / c2, 0, 1);
    const sx = x1 + vx * t;
    const sy = y1 + vy * t;
    const d = Math.hypot(lonDelta(lon, sx), lat - sy);
    return amp * (1 - smoothstep(width * 0.30, width, d));
  }

  const CONTINENTS = [
    {
      name: "north-land",
      weight: 1.0,
      points: [
        [-166, 66], [-150, 58], [-140, 52], [-130, 49], [-124, 42],
        [-118, 34], [-112, 28], [-104, 23], [-95, 18], [-86, 20],
        [-80, 26], [-74, 36], [-66, 44], [-55, 51], [-53, 58],
        [-66, 66], [-92, 72], [-122, 72], [-146, 70]
      ]
    },
    {
      name: "central-bridge",
      weight: 0.74,
      points: [
        [-100, 24], [-86, 23], [-78, 18], [-76, 10], [-82, 8],
        [-90, 12], [-98, 16], [-105, 20]
      ]
    },
    {
      name: "south-spine",
      weight: 1.0,
      points: [
        [-81, 12], [-69, 10], [-56, 2], [-45, -10], [-39, -22],
        [-46, -37], [-55, -52], [-67, -55], [-73, -40], [-77, -23],
        [-83, -8]
      ]
    },
    {
      name: "greenland-ice",
      weight: 0.76,
      points: [
        [-52, 60], [-38, 64], [-30, 72], [-40, 82], [-58, 82],
        [-68, 75], [-62, 66]
      ]
    },
    {
      name: "africa-body",
      weight: 1.0,
      points: [
        [-18, 33], [2, 37], [18, 34], [32, 27], [43, 12],
        [41, -12], [31, -30], [20, -36], [7, -32], [-6, -18],
        [-14, 0], [-18, 16]
      ]
    },
    {
      name: "eurasia-shelf",
      weight: 1.08,
      points: [
        [-10, 36], [6, 45], [24, 51], [48, 57], [76, 67],
        [104, 66], [134, 56], [153, 48], [145, 35], [126, 26],
        [112, 12], [96, 8], [80, 18], [62, 24], [45, 30],
        [28, 35], [12, 40], [0, 38]
      ]
    },
    {
      name: "india-peninsula",
      weight: 0.70,
      points: [
        [68, 24], [82, 26], [91, 20], [88, 10], [80, 6],
        [73, 12]
      ]
    },
    {
      name: "arabia-horn",
      weight: 0.52,
      points: [
        [38, 31], [51, 26], [56, 16], [49, 11], [42, 14],
        [36, 22]
      ]
    },
    {
      name: "southeast-chain",
      weight: 0.46,
      points: [
        [96, 22], [111, 17], [123, 5], [121, -7], [107, -6],
        [98, 5]
      ]
    },
    {
      name: "austral-body",
      weight: 0.84,
      points: [
        [112, -12], [129, -10], [149, -18], [153, -33],
        [140, -43], [120, -36], [113, -24]
      ]
    },
    {
      name: "antarctic-ring",
      weight: 1.02,
      points: [
        [-180, -72], [-140, -66], [-100, -69], [-60, -64], [-20, -70],
        [20, -66], [60, -70], [100, -65], [140, -69], [180, -72],
        [180, -90], [-180, -90]
      ]
    },
    {
      name: "southern-isle",
      weight: 0.32,
      points: [
        [42, -46], [56, -48], [58, -55], [45, -56], [35, -51]
      ]
    },
    {
      name: "new-zealands",
      weight: 0.26,
      points: [
        [166, -35], [178, -42], [172, -48], [162, -42]
      ]
    }
  ];

  const LAKES_AND_INLAND_SEAS = [
    { lon: -84, lat: 45, rx: 7, ry: 3.5, amp: 0.60 },
    { lon: -74, lat: 44, rx: 5, ry: 2.4, amp: 0.50 },
    { lon: 31, lat: 0, rx: 4, ry: 7, amp: 0.34 },
    { lon: 35, lat: -7, rx: 3, ry: 5, amp: 0.28 },
    { lon: 48, lat: 42, rx: 7, ry: 4, amp: 0.42 },
    { lon: 90, lat: 55, rx: 10, ry: 4, amp: 0.22 }
  ];

  function cartographicSignedDistance(lon, lat) {
    let best = -Infinity;

    for (const continent of CONTINENTS) {
      const sd = signedDistanceToPolygon(lon, lat, continent.points) * continent.weight;
      if (sd > best) best = sd;
    }

    return best;
  }

  function lakeCut(lon, lat) {
    let cut = 0;

    for (const lake of LAKES_AND_INLAND_SEAS) {
      const q = ellipseMask(lon, lat, lake.lon, lake.lat, lake.rx, lake.ry);
      cut += lake.amp * smoothstep(-0.25, 0.88, q);
    }

    return cut;
  }

  function elevationField(lon, lat) {
    let e = 0;

    e += ridge(lon, lat, -75, 10, -70, -54, 7, 0.46);
    e += ridge(lon, lat, -130, 55, -106, 28, 10, 0.30);
    e += ridge(lon, lat, -110, 42, -103, 30, 7, 0.20);
    e += ridge(lon, lat, 66, 30, 94, 34, 9, 0.56);
    e += ridge(lon, lat, 85, 42, 118, 55, 14, 0.25);
    e += ridge(lon, lat, 38, -5, 30, -30, 7, 0.22);
    e += ridge(lon, lat, 7, 45, 20, 46, 5.5, 0.18);
    e += ridge(lon, lat, 134, -20, 150, -36, 8, 0.18);

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

        const rawSd = cartographicSignedDistance(lon, lat);
        const coastalInfluence = 1 - smoothstep(0, 8, Math.abs(rawSd));
        const coastlineFracture =
          (fbm(nx * 72, ny * 41, 31.2, 4) - 0.5) * 5.2 * coastalInfluence +
          (fbm(nx * 155, ny * 88, 87.9, 3) - 0.5) * 1.8 * coastalInfluence;

        const islandGain =
          coastalInfluence * smoothstep(0.72, 0.94, fbm(nx * 112, ny * 64, 44.8, 3)) * 2.1;

        const lakeLoss = lakeCut(lon, lat) * 7.2;
        const ridgeLift = elevationField(lon, lat);
        const polarLift = latAbs > 66 ? ((latAbs - 66) / 24) * 2.2 : 0;

        const signed = rawSd + coastlineFracture + islandGain - lakeLoss + polarLift;
        const isLand = signed > 0;

        const terrainNoise = fbm(nx * 42 + 11, ny * 34 - 3, 13.9, 5);
        const fineNoise = fbm(nx * 136, ny * 78, 19.4, 3);
        const wet = fbm(nx * 12.5 - 4, ny * 8.2 + 5, 22.5, 5);
        const arid =
          smoothstep(8, 30, latAbs) *
          (1 - smoothstep(31, 57, latAbs)) *
          (1 - wet * 0.55);

        const inland = smoothstep(0, 20, signed);
        const shelf = isLand ? 0 : 1 - smoothstep(0.4, 7.0, -signed);
        const depth = isLand ? 0 : smoothstep(0, 28, -signed);

        const h = isLand
          ? clamp(inland * 0.75 + ridgeLift * 0.95 + (terrainNoise - 0.5) * 0.15, 0, 1)
          : -depth;

        height[idx] = h;
        land[idx] = isLand ? 255 : 0;

        const coastBand = 1 - smoothstep(0.12, 5.2, Math.abs(signed));
        coast[idx] = Math.round(coastBand * 255);

        const glacialLat = smoothstep(62, 84, latAbs);
        const highSnow = isLand ? smoothstep(0.56, 0.92, h + terrainNoise * 0.20) : 0;
        const iceValue = clamp(glacialLat * 0.82 + highSnow * 0.45, 0, 1);
        ice[idx] = iceValue;

        if (isLand) {
          const mountain = smoothstep(0.52, 0.94, h + ridgeLift * 0.55);
          const green = clamp((wet - 0.28) * 1.38 * (1 - arid * 0.44), 0, 1);
          const shore = smoothstep(0, 3.0, signed) * (1 - smoothstep(3.0, 8.0, signed));

          let rr = mix(132, 42, green);
          let gg = mix(105, 122, green);
          let bb = mix(58, 72, green);

          rr = mix(rr, 176, arid * 0.48);
          gg = mix(gg, 142, arid * 0.38);
          bb = mix(bb, 90, arid * 0.30);

          rr = mix(rr, 112, mountain * 0.52);
          gg = mix(gg, 108, mountain * 0.49);
          bb = mix(bb, 104, mountain * 0.56);

          rr = mix(rr, 225, iceValue * 0.78);
          gg = mix(gg, 232, iceValue * 0.78);
          bb = mix(bb, 224, iceValue * 0.78);

          rr = mix(rr, 190, shore * 0.38);
          gg = mix(gg, 172, shore * 0.34);
          bb = mix(bb, 122, shore * 0.30);

          const grain = (terrainNoise - 0.5) * 21 + (fineNoise - 0.5) * 8;

          r[idx] = clamp(rr + grain, 0, 255);
          g[idx] = clamp(gg + grain * 0.86, 0, 255);
          b[idx] = clamp(bb + grain * 0.68, 0, 255);

          roughness[idx] = clamp(0.30 + terrainNoise * 0.42 + h * 0.35 + ridgeLift * 0.38, 0, 1);
          oceanDepth[idx] = 0;
        } else {
          const current = fbm(nx * 32 + 18, ny * 18 - 7, 31.6, 5);
          const abyss = fbm(nx * 8.5, ny * 6.8, 35.0, 6);
          const reef = shelf * smoothstep(0.55, 0.90, fbm(nx * 62, ny * 42, 88.1, 3));

          let rr = mix(12, 0, depth);
          let gg = mix(90, 24, depth);
          let bb = mix(136, 78, depth);

          rr = mix(rr, 35, shelf * 0.78);
          gg = mix(gg, 158, shelf * 0.74);
          bb = mix(bb, 168, shelf * 0.72);

          rr = mix(rr, 3, abyss * depth * 0.42);
          gg = mix(gg, 38, abyss * depth * 0.32);
          bb = mix(bb, 102, abyss * depth * 0.30);

          rr = mix(rr, 74, reef * 0.22);
          gg = mix(gg, 186, reef * 0.32);
          bb = mix(bb, 176, reef * 0.28);

          const flow = (current - 0.5) * 16;

          r[idx] = clamp(rr + flow * 0.20, 0, 255);
          g[idx] = clamp(gg + flow * 0.50, 0, 255);
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

  const LIGHT = normalize3([-0.54, -0.34, 0.88]);
  const HALF_LIGHT = normalize3([LIGHT[0], LIGHT[1], LIGHT[2] + 1.18]);

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
    const prior = document.getElementById("hearth-g3-1-cartographic-style");
    if (prior) prior.remove();

    const style = document.createElement("style");
    style.id = "hearth-g3-1-cartographic-style";
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

      .hearth-g3-1-chip {
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
        .hearth-g3-1-chip { display: none; }
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

          const relief = clamp((h * 0.82 + rough * 0.35) * light, 0, 1);
          rr = mix(rr, rr + 18, relief * 0.14);
          gg = mix(gg, gg + 15, relief * 0.12);
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
      ticTacToe: TIC_TAC_TOE,
      quadA: QUAD_A,
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
    canvas.dataset.generation = "G3.1-candidate";
    canvas.dataset.localScale = "hearth";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth G3.1 cartographic body mass terrain map dynamic globe");

    const chip = document.createElement("div");
    chip.className = "hearth-g3-1-chip";
    chip.textContent = "Hearth G3.1 · Cartographic Body";

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
    mountEl.dataset.hearthGeneration = "G3.1-candidate";
    mountEl.dataset.hearthGenerationFocus = "cartographic-body-mass-terrain-map";
    mountEl.dataset.g4Deferred = "clouds-weather-climate";
    mountEl.dataset.earthPlaceholder = "false";
    mountEl.dataset.audraliaMap = "false";

    document.documentElement.dataset.hearthCanvasLoaded = "true";
    document.documentElement.dataset.hearthCanvasContract = CONTRACT;
    document.documentElement.dataset.hearthCanvasVersion = VERSION;
    document.documentElement.dataset.hearthGeneration = "G3.1-candidate";
    document.documentElement.dataset.hearthGenerationFocus = "cartographic-body-mass-terrain-map";
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

    const style = document.getElementById("hearth-g3-1-cartographic-style");
    if (style) style.remove();

    if (runtime.mount) runtime.mount.replaceChildren();

    window.__HEARTH_CANVAS_G3_1_DISPOSE__ = null;
    exposeReceipt("disposed");
  }

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
