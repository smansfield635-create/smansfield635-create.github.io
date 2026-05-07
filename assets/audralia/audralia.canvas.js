/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_AUTHORITY_RUNTIME_RENDER_CHAIN_REPAIR_TNT_v4 */
/* PURPOSE: restore the broken served canvas file, attach runtime truth, attach hex-surface renderer when available, and always produce a visible Audralia canvas even if a downstream module fails. */
/* NO GRAPHICBOX. NO IMAGE GENERATION. NO VISUAL PASS CLAIM. */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_AUTHORITY_RUNTIME_RENDER_CHAIN_REPAIR_TNT_v4";
const REVISION = "AUDRALIA_CANVAS_RUNTIME_RENDER_ATTACHMENT_REPAIR_v4";
const VERSION = "2026-05-06.runtime-render-chain-repair-v4";

const COMPATIBILITY_CONTRACTS = Object.freeze([
  "AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1",
  "AUDRALIA_CANVAS_AUTHORITY_4K_RUNTIME_HEX_SURFACE_TNT_v3"
]);

const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";
const HEX_SURFACE_PATH = "/assets/audralia/audralia.hex.surface.js";

const STATUS = {
  loaded: false,
  receipt: RECEIPT,
  contract: CONTRACT,
  revision: REVISION,
  version: VERSION,
  compatibilityContracts: COMPATIBILITY_CONTRACTS,
  file: "/assets/audralia/audralia.canvas.js",
  role: "adopted-canvas-authority-runtime-render-chain-repair",
  lineage: "tectonics->topology->terrain->climate->hydration->oceans->deep-ocean->runtime->hex-surface->canvas->route",
  runtimePath: RUNTIME_PATH,
  hexSurfacePath: HEX_SURFACE_PATH,
  runtimeLoaded: false,
  runtimeReceipt: "",
  runtimeError: "",
  hexSurfaceLoaded: false,
  hexSurfaceReceipt: "",
  hexSurfaceError: "",
  fallbackRendererActive: true,
  canvasPresent: false,
  mountPresent: false,
  animated: false,
  frameCount: 0,
  textureReady: false,
  textureStats: null,
  pixelProof: null,
  canonicalExport: "mountAudraliaCanvas",
  autoBoot: false,
  routeOwnsCall: true,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

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

  for (let index = 0; index < octaves; index += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
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

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
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
      node.setAttribute("data-graphic-box", "false");
      node.setAttribute("data-image-generation", "false");
      node.setAttribute("data-visual-pass-claimed", "false");
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
  frame.setAttribute("data-audralia-canvas-frame", "contained-square-runtime-render-chain-repair-v4");
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
  canvas.setAttribute("aria-label", "Audralia runtime render canvas");
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

  canvas.width = size;
  canvas.height = size;
  canvas.setAttribute("data-render-size", String(size));

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
    willReadFrequently: true
  });

  if (!ctx) {
    throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  return { ctx, size };
}

function fallbackSample(lat, lon, u, v) {
  const point = latLonToPoint(lat, lon);
  const polarIce = Math.abs(point.y) > 0.925;
  const fieldA = hash3(Math.round(point.x * 8), Math.round(point.y * 8), Math.round(point.z * 8));
  const fieldB = hash3(Math.round(point.x * 15), Math.round(point.y * 15), Math.round(point.z * 15));
  const equatorBias = 1 - Math.abs(point.y) * 0.44;
  const field = fieldA * 0.64 + fieldB * 0.24 + equatorBias * 0.12;

  const land = field > 0.835 && Math.abs(point.y) < 0.86;
  const shelf = !land && !polarIce && field > 0.765 && field <= 0.835;
  const water = !land && !polarIce;
  const depth = water ? clamp01(0.38 + (1 - field) * 0.44) : 0;
  const elevation = land || polarIce ? clamp01(0.18 + field * 0.34) : 0;

  return {
    ok: true,
    receipt: "AUDRALIA_CANVAS_INTERNAL_RUNTIME_FALLBACK",
    source: "canvas-internal-continuity-sampler",
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
    depth,
    maxDepth: depth,
    elevation,
    maxElevation: elevation,
    terrainRelief: elevation,
    terrainReliefIndex: elevation,
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
    hydrationIndex: water ? 0.72 : shelf ? 0.50 : land ? 0.36 : 0.62,
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

function sampleToColor(sample, lat, lon) {
  const point = latLonToPoint(lat, lon);

  const noiseA = fbm3(
    point.x * 8.5 + 4.2,
    point.y * 8.5 - 2.7,
    point.z * 8.5 + 1.8,
    5
  );

  const noiseB = fbm3(
    point.x * 28.0 - 9.1,
    point.y * 28.0 + 7.4,
    point.z * 28.0 - 5.8,
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
  const hydration = clamp01(Number(sample.hydrationIndex ?? sample.hydration ?? 0.38));
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

    let color = mixColor(lowland, dry, clamp01((1 - hydration) * 0.42));
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

function getRuntimeSampler(runtimeModule) {
  if (!runtimeModule || typeof runtimeModule !== "object") return null;

  return (
    runtimeModule.sampleAudraliaPlanetState ||
    runtimeModule.sampleAudraliaRuntime ||
    runtimeModule.sampleRuntimeState ||
    runtimeModule.sampleAudraliaSurface ||
    runtimeModule.sampleSurface ||
    runtimeModule.buildRuntimeField ||
    runtimeModule.default?.sampleSurface ||
    runtimeModule.default?.sampleAudraliaSurface ||
    null
  );
}

function callSampler(runtime, lat, lon, u, v) {
  if (runtime && runtime.ok && typeof runtime.sampler === "function") {
    try {
      const sample = runtime.sampler({ lat, lon, u, v, x: u, y: v });

      if (sample && typeof sample === "object") {
        return sample;
      }
    } catch (error) {
      runtime.error = error instanceof Error ? error.message : String(error);
    }
  }

  return fallbackSample(lat, lon, u, v);
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
      const sample = callSampler(runtime, lat, lon, u, v);
      const color = sampleToColor(sample, lat, lon);
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

async function loadRuntimeAuthority(state) {
  try {
    const runtimeModule = await import(`${RUNTIME_PATH}?canvas=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}`);
    const sampler = getRuntimeSampler(runtimeModule);

    let stats = null;

    try {
      if (typeof runtimeModule.getRuntimeStats === "function") stats = runtimeModule.getRuntimeStats();
      else if (typeof runtimeModule.getStats === "function") stats = runtimeModule.getStats();
    } catch (_) {
      stats = null;
    }

    state.runtime = {
      ok: typeof sampler === "function",
      module: runtimeModule,
      sampler,
      stats,
      receipt: runtimeModule.AUDRALIA_RUNTIME_RECEIPT_VALUE || runtimeModule.AUDRALIA_RUNTIME_STATUS?.receipt || "runtime-loaded",
      error: typeof sampler === "function" ? "" : "no-compatible-runtime-sampler-export"
    };
  } catch (error) {
    state.runtime = {
      ok: false,
      module: null,
      sampler: null,
      stats: null,
      receipt: "runtime-import-failed",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  state.texture = buildRuntimeTexture(
    state.runtime,
    Number(state.options.textureWidth) || 1024,
    Number(state.options.textureHeight) || 512
  );

  publishStatus(state);
}

async function loadHexSurfaceAuthority(state) {
  try {
    const hexModule = await import(`${HEX_SURFACE_PATH}?canvas=${encodeURIComponent(CONTRACT)}&v=${encodeURIComponent(VERSION)}`);

    const draw =
      hexModule.drawAudraliaHexSurfaceFrame ||
      hexModule.default?.drawAudraliaHexSurfaceFrame ||
      null;

    const status =
      typeof hexModule.getAudraliaHexSurfaceStatus === "function"
        ? hexModule.getAudraliaHexSurfaceStatus()
        : typeof hexModule.default?.getAudraliaHexSurfaceStatus === "function"
          ? hexModule.default.getAudraliaHexSurfaceStatus()
          : null;

    state.hexSurface = {
      ok: typeof draw === "function",
      module: hexModule,
      draw,
      status,
      receipt: status?.activeRenewal || status?.receipt || "hex-surface-loaded",
      error: typeof draw === "function" ? "" : "no-compatible-hex-surface-draw-export"
    };
  } catch (error) {
    state.hexSurface = {
      ok: false,
      module: null,
      draw: null,
      status: null,
      receipt: "hex-surface-import-failed",
      error: error instanceof Error ? error.message : String(error)
    };
  }

  publishStatus(state);
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 170; index += 1) {
    const sx = Math.sin(index * 917.17) * 10000;
    const sy = Math.sin(index * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.20 + 0.60 * Math.abs(Math.sin(time * 0.001 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 7 === 0 ? "rgba(245, 221, 166, 0.86)" : "rgba(185, 216, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(x, y, index % 13 === 0 ? 1.35 : 0.72, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOrbitalGlow(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.348;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 0.00022) * 0.12);

  for (let index = 0; index < 5; index += 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * (1.08 + index * 0.052), radius * (0.16 + index * 0.022), 0, 0, Math.PI * 2);
    ctx.strokeStyle = index % 2 === 0 ? "rgba(240, 211, 138, 0.10)" : "rgba(127, 194, 255, 0.10)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawRuntimeSphereFallback(ctx, texture, phase, size) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;
  const output = ctx.createImageData(size, size);
  const data = output.data;

  for (let py = 0; py < size; py += 1) {
    const y = (py + 0.5 - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const x = (px + 0.5 - cx) / radius;
      const r2 = x * x + y * y;

      if (r2 > 1) continue;

      const z = Math.sqrt(Math.max(0, 1 - r2));
      const lonOffset = Math.atan2(x, z) / (Math.PI * 2);
      const latitude = Math.asin(clamp(-y, -1, 1));
      const u = wrap01(phase + lonOffset);
      const v = clamp(0.5 - latitude / Math.PI, 0, 1);

      const tx = Math.floor(u * (texture.width - 1));
      const ty = Math.floor(v * (texture.height - 1));
      const source = (ty * texture.width + tx) * 4;
      const out = (py * size + px) * 4;

      const light = clamp(0.62 + z * 0.34 - r2 * 0.12 + x * -0.035 + y * -0.025, 0.36, 1.12);

      data[out] = clamp(Math.round(texture.data[source] * light), 0, 255);
      data[out + 1] = clamp(Math.round(texture.data[source + 1] * light), 0, 255);
      data[out + 2] = clamp(Math.round(texture.data[source + 2] * light), 0, 255);
      data[out + 3] = 255;
    }
  }

  ctx.putImageData(output, 0, 0);
}

function drawAtmosphere(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;
  const pulse = 0.42 + Math.sin(time * 0.0013) * 0.05;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(159, 214, 255, " + pulse.toFixed(3) + ")";
  ctx.lineWidth = size * 0.010;
  ctx.stroke();

  const shade = ctx.createRadialGradient(
    cx - radius * 0.42,
    cy - radius * 0.46,
    radius * 0.05,
    cx + radius * 0.18,
    cy + radius * 0.16,
    radius * 1.18
  );

  shade.addColorStop(0, "rgba(255, 255, 255, 0.13)");
  shade.addColorStop(0.52, "rgba(255, 255, 255, 0.018)");
  shade.addColorStop(0.76, "rgba(0, 0, 0, 0.17)");
  shade.addColorStop(1, "rgba(0, 0, 0, 0.62)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = shade;
  ctx.fill();

  ctx.restore();
}

function drawDiagnostics(ctx, size) {
  ctx.save();
  ctx.fillStyle = "rgba(244, 226, 178, 0.90)";
  ctx.font = "700 " + Math.max(13, size * 0.027) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("AUDRALIA", size / 2, size * 0.864);

  ctx.fillStyle = "rgba(174, 204, 225, 0.70)";
  ctx.font = "500 " + Math.max(10, size * 0.015) + "px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText("RUNTIME CHAIN · CANVAS REPAIR", size / 2, size * 0.895);
  ctx.restore();
}

function samplePixelProof(ctx, size) {
  try {
    const image = ctx.getImageData(0, 0, size, size).data;
    const total = size * size;

    let opaque = 0;
    let water = 0;
    let solid = 0;
    let turquoise = 0;

    for (let index = 0; index < image.length; index += 16) {
      const r = image[index];
      const g = image[index + 1];
      const b = image[index + 2];
      const a = image[index + 3];

      if (a > 0) opaque += 4;
      if (b > r * 1.06 && g > r * 0.70) water += 4;
      if (r >= 72 && r >= b * 0.78 && g >= 62 && b < 190) solid += 4;
      if (g > 125 && b > 130 && Math.abs(g - b) < 92) turquoise += 4;
    }

    return {
      opaqueRatio: opaque / total,
      waterPixelRatio: water / total,
      solidSurfacePixelRatio: solid / total,
      turquoisePixelRatio: turquoise / total,
      notBlank: opaque > total * 0.12
    };
  } catch (error) {
    return {
      notBlank: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function publishStatus(state) {
  const nextStatus = {
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    revision: REVISION,
    version: VERSION,
    compatibilityContracts: COMPATIBILITY_CONTRACTS,
    file: "/assets/audralia/audralia.canvas.js",
    canonicalExport: "mountAudraliaCanvas",
    autoBoot: false,
    routeOwnsCall: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    renderMode: "runtime-render-chain-repair",
    runtimePath: RUNTIME_PATH,
    hexSurfacePath: HEX_SURFACE_PATH,
    runtimeLoaded: Boolean(state.runtime && state.runtime.ok),
    runtimeReceipt: state.runtime ? state.runtime.receipt : "",
    runtimeError: state.runtime && state.runtime.error ? state.runtime.error : "",
    hexSurfaceLoaded: Boolean(state.hexSurface && state.hexSurface.ok),
    hexSurfaceReceipt: state.hexSurface ? state.hexSurface.receipt : "",
    hexSurfaceError: state.hexSurface && state.hexSurface.error ? state.hexSurface.error : "",
    fallbackRendererActive: !(state.hexSurface && state.hexSurface.ok),
    textureReady: Boolean(state.texture),
    textureStats: state.texture ? state.texture.stats : null,
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    animated: !state.stopped,
    frameCount: state.frameCount,
    pixelProof: state.pixelProof || null
  };

  Object.assign(STATUS, nextStatus);

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = STATUS;
    window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;
    window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: STATUS }));
  }

  if (state.canvas) {
    state.canvas.dataset.audraliaCanvasStatus = CONTRACT;
    state.canvas.dataset.audraliaCanvasReceipt = RECEIPT;
    state.canvas.dataset.audraliaCanvasRevision = REVISION;
    state.canvas.dataset.audraliaRuntimeLoaded = String(Boolean(state.runtime && state.runtime.ok));
    state.canvas.dataset.audraliaHexSurfaceLoaded = String(Boolean(state.hexSurface && state.hexSurface.ok));
    state.canvas.dataset.graphicBox = "false";
    state.canvas.dataset.imageGeneration = "false";
    state.canvas.dataset.visualPassClaimed = "false";
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasRevision = REVISION;
    document.documentElement.dataset.audraliaCanvasRuntimeLoaded = String(Boolean(state.runtime && state.runtime.ok));
    document.documentElement.dataset.audraliaCanvasHexSurfaceLoaded = String(Boolean(state.hexSurface && state.hexSurface.ok));
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
}

function drawHexSurfaceIfAvailable(state, phase) {
  if (!(state.hexSurface && state.hexSurface.ok && typeof state.hexSurface.draw === "function")) {
    return false;
  }

  try {
    state.hexFrame.canvas = state.canvas;
    state.hexFrame.ctx = state.ctx;
    state.hexFrame.texture = state.texture;
    state.hexFrame.phase = phase;
    state.hexFrame.hexGeometry = state.hexGeometry;

    state.hexSurface.draw(
      state.hexFrame,
      {
        radiusRatio: 0.405,
        hexDensity: 210,
        minHexRadius: 1.65,
        maxHexRadius: 4.3,
        edgeDarkening: 0.038,
        seamSoftening: 0.054,
        globalGlazeStrength: 0.82,
        landGlazeOpacity: 0.070,
        waterGlazeOpacity: 0.145,
        shelfGlazeOpacity: 0.220,
        iceGlazeOpacity: 0.035,
        terrainRecovery: 0.46
      }
    );

    state.hexGeometry = state.hexFrame.hexGeometry || state.hexGeometry || null;
    return true;
  } catch (error) {
    state.hexSurface.error = error instanceof Error ? error.message : String(error);
    return false;
  }
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;
  const phase = wrap01((time * 0.000028) + 0.18);

  ctx.clearRect(0, 0, size, size);

  drawStarField(ctx, size, time);
  drawOrbitalGlow(ctx, size, time);

  const usedHexSurface = drawHexSurfaceIfAvailable(state, phase);

  if (!usedHexSurface) {
    drawRuntimeSphereFallback(ctx, state.texture, phase, size);
  }

  drawAtmosphere(ctx, size, time);
  drawDiagnostics(ctx, size);

  state.frameCount += 1;

  if (state.frameCount === 4 || state.frameCount % 120 === 0) {
    state.pixelProof = samplePixelProof(ctx, size);
    publishStatus(state);
  }
}

function stopActiveController() {
  if (activeController && typeof activeController.stop === "function") {
    activeController.stop();
  }

  activeController = null;
}

function startCanvas(target, options) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const mount = resolveMount(target);
  const nodes = createCanvas(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    ctx: setup.ctx,
    size: setup.size,
    mount,
    options: options || {},
    runtime: {
      ok: false,
      module: null,
      sampler: null,
      stats: null,
      receipt: "runtime-loading",
      error: ""
    },
    hexSurface: {
      ok: false,
      module: null,
      draw: null,
      status: null,
      receipt: "hex-surface-loading",
      error: ""
    },
    texture: null,
    hexFrame: {
      canvas: null,
      ctx: null,
      texture: null,
      phase: 0,
      hexGeometry: null
    },
    hexGeometry: null,
    frameCount: 0,
    pixelProof: null,
    stopped: false,
    rafId: null,
    resizeTimer: null
  };

  state.texture = buildRuntimeTexture(
    state.runtime,
    Number(state.options.textureWidth) || 1024,
    Number(state.options.textureHeight) || 512
  );

  function animate(frameTime) {
    if (state.stopped) return;
    renderFrame(state, frameTime || performance.now());
    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () {
      const next = setupCanvas(state.canvas, state.frame);
      state.ctx = next.ctx;
      state.size = next.size;
      state.hexGeometry = null;
      state.hexFrame.hexGeometry = null;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 120);
  }

  state.stop = function () {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.removeEventListener("resize", resize);
  };

  window.addEventListener("resize", resize, { passive: true });

  activeController = state;

  setRouteStatus("Audralia adopted canvas authority loaded.");
  publishStatus(state);
  animate(performance.now());

  loadRuntimeAuthority(state);
  loadHexSurfaceAuthority(state);

  return state;
}

export function mountAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function bootAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function createAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function initAudraliaCanvas(target, options) {
  return startCanvas(target, options || {});
}

export function renderAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function mountAudralia(target, options) {
  return startCanvas(target, options || {});
}

export function render(target, options) {
  return startCanvas(target, options || {});
}

export function mount(target, options) {
  return startCanvas(target, options || {});
}

export function init(target, options) {
  return startCanvas(target, options || {});
}

export function getAudraliaCanvasStatus() {
  return STATUS;
}

export function getAudraliaSurfaceDataset() {
  return Object.freeze({
    name: "Audralia",
    receipt: RECEIPT,
    contract: CONTRACT,
    revision: REVISION,
    version: VERSION,
    runtimeTruthPath: RUNTIME_PATH,
    hexSurfacePath: HEX_SURFACE_PATH,
    renderMode: "runtime-render-chain-repair",
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    revision: REVISION,
    version: VERSION
  };
}

const api = {
  RECEIPT,
  CONTRACT,
  REVISION,
  VERSION,
  COMPATIBILITY_CONTRACTS,
  RUNTIME_PATH,
  HEX_SURFACE_PATH,
  mountAudraliaCanvas,
  renderAudraliaCanvas,
  bootAudraliaCanvas,
  createAudraliaCanvas,
  initAudraliaCanvas,
  renderAudralia,
  mountAudralia,
  render,
  mount,
  init,
  getAudraliaCanvasStatus,
  getAudraliaSurfaceDataset,
  stopAudraliaCanvas
};

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
  window.AUDRALIA_CANVAS_AUTHORITY_RECEIPT = RECEIPT;
  window.__AUDRALIA_CANVAS_STATUS__ = STATUS;
}

export default api;
