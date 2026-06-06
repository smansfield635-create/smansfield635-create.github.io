// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10
// Internal controlled renewal:
// HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1
// Full-file replacement.
// Route Conductor / Showtime NEWS-Fibonacci synchronization / Canvas DOM-surface admission / Queen admission.
// Served CONTRACT intentionally remains v10 to preserve EAST/NORTH diagnostic expectations.
// Purpose:
// - Preserve v10 route-conductor public contract.
// - Preserve v9_9 bishop/queen/canvas recognition funnel lineage.
// - Preserve v9_8 control-file admission and handshake delivery lineage.
// - Preserve v9_7 control-handshake compatibility lineage.
// - Preserve v9_6 NEWS/Fibonacci visible-globe synchronization lineage.
// - Preserve v9_5 Canvas proof ingestion lineage.
// - Preserve v9_4 Canvas local-station compatibility receipt lineage.
// - Add route-owned Canvas file admission when Canvas authority is absent.
// - Admit /assets/hearth/hearth.canvas.js before blaming Canvas surface truth.
// - Deliver Canvas release only through public Canvas APIs: receive/consume/accept release packet, boot/init/start/mount.
// - Bind release packet to #hearthCanvasMount without creating Canvas directly.
// - Publish definitive next receipt branches:
//   CANVAS_SCRIPT_ADMITTED_WAITING_AUTHORITY
//   CANVAS_SCRIPT_LOAD_COMPLETE_AUTHORITY_NOT_PUBLISHED
//   CANVAS_AUTHORITY_PRESENT_RELEASE_DELIVERED
//   CANVAS_AUTHORITY_PRESENT_DOM_SURFACE_NOT_MOUNTED
//   CANVAS_MOUNTED_DOM_SURFACE_CONFIRMED
// - Keep Queen/control admission as motion-extension duty, not visible-globe blocker.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth, Canvas drawing authority,
//   finger truth, F21 latch, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - index priest / button authority implementation
// - diagnostic rail case selection
// - Queen implementation
// - LabWest admissibility truth
// - Cardinal Bishop implementation truth
// - downstream Bishop implementation truth
// - Canvas drawing
// - Canvas expression truth
// - Canvas finger truth
// - planet terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - North F21 latch
// - final visual pass

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT_v10";

  const RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1";
  const RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_RECEIPT_v10_1";

  const PREVIOUS_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const PREVIOUS_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT_v9_9";

  const LINEAGE_V9_8_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8";
  const LINEAGE_V9_8_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_RECEIPT_v9_8";
  const LINEAGE_V9_7_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const LINEAGE_V9_7_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT_v9_7";
  const LINEAGE_V9_6_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const LINEAGE_V9_6_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_RECEIPT_v9_6";
  const LINEAGE_V9_5_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const LINEAGE_V9_5_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5";
  const COMPAT_V9_4_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const COMPAT_V9_4_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const VERSION =
    "2026-06-06.hearth-route-conductor-canvas-dom-surface-admission-and-release-v10-1";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_EAST_FILE = "/assets/lab/runtime-table.east.js";
  const LAB_SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RECEIPT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT_v1";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const CONTROL_SCRIPT_ID = "hearth-route-conductor-admitted-controls-script";
  const CANVAS_SCRIPT_ID = "hearth-route-conductor-admitted-canvas-script";
  const CONTROL_SCRIPT_SRC = `${CONTROL_FILE}?v=${encodeURIComponent(EXPECTED_CONTROL_CONTRACT)}`;
  const CANVAS_SCRIPT_SRC = `${CANVAS_FILE}?v=${encodeURIComponent(EXPECTED_CANVAS_CONTRACT)}`;

  const CANVAS_MOUNT_SELECTOR = "#hearthCanvasMount";
  const GLOBE_STAGE_SELECTOR = "#hearthGlobeStage";
  const JS_INTEGRATION_FUNNEL = `${INDEX_FILE} -> ${FILE} -> ${CONTROL_FILE} -> ${CANVAS_FILE}`;
  const HIERARCHY_VERSION =
    "HEARTH_SHOWTIME_NEWS_FIBONACCI_CANVAS_DOM_SURFACE_ADMISSION_HIERARCHY_v10_1";

  const NEWS_CYCLES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS",
    CONTROL_EXTENSION: "INDEX_PRIEST_ROUTE_BISHOP_QUEEN_CANVAS"
  });

  const ACTIVE_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const ACTIVE_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    CONTRACT,
    PREVIOUS_CONTRACT,
    LINEAGE_V9_8_CONTRACT,
    LINEAGE_V9_7_CONTRACT,
    LINEAGE_V9_6_CONTRACT,
    LINEAGE_V9_5_CONTRACT,
    COMPAT_V9_4_CONTRACT
  ]);

  const INDEX_ALIASES = Object.freeze([
    "HEARTH_INDEX_JS",
    "HEARTH_INDEX_BRIDGE",
    "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH_INDEX_JS_PASSIVE_BUTTON_RECEIPT_CORRIDOR_ALIGNMENT",
    "HEARTH.indexJs",
    "HEARTH.indexBridge",
    "HEARTH.frontendButtonAuthorityReset",
    "HEARTH.buttonAuthority",
    "HEARTH.passiveButtonReceiptCorridor",
    "DEXTER_LAB.hearthIndexJs",
    "DEXTER_LAB.hearthIndexBridge",
    "DEXTER_LAB.hearthFrontendButtonAuthorityReset",
    "DEXTER_LAB.hearthPassiveButtonReceiptCorridor"
  ]);

  const CONTROL_ALIASES = Object.freeze([
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthControlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f21ClaimedByRouteConductor: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,

    file: FILE,
    route: ROUTE,
    booted: false,
    booting: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "ROUTE_CONDUCTOR_V10_1_LOADED",

    canvasDomSurfaceAdmissionActive: true,
    canvasScriptAdmissionRequired: true,
    canvasScriptAdmissionAttempted: false,
    canvasScriptAdmissionStatus: "WAITING_BOOT",
    canvasScriptAdmissionReason: "WAITING_BOOT",
    canvasScriptElementFound: false,
    canvasScriptElementSrc: "",
    canvasScriptInjectedByRouteConductor: false,
    canvasScriptLoadComplete: false,
    canvasScriptLoadError: "",

    canvasAuthorityObserved: false,
    canvasAuthoritySource: "NONE",
    canvasContract: "UNKNOWN",
    canvasReceipt: "UNKNOWN",
    canvasContractRecognized: false,
    canvasPublicApiReady: false,
    canvasReleaseReceiverReady: false,

    canvasReleasePacketReady: false,
    canvasReleaseAuthorized: false,
    canvasReleasePacketDelivered: false,
    canvasReleaseAcceptedByCanvas: false,
    canvasReleaseDeliveryMethod: "NONE",
    canvasReleaseDeliveryReason: "WAITING_BOOT",
    lastCanvasReleasePacketSignature: "",

    canvasMountFound: false,
    canvasMountSelector: CANVAS_MOUNT_SELECTOR,
    canvasElementFound: false,
    canvasSelector: "UNKNOWN",
    canvasInMount: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasContext2DReady: false,
    canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
    canvasVisiblePixelCount: 0,
    canvasDomSurfaceMounted: false,
    canvasDomSurfaceProofReady: false,

    controlScriptAdmissionRequired: true,
    controlScriptAdmissionAttempted: false,
    controlScriptAdmissionStatus: "WAITING_BOOT",
    controlScriptAdmissionReason: "WAITING_BOOT",
    controlScriptElementFound: false,
    controlScriptElementSrc: "",
    controlScriptInjectedByRouteConductor: false,
    controlScriptLoadComplete: false,
    controlScriptLoadError: "",
    controlAuthorityObserved: false,
    controlAuthoritySource: "NONE",
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",
    controlHandshakeStatus: "WAITING_BOOT",
    controlHandshakeAcceptedByQueen: false,

    chronologicalGateCount: 0,
    chronologicalGatesSatisfied: 0,
    chronologicalFirstFailedGate: "WAITING_BOOT",
    chronologicalFirstFailedCoordinate: "WAITING_BOOT",
    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationExpected: 100,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,
    fibonacciSynchronizationHardFail: false,
    fibonacciSynchronizationHoldReason: "WAITING_BOOT",

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_ROUTE_CONDUCTOR",
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LOADED",

    currentPacket: null,
    currentReceiptText: "",
    currentCanvasReleasePacket: null,
    currentControlHandshakePacket: null,
    receiptPublishCount: 0,
    latestReceiptAlwaysRepublished: true,
    staleReceiptPublicationBlocked: true,

    watchdogTicks: 0,
    renderCount: 0,
    localEvents: [],
    errors: [],

    ...NO_CLAIMS
  };

  let bootPromise = null;
  let watchdogTimer = 0;
  let renderTimer = 0;

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

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "ROUTE_CONDUCTOR_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimLog(state.localEvents, 160);
    state.latestEvent = item.event;
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ROUTE_CONDUCTOR_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 100);
    state.latestEvent = item.code;
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

  function firstGlobal(names) {
    for (const name of names || []) {
      const value = readPath(name);
      if (value) return { name, value };
    }

    return { name: "NONE", value: null };
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

  function q(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(selector) {
    if (!doc) return [];
    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function scriptByPath(path) {
    if (!doc) return null;

    return qa("script[src]").find((script) => {
      const src = safeString(script.getAttribute("src"), "");

      try {
        const base = root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com";
        const url = new URL(src, base);
        return url.pathname === path || url.pathname.endsWith(path);
      } catch (_error) {
        return src.includes(path);
      }
    }) || null;
  }

  function readField(source, keys, fallback = "") {
    if (!isObject(source)) return fallback;

    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null && source[key] !== "") return source[key];

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(source)) {
        if (candidate.toLowerCase() === lower) {
          const value = source[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
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
      "getExpressionHubReceipt",
      "getExpressionHubSummary",
      "getVisibleBaseGlobeReceipt",
      "getVisibleGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getCanvasVisibleProofReceipt",
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getControlSummary",
      "getQueenBridgeState",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output =
          method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
            ? authority[method](false)
            : authority[method]();

        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.controlReceipt)) return authority.controlReceipt;
    if (isObject(authority.controlHandshakeReceipt)) return authority.controlHandshakeReceipt;
    if (isObject(authority.visiblePlanetReceipt)) return authority.visiblePlanetReceipt;
    if (isObject(authority.visibleBaseGlobeReceipt)) return authority.visibleBaseGlobeReceipt;
    if (isObject(authority.expressionHubReceipt)) return authority.expressionHubReceipt;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function stableSignature(value) {
    try {
      return JSON.stringify(value, Object.keys(value || {}).sort());
    } catch (_error) {
      return safeString(value);
    }
  }

  function scanCanvasSurface() {
    const empty = {
      canvasMountFound: false,
      canvasMountSelector: CANVAS_MOUNT_SELECTOR,
      canvasElementFound: false,
      canvasSelector: "UNKNOWN",
      canvasInMount: false,
      canvasRectNonzero: false,
      canvasComputedVisible: false,
      canvasContext2DReady: false,
      canvasPixelSampleStatus: "NO_PIXEL_SAMPLE",
      canvasVisiblePixelCount: 0,
      canvasDomSurfaceMounted: false,
      canvasDomSurfaceProofReady: false
    };

    if (!doc) return empty;

    const mount =
      doc.getElementById("hearthCanvasMount") ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-canvas-mount]") ||
      q("[data-hearth-visible-planet-mount]");

    const stage =
      doc.getElementById("hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-planet-stage]");

    const canvasSelectors = [
      "#hearthCanvasMount canvas",
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-canvas='true']",
      "canvas[data-hearth-canvas-texture='true']",
      "canvas[data-hearth-planet-canvas='true']",
      "canvas"
    ];

    let canvas = null;
    let selector = "UNKNOWN";

    for (const candidate of canvasSelectors) {
      canvas = q(candidate);
      if (canvas) {
        selector = candidate;
        break;
      }
    }

    let rect = null;
    try {
      rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {
      rect = null;
    }

    const attrWidth = safeNumber(canvas && canvas.width, 0);
    const attrHeight = safeNumber(canvas && canvas.height, 0);
    const rectWidth = safeNumber(rect && rect.width, 0);
    const rectHeight = safeNumber(rect && rect.height, 0);

    const rectNonzero = Boolean(canvas && ((attrWidth > 0 && attrHeight > 0) || (rectWidth > 0 && rectHeight > 0)));

    let computedVisible = false;
    try {
      if (canvas && root.getComputedStyle) {
        const style = root.getComputedStyle(canvas);
        computedVisible = Boolean(
          style &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          safeNumber(style.opacity, 1) > 0
        );
      }
    } catch (_error) {
      computedVisible = rectNonzero;
    }

    let context2DReady = false;
    let pixelStatus = "NO_PIXEL_SAMPLE";
    let visiblePixelCount = 0;

    try {
      if (canvas && isFunction(canvas.getContext)) {
        const ctx = canvas.getContext("2d");
        context2DReady = Boolean(ctx);

        if (ctx && rectNonzero && attrWidth > 0 && attrHeight > 0) {
          const sampleWidth = Math.max(1, Math.min(8, attrWidth));
          const sampleHeight = Math.max(1, Math.min(8, attrHeight));
          const data = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;

          for (let index = 3; index < data.length; index += 4) {
            if (data[index] > 0) visiblePixelCount += 1;
          }

          pixelStatus = visiblePixelCount > 0 ? "PIXEL_SAMPLE_VISIBLE" : "PIXEL_SAMPLE_TRANSPARENT";
        }
      }
    } catch (error) {
      pixelStatus = `PIXEL_SAMPLE_UNREADABLE:${safeString(error && error.message ? error.message : error).slice(0, 120)}`;
    }

    const canvasInMount = Boolean(canvas && mount && mount.contains(canvas));
    const mounted = Boolean(canvas && rectNonzero && computedVisible);
    const proofReady = Boolean(mounted || visiblePixelCount > 0);

    return {
      canvasMountFound: Boolean(mount || stage),
      canvasMountSelector: mount ? CANVAS_MOUNT_SELECTOR : stage ? GLOBE_STAGE_SELECTOR : "UNKNOWN",
      canvasElementFound: Boolean(canvas),
      canvasSelector: selector,
      canvasInMount,
      canvasRectNonzero: rectNonzero,
      canvasComputedVisible: computedVisible,
      canvasContext2DReady: context2DReady,
      canvasPixelSampleStatus: pixelStatus,
      canvasVisiblePixelCount: visiblePixelCount,
      canvasDomSurfaceMounted: mounted,
      canvasDomSurfaceProofReady: proofReady
    };
  }

  function readIndexSummary() {
    const found = firstGlobal(INDEX_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};

    const contract = firstNonEmpty(
      readField(receipt, ["contract", "CONTRACT"]),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      datasetValue("hearthIndexJsContract")
    );

    const observed = Boolean(
      found.value ||
      contract ||
      datasetValue("hearthIndexJsLoaded") === "true" ||
      datasetValue("hearthFrontendButtonAuthorityRestored") === "true" ||
      scriptByPath(INDEX_FILE)
    );

    return {
      observed,
      source: found.name,
      contract: contract || "UNKNOWN",
      contractRecognized: !contract || contract === EXPECTED_INDEX_CONTRACT,
      passiveButtonCorridorActive: Boolean(
        readField(receipt, ["passiveButtonCorridorActive", "passiveReceiptCorridorActive"], false) ||
        datasetValue("hearthIndexPassiveButtonCorridorActive") === "true" ||
        datasetValue("hearthIndexPassiveReceiptCorridorActive") === "true" ||
        observed
      ),
      noDynamicScriptInjection: Boolean(
        readField(receipt, ["noDynamicScriptInjection", "activeVisibleExpressionLoaderRetired"], false) ||
        datasetValue("hearthIndexNoDynamicScriptInjection") === "true" ||
        datasetValue("hearthIndexActiveVisibleExpressionLoaderRetired") === "true" ||
        observed
      )
    };
  }

  function readControlSummary() {
    const found = firstGlobal(CONTROL_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const script = scriptByPath(CONTROL_FILE);

    const contract = firstNonEmpty(
      readField(receipt, ["controlContract", "controlsContract", "contract", "CONTRACT"]),
      found.value && found.value.controlContract,
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      datasetValue("hearthControlContract"),
      datasetValue("hearthControlsContract"),
      datasetValue("hearthSouthControlFileContract")
    );

    const receiptName = firstNonEmpty(
      readField(receipt, ["controlReceipt", "controlsReceipt", "receipt", "RECEIPT"]),
      found.value && found.value.controlReceipt,
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      datasetValue("hearthControlReceipt"),
      datasetValue("hearthControlsReceipt"),
      datasetValue("hearthSouthControlFileReceipt")
    );

    const receiverReady = Boolean(found.value && (
      isFunction(found.value.consumeRouteConductorControlHandshake) ||
      isFunction(found.value.receiveRouteConductorControlHandshake) ||
      isFunction(found.value.consumeControlHandshake) ||
      isFunction(found.value.receiveControlHandshake) ||
      isFunction(found.value.receiveControlHandshakePacket) ||
      isFunction(found.value.acceptControlHandshakePacket)
    ));

    const accepted = Boolean(
      safeBool(readField(receipt, [
        "handshakeAccepted",
        "controlHandshakeAccepted",
        "routeConductorControlHandshakeAccepted",
        "inputAdmissionOpen",
        "inputBound"
      ], false), false) ||
      state.controlHandshakeAcceptedByQueen
    );

    const observed = Boolean(found.value || contract || receiptName || script);

    state.controlAuthorityObserved = observed;
    state.controlAuthoritySource = found.name;
    state.controlContract = contract || "UNKNOWN";
    state.controlReceipt = receiptName || "UNKNOWN";
    state.controlHandshakeAcceptedByQueen = accepted;
    state.controlHandshakeStatus = accepted
      ? "QUEEN_HANDSHAKE_ACCEPTED"
      : receiverReady
        ? "QUEEN_HANDSHAKE_READY_FOR_DELIVERY"
        : observed
          ? "WAITING_QUEEN_HANDSHAKE_RECEIVER"
          : "WAITING_CONTROL_AUTHORITY";

    return {
      authority: found.value,
      observed,
      source: found.name,
      contract: contract || "UNKNOWN",
      receipt: receiptName || "UNKNOWN",
      contractRecognized: contract === EXPECTED_CONTROL_CONTRACT,
      receiverReady,
      handshakeAccepted: accepted,
      scriptPresent: Boolean(script)
    };
  }

  function readCanvasSummary() {
    const found = firstGlobal(CANVAS_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const script = scriptByPath(CANVAS_FILE);
    const surface = scanCanvasSurface();

    const contract = firstNonEmpty(
      readField(receipt, [
        "currentCanvasParentContract",
        "canvasLocalStationContract",
        "canvasContract",
        "currentCanvasContract",
        "contract",
        "CONTRACT"
      ]),
      found.value && found.value.currentCanvasParentContract,
      found.value && found.value.canvasContract,
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      datasetValue("hearthCanvasContract"),
      datasetValue("hearthSouthCurrentCanvasParentContract")
    );

    const receiptName = firstNonEmpty(
      readField(receipt, [
        "currentCanvasParentReceipt",
        "canvasLocalStationReceipt",
        "canvasReceipt",
        "currentCanvasReceipt",
        "receipt",
        "RECEIPT"
      ]),
      found.value && found.value.currentCanvasParentReceipt,
      found.value && found.value.canvasReceipt,
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      datasetValue("hearthCanvasReceipt"),
      datasetValue("hearthSouthCurrentCanvasParentReceipt")
    );

    const contractRecognized = Boolean(contract && ACTIVE_CANVAS_CONTRACTS.includes(contract));

    const publicApiReady = Boolean(found.value && (
      isFunction(found.value.getReceipt) ||
      isFunction(found.value.getReceiptLight) ||
      isFunction(found.value.getCanvasStationReceipt) ||
      isFunction(found.value.getVisiblePlanetReceipt) ||
      isFunction(found.value.boot) ||
      isFunction(found.value.init) ||
      isFunction(found.value.start) ||
      isFunction(found.value.mount) ||
      isFunction(found.value.receiveRouteConductorReleasePacket) ||
      isFunction(found.value.consumeRouteConductorReleasePacket) ||
      isFunction(found.value.receiveReleasePacket) ||
      isFunction(found.value.consumeReleasePacket) ||
      isFunction(found.value.acceptReleasePacket)
    ));

    const releaseReceiverReady = Boolean(found.value && (
      isFunction(found.value.receiveRouteConductorReleasePacket) ||
      isFunction(found.value.consumeRouteConductorReleasePacket) ||
      isFunction(found.value.receiveReleasePacket) ||
      isFunction(found.value.consumeReleasePacket) ||
      isFunction(found.value.receiveCanvasReleasePacket) ||
      isFunction(found.value.acceptReleasePacket) ||
      isFunction(found.value.boot) ||
      isFunction(found.value.init) ||
      isFunction(found.value.start) ||
      isFunction(found.value.mount)
    ));

    const visiblePlanetProofReady = Boolean(
      surface.canvasDomSurfaceProofReady ||
      safeBool(readField(receipt, [
        "visiblePlanetProofReady",
        "currentVisibleProofValid",
        "domVisiblePlanetProofReady",
        "canvasMounted",
        "canvasDrawComplete",
        "baseGlobeDrawComplete",
        "baseGlobeVisibleCarrierReady"
      ], false), false) ||
      datasetValue("hearthCanvasVisiblePlanetProofReady") === "true" ||
      datasetValue("hearthSouthVisiblePlanetProofReady") === "true"
    );

    const observed = Boolean(
      found.value ||
      contract ||
      receiptName ||
      script ||
      surface.canvasElementFound ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasHubActive") === "true" ||
      datasetValue("hearthCanvasExpressionHubActive") === "true"
    );

    state.canvasAuthorityObserved = observed && Boolean(found.value || contract || receiptName);
    state.canvasAuthoritySource = found.name;
    state.canvasContract = contract || "UNKNOWN";
    state.canvasReceipt = receiptName || "UNKNOWN";
    state.canvasContractRecognized = contractRecognized;
    state.canvasPublicApiReady = publicApiReady;
    state.canvasReleaseReceiverReady = releaseReceiverReady;

    Object.assign(state, surface);

    return {
      authority: found.value,
      observed,
      authorityObserved: Boolean(found.value || contract || receiptName),
      source: found.name,
      contract: contract || "UNKNOWN",
      receipt: receiptName || "UNKNOWN",
      contractRecognized,
      publicApiReady,
      releaseReceiverReady,
      scriptPresent: Boolean(script),
      visiblePlanetProofReady,
      visiblePlanetProofSource: visiblePlanetProofReady
        ? surface.canvasDomSurfaceProofReady
          ? "DOM_CANVAS_SURFACE"
          : "CANVAS_AUTHORITY_RECEIPT"
        : "NONE",
      receiptObject: receipt,
      surface
    };
  }

  function admitScript(config) {
    const path = config.path;
    const id = config.id;
    const src = config.src;
    const role = config.role;
    const reason = config.reason;

    if (!doc) {
      return {
        attempted: true,
        admitted: false,
        status: `${role}_ADMISSION_HELD_DOCUMENT_UNAVAILABLE`,
        reason: "DOCUMENT_UNAVAILABLE"
      };
    }

    const existing = scriptByPath(path) || (id ? doc.getElementById(id) : null);

    if (existing) {
      if (isFunction(existing.addEventListener)) {
        existing.addEventListener("load", () => {
          if (role === "CANVAS") {
            state.canvasScriptLoadComplete = true;
            state.canvasScriptLoadError = "";
            state.canvasScriptAdmissionStatus = "CANVAS_SCRIPT_LOAD_COMPLETE_WAITING_AUTHORITY";
          } else {
            state.controlScriptLoadComplete = true;
            state.controlScriptLoadError = "";
            state.controlScriptAdmissionStatus = "QUEEN_SCRIPT_LOAD_COMPLETE_WAITING_AUTHORITY";
          }
          refresh({ allowAdmission: true, allowDelivery: true, reason: `${role.toLowerCase()}-existing-script-load` });
        }, { once: true });

        existing.addEventListener("error", () => {
          if (role === "CANVAS") {
            state.canvasScriptLoadError = "CANVAS_SCRIPT_LOAD_ERROR";
            state.canvasScriptAdmissionStatus = "CANVAS_SCRIPT_LOAD_ERROR";
          } else {
            state.controlScriptLoadError = "QUEEN_CONTROL_SCRIPT_LOAD_ERROR";
            state.controlScriptAdmissionStatus = "QUEEN_CONTROL_SCRIPT_LOAD_ERROR";
          }
          refresh({ allowAdmission: false, allowDelivery: false, reason: `${role.toLowerCase()}-existing-script-error` });
        }, { once: true });
      }

      return {
        attempted: true,
        admitted: false,
        status: `${role}_SCRIPT_ALREADY_PRESENT_WAITING_AUTHORITY`,
        reason: "SCRIPT_ELEMENT_ALREADY_PRESENT",
        element: existing
      };
    }

    try {
      const script = doc.createElement("script");
      script.id = id;
      script.src = src;
      script.async = false;
      script.defer = true;
      script.dataset.admittedBy = CONTRACT;
      script.dataset.renewalAdmittedBy = RENEWAL_CONTRACT;
      script.dataset.role = role;
      script.dataset.reason = reason;
      script.dataset.routeConductorOwnsAdmission = "true";
      script.dataset.canvasDrawingAuthorized = "false";
      script.dataset.canvasCreationAuthorizedByRoute = "false";
      script.dataset.routeRepairAuthorized = "false";
      script.dataset.f13Claimed = "false";
      script.dataset.f21Claimed = "false";
      script.dataset.readyTextClaimed = "false";
      script.dataset.visualPassClaimed = "false";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";

      script.addEventListener("load", () => {
        if (role === "CANVAS") {
          state.canvasScriptLoadComplete = true;
          state.canvasScriptLoadError = "";
          state.canvasScriptAdmissionStatus = "CANVAS_SCRIPT_LOAD_COMPLETE_WAITING_AUTHORITY";
          state.canvasScriptAdmissionReason = "SCRIPT_LOAD_EVENT";
        } else {
          state.controlScriptLoadComplete = true;
          state.controlScriptLoadError = "";
          state.controlScriptAdmissionStatus = "QUEEN_SCRIPT_LOAD_COMPLETE_WAITING_AUTHORITY";
          state.controlScriptAdmissionReason = "SCRIPT_LOAD_EVENT";
        }

        record(`${role}_SCRIPT_LOAD_COMPLETE_BY_ROUTE_CONDUCTOR_V10_1`, { src, reason });
        refresh({ allowAdmission: true, allowDelivery: true, reason: `${role.toLowerCase()}-script-load` });
        scheduleWatchdog();
      }, { once: true });

      script.addEventListener("error", () => {
        if (role === "CANVAS") {
          state.canvasScriptLoadComplete = false;
          state.canvasScriptLoadError = "CANVAS_SCRIPT_LOAD_ERROR";
          state.canvasScriptAdmissionStatus = "CANVAS_SCRIPT_LOAD_ERROR";
          state.canvasScriptAdmissionReason = "SCRIPT_ERROR_EVENT";
        } else {
          state.controlScriptLoadComplete = false;
          state.controlScriptLoadError = "QUEEN_CONTROL_SCRIPT_LOAD_ERROR";
          state.controlScriptAdmissionStatus = "QUEEN_CONTROL_SCRIPT_LOAD_ERROR";
          state.controlScriptAdmissionReason = "SCRIPT_ERROR_EVENT";
        }

        recordError(`${role}_SCRIPT_LOAD_ERROR_BY_ROUTE_CONDUCTOR_V10_1`, `${role}_SCRIPT_LOAD_ERROR`, { src, reason });
        refresh({ allowAdmission: false, allowDelivery: false, reason: `${role.toLowerCase()}-script-error` });
      }, { once: true });

      (doc.head || doc.documentElement || doc.body).appendChild(script);

      return {
        attempted: true,
        admitted: true,
        status: `${role}_SCRIPT_ADMITTED_BY_ROUTE_CONDUCTOR`,
        reason,
        element: script
      };
    } catch (error) {
      recordError(`${role}_SCRIPT_ADMISSION_FAILED_BY_ROUTE_CONDUCTOR_V10_1`, error, { src, reason });

      return {
        attempted: true,
        admitted: false,
        status: `${role}_SCRIPT_ADMISSION_FAILED`,
        reason: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function admitCanvasScript(reason = "route-conductor-canvas-dom-surface-admission") {
    const canvas = readCanvasSummary();

    state.canvasScriptAdmissionAttempted = true;

    if (canvas.authorityObserved && canvas.authority) {
      state.canvasScriptAdmissionStatus = "CANVAS_AUTHORITY_ALREADY_PRESENT";
      state.canvasScriptAdmissionReason = "NO_SCRIPT_INJECTION_REQUIRED";
      state.canvasScriptElementFound = Boolean(scriptByPath(CANVAS_FILE));
      state.canvasScriptElementSrc = state.canvasScriptElementFound ? safeString(scriptByPath(CANVAS_FILE).getAttribute("src"), "") : "";
      state.canvasScriptLoadComplete = true;
      return {
        attempted: true,
        admitted: false,
        status: state.canvasScriptAdmissionStatus,
        reason: state.canvasScriptAdmissionReason
      };
    }

    const result = admitScript({
      path: CANVAS_FILE,
      id: CANVAS_SCRIPT_ID,
      src: CANVAS_SCRIPT_SRC,
      role: "CANVAS",
      reason
    });

    state.canvasScriptAdmissionStatus = result.status;
    state.canvasScriptAdmissionReason = result.reason;
    state.canvasScriptElementFound = Boolean(result.element || scriptByPath(CANVAS_FILE));
    state.canvasScriptElementSrc = result.element
      ? safeString(result.element.getAttribute("src"), "")
      : scriptByPath(CANVAS_FILE)
        ? safeString(scriptByPath(CANVAS_FILE).getAttribute("src"), "")
        : "";
    state.canvasScriptInjectedByRouteConductor = Boolean(result.element && result.element.id === CANVAS_SCRIPT_ID);

    return result;
  }

  function admitControlScript(reason = "route-conductor-queen-control-admission") {
    const control = readControlSummary();

    state.controlScriptAdmissionAttempted = true;

    if (control.observed && control.authority) {
      state.controlScriptAdmissionStatus = "QUEEN_AUTHORITY_ALREADY_PRESENT";
      state.controlScriptAdmissionReason = "NO_SCRIPT_INJECTION_REQUIRED";
      state.controlScriptElementFound = Boolean(scriptByPath(CONTROL_FILE));
      state.controlScriptElementSrc = state.controlScriptElementFound ? safeString(scriptByPath(CONTROL_FILE).getAttribute("src"), "") : "";
      state.controlScriptLoadComplete = true;
      return {
        attempted: true,
        admitted: false,
        status: state.controlScriptAdmissionStatus,
        reason: state.controlScriptAdmissionReason
      };
    }

    const result = admitScript({
      path: CONTROL_FILE,
      id: CONTROL_SCRIPT_ID,
      src: CONTROL_SCRIPT_SRC,
      role: "QUEEN",
      reason
    });

    state.controlScriptAdmissionStatus = result.status;
    state.controlScriptAdmissionReason = result.reason;
    state.controlScriptElementFound = Boolean(result.element || scriptByPath(CONTROL_FILE));
    state.controlScriptElementSrc = result.element
      ? safeString(result.element.getAttribute("src"), "")
      : scriptByPath(CONTROL_FILE)
        ? safeString(scriptByPath(CONTROL_FILE).getAttribute("src"), "")
        : "";
    state.controlScriptInjectedByRouteConductor = Boolean(result.element && result.element.id === CONTROL_SCRIPT_ID);

    return result;
  }

  function composeCanvasReleasePacket(canvas) {
    const releaseAuthorized = Boolean(canvas && canvas.authorityObserved && canvas.releaseReceiverReady);

    const packet = {
      packetType: "ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_RELEASE_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,

      sourceFile: FILE,
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      route: ROUTE,
      targetRoute: ROUTE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      canvasFile: CANVAS_FILE,
      canvasMountSelector: CANVAS_MOUNT_SELECTOR,
      globeStageSelector: GLOBE_STAGE_SELECTOR,

      hierarchyVersion: HIERARCHY_VERSION,
      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      activeFibonacci: "F13_HELD",
      handoffTo: releaseAuthorized ? "CANVAS" : "",

      canvasDomSurfaceAdmissionActive: true,
      canvasScriptAdmissionRequired: true,
      canvasScriptAdmissionAttempted: state.canvasScriptAdmissionAttempted,
      canvasScriptAdmissionStatus: state.canvasScriptAdmissionStatus,
      canvasAuthorityObserved: Boolean(canvas && canvas.authorityObserved),
      canvasAuthoritySource: canvas ? canvas.source : "NONE",
      currentCanvasParentContract: canvas ? canvas.contract : "UNKNOWN",
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      canvasContractRecognized: Boolean(canvas && canvas.contractRecognized),
      canvasPublicApiReady: Boolean(canvas && canvas.publicApiReady),
      canvasReleaseReceiverReady: Boolean(canvas && canvas.releaseReceiverReady),

      canvasReleaseAuthorized: releaseAuthorized,
      canvasReleasePacketReady: releaseAuthorized,
      canvasReleaseHeldReason: releaseAuthorized
        ? "NONE_CANVAS_RELEASE_AUTHORIZED_FOR_PUBLIC_API"
        : !canvas || !canvas.authorityObserved
          ? "WAITING_CANVAS_AUTHORITY_PUBLICATION"
          : !canvas.releaseReceiverReady
            ? "WAITING_CANVAS_PUBLIC_RELEASE_RECEIVER"
            : "WAITING_CANVAS_RELEASE_AUTHORIZATION",

      routeConductorOwnsCanvasFileAdmission: true,
      routeConductorOwnsCanvasReleasePacketComposition: true,
      routeConductorOwnsCanvasDrawing: false,
      routeConductorOwnsCanvasCreation: false,
      routeConductorOwnsCanvasExpressionTruth: false,

      queenAdmissionDoesNotBlockVisibleGlobe: true,
      queenHandshakeDoesNotBlockVisibleGlobe: true,

      ...NO_CLAIMS,
      composedAt: nowIso()
    };

    state.currentCanvasReleasePacket = clonePlain(packet);
    return packet;
  }

  function deliverCanvasReleaseToPublicApi(canvas, packet) {
    if (!packet || packet.canvasReleaseAuthorized !== true) {
      state.canvasReleasePacketReady = false;
      state.canvasReleaseAuthorized = false;
      state.canvasReleasePacketDelivered = false;
      state.canvasReleaseDeliveryMethod = "NONE";
      state.canvasReleaseDeliveryReason = packet ? packet.canvasReleaseHeldReason : "WAITING_CANVAS_RELEASE_PACKET";

      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: state.canvasReleaseDeliveryReason
      };
    }

    state.canvasReleasePacketReady = true;
    state.canvasReleaseAuthorized = true;

    if (!canvas || !canvas.authority) {
      state.canvasReleasePacketDelivered = false;
      state.canvasReleaseDeliveryMethod = "NONE";
      state.canvasReleaseDeliveryReason = "WAITING_CANVAS_AUTHORITY_PUBLICATION";

      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: state.canvasReleaseDeliveryReason
      };
    }

    const signature = stableSignature({
      contract: packet.contract,
      renewalContract: packet.renewalContract,
      targetFile: packet.targetFile,
      canvasMountSelector: packet.canvasMountSelector,
      canvasAuthoritySource: packet.canvasAuthoritySource
    });

    if (
      state.lastCanvasReleasePacketSignature === signature &&
      state.canvasReleaseAcceptedByCanvas === true &&
      scanCanvasSurface().canvasElementFound
    ) {
      return {
        delivered: false,
        accepted: true,
        method: state.canvasReleaseDeliveryMethod || "previous-accepted-release",
        reason: "CANVAS_RELEASE_DUPLICATE_DELIVERY_BLOCKED_SURFACE_PRESENT"
      };
    }

    const authority = canvas.authority;
    const methods = [
      "consumeRouteConductorReleasePacket",
      "receiveRouteConductorReleasePacket",
      "consumeReleasePacket",
      "receiveReleasePacket",
      "receiveCanvasReleasePacket",
      "acceptReleasePacket",
      "boot",
      "init",
      "start",
      "mount"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        let result;

        if (method === "mount") {
          const mount = doc ? doc.getElementById("hearthCanvasMount") || q("[data-hearth-canvas-mount]") : null;
          result = authority[method]({
            routeConductorReleasePacket: clonePlain(packet),
            mount,
            mountSelector: CANVAS_MOUNT_SELECTOR,
            targetRoute: ROUTE,
            sourceFile: FILE,
            ...NO_CLAIMS
          });
        } else if (method === "boot" || method === "init" || method === "start") {
          result = authority[method]({
            routeConductorReleasePacket: clonePlain(packet),
            mountSelector: CANVAS_MOUNT_SELECTOR,
            targetRoute: ROUTE,
            sourceFile: FILE,
            ...NO_CLAIMS
          });
        } else {
          result = authority[method](clonePlain(packet));
        }

        const receipt = isObject(result) ? result : readAuthorityReceipt(authority) || {};
        const surface = scanCanvasSurface();

        const accepted = Boolean(
          surface.canvasElementFound ||
          safeBool(readField(receipt, [
            "canvasParentReleaseAccepted",
            "releasePacketAccepted",
            "parentReleaseLawful",
            "canvasParentReleaseLawful",
            "visiblePlanetProofReady",
            "domVisiblePlanetProofReady",
            "canvasMounted",
            "canvasDrawComplete",
            "baseGlobeDrawComplete"
          ], false), false)
        );

        state.lastCanvasReleasePacketSignature = signature;
        state.canvasReleasePacketDelivered = true;
        state.canvasReleaseAcceptedByCanvas = accepted;
        state.canvasReleaseDeliveryMethod = method;
        state.canvasReleaseDeliveryReason = accepted
          ? "CANVAS_AUTHORITY_ACCEPTED_RELEASE_OR_DOM_SURFACE_PRESENT"
          : "CANVAS_AUTHORITY_CALLED_BUT_DOM_SURFACE_NOT_CONFIRMED";

        Object.assign(state, surface);

        record("CANVAS_RELEASE_DELIVERED_BY_ROUTE_CONDUCTOR_V10_1", {
          method,
          accepted,
          canvasElementFound: surface.canvasElementFound,
          canvasRectNonzero: surface.canvasRectNonzero,
          canvasDomSurfaceProofReady: surface.canvasDomSurfaceProofReady
        });

        return {
          delivered: true,
          accepted,
          method,
          reason: state.canvasReleaseDeliveryReason,
          receipt: clonePlain(receipt)
        };
      } catch (error) {
        recordError("CANVAS_RELEASE_PUBLIC_API_METHOD_FAILED", error, { method });
      }
    }

    state.canvasReleasePacketDelivered = false;
    state.canvasReleaseAcceptedByCanvas = false;
    state.canvasReleaseDeliveryMethod = "NONE";
    state.canvasReleaseDeliveryReason = "CANVAS_PUBLIC_RELEASE_RECEIVER_MISSING_OR_FAILED";

    return {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: state.canvasReleaseDeliveryReason
    };
  }

  function composeControlHandshakePacket(control) {
    return {
      packetType: "ROUTE_CONDUCTOR_SHOWTIME_QUEEN_CONTROL_HANDSHAKE_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      sourceFile: FILE,
      destinationFile: CONTROL_FILE,
      targetFile: CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlReceipt: EXPECTED_CONTROL_RECEIPT,
      controlHandshakeRequired: true,
      controlHandshakeAuthorized: true,
      controlHandshakeReady: Boolean(control && control.receiverReady),
      controlHandshakeAcceptedByQueen: Boolean(control && control.handshakeAccepted),
      controlDoesNotBlockVisiblePlanet: true,
      canvasDomSurfaceAdmissionActive: true,
      visiblePlanetProofIndependentOfQueen: true,
      jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,
      ...NO_CLAIMS,
      composedAt: nowIso()
    };
  }

  function deliverControlHandshake(control, packet) {
    if (!control || !control.authority || !packet || !packet.controlHandshakeReady) {
      return {
        delivered: false,
        accepted: Boolean(control && control.handshakeAccepted),
        method: "NONE",
        reason: control && control.observed ? "WAITING_QUEEN_HANDSHAKE_RECEIVER" : "WAITING_CONTROL_AUTHORITY"
      };
    }

    if (control.handshakeAccepted || state.controlHandshakeAcceptedByQueen) {
      return {
        delivered: false,
        accepted: true,
        method: "previous-accepted-queen-handshake",
        reason: "QUEEN_HANDSHAKE_ALREADY_ACCEPTED"
      };
    }

    const methods = [
      "consumeRouteConductorControlHandshake",
      "receiveRouteConductorControlHandshake",
      "consumeControlHandshake",
      "receiveControlHandshake",
      "receiveControlHandshakePacket",
      "acceptControlHandshakePacket"
    ];

    for (const method of methods) {
      if (!isFunction(control.authority[method])) continue;

      try {
        const result = control.authority[method](clonePlain(packet));
        const receipt = isObject(result) ? result : readAuthorityReceipt(control.authority) || {};
        const accepted = Boolean(
          safeBool(readField(receipt, [
            "handshakeAccepted",
            "controlHandshakeAccepted",
            "routeConductorControlHandshakeAccepted",
            "inputAdmissionOpen",
            "inputBound"
          ], false), false) ||
          safeString(readField(receipt, ["handshakeStatus"], "")).includes("ACCEPTED")
        );

        state.controlHandshakeAcceptedByQueen = accepted;
        state.controlHandshakeStatus = accepted
          ? "QUEEN_HANDSHAKE_ACCEPTED"
          : "QUEEN_HANDSHAKE_DELIVERED_WAITING_ACCEPTANCE";

        record("QUEEN_HANDSHAKE_DELIVERED_BY_ROUTE_CONDUCTOR_V10_1", {
          method,
          accepted
        });

        return {
          delivered: true,
          accepted,
          method,
          reason: accepted ? "QUEEN_ACCEPTED_ROUTE_CONDUCTOR_HANDSHAKE" : "QUEEN_RETURNED_WITHOUT_ACCEPTANCE"
        };
      } catch (error) {
        recordError("QUEEN_HANDSHAKE_METHOD_FAILED", error, { method });
      }
    }

    return {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: "QUEEN_HANDSHAKE_RECEIVER_MISSING"
    };
  }

  function gate(id, passed, coordinate, nextFile, evidence = {}) {
    return {
      id,
      passed: Boolean(passed),
      firstFailedCoordinate: passed ? `NONE_${id}_PASSED` : coordinate,
      recommendedNextFile: nextFile,
      evidence: clonePlain(evidence)
    };
  }

  function composeGateBoard(canvas, control, index) {
    const htmlGate = gate(
      "HTML_SHELL_GATE",
      Boolean(doc && (q(CANVAS_MOUNT_SELECTOR) || q(GLOBE_STAGE_SELECTOR) || q("[data-hearth-canvas-mount]"))),
      "WAITING_HTML_VISIBLE_PLANET_MOUNT",
      HTML_FILE,
      {
        htmlDocumentPresent: Boolean(doc),
        canvasMountSelector: CANVAS_MOUNT_SELECTOR,
        globeStageSelector: GLOBE_STAGE_SELECTOR,
        canvasMountFound: state.canvasMountFound
      }
    );

    const indexGate = gate(
      "INDEX_PRIEST_GATE",
      Boolean(index.observed && index.contractRecognized && index.passiveButtonCorridorActive),
      !index.observed
        ? "WAITING_INDEX_PRIEST_AUTHORITY"
        : !index.contractRecognized
          ? "WAITING_EXPECTED_INDEX_CONTRACT"
          : "WAITING_INDEX_PASSIVE_BUTTON_CORRIDOR",
      INDEX_FILE,
      index
    );

    const routeGate = gate(
      "ROUTE_NORTH_BISHOP_GATE",
      true,
      "NONE_ROUTE_NORTH_BISHOP_READY",
      FILE,
      {
        routeConductorContract: CONTRACT,
        renewalContract: RENEWAL_CONTRACT,
        routeNorthBishopActive: true
      }
    );

    const canvasScriptGate = gate(
      "CANVAS_SCRIPT_ADMISSION_GATE",
      Boolean(state.canvasScriptAdmissionStatus !== "CANVAS_SCRIPT_LOAD_ERROR"),
      "CANVAS_SCRIPT_LOAD_ERROR",
      CANVAS_FILE,
      {
        canvasScriptAdmissionRequired: true,
        canvasScriptAdmissionAttempted: state.canvasScriptAdmissionAttempted,
        canvasScriptAdmissionStatus: state.canvasScriptAdmissionStatus,
        canvasScriptElementFound: state.canvasScriptElementFound,
        canvasScriptElementSrc: state.canvasScriptElementSrc,
        canvasScriptLoadComplete: state.canvasScriptLoadComplete,
        canvasScriptLoadError: state.canvasScriptLoadError
      }
    );

    const canvasAuthorityGate = gate(
      "CANVAS_AUTHORITY_GATE",
      Boolean(canvas.authorityObserved),
      state.canvasScriptLoadComplete
        ? "CANVAS_SCRIPT_LOAD_COMPLETE_AUTHORITY_NOT_PUBLISHED"
        : state.canvasScriptElementFound
          ? "CANVAS_SCRIPT_ADMITTED_WAITING_AUTHORITY"
          : "WAITING_CANVAS_SCRIPT_ADMISSION",
      CANVAS_FILE,
      canvas
    );

    const canvasReleaseGate = gate(
      "CANVAS_RELEASE_PUBLIC_API_GATE",
      Boolean(canvas.authorityObserved && canvas.releaseReceiverReady),
      canvas.authorityObserved
        ? "CANVAS_AUTHORITY_PRESENT_RELEASE_RECEIVER_NOT_FOUND"
        : canvasAuthorityGate.firstFailedCoordinate,
      CANVAS_FILE,
      {
        canvasAuthorityObserved: canvas.authorityObserved,
        canvasPublicApiReady: canvas.publicApiReady,
        canvasReleaseReceiverReady: canvas.releaseReceiverReady,
        canvasReleasePacketDelivered: state.canvasReleasePacketDelivered,
        canvasReleaseAcceptedByCanvas: state.canvasReleaseAcceptedByCanvas,
        canvasReleaseDeliveryMethod: state.canvasReleaseDeliveryMethod,
        canvasReleaseDeliveryReason: state.canvasReleaseDeliveryReason
      }
    );

    const canvasDomGate = gate(
      "CANVAS_DOM_SURFACE_GATE",
      Boolean(state.canvasElementFound && state.canvasDomSurfaceMounted),
      canvas.authorityObserved
        ? "CANVAS_AUTHORITY_PRESENT_DOM_SURFACE_NOT_MOUNTED"
        : canvasAuthorityGate.firstFailedCoordinate,
      CANVAS_FILE,
      {
        canvasMountFound: state.canvasMountFound,
        canvasElementFound: state.canvasElementFound,
        canvasSelector: state.canvasSelector,
        canvasInMount: state.canvasInMount,
        canvasRectNonzero: state.canvasRectNonzero,
        canvasComputedVisible: state.canvasComputedVisible,
        canvasContext2DReady: state.canvasContext2DReady,
        canvasPixelSampleStatus: state.canvasPixelSampleStatus,
        canvasVisiblePixelCount: state.canvasVisiblePixelCount,
        canvasDomSurfaceMounted: state.canvasDomSurfaceMounted,
        canvasDomSurfaceProofReady: state.canvasDomSurfaceProofReady
      }
    );

    const visibleGlobeGate = gate(
      "VISIBLE_GLOBE_GATE",
      Boolean(canvasDomGate.passed || canvas.visiblePlanetProofReady),
      canvasDomGate.firstFailedCoordinate,
      CANVAS_FILE,
      {
        visiblePlanetProofReady: Boolean(canvas.visiblePlanetProofReady || state.canvasDomSurfaceProofReady),
        visiblePlanetProofSource: canvas.visiblePlanetProofSource,
        diagnosticOnlyNoVisualPassClaim: true
      }
    );

    const queenAdmissionGate = gate(
      "QUEEN_ADMISSION_GATE",
      Boolean(control.observed),
      "QUEEN_ADMISSION_WAITING_NON_BLOCKING_FOR_VISIBLE_GLOBE",
      CONTROL_FILE,
      control
    );

    const queenHandshakeGate = gate(
      "QUEEN_HANDSHAKE_GATE",
      Boolean(control.handshakeAccepted),
      "QUEEN_HANDSHAKE_WAITING_NON_BLOCKING_FOR_VISIBLE_GLOBE",
      control.observed ? FILE : CONTROL_FILE,
      control
    );

    const gates = [
      htmlGate,
      indexGate,
      routeGate,
      canvasScriptGate,
      canvasAuthorityGate,
      canvasReleaseGate,
      canvasDomGate,
      visibleGlobeGate,
      queenAdmissionGate,
      queenHandshakeGate
    ];

    const blockingForVisible = [
      htmlGate,
      indexGate,
      routeGate,
      canvasScriptGate,
      canvasAuthorityGate,
      canvasReleaseGate,
      canvasDomGate,
      visibleGlobeGate
    ];

    const firstFailed = blockingForVisible.find((item) => !item.passed) || null;
    const satisfied = gates.filter((item) => item.passed).length;

    return {
      gates,
      chronologicalGateCount: gates.length,
      chronologicalGatesSatisfied: satisfied,
      chronologicalFirstFailedGate: firstFailed ? firstFailed.id : "NONE",
      chronologicalFirstFailedCoordinate: firstFailed ? firstFailed.firstFailedCoordinate : "NONE_CANVAS_DOM_SURFACE_CONFIRMED",
      recommendedNextFile: firstFailed ? firstFailed.recommendedNextFile : LAB_NORTH_FILE,
      visibleBlockingFirstFailed: firstFailed
    };
  }

  function composeFibonacciAudit(board, canvas) {
    const f1 = Boolean(board.gates.find((g) => g.id === "HTML_SHELL_GATE" && g.passed));
    const f2 = Boolean(board.gates.find((g) => g.id === "INDEX_PRIEST_GATE" && g.passed));
    const f3 = Boolean(board.gates.find((g) => g.id === "ROUTE_NORTH_BISHOP_GATE" && g.passed));
    const f5 = Boolean(board.gates.find((g) => g.id === "CANVAS_SCRIPT_ADMISSION_GATE" && g.passed));
    const f8 = Boolean(board.gates.find((g) => g.id === "CANVAS_AUTHORITY_GATE" && g.passed));
    const f13 = Boolean(board.gates.find((g) => g.id === "CANVAS_DOM_SURFACE_GATE" && g.passed));
    const f21 = false;

    const ladder = [
      { key: "F1", label: "HTML visible mount exists", passed: f1, file: HTML_FILE },
      { key: "F2", label: "Index priest passive corridor observed", passed: f2, file: INDEX_FILE },
      { key: "F3", label: "Route North Bishop active", passed: f3, file: FILE },
      { key: "F5", label: "Canvas script admitted or admissible", passed: f5, file: CANVAS_FILE },
      { key: "F8", label: "Canvas authority observed", passed: f8, file: CANVAS_FILE },
      { key: "F13", label: "Canvas DOM surface mounted", passed: f13, file: CANVAS_FILE },
      { key: "F21", label: "North-only latch held", passed: f21, file: LAB_NORTH_FILE }
    ];

    const visibleLadder = ladder.slice(0, 6);
    const visiblePassed = visibleLadder.filter((item) => item.passed).length;
    const score = Math.round((visiblePassed / visibleLadder.length) * 100);
    const firstFailed = visibleLadder.find((item) => !item.passed);

    return {
      fibonacciLadder: ladder,
      fibonacciSynchronizationScore: score,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationPassed: Boolean(f13),
      fibonacciSynchronizationDegraded: Boolean(canvas.visiblePlanetProofReady && !f13),
      fibonacciSynchronizationHardFail: false,
      fibonacciSynchronizationHoldReason: f13
        ? "NONE_CANVAS_DOM_SURFACE_CONFIRMED"
        : firstFailed
          ? `WAITING_${firstFailed.key}`
          : board.chronologicalFirstFailedCoordinate,
      f21EligibleForNorth: false,
      f21NorthOnly: true,
      routeMayPublishF21EligibilityOnly: true,
      ...NO_CLAIMS
    };
  }

  function selectPostgameStatus(board, canvas) {
    if (state.canvasElementFound && state.canvasDomSurfaceMounted) {
      return "CANVAS_MOUNTED_DOM_SURFACE_CONFIRMED";
    }

    if (canvas.authorityObserved && state.canvasReleasePacketDelivered) {
      return "CANVAS_AUTHORITY_PRESENT_RELEASE_DELIVERED";
    }

    if (canvas.authorityObserved && !state.canvasElementFound) {
      return "CANVAS_AUTHORITY_PRESENT_DOM_SURFACE_NOT_MOUNTED";
    }

    if (state.canvasScriptLoadComplete && !canvas.authorityObserved) {
      return "CANVAS_SCRIPT_LOAD_COMPLETE_AUTHORITY_NOT_PUBLISHED";
    }

    if (state.canvasScriptElementFound && !canvas.authorityObserved) {
      return "CANVAS_SCRIPT_ADMITTED_WAITING_AUTHORITY";
    }

    return board.chronologicalFirstFailedCoordinate || "WAITING_CANVAS_DOM_SURFACE_ADMISSION";
  }

  function composePrimaryPacket(options = {}) {
    const allowAdmission = options.allowAdmission !== false;
    const allowDelivery = options.allowDelivery !== false;

    if (allowAdmission) {
      admitCanvasScript(options.reason || "compose-primary-packet-canvas-admission");
      admitControlScript(options.reason || "compose-primary-packet-control-admission");
    }

    let canvas = readCanvasSummary();
    let control = readControlSummary();
    const index = readIndexSummary();

    const releasePacket = composeCanvasReleasePacket(canvas);
    let canvasDelivery = {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: "DELIVERY_NOT_REQUESTED"
    };

    if (allowDelivery) {
      canvasDelivery = deliverCanvasReleaseToPublicApi(canvas, releasePacket);
      canvas = readCanvasSummary();
    }

    const controlHandshakePacket = composeControlHandshakePacket(control);
    let controlDelivery = {
      delivered: false,
      accepted: Boolean(control.handshakeAccepted),
      method: "NONE",
      reason: "DELIVERY_NOT_REQUESTED"
    };

    if (allowDelivery) {
      controlDelivery = deliverControlHandshake(control, controlHandshakePacket);
      control = readControlSummary();
    }

    const board = composeGateBoard(canvas, control, index);
    const fibonacci = composeFibonacciAudit(board, canvas);
    const postgameStatus = selectPostgameStatus(board, canvas);

    const recommendedNextFile =
      postgameStatus === "CANVAS_MOUNTED_DOM_SURFACE_CONFIRMED"
        ? LAB_NORTH_FILE
        : CANVAS_FILE;

    const recommendedNextAction =
      postgameStatus === "CANVAS_MOUNTED_DOM_SURFACE_CONFIRMED"
        ? "RERUN_DIAGNOSTIC_RAIL_TO_CONFIRM_CANVAS_SURFACE_TRUTH"
        : postgameStatus === "CANVAS_SCRIPT_ADMITTED_WAITING_AUTHORITY"
          ? "WAIT_FOR_CANVAS_SCRIPT_LOAD_OR_VERIFY_CANVAS_FILE_PUBLICATION"
          : postgameStatus === "CANVAS_SCRIPT_LOAD_COMPLETE_AUTHORITY_NOT_PUBLISHED"
            ? "AUDIT_CANVAS_FILE_PUBLIC_GLOBAL_AND_RECEIPT_PUBLICATION"
            : postgameStatus === "CANVAS_AUTHORITY_PRESENT_DOM_SURFACE_NOT_MOUNTED"
              ? "AUDIT_CANVAS_PUBLIC_API_MOUNT_PATH_AND_DOM_SURFACE_CREATION"
              : "RENEW_CANVAS_TO_CREATE_OR_BIND_DOM_CANVAS_SURFACE";

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV98Contract: LINEAGE_V9_8_CONTRACT,
      lineageV98Receipt: LINEAGE_V9_8_RECEIPT,
      lineageV97Contract: LINEAGE_V9_7_CONTRACT,
      lineageV97Receipt: LINEAGE_V9_7_RECEIPT,
      lineageV96Contract: LINEAGE_V9_6_CONTRACT,
      lineageV96Receipt: LINEAGE_V9_6_RECEIPT,
      lineageV95Contract: LINEAGE_V9_5_CONTRACT,
      lineageV95Receipt: LINEAGE_V9_5_RECEIPT,
      compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
      compatibilityRouteConductorReceipt: COMPAT_V9_4_RECEIPT,
      version: VERSION,

      file: FILE,
      route: ROUTE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      hierarchyVersion: HIERARCHY_VERSION,
      role: "showtime-route-conductor-canvas-dom-surface-admission-and-release",
      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      activeFibonacci: "F13_HELD",

      routeNorthBishopActive: true,
      canvasDomSurfaceAdmissionActive: true,
      routeConductorOwnsCanvasFileAdmission: true,
      routeConductorOwnsCanvasReleasePacketComposition: true,
      routeConductorOwnsCanvasReleaseDelivery: true,
      routeConductorOwnsCanvasDrawing: false,
      routeConductorOwnsCanvasCreation: false,
      routeConductorOwnsCanvasExpressionTruth: false,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlReceipt: EXPECTED_CONTROL_RECEIPT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      cardinalBishops: {
        north: LAB_NORTH_FILE,
        east: LAB_EAST_FILE,
        south: LAB_SOUTH_FILE,
        west: LAB_WEST_FILE
      },

      indexPriestObserved: index.observed,
      indexPriestSource: index.source,
      indexPriestContract: index.contract,
      indexPriestContractRecognized: index.contractRecognized,
      indexPassiveButtonCorridorActive: index.passiveButtonCorridorActive,
      indexNoDynamicScriptInjection: index.noDynamicScriptInjection,

      canvasScriptAdmissionRequired: true,
      canvasScriptAdmissionAttempted: state.canvasScriptAdmissionAttempted,
      canvasScriptAdmissionStatus: state.canvasScriptAdmissionStatus,
      canvasScriptAdmissionReason: state.canvasScriptAdmissionReason,
      canvasScriptElementFound: state.canvasScriptElementFound,
      canvasScriptElementSrc: state.canvasScriptElementSrc,
      canvasScriptInjectedByRouteConductor: state.canvasScriptInjectedByRouteConductor,
      canvasScriptLoadComplete: state.canvasScriptLoadComplete,
      canvasScriptLoadError: state.canvasScriptLoadError,

      canvasAuthorityObserved: canvas.authorityObserved,
      canvasAuthoritySource: canvas.source,
      currentCanvasParentObserved: canvas.authorityObserved,
      currentCanvasParentContract: canvas.contract,
      currentCanvasParentReceipt: canvas.receipt,
      currentCanvasParentContractObserved: Boolean(canvas.contract && canvas.contract !== "UNKNOWN"),
      canvasV123Recognized: canvas.contract === EXPECTED_CANVAS_CONTRACT,
      canvasContractRecognized: canvas.contractRecognized,
      canvasContractAccepted: Boolean(canvas.contractRecognized || canvas.visiblePlanetProofReady),
      canvasPublicApiReady: canvas.publicApiReady,
      canvasReleaseReceiverReady: canvas.releaseReceiverReady,

      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasElementFound: state.canvasElementFound,
      canvasSelector: state.canvasSelector,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasContext2DReady: state.canvasContext2DReady,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,
      canvasDomSurfaceMounted: state.canvasDomSurfaceMounted,
      canvasDomSurfaceProofReady: state.canvasDomSurfaceProofReady,

      visiblePlanetProofReady: Boolean(canvas.visiblePlanetProofReady || state.canvasDomSurfaceProofReady),
      visiblePlanetProofSource: canvas.visiblePlanetProofReady
        ? canvas.visiblePlanetProofSource
        : state.canvasDomSurfaceProofReady
          ? "DOM_CANVAS_SURFACE"
          : "NONE",

      canvasReleasePacket: clonePlain(releasePacket),
      canvasReleasePacketReady: releasePacket.canvasReleasePacketReady,
      canvasReleaseAuthorized: releasePacket.canvasReleaseAuthorized,
      canvasReleaseHeldReason: releasePacket.canvasReleaseHeldReason,
      canvasReleasePacketDelivered: canvasDelivery.delivered,
      canvasReleaseAcceptedByCanvas: canvasDelivery.accepted,
      canvasReleaseDeliveryMethod: canvasDelivery.method,
      canvasReleaseDeliveryReason: canvasDelivery.reason,

      controlScriptAdmissionRequired: true,
      controlScriptAdmissionAttempted: state.controlScriptAdmissionAttempted,
      controlScriptAdmissionStatus: state.controlScriptAdmissionStatus,
      controlScriptAdmissionReason: state.controlScriptAdmissionReason,
      controlScriptElementFound: state.controlScriptElementFound,
      controlScriptElementSrc: state.controlScriptElementSrc,
      controlScriptInjectedByRouteConductor: state.controlScriptInjectedByRouteConductor,
      controlScriptLoadComplete: state.controlScriptLoadComplete,
      controlScriptLoadError: state.controlScriptLoadError,

      queenAuthorityObserved: control.observed,
      queenAuthoritySource: control.source,
      queenContract: control.contract,
      queenReceipt: control.receipt,
      controlFilePresent: control.observed,
      controlHandshakeReady: control.receiverReady,
      controlHandshakeAcceptedByQueen: Boolean(control.handshakeAccepted || controlDelivery.accepted),
      controlHandshakeStatus: state.controlHandshakeStatus,
      controlHandshakePacket: clonePlain(controlHandshakePacket),
      controlHandshakePacketDelivered: controlDelivery.delivered,
      controlHandshakeDeliveryMethod: controlDelivery.method,
      controlHandshakeDeliveryReason: controlDelivery.reason,
      queenAdmissionDoesNotBlockVisibleGlobe: true,
      queenHandshakeDoesNotBlockVisibleGlobe: true,

      gateBoard: clonePlain(board),
      gates: clonePlain(board.gates),
      chronologicalGateCount: board.chronologicalGateCount,
      chronologicalGatesSatisfied: board.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: board.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: board.chronologicalFirstFailedCoordinate,

      fibonacci,
      fibonacciSynchronizationScore: fibonacci.fibonacciSynchronizationScore,
      fibonacciSynchronizationExpected: fibonacci.fibonacciSynchronizationExpected,
      fibonacciSynchronizationPassed: fibonacci.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: fibonacci.fibonacciSynchronizationDegraded,
      fibonacciSynchronizationHardFail: fibonacci.fibonacciSynchronizationHardFail,
      fibonacciSynchronizationHoldReason: fibonacci.fibonacciSynchronizationHoldReason,

      f21EligibilityPosture: "HELD_BY_NORTH_ONLY_BOUNDARY",
      f21NorthOnly: true,
      routeMayPublishF21EligibilityOnly: true,

      firstFailedCoordinate: board.chronologicalFirstFailedCoordinate,
      recommendedNextFile,
      recommendedNextAction,
      recommendedNextRenewalTarget: recommendedNextFile,
      postgameStatus,

      activeRouteConductorContracts: ACTIVE_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      activeCanvasContracts: ACTIVE_CANVAS_CONTRACTS.slice(),
      jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,

      staleReceiptPublicationBlocked: true,
      latestReceiptAlwaysRepublished: true,
      receiptPublishCount: state.receiptPublishCount,

      composedAt: nowIso(),
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function updateStateFromPacket(packet) {
    state.currentPacket = clonePlain(packet);
    state.currentReceiptText = composeReceiptText(packet);

    state.chronologicalGateCount = packet.chronologicalGateCount;
    state.chronologicalGatesSatisfied = packet.chronologicalGatesSatisfied;
    state.chronologicalFirstFailedGate = packet.chronologicalFirstFailedGate;
    state.chronologicalFirstFailedCoordinate = packet.chronologicalFirstFailedCoordinate;

    state.fibonacciSynchronizationScore = packet.fibonacciSynchronizationScore;
    state.fibonacciSynchronizationExpected = packet.fibonacciSynchronizationExpected;
    state.fibonacciSynchronizationPassed = packet.fibonacciSynchronizationPassed;
    state.fibonacciSynchronizationDegraded = packet.fibonacciSynchronizationDegraded;
    state.fibonacciSynchronizationHardFail = packet.fibonacciSynchronizationHardFail;
    state.fibonacciSynchronizationHoldReason = packet.fibonacciSynchronizationHoldReason;

    state.firstFailedCoordinate = packet.firstFailedCoordinate;
    state.recommendedNextFile = packet.recommendedNextFile;
    state.recommendedNextAction = packet.recommendedNextAction;
    state.recommendedNextRenewalTarget = packet.recommendedNextRenewalTarget;
    state.postgameStatus = packet.postgameStatus;
    state.currentCanvasReleasePacket = clonePlain(packet.canvasReleasePacket);
    state.currentControlHandshakePacket = clonePlain(packet.controlHandshakePacket);
    state.updatedAt = nowIso();

    updateDataset(packet);
    return packet;
  }

  function refresh(options = {}) {
    const packet = composePrimaryPacket({
      allowAdmission: options.allowAdmission !== false,
      allowDelivery: options.allowDelivery !== false,
      reason: options.reason || "refresh-v10-1"
    });

    updateStateFromPacket(packet);
    publishGlobals("refresh-v10-1-canvas-dom-surface-admission", false);
    scheduleRender();

    return getReceiptLight(false);
  }

  function observePassive() {
    return refresh({
      allowAdmission: true,
      allowDelivery: true,
      reason: "passive-observation-v10-1"
    });
  }

  function composeReceipt(packet = state.currentPacket || composePrimaryPacket({ allowAdmission: false, allowDelivery: false })) {
    return {
      ...clonePlain(packet),
      authority: "hearth-route-conductor-canvas-dom-surface-admission-and-release",
      receiptComposed: true,
      currentReceipt: true,
      noFinalClaimsPreserved: true,
      canvasDomSurfaceAdmissionReceipt: true,
      routeConductorOwnsCanvasFileAdmission: true,
      routeConductorOwnsCanvasDrawing: false,
      latestReceiptAlwaysRepublished: true,
      staleReceiptPublicationBlocked: true,
      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      watchdogTicks: state.watchdogTicks,
      renderCount: state.renderCount,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composeCompatibilityReceiptV94() {
    const p = state.currentPacket || composePrimaryPacket({ allowAdmission: false, allowDelivery: false });

    return {
      contract: COMPAT_V9_4_CONTRACT,
      receipt: COMPAT_V9_4_RECEIPT,
      compatibilityReceipt: true,
      supersededByContract: CONTRACT,
      supersededByReceipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      currentRouteConductorContract: CONTRACT,
      currentRouteConductorReceipt: RECEIPT,
      canvasReleasePacket: clonePlain(p.canvasReleasePacket),
      routeConductorReleasePacket: clonePlain(p.canvasReleasePacket),
      canvasReleaseAuthorized: p.canvasReleaseAuthorized === true,
      canvasReleasePacketReady: p.canvasReleasePacketReady === true,
      canvasReleasePacketDelivered: p.canvasReleasePacketDelivered === true,
      canvasReleaseAcceptedByCanvas: p.canvasReleaseAcceptedByCanvas === true,
      visiblePlanetProofReady: p.visiblePlanetProofReady === true,
      canvasElementFound: p.canvasElementFound === true,
      canvasDomSurfaceMounted: p.canvasDomSurfaceMounted === true,
      controlFileAdmissionActive: true,
      controlDoesNotBlockVisiblePlanet: true,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh || !state.currentPacket) {
      updateStateFromPacket(composePrimaryPacket({ allowAdmission: false, allowDelivery: false }));
    }

    return composeReceipt(state.currentPacket);
  }

  function getReceipt() {
    const receipt = getReceiptLight(false);

    return {
      ...receipt,
      compatibilityReceiptV94: composeCompatibilityReceiptV94(),
      currentReceiptText: composeReceiptText(receipt),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      files: {
        html: HTML_FILE,
        indexPriest: INDEX_FILE,
        routeNorthBishop: FILE,
        queen: CONTROL_FILE,
        canvasReceiver: CANVAS_FILE,
        cardinalBishopNorth: LAB_NORTH_FILE,
        cardinalBishopEast: LAB_EAST_FILE,
        cardinalBishopSouth: LAB_SOUTH_FILE,
        cardinalBishopWest: LAB_WEST_FILE
      },
      startedAt: state.startedAt,
      ...NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = {}) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    const gateLines = (r.gates || []).map((item) => [
      line(`${item.id}.passed`, item.passed),
      line(`${item.id}.firstFailedCoordinate`, item.firstFailedCoordinate),
      line(`${item.id}.recommendedNextFile`, item.recommendedNextFile)
    ].join("\n")).join("\n");

    return [
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract || CONTRACT),
      line("receipt", r.receipt || RECEIPT),
      line("renewalContract", r.renewalContract || RENEWAL_CONTRACT),
      line("renewalReceipt", r.renewalReceipt || RENEWAL_RECEIPT),
      line("previousContract", r.previousContract || PREVIOUS_CONTRACT),
      line("previousReceipt", r.previousReceipt || PREVIOUS_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      line("diagnosticRoute", DIAGNOSTIC_ROUTE),
      "",
      "CANVAS_DOM_SURFACE_ADMISSION",
      line("canvasDomSurfaceAdmissionActive", r.canvasDomSurfaceAdmissionActive),
      line("routeConductorOwnsCanvasFileAdmission", r.routeConductorOwnsCanvasFileAdmission),
      line("routeConductorOwnsCanvasReleasePacketComposition", r.routeConductorOwnsCanvasReleasePacketComposition),
      line("routeConductorOwnsCanvasReleaseDelivery", r.routeConductorOwnsCanvasReleaseDelivery),
      line("routeConductorOwnsCanvasDrawing", false),
      line("routeConductorOwnsCanvasCreation", false),
      line("routeConductorOwnsCanvasExpressionTruth", false),
      "",
      "CANVAS_SCRIPT",
      line("canvasScriptAdmissionRequired", r.canvasScriptAdmissionRequired),
      line("canvasScriptAdmissionAttempted", r.canvasScriptAdmissionAttempted),
      line("canvasScriptAdmissionStatus", r.canvasScriptAdmissionStatus),
      line("canvasScriptAdmissionReason", r.canvasScriptAdmissionReason),
      line("canvasScriptElementFound", r.canvasScriptElementFound),
      line("canvasScriptElementSrc", r.canvasScriptElementSrc),
      line("canvasScriptInjectedByRouteConductor", r.canvasScriptInjectedByRouteConductor),
      line("canvasScriptLoadComplete", r.canvasScriptLoadComplete),
      line("canvasScriptLoadError", r.canvasScriptLoadError),
      "",
      "CANVAS_AUTHORITY",
      line("canvasAuthorityObserved", r.canvasAuthorityObserved),
      line("canvasAuthoritySource", r.canvasAuthoritySource),
      line("currentCanvasParentObserved", r.currentCanvasParentObserved),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("currentCanvasParentReceipt", r.currentCanvasParentReceipt),
      line("currentCanvasParentContractObserved", r.currentCanvasParentContractObserved),
      line("canvasV123Recognized", r.canvasV123Recognized),
      line("canvasContractRecognized", r.canvasContractRecognized),
      line("canvasContractAccepted", r.canvasContractAccepted),
      line("canvasPublicApiReady", r.canvasPublicApiReady),
      line("canvasReleaseReceiverReady", r.canvasReleaseReceiverReady),
      "",
      "CANVAS_RELEASE",
      line("canvasReleasePacketReady", r.canvasReleasePacketReady),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason),
      line("canvasReleasePacketDelivered", r.canvasReleasePacketDelivered),
      line("canvasReleaseAcceptedByCanvas", r.canvasReleaseAcceptedByCanvas),
      line("canvasReleaseDeliveryMethod", r.canvasReleaseDeliveryMethod),
      line("canvasReleaseDeliveryReason", r.canvasReleaseDeliveryReason),
      "",
      "DOM_SURFACE_TRUTH",
      line("canvasMountFound", r.canvasMountFound),
      line("canvasMountSelector", r.canvasMountSelector),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasInMount", r.canvasInMount),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasContext2DReady", r.canvasContext2DReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasVisiblePixelCount", r.canvasVisiblePixelCount),
      line("canvasDomSurfaceMounted", r.canvasDomSurfaceMounted),
      line("canvasDomSurfaceProofReady", r.canvasDomSurfaceProofReady),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      "",
      "QUEEN_EXTENSION_NON_BLOCKING",
      line("queenAuthorityObserved", r.queenAuthorityObserved),
      line("queenAuthoritySource", r.queenAuthoritySource),
      line("queenContract", r.queenContract),
      line("controlScriptAdmissionStatus", r.controlScriptAdmissionStatus),
      line("controlHandshakeStatus", r.controlHandshakeStatus),
      line("controlHandshakeAcceptedByQueen", r.controlHandshakeAcceptedByQueen),
      line("queenAdmissionDoesNotBlockVisibleGlobe", true),
      line("queenHandshakeDoesNotBlockVisibleGlobe", true),
      "",
      "GATES",
      gateLines,
      "",
      "FIBONACCI",
      line("fibonacciSynchronizationScore", r.fibonacciSynchronizationScore),
      line("fibonacciSynchronizationExpected", r.fibonacciSynchronizationExpected),
      line("fibonacciSynchronizationPassed", r.fibonacciSynchronizationPassed),
      line("fibonacciSynchronizationDegraded", r.fibonacciSynchronizationDegraded),
      line("fibonacciSynchronizationHardFail", r.fibonacciSynchronizationHardFail),
      line("fibonacciSynchronizationHoldReason", r.fibonacciSynchronizationHoldReason),
      line("f21EligibilityPosture", r.f21EligibilityPosture),
      line("f21NorthOnly", true),
      line("routeMayPublishF21EligibilityOnly", true),
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
      line("f21ClaimedByRouteConductor", false),
      line("f21SubmittedToNorth", false),
      line("f21Claimed", false),
      line("f21EligibleForNorth", false),
      line("completionLatched", false),
      line("finalCompletionLatched", false),
      line("degradedCompletionLatched", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("controlReadyClaimed", false),
      line("motionReadyClaimed", false),
      line("touchReadyClaimed", false),
      line("dragReadyClaimed", false),
      line("downstreamReleaseClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      "",
      "POSTGAME",
      line("status", r.postgameStatus),
      line("updatedAt", r.updatedAt || nowIso())
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_STATUS",
      line("contract", r.contract),
      line("renewalContract", r.renewalContract),
      line("canvasScriptAdmissionStatus", r.canvasScriptAdmissionStatus),
      line("canvasAuthorityObserved", r.canvasAuthorityObserved),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("canvasReleasePacketDelivered", r.canvasReleasePacketDelivered),
      line("canvasReleaseAcceptedByCanvas", r.canvasReleaseAcceptedByCanvas),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasDomSurfaceMounted", r.canvasDomSurfaceMounted),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function updateDataset(packet = state.currentPacket || {}) {
    setDataset("hearthRouteConductorMarkerPresent", "true");
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorRenewalContract", RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorRenewalReceipt", RENEWAL_RECEIPT);
    setDataset("hearthRouteConductorPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthRouteConductorPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthRouteConductorVersion", VERSION);

    setDataset("hearthHierarchyVersion", HIERARCHY_VERSION);
    setDataset("hearthRouteNorthBishopActive", "true");
    setDataset("hearthRouteConductorNewsAlignmentActive", "true");
    setDataset("hearthRouteConductorFibonacciSynchronizationActive", "true");
    setDataset("hearthRouteConductorCanvasDomSurfaceAdmissionActive", "true");
    setDataset("hearthRouteConductorOwnsCanvasFileAdmission", "true");
    setDataset("hearthRouteConductorOwnsCanvasReleasePacketComposition", "true");
    setDataset("hearthRouteConductorOwnsCanvasReleaseDelivery", "true");
    setDataset("hearthRouteConductorOwnsCanvasDrawing", "false");
    setDataset("hearthRouteConductorOwnsCanvasCreation", "false");
    setDataset("hearthRouteConductorOwnsCanvasExpressionTruth", "false");

    setDataset("hearthCanvasFile", CANVAS_FILE);
    setDataset("hearthExpectedCanvasContract", EXPECTED_CANVAS_CONTRACT);
    setDataset("hearthSouthCanvasScriptAdmissionRequired", "true");
    setDataset("hearthSouthCanvasScriptAdmissionAttempted", String(packet.canvasScriptAdmissionAttempted === true));
    setDataset("hearthSouthCanvasScriptAdmissionStatus", packet.canvasScriptAdmissionStatus || state.canvasScriptAdmissionStatus);
    setDataset("hearthSouthCanvasScriptAdmissionReason", packet.canvasScriptAdmissionReason || state.canvasScriptAdmissionReason);
    setDataset("hearthSouthCanvasScriptElementFound", String(packet.canvasScriptElementFound === true));
    setDataset("hearthSouthCanvasScriptElementSrc", packet.canvasScriptElementSrc || "");
    setDataset("hearthSouthCanvasScriptInjectedByRouteConductor", String(packet.canvasScriptInjectedByRouteConductor === true));
    setDataset("hearthSouthCanvasScriptLoadComplete", String(packet.canvasScriptLoadComplete === true));
    setDataset("hearthSouthCanvasScriptLoadError", packet.canvasScriptLoadError || "");

    setDataset("hearthSouthCurrentCanvasParentObserved", String(packet.currentCanvasParentObserved === true));
    setDataset("hearthSouthCurrentCanvasParentContractObserved", String(packet.currentCanvasParentContractObserved === true));
    setDataset("hearthSouthCurrentCanvasParentContract", packet.currentCanvasParentContract || "");
    setDataset("hearthSouthCurrentCanvasParentReceipt", packet.currentCanvasParentReceipt || "");
    setDataset("hearthSouthCanvasV123Recognized", String(packet.canvasV123Recognized === true));
    setDataset("hearthSouthCanvasContractRecognized", String(packet.canvasContractRecognized === true));
    setDataset("hearthSouthCanvasContractAccepted", String(packet.canvasContractAccepted === true));
    setDataset("hearthSouthCanvasPublicApiReady", String(packet.canvasPublicApiReady === true));
    setDataset("hearthSouthCanvasReleaseReceiverReady", String(packet.canvasReleaseReceiverReady === true));

    setDataset("hearthSouthCanvasReleasePacketReady", String(packet.canvasReleasePacketReady === true));
    setDataset("hearthSouthCanvasReleaseAuthorized", String(packet.canvasReleaseAuthorized === true));
    setDataset("hearthSouthCanvasReleaseHeldReason", packet.canvasReleaseHeldReason || "");
    setDataset("hearthSouthCanvasReleasePacketDelivered", String(packet.canvasReleasePacketDelivered === true));
    setDataset("hearthSouthCanvasReleaseAcceptedByCanvas", String(packet.canvasReleaseAcceptedByCanvas === true));
    setDataset("hearthSouthCanvasReleaseDeliveryMethod", packet.canvasReleaseDeliveryMethod || "NONE");
    setDataset("hearthSouthCanvasReleaseDeliveryReason", packet.canvasReleaseDeliveryReason || "");

    setDataset("hearthSouthCanvasMountFound", String(packet.canvasMountFound === true));
    setDataset("hearthSouthCanvasMountSelector", packet.canvasMountSelector || CANVAS_MOUNT_SELECTOR);
    setDataset("hearthSouthCanvasElementFound", String(packet.canvasElementFound === true));
    setDataset("hearthSouthCanvasSelector", packet.canvasSelector || "UNKNOWN");
    setDataset("hearthSouthCanvasInMount", String(packet.canvasInMount === true));
    setDataset("hearthSouthCanvasRectNonzero", String(packet.canvasRectNonzero === true));
    setDataset("hearthSouthCanvasComputedVisible", String(packet.canvasComputedVisible === true));
    setDataset("hearthSouthCanvasContext2DReady", String(packet.canvasContext2DReady === true));
    setDataset("hearthSouthCanvasPixelSampleStatus", packet.canvasPixelSampleStatus || "NO_PIXEL_SAMPLE");
    setDataset("hearthSouthCanvasVisiblePixelCount", String(packet.canvasVisiblePixelCount || 0));
    setDataset("hearthSouthCanvasDomSurfaceMounted", String(packet.canvasDomSurfaceMounted === true));
    setDataset("hearthSouthCanvasDomSurfaceProofReady", String(packet.canvasDomSurfaceProofReady === true));
    setDataset("hearthSouthVisiblePlanetProofReady", String(packet.visiblePlanetProofReady === true));
    setDataset("hearthSouthVisiblePlanetProofSource", packet.visiblePlanetProofSource || "NONE");

    setDataset("hearthSouthExpectedControlFile", CONTROL_FILE);
    setDataset("hearthSouthExpectedControlContract", EXPECTED_CONTROL_CONTRACT);
    setDataset("hearthSouthControlFilePresent", String(packet.controlFilePresent === true));
    setDataset("hearthSouthControlScriptAdmissionStatus", packet.controlScriptAdmissionStatus || state.controlScriptAdmissionStatus);
    setDataset("hearthSouthControlHandshakeStatus", packet.controlHandshakeStatus || state.controlHandshakeStatus);
    setDataset("hearthSouthControlHandshakeAcceptedByQueen", String(packet.controlHandshakeAcceptedByQueen === true));

    setDataset("hearthSouthChronologicalGateCount", String(packet.chronologicalGateCount || 0));
    setDataset("hearthSouthChronologicalGatesSatisfied", String(packet.chronologicalGatesSatisfied || 0));
    setDataset("hearthSouthChronologicalFirstFailedGate", packet.chronologicalFirstFailedGate || "");
    setDataset("hearthSouthChronologicalFirstFailedCoordinate", packet.chronologicalFirstFailedCoordinate || "");

    setDataset("hearthSouthFibonacciSynchronizationScore", String(packet.fibonacciSynchronizationScore || 0));
    setDataset("hearthSouthFibonacciSynchronizationExpected", String(packet.fibonacciSynchronizationExpected || 100));
    setDataset("hearthSouthFibonacciSynchronizationPassed", String(packet.fibonacciSynchronizationPassed === true));
    setDataset("hearthSouthFibonacciSynchronizationDegraded", String(packet.fibonacciSynchronizationDegraded === true));
    setDataset("hearthSouthFibonacciSynchronizationHardFail", String(packet.fibonacciSynchronizationHardFail === true));
    setDataset("hearthSouthFibonacciSynchronizationHoldReason", packet.fibonacciSynchronizationHoldReason || "");

    setDataset("hearthSouthFirstFailedCoordinate", packet.firstFailedCoordinate || "");
    setDataset("hearthSouthRecommendedNextFile", packet.recommendedNextFile || "");
    setDataset("hearthSouthRecommendedNextAction", packet.recommendedNextAction || "");
    setDataset("hearthSouthRecommendedNextRenewalTarget", packet.recommendedNextRenewalTarget || "");
    setDataset("hearthSouthPostgameStatus", packet.postgameStatus || "");

    setDataset("hearthSouthLatestReceiptAlwaysRepublished", "true");
    setDataset("hearthSouthStaleReceiptPublicationBlocked", "true");
    setDataset("hearthSouthReceiptPublishCount", String(state.receiptPublishCount));

    setDataset("hearthSouthF13Claimed", "false");
    setDataset("hearthSouthF21ClaimedByRouteConductor", "false");
    setDataset("hearthSouthF21SubmittedToNorth", "false");
    setDataset("hearthSouthF21EligibleForNorth", "false");
    setDataset("hearthSouthCompletionLatched", "false");
    setDataset("hearthSouthReadyTextAllowed", "false");
    setDataset("hearthSouthReadyTextClaimed", "false");
    setDataset("hearthSouthControlReadyClaimed", "false");
    setDataset("hearthSouthMotionReadyClaimed", "false");
    setDataset("hearthSouthTouchReadyClaimed", "false");
    setDataset("hearthSouthDragReadyClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function render() {
    if (!doc) return;

    state.renderCount += 1;

    const r = state.currentPacket || getReceiptLight(false);
    const stage = q("[data-hearth-stage-label]");
    const heartbeat = q("[data-hearth-heartbeat-text]");
    const latest = q("[data-hearth-latest-event]");
    const fill = q("[data-hearth-main-progress-fill]");
    const percent = q("[data-hearth-main-progress-percent]");
    const status = doc.getElementById("hearth-route-status") || q("[data-hearth-route-status]");
    const receiptBox = q("[data-hearth-receipt-box]");
    const receiptText = q("[data-hearth-receipt-text]");

    const progress = Math.max(0, Math.min(100, safeNumber(r.fibonacciSynchronizationScore, 0)));

    if (stage) stage.textContent = `${NEWS_CYCLES.CYCLE_2} · Canvas DOM surface admission`;
    if (heartbeat) heartbeat.textContent = `${r.postgameStatus || "CANVAS_DOM_SURFACE_ADMISSION_ACTIVE"} · next=${r.recommendedNextFile || CANVAS_FILE}`;
    if (latest) latest.textContent = `latest=${RENEWAL_CONTRACT}`;
    if (fill) fill.style.width = `${progress}%`;
    if (percent) percent.textContent = `${Math.round(progress)}%`;
    if (status) status.textContent = getStatusText();

    if (receiptBox && receiptText && receiptBox.dataset.visible === "true") {
      receiptText.textContent = getReceiptText();
    }
  }

  function scheduleRender() {
    if (renderTimer || !root.setTimeout) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_RENEWAL_CONTRACT__ = RENEWAL_CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CANVAS_FILE_ADMISSION__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PUBLIC_API_ONLY__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;
    updateDataset(state.currentPacket || {});
  }

  function publishApiAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE = api;
    root.HEARTH_ROUTE_NORTH_BISHOP = api;
    root.HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC = api;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE = api;
    root.HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION = api;
    root.HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION = api;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION = api;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT = api;

    hearth.routeConductor = api;
    hearth.southRouteConductor = api;
    hearth.routeConductorPrimaryGate = api;
    hearth.routeNorthBishop = api;
    hearth.routeConductorShowtimeNewsFibonacciQueenCanvasSync = api;
    hearth.routeConductorCanvasDomSurfaceAdmissionAndRelease = api;
    hearth.routeConductorBishopQueenCanvasRecognitionFunnel = api;
    hearth.routeConductorControlFileAdmissionAndHandshakeDelivery = api;
    hearth.routeConductorControlHandshakeIntegration = api;
    hearth.routeConductorNewsFibonacciVisibleGlobeProofSynchronization = api;
    hearth.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion = api;
    hearth.routeConductorCanvasLocalStationBridgeAlignment = api;

    lab.hearthRouteConductor = api;
    lab.hearthSouthRouteConductor = api;
    lab.hearthRouteConductorPrimaryGate = api;
    lab.hearthRouteNorthBishop = api;
    lab.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync = api;
    lab.hearthRouteConductorCanvasDomSurfaceAdmissionAndRelease = api;
    lab.hearthRouteConductorBishopQueenCanvasRecognitionFunnel = api;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const receipt = getReceiptLight(false);
    const compatibility = composeCompatibilityReceiptV94();

    state.receiptPublishCount += 1;

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT = receipt;
    root.HEARTH_ROUTE_NORTH_BISHOP_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT_v10 = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT = compatibility;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4 = compatibility;

    hearth.routeConductorReceipt = receipt;
    hearth.southRouteConductorReceipt = receipt;
    hearth.routeConductorPrimaryGateReceipt = receipt;
    hearth.routeNorthBishopReceipt = receipt;
    hearth.routeConductorShowtimeNewsFibonacciQueenCanvasSyncReceipt = receipt;
    hearth.routeConductorCanvasDomSurfaceAdmissionAndReleaseReceipt = receipt;
    hearth.routeConductorBishopQueenCanvasRecognitionFunnelReceipt = receipt;
    hearth.routeConductorControlFileAdmissionAndHandshakeDeliveryReceipt = receipt;
    hearth.routeConductorControlHandshakeIntegrationReceipt = receipt;
    hearth.routeConductorNewsFibonacciVisibleGlobeProofSynchronizationReceipt = receipt;
    hearth.routeConductorCanvasExpressionHubVisibleGlobeProofIngestionReceipt = receipt;
    hearth.routeConductorCanvasLocalStationBridgeAlignmentReceipt = compatibility;

    lab.hearthRouteConductorReceipt = receipt;
    lab.hearthSouthRouteConductorReceipt = receipt;
    lab.hearthRouteConductorPrimaryGateReceipt = receipt;
    lab.hearthRouteNorthBishopReceipt = receipt;
    lab.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSyncReceipt = receipt;
    lab.hearthRouteConductorCanvasDomSurfaceAdmissionAndReleaseReceipt = receipt;

    if (state.currentCanvasReleasePacket) {
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      hearth.routeConductorCanvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
      hearth.canvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
      hearth.routeConductorCanvasDomSurfaceReleasePacket = clonePlain(state.currentCanvasReleasePacket);
    }

    if (state.currentControlHandshakePacket) {
      root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      hearth.routeConductorControlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
      hearth.controlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
      hearth.routeConductorQueenControlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
    }

    updateDataset(receipt);
  }

  function publishGlobals(reason = "publish-globals-v10-1", force = false) {
    publishApiAliases();
    publishReceiptAliases();

    record(reason, {
      force,
      contract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      canvasScriptAdmissionStatus: state.canvasScriptAdmissionStatus,
      canvasAuthorityObserved: state.canvasAuthorityObserved,
      canvasElementFound: state.canvasElementFound,
      canvasDomSurfaceMounted: state.canvasDomSurfaceMounted,
      recommendedNextFile: state.recommendedNextFile,
      postgameStatus: state.postgameStatus,
      receiptPublishCount: state.receiptPublishCount
    });

    return true;
  }

  function scheduleWatchdog() {
    if (!root.setInterval) return;
    if (watchdogTimer) return;

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refresh({
        allowAdmission: true,
        allowDelivery: true,
        reason: `watchdog-v10-1-${state.watchdogTicks}`
      });

      if (
        state.watchdogTicks >= 24 ||
        (state.currentPacket && state.currentPacket.canvasDomSurfaceMounted === true)
      ) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;

        record("CANVAS_DOM_SURFACE_ADMISSION_WATCHDOG_STOPPED_V10_1", {
          watchdogTicks: state.watchdogTicks,
          canvasDomSurfaceMounted: state.currentPacket && state.currentPacket.canvasDomSurfaceMounted === true,
          postgameStatus: state.postgameStatus
        });
      }
    }, 750);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_CANVAS_DOM_SURFACE_ADMISSION_V10_1";

      publishEarlyMarker();
      publishGlobals("boot-early-v10-1-api-publication", true);

      refresh({
        allowAdmission: true,
        allowDelivery: true,
        reason: "boot-v10-1-canvas-dom-surface-admission"
      });

      state.booting = false;
      state.booted = true;

      publishGlobals("boot-complete-v10-1-api-publication", true);
      render();
      scheduleWatchdog();

      if (root.setTimeout) {
        root.setTimeout(() => refresh({ allowAdmission: true, allowDelivery: true, reason: "post-boot-250ms-v10-1" }), 250);
        root.setTimeout(() => refresh({ allowAdmission: true, allowDelivery: true, reason: "post-boot-900ms-v10-1" }), 900);
        root.setTimeout(() => refresh({ allowAdmission: true, allowDelivery: true, reason: "post-boot-1800ms-v10-1" }), 1800);
      }

      record("HEARTH_ROUTE_CONDUCTOR_V10_1_BOOTED", {
        route: ROUTE,
        contract: CONTRACT,
        renewalContract: RENEWAL_CONTRACT,
        canvasScriptAdmissionStatus: state.canvasScriptAdmissionStatus,
        canvasAuthorityObserved: state.canvasAuthorityObserved,
        canvasElementFound: state.canvasElementFound,
        canvasDomSurfaceMounted: state.canvasDomSurfaceMounted,
        recommendedNextFile: state.recommendedNextFile,
        postgameStatus: state.postgameStatus,
        visualPassClaimed: false
      });

      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    record("HEARTH_ROUTE_CONDUCTOR_V10_1_DISPOSED", { reason });
    render();

    return getReceipt();
  }

  function getCanvasReleasePacket() {
    return clonePlain(state.currentCanvasReleasePacket || (state.currentPacket && state.currentPacket.canvasReleasePacket) || null);
  }

  function getReleasePacket() {
    return getCanvasReleasePacket();
  }

  function getCanvasHandoffPacket() {
    return getCanvasReleasePacket();
  }

  function getControlHandshakePacket() {
    return clonePlain(state.currentControlHandshakePacket || (state.currentPacket && state.currentPacket.controlHandshakePacket) || null);
  }

  function getRouteCycleReceipt() {
    const r = getReceiptLight(false);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_CYCLE_RECEIPT_v10_1",
      cycleOneRoute: NEWS_CYCLES.CYCLE_1,
      cycleTwoRoute: NEWS_CYCLES.CYCLE_2,
      controlExtensionRoute: NEWS_CYCLES.CONTROL_EXTENSION,
      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      hierarchyVersion: HIERARCHY_VERSION,
      canvasDomSurfaceAdmissionActive: true,
      canvasScriptAdmissionStatus: r.canvasScriptAdmissionStatus,
      canvasAuthorityObserved: r.canvasAuthorityObserved,
      canvasElementFound: r.canvasElementFound,
      canvasDomSurfaceMounted: r.canvasDomSurfaceMounted,
      recommendedNextFile: r.recommendedNextFile,
      postgameStatus: r.postgameStatus,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getRoutePrimaryGateReceipt() {
    return composeReceipt(getReceiptLight(false));
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    RENEWAL_CONTRACT,
    RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    hierarchyVersion: HIERARCHY_VERSION,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    canvasMountSelector: CANVAS_MOUNT_SELECTOR,
    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexContract: EXPECTED_INDEX_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,

    NEWS_CYCLES,
    ACTIVE_ROUTE_CONDUCTOR_CONTRACTS,
    ACTIVE_CANVAS_CONTRACTS,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    refresh,
    observePassive,
    render,

    admitCanvasScript,
    admitControlScript,
    scheduleWatchdog,

    scanCanvasSurface,
    readCanvasSummary,
    readControlSummary,
    readIndexSummary,
    composeCanvasReleasePacket,
    deliverCanvasReleaseToPublicApi,
    composeControlHandshakePacket,
    deliverControlHandshake,

    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket: getCanvasHandoffPacket,
    getControlHandshakePacket,
    getControlsHandshakePacket: getControlHandshakePacket,
    getPlanetaryControlHandshakePacket: getControlHandshakePacket,
    getRouteConductorControlHandshakePacket: getControlHandshakePacket,
    getQueenControlHandshakePacket: getControlHandshakePacket,

    composeReceipt,
    composeReceiptText,
    composeCompatibilityReceiptV94,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,

    publishGlobals,
    publishApiAliases,
    publishReceiptAliases,
    updateDataset,

    supportsCanvasDomSurfaceAdmission: true,
    supportsCanvasFileAdmission: true,
    supportsCanvasReleasePublicApiOnly: true,
    supportsCanvasMountTruthReceipt: true,
    supportsDefinitiveCanvasBranchReceipt: true,
    supportsQueenAdmissionNonBlockingForVisibleGlobe: true,
    supportsCompatibilityReceiptV94: true,
    supportsAlwaysFreshReceiptPublication: true,
    supportsF21EligibilityPostureOnly: true,

    ownsRouteConductorRuntime: true,
    ownsRouteNorthBishopRecognitionFunnel: true,
    ownsNewsChronology: true,
    ownsFibonacciSynchronization: true,
    ownsCanvasFileAdmission: true,
    ownsCanvasReleasePacketComposition: true,
    ownsCanvasReleaseDelivery: true,
    ownsControlFileAdmission: true,
    ownsQueenHandshakePacketComposition: true,
    ownsRouteReceiptPublication: true,

    ownsHtmlShell: false,
    ownsIndexPriestImplementation: false,
    ownsIndexButtonAuthority: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsQueenImplementation: false,
    ownsControlFileImplementation: false,
    ownsControlRuntimeTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasFingerTruth: false,
    ownsPlanetTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsF21Latch: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  publishEarlyMarker();
  publishGlobals("immediate-v10-1-api-publication", true);

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  } else {
    boot();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
