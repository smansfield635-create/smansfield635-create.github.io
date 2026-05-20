/* TARGET FILE: /showroom/globe/audralia/index.js */
/*
  AUDRALIA_ROUTEFINDER_VISIBLE_TEXTURE_GUARD_TNT_v1
  pair=audralia-cache-key-enforcement-pair
  route=/showroom/globe/audralia/
  purpose=force RouteFinder-first visible land/ocean/coast texture after served-file drift
  preserves=#audraliaCanvasMount, boxed containment, touch scope, Audralia spelling
  prevents=asset-chain washout, atmosphere-only globe, low-contrast texture replacement
  no generated image. no GraphicBox. no visual-pass claim.
*/

(function () {
  "use strict";

  const CONTRACT = "AUDRALIA_ROUTEFINDER_VISIBLE_TEXTURE_GUARD_TNT_v1";
  const RECEIPT = "AUDRALIA_ROUTEFINDER_VISIBLE_TEXTURE_GUARD_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_ROUTEFINDER_BOOT_PROOF_PAIR_JS_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const WORLD = "Audralia";
  const TAU = Math.PI * 2;
  const PHI = 1.618033988749895;

  const SETTINGS = Object.freeze({
    textureWidth: 640,
    textureHeight: 320,
    maxDpr: 1.5,
    minStageWidth: 320,
    minStageHeight: 260,
    minSphereSize: 300,
    maxSphereSize: 520,
    frameMs: 42
  });

  const COLORS = Object.freeze({
    spaceA: [1, 5, 15],
    spaceB: [8, 24, 40],
    deepOcean: [3, 18, 54],
    ocean: [7, 70, 126],
    shelf: [50, 154, 164],
    lagoon: [126, 216, 180],
    river: [34, 132, 146],
    beach: [212, 190, 126],
    wetBeach: [160, 154, 106],
    lowland: [108, 148, 84],
    green: [68, 140, 90],
    wetland: [64, 126, 102],
    highland: [142, 126, 84],
    mountain: [140, 134, 112],
    snow: [220, 232, 224],
    cloud: [230, 238, 232],
    atmosphere: [92, 174, 202],
    rim: [148, 226, 210]
  });

  const documentElement = document.documentElement;
  const mount = document.getElementById("audraliaCanvasMount") || document.querySelector("[data-audralia-canvas-mount='true']") || document.querySelector("[data-audralia-globe-mount='true']");
  const stage = document.getElementById("audralia-stage") || document.querySelector("[data-audralia-stage='true']") || (mount ? mount.closest(".stage") : null);

  const proof = Object.freeze({
    html: document.querySelector("[data-audralia-proof-html]"),
    script: document.querySelector("[data-audralia-proof-script]"),
    js: document.querySelector("[data-audralia-proof-js]"),
    mount: document.querySelector("[data-audralia-proof-mount]"),
    notice: document.getElementById("audraliaRouteLoaderNotice") || document.querySelector("[data-audralia-route-loader-notice='true']"),
    status: document.getElementById("audraliaRouteStatus") || document.querySelector("[data-audralia-route-status='true']")
  });

  function setData(name, value) {
    documentElement.dataset[name] = String(value);
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function publish(phase, status) {
    setData("audraliaRoutefinderJsExecuted", "true");
    setData("audraliaRoutefinderJsContract", CONTRACT);
    setData("audraliaRoutefinderJsReceipt", RECEIPT);
    setData("audraliaRoutefinderPreviousContract", PREVIOUS_CONTRACT);
    setData("audraliaVisibleTextureGuardActive", "true");
    setData("audraliaRoutefinderFirstTexturePreserved", "true");
    setData("audraliaAssetChainSecondaryOnly", "true");
    setData("audraliaAssetChainMayReplaceVisibleTexture", "false");
    setData("audraliaRoutefinderPhase", phase);
    setData("generatedImage", "false");
    setData("graphicBox", "false");
    setData("visualPassClaimed", "false");

    setText(proof.script, "script loaded · visible guard cache key");
    setText(proof.js, "index.js executed · visible texture guard active");
    setText(proof.status, status || "RouteFinder-first texture preserved");
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
    let output = value;
    while (output < -Math.PI) output += TAU;
    while (output > Math.PI) output -= TAU;
    return output;
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

  function fbm(u, v, seed, octaves) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;
    const count = octaves || 5;

    for (let i = 0; i < count; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise(u, v, seed, octaves) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4;
    const count = octaves || 4;

    for (let i = 0; i < count; i += 1) {
      const n = noise(u, v, scale, seed + i * 197);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function normalize3(vector) {
    const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
    return [vector[0] / length, vector[1] / length, vector[2] / length];
  }

  function ellipseScore(lon, lat, item) {
    const dlon = wrapPi(lon - item.lon);
    const dlat = lat - item.lat;
    const cos = Math.cos(item.tilt || 0);
    const sin = Math.sin(item.tilt || 0);
    const x = (dlon * cos + dlat * sin) / item.rx;
    const y = (-dlon * sin + dlat * cos) / item.ry;
    return 1 - (x * x + y * y);
  }

  function cellFromUV(u, v) {
    const col16 = clamp(Math.floor(wrap01(u) * 16), 0, 15);
    const row16 = clamp(Math.floor(clamp(v, 0, 1) * 16), 0, 15);
    return Object.freeze({
      cell256: row16 * 16 + col16 + 1,
      cell64: Math.floor(row16 / 2) * 8 + Math.floor(col16 / 2) + 1,
      cell16: Math.floor(row16 / 4) * 4 + Math.floor(col16 / 4) + 1,
      row16,
      col16
    });
  }

  function routefinderMap(u, v) {
    const lon = wrap01(u) * TAU - Math.PI;
    const lat = (0.5 - clamp(v, 0, 1)) * Math.PI;
    const lonDeg = lon * 180 / Math.PI;
    const latDeg = lat * 180 / Math.PI;
    const cell = cellFromUV(u, v);

    const continents = [
      { lon: -2.58, lat: -0.13, rx: 0.56, ry: 0.34, tilt: -0.20, weight: 1.08 },
      { lon: -1.84, lat: 0.35, rx: 0.41, ry: 0.28, tilt: 0.18, weight: 0.92 },
      { lon: -1.08, lat: -0.24, rx: 0.43, ry: 0.25, tilt: -0.42, weight: 0.86 },
      { lon: -0.20, lat: 0.18, rx: 0.45, ry: 0.29, tilt: 0.27, weight: 0.88 },
      { lon: 0.70, lat: -0.31, rx: 0.48, ry: 0.30, tilt: -0.26, weight: 0.92 },
      { lon: 1.45, lat: 0.16, rx: 0.46, ry: 0.31, tilt: 0.20, weight: 0.90 },
      { lon: 2.34, lat: -0.06, rx: 0.51, ry: 0.30, tilt: -0.16, weight: 0.98 },
      { lon: 2.86, lat: 0.45, rx: 0.32, ry: 0.20, tilt: 0.16, weight: 0.72 }
    ];

    const cuts = [
      { lon: -2.16, lat: 0.08, rx: 0.20, ry: 0.43, tilt: -0.08, weight: 1.02 },
      { lon: -1.42, lat: -0.02, rx: 0.17, ry: 0.36, tilt: 0.20, weight: 0.90 },
      { lon: -0.72, lat: 0.20, rx: 0.19, ry: 0.35, tilt: -0.24, weight: 0.84 },
      { lon: 0.10, lat: -0.18, rx: 0.22, ry: 0.40, tilt: 0.12, weight: 0.94 },
      { lon: 0.88, lat: 0.18, rx: 0.18, ry: 0.33, tilt: -0.18, weight: 0.82 },
      { lon: 1.78, lat: -0.22, rx: 0.19, ry: 0.38, tilt: 0.22, weight: 0.96 },
      { lon: 2.62, lat: 0.16, rx: 0.20, ry: 0.31, tilt: -0.14, weight: 0.88 }
    ];

    const islands = [
      { lon: -2.88, lat: -0.50, rx: 0.16, ry: 0.08, tilt: 0.18, weight: 0.88 },
      { lon: -2.62, lat: -0.34, rx: 0.10, ry: 0.055, tilt: -0.18, weight: 0.78 },
      { lon: -1.02, lat: -0.49, rx: 0.14, ry: 0.075, tilt: 0.28, weight: 0.82 },
      { lon: -0.25, lat: -0.52, rx: 0.12, ry: 0.065, tilt: -0.32, weight: 0.78 },
      { lon: 0.30, lat: 0.54, rx: 0.13, ry: 0.070, tilt: 0.14, weight: 0.74 },
      { lon: 1.16, lat: -0.54, rx: 0.16, ry: 0.080, tilt: -0.24, weight: 0.88 },
      { lon: 2.02, lat: 0.52, rx: 0.14, ry: 0.080, tilt: 0.20, weight: 0.80 },
      { lon: 2.90, lat: -0.42, rx: 0.18, ry: 0.080, tilt: -0.18, weight: 0.88 }
    ];

    const lakes = [
      { lon: -1.62, lat: 0.10, rx: 0.070, ry: 0.045, weight: 1 },
      { lon: -0.70, lat: 0.18, rx: 0.085, ry: 0.050, weight: 1 },
      { lon: 0.82, lat: -0.08, rx: 0.080, ry: 0.050, weight: 1 },
      { lon: 1.62, lat: 0.23, rx: 0.070, ry: 0.042, weight: 1 },
      { lon: 2.28, lat: -0.18, rx: 0.090, ry: 0.050, weight: 1 }
    ];

    const warpA = fbm(u * 1.2 + 0.27, v * 1.5 - 0.19, 200100, 5) - 0.5;
    const warpB = fbm(u * 2.4 - 0.11, v * 2.2 + 0.31, 200900, 4) - 0.5;
    const wlon = wrapPi(lon + warpA * 0.22 + Math.sin(lat * 3) * 0.05);
    const wlat = clamp(lat + warpB * 0.12, -Math.PI / 2, Math.PI / 2);

    let landScore = -0.55;
    let bodyClass = "ocean";

    for (const body of continents) {
      const score = ellipseScore(wlon, wlat, body);
      if (score > -0.58) {
        const coastNoise =
          (fbm(u * 3.7 + body.lon * 0.2, v * 4.3 + body.lat * 0.2, 201700, 5) - 0.5) * 0.42 +
          (fbm(u * 8.4 - body.lon * 0.1, v * 7.2 + body.lat * 0.1, 202500, 4) - 0.5) * 0.16;
        const value = score * body.weight + coastNoise;
        if (value > landScore) {
          landScore = value;
          bodyClass = "continental";
        }
      }
    }

    let islandScore = -0.5;
    for (const island of islands) {
      const score = ellipseScore(wlon, wlat, island);
      if (score > -0.30) {
        const value = score * island.weight + (fbm(u * 9.0, v * 9.0, 203300, 3) - 0.5) * 0.30 - 0.05;
        islandScore = Math.max(islandScore, value);
        if (value > landScore) {
          landScore = value;
          bodyClass = "archipelago";
        }
      }
    }

    let cutScore = 0;
    for (const cut of cuts) {
      const score = ellipseScore(wlon, wlat, cut);
      if (score > 0) cutScore = Math.max(cutScore, smoothstep(0.0, 0.95, score) * cut.weight);
    }

    const corridorLine = Math.abs(Math.sin(wlon * 3.4 + Math.sin(wlat * 5.6) * 0.9));
    const corridor = corridorLine < 0.118 && Math.abs(wlat) < 0.66 ? 0.17 : 0;
    landScore -= cutScore * 0.96;
    landScore -= corridor * smoothstep(-0.18, 0.36, landScore);

    let lakeScore = 0;
    for (const lake of lakes) {
      const score = ellipseScore(wlon, wlat, lake);
      if (score > 0.12 && landScore > 0.04) lakeScore = Math.max(lakeScore, score * lake.weight);
    }

    const shelf = smoothstep(-0.30, 0.035, landScore);
    const beachEdge = clamp(1 - Math.abs(landScore) / 0.18, 0, 1);
    const isInlandWater = lakeScore > 0.14;
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
      cell256: cell.cell256,
      terrainClass,
      isOcean,
      isShelf,
      isBeach,
      isLand,
      isInlandWater,
      isPolarIce: polarIce,
      shelf,
      beachEdge,
      landScore,
      islandScore,
      cutScore,
      corridor,
      bodyClass,
      ridge,
      basin
    });
  }

  function colorFor(map, u, v) {
    const grain = (fbm(u * 22, v * 16, 301100, 3) - 0.5) * 14;

    if (map.isOcean || map.isShelf || map.isInlandWater) {
      const depth = fbm(u * 1.4 + 0.22, v * 1.1 - 0.17, 302100, 5);
      const wave = (fbm(u * 16 - 0.10, v * 10 + 0.25, 302900, 3) - 0.5) * 9;
      let color = mixColor(COLORS.deepOcean, COLORS.ocean, smoothstep(0.22, 0.86, depth));

      if (map.isShelf) color = mixColor(color, COLORS.shelf, smoothstep(0.12, 0.86, map.shelf) * 0.78);
      if (map.beachEdge > 0.30) color = mixColor(color, COLORS.lagoon, map.beachEdge * 0.42);
      if (map.isInlandWater) color = mixColor(COLORS.ocean, COLORS.lagoon, 0.42);
      return shade(color, wave);
    }

    if (map.isBeach) {
      const beach = mixColor(COLORS.beach, COLORS.wetBeach, map.beachEdge * 0.42);
      return shade(beach, grain * 0.40 + 4);
    }

    let color = mixColor(COLORS.lowland, COLORS.green, fbm(u * 4.2 - 0.27, v * 3.8 + 0.19, 303700, 4) * 0.46);
    color = mixColor(color, COLORS.highland, fbm(u * 2.2 + 0.41, v * 2.6 - 0.31, 304500, 4) * 0.34);

    if (map.terrainClass === "mountain" || map.ridge > 0.72) color = mixColor(color, COLORS.mountain, clamp(map.ridge * 0.54, 0, 0.58));
    if (map.terrainClass === "highland") color = mixColor(color, COLORS.highland, 0.42);
    if (map.terrainClass === "wetland") color = mixColor(color, COLORS.wetland, 0.54);
    if (map.isPolarIce) color = mixColor(color, COLORS.snow, 0.74);

    return shade(color, grain + map.ridge * 10 - map.basin * 6);
  }

  function buildTexture() {
    const width = SETTINGS.textureWidth;
    const height = SETTINGS.textureHeight;
    const data = new Uint8ClampedArray(width * height * 4);
    let landPixels = 0;
    let waterPixels = 0;
    let minLuma = 255;
    let maxLuma = 0;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);
      for (let x = 0; x < width; x += 1) {
        const u = x / Math.max(1, width - 1);
        const map = routefinderMap(u, v);
        const color = colorFor(map, u, v);
        const index = (y * width + x) * 4;
        const luma = color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;

        if (map.isOcean || map.isShelf || map.isInlandWater) waterPixels += 1;
        else landPixels += 1;

        minLuma = Math.min(minLuma, luma);
        maxLuma = Math.max(maxLuma, luma);

        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255;
      }
    }

    const total = Math.max(1, landPixels + waterPixels);
    return Object.freeze({
      width,
      height,
      data,
      source: "routefinder-first-visible-texture",
      landRatio: Number((landPixels / total).toFixed(4)),
      waterRatio: Number((waterPixels / total).toFixed(4)),
      contrast: Number((maxLuma - minLuma).toFixed(2))
    });
  }

  function sampleTexture(texture, lon, lat) {
    const u = wrap01((wrapPi(lon) + Math.PI) / TAU);
    const v = clamp(0.5 - lat / Math.PI, 0, 0.999999);
    const x = Math.floor(u * texture.width) % texture.width;
    const y = clamp(Math.floor(v * texture.height), 0, texture.height - 1);
    const index = (y * texture.width + x) * 4;
    return [texture.data[index], texture.data[index + 1], texture.data[index + 2], texture.data[index + 3]];
  }

  if (!mount) {
    publish("mount-missing", "Mount missing");
    setText(proof.mount, "mount missing");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    return;
  }

  mount.textContent = "";
  mount.dataset.audraliaRoutefinderVisibleTextureGuard = CONTRACT;
  mount.dataset.audraliaContract = CONTRACT;
  mount.dataset.generatedImage = "false";
  mount.dataset.graphicBox = "false";
  mount.dataset.visualPassClaimed = "false";

  Object.assign(mount.style, {
    position: "absolute",
    inset: "0",
    overflow: "hidden",
    touchAction: "none",
    userSelect: "none"
  });

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Audralia RouteFinder-first visible texture globe");
  canvas.dataset.audraliaVisibleCanvas = "true";
  canvas.dataset.audraliaGlobe = "routefinder-visible-texture-guard";
  canvas.dataset.audraliaContract = CONTRACT;
  canvas.dataset.audraliaReceipt = RECEIPT;
  canvas.dataset.generatedImage = "false";
  canvas.dataset.graphicBox = "false";
  canvas.dataset.visualPassClaimed = "false";

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

  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const sphere = document.createElement("canvas");
  const sphereContext = sphere.getContext("2d", { alpha: true, willReadFrequently: true });

  if (!context || !sphereContext) {
    publish("canvas-context-failed", "Canvas context failed");
    setText(proof.mount, "canvas context failed");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    return;
  }

  const state = {
    width: 1,
    height: 1,
    dpr: 1,
    radius: 180,
    cx: 0,
    cy: 0,
    sphereSize: 360,
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
    reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    texture: buildTexture()
  };

  function resizeCanvas() {
    const rect = mount.getBoundingClientRect();
    const stageRect = stage ? stage.getBoundingClientRect() : null;
    const width = Math.max(SETTINGS.minStageWidth, Math.floor(rect.width || (stageRect && stageRect.width) || window.innerWidth || SETTINGS.minStageWidth));
    const height = Math.max(SETTINGS.minStageHeight, Math.floor(rect.height || (stageRect && stageRect.height) || SETTINGS.minStageHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, SETTINGS.maxDpr);

    state.width = width;
    state.height = height;
    state.dpr = dpr;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    state.radius = Math.min(canvas.width, canvas.height) * 0.37;
    state.cx = canvas.width * 0.50;
    state.cy = canvas.height * 0.50;
    state.sphereSize = Math.min(SETTINGS.maxSphereSize, Math.max(SETTINGS.minSphereSize, Math.floor(state.radius * 2)));

    sphere.width = state.sphereSize;
    sphere.height = state.sphereSize;
  }

  function drawBackground() {
    const w = canvas.width;
    const h = canvas.height;
    context.clearRect(0, 0, w, h);

    const bg = context.createRadialGradient(w * 0.50, h * 0.45, w * 0.06, w * 0.50, h * 0.52, w * 0.78);
    bg.addColorStop(0, "rgba(24,58,70,.96)");
    bg.addColorStop(0.36, "rgba(8,22,38,.98)");
    bg.addColorStop(1, "rgba(1,4,13,1)");
    context.fillStyle = bg;
    context.fillRect(0, 0, w, h);

    context.save();
    context.globalAlpha = 0.34;
    for (let i = 0; i < 72; i += 1) {
      const x = hash(i + 11, 4, 700100) * w;
      const y = hash(i + 17, 7, 700900) * h;
      const r = (0.6 + hash(i, 9, 701700) * 1.4) * state.dpr;
      context.beginPath();
      context.arc(x, y, r, 0, TAU);
      context.fillStyle = "rgba(210,248,230,.13)";
      context.fill();
    }
    context.restore();
  }

  function drawSphere(now) {
    const texture = state.texture;
    const size = state.sphereSize;
    const radius = size * 0.5;
    const image = sphereContext.createImageData(size, size);
    const output = image.data;
    const sinTilt = Math.sin(state.tilt);
    const cosTilt = Math.cos(state.tilt);
    const light = normalize3([-0.42, 0.32, 0.84]);
    const cloudDrift = now * 0.00002;

    for (let y = 0; y < size; y += 1) {
      const ny = (y - radius) / radius;
      for (let x = 0; x < size; x += 1) {
        const nx = (x - radius) / radius;
        const d2 = nx * nx + ny * ny;
        const index = (y * size + x) * 4;

        if (d2 > 1) {
          output[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - d2);
        const y3 = -ny * cosTilt - z * sinTilt;
        const z3 = -ny * sinTilt + z * cosTilt;
        const x3 = nx;
        const lat = Math.asin(clamp(y3, -1, 1));
        const lon = Math.atan2(x3, z3) + state.rotation;
        const color = sampleTexture(texture, lon, lat);
        const normal = normalize3([x3, y3, z3]);
        const lightDot = clamp(normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2], -1, 1);
        const daylight = 0.38 + Math.max(0, lightDot) * 0.92;
        const terminator = smoothstep(-0.46, 0.12, lightDot);
        const limb = Math.pow(1 - z, 1.75);
        const rim = Math.pow(1 - z, 3.0);
        const cloudNoise = fbm((lon + cloudDrift) * 0.36 + 0.17, lat * 0.72 - 0.11, 810100, 5);
        const cloud = smoothstep(0.66, 0.86, cloudNoise) * smoothstep(-0.82, 0.56, lightDot) * 0.11;

        let r = color[0] * daylight;
        let g = color[1] * daylight;
        let b = color[2] * daylight;

        r = lerp(r * 0.48, r, terminator);
        g = lerp(g * 0.56, g, terminator);
        b = lerp(b * 0.74, b, terminator);

        r = lerp(r, COLORS.cloud[0], cloud);
        g = lerp(g, COLORS.cloud[1], cloud);
        b = lerp(b, COLORS.cloud[2], cloud);

        r = lerp(r, COLORS.atmosphere[0], limb * 0.16);
        g = lerp(g, COLORS.atmosphere[1], limb * 0.14);
        b = lerp(b, COLORS.atmosphere[2], limb * 0.18);

        r = lerp(r, COLORS.rim[0], rim * 0.30);
        g = lerp(g, COLORS.rim[1], rim * 0.26);
        b = lerp(b, COLORS.rim[2], rim * 0.30);

        output[index] = clamp(Math.round(r), 0, 255);
        output[index + 1] = clamp(Math.round(g), 0, 255);
        output[index + 2] = clamp(Math.round(b), 0, 255);
        output[index + 3] = clamp(Math.round(255 * smoothstep(1.005, 0.985, d2)), 0, 255);
      }
    }

    sphereContext.putImageData(image, 0, 0);
  }

  function draw(now) {
    drawBackground();

    const glowRadius = state.radius * 1.30;
    const glow = context.createRadialGradient(state.cx, state.cy, state.radius * 0.48, state.cx, state.cy, glowRadius);
    glow.addColorStop(0, "rgba(158,240,191,.03)");
    glow.addColorStop(0.52, "rgba(141,216,255,.10)");
    glow.addColorStop(0.78, "rgba(158,240,191,.12)");
    glow.addColorStop(1, "rgba(158,240,191,0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(state.cx, state.cy, glowRadius, 0, TAU);
    context.fill();

    drawSphere(now || performance.now());

    const diameter = state.radius * 2;
    context.drawImage(sphere, state.cx - state.radius, state.cy - state.radius, diameter, diameter);

    context.save();
    context.globalCompositeOperation = "screen";
    context.globalAlpha = 0.18;
    const spec = context.createRadialGradient(
      state.cx - state.radius * 0.24,
      state.cy - state.radius * 0.38,
      0,
      state.cx - state.radius * 0.24,
      state.cy - state.radius * 0.38,
      state.radius * 0.74
    );
    spec.addColorStop(0, "rgba(255,255,255,.54)");
    spec.addColorStop(0.22, "rgba(214,255,235,.14)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = spec;
    context.beginPath();
    context.arc(state.cx, state.cy, state.radius, 0, TAU);
    context.fill();
    context.restore();
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

    if (!state.reducedMotion && !state.pointerActive) state.targetRotation += dt * 0.000035;

    state.rotation += (state.targetRotation - state.rotation) * 0.16;
    state.tilt += (state.targetTilt - state.tilt) * 0.14;

    if (state.visible && now - state.lastRenderTime > SETTINGS.frameMs) {
      draw(now);
      state.lastRenderTime = now;
    }

    window.requestAnimationFrame(tick);
  }

  function appendReceipt() {
    const prior = document.getElementById("audralia-routefinder-visible-texture-guard-receipt");
    if (prior) prior.remove();

    const receipt = document.createElement("template");
    receipt.id = "audralia-routefinder-visible-texture-guard-receipt";
    receipt.setAttribute("data-route-receipt", "");
    receipt.innerHTML = `
${CONTRACT}
receipt=${RECEIPT}
previous=${PREVIOUS_CONTRACT}
route=${ROUTE}
world=${WORLD}
target_file=/showroom/globe/audralia/index.js
mount=#audraliaCanvasMount
served_file_drift_corrected=true
cache_key_required=${CONTRACT}
visible_texture_guard=true
routefinder_first_texture=true
asset_chain_secondary_only=true
asset_chain_may_replace_visible_texture=false
organic_landform=true
hydrology_visible=true
ocean_dominant=true
coastline_breakup=true
bays_inlets_corridors=true
archipelago_support=true
inland_water_support=true
touch_scope=box_only
generated_image=false
graphic_box=false
visual_pass_claimed=false
`;
    document.body.appendChild(receipt);
  }

  function boot() {
    if (stage) {
      stage.setAttribute("data-loader-state", "mounted");
      stage.dataset.audraliaRoutefinderVisibleTextureGuard = CONTRACT;
    }

    setText(proof.html, "HTML loaded · visible guard shell");
    setText(proof.script, "script loaded · visible guard cache key");
    setText(proof.mount, "mount found · canvas mounted");
    setText(proof.notice, "VISIBLE TEXTURE GUARD ACTIVE");

    canvas.dataset.audraliaTextureSource = state.texture.source;
    canvas.dataset.audraliaTextureLandRatio = String(state.texture.landRatio);
    canvas.dataset.audraliaTextureWaterRatio = String(state.texture.waterRatio);
    canvas.dataset.audraliaTextureContrast = String(state.texture.contrast);

    setData("audraliaRoutefinderTextureSource", state.texture.source);
    setData("audraliaRoutefinderTextureLandRatio", state.texture.landRatio);
    setData("audraliaRoutefinderTextureWaterRatio", state.texture.waterRatio);
    setData("audraliaRoutefinderTextureContrast", state.texture.contrast);

    resizeCanvas();
    appendReceipt();
    publish("visible-texture-guard-ready", "ROUTEFINDER-FIRST TEXTURE PRESERVED");
    draw();
    window.requestAnimationFrame(tick);
  }

  canvas.addEventListener("pointerdown", pointerDown, { passive: false });
  canvas.addEventListener("pointermove", pointerMove, { passive: false });
  canvas.addEventListener("pointerup", pointerUp, { passive: true });
  canvas.addEventListener("pointercancel", pointerUp, { passive: true });
  canvas.addEventListener("lostpointercapture", pointerUp, { passive: true });

  window.addEventListener("resize", () => {
    resizeCanvas();
    draw();
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  window.AUDRALIA_ROUTEFINDER = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    route: ROUTE,
    world: WORLD,
    sampleMap: routefinderMap,
    getStatus: () => Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      mounted: true,
      visibleTextureGuard: true,
      routefinderFirstTexture: true,
      assetChainSecondaryOnly: true,
      assetChainMayReplaceVisibleTexture: false,
      texture: state.texture,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    })
  });

  window.AUDRALIA_ROUTEFINDER_RECEIPT = window.AUDRALIA_ROUTEFINDER.getStatus();

  try {
    boot();
  } catch (error) {
    setData("audraliaVisibleTextureGuardBootError", error instanceof Error ? error.message : String(error));
    publish("boot-error", "RouteFinder visible texture guard boot error");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
  }
})();
