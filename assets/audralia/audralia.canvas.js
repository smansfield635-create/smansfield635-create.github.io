/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_CONTAINED_SHELL_OBEDIENCE_TNT_v18
   Full-file replacement.

   Jurisdiction:
   - adopted canvas authority
   - contained-shell obedience
   - shell-only dimension measurement
   - no mount enlargement
   - no page expansion
   - runtime-compatible imports
   - visible land/water/shelf/atmosphere rendering
   - low-lag animation budget
   - pixel proof
   - receipts

   Non-jurisdiction:
   - HTML route shell authorship
   - showroom selector routing
   - topology land/void authority
   - terrain authority
   - hydration authority
   - oceans authority
   - deep-ocean authority
   - Gauges scoring
   - GraphicBox
   - image generation
*/

import RuntimeDefault, {
  sampleSurface as sampleRuntimeSurface,
  getStatus as getRuntimeStatus
} from "./audralia.runtime.js?v=audralia-contained-shell-obedience-v18";

const AUDRALIA_CANVAS_CONTRACT = "AUDRALIA_CANVAS_CONTAINED_SHELL_OBEDIENCE_TNT_v18";
const AUDRALIA_SERVED_SOURCE_CONTRACT = "AUDRALIA_SERVED_SOURCE_ALIGNMENT_TNT_v17";

const AUDRALIA_CANVAS_LEGACY_CONTRACTS = [
  "AUDRALIA_CANVAS_SERVED_SOURCE_ALIGNMENT_TNT_v17",
  "AUDRALIA_CANVAS_EARTH_TEMPLATE_DIMENSION_AUTHORITY_TNT_v15",
  "AUDRALIA_CANVAS_DIMENSION_AUTHORITY_TNT_v14",
  "AUDRALIA_CANVAS_PROOF_CHAIN_ALIGNMENT_TNT_v13",
  "AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v2"
];

const TAU = Math.PI * 2;

const DEFAULT_OPTIONS = {
  rotationSpeed: 0.075,
  initialRotation: -2.15,

  mobileFps: 8,
  balancedFps: 10,
  desktopFps: 14,

  mobileRasterSize: 240,
  balancedRasterSize: 300,
  desktopRasterSize: 360,

  minShellSize: 220,
  fallbackShellSize: 320,
  devicePixelClamp: 1.25,
  renderRadiusScale: 0.455,

  brighten: 1.18,
  waterVisibilityFloor: 0.34,
  landVisibilityFloor: 0.42,
  atmosphereStrength: 0.82
};

let runtimeAuthority = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mixRgb(a, b, t) {
  const u = clamp01(t);

  return [
    Math.round(lerp(a[0], b[0], u)),
    Math.round(lerp(a[1], b[1], u)),
    Math.round(lerp(a[2], b[2], u))
  ];
}

function scaleRgb(rgb, factor) {
  return [
    clamp(Math.round(rgb[0] * factor), 0, 255),
    clamp(Math.round(rgb[1] * factor), 0, 255),
    clamp(Math.round(rgb[2] * factor), 0, 255)
  ];
}

function addRgb(rgb, amount) {
  return [
    clamp(Math.round(rgb[0] + amount), 0, 255),
    clamp(Math.round(rgb[1] + amount), 0, 255),
    clamp(Math.round(rgb[2] + amount), 0, 255)
  ];
}

function wrapLongitude(lon) {
  let out = Number.isFinite(lon) ? lon : 0;
  while (out < -Math.PI) out += TAU;
  while (out > Math.PI) out -= TAU;
  return out;
}

function vec3(x, y, z) {
  return { x, y, z };
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;

  return {
    x: v.x / length,
    y: v.y / length,
    z: v.z / length
  };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function lonLatFromVector(v) {
  return {
    lon: Math.atan2(v.x, v.z),
    lat: Math.asin(clamp(v.y, -1, 1))
  };
}

function waveNoise(lon, lat, scale, phase) {
  const a = Math.sin(lon * scale + phase) * 0.38;
  const b = Math.cos(lat * scale * 0.83 - phase * 0.7) * 0.3;
  const c = Math.sin((lon + lat) * scale * 0.47 + phase * 1.3) * 0.2;
  const d = Math.cos((lon - lat) * scale * 0.31 - phase * 0.4) * 0.12;

  return clamp01(0.5 + 0.5 * (a + b + c + d));
}

function resolveElement(target) {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  if (typeof Element !== "undefined" && target instanceof Element) return target;
  return null;
}

function resolveAudraliaShell(explicitShell) {
  const explicit = resolveElement(explicitShell);
  if (explicit) return explicit;

  return (
    document.querySelector("#audraliaCanvasShell") ||
    document.querySelector("[data-audralia-canvas-shell]") ||
    null
  );
}

function resolveAudraliaMount(explicitMount) {
  const explicit = resolveElement(explicitMount);
  if (explicit) return explicit;

  return (
    document.querySelector("#audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount]") ||
    document.querySelector("[data-audralia-mount]") ||
    document.querySelector("[data-adopted-canvas-mount]") ||
    document.querySelector("#audraliaMount") ||
    null
  );
}

function resolveAudraliaCanvas(explicitCanvas, mount) {
  const explicit = resolveElement(explicitCanvas);
  if (explicit) return explicit;

  return (
    mount?.querySelector("#audraliaCanvas") ||
    mount?.querySelector("canvas[data-audralia-canvas]") ||
    mount?.querySelector("canvas[data-audralia-canvas-authority]") ||
    document.querySelector("#audraliaCanvas") ||
    document.querySelector("canvas[data-audralia-canvas]") ||
    null
  );
}

function getRuntimeAuthority() {
  if (runtimeAuthority) return runtimeAuthority;

  if (RuntimeDefault && typeof RuntimeDefault === "object") {
    runtimeAuthority = RuntimeDefault;
    return runtimeAuthority;
  }

  if (typeof RuntimeDefault === "function") {
    try {
      runtimeAuthority = RuntimeDefault();
      return runtimeAuthority;
    } catch (_) {
      runtimeAuthority = null;
    }
  }

  runtimeAuthority = window.AudraliaRuntimeTruth || window.AUDRALIA_RUNTIME || null;
  return runtimeAuthority;
}

function getRuntimeSampler() {
  const authority = getRuntimeAuthority();

  return (
    authority?.sampleSurface ||
    authority?.sampleAudraliaSurface ||
    authority?.sampleRuntimeState ||
    authority?.sampleAudraliaPlanetState ||
    authority?.sampleAudraliaRuntime ||
    sampleRuntimeSurface ||
    window.sampleAudraliaRuntime ||
    window.sampleAudraliaSurface ||
    null
  );
}

function normalizeSample(raw, lon, lat) {
  const visualSurfaceClass = String(
    raw?.visualSurfaceClass ||
    raw?.surfaceClass ||
    raw?.className ||
    raw?.type ||
    ""
  ).toLowerCase();

  const declaredWater = Boolean(
    raw?.liquidWater ||
    raw?.water ||
    raw?.ocean ||
    raw?.shelf ||
    visualSurfaceClass.includes("ocean") ||
    visualSurfaceClass.includes("water") ||
    visualSurfaceClass.includes("shelf")
  );

  const declaredIce = Boolean(
    raw?.ice ||
    raw?.glacier ||
    visualSurfaceClass.includes("ice") ||
    visualSurfaceClass.includes("snow")
  );

  const declaredLand = Boolean(
    raw?.solidSurfaceLand ||
    raw?.solidSurface ||
    raw?.land ||
    raw?.exposedTerrainLand ||
    visualSurfaceClass.includes("terrain") ||
    visualSurfaceClass.includes("land") ||
    visualSurfaceClass.includes("ridge") ||
    visualSurfaceClass.includes("mountain") ||
    visualSurfaceClass.includes("plateau") ||
    visualSurfaceClass.includes("coastal")
  );

  const isWater = declaredWater && !declaredLand && !declaredIce;
  const isLand = declaredLand && !declaredWater;
  const isIce = declaredIce;

  return {
    ...(raw || {}),
    lon,
    lat,
    visualSurfaceClass,
    fallback: Boolean(raw?.fallback || raw?.fallbackSample || raw?.isFallback),
    isFallback: Boolean(raw?.fallback || raw?.fallbackSample || raw?.isFallback),

    liquidWater: isWater,
    water: isWater,
    ocean: Boolean(raw?.ocean || (isWater && !raw?.shelf)),
    shelf: Boolean(raw?.shelf || visualSurfaceClass.includes("shelf")),
    solidSurfaceLand: isLand || isIce,
    solidSurface: isLand || isIce,
    land: isLand,
    exposedTerrainLand: isLand,
    ice: isIce,
    glacier: Boolean(raw?.glacier || isIce),

    hydration: clamp01(safeNumber(raw?.hydration ?? raw?.hydrationIndex, isWater ? 0.74 : 0.28)),
    hydrationIndex: clamp01(safeNumber(raw?.hydrationIndex ?? raw?.hydration, isWater ? 0.74 : 0.28)),
    shallowShelf: clamp01(safeNumber(raw?.shallowShelf ?? raw?.shelfIndex ?? raw?.shelfSeed, isWater ? 0.24 : 0)),
    shelfIndex: clamp01(safeNumber(raw?.shelfIndex ?? raw?.shallowShelf ?? raw?.shelfSeed, isWater ? 0.24 : 0)),
    terrainRelief: clamp01(safeNumber(raw?.terrainRelief ?? raw?.terrainReliefIndex ?? raw?.elevation, isLand ? 0.32 : 0)),
    terrainReliefIndex: clamp01(safeNumber(raw?.terrainReliefIndex ?? raw?.terrainRelief ?? raw?.elevation, isLand ? 0.32 : 0)),
    coastBand: clamp01(safeNumber(raw?.coastBand ?? raw?.coastlineIndex ?? raw?.coastalFeather, 0)),
    coastlineIndex: clamp01(safeNumber(raw?.coastlineIndex ?? raw?.coastBand ?? raw?.coastalFeather, 0)),
    runoff: clamp01(safeNumber(raw?.runoff ?? raw?.surfaceWaterIndex, 0)),
    mineral: clamp01(safeNumber(raw?.mineral ?? raw?.mineralIndex, isLand ? 0.42 : 0)),
    mineralIndex: clamp01(safeNumber(raw?.mineralIndex ?? raw?.mineral, isLand ? 0.42 : 0)),
    cloudDensity: clamp01(safeNumber(raw?.cloudDensity ?? raw?.cloudCover ?? raw?.climateCloud, 0))
  };
}

function fallbackSample(lon, lat) {
  const body = waveNoise(lon, lat, 3.2, 1.7);
  const ridge = waveNoise(lon, lat, 11.0, 4.6);
  const shelf = body > 0.62 && body <= 0.72;
  const land = body > 0.72;
  const ice = Math.abs(Math.sin(lat)) > 0.93;

  return normalizeSample({
    fallback: true,
    land: land || ice,
    solidSurfaceLand: land || ice,
    exposedTerrainLand: land && !ice,
    ice,
    glacier: ice,
    liquidWater: !land && !ice,
    water: !land && !ice,
    ocean: !land && !ice && !shelf,
    shelf,
    hydration: land ? 0.22 : 0.76,
    shallowShelf: shelf ? 0.86 : 0.16,
    shelfIndex: shelf ? 0.86 : 0.16,
    terrainRelief: land ? 0.24 + ridge * 0.26 : 0,
    terrainReliefIndex: land ? 0.24 + ridge * 0.26 : 0,
    coastBand: shelf ? 0.76 : 0.08,
    coastlineIndex: shelf ? 0.76 : 0.08,
    runoff: shelf ? 0.35 : 0.02,
    mineral: ridge,
    mineralIndex: ridge,
    cloudDensity: waveNoise(lon, lat, 6, 21.3) * 0.18,
    visualSurfaceClass: ice
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface"
  }, lon, lat);
}

function sampleSurface(lon, lat) {
  const runtimeSampler = getRuntimeSampler();

  if (typeof runtimeSampler === "function") {
    try {
      const sample = runtimeSampler({ lon, lat });
      if (sample && typeof sample === "object") {
        return normalizeSample(sample, lon, lat);
      }
    } catch (_) {}
  }

  return fallbackSample(lon, lat);
}

function colorForSample(sample, options) {
  const oceanDeep = [28, 92, 132];
  const oceanMid = [38, 134, 170];
  const oceanShelf = [78, 190, 184];
  const oceanGlow = [118, 226, 206];

  const granite = [124, 116, 98];
  const slate = [76, 88, 94];
  const opal = [126, 160, 154];
  const sand = [166, 150, 118];
  const ice = [184, 202, 202];
  const snow = [214, 226, 224];

  const isWater = Boolean(sample.liquidWater || sample.water || sample.ocean || sample.shelf);
  const isIce = Boolean(sample.ice || sample.glacier);
  const isLand = Boolean(sample.solidSurfaceLand || sample.land || sample.exposedTerrainLand);

  if (isIce) {
    let rgb = mixRgb(ice, snow, clamp01(sample.terrainRelief || 0.3));
    rgb = mixRgb(rgb, opal, clamp01(sample.mineralIndex || 0.2) * 0.16);
    return scaleRgb(rgb, options.brighten);
  }

  if (isWater || !isLand) {
    let rgb = mixRgb(
      oceanDeep,
      oceanMid,
      clamp01((sample.hydration || sample.hydrationIndex || 0.58) * 0.9)
    );

    rgb = mixRgb(rgb, oceanShelf, clamp01(sample.shallowShelf || sample.shelfIndex || 0) * 0.78);
    rgb = mixRgb(rgb, oceanGlow, clamp01(sample.runoff || sample.coastlineIndex || sample.coastBand || 0) * 0.18);

    const texture =
      (waveNoise(sample.lon, sample.lat, 8, 3.4) - 0.5) * 12 +
      (waveNoise(sample.lon, sample.lat, 13, 6.8) - 0.5) * 7;

    rgb = addRgb(rgb, texture);
    rgb = mixRgb(rgb, [70, 155, 185], options.waterVisibilityFloor * 0.18);

    return scaleRgb(rgb, options.brighten);
  }

  let rgb = granite;

  rgb = mixRgb(rgb, slate, clamp01(sample.terrainRelief || sample.terrainReliefIndex || 0) * 0.34);
  rgb = mixRgb(rgb, opal, clamp01(sample.mineral || sample.mineralIndex || 0) * 0.18);
  rgb = mixRgb(rgb, sand, clamp01(sample.coastBand || sample.coastlineIndex || 0) * 0.35);

  const relief =
    clamp01(sample.terrainRelief || sample.terrainReliefIndex || 0) * 20 +
    (waveNoise(sample.lon, sample.lat, 12, 4.4) - 0.5) * 9;

  rgb = addRgb(rgb, relief);
  rgb = mixRgb(rgb, [145, 133, 106], options.landVisibilityFloor * 0.2);

  return scaleRgb(rgb, options.brighten);
}

function prepareCanvas(shell, mount, explicitCanvas) {
  if (!mount) throw new Error("Audralia canvas mount was not found.");

  if (shell && !shell.contains(mount)) {
    throw new Error("Audralia mount is not inside the square shell.");
  }

  mount.dataset.audraliaCanvasMount = "true";
  mount.dataset.audraliaMount = "true";
  mount.dataset.adoptedCanvasMount = "true";
  mount.dataset.audraliaProofMount = "true";
  mount.dataset.audraliaContainedMount = "true";
  mount.dataset.audraliaCanvasContract = AUDRALIA_CANVAS_CONTRACT;

  let canvas = explicitCanvas || resolveAudraliaCanvas(null, mount);

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "audraliaCanvas";
    mount.appendChild(canvas);
  }

  canvas.dataset.audraliaCanvas = "true";
  canvas.dataset.audraliaCanvasAuthority = "true";
  canvas.dataset.audraliaProofCanvas = "true";
  canvas.dataset.audraliaContainedCanvas = "true";
  canvas.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
  canvas.dataset.servedSource = AUDRALIA_SERVED_SOURCE_CONTRACT;

  canvas.setAttribute("aria-label", "Audralia adopted canvas proof surface");

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.maxWidth = "100%";
  canvas.style.maxHeight = "100%";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.borderRadius = "50%";
  canvas.style.background = "radial-gradient(circle at 50% 50%, #071522, #01040a)";
  canvas.style.pointerEvents = "none";
  canvas.style.userSelect = "none";
  canvas.style.contain = "layout paint style";

  return canvas;
}

function resolveProfile(cssSize, options) {
  const cores = navigator.hardwareConcurrency || 4;
  const dpr = window.devicePixelRatio || 1;
  const mobile =
    window.matchMedia?.("(max-width: 760px)")?.matches ||
    cssSize <= 420 ||
    cores <= 4;

  if (mobile) {
    return {
      mode: "mobile",
      fps: options.mobileFps,
      rasterSize: options.mobileRasterSize
    };
  }

  if (dpr > 1.15 || cores <= 6) {
    return {
      mode: "balanced",
      fps: options.balancedFps,
      rasterSize: options.balancedRasterSize
    };
  }

  return {
    mode: "desktop",
    fps: options.desktopFps,
    rasterSize: options.desktopRasterSize
  };
}

function measureContainedShell(shell, mount, options) {
  const controlBox = shell || mount;
  const rect = controlBox.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 390;

  const fallbackSize = Math.min(viewportWidth * 0.86, options.fallbackShellSize);
  const measuredWidth = safeNumber(rect.width, fallbackSize);
  const measuredHeight = safeNumber(rect.height, measuredWidth || fallbackSize);

  const cssSize = Math.max(
    options.minShellSize,
    Math.floor(Math.min(measuredWidth || fallbackSize, measuredHeight || measuredWidth || fallbackSize))
  );

  const profile = resolveProfile(cssSize, options);
  const dpr = clamp(window.devicePixelRatio || 1, 1, options.devicePixelClamp);
  const intrinsicPixelSize = Math.max(options.minShellSize, Math.floor(cssSize * dpr));

  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    servedSource: AUDRALIA_SERVED_SOURCE_CONTRACT,
    shellFound: Boolean(shell),
    mountFound: Boolean(mount),
    cssSize,
    boxWidth: cssSize,
    boxHeight: cssSize,
    intrinsicPixelSize,
    renderRadius: Math.floor(intrinsicPixelSize * options.renderRadiusScale),
    dpr,
    performanceMode: profile.mode,
    fps: profile.fps,
    rasterSize: profile.rasterSize,
    frameInterval: 1000 / profile.fps,
    shellObedience: true,
    mountEnlargementSuppressed: true,
    squareBoxEnforced: true,
    ovalStretchSuppressed: true,
    pageExpansionAllowed: false
  };
}

function applyContainedShellLaw(shell, mount, canvas, dimension) {
  if (shell) {
    shell.dataset.audraliaSquareShell = "true";
    shell.dataset.audraliaCanvasContract = AUDRALIA_CANVAS_CONTRACT;
    shell.style.position = shell.style.position || "relative";
    shell.style.overflow = "hidden";
    shell.style.aspectRatio = "1 / 1";
    shell.style.contain = "layout paint style";
  }

  mount.style.position = "absolute";
  mount.style.inset = "0";
  mount.style.display = "grid";
  mount.style.placeItems = "center";
  mount.style.width = "100%";
  mount.style.height = "100%";
  mount.style.minWidth = "0";
  mount.style.minHeight = "0";
  mount.style.maxWidth = "100%";
  mount.style.maxHeight = "100%";
  mount.style.aspectRatio = "1 / 1";
  mount.style.overflow = "hidden";
  mount.style.contain = "layout paint style";

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.minWidth = "0";
  canvas.style.minHeight = "0";
  canvas.style.maxWidth = "100%";
  canvas.style.maxHeight = "100%";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.overflow = "hidden";

  if (canvas.width !== dimension.intrinsicPixelSize) canvas.width = dimension.intrinsicPixelSize;
  if (canvas.height !== dimension.intrinsicPixelSize) canvas.height = dimension.intrinsicPixelSize;

  mount.dataset.audraliaBoxWidth = String(dimension.boxWidth);
  mount.dataset.audraliaBoxHeight = String(dimension.boxHeight);
  mount.dataset.audraliaSquareBox = "true";
  mount.dataset.audraliaOvalStretchSuppressed = "true";
  mount.dataset.audraliaMountEnlargementSuppressed = "true";

  canvas.dataset.pixelWidth = String(dimension.intrinsicPixelSize);
  canvas.dataset.pixelHeight = String(dimension.intrinsicPixelSize);
  canvas.dataset.renderRadius = String(dimension.renderRadius);
  canvas.dataset.rasterSize = String(dimension.rasterSize);
  canvas.dataset.performanceMode = dimension.performanceMode;
  canvas.dataset.fps = String(dimension.fps);
  canvas.dataset.squareBox = "true";
}

function createReceipt(controller, status = "running") {
  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    servedSource: AUDRALIA_SERVED_SOURCE_CONTRACT,
    legacyContracts: AUDRALIA_CANVAS_LEGACY_CONTRACTS.slice(),
    status,
    shellFound: Boolean(controller.shell),
    shellId: controller.shell?.id || null,
    mountFound: Boolean(controller.mount),
    mountId: controller.mount?.id || null,
    canvasFound: Boolean(controller.canvas),
    canvasId: controller.canvas?.id || null,
    dimension: controller.dimension || null,
    runtimeStatus: safeRuntimeStatus(),
    graphicBox: false,
    imageGeneration: false,
    bodyWipe: false,
    pageExpansionAllowed: false,
    shellObedience: true,
    mountEnlargementSuppressed: true,
    squareBoxEnforced: true,
    ovalStretchSuppressed: true,
    pixelProof: controller.pixelProof || null,
    frame: controller.frame,
    updatedAt: new Date().toISOString()
  };
}

function safeRuntimeStatus() {
  try {
    if (typeof getRuntimeStatus === "function") return getRuntimeStatus();
  } catch (_) {}

  return window.__AUDRALIA_RUNTIME_STATUS__ || window.AUDRALIA_RUNTIME_STATUS || null;
}

function installReceipt(controller, status = "running") {
  const receipt = createReceipt(controller, status);

  window.__AUDRALIA_CANVAS_RECEIPT__ = receipt;
  window.AUDRALIA_CANVAS_RECEIPT = receipt;
  window.AudraliaCanvasReceipt = receipt;

  if (controller.pixelProof) {
    window.__AUDRALIA_PIXEL_PROOF__ = controller.pixelProof;
    window.AUDRALIA_PIXEL_PROOF = controller.pixelProof;
  }

  document.documentElement.dataset.audraliaCanvasContract = AUDRALIA_CANVAS_CONTRACT;
  document.documentElement.dataset.audraliaServedSource = AUDRALIA_SERVED_SOURCE_CONTRACT;
  document.documentElement.dataset.audraliaCanvasStatus = status;
  document.documentElement.dataset.audraliaCanvasFrame = String(controller.frame);
  document.documentElement.dataset.audraliaShellObedience = "true";
  document.documentElement.dataset.audraliaMountEnlargementSuppressed = "true";
  document.documentElement.dataset.audraliaSquareBox = "true";
  document.documentElement.dataset.audraliaOvalStretchSuppressed = "true";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";

  return receipt;
}

class AudraliaCanvasController {
  constructor(shell, mount, canvas, options = {}) {
    this.shell = shell;
    this.mount = mount;
    this.canvas = canvas;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

    this.projectedCanvas = document.createElement("canvas");
    this.projectedCtx = this.projectedCanvas.getContext("2d", { willReadFrequently: true });

    this.frame = 0;
    this.running = false;
    this.destroyed = false;
    this.rotation = Number.isFinite(this.options.initialRotation) ? this.options.initialRotation : -2.15;
    this.lastDrawAt = 0;
    this.lastTimestamp = performance.now();
    this.userPauseUntil = 0;
    this.pixelProof = null;
    this.dimension = null;

    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);
    this.pauseForUserAction = this.pauseForUserAction.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.destroy = this.destroy.bind(this);

    this.install();
  }

  install() {
    this.canvas.__audraliaCanvasController = this;

    this.resize();
    this.renderProjection();
    this.draw();

    window.addEventListener("resize", this.resize, { passive: true });
    document.addEventListener("selectionchange", this.handleSelectionChange);
    document.addEventListener("copy", this.pauseForUserAction);
    document.addEventListener("cut", this.pauseForUserAction);
    document.addEventListener("paste", this.pauseForUserAction);
    document.addEventListener("pointerdown", this.pauseForUserAction, { passive: true });
    document.addEventListener("touchstart", this.pauseForUserAction, { passive: true });
    document.addEventListener("keydown", this.handleKeydown);

    installReceipt(this, "installed");
  }

  resize() {
    if (this.destroyed) return;

    this.dimension = measureContainedShell(this.shell, this.mount, this.options);
    applyContainedShellLaw(this.shell, this.mount, this.canvas, this.dimension);

    this.width = this.dimension.intrinsicPixelSize;
    this.height = this.dimension.intrinsicPixelSize;
    this.radius = this.dimension.renderRadius;
    this.frameInterval = this.dimension.frameInterval;
    this.rasterSize = this.dimension.rasterSize;
    this.performanceMode = this.dimension.performanceMode;
    this.fps = this.dimension.fps;

    this.renderProjection();
    this.draw();
  }

  pauseForUserAction() {
    this.userPauseUntil = performance.now() + 1600;
  }

  handleSelectionChange() {
    const selection = window.getSelection?.();
    if (selection && !selection.isCollapsed) this.userPauseUntil = performance.now() + 2200;
  }

  handleKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && ["a", "c", "v", "x"].includes(String(event.key).toLowerCase())) {
      this.pauseForUserAction();
    }
  }

  renderProjection() {
    const size = this.rasterSize || 240;

    this.projectedCanvas.width = size;
    this.projectedCanvas.height = size;

    const image = this.projectedCtx.createImageData(size, size);
    const data = image.data;

    const axialTilt = -0.18;
    const cosR = Math.cos(this.rotation);
    const sinR = Math.sin(this.rotation);
    const cosT = Math.cos(axialTilt);
    const sinT = Math.sin(axialTilt);
    const light = normalize(vec3(-0.42, 0.34, 0.84));

    let nonblank = 0;
    let water = 0;
    let solid = 0;
    let turquoise = 0;
    let fallback = 0;

    for (let py = 0; py < size; py += 1) {
      const y = 1 - (py / Math.max(1, size - 1)) * 2;

      for (let px = 0; px < size; px += 1) {
        const x = (px / Math.max(1, size - 1)) * 2 - 1;
        const index = (py * size + px) * 4;
        const rr = x * x + y * y;

        if (rr > 1) {
          data[index + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - rr);
        const viewNormal = vec3(x, y, z);

        const tiltedY = y * cosT - z * sinT;
        const tiltedZ = y * sinT + z * cosT;

        const wx = x * cosR + tiltedZ * sinR;
        const wz = tiltedZ * cosR - x * sinR;
        const wy = tiltedY;

        const world = normalize(vec3(wx, wy, wz));
        const ll = lonLatFromVector(world);
        const sample = sampleSurface(ll.lon, ll.lat);
        let base = colorForSample(sample, this.options);

        const isWater = Boolean(sample.liquidWater || sample.water || sample.ocean || sample.shelf);
        const isSolid = Boolean(sample.solidSurfaceLand || sample.land || sample.exposedTerrainLand || sample.ice);

        const day = smoothstep(-0.22, 0.92, dot(viewNormal, light));
        const rim = smoothstep(0.66, 1, Math.hypot(viewNormal.x, viewNormal.y));

        const visibilityFloor = isWater
          ? this.options.waterVisibilityFloor
          : this.options.landVisibilityFloor;

        const shade = clamp(visibilityFloor + day * 0.52 - rim * 0.09, 0.22, 1.16);

        base = scaleRgb(base, shade);

        data[index] = base[0];
        data[index + 1] = base[1];
        data[index + 2] = base[2];
        data[index + 3] = 255;

        nonblank += 1;
        if (isWater) water += 1;
        if (isSolid && !isWater) solid += 1;
        if (sample.fallback || sample.isFallback) fallback += 1;
        if (base[1] > 125 && base[2] > 135 && base[0] < 135) turquoise += 1;
      }
    }

    this.projectedCtx.putImageData(image, 0, 0);

    const total = Math.max(1, nonblank);

    this.pixelProof = {
      contract: AUDRALIA_CANVAS_CONTRACT,
      servedSource: AUDRALIA_SERVED_SOURCE_CONTRACT,
      nonblankPixelRatio: Number((nonblank / (size * size)).toFixed(5)),
      waterPixelRatio: Number((water / total).toFixed(5)),
      solidSurfacePixelRatio: Number((solid / total).toFixed(5)),
      turquoisePixelRatio: Number((turquoise / total).toFixed(5)),
      fallbackPixelRatio: Number((fallback / total).toFixed(5)),
      rasterSize: size,
      readable: true,
      blank: false,
      updatedAt: new Date().toISOString()
    };

    window.__AUDRALIA_PIXEL_PROOF__ = this.pixelProof;
    window.AUDRALIA_PIXEL_PROOF = this.pixelProof;
  }

  drawSpace() {
    const gradient = this.ctx.createRadialGradient(
      this.width * 0.5,
      this.height * 0.44,
      this.width * 0.04,
      this.width * 0.5,
      this.height * 0.5,
      this.width * 0.76
    );

    gradient.addColorStop(0, "rgba(26, 56, 76, 0.96)");
    gradient.addColorStop(0.45, "rgba(5, 16, 28, 0.99)");
    gradient.addColorStop(1, "rgba(0, 3, 10, 1)");

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawAtmosphere(cx, cy, radius) {
    this.ctx.save();

    const aura = this.ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.2);
    aura.addColorStop(0, "rgba(48,168,190,0)");
    aura.addColorStop(0.72, `rgba(68,178,204,${0.045 * this.options.atmosphereStrength})`);
    aura.addColorStop(0.92, `rgba(152,221,232,${0.18 * this.options.atmosphereStrength})`);
    aura.addColorStop(1, "rgba(152,221,232,0)");

    this.ctx.fillStyle = aura;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius * 1.2, 0, TAU);
    this.ctx.fill();

    this.ctx.globalCompositeOperation = "screen";
    this.ctx.strokeStyle = `rgba(183,232,238,${0.16 * this.options.atmosphereStrength})`;
    this.ctx.lineWidth = Math.max(1, radius * 0.008);
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius * 1.004, 0, TAU);
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawClimate(cx, cy, radius) {
    const bandCount = this.performanceMode === "mobile" ? 4 : 6;
    const phase = this.frame * 0.016 + this.rotation * 0.36;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius * 0.99, 0, TAU);
    this.ctx.clip();
    this.ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < bandCount; i += 1) {
      const t = bandCount === 1 ? 0.5 : i / (bandCount - 1);
      const lat = lerp(-0.72, 0.72, t);
      const y = cy - Math.sin(lat) * radius;
      const ry = Math.cos(lat) * radius * (0.72 + 0.08 * Math.sin(phase + i * 1.7));
      const bandHeight = radius * 0.011;

      this.ctx.strokeStyle = `rgba(210,232,228,${0.022 + 0.008 * Math.sin(phase + i * 2.1)})`;
      this.ctx.lineWidth = Math.max(1, bandHeight);
      this.ctx.setLineDash([radius * 0.12, radius * 0.16, radius * 0.04, radius * 0.18]);
      this.ctx.lineDashOffset = -phase * radius * (0.28 + i * 0.02);

      this.ctx.beginPath();
      this.ctx.ellipse(cx, y, ry, bandHeight, Math.sin(phase + i) * 0.12, 0, TAU);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  drawDepthOverlay(cx, cy, radius) {
    this.ctx.save();

    const shade = this.ctx.createRadialGradient(
      cx - radius * 0.34,
      cy - radius * 0.28,
      radius * 0.08,
      cx,
      cy,
      radius
    );

    shade.addColorStop(0, "rgba(255,255,255,0.055)");
    shade.addColorStop(0.42, "rgba(255,255,255,0.016)");
    shade.addColorStop(0.82, "rgba(0,0,0,0.015)");
    shade.addColorStop(1, "rgba(0,0,0,0.095)");

    this.ctx.globalCompositeOperation = "multiply";
    this.ctx.fillStyle = shade;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, TAU);
    this.ctx.fill();

    this.ctx.restore();
  }

  draw() {
    if (!this.width || !this.height || !this.radius) return;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = this.radius;

    this.drawSpace();
    this.drawAtmosphere(cx, cy, radius);

    this.ctx.save();
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = this.performanceMode === "mobile" ? "medium" : "high";
    this.ctx.drawImage(this.projectedCanvas, cx - radius, cy - radius, radius * 2, radius * 2);
    this.ctx.restore();

    this.drawClimate(cx, cy, radius);
    this.drawDepthOverlay(cx, cy, radius);
    this.drawAtmosphere(cx, cy, radius);

    this.frame += 1;

    this.canvas.dataset.status = "running";
    this.canvas.dataset.frame = String(this.frame);
    this.canvas.dataset.audraliaCanvasAuthority = "true";
    this.canvas.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
    this.canvas.dataset.servedSource = AUDRALIA_SERVED_SOURCE_CONTRACT;
    this.canvas.dataset.visualDefinition = "contained-shell-obedience-visible-runtime";
    this.canvas.dataset.pixelProof = "readable";
    this.canvas.dataset.nonblank = "true";
    this.canvas.dataset.waterPixels = String(this.pixelProof?.waterPixelRatio || 0);
    this.canvas.dataset.solidSurfacePixels = String(this.pixelProof?.solidSurfacePixelRatio || 0);
    this.canvas.dataset.turquoisePixels = String(this.pixelProof?.turquoisePixelRatio || 0);
    this.canvas.dataset.fallbackPixels = String(this.pixelProof?.fallbackPixelRatio || 0);
    this.canvas.dataset.squareBox = "true";
    this.canvas.dataset.ovalStretchSuppressed = "true";
    this.canvas.dataset.mountEnlargementSuppressed = "true";

    installReceipt(this, "running");
  }

  start() {
    if (this.running || this.destroyed) return this;

    this.running = true;
    this.lastTimestamp = performance.now();
    this.lastDrawAt = 0;

    this.renderProjection();
    this.draw();

    this.raf = requestAnimationFrame(this.tick);
    return this;
  }

  tick(timestamp) {
    if (!this.running || this.destroyed) return;

    const pausedForUser = timestamp < this.userPauseUntil;
    const hidden = document.hidden;

    if (!pausedForUser && !hidden && timestamp - this.lastDrawAt >= this.frameInterval) {
      const dt = clamp((timestamp - this.lastTimestamp) / 1000, 0, 0.12);

      this.lastTimestamp = timestamp;
      this.lastDrawAt = timestamp;
      this.rotation = wrapLongitude(this.rotation + dt * this.options.rotationSpeed);

      this.renderProjection();
      this.draw();
    }

    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    if (!this.running) return this;

    this.running = false;
    cancelAnimationFrame(this.raf);
    installReceipt(this, "stopped");
    return this;
  }

  destroy() {
    this.stop();
    this.destroyed = true;

    window.removeEventListener("resize", this.resize);
    document.removeEventListener("selectionchange", this.handleSelectionChange);
    document.removeEventListener("copy", this.pauseForUserAction);
    document.removeEventListener("cut", this.pauseForUserAction);
    document.removeEventListener("paste", this.pauseForUserAction);
    document.removeEventListener("pointerdown", this.pauseForUserAction);
    document.removeEventListener("touchstart", this.pauseForUserAction);
    document.removeEventListener("keydown", this.handleKeydown);

    if (this.canvas.__audraliaCanvasController === this) {
      delete this.canvas.__audraliaCanvasController;
    }

    installReceipt(this, "destroyed");
  }
}

function renderAudraliaCanvas(options = {}) {
  const shell = resolveAudraliaShell(options.shell);
  const mount = resolveAudraliaMount(options.mount || options.el || options.container || options.target);
  const explicitCanvas = resolveAudraliaCanvas(options.canvas, mount);
  const canvas = prepareCanvas(shell, mount, explicitCanvas);

  if (canvas.__audraliaCanvasController) {
    canvas.__audraliaCanvasController.destroy();
  }

  const controller = new AudraliaCanvasController(shell, mount, canvas, options);
  controller.start();

  window.AudraliaCanvasAuthority.current = controller;
  window.AudraliaCanvasAuthority.receipt = window.__AUDRALIA_CANVAS_RECEIPT__;
  window.AudraliaCanvasAuthority.pixelProof = window.__AUDRALIA_PIXEL_PROOF__;
  window.AudraliaCanvasAuthority.dimension = controller.dimension;

  return controller;
}

function mountAudraliaCanvas(options = {}) {
  return renderAudraliaCanvas(options);
}

function startAudraliaCanvas(options = {}) {
  return renderAudraliaCanvas(options);
}

function createAudraliaCanvas(options = {}) {
  return renderAudraliaCanvas(options);
}

function getAudraliaCanvasReceipt() {
  return window.__AUDRALIA_CANVAS_RECEIPT__ || null;
}

function getAudraliaPixelProof() {
  return window.__AUDRALIA_PIXEL_PROOF__ || null;
}

function getAudraliaDimensionReceipt() {
  return window.__AUDRALIA_CANVAS_RECEIPT__?.dimension || null;
}

function installGlobalAuthority() {
  const existing = window.AudraliaCanvasAuthority || {};

  window.AudraliaCanvasAuthority = {
    ...existing,
    contract: AUDRALIA_CANVAS_CONTRACT,
    servedSource: AUDRALIA_SERVED_SOURCE_CONTRACT,
    legacyContracts: AUDRALIA_CANVAS_LEGACY_CONTRACTS.slice(),
    render: renderAudraliaCanvas,
    mount: mountAudraliaCanvas,
    start: startAudraliaCanvas,
    create: createAudraliaCanvas,
    sampleSurface,
    getReceipt: getAudraliaCanvasReceipt,
    getPixelProof: getAudraliaPixelProof,
    getDimensionReceipt: getAudraliaDimensionReceipt,
    current: existing.current || null,
    receipt: existing.receipt || null,
    pixelProof: existing.pixelProof || null,
    dimension: existing.dimension || null
  };

  window.renderAudraliaCanvas = renderAudraliaCanvas;
  window.mountAudraliaCanvas = mountAudraliaCanvas;
  window.startAudraliaCanvas = startAudraliaCanvas;
  window.createAudraliaCanvas = createAudraliaCanvas;
  window.getAudraliaCanvasReceipt = getAudraliaCanvasReceipt;
  window.getAudraliaPixelProof = getAudraliaPixelProof;
  window.getAudraliaDimensionReceipt = getAudraliaDimensionReceipt;
}

installGlobalAuthority();

const autoMount = document.querySelector("[data-audralia-canvas-auto='true']");
if (autoMount && !autoMount.querySelector("canvas[data-audralia-canvas-authority='true']")) {
  renderAudraliaCanvas({ mount: autoMount });
}

export {
  AUDRALIA_CANVAS_CONTRACT,
  AUDRALIA_SERVED_SOURCE_CONTRACT,
  AUDRALIA_CANVAS_LEGACY_CONTRACTS,
  AudraliaCanvasController,
  renderAudraliaCanvas,
  mountAudraliaCanvas,
  startAudraliaCanvas,
  createAudraliaCanvas,
  getAudraliaCanvasReceipt,
  getAudraliaPixelProof,
  getAudraliaDimensionReceipt,
  resolveAudraliaMount,
  resolveAudraliaShell,
  sampleSurface
};

export default renderAudraliaCanvas;
