// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9
// Full-file replacement.
// Route Conductor / North Bishop recognition funnel / Queen control admission / Canvas receiver release.
// Purpose:
// - Preserve v9_8 control-file admission and handshake delivery.
// - Preserve v9_7/v9_8 compatibility surfaces.
// - Adopt the cleaned hierarchy language:
//   Cardinal Bishops: Lab North, Lab East, Lab South, Lab West.
//   Route Conductor: North route bishop for this funnel.
//   Canvas Hub: receiver/output bishop.
//   Finger files: downstream finger bishops.
//   Inspect finger: pointer-finger bishop.
//   Index JS: priest.
//   Controls: Queen.
// - Recognize current Canvas v12_3 and v12_2/v12_1/v12 lineage.
// - Recognize current LabWest v4_7 bishop-chord release bridge.
// - Recognize current Queen controls bridge.
// - Fix stale receipt publication by always republishing current receipts and packets.
// - Preserve control admission as route-conductor duty when HTML suppresses direct control load.
// - Preserve Canvas as receiver/output carrier only.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth, Canvas drawing authority,
//   finger truth, F21 latch, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - index button authority / priest implementation
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

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT_v9_9";

  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8";
  const PREVIOUS_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_RECEIPT_v9_8";

  const LINEAGE_V9_7_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const LINEAGE_V9_7_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT_v9_7";

  const BASELINE_V9_6_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const BASELINE_V9_6_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_RECEIPT_v9_6";

  const LINEAGE_V9_5_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const LINEAGE_V9_5_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5";

  const COMPAT_V9_4_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const COMPAT_V9_4_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const VERSION = "2026-06-05.hearth-route-conductor-bishop-queen-canvas-recognition-funnel-v9-9";

  const FILE = "/showroom/globe/hearth/hearth.js";
  const ROUTE = "/showroom/globe/hearth/";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_EAST_FILE = "/assets/lab/runtime-table.east.js";
  const LAB_SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";

  const EXPECTED_HTML_CONTRACT = "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_CONTRACT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_CONTROL_CONTRACT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RECEIPT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT_v1";

  const CONTROL_SCRIPT_ID = "hearth-route-conductor-admitted-controls-script";
  const CONTROL_SCRIPT_SRC = `${CONTROL_FILE}?v=${encodeURIComponent(EXPECTED_CONTROL_CONTRACT)}`;

  const JS_INTEGRATION_FUNNEL = `${INDEX_FILE} -> ${FILE} -> ${CONTROL_FILE} -> ${CANVAS_FILE}`;
  const HIERARCHY_VERSION = "HEARTH_BISHOP_QUEEN_PRIEST_CANVAS_RECOGNITION_HIERARCHY_v1";

  const CURRENT_CANVAS_CONTRACT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const CANVAS_V12_2_CONTRACT = "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const CANVAS_V12_1_CONTRACT = "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const CANVAS_V12_CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";

  const CURRENT_LABWEST_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7";

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    EXPECTED_HTML_CONTRACT,
    "HEARTH_HTML_CONTROL_HANDSHAKE_ROUTE_SHELL_INTEGRATION_TNT_v5",
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4",
    "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5",
    "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const ACTIVE_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    CONTRACT,
    PREVIOUS_CONTRACT,
    LINEAGE_V9_7_CONTRACT,
    BASELINE_V9_6_CONTRACT,
    LINEAGE_V9_5_CONTRACT,
    COMPAT_V9_4_CONTRACT
  ]);

  const ACTIVE_CANVAS_CONTRACTS = Object.freeze([
    CURRENT_CANVAS_CONTRACT,
    CANVAS_V12_2_CONTRACT,
    CANVAS_V12_1_CONTRACT,
    CANVAS_V12_CONTRACT,
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

  const CANVAS_BASELINE_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3"
  ]);

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

  const POINTER_FINGER_KEY = "inspect";
  const POINTER_FINGER_FILE = FINGER_FILES.inspect;

  const NEWS_CYCLES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS",
    CONTROL_EXTENSION: "INDEX_PRIEST_ROUTE_BISHOP_QUEEN_CANVAS"
  });

  const GATE_IDS = Object.freeze({
    HTML_SHELL: "HTML_SHELL_GATE",
    INDEX_PRIEST: "INDEX_PRIEST_GATE",
    ROUTE_NORTH_BISHOP: "ROUTE_NORTH_BISHOP_GATE",
    CARDINAL_WEST_BISHOP: "CARDINAL_WEST_BISHOP_GATE",
    CANVAS_RECEIVER_BISHOP: "CANVAS_RECEIVER_BISHOP_GATE",
    VISIBLE_GLOBE: "VISIBLE_GLOBE_GATE",
    FINGER_BISHOPS: "FINGER_BISHOPS_GATE",
    F13_EVIDENCE: "F13_EVIDENCE_GATE",
    F21_NORTH_BOUNDARY: "F21_NORTH_ONLY_BOUNDARY_GATE",
    QUEEN_ADMISSION: "QUEEN_ADMISSION_GATE",
    QUEEN_HANDSHAKE: "QUEEN_HANDSHAKE_GATE"
  });

  const GATE_ORDER = Object.freeze([
    GATE_IDS.HTML_SHELL,
    GATE_IDS.INDEX_PRIEST,
    GATE_IDS.ROUTE_NORTH_BISHOP,
    GATE_IDS.CARDINAL_WEST_BISHOP,
    GATE_IDS.CANVAS_RECEIVER_BISHOP,
    GATE_IDS.VISIBLE_GLOBE,
    GATE_IDS.FINGER_BISHOPS,
    GATE_IDS.F13_EVIDENCE,
    GATE_IDS.F21_NORTH_BOUNDARY,
    GATE_IDS.QUEEN_ADMISSION,
    GATE_IDS.QUEEN_HANDSHAKE
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
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const INDEX_PRIEST_ALIASES = Object.freeze([
    "HEARTH_INDEX_JS",
    "HEARTH_INDEX_BRIDGE",
    "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH.indexJs",
    "HEARTH.indexBridge",
    "HEARTH.frontendButtonAuthorityReset",
    "HEARTH.buttonAuthority",
    "DEXTER_LAB.hearthIndexJs",
    "DEXTER_LAB.hearthIndexBridge",
    "DEXTER_LAB.hearthFrontendButtonAuthorityReset"
  ]);

  const LABWEST_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "HEARTH_WEST_ANOINTED_BISHOP_CHORD_BRIDGE",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
    "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
    "LAB_RUNTIME_TABLE_WEST",
    "RUNTIME_TABLE_WEST",
    "DEXTER_LAB_RUNTIME_TABLE_WEST",
    "LAB_CARDINAL_RUNTIME_TABLE_WEST",
    "LAB_GAP_CLASSIFIER_WEST",
    "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST",
    "HEARTH_RUNTIME_TABLE_WEST",
    "HEARTH_MACRO_WEST_AUTHORITY",
    "HEARTH_WEST_ADMISSIBILITY",
    "HEARTH.runtimeTableWest",
    "HEARTH.westRuntimeTable",
    "HEARTH.westAdmissibility",
    "HEARTH.macroWestAuthority",
    "HEARTH.westBishopChordCanvasReleaseBridge",
    "HEARTH.westAnointedBishopChordBridge",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.gapClassifierWest",
    "DEXTER_LAB.transmissionGapClassifierWest",
    "DEXTER_LAB.westAdmissibility",
    "DEXTER_LAB.hearthWestBishopChordCanvasReleaseBridge",
    "DEXTER_LAB.hearthWestAnointedBishopChordBridge"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EVIDENCE",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasEvidence",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const QUEEN_ALIASES = Object.freeze([
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_QUEEN_SUPERCONDUCTOR_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_FILE",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_PLANETARY_VIEW_CONTROLS",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.queenSuperconductorControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlFile",
    "HEARTH.controlAuthority",
    "HEARTH.planetaryViewControls",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthQueenSuperconductorControls",
    "DEXTER_LAB.hearthControlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthControlFile",
    "DEXTER_LAB.hearthControlAuthority"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const refs = {
    stage: null,
    heartbeat: null,
    latest: null,
    fill: null,
    percent: null,
    lanes: null,
    receiptBox: null,
    receiptText: null,
    status: null
  };

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV97Contract: LINEAGE_V9_7_CONTRACT,
    lineageV97Receipt: LINEAGE_V9_7_RECEIPT,
    baselineV96Contract: BASELINE_V9_6_CONTRACT,
    baselineV96Receipt: BASELINE_V9_6_RECEIPT,
    lineageV95Contract: LINEAGE_V9_5_CONTRACT,
    lineageV95Receipt: LINEAGE_V9_5_RECEIPT,
    compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
    compatibilityRouteConductorReceipt: COMPAT_V9_4_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    hierarchyVersion: HIERARCHY_VERSION,
    routeNorthBishopActive: true,
    cardinalBishopLanguageActive: true,
    downstreamBishopLanguageActive: true,
    queenControlBridgeExpected: true,
    indexPriestLanguageActive: true,
    canvasReceiverBishopExpected: true,
    pointerFingerBishopKey: POINTER_FINGER_KEY,
    pointerFingerBishopFile: POINTER_FINGER_FILE,

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    controlFileAdmissionActive: true,
    controlHandshakeDeliveryActive: true,
    activeNewsCycle: NEWS_CYCLES.CYCLE_2,
    activeFibonacci: "F8",

    booted: false,
    booting: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_ROUTE_CONDUCTOR_V9_9_LOADED",

    currentPacket: null,
    currentReceipt: null,
    currentReceiptText: "",
    currentCanvasSummary: null,
    currentQueenSummary: null,
    currentCanvasReleasePacket: null,
    currentControlHandshakePacket: null,
    currentCompatibilityReceipt: null,

    chronologicalGateCount: GATE_ORDER.length,
    chronologicalGatesSatisfied: 0,
    chronologicalFirstFailedGate: GATE_IDS.HTML_SHELL,
    chronologicalFirstFailedCoordinate: "WAITING_BOOT",

    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationExpected: 100,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,
    fibonacciSynchronizationHardFail: false,
    fibonacciSynchronizationHoldReason: "WAITING_BOOT",

    controlScriptAdmissionRequired: true,
    controlScriptAdmissionAttempted: false,
    controlScriptAdmissionStatus: "WAITING_BOOT",
    controlScriptAdmissionReason: "WAITING_BOOT",
    controlScriptElementFound: false,
    controlScriptElementSrc: "",
    controlScriptInjectedByRouteConductor: false,
    controlScriptLoadComplete: false,
    controlScriptLoadError: "",

    controlHandshakeRequired: true,
    controlHandshakeStatus: "WAITING_BOOT",
    controlHandshakeDeliveryStatus: "WAITING_BOOT",
    controlHandshakeDeliveryMethod: "NONE",
    controlHandshakeDeliveryReason: "WAITING_BOOT",
    controlHandshakeAcceptedByQueen: false,

    queenObserved: false,
    queenAuthoritySource: "NONE",
    queenContract: "",
    queenReceipt: "",
    queenSuperconductorLanguageObserved: false,
    queenReadsLabWestAsOpaqueSuperconductor: false,

    labWestObserved: false,
    labWestAuthoritySource: "NONE",
    labWestContract: "",
    labWestReceipt: "",
    labWestBishopChordLanguageObserved: false,

    canvasObserved: false,
    canvasAuthoritySource: "NONE",
    canvasContract: "",
    canvasReceipt: "",
    canvasV123Recognized: false,

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "LOADED",

    staleReceiptPublicationBlocked: true,
    latestReceiptAlwaysRepublished: true,
    receiptPublishCount: 0,

    lastCanvasReleasePacketSignature: "",
    canvasReleaseDeliveryMethod: "NONE",
    canvasReleaseAcceptedByCanvas: false,

    lastControlHandshakePacketSignature: "",
    controlHandshakeDeliveryMethodLast: "NONE",

    localEvents: [],
    errors: [],
    watchdogTicks: 0,
    admissionTicks: 0,
    renderCount: 0,

    ...NO_CLAIMS
  };

  let bootPromise = null;
  let watchdogTimer = 0;
  let admissionTimer = 0;
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

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
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
    trimLog(state.localEvents, 180);
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
    trimLog(state.errors, 120);
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
    for (const name of names) {
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

  function readField(source, keys, fallback = "") {
    const s = isObject(source) ? source : {};

    for (const key of keys) {
      if (s[key] !== undefined && s[key] !== null && s[key] !== "") return s[key];

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(s)) {
        if (candidate.toLowerCase() === lower) {
          const value = s[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function mergeObjects(...items) {
    const out = {};
    items.forEach((item) => {
      if (!isObject(item)) return;
      Object.keys(item).forEach((key) => {
        if (item[key] !== undefined && item[key] !== null && item[key] !== "") out[key] = item[key];
      });
    });
    return out;
  }

  function stableStringify(value) {
    const seen = new WeakSet();

    function sort(input) {
      if (!input || typeof input !== "object") return input;
      if (seen.has(input)) return "[Circular]";
      seen.add(input);

      if (Array.isArray(input)) return input.map(sort);

      const output = {};
      Object.keys(input).sort().forEach((key) => {
        if (typeof input[key] === "function") return;
        output[key] = sort(input[key]);
      });
      return output;
    }

    try {
      return JSON.stringify(sort(value));
    } catch (_error) {
      return safeString(value);
    }
  }

  function packetSignature(packet) {
    if (!isObject(packet)) return "";

    return stableStringify({
      packetType: packet.packetType,
      contract: packet.contract,
      receipt: packet.receipt,
      sourceFile: packet.sourceFile,
      destinationFile: packet.destinationFile,
      targetFile: packet.targetFile,
      handoffTo: packet.handoffTo,
      activeNewsCycle: packet.activeNewsCycle,
      controlHandshakeAuthorized: packet.controlHandshakeAuthorized,
      controlHandshakeStatus: packet.controlHandshakeStatus,
      canvasReleaseAuthorized: packet.canvasReleaseAuthorized
    });
  }

  function scriptByPath(path) {
    if (!doc) return null;

    const scripts = qa("script[src]");
    return scripts.find((script) => {
      try {
        const src = script.getAttribute("src") || "";
        const url = new URL(src, root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com");
        return url.pathname === path || url.pathname.endsWith(path);
      } catch (_error) {
        const src = script.getAttribute("src") || "";
        return src.includes(path);
      }
    }) || null;
  }

  function scriptSrc(path) {
    const script = scriptByPath(path);
    return script ? safeString(script.getAttribute("src"), "") : "";
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;
    if (authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getControlHandshakeSummary",
      "getQueenBridgeState",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisibleBaseGlobeReceipt",
      "getVisibleGlobeReceipt",
      "getVisiblePlanetReceipt",
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
    if (isObject(authority.controlReceipt)) return authority.controlReceipt;
    if (isObject(authority.controlHandshakeReceipt)) return authority.controlHandshakeReceipt;
    if (isObject(authority.visiblePlanetReceipt)) return authority.visiblePlanetReceipt;
    if (isObject(authority.visibleBaseGlobeReceipt)) return authority.visibleBaseGlobeReceipt;
    if (isObject(authority.expressionHubReceipt)) return authority.expressionHubReceipt;
    if (isObject(authority.canvasStationSummary)) return authority.canvasStationSummary;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function noClaimPreserved(summary) {
    const s = isObject(summary) ? summary : {};
    return !(
      s.f21ClaimedByRouteConductor === true ||
      s.f21SubmittedToNorth === true ||
      s.completionLatched === true ||
      s.finalCompletionLatched === true ||
      s.readyTextAllowed === true ||
      s.readyTextClaimed === true ||
      s.visualPassClaimed === true ||
      s.generatedImage === true ||
      s.graphicBox === true ||
      s.webGL === true ||
      s.webgl === true
    );
  }

  function gate(id, passed, coordinate, nextFile, evidence = {}) {
    return {
      id,
      passed: Boolean(passed),
      firstFailedCoordinate: passed ? `NONE_${id}_PASSED` : safeString(coordinate, `WAITING_${id}`),
      recommendedNextFile: safeString(nextFile, FILE),
      evidence: clonePlain(evidence)
    };
  }

  function scanDomForVisibleCanvas() {
    if (!doc) {
      return {
        mountPresent: false,
        canvasPresent: false,
        canvasNonZero: false,
        canvasMounted: false,
        canvasDrawComplete: false,
        visiblePlanetProofReady: false
      };
    }

    const mount =
      doc.getElementById("hearthCanvasMount") ||
      q("[data-hearth-canvas-mount='true']") ||
      q("[data-hearth-canvas-mount]") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-visible-planet-mount]");

    const canvas = mount
      ? mount.querySelector("canvas")
      : q("canvas[data-hearth-visible-canvas='true'],canvas[data-hearth-canvas-hub='true'],canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true'],canvas");

    const rect = canvas && isFunction(canvas.getBoundingClientRect)
      ? canvas.getBoundingClientRect()
      : null;

    const canvasNonZero = Boolean(
      canvas &&
      (
        (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0) ||
        (rect && safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0)
      )
    );

    const datasetMounted = (
      datasetValue("hearthCanvasMounted") === "true" ||
      datasetValue("hearthCanvasBaseGlobeMounted") === "true" ||
      datasetValue("hearthCanvasVisibleBaseGlobeCarrierActive") === "true" ||
      datasetValue("hearthSouthCanvasMounted") === "true" ||
      datasetValue("hearthCanvasElementFound") === "true"
    );

    const datasetDraw = (
      datasetValue("hearthCanvasDrawComplete") === "true" ||
      datasetValue("hearthCanvasBaseGlobeDrawComplete") === "true" ||
      datasetValue("hearthCanvasVisiblePlanetProofReady") === "true" ||
      datasetValue("hearthSouthVisiblePlanetProofReady") === "true" ||
      datasetValue("hearthCanvasHoldingFieldDrawComplete") === "true"
    );

    return {
      mountPresent: Boolean(mount),
      canvasPresent: Boolean(canvas),
      canvasNonZero,
      canvasMounted: Boolean(datasetMounted || canvasNonZero),
      canvasDrawComplete: Boolean(datasetDraw || canvasNonZero),
      visiblePlanetProofReady: Boolean(canvasNonZero || datasetMounted || datasetDraw)
    };
  }

  function scanHtmlGate() {
    const html = doc ? doc.documentElement : null;
    const contract =
      datasetValue("contract") ||
      datasetValue("hearthHtmlContract") ||
      datasetValue("hearthShellContract") ||
      datasetValue("htmlContract");

    const mount = doc ? doc.getElementById("hearthCanvasMount") || q("[data-hearth-canvas-mount]") || q("[data-hearth-visible-planet-mount]") : null;
    const stage = doc ? doc.getElementById("hearthGlobeStage") || q("[data-hearth-globe-stage]") || q("[data-hearth-planet-stage]") : null;
    const receiptPanel = doc ? doc.getElementById("hearthReceiptPanel") || q("[data-hearth-receipt-box]") : null;
    const receiptText = doc ? q("[data-hearth-receipt-text]") : null;
    const routeStatus = doc ? doc.getElementById("hearth-route-status") || q("[data-hearth-route-status]") : null;
    const diagnosticAnchor = doc ? doc.getElementById("hearthDiagnosticRailEmergencyAnchor") || q("[data-hearth-diagnostic-rail-native-anchor]") : null;

    const contextActive = Boolean(
      datasetValue("planetEnginePage") === "true" ||
      datasetValue("planetFactoryPage") === "true" ||
      datasetValue("planetaryTemplateDevelopmentPage") === "true" ||
      datasetValue("pageContext").includes("Planet Engine") ||
      datasetValue("pageContext").includes("Planet Factory") ||
      datasetValue("publicFacingPurpose").toLowerCase().includes("planet") ||
      html
    );

    const contractRecognized = Boolean(!contract || ACCEPTED_HTML_CONTRACTS.includes(contract));
    const receiverTargetsReady = Boolean(receiptPanel || receiptText || routeStatus || diagnosticAnchor);
    const visibleMountReady = Boolean(mount || stage);
    const routeConductorOwnsControlFileAdmission =
      datasetValue("routeConductorOwnsControlFileAdmission") === "true" ||
      datasetValue("htmlLoadsControlFile") === "false" ||
      datasetValue("controlDirectLoadSuppressedByHtml") === "true";

    const passed = Boolean(html && contractRecognized && contextActive && visibleMountReady);

    return gate(
      GATE_IDS.HTML_SHELL,
      passed,
      !html
        ? "WAITING_HTML_DOCUMENT"
        : !contractRecognized
          ? "WAITING_EXPECTED_HTML_CONTRACT"
          : !contextActive
            ? "WAITING_PLANET_ENGINE_CONTEXT"
            : !visibleMountReady
              ? "WAITING_VISIBLE_PLANET_MOUNT"
              : "WAITING_HTML_SHELL_GATE",
      HTML_FILE,
      {
        servedHtmlContract: contract || "UNKNOWN",
        expectedHtmlContract: EXPECTED_HTML_CONTRACT,
        acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
        contextActive,
        receiverTargetsReady,
        visibleMountReady,
        routeConductorOwnsControlFileAdmission,
        htmlLoadsControlFile: datasetValue("htmlLoadsControlFile", "UNKNOWN"),
        controlDirectLoadSuppressedByHtml: datasetValue("controlDirectLoadSuppressedByHtml", "UNKNOWN"),
        receiptPanelPresent: Boolean(receiptPanel),
        receiptTextPresent: Boolean(receiptText),
        routeStatusPresent: Boolean(routeStatus),
        diagnosticAnchorPresent: Boolean(diagnosticAnchor),
        visualPassClaimed: false
      }
    );
  }

  function readIndexPriestGate() {
    const found = firstGlobal(INDEX_PRIEST_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const dom = scanDomForVisibleCanvas();

    const observedContract = firstNonEmpty(
      readField(receipt, ["contract", "CONTRACT"]),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      datasetValue("hearthIndexJsContract")
    );

    const observed = Boolean(
      found.value ||
      observedContract ||
      datasetValue("hearthIndexJsLoaded") === "true" ||
      datasetValue("hearthFrontendButtonAuthorityRestored") === "true" ||
      scriptByPath(INDEX_FILE)
    );

    const contractReady = Boolean(!observedContract || observedContract === EXPECTED_INDEX_CONTRACT);

    const carrierHostReady = Boolean(
      safeBool(firstDefined(receipt.carrierHostAdmissibilityReady, receipt.carrierHostReady), false) ||
      root.HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY_READY === true ||
      datasetValue("hearthCarrierHostAdmissibilityReady") === "true" ||
      datasetValue("hearthSouthCarrierHostAdmissibilityReady") === "true" ||
      dom.mountPresent
    );

    const handoffReady = Boolean(
      safeBool(firstDefined(receipt.handoffToRouteConductor, receipt.indexHandoffToRouteConductor), false) ||
      root.HEARTH_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR === true ||
      datasetValue("hearthIndexHandoffToRouteConductor") === "true" ||
      carrierHostReady
    );

    const passed = Boolean(observed && contractReady && carrierHostReady && handoffReady);

    return gate(
      GATE_IDS.INDEX_PRIEST,
      passed,
      !observed
        ? "WAITING_INDEX_PRIEST_AUTHORITY"
        : !contractReady
          ? "WAITING_EXPECTED_INDEX_PRIEST_CONTRACT"
          : !carrierHostReady
            ? "WAITING_INDEX_PRIEST_CARRIER_HOST_ADMISSIBILITY"
            : !handoffReady
              ? "WAITING_INDEX_PRIEST_HANDOFF_TO_ROUTE_BISHOP"
              : "WAITING_INDEX_PRIEST_GATE",
      INDEX_FILE,
      {
        indexPriestLanguageActive: true,
        sourceName: found.name,
        indexPriestAuthorityObserved: observed,
        observedIndexContract: observedContract || "UNKNOWN",
        expectedIndexContract: EXPECTED_INDEX_CONTRACT,
        indexScriptSrc: scriptSrc(INDEX_FILE) || "UNKNOWN",
        contractReady,
        carrierHostAdmissibilityReady: carrierHostReady,
        indexPriestHandoffToRouteBishop: handoffReady,
        indexOwnsButtonBindingOnly: safeBool(firstDefined(receipt.indexOwnsButtonBindingOnly, true), true),
        routeBishopOwnsButtonBinding: false
      }
    );
  }

  function readRouteNorthBishopGate() {
    const markerPresent = Boolean(
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true ||
      datasetValue("hearthRouteConductorMarkerPresent") === "true" ||
      root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ === CONTRACT
    );

    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR === api ||
      root.HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL === api ||
      root.HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY === api ||
      root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION === api ||
      (root.HEARTH && root.HEARTH.routeConductor === api) ||
      (root.HEARTH && root.HEARTH.routeNorthBishop === api) ||
      (root.HEARTH && root.HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel === api) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.hearthRouteConductor === api)
    );

    const passed = Boolean(markerPresent && apiPresent);

    return gate(
      GATE_IDS.ROUTE_NORTH_BISHOP,
      passed,
      !markerPresent
        ? "WAITING_ROUTE_NORTH_BISHOP_MARKER"
        : !apiPresent
          ? "WAITING_ROUTE_NORTH_BISHOP_API"
          : "WAITING_ROUTE_NORTH_BISHOP_GATE",
      FILE,
      {
        routeNorthBishopActive: true,
        routeConductorMarkerPresent: markerPresent,
        routeConductorApiPresent: apiPresent,
        routeConductorRuntimeActive: true,
        routeConductorContract: CONTRACT,
        previousRouteConductorContract: PREVIOUS_CONTRACT,
        activeFibonacci: "F8"
      }
    );
  }

  function readLabWestCardinalBishop(indexGate, routeGate) {
    const found = firstGlobal(LABWEST_ALIASES);
    const authority = found.value;
    const receipt = readAuthorityReceipt(authority) || {};
    const dsContract = datasetValue("hearthWestRuntimeTableContract") || datasetValue("labRuntimeTableWestContract");
    const dsReceipt = datasetValue("hearthWestRuntimeTableReceipt") || datasetValue("labRuntimeTableWestReceipt");

    const base = mergeObjects(receipt, {
      contract: firstNonEmpty(receipt.contract, receipt.CONTRACT, authority && authority.contract, authority && authority.CONTRACT, dsContract),
      receipt: firstNonEmpty(receipt.receipt, receipt.RECEIPT, authority && authority.receipt, authority && authority.RECEIPT, dsReceipt)
    });

    let result = base;
    let methodUsed = "receipt-fallback";

    if (authority && isObject(authority) && indexGate.passed && routeGate.passed) {
      const candidate = {
        event: "NEWS_CYCLE_2_CANVAS_RELEASE_ADMISSIBILITY",
        contract: CONTRACT,
        receipt: RECEIPT,
        sourceFile: FILE,
        targetFile: LAB_WEST_FILE,
        destinationFile: LAB_WEST_FILE,
        activeNewsCycle: NEWS_CYCLES.CYCLE_2,
        sourceCardinal: "SOUTH",
        targetCardinal: "WEST",
        handoffTo: "WEST",
        indexGateReady: indexGate.passed,
        routeF8GateReady: routeGate.passed,
        visibleGlobeProofIngestionRequested: true,
        queenControlBridgeExpected: true,
        bishopQueenCanvasRecognitionFunnelActive: true,
        newsAlignmentActive: true,
        fibonacciSynchronizationActive: true,
        ...NO_CLAIMS
      };

      const methods = [
        "classifyWestAdmissibility",
        "classifyCyclePacket",
        "createWestCycleReceipt",
        "createGapReceipt",
        "classifyGap",
        "classifyTransmissionGap",
        "inspect",
        "assess"
      ];

      for (const method of methods) {
        if (!isFunction(authority[method])) continue;

        try {
          const output = authority[method](clonePlain(candidate), {
            routeConductorContract: CONTRACT,
            activeNewsCycle: NEWS_CYCLES.CYCLE_2,
            activeFibonacci: "F13N",
            visibleGlobeProofIngestionRequested: true,
            queenControlBridgeExpected: true
          });

          if (isObject(output)) {
            result = mergeObjects(base, output);
            methodUsed = method;
            break;
          }
        } catch (error) {
          recordError("CARDINAL_WEST_BISHOP_METHOD_FAILED", error, { method });
        }
      }
    }

    const contract = firstNonEmpty(result.contract, result.CONTRACT, base.contract);
    const receiptName = firstNonEmpty(result.receipt, result.RECEIPT, base.receipt);
    const decision = safeString(firstDefined(result.westDecision, result.decision, result.status), "UNKNOWN");
    const hardBlock = Boolean(safeBool(firstDefined(result.westHardBlock, result.hardBlock), false) || decision === "HARD_BLOCK");
    const forwardAllowed = Boolean(!hardBlock && (
      safeBool(firstDefined(result.westForwardAllowed, result.forwardAllowed), false) ||
      decision === "RELEASE_TO_CANVAS" ||
      decision === "DEGRADED_FORWARD"
    ));
    const releaseApproved = Boolean(!hardBlock && (
      safeBool(firstDefined(result.westCanvasReleaseApproved, result.canvasReleaseApprovedByWest), false) ||
      forwardAllowed ||
      decision === "RELEASE_TO_CANVAS" ||
      decision === "DEGRADED_FORWARD"
    ));

    const observed = Boolean(
      authority ||
      contract ||
      datasetValue("hearthSouthMacroWestAuthorityObserved") === "true" ||
      datasetValue("hearthWestBishopChordBridgeActive") === "true"
    );

    const bishopChordLanguageObserved = Boolean(
      contract === CURRENT_LABWEST_CONTRACT ||
      safeBool(firstDefined(result.bishopChordBridgeActive, result.hearthWestBishopChordBridgeActive), false) ||
      datasetValue("hearthWestBishopChordBridgeActive") === "true" ||
      found.name.includes("BISHOP_CHORD")
    );

    state.labWestObserved = observed;
    state.labWestAuthoritySource = found.name;
    state.labWestContract = contract || "";
    state.labWestReceipt = receiptName || "";
    state.labWestBishopChordLanguageObserved = bishopChordLanguageObserved;

    if (!indexGate.passed || !routeGate.passed) {
      return gate(
        GATE_IDS.CARDINAL_WEST_BISHOP,
        false,
        !indexGate.passed ? indexGate.firstFailedCoordinate : routeGate.firstFailedCoordinate,
        !indexGate.passed ? INDEX_FILE : FILE,
        {
          cardinalWestBishopObserved: observed,
          cardinalWestBishopLanguageObserved: bishopChordLanguageObserved,
          westDecision: "HELD_BY_PRIOR_GATE",
          westHardBlock: false,
          westForwardAllowed: false,
          westCanvasReleaseApproved: false
        }
      );
    }

    return gate(
      GATE_IDS.CARDINAL_WEST_BISHOP,
      Boolean(observed && releaseApproved && !hardBlock),
      !observed
        ? "WAITING_CARDINAL_WEST_BISHOP_AUTHORITY"
        : hardBlock
          ? "CARDINAL_WEST_BISHOP_HARD_BLOCK"
          : !releaseApproved
            ? safeString(firstDefined(result.firstFailedCoordinate, result.westFirstFailedCoordinate), "WAITING_CARDINAL_WEST_BISHOP_CANVAS_RELEASE_APPROVAL")
            : "WAITING_CARDINAL_WEST_BISHOP_GATE",
      LAB_WEST_FILE,
      {
        cardinalBishopLanguageActive: true,
        cardinalWestBishopFile: LAB_WEST_FILE,
        sourceName: found.name,
        cardinalWestBishopObserved: observed,
        cardinalWestBishopLanguageObserved: bishopChordLanguageObserved,
        cardinalWestBishopContract: contract || "",
        cardinalWestBishopReceipt: receiptName || "",
        cardinalWestMethodUsed: methodUsed,
        westDecision: decision,
        westHardBlock: hardBlock,
        westForwardAllowed: forwardAllowed,
        westCanvasReleaseApproved: releaseApproved,
        westFirstFailedCoordinate: safeString(firstDefined(result.firstFailedCoordinate, result.westFirstFailedCoordinate), ""),
        bishopChordBridgeActive: safeBool(firstDefined(result.bishopChordBridgeActive, result.hearthWestBishopChordBridgeActive), bishopChordLanguageObserved),
        bishopSubjectFileDelegationActive: safeBool(firstDefined(result.bishopSubjectFileDelegationActive, result.hearthWestBishopSubjectFileDelegationActive), bishopChordLanguageObserved),
        westKnowsBishopsNotChildren: safeBool(firstDefined(result.westKnowsBishopsNotChildren, result.hearthWestKnowsBishopsNotChildren), true),
        bishopChordStatus: safeString(firstDefined(result.bishopChordStatus, result.hearthWestBishopChordStatus), "UNKNOWN"),
        bishopChordAdmissible: safeString(firstDefined(result.bishopChordAdmissible, result.hearthWestBishopChordAdmissible), "UNKNOWN"),
        bishopChordStrict: safeString(firstDefined(result.bishopChordStrict, result.hearthWestBishopChordStrict), "UNKNOWN"),
        bishopChordDegraded: safeString(firstDefined(result.bishopChordDegraded, result.hearthWestBishopChordDegraded), "UNKNOWN"),
        bishopChordHardBlock: safeString(firstDefined(result.bishopChordHardBlock, result.hearthWestBishopChordHardBlock), "UNKNOWN"),
        bishopChordReadyCount: safeString(firstDefined(result.bishopChordReadyCount, result.hearthWestBishopChordReadyCount), "UNKNOWN"),
        bishopChordObservedCount: safeString(firstDefined(result.bishopChordObservedCount, result.hearthWestBishopChordObservedCount), "UNKNOWN")
      }
    );
  }

  function hasLocalStationShape(summary) {
    const s = isObject(summary) ? summary : {};
    const role = safeString(s.role);
    const packetType = safeString(s.packetType);

    return Boolean(
      packetType.includes("CANVAS_LOCAL_STATION") ||
      packetType.includes("CANVAS_STATION") ||
      role.includes("canvas-local-station") ||
      safeBool(s.canvasLocalStationActive, false) ||
      safeBool(s.childDistributionSwitchboardActive, false) ||
      safeBool(s.routeConductorSummarySurfaceActive, false) ||
      safeBool(s.currentCanvasParentObserved, false)
    );
  }

  function hasExpressionHubShape(summary) {
    const s = isObject(summary) ? summary : {};
    const role = safeString(s.role);
    const packetType = safeString(s.packetType);

    return Boolean(
      packetType.includes("EXPRESSION_HUB") ||
      packetType.includes("FINGER_MANAGER") ||
      packetType.includes("COMPOSITE_FIRST") ||
      role.includes("expression-hub") ||
      role.includes("finger-manager") ||
      safeBool(s.expressionHubActive, false) ||
      safeBool(s.canvasExpressionHubActive, false) ||
      safeBool(s.fingerManagerActive, false) ||
      safeBool(s.canvasFingerManagerActive, false) ||
      safeBool(s.fingerRegistryActive, false) ||
      safeBool(s.compositeFirstVisiblePathActive, false)
    );
  }

  function hasVisibleGlobeShape(summary) {
    const s = isObject(summary) ? summary : {};
    const role = safeString(s.role);
    const packetType = safeString(s.packetType);

    return Boolean(
      packetType.includes("VISIBLE_BASE_GLOBE") ||
      packetType.includes("VISIBLE_GLOBE") ||
      packetType.includes("VISIBLE_PLANET") ||
      role.includes("visible-base-globe") ||
      role.includes("visible-globe") ||
      role.includes("visible-planet") ||
      safeBool(s.visibleBaseGlobeCarrierActive, false) ||
      safeBool(s.canvasVisibleBaseGlobeCarrierActive, false) ||
      safeBool(s.baseGlobeDrawComplete, false) ||
      safeBool(s.baseGlobeVisibleCarrierReady, false) ||
      safeBool(s.visibleGlobeCarrierReady, false) ||
      safeBool(s.visiblePlanetProofReady, false) ||
      safeBool(s.domVisiblePlanetProofReady, false) ||
      safeBool(s.canvasMounted, false) ||
      safeBool(s.canvasDrawComplete, false)
    );
  }

  function readAdditionalCanvasReceipts() {
    const names = [
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT",
      "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT",
      "HEARTH_CANVAS_HUB_RECEIPT",
      "HEARTH_CANVAS_LOCAL_STATION_RECEIPT",
      "HEARTH_CANVAS_STATION_RECEIPT",
      "HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT",
      "HEARTH_CANVAS_FINGER_MANAGER_RECEIPT",
      "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT",
      "HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT",
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt",
      "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiverReceipt",
      "HEARTH.canvasHubReceipt",
      "HEARTH.canvasLocalStationReceipt",
      "HEARTH.canvasStationReceipt",
      "HEARTH.canvasExpressionHubReceipt",
      "HEARTH.canvasFingerManagerReceipt",
      "HEARTH.canvasVisiblePlanetReceipt",
      "HEARTH.canvasReceipt",
      "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt",
      "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiverReceipt",
      "DEXTER_LAB.hearthCanvasHubReceipt",
      "DEXTER_LAB.hearthCanvasLocalStationReceipt",
      "DEXTER_LAB.hearthCanvasStationReceipt",
      "DEXTER_LAB.hearthCanvasExpressionHubReceipt",
      "DEXTER_LAB.hearthCanvasFingerManagerReceipt",
      "DEXTER_LAB.hearthCanvasReceipt"
    ];

    const receipts = [];
    names.forEach((name) => {
      const value = readPath(name);
      if (isObject(value)) receipts.push(value);
    });

    return receipts;
  }

  function readCanvasAuthority() {
    return firstGlobal(CANVAS_ALIASES);
  }

  function readCanvasSummaryFromAuthority(authority) {
    if (!authority || !isObject(authority)) return { method: "NONE", summary: null };

    const methods = [
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisibleBaseGlobeReceipt",
      "getBaseGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getCanvasVisibleProofReceipt",
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCanvasCarrier",
      "getCarrierReceipt",
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? authority[method](false)
          : authority[method]();

        if (isObject(output)) return { method, summary: output };
      } catch (error) {
        recordError("CANVAS_RECEIVER_BISHOP_SUMMARY_METHOD_FAILED", error, { method });
      }
    }

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return { method: "direct-authority-object", summary: authority };
    }

    return { method: "NONE", summary: null };
  }

  function normalizeFingerSummary(summary) {
    const s = isObject(summary) ? summary : {};
    const registry = isObject(s.fingerRegistry) ? s.fingerRegistry : {};
    const tracks = Object.keys(registry).map((key) => registry[key]).filter(isObject);

    const authorityObservedCount = safeNumber(firstDefined(
      s.fingerAuthorityObservedCount,
      tracks.filter((track) => track.authorityObserved).length
    ), 0);

    const apiReadyCount = safeNumber(firstDefined(
      s.fingerApiReadyCount,
      tracks.filter((track) => track.apiReady).length
    ), 0);

    const expressionPacketCount = safeNumber(firstDefined(
      s.fingerExpressionPacketCount,
      tracks.filter((track) => track.expressionPacketReceived).length
    ), 0);

    const receiptPacketCount = safeNumber(firstDefined(
      s.fingerReceiptPacketCount,
      tracks.filter((track) => track.receiptPacketReceived).length
    ), 0);

    const trackReadyCount = safeNumber(firstDefined(
      s.fingerTrackReadyCount,
      tracks.filter((track) => track.trackReady).length
    ), 0);

    const hardFailCount = safeNumber(firstDefined(
      s.fingerHardFailCount,
      tracks.filter((track) => track.hardFail).length
    ), 0);

    const anyActive = Boolean(
      safeBool(s.anyFingerTrackActive, false) ||
      authorityObservedCount > 0 ||
      apiReadyCount > 0 ||
      expressionPacketCount > 0 ||
      receiptPacketCount > 0 ||
      trackReadyCount > 0
    );

    const allReady = Boolean(
      safeBool(s.allDeclaredFingerTracksReady, false) ||
      (tracks.length >= FINGER_SEQUENCE.length && tracks.every((track) => track.trackReady && !track.hardFail))
    );

    const pointerFingerObserved = Boolean(
      registry.inspect ||
      safeString(s.nextFingerKey).toLowerCase() === POINTER_FINGER_KEY ||
      datasetValue("hearthCanvasFingerInspectLoaded") === "true" ||
      datasetValue("hearthCanvasPointerFingerLoaded") === "true"
    );

    const nextKey = safeString(firstDefined(s.nextFingerKey, s.firstFingerGapKey, pointerFingerObserved ? "composite" : POINTER_FINGER_KEY), POINTER_FINGER_KEY);
    const nextFile = safeString(firstDefined(s.nextFingerFile, s.firstFingerGapFile, FINGER_FILES[nextKey], POINTER_FINGER_FILE), POINTER_FINGER_FILE);

    return {
      fingerAuthorityObservedCount: authorityObservedCount,
      fingerApiReadyCount: apiReadyCount,
      fingerExpressionPacketCount: expressionPacketCount,
      fingerReceiptPacketCount: receiptPacketCount,
      fingerTrackReadyCount: trackReadyCount,
      fingerHardFailCount: hardFailCount,
      anyFingerTrackActive: anyActive,
      allDeclaredFingerTracksReady: allReady,
      firstFingerGap: safeString(firstDefined(
        s.firstFingerGap,
        anyActive ? "WAITING_DECLARED_FINGER_BISHOP_TRACKS" : "WAITING_POINTER_FINGER_BISHOP"
      ), "WAITING_POINTER_FINGER_BISHOP"),
      firstFingerGapFile: safeString(firstDefined(s.firstFingerGapFile, nextFile), nextFile),
      nextFingerKey: nextKey,
      nextFingerFile: nextFile,
      pointerFingerBishopKey: POINTER_FINGER_KEY,
      pointerFingerBishopFile: POINTER_FINGER_FILE,
      pointerFingerObserved
    };
  }

  function normalizeCanvasSummary(inputSummary, method, authority, sourceName) {
    const dom = scanDomForVisibleCanvas();
    const additional = readAdditionalCanvasReceipts();

    let merged = {};
    additional.forEach((receipt) => {
      merged = mergeObjects(merged, receipt);
    });
    merged = mergeObjects(merged, inputSummary || {});

    const contract = firstNonEmpty(
      merged.currentCanvasParentContract,
      merged.canvasLocalStationContract,
      merged.canvasContract,
      merged.contract,
      merged.CONTRACT,
      authority && authority.currentCanvasParentContract,
      authority && authority.canvasLocalStationContract,
      authority && authority.contract,
      authority && authority.CONTRACT,
      datasetValue("hearthCanvasContract"),
      datasetValue("hearthSouthCurrentCanvasParentContract")
    );

    const receipt = firstNonEmpty(
      merged.currentCanvasParentReceipt,
      merged.canvasLocalStationReceipt,
      merged.canvasReceipt,
      merged.receipt,
      merged.RECEIPT,
      authority && authority.receipt,
      authority && authority.RECEIPT,
      datasetValue("hearthCanvasReceipt")
    );

    const localShape = hasLocalStationShape(merged);
    const hubShape = hasExpressionHubShape(merged);
    const globeShape = hasVisibleGlobeShape(merged);

    const acceptedByContract = ACTIVE_CANVAS_CONTRACTS.includes(contract);
    const baselineOnly = CANVAS_BASELINE_CONTRACTS.includes(contract);
    const acceptedByShape = Boolean(noClaimPreserved(merged) && (localShape || hubShape || globeShape || dom.visiblePlanetProofReady));
    const accepted = Boolean((acceptedByContract || acceptedByShape) && !baselineOnly);

    const observed = Boolean(
      authority ||
      contract ||
      Object.keys(merged).length ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasHubActive") === "true" ||
      datasetValue("hearthCanvasExpressionHubActive") === "true" ||
      datasetValue("hearthCanvasVisiblePlanetProofReady") === "true" ||
      dom.visiblePlanetProofReady
    );

    const expressionHubActive = Boolean(accepted && (
      hubShape ||
      safeBool(merged.expressionHubActive, false) ||
      safeBool(merged.canvasExpressionHubActive, false) ||
      datasetValue("hearthCanvasExpressionHubActive") === "true"
    ));

    const fingerManagerActive = Boolean(accepted && (
      safeBool(merged.fingerManagerActive, false) ||
      safeBool(merged.canvasFingerManagerActive, false) ||
      safeBool(merged.fingerRegistryActive, false) ||
      datasetValue("hearthCanvasFingerManagerActive") === "true" ||
      hubShape
    ));

    const visibleBaseGlobeCarrierActive = Boolean(accepted && (
      globeShape ||
      safeBool(merged.visibleBaseGlobeCarrierActive, false) ||
      safeBool(merged.canvasVisibleBaseGlobeCarrierActive, false) ||
      datasetValue("hearthCanvasVisibleBaseGlobeCarrierActive") === "true" ||
      dom.canvasPresent
    ));

    const canvasMounted = Boolean(accepted && (
      safeBool(merged.canvasMounted, false) ||
      safeBool(merged.baseGlobeMounted, false) ||
      datasetValue("hearthCanvasMounted") === "true" ||
      datasetValue("hearthSouthCanvasMounted") === "true" ||
      dom.canvasMounted
    ));

    const canvasDrawComplete = Boolean(accepted && (
      safeBool(merged.canvasDrawComplete, false) ||
      safeBool(merged.drawComplete, false) ||
      safeBool(merged.imageRendered, false) ||
      safeBool(merged.holdingFieldDrawComplete, false) ||
      datasetValue("hearthCanvasDrawComplete") === "true" ||
      datasetValue("hearthCanvasHoldingFieldDrawComplete") === "true" ||
      datasetValue("hearthSouthCanvasDrawComplete") === "true" ||
      dom.canvasDrawComplete
    ));

    const visiblePlanetProofReady = Boolean(accepted && (
      safeBool(merged.visiblePlanetProofReady, false) ||
      safeBool(merged.currentVisibleProofValid, false) ||
      datasetValue("hearthCanvasVisiblePlanetProofReady") === "true" ||
      datasetValue("hearthSouthVisiblePlanetProofReady") === "true" ||
      (canvasMounted && canvasDrawComplete && visibleBaseGlobeCarrierActive) ||
      dom.visiblePlanetProofReady
    ));

    const visiblePlanetProofSource = visiblePlanetProofReady
      ? firstNonEmpty(
        merged.visiblePlanetProofSource,
        datasetValue("hearthCanvasVisiblePlanetProofSource"),
        globeShape ? "CANVAS_RECEIVER_BISHOP_VISIBLE_GLOBE_RECEIPT_SHAPE" : "",
        dom.visiblePlanetProofReady ? "DOM_VISIBLE_CANVAS_NONZERO" : "",
        "CANVAS_RECEIVER_BISHOP_VISIBLE_PROOF"
      )
      : "NONE";

    const releaseAccepted = Boolean(accepted && (
      safeBool(firstDefined(merged.canvasParentReleaseAccepted, merged.parentReleaseAccepted, merged.releasePacketAccepted), false) ||
      datasetValue("hearthCanvasParentReleaseAccepted") === "true" ||
      datasetValue("hearthSouthCanvasParentReleaseAccepted") === "true" ||
      visiblePlanetProofReady
    ));

    const parentReleaseLawful = Boolean(accepted && (
      safeBool(firstDefined(merged.parentReleaseLawful, merged.canvasParentReleaseLawful, merged.releasePacketValid), false) ||
      datasetValue("hearthCanvasParentReleaseLawful") === "true" ||
      releaseAccepted
    ));

    const f13HardFail = Boolean(accepted && (
      safeBool(firstDefined(merged.f13HardFail, merged.canvasF13HardFail), false) ||
      datasetValue("hearthCanvasF13HardFail") === "true"
    ));

    const f13Strict = Boolean(accepted && !f13HardFail && (
      safeBool(firstDefined(merged.f13CanvasEvidenceStrict, merged.f13EvidenceStrict), false) ||
      (visiblePlanetProofReady && releaseAccepted && parentReleaseLawful && safeBool(merged.compositeDrawComplete, false))
    ));

    const f13Degraded = Boolean(accepted && !f13HardFail && !f13Strict && (
      safeBool(firstDefined(merged.f13CanvasEvidenceDegraded, merged.f13EvidenceDegraded), false) ||
      visiblePlanetProofReady ||
      (canvasMounted && canvasDrawComplete)
    ));

    const f13Complete = Boolean(accepted && !f13HardFail && (
      safeBool(firstDefined(merged.f13CanvasEvidenceComplete, merged.f13EvidenceComplete), false) ||
      f13Strict ||
      f13Degraded ||
      visiblePlanetProofReady
    ));

    const fingers = normalizeFingerSummary(merged);

    const apiReady = Boolean(accepted && (
      authority ||
      localShape ||
      hubShape ||
      globeShape ||
      isFunction(authority && authority.boot) ||
      isFunction(authority && authority.init) ||
      isFunction(authority && authority.start) ||
      isFunction(authority && authority.mount) ||
      isFunction(authority && authority.receiveReleasePacket) ||
      isFunction(authority && authority.consumeRouteConductorReleasePacket)
    ));

    const bootMethodAvailable = Boolean(apiReady && (
      isFunction(authority && authority.boot) ||
      isFunction(authority && authority.init) ||
      isFunction(authority && authority.start) ||
      isFunction(authority && authority.mount) ||
      isFunction(authority && authority.receiveReleasePacket) ||
      isFunction(authority && authority.receiveRouteConductorReleasePacket) ||
      isFunction(authority && authority.consumeRouteConductorReleasePacket) ||
      localShape ||
      hubShape ||
      globeShape
    ));

    state.canvasObserved = observed;
    state.canvasAuthoritySource = sourceName || "NONE";
    state.canvasContract = contract || "";
    state.canvasReceipt = receipt || "";
    state.canvasV123Recognized = contract === CURRENT_CANVAS_CONTRACT;

    return {
      authority,
      sourceName,
      method,
      raw: clonePlain(merged),

      canvasReceiverBishopActive: true,
      canvasReceiverBishopFile: CANVAS_FILE,
      observed,
      summaryObserved: Boolean(Object.keys(merged).length),
      currentCanvasParentObserved: observed,
      currentCanvasParentContractObserved: Boolean(contract),
      currentCanvasParentContract: contract,
      currentCanvasParentReceipt: receipt,

      canvasV123Recognized: contract === CURRENT_CANVAS_CONTRACT,
      canvasV122Recognized: contract === CANVAS_V12_2_CONTRACT,
      canvasV121LineageAccepted: contract === CANVAS_V12_1_CONTRACT,
      canvasV12LineageAccepted: contract === CANVAS_V12_CONTRACT,
      canvasSummaryAcceptedByContract: acceptedByContract,
      canvasSummaryAcceptedByShape: acceptedByShape && !acceptedByContract,
      canvasSummaryShapeTrusted: acceptedByShape,
      canvasContractAccepted: accepted,
      canvasBaselineOnly: baselineOnly,

      currentCanvasParentIsLocalStation: Boolean(accepted && (localShape || hubShape || globeShape)),
      currentCanvasParentIsExpressionHub: Boolean(accepted && hubShape),
      currentCanvasParentIsFingerManager: Boolean(accepted && fingerManagerActive),
      currentCanvasParentIsVisibleBaseGlobeCarrier: Boolean(accepted && globeShape),
      canvasLocalStationApiReady: apiReady,
      canvasParentBootMethodAvailable: bootMethodAvailable,

      expressionHubActive,
      canvasExpressionHubActive: expressionHubActive,
      fingerManagerActive,
      canvasFingerManagerActive: fingerManagerActive,
      fingerRegistryActive: Boolean(fingerManagerActive || safeBool(merged.fingerRegistryActive, false)),
      namedFingerFilesEmbedded: true,
      downstreamFingerTracksDeclared: true,

      visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: visibleBaseGlobeCarrierActive,
      canvasMounted,
      canvasDrawComplete,
      baseGlobeDrawComplete: canvasDrawComplete,
      baseGlobeVisibleCarrierReady: Boolean(visibleBaseGlobeCarrierActive && canvasDrawComplete),
      visibleGlobeCarrierReady: Boolean(visibleBaseGlobeCarrierActive && canvasDrawComplete),
      visiblePlanetProofReady,
      visiblePlanetProofSource,
      visiblePlanetProofIngestedByRoute: visiblePlanetProofReady,
      visiblePlanetReceiptObserved: Boolean(globeShape || safeBool(merged.visiblePlanetProofReady, false) || dom.visiblePlanetProofReady),

      canvasParentReleaseAccepted: releaseAccepted,
      canvasParentReleaseObserved: Boolean(releaseAccepted || parentReleaseLawful),
      parentReleaseLawful,
      parentAcceptedRouteConductorRelease: Boolean(releaseAccepted && parentReleaseLawful),
      parentReleasePacketLawful: Boolean(releaseAccepted && parentReleaseLawful),

      ...fingers,

      f13CanvasReadinessObserved: Boolean(accepted && (observed || visiblePlanetProofReady || f13Complete)),
      f13VisibleEvidenceAvailable: Boolean(visiblePlanetProofReady),
      f13InspectEvidenceAvailable: Boolean(fingers.pointerFingerObserved || safeBool(merged.f13InspectEvidenceAvailable, false)),
      f13CanvasEvidenceStrict: f13Strict,
      f13CanvasEvidenceDegraded: f13Degraded,
      f13CanvasEvidenceComplete: f13Complete,
      f13HardFail,
      f13StrictEvidenceGap: !observed
        ? "WAITING_CANVAS_RECEIVER_BISHOP_AUTHORITY_OR_VISIBLE_PROOF"
        : !accepted
          ? "WAITING_CURRENT_CANVAS_V12_3_OR_LAWFUL_VISIBLE_PROOF_SHAPE"
          : !apiReady
            ? "WAITING_CANVAS_RECEIVER_BISHOP_API"
            : !visiblePlanetProofReady
              ? "WAITING_VISIBLE_BASE_GLOBE_PROOF"
              : f13HardFail
                ? "CANVAS_F13_HARD_FAIL"
                : !f13Complete
                  ? "WAITING_CANVAS_F13_EVIDENCE"
                  : !f13Strict
                    ? "VISIBLE_GLOBE_PROOF_INGESTED_STRICT_F13_PENDING"
                    : "NONE_F13_STRICT_EVIDENCE_COMPLETE",
      f13StrictEvidenceRepairTarget: fingers.nextFingerFile || CANVAS_FILE,
      degradedF13IsFunctional: Boolean(f13Degraded && f13Complete && !f13Strict),
      strictVisualProofPending: Boolean(f13Complete && !f13Strict && !f13HardFail),
      functionalPageObserved: Boolean(f13Complete && !f13HardFail)
    };
  }

  function readCanvasReceiverBishopGate(westGate) {
    const found = readCanvasAuthority();
    const read = readCanvasSummaryFromAuthority(found.value);
    const canvas = normalizeCanvasSummary(read.summary || {}, read.method, found.value, found.name);

    state.currentCanvasSummary = clonePlain(canvas);

    if (!westGate.passed) {
      return {
        gate: gate(
          GATE_IDS.CANVAS_RECEIVER_BISHOP,
          false,
          westGate.firstFailedCoordinate,
          westGate.recommendedNextFile,
          canvas
        ),
        canvas
      };
    }

    const passed = Boolean(
      canvas.currentCanvasParentObserved &&
      canvas.canvasContractAccepted &&
      canvas.canvasLocalStationApiReady &&
      canvas.canvasParentBootMethodAvailable
    );

    return {
      gate: gate(
        GATE_IDS.CANVAS_RECEIVER_BISHOP,
        passed,
        !canvas.currentCanvasParentObserved
          ? "WAITING_CANVAS_RECEIVER_BISHOP_AUTHORITY"
          : !canvas.canvasContractAccepted
            ? "WAITING_CURRENT_CANVAS_V12_3_OR_LAWFUL_VISIBLE_PROOF_SHAPE"
            : !canvas.canvasLocalStationApiReady
              ? "WAITING_CANVAS_RECEIVER_BISHOP_API"
              : !canvas.canvasParentBootMethodAvailable
                ? "WAITING_CANVAS_RECEIVER_BISHOP_RELEASE_RECEIVER"
                : "WAITING_CANVAS_RECEIVER_BISHOP_GATE",
        CANVAS_FILE,
        canvas
      ),
      canvas
    };
  }

  function readVisibleGlobeGate(canvasGate, canvas) {
    if (!canvasGate.passed) {
      return gate(
        GATE_IDS.VISIBLE_GLOBE,
        false,
        canvasGate.firstFailedCoordinate,
        canvasGate.recommendedNextFile,
        canvas
      );
    }

    const passed = Boolean(
      canvas.visiblePlanetProofReady &&
      canvas.visiblePlanetProofIngestedByRoute &&
      canvas.visibleBaseGlobeCarrierActive &&
      canvas.baseGlobeDrawComplete &&
      !canvas.f13HardFail
    );

    return gate(
      GATE_IDS.VISIBLE_GLOBE,
      passed,
      canvas.f13HardFail
        ? "CANVAS_F13_HARD_FAIL"
        : !canvas.visibleBaseGlobeCarrierActive
          ? "WAITING_VISIBLE_BASE_GLOBE_CARRIER"
          : !canvas.baseGlobeDrawComplete
            ? "WAITING_BASE_GLOBE_DRAW_COMPLETE"
            : !canvas.visiblePlanetProofReady
              ? "WAITING_VISIBLE_BASE_GLOBE_PROOF"
              : "WAITING_VISIBLE_GLOBE_GATE",
      CANVAS_FILE,
      canvas
    );
  }

  function readFingerBishopsGate(visibleGate, canvas) {
    if (!visibleGate.passed) {
      return gate(
        GATE_IDS.FINGER_BISHOPS,
        false,
        visibleGate.firstFailedCoordinate,
        visibleGate.recommendedNextFile,
        canvas
      );
    }

    const passed = Boolean(
      canvas.allDeclaredFingerTracksReady ||
      canvas.anyFingerTrackActive ||
      canvas.visiblePlanetProofReady
    );

    return gate(
      GATE_IDS.FINGER_BISHOPS,
      passed,
      !canvas.anyFingerTrackActive && !canvas.allDeclaredFingerTracksReady
        ? canvas.firstFingerGap || "WAITING_POINTER_FINGER_BISHOP"
        : "WAITING_FINGER_BISHOPS_GATE",
      canvas.nextFingerFile || POINTER_FINGER_FILE,
      canvas
    );
  }

  function readF13Gate(fingerGate, canvas) {
    if (!fingerGate.passed) {
      return gate(
        GATE_IDS.F13_EVIDENCE,
        false,
        fingerGate.firstFailedCoordinate,
        fingerGate.recommendedNextFile,
        canvas
      );
    }

    const passed = Boolean(canvas.f13CanvasEvidenceComplete && !canvas.f13HardFail);
    const degraded = Boolean(canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict);

    return gate(
      GATE_IDS.F13_EVIDENCE,
      passed,
      canvas.f13HardFail
        ? "CANVAS_F13_HARD_FAIL"
        : !canvas.f13CanvasReadinessObserved
          ? "WAITING_F13_CANVAS_READINESS"
          : !canvas.f13CanvasEvidenceComplete
            ? canvas.f13StrictEvidenceGap || "WAITING_CANVAS_F13_EVIDENCE"
            : degraded
              ? "VISIBLE_GLOBE_PROOF_INGESTED_STRICT_F13_PENDING"
              : "WAITING_F13_EVIDENCE_GATE",
      degraded ? (canvas.f13StrictEvidenceRepairTarget || canvas.nextFingerFile || CANVAS_FILE) : (canvas.nextFingerFile || CANVAS_FILE),
      {
        ...canvas,
        f13DegradedButFunctional: degraded
      }
    );
  }

  function readF21BoundaryGate(f13Gate, canvas) {
    const eligible = Boolean(
      f13Gate.passed &&
      canvas.f13CanvasEvidenceComplete &&
      canvas.visiblePlanetProofReady &&
      !canvas.f13HardFail
    );

    return gate(
      GATE_IDS.F21_NORTH_BOUNDARY,
      eligible,
      !f13Gate.passed
        ? f13Gate.firstFailedCoordinate
        : "F21_HELD_BY_NORTH_ONLY_BOUNDARY",
      eligible ? LAB_NORTH_FILE : f13Gate.recommendedNextFile,
      {
        f21EligibleForNorth: eligible,
        f21NorthOnly: true,
        routeMayPublishEligibilityOnly: true,
        f21ClaimedByRouteConductor: false,
        f21SubmittedToNorth: false,
        completionLatched: false,
        readyTextClaimed: false,
        visualPassClaimed: false
      }
    );
  }

  function readQueenAuthority() {
    return firstGlobal(QUEEN_ALIASES);
  }

  function readQueenSummaryFromAuthority(authority) {
    if (!authority || !isObject(authority)) return { method: "NONE", summary: null };

    const methods = [
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getControlSummary",
      "getControlState",
      "getQueenBridgeState",
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(output)) return { method, summary: output };
      } catch (error) {
        recordError("QUEEN_SUMMARY_METHOD_FAILED", error, { method });
      }
    }

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return { method: "direct-authority-object", summary: authority };
    }

    return { method: "NONE", summary: null };
  }

  function findControlScriptElement() {
    if (!doc) return null;

    const byId = doc.getElementById(CONTROL_SCRIPT_ID);
    if (byId) return byId;

    return scriptByPath(CONTROL_FILE);
  }

  function admitControlScript(reason = "route-conductor-queen-admission") {
    if (!doc) {
      state.controlScriptAdmissionAttempted = true;
      state.controlScriptAdmissionStatus = "CONTROL_SCRIPT_ADMISSION_HELD";
      state.controlScriptAdmissionReason = "DOCUMENT_UNAVAILABLE";
      return {
        attempted: true,
        admitted: false,
        status: state.controlScriptAdmissionStatus,
        reason: state.controlScriptAdmissionReason
      };
    }

    const existingAuthority = readQueenAuthority();
    if (existingAuthority.value) {
      state.controlScriptAdmissionAttempted = true;
      state.controlScriptAdmissionStatus = "QUEEN_AUTHORITY_ALREADY_PRESENT";
      state.controlScriptAdmissionReason = "NO_SCRIPT_INJECTION_REQUIRED";
      state.controlScriptElementFound = Boolean(findControlScriptElement());
      state.controlScriptElementSrc = scriptSrc(CONTROL_FILE) || "";
      state.controlScriptLoadComplete = true;
      updateDataset(state.currentPacket || {});
      return {
        attempted: true,
        admitted: false,
        status: state.controlScriptAdmissionStatus,
        reason: state.controlScriptAdmissionReason
      };
    }

    const existingScript = findControlScriptElement();
    if (existingScript) {
      state.controlScriptAdmissionAttempted = true;
      state.controlScriptAdmissionStatus = existingScript.dataset && existingScript.dataset.hearthRouteConductorControlLoaded === "true"
        ? "QUEEN_SCRIPT_ALREADY_LOADED_WAITING_AUTHORITY"
        : "QUEEN_SCRIPT_ALREADY_PRESENT_WAITING_LOAD";
      state.controlScriptAdmissionReason = "SCRIPT_ELEMENT_ALREADY_PRESENT";
      state.controlScriptElementFound = true;
      state.controlScriptElementSrc = safeString(existingScript.getAttribute("src"), "");
      state.controlScriptInjectedByRouteConductor = existingScript.id === CONTROL_SCRIPT_ID || (existingScript.dataset && existingScript.dataset.admittedBy === CONTRACT);
      updateDataset(state.currentPacket || {});
      return {
        attempted: true,
        admitted: false,
        status: state.controlScriptAdmissionStatus,
        reason: state.controlScriptAdmissionReason
      };
    }

    try {
      const script = doc.createElement("script");
      script.id = CONTROL_SCRIPT_ID;
      script.src = CONTROL_SCRIPT_SRC;
      script.async = false;
      script.defer = true;
      script.dataset.admittedBy = CONTRACT;
      script.dataset.previousAdmittedBy = PREVIOUS_CONTRACT;
      script.dataset.role = "route-conductor-admitted-queen-planetary-controls";
      script.dataset.controlFile = CONTROL_FILE;
      script.dataset.controlContract = EXPECTED_CONTROL_CONTRACT;
      script.dataset.routeConductorContract = CONTRACT;
      script.dataset.routeConductorOwnsAdmission = "true";
      script.dataset.htmlLoadsControlFile = "false";
      script.dataset.queenControlBridgeExpected = "true";
      script.dataset.f13Claimed = "false";
      script.dataset.f21Claimed = "false";
      script.dataset.readyTextClaimed = "false";
      script.dataset.controlReadyClaimed = "false";
      script.dataset.motionReadyClaimed = "false";
      script.dataset.touchReadyClaimed = "false";
      script.dataset.dragReadyClaimed = "false";
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      script.addEventListener("load", () => {
        state.controlScriptLoadComplete = true;
        state.controlScriptLoadError = "";
        state.controlScriptAdmissionStatus = "QUEEN_SCRIPT_LOAD_COMPLETE_WAITING_AUTHORITY";
        state.controlScriptAdmissionReason = "SCRIPT_LOAD_EVENT";
        if (script.dataset) script.dataset.hearthRouteConductorControlLoaded = "true";
        record("QUEEN_CONTROL_SCRIPT_LOAD_COMPLETE_BY_ROUTE_CONDUCTOR_V9_9", {
          src: CONTROL_SCRIPT_SRC,
          reason
        });
        refresh({ allowDelivery: true });
        scheduleAdmissionWatchdog();
      }, { once: true });

      script.addEventListener("error", () => {
        state.controlScriptLoadComplete = false;
        state.controlScriptLoadError = "QUEEN_CONTROL_SCRIPT_LOAD_ERROR";
        state.controlScriptAdmissionStatus = "QUEEN_CONTROL_SCRIPT_LOAD_ERROR";
        state.controlScriptAdmissionReason = "SCRIPT_ERROR_EVENT";
        recordError("QUEEN_CONTROL_SCRIPT_LOAD_ERROR_BY_ROUTE_CONDUCTOR_V9_9", "QUEEN_CONTROL_SCRIPT_LOAD_ERROR", {
          src: CONTROL_SCRIPT_SRC,
          reason
        });
        updateDataset(state.currentPacket || {});
        publishGlobals("queen-control-script-load-error-v9-9", true);
      }, { once: true });

      const parent = doc.head || doc.documentElement || doc.body;
      parent.appendChild(script);

      state.controlScriptAdmissionAttempted = true;
      state.controlScriptAdmissionStatus = "QUEEN_CONTROL_SCRIPT_ADMITTED_BY_ROUTE_CONDUCTOR";
      state.controlScriptAdmissionReason = reason;
      state.controlScriptElementFound = true;
      state.controlScriptElementSrc = CONTROL_SCRIPT_SRC;
      state.controlScriptInjectedByRouteConductor = true;

      record("QUEEN_CONTROL_SCRIPT_ADMITTED_BY_ROUTE_CONDUCTOR_V9_9", {
        src: CONTROL_SCRIPT_SRC,
        reason
      });

      updateDataset(state.currentPacket || {});

      return {
        attempted: true,
        admitted: true,
        status: state.controlScriptAdmissionStatus,
        reason: state.controlScriptAdmissionReason
      };
    } catch (error) {
      state.controlScriptAdmissionAttempted = true;
      state.controlScriptAdmissionStatus = "QUEEN_CONTROL_SCRIPT_ADMISSION_FAILED";
      state.controlScriptAdmissionReason = error && error.message ? String(error.message) : String(error);
      state.controlScriptLoadError = state.controlScriptAdmissionReason;

      recordError("QUEEN_CONTROL_SCRIPT_ADMISSION_FAILED_BY_ROUTE_CONDUCTOR_V9_9", error, {
        src: CONTROL_SCRIPT_SRC,
        reason
      });

      updateDataset(state.currentPacket || {});

      return {
        attempted: true,
        admitted: false,
        status: state.controlScriptAdmissionStatus,
        reason: state.controlScriptAdmissionReason
      };
    }
  }

  function normalizeQueenSummary(inputSummary, method, authority, sourceName) {
    const summary = isObject(inputSummary) ? inputSummary : {};
    const script = findControlScriptElement();
    const scriptPresent = Boolean(script);
    const scriptSource = script ? safeString(script.getAttribute("src"), "") : "";

    const contract = firstNonEmpty(
      summary.controlContract,
      summary.controlsContract,
      summary.contract,
      summary.CONTRACT,
      authority && authority.controlContract,
      authority && authority.contract,
      authority && authority.CONTRACT,
      datasetValue("hearthControlContract"),
      datasetValue("hearthControlsContract"),
      datasetValue("hearthPlanetaryControlContract"),
      datasetValue("hearthControlFileContract")
    );

    const receipt = firstNonEmpty(
      summary.controlReceipt,
      summary.controlsReceipt,
      summary.receipt,
      summary.RECEIPT,
      authority && authority.controlReceipt,
      authority && authority.receipt,
      authority && authority.RECEIPT,
      datasetValue("hearthControlReceipt"),
      datasetValue("hearthControlsReceipt"),
      datasetValue("hearthPlanetaryControlReceipt"),
      datasetValue("hearthControlFileReceipt")
    );

    const observed = Boolean(
      authority ||
      contract ||
      receipt ||
      scriptPresent ||
      datasetValue("hearthControlsLoaded") === "true" ||
      datasetValue("hearthControlFilePresent") === "true"
    );

    const contractAccepted = Boolean(contract && contract === EXPECTED_CONTROL_CONTRACT);

    const receiverApiReady = Boolean(authority && (
      isFunction(authority.consumeRouteConductorControlHandshake) ||
      isFunction(authority.receiveRouteConductorControlHandshake) ||
      isFunction(authority.consumeControlHandshake) ||
      isFunction(authority.receiveControlHandshake) ||
      isFunction(authority.receiveControlHandshakePacket) ||
      isFunction(authority.acceptControlHandshakePacket)
    ));

    const bootApiReady = Boolean(authority && (
      isFunction(authority.boot) ||
      isFunction(authority.init) ||
      isFunction(authority.start) ||
      isFunction(authority.run)
    ));

    const filePresent = Boolean(observed || scriptPresent);
    const authorityPresent = Boolean(authority);
    const admissionAttempted = state.controlScriptAdmissionAttempted === true || scriptPresent || authorityPresent;
    const admissionComplete = Boolean(authorityPresent || (scriptPresent && state.controlScriptLoadComplete));

    const handshakeReady = Boolean(filePresent && authorityPresent && contractAccepted && receiverApiReady);
    const handshakeAcceptedByQueen = Boolean(
      safeBool(firstDefined(summary.handshakeAccepted, summary.controlHandshakeAccepted, summary.routeConductorControlHandshakeAccepted), false) ||
      safeBool(summary.inputAdmissionOpen, false) ||
      safeBool(summary.inputBound, false) ||
      state.controlHandshakeAcceptedByQueen === true ||
      safeString(summary.handshakeStatus).includes("ACCEPTED") ||
      safeString(summary.inputStatus).includes("ADMITTED")
    );

    const queenSuperconductorLanguageObserved = Boolean(
      safeBool(summary.queenControlBridgeActive, false) ||
      safeBool(summary.queenSuperconductorLanguageActive, false) ||
      safeBool(summary.supportsQueenSuperconductorLanguage, false) ||
      sourceName.includes("QUEEN") ||
      sourceName.includes("queen")
    );

    const queenReadsLabWestAsOpaqueSuperconductor = Boolean(
      safeBool(summary.queenReadsLabWestAsOpaqueSuperconductor, false) ||
      safeBool(summary.supportsLabWestBishopChordLanguage, false) ||
      safeString(summary.labWestSuperconductorStatus).includes("LABWEST") ||
      queenSuperconductorLanguageObserved
    );

    const admissionStatus = authorityPresent
      ? "QUEEN_AUTHORITY_PRESENT"
      : scriptPresent
        ? state.controlScriptLoadError
          ? "QUEEN_CONTROL_SCRIPT_LOAD_ERROR"
          : state.controlScriptLoadComplete
            ? "QUEEN_CONTROL_SCRIPT_LOADED_WAITING_AUTHORITY_PUBLICATION"
            : "QUEEN_CONTROL_SCRIPT_PRESENT_WAITING_LOAD"
        : admissionAttempted
          ? "QUEEN_CONTROL_SCRIPT_ADMISSION_ATTEMPTED_WAITING_ELEMENT"
          : "QUEEN_CONTROL_SCRIPT_ADMISSION_REQUIRED";

    const handshakeStatus = handshakeAcceptedByQueen
      ? "QUEEN_HANDSHAKE_ACCEPTED"
      : handshakeReady
        ? "QUEEN_HANDSHAKE_READY_FOR_DELIVERY"
        : !filePresent
          ? "WAITING_ROUTE_CONDUCTOR_QUEEN_ADMISSION"
          : !authorityPresent
            ? "WAITING_QUEEN_AUTHORITY_PUBLICATION"
            : !contractAccepted
              ? "WAITING_EXPECTED_QUEEN_CONTROL_CONTRACT"
              : !receiverApiReady
                ? "WAITING_QUEEN_HANDSHAKE_RECEIVER"
                : "WAITING_QUEEN_HANDSHAKE_DELIVERY";

    const integrationStatus = handshakeAcceptedByQueen
      ? "ROUTE_CONDUCTOR_QUEEN_HANDSHAKE_ACCEPTED"
      : handshakeReady
        ? "ROUTE_CONDUCTOR_QUEEN_HANDSHAKE_READY_FOR_DELIVERY"
        : admissionStatus;

    const blockedStatus = handshakeAcceptedByQueen
      ? "QUEEN_RUNTIME_ADMITTED"
      : handshakeReady
        ? "WAITING_ROUTE_CONDUCTOR_QUEEN_HANDSHAKE_DELIVERY"
        : "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE";

    state.queenObserved = observed;
    state.queenAuthoritySource = sourceName || "NONE";
    state.queenContract = contract || "";
    state.queenReceipt = receipt || "";
    state.queenSuperconductorLanguageObserved = queenSuperconductorLanguageObserved;
    state.queenReadsLabWestAsOpaqueSuperconductor = queenReadsLabWestAsOpaqueSuperconductor;

    return {
      authority,
      sourceName,
      method,
      raw: clonePlain(summary),

      queenControlBridgeActive: queenSuperconductorLanguageObserved,
      queenSuperconductorLanguageActive: queenSuperconductorLanguageObserved,
      queenReadsLabWestAsOpaqueSuperconductor,
      queenAuthorityObserved: observed,
      queenAuthoritySource: sourceName || "NONE",
      queenContract: contract || "",
      queenReceipt: receipt || "",

      planetaryControlLifecycleSchemaActive: true,
      planetaryControlFootprintStatus: filePresent ? "QUEEN_CONTROL_FILE_ADMISSION_TRACK_ACTIVE" : "QUEEN_CONTROL_FILE_ADMISSION_REQUIRED",
      planetaryControlDiagnosticStatus: integrationStatus,
      planetaryControlGateStatus: handshakeAcceptedByQueen ? "QUEEN_GATE_ACCEPTED" : handshakeReady ? "QUEEN_GATE_READY_FOR_HANDSHAKE" : "QUEEN_GATE_WAITING_ADMISSION",

      expectedControlFile: CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlReceipt: EXPECTED_CONTROL_RECEIPT,
      controlFile: CONTROL_FILE,
      controlFilePresent: filePresent,
      controlFileSrc: scriptSource || "NOT_FOUND",
      controlFileContract: contract || "",
      controlFileReceipt: receipt || "",
      controlFileAuthoritySource: sourceName || "NONE",

      controlFileExpectedNotYetBuilt: false,
      controlFileAbsenceExpected: false,
      controlFileAbsenceNotTreatedAsCase5: true,
      controlFileAbsenceBlocksMotionTouchNotVisiblePlanet: true,

      controlScriptAdmissionRequired: true,
      controlScriptAdmissionAttempted: admissionAttempted,
      controlScriptAdmissionComplete: admissionComplete,
      controlScriptAdmissionStatus: admissionStatus,
      controlScriptAdmissionReason: state.controlScriptAdmissionReason,
      controlScriptElementFound: scriptPresent,
      controlScriptElementSrc: scriptSource || "",
      controlScriptInjectedByRouteConductor: state.controlScriptInjectedByRouteConductor === true,
      controlScriptLoadComplete: state.controlScriptLoadComplete === true,
      controlScriptLoadError: state.controlScriptLoadError,

      routeConductorOwnsControlFileAdmission: true,
      htmlLoadsControlFile: false,
      controlDirectLoadSuppressedByHtml: true,

      controlHandshakeRequired: true,
      controlHandshakeReady: handshakeReady,
      controlHandshakeSatisfied: handshakeAcceptedByQueen,
      controlHandshakeAcceptedByControl: handshakeAcceptedByQueen,
      controlHandshakeAcceptedByQueen: handshakeAcceptedByQueen,
      controlHandshakeStatus: handshakeStatus,
      controlHandshakeTarget: CONTROL_FILE,
      controlHandshakeFunnelOwner: "route-conductor-north-bishop",
      controlHandshakeReceiverObserved: authorityPresent,
      controlHandshakeReceiverApiReady: receiverApiReady,
      controlBootApiReady: bootApiReady,

      jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,
      jsIndexFile: INDEX_FILE,
      jsIndexContract: EXPECTED_INDEX_CONTRACT,
      jsRouteConductorFile: FILE,
      jsRouteConductorContract: CONTRACT,
      jsControlFile: CONTROL_FILE,
      jsControlContract: EXPECTED_CONTROL_CONTRACT,
      jsCanvasFile: CANVAS_FILE,

      routeConductorControlIntegrationStatus: integrationStatus,
      routeConductorControlHandshakeRequired: true,
      routeConductorControlHandshakeTarget: CONTROL_FILE,
      routeConductorControlFunnelOwner: "route-conductor-north-bishop",

      planetaryViewControlStatus: handshakeAcceptedByQueen ? "PLANETARY_VIEW_CONTROL_HANDSHAKE_ACCEPTED" : blockedStatus,
      planetaryViewTouchStatus: handshakeAcceptedByQueen ? "TOUCH_CONTROL_HANDSHAKE_ACCEPTED_WAITING_RUNTIME_INPUT" : blockedStatus,
      planetaryViewDragStatus: handshakeAcceptedByQueen ? "DRAG_CONTROL_HANDSHAKE_ACCEPTED_WAITING_RUNTIME_INPUT" : blockedStatus,
      planetaryViewMotionStatus: handshakeAcceptedByQueen ? "MOTION_CONTROL_HANDSHAKE_ACCEPTED_WAITING_RUNTIME_INPUT" : blockedStatus,
      planetaryViewZoomStatus: handshakeAcceptedByQueen ? "ZOOM_CONTROL_HANDSHAKE_ACCEPTED_WAITING_RUNTIME_INPUT" : blockedStatus,
      planetaryViewInputStatus: handshakeAcceptedByQueen ? "PLANETARY_VIEW_INPUT_HANDSHAKE_ACCEPTED" : blockedStatus,

      planetaryFilesTrackStatus: "VISIBLE_PLANET_FILES_TRACKED_BY_CANVAS_AND_FINGER_BISHOPS",
      planetaryFingersTrackStatus: "CANVAS_FINGER_BISHOP_TRACK_PRESERVED",
      planetaryCanvasTrackStatus: "CANVAS_RECEIVER_BISHOP_TRACK_PRESERVED",
      planetaryViewTrackStatus: handshakeAcceptedByQueen ? "PLANETARY_VIEW_CONTROL_TRACK_HANDSHAKE_ACCEPTED" : "PLANETARY_VIEW_CONTROL_TRACK_WAITING_ROUTE_CONDUCTOR_ADMISSION",

      planetaryControlRecommendedNextFile: handshakeAcceptedByQueen ? "NONE" : !authorityPresent ? CONTROL_FILE : FILE,
      planetaryControlRecommendedNextAction: handshakeAcceptedByQueen
        ? "OBSERVE_QUEEN_RUNTIME_TOUCH_DRAG_MOTION_WITHOUT_CLAIMING_FINAL_VISUAL_PASS"
        : !authorityPresent
          ? "ROUTE_CONDUCTOR_MUST_ADMIT_QUEEN_CONTROL_FILE_AND_WAIT_FOR_AUTHORITY"
          : "ROUTE_CONDUCTOR_MUST_DELIVER_QUEEN_HANDSHAKE",

      controlsInspectBishopInternals: false,
      controlsInspectSubjectFiles: false,
      controlsInspectChildFiles: false,
      controlsInspectFingerFiles: false,
      controlDoesNotBlockVisiblePlanet: true,
      controlDoesNotAuthorizeCanvasDrawing: true,
      controlDoesNotClaimMotionReadiness: true,
      controlDoesNotClaimTouchReadiness: true,
      controlDoesNotClaimDragReadiness: true
    };
  }

  function readQueenAdmissionGate() {
    const found = readQueenAuthority();
    const read = readQueenSummaryFromAuthority(found.value);
    const queen = normalizeQueenSummary(read.summary || {}, read.method, found.value, found.name);

    state.currentQueenSummary = clonePlain(queen);

    return {
      gate: gate(
        GATE_IDS.QUEEN_ADMISSION,
        queen.controlFilePresent && queen.controlHandshakeReceiverObserved,
        queen.controlHandshakeReceiverObserved
          ? "WAITING_QUEEN_ADMISSION_GATE"
          : queen.controlScriptAdmissionStatus || "WAITING_QUEEN_ADMISSION",
        CONTROL_FILE,
        queen
      ),
      queen
    };
  }

  function readQueenHandshakeGate(queen) {
    const qn = queen || (state.currentQueenSummary || {});

    return gate(
      GATE_IDS.QUEEN_HANDSHAKE,
      qn.controlHandshakeSatisfied === true,
      qn.controlHandshakeSatisfied
        ? "WAITING_QUEEN_HANDSHAKE_GATE"
        : qn.controlHandshakeStatus || "WAITING_QUEEN_HANDSHAKE_DELIVERY",
      qn.controlHandshakeSatisfied ? "NONE" : (qn.controlHandshakeReceiverObserved ? FILE : CONTROL_FILE),
      qn
    );
  }

  function composeGateBoard() {
    const htmlGate = scanHtmlGate();
    const indexGate = readIndexPriestGate();
    const routeGate = readRouteNorthBishopGate();
    const westGate = readLabWestCardinalBishop(indexGate, routeGate);
    const canvasResult = readCanvasReceiverBishopGate(westGate);
    const canvasGate = canvasResult.gate;
    const canvas = canvasResult.canvas;
    const visibleGate = readVisibleGlobeGate(canvasGate, canvas);
    const fingerGate = readFingerBishopsGate(visibleGate, canvas);
    const f13Gate = readF13Gate(fingerGate, canvas);
    const f21Gate = readF21BoundaryGate(f13Gate, canvas);
    const queenAdmissionResult = readQueenAdmissionGate();
    const queenAdmissionGate = queenAdmissionResult.gate;
    const queen = queenAdmissionResult.queen;
    const queenHandshakeGate = readQueenHandshakeGate(queen);

    const gates = [
      htmlGate,
      indexGate,
      routeGate,
      westGate,
      canvasGate,
      visibleGate,
      fingerGate,
      f13Gate,
      f21Gate,
      queenAdmissionGate,
      queenHandshakeGate
    ];

    let firstFailed = null;
    let satisfied = 0;

    for (const item of gates) {
      if (item.passed && !firstFailed) {
        satisfied += 1;
        continue;
      }

      if (!item.passed && !firstFailed) firstFailed = item;
    }

    return {
      gates,
      canvas,
      queen,
      chronologicalGateCount: gates.length,
      chronologicalGatesSatisfied: satisfied,
      chronologicalFirstFailedGate: firstFailed ? firstFailed.id : "NONE",
      chronologicalFirstFailedCoordinate: firstFailed ? firstFailed.firstFailedCoordinate : "NONE_CHRONOLOGY_COMPLETE",
      recommendedNextFile: firstFailed ? firstFailed.recommendedNextFile : LAB_NORTH_FILE,
      composedAt: nowIso()
    };
  }

  function composeFibonacciAudit(board) {
    const gates = {};
    (board.gates || []).forEach((item) => {
      gates[item.id] = item;
    });

    const f1 = Boolean(gates[GATE_IDS.HTML_SHELL] && gates[GATE_IDS.HTML_SHELL].passed);
    const f2 = Boolean(f1 && gates[GATE_IDS.HTML_SHELL].evidence && gates[GATE_IDS.HTML_SHELL].evidence.visibleMountReady);
    const f3 = Boolean(f1 && gates[GATE_IDS.HTML_SHELL].evidence && gates[GATE_IDS.HTML_SHELL].evidence.contextActive);
    const f5 = Boolean(gates[GATE_IDS.INDEX_PRIEST] && gates[GATE_IDS.INDEX_PRIEST].passed);
    const f8 = Boolean(gates[GATE_IDS.ROUTE_NORTH_BISHOP] && gates[GATE_IDS.ROUTE_NORTH_BISHOP].passed);
    const f13 = Boolean(gates[GATE_IDS.F13_EVIDENCE] && gates[GATE_IDS.F13_EVIDENCE].passed);
    const f21 = Boolean(gates[GATE_IDS.F21_NORTH_BOUNDARY] && gates[GATE_IDS.F21_NORTH_BOUNDARY].passed);

    const ladder = [
      { key: "F1", label: "HTML shell exists and route context is stable", passed: f1, file: HTML_FILE },
      { key: "F2", label: "Visible receiver mount exists", passed: f2, file: HTML_FILE },
      { key: "F3", label: "Planet Factory context active", passed: f3, file: HTML_FILE },
      { key: "F5", label: "Index priest loaded and handed off", passed: f5, file: INDEX_FILE },
      { key: "F8", label: "Route North Bishop self-duty active", passed: f8, file: FILE },
      { key: "F13", label: "Canvas and finger bishop evidence observed", passed: f13, file: board.recommendedNextFile || CANVAS_FILE },
      { key: "F21", label: "North-only latch boundary eligible or held", passed: f21, file: LAB_NORTH_FILE }
    ];

    const satisfied = ladder.filter((item) => item.passed).length;
    const score = Math.round((satisfied / ladder.length) * 100);
    const firstFailed = ladder.find((item) => !item.passed);

    const canvas = board.canvas || {};
    const hardFail = Boolean(canvas.f13HardFail);
    const passed = Boolean(satisfied === ladder.length && !hardFail);
    const degraded = Boolean(!passed && canvas.visiblePlanetProofReady && canvas.f13CanvasEvidenceComplete && !hardFail);

    return {
      fibonacciLadder: ladder,
      controlFileAdmissionOutsideFibonacciLatch: true,
      controlHandshakeOutsideFibonacciLatch: true,
      queenHandshakeOutsideFibonacciLatch: true,
      controlExtensionLabel: "Queen admission and Queen handshake are post-F21 movement-extension duties, not final readiness latches.",
      fibonacciSynchronizationScore: score,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationSatisfied: score,
      fibonacciSynchronizationPassed: passed,
      fibonacciSynchronizationDegraded: degraded,
      fibonacciSynchronizationHardFail: hardFail,
      fibonacciSynchronizationHoldReason: passed
        ? "NONE_FIBONACCI_SYNCHRONIZATION_STRICT_PASS"
        : hardFail
          ? "CANVAS_F13_HARD_FAIL"
          : firstFailed
            ? `WAITING_${firstFailed.key}`
            : board.chronologicalFirstFailedCoordinate
    };
  }

  function composeNewsAudit(board) {
    const byId = {};
    (board.gates || []).forEach((item) => {
      byId[item.id] = item;
    });

    const cycleOne = {
      route: NEWS_CYCLES.CYCLE_1,
      north: true,
      east: Boolean(byId[GATE_IDS.INDEX_PRIEST] && byId[GATE_IDS.INDEX_PRIEST].passed),
      west: Boolean(byId[GATE_IDS.CARDINAL_WEST_BISHOP] && byId[GATE_IDS.CARDINAL_WEST_BISHOP].passed),
      south: Boolean(byId[GATE_IDS.VISIBLE_GLOBE] && byId[GATE_IDS.VISIBLE_GLOBE].passed),
      returnNorth: Boolean(byId[GATE_IDS.F13_EVIDENCE] && byId[GATE_IDS.F13_EVIDENCE].passed)
    };

    cycleOne.passed = Boolean(cycleOne.north && cycleOne.east && cycleOne.west && cycleOne.south && cycleOne.returnNorth);

    const cycleTwo = {
      route: NEWS_CYCLES.CYCLE_2,
      north: true,
      east: Boolean(byId[GATE_IDS.INDEX_PRIEST] && byId[GATE_IDS.INDEX_PRIEST].passed),
      south: Boolean(byId[GATE_IDS.VISIBLE_GLOBE] && byId[GATE_IDS.VISIBLE_GLOBE].passed),
      west: Boolean(byId[GATE_IDS.CARDINAL_WEST_BISHOP] && byId[GATE_IDS.CARDINAL_WEST_BISHOP].passed),
      canvas: Boolean(byId[GATE_IDS.CANVAS_RECEIVER_BISHOP] && byId[GATE_IDS.CANVAS_RECEIVER_BISHOP].passed)
    };

    cycleTwo.passed = Boolean(cycleTwo.north && cycleTwo.east && cycleTwo.south && cycleTwo.west && cycleTwo.canvas);

    const controlExtension = {
      route: NEWS_CYCLES.CONTROL_EXTENSION,
      indexPriest: Boolean(byId[GATE_IDS.INDEX_PRIEST] && byId[GATE_IDS.INDEX_PRIEST].passed),
      routeNorthBishop: Boolean(byId[GATE_IDS.ROUTE_NORTH_BISHOP] && byId[GATE_IDS.ROUTE_NORTH_BISHOP].passed),
      queenAdmission: Boolean(byId[GATE_IDS.QUEEN_ADMISSION] && byId[GATE_IDS.QUEEN_ADMISSION].passed),
      queenHandshake: Boolean(byId[GATE_IDS.QUEEN_HANDSHAKE] && byId[GATE_IDS.QUEEN_HANDSHAKE].passed),
      canvasReceiverBishop: Boolean(byId[GATE_IDS.CANVAS_RECEIVER_BISHOP] && byId[GATE_IDS.CANVAS_RECEIVER_BISHOP].passed),
      visibleGlobeNotBlockedByQueen: Boolean(board.canvas && board.canvas.visiblePlanetProofReady)
    };

    controlExtension.passed = Boolean(
      controlExtension.indexPriest &&
      controlExtension.routeNorthBishop &&
      controlExtension.queenAdmission &&
      controlExtension.queenHandshake &&
      controlExtension.canvasReceiverBishop
    );

    return {
      newsAlignmentActive: true,
      hierarchyVersion: HIERARCHY_VERSION,
      northRole: "checkpoint-validation-north-only-latch-boundary",
      eastRole: "ignition-intake-index-priest",
      westRole: "cardinal-west-bishop-admissibility-release-permission",
      southRole: "output-visible-proof-route-publication",
      routeNorthBishopRole: "route-conductor-recognition-admission-handshake-funnel",
      queenRole: "view-input-control-authority",
      canvasReceiverBishopRole: "receiver-output-carrier",
      pointerFingerBishopRole: "inspect-pointer-finger-track",
      cycleOne,
      cycleTwo,
      controlExtension,
      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      newsGatePassedBeforeF21: Boolean(cycleOne.passed && cycleTwo.passed && byId[GATE_IDS.F13_EVIDENCE] && byId[GATE_IDS.F13_EVIDENCE].passed),
      newsGateDegradedBeforeF21: Boolean(cycleTwo.canvas && board.canvas && board.canvas.f13CanvasEvidenceDegraded && !board.canvas.f13CanvasEvidenceStrict),
      queenAdmissionDoesNotBlockVisibleGlobe: true,
      queenHandshakeDoesNotBlockVisibleGlobe: true
    };
  }

  function selectPostgameStatus(board, fibonacci) {
    const canvas = board.canvas || {};
    const queen = board.queen || {};

    if (canvas.f13HardFail) return "CANVAS_F13_HARD_FAIL";
    if (queen.controlHandshakeSatisfied) return "VISIBLE_GLOBE_PROOF_READY_QUEEN_HANDSHAKE_ACCEPTED";
    if (queen.controlHandshakeReady) return "VISIBLE_GLOBE_PROOF_READY_QUEEN_HANDSHAKE_READY_FOR_DELIVERY";
    if (queen.controlHandshakeReceiverObserved) return "QUEEN_CONTROL_FILE_ADMITTED_WAITING_HANDSHAKE_DELIVERY";
    if (queen.controlScriptElementFound) return "QUEEN_CONTROL_SCRIPT_ADMITTED_WAITING_AUTHORITY";
    if (canvas.visiblePlanetProofReady) return "VISIBLE_GLOBE_PROOF_READY_QUEEN_ADMISSION_WAITING";
    if (board.chronologicalFirstFailedGate === "NONE") return "NEWS_FIBONACCI_VISIBLE_GLOBE_QUEEN_HANDSHAKE_READY_FOR_NORTH";
    if (canvas.visiblePlanetProofReady && canvas.f13CanvasEvidenceStrict) return "VISIBLE_GLOBE_PROOF_INGESTED_STRICT_F13_COMPLETE";
    if (canvas.visiblePlanetProofReady && canvas.f13CanvasEvidenceDegraded) return "VISIBLE_GLOBE_PROOF_INGESTED_STRICT_F13_PENDING";
    if (canvas.expressionHubActive || canvas.fingerManagerActive) return "CANVAS_RECEIVER_BISHOP_ACTIVE_WAITING_VISIBLE_GLOBE_PROOF";
    if (fibonacci.fibonacciSynchronizationDegraded) return "FIBONACCI_SYNCHRONIZATION_DEGRADED_VISIBLE_PROOF_PRESENT";
    return board.chronologicalFirstFailedCoordinate || "WAITING_NEWS_FIBONACCI_SYNCHRONIZATION";
  }

  function composeCanvasReleasePacket(board, news, fibonacci) {
    const gates = {};
    board.gates.forEach((item) => {
      gates[item.id] = item;
    });

    const canvas = board.canvas || {};
    const queen = board.queen || {};

    const authorized = Boolean(
      gates[GATE_IDS.INDEX_PRIEST].passed &&
      gates[GATE_IDS.ROUTE_NORTH_BISHOP].passed &&
      gates[GATE_IDS.CARDINAL_WEST_BISHOP].passed &&
      gates[GATE_IDS.CANVAS_RECEIVER_BISHOP].passed &&
      canvas.canvasParentBootMethodAvailable
    );

    const packet = {
      packetType: "ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RELEASE_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV97Contract: LINEAGE_V9_7_CONTRACT,
      lineageV97Receipt: LINEAGE_V9_7_RECEIPT,
      baselineV96Contract: BASELINE_V9_6_CONTRACT,
      baselineV96Receipt: BASELINE_V9_6_RECEIPT,
      lineageV95Contract: LINEAGE_V9_5_CONTRACT,
      lineageV95Receipt: LINEAGE_V9_5_RECEIPT,
      compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
      compatibilityRouteConductorReceipt: COMPAT_V9_4_RECEIPT,

      sourceFile: FILE,
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,

      hierarchyVersion: HIERARCHY_VERSION,
      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      activeFibonacci: "F13",
      sourceCardinal: "WEST",
      handoffTo: authorized ? "CANVAS" : "",

      routeNorthBishopActive: true,
      indexPriestLanguageActive: true,
      queenControlBridgeExpected: true,
      canvasReceiverBishopExpected: true,
      pointerFingerBishopKey: POINTER_FINGER_KEY,
      pointerFingerBishopFile: POINTER_FINGER_FILE,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      queenAdmissionActive: true,
      queenHandshakeDeliveryActive: true,
      queenAdmissionDoesNotBlockVisibleGlobe: true,
      queenHandshakeDoesNotBlockVisibleGlobe: true,
      queenHandshakeStatus: queen.controlHandshakeStatus || "UNKNOWN",

      newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,
      fibonacciSynchronizationScore: fibonacci.fibonacciSynchronizationScore,

      indexPriestGateReady: gates[GATE_IDS.INDEX_PRIEST].passed,
      routeNorthBishopGateReady: gates[GATE_IDS.ROUTE_NORTH_BISHOP].passed,
      cardinalWestBishopGateReady: gates[GATE_IDS.CARDINAL_WEST_BISHOP].passed,
      canvasReceiverBishopGateReady: gates[GATE_IDS.CANVAS_RECEIVER_BISHOP].passed,
      visibleGlobeGateReady: gates[GATE_IDS.VISIBLE_GLOBE].passed,
      fingerBishopsGateReady: gates[GATE_IDS.FINGER_BISHOPS].passed,
      f13EvidenceGateReady: gates[GATE_IDS.F13_EVIDENCE].passed,

      currentCanvasParentContract: canvas.currentCanvasParentContract || "",
      currentCanvasParentReceipt: canvas.currentCanvasParentReceipt || "",
      canvasV123Recognized: canvas.canvasV123Recognized === true,
      canvasContractAccepted: canvas.canvasContractAccepted === true,
      expressionHubActive: canvas.expressionHubActive === true,
      fingerManagerActive: canvas.fingerManagerActive === true,
      visiblePlanetProofReady: canvas.visiblePlanetProofReady === true,

      queenObserved: queen.queenAuthorityObserved === true,
      queenSuperconductorLanguageObserved: queen.queenSuperconductorLanguageActive === true,

      canvasReleaseAuthorized: authorized,
      canvasReleasePacketReady: authorized,
      canvasReleaseHeldReason: authorized ? "NONE_CANVAS_RELEASE_AUTHORIZED" : board.chronologicalFirstFailedCoordinate,
      firstFailedCoordinate: authorized ? "NONE_CANVAS_RELEASE_AUTHORIZED" : board.chronologicalFirstFailedCoordinate,
      recommendedNextFile: authorized ? CANVAS_FILE : board.recommendedNextFile,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.currentCanvasReleasePacket = clonePlain(packet);
    return packet;
  }

  function composeQueenHandshakePacket(board, news, fibonacci) {
    const queen = board.queen || {};
    const canvas = board.canvas || {};

    const packet = {
      packetType: "ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET",
      type: "HEARTH_ROUTE_CONDUCTOR_TO_QUEEN_CONTROLS_HANDSHAKE_PACKET_v2",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,

      sourceFile: FILE,
      sourceRole: "route-conductor-north-bishop",
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      destinationFile: CONTROL_FILE,
      targetFile: CONTROL_FILE,
      handoffTo: "QUEEN_CONTROLS",

      hierarchyVersion: HIERARCHY_VERSION,
      routeNorthBishopActive: true,
      queenControlBridgeExpected: true,
      queenSuperconductorLanguageExpected: true,
      canvasReceiverBishopExpected: true,
      pointerFingerBishopKey: POINTER_FINGER_KEY,
      pointerFingerBishopFile: POINTER_FINGER_FILE,

      expectedControlFile: CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlReceipt: EXPECTED_CONTROL_RECEIPT,

      jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,
      jsIndexFile: INDEX_FILE,
      jsIndexContract: EXPECTED_INDEX_CONTRACT,
      jsRouteConductorFile: FILE,
      jsRouteConductorContract: CONTRACT,
      jsControlFile: CONTROL_FILE,
      jsControlContract: EXPECTED_CONTROL_CONTRACT,
      jsCanvasFile: CANVAS_FILE,

      controlHandshakeRequired: true,
      controlsHandshakeAuthorized: true,
      controlHandshakeAuthorized: true,
      planetaryControlHandshakeAuthorized: true,
      queenHandshakeAuthorized: true,
      queenControlAdmissionAuthorized: true,
      controlAdmissionAuthorized: true,
      controlsAdmissionAuthorized: true,
      planetaryControlAdmissionAuthorized: true,

      controlHandshakeReady: queen.controlHandshakeReady === true,
      controlHandshakeSatisfied: queen.controlHandshakeSatisfied === true,
      controlHandshakeAcceptedByQueen: queen.controlHandshakeAcceptedByQueen === true,
      controlHandshakeAcceptedByControl: queen.controlHandshakeAcceptedByControl === true,
      controlHandshakeStatus: queen.controlHandshakeStatus || "WAITING_ROUTE_CONDUCTOR_QUEEN_ADMISSION",
      controlHandshakeTarget: CONTROL_FILE,
      controlHandshakeFunnelOwner: "route-conductor-north-bishop",
      routeConductorControlIntegrationStatus: queen.routeConductorControlIntegrationStatus || "ROUTE_CONDUCTOR_QUEEN_ADMISSION_ACTIVE",
      routeConductorControlHandshakeRequired: true,
      routeConductorControlHandshakeTarget: CONTROL_FILE,
      routeConductorControlFunnelOwner: "route-conductor-north-bishop",

      controlFilePresent: queen.controlFilePresent === true,
      controlFileExpectedNotYetBuilt: false,
      controlFileAbsenceExpected: false,
      controlFileAbsenceNotTreatedAsCase5: true,
      controlFileAbsenceBlocksMotionTouchNotVisiblePlanet: true,
      controlDoesNotBlockVisiblePlanet: true,

      routeConductorOwnsControlFileAdmission: true,
      htmlLoadsControlFile: false,
      controlDirectLoadSuppressedByHtml: true,
      controlScriptAdmissionRequired: true,
      controlScriptAdmissionAttempted: queen.controlScriptAdmissionAttempted === true,
      controlScriptAdmissionStatus: queen.controlScriptAdmissionStatus || "UNKNOWN",

      visiblePlanetProofReady: canvas.visiblePlanetProofReady === true,
      visiblePlanetProofSource: canvas.visiblePlanetProofSource || "NONE",

      planetaryViewTouchStatus: queen.planetaryViewTouchStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewDragStatus: queen.planetaryViewDragStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewMotionStatus: queen.planetaryViewMotionStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewZoomStatus: queen.planetaryViewZoomStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewInputStatus: queen.planetaryViewInputStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      queenAdmissionOutsideFibonacciLatch: true,
      queenHandshakeOutsideFibonacciLatch: true,
      fibonacciSynchronizationScore: fibonacci.fibonacciSynchronizationScore,
      activeNewsCycle: NEWS_CYCLES.CONTROL_EXTENSION,

      controlsInspectBishopInternals: false,
      controlsInspectSubjectFiles: false,
      controlsInspectChildFiles: false,
      controlsInspectFingerFiles: false,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.currentControlHandshakePacket = clonePlain(packet);
    return packet;
  }

  function deliverReleaseToCanvas(canvas, packet) {
    if (!packet || packet.canvasReleaseAuthorized !== true) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: packet ? packet.canvasReleaseHeldReason : "WAITING_RELEASE_PACKET"
      };
    }

    if (!canvas || !isObject(canvas.authority)) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: "WAITING_CANVAS_RECEIVER_BISHOP_AUTHORITY"
      };
    }

    const signature = packetSignature(packet);

    if (state.lastCanvasReleasePacketSignature === signature && state.canvasReleaseAcceptedByCanvas === true) {
      return {
        delivered: false,
        accepted: true,
        method: state.canvasReleaseDeliveryMethod || "previous-accepted-release",
        reason: "CANVAS_RELEASE_DUPLICATE_DELIVERY_BLOCKED"
      };
    }

    const methods = [
      "consumeRouteConductorReleasePacket",
      "receiveRouteConductorReleasePacket",
      "consumeReleasePacket",
      "receiveReleasePacket",
      "receiveCanvasReleasePacket",
      "receiveCanvasParentPacket",
      "acceptReleasePacket",
      "boot",
      "init",
      "start",
      "mount"
    ];

    for (const method of methods) {
      if (!isFunction(canvas.authority[method])) continue;

      try {
        const result = method === "boot" || method === "init" || method === "start" || method === "mount"
          ? canvas.authority[method]({ routeConductorReleasePacket: clonePlain(packet) })
          : canvas.authority[method](clonePlain(packet));

        const receipt = isObject(result) ? result : readAuthorityReceipt(canvas.authority) || {};
        const accepted = Boolean(
          safeBool(firstDefined(receipt.canvasParentReleaseAccepted, receipt.releasePacketAccepted), false) ||
          safeBool(firstDefined(receipt.parentReleaseLawful, receipt.canvasParentReleaseLawful), false) ||
          safeBool(receipt.visiblePlanetProofReady, false) ||
          safeBool(receipt.baseGlobeVisibleCarrierReady, false) ||
          safeBool(receipt.canvasDrawComplete, false)
        );

        state.lastCanvasReleasePacketSignature = signature;
        state.canvasReleaseDeliveryMethod = method;
        state.canvasReleaseAcceptedByCanvas = accepted;

        record("CANVAS_RELEASE_DELIVERED_BY_ROUTE_CONDUCTOR_V9_9", {
          method,
          accepted,
          currentCanvasParentContract: receipt.currentCanvasParentContract || receipt.contract || "",
          visiblePlanetProofReady: receipt.visiblePlanetProofReady === true
        });

        return {
          delivered: true,
          accepted,
          method,
          reason: accepted ? "CANVAS_ACCEPTED_RELEASE_OR_VISIBLE_PROOF" : "CANVAS_RETURNED_WITHOUT_ACCEPTANCE",
          receipt: clonePlain(receipt)
        };
      } catch (error) {
        recordError("CANVAS_RELEASE_METHOD_FAILED", error, { method });
      }
    }

    return {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: "CANVAS_RELEASE_RECEIVER_MISSING"
    };
  }

  function deliverQueenHandshakeToControl(queen, packet) {
    if (!packet || packet.controlHandshakeRequired !== true) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: "QUEEN_HANDSHAKE_PACKET_NOT_REQUIRED"
      };
    }

    if (!queen || !isObject(queen.authority)) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: "WAITING_QUEEN_AUTHORITY_AFTER_ROUTE_CONDUCTOR_ADMISSION"
      };
    }

    if (queen.controlHandshakeSatisfied === true) {
      return {
        delivered: false,
        accepted: true,
        method: state.controlHandshakeDeliveryMethod || "previous-accepted-queen-handshake",
        reason: "QUEEN_HANDSHAKE_ALREADY_ACCEPTED"
      };
    }

    const signature = packetSignature(packet);

    if (state.lastControlHandshakePacketSignature === signature && state.controlHandshakeAcceptedByQueen === true) {
      return {
        delivered: false,
        accepted: true,
        method: state.controlHandshakeDeliveryMethodLast || "previous-accepted-queen-handshake",
        reason: "QUEEN_HANDSHAKE_DUPLICATE_DELIVERY_BLOCKED"
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
      if (!isFunction(queen.authority[method])) continue;

      try {
        const result = queen.authority[method](clonePlain(packet));
        const receipt = isObject(result) ? result : readAuthorityReceipt(queen.authority) || {};
        const accepted = Boolean(
          safeBool(firstDefined(
            receipt.handshakeAccepted,
            receipt.controlHandshakeAccepted,
            receipt.routeConductorControlHandshakeAccepted,
            receipt.inputAdmissionOpen,
            receipt.inputBound
          ), false) ||
          safeString(receipt.handshakeStatus).includes("ACCEPTED")
        );

        state.lastControlHandshakePacketSignature = signature;
        state.controlHandshakeDeliveryMethodLast = method;
        state.controlHandshakeDeliveryMethod = method;
        state.controlHandshakeAcceptedByQueen = accepted;
        state.controlHandshakeDeliveryStatus = accepted
          ? "QUEEN_HANDSHAKE_ACCEPTED"
          : "QUEEN_HANDSHAKE_DELIVERED_WAITING_ACCEPTANCE";
        state.controlHandshakeDeliveryReason = accepted
          ? "QUEEN_ACCEPTED_ROUTE_CONDUCTOR_HANDSHAKE"
          : "QUEEN_RETURNED_WITHOUT_ACCEPTANCE";

        record("QUEEN_HANDSHAKE_DELIVERED_BY_ROUTE_CONDUCTOR_V9_9", {
          method,
          accepted,
          queenContract: receipt.controlContract || receipt.contract || "",
          handshakeStatus: receipt.handshakeStatus || "",
          inputAdmissionOpen: receipt.inputAdmissionOpen === true
        });

        return {
          delivered: true,
          accepted,
          method,
          reason: state.controlHandshakeDeliveryReason,
          receipt: clonePlain(receipt)
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

  function composePrimaryPacket(options = {}) {
    if (options.allowAdmission !== false) {
      const queenFound = readQueenAuthority();
      if (!queenFound.value) admitControlScript("compose-primary-packet-v9-9");
    }

    const board = composeGateBoard();
    const news = composeNewsAudit(board);
    const fibonacci = composeFibonacciAudit(board);
    const releasePacket = composeCanvasReleasePacket(board, news, fibonacci);
    const queenHandshakePacket = composeQueenHandshakePacket(board, news, fibonacci);

    let canvasDelivery = {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: "DELIVERY_NOT_REQUESTED"
    };

    let queenDelivery = {
      delivered: false,
      accepted: false,
      method: "NONE",
      reason: "DELIVERY_NOT_REQUESTED"
    };

    if (options.allowDelivery === true && releasePacket.canvasReleaseAuthorized) {
      canvasDelivery = deliverReleaseToCanvas(board.canvas, releasePacket);
    }

    if (options.allowDelivery === true) {
      queenDelivery = deliverQueenHandshakeToControl(board.queen, queenHandshakePacket);
    }

    if (queenDelivery.accepted === true) {
      const refreshedFound = readQueenAuthority();
      const refreshedRead = readQueenSummaryFromAuthority(refreshedFound.value);
      board.queen = normalizeQueenSummary(refreshedRead.summary || {}, refreshedRead.method, refreshedFound.value, refreshedFound.name);
    }

    const postgameStatus = selectPostgameStatus(board, fibonacci);

    const gatesById = {};
    board.gates.forEach((item) => {
      gatesById[item.id] = item;
    });

    const canvas = board.canvas || {};
    const queen = board.queen || {};
    const westEvidence = gatesById[GATE_IDS.CARDINAL_WEST_BISHOP] ? gatesById[GATE_IDS.CARDINAL_WEST_BISHOP].evidence || {} : {};
    const f21EligibleForNorth = Boolean(gatesById[GATE_IDS.F21_NORTH_BOUNDARY] && gatesById[GATE_IDS.F21_NORTH_BOUNDARY].passed);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV97Contract: LINEAGE_V9_7_CONTRACT,
      lineageV97Receipt: LINEAGE_V9_7_RECEIPT,
      baselineV96Contract: BASELINE_V9_6_CONTRACT,
      baselineV96Receipt: BASELINE_V9_6_RECEIPT,
      lineageV95Contract: LINEAGE_V9_5_CONTRACT,
      lineageV95Receipt: LINEAGE_V9_5_RECEIPT,
      compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
      compatibilityRouteConductorReceipt: COMPAT_V9_4_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      canvasFile: CANVAS_FILE,
      controlFile: CONTROL_FILE,
      controlScriptSrc: CONTROL_SCRIPT_SRC,
      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedControlFile: CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlReceipt: EXPECTED_CONTROL_RECEIPT,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      hierarchyVersion: HIERARCHY_VERSION,
      role: "route-conductor-north-bishop-queen-canvas-recognition-funnel",

      cardinalBishops: {
        north: LAB_NORTH_FILE,
        east: LAB_EAST_FILE,
        south: LAB_SOUTH_FILE,
        west: LAB_WEST_FILE
      },
      routeNorthBishopFile: FILE,
      indexPriestFile: INDEX_FILE,
      queenFile: CONTROL_FILE,
      canvasReceiverBishopFile: CANVAS_FILE,
      pointerFingerBishopKey: POINTER_FINGER_KEY,
      pointerFingerBishopFile: POINTER_FINGER_FILE,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      controlFileAdmissionActive: true,
      controlHandshakeDeliveryActive: true,
      queenAdmissionActive: true,
      queenHandshakeDeliveryActive: true,
      routeConductorOwnsControlFileAdmission: true,
      routeConductorOwnsControlHandshakeDelivery: true,
      routeNorthBishopActive: true,
      htmlLoadsControlFile: false,
      controlDirectLoadSuppressedByHtml: true,

      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      activeFibonacci: "F8",
      news,
      fibonacci,

      gateBoard: clonePlain(board),
      gates: clonePlain(board.gates),
      chronologicalGateCount: board.chronologicalGateCount,
      chronologicalGatesSatisfied: board.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: board.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: board.chronologicalFirstFailedCoordinate,

      fibonacciSynchronizationScore: fibonacci.fibonacciSynchronizationScore,
      fibonacciSynchronizationExpected: fibonacci.fibonacciSynchronizationExpected,
      fibonacciSynchronizationSatisfied: fibonacci.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationPassed: fibonacci.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: fibonacci.fibonacciSynchronizationDegraded,
      fibonacciSynchronizationHardFail: fibonacci.fibonacciSynchronizationHardFail,
      fibonacciSynchronizationHoldReason: fibonacci.fibonacciSynchronizationHoldReason,

      htmlShellGateReady: gatesById[GATE_IDS.HTML_SHELL].passed,
      indexGateReady: gatesById[GATE_IDS.INDEX_PRIEST].passed,
      indexPriestGateReady: gatesById[GATE_IDS.INDEX_PRIEST].passed,
      routeF8GateReady: gatesById[GATE_IDS.ROUTE_NORTH_BISHOP].passed,
      routeNorthBishopGateReady: gatesById[GATE_IDS.ROUTE_NORTH_BISHOP].passed,
      macroWestGateReady: gatesById[GATE_IDS.CARDINAL_WEST_BISHOP].passed,
      cardinalWestBishopGateReady: gatesById[GATE_IDS.CARDINAL_WEST_BISHOP].passed,
      canvasHubGateReady: gatesById[GATE_IDS.CANVAS_RECEIVER_BISHOP].passed,
      canvasReceiverBishopGateReady: gatesById[GATE_IDS.CANVAS_RECEIVER_BISHOP].passed,
      visibleGlobeGateReady: gatesById[GATE_IDS.VISIBLE_GLOBE].passed,
      fingerTrackGateReady: gatesById[GATE_IDS.FINGER_BISHOPS].passed,
      fingerBishopsGateReady: gatesById[GATE_IDS.FINGER_BISHOPS].passed,
      f13EvidenceGateReady: gatesById[GATE_IDS.F13_EVIDENCE].passed,
      f21BoundaryGateReady: gatesById[GATE_IDS.F21_NORTH_BOUNDARY].passed,
      controlAdmissionGateReady: gatesById[GATE_IDS.QUEEN_ADMISSION].passed,
      queenAdmissionGateReady: gatesById[GATE_IDS.QUEEN_ADMISSION].passed,
      controlHandshakeGateReady: gatesById[GATE_IDS.QUEEN_HANDSHAKE].passed,
      queenHandshakeGateReady: gatesById[GATE_IDS.QUEEN_HANDSHAKE].passed,

      cardinalWestBishopObserved: westEvidence.cardinalWestBishopObserved === true,
      cardinalWestBishopContract: westEvidence.cardinalWestBishopContract || "",
      cardinalWestBishopReceipt: westEvidence.cardinalWestBishopReceipt || "",
      labWestBishopChordLanguageObserved: westEvidence.cardinalWestBishopLanguageObserved === true,
      bishopChordBridgeActive: westEvidence.bishopChordBridgeActive === true,
      bishopSubjectFileDelegationActive: westEvidence.bishopSubjectFileDelegationActive === true,
      westKnowsBishopsNotChildren: westEvidence.westKnowsBishopsNotChildren !== false,
      bishopChordStatus: westEvidence.bishopChordStatus || "UNKNOWN",
      bishopChordAdmissible: westEvidence.bishopChordAdmissible || "UNKNOWN",

      currentCanvasParentObserved: canvas.currentCanvasParentObserved === true,
      currentCanvasParentContractObserved: canvas.currentCanvasParentContractObserved === true,
      currentCanvasParentContract: canvas.currentCanvasParentContract || "",
      currentCanvasParentReceipt: canvas.currentCanvasParentReceipt || "",
      canvasV123Recognized: canvas.canvasV123Recognized === true,
      canvasContractAccepted: canvas.canvasContractAccepted === true,
      canvasSummaryAcceptedByContract: canvas.canvasSummaryAcceptedByContract === true,
      canvasSummaryAcceptedByShape: canvas.canvasSummaryAcceptedByShape === true,
      canvasSummaryShapeTrusted: canvas.canvasSummaryShapeTrusted === true,

      expressionHubActive: canvas.expressionHubActive === true,
      canvasExpressionHubActive: canvas.canvasExpressionHubActive === true,
      fingerManagerActive: canvas.fingerManagerActive === true,
      canvasFingerManagerActive: canvas.canvasFingerManagerActive === true,
      fingerRegistryActive: canvas.fingerRegistryActive === true,
      namedFingerFilesEmbedded: canvas.namedFingerFilesEmbedded === true,
      downstreamFingerTracksDeclared: canvas.downstreamFingerTracksDeclared === true,

      visibleBaseGlobeCarrierActive: canvas.visibleBaseGlobeCarrierActive === true,
      canvasVisibleBaseGlobeCarrierActive: canvas.canvasVisibleBaseGlobeCarrierActive === true,
      canvasMounted: canvas.canvasMounted === true,
      canvasDrawComplete: canvas.canvasDrawComplete === true,
      baseGlobeDrawComplete: canvas.baseGlobeDrawComplete === true,
      baseGlobeVisibleCarrierReady: canvas.baseGlobeVisibleCarrierReady === true,
      visibleGlobeCarrierReady: canvas.visibleGlobeCarrierReady === true,
      visiblePlanetProofReady: canvas.visiblePlanetProofReady === true,
      visiblePlanetProofSource: canvas.visiblePlanetProofSource || "NONE",
      visiblePlanetProofIngestedByRoute: canvas.visiblePlanetProofIngestedByRoute === true,
      visiblePlanetReceiptObserved: canvas.visiblePlanetReceiptObserved === true,

      fingerAuthorityObservedCount: canvas.fingerAuthorityObservedCount || 0,
      fingerApiReadyCount: canvas.fingerApiReadyCount || 0,
      fingerExpressionPacketCount: canvas.fingerExpressionPacketCount || 0,
      fingerReceiptPacketCount: canvas.fingerReceiptPacketCount || 0,
      fingerTrackReadyCount: canvas.fingerTrackReadyCount || 0,
      fingerHardFailCount: canvas.fingerHardFailCount || 0,
      anyFingerTrackActive: canvas.anyFingerTrackActive === true,
      allDeclaredFingerTracksReady: canvas.allDeclaredFingerTracksReady === true,
      firstFingerGap: canvas.firstFingerGap || "",
      firstFingerGapFile: canvas.firstFingerGapFile || "",
      nextFingerKey: canvas.nextFingerKey || "",
      nextFingerFile: canvas.nextFingerFile || "",
      pointerFingerObserved: canvas.pointerFingerObserved === true,

      f13CanvasReadinessObserved: canvas.f13CanvasReadinessObserved === true,
      f13VisibleEvidenceAvailable: canvas.f13VisibleEvidenceAvailable === true,
      f13InspectEvidenceAvailable: canvas.f13InspectEvidenceAvailable === true,
      f13CanvasEvidenceStrict: canvas.f13CanvasEvidenceStrict === true,
      f13CanvasEvidenceDegraded: canvas.f13CanvasEvidenceDegraded === true,
      f13CanvasEvidenceComplete: canvas.f13CanvasEvidenceComplete === true,
      f13HardFail: canvas.f13HardFail === true,
      f13StrictEvidenceGap: canvas.f13StrictEvidenceGap || "",
      f13StrictEvidenceRepairTarget: canvas.f13StrictEvidenceRepairTarget || "",

      queenControlBridgeActive: queen.queenControlBridgeActive === true,
      queenSuperconductorLanguageActive: queen.queenSuperconductorLanguageActive === true,
      queenReadsLabWestAsOpaqueSuperconductor: queen.queenReadsLabWestAsOpaqueSuperconductor === true,
      queenAuthorityObserved: queen.queenAuthorityObserved === true,
      queenAuthoritySource: queen.queenAuthoritySource || "NONE",
      queenContract: queen.queenContract || "",
      queenReceipt: queen.queenReceipt || "",

      planetaryControlLifecycleSchemaActive: queen.planetaryControlLifecycleSchemaActive === true,
      planetaryControlFootprintStatus: queen.planetaryControlFootprintStatus || "UNKNOWN",
      planetaryControlDiagnosticStatus: queen.planetaryControlDiagnosticStatus || "UNKNOWN",
      planetaryControlGateStatus: queen.planetaryControlGateStatus || "UNKNOWN",

      controlFile: CONTROL_FILE,
      controlFilePresent: queen.controlFilePresent === true,
      controlFileSrc: queen.controlFileSrc || "NOT_FOUND",
      controlFileContract: queen.controlFileContract || "",
      controlFileReceipt: queen.controlFileReceipt || "",
      controlFileAuthoritySource: queen.controlFileAuthoritySource || "NONE",
      controlFileExpectedNotYetBuilt: false,
      controlFileAbsenceExpected: false,
      controlFileAbsenceNotTreatedAsCase5: true,
      controlFileAbsenceBlocksMotionTouchNotVisiblePlanet: true,

      controlScriptAdmissionRequired: true,
      controlScriptAdmissionAttempted: queen.controlScriptAdmissionAttempted === true,
      controlScriptAdmissionStatus: queen.controlScriptAdmissionStatus || state.controlScriptAdmissionStatus,
      controlScriptAdmissionReason: queen.controlScriptAdmissionReason || state.controlScriptAdmissionReason,
      controlScriptElementFound: queen.controlScriptElementFound === true,
      controlScriptElementSrc: queen.controlScriptElementSrc || "",
      controlScriptInjectedByRouteConductor: queen.controlScriptInjectedByRouteConductor === true,
      controlScriptLoadComplete: queen.controlScriptLoadComplete === true,
      controlScriptLoadError: queen.controlScriptLoadError || "",

      controlHandshakeRequired: true,
      controlHandshakeReady: queen.controlHandshakeReady === true,
      controlHandshakeSatisfied: queen.controlHandshakeSatisfied === true,
      controlHandshakeAcceptedByControl: Boolean(queen.controlHandshakeAcceptedByControl === true || queenDelivery.accepted === true),
      controlHandshakeAcceptedByQueen: Boolean(queen.controlHandshakeAcceptedByQueen === true || queenDelivery.accepted === true),
      controlHandshakeStatus: queen.controlHandshakeStatus || "WAITING_ROUTE_CONDUCTOR_QUEEN_ADMISSION",
      controlHandshakeTarget: CONTROL_FILE,
      controlHandshakeFunnelOwner: "route-conductor-north-bishop",
      controlHandshakeReceiverObserved: queen.controlHandshakeReceiverObserved === true,
      controlHandshakeReceiverApiReady: queen.controlHandshakeReceiverApiReady === true,
      controlBootApiReady: queen.controlBootApiReady === true,

      jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,
      jsIndexFile: INDEX_FILE,
      jsIndexContract: EXPECTED_INDEX_CONTRACT,
      jsRouteConductorFile: FILE,
      jsRouteConductorContract: CONTRACT,
      jsControlFile: CONTROL_FILE,
      jsControlContract: EXPECTED_CONTROL_CONTRACT,
      jsCanvasFile: CANVAS_FILE,

      routeConductorControlIntegrationStatus: queen.routeConductorControlIntegrationStatus || "ROUTE_CONDUCTOR_QUEEN_ADMISSION_ACTIVE",
      routeConductorControlHandshakeRequired: true,
      routeConductorControlHandshakeTarget: CONTROL_FILE,
      routeConductorControlFunnelOwner: "route-conductor-north-bishop",

      planetaryViewControlStatus: queen.planetaryViewControlStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewTouchStatus: queen.planetaryViewTouchStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewDragStatus: queen.planetaryViewDragStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewMotionStatus: queen.planetaryViewMotionStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewZoomStatus: queen.planetaryViewZoomStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",
      planetaryViewInputStatus: queen.planetaryViewInputStatus || "BLOCKED_BY_QUEEN_ADMISSION_OR_HANDSHAKE_INCOMPLETE",

      planetaryFilesTrackStatus: queen.planetaryFilesTrackStatus || "VISIBLE_PLANET_FILES_TRACKED_BY_CANVAS_AND_FINGER_BISHOPS",
      planetaryFingersTrackStatus: queen.planetaryFingersTrackStatus || "CANVAS_FINGER_BISHOP_TRACK_PRESERVED",
      planetaryCanvasTrackStatus: queen.planetaryCanvasTrackStatus || "CANVAS_RECEIVER_BISHOP_TRACK_PRESERVED",
      planetaryViewTrackStatus: queen.planetaryViewTrackStatus || "PLANETARY_VIEW_CONTROL_TRACK_WAITING_ROUTE_CONDUCTOR_ADMISSION",
      planetaryControlRecommendedNextFile: queen.planetaryControlRecommendedNextFile || CONTROL_FILE,
      planetaryControlRecommendedNextAction: queen.planetaryControlRecommendedNextAction || "ROUTE_CONDUCTOR_MUST_ADMIT_QUEEN_CONTROL_FILE_AND_DELIVER_HANDSHAKE",

      canvasReleasePacket: clonePlain(releasePacket),
      canvasReleaseAuthorized: releasePacket.canvasReleaseAuthorized === true,
      canvasReleasePacketReady: releasePacket.canvasReleasePacketReady === true,
      canvasReleaseHeldReason: releasePacket.canvasReleaseHeldReason,
      canvasReleasePacketDelivered: canvasDelivery.delivered === true,
      canvasReleaseAcceptedByCanvas: canvasDelivery.accepted === true,
      canvasReleaseDeliveryMethod: canvasDelivery.method,
      canvasReleaseDeliveryReason: canvasDelivery.reason,

      controlHandshakePacket: clonePlain(queenHandshakePacket),
      controlHandshakePacketReady: true,
      controlHandshakePacketDelivered: queenDelivery.delivered === true,
      controlHandshakeDeliveryMethod: queenDelivery.method,
      controlHandshakeDeliveryReason: queenDelivery.reason,
      controlHandshakeDeliveryStatus: queenDelivery.accepted
        ? "QUEEN_HANDSHAKE_ACCEPTED"
        : queenDelivery.delivered
          ? "QUEEN_HANDSHAKE_DELIVERED_WAITING_ACCEPTANCE"
          : queenDelivery.reason,

      f21EligibleForNorth,
      f21EligibilityPosture: f21EligibleForNorth ? "ELIGIBLE_FOR_NORTH_REVIEW_ONLY" : "HELD_BEFORE_NORTH",
      f21NorthOnly: true,
      routeMayPublishF21EligibilityOnly: true,

      staleReceiptPublicationBlocked: true,
      latestReceiptAlwaysRepublished: true,

      firstFailedCoordinate: board.chronologicalFirstFailedCoordinate,
      recommendedNextFile: board.recommendedNextFile,
      recommendedNextRenewalTarget: board.recommendedNextFile,
      postgameStatus,

      activeRouteConductorContracts: ACTIVE_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      activeCanvasContracts: ACTIVE_CANVAS_CONTRACTS.slice(),
      recognizedCanvasBaselineContracts: CANVAS_BASELINE_CONTRACTS.slice(),
      activeControlContracts: [EXPECTED_CONTROL_CONTRACT],
      fingerFiles: clonePlain(FINGER_FILES),
      fingerSequence: FINGER_SEQUENCE.slice(),

      composedAt: nowIso(),
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function updateStateFromPacket(packet) {
    state.currentPacket = clonePlain(packet);
    state.currentReceipt = composeReceipt(packet);
    state.currentReceiptText = composeReceiptText(state.currentReceipt);

    state.chronologicalGateCount = packet.chronologicalGateCount;
    state.chronologicalGatesSatisfied = packet.chronologicalGatesSatisfied;
    state.chronologicalFirstFailedGate = packet.chronologicalFirstFailedGate;
    state.chronologicalFirstFailedCoordinate = packet.chronologicalFirstFailedCoordinate;

    state.fibonacciSynchronizationScore = packet.fibonacciSynchronizationScore;
    state.fibonacciSynchronizationExpected = packet.fibonacciSynchronizationExpected;
    state.fibonacciSynchronizationSatisfied = packet.fibonacciSynchronizationSatisfied;
    state.fibonacciSynchronizationPassed = packet.fibonacciSynchronizationPassed;
    state.fibonacciSynchronizationDegraded = packet.fibonacciSynchronizationDegraded;
    state.fibonacciSynchronizationHardFail = packet.fibonacciSynchronizationHardFail;
    state.fibonacciSynchronizationHoldReason = packet.fibonacciSynchronizationHoldReason;

    state.controlScriptAdmissionStatus = packet.controlScriptAdmissionStatus;
    state.controlScriptAdmissionReason = packet.controlScriptAdmissionReason;
    state.controlScriptElementFound = packet.controlScriptElementFound;
    state.controlScriptElementSrc = packet.controlScriptElementSrc;
    state.controlScriptInjectedByRouteConductor = packet.controlScriptInjectedByRouteConductor;
    state.controlScriptLoadComplete = packet.controlScriptLoadComplete;
    state.controlScriptLoadError = packet.controlScriptLoadError;

    state.controlHandshakeRequired = packet.controlHandshakeRequired;
    state.controlHandshakeStatus = packet.controlHandshakeStatus;
    state.controlHandshakeDeliveryStatus = packet.controlHandshakeDeliveryStatus;
    state.controlHandshakeDeliveryMethod = packet.controlHandshakeDeliveryMethod;
    state.controlHandshakeDeliveryReason = packet.controlHandshakeDeliveryReason;
    state.controlHandshakeAcceptedByQueen = packet.controlHandshakeAcceptedByQueen === true;

    state.firstFailedCoordinate = packet.firstFailedCoordinate;
    state.recommendedNextFile = packet.recommendedNextFile;
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
      allowDelivery: options.allowDelivery !== false
    });

    updateStateFromPacket(packet);
    publishGlobals("refresh-v9-9-bishop-queen-canvas-recognition", false);
    scheduleRender();
    return getReceiptLight(false);
  }

  function observePassive() {
    const packet = composePrimaryPacket({ allowAdmission: true, allowDelivery: true });
    updateStateFromPacket(packet);

    record("ROUTE_CONDUCTOR_V9_9_PASSIVE_BISHOP_QUEEN_CANVAS_OBSERVATION", {
      chronologicalFirstFailedGate: packet.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: packet.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationScore: packet.fibonacciSynchronizationScore,
      controlScriptAdmissionStatus: packet.controlScriptAdmissionStatus,
      controlHandshakeStatus: packet.controlHandshakeStatus,
      controlHandshakeAcceptedByQueen: packet.controlHandshakeAcceptedByQueen,
      recommendedNextFile: packet.recommendedNextFile,
      postgameStatus: packet.postgameStatus
    });

    publishGlobals("passive-v9-9-bishop-queen-canvas-recognition", false);
    scheduleRender();
    return getReceiptLight(false);
  }

  function receiveCanvasSummary(summary, methodName) {
    const normalized = normalizeCanvasSummary(summary || {}, methodName || "receiveCanvasSummary", null, "PUSHED_CANVAS_RECEIVER_BISHOP_SUMMARY");
    state.currentCanvasSummary = clonePlain(normalized);

    record("CANVAS_RECEIVER_BISHOP_SUMMARY_RECEIVED_BY_ROUTE_CONDUCTOR_V9_9", {
      methodName,
      currentCanvasParentContract: normalized.currentCanvasParentContract,
      canvasV123Recognized: normalized.canvasV123Recognized,
      canvasContractAccepted: normalized.canvasContractAccepted,
      expressionHubActive: normalized.expressionHubActive,
      fingerManagerActive: normalized.fingerManagerActive,
      visiblePlanetProofReady: normalized.visiblePlanetProofReady,
      f13StrictEvidenceGap: normalized.f13StrictEvidenceGap
    });

    return refresh({ allowAdmission: true, allowDelivery: true });
  }

  function receiveQueenSummary(summary, methodName) {
    const normalized = normalizeQueenSummary(summary || {}, methodName || "receiveQueenSummary", null, "PUSHED_QUEEN_SUMMARY");
    state.currentQueenSummary = clonePlain(normalized);

    record("QUEEN_SUMMARY_RECEIVED_BY_ROUTE_CONDUCTOR_V9_9", {
      methodName,
      queenContract: normalized.queenContract,
      queenSuperconductorLanguageActive: normalized.queenSuperconductorLanguageActive,
      controlHandshakeReady: normalized.controlHandshakeReady,
      controlHandshakeSatisfied: normalized.controlHandshakeSatisfied,
      controlHandshakeStatus: normalized.controlHandshakeStatus,
      routeConductorControlIntegrationStatus: normalized.routeConductorControlIntegrationStatus
    });

    return refresh({ allowAdmission: true, allowDelivery: true });
  }

  function receiveCanvasStationSummary(summary) { return receiveCanvasSummary(summary, "receiveCanvasStationSummary"); }
  function receiveCanvasLocalStationSummary(summary) { return receiveCanvasSummary(summary, "receiveCanvasLocalStationSummary"); }
  function receiveCanvasParentSummary(summary) { return receiveCanvasSummary(summary, "receiveCanvasParentSummary"); }
  function receiveCanvasExpressionHubSummary(summary) { return receiveCanvasSummary(summary, "receiveCanvasExpressionHubSummary"); }
  function receiveExpressionHubSummary(summary) { return receiveCanvasSummary(summary, "receiveExpressionHubSummary"); }
  function receiveVisibleBaseGlobeReceipt(summary) { return receiveCanvasSummary(summary, "receiveVisibleBaseGlobeReceipt"); }
  function receiveVisibleGlobeReceipt(summary) { return receiveCanvasSummary(summary, "receiveVisibleGlobeReceipt"); }
  function receiveVisiblePlanetReceipt(summary) { return receiveCanvasSummary(summary, "receiveVisiblePlanetReceipt"); }
  function receiveCanvasVisibleProof(summary) { return receiveCanvasSummary(summary, "receiveCanvasVisibleProof"); }

  function receiveControlSummary(summary) { return receiveQueenSummary(summary, "receiveControlSummary"); }
  function receiveControlReceipt(summary) { return receiveQueenSummary(summary, "receiveControlReceipt"); }
  function receiveControlHandshakeReceipt(summary) { return receiveQueenSummary(summary, "receiveControlHandshakeReceipt"); }
  function receivePlanetaryViewControlReceipt(summary) { return receiveQueenSummary(summary, "receivePlanetaryViewControlReceipt"); }
  function receiveQueenReceipt(summary) { return receiveQueenSummary(summary, "receiveQueenReceipt"); }
  function receiveQueenBridgeState(summary) { return receiveQueenSummary(summary, "receiveQueenBridgeState"); }

  function reconcileCanvas(summary) { return receiveCanvasSummary(summary, "reconcileCanvas"); }
  function reconcileControl(summary) { return receiveQueenSummary(summary, "reconcileControl"); }
  function reconcileQueen(summary) { return receiveQueenSummary(summary, "reconcileQueen"); }

  function composeReceipt(packet) {
    const p = isObject(packet) ? packet : composePrimaryPacket({ allowAdmission: false, allowDelivery: false });

    return {
      ...clonePlain(p),
      authority: "hearth-route-conductor-bishop-queen-canvas-recognition-funnel",
      receiptComposed: true,
      currentReceipt: true,
      noFinalClaimsPreserved: true,
      bishopQueenCanvasRecognitionReceipt: true,
      queenAdmissionReceipt: true,
      queenHandshakeDeliveryReceipt: true,
      staleReceiptPublicationBlocked: true,
      latestReceiptAlwaysRepublished: true,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composeCompatibilityReceiptV94() {
    const p = state.currentPacket || composePrimaryPacket({ allowAdmission: false, allowDelivery: false });
    const releasePacket = p.canvasReleasePacket || state.currentCanvasReleasePacket || null;

    const compat = {
      contract: COMPAT_V9_4_CONTRACT,
      receipt: COMPAT_V9_4_RECEIPT,
      compatibilityReceipt: true,
      compatibilitySurfaceForCanvasParentsExpectingV9_4: true,
      supersededByContract: CONTRACT,
      supersededByReceipt: RECEIPT,
      previousV98Contract: PREVIOUS_CONTRACT,
      previousV98Receipt: PREVIOUS_RECEIPT,
      previousV97Contract: LINEAGE_V9_7_CONTRACT,
      previousV97Receipt: LINEAGE_V9_7_RECEIPT,
      previousV96Contract: BASELINE_V9_6_CONTRACT,
      previousV96Receipt: BASELINE_V9_6_RECEIPT,
      previousV95Contract: LINEAGE_V9_5_CONTRACT,
      previousV95Receipt: LINEAGE_V9_5_RECEIPT,

      routeConductorContract: COMPAT_V9_4_CONTRACT,
      routeConductorReceipt: COMPAT_V9_4_RECEIPT,
      currentRouteConductorContract: CONTRACT,
      currentRouteConductorReceipt: RECEIPT,

      hierarchyVersion: HIERARCHY_VERSION,
      routeNorthBishopActive: true,
      queenControlBridgeExpected: true,
      canvasReceiverBishopExpected: true,

      canvasReleasePacket: clonePlain(releasePacket),
      releasePacket: clonePlain(releasePacket),
      routeConductorReleasePacket: clonePlain(releasePacket),

      canvasReleaseAuthorized: p.canvasReleaseAuthorized === true,
      canvasReleasePacketReady: p.canvasReleasePacketReady === true,
      indexPairReady: p.indexGateReady === true,
      carrierHostAdmissibilityReady: p.indexGateReady === true,
      westCanvasReleaseApproved: p.macroWestGateReady === true,
      handoffTo: p.canvasReleaseAuthorized === true ? "CANVAS" : "",
      destinationFile: CANVAS_FILE,

      controlFileAdmissionActive: true,
      controlHandshakeDeliveryActive: true,
      controlHandshakeStatus: p.controlHandshakeStatus,
      controlFile: CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      controlDoesNotBlockVisiblePlanet: true,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      visiblePlanetProofReady: p.visiblePlanetProofReady === true,
      visiblePlanetProofSource: p.visiblePlanetProofSource || "NONE",
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };

    state.currentCompatibilityReceipt = clonePlain(compat);
    return compat;
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh || !state.currentPacket) {
      const packet = composePrimaryPacket({ allowAdmission: false, allowDelivery: false });
      updateStateFromPacket(packet);
    }

    return {
      ...clonePlain(state.currentPacket),
      currentReceiptLight: true,
      admitControlScriptAvailable: true,
      receiveCanvasStationSummaryAvailable: true,
      receiveCanvasLocalStationSummaryAvailable: true,
      receiveCanvasParentSummaryAvailable: true,
      receiveCanvasExpressionHubSummaryAvailable: true,
      receiveExpressionHubSummaryAvailable: true,
      receiveVisibleBaseGlobeReceiptAvailable: true,
      receiveVisibleGlobeReceiptAvailable: true,
      receiveVisiblePlanetReceiptAvailable: true,
      receiveCanvasVisibleProofAvailable: true,
      receiveQueenSummaryAvailable: true,
      receiveQueenReceiptAvailable: true,
      receiveQueenBridgeStateAvailable: true,
      receiveControlSummaryAvailable: true,
      receiveControlReceiptAvailable: true,
      receiveControlHandshakeReceiptAvailable: true,
      receivePlanetaryViewControlReceiptAvailable: true,
      reconcileCanvasAvailable: true,
      reconcileQueenAvailable: true,
      reconcileControlAvailable: true,
      compatibilityReceiptV94Available: true,
      renderCount: state.renderCount,
      watchdogTicks: state.watchdogTicks,
      admissionTicks: state.admissionTicks,
      receiptPublishCount: state.receiptPublishCount,
      booted: state.booted,
      booting: state.booting,
      latestEvent: state.latestEvent,
      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      updatedAt: state.updatedAt || nowIso(),
      ...NO_CLAIMS
    };
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
        cardinalBishopNorth: LAB_NORTH_FILE,
        cardinalBishopEast: LAB_EAST_FILE,
        cardinalBishopSouth: LAB_SOUTH_FILE,
        cardinalBishopWest: LAB_WEST_FILE,
        canvasReceiverBishop: CANVAS_FILE,
        pointerFingerBishop: POINTER_FINGER_FILE,
        fingers: clonePlain(FINGER_FILES)
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
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT",
      "",
      "HEADER",
      line("contract", r.contract || CONTRACT),
      line("receipt", r.receipt || RECEIPT),
      line("previousContract", r.previousContract || PREVIOUS_CONTRACT),
      line("previousReceipt", r.previousReceipt || PREVIOUS_RECEIPT),
      line("lineageV97Contract", LINEAGE_V9_7_CONTRACT),
      line("lineageV97Receipt", LINEAGE_V9_7_RECEIPT),
      line("baselineV96Contract", BASELINE_V9_6_CONTRACT),
      line("baselineV96Receipt", BASELINE_V9_6_RECEIPT),
      line("lineageV95Contract", LINEAGE_V9_5_CONTRACT),
      line("lineageV95Receipt", LINEAGE_V9_5_RECEIPT),
      line("compatibilityRouteConductorContract", COMPAT_V9_4_CONTRACT),
      line("compatibilityRouteConductorReceipt", COMPAT_V9_4_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      line("diagnosticRoute", DIAGNOSTIC_ROUTE),
      "",
      "HIERARCHY",
      line("hierarchyVersion", HIERARCHY_VERSION),
      line("routeNorthBishopActive", true),
      line("indexPriestFile", INDEX_FILE),
      line("queenFile", CONTROL_FILE),
      line("canvasReceiverBishopFile", CANVAS_FILE),
      line("cardinalBishopNorthFile", LAB_NORTH_FILE),
      line("cardinalBishopEastFile", LAB_EAST_FILE),
      line("cardinalBishopSouthFile", LAB_SOUTH_FILE),
      line("cardinalBishopWestFile", LAB_WEST_FILE),
      line("pointerFingerBishopKey", POINTER_FINGER_KEY),
      line("pointerFingerBishopFile", POINTER_FINGER_FILE),
      "",
      "HTML_ACCEPTANCE",
      line("expectedHtmlContract", EXPECTED_HTML_CONTRACT),
      line("htmlShellGateReady", r.htmlShellGateReady),
      line("htmlLoadsControlFile", false),
      line("controlDirectLoadSuppressedByHtml", true),
      line("routeConductorOwnsControlFileAdmission", true),
      "",
      "NEWS_ALIGNMENT",
      line("newsAlignmentActive", true),
      line("cycleOneRoute", NEWS_CYCLES.CYCLE_1),
      line("cycleOnePassed", r.news && r.news.cycleOne ? r.news.cycleOne.passed : false),
      line("cycleTwoRoute", NEWS_CYCLES.CYCLE_2),
      line("cycleTwoPassed", r.news && r.news.cycleTwo ? r.news.cycleTwo.passed : false),
      line("controlExtensionRoute", NEWS_CYCLES.CONTROL_EXTENSION),
      line("controlExtensionPassed", r.news && r.news.controlExtension ? r.news.controlExtension.passed : false),
      line("activeNewsCycle", r.activeNewsCycle || NEWS_CYCLES.CYCLE_2),
      line("newsGatePassedBeforeF21", r.news ? r.news.newsGatePassedBeforeF21 : false),
      line("newsGateDegradedBeforeF21", r.news ? r.news.newsGateDegradedBeforeF21 : false),
      line("queenAdmissionDoesNotBlockVisibleGlobe", true),
      line("queenHandshakeDoesNotBlockVisibleGlobe", true),
      "",
      "FIBONACCI_SYNCHRONIZATION",
      line("fibonacciSynchronizationActive", true),
      line("activeFibonacci", r.activeFibonacci || "F8"),
      line("queenAdmissionOutsideFibonacciLatch", true),
      line("queenHandshakeOutsideFibonacciLatch", true),
      line("chronologicalGateCount", r.chronologicalGateCount),
      line("chronologicalGatesSatisfied", r.chronologicalGatesSatisfied),
      line("chronologicalFirstFailedGate", r.chronologicalFirstFailedGate),
      line("chronologicalFirstFailedCoordinate", r.chronologicalFirstFailedCoordinate),
      line("fibonacciSynchronizationScore", r.fibonacciSynchronizationScore),
      line("fibonacciSynchronizationExpected", r.fibonacciSynchronizationExpected),
      line("fibonacciSynchronizationSatisfied", r.fibonacciSynchronizationSatisfied),
      line("fibonacciSynchronizationPassed", r.fibonacciSynchronizationPassed),
      line("fibonacciSynchronizationDegraded", r.fibonacciSynchronizationDegraded),
      line("fibonacciSynchronizationHardFail", r.fibonacciSynchronizationHardFail),
      line("fibonacciSynchronizationHoldReason", r.fibonacciSynchronizationHoldReason),
      "",
      "GATES",
      gateLines,
      "",
      "CARDINAL_WEST_BISHOP",
      line("cardinalWestBishopObserved", r.cardinalWestBishopObserved),
      line("cardinalWestBishopContract", r.cardinalWestBishopContract),
      line("labWestBishopChordLanguageObserved", r.labWestBishopChordLanguageObserved),
      line("bishopChordBridgeActive", r.bishopChordBridgeActive),
      line("bishopSubjectFileDelegationActive", r.bishopSubjectFileDelegationActive),
      line("westKnowsBishopsNotChildren", r.westKnowsBishopsNotChildren),
      line("bishopChordStatus", r.bishopChordStatus),
      line("bishopChordAdmissible", r.bishopChordAdmissible),
      "",
      "QUEEN_ADMISSION",
      line("queenControlBridgeActive", r.queenControlBridgeActive),
      line("queenSuperconductorLanguageActive", r.queenSuperconductorLanguageActive),
      line("queenReadsLabWestAsOpaqueSuperconductor", r.queenReadsLabWestAsOpaqueSuperconductor),
      line("queenAuthorityObserved", r.queenAuthorityObserved),
      line("queenAuthoritySource", r.queenAuthoritySource),
      line("queenContract", r.queenContract),
      line("queenReceipt", r.queenReceipt),
      line("controlScriptAdmissionRequired", r.controlScriptAdmissionRequired),
      line("controlScriptAdmissionAttempted", r.controlScriptAdmissionAttempted),
      line("controlScriptAdmissionStatus", r.controlScriptAdmissionStatus),
      line("controlScriptAdmissionReason", r.controlScriptAdmissionReason),
      line("controlScriptElementFound", r.controlScriptElementFound),
      line("controlScriptElementSrc", r.controlScriptElementSrc),
      line("controlScriptInjectedByRouteConductor", r.controlScriptInjectedByRouteConductor),
      line("controlScriptLoadComplete", r.controlScriptLoadComplete),
      line("controlScriptLoadError", r.controlScriptLoadError),
      line("controlFilePresent", r.controlFilePresent),
      line("controlFileSrc", r.controlFileSrc),
      line("controlFileContract", r.controlFileContract),
      line("controlFileReceipt", r.controlFileReceipt),
      line("controlFileAuthoritySource", r.controlFileAuthoritySource),
      line("controlFileExpectedNotYetBuilt", r.controlFileExpectedNotYetBuilt),
      line("controlFileAbsenceExpected", r.controlFileAbsenceExpected),
      line("controlFileAbsenceNotTreatedAsCase5", r.controlFileAbsenceNotTreatedAsCase5),
      line("controlFileAbsenceBlocksMotionTouchNotVisiblePlanet", r.controlFileAbsenceBlocksMotionTouchNotVisiblePlanet),
      "",
      "QUEEN_HANDSHAKE",
      line("planetaryControlLifecycleSchemaActive", r.planetaryControlLifecycleSchemaActive),
      line("planetaryControlFootprintStatus", r.planetaryControlFootprintStatus),
      line("planetaryControlDiagnosticStatus", r.planetaryControlDiagnosticStatus),
      line("planetaryControlGateStatus", r.planetaryControlGateStatus),
      line("expectedControlFile", r.expectedControlFile),
      line("expectedControlContract", r.expectedControlContract),
      line("expectedControlReceipt", r.expectedControlReceipt),
      line("controlHandshakeRequired", r.controlHandshakeRequired),
      line("controlHandshakeReady", r.controlHandshakeReady),
      line("controlHandshakeSatisfied", r.controlHandshakeSatisfied),
      line("controlHandshakeAcceptedByQueen", r.controlHandshakeAcceptedByQueen),
      line("controlHandshakeStatus", r.controlHandshakeStatus),
      line("controlHandshakeTarget", r.controlHandshakeTarget),
      line("controlHandshakeFunnelOwner", r.controlHandshakeFunnelOwner),
      line("controlHandshakeReceiverObserved", r.controlHandshakeReceiverObserved),
      line("controlHandshakeReceiverApiReady", r.controlHandshakeReceiverApiReady),
      line("controlHandshakePacketReady", r.controlHandshakePacketReady),
      line("controlHandshakePacketDelivered", r.controlHandshakePacketDelivered),
      line("controlHandshakeDeliveryStatus", r.controlHandshakeDeliveryStatus),
      line("controlHandshakeDeliveryMethod", r.controlHandshakeDeliveryMethod),
      line("controlHandshakeDeliveryReason", r.controlHandshakeDeliveryReason),
      line("jsIntegrationFunnel", r.jsIntegrationFunnel),
      line("routeConductorControlIntegrationStatus", r.routeConductorControlIntegrationStatus),
      line("planetaryViewControlStatus", r.planetaryViewControlStatus),
      line("planetaryViewTouchStatus", r.planetaryViewTouchStatus),
      line("planetaryViewDragStatus", r.planetaryViewDragStatus),
      line("planetaryViewMotionStatus", r.planetaryViewMotionStatus),
      line("planetaryViewZoomStatus", r.planetaryViewZoomStatus),
      line("planetaryViewInputStatus", r.planetaryViewInputStatus),
      line("planetaryControlRecommendedNextFile", r.planetaryControlRecommendedNextFile),
      line("planetaryControlRecommendedNextAction", r.planetaryControlRecommendedNextAction),
      "",
      "CANVAS_RECEIVER_BISHOP",
      line("currentCanvasParentObserved", r.currentCanvasParentObserved),
      line("currentCanvasParentContractObserved", r.currentCanvasParentContractObserved),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("currentCanvasParentReceipt", r.currentCanvasParentReceipt),
      line("canvasV123Recognized", r.canvasV123Recognized),
      line("canvasContractAccepted", r.canvasContractAccepted),
      line("canvasSummaryAcceptedByContract", r.canvasSummaryAcceptedByContract),
      line("canvasSummaryAcceptedByShape", r.canvasSummaryAcceptedByShape),
      line("canvasSummaryShapeTrusted", r.canvasSummaryShapeTrusted),
      line("expressionHubActive", r.expressionHubActive),
      line("fingerManagerActive", r.fingerManagerActive),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      "",
      "FINGER_BISHOPS",
      line("fingerAuthorityObservedCount", r.fingerAuthorityObservedCount),
      line("fingerApiReadyCount", r.fingerApiReadyCount),
      line("fingerExpressionPacketCount", r.fingerExpressionPacketCount),
      line("fingerReceiptPacketCount", r.fingerReceiptPacketCount),
      line("fingerTrackReadyCount", r.fingerTrackReadyCount),
      line("fingerHardFailCount", r.fingerHardFailCount),
      line("pointerFingerObserved", r.pointerFingerObserved),
      line("firstFingerGap", r.firstFingerGap),
      line("firstFingerGapFile", r.firstFingerGapFile),
      line("nextFingerKey", r.nextFingerKey),
      line("nextFingerFile", r.nextFingerFile),
      "",
      "F13_EVIDENCE",
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget),
      "",
      "F21_NORTH_ONLY_BOUNDARY",
      line("f21EligibleForNorth", r.f21EligibleForNorth),
      line("f21EligibilityPosture", r.f21EligibilityPosture),
      line("f21NorthOnly", true),
      line("routeMayPublishF21EligibilityOnly", true),
      line("f21ClaimedByRouteConductor", false),
      line("f21SubmittedToNorth", false),
      line("completionLatched", false),
      "",
      "RECEIPT_PUBLICATION",
      line("staleReceiptPublicationBlocked", true),
      line("latestReceiptAlwaysRepublished", true),
      line("receiptPublishCount", state.receiptPublishCount),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21ClaimedByRouteConductor", false),
      line("f21SubmittedToNorth", false),
      line("completionLatched", false),
      line("finalCompletionLatched", false),
      line("degradedCompletionLatched", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("controlReadyClaimed", false),
      line("motionReadyClaimed", false),
      line("touchReadyClaimed", false),
      line("dragReadyClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
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
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("hierarchyVersion", HIERARCHY_VERSION),
      line("newsAlignmentActive", r.newsAlignmentActive),
      line("fibonacciSynchronizationActive", r.fibonacciSynchronizationActive),
      line("queenAdmissionActive", r.queenAdmissionActive),
      line("queenHandshakeDeliveryActive", r.queenHandshakeDeliveryActive),
      line("chronologicalFirstFailedGate", r.chronologicalFirstFailedGate),
      line("chronologicalFirstFailedCoordinate", r.chronologicalFirstFailedCoordinate),
      line("fibonacciSynchronizationScore", r.fibonacciSynchronizationScore),
      line("cardinalWestBishopContract", r.cardinalWestBishopContract),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("canvasV123Recognized", r.canvasV123Recognized),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("queenContract", r.queenContract),
      line("controlScriptAdmissionStatus", r.controlScriptAdmissionStatus),
      line("controlFilePresent", r.controlFilePresent),
      line("controlHandshakeStatus", r.controlHandshakeStatus),
      line("controlHandshakeAcceptedByQueen", r.controlHandshakeAcceptedByQueen),
      line("routeConductorControlIntegrationStatus", r.routeConductorControlIntegrationStatus),
      line("planetaryViewTouchStatus", r.planetaryViewTouchStatus),
      line("planetaryViewDragStatus", r.planetaryViewDragStatus),
      line("planetaryViewMotionStatus", r.planetaryViewMotionStatus),
      line("recommendedNextFile", r.recommendedNextFile),
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
    setDataset("hearthRouteConductorPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthRouteConductorPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthRouteConductorLineageV97Contract", LINEAGE_V9_7_CONTRACT);
    setDataset("hearthRouteConductorBaselineV96Contract", BASELINE_V9_6_CONTRACT);
    setDataset("hearthRouteConductorLineageV95Contract", LINEAGE_V9_5_CONTRACT);
    setDataset("hearthRouteConductorCompatibilityContract", COMPAT_V9_4_CONTRACT);
    setDataset("hearthRouteConductorVersion", VERSION);

    setDataset("hearthHierarchyVersion", HIERARCHY_VERSION);
    setDataset("hearthRouteNorthBishopActive", "true");
    setDataset("hearthCardinalBishopLanguageActive", "true");
    setDataset("hearthDownstreamBishopLanguageActive", "true");
    setDataset("hearthQueenControlBridgeExpected", "true");
    setDataset("hearthIndexPriestLanguageActive", "true");
    setDataset("hearthCanvasReceiverBishopExpected", "true");
    setDataset("hearthPointerFingerBishopKey", POINTER_FINGER_KEY);
    setDataset("hearthPointerFingerBishopFile", POINTER_FINGER_FILE);

    setDataset("hearthRouteConductorNewsAlignmentActive", "true");
    setDataset("hearthRouteConductorFibonacciSynchronizationActive", "true");
    setDataset("hearthRouteConductorControlFileAdmissionActive", "true");
    setDataset("hearthRouteConductorControlHandshakeDeliveryActive", "true");
    setDataset("hearthRouteConductorQueenAdmissionActive", "true");
    setDataset("hearthRouteConductorQueenHandshakeDeliveryActive", "true");
    setDataset("hearthRouteConductorOwnsControlFileAdmission", "true");
    setDataset("hearthRouteConductorOwnsControlHandshakeDelivery", "true");
    setDataset("hearthRouteConductorCycleOneRoute", NEWS_CYCLES.CYCLE_1);
    setDataset("hearthRouteConductorCycleTwoRoute", NEWS_CYCLES.CYCLE_2);
    setDataset("hearthRouteConductorControlExtensionRoute", NEWS_CYCLES.CONTROL_EXTENSION);
    setDataset("hearthRouteConductorActiveNewsCycle", NEWS_CYCLES.CYCLE_2);
    setDataset("hearthRouteConductorActiveFibonacci", packet.activeFibonacci || "F8");

    setDataset("hearthSouthHtmlShellGateReady", String(packet.htmlShellGateReady === true));
    setDataset("hearthSouthIndexPairReady", String(packet.indexGateReady === true));
    setDataset("hearthSouthIndexPriestGateReady", String(packet.indexPriestGateReady === true));
    setDataset("hearthSouthCarrierHostAdmissibilityReady", String(packet.indexGateReady === true));
    setDataset("hearthSouthRouteF8GateReady", String(packet.routeF8GateReady === true));
    setDataset("hearthSouthRouteNorthBishopGateReady", String(packet.routeNorthBishopGateReady === true));
    setDataset("hearthSouthMacroWestGateReady", String(packet.macroWestGateReady === true));
    setDataset("hearthSouthCardinalWestBishopGateReady", String(packet.cardinalWestBishopGateReady === true));
    setDataset("hearthSouthCanvasHubGateReady", String(packet.canvasHubGateReady === true));
    setDataset("hearthSouthCanvasReceiverBishopGateReady", String(packet.canvasReceiverBishopGateReady === true));
    setDataset("hearthSouthVisibleGlobeGateReady", String(packet.visibleGlobeGateReady === true));
    setDataset("hearthSouthFingerTrackGateReady", String(packet.fingerTrackGateReady === true));
    setDataset("hearthSouthFingerBishopsGateReady", String(packet.fingerBishopsGateReady === true));
    setDataset("hearthSouthF13CanvasEvidenceComplete", String(packet.f13CanvasEvidenceComplete === true));
    setDataset("hearthSouthF21EligibleForNorth", String(packet.f21EligibleForNorth === true));
    setDataset("hearthSouthControlAdmissionGateReady", String(packet.controlAdmissionGateReady === true));
    setDataset("hearthSouthQueenAdmissionGateReady", String(packet.queenAdmissionGateReady === true));
    setDataset("hearthSouthControlHandshakeGateReady", String(packet.controlHandshakeGateReady === true));
    setDataset("hearthSouthQueenHandshakeGateReady", String(packet.queenHandshakeGateReady === true));

    setDataset("hearthSouthCardinalWestBishopObserved", String(packet.cardinalWestBishopObserved === true));
    setDataset("hearthSouthCardinalWestBishopContract", packet.cardinalWestBishopContract || "");
    setDataset("hearthSouthLabWestBishopChordLanguageObserved", String(packet.labWestBishopChordLanguageObserved === true));
    setDataset("hearthSouthBishopChordBridgeActive", String(packet.bishopChordBridgeActive === true));
    setDataset("hearthSouthBishopSubjectFileDelegationActive", String(packet.bishopSubjectFileDelegationActive === true));
    setDataset("hearthSouthWestKnowsBishopsNotChildren", String(packet.westKnowsBishopsNotChildren !== false));
    setDataset("hearthSouthBishopChordStatus", packet.bishopChordStatus || "");
    setDataset("hearthSouthBishopChordAdmissible", packet.bishopChordAdmissible || "");

    setDataset("hearthSouthCurrentCanvasParentObserved", String(packet.currentCanvasParentObserved === true));
    setDataset("hearthSouthCurrentCanvasParentContractObserved", String(packet.currentCanvasParentContractObserved === true));
    setDataset("hearthSouthCurrentCanvasParentContract", packet.currentCanvasParentContract || "");
    setDataset("hearthSouthCurrentCanvasParentReceipt", packet.currentCanvasParentReceipt || "");
    setDataset("hearthSouthCanvasV123Recognized", String(packet.canvasV123Recognized === true));
    setDataset("hearthSouthCanvasContractAccepted", String(packet.canvasContractAccepted === true));
    setDataset("hearthSouthExpressionHubActive", String(packet.expressionHubActive === true));
    setDataset("hearthSouthFingerManagerActive", String(packet.fingerManagerActive === true));
    setDataset("hearthSouthVisiblePlanetProofReady", String(packet.visiblePlanetProofReady === true));
    setDataset("hearthSouthVisiblePlanetProofSource", packet.visiblePlanetProofSource || "NONE");
    setDataset("hearthSouthF13StrictEvidenceGap", packet.f13StrictEvidenceGap || "");
    setDataset("hearthSouthF13StrictEvidenceRepairTarget", packet.f13StrictEvidenceRepairTarget || "");

    setDataset("hearthSouthPointerFingerObserved", String(packet.pointerFingerObserved === true));
    setDataset("hearthSouthFingerAuthorityObservedCount", String(packet.fingerAuthorityObservedCount || 0));
    setDataset("hearthSouthFingerApiReadyCount", String(packet.fingerApiReadyCount || 0));
    setDataset("hearthSouthFingerExpressionPacketCount", String(packet.fingerExpressionPacketCount || 0));
    setDataset("hearthSouthFingerReceiptPacketCount", String(packet.fingerReceiptPacketCount || 0));
    setDataset("hearthSouthFingerTrackReadyCount", String(packet.fingerTrackReadyCount || 0));
    setDataset("hearthSouthFingerHardFailCount", String(packet.fingerHardFailCount || 0));
    setDataset("hearthSouthFirstFingerGap", packet.firstFingerGap || "");
    setDataset("hearthSouthFirstFingerGapFile", packet.firstFingerGapFile || "");
    setDataset("hearthSouthNextFingerKey", packet.nextFingerKey || "");
    setDataset("hearthSouthNextFingerFile", packet.nextFingerFile || "");

    setDataset("hearthSouthQueenControlBridgeActive", String(packet.queenControlBridgeActive === true));
    setDataset("hearthSouthQueenSuperconductorLanguageActive", String(packet.queenSuperconductorLanguageActive === true));
    setDataset("hearthSouthQueenReadsLabWestAsOpaqueSuperconductor", String(packet.queenReadsLabWestAsOpaqueSuperconductor === true));
    setDataset("hearthSouthQueenAuthorityObserved", String(packet.queenAuthorityObserved === true));
    setDataset("hearthSouthQueenAuthoritySource", packet.queenAuthoritySource || "NONE");
    setDataset("hearthSouthQueenContract", packet.queenContract || "");
    setDataset("hearthSouthQueenReceipt", packet.queenReceipt || "");

    setDataset("hearthSouthPlanetaryControlLifecycleSchemaActive", String(packet.planetaryControlLifecycleSchemaActive === true));
    setDataset("hearthSouthPlanetaryControlFootprintStatus", packet.planetaryControlFootprintStatus || "");
    setDataset("hearthSouthPlanetaryControlDiagnosticStatus", packet.planetaryControlDiagnosticStatus || "");
    setDataset("hearthSouthPlanetaryControlGateStatus", packet.planetaryControlGateStatus || "");
    setDataset("hearthSouthExpectedControlFile", CONTROL_FILE);
    setDataset("hearthSouthExpectedControlContract", EXPECTED_CONTROL_CONTRACT);
    setDataset("hearthSouthExpectedControlReceipt", EXPECTED_CONTROL_RECEIPT);
    setDataset("hearthSouthControlFile", CONTROL_FILE);
    setDataset("hearthSouthControlFilePresent", String(packet.controlFilePresent === true));
    setDataset("hearthSouthControlFileSrc", packet.controlFileSrc || "NOT_FOUND");
    setDataset("hearthSouthControlFileContract", packet.controlFileContract || "");
    setDataset("hearthSouthControlFileReceipt", packet.controlFileReceipt || "");
    setDataset("hearthSouthControlFileAuthoritySource", packet.controlFileAuthoritySource || "NONE");
    setDataset("hearthSouthControlFileExpectedNotYetBuilt", "false");
    setDataset("hearthSouthControlFileAbsenceExpected", "false");
    setDataset("hearthSouthControlFileAbsenceNotTreatedAsCase5", "true");
    setDataset("hearthSouthControlFileAbsenceBlocksMotionTouchNotVisiblePlanet", "true");

    setDataset("hearthSouthControlScriptAdmissionRequired", "true");
    setDataset("hearthSouthControlScriptAdmissionAttempted", String(packet.controlScriptAdmissionAttempted === true));
    setDataset("hearthSouthControlScriptAdmissionStatus", packet.controlScriptAdmissionStatus || state.controlScriptAdmissionStatus || "");
    setDataset("hearthSouthControlScriptAdmissionReason", packet.controlScriptAdmissionReason || state.controlScriptAdmissionReason || "");
    setDataset("hearthSouthControlScriptElementFound", String(packet.controlScriptElementFound === true));
    setDataset("hearthSouthControlScriptElementSrc", packet.controlScriptElementSrc || "");
    setDataset("hearthSouthControlScriptInjectedByRouteConductor", String(packet.controlScriptInjectedByRouteConductor === true));
    setDataset("hearthSouthControlScriptLoadComplete", String(packet.controlScriptLoadComplete === true));
    setDataset("hearthSouthControlScriptLoadError", packet.controlScriptLoadError || "");

    setDataset("hearthSouthControlHandshakeRequired", "true");
    setDataset("hearthSouthControlHandshakeReady", String(packet.controlHandshakeReady === true));
    setDataset("hearthSouthControlHandshakeSatisfied", String(packet.controlHandshakeSatisfied === true));
    setDataset("hearthSouthControlHandshakeAcceptedByControl", String(packet.controlHandshakeAcceptedByControl === true));
    setDataset("hearthSouthControlHandshakeAcceptedByQueen", String(packet.controlHandshakeAcceptedByQueen === true));
    setDataset("hearthSouthControlHandshakeStatus", packet.controlHandshakeStatus || "");
    setDataset("hearthSouthControlHandshakeTarget", CONTROL_FILE);
    setDataset("hearthSouthControlHandshakeFunnelOwner", "route-conductor-north-bishop");
    setDataset("hearthSouthControlHandshakeReceiverObserved", String(packet.controlHandshakeReceiverObserved === true));
    setDataset("hearthSouthControlHandshakeReceiverApiReady", String(packet.controlHandshakeReceiverApiReady === true));

    setDataset("hearthSouthJsIntegrationFunnel", JS_INTEGRATION_FUNNEL);
    setDataset("hearthSouthJsIndexFile", INDEX_FILE);
    setDataset("hearthSouthJsIndexContract", EXPECTED_INDEX_CONTRACT);
    setDataset("hearthSouthJsRouteConductorFile", FILE);
    setDataset("hearthSouthJsRouteConductorContract", CONTRACT);
    setDataset("hearthSouthJsControlFile", CONTROL_FILE);
    setDataset("hearthSouthJsControlContract", EXPECTED_CONTROL_CONTRACT);
    setDataset("hearthSouthJsCanvasFile", CANVAS_FILE);

    setDataset("hearthSouthRouteConductorControlIntegrationStatus", packet.routeConductorControlIntegrationStatus || "");
    setDataset("hearthSouthRouteConductorControlHandshakeRequired", "true");
    setDataset("hearthSouthRouteConductorControlHandshakeTarget", CONTROL_FILE);
    setDataset("hearthSouthRouteConductorControlFunnelOwner", "route-conductor-north-bishop");

    setDataset("hearthSouthPlanetaryViewControlStatus", packet.planetaryViewControlStatus || "");
    setDataset("hearthSouthPlanetaryViewTouchStatus", packet.planetaryViewTouchStatus || "");
    setDataset("hearthSouthPlanetaryViewDragStatus", packet.planetaryViewDragStatus || "");
    setDataset("hearthSouthPlanetaryViewMotionStatus", packet.planetaryViewMotionStatus || "");
    setDataset("hearthSouthPlanetaryViewZoomStatus", packet.planetaryViewZoomStatus || "");
    setDataset("hearthSouthPlanetaryViewInputStatus", packet.planetaryViewInputStatus || "");
    setDataset("hearthSouthPlanetaryFilesTrackStatus", packet.planetaryFilesTrackStatus || "");
    setDataset("hearthSouthPlanetaryFingersTrackStatus", packet.planetaryFingersTrackStatus || "");
    setDataset("hearthSouthPlanetaryCanvasTrackStatus", packet.planetaryCanvasTrackStatus || "");
    setDataset("hearthSouthPlanetaryViewTrackStatus", packet.planetaryViewTrackStatus || "");
    setDataset("hearthSouthPlanetaryControlRecommendedNextFile", packet.planetaryControlRecommendedNextFile || CONTROL_FILE);
    setDataset("hearthSouthPlanetaryControlRecommendedNextAction", packet.planetaryControlRecommendedNextAction || "");

    setDataset("hearthSouthChronologicalGateCount", String(packet.chronologicalGateCount || 0));
    setDataset("hearthSouthChronologicalGatesSatisfied", String(packet.chronologicalGatesSatisfied || 0));
    setDataset("hearthSouthChronologicalFirstFailedGate", packet.chronologicalFirstFailedGate || "");
    setDataset("hearthSouthChronologicalFirstFailedCoordinate", packet.chronologicalFirstFailedCoordinate || "");

    setDataset("hearthSouthFibonacciSynchronizationScore", String(packet.fibonacciSynchronizationScore || 0));
    setDataset("hearthSouthFibonacciSynchronizationExpected", String(packet.fibonacciSynchronizationExpected || 100));
    setDataset("hearthSouthFibonacciSynchronizationSatisfied", String(packet.fibonacciSynchronizationSatisfied || 0));
    setDataset("hearthSouthFibonacciSynchronizationPassed", String(packet.fibonacciSynchronizationPassed === true));
    setDataset("hearthSouthFibonacciSynchronizationDegraded", String(packet.fibonacciSynchronizationDegraded === true));
    setDataset("hearthSouthFibonacciSynchronizationHardFail", String(packet.fibonacciSynchronizationHardFail === true));
    setDataset("hearthSouthFibonacciSynchronizationHoldReason", packet.fibonacciSynchronizationHoldReason || "");

    setDataset("hearthSouthCanvasReleaseAuthorized", String(packet.canvasReleaseAuthorized === true));
    setDataset("hearthSouthCanvasReleasePacketReady", String(packet.canvasReleasePacketReady === true));
    setDataset("hearthSouthCanvasReleaseHeldReason", packet.canvasReleaseHeldReason || "");
    setDataset("hearthSouthCanvasReleasePacketDelivered", String(packet.canvasReleasePacketDelivered === true));
    setDataset("hearthSouthCanvasReleaseAcceptedByCanvas", String(packet.canvasReleaseAcceptedByCanvas === true));
    setDataset("hearthSouthCanvasReleaseDeliveryMethod", packet.canvasReleaseDeliveryMethod || "NONE");

    setDataset("hearthSouthControlHandshakePacketReady", String(packet.controlHandshakePacketReady === true));
    setDataset("hearthSouthControlHandshakePacketDelivered", String(packet.controlHandshakePacketDelivered === true));
    setDataset("hearthSouthControlHandshakeAcceptedByControl", String(packet.controlHandshakeAcceptedByControl === true));
    setDataset("hearthSouthControlHandshakeAcceptedByQueen", String(packet.controlHandshakeAcceptedByQueen === true));
    setDataset("hearthSouthControlHandshakeDeliveryMethod", packet.controlHandshakeDeliveryMethod || "NONE");
    setDataset("hearthSouthControlHandshakeDeliveryReason", packet.controlHandshakeDeliveryReason || "");
    setDataset("hearthSouthControlHandshakeDeliveryStatus", packet.controlHandshakeDeliveryStatus || "");

    setDataset("hearthSouthStaleReceiptPublicationBlocked", "true");
    setDataset("hearthSouthLatestReceiptAlwaysRepublished", "true");
    setDataset("hearthSouthReceiptPublishCount", String(state.receiptPublishCount));

    setDataset("hearthSouthFirstFailedCoordinate", packet.firstFailedCoordinate || "");
    setDataset("hearthSouthRecommendedNextFile", packet.recommendedNextFile || "");
    setDataset("hearthSouthRecommendedNextRenewalTarget", packet.recommendedNextRenewalTarget || "");
    setDataset("hearthSouthPostgameStatus", packet.postgameStatus || "");

    setDataset("hearthSouthF13Claimed", "false");
    setDataset("hearthSouthF21ClaimedByRouteConductor", "false");
    setDataset("hearthSouthF21SubmittedToNorth", "false");
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

  function refreshRefs() {
    if (!doc) return;

    refs.stage = q("[data-hearth-stage-label]");
    refs.heartbeat = q("[data-hearth-heartbeat-text]");
    refs.latest = q("[data-hearth-latest-event]");
    refs.fill = q("[data-hearth-main-progress-fill]");
    refs.percent = q("[data-hearth-main-progress-percent]");
    refs.lanes = q("[data-hearth-lane-list]");
    refs.receiptBox = q("[data-hearth-receipt-box]");
    refs.receiptText = q("[data-hearth-receipt-text]");
    refs.status = doc.getElementById("hearth-route-status") || q("[data-hearth-route-status]");
  }

  function renderLanes() {
    const r = state.currentPacket || {};
    const rows = [
      ["HTML", "HTML shell", r.htmlShellGateReady ? "READY" : "WAITING"],
      ["PRIEST", "Index priest", r.indexPriestGateReady ? "READY" : "WAITING"],
      ["N-BISHOP", "Route North Bishop", r.routeNorthBishopGateReady ? "READY" : "WAITING"],
      ["W-BISHOP", "Cardinal West Bishop", r.cardinalWestBishopGateReady ? "RELEASE" : "WAITING"],
      ["CANVAS", "Canvas receiver bishop", r.canvasReceiverBishopGateReady ? "READY" : r.currentCanvasParentObserved ? "OBSERVED" : "WAITING"],
      ["GLOBE", "Visible globe", r.visibleGlobeGateReady ? "PROOF" : r.visiblePlanetProofReady ? "DEGRADED" : "WAITING"],
      ["FINGER", "Finger bishops", r.fingerBishopsGateReady ? "READY" : r.pointerFingerObserved ? "POINTER" : "WAITING"],
      ["F13", "F13 evidence", r.f13EvidenceGateReady ? "READY" : r.f13CanvasEvidenceDegraded ? "DEGRADED" : "WAITING"],
      ["QUEEN", "Queen admission", r.queenAdmissionGateReady ? "ADMITTED" : r.controlScriptElementFound ? "LOADING" : "WAITING"],
      ["Q-HAND", "Queen handshake", r.controlHandshakeAcceptedByQueen ? "ACCEPTED" : r.controlHandshakeReady ? "DELIVER" : "WAITING"],
      ["NEXT", "Next file", r.recommendedNextFile || FILE]
    ];

    return rows.map(([code, label, status]) => {
      const progress =
        status === "READY" || status === "RELEASE" || status === "PROOF" || status === "ADMITTED" || status === "ACCEPTED" ? 100 :
          status === "DEGRADED" || status === "OBSERVED" || status === "LOADING" || status === "DELIVER" || status === "POINTER" ? 68 :
            status === "WAITING" ? 30 : 50;

      return [
        `<section class="hearth-ledger-lane" data-lane="${code}" data-status="${String(status).replace(/"/g, "")}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title"><strong>${code} · ${label}</strong><span>NEWS + Fibonacci + Bishop/Queen recognition v9.9</span></span>`,
        `<span class="hearth-ledger-lane-status">${status}</span>`,
        `</div>`,
        `<div class="hearth-ledger-lane-track"><span class="hearth-ledger-lane-fill" style="width:${progress}%"></span></div>`,
        `</section>`
      ].join("");
    }).join("");
  }

  function render() {
    if (!doc) return;

    refreshRefs();
    state.renderCount += 1;

    const r = state.currentPacket || getReceiptLight(false);
    const progress = Math.max(0, Math.min(100, safeNumber(r.fibonacciSynchronizationScore, 0)));

    if (refs.stage) refs.stage.textContent = `${NEWS_CYCLES.CYCLE_2} · ${r.activeFibonacci || "F8"} · Bishop/Queen recognition`;
    if (refs.heartbeat) refs.heartbeat.textContent = `${r.postgameStatus || "BISHOP_QUEEN_CANVAS_RECOGNITION_ACTIVE"} · next=${r.recommendedNextFile || FILE}`;
    if (refs.latest) refs.latest.textContent = `latest=${CONTRACT}`;
    if (refs.fill) refs.fill.style.width = `${progress}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(progress)}%`;
    if (refs.lanes) refs.lanes.innerHTML = renderLanes();
    if (refs.status) refs.status.textContent = getStatusText();

    if (refs.receiptBox && refs.receiptText && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }
  }

  function scheduleRender() {
    if (renderTimer || !doc) return;

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
    root.__HEARTH_ROUTE_CONDUCTOR_PREVIOUS_CONTRACT__ = PREVIOUS_CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_SYNCHRONIZATION__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_DELIVERY__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION__ = true;
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
    lab.hearthRouteConductorBishopQueenCanvasRecognitionFunnel = api;
    lab.hearthRouteConductorControlFileAdmissionAndHandshakeDelivery = api;
    lab.hearthRouteConductorControlHandshakeIntegration = api;
    lab.hearthRouteConductorNewsFibonacciVisibleGlobeProofSynchronization = api;
    lab.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestion = api;
    lab.hearthRouteConductorCanvasLocalStationBridgeAlignment = api;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const receiptLight = getReceiptLight(false);
    const compatibility = composeCompatibilityReceiptV94();

    state.receiptPublishCount += 1;

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_NORTH_BISHOP_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT_v9_9 = receiptLight;

    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_RECEIPT_v9_8 = receiptLight;

    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_RECEIPT_v9_7 = receiptLight;

    root.HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_RECEIPT_v9_6 = receiptLight;

    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT = compatibility;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4 = compatibility;

    hearth.routeConductorReceipt = receiptLight;
    hearth.southRouteConductorReceipt = receiptLight;
    hearth.routeConductorPrimaryGateReceipt = receiptLight;
    hearth.routeNorthBishopReceipt = receiptLight;
    hearth.routeConductorBishopQueenCanvasRecognitionFunnelReceipt = receiptLight;
    hearth.routeConductorControlFileAdmissionAndHandshakeDeliveryReceipt = receiptLight;
    hearth.routeConductorControlHandshakeIntegrationReceipt = receiptLight;
    hearth.routeConductorNewsFibonacciVisibleGlobeProofSynchronizationReceipt = receiptLight;
    hearth.routeConductorCanvasExpressionHubVisibleGlobeProofIngestionReceipt = receiptLight;
    hearth.routeConductorCanvasLocalStationBridgeAlignmentReceipt = compatibility;

    lab.hearthRouteConductorReceipt = receiptLight;
    lab.hearthSouthRouteConductorReceipt = receiptLight;
    lab.hearthRouteConductorPrimaryGateReceipt = receiptLight;
    lab.hearthRouteNorthBishopReceipt = receiptLight;
    lab.hearthRouteConductorBishopQueenCanvasRecognitionFunnelReceipt = receiptLight;
    lab.hearthRouteConductorControlFileAdmissionAndHandshakeDeliveryReceipt = receiptLight;
    lab.hearthRouteConductorControlHandshakeIntegrationReceipt = receiptLight;
    lab.hearthRouteConductorNewsFibonacciVisibleGlobeProofSynchronizationReceipt = receiptLight;
    lab.hearthRouteConductorCanvasLocalStationBridgeAlignmentReceipt = compatibility;

    if (state.currentCanvasReleasePacket) {
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      hearth.routeConductorCanvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
      hearth.canvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
      hearth.routeConductorBishopQueenCanvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
    }

    if (state.currentControlHandshakePacket) {
      root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_ROUTE_CONDUCTOR_CONTROLS_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_CONTROLS_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_PLANETARY_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);
      root.HEARTH_QUEEN_CONTROL_HANDSHAKE_PACKET = clonePlain(state.currentControlHandshakePacket);

      hearth.routeConductorControlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
      hearth.controlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
      hearth.controlsHandshakePacket = clonePlain(state.currentControlHandshakePacket);
      hearth.planetaryControlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
      hearth.routeConductorQueenControlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
      hearth.queenControlHandshakePacket = clonePlain(state.currentControlHandshakePacket);
    }

    updateDataset(receiptLight);
  }

  function publishGlobals(reason = "publish-globals-v9-9", force = false) {
    publishApiAliases();
    publishReceiptAliases();

    record(reason, {
      force,
      contract: CONTRACT,
      chronologicalFirstFailedGate: state.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: state.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      controlScriptAdmissionStatus: state.controlScriptAdmissionStatus,
      controlHandshakeStatus: state.controlHandshakeStatus,
      controlHandshakeAcceptedByQueen: state.controlHandshakeAcceptedByQueen,
      recommendedNextFile: state.recommendedNextFile,
      staleReceiptPublicationBlocked: true,
      latestReceiptAlwaysRepublished: true,
      receiptPublishCount: state.receiptPublishCount
    });

    return true;
  }

  function scheduleAdmissionWatchdog() {
    if (!root.setInterval) return;
    if (admissionTimer) return;

    admissionTimer = root.setInterval(() => {
      state.admissionTicks += 1;

      const found = readQueenAuthority();
      if (!found.value) {
        admitControlScript(`admission-watchdog-tick-${state.admissionTicks}`);
      }

      refresh({ allowAdmission: true, allowDelivery: true });

      if (
        state.admissionTicks >= 20 ||
        state.controlHandshakeAcceptedByQueen === true ||
        (state.currentPacket && state.currentPacket.controlHandshakeAcceptedByQueen === true)
      ) {
        root.clearInterval(admissionTimer);
        admissionTimer = 0;

        record("QUEEN_ADMISSION_WATCHDOG_STOPPED_V9_9", {
          admissionTicks: state.admissionTicks,
          controlHandshakeAcceptedByQueen: state.controlHandshakeAcceptedByQueen === true,
          controlScriptAdmissionStatus: state.controlScriptAdmissionStatus
        });
      }
    }, 750);
  }

  function startWatchdog() {
    if (!root.setInterval) return;
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;
      observePassive();

      if (
        state.watchdogTicks >= 18 ||
        (state.currentPacket && state.currentPacket.controlHandshakeAcceptedByQueen === true)
      ) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
        record("WATCHDOG_STOPPED_V9_9", {
          watchdogTicks: state.watchdogTicks,
          controlHandshakeAcceptedByQueen: state.currentPacket && state.currentPacket.controlHandshakeAcceptedByQueen === true,
          f21EligibleForNorth: state.currentPacket && state.currentPacket.f21EligibleForNorth === true
        });
      }
    }, 1800);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_V9_9";

      publishEarlyMarker();
      publishGlobals("boot-early-v9-9-api-publication", true);

      admitControlScript("boot-v9-9-route-conductor-queen-admission-duty");
      refresh({ allowAdmission: true, allowDelivery: true });

      state.booting = false;
      state.booted = true;

      publishGlobals("boot-complete-v9-9-api-publication", true);
      render();
      scheduleAdmissionWatchdog();
      startWatchdog();

      record("HEARTH_ROUTE_CONDUCTOR_V9_9_BOOTED", {
        route: ROUTE,
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
        hierarchyVersion: HIERARCHY_VERSION,
        chronologicalFirstFailedGate: state.chronologicalFirstFailedGate,
        chronologicalFirstFailedCoordinate: state.chronologicalFirstFailedCoordinate,
        fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
        controlScriptAdmissionStatus: state.controlScriptAdmissionStatus,
        controlHandshakeStatus: state.controlHandshakeStatus,
        controlHandshakeAcceptedByQueen: state.controlHandshakeAcceptedByQueen,
        recommendedNextFile: state.recommendedNextFile,
        staleReceiptPublicationBlocked: true,
        latestReceiptAlwaysRepublished: true,
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

    if (admissionTimer) {
      root.clearInterval(admissionTimer);
      admissionTimer = 0;
    }

    if (renderTimer) {
      root.clearTimeout(renderTimer);
      renderTimer = 0;
    }

    record("HEARTH_ROUTE_CONDUCTOR_V9_9_DISPOSED", { reason });
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

  function getHandoffPacket() {
    return getCanvasReleasePacket();
  }

  function getControlHandshakePacket() {
    return clonePlain(state.currentControlHandshakePacket || (state.currentPacket && state.currentPacket.controlHandshakePacket) || null);
  }

  function getControlsHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getPlanetaryControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getRouteConductorControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getQueenControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getControlPacket() {
    return getControlHandshakePacket();
  }

  function getRouteCycleReceipt() {
    const r = getReceiptLight(false);
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_CYCLE_RECEIPT_v9_9",
      cycleOneRoute: NEWS_CYCLES.CYCLE_1,
      cycleTwoRoute: NEWS_CYCLES.CYCLE_2,
      controlExtensionRoute: NEWS_CYCLES.CONTROL_EXTENSION,
      activeNewsCycle: NEWS_CYCLES.CYCLE_2,
      hierarchyVersion: HIERARCHY_VERSION,
      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      queenAdmissionActive: true,
      queenHandshakeDeliveryActive: true,
      chronologicalFirstFailedGate: r.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: r.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationScore: r.fibonacciSynchronizationScore,
      controlScriptAdmissionStatus: r.controlScriptAdmissionStatus,
      controlHandshakeStatus: r.controlHandshakeStatus,
      controlHandshakeAcceptedByQueen: r.controlHandshakeAcceptedByQueen,
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
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV97Contract: LINEAGE_V9_7_CONTRACT,
    lineageV97Receipt: LINEAGE_V9_7_RECEIPT,
    baselineV96Contract: BASELINE_V9_6_CONTRACT,
    baselineV96Receipt: BASELINE_V9_6_RECEIPT,
    lineageV95Contract: LINEAGE_V9_5_CONTRACT,
    lineageV95Receipt: LINEAGE_V9_5_RECEIPT,
    compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
    compatibilityRouteConductorReceipt: COMPAT_V9_4_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    hierarchyVersion: HIERARCHY_VERSION,
    controlFile: CONTROL_FILE,
    controlScriptSrc: CONTROL_SCRIPT_SRC,
    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedControlFile: CONTROL_FILE,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedControlReceipt: EXPECTED_CONTROL_RECEIPT,
    jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,

    cardinalBishopFiles: Object.freeze({
      north: LAB_NORTH_FILE,
      east: LAB_EAST_FILE,
      south: LAB_SOUTH_FILE,
      west: LAB_WEST_FILE
    }),
    routeNorthBishopFile: FILE,
    indexPriestFile: INDEX_FILE,
    queenFile: CONTROL_FILE,
    canvasReceiverBishopFile: CANVAS_FILE,
    pointerFingerBishopKey: POINTER_FINGER_KEY,
    pointerFingerBishopFile: POINTER_FINGER_FILE,

    NEWS_CYCLES,
    GATE_IDS,
    GATE_ORDER,
    ACTIVE_ROUTE_CONDUCTOR_CONTRACTS,
    ACTIVE_CANVAS_CONTRACTS,
    CANVAS_BASELINE_CONTRACTS,
    ACTIVE_CONTROL_CONTRACTS: Object.freeze([EXPECTED_CONTROL_CONTRACT]),
    FINGER_FILES,
    FINGER_SEQUENCE,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    refresh,
    observePassive,
    render,

    admitControlScript,
    scheduleAdmissionWatchdog,

    scanHtmlGate,
    readIndexPriestGate,
    readRouteNorthBishopGate,
    readLabWestCardinalBishop,
    readCanvasAuthority,
    readCanvasSummaryFromAuthority,
    normalizeCanvasSummary,
    readQueenAuthority,
    readQueenSummaryFromAuthority,
    normalizeQueenSummary,
    readQueenAdmissionGate,
    readQueenHandshakeGate,
    composeGateBoard,
    composeNewsAudit,
    composeFibonacciAudit,
    composeCanvasReleasePacket,
    composeQueenHandshakePacket,
    composeControlHandshakePacket: composeQueenHandshakePacket,
    deliverReleaseToCanvas,
    deliverQueenHandshakeToControl,
    deliverControlHandshakeToControl: deliverQueenHandshakeToControl,

    receiveCanvasSummary,
    receiveCanvasStationSummary,
    receiveCanvasLocalStationSummary,
    receiveCanvasParentSummary,
    receiveCanvasExpressionHubSummary,
    receiveExpressionHubSummary,
    receiveVisibleBaseGlobeReceipt,
    receiveVisibleGlobeReceipt,
    receiveVisiblePlanetReceipt,
    receiveCanvasVisibleProof,

    receiveQueenSummary,
    receiveQueenReceipt,
    receiveQueenBridgeState,
    receiveControlSummary,
    receiveControlReceipt,
    receiveControlHandshakeReceipt,
    receivePlanetaryViewControlReceipt,

    reconcileCanvas,
    reconcileControl,
    reconcileQueen,

    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket,
    getControlHandshakePacket,
    getControlsHandshakePacket,
    getPlanetaryControlHandshakePacket,
    getRouteConductorControlHandshakePacket,
    getQueenControlHandshakePacket,
    getControlPacket,

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

    supportsNewsAlignmentProtocol: true,
    supportsFibonacciSynchronizationAudit: true,
    supportsVisibleGlobeProofIngestion: true,
    supportsCanvasExpressionHubSpreadRecognition: true,
    supportsCurrentCanvasV123Recognition: true,
    supportsFullFingerBishopSequence: true,
    supportsPointerFingerBishopRecognition: true,
    supportsQueenControlFileAdmission: true,
    supportsQueenHandshakeDelivery: true,
    supportsQueenSuperconductorLanguage: true,
    supportsLabWestBishopChordLanguage: true,
    supportsControlAbsenceNotCase5: true,
    supportsCompatibilityReceiptV94: true,
    supportsPreviousV98Lineage: true,
    supportsPreviousV97Lineage: true,
    supportsPreviousV96Lineage: true,
    supportsPreviousV95Lineage: true,
    supportsRouteReceiptChainPublication: true,
    supportsAlwaysFreshReceiptPublication: true,
    supportsCanvasReleasePacketComposition: true,
    supportsQueenHandshakePacketComposition: true,
    supportsF21EligibilityPostureOnly: true,

    ownsRouteConductorRuntime: true,
    ownsRouteNorthBishopRecognitionFunnel: true,
    ownsNewsChronology: true,
    ownsFibonacciSynchronization: true,
    ownsCanvasReleasePacketComposition: true,
    ownsQueenControlFileAdmission: true,
    ownsQueenHandshakePacketComposition: true,
    ownsQueenHandshakeDelivery: true,
    ownsControlHandshakeExpectation: true,
    ownsControlIntegrationFunnelPublication: true,
    ownsCanvasSummaryIngestion: true,
    ownsQueenSummaryIngestion: true,
    ownsVisibleGlobeProofIngestion: true,
    ownsRouteReceiptPublication: true,

    ownsHtmlShell: false,
    ownsIndexPriestImplementation: false,
    ownsIndexButtonAuthority: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsQueenImplementation: false,
    ownsControlFileImplementation: false,
    ownsControlRuntimeTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasFingerTruth: false,
    ownsCardinalBishopImplementationTruth: false,
    ownsLabWestAdmissibilityTruth: false,
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
  publishGlobals("immediate-v9-9-api-publication", true);

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
