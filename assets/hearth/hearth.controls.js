// /assets/hearth/hearth.controls.js
// HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1
// Internal renewal:
// HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2
// Full-file replacement.
// Planetary controls / Queen view-input authority only.
// Purpose:
// - Preserve the public control contract expected by HTML, Route Conductor, diagnostics, and Canvas.
// - Upgrade Controls into the Queen bridge for view-input, route-conductor handshake,
//   West-gate hierarchy registry language, bishop-chord context, and Canvas public delivery.
// - Accept current Route Conductor control-admission language, including v9_7 and v9_8.
// - Read Lab West v4_8 West-gate downstream hierarchy registry as opaque superconductor context.
// - Preserve v4_7 Lab West bishop-chord language as compatibility only.
// - Recognize Queen as outside cardinal functionality.
// - Recognize cardinal bishops, downstream bishops, and East Priest as hierarchy language only.
// - Do not become a bishop.
// - Do not inspect bishop internals, subject files, child files, or finger files.
// - Bind pointer, touch, drag, wheel, and keyboard view controls only after lawful route-conductor admission.
// - Forward view-control delta packets to Canvas through public Canvas APIs only.
// - Preserve Canvas as receiver/output carrier.
// - Preserve no terrain truth, no hydrology truth, no elevation truth, no material truth,
//   no Canvas drawing authority, no F13 canvas claim, no F21 claim, no ready text, no final visual pass.
// Does not own:
// - HTML shell
// - index button authority / East Priest authority
// - route conductor handshake truth
// - LabWest admissibility truth
// - West-gate hierarchy truth
// - bishop implementation truth
// - bishop subject-file truth
// - bishop child-file truth
// - finger-file truth
// - Canvas drawing
// - Canvas expression truth
// - Canvas finger truth
// - planet terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - Macro West release
// - North F21 latch
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const RECEIPT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT_v1";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_RECEIPT_v2";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";

  const VERSION =
    "2026-06-04.hearth-controls-queen-west-gate-hierarchy-superconductor-view-input-bridge-v2";

  const FILE = "/assets/hearth/hearth.controls.js";
  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const ROUTE_CONDUCTOR_V9_8 =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8";
  const ROUTE_CONDUCTOR_V9_7 =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const ROUTE_CONDUCTOR_V9_6 =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const ROUTE_CONDUCTOR_V9_5 =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const ROUTE_CONDUCTOR_V9_4 =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    ROUTE_CONDUCTOR_V9_8,
    ROUTE_CONDUCTOR_V9_7,
    ROUTE_CONDUCTOR_V9_6,
    ROUTE_CONDUCTOR_V9_5,
    ROUTE_CONDUCTOR_V9_4,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const LABWEST_CURRENT_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8";
  const LABWEST_CURRENT_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT_v4_8";
  const LABWEST_COMPAT_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7";
  const LABWEST_COMPAT_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_RECEIPT_v4_7";

  const HIERARCHY_REGISTRY_CONTRACT =
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_CARDINAL_BISHOP_BISHOP_QUEEN_PRIEST_REGISTRY_v1";
  const HIERARCHY_REGISTRY_RECEIPT =
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_CARDINAL_BISHOP_BISHOP_QUEEN_PRIEST_REGISTRY_RECEIPT_v1";

  const CONTROL_PACKET = "HEARTH_CONTROLS_PLANETARY_VIEW_DELTA_PACKET_v1";
  const HANDSHAKE_PACKET = "HEARTH_ROUTE_CONDUCTOR_TO_CONTROLS_HANDSHAKE_PACKET_v1";
  const QUEEN_PACKET = "HEARTH_QUEEN_CONTROLS_SUPERCONDUCTOR_VIEW_PACKET_v2";

  const HANDSHAKE_STATUS = Object.freeze({
    WAITING_ROUTE_CONDUCTOR_AUTHORITY: "WAITING_ROUTE_CONDUCTOR_AUTHORITY",
    WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE: "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    ACCEPTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE: "ACCEPTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    REJECTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE: "REJECTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE"
  });

  const CONTROL_STATUS = Object.freeze({
    LOADED: "CONTROL_FILE_LOADED",
    WAITING_HANDSHAKE: "CONTROL_FILE_PRESENT_WAITING_HANDSHAKE",
    ACTIVE: "CONTROL_RUNTIME_ACTIVE",
    TARGET_PENDING: "CONTROL_RUNTIME_ACTIVE_CANVAS_TARGET_PENDING",
    DISPOSED: "CONTROL_RUNTIME_DISPOSED"
  });

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByControls: false,
    f21ClaimedByRouteConductor: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByControls: false,
    completionLatched: false,
    finalCompletionLatched: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const ROUTE_CONDUCTOR_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION",
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_SOUTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
    "HEARTH.routeConductorControlFileAdmissionAndHandshakeDelivery",
    "HEARTH.routeConductorControlHandshakeIntegration",
    "HEARTH.routeConductorNewsFibonacciVisibleGlobeProofSynchronization",
    "HEARTH.routeConductor",
    "HEARTH.southRouteConductor",
    "HEARTH.routeConductorPrimaryGate",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthSouthRouteConductor",
    "DEXTER_LAB.hearthRouteConductorPrimaryGate"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS",
    "HEARTH.canvasHub",
    "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisibleBaseGlobeCarrier",
    "HEARTH.canvasBaseGlobeCarrier",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasChildDistributionSwitchboard",
    "HEARTH.canvasParent",
    "HEARTH.canvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasExpressionHubVisibleBaseGlobeCarrier",
    "DEXTER_LAB.hearthCanvasVisibleBaseGlobeCarrier",
    "DEXTER_LAB.hearthCanvasBaseGlobeCarrier",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvas"
  ]);

  const LABWEST_ALIASES = Object.freeze([
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_ADOPTION",
    "LAB_RUNTIME_TABLE_WEST_GATE_DOWNSTREAM_HIERARCHY_ADOPTION",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT_v4_8",
    "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
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
    "HEARTH.westGateDownstreamHierarchyAdoption",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.gapClassifierWest",
    "DEXTER_LAB.transmissionGapClassifierWest",
    "DEXTER_LAB.westAdmissibility",
    "DEXTER_LAB.hearthWestBishopChordCanvasReleaseBridge",
    "DEXTER_LAB.hearthWestGateDownstreamHierarchyAdoption"
  ]);

  const HIERARCHY_REGISTRY_ALIASES = Object.freeze([
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_REGISTRY",
    "HEARTH_HIERARCHY_REGISTRY",
    "LAB_RUNTIME_TABLE_WEST_HIERARCHY_REGISTRY",
    "HEARTH.westGateDownstreamHierarchyRegistry",
    "HEARTH.hierarchyRegistry",
    "HEARTH.cardinalBishopHierarchy",
    "HEARTH.downstreamBishopHierarchy",
    "HEARTH.queenHierarchy",
    "HEARTH.priestHierarchy",
    "DEXTER_LAB.hearthWestGateDownstreamHierarchyRegistry",
    "DEXTER_LAB.hearthHierarchyRegistry"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const view = {
    yaw: 0,
    pitch: 0,
    zoom: 1,
    minPitch: -1.25,
    maxPitch: 1.25,
    minZoom: 0.55,
    maxZoom: 2.4
  };

  const input = {
    bound: false,
    target: null,
    restoreTouchAction: "",
    restoreTabIndex: null,
    pointerActive: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    handlers: Object.create(null)
  };

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    canvasFile: CANVAS_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    labWestFile: LABWEST_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CONTROLS_QUEEN_FILE_LOADED",

    queenControlBridgeActive: true,
    queenSuperconductorLanguageActive: true,
    queenReadsWestGateAsOpaqueSuperconductor: true,
    queenOutsideCardinalFunctionality: true,
    queenIsBishop: false,
    controlsInspectBishopInternals: false,
    controlsInspectSubjectFiles: false,
    controlsInspectChildFiles: false,
    controlsInspectFingerFiles: false,

    westGateHierarchyObserved: false,
    westGateHierarchyAuthoritySource: "NONE",
    westGateHierarchyContract: "",
    westGateHierarchyReceipt: "",
    hierarchyRegistryObserved: false,
    hierarchyRegistryAuthoritySource: "NONE",
    hierarchyRegistryContract: "",
    hierarchyRegistryReceipt: "",
    hierarchyRegistryStatus: "HIERARCHY_REGISTRY_NOT_OBSERVED",
    cardinalBishopTermOwnedByHierarchyMap: "UNKNOWN",
    highBishopTermRejected: "UNKNOWN",
    queenExcludedFromCardinalFunctionality: "UNKNOWN",
    priestNotBishop: "UNKNOWN",
    pointerFingerFileConfirmed: "UNKNOWN",

    controlStatus: CONTROL_STATUS.LOADED,
    handshakeRequired: true,
    handshakeStatus: HANDSHAKE_STATUS.WAITING_ROUTE_CONDUCTOR_AUTHORITY,
    handshakeAccepted: false,
    handshakeRejected: false,
    handshakePacket: null,
    handshakeSource: "NONE",
    handshakeRejectionReason: "",

    routeConductorObserved: false,
    routeConductorAuthoritySource: "NONE",
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorContractRecognized: false,
    routeConductorControlIntegrationStatus: "WAITING_ROUTE_CONDUCTOR_AUTHORITY",

    labWestObserved: false,
    labWestAuthoritySource: "NONE",
    labWestContract: "",
    labWestReceipt: "",
    labWestContractRecognizedCurrent: false,
    labWestContractRecognizedCompat: false,
    labWestSuperconductorStatus: "LABWEST_SUPERCONDUCTOR_NOT_OBSERVED",
    bishopChordBridgeActive: false,
    bishopSubjectFileDelegationActive: false,
    westKnowsBishopsNotChildren: true,
    bishopChordStatus: "UNKNOWN",
    bishopChordAdmissible: "UNKNOWN",
    bishopChordStrict: "UNKNOWN",
    bishopChordDegraded: "UNKNOWN",
    bishopChordHardBlock: "UNKNOWN",
    bishopChordReadyCount: "UNKNOWN",
    bishopChordObservedCount: "UNKNOWN",
    bishopChordReleaseMode: "UNKNOWN",
    fourWayCanvasHandoffActive: false,
    canvasReleaseApprovedByWest: false,
    releaseToCanvas: false,
    canvasReleasePacketReady: false,
    canvasReleaseHeldReason: "UNKNOWN",
    lastBishopContextPacket: null,
    lastHierarchyRegistry: null,

    inputAdmissionOpen: false,
    inputBound: false,
    inputTargetFound: false,
    inputTargetDescription: "NONE",

    touchStatus: "WAITING_HANDSHAKE",
    dragStatus: "WAITING_HANDSHAKE",
    motionStatus: "WAITING_HANDSHAKE",
    zoomStatus: "WAITING_HANDSHAKE",
    keyboardStatus: "WAITING_HANDSHAKE",
    inputStatus: "WAITING_HANDSHAKE",

    canvasObserved: false,
    canvasAuthoritySource: "NONE",
    canvasContract: "",
    canvasReceipt: "",
    canvasDeliveryStatus: "NOT_DELIVERED",
    canvasDeliveryMethod: "NONE",
    canvasDeliveryReason: "WAITING_CONTROL_DELTA",

    eventCount: 0,
    packetCount: 0,
    deliveryCount: 0,
    rejectionCount: 0,
    watchdogTicks: 0,

    lastInputType: "NONE",
    lastDeltaPacket: null,
    lastViewPacket: null,
    lastControlPacketPublishedAt: "",
    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  let bootPromise = null;
  let watchdogTimer = 0;

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
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function boolText(value) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return safeString(value || "UNKNOWN");
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
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
      if (value && isObject(value)) return { name, value };
    }
    return { name: "NONE", value: null };
  }

  function dataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
  }

  function datasetValue(key, fallback = "") {
    const ds = dataset();
    const value = ds[key];
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

  function describeElement(element) {
    if (!element || !element.tagName) return "NONE";

    const tag = safeString(element.tagName).toLowerCase();
    const id = element.id ? `#${element.id}` : "";

    const role = element.getAttribute && element.getAttribute("data-hearth-canvas-mount") !== null
      ? "[data-hearth-canvas-mount]"
      : element.getAttribute && element.getAttribute("data-hearth-globe-stage") !== null
        ? "[data-hearth-globe-stage]"
        : element.getAttribute && element.getAttribute("data-hearth-visible-planet-mount") !== null
          ? "[data-hearth-visible-planet-mount]"
          : "";

    return `${tag}${id}${role}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CONTROLS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 160);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CONTROLS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 100);
    state.latestEvent = item.code;
    state.updatedAt = item.at;
    return item;
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getTransmissionReceipt",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisibleBaseGlobeReceipt",
      "getVisibleGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getCanvasVisibleProofReceipt",
      "getHierarchyRegistry",
      "getHierarchySurface",
      "getControlsReceipt",
      "getControlReceipt",
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
    if (isObject(authority.canvasStationSummary)) return authority.canvasStationSummary;
    if (isObject(authority.hierarchyRegistry)) return authority.hierarchyRegistry;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
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

  function routeContractRecognized(contract) {
    return ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(safeString(contract));
  }

  function labWestCurrentRecognized(contract) {
    return safeString(contract) === LABWEST_CURRENT_CONTRACT;
  }

  function labWestCompatRecognized(contract) {
    return safeString(contract) === LABWEST_COMPAT_CONTRACT;
  }

  function readRouteConductorAuthority() {
    const found = firstGlobal(ROUTE_CONDUCTOR_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};

    const contract = firstNonEmpty(
      readField(receipt, ["contract", "CONTRACT", "currentRouteConductorContract", "routeConductorContract"]),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__,
      datasetValue("hearthRouteConductorContract"),
      datasetValue("routeConductorCurrentContract")
    );

    const receiptName = firstNonEmpty(
      readField(receipt, ["receipt", "RECEIPT", "currentRouteConductorReceipt", "routeConductorReceipt"]),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__,
      datasetValue("hearthRouteConductorReceipt")
    );

    state.routeConductorObserved = Boolean(found.value || contract);
    state.routeConductorAuthoritySource = found.name;
    state.routeConductorContract = contract;
    state.routeConductorReceipt = receiptName;
    state.routeConductorContractRecognized = routeContractRecognized(contract);

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName
    };
  }

  function readCanvasAuthority() {
    const found = firstGlobal(CANVAS_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};

    const contract = firstNonEmpty(
      readField(receipt, ["currentCanvasParentContract", "canvasContract", "currentCanvasContract", "contract", "CONTRACT"]),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      datasetValue("hearthCanvasContract"),
      datasetValue("hearthSouthCurrentCanvasParentContract")
    );

    const receiptName = firstNonEmpty(
      readField(receipt, ["currentCanvasParentReceipt", "canvasReceipt", "currentCanvasReceipt", "receipt", "RECEIPT"]),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      datasetValue("hearthCanvasReceipt"),
      datasetValue("hearthSouthCurrentCanvasParentReceipt")
    );

    state.canvasObserved = Boolean(found.value || contract);
    state.canvasAuthoritySource = found.name;
    state.canvasContract = contract;
    state.canvasReceipt = receiptName;

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName
    };
  }

  function readHierarchyRegistry() {
    const found = firstGlobal(HIERARCHY_REGISTRY_ALIASES);
    const registry = isObject(found.value) ? found.value : {};
    const ds = dataset();

    const contract = firstNonEmpty(
      readField(registry, ["contract", "CONTRACT", "hierarchyRegistryContract"]),
      ds.hearthHierarchyRegistryContract
    );

    const receiptName = firstNonEmpty(
      readField(registry, ["receipt", "RECEIPT", "hierarchyRegistryReceipt"]),
      ds.hearthHierarchyRegistryReceipt
    );

    const observed = Boolean(
      found.value ||
      contract === HIERARCHY_REGISTRY_CONTRACT ||
      ds.hearthHierarchyRegistryActive === "true" ||
      ds.hearthWestGateLanguageActive === "true"
    );

    state.hierarchyRegistryObserved = observed;
    state.hierarchyRegistryAuthoritySource = found.name;
    state.hierarchyRegistryContract = contract;
    state.hierarchyRegistryReceipt = receiptName;
    state.hierarchyRegistryStatus = observed
      ? "WEST_GATE_HIERARCHY_REGISTRY_OBSERVED"
      : "HIERARCHY_REGISTRY_NOT_OBSERVED";

    state.cardinalBishopTermOwnedByHierarchyMap = boolText(firstDefined(
      readField(registry, ["cardinalBishopTermOwnedByHierarchyMap"], ""),
      ds.hearthCardinalBishopTermOwnedByHierarchyMap
    ));
    state.highBishopTermRejected = boolText(firstDefined(
      readField(registry, ["highBishopTermRejected"], ""),
      ds.hearthHighBishopTermRejected
    ));
    state.queenExcludedFromCardinalFunctionality = boolText(firstDefined(
      readField(registry, ["queenExcludedFromCardinalFunctionality"], ""),
      ds.hearthQueenExcludedFromCardinalFunctionality
    ));
    state.priestNotBishop = boolText(firstDefined(
      readField(registry, ["priestNotBishop"], ""),
      ds.hearthPriestNotBishop
    ));
    state.pointerFingerFileConfirmed = boolText(firstDefined(
      readField(registry, ["pointerFingerFileConfirmed"], ""),
      ds.hearthPointerFingerFileConfirmed
    ));

    state.lastHierarchyRegistry = clonePlain(registry);

    return {
      observed,
      name: found.name,
      registry,
      contract,
      receiptName
    };
  }

  function readLabWestBishopBridge() {
    const found = firstGlobal(LABWEST_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const registry = readHierarchyRegistry();
    const ds = dataset();
    const merged = { ...ds, ...receipt };

    const contract = firstNonEmpty(
      readField(merged, ["contract", "CONTRACT"]),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthWestRuntimeTableContract,
      ds.labRuntimeTableWestContract
    );

    const receiptName = firstNonEmpty(
      readField(merged, ["receipt", "RECEIPT"]),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthWestRuntimeTableReceipt,
      ds.labRuntimeTableWestReceipt
    );

    const observed = Boolean(
      found.value ||
      contract ||
      ds.hearthWestBishopChordBridgeActive ||
      ds.hearthWestGateLanguageActive ||
      registry.observed
    );

    state.labWestObserved = observed;
    state.labWestAuthoritySource = found.name;
    state.labWestContract = contract;
    state.labWestReceipt = receiptName;
    state.labWestContractRecognizedCurrent = labWestCurrentRecognized(contract);
    state.labWestContractRecognizedCompat = labWestCompatRecognized(contract);

    state.westGateHierarchyObserved = Boolean(
      state.labWestContractRecognizedCurrent ||
      ds.hearthWestGateLanguageActive === "true" ||
      registry.observed
    );
    state.westGateHierarchyAuthoritySource = registry.observed ? registry.name : found.name;
    state.westGateHierarchyContract = registry.contract || ds.hearthHierarchyRegistryContract || "";
    state.westGateHierarchyReceipt = registry.receiptName || ds.hearthHierarchyRegistryReceipt || "";

    state.labWestSuperconductorStatus = state.westGateHierarchyObserved
      ? "LABWEST_V4_8_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_OBSERVED"
      : observed
        ? "LABWEST_BISHOP_CHORD_COMPAT_SUPERCONDUCTOR_OBSERVED"
        : "LABWEST_SUPERCONDUCTOR_NOT_OBSERVED";

    state.bishopChordBridgeActive = safeBool(
      readField(merged, ["bishopChordBridgeActive", "hearthWestBishopChordBridgeActive"], observed),
      observed
    );
    state.bishopSubjectFileDelegationActive = safeBool(
      readField(merged, ["bishopSubjectFileDelegationActive", "hearthWestBishopSubjectFileDelegationActive"], observed),
      observed
    );
    state.westKnowsBishopsNotChildren = safeBool(
      readField(merged, ["westKnowsBishopsNotChildren", "hearthWestKnowsBishopsNotChildren"], true),
      true
    );
    state.bishopChordStatus = safeString(
      readField(merged, ["bishopChordStatus", "hearthWestBishopChordStatus"], "UNKNOWN")
    );
    state.bishopChordAdmissible = boolText(
      readField(merged, ["bishopChordAdmissible", "hearthWestBishopChordAdmissible"], "UNKNOWN")
    );
    state.bishopChordStrict = boolText(
      readField(merged, ["bishopChordStrict", "hearthWestBishopChordStrict"], "UNKNOWN")
    );
    state.bishopChordDegraded = boolText(
      readField(merged, ["bishopChordDegraded", "hearthWestBishopChordDegraded"], "UNKNOWN")
    );
    state.bishopChordHardBlock = boolText(
      readField(merged, ["bishopChordHardBlock", "hearthWestBishopChordHardBlock"], "UNKNOWN")
    );
    state.bishopChordReadyCount = safeString(
      readField(merged, ["bishopChordReadyCount", "hearthWestBishopChordReadyCount"], "UNKNOWN")
    );
    state.bishopChordObservedCount = safeString(
      readField(merged, ["bishopChordObservedCount", "hearthWestBishopChordObservedCount"], "UNKNOWN")
    );
    state.bishopChordReleaseMode = safeString(
      readField(merged, ["bishopChordReleaseMode", "hearthWestBishopChordReleaseMode"], "UNKNOWN")
    );
    state.fourWayCanvasHandoffActive = safeBool(
      readField(merged, ["fourWayCanvasHandoffActive", "hearthWestFourWayCanvasHandoffActive"], observed),
      observed
    );
    state.canvasReleaseApprovedByWest = safeBool(
      readField(merged, ["canvasReleaseApprovedByWest", "hearthWestCanvasReleaseApproved"], false),
      false
    );
    state.releaseToCanvas = safeBool(
      readField(merged, ["releaseToCanvas", "hearthReleaseToCanvas"], false),
      false
    );
    state.canvasReleasePacketReady = safeBool(
      readField(merged, ["canvasReleasePacketReady", "hearthCanvasReleasePacketReady"], false),
      false
    );
    state.canvasReleaseHeldReason = safeString(
      readField(merged, ["canvasReleaseHeldReason", "hearthCanvasReleaseHeldReason"], "UNKNOWN")
    );

    return {
      observed,
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName,
      hierarchyRegistry: registry
    };
  }

  function findInputTarget() {
    if (!doc) return null;

    return (
      q("#hearthCanvasMount canvas") ||
      q("[data-hearth-canvas-mount] canvas") ||
      q("#hearthGlobeStage canvas") ||
      q("[data-hearth-globe-stage] canvas") ||
      q("[data-hearth-visible-planet-mount] canvas") ||
      q("canvas[data-hearth-canvas='true']") ||
      q("canvas[data-hearth-canvas-texture='true']") ||
      q("canvas[data-hearth-planet-canvas='true']") ||
      q("#hearthCanvasMount") ||
      q("[data-hearth-canvas-mount]") ||
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-visible-planet-mount]")
    );
  }

  function hasNoForbiddenClaims(packet) {
    const p = isObject(packet) ? packet : {};

    return !(
      p.f13Claimed === true ||
      p.f13CanvasClaimed === true ||
      p.f21EligibleForNorth === true ||
      p.f21ClaimedByControls === true ||
      p.f21ClaimedByRouteConductor === true ||
      p.f21ClaimedByDiagnosticRail === true ||
      p.readyTextAllowed === true ||
      p.readyTextClaimed === true ||
      p.completionLatched === true ||
      p.finalCompletionLatched === true ||
      p.visualPassClaimed === true ||
      p.generatedImage === true ||
      p.graphicBox === true ||
      p.webGL === true ||
      p.webgl === true
    );
  }

  function packetTargetsControls(packet) {
    if (!isObject(packet)) return false;

    const packetType = safeString(packet.packetType || packet.type || "");
    const handoffTo = safeString(packet.handoffTo || packet.destination || packet.target || "");
    const targetFile = safeString(firstDefined(
      packet.targetFile,
      packet.destinationFile,
      packet.controlFile,
      packet.controlsFile,
      packet.targetControlFile,
      packet.expectedControlFile,
      packet.jsControlFile
    ), "");

    return Boolean(
      packetType.includes("CONTROL") ||
      packetType.includes("CONTROLS") ||
      handoffTo.toUpperCase().includes("CONTROL") ||
      handoffTo.toUpperCase().includes("CONTROLS") ||
      targetFile === FILE ||
      targetFile.endsWith("/hearth.controls.js") ||
      safeBool(packet.controlHandshakeAuthorized, false) ||
      safeBool(packet.controlsHandshakeAuthorized, false) ||
      safeBool(packet.planetaryControlHandshakeAuthorized, false) ||
      safeBool(packet.controlAdmissionAuthorized, false) ||
      safeBool(packet.controlsAdmissionAuthorized, false) ||
      safeBool(packet.planetaryControlAdmissionAuthorized, false)
    );
  }

  function packetSourceIsRouteConductor(packet) {
    if (!isObject(packet)) return false;

    const sourceFile = safeString(packet.sourceFile || packet.fromFile || "");
    const sourceRole = safeString(packet.sourceRole || packet.role || packet.authority || "");
    const contract = safeString(firstDefined(
      packet.routeConductorContract,
      packet.sourceContract,
      packet.contract,
      packet.CONTRACT
    ), "");

    return Boolean(
      sourceFile === ROUTE_CONDUCTOR_FILE ||
      sourceFile.endsWith("/showroom/globe/hearth/hearth.js") ||
      sourceRole.includes("route-conductor") ||
      sourceRole.includes("ROUTE_CONDUCTOR") ||
      routeContractRecognized(contract) ||
      contract.includes("HEARTH_ROUTE_CONDUCTOR")
    );
  }

  function routeImpliesControlAdmission(route) {
    const receipt = isObject(route && route.receipt) ? route.receipt : {};
    const ds = dataset();
    const contract = safeString(route && route.contract);

    if (!routeContractRecognized(contract)) return false;

    const explicitDenial = Boolean(
      receipt.controlAdmissionAuthorized === false ||
      receipt.controlsAdmissionAuthorized === false ||
      receipt.planetaryControlAdmissionAuthorized === false ||
      /REJECTED|DENIED|FALSE/i.test(safeString(ds.hearthRouteConductorControlIntegrationStatus))
    );

    if (explicitDenial) return false;

    const text = [
      readField(receipt, ["controlHandshakeStatus", "controlsHandshakeStatus", "routeConductorControlIntegrationStatus"], ""),
      readField(receipt, ["postgameStatus", "runtimeReleaseState", "latestEvent"], ""),
      ds.hearthRouteConductorControlIntegrationStatus,
      ds.hearthControlHandshakeStatus,
      ds.hearthRuntimeReleaseState,
      ds.hearthPostgameStatus
    ].filter(Boolean).join(" | ");

    if (/ACCEPTED|ADMITTED|CONTROL_HANDSHAKE_ACCEPTED|HANDSHAKE_DELIVERY|CONTROL_FILE_ADMISSION/i.test(text)) {
      return true;
    }

    if (safeBool(readField(receipt, [
      "controlHandshakeAccepted",
      "controlsHandshakeAccepted",
      "planetaryControlHandshakeAccepted",
      "controlAdmissionAuthorized",
      "controlsAdmissionAuthorized",
      "planetaryControlAdmissionAuthorized",
      "controlFileAdmissionAuthorized",
      "controlHandshakeDelivered",
      "controlsHandshakeDelivered"
    ], false), false)) {
      return true;
    }

    return contract === ROUTE_CONDUCTOR_V9_8 || contract === ROUTE_CONDUCTOR_V9_7;
  }

  function composeImplicitHandshake(route, reason) {
    return {
      packetType: HANDSHAKE_PACKET,
      sourceFile: ROUTE_CONDUCTOR_FILE,
      sourceRole: "ROUTE_CONDUCTOR",
      sourceContract: route.contract,
      sourceReceipt: route.receiptName,
      targetFile: FILE,
      destinationFile: FILE,
      controlsFile: FILE,
      controlHandshakeAuthorized: true,
      controlsHandshakeAuthorized: true,
      planetaryControlHandshakeAuthorized: true,
      controlAdmissionAuthorized: true,
      controlsAdmissionAuthorized: true,
      planetaryControlAdmissionAuthorized: true,
      reason,
      derivedFromRouteConductorReceipt: true,
      derivedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getHandshakePacketFromRouteConductor(route) {
    const authority = route && route.authority;

    if (authority && isObject(authority)) {
      const methods = [
        "getPlanetaryControlHandshakePacket",
        "getControlHandshakePacket",
        "getControlsHandshakePacket",
        "getRouteConductorControlHandshakePacket",
        "getPlanetaryControlsHandoffPacket",
        "getControlsHandoffPacket",
        "getControlHandoffPacket"
      ];

      for (const method of methods) {
        if (!isFunction(authority[method])) continue;

        try {
          const result = authority[method]({
            requester: CONTRACT,
            requesterFile: FILE,
            targetFile: FILE,
            canvasFile: CANVAS_FILE,
            queenControlBridgeActive: true,
            queenOutsideCardinalFunctionality: true
          });

          if (isObject(result)) {
            return {
              packet: result,
              source: `${route.name}.${method}`
            };
          }
        } catch (error) {
          recordError("ROUTE_CONDUCTOR_HANDSHAKE_METHOD_FAILED", error, { method });
        }
      }
    }

    const receipt = route && route.receipt ? route.receipt : {};
    const candidates = [
      receipt.controlHandshakePacket,
      receipt.controlsHandshakePacket,
      receipt.planetaryControlHandshakePacket,
      receipt.routeConductorControlHandshakePacket,
      receipt.controlHandoffPacket,
      receipt.controlsHandoffPacket,
      authority && authority.controlHandshakePacket,
      authority && authority.controlsHandshakePacket,
      authority && authority.planetaryControlHandshakePacket
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) {
        return {
          packet: candidate,
          source: `${route.name}.receipt-or-property`
        };
      }
    }

    if (routeImpliesControlAdmission(route)) {
      return {
        packet: composeImplicitHandshake(route, "ROUTE_CONDUCTOR_CURRENT_CONTRACT_OR_RECEIPT_IMPLIES_CONTROL_ADMISSION"),
        source: `${route.name}.implicit-current-route-conductor-admission`
      };
    }

    return null;
  }

  function getGlobalHandshakePacket() {
    const found = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_ROUTE_CONDUCTOR_CONTROLS_HANDSHAKE_PACKET",
      "HEARTH_PLANETARY_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_CONTROLS_HANDSHAKE_PACKET",
      "HEARTH.controlHandshakePacket",
      "HEARTH.controlsHandshakePacket",
      "HEARTH.planetaryControlHandshakePacket",
      "DEXTER_LAB.hearthControlHandshakePacket",
      "DEXTER_LAB.hearthControlsHandshakePacket"
    ]);

    if (isObject(found.value)) {
      return {
        packet: found.value,
        source: found.name
      };
    }

    return null;
  }

  function validateHandshake(packet) {
    if (!isObject(packet)) {
      return {
        accepted: false,
        reason: "HANDSHAKE_PACKET_NOT_OBJECT"
      };
    }

    if (!hasNoForbiddenClaims(packet)) {
      return {
        accepted: false,
        reason: "HANDSHAKE_PACKET_CONTAINS_FORBIDDEN_CLAIM"
      };
    }

    if (!packetTargetsControls(packet)) {
      return {
        accepted: false,
        reason: "HANDSHAKE_PACKET_DOES_NOT_TARGET_CONTROLS"
      };
    }

    if (!packetSourceIsRouteConductor(packet)) {
      return {
        accepted: false,
        reason: "HANDSHAKE_PACKET_NOT_FROM_ROUTE_CONDUCTOR"
      };
    }

    if (
      packet.controlAdmissionAuthorized === false ||
      packet.controlsAdmissionAuthorized === false ||
      packet.planetaryControlAdmissionAuthorized === false
    ) {
      return {
        accepted: false,
        reason: "ROUTE_CONDUCTOR_CONTROL_ADMISSION_FALSE"
      };
    }

    return {
      accepted: true,
      reason: "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_ACCEPTED"
    };
  }

  function openInputAdmission(handshakePacket, source) {
    state.handshakeAccepted = true;
    state.handshakeRejected = false;
    state.handshakeStatus = HANDSHAKE_STATUS.ACCEPTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE;
    state.handshakePacket = clonePlain(handshakePacket);
    state.handshakeSource = source || "ROUTE_CONDUCTOR";
    state.handshakeRejectionReason = "";
    state.inputAdmissionOpen = true;
    state.controlStatus = CONTROL_STATUS.ACTIVE;
    state.routeConductorControlIntegrationStatus = "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_ACCEPTED";

    record("HEARTH_CONTROLS_QUEEN_HANDSHAKE_ACCEPTED", {
      source: state.handshakeSource,
      routeConductorContract: state.routeConductorContract,
      targetFile: FILE
    });

    bindInputIfAdmitted();
    publishGlobals("handshake-accepted");
    return getReceiptLight(false);
  }

  function rejectHandshake(packet, reason, source) {
    state.handshakeAccepted = false;
    state.handshakeRejected = true;
    state.handshakeStatus = HANDSHAKE_STATUS.REJECTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE;
    state.handshakePacket = clonePlain(packet || null);
    state.handshakeSource = source || "UNKNOWN";
    state.handshakeRejectionReason = reason || "HANDSHAKE_REJECTED";
    state.inputAdmissionOpen = false;
    state.rejectionCount += 1;
    state.controlStatus = CONTROL_STATUS.WAITING_HANDSHAKE;
    state.routeConductorControlIntegrationStatus = "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REJECTED";

    record("HEARTH_CONTROLS_QUEEN_HANDSHAKE_REJECTED", {
      source: state.handshakeSource,
      reason: state.handshakeRejectionReason
    });

    publishGlobals("handshake-rejected");
    return getReceiptLight(false);
  }

  function receiveRouteConductorControlHandshake(packet, source = "direct-receiveRouteConductorControlHandshake") {
    const validation = validateHandshake(packet);

    if (!validation.accepted) {
      return rejectHandshake(packet, validation.reason, source);
    }

    return openInputAdmission(packet, source);
  }

  function receiveControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-receiveControlHandshake");
  }

  function consumeRouteConductorControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-consumeRouteConductorControlHandshake");
  }

  function consumeControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-consumeControlHandshake");
  }

  function receiveBishopChordContext(packet, source = "direct-receiveBishopChordContext") {
    if (!isObject(packet)) {
      recordError("BISHOP_CONTEXT_REJECTED", "BISHOP_CONTEXT_PACKET_NOT_OBJECT", { source });
      return getQueenBridgeState();
    }

    state.lastBishopContextPacket = clonePlain(packet);
    state.labWestObserved = true;
    state.labWestSuperconductorStatus = "BISHOP_CHORD_CONTEXT_RECEIVED_BY_QUEEN";
    state.bishopChordBridgeActive = safeBool(packet.bishopChordBridgeActive, state.bishopChordBridgeActive);
    state.bishopSubjectFileDelegationActive = safeBool(packet.bishopSubjectFileDelegationActive, state.bishopSubjectFileDelegationActive);
    state.westKnowsBishopsNotChildren = safeBool(packet.westKnowsBishopsNotChildren, true);
    state.bishopChordStatus = safeString(packet.bishopChordStatus || state.bishopChordStatus);
    state.bishopChordAdmissible = boolText(packet.bishopChordAdmissible !== undefined ? packet.bishopChordAdmissible : state.bishopChordAdmissible);
    state.bishopChordStrict = boolText(packet.bishopChordStrict !== undefined ? packet.bishopChordStrict : state.bishopChordStrict);
    state.bishopChordDegraded = boolText(packet.bishopChordDegraded !== undefined ? packet.bishopChordDegraded : state.bishopChordDegraded);
    state.bishopChordHardBlock = boolText(packet.bishopChordHardBlock !== undefined ? packet.bishopChordHardBlock : state.bishopChordHardBlock);
    state.fourWayCanvasHandoffActive = safeBool(packet.fourWayCanvasHandoffActive, state.fourWayCanvasHandoffActive);
    state.canvasReleaseApprovedByWest = safeBool(packet.canvasReleaseApprovedByWest, state.canvasReleaseApprovedByWest);
    state.releaseToCanvas = safeBool(packet.releaseToCanvas, state.releaseToCanvas);

    record("HEARTH_CONTROLS_QUEEN_BISHOP_CONTEXT_RECEIVED", { source });
    updateDataset();
    publishGlobals("bishop-context");
    return getQueenBridgeState();
  }

  function consumeBishopChordContext(packet) {
    return receiveBishopChordContext(packet, "direct-consumeBishopChordContext");
  }

  function receiveWestGateHierarchyContext(packet, source = "direct-receiveWestGateHierarchyContext") {
    if (!isObject(packet)) {
      recordError("WEST_GATE_HIERARCHY_CONTEXT_REJECTED", "WEST_GATE_HIERARCHY_PACKET_NOT_OBJECT", { source });
      return getQueenBridgeState();
    }

    state.lastHierarchyRegistry = clonePlain(packet);
    state.hierarchyRegistryObserved = true;
    state.hierarchyRegistryAuthoritySource = source;
    state.hierarchyRegistryContract = safeString(packet.contract || packet.hierarchyRegistryContract || HIERARCHY_REGISTRY_CONTRACT);
    state.hierarchyRegistryReceipt = safeString(packet.receipt || packet.hierarchyRegistryReceipt || HIERARCHY_REGISTRY_RECEIPT);
    state.hierarchyRegistryStatus = "WEST_GATE_HIERARCHY_CONTEXT_RECEIVED_BY_QUEEN";
    state.westGateHierarchyObserved = true;
    state.westGateHierarchyAuthoritySource = source;
    state.cardinalBishopTermOwnedByHierarchyMap = boolText(packet.cardinalBishopTermOwnedByHierarchyMap);
    state.highBishopTermRejected = boolText(packet.highBishopTermRejected);
    state.queenExcludedFromCardinalFunctionality = boolText(
      packet.queenExcludedFromCardinalFunctionality !== undefined
        ? packet.queenExcludedFromCardinalFunctionality
        : packet.queen && packet.queen.excludedFromCardinalFunctionality
    );
    state.priestNotBishop = boolText(packet.priestNotBishop);
    state.pointerFingerFileConfirmed = boolText(packet.pointerFingerFileConfirmed);

    record("HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_CONTEXT_RECEIVED", { source });
    updateDataset();
    publishGlobals("west-gate-hierarchy-context");
    return getQueenBridgeState();
  }

  function consumeWestGateHierarchyContext(packet) {
    return receiveWestGateHierarchyContext(packet, "direct-consumeWestGateHierarchyContext");
  }

  function observeHandshake() {
    const route = readRouteConductorAuthority();

    if (!route.authority && !route.contract) {
      state.handshakeStatus = HANDSHAKE_STATUS.WAITING_ROUTE_CONDUCTOR_AUTHORITY;
      state.routeConductorControlIntegrationStatus = "WAITING_ROUTE_CONDUCTOR_AUTHORITY";
      state.controlStatus = CONTROL_STATUS.WAITING_HANDSHAKE;
      updateDataset();
      return getReceiptLight(false);
    }

    const routePacket = getHandshakePacketFromRouteConductor(route);
    const globalPacket = routePacket || getGlobalHandshakePacket();

    if (globalPacket && isObject(globalPacket.packet)) {
      return receiveRouteConductorControlHandshake(globalPacket.packet, globalPacket.source);
    }

    if (!state.handshakeAccepted) {
      state.handshakeStatus = HANDSHAKE_STATUS.WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE;
      state.routeConductorControlIntegrationStatus = "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE";
      state.controlStatus = CONTROL_STATUS.WAITING_HANDSHAKE;
    }

    updateDataset();
    return getReceiptLight(false);
  }

  function bindInputIfAdmitted() {
    if (!doc || !state.inputAdmissionOpen || input.bound || state.disposed) {
      updateInputState();
      return false;
    }

    const target = findInputTarget();

    input.target = target;
    state.inputTargetFound = Boolean(target);
    state.inputTargetDescription = describeElement(target);

    if (!target) {
      state.controlStatus = CONTROL_STATUS.TARGET_PENDING;
      updateInputState();
      updateDataset();
      return false;
    }

    input.restoreTouchAction = target.style ? target.style.touchAction || "" : "";
    input.restoreTabIndex = target.getAttribute ? target.getAttribute("tabindex") : null;

    try {
      if (target.style) target.style.touchAction = "none";
      if (target.setAttribute && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "0");
    } catch (_error) {}

    input.handlers.pointerdown = onPointerDown;
    input.handlers.pointermove = onPointerMove;
    input.handlers.pointerup = onPointerUp;
    input.handlers.pointercancel = onPointerUp;
    input.handlers.wheel = onWheel;
    input.handlers.keydown = onKeyDown;

    try {
      target.addEventListener("pointerdown", input.handlers.pointerdown, { passive: false });
      target.addEventListener("pointermove", input.handlers.pointermove, { passive: false });
      target.addEventListener("pointerup", input.handlers.pointerup, { passive: false });
      target.addEventListener("pointercancel", input.handlers.pointercancel, { passive: false });
      target.addEventListener("wheel", input.handlers.wheel, { passive: false });
      doc.addEventListener("keydown", input.handlers.keydown, { passive: false });

      input.bound = true;
      state.inputBound = true;
      state.controlStatus = CONTROL_STATUS.ACTIVE;
      updateInputState();
      updateDataset();

      record("HEARTH_CONTROLS_QUEEN_INPUT_BOUND", {
        target: state.inputTargetDescription,
        handshakeStatus: state.handshakeStatus
      });

      return true;
    } catch (error) {
      recordError("HEARTH_CONTROLS_QUEEN_BIND_FAILED", error, { target: state.inputTargetDescription });
      updateInputState();
      updateDataset();
      return false;
    }
  }

  function unbindInput() {
    if (!doc || !input.bound || !input.target) return;

    try {
      input.target.removeEventListener("pointerdown", input.handlers.pointerdown);
      input.target.removeEventListener("pointermove", input.handlers.pointermove);
      input.target.removeEventListener("pointerup", input.handlers.pointerup);
      input.target.removeEventListener("pointercancel", input.handlers.pointercancel);
      input.target.removeEventListener("wheel", input.handlers.wheel);
      doc.removeEventListener("keydown", input.handlers.keydown);

      if (input.target.style) input.target.style.touchAction = input.restoreTouchAction || "";

      if (input.restoreTabIndex === null && input.target.removeAttribute) {
        input.target.removeAttribute("tabindex");
      } else if (input.target.setAttribute) {
        input.target.setAttribute("tabindex", input.restoreTabIndex);
      }
    } catch (error) {
      recordError("HEARTH_CONTROLS_QUEEN_UNBIND_FAILED", error);
    }

    input.bound = false;
    input.target = null;
    input.pointerActive = false;
    input.pointerId = null;
    input.handlers = Object.create(null);

    state.inputBound = false;
    updateInputState();
    updateDataset();
  }

  function updateInputState() {
    if (!state.inputAdmissionOpen) {
      state.touchStatus = "WAITING_HANDSHAKE";
      state.dragStatus = "WAITING_HANDSHAKE";
      state.motionStatus = "WAITING_HANDSHAKE";
      state.zoomStatus = "WAITING_HANDSHAKE";
      state.keyboardStatus = "WAITING_HANDSHAKE";
      state.inputStatus = "WAITING_HANDSHAKE";
      return;
    }

    if (!state.inputTargetFound) {
      state.touchStatus = "WAITING_CANVAS_TARGET";
      state.dragStatus = "WAITING_CANVAS_TARGET";
      state.motionStatus = "WAITING_CANVAS_TARGET";
      state.zoomStatus = "WAITING_CANVAS_TARGET";
      state.keyboardStatus = "WAITING_CANVAS_TARGET";
      state.inputStatus = "WAITING_CANVAS_TARGET";
      return;
    }

    state.touchStatus = input.bound ? "TOUCH_INPUT_BOUND" : "TOUCH_INPUT_PENDING";
    state.dragStatus = input.bound ? "DRAG_INPUT_BOUND" : "DRAG_INPUT_PENDING";
    state.motionStatus = input.bound ? "VIEW_MOTION_CONTROL_READY" : "VIEW_MOTION_CONTROL_PENDING";
    state.zoomStatus = input.bound ? "ZOOM_INPUT_BOUND" : "ZOOM_INPUT_PENDING";
    state.keyboardStatus = input.bound ? "KEYBOARD_INPUT_BOUND" : "KEYBOARD_INPUT_PENDING";
    state.inputStatus = input.bound ? "PLANETARY_VIEW_INPUT_ADMITTED" : "PLANETARY_VIEW_INPUT_PENDING";
  }

  function eventBelongsToInput(event) {
    if (!event || !event.target || !input.target) return false;
    if (event.target === input.target) return true;
    return Boolean(input.target.contains && input.target.contains(event.target));
  }

  function targetIsEditable(event) {
    const target = event && event.target;
    if (!target || !target.tagName) return false;

    const tag = safeString(target.tagName).toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      target.isContentEditable === true
    );
  }

  function onPointerDown(event) {
    if (!state.inputAdmissionOpen || state.disposed) return;
    if (event.button !== undefined && event.button !== 0) return;

    input.pointerActive = true;
    input.pointerId = event.pointerId;
    input.lastX = safeNumber(event.clientX, 0);
    input.lastY = safeNumber(event.clientY, 0);
    state.lastInputType = "pointerdown";

    try {
      if (event.currentTarget && isFunction(event.currentTarget.setPointerCapture)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    } catch (_error) {}

    if (isFunction(event.preventDefault)) event.preventDefault();

    record("HEARTH_CONTROLS_QUEEN_POINTER_DOWN", {
      x: input.lastX,
      y: input.lastY
    });
  }

  function onPointerMove(event) {
    if (!state.inputAdmissionOpen || state.disposed || !input.pointerActive) return;
    if (input.pointerId !== null && event.pointerId !== input.pointerId) return;

    const x = safeNumber(event.clientX, input.lastX);
    const y = safeNumber(event.clientY, input.lastY);
    const dx = x - input.lastX;
    const dy = y - input.lastY;

    input.lastX = x;
    input.lastY = y;

    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
    if (isFunction(event.preventDefault)) event.preventDefault();

    applyViewDelta({
      inputType: "pointer-drag",
      deltaYaw: dx * 0.006,
      deltaPitch: dy * 0.006,
      deltaZoom: 0,
      rawDx: dx,
      rawDy: dy
    });
  }

  function onPointerUp(event) {
    if (!input.pointerActive) return;

    try {
      if (event.currentTarget && isFunction(event.currentTarget.releasePointerCapture)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (_error) {}

    input.pointerActive = false;
    input.pointerId = null;
    state.lastInputType = "pointerup";

    record("HEARTH_CONTROLS_QUEEN_POINTER_UP", {});
  }

  function onWheel(event) {
    if (!state.inputAdmissionOpen || state.disposed) return;
    if (!eventBelongsToInput(event)) return;

    const dy = safeNumber(event.deltaY, 0);
    if (Math.abs(dy) < 0.01) return;

    if (isFunction(event.preventDefault)) event.preventDefault();

    applyViewDelta({
      inputType: "wheel-zoom",
      deltaYaw: 0,
      deltaPitch: 0,
      deltaZoom: -dy * 0.0012,
      rawWheelY: dy
    });
  }

  function onKeyDown(event) {
    if (!state.inputAdmissionOpen || state.disposed || targetIsEditable(event)) return;

    const key = safeString(event.key);
    const active = doc && doc.activeElement;

    const targetActive = Boolean(
      active === input.target ||
      active === doc.body ||
      (input.target && input.target.contains && input.target.contains(active))
    );

    if (!targetActive) return;

    let deltaYaw = 0;
    let deltaPitch = 0;
    let deltaZoom = 0;

    if (key === "ArrowLeft") deltaYaw = -0.06;
    else if (key === "ArrowRight") deltaYaw = 0.06;
    else if (key === "ArrowUp") deltaPitch = -0.06;
    else if (key === "ArrowDown") deltaPitch = 0.06;
    else if (key === "+" || key === "=") deltaZoom = 0.08;
    else if (key === "-" || key === "_") deltaZoom = -0.08;
    else return;

    if (isFunction(event.preventDefault)) event.preventDefault();

    applyViewDelta({
      inputType: "keyboard-view",
      deltaYaw,
      deltaPitch,
      deltaZoom,
      key
    });
  }

  function applyViewDelta(delta) {
    if (!state.inputAdmissionOpen || state.disposed) return null;

    view.yaw += safeNumber(delta.deltaYaw, 0);
    view.pitch = clamp(view.pitch + safeNumber(delta.deltaPitch, 0), view.minPitch, view.maxPitch);
    view.zoom = clamp(view.zoom + safeNumber(delta.deltaZoom, 0), view.minZoom, view.maxZoom);

    state.lastInputType = delta.inputType || "view-delta";

    const packet = composeViewDeltaPacket(delta);

    state.lastDeltaPacket = clonePlain(packet);
    state.lastViewPacket = clonePlain(packet);
    state.packetCount += 1;
    state.lastControlPacketPublishedAt = packet.composedAt;

    publishControlPacket(packet);
    deliverControlPacketToCanvas(packet);
    updateDataset();
    publishGlobals("view-delta");

    return packet;
  }

  function composeQueenBridgeContext() {
    return {
      queenControlBridgeActive: true,
      queenSuperconductorLanguageActive: true,
      queenReadsWestGateAsOpaqueSuperconductor: true,
      queenOutsideCardinalFunctionality: true,
      queenIsBishop: false,
      routeConductorRemainsHandshakeAuthority: true,
      controlsOwnViewInputOnly: true,

      westGateHierarchyObserved: state.westGateHierarchyObserved,
      westGateHierarchyAuthoritySource: state.westGateHierarchyAuthoritySource,
      westGateHierarchyContract: state.westGateHierarchyContract,
      westGateHierarchyReceipt: state.westGateHierarchyReceipt,
      hierarchyRegistryObserved: state.hierarchyRegistryObserved,
      hierarchyRegistryAuthoritySource: state.hierarchyRegistryAuthoritySource,
      hierarchyRegistryContract: state.hierarchyRegistryContract,
      hierarchyRegistryReceipt: state.hierarchyRegistryReceipt,
      hierarchyRegistryStatus: state.hierarchyRegistryStatus,
      cardinalBishopTermOwnedByHierarchyMap: state.cardinalBishopTermOwnedByHierarchyMap,
      highBishopTermRejected: state.highBishopTermRejected,
      queenExcludedFromCardinalFunctionality: state.queenExcludedFromCardinalFunctionality,
      priestNotBishop: state.priestNotBishop,
      pointerFingerFileConfirmed: state.pointerFingerFileConfirmed,

      labWestObserved: state.labWestObserved,
      labWestAuthoritySource: state.labWestAuthoritySource,
      labWestContract: state.labWestContract,
      labWestReceipt: state.labWestReceipt,
      labWestContractRecognizedCurrent: state.labWestContractRecognizedCurrent,
      labWestContractRecognizedCompat: state.labWestContractRecognizedCompat,
      labWestSuperconductorStatus: state.labWestSuperconductorStatus,

      bishopChordBridgeActive: state.bishopChordBridgeActive,
      bishopSubjectFileDelegationActive: state.bishopSubjectFileDelegationActive,
      westKnowsBishopsNotChildren: state.westKnowsBishopsNotChildren,
      bishopChordStatus: state.bishopChordStatus,
      bishopChordAdmissible: state.bishopChordAdmissible,
      bishopChordStrict: state.bishopChordStrict,
      bishopChordDegraded: state.bishopChordDegraded,
      bishopChordHardBlock: state.bishopChordHardBlock,
      bishopChordReadyCount: state.bishopChordReadyCount,
      bishopChordObservedCount: state.bishopChordObservedCount,
      bishopChordReleaseMode: state.bishopChordReleaseMode,

      fourWayCanvasHandoffActive: state.fourWayCanvasHandoffActive,
      canvasReleaseApprovedByWest: state.canvasReleaseApprovedByWest,
      releaseToCanvas: state.releaseToCanvas,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,

      controlsInspectBishopInternals: false,
      controlsInspectSubjectFiles: false,
      controlsInspectChildFiles: false,
      controlsInspectFingerFiles: false
    };
  }

  function composeViewDeltaPacket(delta = {}) {
    const queenBridge = composeQueenBridgeContext();

    return {
      packetType: CONTROL_PACKET,
      queenPacketType: QUEEN_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      handoffTo: "CANVAS",
      sourceAuthority: "HEARTH_CONTROLS_QUEEN",
      controlHandshakeStatus: state.handshakeStatus,
      inputAdmissionOpen: state.inputAdmissionOpen === true,
      inputType: safeString(delta.inputType, "view-delta"),

      deltaYaw: safeNumber(delta.deltaYaw, 0),
      deltaPitch: safeNumber(delta.deltaPitch, 0),
      deltaZoom: safeNumber(delta.deltaZoom, 0),
      rawDx: delta.rawDx !== undefined ? safeNumber(delta.rawDx, 0) : undefined,
      rawDy: delta.rawDy !== undefined ? safeNumber(delta.rawDy, 0) : undefined,
      rawWheelY: delta.rawWheelY !== undefined ? safeNumber(delta.rawWheelY, 0) : undefined,
      key: delta.key || "",

      viewState: {
        yaw: view.yaw,
        pitch: view.pitch,
        zoom: view.zoom,
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },

      queenBridge,
      route: ROUTE,
      controlsFile: FILE,
      canvasFile: CANVAS_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      composedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function publishControlPacket(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_CONTROLS_VIEW_PACKET = clonePlain(packet);
    root.HEARTH_PLANETARY_VIEW_CONTROL_PACKET = clonePlain(packet);
    root.HEARTH_CONTROLS_LAST_DELTA_PACKET = clonePlain(packet);
    root.HEARTH_QUEEN_CONTROLS_VIEW_PACKET = clonePlain(packet);
    root.HEARTH_QUEEN_SUPERCONDUCTOR_VIEW_PACKET = clonePlain(packet);

    hearth.controlsViewPacket = clonePlain(packet);
    hearth.planetaryViewControlPacket = clonePlain(packet);
    hearth.controlsLastDeltaPacket = clonePlain(packet);
    hearth.queenControlsViewPacket = clonePlain(packet);
    hearth.queenSuperconductorViewPacket = clonePlain(packet);

    lab.hearthControlsViewPacket = clonePlain(packet);
    lab.hearthPlanetaryViewControlPacket = clonePlain(packet);
    lab.hearthQueenControlsViewPacket = clonePlain(packet);
  }

  function deliverControlPacketToCanvas(packet) {
    const canvas = readCanvasAuthority();

    if (!canvas.authority || !isObject(canvas.authority)) {
      state.canvasDeliveryStatus = "CANVAS_AUTHORITY_PENDING_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "WAITING_CANVAS_PUBLIC_CONTROL_RECEIVER";
      broadcastControlEvent(packet);
      updateDataset();

      return {
        delivered: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.canvasDeliveryReason
      };
    }

    const methods = [
      "receivePlanetaryControlPacket",
      "consumePlanetaryControlPacket",
      "receiveControlsPacket",
      "consumeControlsPacket",
      "receiveControlPacket",
      "consumeControlPacket",
      "receiveViewControlPacket",
      "consumeViewControlPacket",
      "receiveViewDelta",
      "applyViewDelta",
      "setView",
      "updateView"
    ];

    for (const method of methods) {
      if (!isFunction(canvas.authority[method])) continue;

      try {
        const result = canvas.authority[method](clonePlain(packet));

        state.canvasDeliveryStatus = "CONTROL_PACKET_DELIVERED_TO_CANVAS";
        state.canvasDeliveryMethod = method;
        state.canvasDeliveryReason = "CANVAS_PUBLIC_CONTROL_RECEIVER_CALLED";
        state.deliveryCount += 1;

        record("HEARTH_CONTROLS_QUEEN_PACKET_DELIVERED_TO_CANVAS", {
          method,
          canvasAuthoritySource: canvas.name,
          canvasContract: canvas.contract
        });

        if (result && isFunction(result.then)) {
          result.catch((error) => {
            recordError("HEARTH_CONTROLS_QUEEN_CANVAS_ASYNC_RECEIVER_FAILED", error, { method });
          });
        }

        broadcastControlEvent(packet);
        updateDataset();

        return {
          delivered: true,
          method,
          reason: state.canvasDeliveryReason
        };
      } catch (error) {
        recordError("HEARTH_CONTROLS_QUEEN_CANVAS_RECEIVER_FAILED", error, { method });
      }
    }

    state.canvasDeliveryStatus = "CANVAS_CONTROL_RECEIVER_NOT_FOUND_PACKET_PUBLISHED";
    state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
    state.canvasDeliveryReason = "CANVAS_PUBLIC_CONTROL_RECEIVER_MISSING";
    broadcastControlEvent(packet);
    updateDataset();

    return {
      delivered: false,
      method: "GLOBAL_PACKET_PUBLICATION",
      reason: state.canvasDeliveryReason
    };
  }

  function broadcastControlEvent(packet) {
    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:planetary-view-control", { detail: clonePlain(packet) }));
        doc.dispatchEvent(new root.CustomEvent("hearth:queen-view-control", { detail: clonePlain(packet) }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:planetary-view-control", { detail: clonePlain(packet) }));
        root.dispatchEvent(new root.CustomEvent("hearth:queen-view-control", { detail: clonePlain(packet) }));
      }
    } catch (_error) {}
  }

  function composeDiagnosticFields() {
    const admitted = state.inputAdmissionOpen === true;
    const bound = input.bound === true;
    const present = true;
    const handshakeStatus = state.handshakeStatus;

    return {
      PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE: "true",
      PLANETARY_CONTROL_FOOTPRINT_STATUS: admitted ? "CONTROL_RUNTIME_ACTIVE" : "CONTROL_FILE_PRESENT_WAITING_HANDSHAKE",
      PLANETARY_CONTROL_DIAGNOSTIC_STATUS: state.controlStatus,
      PLANETARY_CONTROL_GATE_STATUS: admitted ? "CONTROL_GATE_OPEN" : "CONTROL_GATE_WAITING_HANDSHAKE",

      EXPECTED_CONTROL_FILE: FILE,
      EXPECTED_CONTROL_CONTRACT: CONTRACT,
      CONTROL_FILE: FILE,
      CONTROL_FILE_PRESENT: String(present),
      CONTROL_FILE_SRC: FILE,
      CONTROL_FILE_CONTRACT: CONTRACT,
      CONTROL_FILE_RECEIPT: RECEIPT,
      CONTROL_FILE_AUTHORITY_SOURCE: "HEARTH_CONTROLS_QUEEN",
      CONTROL_FILE_EXPECTED_NOT_YET_BUILT: "false",
      CONTROL_FILE_ABSENCE_EXPECTED: "false",
      CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5: "true",
      CONTROL_FILE_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET: "false",

      CONTROL_FILE_HANDSHAKE_STATUS: handshakeStatus,
      CONTROL_FILE_HANDSHAKE_REQUIRED: "true",
      CONTROL_FILE_HANDSHAKE_TARGET: FILE,
      CONTROL_FILE_HANDSHAKE_FUNNEL_OWNER: "ROUTE_CONDUCTOR",

      JS_INTEGRATION_FUNNEL: "INDEX_JS -> ROUTE_CONDUCTOR -> CONTROLS_QUEEN -> CANVAS",
      JS_INDEX_FILE: INDEX_FILE,
      JS_INDEX_CONTRACT: EXPECTED_INDEX_CONTRACT,
      JS_ROUTE_CONDUCTOR_FILE: ROUTE_CONDUCTOR_FILE,
      JS_ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract || ROUTE_CONDUCTOR_V9_8,
      JS_CONTROL_FILE: FILE,
      JS_CONTROL_CONTRACT: CONTRACT,
      JS_CANVAS_FILE: CANVAS_FILE,

      ROUTE_CONDUCTOR_CONTROL_INTEGRATION_STATUS: state.routeConductorControlIntegrationStatus,
      ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REQUIRED: "true",
      ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_TARGET: FILE,
      ROUTE_CONDUCTOR_CONTROL_FUNNEL_OWNER: "ROUTE_CONDUCTOR",

      QUEEN_CONTROL_BRIDGE_ACTIVE: "true",
      QUEEN_SUPERCONDUCTOR_LANGUAGE_ACTIVE: "true",
      QUEEN_OUTSIDE_CARDINAL_FUNCTIONALITY: "true",
      QUEEN_IS_BISHOP: "false",

      WEST_GATE_HIERARCHY_OBSERVED: String(Boolean(state.westGateHierarchyObserved)),
      WEST_GATE_HIERARCHY_AUTHORITY_SOURCE: state.westGateHierarchyAuthoritySource,
      WEST_GATE_HIERARCHY_CONTRACT: state.westGateHierarchyContract,
      HIERARCHY_REGISTRY_OBSERVED: String(Boolean(state.hierarchyRegistryObserved)),
      HIERARCHY_REGISTRY_CONTRACT: state.hierarchyRegistryContract,
      HIERARCHY_REGISTRY_STATUS: state.hierarchyRegistryStatus,
      CARDINAL_BISHOP_TERM_OWNED_BY_HIERARCHY_MAP: state.cardinalBishopTermOwnedByHierarchyMap,
      HIGH_BISHOP_TERM_REJECTED: state.highBishopTermRejected,
      QUEEN_EXCLUDED_FROM_CARDINAL_FUNCTIONALITY: state.queenExcludedFromCardinalFunctionality,
      PRIEST_NOT_BISHOP: state.priestNotBishop,
      POINTER_FINGER_FILE_CONFIRMED: state.pointerFingerFileConfirmed,
      POINTER_FINGER_FILE: POINTER_FINGER_FILE,

      LABWEST_SUPERCONDUCTOR_STATUS: state.labWestSuperconductorStatus,
      LABWEST_AUTHORITY_SOURCE: state.labWestAuthoritySource,
      LABWEST_CONTRACT: state.labWestContract,
      LABWEST_CONTRACT_RECOGNIZED_CURRENT: String(Boolean(state.labWestContractRecognizedCurrent)),
      LABWEST_CONTRACT_RECOGNIZED_COMPAT: String(Boolean(state.labWestContractRecognizedCompat)),
      BISHOP_CHORD_BRIDGE_ACTIVE: String(Boolean(state.bishopChordBridgeActive)),
      BISHOP_SUBJECT_FILE_DELEGATION_ACTIVE: String(Boolean(state.bishopSubjectFileDelegationActive)),
      WEST_KNOWS_BISHOPS_NOT_CHILDREN: String(Boolean(state.westKnowsBishopsNotChildren)),
      BISHOP_CHORD_STATUS: state.bishopChordStatus,
      BISHOP_CHORD_ADMISSIBLE: state.bishopChordAdmissible,
      FOUR_WAY_CANVAS_HANDOFF_ACTIVE: String(Boolean(state.fourWayCanvasHandoffActive)),
      CONTROLS_INSPECT_BISHOP_INTERNALS: "false",
      CONTROLS_INSPECT_SUBJECT_FILES: "false",
      CONTROLS_INSPECT_CHILD_FILES: "false",
      CONTROLS_INSPECT_FINGER_FILES: "false",

      PLANETARY_VIEW_CONTROL_STATUS: admitted ? (bound ? "PLANETARY_VIEW_CONTROL_ACTIVE" : "PLANETARY_VIEW_CONTROL_TARGET_PENDING") : "WAITING_ROUTE_CONDUCTOR_HANDSHAKE",
      PLANETARY_VIEW_TOUCH_STATUS: state.touchStatus,
      PLANETARY_VIEW_DRAG_STATUS: state.dragStatus,
      PLANETARY_VIEW_MOTION_STATUS: state.motionStatus,
      PLANETARY_VIEW_ZOOM_STATUS: state.zoomStatus,
      PLANETARY_VIEW_INPUT_STATUS: state.inputStatus,

      PLANETARY_FILES_TRACK_STATUS: "CONTROL_FILE_PRESENT",
      PLANETARY_FINGERS_TRACK_STATUS: "NOT_OWNED_BY_CONTROLS_BISHOPS_MANAGE_FINGER_LANGUAGE",
      PLANETARY_CANVAS_TRACK_STATUS: state.canvasObserved ? "CANVAS_AUTHORITY_OBSERVED" : "WAITING_CANVAS_AUTHORITY",
      PLANETARY_VIEW_TRACK_STATUS: admitted ? "VIEW_CONTROL_TRACK_ACTIVE" : "VIEW_CONTROL_TRACK_WAITING_HANDSHAKE",

      PLANETARY_CONTROL_RECOMMENDED_NEXT_FILE: admitted ? (bound ? "NONE" : CANVAS_FILE) : ROUTE_CONDUCTOR_FILE,
      PLANETARY_CONTROL_RECOMMENDED_NEXT_ACTION: admitted
        ? (bound ? "CONTROL_FILE_ACTIVE_OBSERVE_CANVAS_DELIVERY" : "VERIFY_CANVAS_CONTROL_TARGET")
        : "PUBLISH_ROUTE_CONDUCTOR_TO_CONTROLS_HANDSHAKE",

      CONTROL_INPUT_BOUND: String(bound),
      CONTROL_INPUT_TARGET_FOUND: String(state.inputTargetFound === true),
      CONTROL_INPUT_TARGET_DESCRIPTION: state.inputTargetDescription,
      CONTROL_CANVAS_DELIVERY_STATUS: state.canvasDeliveryStatus,
      CONTROL_CANVAS_DELIVERY_METHOD: state.canvasDeliveryMethod,
      CONTROL_CANVAS_DELIVERY_REASON: state.canvasDeliveryReason,
      CONTROL_PACKET_COUNT: String(state.packetCount),
      CONTROL_DELIVERY_COUNT: String(state.deliveryCount),

      f13Claimed: "false",
      f13CanvasClaimed: "false",
      f21EligibleForNorth: "false",
      f21ClaimedByControls: "false",
      f21ClaimedByDiagnosticRail: "false",
      readyTextAllowed: "false",
      readyTextClaimed: "false",
      visualPassClaimed: "false",
      generatedImage: "false",
      graphicBox: "false",
      webGL: "false"
    };
  }

  function updateDataset() {
    const fields = composeDiagnosticFields();

    setDataset("hearthControlsLoaded", "true");
    setDataset("hearthControlsPresent", "true");
    setDataset("hearthControlsContract", CONTRACT);
    setDataset("hearthControlsReceipt", RECEIPT);
    setDataset("hearthControlsInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthControlsInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthControlsVersion", VERSION);

    setDataset("hearthControlFilePresent", fields.CONTROL_FILE_PRESENT);
    setDataset("hearthControlFile", FILE);
    setDataset("hearthControlFileContract", CONTRACT);
    setDataset("hearthControlFileReceipt", RECEIPT);
    setDataset("hearthControlFileExpectedNotYetBuilt", "false");
    setDataset("hearthControlFileAbsenceExpected", "false");
    setDataset("hearthControlAbsenceNotTreatedAsCase5", "true");

    setDataset("hearthControlHandshakeStatus", state.handshakeStatus);
    setDataset("hearthControlHandshakeRequired", "true");
    setDataset("hearthControlHandshakeTarget", FILE);
    setDataset("hearthControlHandshakeFunnelOwner", "ROUTE_CONDUCTOR");

    setDataset("hearthPlanetaryControlLifecycleSchemaActive", "true");
    setDataset("hearthPlanetaryControlFootprintStatus", fields.PLANETARY_CONTROL_FOOTPRINT_STATUS);
    setDataset("hearthPlanetaryControlDiagnosticStatus", state.controlStatus);
    setDataset("hearthPlanetaryControlGateStatus", fields.PLANETARY_CONTROL_GATE_STATUS);

    setDataset("hearthQueenControlBridgeActive", "true");
    setDataset("hearthQueenSuperconductorLanguageActive", "true");
    setDataset("hearthQueenOutsideCardinalFunctionality", "true");
    setDataset("hearthQueenIsBishop", "false");

    setDataset("hearthControlsWestGateHierarchyObserved", String(Boolean(state.westGateHierarchyObserved)));
    setDataset("hearthControlsWestGateHierarchyAuthoritySource", state.westGateHierarchyAuthoritySource);
    setDataset("hearthControlsWestGateHierarchyContract", state.westGateHierarchyContract);
    setDataset("hearthControlsHierarchyRegistryObserved", String(Boolean(state.hierarchyRegistryObserved)));
    setDataset("hearthControlsHierarchyRegistryContract", state.hierarchyRegistryContract);
    setDataset("hearthControlsHierarchyRegistryReceipt", state.hierarchyRegistryReceipt);
    setDataset("hearthControlsHierarchyRegistryStatus", state.hierarchyRegistryStatus);
    setDataset("hearthControlsCardinalBishopTermOwnedByHierarchyMap", state.cardinalBishopTermOwnedByHierarchyMap);
    setDataset("hearthControlsHighBishopTermRejected", state.highBishopTermRejected);
    setDataset("hearthControlsQueenExcludedFromCardinalFunctionality", state.queenExcludedFromCardinalFunctionality);
    setDataset("hearthControlsPriestNotBishop", state.priestNotBishop);
    setDataset("hearthControlsPointerFingerFileConfirmed", state.pointerFingerFileConfirmed);
    setDataset("hearthControlsPointerFingerFile", POINTER_FINGER_FILE);

    setDataset("hearthControlsInspectBishopInternals", "false");
    setDataset("hearthControlsInspectSubjectFiles", "false");
    setDataset("hearthControlsInspectChildFiles", "false");
    setDataset("hearthControlsInspectFingerFiles", "false");
    setDataset("hearthControlsLabWestSuperconductorStatus", state.labWestSuperconductorStatus);
    setDataset("hearthControlsLabWestAuthoritySource", state.labWestAuthoritySource);
    setDataset("hearthControlsLabWestContract", state.labWestContract);
    setDataset("hearthControlsLabWestContractRecognizedCurrent", String(Boolean(state.labWestContractRecognizedCurrent)));
    setDataset("hearthControlsLabWestContractRecognizedCompat", String(Boolean(state.labWestContractRecognizedCompat)));
    setDataset("hearthControlsBishopChordBridgeActive", String(Boolean(state.bishopChordBridgeActive)));
    setDataset("hearthControlsBishopSubjectFileDelegationActive", String(Boolean(state.bishopSubjectFileDelegationActive)));
    setDataset("hearthControlsWestKnowsBishopsNotChildren", String(Boolean(state.westKnowsBishopsNotChildren)));
    setDataset("hearthControlsBishopChordStatus", state.bishopChordStatus);
    setDataset("hearthControlsFourWayCanvasHandoffActive", String(Boolean(state.fourWayCanvasHandoffActive)));

    setDataset("hearthJsIntegrationFunnel", fields.JS_INTEGRATION_FUNNEL);
    setDataset("hearthRouteConductorControlIntegrationStatus", state.routeConductorControlIntegrationStatus);
    setDataset("hearthRouteConductorControlHandshakeRequired", "true");
    setDataset("hearthRouteConductorControlHandshakeTarget", FILE);

    setDataset("hearthPlanetaryViewControlStatus", fields.PLANETARY_VIEW_CONTROL_STATUS);
    setDataset("hearthPlanetaryViewTouchStatus", state.touchStatus);
    setDataset("hearthPlanetaryViewDragStatus", state.dragStatus);
    setDataset("hearthPlanetaryViewMotionStatus", state.motionStatus);
    setDataset("hearthPlanetaryViewZoomStatus", state.zoomStatus);
    setDataset("hearthPlanetaryViewInputStatus", state.inputStatus);

    setDataset("hearthControlInputBound", String(input.bound === true));
    setDataset("hearthControlInputTargetFound", String(state.inputTargetFound === true));
    setDataset("hearthControlCanvasDeliveryStatus", state.canvasDeliveryStatus);
    setDataset("hearthControlPacketCount", String(state.packetCount));
    setDataset("hearthControlDeliveryCount", String(state.deliveryCount));

    setDataset("hearthControlsF13Claimed", "false");
    setDataset("hearthControlsF13CanvasClaimed", "false");
    setDataset("hearthControlsF21EligibleForNorth", "false");
    setDataset("hearthControlsF21Claimed", "false");
    setDataset("hearthControlsReadyTextAllowed", "false");
    setDataset("hearthControlsVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function composeReceiptLight() {
    const diagnosticFields = composeDiagnosticFields();
    const queenBridge = composeQueenBridgeContext();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      canvasFile: CANVAS_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      labWestFile: LABWEST_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      packetType: "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT",
      queenPacketType: "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_RECEIPT",
      role: "queen-planetary-view-input-handshake-controls",

      loaded: state.loaded,
      booted: state.booted,
      disposed: state.disposed,
      controlStatus: state.controlStatus,

      handshakeRequired: true,
      handshakePacketType: HANDSHAKE_PACKET,
      handshakeStatus: state.handshakeStatus,
      handshakeAccepted: state.handshakeAccepted,
      handshakeRejected: state.handshakeRejected,
      handshakeSource: state.handshakeSource,
      handshakeRejectionReason: state.handshakeRejectionReason,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorAuthoritySource: state.routeConductorAuthoritySource,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorContractRecognized: state.routeConductorContractRecognized,
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      routeConductorControlIntegrationStatus: state.routeConductorControlIntegrationStatus,

      queenBridge,
      labWestCurrentContractExpected: LABWEST_CURRENT_CONTRACT,
      labWestCompatContractAccepted: LABWEST_COMPAT_CONTRACT,
      hierarchyRegistryContractExpected: HIERARCHY_REGISTRY_CONTRACT,

      inputAdmissionOpen: state.inputAdmissionOpen,
      inputBound: input.bound,
      inputTargetFound: state.inputTargetFound,
      inputTargetDescription: state.inputTargetDescription,

      touchStatus: state.touchStatus,
      dragStatus: state.dragStatus,
      motionStatus: state.motionStatus,
      zoomStatus: state.zoomStatus,
      keyboardStatus: state.keyboardStatus,
      inputStatus: state.inputStatus,

      viewState: {
        yaw: view.yaw,
        pitch: view.pitch,
        zoom: view.zoom,
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },

      canvasObserved: state.canvasObserved,
      canvasAuthoritySource: state.canvasAuthoritySource,
      canvasContract: state.canvasContract,
      canvasReceipt: state.canvasReceipt,
      canvasDeliveryStatus: state.canvasDeliveryStatus,
      canvasDeliveryMethod: state.canvasDeliveryMethod,
      canvasDeliveryReason: state.canvasDeliveryReason,

      lastInputType: state.lastInputType,
      lastDeltaPacket: clonePlain(state.lastDeltaPacket),
      packetCount: state.packetCount,
      deliveryCount: state.deliveryCount,
      rejectionCount: state.rejectionCount,
      watchdogTicks: state.watchdogTicks,
      latestEvent: state.latestEvent,
      errorCount: state.errors.length,

      diagnosticFields: clonePlain(diagnosticFields),
      ...diagnosticFields,

      supportsRouteConductorHandshake: true,
      supportsRouteConductorV98ControlAdmission: true,
      supportsRouteConductorV97ControlHandshakeIntegration: true,
      supportsPlanetaryViewInput: true,
      supportsPointerDrag: true,
      supportsTouchDrag: true,
      supportsWheelZoom: true,
      supportsKeyboardViewControl: true,
      supportsCanvasPublicPacketDelivery: true,
      supportsDiagnosticControlFootprint: true,
      supportsQueenWestGateHierarchyLanguage: true,
      supportsLabWestBishopChordLanguage: true,
      supportsBishopContextAdmission: true,
      supportsWestGateHierarchyContextAdmission: true,

      ownsInputAdmission: true,
      ownsPointerInput: true,
      ownsTouchInput: true,
      ownsDragInput: true,
      ownsWheelInput: true,
      ownsKeyboardInput: true,
      ownsPlanetaryViewControlDeltas: true,
      ownsControlReceiptPublication: true,

      ownsHtmlShell: false,
      ownsIndexButtonAuthority: false,
      ownsEastPriestAuthority: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsWestGateHierarchyTruth: false,
      ownsBishopImplementationTruth: false,
      ownsBishopSubjectFiles: false,
      ownsBishopChildFiles: false,
      ownsFingerFiles: false,
      ownsCanvasDrawing: false,
      ownsCanvasExpressionTruth: false,
      ownsCanvasFingerTruth: false,
      ownsPlanetTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsMacroWestRelease: false,
      ownsNorthF21Latch: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) refresh();
    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...composeReceiptLight(),
      handshakePacket: clonePlain(state.handshakePacket),
      lastViewPacket: clonePlain(state.lastViewPacket),
      lastBishopContextPacket: clonePlain(state.lastBishopContextPacket),
      lastHierarchyRegistry: clonePlain(state.lastHierarchyRegistry),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_PLANETARY_VIEW_INPUT_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      line("routeConductorFile", ROUTE_CONDUCTOR_FILE),
      line("canvasFile", CANVAS_FILE),
      line("pointerFingerFile", POINTER_FINGER_FILE),
      "",
      "HANDSHAKE",
      line("handshakeRequired", true),
      line("handshakeStatus", r.handshakeStatus),
      line("handshakeAccepted", r.handshakeAccepted),
      line("handshakeRejected", r.handshakeRejected),
      line("handshakeSource", r.handshakeSource),
      line("handshakeRejectionReason", r.handshakeRejectionReason),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorAuthoritySource", r.routeConductorAuthoritySource),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorControlIntegrationStatus", r.routeConductorControlIntegrationStatus),
      "",
      "QUEEN_WEST_GATE_HIERARCHY",
      line("queenControlBridgeActive", true),
      line("queenSuperconductorLanguageActive", true),
      line("queenOutsideCardinalFunctionality", true),
      line("queenIsBishop", false),
      line("westGateHierarchyObserved", state.westGateHierarchyObserved),
      line("westGateHierarchyAuthoritySource", state.westGateHierarchyAuthoritySource),
      line("hierarchyRegistryObserved", state.hierarchyRegistryObserved),
      line("hierarchyRegistryContract", state.hierarchyRegistryContract),
      line("cardinalBishopTermOwnedByHierarchyMap", state.cardinalBishopTermOwnedByHierarchyMap),
      line("highBishopTermRejected", state.highBishopTermRejected),
      line("queenExcludedFromCardinalFunctionality", state.queenExcludedFromCardinalFunctionality),
      line("priestNotBishop", state.priestNotBishop),
      line("pointerFingerFileConfirmed", state.pointerFingerFileConfirmed),
      "",
      "LABWEST_SUPERCONDUCTOR",
      line("labWestObserved", state.labWestObserved),
      line("labWestAuthoritySource", state.labWestAuthoritySource),
      line("labWestContract", state.labWestContract),
      line("labWestContractRecognizedCurrent", state.labWestContractRecognizedCurrent),
      line("labWestContractRecognizedCompat", state.labWestContractRecognizedCompat),
      line("bishopChordBridgeActive", state.bishopChordBridgeActive),
      line("bishopSubjectFileDelegationActive", state.bishopSubjectFileDelegationActive),
      line("westKnowsBishopsNotChildren", state.westKnowsBishopsNotChildren),
      line("bishopChordStatus", state.bishopChordStatus),
      line("fourWayCanvasHandoffActive", state.fourWayCanvasHandoffActive),
      line("controlsInspectBishopInternals", false),
      line("controlsInspectSubjectFiles", false),
      line("controlsInspectChildFiles", false),
      line("controlsInspectFingerFiles", false),
      "",
      "INPUT",
      line("inputAdmissionOpen", r.inputAdmissionOpen),
      line("inputBound", r.inputBound),
      line("inputTargetFound", r.inputTargetFound),
      line("inputTargetDescription", r.inputTargetDescription),
      line("touchStatus", r.touchStatus),
      line("dragStatus", r.dragStatus),
      line("motionStatus", r.motionStatus),
      line("zoomStatus", r.zoomStatus),
      line("keyboardStatus", r.keyboardStatus),
      line("inputStatus", r.inputStatus),
      "",
      "CANVAS_DELIVERY",
      line("canvasObserved", r.canvasObserved),
      line("canvasAuthoritySource", r.canvasAuthoritySource),
      line("canvasContract", r.canvasContract),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("canvasDeliveryMethod", r.canvasDeliveryMethod),
      line("canvasDeliveryReason", r.canvasDeliveryReason),
      line("packetCount", r.packetCount),
      line("deliveryCount", r.deliveryCount),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f13CanvasClaimed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByControls", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      "POSTGAME",
      line("status", r.controlStatus),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_PLANETARY_VIEW_INPUT_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("controlStatus", r.controlStatus),
      line("handshakeStatus", r.handshakeStatus),
      line("inputAdmissionOpen", r.inputAdmissionOpen),
      line("inputBound", r.inputBound),
      line("inputStatus", r.inputStatus),
      line("labWestSuperconductorStatus", state.labWestSuperconductorStatus),
      line("hierarchyRegistryStatus", state.hierarchyRegistryStatus),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("packetCount", r.packetCount),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      view: clonePlain(view),
      input: {
        bound: input.bound,
        pointerActive: input.pointerActive,
        pointerId: input.pointerId,
        targetDescription: state.inputTargetDescription
      }
    };
  }

  function getViewPacket() {
    return clonePlain(state.lastViewPacket || composeViewDeltaPacket({
      inputType: "view-state-read",
      deltaYaw: 0,
      deltaPitch: 0,
      deltaZoom: 0
    }));
  }

  function getQueenBridgeState() {
    return clonePlain(composeQueenBridgeContext());
  }

  function refresh() {
    readRouteConductorAuthority();
    readCanvasAuthority();
    readLabWestBishopBridge();

    if (!state.handshakeAccepted) {
      observeHandshake();
    } else if (!input.bound) {
      bindInputIfAdmitted();
    }

    updateInputState();
    updateDataset();
    publishGlobals("refresh");
    return getReceiptLight(false);
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    unbindInput();

    state.disposed = true;
    state.controlStatus = CONTROL_STATUS.DISPOSED;
    state.inputAdmissionOpen = false;
    state.handshakeStatus = state.handshakeAccepted
      ? state.handshakeStatus
      : HANDSHAKE_STATUS.WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE;

    updateInputState();
    updateDataset();

    record("HEARTH_CONTROLS_QUEEN_DISPOSED", { reason });
    publishGlobals("dispose");
    return getReceipt();
  }

  function startWatchdog() {
    if (!root.setInterval || watchdogTimer) return;

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      readLabWestBishopBridge();

      if (!state.handshakeAccepted) {
        observeHandshake();
      } else if (!input.bound) {
        bindInputIfAdmitted();
      } else {
        refresh();
      }

      if (state.watchdogTicks >= 60 || state.disposed) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;

        record("HEARTH_CONTROLS_QUEEN_WATCHDOG_STOPPED", {
          watchdogTicks: state.watchdogTicks,
          handshakeAccepted: state.handshakeAccepted,
          inputBound: input.bound
        });
      }
    }, 900);
  }

  function publishGlobals(reason = "publish-globals") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_CONTROLS = api;
    root.HEARTH_PLANETARY_CONTROLS = api;
    root.HEARTH_CONTROL_FILE = api;
    root.HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE = api;
    root.HEARTH_CONTROLS_QUEEN = api;
    root.HEARTH_QUEEN_CONTROLS = api;
    root.HEARTH_QUEEN_SUPERCONDUCTOR_CONTROLS = api;
    root.HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY = api;

    hearth.controls = api;
    hearth.planetaryControls = api;
    hearth.controlFile = api;
    hearth.hearthControls = api;
    hearth.controlsPlanetaryViewInputHandshake = api;
    hearth.controlsQueen = api;
    hearth.queenControls = api;
    hearth.queenSuperconductorControls = api;
    hearth.controlsQueenWestGateHierarchy = api;

    lab.hearthControls = api;
    lab.hearthPlanetaryControls = api;
    lab.hearthControlFile = api;
    lab.hearthQueenControls = api;
    lab.hearthQueenSuperconductorControls = api;
    lab.hearthControlsQueenWestGateHierarchy = api;

    const receipt = getReceiptLight(false);

    root.HEARTH_CONTROLS_RECEIPT = receipt;
    root.HEARTH_PLANETARY_CONTROLS_RECEIPT = receipt;
    root.HEARTH_CONTROL_FILE_RECEIPT = receipt;
    root.HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT = receipt;
    root.HEARTH_CONTROLS_QUEEN_RECEIPT = receipt;
    root.HEARTH_QUEEN_CONTROLS_RECEIPT = receipt;
    root.HEARTH_QUEEN_SUPERCONDUCTOR_CONTROLS_RECEIPT = receipt;
    root.HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_RECEIPT = receipt;

    hearth.controlsReceipt = receipt;
    hearth.planetaryControlsReceipt = receipt;
    hearth.controlFileReceipt = receipt;
    hearth.controlsQueenReceipt = receipt;
    hearth.queenControlsReceipt = receipt;
    hearth.controlsQueenWestGateHierarchyReceipt = receipt;

    lab.hearthControlsReceipt = receipt;
    lab.hearthPlanetaryControlsReceipt = receipt;
    lab.hearthQueenControlsReceipt = receipt;
    lab.hearthControlsQueenWestGateHierarchyReceipt = receipt;

    root.HEARTH_CONTROLS_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);
    root.HEARTH_CONTROLS_QUEEN_BRIDGE_STATE = getQueenBridgeState();
    hearth.controlsDiagnosticFields = clonePlain(receipt.diagnosticFields);
    hearth.controlsQueenBridgeState = getQueenBridgeState();

    updateDataset();

    if (reason !== "view-delta") {
      record("HEARTH_CONTROLS_QUEEN_GLOBALS_PUBLISHED", {
        reason,
        contract: CONTRACT,
        handshakeStatus: state.handshakeStatus,
        inputBound: input.bound
      });
    }

    return true;
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;

      publishGlobals("boot-early");
      readLabWestBishopBridge();
      observeHandshake();

      state.booted = true;
      state.booting = false;

      refresh();
      startWatchdog();

      record("HEARTH_CONTROLS_QUEEN_BOOTED", {
        contract: CONTRACT,
        file: FILE,
        handshakeStatus: state.handshakeStatus,
        inputAdmissionOpen: state.inputAdmissionOpen,
        inputBound: input.bound,
        queenSuperconductorLanguageActive: true,
        queenOutsideCardinalFunctionality: true,
        visualPassClaimed: false
      });

      publishGlobals("boot-complete");
      return getReceipt();
    });

    return bootPromise;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    canvasFile: CANVAS_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    labWestFile: LABWEST_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    controlPacket: CONTROL_PACKET,
    handshakePacket: HANDSHAKE_PACKET,
    queenPacket: QUEEN_PACKET,

    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
    labWestCurrentContract: LABWEST_CURRENT_CONTRACT,
    labWestCurrentReceipt: LABWEST_CURRENT_RECEIPT,
    labWestCompatContract: LABWEST_COMPAT_CONTRACT,
    labWestCompatReceipt: LABWEST_COMPAT_RECEIPT,
    hierarchyRegistryContract: HIERARCHY_REGISTRY_CONTRACT,
    hierarchyRegistryReceipt: HIERARCHY_REGISTRY_RECEIPT,

    boot,
    start: boot,
    init: boot,
    run: boot,
    refresh,
    dispose,

    observeHandshake,
    receiveRouteConductorControlHandshake,
    receiveControlHandshake,
    consumeRouteConductorControlHandshake,
    consumeControlHandshake,

    receiveBishopChordContext,
    consumeBishopChordContext,
    receiveWestGateHierarchyContext,
    consumeWestGateHierarchyContext,
    readLabWestBishopBridge,
    readHierarchyRegistry,
    getQueenBridgeState,

    bindInputIfAdmitted,
    unbindInput,
    applyViewDelta,
    composeViewDeltaPacket,
    deliverControlPacketToCanvas,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    getState,
    getViewPacket,
    composeDiagnosticFields,

    supportsRouteConductorHandshake: true,
    supportsRouteConductorV98ControlAdmission: true,
    supportsRouteConductorV97ControlHandshakeIntegration: true,
    supportsPlanetaryViewInput: true,
    supportsPointerDrag: true,
    supportsTouchDrag: true,
    supportsWheelZoom: true,
    supportsKeyboardViewControl: true,
    supportsCanvasPublicPacketDelivery: true,
    supportsDiagnosticControlFootprint: true,
    supportsQueenWestGateHierarchyLanguage: true,
    supportsLabWestBishopChordLanguage: true,
    supportsBishopContextAdmission: true,
    supportsWestGateHierarchyContextAdmission: true,

    ownsInputAdmission: true,
    ownsPointerInput: true,
    ownsTouchInput: true,
    ownsDragInput: true,
    ownsWheelInput: true,
    ownsKeyboardInput: true,
    ownsPlanetaryViewControlDeltas: true,
    ownsControlReceiptPublication: true,

    ownsHtmlShell: false,
    ownsIndexButtonAuthority: false,
    ownsEastPriestAuthority: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsWestGateHierarchyTruth: false,
    ownsBishopImplementationTruth: false,
    ownsBishopSubjectFiles: false,
    ownsBishopChildFiles: false,
    ownsFingerFiles: false,
    ownsCanvasDrawing: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasFingerTruth: false,
    ownsPlanetTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsMacroWestRelease: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    queenOutsideCardinalFunctionality: true,
    queenIsBishop: false,
    controlsInspectBishopInternals: false,
    controlsInspectSubjectFiles: false,
    controlsInspectChildFiles: false,
    controlsInspectFingerFiles: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  publishGlobals("immediate-publication");

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
