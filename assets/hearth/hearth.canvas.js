// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_FIRST_PAIR_TNT_v13_1
// Public compatibility contract intentionally remains v12_3.
// Internal renewal:
// HEARTH_CANVAS_PUBLIC_AUTHORITY_TO_EXPRESSION_BRIDGE_PAIR_TNT_v13_1
// Full-file replacement.
// First file in the two-file Canvas bridge pair.
// Authority-side / public-compatibility bridge only.
// Purpose:
// - Preserve the public Canvas Hub contract expected by Route Conductor, Controls Queen, diagnostics, and LabWest.
// - Publish a current Canvas authority surface without forcing surrounding files to be rewritten.
// - Load and recognize the second bridge:
//   /assets/hearth/hearth.canvas.expression.bridge.js
// - Delegate visible-expression drawing, expression packets, and pixel proof to the second bridge.
// - Keep this file as the bridge between Route Conductor, Queen controls, LabWest context, diagnostics,
//   Canvas receiver aliases, and finger/expression surface handoff.
// - Anchor a lawful Canvas expression surface in the DOM when the HTML mount is available.
// - Refresh receipts on every read/publication so stale receipt language is not retained.
// - Preserve Canvas as receiver/output carrier only.
// Does not own:
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - Composite truth
// - Hex truth
// - finger truth
// - pointer truth
// - Queen/control input truth
// - LabWest admissibility truth
// - diagnostic rail case selection
// - Route Conductor handshake truth
// - F13 final claim
// - F21 latch
// - ready text
// - completion latch
// - final visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const PUBLIC_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const PUBLIC_RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const CONTRACT = PUBLIC_CONTRACT;
  const RECEIPT = PUBLIC_RECEIPT;

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_PUBLIC_AUTHORITY_TO_EXPRESSION_BRIDGE_PAIR_TNT_v13_1";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_PUBLIC_AUTHORITY_TO_EXPRESSION_BRIDGE_PAIR_RECEIPT_v13_1";

  const PREVIOUS_INTERNAL_CONTRACT =
    "HEARTH_CANVAS_DOWNSTREAM_BISHOP_OUTPUT_CARRIER_WEST_GATE_HIERARCHY_ADOPTION_TNT_v12_4";
  const PREVIOUS_PUBLIC_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const LINEAGE_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const BASELINE_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const EXPRESSION_BRIDGE_FILE = "/assets/hearth/hearth.canvas.expression.bridge.js";

  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";

  const EXPRESSION_BRIDGE_EXPECTED_CONTRACT =
    "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v1";

  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const SURFACE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";

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
    composite: "/assets/hearth/hearth.canvas.finger.composite.js"
  });

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvasParent: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByCanvasParent: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
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

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    publicContract: PUBLIC_CONTRACT,
    publicReceipt: PUBLIC_RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
    previousPublicContract: PREVIOUS_PUBLIC_CONTRACT,
    lineageV121Contract: LINEAGE_V12_1_CONTRACT,
    baselineV12Contract: BASELINE_V12_CONTRACT,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    expressionBridgeFile: EXPRESSION_BRIDGE_FILE,

    role: "Canvas public authority bridge / first bridge in two-file Canvas pair",
    bridgePairRole: "FIRST_FILE_PUBLIC_AUTHORITY_COMPATIBILITY_BRIDGE",
    secondBridgeRole: "SECOND_FILE_VISIBLE_EXPRESSION_BRIDGE",
    canvasReceiverOutputCarrierBishopActive: true,
    publicCompatibilitySurfaceActive: true,
    staleReceiptPublicationBlocked: true,
    latestReceiptAlwaysRepublished: true,

    booted: false,
    booting: false,
    startedAt: "",
    updatedAt: "",
    publishedAt: "",
    receiptPublishCount: 0,

    canvasMountAttempted: false,
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasElementFound: false,
    canvasCreated: false,
    canvasReused: false,
    canvasContext2dReady: false,
    canvasRectNonzero: false,
    canvasAttributeWidth: 0,
    canvasAttributeHeight: 0,
    expressionSurfaceAnchored: false,
    expressionSurfaceSelector: "canvas[data-hearth-expression-surface='true']",
    domExpressionSurfaceProofReady: false,

    expressionBridgeLoadAttempted: false,
    expressionBridgeLoadComplete: false,
    expressionBridgeLoadError: "",
    expressionBridgeObserved: false,
    expressionBridgeSourceName: "NONE",
    expressionBridgeContract: "",
    expressionBridgeReceipt: "",
    expressionBridgeContractRecognized: false,
    expressionBridgeApiReady: false,
    expressionBridgeReceiptObserved: false,
    expressionBridgeLastReceipt: null,
    expressionBridgeLastPacket: null,
    expressionBridgeLastMethod: "NONE",
    expressionBridgeLastError: "",

    routeConductorContextObserved: false,
    routeConductorContract: "",
    queenContextObserved: false,
    queenContract: "",
    labWestContextObserved: false,
    labWestContract: "",
    diagnosticReadObserved: false,

    releasePacketObserved: false,
    releasePacketForwarded: false,
    releasePacketAcceptedByExpressionBridge: false,
    releasePacketLastMethod: "NONE",
    releasePacketLastError: "",
    lastReleasePacket: null,

    controlPacketCount: 0,
    controlPacketAcceptedCount: 0,
    controlPacketForwardedCount: 0,
    controlPacketRejectedCount: 0,
    controlPacketForwardMethod: "NONE",
    controlPacketLastStatus: "WAITING_CONTROL_PACKET_OR_QUEEN_CONTEXT",
    lastControlPacket: null,

    childPacketCount: 0,
    expressionPacketCount: 0,
    receiptPacketCount: 0,
    lastChildPacket: null,
    lastExpressionPacket: null,
    lastReceiptPacket: null,

    drawAttempted: false,
    drawDelegated: false,
    drawAcceptedByExpressionBridge: false,
    drawComplete: false,
    drawMethod: "NONE",
    drawError: "",

    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "EXPRESSION_BRIDGE_NOT_YET_PROVEN",
    renderedPlanetProofReady: false,
    visibleBaseGlobeCarrierActive: false,
    canvasVisibleBaseGlobeCarrierActive: false,
    baseGlobeDrawComplete: false,
    baseGlobeVisibleCarrierReady: false,
    visibleGlobeCarrierReady: false,
    visiblePlanetReceiptObserved: false,

    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    downstreamFingerTracksDeclared: true,
    namedFingerFilesEmbedded: true,
    pointerFingerBridgeRecognized: true,
    surfaceFingerBridgeRecognized: true,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_EXPRESSION_BRIDGE_VISIBLE_PROOF",
    f13StrictEvidenceRepairTarget: EXPRESSION_BRIDGE_FILE,

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: EXPRESSION_BRIDGE_FILE,
    recommendedNextAction: "LOAD_SECOND_CANVAS_EXPRESSION_BRIDGE",
    recommendedNextRenewalTarget: EXPRESSION_BRIDGE_FILE,
    postgameStatus: "CANVAS_PUBLIC_AUTHORITY_BRIDGE_LOADED",

    localEvents: [],
    errors: [],

    ...FINAL_FALSE
  };

  let bridgeLoadPromise = null;
  let publishTimer = 0;

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
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_PUBLIC_AUTHORITY_BRIDGE_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trim(state.localEvents, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_PUBLIC_AUTHORITY_BRIDGE_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 120);
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
    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.currentContract ||
      value.canvasContract ||
      value.currentCanvasParentContract ||
      value.expressionBridgeContract ||
      value.internalImplementationContract ||
      ""
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";
    return safeString(
      value.receipt ||
      value.RECEIPT ||
      value.currentReceipt ||
      value.canvasReceipt ||
      value.currentCanvasParentReceipt ||
      value.expressionBridgeReceipt ||
      value.internalImplementationReceipt ||
      ""
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;
    if (authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getExpressionBridgeReceipt",
      "getExpressionBridgeSummary",
      "getExpressionHubReceipt",
      "getExpressionHubSummary",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getCanvasVisibleProofReceipt",
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCanvasCarrier",
      "getCarrierReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result =
          method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
            ? authority[method](false)
            : authority[method]();

        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.summary)) return authority.summary;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function noFinalClaims(value) {
    const s = isObject(value) ? value : {};
    return !(
      s.f13Claimed === true ||
      s.f21EligibleForNorth === true ||
      s.f21SubmittedToNorth === true ||
      s.f21Claimed === true ||
      s.readyTextAllowed === true ||
      s.readyTextClaimed === true ||
      s.completionLatched === true ||
      s.finalCompletionLatched === true ||
      s.degradedCompletionLatched === true ||
      s.visualPassClaimed === true ||
      s.finalVisualPassClaimed === true ||
      s.generatedImage === true ||
      s.graphicBox === true ||
      s.webGL === true ||
      s.webgl === true
    );
  }

  function firstElement(selectors) {
    if (!doc) return { element: null, selector: "NONE" };

    for (const selector of selectors) {
      try {
        const found = doc.querySelector(selector);
        if (found) return { element: found, selector };
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

  function choosePixelSize(mount) {
    let cssWidth = 720;

    if (mount && isFunction(mount.getBoundingClientRect)) {
      try {
        const rect = mount.getBoundingClientRect();
        if (rect && rect.width > 0) cssWidth = rect.width;
      } catch (_error) {}
    }

    if ((!cssWidth || cssWidth < 260) && root.innerWidth) {
      cssWidth = Math.min(820, Math.max(320, root.innerWidth * 0.9));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1200, Math.round(cssWidth * ratio)));
  }

  function canvasHasVisiblePixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) return false;

    try {
      const w = canvas.width;
      const h = canvas.height;
      const size = Math.max(1, Math.min(22, Math.floor(Math.min(w, h) / 36)));
      const points = [
        [Math.floor(w / 2), Math.floor(h / 2)],
        [Math.floor(w * 0.35), Math.floor(h * 0.42)],
        [Math.floor(w * 0.62), Math.floor(h * 0.55)]
      ];

      for (const [cx, cy] of points) {
        const x = Math.max(0, Math.min(w - size, cx - Math.floor(size / 2)));
        const y = Math.max(0, Math.min(h - size, cy - Math.floor(size / 2)));
        const data = ctx.getImageData(x, y, size, size).data;

        for (let index = 0; index < data.length; index += 4) {
          if (data[index + 3] > 8 && (data[index] > 4 || data[index + 1] > 4 || data[index + 2] > 4)) {
            return true;
          }
        }
      }
    } catch (_error) {
      return true;
    }

    return false;
  }

  function mountSelectors() {
    return [
      "#hearthCanvasMount",
      "[data-hearth-canvas-mount]",
      "[data-hearth-visible-planet-mount]",
      "[data-hearth-planet-mount]",
      "#hearthGlobeStage",
      "[data-hearth-globe-stage]",
      "[data-hearth-planet-stage]",
      "main",
      "body"
    ];
  }

  function ensureCanvas(options = {}) {
    state.canvasMountAttempted = true;

    if (!doc) {
      state.canvasMountFound = false;
      state.canvasElementFound = false;
      state.canvasContext2dReady = false;
      state.firstFailedCoordinate = "DOCUMENT_NOT_AVAILABLE";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_BROWSER_DOCUMENT";
      return null;
    }

    const mountResult = firstElement(mountSelectors());
    const mount = options.mount || mountResult.element;

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;

    if (!mount) {
      state.canvasElementFound = false;
      state.canvasContext2dReady = false;
      state.expressionSurfaceAnchored = false;
      state.domExpressionSurfaceProofReady = false;
      state.firstFailedCoordinate = "CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_HEARTH_HTML_CANVAS_MOUNT";
      return null;
    }

    let canvas = options.canvas || null;

    if (!canvas && doc.getElementById("hearthCanvas")) {
      canvas = doc.getElementById("hearthCanvas");
    }

    if (!canvas) {
      const selectors = [
        "canvas[data-hearth-expression-surface='true']",
        "canvas[data-hearth-visible-canvas='true']",
        "canvas[data-hearth-canvas-hub='true']",
        "canvas[data-hearth-planet-canvas='true']",
        "canvas"
      ];

      for (const selector of selectors) {
        try {
          canvas = mount.querySelector ? mount.querySelector(selector) : null;
          if (canvas) break;
        } catch (_error) {}
      }
    }

    if (canvas) {
      state.canvasReused = true;
      state.canvasCreated = false;
    } else {
      canvas = doc.createElement("canvas");
      canvas.id = "hearthCanvas";
      canvas.setAttribute("aria-label", "Hearth visible planet expression surface");
      if (mount.firstChild) mount.insertBefore(canvas, mount.firstChild);
      else mount.appendChild(canvas);
      state.canvasCreated = true;
      state.canvasReused = false;
    }

    const pixelSize = choosePixelSize(mount);
    if (canvas.width !== pixelSize) canvas.width = pixelSize;
    if (canvas.height !== pixelSize) canvas.height = pixelSize;

    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthCanvasPublicAuthorityBridge = "true";
    canvas.dataset.hearthCanvasAuthorityBridgeFirstPair = "true";
    canvas.dataset.hearthExpressionSurface = "true";
    canvas.dataset.hearthVisibleCanvas = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasInternalImplementationContract = INTERNAL_IMPLEMENTATION_CONTRACT;
    canvas.dataset.hearthCanvasInternalImplementationReceipt = INTERNAL_IMPLEMENTATION_RECEIPT;
    canvas.dataset.hearthCanvasExpressionBridgeFile = EXPRESSION_BRIDGE_FILE;
    canvas.dataset.hearthCanvasReceiverOutputCarrierBishop = "true";
    canvas.dataset.hearthCanvasOwnsExpressionTruth = "false";
    canvas.dataset.hearthCanvasOwnsFingerTruth = "false";
    canvas.dataset.hearthCanvasOwnsInputAdmission = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "min(88vw, 780px)";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(5,18,42,.92), rgba(0,0,0,.98))";
    canvas.style.boxSizing = "border-box";
    canvas.style.touchAction = "none";
    canvas.style.transformOrigin = "50% 50%";
    canvas.style.willChange = "transform";
    canvas.style.contain = "layout paint style";

    let ctx = null;
    try {
      ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null;
    } catch (_error) {
      ctx = null;
    }

    state.canvasElement = canvas;
    state.canvasContext = ctx;
    state.canvasMountElement = mount;
    state.canvasElementFound = Boolean(canvas);
    state.canvasContext2dReady = Boolean(ctx);
    state.canvasRectNonzero = rectNonzero(canvas) || Boolean(canvas.width > 0 && canvas.height > 0);
    state.canvasAttributeWidth = safeNumber(canvas.width, 0);
    state.canvasAttributeHeight = safeNumber(canvas.height, 0);
    state.expressionSurfaceAnchored = Boolean(canvas);
    state.domExpressionSurfaceProofReady = Boolean(canvas && state.canvasRectNonzero && state.canvasContext2dReady);

    return { canvas, ctx, mount };
  }

  function expressionBridgeAliases() {
    return [
      "HEARTH_CANVAS_EXPRESSION_BRIDGE",
      "HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE",
      "HEARTH_CANVAS_SECOND_EXPRESSION_BRIDGE",
      "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR",
      "HEARTH_CANVAS_EXPRESSION_SURFACE_BRIDGE",
      "HEARTH.canvasExpressionBridge",
      "HEARTH.canvasVisibleExpressionBridge",
      "HEARTH.canvasSecondExpressionBridge",
      "HEARTH.canvasExpressionBridgeSecondPair",
      "HEARTH.canvasExpressionSurfaceBridge",
      "DEXTER_LAB.hearthCanvasExpressionBridge",
      "DEXTER_LAB.hearthCanvasVisibleExpressionBridge",
      "DEXTER_LAB.hearthCanvasSecondExpressionBridge",
      "DEXTER_LAB.hearthCanvasExpressionBridgeSecondPair",
      "DEXTER_LAB.hearthCanvasExpressionSurfaceBridge"
    ];
  }

  function findExpressionBridge() {
    let authority = null;
    let sourceName = "NONE";

    for (const name of expressionBridgeAliases()) {
      const candidate = readPath(name);
      if (candidate && isObject(candidate) && candidate !== api) {
        authority = candidate;
        sourceName = name;
        break;
      }
    }

    const receipt = readAuthorityReceipt(authority) || null;
    const contract =
      contractOf(receipt) ||
      contractOf(authority) ||
      datasetValue("hearthCanvasExpressionBridgeContract") ||
      datasetValue("hearthExpressionBridgeContract");

    const receiptName =
      receiptOf(receipt) ||
      receiptOf(authority) ||
      datasetValue("hearthCanvasExpressionBridgeReceipt") ||
      datasetValue("hearthExpressionBridgeReceipt");

    const apiReady = Boolean(authority && (
      isFunction(authority.receiveCanvasAuthorityBridgePacket) ||
      isFunction(authority.receiveAuthorityBridgePacket) ||
      isFunction(authority.receiveReleasePacket) ||
      isFunction(authority.drawToCanvas) ||
      isFunction(authority.mount) ||
      isFunction(authority.boot) ||
      isFunction(authority.start) ||
      isFunction(authority.render) ||
      isFunction(authority.draw)
    ));

    state.expressionBridgeObserved = Boolean(authority || contract || receiptName);
    state.expressionBridgeSourceName = sourceName;
    state.expressionBridgeContract = contract || "";
    state.expressionBridgeReceipt = receiptName || "";
    state.expressionBridgeContractRecognized = Boolean(
      contract === EXPRESSION_BRIDGE_EXPECTED_CONTRACT ||
      safeString(contract).includes("HEARTH_CANVAS_EXPRESSION_BRIDGE")
    );
    state.expressionBridgeApiReady = apiReady;
    state.expressionBridgeReceiptObserved = Boolean(receipt);
    state.expressionBridgeLastReceipt = receipt ? clonePlain(receipt) : state.expressionBridgeLastReceipt;

    return {
      authority,
      sourceName,
      receipt,
      contract: contract || "",
      receiptName: receiptName || "",
      apiReady
    };
  }

  function scriptByPath(path) {
    if (!doc) return null;

    try {
      const scripts = Array.from(doc.querySelectorAll("script[src]"));
      return scripts.find((script) => {
        try {
          const url = new URL(script.getAttribute("src"), root.location && root.location.href ? root.location.href : "https://diamondgatebridge.com/");
          return url.pathname === path;
        } catch (_error) {
          return safeString(script.getAttribute("src")).split("?")[0] === path;
        }
      }) || null;
    } catch (_error) {
      return null;
    }
  }

  function loadExpressionBridge() {
    if (bridgeLoadPromise) return bridgeLoadPromise;

    state.expressionBridgeLoadAttempted = true;

    if (!doc || !doc.head) {
      state.expressionBridgeLoadError = "DOCUMENT_HEAD_NOT_AVAILABLE";
      return Promise.resolve(false);
    }

    const existing = scriptByPath(EXPRESSION_BRIDGE_FILE);
    if (existing) {
      state.expressionBridgeLoadComplete = true;
      state.expressionBridgeLoadError = "";
      findExpressionBridge();
      return Promise.resolve(true);
    }

    bridgeLoadPromise = new Promise((resolve) => {
      const script = doc.createElement("script");
      script.src = `${EXPRESSION_BRIDGE_FILE}?v=${encodeURIComponent(INTERNAL_IMPLEMENTATION_CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.dataset.hearthCanvasAuthorityBridgeLoader = "true";
      script.dataset.hearthCanvasAuthorityBridgeContract = INTERNAL_IMPLEMENTATION_CONTRACT;
      script.dataset.hearthCanvasExpressionBridgeFile = EXPRESSION_BRIDGE_FILE;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      script.onload = () => {
        state.expressionBridgeLoadComplete = true;
        state.expressionBridgeLoadError = "";
        state.updatedAt = nowIso();
        findExpressionBridge();
        record("EXPRESSION_BRIDGE_SCRIPT_LOAD_COMPLETE", { file: EXPRESSION_BRIDGE_FILE });
        schedulePublish();
        resolve(true);
      };

      script.onerror = () => {
        state.expressionBridgeLoadComplete = false;
        state.expressionBridgeLoadError = "EXPRESSION_BRIDGE_SCRIPT_LOAD_ERROR";
        state.updatedAt = nowIso();
        recordError("EXPRESSION_BRIDGE_SCRIPT_LOAD_ERROR", state.expressionBridgeLoadError, {
          file: EXPRESSION_BRIDGE_FILE
        });
        schedulePublish();
        resolve(false);
      };

      doc.head.appendChild(script);
    }).finally(() => {
      bridgeLoadPromise = null;
    });

    return bridgeLoadPromise;
  }

  function buildAuthorityPacket(reason = "authority-bridge") {
    return {
      packetType: "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      publicContract: PUBLIC_CONTRACT,
      publicReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      targetFile: EXPRESSION_BRIDGE_FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reason,

      firstBridgeRole: state.bridgePairRole,
      secondBridgeRole: state.secondBridgeRole,
      publicCompatibilitySurfaceActive: true,
      canvasReceiverOutputCarrierBishopActive: true,
      expressionBridgeFile: EXPRESSION_BRIDGE_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      surfaceFingerFile: SURFACE_FINGER_FILE,
      fingerFiles: clonePlain(FINGER_FILES),

      canvasElementFound: state.canvasElementFound,
      canvasContext2dReady: state.canvasContext2dReady,
      expressionSurfaceAnchored: state.expressionSurfaceAnchored,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,

      lastReleasePacket: clonePlain(state.lastReleasePacket),
      lastControlPacket: clonePlain(state.lastControlPacket),
      lastChildPacket: clonePlain(state.lastChildPacket),

      ownsCanvasPublicAuthoritySurface: true,
      ownsCanvasReceiverAliasSurface: true,
      ownsExpressionTruth: false,
      ownsCanvasDrawingTruth: false,
      ownsInputAdmission: false,
      ownsQueenTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsDiagnosticCaseSelection: false,
      ownsFingerTruth: false,
      ownsPointerTruth: false,

      ...FINAL_FALSE,
      composedAt: nowIso()
    };
  }

  function callBridgeMethod(bridge, methods, args) {
    if (!bridge || !isObject(bridge.authority)) {
      return { ok: false, method: "NONE", value: null, error: "EXPRESSION_BRIDGE_AUTHORITY_NOT_AVAILABLE" };
    }

    for (const method of methods) {
      if (!isFunction(bridge.authority[method])) continue;

      try {
        return {
          ok: true,
          method,
          value: bridge.authority[method](...(Array.isArray(args) ? args : [args])),
          error: ""
        };
      } catch (error) {
        recordError("EXPRESSION_BRIDGE_METHOD_FAILED", error, { method });
        return {
          ok: false,
          method,
          value: null,
          error: error && error.message ? String(error.message) : String(error)
        };
      }
    }

    return { ok: false, method: "NONE", value: null, error: "NO_COMPATIBLE_EXPRESSION_BRIDGE_METHOD" };
  }

  function normalizeBridgeResult(result, fallbackReceipt = null) {
    const value = isObject(result && result.value) ? result.value : null;
    const receipt = value || fallbackReceipt || null;

    if (receipt) state.expressionBridgeLastReceipt = clonePlain(receipt);

    const proofReady = Boolean(
      receipt &&
      noFinalClaims(receipt) &&
      (
        safeBool(receipt.visiblePlanetProofReady, false) ||
        safeBool(receipt.visibleGlobeCarrierReady, false) ||
        safeBool(receipt.baseGlobeVisibleCarrierReady, false) ||
        safeBool(receipt.canvasDrawComplete, false) ||
        safeBool(receipt.drawComplete, false) ||
        safeBool(receipt.expressionDrawComplete, false)
      )
    );

    const strict = Boolean(
      receipt &&
      noFinalClaims(receipt) &&
      (
        safeBool(receipt.f13CanvasEvidenceStrict, false) ||
        safeBool(receipt.strictExpressionProofReady, false)
      )
    );

    const degraded = Boolean(
      receipt &&
      noFinalClaims(receipt) &&
      (
        safeBool(receipt.f13CanvasEvidenceDegraded, false) ||
        proofReady
      )
    );

    const hardFail = Boolean(
      receipt &&
      (
        safeBool(receipt.f13HardFail, false) ||
        safeBool(receipt.hardFail, false)
      )
    );

    if (hardFail) {
      state.f13HardFail = true;
      state.firstFailedCoordinate = "EXPRESSION_BRIDGE_HARD_FAIL";
      state.recommendedNextFile = EXPRESSION_BRIDGE_FILE;
      state.recommendedNextAction = "REVIEW_SECOND_CANVAS_EXPRESSION_BRIDGE_HARD_FAIL";
      state.postgameStatus = "EXPRESSION_BRIDGE_HARD_FAIL";
      return false;
    }

    const target = ensureCanvas();
    const pixelProof = target && canvasHasVisiblePixels(target.canvas, target.ctx);

    const visibleReady = Boolean(proofReady || pixelProof);

    state.visiblePlanetProofReady = visibleReady;
    state.renderedPlanetProofReady = visibleReady;
    state.visibleBaseGlobeCarrierActive = visibleReady;
    state.canvasVisibleBaseGlobeCarrierActive = visibleReady;
    state.baseGlobeDrawComplete = visibleReady;
    state.baseGlobeVisibleCarrierReady = visibleReady;
    state.visibleGlobeCarrierReady = visibleReady;
    state.visiblePlanetReceiptObserved = Boolean(visibleReady || receipt);

    state.f13CanvasReadinessObserved = Boolean(
      state.canvasElementFound ||
      state.expressionBridgeObserved ||
      state.drawAttempted ||
      receipt
    );
    state.f13VisibleEvidenceAvailable = visibleReady;
    state.f13CanvasEvidenceStrict = Boolean(strict && visibleReady);
    state.f13CanvasEvidenceDegraded = Boolean((degraded || visibleReady) && !state.f13CanvasEvidenceStrict);
    state.f13CanvasEvidenceComplete = Boolean(visibleReady && !hardFail);
    state.f13StrictEvidenceGap = state.f13CanvasEvidenceStrict
      ? "NONE_EXPRESSION_BRIDGE_STRICT_VISIBLE_PROOF_READY"
      : visibleReady
        ? "VISIBLE_PROOF_DEGRADED_STRICT_EXPRESSION_BRIDGE_PENDING"
        : "WAITING_EXPRESSION_BRIDGE_VISIBLE_PROOF";
    state.f13StrictEvidenceRepairTarget = EXPRESSION_BRIDGE_FILE;

    state.visiblePlanetProofSource = visibleReady
      ? safeString(
        receipt && receipt.visiblePlanetProofSource,
        pixelProof ? "CANVAS_PIXEL_EVIDENCE_AFTER_EXPRESSION_BRIDGE" : "EXPRESSION_BRIDGE"
      )
      : "NONE";

    state.visiblePlanetProofReason = visibleReady
      ? "EXPRESSION_BRIDGE_OR_PIXEL_EVIDENCE_READY"
      : "EXPRESSION_BRIDGE_NOT_YET_PROVEN";

    state.firstFailedCoordinate = state.f13StrictEvidenceGap;
    state.recommendedNextFile = state.f13CanvasEvidenceStrict ? FILE : EXPRESSION_BRIDGE_FILE;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;
    state.recommendedNextAction = state.f13CanvasEvidenceStrict
      ? "OBSERVE_ROUTE_CONDUCTOR_AND_DIAGNOSTIC_READS"
      : "REVIEW_SECOND_CANVAS_EXPRESSION_BRIDGE_VISIBLE_PROOF";
    state.postgameStatus = visibleReady
      ? state.f13CanvasEvidenceStrict
        ? "CANVAS_PUBLIC_AUTHORITY_BRIDGE_STRICT_EXPRESSION_PROOF_READY"
        : "CANVAS_PUBLIC_AUTHORITY_BRIDGE_DEGRADED_EXPRESSION_PROOF_READY"
      : "CANVAS_PUBLIC_AUTHORITY_BRIDGE_WAITING_EXPRESSION_BRIDGE_VISIBLE_PROOF";

    return visibleReady;
  }

  function delegateToExpressionBridge(reason = "delegate", options = {}) {
    const target = ensureCanvas(options);
    const bridge = findExpressionBridge();

    state.drawAttempted = Boolean(options.draw === true || state.drawAttempted);

    if (!bridge.authority) {
      state.expressionBridgeLastMethod = "NONE";
      state.expressionBridgeLastError = "EXPRESSION_BRIDGE_NOT_OBSERVED";
      state.firstFailedCoordinate = "WAITING_SECOND_CANVAS_EXPRESSION_BRIDGE";
      state.recommendedNextFile = EXPRESSION_BRIDGE_FILE;
      state.recommendedNextAction = "LOAD_SECOND_CANVAS_EXPRESSION_BRIDGE";
      state.postgameStatus = "CANVAS_PUBLIC_AUTHORITY_BRIDGE_WAITING_SECOND_BRIDGE";

      loadExpressionBridge();
      updateDataset();
      return false;
    }

    const packet = buildAuthorityPacket(reason);
    state.expressionBridgeLastPacket = clonePlain(packet);

    const methods = options.draw === true
      ? [
        "drawToCanvas",
        "renderToCanvas",
        "drawVisibleExpression",
        "renderVisibleExpression",
        "mount",
        "boot",
        "start",
        "receiveCanvasAuthorityBridgePacket",
        "receiveAuthorityBridgePacket"
      ]
      : [
        "receiveCanvasAuthorityBridgePacket",
        "receiveAuthorityBridgePacket",
        "receivePublicAuthorityBridgePacket",
        "receiveBridgePacket",
        "mount",
        "boot",
        "start"
      ];

    let result;

    if (options.draw === true && target && target.canvas && isFunction(bridge.authority.drawToCanvas)) {
      try {
        result = {
          ok: true,
          method: "drawToCanvas",
          value: bridge.authority.drawToCanvas(target.canvas, {
            ...packet,
            canvas: target.canvas,
            ctx: target.ctx,
            context: target.ctx,
            mount: target.mount,
            drawDelegatedBy: FILE,
            ...FINAL_FALSE
          }),
          error: ""
        };
      } catch (error) {
        recordError("EXPRESSION_BRIDGE_DRAW_TO_CANVAS_FAILED", error);
        result = {
          ok: false,
          method: "drawToCanvas",
          value: null,
          error: error && error.message ? String(error.message) : String(error)
        };
      }
    } else {
      result = callBridgeMethod(bridge, methods, [{
        ...packet,
        canvas: target ? target.canvas : null,
        ctx: target ? target.ctx : null,
        context: target ? target.ctx : null,
        mount: target ? target.mount : null,
        ...FINAL_FALSE
      }]);
    }

    state.expressionBridgeLastMethod = result.method;
    state.expressionBridgeLastError = result.error;
    state.drawDelegated = Boolean(options.draw === true && result.ok);
    state.drawAcceptedByExpressionBridge = Boolean(options.draw === true && result.ok);
    state.drawMethod = result.method;
    state.drawError = result.error;

    const bridgeReceipt = readAuthorityReceipt(bridge.authority);
    const visibleReady = normalizeBridgeResult(result, bridgeReceipt);

    state.drawComplete = Boolean(visibleReady && options.draw === true);

    updateDataset();
    publishGlobals("delegate-to-expression-bridge");
    return visibleReady;
  }

  function drawToCanvas(canvasOrContext, options = {}) {
    const suppliedCanvas =
      canvasOrContext && canvasOrContext.canvas
        ? canvasOrContext.canvas
        : canvasOrContext && canvasOrContext.nodeType === 1
          ? canvasOrContext
          : null;

    const suppliedContext =
      canvasOrContext && isFunction(canvasOrContext.getImageData)
        ? canvasOrContext
        : canvasOrContext && canvasOrContext.ctx
          ? canvasOrContext.ctx
          : null;

    const suppliedTarget = suppliedCanvas
      ? { canvas: suppliedCanvas, ctx: suppliedContext || (suppliedCanvas.getContext ? suppliedCanvas.getContext("2d") : null), mount: suppliedCanvas.parentElement || null }
      : null;

    if (suppliedTarget) {
      state.canvasElement = suppliedTarget.canvas;
      state.canvasContext = suppliedTarget.ctx;
      state.canvasMountElement = suppliedTarget.mount;
    }

    return delegateToExpressionBridge("draw-to-canvas-public-call", {
      draw: true,
      canvas: suppliedTarget ? suppliedTarget.canvas : undefined,
      mount: suppliedTarget ? suppliedTarget.mount : undefined,
      ...options
    });
  }

  function receiveReleasePacket(packet = {}) {
    state.releasePacketObserved = isObject(packet);
    state.lastReleasePacket = clonePlain(packet || {});
    state.routeConductorContextObserved = true;
    state.routeConductorContract = safeString(packet.contract || packet.routeConductorContract || state.routeConductorContract);

    const bridge = findExpressionBridge();
    const target = ensureCanvas();
    const bridgePacket = {
      ...buildAuthorityPacket("route-conductor-release-packet"),
      routeConductorReleasePacket: clonePlain(packet || {}),
      canvas: target ? target.canvas : null,
      ctx: target ? target.ctx : null,
      context: target ? target.ctx : null,
      ...FINAL_FALSE
    };

    const result = callBridgeMethod(bridge, [
      "receiveRouteConductorReleasePacket",
      "consumeRouteConductorReleasePacket",
      "receiveReleasePacket",
      "consumeReleasePacket",
      "receiveCanvasReleasePacket",
      "receiveCanvasAuthorityBridgePacket",
      "receiveAuthorityBridgePacket",
      "mount",
      "boot",
      "start"
    ], [bridgePacket]);

    state.releasePacketForwarded = result.ok;
    state.releasePacketLastMethod = result.method;
    state.releasePacketLastError = result.error;
    state.releasePacketAcceptedByExpressionBridge = Boolean(result.ok);

    normalizeBridgeResult(result, bridge.authority ? readAuthorityReceipt(bridge.authority) : null);
    updateDataset();
    publishGlobals("receive-release-packet");
    return getReceiptLight(false);
  }

  function receiveRouteConductorReleasePacket(packet = {}) {
    return receiveReleasePacket(packet);
  }

  function consumeRouteConductorReleasePacket(packet = {}) {
    return receiveReleasePacket(packet);
  }

  function receiveCanvasReleasePacket(packet = {}) {
    return receiveReleasePacket(packet);
  }

  function consumeReleasePacket(packet = {}) {
    return receiveReleasePacket(packet);
  }

  function receivePlanetaryControlPacket(packet = {}) {
    state.controlPacketCount += 1;

    if (!isObject(packet)) {
      state.controlPacketRejectedCount += 1;
      state.controlPacketLastStatus = "CONTROL_PACKET_REJECTED_NOT_OBJECT";
      updateDataset();
      return getControlViewReceipt();
    }

    if (!noFinalClaims(packet)) {
      state.controlPacketRejectedCount += 1;
      state.controlPacketLastStatus = "CONTROL_PACKET_REJECTED_FORBIDDEN_FINAL_CLAIM";
      updateDataset();
      return getControlViewReceipt();
    }

    state.controlPacketAcceptedCount += 1;
    state.lastControlPacket = clonePlain(packet);
    state.queenContextObserved = true;
    state.queenContract = safeString(packet.contract || packet.controlContract || state.queenContract || EXPECTED_CONTROL_CONTRACT);

    const bridge = findExpressionBridge();
    const result = callBridgeMethod(bridge, [
      "receivePlanetaryControlPacket",
      "consumePlanetaryControlPacket",
      "receiveControlsPacket",
      "receiveControlPacket",
      "receiveViewControlPacket",
      "receiveViewDelta",
      "receiveCanvasAuthorityBridgePacket",
      "receiveAuthorityBridgePacket"
    ], [{
      ...buildAuthorityPacket("planetary-control-packet"),
      controlPacket: clonePlain(packet),
      ...FINAL_FALSE
    }]);

    state.controlPacketForwardedCount += result.ok ? 1 : 0;
    state.controlPacketForwardMethod = result.method;
    state.controlPacketLastStatus = result.ok
      ? "CONTROL_PACKET_FORWARDED_TO_EXPRESSION_BRIDGE"
      : `CONTROL_PACKET_HELD:${result.error}`;

    normalizeBridgeResult(result, bridge.authority ? readAuthorityReceipt(bridge.authority) : null);
    updateDataset();
    publishGlobals("receive-planetary-control-packet");
    return getControlViewReceipt();
  }

  function receiveControlsPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function consumeControlsPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function receiveControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function consumeControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function receiveViewControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function consumeViewControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function receiveViewDelta(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function applyViewDelta(packet = {}) { return receivePlanetaryControlPacket(packet); }

  function receiveChildPacket(packet = {}) {
    state.childPacketCount += 1;
    state.lastChildPacket = clonePlain(packet || {});

    if (isObject(packet) && safeString(packet.packetLane || packet.packetType).toUpperCase().includes("EXPRESSION")) {
      state.expressionPacketCount += 1;
      state.lastExpressionPacket = clonePlain(packet);
    }

    if (isObject(packet) && (
      safeString(packet.packetLane || packet.packetType).toUpperCase().includes("RECEIPT") ||
      packet.receipt ||
      packet.RECEIPT ||
      packet.contract ||
      packet.CONTRACT
    )) {
      state.receiptPacketCount += 1;
      state.lastReceiptPacket = clonePlain(packet);
    }

    const bridge = findExpressionBridge();
    const result = callBridgeMethod(bridge, [
      "receiveChildPacket",
      "receiveFingerPacket",
      "receiveCanvasFingerPacket",
      "receiveExpressionFingerPacket",
      "receiveCanvasExpressionPacket",
      "receiveCanvasAuthorityBridgePacket",
      "receiveAuthorityBridgePacket"
    ], [{
      ...buildAuthorityPacket("child-or-finger-packet"),
      childPacket: clonePlain(packet || {}),
      ...FINAL_FALSE
    }]);

    normalizeBridgeResult(result, bridge.authority ? readAuthorityReceipt(bridge.authority) : packet);
    updateDataset();
    publishGlobals("receive-child-packet");
    return getExpressionHubSummary();
  }

  function receiveFingerPacket(packet = {}) { return receiveChildPacket(packet); }
  function receiveCanvasFingerPacket(packet = {}) { return receiveChildPacket(packet); }
  function receiveExpressionFingerPacket(packet = {}) { return receiveChildPacket({ ...packet, packetLane: "EXPRESSION" }); }
  function receiveCanvasExpressionPacket(packet = {}) { return receiveChildPacket({ ...packet, packetLane: "EXPRESSION" }); }
  function receiveFingerReceipt(packet = {}) { return receiveChildPacket({ ...packet, packetLane: "RECEIPT" }); }
  function receiveCanvasFingerReceipt(packet = {}) { return receiveChildPacket({ ...packet, packetLane: "RECEIPT" }); }

  function receiveExpressionBridgeSummary(summary = {}) {
    state.expressionBridgeObserved = true;
    state.expressionBridgeReceiptObserved = true;
    state.expressionBridgeLastReceipt = clonePlain(summary || {});
    state.expressionBridgeContract = contractOf(summary) || state.expressionBridgeContract;
    state.expressionBridgeReceipt = receiptOf(summary) || state.expressionBridgeReceipt;
    normalizeBridgeResult({ ok: true, method: "receiveExpressionBridgeSummary", value: summary, error: "" }, summary);
    updateDataset();
    publishGlobals("receive-expression-bridge-summary");
    return getReceiptLight(false);
  }

  function receiveExpressionBridgeReceipt(summary = {}) {
    return receiveExpressionBridgeSummary(summary);
  }

  function receiveCanvasSummary(summary = {}) {
    return receiveExpressionBridgeSummary(summary);
  }

  function receiveCanvasStationSummary(summary = {}) {
    return receiveExpressionBridgeSummary(summary);
  }

  function receiveCanvasExpressionHubSummary(summary = {}) {
    return receiveExpressionBridgeSummary(summary);
  }

  function receiveVisiblePlanetReceipt(summary = {}) {
    return receiveExpressionBridgeSummary(summary);
  }

  function receiveVisibleGlobeReceipt(summary = {}) {
    return receiveExpressionBridgeSummary(summary);
  }

  function receiveQueenContext(packet = {}) {
    state.queenContextObserved = isObject(packet);
    state.queenContract = safeString(packet.contract || packet.controlContract || state.queenContract || EXPECTED_CONTROL_CONTRACT);
    return receivePlanetaryControlPacket({
      packetType: "QUEEN_CONTEXT_PACKET",
      queenContext: clonePlain(packet || {}),
      contract: state.queenContract,
      ...FINAL_FALSE
    });
  }

  function receiveLabWestContext(packet = {}) {
    state.labWestContextObserved = isObject(packet);
    state.labWestContract = safeString(packet.contract || packet.labWestContract || state.labWestContract);

    const bridge = findExpressionBridge();
    const result = callBridgeMethod(bridge, [
      "receiveLabWestContext",
      "receiveWestContext",
      "receiveAdmissibilityContext",
      "receiveCanvasAuthorityBridgePacket",
      "receiveAuthorityBridgePacket"
    ], [{
      ...buildAuthorityPacket("labwest-context"),
      labWestContext: clonePlain(packet || {}),
      ...FINAL_FALSE
    }]);

    normalizeBridgeResult(result, bridge.authority ? readAuthorityReceipt(bridge.authority) : null);
    updateDataset();
    publishGlobals("receive-labwest-context");
    return getReceiptLight(false);
  }

  function refreshState(options = {}) {
    findExpressionBridge();
    ensureCanvas();

    if (options.tryBridge !== false) {
      delegateToExpressionBridge(options.reason || "refresh-state", { draw: options.draw === true });
    }

    if (!state.expressionBridgeObserved) {
      state.firstFailedCoordinate = "WAITING_SECOND_CANVAS_EXPRESSION_BRIDGE";
      state.recommendedNextFile = EXPRESSION_BRIDGE_FILE;
      state.recommendedNextAction = "LOAD_SECOND_CANVAS_EXPRESSION_BRIDGE";
      state.postgameStatus = "CANVAS_PUBLIC_AUTHORITY_BRIDGE_WAITING_SECOND_BRIDGE";
    } else if (!state.visiblePlanetProofReady) {
      state.firstFailedCoordinate = "WAITING_EXPRESSION_BRIDGE_VISIBLE_PROOF";
      state.recommendedNextFile = EXPRESSION_BRIDGE_FILE;
      state.recommendedNextAction = "REVIEW_SECOND_CANVAS_EXPRESSION_BRIDGE_VISIBLE_OUTPUT";
      state.postgameStatus = "CANVAS_PUBLIC_AUTHORITY_BRIDGE_WAITING_VISIBLE_PROOF";
    }

    state.updatedAt = nowIso();
    updateDataset();
    return getReceiptLight(false);
  }

  function getControlViewReceipt() {
    return {
      packetType: "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_CONTROL_VIEW_RECEIPT",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      controlFile: CONTROL_FILE,
      expressionBridgeFile: EXPRESSION_BRIDGE_FILE,

      controlPacketCount: state.controlPacketCount,
      controlPacketAcceptedCount: state.controlPacketAcceptedCount,
      controlPacketForwardedCount: state.controlPacketForwardedCount,
      controlPacketRejectedCount: state.controlPacketRejectedCount,
      controlPacketForwardMethod: state.controlPacketForwardMethod,
      controlPacketLastStatus: state.controlPacketLastStatus,

      queenContextObserved: state.queenContextObserved,
      queenContract: state.queenContract,

      expressionBridgeObserved: state.expressionBridgeObserved,
      expressionBridgeApiReady: state.expressionBridgeApiReady,
      expressionBridgeLastMethod: state.expressionBridgeLastMethod,
      expressionBridgeLastError: state.expressionBridgeLastError,

      ownsControlRuntimeTruth: false,
      ownsInputAdmission: false,
      ownsPointerInput: false,
      ownsTouchInput: false,
      ownsDragInput: false,
      ownsWheelInput: false,
      ownsKeyboardInput: false,
      ownsViewProjectionApplication: false,
      ownsCanvasRedrawFromViewState: false,
      ownsFinalPlanetTruth: false,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };
  }

  function getExpressionHubSummary() {
    return {
      packetType: "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_EXPRESSION_HUB_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      publicContract: PUBLIC_CONTRACT,
      publicReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      expressionBridgeFile: EXPRESSION_BRIDGE_FILE,

      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      downstreamFingerTracksDeclared: true,
      namedFingerFilesEmbedded: true,
      pointerFingerBridgeRecognized: true,
      pointerFingerFile: POINTER_FINGER_FILE,
      surfaceFingerFile: SURFACE_FINGER_FILE,
      fingerFiles: clonePlain(FINGER_FILES),

      expressionBridgeObserved: state.expressionBridgeObserved,
      expressionBridgeSourceName: state.expressionBridgeSourceName,
      expressionBridgeContract: state.expressionBridgeContract,
      expressionBridgeReceipt: state.expressionBridgeReceipt,
      expressionBridgeContractRecognized: state.expressionBridgeContractRecognized,
      expressionBridgeApiReady: state.expressionBridgeApiReady,
      expressionBridgeReceiptObserved: state.expressionBridgeReceiptObserved,
      expressionBridgeLoadAttempted: state.expressionBridgeLoadAttempted,
      expressionBridgeLoadComplete: state.expressionBridgeLoadComplete,
      expressionBridgeLoadError: state.expressionBridgeLoadError,

      childPacketCount: state.childPacketCount,
      expressionPacketCount: state.expressionPacketCount,
      receiptPacketCount: state.receiptPacketCount,

      drawAttempted: state.drawAttempted,
      drawDelegated: state.drawDelegated,
      drawAcceptedByExpressionBridge: state.drawAcceptedByExpressionBridge,
      drawComplete: state.drawComplete,
      drawMethod: state.drawMethod,
      drawError: state.drawError,

      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ...FINAL_FALSE
    };
  }

  function getExpressionHubReceipt() {
    return {
      ...getExpressionHubSummary(),
      packetType: "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_EXPRESSION_HUB_RECEIPT",
      currentReceipt: true,
      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getCanvasStationSummary() {
    return {
      timestamp: nowIso(),
      packetType: "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_CANVAS_STATION_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      publicContract: PUBLIC_CONTRACT,
      publicReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
      previousPublicContract: PREVIOUS_PUBLIC_CONTRACT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      baselineV12Contract: BASELINE_V12_CONTRACT,

      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      expressionBridgeFile: EXPRESSION_BRIDGE_FILE,

      role: state.role,
      bridgePairRole: state.bridgePairRole,
      secondBridgeRole: state.secondBridgeRole,
      canvasReceiverOutputCarrierBishopActive: true,
      publicCompatibilitySurfaceActive: true,
      staleReceiptPublicationBlocked: true,
      latestReceiptAlwaysRepublished: true,

      canvasHubLoaded: true,
      canvasHubActive: true,
      canvasParentActive: true,
      canvasLocalStationActive: true,
      canvasStationActive: true,
      canvasAuthorityBridgeActive: true,
      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      canvasV123Recognized: true,
      canvasContractAccepted: true,

      canvasMountAttempted: state.canvasMountAttempted,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasReused: state.canvasReused,
      canvasMounted: Boolean(state.canvasElementFound && state.canvasContext2dReady),
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasAttributeWidth: state.canvasAttributeWidth,
      canvasAttributeHeight: state.canvasAttributeHeight,
      expressionSurfaceAnchored: state.expressionSurfaceAnchored,
      expressionSurfaceSelector: state.expressionSurfaceSelector,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,

      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      downstreamFingerTracksDeclared: true,
      namedFingerFilesEmbedded: true,
      pointerFingerBridgeRecognized: true,
      surfaceFingerBridgeRecognized: true,

      expressionBridgeObserved: state.expressionBridgeObserved,
      expressionBridgeSourceName: state.expressionBridgeSourceName,
      expressionBridgeContract: state.expressionBridgeContract,
      expressionBridgeReceipt: state.expressionBridgeReceipt,
      expressionBridgeContractRecognized: state.expressionBridgeContractRecognized,
      expressionBridgeApiReady: state.expressionBridgeApiReady,
      expressionBridgeReceiptObserved: state.expressionBridgeReceiptObserved,
      expressionBridgeLoadAttempted: state.expressionBridgeLoadAttempted,
      expressionBridgeLoadComplete: state.expressionBridgeLoadComplete,
      expressionBridgeLoadError: state.expressionBridgeLoadError,

      routeConductorContextObserved: state.routeConductorContextObserved,
      routeConductorContract: state.routeConductorContract,
      queenContextObserved: state.queenContextObserved,
      queenContract: state.queenContract,
      labWestContextObserved: state.labWestContextObserved,
      labWestContract: state.labWestContract,
      diagnosticReadObserved: state.diagnosticReadObserved,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketForwarded: state.releasePacketForwarded,
      releasePacketAcceptedByExpressionBridge: state.releasePacketAcceptedByExpressionBridge,
      releasePacketLastMethod: state.releasePacketLastMethod,
      releasePacketLastError: state.releasePacketLastError,

      controlViewReceipt: getControlViewReceipt(),
      expressionHubSummary: getExpressionHubSummary(),

      canvasDrawAttempted: state.drawAttempted,
      canvasDrawComplete: state.drawComplete,
      drawDelegatedToExpressionBridge: state.drawDelegated,
      drawAcceptedByExpressionBridge: state.drawAcceptedByExpressionBridge,
      drawMethod: state.drawMethod,
      drawError: state.drawError,

      visibleBaseGlobeCarrierActive: state.visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: state.canvasVisibleBaseGlobeCarrierActive,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady: state.visibleGlobeCarrierReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,
      visiblePlanetProofIngestedByRoute: state.visiblePlanetProofReady,
      visiblePlanetReceiptObserved: state.visiblePlanetReceiptObserved,
      renderedPlanetProofReady: state.renderedPlanetProofReady,

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

      ownsCanvasHubIdentity: true,
      ownsCanvasParentIdentity: true,
      ownsCanvasPublicAuthoritySurface: true,
      ownsCanvasReceiverAliasSurface: true,
      ownsVisibleCanvasPlacement: true,
      ownsOutputCarrier: true,

      ownsCanvasDrawing: false,
      ownsCanvasExpressionTruth: false,
      ownsExpressionTruth: false,
      ownsCompositeTruth: false,
      ownsHexTruth: false,
      ownsFingerTruth: false,
      ownsPointerTruth: false,
      ownsInputAdmission: false,
      ownsQueenTruth: false,
      ownsControlRuntimeTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsDiagnosticRailCaseSelection: false,
      ownsFinalPlanetTruth: false,

      ...FINAL_FALSE
    };
  }

  function getCanvasStationReceiptLight(doRefresh = false) {
    if (doRefresh) refreshState({ tryBridge: false });
    return {
      ...getCanvasStationSummary(),
      currentReceiptLight: true,
      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getCanvasStationReceipt() {
    return {
      ...getCanvasStationSummary(),
      packetType: "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_CANVAS_STATION_RECEIPT",
      currentReceipt: true,
      expressionBridgeLastReceipt: clonePlain(state.expressionBridgeLastReceipt),
      expressionBridgeLastPacket: clonePlain(state.expressionBridgeLastPacket),
      lastReleasePacket: clonePlain(state.lastReleasePacket),
      lastControlPacket: clonePlain(state.lastControlPacket),
      lastChildPacket: clonePlain(state.lastChildPacket),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getStructuralCarrier() {
    return {
      packetType: "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_STRUCTURAL_CARRIER",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      route: ROUTE,
      expressionBridgeFile: EXPRESSION_BRIDGE_FILE,
      structuralCarrierReady: true,
      canvasAuthorityBridgeActive: true,
      publicCompatibilitySurfaceActive: true,
      canvasReceiverOutputCarrierBishopActive: true,
      expressionSurfaceAnchored: state.expressionSurfaceAnchored,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      expressionBridgeObserved: state.expressionBridgeObserved,
      expressionBridgeApiReady: state.expressionBridgeApiReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      ...FINAL_FALSE
    };
  }

  function readStructuralCarrier() { return getStructuralCarrier(); }
  function getCanvasCarrier() { return getStructuralCarrier(); }
  function getCarrierReceipt() { return getStructuralCarrier(); }

  function getReceiptLight(doRefresh = false) {
    state.diagnosticReadObserved = true;
    if (doRefresh) refreshState({ tryBridge: false });

    return {
      ...getCanvasStationSummary(),
      currentReceiptLight: true,
      receiptPublishCount: state.receiptPublishCount,
      booted: state.booted,
      booting: state.booting,
      updatedAt: state.updatedAt || nowIso(),
      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    state.diagnosticReadObserved = true;

    return {
      ...getCanvasStationReceipt(),
      currentReceipt: true,
      structuralCarrier: getStructuralCarrier(),
      expressionHubReceipt: getExpressionHubReceipt(),
      controlViewReceipt: getControlViewReceipt(),
      receiptPublishCount: state.receiptPublishCount,
      booted: state.booted,
      booting: state.booting,
      updatedAt: state.updatedAt || nowIso(),
      noFinalClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceiptText() {
    const r = getCanvasStationSummary();

    return [
      "HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_FIRST_PAIR_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("publicContract", r.publicContract),
      line("publicReceipt", r.publicReceipt),
      line("internalImplementationContract", r.internalImplementationContract),
      line("internalImplementationReceipt", r.internalImplementationReceipt),
      line("previousInternalContract", r.previousInternalContract),
      line("previousPublicContract", r.previousPublicContract),
      line("file", FILE),
      line("route", ROUTE),
      line("diagnosticRoute", DIAGNOSTIC_ROUTE),
      "",
      "BRIDGE_PAIR",
      line("bridgePairRole", r.bridgePairRole),
      line("secondBridgeRole", r.secondBridgeRole),
      line("expressionBridgeFile", EXPRESSION_BRIDGE_FILE),
      line("publicCompatibilitySurfaceActive", r.publicCompatibilitySurfaceActive),
      line("canvasReceiverOutputCarrierBishopActive", r.canvasReceiverOutputCarrierBishopActive),
      "",
      "DOM_ANCHOR",
      line("canvasMountAttempted", r.canvasMountAttempted),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountSelector", r.canvasMountSelector),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasCreated", r.canvasCreated),
      line("canvasReused", r.canvasReused),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("expressionSurfaceAnchored", r.expressionSurfaceAnchored),
      line("domExpressionSurfaceProofReady", r.domExpressionSurfaceProofReady),
      "",
      "EXPRESSION_BRIDGE",
      line("expressionBridgeObserved", r.expressionBridgeObserved),
      line("expressionBridgeSourceName", r.expressionBridgeSourceName),
      line("expressionBridgeContract", r.expressionBridgeContract),
      line("expressionBridgeReceipt", r.expressionBridgeReceipt),
      line("expressionBridgeContractRecognized", r.expressionBridgeContractRecognized),
      line("expressionBridgeApiReady", r.expressionBridgeApiReady),
      line("expressionBridgeReceiptObserved", r.expressionBridgeReceiptObserved),
      line("expressionBridgeLoadAttempted", r.expressionBridgeLoadAttempted),
      line("expressionBridgeLoadComplete", r.expressionBridgeLoadComplete),
      line("expressionBridgeLoadError", r.expressionBridgeLoadError),
      "",
      "CONTEXT_BRIDGES",
      line("routeConductorContextObserved", r.routeConductorContextObserved),
      line("routeConductorContract", r.routeConductorContract),
      line("queenContextObserved", r.queenContextObserved),
      line("queenContract", r.queenContract),
      line("labWestContextObserved", r.labWestContextObserved),
      line("labWestContract", r.labWestContract),
      line("diagnosticReadObserved", r.diagnosticReadObserved),
      "",
      "DRAW_DELEGATION",
      line("canvasDrawAttempted", r.canvasDrawAttempted),
      line("canvasDrawComplete", r.canvasDrawComplete),
      line("drawDelegatedToExpressionBridge", r.drawDelegatedToExpressionBridge),
      line("drawAcceptedByExpressionBridge", r.drawAcceptedByExpressionBridge),
      line("drawMethod", r.drawMethod),
      line("drawError", r.drawError),
      "",
      "VISIBLE_PROOF",
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("visiblePlanetProofReason", r.visiblePlanetProofReason),
      line("renderedPlanetProofReady", r.renderedPlanetProofReady),
      "",
      "F13_EVIDENCE",
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget),
      "",
      "RECEIPT_PUBLICATION",
      line("staleReceiptPublicationBlocked", true),
      line("latestReceiptAlwaysRepublished", true),
      line("receiptPublishCount", state.receiptPublishCount),
      "",
      "BOUNDARIES",
      line("ownsCanvasPublicAuthoritySurface", true),
      line("ownsCanvasReceiverAliasSurface", true),
      line("ownsCanvasDrawing", false),
      line("ownsCanvasExpressionTruth", false),
      line("ownsExpressionTruth", false),
      line("ownsCompositeTruth", false),
      line("ownsHexTruth", false),
      line("ownsFingerTruth", false),
      line("ownsPointerTruth", false),
      line("ownsInputAdmission", false),
      line("ownsQueenTruth", false),
      line("ownsControlRuntimeTruth", false),
      line("ownsLabWestAdmissibilityTruth", false),
      line("ownsRouteConductorHandshakeTruth", false),
      line("ownsDiagnosticRailCaseSelection", false),
      line("ownsFinalPlanetTruth", false),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21SubmittedToNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("finalCompletionLatched", false),
      line("degradedCompletionLatched", false),
      line("controlReadyClaimed", false),
      line("motionReadyClaimed", false),
      line("touchReadyClaimed", false),
      line("dragReadyClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasHubLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasPublicAuthorityBridgeActive", "true");
    setDataset("hearthCanvasAuthorityBridgeFirstPairActive", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPublicContract", PUBLIC_CONTRACT);
    setDataset("hearthCanvasPublicReceipt", PUBLIC_RECEIPT);
    setDataset("hearthCanvasInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasPreviousInternalContract", PREVIOUS_INTERNAL_CONTRACT);
    setDataset("hearthCanvasPreviousPublicContract", PREVIOUS_PUBLIC_CONTRACT);

    setDataset("hearthCanvasBridgePairRole", state.bridgePairRole);
    setDataset("hearthCanvasSecondBridgeRole", state.secondBridgeRole);
    setDataset("hearthCanvasExpressionBridgeFile", EXPRESSION_BRIDGE_FILE);
    setDataset("hearthCanvasPublicCompatibilitySurfaceActive", "true");
    setDataset("hearthCanvasReceiverOutputCarrierBishopActive", "true");

    setDataset("hearthCanvasCurrentCanvasParentObserved", "true");
    setDataset("hearthCanvasCurrentCanvasParentContractObserved", "true");
    setDataset("hearthCanvasCurrentCanvasParentContract", CONTRACT);
    setDataset("hearthCanvasCurrentCanvasParentReceipt", RECEIPT);
    setDataset("hearthCanvasV123Recognized", "true");
    setDataset("hearthCanvasContractAccepted", "true");

    setDataset("hearthCanvasMountAttempted", String(state.canvasMountAttempted));
    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasCreated", String(state.canvasCreated));
    setDataset("hearthCanvasReused", String(state.canvasReused));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasExpressionSurfaceAnchored", String(state.expressionSurfaceAnchored));
    setDataset("hearthCanvasExpressionSurfaceSelector", state.expressionSurfaceSelector);
    setDataset("hearthCanvasDomExpressionSurfaceProofReady", String(state.domExpressionSurfaceProofReady));

    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasFingerRegistryActive", "true");
    setDataset("hearthCanvasDownstreamFingerTracksDeclared", "true");
    setDataset("hearthCanvasNamedFingerFilesEmbedded", "true");
    setDataset("hearthCanvasPointerFingerBridgeRecognized", "true");
    setDataset("hearthCanvasPointerFingerFile", POINTER_FINGER_FILE);
    setDataset("hearthCanvasSurfaceFingerFile", SURFACE_FINGER_FILE);

    setDataset("hearthCanvasExpressionBridgeObserved", String(state.expressionBridgeObserved));
    setDataset("hearthCanvasExpressionBridgeSourceName", state.expressionBridgeSourceName);
    setDataset("hearthCanvasExpressionBridgeContract", state.expressionBridgeContract);
    setDataset("hearthCanvasExpressionBridgeReceipt", state.expressionBridgeReceipt);
    setDataset("hearthCanvasExpressionBridgeContractRecognized", String(state.expressionBridgeContractRecognized));
    setDataset("hearthCanvasExpressionBridgeApiReady", String(state.expressionBridgeApiReady));
    setDataset("hearthCanvasExpressionBridgeReceiptObserved", String(state.expressionBridgeReceiptObserved));
    setDataset("hearthCanvasExpressionBridgeLoadAttempted", String(state.expressionBridgeLoadAttempted));
    setDataset("hearthCanvasExpressionBridgeLoadComplete", String(state.expressionBridgeLoadComplete));
    setDataset("hearthCanvasExpressionBridgeLoadError", state.expressionBridgeLoadError);

    setDataset("hearthCanvasRouteConductorContextObserved", String(state.routeConductorContextObserved));
    setDataset("hearthCanvasRouteConductorContract", state.routeConductorContract);
    setDataset("hearthCanvasQueenContextObserved", String(state.queenContextObserved));
    setDataset("hearthCanvasQueenContract", state.queenContract);
    setDataset("hearthCanvasLabWestContextObserved", String(state.labWestContextObserved));
    setDataset("hearthCanvasLabWestContract", state.labWestContract);
    setDataset("hearthCanvasDiagnosticReadObserved", String(state.diagnosticReadObserved));

    setDataset("hearthCanvasReleasePacketObserved", String(state.releasePacketObserved));
    setDataset("hearthCanvasReleasePacketForwarded", String(state.releasePacketForwarded));
    setDataset("hearthCanvasReleasePacketAcceptedByExpressionBridge", String(state.releasePacketAcceptedByExpressionBridge));
    setDataset("hearthCanvasReleasePacketLastMethod", state.releasePacketLastMethod);
    setDataset("hearthCanvasReleasePacketLastError", state.releasePacketLastError);

    setDataset("hearthCanvasDrawAttempted", String(state.drawAttempted));
    setDataset("hearthCanvasDrawDelegated", String(state.drawDelegated));
    setDataset("hearthCanvasDrawAcceptedByExpressionBridge", String(state.drawAcceptedByExpressionBridge));
    setDataset("hearthCanvasDrawComplete", String(state.drawComplete));
    setDataset("hearthCanvasDrawMethod", state.drawMethod);
    setDataset("hearthCanvasDrawError", state.drawError);

    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofReason", state.visiblePlanetProofReason);
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasVisibleBaseGlobeCarrierActive", String(state.visibleBaseGlobeCarrierActive));
    setDataset("hearthCanvasBaseGlobeDrawComplete", String(state.baseGlobeDrawComplete));
    setDataset("hearthCanvasVisibleGlobeCarrierReady", String(state.visibleGlobeCarrierReady));

    setDataset("hearthCanvasF13CanvasReadinessObserved", String(state.f13CanvasReadinessObserved));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13HardFail", String(state.f13HardFail));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasStaleReceiptPublicationBlocked", "true");
    setDataset("hearthCanvasLatestReceiptAlwaysRepublished", "true");
    setDataset("hearthCanvasReceiptPublishCount", String(state.receiptPublishCount));

    setDataset("hearthCanvasOwnsCanvasDrawing", "false");
    setDataset("hearthCanvasOwnsCanvasExpressionTruth", "false");
    setDataset("hearthCanvasOwnsExpressionTruth", "false");
    setDataset("hearthCanvasOwnsFingerTruth", "false");
    setDataset("hearthCanvasOwnsPointerTruth", "false");
    setDataset("hearthCanvasOwnsInputAdmission", "false");
    setDataset("hearthCanvasOwnsQueenTruth", "false");
    setDataset("hearthCanvasOwnsControlRuntimeTruth", "false");
    setDataset("hearthCanvasOwnsLabWestAdmissibilityTruth", "false");
    setDataset("hearthCanvasOwnsRouteConductorHandshakeTruth", "false");
    setDataset("hearthCanvasOwnsDiagnosticRailCaseSelection", "false");
    setDataset("hearthCanvasOwnsFinalPlanetTruth", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasFinalCompletionLatched", "false");
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

  function publishGlobals(reason = "publish-globals") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvas = api;
    hearth.canvasParent = api;
    hearth.canvasHub = api;
    hearth.canvasAuthority = api;
    hearth.canvasEvidence = api;
    hearth.canvasStation = api;
    hearth.canvasLocalStation = api;
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;
    hearth.canvasPublicAuthorityBridge = api;
    hearth.canvasAuthorityBridgeFirstPair = api;
    hearth.canvasCompositeFirstFastViewDeferredHexReceiver = api;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiver = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;
    root.HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE = api;
    root.HEARTH_CANVAS_AUTHORITY_BRIDGE_FIRST_PAIR = api;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasHub = api;
    lab.hearthCanvasAuthority = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;
    lab.hearthCanvasPublicAuthorityBridge = api;
    lab.hearthCanvasAuthorityBridgeFirstPair = api;
    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiver = api;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver = api;

    const light = getReceiptLight(false);
    const full = getReceipt();
    const expressionReceipt = getExpressionHubReceipt();
    const controlReceipt = getControlViewReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_HUB_RECEIPT = full;
    root.HEARTH_CANVAS_AUTHORITY_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = expressionReceipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = expressionReceipt;
    root.HEARTH_CANVAS_PUBLIC_AUTHORITY_BRIDGE_RECEIPT = full;
    root.HEARTH_CANVAS_AUTHORITY_BRIDGE_FIRST_PAIR_RECEIPT = full;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3 = full;
    root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT = controlReceipt;

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasHubReceipt = full;
    hearth.canvasAuthorityReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasExpressionHubReceipt = expressionReceipt;
    hearth.canvasFingerManagerReceipt = expressionReceipt;
    hearth.canvasPublicAuthorityBridgeReceipt = full;
    hearth.canvasAuthorityBridgeFirstPairReceipt = full;
    hearth.canvasCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    hearth.canvasPlanetaryViewControlReceiverReceipt = controlReceipt;

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasHubReceipt = full;
    lab.hearthCanvasAuthorityReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasExpressionHubReceipt = expressionReceipt;
    lab.hearthCanvasFingerManagerReceipt = expressionReceipt;
    lab.hearthCanvasPublicAuthorityBridgeReceipt = full;
    lab.hearthCanvasAuthorityBridgeFirstPairReceipt = full;
    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = full;

    state.receiptPublishCount += 1;
    state.publishedAt = nowIso();
    state.updatedAt = state.publishedAt;

    updateDataset();

    record(reason, {
      contract: CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      expressionBridgeObserved: state.expressionBridgeObserved,
      expressionBridgeApiReady: state.expressionBridgeApiReady,
      expressionSurfaceAnchored: state.expressionSurfaceAnchored,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      receiptPublishCount: state.receiptPublishCount
    });

    return api;
  }

  function schedulePublish() {
    if (!root.setTimeout) return publishGlobals("scheduled-publish-immediate");
    if (publishTimer) return true;

    publishTimer = root.setTimeout(() => {
      publishTimer = 0;
      publishGlobals("scheduled-publish");
    }, 60);

    return true;
  }

  function boot(options = {}) {
    if (state.booting) return getReceipt();
    if (state.booted && options.force !== true) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_PUBLIC_AUTHORITY_BRIDGE_BOOTING";

    ensureCanvas();
    findExpressionBridge();
    updateDataset();
    publishGlobals("boot-public-authority-bridge-early");

    loadExpressionBridge();

    delegateToExpressionBridge("boot-public-authority-bridge", {
      draw: options.draw !== false
    });

    state.booted = true;
    state.booting = false;
    state.updatedAt = nowIso();

    updateDataset();
    publishGlobals("boot-public-authority-bridge-complete");

    return getReceipt();
  }

  function init(options = {}) { return boot(options); }
  function start(options = {}) { return boot(options); }
  function mount(options = {}) { return boot(options); }

  function drawVisibleExpression(reason = "draw-visible-expression") {
    return delegateToExpressionBridge(reason, { draw: true });
  }

  function drawBaseGlobe() {
    return drawVisibleExpression("draw-base-globe-compatibility-call");
  }

  function mountBaseGlobeCarrier() {
    const target = ensureCanvas();
    return target ? target.canvas : null;
  }

  function recomputeAll() {
    return refreshState({ tryBridge: true, draw: false, reason: "recompute-all" });
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PUBLIC_CONTRACT,
    PUBLIC_RECEIPT,
    INTERNAL_IMPLEMENTATION_CONTRACT,
    INTERNAL_IMPLEMENTATION_RECEIPT,
    PREVIOUS_INTERNAL_CONTRACT,
    PREVIOUS_PUBLIC_CONTRACT,
    LINEAGE_V12_1_CONTRACT,
    BASELINE_V12_CONTRACT,

    contract: CONTRACT,
    receipt: RECEIPT,
    publicContract: PUBLIC_CONTRACT,
    publicReceipt: PUBLIC_RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousInternalContract: PREVIOUS_INTERNAL_CONTRACT,
    previousPublicContract: PREVIOUS_PUBLIC_CONTRACT,

    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    INDEX_FILE,
    ROUTE_CONDUCTOR_FILE,
    CONTROL_FILE,
    EXPRESSION_BRIDGE_FILE,
    EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    EXPECTED_CONTROL_CONTRACT,
    EXPRESSION_BRIDGE_EXPECTED_CONTRACT,
    POINTER_FINGER_FILE,
    SURFACE_FINGER_FILE,
    FINGER_FILES,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    expressionBridgeFile: EXPRESSION_BRIDGE_FILE,
    role: state.role,

    boot,
    init,
    start,
    mount,
    refreshState,
    recomputeAll,

    ensureCanvas,
    mountBaseGlobeCarrier,
    drawToCanvas,
    drawVisibleExpression,
    drawBaseGlobe,

    loadExpressionBridge,
    findExpressionBridge,
    delegateToExpressionBridge,
    buildAuthorityPacket,

    receiveReleasePacket,
    receiveRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveCanvasReleasePacket,
    consumeReleasePacket,

    receivePlanetaryControlPacket,
    receiveControlsPacket,
    consumeControlsPacket,
    receiveControlPacket,
    consumeControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receiveViewDelta,
    applyViewDelta,

    receiveChildPacket,
    receiveFingerPacket,
    receiveCanvasFingerPacket,
    receiveExpressionFingerPacket,
    receiveCanvasExpressionPacket,
    receiveFingerReceipt,
    receiveCanvasFingerReceipt,

    receiveExpressionBridgeSummary,
    receiveExpressionBridgeReceipt,
    receiveCanvasSummary,
    receiveCanvasStationSummary,
    receiveCanvasExpressionHubSummary,
    receiveVisiblePlanetReceipt,
    receiveVisibleGlobeReceipt,
    receiveQueenContext,
    receiveLabWestContext,

    getControlViewReceipt,
    getExpressionHubSummary,
    getExpressionHubReceipt,
    getCanvasStationSummary,
    getCanvasStationReceiptLight,
    getCanvasStationReceipt,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,
    getReceiptLight,
    getReceipt,
    getReceiptText,

    updateDataset,
    publishGlobals,
    schedulePublish,

    supportsPublicCompatibilityContract: true,
    supportsCurrentCanvasV123Contract: true,
    supportsTwoFileBridgePair: true,
    supportsSecondExpressionBridgeDelegation: true,
    supportsExpressionSurfaceDomAnchor: true,
    supportsRouteConductorCompatibilityAliases: true,
    supportsQueenControlPacketForwarding: true,
    supportsLabWestContextForwarding: true,
    supportsDiagnosticReceiptRefresh: true,
    supportsAlwaysFreshReceiptPublication: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,
    supportsNoWebGL: true,

    ownsCanvasHubIdentity: true,
    ownsCanvasParentIdentity: true,
    ownsCanvasPublicAuthoritySurface: true,
    ownsCanvasReceiverAliasSurface: true,
    ownsVisibleCanvasPlacement: true,
    ownsOutputCarrier: true,

    ownsCanvasDrawing: false,
    ownsCanvasExpressionTruth: false,
    ownsExpressionTruth: false,
    ownsCompositeTruth: false,
    ownsHexTruth: false,
    ownsFingerTruth: false,
    ownsPointerTruth: false,
    ownsInputAdmission: false,
    ownsQueenTruth: false,
    ownsControlRuntimeTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsFinalPlanetTruth: false,
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
    state.startedAt = nowIso();
    updateDataset();
    publishGlobals("immediate-public-authority-bridge-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "dom-content-loaded" }), { once: true });
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document-runtime", draw: false });
    }
  } catch (error) {
    recordError("CANVAS_PUBLIC_AUTHORITY_BRIDGE_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
