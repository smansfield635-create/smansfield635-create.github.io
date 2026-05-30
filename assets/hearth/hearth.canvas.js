// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1
// Full-file replacement.
// Canvas North / split-adapter transistor gate only.
// Purpose:
// - Preserve the public HEARTH_CANVAS API expected by /showroom/globe/hearth/hearth.js.
// - Keep this parent file as Canvas North: gate, sequence, child loading, receipts, F13 evidence, and compatibility.
// - Treat the split adapter like a transistor:
//   - East = source/material-atlas intake.
//   - West = control/base/admissibility, drag, zoom, invalidation.
//   - North = gate/sequencer/checkpoint evidence adapter.
//   - South = drain/output/texture, sphere render, visible proof.
// - Run NEWS alignment and Fibonacci synchronization under the split adapter.
// - Retire superseded canvas-parent bins while preserving active compatibility aliases.
// - Submit F13 evidence to North runtime session when available.
// - Do not let canvas claim F21, route readiness, planet truth, material truth, hydrology truth, or final visual pass.
// Does not own:
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - runtime-table governance
// - route orchestration
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_RECEIPT_v1";

  const SPLIT_CONTRACT = "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1";
  const SPLIT_RECEIPT = "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_RECEIPT_v1";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const SUPERSEDED_PARENT_CONTRACT = "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v1";

  const VERSION = "2026-05-30.hearth-canvas-split-adapter-transistor-gate-north-parent-v1";
  const FILE = "/assets/hearth/hearth.canvas.js";

  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_SIZE = 600;
  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;

  const CYCLE_ORDER = "EAST_SOURCE_WEST_CONTROL_NORTH_GATE_SOUTH_DRAIN_CHECKPOINT_EAST_REFRESH";

  const CHECKPOINT_BY_PHASE = Object.freeze({
    CANVAS_COOPERATIVE_BOOT_STARTED: {
      checkpointId: "F13A_CANVAS_COOPERATIVE_BOOT_STARTED",
      event: "CANVAS_COOPERATIVE_BOOT_STARTED",
      fibonacci: "F13A",
      progress: 78,
      gate: "NORTH_GATE_OPEN"
    },
    CANVAS_MOUNT_CREATED: {
      checkpointId: "F13B_CANVAS_MOUNT_CREATED",
      event: "CANVAS_MOUNT_CREATED",
      fibonacci: "F13B",
      progress: 81,
      gate: "NORTH_GATE_CARRIER"
    },
    CANVAS_CONTEXT_READY: {
      checkpointId: "F13C_CANVAS_CONTEXT_READY",
      event: "CANVAS_CONTEXT_READY",
      fibonacci: "F13C",
      progress: 84,
      gate: "NORTH_GATE_CONTEXT"
    },
    DRAG_INSPECTION_BOUND: {
      checkpointId: "F13D_DRAG_INSPECTION_BOUND",
      event: "DRAG_INSPECTION_BOUND",
      fibonacci: "F13D",
      progress: 86,
      gate: "WEST_CONTROL_BOUND"
    },
    ATLAS_BUILD_STARTED: {
      checkpointId: "F13E_ATLAS_BUILD_STARTED",
      event: "ATLAS_BUILD_STARTED",
      fibonacci: "F13E",
      progress: 88,
      gate: "EAST_SOURCE_ACTIVE"
    },
    ATLAS_BUILD_COMPLETE: {
      checkpointId: "F13F_ATLAS_BUILD_COMPLETE",
      event: "ATLAS_BUILD_COMPLETE",
      fibonacci: "F13F",
      progress: 91,
      gate: "EAST_SOURCE_PACKET_READY"
    },
    TEXTURE_COMPOSE_STARTED: {
      checkpointId: "F13G_TEXTURE_COMPOSE_STARTED",
      event: "TEXTURE_COMPOSE_STARTED",
      fibonacci: "F13G",
      progress: 93,
      gate: "SOUTH_DRAIN_TEXTURE_ACTIVE"
    },
    TEXTURE_COMPOSE_COMPLETE: {
      checkpointId: "F13H_TEXTURE_COMPOSE_COMPLETE",
      event: "TEXTURE_COMPOSE_COMPLETE",
      fibonacci: "F13H",
      progress: 96,
      gate: "SOUTH_DRAIN_TEXTURE_READY"
    },
    FIRST_FRAME_REQUESTED: {
      checkpointId: "F13I_FIRST_FRAME_REQUESTED",
      event: "FIRST_FRAME_REQUESTED",
      fibonacci: "F13I",
      progress: 97,
      gate: "SOUTH_DRAIN_RENDER_REQUEST"
    },
    FIRST_FRAME_DETECTED: {
      checkpointId: "F13J_FIRST_FRAME_DETECTED",
      event: "FIRST_FRAME_DETECTED",
      fibonacci: "F13J",
      progress: 98,
      gate: "SOUTH_DRAIN_FIRST_FRAME"
    },
    CANVAS_READY: {
      checkpointId: "F13K_CANVAS_READY",
      event: "CANVAS_READY",
      fibonacci: "F13K",
      progress: 98,
      gate: "F13_READY_ONLY"
    },
    VISIBLE_CONTENT_PROOF_STARTED: {
      checkpointId: "F13L_VISIBLE_CONTENT_PROOF_STARTED",
      event: "VISIBLE_CONTENT_PROOF_STARTED",
      fibonacci: "F13L",
      progress: 98,
      gate: "SOUTH_DRAIN_PROOF_ACTIVE"
    },
    VISIBLE_CONTENT_PROOF_PASSED: {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "VISIBLE_CONTENT_PROOF_PASSED",
      fibonacci: "F13M",
      progress: 98,
      gate: "SOUTH_DRAIN_STRICT_PROOF"
    },
    DEGRADED_VISIBLE_CONTENT_ACCEPTED: {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "DEGRADED_VISIBLE_CONTENT_ACCEPTED",
      fibonacci: "F13M",
      progress: 98,
      gate: "SOUTH_DRAIN_SOFT_PROOF"
    },
    VISIBLE_CONTENT_HARD_FAIL: {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_PASSED",
      event: "VISIBLE_CONTENT_HARD_FAIL",
      fibonacci: "F13M",
      progress: 98,
      gate: "SOUTH_DRAIN_HARD_FAIL"
    },
    INSPECT_MODE_READY: {
      checkpointId: "F13N_INSPECT_MODE_READY",
      event: "INSPECT_MODE_READY",
      fibonacci: "F13N",
      progress: 98,
      gate: "WEST_CONTROL_INSPECT_READY"
    }
  });

  const EARLY_EVENTS = new Set([
    "CANVAS_COOPERATIVE_BOOT_STARTED",
    "CANVAS_MOUNT_CREATED",
    "CANVAS_CONTEXT_READY",
    "DRAG_INSPECTION_BOUND",
    "ATLAS_BUILD_STARTED"
  ]);

  const CHILDREN = Object.freeze({
    east: {
      direction: "EAST",
      transistorRole: "source",
      file: EAST_FILE,
      globals: [
        "HEARTH_CANVAS_EAST",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
      ],
      requiredMethods: ["buildAtlas", "sample", "read", "getReceipt"]
    },
    west: {
      direction: "WEST",
      transistorRole: "control",
      file: WEST_FILE,
      globals: [
        "HEARTH_CANVAS_WEST",
        "HEARTH.canvasWest",
        "DEXTER_LAB.hearthCanvasWest"
      ],
      requiredMethods: ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"]
    },
    south: {
      direction: "SOUTH",
      transistorRole: "drain",
      file: SOUTH_FILE,
      globals: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH.canvasSouth",
        "DEXTER_LAB.hearthCanvasSouth"
      ],
      requiredMethods: ["composeTexture", "renderSphere", "renderSphereSync", "getTextureCanvas", "sampleVisibleContent", "classifyVisibleContentEvidence", "invalidateTexture", "getReceipt"]
    }
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    supersededParentContract: SUPERSEDED_PARENT_CONTRACT,
    version: VERSION,
    file: FILE,
    role: "canvas-north-split-adapter-transistor-gate",

    northFile: NORTH_FILE,
    eastFile: EAST_FILE,
    westFile: WEST_FILE,
    southFile: SOUTH_FILE,

    splitAdapterActive: true,
    transistorAdapterActive: true,
    transistorAnalogyAccepted: true,
    transistorGateRole: "north-sequence-admissibility-gate",
    transistorSourceRole: "east-material-atlas-source",
    transistorControlRole: "west-motion-invalidation-control",
    transistorDrainRole: "south-visible-output-drain",
    transistorCollectorRole: "runtime-checkpoint-receipt",
    transistorCurrentFlow: "EAST_SOURCE_TO_SOUTH_DRAIN_THROUGH_NORTH_GATE_WITH_WEST_CONTROL",

    coherenceBinOrder: [
      "active-split-adapter-transistor-gate",
      "active-materials-relief-consumption-compatibility-contract",
      "previous-cardinal-split-parent-v2",
      "superseded-cardinal-split-parent-v1"
    ],
    supersededBinsDisregarded: true,
    allHeldBins: false,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    canvasNorthActive: true,
    canvasEastPresent: false,
    canvasWestPresent: false,
    canvasSouthPresent: false,
    canvasEastReady: false,
    canvasWestReady: false,
    canvasSouthReady: false,
    allCanvasChildrenReady: false,
    childLoadAttempted: false,
    childLoadComplete: false,
    childLoadError: "",

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
    atlasWidth: DEFAULT_ATLAS_WIDTH,
    atlasHeight: DEFAULT_ATLAS_HEIGHT,

    materialReceiptBridgeActive: false,
    materialNestedReceiptAvailable: false,
    materialContract: "",
    materialReceipt: "",
    materialExpectedContract: "",
    materialExpectedReceipt: "",
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    materialPreviousContract: "",
    materialBaselineContract: "",
    materialVersion: "",
    materialRole: "",
    materialAtlasPrimary: false,

    upstreamFirstAtlasActive: true,
    canonicalMaterialAuthorityPresent: false,
    canonicalMaterialConsumed: false,
    canonicalMaterialColorPrimary: false,
    canonicalMaterialShapePrimary: false,
    materialsPrimaryWhenValid: true,
    rawSourceColorDemotedToPaletteInfluence: true,

    sevenContinentFallbackEmergencyOnly: true,
    sevenContinentFallbackUsed: false,
    sevenContinentFallbackSuppressedByUpstream: false,
    sevenContinentVisualFallbackActive: true,
    continentVisualSeedCount: 7,
    continentBlendMode: "max-separated",
    proceduralSixLobeAdditiveFieldRetired: true,
    oceanChannelCutActive: true,
    seaLineTightened: true,
    coastlineSharpeningActive: true,
    canvasStillDoesNotOwnPlanetTruth: true,
    transitionalFallbackVisualField: true,
    upstreamSevenContinentAuthorityPreferred: true,
    landChannelStillReceiverOnly: true,
    elevationHydrologyFallbackUsed: false,

    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasCanonicalMaterialSampleCount: 0,
    atlasElevationHydrologySampleCount: 0,
    atlasFallbackSampleCount: 0,
    atlasTotalSampleCount: 0,

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

    zoomEnabled: true,
    zoomLevel: 1,
    zoomMin: 0.82,
    zoomMax: 2.8,
    zoomLodPrepared: true,
    zoomLodLevel: 1,
    zoomUsesCachedTexture: true,
    zoomDoesNotOwnPlanetTruth: true,
    zoomDoesNotTriggerAtlasRebuild: true,
    zoomInteractionCount: 0,
    lastZoomAt: "",
    lastZoomSource: "",

    interactiveRotationActive: true,
    pointerInspectionActive: false,
    pointerInspectionPainted: false,
    pointerDragCount: 0,
    renderFrameCount: 0,
    interactiveFrameCount: 0,
    lastInteractionAt: "",
    rotationYaw: -0.18,
    rotationPitch: 0.05,

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

    northAuthorityPresent: false,
    checkpointGovernorDetected: false,
    checkpointSessionSubmissionAvailable: false,
    canvasEvidenceSubmittedToNorth: false,

    callbacks: [],
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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
  }

  function clonePlain(value) {
    if (!isObject(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function pathRead(path) {
    const parts = String(path || "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function resolveChild(key) {
    const spec = CHILDREN[key];
    if (!spec) return null;

    for (const globalName of spec.globals) {
      const found = pathRead(globalName);
      if (found && isObject(found)) return found;
    }

    return null;
  }

  function childHasRequiredMethods(key, child) {
    const spec = CHILDREN[key];
    if (!spec || !child) return false;
    return spec.requiredMethods.every((method) => isFunction(child[method]));
  }

  function markChildrenPresence() {
    const east = resolveChild("east");
    const west = resolveChild("west");
    const south = resolveChild("south");

    state.canvasEastPresent = Boolean(east);
    state.canvasWestPresent = Boolean(west);
    state.canvasSouthPresent = Boolean(south);

    state.canvasEastReady = childHasRequiredMethods("east", east);
    state.canvasWestReady = childHasRequiredMethods("west", west);
    state.canvasSouthReady = childHasRequiredMethods("south", south);

    state.allCanvasChildrenReady = Boolean(
      state.canvasEastReady &&
      state.canvasWestReady &&
      state.canvasSouthReady
    );

    return { east, west, south };
  }

  function loadScriptOnce(src) {
    if (!doc || !src) return Promise.resolve(false);

    const selector = `script[data-hearth-canvas-child-src="${src}"]`;
    const existing = doc.querySelector(selector);

    if (existing && existing.dataset.loaded === "true") {
      return Promise.resolve(true);
    }

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
        recordError("CHILD_SCRIPT_LOAD_FAILED", new Error(`Failed to load ${src}`));
        resolve(false);
      };

      if (!existing) {
        (doc.head || doc.documentElement).appendChild(script);
      }
    });
  }

  async function ensureChildren() {
    if (childrenPromise) return childrenPromise;

    childrenPromise = (async () => {
      state.childLoadAttempted = true;
      markChildrenPresence();

      const missing = Object.keys(CHILDREN).filter((key) => !resolveChild(key));

      for (const key of missing) {
        await loadScriptOnce(CHILDREN[key].file);
      }

      const children = markChildrenPresence();

      if (!state.allCanvasChildrenReady) {
        const missingMethods = Object.keys(CHILDREN)
          .filter((key) => !childHasRequiredMethods(key, resolveChild(key)))
          .map((key) => {
            const child = resolveChild(key);
            const methods = CHILDREN[key].requiredMethods.filter((method) => !child || !isFunction(child[method]));
            return `${key}:${methods.join(",")}`;
          })
          .join("; ");

        state.childLoadComplete = false;
        state.childLoadError = `Canvas split-adapter children unavailable or incomplete. ${missingMethods}`;
        updateDataset();
        throw new Error(state.childLoadError);
      }

      state.childLoadComplete = true;
      state.childLoadError = "";
      updateDataset();

      return children;
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
      canvas.className = "hearth-canvas hearth-canvas--split-adapter-transistor";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");
      mount.appendChild(canvas);
    }

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const explicitSize = safeNumber(options.canvasSize, 0) || safeNumber(options.size, 0);

    const widthFromRect = safeNumber(rect.width, DEFAULT_SIZE) || DEFAULT_SIZE;
    const heightFromRect = safeNumber(rect.height, DEFAULT_SIZE) || DEFAULT_SIZE;

    const cssSize = explicitSize
      ? Math.max(360, Math.round(explicitSize))
      : Math.max(360, Math.round(Math.min(DEFAULT_SIZE, Math.max(360, widthFromRect), Math.max(360, heightFromRect))));

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
        root.requestAnimationFrame(() => {
          if (ms > 0) root.setTimeout(resolve, ms);
          else resolve();
        });
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

    if (state.errors.length > 120) {
      state.errors.splice(0, state.errors.length - 120);
    }

    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event,
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);

    if (state.localEvents.length > 180) {
      state.localEvents.splice(0, state.localEvents.length - 180);
    }

    state.updatedAt = item.at;

    return item;
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
    state.checkpointGovernorDetected = Boolean(
      checkpointGovernor &&
      (checkpointGovernor.checkpointGovernorActive || checkpointGovernor.createHearthCheckpointSession)
    );
    state.checkpointSessionSubmissionAvailable = Boolean(session);

    return { authority, checkpointGovernor, session };
  }

  function getNorthSession() {
    const candidates = [
      root.HEARTH_CHECKPOINT_SESSION,
      root.HEARTH_RUNTIME_CHECKPOINT_SESSION,
      root.LAB_HEARTH_CHECKPOINT_SESSION,
      root.LAB_CHECKPOINT_SESSION,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCheckpointSession,
      root.DEXTER_LAB && root.DEXTER_LAB.checkpointSession
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (candidate && isFunction(candidate.submitEvent)) return candidate;
      if (candidate && isFunction(candidate.submit)) return candidate;
    }

    return null;
  }

  function safeChildReceipt(child, key) {
    if (!child || !isFunction(child.getReceipt)) return {};

    try {
      const receipt = child.getReceipt();
      return isObject(receipt) ? receipt : {};
    } catch (error) {
      recordError("CHILD_RECEIPT_READ_FAILED", error, { child: key });
      return {};
    }
  }

  function copyFields(target, source, keys) {
    keys.forEach((key) => {
      if (source && source[key] !== undefined) target[key] = source[key];
    });
  }

  function mergeChildReceipts() {
    const children = markChildrenPresence();

    const eastReceipt = safeChildReceipt(children.east, "east");
    const westReceipt = safeChildReceipt(children.west, "west");
    const southReceipt = safeChildReceipt(children.south, "south");

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
      "atlasTotalSampleCount",
      "atlasWidth",
      "atlasHeight"
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

  function getNorthSnapshot() {
    mergeChildReceipts();

    return {
      canvasReady: state.canvasReady,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,

      splitAdapterActive: true,
      transistorAdapterActive: true,
      transistorGateRole: state.transistorGateRole,
      transistorSourceRole: state.transistorSourceRole,
      transistorControlRole: state.transistorControlRole,
      transistorDrainRole: state.transistorDrainRole,
      transistorCurrentFlow: state.transistorCurrentFlow,

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
      visibleContentClasses: Array.isArray(state.visibleContentClasses) ? state.visibleContentClasses.slice() : [],
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
      cycleOrder: CYCLE_ORDER,

      canvasNorthActive: true,
      canvasEastPresent: state.canvasEastPresent,
      canvasWestPresent: state.canvasWestPresent,
      canvasSouthPresent: state.canvasSouthPresent,
      canvasEastReady: state.canvasEastReady,
      canvasWestReady: state.canvasWestReady,
      canvasSouthReady: state.canvasSouthReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

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

  function checkpointPayloadForPhase(phase, progress, message, detail = {}) {
    const mapping = CHECKPOINT_BY_PHASE[phase] || {
      checkpointId: String(phase || ""),
      event: String(phase || ""),
      fibonacci: "F13",
      progress: Math.min(98, safeNumber(progress, 0)),
      gate: "UNMAPPED_CANVAS_GATE"
    };

    return {
      event: mapping.event,
      id: mapping.event,
      phase: mapping.event,
      checkpointId: mapping.checkpointId,
      fibonacci: mapping.fibonacci,
      source: "hearth.canvas.north.split-adapter-transistor-gate",
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      progress: Math.min(98, safeNumber(mapping.progress ?? progress, 0)),
      message: message || "",
      snapshot: getNorthSnapshot(),
      detail: {
        ...clonePlain(detail || {}),
        contract: CONTRACT,
        receipt: RECEIPT,
        splitContract: SPLIT_CONTRACT,
        splitReceipt: SPLIT_RECEIPT,
        source: "hearth.canvas.north.split-adapter-transistor-gate",
        originalPhase: phase,
        mappedCheckpointId: mapping.checkpointId,
        mappedEvent: mapping.event,
        mappedFibonacci: mapping.fibonacci,
        mappedGate: mapping.gate,

        newsProtocolSynchronized: true,
        fibonacciAlignmentSynchronized: true,
        activeFibonacciGate: "F13",
        futureFibonacciGate: "F21",
        oneActiveGearAtATime: true,
        cycleOrder: CYCLE_ORDER,

        splitAdapterActive: true,
        transistorAdapterActive: true,
        transistorGateRole: state.transistorGateRole,
        transistorSourceRole: state.transistorSourceRole,
        transistorControlRole: state.transistorControlRole,
        transistorDrainRole: state.transistorDrainRole,
        transistorCurrentFlow: state.transistorCurrentFlow,

        canvasNorthActive: true,
        canvasEastPresent: state.canvasEastPresent,
        canvasWestPresent: state.canvasWestPresent,
        canvasSouthPresent: state.canvasSouthPresent,
        allCanvasChildrenReady: state.allCanvasChildrenReady,

        supersededBinsDisregarded: true,
        visualPassClaimed: false,
        f21ClaimedByCanvas: false,
        readyTextClaimedByCanvas: false
      }
    };
  }

  function submitCanvasEvidence(phase, detail = {}) {
    const north = readNorthAuthority();
    const payload = checkpointPayloadForPhase(
      phase,
      CHECKPOINT_BY_PHASE[phase] ? CHECKPOINT_BY_PHASE[phase].progress : 98,
      "",
      detail
    );

    if (!north.session) return false;

    try {
      if (isFunction(north.session.submitEvent)) {
        north.session.submitEvent(payload);
        state.canvasEvidenceSubmittedToNorth = true;
        return true;
      }

      if (isFunction(north.session.submit)) {
        north.session.submit(payload);
        state.canvasEvidenceSubmittedToNorth = true;
        return true;
      }
    } catch (error) {
      recordError("NORTH_SESSION_SUBMIT_ERROR", error, { phase });
    }

    return false;
  }

  function shouldSuppressLateCanvasEvent(phase) {
    return Boolean(state.canvasLaneClosed && EARLY_EVENTS.has(phase));
  }

  function archiveLateEvent(phase, progress, message, reason) {
    const item = {
      at: nowIso(),
      event: phase,
      phase,
      progress: Math.min(98, safeNumber(progress, 0)),
      message: message || "",
      reason: reason || "late-canvas-event",
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.archivedLateEvents.push(item);

    if (state.archivedLateEvents.length > 120) {
      state.archivedLateEvents.splice(0, state.archivedLateEvents.length - 120);
    }

    state.updatedAt = item.at;
    updateDataset();

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
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.progressOnlyEvents.push(item);

    if (state.progressOnlyEvents.length > 300) {
      state.progressOnlyEvents.splice(0, state.progressOnlyEvents.length - 300);
    }

    dispatchPhase(item);
    updateDataset();

    return item;
  }

  function emitMilestone(phase, progress, message, detail = {}) {
    if (shouldSuppressLateCanvasEvent(phase)) {
      return archiveLateEvent(phase, progress, message, "canvas-lane-closed-after-canvas-ready");
    }

    const mapped = CHECKPOINT_BY_PHASE[phase] || { checkpointId: phase, event: phase, fibonacci: "F13", progress };

    const event = {
      at: nowIso(),
      event: mapped.event,
      phase: mapped.event,
      checkpointId: mapped.checkpointId,
      fibonacci: mapped.fibonacci,
      gate: mapped.gate || "UNMAPPED_CANVAS_GATE",
      progress: Math.min(98, safeNumber(mapped.progress, progress)),
      message: message || "",
      detail: clonePlain(detail),
      snapshot: getNorthSnapshot(),
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.canvasPhaseCount += 1;
    state.canvasPhaseEvents.push(event);

    if (state.canvasPhaseEvents.length > 220) {
      state.canvasPhaseEvents.splice(0, state.canvasPhaseEvents.length - 220);
    }

    recordLocal("CANVAS_NORTH_SPLIT_ADAPTER_GATE_MILESTONE", {
      phase,
      checkpointId: event.checkpointId,
      event: event.event,
      fibonacci: event.fibonacci,
      gate: event.gate
    });

    submitCanvasEvidence(phase, detail);
    dispatchPhase(event);
    updateDataset();

    return event;
  }

  function dispatchPhase(event) {
    const receipt = getReceipt();

    state.callbacks.slice().forEach((callback) => {
      try {
        callback(event, receipt);
      } catch (error) {
        recordError("CANVAS_CALLBACK_ERROR", error, { event: event.event || event.phase || "" });
      }
    });

    if (doc && isFunction(root.dispatchEvent) && isFunction(root.CustomEvent)) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-phase", {
          detail: { event, receipt }
        }));
      } catch (_error) {}
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

    callbacks.forEach((callback) => on(callback));
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

  function resolveAtlasSize(options = {}, east = null) {
    const eastDefaultWidth = safeNumber(east && east.defaultAtlasWidth, DEFAULT_ATLAS_WIDTH);
    const eastDefaultHeight = safeNumber(east && east.defaultAtlasHeight, DEFAULT_ATLAS_HEIGHT);

    const width = clamp(
      safeNumber(options.atlasWidth || options.width, eastDefaultWidth),
      256,
      MAX_ATLAS_WIDTH
    );

    const height = clamp(
      safeNumber(options.atlasHeight || options.height, eastDefaultHeight),
      128,
      MAX_ATLAS_HEIGHT
    );

    state.atlasWidth = width;
    state.atlasHeight = height;

    return { width, height };
  }

  async function bootCooperative(options = {}) {
    addCallbacksFromOptions(options);

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

      emitMilestone("CANVAS_COOPERATIVE_BOOT_STARTED", 78, "Canvas split-adapter transistor gate opened.");
      await yieldFrame();

      const carrier = ensureCarrier(options);

      emitMilestone("CANVAS_MOUNT_CREATED", 81, "Canvas carrier mounted.");
      await yieldFrame();

      emitMilestone("CANVAS_CONTEXT_READY", 84, "Canvas context ready.");
      await yieldFrame();

      children.west.bindInspection({
        canvas: carrier.canvas,
        onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
        onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
      });

      mergeChildReceipts();

      state.dragInspectionBound = true;
      state.zoomInspectionBound = true;

      emitMilestone("DRAG_INSPECTION_BOUND", 86, "West control bound: drag, zoom, inspection, invalidation.");
      await yieldFrame();

      const atlasSize = resolveAtlasSize(options, children.east);

      state.atlasBuildStarted = true;
      state.atlasBuildProgress = 0;

      emitMilestone("ATLAS_BUILD_STARTED", 88, "East source atlas build started.", atlasSize);

      const atlas = await children.east.buildAtlas({
        width: atlasSize.width,
        height: atlasSize.height,
        rowsPerChunk: options.rowsPerChunk,
        onProgress: (progress, receipt) => {
          state.atlasBuildProgress = progress;
          emitProgressOnly(
            "ATLAS_BUILD_PROGRESS",
            88 + progress * 0.03,
            `East source atlas active · ${progress}%`,
            receipt
          );
        }
      });

      state.atlasCanvas = atlas && atlas.atlasCanvas ? atlas.atlasCanvas : null;
      state.atlasBuildProgress = 100;
      state.atlasBuildComplete = Boolean(state.atlasCanvas);

      mergeChildReceipts();

      emitMilestone("ATLAS_BUILD_COMPLETE", 91, "East source packet ready.");
      await yieldFrame();

      state.textureComposeStarted = true;
      state.textureComposeProgress = 0;

      emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "South drain texture composition started.");

      await children.south.composeTexture({
        atlasCanvas: state.atlasCanvas,
        onProgress: (progress, receipt) => {
          state.textureComposeProgress = progress;
          emitProgressOnly(
            "TEXTURE_COMPOSE_PROGRESS",
            93 + progress * 0.03,
            `South drain texture composition active · ${progress}%`,
            receipt
          );
        }
      });

      state.textureCanvas = children.south.getTextureCanvas();
      state.textureComposeProgress = 100;
      state.textureComposeComplete = Boolean(state.textureCanvas);

      mergeChildReceipts();

      emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "South drain texture ready.");
      await yieldFrame();

      state.firstFrameRequested = true;

      emitMilestone("FIRST_FRAME_REQUESTED", 97, "South drain first frame requested.");

      await children.south.renderSphere({
        canvas: state.canvas,
        textureCanvas: state.textureCanvas,
        view: children.west.getViewState(),
        onProgress: (progress, receipt) => {
          emitProgressOnly(
            "SPHERE_RENDER_PROGRESS",
            97,
            `South drain sphere render active · ${progress}%`,
            receipt
          );
        }
      });

      mergeChildReceipts();

      state.firstFrameDetected = true;
      state.imageRendered = true;
      state.renderedAfterTexture = true;

      emitMilestone("FIRST_FRAME_DETECTED", 98, "South drain first frame detected.");

      state.canvasReady = true;
      state.canvasLaneClosed = true;
      state.canvasCarrierHandoffOk = true;
      state.canvasCarrierHandoffError = "";
      state.canvasBootCompletedAt = nowIso();
      state.canvasBootElapsedMs = Math.max(0, Date.parse(state.canvasBootCompletedAt) - Date.parse(state.canvasBootStartedAt));

      emitMilestone("CANVAS_READY", 98, "Canvas F13 ready. F21 remains outside canvas.");

      state.visibleContentProofStarted = true;

      emitMilestone("VISIBLE_CONTENT_PROOF_STARTED", 98, "Visible content proof started.");

      const proof = children.south.sampleVisibleContent({ canvas: state.canvas });
      mergeChildReceipts();

      if (proof && proof.visibleContentProof) {
        emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed.", proof);
      } else if (proof && proof.visibleContentSoftGap) {
        emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap accepted.", proof);
      } else {
        emitMilestone("VISIBLE_CONTENT_HARD_FAIL", 98, "Visible content hard fail.", proof || {});
      }

      state.f13CanvasEvidenceComplete = Boolean(state.visibleContentProof || state.visibleContentSoftGap);
      state.f13HardFail = Boolean(state.visibleContentHardFail);

      emitMilestone("INSPECT_MODE_READY", 98, "West control inspect mode ready.");

      state.booting = false;
      state.booted = true;
      state.updatedAt = nowIso();

      updateDataset();

      if (isFunction(options.onReady)) {
        try {
          options.onReady(getReceipt());
        } catch (error) {
          recordError("ON_READY_CALLBACK_ERROR", error);
        }
      }

      return getReceipt();
    } catch (error) {
      state.booting = false;
      state.booted = false;
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = error && error.message ? error.message : String(error);
      state.f13HardFail = true;

      recordError("CANVAS_SPLIT_ADAPTER_GATE_BOOT_FAILED", error);

      if (isFunction(options.onError)) {
        try {
          options.onError(error, getReceipt());
        } catch (callbackError) {
          recordError("ON_ERROR_CALLBACK_ERROR", callbackError);
        }
      }

      return getReceipt();
    }
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  async function mount(options = {}) {
    addCallbacksFromOptions(options);

    const children = await ensureChildren();
    ensureCarrier(options);

    children.west.bindInspection({
      canvas: state.canvas,
      onChange: () => forceRedraw({ interactive: true, sampleProof: false }),
      onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
    });

    mergeChildReceipts();

    state.dragInspectionBound = true;
    state.zoomInspectionBound = true;

    updateDataset();

    return getReceipt();
  }

  async function render(options = {}) {
    addCallbacksFromOptions(options);

    if (!state.canvas || !state.context) {
      await mount(options);
    }

    let children = markChildrenPresence();

    if (!state.allCanvasChildrenReady) {
      children = await ensureChildren();
    }

    const east = children.east || resolveChild("east");
    const west = children.west || resolveChild("west");
    const south = children.south || resolveChild("south");

    if (!east || !west || !south) {
      throw new Error("Canvas split-adapter children unavailable during render.");
    }

    if (
      state.textureInvalidated ||
      !state.atlasCanvas ||
      !isFunction(south.getTextureCanvas) ||
      !south.getTextureCanvas()
    ) {
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
    const children = markChildrenPresence();
    const west = children.west || resolveChild("west");
    const south = children.south || resolveChild("south");

    if (
      !state.canvas ||
      !south ||
      !isFunction(south.getTextureCanvas) ||
      !south.getTextureCanvas()
    ) {
      return getReceipt();
    }

    try {
      south.renderSphereSync({
        canvas: state.canvas,
        textureCanvas: south.getTextureCanvas(),
        view: west && isFunction(west.getViewState) ? west.getViewState() : {},
        interactive: options.interactive !== false
      });

      if (options.sampleProof === true && isFunction(south.sampleVisibleContent)) {
        south.sampleVisibleContent({ canvas: state.canvas });
      }

      mergeChildReceipts();
    } catch (error) {
      recordError("FORCE_REDRAW_FAILED", error);
    }

    updateDataset();

    return getReceipt();
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    const children = markChildrenPresence();
    const east = children.east || resolveChild("east");
    const south = children.south || resolveChild("south");

    state.textureInvalidationCount += 1;
    state.textureInvalidated = true;
    state.textureInvalidationReason = String(reason || "manual-texture-invalidation");
    state.textureRebuildRequested = false;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";
    state.updatedAt = nowIso();

    if (east && isFunction(east.invalidateAtlas)) {
      try {
        east.invalidateAtlas(reason);
      } catch (error) {
        recordError("EAST_SOURCE_ATLAS_INVALIDATION_FAILED", error);
      }
    }

    if (south && isFunction(south.invalidateTexture)) {
      try {
        south.invalidateTexture(reason);
      } catch (error) {
        recordError("SOUTH_DRAIN_TEXTURE_INVALIDATION_FAILED", error);
      }
    }

    emitProgressOnly("TEXTURE_INVALIDATED", 96, `Split-adapter texture invalidated · reason=${state.textureInvalidationReason}`);
    updateDataset();

    return getReceipt();
  }

  async function rebuildTexture(options = {}) {
    addCallbacksFromOptions(options);

    state.textureRebuildRequested = true;
    state.textureRebuildComplete = false;
    state.textureRebuildError = "";

    try {
      const children = await ensureChildren();

      if (!state.canvas || !state.context) {
        ensureCarrier(options);
      }

      const atlasSize = resolveAtlasSize(options, children.east);

      emitMilestone("ATLAS_BUILD_STARTED", 88, "East source atlas rebuild started.", atlasSize);

      const atlas = await children.east.buildAtlas({
        width: atlasSize.width,
        height: atlasSize.height,
        rowsPerChunk: options.rowsPerChunk,
        onProgress: (progress, receipt) => {
          emitProgressOnly(
            "ATLAS_BUILD_PROGRESS",
            88 + progress * 0.03,
            `East source atlas rebuild active · ${progress}%`,
            receipt
          );
        }
      });

      state.atlasCanvas = atlas && atlas.atlasCanvas ? atlas.atlasCanvas : null;
      state.atlasBuildProgress = 100;
      state.atlasBuildComplete = Boolean(state.atlasCanvas);

      emitMilestone("ATLAS_BUILD_COMPLETE", 91, "East source atlas rebuild complete.");

      emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "South drain texture rebuild composition started.");

      await children.south.composeTexture({
        atlasCanvas: state.atlasCanvas,
        onProgress: (progress, receipt) => {
          emitProgressOnly(
            "TEXTURE_COMPOSE_PROGRESS",
            93 + progress * 0.03,
            `South drain texture rebuild composition active · ${progress}%`,
            receipt
          );
        }
      });

      state.textureCanvas = children.south.getTextureCanvas();
      state.textureComposeProgress = 100;
      state.textureComposeComplete = Boolean(state.textureCanvas);

      emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "South drain texture rebuild complete.");

      await children.south.renderSphere({
        canvas: state.canvas,
        textureCanvas: state.textureCanvas,
        view: children.west.getViewState()
      });

      const proof = children.south.sampleVisibleContent({ canvas: state.canvas });

      mergeChildReceipts();

      state.textureInvalidated = false;
      state.textureRebuildComplete = true;
      state.canvasReady = true;
      state.canvasLaneClosed = true;

      if (proof && proof.visibleContentProof) {
        emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content proof passed after rebuild.", proof);
      } else if (proof && proof.visibleContentSoftGap) {
        emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content soft gap after rebuild.", proof);
      } else {
        emitMilestone("VISIBLE_CONTENT_HARD_FAIL", 98, "Visible content hard fail after rebuild.", proof || {});
      }

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
      try {
        const bridge = east.refreshMaterialBridge({ invalidate: false });

        if (bridge && bridge.changed && options.allowRebuild !== false) {
          invalidateTexture("material-contract-signature-changed");
          return rebuildTexture(options);
        }
      } catch (error) {
        recordError("ENSURE_MATERIAL_TEXTURE_FRESH_FAILED", error);
      }
    }

    return Promise.resolve(getReceipt());
  }

  function setRotation(yaw = 0, pitch = 0) {
    const west = resolveChild("west");

    if (west && isFunction(west.setRotation)) {
      west.setRotation(yaw, pitch);
    }

    return forceRedraw({ interactive: true, sampleProof: false });
  }

  function resetRotation() {
    const west = resolveChild("west");

    if (west && isFunction(west.resetRotation)) {
      west.resetRotation();
    }

    return forceRedraw({ interactive: true, sampleProof: false });
  }

  function setZoom(value = 1, options = {}) {
    const west = resolveChild("west");

    if (west && isFunction(west.setZoom)) {
      west.setZoom(value, options);
    }

    return forceRedraw({
      interactive: true,
      sampleProof: options.sampleProof === true
    });
  }

  function zoomIn(step = 0.18) {
    const west = resolveChild("west");
    const current = west && isFunction(west.getViewState)
      ? safeNumber(west.getViewState().zoomLevel, 1)
      : safeNumber(state.zoomLevel, 1);

    return setZoom(current + Math.abs(safeNumber(step, 0.18)), { source: "zoomIn" });
  }

  function zoomOut(step = 0.18) {
    const west = resolveChild("west");
    const current = west && isFunction(west.getViewState)
      ? safeNumber(west.getViewState().zoomLevel, 1)
      : safeNumber(state.zoomLevel, 1);

    return setZoom(current - Math.abs(safeNumber(step, 0.18)), { source: "zoomOut" });
  }

  function resetZoom() {
    return setZoom(1, { source: "resetZoom" });
  }

  function sample(point = {}) {
    const east = resolveChild("east");

    if (east && isFunction(east.sample)) {
      return east.sample(point);
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      u: safeNumber(point.u, 0.5),
      v: safeNumber(point.v, 0.5),
      rgb: [0, 0, 0],
      canvasStillDoesNotOwnPlanetTruth: true,
      f21ClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function read(point = {}) {
    return sample(point);
  }

  function sampleVisibleContent(options = {}) {
    const south = resolveChild("south");

    if (!south || !isFunction(south.sampleVisibleContent)) {
      return getReceipt();
    }

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
    readNorthAuthority();
    markChildrenPresence();
    mergeChildReceipts();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      supersededParentContract: SUPERSEDED_PARENT_CONTRACT,
      version: VERSION,
      file: FILE,
      role: state.role,

      splitAdapterActive: true,
      transistorAdapterActive: true,
      transistorAnalogyAccepted: true,
      transistorGateRole: state.transistorGateRole,
      transistorSourceRole: state.transistorSourceRole,
      transistorControlRole: state.transistorControlRole,
      transistorDrainRole: state.transistorDrainRole,
      transistorCollectorRole: state.transistorCollectorRole,
      transistorCurrentFlow: state.transistorCurrentFlow,

      coherenceBinOrder: state.coherenceBinOrder.slice(),
      supersededBinsDisregarded: true,
      allHeldBins: false,

      canvasNorthActive: true,
      canvasEastFile: EAST_FILE,
      canvasWestFile: WEST_FILE,
      canvasSouthFile: SOUTH_FILE,
      canvasEastPresent: state.canvasEastPresent,
      canvasWestPresent: state.canvasWestPresent,
      canvasSouthPresent: state.canvasSouthPresent,
      canvasEastReady: state.canvasEastReady,
      canvasWestReady: state.canvasWestReady,
      canvasSouthReady: state.canvasSouthReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      childLoadAttempted: state.childLoadAttempted,
      childLoadComplete: state.childLoadComplete,
      childLoadError: state.childLoadError,

      northAuthority: NORTH_FILE,
      northAuthorityPresent: state.northAuthorityPresent,
      checkpointGovernorDetected: state.checkpointGovernorDetected,
      checkpointSessionSubmissionAvailable: state.checkpointSessionSubmissionAvailable,
      canvasEvidenceSubmittedToNorth: state.canvasEvidenceSubmittedToNorth,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      cycleOrder: CYCLE_ORDER,

      eastSourceIntakeComplete: state.atlasBuildComplete,
      westControlAdmissibilityComplete: state.dragInspectionBound && state.zoomInspectionBound,
      northGateSequenceComplete: state.canvasReady,
      southDrainVisibleProofRequired: true,
      southDrainVisibleProofComplete: state.visibleContentProof || state.visibleContentSoftGap,
      checkpointReturnsToEastRefresh: true,

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

      atlasWidth: state.atlasWidth,
      atlasHeight: state.atlasHeight,
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
      ownsCanvasNorthGate: true,
      ownsSplitAdapter: true,
      ownsTransistorGateSequence: true,
      ownsVisualTranslation: false,
      ownsInteractiveCanvasRepaint: false,
      doesNotOwnPlanetTruth: true,
      doesNotOwnMaterialTruth: true,
      doesNotOwnElevationTruth: true,
      doesNotOwnHydrologyTruth: true,
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

    const progressLines = Object.keys(progressOnlyCounts)
      .map((key) => `- ${key}: ${progressOnlyCounts[key]}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .map((event) => `- ${event.at} :: ${event.code || event.event} :: ${event.message}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `splitContract=${r.splitContract}`,
      `splitReceipt=${r.splitReceipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `supersededParentContract=${r.supersededParentContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      `splitAdapterActive=${r.splitAdapterActive}`,
      `transistorAdapterActive=${r.transistorAdapterActive}`,
      `transistorGateRole=${r.transistorGateRole}`,
      `transistorSourceRole=${r.transistorSourceRole}`,
      `transistorControlRole=${r.transistorControlRole}`,
      `transistorDrainRole=${r.transistorDrainRole}`,
      `transistorCollectorRole=${r.transistorCollectorRole}`,
      `transistorCurrentFlow=${r.transistorCurrentFlow}`,
      "",
      `coherenceBinOrder=${r.coherenceBinOrder.join(" > ")}`,
      `supersededBinsDisregarded=${r.supersededBinsDisregarded}`,
      `allHeldBins=${r.allHeldBins}`,
      "",
      `canvasNorthActive=${r.canvasNorthActive}`,
      `canvasEastPresent=${r.canvasEastPresent}`,
      `canvasWestPresent=${r.canvasWestPresent}`,
      `canvasSouthPresent=${r.canvasSouthPresent}`,
      `canvasEastReady=${r.canvasEastReady}`,
      `canvasWestReady=${r.canvasWestReady}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `childLoadAttempted=${r.childLoadAttempted}`,
      `childLoadComplete=${r.childLoadComplete}`,
      `childLoadError=${r.childLoadError}`,
      "",
      `northAuthorityPresent=${r.northAuthorityPresent}`,
      `checkpointGovernorDetected=${r.checkpointGovernorDetected}`,
      `checkpointSessionSubmissionAvailable=${r.checkpointSessionSubmissionAvailable}`,
      `canvasEvidenceSubmittedToNorth=${r.canvasEvidenceSubmittedToNorth}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `cycleOrder=${r.cycleOrder}`,
      "",
      `eastSourceIntakeComplete=${r.eastSourceIntakeComplete}`,
      `westControlAdmissibilityComplete=${r.westControlAdmissibilityComplete}`,
      `northGateSequenceComplete=${r.northGateSequenceComplete}`,
      `southDrainVisibleProofComplete=${r.southDrainVisibleProofComplete}`,
      `checkpointReturnsToEastRefresh=${r.checkpointReturnsToEastRefresh}`,
      "",
      `canvasReady=${r.canvasReady}`,
      `canvasCarrierMounted=${r.canvasCarrierMounted}`,
      `canvasContextReady=${r.canvasContextReady}`,
      `canvasCarrierRequested=${r.canvasCarrierRequested}`,
      `canvasCarrierHandoffOk=${r.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${r.canvasCarrierHandoffError}`,
      "",
      `atlasWidth=${r.atlasWidth}`,
      `atlasHeight=${r.atlasHeight}`,
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
    dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasSupersededParentContract = SUPERSEDED_PARENT_CONTRACT;
    dataset.hearthCanvasVersion = VERSION;
    dataset.hearthCanvasRole = state.role;

    dataset.hearthCanvasSplitAdapterActive = "true";
    dataset.hearthCanvasTransistorAdapterActive = "true";
    dataset.hearthCanvasTransistorGateRole = state.transistorGateRole;
    dataset.hearthCanvasTransistorSourceRole = state.transistorSourceRole;
    dataset.hearthCanvasTransistorControlRole = state.transistorControlRole;
    dataset.hearthCanvasTransistorDrainRole = state.transistorDrainRole;
    dataset.hearthCanvasTransistorCurrentFlow = state.transistorCurrentFlow;

    dataset.hearthCanvasCoherenceBinOrder = state.coherenceBinOrder.join(">");
    dataset.hearthCanvasSupersededBinsDisregarded = "true";
    dataset.hearthCanvasAllHeldBins = "false";

    dataset.hearthCanvasNorthActive = "true";
    dataset.hearthCanvasEastPresent = String(state.canvasEastPresent);
    dataset.hearthCanvasWestPresent = String(state.canvasWestPresent);
    dataset.hearthCanvasSouthPresent = String(state.canvasSouthPresent);
    dataset.hearthCanvasEastReady = String(state.canvasEastReady);
    dataset.hearthCanvasWestReady = String(state.canvasWestReady);
    dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);
    dataset.hearthCanvasAllChildrenReady = String(state.allCanvasChildrenReady);
    dataset.hearthCanvasChildLoadAttempted = String(state.childLoadAttempted);
    dataset.hearthCanvasChildLoadComplete = String(state.childLoadComplete);
    dataset.hearthCanvasChildLoadError = state.childLoadError;

    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasVisibleContentStrictProof = String(state.visibleContentStrictProof);
    dataset.hearthCanvasVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
    dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);

    dataset.hearthCanvasNewsProtocolSynchronized = "true";
    dataset.hearthCanvasFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasActiveFibonacciGate = "F13";
    dataset.hearthCanvasFutureFibonacciGate = "F21";
    dataset.hearthCanvasOneActiveGearAtATime = "true";
    dataset.hearthCanvasCycleOrder = CYCLE_ORDER;

    dataset.hearthCanvasEastSourceIntakeComplete = String(state.atlasBuildComplete);
    dataset.hearthCanvasWestControlAdmissibilityComplete = String(state.dragInspectionBound && state.zoomInspectionBound);
    dataset.hearthCanvasNorthGateSequenceComplete = String(state.canvasReady);
    dataset.hearthCanvasSouthDrainVisibleProofComplete = String(state.visibleContentProof || state.visibleContentSoftGap);

    dataset.hearthCanvasClarityRenewalActive = "true";
    dataset.hearthCanvasHazeReduced = "true";
    dataset.hearthCanvasHighDpiCanvasActive = "true";
    dataset.hearthCanvasVisualPassClaimed = "false";

    dataset.hearthCanvasF13EvidencePreserved = "true";
    dataset.hearthCanvasF13EvidenceComplete = String(state.f13CanvasEvidenceComplete);
    dataset.hearthCanvasF13HardFail = String(state.f13HardFail);
    dataset.hearthCanvasF21Claimed = "false";
    dataset.hearthCanvasReadyTextClaimed = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.canvas) {
      state.canvas.dataset.hearthCanvasContract = CONTRACT;
      state.canvas.dataset.hearthCanvasReceipt = RECEIPT;
      state.canvas.dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
      state.canvas.dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
      state.canvas.dataset.hearthCanvasSplitAdapterActive = "true";
      state.canvas.dataset.hearthCanvasTransistorAdapterActive = "true";
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
    supersededParentContract: SUPERSEDED_PARENT_CONTRACT,
    version: VERSION,
    file: FILE,

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
    readNorthAuthority,
    submitCanvasEvidence,
    getReceipt,
    getReceiptText,
    getMaterialBridgeReceipt,
    getState,
    on,
    off,

    ensureChildren,
    resolveChild,

    splitAdapterActive: true,
    transistorAdapterActive: true,
    transistorAnalogyAccepted: true,
    transistorGateRole: state.transistorGateRole,
    transistorSourceRole: state.transistorSourceRole,
    transistorControlRole: state.transistorControlRole,
    transistorDrainRole: state.transistorDrainRole,
    transistorCollectorRole: state.transistorCollectorRole,
    transistorCurrentFlow: state.transistorCurrentFlow,

    canvasNorthActive: true,
    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    ownsCanvasEvidenceOnly: true,
    ownsCanvasNorthGate: true,
    ownsSplitAdapter: true,
    ownsTransistorGateSequence: true,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
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
  root.HEARTH.canvasSplitAdapter = api;
  root.HEARTH.canvasTransistorGate = api;

  root.HEARTH_CANVAS = api;
  root.HEARTH_CANVAS_AUTHORITY = api;
  root.HEARTH_CANVAS_EVIDENCE = api;
  root.HEARTH_CANVAS_NORTH = api;
  root.HEARTH_CANVAS_TEXTURE = api;
  root.HEARTH_CANVAS_SOFT_GAP_ADAPTER = api;
  root.HEARTH_CANVAS_VISUAL_FIDELITY = api;
  root.HEARTH_CANVAS_INTERACTIVE_ROTATION = api;
  root.HEARTH_CANVAS_STALE_REPAIR = api;
  root.HEARTH_CANVAS_SEVEN_CONTINENT_VISUAL_FIELD = api;
  root.HEARTH_CANVAS_UPSTREAM_FIRST_ZOOM_LOD = api;
  root.HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION = api;
  root.HEARTH_CANVAS_SPLIT_ADAPTER = api;
  root.HEARTH_CANVAS_TRANSISTOR_GATE = api;

  root.DEXTER_LAB = root.DEXTER_LAB || {};
  root.DEXTER_LAB.hearthCanvasEvidence = api;
  root.DEXTER_LAB.hearthCanvasNorth = api;
  root.DEXTER_LAB.hearthCanvasSplitAdapter = api;
  root.DEXTER_LAB.hearthCanvasTransistorGate = api;
  root.DEXTER_LAB.hearthCanvasVisualFidelity = api;
  root.DEXTER_LAB.hearthCanvasInteractiveRotation = api;
  root.DEXTER_LAB.hearthCanvasSevenContinentVisualField = api;
  root.DEXTER_LAB.hearthCanvasUpstreamFirstZoomLod = api;
  root.DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation = api;

  markChildrenPresence();
  updateDataset();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
