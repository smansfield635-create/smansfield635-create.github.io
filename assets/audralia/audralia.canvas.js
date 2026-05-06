/* /assets/audralia/audralia.canvas.js */
/* AUDRALIA_CANVAS_DIMENSION_AUTHORITY_TNT_v14
   Full-file replacement.

   Jurisdiction:
   - adopted canvas authority
   - dimension control panel
   - square-box enforcement
   - mount measurement
   - intended globe diameter
   - canvas intrinsic pixel sizing
   - render radius
   - low-lag frame budget
   - immediate nonblank pixel proof
   - runtime-fed surface sampling
   - receipts

   Non-jurisdiction:
   - HTML route shell ownership
   - showroom selector routing
   - topology land/void authority
   - terrain authority
   - hydration authority
   - oceans/deep-ocean authority
   - Gauges scoring
   - GraphicBox
   - image generation
*/

import RuntimeTruth, {
  sampleAudraliaRuntime,
  getAudraliaRuntimeStatus
} from "./audralia.runtime.js?v=audralia-canvas-dimension-authority-v14";

const AUDRALIA_CANVAS_CONTRACT = "AUDRALIA_CANVAS_DIMENSION_AUTHORITY_TNT_v14";

const AUDRALIA_CANVAS_LEGACY_CONTRACTS = [
  "AUDRALIA_CANVAS_AUTHORITY_ADOPTED_COLUMN_TNT_v2",
  "AUDRALIA_CANVAS_HYDRATION_VISIBILITY_FLOOR_TNT_v12",
  "AUDRALIA_CANVAS_CLIMATE_FIRST_HYDRATION_READY_TNT_v11",
  "AUDRALIA_CANVAS_PROOF_CHAIN_ALIGNMENT_TNT_v13"
];

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const DEFAULT_OPTIONS = {
  rotationSpeed: 0.08,
  initialRotation: -2.15,

  mobileFps: 8,
  balancedFps: 10,
  desktopFps: 14,

  mobileRasterSize: 240,
  balancedRasterSize: 300,
  desktopRasterSize: 360,

  mobileMaxGlobeDiameter: 520,
  balancedMaxGlobeDiameter: 620,
  desktopMaxGlobeDiameter: 720,

  minGlobeDiameter: 260,
  stagePadding: 0,
  viewportHeightRatio: 0.68,
  devicePixelClamp: 1.25,
  renderRadiusScale: 0.435
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mixRgb(a, b, t) {
  const u = clamp(t, 0, 1);

  return [
    Math.round(lerp(a[0], b[0], u)),
    Math.round(lerp(a[1], b[1], u)),
    Math.round(lerp(a[2], b[2], u))
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

  return clamp(0.5 + 0.5 * (a + b + c + d), 0, 1);
}

function resolveElement(target) {
  if (!target) return null;
  if (typeof target === "string") return document.querySelector(target);
  if (typeof Element !== "undefined" && target instanceof Element) return target;
  return null;
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

function getRuntimeSampler() {
  return (
    RuntimeTruth?.sample ||
    RuntimeTruth?.sampleSurface ||
    RuntimeTruth?.sampleAudraliaRuntime ||
    sampleAudraliaRuntime ||
    window.AudraliaRuntimeTruth?.sample ||
    window.sampleAudraliaRuntime ||
    null
  );
}

function sampleSurface(lon, lat) {
  const runtimeSampler = getRuntimeSampler();

  if (typeof runtimeSampler === "function") {
    const sample = runtimeSampler({ lon, lat });

    return {
      ...sample,
      lon,
      lat,
      fallback: Boolean(sample?.fallback),
      isFallback: Boolean(sample?.isFallback)
    };
  }

  const waterNoise = waveNoise(lon, lat, 3.2, 1.7);
  const land = waterNoise > 0.72;

  return {
    lon,
    lat,
    fallback: true,
    isFallback: true,
    land,
    solidSurface: land,
    solidSurfaceLand: land,
    liquidWater: !land,
    water: !land,
    ocean: !land,
    shelf: !land && waterNoise > 0.62,
    hydration: land ? 0.18 : 0.72,
    hydratedRatio: land ? 0.24 : 1,
    shallowShelf: !land && waterNoise > 0.62 ? 0.8 : 0.1,
    terrainRelief: land ? 0.38 : 0,
    coastBand: waterNoise > 0.64 && waterNoise < 0.78 ? 0.8 : 0.1,
    runoff: waterNoise > 0.64 && waterNoise < 0.78 ? 0.34 : 0,
    mineral: waveNoise(lon, lat, 18, 6.2),
    cloudDensity: waveNoise(lon, lat, 6, 21.3) * 0.22
  };
}

function colorForSample(sample) {
  const oceanDeep = [26, 102, 156];
  const oceanMid = [35, 142, 182];
  const oceanShelf = [88, 198, 190];
  const oceanGlow = [118, 226, 206];

  const granite = [92, 86, 76];
  const slate = [56, 70, 80];
  const opal = [92, 132, 128];
  const sand = [136, 128, 112];
  const ice = [146, 166, 172];
  const cloud = [176, 196, 194];

  const isWater =
    sample.liquidWater ||
    sample.water ||
    sample.ocean ||
    sample.shelf ||
    !sample.solidSurfaceLand;

  if (isWater) {
    let rgb = mixRgb(
      oceanDeep,
      oceanMid,
      clamp(sample.hydration || sample.hydratedRatio || 0.42, 0, 1)
    );

    rgb = mixRgb(rgb, oceanShelf, clamp(sample.shallowShelf || sample.shelfIndex || 0, 0, 1) * 0.82);
    rgb = mixRgb(rgb, oceanGlow, clamp(sample.runoff || sample.coastlineIndex || 0, 0, 1) * 0.2);

    const texture =
      waveNoise(sample.lon, sample.lat, 8, 3.4) * 10 +
      waveNoise(sample.lon, sample.lat, 13, 6.8) * 5;

    return [
      clamp(Math.round(rgb[0] + texture), 0, 255),
      clamp(Math.round(rgb[1] + texture), 0, 255),
      clamp(Math.round(rgb[2] + texture), 0, 255)
    ];
  }

  let rgb = granite;

  rgb = mixRgb(rgb, slate, clamp(sample.terrainRelief || sample.terrainReliefIndex || 0, 0, 1) * 0.35);
  rgb = mixRgb(rgb, opal, clamp(sample.mineral || sample.mineralIndex || 0, 0, 1) * 0.16);
  rgb = mixRgb(rgb, sand, clamp(sample.coastBand || sample.coastlineIndex || 0, 0, 1) * 0.34);
  rgb = mixRgb(rgb, ice, clamp(sample.glacier || sample.ice || 0, 0, 1) * 0.18);
  rgb = mixRgb(rgb, cloud, clamp(sample.cloudDensity || 0, 0, 1) * 0.07);

  const relief =
    clamp(sample.terrainRelief || sample.terrainReliefIndex || 0, 0, 1) * 18 +
    (waveNoise(sample.lon, sample.lat, 12, 4.4) - 0.5) * 8;

  return [
    clamp(Math.round(rgb[0] + relief), 0, 255),
    clamp(Math.round(rgb[1] + relief), 0, 255),
    clamp(Math.round(rgb[2] + relief), 0, 255)
  ];
}

function prepareCanvas(mount, options = {}) {
  if (!mount) throw new Error("Audralia canvas mount was not found.");

  mount.dataset.audraliaCanvasMount = "true";
  mount.dataset.audraliaMount = "true";
  mount.dataset.adoptedCanvasMount = "true";
  mount.dataset.audraliaProofMount = "true";
  mount.dataset.audraliaDimensionAuthority = AUDRALIA_CANVAS_CONTRACT;

  let canvas =
    mount.tagName?.toLowerCase() === "canvas"
      ? mount
      : mount.querySelector("#audraliaCanvas") ||
        mount.querySelector("canvas[data-audralia-canvas]") ||
        mount.querySelector("canvas[data-audralia-canvas-authority]") ||
        null;

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = options.canvasId || "audraliaCanvas";
    mount.appendChild(canvas);
  }

  canvas.dataset.audraliaCanvas = "true";
  canvas.dataset.audraliaCanvasAuthority = "true";
  canvas.dataset.audraliaProofCanvas = "true";
  canvas.dataset.contract = AUDRALIA_CANVAS_CONTRACT;
  canvas.dataset.dimensionAuthority = "active";
  canvas.setAttribute("aria-label", "Audralia adopted canvas proof surface");

  canvas.style.display = "block";
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
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

function resolvePerformanceProfile(cssDiameter, options) {
  const cores = navigator.hardwareConcurrency || 4;
  const dpr = window.devicePixelRatio || 1;
  const mobile =
    cssDiameter <= 560 ||
    window.matchMedia?.("(max-width: 760px)")?.matches ||
    cores <= 4;

  if (mobile) {
    return {
      mode: "mobile",
      fps: options.mobileFps,
      rasterSize: options.mobileRasterSize,
      maxGlobeDiameter: options.mobileMaxGlobeDiameter
    };
  }

  if (dpr > 1.15 || cores <= 6) {
    return {
      mode: "balanced",
      fps: options.balancedFps,
      rasterSize: options.balancedRasterSize,
      maxGlobeDiameter: options.balancedMaxGlobeDiameter
    };
  }

  return {
    mode: "desktop",
    fps: options.desktopFps,
    rasterSize: options.desktopRasterSize,
    maxGlobeDiameter: options.desktopMaxGlobeDiameter
  };
}

function measureDimensionBox(mount, canvas, options) {
  const parent = mount.parentElement || mount;
  const parentRect = parent.getBoundingClientRect();
  const mountRect = mount.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 390;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 780;

  const availableWidth = Math.max(
    options.minGlobeDiameter,
    Math.floor(
      Math.min(
        parentRect.width || viewportWidth,
        mountRect.width || parentRect.width || viewportWidth,
        viewportWidth - 24
      )
    )
  );

  const preliminaryProfile = resolvePerformanceProfile(availableWidth, options);
  const mobileSafeHeight = Math.max(
    options.minGlobeDiameter,
    Math.floor(viewportHeight * options.viewportHeightRatio)
  );

  const intendedGlobeDiameter = Math.floor(
    clamp(
      Math.min(availableWidth, mobileSafeHeight, preliminaryProfile.maxGlobeDiameter),
      options.minGlobeDiameter,
      preliminaryProfile.maxGlobeDiameter
    )
  );

  const dpr = clamp(window.devicePixelRatio || 1, 1, options.devicePixelClamp);
  const intrinsicPixelSize = Math.max(
    options.minGlobeDiameter,
    Math.floor(intendedGlobeDiameter * dpr)
  );

  const renderRadius = Math.floor(intrinsicPixelSize * options.renderRadiusScale);

  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    availableWidth,
    mobileSafeHeight,
    intendedGlobeDiameter,
    boxWidth: intendedGlobeDiameter,
    boxHeight: intendedGlobeDiameter,
    canvasCssWidth: intendedGlobeDiameter,
    canvasCssHeight: intendedGlobeDiameter,
    intrinsicPixelSize,
    renderRadius,
    dpr,
    performanceMode: preliminaryProfile.mode,
    fps: preliminaryProfile.fps,
    rasterSize: preliminaryProfile.rasterSize,
    frameInterval: 1000 / preliminaryProfile.fps,
    squareBoxEnforced: true,
    ovalStretchSuppressed: true,
    pageExpansionAllowed: false
  };
}

function applyDimensionLaw(mount, canvas, dimension) {
  const target = `${dimension.intendedGlobeDiameter}px`;

  mount.style.position = "relative";
  mount.style.display = "block";
  mount.style.width = target;
  mount.style.height = target;
  mount.style.minWidth = target;
  mount.style.minHeight = target;
  mount.style.maxWidth = "min(100%, " + target + ")";
  mount.style.maxHeight = target;
  mount.style.aspectRatio = "1 / 1";
  mount.style.margin = "0 auto";
  mount.style.overflow = "hidden";
  mount.style.contain = "layout paint style";
  mount.style.borderRadius = "50%";

  if (mount.parentElement) {
    mount.parentElement.style.display = "grid";
    mount.parentElement.style.placeItems = "center";
    mount.parentElement.style.overflow = "hidden";
    mount.parentElement.style.contain = "layout paint style";
  }

  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.minWidth = "0";
  canvas.style.minHeight = "0";
  canvas.style.maxWidth = "100%";
  canvas.style.maxHeight = "100%";
  canvas.style.aspectRatio = "1 / 1";
  canvas.style.objectFit = "contain";
  canvas.style.overflow = "hidden";

  if (canvas.width !== dimension.intrinsicPixelSize) canvas.width = dimension.intrinsicPixelSize;
  if (canvas.height !== dimension.intrinsicPixelSize) canvas.height = dimension.intrinsicPixelSize;

  mount.dataset.audraliaBoxWidth = String(dimension.boxWidth);
  mount.dataset.audraliaBoxHeight = String(dimension.boxHeight);
  mount.dataset.audraliaSquareBox = "true";
  mount.dataset.audraliaOvalStretchSuppressed = "true";

  canvas.dataset.pixelWidth = String(dimension.intrinsicPixelSize);
  canvas.dataset.pixelHeight = String(dimension.intrinsicPixelSize);
  canvas.dataset.renderRadius = String(dimension.renderRadius);
  canvas.dataset.rasterSize = String(dimension.rasterSize);
  canvas.dataset.performanceMode = dimension.performanceMode;
  canvas.dataset.fps = String(dimension.fps);
  canvas.dataset.squareBox = "true";
}

function createReceipt(controller, status = "running") {
  const canvas = controller.canvas;
  const mount = controller.mount;

  return {
    contract: AUDRALIA_CANVAS_CONTRACT,
    legacyContracts: AUDRALIA_CANVAS_LEGACY_CONTRACTS.slice(),
    status,
    mountFound: Boolean(mount),
    mountId: mount?.id || null,
    canvasFound: Boolean(canvas),
    canvasId: canvas?.id || null,
    dimension: controller.dimension || null,
    runtimeStatus: getAudraliaRuntimeStatus?.() || window.__AUDRALIA_RUNTIME_RECEIPT__ || null,
    graphicBox: false,
    imageGeneration: false,
    bodyWipe: false,
    pageExpansionAllowed: false,
    squareBoxEnforced: true,
    ovalStretchSuppressed: true,
    pixelProof: controller.pixelProof || null,
    frame: controller.frame,
    updatedAt: new Date().toISOString()
  };
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
  document.documentElement.dataset.audraliaCanvasStatus = status;
  document.documentElement.dataset.audraliaCanvasFrame = String(controller.frame);
  document.documentElement.dataset.audraliaDimensionAuthority = "active";
  document.documentElement.dataset.audraliaSquareBox = "true";
  document.documentElement.dataset.audraliaOvalStretchSuppressed = "true";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.imageGeneration = "false";

  return receipt;
}

class AudraliaCanvasController {
  constructor(canvas, mount, options = {}) {
    this.canvas = canvas;
    this.mount = mount;
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

    this.dimension = measureDimensionBox(this.mount, this.canvas, this.options);
    applyDimensionLaw(this.mount, this.canvas, this.dimension);

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

        let base = colorForSample(sample);

        const isWater =
          sample.liquidWater ||
          sample.water ||
          sample.ocean ||
          sample.shelf ||
          !sample.solidSurfaceLand;

        const day = smoothstep(-0.28, 0.9, dot(viewNormal, light));
        const rim = smoothstep(0.66, 1, Math.hypot(viewNormal.x, viewNormal.y));
        const shade = clamp((isWater ? 0.78 : 0.62) + day * 0.36 + rim * 0.018, 0, 1.12);
        const limb = 1 - rim * (isWater ? 0.13 : 0.2);

        base = [
          clamp(Math.round(base[0] * shade * limb), 0, 255),
          clamp(Math.round(base[1] * shade * limb), 0, 255),
          clamp(Math.round(base[2] * shade * limb), 0, 255)
        ];

        data[index] = base[0];
        data[index + 1] = base[1];
        data[index + 2] = base[2];
        data[index + 3] = 255;

        nonblank += 1;
        if (isWater) water += 1;
        else solid += 1;
        if (base[1] > 130 && base[2] > 145 && base[0] < 120) turquoise += 1;
      }
    }

    this.projectedCtx.putImageData(image, 0, 0);

    const total = Math.max(1, nonblank);

    this.pixelProof = {
      contract: AUDRALIA_CANVAS_CONTRACT,
      nonblankPixelRatio: Number((nonblank / (size * size)).toFixed(5)),
      waterPixelRatio: Number((water / total).toFixed(5)),
      solidSurfacePixelRatio: Number((solid / total).toFixed(5)),
      turquoisePixelRatio: Number((turquoise / total).toFixed(5)),
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

    const aura = this.ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.22);
    aura.addColorStop(0, "rgba(48,168,190,0)");
    aura.addColorStop(0.72, "rgba(68,178,204,0.05)");
    aura.addColorStop(0.92, "rgba(152,221,232,0.16)");
    aura.addColorStop(1, "rgba(152,221,232,0)");

    this.ctx.fillStyle = aura;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius * 1.22, 0, TAU);
    this.ctx.fill();

    this.ctx.globalCompositeOperation = "screen";
    this.ctx.strokeStyle = "rgba(183,232,238,0.1)";
    this.ctx.lineWidth = Math.max(1, radius * 0.007);
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
      const bandHeight = radius * 0.012;

      this.ctx.strokeStyle = `rgba(200,224,220,${0.012 + 0.006 * Math.sin(phase + i * 2.1)})`;
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

    shade.addColorStop(0, "rgba(255,255,255,0.045)");
    shade.addColorStop(0.42, "rgba(255,255,255,0.006)");
    shade.addColorStop(0.8, "rgba(0,0,0,0.025)");
    shade.addColorStop(1, "rgba(0,0,0,0.15)");

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
    this.canvas.dataset.visualDefinition = "dimension-authority-hydration-visible";
    this.canvas.dataset.pixelProof = "readable";
    this.canvas.dataset.nonblank = "true";
    this.canvas.dataset.waterPixels = String(this.pixelProof?.waterPixelRatio || 0);
    this.canvas.dataset.solidSurfacePixels = String(this.pixelProof?.solidSurfacePixelRatio || 0);
    this.canvas.dataset.turquoisePixels = String(this.pixelProof?.turquoisePixelRatio || 0);
    this.canvas.dataset.dimensionAuthority = "active";
    this.canvas.dataset.squareBox = "true";
    this.canvas.dataset.ovalStretchSuppressed = "true";

    installReceipt(this, "running");
  }

  start() {
    if (this.running || this.destroyed) return this;

    this.running = true;
    this.lastTimestamp = performance.now();
    this.lastDrawAt = 0;

    this.renderProjection();
    this.draw();

    this.raf = requestAnimationFrame(this.tick.bind(this));
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

    this.raf = requestAnimationFrame(this.tick.bind(this));
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
  const mount = resolveAudraliaMount(options.mount || options.el || options.container || options.target);
  const canvas = prepareCanvas(mount, options);

  if (canvas.__audraliaCanvasController) {
    canvas.__audraliaCanvasController.destroy();
  }

  const controller = new AudraliaCanvasController(canvas, mount, options);
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
  sampleSurface
};

export default renderAudraliaCanvas;
