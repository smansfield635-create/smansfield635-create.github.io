// /showroom/globe/hearth/index.js
// HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP_BUTTON_AUTHORITY_PRESERVATION_TNT_v5_5
// Full-file replacement.
// Index JS / front-end control authority / runtime-chain bootstrap only.
// Supersedes:
// - HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4
// Purpose:
// - Preserve all working front-end button, drawer, anchor, receipt, inspect, and cockpit behavior from v5_4.
// - Recognize current HTML v2_5 Planet Engine / Planetary Template Development shell.
// - Stop holding the runtime chain at index.
// - Bootstrap the downstream runtime chain without owning downstream truth.
// - Load/support Route Conductor, Canvas parent, Canvas children, and declared Canvas fingers as downstream authorities.
// - Announce Canvas Local Station summaries to Route Conductor when available.
// - Preserve native Diagnostic Rail and portal navigation.
// - Keep button interaction stable while allowing the visible planet/canvas chain to mount.
// - Never claim F13, F21, ready text, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - planet drawing
// - Canvas truth
// - Route Conductor logic
// - Macro West admissibility truth
// - diagnostic rail case selection
// - finger truth
// - F13
// - F21
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP_BUTTON_AUTHORITY_PRESERVATION_TNT_v5_5";
  const RECEIPT = "HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP_BUTTON_AUTHORITY_PRESERVATION_RECEIPT_v5_5";
  const PREVIOUS_CONTRACT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const PREVIOUS_RECEIPT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_RECEIPT_v5_4";
  const BASELINE_CONTRACT = "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3";
  const VERSION = "2026-06-03.hearth-index-js-runtime-chain-bootstrap-button-authority-preservation-v5-5";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/index.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT = "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5";
  const PREVIOUS_HTML_CONTRACT = "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4";
  const LEGACY_HTML_CONTRACTS = Object.freeze([
    CURRENT_HTML_CONTRACT,
    PREVIOUS_HTML_CONTRACT,
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const CANVAS_PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_PARENT_CONTRACT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6";
  const CANVAS_PARENT_RECEIPT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_RECEIPT_v11_6";

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13ClaimedByIndex: false,
    f21Claimed: false,
    f21ClaimedByIndex: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    readyTextClaimed: false,
    readyTextAllowed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const RUNTIME_MANIFEST = Object.freeze([
    {
      id: "northRuntimeTable",
      cardinal: "NORTH",
      file: "/assets/lab/runtime-table.js",
      cacheKey: "LAB_RUNTIME_TABLE_NORTH_TWO_CYCLE_CANVAS_F13_RELEASE_DISTRIBUTOR_TNT_v1",
      required: false,
      globals: [
        "LAB_RUNTIME_TABLE",
        "LAB_RUNTIME_TABLE_NORTH",
        "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
        "RUNTIME_TABLE",
        "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
        "DEXTER_LAB.runtimeTable",
        "DEXTER_LAB.cardinalRuntimeTableNorth"
      ]
    },
    {
      id: "macroWest",
      cardinal: "WEST",
      file: "/assets/lab/runtime-table.west.js",
      cacheKey: "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_TNT_v4_6_3",
      required: false,
      globals: [
        "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH",
        "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
        "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
        "LAB_RUNTIME_TABLE_WEST",
        "RUNTIME_TABLE_WEST",
        "DEXTER_LAB.runtimeTableWest",
        "HEARTH.runtimeTableWest",
        "HEARTH.macroWestAuthority"
      ]
    },
    {
      id: "routeConductor",
      cardinal: "SOUTH_TO_WEST_TO_CANVAS_GATE",
      file: ROUTE_CONDUCTOR_FILE,
      cacheKey: ROUTE_CONDUCTOR_CONTRACT,
      required: true,
      globals: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HEARTH_SOUTH_ROUTE_CONDUCTOR",
        "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT",
        "HEARTH.routeConductor",
        "HEARTH.southRouteConductor",
        "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment"
      ]
    },
    {
      id: "canvasParent",
      cardinal: "CANVAS_PARENT",
      file: CANVAS_PARENT_FILE,
      cacheKey: CANVAS_PARENT_CONTRACT,
      required: true,
      globals: [
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_PARENT",
        "HEARTH_CANVAS_LOCAL_STATION",
        "HEARTH_CANVAS_STATION",
        "HEARTH_CANVAS_EXPRESSION_HUB",
        "HEARTH_CANVAS_FINGER_MANAGER",
        "HEARTH.canvas",
        "HEARTH.canvasParent",
        "HEARTH.canvasLocalStation",
        "HEARTH.canvasExpressionHub",
        "HEARTH.canvasFingerManager",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasParent",
        "DEXTER_LAB.hearthCanvasLocalStation",
        "DEXTER_LAB.hearthCanvasExpressionHub"
      ]
    },
    {
      id: "canvasEast",
      cardinal: "EAST",
      file: "/assets/hearth/hearth.canvas.east.js",
      cacheKey: "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_TNT_v11_4",
      required: false,
      globals: [
        "HEARTH_CANVAS_EAST",
        "HEARTH_CANVAS_EAST_SOURCE",
        "HEARTH_CANVAS_EAST_AUTHORITY",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastSource",
        "DEXTER_LAB.hearthCanvasEast"
      ]
    },
    {
      id: "canvasWest",
      cardinal: "WEST",
      file: "/assets/hearth/hearth.canvas.west.js",
      cacheKey: "HEARTH_CANVAS_WEST_INSPECTION_TRACK_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_WEST",
        "HEARTH_CANVAS_WEST_AUTHORITY",
        "HEARTH.canvasWest",
        "DEXTER_LAB.hearthCanvasWest"
      ]
    },
    {
      id: "canvasSouth",
      cardinal: "SOUTH",
      file: "/assets/hearth/hearth.canvas.south.js",
      cacheKey: "HEARTH_CANVAS_SOUTH_VISIBLE_PROOF_TRACK_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH_CANVAS_SOUTH_AUTHORITY",
        "HEARTH.canvasSouth",
        "DEXTER_LAB.hearthCanvasSouth"
      ]
    },
    {
      id: "fingerBoundary",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.boundary.js",
      cacheKey: "HEARTH_CANVAS_FINGER_BOUNDARY_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_BOUNDARY",
        "HEARTH.canvasFingerBoundary",
        "DEXTER_LAB.hearthCanvasFingerBoundary"
      ]
    },
    {
      id: "fingerLandform",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.landform.js",
      cacheKey: "HEARTH_CANVAS_FINGER_LANDFORM_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_LANDFORM",
        "HEARTH.canvasFingerLandform",
        "DEXTER_LAB.hearthCanvasFingerLandform"
      ]
    },
    {
      id: "fingerElevation",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.elevation.js",
      cacheKey: "HEARTH_CANVAS_FINGER_ELEVATION_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_ELEVATION",
        "HEARTH.canvasFingerElevation",
        "DEXTER_LAB.hearthCanvasFingerElevation"
      ]
    },
    {
      id: "fingerMaterial",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.material.js",
      cacheKey: "HEARTH_CANVAS_FINGER_MATERIAL_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_MATERIAL",
        "HEARTH.canvasFingerMaterial",
        "DEXTER_LAB.hearthCanvasFingerMaterial"
      ]
    },
    {
      id: "fingerHydrology",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.hydrology.js",
      cacheKey: "HEARTH_CANVAS_FINGER_HYDROLOGY_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_HYDROLOGY",
        "HEARTH.canvasFingerHydrology",
        "DEXTER_LAB.hearthCanvasFingerHydrology"
      ]
    },
    {
      id: "fingerAtmosphere",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
      cacheKey: "HEARTH_CANVAS_FINGER_ATMOSPHERE_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_ATMOSPHERE",
        "HEARTH.canvasFingerAtmosphere",
        "DEXTER_LAB.hearthCanvasFingerAtmosphere"
      ]
    },
    {
      id: "fingerLighting",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.lighting.js",
      cacheKey: "HEARTH_CANVAS_FINGER_LIGHTING_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_LIGHTING",
        "HEARTH.canvasFingerLighting",
        "DEXTER_LAB.hearthCanvasFingerLighting"
      ]
    },
    {
      id: "fingerComposite",
      cardinal: "CANVAS_FINGER",
      file: "/assets/hearth/hearth.canvas.finger.composite.js",
      cacheKey: "HEARTH_CANVAS_FINGER_COMPOSITE_BOOTSTRAP_TNT_v5_5",
      required: false,
      globals: [
        "HEARTH_CANVAS_FINGER_COMPOSITE",
        "HEARTH.canvasFingerComposite",
        "DEXTER_LAB.hearthCanvasFingerComposite"
      ]
    }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    role: "index-button-authority-preservation-runtime-chain-bootstrap",
    pageContext: "Planet Engine and Planetary Template Development",
    pageAlias: "Hearth",

    currentHtmlContract: CURRENT_HTML_CONTRACT,
    previousHtmlContract: PREVIOUS_HTML_CONTRACT,
    observedHtmlContract: "UNKNOWN",
    currentHtmlContractRecognized: false,
    htmlV25Recognized: false,

    bootStarted: false,
    bootComplete: false,
    controlStyleInjected: false,

    buttonAuthorityActive: true,
    frontendButtonAuthorityRestored: true,
    buttonAuthorityPreservedFromV5_4: true,
    globalSuppressionAvoided: true,
    windowDocumentCaptureSuppressionRetired: true,
    nativeAnchorDefaultPreserved: true,
    directButtonBindingActive: true,
    delegatedButtonBindingActive: true,
    detailsSummaryBindingActive: true,

    copyDiagnosticBound: false,
    toggleReceiptBound: false,
    diagnosticAnchorBound: false,
    inspectPlanetBound: false,
    expandCockpitBound: false,
    portalAnchorsBound: false,
    detailsDrawersBound: false,

    copyDiagnosticCount: 0,
    toggleReceiptCount: 0,
    diagnosticAnchorCount: 0,
    inspectPlanetCount: 0,
    showDiagnosticCount: 0,
    expandCockpitCount: 0,
    portalNavigationCount: 0,
    drawerToggleCount: 0,

    lastAction: "NOT_RUN",
    lastActionAt: "",
    lastError: "",
    receiptVisible: false,
    inspectModeActive: false,
    cockpitMode: "diagnostic-dock",

    runtimeChainBootstrapActive: true,
    runtimeChainBootstrapStarted: false,
    runtimeChainBootstrapComplete: false,
    runtimeChainBootstrapInProgress: false,
    runtimeChainBootstrapAttemptCount: 0,
    runtimeChainBootstrapLastStartedAt: "",
    runtimeChainBootstrapLastCompletedAt: "",
    runtimeChainStage: "WAITING_BOOT",
    runtimeChainProgress: 0,
    runtimeChainFirstGap: "WAITING_BOOT",
    runtimeChainRecommendedNextFile: FILE,

    runtimeReleaseHeld: false,
    runtimeReleaseStarted: false,
    runtimeReleaseComplete: false,
    indexRuntimeBootstrapStarted: false,
    indexRuntimeBootstrapComplete: false,

    routeConductorScriptRequested: false,
    routeConductorLoadedByIndex: false,
    routeConductorObserved: false,
    routeConductorApiReady: false,
    routeConductorRefreshRequested: false,
    routeConductorRefreshAccepted: false,
    routeConductorReceiptObserved: false,
    routeConductorContract: "",
    routeConductorReceipt: "",

    canvasScriptRequested: false,
    canvasLoadedByIndex: false,
    canvasParentObserved: false,
    canvasParentApiReady: false,
    canvasParentBootRequested: false,
    canvasParentBootAccepted: false,
    canvasStationSummaryObserved: false,
    canvasStationSummaryAnnouncedToRouteConductor: false,
    canvasStationSummaryMethod: "",

    optionalScriptRequestedCount: 0,
    optionalScriptLoadedCount: 0,
    optionalScriptErrorCount: 0,
    requiredScriptErrorCount: 0,
    manifestEntryCount: RUNTIME_MANIFEST.length,
    loadedManifestIds: [],
    erroredManifestIds: [],
    skippedManifestIds: [],

    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,

    routeConductorOwnsControlBinding: false,
    indexOwnsButtonBindingOnly: false,
    indexOwnsRuntimeBootstrap: true,
    indexOwnsRuntimeRelease: false,
    indexOwnsRouteConductorLogic: false,
    indexOwnsCanvasDrawing: false,
    indexOwnsCanvasTruth: false,
    indexOwnsFingerTruth: false,
    indexOwnsDiagnosticRailCaseSelection: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_RUNTIME_CHAIN_BOOTSTRAP",

    startedAt: "",
    updatedAt: "",
    publishedAt: "",
    localEvents: [],
    errors: [],

    ...FINAL_FALSE
  };

  const refs = {
    html: null,
    body: null,
    stage: null,
    mount: null,
    cockpit: null,
    receiptPanel: null,
    receiptText: null,
    routeStatus: null,
    copyButton: null,
    toggleReceiptButton: null,
    inspectButton: null,
    collapseButton: null,
    showDiagnosticTab: null,
    diagnosticAnchors: [],
    portalLinks: [],
    summaries: [],
    stageLabel: null,
    heartbeatText: null,
    latestEvent: null,
    progressFill: null,
    progressPercent: null
  };

  const boundElements = typeof WeakSet !== "undefined" ? new WeakSet() : null;
  const scriptPromises = Object.create(null);
  let lastActivationKey = "";
  let lastActivationAt = 0;
  let bootstrapPromise = null;
  let statusTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    try {
      return Date.now();
    } catch (_error) {
      return new Date().getTime();
    }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function isElement(value) {
    return Boolean(value && value.nodeType === 1);
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trim(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_INDEX_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trim(state.localEvents, 160);
    state.lastAction = item.event;
    state.lastActionAt = item.at;
    state.updatedAt = item.at;

    publishDataset();
    scheduleStatusUpdate();
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_INDEX_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 120);
    state.lastError = item.message;
    state.lastAction = item.code;
    state.lastActionAt = item.at;
    state.updatedAt = item.at;

    publishDataset();
    scheduleStatusUpdate();
    return item;
  }

  function qs(selector) {
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qsa(selector) {
    if (!doc) return [];
    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function closest(target, selector) {
    if (!isElement(target) || !isFunction(target.closest)) return null;
    try {
      return target.closest(selector);
    } catch (_error) {
      return null;
    }
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
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function setDataset(node, key, value) {
    if (!node || !node.dataset) return;
    node.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function setText(node, text) {
    if (!node) return;
    node.textContent = safeString(text);
  }

  function scriptSrc(file, cacheKey) {
    const token = encodeURIComponent(cacheKey || CONTRACT);
    return `${file}?v=${token}`;
  }

  function sourceContainsFile(src, file) {
    const source = safeString(src);
    return source.indexOf(file) !== -1;
  }

  function findScriptForFile(file) {
    if (!doc) return null;
    const scripts = qsa("script[src]");
    return scripts.find((script) => sourceContainsFile(script.getAttribute("src") || script.src, file)) || null;
  }

  function refreshRefs() {
    refs.html = doc ? doc.documentElement : null;
    refs.body = doc ? doc.body : null;
    refs.stage = qs("#hearthGlobeStage") || qs("[data-hearth-globe-stage]");
    refs.mount = qs("#hearthCanvasMount") || qs("[data-hearth-canvas-mount]");
    refs.cockpit = qs("#hearthLoadCockpit") || qs("[data-hearth-load-cockpit]");
    refs.receiptPanel = qs("#hearthReceiptPanel") || qs("[data-hearth-receipt-box]");
    refs.receiptText = qs("[data-hearth-receipt-text]");
    refs.routeStatus = qs("#hearth-route-status") || qs("[data-hearth-route-status]");
    refs.copyButton = qs("[data-hearth-copy-diagnostic]");
    refs.toggleReceiptButton = qs("[data-hearth-toggle-receipt]");
    refs.inspectButton = qs("[data-hearth-inspect-planet]");
    refs.collapseButton = qs("[data-hearth-collapse-cockpit]");
    refs.showDiagnosticTab = qs("[data-hearth-south-show-diagnostic-tab]") || qs("[data-hearth-east-show-diagnostic-tab]") || qs("[data-hearth-show-diagnostic-tab]");
    refs.diagnosticAnchors = qsa("a[href='/showroom/globe/hearth/diagnostic/'], a[data-hearth-diagnostic-rail-native-anchor], a[data-hearth-diagnostic-rail-field]");
    refs.portalLinks = qsa("#hearthMapPortal a[href], [data-hearth-map-portal] a[href], .portal-link[href]");
    refs.summaries = qsa("details.drawer > summary, details > summary");
    refs.stageLabel = qs("[data-hearth-stage-label]");
    refs.heartbeatText = qs("[data-hearth-heartbeat-text]");
    refs.latestEvent = qs("[data-hearth-latest-event]");
    refs.progressFill = qs("[data-hearth-main-progress-fill]");
    refs.progressPercent = qs("[data-hearth-main-progress-percent]");
  }

  function readHtmlContract() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return "UNKNOWN";
    return safeString(
      doc.documentElement.dataset.contract ||
      doc.documentElement.dataset.hearthHtmlContract ||
      doc.documentElement.dataset.hearthShellContract ||
      "UNKNOWN"
    );
  }

  function auditHtml() {
    refreshRefs();

    state.observedHtmlContract = readHtmlContract();
    state.currentHtmlContractRecognized = LEGACY_HTML_CONTRACTS.includes(state.observedHtmlContract);
    state.htmlV25Recognized = state.observedHtmlContract === CURRENT_HTML_CONTRACT;

    return {
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,
      htmlV25Recognized: state.htmlV25Recognized,
      mountPresent: Boolean(refs.mount),
      cockpitPresent: Boolean(refs.cockpit),
      copyButtonPresent: Boolean(refs.copyButton),
      toggleReceiptButtonPresent: Boolean(refs.toggleReceiptButton),
      diagnosticAnchorsPresent: refs.diagnosticAnchors.length,
      inspectButtonPresent: Boolean(refs.inspectButton),
      collapseButtonPresent: Boolean(refs.collapseButton),
      portalLinksPresent: refs.portalLinks.length,
      detailsSummariesPresent: refs.summaries.length,
      receiptPanelPresent: Boolean(refs.receiptPanel),
      receiptTextPresent: Boolean(refs.receiptText)
    };
  }

  function injectControlAuthorityStyle() {
    if (!doc || !doc.head) return false;

    if (qs("style[data-hearth-index-runtime-chain-bootstrap-style]")) {
      state.controlStyleInjected = true;
      return true;
    }

    const style = doc.createElement("style");
    style.setAttribute("data-hearth-index-runtime-chain-bootstrap-style", CONTRACT);
    style.textContent = `
      [data-hearth-load-cockpit],
      #hearthLoadCockpit {
        z-index: 10020 !important;
        pointer-events: auto !important;
      }

      [data-hearth-load-cockpit] button,
      [data-hearth-load-cockpit] a,
      #hearthLoadCockpit button,
      #hearthLoadCockpit a,
      #hearthMapPortal a,
      [data-hearth-map-portal] a,
      details > summary,
      [data-hearth-south-show-diagnostic-tab],
      [data-hearth-east-show-diagnostic-tab],
      [data-hearth-show-diagnostic-tab],
      #hearthDiagnosticRailEmergencyAnchor {
        pointer-events: auto !important;
        touch-action: manipulation !important;
        user-select: auto !important;
        -webkit-user-select: auto !important;
      }

      #hearthCanvasMount[data-hearth-canvas-mount] {
        z-index: 2;
      }

      #hearthDiagnosticRailEmergencyAnchor {
        position: fixed;
        left: max(10px, env(safe-area-inset-left));
        top: max(10px, env(safe-area-inset-top));
        z-index: 100000;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 10px 14px;
        border: 1px solid rgba(242, 198, 109, .8);
        border-radius: 999px;
        background: linear-gradient(135deg, #ffe8a3, #f2c66d);
        color: #06101e;
        font: 950 12px/1.1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        text-decoration: none;
        box-shadow: 0 16px 44px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.28);
      }

      #hearthDiagnosticRailEmergencyAnchor:focus-visible {
        outline: 3px solid rgba(126, 216, 255, .9);
        outline-offset: 4px;
      }
    `;

    doc.head.appendChild(style);
    state.controlStyleInjected = true;
    return true;
  }

  function ensureEmergencyDiagnosticAnchor() {
    if (!doc || !doc.body) return null;

    let anchor = qs("#hearthDiagnosticRailEmergencyAnchor");
    if (anchor) return anchor;

    anchor = doc.createElement("a");
    anchor.id = "hearthDiagnosticRailEmergencyAnchor";
    anchor.href = DIAGNOSTIC_ROUTE;
    anchor.textContent = "Open Hearth Diagnostic Rail";
    anchor.setAttribute("data-hearth-diagnostic-rail-native-anchor", "true");
    anchor.setAttribute("data-hearth-index-emergency-diagnostic-anchor", CONTRACT);
    anchor.setAttribute("aria-label", "Open Hearth Diagnostic Rail");
    doc.body.appendChild(anchor);

    return anchor;
  }

  function bindOnce(element, type, handler, options) {
    if (!element || !isFunction(element.addEventListener)) return false;

    const key = `__hearth_${CONTRACT}_${type}`;
    if (element[key]) return false;

    try {
      element.addEventListener(type, handler, options || false);
      element[key] = true;
      return true;
    } catch (_error) {
      try {
        element.addEventListener(type, handler, false);
        element[key] = true;
        return true;
      } catch (__error) {
        return false;
      }
    }
  }

  function markControl(element, actionName) {
    if (!element) return;
    setDataset(element, "hearthIndexButtonAuthorityReset", "true");
    setDataset(element, "hearthIndexButtonAuthorityContract", CONTRACT);
    setDataset(element, "hearthIndexButtonAction", actionName);
    setDataset(element, "hearthRouteConductorOwnsControlBinding", "false");
    setDataset(element, "hearthNativeAnchorDefaultPreserved", "true");
  }

  function shouldIgnoreDuplicate(key) {
    const at = nowMs();
    if (key === lastActivationKey && at - lastActivationAt < 450) return true;
    lastActivationKey = key;
    lastActivationAt = at;
    return false;
  }

  function stopForButton(event) {
    if (!event) return;

    try {
      if (event.cancelable) event.preventDefault();
    } catch (_error) {}

    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}
  }

  function navigate(url) {
    const target = safeString(url, "");
    if (!target) return false;

    try {
      root.location.assign(target);
      return true;
    } catch (_error) {
      try {
        root.location.href = target;
        return true;
      } catch (error) {
        state.lastError = error && error.message ? error.message : String(error);
        return false;
      }
    }
  }

  function protectNativeAnchor(event, anchor) {
    if (!anchor) return;

    try {
      if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
      else if (isFunction(event.stopPropagation)) event.stopPropagation();
    } catch (_error) {}

    if (event.type !== "click") return;

    if (event.defaultPrevented) {
      navigate(anchor.href || anchor.getAttribute("href") || DIAGNOSTIC_ROUTE);
    }
  }

  function bindButton(element, actionName, callback) {
    if (!element) return false;

    markControl(element, actionName);

    if (boundElements && boundElements.has(element)) return true;

    bindOnce(element, "pointerup", (event) => {
      const key = `${actionName}:pointerup`;
      if (shouldIgnoreDuplicate(key)) return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "touchend", (event) => {
      const key = `${actionName}:touchend`;
      if (shouldIgnoreDuplicate(key)) return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "click", (event) => {
      const keyboardClick = Number(event.detail || 0) === 0;
      const key = `${actionName}:click`;

      if (!keyboardClick && shouldIgnoreDuplicate(key)) {
        stopForButton(event);
        return;
      }

      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    bindOnce(element, "keydown", (event) => {
      const key = event.key || "";
      if (key !== "Enter" && key !== " ") return;
      stopForButton(event);
      callback(event);
    }, { capture: true, passive: false });

    if (boundElements) boundElements.add(element);
    return true;
  }

  function bindAnchor(anchor, actionName = "nativeAnchor") {
    if (!anchor) return false;

    markControl(anchor, actionName);

    bindOnce(anchor, "pointerup", (event) => {
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    bindOnce(anchor, "touchend", (event) => {
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    bindOnce(anchor, "click", (event) => {
      const href = safeString(anchor.getAttribute("href") || "");
      if (href === DIAGNOSTIC_ROUTE) state.diagnosticAnchorCount += 1;
      else state.portalNavigationCount += 1;

      record(actionName, { href });
      protectNativeAnchor(event, anchor);
    }, { capture: true, passive: false });

    return true;
  }

  function bindSummary(summary) {
    if (!summary) return false;

    setDataset(summary, "hearthIndexDrawerAuthorityReset", CONTRACT);

    bindOnce(summary, "click", (event) => {
      const details = closest(summary, "details");
      if (!details) return;

      try {
        event.preventDefault();
        if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
        else if (isFunction(event.stopPropagation)) event.stopPropagation();
      } catch (_error) {}

      details.open = !details.open;
      state.drawerToggleCount += 1;
      record("drawerToggle", { open: details.open });
    }, { capture: true, passive: false });

    bindOnce(summary, "keydown", (event) => {
      const key = event.key || "";
      if (key !== "Enter" && key !== " ") return;

      const details = closest(summary, "details");
      if (!details) return;

      try {
        event.preventDefault();
        if (isFunction(event.stopImmediatePropagation)) event.stopImmediatePropagation();
        else if (isFunction(event.stopPropagation)) event.stopPropagation();
      } catch (_error) {}

      details.open = !details.open;
      state.drawerToggleCount += 1;
      record("drawerToggleKeyboard", { open: details.open });
    }, { capture: true, passive: false });

    return true;
  }

  async function copyText(text) {
    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_error) {}

    try {
      if (!doc || !doc.body) return false;

      const area = doc.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "readonly");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      area.style.top = "-9999px";
      doc.body.appendChild(area);
      area.focus();
      area.select();

      const ok = doc.execCommand("copy");
      area.remove();
      return Boolean(ok);
    } catch (error) {
      state.lastError = error && error.message ? error.message : String(error);
      return false;
    }
  }

  async function copyDiagnostic() {
    refreshRefs();

    const text = getReceiptText();
    const ok = await copyText(text);

    state.copyDiagnosticCount += 1;

    if (refs.copyButton) {
      refs.copyButton.textContent = ok ? "Copied" : "Copy held";
      root.setTimeout(() => {
        refreshRefs();
        if (refs.copyButton) refs.copyButton.textContent = "Copy diagnostic";
      }, 900);
    }

    record(ok ? "copyDiagnostic" : "copyDiagnosticHeld");
    return ok;
  }

  function toggleReceiptPanel() {
    refreshRefs();

    if (!refs.receiptPanel) {
      state.lastError = "RECEIPT_PANEL_NOT_FOUND";
      record("toggleReceiptFailed");
      return false;
    }

    const visible = refs.receiptPanel.dataset.visible !== "true";
    refs.receiptPanel.dataset.visible = String(visible);
    refs.receiptPanel.hidden = false;

    if (refs.receiptText) {
      refs.receiptText.textContent = visible ? getReceiptText() : "";
    }

    if (refs.toggleReceiptButton) {
      refs.toggleReceiptButton.textContent = visible ? "Hide receipt" : "Show receipt";
    }

    state.receiptVisible = visible;
    state.toggleReceiptCount += 1;

    record(visible ? "showReceipt" : "hideReceipt");
    return visible;
  }

  function setInspectMode(active) {
    refreshRefs();

    state.inspectModeActive = Boolean(active);

    if (refs.html) {
      refs.html.dataset.hearthSouthPlanetInspect = String(state.inspectModeActive);
      refs.html.dataset.hearthEastInspectReservedActive = String(state.inspectModeActive);
      refs.html.dataset.hearthIndexInspectModeActive = String(state.inspectModeActive);
    }

    if (refs.cockpit) {
      refs.cockpit.dataset.cockpitMode = state.inspectModeActive ? "planet-inspect" : "diagnostic-dock";
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = state.inspectModeActive ? "Show diagnostic" : "Inspect planet";
    }

    if (refs.showDiagnosticTab) {
      refs.showDiagnosticTab.hidden = !state.inspectModeActive;
      refs.showDiagnosticTab.dataset.visible = String(state.inspectModeActive);
    }

    if (state.inspectModeActive) {
      state.inspectPlanetCount += 1;
      state.cockpitMode = "planet-inspect";
      record("inspectPlanet");
    } else {
      state.showDiagnosticCount += 1;
      state.cockpitMode = "diagnostic-dock";
      record("showDiagnostic");
    }

    return state.inspectModeActive;
  }

  function toggleCockpitMode() {
    refreshRefs();

    if (!refs.cockpit) {
      state.lastError = "COCKPIT_NOT_FOUND";
      record("toggleCockpitFailed");
      return false;
    }

    const next = refs.cockpit.dataset.cockpitMode === "expanded-cockpit"
      ? "diagnostic-dock"
      : "expanded-cockpit";

    refs.cockpit.dataset.cockpitMode = next;
    state.cockpitMode = next;

    if (refs.collapseButton) {
      refs.collapseButton.textContent = next === "expanded-cockpit" ? "Collapse cockpit" : "Expand cockpit";
    }

    state.expandCockpitCount += 1;
    record("toggleCockpit", { cockpitMode: next });
    return true;
  }

  function bindControls() {
    refreshRefs();
    injectControlAuthorityStyle();
    ensureEmergencyDiagnosticAnchor();
    refreshRefs();

    state.copyDiagnosticBound = bindButton(refs.copyButton, "copyDiagnostic", copyDiagnostic);
    state.toggleReceiptBound = bindButton(refs.toggleReceiptButton, "toggleReceipt", toggleReceiptPanel);
    state.inspectPlanetBound = bindButton(refs.inspectButton, "inspectPlanet", () => setInspectMode(!state.inspectModeActive));
    state.expandCockpitBound = bindButton(refs.collapseButton, "toggleCockpit", toggleCockpitMode);

    if (refs.showDiagnosticTab) {
      bindButton(refs.showDiagnosticTab, "showDiagnostic", () => setInspectMode(false));
    }

    refs.diagnosticAnchors.forEach((anchor) => bindAnchor(anchor, "openDiagnosticRail"));
    refs.portalLinks.forEach((anchor) => bindAnchor(anchor, "portalNativeNavigation"));
    refs.summaries.forEach(bindSummary);

    state.diagnosticAnchorBound = refs.diagnosticAnchors.length > 0;
    state.portalAnchorsBound = refs.portalLinks.length > 0;
    state.detailsDrawersBound = refs.summaries.length > 0;

    publishDataset();
    scheduleStatusUpdate();
    return getReceipt();
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getDiagnosticBridgeSummary",
      "getDiagnosticBridgeReceipt",
      "getRouteCycleReceipt",
      "getRoutePrimaryGateReceipt",
      "getStatus",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? authority[method](false)
          : authority[method]();

        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function globalForEntry(entry) {
    return firstGlobal(entry.globals || []);
  }

  function markManifestLoaded(entry, source) {
    if (!state.loadedManifestIds.includes(entry.id)) state.loadedManifestIds.push(entry.id);

    if (entry.required) {
      if (entry.id === "routeConductor") state.routeConductorLoadedByIndex = true;
      if (entry.id === "canvasParent") state.canvasLoadedByIndex = true;
    } else {
      state.optionalScriptLoadedCount = state.loadedManifestIds.filter((id) => {
        const found = RUNTIME_MANIFEST.find((entryItem) => entryItem.id === id);
        return found && !found.required;
      }).length;
    }

    record("runtimeScriptLoaded", {
      id: entry.id,
      file: entry.file,
      source
    });
  }

  function markManifestError(entry, error) {
    if (!state.erroredManifestIds.includes(entry.id)) state.erroredManifestIds.push(entry.id);

    if (entry.required) state.requiredScriptErrorCount += 1;
    else state.optionalScriptErrorCount += 1;

    recordError(entry.required ? "REQUIRED_RUNTIME_SCRIPT_LOAD_FAILED" : "OPTIONAL_RUNTIME_SCRIPT_LOAD_FAILED", error, {
      id: entry.id,
      file: entry.file,
      required: entry.required
    });
  }

  function loadScriptEntry(entry) {
    const existingGlobal = globalForEntry(entry);

    if (existingGlobal) {
      markManifestLoaded(entry, "existing-global");
      return Promise.resolve({
        id: entry.id,
        file: entry.file,
        loaded: true,
        source: "existing-global",
        authority: existingGlobal
      });
    }

    const existingScript = findScriptForFile(entry.file);

    if (existingScript && existingScript.dataset && existingScript.dataset.hearthRuntimeChainScriptLoaded === "true") {
      markManifestLoaded(entry, "existing-script-loaded");
      return Promise.resolve({
        id: entry.id,
        file: entry.file,
        loaded: true,
        source: "existing-script-loaded",
        authority: globalForEntry(entry)
      });
    }

    if (scriptPromises[entry.id]) return scriptPromises[entry.id];

    if (!doc || !doc.head) {
      const error = new Error("DOCUMENT_HEAD_NOT_AVAILABLE");
      markManifestError(entry, error);
      return Promise.resolve({
        id: entry.id,
        file: entry.file,
        loaded: false,
        source: "document-unavailable",
        error: error.message
      });
    }

    const script = existingScript || doc.createElement("script");

    if (!existingScript) {
      script.src = scriptSrc(entry.file, entry.cacheKey);
      script.async = false;
      script.defer = false;
      script.setAttribute("data-hearth-runtime-chain-script", CONTRACT);
      script.setAttribute("data-hearth-runtime-chain-id", entry.id);
      script.setAttribute("data-hearth-runtime-chain-cardinal", entry.cardinal || "");
      script.setAttribute("data-hearth-runtime-chain-required", String(entry.required === true));
      script.setAttribute("data-hearth-runtime-chain-file", entry.file);
      script.setAttribute("data-hearth-runtime-chain-cache-key", entry.cacheKey || CONTRACT);
    }

    if (entry.required) {
      if (entry.id === "routeConductor") state.routeConductorScriptRequested = true;
      if (entry.id === "canvasParent") state.canvasScriptRequested = true;
    } else {
      state.optionalScriptRequestedCount += 1;
    }

    const promise = new Promise((resolve) => {
      let settled = false;

      const done = (loaded, source, errorMessage = "") => {
        if (settled) return;
        settled = true;

        if (script.dataset) {
          script.dataset.hearthRuntimeChainScriptLoaded = loaded ? "true" : "false";
          script.dataset.hearthRuntimeChainScriptSource = source;
          script.dataset.hearthRuntimeChainScriptError = errorMessage;
        }

        const authority = globalForEntry(entry);

        if (loaded || authority) {
          markManifestLoaded(entry, source);
          resolve({
            id: entry.id,
            file: entry.file,
            loaded: true,
            source,
            authority
          });
          return;
        }

        const error = new Error(errorMessage || "SCRIPT_LOAD_FAILED");
        markManifestError(entry, error);
        resolve({
          id: entry.id,
          file: entry.file,
          loaded: false,
          source,
          error: error.message
        });
      };

      script.addEventListener("load", () => {
        root.setTimeout(() => done(true, "script-load"), 0);
      }, { once: true });

      script.addEventListener("error", () => {
        done(false, "script-error", "SCRIPT_ERROR_OR_NOT_FOUND");
      }, { once: true });

      if (!existingScript) {
        doc.head.appendChild(script);
      } else {
        root.setTimeout(() => {
          const authority = globalForEntry(entry);
          if (authority) done(true, "existing-script-global-detected");
          else if (entry.required) done(false, "existing-script-no-global", "EXISTING_SCRIPT_GLOBAL_NOT_AVAILABLE");
          else done(false, "existing-optional-script-no-global", "OPTIONAL_SCRIPT_GLOBAL_NOT_AVAILABLE");
        }, 90);
      }

      root.setTimeout(() => {
        const authority = globalForEntry(entry);
        if (authority) done(true, "script-timeout-global-detected");
        else if (entry.required) done(false, "script-timeout-required", "REQUIRED_SCRIPT_GLOBAL_NOT_AVAILABLE_AFTER_TIMEOUT");
        else done(false, "script-timeout-optional", "OPTIONAL_SCRIPT_NOT_AVAILABLE_AFTER_TIMEOUT");
      }, entry.required ? 6500 : 2400);
    });

    scriptPromises[entry.id] = promise;
    return promise;
  }

  function readRouteConductorApi() {
    return firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment"
    ]);
  }

  function readCanvasApi() {
    return firstGlobal([
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS_STATION",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_FINGER_MANAGER",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasStation",
      "HEARTH.canvasParent",
      "HEARTH.canvas",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasFingerManager",
      "DEXTER_LAB.hearthCanvasLocalStation",
      "DEXTER_LAB.hearthCanvasStation",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasExpressionHub"
    ]);
  }

  function updateRouteConductorState() {
    const routeConductor = readRouteConductorApi();
    const receipt = readReceipt(routeConductor) || {};

    state.routeConductorObserved = Boolean(routeConductor || receipt.contract || receipt.receipt);
    state.routeConductorApiReady = Boolean(routeConductor && isObject(routeConductor));
    state.routeConductorReceiptObserved = Boolean(receipt && (receipt.contract || receipt.receipt));
    state.routeConductorContract = safeString(receipt.contract || receipt.CONTRACT || (routeConductor && routeConductor.contract) || "");
    state.routeConductorReceipt = safeString(receipt.receipt || receipt.RECEIPT || (routeConductor && routeConductor.receipt) || "");

    return {
      api: routeConductor,
      receipt,
      observed: state.routeConductorObserved,
      apiReady: state.routeConductorApiReady
    };
  }

  function updateCanvasState() {
    const canvas = readCanvasApi();
    const receipt = readReceipt(canvas) || {};

    state.canvasParentObserved = Boolean(canvas || receipt.contract || receipt.receipt);
    state.canvasParentApiReady = Boolean(canvas && isObject(canvas));
    state.canvasStationSummaryObserved = Boolean(
      receipt &&
      (
        receipt.canvasLocalStationActive === true ||
        receipt.expressionHubActive === true ||
        receipt.fingerManagerActive === true ||
        receipt.packetType ||
        receipt.currentCanvasParentContract ||
        receipt.contract
      )
    );

    state.f13CanvasReadinessObserved = Boolean(safeBool(receipt.f13CanvasReadinessObserved, state.f13CanvasReadinessObserved));
    state.f13VisibleEvidenceAvailable = Boolean(safeBool(receipt.f13VisibleEvidenceAvailable, state.f13VisibleEvidenceAvailable));
    state.f13InspectEvidenceAvailable = Boolean(safeBool(receipt.f13InspectEvidenceAvailable, state.f13InspectEvidenceAvailable));
    state.f13CanvasEvidenceStrict = Boolean(safeBool(receipt.f13CanvasEvidenceStrict, state.f13CanvasEvidenceStrict));
    state.f13CanvasEvidenceDegraded = Boolean(safeBool(receipt.f13CanvasEvidenceDegraded, state.f13CanvasEvidenceDegraded));
    state.f13CanvasEvidenceComplete = Boolean(safeBool(receipt.f13CanvasEvidenceComplete, state.f13CanvasEvidenceComplete));
    state.f13HardFail = Boolean(safeBool(receipt.f13HardFail, state.f13HardFail));
    state.f13StrictEvidenceGap = safeString(receipt.f13StrictEvidenceGap || state.f13StrictEvidenceGap || "WAITING_CANVAS_EVIDENCE");

    return {
      api: canvas,
      receipt,
      observed: state.canvasParentObserved,
      apiReady: state.canvasParentApiReady
    };
  }

  function callFirst(apiObject, methods, args = []) {
    if (!apiObject || !isObject(apiObject)) {
      return { called: false, method: "", result: null };
    }

    for (const method of methods || []) {
      if (!isFunction(apiObject[method])) continue;

      try {
        const result = apiObject[method](...args);
        return { called: true, method, result };
      } catch (error) {
        recordError("DOWNSTREAM_METHOD_CALL_FAILED", error, { method });
      }
    }

    return { called: false, method: "", result: null };
  }

  function bootCanvasParent() {
    const canvasState = updateCanvasState();
    const canvas = canvasState.api;

    if (!canvas || !isObject(canvas)) return false;

    const result = callFirst(canvas, [
      "boot",
      "init",
      "start",
      "mount",
      "bootAudit",
      "updateDatasetAndReceipt"
    ], [{
      source: CONTRACT,
      sourceReceipt: RECEIPT,
      sourceFile: FILE,
      targetFile: CANVAS_PARENT_FILE,
      route: ROUTE,
      mountSelector: "#hearthCanvasMount",
      indexOwnsCanvasDrawing: false,
      indexOwnsCanvasTruth: false,
      visualPassClaimed: false
    }]);

    state.canvasParentBootRequested = result.called;
    state.canvasParentBootAccepted = result.called;
    state.canvasStationSummaryMethod = result.method || state.canvasStationSummaryMethod;

    updateCanvasState();
    return result.called;
  }

  function requestRouteConductorRefresh() {
    const routeState = updateRouteConductorState();
    const routeConductor = routeState.api;

    if (!routeConductor || !isObject(routeConductor)) return false;

    const result = callFirst(routeConductor, [
      "refresh",
      "observePassive",
      "boot",
      "init",
      "start",
      "run"
    ], [{
      source: CONTRACT,
      sourceReceipt: RECEIPT,
      sourceFile: FILE,
      route: ROUTE,
      indexRuntimeBootstrapComplete: state.indexRuntimeBootstrapComplete,
      indexOwnsControlBinding: true,
      indexOwnsRuntimeBootstrap: true,
      indexOwnsRouteConductorLogic: false,
      indexOwnsCanvasDrawing: false,
      visualPassClaimed: false
    }]);

    state.routeConductorRefreshRequested = result.called;
    state.routeConductorRefreshAccepted = result.called;

    updateRouteConductorState();
    return result.called;
  }

  function getCanvasSummary() {
    const canvas = readCanvasApi();
    if (!canvas || !isObject(canvas)) return null;

    const methods = [
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getReceiptLight",
      "getReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(canvas[method])) continue;

      try {
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? canvas[method](false)
          : canvas[method]();

        if (isObject(result)) {
          state.canvasStationSummaryMethod = method;
          return result;
        }
      } catch (error) {
        recordError("CANVAS_SUMMARY_READ_FAILED", error, { method });
      }
    }

    return null;
  }

  function announceCanvasSummaryToRouteConductor() {
    const routeConductor = readRouteConductorApi();
    const summary = getCanvasSummary();

    if (!routeConductor || !isObject(routeConductor) || !isObject(summary)) return false;

    const result = callFirst(routeConductor, [
      "receiveCanvasStationSummary",
      "receiveCanvasLocalStationSummary",
      "receiveCanvasParentSummary",
      "reconcileCanvas",
      "receiveCanvasExpressionHubSummary",
      "receiveCanvasFingerManagerSummary"
    ], [clonePlain(summary)]);

    state.canvasStationSummaryAnnouncedToRouteConductor = result.called;

    if (result.called) {
      record("canvasStationSummaryAnnouncedToRouteConductor", {
        method: result.method,
        canvasSummaryMethod: state.canvasStationSummaryMethod
      });
    }

    return result.called;
  }

  async function loadSupportScripts() {
    const support = RUNTIME_MANIFEST.filter((entry) => !entry.required && (entry.id === "northRuntimeTable" || entry.id === "macroWest"));

    for (const entry of support) {
      state.runtimeChainStage = `LOADING_${entry.id}`;
      state.runtimeChainProgress = Math.max(state.runtimeChainProgress, 38);
      await loadScriptEntry(entry);
    }
  }

  async function loadRequiredRuntimeScripts() {
    const routeEntry = RUNTIME_MANIFEST.find((entry) => entry.id === "routeConductor");
    const canvasEntry = RUNTIME_MANIFEST.find((entry) => entry.id === "canvasParent");

    state.runtimeChainStage = "LOADING_ROUTE_CONDUCTOR";
    state.runtimeChainProgress = Math.max(state.runtimeChainProgress, 48);
    await loadScriptEntry(routeEntry);

    updateRouteConductorState();

    state.runtimeChainStage = "LOADING_CANVAS_PARENT";
    state.runtimeChainProgress = Math.max(state.runtimeChainProgress, 58);
    await loadScriptEntry(canvasEntry);

    updateCanvasState();
  }

  async function loadCanvasDownstreamScripts() {
    const downstream = RUNTIME_MANIFEST.filter((entry) => {
      return !entry.required && entry.id !== "northRuntimeTable" && entry.id !== "macroWest";
    });

    for (const entry of downstream) {
      state.runtimeChainStage = `LOADING_${entry.id}`;
      state.runtimeChainProgress = Math.max(state.runtimeChainProgress, 62);
      await loadScriptEntry(entry);

      updateCanvasState();

      if (entry.id.indexOf("finger") === 0) {
        const canvas = readCanvasApi();
        if (canvas && isFunction(canvas.scanAllFingers)) {
          try {
            canvas.scanAllFingers();
          } catch (error) {
            recordError("CANVAS_SCAN_ALL_FINGERS_FAILED_NONBLOCKING", error);
          }
        }
      }
    }
  }

  function reconcileDownstreamAfterLoad() {
    state.runtimeChainStage = "RECONCILING_ROUTE_CANVAS_HANDOFF";
    state.runtimeChainProgress = Math.max(state.runtimeChainProgress, 76);

    bootCanvasParent();
    requestRouteConductorRefresh();
    announceCanvasSummaryToRouteConductor();
    requestRouteConductorRefresh();

    updateRouteConductorState();
    updateCanvasState();

    if (state.canvasParentObserved && state.routeConductorObserved) {
      state.runtimeChainFirstGap = state.f13CanvasEvidenceComplete
        ? "NONE_CANVAS_EVIDENCE_REPORTED"
        : state.f13StrictEvidenceGap || "WAITING_CANVAS_F13_EVIDENCE";
      state.runtimeChainRecommendedNextFile = state.f13CanvasEvidenceComplete
        ? "/assets/lab/runtime-table.js"
        : CANVAS_PARENT_FILE;
    } else if (!state.routeConductorObserved) {
      state.runtimeChainFirstGap = "WAITING_ROUTE_CONDUCTOR_GLOBAL";
      state.runtimeChainRecommendedNextFile = ROUTE_CONDUCTOR_FILE;
    } else if (!state.canvasParentObserved) {
      state.runtimeChainFirstGap = "WAITING_CANVAS_PARENT_GLOBAL";
      state.runtimeChainRecommendedNextFile = CANVAS_PARENT_FILE;
    }

    state.runtimeChainProgress = state.f13CanvasEvidenceComplete
      ? state.f13CanvasEvidenceStrict ? 90 : 82
      : state.canvasParentObserved && state.routeConductorObserved ? 72 : state.runtimeChainProgress;

    scheduleStatusUpdate();
  }

  async function bootstrapRuntimeChain(options = {}) {
    if (bootstrapPromise) return bootstrapPromise;

    bootstrapPromise = Promise.resolve().then(async () => {
      state.runtimeChainBootstrapStarted = true;
      state.runtimeChainBootstrapInProgress = true;
      state.runtimeChainBootstrapAttemptCount += 1;
      state.runtimeChainBootstrapLastStartedAt = nowIso();
      state.runtimeReleaseStarted = true;
      state.indexRuntimeBootstrapStarted = true;
      state.runtimeChainStage = "BOOTSTRAP_STARTED";
      state.runtimeChainProgress = Math.max(state.runtimeChainProgress, 34);
      state.runtimeChainFirstGap = "BOOTSTRAPPING_RUNTIME_CHAIN";
      state.runtimeChainRecommendedNextFile = ROUTE_CONDUCTOR_FILE;

      publishDataset();
      scheduleStatusUpdate();
      record("runtimeChainBootstrapStarted", {
        attempt: state.runtimeChainBootstrapAttemptCount,
        reason: options.reason || "boot"
      });

      await loadSupportScripts();
      await loadRequiredRuntimeScripts();
      reconcileDownstreamAfterLoad();
      await loadCanvasDownstreamScripts();
      reconcileDownstreamAfterLoad();

      state.runtimeChainBootstrapInProgress = false;
      state.runtimeChainBootstrapComplete = Boolean(state.routeConductorObserved && state.canvasParentObserved);
      state.runtimeReleaseComplete = state.runtimeChainBootstrapComplete;
      state.indexRuntimeBootstrapComplete = state.runtimeChainBootstrapComplete;
      state.runtimeChainBootstrapLastCompletedAt = nowIso();
      state.runtimeChainStage = state.runtimeChainBootstrapComplete
        ? "RUNTIME_CHAIN_BOOTSTRAP_COMPLETE"
        : "RUNTIME_CHAIN_BOOTSTRAP_PARTIAL";

      if (state.runtimeChainBootstrapComplete) {
        state.runtimeChainFirstGap = state.f13CanvasEvidenceComplete
          ? "NONE_CANVAS_EVIDENCE_REPORTED"
          : state.f13StrictEvidenceGap || "WAITING_CANVAS_F13_EVIDENCE";
      } else if (!state.routeConductorObserved) {
        state.runtimeChainFirstGap = "WAITING_ROUTE_CONDUCTOR_GLOBAL";
        state.runtimeChainRecommendedNextFile = ROUTE_CONDUCTOR_FILE;
      } else if (!state.canvasParentObserved) {
        state.runtimeChainFirstGap = "WAITING_CANVAS_PARENT_GLOBAL";
        state.runtimeChainRecommendedNextFile = CANVAS_PARENT_FILE;
      }

      state.runtimeChainProgress = state.runtimeChainBootstrapComplete
        ? state.f13CanvasEvidenceComplete
          ? state.f13CanvasEvidenceStrict ? 90 : 82
          : 72
        : Math.max(48, state.runtimeChainProgress);

      publishGlobals();
      publishDataset();
      scheduleStatusUpdate();

      record("runtimeChainBootstrapCompleted", {
        complete: state.runtimeChainBootstrapComplete,
        routeConductorObserved: state.routeConductorObserved,
        canvasParentObserved: state.canvasParentObserved,
        canvasStationSummaryAnnouncedToRouteConductor: state.canvasStationSummaryAnnouncedToRouteConductor,
        f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
        f13StrictEvidenceGap: state.f13StrictEvidenceGap,
        firstGap: state.runtimeChainFirstGap
      });

      return getReceipt();
    }).catch((error) => {
      state.runtimeChainBootstrapInProgress = false;
      state.runtimeChainBootstrapComplete = false;
      state.runtimeChainStage = "RUNTIME_CHAIN_BOOTSTRAP_ERROR";
      state.runtimeChainFirstGap = "INDEX_RUNTIME_BOOTSTRAP_ERROR";
      state.runtimeChainRecommendedNextFile = FILE;

      recordError("RUNTIME_CHAIN_BOOTSTRAP_FAILED", error);
      publishDataset();
      scheduleStatusUpdate();

      return getReceipt();
    }).finally(() => {
      bootstrapPromise = null;
    });

    return bootstrapPromise;
  }

  function scheduleRuntimeBootstrap(reason) {
    root.setTimeout(() => {
      bootstrapRuntimeChain({ reason: reason || "scheduled" });
    }, 0);
  }

  function visibleProgress() {
    if (state.f13CanvasEvidenceComplete) return state.f13CanvasEvidenceStrict ? 90 : 82;
    if (state.canvasStationSummaryAnnouncedToRouteConductor) return 76;
    if (state.canvasParentObserved && state.routeConductorObserved) return 72;
    if (state.canvasParentObserved) return 62;
    if (state.routeConductorObserved) return 52;
    if (state.runtimeChainBootstrapStarted) return Math.max(38, state.runtimeChainProgress || 38);
    if (state.copyDiagnosticBound && state.toggleReceiptBound && state.inspectPlanetBound) return 34;
    return 18;
  }

  function visibleStatusText() {
    if (state.f13CanvasEvidenceStrict) return "Canvas evidence strict · waiting North-only latch";
    if (state.f13CanvasEvidenceComplete) return "Canvas evidence reported · strict proof pending";
    if (state.canvasStationSummaryAnnouncedToRouteConductor) return "Canvas summary announced to Route Conductor · waiting visible evidence";
    if (state.canvasParentObserved && state.routeConductorObserved) return "Route Conductor and Canvas parent observed · reconciling F13 evidence";
    if (state.canvasParentObserved) return "Canvas parent observed · waiting Route Conductor reconciliation";
    if (state.routeConductorObserved) return "Route Conductor observed · waiting Canvas parent";
    if (state.runtimeChainBootstrapInProgress) return "Runtime chain bootstrap active";
    if (state.runtimeChainBootstrapStarted) return "Runtime chain bootstrap started";
    return "Front-end authority preserved · runtime chain queued";
  }

  function updateStatusLine(message = "") {
    refreshRefs();

    const progress = visibleProgress();
    const status = visibleStatusText();

    if (refs.stageLabel) refs.stageLabel.textContent = `Planet Engine · ${state.runtimeChainStage}`;
    if (refs.heartbeatText) refs.heartbeatText.textContent = [
      status,
      `firstGap=${state.runtimeChainFirstGap}`,
      `next=${state.runtimeChainRecommendedNextFile}`,
      `last=${message || state.lastAction}`
    ].join(" · ");

    if (refs.latestEvent) refs.latestEvent.textContent = `latest=${CONTRACT}`;
    if (refs.progressFill) refs.progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    if (refs.progressPercent) refs.progressPercent.textContent = `${Math.round(Math.max(0, Math.min(100, progress)))}%`;

    if (refs.routeStatus) {
      refs.routeStatus.textContent = getReceiptText();
    }
  }

  function scheduleStatusUpdate() {
    if (!doc || statusTimer) return;

    statusTimer = root.setTimeout(() => {
      statusTimer = 0;
      updateStatusLine(state.lastAction || state.runtimeChainStage);
    }, 60);
  }

  function publishDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const html = doc.documentElement;

    html.dataset.hearthIndexJsLoaded = "true";
    html.dataset.hearthIndexJsContract = CONTRACT;
    html.dataset.hearthIndexJsReceipt = RECEIPT;
    html.dataset.hearthIndexJsPreviousContract = PREVIOUS_CONTRACT;
    html.dataset.hearthIndexJsPreviousReceipt = PREVIOUS_RECEIPT;
    html.dataset.hearthIndexJsBaselineContract = BASELINE_CONTRACT;
    html.dataset.hearthIndexJsVersion = VERSION;

    html.dataset.hearthPageContext = state.pageContext;
    html.dataset.hearthPageAlias = state.pageAlias;

    html.dataset.hearthIndexButtonAuthorityResetActive = "true";
    html.dataset.hearthFrontendButtonAuthorityRestored = "true";
    html.dataset.hearthButtonAuthorityPreservedFromV54 = "true";
    html.dataset.hearthWindowDocumentCaptureSuppressionRetired = "true";
    html.dataset.hearthNativeAnchorDefaultPreserved = "true";
    html.dataset.hearthDirectButtonBindingActive = "true";

    html.dataset.hearthRuntimeChainBootstrapActive = "true";
    html.dataset.hearthRuntimeChainBootstrapStarted = String(state.runtimeChainBootstrapStarted);
    html.dataset.hearthRuntimeChainBootstrapComplete = String(state.runtimeChainBootstrapComplete);
    html.dataset.hearthRuntimeChainBootstrapInProgress = String(state.runtimeChainBootstrapInProgress);
    html.dataset.hearthRuntimeChainStage = state.runtimeChainStage;
    html.dataset.hearthRuntimeChainProgress = String(visibleProgress());
    html.dataset.hearthRuntimeChainFirstGap = state.runtimeChainFirstGap;
    html.dataset.hearthRuntimeChainRecommendedNextFile = state.runtimeChainRecommendedNextFile;

    html.dataset.hearthRuntimeReleaseHeld = "false";
    html.dataset.hearthRuntimeReleaseStarted = String(state.runtimeReleaseStarted);
    html.dataset.hearthRuntimeReleaseComplete = String(state.runtimeReleaseComplete);
    html.dataset.hearthIndexRuntimeBootstrapStarted = String(state.indexRuntimeBootstrapStarted);
    html.dataset.hearthIndexRuntimeBootstrapComplete = String(state.indexRuntimeBootstrapComplete);

    html.dataset.hearthRouteConductorScriptRequested = String(state.routeConductorScriptRequested);
    html.dataset.hearthRouteConductorLoadedByIndex = String(state.routeConductorLoadedByIndex);
    html.dataset.hearthRouteConductorObserved = String(state.routeConductorObserved);
    html.dataset.hearthRouteConductorApiReady = String(state.routeConductorApiReady);
    html.dataset.hearthRouteConductorRefreshRequested = String(state.routeConductorRefreshRequested);
    html.dataset.hearthRouteConductorRefreshAccepted = String(state.routeConductorRefreshAccepted);
    html.dataset.hearthRouteConductorContract = state.routeConductorContract;
    html.dataset.hearthRouteConductorReceipt = state.routeConductorReceipt;

    html.dataset.hearthCanvasScriptRequested = String(state.canvasScriptRequested);
    html.dataset.hearthCanvasLoadedByIndex = String(state.canvasLoadedByIndex);
    html.dataset.hearthCanvasParentObserved = String(state.canvasParentObserved);
    html.dataset.hearthCanvasParentApiReady = String(state.canvasParentApiReady);
    html.dataset.hearthCanvasParentBootRequested = String(state.canvasParentBootRequested);
    html.dataset.hearthCanvasParentBootAccepted = String(state.canvasParentBootAccepted);
    html.dataset.hearthCanvasStationSummaryObserved = String(state.canvasStationSummaryObserved);
    html.dataset.hearthCanvasStationSummaryAnnouncedToRouteConductor = String(state.canvasStationSummaryAnnouncedToRouteConductor);
    html.dataset.hearthCanvasStationSummaryMethod = state.canvasStationSummaryMethod;

    html.dataset.hearthOptionalScriptRequestedCount = String(state.optionalScriptRequestedCount);
    html.dataset.hearthOptionalScriptLoadedCount = String(state.optionalScriptLoadedCount);
    html.dataset.hearthOptionalScriptErrorCount = String(state.optionalScriptErrorCount);
    html.dataset.hearthRequiredScriptErrorCount = String(state.requiredScriptErrorCount);
    html.dataset.hearthRuntimeManifestLoadedIds = state.loadedManifestIds.join(",");
    html.dataset.hearthRuntimeManifestErroredIds = state.erroredManifestIds.join(",");

    html.dataset.hearthCurrentHtmlContract = CURRENT_HTML_CONTRACT;
    html.dataset.hearthPreviousHtmlContract = PREVIOUS_HTML_CONTRACT;
    html.dataset.hearthObservedHtmlContract = state.observedHtmlContract;
    html.dataset.hearthCurrentHtmlContractRecognized = String(state.currentHtmlContractRecognized);
    html.dataset.hearthHtmlV25Recognized = String(state.htmlV25Recognized);

    html.dataset.hearthCopyDiagnosticBound = String(state.copyDiagnosticBound);
    html.dataset.hearthToggleReceiptBound = String(state.toggleReceiptBound);
    html.dataset.hearthDiagnosticAnchorBound = String(state.diagnosticAnchorBound);
    html.dataset.hearthInspectPlanetBound = String(state.inspectPlanetBound);
    html.dataset.hearthExpandCockpitBound = String(state.expandCockpitBound);
    html.dataset.hearthPortalAnchorsBound = String(state.portalAnchorsBound);
    html.dataset.hearthDetailsDrawersBound = String(state.detailsDrawersBound);

    html.dataset.hearthLastButtonAction = state.lastAction;
    html.dataset.hearthLastButtonActionAt = state.lastActionAt;

    html.dataset.hearthDiagnosticRailLoadedByIndex = "false";
    html.dataset.hearthDiagnosticRailOwnedByIndex = "false";

    html.dataset.hearthIndexOwnsRuntimeBootstrap = "true";
    html.dataset.hearthIndexOwnsRuntimeRelease = "false";
    html.dataset.hearthIndexOwnsRouteConductorLogic = "false";
    html.dataset.hearthIndexOwnsCanvasDrawing = "false";
    html.dataset.hearthIndexOwnsCanvasTruth = "false";
    html.dataset.hearthIndexOwnsFingerTruth = "false";
    html.dataset.hearthRouteConductorOwnsControlBinding = "false";

    html.dataset.hearthF13CanvasReadinessObserved = String(state.f13CanvasReadinessObserved);
    html.dataset.hearthF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    html.dataset.hearthF13InspectEvidenceAvailable = String(state.f13InspectEvidenceAvailable);
    html.dataset.hearthF13CanvasEvidenceStrict = String(state.f13CanvasEvidenceStrict);
    html.dataset.hearthF13CanvasEvidenceDegraded = String(state.f13CanvasEvidenceDegraded);
    html.dataset.hearthF13CanvasEvidenceComplete = String(state.f13CanvasEvidenceComplete);
    html.dataset.hearthF13HardFail = String(state.f13HardFail);
    html.dataset.hearthF13StrictEvidenceGap = state.f13StrictEvidenceGap;

    html.dataset.hearthF13Claimed = "false";
    html.dataset.hearthF21Claimed = "false";
    html.dataset.hearthReadyTextClaimed = "false";
    html.dataset.hearthReadyTextAllowed = "false";
    html.dataset.hearthCompletionLatched = "false";
    html.dataset.visualPassClaimed = "false";
    html.dataset.generatedImage = "false";
    html.dataset.graphicBox = "false";
    html.dataset.webgl = "false";
  }

  function boot() {
    if (state.bootStarted) return getReceipt();

    state.bootStarted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;
    state.runtimeChainStage = "INDEX_BOOT_STARTED";
    state.runtimeChainProgress = 18;
    state.runtimeChainFirstGap = "WAITING_RUNTIME_CHAIN_BOOTSTRAP";
    state.runtimeChainRecommendedNextFile = ROUTE_CONDUCTOR_FILE;

    auditHtml();
    bindControls();
    publishGlobals();
    publishDataset();
    updateStatusLine("boot");

    state.bootComplete = true;

    record("indexBootComplete", {
      htmlContract: state.observedHtmlContract,
      htmlV25Recognized: state.htmlV25Recognized,
      runtimeChainBootstrapQueued: true,
      buttonAuthorityPreservedFromV5_4: true
    });

    scheduleRuntimeBootstrap("index-boot");

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      publishGlobals();
      publishDataset();
      updateStatusLine("postBootRebind");
      record("postBootRebind");
    }, 350);

    root.setTimeout(() => {
      auditHtml();
      bindControls();
      publishGlobals();
      publishDataset();
      updateStatusLine("lateRebind");
      record("lateRebind");
      bootstrapRuntimeChain({ reason: "late-rebind-verification" });
    }, 1200);

    root.setTimeout(() => {
      updateRouteConductorState();
      updateCanvasState();
      announceCanvasSummaryToRouteConductor();
      requestRouteConductorRefresh();
      publishGlobals();
      publishDataset();
      updateStatusLine("runtimeChainFollowup");
      record("runtimeChainFollowup");
    }, 2600);

    return getReceipt();
  }

  function getReceipt() {
    updateRouteConductorState();
    updateCanvasState();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: state.role,
      pageContext: state.pageContext,
      pageAlias: state.pageAlias,

      currentHtmlContract: CURRENT_HTML_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      observedHtmlContract: state.observedHtmlContract,
      currentHtmlContractRecognized: state.currentHtmlContractRecognized,
      htmlV25Recognized: state.htmlV25Recognized,

      bootStarted: state.bootStarted,
      bootComplete: state.bootComplete,
      controlStyleInjected: state.controlStyleInjected,

      buttonAuthorityActive: true,
      frontendButtonAuthorityRestored: true,
      buttonAuthorityPreservedFromV5_4: true,
      globalSuppressionAvoided: true,
      windowDocumentCaptureSuppressionRetired: true,
      nativeAnchorDefaultPreserved: true,
      directButtonBindingActive: true,
      delegatedButtonBindingActive: true,
      detailsSummaryBindingActive: true,

      copyDiagnosticBound: state.copyDiagnosticBound,
      toggleReceiptBound: state.toggleReceiptBound,
      diagnosticAnchorBound: state.diagnosticAnchorBound,
      inspectPlanetBound: state.inspectPlanetBound,
      expandCockpitBound: state.expandCockpitBound,
      portalAnchorsBound: state.portalAnchorsBound,
      detailsDrawersBound: state.detailsDrawersBound,

      copyDiagnosticCount: state.copyDiagnosticCount,
      toggleReceiptCount: state.toggleReceiptCount,
      diagnosticAnchorCount: state.diagnosticAnchorCount,
      inspectPlanetCount: state.inspectPlanetCount,
      showDiagnosticCount: state.showDiagnosticCount,
      expandCockpitCount: state.expandCockpitCount,
      portalNavigationCount: state.portalNavigationCount,
      drawerToggleCount: state.drawerToggleCount,

      receiptVisible: state.receiptVisible,
      inspectModeActive: state.inspectModeActive,
      cockpitMode: state.cockpitMode,
      lastAction: state.lastAction,
      lastActionAt: state.lastActionAt,
      lastError: state.lastError,

      runtimeChainBootstrapActive: true,
      runtimeChainBootstrapStarted: state.runtimeChainBootstrapStarted,
      runtimeChainBootstrapComplete: state.runtimeChainBootstrapComplete,
      runtimeChainBootstrapInProgress: state.runtimeChainBootstrapInProgress,
      runtimeChainBootstrapAttemptCount: state.runtimeChainBootstrapAttemptCount,
      runtimeChainBootstrapLastStartedAt: state.runtimeChainBootstrapLastStartedAt,
      runtimeChainBootstrapLastCompletedAt: state.runtimeChainBootstrapLastCompletedAt,
      runtimeChainStage: state.runtimeChainStage,
      runtimeChainProgress: visibleProgress(),
      runtimeChainFirstGap: state.runtimeChainFirstGap,
      runtimeChainRecommendedNextFile: state.runtimeChainRecommendedNextFile,

      runtimeReleaseHeld: false,
      runtimeReleaseStarted: state.runtimeReleaseStarted,
      runtimeReleaseComplete: state.runtimeReleaseComplete,
      indexRuntimeBootstrapStarted: state.indexRuntimeBootstrapStarted,
      indexRuntimeBootstrapComplete: state.indexRuntimeBootstrapComplete,

      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      routeConductorRequiredContract: ROUTE_CONDUCTOR_CONTRACT,
      routeConductorRequiredReceipt: ROUTE_CONDUCTOR_RECEIPT,
      routeConductorScriptRequested: state.routeConductorScriptRequested,
      routeConductorLoadedByIndex: state.routeConductorLoadedByIndex,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorApiReady: state.routeConductorApiReady,
      routeConductorRefreshRequested: state.routeConductorRefreshRequested,
      routeConductorRefreshAccepted: state.routeConductorRefreshAccepted,
      routeConductorReceiptObserved: state.routeConductorReceiptObserved,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,

      canvasParentFile: CANVAS_PARENT_FILE,
      canvasParentRequiredContract: CANVAS_PARENT_CONTRACT,
      canvasParentRequiredReceipt: CANVAS_PARENT_RECEIPT,
      canvasScriptRequested: state.canvasScriptRequested,
      canvasLoadedByIndex: state.canvasLoadedByIndex,
      canvasParentObserved: state.canvasParentObserved,
      canvasParentApiReady: state.canvasParentApiReady,
      canvasParentBootRequested: state.canvasParentBootRequested,
      canvasParentBootAccepted: state.canvasParentBootAccepted,
      canvasStationSummaryObserved: state.canvasStationSummaryObserved,
      canvasStationSummaryAnnouncedToRouteConductor: state.canvasStationSummaryAnnouncedToRouteConductor,
      canvasStationSummaryMethod: state.canvasStationSummaryMethod,

      runtimeManifestEntryCount: state.manifestEntryCount,
      optionalScriptRequestedCount: state.optionalScriptRequestedCount,
      optionalScriptLoadedCount: state.optionalScriptLoadedCount,
      optionalScriptErrorCount: state.optionalScriptErrorCount,
      requiredScriptErrorCount: state.requiredScriptErrorCount,
      loadedManifestIds: state.loadedManifestIds.slice(),
      erroredManifestIds: state.erroredManifestIds.slice(),
      skippedManifestIds: state.skippedManifestIds.slice(),

      diagnosticRailLoadedByIndex: false,
      diagnosticRailOwnedByIndex: false,

      htmlOwnsVisibleShell: true,
      indexCreatesVisibleShell: false,
      routeConductorOwnsControlBinding: false,
      indexOwnsButtonBindingOnly: false,
      indexOwnsRuntimeBootstrap: true,
      indexOwnsRuntimeRelease: false,
      indexOwnsRouteConductorLogic: false,
      indexOwnsCanvasDrawing: false,
      indexOwnsCanvasTruth: false,
      indexOwnsFingerTruth: false,
      indexOwnsDiagnosticRailCaseSelection: false,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,

      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      startedAt: state.startedAt,
      updatedAt: state.updatedAt || nowIso(),

      ...FINAL_FALSE
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    return [
      "HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP_BUTTON_AUTHORITY_PRESERVATION_RECEIPT",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("baselineContract", r.baselineContract),
      line("version", r.version),
      line("route", r.route),
      line("file", r.file),
      line("htmlFile", r.htmlFile),
      line("diagnosticRoute", r.diagnosticRoute),
      line("pageContext", r.pageContext),
      line("pageAlias", r.pageAlias),
      "",
      "HTML_ALIGNMENT",
      line("currentHtmlContract", r.currentHtmlContract),
      line("previousHtmlContract", r.previousHtmlContract),
      line("observedHtmlContract", r.observedHtmlContract),
      line("currentHtmlContractRecognized", r.currentHtmlContractRecognized),
      line("htmlV25Recognized", r.htmlV25Recognized),
      "",
      "BUTTON_AUTHORITY_PRESERVED",
      line("buttonAuthorityActive", r.buttonAuthorityActive),
      line("frontendButtonAuthorityRestored", r.frontendButtonAuthorityRestored),
      line("buttonAuthorityPreservedFromV5_4", r.buttonAuthorityPreservedFromV5_4),
      line("globalSuppressionAvoided", r.globalSuppressionAvoided),
      line("windowDocumentCaptureSuppressionRetired", r.windowDocumentCaptureSuppressionRetired),
      line("nativeAnchorDefaultPreserved", r.nativeAnchorDefaultPreserved),
      line("directButtonBindingActive", r.directButtonBindingActive),
      line("detailsSummaryBindingActive", r.detailsSummaryBindingActive),
      "",
      "BOUND_CONTROLS",
      line("copyDiagnosticBound", r.copyDiagnosticBound),
      line("toggleReceiptBound", r.toggleReceiptBound),
      line("diagnosticAnchorBound", r.diagnosticAnchorBound),
      line("inspectPlanetBound", r.inspectPlanetBound),
      line("expandCockpitBound", r.expandCockpitBound),
      line("portalAnchorsBound", r.portalAnchorsBound),
      line("detailsDrawersBound", r.detailsDrawersBound),
      "",
      "CURRENT_STATE",
      line("receiptVisible", r.receiptVisible),
      line("inspectModeActive", r.inspectModeActive),
      line("cockpitMode", r.cockpitMode),
      line("lastAction", r.lastAction),
      line("lastActionAt", r.lastActionAt),
      line("lastError", r.lastError),
      "",
      "RUNTIME_CHAIN_BOOTSTRAP",
      line("runtimeChainBootstrapActive", r.runtimeChainBootstrapActive),
      line("runtimeChainBootstrapStarted", r.runtimeChainBootstrapStarted),
      line("runtimeChainBootstrapComplete", r.runtimeChainBootstrapComplete),
      line("runtimeChainBootstrapInProgress", r.runtimeChainBootstrapInProgress),
      line("runtimeChainBootstrapAttemptCount", r.runtimeChainBootstrapAttemptCount),
      line("runtimeChainStage", r.runtimeChainStage),
      line("runtimeChainProgress", r.runtimeChainProgress),
      line("runtimeChainFirstGap", r.runtimeChainFirstGap),
      line("runtimeChainRecommendedNextFile", r.runtimeChainRecommendedNextFile),
      "",
      "RUNTIME_RELEASE",
      line("runtimeReleaseHeld", r.runtimeReleaseHeld),
      line("runtimeReleaseStarted", r.runtimeReleaseStarted),
      line("runtimeReleaseComplete", r.runtimeReleaseComplete),
      line("indexRuntimeBootstrapStarted", r.indexRuntimeBootstrapStarted),
      line("indexRuntimeBootstrapComplete", r.indexRuntimeBootstrapComplete),
      "",
      "ROUTE_CONDUCTOR",
      line("routeConductorFile", r.routeConductorFile),
      line("routeConductorRequiredContract", r.routeConductorRequiredContract),
      line("routeConductorRequiredReceipt", r.routeConductorRequiredReceipt),
      line("routeConductorScriptRequested", r.routeConductorScriptRequested),
      line("routeConductorLoadedByIndex", r.routeConductorLoadedByIndex),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorApiReady", r.routeConductorApiReady),
      line("routeConductorRefreshRequested", r.routeConductorRefreshRequested),
      line("routeConductorRefreshAccepted", r.routeConductorRefreshAccepted),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorReceipt", r.routeConductorReceipt),
      "",
      "CANVAS_PARENT",
      line("canvasParentFile", r.canvasParentFile),
      line("canvasParentRequiredContract", r.canvasParentRequiredContract),
      line("canvasParentRequiredReceipt", r.canvasParentRequiredReceipt),
      line("canvasScriptRequested", r.canvasScriptRequested),
      line("canvasLoadedByIndex", r.canvasLoadedByIndex),
      line("canvasParentObserved", r.canvasParentObserved),
      line("canvasParentApiReady", r.canvasParentApiReady),
      line("canvasParentBootRequested", r.canvasParentBootRequested),
      line("canvasParentBootAccepted", r.canvasParentBootAccepted),
      line("canvasStationSummaryObserved", r.canvasStationSummaryObserved),
      line("canvasStationSummaryAnnouncedToRouteConductor", r.canvasStationSummaryAnnouncedToRouteConductor),
      line("canvasStationSummaryMethod", r.canvasStationSummaryMethod),
      "",
      "DOWNSTREAM_MANIFEST",
      line("runtimeManifestEntryCount", r.runtimeManifestEntryCount),
      line("optionalScriptRequestedCount", r.optionalScriptRequestedCount),
      line("optionalScriptLoadedCount", r.optionalScriptLoadedCount),
      line("optionalScriptErrorCount", r.optionalScriptErrorCount),
      line("requiredScriptErrorCount", r.requiredScriptErrorCount),
      line("loadedManifestIds", (r.loadedManifestIds || []).join(",")),
      line("erroredManifestIds", (r.erroredManifestIds || []).join(",")),
      "",
      "VISIBLE_PLANET_EVIDENCE",
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      "",
      "OWNERSHIP",
      line("htmlOwnsVisibleShell", r.htmlOwnsVisibleShell),
      line("indexCreatesVisibleShell", r.indexCreatesVisibleShell),
      line("routeConductorOwnsControlBinding", r.routeConductorOwnsControlBinding),
      line("indexOwnsRuntimeBootstrap", r.indexOwnsRuntimeBootstrap),
      line("indexOwnsRuntimeRelease", r.indexOwnsRuntimeRelease),
      line("indexOwnsRouteConductorLogic", r.indexOwnsRouteConductorLogic),
      line("indexOwnsCanvasDrawing", r.indexOwnsCanvasDrawing),
      line("indexOwnsCanvasTruth", r.indexOwnsCanvasTruth),
      line("indexOwnsFingerTruth", r.indexOwnsFingerTruth),
      line("indexOwnsDiagnosticRailCaseSelection", r.indexOwnsDiagnosticRailCaseSelection),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21SubmittedToNorth", false),
      line("f21EligibilitySubmittedToNorth", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("finalCompletionLatched", false),
      line("degradedCompletionLatched", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      line("startedAt", r.startedAt),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.indexJs = api;
    root.HEARTH.indexBridge = api;
    root.HEARTH.frontendButtonAuthorityReset = api;
    root.HEARTH.buttonAuthority = api;
    root.HEARTH.indexRuntimeChainBootstrap = api;
    root.HEARTH.indexJsReceipt = getReceipt();

    root.DEXTER_LAB.hearthIndexJs = api;
    root.DEXTER_LAB.hearthFrontendButtonAuthorityReset = api;
    root.DEXTER_LAB.hearthIndexRuntimeChainBootstrap = api;

    root.HEARTH_INDEX_JS = api;
    root.HEARTH_INDEX_BRIDGE = api;
    root.HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET = api;
    root.HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP = api;
    root.HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP_BUTTON_AUTHORITY_PRESERVATION = api;
    root.HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP_BUTTON_AUTHORITY_PRESERVATION_RECEIPT = getReceipt();
    root.HEARTH_INDEX_JS_RUNTIME_CHAIN_BOOTSTRAP_BUTTON_AUTHORITY_PRESERVATION_RECEIPT_v5_5 = getReceipt();

    state.publishedAt = state.publishedAt || nowIso();
    publishDataset();
    return api;
  }

  const api = Object.freeze({
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    ROUTE_CONDUCTOR_FILE,
    ROUTE_CONDUCTOR_CONTRACT,
    ROUTE_CONDUCTOR_RECEIPT,
    CANVAS_PARENT_FILE,
    CANVAS_PARENT_CONTRACT,
    CANVAS_PARENT_RECEIPT,
    RUNTIME_MANIFEST,

    boot,
    init: boot,
    start: boot,
    run: boot,

    bindControls,
    auditHtml,
    copyDiagnostic,
    toggleReceiptPanel,
    setInspectMode,
    toggleCockpitMode,

    bootstrapRuntimeChain,
    scheduleRuntimeBootstrap,
    loadScriptEntry,
    updateRouteConductorState,
    updateCanvasState,
    readRouteConductorApi,
    readCanvasApi,
    bootCanvasParent,
    requestRouteConductorRefresh,
    announceCanvasSummaryToRouteConductor,
    getCanvasSummary,

    getReceipt,
    getReceiptText,
    publishGlobals,
    publishDataset,

    buttonAuthorityActive: true,
    frontendButtonAuthorityRestored: true,
    buttonAuthorityPreservedFromV5_4: true,
    runtimeChainBootstrapActive: true,
    diagnosticRailLoadedByIndex: false,
    diagnosticRailOwnedByIndex: false,

    indexOwnsRuntimeBootstrap: true,
    indexOwnsRuntimeRelease: false,
    indexOwnsRouteConductorLogic: false,
    indexOwnsCanvasDrawing: false,
    indexOwnsCanvasTruth: false,
    indexOwnsFingerTruth: false,
    indexOwnsDiagnosticRailCaseSelection: false,

    ownsButtonAuthority: true,
    ownsRuntimeChainBootstrap: true,
    ownsRuntimeRelease: false,
    ownsRouteConductorLogic: false,
    ownsCanvasDrawing: false,
    ownsCanvasTruth: false,
    ownsFingerTruth: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  publishGlobals();

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
