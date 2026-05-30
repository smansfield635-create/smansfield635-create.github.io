// /assets/hearth/hearth.canvas.south.js
// HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF_TNT_v1
// Full-file replacement.
// Canvas South / texture composition, sphere rendering, clarity, and visible proof only.
// Purpose:
// - Serve the Canvas North split parent under /assets/hearth/hearth.canvas.js.
// - Own texture composition from East atlas output.
// - Own visible 2D sphere rendering from cached texture.
// - Own visible-content proof classification for F13 evidence.
// - Preserve public methods required by Canvas North:
//   composeTexture, renderSphere, renderSphereSync, getTextureCanvas,
//   sampleVisibleContent, classifyVisibleContentEvidence, invalidateTexture, getReceipt.
// - Keep canvas as receiver/output carrier only.
// - Preserve NEWS/Fibonacci F13 synchronization.
// Does not own:
// - planet truth
// - material truth
// - hydrology truth
// - elevation truth
// - atlas source formation
// - drag / zoom control
// - Runtime Table governance
// - route readiness
// - F21
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const VERSION = "2026-05-30.hearth-canvas-south-texture-sphere-visible-proof-v1";
  const FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_TEXTURE_WIDTH = 768;
  const DEFAULT_TEXTURE_HEIGHT = 384;
  const COMPOSE_ROWS_PER_CHUNK = 12;
  const RENDER_ROWS_PER_CHUNK = 18;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "canvas-south-texture-sphere-visible-proof",

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",

    canvasSouthActive: true,
    canvasSouthReady: true,
    splitAdapterRole: "SOUTH",
    splitAdapterTransistorMode: true,
    visibleOutputControlActive: true,

    textureCanvas: null,
    textureContext: null,
    textureWidth: 0,
    textureHeight: 0,
    textureSourceContract: "",
    textureSourceReceipt: "",
    textureSourceWidth: 0,
    textureSourceHeight: 0,

    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    textureComposeStartedAt: "",
    textureComposeCompletedAt: "",
    textureComposeElapsedMs: 0,
    textureComposeYieldCount: 0,
    textureComposeError: "",

    textureInvalidated: false,
    textureInvalidationReason: "",
    textureInvalidationCount: 0,
    textureRebuildRequested: false,
    textureRebuildComplete: false,
    textureRebuildError: "",

    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    renderedAfterTexture: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,

    renderStarted: false,
    renderProgress: 0,
    renderFrameCount: 0,
    renderStartedAt: "",
    renderCompletedAt: "",
    renderElapsedMs: 0,
    renderYieldCount: 0,
    renderError: "",

    canvasWidth: 0,
    canvasHeight: 0,
    renderRadius: 0,
    renderCenterX: 0,
    renderCenterY: 0,
    lastYaw: 0,
    lastPitch: 0,
    lastZoom: 1,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
    visiblePlanetAvailable: false,
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

    clarityRenewalActive: true,
    hazeReduced: true,
    highDpiCanvasActive: true,
    sourceColorDemotedToPaletteInfluence: true,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlineContrastActive: true,
    centerDarknessReduced: true,
    lightingPreservesSurfaceReadability: true,
    staleSourceMaskProtectionActive: true,

    ownsTextureComposition: true,
    ownsSphereRendering: true,
    ownsVisibleProof: true,
    ownsCanvasSouthOutput: true,
    ownsAtlasFormation: false,
    ownsSourceIntake: false,
    ownsDragInspection: false,
    ownsZoomInspection: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsF21: false,

    f13VisibleEvidencePreserved: true,
    f13VisibleEvidenceComplete: false,
    f13HardFail: false,
    f21ClaimedByCanvasSouth: false,
    readyTextClaimedByCanvasSouth: false,

    localEvents: [],
    errors: [],

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

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function mix(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);

    if (state.localEvents.length > 140) {
      state.localEvents.splice(0, state.localEvents.length - 140);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code,
      event: code,
      message: error && error.message ? error.message : String(error || ""),
      detail: clonePlain(detail)
    };

    state.errors.push(item);

    if (state.errors.length > 100) {
      state.errors.splice(0, state.errors.length - 100);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function yieldFrame() {
    state.renderYieldCount += 1;

    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(resolve);
      } else {
        root.setTimeout(resolve, 0);
      }
    });
  }

  function createCanvas(width, height) {
    if (!doc || !isFunction(doc.createElement)) {
      throw new Error("Canvas South requires document.createElement.");
    }

    const canvas = doc.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));

    const context = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });

    if (!context) throw new Error("Canvas South 2D context unavailable.");

    return { canvas, context };
  }

  function sourceCanvasFrom(options = {}) {
    const source =
      options.atlasCanvas ||
      options.sourceCanvas ||
      options.textureSource ||
      options.canvas ||
      null;

    if (source && Number(source.width) > 0 && Number(source.height) > 0) {
      return source;
    }

    if (state.textureCanvas) return state.textureCanvas;

    throw new Error("Canvas South composeTexture requires a valid atlasCanvas.");
  }

  function readSourceReceipt(source) {
    if (!source || !source.dataset) {
      return {
        contract: "",
        receipt: ""
      };
    }

    return {
      contract:
        source.dataset.hearthCanvasEastContract ||
        source.dataset.hearthMaterialsContract ||
        source.dataset.hearthCanvasContract ||
        "",
      receipt:
        source.dataset.hearthCanvasEastReceipt ||
        source.dataset.hearthMaterialsReceipt ||
        source.dataset.hearthCanvasReceipt ||
        ""
    };
  }

  function stampTextureCanvas(canvas) {
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthCanvasSouthTexture = "true";
    canvas.dataset.hearthCanvasSouthContract = CONTRACT;
    canvas.dataset.hearthCanvasSouthReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSouthRole = state.role;
    canvas.dataset.hearthCanvasSouthTextureComposeComplete = String(state.textureComposeComplete);
    canvas.dataset.hearthCanvasSouthClarityRenewalActive = "true";
    canvas.dataset.hearthCanvasSouthHazeReduced = "true";
    canvas.dataset.hearthCanvasSouthOwnsPlanetTruth = "false";
    canvas.dataset.hearthCanvasSouthOwnsF21 = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
  }

  function stampOutputCanvas(canvas) {
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthCanvasSouthRendered = String(state.imageRendered);
    canvas.dataset.hearthCanvasSouthContract = CONTRACT;
    canvas.dataset.hearthCanvasSouthReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSouthVisibleProof = String(state.visibleContentProof);
    canvas.dataset.hearthCanvasSouthVisibleStrictProof = String(state.visibleContentStrictProof);
    canvas.dataset.hearthCanvasSouthVisibleSoftGap = String(state.visibleContentSoftGap);
    canvas.dataset.hearthCanvasSouthVisibleHardFail = String(state.visibleContentHardFail);
    canvas.dataset.hearthCanvasSouthOwnsPlanetTruth = "false";
    canvas.dataset.hearthCanvasSouthOwnsF21 = "false";
    canvas.dataset.visualPassClaimed = "false";
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasSouthLoaded = "true";
    dataset.hearthCanvasSouthContract = CONTRACT;
    dataset.hearthCanvasSouthReceipt = RECEIPT;
    dataset.hearthCanvasSouthPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasSouthBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasSouthVersion = VERSION;
    dataset.hearthCanvasSouthFile = FILE;
    dataset.hearthCanvasSouthRole = state.role;

    dataset.hearthCanvasSouthNewsProtocolSynchronized = "true";
    dataset.hearthCanvasSouthFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasSouthActiveFibonacciGate = "F13";
    dataset.hearthCanvasSouthFutureFibonacciGate = "F21";
    dataset.hearthCanvasSouthOneActiveGearAtATime = "true";

    dataset.hearthCanvasSouthActive = "true";
    dataset.hearthCanvasSouthReady = "true";
    dataset.hearthCanvasSouthTextureComposeStarted = String(state.textureComposeStarted);
    dataset.hearthCanvasSouthTextureComposeProgress = String(state.textureComposeProgress);
    dataset.hearthCanvasSouthTextureComposeComplete = String(state.textureComposeComplete);
    dataset.hearthCanvasSouthTextureInvalidated = String(state.textureInvalidated);

    dataset.hearthCanvasSouthFirstFrameRequested = String(state.firstFrameRequested);
    dataset.hearthCanvasSouthFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthCanvasSouthImageRendered = String(state.imageRendered);
    dataset.hearthCanvasSouthRenderedAfterTexture = String(state.renderedAfterTexture);
    dataset.hearthCanvasSouthPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthCanvasSouthNonblankPlanetVisible = String(state.nonblankPlanetVisible);
    dataset.hearthCanvasSouthPlanetNotObstructed = String(state.planetNotObstructed);

    dataset.hearthCanvasSouthVisibleContentProofStarted = String(state.visibleContentProofStarted);
    dataset.hearthCanvasSouthVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasSouthVisibleContentStrictProof = String(state.visibleContentStrictProof);
    dataset.hearthCanvasSouthVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasSouthVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasSouthVisiblePlanetAvailable = String(state.visiblePlanetAvailable);

    dataset.hearthCanvasSouthClarityRenewalActive = "true";
    dataset.hearthCanvasSouthHazeReduced = "true";
    dataset.hearthCanvasSouthHighDpiCanvasActive = "true";
    dataset.hearthCanvasSouthCoastlineContrastActive = "true";
    dataset.hearthCanvasSouthLightingPreservesSurfaceReadability = "true";

    dataset.hearthCanvasSouthOwnsTextureComposition = "true";
    dataset.hearthCanvasSouthOwnsSphereRendering = "true";
    dataset.hearthCanvasSouthOwnsVisibleProof = "true";
    dataset.hearthCanvasSouthOwnsAtlasFormation = "false";
    dataset.hearthCanvasSouthOwnsDragInspection = "false";
    dataset.hearthCanvasSouthOwnsZoomInspection = "false";
    dataset.hearthCanvasSouthOwnsPlanetTruth = "false";
    dataset.hearthCanvasSouthOwnsRuntimeTableGovernance = "false";
    dataset.hearthCanvasSouthOwnsRouteReadiness = "false";
    dataset.hearthCanvasSouthOwnsF21 = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.textureCanvas) stampTextureCanvas(state.textureCanvas);
  }

  function pixelClass(r, g, b, a) {
    if (a < 12) return "transparent";
    if (r < 8 && g < 8 && b < 8) return "carrier";

    if (b > r + 8 && b >= g + 2) return "water";
    if (g >= b && g >= r * 0.72) return "land";
    if (r >= g && g >= b * 0.70) return "land";
    if (r + g + b > 90) return "other";

    return "carrier";
  }

  function clearCanvas(context, width, height) {
    context.clearRect(0, 0, width, height);
  }

  async function composeTexture(options = {}) {
    state.textureComposeStarted = true;
    state.textureComposeComplete = false;
    state.textureComposeProgress = 0;
    state.textureComposeStartedAt = nowIso();
    state.textureComposeCompletedAt = "";
    state.textureComposeElapsedMs = 0;
    state.textureComposeError = "";
    state.textureComposeYieldCount = 0;
    state.textureRebuildRequested = options.rebuild === true;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";

    updateDataset();

    try {
      const source = sourceCanvasFrom(options);
      const sourceReceipt = readSourceReceipt(source);
      const width = Math.max(1, Math.round(source.width || DEFAULT_TEXTURE_WIDTH));
      const height = Math.max(1, Math.round(source.height || DEFAULT_TEXTURE_HEIGHT));

      const working = createCanvas(width, height);
      const canvas = working.canvas;
      const context = working.context;

      context.clearRect(0, 0, width, height);
      context.drawImage(source, 0, 0, width, height);

      const image = context.getImageData(0, 0, width, height);
      const data = image.data;

      state.textureSourceContract = sourceReceipt.contract;
      state.textureSourceReceipt = sourceReceipt.receipt;
      state.textureSourceWidth = width;
      state.textureSourceHeight = height;

      for (let yStart = 0; yStart < height; yStart += COMPOSE_ROWS_PER_CHUNK) {
        const yEnd = Math.min(height, yStart + COMPOSE_ROWS_PER_CHUNK);

        for (let y = yStart; y < yEnd; y += 1) {
          const v = height <= 1 ? 0 : y / (height - 1);
          const latitudeEdge = Math.abs(v - 0.5) * 2;

          for (let x = 0; x < width; x += 1) {
            const index = (y * width + x) * 4;

            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            if (a < 8) continue;

            const brightness = (r + g + b) / 3;
            const contrast = 1.055;
            const hazeLift = 5;
            const polarModeration = latitudeEdge > 0.72 ? 0.94 : 1;

            data[index] = clamp((r - 128) * contrast + 128 + hazeLift, 0, 255);
            data[index + 1] = clamp((g - 128) * contrast + 128 + hazeLift, 0, 255);
            data[index + 2] = clamp((b - 128) * contrast + 128 + hazeLift, 0, 255);

            if (brightness < 34) {
              data[index] = clamp(data[index] + 4, 0, 255);
              data[index + 1] = clamp(data[index + 1] + 5, 0, 255);
              data[index + 2] = clamp(data[index + 2] + 6, 0, 255);
            }

            data[index] = clamp(data[index] * polarModeration, 0, 255);
            data[index + 1] = clamp(data[index + 1] * polarModeration, 0, 255);
            data[index + 2] = clamp(data[index + 2] * polarModeration, 0, 255);
          }
        }

        state.textureComposeProgress = Math.round((yEnd / height) * 100);
        state.updatedAt = nowIso();

        if (isFunction(options.onProgress)) {
          try {
            options.onProgress(state.textureComposeProgress, getReceipt());
          } catch (error) {
            recordError("SOUTH_TEXTURE_PROGRESS_CALLBACK_FAILED", error);
          }
        }

        await yieldFrame();
      }

      context.putImageData(image, 0, 0);

      state.textureCanvas = canvas;
      state.textureContext = context;
      state.textureWidth = width;
      state.textureHeight = height;

      state.textureComposeProgress = 100;
      state.textureComposeComplete = true;
      state.textureInvalidated = false;
      state.textureInvalidationReason = "";
      state.textureRebuildComplete = options.rebuild === true;
      state.textureComposeCompletedAt = nowIso();
      state.textureComposeElapsedMs = Math.max(0, Date.parse(state.textureComposeCompletedAt) - Date.parse(state.textureComposeStartedAt));
      state.updatedAt = state.textureComposeCompletedAt;

      stampTextureCanvas(canvas);

      recordLocal("SOUTH_TEXTURE_COMPOSE_COMPLETE", {
        width,
        height,
        sourceContract: state.textureSourceContract,
        sourceReceipt: state.textureSourceReceipt
      });

      updateDataset();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        textureCanvas: canvas,
        textureContext: context,
        width,
        height,
        receiptPacket: getReceipt(),
        visualPassClaimed: false
      };
    } catch (error) {
      state.textureComposeError = error && error.message ? error.message : String(error);
      state.textureRebuildError = state.textureComposeError;
      state.textureComposeComplete = false;
      state.textureRebuildComplete = false;

      recordError("SOUTH_TEXTURE_COMPOSE_FAILED", error);

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        error: state.textureComposeError,
        receiptPacket: getReceipt(),
        visualPassClaimed: false
      };
    }
  }

  function getTextureCanvas() {
    return state.textureCanvas;
  }

  function texturePixel(textureData, textureWidth, textureHeight, u, v) {
    const uu = ((u % 1) + 1) % 1;
    const vv = clamp01(v);

    const x = Math.floor(uu * (textureWidth - 1));
    const y = Math.floor(vv * (textureHeight - 1));
    const index = (y * textureWidth + x) * 4;

    return [
      textureData[index],
      textureData[index + 1],
      textureData[index + 2],
      textureData[index + 3]
    ];
  }

  function rotatedSphereVector(px, py, radius, yaw, pitch) {
    const nx = px / radius;
    const ny = py / radius;
    const r2 = nx * nx + ny * ny;

    if (r2 > 1) return null;

    const nz = Math.sqrt(Math.max(0, 1 - r2));

    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);

    const x1 = nx * cosYaw + nz * sinYaw;
    const z1 = -nx * sinYaw + nz * cosYaw;
    const y1 = -ny;

    const y2 = y1 * cosPitch - z1 * sinPitch;
    const z2 = y1 * sinPitch + z1 * cosPitch;

    const lon = Math.atan2(x1, z2);
    const lat = Math.asin(clamp(y2, -1, 1));

    return {
      u: lon / (Math.PI * 2) + 0.5,
      v: 0.5 - lat / Math.PI,
      normalZ: nz,
      edge: 1 - r2,
      r2
    };
  }

  function resolveRenderInputs(options = {}) {
    const canvas = options.canvas || options.outputCanvas || null;
    const textureCanvas = options.textureCanvas || state.textureCanvas || null;
    const view = options.view || {};

    if (!canvas || !isFunction(canvas.getContext)) {
      throw new Error("Canvas South renderSphere requires an output canvas.");
    }

    if (!textureCanvas || !isFunction(textureCanvas.getContext)) {
      throw new Error("Canvas South renderSphere requires a composed texture canvas.");
    }

    const context = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });

    if (!context) throw new Error("Canvas South output 2D context unavailable.");

    const textureContext = textureCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });

    if (!textureContext) throw new Error("Canvas South texture context unavailable.");

    const width = Math.max(1, Math.round(canvas.width || 1));
    const height = Math.max(1, Math.round(canvas.height || 1));
    const textureWidth = Math.max(1, Math.round(textureCanvas.width || DEFAULT_TEXTURE_WIDTH));
    const textureHeight = Math.max(1, Math.round(textureCanvas.height || DEFAULT_TEXTURE_HEIGHT));

    const yaw = safeNumber(view.yaw !== undefined ? view.yaw : view.rotationYaw, 0);
    const pitch = clamp(view.pitch !== undefined ? view.pitch : view.rotationPitch, -1.18, 1.18);
    const zoom = clamp(view.zoomLevel !== undefined ? view.zoomLevel : view.zoom, 0.82, 2.8);

    return {
      canvas,
      context,
      textureCanvas,
      textureContext,
      width,
      height,
      textureWidth,
      textureHeight,
      yaw,
      pitch,
      zoom
    };
  }

  function renderRowRange(inputs, outputImage, textureImage, yStart, yEnd) {
    const {
      width,
      height,
      textureWidth,
      textureHeight,
      yaw,
      pitch,
      zoom
    } = inputs;

    const out = outputImage.data;
    const tex = textureImage.data;

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = Math.max(8, Math.min(width, height) * 0.435 * zoom);

    state.renderCenterX = centerX;
    state.renderCenterY = centerY;
    state.renderRadius = radius;
    state.lastYaw = yaw;
    state.lastPitch = pitch;
    state.lastZoom = zoom;

    for (let y = yStart; y < yEnd; y += 1) {
      const dy = y - centerY;

      for (let x = 0; x < width; x += 1) {
        const dx = x - centerX;
        const index = (y * width + x) * 4;
        const sphere = rotatedSphereVector(dx, dy, radius, yaw, pitch);

        if (!sphere) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          const halo = clamp01(1 - Math.abs(distance - radius) / Math.max(1, radius * 0.045));

          if (halo > 0) {
            out[index] = 14;
            out[index + 1] = 22;
            out[index + 2] = 32;
            out[index + 3] = Math.round(halo * 86);
          } else {
            out[index] = 0;
            out[index + 1] = 0;
            out[index + 2] = 0;
            out[index + 3] = 0;
          }

          continue;
        }

        const pixel = texturePixel(tex, textureWidth, textureHeight, sphere.u, sphere.v);

        const limb = clamp01(Math.pow(sphere.normalZ, 0.58));
        const light = clamp(0.50 + limb * 0.58, 0.34, 1.10);
        const rim = clamp01(1 - sphere.edge * 2.6);
        const atmosphericLift = rim * 10;

        out[index] = clamp(pixel[0] * light + atmosphericLift, 0, 255);
        out[index + 1] = clamp(pixel[1] * light + atmosphericLift * 1.12, 0, 255);
        out[index + 2] = clamp(pixel[2] * light + atmosphericLift * 1.55, 0, 255);
        out[index + 3] = 255;
      }
    }
  }

  async function renderSphere(options = {}) {
    state.renderStarted = true;
    state.renderProgress = 0;
    state.renderStartedAt = nowIso();
    state.renderCompletedAt = "";
    state.renderElapsedMs = 0;
    state.renderError = "";
    state.firstFrameRequested = true;
    state.updatedAt = state.renderStartedAt;

    updateDataset();

    try {
      const inputs = resolveRenderInputs(options);
      const textureImage = inputs.textureContext.getImageData(0, 0, inputs.textureWidth, inputs.textureHeight);
      const outputImage = inputs.context.createImageData(inputs.width, inputs.height);

      clearCanvas(inputs.context, inputs.width, inputs.height);

      for (let yStart = 0; yStart < inputs.height; yStart += RENDER_ROWS_PER_CHUNK) {
        const yEnd = Math.min(inputs.height, yStart + RENDER_ROWS_PER_CHUNK);

        renderRowRange(inputs, outputImage, textureImage, yStart, yEnd);

        state.renderProgress = Math.round((yEnd / inputs.height) * 100);

        if (isFunction(options.onProgress)) {
          try {
            options.onProgress(state.renderProgress, getReceipt());
          } catch (error) {
            recordError("SOUTH_RENDER_PROGRESS_CALLBACK_FAILED", error);
          }
        }

        await yieldFrame();
      }

      inputs.context.putImageData(outputImage, 0, 0);

      state.renderProgress = 100;
      state.renderFrameCount += 1;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.renderedAfterTexture = state.textureComposeComplete === true;
      state.planetFramePainted = true;
      state.nonblankPlanetVisible = true;
      state.planetNotObstructed = true;
      state.visiblePlanetAvailable = true;
      state.renderCompletedAt = nowIso();
      state.renderElapsedMs = Math.max(0, Date.parse(state.renderCompletedAt) - Date.parse(state.renderStartedAt));
      state.updatedAt = state.renderCompletedAt;

      stampOutputCanvas(inputs.canvas);
      updateDataset();

      recordLocal("SOUTH_RENDER_SPHERE_COMPLETE", {
        width: inputs.width,
        height: inputs.height,
        textureWidth: inputs.textureWidth,
        textureHeight: inputs.textureHeight,
        yaw: inputs.yaw,
        pitch: inputs.pitch,
        zoom: inputs.zoom
      });

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        imageRendered: true,
        firstFrameDetected: true,
        renderedAfterTexture: state.renderedAfterTexture,
        receiptPacket: getReceipt(),
        visualPassClaimed: false
      };
    } catch (error) {
      state.renderError = error && error.message ? error.message : String(error);
      state.imageRendered = false;
      state.firstFrameDetected = false;

      recordError("SOUTH_RENDER_SPHERE_FAILED", error);

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        imageRendered: false,
        error: state.renderError,
        receiptPacket: getReceipt(),
        visualPassClaimed: false
      };
    }
  }

  function renderSphereSync(options = {}) {
    try {
      const inputs = resolveRenderInputs(options);
      const textureImage = inputs.textureContext.getImageData(0, 0, inputs.textureWidth, inputs.textureHeight);
      const outputImage = inputs.context.createImageData(inputs.width, inputs.height);

      clearCanvas(inputs.context, inputs.width, inputs.height);
      renderRowRange(inputs, outputImage, textureImage, 0, inputs.height);
      inputs.context.putImageData(outputImage, 0, 0);

      state.renderProgress = 100;
      state.renderFrameCount += 1;
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.renderedAfterTexture = state.textureComposeComplete === true;
      state.planetFramePainted = true;
      state.nonblankPlanetVisible = true;
      state.planetNotObstructed = true;
      state.visiblePlanetAvailable = true;
      state.updatedAt = nowIso();

      stampOutputCanvas(inputs.canvas);
      updateDataset();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        imageRendered: true,
        sync: true,
        receiptPacket: getReceipt(),
        visualPassClaimed: false
      };
    } catch (error) {
      state.renderError = error && error.message ? error.message : String(error);
      recordError("SOUTH_RENDER_SPHERE_SYNC_FAILED", error);

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        imageRendered: false,
        sync: true,
        error: state.renderError,
        receiptPacket: getReceipt(),
        visualPassClaimed: false
      };
    }
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const sampleCount = safeNumber(metrics.sampleCount, metrics.visibleContentSampleCount || 0);
    const carrierCount = safeNumber(metrics.carrierCount, metrics.visibleContentCarrierSampleCount || 0);
    const landCount = safeNumber(metrics.landCount, metrics.visibleContentLandSampleCount || 0);
    const waterCount = safeNumber(metrics.waterCount, metrics.visibleContentWaterSampleCount || 0);
    const otherCount = safeNumber(metrics.otherCount, metrics.visibleContentOtherSampleCount || 0);
    const variance = safeNumber(metrics.varianceScore, metrics.visibleContentVarianceScore || 0);
    const classCount = safeNumber(metrics.classCount, metrics.visibleContentClassCount || 0);

    const contentCount = landCount + waterCount + otherCount;
    const nonCarrierRatio = sampleCount > 0 ? contentCount / sampleCount : 0;
    const balancedSurface = landCount > 0 && waterCount > 0;
    const strict =
      sampleCount >= 36 &&
      contentCount >= 18 &&
      nonCarrierRatio >= 0.26 &&
      variance >= 18 &&
      classCount >= 2 &&
      balancedSurface;

    const soft =
      !strict &&
      sampleCount >= 24 &&
      contentCount >= 8 &&
      variance >= 8 &&
      classCount >= 1;

    const hardFail = !strict && !soft;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      visibleContentProof: strict || soft,
      visibleContentStrictProof: strict,
      visibleContentSoftGap: soft,
      visibleContentHardFail: hardFail,
      visibleForwardProgress: strict || soft || contentCount > 0,
      visibleContentAdmissible: strict || soft,
      visiblePlanetAvailable: strict || soft || contentCount > 0,
      carrierOnlyDetected: carrierCount > 0 && contentCount === 0,
      visibleContentProofMethod: strict
        ? "strict-land-water-variance-proof"
        : soft
          ? "soft-visible-content-forward-progress-proof"
          : "hard-fail-no-visible-content-proof",
      f13VisibleEvidenceComplete: strict || soft,
      f13HardFail: hardFail,
      f21ClaimedByCanvasSouth: false,
      visualPassClaimed: false
    };
  }

  function sampleVisibleContent(options = {}) {
    state.visibleContentProofStarted = true;
    state.visibleContentProofError = "";

    const canvas = options.canvas || options.outputCanvas || null;

    if (!canvas || !isFunction(canvas.getContext)) {
      const error = new Error("Canvas South visible-content proof requires a canvas.");
      state.visibleContentProofError = error.message;
      state.visibleContentProof = false;
      state.visibleContentStrictProof = false;
      state.visibleContentSoftGap = false;
      state.visibleContentHardFail = true;
      state.visiblePlanetAvailable = false;
      state.f13HardFail = true;

      recordError("SOUTH_VISIBLE_PROOF_CANVAS_MISSING", error);
      updateDataset();
      return getVisibleProofPacket();
    }

    try {
      const context = canvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true
      });

      if (!context) throw new Error("Visible proof context unavailable.");

      const width = Math.max(1, Math.round(canvas.width || 1));
      const height = Math.max(1, Math.round(canvas.height || 1));

      const grid = safeNumber(options.grid, 13);
      const sampleGrid = clamp(Math.round(grid), 7, 21);

      const image = context.getImageData(0, 0, width, height);
      const data = image.data;

      let sampleCount = 0;
      let carrierCount = 0;
      let landCount = 0;
      let waterCount = 0;
      let otherCount = 0;
      let sum = 0;
      let sumSq = 0;

      const classes = new Set();

      for (let gy = 0; gy < sampleGrid; gy += 1) {
        const y = Math.round(((gy + 0.5) / sampleGrid) * (height - 1));

        for (let gx = 0; gx < sampleGrid; gx += 1) {
          const x = Math.round(((gx + 0.5) / sampleGrid) * (width - 1));
          const dx = (x - width * 0.5) / Math.max(1, state.renderRadius || Math.min(width, height) * 0.435);
          const dy = (y - height * 0.5) / Math.max(1, state.renderRadius || Math.min(width, height) * 0.435);

          if (dx * dx + dy * dy > 1.04) continue;

          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          const cls = pixelClass(r, g, b, a);
          const brightness = (r + g + b) / 3;

          sampleCount += 1;
          sum += brightness;
          sumSq += brightness * brightness;

          if (cls === "land") landCount += 1;
          else if (cls === "water") waterCount += 1;
          else if (cls === "other") otherCount += 1;
          else if (cls === "carrier") carrierCount += 1;

          if (cls !== "transparent") classes.add(cls);
        }
      }

      const mean = sampleCount > 0 ? sum / sampleCount : 0;
      const variance = sampleCount > 0
        ? Math.sqrt(Math.max(0, sumSq / sampleCount - mean * mean))
        : 0;

      const metrics = {
        sampleCount,
        carrierCount,
        landCount,
        waterCount,
        otherCount,
        varianceScore: variance,
        classCount: classes.size
      };

      const classified = classifyVisibleContentEvidence(metrics);

      state.visibleContentSampleCount = sampleCount;
      state.visibleContentCarrierSampleCount = carrierCount;
      state.visibleContentLandSampleCount = landCount;
      state.visibleContentWaterSampleCount = waterCount;
      state.visibleContentOtherSampleCount = otherCount;
      state.visibleContentVarianceScore = Number(variance.toFixed(3));
      state.visibleContentClassCount = classes.size;
      state.visibleContentClasses = Array.from(classes).sort();

      state.visibleContentProof = classified.visibleContentProof;
      state.visibleContentStrictProof = classified.visibleContentStrictProof;
      state.visibleContentSoftGap = classified.visibleContentSoftGap;
      state.visibleContentHardFail = classified.visibleContentHardFail;
      state.visibleForwardProgress = classified.visibleForwardProgress;
      state.visibleContentAdmissible = classified.visibleContentAdmissible;
      state.visiblePlanetAvailable = classified.visiblePlanetAvailable;
      state.carrierOnlyDetected = classified.carrierOnlyDetected;
      state.visibleContentProofMethod = classified.visibleContentProofMethod;

      state.f13VisibleEvidenceComplete = classified.f13VisibleEvidenceComplete;
      state.f13HardFail = classified.f13HardFail;

      state.nonblankPlanetVisible = state.visiblePlanetAvailable;
      state.planetNotObstructed = state.visiblePlanetAvailable;
      state.updatedAt = nowIso();

      stampOutputCanvas(canvas);
      updateDataset();

      recordLocal("SOUTH_VISIBLE_CONTENT_PROOF_SAMPLED", {
        sampleCount,
        landCount,
        waterCount,
        otherCount,
        carrierCount,
        varianceScore: state.visibleContentVarianceScore,
        classCount: state.visibleContentClassCount,
        method: state.visibleContentProofMethod
      });

      return getVisibleProofPacket();
    } catch (error) {
      state.visibleContentProofError = error && error.message ? error.message : String(error);
      state.visibleContentProof = false;
      state.visibleContentStrictProof = false;
      state.visibleContentSoftGap = state.imageRendered === true;
      state.visibleContentHardFail = state.imageRendered !== true;
      state.visiblePlanetAvailable = state.imageRendered === true;
      state.visibleForwardProgress = state.imageRendered === true;
      state.visibleContentAdmissible = state.imageRendered === true;
      state.f13VisibleEvidenceComplete = state.imageRendered === true;
      state.f13HardFail = state.imageRendered !== true;

      recordError("SOUTH_VISIBLE_PROOF_FAILED", error);

      updateDataset();
      return getVisibleProofPacket();
    }
  }

  function getVisibleProofPacket() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
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
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,
      f13VisibleEvidenceComplete: state.f13VisibleEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvasSouth: false,
      visualPassClaimed: false
    };
  }

  function invalidateTexture(reason = "south-texture-invalidation") {
    state.textureInvalidationCount += 1;
    state.textureInvalidated = true;
    state.textureInvalidationReason = String(reason || "south-texture-invalidation");
    state.textureRebuildRequested = false;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    state.textureComposeComplete = false;
    state.textureComposeProgress = 0;
    state.updatedAt = nowIso();

    recordLocal("SOUTH_TEXTURE_INVALIDATED", {
      reason: state.textureInvalidationReason,
      textureInvalidationCount: state.textureInvalidationCount
    });

    updateDataset();

    return getReceipt();
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: state.cycleOrder,

      canvasSouthActive: true,
      canvasSouthReady: true,
      splitAdapterRole: "SOUTH",
      splitAdapterTransistorMode: true,
      visibleOutputControlActive: true,

      textureCanvasAvailable: Boolean(state.textureCanvas),
      textureWidth: state.textureWidth,
      textureHeight: state.textureHeight,
      textureSourceContract: state.textureSourceContract,
      textureSourceReceipt: state.textureSourceReceipt,
      textureSourceWidth: state.textureSourceWidth,
      textureSourceHeight: state.textureSourceHeight,

      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      textureComposeStartedAt: state.textureComposeStartedAt,
      textureComposeCompletedAt: state.textureComposeCompletedAt,
      textureComposeElapsedMs: state.textureComposeElapsedMs,
      textureComposeYieldCount: state.textureComposeYieldCount,
      textureComposeError: state.textureComposeError,

      textureInvalidated: state.textureInvalidated,
      textureInvalidationReason: state.textureInvalidationReason,
      textureInvalidationCount: state.textureInvalidationCount,
      textureRebuildRequested: state.textureRebuildRequested,
      textureRebuildComplete: state.textureRebuildComplete,
      textureRebuildError: state.textureRebuildError,

      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      renderedAfterTexture: state.renderedAfterTexture,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      renderStarted: state.renderStarted,
      renderProgress: state.renderProgress,
      renderFrameCount: state.renderFrameCount,
      renderStartedAt: state.renderStartedAt,
      renderCompletedAt: state.renderCompletedAt,
      renderElapsedMs: state.renderElapsedMs,
      renderYieldCount: state.renderYieldCount,
      renderError: state.renderError,

      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      renderRadius: state.renderRadius,
      renderCenterX: state.renderCenterX,
      renderCenterY: state.renderCenterY,
      lastYaw: state.lastYaw,
      lastPitch: state.lastPitch,
      lastZoom: state.lastZoom,

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

      clarityRenewalActive: true,
      hazeReduced: true,
      highDpiCanvasActive: true,
      sourceColorDemotedToPaletteInfluence: true,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlineContrastActive: true,
      centerDarknessReduced: true,
      lightingPreservesSurfaceReadability: true,
      staleSourceMaskProtectionActive: true,

      ownsTextureComposition: true,
      ownsSphereRendering: true,
      ownsVisibleProof: true,
      ownsCanvasSouthOutput: true,
      ownsAtlasFormation: false,
      ownsSourceIntake: false,
      ownsDragInspection: false,
      ownsZoomInspection: false,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsRuntimeTableGovernance: false,
      ownsRouteReadiness: false,
      ownsF21: false,

      f13VisibleEvidencePreserved: true,
      f13VisibleEvidenceComplete: state.f13VisibleEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvasSouth: false,
      readyTextClaimedByCanvasSouth: false,

      designRules: [
        "south owns texture composition from east atlas",
        "south owns visible 2D sphere rendering",
        "south owns visible-content proof classification",
        "south does not own source intake",
        "south does not own atlas formation",
        "south does not own drag or zoom control",
        "south does not own planet truth",
        "south does not own material truth",
        "south does not own hydrology truth",
        "south does not own runtime governance",
        "south does not claim F21",
        "south does not claim final visual pass"
      ],

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
    const r = getReceipt();

    const errors = r.errors.length
      ? r.errors.map((item) => `- ${item.at} :: ${item.code} :: ${item.message}`).join("\n")
      : "- none";

    return [
      "HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `cycleOrder=${r.cycleOrder}`,
      "",
      `canvasSouthActive=${r.canvasSouthActive}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `splitAdapterRole=${r.splitAdapterRole}`,
      `splitAdapterTransistorMode=${r.splitAdapterTransistorMode}`,
      `visibleOutputControlActive=${r.visibleOutputControlActive}`,
      "",
      `textureCanvasAvailable=${r.textureCanvasAvailable}`,
      `textureWidth=${r.textureWidth}`,
      `textureHeight=${r.textureHeight}`,
      `textureComposeStarted=${r.textureComposeStarted}`,
      `textureComposeProgress=${r.textureComposeProgress}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `textureInvalidated=${r.textureInvalidated}`,
      `textureInvalidationCount=${r.textureInvalidationCount}`,
      "",
      `firstFrameRequested=${r.firstFrameRequested}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `renderedAfterTexture=${r.renderedAfterTexture}`,
      `planetFramePainted=${r.planetFramePainted}`,
      `nonblankPlanetVisible=${r.nonblankPlanetVisible}`,
      `planetNotObstructed=${r.planetNotObstructed}`,
      `renderFrameCount=${r.renderFrameCount}`,
      "",
      `visibleContentProofStarted=${r.visibleContentProofStarted}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `visibleContentVarianceScore=${r.visibleContentVarianceScore}`,
      `visibleContentClassCount=${r.visibleContentClassCount}`,
      `visibleContentClasses=${r.visibleContentClasses.join(",")}`,
      "",
      `clarityRenewalActive=${r.clarityRenewalActive}`,
      `hazeReduced=${r.hazeReduced}`,
      `highDpiCanvasActive=${r.highDpiCanvasActive}`,
      `coastlineContrastActive=${r.coastlineContrastActive}`,
      `lightingPreservesSurfaceReadability=${r.lightingPreservesSurfaceReadability}`,
      "",
      `ownsTextureComposition=${r.ownsTextureComposition}`,
      `ownsSphereRendering=${r.ownsSphereRendering}`,
      `ownsVisibleProof=${r.ownsVisibleProof}`,
      `ownsAtlasFormation=${r.ownsAtlasFormation}`,
      `ownsDragInspection=${r.ownsDragInspection}`,
      `ownsZoomInspection=${r.ownsZoomInspection}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsF21=${r.ownsF21}`,
      "",
      "ERRORS",
      errors,
      "",
      `f13VisibleEvidenceComplete=${r.f13VisibleEvidenceComplete}`,
      `f13HardFail=${r.f13HardFail}`,
      `f21ClaimedByCanvasSouth=${r.f21ClaimedByCanvasSouth}`,
      `readyTextClaimedByCanvasSouth=${r.readyTextClaimedByCanvasSouth}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,

    composeTexture,
    renderSphere,
    renderSphereSync,
    getTextureCanvas,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    invalidateTexture,
    getReceipt,
    getReceiptText,

    canvasSouthActive: true,
    canvasSouthReady: true,
    splitAdapterRole: "SOUTH",
    splitAdapterTransistorMode: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    ownsTextureComposition: true,
    ownsSphereRendering: true,
    ownsVisibleProof: true,
    ownsCanvasSouthOutput: true,
    ownsAtlasFormation: false,
    ownsSourceIntake: false,
    ownsDragInspection: false,
    ownsZoomInspection: false,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteReadiness: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvasSouth = api;
  root.HEARTH.canvasSouthTextureSphereVisibleProof = api;

  root.HEARTH_CANVAS_SOUTH = api;
  root.HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasSouth = api;
  root.DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof = api;

  updateDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
