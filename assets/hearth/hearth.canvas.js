// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_NEWS_FIBONACCI_SOFT_GAP_EVIDENCE_ADAPTER_TNT_v1
// Full-file replacement.
// Canvas / F13 evidence authority only.
// Purpose:
// - Align Hearth canvas with the four-file Runtime Table split.
// - Feed North Runtime Table checkpoint evidence without claiming F21.
// - Preserve forward visible progress when rendered content is carrier-dominant but not structurally failed.
// - Suppress duplicate post-ready canvas boot evidence.
// - Classify visible-content result as PASS / SOFT_GAP / HARD_FAIL.
// Does not own:
// - planet truth
// - page truth
// - child channel truth
// - Runtime Table governance
// - NEWS gate final authority
// - route orchestration
// - runtime motion
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_NEWS_FIBONACCI_SOFT_GAP_EVIDENCE_ADAPTER_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_NEWS_FIBONACCI_SOFT_GAP_EVIDENCE_ADAPTER_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_RUNTIME_TABLE_DIRECTED_VISIBLE_CARRIER_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_NEWS_FIBONACCI_SOFT_GAP_EVIDENCE_ADAPTER_PRECODE_FINAL_DRAFT_v1";
  const VERSION = "2026-05-29.hearth-canvas-news-fibonacci-soft-gap-evidence-adapter-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const F13_EVENTS = Object.freeze({
    F13A: "CANVAS_COOPERATIVE_BOOT_STARTED",
    F13B: "CANVAS_MOUNT_CREATED",
    F13C: "CANVAS_CONTEXT_READY",
    F13D: "DRAG_INSPECTION_BOUND",
    F13E: "ATLAS_BUILD_STARTED",
    F13F: "ATLAS_BUILD_COMPLETE",
    F13G: "TEXTURE_COMPOSE_STARTED",
    F13H: "TEXTURE_COMPOSE_COMPLETE",
    F13I: "FIRST_FRAME_REQUESTED",
    F13J: "FIRST_FRAME_DETECTED",
    F13K: "CANVAS_READY",
    F13L: "VISIBLE_CONTENT_PROOF_STARTED",
    F13M_PASS: "VISIBLE_CONTENT_PROOF_PASSED",
    F13M_SOFT_GAP: "VISIBLE_CONTENT_SOFT_GAP",
    F13M_HARD_FAIL: "VISIBLE_CONTENT_HARD_FAIL"
  });

  const EARLY_CANVAS_EVENTS = new Set([
    F13_EVENTS.F13A,
    F13_EVENTS.F13B,
    F13_EVENTS.F13C,
    F13_EVENTS.F13D,
    F13_EVENTS.F13E
  ]);

  const PROGRESS_ONLY_EVENTS = new Set([
    "ATLAS_BUILD_PROGRESS",
    "TEXTURE_COMPOSE_PROGRESS"
  ]);

  const DEFAULT_SIZE = 640;
  const ATLAS_WIDTH = 512;
  const ATLAS_HEIGHT = 256;
  const ATLAS_CHUNKS = 32;
  const TEXTURE_STEPS = 32;
  const SAMPLE_COUNT = 257;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    file: "/assets/hearth/hearth.canvas.js",
    role: "F13 canvas evidence producer",
    northAuthority: "/assets/lab/runtime-table.js",
    eastAuthority: "checkpoint sequencing support",
    westAuthority: "inspection/diagnostic support",
    southAuthority: "completion/final latch support",

    booting: false,
    booted: false,
    canvasLaneClosed: false,

    canvas: null,
    context: null,
    mount: null,
    atlasCanvas: null,
    atlasContext: null,
    textureCanvas: null,
    textureContext: null,

    callbacks: [],
    canvasPhaseEvents: [],
    progressOnlyEvents: [],
    archivedLateEvents: [],
    localEvents: [],
    errors: [],

    northAuthorityPresent: false,
    checkpointGovernorDetected: false,
    checkpointSessionSubmissionAvailable: false,
    canvasEvidenceSubmittedToNorth: false,

    canvasReady: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    canvasCarrierRequested: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",

    cooperativeBootAvailable: true,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,
    canvasCarrierMethod: "bootCooperative",
    canvasBootStartedAt: "",
    canvasBootCompletedAt: "",
    canvasBootElapsedMs: 0,
    canvasYieldCount: 0,
    canvasPhaseCount: 0,

    postCanvasReadyRebootSuppressed: false,
    lateCanvasBootEventsArchived: false,
    duplicateCanvasEventsSuppressed: false,
    progressOnlyEventsArchived: false,
    regressiveCanvasEventsBlocked: false,

    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    renderedAfterTexture: false,
    dragInspectionBound: false,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
    visiblePlanetAvailable: false,
    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,

    visibleContentProofMethod: "",
    visibleContentProofError: "",
    visibleContentSampleCount: 0,
    visibleContentVarianceScore: 0,
    visibleContentClassCount: 0,
    visibleContentClasses: [],
    visibleContentLandSampleCount: 0,
    visibleContentWaterSampleCount: 0,
    visibleContentOtherSampleCount: 0,
    visibleContentCarrierSampleCount: 0,
    carrierOnlyDetected: false,

    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    updatedAt: nowIso()
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clamp(value, min, max) {
    const n = Number(value);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function sleep(ms = 0) {
    state.canvasYieldCount += 1;
    return new Promise((resolve) => {
      if (typeof root.requestAnimationFrame === "function") {
        root.requestAnimationFrame(() => {
          if (ms > 0) root.setTimeout(resolve, ms);
          else resolve();
        });
      } else {
        root.setTimeout(resolve, Math.max(0, ms));
      }
    });
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return { ...value };
    }
  }

  function resolveElement(candidate) {
    if (!doc) return null;
    if (!candidate) return null;

    if (candidate.nodeType === 1) return candidate;

    if (typeof candidate === "string") {
      try {
        return doc.querySelector(candidate);
      } catch (_error) {
        return null;
      }
    }

    if (candidate.current && candidate.current.nodeType === 1) return candidate.current;
    if (candidate.element && candidate.element.nodeType === 1) return candidate.element;
    if (candidate.mount && candidate.mount.nodeType === 1) return candidate.mount;

    return null;
  }

  function resolveMount(options = {}) {
    if (!doc) return null;

    const direct = resolveElement(options.mount || options.mountEl || options.container || options.target);
    if (direct) return direct;

    const selectors = [
      "[data-hearth-canvas-mount]",
      "[data-hearth-planet-mount]",
      "[data-hearth-planet-frame]",
      "#hearth-canvas-mount",
      "#hearth-planet-canvas-mount",
      "#hearth-planet-frame",
      ".hearth-canvas-mount",
      ".hearth-planet-frame",
      "[data-planet-frame]",
      "main"
    ];

    for (const selector of selectors) {
      const found = doc.querySelector(selector);
      if (found) return found;
    }

    return doc.body || doc.documentElement;
  }

  function ensureCanvas(options = {}) {
    if (!doc) {
      throw new Error("Document unavailable for Hearth canvas.");
    }

    const mount = resolveMount(options);
    if (!mount) {
      throw new Error("Hearth canvas mount unavailable.");
    }

    let canvas = null;

    if (mount.tagName && String(mount.tagName).toLowerCase() === "canvas") {
      canvas = mount;
    } else {
      canvas =
        mount.querySelector("canvas[data-hearth-canvas-texture='true']") ||
        mount.querySelector("canvas[data-hearth-canvas='true']") ||
        mount.querySelector("canvas.hearth-canvas") ||
        null;
    }

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.className = "hearth-canvas hearth-canvas--evidence-adapter";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthCanvasContract = CONTRACT;
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";
      canvas.style.objectFit = "contain";

      if (mount !== canvas) {
        mount.appendChild(canvas);
      }
    }

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const size = Math.max(256, Math.round(Math.min(
      safeNumber(options.size, 0) || DEFAULT_SIZE,
      Math.max(256, safeNumber(rect.width, DEFAULT_SIZE) || DEFAULT_SIZE),
      Math.max(256, safeNumber(rect.height, DEFAULT_SIZE) || DEFAULT_SIZE)
    )));

    const explicitSize = safeNumber(options.canvasSize, 0) || safeNumber(options.size, 0);
    const finalSize = explicitSize ? Math.max(256, Math.round(explicitSize)) : size;

    if (canvas.width !== finalSize) canvas.width = finalSize;
    if (canvas.height !== finalSize) canvas.height = finalSize;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) {
      throw new Error("2D canvas context unavailable.");
    }

    state.mount = mount;
    state.canvas = canvas;
    state.context = context;
    state.planetCanvasPresent = true;
    state.planetCanvasNonZeroSize = canvas.width > 0 && canvas.height > 0;
    state.canvasCarrierMounted = true;
    state.canvasContextReady = true;

    return { mount, canvas, context };
  }

  function createWorkingCanvas(width, height) {
    const canvas = doc ? doc.createElement("canvas") : null;
    if (!canvas) return { canvas: null, context: null };

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    return { canvas, context };
  }

  function hashNoise(x, y, seed = 1) {
    const n = Math.sin((x * 127.1 + y * 311.7 + seed * 74.7)) * 43758.5453123;
    return n - Math.floor(n);
  }

  function smoothNoise(x, y, seed = 1) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const a = hashNoise(ix, iy, seed);
    const b = hashNoise(ix + 1, iy, seed);
    const c = hashNoise(ix, iy + 1, seed);
    const d = hashNoise(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }

  function fbm(x, y, seed = 1) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let total = 0;

    for (let i = 0; i < 5; i += 1) {
      value += smoothNoise(x * frequency, y * frequency, seed + i * 17) * amplitude;
      total += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return total ? value / total : value;
  }

  function lonLatToVector(lon, lat) {
    const radLon = lon * Math.PI / 180;
    const radLat = lat * Math.PI / 180;
    const cosLat = Math.cos(radLat);

    return {
      x: cosLat * Math.cos(radLon),
      y: Math.sin(radLat),
      z: cosLat * Math.sin(radLon)
    };
  }

  function sampleExternalAuthority(authority, point) {
    if (!authority || !isObject(authority)) return null;

    const methods = ["sample", "read", "get", "getCell", "sampleAt", "readAt"];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](point);
        if (result && isObject(result)) return result;
      } catch (_error) {
        continue;
      }
    }

    return null;
  }

  function resolveSource(nameList) {
    for (const name of nameList) {
      if (root[name] && isObject(root[name])) return root[name];
      if (root.HEARTH && root.HEARTH[name] && isObject(root.HEARTH[name])) return root.HEARTH[name];
      if (root.DEXTER_LAB && root.DEXTER_LAB[name] && isObject(root.DEXTER_LAB[name])) return root.DEXTER_LAB[name];
    }

    return null;
  }

  function samplePlanetMaterial(u, v) {
    const lon = u * 360 - 180;
    const lat = 90 - v * 180;
    const vector = lonLatToVector(lon, lat);

    const point = {
      u,
      v,
      lon,
      lat,
      x: vector.x,
      y: vector.y,
      z: vector.z
    };

    const materialsAuthority = resolveSource(["HEARTH_MATERIALS", "materials", "hearthMaterials"]);
    const hydrologyAuthority = resolveSource(["HEARTH_HYDROLOGY", "hydrology", "hearthHydrology"]);
    const elevationAuthority = resolveSource(["HEARTH_ELEVATION", "elevation", "hearthElevation"]);
    const compositionAuthority = resolveSource(["HEARTH_COMPOSITION", "composition", "hearthComposition"]);
    const hexAuthority = resolveSource(["HEARTH_HEX_FOUR_PAIR_AUTHORITY", "hexAuthority", "hearthHexAuthority"]);
    const hexSurface = resolveSource(["HEARTH_HEX_SURFACE", "hexSurface", "hearthHexSurface"]);

    const materialSample = sampleExternalAuthority(materialsAuthority, point);
    const hydroSample = sampleExternalAuthority(hydrologyAuthority, point);
    const elevationSample = sampleExternalAuthority(elevationAuthority, point);
    const compositionSample = sampleExternalAuthority(compositionAuthority, point);
    const hexSample = sampleExternalAuthority(hexAuthority, point) || sampleExternalAuthority(hexSurface, point);

    const sourceColor =
      extractColor(materialSample) ||
      extractColor(hydroSample) ||
      extractColor(compositionSample) ||
      extractColor(hexSample) ||
      null;

    const e1 = fbm(u * 5.5 + 2.1, v * 4.7 - 1.3, 11);
    const e2 = fbm(u * 12.5 - 1.4, v * 9.5 + 3.3, 23);
    const e3 = fbm(Math.sin(u * Math.PI * 2) * 3.0 + 1.2, Math.cos(v * Math.PI) * 3.0 - 0.7, 37);
    const ridge = Math.abs(e2 - 0.5) * 2;
    const latBand = Math.abs(lat) / 90;

    const rawElevation =
      safeNumber(elevationSample && (elevationSample.elevation ?? elevationSample.height ?? elevationSample.value), NaN);

    const elevation = Number.isFinite(rawElevation)
      ? clamp01((rawElevation + 1) / 2)
      : clamp01(e1 * 0.62 + e3 * 0.28 + ridge * 0.10 - latBand * 0.08);

    const hydro =
      safeNumber(hydroSample && (hydroSample.waterAlpha ?? hydroSample.waterPresence ?? hydroSample.hydrology ?? hydroSample.water), NaN);

    const compositionLand =
      safeNumber(compositionSample && (compositionSample.landAlpha ?? compositionSample.landPresence ?? compositionSample.land), NaN);

    const seaLine = 0.50 + 0.05 * Math.sin(u * Math.PI * 4) - 0.03 * Math.cos(v * Math.PI * 6);
    const waterSignal = Number.isFinite(hydro)
      ? clamp01(hydro)
      : clamp01(1 - ((elevation - seaLine) * 4 + 0.5));

    const landSignal = Number.isFinite(compositionLand)
      ? clamp01(compositionLand)
      : clamp01(1 - waterSignal);

    const isWater = waterSignal >= landSignal;
    const shore = 1 - Math.min(1, Math.abs(waterSignal - landSignal) * 5);

    let rgb;

    if (sourceColor) {
      rgb = sourceColor;
    } else if (isWater) {
      const deep = clamp01(waterSignal * 0.8 + (1 - elevation) * 0.2);
      rgb = [
        Math.round(8 + 20 * (1 - deep) + 12 * shore),
        Math.round(34 + 54 * (1 - deep) + 24 * shore),
        Math.round(86 + 92 * deep + 36 * shore)
      ];
    } else {
      const high = clamp01(elevation);
      const green = clamp01(1 - latBand * 0.65);
      rgb = [
        Math.round(86 + 82 * high + 34 * shore),
        Math.round(78 + 70 * green + 30 * shore),
        Math.round(46 + 42 * (1 - high) + 18 * shore)
      ];
    }

    return {
      ...point,
      rgb,
      isWater,
      isLand: !isWater,
      waterSignal,
      landSignal,
      elevation,
      shore
    };
  }

  function extractColor(packet) {
    if (!packet || !isObject(packet)) return null;

    const keys = [
      "rgb",
      "color",
      "baseColor",
      "finalColor",
      "finalColorHint",
      "landRgb",
      "waterRgb",
      "oceanRgb"
    ];

    for (const key of keys) {
      const value = packet[key];

      if (
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every((item) => Number.isFinite(Number(item)))
      ) {
        return [
          clamp(Math.round(Number(value[0])), 0, 255),
          clamp(Math.round(Number(value[1])), 0, 255),
          clamp(Math.round(Number(value[2])), 0, 255)
        ];
      }
    }

    return null;
  }

  async function buildAtlas(onProgress) {
    if (!doc) throw new Error("Document unavailable for atlas build.");

    if (!state.atlasCanvas || !state.atlasContext) {
      const working = createWorkingCanvas(ATLAS_WIDTH, ATLAS_HEIGHT);
      state.atlasCanvas = working.canvas;
      state.atlasContext = working.context;
    }

    if (!state.atlasCanvas || !state.atlasContext) {
      throw new Error("Atlas canvas unavailable.");
    }

    const image = state.atlasContext.createImageData(ATLAS_WIDTH, ATLAS_HEIGHT);
    const rowsPerChunk = Math.max(1, Math.ceil(ATLAS_HEIGHT / ATLAS_CHUNKS));

    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;
    emitMilestone(F13_EVENTS.F13E, 88, "Atlas build started.");

    for (let chunk = 0; chunk < ATLAS_CHUNKS; chunk += 1) {
      const yStart = chunk * rowsPerChunk;
      const yEnd = Math.min(ATLAS_HEIGHT, yStart + rowsPerChunk);

      for (let y = yStart; y < yEnd; y += 1) {
        const v = y / Math.max(1, ATLAS_HEIGHT - 1);

        for (let x = 0; x < ATLAS_WIDTH; x += 1) {
          const u = x / Math.max(1, ATLAS_WIDTH - 1);
          const sample = samplePlanetMaterial(u, v);
          const index = (y * ATLAS_WIDTH + x) * 4;

          image.data[index] = sample.rgb[0];
          image.data[index + 1] = sample.rgb[1];
          image.data[index + 2] = sample.rgb[2];
          image.data[index + 3] = 255;
        }
      }

      state.atlasBuildProgress = Math.round(((chunk + 1) / ATLAS_CHUNKS) * 100);
      archiveProgressOnlyEvent("ATLAS_BUILD_PROGRESS", mapRange(chunk + 1, 1, ATLAS_CHUNKS, 84, 91), `Atlas build active · ${chunk + 1}/${ATLAS_CHUNKS} chunks · elapsed ${elapsedText()}`);

      if (isFunction(onProgress)) {
        onProgress(state.atlasBuildProgress, getReceipt());
      }

      await sleep(0);
    }

    state.atlasContext.putImageData(image, 0, 0);
    state.atlasBuildComplete = true;
    state.atlasBuildProgress = 100;
    emitMilestone(F13_EVENTS.F13F, 91, "Atlas build complete.");
  }

  async function composeTexture(onProgress) {
    if (!state.atlasCanvas || !state.atlasContext) {
      throw new Error("Atlas unavailable for texture composition.");
    }

    if (!state.textureCanvas || !state.textureContext) {
      const working = createWorkingCanvas(ATLAS_WIDTH, ATLAS_HEIGHT);
      state.textureCanvas = working.canvas;
      state.textureContext = working.context;
    }

    if (!state.textureCanvas || !state.textureContext) {
      throw new Error("Texture canvas unavailable.");
    }

    state.textureComposeStarted = true;
    state.textureComposeProgress = 0;
    emitMilestone(F13_EVENTS.F13G, 93, "Texture composition started.");

    const ctx = state.textureContext;
    ctx.clearRect(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT);
    ctx.drawImage(state.atlasCanvas, 0, 0);

    for (let step = 1; step <= TEXTURE_STEPS; step += 1) {
      state.textureComposeProgress = Math.round((step / TEXTURE_STEPS) * 100);

      if (step % 4 === 0 || step === 1 || step === TEXTURE_STEPS) {
        const alpha = 0.015 + step / TEXTURE_STEPS * 0.025;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = step % 2 ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.25)";
        ctx.fillRect(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT);
        ctx.restore();
      }

      archiveProgressOnlyEvent(
        "TEXTURE_COMPOSE_PROGRESS",
        mapRange(step, 1, TEXTURE_STEPS, 91, 96),
        `Texture composition active · ${state.textureComposeProgress}% · elapsed ${elapsedText()}`
      );

      if (isFunction(onProgress)) {
        onProgress(state.textureComposeProgress, getReceipt());
      }

      await sleep(0);
    }

    state.textureComposeComplete = true;
    state.textureComposeProgress = 100;
    emitMilestone(F13_EVENTS.F13H, 96, "Texture composition complete.");
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    const t = (value - inMin) / Math.max(1, inMax - inMin);
    return Math.round(outMin + clamp01(t) * (outMax - outMin));
  }

  function elapsedText() {
    if (!state.canvasBootStartedAt) return "00:00";

    const start = Date.parse(state.canvasBootStartedAt);
    if (!Number.isFinite(start)) return "00:00";

    const delta = Math.max(0, Date.now() - start);
    const seconds = Math.floor(delta / 1000);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    return `${mm}:${ss}`;
  }

  function renderSphere() {
    if (!state.canvas || !state.context || !state.textureCanvas || !state.textureContext) {
      throw new Error("Canvas or texture unavailable for sphere render.");
    }

    state.firstFrameRequested = true;
    emitMilestone(F13_EVENTS.F13I, 97, "First frame requested.");

    const canvas = state.canvas;
    const ctx = state.context;
    const width = canvas.width;
    const height = canvas.height;
    const size = Math.min(width, height);
    const radius = size * 0.46;
    const cx = width / 2;
    const cy = height / 2;

    const texture = state.textureContext.getImageData(0, 0, ATLAS_WIDTH, ATLAS_HEIGHT);
    const output = ctx.createImageData(width, height);

    for (let y = 0; y < height; y += 1) {
      const dy = (y - cy) / radius;

      for (let x = 0; x < width; x += 1) {
        const dx = (x - cx) / radius;
        const r2 = dx * dx + dy * dy;
        const outIndex = (y * width + x) * 4;

        if (r2 > 1) {
          output.data[outIndex] = 0;
          output.data[outIndex + 1] = 0;
          output.data[outIndex + 2] = 0;
          output.data[outIndex + 3] = 0;
          continue;
        }

        const dz = Math.sqrt(1 - r2);
        const lon = Math.atan2(dx, dz);
        const lat = Math.asin(-dy);
        const u = (lon / (Math.PI * 2)) + 0.5;
        const v = (lat / Math.PI) + 0.5;

        const tx = clamp(Math.floor(u * (ATLAS_WIDTH - 1)), 0, ATLAS_WIDTH - 1);
        const ty = clamp(Math.floor(v * (ATLAS_HEIGHT - 1)), 0, ATLAS_HEIGHT - 1);
        const texIndex = (ty * ATLAS_WIDTH + tx) * 4;

        const limb = clamp01(dz);
        const light = clamp01(0.42 + 0.58 * (dx * -0.28 + dy * -0.18 + dz * 0.94));
        const atmosphere = clamp01((1 - limb) * 0.65);
        const shade = 0.62 + light * 0.42;

        output.data[outIndex] = clamp(Math.round(texture.data[texIndex] * shade + 18 * atmosphere), 0, 255);
        output.data[outIndex + 1] = clamp(Math.round(texture.data[texIndex + 1] * shade + 30 * atmosphere), 0, 255);
        output.data[outIndex + 2] = clamp(Math.round(texture.data[texIndex + 2] * shade + 62 * atmosphere), 0, 255);
        output.data[outIndex + 3] = 255;
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(output, 0, 0);

    ctx.save();
    const gradient = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.35, radius * 0.08, cx, cy, radius);
    gradient.addColorStop(0, "rgba(255,255,255,0.18)");
    gradient.addColorStop(0.45, "rgba(255,255,255,0.03)");
    gradient.addColorStop(1, "rgba(0,0,0,0.42)");
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(210,235,255,0.35)";
    ctx.lineWidth = Math.max(1, size * 0.006);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.planetFramePainted = true;
    state.renderedAfterTexture = state.textureComposeComplete === true;
    state.updatedAt = nowIso();

    emitMilestone(F13_EVENTS.F13J, 98, "First frame detected.");
  }

  function bindDragInspection() {
    if (!state.canvas || state.dragInspectionBound) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;

    const onDown = (event) => {
      dragging = true;
      startX = event.clientX || 0;
      startY = event.clientY || 0;
      state.canvas.dataset.hearthInspectDragging = "true";
    };

    const onMove = (event) => {
      if (!dragging) return;

      const dx = (event.clientX || 0) - startX;
      const dy = (event.clientY || 0) - startY;

      state.canvas.dataset.hearthInspectDeltaX = String(Math.round(dx));
      state.canvas.dataset.hearthInspectDeltaY = String(Math.round(dy));
    };

    const onUp = () => {
      dragging = false;
      state.canvas.dataset.hearthInspectDragging = "false";
    };

    state.canvas.addEventListener("pointerdown", onDown, { passive: true });
    root.addEventListener && root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener && root.addEventListener("pointerup", onUp, { passive: true });

    state.dragInspectionBound = true;
    emitMilestone(F13_EVENTS.F13D, 86, "Drag inspection bound.");
  }

  function luminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function classifyPixel(r, g, b, a) {
    if (a < 8) return "blank";

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    const lum = luminance(r, g, b);

    if (sat < 12 && lum > 32 && lum < 235) return "carrier";
    if (b > g + 18 && b > r + 24) return "water";
    if (g >= b - 8 && r >= b - 18) return "land";
    if (r > 105 && g > 80 && b < 105) return "land";
    if (b > 80 && g > 50) return "water";

    return "other";
  }

  function sampleVisibleContent() {
    state.visibleContentProofStarted = true;
    state.visibleContentProofMethod = "canvas-pixel-content-sample";
    emitMilestone(F13_EVENTS.F13L, 98, "Visible content proof started.");

    if (!state.canvas || !state.context) {
      return classifyVisibleContentEvidence({
        hardFailReason: "canvas-missing",
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    const canvas = state.canvas;
    const ctx = state.context;
    const width = canvas.width;
    const height = canvas.height;

    if (!width || !height) {
      return classifyVisibleContentEvidence({
        hardFailReason: "canvas-zero-size",
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    let imageData;

    try {
      imageData = ctx.getImageData(0, 0, width, height);
    } catch (error) {
      return classifyVisibleContentEvidence({
        hardFailReason: `canvas-read-failed:${error && error.message ? error.message : String(error)}`,
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });
    }

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.46;

    let samples = 0;
    let nonblank = 0;
    let land = 0;
    let water = 0;
    let other = 0;
    let carrier = 0;
    const lumValues = [];
    const classes = new Set();

    for (let i = 0; i < SAMPLE_COUNT; i += 1) {
      const t = i / SAMPLE_COUNT;
      const angle = i * 2.399963229728653;
      const rr = Math.sqrt(t) * radius * 0.92;
      const x = clamp(Math.round(cx + Math.cos(angle) * rr), 0, width - 1);
      const y = clamp(Math.round(cy + Math.sin(angle) * rr), 0, height - 1);
      const index = (y * width + x) * 4;

      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const a = imageData.data[index + 3];

      const cls = classifyPixel(r, g, b, a);
      samples += 1;

      if (cls !== "blank") {
        nonblank += 1;
        lumValues.push(luminance(r, g, b));
      }

      if (cls === "land") {
        land += 1;
        classes.add("land");
      } else if (cls === "water") {
        water += 1;
        classes.add("water");
      } else if (cls === "other") {
        other += 1;
        classes.add("other");
      } else if (cls === "carrier") {
        carrier += 1;
      }
    }

    const mean = lumValues.length
      ? lumValues.reduce((sum, value) => sum + value, 0) / lumValues.length
      : 0;

    const variance = lumValues.length
      ? Math.sqrt(lumValues.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / lumValues.length)
      : 0;

    return classifyVisibleContentEvidence({
      samples,
      nonblank,
      variance,
      land,
      water,
      other,
      carrier,
      classes: Array.from(classes)
    });
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const samples = safeNumber(metrics.samples, 0);
    const nonblank = safeNumber(metrics.nonblank, 0);
    const variance = safeNumber(metrics.variance, 0);
    const land = safeNumber(metrics.land, 0);
    const water = safeNumber(metrics.water, 0);
    const other = safeNumber(metrics.other, 0);
    const carrier = safeNumber(metrics.carrier, 0);
    const classes = Array.isArray(metrics.classes) ? metrics.classes.slice() : [];
    const meaningful = land + water + other;
    const carrierRatio = nonblank ? carrier / nonblank : 1;
    const contentRatio = nonblank ? meaningful / nonblank : 0;

    const structuralReady = Boolean(
      state.canvasReady ||
      (
        state.canvasCarrierMounted &&
        state.canvasContextReady &&
        state.firstFrameDetected &&
        state.imageRendered &&
        state.renderedAfterTexture
      )
    );

    const strictPass = Boolean(
      structuralReady &&
      samples >= SAMPLE_COUNT &&
      nonblank >= Math.floor(SAMPLE_COUNT * 0.60) &&
      variance >= 3 &&
      classes.length >= 2 &&
      meaningful >= Math.floor(SAMPLE_COUNT * 0.28) &&
      carrierRatio <= 0.42 &&
      land + water >= Math.floor(SAMPLE_COUNT * 0.24)
    );

    const softGap = Boolean(
      !strictPass &&
      structuralReady &&
      samples > 0 &&
      nonblank > 0 &&
      variance >= 1 &&
      meaningful > 0 &&
      state.firstFrameDetected &&
      state.imageRendered
    );

    const hardFail = Boolean(
      !strictPass &&
      !softGap &&
      (
        metrics.hardFailReason ||
        !state.canvas ||
        !state.context ||
        !state.planetCanvasNonZeroSize ||
        !state.firstFrameDetected ||
        !state.imageRendered ||
        nonblank <= 0
      )
    );

    state.visibleContentSampleCount = samples;
    state.visibleContentVarianceScore = Number(variance.toFixed(2));
    state.visibleContentClassCount = classes.length;
    state.visibleContentClasses = classes;
    state.visibleContentLandSampleCount = land;
    state.visibleContentWaterSampleCount = water;
    state.visibleContentOtherSampleCount = other;
    state.visibleContentCarrierSampleCount = carrier;

    state.nonblankPlanetVisible = nonblank > 0;
    state.carrierOnlyDetected = Boolean(!strictPass && carrierRatio > 0.42);
    state.visibleContentStrictProof = strictPass;
    state.visibleContentProof = strictPass;
    state.visibleContentSoftGap = softGap;
    state.visibleContentHardFail = hardFail;
    state.visibleForwardProgress = strictPass || softGap;
    state.visibleContentAdmissible = strictPass || softGap;
    state.visiblePlanetAvailable = strictPass || softGap;
    state.f13HardFail = hardFail;
    state.f13CanvasEvidenceComplete = strictPass || softGap;
    state.planetNotObstructed = false;

    if (strictPass) {
      state.visibleContentProofMethod = "canvas-pixel-content-sample";
      state.visibleContentProofError = "";
      emitMilestone(F13_EVENTS.F13M_PASS, 98, "Visible content proof passed.", {
        visibleContentProof: true,
        visibleContentStrictProof: true,
        visibleContentSoftGap: false,
        visibleContentHardFail: false,
        visibleForwardProgress: true,
        visiblePlanetAvailable: true
      });
    } else if (softGap) {
      state.visibleContentProofMethod = "carrier-dominant-soft-gap-content-sample";
      state.visibleContentProofError = [
        `Visible content soft gap: samples=${samples}`,
        `nonblank=${nonblank}`,
        `variance=${state.visibleContentVarianceScore}`,
        `classes=${classes.length}`,
        `land=${land}`,
        `water=${water}`,
        `other=${other}`,
        `carrier=${carrier}`,
        `carrierRatio=${carrierRatio.toFixed(2)}`,
        `contentRatio=${contentRatio.toFixed(2)}`
      ].join(", ");

      emitMilestone(F13_EVENTS.F13M_SOFT_GAP, 98, "Visible content soft gap; forward progress allowed.", {
        visibleContentProof: false,
        visibleContentStrictProof: false,
        visibleContentSoftGap: true,
        visibleContentHardFail: false,
        visibleForwardProgress: true,
        visibleContentAdmissible: true,
        visiblePlanetAvailable: true,
        carrierOnlyDetected: state.carrierOnlyDetected
      });
    } else {
      state.visibleContentProofMethod = "hard-fail-content-sample";
      state.visibleContentProofError = metrics.hardFailReason || [
        `Visible content hard fail: samples=${samples}`,
        `nonblank=${nonblank}`,
        `variance=${state.visibleContentVarianceScore}`,
        `classes=${classes.length}`,
        `land=${land}`,
        `water=${water}`,
        `other=${other}`,
        `carrier=${carrier}`
      ].join(", ");

      emitMilestone(F13_EVENTS.F13M_HARD_FAIL, 98, "Visible content hard fail.", {
        visibleContentProof: false,
        visibleContentStrictProof: false,
        visibleContentSoftGap: false,
        visibleContentHardFail: true,
        visibleForwardProgress: false,
        visibleContentAdmissible: false,
        visiblePlanetAvailable: false
      });
    }

    state.updatedAt = nowIso();

    return {
      status: strictPass ? "PASS" : softGap ? "SOFT_GAP" : "HARD_FAIL",
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      carrierOnlyDetected: state.carrierOnlyDetected,
      metrics: {
        samples,
        nonblank,
        variance: state.visibleContentVarianceScore,
        land,
        water,
        other,
        carrier,
        classes,
        carrierRatio,
        contentRatio
      }
    };
  }

  function getNorthSession() {
    const candidates = [
      root.HEARTH_CHECKPOINT_SESSION,
      root.HEARTH_RUNTIME_CHECKPOINT_SESSION,
      root.LAB_HEARTH_CHECKPOINT_SESSION,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCheckpointSession,
      root.DEXTER_LAB && root.DEXTER_LAB.checkpointSession,
      root.LAB_CHECKPOINT_SESSION
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (candidate && isFunction(candidate.submitEvent)) return candidate;
      if (candidate && isFunction(candidate.submit)) return candidate;
    }

    return null;
  }

  function readNorthAuthority() {
    const authority =
      root.LAB_RUNTIME_TABLE ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null;

    const checkpointGovernor =
      root.LAB_CHECKPOINT_GOVERNOR ||
      root.LAB_NEWS_FIBONACCI_CHECKPOINT_GOVERNOR ||
      (root.DEXTER_LAB && root.DEXTER_LAB.checkpointGovernor) ||
      authority ||
      null;

    const session = getNorthSession();

    state.northAuthorityPresent = Boolean(authority);
    state.checkpointGovernorDetected = Boolean(checkpointGovernor && (checkpointGovernor.checkpointGovernorActive || checkpointGovernor.createHearthCheckpointSession));
    state.checkpointSessionSubmissionAvailable = Boolean(session);

    return {
      authority,
      checkpointGovernor,
      session
    };
  }

  function submitCanvasEvidence(phase, detail = {}) {
    const north = readNorthAuthority();
    const event = {
      event: phase,
      id: phase,
      phase,
      checkpointId: phase,
      source: "hearth.canvas",
      contract: CONTRACT,
      receipt: RECEIPT,
      snapshot: getNorthSnapshot(),
      detail: {
        ...detail,
        contract: CONTRACT,
        receipt: RECEIPT,
        source: "hearth.canvas"
      }
    };

    if (north.session && isFunction(north.session.submitEvent)) {
      try {
        north.session.submitEvent(event);
        state.canvasEvidenceSubmittedToNorth = true;
      } catch (error) {
        state.errors.push({
          event: "NORTH_SESSION_SUBMIT_ERROR",
          phase,
          message: error && error.message ? error.message : String(error),
          at: nowIso()
        });
      }
    } else if (north.session && isFunction(north.session.submit)) {
      try {
        north.session.submit(event);
        state.canvasEvidenceSubmittedToNorth = true;
      } catch (error) {
        state.errors.push({
          event: "NORTH_SESSION_SUBMIT_ERROR",
          phase,
          message: error && error.message ? error.message : String(error),
          at: nowIso()
        });
      }
    }
  }

  function getNorthSnapshot() {
    return {
      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,

      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      postCanvasReadyRebootSuppressed: state.postCanvasReadyRebootSuppressed,
      lateBootEventsArchived: state.lateCanvasBootEventsArchived,
      duplicateCanvasEventsSuppressed: state.duplicateCanvasEventsSuppressed,
      blockingFutureEventViolation: false,

      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      dragInspectionBound: state.dragInspectionBound,
      renderedAfterTexture: state.renderedAfterTexture,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      carrierOnlyDetected: state.carrierOnlyDetected,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      inspectEvidenceAvailable: state.dragInspectionBound,
      canvasCanSupportDiagnosticExit: state.canvasReady && state.firstFrameDetected,
      canvasDoesNotObstructDock: true,
      copyDiagnosticSafe: true,

      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function emitMilestone(phase, progress, message, detail = {}) {
    if (shouldSuppressLateCanvasEvent(phase)) {
      archiveLateEvent(phase, progress, message, "canvas-lane-closed-after-canvas-ready");
      return null;
    }

    state.canvasPhaseCount += 1;
    state.updatedAt = nowIso();

    const event = {
      at: state.updatedAt,
      event: phase,
      phase,
      progress,
      message,
      detail: clonePlain(detail),
      snapshot: getNorthSnapshot(),
      contract: CONTRACT,
      receipt: RECEIPT
    };

    state.canvasPhaseEvents.push(event);
    if (state.canvasPhaseEvents.length > 180) {
      state.canvasPhaseEvents.splice(0, state.canvasPhaseEvents.length - 180);
    }

    state.localEvents.push({
      at: event.at,
      event: phase,
      action: "ADMIT",
      reason: "canvas-evidence-milestone"
    });

    if (phase !== F13_EVENTS.F13M_SOFT_GAP && phase !== F13_EVENTS.F13M_HARD_FAIL) {
      submitCanvasEvidence(phase, detail);
    } else {
      submitCanvasEvidence(phase, {
        ...detail,
        softGapForwardProgressAllowed: phase === F13_EVENTS.F13M_SOFT_GAP,
        hardFail: phase === F13_EVENTS.F13M_HARD_FAIL
      });
    }

    notifyCallbacks(event);

    return event;
  }

  function shouldSuppressLateCanvasEvent(phase) {
    return Boolean(
      state.canvasLaneClosed &&
      EARLY_CANVAS_EVENTS.has(phase)
    );
  }

  function archiveLateEvent(phase, progress, message, reason) {
    state.postCanvasReadyRebootSuppressed = true;
    state.lateCanvasBootEventsArchived = true;
    state.duplicateCanvasEventsSuppressed = true;
    state.updatedAt = nowIso();

    state.archivedLateEvents.push({
      at: state.updatedAt,
      event: phase,
      phase,
      progress,
      message,
      reason,
      contract: CONTRACT,
      receipt: RECEIPT
    });

    if (state.archivedLateEvents.length > 140) {
      state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 140);
    }
  }

  function archiveProgressOnlyEvent(phase, progress, message) {
    state.progressOnlyEventsArchived = true;
    state.updatedAt = nowIso();

    const event = {
      at: state.updatedAt,
      event: phase,
      phase,
      progress,
      message,
      progressOnly: true,
      contract: CONTRACT,
      receipt: RECEIPT
    };

    state.progressOnlyEvents.push(event);

    if (state.progressOnlyEvents.length > 260) {
      state.progressOnlyEvents.splice(0, state.progressOnlyEvents.length - 260);
    }

    notifyCallbacks(event);
  }

  function notifyCallbacks(event) {
    const receipt = getReceipt();

    state.callbacks.forEach((callback) => {
      try {
        callback(event, receipt);
      } catch (error) {
        state.errors.push({
          event: "CALLBACK_ERROR",
          phase: event.phase || event.event || "",
          message: error && error.message ? error.message : String(error),
          at: nowIso()
        });
      }
    });

    if (doc && typeof root.CustomEvent === "function" && isFunction(root.dispatchEvent)) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-phase", {
          detail: {
            event,
            receipt
          }
        }));
      } catch (_error) {
        // Non-critical in restricted environments.
      }
    }
  }

  function addCallbacksFromOptions(options = {}) {
    const callbacks = [
      options.onPhase,
      options.onEvent,
      options.onStatus,
      options.statusCallback,
      options.onReceipt
    ].filter(isFunction);

    callbacks.forEach((callback) => {
      if (!state.callbacks.includes(callback)) state.callbacks.push(callback);
    });
  }

  async function bootCooperative(options = {}) {
    addCallbacksFromOptions(options);

    if (state.booting) {
      return getReceipt();
    }

    if (state.canvasReady && state.canvasLaneClosed) {
      archiveLateEvent(F13_EVENTS.F13A, 78, "Canvas cooperative boot started.", "duplicate-boot-request-after-canvas-ready");
      return getReceipt();
    }

    state.booting = true;
    state.booted = false;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = "bootCooperative";
    state.cooperativeBootUsed = true;
    state.syncBootFallbackUsed = false;
    state.canvasBootStartedAt = nowIso();
    state.updatedAt = state.canvasBootStartedAt;

    try {
      readNorthAuthority();

      emitMilestone(F13_EVENTS.F13A, 78, "Canvas cooperative boot started.");
      await sleep(0);

      ensureCanvas(options);
      emitMilestone(F13_EVENTS.F13B, 81, "Canvas mount created.");
      await sleep(0);

      emitMilestone(F13_EVENTS.F13C, 84, "Canvas context ready.");
      await sleep(0);

      bindDragInspection();
      await sleep(0);

      await buildAtlas(options.onAtlasProgress || options.onProgress);
      await composeTexture(options.onTextureProgress || options.onProgress);
      renderSphere();

      state.canvasReady = true;
      state.canvasLaneClosed = true;
      state.canvasCarrierHandoffOk = true;
      state.canvasCarrierHandoffError = "";
      state.canvasBootCompletedAt = nowIso();
      state.canvasBootElapsedMs = Math.max(0, Date.parse(state.canvasBootCompletedAt) - Date.parse(state.canvasBootStartedAt));
      state.updatedAt = state.canvasBootCompletedAt;

      emitMilestone(F13_EVENTS.F13K, 100, "Canvas ready.");

      sampleVisibleContent();

      state.booted = true;
      state.booting = false;
      state.updatedAt = nowIso();

      updateDocumentDataset();

      if (isFunction(options.onReady)) {
        options.onReady(getReceipt());
      }

      return getReceipt();
    } catch (error) {
      state.booting = false;
      state.booted = false;
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      state.errors.push({
        event: "CANVAS_BOOT_ERROR",
        message: state.canvasCarrierHandoffError,
        at: nowIso()
      });
      state.updatedAt = nowIso();

      classifyVisibleContentEvidence({
        hardFailReason: state.canvasCarrierHandoffError,
        samples: 0,
        nonblank: 0,
        variance: 0,
        land: 0,
        water: 0,
        other: 0,
        carrier: 0,
        classes: []
      });

      updateDocumentDataset();

      if (isFunction(options.onError)) {
        options.onError(error, getReceipt());
      }

      return getReceipt();
    }
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  function mount(options = {}) {
    ensureCanvas(options);
    updateDocumentDataset();
    return getReceipt();
  }

  function render(options = {}) {
    if (!state.canvas || !state.context) ensureCanvas(options);

    if (!state.atlasCanvas || !state.textureCanvas) {
      return bootCooperative(options);
    }

    renderSphere();
    state.canvasReady = true;
    state.canvasLaneClosed = true;
    emitMilestone(F13_EVENTS.F13K, 100, "Canvas ready.");
    sampleVisibleContent();
    updateDocumentDataset();
    return getReceipt();
  }

  function sample(point = {}) {
    const u = clamp01(safeNumber(point.u, 0.5));
    const v = clamp01(safeNumber(point.v, 0.5));
    const material = samplePlanetMaterial(u, v);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      u,
      v,
      lon: material.lon,
      lat: material.lat,
      x: material.x,
      y: material.y,
      z: material.z,
      rgb: material.rgb,
      landAlpha: material.isLand ? material.landSignal : 0,
      waterAlpha: material.isWater ? material.waterSignal : 0,
      airAlpha: 0.18,
      bodyBinding: 1,
      surfaceAttachment: 1,
      hydrosphereBinding: 1,
      surfaceSeat: 1,
      allowedToFloat: false,
      isCanvasSample: true,
      visualPassClaimed: false
    };
  }

  function read(point = {}) {
    return sample(point);
  }

  function on(callback) {
    if (isFunction(callback) && !state.callbacks.includes(callback)) {
      state.callbacks.push(callback);
    }

    return () => off(callback);
  }

  function off(callback) {
    const index = state.callbacks.indexOf(callback);
    if (index >= 0) state.callbacks.splice(index, 1);
  }

  function updateDocumentDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasRole = "f13-evidence-producer";

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasLaneClosed = String(state.canvasLaneClosed);
    dataset.hearthCanvasSoftGapAdapter = "true";
    dataset.hearthCanvasVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
    dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);

    dataset.hearthCanvasPostReadyRebootSuppressed = String(state.postCanvasReadyRebootSuppressed);
    dataset.hearthCanvasLateBootEventsArchived = String(state.lateCanvasBootEventsArchived);
    dataset.hearthCanvasDuplicateEventsSuppressed = String(state.duplicateCanvasEventsSuppressed);

    dataset.hearthCanvasF21Claimed = "false";
    dataset.hearthCanvasReadyTextClaimed = "false";
    dataset.hearthCanvasVisualPassClaimed = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.canvas) {
      state.canvas.dataset.hearthCanvasContract = CONTRACT;
      state.canvas.dataset.hearthCanvasReceipt = RECEIPT;
      state.canvas.dataset.hearthCanvasReady = String(state.canvasReady);
      state.canvas.dataset.hearthCanvasSoftGap = String(state.visibleContentSoftGap);
      state.canvas.dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function getReceipt() {
    readNorthAuthority();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: state.file,
      role: state.role,

      northAuthority: state.northAuthority,
      eastAuthority: state.eastAuthority,
      westAuthority: state.westAuthority,
      southAuthority: state.southAuthority,

      northAuthorityPresent: state.northAuthorityPresent,
      checkpointGovernorDetected: state.checkpointGovernorDetected,
      checkpointSessionSubmissionAvailable: state.checkpointSessionSubmissionAvailable,
      canvasEvidenceSubmittedToNorth: state.canvasEvidenceSubmittedToNorth,

      cooperativeBootAvailable: state.cooperativeBootAvailable,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
      canvasCarrierMethod: state.canvasCarrierMethod,
      canvasBootStartedAt: state.canvasBootStartedAt,
      canvasBootCompletedAt: state.canvasBootCompletedAt,
      canvasBootElapsedMs: state.canvasBootElapsedMs,
      canvasYieldCount: state.canvasYieldCount,
      canvasPhaseCount: state.canvasPhaseCount,

      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,

      canvasLaneClosed: state.canvasLaneClosed,
      postCanvasReadyRebootSuppressed: state.postCanvasReadyRebootSuppressed,
      lateCanvasBootEventsArchived: state.lateCanvasBootEventsArchived,
      duplicateCanvasEventsSuppressed: state.duplicateCanvasEventsSuppressed,
      progressOnlyEventsArchived: state.progressOnlyEventsArchived,
      regressiveCanvasEventsBlocked: state.regressiveCanvasEventsBlocked,

      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      renderedAfterTexture: state.renderedAfterTexture,
      dragInspectionBound: state.dragInspectionBound,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.slice(),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
      carrierOnlyDetected: state.carrierOnlyDetected,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,

      canvasPhaseEvents: clonePlain(state.canvasPhaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      archivedLateEvents: clonePlain(state.archivedLateEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      updatedAt: state.updatedAt
    };
  }

  function getReceiptText() {
    const receipt = getReceipt();

    const canvasEvents = receipt.canvasPhaseEvents.map((event) => (
      `- ${event.at} :: ${event.event} :: progress=${event.progress} :: ${event.message}`
    )).join("\n") || "- none";

    const progressOnly = receipt.progressOnlyEvents.map((event) => (
      `- ${event.at} :: ${event.event} :: progress=${event.progress} :: ${event.message}`
    )).join("\n") || "- none";

    const archivedLate = receipt.archivedLateEvents.map((event) => (
      `- ${event.at} :: ${event.event} :: progress=${event.progress} :: reason=${event.reason} :: ${event.message}`
    )).join("\n") || "- none";

    const errors = receipt.errors.map((event) => (
      `- ${event.at} :: ${event.event} :: ${event.message}`
    )).join("\n") || "- none";

    return [
      "HEARTH_CANVAS_NEWS_FIBONACCI_SOFT_GAP_EVIDENCE_ADAPTER_RECEIPT",
      "",
      `contract=${receipt.contract}`,
      `receipt=${receipt.receipt}`,
      `previousContract=${receipt.previousContract}`,
      `baselineContract=${receipt.baselineContract}`,
      `version=${receipt.version}`,
      `file=${receipt.file}`,
      `role=${receipt.role}`,
      "",
      `northAuthorityPresent=${receipt.northAuthorityPresent}`,
      `checkpointGovernorDetected=${receipt.checkpointGovernorDetected}`,
      `checkpointSessionSubmissionAvailable=${receipt.checkpointSessionSubmissionAvailable}`,
      `canvasEvidenceSubmittedToNorth=${receipt.canvasEvidenceSubmittedToNorth}`,
      "",
      `canvasReady=${receipt.canvasReady}`,
      `canvasCarrierMounted=${receipt.canvasCarrierMounted}`,
      `canvasContextReady=${receipt.canvasContextReady}`,
      `canvasCarrierRequested=${receipt.canvasCarrierRequested}`,
      `canvasCarrierHandoffOk=${receipt.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${receipt.canvasCarrierHandoffError}`,
      "",
      `canvasLaneClosed=${receipt.canvasLaneClosed}`,
      `postCanvasReadyRebootSuppressed=${receipt.postCanvasReadyRebootSuppressed}`,
      `lateCanvasBootEventsArchived=${receipt.lateCanvasBootEventsArchived}`,
      `duplicateCanvasEventsSuppressed=${receipt.duplicateCanvasEventsSuppressed}`,
      `progressOnlyEventsArchived=${receipt.progressOnlyEventsArchived}`,
      `regressiveCanvasEventsBlocked=${receipt.regressiveCanvasEventsBlocked}`,
      "",
      `atlasBuildStarted=${receipt.atlasBuildStarted}`,
      `atlasBuildProgress=${receipt.atlasBuildProgress}`,
      `atlasBuildComplete=${receipt.atlasBuildComplete}`,
      `textureComposeStarted=${receipt.textureComposeStarted}`,
      `textureComposeProgress=${receipt.textureComposeProgress}`,
      `textureComposeComplete=${receipt.textureComposeComplete}`,
      `firstFrameRequested=${receipt.firstFrameRequested}`,
      `firstFrameDetected=${receipt.firstFrameDetected}`,
      `imageRendered=${receipt.imageRendered}`,
      `renderedAfterTexture=${receipt.renderedAfterTexture}`,
      `dragInspectionBound=${receipt.dragInspectionBound}`,
      "",
      `visibleContentProofStarted=${receipt.visibleContentProofStarted}`,
      `visibleContentProof=${receipt.visibleContentProof}`,
      `visibleContentStrictProof=${receipt.visibleContentStrictProof}`,
      `visibleContentSoftGap=${receipt.visibleContentSoftGap}`,
      `visibleContentHardFail=${receipt.visibleContentHardFail}`,
      `visibleForwardProgress=${receipt.visibleForwardProgress}`,
      `visibleContentAdmissible=${receipt.visibleContentAdmissible}`,
      `visiblePlanetAvailable=${receipt.visiblePlanetAvailable}`,
      `visibleContentProofMethod=${receipt.visibleContentProofMethod}`,
      `visibleContentProofError=${receipt.visibleContentProofError}`,
      `visibleContentSampleCount=${receipt.visibleContentSampleCount}`,
      `visibleContentVarianceScore=${receipt.visibleContentVarianceScore}`,
      `visibleContentClassCount=${receipt.visibleContentClassCount}`,
      `visibleContentClasses=${receipt.visibleContentClasses.join(",")}`,
      `visibleContentLandSampleCount=${receipt.visibleContentLandSampleCount}`,
      `visibleContentWaterSampleCount=${receipt.visibleContentWaterSampleCount}`,
      `visibleContentOtherSampleCount=${receipt.visibleContentOtherSampleCount}`,
      `visibleContentCarrierSampleCount=${receipt.visibleContentCarrierSampleCount}`,
      `carrierOnlyDetected=${receipt.carrierOnlyDetected}`,
      "",
      `planetCanvasPresent=${receipt.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${receipt.planetCanvasNonZeroSize}`,
      `planetFramePainted=${receipt.planetFramePainted}`,
      `nonblankPlanetVisible=${receipt.nonblankPlanetVisible}`,
      `planetNotObstructed=${receipt.planetNotObstructed}`,
      "",
      `f13CanvasEvidenceComplete=${receipt.f13CanvasEvidenceComplete}`,
      `f13HardFail=${receipt.f13HardFail}`,
      `f21ClaimedByCanvas=${receipt.f21ClaimedByCanvas}`,
      `readyTextClaimedByCanvas=${receipt.readyTextClaimedByCanvas}`,
      "",
      "CANVAS_PHASE_EVENTS",
      canvasEvents,
      "",
      "PROGRESS_ONLY_EVENTS",
      progressOnly,
      "",
      "ARCHIVED_LATE_EVENTS",
      archivedLate,
      "",
      "ERRORS",
      errors,
      "",
      `generatedImage=${receipt.generatedImage}`,
      `graphicBox=${receipt.graphicBox}`,
      `webGL=${receipt.webGL}`,
      `visualPassClaimed=${receipt.visualPassClaimed}`,
      "",
      `updatedAt=${receipt.updatedAt}`
    ].join("\n");
  }

  function exportCanvasEvidenceReceipt() {
    return getReceipt();
  }

  function getState() {
    return state;
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    bootCooperative,
    boot,
    mount,
    render,
    sample,
    read,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    exportCanvasEvidenceReceipt,
    readNorthAuthority,
    submitCanvasEvidence,
    getReceipt,
    getReceiptText,
    getState,
    on,
    off,

    canvasEvidenceProducer: true,
    f13CanvasEvidenceProducer: true,
    newsFibonacciSoftGapAdapter: true,
    softGapForwardProgressAllowed: true,
    hardFailReservedForStructuralFailure: true,
    duplicatePostReadyBootSuppression: true,

    ownsCanvasEvidenceOnly: true,
    doesNotOwnPlanetTruth: true,
    doesNotOwnRuntimeTableGovernance: true,
    doesNotOwnNewsFinalAuthority: true,
    doesNotOwnF21: true,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH.canvasAuthority = api;
  root.HEARTH.canvasEvidence = api;

  root.HEARTH_CANVAS = api;
  root.HEARTH_CANVAS_AUTHORITY = api;
  root.HEARTH_CANVAS_EVIDENCE = api;
  root.HEARTH_CANVAS_TEXTURE = api;
  root.HEARTH_CANVAS_SOFT_GAP_ADAPTER = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasEvidence = api;

  updateDocumentDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
