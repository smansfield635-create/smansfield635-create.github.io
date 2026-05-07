/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6 */
/* PURPOSE: preserve double-click/selection freeze protection while replacing strip-texture projection with an interaction-safe orthographic runtime globe renderer. */
/* NO GRAPHICBOX. NO IMAGE GENERATION. NO VISUAL PASS CLAIM. */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6";
const REVISION = "AUDRALIA_ORTHOGRAPHIC_RUNTIME_PROJECTION_UPGRADE_v6";
const VERSION = "2026-05-06.interaction-safe-orthographic-4k-v6";

const COMPATIBILITY_CONTRACTS = Object.freeze([
  "AUDRALIA_CANVAS_AUTHORITY_MINIMAL_CANARY_TNT_v1",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1",
  "AUDRALIA_CANVAS_AUTHORITY_RUNTIME_RENDER_CHAIN_REPAIR_TNT_v4",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5"
]);

const RUNTIME_PATH = "/assets/audralia/audralia.runtime.js";

const STATUS = {
  loaded: false,
  receipt: RECEIPT,
  contract: CONTRACT,
  revision: REVISION,
  version: VERSION,
  compatibilityContracts: COMPATIBILITY_CONTRACTS,
  file: "/assets/audralia/audralia.canvas.js",
  role: "adopted-canvas-authority-interaction-safe-orthographic-runtime-renderer",
  lineage: "tectonics->topology->terrain->climate->hydration->oceans->deep-ocean->runtime-normalizer->orthographic-canvas->route",
  runtimePath: RUNTIME_PATH,
  runtimeLoaded: false,
  runtimeReceipt: "",
  runtimeError: "",
  canvasPresent: false,
  mountPresent: false,
  animated: false,
  frameCount: 0,
  frameCap: 18,
  textureReady: false,
  textureStats: null,
  textureBuildProgress: 0,
  projectionGeometryReady: false,
  pixelProof: null,
  interactionFreezeGuard: true,
  userSelectSuppressedInsideCanvas: true,
  animationPausesDuringTextSelection: true,
  stripProjectionRemoved: true,
  orthographicProjectionActive: true,
  perFrameRuntimeSampling: false,
  perFrameFullTextureRebuild: false,
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

function smoothstep(edge0, edge1, value) {
  const denominator = Math.max(0.000001, edge1 - edge0);
  const t = clamp01((value - edge0) / denominator);
  return t * t * (3 - 2 * t);
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

function applyNoSelect(node) {
  node.style.userSelect = "none";
  node.style.webkitUserSelect = "none";
  node.style.MozUserSelect = "none";
  node.style.msUserSelect = "none";
  node.style.webkitTouchCallout = "none";
  node.style.touchAction = "manipulation";
}

function guardCanvasInteraction(node, state) {
  const blockedEvents = ["selectstart", "dragstart", "dblclick", "contextmenu"];

  for (let index = 0; index < blockedEvents.length; index += 1) {
    node.addEventListener(
      blockedEvents[index],
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        state.pauseUntil = performance.now() + 260;
      },
      { capture: true }
    );
  }

  node.addEventListener(
    "pointerdown",
    function (event) {
      if (event.detail >= 2) {
        event.preventDefault();
        event.stopPropagation();
        state.pauseUntil = performance.now() + 260;
      }
    },
    { capture: true, passive: false }
  );
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

function createCanvas(mount, state) {
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
  frame.setAttribute("data-audralia-canvas-frame", "orthographic-4k-contained-square-v6");
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
  canvas.setAttribute("aria-label", "Audralia interaction-safe orthographic runtime canvas");
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

  applyNoSelect(shell);
  applyNoSelect(frame);
  applyNoSelect(canvas);
  applyNoSelect(proof);

  guardCanvasInteraction(shell, state);
  guardCanvasInteraction(frame, state);
  guardCanvasInteraction(canvas, state);

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame, options = {}) {
  const rect = frame.getBoundingClientRect();
  const fallback = Math.min(window.innerWidth || 760, 860);
  const visibleSize = Math.max(320, Math.floor(Math.min(rect.width || fallback, rect.height || fallback)));
  const maxRenderSize = clamp(Number(options.maxRenderSize) || 640, 420, 760);
  const size = Math.max(360, Math.min(visibleSize, maxRenderSize));

  canvas.width = size;
  canvas.height = size;
  canvas.setAttribute("data-render-size", String(size));
  canvas.setAttribute("data-visible-size", String(visibleSize));

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
    willReadFrequently: true
  });

  if (!ctx) {
    throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  return { ctx, size, visibleSize };
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
    receipt: "AUDRALIA_CANVAS_INTERNAL_CONTINUITY_SAMPLE",
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

function createTextureShell(width, height) {
  return {
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
    stats: {
      totalPixels: width * height,
      landPixels: 0,
      waterPixels: 0,
      icePixels: 0,
      shelfPixels: 0,
      fallbackPixels: 0,
      landRatio: 0,
      waterRatio: 0,
      iceRatio: 0,
      shelfRatio: 0,
      fallbackRatio: 0
    },
    complete: false
  };
}

function finalizeTexture(texture) {
  const total = Math.max(1, texture.width * texture.height);
  texture.stats.landRatio = texture.stats.landPixels / total;
  texture.stats.waterRatio = texture.stats.waterPixels / total;
  texture.stats.iceRatio = texture.stats.icePixels / total;
  texture.stats.shelfRatio = texture.stats.shelfPixels / total;
  texture.stats.fallbackRatio = texture.stats.fallbackPixels / total;
  texture.complete = true;
  return texture;
}

function buildTextureSync(runtime, textureWidth, textureHeight) {
  const width = Math.max(384, Math.min(1024, Number(textureWidth) || 768));
  const height = Math.max(192, Math.min(512, Number(textureHeight) || 384));
  const texture = createTextureShell(width, height);

  for (let py = 0; py < height; py += 1) {
    const v = height === 1 ? 0.5 : py / (height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let px = 0; px < width; px += 1) {
      const u = width === 1 ? 0.5 : px / (width - 1);
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = callSampler(runtime, lat, lon, u, v);
      const color = sampleToColor(sample, lat, lon);
      const index = (py * width + px) * 4;

      if (sample.fallbackSample || sample.isFallback || sample.fallback) texture.stats.fallbackPixels += 1;
      if (sample.ice || sample.glacier) texture.stats.icePixels += 1;
      else if (sample.water || sample.liquidWater || sample.ocean || sample.shelf) texture.stats.waterPixels += 1;
      if (sample.shelf) texture.stats.shelfPixels += 1;
      if ((sample.land || sample.exposedTerrainLand || sample.visibleLand || sample.solidSurfaceLand) && !(sample.water || sample.liquidWater)) texture.stats.landPixels += 1;

      texture.data[index] = color[0];
      texture.data[index + 1] = color[1];
      texture.data[index + 2] = color[2];
      texture.data[index + 3] = color[3];
    }
  }

  return finalizeTexture(texture);
}

function buildTextureAsync(state, runtime, textureWidth, textureHeight) {
  const width = Math.max(512, Math.min(1536, Number(textureWidth) || 1024));
  const height = Math.max(256, Math.min(768, Number(textureHeight) || 512));
  const texture = createTextureShell(width, height);
  const rowsPerChunk = 6;

  let py = 0;

  function step() {
    if (state.stopped) return;

    const endRow = Math.min(height, py + rowsPerChunk);

    for (; py < endRow; py += 1) {
      const v = height === 1 ? 0.5 : py / (height - 1);
      const lat = (0.5 - v) * Math.PI;

      for (let px = 0; px < width; px += 1) {
        const u = width === 1 ? 0.5 : px / (width - 1);
        const lon = (u - 0.5) * Math.PI * 2;
        const sample = callSampler(runtime, lat, lon, u, v);
        const color = sampleToColor(sample, lat, lon);
        const index = (py * width + px) * 4;

        if (sample.fallbackSample || sample.isFallback || sample.fallback) texture.stats.fallbackPixels += 1;
        if (sample.ice || sample.glacier) texture.stats.icePixels += 1;
        else if (sample.water || sample.liquidWater || sample.ocean || sample.shelf) texture.stats.waterPixels += 1;
        if (sample.shelf) texture.stats.shelfPixels += 1;
        if ((sample.land || sample.exposedTerrainLand || sample.visibleLand || sample.solidSurfaceLand) && !(sample.water || sample.liquidWater)) texture.stats.landPixels += 1;

        texture.data[index] = color[0];
        texture.data[index + 1] = color[1];
        texture.data[index + 2] = color[2];
        texture.data[index + 3] = color[3];
      }
    }

    state.textureBuildProgress = py / height;
    publishStatus(state);

    if (py < height) {
      window.setTimeout(step, 0);
      return;
    }

    state.texture = finalizeTexture(texture);
    state.textureBuildProgress = 1;
    state.geometry = null;
    publishStatus(state);
  }

  window.setTimeout(step, 0);
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

  buildTextureAsync(
    state,
    state.runtime,
    Number(state.options.textureWidth) || 1024,
    Number(state.options.textureHeight) || 512
  );

  publishStatus(state);
}

function buildProjectionGeometry(size) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;
  const radiusSq = radius * radius;

  let count = 0;

  for (let py = 0; py < size; py += 1) {
    const dy = py + 0.5 - cy;

    for (let px = 0; px < size; px += 1) {
      const dx = px + 0.5 - cx;
      if (dx * dx + dy * dy <= radiusSq) count += 1;
    }
  }

  const indices = new Uint32Array(count);
  const lonOffsets = new Float32Array(count);
  const vCoords = new Float32Array(count);
  const shades = new Float32Array(count);
  const edgeFactors = new Float32Array(count);
  const noiseSeeds = new Float32Array(count);

  const lightX = -0.38;
  const lightY = -0.30;
  const lightZ = 0.86;

  let cursor = 0;

  for (let py = 0; py < size; py += 1) {
    const dy = py + 0.5 - cy;

    for (let px = 0; px < size; px += 1) {
      const dx = px + 0.5 - cx;
      const r2 = dx * dx + dy * dy;

      if (r2 > radiusSq) continue;

      const x = dx / radius;
      const y = dy / radius;
      const z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
      const latitude = Math.asin(clamp(-y, -1, 1));
      const lonOffset = Math.atan2(x, z) / (Math.PI * 2);
      const v = clamp(0.5 - latitude / Math.PI, 0, 1);
      const dot = clamp(x * lightX + (-y) * lightY + z * lightZ, -1, 1);
      const edge = Math.sqrt(r2) / radius;
      const shade = clamp(0.68 + dot * 0.28 - Math.pow(edge, 2.4) * 0.16, 0.42, 1.10);

      indices[cursor] = (py * size + px) * 4;
      lonOffsets[cursor] = lonOffset;
      vCoords[cursor] = v;
      shades[cursor] = shade;
      edgeFactors[cursor] = edge;
      noiseSeeds[cursor] = hash3(Math.round(x * 64), Math.round(y * 64), Math.round(z * 64));

      cursor += 1;
    }
  }

  return Object.freeze({
    size,
    radius,
    count,
    indices,
    lonOffsets,
    vCoords,
    shades,
    edgeFactors,
    noiseSeeds
  });
}

function sampleTextureBilinear(texture, u, v) {
  const width = texture.width;
  const height = texture.height;
  const data = texture.data;

  const x = wrap01(u) * (width - 1);
  const y = clamp(v, 0, 1) * (height - 1);

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = (x0 + 1) % width;
  const y1 = Math.min(height - 1, y0 + 1);

  const tx = x - x0;
  const ty = y - y0;

  const i00 = (y0 * width + x0) * 4;
  const i10 = (y0 * width + x1) * 4;
  const i01 = (y1 * width + x0) * 4;
  const i11 = (y1 * width + x1) * 4;

  const r0 = mix(data[i00], data[i10], tx);
  const g0 = mix(data[i00 + 1], data[i10 + 1], tx);
  const b0 = mix(data[i00 + 2], data[i10 + 2], tx);

  const r1 = mix(data[i01], data[i11], tx);
  const g1 = mix(data[i01 + 1], data[i11 + 1], tx);
  const b1 = mix(data[i01 + 2], data[i11 + 2], tx);

  return [
    mix(r0, r1, ty),
    mix(g0, g1, ty),
    mix(b0, b1, ty),
    255
  ];
}

function classifyColor(color) {
  const r = color[0];
  const g = color[1];
  const b = color[2];

  const water = b > r * 1.05 && g > r * 0.64;
  const shelf = water && g > 120 && b > 126 && Math.abs(g - b) < 96;
  const ice = r > 198 && g > 205 && b > 208;
  const land = !water && !ice && r > 65 && g > 52;

  return { water, shelf, ice, land };
}

function applyDetail(color, u, v, shade, edge, seed) {
  const cls = classifyColor(color);

  const lon = u * 2 - 1;
  const lat = 1 - v * 2;

  const fine =
    fbm3(lon * 14.0 + seed * 2.3, lat * 14.0 - seed * 3.1, seed * 7.7, 3) * 0.42 +
    fbm3(lon * 44.0 - seed * 1.8, lat * 34.0 + seed * 4.6, seed * 5.2, 2) * 0.20;

  let detailShade = shade;

  if (cls.land) {
    detailShade += (fine - 0.34) * 0.18;
  } else if (cls.water) {
    detailShade += (fine - 0.34) * 0.07;
  } else if (cls.ice) {
    detailShade += (fine - 0.34) * 0.12;
  }

  detailShade -= Math.pow(edge, 4.0) * 0.18;
  detailShade = clamp(detailShade, 0.36, 1.16);

  let r = color[0] * detailShade;
  let g = color[1] * detailShade;
  let b = color[2] * detailShade;

  const lineSignalA = Math.abs(Math.sin((lon * 13.0 + lat * 8.0 + seed) * Math.PI));
  const lineSignalB = Math.abs(Math.sin((lon * -7.0 + lat * 16.0 + seed * 0.7) * Math.PI));
  const goldLine = cls.land && lineSignalA > 0.988 && lineSignalB > 0.62;
  const shelfGlow = cls.shelf ? clamp(0.04 + fine * 0.05, 0.04, 0.10) : 0;

  if (goldLine) {
    r = mix(r, 238, 0.28);
    g = mix(g, 205, 0.22);
    b = mix(b, 125, 0.12);
  }

  if (shelfGlow > 0) {
    r = mix(r, 62, shelfGlow);
    g = mix(g, 210, shelfGlow);
    b = mix(b, 214, shelfGlow);
  }

  return [
    clamp(Math.round(r), 0, 255),
    clamp(Math.round(g), 0, 255),
    clamp(Math.round(b), 0, 255),
    255
  ];
}

function drawOrthographicGlobe(ctx, state, phase) {
  const size = state.size;

  if (!state.geometry || state.geometry.size !== size) {
    state.geometry = buildProjectionGeometry(size);
  }

  const geometry = state.geometry;
  const output = ctx.createImageData(size, size);
  const data = output.data;
  const texture = state.texture;

  for (let index = 0; index < geometry.count; index += 1) {
    const out = geometry.indices[index];
    const u = wrap01(phase + geometry.lonOffsets[index] + 0.5);
    const v = geometry.vCoords[index];

    const base = sampleTextureBilinear(texture, u, v);
    const color = applyDetail(
      base,
      u,
      v,
      geometry.shades[index],
      geometry.edgeFactors[index],
      geometry.noiseSeeds[index]
    );

    data[out] = color[0];
    data[out + 1] = color[1];
    data[out + 2] = color[2];
    data[out + 3] = color[3];
  }

  ctx.putImageData(output, 0, 0);
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 140; index += 1) {
    const sx = Math.sin(index * 917.17) * 10000;
    const sy = Math.sin(index * 421.91) * 10000;
    const x = (sx - Math.floor(sx)) * size;
    const y = (sy - Math.floor(sy)) * size;
    const pulse = 0.20 + 0.60 * Math.abs(Math.sin(time * 0.001 + index));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 7 === 0 ? "rgba(245, 221, 166, 0.86)" : "rgba(185, 216, 255, 0.72)";
    ctx.beginPath();
    ctx.arc(x, y, index % 13 === 0 ? 1.25 : 0.65, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOrbitalGlow(ctx, size, time) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 0.00022) * 0.12);

  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * (1.05 + index * 0.052), radius * (0.14 + index * 0.022), 0, 0, Math.PI * 2);
    ctx.strokeStyle = index % 2 === 0 ? "rgba(240, 211, 138, 0.10)" : "rgba(127, 194, 255, 0.10)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawCloudWisps(ctx, size, time, phase) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.405;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(245, 250, 255, 0.52)";
  ctx.lineWidth = Math.max(0.7, size * 0.0014);

  for (let band = 0; band < 8; band += 1) {
    const baseLat = -0.62 + band * 0.18;
    const shift = phase * Math.PI * 2 + band * 0.77;

    ctx.beginPath();

    let started = false;

    for (let step = -64; step <= 64; step += 1) {
      const xNorm = step / 64;
      const wave = Math.sin(step * 0.16 + shift + time * 0.00035) * 0.030;
      const yNorm = baseLat + wave;
      const r2 = xNorm * xNorm + yNorm * yNorm;

      if (r2 > 0.96) {
        started = false;
        continue;
      }

      const x = cx + xNorm * radius;
      const y = cy + yNorm * radius;

      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }

  ctx.restore();
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
  ctx.fillText("ORTHOGRAPHIC 4K · INTERACTION SAFE", size / 2, size * 0.895);
  ctx.restore();
}

function samplePixelProof(ctx, size) {
  try {
    const probeSize = Math.max(64, Math.min(180, Math.floor(size / 4)));
    const x0 = Math.floor(size / 2 - probeSize / 2);
    const y0 = Math.floor(size / 2 - probeSize / 2);
    const image = ctx.getImageData(x0, y0, probeSize, probeSize).data;
    const total = probeSize * probeSize;

    let opaque = 0;
    let water = 0;
    let solid = 0;
    let turquoise = 0;
    let gold = 0;

    for (let index = 0; index < image.length; index += 16) {
      const r = image[index];
      const g = image[index + 1];
      const b = image[index + 2];
      const a = image[index + 3];

      if (a > 0) opaque += 4;
      if (b > r * 1.06 && g > r * 0.70) water += 4;
      if (r >= 72 && r >= b * 0.78 && g >= 52 && b < 190) solid += 4;
      if (g > 125 && b > 130 && Math.abs(g - b) < 92) turquoise += 4;
      if (r > 150 && g > 118 && b < 120) gold += 4;
    }

    return {
      opaqueRatio: opaque / total,
      waterPixelRatio: water / total,
      solidSurfacePixelRatio: solid / total,
      turquoisePixelRatio: turquoise / total,
      goldLineRatio: gold / total,
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
    renderMode: "interaction-safe-orthographic-runtime-projection",
    runtimePath: RUNTIME_PATH,
    runtimeLoaded: Boolean(state.runtime && state.runtime.ok),
    runtimeReceipt: state.runtime ? state.runtime.receipt : "",
    runtimeError: state.runtime && state.runtime.error ? state.runtime.error : "",
    textureReady: Boolean(state.texture && state.texture.complete),
    textureStats: state.texture ? state.texture.stats : null,
    textureBuildProgress: state.textureBuildProgress || 0,
    projectionGeometryReady: Boolean(state.geometry),
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    animated: !state.stopped,
    frameCount: state.frameCount,
    frameCap: state.frameCap,
    pixelProof: state.pixelProof || null,
    interactionFreezeGuard: true,
    userSelectSuppressedInsideCanvas: true,
    animationPausesDuringTextSelection: true,
    stripProjectionRemoved: true,
    orthographicProjectionActive: true,
    perFrameRuntimeSampling: false,
    perFrameFullTextureRebuild: false
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
    state.canvas.dataset.audraliaOrthographicProjection = "true";
    state.canvas.dataset.audraliaStripProjectionRemoved = "true";
    state.canvas.dataset.graphicBox = "false";
    state.canvas.dataset.imageGeneration = "false";
    state.canvas.dataset.visualPassClaimed = "false";
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasRevision = REVISION;
    document.documentElement.dataset.audraliaCanvasRuntimeLoaded = String(Boolean(state.runtime && state.runtime.ok));
    document.documentElement.dataset.audraliaCanvasInteractionFreezeGuard = "true";
    document.documentElement.dataset.audraliaCanvasOrthographicProjection = "true";
    document.documentElement.dataset.audraliaCanvasStripProjectionRemoved = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;
  const phase = wrap01((time * 0.000030) + 0.18);

  ctx.clearRect(0, 0, size, size);

  drawStarField(ctx, size, time);
  drawOrbitalGlow(ctx, size, time);

  if (state.texture && state.texture.complete) {
    drawOrthographicGlobe(ctx, state, phase);
  }

  drawCloudWisps(ctx, size, time, phase);
  drawAtmosphere(ctx, size, time);
  drawDiagnostics(ctx, size);

  state.frameCount += 1;

  if (state.frameCount === 4 || state.frameCount % 72 === 0) {
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

  const state = {
    shell: null,
    frame: null,
    canvas: null,
    proof: null,
    ctx: null,
    size: 0,
    visibleSize: 0,
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
    texture: null,
    textureBuildProgress: 0,
    geometry: null,
    frameCount: 0,
    frameCap: clamp(Number(options && options.frameCap) || 18, 10, 24),
    lastFrameTime: 0,
    pauseUntil: 0,
    pixelProof: null,
    stopped: false,
    rafId: null,
    resizeTimer: null
  };

  const nodes = createCanvas(mount, state);
  const setup = setupCanvas(nodes.canvas, nodes.frame, state.options);

  state.shell = nodes.shell;
  state.frame = nodes.frame;
  state.canvas = nodes.canvas;
  state.proof = nodes.proof;
  state.ctx = setup.ctx;
  state.size = setup.size;
  state.visibleSize = setup.visibleSize;

  state.texture = buildTextureSync(
    state.runtime,
    Number(state.options.initialTextureWidth) || 512,
    Number(state.options.initialTextureHeight) || 256
  );

  state.textureBuildProgress = 1;

  function onSelectionChange() {
    const selection = document.getSelection ? document.getSelection() : null;

    if (selection && !selection.isCollapsed) {
      state.pauseUntil = performance.now() + 900;
    }
  }

  function animate(frameTime) {
    if (state.stopped) return;

    const now = frameTime || performance.now();
    const minimumFrameGap = 1000 / state.frameCap;
    const selectionPauseActive = now < state.pauseUntil;

    if (!document.hidden && !selectionPauseActive && now - state.lastFrameTime >= minimumFrameGap) {
      state.lastFrameTime = now;
      renderFrame(state, now);
    }

    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);
    state.resizeTimer = window.setTimeout(function () {
      const next = setupCanvas(state.canvas, state.frame, state.options);
      state.ctx = next.ctx;
      state.size = next.size;
      state.visibleSize = next.visibleSize;
      state.geometry = null;
      state.lastFrameTime = 0;
      renderFrame(state, performance.now());
      publishStatus(state);
    }, 180);
  }

  state.stop = function () {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.removeEventListener("resize", resize);
    document.removeEventListener("selectionchange", onSelectionChange);
  };

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("selectionchange", onSelectionChange, { passive: true });

  activeController = state;

  setRouteStatus("Audralia adopted canvas authority loaded.");
  publishStatus(state);
  renderFrame(state, performance.now());
  animate(performance.now());

  loadRuntimeAuthority(state);

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
    renderMode: "interaction-safe-orthographic-runtime-projection",
    interactionFreezeGuard: true,
    userSelectSuppressedInsideCanvas: true,
    animationPausesDuringTextSelection: true,
    stripProjectionRemoved: true,
    orthographicProjectionActive: true,
    perFrameRuntimeSampling: false,
    perFrameFullTextureRebuild: false,
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
