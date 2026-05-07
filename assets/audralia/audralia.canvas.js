/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_AUTHORITY_4K_RUNTIME_HEX_SURFACE_TNT_v3 */
/* REVISION: AUDRALIA_RICH_PLANET_RUNTIME_CHAIN_DETAIL_UPGRADE_v3 */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_4K_RUNTIME_HEX_SURFACE_TNT_v3";
const REVISION = "AUDRALIA_RICH_PLANET_RUNTIME_CHAIN_DETAIL_UPGRADE_v3";
const VERSION = "2026-05-06.rich-runtime-hex-surface-upgrade-v3";
const COMPATIBILITY_CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1";

const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const HEX_SURFACE_PATH = "/assets/audralia/audralia.hex.surface.js";

const PLANET = Object.freeze({
  name: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  revision: REVISION,
  compatibility: COMPATIBILITY_CONTRACT,
  autoBoot: false,
  routeOwnsCall: true,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  lineage: "tectonics -> topology -> terrain -> climate -> hydration -> oceans -> deep-ocean -> runtime -> hex-surface -> canvas",
  runtimeTruthPath: RUNTIME_PATH,
  hexSurfacePath: HEX_SURFACE_PATH,
  renderMode: "4k-runtime-truth-hex-surface-planet",
  exposedLandRatioIntent: "earth-compatible-above-water-ratio",
  materialLanguage: [
    "diamond",
    "opal",
    "granite",
    "slate",
    "white-opal-sand",
    "black-diamond-sand",
    "glacier-ice",
    "turquoise-shelf-water",
    "abyssal-blue-water"
  ]
});

let activeController = null;

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function fract(value) {
  return value - Math.floor(value);
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const x00 = mix(h(0, 0, 0), h(1, 0, 0), ux);
  const x10 = mix(h(0, 1, 0), h(1, 1, 0), ux);
  const x01 = mix(h(0, 0, 1), h(1, 0, 1), ux);
  const x11 = mix(h(0, 1, 1), h(1, 1, 1), ux);

  return mix(mix(x00, x10, uy), mix(x01, x11, uy), uz);
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function resolveMount(target) {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) return target;
  if (target && typeof HTMLElement !== "undefined" && target.mount instanceof HTMLElement) return target.mount;
  if (target && typeof HTMLElement !== "undefined" && target.target instanceof HTMLElement) return target.target;
  if (target && typeof HTMLElement !== "undefined" && target.container instanceof HTMLElement) return target.container;

  if (typeof target === "string") {
    const selected = document.querySelector(target);
    if (selected) return selected;
  }

  const selectors = [
    "#audraliaRenderMount",
    "#audralia-canvas-mount",
    "[data-audralia-canvas-mount]",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main",
    "main"
  ];

  for (let index = 0; index < selectors.length; index += 1) {
    const selected = document.querySelector(selectors[index]);
    if (selected) return selected;
  }

  return document.body;
}

function setRouteStatus(message) {
  const selectors = [
    "#audralia-route-status",
    "[data-audralia-route-status]",
    "#audralia-status",
    "[data-route-status]"
  ];

  for (let index = 0; index < selectors.length; index += 1) {
    const node = document.querySelector(selectors[index]);

    if (node) {
      node.textContent = message;
      node.setAttribute("data-audralia-canvas-loaded", "true");
      node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
      node.setAttribute("data-audralia-canvas-contract", CONTRACT);
      return;
    }
  }
}

function removeResidue() {
  const badText = {
    "Loading Audralia": true,
    "Audralia canvas authority import failed.": true,
    "Audralia canvas authority import failed. missing ) after argument list": true,
    "Canvas authority imported · no render export found": true,
    "Audralia canvas authority imported, but no render export was found.": true,
    "Audralia doorway is loading the current adopted canvas authority.": true
  };

  const nodes = document.querySelectorAll("p, div, span, li, h2, h3");

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    const text = (node.textContent || "").trim();

    if (node.children.length === 0 && badText[text]) {
      node.remove();
    }
  }
}

function clearOwnedNodes(mount) {
  const nodes = mount.querySelectorAll("[data-audralia-canvas-authority='true']");

  for (let index = 0; index < nodes.length; index += 1) {
    nodes[index].remove();
  }
}

function createCanvas(mount) {
  clearOwnedNodes(mount);
  removeResidue();

  const shell = document.createElement("section");
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.setAttribute("data-audralia-revision", REVISION);
  shell.setAttribute("data-graphic-box", "false");
  shell.setAttribute("data-image-generation", "false");
  shell.setAttribute("data-visual-pass-claimed", "false");
  shell.style.width = "min(100%, 980px)";
  shell.style.margin = "18px auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.setAttribute("data-audralia-canvas-frame", "contained-square-runtime-planet-v3");
  frame.style.width = "min(92vw, 860px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(13, 32, 58, 0.98), rgba(2, 7, 19, 1) 72%)";
  frame.style.boxShadow = "0 30px 96px rgba(0, 0, 0, 0.54), inset 0 0 90px rgba(136, 195, 255, 0.10)";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("aria-label", "Audralia 4K runtime planet canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";

  const proof = document.createElement("p");
  proof.setAttribute("data-audralia-canvas-proof", "true");
  proof.textContent = RECEIPT;
  proof.style.margin = "12px 0 0";
  proof.style.color = "rgba(245, 233, 199, 0.88)";
  proof.style.font = "700 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 760, 860);
  const size = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback)));
  const ratio = clamp(window.devicePixelRatio || 1, 1, 2.5);

  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);
  canvas.setAttribute("data-pixel-ratio", String(ratio));
  canvas.setAttribute("data-render-size", String(size));

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true, willReadFrequently: true });

  if (!ctx) {
    throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  return { ctx, size, ratio };
}

async function loadRuntimeAuthority() {
  try {
    const runtime = await import(`${RUNTIME_PATH}?canvas=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}`);

    const sampler =
      runtime.sampleAudraliaPlanetState ||
      runtime.sampleAudraliaRuntime ||
      runtime.sampleRuntimeState ||
      runtime.sampleAudraliaSurface ||
      runtime.sampleSurface ||
      runtime.buildRuntimeField ||
      null;

    const stats =
      typeof runtime.getRuntimeStats === "function"
        ? runtime.getRuntimeStats()
        : typeof runtime.getStats === "function"
          ? runtime.getStats()
          : null;

    return {
      ok: typeof sampler === "function",
      module: runtime,
      sampler,
      stats,
      receipt: runtime.AUDRALIA_RUNTIME_RECEIPT_VALUE || runtime.AUDRALIA_RUNTIME_STATUS?.receipt || "runtime-loaded"
    };
  } catch (error) {
    return {
      ok: false,
      module: null,
      sampler: null,
      stats: null,
      receipt: "runtime-import-failed",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function loadHexSurfaceAuthority() {
  try {
    const hex = await import(`${HEX_SURFACE_PATH}?canvas=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}`);
    const draw =
      hex.drawAudraliaHexSurfaceFrame ||
      hex.default?.drawAudraliaHexSurfaceFrame ||
      null;

    const status =
      typeof hex.getAudraliaHexSurfaceStatus === "function"
        ? hex.getAudraliaHexSurfaceStatus()
        : typeof hex.default?.getAudraliaHexSurfaceStatus === "function"
          ? hex.default.getAudraliaHexSurfaceStatus()
          : null;

    return {
      ok: typeof draw === "function",
      module: hex,
      draw,
      status,
      receipt: status?.activeRenewal || status?.receipt || "hex-surface-loaded"
    };
  } catch (error) {
    return {
      ok: false,
      module: null,
      draw: null,
      status: null,
      receipt: "hex-surface-import-failed",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function fallbackSample(lat, lon, u, v) {
  const point = latLonToPoint(lat, lon);
  const polarIce = Math.abs(point.y) > 0.925;
  const fieldA = hash3(Math.round(point.x * 8), Math.round(point.y * 8), Math.round(point.z * 8));
  const fieldB = hash3(Math.round(point.x * 15), Math.round(point.y * 15), Math.round(point.z * 15));
  const field = fieldA * 0.72 + fieldB * 0.28;
  const land = field > 0.835 && Math.abs(point.y) < 0.86;
  const shelf = !land && !polarIce && field > 0.765 && field <= 0.835;
  const water = !land && !polarIce;

  return {
    ok: true,
    receipt: "AUDRALIA_CANVAS_INTERNAL_RUNTIME_FALLBACK",
    lat,
    lon,
    u,
    v,
    liquidWater: water,
    water,
    ocean: water && !shelf,
    shelf,
    land,
    exposedTerrainLand: land,
    visibleLand: land,
    solidSurfaceLand: land || polarIce,
    topologyLand: land || polarIce,
    ice: polarIce,
    glacier: polarIce,
    beach: shelf,
    coastal: shelf,
    depth: water ? clamp01(0.38 + (1 - field) * 0.44) : 0,
    elevation: land || polarIce ? clamp01(0.18 + field * 0.34) : 0,
    terrainRelief: land || polarIce ? clamp01(0.18 + field * 0.34) : 0,
    coastlineIndex: shelf ? 0.62 : 0,
    shelfIndex: shelf ? 0.72 : 0,
    turquoise: shelf ? 0.76 : water ? 0.24 : 0.08,
    turquoiseIndex: shelf ? 0.76 : water ? 0.24 : 0.08,
    blueWaterIndex: water ? 0.72 : 0,
    diamondSignal: polarIce ? 0.52 : land ? 0.22 : 0.04,
    opalSignal: shelf ? 0.44 : 0.12,
    graniteSignal: land ? 0.42 : 0.05,
    slateSignal: land ? 0.34 : 0.08,
    deepOceanBlend: water && !shelf ? 0.44 : 0,
    organicDeepOceanPresence: water && !shelf ? 0.24 : 0,
    visualSurfaceClass: polarIce
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    fallback: false,
    fallbackSample: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function callRuntimeSampler(runtime, lat, lon, u, v) {
  if (runtime && runtime.ok && typeof runtime.sampler === "function") {
    try {
      const sample = runtime.sampler({ lat, lon, u, v, x: u, y: v });

      if (sample && typeof sample === "object") {
        return sample;
      }
    } catch (_) {
      /* use internal continuity sample */
    }
  }

  return fallbackSample(lat, lon, u, v);
}

function colorBytes(r, g, b, a = 255) {
  return [
    clamp(Math.round(r), 0, 255),
    clamp(Math.round(g), 0, 255),
    clamp(Math.round(b), 0, 255),
    clamp(Math.round(a), 0, 255)
  ];
}

function mixColor(a, b, t) {
  const amount = clamp01(t);

  return [
    clamp(Math.round(mix(a[0], b[0], amount)), 0, 255),
    clamp(Math.round(mix(a[1], b[1], amount)), 0, 255),
    clamp(Math.round(mix(a[2], b[2], amount)), 0, 255),
    clamp(Math.round(mix(a[3] === undefined ? 255 : a[3], b[3] === undefined ? 255 : b[3], amount)), 0, 255)
  ];
}

function sampleToColor(sample, lat, lon, u, v) {
  const noiseA = fbm3(
    Math.cos(lat) * Math.sin(lon) * 8.5 + 4.2,
    Math.sin(lat) * 8.5 - 2.7,
    Math.cos(lat) * Math.cos(lon) * 8.5 + 1.8,
    5
  );

  const noiseB = fbm3(
    Math.cos(lat) * Math.sin(lon) * 28.0 - 9.1,
    Math.sin(lat) * 28.0 + 7.4,
    Math.cos(lat) * Math.cos(lon) * 28.0 - 5.8,
    4
  );

  const water = Boolean(sample.water || sample.liquidWater || sample.ocean || sample.shelf);
  const shelf = Boolean(sample.shelf) || Number(sample.shelfIndex || 0) > 0.38;
  const ice = Boolean(sample.ice || sample.glacier);
  const land = Boolean(sample.land || sample.exposedTerrainLand || sample.visibleLand || sample.solidSurfaceLand) && !water;
  const depth = clamp01(Number(sample.depth ?? sample.oceanDepth ?? sample.finalDepth ?? 0));
  const elevation = clamp01(Number(sample.elevation ?? sample.maxElevation ?? sample.terrainRelief ?? 0));
  const turquoise = clamp01(Number(sample.turquoiseIndex ?? sample.turquoise ?? sample.visibleTurquoiseIndex ?? 0));
  const coastline = clamp01(Number(sample.coastlineIndex ?? sample.coastalFeather ?? 0));
  const diamond = clamp01(Number(sample.diamondSignal ?? 0));
  const opal = clamp01(Number(sample.opalSignal ?? 0));
  const granite = clamp01(Number(sample.graniteSignal ?? 0));
  const slate = clamp01(Number(sample.slateSignal ?? 0));
  const deepBlend = clamp01(Number(sample.deepOceanBlend ?? sample.organicDeepOceanPresence ?? 0));

  if (ice) {
    let color = colorBytes(218, 239, 248, 255);
    color = mixColor(color, colorBytes(255, 255, 255, 255), 0.34 + noiseA * 0.26);
    color = mixColor(color, colorBytes(178, 219, 239, 255), noiseB * 0.12);
    return color;
  }

  if (water) {
    const deep = colorBytes(3, 16, 54, 255);
    const ocean = colorBytes(8, 58, 126, 255);
    const blue = colorBytes(18, 111, 174, 255);
    const shelfColor = colorBytes(46, 188, 202, 255);
    const reef = colorBytes(114, 218, 196, 255);

    let color = mixColor(blue, deep, clamp01(depth * 1.14 + deepBlend * 0.24));
    color = mixColor(color, ocean, clamp01(0.24 + noiseA * 0.18));
    color = mixColor(color, shelfColor, shelf ? clamp01(0.36 + turquoise * 0.42) : turquoise * 0.18);
    color = mixColor(color, reef, shelf ? clamp01(noiseB * 0.14 + turquoise * 0.12) : 0);
    return color;
  }

  if (land) {
    const lowland = colorBytes(96, 129, 81, 255);
    const dry = colorBytes(166, 129, 76, 255);
    const graniteColor = colorBytes(164, 153, 119, 255);
    const slateColor = colorBytes(78, 88, 92, 255);
    const opalColor = colorBytes(202, 232, 216, 255);
    const diamondColor = colorBytes(244, 251, 255, 255);
    const coast = colorBytes(229, 205, 145, 255);

    let color = mixColor(lowland, dry, clamp01((1 - Number(sample.hydrationIndex ?? sample.hydration ?? 0.38)) * 0.42));
    color = mixColor(color, graniteColor, clamp01(granite * 0.32 + elevation * 0.16));
    color = mixColor(color, slateColor, slate * 0.18);
    color = mixColor(color, opalColor, opal * 0.16);
    color = mixColor(color, diamondColor, diamond * 0.10);
    color = mixColor(color, coast, coastline * 0.22);
    color = mixColor(color, colorBytes(38, 48, 38, 255), clamp01((1 - noiseA) * 0.08));
    color = mixColor(color, colorBytes(232, 219, 169, 255), clamp01(noiseB * 0.08 + elevation * 0.05));
    return color;
  }

  return colorBytes(6, 38, 92, 255);
}

function buildRuntimeTexture(runtime, textureWidth, textureHeight) {
  const width = Math.max(256, Math.min(2048, Number(textureWidth) || 1024));
  const height = Math.max(128, Math.min(1024, Number(textureHeight) || 512));
  const data = new Uint8ClampedArray(width * height * 4);

  let landPixels = 0;
  let waterPixels = 0;
  let icePixels = 0;
  let shelfPixels = 0;
  let fallbackPixels = 0;

  for (let py = 0; py < height; py += 1) {
    const v = height === 1 ? 0.5 : py / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let px = 0; px < width; px += 1) {
      const u = width === 1 ? 0.5 : px / (width - 1);
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = callRuntimeSampler(runtime, lat, lon, u, v);
      const color = sampleToColor(sample, lat, lon, u, v);
      const index = (py * width + px) * 4;

      if (sample.fallbackSample || sample.isFallback || sample.fallback) fallbackPixels += 1;
      if (sample.ice || sample.glacier) icePixels += 1;
      else if (sample.water || sample.liquidWater || sample.ocean || sample.shelf) waterPixels += 1;
      if (sample.shelf) shelfPixels += 1;
      if ((sample.land || sample.exposedTerrainLand || sample.visibleLand || sample.solidSurfaceLand) && !(sample.water || sample.liquidWater)) landPixels += 1;

      data[index] = color[0];
      data[index + 1] = color[1];
      data[index + 2] = color[2];
      data[index + 3] = color[3];
    }
  }

  return {
    width,
    height,
    data,
    stats: Object.freeze({
      totalPixels: width * height,
      landPixels,
      waterPixels,
      icePixels,
      shelfPixels,
      fallbackPixels,
      landRatio: landPixels / Math.max(1, width * height),
      waterRatio: waterPixels / Math.max(1, width * height),
      iceRatio: icePixels / Math.max(1, width * height),
      shelfRatio: shelfPixels / Math.max(1, width * height),
      fallbackRatio: fallbackPixels / Math.max(1, width * height)
    })
  };
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 170; index += 1) {
    const sx = Math.sin(index * 917.17) * 10000;
    const sy = Math.sin(index * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y
