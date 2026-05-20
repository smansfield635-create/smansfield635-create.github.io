/* TARGET FILE: /showroom/globe/audralia/index.js */
/*
  AUDRALIA_ROUTEFINDER_SURFACE_TEXTURE_VISIBILITY_OVERRIDE_TNT_v1
  Full-file replacement.
  Purpose: force readable land / ocean / shelf / beach / mountain texture after atmosphere-only washout.
  Scope: route renderer only. Asset chain remains secondary and may not replace the visible texture.
  No generated image. No GraphicBox. No visual-pass claim.
*/

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_ROUTEFINDER_SURFACE_TEXTURE_VISIBILITY_OVERRIDE_TNT_v1";
  const RECEIPT = "AUDRALIA_ROUTEFINDER_SURFACE_TEXTURE_VISIBILITY_OVERRIDE_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_ROUTEFINDER_VISIBLE_TEXTURE_GUARD_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const WORLD = "Audralia";
  const TAU = Math.PI * 2;
  const PHI = 1.618033988749895;

  const TEX_W = 640;
  const TEX_H = 320;

  const COLORS = Object.freeze({
    deepOcean: [2, 18, 58],
    ocean: [8, 78, 134],
    shelf: [50, 160, 172],
    lagoon: [126, 218, 180],
    beach: [220, 198, 126],
    wetBeach: [166, 156, 100],
    lowland: [108, 154, 82],
    forest: [54, 134, 82],
    wetland: [64, 132, 104],
    highland: [148, 128, 86],
    mountain: [148, 140, 116],
    snow: [224, 234, 226],
    cloud: [232, 240, 232],
    atmosphere: [92, 172, 204],
    rim: [148, 226, 210]
  });

  const LAND_BODIES = Object.freeze([
    { lon: -0.92, lat: 0.10, rx: 0.74, ry: 0.45, tilt: -0.16, weight: 1.20 },
    { lon: -1.58, lat: 0.35, rx: 0.42, ry: 0.27, tilt: 0.24, weight: 0.88 },
    { lon: -1.42, lat: -0.31, rx: 0.37, ry: 0.24, tilt: -0.38, weight: 0.82 },
    { lon: 0.72, lat: -0.28, rx: 0.54, ry: 0.32, tilt: -0.25, weight: 0.94 },
    { lon: 1.56, lat: 0.18, rx: 0.48, ry: 0.32, tilt: 0.20, weight: 0.92 },
    { lon: 2.38, lat: -0.06, rx: 0.52, ry: 0.30, tilt: -0.12, weight: 0.96 },
    { lon: -2.58, lat: -0.10, rx: 0.48, ry: 0.30, tilt: 0.14, weight: 0.88 }
  ]);

  const OCEAN_CUTS = Object.freeze([
    { lon: -0.95, lat: 0.04, rx: 0.17, ry: 0.48, tilt: -0.10, weight: 1.08 },
    { lon: -0.52, lat: 0.22, rx: 0.18, ry: 0.36, tilt: 0.28, weight: 0.86 },
    { lon: -1.28, lat: -0.08, rx: 0.17, ry: 0.35, tilt: -0.24, weight: 0.82 },
    { lon: 0.10, lat: -0.18, rx: 0.22, ry: 0.40, tilt: 0.12, weight: 0.92 },
    { lon: 1.82, lat: -0.22, rx: 0.19, ry: 0.38, tilt: 0.22, weight: 0.94 }
  ]);

  const ISLANDS = Object.freeze([
    { lon: -2.88, lat: -0.50, rx: 0.16, ry: 0.08, tilt: 0.18, weight: 0.88 },
    { lon: -1.02, lat: -0.52, rx: 0.14, ry: 0.075, tilt: 0.28, weight: 0.82 },
    { lon: 0.30, lat: 0.54, rx: 0.13, ry: 0.07, tilt: 0.14, weight: 0.74 },
    { lon: 1.16, lat: -0.54, rx: 0.16, ry: 0.08, tilt: -0.24, weight: 0.88 },
    { lon: 2.02, lat: 0.52, rx: 0.14, ry: 0.08, tilt: 0.20, weight: 0.80 }
  ]);

  const LAKES = Object.freeze([
    { lon: -1.03, lat: 0.13, rx: 0.075, ry: 0.045 },
    { lon: -0.62, lat: -0.06, rx: 0.09, ry: 0.052 },
    { lon: 0.82, lat: -0.08, rx: 0.08, ry: 0.05 },
    { lon: 1.62, lat: 0.23, rx: 0.07, ry: 0.042 }
  ]);

  const mount =
    document.getElementById("audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount='true']") ||
    document.querySelector("[data-audralia-globe-mount='true']");

  const stage =
    document.getElementById("audralia-stage") ||
    document.querySelector("[data-audralia-stage='true']") ||
    (mount ? mount.closest(".stage") : null);

  const proof = {
    html: document.querySelector("[data-audralia-proof-html]"),
    script: document.querySelector("[data-audralia-proof-script]"),
    js: document.querySelector("[data-audralia-proof-js]"),
    mount: document.querySelector("[data-audralia-proof-mount]"),
    notice: document.getElementById("audraliaRouteLoaderNotice") || document.querySelector("[data-audralia-route-loader-notice='true']"),
    status: document.getElementById("audraliaRouteStatus") || document.querySelector("[data-audralia-route-status='true']")
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(a, b, x) {
    const t = clamp((x - a) / Math.max(0.000001, b - a), 0, 1);
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

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function contrast(color, factor, pivot = 112) {
    return [
      clamp(Math.round((color[0] - pivot) * factor + pivot), 0, 255),
      clamp(Math.round((color[1] - pivot) * factor + pivot), 0, 255),
      clamp(Math.round((color[2] - pivot) * factor + pivot), 0, 255)
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
    let scale = 4;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 197);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.5;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function normal3(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return [x / length, y / length, z / length];
  }

  function ellipse(lon, lat, item) {
    const dlon = wrapPi(lon - item.lon);
    const dlat = lat - item.lat;
    const c = Math.cos(item.tilt || 0);
    const s = Math.sin(item.tilt || 0);
    const x = (dlon * c + dlat * s) / item.rx;
    const y = (-dlon * s + dlat * c) / item.ry;
    return 1 - x * x - y * y;
  }

  function mapAt(u, v) {
    const lon = wrap01(u) * TAU - Math.PI;
    const lat = (0.5 - clamp(v, 0, 1)) * Math.PI;
    const latDeg = lat * 180 / Math.PI;
    const warpLon = wrapPi(lon + (fbm(u * 1.3, v * 1.5, 2001) - 0.5) * 0.24 + Math.sin(lat * 3) * 0.05);
    const warpLat = clamp(lat + (fbm(u * 2.4, v * 2.2, 2002) - 0.5) * 0.12, -Math.PI / 2, Math.PI / 2);

    let landScore = -0.34;
    let islandScore = -1;

    for (const body of LAND_BODIES) {
      const e = ellipse(warpLon, warpLat, body);
      if (e > -0.62) {
        const coastNoise =
          (fbm(u * 3.7 + body.lon * 0.2, v * 4.3 + body.lat * 0.2, 2101) - 0.5) * 0.44 +
          (fbm(u * 8.4, v * 7.2, 2102) - 0.5) * 0.18;
        landScore = Math.max(landScore, e * body.weight + coastNoise);
      }
    }

    for (const island of ISLANDS) {
      const e = ellipse(warpLon, warpLat, island);
      if (e > -0.30) {
        const value = e * island.weight + (fbm(u * 9.0, v * 9.0, 2103) - 0.5) * 0.30 - 0.05;
        islandScore = Math.max(islandScore, value);
        landScore = Math.max(landScore, value);
      }
    }

    let cutScore = 0;
    for (const cut of OCEAN_CUTS) {
      const e = ellipse(warpLon, warpLat, cut);
      if (e > 0) cutScore = Math.max(cutScore, smoothstep(0, 0.95, e) * cut.weight);
    }

    const corridor = Math.abs(Math.sin(warpLon * 3.6 + Math.sin(warpLat * 5.6) * 0.9)) < 0.122 && Math.abs(warpLat) < 0.66 ? 0.18 : 0;
    landScore -= cutScore * 0.96;
    landScore -= corridor * smoothstep(-0.18, 0.36, landScore);

    let lakeScore = 0;
    for (const lake of LAKES) {
      const e = ellipse(warpLon, warpLat, lake);
      if (e > 0.12 && landScore > 0.04) lakeScore = Math.max(lakeScore, e);
    }

    const shelf = smoothstep(-0.32, 0.04, landScore);
    const beachEdge = clamp(1 - Math.abs(landScore) / 0.18, 0, 1);
    const isLake = lakeScore > 0.14;
    const isBeach = landScore > 0.02 && landScore <= 0.08 && !isLake;
    const isShelf = landScore <= 0.02 && landScore > -0.32;
    const isOcean = landScore <= -0.32;
    const isLand = landScore > 0.08 && !isLake;
    const isPolarIce = Math.abs(latDeg) > 72 && (isLand || isBeach);
    const ridge = ridgeNoise(u * 7.0 + 0.14, v * 4.0 - 0.21, 2201, 5);
    const basin = 1 - ridgeNoise(u * 2.5 - 0.18, v * 2.1 + 0.17, 2202, 4);

    return { landScore, islandScore, shelf, beachEdge, isLake, isBeach, isShelf, isOcean, isLand, isPolarIce, ridge, basin };
  }

  function colorFor(map, u, v) {
    const grain = (fbm(u * 24, v * 18, 3001, 3) - 0.5) * 18;

    if (map.isOcean || map.isShelf || map.isLake) {
      const depth = fbm(u * 1.4 + 0.22, v * 1.1 - 0.17, 3002, 5);
      const wave = (fbm(u * 18 - 0.10, v * 12 + 0.25, 3003, 3) - 0.5) * 12;
      let color = mix(COLORS.deepOcean, COLORS.ocean, smoothstep(0.20, 0.86, depth));
      if (map.isShelf) color = mix(color, COLORS.shelf, smoothstep(0.10, 0.86, map.shelf) * 0.86);
      if (map.beachEdge > 0.30) color = mix(color, COLORS.lagoon, map.beachEdge * 0.54);
      if (map.isLake) color = mix(COLORS.ocean, COLORS.lagoon, 0.54);
      return contrast(shade(color, wave), 1.16, 100);
    }

    if (map.isBeach) return contrast(shade(mix(COLORS.beach, COLORS.wetBeach, map.beachEdge * 0.46), grain * 0.42 + 8), 1.10, 124);

    let color = mix(COLORS.lowland, COLORS.forest, fbm(u * 4.2 - 0.27, v * 3.8 + 0.19, 3004, 4) * 0.54);
    color = mix(color, COLORS.highland, fbm(u * 2.2 + 0.41, v * 2.6 - 0.31, 3005, 4) * 0.42);
    if (map.ridge > 0.72) color = mix(color, COLORS.mountain, clamp(map.ridge * 0.60, 0, 0.66));
    if (map.ridge > 0.60) color = mix(color, COLORS.highland, 0.46);
    if (map.basin > 0.68) color = mix(color, COLORS.wetland, 0.60);
    if (map.isPolarIce) color = mix(color, COLORS.snow, 0.76);

    return contrast(shade(color, grain + smoothstep(0.62, 0.94, map.ridge) * 18 - smoothstep(0.62, 0.94, map.basin) * 8), 1.20, 116);
  }

  function buildTexture() {
    const data = new Uint8ClampedArray(TEX_W * TEX_H * 4);
    let land = 0;
    let water = 0;
    let minLuma = 255;
    let maxLuma = 0;

    for (let y = 0; y < TEX_H; y += 1) {
      const v = y / (TEX_H - 1);
      for (let x = 0; x < TEX_W; x += 1) {
        const u = x / (TEX_W - 1);
        const map = mapAt(u, v);
        const color = colorFor(map, u, v);
        const i = (y * TEX_W + x) * 4;
        const luma = color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;

        if (map.isOcean || map.isShelf || map.isLake) water += 1;
        else land += 1;

        minLuma = Math.min(minLuma, luma);
        maxLuma = Math.max(maxLuma, luma);
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;
      }
    }

    return {
      width: TEX_W,
      height: TEX_H,
      data,
      source: "routefinder-surface-texture-visibility-override",
      landRatio: Number((land / Math.max(1, land + water)).toFixed(4)),
      waterRatio: Number((water / Math.max(1, land + water)).toFixed(4)),
      contrast: Number((maxLuma - minLuma).toFixed(2))
    };
  }

  function sampleTexture(texture, lon, lat) {
    const u = wrap01((wrapPi(lon) + Math.PI) / TAU);
    const v = clamp(0.5 - lat / Math.PI, 0, 0.999999);
    const x = Math.floor(u * texture.width) % texture.width;
    const y = clamp(Math.floor(v * texture.height), 0, texture.height - 1);
    const i = (y * texture.width + x) * 4;
    return [texture.data[i], texture.data[i + 1], texture.data[i + 2]];
  }

  function label(node, text) {
    if (node) node.textContent = text;
  }

  function publishStatus(phase, texture) {
    const root = document.documentElement;
    root.dataset.audraliaRoutefinderJsExecuted = "true";
    root.dataset.audraliaRoutefinderJsContract = CONTRACT;
    root.dataset.audraliaRoutefinderJsReceipt = RECEIPT;
    root.dataset.audraliaRoutefinderPreviousContract = PREVIOUS_CONTRACT;
    root.dataset.audraliaSurfaceTextureVisibilityOverrideActive = "true";
    root.dataset.audraliaSurfaceTextureDrawnBeforeAtmosphere = "true";
    root.dataset.audraliaAtmosphereOpacityReduced = "true";
    root.dataset.audraliaAssetChainSecondaryOnly = "true";
    root.dataset.audraliaAssetChainMayReplaceVisibleTexture = "false";
    root.dataset.audraliaRoutefinderPhase = phase;
    root.dataset.audraliaRoutefinderTextureSource = texture.source;
    root.dataset.audraliaRoutefinderTextureLandRatio = String(texture.landRatio);
    root.dataset.audraliaRoutefinderTextureWaterRatio = String(texture.waterRatio);
    root.dataset.audraliaRoutefinderTextureContrast = String(texture.contrast);
    root.dataset.generatedImage = "false";
    root.dataset.graphicBox = "false";
    root.dataset.visualPassClaimed = "false";

    label(proof.html, "HTML loaded · surface override lane");
    label(proof.script, "script loaded · surface override cache lane");
    label(proof.js, "index.js executed · surface-texture-visibility-override");
    label(proof.mount, "mount found · canvas mounted");
    label(proof.notice, "SURFACE TEXTURE VISIBILITY OVERRIDE ACTIVE");
    label(proof.status, "ROUTEFINDER SURFACE VISIBLE · ASSET CHAIN HELD");
  }

  function appendReceipt(texture) {
    const prior = document.getElementById("audralia-routefinder-surface-texture-visibility-override-receipt");
    if (prior) prior.remove();

    const receipt = document.createElement("template");
    receipt.id = "audralia-routefinder-surface-texture-visibility-override-receipt";
    receipt.setAttribute("data-route-receipt", "");
    receipt.innerHTML = `
${CONTRACT}
receipt=${RECEIPT}
previous=${PREVIOUS_CONTRACT}
route=${ROUTE}
world=${WORLD}
target_file=/showroom/globe/audralia/index.js
mount=#audraliaCanvasMount
surface_texture_drawn_before_atmosphere=true
atmosphere_opacity_reduced=true
cloud_opacity_reduced=true
specular_opacity_reduced=true
land_ocean_contrast_hardened=true
beach_shelf_lagoon_visibility=true
mountain_highland_visibility=true
central_land_view_seeded=true
asset_chain_secondary_only=true
asset_chain_may_replace_visible_texture=false
texture_source=${texture.source}
texture_land_ratio=${texture.landRatio}
texture_water_ratio=${texture.waterRatio}
texture_contrast=${texture.contrast}
touch_scope=box_only
generated_image=false
graphic_box=false
visual_pass_claimed=false
`;
    document.body.appendChild(receipt);
  }

  if (!mount) {
    label(proof.notice, "SURFACE TEXTURE OVERRIDE HELD · MOUNT MISSING");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    return;
  }

  mount.textContent = "";
  mount.dataset.audraliaSurfaceTextureVisibilityOverride = CONTRACT;
  mount.dataset.audraliaContract = CONTRACT;
  mount.dataset.generatedImage = "false";
  mount.dataset.graphicBox = "false";
  mount.dataset.visualPassClaimed = "false";
  Object.assign(mount.style, { position: "absolute", inset: "0", overflow: "hidden", touchAction: "none", userSelect: "none" });

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Audralia surface texture visibility override globe");
  canvas.dataset.audraliaVisibleCanvas = "true";
  canvas.dataset.audraliaGlobe = "surface-texture-visibility-override";
  canvas.dataset.audraliaContract = CONTRACT;
  canvas.dataset.audraliaReceipt = RECEIPT;
  canvas.dataset.generatedImage = "false";
  canvas.dataset.graphicBox = "false";
  canvas.dataset.visualPassClaimed = "false";
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", touchAction: "none", userSelect: "none", cursor: "grab" });
  mount.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const sphere = document.createElement("canvas");
  const sctx = sphere.getContext("2d", { alpha: true, willReadFrequently: true });

  if (!ctx || !sctx) {
    label(proof.notice, "SURFACE TEXTURE OVERRIDE HELD · CANVAS CONTEXT FAILED");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    return;
  }

  const texture = buildTexture();
  const state = {
    dpr: 1,
    width: 1,
    height: 1,
    radius: 180,
    cx: 0,
    cy: 0,
    size: 360,
    rotation: -0.92,
    targetRotation: -0.92,
    tilt: -0.10,
    targetTilt: -0.10,
    dragging: false,
    startX: 0,
    startY: 0,
    startRotation: -0.92,
    startTilt: -0.10,
    lastTime: performance.now(),
    lastRender: 0,
    visible: true,
    reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function resize() {
    const rect = mount.getBoundingClientRect();
    const stageRect = stage ? stage.getBoundingClientRect() : null;
    const width = Math.max(320, Math.floor(rect.width || (stageRect && stageRect.width) || window.innerWidth || 320));
    const height = Math.max(260, Math.floor(rect.height || (stageRect && stageRect.height) || 260));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.45);

    state.dpr = dpr;
    state.width = width;
    state.height = height;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    state.radius = Math.min(canvas.width, canvas.height) * 0.392;
    state.cx = canvas.width * 0.5;
    state.cy = canvas.height * 0.5;
    state.size = Math.min(560, Math.max(320, Math.floor(state.radius * 2)));
    sphere.width = state.size;
    sphere.height = state.size;
  }

  function drawBackground() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.44, w * 0.06, w * 0.5, h * 0.52, w * 0.78);
    bg.addColorStop(0, "rgba(20,52,66,.96)");
    bg.addColorStop(0.36, "rgba(7,19,35,.98)");
    bg.addColorStop(1, "rgba(1,4,13,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  function drawSphere(now) {
    const size = state.size;
    const radius = size * 0.5;
    const image = sctx.createImageData(size, size);
    const out = image.data;
    const sinTilt = Math.sin(state.tilt);
    const cosTilt = Math.cos(state.tilt);
    const light = normal3(-0.34, 0.28, 0.90);
    const cloudDrift = now * 0.000012;

    for (let y = 0; y < size; y += 1) {
      const ny = (y - radius) / radius;
      for (let x = 0; x < size; x += 1) {
        const nx = (x - radius) / radius;
        const d2 = nx * nx + ny * ny;
        const i = (y * size + x) * 4;

        if (d2 > 1) {
          out[i + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - d2);
        const y3 = -ny * cosTilt - z * sinTilt;
        const z3 = -ny * sinTilt + z * cosTilt;
        const x3 = nx;
        const lat = Math.asin(clamp(y3, -1, 1));
        const lon = Math.atan2(x3, z3) + state.rotation;
        const color = sampleTexture(texture, lon, lat);
        const normal = normal3(x3, y3, z3);
        const lightDot = clamp(normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2], -1, 1);
        const daylight = 0.76 + Math.max(0, lightDot) * 0.32;
        const terminator = smoothstep(-0.62, 0.04, lightDot);
        const limb = Math.pow(1 - z, 1.8);
        const rim = Math.pow(1 - z, 3.2);
        const cloud = smoothstep(0.71, 0.89, fbm((lon + cloudDrift) * 0.34 + 0.17, lat * 0.70 - 0.11, 8101, 5)) * smoothstep(-0.74, 0.62, lightDot) * 0.055;

        let r = color[0] * daylight;
        let g = color[1] * daylight;
        let b = color[2] * daylight;

        r = lerp(r * 0.66, r, terminator);
        g = lerp(g * 0.70, g, terminator);
        b = lerp(b * 0.82, b, terminator);
        r = lerp(r, COLORS.cloud[0], cloud);
        g = lerp(g, COLORS.cloud[1], cloud);
        b = lerp(b, COLORS.cloud[2], cloud);
        r = lerp(r, COLORS.atmosphere[0], limb * 0.07);
        g = lerp(g, COLORS.atmosphere[1], limb * 0.06);
        b = lerp(b, COLORS.atmosphere[2], limb * 0.08);
        r = lerp(r, COLORS.rim[0], rim * 0.22);
        g = lerp(g, COLORS.rim[1], rim * 0.18);
        b = lerp(b, COLORS.rim[2], rim * 0.20);

        out[i] = clamp(Math.round(r), 0, 255);
        out[i + 1] = clamp(Math.round(g), 0, 255);
        out[i + 2] = clamp(Math.round(b), 0, 255);
        out[i + 3] = clamp(Math.round(255 * smoothstep(1.005, 0.985, d2)), 0, 255);
      }
    }

    sctx.putImageData(image, 0, 0);
  }

  function drawLabel() {
    const dpr = state.dpr;
    const text = "SURFACE TEXTURE VISIBILITY OVERRIDE ACTIVE";
    const w = canvas.width;
    const h = canvas.height;
    const boxW = Math.min(w * 0.82, 390 * dpr);
    const boxH = 35 * dpr;
    const x = (w - boxW) * 0.5;
    const y = h - boxH - 18 * dpr;
    const r = boxH * 0.5;

    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = "rgba(5,18,22,.66)";
    ctx.strokeStyle = "rgba(158,240,191,.34)";
    ctx.lineWidth = Math.max(1, dpr);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + boxW, y, x + boxW, y + boxH, r);
    ctx.arcTo(x + boxW, y + boxH, x, y + boxH, r);
    ctx.arcTo(x, y + boxH, x, y, r);
    ctx.arcTo(x, y, x + boxW, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(206,255,228,.94)";
    ctx.font = `900 ${Math.max(10, 11.5 * dpr)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + boxW * 0.5, y + boxH * 0.52, boxW - 36 * dpr);
    ctx.restore();
  }

  function draw(now = performance.now()) {
    drawBackground();

    const glow = ctx.createRadialGradient(state.cx, state.cy, state.radius * 0.54, state.cx, state.cy, state.radius * 1.22);
    glow.addColorStop(0, "rgba(158,240,191,.02)");
    glow.addColorStop(0.56, "rgba(141,216,255,.055)");
    glow.addColorStop(0.82, "rgba(158,240,191,.070)");
    glow.addColorStop(1, "rgba(158,240,191,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.22, 0, TAU);
    ctx.fill();

    drawSphere(now);
    const diameter = state.radius * 2;
    ctx.drawImage(sphere, state.cx - state.radius, state.cy - state.radius, diameter, diameter);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.095;
    const spec = ctx.createRadialGradient(state.cx - state.radius * 0.25, state.cy - state.radius * 0.38, 0, state.cx - state.radius * 0.25, state.cy - state.radius * 0.38, state.radius * 0.62);
    spec.addColorStop(0, "rgba(255,255,255,.42)");
    spec.addColorStop(0.2, "rgba(214,255,235,.10)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.fill();
    ctx.restore();

    drawLabel();
  }

  function pointerDown(event) {
    state.dragging = true;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startRotation = state.targetRotation;
    state.startTilt = state.targetTilt;
    canvas.style.cursor = "grabbing";
    if (event.cancelable) event.preventDefault();
    try { canvas.setPointerCapture(event.pointerId); } catch {}
  }

  function pointerMove(event) {
    if (!state.dragging) return;
    if (event.cancelable) event.preventDefault();
    state.targetRotation = state.startRotation + (event.clientX - state.startX) * 0.010;
    state.targetTilt = clamp(state.startTilt + (event.clientY - state.startY) * 0.004, -0.56, 0.46);
  }

  function pointerUp(event) {
    state.dragging = false;
    canvas.style.cursor = "grab";
    try { canvas.releasePointerCapture(event.pointerId); } catch {}
  }

  function tick(now) {
    const dt = Math.min(64, now - state.lastTime);
    state.lastTime = now;
    if (!state.reducedMotion && !state.dragging) state.targetRotation += dt * 0.000030;
    state.rotation += (state.targetRotation - state.rotation) * 0.16;
    state.tilt += (state.targetTilt - state.tilt) * 0.14;
    if (state.visible && now - state.lastRender > 44) {
      draw(now);
      state.lastRender = now;
    }
    requestAnimationFrame(tick);
  }

  function boot() {
    if (stage) {
      stage.setAttribute("data-loader-state", "mounted");
      stage.dataset.audraliaSurfaceTextureVisibilityOverride = CONTRACT;
    }

    canvas.dataset.audraliaTextureSource = texture.source;
    canvas.dataset.audraliaTextureLandRatio = String(texture.landRatio);
    canvas.dataset.audraliaTextureWaterRatio = String(texture.waterRatio);
    canvas.dataset.audraliaTextureContrast = String(texture.contrast);

    window.AUDRALIA_ROUTEFINDER = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      world: WORLD,
      getStatus: () => Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        mounted: true,
        surfaceTextureVisibilityOverride: true,
        surfaceTextureDrawnBeforeAtmosphere: true,
        atmosphereOpacityReduced: true,
        assetChainSecondaryOnly: true,
        assetChainMayReplaceVisibleTexture: false,
        texture,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      })
    });
    window.AUDRALIA_ROUTEFINDER_RECEIPT = window.AUDRALIA_ROUTEFINDER.getStatus();

    resize();
    publishStatus("surface-texture-visibility-override-ready", texture);
    appendReceipt(texture);
    draw();
    requestAnimationFrame(tick);
  }

  canvas.addEventListener("pointerdown", pointerDown, { passive: false });
  canvas.addEventListener("pointermove", pointerMove, { passive: false });
  canvas.addEventListener("pointerup", pointerUp, { passive: true });
  canvas.addEventListener("pointercancel", pointerUp, { passive: true });
  canvas.addEventListener("lostpointercapture", pointerUp, { passive: true });
  window.addEventListener("resize", () => { resize(); draw(); }, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  try {
    boot();
  } catch (error) {
    document.documentElement.dataset.audraliaSurfaceTextureVisibilityOverrideBootError = error instanceof Error ? error.message : String(error);
    label(proof.notice, "SURFACE TEXTURE VISIBILITY OVERRIDE BOOT ERROR");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
  }
})();
