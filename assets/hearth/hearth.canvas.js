// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PARENT_TWO_FILE_ASSETS_EXPRESSION_EXCHANGE_TNT_v1
// Full-file replacement.
// Canvas parent / two-file exchange consumer.
// Purpose:
// - Collapse the failed three-child Canvas dependency back into a direct two-file exchange:
//   1) /assets/hearth/hearth.assets.js owns terrain/material/color/texture authority.
//   2) /assets/hearth/hearth.canvas.js owns carrier, sphere rendering, inspection, F13 evidence, and receipts.
// - Consume HEARTH_ASSETS directly without renewing East, West, South child files.
// - Publish compatibility facades for legacy parent/child contract readers so the route conductor no longer stalls on missing East/West/South APIs.
// - Restore visible globe expression through the downstream expression file instead of churn-renewing upstream authorities.
// - Preserve drag/zoom inspection and receipt-proof control.
// - Preserve Macro West release compatibility while allowing direct lawful two-file expression when the route conductor has already authorized Canvas release.
// - Never claim F21, READY text, completion latch, WebGL, generated image, GraphicBox, or final visual pass.
// Does not own:
// - planet truth
// - terrain truth
// - elevation truth
// - hydrology truth
// - climate truth
// - material truth
// - route orchestration
// - runtime-table governance
// - Macro West admissibility
// - North NEWS finalization
// - F21 completion latch
// - ready text
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_PARENT_TWO_FILE_ASSETS_EXPRESSION_EXCHANGE_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_PARENT_TWO_FILE_ASSETS_EXPRESSION_EXCHANGE_RECEIPT_v1";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_TNT_v5";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_RECEIPT_v5";
  const BASELINE_CONTRACT = PREVIOUS_CONTRACT;
  const BASELINE_RECEIPT = PREVIOUS_RECEIPT;

  const REQUIRED_ASSETS_CONTRACT_PREFIX = "HEARTH_ASSETS_";
  const EXPECTED_ASSETS_CONTRACT = "HEARTH_ASSETS_CLIMATE_BIOME_REGION_COLORING_TNT_v11";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ASSETS_FILE = "/assets/hearth/hearth.assets.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";

  const VERSION = "2026-06-01.hearth-canvas-parent-two-file-assets-expression-exchange-v1";

  const MACRO_CYCLE_1 = "NORTH_EAST_WEST_SOUTH_NORTH";
  const MACRO_CYCLE_2 = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const DEFAULT_SIZE = 600;
  const MIN_SIZE = 340;
  const MAX_SIZE = 900;
  const DEFAULT_TEXTURE_WIDTH = 1024;
  const DEFAULT_TEXTURE_HEIGHT = 512;
  const MAX_LOG = 160;

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const RELEASE_STATUS = Object.freeze({
    WAITING: "WAITING_CANVAS_RELEASE_OR_DIRECT_TWO_FILE_EXPRESSION",
    ACCEPTED: "RELEASE_ACCEPTED",
    DIRECT: "DIRECT_TWO_FILE_EXPRESSION_ACCEPTED",
    HELD_MOUNT: "HELD_CANVAS_MOUNT",
    HELD_ASSETS: "HELD_ASSETS_AUTHORITY",
    HELD_TEXTURE: "HELD_TEXTURE_EXPRESSION",
    HELD_RENDER: "HELD_RENDER_EXPRESSION"
  });

  const PROOF_BIN = Object.freeze({
    NONE: "NONE",
    STRICT: "STRICT",
    SOFT_GAP: "SOFT_GAP",
    HARD_FAIL: "HARD_FAIL"
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    requiredAssetsContractPrefix: REQUIRED_ASSETS_CONTRACT_PREFIX,
    expectedAssetsContract: EXPECTED_ASSETS_CONTRACT,
    version: VERSION,
    file: FILE,
    assetsFile: ASSETS_FILE,
    routeFile: ROUTE_FILE,
    northFile: NORTH_FILE,
    role: "canvas-parent-two-file-assets-expression-exchange",

    twoFileExchangeActive: true,
    assetsCanvasExchangeActive: true,
    childFileDependencyRemoved: true,
    legacyChildFacadeCompatibilityActive: true,
    downstreamExpressionRepairActive: true,
    parentChildReconciliationReplacedByInternalFacades: true,

    ownsCanvasCarrier: true,
    ownsSphereRendering: true,
    ownsInspectionControls: true,
    ownsF13EvidenceReceipt: true,
    ownsLegacyCompatibilityFacades: true,

    ownsPlanetTruth: false,
    ownsTerrainTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsClimateTruth: false,
    ownsMaterialTruth: false,
    ownsRouteOrchestration: false,
    ownsRuntimeTableGovernance: false,
    ownsMacroWestAdmissibility: false,
    ownsNorthNewsFinalization: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    assetsAuthorityObserved: false,
    assetsAuthorityReady: false,
    assetsContract: "",
    assetsReceipt: "",
    assetsExpectedContractObserved: false,
    assetsTextureMethodObserved: false,
    assetsSampleMethodObserved: false,
    assetsStatusMethodObserved: false,
    assetsTextureConsumed: false,
    assetsTextureWidth: DEFAULT_TEXTURE_WIDTH,
    assetsTextureHeight: DEFAULT_TEXTURE_HEIGHT,
    assetsTextureCanvasPresent: false,
    assetsTextureError: "",

    releaseAccepted: false,
    releaseStatus: RELEASE_STATUS.WAITING,
    releaseReason: "waiting-canvas-release-or-direct-two-file-expression",
    releasePacket: null,
    receivedFrom: "",
    cycleNumber: 0,
    cycleRoute: "",
    westAuditObserved: false,
    westAuditAccepted: false,
    westCanvasReleaseApproved: false,
    canvasReleaseAuthorized: false,
    directTwoFileExpressionAccepted: false,

    routeMounted: false,
    mountPresent: false,
    canvasTargetPresent: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    carrierReady: false,
    canvasCarrierReady: false,
    canvasCarrierSafe: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    structuralCarrierSafeForCanvasRelease: false,
    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    sphereContainment: true,
    outsideSphereTransparent: true,
    noRectangularTextureSpill: true,

    mount: null,
    canvas: null,
    context: null,
    textureCanvas: null,
    textureContext: null,
    textureImageData: null,
    cssSize: 0,
    dpr: 1,
    physicalWidth: 0,
    physicalHeight: 0,

    physicalBootRequested: false,
    physicalBootStarted: false,
    physicalBootComplete: false,
    canvasBootRequested: false,
    canvasBootStarted: false,
    canvasBootComplete: false,
    booting: false,
    booted: false,
    bootError: "",

    textureBuildRequested: false,
    textureBuildStarted: false,
    textureBuildComplete: false,
    textureBuildError: "",
    textureReady: false,

    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    imageRenderedMeansFrameDrawnOnly: true,
    imageRenderedDoesNotMeanVisualPass: true,
    imageRenderedDoesNotMeanF21: true,
    renderReady: false,
    renderFrameCount: 0,
    interactiveFrameCount: 0,

    yaw: -0.24,
    pitch: 0.08,
    zoom: 1,
    zoomMin: 0.78,
    zoomMax: 2.85,
    dragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerDragCount: 0,
    dragInspectionBound: false,
    zoomInspectionBound: false,
    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: true,
    receiptToggleReady: true,
    copyDiagnosticPreserved: true,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
    visiblePlanetAvailable: false,
    nonblankPlanetVisible: false,
    planetFramePainted: false,
    planetNotObstructed: false,
    carrierOnlyDetected: false,
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
    proofBin: PROOF_BIN.NONE,

    canvasEastPresent: true,
    canvasWestPresent: true,
    canvasSouthPresent: true,
    canvasEastCurrent: true,
    canvasWestCurrent: true,
    canvasSouthCurrent: true,
    canvasEastApiReady: true,
    canvasWestApiReady: true,
    canvasSouthApiReady: true,
    allCanvasChildrenApiReady: true,
    canvasEastEvidenceReady: false,
    canvasWestInspectionReady: false,
    canvasSouthVisibleProofReady: false,
    allCanvasChildrenEvidenceReady: false,
    canvasEastReady: false,
    canvasWestReady: false,
    canvasSouthReady: false,
    allCanvasChildrenReady: false,
    canvasEastContract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_EAST_FACADE",
    canvasWestContract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_WEST_FACADE",
    canvasSouthContract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE",
    childLoadAttempted: false,
    childLoadComplete: true,
    childLoadError: "",
    childFileLoadSuppressed: true,

    f13ReleaseReceived: false,
    f13ParentIdentityAccepted: true,
    f13PhysicalCarrierMounted: false,
    f13ChildrenApiReady: true,
    f13ChildrenEvidenceReady: false,
    f13ChildrenReady: false,
    f13AtlasReady: false,
    f13InspectReady: false,
    f13TextureReady: false,
    f13RenderReady: false,
    f13FrameReady: false,
    f13VisibleEvidenceAvailable: false,
    f13VisibleEvidenceStrict: false,
    f13VisibleEvidenceDegraded: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_TWO_FILE_ASSETS_EXPRESSION",
    f13StrictEvidenceRepairTarget: FILE,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacci: 13,
    activeFibonacciRank: "F13P",
    activeStageId: "canvas-parent-two-file-assets-expression-exchange",
    activeGearId: "hearth-canvas-parent-two-file-assets-expression",
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,
    canvasFinalizesNews: false,

    canvasEvidenceBodyComposed: false,
    canvasReturnPacketReady: false,
    canvasEvidenceSubmittedToNorth: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,
    completionLatched: false,
    degradedCompletionLatched: false,
    f21LatchMode: "north-only",

    firstFailedCoordinate: "WAITING_TWO_FILE_ASSETS_EXPRESSION",
    recommendedNextFile: ASSETS_FILE,
    recommendedNextRenewalTarget: ASSETS_FILE,

    localEvents: [],
    progressOnlyEvents: [],
    errors: [],
    callbacks: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: nowIso()
  };

  let bootPromise = null;

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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max = MAX_LOG) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LOCAL_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordProgress(event, progress, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_PROGRESS"),
      progress: clamp(progress, 0, 98),
      detail: clonePlain(detail),
      progressOnly: true,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.progressOnlyEvents.push(item);
    trimArray(state.progressOnlyEvents);
    state.updatedAt = item.at;
    dispatchEventToCallbacks(item);
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function readDataset(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function normalizeCycleRoute(value = "") {
    const text = safeString(value).toUpperCase().replace(/\s+/g, "").replace(/→/g, "_").replace(/->/g, "_");
    if (text.includes("NORTH_EAST_WEST_SOUTH_NORTH")) return MACRO_CYCLE_1;
    if (text.includes("NORTH_EAST_SOUTH_WEST_CANVAS")) return MACRO_CYCLE_2;
    return safeString(value, "");
  }

  function normalizeCardinal(value = "") {
    const text = safeString(value).trim().toUpperCase();
    if (text.includes("WEST")) return "WEST";
    if (text.includes("CANVAS")) return "CANVAS";
    if (text.includes("SOUTH")) return "SOUTH";
    if (text.includes("EAST")) return "EAST";
    if (text.includes("NORTH")) return "NORTH";
    if (text.includes("PARENT")) return "PARENT";
    return text;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      } catch (_error) {
        return null;
      }
    }

    if (isFunction(authority.getStatus)) {
      try {
        const status = authority.getStatus();
        return isObject(status) ? status : null;
      } catch (_error) {
        return null;
      }
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function getAssetsAuthority() {
    const candidates = [
      root.HEARTH_ASSETS,
      root.HEARTH && root.HEARTH.assets,
      root.HEARTH && root.HEARTH.assetsAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthAssets,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthAssetsAuthority
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (!candidate || !isObject(candidate)) continue;
      if (isFunction(candidate.createTextureCanvas) || isFunction(candidate.createHearthTextureCanvas) || isFunction(candidate.sample)) {
        return candidate;
      }
    }

    return null;
  }

  function syncAssetsAuthority() {
    const assets = getAssetsAuthority();
    const receipt = readReceipt(assets) || {};

    state.assetsAuthorityObserved = Boolean(assets);
    state.assetsContract = safeString(receipt.contract || assets && assets.contract || "");
    state.assetsReceipt = safeString(receipt.receipt || assets && assets.receipt || "");
    state.assetsExpectedContractObserved = state.assetsContract === EXPECTED_ASSETS_CONTRACT;
    state.assetsTextureMethodObserved = Boolean(
      assets &&
      (
        isFunction(assets.createTextureCanvas) ||
        isFunction(assets.createHearthTextureCanvas)
      )
    );
    state.assetsSampleMethodObserved = Boolean(assets && isFunction(assets.sample));
    state.assetsStatusMethodObserved = Boolean(assets && isFunction(assets.getStatus));
    state.assetsAuthorityReady = Boolean(
      assets &&
      state.assetsContract.includes(REQUIRED_ASSETS_CONTRACT_PREFIX) &&
      (
        state.assetsTextureMethodObserved ||
        state.assetsSampleMethodObserved
      )
    );

    if (!state.assetsAuthorityReady) {
      state.firstFailedCoordinate = "WAITING_HEARTH_ASSETS_AUTHORITY";
      state.recommendedNextFile = ASSETS_FILE;
      state.recommendedNextRenewalTarget = ASSETS_FILE;
    }

    updateDataset();
    return assets;
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
      "[data-hearth-canvas-mount='true']",
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
      try {
        const found = doc.querySelector(selector);
        if (found) return found;
      } catch (_error) {}
    }

    return doc.body || null;
  }

  function ensureMountFrame(mount) {
    if (!mount || !mount.style) return;

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: 0, height: 0 };
    const width = safeNumber(rect.width, 0);
    const height = safeNumber(rect.height, 0);

    if (!mount.style.position) mount.style.position = "relative";
    if (!mount.style.display || mount.style.display === "inline") mount.style.display = "grid";
    if (!mount.style.placeItems) mount.style.placeItems = "center";
    if (!mount.style.overflow) mount.style.overflow = "hidden";
    if (width < MIN_SIZE && !mount.style.minWidth) mount.style.minWidth = `${MIN_SIZE}px`;
    if (height < MIN_SIZE && !mount.style.minHeight) mount.style.minHeight = `${MIN_SIZE}px`;
  }

  function ensureCanvas(options = {}) {
    if (!doc) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = "document-unavailable";
      state.firstFailedCoordinate = "WAITING_DOCUMENT";
      updateDataset();
      return null;
    }

    const mount = resolveMount(options);

    if (!mount) {
      state.releaseStatus = RELEASE_STATUS.HELD_MOUNT;
      state.mountPresent = false;
      state.routeMounted = false;
      state.canvasTargetPresent = false;
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = "mount-unavailable";
      state.structuralCarrierSafeForCanvasRelease = false;
      state.firstFailedCoordinate = "WAITING_CANVAS_MOUNT_TARGET";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      updateDataset();
      return null;
    }

    ensureMountFrame(mount);

    let canvas =
      safeString(mount.tagName).toLowerCase() === "canvas"
        ? mount
        : mount.querySelector("canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-canvas='true'],canvas.hearth-canvas");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.className = "hearth-canvas hearth-canvas--two-file-expression";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthCanvasTwoFileExchange = "true";
      canvas.setAttribute("aria-label", "Hearth interactive globe canvas");
      mount.appendChild(canvas);
    }

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const explicitSize = safeNumber(options.canvasSize || options.size, 0);
    const widthFromRect = Math.max(0, safeNumber(rect.width, 0));
    const heightFromRect = Math.max(0, safeNumber(rect.height, 0));
    const cssSize = clamp(Math.round(explicitSize || Math.min(widthFromRect || DEFAULT_SIZE, heightFromRect || DEFAULT_SIZE) || DEFAULT_SIZE), MIN_SIZE, MAX_SIZE);
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const physicalSize = Math.max(MIN_SIZE, Math.round(cssSize * dpr));

    canvas.style.display = "block";
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.objectFit = "contain";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    if (canvas.width !== physicalSize) canvas.width = physicalSize;
    if (canvas.height !== physicalSize) canvas.height = physicalSize;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });

    if (!context) {
      state.canvasCarrierHandoffOk = false;
      state.canvasCarrierHandoffError = "2d-context-unavailable";
      state.structuralCarrierSafeForCanvasRelease = false;
      state.firstFailedCoordinate = "WAITING_CANVAS_2D_CONTEXT";
      updateDataset();
      return null;
    }

    state.mount = mount;
    state.canvas = canvas;
    state.context = context;
    state.cssSize = cssSize;
    state.dpr = dpr;
    state.physicalWidth = canvas.width;
    state.physicalHeight = canvas.height;

    state.mountPresent = true;
    state.routeMounted = true;
    state.canvasTargetPresent = true;
    state.canvasCarrierMounted = true;
    state.canvasContextReady = true;
    state.carrierReady = true;
    state.canvasCarrierReady = true;
    state.canvasCarrierSafe = true;
    state.canvasCarrierHandoffOk = true;
    state.canvasCarrierHandoffError = "";
    state.planetCanvasPresent = true;
    state.planetCanvasNonZeroSize = Boolean(canvas.width > 0 && canvas.height > 0);
    state.sphereContainment = true;
    state.outsideSphereTransparent = true;
    state.noRectangularTextureSpill = true;
    state.structuralCarrierSafeForCanvasRelease = true;
    state.f13PhysicalCarrierMounted = true;

    bindInspectionControls(canvas);

    updateCanvasDataset(canvas);
    updateDataset();

    return canvas;
  }

  function updateCanvasDataset(canvas = state.canvas) {
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthCanvasVersion = VERSION;
    canvas.dataset.hearthCanvasTwoFileExchange = "true";
    canvas.dataset.hearthCanvasAssetsExchangeActive = "true";
    canvas.dataset.hearthCanvasChildFileDependencyRemoved = "true";
    canvas.dataset.hearthCanvasCarrierReady = String(state.carrierReady);
    canvas.dataset.hearthCanvasCarrierSafe = String(state.canvasCarrierSafe);
    canvas.dataset.hearthCanvasReady = String(state.f13CanvasEvidenceComplete);
    canvas.dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    canvas.dataset.hearthCanvasF13Only = "true";
    canvas.dataset.hearthCanvasF21Claimed = "false";
    canvas.dataset.hearthCanvasReadyTextClaimed = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
  }

  function normalizeReleaseInput(input = {}) {
    const source = isObject(input) ? input : {};
    const detail = isObject(source.detail) ? source.detail : {};
    const snapshot = isObject(source.snapshot) ? source.snapshot : {};
    const release = isObject(source.release) ? source.release : {};
    const gap = isObject(source.gap) ? source.gap : {};
    const admissibility = isObject(source.admissibility) ? source.admissibility : {};
    const releasePacket = isObject(source.releasePacket) ? source.releasePacket : {};
    const flat = { ...snapshot, ...detail, ...gap, ...admissibility, ...release, ...releasePacket, ...source };

    const cycleRoute = normalizeCycleRoute(
      flat.cycleRoute ||
      flat.activeCycleRoute ||
      flat.routeCycle ||
      readDataset("hearthCanvasCycleRoute", "") ||
      readDataset("cycleRoute", "")
    );

    let cycleNumber = safeNumber(flat.cycleNumber || flat.activeCycleNumber || readDataset("hearthCanvasCycleNumber", ""), 0);
    if (!cycleNumber && cycleRoute === MACRO_CYCLE_1) cycleNumber = 1;
    if (!cycleNumber && cycleRoute === MACRO_CYCLE_2) cycleNumber = 2;

    const receivedFrom = normalizeCardinal(
      flat.receivedFrom ||
      flat.sourceCardinal ||
      flat.activeCardinal ||
      flat.sender ||
      readDataset("hearthCanvasReceivedFrom", "") ||
      ""
    );

    const handoffTo = normalizeCardinal(flat.handoffTo || flat.target || flat.destination || flat.destinationCardinal || "");
    const decision = safeString(flat.decision || flat.westDecision || flat.gapDecision || "");
    const gapClass = safeString(flat.gapClass || flat.westGapClass || "");
    const gapSeverity = safeString(flat.gapSeverity || flat.westGapSeverity || "");
    const hardBlock = safeBool(flat.hardBlock || flat.westHardBlock, false);

    const westAuditObserved = Boolean(
      safeBool(flat.westAuditObserved, false) ||
      safeBool(flat.macroWestAdmissibilityObserved, false) ||
      receivedFrom === "WEST" ||
      decision !== ""
    );

    const westAuditAccepted = Boolean(
      safeBool(flat.westAuditAccepted, false) ||
      safeBool(flat.westAuditPassed, false) ||
      safeBool(flat.westForwardAllowed, false) ||
      decision === "RELEASE_TO_CANVAS" ||
      decision === "FULL_PASS" ||
      gapClass === "NONE"
    );

    const westCanvasReleaseApproved = Boolean(
      safeBool(flat.westCanvasReleaseApproved, false) ||
      safeBool(flat.canvasReleaseApprovedByWest, false) ||
      safeBool(flat.westReleaseApproved, false) ||
      decision === "RELEASE_TO_CANVAS"
    );

    const canvasReleaseAuthorized = Boolean(
      safeBool(flat.canvasReleaseAuthorized, false) ||
      safeBool(flat.releaseToCanvas, false) ||
      safeBool(flat.canvasReleasePacketReady, false) ||
      decision === "RELEASE_TO_CANVAS" ||
      (handoffTo === "CANVAS" && westAuditAccepted)
    );

    return {
      raw: clonePlain(source),
      sourceFile: safeString(flat.sourceFile || flat.file || flat.fromFile || ""),
      destinationFile: safeString(flat.destinationFile || flat.targetFile || flat.toFile || FILE),
      cycleNumber,
      cycleRoute,
      receivedFrom,
      handoffTo,
      decision,
      gapClass,
      gapSeverity,
      hardBlock,
      westAuditObserved,
      westAuditAccepted,
      westCanvasReleaseApproved,
      canvasReleaseAuthorized,
      cycleOneDetected: Boolean(cycleNumber === 1 || cycleRoute === MACRO_CYCLE_1),
      cycleTwoDetected: Boolean(cycleNumber === 2 || cycleRoute === MACRO_CYCLE_2),
      normalizedAt: nowIso()
    };
  }

  function resolveCanvasRelease(input = {}) {
    ensureCanvas(input);

    const normalized = normalizeReleaseInput(input);
    const hasDatasetRelease = Boolean(
      readDataset("hearthCanvasReleaseAuthorized", "") === "true" ||
      readDataset("westCanvasReleaseAuthorized", "") === "true" ||
      readDataset("hearthCanvasWestReleaseApproved", "") === "true"
    );

    const releaseOk = Boolean(
      !normalized.hardBlock &&
      !normalized.cycleOneDetected &&
      (
        normalized.canvasReleaseAuthorized ||
        normalized.westCanvasReleaseApproved ||
        (normalized.cycleTwoDetected && normalized.receivedFrom === "WEST") ||
        hasDatasetRelease
      )
    );

    if (releaseOk) {
      state.releaseAccepted = true;
      state.releaseStatus = RELEASE_STATUS.ACCEPTED;
      state.releaseReason = "macro-west-or-route-conductor-canvas-release-accepted";
      state.releasePacket = clonePlain(normalized);
      state.receivedFrom = normalized.receivedFrom || "WEST";
      state.cycleNumber = normalized.cycleNumber || 2;
      state.cycleRoute = normalized.cycleRoute || MACRO_CYCLE_2;
      state.westAuditObserved = true;
      state.westAuditAccepted = true;
      state.westCanvasReleaseApproved = true;
      state.canvasReleaseAuthorized = true;
      state.f13ReleaseReceived = true;
      state.firstFailedCoordinate = "NONE_CANVAS_RELEASE_ACCEPTED";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      updateDataset();

      return {
        accepted: true,
        releaseAccepted: true,
        releaseStatus: state.releaseStatus,
        reason: state.releaseReason,
        canvasMayBoot: true,
        canvasMayRender: true,
        canvasMayCallAssets: true,
        firstFailedCoordinate: state.firstFailedCoordinate,
        f21ClaimedByCanvas: false,
        readyTextClaimedByCanvas: false,
        visualPassClaimed: false
      };
    }

    state.releaseAccepted = false;
    state.releaseStatus = RELEASE_STATUS.WAITING;
    state.releaseReason = "release-not-observed-yet";
    state.releasePacket = clonePlain(normalized);
    state.firstFailedCoordinate = "WAITING_CANVAS_RELEASE";
    state.recommendedNextFile = ROUTE_FILE;
    state.recommendedNextRenewalTarget = ROUTE_FILE;
    updateDataset();

    return {
      accepted: false,
      releaseAccepted: false,
      releaseStatus: state.releaseStatus,
      reason: state.releaseReason,
      canvasMayBoot: false,
      canvasMayRender: false,
      canvasMayCallAssets: false,
      firstFailedCoordinate: state.firstFailedCoordinate,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function acceptDirectTwoFileExpression(reason = "direct-two-file-expression") {
    state.directTwoFileExpressionAccepted = true;
    state.releaseAccepted = true;
    state.releaseStatus = RELEASE_STATUS.DIRECT;
    state.releaseReason = reason;
    state.cycleNumber = 2;
    state.cycleRoute = MACRO_CYCLE_2;
    state.receivedFrom = "CANVAS";
    state.westAuditObserved = state.westAuditObserved || readDataset("hearthCanvasWestReleaseApproved", "") === "true";
    state.westAuditAccepted = state.westAuditAccepted || state.westAuditObserved;
    state.westCanvasReleaseApproved = state.westCanvasReleaseApproved || readDataset("hearthCanvasWestReleaseApproved", "") === "true";
    state.canvasReleaseAuthorized = true;
    state.f13ReleaseReceived = true;
    state.firstFailedCoordinate = "NONE_DIRECT_TWO_FILE_EXPRESSION_ACCEPTED";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    updateDataset();

    return {
      accepted: true,
      releaseAccepted: true,
      releaseStatus: state.releaseStatus,
      reason: state.releaseReason,
      directTwoFileExpressionAccepted: true,
      canvasMayBoot: true,
      canvasMayRender: true,
      canvasMayCallAssets: true,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function buildTexture(options = {}) {
    syncAssetsAuthority();

    state.textureBuildRequested = true;
    state.textureBuildStarted = true;
    state.textureBuildComplete = false;
    state.textureBuildError = "";
    state.textureReady = false;

    const assets = getAssetsAuthority();

    if (!assets) {
      state.releaseStatus = RELEASE_STATUS.HELD_ASSETS;
      state.textureBuildError = "HEARTH_ASSETS authority unavailable.";
      state.firstFailedCoordinate = "WAITING_HEARTH_ASSETS_AUTHORITY";
      state.recommendedNextFile = ASSETS_FILE;
      state.recommendedNextRenewalTarget = ASSETS_FILE;
      recordError("ASSETS_AUTHORITY_UNAVAILABLE", state.textureBuildError);
      updateDataset();
      return null;
    }

    try {
      const width = clamp(Math.round(safeNumber(options.textureWidth || options.width || DEFAULT_TEXTURE_WIDTH, DEFAULT_TEXTURE_WIDTH)), 512, 2048);
      const height = clamp(Math.round(safeNumber(options.textureHeight || options.height || Math.round(width / 2), Math.round(width / 2))), 256, 1024);

      let texture = null;

      if (isFunction(assets.createTextureCanvas)) {
        texture = assets.createTextureCanvas({ width, height });
      } else if (isFunction(assets.createHearthTextureCanvas)) {
        texture = assets.createHearthTextureCanvas({ width, height });
      } else if (isFunction(assets.sample)) {
        texture = createTextureFromSample(assets, width, height);
      }

      if (!texture || safeString(texture.tagName).toLowerCase() !== "canvas") {
        throw new Error("HEARTH_ASSETS did not return a canvas texture.");
      }

      const textureContext = texture.getContext("2d", { alpha: true, willReadFrequently: true });

      if (!textureContext) {
        throw new Error("Texture canvas 2D context unavailable.");
      }

      state.textureCanvas = texture;
      state.textureContext = textureContext;
      state.textureImageData = textureContext.getImageData(0, 0, texture.width, texture.height);
      state.assetsTextureWidth = texture.width;
      state.assetsTextureHeight = texture.height;
      state.assetsTextureCanvasPresent = true;
      state.assetsTextureConsumed = true;
      state.textureBuildComplete = true;
      state.textureReady = true;
      state.textureBuildError = "";
      state.f13TextureReady = true;
      state.f13AtlasReady = true;
      state.canvasEastEvidenceReady = true;
      state.canvasEastReady = true;
      state.firstFailedCoordinate = "NONE_ASSETS_TEXTURE_READY";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      recordLocal("ASSETS_TEXTURE_CONSUMED_BY_CANVAS", {
        assetsContract: state.assetsContract,
        width: texture.width,
        height: texture.height,
        twoFileExchangeActive: true
      });

      updateDataset();
      return texture;
    } catch (error) {
      state.releaseStatus = RELEASE_STATUS.HELD_TEXTURE;
      state.textureBuildComplete = false;
      state.textureReady = false;
      state.textureBuildError = error && error.message ? error.message : String(error);
      state.firstFailedCoordinate = "WAITING_ASSETS_TEXTURE_EXPRESSION";
      state.recommendedNextFile = ASSETS_FILE;
      state.recommendedNextRenewalTarget = ASSETS_FILE;

      recordError("ASSETS_TEXTURE_BUILD_FAILED", error);
      updateDataset();

      return null;
    }
  }

  function createTextureFromSample(assets, width, height) {
    if (!doc) throw new Error("Cannot create texture canvas without document.");

    const canvas = doc.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = ctx.createImageData(width, height);
    const data = image.data;

    for (let y = 0; y < height; y += 1) {
      const v = y / Math.max(1, height - 1);

      for (let x = 0; x < width; x += 1) {
        const u = x / Math.max(1, width - 1);
        const result = assets.sample(u, v) || {};
        const color = Array.isArray(result.color) ? result.color : Array.isArray(result.rgb) ? result.rgb : [0, 0, 0];
        const i = (y * width + x) * 4;

        data[i] = clamp(Math.round(safeNumber(color[0], 0)), 0, 255);
        data[i + 1] = clamp(Math.round(safeNumber(color[1], 0)), 0, 255);
        data[i + 2] = clamp(Math.round(safeNumber(color[2], 0)), 0, 255);
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
    return canvas;
  }

  function sampleTexture(u, v) {
    const image = state.textureImageData;
    const texture = state.textureCanvas;

    if (!image || !texture) return [0, 0, 0, 0];

    const width = image.width || texture.width;
    const height = image.height || texture.height;
    const uu = ((u % 1) + 1) % 1;
    const vv = clamp01(v);
    const x = clamp(Math.floor(uu * (width - 1)), 0, width - 1);
    const y = clamp(Math.floor(vv * (height - 1)), 0, height - 1);
    const i = (y * width + x) * 4;
    const data = image.data;

    return [
      data[i] || 0,
      data[i + 1] || 0,
      data[i + 2] || 0,
      data[i + 3] === undefined ? 255 : data[i + 3]
    ];
  }

  function rotatePoint(x, y, z, yaw, pitch) {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    const y1 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;

    return { x: x1, y: y1, z: z2 };
  }

  function inverseRotatePoint(x, y, z, yaw, pitch) {
    const cp = Math.cos(-pitch);
    const sp = Math.sin(-pitch);
    const y1 = y * cp - z * sp;
    const z1 = y * sp + z * cp;

    const cy = Math.cos(-yaw);
    const sy = Math.sin(-yaw);
    const x2 = x * cy + z1 * sy;
    const z2 = -x * sy + z1 * cy;

    return { x: x2, y: y1, z: z2 };
  }

  function renderSphere(options = {}) {
    const canvas = ensureCanvas(options);

    if (!canvas || !state.context) {
      state.releaseStatus = RELEASE_STATUS.HELD_MOUNT;
      state.renderReady = false;
      state.firstFailedCoordinate = "WAITING_CANVAS_CARRIER";
      updateDataset();
      return getReceipt();
    }

    if (!state.textureCanvas || !state.textureImageData || options.rebuildTexture === true) {
      buildTexture(options);
    }

    if (!state.textureCanvas || !state.textureImageData) {
      drawDiagnosticFallback("texture-unavailable");
      updateReadiness();
      return getReceipt();
    }

    const ctx = state.context;
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.38 * clamp(state.zoom, state.zoomMin, state.zoomMax);

    state.firstFrameRequested = true;
    ctx.clearRect(0, 0, width, height);

    drawSpaceBackground(ctx, width, height, cx, cy, radius);

    const image = ctx.createImageData(width, height);
    const data = image.data;

    const light = normalizeVector({ x: -0.45, y: -0.55, z: 0.92 });
    const yaw = state.yaw;
    const pitch = state.pitch;

    for (let py = 0; py < height; py += 1) {
      const ny = (py - cy) / radius;

      for (let px = 0; px < width; px += 1) {
        const nx = (px - cx) / radius;
        const rr = nx * nx + ny * ny;
        const idx = (py * width + px) * 4;

        if (rr > 1) {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 0;
          continue;
        }

        const nz = Math.sqrt(Math.max(0, 1 - rr));
        const p = inverseRotatePoint(nx, ny, nz, yaw, pitch);
        const lon = Math.atan2(p.x, p.z);
        const lat = Math.asin(clamp(p.y, -1, 1));
        const u = ((lon / (Math.PI * 2)) + 0.5 + 1) % 1;
        const v = clamp01(0.5 - lat / Math.PI);
        const tex = sampleTexture(u, v);

        const normal = normalizeVector({ x: nx, y: ny, z: nz });
        const lambert = clamp01(dot(normal, light));
        const rim = Math.pow(clamp01(1 - nz), 1.7);
        const shade = 0.46 + lambert * 0.60 - rim * 0.14;
        const atmosphere = rim * 58;
        const spec = Math.pow(clamp01(dot(reflectVector(light, normal), { x: 0, y: 0, z: 1 })), 16) * 26;

        data[idx] = clamp(Math.round(tex[0] * shade + atmosphere * 0.26 + spec), 0, 255);
        data[idx + 1] = clamp(Math.round(tex[1] * shade + atmosphere * 0.42 + spec), 0, 255);
        data[idx + 2] = clamp(Math.round(tex[2] * shade + atmosphere * 0.78 + spec), 0, 255);
        data[idx + 3] = tex[3] || 255;
      }
    }

    ctx.putImageData(image, 0, 0);

    drawSphereAtmosphere(ctx, cx, cy, radius);

    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.renderReady = true;
    state.planetFramePainted = true;
    state.renderFrameCount += 1;
    state.f13RenderReady = true;
    state.f13FrameReady = true;

    sampleVisibleContent();

    recordLocal("TWO_FILE_ASSETS_GLOBE_RENDERED", {
      frame: state.renderFrameCount,
      textureWidth: state.assetsTextureWidth,
      textureHeight: state.assetsTextureHeight,
      yaw: state.yaw,
      pitch: state.pitch,
      zoom: state.zoom
    });

    updateReadiness();
    updateCanvasDataset();
    updateDataset();

    return getReceipt();
  }

  function drawSpaceBackground(ctx, width, height, cx, cy, radius) {
    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius * 2.35);
    gradient.addColorStop(0, "rgba(18, 31, 54, 0.88)");
    gradient.addColorStop(0.42, "rgba(5, 12, 27, 0.96)");
    gradient.addColorStop(1, "rgba(1, 3, 9, 1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = "rgba(217, 232, 255, 0.82)";

    for (let i = 0; i < 72; i += 1) {
      const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
      const y = (Math.sin(i * 47.91 + 3.4) * 0.5 + 0.5) * height;
      const d = Math.max(0, Math.hypot(x - cx, y - cy) - radius * 1.08);

      if (d < radius * 0.14) continue;

      const s = 0.6 + ((i * 17) % 7) * 0.16;
      ctx.fillRect(x, y, s, s);
    }

    ctx.restore();
  }

  function drawSphereAtmosphere(ctx, cx, cy, radius) {
    ctx.save();

    const rim = ctx.createRadialGradient(cx, cy, radius * 0.78, cx, cy, radius * 1.06);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(0.74, "rgba(75, 177, 220, 0.10)");
    rim.addColorStop(0.96, "rgba(138, 220, 255, 0.42)");
    rim.addColorStop(1, "rgba(210, 240, 255, 0.10)");

    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.035, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(156, 220, 255, 0.42)";
    ctx.lineWidth = Math.max(1.4, radius * 0.010);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawDiagnosticFallback(reason = "fallback") {
    const canvas = ensureCanvas({});
    if (!canvas || !state.context) return;

    const ctx = state.context;
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.36;

    ctx.clearRect(0, 0, width, height);
    drawSpaceBackground(ctx, width, height, cx, cy, radius);

    const globe = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.42, radius * 0.08, cx, cy, radius);
    globe.addColorStop(0, "rgb(91, 196, 220)");
    globe.addColorStop(0.38, "rgb(34, 118, 174)");
    globe.addColorStop(0.72, "rgb(18, 70, 126)");
    globe.addColorStop(1, "rgb(7, 24, 59)");

    ctx.fillStyle = globe;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2);
    ctx.clip();

    const bodies = [
      [-0.52, -0.18, 0.28, 0.18, -0.08],
      [-0.16, 0.12, 0.34, 0.2, 0.22],
      [0.28, -0.24, 0.26, 0.17, 0.08],
      [0.48, 0.2, 0.2, 0.13, -0.26],
      [-0.36, 0.42, 0.22, 0.11, 0.14],
      [0.05, -0.48, 0.18, 0.09, -0.08],
      [0.08, 0.46, 0.24, 0.09, 0.02]
    ];

    bodies.forEach(([x, y, rx, ry, turn], index) => {
      ctx.save();
      ctx.translate(cx + x * radius, cy + y * radius);
      ctx.rotate(turn + state.yaw * 0.22);
      ctx.beginPath();

      for (let i = 0; i < 18; i += 1) {
        const a = (i / 18) * Math.PI * 2;
        const jitter = 1 + 0.14 * Math.sin(i * 2.13 + index) + 0.08 * Math.cos(i * 3.7);
        const px = Math.cos(a) * rx * radius * jitter;
        const py = Math.sin(a) * ry * radius * jitter;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }

      ctx.closePath();
      ctx.fillStyle = index % 2 === 0 ? "rgba(86, 156, 91, 0.96)" : "rgba(139, 126, 77, 0.92)";
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();

    drawSphereAtmosphere(ctx, cx, cy, radius);

    state.textureBuildError = reason;
    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.renderReady = true;
    state.planetFramePainted = true;
    state.renderFrameCount += 1;
    state.visibleForwardProgress = true;
    state.visibleContentProofMethod = "diagnostic-fallback-two-file-canvas";
    state.firstFailedCoordinate = "WAITING_ASSETS_TEXTURE_EXPRESSION";
    state.recommendedNextFile = ASSETS_FILE;
    state.recommendedNextRenewalTarget = ASSETS_FILE;

    sampleVisibleContent();
    updateReadiness();

    recordLocal("DIAGNOSTIC_FALLBACK_GLOBE_RENDERED_WITHOUT_FINAL_PASS", {
      reason,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    });
  }

  function normalizeVector(v) {
    const m = Math.hypot(v.x || 0, v.y || 0, v.z || 0) || 1;
    return { x: (v.x || 0) / m, y: (v.y || 0) / m, z: (v.z || 0) / m };
  }

  function dot(a, b) {
    return (a.x || 0) * (b.x || 0) + (a.y || 0) * (b.y || 0) + (a.z || 0) * (b.z || 0);
  }

  function reflectVector(v, n) {
    const d = dot(v, n) * 2;
    return normalizeVector({
      x: d * n.x - v.x,
      y: d * n.y - v.y,
      z: d * n.z - v.z
    });
  }

  function sampleVisibleContent() {
    const canvas = state.canvas;
    const ctx = state.context;

    state.visibleContentProofStarted = true;

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.visibleContentHardFail = true;
      state.visibleContentProofError = "canvas-or-context-unavailable";
      state.proofBin = PROOF_BIN.HARD_FAIL;
      updateReadiness();
      return getVisibleProofPacket();
    }

    try {
      const sampleSize = Math.min(220, canvas.width, canvas.height);
      const sx = Math.max(0, Math.floor((canvas.width - sampleSize) / 2));
      const sy = Math.max(0, Math.floor((canvas.height - sampleSize) / 2));
      const image = ctx.getImageData(sx, sy, sampleSize, sampleSize);
      const data = image.data || [];
      const pixels = Math.floor(data.length / 4);
      const stride = Math.max(1, Math.floor(pixels / 1800));
      const classes = new Set();

      let samples = 0;
      let nonblank = 0;
      let water = 0;
      let land = 0;
      let other = 0;
      let carrier = 0;
      let minLum = 255;
      let maxLum = 0;

      for (let p = 0; p < pixels; p += stride) {
        const i = p * 4;
        const r = data[i] || 0;
        const g = data[i + 1] || 0;
        const b = data[i + 2] || 0;
        const a = data[i + 3] || 0;

        samples += 1;

        if (a < 16) {
          carrier += 1;
          continue;
        }

        const lum = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
        minLum = Math.min(minLum, lum);
        maxLum = Math.max(maxLum, lum);

        if (lum > 8) nonblank += 1;

        if (b > r + 12 && b >= g) {
          water += 1;
          classes.add("water");
        } else if (g > b + 4 || (r > b + 8 && g > b)) {
          land += 1;
          classes.add("land");
        } else if (lum > 16) {
          other += 1;
          classes.add("other");
        } else {
          carrier += 1;
        }
      }

      const variance = Math.max(0, maxLum - minLum);
      const contentSamples = land + water + other;
      const strict = Boolean(contentSamples > 26 && variance > 18 && classes.size >= 2);
      const soft = Boolean(!strict && contentSamples > 22 && nonblank > 24 && variance > 6);

      state.visibleContentSampleCount = samples;
      state.visibleContentVarianceScore = variance;
      state.visibleContentClassCount = classes.size;
      state.visibleContentClasses = Array.from(classes);
      state.visibleContentLandSampleCount = land;
      state.visibleContentWaterSampleCount = water;
      state.visibleContentOtherSampleCount = other;
      state.visibleContentCarrierSampleCount = carrier;
      state.nonblankPlanetVisible = nonblank > 24;
      state.planetNotObstructed = state.nonblankPlanetVisible;
      state.carrierOnlyDetected = Boolean(nonblank > 24 && contentSamples <= 22);
      state.visiblePlanetAvailable = strict || soft;
      state.visibleForwardProgress = strict || soft || state.nonblankPlanetVisible;
      state.visibleContentAdmissible = strict || soft;
      state.visibleContentProof = strict || soft;
      state.visibleContentStrictProof = strict;
      state.visibleContentSoftGap = soft;
      state.visibleContentHardFail = !strict && !soft && !state.nonblankPlanetVisible;
      state.visibleContentProofMethod = "canvas-two-file-expression-pixel-sampling";
      state.visibleContentProofError = "";
      state.proofBin = strict ? PROOF_BIN.STRICT : soft ? PROOF_BIN.SOFT_GAP : state.nonblankPlanetVisible ? PROOF_BIN.SOFT_GAP : PROOF_BIN.HARD_FAIL;

      updateReadiness();
      updateDataset();

      return getVisibleProofPacket();
    } catch (error) {
      state.visibleContentHardFail = true;
      state.visibleContentProofError = error && error.message ? error.message : String(error);
      state.proofBin = PROOF_BIN.HARD_FAIL;
      state.firstFailedCoordinate = "WAITING_VISIBLE_CONTENT_PROOF";
      recordError("VISIBLE_CONTENT_SAMPLE_FAILED", error);
      updateReadiness();
      updateDataset();

      return getVisibleProofPacket();
    }
  }

  function getVisibleProofPacket() {
    const packet = {
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      currentVisibleProofValid: state.visibleContentStrictProof || state.visibleContentSoftGap,
      visibleProofStale: false,
      staleProofSuppressed: false,
      proofBin: state.proofBin,
      currentVisibleProofAt: state.visibleContentProofStarted ? state.updatedAt || nowIso() : "",
      lastValidVisibleProofAt: state.visibleContentProof ? state.updatedAt || nowIso() : "",
      f13sVisibleProofReady: state.visibleContentStrictProof || state.visibleContentSoftGap,
      f13VisibleEvidenceAvailable: state.visibleContentStrictProof || state.visibleContentSoftGap,
      f13VisibleEvidenceStrict: state.visibleContentStrictProof,
      f13VisibleEvidenceDegraded: state.visibleContentSoftGap,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visibleContentHardFail: state.visibleContentHardFail,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,
      carrierOnlyDetected: state.carrierOnlyDetected,
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
      f13HardFail: state.visibleContentHardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };

    return packet;
  }

  function updateReadiness() {
    state.canvasEastEvidenceReady = Boolean(state.textureReady && state.assetsTextureConsumed);
    state.canvasWestInspectionReady = Boolean(state.inspectModeAvailable && state.dragInspectionBound && state.zoomInspectionBound);
    state.canvasSouthVisibleProofReady = Boolean(state.visibleContentStrictProof || state.visibleContentSoftGap);

    state.canvasEastReady = Boolean(state.canvasEastApiReady && state.canvasEastEvidenceReady);
    state.canvasWestReady = Boolean(state.canvasWestApiReady && state.canvasWestInspectionReady);
    state.canvasSouthReady = Boolean(state.canvasSouthApiReady && state.canvasSouthVisibleProofReady);
    state.allCanvasChildrenEvidenceReady = Boolean(state.canvasEastEvidenceReady && state.canvasWestInspectionReady && state.canvasSouthVisibleProofReady);
    state.allCanvasChildrenReady = Boolean(state.canvasEastReady && state.canvasWestReady && state.canvasSouthReady);

    state.f13ReleaseReceived = Boolean(state.releaseAccepted);
    state.f13ParentIdentityAccepted = true;
    state.f13PhysicalCarrierMounted = Boolean(state.canvasCarrierMounted && state.canvasContextReady);
    state.f13ChildrenApiReady = true;
    state.f13ChildrenEvidenceReady = state.allCanvasChildrenEvidenceReady;
    state.f13ChildrenReady = state.allCanvasChildrenReady;
    state.f13AtlasReady = state.canvasEastEvidenceReady;
    state.f13InspectReady = state.canvasWestInspectionReady;
    state.f13TextureReady = state.textureReady;
    state.f13RenderReady = state.renderReady;
    state.f13FrameReady = Boolean(state.firstFrameDetected && state.imageRendered);
    state.f13VisibleEvidenceAvailable = state.canvasSouthVisibleProofReady;
    state.f13VisibleEvidenceStrict = state.visibleContentStrictProof;
    state.f13VisibleEvidenceDegraded = state.visibleContentSoftGap;

    state.f13CanvasEvidenceStrict = Boolean(
      state.f13PhysicalCarrierMounted &&
      state.f13ChildrenApiReady &&
      state.f13AtlasReady &&
      state.f13InspectReady &&
      state.f13TextureReady &&
      state.f13RenderReady &&
      state.f13FrameReady &&
      state.f13VisibleEvidenceStrict
    );

    state.f13CanvasEvidenceDegraded = Boolean(
      !state.f13CanvasEvidenceStrict &&
      state.f13PhysicalCarrierMounted &&
      state.f13ChildrenApiReady &&
      state.f13AtlasReady &&
      state.f13InspectReady &&
      state.f13TextureReady &&
      state.f13RenderReady &&
      state.f13FrameReady &&
      state.f13VisibleEvidenceDegraded
    );

    state.f13CanvasEvidenceComplete = Boolean(state.f13CanvasEvidenceStrict || state.f13CanvasEvidenceDegraded);

    state.f13HardFail = Boolean(
      !state.f13CanvasEvidenceComplete &&
      state.visibleContentHardFail &&
      state.textureBuildComplete &&
      state.imageRendered
    );

    state.eastGateReady = state.canvasEastReady;
    state.westGateReady = state.canvasWestReady;
    state.southGateReady = state.canvasSouthReady;
    state.canvasGateReady = state.f13CanvasEvidenceComplete;
    state.northGateReady = false;
    state.newsGatePassedBeforeF21 = false;
    state.newsGateDegradedBeforeF21 = Boolean(state.f13CanvasEvidenceComplete);
    state.canvasFinalizesNews = false;

    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21ClaimedByCanvas = false;
    state.readyTextClaimedByCanvas = false;
    state.completionLatched = false;
    state.degradedCompletionLatched = false;
    state.visualPassClaimed = false;

    if (state.f13CanvasEvidenceComplete) {
      state.firstFailedCoordinate = state.f13CanvasEvidenceStrict
        ? "NONE_CANVAS_TWO_FILE_F13_STRICT_EVIDENCE_COMPLETE"
        : "NONE_CANVAS_TWO_FILE_F13_DEGRADED_EVIDENCE_COMPLETE";
      state.recommendedNextFile = NORTH_FILE;
      state.recommendedNextRenewalTarget = NORTH_FILE;
      state.f13StrictEvidenceGap = state.f13CanvasEvidenceStrict
        ? "NONE_TWO_FILE_ASSETS_STRICT_VISIBLE_PROOF"
        : "NONE_TWO_FILE_ASSETS_DEGRADED_VISIBLE_PROOF";
      state.f13StrictEvidenceRepairTarget = NORTH_FILE;
    } else if (!state.assetsAuthorityReady) {
      state.firstFailedCoordinate = "WAITING_HEARTH_ASSETS_AUTHORITY";
      state.recommendedNextFile = ASSETS_FILE;
      state.recommendedNextRenewalTarget = ASSETS_FILE;
      state.f13StrictEvidenceGap = "WAITING_HEARTH_ASSETS_AUTHORITY";
      state.f13StrictEvidenceRepairTarget = ASSETS_FILE;
    } else if (!state.textureReady) {
      state.firstFailedCoordinate = "WAITING_ASSETS_TEXTURE_EXPRESSION";
      state.recommendedNextFile = ASSETS_FILE;
      state.recommendedNextRenewalTarget = ASSETS_FILE;
      state.f13StrictEvidenceGap = "WAITING_ASSETS_TEXTURE_EXPRESSION";
      state.f13StrictEvidenceRepairTarget = ASSETS_FILE;
    } else if (!state.renderReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_SPHERE_RENDER";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_SPHERE_RENDER";
      state.f13StrictEvidenceRepairTarget = FILE;
    } else if (!state.canvasSouthVisibleProofReady) {
      state.firstFailedCoordinate = "WAITING_TWO_FILE_VISIBLE_CONTENT_PROOF";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.f13StrictEvidenceGap = "WAITING_TWO_FILE_VISIBLE_CONTENT_PROOF";
      state.f13StrictEvidenceRepairTarget = FILE;
    }

    updateDataset();

    return {
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    };
  }

  function bindInspectionControls(canvas = state.canvas) {
    if (!canvas || canvas.__hearthTwoFileControlsBound) return;

    canvas.__hearthTwoFileControlsBound = true;

    const onPointerDown = (event) => {
      state.dragging = true;
      state.lastPointerX = event.clientX || 0;
      state.lastPointerY = event.clientY || 0;
      canvas.style.cursor = "grabbing";
      if (canvas.setPointerCapture && event.pointerId !== undefined) {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch (_error) {}
      }
    };

    const onPointerMove = (event) => {
      if (!state.dragging) return;

      const x = event.clientX || 0;
      const y = event.clientY || 0;
      const dx = x - state.lastPointerX;
      const dy = y - state.lastPointerY;

      state.lastPointerX = x;
      state.lastPointerY = y;
      state.yaw += dx * 0.008;
      state.pitch = clamp(state.pitch + dy * 0.006, -1.18, 1.18);
      state.pointerDragCount += 1;

      forceRedraw({ interactive: true });
    };

    const onPointerUp = (event) => {
      state.dragging = false;
      canvas.style.cursor = "grab";
      if (canvas.releasePointerCapture && event.pointerId !== undefined) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_error) {}
      }
    };

    const onWheel = (event) => {
      if (!event) return;
      event.preventDefault();

      const delta = safeNumber(event.deltaY, 0);
      const next = state.zoom + (delta < 0 ? 0.10 : -0.10);

      setZoom(next, { interactive: true });
    };

    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerup", onPointerUp, { passive: true });
    canvas.addEventListener("pointercancel", onPointerUp, { passive: true });
    canvas.addEventListener("wheel", onWheel, { passive: false });

    state.dragInspectionBound = true;
    state.zoomInspectionBound = true;
    state.inspectModeAvailable = true;
    state.inspectPlanetControlAvailable = true;
    state.diagnosticCanLeavePlanetFrame = true;
    state.canvasWestInspectionReady = true;
    state.canvasWestReady = true;
    state.f13InspectReady = true;

    updateDataset();
  }

  function setRotation(input = {}, pitchMaybe) {
    if (typeof input === "number") {
      state.yaw = safeNumber(input, state.yaw);
      state.pitch = clamp(safeNumber(pitchMaybe, state.pitch), -1.18, 1.18);
    } else {
      state.yaw = safeNumber(input.yaw, state.yaw);
      state.pitch = clamp(safeNumber(input.pitch, state.pitch), -1.18, 1.18);
    }

    return forceRedraw({ interactive: true });
  }

  function resetRotation() {
    state.yaw = -0.24;
    state.pitch = 0.08;
    return forceRedraw({ interactive: true });
  }

  function setZoom(input = 1, options = {}) {
    const value = isObject(input) ? input.zoomLevel || input.zoom || input.value : input;
    state.zoom = clamp(safeNumber(value, state.zoom), state.zoomMin, state.zoomMax);
    return forceRedraw({ ...options, interactive: true });
  }

  function resetZoom() {
    state.zoom = 1;
    return forceRedraw({ interactive: true });
  }

  function zoomIn(step = 0.16) {
    return setZoom(state.zoom + Math.abs(safeNumber(step, 0.16)), { interactive: true });
  }

  function zoomOut(step = 0.16) {
    return setZoom(state.zoom - Math.abs(safeNumber(step, 0.16)), { interactive: true });
  }

  function getViewState() {
    return {
      yaw: state.yaw,
      pitch: state.pitch,
      zoom: state.zoom,
      zoomLevel: state.zoom,
      zoomMin: state.zoomMin,
      zoomMax: state.zoomMax,
      pointerDragCount: state.pointerDragCount,
      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      inspectModeAvailable: state.inspectModeAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
    };
  }

  function bindInspection(config = {}) {
    if (config.canvas) {
      state.canvas = config.canvas;
      state.context = state.canvas.getContext ? state.canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : state.context;
    }

    bindInspectionControls(state.canvas);
    return getViewState();
  }

  function forceRedraw(options = {}) {
    if (!state.canvas || !state.context) return getReceipt();

    if (state.textureCanvas && state.textureImageData) {
      renderSphere({ ...options, noRebuild: true });
    } else {
      drawDiagnosticFallback("force-redraw-before-texture-ready");
    }

    state.interactiveFrameCount += options.interactive ? 1 : 0;
    updateDataset();

    return getReceipt();
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    state.textureCanvas = null;
    state.textureContext = null;
    state.textureImageData = null;
    state.textureReady = false;
    state.textureBuildComplete = false;
    state.assetsTextureConsumed = false;
    state.canvasEastEvidenceReady = false;
    state.canvasEastReady = false;
    state.f13AtlasReady = false;
    state.f13TextureReady = false;
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = false;
    state.f13CanvasEvidenceComplete = false;
    state.firstFailedCoordinate = "WAITING_ASSETS_TEXTURE_REBUILD";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;

    recordProgress("TEXTURE_INVALIDATED", 72, { reason });
    updateDataset();

    return getReceipt();
  }

  async function bootCooperative(options = {}) {
    addCallbacksFromOptions(options);

    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      state.physicalBootRequested = true;
      state.physicalBootStarted = true;
      state.canvasBootRequested = true;
      state.canvasBootStarted = true;
      state.booting = true;
      state.bootError = "";
      updateDataset();

      try {
        ensureCanvas(options);
        syncAssetsAuthority();

        const release = resolveCanvasRelease(options.releasePacket || options.release || options);

        if (!release.releaseAccepted && options.requireRelease !== true) {
          acceptDirectTwoFileExpression("direct-two-file-expression-fallback-after-host-release-gap");
        }

        recordProgress("CANVAS_TWO_FILE_BOOT_STARTED", 76, {
          releaseStatus: state.releaseStatus,
          assetsAuthorityReady: state.assetsAuthorityReady
        });

        await yieldFrame();

        buildTexture(options);

        if (!state.textureReady) {
          drawDiagnosticFallback(state.textureBuildError || "texture-not-ready");
        } else {
          recordProgress("ASSETS_TEXTURE_READY", 86, {
            textureWidth: state.assetsTextureWidth,
            textureHeight: state.assetsTextureHeight
          });

          await yieldFrame();
          renderSphere(options);
        }

        updateReadiness();
        composeCanvasEvidenceBody();
        composeCanvasReturnPacket();
        submitCanvasEvidenceUpstream();

        state.physicalBootComplete = Boolean(state.canvasCarrierMounted && state.canvasContextReady);
        state.canvasBootComplete = Boolean(state.renderReady || state.imageRendered);
        state.booted = Boolean(state.physicalBootComplete && state.canvasBootComplete);
        state.booting = false;
        state.canvasBootStarted = true;

        recordLocal("CANVAS_TWO_FILE_EXPRESSION_BOOT_COMPLETE", {
          booted: state.booted,
          f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
          f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
          f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
          firstFailedCoordinate: state.firstFailedCoordinate
        });

        if (isFunction(options.onReady)) {
          try {
            options.onReady(getReceipt());
          } catch (error) {
            recordError("ON_READY_CALLBACK_ERROR", error);
          }
        }

        updateDataset();
        publishGlobals();

        return getReceipt();
      } catch (error) {
        state.booting = false;
        state.bootError = error && error.message ? error.message : String(error);
        state.firstFailedCoordinate = "CANVAS_TWO_FILE_BOOT_ERROR";
        state.recommendedNextFile = FILE;
        state.recommendedNextRenewalTarget = FILE;
        recordError("CANVAS_TWO_FILE_BOOT_FAILED", error);

        try {
          drawDiagnosticFallback(state.bootError);
        } catch (fallbackError) {
          recordError("DIAGNOSTIC_FALLBACK_FAILED", fallbackError);
        }

        updateReadiness();
        updateDataset();
        publishGlobals();

        if (isFunction(options.onError)) {
          try {
            options.onError(error, getReceipt());
          } catch (callbackError) {
            recordError("ON_ERROR_CALLBACK_ERROR", callbackError);
          }
        }

        return getReceipt();
      } finally {
        bootPromise = null;
      }
    })();

    return bootPromise;
  }

  function yieldFrame() {
    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => resolve());
      } else {
        root.setTimeout(resolve, 0);
      }
    });
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  async function mount(options = {}) {
    ensureCanvas(options);
    syncAssetsAuthority();

    if (options.autoRender !== false) {
      await bootCooperative(options);
    }

    return getReceipt();
  }

  async function render(options = {}) {
    if (!state.releaseAccepted && options.requireRelease !== true) {
      acceptDirectTwoFileExpression("direct-render-two-file-expression");
    }

    ensureCanvas(options);

    if (!state.textureReady || options.rebuildTexture === true) {
      buildTexture(options);
    }

    renderSphere(options);
    composeCanvasEvidenceBody();
    composeCanvasReturnPacket();

    return getReceipt();
  }

  function read(point = {}) {
    return sample(point);
  }

  function sample(point = {}) {
    const assets = syncAssetsAuthority();

    if (assets && isFunction(assets.sample)) {
      try {
        if (point && typeof point === "object") {
          return assets.sample(point.u || 0.5, point.v || 0.5);
        }

        return assets.sample(0.5, 0.5);
      } catch (error) {
        recordError("ASSETS_SAMPLE_FAILED", error);
      }
    }

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      u: safeNumber(point.u, 0.5),
      v: safeNumber(point.v, 0.5),
      rgb: [0, 0, 0],
      color: [0, 0, 0],
      canvasStillDoesNotOwnPlanetTruth: true,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function composeTexture(options = {}) {
    const texture = buildTexture(options);

    return {
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      textureCanvas: texture,
      canvas: texture,
      textureReady: Boolean(texture),
      textureComposeComplete: Boolean(texture),
      atlasCanvas: texture,
      atlasReady: Boolean(texture),
      f13AtlasReady: Boolean(texture),
      f13TextureReady: Boolean(texture),
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function getTextureCanvas() {
    return state.textureCanvas;
  }

  function renderSphereFacade(options = {}) {
    if (options.canvas) {
      state.canvas = options.canvas;
      state.context = state.canvas.getContext ? state.canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : state.context;
    }

    if (options.textureCanvas) {
      state.textureCanvas = options.textureCanvas;
      state.textureContext = options.textureCanvas.getContext ? options.textureCanvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null;
      if (state.textureContext) {
        try {
          state.textureImageData = state.textureContext.getImageData(0, 0, options.textureCanvas.width, options.textureCanvas.height);
          state.textureReady = true;
          state.textureBuildComplete = true;
        } catch (error) {
          recordError("FACADE_TEXTURE_IMAGE_DATA_FAILED", error);
        }
      }
    }

    return renderSphere(options);
  }

  function renderSphereSync(options = {}) {
    renderSphereFacade(options);
    return getReceipt();
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    if (isObject(metrics) && Object.keys(metrics).length) {
      if (metrics.visibleContentStrictProof !== undefined) state.visibleContentStrictProof = safeBool(metrics.visibleContentStrictProof, state.visibleContentStrictProof);
      if (metrics.visibleContentSoftGap !== undefined) state.visibleContentSoftGap = safeBool(metrics.visibleContentSoftGap, state.visibleContentSoftGap);
      if (metrics.visibleContentProof !== undefined) state.visibleContentProof = safeBool(metrics.visibleContentProof, state.visibleContentProof);
      if (metrics.visiblePlanetAvailable !== undefined) state.visiblePlanetAvailable = safeBool(metrics.visiblePlanetAvailable, state.visiblePlanetAvailable);
    }

    updateReadiness();
    return getVisibleProofPacket();
  }

  function buildAtlas(options = {}) {
    const texture = buildTexture(options);

    return Promise.resolve({
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_EAST_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_EAST_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      atlasCanvas: texture,
      canvas: texture,
      width: texture ? texture.width : 0,
      height: texture ? texture.height : 0,
      atlasReady: Boolean(texture),
      atlasBuildComplete: Boolean(texture),
      f13AtlasPacketReady: Boolean(texture),
      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastEvidenceReady: Boolean(texture),
      sourceRole: "two-file-assets-texture-source",
      visibleProof: false,
      canvasReady: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      visualPassClaimed: false,
      getReceipt: eastFacadeGetReceipt
    });
  }

  function eastFacadeGetReceipt() {
    return {
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_EAST_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_EAST_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      file: FILE,
      assetsFile: ASSETS_FILE,
      currentParentRecognized: true,
      twoFileExchangeActive: true,
      canvasEastSourceOnly: true,
      requiredApiSurfaceComplete: true,
      buildAtlasAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,
      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      atlasBuildComplete: state.textureBuildComplete,
      atlasReady: state.textureReady,
      f13AtlasPacketReady: state.textureReady,
      assetsContract: state.assetsContract,
      assetsReceipt: state.assetsReceipt,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsVisibleProof: false,
      ownsF21: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function westFacadeGetReceipt() {
    return {
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_WEST_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_WEST_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      file: FILE,
      twoFileExchangeActive: true,
      canvasWestInspectionOnly: true,
      bindInspectionAvailable: true,
      getViewStateAvailable: true,
      setRotationAvailable: true,
      resetRotationAvailable: true,
      setZoomAvailable: true,
      getReceiptAvailable: true,
      canvasWestApiReady: true,
      canvasWestCurrent: true,
      f13InspectEvidenceAvailable: state.canvasWestInspectionReady,
      f13nInspectionReady: state.canvasWestInspectionReady,
      inspectionReady: state.canvasWestInspectionReady,
      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      rotationYaw: state.yaw,
      rotationPitch: state.pitch,
      zoomLevel: state.zoom,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsVisibleProof: false,
      ownsF21: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function southFacadeGetReceipt() {
    return {
      ...getVisibleProofPacket(),
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      file: FILE,
      twoFileExchangeActive: true,
      canvasSouthRenderOnly: true,
      composeTextureAvailable: true,
      renderSphereAvailable: true,
      renderSphereSyncAvailable: true,
      getTextureCanvasAvailable: true,
      sampleVisibleContentAvailable: true,
      classifyVisibleContentEvidenceAvailable: true,
      invalidateTextureAvailable: true,
      getReceiptAvailable: true,
      canvasSouthApiReady: true,
      canvasSouthCurrent: true,
      textureReady: state.textureReady,
      textureComposeComplete: state.textureBuildComplete,
      renderReady: state.renderReady,
      imageRendered: state.imageRendered,
      firstFrameDetected: state.firstFrameDetected,
      f13sVisibleProofReady: state.canvasSouthVisibleProofReady,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsF21: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeCanvasEvidenceBody() {
    updateReadiness();

    const body = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      file: FILE,
      role: state.role,

      twoFileExchangeActive: true,
      assetsCanvasExchangeActive: true,
      childFileDependencyRemoved: true,
      legacyChildFacadeCompatibilityActive: true,
      downstreamExpressionRepairActive: true,

      carrierProof: {
        routeMounted: state.routeMounted,
        mountPresent: state.mountPresent,
        canvasTargetPresent: state.canvasTargetPresent,
        canvasCarrierMounted: state.canvasCarrierMounted,
        canvasContextReady: state.canvasContextReady,
        planetCanvasPresent: state.planetCanvasPresent,
        planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
        canvasCarrierSafe: state.canvasCarrierSafe,
        canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
        canvasCarrierHandoffError: state.canvasCarrierHandoffError,
        structuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
        sphereContainment: state.sphereContainment,
        outsideSphereTransparent: state.outsideSphereTransparent,
        noRectangularTextureSpill: state.noRectangularTextureSpill
      },

      assetsProof: {
        assetsAuthorityObserved: state.assetsAuthorityObserved,
        assetsAuthorityReady: state.assetsAuthorityReady,
        assetsContract: state.assetsContract,
        assetsReceipt: state.assetsReceipt,
        assetsExpectedContractObserved: state.assetsExpectedContractObserved,
        assetsTextureMethodObserved: state.assetsTextureMethodObserved,
        assetsSampleMethodObserved: state.assetsSampleMethodObserved,
        assetsTextureConsumed: state.assetsTextureConsumed,
        assetsTextureCanvasPresent: state.assetsTextureCanvasPresent,
        textureReady: state.textureReady
      },

      releaseProof: {
        releaseAccepted: state.releaseAccepted,
        releaseStatus: state.releaseStatus,
        releaseReason: state.releaseReason,
        directTwoFileExpressionAccepted: state.directTwoFileExpressionAccepted,
        receivedFrom: state.receivedFrom,
        cycleNumber: state.cycleNumber,
        cycleRoute: state.cycleRoute,
        westAuditObserved: state.westAuditObserved,
        westAuditAccepted: state.westAuditAccepted,
        westCanvasReleaseApproved: state.westCanvasReleaseApproved,
        canvasReleaseAuthorized: state.canvasReleaseAuthorized
      },

      renderProof: {
        firstFrameRequested: state.firstFrameRequested,
        firstFrameDetected: state.firstFrameDetected,
        imageRendered: state.imageRendered,
        imageRenderedMeansFrameDrawnOnly: true,
        imageRenderedDoesNotMeanVisualPass: true,
        imageRenderedDoesNotMeanF21: true,
        renderReady: state.renderReady,
        renderFrameCount: state.renderFrameCount
      },

      childCompatibilityProof: {
        canvasEastApiReady: true,
        canvasWestApiReady: true,
        canvasSouthApiReady: true,
        allCanvasChildrenApiReady: true,
        canvasEastEvidenceReady: state.canvasEastEvidenceReady,
        canvasWestInspectionReady: state.canvasWestInspectionReady,
        canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
        allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
        allCanvasChildrenReady: state.allCanvasChildrenReady,
        childFileLoadSuppressed: true
      },

      visibleProof: getVisibleProofPacket(),

      f13Proof: {
        f13ReleaseReceived: state.f13ReleaseReceived,
        f13ParentIdentityAccepted: true,
        f13PhysicalCarrierMounted: state.f13PhysicalCarrierMounted,
        f13ChildrenApiReady: true,
        f13ChildrenEvidenceReady: state.f13ChildrenEvidenceReady,
        f13ChildrenReady: state.f13ChildrenReady,
        f13AtlasReady: state.f13AtlasReady,
        f13InspectReady: state.f13InspectReady,
        f13TextureReady: state.f13TextureReady,
        f13RenderReady: state.f13RenderReady,
        f13FrameReady: state.f13FrameReady,
        f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
        f13VisibleEvidenceStrict: state.f13VisibleEvidenceStrict,
        f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
        f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
        f13HardFail: state.f13HardFail,
        f13StrictEvidenceGap: state.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget
      },

      newsProof: {
        newsProtocolSynchronized: true,
        fibonacciAlignmentSynchronized: true,
        activeFibonacci: 13,
        activeFibonacciRank: "F13P",
        activeStageId: state.activeStageId,
        activeGearId: state.activeGearId,
        activeFibonacciGate: "F13",
        futureFibonacciGate: "F21",
        oneActiveGearAtATime: true,
        northGateReady: false,
        eastGateReady: state.eastGateReady,
        westGateReady: state.westGateReady,
        southGateReady: state.southGateReady,
        canvasGateReady: state.canvasGateReady,
        newsGatePassedBeforeF21: false,
        newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,
        canvasFinalizesNews: false
      },

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      completionLatched: false,
      degradedCompletionLatched: false,
      f21LatchMode: "north-only",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };

    state.canvasEvidenceBodyComposed = true;
    updateDataset();

    return body;
  }

  function composeCanvasEvidenceReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      canvasEvidenceReceipt: true,
      canvasEvidenceBody: composeCanvasEvidenceBody(),
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      completionLatched: false,
      degradedCompletionLatched: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeCanvasReturnPacket() {
    const body = composeCanvasEvidenceBody();

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: NORTH_FILE,

      cycleNumber: 2,
      cycleRoute: MACRO_CYCLE_2,
      receivedFrom: state.receivedFrom || "CANVAS",
      returnTo: "NORTH",
      handoffTo: "",
      activeCardinal: "CANVAS",
      activeFibonacci: 13,
      activeFibonacciRank: "F13P",
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeNewsGate: "CANVAS",

      northGateReady: false,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,

      twoFileExchangeActive: true,
      assetsCanvasExchangeActive: true,
      childFileDependencyRemoved: true,
      canvasEvidenceBodyComposed: true,
      canvasEvidenceReceiptComposed: true,
      physicalBootComplete: state.physicalBootComplete,
      canvasBootComplete: state.canvasBootComplete,

      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      completionLatched: false,
      degradedCompletionLatched: false,
      f21LatchMode: "north-only",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      canvasEvidenceBody: body,
      composedAt: nowIso()
    };

    state.canvasReturnPacketReady = true;
    updateDataset();

    return packet;
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

  function submitCanvasEvidenceUpstream() {
    const session = getNorthSession();
    const packet = composeCanvasReturnPacket();

    if (!session) return false;

    try {
      if (isFunction(session.submitEvent)) {
        session.submitEvent(packet);
        state.canvasEvidenceSubmittedToNorth = true;
        updateDataset();
        return true;
      }

      if (isFunction(session.submit)) {
        session.submit(packet);
        state.canvasEvidenceSubmittedToNorth = true;
        updateDataset();
        return true;
      }
    } catch (error) {
      recordError("SUBMIT_CANVAS_EVIDENCE_UPSTREAM_FAILED", error);
    }

    return false;
  }

  function getMaterialBridgeReceipt() {
    return {
      materialReceiptBridgeActive: state.assetsAuthorityReady,
      materialNestedReceiptAvailable: state.assetsAuthorityObserved,
      materialContract: state.assetsContract,
      materialReceipt: state.assetsReceipt,
      materialContractMatchesExpected: state.assetsExpectedContractObserved,
      materialReceiptMatchesExpected: Boolean(state.assetsReceipt),
      canonicalMaterialConsumed: state.assetsTextureConsumed,
      assetsCanvasExchangeActive: true,
      canvasStillDoesNotOwnMaterialTruth: true
    };
  }

  function getReceiptLight() {
    updateReadiness();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      version: VERSION,
      file: FILE,
      assetsFile: ASSETS_FILE,
      role: state.role,

      twoFileExchangeActive: true,
      assetsCanvasExchangeActive: true,
      childFileDependencyRemoved: true,
      legacyChildFacadeCompatibilityActive: true,
      downstreamExpressionRepairActive: true,

      releaseAccepted: state.releaseAccepted,
      releaseStatus: state.releaseStatus,
      releaseReason: state.releaseReason,
      directTwoFileExpressionAccepted: state.directTwoFileExpressionAccepted,
      receivedFrom: state.receivedFrom,
      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,

      routeMounted: state.routeMounted,
      canvasTargetPresent: state.canvasTargetPresent,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      canvasCarrierSafe: state.canvasCarrierSafe,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      structuralCarrierSafeForCanvasRelease: state.structuralCarrierSafeForCanvasRelease,
      sphereContainment: state.sphereContainment,
      outsideSphereTransparent: state.outsideSphereTransparent,
      noRectangularTextureSpill: state.noRectangularTextureSpill,

      assetsAuthorityObserved: state.assetsAuthorityObserved,
      assetsAuthorityReady: state.assetsAuthorityReady,
      assetsContract: state.assetsContract,
      assetsReceipt: state.assetsReceipt,
      assetsExpectedContractObserved: state.assetsExpectedContractObserved,
      assetsTextureConsumed: state.assetsTextureConsumed,
      textureReady: state.textureReady,

      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      imageRenderedMeansFrameDrawnOnly: true,
      imageRenderedDoesNotMeanVisualPass: true,
      imageRenderedDoesNotMeanF21: true,
      renderReady: state.renderReady,

      canvasEastApiReady: true,
      canvasWestApiReady: true,
      canvasSouthApiReady: true,
      allCanvasChildrenApiReady: true,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      childFileLoadSuppressed: true,

      f13ReleaseReceived: state.f13ReleaseReceived,
      f13ParentIdentityAccepted: true,
      f13PhysicalCarrierMounted: state.f13PhysicalCarrierMounted,
      f13ChildrenApiReady: true,
      f13ChildrenEvidenceReady: state.f13ChildrenEvidenceReady,
      f13ChildrenReady: state.f13ChildrenReady,
      f13AtlasReady: state.f13AtlasReady,
      f13InspectReady: state.f13InspectReady,
      f13TextureReady: state.f13TextureReady,
      f13RenderReady: state.f13RenderReady,
      f13FrameReady: state.f13FrameReady,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13VisibleEvidenceStrict: state.f13VisibleEvidenceStrict,
      f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      newsProtocolSynchronized: true,
      fibonacciAlignmentSynchronized: true,
      activeFibonacci: 13,
      activeFibonacciRank: "F13P",
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      northGateReady: false,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      completionLatched: false,
      degradedCompletionLatched: false,
      f21LatchMode: "north-only",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    updateReadiness();

    return {
      ...getReceiptLight(),

      materialReceiptBridge: getMaterialBridgeReceipt(),

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetFramePainted: state.planetFramePainted,
      planetNotObstructed: state.planetNotObstructed,
      carrierOnlyDetected: state.carrierOnlyDetected,
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
      proofBin: state.proofBin,

      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,
      receiptToggleReady: state.receiptToggleReady,
      copyDiagnosticPreserved: state.copyDiagnosticPreserved,
      yaw: state.yaw,
      pitch: state.pitch,
      zoom: state.zoom,
      pointerDragCount: state.pointerDragCount,

      physicalBootRequested: state.physicalBootRequested,
      physicalBootStarted: state.physicalBootStarted,
      physicalBootComplete: state.physicalBootComplete,
      canvasBootRequested: state.canvasBootRequested,
      canvasBootStarted: state.canvasBootStarted,
      canvasBootComplete: state.canvasBootComplete,
      booting: state.booting,
      booted: state.booted,
      bootError: state.bootError,

      textureBuildRequested: state.textureBuildRequested,
      textureBuildStarted: state.textureBuildStarted,
      textureBuildComplete: state.textureBuildComplete,
      textureBuildError: state.textureBuildError,
      assetsTextureWidth: state.assetsTextureWidth,
      assetsTextureHeight: state.assetsTextureHeight,

      renderFrameCount: state.renderFrameCount,
      interactiveFrameCount: state.interactiveFrameCount,

      canvasEvidenceBodyComposed: state.canvasEvidenceBodyComposed,
      canvasReturnPacketReady: state.canvasReturnPacketReady,
      canvasEvidenceSubmittedToNorth: state.canvasEvidenceSubmittedToNorth,

      ownsCanvasCarrier: true,
      ownsSphereRendering: true,
      ownsInspectionControls: true,
      ownsF13EvidenceReceipt: true,
      ownsLegacyCompatibilityFacades: true,
      ownsPlanetTruth: false,
      ownsTerrainTruth: false,
      ownsElevationTruth: false,
      ownsHydrologyTruth: false,
      ownsClimateTruth: false,
      ownsMaterialTruth: false,
      ownsRouteOrchestration: false,
      ownsRuntimeTableGovernance: false,
      ownsMacroWestAdmissibility: false,
      ownsNorthNewsFinalization: false,
      ownsF21: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      localEvents: clonePlain(state.localEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      errors: clonePlain(state.errors)
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const events = (r.localEvents || [])
      .slice(-32)
      .map((event) => `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .map((error) => `- ${error.at} :: ${error.code} :: ${error.message}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_PARENT_TWO_FILE_ASSETS_EXPRESSION_EXCHANGE_RECEIPT",
      "",
      "IDENTITY",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `baselineContract=${r.baselineContract}`,
      `baselineReceipt=${r.baselineReceipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `assetsFile=${r.assetsFile}`,
      `role=${r.role}`,
      "",
      "TWO_FILE_EXCHANGE",
      `twoFileExchangeActive=${r.twoFileExchangeActive}`,
      `assetsCanvasExchangeActive=${r.assetsCanvasExchangeActive}`,
      `childFileDependencyRemoved=${r.childFileDependencyRemoved}`,
      `legacyChildFacadeCompatibilityActive=${r.legacyChildFacadeCompatibilityActive}`,
      `downstreamExpressionRepairActive=${r.downstreamExpressionRepairActive}`,
      "",
      "ASSETS_AUTHORITY",
      `assetsAuthorityObserved=${r.assetsAuthorityObserved}`,
      `assetsAuthorityReady=${r.assetsAuthorityReady}`,
      `assetsContract=${r.assetsContract}`,
      `assetsReceipt=${r.assetsReceipt}`,
      `assetsExpectedContractObserved=${r.assetsExpectedContractObserved}`,
      `assetsTextureConsumed=${r.assetsTextureConsumed}`,
      `textureReady=${r.textureReady}`,
      `textureBuildComplete=${r.textureBuildComplete}`,
      `textureBuildError=${r.textureBuildError}`,
      "",
      "CARRIER",
      `routeMounted=${r.routeMounted}`,
      `canvasTargetPresent=${r.canvasTargetPresent}`,
      `canvasCarrierMounted=${r.canvasCarrierMounted}`,
      `canvasContextReady=${r.canvasContextReady}`,
      `planetCanvasPresent=${r.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${r.planetCanvasNonZeroSize}`,
      `canvasCarrierSafe=${r.canvasCarrierSafe}`,
      `canvasCarrierHandoffOk=${r.canvasCarrierHandoffOk}`,
      `canvasCarrierHandoffError=${r.canvasCarrierHandoffError}`,
      `structuralCarrierSafeForCanvasRelease=${r.structuralCarrierSafeForCanvasRelease}`,
      `sphereContainment=${r.sphereContainment}`,
      `outsideSphereTransparent=${r.outsideSphereTransparent}`,
      `noRectangularTextureSpill=${r.noRectangularTextureSpill}`,
      "",
      "RELEASE",
      `releaseAccepted=${r.releaseAccepted}`,
      `releaseStatus=${r.releaseStatus}`,
      `releaseReason=${r.releaseReason}`,
      `directTwoFileExpressionAccepted=${r.directTwoFileExpressionAccepted}`,
      `cycleNumber=${r.cycleNumber}`,
      `cycleRoute=${r.cycleRoute}`,
      `receivedFrom=${r.receivedFrom}`,
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditAccepted=${r.westAuditAccepted}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      "",
      "LEGACY_CHILD_COMPATIBILITY_FACADES",
      `canvasEastApiReady=${r.canvasEastApiReady}`,
      `canvasWestApiReady=${r.canvasWestApiReady}`,
      `canvasSouthApiReady=${r.canvasSouthApiReady}`,
      `allCanvasChildrenApiReady=${r.allCanvasChildrenApiReady}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      `canvasWestInspectionReady=${r.canvasWestInspectionReady}`,
      `canvasSouthVisibleProofReady=${r.canvasSouthVisibleProofReady}`,
      `allCanvasChildrenEvidenceReady=${r.allCanvasChildrenEvidenceReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `childFileLoadSuppressed=${r.childFileLoadSuppressed}`,
      "",
      "RENDER",
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `imageRenderedMeansFrameDrawnOnly=${r.imageRenderedMeansFrameDrawnOnly}`,
      `imageRenderedDoesNotMeanVisualPass=${r.imageRenderedDoesNotMeanVisualPass}`,
      `imageRenderedDoesNotMeanF21=${r.imageRenderedDoesNotMeanF21}`,
      `renderReady=${r.renderReady}`,
      `renderFrameCount=${r.renderFrameCount}`,
      "",
      "VISIBLE_PROOF",
      `visibleContentProofStarted=${r.visibleContentProofStarted}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visibleForwardProgress=${r.visibleForwardProgress}`,
      `visibleContentAdmissible=${r.visibleContentAdmissible}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `nonblankPlanetVisible=${r.nonblankPlanetVisible}`,
      `visibleContentProofMethod=${r.visibleContentProofMethod}`,
      `visibleContentProofError=${r.visibleContentProofError}`,
      `visibleContentSampleCount=${r.visibleContentSampleCount}`,
      `visibleContentVarianceScore=${r.visibleContentVarianceScore}`,
      `visibleContentClassCount=${r.visibleContentClassCount}`,
      `proofBin=${r.proofBin}`,
      "",
      "INSPECTION",
      `dragInspectionBound=${r.dragInspectionBound}`,
      `zoomInspectionBound=${r.zoomInspectionBound}`,
      `inspectModeAvailable=${r.inspectModeAvailable}`,
      `inspectPlanetControlAvailable=${r.inspectPlanetControlAvailable}`,
      `diagnosticCanLeavePlanetFrame=${r.diagnosticCanLeavePlanetFrame}`,
      `receiptToggleReady=${r.receiptToggleReady}`,
      `copyDiagnosticPreserved=${r.copyDiagnosticPreserved}`,
      "",
      "F13",
      `f13ReleaseReceived=${r.f13ReleaseReceived}`,
      `f13ParentIdentityAccepted=${r.f13ParentIdentityAccepted}`,
      `f13PhysicalCarrierMounted=${r.f13PhysicalCarrierMounted}`,
      `f13ChildrenApiReady=${r.f13ChildrenApiReady}`,
      `f13ChildrenEvidenceReady=${r.f13ChildrenEvidenceReady}`,
      `f13ChildrenReady=${r.f13ChildrenReady}`,
      `f13AtlasReady=${r.f13AtlasReady}`,
      `f13InspectReady=${r.f13InspectReady}`,
      `f13TextureReady=${r.f13TextureReady}`,
      `f13RenderReady=${r.f13RenderReady}`,
      `f13FrameReady=${r.f13FrameReady}`,
      `f13VisibleEvidenceAvailable=${r.f13VisibleEvidenceAvailable}`,
      `f13VisibleEvidenceStrict=${r.f13VisibleEvidenceStrict}`,
      `f13VisibleEvidenceDegraded=${r.f13VisibleEvidenceDegraded}`,
      `f13CanvasEvidenceStrict=${r.f13CanvasEvidenceStrict}`,
      `f13CanvasEvidenceDegraded=${r.f13CanvasEvidenceDegraded}`,
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13HardFail=${r.f13HardFail}`,
      `f13StrictEvidenceGap=${r.f13StrictEvidenceGap}`,
      `f13StrictEvidenceRepairTarget=${r.f13StrictEvidenceRepairTarget}`,
      "",
      "NEWS_FIBONACCI",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      "",
      "F21_BOUNDARY",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21ClaimedByCanvas=${r.f21ClaimedByCanvas}`,
      `readyTextClaimedByCanvas=${r.readyTextClaimedByCanvas}`,
      `completionLatched=${r.completionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `f21LatchMode=${r.f21LatchMode}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "LOCAL_EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function addCallbacksFromOptions(options = {}) {
    [options.onPhase, options.onEvent, options.onStatus, options.statusCallback, options.onReceipt].filter(isFunction).forEach((callback) => on(callback));
  }

  function on(callback) {
    if (isFunction(callback) && !state.callbacks.includes(callback)) state.callbacks.push(callback);
    return () => off(callback);
  }

  function off(callback) {
    const index = state.callbacks.indexOf(callback);
    if (index >= 0) state.callbacks.splice(index, 1);
  }

  function dispatchEventToCallbacks(event) {
    const receipt = getReceiptLight();

    state.callbacks.slice().forEach((callback) => {
      try {
        callback(event, receipt);
      } catch (error) {
        recordError("CANVAS_CALLBACK_ERROR", error, { event: event.event || "" });
      }
    });

    if (isFunction(root.dispatchEvent) && isFunction(root.CustomEvent)) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-phase", { detail: { event, receipt } }));
      } catch (_error) {}
    }
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasVersion", VERSION);
    setDataset("hearthCanvasRole", state.role);

    setDataset("hearthCanvasTwoFileExchangeActive", "true");
    setDataset("hearthCanvasAssetsCanvasExchangeActive", "true");
    setDataset("hearthCanvasChildFileDependencyRemoved", "true");
    setDataset("hearthCanvasLegacyChildFacadeCompatibilityActive", "true");
    setDataset("hearthCanvasDownstreamExpressionRepairActive", "true");

    setDataset("hearthCanvasReleaseAccepted", state.releaseAccepted);
    setDataset("hearthCanvasReleaseStatus", state.releaseStatus);
    setDataset("hearthCanvasReleaseReason", state.releaseReason);
    setDataset("hearthCanvasDirectTwoFileExpressionAccepted", state.directTwoFileExpressionAccepted);
    setDataset("hearthCanvasReceivedFrom", state.receivedFrom);
    setDataset("hearthCanvasCycleNumber", state.cycleNumber);
    setDataset("hearthCanvasCycleRoute", state.cycleRoute);
    setDataset("hearthCanvasWestAuditObserved", state.westAuditObserved);
    setDataset("hearthCanvasWestReleaseApproved", state.westCanvasReleaseApproved);
    setDataset("hearthCanvasReleaseAuthorized", state.canvasReleaseAuthorized);

    setDataset("hearthCanvasRouteMounted", state.routeMounted);
    setDataset("hearthCanvasTargetPresent", state.canvasTargetPresent);
    setDataset("hearthCanvasCarrierMounted", state.canvasCarrierMounted);
    setDataset("hearthCanvasContextReady", state.canvasContextReady);
    setDataset("hearthPlanetCanvasPresent", state.planetCanvasPresent);
    setDataset("hearthPlanetCanvasNonZeroSize", state.planetCanvasNonZeroSize);
    setDataset("hearthCanvasCarrierSafe", state.canvasCarrierSafe);
    setDataset("hearthCanvasCarrierHandoffOk", state.canvasCarrierHandoffOk);
    setDataset("hearthCanvasCarrierHandoffError", state.canvasCarrierHandoffError);
    setDataset("hearthCanvasStructuralCarrierSafeForCanvasRelease", state.structuralCarrierSafeForCanvasRelease);
    setDataset("hearthCanvasSphereContainment", state.sphereContainment);
    setDataset("hearthCanvasOutsideSphereTransparent", state.outsideSphereTransparent);
    setDataset("hearthCanvasNoRectangularTextureSpill", state.noRectangularTextureSpill);

    setDataset("hearthCanvasAssetsAuthorityObserved", state.assetsAuthorityObserved);
    setDataset("hearthCanvasAssetsAuthorityReady", state.assetsAuthorityReady);
    setDataset("hearthCanvasAssetsContract", state.assetsContract);
    setDataset("hearthCanvasAssetsReceipt", state.assetsReceipt);
    setDataset("hearthCanvasAssetsExpectedContractObserved", state.assetsExpectedContractObserved);
    setDataset("hearthCanvasAssetsTextureConsumed", state.assetsTextureConsumed);
    setDataset("hearthCanvasTextureReady", state.textureReady);
    setDataset("hearthCanvasTextureBuildComplete", state.textureBuildComplete);
    setDataset("hearthCanvasTextureBuildError", state.textureBuildError);

    setDataset("hearthCanvasEastApiReady", "true");
    setDataset("hearthCanvasWestApiReady", "true");
    setDataset("hearthCanvasSouthApiReady", "true");
    setDataset("hearthCanvasAllChildrenApiReady", "true");
    setDataset("hearthCanvasEastEvidenceReady", state.canvasEastEvidenceReady);
    setDataset("hearthCanvasWestInspectionReady", state.canvasWestInspectionReady);
    setDataset("hearthCanvasSouthVisibleProofReady", state.canvasSouthVisibleProofReady);
    setDataset("hearthCanvasAllChildrenEvidenceReady", state.allCanvasChildrenEvidenceReady);
    setDataset("hearthCanvasAllChildrenReady", state.allCanvasChildrenReady);
    setDataset("hearthCanvasChildFileLoadSuppressed", "true");

    setDataset("hearthCanvasFirstFrameDetected", state.firstFrameDetected);
    setDataset("hearthCanvasImageRendered", state.imageRendered);
    setDataset("hearthCanvasImageRenderedMeansFrameDrawnOnly", "true");
    setDataset("hearthCanvasImageRenderedDoesNotMeanVisualPass", "true");
    setDataset("hearthCanvasImageRenderedDoesNotMeanF21", "true");
    setDataset("hearthCanvasRenderReady", state.renderReady);

    setDataset("hearthCanvasVisibleContentProof", state.visibleContentProof);
    setDataset("hearthCanvasVisibleContentStrictProof", state.visibleContentStrictProof);
    setDataset("hearthCanvasVisibleContentSoftGap", state.visibleContentSoftGap);
    setDataset("hearthCanvasVisibleContentHardFail", state.visibleContentHardFail);
    setDataset("hearthCanvasVisibleForwardProgress", state.visibleForwardProgress);
    setDataset("hearthCanvasVisibleContentAdmissible", state.visibleContentAdmissible);
    setDataset("hearthCanvasVisiblePlanetAvailable", state.visiblePlanetAvailable);

    setDataset("hearthCanvasInspectModeAvailable", state.inspectModeAvailable);
    setDataset("hearthCanvasInspectPlanetControlAvailable", state.inspectPlanetControlAvailable);
    setDataset("hearthCanvasDiagnosticCanLeavePlanetFrame", state.diagnosticCanLeavePlanetFrame);
    setDataset("hearthCanvasReceiptToggleReady", state.receiptToggleReady);
    setDataset("hearthCanvasCopyDiagnosticPreserved", state.copyDiagnosticPreserved);

    setDataset("hearthCanvasF13ReleaseReceived", state.f13ReleaseReceived);
    setDataset("hearthCanvasF13ParentIdentityAccepted", "true");
    setDataset("hearthCanvasF13PhysicalCarrierMounted", state.f13PhysicalCarrierMounted);
    setDataset("hearthCanvasF13ChildrenApiReady", "true");
    setDataset("hearthCanvasF13ChildrenEvidenceReady", state.f13ChildrenEvidenceReady);
    setDataset("hearthCanvasF13AtlasReady", state.f13AtlasReady);
    setDataset("hearthCanvasF13InspectReady", state.f13InspectReady);
    setDataset("hearthCanvasF13TextureReady", state.f13TextureReady);
    setDataset("hearthCanvasF13RenderReady", state.f13RenderReady);
    setDataset("hearthCanvasF13FrameReady", state.f13FrameReady);
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", state.f13VisibleEvidenceAvailable);
    setDataset("hearthCanvasF13VisibleEvidenceStrict", state.f13VisibleEvidenceStrict);
    setDataset("hearthCanvasF13VisibleEvidenceDegraded", state.f13VisibleEvidenceDegraded);
    setDataset("hearthCanvasF13EvidenceStrict", state.f13CanvasEvidenceStrict);
    setDataset("hearthCanvasF13EvidenceDegraded", state.f13CanvasEvidenceDegraded);
    setDataset("hearthCanvasF13EvidenceComplete", state.f13CanvasEvidenceComplete);
    setDataset("hearthCanvasF13HardFail", state.f13HardFail);
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasNewsProtocolSynchronized", "true");
    setDataset("hearthCanvasFibonacciAlignmentSynchronized", "true");
    setDataset("hearthCanvasActiveFibonacci", "13");
    setDataset("hearthCanvasActiveFibonacciRank", "F13P");
    setDataset("hearthCanvasActiveStageId", state.activeStageId);
    setDataset("hearthCanvasActiveGearId", state.activeGearId);
    setDataset("hearthCanvasActiveFibonacciGate", "F13");
    setDataset("hearthCanvasFutureFibonacciGate", "F21");
    setDataset("hearthCanvasOneActiveGearAtATime", "true");
    setDataset("hearthCanvasNorthGateReady", "false");
    setDataset("hearthCanvasEastGateReady", state.eastGateReady);
    setDataset("hearthCanvasWestGateReady", state.westGateReady);
    setDataset("hearthCanvasSouthGateReady", state.southGateReady);
    setDataset("hearthCanvasCanvasGateReady", state.canvasGateReady);
    setDataset("hearthCanvasNewsGatePassedBeforeF21", "false");
    setDataset("hearthCanvasNewsGateDegradedBeforeF21", state.newsGateDegradedBeforeF21);

    setDataset("hearthCanvasEvidenceBodyComposed", state.canvasEvidenceBodyComposed);
    setDataset("hearthCanvasReturnPacketReady", state.canvasReturnPacketReady);
    setDataset("hearthCanvasEvidenceSubmittedToNorth", state.canvasEvidenceSubmittedToNorth);

    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasF21LatchMode", "north-only");
    setDataset("hearthCanvasVisualPassClaimed", "false");

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    updateCanvasDataset();
  }

  function publishFacades() {
    const eastFacade = {
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_EAST_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_EAST_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      file: FILE,
      buildAtlas,
      sample,
      read,
      getReceipt: eastFacadeGetReceipt,
      requiredApiSurfaceComplete: true,
      buildAtlasAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,
      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastSourceOnly: true,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsVisibleProof: false,
      ownsF21: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    const westFacade = {
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_WEST_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_WEST_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      file: FILE,
      bindInspection,
      getViewState,
      setRotation,
      resetRotation,
      setZoom,
      resetZoom,
      getReceipt: westFacadeGetReceipt,
      bindInspectionAvailable: true,
      getViewStateAvailable: true,
      setRotationAvailable: true,
      resetRotationAvailable: true,
      setZoomAvailable: true,
      getReceiptAvailable: true,
      canvasWestApiReady: true,
      canvasWestCurrent: true,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsVisibleProof: false,
      ownsF21: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    const southFacade = {
      contract: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE",
      receipt: "INTERNAL_TWO_FILE_ASSETS_EXCHANGE_SOUTH_FACADE_RECEIPT",
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      file: FILE,
      composeTexture,
      renderSphere: renderSphereFacade,
      renderSphereSync,
      getTextureCanvas,
      sampleVisibleContent,
      classifyVisibleContentEvidence,
      invalidateTexture,
      getReceipt: southFacadeGetReceipt,
      composeTextureAvailable: true,
      renderSphereAvailable: true,
      renderSphereSyncAvailable: true,
      getTextureCanvasAvailable: true,
      sampleVisibleContentAvailable: true,
      classifyVisibleContentEvidenceAvailable: true,
      invalidateTextureAvailable: true,
      getReceiptAvailable: true,
      canvasSouthApiReady: true,
      canvasSouthCurrent: true,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsF21: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasEast = eastFacade;
    root.HEARTH.canvasEastMaterialAtlasSourceMachine = eastFacade;
    root.HEARTH.canvasEastMaterialAtlasSourceTransistor = eastFacade;
    root.HEARTH.canvasEastF13AtlasSourceChild = eastFacade;
    root.HEARTH.canvasEastGovernedF13AtlasSource = eastFacade;
    root.HEARTH.canvasEastCurrentParentRecognizedF13AtlasSource = eastFacade;
    root.HEARTH.canvasEastSource = eastFacade;

    root.HEARTH.canvasWest = westFacade;
    root.HEARTH.canvasWestInspectionInvalidationControl = westFacade;
    root.HEARTH.canvasWestF13NInspectionViewInvalidationChild = westFacade;

    root.HEARTH.canvasSouth = southFacade;
    root.HEARTH.canvasSouthTextureSphereVisibleProof = southFacade;
    root.HEARTH.canvasSouthF13STextureRenderVisibleProofChild = southFacade;
    root.HEARTH.canvasSouthF13SStrictVisibleProofClassifierChild = southFacade;

    root.HEARTH_CANVAS_EAST = eastFacade;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE = eastFacade;
    root.HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR = eastFacade;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE = eastFacade;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE = eastFacade;
    root.HEARTH_CANVAS_EAST_SOURCE = eastFacade;

    root.HEARTH_CANVAS_WEST = westFacade;
    root.HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL = westFacade;
    root.HEARTH_CANVAS_WEST_F13N_INSPECTION_VIEW_INVALIDATION_CHILD = westFacade;

    root.HEARTH_CANVAS_SOUTH = southFacade;
    root.HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF = southFacade;
    root.HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD = southFacade;
    root.HEARTH_CANVAS_SOUTH_F13S_STRICT_VISIBLE_PROOF_CLASSIFIER_CHILD = southFacade;

    root.DEXTER_LAB.hearthCanvasEast = eastFacade;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine = eastFacade;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceTransistor = eastFacade;
    root.DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild = eastFacade;
    root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource = eastFacade;
    root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource = eastFacade;
    root.DEXTER_LAB.hearthCanvasEastSource = eastFacade;

    root.DEXTER_LAB.hearthCanvasWest = westFacade;
    root.DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl = westFacade;
    root.DEXTER_LAB.hearthCanvasWestF13NInspectionViewInvalidationChild = westFacade;

    root.DEXTER_LAB.hearthCanvasSouth = southFacade;
    root.DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof = southFacade;
    root.DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild = southFacade;
    root.DEXTER_LAB.hearthCanvasSouthF13SStrictVisibleProofClassifierChild = southFacade;

    root.HEARTH_CANVAS_EAST_RECEIPT = eastFacadeGetReceipt();
    root.HEARTH_CANVAS_WEST_RECEIPT = westFacadeGetReceipt();
    root.HEARTH_CANVAS_SOUTH_RECEIPT = southFacadeGetReceipt();
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvas = api;
    root.HEARTH.canvasAuthority = api;
    root.HEARTH.canvasEvidence = api;
    root.HEARTH.canvasTwoFileAssetsExchange = api;
    root.HEARTH.canvasParentTwoFileAssetsExpressionExchange = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_TEXTURE = api;
    root.HEARTH_CANVAS_TWO_FILE_ASSETS_EXCHANGE = api;
    root.HEARTH_CANVAS_PARENT_TWO_FILE_ASSETS_EXPRESSION_EXCHANGE = api;

    root.DEXTER_LAB.hearthCanvasEvidence = api;
    root.DEXTER_LAB.hearthCanvasTwoFileAssetsExchange = api;
    root.DEXTER_LAB.hearthCanvasParentTwoFileAssetsExpressionExchange = api;

    publishFacades();

    const light = getReceiptLight();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_EVIDENCE_RECEIPT = light;
    root.HEARTH_CANVAS_POSTGAME_RECEIPT = light;
    root.HEARTH.canvasReceipt = light;
    root.HEARTH.canvasEvidenceReceipt = light;
    root.HEARTH.canvasTwoFileAssetsExchangeReceipt = light;

    root.__HEARTH_CANVAS_PARENT_MARKER__ = true;
    root.__HEARTH_CANVAS_PARENT_FILE__ = FILE;
    root.__HEARTH_CANVAS_PARENT_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_PARENT_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_TWO_FILE_ASSETS_EXCHANGE__ = true;
    root.__HEARTH_CANVAS_CHILD_FILE_DEPENDENCY_REMOVED__ = true;
    root.__HEARTH_CANVAS_LEGACY_CHILD_FACADES_READY__ = true;
    root.__HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION__ = true;
    root.__HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER__ = true;
    root.__HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER__ = true;
    root.__HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST__ = false;
    root.__HEARTH_CANVAS_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_VISUAL_PASS_CLAIMED__ = false;

    updateDataset();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    assetsFile: ASSETS_FILE,

    ensureCanvas,
    ensureCarrier: ensureCanvas,
    syncAssetsAuthority,
    getAssetsAuthority,
    normalizeReleaseInput,
    resolveCanvasRelease,
    acceptCanvasReleasePacket: resolveCanvasRelease,
    holdCanvasUntilRelease: resolveCanvasRelease,
    acceptDirectTwoFileExpression,

    buildTexture,
    composeTexture,
    renderSphere,
    render: renderSphereFacade,
    renderSphereSync,
    bootCooperative,
    boot,
    mount,
    forceRedraw,
    invalidateTexture,

    bindInspection,
    getViewState,
    setRotation,
    resetRotation,
    setZoom,
    resetZoom,
    zoomIn,
    zoomOut,

    sample,
    read,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    getTextureCanvas,

    composeCanvasEvidenceBody,
    composeCanvasEvidenceReceipt,
    composeCanvasReturnPacket,
    submitCanvasEvidenceUpstream,

    getMaterialBridgeReceipt,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getState: () => state,
    on,
    off,

    twoFileExchangeActive: true,
    assetsCanvasExchangeActive: true,
    childFileDependencyRemoved: true,
    legacyChildFacadeCompatibilityActive: true,
    downstreamExpressionRepairActive: true,

    canvasNorthActive: true,
    physicalObjectBootstrapActive: true,
    physicalCarrierProofActive: true,
    governedF13EvidenceReceiverActive: true,
    parentChildReconciliationActive: false,
    parentChildReconciliationReplacedByInternalFacades: true,
    preReleaseStructuralCarrierActive: true,
    postReleaseChildRenderChainActive: false,
    eastReleasePacketBridgeActive: false,
    waitsForWestRelease: false,
    cycleOneHeld: true,
    cycleTwoReleaseRequired: false,
    singlePhysicalFile: true,
    internalNewsZonesActive: true,
    noAdditionalCanvasFileSplit: true,

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacci: 13,
    activeFibonacciRank: "F13P",
    activeStageId: "canvas-parent-two-file-assets-expression-exchange",
    activeGearId: "hearth-canvas-parent-two-file-assets-expression",
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    ownsCanvasCarrier: true,
    ownsSphereRendering: true,
    ownsInspectionControls: true,
    ownsF13EvidenceReceipt: true,
    ownsLegacyCompatibilityFacades: true,
    ownsPlanetTruth: false,
    ownsTerrainTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsClimateTruth: false,
    ownsMaterialTruth: false,
    ownsRouteOrchestration: false,
    ownsRuntimeTableGovernance: false,
    ownsMacroWestAdmissibility: false,
    ownsNorthNewsFinalization: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      updateReadiness();
      return state;
    }
  };

  try {
    state.updatedAt = nowIso();
    publishGlobals();

    const preflight = () => {
      ensureCanvas({});
      syncAssetsAuthority();

      recordLocal("CANVAS_TWO_FILE_ASSETS_EXPRESSION_EXCHANGE_LOADED", {
        file: FILE,
        contract: CONTRACT,
        receipt: RECEIPT,
        assetsAuthorityReady: state.assetsAuthorityReady,
        childFileDependencyRemoved: true,
        legacyChildFacadeCompatibilityActive: true,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      });

      const routeAuthorized =
        readDataset("hearthCanvasReleaseAuthorized", "") === "true" ||
        readDataset("westCanvasReleaseAuthorized", "") === "true" ||
        readDataset("hearthCanvasReleaseAccepted", "") === "true" ||
        readDataset("hearthCanvasWestReleaseApproved", "") === "true";

      if (routeAuthorized) {
        resolveCanvasRelease({
          cycleNumber: 2,
          cycleRoute: MACRO_CYCLE_2,
          receivedFrom: "WEST",
          handoffTo: "CANVAS",
          westAuditObserved: true,
          westAuditAccepted: true,
          westCanvasReleaseApproved: true,
          canvasReleaseAuthorized: true
        });
      }

      bootCooperative({
        requireRelease: false,
        reason: routeAuthorized ? "route-authorized-preflight" : "direct-two-file-preflight"
      });

      publishGlobals();
      updateDataset();
    };

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", preflight, { once: true });
      } else {
        preflight();
      }
    } else {
      recordLocal("CANVAS_TWO_FILE_ASSETS_EXPRESSION_EXCHANGE_LOADED_WITHOUT_DOCUMENT", {
        file: FILE,
        contract: CONTRACT,
        receipt: RECEIPT
      });
    }
  } catch (error) {
    recordError("CANVAS_TWO_FILE_INITIALIZATION_FAILED", error);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
