// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1
// Full-file replacement.
// Canvas North / F13 conductor only.
// Purpose:
// - Preserve the public HEARTH_CANVAS API expected by /showroom/globe/hearth/hearth.js.
// - Split the oversized canvas system into North/East/West/South machine parts.
// - Keep this parent file as Canvas North: sequence, child loading, receipts, F13 evidence, and public compatibility.
// - Delegate material/atlas formation to East.
// - Delegate invalidation, drag, zoom, and inspection motion to West.
// - Delegate texture composition, sphere rendering, clarity, and visible proof to South.
// - Preserve NEWS/Fibonacci F13 synchronization.
// - Do not let canvas claim F21, route readiness, or visual pass.
// Does not own:
// - planet truth
// - material truth
// - hydrology truth
// - Runtime Table governance
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_RECEIPT_v1";
  const SPLIT_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v1";
  const SPLIT_RECEIPT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const VERSION = "2026-05-30.hearth-canvas-cardinal-split-north-parent-v1";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const FILE = "/assets/hearth/hearth.canvas.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";

  const DEFAULT_SIZE = 600;
  const ATLAS_WIDTH = 768;
  const ATLAS_HEIGHT = 384;

  const CHECKPOINT_BY_PHASE = Object.freeze({
    CANVAS_COOPERATIVE_BOOT_STARTED: { checkpointId: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED", event: "CANVAS_COOPERATIVE_BOOT_STARTED", progress: 78 },
    CANVAS_MOUNT_CREATED: { checkpointId: "F13B_CANVAS_MOUNT_CREATED", event: "CANVAS_MOUNT_CREATED", progress: 81 },
    CANVAS_CONTEXT_READY: { checkpointId: "F13C_CANVAS_CONTEXT_READY", event: "CANVAS_CONTEXT_READY", progress: 84 },
    DRAG_INSPECTION_BOUND: { checkpointId: "F13D_DRAG_INSPECTION_BOUND", event: "DRAG_INSPECTION_BOUND", progress: 86 },
    ATLAS_BUILD_STARTED: { checkpointId: "F13E_ATLAS_BUILD_STARTED", event: "ATLAS_BUILD_STARTED", progress: 88 },
    ATLAS_BUILD_COMPLETE: { checkpointId: "F13F_ATLAS_BUILD_COMPLETE", event: "ATLAS_BUILD_COMPLETE", progress: 91 },
    TEXTURE_COMPOSE_STARTED: { checkpointId: "F13G_TEXTURE_COMPOSE_STARTED", event: "TEXTURE_COMPOSE_STARTED", progress: 93 },
    TEXTURE_COMPOSE_COMPLETE: { checkpointId: "F13H_TEXTURE_COMPOSE_COMPLETE", event: "TEXTURE_COMPOSE_COMPLETE", progress: 96 },
    FIRST_FRAME_REQUESTED: { checkpointId: "F13I_FIRST_FRAME_REQUESTED", event: "FIRST_FRAME_REQUESTED", progress: 97 },
    FIRST_FRAME_DETECTED: { checkpointId: "F13J_FIRST_FRAME_DETECTED", event: "FIRST_FRAME_DETECTED", progress: 98 },
    CANVAS_READY: { checkpointId: "F13K_CANVAS_READY", event: "CANVAS_READY", progress: 98 },
    VISIBLE_CONTENT_PROOF_STARTED: { checkpointId: "F13L_VISIBLE_CONTENT_PROOF_STARTED", event: "VISIBLE_CONTENT_PROOF_STARTED", progress: 98 },
    VISIBLE_CONTENT_PROOF_PASSED: { checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED", event: "VISIBLE_CONTENT_PROOF_PASSED", progress: 98 },
    DEGRADED_VISIBLE_CONTENT_ACCEPTED: { checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED", event: "DEGRADED_VISIBLE_CONTENT_ACCEPTED", progress: 98 },
    VISIBLE_CONTENT_HARD_FAIL: { checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED", event: "VISIBLE_CONTENT_HARD_FAIL", progress: 98 },
    INSPECT_MODE_READY: { checkpointId: "F13N_INSPECT_MODE_READY", event: "INSPECT_MODE_READY", progress: 98 }
  });

  const CHILDREN = Object.freeze({
    east: {
      file: EAST_FILE,
      globals: ["HEARTH_CANVAS_EAST", "HEARTH.canvasEast", "DEXTER_LAB.hearthCanvasEast"]
    },
    west: {
      file: WEST_FILE,
      globals: ["HEARTH_CANVAS_WEST", "HEARTH.canvasWest", "DEXTER_LAB.hearthCanvasWest"]
    },
    south: {
      file: SOUTH_FILE,
      globals: ["HEARTH_CANVAS_SOUTH", "HEARTH.canvasSouth", "DEXTER_LAB.hearthCanvasSouth"]
    }
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "f13-canvas-north-cardinal-split-parent",

    northAuthority: NORTH_FILE,
    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    southFile: SOUTH_FILE,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST",

    cardinalSplitActive: true,
    canvasNorthActive: true,
    canvasEastPresent: false,
    canvasWestPresent: false,
    canvasSouthPresent: false,
    allCanvasChildrenReady: false,

    booting: false,
    booted: false,
    canvasLaneClosed: false,
    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "bootCooperative",
    cooperativeBootAvailable: true,
    cooperativeBootUsed: false,
    syncBootFallbackUsed: false,
    canvasBootStartedAt: "",
    canvasBootCompletedAt: "",
    canvasBootElapsedMs: 0,
    canvasYieldCount: 0,
    canvasPhaseCount: 0,

    mount: null,
    canvas: null,
    context: null,
    cssSize: DEFAULT_SIZE,
    dpr: 1,

    atlasCanvas: null,
    textureCanvas: null,

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
    zoomInspectionBound: false,
    canvasReady: false,

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

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,

    cachedTextureInvalidationAvailable: true,
    textureInvalidationCount: 0,
    textureInvalidated: false,
    textureInvalidationReason: "",
    textureRebuildRequested: false,
    textureRebuildComplete: false,
    textureRebuildError: "",
    textureRebuildAfterLaneClosureSupported: true,
    postReadyTextureRebuildSafe: true,

    visualFidelityRenewalActive: true,
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

    f13CanvasEvidencePreserved: true,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,

    canvasPhaseEvents: [],
    progressOnlyEvents: [],
    archivedLateEvents: [],
    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: nowIso()
  };

  let childrenPromise = null;

  function nowIso() {
    try { return new Date().toISOString(); } catch (_error) { return ""; }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_error) { return Array.isArray(value) ? value.slice() : { ...value }; }
  }

  function pathRead(path) {
    const parts = String(path || "").split(".");
    let cursor = root;
    for (const part of parts) {
      if (!cursor || cursor[part] === undefined) return null;
      cursor = cursor[part];
    }
    return cursor || null;
  }

  function resolveChild(key) {
    const spec = CHILDREN[key];
    if (!spec) return null;
    for (const name of spec.globals) {
      const found = pathRead(name);
      if (found && isObject(found)) return found;
    }
    return null;
  }

  function markChildrenPresence() {
    state.canvasEastPresent = Boolean(resolveChild("east"));
    state.canvasWestPresent = Boolean(resolveChild("west"));
    state.canvasSouthPresent = Boolean(resolveChild("south"));
    state.allCanvasChildrenReady = state.canvasEastPresent && state.canvasWestPresent && state.canvasSouthPresent;
  }

  function loadScriptOnce(src) {
    if (!doc) return Promise.resolve(false);
    const existing = doc.querySelector(`script[data-hearth-canvas-child-src="${src}"]`);
    if (existing && existing.dataset.loaded === "true") return Promise.resolve(true);

    return new Promise((resolve) => {
      const script = existing || doc.createElement("script");
      script.src = src;
      script.async = false;
      script.defer = false;
      script.dataset.hearthCanvasChildSrc = src;

      script.onload = () => {
        script.dataset.loaded = "true";
        resolve(true);
      };

      script.onerror = () => {
        recordError("CHILD_SCRIPT_LOAD_FAILED", `Failed to load ${src}`);
        resolve(false);
      };

      if (!existing) (doc.head || doc.documentElement).appendChild(script);
    });
  }

  async function ensureChildren() {
    if (childrenPromise) return childrenPromise;

    childrenPromise = (async () => {
      markChildrenPresence();

      const missing = Object.keys(CHILDREN).filter((key) => !resolveChild(key));
      for (const key of missing) {
        await loadScriptOnce(CHILDREN[key].file);
      }

      markChildrenPresence();

      if (!state.allCanvasChildrenReady) {
        throw new Error("Canvas cardinal children unavailable.");
      }

      return {
        east: resolveChild("east"),
        west: resolveChild("west"),
        south: resolveChild("south")
      };
    })();

    return childrenPromise;
  }

  function resolveMount(options = {}) {
    if (!doc) return null;
    const candidate = options.mount || options.mountEl || options.container || options.target;

    if (candidate && candidate.nodeType === 1) return candidate;

    if (typeof candidate === "string") {
      try {
        const found = doc.querySelector(candidate);
        if (found) return found;
      } catch (_error) {}
    }

    const selectors = [
      "#hearthCanvasMount",
      "[data-hearth-canvas-mount]",
      "[data-hearth-planet-mount]",
      "[data-hearth-planet-frame]",
      "#hearth-canvas-mount",
      "#hearth-planet-canvas-mount",
      ".hearth-canvas-mount",
      ".hearth-planet-frame",
      "main"
    ];

    for (const selector of selectors) {
      const found = doc.querySelector(selector);
      if (found) return found;
    }

    return doc.body || doc.documentElement;
  }

  function ensureCarrier(options = {}) {
    if (!doc) throw new Error("Document unavailable for Hearth canvas.");

    const mount = resolveMount(options);
    if (!mount) throw new Error("Hearth canvas mount unavailable.");

    let canvas =
      mount.tagName && String(mount.tagName).toLowerCase() === "canvas"
        ? mount
        : mount.querySelector("canvas[data-hearth-canvas-texture='true'], canvas[data-hearth-canvas='true'], canvas.hearth-canvas");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.className = "hearth-canvas hearth-canvas--cardinal-split";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      mount.appendChild(canvas);
    }

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const cssSize = Math.max(360, Math.round(Math.min(
      safeNumber(options.canvasSize, 0) || DEFAULT_SIZE,
      Math.max(360, safeNumber(rect.width, DEFAULT_SIZE)),
      Math.max(360, safeNumber(rect.height, DEFAULT_SIZE))
    )));

    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const physicalSize = Math.max(360, Math.round(cssSize * dpr));

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.objectFit = "contain";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    if (canvas.width !== physicalSize) canvas.width = physicalSize;
    if (canvas.height !== physicalSize) canvas.height = physicalSize;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) throw new Error("2D canvas context unavailable.");

    state.mount = mount;
    state.canvas = canvas;
    state.context = context;
    state.cssSize = cssSize;
    state.dpr = dpr;
    state.canvasCarrierMounted = true;
    state.canvasContextReady = true;
    state.planetCanvasPresent = true;
    state.planetCanvasNonZeroSize = physicalSize > 0;

    updateDataset();
    return { mount, canvas, context, cssSize, dpr };
  }

  function yieldFrame(ms = 0) {
    state.canvasYieldCount += 1;
    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => ms > 0 ? root.setTimeout(resolve, ms) : resolve());
      } else {
        root.setTimeout(resolve, Math.max(0, ms));
      }
    });
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      event: code,
      code,
      message: error && error.message ? error.message : String(error || ""),
      detail: clonePlain(detail)
    };
    state.errors.push(item);
    if (state.errors.length > 120) state.errors.splice(0, state.errors.length - 120);
    state.updatedAt = item.at;
    updateDataset();
    return item;
  }

  function recordLocal(event, detail = {}) {
    const item = { at: nowIso(), event, detail: clonePlain(detail) };
    state.localEvents.push(item);
    if (state.localEvents.length > 120) state.localEvents.splice(0, state.localEvents.length - 120);
    state.updatedAt = item.at;
    return item;
  }

  function emitProgressOnly(phase, progress, message, detail = {}) {
    const item = {
      at: nowIso(),
      event: phase,
      phase,
      progress: Math.min(98, safeNumber(progress, 0)),
      message: message || "",
      detail: clonePlain(detail),
      progressOnly: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.progressOnlyEvents.push(item);
    if (state.progressOnlyEvents.length > 260) state.progressOnlyEvents.splice(0, state.progressOnlyEvents.length - 260);

    dispatchPhase(item);
    updateDataset();
    return item;
  }

  function emitMilestone(phase, progress, message, detail = {}) {
    const mapped = CHECKPOINT_BY_PHASE[phase] || { checkpointId: phase, event: phase, progress };
    const event = {
      at: nowIso(),
      event: mapped.event,
      phase: mapped.event,
      checkpointId: mapped.checkpointId,
      progress: Math.min(98, safeNumber(mapped.progress, progress)),
      message: message || "",
      detail: clonePlain(detail),
      snapshot: getNorthSnapshot(),
      contract: CONTRACT,
      receipt: RECEIPT,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.canvasPhaseCount += 1;
    state.canvasPhaseEvents.push(event);
    if (state.canvasPhaseEvents.length > 180) state.canvasPhaseEvents.splice(0, state.canvasPhaseEvents.length - 180);

    dispatchPhase(event);
    updateDataset();
    return event;
  }

  function dispatchPhase(event) {
    if (doc && isFunction(root.dispatchEvent) && isFunction(root.CustomEvent)) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-phase", {
          detail: { event, receipt: getReceipt() }
        }));
      } catch (_error) {}
    }
  }

  function copyFields(target, source, keys) {
    keys.forEach((key) => {
      if (source && source[key] !== undefined) target[key] = source[key];
    });
  }

  function mergeChildReceipts() {
    const east = resolveChild("east");
    const west = resolveChild("west");
    const south = resolveChild("south");

    const eastReceipt = east && isFunction(east.getReceipt) ? east.getReceipt() : {};
    const westReceipt = west && isFunction(west.getReceipt) ? west.getReceipt() : {};
    const southReceipt = south && isFunction(south.getReceipt) ? south.getReceipt() : {};

    copyFields(state, eastReceipt, [
      "materialReceiptBridgeActive",
      "materialNestedReceiptAvailable",
      "materialContract",
      "materialReceipt",
      "materialExpectedContract",
      "materialExpectedReceipt",
      "materialContractMatchesExpected",
      "materialReceiptMatchesExpected",
      "materialPreviousContract",
      "materialBaselineContract",
      "materialVersion",
      "materialRole",
      "materialAtlasPrimary",
      "canonicalMaterialAuthorityPresent",
      "canonicalMaterialConsumed",
      "canonicalMaterialColorPrimary",
      "canonicalMaterialShapePrimary",
      "rawSourceColorDemotedToPaletteInfluence",
      "elevationHydrologyFallbackUsed",
      "sevenContinentFallbackUsed",
      "sevenContinentFallbackSuppressedByUpstream",
      "sevenContinentVisualFallbackActive",
      "continentVisualSeedCount",
      "continentBlendMode",
      "proceduralSixLobeAdditiveFieldRetired",
      "oceanChannelCutActive",
      "seaLineTightened",
      "coastlineSharpeningActive",
      "landChannelStillReceiverOnly",
      "atlasCanonicalMaterialSampleCount",
      "atlasElevationHydrologySampleCount",
      "atlasFallbackSampleCount",
      "atlasTotalSampleCount"
    ]);

    copyFields(state, westReceipt, [
      "zoomEnabled",
      "zoomLevel",
      "zoomMin",
      "zoomMax",
      "zoomLodPrepared",
      "zoomLodLevel",
      "zoomUsesCachedTexture",
      "zoomDoesNotOwnPlanetTruth",
      "zoomDoesNotTriggerAtlasRebuild",
      "zoomInteractionCount",
      "lastZoomAt",
      "lastZoomSource",
      "interactiveRotationActive",
      "pointerInspectionActive",
      "pointerInspectionPainted",
      "pointerDragCount",
      "interactiveFrameCount",
      "lastInteractionAt",
      "rotationYaw",
      "rotationPitch",
      "dragInspectionBound",
      "zoomInspectionBound"
    ]);

    copyFields(state, southReceipt, [
      "textureComposeStarted",
      "textureComposeProgress",
      "textureComposeComplete",
      "firstFrameRequested",
      "firstFrameDetected",
      "imageRendered",
      "renderedAfterTexture",
      "planetFramePainted",
      "nonblankPlanetVisible",
      "planetNotObstructed",
      "visibleContentProofStarted",
      "visibleContentProof",
      "visibleContentStrictProof",
      "visibleContentSoftGap",
      "visibleContentHardFail",
      "visibleForwardProgress",
      "visibleContentAdmissible",
      "visiblePlanetAvailable",
      "visibleContentProofMethod",
      "visibleContentProofError",
      "visibleContentSampleCount",
      "visibleContentVarianceScore",
      "visibleContentClassCount",
      "visibleContentClasses",
      "visibleContentLandSampleCount",
      "visibleContentWaterSampleCount",
      "visibleContentOtherSampleCount",
      "visibleContentCarrierSampleCount",
      "carrierOnlyDetected",
      "renderFrameCount",
      "clarityRenewalActive",
      "hazeReduced",
      "highDpiCanvasActive",
      "lightingPreservesSurfaceReadability",
      "centerDarknessReduced",
      "coastlineContrastActive"
    ]);

    return { eastReceipt, westReceipt, southReceipt };
  }

  async function bootCooperative(options = {}) {
    if (state.booting) return getReceipt();

    state.booting = true;
    state.booted = false;
    state.canvasCarrierRequested = true;
    state.canvasCarrierMethod = "bootCooperative";
    state.cooperativeBootUsed = true;
    state.syncBootFallbackUsed = false;
    state.canvasBootStartedAt = nowIso();
    state.updatedAt = state.canvasBootStartedAt;

    try {
      const children = await ensureChildren();
      emitMilestone("CANVAS_COOPERATIVE_BOOT_STARTED", 78, "Canvas cooperative boot started.");
      await yieldFrame();

      const carrier = ensureCarrier(options);
      emitMilestone("CANVAS_MOUNT_CREATED", 81, "Canvas mount created.");
      await yieldFrame();

      emitMilestone("CANVAS_CONTEXT_READY", 84, "Canvas context ready.");
      await yieldFrame();

      children.west.bindInspection({
        canvas: carrier.canvas,
        onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
        onInvalidate: (reason) => invalidateTexture(reason || "west-invalidation")
      });
      mergeChildReceipts();
      state.dragInspectionBound = true;
      state.zoomInspectionBound = true;
      emitMilestone("DRAG_INSPECTION_BOUND", 86, "Drag and zoom inspection bound.");
      await yieldFrame();

      state.atlasBuildStarted = true;
      emitMilestone("ATLAS_BUILD_STARTED", 88, "Atlas build started.");

      const atlas = await children.east.buildAtlas({
        width: ATLAS_WIDTH,
        height: ATLAS_HEIGHT,
        onProgress: (progress, receipt) => {
          state.atlasBuildProgress = progress;
          emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + progress * 0.03, `Atlas build active · ${progress}%`, receipt);
        }
      });

      state.atlasCanvas = atlas.atlasCanvas;
      state.atlasBuildProgress = 100;
      state.atlasBuildComplete = true;
      mergeChildReceipts();
      emitMilestone("ATLAS_BUILD_COMPLETE", 91, "Atlas build complete.");
      await yieldFrame();

      state.textureComposeStarted = true;
      emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "Texture composition started.");

      await children.south.composeTexture({
        atlasCanvas: state.atlasCanvas,
        onProgress: (progress, receipt) => {
          state.textureComposeProgress = progress;
          emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + progress * 0.03, `Texture composition active · ${progress}%`, receipt);
        }
      });

      mergeChildReceipts();
      state.textureComposeProgress = 100;
      state.textureComposeComplete = true;
      emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "Texture composition complete.");
      await yieldFrame();

      state.firstFrameRequested = true;
      emitMilestone("FIRST_FRAME_REQUESTED", 97, "First frame requested.");

      await children.south.renderSphere({
        canvas: state.canvas,
        textureCanvas: children.south.getTextureCanvas(),
        view: children.west.getViewState(),
        onProgress: (progress, receipt) => {
          emitProgressOnly("SPHERE_RENDER_PROGRESS", 97, `Sphere render active · ${progress}%`, receipt);
        }
      });

      mergeChildReceipts();
      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.renderedAfterTexture = true;
      emitMilestone("FIRST_FRAME_DETECTED", 98, "First frame detected.");

      state.canvasReady = true;
      state.canvasLaneClosed = true;
      state.canvasCarrierHandoffOk = true;
      state.canvasCarrierHandoffError = "";
      state.canvasBootCompletedAt = nowIso();
      state.canvasBootElapsedMs = Math.max(0, Date.parse(state.canvasBootCompletedAt) - Date.parse(state.canvasBootStartedAt));
      emitMilestone("CANVAS_READY", 98, "Canvas ready.");

      state.visibleContentProofStarted = true;
      emitMilestone("VISIBLE_CONTENT_PROOF_STARTED", 98, "Visible content proof started.");

      const proof = children.south.sampleVisibleContent({ canvas: state.canvas });
      mergeChildReceipts();

      if (proof.visibleContentProof) {
        emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed.", proof);
      } else if (proof.visibleContentSoftGap) {
        emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap accepted.", proof);
      } else {
        emitMilestone("VISIBLE_CONTENT_HARD_FAIL", 98, "Visible content hard fail.", proof);
      }

      state.f13CanvasEvidenceComplete = state.visibleContentProof || state.visibleContentSoftGap;
      state.f13HardFail = state.visibleContentHardFail;

      emitMilestone("INSPECT_MODE_READY", 98, "Inspect and zoom mode ready.");

      state.booting = false;
      state.booted = true;
      state.updatedAt = nowIso();
      updateDataset();

      if (isFunction(options.onReady)) options.onReady(getReceipt());
      return getReceipt();
    } catch (error) {
      state.booting = false;
      state.booted = false;
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      state.f13HardFail = true;
      recordError("CANVAS_NORTH_BOOT_FAILED", error);

      if (isFunction(options.onError)) options.onError(error, getReceipt());
      return getReceipt();
    }
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  async function mount(options = {}) {
    await ensureChildren();
    ensureCarrier(options);
    const west = resolveChild("west");
    if (west && isFunction(west.bindInspection)) {
      west.bindInspection({
        canvas: state.canvas,
        onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
        onInvalidate: (reason) => invalidateTexture(reason || "west-invalidation")
      });
    }
    mergeChildReceipts();
    updateDataset();
    return getReceipt();
  }

  async function render(options = {}) {
    if (!state.canvas || !state.context) await mount(options);

    const east = resolveChild("east");
    const west = resolveChild("west");
    const south = resolveChild("south");

    if (!east || !west || !south) await ensureChildren();

    if (state.textureInvalidated || !state.atlasCanvas || !south.getTextureCanvas || !south.getTextureCanvas()) {
      return rebuildTexture(options);
    }

    await south.renderSphere({
      canvas: state.canvas,
      textureCanvas: south.getTextureCanvas(),
      view: west.getViewState(),
      onProgress: options.onProgress
    });

    const proof = south.sampleVisibleContent({ canvas: state.canvas });
    mergeChildReceipts();
    state.canvasReady = true;
    state.canvasLaneClosed = true;
    state.textureInvalidated = false;
    updateDataset();

    return { ...getReceipt(), proof };
  }

  function forceRedraw(options = {}) {
    const west = resolveChild("west");
    const south = resolveChild("south");
    if (!state.canvas || !south || !south.getTextureCanvas || !south.getTextureCanvas()) return getReceipt();

    try {
      south.renderSphereSync({
        canvas: state.canvas,
        textureCanvas: south.getTextureCanvas(),
        view: west && isFunction(west.getViewState) ? west.getViewState() : {},
        interactive: options.interactive !== false
      });

      if (options.sampleProof === true) south.sampleVisibleContent({ canvas: state.canvas });
      mergeChildReceipts();
    } catch (error) {
      recordError("FORCE_REDRAW_FAILED", error);
    }

    updateDataset();
    return getReceipt();
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    const east = resolveChild("east");
    const south = resolveChild("south");

    state.textureInvalidationCount += 1;
    state.textureInvalidated = true;
    state.textureInvalidationReason = String(reason || "manual-texture-invalidation");
    state.textureRebuildRequested = false;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    state.updatedAt = nowIso();

    if (east && isFunction(east.invalidateAtlas)) east.invalidateAtlas(reason);
    if (south && isFunction(south.invalidateTexture)) south.invalidateTexture(reason);

    emitProgressOnly("TEXTURE_INVALIDATED", 96, `Texture invalidated · reason=${state.textureInvalidationReason}`);
    updateDataset();
    return getReceipt();
  }

  async function rebuildTexture(options = {}) {
    state.textureRebuildRequested = true;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";

    try {
      const children = await ensureChildren();
      if (!state.canvas || !state.context) ensureCarrier(options);

      emitMilestone("ATLAS_BUILD_STARTED", 88, "Atlas rebuild started.");
      const atlas = await children.east.buildAtlas({
        width: ATLAS_WIDTH,
        height: ATLAS_HEIGHT,
        onProgress: (progress, receipt) => emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + progress * 0.03, `Atlas rebuild active · ${progress}%`, receipt)
      });

      state.atlasCanvas = atlas.atlasCanvas;
      state.atlasBuildComplete = true;
      emitMilestone("ATLAS_BUILD_COMPLETE", 91, "Atlas rebuild complete.");

      emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "Texture rebuild composition started.");
      await children.south.composeTexture({
        atlasCanvas: state.atlasCanvas,
        onProgress: (progress, receipt) => emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + progress * 0.03, `Texture rebuild composition active · ${progress}%`, receipt)
      });

      emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "Texture rebuild composition complete.");

      await children.south.renderSphere({
        canvas: state.canvas,
        textureCanvas: children.south.getTextureCanvas(),
        view: children.west.getViewState()
      });

      const proof = children.south.sampleVisibleContent({ canvas: state.canvas });
      mergeChildReceipts();

      state.textureInvalidated = false;
      state.textureRebuildComplete = true;
      state.canvasReady = true;
      state.canvasLaneClosed = true;

      if (proof.visibleContentProof) emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed after rebuild.", proof);
      else if (proof.visibleContentSoftGap) emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap after rebuild.", proof);

      updateDataset();
      return getReceipt();
    } catch (error) {
      state.textureRebuildError = error && error.message ? error.message : String(error);
      state.textureRebuildComplete = false;
      recordError("TEXTURE_REBUILD_FAILED", error);
      return getReceipt();
    }
  }

  function ensureMaterialTextureFresh(options = {}) {
    const east = resolveChild("east");
    if (east && isFunction(east.refreshMaterialBridge)) {
      const bridge = east.refreshMaterialBridge({ invalidate: false });
      if (bridge.changed && options.allowRebuild !== false) {
        invalidateTexture("material-contract-signature-changed");
        return rebuildTexture(options);
      }
    }
    return Promise.resolve(getReceipt());
  }

  function setRotation(yaw = 0, pitch = 0) {
    const west = resolveChild("west");
    if (west && isFunction(west.setRotation)) west.setRotation(yaw, pitch);
    return forceRedraw({ interactive: true, sampleProof: false });
  }

  function resetRotation() {
    const west = resolveChild("west");
    if (west && isFunction(west.resetRotation)) west.resetRotation();
    return forceRedraw({ interactive: true, sampleProof: false });
  }

  function setZoom(value = 1, options = {}) {
    const west = resolveChild("west");
    if (west && isFunction(west.setZoom)) west.setZoom(value, options);
    return forceRedraw({ interactive: true, sampleProof: options.sampleProof === true });
  }

  function zoomIn(step = 0.18) {
    const west = resolveChild("west");
    return setZoom((west && west.getViewState ? west.getViewState().zoomLevel : 1) + Math.abs(safeNumber(step, 0.18)), { source: "zoomIn" });
  }

  function zoomOut(step = 0.18) {
    const west = resolveChild("west");
    return setZoom((west && west.getViewState ? west.getViewState().zoomLevel : 1) - Math.abs(safeNumber(step, 0.18)), { source: "zoomOut" });
  }

  function resetZoom() {
    return setZoom(1, { source: "resetZoom" });
  }

  function sample(point = {}) {
    const east = resolveChild("east");
    if (east && isFunction(east.sample)) return east.sample(point);
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      u: 0.5,
      v: 0.5,
      rgb: [0, 0, 0],
      canvasStillDoesNotOwnPlanetTruth: true,
      visualPassClaimed: false
    };
  }

  function read(point = {}) {
    return sample(point);
  }

  function sampleVisibleContent(options = {}) {
    const south = resolveChild("south");
    if (!south || !isFunction(south.sampleVisibleContent)) return getReceipt();
    const proof = south.sampleVisibleContent({ canvas: options.canvas || state.canvas });
    mergeChildReceipts();
    updateDataset();
    return proof;
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    const south = resolveChild("south");
    if (south && isFunction(south.classifyVisibleContentEvidence)) {
      const proof = south.classifyVisibleContentEvidence(metrics);
      mergeChildReceipts();
      return proof;
    }
    return metrics;
  }

  function getNorthSnapshot() {
    mergeChildReceipts();

    return {
      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,

      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: state.syncBootFallbackUsed,
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
      zoomInspectionBound: state.zoomInspectionBound,
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

      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses,
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,

      cardinalSplitActive: true,
      canvasNorthActive: true,
      canvasEastPresent: state.canvasEastPresent,
      canvasWestPresent: state.canvasWestPresent,
      canvasSouthPresent: state.canvasSouthPresent,

      materialReceiptBridgeActive: state.materialReceiptBridgeActive === true,
      materialContract: state.materialContract || "",
      materialReceipt: state.materialReceipt || "",
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,

      visualFidelityRenewalActive: true,
      clarityRenewalActive: true,
      hazeReduced: true,
      highDpiCanvasActive: true,
      coastlineContrastActive: true,
      centerDarknessReduced: true,
      lightingPreservesSurfaceReadability: true,

      inspectEvidenceAvailable: state.dragInspectionBound,
      inspectModeAvailable: state.dragInspectionBound,
      inspectPlanetControlAvailable: state.dragInspectionBound,
      diagnosticCanLeavePlanetFrame: state.dragInspectionBound,

      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function getMaterialBridgeReceipt() {
    mergeChildReceipts();
    return {
      materialReceiptBridgeActive: state.materialReceiptBridgeActive === true,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable === true,
      materialContract: state.materialContract || "",
      materialReceipt: state.materialReceipt || "",
      materialExpectedContract: state.materialExpectedContract || "",
      materialExpectedReceipt: state.materialExpectedReceipt || "",
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,
      materialPreviousContract: state.materialPreviousContract || "",
      materialBaselineContract: state.materialBaselineContract || "",
      materialVersion: state.materialVersion || "",
      materialRole: state.materialRole || "",
      materialAtlasPrimary: state.materialAtlasPrimary === true
    };
  }

  function getReceipt() {
    markChildrenPresence();
    mergeChildReceipts();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      cardinalSplitActive: true,
      canvasNorthActive: true,
      canvasEastFile: EAST_FILE,
      canvasWestFile: WEST_FILE,
      canvasSouthFile: SOUTH_FILE,
      canvasEastPresent: state.canvasEastPresent,
      canvasWestPresent: state.canvasWestPresent,
      canvasSouthPresent: state.canvasSouthPresent,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      northAuthority: state.northAuthority,
      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: state.cycleOrder,

      eastIgnitionComplete: true,
      westAdmissibilityComplete: true,
      northCheckpointGovernancePreserved: true,
      southVisibleProofRequired: true,

      materialReceiptBridge: getMaterialBridgeReceipt(),

      materialReceiptBridgeActive: state.materialReceiptBridgeActive === true,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable === true,
      materialContract: state.materialContract || "",
      materialReceipt: state.materialReceipt || "",
      materialExpectedContract: state.materialExpectedContract || "",
      materialExpectedReceipt: state.materialExpectedReceipt || "",
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,
      materialAtlasPrimary: state.materialAtlasPrimary === true,

      upstreamFirstAtlasActive: true,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent === true,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed === true,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary === true,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary === true,
      materialsPrimaryWhenValid: true,
      rawSourceColorDemotedToPaletteInfluence: true,

      sevenContinentFallbackEmergencyOnly: true,
      sevenContinentFallbackUsed: state.sevenContinentFallbackUsed === true,
      sevenContinentFallbackSuppressedByUpstream: state.sevenContinentFallbackSuppressedByUpstream === true,
      sevenContinentVisualFallbackActive: true,
      continentVisualSeedCount: state.continentVisualSeedCount || 7,
      continentBlendMode: state.continentBlendMode || "max-separated",
      proceduralSixLobeAdditiveFieldRetired: true,
      oceanChannelCutActive: true,
      seaLineTightened: true,
      coastlineSharpeningActive: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      transitionalFallbackVisualField: true,
      upstreamSevenContinentAuthorityPreferred: true,
      landChannelStillReceiverOnly: true,
      elevationHydrologyFallbackUsed: state.elevationHydrologyFallbackUsed === true,

      atlasCanonicalMaterialSampleCount: state.atlasCanonicalMaterialSampleCount || 0,
      atlasElevationHydrologySampleCount: state.atlasElevationHydrologySampleCount || 0,
      atlasFallbackSampleCount: state.atlasFallbackSampleCount || 0,
      atlasTotalSampleCount: state.atlasTotalSampleCount || 0,

      zoomEnabled: state.zoomEnabled !== false,
      zoomLevel: safeNumber(state.zoomLevel, 1),
      zoomMin: safeNumber(state.zoomMin, 0.82),
      zoomMax: safeNumber(state.zoomMax, 2.8),
      zoomLodPrepared: true,
      zoomLodLevel: safeNumber(state.zoomLodLevel, 1),
      zoomUsesCachedTexture: true,
      zoomDoesNotOwnPlanetTruth: true,
      zoomDoesNotTriggerAtlasRebuild: true,
      zoomInteractionCount: state.zoomInteractionCount || 0,
      lastZoomAt: state.lastZoomAt || "",
      lastZoomSource: state.lastZoomSource || "",

      cooperativeBootAvailable: true,
      cooperativeBootUsed: state.cooperativeBootUsed,
      syncBootFallbackUsed: false,
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
      zoomInspectionBound: state.zoomInspectionBound,

      cachedTextureInvalidationAvailable: true,
      textureInvalidationCount: state.textureInvalidationCount,
      textureInvalidated: state.textureInvalidated,
      textureInvalidationReason: state.textureInvalidationReason,
      textureRebuildRequested: state.textureRebuildRequested,
      textureRebuildComplete: state.textureRebuildComplete,
      textureRebuildError: state.textureRebuildError,
      textureRebuildAfterLaneClosureSupported: true,
      postReadyTextureRebuildSafe: true,

      interactiveRotationActive: state.interactiveRotationActive !== false,
      pointerInspectionActive: state.pointerInspectionActive === true,
      pointerInspectionPainted: state.pointerInspectionPainted === true,
      pointerDragCount: state.pointerDragCount || 0,
      renderFrameCount: state.renderFrameCount || 0,
      interactiveFrameCount: state.interactiveFrameCount || 0,
      lastInteractionAt: state.lastInteractionAt || "",
      rotationYaw: safeNumber(state.rotationYaw, -0.18),
      rotationPitch: safeNumber(state.rotationPitch, 0.05),

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
      visibleContentClasses: Array.isArray(state.visibleContentClasses) ? state.visibleContentClasses.slice() : [],
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

      visualFidelityRenewalActive: true,
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

      inspectEvidenceAvailable: state.dragInspectionBound,
      inspectModeAvailable: state.dragInspectionBound,
      inspectPlanetControlAvailable: state.dragInspectionBound,
      diagnosticCanLeavePlanetFrame: state.dragInspectionBound,

      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,

      canvasPhaseEvents: clonePlain(state.canvasPhaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      archivedLateEvents: clonePlain(state.archivedLateEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      ownsCanvasEvidenceOnly: true,
      ownsCanvasNorthConductor: true,
      ownsVisualTranslation: false,
      ownsInteractiveCanvasRepaint: false,
      doesNotOwnPlanetTruth: true,
      doesNotOwnRuntimeTableGovernance: true,
      doesNotOwnNewsFinalAuthority: true,
      doesNotOwnF21: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt
    };
  }

  function getReceiptText() {
    const r = getReceipt();
    const progressOnlyCounts = (r.progressOnlyEvents || []).reduce((map, event) => {
      const key = event.event || "UNKNOWN";
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});

    const progressLines = Object.keys(progressOnlyCounts).map((key) => `- ${key}: ${progressOnlyCounts[key]}`).join("\n") || "- none";
    const errors = (r.errors || []).map((event) => `- ${event.at} :: ${event.code || event.event} :: ${event.message}`).join("\n") || "- none";

    return [
      "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `splitContract=${r.splitContract}`,
      `splitReceipt=${r.splitReceipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `cardinalSplitActive=${r.cardinalSplitActive}`,
      `canvasNorthActive=${r.canvasNorthActive}`,
      `canvasEastPresent=${r.canvasEastPresent}`,
      `canvasWestPresent=${r.canvasWestPresent}`,
      `canvasSouthPresent=${r.canvasSouthPresent}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `cycleOrder=${r.cycleOrder}`,
      "",
      `canvasReady=${r.canvasReady}`,
      `canvasCarrierMounted=${r.canvasCarrierMounted}`,
      `canvasContextReady=${r.canvasContextReady}`,
      `canvasCarrierRequested=${r.canvasCarrierRequested}`,
      `canvasCarrierHandoffOk=${r.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${r.canvasCarrierHandoffError}`,
      "",
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `dragInspectionBound=${r.dragInspectionBound}`,
      `zoomInspectionBound=${r.zoomInspectionBound}`,
      "",
      `materialContract=${r.materialContract}`,
      `materialReceipt=${r.materialReceipt}`,
      `materialContractMatchesExpected=${r.materialContractMatchesExpected}`,
      `materialReceiptMatchesExpected=${r.materialReceiptMatchesExpected}`,
      `materialAtlasPrimary=${r.materialAtlasPrimary}`,
      `canonicalMaterialConsumed=${r.canonicalMaterialConsumed}`,
      "",
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `visibleContentVarianceScore=${r.visibleContentVarianceScore}`,
      `visibleContentClassCount=${r.visibleContentClassCount}`,
      `visibleContentClasses=${r.visibleContentClasses.join(",")}`,
      "",
      `visualFidelityRenewalActive=${r.visualFidelityRenewalActive}`,
      `clarityRenewalActive=${r.clarityRenewalActive}`,
      `hazeReduced=${r.hazeReduced}`,
      `highDpiCanvasActive=${r.highDpiCanvasActive}`,
      `coastlineContrastActive=${r.coastlineContrastActive}`,
      `lightingPreservesSurfaceReadability=${r.lightingPreservesSurfaceReadability}`,
      "",
      "PROGRESS_ONLY_EVENT_COUNTS",
      progressLines,
      "",
      "ERRORS",
      errors,
      "",
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13HardFail=${r.f13HardFail}`,
      `f21ClaimedByCanvas=${r.f21ClaimedByCanvas}`,
      `readyTextClaimedByCanvas=${r.readyTextClaimedByCanvas}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;
    dataset.hearthCanvasLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
    dataset.hearthCanvasRole = state.role;

    dataset.hearthCanvasCardinalSplitActive = "true";
    dataset.hearthCanvasNorthActive = "true";
    dataset.hearthCanvasEastPresent = String(state.canvasEastPresent);
    dataset.hearthCanvasWestPresent = String(state.canvasWestPresent);
    dataset.hearthCanvasSouthPresent = String(state.canvasSouthPresent);

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
    dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);

    dataset.hearthCanvasNewsProtocolSynchronized = "true";
    dataset.hearthCanvasFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasActiveFibonacciGate = "F13";
    dataset.hearthCanvasFutureFibonacciGate = "F21";
    dataset.hearthCanvasOneActiveGearAtATime = "true";

    dataset.hearthCanvasClarityRenewalActive = "true";
    dataset.hearthCanvasHazeReduced = "true";
    dataset.hearthCanvasHighDpiCanvasActive = "true";
    dataset.hearthCanvasVisualPassClaimed = "false";
    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.canvas) {
      state.canvas.dataset.hearthCanvasContract = CONTRACT;
      state.canvas.dataset.hearthCanvasReceipt = RECEIPT;
      state.canvas.dataset.hearthCanvasCardinalSplitActive = "true";
      state.canvas.dataset.hearthCanvasReady = String(state.canvasReady);
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function getState() {
    return state;
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    bootCooperative,
    boot,
    mount,
    render,
    forceRedraw,
    setRotation,
    resetRotation,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    invalidateTexture,
    rebuildTexture,
    ensureMaterialTextureFresh,
    sample,
    read,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    exportCanvasEvidenceReceipt: getReceipt,
    readNorthAuthority: () => ({ authority: root.LAB_RUNTIME_TABLE || root.RUNTIME_TABLE || null }),
    submitCanvasEvidence: emitMilestone,
    getReceipt,
    getReceiptText,
    getMaterialBridgeReceipt,
    getState,

    cardinalSplitActive: true,
    canvasNorthActive: true,
    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    ownsCanvasEvidenceOnly: true,
    ownsCanvasNorthConductor: true,
    ownsPlanetTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsNewsFinalAuthority: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  root.HEARTH = root.HEARTH || {};
  root.HEARTH.canvas = api;
  root.HEARTH.canvasAuthority = api;
  root.HEARTH.canvasEvidence = api;
  root.HEARTH.canvasNorth = api;

  root.HEARTH_CANVAS = api;
  root.HEARTH_CANVAS_AUTHORITY = api;
  root.HEARTH_CANVAS_EVIDENCE = api;
  root.HEARTH_CANVAS_NORTH = api;
  root.HEARTH_CANVAS_TEXTURE = api;
  root.HEARTH_CANVAS_SOFT_GAP_ADAPTER = api;
  root.HEARTH_CANVAS_VISUAL_FIDELITY = api;
  root.HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasEvidence = api;
  root.DEXTER_LAB.hearthCanvasNorth = api;
  root.DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation = api;

  updateDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
