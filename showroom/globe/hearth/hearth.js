// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5
// Full-file replacement.
// Route Conductor / Canvas Expression Hub / Visible Globe Proof Ingestion.
// Purpose:
// - Preserve accepted v9_4 route-conductor bridge machinery.
// - Preserve v9_4 as previous lineage and compatibility surface for existing Canvas parent release expectations.
// - Update the Route Conductor to recognize the current Canvas spread:
//   Local Station -> Diagnostic Bridge -> Expression Hub -> Finger Manager -> Visible Base Globe Carrier.
// - Consume current Canvas expression hub and visible-globe receipts by contract OR lawful proof shape.
// - Publish visible planet proof into the route receipt and route datasets.
// - Preserve Route Conductor ownership boundaries: summary ingestion, release coordination, chronology, receipt publication.
// - Preserve Canvas ownership boundaries: drawing, visible carrier construction, expression truth.
// - Preserve finger ownership boundaries: downstream finger truth remains in finger files.
// - Never claim F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - visible control binding
// - diagnostic rail case selection
// - Canvas drawing
// - Canvas child truth
// - Canvas finger truth
// - East atlas truth
// - West inspection truth
// - South visible proof truth
// - Macro West admissibility truth
// - North F21 latch
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5";

  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const PREVIOUS_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const COMPAT_ROUTE_CONDUCTOR_CONTRACT = PREVIOUS_CONTRACT;
  const COMPAT_ROUTE_CONDUCTOR_RECEIPT = PREVIOUS_RECEIPT;

  const LINEAGE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3";
  const LINEAGE_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3";

  const LEGACY_NORTH_STAR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2";
  const LEGACY_NORTH_STAR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT_v9_2";

  const BASELINE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT_TNT_v8_2";
  const VERSION = "2026-06-03.hearth-route-conductor-canvas-expression-hub-visible-globe-proof-ingestion-v9-5";

  const FILE = "/showroom/globe/hearth/hearth.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const MACRO_WEST_FILE = "/assets/lab/runtime-table.west.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";

  const FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
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
    "landform",
    "elevation",
    "material",
    "hydrology",
    "atmosphere",
    "lighting",
    "composite"
  ]);

  const CARDINALS = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS"
  });

  const CYCLE_ROUTES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS"
  });

  const STATION_IDS = Object.freeze({
    INDEX_HOST: "INDEX_HOST",
    ROUTE_F8: "ROUTE_F8_SELF_DUTY",
    MACRO_WEST: "MACRO_WEST_ADMISSIBILITY",
    CANVAS_HUB: "CANVAS_EXPRESSION_HUB",
    VISIBLE_GLOBE: "VISIBLE_BASE_GLOBE_PROOF",
    FINGERS: "DOWNSTREAM_FINGER_TRACKS",
    NORTH_F21: "NORTH_F21_ELIGIBILITY_BOUNDARY"
  });

  const CHRONOLOGY = Object.freeze([
    STATION_IDS.INDEX_HOST,
    STATION_IDS.ROUTE_F8,
    STATION_IDS.MACRO_WEST,
    STATION_IDS.CANVAS_HUB,
    STATION_IDS.VISIBLE_GLOBE,
    STATION_IDS.FINGERS,
    STATION_IDS.NORTH_F21
  ]);

  const ACTIVE_CANVAS_CONTRACTS = Object.freeze([
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

  const FINAL_FALSE = Object.freeze({
    f21EligibleForNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByRouteConductor: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  const WATCHDOG_INTERVAL_MS = 1800;
  const WATCHDOG_MAX_TICKS = 24;

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
    compatibilityRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
    compatibilityRouteConductorReceipt: COMPAT_ROUTE_CONDUCTOR_RECEIPT,
    lineageContract: LINEAGE_CONTRACT,
    lineageReceipt: LINEAGE_RECEIPT,
    legacyNorthStarContract: LEGACY_NORTH_STAR_CONTRACT,
    legacyNorthStarReceipt: LEGACY_NORTH_STAR_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: "route-conductor-canvas-expression-hub-visible-globe-proof-ingestion",

    routeConductorAuthorityCardinal: CARDINALS.NORTH,
    activeCycleInputCardinal: CARDINALS.SOUTH,
    activeCycleHandoffTarget: CARDINALS.WEST,
    activeCycleNumber: 2,
    activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
    activeFibonacci: "F8",
    activeStageId: "F8_ROUTE_CONDUCTOR_VISIBLE_GLOBE_PROOF_INGESTION",
    activeGearId: "F8_ROUTE_CONDUCTOR_VISIBLE_GLOBE_PROOF_INGESTION",

    routeConductorMarkerPresent: false,
    routeConductorApiPresent: false,
    routeConductorReceiptPresent: false,
    routeConductorRuntimeActive: false,
    routeF8GateReady: false,

    indexAuthorityObserved: false,
    indexPairReady: false,
    indexMountPresent: false,
    carrierHostAdmissibilityReady: false,
    carrierHostAdmissibilityPacketReady: false,
    indexHandoffToRouteConductor: false,
    indexHoldReason: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",

    macroWestAuthorityObserved: false,
    macroWestAdmissibilityObserved: false,
    macroWestMethodUsed: "NONE",
    macroWestContract: "",
    westDecision: "UNKNOWN",
    westHardBlock: false,
    westForwardAllowed: false,
    westCanvasReleaseApproved: false,
    westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION",
    westRecommendedNextRenewalTarget: MACRO_WEST_FILE,

    canvasAuthorityObserved: false,
    canvasAuthoritySourceName: "NONE",
    canvasSummaryObserved: false,
    canvasSummaryMethod: "NONE",
    canvasSummaryAcceptedByContract: false,
    canvasSummaryAcceptedByShape: false,
    canvasSummaryShapeTrusted: false,
    canvasContractAccepted: false,
    canvasBaselineOnly: false,

    currentCanvasParentObserved: false,
    currentCanvasParentContractObserved: false,
    currentCanvasParentContract: "",
    currentCanvasParentReceipt: "",
    currentCanvasParentIsLocalStation: false,
    currentCanvasParentIsExpressionHub: false,
    currentCanvasParentIsFingerManager: false,
    currentCanvasParentIsVisibleBaseGlobeCarrier: false,
    canvasParentBootMethodAvailable: false,

    expressionHubActive: false,
    canvasExpressionHubActive: false,
    fingerManagerActive: false,
    canvasFingerManagerActive: false,
    fingerRegistryActive: false,
    namedFingerFilesEmbedded: false,
    downstreamFingerTracksDeclared: false,

    visibleBaseGlobeCarrierActive: false,
    canvasVisibleBaseGlobeCarrierActive: false,
    canvasMounted: false,
    canvasDrawComplete: false,
    baseGlobeDrawComplete: false,
    baseGlobeVisibleCarrierReady: false,
    visibleGlobeCarrierReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofIngestedByRoute: false,
    visiblePlanetReceiptObserved: false,

    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,
    anyFingerTrackActive: false,
    allDeclaredFingerTracksReady: false,
    firstFingerGap: "WAITING_FIRST_DOWNSTREAM_FINGER_FILE",
    firstFingerGapFile: FINGER_FILES.boundary,
    nextFingerKey: "boundary",
    nextFingerFile: FINGER_FILES.boundary,

    canvasParentReleaseAccepted: false,
    canvasParentReleaseObserved: false,
    parentReleaseLawful: false,
    parentAcceptedRouteConductorRelease: false,
    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,
    eastDispatchAuthorized: false,
    eastDispatchPacketPublished: false,

    canvasEastApiReady: false,
    canvasEastEvidenceReady: false,
    canvasWestApiReady: false,
    canvasWestInspectionReady: false,
    canvasSouthApiReady: false,
    canvasSouthVisibleProofReady: false,
    allCanvasChildrenApiReady: false,
    allCanvasChildrenEvidenceReady: false,
    allCanvasChildrenReady: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_VISIBLE_BASE_GLOBE_PROOF",
    f13StrictEvidenceRepairTarget: CANVAS_FILE,
    degradedF13IsFunctional: false,
    strictVisualProofPending: false,
    functionalPageObserved: false,

    indexGateReady: false,
    routeF8GateReady: false,
    macroWestGateReady: false,
    canvasHubGateReady: false,
    visibleGlobeGateReady: false,
    fingerTrackGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,

    chronologicalGateCount: CHRONOLOGY.length,
    chronologicalGatesSatisfied: 0,
    chronologicalFirstFailedGate: STATION_IDS.INDEX_HOST,
    chronologicalFirstFailedCoordinate: "WAITING_BOOT",

    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationExpected: 100,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,
    fibonacciSynchronizationHardFail: false,
    fibonacciSynchronizationHoldReason: "WAITING_BOOT",

    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseHeldReason: "WAITING_CANVAS_RELEASE_AUTHORIZATION",
    canvasReleasePacketPublished: false,
    canvasReleaseDeliveryInProgress: false,
    canvasSummaryReceiveInProgress: false,
    canvasReleasePacketDelivered: false,
    canvasReleaseDeliveryMethod: "NONE",
    canvasReleaseAcceptedByCanvas: false,
    lastCanvasReleasePacketSignature: "",

    f21LatchMode: "WAITING_VISIBLE_GLOBE_PROOF_CHAIN",
    northRepairRequired: false,
    northRepairReason: "NONE",

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    canvasNextAuditTarget: CANVAS_FILE,
    postgameStatus: "LOADED",

    currentPacket: null,
    currentReceipt: null,
    currentReceiptText: "",
    currentCanvasSummary: null,
    currentCanvasReleasePacket: null,
    currentCompatibilityReceipt: null,
    stationBoard: null,

    booted: false,
    booting: false,
    watchdogTicks: 0,
    passiveObservationTicks: 0,
    renderCount: 0,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_ROUTE_CONDUCTOR_V9_5_LOADED",
    localEvents: [],
    errors: [],

    ...FINAL_FALSE
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
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
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

  function upperText(value) {
    return safeString(value).trim().toUpperCase();
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimLog(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
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
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return { name, value: found };
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

  function stableStringify(value) {
    const seen = new WeakSet();

    function sortObject(input) {
      if (!input || typeof input !== "object") return input;
      if (seen.has(input)) return "[Circular]";
      seen.add(input);

      if (Array.isArray(input)) return input.map(sortObject);

      const out = {};
      Object.keys(input).sort().forEach((key) => {
        if (typeof input[key] === "function") return;
        out[key] = sortObject(input[key]);
      });
      return out;
    }

    try {
      return JSON.stringify(sortObject(value));
    } catch (_error) {
      return String(value || "");
    }
  }

  function packetSignature(packet) {
    if (!isObject(packet)) return "";
    return stableStringify({
      routeConductorContract: packet.routeConductorContract,
      routeConductorReceipt: packet.routeConductorReceipt,
      currentRouteConductorContract: packet.currentRouteConductorContract,
      sourceContract: packet.sourceContract,
      destinationFile: packet.destinationFile,
      targetFile: packet.targetFile,
      handoffTo: packet.handoffTo,
      canvasReleaseAuthorized: packet.canvasReleaseAuthorized,
      canvasReleasePacketReady: packet.canvasReleasePacketReady,
      westCanvasReleaseApproved: packet.westCanvasReleaseApproved,
      westHardBlock: packet.westHardBlock,
      carrierHostAdmissibilityReady: packet.carrierHostAdmissibilityReady,
      indexPairReady: packet.indexPairReady,
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute
    });
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getVisibleBaseGlobeReceipt",
      "getBaseGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getCanvasVisibleProofReceipt",
      "getExpressionHubReceipt",
      "getCanvasExpressionHubReceipt",
      "getExpressionHubSummary",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getReceiptLight",
      "getReceipt",
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
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? authority[method](false)
          : authority[method]();

        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.visibleBaseGlobeReceipt)) return authority.visibleBaseGlobeReceipt;
    if (isObject(authority.visiblePlanetReceipt)) return authority.visiblePlanetReceipt;
    if (isObject(authority.expressionHubReceipt)) return authority.expressionHubReceipt;
    if (isObject(authority.canvasExpressionHubReceipt)) return authority.canvasExpressionHubReceipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function mergeObjects(...items) {
    const out = {};

    for (const item of items) {
      if (!isObject(item)) continue;
      Object.keys(item).forEach((key) => {
        if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
          out[key] = item[key];
        }
      });
    }

    return out;
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_PREVIOUS_CONTRACT__ = PREVIOUS_CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_VISIBLE_GLOBE_PROOF_INGESTION__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;

    state.routeConductorMarkerPresent = true;
    updateDataset();
    return true;
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

    refs.stage = doc.querySelector("[data-hearth-stage-label]");
    refs.heartbeat = doc.querySelector("[data-hearth-heartbeat-text]");
    refs.latest = doc.querySelector("[data-hearth-latest-event]");
    refs.fill = doc.querySelector("[data-hearth-main-progress-fill]");
    refs.percent = doc.querySelector("[data-hearth-main-progress-percent]");
    refs.lanes = doc.querySelector("[data-hearth-lane-list]");
    refs.receiptBox = doc.querySelector("[data-hearth-receipt-box]");
    refs.receiptText = doc.querySelector("[data-hearth-receipt-text]");
    refs.status = doc.getElementById("hearth-route-status") || doc.querySelector("[data-hearth-route-status]");

    const mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]") ||
      doc.querySelector("[data-hearth-planet-stage]") ||
      doc.querySelector("[data-hearth-globe-stage]");

    const canvas = mount
      ? mount.querySelector("canvas")
      : doc.querySelector("canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true'],canvas");

    const rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;

    const canvasNonZero = Boolean(
      canvas &&
      (
        (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0) ||
        (rect && safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0)
      )
    );

    const datasetMounted = Boolean(
      datasetValue("hearthCanvasMounted") === "true" ||
      datasetValue("hearthCanvasBaseGlobeMounted") === "true" ||
      datasetValue("hearthCanvasVisibleBaseGlobeCarrierActive") === "true"
    );

    const datasetDraw = Boolean(
      datasetValue("hearthCanvasDrawComplete") === "true" ||
      datasetValue("hearthCanvasBaseGlobeDrawComplete") === "true" ||
      datasetValue("hearthCanvasVisiblePlanetProofReady") === "true"
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

  function readIndexAuthority() {
    const found = firstGlobal([
      "HEARTH_INDEX_JS",
      "HEARTH.indexJs",
      "HEARTH.indexBridge",
      "HEARTH.frontendButtonAuthorityReset",
      "DEXTER_LAB.hearthIndexJs",
      "DEXTER_LAB.hearthFrontendButtonAuthorityReset",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
      "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET"
    ]);

    const receipt = readReceipt(found.value) || {};
    const dom = scanDomForVisibleCanvas();

    const observed = Boolean(
      found.value ||
      receipt.contract ||
      datasetValue("hearthIndexJsLoaded") === "true" ||
      datasetValue("hearthFrontendButtonAuthorityRestored") === "true"
    );

    const carrierHostReady = Boolean(
      safeBool(firstDefined(receipt.carrierHostAdmissibilityReady, receipt.carrierHostReady), false) ||
      root.HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY_READY === true ||
      datasetValue("hearthCarrierHostAdmissibilityReady") === "true" ||
      datasetValue("hearthSouthCarrierHostAdmissibilityReady") === "true" ||
      dom.mountPresent
    );

    const carrierPacketReady = Boolean(
      safeBool(receipt.carrierHostAdmissibilityPacketReady, false) ||
      datasetValue("hearthCarrierHostAdmissibilityPacketReady") === "true" ||
      carrierHostReady
    );

    const handoffReady = Boolean(
      safeBool(receipt.handoffToRouteConductor, false) ||
      root.HEARTH_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR === true ||
      datasetValue("hearthIndexHandoffToRouteConductor") === "true" ||
      carrierHostReady
    );

    const ready = Boolean(observed && carrierHostReady && carrierPacketReady && handoffReady);

    return {
      authority: found.value,
      sourceName: found.name,
      receipt,
      observed,
      indexPairReady: ready,
      mountPresent: dom.mountPresent,
      carrierHostAdmissibilityReady: carrierHostReady,
      carrierHostAdmissibilityPacketReady: carrierPacketReady,
      indexHandoffToRouteConductor: handoffReady,
      holdReason: ready
        ? "NONE_INDEX_CARRIER_HOST_READY"
        : !observed
          ? "WAITING_INDEX_AUTHORITY"
          : !carrierHostReady
            ? "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY"
            : !handoffReady
              ? "WAITING_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR"
              : "WAITING_INDEX_PAIR_READY"
    };
  }

  function resolveF8SelfDuty() {
    const markerPresent = Boolean(
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true ||
      datasetValue("hearthRouteConductorMarkerPresent") === "true" ||
      state.routeConductorMarkerPresent
    );

    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR === api ||
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION === api ||
      (root.HEARTH && root.HEARTH.routeConductor === api) ||
      (root.HEARTH && root.HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion === api) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.hearthRouteConductor === api)
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      (
        root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT ||
        root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.currentRouteConductorReceipt === RECEIPT
      )
    );

    const hydrated = Boolean(markerPresent && apiPresent && receiptPresent);

    return {
      routeConductorMarkerPresent: markerPresent,
      routeConductorApiPresent: apiPresent,
      routeConductorReceiptPresent: receiptPresent,
      routeConductorRuntimeActive: true,
      routeF8GateReady: hydrated,
      f8SelfDutySatisfied: hydrated,
      firstFailedCoordinate: hydrated
        ? "NONE_ROUTE_F8_SELF_DUTY_SATISFIED"
        : markerPresent
          ? "WAITING_ROUTE_CONDUCTOR_API_RECEIPT_RUNTIME"
          : "WAITING_ROUTE_CONDUCTOR_MARKER_API_RECEIPT_RUNTIME"
    };
  }

  function readMacroWestAuthority() {
    const found = firstGlobal([
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.transmissionGapClassifierWest",
      "HEARTH.westCycleAwareAdmissibilityClutch",
      "HEARTH.runtimeTableWest",
      "HEARTH.westRuntimeTable",
      "HEARTH.westAdmissibility",
      "HEARTH.macroWestAuthority"
    ]);

    return {
      authority: found.value,
      sourceName: found.name,
      receipt: readReceipt(found.value) || {},
      observed: Boolean(found.value || datasetValue("hearthSouthMacroWestAuthorityObserved") === "true"),
      file: MACRO_WEST_FILE
    };
  }

  function normalizeMacroWestResult(result = {}, methodUsed = "", observed = false, authority = null) {
    const r = isObject(result) ? result : {};
    const admissibility = isObject(r.admissibility) ? r.admissibility : {};
    const gap = isObject(r.gap) ? r.gap : isObject(admissibility.gap) ? admissibility.gap : {};

    const decision = safeString(firstDefined(
      r.westDecision,
      r.decision,
      admissibility.westDecision,
      admissibility.decision,
      gap.westDecision,
      gap.decision
    ), "UNKNOWN");

    const hardBlock = Boolean(
      safeBool(firstDefined(r.westHardBlock, r.hardBlock, admissibility.westHardBlock, admissibility.hardBlock, gap.westHardBlock), false) ||
      decision === "HARD_BLOCK"
    );

    const forwardAllowed = Boolean(
      !hardBlock &&
      (
        safeBool(firstDefined(r.westForwardAllowed, r.forwardAllowed, admissibility.westForwardAllowed, admissibility.forwardAllowed, gap.forwardAllowed), false) ||
        decision === "RELEASE_TO_CANVAS" ||
        decision === "DEGRADED_FORWARD"
      )
    );

    const releaseApproved = Boolean(
      !hardBlock &&
      forwardAllowed &&
      (
        safeBool(firstDefined(r.westCanvasReleaseApproved, r.canvasReleaseApprovedByWest, admissibility.westCanvasReleaseApproved, admissibility.canvasReleaseApprovedByWest, gap.westCanvasReleaseApproved), false) ||
        decision === "RELEASE_TO_CANVAS" ||
        decision === "DEGRADED_FORWARD"
      )
    );

    return {
      macroWestAuthorityObserved: observed,
      macroWestAdmissibilityObserved: Boolean(Object.keys(r).length || releaseApproved),
      macroWestMethodUsed: methodUsed || "NONE",
      macroWestContract: safeString(firstDefined(r.contract, r.CONTRACT, authority && authority.contract, authority && authority.CONTRACT), ""),
      westDecision: decision,
      westHardBlock: hardBlock,
      westForwardAllowed: forwardAllowed,
      westCanvasReleaseApproved: releaseApproved,
      westFirstFailedCoordinate: safeString(firstDefined(
        r.firstFailedCoordinate,
        admissibility.firstFailedCoordinate,
        gap.firstFailedCoordinate
      ), releaseApproved ? "NONE_MACRO_WEST_RELEASE_APPROVED" : "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION"),
      westRecommendedNextRenewalTarget: safeString(firstDefined(
        r.recommendedNextRenewalTarget,
        r.recommendedNextFile,
        admissibility.recommendedNextRenewalTarget,
        gap.recommendedNextRenewalTarget
      ), releaseApproved ? CANVAS_FILE : MACRO_WEST_FILE),
      raw: clonePlain(r)
    };
  }

  function classifyMacroWest(index, f8) {
    const west = readMacroWestAuthority();

    if (!index.indexPairReady || !f8.f8SelfDutySatisfied) {
      return {
        ...normalizeMacroWestResult({}, "precheck-held", west.observed, west.authority),
        macroWestAdmissibilityObserved: false,
        westDecision: "HOLD_ACTIVE",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westFirstFailedCoordinate: !index.indexPairReady ? index.holdReason : f8.firstFailedCoordinate,
        westRecommendedNextRenewalTarget: !index.indexPairReady ? INDEX_FILE : FILE
      };
    }

    const authority = west.authority;

    if (!authority || !isObject(authority)) {
      const fromReceipt = normalizeMacroWestResult(west.receipt, "receipt-fallback", west.observed, authority);

      if (fromReceipt.westCanvasReleaseApproved) return fromReceipt;

      return {
        ...fromReceipt,
        macroWestAuthorityObserved: west.observed,
        macroWestAdmissibilityObserved: false,
        westDecision: "HOLD_ACTIVE",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_AUTHORITY",
        westRecommendedNextRenewalTarget: MACRO_WEST_FILE
      };
    }

    const candidate = {
      event: "CYCLE_2_CANVAS_RELEASE_ADMISSIBILITY",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      sourceFile: FILE,
      targetFile: MACRO_WEST_FILE,
      destinationFile: MACRO_WEST_FILE,
      activeCycleNumber: 2,
      cycleNumber: 2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      routeConductorAuthorityCardinal: CARDINALS.NORTH,
      receivedFrom: CARDINALS.SOUTH,
      handoffTo: CARDINALS.WEST,
      sourceCardinal: CARDINALS.SOUTH,
      targetCardinal: CARDINALS.WEST,
      indexPairReady: index.indexPairReady,
      carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
      f8SelfDutySatisfied: f8.f8SelfDutySatisfied,
      visibleGlobeProofIngestionRequested: true,
      ...FINAL_FALSE
    };

    const methods = [
      "classifyWestAdmissibility",
      "classifyCyclePacket",
      "createWestCycleReceipt",
      "createGapReceipt",
      "classifyGap",
      "classifyTransmissionGap"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method](candidate, {
          routeConductorAuthorityCardinal: CARDINALS.NORTH,
          activeCycleNumber: 2,
          activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
          sourceFile: FILE,
          targetFile: MACRO_WEST_FILE,
          destinationFile: MACRO_WEST_FILE,
          activeFibonacci: "F13N",
          visibleGlobeProofIngestionRequested: true
        });

        return normalizeMacroWestResult(result, method, true, authority);
      } catch (error) {
        recordError("MACRO_WEST_METHOD_FAILED", error, { method });
      }
    }

    return normalizeMacroWestResult(west.receipt, "receipt-fallback", true, authority);
  }

  function readCanvasAuthority() {
    return firstGlobal([
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
      "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",

      "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrier",
      "HEARTH.canvasVisibleBaseGlobeCarrier",
      "HEARTH.canvasBaseGlobeCarrier",
      "HEARTH.canvasVisiblePlanet",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasFingerManager",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasStation",
      "HEARTH.canvasChildDistributionSwitchboard",
      "HEARTH.canvasParentReleaseAcceptanceEastDispatchSwitchboard",
      "HEARTH.canvasParent",
      "HEARTH.canvasNorth",
      "HEARTH.canvasEvidence",
      "HEARTH.canvas",

      "DEXTER_LAB.hearthCanvasExpressionHubVisibleBaseGlobeCarrier",
      "DEXTER_LAB.hearthCanvasVisibleBaseGlobeCarrier",
      "DEXTER_LAB.hearthCanvasBaseGlobeCarrier",
      "DEXTER_LAB.hearthCanvasVisiblePlanet",
      "DEXTER_LAB.hearthCanvasExpressionHub",
      "DEXTER_LAB.hearthCanvasFingerManager",
      "DEXTER_LAB.hearthCanvasLocalStation",
      "DEXTER_LAB.hearthCanvasStation",
      "DEXTER_LAB.hearthCanvasChildDistributionSwitchboard",
      "DEXTER_LAB.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvas"
    ]);
  }

  function readCanvasSummaryFromAuthority(canvasAuthority) {
    if (!canvasAuthority || !isObject(canvasAuthority)) return { method: "NONE", summary: null };

    const methods = [
      "getVisibleBaseGlobeReceipt",
      "getBaseGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getCanvasVisibleProofReceipt",
      "getExpressionHubReceipt",
      "getCanvasExpressionHubReceipt",
      "getExpressionHubSummary",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getReceiptLight",
      "getReceipt",
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCanvasCarrier",
      "getCarrierReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(canvasAuthority[method])) continue;

      try {
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? canvasAuthority[method](false)
          : canvasAuthority[method]();

        if (isObject(result)) return { method, summary: result };
      } catch (error) {
        recordError("CANVAS_SUMMARY_METHOD_FAILED", error, { method });
      }
    }

    if (canvasAuthority.contract || canvasAuthority.CONTRACT || canvasAuthority.receipt || canvasAuthority.RECEIPT) {
      return { method: "direct-authority-object", summary: canvasAuthority };
    }

    return { method: "NONE", summary: null };
  }

  function readAdditionalCanvasReceipts() {
    const receipts = [];

    const names = [
      "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT",
      "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT",
      "HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT",
      "HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT",
      "HEARTH_CANVAS_FINGER_MANAGER_RECEIPT",
      "HEARTH_CANVAS_LOCAL_STATION_RECEIPT",
      "HEARTH_CANVAS_STATION_RECEIPT",
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH.canvasVisibleBaseGlobeCarrierReceipt",
      "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrierReceipt",
      "HEARTH.canvasVisiblePlanetReceipt",
      "HEARTH.canvasExpressionHubReceipt",
      "HEARTH.canvasFingerManagerReceipt",
      "HEARTH.canvasLocalStationReceipt",
      "HEARTH.canvasStationReceipt",
      "HEARTH.canvasReceipt",
      "DEXTER_LAB.hearthCanvasVisibleBaseGlobeCarrierReceipt",
      "DEXTER_LAB.hearthCanvasExpressionHubVisibleBaseGlobeCarrierReceipt",
      "DEXTER_LAB.hearthCanvasVisiblePlanetReceipt",
      "DEXTER_LAB.hearthCanvasExpressionHubReceipt",
      "DEXTER_LAB.hearthCanvasFingerManagerReceipt",
      "DEXTER_LAB.hearthCanvasLocalStationReceipt",
      "DEXTER_LAB.hearthCanvasStationReceipt",
      "DEXTER_LAB.hearthCanvasReceipt"
    ];

    for (const name of names) {
      const value = readPath(name);
      if (isObject(value)) receipts.push({ sourceName: name, receipt: value });
    }

    return receipts;
  }

  function isNoClaimPreserved(summary = {}) {
    const s = isObject(summary) ? summary : {};

    return !(
      s.f21EligibleForNorth === true ||
      s.f21SubmittedToNorth === true ||
      s.f21EligibilitySubmittedToNorth === true ||
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

  function hasCanvasLocalStationShape(summary = {}) {
    const s = isObject(summary) ? summary : {};
    const packetType = safeString(s.packetType);
    const role = safeString(s.role);

    return Boolean(
      packetType.includes("CANVAS_LOCAL_STATION") ||
      packetType.includes("CANVAS_STATION") ||
      safeBool(s.canvasLocalStationActive, false) ||
      safeBool(s.childDistributionSwitchboardActive, false) ||
      safeBool(s.routeConductorSummarySurfaceActive, false) ||
      safeBool(s.currentCanvasParentObserved, false) ||
      safeBool(s.canvasParentBootMethodAvailable, false) ||
      role.includes("canvas-local-station")
    );
  }

  function hasExpressionHubShape(summary = {}) {
    const s = isObject(summary) ? summary : {};
    const packetType = safeString(s.packetType);
    const role = safeString(s.role);

    return Boolean(
      packetType.includes("EXPRESSION_HUB") ||
      packetType.includes("FINGER_MANAGER") ||
      safeBool(s.expressionHubActive, false) ||
      safeBool(s.canvasExpressionHubActive, false) ||
      safeBool(s.fingerManagerActive, false) ||
      safeBool(s.canvasFingerManagerActive, false) ||
      safeBool(s.fingerRegistryActive, false) ||
      safeBool(s.namedFingerFilesEmbedded, false) ||
      role.includes("expression-hub") ||
      role.includes("finger-manager")
    );
  }

  function hasVisibleGlobeShape(summary = {}) {
    const s = isObject(summary) ? summary : {};
    const packetType = safeString(s.packetType);
    const role = safeString(s.role);

    return Boolean(
      packetType.includes("VISIBLE_BASE_GLOBE") ||
      packetType.includes("VISIBLE_GLOBE") ||
      packetType.includes("VISIBLE_PLANET") ||
      safeBool(s.visibleBaseGlobeCarrierActive, false) ||
      safeBool(s.canvasVisibleBaseGlobeCarrierActive, false) ||
      safeBool(s.baseGlobeDrawComplete, false) ||
      safeBool(s.baseGlobeVisibleCarrierReady, false) ||
      safeBool(s.visibleGlobeCarrierReady, false) ||
      safeBool(s.visiblePlanetProofReady, false) ||
      safeBool(s.canvasMounted, false) ||
      safeBool(s.canvasDrawComplete, false) ||
      role.includes("visible-base-globe") ||
      role.includes("visible-globe") ||
      role.includes("visible-planet")
    );
  }

  function contractIsAccepted(contract, summary = {}) {
    const c = safeString(contract);
    const acceptedByContract = ACTIVE_CANVAS_CONTRACTS.includes(c);
    const baselineOnly = CANVAS_BASELINE_CONTRACTS.includes(c);
    const acceptedByShape = isNoClaimPreserved(summary) && (
      hasCanvasLocalStationShape(summary) ||
      hasExpressionHubShape(summary) ||
      hasVisibleGlobeShape(summary)
    );

    return {
      accepted: Boolean((acceptedByContract || acceptedByShape) && !baselineOnly),
      acceptedByContract,
      acceptedByShape: Boolean(acceptedByShape && !acceptedByContract),
      shapeTrusted: Boolean(acceptedByShape),
      baselineOnly
    };
  }

  function normalizeFingerSummary(summary = {}) {
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

    const nextKey = safeString(firstDefined(s.nextFingerKey, s.firstFingerGapKey, "boundary"), "boundary");
    const nextFile = safeString(firstDefined(s.nextFingerFile, s.firstFingerGapFile, FINGER_FILES[nextKey], FINGER_FILES.boundary), FINGER_FILES.boundary);

    return {
      fingerAuthorityObservedCount: authorityObservedCount,
      fingerApiReadyCount: apiReadyCount,
      fingerExpressionPacketCount: expressionPacketCount,
      fingerReceiptPacketCount: receiptPacketCount,
      fingerTrackReadyCount: trackReadyCount,
      fingerHardFailCount: hardFailCount,
      anyFingerTrackActive: anyActive,
      allDeclaredFingerTracksReady: allReady,
      firstFingerGap: safeString(firstDefined(s.firstFingerGap, anyActive ? "WAITING_DECLARED_FINGER_TRACKS" : "WAITING_FIRST_DOWNSTREAM_FINGER_FILE"), "WAITING_FIRST_DOWNSTREAM_FINGER_FILE"),
      firstFingerGapFile: safeString(firstDefined(s.firstFingerGapFile, nextFile), nextFile),
      nextFingerKey: nextKey,
      nextFingerFile: nextFile
    };
  }

  function normalizeCanvasSummary(inputSummary = {}, method = "NONE", authority = null, authoritySourceName = "NONE") {
    const dom = scanDomForVisibleCanvas();
    const additional = readAdditionalCanvasReceipts();

    let merged = isObject(inputSummary) ? clonePlain(inputSummary) : {};

    for (const item of additional) {
      merged = mergeObjects(merged, item.receipt);
    }

    const contract = safeString(firstDefined(
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
    ), "");

    const receipt = safeString(firstDefined(
      merged.currentCanvasParentReceipt,
      merged.canvasLocalStationReceipt,
      merged.canvasReceipt,
      merged.receipt,
      merged.RECEIPT,
      authority && authority.receipt,
      authority && authority.RECEIPT,
      datasetValue("hearthCanvasReceipt")
    ), "");

    const acceptance = contractIsAccepted(contract, merged);

    const localStationShape = hasCanvasLocalStationShape(merged);
    const expressionHubShape = hasExpressionHubShape(merged);
    const visibleGlobeShape = hasVisibleGlobeShape(merged);

    const observed = Boolean(
      authority ||
      Object.keys(merged).length ||
      contract ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasExpressionHubActive") === "true" ||
      datasetValue("hearthCanvasVisibleBaseGlobeCarrierActive") === "true" ||
      dom.visiblePlanetProofReady
    );

    const expressionHubActive = Boolean(
      acceptance.accepted &&
      (
        expressionHubShape ||
        safeBool(merged.expressionHubActive, false) ||
        safeBool(merged.canvasExpressionHubActive, false) ||
        datasetValue("hearthCanvasExpressionHubActive") === "true"
      )
    );

    const fingerManagerActive = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.fingerManagerActive, false) ||
        safeBool(merged.canvasFingerManagerActive, false) ||
        datasetValue("hearthCanvasFingerManagerActive") === "true"
      )
    );

    const fingerRegistryActive = Boolean(
      fingerManagerActive ||
      safeBool(merged.fingerRegistryActive, false) ||
      datasetValue("hearthCanvasFingerRegistryActive") === "true"
    );

    const namedFingerFilesEmbedded = Boolean(
      fingerRegistryActive ||
      safeBool(merged.namedFingerFilesEmbedded, false) ||
      datasetValue("hearthCanvasNamedFingerFilesEmbedded") === "true"
    );

    const downstreamFingerTracksDeclared = Boolean(
      namedFingerFilesEmbedded ||
      safeBool(merged.downstreamFingerTracksDeclared, false) ||
      datasetValue("hearthCanvasDownstreamFingerTracksDeclared") === "true"
    );

    const canvasMounted = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.canvasMounted, false) ||
        safeBool(merged.baseGlobeMounted, false) ||
        safeBool(merged.mountComplete, false) ||
        datasetValue("hearthCanvasMounted") === "true" ||
        datasetValue("hearthCanvasBaseGlobeMounted") === "true" ||
        dom.canvasMounted
      )
    );

    const canvasDrawComplete = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.canvasDrawComplete, false) ||
        safeBool(merged.drawComplete, false) ||
        safeBool(merged.firstFrameDetected, false) ||
        safeBool(merged.imageRendered, false) ||
        datasetValue("hearthCanvasDrawComplete") === "true" ||
        datasetValue("hearthCanvasImageRendered") === "true" ||
        dom.canvasDrawComplete
      )
    );

    const visibleBaseGlobeCarrierActive = Boolean(
      acceptance.accepted &&
      (
        visibleGlobeShape ||
        safeBool(merged.visibleBaseGlobeCarrierActive, false) ||
        safeBool(merged.canvasVisibleBaseGlobeCarrierActive, false) ||
        safeBool(merged.baseGlobeCarrierActive, false) ||
        datasetValue("hearthCanvasVisibleBaseGlobeCarrierActive") === "true" ||
        dom.canvasPresent
      )
    );

    const baseGlobeDrawComplete = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.baseGlobeDrawComplete, false) ||
        safeBool(merged.visibleBaseGlobeDrawComplete, false) ||
        safeBool(merged.canvasDrawComplete, false) ||
        datasetValue("hearthCanvasBaseGlobeDrawComplete") === "true" ||
        canvasDrawComplete
      )
    );

    const baseGlobeVisibleCarrierReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.baseGlobeVisibleCarrierReady, false) ||
        safeBool(merged.visibleGlobeCarrierReady, false) ||
        safeBool(merged.canvasVisibleCarrierReady, false) ||
        datasetValue("hearthCanvasBaseGlobeVisibleCarrierReady") === "true" ||
        (visibleBaseGlobeCarrierActive && baseGlobeDrawComplete)
      )
    );

    const visibleGlobeCarrierReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.visibleGlobeCarrierReady, false) ||
        safeBool(merged.visiblePlanetCarrierReady, false) ||
        baseGlobeVisibleCarrierReady
      )
    );

    const visiblePlanetProofReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.visiblePlanetProofReady, false) ||
        safeBool(merged.currentVisibleProofValid, false) ||
        datasetValue("hearthCanvasVisiblePlanetProofReady") === "true" ||
        (canvasMounted && canvasDrawComplete && visibleBaseGlobeCarrierActive) ||
        dom.visiblePlanetProofReady
      )
    );

    const visibleProofSource = visiblePlanetProofReady
      ? safeBool(merged.visiblePlanetProofReady, false)
        ? "CANVAS_RECEIPT_VISIBLE_PLANET_PROOF"
        : visibleGlobeShape
          ? "CANVAS_VISIBLE_GLOBE_RECEIPT_SHAPE"
          : dom.visiblePlanetProofReady
            ? "DOM_VISIBLE_CANVAS_NONZERO"
            : "CANVAS_DATASET_VISIBLE_PROOF"
      : "NONE";

    const releaseAccepted = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.canvasParentReleaseAccepted, merged.parentReleaseAccepted, merged.releasePacketAccepted), false) ||
        datasetValue("hearthCanvasParentReleaseAccepted") === "true" ||
        datasetValue("hearthSouthCanvasParentReleaseAccepted") === "true"
      )
    );

    const parentReleaseLawful = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.parentReleaseLawful, merged.canvasParentReleaseLawful, merged.releasePacketValid, merged.parentReleasePacketLawful), false) ||
        datasetValue("hearthCanvasParentReleaseLawful") === "true" ||
        datasetValue("hearthSouthParentReleaseLawful") === "true" ||
        releaseAccepted
      )
    );

    const eastDispatchAuthorized = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.eastDispatchAuthorized, merged.canvasEastDispatchAuthorized), false) ||
        datasetValue("hearthCanvasEastDispatchAuthorized") === "true" ||
        datasetValue("hearthSouthEastDispatchAuthorized") === "true"
      )
    );

    const eastDispatchPacketPublished = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.eastDispatchPacketPublished, merged.canvasEastDispatchPacketPublished), false) ||
        datasetValue("hearthCanvasEastDispatchPacketPublished") === "true" ||
        datasetValue("hearthSouthEastDispatchPacketPublished") === "true"
      )
    );

    const eastApiReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.canvasEastApiReady, merged.eastApiReady), false) ||
        datasetValue("hearthCanvasEastApiReady") === "true"
      )
    );

    const eastEvidenceReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.canvasEastEvidenceReady, merged.canvasEastF13AtlasPacketReady, merged.eastEvidenceReady), false) ||
        datasetValue("hearthCanvasEastEvidenceReady") === "true"
      )
    );

    const westApiReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.canvasWestApiReady, merged.westApiReady), false) ||
        datasetValue("hearthCanvasWestApiReady") === "true"
      )
    );

    const westInspectionReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.canvasWestInspectionReady, merged.canvasWestEvidenceReady, merged.westEvidenceReady), false) ||
        datasetValue("hearthCanvasWestInspectionReady") === "true"
      )
    );

    const southApiReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.canvasSouthApiReady, merged.southApiReady), false) ||
        datasetValue("hearthCanvasSouthApiReady") === "true"
      )
    );

    const southVisibleProofReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.canvasSouthVisibleProofReady, merged.canvasSouthEvidenceReady, merged.southVisibleProofReady, merged.southEvidenceReady), false) ||
        visiblePlanetProofReady ||
        datasetValue("hearthCanvasSouthVisibleProofReady") === "true"
      )
    );

    const allApiReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.allCanvasChildrenApiReady, false) ||
        (eastApiReady && westApiReady && southApiReady)
      )
    );

    const allEvidenceReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.allCanvasChildrenEvidenceReady, false) ||
        (eastEvidenceReady && westInspectionReady && southVisibleProofReady) ||
        visiblePlanetProofReady
      )
    );

    const allChildrenReady = Boolean(
      acceptance.accepted &&
      (
        safeBool(merged.allCanvasChildrenReady, false) ||
        (allApiReady && allEvidenceReady)
      )
    );

    const f13HardFail = Boolean(
      acceptance.accepted &&
      (
        safeBool(firstDefined(merged.f13HardFail, merged.canvasF13HardFail), false) ||
        datasetValue("hearthCanvasF13HardFail") === "true"
      )
    );

    const f13Strict = Boolean(
      acceptance.accepted &&
      !f13HardFail &&
      (
        safeBool(firstDefined(merged.f13CanvasEvidenceStrict, merged.f13EvidenceStrict), false) ||
        (visiblePlanetProofReady && releaseAccepted && parentReleaseLawful && (eastDispatchAuthorized || eastDispatchPacketPublished) && allChildrenReady)
      )
    );

    const f13Degraded = Boolean(
      acceptance.accepted &&
      !f13HardFail &&
      !f13Strict &&
      (
        safeBool(firstDefined(merged.f13CanvasEvidenceDegraded, merged.f13EvidenceDegraded), false) ||
        visiblePlanetProofReady ||
        (canvasMounted && canvasDrawComplete)
      )
    );

    const f13Complete = Boolean(
      acceptance.accepted &&
      !f13HardFail &&
      (
        safeBool(firstDefined(merged.f13CanvasEvidenceComplete, merged.f13EvidenceComplete), false) ||
        f13Strict ||
        f13Degraded ||
        visiblePlanetProofReady
      )
    );

    const fingers = normalizeFingerSummary(merged);

    const apiReady = Boolean(
      acceptance.accepted &&
      (
        authority ||
        localStationShape ||
        expressionHubShape ||
        visibleGlobeShape ||
        isFunction(authority && authority.boot) ||
        isFunction(authority && authority.init) ||
        isFunction(authority && authority.start) ||
        isFunction(authority && authority.mount) ||
        isFunction(authority && authority.consumeRouteConductorReleasePacket) ||
        isFunction(authority && authority.receiveReleasePacket)
      )
    );

    const bootMethodAvailable = Boolean(
      apiReady &&
      (
        isFunction(authority && authority.boot) ||
        isFunction(authority && authority.init) ||
        isFunction(authority && authority.start) ||
        isFunction(authority && authority.mount) ||
        isFunction(authority && authority.consumeRouteConductorReleasePacket) ||
        isFunction(authority && authority.receiveRouteConductorReleasePacket) ||
        isFunction(authority && authority.receiveReleasePacket) ||
        isFunction(authority && authority.receiveCanvasReleasePacket) ||
        localStationShape ||
        expressionHubShape ||
        visibleGlobeShape
      )
    );

    let gap = "NONE_VISIBLE_BASE_GLOBE_PROOF_INGESTED";
    let target = CANVAS_FILE;

    if (!observed) {
      gap = "WAITING_CANVAS_AUTHORITY_OR_VISIBLE_PROOF";
    } else if (!acceptance.accepted) {
      gap = "WAITING_CURRENT_CANVAS_CONTRACT_OR_LAWFUL_VISIBLE_PROOF_SHAPE";
    } else if (!apiReady) {
      gap = "WAITING_CANVAS_EXPRESSION_HUB_API";
    } else if (!visiblePlanetProofReady) {
      gap = "WAITING_VISIBLE_BASE_GLOBE_PROOF";
    } else if (f13HardFail) {
      gap = "CANVAS_F13_HARD_FAIL";
    } else if (!f13Complete) {
      gap = "WAITING_CANVAS_F13_EVIDENCE";
    } else if (!f13Strict) {
      gap = "VISIBLE_GLOBE_PROOF_INGESTED_STRICT_F13_PENDING";
      target = fingers.nextFingerFile || CANVAS_FILE;
    } else {
      target = fingers.allDeclaredFingerTracksReady ? NORTH_FILE : fingers.nextFingerFile || CANVAS_FILE;
    }

    return {
      authority,
      authoritySourceName,
      method,
      raw: clonePlain(merged),

      observed,
      summaryObserved: Boolean(Object.keys(merged).length),
      currentCanvasParentObserved: observed,
      currentCanvasParentContractObserved: Boolean(contract),
      currentCanvasParentContract: contract,
      currentCanvasParentReceipt: receipt,
      currentCanvasParentIsLocalStation: Boolean(acceptance.accepted && (localStationShape || expressionHubShape || visibleGlobeShape)),
      currentCanvasParentIsExpressionHub: Boolean(acceptance.accepted && expressionHubShape),
      currentCanvasParentIsFingerManager: Boolean(acceptance.accepted && fingerManagerActive),
      currentCanvasParentIsVisibleBaseGlobeCarrier: Boolean(acceptance.accepted && visibleGlobeShape),
      canvasLocalStationApiReady: apiReady,
      canvasParentBootMethodAvailable: bootMethodAvailable,

      canvasSummaryAcceptedByContract: acceptance.acceptedByContract,
      canvasSummaryAcceptedByShape: acceptance.acceptedByShape,
      canvasSummaryShapeTrusted: acceptance.shapeTrusted,
      canvasContractAccepted: acceptance.accepted,
      canvasBaselineOnly: acceptance.baselineOnly,
      noClaimPreserved: isNoClaimPreserved(merged),

      expressionHubActive,
      canvasExpressionHubActive: expressionHubActive,
      fingerManagerActive,
      canvasFingerManagerActive: fingerManagerActive,
      fingerRegistryActive,
      namedFingerFilesEmbedded,
      downstreamFingerTracksDeclared,

      visibleBaseGlobeCarrierActive,
      canvasVisibleBaseGlobeCarrierActive: visibleBaseGlobeCarrierActive,
      canvasMounted,
      canvasDrawComplete,
      baseGlobeDrawComplete,
      baseGlobeVisibleCarrierReady,
      visibleGlobeCarrierReady,
      visiblePlanetProofReady,
      visiblePlanetProofSource: visibleProofSource,
      visiblePlanetProofIngestedByRoute: visiblePlanetProofReady,
      visiblePlanetReceiptObserved: Boolean(visibleGlobeShape || safeBool(merged.visiblePlanetProofReady, false)),

      canvasParentReleaseAccepted: releaseAccepted,
      canvasParentReleaseObserved: Boolean(releaseAccepted || parentReleaseLawful),
      parentReleaseLawful,
      parentAcceptedRouteConductorRelease: Boolean(
        acceptance.accepted &&
        (
          safeBool(firstDefined(merged.parentAcceptedRouteConductorRelease, merged.canvasParentAcceptedRouteConductorRelease), false) ||
          (releaseAccepted && parentReleaseLawful)
        )
      ),
      parentReleasePacketSentToEast: Boolean(
        acceptance.accepted &&
        (
          safeBool(firstDefined(merged.parentReleasePacketSentToEast, merged.eastDispatchPacketSent), false) ||
          eastDispatchAuthorized ||
          eastDispatchPacketPublished
        )
      ),
      parentReleasePacketLawful: Boolean(
        acceptance.accepted &&
        (
          safeBool(firstDefined(merged.parentReleasePacketLawful, merged.eastDispatchPacketLawful), false) ||
          (releaseAccepted && parentReleaseLawful)
        )
      ),
      eastDispatchAuthorized,
      eastDispatchPacketPublished,

      canvasEastApiReady: eastApiReady,
      canvasEastEvidenceReady: eastEvidenceReady,
      canvasWestApiReady: westApiReady,
      canvasWestInspectionReady: westInspectionReady,
      canvasSouthApiReady: southApiReady,
      canvasSouthVisibleProofReady: southVisibleProofReady,
      allCanvasChildrenApiReady: allApiReady,
      allCanvasChildrenEvidenceReady: allEvidenceReady,
      allCanvasChildrenReady: allChildrenReady,

      ...fingers,

      f13CanvasReadinessObserved: Boolean(acceptance.accepted && (observed || visiblePlanetProofReady || f13Complete)),
      f13VisibleEvidenceAvailable: Boolean(visiblePlanetProofReady || southVisibleProofReady),
      f13InspectEvidenceAvailable: Boolean(westInspectionReady),
      f13CanvasEvidenceStrict: f13Strict,
      f13CanvasEvidenceDegraded: f13Degraded,
      f13CanvasEvidenceComplete: f13Complete,
      f13HardFail,
      f13StrictEvidenceGap: gap,
      f13StrictEvidenceRepairTarget: target,
      degradedF13IsFunctional: Boolean(f13Degraded && f13Complete && !f13Strict),
      strictVisualProofPending: Boolean(f13Complete && !f13Strict && !f13HardFail),
      functionalPageObserved: Boolean(f13Complete && !f13HardFail),
      recommendedNextFile: target,
      recommendedNextRenewalTarget: target,
      postgameStatus: gap
    };
  }

  function readCanvasSummary() {
    const found = readCanvasAuthority();
    const read = readCanvasSummaryFromAuthority(found.value);
    const normalized = normalizeCanvasSummary(read.summary || {}, read.method, found.value, found.name);
    state.currentCanvasSummary = clonePlain(normalized);
    return normalized;
  }

  function applyCanvasSummary(canvas, methodName = "canvas-summary") {
    if (!isObject(canvas)) return false;

    state.canvasAuthorityObserved = canvas.observed;
    state.canvasAuthoritySourceName = canvas.authoritySourceName || "NONE";
    state.canvasSummaryObserved = canvas.summaryObserved;
    state.canvasSummaryMethod = methodName || canvas.method || "canvas-summary";
    state.canvasSummaryAcceptedByContract = canvas.canvasSummaryAcceptedByContract;
    state.canvasSummaryAcceptedByShape = canvas.canvasSummaryAcceptedByShape;
    state.canvasSummaryShapeTrusted = canvas.canvasSummaryShapeTrusted;
    state.canvasContractAccepted = canvas.canvasContractAccepted;
    state.canvasBaselineOnly = canvas.canvasBaselineOnly;

    state.currentCanvasParentObserved = canvas.currentCanvasParentObserved;
    state.currentCanvasParentContractObserved = canvas.currentCanvasParentContractObserved;
    state.currentCanvasParentContract = canvas.currentCanvasParentContract;
    state.currentCanvasParentReceipt = canvas.currentCanvasParentReceipt;
    state.currentCanvasParentIsLocalStation = canvas.currentCanvasParentIsLocalStation;
    state.currentCanvasParentIsExpressionHub = canvas.currentCanvasParentIsExpressionHub;
    state.currentCanvasParentIsFingerManager = canvas.currentCanvasParentIsFingerManager;
    state.currentCanvasParentIsVisibleBaseGlobeCarrier = canvas.currentCanvasParentIsVisibleBaseGlobeCarrier;
    state.canvasParentBootMethodAvailable = canvas.canvasParentBootMethodAvailable;

    state.expressionHubActive = canvas.expressionHubActive;
    state.canvasExpressionHubActive = canvas.canvasExpressionHubActive;
    state.fingerManagerActive = canvas.fingerManagerActive;
    state.canvasFingerManagerActive = canvas.canvasFingerManagerActive;
    state.fingerRegistryActive = canvas.fingerRegistryActive;
    state.namedFingerFilesEmbedded = canvas.namedFingerFilesEmbedded;
    state.downstreamFingerTracksDeclared = canvas.downstreamFingerTracksDeclared;

    state.visibleBaseGlobeCarrierActive = canvas.visibleBaseGlobeCarrierActive;
    state.canvasVisibleBaseGlobeCarrierActive = canvas.canvasVisibleBaseGlobeCarrierActive;
    state.canvasMounted = canvas.canvasMounted;
    state.canvasDrawComplete = canvas.canvasDrawComplete;
    state.baseGlobeDrawComplete = canvas.baseGlobeDrawComplete;
    state.baseGlobeVisibleCarrierReady = canvas.baseGlobeVisibleCarrierReady;
    state.visibleGlobeCarrierReady = canvas.visibleGlobeCarrierReady;
    state.visiblePlanetProofReady = canvas.visiblePlanetProofReady;
    state.visiblePlanetProofSource = canvas.visiblePlanetProofSource;
    state.visiblePlanetProofIngestedByRoute = canvas.visiblePlanetProofIngestedByRoute;
    state.visiblePlanetReceiptObserved = canvas.visiblePlanetReceiptObserved;

    state.fingerAuthorityObservedCount = canvas.fingerAuthorityObservedCount;
    state.fingerApiReadyCount = canvas.fingerApiReadyCount;
    state.fingerExpressionPacketCount = canvas.fingerExpressionPacketCount;
    state.fingerReceiptPacketCount = canvas.fingerReceiptPacketCount;
    state.fingerTrackReadyCount = canvas.fingerTrackReadyCount;
    state.fingerHardFailCount = canvas.fingerHardFailCount;
    state.anyFingerTrackActive = canvas.anyFingerTrackActive;
    state.allDeclaredFingerTracksReady = canvas.allDeclaredFingerTracksReady;
    state.firstFingerGap = canvas.firstFingerGap;
    state.firstFingerGapFile = canvas.firstFingerGapFile;
    state.nextFingerKey = canvas.nextFingerKey;
    state.nextFingerFile = canvas.nextFingerFile;

    state.canvasParentReleaseAccepted = canvas.canvasParentReleaseAccepted;
    state.canvasParentReleaseObserved = canvas.canvasParentReleaseObserved;
    state.parentReleaseLawful = canvas.parentReleaseLawful;
    state.parentAcceptedRouteConductorRelease = canvas.parentAcceptedRouteConductorRelease;
    state.parentReleasePacketSentToEast = canvas.parentReleasePacketSentToEast;
    state.parentReleasePacketLawful = canvas.parentReleasePacketLawful;
    state.eastDispatchAuthorized = canvas.eastDispatchAuthorized;
    state.eastDispatchPacketPublished = canvas.eastDispatchPacketPublished;

    state.canvasEastApiReady = canvas.canvasEastApiReady;
    state.canvasEastEvidenceReady = canvas.canvasEastEvidenceReady;
    state.canvasWestApiReady = canvas.canvasWestApiReady;
    state.canvasWestInspectionReady = canvas.canvasWestInspectionReady;
    state.canvasSouthApiReady = canvas.canvasSouthApiReady;
    state.canvasSouthVisibleProofReady = canvas.canvasSouthVisibleProofReady;
    state.allCanvasChildrenApiReady = canvas.allCanvasChildrenApiReady;
    state.allCanvasChildrenEvidenceReady = canvas.allCanvasChildrenEvidenceReady;
    state.allCanvasChildrenReady = canvas.allCanvasChildrenReady;

    state.f13CanvasReadinessObserved = canvas.f13CanvasReadinessObserved;
    state.f13VisibleEvidenceAvailable = canvas.f13VisibleEvidenceAvailable;
    state.f13InspectEvidenceAvailable = canvas.f13InspectEvidenceAvailable;
    state.f13CanvasEvidenceStrict = canvas.f13CanvasEvidenceStrict;
    state.f13CanvasEvidenceDegraded = canvas.f13CanvasEvidenceDegraded;
    state.f13CanvasEvidenceComplete = canvas.f13CanvasEvidenceComplete;
    state.f13HardFail = canvas.f13HardFail;
    state.f13StrictEvidenceGap = canvas.f13StrictEvidenceGap;
    state.f13StrictEvidenceRepairTarget = canvas.f13StrictEvidenceRepairTarget;
    state.degradedF13IsFunctional = canvas.degradedF13IsFunctional;
    state.strictVisualProofPending = canvas.strictVisualProofPending;
    state.functionalPageObserved = canvas.functionalPageObserved;

    state.firstFailedCoordinate = canvas.f13StrictEvidenceGap;
    state.recommendedNextFile = canvas.recommendedNextFile;
    state.recommendedNextRenewalTarget = canvas.recommendedNextRenewalTarget;
    state.canvasNextAuditTarget = canvas.recommendedNextFile;
    state.postgameStatus = canvas.postgameStatus;

    state.currentCanvasSummary = clonePlain(canvas);
    state.updatedAt = nowIso();
    updateDataset();

    return true;
  }

  function receiveCanvasSummary(summary, methodName) {
    if (state.canvasSummaryReceiveInProgress) {
      record("CANVAS_SUMMARY_REENTRY_BLOCKED", { methodName });
      return getReceiptLight(false);
    }

    state.canvasSummaryReceiveInProgress = true;

    try {
      const normalized = normalizeCanvasSummary(summary || {}, methodName, null, "PUSHED_SUMMARY");
      applyCanvasSummary(normalized, methodName);

      record("CANVAS_SUMMARY_RECEIVED_BY_ROUTE_CONDUCTOR_V9_5", {
        methodName,
        currentCanvasParentContract: normalized.currentCanvasParentContract,
        canvasContractAccepted: normalized.canvasContractAccepted,
        expressionHubActive: normalized.expressionHubActive,
        fingerManagerActive: normalized.fingerManagerActive,
        visiblePlanetProofReady: normalized.visiblePlanetProofReady,
        visiblePlanetProofSource: normalized.visiblePlanetProofSource,
        f13StrictEvidenceGap: normalized.f13StrictEvidenceGap
      });

      publishGlobals("canvas-summary-received-v9-5", false);
      scheduleRender();

      return getReceiptLight(false);
    } catch (error) {
      recordError("CANVAS_SUMMARY_RECEIVE_FAILED", error, { methodName });
      return getReceiptLight(false);
    } finally {
      state.canvasSummaryReceiveInProgress = false;
    }
  }

  function receiveCanvasStationSummary(summary) {
    return receiveCanvasSummary(summary, "receiveCanvasStationSummary");
  }

  function receiveCanvasLocalStationSummary(summary) {
    return receiveCanvasSummary(summary, "receiveCanvasLocalStationSummary");
  }

  function receiveCanvasParentSummary(summary) {
    return receiveCanvasSummary(summary, "receiveCanvasParentSummary");
  }

  function receiveCanvasExpressionHubSummary(summary) {
    return receiveCanvasSummary(summary, "receiveCanvasExpressionHubSummary");
  }

  function receiveExpressionHubSummary(summary) {
    return receiveCanvasSummary(summary, "receiveExpressionHubSummary");
  }

  function receiveVisibleBaseGlobeReceipt(summary) {
    return receiveCanvasSummary(summary, "receiveVisibleBaseGlobeReceipt");
  }

  function receiveVisibleGlobeReceipt(summary) {
    return receiveCanvasSummary(summary, "receiveVisibleGlobeReceipt");
  }

  function receiveVisiblePlanetReceipt(summary) {
    return receiveCanvasSummary(summary, "receiveVisiblePlanetReceipt");
  }

  function receiveCanvasVisibleProof(summary) {
    return receiveCanvasSummary(summary, "receiveCanvasVisibleProof");
  }

  function reconcileCanvas(summary) {
    return receiveCanvasSummary(summary, "reconcileCanvas");
  }

  function composeCanvasReleasePacket(index, f8, macroWest, canvas) {
    const indexReady = Boolean(
      index.indexPairReady &&
      index.carrierHostAdmissibilityReady &&
      index.carrierHostAdmissibilityPacketReady &&
      index.indexHandoffToRouteConductor
    );

    const f8Ready = Boolean(f8.f8SelfDutySatisfied);

    const westReady = Boolean(
      macroWest.macroWestAdmissibilityObserved &&
      macroWest.westCanvasReleaseApproved &&
      macroWest.westForwardAllowed &&
      !macroWest.westHardBlock
    );

    const canvasReceivable = Boolean(
      canvas.currentCanvasParentObserved &&
      canvas.canvasContractAccepted &&
      canvas.canvasLocalStationApiReady &&
      canvas.canvasParentBootMethodAvailable
    );

    const authorized = Boolean(indexReady && f8Ready && westReady && canvasReceivable);

    const heldReason = authorized
      ? "NONE_CANVAS_RELEASE_AUTHORIZED"
      : !indexReady
        ? index.holdReason
        : !f8Ready
          ? f8.firstFailedCoordinate
          : !macroWest.macroWestAuthorityObserved
            ? "WAITING_MACRO_WEST_AUTHORITY"
            : !macroWest.macroWestAdmissibilityObserved
              ? "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION"
              : macroWest.westHardBlock
                ? "MACRO_WEST_HARD_BLOCK"
                : !macroWest.westCanvasReleaseApproved
                  ? macroWest.westFirstFailedCoordinate
                  : !canvas.currentCanvasParentObserved
                    ? "WAITING_CANVAS_AUTHORITY"
                    : !canvas.canvasContractAccepted
                      ? "WAITING_CURRENT_CANVAS_CONTRACT_OR_LAWFUL_VISIBLE_PROOF_SHAPE"
                      : !canvas.canvasLocalStationApiReady
                        ? "WAITING_CANVAS_EXPRESSION_HUB_API"
                        : !canvas.canvasParentBootMethodAvailable
                          ? "WAITING_CANVAS_RELEASE_RECEIVER"
                          : "WAITING_CANVAS_RELEASE_AUTHORIZATION";

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET",
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      currentRouteConductorContract: CONTRACT,
      currentRouteConductorReceipt: RECEIPT,

      routeConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      routeConductorReceipt: COMPAT_ROUTE_CONDUCTOR_RECEIPT,
      compatibilityRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      compatibilityRouteConductorReceipt: COMPAT_ROUTE_CONDUCTOR_RECEIPT,
      supersedingRouteConductorContract: CONTRACT,
      supersedingRouteConductorReceipt: RECEIPT,

      previousRouteConductorContract: PREVIOUS_CONTRACT,
      previousRouteConductorReceipt: PREVIOUS_RECEIPT,
      lineageRouteConductorContract: LINEAGE_CONTRACT,
      lineageRouteConductorReceipt: LINEAGE_RECEIPT,
      legacyRouteConductorContract: LEGACY_NORTH_STAR_CONTRACT,
      legacyRouteConductorReceipt: LEGACY_NORTH_STAR_RECEIPT,

      sourceFile: FILE,
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,

      routeConductorAuthorityCardinal: CARDINALS.NORTH,
      activeCycleInputCardinal: CARDINALS.SOUTH,
      activeCycleHandoffTarget: authorized ? CARDINALS.CANVAS : CARDINALS.WEST,
      receivedFrom: CARDINALS.WEST,
      sourceCardinal: CARDINALS.WEST,
      handoffTo: authorized ? CARDINALS.CANVAS : "",

      cycleNumber: 2,
      activeCycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,

      indexPairReady: index.indexPairReady,
      carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
      indexHandoffToRouteConductor: index.indexHandoffToRouteConductor,
      f8SelfDutySatisfied: f8.f8SelfDutySatisfied,

      macroWestAuthorityObserved: macroWest.macroWestAuthorityObserved,
      macroWestAdmissibilityObserved: macroWest.macroWestAdmissibilityObserved,
      westDecision: macroWest.westDecision,
      westHardBlock: macroWest.westHardBlock,
      westForwardAllowed: macroWest.westForwardAllowed,
      westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,

      canvasAuthorityObserved: canvas.observed,
      currentCanvasParentContract: canvas.currentCanvasParentContract,
      currentCanvasParentReceipt: canvas.currentCanvasParentReceipt,
      canvasContractAccepted: canvas.canvasContractAccepted,
      expressionHubActive: canvas.expressionHubActive,
      fingerManagerActive: canvas.fingerManagerActive,
      visibleBaseGlobeCarrierActive: canvas.visibleBaseGlobeCarrierActive,
      visiblePlanetProofReady: canvas.visiblePlanetProofReady,

      canvasReleaseAuthorized: authorized,
      canvasReleasePacketReady: authorized,
      canvasReleaseApproved: authorized,
      releaseToCanvas: authorized,
      canvasReleaseHeldReason: heldReason,

      visibleGlobeProofIngestionActive: true,
      routeConductorWillConsumeVisiblePlanetProof: true,
      routeConductorWillNotOwnCanvasDrawing: true,
      routeConductorWillNotClaimFinalVisualPass: true,

      firstFailedCoordinate: heldReason,
      recommendedNextFile: authorized ? CANVAS_FILE : selectHeldTarget(index, f8, macroWest, canvas),
      recommendedNextRenewalTarget: authorized ? CANVAS_FILE : selectHeldTarget(index, f8, macroWest, canvas),
      composedAt: nowIso(),

      ...FINAL_FALSE
    };

    state.currentCanvasReleasePacket = clonePlain(packet);
    return packet;
  }

  function selectHeldTarget(index, f8, macroWest, canvas) {
    if (!index.indexPairReady) return INDEX_FILE;
    if (!f8.f8SelfDutySatisfied) return FILE;
    if (!macroWest.macroWestAdmissibilityObserved || !macroWest.westCanvasReleaseApproved || macroWest.westHardBlock) return MACRO_WEST_FILE;
    if (!canvas.currentCanvasParentObserved || !canvas.canvasContractAccepted || !canvas.canvasLocalStationApiReady) return CANVAS_FILE;
    return CANVAS_FILE;
  }

  function deliverReleaseToCanvas(canvas, packet) {
    if (!isObject(packet) || packet.canvasReleaseAuthorized !== true) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: packet ? packet.canvasReleaseHeldReason : "WAITING_CANVAS_RELEASE_PACKET"
      };
    }

    if (!canvas || !isObject(canvas.authority)) {
      return {
        delivered: false,
        accepted: false,
        method: "NONE",
        reason: "WAITING_CANVAS_AUTHORITY"
      };
    }

    const signature = packetSignature(packet);

    if (state.canvasReleaseDeliveryInProgress) {
      record("CANVAS_RELEASE_DELIVERY_REENTRY_BLOCKED", { signature });
      return {
        delivered: false,
        accepted: state.canvasReleaseAcceptedByCanvas,
        method: state.canvasReleaseDeliveryMethod,
        reason: "CANVAS_RELEASE_DELIVERY_REENTRY_BLOCKED"
      };
    }

    if (
      signature &&
      state.lastCanvasReleasePacketSignature === signature &&
      state.canvasReleaseAcceptedByCanvas === true
    ) {
      return {
        delivered: false,
        accepted: true,
        method: state.canvasReleaseDeliveryMethod || "previous-accepted-release",
        reason: "CANVAS_RELEASE_DUPLICATE_DELIVERY_BLOCKED"
      };
    }

    state.canvasReleaseDeliveryInProgress = true;

    try {
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

          const receipt = isObject(result) ? result : readReceipt(canvas.authority) || {};
          const accepted = Boolean(
            safeBool(firstDefined(receipt.canvasParentReleaseAccepted, receipt.releasePacketAccepted), false) ||
            safeBool(firstDefined(receipt.parentReleaseLawful, receipt.canvasParentReleaseLawful), false) ||
            safeBool(receipt.visiblePlanetProofReady, false) ||
            safeBool(receipt.baseGlobeVisibleCarrierReady, false)
          );

          state.canvasReleasePacketDelivered = true;
          state.canvasReleaseDeliveryMethod = method;
          state.canvasReleaseAcceptedByCanvas = accepted;
          state.lastCanvasReleasePacketSignature = signature;

          record("CANVAS_RELEASE_DELIVERED_BY_ROUTE_CONDUCTOR_V9_5", {
            method,
            accepted,
            signature,
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
    } finally {
      state.canvasReleaseDeliveryInProgress = false;
    }
  }

  function resolveNews(index, f8, macroWest, canvas) {
    const indexGateReady = Boolean(index.indexPairReady && index.carrierHostAdmissibilityReady);
    const routeF8GateReady = Boolean(f8.f8SelfDutySatisfied);
    const macroWestGateReady = Boolean(
      macroWest.macroWestAdmissibilityObserved &&
      macroWest.westCanvasReleaseApproved &&
      macroWest.westForwardAllowed &&
      !macroWest.westHardBlock
    );

    const canvasHubGateReady = Boolean(
      canvas.currentCanvasParentObserved &&
      canvas.canvasContractAccepted &&
      canvas.canvasLocalStationApiReady &&
      (canvas.currentCanvasParentIsExpressionHub || canvas.currentCanvasParentIsVisibleBaseGlobeCarrier || canvas.currentCanvasParentIsLocalStation)
    );

    const visibleGlobeGateReady = Boolean(
      canvas.visiblePlanetProofReady &&
      canvas.visiblePlanetProofIngestedByRoute &&
      canvas.baseGlobeDrawComplete &&
      canvas.baseGlobeVisibleCarrierReady &&
      !canvas.f13HardFail
    );

    const fingerTrackGateReady = Boolean(
      canvas.allDeclaredFingerTracksReady ||
      canvas.anyFingerTrackActive ||
      canvas.visiblePlanetProofReady
    );

    const canvasGateReady = Boolean(
      canvasHubGateReady &&
      visibleGlobeGateReady &&
      canvas.f13CanvasEvidenceComplete &&
      !canvas.f13HardFail
    );

    return {
      indexGateReady,
      routeF8GateReady,
      macroWestGateReady,
      canvasHubGateReady,
      visibleGlobeGateReady,
      fingerTrackGateReady,
      canvasGateReady,
      newsGatePassedBeforeF21: Boolean(canvasGateReady && canvas.f13CanvasEvidenceStrict),
      newsGateDegradedBeforeF21: Boolean(canvasGateReady && canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict)
    };
  }

  function resolveF21(index, f8, macroWest, canvas, news) {
    const eligible = Boolean(
      index.indexPairReady &&
      f8.f8SelfDutySatisfied &&
      macroWest.macroWestAdmissibilityObserved &&
      macroWest.westCanvasReleaseApproved &&
      macroWest.westForwardAllowed &&
      !macroWest.westHardBlock &&
      canvas.currentCanvasParentObserved &&
      canvas.canvasContractAccepted &&
      canvas.visiblePlanetProofReady &&
      canvas.f13CanvasEvidenceComplete &&
      !canvas.f13HardFail &&
      (news.newsGatePassedBeforeF21 || news.newsGateDegradedBeforeF21)
    );

    const firstFailedCoordinate = eligible
      ? "NONE_F21_ELIGIBLE_FOR_NORTH"
      : !index.indexPairReady
        ? index.holdReason
        : !f8.f8SelfDutySatisfied
          ? f8.firstFailedCoordinate
          : !macroWest.macroWestAdmissibilityObserved || !macroWest.westCanvasReleaseApproved
            ? "WAITING_MACRO_WEST_CANVAS_RELEASE"
            : !canvas.currentCanvasParentObserved
              ? "WAITING_CANVAS_AUTHORITY"
              : !canvas.canvasContractAccepted
                ? "WAITING_CURRENT_CANVAS_CONTRACT_OR_LAWFUL_VISIBLE_PROOF_SHAPE"
                : !canvas.visiblePlanetProofReady
                  ? "WAITING_VISIBLE_BASE_GLOBE_PROOF"
                  : canvas.f13HardFail
                    ? "CANVAS_F13_HARD_FAIL"
                    : !canvas.f13CanvasEvidenceComplete
                      ? canvas.f13StrictEvidenceGap
                      : "WAITING_NEWS_GATE_BEFORE_F21";

    return {
      f21EligibleForNorth: eligible,
      f21LatchMode: eligible
        ? canvas.f13CanvasEvidenceStrict
          ? "READY_FOR_NORTH_STRICT_F21_LATCH"
          : "READY_FOR_NORTH_DEGRADED_F21_LATCH"
        : firstFailedCoordinate,
      firstFailedCoordinate,
      ...FINAL_FALSE
    };
  }

  function composeStation(stationId, file, gate) {
    const passed = Boolean(gate.passed);

    return {
      stationId,
      file,
      observed: Boolean(gate.observed),
      apiReady: Boolean(gate.apiReady),
      evidenceReady: Boolean(gate.evidenceReady),
      releaseAccepted: Boolean(gate.releaseAccepted),
      hardFail: Boolean(gate.hardFail),
      degraded: Boolean(gate.degraded),
      passed,
      firstFailedCoordinate: passed
        ? `NONE_${stationId}_PASSED`
        : safeString(gate.firstFailedCoordinate, `WAITING_${stationId}`),
      recommendedNextFile: safeString(gate.recommendedNextFile, file),
      blockedByChronology: false
    };
  }

  function composeStationBoard(index, f8, macroWest, canvas, f21) {
    const stations = [
      composeStation(STATION_IDS.INDEX_HOST, INDEX_FILE, {
        observed: index.observed,
        apiReady: index.observed,
        evidenceReady: index.indexPairReady,
        passed: index.indexPairReady,
        firstFailedCoordinate: index.holdReason,
        recommendedNextFile: INDEX_FILE
      }),
      composeStation(STATION_IDS.ROUTE_F8, FILE, {
        observed: f8.routeConductorMarkerPresent,
        apiReady: f8.routeConductorApiPresent,
        evidenceReady: f8.f8SelfDutySatisfied,
        passed: f8.f8SelfDutySatisfied,
        firstFailedCoordinate: f8.firstFailedCoordinate,
        recommendedNextFile: FILE
      }),
      composeStation(STATION_IDS.MACRO_WEST, MACRO_WEST_FILE, {
        observed: macroWest.macroWestAuthorityObserved,
        apiReady: macroWest.macroWestAuthorityObserved,
        evidenceReady: macroWest.macroWestAdmissibilityObserved,
        releaseAccepted: macroWest.westCanvasReleaseApproved,
        hardFail: macroWest.westHardBlock,
        passed: macroWest.macroWestAdmissibilityObserved && macroWest.westCanvasReleaseApproved && macroWest.westForwardAllowed && !macroWest.westHardBlock,
        firstFailedCoordinate: macroWest.westFirstFailedCoordinate,
        recommendedNextFile: macroWest.westRecommendedNextRenewalTarget || MACRO_WEST_FILE
      }),
      composeStation(STATION_IDS.CANVAS_HUB, CANVAS_FILE, {
        observed: canvas.currentCanvasParentObserved,
        apiReady: canvas.canvasLocalStationApiReady,
        evidenceReady: canvas.canvasContractAccepted,
        passed: canvas.currentCanvasParentObserved && canvas.canvasContractAccepted && canvas.canvasLocalStationApiReady,
        firstFailedCoordinate: !canvas.currentCanvasParentObserved
          ? "WAITING_CANVAS_AUTHORITY"
          : !canvas.canvasContractAccepted
            ? "WAITING_CURRENT_CANVAS_CONTRACT_OR_LAWFUL_VISIBLE_PROOF_SHAPE"
            : "WAITING_CANVAS_EXPRESSION_HUB_API",
        recommendedNextFile: CANVAS_FILE
      }),
      composeStation(STATION_IDS.VISIBLE_GLOBE, CANVAS_FILE, {
        observed: canvas.visibleBaseGlobeCarrierActive || canvas.canvasMounted || canvas.canvasDrawComplete,
        apiReady: canvas.visibleBaseGlobeCarrierActive || canvas.canvasMounted,
        evidenceReady: canvas.visiblePlanetProofReady,
        passed: canvas.visiblePlanetProofReady && !canvas.f13HardFail,
        firstFailedCoordinate: canvas.f13HardFail ? "CANVAS_F13_HARD_FAIL" : "WAITING_VISIBLE_BASE_GLOBE_PROOF",
        recommendedNextFile: CANVAS_FILE
      }),
      composeStation(STATION_IDS.FINGERS, canvas.nextFingerFile || CANVAS_FILE, {
        observed: canvas.anyFingerTrackActive || canvas.visiblePlanetProofReady,
        apiReady: canvas.anyFingerTrackActive || canvas.visiblePlanetProofReady,
        evidenceReady: canvas.allDeclaredFingerTracksReady || canvas.visiblePlanetProofReady,
        degraded: canvas.visiblePlanetProofReady && !canvas.allDeclaredFingerTracksReady,
        passed: canvas.allDeclaredFingerTracksReady || canvas.visiblePlanetProofReady,
        firstFailedCoordinate: canvas.firstFingerGap,
        recommendedNextFile: canvas.nextFingerFile || CANVAS_FILE
      }),
      composeStation(STATION_IDS.NORTH_F21, NORTH_FILE, {
        observed: true,
        apiReady: true,
        evidenceReady: f21.f21EligibleForNorth,
        passed: f21.f21EligibleForNorth,
        firstFailedCoordinate: f21.firstFailedCoordinate,
        recommendedNextFile: NORTH_FILE
      })
    ];

    let firstFailed = null;
    let chronologicalGatesSatisfied = 0;
    let blocked = false;

    for (const station of stations) {
      if (blocked) {
        station.blockedByChronology = true;
        continue;
      }

      if (station.passed) {
        chronologicalGatesSatisfied += 1;
        continue;
      }

      firstFailed = station;
      blocked = true;
    }

    return {
      stationBoardComposed: true,
      chronologicalGateCount: stations.length,
      chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: firstFailed ? firstFailed.stationId : "NONE",
      chronologicalFirstFailedCoordinate: firstFailed ? firstFailed.firstFailedCoordinate : "NONE_CHRONOLOGY_COMPLETE",
      stations,
      composedAt: nowIso()
    };
  }

  function computeFibonacci(board, canvas) {
    const count = safeNumber(board.chronologicalGateCount, CHRONOLOGY.length);
    const satisfied = safeNumber(board.chronologicalGatesSatisfied, 0);
    const score = Math.round((satisfied / count) * 100);
    const hardFailStation = (board.stations || []).find((station) => station.hardFail);

    const passed = Boolean(
      satisfied === count &&
      canvas.f13CanvasEvidenceStrict &&
      !hardFailStation &&
      !canvas.f13HardFail
    );

    const degraded = Boolean(
      !passed &&
      canvas.visiblePlanetProofReady &&
      canvas.f13CanvasEvidenceComplete &&
      !hardFailStation &&
      !canvas.f13HardFail
    );

    return {
      chronologicalGateCount: count,
      chronologicalGatesSatisfied: satisfied,
      chronologicalFirstFailedGate: board.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: board.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationScore: score,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationSatisfied: score,
      fibonacciSynchronizationPassed: passed,
      fibonacciSynchronizationDegraded: degraded,
      fibonacciSynchronizationHardFail: Boolean(hardFailStation || canvas.f13HardFail),
      fibonacciSynchronizationHoldReason: passed
        ? "NONE_FIBONACCI_SYNCHRONIZATION_STRICT_PASS"
        : hardFailStation
          ? hardFailStation.firstFailedCoordinate
          : board.chronologicalFirstFailedCoordinate
    };
  }

  function selectNextFile(index, f8, macroWest, canvas, f21) {
    if (!index.indexPairReady) return INDEX_FILE;
    if (!f8.f8SelfDutySatisfied) return FILE;
    if (!macroWest.macroWestAdmissibilityObserved || !macroWest.westCanvasReleaseApproved || macroWest.westHardBlock) return MACRO_WEST_FILE;
    if (!canvas.currentCanvasParentObserved || !canvas.canvasContractAccepted || !canvas.canvasLocalStationApiReady) return CANVAS_FILE;
    if (!canvas.visiblePlanetProofReady) return CANVAS_FILE;
    if (!canvas.allDeclaredFingerTracksReady && canvas.nextFingerFile) return canvas.nextFingerFile;
    if (canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict) return canvas.f13StrictEvidenceRepairTarget || canvas.nextFingerFile || CANVAS_FILE;
    if (f21.f21EligibleForNorth) return NORTH_FILE;
    return canvas.nextFingerFile || CANVAS_FILE;
  }

  function composeVisibleState(packet = {}) {
    const p = isObject(packet) ? packet : {};

    const visibleProgress = p.f21EligibleForNorth
      ? 94
      : p.visiblePlanetProofReady
        ? p.f13CanvasEvidenceStrict ? 90 : 82
        : p.visibleBaseGlobeCarrierActive || p.canvasDrawComplete
          ? 76
          : p.expressionHubActive || p.fingerManagerActive
            ? 66
            : p.currentCanvasParentObserved
              ? 56
              : p.macroWestAdmissibilityObserved
                ? 48
                : p.indexPairReady
                  ? 42
                  : p.f8SelfDutySatisfied
                    ? 34
                    : 24;

    const visibleStatusText = p.f21EligibleForNorth
      ? "Ready for North latch"
      : p.visiblePlanetProofReady
        ? p.f13CanvasEvidenceStrict
          ? "Visible globe proof ingested · strict F13 complete"
          : "Visible globe proof ingested · downstream expression pending"
        : p.visibleBaseGlobeCarrierActive || p.canvasDrawComplete
          ? "Visible carrier observed · waiting proof receipt"
          : p.expressionHubActive || p.fingerManagerActive
            ? "Canvas expression hub observed · waiting visible globe proof"
            : p.currentCanvasParentObserved
              ? "Canvas observed · waiting current expression-hub proof"
              : "Waiting Canvas expression hub";

    return {
      visibleProgress,
      visibleStatusText,
      activeCycleNumber: p.activeCycleNumber,
      activeCycleRoute: p.activeCycleRoute,
      activeFibonacci: p.activeFibonacci,
      activeCycleHandoffTarget: p.activeCycleHandoffTarget,
      currentCanvasParentContract: p.currentCanvasParentContract,
      expressionHubActive: p.expressionHubActive,
      fingerManagerActive: p.fingerManagerActive,
      visibleBaseGlobeCarrierActive: p.visibleBaseGlobeCarrierActive,
      canvasMounted: p.canvasMounted,
      canvasDrawComplete: p.canvasDrawComplete,
      baseGlobeDrawComplete: p.baseGlobeDrawComplete,
      baseGlobeVisibleCarrierReady: p.baseGlobeVisibleCarrierReady,
      visiblePlanetProofReady: p.visiblePlanetProofReady,
      visiblePlanetProofSource: p.visiblePlanetProofSource,
      f13CanvasEvidenceStrict: p.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: p.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: p.f13CanvasEvidenceComplete,
      firstFailedCoordinate: p.firstFailedCoordinate,
      recommendedNextFile: p.recommendedNextFile,
      postgameStatus: p.postgameStatus,
      ...FINAL_FALSE
    };
  }

  function composePrimaryPacket(input = {}, options = {}) {
    try {
      const allowDelivery = options.allowDelivery === true;

      const index = readIndexAuthority();
      const f8 = resolveF8SelfDuty();
      const macroWest = classifyMacroWest(index, f8);
      const canvasBefore = readCanvasSummary();

      const releasePacket = composeCanvasReleasePacket(index, f8, macroWest, canvasBefore);

      if (allowDelivery && releasePacket.canvasReleaseAuthorized) {
        deliverReleaseToCanvas(canvasBefore, releasePacket);
      }

      const canvas = allowDelivery ? readCanvasSummary() : canvasBefore;
      const news = resolveNews(index, f8, macroWest, canvas);
      const f21 = resolveF21(index, f8, macroWest, canvas, news);
      const stationBoard = composeStationBoard(index, f8, macroWest, canvas, f21);
      const fibonacci = computeFibonacci(stationBoard, canvas);
      const recommendedNextFile = selectNextFile(index, f8, macroWest, canvas, f21);

      const firstFailedCoordinate = stationBoard.chronologicalFirstFailedCoordinate !== "NONE_CHRONOLOGY_COMPLETE"
        ? stationBoard.chronologicalFirstFailedCoordinate
        : f21.firstFailedCoordinate || "NONE_ROUTE_CONDUCTOR_VISIBLE_GLOBE_PROOF_CHAIN_COMPLETE";

      const postgameStatus = f21.f21EligibleForNorth
        ? "VISIBLE_GLOBE_PROOF_CHAIN_READY_FOR_NORTH"
        : canvas.visiblePlanetProofReady
          ? canvas.f13CanvasEvidenceStrict
            ? "VISIBLE_GLOBE_PROOF_INGESTED_STRICT_F13_COMPLETE"
            : "VISIBLE_GLOBE_PROOF_INGESTED_DOWNSTREAM_EXPRESSION_PENDING"
          : canvas.visibleBaseGlobeCarrierActive || canvas.canvasDrawComplete
            ? "VISIBLE_CARRIER_OBSERVED_WAITING_PROOF_RECEIPT"
            : canvas.expressionHubActive || canvas.fingerManagerActive
              ? "CANVAS_EXPRESSION_HUB_ACTIVE_WAITING_VISIBLE_GLOBE_PROOF"
              : canvas.currentCanvasParentObserved
                ? "CANVAS_OBSERVED_WAITING_CURRENT_EXPRESSION_HUB_PROOF"
                : "WAITING_CANVAS_EXPRESSION_HUB";

      const packet = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        previousReceipt: PREVIOUS_RECEIPT,
        compatibilityRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
        compatibilityRouteConductorReceipt: COMPAT_ROUTE_CONDUCTOR_RECEIPT,
        lineageContract: LINEAGE_CONTRACT,
        lineageReceipt: LINEAGE_RECEIPT,
        legacyNorthStarContract: LEGACY_NORTH_STAR_CONTRACT,
        legacyNorthStarReceipt: LEGACY_NORTH_STAR_RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        diagnosticRoute: DIAGNOSTIC_ROUTE,
        role: state.role,

        routeConductorAuthorityCardinal: CARDINALS.NORTH,
        activeCycleInputCardinal: CARDINALS.SOUTH,
        activeCycleHandoffTarget: releasePacket.canvasReleaseAuthorized ? CARDINALS.CANVAS : CARDINALS.WEST,
        activeCycleNumber: 2,
        activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
        cycleNumber: 2,
        cycleRoute: CYCLE_ROUTES.CYCLE_2,
        activeFibonacci: "F8",
        activeStageId: state.activeStageId,
        activeGearId: state.activeGearId,

        visibleGlobeProofIngestionActive: true,
        canvasExpressionHubSpreadRecognitionActive: true,
        canvasLocalStationBridgePreserved: true,
        diagnosticBridgeActive: true,
        routeConductorReceiptChainActive: true,

        activeCanvasContracts: ACTIVE_CANVAS_CONTRACTS.slice(),
        recognizedCanvasBaselineContracts: CANVAS_BASELINE_CONTRACTS.slice(),
        fingerSequence: FINGER_SEQUENCE.slice(),
        fingerFiles: clonePlain(FINGER_FILES),

        indexAuthorityObserved: index.observed,
        indexPairReady: index.indexPairReady,
        indexMountPresent: index.mountPresent,
        carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
        carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
        indexHandoffToRouteConductor: index.indexHandoffToRouteConductor,
        indexHoldReason: index.holdReason,

        routeConductorMarkerPresent: f8.routeConductorMarkerPresent,
        routeConductorApiPresent: f8.routeConductorApiPresent,
        routeConductorReceiptPresent: f8.routeConductorReceiptPresent,
        routeConductorRuntimeActive: f8.routeConductorRuntimeActive,
        routeF8GateReady: f8.routeF8GateReady,
        f8SelfDutySatisfied: f8.f8SelfDutySatisfied,

        macroWestAuthorityObserved: macroWest.macroWestAuthorityObserved,
        macroWestAdmissibilityObserved: macroWest.macroWestAdmissibilityObserved,
        macroWestMethodUsed: macroWest.macroWestMethodUsed,
        macroWestContract: macroWest.macroWestContract,
        westDecision: macroWest.westDecision,
        westHardBlock: macroWest.westHardBlock,
        westForwardAllowed: macroWest.westForwardAllowed,
        westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,
        westFirstFailedCoordinate: macroWest.westFirstFailedCoordinate,
        westRecommendedNextRenewalTarget: macroWest.westRecommendedNextRenewalTarget,

        canvasAuthorityObserved: canvas.observed,
        canvasAuthoritySourceName: canvas.authoritySourceName,
        canvasSummaryObserved: canvas.summaryObserved,
        canvasSummaryMethod: canvas.method,
        canvasSummaryAcceptedByContract: canvas.canvasSummaryAcceptedByContract,
        canvasSummaryAcceptedByShape: canvas.canvasSummaryAcceptedByShape,
        canvasSummaryShapeTrusted: canvas.canvasSummaryShapeTrusted,
        canvasContractAccepted: canvas.canvasContractAccepted,
        canvasBaselineOnly: canvas.canvasBaselineOnly,

        currentCanvasParentObserved: canvas.currentCanvasParentObserved,
        currentCanvasParentContractObserved: canvas.currentCanvasParentContractObserved,
        currentCanvasParentContract: canvas.currentCanvasParentContract,
        currentCanvasParentReceipt: canvas.currentCanvasParentReceipt,
        currentCanvasParentIsLocalStation: canvas.currentCanvasParentIsLocalStation,
        currentCanvasParentIsExpressionHub: canvas.currentCanvasParentIsExpressionHub,
        currentCanvasParentIsFingerManager: canvas.currentCanvasParentIsFingerManager,
        currentCanvasParentIsVisibleBaseGlobeCarrier: canvas.currentCanvasParentIsVisibleBaseGlobeCarrier,
        canvasParentBootMethodAvailable: canvas.canvasParentBootMethodAvailable,

        expressionHubActive: canvas.expressionHubActive,
        canvasExpressionHubActive: canvas.canvasExpressionHubActive,
        fingerManagerActive: canvas.fingerManagerActive,
        canvasFingerManagerActive: canvas.canvasFingerManagerActive,
        fingerRegistryActive: canvas.fingerRegistryActive,
        namedFingerFilesEmbedded: canvas.namedFingerFilesEmbedded,
        downstreamFingerTracksDeclared: canvas.downstreamFingerTracksDeclared,

        visibleBaseGlobeCarrierActive: canvas.visibleBaseGlobeCarrierActive,
        canvasVisibleBaseGlobeCarrierActive: canvas.canvasVisibleBaseGlobeCarrierActive,
        canvasMounted: canvas.canvasMounted,
        canvasDrawComplete: canvas.canvasDrawComplete,
        baseGlobeDrawComplete: canvas.baseGlobeDrawComplete,
        baseGlobeVisibleCarrierReady: canvas.baseGlobeVisibleCarrierReady,
        visibleGlobeCarrierReady: canvas.visibleGlobeCarrierReady,
        visiblePlanetProofReady: canvas.visiblePlanetProofReady,
        visiblePlanetProofSource: canvas.visiblePlanetProofSource,
        visiblePlanetProofIngestedByRoute: canvas.visiblePlanetProofIngestedByRoute,
        visiblePlanetReceiptObserved: canvas.visiblePlanetReceiptObserved,

        fingerAuthorityObservedCount: canvas.fingerAuthorityObservedCount,
        fingerApiReadyCount: canvas.fingerApiReadyCount,
        fingerExpressionPacketCount: canvas.fingerExpressionPacketCount,
        fingerReceiptPacketCount: canvas.fingerReceiptPacketCount,
        fingerTrackReadyCount: canvas.fingerTrackReadyCount,
        fingerHardFailCount: canvas.fingerHardFailCount,
        anyFingerTrackActive: canvas.anyFingerTrackActive,
        allDeclaredFingerTracksReady: canvas.allDeclaredFingerTracksReady,
        firstFingerGap: canvas.firstFingerGap,
        firstFingerGapFile: canvas.firstFingerGapFile,
        nextFingerKey: canvas.nextFingerKey,
        nextFingerFile: canvas.nextFingerFile,

        canvasParentReleaseAccepted: canvas.canvasParentReleaseAccepted,
        canvasParentReleaseObserved: canvas.canvasParentReleaseObserved,
        parentReleaseLawful: canvas.parentReleaseLawful,
        parentAcceptedRouteConductorRelease: canvas.parentAcceptedRouteConductorRelease,
        parentReleasePacketSentToEast: canvas.parentReleasePacketSentToEast,
        parentReleasePacketLawful: canvas.parentReleasePacketLawful,
        eastDispatchAuthorized: canvas.eastDispatchAuthorized,
        eastDispatchPacketPublished: canvas.eastDispatchPacketPublished,

        canvasEastApiReady: canvas.canvasEastApiReady,
        canvasEastEvidenceReady: canvas.canvasEastEvidenceReady,
        canvasWestApiReady: canvas.canvasWestApiReady,
        canvasWestInspectionReady: canvas.canvasWestInspectionReady,
        canvasSouthApiReady: canvas.canvasSouthApiReady,
        canvasSouthVisibleProofReady: canvas.canvasSouthVisibleProofReady,
        allCanvasChildrenApiReady: canvas.allCanvasChildrenApiReady,
        allCanvasChildrenEvidenceReady: canvas.allCanvasChildrenEvidenceReady,
        allCanvasChildrenReady: canvas.allCanvasChildrenReady,

        f13CanvasReadinessObserved: canvas.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: canvas.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: canvas.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: canvas.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: canvas.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: canvas.f13CanvasEvidenceComplete,
        f13HardFail: canvas.f13HardFail,
        f13StrictEvidenceGap: canvas.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: canvas.f13StrictEvidenceRepairTarget,
        degradedF13IsFunctional: canvas.degradedF13IsFunctional,
        strictVisualProofPending: canvas.strictVisualProofPending,
        functionalPageObserved: canvas.functionalPageObserved,

        indexGateReady: news.indexGateReady,
        routeF8GateReady: news.routeF8GateReady,
        macroWestGateReady: news.macroWestGateReady,
        canvasHubGateReady: news.canvasHubGateReady,
        visibleGlobeGateReady: news.visibleGlobeGateReady,
        fingerTrackGateReady: news.fingerTrackGateReady,
        canvasGateReady: news.canvasGateReady,
        newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,

        ...fibonacci,

        canvasReleaseAuthorized: releasePacket.canvasReleaseAuthorized,
        canvasReleasePacketReady: releasePacket.canvasReleasePacketReady,
        canvasReleaseHeldReason: releasePacket.canvasReleaseHeldReason,
        canvasReleasePacketPublished: releasePacket.canvasReleaseAuthorized,
        canvasReleasePacketDelivered: state.canvasReleasePacketDelivered,
        canvasReleaseDeliveryMethod: state.canvasReleaseDeliveryMethod,
        canvasReleaseAcceptedByCanvas: state.canvasReleaseAcceptedByCanvas,

        f21EligibleForNorth: false,
        f21EligibilitySubmittedToNorth: false,
        f21LatchMode: f21.f21LatchMode,
        f21NorthLatchOnly: true,
        routeMaySubmitF21EligibilityOnly: true,
        northRepairRequired: false,
        northRepairReason: "NONE",

        stationBoard,
        canvasSummary: clonePlain(canvas),
        canvasReleasePacket: clonePlain(releasePacket),

        firstFailedCoordinate,
        recommendedNextFile,
        recommendedNextRenewalTarget: recommendedNextFile,
        canvasNextAuditTarget: canvas.recommendedNextFile || recommendedNextFile,
        postgameStatus,

        ...FINAL_FALSE,

        composedAt: nowIso()
      };

      packet.visibleState = composeVisibleState(packet);
      return packet;
    } catch (error) {
      recordError("COMPOSE_PRIMARY_PACKET_FAILED", error);
      return composeFallbackPacket(error);
    }
  }

  function composeFallbackPacket(error = null) {
    const message = error && error.message ? error.message : safeString(error, "route-conductor-v9-5-fallback");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      role: state.role,
      routeConductorFallbackUsed: true,
      routeConductorCompositionOk: false,
      routeConductorCompositionError: message,
      visibleGlobeProofIngestionActive: true,
      receiveCanvasStationSummaryAvailable: true,
      receiveCanvasLocalStationSummaryAvailable: true,
      receiveCanvasParentSummaryAvailable: true,
      receiveCanvasExpressionHubSummaryAvailable: true,
      receiveVisibleBaseGlobeReceiptAvailable: true,
      firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_V9_5_COMPOSITION",
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      canvasNextAuditTarget: CANVAS_FILE,
      postgameStatus: "ROUTE_CONDUCTOR_V9_5_FALLBACK_ACTIVE",
      ...FINAL_FALSE,
      composedAt: nowIso()
    };
  }

  function updateStateFromPacket(packet) {
    const p = isObject(packet) ? packet : composeFallbackPacket();

    state.currentPacket = clonePlain(p);
    state.currentReceipt = composeReceipt(p);
    state.currentReceiptText = composeReceiptText(state.currentReceipt);

    const boolKeys = [
      "indexAuthorityObserved",
      "indexPairReady",
      "indexMountPresent",
      "carrierHostAdmissibilityReady",
      "carrierHostAdmissibilityPacketReady",
      "indexHandoffToRouteConductor",
      "routeConductorMarkerPresent",
      "routeConductorApiPresent",
      "routeConductorReceiptPresent",
      "routeConductorRuntimeActive",
      "routeF8GateReady",
      "macroWestAuthorityObserved",
      "macroWestAdmissibilityObserved",
      "westHardBlock",
      "westForwardAllowed",
      "westCanvasReleaseApproved",
      "canvasAuthorityObserved",
      "canvasSummaryObserved",
      "canvasSummaryAcceptedByContract",
      "canvasSummaryAcceptedByShape",
      "canvasSummaryShapeTrusted",
      "canvasContractAccepted",
      "canvasBaselineOnly",
      "currentCanvasParentObserved",
      "currentCanvasParentContractObserved",
      "currentCanvasParentIsLocalStation",
      "currentCanvasParentIsExpressionHub",
      "currentCanvasParentIsFingerManager",
      "currentCanvasParentIsVisibleBaseGlobeCarrier",
      "canvasParentBootMethodAvailable",
      "expressionHubActive",
      "canvasExpressionHubActive",
      "fingerManagerActive",
      "canvasFingerManagerActive",
      "fingerRegistryActive",
      "namedFingerFilesEmbedded",
      "downstreamFingerTracksDeclared",
      "visibleBaseGlobeCarrierActive",
      "canvasVisibleBaseGlobeCarrierActive",
      "canvasMounted",
      "canvasDrawComplete",
      "baseGlobeDrawComplete",
      "baseGlobeVisibleCarrierReady",
      "visibleGlobeCarrierReady",
      "visiblePlanetProofReady",
      "visiblePlanetProofIngestedByRoute",
      "visiblePlanetReceiptObserved",
      "anyFingerTrackActive",
      "allDeclaredFingerTracksReady",
      "canvasParentReleaseAccepted",
      "canvasParentReleaseObserved",
      "parentReleaseLawful",
      "parentAcceptedRouteConductorRelease",
      "parentReleasePacketSentToEast",
      "parentReleasePacketLawful",
      "eastDispatchAuthorized",
      "eastDispatchPacketPublished",
      "canvasEastApiReady",
      "canvasEastEvidenceReady",
      "canvasWestApiReady",
      "canvasWestInspectionReady",
      "canvasSouthApiReady",
      "canvasSouthVisibleProofReady",
      "allCanvasChildrenApiReady",
      "allCanvasChildrenEvidenceReady",
      "allCanvasChildrenReady",
      "f13CanvasReadinessObserved",
      "f13VisibleEvidenceAvailable",
      "f13InspectEvidenceAvailable",
      "f13CanvasEvidenceStrict",
      "f13CanvasEvidenceDegraded",
      "f13CanvasEvidenceComplete",
      "f13HardFail",
      "degradedF13IsFunctional",
      "strictVisualProofPending",
      "functionalPageObserved",
      "indexGateReady",
      "routeF8GateReady",
      "macroWestGateReady",
      "canvasHubGateReady",
      "visibleGlobeGateReady",
      "fingerTrackGateReady",
      "canvasGateReady",
      "newsGatePassedBeforeF21",
      "newsGateDegradedBeforeF21",
      "fibonacciSynchronizationPassed",
      "fibonacciSynchronizationDegraded",
      "fibonacciSynchronizationHardFail",
      "canvasReleaseAuthorized",
      "canvasReleasePacketReady",
      "canvasReleasePacketPublished"
    ];

    boolKeys.forEach((key) => {
      if (key in p) state[key] = p[key] === true;
    });

    state.activeCycleHandoffTarget = p.activeCycleHandoffTarget || (p.canvasReleaseAuthorized ? CARDINALS.CANVAS : CARDINALS.WEST);
    state.indexHoldReason = p.indexHoldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY";
    state.macroWestMethodUsed = p.macroWestMethodUsed || "NONE";
    state.macroWestContract = p.macroWestContract || "";
    state.westDecision = p.westDecision || "UNKNOWN";
    state.westFirstFailedCoordinate = p.westFirstFailedCoordinate || "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION";
    state.westRecommendedNextRenewalTarget = p.westRecommendedNextRenewalTarget || MACRO_WEST_FILE;

    state.canvasAuthoritySourceName = p.canvasAuthoritySourceName || "NONE";
    state.canvasSummaryMethod = p.canvasSummaryMethod || "NONE";
    state.currentCanvasParentContract = p.currentCanvasParentContract || "";
    state.currentCanvasParentReceipt = p.currentCanvasParentReceipt || "";
    state.visiblePlanetProofSource = p.visiblePlanetProofSource || "NONE";

    state.fingerAuthorityObservedCount = safeNumber(p.fingerAuthorityObservedCount, 0);
    state.fingerApiReadyCount = safeNumber(p.fingerApiReadyCount, 0);
    state.fingerExpressionPacketCount = safeNumber(p.fingerExpressionPacketCount, 0);
    state.fingerReceiptPacketCount = safeNumber(p.fingerReceiptPacketCount, 0);
    state.fingerTrackReadyCount = safeNumber(p.fingerTrackReadyCount, 0);
    state.fingerHardFailCount = safeNumber(p.fingerHardFailCount, 0);
    state.firstFingerGap = p.firstFingerGap || "WAITING_FIRST_DOWNSTREAM_FINGER_FILE";
    state.firstFingerGapFile = p.firstFingerGapFile || FINGER_FILES.boundary;
    state.nextFingerKey = p.nextFingerKey || "boundary";
    state.nextFingerFile = p.nextFingerFile || FINGER_FILES.boundary;

    state.f13StrictEvidenceGap = p.f13StrictEvidenceGap || "WAITING_VISIBLE_BASE_GLOBE_PROOF";
    state.f13StrictEvidenceRepairTarget = p.f13StrictEvidenceRepairTarget || CANVAS_FILE;

    state.chronologicalGateCount = safeNumber(p.chronologicalGateCount, CHRONOLOGY.length);
    state.chronologicalGatesSatisfied = safeNumber(p.chronologicalGatesSatisfied, 0);
    state.chronologicalFirstFailedGate = p.chronologicalFirstFailedGate || STATION_IDS.INDEX_HOST;
    state.chronologicalFirstFailedCoordinate = p.chronologicalFirstFailedCoordinate || "WAITING_BOOT";

    state.fibonacciSynchronizationScore = safeNumber(p.fibonacciSynchronizationScore, 0);
    state.fibonacciSynchronizationExpected = safeNumber(p.fibonacciSynchronizationExpected, 100);
    state.fibonacciSynchronizationSatisfied = safeNumber(p.fibonacciSynchronizationSatisfied, 0);
    state.fibonacciSynchronizationHoldReason = p.fibonacciSynchronizationHoldReason || "WAITING_BOOT";

    state.canvasReleaseHeldReason = p.canvasReleaseHeldReason || "WAITING_CANVAS_RELEASE_AUTHORIZATION";
    state.f21LatchMode = p.f21LatchMode || "WAITING_VISIBLE_GLOBE_PROOF_CHAIN";

    state.firstFailedCoordinate = p.firstFailedCoordinate || "WAITING_ROUTE_CONDUCTOR_V9_5";
    state.recommendedNextFile = p.recommendedNextFile || FILE;
    state.recommendedNextRenewalTarget = p.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.canvasNextAuditTarget = p.canvasNextAuditTarget || CANVAS_FILE;
    state.postgameStatus = p.postgameStatus || "ACTIVE";

    state.stationBoard = clonePlain(p.stationBoard || null);
    state.currentCanvasSummary = clonePlain(p.canvasSummary || state.currentCanvasSummary || null);
    state.currentCanvasReleasePacket = clonePlain(p.canvasReleasePacket || state.currentCanvasReleasePacket || null);

    state.updatedAt = nowIso();

    Object.assign(state, FINAL_FALSE);
    updateDataset();

    return p;
  }

  function refresh(input = {}) {
    const packet = composePrimaryPacket(input, { allowDelivery: true });
    updateStateFromPacket(packet);
    scheduleRender();
    publishGlobals("refresh-v9-5-visible-globe-proof-ingestion", false);
    return getReceiptLight(false);
  }

  function observePassive(input = {}) {
    state.passiveObservationTicks += 1;

    const packet = composePrimaryPacket(input, { allowDelivery: false });
    updateStateFromPacket(packet);

    record("ROUTE_CONDUCTOR_V9_5_PASSIVE_VISIBLE_GLOBE_OBSERVATION", {
      tick: state.passiveObservationTicks,
      currentCanvasParentContract: packet.currentCanvasParentContract,
      expressionHubActive: packet.expressionHubActive,
      fingerManagerActive: packet.fingerManagerActive,
      visiblePlanetProofReady: packet.visiblePlanetProofReady,
      visiblePlanetProofSource: packet.visiblePlanetProofSource,
      firstFailedCoordinate: packet.firstFailedCoordinate,
      recommendedNextFile: packet.recommendedNextFile
    });

    scheduleRender();
    publishGlobals("passive-v9-5-visible-globe-proof-observation", false);
    return getReceiptLight(false);
  }

  function getReadOnlyCanvasReleasePacket() {
    if (isObject(state.currentCanvasReleasePacket)) return clonePlain(state.currentCanvasReleasePacket);

    const packet = state.currentPacket && isObject(state.currentPacket.canvasReleasePacket)
      ? state.currentPacket.canvasReleasePacket
      : null;

    return packet ? clonePlain(packet) : null;
  }

  function getCanvasReleasePacket() {
    return getReadOnlyCanvasReleasePacket();
  }

  function getReleasePacket() {
    return getReadOnlyCanvasReleasePacket();
  }

  function getCanvasHandoffPacket() {
    return getReadOnlyCanvasReleasePacket();
  }

  function getHandoffPacket() {
    return getReadOnlyCanvasReleasePacket();
  }

  function composeCompatibilityReceiptV94() {
    const light = state.currentPacket || composePrimaryPacket({}, { allowDelivery: false });
    const releasePacket = getReadOnlyCanvasReleasePacket();

    const compat = {
      contract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      receipt: COMPAT_ROUTE_CONDUCTOR_RECEIPT,
      compatibilityReceipt: true,
      compatibilitySurfaceForCanvasParentsExpectingV9_4: true,
      supersededByContract: CONTRACT,
      supersededByReceipt: RECEIPT,
      currentRouteConductorContract: CONTRACT,
      currentRouteConductorReceipt: RECEIPT,
      routeConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      routeConductorReceipt: COMPAT_ROUTE_CONDUCTOR_RECEIPT,
      canvasReleasePacket: clonePlain(releasePacket),
      releasePacket: clonePlain(releasePacket),
      routeConductorReleasePacket: clonePlain(releasePacket),

      canvasReleaseAuthorized: light.canvasReleaseAuthorized === true,
      canvasReleasePacketReady: light.canvasReleasePacketReady === true,
      westCanvasReleaseApproved: light.westCanvasReleaseApproved === true,
      westHardBlock: light.westHardBlock === true,
      carrierHostAdmissibilityReady: light.carrierHostAdmissibilityReady === true,
      indexPairReady: light.indexPairReady === true,
      handoffTo: light.canvasReleaseAuthorized === true ? "CANVAS" : "",
      destinationFile: CANVAS_FILE,
      cycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,

      visibleGlobeProofIngestionActive: true,
      expressionHubActive: light.expressionHubActive === true,
      fingerManagerActive: light.fingerManagerActive === true,
      visiblePlanetProofReady: light.visiblePlanetProofReady === true,
      visiblePlanetProofSource: light.visiblePlanetProofSource || "NONE",
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.currentCompatibilityReceipt = clonePlain(compat);
    return compat;
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) {
      const packet = composePrimaryPacket({}, { allowDelivery: false });
      updateStateFromPacket(packet);
    }

    const packet = state.currentPacket || composePrimaryPacket({}, { allowDelivery: false });

    return {
      ...clonePlain(packet),
      currentReceiptLight: true,
      receiveCanvasStationSummaryAvailable: true,
      receiveCanvasLocalStationSummaryAvailable: true,
      receiveCanvasParentSummaryAvailable: true,
      receiveCanvasExpressionHubSummaryAvailable: true,
      receiveExpressionHubSummaryAvailable: true,
      receiveVisibleBaseGlobeReceiptAvailable: true,
      receiveVisibleGlobeReceiptAvailable: true,
      receiveVisiblePlanetReceiptAvailable: true,
      receiveCanvasVisibleProofAvailable: true,
      reconcileCanvasAvailable: true,
      compatibilityReceiptV94Available: true,
      activeCanvasContracts: ACTIVE_CANVAS_CONTRACTS.slice(),
      recognizedCanvasBaselineContracts: CANVAS_BASELINE_CONTRACTS.slice(),
      renderCount: state.renderCount,
      watchdogTicks: state.watchdogTicks,
      passiveObservationTicks: state.passiveObservationTicks,
      booted: state.booted,
      booting: state.booting,
      latestEvent: state.latestEvent,
      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      updatedAt: state.updatedAt || nowIso(),
      ...FINAL_FALSE
    };
  }

  function composeReceipt(input = {}) {
    const packet = input && input.contract === CONTRACT ? input : composePrimaryPacket(input, { allowDelivery: false });

    return {
      ...clonePlain(packet),
      authority: "hearth-route-conductor-canvas-expression-hub-visible-globe-proof-ingestion",
      status: "active",
      receiptComposed: true,
      currentReceipt: true,
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    const receipt = getReceiptLight(false);

    return {
      ...receipt,
      files: {
        routeConductor: FILE,
        index: INDEX_FILE,
        canvas: CANVAS_FILE,
        macroWest: MACRO_WEST_FILE,
        north: NORTH_FILE,
        fingers: clonePlain(FINGER_FILES)
      },
      stationIds: clonePlain(STATION_IDS),
      activeCanvasContracts: ACTIVE_CANVAS_CONTRACTS.slice(),
      recognizedCanvasBaselineContracts: CANVAS_BASELINE_CONTRACTS.slice(),
      stationBoard: clonePlain(state.stationBoard),
      canvasSummary: clonePlain(state.currentCanvasSummary),
      canvasReleasePacket: clonePlain(state.currentCanvasReleasePacket),
      compatibilityReceiptV94: composeCompatibilityReceiptV94(),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      currentReceiptText: composeReceiptText(receipt),
      ...FINAL_FALSE
    };
  }

  function composeReceiptText(receipt = {}) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT",
      "",
      line("contract", r.contract || CONTRACT),
      line("receipt", r.receipt || RECEIPT),
      line("previousContract", r.previousContract || PREVIOUS_CONTRACT),
      line("previousReceipt", r.previousReceipt || PREVIOUS_RECEIPT),
      line("compatibilityRouteConductorContract", COMPAT_ROUTE_CONDUCTOR_CONTRACT),
      line("compatibilityRouteConductorReceipt", COMPAT_ROUTE_CONDUCTOR_RECEIPT),
      line("lineageContract", LINEAGE_CONTRACT),
      line("lineageReceipt", LINEAGE_RECEIPT),
      line("legacyNorthStarContract", LEGACY_NORTH_STAR_CONTRACT),
      line("legacyNorthStarReceipt", LEGACY_NORTH_STAR_RECEIPT),
      line("baselineContract", BASELINE_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      line("diagnosticRoute", DIAGNOSTIC_ROUTE),
      line("role", state.role),
      "",
      "VISIBLE_GLOBE_PROOF_INGESTION",
      line("visibleGlobeProofIngestionActive", true),
      line("canvasExpressionHubSpreadRecognitionActive", true),
      line("canvasLocalStationBridgePreserved", true),
      line("routeConductorReceiptChainActive", true),
      line("canvasAuthorityObserved", r.canvasAuthorityObserved === true),
      line("canvasAuthoritySourceName", r.canvasAuthoritySourceName || ""),
      line("canvasSummaryObserved", r.canvasSummaryObserved === true),
      line("canvasSummaryMethod", r.canvasSummaryMethod || ""),
      line("canvasSummaryAcceptedByContract", r.canvasSummaryAcceptedByContract === true),
      line("canvasSummaryAcceptedByShape", r.canvasSummaryAcceptedByShape === true),
      line("canvasSummaryShapeTrusted", r.canvasSummaryShapeTrusted === true),
      line("canvasContractAccepted", r.canvasContractAccepted === true),
      "",
      "CURRENT_CANVAS_SPREAD",
      line("currentCanvasParentObserved", r.currentCanvasParentObserved === true),
      line("currentCanvasParentContractObserved", r.currentCanvasParentContractObserved === true),
      line("currentCanvasParentContract", r.currentCanvasParentContract || ""),
      line("currentCanvasParentReceipt", r.currentCanvasParentReceipt || ""),
      line("currentCanvasParentIsLocalStation", r.currentCanvasParentIsLocalStation === true),
      line("currentCanvasParentIsExpressionHub", r.currentCanvasParentIsExpressionHub === true),
      line("currentCanvasParentIsFingerManager", r.currentCanvasParentIsFingerManager === true),
      line("currentCanvasParentIsVisibleBaseGlobeCarrier", r.currentCanvasParentIsVisibleBaseGlobeCarrier === true),
      line("canvasParentBootMethodAvailable", r.canvasParentBootMethodAvailable === true),
      "",
      "EXPRESSION_HUB",
      line("expressionHubActive", r.expressionHubActive === true),
      line("canvasExpressionHubActive", r.canvasExpressionHubActive === true),
      line("fingerManagerActive", r.fingerManagerActive === true),
      line("canvasFingerManagerActive", r.canvasFingerManagerActive === true),
      line("fingerRegistryActive", r.fingerRegistryActive === true),
      line("namedFingerFilesEmbedded", r.namedFingerFilesEmbedded === true),
      line("downstreamFingerTracksDeclared", r.downstreamFingerTracksDeclared === true),
      "",
      "VISIBLE_PLANET_PROOF",
      line("visibleBaseGlobeCarrierActive", r.visibleBaseGlobeCarrierActive === true),
      line("canvasVisibleBaseGlobeCarrierActive", r.canvasVisibleBaseGlobeCarrierActive === true),
      line("canvasMounted", r.canvasMounted === true),
      line("canvasDrawComplete", r.canvasDrawComplete === true),
      line("baseGlobeDrawComplete", r.baseGlobeDrawComplete === true),
      line("baseGlobeVisibleCarrierReady", r.baseGlobeVisibleCarrierReady === true),
      line("visibleGlobeCarrierReady", r.visibleGlobeCarrierReady === true),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady === true),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource || ""),
      line("visiblePlanetProofIngestedByRoute", r.visiblePlanetProofIngestedByRoute === true),
      line("visiblePlanetReceiptObserved", r.visiblePlanetReceiptObserved === true),
      "",
      "FINGER_TRACKS",
      line("fingerAuthorityObservedCount", r.fingerAuthorityObservedCount || 0),
      line("fingerApiReadyCount", r.fingerApiReadyCount || 0),
      line("fingerExpressionPacketCount", r.fingerExpressionPacketCount || 0),
      line("fingerReceiptPacketCount", r.fingerReceiptPacketCount || 0),
      line("fingerTrackReadyCount", r.fingerTrackReadyCount || 0),
      line("fingerHardFailCount", r.fingerHardFailCount || 0),
      line("anyFingerTrackActive", r.anyFingerTrackActive === true),
      line("allDeclaredFingerTracksReady", r.allDeclaredFingerTracksReady === true),
      line("firstFingerGap", r.firstFingerGap || ""),
      line("firstFingerGapFile", r.firstFingerGapFile || ""),
      line("nextFingerKey", r.nextFingerKey || ""),
      line("nextFingerFile", r.nextFingerFile || ""),
      "",
      "ROUTE_AND_RELEASE",
      line("indexPairReady", r.indexPairReady === true),
      line("carrierHostAdmissibilityReady", r.carrierHostAdmissibilityReady === true),
      line("f8SelfDutySatisfied", r.f8SelfDutySatisfied === true),
      line("macroWestAuthorityObserved", r.macroWestAuthorityObserved === true),
      line("macroWestAdmissibilityObserved", r.macroWestAdmissibilityObserved === true),
      line("westDecision", r.westDecision || ""),
      line("westHardBlock", r.westHardBlock === true),
      line("westForwardAllowed", r.westForwardAllowed === true),
      line("westCanvasReleaseApproved", r.westCanvasReleaseApproved === true),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized === true),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady === true),
      line("canvasReleasePacketPublished", r.canvasReleasePacketPublished === true),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason || ""),
      line("canvasReleasePacketDelivered", r.canvasReleasePacketDelivered === true),
      line("canvasReleaseDeliveryMethod", r.canvasReleaseDeliveryMethod || ""),
      line("canvasReleaseAcceptedByCanvas", r.canvasReleaseAcceptedByCanvas === true),
      "",
      "CANVAS_PARENT_AND_CHILD_AGGREGATE",
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted === true),
      line("canvasParentReleaseObserved", r.canvasParentReleaseObserved === true),
      line("parentReleaseLawful", r.parentReleaseLawful === true),
      line("parentAcceptedRouteConductorRelease", r.parentAcceptedRouteConductorRelease === true),
      line("parentReleasePacketSentToEast", r.parentReleasePacketSentToEast === true),
      line("parentReleasePacketLawful", r.parentReleasePacketLawful === true),
      line("eastDispatchAuthorized", r.eastDispatchAuthorized === true),
      line("eastDispatchPacketPublished", r.eastDispatchPacketPublished === true),
      line("canvasEastApiReady", r.canvasEastApiReady === true),
      line("canvasEastEvidenceReady", r.canvasEastEvidenceReady === true),
      line("canvasWestApiReady", r.canvasWestApiReady === true),
      line("canvasWestInspectionReady", r.canvasWestInspectionReady === true),
      line("canvasSouthApiReady", r.canvasSouthApiReady === true),
      line("canvasSouthVisibleProofReady", r.canvasSouthVisibleProofReady === true),
      line("allCanvasChildrenApiReady", r.allCanvasChildrenApiReady === true),
      line("allCanvasChildrenEvidenceReady", r.allCanvasChildrenEvidenceReady === true),
      line("allCanvasChildrenReady", r.allCanvasChildrenReady === true),
      "",
      "F13_AND_NEWS",
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved === true),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable === true),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable === true),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict === true),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded === true),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete === true),
      line("f13HardFail", r.f13HardFail === true),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap || ""),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget || ""),
      line("indexGateReady", r.indexGateReady === true),
      line("routeF8GateReady", r.routeF8GateReady === true),
      line("macroWestGateReady", r.macroWestGateReady === true),
      line("canvasHubGateReady", r.canvasHubGateReady === true),
      line("visibleGlobeGateReady", r.visibleGlobeGateReady === true),
      line("fingerTrackGateReady", r.fingerTrackGateReady === true),
      line("canvasGateReady", r.canvasGateReady === true),
      line("newsGatePassedBeforeF21", r.newsGatePassedBeforeF21 === true),
      line("newsGateDegradedBeforeF21", r.newsGateDegradedBeforeF21 === true),
      "",
      "FIBONACCI_SYNCHRONIZATION",
      line("chronologicalGateCount", r.chronologicalGateCount || 0),
      line("chronologicalGatesSatisfied", r.chronologicalGatesSatisfied || 0),
      line("chronologicalFirstFailedGate", r.chronologicalFirstFailedGate || ""),
      line("chronologicalFirstFailedCoordinate", r.chronologicalFirstFailedCoordinate || ""),
      line("fibonacciSynchronizationScore", r.fibonacciSynchronizationScore || 0),
      line("fibonacciSynchronizationExpected", r.fibonacciSynchronizationExpected || 100),
      line("fibonacciSynchronizationSatisfied", r.fibonacciSynchronizationSatisfied || 0),
      line("fibonacciSynchronizationPassed", r.fibonacciSynchronizationPassed === true),
      line("fibonacciSynchronizationDegraded", r.fibonacciSynchronizationDegraded === true),
      line("fibonacciSynchronizationHardFail", r.fibonacciSynchronizationHardFail === true),
      line("fibonacciSynchronizationHoldReason", r.fibonacciSynchronizationHoldReason || ""),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate || ""),
      line("recommendedNextFile", r.recommendedNextFile || ""),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget || ""),
      line("canvasNextAuditTarget", r.canvasNextAuditTarget || ""),
      line("postgameStatus", r.postgameStatus || ""),
      "",
      "NO_CLAIMS",
      line("f21EligibleForNorth", false),
      line("f21EligibilitySubmittedToNorth", false),
      line("f21SubmittedToNorth", false),
      line("f21ClaimedByRouteConductor", false),
      line("completionLatched", false),
      line("finalCompletionLatched", false),
      line("degradedCompletionLatched", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt || nowIso())
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_VISIBLE_GLOBE_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("expressionHubActive", r.expressionHubActive),
      line("fingerManagerActive", r.fingerManagerActive),
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function renderLanes() {
    const p = state.currentPacket || {};
    const rows = [
      ["F1", "Index host", p.indexPairReady ? "READY" : "WAITING"],
      ["F8", "Route conductor", p.f8SelfDutySatisfied ? "READY" : "WAITING"],
      ["W", "Macro West", p.westCanvasReleaseApproved ? "RELEASE" : p.macroWestAdmissibilityObserved ? "HELD" : "WAITING"],
      ["HUB", "Canvas expression hub", p.expressionHubActive || p.currentCanvasParentIsExpressionHub ? "ACTIVE" : p.currentCanvasParentObserved ? "OBSERVED" : "WAITING"],
      ["GLOBE", "Visible base globe", p.visiblePlanetProofReady ? "PROVEN" : p.visibleBaseGlobeCarrierActive || p.canvasDrawComplete ? "OBSERVED" : "WAITING"],
      ["FINGER", "Finger tracks", p.allDeclaredFingerTracksReady ? "READY" : p.anyFingerTrackActive ? "ACTIVE" : "WAITING"],
      ["NEXT", "Next file", p.recommendedNextFile || state.recommendedNextFile || FILE]
    ];

    return rows.map(([code, label, status]) => {
      const progress =
        status === "READY" || status === "RELEASE" || status === "PROVEN" ? 100 :
          status === "ACTIVE" ? 72 :
            status === "OBSERVED" ? 58 :
              status === "HELD" ? 44 :
                30;

      return [
        `<section class="hearth-ledger-lane" data-lane="${code}" data-status="${String(status).replace(/"/g, "")}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title"><strong>${code} · ${label}</strong><span>V9.5</span></span>`,
        `<span class="hearth-ledger-lane-status">${status}</span>`,
        `</div>`,
        `<div class="hearth-ledger-lane-track"><span class="hearth-ledger-lane-fill" style="width:${progress}%"></span></div>`,
        `</section>`
      ].join("");
    }).join("");
  }

  function render() {
    if (!doc) return;

    scanDomForVisibleCanvas();
    state.renderCount += 1;

    const packet = state.currentPacket || composePrimaryPacket({}, { allowDelivery: false });
    const visible = packet.visibleState || composeVisibleState(packet);

    if (refs.stage) refs.stage.textContent = `${visible.activeCycleRoute || packet.cycleRoute || CYCLE_ROUTES.CYCLE_2} · ${visible.activeFibonacci || packet.activeFibonacci || "F8"}`;
    if (refs.heartbeat) refs.heartbeat.textContent = visible.visibleStatusText || packet.postgameStatus || "Visible globe proof ingestion active";
    if (refs.latest) refs.latest.textContent = `latest=${state.latestEvent}`;
    if (refs.fill) refs.fill.style.width = `${Math.max(0, Math.min(100, safeNumber(visible.visibleProgress, 0)))}%`;
    if (refs.percent) refs.percent.textContent = `${Math.round(Math.max(0, Math.min(100, safeNumber(visible.visibleProgress, 0))))}%`;
    if (refs.lanes) refs.lanes.innerHTML = renderLanes();
    if (refs.status) refs.status.textContent = getStatusText();

    if (refs.receiptText && refs.receiptBox && refs.receiptBox.dataset.visible === "true") {
      refs.receiptText.textContent = getReceiptText();
    }

    updateDataset();
  }

  function scheduleRender() {
    if (renderTimer || !doc) return;

    renderTimer = root.setTimeout(() => {
      renderTimer = 0;
      render();
    }, 80);
  }

  function updateDataset() {
    setDataset("hearthRouteConductorMarkerPresent", "true");
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthRouteConductorPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthRouteConductorCompatibilityContract", COMPAT_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthRouteConductorCompatibilityReceipt", COMPAT_ROUTE_CONDUCTOR_RECEIPT);
    setDataset("hearthRouteConductorVersion", VERSION);
    setDataset("hearthRouteConductorV9_5Active", "true");
    setDataset("hearthRouteConductorV9_4Superseded", "true");

    setDataset("hearthRouteConductorVisibleGlobeProofIngestionActive", "true");
    setDataset("hearthRouteConductorCanvasExpressionHubSpreadRecognitionActive", "true");
    setDataset("hearthRouteConductorCanvasLocalStationBridgePreserved", "true");
    setDataset("hearthRouteConductorReceiptChainActive", "true");

    setDataset("hearthRouteConductorAuthorityCardinal", CARDINALS.NORTH);
    setDataset("hearthRouteConductorActiveCycleInputCardinal", CARDINALS.SOUTH);
    setDataset("hearthRouteConductorActiveCycleHandoffTarget", state.activeCycleHandoffTarget);
    setDataset("hearthRouteConductorActiveCycleNumber", "2");
    setDataset("hearthRouteConductorActiveCycleRoute", CYCLE_ROUTES.CYCLE_2);

    setDataset("hearthSouthIndexPairReady", String(state.indexPairReady));
    setDataset("hearthSouthCarrierHostAdmissibilityReady", String(state.carrierHostAdmissibilityReady));
    setDataset("hearthSouthF8SelfDutySatisfied", String(state.routeF8GateReady));

    setDataset("hearthSouthMacroWestAuthorityObserved", String(state.macroWestAuthorityObserved));
    setDataset("hearthSouthMacroWestAdmissibilityObserved", String(state.macroWestAdmissibilityObserved));
    setDataset("hearthSouthWestDecision", state.westDecision);
    setDataset("hearthSouthWestHardBlock", String(state.westHardBlock));
    setDataset("hearthSouthWestForwardAllowed", String(state.westForwardAllowed));
    setDataset("hearthSouthWestCanvasReleaseApproved", String(state.westCanvasReleaseApproved));

    setDataset("hearthSouthCanvasAuthorityObserved", String(state.canvasAuthorityObserved));
    setDataset("hearthSouthCanvasAuthoritySourceName", state.canvasAuthoritySourceName);
    setDataset("hearthSouthCanvasSummaryObserved", String(state.canvasSummaryObserved));
    setDataset("hearthSouthCanvasSummaryMethod", state.canvasSummaryMethod);
    setDataset("hearthSouthCanvasSummaryAcceptedByContract", String(state.canvasSummaryAcceptedByContract));
    setDataset("hearthSouthCanvasSummaryAcceptedByShape", String(state.canvasSummaryAcceptedByShape));
    setDataset("hearthSouthCanvasSummaryShapeTrusted", String(state.canvasSummaryShapeTrusted));
    setDataset("hearthSouthCanvasContractAccepted", String(state.canvasContractAccepted));

    setDataset("hearthSouthCurrentCanvasParentObserved", String(state.currentCanvasParentObserved));
    setDataset("hearthSouthCurrentCanvasParentContractObserved", String(state.currentCanvasParentContractObserved));
    setDataset("hearthSouthCurrentCanvasParentContract", state.currentCanvasParentContract);
    setDataset("hearthSouthCurrentCanvasParentReceipt", state.currentCanvasParentReceipt);
    setDataset("hearthSouthCurrentCanvasParentIsLocalStation", String(state.currentCanvasParentIsLocalStation));
    setDataset("hearthSouthCurrentCanvasParentIsExpressionHub", String(state.currentCanvasParentIsExpressionHub));
    setDataset("hearthSouthCurrentCanvasParentIsFingerManager", String(state.currentCanvasParentIsFingerManager));
    setDataset("hearthSouthCurrentCanvasParentIsVisibleBaseGlobeCarrier", String(state.currentCanvasParentIsVisibleBaseGlobeCarrier));
    setDataset("hearthSouthCanvasParentBootMethodAvailable", String(state.canvasParentBootMethodAvailable));

    setDataset("hearthSouthExpressionHubActive", String(state.expressionHubActive));
    setDataset("hearthSouthCanvasExpressionHubActive", String(state.canvasExpressionHubActive));
    setDataset("hearthSouthFingerManagerActive", String(state.fingerManagerActive));
    setDataset("hearthSouthCanvasFingerManagerActive", String(state.canvasFingerManagerActive));
    setDataset("hearthSouthFingerRegistryActive", String(state.fingerRegistryActive));
    setDataset("hearthSouthNamedFingerFilesEmbedded", String(state.namedFingerFilesEmbedded));
    setDataset("hearthSouthDownstreamFingerTracksDeclared", String(state.downstreamFingerTracksDeclared));

    setDataset("hearthSouthVisibleBaseGlobeCarrierActive", String(state.visibleBaseGlobeCarrierActive));
    setDataset("hearthSouthCanvasVisibleBaseGlobeCarrierActive", String(state.canvasVisibleBaseGlobeCarrierActive));
    setDataset("hearthSouthCanvasMounted", String(state.canvasMounted));
    setDataset("hearthSouthCanvasDrawComplete", String(state.canvasDrawComplete));
    setDataset("hearthSouthBaseGlobeDrawComplete", String(state.baseGlobeDrawComplete));
    setDataset("hearthSouthBaseGlobeVisibleCarrierReady", String(state.baseGlobeVisibleCarrierReady));
    setDataset("hearthSouthVisibleGlobeCarrierReady", String(state.visibleGlobeCarrierReady));
    setDataset("hearthSouthVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthSouthVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthSouthVisiblePlanetProofIngestedByRoute", String(state.visiblePlanetProofIngestedByRoute));
    setDataset("hearthSouthVisiblePlanetReceiptObserved", String(state.visiblePlanetReceiptObserved));

    setDataset("hearthSouthFingerAuthorityObservedCount", String(state.fingerAuthorityObservedCount));
    setDataset("hearthSouthFingerApiReadyCount", String(state.fingerApiReadyCount));
    setDataset("hearthSouthFingerExpressionPacketCount", String(state.fingerExpressionPacketCount));
    setDataset("hearthSouthFingerReceiptPacketCount", String(state.fingerReceiptPacketCount));
    setDataset("hearthSouthFingerTrackReadyCount", String(state.fingerTrackReadyCount));
    setDataset("hearthSouthFingerHardFailCount", String(state.fingerHardFailCount));
    setDataset("hearthSouthAnyFingerTrackActive", String(state.anyFingerTrackActive));
    setDataset("hearthSouthAllDeclaredFingerTracksReady", String(state.allDeclaredFingerTracksReady));
    setDataset("hearthSouthFirstFingerGap", state.firstFingerGap);
    setDataset("hearthSouthFirstFingerGapFile", state.firstFingerGapFile);
    setDataset("hearthSouthNextFingerKey", state.nextFingerKey);
    setDataset("hearthSouthNextFingerFile", state.nextFingerFile);

    setDataset("hearthSouthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthSouthCanvasParentReleaseObserved", String(state.canvasParentReleaseObserved));
    setDataset("hearthSouthParentReleaseLawful", String(state.parentReleaseLawful));
    setDataset("hearthSouthParentAcceptedRouteConductorRelease", String(state.parentAcceptedRouteConductorRelease));
    setDataset("hearthSouthParentReleasePacketSentToEast", String(state.parentReleasePacketSentToEast));
    setDataset("hearthSouthParentReleasePacketLawful", String(state.parentReleasePacketLawful));
    setDataset("hearthSouthEastDispatchAuthorized", String(state.eastDispatchAuthorized));
    setDataset("hearthSouthEastDispatchPacketPublished", String(state.eastDispatchPacketPublished));

    setDataset("hearthSouthCanvasEastApiReady", String(state.canvasEastApiReady));
    setDataset("hearthSouthCanvasEastEvidenceReady", String(state.canvasEastEvidenceReady));
    setDataset("hearthSouthCanvasWestApiReady", String(state.canvasWestApiReady));
    setDataset("hearthSouthCanvasWestInspectionReady", String(state.canvasWestInspectionReady));
    setDataset("hearthSouthCanvasSouthApiReady", String(state.canvasSouthApiReady));
    setDataset("hearthSouthCanvasSouthVisibleProofReady", String(state.canvasSouthVisibleProofReady));
    setDataset("hearthSouthAllCanvasChildrenApiReady", String(state.allCanvasChildrenApiReady));
    setDataset("hearthSouthAllCanvasChildrenEvidenceReady", String(state.allCanvasChildrenEvidenceReady));
    setDataset("hearthSouthAllCanvasChildrenReady", String(state.allCanvasChildrenReady));

    setDataset("hearthSouthF13CanvasReadinessObserved", String(state.f13CanvasReadinessObserved));
    setDataset("hearthSouthF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthSouthF13InspectEvidenceAvailable", String(state.f13InspectEvidenceAvailable));
    setDataset("hearthSouthF13CanvasEvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthSouthF13CanvasEvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthSouthF13CanvasEvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthSouthF13HardFail", String(state.f13HardFail));
    setDataset("hearthSouthF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthSouthF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthSouthIndexGateReady", String(state.indexGateReady));
    setDataset("hearthSouthRouteF8GateReady", String(state.routeF8GateReady));
    setDataset("hearthSouthMacroWestGateReady", String(state.macroWestGateReady));
    setDataset("hearthSouthCanvasHubGateReady", String(state.canvasHubGateReady));
    setDataset("hearthSouthVisibleGlobeGateReady", String(state.visibleGlobeGateReady));
    setDataset("hearthSouthFingerTrackGateReady", String(state.fingerTrackGateReady));
    setDataset("hearthSouthCanvasGateReady", String(state.canvasGateReady));
    setDataset("hearthSouthNewsGatePassedBeforeF21", String(state.newsGatePassedBeforeF21));
    setDataset("hearthSouthNewsGateDegradedBeforeF21", String(state.newsGateDegradedBeforeF21));

    setDataset("hearthSouthChronologicalGateCount", String(state.chronologicalGateCount));
    setDataset("hearthSouthChronologicalGatesSatisfied", String(state.chronologicalGatesSatisfied));
    setDataset("hearthSouthChronologicalFirstFailedGate", state.chronologicalFirstFailedGate);
    setDataset("hearthSouthChronologicalFirstFailedCoordinate", state.chronologicalFirstFailedCoordinate);
    setDataset("hearthSouthFibonacciSynchronizationScore", String(state.fibonacciSynchronizationScore));
    setDataset("hearthSouthFibonacciSynchronizationExpected", String(state.fibonacciSynchronizationExpected));
    setDataset("hearthSouthFibonacciSynchronizationSatisfied", String(state.fibonacciSynchronizationSatisfied));
    setDataset("hearthSouthFibonacciSynchronizationPassed", String(state.fibonacciSynchronizationPassed));
    setDataset("hearthSouthFibonacciSynchronizationDegraded", String(state.fibonacciSynchronizationDegraded));
    setDataset("hearthSouthFibonacciSynchronizationHardFail", String(state.fibonacciSynchronizationHardFail));
    setDataset("hearthSouthFibonacciSynchronizationHoldReason", state.fibonacciSynchronizationHoldReason);

    setDataset("hearthSouthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthSouthCanvasReleasePacketReady", String(state.canvasReleasePacketReady));
    setDataset("hearthSouthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);
    setDataset("hearthSouthCanvasReleasePacketPublished", String(state.canvasReleasePacketPublished));
    setDataset("hearthSouthCanvasReleasePacketDelivered", String(state.canvasReleasePacketDelivered));
    setDataset("hearthSouthCanvasReleaseDeliveryMethod", state.canvasReleaseDeliveryMethod);
    setDataset("hearthSouthCanvasReleaseAcceptedByCanvas", String(state.canvasReleaseAcceptedByCanvas));

    setDataset("hearthSouthF21EligibleForNorth", "false");
    setDataset("hearthSouthF21EligibilitySubmittedToNorth", "false");
    setDataset("hearthSouthF21SubmittedToNorth", "false");
    setDataset("hearthSouthF21ClaimedByRouteConductor", "false");
    setDataset("hearthSouthCompletionLatched", "false");
    setDataset("hearthSouthReadyTextAllowed", "false");

    setDataset("hearthSouthFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthSouthRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthSouthRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthSouthCanvasNextAuditTarget", state.canvasNextAuditTarget);
    setDataset("hearthSouthPostgameStatus", state.postgameStatus);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function globalsNeedRepublish() {
    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR === api &&
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION === api
    );

    const nestedApiPresent = Boolean(
      root.HEARTH &&
      root.HEARTH.routeConductor === api &&
      root.HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion === api
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT
    );

    return !(apiPresent && nestedApiPresent && receiptPresent);
  }

  function publishGlobals(reason = "publish-globals-v9-5", force = false) {
    if (!force && !globalsNeedRepublish()) {
      updateDataset();
      return false;
    }

    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE = api;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION = api;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR = api;
    root.HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR = api;

    hearth.routeConductor = api;
    hearth.southRouteConductor = api;
    hearth.routeConductorPrimaryGate = api;
    hearth.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion = api;
    hearth.routeConductorCanvasLocalStationBridgeAlignment = api;
    hearth.routeConductorControlOwnershipPassiveWatchdogRepair = api;
    hearth.routeConductorNorthStarCompletionCycleGovernor = api;

    lab.hearthRouteConductor = api;
    lab.hearthSouthRouteConductor = api;
    lab.hearthRouteConductorPrimaryGate = api;
    lab.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestion = api;
    lab.hearthRouteConductorCanvasLocalStationBridgeAlignment = api;
    lab.hearthRouteConductorControlOwnershipPassiveWatchdogRepair = api;
    lab.hearthRouteConductorNorthStarCompletionCycleGovernor = api;

    const receiptLight = getReceiptLight(false);
    const compatibility = composeCompatibilityReceiptV94();

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_RECEIPT_v9_5 = receiptLight;

    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT = compatibility;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4 = compatibility;

    hearth.routeConductorReceipt = receiptLight;
    hearth.southRouteConductorReceipt = receiptLight;
    hearth.routeConductorPrimaryGateReceipt = receiptLight;
    hearth.routeConductorCanvasExpressionHubVisibleGlobeProofIngestionReceipt = receiptLight;
    hearth.routeConductorCanvasLocalStationBridgeAlignmentReceipt = compatibility;

    lab.hearthRouteConductorReceipt = receiptLight;
    lab.hearthSouthRouteConductorReceipt = receiptLight;
    lab.hearthRouteConductorPrimaryGateReceipt = receiptLight;
    lab.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestionReceipt = receiptLight;
    lab.hearthRouteConductorCanvasLocalStationBridgeAlignmentReceipt = compatibility;

    if (state.currentCanvasReleasePacket) {
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      hearth.routeConductorCanvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
      hearth.canvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
    }

    record(reason, {
      force,
      contract: CONTRACT,
      visibleGlobeProofIngestionActive: true,
      currentCanvasParentContract: state.currentCanvasParentContract,
      expressionHubActive: state.expressionHubActive,
      fingerManagerActive: state.fingerManagerActive,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      compatibilityReceiptV94Published: true
    });

    updateDataset();
    return true;
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      observePassive();

      if (globalsNeedRepublish()) {
        publishGlobals("watchdog-v9-5-conditional-republish", false);
      }

      if (
        state.visiblePlanetProofReady ||
        state.watchdogTicks >= WATCHDOG_MAX_TICKS
      ) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;

        record("WATCHDOG_STOPPED_V9_5", {
          watchdogTicks: state.watchdogTicks,
          maxTicks: WATCHDOG_MAX_TICKS,
          visiblePlanetProofReady: state.visiblePlanetProofReady
        });
      }
    }, WATCHDOG_INTERVAL_MS);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_ROUTE_CONDUCTOR_V9_5_VISIBLE_GLOBE_PROOF_INGESTION";

      publishEarlyMarker();
      publishGlobals("boot-early-v9-5-api-receipt-publication", true);

      refresh();

      state.booting = false;
      state.booted = true;
      state.routeConductorRuntimeActive = true;

      publishGlobals("boot-complete-v9-5-api-receipt-publication", true);
      observePassive();
      render();
      startWatchdog();

      record("HEARTH_ROUTE_CONDUCTOR_V9_5_BOOTED", {
        route: ROUTE,
        contract: CONTRACT,
        previousContract: PREVIOUS_CONTRACT,
        currentCanvasParentContract: state.currentCanvasParentContract,
        expressionHubActive: state.expressionHubActive,
        fingerManagerActive: state.fingerManagerActive,
        visiblePlanetProofReady: state.visiblePlanetProofReady,
        visiblePlanetProofSource: state.visiblePlanetProofSource,
        firstFailedCoordinate: state.firstFailedCoordinate,
        recommendedNextFile: state.recommendedNextFile,
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

    record("HEARTH_ROUTE_CONDUCTOR_V9_5_DISPOSED", { reason });
    render();

    return getReceipt();
  }

  function getRouteCycleReceipt(input = {}) {
    const packet = composePrimaryPacket(input, { allowDelivery: false });

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_CYCLE_RECEIPT_v9_5",
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute,
      visibleGlobeProofIngestionActive: true,
      currentCanvasParentContract: packet.currentCanvasParentContract,
      expressionHubActive: packet.expressionHubActive,
      fingerManagerActive: packet.fingerManagerActive,
      visiblePlanetProofReady: packet.visiblePlanetProofReady,
      visiblePlanetProofSource: packet.visiblePlanetProofSource,
      f13StrictEvidenceGap: packet.f13StrictEvidenceGap,
      chronologicalFirstFailedGate: packet.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: packet.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationPassed: packet.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: packet.fibonacciSynchronizationDegraded,
      recommendedNextFile: packet.recommendedNextFile,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };
  }

  function getRoutePrimaryGateReceipt(input = {}) {
    return composeReceipt(input);
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    compatibilityRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
    compatibilityRouteConductorReceipt: COMPAT_ROUTE_CONDUCTOR_RECEIPT,
    lineageContract: LINEAGE_CONTRACT,
    lineageReceipt: LINEAGE_RECEIPT,
    legacyNorthStarContract: LEGACY_NORTH_STAR_CONTRACT,
    legacyNorthStarReceipt: LEGACY_NORTH_STAR_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: state.role,

    CARDINALS,
    CYCLE_ROUTES,
    STATION_IDS,
    CHRONOLOGY,
    ACTIVE_CANVAS_CONTRACTS,
    CANVAS_BASELINE_CONTRACTS,
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

    receiveCanvasStationSummary,
    receiveCanvasLocalStationSummary,
    receiveCanvasParentSummary,
    receiveCanvasExpressionHubSummary,
    receiveExpressionHubSummary,
    receiveVisibleBaseGlobeReceipt,
    receiveVisibleGlobeReceipt,
    receiveVisiblePlanetReceipt,
    receiveCanvasVisibleProof,
    reconcileCanvas,

    readIndexAuthority,
    resolveF8SelfDuty,
    readMacroWestAuthority,
    classifyMacroWest,
    readCanvasAuthority,
    readCanvasSummary,
    normalizeCanvasSummary,
    applyCanvasSummary,

    composeCanvasReleasePacket,
    deliverReleaseToCanvas,
    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket,

    resolveNews,
    resolveF21,
    composeStationBoard,
    computeFibonacci,
    composePrimaryPacket,
    composeReceipt,
    composeCompatibilityReceiptV94,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,

    scanDomForVisibleCanvas,
    globalsNeedRepublish,
    publishGlobals,
    updateDataset,

    supportsVisibleGlobeProofIngestion: true,
    supportsCanvasExpressionHubSpreadRecognition: true,
    supportsCanvasLocalStationBridgePreservation: true,
    supportsCompatibilityReceiptV94: true,
    supportsCurrentRouteConductorV95: true,
    supportsPreviousRouteConductorV94Lineage: true,
    supportsCanvasExpressionHubSummaryConsumption: true,
    supportsVisibleBaseGlobeReceiptConsumption: true,
    supportsVisiblePlanetProofDatasetPublication: true,
    supportsFingerManagerSummaryConsumption: true,
    supportsRouteReceiptChainPublication: true,
    supportsCanvasReleasePacketComposition: true,
    supportsFibonacciChronologyFirst: true,
    supportsNewsAlignmentProtocol: true,
    supportsF21EligibilitySubmissionOnly: true,

    ownsRouteConductorRuntime: true,
    ownsNewsChronology: true,
    ownsFibonacciSynchronization: true,
    ownsCanvasReleasePacketComposition: true,
    ownsCanvasSummaryIngestion: true,
    ownsVisibleGlobeProofIngestion: true,
    ownsRouteReceiptPublication: true,

    ownsCanvasDrawing: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasFingerTruth: false,
    ownsMacroWestAdmissibilityTruth: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  publishEarlyMarker();
  publishGlobals("immediate-v9-5-api-receipt-publication", true);

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
