/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN */
/* TNT: AUDRALIA_CANVAS_SPHERICAL_TEXTURE_UNWRAP_AND_POLAR_BLEND_TNT_v11 */
/* FULL-FILE REPLACEMENT: canvas authority only */

const RECEIPT = "AUDRALIA_CANVAS_AUTHORITY_RECEIPT";
const CONTRACT = "AUDRALIA_CANVAS_SPHERICAL_TEXTURE_UNWRAP_AND_POLAR_BLEND_TNT_v11";
const VERSION = "2026-05-07.spherical-texture-unwrap-polar-blend-v11";
const RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";

const RETIRED_CANVAS_CONTRACTS = Object.freeze([
  "AUDRALIA_CANVAS_RUNTIME_BACKED_ORTHOGRAPHIC_REALISM_TNT_v9",
  "AUDRALIA_CANVAS_RENDER_ONLY_ORTHOGRAPHIC_REALISM_TNT_v10",
  "AUDRALIA_CANVAS_FAIL_OPEN_ORTHOGRAPHIC_FIRST_PAINT_TNT_v7",
  "AUDRALIA_CANVAS_INTERACTION_SAFE_ORTHOGRAPHIC_4K_TNT_v6",
  "AUDRALIA_CANVAS_AUTHORITY_INTERACTION_FREEZE_REPAIR_TNT_v5",
  "AUDRALIA_CANVAS_AUTHORITY_RICH_PLANET_RENDER_TNT_v1"
]);

const PLANET = Object.freeze({
  name: "Audralia",
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  runtimeReceipt: RUNTIME_RECEIPT,
  autoBoot: false,
  routeOwnsCall: true,
  canvasOwnsVisibleRender: true,
  renderMode: "runtime-backed-spherical-orthographic-unwrap",
  projectionModel: "per-pixel-orthographic-sphere",
  textureModel: "runtime-sampled-equirectangular-source",
  polarModel: "curved-polar-blend-no-rectangular-strip",
  interactionSafety: "canvas-pointer-events-none-frame-rate-capped",
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  routeDoesNotOwn: Object.freeze([
    "canvas_paint",
    "runtime_truth",
    "topology",
    "terrain",
    "hydration",
    "oceans",
    "deep_ocean",
    "gauges_scoring"
  ]),
  canvasDoesNotOwn: Object.freeze([
    "route_shell",
    "html_shell",
    "runtime_truth",
    "topology",
    "terrain",
    "hydration",
    "oceans",
    "deep_ocean",
    "gauges_scoring"
  ])
});

const DEFAULTS = Object.freeze({
  textureWidth: 384,
  textureHeight: 192,
  maxRenderSize: 880,
  minRenderSize: 320,
  radiusRatio: 0.382,
  targetFps: 24,
  rotationSpeed: 0.0038,
  axialTiltDegrees: -8.5,
  lightX: -0.44,
  lightY: -0.36,
  lightZ: 0.82,
  atmosphereStrength: 0.42,
  edgeContrast: 0.16,
  landContrast: 0.18,
  waterContrast: 0.12,
  polarBlendStrength: 0.84,
  cloudOpacity: 0.15,
  labelEnabled: true
});

let activeController = null;
let cachedRuntimeModule = null;
let cachedRuntimeObject = null;

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

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, seed = 0, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2.01;
  }

  return total / Math.max(0.000001, normalizer);
}

function color(r, g, b, a = 255) {
  return [
    clamp(Math.round(r), 0, 255),
    clamp(Math.round(g), 0, 255),
    clamp(Math.round(b), 0, 255),
    clamp(Math.round(a), 0, 255)
  ];
}

function mixColor(a, b, amount) {
  const t = clamp01(amount);
  return color(
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t),
    mix(a[3] === undefined ? 255 : a[3], b[3] === undefined ? 255 : b[3], t)
  );
}

function shadeColor(input, factor) {
  return color(
    input[0] * factor,
    input[1] * factor,
    input[2] * factor,
    input[3] === undefined ? 255 : input[3]
  );
}

function colorLuma(input) {
  return (
    input[0] * 0.2126 +
    input[1] * 0.7152 +
    input[2] * 0.0722
  ) / 255;
}

function normalizeOptions(options = {}) {
  return Object.freeze({
    ...DEFAULTS,
    ...options,
    textureWidth: clamp(Math.floor(Number(options.textureWidth) || DEFAULTS.textureWidth), 192, 768),
    textureHeight: clamp(Math.floor(Number(options.textureHeight) || DEFAULTS.textureHeight), 96, 384),
    maxRenderSize: clamp(Math.floor(Number(options.maxRenderSize) || DEFAULTS.maxRenderSize), 420, 960),
    minRenderSize: clamp(Math.floor(Number(options.minRenderSize) || DEFAULTS.minRenderSize), 260, 420),
    radiusRatio: clamp(Number(options.radiusRatio) || DEFAULTS.radiusRatio, 0.32, 0.44),
    targetFps: clamp(Number(options.targetFps) || DEFAULTS.targetFps, 12, 30),
    rotationSpeed: clamp(Number(options.rotationSpeed) || DEFAULTS.rotationSpeed, 0.001, 0.012),
    atmosphereStrength: clamp(Number(options.atmosphereStrength) || DEFAULTS.atmosphereStrength, 0, 0.9),
    edgeContrast: clamp(Number(options.edgeContrast) || DEFAULTS.edgeContrast, 0, 0.32),
    landContrast: clamp(Number(options.landContrast) || DEFAULTS.landContrast, 0, 0.42),
    waterContrast: clamp(Number(options.waterContrast) || DEFAULTS.waterContrast, 0, 0.32),
    polarBlendStrength: clamp(Number(options.polarBlendStrength) || DEFAULTS.polarBlendStrength, 0, 1),
    cloudOpacity: clamp(Number(options.cloudOpacity) || DEFAULTS.cloudOpacity, 0, 0.28),
    labelEnabled: options.labelEnabled === undefined ? DEFAULTS.labelEnabled : Boolean(options.labelEnabled)
  });
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
    "#audralia-canvas-mount",
    "[data-audralia-canvas-mount]",
    "#audralia-mount",
    "[data-audralia-mount]",
    "[data-audralia-render-mount]",
    "#audralia-main",
    "main"
  ];

  for (const selector of selectors) {
    const selected = document.querySelector(selector);
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

  for (const selector of selectors) {
    const node = document.querySelector(selector);

    if (!node) continue;

    node.textContent = message;
    node.setAttribute("data-audralia-canvas-loaded", "true");
    node.setAttribute("data-audralia-canvas-receipt", RECEIPT);
    node.setAttribute("data-audralia-canvas-contract", CONTRACT);
    return node;
  }

  return null;
}

function removeResidue() {
  const staleExactText = new Set([
    "Loading Audralia",
    "Audralia canvas authority import failed.",
    "Audralia canvas authority import failed. missing ) after argument list",
    "Canvas authority imported · no render export found",
    "Audralia canvas authority imported, but no render export was found.",
    "Audralia doorway is loading the current adopted canvas authority."
  ]);

  const nodes = document.querySelectorAll("p, div, span, li, h2, h3");

  for (const node of nodes) {
    const text = (node.textContent || "").trim();

    if (node.children.length === 0 && staleExactText.has(text)) {
      node.remove();
    }
  }
}

function createCanvasShell(mount) {
  removeResidue();

  const shell = document.createElement("section");
  shell.className = "audralia-canvas-authority-shell";
  shell.setAttribute("data-audralia-canvas-authority", "true");
  shell.setAttribute("data-audralia-receipt", RECEIPT);
  shell.setAttribute("data-audralia-contract", CONTRACT);
  shell.setAttribute("data-audralia-version", VERSION);
  shell.setAttribute("data-audralia-runtime", RUNTIME_RECEIPT);
  shell.style.width = "min(100%, 960px)";
  shell.style.margin = "0 auto";
  shell.style.display = "grid";
  shell.style.placeItems = "center";
  shell.style.gap = "12px";
  shell.style.isolation = "isolate";

  const frame = document.createElement("div");
  frame.className = "audralia-canvas-frame";
  frame.setAttribute("data-audralia-canvas-frame", "spherical-unwrap-polar-blend-v11");
  frame.style.width = "min(92vw, 820px)";
  frame.style.aspectRatio = "1 / 1";
  frame.style.position = "relative";
  frame.style.overflow = "hidden";
  frame.style.borderRadius = "30px";
  frame.style.border = "1px solid rgba(231, 204, 142, 0.30)";
  frame.style.background = "radial-gradient(circle at 50% 45%, rgba(16, 36, 62, 0.98), rgba(2, 7, 19, 1) 70%)";
  frame.style.boxShadow = "0 30px 96px rgba(0, 0, 0, 0.52), inset 0 0 88px rgba(136, 195, 255, 0.09)";
  frame.style.userSelect = "none";
  frame.style.touchAction = "pan-y";

  const canvas = document.createElement("canvas");
  canvas.className = "audralia-world-body-canvas";
  canvas.setAttribute("data-audralia-canvas", "true");
  canvas.setAttribute("data-audralia-canvas-contract", CONTRACT);
  canvas.setAttribute("data-audralia-canvas-receipt", RECEIPT);
  canvas.setAttribute("aria-label", "Audralia spherical orthographic planet canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.pointerEvents = "none";
  canvas.style.userSelect = "none";
  canvas.style.webkitUserSelect = "none";
  canvas.style.touchAction = "pan-y";

  const proof = document.createElement("p");
  proof.className = "audralia-canvas-receipt-visible";
  proof.setAttribute("data-audralia-canvas-visible-receipt", "true");
  proof.textContent = RECEIPT;
  proof.style.margin = "0";
  proof.style.color = "rgba(245, 233, 199, 0.88)";
  proof.style.font = "800 0.74rem/1.35 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  proof.style.letterSpacing = "0.08em";
  proof.style.textTransform = "uppercase";
  proof.style.textAlign = "center";
  proof.style.overflowWrap = "anywhere";

  const ownedNodes = mount.querySelectorAll("[data-audralia-canvas-authority='true']");
  for (const node of ownedNodes) node.remove();

  if (
    mount.id === "audralia-canvas-mount" ||
    mount.hasAttribute("data-audralia-canvas-mount") ||
    mount.hasAttribute("data-audralia-render-mount")
  ) {
    mount.replaceChildren();
  }

  frame.appendChild(canvas);
  shell.appendChild(frame);
  shell.appendChild(proof);
  mount.prepend(shell);

  return { shell, frame, canvas, proof };
}

function setupCanvas(canvas, frame, options) {
  const rect = frame.getBoundingClientRect();
  const fallbackCssSize = Math.min(window.innerWidth || 760, 820);
  const cssSize = clamp(
    Math.floor(Math.min(rect.width || fallbackCssSize, rect.height || fallbackCssSize)),
    options.minRenderSize,
    options.maxRenderSize
  );

  const deviceRatio = clamp(window.devicePixelRatio || 1, 1, 2.15);
  const pixelSize = clamp(Math.floor(cssSize * deviceRatio), options.minRenderSize, options.maxRenderSize);

  canvas.width = pixelSize;
  canvas.height = pixelSize;
  canvas.setAttribute("data-pixel-size", String(pixelSize));
  canvas.setAttribute("data-css-size", String(cssSize));
  canvas.setAttribute("data-pixel-ratio-effective", String((pixelSize / cssSize).toFixed(3)));

  const ctx = canvas.getContext("2d", {
    alpha: true,
    desynchronized: true,
    willReadFrequently: false
  });

  if (!ctx) {
    throw new Error("AUDRALIA_CANVAS_CONTEXT_UNAVAILABLE");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  return { ctx, size: pixelSize, cssSize, ratio: pixelSize / cssSize };
}

function createTexture(width, height, source, status) {
  return {
    width,
    height,
    data: new Uint8ClampedArray(width * height * 4),
    classData: new Uint8Array(width * height),
    source,
    status
  };
}

function classifyRuntimeSample(sample) {
  const text = String(
    sample?.visualSurfaceClass ||
    sample?.surfaceClass ||
    sample?.className ||
    sample?.type ||
    ""
  ).toLowerCase();

  const ice = Boolean(
    sample?.ice ||
    sample?.glacier ||
    text.includes("ice") ||
    text.includes("snow") ||
    text.includes("glacier")
  );

  const water = Boolean(
    sample?.liquidWater ||
    sample?.water ||
    sample?.ocean ||
    sample?.shelf ||
    text.includes("water") ||
    text.includes("ocean") ||
    text.includes("shelf")
  );

  const land = Boolean(
    sample?.land ||
    sample?.exposedTerrainLand ||
    sample?.visibleLand ||
    sample?.solidSurfaceLand ||
    text.includes("land") ||
    text.includes("terrain")
  ) && !water && !ice;

  const shelf = Boolean(
    sample?.shelf ||
    text.includes("shelf") ||
    Number(sample?.shelfIndex || 0) > 0.26 ||
    Number(sample?.turquoiseIndex || sample?.turquoise || 0) > 0.25
  ) && water;

  if (ice) return 3;
  if (shelf) return 2;
  if (water) return 1;
  if (land) return 4;
  return 1;
}

function sampleToColor(sample, u, v, cls) {
  const latAbs = Math.abs(1 - v * 2);
  const elevation = clamp01(Number(sample?.elevation ?? sample?.maxElevation ?? sample?.terrainRelief ?? 0));
  const depth = clamp01(Number(sample?.depth ?? sample?.maxDepth ?? sample?.oceanDepth ?? 0.45));
  const mineral = clamp01(Number(sample?.mineralIndex ?? sample?.diamondSignal ?? 0.34));
  const mountain = clamp01(Number(sample?.mountainIndex ?? elevation));
  const cliff = clamp01(Number(sample?.coastalCliffIndex ?? sample?.cliff ?? 0));
  const turquoise = clamp01(Number(sample?.turquoiseIndex ?? sample?.turquoise ?? sample?.visibleTurquoiseIndex ?? 0));
  const snow = clamp01(Number(sample?.glacierPermission ?? sample?.snowPermission ?? (cls === 3 ? 1 : 0)));
  const reliefNoise =
    fbm(u * 34.0 + 2.1, v * 34.0 - 5.4, 9101, 4) * 0.52 +
    fbm(u * 88.0 - 4.6, v * 64.0 + 6.2, 9131, 3) * 0.22;

  if (cls === 3) {
    const base = mixColor(
      color(206, 226, 222),
      color(246, 251, 255),
      clamp01(0.45 + snow * 0.42 + reliefNoise * 0.20)
    );
    return mixColor(base, color(132, 174, 194), clamp01(latAbs * 0.10));
  }

  if (cls === 2) {
    const base = mixColor(
      color(40, 143, 169),
      color(88, 205, 199),
      clamp01(0.42 + turquoise * 0.42 + reliefNoise * 0.16)
    );
    return mixColor(base, color(232, 218, 156), clamp01(Number(sample?.beach || sample?.coastal ? 0.16 : 0)));
  }

  if (cls === 1) {
    const deep = color(6, 25, 69);
    const mid = color(18, 83, 135);
    const surface = color(38, 132, 167);
    let base = mixColor(surface, mid, clamp01(depth * 0.62));
    base = mixColor(base, deep, clamp01(depth * 0.56));
    base = mixColor(base, color(23, 61, 112), clamp01(reliefNoise * 0.14));
    return base;
  }

  const green = color(71, 109, 81);
  const olive = color(126, 129, 84);
  const stone = color(145, 128, 91);
  const high = color(205, 194, 150);
  let base = mixColor(green, olive, clamp01(elevation * 0.42 + mineral * 0.28));
  base = mixColor(base, stone, clamp01(mineral * 0.28 + reliefNoise * 0.14));
  base = mixColor(base, high, clamp01(mountain * 0.22 + cliff * 0.14));
  base = mixColor(base, color(62, 94, 83), clamp01((1 - elevation) * 0.08));
  return base;
}

async function loadRuntimeModule() {
  if (cachedRuntimeModule) return cachedRuntimeModule;

  const cache = `${CONTRACT}_${Date.now()}`;

  cachedRuntimeModule = await import(`/assets/audralia/audralia.runtime.js?canvas=${cache}`);
  return cachedRuntimeModule;
}

async function getRuntimeObject() {
  if (cachedRuntimeObject) return cachedRuntimeObject;

  const runtimeModule = await loadRuntimeModule();

  if (typeof runtimeModule.createAudraliaRuntimeAsync === "function") {
    cachedRuntimeObject = await runtimeModule.createAudraliaRuntimeAsync();
  } else if (typeof runtimeModule.createAudraliaRuntime === "function") {
    cachedRuntimeObject = runtimeModule.createAudraliaRuntime();
  } else if (typeof runtimeModule.default === "function") {
    cachedRuntimeObject = runtimeModule.default();
  } else {
    cachedRuntimeObject = runtimeModule;
  }

  return cachedRuntimeObject;
}

function selectRuntimeSampler(runtimeObject, runtimeModule) {
  const candidates = [
    runtimeObject?.sampleSurface,
    runtimeObject?.sampleAudraliaSurface,
    runtimeObject?.sampleAudraliaPlanetState,
    runtimeObject?.sampleRuntimeState,
    runtimeObject?.sampleAudraliaRuntime,
    runtimeObject?.buildRuntimeField,
    runtimeModule?.sampleSurface,
    runtimeModule?.sampleAudraliaSurface,
    runtimeModule?.sampleAudraliaPlanetState,
    runtimeModule?.sampleRuntimeState,
    runtimeModule?.sampleAudraliaRuntime,
    runtimeModule?.buildRuntimeField
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

function fallbackSurfaceSample(lat, lon, u, v) {
  const polar = Math.abs(Math.sin(lat)) > 0.86;
  const n1 = fbm(u * 3.4 + 1.2, v * 3.4 - 2.8, 7001, 5);
  const n2 = fbm(u * 9.0 - 4.1, v * 7.0 + 3.3, 7031, 4);
  const continental = n1 * 0.62 + n2 * 0.30 + (1 - Math.abs(0.5 - v) * 1.3) * 0.12;
  const land = continental > 0.61 && !polar;
  const shelf = continental > 0.55 && continental <= 0.61 && !polar;
  const water = !land && !polar;
  const depth = water ? clamp01(0.42 + (1 - continental) * 0.55) : 0;

  return {
    ok: true,
    source: "canvas-fail-open-spherical-texture",
    lat,
    lon,
    u,
    v,
    ice: polar,
    glacier: polar,
    water,
    liquidWater: water || shelf,
    ocean: water && !shelf,
    shelf,
    land,
    exposedTerrainLand: land,
    solidSurfaceLand: land || polar,
    elevation: land ? clamp01(0.18 + continental * 0.64) : polar ? 0.25 : 0,
    depth,
    mineralIndex: land ? clamp01(0.30 + n2 * 0.45) : 0.1,
    mountainIndex: land ? clamp01(n2 * 0.55) : 0,
    coastal: shelf,
    beach: shelf,
    turquoiseIndex: shelf ? 0.56 : 0.08,
    visualSurfaceClass: polar
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface"
  };
}

function writeTexturePixel(texture, index, rgba, cls) {
  const out = index * 4;
  texture.data[out] = rgba[0];
  texture.data[out + 1] = rgba[1];
  texture.data[out + 2] = rgba[2];
  texture.data[out + 3] = rgba[3] === undefined ? 255 : rgba[3];
  texture.classData[index] = cls;
}

function getTexturePixel(texture, x, y) {
  const safeX = ((x % texture.width) + texture.width) % texture.width;
  const safeY = clamp(y, 0, texture.height - 1);
  const index = (safeY * texture.width + safeX) * 4;

  return [
    texture.data[index],
    texture.data[index + 1],
    texture.data[index + 2],
    texture.data[index + 3]
  ];
}

function setTexturePixel(texture, x, y, rgba) {
  const safeX = ((x % texture.width) + texture.width) % texture.width;
  const safeY = clamp(y, 0, texture.height - 1);
  const index = (safeY * texture.width + safeX) * 4;

  texture.data[index] = rgba[0];
  texture.data[index + 1] = rgba[1];
  texture.data[index + 2] = rgba[2];
  texture.data[index + 3] = rgba[3] === undefined ? 255 : rgba[3];
}

function applyTextureEdgePass(texture, options) {
  const copy = new Uint8ClampedArray(texture.data);
  const width = texture.width;
  const height = texture.height;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      const cls = texture.classData[index];

      const left = texture.classData[y * width + ((x - 1 + width) % width)];
      const right = texture.classData[y * width + ((x + 1) % width)];
      const up = texture.classData[(y - 1) * width + x];
      const down = texture.classData[(y + 1) * width + x];

      const hasWaterNeighbor = left === 1 || right === 1 || up === 1 || down === 1 || left === 2 || right === 2 || up === 2 || down === 2;
      const hasLandNeighbor = left === 4 || right === 4 || up === 4 || down === 4;
      const hasIceNeighbor = left === 3 || right === 3 || up === 3 || down === 3;

      const baseIndex = index * 4;
      let next = [
        copy[baseIndex],
        copy[baseIndex + 1],
        copy[baseIndex + 2],
        copy[baseIndex + 3]
      ];

      if (cls === 4 && hasWaterNeighbor) {
        next = mixColor(next, color(220, 198, 135), 0.22 + options.edgeContrast * 0.4);
      }

      if ((cls === 1 || cls === 2) && hasLandNeighbor) {
        next = mixColor(next, color(60, 190, 196), 0.16 + options.edgeContrast * 0.36);
      }

      if (cls === 3 && (hasWaterNeighbor || hasLandNeighbor)) {
        next = mixColor(next, color(228, 239, 240), 0.26);
      }

      if ((cls === 1 || cls === 2) && hasIceNeighbor) {
        next = mixColor(next, color(148, 198, 217), 0.14);
      }

      setTexturePixel(texture, x, y, next);
    }
  }

  texture.edgePass = true;
  return texture;
}

async function buildRuntimeTexture(options) {
  const texture = createTexture(
    options.textureWidth,
    options.textureHeight,
    "runtime",
    {
      runtimeImported: false,
      runtimeSamplerReady: false,
      runtimeError: "",
      fallback: false
    }
  );

  let runtimeModule = null;
  let runtimeObject = null;
  let sampler = null;

  try {
    runtimeModule = await loadRuntimeModule();
    runtimeObject = await getRuntimeObject();
    sampler = selectRuntimeSampler(runtimeObject, runtimeModule);

    if (!sampler) {
      throw new Error("AUDRALIA_RUNTIME_SAMPLER_NOT_FOUND");
    }

    texture.status.runtimeImported = true;
    texture.status.runtimeSamplerReady = true;
  } catch (error) {
    texture.source = "fallback";
    texture.status.runtimeError = String(error?.message || error || "runtime import failed");
    texture.status.fallback = true;
  }

  let waterPixels = 0;
  let landPixels = 0;
  let shelfPixels = 0;
  let icePixels = 0;

  for (let y = 0; y < texture.height; y += 1) {
    const v = texture.height === 1 ? 0.5 : y / (texture.height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let x = 0; x < texture.width; x += 1) {
      const u = texture.width === 1 ? 0.5 : x / texture.width;
      const lon = (u - 0.5) * Math.PI * 2;

      let sample;

      if (sampler) {
        try {
          sample = sampler.call(runtimeObject || runtimeModule, { lat, lon, u, v }, lon, u, v);
        } catch (_) {
          sample = null;
        }
      }

      if (!sample || typeof sample !== "object") {
        sample = fallbackSurfaceSample(lat, lon, u, v);
        texture.status.fallback = true;
      }

      const cls = classifyRuntimeSample(sample);
      const rgba = sampleToColor(sample, u, v, cls);
      const index = y * texture.width + x;

      writeTexturePixel(texture, index, rgba, cls);

      if (cls === 1) waterPixels += 1;
      if (cls === 2) shelfPixels += 1;
      if (cls === 3) icePixels += 1;
      if (cls === 4) landPixels += 1;
    }
  }

  applyTextureEdgePass(texture, options);

  texture.status.waterPixels = waterPixels;
  texture.status.shelfPixels = shelfPixels;
  texture.status.icePixels = icePixels;
  texture.status.landPixels = landPixels;
  texture.status.waterRatio = waterPixels / Math.max(1, texture.width * texture.height);
  texture.status.shelfRatio = shelfPixels / Math.max(1, texture.width * texture.height);
  texture.status.iceRatio = icePixels / Math.max(1, texture.width * texture.height);
  texture.status.landRatio = landPixels / Math.max(1, texture.width * texture.height);

  return texture;
}

function buildFallbackTexture(options) {
  const texture = createTexture(
    options.textureWidth,
    options.textureHeight,
    "fallback",
    {
      runtimeImported: false,
      runtimeSamplerReady: false,
      runtimeError: "",
      fallback: true
    }
  );

  for (let y = 0; y < texture.height; y += 1) {
    const v = texture.height === 1 ? 0.5 : y / (texture.height - 1);
    const lat = (0.5 - v) * Math.PI;

    for (let x = 0; x < texture.width; x += 1) {
      const u = texture.width === 1 ? 0.5 : x / texture.width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = fallbackSurfaceSample(lat, lon, u, v);
      const cls = classifyRuntimeSample(sample);
      const rgba = sampleToColor(sample, u, v, cls);
      const index = y * texture.width + x;

      writeTexturePixel(texture, index, rgba, cls);
    }
  }

  applyTextureEdgePass(texture, options);
  return texture;
}

function sampleTexture(texture, uInput, vInput) {
  const u = wrap01(uInput);
  const v = clamp01(vInput);

  const x = u * texture.width;
  const y = v * (texture.height - 1);

  const x0 = Math.floor(x) % texture.width;
  const x1 = (x0 + 1) % texture.width;
  const y0 = clamp(Math.floor(y), 0, texture.height - 1);
  const y1 = clamp(y0 + 1, 0, texture.height - 1);

  const tx = fract(x);
  const ty = fract(y);

  const c00 = getTexturePixel(texture, x0, y0);
  const c10 = getTexturePixel(texture, x1, y0);
  const c01 = getTexturePixel(texture, x0, y1);
  const c11 = getTexturePixel(texture, x1, y1);

  const top = mixColor(c00, c10, tx);
  const bottom = mixColor(c01, c11, tx);

  return mixColor(top, bottom, ty);
}

function drawStarField(ctx, size, time) {
  ctx.save();
  ctx.fillStyle = "#020713";
  ctx.fillRect(0, 0, size, size);

  for (let index = 0; index < 150; index += 1) {
    const x = hash2(index, 11.7, 21) * size;
    const y = hash2(index, 19.3, 22) * size;
    const pulse = 0.22 + 0.50 * Math.abs(Math.sin(time * 0.001 + index * 0.87));

    ctx.globalAlpha = pulse;
    ctx.fillStyle = index % 9 === 0 ? "rgba(245, 221, 166, 0.82)" : "rgba(185, 216, 255, 0.68)";
    ctx.beginPath();
    ctx.arc(x, y, index % 17 === 0 ? size * 0.0017 : size * 0.001, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOrbitalFrame(ctx, size, time, options) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * options.radiusRatio;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 0.00018) * 0.12);

  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      radius * (1.09 + index * 0.05),
      radius * (0.18 + index * 0.018),
      0,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = index % 2 === 0 ? "rgba(240, 211, 138, 0.095)" : "rgba(127, 194, 255, 0.085)";
    ctx.lineWidth = Math.max(1, size * 0.0012);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSphericalTexture(ctx, state, time) {
  const size = state.size;
  const texture = state.texture;
  const options = state.options;
  const radius = size * options.radiusRatio;
  const cx = size / 2;
  const cy = size / 2;
  const lightLength = Math.hypot(options.lightX, options.lightY, options.lightZ) || 1;
  const lightX = options.lightX / lightLength;
  const lightY = options.lightY / lightLength;
  const lightZ = options.lightZ / lightLength;
  const tilt = options.axialTiltDegrees * Math.PI / 180;
  const phase = wrap01(state.phase);
  const image = ctx.createImageData(size, size);
  const data = image.data;

  let sampledPixels = 0;
  let waterLikePixels = 0;
  let landLikePixels = 0;
  let iceLikePixels = 0;

  const sinTilt = Math.sin(tilt);
  const cosTilt = Math.cos(tilt);

  const minX = Math.max(0, Math.floor(cx - radius - 2));
  const maxX = Math.min(size - 1, Math.ceil(cx + radius + 2));
  const minY = Math.max(0, Math.floor(cy - radius - 2));
  const maxY = Math.min(size - 1, Math.ceil(cy + radius + 2));

  for (let py = minY; py <= maxY; py += 1) {
    const nyScreen = (py + 0.5 - cy) / radius;

    for (let px = minX; px <= maxX; px += 1) {
      const nx = (px + 0.5 - cx) / radius;
      const r2 = nx * nx + nyScreen * nyScreen;

      if (r2 > 1) continue;

      const zScreen = Math.sqrt(Math.max(0, 1 - r2));
      const yTilted = nyScreen * cosTilt + zScreen * sinTilt;
      const zTilted = -nyScreen * sinTilt + zScreen * cosTilt;

      const lat = Math.asin(clamp(-yTilted, -1, 1));
      const lon = Math.atan2(nx, zTilted);

      const u = wrap01(phase + lon / (Math.PI * 2));
      const v = clamp01(0.5 - lat / Math.PI);
      const polar = smoothstep(0.72, 0.985, Math.abs(Math.sin(lat)));

      let base = sampleTexture(texture, u, v);

      const detail =
        fbm(u * 42.0 + phase * 8.0, v * 36.0 - phase * 3.0, 1191, 3) * 0.58 +
        fbm(u * 130.0 - 8.0, v * 96.0 + 4.0, 1229, 2) * 0.20;

      const luma = colorLuma(base);
      const isWaterish = base[2] > base[0] * 1.08 && base[2] > base[1] * 0.72;
      const isIceish = base[0] > 180 && base[1] > 180 && base[2] > 180;
      const isLandish = !isWaterish && !isIceish && base[1] >= base[2] * 0.72;

      if (isWaterish) {
        waterLikePixels += 1;
        base = mixColor(base, shadeColor(base, 0.82), options.waterContrast * (1 - detail) * 0.45);
        base = mixColor(base, color(22, 88, 132), clamp01(detail * 0.08));
      }

      if (isLandish) {
        landLikePixels += 1;
        base = mixColor(base, shadeColor(base, 1.16), options.landContrast * detail * 0.56);
        base = mixColor(base, color(194, 174, 116), clamp01((detail - 0.52) * 0.16));
      }

      if (isIceish) {
        iceLikePixels += 1;
      }

      if (polar > 0.01) {
        const polarIce = mixColor(
          color(206, 224, 220),
          color(245, 250, 255),
          clamp01(0.52 + detail * 0.30)
        );

        const polarOceanBlue = color(50, 91, 118);
        const polarBlendColor = isWaterish ? mixColor(polarOceanBlue, polarIce, 0.42) : polarIce;
        const polarAmount = polar * options.polarBlendStrength * (isIceish ? 0.42 : 0.72);

        base = mixColor(base, polarBlendColor, polarAmount);
      }

      const dot = clamp(nx * lightX + (-nyScreen) * lightY + zScreen * lightZ, -1, 1);
      const shade = clamp(0.62 + dot * 0.44, 0.30, 1.12);
      const rim = smoothstep(0.62, 1.0, r2);
      const limbDark = clamp(1 - rim * 0.54, 0.42, 1);
      const highlight = smoothstep(0.92, 1.0, dot) * 0.08;

      let finalColor = shadeColor(base, shade * limbDark);
      finalColor = mixColor(finalColor, color(255, 255, 255), highlight);

      const atmosphere = rim * options.atmosphereStrength;
      finalColor = mixColor(finalColor, color(98, 176, 224), atmosphere * 0.24);

      const out = (py * size + px) * 4;
      data[out] = finalColor[0];
      data[out + 1] = finalColor[1];
      data[out + 2] = finalColor[2];
      data[out + 3] = 255;

      sampledPixels += 1;
    }
  }

  ctx.putImageData(image, 0, 0);

  state.lastFrameStats = {
    sampledPixels,
    waterLikePixels,
    landLikePixels,
    iceLikePixels,
    waterLikeRatio: waterLikePixels / Math.max(1, sampledPixels),
    landLikeRatio: landLikePixels / Math.max(1, sampledPixels),
    iceLikeRatio: iceLikePixels / Math.max(1, sampledPixels)
  };
}

function drawClouds(ctx, state, time) {
  const options = state.options;
  if (options.cloudOpacity <= 0) return;

  const size = state.size;
  const radius = size * options.radiusRatio;
  const cx = size / 2;
  const cy = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.globalAlpha = options.cloudOpacity;
  ctx.strokeStyle = "rgba(245, 250, 255, 0.56)";
  ctx.lineWidth = Math.max(1, size * 0.0016);

  for (let band = 0; band < 9; band += 1) {
    const yNorm = -0.62 + band * 0.155;
    const y = cy + yNorm * radius;
    const chord = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
    const left = cx - chord * radius;
    const right = cx + chord * radius;
    const phase = time * 0.001 + band * 1.7;

    ctx.beginPath();

    for (let x = left; x <= right; x += Math.max(5, size * 0.012)) {
      const local = (x - left) / Math.max(1, right - left);
      const wave = Math.sin(local * Math.PI * 4.4 + phase) * radius * 0.012;
      const ripple = Math.cos(local * Math.PI * 8.3 - phase * 0.7) * radius * 0.006;
      const yy = y + wave + ripple;

      if (x === left) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function drawAtmosphere(ctx, state, time) {
  const size = state.size;
  const options = state.options;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * options.radiusRatio;

  ctx.save();

  const glow = ctx.createRadialGradient(
    cx - radius * 0.32,
    cy - radius * 0.34,
    radius * 0.02,
    cx,
    cy,
    radius * 1.13
  );

  glow.addColorStop(0, "rgba(255,255,255,0.10)");
  glow.addColorStop(0.34, "rgba(255,255,255,0.025)");
  glow.addColorStop(0.72, "rgba(0,0,0,0.10)");
  glow.addColorStop(1, "rgba(0,0,0,0.42)");

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = glow;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();

  ctx.save();

  const pulse = 0.32 + Math.sin(time * 0.0012) * 0.035;

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.003), 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(154, 211, 255, ${pulse.toFixed(3)})`;
  ctx.lineWidth = Math.max(1, size * 0.006);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(2, size * 0.011), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(71, 134, 189, 0.12)";
  ctx.lineWidth = Math.max(1, size * 0.004);
  ctx.stroke();

  ctx.restore();
}

function drawLabel(ctx, state) {
  if (!state.options.labelEnabled) return;

  const size = state.size;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.82)";
  ctx.shadowBlur = Math.max(4, size * 0.01);
  ctx.shadowOffsetY = Math.max(1, size * 0.003);

  ctx.fillStyle = "rgba(255, 226, 155, 0.95)";
  ctx.font = `900 ${Math.max(16, size * 0.027)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("AUDRALIA", size / 2, size * 0.816);

  ctx.fillStyle = "rgba(210, 226, 244, 0.82)";
  ctx.font = `800 ${Math.max(9, size * 0.015)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText("SPHERICAL UNWRAP · POLAR BLEND V11", size / 2, size * 0.842);

  ctx.restore();
}

function samplePixelProof(ctx, size) {
  try {
    const center = ctx.getImageData(Math.floor(size / 2), Math.floor(size / 2), 1, 1).data;
    const upper = ctx.getImageData(Math.floor(size / 2), Math.floor(size * 0.22), 1, 1).data;
    const lower = ctx.getImageData(Math.floor(size / 2), Math.floor(size * 0.78), 1, 1).data;

    return {
      center: {
        r: center[0],
        g: center[1],
        b: center[2],
        a: center[3]
      },
      upper: {
        r: upper[0],
        g: upper[1],
        b: upper[2],
        a: upper[3]
      },
      lower: {
        r: lower[0],
        g: lower[1],
        b: lower[2],
        a: lower[3]
      },
      notBlank:
        center[3] > 0 &&
        center[0] + center[1] + center[2] > 12
    };
  } catch (error) {
    return {
      notBlank: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function publishStatus(state, extra = {}) {
  const textureStatus = state.texture?.status || {};

  const status = {
    ok: true,
    loaded: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    runtimeReceipt: RUNTIME_RECEIPT,
    retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
    canonicalExport: "mountAudraliaCanvas",
    renderMode: PLANET.renderMode,
    projectionModel: PLANET.projectionModel,
    textureModel: PLANET.textureModel,
    polarModel: PLANET.polarModel,
    routeOwnsCall: true,
    canvasPresent: Boolean(state.canvas),
    mountPresent: Boolean(state.mount),
    animated: true,
    frameCount: state.frameCount || 0,
    textureSource: state.texture?.source || "unknown",
    runtimeImported: Boolean(textureStatus.runtimeImported),
    runtimeSamplerReady: Boolean(textureStatus.runtimeSamplerReady),
    runtimeError: textureStatus.runtimeError || "",
    fallbackTexture: Boolean(textureStatus.fallback),
    textureStatus,
    frameStats: state.lastFrameStats || null,
    pixelProof: state.pixelProof || null,
    routeStatusGateActive: true,
    sphericalUnwrapActive: true,
    polarBlendActive: true,
    rectangularPolarStripSuppressed: true,
    horizontalBandingReduction: true,
    interactionFreezeGuard: true,
    pointerEventsOnCanvas: "none",
    targetFps: state.options?.targetFps || DEFAULTS.targetFps,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    ...extra
  };

  if (typeof window !== "undefined") {
    window.__AUDRALIA_CANVAS_STATUS__ = status;
    window.__AUDRALIA_ADOPTED_CANVAS_AUTHORITY__ = status;
    window.__AUDRALIA_RICH_PLANET_CANVAS_STATUS__ = status;
    window.AUDRALIA_CANVAS_STATUS = status;
    window.AUDRALIA_CANVAS_RECEIPT = RECEIPT;
    window.AUDRALIA_CANVAS_CONTRACT = CONTRACT;

    try {
      window.dispatchEvent(new CustomEvent("audralia:canvas-authority-status", { detail: status }));
    } catch (_) {
      /* no-op */
    }
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaCanvasReceipt = RECEIPT;
    document.documentElement.dataset.audraliaCanvasContract = CONTRACT;
    document.documentElement.dataset.audraliaCanvasVersion = VERSION;
    document.documentElement.dataset.audraliaCanvasLoaded = "true";
    document.documentElement.dataset.audraliaCanvasSphericalUnwrap = "true";
    document.documentElement.dataset.audraliaCanvasPolarBlend = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return status;
}

function renderFrame(state, time) {
  const ctx = state.ctx;
  const size = state.size;

  ctx.clearRect(0, 0, size, size);

  drawStarField(ctx, size, time);
  drawOrbitalFrame(ctx, size, time, state.options);
  drawSphericalTexture(ctx, state, time);
  drawClouds(ctx, state, time);
  drawAtmosphere(ctx, state, time);
  drawLabel(ctx, state);

  state.frameCount += 1;

  if (state.frameCount === 1 || state.frameCount === 4 || state.frameCount % 48 === 0) {
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

function startCanvas(target, optionsInput) {
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  stopActiveController();

  const options = normalizeOptions(optionsInput || {});
  const mount = resolveMount(target);
  const nodes = createCanvasShell(mount);
  const setup = setupCanvas(nodes.canvas, nodes.frame, options);
  const fallbackTexture = buildFallbackTexture(options);

  const state = {
    shell: nodes.shell,
    frame: nodes.frame,
    canvas: nodes.canvas,
    proof: nodes.proof,
    ctx: setup.ctx,
    size: setup.size,
    cssSize: setup.cssSize,
    ratio: setup.ratio,
    mount,
    options,
    texture: fallbackTexture,
    frameCount: 0,
    pixelProof: null,
    lastFrameStats: null,
    stopped: false,
    rafId: null,
    resizeTimer: null,
    lastFrameTime: 0,
    phase: 0,
    hidden: document.visibilityState === "hidden"
  };

  function animate(frameTime) {
    if (state.stopped) return;

    if (!state.hidden) {
      const minDelta = 1000 / state.options.targetFps;

      if (!state.lastFrameTime || frameTime - state.lastFrameTime >= minDelta) {
        const delta = state.lastFrameTime ? frameTime - state.lastFrameTime : minDelta;
        state.phase = wrap01(state.phase + delta * state.options.rotationSpeed * 0.001);
        renderFrame(state, frameTime || performance.now());
        state.lastFrameTime = frameTime;
      }
    }

    state.rafId = window.requestAnimationFrame(animate);
  }

  function resize() {
    window.clearTimeout(state.resizeTimer);

    state.resizeTimer = window.setTimeout(() => {
      const next = setupCanvas(state.canvas, state.frame, state.options);
      state.ctx = next.ctx;
      state.size = next.size;
      state.cssSize = next.cssSize;
      state.ratio = next.ratio;
      renderFrame(state, performance.now());
      publishStatus(state, { resized: true });
    }, 140);
  }

  function visibilityChange() {
    state.hidden = document.visibilityState === "hidden";
    if (!state.hidden) {
      state.lastFrameTime = 0;
    }
  }

  state.stop = function stop() {
    state.stopped = true;

    if (state.rafId) {
      window.cancelAnimationFrame(state.rafId);
    }

    window.clearTimeout(state.resizeTimer);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", visibilityChange);
  };

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", visibilityChange, { passive: true });

  activeController = state;

  setRouteStatus(
    [
      "Audralia adopted canvas authority loaded.",
      `Route AUDRALIA_ROUTE_V8_HARD_BIND_CANVAS_V9_CALLER_TNT_v1 · Canvas ${CONTRACT} · Receipt ${RECEIPT} · Runtime ${RUNTIME_RECEIPT} · GraphicBox false · Image generation false · Visual pass claimed false`
    ].join("\n")
  );

  publishStatus(state, { firstPaintMode: "fallback-visible-before-runtime" });
  renderFrame(state, performance.now());

  window.setTimeout(() => {
    buildRuntimeTexture(state.options)
      .then((texture) => {
        if (state.stopped) return;

        state.texture = texture;
        state.frameCount = 0;
        state.lastFrameTime = 0;
        renderFrame(state, performance.now());
        publishStatus(state, {
          runtimeTextureLoaded: true,
          firstPaintMode: "runtime-backed-spherical-texture"
        });
      })
      .catch((error) => {
        if (state.stopped) return;

        publishStatus(state, {
          runtimeTextureLoaded: false,
          runtimeTextureError: String(error?.message || error || "runtime texture error")
        });
      });
  }, 30);

  state.rafId = window.requestAnimationFrame(animate);

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
  return window.__AUDRALIA_CANVAS_STATUS__ || {
    ok: true,
    loaded: false,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    runtimeReceipt: RUNTIME_RECEIPT,
    canonicalExport: "mountAudraliaCanvas",
    sphericalUnwrapActive: true,
    polarBlendActive: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

export function getAudraliaSurfaceDataset() {
  return Object.freeze({
    ...PLANET,
    exports: Object.freeze([
      "mountAudraliaCanvas",
      "renderAudraliaCanvas",
      "bootAudraliaCanvas",
      "createAudraliaCanvas",
      "initAudraliaCanvas",
      "renderAudralia",
      "mountAudralia",
      "render",
      "mount",
      "init",
      "getAudraliaCanvasStatus",
      "getAudraliaSurfaceDataset",
      "stopAudraliaCanvas"
    ]),
    retiredCanvasContracts: RETIRED_CANVAS_CONTRACTS,
    currentStatus: typeof window !== "undefined" ? window.__AUDRALIA_CANVAS_STATUS__ || null : null
  });
}

export function stopAudraliaCanvas() {
  stopActiveController();

  return {
    stopped: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    runtimeReceipt: RUNTIME_RECEIPT,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

const api = Object.freeze({
  RECEIPT,
  CONTRACT,
  VERSION,
  RUNTIME_RECEIPT,
  RETIRED_CANVAS_CONTRACTS,
  PLANET,
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
});

if (typeof window !== "undefined") {
  window.DGBAudraliaCanvasAuthority = api;
  window.AudraliaCanvasAuthority = api;
  window.audraliaCanvasAuthority = api;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.renderAudraliaCanvas = renderAudraliaCanvas;
  window.getAudraliaCanvasStatus = getAudraliaCanvasStatus;
  window.getAudraliaSurfaceDataset = getAudraliaSurfaceDataset;
  window.stopAudraliaCanvas = stopAudraliaCanvas;
  window.AUDRALIA_CANVAS_RECEIPT = RECEIPT;
  window.AUDRALIA_CANVAS_CONTRACT = CONTRACT;
}

export default api;
