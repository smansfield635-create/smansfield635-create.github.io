// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1
// Full-file replacement.
// Canvas Hub / visible-expression receiver / planetary view-control receiver only.
// Purpose:
// - Preserve the v12 Canvas Hub visible-expression stack.
// - Preserve downstream Composite, Hex Four-Pair Authority, Hex Surface Renderer, and finger-file awareness.
// - Recognize Route Conductor v9_7 as current.
// - Preserve v9_6, v9_5, and v9_4 route-conductor lineage/compatibility.
// - Add public Canvas receiver methods for controls.js planetary view-control packets.
// - Apply yaw, pitch, zoom, and phase view state to the visible canvas.
// - Redraw through existing public expression renderers when available.
// - Provide immediate CSS-level visible motion even when downstream renderers ignore view state.
// - Publish diagnostic-readable control packet intake, view state, canvas proof, and no-claim receipt.
// Preserve:
// - no terrain truth ownership
// - no hydrology truth ownership
// - no elevation truth ownership
// - no material truth ownership
// - no Composite truth ownership
// - no Hex Four-Pair truth ownership
// - no Hex Surface truth ownership
// - no Route Conductor authority
// - no diagnostic rail case authority
// - no F13 claim
// - no F21 claim
// - no ready text
// - no generated image
// - no GraphicBox
// - no WebGL
// - no final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const RECEIPT = "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT_v12_1";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT_v12";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT_v11_7";

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const CURRENT_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT_v9_7";

  const LINEAGE_ROUTE_CONDUCTOR_V9_6_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const LINEAGE_ROUTE_CONDUCTOR_V9_6_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_RECEIPT_v9_6";

  const LINEAGE_ROUTE_CONDUCTOR_V9_5_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const LINEAGE_ROUTE_CONDUCTOR_V9_5_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5";

  const LINEAGE_ROUTE_CONDUCTOR_V9_4_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const LINEAGE_ROUTE_CONDUCTOR_V9_4_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const HEX_FOUR_PAIR_CONTRACT = "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const HEX_SURFACE_CONTRACT = "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";

  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  const FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    mass: "/assets/hearth/hearth.canvas.finger.mass.js",
    surface: "/assets/hearth/hearth.canvas.finger.surface.js",
    light: "/assets/hearth/hearth.canvas.finger.light.js",
    inspect: "/assets/hearth/hearth.canvas.finger.inspect.js",
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js",
    composite: COMPOSITE_FILE
  });

  const FINGER_SEQUENCE = Object.freeze([
    "boundary",
    "mass",
    "surface",
    "light",
    "inspect",
    "landform",
    "elevation",
    "material",
    "hydrology",
    "atmosphere",
    "lighting",
    "composite"
  ]);

  const CANVAS_MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "main",
    "body"
  ]);

  const GLOBE_STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "[data-hearth-planet-engine-stage]"
  ]);

  const FINAL_FALSE = Object.freeze({
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByCanvasParent: false,
    f21Claimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    readyTextClaimed: false,
    downstreamReleaseClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const view = {
    yaw: 0,
    pitch: 0,
    zoom: 1,
    phase: 0,
    minPitch: -1.25,
    maxPitch: 1.25,
    minZoom: 0.55,
    maxZoom: 2.4,
    lastAppliedAt: ""
  };

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    indexFile: INDEX_FILE,
    routeFile: ROUTE_FILE,
    controlFile: CONTROL_FILE,
    role: "Canvas Hub / Planetary View Control Receiver",

    canvasHubLoaded: true,
    canvasHubActive: true,
    canvasLocalStationActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    threeFileStretchActive: true,
    planetaryViewControlReceiverActive: true,
    viewControlPacketReceiverReady: true,

    currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    routeConductorObserved: false,
    routeConductorContractKnown: false,
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorV97Recognized: false,
    routeConductorV96LineageAccepted: false,
    routeConductorV95LineageAccepted: false,
    routeConductorV94LineageAccepted: false,
    routeConductorAuthoritySourceName: "NONE",

    globeStageFound: false,
    globeStageSelector: "NONE",
    globeStageRectNonzero: false,
    canvasMountAttempted: false,
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasMountRectNonzero: false,
    canvasElementFound: false,
    canvasCreated: false,
    canvasReused: false,
    canvasId: "hearthCanvas",
    canvasRectNonzero: false,
    canvasAttributeWidth: 0,
    canvasAttributeHeight: 0,
    canvasContext2dReady: false,
    canvasDrawAttempted: false,
    canvasDrawComplete: false,
    canvasDrawError: "",
    holdingFieldDrawComplete: false,

    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "NOT_ATTEMPTED",
    renderedPlanetProofReady: false,
    domVisiblePlanetProofReady: false,
    stageMountDomProofReady: false,

    compositeFile: COMPOSITE_FILE,
    compositeDetected: false,
    compositeContract: "",
    compositeReceipt: "",
    compositeDrawMethodAvailable: false,
    compositeDrawMethod: "NONE",
    compositeDrawAttempted: false,
    compositeDrawComplete: false,
    compositeDrawReceipt: null,
    compositeDrawError: "",

    hexFourPairFile: HEX_FOUR_PAIR_FILE,
    hexFourPairAuthorityDetected: false,
    hexFourPairAuthorityContract: "",
    hexFourPairAuthorityContractRecognized: false,
    hexFourPairWideProbeAvailable: false,
    hexFourPairEveryPixelHasFourPairSet: false,
    hexFourPairBodyBound: false,
    hexFourPairAllowedToFloat: true,
    hexFourPairValidationReceipt: null,
    hexFourPairValidationError: "",

    hexSurfaceFile: HEX_SURFACE_FILE,
    hexSurfaceRendererDetected: false,
    hexSurfaceRendererContract: "",
    hexSurfaceRendererContractRecognized: false,
    hexSurfaceRendererDrawMethodAvailable: false,
    hexSurfaceRendererDrawMethod: "NONE",
    hexSurfaceRendererDrawAttempted: false,
    hexSurfaceRendererDrawComplete: false,
    hexSurfaceRendererFrameReceipt: null,
    hexSurfaceRendererDrawError: "",

    supportLoadAttempted: false,
    supportLoadComplete: false,
    supportLoadCompositeAttempted: false,
    supportLoadCompositeComplete: false,
    supportLoadHexFourPairAttempted: false,
    supportLoadHexFourPairComplete: false,
    supportLoadHexSurfaceAttempted: false,
    supportLoadHexSurfaceComplete: false,
    supportLoadErrors: [],

    fingerRegistry: {},
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,

    controlPacketCount: 0,
    controlPacketAcceptedCount: 0,
    controlPacketRejectedCount: 0,
    controlPacketLastAcceptedAt: "",
    controlPacketLastRejectedAt: "",
    controlPacketLastRejectionReason: "",
    controlPacketDeliveryStatus: "WAITING_CONTROL_PACKET",
    controlPacketDeliveryMethod: "NONE",
    controlPacketLastSource: "NONE",
    lastControlPacket: null,
    lastViewPacket: null,
    viewTransformApplied: false,
    viewTransformCss: "",
    viewRedrawScheduled: false,
    viewRedrawCount: 0,
    viewMotionStatus: "VIEW_CONTROL_RECEIVER_READY",
    touchRuntimeStatus: "WAITING_CONTROL_PACKET",
    dragRuntimeStatus: "WAITING_CONTROL_PACKET",
    zoomRuntimeStatus: "WAITING_CONTROL_PACKET",
    keyboardRuntimeStatus: "WAITING_CONTROL_PACKET",
    planetaryViewInputStatus: "CANVAS_VIEW_RECEIVER_READY",

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "VISIBLE_EXPRESSION_NOT_ATTEMPTED",
    f13StrictEvidenceRepairTarget: FILE,

    firstFailedCoordinate: "VISIBLE_EXPRESSION_NOT_ATTEMPTED",
    recommendedNextFile: FILE,
    recommendedNextAction: "RUN_CANVAS_HUB",
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_NOT_STARTED",

    routeConductorReleasePacket: null,
    routeConductorReleasePacketObserved: false,
    routeConductorNotified: false,
    routeConductorNotifyMethod: "NONE",

    localEvents: [],
    errors: [],
    bootAuditComplete: false,

    ...FINAL_FALSE
  };

  let redrawTimer = 0;
  let supportLoadPromise = null;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
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
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) array.splice(0, array.length - max);
  }

  function record(event, detail = {}) {
    const item = { at: nowIso(), event: safeString(event, "CANVAS_HUB_EVENT"), detail: clonePlain(detail) };
    state.localEvents.push(item);
    trimArray(state.localEvents, 220);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_HUB_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };
    state.errors.push(item);
    trimArray(state.errors, 120);
    state.updatedAt = item.at;
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;
    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }
    return cursor || null;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function contractOf(value) {
    if (!isObject(value)) return "";
    return safeString(value.contract || value.CONTRACT || value.currentContract || value.sourceContract || "");
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";
    return safeString(value.receipt || value.RECEIPT || value.currentReceipt || value.sourceReceipt || "");
  }

  function safeInvoke(target, method, args = []) {
    if (!target || !isFunction(target[method])) return { ok: false, value: null, error: `method-unavailable:${method}` };
    try {
      return { ok: true, value: target[method](...(Array.isArray(args) ? args : [args])), error: "" };
    } catch (error) {
      return { ok: false, value: null, error: error && error.message ? String(error.message) : String(error) };
    }
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubReceipt",
      "getCanvasExpressionHubReceipt",
      "getCarrierReceipt",
      "readStructuralCarrier",
      "getStructuralCarrier",
      "getCanvasCarrier",
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;
      const result = safeInvoke(authority, method);
      if (result.ok && isObject(result.value)) return result.value;
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function firstElement(selectors) {
    if (!doc) return { element: null, selector: "NONE" };
    for (const selector of selectors) {
      try {
        const element = doc.querySelector(selector);
        if (element) return { element, selector };
      } catch (_error) {}
    }
    return { element: null, selector: "NONE" };
  }

  function rectNonzero(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) return false;
    try {
      const rect = element.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    } catch (_error) {
      return false;
    }
  }

  function choosePixelSize(container) {
    let cssWidth = 720;

    if (container && isFunction(container.getBoundingClientRect)) {
      try {
        const rect = container.getBoundingClientRect();
        if (rect && rect.width > 0) cssWidth = rect.width;
      } catch (_error) {}
    }

    if ((!cssWidth || cssWidth < 260) && root.innerWidth) {
      cssWidth = Math.min(800, Math.max(320, root.innerWidth * 0.9));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1280, Math.round(cssWidth * ratio)));
  }

  function findCanvasElement(mount, stage) {
    if (!doc) return null;

    const direct = doc.getElementById(state.canvasId);
    if (direct && direct.tagName && direct.tagName.toLowerCase() === "canvas") return direct;

    const selectors = [
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-base-globe-canvas='true']",
      "canvas[data-hearth-planet-canvas='true']",
      "canvas"
    ];

    for (const selector of selectors) {
      try {
        const found =
          (mount && mount.querySelector ? mount.querySelector(selector) : null) ||
          (stage && stage.querySelector ? stage.querySelector(selector) : null);
        if (found && found.tagName && found.tagName.toLowerCase() === "canvas") return found;
      } catch (_error) {}
    }

    return null;
  }

  function sizeCanvas(canvas, mount) {
    const px = choosePixelSize(mount);

    if (canvas.width !== px) canvas.width = px;
    if (canvas.height !== px) canvas.height = px;

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "min(88vw, 760px)";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(5,18,42,.92), rgba(0,0,0,.98))";
    canvas.style.boxSizing = "border-box";
    canvas.style.transformOrigin = "50% 50%";
    canvas.style.willChange = "transform";
    canvas.style.touchAction = "none";
  }

  function applyCanvasViewTransform() {
    const canvas = state.canvasElement;
    if (!canvas || !canvas.style) return false;

    const rotate = safeNumber(view.yaw, 0);
    const zoom = clamp(safeNumber(view.zoom, 1), view.minZoom, view.maxZoom);
    const pitch = clamp(safeNumber(view.pitch, 0), view.minPitch, view.maxPitch);
    const shift = Math.round(pitch * 18);

    const css = `rotate(${rotate}rad) translateY(${shift}px) scale(${zoom})`;
    canvas.style.transform = css;

    canvas.dataset.hearthViewYaw = String(view.yaw);
    canvas.dataset.hearthViewPitch = String(view.pitch);
    canvas.dataset.hearthViewZoom = String(view.zoom);
    canvas.dataset.hearthViewPhase = String(view.phase);
    canvas.dataset.hearthViewTransformApplied = "true";

    state.viewTransformApplied = true;
    state.viewTransformCss = css;
    view.lastAppliedAt = nowIso();

    return true;
  }

  function ensureCanvas() {
    state.canvasMountAttempted = true;

    if (!doc) {
      state.canvasMountFound = false;
      state.canvasElementFound = false;
      state.canvasDrawError = "DOCUMENT_NOT_AVAILABLE";
      return null;
    }

    const stageResult = firstElement(GLOBE_STAGE_SELECTORS);
    const mountResult = firstElement(CANVAS_MOUNT_SELECTORS);
    const stage = stageResult.element;
    const mount = mountResult.element || stage;

    state.globeStageFound = Boolean(stage);
    state.globeStageSelector = stageResult.selector;
    state.globeStageRectNonzero = rectNonzero(stage);

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;
    state.canvasMountRectNonzero = rectNonzero(mount);

    state.stageMountDomProofReady = Boolean(
      (state.globeStageFound && state.globeStageRectNonzero) ||
      (state.canvasMountFound && state.canvasMountRectNonzero)
    );
    state.domVisiblePlanetProofReady = state.stageMountDomProofReady;

    if (!mount) {
      state.canvasElementFound = false;
      state.firstFailedCoordinate = "CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_HEARTH_HTML_MOUNT";
      return null;
    }

    let canvas = findCanvasElement(mount, stage);

    if (canvas) {
      state.canvasReused = true;
      state.canvasCreated = false;
    } else {
      canvas = doc.createElement("canvas");
      canvas.id = state.canvasId;
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-contract", CONTRACT);
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");

      if (mount.firstChild) mount.insertBefore(canvas, mount.firstChild);
      else mount.appendChild(canvas);

      state.canvasCreated = true;
      state.canvasReused = false;
    }

    sizeCanvas(canvas, mount);

    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthPlanetaryViewControlReceiverActive = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null;

    state.canvasElementFound = true;
    state.canvasRectNonzero = rectNonzero(canvas) || Boolean(canvas.width > 0 && canvas.height > 0);
    state.canvasAttributeWidth = safeNumber(canvas.width, 0);
    state.canvasAttributeHeight = safeNumber(canvas.height, 0);
    state.canvasContext2dReady = Boolean(ctx);
    state.canvasElement = canvas;
    state.canvasContext = ctx;
    state.canvasMountElement = mount;
    state.globeStageElement = stage;

    applyCanvasViewTransform();

    return { canvas, ctx, mount, stage };
  }

  function canvasHasVisiblePixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) return false;

    try {
      const w = canvas.width;
      const h = canvas.height;
      const sampleSize = Math.max(1, Math.min(24, Math.floor(Math.min(w, h) / 32)));
      const x = Math.max(0, Math.floor(w / 2 - sampleSize / 2));
      const y = Math.max(0, Math.floor(h / 2 - sampleSize / 2));
      const data = ctx.getImageData(x, y, sampleSize, sampleSize).data;

      for (let index = 0; index < data.length; index += 4) {
        if (data[index + 3] > 0 && (data[index] > 3 || data[index + 1] > 3 || data[index + 2] > 3)) return true;
      }
    } catch (_error) {
      return true;
    }

    return false;
  }

  function drawHoldingField(canvas, ctx, reason) {
    if (!canvas || !ctx) return false;

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 720;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.38;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.62);
      bg.addColorStop(0, "rgba(18,42,74,0.82)");
      bg.addColorStop(0.58, "rgba(7,12,28,0.96)");
      bg.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const spin = safeNumber(view.phase, 0) + safeNumber(view.yaw, 0);
      const lightX = cx - Math.cos(spin) * r * 0.28;
      const lightY = cy - r * 0.33 + Math.sin(safeNumber(view.pitch, 0)) * r * 0.08;

      const globe = ctx.createRadialGradient(lightX, lightY, r * 0.05, cx, cy, r);
      globe.addColorStop(0, "rgba(108,192,244,0.94)");
      globe.addColorStop(0.34, "rgba(28,86,144,0.90)");
      globe.addColorStop(0.76, "rgba(7,28,76,0.98)");
      globe.addColorStop(1, "rgba(1,6,24,1)");

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = globe;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.985, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = "rgba(186,226,255,0.18)";
      ctx.lineWidth = Math.max(1, r * 0.006);

      for (let i = -3; i <= 3; i += 1) {
        const y = cy + (i / 4) * r * 0.76 + Math.sin(spin + i) * r * 0.025;
        ctx.beginPath();
        ctx.ellipse(cx, y, r * 0.92, r * 0.13, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 7; i += 1) {
        const x = cx + Math.sin(spin + i) * r * 0.72;
        ctx.beginPath();
        ctx.ellipse(x, cy, r * 0.14, r * 0.94, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      ctx.strokeStyle = "rgba(186,226,255,0.56)";
      ctx.lineWidth = Math.max(1, r * 0.012);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.62)";
      ctx.font = `${Math.max(11, Math.floor(w / 58))}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Canvas Hub holding field", cx, h - Math.max(22, h * 0.055));

      if (reason) {
        ctx.fillStyle = "rgba(255,255,255,0.42)";
        ctx.font = `${Math.max(10, Math.floor(w / 72))}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.fillText(String(reason).slice(0, 70), cx, h - Math.max(10, h * 0.028));
      }

      state.holdingFieldDrawComplete = true;
      applyCanvasViewTransform();
      return true;
    } catch (error) {
      state.holdingFieldDrawComplete = false;
      recordError("HOLDING_FIELD_DRAW_FAILED", error);
      return false;
    }
  }

  function routeConductorCandidates() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR", readPath("HEARTH_ROUTE_CONDUCTOR")],
      ["HEARTH.routeConductor", readPath("HEARTH.routeConductor")],
      ["DEXTER_LAB.hearthRouteConductor", readPath("DEXTER_LAB.hearthRouteConductor")],
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION")],
      ["HEARTH.routeConductorControlHandshakeIntegration", readPath("HEARTH.routeConductorControlHandshakeIntegration")],
      ["HEARTH_ROUTE_CONDUCTOR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_RECEIPT")],
      ["HEARTH.routeConductorReceipt", readPath("HEARTH.routeConductorReceipt")],
      ["HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION", readPath("HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT")]
    ];
  }

  function readContractPair(candidate) {
    const receipt = readReceipt(candidate) || (isObject(candidate) ? candidate : null);
    return {
      contract: contractOf(receipt || candidate),
      receipt: receiptOf(receipt || candidate),
      body: receipt
    };
  }

  function readRouteConductorProfile() {
    let observed = false;
    let contract = "";
    let receipt = "";
    let sourceName = "NONE";

    for (const [name, candidate] of routeConductorCandidates()) {
      if (!candidate) continue;
      observed = true;

      const pair = readContractPair(candidate);
      if (!contract && pair.contract) contract = pair.contract;
      if (!receipt && pair.receipt) receipt = pair.receipt;

      if (pair.contract === CURRENT_ROUTE_CONDUCTOR_CONTRACT || pair.receipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT) {
        contract = pair.contract || CURRENT_ROUTE_CONDUCTOR_CONTRACT;
        receipt = pair.receipt || CURRENT_ROUTE_CONDUCTOR_RECEIPT;
        sourceName = name;
        break;
      }

      if (sourceName === "NONE") sourceName = name;
    }

    const datasetContract =
      datasetValue("hearthRouteConductorContract") ||
      datasetValue("hearthRouteConductorCurrentContract") ||
      datasetValue("routeConductorCurrentContract") ||
      datasetValue("routeConductorContract") ||
      datasetValue("hearthSouthJsRouteConductorContract");

    if (datasetContract && !contract) contract = datasetContract;
    if (datasetContract) observed = true;

    state.routeConductorObserved = observed;
    state.routeConductorContractKnown = Boolean(contract);
    state.routeConductorContract = contract || "";
    state.routeConductorReceipt = receipt || "";
    state.routeConductorV97Recognized = contract === CURRENT_ROUTE_CONDUCTOR_CONTRACT || receipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT;
    state.routeConductorV96LineageAccepted = contract === LINEAGE_ROUTE_CONDUCTOR_V9_6_CONTRACT || receipt === LINEAGE_ROUTE_CONDUCTOR_V9_6_RECEIPT;
    state.routeConductorV95LineageAccepted =
      contract === LINEAGE_ROUTE_CONDUCTOR_V9_5_CONTRACT ||
      receipt === LINEAGE_ROUTE_CONDUCTOR_V9_5_RECEIPT ||
      datasetValue("routeConductorLineageV95Contract") === LINEAGE_ROUTE_CONDUCTOR_V9_5_CONTRACT;
    state.routeConductorV94LineageAccepted =
      contract === LINEAGE_ROUTE_CONDUCTOR_V9_4_CONTRACT ||
      receipt === LINEAGE_ROUTE_CONDUCTOR_V9_4_RECEIPT ||
      datasetValue("routeConductorLineageContract") === LINEAGE_ROUTE_CONDUCTOR_V9_4_CONTRACT;
    state.routeConductorAuthoritySourceName = sourceName;

    return {
      observed,
      contract,
      receipt,
      routeConductorV97Recognized: state.routeConductorV97Recognized,
      routeConductorV96LineageAccepted: state.routeConductorV96LineageAccepted,
      routeConductorV95LineageAccepted: state.routeConductorV95LineageAccepted,
      routeConductorV94LineageAccepted: state.routeConductorV94LineageAccepted,
      sourceName
    };
  }

  function compositeSources() {
    return [
      ["HEARTH_CANVAS_FINGER_COMPOSITE", readPath("HEARTH_CANVAS_FINGER_COMPOSITE")],
      ["HEARTH_CANVAS_COMPOSITE_FINGER", readPath("HEARTH_CANVAS_COMPOSITE_FINGER")],
      ["HEARTH_CANVAS_COMPOSITE", readPath("HEARTH_CANVAS_COMPOSITE")],
      ["HEARTH.canvasFingerComposite", readPath("HEARTH.canvasFingerComposite")],
      ["HEARTH.canvasCompositeFinger", readPath("HEARTH.canvasCompositeFinger")],
      ["HEARTH.canvasComposite", readPath("HEARTH.canvasComposite")],
      ["DEXTER_LAB.hearthCanvasFingerComposite", readPath("DEXTER_LAB.hearthCanvasFingerComposite")],
      ["DEXTER_LAB.hearthCanvasCompositeFinger", readPath("DEXTER_LAB.hearthCanvasCompositeFinger")],
      ["DEXTER_LAB.hearthCanvasComposite", readPath("DEXTER_LAB.hearthCanvasComposite")]
    ];
  }

  function hexFourPairSources() {
    return [
      ["HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY", readPath("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY")],
      ["HEARTH_HEX_FOUR_PAIR_AUTHORITY", readPath("HEARTH_HEX_FOUR_PAIR_AUTHORITY")],
      ["HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY", readPath("HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY")],
      ["HEARTH_HEX_HANDSHAKE_AUTHORITY", readPath("HEARTH_HEX_HANDSHAKE_AUTHORITY")],
      ["HEARTH_HEXGRID_AUTHORITY", readPath("HEARTH_HEXGRID_AUTHORITY")],
      ["HEARTH.hexFourPairAuthority", readPath("HEARTH.hexFourPairAuthority")],
      ["HEARTH.hexAuthority", readPath("HEARTH.hexAuthority")]
    ];
  }

  function hexSurfaceSources() {
    return [
      ["HEARTH_HEX_SURFACE", readPath("HEARTH_HEX_SURFACE")],
      ["HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER", readPath("HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER")],
      ["HEARTH.hexSurface", readPath("HEARTH.hexSurface")],
      ["HEARTH.hexSurfaceConsumer", readPath("HEARTH.hexSurfaceConsumer")]
    ];
  }

  function findDrawMethod(target, methods) {
    if (!target || !isObject(target)) return "NONE";
    for (const method of methods) {
      if (isFunction(target[method])) return method;
    }
    return "NONE";
  }

  function detectComposite() {
    let found = null;
    let sourceName = "NONE";

    for (const [name, candidate] of compositeSources()) {
      if (!candidate || !isObject(candidate)) continue;
      found = candidate;
      sourceName = name;
      break;
    }

    const receipt = readReceipt(found);
    const method = findDrawMethod(found, [
      "drawHearthCompositeFrame",
      "drawCompositeFrame",
      "drawFrame",
      "renderComposite",
      "render",
      "draw",
      "compose"
    ]);

    state.compositeDetected = Boolean(found);
    state.compositeContract = contractOf(receipt || found);
    state.compositeReceipt = receiptOf(receipt || found);
    state.compositeDrawMethodAvailable = Boolean(found && method !== "NONE");
    state.compositeDrawMethod = method;
    state.compositeSourceName = sourceName;

    if (state.fingerRegistry.composite) {
      state.fingerRegistry.composite.authorityObserved = Boolean(found);
      state.fingerRegistry.composite.apiReady = Boolean(found && method !== "NONE");
      state.fingerRegistry.composite.trackReady = Boolean(found);
      state.fingerRegistry.composite.status = found ? "TRACK_READY" : "DECLARED_WAITING_FILE";
      state.fingerRegistry.composite.firstGap = found ? "NONE" : "WAITING_DOWNSTREAM_FINGER_FILE";
    }

    return { api: found, receipt, method, sourceName };
  }

  function detectHexFourPairAuthority() {
    let found = null;
    let sourceName = "NONE";

    for (const [name, candidate] of hexFourPairSources()) {
      if (!candidate || !isObject(candidate)) continue;
      found = candidate;
      sourceName = name;
      break;
    }

    const receipt = readReceipt(found);
    const actualContract = contractOf(receipt || found);
    let wideProbeAvailable = false;
    let everyPixelHasFourPairSet = false;
    let bodyBound = false;
    let allowedToFloat = true;
    let validationReceipt = null;
    let validationError = "";

    try {
      if (found && isFunction(found.sample)) {
        const sample = found.sample({ u: 0.5, v: 0.5 });
        everyPixelHasFourPairSet = Boolean(sample && sample.everyPixelHasFourPairSet === true);
        bodyBound = Boolean(sample && (sample.bodyBound === true || sample.surfaceBound === true));
        allowedToFloat = sample ? sample.allowedToFloat !== false : true;
      }

      if (found && isFunction(found.wideProbe)) {
        wideProbeAvailable = true;
        validationReceipt = found.wideProbe({ rows: 5, columns: 9 });
        if (validationReceipt && validationReceipt.everyPixelHasFourPairSet === true) everyPixelHasFourPairSet = true;
        if (validationReceipt && validationReceipt.failedCount === 0) {
          bodyBound = true;
          allowedToFloat = false;
        }
      }
    } catch (error) {
      validationError = error && error.message ? String(error.message) : String(error);
      recordError("HEX_FOUR_PAIR_VALIDATION_FAILED", error);
    }

    state.hexFourPairAuthorityDetected = Boolean(found);
    state.hexFourPairAuthorityContract = actualContract;
    state.hexFourPairAuthorityContractRecognized = actualContract === HEX_FOUR_PAIR_CONTRACT;
    state.hexFourPairWideProbeAvailable = wideProbeAvailable;
    state.hexFourPairEveryPixelHasFourPairSet = everyPixelHasFourPairSet;
    state.hexFourPairBodyBound = bodyBound;
    state.hexFourPairAllowedToFloat = allowedToFloat;
    state.hexFourPairValidationReceipt = validationReceipt ? clonePlain(validationReceipt) : null;
    state.hexFourPairValidationError = validationError;
    state.hexFourPairSourceName = sourceName;

    return { api: found, receipt, sourceName };
  }

  function detectHexSurfaceRenderer() {
    let found = null;
    let sourceName = "NONE";

    for (const [name, candidate] of hexSurfaceSources()) {
      if (!candidate || !isObject(candidate)) continue;
      found = candidate;
      sourceName = name;
      break;
    }

    const receipt = readReceipt(found);
    const actualContract = contractOf(receipt || found);
    const method = findDrawMethod(found, [
      "drawHearthHexSurfaceFrame",
      "drawFrame",
      "render",
      "draw"
    ]);

    state.hexSurfaceRendererDetected = Boolean(found);
    state.hexSurfaceRendererContract = actualContract;
    state.hexSurfaceRendererContractRecognized = actualContract === HEX_SURFACE_CONTRACT;
    state.hexSurfaceRendererDrawMethodAvailable = Boolean(found && method !== "NONE");
    state.hexSurfaceRendererDrawMethod = method;
    state.hexSurfaceRendererSourceName = sourceName;

    return { api: found, receipt, method, sourceName };
  }

  function normalizeFingerKey(value) {
    const raw = safeString(value).trim().toLowerCase();
    if (!raw) return "";
    if (FINGER_FILES[raw]) return raw;
    if (raw.includes("boundary") || raw.includes("shape")) return "boundary";
    if (raw.includes("mass") || raw.includes("body")) return "mass";
    if (raw.includes("surface")) return "surface";
    if (raw === "light" || raw.includes("base-light")) return "light";
    if (raw.includes("inspect")) return "inspect";
    if (raw.includes("landform") || raw.includes("landmass")) return "landform";
    if (raw.includes("elevation") || raw.includes("relief") || raw.includes("height")) return "elevation";
    if (raw.includes("material")) return "material";
    if (raw.includes("hydrology") || raw.includes("water")) return "hydrology";
    if (raw.includes("atmosphere") || raw.includes("air")) return "atmosphere";
    if (raw.includes("lighting") || raw.includes("shadow")) return "lighting";
    if (raw.includes("composite") || raw.includes("carrier")) return "composite";
    return raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function createFingerTrack(key) {
    const normalizedKey = normalizeFingerKey(key);
    return {
      key: normalizedKey,
      file: FINGER_FILES[normalizedKey] || "",
      declared: true,
      authorityObserved: false,
      apiReady: false,
      expressionPacketReceived: false,
      receiptPacketReceived: false,
      trackReady: false,
      hardFail: false,
      status: "DECLARED_WAITING_FILE",
      firstGap: "WAITING_DOWNSTREAM_FINGER_FILE",
      ownsTruth: false,
      ownedByCanvasHub: false,
      canvasHubManagesTrack: true,
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };
  }

  function initializeFingerRegistry() {
    for (const key of FINGER_SEQUENCE) {
      if (!state.fingerRegistry[key]) state.fingerRegistry[key] = createFingerTrack(key);
    }
    return state.fingerRegistry;
  }

  function inferFingerKeyFromPacket(packet) {
    if (!isObject(packet)) return "";

    const direct = normalizeFingerKey(
      packet.fingerKey ||
      packet.canvasFingerKey ||
      packet.trackKey ||
      packet.channelKey ||
      packet.finger ||
      packet.track ||
      ""
    );

    if (direct) return direct;

    const file = safeString(packet.file || packet.sourceFile || packet.targetFile || packet.destinationFile || "");
    for (const key of FINGER_SEQUENCE) {
      if (file === FINGER_FILES[key] || file.includes(`finger.${key}`)) return key;
    }

    return normalizeFingerKey(packet.role || packet.sourceRole || packet.childRole || packet.packetType || "");
  }

  function hasFinalClaim(packet) {
    if (!isObject(packet)) return false;
    return Boolean(
      packet.finalPageProof === true ||
      packet.finalRouteProof === true ||
      packet.finalVisualPass === true ||
      packet.visualPassClaimed === true ||
      packet.readyTextAllowed === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21SubmittedToNorth === true ||
      packet.completionLatched === true ||
      packet.finalCompletionLatched === true ||
      packet.degradedCompletionLatched === true ||
      safeString(packet.proofScope).toUpperCase().includes("FINAL") ||
      safeString(packet.scope).toUpperCase().includes("FINAL") ||
      safeString(packet.claimScope).toUpperCase().includes("FINAL")
    );
  }

  function packetHasExpressionContent(packet) {
    if (!isObject(packet)) return false;
    return Boolean(
      packet.expressionPacket ||
      packet.expressionPayload ||
      packet.canvasExpressionPacket ||
      packet.boundaryPacket ||
      packet.massPacket ||
      packet.surfacePacket ||
      packet.lightPacket ||
      packet.samples ||
      packet.vertices ||
      packet.cells ||
      packet.atlas ||
      packet.texture ||
      packet.heightfield ||
      packet.materialMap ||
      packet.waterMap ||
      packet.lightMap ||
      packet.compositeMap ||
      safeString(packet.packetLane).toUpperCase().includes("EXPRESSION") ||
      safeString(packet.packetType).toUpperCase().includes("EXPRESSION")
    );
  }

  function packetHasReceiptContent(packet) {
    if (!isObject(packet)) return false;
    return Boolean(
      packet.receipt ||
      packet.RECEIPT ||
      packet.contract ||
      packet.CONTRACT ||
      packet.status ||
      packet.firstFailedCoordinate ||
      packet.recommendedNextFile ||
      packet.packetType ||
      safeString(packet.packetLane).toUpperCase().includes("RECEIPT") ||
      safeString(packet.packetType).toUpperCase().includes("RECEIPT")
    );
  }

  function readFingerAuthority(key) {
    const normalizedKey = normalizeFingerKey(key);
    const camel = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
    const upper = normalizedKey.toUpperCase();

    const names = [
      `HEARTH_CANVAS_FINGER_${upper}`,
      `HEARTH_CANVAS_${upper}_FINGER`,
      `HEARTH.canvasFinger${camel}`,
      `HEARTH.canvas${camel}Finger`,
      `DEXTER_LAB.hearthCanvasFinger${camel}`,
      `DEXTER_LAB.hearthCanvas${camel}Finger`
    ];

    for (const name of names) {
      const authority = readPath(name);
      if (authority) return { name, authority };
    }

    return { name: "NONE", authority: null };
  }

  function scanFinger(key) {
    initializeFingerRegistry();

    const normalizedKey = normalizeFingerKey(key);
    const track = state.fingerRegistry[normalizedKey] || createFingerTrack(normalizedKey);
    const source = readFingerAuthority(normalizedKey);
    const authority = source.authority;
    const receipt = readReceipt(authority);

    const authorityObserved = Boolean(authority);
    const apiReady = Boolean(
      authority &&
      (
        isFunction(authority.receiveHubPacket) ||
        isFunction(authority.receiveFingerPacket) ||
        isFunction(authority.receiveCanvasHubPacket) ||
        isFunction(authority.read) ||
        isFunction(authority.getReceipt) ||
        isFunction(authority.getReceiptLight) ||
        isFunction(authority.draw) ||
        isFunction(authority.render) ||
        isFunction(authority.drawFrame)
      )
    ) || safeBool(receipt && (receipt.apiReady || receipt.fingerApiReady || receipt.canvasFingerApiReady), false);

    const hardFail = Boolean(
      safeBool(receipt && (receipt.hardFail || receipt.fingerHardFail || receipt.canvasFingerHardFail), false) ||
      hasFinalClaim(receipt)
    );

    const expressionPacketReceived = Boolean(track.expressionPacketReceived || packetHasExpressionContent(receipt));
    const receiptPacketReceived = Boolean(track.receiptPacketReceived || packetHasReceiptContent(receipt));
    const trackReady = Boolean(apiReady || expressionPacketReceived || receiptPacketReceived || authorityObserved) && !hardFail;

    state.fingerRegistry[normalizedKey] = {
      ...track,
      authorityObserved,
      apiReady,
      expressionPacketReceived,
      receiptPacketReceived,
      trackReady,
      hardFail,
      status: hardFail ? "HARD_FAIL" : trackReady ? "TRACK_READY" : authorityObserved ? "AUTHORITY_OBSERVED" : "DECLARED_WAITING_FILE",
      lastAuthoritySourceName: source.name,
      lastReceiptPacket: receipt ? clonePlain(receipt) : track.lastReceiptPacket || null,
      firstGap: hardFail ? "FINGER_HARD_FAIL" : trackReady ? "NONE" : "WAITING_DOWNSTREAM_FINGER_FILE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    return clonePlain(state.fingerRegistry[normalizedKey]);
  }

  function scanAllFingers() {
    initializeFingerRegistry();
    for (const key of FINGER_SEQUENCE) scanFinger(key);
    recomputeFingerAggregation();
    return getFingerRegistry();
  }

  function recomputeFingerAggregation() {
    initializeFingerRegistry();

    const tracks = FINGER_SEQUENCE.map((key) => state.fingerRegistry[key]).filter(Boolean);
    state.fingerAuthorityObservedCount = tracks.filter((track) => track.authorityObserved).length;
    state.fingerApiReadyCount = tracks.filter((track) => track.apiReady).length;
    state.fingerExpressionPacketCount = tracks.filter((track) => track.expressionPacketReceived).length;
    state.fingerReceiptPacketCount = tracks.filter((track) => track.receiptPacketReceived).length;
    state.fingerTrackReadyCount = tracks.filter((track) => track.trackReady).length;
    state.fingerHardFailCount = tracks.filter((track) => track.hardFail).length;

    return getFingerRegistry();
  }

  function getFingerRegistry() {
    initializeFingerRegistry();
    return clonePlain(state.fingerRegistry);
  }

  function getFingerTrackStatus(key) {
    const normalizedKey = normalizeFingerKey(key);
    if (!normalizedKey) return null;
    return clonePlain(state.fingerRegistry[normalizedKey] || createFingerTrack(normalizedKey));
  }

  function receiveFingerPacket(packet = {}) {
    initializeFingerRegistry();

    if (!isObject(packet)) return false;

    const key = inferFingerKeyFromPacket(packet);
    if (!key) {
      recordError("FINGER_PACKET_REJECTED_NO_KEY", "No finger key could be inferred", { packet });
      return false;
    }

    if (!state.fingerRegistry[key]) state.fingerRegistry[key] = createFingerTrack(key);

    const track = state.fingerRegistry[key];
    const finalClaimBlocked = hasFinalClaim(packet);
    const expressionContent = packetHasExpressionContent(packet);
    const receiptContent = packetHasReceiptContent(packet);

    state.fingerRegistry[key] = {
      ...track,
      lastPacket: clonePlain(packet),
      authorityObserved: true,
      apiReady: true,
      hardFail: Boolean(track.hardFail || packet.hardFail === true || packet.fingerHardFail === true || finalClaimBlocked),
      expressionPacketReceived: Boolean(track.expressionPacketReceived || expressionContent),
      receiptPacketReceived: Boolean(track.receiptPacketReceived || receiptContent),
      lastExpressionPacket: expressionContent ? clonePlain(packet) : track.lastExpressionPacket || null,
      lastReceiptPacket: receiptContent ? clonePlain(packet) : track.lastReceiptPacket || null,
      trackReady: Boolean(!finalClaimBlocked && (expressionContent || receiptContent || track.trackReady)),
      status: finalClaimBlocked ? "HARD_FAIL" : "TRACK_READY",
      firstGap: finalClaimBlocked ? "FINGER_FALSE_FINAL_CLAIM_BLOCKED" : "NONE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    recomputeFingerAggregation();
    scheduleViewRedraw("finger-packet-received");
    updateDataset();
    publishGlobals();

    return getExpressionHubSummary();
  }

  function receiveExpressionFingerPacket(packet = {}) {
    return receiveFingerPacket({ ...packet, packetLane: "EXPRESSION" });
  }

  function receiveFingerReceipt(packet = {}) {
    return receiveFingerPacket({ ...packet, packetLane: "RECEIPT" });
  }

  function receiveCanvasFingerPacket(packet = {}) {
    return receiveFingerPacket(packet);
  }

  function receiveCanvasExpressionPacket(packet = {}) {
    return receiveExpressionFingerPacket(packet);
  }

  function receiveCanvasFingerReceipt(packet = {}) {
    return receiveFingerReceipt(packet);
  }

  function refreshSupportDetections() {
    detectComposite();
    detectHexFourPairAuthority();
    detectHexSurfaceRenderer();
    scanAllFingers();
    return true;
  }

  function buildDrawState(canvas, ctx, mount, stage, mode) {
    return {
      canvas,
      ctx,
      context: ctx,
      mount,
      stage,
      mode,
      source: "Canvas Hub",
      contract: CONTRACT,
      receipt: RECEIPT,
      route: ROUTE,
      file: FILE,
      viewState: clonePlain(view),
      yaw: view.yaw,
      pitch: view.pitch,
      zoom: view.zoom,
      phase: view.phase,
      hexFourPairAuthority: detectHexFourPairAuthority().api,
      hexSurfaceRenderer: detectHexSurfaceRenderer().api,
      canvasHub: api,
      getReceipt: getReceiptLight,
      ...FINAL_FALSE
    };
  }

  function attemptCompositeDraw(canvas, ctx, mount, stage) {
    const detected = detectComposite();
    state.compositeDrawAttempted = Boolean(detected.api && detected.method !== "NONE");

    if (!detected.api || detected.method === "NONE") {
      state.compositeDrawComplete = false;
      state.compositeDrawError = detected.api ? "COMPOSITE_DRAW_METHOD_UNAVAILABLE" : "COMPOSITE_NOT_DETECTED";
      return false;
    }

    const drawState = buildDrawState(canvas, ctx, mount, stage, "COMPOSITE");
    const result = safeInvoke(detected.api, detected.method, [drawState, {
      source: "Canvas Hub",
      contract: CONTRACT,
      receipt: RECEIPT,
      preferredVisibleExpression: true,
      viewState: clonePlain(view),
      finalVisualPassClaimed: false,
      visualPassClaimed: false
    }]);

    if (!result.ok) {
      state.compositeDrawComplete = false;
      state.compositeDrawError = result.error;
      recordError("COMPOSITE_DRAW_FAILED", result.error, { method: detected.method });
      return false;
    }

    const receipt = isObject(result.value) ? result.value : readReceipt(detected.api);
    const explicitFail = isObject(receipt) && (
      receipt.drawComplete === false ||
      receipt.compositeDrawComplete === false ||
      receipt.visiblePlanetProofReady === false ||
      receipt.hardFail === true
    );

    const pixelEvidence = canvasHasVisiblePixels(canvas, ctx);

    state.compositeDrawReceipt = receipt ? clonePlain(receipt) : null;
    state.compositeDrawComplete = Boolean(!explicitFail && (pixelEvidence || result.value !== false));
    state.compositeDrawError = state.compositeDrawComplete ? "" : "COMPOSITE_DRAW_DID_NOT_PRODUCE_VISIBLE_PIXEL_EVIDENCE";

    if (state.compositeDrawComplete) {
      state.visiblePlanetProofReady = true;
      state.renderedPlanetProofReady = true;
      state.visiblePlanetProofSource = "COMPOSITE";
      state.visiblePlanetProofReason = "COMPOSITE_DRAW_COMPLETE";
      state.canvasDrawComplete = true;
      applyCanvasViewTransform();
      return true;
    }

    return false;
  }

  function attemptHexSurfaceDraw(canvas, ctx, mount, stage) {
    detectHexFourPairAuthority();

    const detected = detectHexSurfaceRenderer();
    state.hexSurfaceRendererDrawAttempted = Boolean(detected.api && detected.method !== "NONE");

    if (!detected.api || detected.method === "NONE") {
      state.hexSurfaceRendererDrawComplete = false;
      state.hexSurfaceRendererDrawError = detected.api ? "HEX_SURFACE_RENDERER_DRAW_METHOD_UNAVAILABLE" : "HEX_SURFACE_RENDERER_NOT_DETECTED";
      return false;
    }

    const drawState = buildDrawState(canvas, ctx, mount, stage, "HEX_SURFACE_RENDERER");
    const result = safeInvoke(detected.api, detected.method, [drawState, {
      source: "Canvas Hub",
      contract: CONTRACT,
      receipt: RECEIPT,
      supportVisibleExpression: true,
      viewState: clonePlain(view),
      finalVisualPassClaimed: false,
      visualPassClaimed: false
    }]);

    if (!result.ok) {
      state.hexSurfaceRendererDrawComplete = false;
      state.hexSurfaceRendererDrawError = result.error;
      recordError("HEX_SURFACE_RENDERER_DRAW_FAILED", result.error, { method: detected.method });
      return false;
    }

    const receipt = isObject(result.value) ? result.value : readReceipt(detected.api);
    const explicitFail = isObject(receipt) && (
      receipt.ok === false ||
      receipt.drawComplete === false ||
      receipt.hexSurfaceRendererDrawComplete === false ||
      receipt.hardFail === true
    );

    const pixelEvidence = canvasHasVisiblePixels(canvas, ctx);

    state.hexSurfaceRendererFrameReceipt = receipt ? clonePlain(receipt) : null;
    state.hexSurfaceRendererDrawComplete = Boolean(!explicitFail && (pixelEvidence || result.value !== false));
    state.hexSurfaceRendererDrawError = state.hexSurfaceRendererDrawComplete ? "" : "HEX_SURFACE_RENDERER_DID_NOT_PRODUCE_VISIBLE_PIXEL_EVIDENCE";

    if (state.hexSurfaceRendererDrawComplete) {
      state.visiblePlanetProofReady = true;
      state.renderedPlanetProofReady = true;
      state.visiblePlanetProofSource = "HEX_SURFACE_RENDERER";
      state.visiblePlanetProofReason = "HEX_SURFACE_RENDERER_DRAW_COMPLETE";
      state.canvasDrawComplete = true;
      applyCanvasViewTransform();
      return true;
    }

    return false;
  }

  function resolveF13Gap() {
    let gap = "NONE_VISIBLE_EXPRESSION_READY";
    let status = "CANVAS_HUB_VISIBLE_EXPRESSION_READY";

    if (!state.canvasMountFound) {
      gap = "CANVAS_MOUNT_NOT_FOUND";
      status = "CANVAS_HUB_WAITING_HEARTH_CANVAS_MOUNT";
    } else if (!state.canvasElementFound) {
      gap = "CANVAS_ELEMENT_NOT_FOUND";
      status = "CANVAS_HUB_WAITING_CANVAS_ELEMENT";
    } else if (!state.canvasContext2dReady) {
      gap = "CANVAS_2D_CONTEXT_NOT_READY";
      status = "CANVAS_HUB_WAITING_2D_CONTEXT";
    } else if (!state.visiblePlanetProofReady) {
      gap = "VISIBLE_EXPRESSION_NOT_PROVEN";
      status = "CANVAS_HUB_VISIBLE_EXPRESSION_NOT_PROVEN";
    } else if (state.visiblePlanetProofSource === "COMPOSITE") {
      gap = "NONE_COMPOSITE_VISIBLE_EXPRESSION_READY";
      status = "CANVAS_HUB_COMPOSITE_VISIBLE_EXPRESSION_ACTIVE";
    } else if (state.visiblePlanetProofSource === "HEX_SURFACE_RENDERER") {
      gap = "NONE_HEX_SURFACE_VISIBLE_EXPRESSION_READY";
      status = "CANVAS_HUB_HEX_SURFACE_VISIBLE_EXPRESSION_ACTIVE";
    }

    state.f13CanvasReadinessObserved = Boolean(state.canvasElementFound || state.canvasDrawAttempted);
    state.f13VisibleEvidenceAvailable = Boolean(state.visiblePlanetProofReady);
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = Boolean(state.visiblePlanetProofReady);
    state.f13CanvasEvidenceComplete = Boolean(state.visiblePlanetProofReady);
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = gap;
    state.f13StrictEvidenceRepairTarget = FILE;

    state.firstFailedCoordinate = gap;
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.postgameStatus = status;

    if (state.visiblePlanetProofReady) state.recommendedNextAction = "OBSERVE_VIEW_CONTROL_RECEIVER";
    return { gap, status };
  }

  function drawVisibleExpression(reason = "manual") {
    state.canvasDrawAttempted = true;
    state.canvasDrawComplete = false;
    state.visiblePlanetProofReady = false;
    state.renderedPlanetProofReady = false;
    state.visiblePlanetProofSource = "NONE";
    state.visiblePlanetProofReason = safeString(reason, "manual");

    const target = ensureCanvas();

    if (!target || !target.canvas || !target.ctx) {
      state.canvasDrawComplete = false;
      state.firstFailedCoordinate = target ? "CANVAS_CONTEXT_NOT_AVAILABLE" : "CANVAS_MOUNT_OR_ELEMENT_NOT_AVAILABLE";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "RENEW_CANVAS_HUB_MOUNT_COORDINATION";
      resolveF13Gap();
      updateDataset();
      return false;
    }

    refreshSupportDetections();

    if (attemptCompositeDraw(target.canvas, target.ctx, target.mount, target.stage)) {
      resolveF13Gap();
      updateDataset();
      publishGlobals();
      record("CANVAS_HUB_VISIBLE_EXPRESSION_COMPLETE", { source: "COMPOSITE", reason, viewState: clonePlain(view) });
      return true;
    }

    if (attemptHexSurfaceDraw(target.canvas, target.ctx, target.mount, target.stage)) {
      resolveF13Gap();
      updateDataset();
      publishGlobals();
      record("CANVAS_HUB_VISIBLE_EXPRESSION_COMPLETE", { source: "HEX_SURFACE_RENDERER", reason, viewState: clonePlain(view) });
      return true;
    }

    drawHoldingField(target.canvas, target.ctx, "awaiting Composite or Hex Surface Renderer");

    state.canvasDrawComplete = false;
    state.visiblePlanetProofReady = false;
    state.renderedPlanetProofReady = false;
    state.visiblePlanetProofSource = "NONE";
    state.visiblePlanetProofReason = "COMPOSITE_AND_HEX_SURFACE_RENDERER_NOT_READY";
    state.firstFailedCoordinate = "VISIBLE_EXPRESSION_SUPPORT_NOT_READY";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction = "CONFIRM_COMPOSITE_OR_HEX_SURFACE_RENDERER_LOADED";

    resolveF13Gap();
    updateDataset();
    publishGlobals();

    record("CANVAS_HUB_VISIBLE_EXPRESSION_HELD", {
      source: "NONE",
      reason,
      compositeDetected: state.compositeDetected,
      compositeDrawComplete: state.compositeDrawComplete,
      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete
    });

    return false;
  }

  function scheduleViewRedraw(reason = "view-redraw") {
    state.viewRedrawScheduled = true;

    if (redrawTimer) return true;

    const runner = () => {
      redrawTimer = 0;
      state.viewRedrawScheduled = false;
      state.viewRedrawCount += 1;
      view.phase += 0.012;
      applyCanvasViewTransform();
      drawVisibleExpression(reason);
    };

    if (root.requestAnimationFrame) {
      redrawTimer = root.requestAnimationFrame(runner);
    } else {
      redrawTimer = root.setTimeout(runner, 32);
    }

    return true;
  }

  function forbiddenControlClaim(packet) {
    if (!isObject(packet)) return false;
    return Boolean(
      packet.f13Claimed === true ||
      packet.f13CanvasClaimed === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21ClaimedByControls === true ||
      packet.f21ClaimedByRouteConductor === true ||
      packet.f21ClaimedByDiagnosticRail === true ||
      packet.readyTextAllowed === true ||
      packet.readyTextClaimed === true ||
      packet.completionLatched === true ||
      packet.finalCompletionLatched === true ||
      packet.visualPassClaimed === true ||
      packet.generatedImage === true ||
      packet.graphicBox === true ||
      packet.webGL === true ||
      packet.webgl === true
    );
  }

  function normalizeControlPacket(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const viewState = isObject(input.viewState) ? input.viewState : null;

    return {
      packetType: safeString(input.packetType || input.type || "CANVAS_VIEW_CONTROL_PACKET"),
      sourceFile: safeString(input.sourceFile || input.controlsFile || CONTROL_FILE),
      contract: safeString(input.contract || ""),
      receipt: safeString(input.receipt || ""),
      inputType: safeString(input.inputType || "view-control"),
      deltaYaw: safeNumber(input.deltaYaw, 0),
      deltaPitch: safeNumber(input.deltaPitch, 0),
      deltaZoom: safeNumber(input.deltaZoom, 0),
      rawDx: input.rawDx !== undefined ? safeNumber(input.rawDx, 0) : undefined,
      rawDy: input.rawDy !== undefined ? safeNumber(input.rawDy, 0) : undefined,
      rawWheelY: input.rawWheelY !== undefined ? safeNumber(input.rawWheelY, 0) : undefined,
      key: safeString(input.key || ""),
      viewState: viewState ? {
        yaw: safeNumber(viewState.yaw, view.yaw),
        pitch: safeNumber(viewState.pitch, view.pitch),
        zoom: safeNumber(viewState.zoom, view.zoom),
        phase: safeNumber(viewState.phase, view.phase),
        minPitch: safeNumber(viewState.minPitch, view.minPitch),
        maxPitch: safeNumber(viewState.maxPitch, view.maxPitch),
        minZoom: safeNumber(viewState.minZoom, view.minZoom),
        maxZoom: safeNumber(viewState.maxZoom, view.maxZoom)
      } : null,
      receivedAt: nowIso(),
      raw: clonePlain(input),
      ...FINAL_FALSE
    };
  }

  function applyNormalizedViewControl(packet) {
    if (packet.viewState) {
      view.yaw = safeNumber(packet.viewState.yaw, view.yaw);
      view.pitch = clamp(safeNumber(packet.viewState.pitch, view.pitch), packet.viewState.minPitch, packet.viewState.maxPitch);
      view.zoom = clamp(safeNumber(packet.viewState.zoom, view.zoom), packet.viewState.minZoom, packet.viewState.maxZoom);
      view.phase = safeNumber(packet.viewState.phase, view.phase);
      view.minPitch = packet.viewState.minPitch;
      view.maxPitch = packet.viewState.maxPitch;
      view.minZoom = packet.viewState.minZoom;
      view.maxZoom = packet.viewState.maxZoom;
    } else {
      view.yaw += safeNumber(packet.deltaYaw, 0);
      view.pitch = clamp(view.pitch + safeNumber(packet.deltaPitch, 0), view.minPitch, view.maxPitch);
      view.zoom = clamp(view.zoom + safeNumber(packet.deltaZoom, 0), view.minZoom, view.maxZoom);
    }

    view.phase += Math.abs(packet.deltaYaw || 0) + Math.abs(packet.deltaPitch || 0) * 0.25;

    state.lastControlPacket = clonePlain(packet.raw || packet);
    state.lastViewPacket = clonePlain(packet);
    state.controlPacketLastSource = packet.sourceFile || CONTROL_FILE;
    state.controlPacketDeliveryStatus = "CONTROL_PACKET_ACCEPTED_BY_CANVAS";
    state.controlPacketDeliveryMethod = "planetary-view-control-receiver";
    state.controlPacketLastAcceptedAt = packet.receivedAt;
    state.viewMotionStatus = "VIEW_CONTROL_MOTION_APPLIED";
    state.touchRuntimeStatus = packet.inputType.includes("pointer") || packet.inputType.includes("touch") ? "TOUCH_RUNTIME_PACKET_APPLIED" : state.touchRuntimeStatus;
    state.dragRuntimeStatus = packet.inputType.includes("drag") ? "DRAG_RUNTIME_PACKET_APPLIED" : state.dragRuntimeStatus;
    state.zoomRuntimeStatus = packet.inputType.includes("zoom") || packet.deltaZoom !== 0 ? "ZOOM_RUNTIME_PACKET_APPLIED" : state.zoomRuntimeStatus;
    state.keyboardRuntimeStatus = packet.inputType.includes("keyboard") ? "KEYBOARD_RUNTIME_PACKET_APPLIED" : state.keyboardRuntimeStatus;
    state.planetaryViewInputStatus = "PLANETARY_VIEW_INPUT_PACKET_APPLIED";

    applyCanvasViewTransform();
    publishViewGlobals();
    updateDataset();
    scheduleViewRedraw(`control-packet:${packet.inputType}`);

    return getControlViewReceipt();
  }

  function receivePlanetaryControlPacket(packet = {}) {
    state.controlPacketCount += 1;

    if (!isObject(packet)) {
      state.controlPacketRejectedCount += 1;
      state.controlPacketLastRejectedAt = nowIso();
      state.controlPacketLastRejectionReason = "CONTROL_PACKET_NOT_OBJECT";
      state.controlPacketDeliveryStatus = "CONTROL_PACKET_REJECTED";
      record("CANVAS_CONTROL_PACKET_REJECTED", { reason: state.controlPacketLastRejectionReason });
      updateDataset();
      return getControlViewReceipt();
    }

    if (forbiddenControlClaim(packet)) {
      state.controlPacketRejectedCount += 1;
      state.controlPacketLastRejectedAt = nowIso();
      state.controlPacketLastRejectionReason = "CONTROL_PACKET_CONTAINS_FORBIDDEN_CLAIM";
      state.controlPacketDeliveryStatus = "CONTROL_PACKET_REJECTED";
      record("CANVAS_CONTROL_PACKET_REJECTED", { reason: state.controlPacketLastRejectionReason });
      updateDataset();
      return getControlViewReceipt();
    }

    const normalized = normalizeControlPacket(packet);
    state.controlPacketAcceptedCount += 1;

    record("CANVAS_CONTROL_PACKET_ACCEPTED", {
      inputType: normalized.inputType,
      deltaYaw: normalized.deltaYaw,
      deltaPitch: normalized.deltaPitch,
      deltaZoom: normalized.deltaZoom,
      sourceFile: normalized.sourceFile
    });

    return applyNormalizedViewControl(normalized);
  }

  function consumePlanetaryControlPacket(packet = {}) {
    return receivePlanetaryControlPacket(packet);
  }

  function receiveControlsPacket(packet = {}) {
    return receivePlanetaryControlPacket(packet);
  }

  function consumeControlsPacket(packet = {}) {
    return receivePlanetaryControlPacket(packet);
  }

  function receiveControlPacket(packet = {}) {
    return receivePlanetaryControlPacket(packet);
  }

  function consumeControlPacket(packet = {}) {
    return receivePlanetaryControlPacket(packet);
  }

  function receiveViewControlPacket(packet = {}) {
    return receivePlanetaryControlPacket(packet);
  }

  function consumeViewControlPacket(packet = {}) {
    return receivePlanetaryControlPacket(packet);
  }

  function receiveViewDelta(delta = {}) {
    return receivePlanetaryControlPacket({
      packetType: "DIRECT_VIEW_DELTA_PACKET",
      sourceFile: CONTROL_FILE,
      inputType: safeString(delta.inputType || "direct-view-delta"),
      deltaYaw: safeNumber(delta.deltaYaw, 0),
      deltaPitch: safeNumber(delta.deltaPitch, 0),
      deltaZoom: safeNumber(delta.deltaZoom, 0),
      viewState: isObject(delta.viewState) ? delta.viewState : undefined,
      ...FINAL_FALSE
    });
  }

  function applyViewDelta(delta = {}) {
    return receiveViewDelta(delta);
  }

  function setView(nextView = {}) {
    return receivePlanetaryControlPacket({
      packetType: "DIRECT_SET_VIEW_PACKET",
      sourceFile: CONTROL_FILE,
      inputType: "set-view",
      viewState: {
        yaw: safeNumber(nextView.yaw, view.yaw),
        pitch: safeNumber(nextView.pitch, view.pitch),
        zoom: safeNumber(nextView.zoom, view.zoom),
        phase: safeNumber(nextView.phase, view.phase),
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },
      ...FINAL_FALSE
    });
  }

  function updateView(nextView = {}) {
    return setView({ ...view, ...nextView });
  }

  function getViewState() {
    return clonePlain(view);
  }

  function publishViewGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const packet = {
      packetType: "HEARTH_CANVAS_VIEW_STATE_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      viewState: clonePlain(view),
      controlPacketCount: state.controlPacketCount,
      controlPacketAcceptedCount: state.controlPacketAcceptedCount,
      controlPacketDeliveryStatus: state.controlPacketDeliveryStatus,
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    root.HEARTH_CANVAS_VIEW_STATE = clonePlain(packet);
    root.HEARTH_CANVAS_LAST_VIEW_PACKET = clonePlain(state.lastViewPacket || packet);
    hearth.canvasViewState = clonePlain(packet);
    hearth.canvasLastViewPacket = clonePlain(state.lastViewPacket || packet);
    lab.hearthCanvasViewState = clonePlain(packet);

    return packet;
  }

  function getControlViewReceipt() {
    return {
      packetType: "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      controlFile: CONTROL_FILE,
      planetaryViewControlReceiverActive: true,
      viewControlPacketReceiverReady: true,
      controlPacketCount: state.controlPacketCount,
      controlPacketAcceptedCount: state.controlPacketAcceptedCount,
      controlPacketRejectedCount: state.controlPacketRejectedCount,
      controlPacketDeliveryStatus: state.controlPacketDeliveryStatus,
      controlPacketDeliveryMethod: state.controlPacketDeliveryMethod,
      controlPacketLastAcceptedAt: state.controlPacketLastAcceptedAt,
      controlPacketLastRejectedAt: state.controlPacketLastRejectedAt,
      controlPacketLastRejectionReason: state.controlPacketLastRejectionReason,
      controlPacketLastSource: state.controlPacketLastSource,
      viewState: clonePlain(view),
      viewTransformApplied: state.viewTransformApplied,
      viewTransformCss: state.viewTransformCss,
      viewRedrawScheduled: state.viewRedrawScheduled,
      viewRedrawCount: state.viewRedrawCount,
      viewMotionStatus: state.viewMotionStatus,
      touchRuntimeStatus: state.touchRuntimeStatus,
      dragRuntimeStatus: state.dragRuntimeStatus,
      zoomRuntimeStatus: state.zoomRuntimeStatus,
      keyboardRuntimeStatus: state.keyboardRuntimeStatus,
      planetaryViewInputStatus: state.planetaryViewInputStatus,
      ownsControlRuntimeTruth: false,
      ownsInputAdmission: false,
      ownsPointerInput: false,
      ownsTouchInput: false,
      ownsDragInput: false,
      ownsWheelInput: false,
      ownsKeyboardInput: false,
      ownsViewProjectionApplication: true,
      ownsCanvasRedrawFromViewState: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };
  }

  function refreshState() {
    readRouteConductorProfile();
    refreshSupportDetections();
    ensureCanvas();
    resolveF13Gap();
    state.updatedAt = nowIso();
    return clonePlain(state);
  }

  function loadScriptOnce(src, attemptKey, completeKey) {
    if (!doc || !doc.head) return Promise.resolve(false);

    state[attemptKey] = true;
    state.supportLoadAttempted = true;

    const existing = Array.from(doc.querySelectorAll("script[src]")).find((script) => {
      try {
        const url = new URL(script.getAttribute("src"), root.location && root.location.href ? root.location.href : "https://diamondgatebridge.com/");
        return url.pathname === src;
      } catch (_error) {
        return safeString(script.getAttribute("src")).split("?")[0] === src;
      }
    });

    if (existing) {
      state[completeKey] = true;
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = doc.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-hearth-canvas-hub-support", "true");
      script.setAttribute("data-contract", CONTRACT);

      script.onload = () => {
        state[completeKey] = true;
        state.updatedAt = nowIso();
        resolve(true);
      };

      script.onerror = () => {
        const item = { at: nowIso(), file: src, error: "SCRIPT_LOAD_ERROR" };
        state.supportLoadErrors.push(item);
        trimArray(state.supportLoadErrors, 40);
        state[completeKey] = false;
        state.updatedAt = item.at;
        resolve(false);
      };

      doc.head.appendChild(script);
    });
  }

  function ensureSupportFilesLoaded() {
    if (supportLoadPromise) return supportLoadPromise;

    state.supportLoadAttempted = true;

    supportLoadPromise = loadScriptOnce(COMPOSITE_FILE, "supportLoadCompositeAttempted", "supportLoadCompositeComplete")
      .then(() => loadScriptOnce(HEX_FOUR_PAIR_FILE, "supportLoadHexFourPairAttempted", "supportLoadHexFourPairComplete"))
      .then(() => loadScriptOnce(HEX_SURFACE_FILE, "supportLoadHexSurfaceAttempted", "supportLoadHexSurfaceComplete"))
      .then(() => {
        state.supportLoadComplete = true;
        refreshState();
        drawVisibleExpression("support-files-loaded");
        updateDataset();
        publishGlobals();
        return getReceipt();
      })
      .finally(() => {
        supportLoadPromise = null;
      });

    return supportLoadPromise;
  }

  function consumeRouteConductorReleasePacket(packet = {}) {
    state.routeConductorReleasePacket = clonePlain(packet || {});
    state.routeConductorReleasePacketObserved = isObject(packet);
    refreshState();
    scheduleViewRedraw("route-conductor-release-packet");
    return getReceipt();
  }

  function receiveRouteConductorReleasePacket(packet = {}) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function consumeReleasePacket(packet = {}) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveReleasePacket(packet = {}) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveCanvasReleasePacket(packet = {}) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function readRouteConductorReleasePacket() {
    readRouteConductorProfile();
    return clonePlain(state.routeConductorReleasePacket || null);
  }

  function receiveChildPacket(packet = {}) {
    if (!isObject(packet)) return false;
    const key = inferFingerKeyFromPacket(packet);
    if (key && FINGER_FILES[key]) return receiveFingerPacket(packet);
    refreshState();
    updateDataset();
    publishGlobals();
    return true;
  }

  function receiveEastPacket(packet = {}) {
    state.canvasEastApiReady = true;
    state.canvasEastEvidenceReady = packet && isObject(packet)
      ? packet.canvasEastEvidenceReady === true || packet.atlasReady === true
      : state.canvasEastEvidenceReady;
    refreshState();
    return getCanvasStationSummary();
  }

  function receiveWestPacket(packet = {}) {
    state.canvasWestApiReady = true;
    state.canvasWestInspectionReady = packet && isObject(packet)
      ? packet.canvasWestInspectionReady === true || packet.inspectionReady === true
      : state.canvasWestInspectionReady;
    refreshState();
    return getCanvasStationSummary();
  }

  function receiveSouthPacket(packet = {}) {
    state.canvasSouthApiReady = true;
    state.canvasSouthVisibleProofReady = packet && isObject(packet)
      ? packet.canvasSouthVisibleProofReady === true || packet.visiblePlanetAvailable === true || packet.imageRendered === true
      : state.canvasSouthVisibleProofReady;
    refreshState();
    return getCanvasStationSummary();
  }

  function getExpressionHubSummary() {
    refreshSupportDetections();
    recomputeFingerAggregation();

    return {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_EXPRESSION_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasHubLoaded: true,
      canvasHubActive: true,
      expressionHubActive: true,
      fingerManagerActive: true,
      threeFileStretchActive: true,
      planetaryViewControlReceiverActive: true,

      compositeFile: COMPOSITE_FILE,
      hexFourPairFile: HEX_FOUR_PAIR_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,

      compositeDetected: state.compositeDetected,
      compositeContract: state.compositeContract,
      compositeDrawMethodAvailable: state.compositeDrawMethodAvailable,
      compositeDrawAttempted: state.compositeDrawAttempted,
      compositeDrawComplete: state.compositeDrawComplete,

      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairWideProbeAvailable: state.hexFourPairWideProbeAvailable,
      hexFourPairEveryPixelHasFourPairSet: state.hexFourPairEveryPixelHasFourPairSet,
      hexFourPairBodyBound: state.hexFourPairBodyBound,
      hexFourPairAllowedToFloat: state.hexFourPairAllowedToFloat,

      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererContractRecognized: state.hexSurfaceRendererContractRecognized,
      hexSurfaceRendererDrawMethodAvailable: state.hexSurfaceRendererDrawMethodAvailable,
      hexSurfaceRendererDrawAttempted: state.hexSurfaceRendererDrawAttempted,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,

      fingerSequence: FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerRegistry: getFingerRegistry(),
      fingerAuthorityObservedCount: state.fingerAuthorityObservedCount,
      fingerApiReadyCount: state.fingerApiReadyCount,
      fingerExpressionPacketCount: state.fingerExpressionPacketCount,
      fingerReceiptPacketCount: state.fingerReceiptPacketCount,
      fingerTrackReadyCount: state.fingerTrackReadyCount,
      fingerHardFailCount: state.fingerHardFailCount,

      controlViewReceipt: getControlViewReceipt(),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getExpressionHubReceipt() {
    return {
      ...getExpressionHubSummary(),
      packetType: "CANVAS_EXPRESSION_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT",
      currentReceipt: true,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getCanvasStationSummary() {
    resolveF13Gap();

    return {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      indexFile: INDEX_FILE,
      routeFile: ROUTE_FILE,
      controlFile: CONTROL_FILE,

      canvasHubLoaded: true,
      canvasHubActive: true,
      canvasLocalStationActive: true,
      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      threeFileStretchActive: true,
      planetaryViewControlReceiverActive: true,
      viewControlPacketReceiverReady: true,

      currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
      previousRouteConductorV96Contract: LINEAGE_ROUTE_CONDUCTOR_V9_6_CONTRACT,
      lineageRouteConductorV95Contract: LINEAGE_ROUTE_CONDUCTOR_V9_5_CONTRACT,
      lineageRouteConductorV94Contract: LINEAGE_ROUTE_CONDUCTOR_V9_4_CONTRACT,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractKnown: state.routeConductorContractKnown,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorV97Recognized: state.routeConductorV97Recognized,
      routeConductorV96LineageAccepted: state.routeConductorV96LineageAccepted,
      routeConductorV95LineageAccepted: state.routeConductorV95LineageAccepted,
      routeConductorV94LineageAccepted: state.routeConductorV94LineageAccepted,

      canvasMountAttempted: state.canvasMountAttempted,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasMountRectNonzero: state.canvasMountRectNonzero,
      globeStageFound: state.globeStageFound,
      globeStageSelector: state.globeStageSelector,
      globeStageRectNonzero: state.globeStageRectNonzero,
      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasReused: state.canvasReused,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasAttributeWidth: state.canvasAttributeWidth,
      canvasAttributeHeight: state.canvasAttributeHeight,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasDrawAttempted: state.canvasDrawAttempted,
      canvasDrawComplete: state.canvasDrawComplete,
      canvasDrawError: state.canvasDrawError,

      compositeDetected: state.compositeDetected,
      compositeContract: state.compositeContract,
      compositeDrawMethodAvailable: state.compositeDrawMethodAvailable,
      compositeDrawMethod: state.compositeDrawMethod,
      compositeDrawAttempted: state.compositeDrawAttempted,
      compositeDrawComplete: state.compositeDrawComplete,
      compositeDrawError: state.compositeDrawError,

      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexFourPairAuthorityContract: state.hexFourPairAuthorityContract,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairWideProbeAvailable: state.hexFourPairWideProbeAvailable,
      hexFourPairEveryPixelHasFourPairSet: state.hexFourPairEveryPixelHasFourPairSet,
      hexFourPairBodyBound: state.hexFourPairBodyBound,
      hexFourPairAllowedToFloat: state.hexFourPairAllowedToFloat,

      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererContract: state.hexSurfaceRendererContract,
      hexSurfaceRendererContractRecognized: state.hexSurfaceRendererContractRecognized,
      hexSurfaceRendererDrawMethodAvailable: state.hexSurfaceRendererDrawMethodAvailable,
      hexSurfaceRendererDrawMethod: state.hexSurfaceRendererDrawMethod,
      hexSurfaceRendererDrawAttempted: state.hexSurfaceRendererDrawAttempted,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,
      hexSurfaceRendererDrawError: state.hexSurfaceRendererDrawError,

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      domVisiblePlanetProofReady: state.domVisiblePlanetProofReady,
      stageMountDomProofReady: state.stageMountDomProofReady,

      supportLoadAttempted: state.supportLoadAttempted,
      supportLoadComplete: state.supportLoadComplete,
      supportLoadCompositeAttempted: state.supportLoadCompositeAttempted,
      supportLoadCompositeComplete: state.supportLoadCompositeComplete,
      supportLoadHexFourPairAttempted: state.supportLoadHexFourPairAttempted,
      supportLoadHexFourPairComplete: state.supportLoadHexFourPairComplete,
      supportLoadHexSurfaceAttempted: state.supportLoadHexSurfaceAttempted,
      supportLoadHexSurfaceComplete: state.supportLoadHexSurfaceComplete,

      expressionHubSummary: getExpressionHubSummary(),
      controlViewReceipt: getControlViewReceipt(),

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      routeConductorShouldConsumeThisSummary: true,
      diagnosticRailMayReadThisSummary: true,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getCanvasStationReceiptLight() {
    return getCanvasStationSummary();
  }

  function getCanvasStationReceipt() {
    return {
      ...getCanvasStationSummary(),
      packetType: "CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT",
      currentReceipt: true,
      compositeDrawReceipt: clonePlain(state.compositeDrawReceipt),
      hexFourPairValidationReceipt: clonePlain(state.hexFourPairValidationReceipt),
      hexSurfaceRendererFrameReceipt: clonePlain(state.hexSurfaceRendererFrameReceipt),
      expressionHubReceipt: getExpressionHubReceipt(),
      controlViewReceipt: getControlViewReceipt(),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      supportLoadErrors: clonePlain(state.supportLoadErrors),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getStructuralCarrier() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasHubActive: true,
      planetaryViewControlReceiverActive: true,
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      viewState: clonePlain(view),
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      ...FINAL_FALSE
    };
  }

  function readStructuralCarrier() {
    return getStructuralCarrier();
  }

  function getCanvasCarrier() {
    return getStructuralCarrier();
  }

  function getCarrierReceipt() {
    return getStructuralCarrier();
  }

  function getReceiptLight() {
    return {
      ...getCanvasStationSummary(),
      currentReceiptLight: true,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getCanvasStationReceipt(),
      currentReceipt: true,
      structuralCarrier: getStructuralCarrier(),
      expressionHubReceipt: getExpressionHubReceipt(),
      controlViewReceipt: getControlViewReceipt(),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceiptText() {
    const r = getCanvasStationSummary();
    const c = getControlViewReceipt();

    return [
      "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("baselineContract", r.baselineContract),
      line("baselineReceipt", r.baselineReceipt),
      line("file", FILE),
      line("route", ROUTE),
      line("diagnosticRoute", DIAGNOSTIC_ROUTE),
      "",
      "ROUTE_CONDUCTOR",
      line("currentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorV97Recognized", r.routeConductorV97Recognized),
      line("routeConductorV96LineageAccepted", r.routeConductorV96LineageAccepted),
      line("routeConductorV95LineageAccepted", r.routeConductorV95LineageAccepted),
      line("routeConductorV94LineageAccepted", r.routeConductorV94LineageAccepted),
      "",
      "MOUNT",
      line("globeStageFound", r.globeStageFound),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasDrawAttempted", r.canvasDrawAttempted),
      line("canvasDrawComplete", r.canvasDrawComplete),
      "",
      "VISIBLE_EXPRESSION",
      line("compositeDetected", r.compositeDetected),
      line("compositeDrawComplete", r.compositeDrawComplete),
      line("hexFourPairAuthorityDetected", r.hexFourPairAuthorityDetected),
      line("hexSurfaceRendererDetected", r.hexSurfaceRendererDetected),
      line("hexSurfaceRendererDrawComplete", r.hexSurfaceRendererDrawComplete),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("visiblePlanetProofReason", r.visiblePlanetProofReason),
      "",
      "PLANETARY_VIEW_CONTROL",
      line("planetaryViewControlReceiverActive", c.planetaryViewControlReceiverActive),
      line("viewControlPacketReceiverReady", c.viewControlPacketReceiverReady),
      line("controlPacketCount", c.controlPacketCount),
      line("controlPacketAcceptedCount", c.controlPacketAcceptedCount),
      line("controlPacketRejectedCount", c.controlPacketRejectedCount),
      line("controlPacketDeliveryStatus", c.controlPacketDeliveryStatus),
      line("viewYaw", c.viewState.yaw),
      line("viewPitch", c.viewState.pitch),
      line("viewZoom", c.viewState.zoom),
      line("viewPhase", c.viewState.phase),
      line("viewTransformApplied", c.viewTransformApplied),
      line("viewRedrawCount", c.viewRedrawCount),
      line("viewMotionStatus", c.viewMotionStatus),
      line("touchRuntimeStatus", c.touchRuntimeStatus),
      line("dragRuntimeStatus", c.dragRuntimeStatus),
      line("zoomRuntimeStatus", c.zoomRuntimeStatus),
      line("planetaryViewInputStatus", c.planetaryViewInputStatus),
      "",
      "F13_EVIDENCE",
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("controlReadyClaimed", false),
      line("motionReadyClaimed", false),
      line("touchReadyClaimed", false),
      line("dragReadyClaimed", false),
      line("downstreamReleaseClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasPreviousReceipt", PREVIOUS_RECEIPT);

    setDataset("hearthCanvasHubLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasThreeFileStretchActive", "true");
    setDataset("hearthCanvasPlanetaryViewControlReceiverActive", "true");
    setDataset("hearthCanvasViewControlPacketReceiverReady", "true");

    setDataset("hearthCanvasCurrentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthCanvasRouteConductorObserved", String(state.routeConductorObserved));
    setDataset("hearthCanvasRouteConductorContract", state.routeConductorContract);
    setDataset("hearthCanvasRouteConductorV97Recognized", String(state.routeConductorV97Recognized));
    setDataset("hearthCanvasRouteConductorV96LineageAccepted", String(state.routeConductorV96LineageAccepted));
    setDataset("hearthCanvasRouteConductorV95LineageAccepted", String(state.routeConductorV95LineageAccepted));
    setDataset("hearthCanvasRouteConductorV94LineageAccepted", String(state.routeConductorV94LineageAccepted));

    setDataset("hearthCanvasMountAttempted", String(state.canvasMountAttempted));
    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasDrawAttempted", String(state.canvasDrawAttempted));
    setDataset("hearthCanvasDrawComplete", String(state.canvasDrawComplete));

    setDataset("hearthCanvasCompositeDetected", String(state.compositeDetected));
    setDataset("hearthCanvasCompositeDrawComplete", String(state.compositeDrawComplete));
    setDataset("hearthCanvasHexFourPairAuthorityDetected", String(state.hexFourPairAuthorityDetected));
    setDataset("hearthCanvasHexSurfaceRendererDetected", String(state.hexSurfaceRendererDetected));
    setDataset("hearthCanvasHexSurfaceRendererDrawComplete", String(state.hexSurfaceRendererDrawComplete));

    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofReason", state.visiblePlanetProofReason);
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasDomVisiblePlanetProofReady", String(state.domVisiblePlanetProofReady));
    setDataset("hearthCanvasStageMountDomProofReady", String(state.stageMountDomProofReady));

    setDataset("hearthCanvasControlPacketCount", String(state.controlPacketCount));
    setDataset("hearthCanvasControlPacketAcceptedCount", String(state.controlPacketAcceptedCount));
    setDataset("hearthCanvasControlPacketRejectedCount", String(state.controlPacketRejectedCount));
    setDataset("hearthCanvasControlPacketDeliveryStatus", state.controlPacketDeliveryStatus);
    setDataset("hearthCanvasViewYaw", String(view.yaw));
    setDataset("hearthCanvasViewPitch", String(view.pitch));
    setDataset("hearthCanvasViewZoom", String(view.zoom));
    setDataset("hearthCanvasViewPhase", String(view.phase));
    setDataset("hearthCanvasViewTransformApplied", String(state.viewTransformApplied));
    setDataset("hearthCanvasViewMotionStatus", state.viewMotionStatus);
    setDataset("hearthCanvasTouchRuntimeStatus", state.touchRuntimeStatus);
    setDataset("hearthCanvasDragRuntimeStatus", state.dragRuntimeStatus);
    setDataset("hearthCanvasZoomRuntimeStatus", state.zoomRuntimeStatus);
    setDataset("hearthCanvasPlanetaryViewInputStatus", state.planetaryViewInputStatus);

    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasControlReadyClaimed", "false");
    setDataset("hearthCanvasMotionReadyClaimed", "false");
    setDataset("hearthCanvasTouchReadyClaimed", "false");
    setDataset("hearthCanvasDragReadyClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvas = api;
    hearth.canvasParent = api;
    hearth.canvasHub = api;
    hearth.canvasEvidence = api;
    hearth.canvasLocalStation = api;
    hearth.canvasStation = api;
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;
    hearth.canvasPlanetaryViewControlReceiver = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;
    root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasHub = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;
    lab.hearthCanvasPlanetaryViewControlReceiver = api;

    const light = getReceiptLight();
    const full = getReceipt();
    const hubReceipt = getExpressionHubReceipt();
    const controlReceipt = getControlViewReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_HUB_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT = controlReceipt;
    root.HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT_v12_1 = full;

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasHubReceipt = full;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasExpressionHubReceipt = hubReceipt;
    hearth.canvasFingerManagerReceipt = hubReceipt;
    hearth.canvasPlanetaryViewControlReceiverReceipt = controlReceipt;

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasHubReceipt = full;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasExpressionHubReceipt = hubReceipt;
    lab.hearthCanvasFingerManagerReceipt = hubReceipt;
    lab.hearthCanvasPlanetaryViewControlReceiverReceipt = controlReceipt;

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

    publishViewGlobals();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function notifyRouteConductor() {
    const summary = getCanvasStationSummary();

    const candidates = [
      readPath("HEARTH_ROUTE_CONDUCTOR"),
      readPath("HEARTH.routeConductor"),
      readPath("DEXTER_LAB.hearthRouteConductor"),
      readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION"),
      readPath("HEARTH.routeConductorControlHandshakeIntegration"),
      readPath("DEXTER_LAB.hearthRouteConductorControlHandshakeIntegration"),
      readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION"),
      readPath("HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion")
    ];

    const methods = [
      "receiveCanvasHubSummary",
      "receiveCanvasExpressionHubSummary",
      "receiveVisibleGlobeProofSummary",
      "receiveCanvasStationSummary",
      "receiveCanvasLocalStationSummary",
      "receiveCanvasParentSummary",
      "reconcileCanvas",
      "refresh"
    ];

    for (const target of candidates) {
      if (!target || !isObject(target)) continue;

      for (const method of methods) {
        if (!isFunction(target[method])) continue;

        const result = safeInvoke(target, method, [clonePlain(summary)]);
        if (result.ok) {
          state.routeConductorNotified = true;
          state.routeConductorNotifyMethod = method;
          return true;
        }
      }
    }

    state.routeConductorNotified = false;
    state.routeConductorNotifyMethod = "NONE";
    return false;
  }

  function ingestPendingControlPacket() {
    const pending =
      readPath("HEARTH_CONTROLS_VIEW_PACKET") ||
      readPath("HEARTH_PLANETARY_VIEW_CONTROL_PACKET") ||
      readPath("HEARTH_CONTROLS_LAST_DELTA_PACKET") ||
      readPath("HEARTH.controlsViewPacket") ||
      readPath("HEARTH.planetaryViewControlPacket") ||
      readPath("HEARTH.controlsLastDeltaPacket");

    if (isObject(pending)) {
      receivePlanetaryControlPacket(pending);
      return true;
    }

    return false;
  }

  function bootAudit(options = {}) {
    state.timestamp = nowIso();

    initializeFingerRegistry();
    updateDataset();
    publishGlobals();

    refreshState();
    drawVisibleExpression(options && options.reason ? options.reason : "boot-audit");
    ingestPendingControlPacket();
    notifyRouteConductor();

    state.bootAuditComplete = true;

    record("CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_BOOT_AUDIT_COMPLETE", {
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      controlPacketCount: state.controlPacketCount,
      viewTransformApplied: state.viewTransformApplied,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      visualPassClaimed: false
    });

    ensureSupportFilesLoaded();

    updateDataset();
    publishGlobals();
    return getReceipt();
  }

  function boot(options = {}) {
    return bootAudit(options || {});
  }

  function init(options = {}) {
    return bootAudit(options || {});
  }

  function start(options = {}) {
    return bootAudit(options || {});
  }

  function mount(options = {}) {
    return bootAudit(options || {});
  }

  function drawBaseGlobe() {
    return drawVisibleExpression("compatibility-drawBaseGlobe");
  }

  function mountBaseGlobeCarrier() {
    const target = ensureCanvas();
    return target ? target.canvas : null;
  }

  function recomputeAll() {
    return refreshState();
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    LINEAGE_ROUTE_CONDUCTOR_V9_6_CONTRACT,
    LINEAGE_ROUTE_CONDUCTOR_V9_6_RECEIPT,
    LINEAGE_ROUTE_CONDUCTOR_V9_5_CONTRACT,
    LINEAGE_ROUTE_CONDUCTOR_V9_5_RECEIPT,
    LINEAGE_ROUTE_CONDUCTOR_V9_4_CONTRACT,
    LINEAGE_ROUTE_CONDUCTOR_V9_4_RECEIPT,
    HEX_FOUR_PAIR_CONTRACT,
    HEX_SURFACE_CONTRACT,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    INDEX_FILE,
    ROUTE_FILE,
    CONTROL_FILE,
    COMPOSITE_FILE,
    HEX_FOUR_PAIR_FILE,
    HEX_SURFACE_FILE,
    FINGER_FILES,
    FINGER_SEQUENCE,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: state.role,

    boot,
    init,
    start,
    mount,
    bootAudit,

    ensureCanvas,
    drawVisibleExpression,
    mountBaseGlobeCarrier,
    drawBaseGlobe,
    scheduleViewRedraw,

    readRouteConductorProfile,
    readRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveRouteConductorReleasePacket,
    consumeReleasePacket,
    receiveReleasePacket,
    receiveCanvasReleasePacket,

    detectComposite,
    detectHexFourPairAuthority,
    detectHexSurfaceRenderer,
    refreshSupportDetections,
    ensureSupportFilesLoaded,

    receiveChildPacket,
    receiveEastPacket,
    receiveWestPacket,
    receiveSouthPacket,

    initializeFingerRegistry,
    normalizeFingerKey,
    inferFingerKeyFromPacket,
    readFingerAuthority,
    scanFinger,
    scanAllFingers,
    receiveFingerPacket,
    receiveExpressionFingerPacket,
    receiveFingerReceipt,
    receiveCanvasFingerPacket,
    receiveCanvasExpressionPacket,
    receiveCanvasFingerReceipt,
    recomputeFingerAggregation,
    getFingerRegistry,
    getFingerTrackStatus,

    receivePlanetaryControlPacket,
    consumePlanetaryControlPacket,
    receiveControlsPacket,
    consumeControlsPacket,
    receiveControlPacket,
    consumeControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receiveViewDelta,
    applyViewDelta,
    setView,
    updateView,
    getViewState,
    getControlViewReceipt,

    getExpressionHubSummary,
    getExpressionHubReceipt,
    getCanvasStationSummary,
    getCanvasStationReceipt,
    getCanvasStationReceiptLight,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,
    publishViewGlobals,
    notifyRouteConductor,
    recomputeAll,
    refreshState,
    resolveF13Gap,

    supportsCanvasHub: true,
    supportsCanvasLocalStation: true,
    supportsExpressionHub: true,
    supportsCanvasFingerManager: true,
    supportsThreeFileStretch: true,
    supportsCompositePreferredPath: true,
    supportsHexSurfaceSupportPath: true,
    supportsPlanetaryViewControlReceiver: true,
    supportsControlPacketIntake: true,
    supportsViewStateApplication: true,
    supportsCssLevelVisibleMotion: true,
    supportsRendererRedrawFromViewState: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsCanvasHubIdentity: true,
    ownsCanvasParentIdentity: true,
    ownsExpressionHub: true,
    ownsFingerManager: true,
    ownsFingerRegistry: true,
    ownsFingerIntake: true,
    ownsVisibleCanvasPlacement: true,
    ownsViewProjectionApplication: true,
    ownsCanvasRedrawFromViewState: true,
    ownsFinalPlanetTruth: false,
    ownsCompositeTruth: false,
    ownsHexFourPairTruth: false,
    ownsHexSurfaceTruth: false,
    ownsFingerTruth: false,
    ownsRouteConductorSwitching: false,
    ownsControlRuntimeTruth: false,
    ownsInputAdmission: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();
    initializeFingerRegistry();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => bootAudit({ reason: "dom-content-loaded" }), { once: true });
      } else {
        bootAudit({ reason: "document-ready" });
      }
    } else {
      bootAudit({ reason: "no-document-runtime" });
    }
  } catch (error) {
    recordError("CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
