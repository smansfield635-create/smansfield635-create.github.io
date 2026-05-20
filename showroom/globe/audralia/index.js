/* TARGET FILE: /showroom/globe/audralia/index.js */
/*
  AUDRALIA_ROUTEFINDER_ACTIVE_GLOBE_RENDER_BRIDGE_TNT_v2
  route=/showroom/globe/audralia/
  purpose=restore visible Audralia globe by binding the active route renderer to the renewed asset chain
  previous=AUDRALIA_ORGANIC_LANDFORM_HYDROLOGY_VISUAL_RENEWAL_TNT_v1
  preserves=#audraliaCanvasMount, boxed containment, touch scope, Audralia spelling, no generated image, no GraphicBox
  routefinder=active visual bridge only
  chain=lattice256 -> landmap -> topology -> elevation -> hydrology -> land.surface -> routefinder texture -> canvas draw
*/

(function () {
  "use strict";

  const CONTRACT = "AUDRALIA_ROUTEFINDER_ACTIVE_GLOBE_RENDER_BRIDGE_TNT_v2";
  const RECEIPT = "AUDRALIA_ROUTEFINDER_ACTIVE_GLOBE_RENDER_BRIDGE_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "AUDRALIA_ORGANIC_LANDFORM_HYDROLOGY_VISUAL_RENEWAL_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const WORLD = "Audralia";
  const VERSION = "2026-05-19.audralia-routefinder-active-globe-render-bridge-v2";

  const TAU = Math.PI * 2;
  const PHI = 1.618033988749895;
  const INV_PHI = 1 / PHI;

  const TEXTURE = Object.freeze({
    width: 768,
    height: 384,
    fallbackWidth: 512,
    fallbackHeight: 256,
    maxSphere: 456,
    minSphere: 300,
    maxDpr: 1.45,
    targetFpsMs: 42
  });

  const ASSETS = Object.freeze([
    {
      label: "lattice256",
      src: "/assets/audralia/audralia.lattice256.js",
      flag: "audraliaRoutefinderLattice256Loaded",
      probe: () => Boolean(window.AUDRALIA_LATTICE256?.coordinatesFromUV)
    },
    {
      label: "topology",
      src: "/assets/audralia/audralia.topology.js",
      flag: "audraliaRoutefinderTopologyLoaded",
      probe: () => Boolean(window.AUDRALIA_TOPOLOGY?.sampleTopology || window.AUDRALIA_TOPOLOGY?.sample)
    },
    {
      label: "landmap",
      src: "/assets/audralia/audralia.landmap.js",
      flag: "audraliaRoutefinderLandmapLoaded",
      probe: () => Boolean(window.AUDRALIA_LANDMAP?.sampleLandmap || window.AUDRALIA_LANDMAP?.sample)
    },
    {
      label: "elevation",
      src: "/assets/audralia/audralia.elevation.js",
      flag: "audraliaRoutefinderElevationLoaded",
      probe: () => Boolean(window.AUDRALIA_ELEVATION?.sampleElevation || window.AUDRALIA_ELEVATION?.sample)
    },
    {
      label: "climate",
      src: "/assets/audralia/audralia.climate.render.js",
      flag: "audraliaRoutefinderClimateLoaded",
      probe: () => Boolean(window.AUDRALIA_CLIMATE_RENDER?.sampleClimate || window.AUDRALIA_CLIMATE_RENDER?.sample)
    },
    {
      label: "hydrology",
      src: "/assets/audralia/audralia.hydrology.js",
      flag: "audraliaRoutefinderHydrologyLoaded",
      probe: () => Boolean(window.AUDRALIA_HYDROLOGY?.sampleHydrology || window.AUDRALIA_HYDROLOGY?.sample)
    },
    {
      label: "land.surface",
      src: "/assets/audralia/audralia.land.surface.js",
      flag: "audraliaRoutefinderLandSurfaceLoaded",
      probe: () => Boolean(window.AUDRALIA_LAND_SURFACE?.sampleSurface || window.AUDRALIA_LAND_SURFACE?.sample)
    }
  ]);

  const COLORS = Object.freeze({
    spaceA: [2, 6, 16],
    spaceB: [7, 21, 36],
    deepOcean: [3, 20, 54],
    ocean: [8, 68, 112],
    oceanBright: [25, 108, 142],
    shelf: [64, 164, 164],
    lagoon: [134, 210, 178],
    river: [34, 130, 146],
    lake: [30, 104, 145],
    beach: [197, 184, 128],
    wetBeach: [150, 160, 118],
    lowland: [112, 148, 88],
    green: [72, 138, 92],
    wetland: [70, 130, 102],
    highland: [132, 126, 84],
    ridge: [122, 105, 82],
    mountain: [142, 136, 112],
    snow: [216, 232, 224],
    shadow: [20, 34, 38],
    cloud: [226, 238, 232],
    atmosphere: [92, 172, 198],
    rim: [148, 226, 210],
    gold: [243, 200, 111]
  });

  const mount =
    document.getElementById("audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount='true']") ||
    document.querySelector("[data-audralia-globe-mount='true']");

  const stage =
    document.getElementById("audralia-stage") ||
    document.querySelector("[data-audralia-stage='true']") ||
    (mount ? mount.closest(".stage") : null);

  const routeNotice =
    document.getElementById("audraliaRouteLoaderNotice") ||
    document.querySelector("[data-audralia-route-loader-notice='true']");

  const routeStatus =
    document.getElementById("audraliaRouteStatus") ||
    document.querySelector("[data-audralia-route-status='true']");

  if (!mount) {
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    if (routeNotice) routeNotice.textContent = "Audralia mount missing";
    if (routeStatus) routeStatus.textContent = "RouteFinder render held";
    return;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function wrapPi(value) {
    let out = value;
    while (out < -Math.PI) out += TAU;
    while (out > Math.PI) out -= TAU;
    return out;
  }

  function mixColor(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      lerp(a[0], b[0], k),
      lerp(a[1], b[1], k),
      lerp(a[2], b[2], k)
    ];
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function text(value) {
    return String(value || "").trim().toLowerCase();
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(2, Math.floor(scale));
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise(u, v, seed, octaves = 4) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4.0;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 197);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function setDataset(key, value) {
    document.documentElement.dataset[key] = String(value);
  }

  function setNotice(message) {
    if (routeNotice) routeNotice.textContent = message;
  }

  function setStatus(message) {
    if (routeStatus) routeStatus.textContent = message;
  }

  window.DGB_AUDRALIA_ROUTEFINDER_ACTIVE_GLOBE_RENDER_BRIDGE = CONTRACT;
  window.DGB_AUDRALIA_CANONICAL_SPELLING = "A_U_D_R_A_L_I_A";
  window.DGB_AUDRALIA_TOUCH_SCOPE = "box-only";
  window.DGB_AUDRALIA_GENERATED_IMAGE = false;
  window.DGB_AUDRALIA_GRAPHIC_BOX = false;
  window.DGB_AUDRALIA_VISUAL_PASS_CLAIMED = false;

  mount.textContent = "";
  mount.setAttribute("data-audralia-routefinder", "active");
  mount.setAttribute("data-audralia-contract", CONTRACT);
  mount.setAttribute("data-audralia-world", WORLD);
  mount.setAttribute("data-audralia-touch-scope", "box-only");
  mount.setAttribute("data-generated-image", "false");
  mount.setAttribute("data-graphic-box", "false");
  mount.setAttribute("data-visual-pass-claimed", "false");

  Object.assign(mount.style, {
    position: "absolute",
    inset: "0",
    overflow: "hidden",
    touchAction: "none",
    userSelect: "none"
  });

  if (stage) {
    stage.setAttribute("data-loader-state", "mounted");
    stage.setAttribute("data-audralia-routefinder-render-bridge", CONTRACT);
    stage.setAttribute("data-touch-scope", "box-only");
    stage.setAttribute("data-generated-image", "false");
    stage.setAttribute("data-graphic-box", "false");
    stage.setAttribute("data-visual-pass-claimed", "false");
  }

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Audralia RouteFinder active globe render");
  canvas.setAttribute("data-audralia-visible-canvas", "true");
  canvas.setAttribute("data-audralia-globe", "routefinder-active-render");
  canvas.setAttribute("data-audralia-contract", CONTRACT);
  canvas.setAttribute("data-audralia-receipt", RECEIPT);
  canvas.setAttribute("data-generated-image", "false");
  canvas.setAttribute("data-graphic-box", "false");
  canvas.setAttribute("data-visual-pass-claimed", "false");

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    touchAction: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    cursor: "grab"
  });

  mount.appendChild(canvas);

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true
  });

  const sphereBuffer = document.createElement("canvas");
  const sphereCtx = sphereBuffer.getContext("2d", {
    alpha: true,
    willReadFrequently: true
  });

  if (!ctx || !sphereCtx) {
    setNotice("Audralia canvas context unavailable");
    setStatus("RouteFinder render held");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    return;
  }

  const state = {
    width: 1,
    height: 1,
    dpr: 1,
    sphereSize: 360,
    radius: 180,
    cx: 0,
    cy: 0,
    rotation: -0.92,
    targetRotation: -0.92,
    tilt: -0.12,
    targetTilt: -0.12,
    pointerActive: false,
    startX: 0,
    startY: 0,
    startRotation: -0.92,
    startTilt: -0.12,
    lastTime: performance.now(),
    lastRenderTime: 0,
    visible: true,
    texture: null,
    textureSource: "routefinder-fallback",
    chainReady: false,
    assetStatus: {},
    reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function loadScriptOnce(asset) {
    if (asset.probe()) {
      state.assetStatus[asset.label] = "already-active";
      return Promise.resolve(true);
    }

    const existing = Array.from(document.scripts).find((script) => script.src && script.src.includes(asset.src));
    if (existing && asset.probe()) {
      state.assetStatus[asset.label] = "existing-active";
      return Promise.resolve(true);
    }

    if (existing && !asset.probe()) {
      return new Promise((resolve) => {
        existing.addEventListener(
          "load",
          () => {
            const ok = asset.probe();
            state.assetStatus[asset.label] = ok ? "existing-loaded" : "existing-loaded-probe-missing";
            resolve(ok);
          },
          { once: true }
        );

        existing.addEventListener(
          "error",
          () => {
            state.assetStatus[asset.label] = "existing-error";
            resolve(false);
          },
          { once: true }
        );

        window.setTimeout(() => {
          const ok = asset.probe();
          if (ok) state.assetStatus[asset.label] = "existing-late-active";
          resolve(ok);
        }, 650);
      });
    }

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = `${asset.src}?v=${encodeURIComponent(CONTRACT)}`;
      script.defer = true;
      script.dataset.audraliaRoutefinderAsset = asset.label;
      script.dataset.audraliaRoutefinderContract = CONTRACT;

      script.onload = () => {
        const ok = asset.probe();
        state.assetStatus[asset.label] = ok ? "loaded" : "loaded-probe-missing";
        document.documentElement.dataset[asset.flag] = String(ok);
        resolve(ok);
      };

      script.onerror = () => {
        state.assetStatus[asset.label] = "error";
        document.documentElement.dataset[asset.flag] = "false";
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  async function ensureAssets() {
    setNotice("RouteFinder loading Audralia chain");
    setStatus("Binding route renderer to asset authorities");

    for (const asset of ASSETS) {
      await loadScriptOnce(asset);
    }

    state.chainReady = true;
    setDataset("audraliaRoutefinderChainReady", "true");
    setDataset("audraliaRoutefinderAssetStatus", JSON.stringify(state.assetStatus));
    return state.assetStatus;
  }

  function cellInfo(u, v) {
    try {
      if (window.AUDRALIA_LATTICE256?.coordinatesFromUV) {
        const result = window.AUDRALIA_LATTICE256.coordinatesFromUV(u, v);
        if (result && Number.isFinite(Number(result.cell256))) {
          return {
            cell256: Number(result.cell256),
            cell64: Number(result.cell64 || 1),
            cell16: Number(result.cell16 || 1),
            row16: Number(result.row16 || Math.floor(v * 16)),
            col16: Number(result.col16 || Math.floor(u * 16))
          };
        }
      }
    } catch {
      setDataset("audraliaRoutefinderLatticeReadFailed", "true");
    }

    const col16 = clamp(Math.floor(wrap01(u) * 16), 0, 15);
    const row16 = clamp(Math.floor(clamp(v, 0, 1) * 16), 0, 15);

    return {
      cell256: row16 * 16 + col16 + 1,
      cell64: Math.floor(row16 / 2) * 8 + Math.floor(col16 / 2) + 1,
      cell16: Math.floor(row16 / 4) * 4 + Math.floor(col16 / 4) + 1,
      row16,
      col16
    };
  }

  function ellipseScore(lon, lat, item) {
    const dlon = wrapPi(lon - item.lon);
    const dlat = lat - item.lat;
    const tilt = item.tilt || 0;
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    const x = (dlon * cos + dlat * sin) / item.rx;
    const y = (-dlon * sin + dlat * cos) / item.ry;
    return 1 - (x * x + y * y);
  }

  function routefinderMap(u, v) {
    const lon = wrap01(u) * TAU - Math.PI;
    const lat = (0.5 - clamp(v, 0, 1)) * Math.PI;
    const lonDeg = lon * 180 / Math.PI;
    const latDeg = lat * 180 / Math.PI;
    const cells = cellInfo(u, v);

    const continents = [
      { lon: -2.50, lat: -0.12, rx: 0.55, ry: 0.34, tilt: -0.18, weight: 1.02 },
      { lon: -1.82, lat: 0.36, rx: 0.40, ry: 0.27, tilt: 0.18, weight: 0.86 },
      { lon: -1.10, lat: -0.22, rx: 0.42, ry: 0.25, tilt: -0.42, weight: 0.82 },
      { lon: -0.22, lat: 0.18, rx: 0.44, ry: 0.29, tilt: 0.28, weight: 0.84 },
      { lon: 0.68, lat: -0.30, rx: 0.47, ry: 0.30, tilt: -0.26, weight: 0.88 },
      { lon: 1.44, lat: 0.16, rx: 0.45, ry: 0.31, tilt: 0.20, weight: 0.86 },
      { lon: 2.32, lat: -0.06, rx: 0.50, ry: 0.29, tilt: -0.16, weight: 0.94 },
      { lon: 2.84, lat: 0.45, rx: 0.31, ry: 0.19, tilt: 0.16, weight: 0.66 }
    ];

    const oceanCuts = [
      { lon: -2.14, lat: 0.08, rx: 0.20, ry: 0.42, tilt: -0.08, weight: 0.98 },
      { lon: -1.42, lat: -0.02, rx: 0.17, ry: 0.36, tilt: 0.20, weight: 0.86 },
      { lon: -0.72, lat: 0.20, rx: 0.19, ry: 0.35, tilt: -0.24, weight: 0.78 },
      { lon: 0.10, lat: -0.18, rx: 0.22, ry: 0.40, tilt: 0.12, weight: 0.88 },
      { lon: 0.88, lat: 0.18, rx: 0.18, ry: 0.32, tilt: -0.18, weight: 0.76 },
      { lon: 1.78, lat: -0.22, rx: 0.19, ry: 0.37, tilt: 0.22, weight: 0.90 },
      { lon: 2.62, lat: 0.16, rx: 0.20, ry: 0.31, tilt: -0.14, weight: 0.82 }
    ];

    const islands = [
      { lon: -2.88, lat: -0.50, rx: 0.16, ry: 0.08, tilt: 0.18, weight: 0.88 },
      { lon: -2.62, lat: -0.34, rx: 0.10, ry: 0.055, tilt: -0.18, weight: 0.76 },
      { lon: -1.02, lat: -0.49, rx: 0.14, ry: 0.075, tilt: 0.28, weight: 0.78 },
      { lon: -0.25, lat: -0.52, rx: 0.12, ry: 0.065, tilt: -0.32, weight: 0.74 },
      { lon: 0.30, lat: 0.54, rx: 0.13, ry: 0.070, tilt: 0.14, weight: 0.70 },
      { lon: 1.16, lat: -0.54, rx: 0.16, ry: 0.080, tilt: -0.24, weight: 0.84 },
      { lon: 2.02, lat: 0.52, rx: 0.14, ry: 0.080, tilt: 0.20, weight: 0.76 },
      { lon: 2.90, lat: -0.42, rx: 0.18, ry: 0.080, tilt: -0.18, weight: 0.84 }
    ];

    const inlandWaters = [
      { lon: -1.62, lat: 0.10, rx: 0.070, ry: 0.045, weight: 1 },
      { lon: -0.70, lat: 0.18, rx: 0.085, ry: 0.050, weight: 1 },
      { lon: 0.82, lat: -0.08, rx: 0.080, ry: 0.050, weight: 1 },
      { lon: 1.62, lat: 0.23, rx: 0.070, ry: 0.042, weight: 1 },
      { lon: 2.28, lat: -0.18, rx: 0.090, ry: 0.050, weight: 1 }
    ];

    const warpA = fbm(u * 1.2 + 0.27, v * 1.5 - 0.19, 200100, 5) - 0.5;
    const warpB = fbm(u * 2.4 - 0.11, v * 2.2 + 0.31, 200900, 4) - 0.5;
    const wlon = wrapPi(lon + warpA * 0.22 + Math.sin(lat * 3.0) * 0.05);
    const wlat = clamp(lat + warpB * 0.12, -Math.PI / 2, Math.PI / 2);

    let landScore = -0.55;
    let islandScore = -0.5;
    let bodyClass = "ocean";

    for (const body of continents) {
      const e = ellipseScore(wlon, wlat, body);
      if (e > -0.58) {
        const coastNoise =
          (fbm(u * 3.7 + body.lon * 0.2, v * 4.3 + body.lat * 0.2, 201700, 5) - 0.5) * 0.40 +
          (fbm(u * 8.4 - body.lon * 0.1, v * 7.2 + body.lat * 0.1, 202500, 4) - 0.5) * 0.15;
        const score = e * body.weight + coastNoise;
        if (score > landScore) {
          landScore = score;
          bodyClass = "continental";
        }
      }
    }

    for (const island of islands) {
      const e = ellipseScore(wlon, wlat, island);
      if (e > -0.30) {
        const islandNoise = (fbm(u * 9.0, v * 9.0, 203300, 3) - 0.5) * 0.28;
        const score = e * island.weight + islandNoise - 0.05;
        islandScore = Math.max(islandScore, score);
        if (score > landScore) {
          landScore = score;
          bodyClass = "archipelago";
        }
      }
    }

    let cutScore = 0;
    for (const cut of oceanCuts) {
      const e = ellipseScore(wlon, wlat, cut);
      if (e > 0) cutScore = Math.max(cutScore, smoothstep(0.0, 0.95, e) * cut.weight);
    }

    const corridorLine = Math.abs(Math.sin(wlon * 3.4 + Math.sin(wlat * 5.6) * 0.9));
    const corridor = corridorLine < 0.118 && Math.abs(wlat) < 0.66 ? 0.16 : 0;
    const landBeforeCut = landScore;

    landScore -= cutScore * 0.94;
    landScore -= corridor * smoothstep(-0.18, 0.36, landScore);

    let inlandScore = 0;
    for (const lake of inlandWaters) {
      const e = ellipseScore(wlon, wlat, lake);
      if (e > 0.12 && landScore > 0.04) inlandScore = Math.max(inlandScore, e * lake.weight);
    }

    const shelf = smoothstep(-0.30, 0.035, landScore);
    const beachEdge = clamp(1 - Math.abs(landScore) / 0.18, 0, 1);
    const isInlandWater = inlandScore > 0.14;
    const isBeach = landScore > 0.020 && landScore <= 0.075 && !isInlandWater;
    const isShelf = landScore <= 0.020 && landScore > -0.30;
    const isOcean = landScore <= -0.30;
    const isLand = landScore > 0.075 && !isInlandWater;
    const polarIce = Math.abs(latDeg) > 72 && (isLand || isBeach);

    const ridge = ridgeNoise(u * 7.0 + 0.14, v * 4.0 - 0.21, 204100, 5);
    const basin = 1 - ridgeNoise(u * 2.5 - 0.18, v * 2.1 + 0.17, 204900, 4);

    const terrainClass = isInlandWater
      ? "inland-water"
      : polarIce
        ? "polar-ice"
        : isOcean
          ? "ocean"
          : isShelf
            ? "shelf"
            : isBeach
              ? "beach"
              : ridge > 0.72
                ? "mountain"
                : ridge > 0.60
                  ? "highland"
                  : basin > 0.68
                    ? "wetland"
                    : bodyClass === "archipelago"
                      ? "island-lowland"
                      : "lowland";

    return Object.freeze({
      u,
      v,
      longitude: lonDeg,
      latitude: latDeg,
      cell256: cells.cell256,
      cell64: cells.cell64,
      cell16: cells.cell16,
      row16: cells.row16,
      col16: cells.col16,
      terrainClass,
      topology: isInlandWater
        ? "interior-water"
        : bodyClass === "archipelago"
          ? "archipelago-fragment"
          : isShelf
            ? "continental-shelf"
            : isBeach
              ? "coastal-beach"
              : isOcean
                ? "open-ocean"
                : "organic-landform",
      elevation: ridge > 0.72 ? "mountain" : ridge > 0.60 ? "highland" : basin > 0.68 ? "lowland-basin" : "rolling-land",
      band: Math.abs(latDeg) < 24 ? "equatorial" : Math.abs(latDeg) < 52 ? "temperate" : "polar",
      quadrant: latDeg >= 0 ? (lonDeg >= 0 ? "NE" : "NW") : (lonDeg >= 0 ? "SE" : "SW"),
      primarySummit: "Stewardship",
      internalSummit: "Possibility",
      summitProvince: "Stewardship",
      landScore,
      landBeforeCut,
      routefinderCutScore: cutScore,
      routefinderCorridor: corridor,
      routefinderIslandScore: islandScore,
      routefinderInlandScore: inlandScore,
      routefinderWaterCut: cutScore > 0.26 || corridor > 0.08,
      routefinderArchipelago: bodyClass === "archipelago",
      routefinderFallback: true,
      isOcean,
      isShelf,
      isBeach,
      isLand,
      isPolarIce: polarIce,
      isInlandWater,
      shelf,
      beachEdge,
      coastline: beachEdge,
      geologyHint: bodyClass === "archipelago" ? "archipelago-shelf" : "audralia-routefinder-organic-surface",
      canvasOwnsFootprint: false
    });
  }

  function sampleAssetLandmap(u, v) {
    try {
      if (window.AUDRALIA_LANDMAP?.sampleLandmap) return window.AUDRALIA_LANDMAP.sampleLandmap(u, v);
      if (window.AUDRALIA_LANDMAP?.sample) return window.AUDRALIA_LANDMAP.sample(u, v);
    } catch {
      setDataset("audraliaRoutefinderLandmapSampleFailed", "true");
    }

    return null;
  }

  function sampleMap(u, v) {
    const route = routefinderMap(u, v);
    const asset = sampleAssetLandmap(u, v);

    if (!asset || typeof asset !== "object") return route;

    const assetIsLand = Boolean(asset.isLand || (!asset.isOcean && !asset.isShelf && asset.terrainClass && asset.terrainClass !== "ocean"));
    const routeWaterCut = route.routefinderWaterCut && assetIsLand && route.landBeforeCut > -0.05;
    const routeArchipelagoLift = route.routefinderArchipelago && route.isLand && Boolean(asset.isOcean || asset.isShelf);

    if (routeWaterCut) {
      return Object.freeze({
        ...asset,
        terrainClass: route.isShelf ? "shelf" : "ocean",
        topology: "routefinder-hydrology-cut",
        elevation: "sea-level",
        isOcean: true,
        isShelf: route.isShelf,
        isBeach: false,
        isLand: false,
        isInlandWater: false,
        shelf: Math.max(Number(asset.shelf || 0), route.shelf),
        beachEdge: Math.max(Number(asset.beachEdge || 0), route.beachEdge),
        routefinderVisualCut: true,
        routefinderFallback: false,
        routefinderCompanion: route
      });
    }

    if (routeArchipelagoLift) {
      return Object.freeze({
        ...route,
        assetCompanion: asset,
        routefinderVisualIslandLift: true,
        routefinderFallback: false
      });
    }

    return Object.freeze({
      ...asset,
      u,
      v,
      routefinderCompanion: route,
      routefinderFallback: false
    });
  }

  function sampleHydrology(map) {
    try {
      if (window.AUDRALIA_HYDROLOGY?.sampleHydrology) return window.AUDRALIA_HYDROLOGY.sampleHydrology(map);
      if (window.AUDRALIA_HYDROLOGY?.sample) return window.AUDRALIA_HYDROLOGY.sample(map);
    } catch {
      setDataset("audraliaRoutefinderHydrologySampleFailed", "true");
    }

    const route = map.routefinderCompanion || map;
    const river = ridgeNoise(Number(route.u || 0) * 7.2, Number(route.v || 0) * 5.6, 300100, 4);
    const lake = Number(route.routefinderInlandScore || 0);
    const cut = Number(route.routefinderCutScore || 0);
    const corridor = Number(route.routefinderCorridor || 0);
    const coast = Number(route.beachEdge || 0);

    return Object.freeze({
      contract: "routefinder-fallback-hydrology",
      class: route.isInlandWater ? "lake" : cut > 0.32 ? "inlet-edge" : river > 0.70 ? "river" : coast > 0.48 ? "coastal-shelf" : "hydrology-background",
      zone: route.isInlandWater ? "interior-water" : coast > 0.48 ? "coastal" : "land",
      form: "routefinder-hydrology-field",
      waterColorHint: route.isInlandWater ? "lake-blue" : cut > 0.32 ? "inlet-blue" : "hydrology-background",
      isInlandWater: Boolean(route.isInlandWater),
      isSurfaceWater: Boolean(route.isInlandWater || route.isOcean || route.isShelf),
      isLandformShaping: Boolean(cut > 0.24 || corridor > 0.05 || coast > 0.42),
      river,
      dryChannel: 0,
      lake,
      inlandSea: lake > 0.66 ? lake : 0,
      wetland: river > 0.63 && coast < 0.50 ? river * 0.42 : 0,
      delta: river > 0.68 && coast > 0.46 ? river * coast : 0,
      bay: cut,
      inlet: cut,
      estuary: river * coast,
      peninsula: route.routefinderArchipelago ? 0.72 : 0,
      lagoon: coast * 0.60,
      marshBasin: river > 0.66 ? 0.42 : 0,
      coastalShelfWater: Number(route.shelf || 0),
      drainage: river,
      watershed: Math.max(river, coast),
      landCutPressure: Math.max(cut, corridor),
      surfaceWaterPressure: Math.max(lake, cut, river * 0.58),
      oceanCorridor: corridor,
      coastalCut: cut,
      visualGuidance: {
        shouldPaintWater: Boolean(route.isInlandWater || lake > 0.50),
        shouldShapeLand: Boolean(cut > 0.24 || corridor > 0.05),
        shouldInterruptSolidLandmass: Boolean(cut > 0.28 || corridor > 0.08),
        shouldSupportWetlandColor: river > 0.64,
        shouldSupportRiverCorridor: river > 0.64,
        shouldSupportBayInletBreaks: cut > 0.24,
        shouldSupportArchipelagoWater: Boolean(route.routefinderArchipelago),
        shouldSupportOceanCorridor: corridor > 0.05,
        shouldSupportInlandWater: lake > 0.30
      }
    });
  }

  function sampleSurface(map) {
    try {
      if (window.AUDRALIA_LAND_SURFACE?.sampleSurface) return window.AUDRALIA_LAND_SURFACE.sampleSurface(map);
      if (window.AUDRALIA_LAND_SURFACE?.sample) return window.AUDRALIA_LAND_SURFACE.sample(map);
    } catch {
      setDataset("audraliaRoutefinderSurfaceSampleFailed", "true");
    }

    return null;
  }

  function isOceanLike(map) {
    return Boolean(map?.isOcean || map?.terrainClass === "ocean" || map?.topology === "open-ocean");
  }

  function isShelfLike(map) {
    return Boolean(map?.isShelf || map?.terrainClass === "shelf" || text(map?.topology).includes("shelf"));
  }

  function isBeachLike(map) {
    return Boolean(map?.isBeach || map?.terrainClass === "beach" || text(map?.topology).includes("beach"));
  }

  function waterColor(map, hydrology, u, v) {
    const shelf = clamp(Number(map.shelf || hydrology.coastalShelfWater || 0), 0, 1);
    const coast = clamp(Number(map.beachEdge || map.coastline || 0), 0, 1);
    const depth = fbm(u * 1.3 + 0.22, v * 1.1 - 0.17, 400100, 5);
    const wave = fbm(u * 16.0 - 0.10, v * 10.0 + 0.25, 400900, 3);
    const inland = Boolean(hydrology.isInlandWater || map.isInlandWater || hydrology.lake > 0.55 || hydrology.inlandSea > 0.48);
    const lagoon = clamp(Number(hydrology.lagoon || 0), 0, 1);
    const river = clamp(Number(hydrology.river || 0), 0, 1);
    const bay = clamp(Math.max(Number(hydrology.bay || 0), Number(hydrology.inlet || 0)), 0, 1);

    let color = mixColor(COLORS.deepOcean, COLORS.ocean, smoothstep(0.25, 0.86, depth));

    if (isShelfLike(map) || shelf > 0.20) {
      color = mixColor(color, COLORS.shelf, smoothstep(0.12, 0.86, shelf) * 0.78);
    }

    if (coast > 0.30 || lagoon > 0.20) {
      color = mixColor(color, COLORS.lagoon, clamp(coast * 0.34 + lagoon * 0.42, 0, 0.70));
    }

    if (inland) {
      color = mixColor(COLORS.lake, COLORS.lagoon, clamp(Number(hydrology.lake || 0) * 0.38 + Number(hydrology.inlandSea || 0) * 0.18, 0, 0.50));
    }

    if (river > 0.60 && !isOceanLike(map)) {
      color = mixColor(color, COLORS.river, clamp((river - 0.55) * 0.90, 0, 0.55));
    }

    if (bay > 0.32) {
      color = mixColor(color, COLORS.oceanBright, bay * 0.25);
    }

    return shade(color, (wave - 0.5) * 9);
  }

  function fallbackLandColor(map, hydrology, u, v) {
    const terrain = text(map.terrainClass || map.topology || map.elevation);
    const ridge = ridgeNoise(u * 8.0 + 0.17, v * 5.6 - 0.22, 500100, 4);
    const wet = fbm(u * 4.2 - 0.27, v * 3.8 + 0.19, 500900, 4);
    const dry = fbm(u * 2.2 + 0.41, v * 2.6 - 0.31, 501700, 4);
    const hydroWet = clamp(Number(hydrology.wetland || 0) + Number(hydrology.delta || 0) + Number(hydrology.estuary || 0), 0, 1);

    let color = mixColor(COLORS.lowland, COLORS.green, wet * 0.42);
    color = mixColor(color, COLORS.highland, dry * 0.34);

    if (terrain.includes("mountain") || terrain.includes("ridge") || ridge > 0.74) {
      color = mixColor(color, COLORS.mountain, clamp(ridge * 0.50, 0, 0.55));
      color = shade(color, ridge * 10 - 5);
    }

    if (terrain.includes("highland") || terrain.includes("plateau")) {
      color = mixColor(color, COLORS.highland, 0.38);
    }

    if (terrain.includes("wetland") || hydroWet > 0.30) {
      color = mixColor(color, COLORS.wetland, clamp(0.24 + hydroWet * 0.38, 0, 0.62));
    }

    if (terrain.includes("polar") || map.isPolarIce) {
      color = mixColor(color, COLORS.snow, 0.70);
    }

    return shade(color, (fbm(u * 22.0, v * 16.0, 502500, 3) - 0.5) * 16);
  }

  function chooseTextureColor(map, hydrology, u, v) {
    const guidance = hydrology?.visualGuidance || {};
    const river = clamp(Number(hydrology?.river || 0), 0, 1);
    const lake = clamp(Number(hydrology?.lake || 0), 0, 1);
    const inlandSea = clamp(Number(hydrology?.inlandSea || 0), 0, 1);
    const waterPressure = clamp(Number(hydrology?.surfaceWaterPressure || 0), 0, 1);
    const landCut = clamp(Number(hydrology?.landCutPressure || 0), 0, 1);
    const hydroClass = text(hydrology?.class);

    if (isOceanLike(map) || isShelfLike(map)) {
      return waterColor(map, hydrology || {}, u, v);
    }

    if (lake > 0.66 || inlandSea > 0.58 || map.isInlandWater || hydroClass === "lake" || hydroClass === "inland-sea") {
      return waterColor({ ...map, isInlandWater: true }, hydrology || {}, u, v);
    }

    if ((guidance.shouldPaintWater || hydroClass === "river") && river > 0.70) {
      const line = ridgeNoise(u * 18.0 - river, v * 14.0 + river, 503300, 3);
      if (line > 0.70) return waterColor({ ...map, isInlandWater: true }, hydrology || {}, u, v);
    }

    if ((guidance.shouldInterruptSolidLandmass || landCut > 0.58) && waterPressure > 0.48) {
      return waterColor({ ...map, isInlandWater: true }, hydrology || {}, u, v);
    }

    if (isBeachLike(map)) {
      let beach = mixColor(COLORS.beach, COLORS.wetBeach, clamp(Number(map.beachEdge || 0), 0, 1) * 0.34);
      beach = mixColor(beach, COLORS.lagoon, clamp(Number(map.shelf || 0), 0, 1) * 0.18);
      return shade(beach, (fbm(u * 20.0, v * 14.0, 504100, 3) - 0.5) * 10);
    }

    const surface = sampleSurface(map);
    if (surface?.allowed && Array.isArray(surface.color)) {
      let color = surface.color;

      if (Number(hydrology?.wetland || 0) > 0.48 || Number(hydrology?.delta || 0) > 0.46) {
        color = mixColor(color, COLORS.wetland, clamp(Number(hydrology.wetland || 0) * 0.30 + Number(hydrology.delta || 0) * 0.22, 0, 0.42));
      }

      return shade(color, (fbm(u * 22.0 + 0.1, v * 17.0 - 0.2, 504900, 3) - 0.5) * 10);
    }

    return fallbackLandColor(map, hydrology || {}, u, v);
  }

  function buildTexture(width, height, sourceLabel) {
    const data = new Uint8ClampedArray(width * height * 4);
    let landPixels = 0;
    let waterPixels = 0;
    let surfaceReads = 0;
    let hydroReads = 0;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / Math.max(1, width - 1);
        const map = sampleMap(u, v);
        const hydrology = sampleHydrology(map);
        const color = chooseTextureColor(map, hydrology, u, v);
        const index = (y * width + x) * 4;

        if (isOceanLike(map) || isShelfLike(map) || map.isInlandWater || hydrology?.isSurfaceWater) waterPixels += 1;
        else landPixels += 1;

        if (hydrology) hydroReads += 1;
        if (window.AUDRALIA_LAND_SURFACE) surfaceReads += 1;

        data[index] = clamp(Math.round(color[0]), 0, 255);
        data[index + 1] = clamp(Math.round(color[1]), 0, 255);
        data[index + 2] = clamp(Math.round(color[2]), 0, 255);
        data[index + 3] = 255;
      }
    }

    const total = Math.max(1, landPixels + waterPixels);

    return Object.freeze({
      width,
      height,
      data,
      source: sourceLabel,
      landRatio: Number((landPixels / total).toFixed(4)),
      waterRatio: Number((waterPixels / total).toFixed(4)),
      hydroReads,
      surfaceReads
    });
  }

  function buildCloudTexture(width, height) {
    const data = new Uint8ClampedArray(width * height);

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / Math.max(1, width - 1);
        const cloud =
          fbm(u * 2.2 + 0.12, v * 2.0 - 0.20, 600100, 5) * 0.64 +
          ridgeNoise(u * 5.6 - 0.18, v * 4.4 + 0.16, 600900, 3) * 0.26;
        data[y * width + x] = Math.round(clamp(smoothstep(0.62, 0.88, cloud) * 255, 0, 255));
      }
    }

    return Object.freeze({ width, height, data });
  }

  const cloudTexture = buildCloudTexture(256, 128);

  function sampleTexture(texture, lon, lat) {
    const u = wrap01((wrapPi(lon) + Math.PI) / TAU);
    const v = clamp(0.5 - lat / Math.PI, 0, 0.999999);
    const x = Math.floor(u * texture.width) % texture.width;
    const y = clamp(Math.floor(v * texture.height), 0, texture.height - 1);
    const index = (y * texture.width + x) * 4;

    return [
      texture.data[index],
      texture.data[index + 1],
      texture.data[index + 2],
      texture.data[index + 3]
    ];
  }

  function sampleCloud(lon, lat, drift) {
    const u = wrap01((wrapPi(lon + drift) + Math.PI) / TAU);
    const v = clamp(0.5 - lat / Math.PI, 0, 0.999999);
    const x = Math.floor(u * cloudTexture.width) % cloudTexture.width;
    const y = clamp(Math.floor(v * cloudTexture.height), 0, cloudTexture.height - 1);
    return cloudTexture.data[y * cloudTexture.width + x] / 255;
  }

  function normalize3(v) {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / length, v[1] / length, v[2] / length];
  }

  function resizeCanvas() {
    const rect = mount.getBoundingClientRect();
    const fallbackWidth = stage ? stage.getBoundingClientRect().width : window.innerWidth;
    const fallbackHeight = stage ? stage.getBoundingClientRect().height : window.innerWidth;
    const width = Math.max(320, Math.floor(rect.width || fallbackWidth || 360));
    const height = Math.max(260, Math.floor(rect.height || fallbackHeight || 360));
    const dpr = Math.min(window.devicePixelRatio || 1, TEXTURE.maxDpr);

    state.width = width;
    state.height = height;
    state.dpr = dpr;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    state.radius = Math.min(canvas.width, canvas.height) * 0.365;
    state.cx = canvas.width * 0.50;
    state.cy = canvas.height * 0.50;
    state.sphereSize = Math.min(TEXTURE.maxSphere, Math.max(TEXTURE.minSphere, Math.floor(state.radius * 2)));

    sphereBuffer.width = state.sphereSize;
    sphereBuffer.height = state.sphereSize;
  }

  function renderBackground() {
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.50, h * 0.45, w * 0.06, w * 0.50, h * 0.52, w * 0.78);
    bg.addColorStop(0, "rgba(24, 58, 70, 0.96)");
    bg.addColorStop(0.34, "rgba(8, 22, 38, 0.98)");
    bg.addColorStop(1, "rgba(1, 4, 13, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.42;

    for (let i = 0; i < 76; i += 1) {
      const x = hash(i + 11, 4, 700100) * w;
      const y = hash(i + 17, 7, 700900) * h;
      const r = (0.6 + hash(i, 9, 701700) * 1.5) * state.dpr;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(210, 248, 230, 0.13)";
      ctx.fill();
    }

    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = "rgba(158, 240, 191, 0.22)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.0012);

    for (let i = 0; i < 8; i += 1) {
      const y = h * (0.18 + i * 0.095);
      ctx.beginPath();
      ctx.moveTo(w * 0.08, y);
      ctx.bezierCurveTo(w * 0.28, y - 22 * state.dpr, w * 0.66, y + 18 * state.dpr, w * 0.92, y - 6 * state.dpr);
      ctx.stroke();
    }

    ctx.restore();
  }

  function renderSphere(now) {
    const texture = state.texture;
    if (!texture) return;

    const size = state.sphereSize;
    const radius = size * 0.5;
    const image = sphereCtx.createImageData(size, size);
    const out = image.data;

    const rotation = state.rotation;
    const tilt = state.tilt;
    const sinTilt = Math.sin(tilt);
    const cosTilt = Math.cos(tilt);
    const light = normalize3([-0.42, 0.32, 0.84]);
    const cloudDrift = now * 0.000025;

    for (let y = 0; y < size; y += 1) {
      const ny = (y - radius) / radius;

      for (let x = 0; x < size; x += 1) {
        const nx = (x - radius) / radius;
        const d2 = nx * nx + ny * ny;
        const index = (y * size + x) * 4;

        if (d2 > 1) {
          out[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - d2);
        const y3 = -ny * cosTilt - z * sinTilt;
        const z3 = -ny * sinTilt + z * cosTilt;
        const x3 = nx;

        const lat = Math.asin(clamp(y3, -1, 1));
        const lon = Math.atan2(x3, z3) + rotation;
        const color = sampleTexture(texture, lon, lat);
        const normal = normalize3([x3, y3, z3]);
        const lightDot = clamp(normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2], -1, 1);

        const daylight = 0.32 + Math.max(0, lightDot) * 0.86;
        const terminator = smoothstep(-0.46, 0.12, lightDot);
        const limb = Math.pow(1 - z, 1.75);
        const rim = Math.pow(1 - z, 3.0);
        const cloud = sampleCloud(lon, lat, cloudDrift) * smoothstep(-0.82, 0.56, lightDot) * 0.18;

        let r = color[0] * daylight;
        let g = color[1] * daylight;
        let b = color[2] * daylight;

        r = lerp(r * 0.46, r, terminator);
        g = lerp(g * 0.54, g, terminator);
        b = lerp(b * 0.72, b, terminator);

        r = lerp(r, COLORS.cloud[0], cloud);
        g = lerp(g, COLORS.cloud[1], cloud);
        b = lerp(b, COLORS.cloud[2], cloud);

        r = lerp(r, COLORS.atmosphere[0], limb * 0.24);
        g = lerp(g, COLORS.atmosphere[1], limb * 0.20);
        b = lerp(b, COLORS.atmosphere[2], limb * 0.26);

        r = lerp(r, COLORS.rim[0], rim * 0.35);
        g = lerp(g, COLORS.rim[1], rim * 0.30);
        b = lerp(b, COLORS.rim[2], rim * 0.34);

        out[index] = clamp(Math.round(r), 0, 255);
        out[index + 1] = clamp(Math.round(g), 0, 255);
        out[index + 2] = clamp(Math.round(b), 0, 255);
        out[index + 3] = clamp(Math.round(255 * smoothstep(1.005, 0.985, d2)), 0, 255);
      }
    }

    sphereCtx.putImageData(image, 0, 0);
  }

  function drawStageLabels() {
    const w = canvas.width;
    const h = canvas.height;
    const dpr = state.dpr;

    function roundedRect(context, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      context.beginPath();
      context.moveTo(x + r, y);
      context.arcTo(x + width, y, x + width, y + height, r);
      context.arcTo(x + width, y + height, x, y + height, r);
      context.arcTo(x, y + height, x, y, r);
      context.arcTo(x, y, x + width, y, r);
      context.closePath();
    }

    function pill(label, x, y, width) {
      const height = 34 * dpr;
      const radius = height / 2;

      ctx.save();
      ctx.fillStyle = "rgba(6, 16, 20, 0.74)";
      ctx.strokeStyle = "rgba(158, 240, 191, 0.30)";
      ctx.lineWidth = 1 * dpr;
      roundedRect(ctx, x, y, width, height, radius);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(205, 255, 228, 0.92)";
      ctx.font = `900 ${Math.max(10, 12 * dpr)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.08em";
      ctx.fillText(label, x + width / 2, y + height / 2 + 0.5 * dpr);
      ctx.restore();
    }

    const top = h * 0.81;
    pill(state.chainReady ? "ROUTEFINDER CHAIN ACTIVE" : "ROUTEFINDER VISIBLE FALLBACK", w * 0.50 - 156 * dpr, top, 312 * dpr);
    pill("AUDRALIA GLOBE CONTAINED", w * 0.50 - 150 * dpr, top + 48 * dpr, 300 * dpr);
  }

  function draw(now = performance.now()) {
    renderBackground();

    const glowR = state.radius * 1.30;
    const glow = ctx.createRadialGradient(state.cx, state.cy, state.radius * 0.48, state.cx, state.cy, glowR);
    glow.addColorStop(0, "rgba(158,240,191,0.03)");
    glow.addColorStop(0.52, "rgba(141,216,255,0.10)");
    glow.addColorStop(0.78, "rgba(158,240,191,0.12)");
    glow.addColorStop(1, "rgba(158,240,191,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, glowR, 0, TAU);
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.58;
    ctx.strokeStyle = "rgba(158,240,191,0.16)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.002);
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.025, 0, TAU);
    ctx.stroke();
    ctx.restore();

    renderSphere(now);

    const diameter = state.radius * 2;
    ctx.drawImage(sphereBuffer, state.cx - state.radius, state.cy - state.radius, diameter, diameter);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.24;
    const spec = ctx.createRadialGradient(
      state.cx - state.radius * 0.24,
      state.cy - state.radius * 0.38,
      0,
      state.cx - state.radius * 0.24,
      state.cy - state.radius * 0.38,
      state.radius * 0.74
    );
    spec.addColorStop(0, "rgba(255,255,255,0.62)");
    spec.addColorStop(0.22, "rgba(214,255,235,0.18)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = "rgba(243,200,111,0.20)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.0015);
    ctx.beginPath();
    ctx.ellipse(state.cx, state.cy, state.radius * 1.08, state.radius * 0.68, -0.08, 0, TAU);
    ctx.stroke();
    ctx.restore();

    drawStageLabels();
  }

  function pointerDown(event) {
    state.pointerActive = true;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startRotation = state.targetRotation;
    state.startTilt = state.targetTilt;
    canvas.style.cursor = "grabbing";

    if (event.cancelable) event.preventDefault();

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {}
  }

  function pointerMove(event) {
    if (!state.pointerActive) return;
    if (event.cancelable) event.preventDefault();

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    state.targetRotation = state.startRotation + dx * 0.010;
    state.targetTilt = clamp(state.startTilt + dy * 0.004, -0.56, 0.46);
  }

  function pointerUp(event) {
    state.pointerActive = false;
    canvas.style.cursor = "grab";

    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {}
  }

  function tick(now) {
    const dt = Math.min(64, now - state.lastTime);
    state.lastTime = now;

    if (!state.reducedMotion && !state.pointerActive) {
      state.targetRotation += dt * 0.000035;
    }

    state.rotation += (state.targetRotation - state.rotation) * 0.16;
    state.tilt += (state.targetTilt - state.tilt) * 0.14;

    if (state.visible && now - state.lastRenderTime > TEXTURE.targetFpsMs) {
      draw(now);
      state.lastRenderTime = now;
    }

    window.requestAnimationFrame(tick);
  }

  function handleResize() {
    resizeCanvas();
    draw();
  }

  function publishReceipt(phase) {
    const texture = state.texture || {};

    setDataset("audraliaRoutefinderLoaded", "true");
    setDataset("audraliaRoutefinderContract", CONTRACT);
    setDataset("audraliaRoutefinderReceipt", RECEIPT);
    setDataset("audraliaRoutefinderPreviousContract", PREVIOUS_CONTRACT);
    setDataset("audraliaRoutefinderPhase", phase);
    setDataset("audraliaRoutefinderTextureSource", state.textureSource);
    setDataset("audraliaRoutefinderTextureLandRatio", texture.landRatio ?? "pending");
    setDataset("audraliaRoutefinderTextureWaterRatio", texture.waterRatio ?? "pending");
    setDataset("audraliaRoutefinderHydrologyReads", texture.hydroReads ?? "pending");
    setDataset("audraliaRoutefinderSurfaceReads", texture.surfaceReads ?? "pending");
    setDataset("audraliaRoutefinderCanvasMounted", "true");
    setDataset("audraliaRoutefinderTouchScope", "box-only");
    setDataset("audraliaRoutefinderGeneratedImage", "false");
    setDataset("audraliaRoutefinderGraphicBox", "false");
    setDataset("audraliaRoutefinderVisualPassClaimed", "false");

    canvas.dataset.audraliaRoutefinderPhase = phase;
    canvas.dataset.audraliaTextureSource = state.textureSource;
    canvas.dataset.audraliaTextureLandRatio = String(texture.landRatio ?? "pending");
    canvas.dataset.audraliaTextureWaterRatio = String(texture.waterRatio ?? "pending");
  }

  function appendReceiptTemplate() {
    const prior = document.getElementById("audralia-routefinder-active-globe-render-bridge-receipt");
    if (prior) prior.remove();

    const receipt = document.createElement("template");
    receipt.id = "audralia-routefinder-active-globe-render-bridge-receipt";
    receipt.setAttribute("data-route-receipt", "");
    receipt.innerHTML = `
${CONTRACT}
receipt=${RECEIPT}
previous=${PREVIOUS_CONTRACT}
version=${VERSION}
route=${ROUTE}
world=${WORLD}
canonical_spelling=A_U_D_R_A_L_I_A
target_file=/showroom/globe/audralia/index.js
mount=#audraliaCanvasMount
purpose=active_route_renderer_consumes_renewed_audralia_asset_chain
routefinder=active_visual_bridge
chain=lattice256_to_landmap_to_topology_to_elevation_to_hydrology_to_land_surface_to_routefinder_texture_to_canvas_draw
visible_fallback=true
asset_chain_rebuild=true
organic_landform=true
hydrology_visible=true
ocean_dominant=true
coastline_breakup=true
bays_inlets_corridors=true
archipelago_support=true
inland_water_support=true
surface_reads_enabled=true
touch_scope=box_only
box_containment=true
generated_image=false
graphic_box=false
visual_pass_claimed=false
`;
    document.body.appendChild(receipt);
  }

  async function boot() {
    setNotice("RouteFinder visible fallback active");
    setStatus("Restoring Audralia globe image");

    resizeCanvas();

    state.texture = buildTexture(TEXTURE.fallbackWidth, TEXTURE.fallbackHeight, "routefinder-visible-fallback");
    state.textureSource = "routefinder-visible-fallback";
    publishReceipt("fallback-texture-ready");
    draw();
    window.requestAnimationFrame(tick);

    await ensureAssets();

    setNotice("RouteFinder chain texture building");
    setStatus("Sampling Audralia authorities");

    state.texture = buildTexture(TEXTURE.width, TEXTURE.height, "asset-chain-routefinder-texture");
    state.textureSource = "asset-chain-routefinder-texture";
    state.chainReady = true;

    publishReceipt("asset-chain-texture-ready");
    appendReceiptTemplate();

    setNotice("RouteFinder chain active");
    setStatus("Audralia globe contained");

    draw();
  }

  window.AUDRALIA_ROUTEFINDER = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    world: WORLD,
    sampleMap,
    sampleHydrology,
    buildTexture,
    getStatus: () => Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      world: WORLD,
      mounted: true,
      chainReady: state.chainReady,
      textureSource: state.textureSource,
      assetStatus: state.assetStatus,
      texture: state.texture
        ? {
            width: state.texture.width,
            height: state.texture.height,
            source: state.texture.source,
            landRatio: state.texture.landRatio,
            waterRatio: state.texture.waterRatio
          }
        : null,
      routefinder: "active_visual_bridge",
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    })
  });

  window.AUDRALIA_ROUTEFINDER_RECEIPT = window.AUDRALIA_ROUTEFINDER.getStatus();

  canvas.addEventListener("pointerdown", pointerDown, { passive: false });
  canvas.addEventListener("pointermove", pointerMove, { passive: false });
  canvas.addEventListener("pointerup", pointerUp, { passive: true });
  canvas.addEventListener("pointercancel", pointerUp, { passive: true });
  canvas.addEventListener("lostpointercapture", pointerUp, { passive: true });

  window.addEventListener("resize", handleResize, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        state.visible = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);
  }

  boot().catch((error) => {
    setDataset("audraliaRoutefinderBootError", error instanceof Error ? error.message : String(error));
    setNotice("RouteFinder fallback retained");
    setStatus("Audralia globe contained");

    if (!state.texture) {
      state.texture = buildTexture(TEXTURE.fallbackWidth, TEXTURE.fallbackHeight, "routefinder-error-fallback");
      state.textureSource = "routefinder-error-fallback";
    }

    publishReceipt("boot-error-fallback-retained");
    draw();
  });
})();
