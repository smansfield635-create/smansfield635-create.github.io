// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4
// Full-file replacement.
// Route Conductor / North Star completion-cycle governor / Canvas Local Station bridge alignment.
// Supersedes:
// - HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3
// Purpose:
// - Preserve v9_3 control-ownership repair: Index owns visible button/touch binding.
// - Keep Route Conductor passive over the DOM/control surface.
// - Bridge the diagnostic systems by consuming Canvas Local Station summaries by contract OR lawful summary shape.
// - Stop the old brittle failure where Route Conductor and Canvas disagree because one file advanced contract names.
// - Preserve Canvas Local Station as the child-distribution summary surface.
// - Preserve Macro West as admissibility boundary.
// - Preserve NEWS chronology and Fibonacci-first ordering.
// - Deliver Canvas release only through bounded/manual refresh path, never through an interval redelivery loop.
// - Publish current Route Conductor release packets for the renewed Canvas parent.
// - Preserve no-claim boundaries: no F21 claim, no ready text, no completion latch, no final visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - HTML shell
// - visible button/touch binding
// - diagnostic rail loading
// - Canvas drawing
// - Canvas child truth
// - East atlas truth
// - West inspection truth
// - South visible proof truth
// - Macro West admissibility truth
// - North F21 latch
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3";
  const PREVIOUS_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3";
  const LEGACY_NORTH_STAR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2";
  const LEGACY_NORTH_STAR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT_v9_2";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT_TNT_v8_2";
  const VERSION = "2026-06-03.hearth-route-conductor-canvas-local-station-bridge-alignment-v9-4";

  const FILE = "/showroom/globe/hearth/hearth.js";
  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const MACRO_WEST_FILE = "/assets/lab/runtime-table.west.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";

  const CYCLE_ROUTES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS"
  });

  const CARDINALS = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS"
  });

  const STATION_IDS = Object.freeze({
    INDEX_HOST: "INDEX_HOST",
    ROUTE_F8: "ROUTE_F8_SELF_DUTY",
    MACRO_WEST: "MACRO_WEST_ADMISSIBILITY",
    CANVAS_LOCAL_STATION: "CANVAS_LOCAL_STATION_SUMMARY",
    CANVAS_RELEASE: "CANVAS_PARENT_RELEASE",
    CANVAS_F13: "CANVAS_F13_AGGREGATE",
    NORTH_F21: "NORTH_F21_ELIGIBILITY_BOUNDARY"
  });

  const CHRONOLOGY = Object.freeze([
    STATION_IDS.INDEX_HOST,
    STATION_IDS.ROUTE_F8,
    STATION_IDS.MACRO_WEST,
    STATION_IDS.CANVAS_LOCAL_STATION,
    STATION_IDS.CANVAS_RELEASE,
    STATION_IDS.CANVAS_F13,
    STATION_IDS.NORTH_F21
  ]);

  const CANVAS_LOCAL_STATION_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const RECOGNIZED_CANVAS_BASELINE_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3"
  ]);

  const CONTROL_SELECTORS = Object.freeze([
    "[data-hearth-copy-diagnostic]",
    "[data-hearth-toggle-receipt]",
    "[data-hearth-inspect-planet]",
    "[data-hearth-collapse-cockpit]",
    "[data-hearth-south-show-diagnostic-tab]",
    "[data-hearth-east-show-diagnostic-tab]",
    "[data-hearth-show-diagnostic-tab]"
  ]);

  const PASSIVE_WATCHDOG_INTERVAL_MS = 1800;
  const PASSIVE_WATCHDOG_MAX_TICKS = 24;

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

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const refs = {
    cockpit: null,
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
    legacyNorthStarContract: LEGACY_NORTH_STAR_CONTRACT,
    legacyNorthStarReceipt: LEGACY_NORTH_STAR_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "route-conductor-canvas-local-station-bridge-alignment",

    routeConductorAuthorityCardinal: CARDINALS.NORTH,
    activeCycleInputCardinal: CARDINALS.SOUTH,
    activeCycleHandoffTarget: CARDINALS.WEST,
    activeCycleNumber: 2,
    activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
    activeCardinal: CARDINALS.NORTH,
    activeNewsGate: CARDINALS.NORTH,
    activeFibonacci: "F8",
    activeFibonacciRank: 8,
    activeStageId: "F8_NORTH_STAR_ROUTE_CONDUCTOR_SELF_DUTY",
    activeGearId: "F8_NORTH_STAR_ROUTE_CONDUCTOR_SELF_DUTY",

    bridgeAlignmentActive: true,
    diagnosticBridgeActive: true,
    diagnosticDoorwayAndReceiptSeparated: true,
    canvasLocalStationSummaryBridgeActive: true,
    canvasSummaryAcceptedByShape: false,
    canvasSummaryAcceptedByContract: false,
    canvasSummaryShapeTrusted: false,

    northStarCompletionCycleGovernorActive: true,
    centralStationOverloadSuperseded: true,
    canvasLocalStationConsumptionActive: true,
    directCanvasChildScanningRemoved: true,
    canvasSummarySourceRequired: true,
    canvasParentV10_3HardExpectationRetired: true,

    receiveCanvasStationSummaryAvailable: true,
    receiveCanvasLocalStationSummaryAvailable: true,
    receiveCanvasParentSummaryAvailable: true,
    reconcileCanvasAvailable: true,
    canvasReleaseReentryGuardActive: true,
    readOnlyGetterDeliveryBlocked: true,
    v10_3BaselineRecognizedOnly: false,
    v11OrLaterRequiredForLocalStationPass: true,

    pushedSummaryApiReadinessCorrectionActive: true,
    contractGateOverridesStaleChildCoordinates: true,
    nonLocalStationChildCoordinateTrustBlocked: true,
    contractDriftBridgeActive: true,

    routeConductorControlBindingDisabled: true,
    indexOwnsControlBinding: true,
    routeConductorOwnsControlBinding: false,
    routeConductorUsesPassiveControlObservation: true,
    duplicateButtonHandlerRiskRemoved: true,
    controlSurfacePassiveObservationActive: true,
    controlSurfaceObserved: false,
    controlSurfaceButtonsObserved: 0,
    routeConductorControlListenersAttached: false,

    watchdogPassiveObservationActive: true,
    watchdogDeliveryLoopDisabled: true,
    canvasReleaseIntervalRedeliveryDisabled: true,
    refreshDeliveryBounded: true,
    passiveWatchdogMaxTicks: PASSIVE_WATCHDOG_MAX_TICKS,
    passiveWatchdogIntervalMs: PASSIVE_WATCHDOG_INTERVAL_MS,
    htmlRebuildRequired: false,
    indexRebuildRequired: false,

    newsAlignmentProtocolActive: true,
    newsChronologicalOrderLocked: true,
    fibonacciSynchronizationChronologyFirst: true,
    macroWestBoundaryActive: true,
    canvasReleaseBoundaryActive: true,
    f21EligibilitySubmissionOnly: true,
    antiFalseCompletionLawActive: true,

    canvasReleaseDeliveryInProgress: false,
    canvasSummaryReceiveInProgress: false,
    lastCanvasReleasePacketSignature: "",

    indexAuthorityObserved: false,
    indexPairReady: false,
    indexShellAccepted: false,
    indexRuntimeReleaseAuthorized: false,
    indexRuntimeReleaseComplete: false,
    indexMountPresent: false,
    indexControlsBound: false,
    carrierHostAdmissibilityReady: false,
    carrierHostAdmissibilityPacketReady: false,
    indexHandoffToRouteConductor: false,
    indexPairHoldReason: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",

    routeConductorMarkerPresent: false,
    routeConductorApiPresent: false,
    routeConductorReceiptPresent: false,
    routeConductorRuntimeActive: false,
    routeF8GateReady: false,

    macroWestAuthorityObserved: false,
    macroWestAdmissibilityObserved: false,
    macroWestMethodUsed: "",
    macroWestContract: "",
    westDecision: "UNKNOWN",
    westGapClass: "",
    westGapSeverity: "",
    westHardBlock: false,
    westForwardAllowed: false,
    westCanvasReleaseApproved: false,
    westDegradedForwardApproved: false,
    westReleasePacketObserved: false,
    westReleasePacketSource: "NONE",
    westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION",
    westRecommendedNextRenewalTarget: MACRO_WEST_FILE,

    canvasLocalStationObserved: false,
    canvasLocalStationApiReady: false,
    canvasLocalStationContract: "",
    canvasLocalStationContractAccepted: false,
    canvasBaselineV10_3Recognized: false,
    canvasLocalStationSummaryObserved: false,
    canvasLocalStationSummaryMethod: "",
    canvasLocalStationPushedSummaryProof: false,
    canvasLocalStationReleasePacketDelivered: false,
    canvasLocalStationReleaseDeliveryMethod: "",
    canvasLocalStationReleaseAccepted: false,
    canvasLocalStationNotificationConsumed: false,
    canvasLocalStationNotificationMethod: "",

    currentCanvasParentObserved: false,
    currentCanvasParentContractObserved: false,
    currentCanvasParentContract: "",
    currentCanvasParentIsLocalStation: false,
    canvasParentBootMethodAvailable: false,

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
    f13StrictEvidenceGap: "WAITING_CANVAS_LOCAL_STATION_SUMMARY",
    f13StrictEvidenceRepairTarget: CANVAS_FILE,
    degradedF13IsFunctional: false,
    strictVisualProofPending: false,
    functionalPageObserved: false,

    indexGateReady: false,
    routeF8GateReady: false,
    macroWestGateReady: false,
    canvasLocalStationGateReady: false,
    canvasParentGateReady: false,
    canvasParentReleaseGateReady: false,
    canvasParentEastDispatchGateReady: false,
    canvasEastGateReady: false,
    canvasWestGateReady: false,
    canvasSouthGateReady: false,
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
    canvasReleaseHeldReason: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY_OR_MACRO_WEST",
    canvasReleasePacketPublished: false,

    f21LatchMode: "WAITING_CANVAS_GATE",
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
    currentCanvasStationSummary: null,
    currentCanvasReleasePacket: null,
    stationBoard: null,

    booted: false,
    booting: false,
    watchdogTicks: 0,
    passiveObservationTicks: 0,
    renderCount: 0,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_ROUTE_CONDUCTOR_V9_4_LOADED",
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

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
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
      event: safeString(event, "EVENT"),
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
      code: safeString(code, "ERROR"),
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

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
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
      "getRouteCycleReceipt",
      "getRoutePrimaryGateReceipt"
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
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
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
      contract: packet.contract,
      receipt: packet.receipt,
      routeConductorContract: packet.routeConductorContract,
      routeConductorReceipt: packet.routeConductorReceipt,
      sourceFile: packet.sourceFile,
      destinationFile: packet.destinationFile,
      targetFile: packet.targetFile,
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute,
      handoffTo: packet.handoffTo,
      canvasReleaseAuthorized: packet.canvasReleaseAuthorized,
      canvasReleasePacketReady: packet.canvasReleasePacketReady,
      westCanvasReleaseApproved: packet.westCanvasReleaseApproved,
      westHardBlock: packet.westHardBlock,
      carrierHostAdmissibilityReady: packet.carrierHostAdmissibilityReady,
      indexPairReady: packet.indexPairReady,
      f8SelfDutySatisfied: packet.f8SelfDutySatisfied
    });
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;
    root.__HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_DIRECT_CANVAS_CHILD_SCAN_REMOVED__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_SUMMARY_REQUIRED__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CANVAS_SUMMARY_RECEIVER_AVAILABLE__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_REENTRY_GUARD_ACTIVE__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_V9_4_BRIDGE_ALIGNMENT_ACTIVE__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_V9_4_CONTROL_BINDING_DISABLED__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_V9_4_PASSIVE_WATCHDOG_ACTIVE__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_V9_4_CANVAS_RELEASE_INTERVAL_REDELIVERY_DISABLED__ = true;

    state.routeConductorMarkerPresent = true;
    updateDataset();
    return true;
  }

  function observeControlSurface() {
    if (!doc) {
      state.controlSurfaceObserved = false;
      state.controlSurfaceButtonsObserved = 0;
      state.routeConductorControlListenersAttached = false;
      return {
        observed: false,
        buttonsObserved: 0,
        routeConductorControlBindingDisabled: true,
        indexOwnsControlBinding: true,
        routeConductorOwnsControlBinding: false
      };
    }

    const controls = CONTROL_SELECTORS.map((selector) => doc.querySelector(selector)).filter(Boolean);

    state.controlSurfaceObserved = controls.length > 0;
    state.controlSurfaceButtonsObserved = controls.length;
    state.routeConductorControlListenersAttached = false;

    controls.forEach((node) => {
      if (!node || !node.dataset) return;
      node.dataset.hearthRouteConductorObservedPassive = "true";
      node.dataset.hearthRouteConductorBound = "false";
      node.dataset.hearthRouteConductorControlOwner = "index-js";
    });

    return {
      observed: state.controlSurfaceObserved,
      buttonsObserved: state.controlSurfaceButtonsObserved,
      routeConductorControlBindingDisabled: true,
      indexOwnsControlBinding: true,
      routeConductorOwnsControlBinding: false
    };
  }

  function scanDom() {
    if (!doc) {
      return {
        mountPresent: false,
        cockpitPresent: false,
        planetCanvasPresent: false,
        planetCanvasNonZeroSize: false,
        copyDiagnosticReady: false,
        receiptToggleReady: false,
        inspectPlanetControlAvailable: false,
        inspectModeAvailable: false,
        diagnosticDockRestorable: false,
        inspectFallbackReady: false,
        inspectStrictReady: false
      };
    }

    refs.cockpit =
      doc.getElementById("hearthLoadCockpit") ||
      doc.querySelector("[data-hearth-load-cockpit='true']") ||
      doc.querySelector("[data-hearth-first-paint-cockpit='true']");

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
      doc.querySelector("[data-hearth-canvas-mount]");

    const canvas = mount
      ? mount.querySelector("canvas")
      : doc.querySelector("canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true']");

    const rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    const nonZero = Boolean(
      canvas &&
      (
        (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0) ||
        (rect && safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0)
      )
    );

    const copyDiagnosticReady = Boolean(doc.querySelector("[data-hearth-copy-diagnostic]"));
    const receiptToggleReady = Boolean(doc.querySelector("[data-hearth-toggle-receipt]") || refs.receiptText || refs.receiptBox);
    const inspectPlanetControlAvailable = Boolean(doc.querySelector("[data-hearth-inspect-planet]"));
    const inspectModeAvailable = Boolean(inspectPlanetControlAvailable && refs.cockpit);
    const diagnosticDockRestorable = Boolean(refs.cockpit);
    const inspectFallbackReady = Boolean(copyDiagnosticReady || receiptToggleReady || diagnosticDockRestorable);
    const inspectStrictReady = Boolean(inspectModeAvailable && copyDiagnosticReady && receiptToggleReady);

    observeControlSurface();

    return {
      mountPresent: Boolean(mount),
      cockpitPresent: Boolean(refs.cockpit),
      planetCanvasPresent: Boolean(canvas),
      planetCanvasNonZeroSize: nonZero,
      copyDiagnosticReady,
      receiptToggleReady,
      inspectPlanetControlAvailable,
      inspectModeAvailable,
      diagnosticDockRestorable,
      inspectFallbackReady,
      inspectStrictReady
    };
  }

  function readIndexAuthority() {
    const apiRef = firstGlobal([
      "HEARTH_INDEX_JS",
      "HEARTH.indexJs",
      "HEARTH.indexBridge",
      "HEARTH.frontendButtonAuthorityReset",
      "HEARTH.buttonAuthority",
      "DEXTER_LAB.hearthIndexJs",
      "DEXTER_LAB.hearthFrontendButtonAuthorityReset",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
      "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET"
    ]);

    const receipt = readReceipt(apiRef) || {};
    const dom = scanDom();

    const observed = Boolean(
      apiRef ||
      receipt.contract ||
      datasetValue("hearthIndexJsLoaded") === "true" ||
      datasetValue("hearthFrontendButtonAuthorityRestored") === "true"
    );

    const shellAccepted = Boolean(
      safeBool(receipt.shellAccepted, false) ||
      safeBool(receipt.htmlOwnsVisibleShell, false) ||
      datasetValue("hearthShellAccepted") === "true" ||
      dom.mountPresent
    );

    const controlsBound = Boolean(
      safeBool(receipt.copyDiagnosticBound, false) ||
      safeBool(receipt.toggleReceiptBound, false) ||
      safeBool(receipt.inspectPlanetBound, false) ||
      safeBool(receipt.frontendButtonAuthorityRestored, false) ||
      datasetValue("hearthFrontendButtonAuthorityRestored") === "true" ||
      (dom.copyDiagnosticReady && dom.receiptToggleReady && dom.inspectPlanetControlAvailable)
    );

    const runtimeReleaseHeld = Boolean(
      safeBool(receipt.runtimeReleaseHeld, true) ||
      datasetValue("hearthRuntimeReleaseHeld") === "true"
    );

    const carrierHostAdmissibilityReady = Boolean(
      safeBool(receipt.carrierHostAdmissibilityReady, false) ||
      safeBool(receipt.carrierHostReady, false) ||
      root.HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY_READY === true ||
      datasetValue("hearthCarrierHostAdmissibilityReady") === "true" ||
      datasetValue("hearthSouthCarrierHostAdmissibilityReady") === "true" ||
      dom.mountPresent
    );

    const carrierHostAdmissibilityPacketReady = Boolean(
      safeBool(receipt.carrierHostAdmissibilityPacketReady, false) ||
      datasetValue("hearthCarrierHostAdmissibilityPacketReady") === "true" ||
      carrierHostAdmissibilityReady
    );

    const indexHandoffToRouteConductor = Boolean(
      safeBool(receipt.handoffToRouteConductor, false) ||
      root.HEARTH_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR === true ||
      datasetValue("hearthIndexHandoffToRouteConductor") === "true" ||
      carrierHostAdmissibilityReady
    );

    const ready = Boolean(
      observed &&
      shellAccepted &&
      controlsBound &&
      carrierHostAdmissibilityReady &&
      carrierHostAdmissibilityPacketReady &&
      indexHandoffToRouteConductor
    );

    const holdReason = ready
      ? "NONE_INDEX_CARRIER_HOST_ADMISSIBILITY_READY"
      : !observed
        ? "WAITING_INDEX_PAIR_OBSERVATION"
        : !shellAccepted
          ? "WAITING_INDEX_HTML_SHELL_ACCEPTANCE"
          : !controlsBound
            ? "WAITING_INDEX_VISIBLE_CONTROL_BINDING"
            : !carrierHostAdmissibilityReady
              ? "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY"
              : !indexHandoffToRouteConductor
                ? "WAITING_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR"
                : "WAITING_INDEX_PAIR_READY";

    return {
      authority: apiRef || null,
      receipt,
      observed,
      indexPairReady: ready,
      shellAccepted,
      runtimeReleaseAuthorized: !runtimeReleaseHeld,
      runtimeReleaseComplete: false,
      runtimeReleaseHeld,
      mountPresent: dom.mountPresent,
      controlsBound,
      carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady,
      indexHandoffToRouteConductor,
      holdReason,
      recommendedNextFile: INDEX_FILE
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
      root.HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR === api ||
      (root.HEARTH && root.HEARTH.routeConductor === api) ||
      (root.HEARTH && root.HEARTH.routeConductorNorthStarCompletionCycleGovernor === api) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.hearthRouteConductor === api)
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT
    );

    const runtimeActive = true;
    const hydrated = Boolean(markerPresent && apiPresent && receiptPresent && runtimeActive);

    return {
      routeConductorMarkerPresent: markerPresent,
      routeConductorApiPresent: apiPresent,
      routeConductorReceiptPresent: receiptPresent,
      routeConductorRuntimeActive: runtimeActive,
      routeF8GateReady: hydrated,
      f8SelfDutySatisfied: hydrated,
      firstFailedCoordinate: hydrated
        ? "NONE_F8_SELF_DUTY_SATISFIED"
        : markerPresent
          ? "WAITING_ROUTE_CONDUCTOR_API_RECEIPT_RUNTIME"
          : "WAITING_ROUTE_CONDUCTOR_MARKER_API_RECEIPT_RUNTIME"
    };
  }

  function readMacroWestAuthority() {
    const apiRef = firstGlobal([
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

    const receipt = readReceipt(apiRef) || {};

    const observed = Boolean(
      apiRef ||
      receipt.contract ||
      datasetValue("labRuntimeTableWestLoaded") === "true" ||
      datasetValue("westCycleAwareAdmissibilityClutch") === "true" ||
      datasetValue("hearthSouthMacroWestAuthorityObserved") === "true" ||
      datasetValue("hearthWestRuntimeTableLoaded") === "true"
    );

    return {
      authority: apiRef || null,
      receipt,
      observed,
      file: MACRO_WEST_FILE
    };
  }

  function composeMacroWestCandidate(index, f8) {
    return {
      event: "CYCLE_2_SOUTH_OUTPUT_FOR_MACRO_WEST_ADMISSIBILITY",
      id: "F13N_INSPECT_GATE",
      phase: "F13N_INSPECT_GATE",
      checkpointId: "F13N_INSPECT_GATE",
      activeFibonacci: "F13N",
      fibonacci: "F13N",

      contract: CONTRACT,
      receipt: RECEIPT,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      previousRouteConductorContract: PREVIOUS_CONTRACT,
      legacyRouteConductorContract: LEGACY_NORTH_STAR_CONTRACT,

      routeConductorAuthorityCardinal: CARDINALS.NORTH,
      activeCycleInputCardinal: CARDINALS.SOUTH,
      activeCycleHandoffTarget: CARDINALS.WEST,

      receivedFrom: CARDINALS.SOUTH,
      sourceCardinal: CARDINALS.SOUTH,
      activeCardinal: CARDINALS.NORTH,
      handoffTo: CARDINALS.WEST,
      targetCardinal: CARDINALS.WEST,
      destinationCardinal: CARDINALS.WEST,

      sourceFile: FILE,
      destinationFile: MACRO_WEST_FILE,
      targetFile: MACRO_WEST_FILE,

      cycleTwoActive: true,
      cycleNumber: 2,
      activeCycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,

      canvasReleaseRequested: false,
      releaseToCanvas: false,
      canvasReleaseAuthorized: false,
      canvasReleasePacketReady: false,

      indexPairReady: index.indexPairReady,
      carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
      indexHandoffToRouteConductor: index.indexHandoffToRouteConductor,
      f8SelfDutySatisfied: f8.f8SelfDutySatisfied,

      routeConductorOutputReady: Boolean(index.indexPairReady && f8.f8SelfDutySatisfied),
      routeConductorReleaseCandidate: Boolean(index.indexPairReady && f8.f8SelfDutySatisfied),
      southOutputReady: Boolean(index.indexPairReady && f8.f8SelfDutySatisfied),
      cycleTwoSouthOutputReady: Boolean(index.indexPairReady && f8.f8SelfDutySatisfied),
      southOutputAdmissible: Boolean(index.indexPairReady && f8.f8SelfDutySatisfied),

      bridgeAlignmentActive: true,
      canvasSummaryAcceptedByShape: state.canvasSummaryAcceptedByShape,
      canvasSummaryAcceptedByContract: state.canvasSummaryAcceptedByContract,
      routeConductorDirectCanvasChildScanRemoved: true,
      routeConductorControlBindingDisabled: true,
      watchdogDeliveryLoopDisabled: true,
      canvasReleaseIntervalRedeliveryDisabled: true,

      ...FINAL_FALSE,

      firstFailedCoordinate: index.indexPairReady && f8.f8SelfDutySatisfied
        ? "NONE_CYCLE_2_SOUTH_OUTPUT_FOR_MACRO_WEST_ADMISSIBILITY_READY"
        : !index.indexPairReady
          ? index.holdReason
          : f8.firstFailedCoordinate,
      recommendedNextFile: index.indexPairReady && f8.f8SelfDutySatisfied ? MACRO_WEST_FILE : FILE,
      recommendedNextRenewalTarget: index.indexPairReady && f8.f8SelfDutySatisfied ? MACRO_WEST_FILE : FILE,
      createdAt: nowIso()
    };
  }

  function normalizeMacroWestResult(result = {}, methodUsed = "", authorityObserved = false, authority = null) {
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
      safeBool(firstDefined(r.westHardBlock, r.hardBlock, admissibility.westHardBlock, admissibility.hardBlock, gap.westHardBlock, gap.hardBlock), false) ||
      decision === "HARD_BLOCK"
    );

    const forwardAllowed = Boolean(
      safeBool(firstDefined(r.westForwardAllowed, r.forwardAllowed, admissibility.westForwardAllowed, admissibility.forwardAllowed, gap.westForwardAllowed, gap.forwardAllowed), false) ||
      (decision === "RELEASE_TO_CANVAS" && !hardBlock)
    );

    const westCanvasReleaseApproved = Boolean(
      !hardBlock &&
      (
        safeBool(firstDefined(r.westCanvasReleaseApproved, r.canvasReleaseApprovedByWest, admissibility.westCanvasReleaseApproved, admissibility.canvasReleaseApprovedByWest, gap.westCanvasReleaseApproved), false) ||
        decision === "RELEASE_TO_CANVAS"
      ) &&
      forwardAllowed
    );

    const releasePacket = isObject(r.canvasReleasePacket)
      ? r.canvasReleasePacket
      : isObject(r.releasePacket)
        ? r.releasePacket
        : null;

    const releasePacketObserved = Boolean(releasePacket || westCanvasReleaseApproved);

    const firstFailedCoordinate = safeString(firstDefined(
      r.firstFailedCoordinate,
      admissibility.firstFailedCoordinate,
      gap.firstFailedCoordinate
    ), westCanvasReleaseApproved ? "NONE_MACRO_WEST_CANVAS_RELEASE_APPROVED" : "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION");

    return {
      macroWestAuthorityObserved: authorityObserved,
      macroWestAdmissibilityObserved: Boolean(result && isObject(result) && Object.keys(result).length),
      macroWestMethodUsed: methodUsed,
      macroWestContract: safeString(firstDefined(r.contract, r.CONTRACT, authority && authority.contract, authority && authority.CONTRACT), ""),
      westDecision: decision,
      westGapClass: safeString(firstDefined(r.westGapClass, r.gapClass, admissibility.westGapClass, admissibility.gapClass, gap.westGapClass, gap.gapClass), ""),
      westGapSeverity: safeString(firstDefined(r.westGapSeverity, r.gapSeverity, admissibility.westGapSeverity, admissibility.gapSeverity, gap.westGapSeverity, gap.gapSeverity), ""),
      westHardBlock: hardBlock,
      westForwardAllowed: forwardAllowed,
      westCanvasReleaseApproved,
      westDegradedForwardApproved: Boolean(
        !hardBlock &&
        (
          safeBool(r.degradedForward, false) ||
          safeBool(admissibility.degradedForward, false) ||
          safeBool(gap.canDegradeForward, false) ||
          decision === "DEGRADED_FORWARD"
        )
      ),
      westReleasePacketObserved: releasePacketObserved,
      westReleasePacketSource: releasePacket ? "macro-west-result" : releasePacketObserved ? "macro-west-decision" : "NONE",
      westReleasePacket: clonePlain(releasePacket),
      westFirstFailedCoordinate: firstFailedCoordinate,
      westRecommendedNextRenewalTarget: safeString(firstDefined(
        r.recommendedNextRenewalTarget,
        r.recommendedNextFile,
        admissibility.recommendedNextRenewalTarget,
        gap.recommendedNextRenewalTarget,
        gap.recommendedNextFile
      ), westCanvasReleaseApproved ? CANVAS_FILE : MACRO_WEST_FILE),
      raw: clonePlain(r),
      normalizedAt: nowIso()
    };
  }

  function classifyMacroWestAdmissibility(index, f8) {
    const west = readMacroWestAuthority();

    if (!index.indexPairReady || !index.carrierHostAdmissibilityReady || !index.indexHandoffToRouteConductor) {
      return {
        ...normalizeMacroWestResult({}, "index-carrier-host-precheck", Boolean(west.observed), west.authority),
        macroWestAuthorityObserved: Boolean(west.observed),
        macroWestAdmissibilityObserved: false,
        westDecision: "HOLD_ACTIVE",
        westGapClass: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
        westGapSeverity: "HELD",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westReleasePacketObserved: false,
        westReleasePacketSource: "NONE",
        westReleasePacket: null,
        westFirstFailedCoordinate: index.holdReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
        westRecommendedNextRenewalTarget: INDEX_FILE
      };
    }

    if (!f8.f8SelfDutySatisfied) {
      return {
        ...normalizeMacroWestResult({}, "route-f8-precheck", Boolean(west.observed), west.authority),
        macroWestAuthorityObserved: Boolean(west.observed),
        macroWestAdmissibilityObserved: false,
        westDecision: "HOLD_ACTIVE",
        westGapClass: "WAITING_ROUTE_F8_SELF_DUTY",
        westGapSeverity: "HELD",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westReleasePacketObserved: false,
        westReleasePacketSource: "NONE",
        westReleasePacket: null,
        westFirstFailedCoordinate: f8.firstFailedCoordinate,
        westRecommendedNextRenewalTarget: FILE
      };
    }

    const authority = west.authority;

    if (!authority || !isObject(authority)) {
      const receiptResult = normalizeMacroWestResult(west.receipt || {}, "receipt-fallback-no-api", Boolean(west.observed), authority);
      if (receiptResult.westCanvasReleaseApproved) return receiptResult;

      return {
        ...receiptResult,
        macroWestAuthorityObserved: Boolean(west.observed),
        macroWestAdmissibilityObserved: false,
        westDecision: "HOLD_ACTIVE",
        westGapClass: "WAITING_MACRO_WEST_AUTHORITY",
        westGapSeverity: "HELD",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westReleasePacketObserved: false,
        westReleasePacketSource: "NONE",
        westReleasePacket: null,
        westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_AUTHORITY",
        westRecommendedNextRenewalTarget: MACRO_WEST_FILE
      };
    }

    const candidate = composeMacroWestCandidate(index, f8);
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
          activeCycleInputCardinal: CARDINALS.SOUTH,
          activeCycleHandoffTarget: CARDINALS.WEST,
          sourceCardinal: CARDINALS.SOUTH,
          receivedFrom: CARDINALS.SOUTH,
          handoffTo: CARDINALS.WEST,
          targetCardinal: CARDINALS.WEST,
          destinationCardinal: CARDINALS.WEST,
          sourceFile: FILE,
          targetFile: MACRO_WEST_FILE,
          destinationFile: MACRO_WEST_FILE,
          activeCycle: "CYCLE_2",
          cycle: "CYCLE_2",
          cycleTwoActive: true,
          activeCycleNumber: 2,
          activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
          activeFibonacci: "F13N",
          canvasLocalStationOwnsChildDistribution: true,
          routeConductorDirectCanvasChildScanRemoved: true,
          routeConductorControlBindingDisabled: true,
          contractDriftBridgeActive: true
        });

        const normalized = normalizeMacroWestResult(result, method, true, authority);

        record("MACRO_WEST_ADMISSIBILITY_CLASSIFIED", {
          method,
          decision: normalized.westDecision,
          forwardAllowed: normalized.westForwardAllowed,
          canvasReleaseApproved: normalized.westCanvasReleaseApproved,
          firstFailedCoordinate: normalized.westFirstFailedCoordinate
        });

        return normalized;
      } catch (error) {
        recordError("MACRO_WEST_METHOD_FAILED", error, { method });
      }
    }

    return {
      ...normalizeMacroWestResult(west.receipt || {}, "receipt-fallback", true, authority),
      macroWestAuthorityObserved: true,
      macroWestAdmissibilityObserved: Boolean(west.receipt && Object.keys(west.receipt).length),
      westFirstFailedCoordinate: "WAITING_MACRO_WEST_CLASSIFIER_METHOD",
      westRecommendedNextRenewalTarget: MACRO_WEST_FILE
    };
  }

  function readCanvasLocalStationApi() {
    return firstGlobal([
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS_STATION",
      "HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD",
      "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD",
      "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasStation",
      "HEARTH.canvasChildDistributionSwitchboard",
      "HEARTH.canvasParentReleaseAcceptanceEastDispatchSwitchboard",
      "HEARTH.canvasParent",
      "HEARTH.canvasNorth",
      "HEARTH.canvasEvidence",
      "HEARTH.canvas",
      "DEXTER_LAB.hearthCanvasLocalStation",
      "DEXTER_LAB.hearthCanvasStation",
      "DEXTER_LAB.hearthCanvasChildDistributionSwitchboard",
      "DEXTER_LAB.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvas"
    ]);
  }

  function readCanvasStationSummaryFromApi(canvasApi) {
    if (!canvasApi || !isObject(canvasApi)) return { method: "", summary: null };

    const methods = [
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getReceiptLight",
      "getReceipt",
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCanvasCarrier",
      "getCarrierReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(canvasApi[method])) continue;
      try {
        const summary = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? canvasApi[method](false)
          : canvasApi[method]();
        if (isObject(summary)) return { method, summary };
      } catch (error) {
        recordError("CANVAS_LOCAL_STATION_SUMMARY_METHOD_FAILED", error, { method });
      }
    }

    if (canvasApi.contract || canvasApi.CONTRACT || canvasApi.receipt || canvasApi.RECEIPT) {
      return { method: "direct-object", summary: canvasApi };
    }

    return { method: "", summary: null };
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

  function isCanvasLocalStationShape(summary = {}) {
    const s = isObject(summary) ? summary : {};
    const packetType = safeString(s.packetType, "");
    const role = safeString(s.role, "");
    return Boolean(
      packetType === "CANVAS_LOCAL_STATION_SUMMARY" ||
      packetType === "CANVAS_LOCAL_STATION_RECEIPT" ||
      packetType === "CANVAS_STATION_SUMMARY" ||
      packetType === "CANVAS_STATION_RECEIPT" ||
      safeBool(s.canvasLocalStationActive, false) ||
      safeBool(s.childDistributionSwitchboardActive, false) ||
      safeBool(s.routeConductorSummarySurfaceActive, false) ||
      safeBool(s.currentCanvasParentObserved, false) ||
      safeBool(s.canvasParentBootMethodAvailable, false) ||
      role.includes("canvas-local-station")
    );
  }

  function canvasContractAccepted(contract, summary = {}) {
    const c = safeString(contract, "");
    const acceptedByContract = CANVAS_LOCAL_STATION_CONTRACTS.includes(c);
    const baselineOnly = RECOGNIZED_CANVAS_BASELINE_CONTRACTS.includes(c);
    const acceptedByShape = isCanvasLocalStationShape(summary) && isNoClaimPreserved(summary);

    state.canvasSummaryAcceptedByContract = acceptedByContract;
    state.canvasSummaryAcceptedByShape = acceptedByShape && !acceptedByContract;
    state.canvasSummaryShapeTrusted = acceptedByShape;

    return Boolean(acceptedByContract || acceptedByShape) && !baselineOnly;
  }

  function resolveCanvasAggregateGap(canvas = {}) {
    if (!canvas.observed) return { gap: "WAITING_CANVAS_LOCAL_STATION_API", repairTarget: CANVAS_FILE };
    if (!canvas.contractAccepted) return { gap: "WAITING_CANVAS_LOCAL_STATION_CURRENT_CONTRACT_OR_SHAPE", repairTarget: CANVAS_FILE };
    if (!canvas.apiReady) return { gap: "WAITING_CANVAS_LOCAL_STATION_API", repairTarget: CANVAS_FILE };
    if (!canvas.releaseAccepted) return { gap: "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE", repairTarget: CANVAS_FILE };
    if (!canvas.parentReleaseLawful) return { gap: "WAITING_CANVAS_PARENT_RELEASE_LAWFUL", repairTarget: CANVAS_FILE };
    if (!canvas.eastDispatchAuthorized && !canvas.eastDispatchPacketPublished) return { gap: "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION", repairTarget: CANVAS_FILE };
    if (!canvas.canvasEastApiReady) return { gap: "WAITING_CANVAS_EAST_API", repairTarget: CANVAS_FILE };
    if (!canvas.canvasEastEvidenceReady) return { gap: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE", repairTarget: CANVAS_FILE };
    if (!canvas.canvasWestApiReady) return { gap: "WAITING_CANVAS_WEST_API", repairTarget: CANVAS_FILE };
    if (!canvas.canvasWestInspectionReady) return { gap: "WAITING_CANVAS_WEST_INSPECTION_EVIDENCE", repairTarget: CANVAS_FILE };
    if (!canvas.canvasSouthApiReady) return { gap: "WAITING_CANVAS_SOUTH_API", repairTarget: CANVAS_FILE };
    if (canvas.f13HardFail) return { gap: "CANVAS_F13_HARD_FAIL", repairTarget: CANVAS_FILE };
    if (!canvas.canvasSouthVisibleProofReady) return { gap: "WAITING_CANVAS_SOUTH_VISIBLE_PROOF", repairTarget: CANVAS_FILE };
    if (canvas.f13CanvasEvidenceComplete && canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict) {
      return { gap: "WAITING_CANVAS_SOUTH_STRICT_VISIBLE_PROOF", repairTarget: CANVAS_FILE };
    }
    if (canvas.f13CanvasEvidenceStrict) return { gap: "NONE_F13_STRICT_EVIDENCE_COMPLETE", repairTarget: NORTH_FILE };
    return { gap: "WAITING_CANVAS_F13_STRICT_EVIDENCE", repairTarget: CANVAS_FILE };
  }

  function normalizeCanvasStationSummary(summary = {}, method = "", canvasApi = null) {
    const s = isObject(summary) ? summary : {};
    const contract = safeString(firstDefined(
      s.currentCanvasParentContract,
      s.canvasLocalStationContract,
      s.contract,
      s.CONTRACT,
      canvasApi && canvasApi.currentCanvasParentContract,
      canvasApi && canvasApi.canvasLocalStationContract,
      canvasApi && canvasApi.contract,
      canvasApi && canvasApi.CONTRACT,
      datasetValue("hearthCanvasContract", ""),
      datasetValue("hearthSouthCurrentCanvasParentContract", "")
    ), "");

    const baselineV10_3Recognized = RECOGNIZED_CANVAS_BASELINE_CONTRACTS.includes(contract);
    const contractAccepted = canvasContractAccepted(contract, s);
    const shapeAccepted = state.canvasSummaryShapeTrusted;

    const observed = Boolean(
      canvasApi ||
      Object.keys(s).length ||
      contract ||
      safeBool(s.currentCanvasParentObserved, false) ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasLocalStationActive") === "true" ||
      shapeAccepted ||
      baselineV10_3Recognized
    );

    const apiReady = Boolean(
      contractAccepted &&
      (
        Boolean(canvasApi && isObject(canvasApi)) ||
        shapeAccepted ||
        safeBool(s.canvasLocalStationApiReady, false) ||
        safeBool(s.canvasParentBootMethodAvailable, false)
      )
    );

    const releaseAccepted = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.canvasParentReleaseAccepted, s.parentReleaseAccepted, s.releasePacketAccepted), false) ||
        datasetValue("hearthCanvasParentReleaseAccepted") === "true" ||
        datasetValue("hearthSouthCanvasParentReleaseAccepted") === "true"
      )
    );

    const parentReleaseLawful = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.parentReleaseLawful, s.canvasParentReleaseLawful, s.releasePacketValid, s.parentReleasePacketLawful), false) ||
        datasetValue("hearthCanvasParentReleaseLawful") === "true" ||
        datasetValue("hearthSouthParentReleaseLawful") === "true"
      )
    );

    const eastDispatchAuthorized = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.eastDispatchAuthorized, s.canvasEastDispatchAuthorized), false) ||
        datasetValue("hearthCanvasEastDispatchAuthorized") === "true" ||
        datasetValue("hearthSouthEastDispatchAuthorized") === "true"
      )
    );

    const eastDispatchPacketPublished = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.eastDispatchPacketPublished, s.canvasEastDispatchPacketPublished), false) ||
        datasetValue("hearthCanvasEastDispatchPacketPublished") === "true" ||
        datasetValue("hearthSouthEastDispatchPacketPublished") === "true"
      )
    );

    const canvasEastApiReady = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.canvasEastApiReady, s.eastApiReady, s.hearthCanvasEastApiReady), false) ||
        datasetValue("hearthCanvasEastApiReady") === "true" ||
        datasetValue("hearthSouthCanvasEastApiReady") === "true"
      )
    );

    const canvasEastEvidenceReady = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.canvasEastEvidenceReady, s.canvasEastF13AtlasPacketReady, s.eastEvidenceReady), false) ||
        datasetValue("hearthCanvasEastEvidenceReady") === "true" ||
        datasetValue("hearthSouthCanvasEastEvidenceReady") === "true"
      )
    );

    const canvasWestApiReady = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.canvasWestApiReady, s.westApiReady), false) ||
        datasetValue("hearthCanvasWestApiReady") === "true" ||
        datasetValue("hearthSouthCanvasWestApiReady") === "true"
      )
    );

    const canvasWestInspectionReady = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.canvasWestInspectionReady, s.canvasWestEvidenceReady, s.westEvidenceReady), false) ||
        datasetValue("hearthCanvasWestInspectionReady") === "true" ||
        datasetValue("hearthSouthCanvasWestInspectionReady") === "true"
      )
    );

    const canvasSouthApiReady = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.canvasSouthApiReady, s.southApiReady), false) ||
        datasetValue("hearthCanvasSouthApiReady") === "true" ||
        datasetValue("hearthSouthCanvasSouthApiReady") === "true"
      )
    );

    const canvasSouthVisibleProofReady = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.canvasSouthVisibleProofReady, s.canvasSouthEvidenceReady, s.southVisibleProofReady, s.southEvidenceReady), false) ||
        datasetValue("hearthCanvasSouthVisibleProofReady") === "true" ||
        datasetValue("hearthSouthCanvasSouthVisibleProofReady") === "true"
      )
    );

    const allCanvasChildrenApiReady = Boolean(
      contractAccepted &&
      (
        safeBool(s.allCanvasChildrenApiReady, false) ||
        (canvasEastApiReady && canvasWestApiReady && canvasSouthApiReady)
      )
    );

    const allCanvasChildrenEvidenceReady = Boolean(
      contractAccepted &&
      (
        safeBool(s.allCanvasChildrenEvidenceReady, false) ||
        (canvasEastEvidenceReady && canvasWestInspectionReady && canvasSouthVisibleProofReady)
      )
    );

    const allCanvasChildrenReady = Boolean(
      contractAccepted &&
      (
        safeBool(s.allCanvasChildrenReady, false) ||
        (allCanvasChildrenApiReady && allCanvasChildrenEvidenceReady)
      )
    );

    const f13HardFail = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.f13HardFail, s.canvasF13HardFail), false) ||
        datasetValue("hearthCanvasF13HardFail") === "true" ||
        datasetValue("hearthSouthF13HardFail") === "true"
      )
    );

    const f13CanvasEvidenceStrict = Boolean(
      contractAccepted &&
      safeBool(firstDefined(s.f13CanvasEvidenceStrict, s.f13EvidenceStrict), false) &&
      !f13HardFail
    );

    const f13CanvasEvidenceDegraded = Boolean(
      contractAccepted &&
      safeBool(firstDefined(s.f13CanvasEvidenceDegraded, s.f13EvidenceDegraded), false) &&
      !f13CanvasEvidenceStrict &&
      !f13HardFail
    );

    const f13CanvasEvidenceComplete = Boolean(
      contractAccepted &&
      (
        safeBool(firstDefined(s.f13CanvasEvidenceComplete, s.f13EvidenceComplete), false) ||
        f13CanvasEvidenceStrict ||
        f13CanvasEvidenceDegraded
      )
    );

    const aggregateGap = resolveCanvasAggregateGap({
      observed,
      contractAccepted,
      apiReady,
      releaseAccepted,
      parentReleaseLawful,
      eastDispatchAuthorized,
      eastDispatchPacketPublished,
      canvasEastApiReady,
      canvasEastEvidenceReady,
      canvasWestApiReady,
      canvasWestInspectionReady,
      canvasSouthApiReady,
      canvasSouthVisibleProofReady,
      f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete,
      f13HardFail
    });

    return {
      authority: canvasApi || null,
      observed,
      method,
      summaryObserved: Boolean(s && Object.keys(s).length),
      pushedSummaryProof: Boolean(shapeAccepted || isCanvasLocalStationShape(s)),
      currentCanvasParentObserved: observed,
      currentCanvasParentContractObserved: Boolean(contract),
      currentCanvasParentContract: contract,
      currentCanvasParentIsLocalStation: contractAccepted,
      canvasLocalStationApiReady: apiReady,
      canvasLocalStationContractAccepted: contractAccepted,
      canvasBaselineV10_3Recognized: baselineV10_3Recognized,
      v10_3BaselineRecognizedOnly: Boolean(baselineV10_3Recognized && !contractAccepted),
      v11OrLaterRequiredForLocalStationPass: true,
      canvasParentBootMethodAvailable: Boolean(
        contractAccepted &&
        (
          isFunction(canvasApi && canvasApi.boot) ||
          isFunction(canvasApi && canvasApi.init) ||
          isFunction(canvasApi && canvasApi.start) ||
          isFunction(canvasApi && canvasApi.mount) ||
          isFunction(canvasApi && canvasApi.consumeRouteConductorReleasePacket) ||
          isFunction(canvasApi && canvasApi.receiveReleasePacket) ||
          shapeAccepted
        )
      ),

      canvasParentReleaseAccepted: releaseAccepted,
      canvasParentReleaseObserved: releaseAccepted || parentReleaseLawful,
      parentReleaseLawful,
      parentAcceptedRouteConductorRelease: Boolean(
        contractAccepted &&
        (
          safeBool(firstDefined(s.parentAcceptedRouteConductorRelease, s.canvasParentAcceptedRouteConductorRelease), false) ||
          (releaseAccepted && parentReleaseLawful)
        )
      ),
      parentReleasePacketSentToEast: Boolean(
        contractAccepted &&
        (
          safeBool(firstDefined(s.parentReleasePacketSentToEast, s.eastDispatchPacketSent), false) ||
          eastDispatchAuthorized ||
          eastDispatchPacketPublished
        )
      ),
      parentReleasePacketLawful: Boolean(
        contractAccepted &&
        (
          safeBool(firstDefined(s.parentReleasePacketLawful, s.eastDispatchPacketLawful), false) ||
          (releaseAccepted && parentReleaseLawful)
        )
      ),
      eastDispatchAuthorized,
      eastDispatchPacketPublished,

      canvasEastApiReady,
      canvasEastEvidenceReady,
      canvasWestApiReady,
      canvasWestInspectionReady,
      canvasSouthApiReady,
      canvasSouthVisibleProofReady,
      allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady,

      f13CanvasReadinessObserved: Boolean(
        contractAccepted &&
        (
          observed ||
          allCanvasChildrenApiReady ||
          allCanvasChildrenEvidenceReady ||
          f13CanvasEvidenceComplete
        )
      ),
      f13VisibleEvidenceAvailable: Boolean(contractAccepted && (f13CanvasEvidenceComplete || canvasSouthVisibleProofReady)),
      f13InspectEvidenceAvailable: Boolean(contractAccepted && canvasWestInspectionReady),
      f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete,
      f13HardFail,

      f13StrictEvidenceGap: safeString(firstDefined(s.f13StrictEvidenceGap, aggregateGap.gap), aggregateGap.gap),
      f13StrictEvidenceRepairTarget: safeString(firstDefined(s.f13StrictEvidenceRepairTarget, aggregateGap.repairTarget), aggregateGap.repairTarget),
      recommendedNextFile: safeString(firstDefined(s.recommendedNextFile, s.recommendedNextRenewalTarget, aggregateGap.repairTarget), aggregateGap.repairTarget),
      recommendedNextRenewalTarget: safeString(firstDefined(s.recommendedNextRenewalTarget, s.recommendedNextFile, aggregateGap.repairTarget), aggregateGap.repairTarget),
      postgameStatus: safeString(firstDefined(s.postgameStatus, aggregateGap.gap), aggregateGap.gap),

      childCoordinatesTrusted: contractAccepted,
      staleChildCoordinateOverrideActive: !contractAccepted,
      nonLocalStationAggregateGateOverrideActive: !contractAccepted,
      noClaimPreserved: isNoClaimPreserved(s),
      raw: clonePlain(s)
    };
  }

  function readCanvasLocalStationSummary() {
    const canvasApi = readCanvasLocalStationApi();
    const read = readCanvasStationSummaryFromApi(canvasApi);
    const normalized = normalizeCanvasStationSummary(read.summary, read.method, canvasApi);
    state.currentCanvasStationSummary = clonePlain(normalized);
    return normalized;
  }

  function applyCanvasSummaryToState(canvas, methodName = "canvas-summary-receiver") {
    if (!isObject(canvas)) return false;

    state.canvasLocalStationObserved = canvas.observed;
    state.canvasLocalStationApiReady = canvas.canvasLocalStationApiReady;
    state.canvasLocalStationContract = canvas.currentCanvasParentContract;
    state.canvasLocalStationContractAccepted = canvas.currentCanvasParentIsLocalStation;
    state.canvasBaselineV10_3Recognized = canvas.canvasBaselineV10_3Recognized;
    state.v10_3BaselineRecognizedOnly = canvas.v10_3BaselineRecognizedOnly;
    state.canvasLocalStationSummaryObserved = canvas.summaryObserved;
    state.canvasLocalStationSummaryMethod = methodName;
    state.canvasLocalStationPushedSummaryProof = canvas.pushedSummaryProof === true;

    state.currentCanvasParentObserved = canvas.currentCanvasParentObserved;
    state.currentCanvasParentContractObserved = canvas.currentCanvasParentContractObserved;
    state.currentCanvasParentContract = canvas.currentCanvasParentContract;
    state.currentCanvasParentIsLocalStation = canvas.currentCanvasParentIsLocalStation;
    state.canvasParentBootMethodAvailable = canvas.canvasParentBootMethodAvailable;

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
    state.degradedF13IsFunctional = Boolean(canvas.f13CanvasEvidenceDegraded && canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict);
    state.strictVisualProofPending = Boolean(canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict && !canvas.f13HardFail);
    state.functionalPageObserved = Boolean(canvas.f13CanvasEvidenceComplete && !canvas.f13HardFail);

    state.firstFailedCoordinate = canvas.f13StrictEvidenceGap || state.firstFailedCoordinate;
    state.recommendedNextFile = canvas.recommendedNextFile || CANVAS_FILE;
    state.recommendedNextRenewalTarget = canvas.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.canvasNextAuditTarget = canvas.recommendedNextFile || CANVAS_FILE;
    state.postgameStatus = canvas.postgameStatus || state.postgameStatus;

    state.currentCanvasStationSummary = clonePlain(canvas);
    state.canvasLocalStationNotificationConsumed = true;
    state.canvasLocalStationNotificationMethod = methodName;
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
      const normalized = normalizeCanvasStationSummary(summary || {}, methodName, null);
      applyCanvasSummaryToState(normalized, methodName);

      record("CANVAS_LOCAL_STATION_SUMMARY_RECEIVED", {
        methodName,
        currentCanvasParentContract: normalized.currentCanvasParentContract,
        currentCanvasParentIsLocalStation: normalized.currentCanvasParentIsLocalStation,
        canvasLocalStationApiReady: normalized.canvasLocalStationApiReady,
        acceptedByContract: state.canvasSummaryAcceptedByContract,
        acceptedByShape: state.canvasSummaryAcceptedByShape,
        f13StrictEvidenceGap: normalized.f13StrictEvidenceGap,
        noRefreshCalled: true,
        noReleaseRedelivered: true,
        routeConductorControlBindingDisabled: true,
        watchdogDeliveryLoopDisabled: true
      });

      publishGlobals("canvas-summary-receiver-nonrecursive-publication", false);
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

  function reconcileCanvas(summary) {
    return receiveCanvasSummary(summary, "reconcileCanvas");
  }

  function composeCanvasReleasePacket(index, f8, macroWest, canvasBefore) {
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
      canvasBefore.canvasLocalStationApiReady &&
      canvasBefore.currentCanvasParentIsLocalStation &&
      canvasBefore.canvasParentBootMethodAvailable
    );

    const authorized = Boolean(indexReady && f8Ready && westReady && canvasReceivable);

    const heldReason = authorized
      ? "NONE_CYCLE_TWO_CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST"
      : !indexReady
        ? index.holdReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY"
        : !f8Ready
          ? f8.firstFailedCoordinate
          : !macroWest.macroWestAuthorityObserved
            ? "WAITING_MACRO_WEST_AUTHORITY"
            : !macroWest.macroWestAdmissibilityObserved
              ? "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION"
              : macroWest.westHardBlock
                ? "MACRO_WEST_HARD_BLOCK"
                : !macroWest.westCanvasReleaseApproved
                  ? macroWest.westFirstFailedCoordinate || "WAITING_MACRO_WEST_CANVAS_RELEASE_APPROVAL"
                  : !canvasBefore.currentCanvasParentObserved
                    ? "WAITING_CANVAS_LOCAL_STATION_API"
                    : !canvasBefore.currentCanvasParentIsLocalStation
                      ? "WAITING_CANVAS_LOCAL_STATION_CURRENT_CONTRACT_OR_SHAPE"
                      : !canvasBefore.canvasLocalStationApiReady
                        ? "WAITING_CANVAS_LOCAL_STATION_API"
                        : !canvasBefore.canvasParentBootMethodAvailable
                          ? "WAITING_CANVAS_LOCAL_STATION_BOOT_METHOD"
                          : "WAITING_CANVAS_RELEASE_AUTHORIZATION";

    const recommended = authorized
      ? CANVAS_FILE
      : !indexReady
        ? INDEX_FILE
        : !f8Ready
          ? FILE
          : !westReady
            ? MACRO_WEST_FILE
            : CANVAS_FILE;

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET",
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      routeConductorContract: CONTRACT,
      routeConductorReceipt: RECEIPT,
      currentRouteConductorContract: CONTRACT,
      currentRouteConductorReceipt: RECEIPT,
      previousRouteConductorContract: PREVIOUS_CONTRACT,
      previousRouteConductorReceipt: PREVIOUS_RECEIPT,
      legacyRouteConductorContract: LEGACY_NORTH_STAR_CONTRACT,
      legacyRouteConductorReceipt: LEGACY_NORTH_STAR_RECEIPT,
      acceptedRouteConductorLineage: [
        CONTRACT,
        PREVIOUS_CONTRACT,
        LEGACY_NORTH_STAR_CONTRACT
      ],

      sourceFile: FILE,
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,

      routeConductorAuthorityCardinal: CARDINALS.NORTH,
      activeCycleInputCardinal: CARDINALS.SOUTH,
      activeCycleHandoffTarget: authorized ? CARDINALS.CANVAS : CARDINALS.WEST,

      cycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      activeCycleNumber: 2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
      receivedFrom: CARDINALS.WEST,
      sourceCardinal: CARDINALS.WEST,
      handoffTo: authorized ? CARDINALS.CANVAS : "",

      indexPairReady: index.indexPairReady,
      carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
      indexHandoffToRouteConductor: index.indexHandoffToRouteConductor,
      f8SelfDutySatisfied: f8.f8SelfDutySatisfied,

      macroWestAuthorityObserved: macroWest.macroWestAuthorityObserved,
      macroWestAdmissibilityObserved: macroWest.macroWestAdmissibilityObserved,
      macroWestMethodUsed: macroWest.macroWestMethodUsed,
      macroWestContract: macroWest.macroWestContract,
      westDecision: macroWest.westDecision,
      westGapClass: macroWest.westGapClass,
      westGapSeverity: macroWest.westGapSeverity,
      westHardBlock: macroWest.westHardBlock,
      westForwardAllowed: macroWest.westForwardAllowed,
      westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,
      westReleasePacketObserved: macroWest.westReleasePacketObserved,
      westReleasePacketSource: macroWest.westReleasePacketSource,

      canvasLocalStationObserved: canvasBefore.observed,
      canvasLocalStationApiReady: canvasBefore.canvasLocalStationApiReady,
      currentCanvasParentContract: canvasBefore.currentCanvasParentContract,
      currentCanvasParentIsLocalStation: canvasBefore.currentCanvasParentIsLocalStation,
      canvasSummaryAcceptedByContract: state.canvasSummaryAcceptedByContract,
      canvasSummaryAcceptedByShape: state.canvasSummaryAcceptedByShape,
      canvasSummaryShapeTrusted: state.canvasSummaryShapeTrusted,

      canvasReleaseAuthorized: authorized,
      canvasReleasePacketReady: authorized,
      canvasReleaseApproved: authorized,
      canvasReleaseApprovedByWest: authorized,
      releaseToCanvas: authorized,
      canvasReleaseRequiresMacroWest: true,
      canvasReleaseHeldReason: heldReason,

      bridgeAlignmentActive: true,
      diagnosticBridgeActive: true,
      canvasLocalStationOwnsChildDistribution: true,
      routeConductorDirectCanvasChildScanRemoved: true,
      canvasReleaseReentryGuardActive: true,
      readOnlyGetterDeliveryBlocked: true,
      routeConductorControlBindingDisabled: true,
      indexOwnsControlBinding: true,
      routeConductorOwnsControlBinding: false,
      watchdogDeliveryLoopDisabled: true,
      canvasReleaseIntervalRedeliveryDisabled: true,

      firstFailedCoordinate: heldReason,
      recommendedNextFile: recommended,
      recommendedNextRenewalTarget: recommended,
      composedAt: nowIso(),

      ...FINAL_FALSE
    };

    state.currentCanvasReleasePacket = clonePlain(packet);
    return packet;
  }

  function deliverReleaseToCanvasLocalStation(canvasApi, packet) {
    if (!isObject(packet) || packet.canvasReleaseAuthorized !== true) {
      return {
        delivered: false,
        accepted: false,
        method: "",
        reason: packet ? packet.canvasReleaseHeldReason : "WAITING_CANVAS_RELEASE_PACKET",
        receipt: null,
        reentryBlocked: false
      };
    }

    const signature = packetSignature(packet);

    if (state.canvasReleaseDeliveryInProgress) {
      record("CANVAS_RELEASE_DELIVERY_REENTRY_BLOCKED", { signature });
      return {
        delivered: false,
        accepted: state.canvasLocalStationReleaseAccepted,
        method: "",
        reason: "CANVAS_RELEASE_DELIVERY_REENTRY_BLOCKED",
        receipt: null,
        reentryBlocked: true
      };
    }

    if (
      signature &&
      state.lastCanvasReleasePacketSignature === signature &&
      state.canvasLocalStationReleaseAccepted === true
    ) {
      record("CANVAS_RELEASE_DUPLICATE_DELIVERY_BLOCKED", { signature });
      return {
        delivered: false,
        accepted: true,
        method: state.canvasLocalStationReleaseDeliveryMethod || "previous-accepted-release",
        reason: "CANVAS_RELEASE_DUPLICATE_DELIVERY_BLOCKED_ALREADY_ACCEPTED",
        receipt: null,
        duplicateBlocked: true
      };
    }

    state.canvasReleaseDeliveryInProgress = true;

    try {
      state.canvasLocalStationReleasePacketDelivered = false;
      state.canvasLocalStationReleaseDeliveryMethod = "";
      state.canvasLocalStationReleaseAccepted = false;

      if (!canvasApi || !isObject(canvasApi)) {
        return {
          delivered: false,
          accepted: false,
          method: "",
          reason: "WAITING_CANVAS_LOCAL_STATION_API",
          receipt: null
        };
      }

      const methods = [
        "consumeRouteConductorReleasePacket",
        "receiveRouteConductorReleasePacket",
        "receiveReleasePacket",
        "receiveCanvasReleasePacket",
        "receiveCanvasParentPacket",
        "consumeReleasePacket",
        "acceptReleasePacket"
      ];

      for (const method of methods) {
        if (!isFunction(canvasApi[method])) continue;
        try {
          const result = canvasApi[method](clonePlain(packet));
          const receipt = isObject(result) ? result : readReceipt(canvasApi) || {};
          const accepted = Boolean(
            safeBool(firstDefined(receipt.canvasParentReleaseAccepted, receipt.releasePacketAccepted), false) ||
            safeBool(firstDefined(receipt.parentReleaseLawful, receipt.canvasParentReleaseLawful), false)
          );

          state.canvasLocalStationReleasePacketDelivered = true;
          state.canvasLocalStationReleaseDeliveryMethod = method;
          state.canvasLocalStationReleaseAccepted = accepted;
          state.lastCanvasReleasePacketSignature = signature;

          record("CANVAS_LOCAL_STATION_RELEASE_PACKET_DELIVERED", {
            method,
            accepted,
            currentCanvasParentContract: receipt.currentCanvasParentContract || receipt.contract || "",
            signature,
            deliveredByRefreshOnly: true,
            intervalRedeliveryDisabled: true
          });

          return {
            delivered: true,
            accepted,
            method,
            reason: accepted ? "CANVAS_LOCAL_STATION_ACCEPTED_RELEASE" : "CANVAS_LOCAL_STATION_RETURNED_WITHOUT_ACCEPTANCE",
            receipt: clonePlain(receipt),
            signature
          };
        } catch (error) {
          recordError("CANVAS_LOCAL_STATION_RELEASE_METHOD_FAILED", error, { method });
        }
      }

      return {
        delivered: false,
        accepted: false,
        method: "",
        reason: "CANVAS_LOCAL_STATION_RELEASE_RECEIVER_MISSING",
        receipt: null,
        signature
      };
    } finally {
      state.canvasReleaseDeliveryInProgress = false;
    }
  }

  function resolveNewsState(index, f8, macroWest, canvas) {
    const indexGateReady = Boolean(index.indexPairReady && index.carrierHostAdmissibilityReady);
    const routeF8GateReady = Boolean(f8.f8SelfDutySatisfied);
    const macroWestGateReady = Boolean(macroWest.macroWestAdmissibilityObserved && macroWest.westCanvasReleaseApproved && macroWest.westForwardAllowed && !macroWest.westHardBlock);
    const canvasLocalStationGateReady = Boolean(canvas.canvasLocalStationApiReady && canvas.currentCanvasParentIsLocalStation);
    const canvasParentGateReady = Boolean(canvas.currentCanvasParentObserved && canvas.currentCanvasParentIsLocalStation && canvas.canvasParentBootMethodAvailable);
    const canvasParentReleaseGateReady = Boolean(canvas.canvasParentReleaseAccepted && canvas.parentReleaseLawful);
    const canvasParentEastDispatchGateReady = Boolean(canvas.eastDispatchAuthorized || canvas.eastDispatchPacketPublished);
    const canvasEastGateReady = Boolean(canvas.canvasEastApiReady);
    const canvasWestGateReady = Boolean(canvas.canvasWestApiReady && canvas.canvasWestInspectionReady);
    const canvasSouthGateReady = Boolean(canvas.canvasSouthApiReady && canvas.canvasSouthVisibleProofReady && !canvas.f13HardFail);
    const canvasGateReady = Boolean(
      canvasParentGateReady &&
      canvasParentReleaseGateReady &&
      canvasParentEastDispatchGateReady &&
      canvas.allCanvasChildrenReady &&
      canvas.f13CanvasEvidenceComplete &&
      !canvas.f13HardFail
    );

    const baseBeforeF21 = Boolean(
      indexGateReady &&
      routeF8GateReady &&
      macroWestGateReady &&
      canvasLocalStationGateReady &&
      canvasParentGateReady &&
      canvasParentReleaseGateReady &&
      canvasParentEastDispatchGateReady &&
      canvasEastGateReady &&
      canvasWestGateReady &&
      canvasSouthGateReady &&
      canvasGateReady
    );

    return {
      indexGateReady,
      routeF8GateReady,
      macroWestGateReady,
      canvasLocalStationGateReady,
      canvasParentGateReady,
      canvasParentReleaseGateReady,
      canvasParentEastDispatchGateReady,
      canvasEastGateReady,
      canvasWestGateReady,
      canvasSouthGateReady,
      canvasGateReady,
      newsGatePassedBeforeF21: Boolean(baseBeforeF21 && canvas.f13CanvasEvidenceStrict),
      newsGateDegradedBeforeF21: Boolean(baseBeforeF21 && canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict)
    };
  }

  function resolveF21Eligibility(index, f8, macroWest, canvas, news) {
    const eligible = Boolean(
      index.indexPairReady &&
      index.carrierHostAdmissibilityReady &&
      f8.f8SelfDutySatisfied &&
      macroWest.macroWestAdmissibilityObserved &&
      macroWest.westCanvasReleaseApproved &&
      macroWest.westForwardAllowed &&
      !macroWest.westHardBlock &&
      canvas.currentCanvasParentIsLocalStation &&
      canvas.canvasLocalStationApiReady &&
      canvas.canvasParentReleaseAccepted &&
      canvas.parentReleaseLawful &&
      (canvas.eastDispatchAuthorized || canvas.eastDispatchPacketPublished) &&
      canvas.f13CanvasEvidenceComplete &&
      !canvas.f13HardFail &&
      (news.newsGatePassedBeforeF21 || news.newsGateDegradedBeforeF21)
    );

    const firstFailedCoordinate = eligible
      ? "NONE_F21_ELIGIBLE_FOR_NORTH"
      : !index.indexPairReady || !index.carrierHostAdmissibilityReady
        ? index.holdReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY"
        : !f8.f8SelfDutySatisfied
          ? f8.firstFailedCoordinate
          : !macroWest.macroWestAdmissibilityObserved || !macroWest.westCanvasReleaseApproved
            ? "WAITING_MACRO_WEST_CANVAS_RELEASE"
            : !canvas.currentCanvasParentObserved
              ? "WAITING_CANVAS_LOCAL_STATION_API"
              : !canvas.currentCanvasParentIsLocalStation
                ? "WAITING_CANVAS_LOCAL_STATION_CURRENT_CONTRACT_OR_SHAPE"
                : !canvas.canvasLocalStationApiReady
                  ? "WAITING_CANVAS_LOCAL_STATION_API"
                  : !canvas.canvasParentReleaseAccepted
                    ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
                    : !canvas.parentReleaseLawful
                      ? "WAITING_CANVAS_PARENT_RELEASE_LAWFUL"
                      : !canvas.eastDispatchAuthorized && !canvas.eastDispatchPacketPublished
                        ? "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION"
                        : !canvas.f13CanvasEvidenceComplete
                          ? canvas.f13StrictEvidenceGap || "WAITING_CANVAS_F13_EVIDENCE"
                          : canvas.f13HardFail
                            ? "CANVAS_F13_HARD_FAIL"
                            : "WAITING_NEWS_GATE_BEFORE_F21";

    return {
      f21EligibleForNorth: eligible,
      f21EligibilitySubmittedToNorth: state.f21EligibilitySubmittedToNorth,
      f21EligibilitySubmittedAt: state.f21EligibilitySubmittedAt || "",
      f21EligibilitySubmissionCount: state.f21EligibilitySubmissionCount || 0,
      f21LatchMode: eligible
        ? canvas.f13CanvasEvidenceStrict
          ? "READY_FOR_NORTH_STRICT_F21_LATCH"
          : "READY_FOR_NORTH_DEGRADED_F21_LATCH"
        : firstFailedCoordinate,
      firstFailedCoordinate,
      completionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      f21ClaimedByRouteConductor: false
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
        evidenceReady: index.indexPairReady && index.carrierHostAdmissibilityReady,
        passed: index.indexPairReady && index.carrierHostAdmissibilityReady && index.indexHandoffToRouteConductor,
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
        degraded: macroWest.westDegradedForwardApproved,
        passed: macroWest.macroWestAdmissibilityObserved && macroWest.westCanvasReleaseApproved && macroWest.westForwardAllowed && !macroWest.westHardBlock,
        firstFailedCoordinate: macroWest.westFirstFailedCoordinate,
        recommendedNextFile: macroWest.westRecommendedNextRenewalTarget || MACRO_WEST_FILE
      }),
      composeStation(STATION_IDS.CANVAS_LOCAL_STATION, CANVAS_FILE, {
        observed: canvas.currentCanvasParentObserved,
        apiReady: canvas.canvasLocalStationApiReady,
        evidenceReady: canvas.currentCanvasParentIsLocalStation,
        passed: canvas.currentCanvasParentObserved && canvas.currentCanvasParentIsLocalStation && canvas.canvasLocalStationApiReady && canvas.canvasParentBootMethodAvailable,
        firstFailedCoordinate: !canvas.currentCanvasParentObserved
          ? "WAITING_CANVAS_LOCAL_STATION_API"
          : !canvas.currentCanvasParentIsLocalStation
            ? "WAITING_CANVAS_LOCAL_STATION_CURRENT_CONTRACT_OR_SHAPE"
            : !canvas.canvasLocalStationApiReady
              ? "WAITING_CANVAS_LOCAL_STATION_API"
              : "WAITING_CANVAS_LOCAL_STATION_BOOT_METHOD",
        recommendedNextFile: CANVAS_FILE
      }),
      composeStation(STATION_IDS.CANVAS_RELEASE, CANVAS_FILE, {
        observed: canvas.canvasParentReleaseObserved,
        apiReady: canvas.canvasParentBootMethodAvailable,
        evidenceReady: canvas.canvasParentReleaseAccepted && canvas.parentReleaseLawful,
        releaseAccepted: canvas.canvasParentReleaseAccepted,
        passed: canvas.canvasParentReleaseAccepted && canvas.parentReleaseLawful && (canvas.eastDispatchAuthorized || canvas.eastDispatchPacketPublished),
        firstFailedCoordinate: !canvas.canvasParentReleaseAccepted
          ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
          : !canvas.parentReleaseLawful
            ? "WAITING_CANVAS_PARENT_RELEASE_LAWFUL"
            : !canvas.eastDispatchAuthorized && !canvas.eastDispatchPacketPublished
              ? "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION"
              : "NONE_CANVAS_RELEASE_ACCEPTED_AND_DISPATCHED",
        recommendedNextFile: CANVAS_FILE
      }),
      composeStation(STATION_IDS.CANVAS_F13, CANVAS_FILE, {
        observed: canvas.f13CanvasReadinessObserved,
        apiReady: canvas.allCanvasChildrenApiReady,
        evidenceReady: canvas.f13CanvasEvidenceComplete,
        hardFail: canvas.f13HardFail,
        degraded: canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict,
        passed: canvas.f13CanvasEvidenceComplete && !canvas.f13HardFail,
        firstFailedCoordinate: canvas.f13StrictEvidenceGap,
        recommendedNextFile: canvas.f13StrictEvidenceRepairTarget || CANVAS_FILE
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
      satisfied >= count - 1 &&
      canvas.f13CanvasEvidenceDegraded &&
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

  function selectNextFile(index, f8, macroWest, canvas, f21, releasePacket) {
    if (canvas.currentCanvasParentObserved && !canvas.currentCanvasParentIsLocalStation) return CANVAS_FILE;
    if (!index.indexPairReady || !index.carrierHostAdmissibilityReady || !index.indexHandoffToRouteConductor) return INDEX_FILE;
    if (!f8.f8SelfDutySatisfied) return FILE;
    if (!macroWest.macroWestAdmissibilityObserved || !macroWest.westCanvasReleaseApproved || !macroWest.westForwardAllowed || macroWest.westHardBlock) return MACRO_WEST_FILE;
    if (!canvas.currentCanvasParentObserved || !canvas.currentCanvasParentIsLocalStation || !canvas.canvasLocalStationApiReady || !canvas.canvasParentBootMethodAvailable) return CANVAS_FILE;
    if (!releasePacket || releasePacket.canvasReleaseAuthorized !== true) return releasePacket ? releasePacket.recommendedNextFile : MACRO_WEST_FILE;
    if (!canvas.canvasParentReleaseAccepted || !canvas.parentReleaseLawful || (!canvas.eastDispatchAuthorized && !canvas.eastDispatchPacketPublished)) return CANVAS_FILE;
    if (!canvas.f13CanvasEvidenceComplete || canvas.f13HardFail) return canvas.f13StrictEvidenceRepairTarget || CANVAS_FILE;
    if (canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict) return canvas.f13StrictEvidenceRepairTarget || CANVAS_FILE;
    if (f21.f21EligibleForNorth) return NORTH_FILE;
    return CANVAS_FILE;
  }

  function composeVisibleState(packet = {}) {
    const p = isObject(packet) ? packet : {};
    const visibleProgress = p.f21EligibleForNorth
      ? 94
      : p.f13CanvasEvidenceComplete
        ? p.f13CanvasEvidenceStrict ? 90 : 82
        : p.canvasParentReleaseAccepted && p.parentReleaseLawful && (p.eastDispatchAuthorized || p.eastDispatchPacketPublished)
          ? 76
          : p.canvasReleaseAuthorized
            ? 68
            : p.currentCanvasParentObserved && p.currentCanvasParentIsLocalStation
              ? 58
              : p.currentCanvasParentObserved
                ? 52
                : p.macroWestAdmissibilityObserved
                  ? 48
                  : p.carrierHostAdmissibilityReady
                    ? 42
                    : p.f8SelfDutySatisfied
                      ? 34
                      : p.routeConductorMarkerPresent
                        ? 24
                        : 12;

    const visibleStatusText = p.f21EligibleForNorth
      ? "Ready for North latch"
      : p.f13CanvasEvidenceComplete && p.f13CanvasEvidenceStrict
        ? "Canvas F13 strict evidence complete"
        : p.f13CanvasEvidenceComplete
          ? "Canvas F13 evidence complete · strict proof pending"
          : p.canvasSummaryAcceptedByShape
            ? "Canvas local station shape accepted · waiting F13 aggregate"
            : !p.canvasLocalStationObserved
              ? "Waiting Canvas local station"
              : !p.canvasLocalStationContractAccepted
                ? "Waiting Canvas local station contract or lawful summary shape"
                : !p.canvasLocalStationApiReady
                  ? "Waiting Canvas local station API"
                  : !p.canvasParentReleaseAccepted
                    ? "Waiting Canvas Parent release acceptance"
                    : !p.parentReleaseLawful
                      ? "Waiting Canvas Parent lawful release"
                      : !p.eastDispatchAuthorized && !p.eastDispatchPacketPublished
                        ? "Waiting Canvas Parent East dispatch"
                        : "Canvas local station active · waiting F13 aggregate";

    return {
      activeCycleNumber: p.activeCycleNumber,
      activeCycleRoute: p.activeCycleRoute,
      activeFileGate: FILE,
      routeConductorAuthorityCardinal: CARDINALS.NORTH,
      activeCycleInputCardinal: CARDINALS.SOUTH,
      activeCycleHandoffTarget: p.activeCycleHandoffTarget,
      activeFibonacci: p.activeFibonacci,
      activeNewsGate: p.activeNewsGate,
      activeGearId: p.activeGearId,
      activeGearLabel: p.activeStageId || p.activeGearId,
      activeGearLocalProgress: visibleProgress,
      visibleProgress,
      visibleStatusText,
      postgameStatus: p.postgameStatus,
      firstFailedCoordinate: p.firstFailedCoordinate,
      recommendedNextFile: p.recommendedNextFile,
      recommendedNextRenewalTarget: p.recommendedNextRenewalTarget,
      canvasLocalStationObserved: p.canvasLocalStationObserved,
      canvasLocalStationApiReady: p.canvasLocalStationApiReady,
      currentCanvasParentContract: p.currentCanvasParentContract,
      currentCanvasParentIsLocalStation: p.currentCanvasParentIsLocalStation,
      canvasSummaryAcceptedByContract: p.canvasSummaryAcceptedByContract,
      canvasSummaryAcceptedByShape: p.canvasSummaryAcceptedByShape,
      canvasParentReleaseAccepted: p.canvasParentReleaseAccepted,
      parentReleaseLawful: p.parentReleaseLawful,
      eastDispatchAuthorized: p.eastDispatchAuthorized,
      eastDispatchPacketPublished: p.eastDispatchPacketPublished,
      f13CanvasEvidenceStrict: p.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: p.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: p.f13CanvasEvidenceComplete,
      f13StrictEvidenceGap: p.f13StrictEvidenceGap,
      fibonacciSynchronizationScore: p.fibonacciSynchronizationScore,
      fibonacciSynchronizationPassed: p.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: p.fibonacciSynchronizationDegraded,
      routeConductorControlBindingDisabled: true,
      indexOwnsControlBinding: true,
      watchdogDeliveryLoopDisabled: true,
      completionLatched: false,
      visualPassClaimed: false
    };
  }

  function composePrimaryPacket(input = {}, options = {}) {
    const allowDelivery = options.allowDelivery === true;

    try {
      const index = readIndexAuthority();
      const f8 = resolveF8SelfDuty();
      const macroWest = classifyMacroWestAdmissibility(index, f8);
      const canvasBefore = readCanvasLocalStationSummary();
      const releasePacket = composeCanvasReleasePacket(index, f8, macroWest, canvasBefore);

      if (allowDelivery && releasePacket.canvasReleaseAuthorized) {
        deliverReleaseToCanvasLocalStation(canvasBefore.authority, releasePacket);
      }

      const canvas = allowDelivery ? readCanvasLocalStationSummary() : canvasBefore;
      const news = resolveNewsState(index, f8, macroWest, canvas);
      const f21 = resolveF21Eligibility(index, f8, macroWest, canvas, news);
      const stationBoard = composeStationBoard(index, f8, macroWest, canvas, f21);
      const fibonacci = computeFibonacci(stationBoard, canvas);
      const recommendedNextFile = selectNextFile(index, f8, macroWest, canvas, f21, releasePacket);

      const firstFailedCoordinate = stationBoard.chronologicalFirstFailedCoordinate !== "NONE_CHRONOLOGY_COMPLETE"
        ? stationBoard.chronologicalFirstFailedCoordinate
        : f21.firstFailedCoordinate || "NONE_SWITCHBOARD_COMPLETE";

      const postgameStatus = f21.f21EligibleForNorth
        ? "WAITING_NORTH_F21_LATCH"
        : canvas.f13CanvasEvidenceComplete
          ? canvas.f13CanvasEvidenceStrict
            ? "CANVAS_F13_STRICT_EVIDENCE_COMPLETE_WAITING_NORTH"
            : "FUNCTIONAL_DEGRADED_F13_STRICT_PROOF_PENDING"
          : canvas.currentCanvasParentObserved && canvas.currentCanvasParentIsLocalStation
            ? "CANVAS_LOCAL_STATION_ACTIVE_WAITING_F13_AGGREGATE"
            : canvas.currentCanvasParentObserved
              ? "WAITING_CANVAS_LOCAL_STATION_CURRENT_CONTRACT_OR_SHAPE"
              : "WAITING_CANVAS_LOCAL_STATION_SUMMARY";

      const packet = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        previousReceipt: PREVIOUS_RECEIPT,
        legacyNorthStarContract: LEGACY_NORTH_STAR_CONTRACT,
        legacyNorthStarReceipt: LEGACY_NORTH_STAR_RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        role: state.role,

        routeConductorAuthorityCardinal: CARDINALS.NORTH,
        activeCycleInputCardinal: CARDINALS.SOUTH,
        activeCycleHandoffTarget: releasePacket.canvasReleaseAuthorized ? CARDINALS.CANVAS : CARDINALS.WEST,

        bridgeAlignmentActive: true,
        diagnosticBridgeActive: true,
        diagnosticDoorwayAndReceiptSeparated: true,
        canvasLocalStationSummaryBridgeActive: true,
        canvasSummaryAcceptedByContract: state.canvasSummaryAcceptedByContract,
        canvasSummaryAcceptedByShape: state.canvasSummaryAcceptedByShape,
        canvasSummaryShapeTrusted: state.canvasSummaryShapeTrusted,

        northStarCompletionCycleGovernorActive: true,
        centralStationOverloadSuperseded: true,
        canvasLocalStationConsumptionActive: true,
        directCanvasChildScanningRemoved: true,
        canvasSummarySourceRequired: true,
        canvasParentV10_3HardExpectationRetired: true,

        receiveCanvasStationSummaryAvailable: true,
        receiveCanvasLocalStationSummaryAvailable: true,
        receiveCanvasParentSummaryAvailable: true,
        reconcileCanvasAvailable: true,
        canvasReleaseReentryGuardActive: true,
        readOnlyGetterDeliveryBlocked: true,
        v10_3BaselineRecognizedOnly: canvas.v10_3BaselineRecognizedOnly,
        v11OrLaterRequiredForLocalStationPass: true,
        pushedSummaryApiReadinessCorrectionActive: true,
        contractGateOverridesStaleChildCoordinates: true,
        nonLocalStationChildCoordinateTrustBlocked: true,
        contractDriftBridgeActive: true,
        canvasSummaryReceiveInProgress: state.canvasSummaryReceiveInProgress,
        canvasReleaseDeliveryInProgress: state.canvasReleaseDeliveryInProgress,
        lastCanvasReleasePacketSignature: state.lastCanvasReleasePacketSignature,

        routeConductorControlBindingDisabled: true,
        indexOwnsControlBinding: true,
        routeConductorOwnsControlBinding: false,
        routeConductorUsesPassiveControlObservation: true,
        duplicateButtonHandlerRiskRemoved: true,
        controlSurfacePassiveObservationActive: true,
        controlSurfaceObserved: state.controlSurfaceObserved,
        controlSurfaceButtonsObserved: state.controlSurfaceButtonsObserved,
        routeConductorControlListenersAttached: false,

        watchdogPassiveObservationActive: true,
        watchdogDeliveryLoopDisabled: true,
        canvasReleaseIntervalRedeliveryDisabled: true,
        refreshDeliveryBounded: true,
        passiveWatchdogMaxTicks: PASSIVE_WATCHDOG_MAX_TICKS,
        passiveObservationTicks: state.passiveObservationTicks,
        htmlRebuildRequired: false,
        indexRebuildRequired: false,

        newsAlignmentProtocolActive: true,
        newsChronologicalOrderLocked: true,
        fibonacciSynchronizationChronologyFirst: true,
        macroWestBoundaryActive: true,
        canvasReleaseBoundaryActive: true,
        f21EligibilitySubmissionOnly: true,
        antiFalseCompletionLawActive: true,

        activeCycleNumber: 2,
        activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
        cycleNumber: 2,
        cycleRoute: CYCLE_ROUTES.CYCLE_2,
        receivedFrom: CARDINALS.SOUTH,
        handoffTo: releasePacket.canvasReleaseAuthorized ? CARDINALS.CANVAS : CARDINALS.WEST,
        returnTo: "",
        activeCardinal: CARDINALS.NORTH,
        activeNewsGate: CARDINALS.NORTH,
        activeFibonacci: "F8",
        activeFibonacciRank: 8,
        activeStageId: state.activeStageId,
        activeGearId: state.activeGearId,

        indexAuthorityObserved: index.observed,
        indexPairReady: index.indexPairReady,
        indexShellAccepted: index.shellAccepted,
        indexRuntimeReleaseAuthorized: index.runtimeReleaseAuthorized,
        indexRuntimeReleaseComplete: index.runtimeReleaseComplete,
        indexRuntimeReleaseHeld: index.runtimeReleaseHeld,
        indexMountPresent: index.mountPresent,
        indexControlsBound: index.controlsBound,
        carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
        carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
        indexHandoffToRouteConductor: index.indexHandoffToRouteConductor,
        indexPairHoldReason: index.holdReason,

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
        westGapClass: macroWest.westGapClass,
        westGapSeverity: macroWest.westGapSeverity,
        westHardBlock: macroWest.westHardBlock,
        westForwardAllowed: macroWest.westForwardAllowed,
        westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,
        westDegradedForwardApproved: macroWest.westDegradedForwardApproved,
        westReleasePacketObserved: macroWest.westReleasePacketObserved,
        westReleasePacketSource: macroWest.westReleasePacketSource,
        westFirstFailedCoordinate: macroWest.westFirstFailedCoordinate,
        westRecommendedNextRenewalTarget: macroWest.westRecommendedNextRenewalTarget,

        canvasLocalStationObserved: canvas.observed,
        canvasLocalStationApiReady: canvas.canvasLocalStationApiReady,
        canvasLocalStationContract: canvas.currentCanvasParentContract,
        canvasLocalStationContractAccepted: canvas.currentCanvasParentIsLocalStation,
        canvasBaselineV10_3Recognized: canvas.canvasBaselineV10_3Recognized,
        canvasLocalStationSummaryObserved: canvas.summaryObserved,
        canvasLocalStationSummaryMethod: canvas.method || state.canvasLocalStationSummaryMethod,
        canvasLocalStationPushedSummaryProof: canvas.pushedSummaryProof,
        canvasLocalStationReleasePacketDelivered: state.canvasLocalStationReleasePacketDelivered,
        canvasLocalStationReleaseDeliveryMethod: state.canvasLocalStationReleaseDeliveryMethod,
        canvasLocalStationReleaseAccepted: state.canvasLocalStationReleaseAccepted,
        canvasLocalStationNotificationConsumed: state.canvasLocalStationNotificationConsumed,
        canvasLocalStationNotificationMethod: state.canvasLocalStationNotificationMethod,

        currentCanvasParentObserved: canvas.currentCanvasParentObserved,
        currentCanvasParentContractObserved: canvas.currentCanvasParentContractObserved,
        currentCanvasParentContract: canvas.currentCanvasParentContract,
        currentCanvasParentIsLocalStation: canvas.currentCanvasParentIsLocalStation,
        canvasParentBootMethodAvailable: canvas.canvasParentBootMethodAvailable,

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
        degradedF13IsFunctional: Boolean(canvas.f13CanvasEvidenceDegraded && canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict),
        strictVisualProofPending: Boolean(canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict && !canvas.f13HardFail),
        functionalPageObserved: Boolean(canvas.f13CanvasEvidenceComplete && !canvas.f13HardFail),
        childCoordinatesTrusted: canvas.childCoordinatesTrusted,
        staleChildCoordinateOverrideActive: canvas.staleChildCoordinateOverrideActive,
        nonLocalStationAggregateGateOverrideActive: canvas.nonLocalStationAggregateGateOverrideActive,

        indexGateReady: news.indexGateReady,
        routeF8GateReady: news.routeF8GateReady,
        macroWestGateReady: news.macroWestGateReady,
        canvasLocalStationGateReady: news.canvasLocalStationGateReady,
        canvasParentGateReady: news.canvasParentGateReady,
        canvasParentReleaseGateReady: news.canvasParentReleaseGateReady,
        canvasParentEastDispatchGateReady: news.canvasParentEastDispatchGateReady,
        canvasEastGateReady: news.canvasEastGateReady,
        canvasWestGateReady: news.canvasWestGateReady,
        canvasSouthGateReady: news.canvasSouthGateReady,
        canvasGateReady: news.canvasGateReady,
        newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,

        ...fibonacci,

        canvasReleaseAuthorized: releasePacket.canvasReleaseAuthorized,
        canvasReleasePacketReady: releasePacket.canvasReleasePacketReady,
        canvasReleaseHeldReason: releasePacket.canvasReleaseHeldReason,
        canvasReleasePacketPublished: releasePacket.canvasReleaseAuthorized,

        f21EligibleForNorth: f21.f21EligibleForNorth,
        f21EligibilitySubmittedToNorth: state.f21EligibilitySubmittedToNorth,
        f21EligibilitySubmittedAt: state.f21EligibilitySubmittedAt || "",
        f21EligibilitySubmissionCount: state.f21EligibilitySubmissionCount || 0,
        f21LatchMode: f21.f21LatchMode,
        f21NorthLatchOnly: true,
        routeMaySubmitF21EligibilityOnly: true,
        northRepairRequired: false,
        northRepairReason: "NONE",

        stationBoard,
        canvasStationSummary: clonePlain(canvas),
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
    const message = error && error.message ? error.message : safeString(error, "route-conductor-v9-4-fallback");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      routeConductorAuthorityCardinal: CARDINALS.NORTH,
      activeCycleInputCardinal: CARDINALS.SOUTH,
      activeCycleHandoffTarget: CARDINALS.WEST,

      bridgeAlignmentActive: true,
      routeConductorFallbackUsed: true,
      routeConductorCompositionOk: false,
      routeConductorCompositionError: message,

      receiveCanvasStationSummaryAvailable: true,
      receiveCanvasLocalStationSummaryAvailable: true,
      receiveCanvasParentSummaryAvailable: true,
      reconcileCanvasAvailable: true,

      routeConductorControlBindingDisabled: true,
      indexOwnsControlBinding: true,
      routeConductorOwnsControlBinding: false,
      watchdogPassiveObservationActive: true,
      watchdogDeliveryLoopDisabled: true,
      canvasReleaseIntervalRedeliveryDisabled: true,
      refreshDeliveryBounded: true,
      htmlRebuildRequired: false,
      indexRebuildRequired: false,

      activeCycleNumber: 2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
      cycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,

      firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_BRIDGE_COMPOSITION",
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      postgameStatus: "ROUTE_CONDUCTOR_BRIDGE_FALLBACK_ACTIVE",

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
      "bridgeAlignmentActive",
      "diagnosticBridgeActive",
      "diagnosticDoorwayAndReceiptSeparated",
      "canvasLocalStationSummaryBridgeActive",
      "canvasSummaryAcceptedByContract",
      "canvasSummaryAcceptedByShape",
      "canvasSummaryShapeTrusted",
      "indexAuthorityObserved",
      "indexPairReady",
      "indexShellAccepted",
      "indexRuntimeReleaseAuthorized",
      "indexRuntimeReleaseComplete",
      "indexRuntimeReleaseHeld",
      "indexMountPresent",
      "indexControlsBound",
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
      "westDegradedForwardApproved",
      "westReleasePacketObserved",
      "canvasLocalStationObserved",
      "canvasLocalStationApiReady",
      "canvasLocalStationContractAccepted",
      "canvasBaselineV10_3Recognized",
      "canvasLocalStationSummaryObserved",
      "canvasLocalStationPushedSummaryProof",
      "canvasLocalStationReleasePacketDelivered",
      "canvasLocalStationReleaseAccepted",
      "canvasLocalStationNotificationConsumed",
      "currentCanvasParentObserved",
      "currentCanvasParentContractObserved",
      "currentCanvasParentIsLocalStation",
      "canvasParentBootMethodAvailable",
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
      "childCoordinatesTrusted",
      "staleChildCoordinateOverrideActive",
      "nonLocalStationAggregateGateOverrideActive",
      "indexGateReady",
      "routeF8GateReady",
      "macroWestGateReady",
      "canvasLocalStationGateReady",
      "canvasParentGateReady",
      "canvasParentReleaseGateReady",
      "canvasParentEastDispatchGateReady",
      "canvasEastGateReady",
      "canvasWestGateReady",
      "canvasSouthGateReady",
      "canvasGateReady",
      "newsGatePassedBeforeF21",
      "newsGateDegradedBeforeF21",
      "canvasReleaseAuthorized",
      "canvasReleasePacketReady",
      "canvasReleasePacketPublished",
      "f21EligibleForNorth",
      "f21EligibilitySubmittedToNorth",
      "fibonacciSynchronizationPassed",
      "fibonacciSynchronizationDegraded",
      "fibonacciSynchronizationHardFail",
      "v10_3BaselineRecognizedOnly",
      "v11OrLaterRequiredForLocalStationPass",
      "pushedSummaryApiReadinessCorrectionActive",
      "contractGateOverridesStaleChildCoordinates",
      "nonLocalStationChildCoordinateTrustBlocked",
      "contractDriftBridgeActive",
      "routeConductorControlBindingDisabled",
      "indexOwnsControlBinding",
      "routeConductorUsesPassiveControlObservation",
      "duplicateButtonHandlerRiskRemoved",
      "watchdogPassiveObservationActive",
      "watchdogDeliveryLoopDisabled",
      "canvasReleaseIntervalRedeliveryDisabled",
      "refreshDeliveryBounded",
      "htmlRebuildRequired",
      "indexRebuildRequired"
    ];

    for (const key of boolKeys) {
      if (key in p) state[key] = p[key] === true;
    }

    state.routeConductorOwnsControlBinding = false;
    state.routeConductorControlListenersAttached = false;
    state.routeConductorAuthorityCardinal = CARDINALS.NORTH;
    state.activeCycleInputCardinal = CARDINALS.SOUTH;
    state.activeCycleHandoffTarget = p.activeCycleHandoffTarget || (p.canvasReleaseAuthorized ? CARDINALS.CANVAS : CARDINALS.WEST);
    state.activeCycleNumber = safeNumber(p.activeCycleNumber || p.cycleNumber, 2);
    state.activeCycleRoute = p.activeCycleRoute || p.cycleRoute || CYCLE_ROUTES.CYCLE_2;
    state.activeCardinal = CARDINALS.NORTH;
    state.activeNewsGate = CARDINALS.NORTH;

    state.indexPairHoldReason = p.indexPairHoldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY";
    state.macroWestMethodUsed = p.macroWestMethodUsed || "";
    state.macroWestContract = p.macroWestContract || "";
    state.westDecision = p.westDecision || "UNKNOWN";
    state.westGapClass = p.westGapClass || "";
    state.westGapSeverity = p.westGapSeverity || "";
    state.westReleasePacketSource = p.westReleasePacketSource || "NONE";
    state.westFirstFailedCoordinate = p.westFirstFailedCoordinate || "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION";
    state.westRecommendedNextRenewalTarget = p.westRecommendedNextRenewalTarget || MACRO_WEST_FILE;

    state.canvasLocalStationContract = p.canvasLocalStationContract || "";
    state.canvasLocalStationSummaryMethod = p.canvasLocalStationSummaryMethod || "";
    state.canvasLocalStationReleaseDeliveryMethod = p.canvasLocalStationReleaseDeliveryMethod || "";
    state.canvasLocalStationNotificationMethod = p.canvasLocalStationNotificationMethod || state.canvasLocalStationNotificationMethod;
    state.currentCanvasParentContract = p.currentCanvasParentContract || "";
    state.f13StrictEvidenceGap = p.f13StrictEvidenceGap || "WAITING_CANVAS_LOCAL_STATION_SUMMARY";
    state.f13StrictEvidenceRepairTarget = p.f13StrictEvidenceRepairTarget || CANVAS_FILE;
    state.chronologicalGateCount = safeNumber(p.chronologicalGateCount, CHRONOLOGY.length);
    state.chronologicalGatesSatisfied = safeNumber(p.chronologicalGatesSatisfied, 0);
    state.chronologicalFirstFailedGate = p.chronologicalFirstFailedGate || STATION_IDS.INDEX_HOST;
    state.chronologicalFirstFailedCoordinate = p.chronologicalFirstFailedCoordinate || "WAITING_BOOT";
    state.fibonacciSynchronizationScore = safeNumber(p.fibonacciSynchronizationScore, 0);
    state.fibonacciSynchronizationExpected = safeNumber(p.fibonacciSynchronizationExpected, 100);
    state.fibonacciSynchronizationSatisfied = safeNumber(p.fibonacciSynchronizationSatisfied, 0);
    state.fibonacciSynchronizationHoldReason = p.fibonacciSynchronizationHoldReason || "";
    state.canvasReleaseHeldReason = p.canvasReleaseHeldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY_OR_MACRO_WEST";
    state.f21LatchMode = p.f21LatchMode || "WAITING_CANVAS_GATE";
    state.firstFailedCoordinate = p.firstFailedCoordinate || "WAITING_ROUTE_CONDUCTOR_BRIDGE";
    state.recommendedNextFile = p.recommendedNextFile || FILE;
    state.recommendedNextRenewalTarget = p.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.canvasNextAuditTarget = p.canvasNextAuditTarget || CANVAS_FILE;
    state.postgameStatus = p.postgameStatus || "ACTIVE";
    state.stationBoard = clonePlain(p.stationBoard || null);
    state.currentCanvasStationSummary = clonePlain(p.canvasStationSummary || null);
    state.currentCanvasReleasePacket = clonePlain(p.canvasReleasePacket || state.currentCanvasReleasePacket || null);
    state.updatedAt = nowIso();

    Object.assign(state, FINAL_FALSE);
    updateDataset();
    return p;
  }

  function refresh(input = {}) {
    const packet = composePrimaryPacket(input, { allowDelivery: true });
    updateStateFromPacket(packet);

    if (packet.f21EligibleForNorth && !state.f21EligibilitySubmittedToNorth) {
      submitF21EligibilityToNorth(packet);
    }

    scheduleRender();
    publishGlobals("refresh-controlled-route-conductor-bridge-flow", false);
    return getReceiptLight(false);
  }

  function observePassive(input = {}) {
    state.passiveObservationTicks += 1;

    const packet = composePrimaryPacket(input, { allowDelivery: false });
    updateStateFromPacket(packet);

    record("ROUTE_CONDUCTOR_PASSIVE_BRIDGE_OBSERVATION", {
      tick: state.passiveObservationTicks,
      allowDelivery: false,
      controlBindingDisabled: true,
      canvasReleaseIntervalRedeliveryDisabled: true,
      canvasSummaryAcceptedByContract: state.canvasSummaryAcceptedByContract,
      canvasSummaryAcceptedByShape: state.canvasSummaryAcceptedByShape,
      firstFailedCoordinate: packet.firstFailedCoordinate,
      recommendedNextFile: packet.recommendedNextFile
    });

    scheduleRender();
    publishGlobals("passive-bridge-observation-receipt-publication", false);
    return getReceiptLight(false);
  }

  function submitF21EligibilityToNorth(packet = {}) {
    if (!packet.f21EligibleForNorth) {
      return {
        accepted: false,
        action: "HELD",
        reason: "f21-not-eligible-for-north",
        firstFailedCoordinate: packet.firstFailedCoordinate,
        visualPassClaimed: false
      };
    }

    const north = firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_TABLE",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth"
    ]);

    const payload = {
      event: "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
      checkpointEvent: "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
      id: "F21_COMPLETION_LATCH",
      phase: "F21_COMPLETION_LATCH",
      checkpointId: "F21_COMPLETION_LATCH",
      activeFibonacci: "F21",
      activeCardinal: CARDINALS.NORTH,
      routeConductorAuthorityCardinal: CARDINALS.NORTH,
      source: "hearth-route-conductor-canvas-local-station-bridge-alignment",
      contract: CONTRACT,
      receipt: RECEIPT,
      f21EligibleForNorth: true,
      f21EligibilitySubmittedToNorth: true,
      completionLatchedByRouteConductor: false,
      f21ClaimedByRouteConductor: false,
      degradedEligibility: packet.f13CanvasEvidenceDegraded && !packet.f13CanvasEvidenceStrict,
      strictEligibility: packet.f13CanvasEvidenceStrict,
      visualPassClaimed: false,
      detail: {
        canvasLocalStationContract: packet.currentCanvasParentContract,
        canvasSummaryAcceptedByContract: packet.canvasSummaryAcceptedByContract,
        canvasSummaryAcceptedByShape: packet.canvasSummaryAcceptedByShape,
        canvasParentReleaseAccepted: packet.canvasParentReleaseAccepted,
        parentReleaseLawful: packet.parentReleaseLawful,
        eastDispatchAuthorized: packet.eastDispatchAuthorized,
        eastDispatchPacketPublished: packet.eastDispatchPacketPublished,
        f13CanvasEvidenceStrict: packet.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: packet.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: packet.f13CanvasEvidenceComplete,
        f13HardFail: packet.f13HardFail,
        newsGatePassedBeforeF21: packet.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: packet.newsGateDegradedBeforeF21,
        routeConductorControlBindingDisabled: true,
        watchdogDeliveryLoopDisabled: true
      }
    };

    try {
      let result = null;

      if (north && isFunction(north.submitF21Eligibility)) result = north.submitF21Eligibility(payload);
      else if (north && isFunction(north.acceptF21Eligibility)) result = north.acceptF21Eligibility(payload);
      else if (north && isFunction(north.receiveF21Eligibility)) result = north.receiveF21Eligibility(payload);

      state.f21EligibilitySubmittedToNorth = true;
      state.f21EligibilitySubmittedAt = nowIso();
      state.f21EligibilitySubmissionCount = safeNumber(state.f21EligibilitySubmissionCount, 0) + 1;

      record("F21_ELIGIBILITY_SUBMITTED_TO_NORTH", {
        submitted: true,
        resultObserved: Boolean(result),
        strictEligibility: packet.f13CanvasEvidenceStrict,
        degradedEligibility: packet.f13CanvasEvidenceDegraded && !packet.f13CanvasEvidenceStrict,
        completionLatchedByRouteConductor: false,
        f21ClaimedByRouteConductor: false
      });

      return {
        accepted: true,
        action: "SUBMITTED_TO_NORTH",
        result: clonePlain(result),
        f21EligibleForNorth: true,
        f21EligibilitySubmittedToNorth: true,
        completionLatched: false,
        f21ClaimedByRouteConductor: false,
        visualPassClaimed: false
      };
    } catch (error) {
      recordError("F21_ELIGIBILITY_SUBMIT_FAILED", error);
      return {
        accepted: false,
        action: "HELD",
        reason: "north-submit-failed",
        error: error && error.message ? error.message : String(error),
        visualPassClaimed: false
      };
    }
  }

  function setInspectMode(active) {
    if (!doc) return getReceipt();

    scanDom();

    doc.documentElement.dataset.hearthSouthPlanetInspect = String(Boolean(active));
    doc.documentElement.dataset.hearthEastInspectReservedActive = String(Boolean(active));

    if (refs.cockpit) refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";

    record(active ? "INSPECT_MODE_ACTIVE_BY_API" : "INSPECT_MODE_RELEASED_BY_API", {
      active: Boolean(active),
      routeConductorDirectButtonBinding: false,
      indexOwnsVisibleClickControl: true
    });

    refresh();
    return getReceipt();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
      } else if (doc && doc.body) {
        const area = doc.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        area.style.top = "-9999px";
        doc.body.appendChild(area);
        area.select();
        doc.execCommand("copy");
        area.remove();
      }
      return true;
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_API_FAILED", error);
      return false;
    }
  }

  function renderLanes() {
    const packet = state.currentPacket || {};

    const rows = [
      ["F1", "Index host", packet.carrierHostAdmissibilityReady ? "READY" : "WAITING"],
      ["F8", "North Star self-duty", packet.f8SelfDutySatisfied ? "COMPLETE" : "ACTIVE"],
      ["CTL", "Control ownership", packet.routeConductorControlBindingDisabled ? "INDEX OWNS" : "CHECK"],
      ["W", "Macro West boundary", packet.westCanvasReleaseApproved ? "RELEASE" : packet.macroWestAdmissibilityObserved ? "HELD" : "WAITING"],
      ["C", "Canvas local station", packet.canvasLocalStationContractAccepted ? "LOCAL" : packet.canvasSummaryAcceptedByShape ? "SHAPE" : packet.canvasLocalStationObserved ? "MISMATCH" : "WAITING"],
      ["API", "Summary API", packet.canvasLocalStationApiReady ? "READY" : "WAITING"],
      ["P", "Parent release", packet.canvasParentReleaseAccepted && packet.parentReleaseLawful && (packet.eastDispatchAuthorized || packet.eastDispatchPacketPublished) ? "DISPATCHED" : packet.canvasParentReleaseAccepted ? "ACCEPTED" : "PENDING"],
      ["F13", "Canvas aggregate", packet.f13CanvasEvidenceStrict ? "STRICT" : packet.f13CanvasEvidenceComplete ? "DEGRADED" : packet.f13CanvasReadinessObserved ? "ACTIVE" : "PENDING"],
      ["NEXT", "Switch target", packet.recommendedNextFile || state.recommendedNextFile || FILE]
    ];

    return rows.map(([fib, label, status]) => {
      const progress =
        status === "READY" ||
        status === "COMPLETE" ||
        status === "STRICT" ||
        status === "RELEASE" ||
        status === "LOCAL" ||
        status === "ACCEPTED" ||
        status === "DISPATCHED" ||
        status === "INDEX OWNS" ? 100 :
          status === "SHAPE" ? 88 :
            status === "DEGRADED" ? 82 :
              status === "ACTIVE" ? 56 :
                status === "HELD" ? 50 :
                  status === "MISMATCH" ? 36 :
                    status === "WAITING" ? 30 :
                      44;

      return [
        `<section class="hearth-ledger-lane" data-lane="${fib}" data-status="${String(status).replace(/"/g, "")}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title"><strong>${fib} · ${label}</strong><span>NORTH STAR</span></span>`,
        `<span class="hearth-ledger-lane-status">${status}</span>`,
        `</div>`,
        `<div class="hearth-ledger-lane-track"><span class="hearth-ledger-lane-fill" style="width:${progress}%"></span></div>`,
        `</section>`
      ].join("");
    }).join("");
  }

  function render() {
    if (!doc) return;

    scanDom();
    state.renderCount += 1;

    const packet = state.currentPacket || composePrimaryPacket({}, { allowDelivery: false });
    const visible = packet.visibleState || composeVisibleState(packet);

    if (refs.stage) refs.stage.textContent = `${visible.activeCycleRoute || packet.cycleRoute} · ${visible.activeFibonacci || packet.activeFibonacci}`;
    if (refs.heartbeat) refs.heartbeat.textContent = visible.visibleStatusText || packet.postgameStatus || "Route Conductor bridge active";
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
    setDataset("hearthRouteConductorLegacyNorthStarContract", LEGACY_NORTH_STAR_CONTRACT);
    setDataset("hearthRouteConductorLegacyNorthStarReceipt", LEGACY_NORTH_STAR_RECEIPT);
    setDataset("hearthRouteConductorBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthRouteConductorVersion", VERSION);
    setDataset("hearthRouteConductorV9_4Active", "true");
    setDataset("hearthRouteConductorV9_3Superseded", "true");

    setDataset("hearthRouteConductorBridgeAlignmentActive", "true");
    setDataset("hearthDiagnosticBridgeActive", "true");
    setDataset("hearthDiagnosticDoorwayAndReceiptSeparated", "true");
    setDataset("hearthCanvasLocalStationSummaryBridgeActive", "true");
    setDataset("hearthCanvasSummaryAcceptedByContract", String(state.canvasSummaryAcceptedByContract));
    setDataset("hearthCanvasSummaryAcceptedByShape", String(state.canvasSummaryAcceptedByShape));
    setDataset("hearthCanvasSummaryShapeTrusted", String(state.canvasSummaryShapeTrusted));
    setDataset("hearthRouteConductorContractDriftBridgeActive", "true");

    setDataset("hearthRouteConductorAuthorityCardinal", CARDINALS.NORTH);
    setDataset("hearthRouteConductorActiveCycleInputCardinal", CARDINALS.SOUTH);
    setDataset("hearthRouteConductorActiveCycleHandoffTarget", state.activeCycleHandoffTarget);

    setDataset("hearthRouteConductorNorthStarCompletionCycleGovernorActive", "true");
    setDataset("hearthRouteConductorCentralStationOverloadSuperseded", "true");
    setDataset("hearthRouteConductorCanvasLocalStationConsumptionActive", "true");
    setDataset("hearthRouteConductorDirectCanvasChildScanningRemoved", "true");
    setDataset("hearthRouteConductorCanvasSummarySourceRequired", "true");
    setDataset("hearthRouteConductorCanvasParentV103HardExpectationRetired", "true");

    setDataset("hearthRouteConductorReceiveCanvasStationSummaryAvailable", "true");
    setDataset("hearthRouteConductorReceiveCanvasLocalStationSummaryAvailable", "true");
    setDataset("hearthRouteConductorReceiveCanvasParentSummaryAvailable", "true");
    setDataset("hearthRouteConductorReconcileCanvasAvailable", "true");
    setDataset("hearthRouteConductorCanvasReleaseReentryGuardActive", "true");
    setDataset("hearthRouteConductorReadOnlyGetterDeliveryBlocked", "true");
    setDataset("hearthRouteConductorCanvasReleaseDeliveryInProgress", String(state.canvasReleaseDeliveryInProgress));
    setDataset("hearthRouteConductorCanvasSummaryReceiveInProgress", String(state.canvasSummaryReceiveInProgress));
    setDataset("hearthRouteConductorLastCanvasReleasePacketSignature", state.lastCanvasReleasePacketSignature);
    setDataset("hearthRouteConductorV10_3BaselineRecognizedOnly", String(state.v10_3BaselineRecognizedOnly));
    setDataset("hearthRouteConductorV11OrLaterRequiredForLocalStationPass", "true");
    setDataset("hearthRouteConductorPushedSummaryApiReadinessCorrectionActive", "true");
    setDataset("hearthRouteConductorContractGateOverridesStaleChildCoordinates", "true");
    setDataset("hearthRouteConductorNonLocalStationChildCoordinateTrustBlocked", "true");

    setDataset("hearthRouteConductorControlBindingDisabled", "true");
    setDataset("hearthIndexOwnsControlBinding", "true");
    setDataset("hearthRouteConductorOwnsControlBinding", "false");
    setDataset("hearthRouteConductorUsesPassiveControlObservation", "true");
    setDataset("hearthDuplicateButtonHandlerRiskRemoved", "true");
    setDataset("hearthRouteConductorControlListenersAttached", "false");
    setDataset("hearthControlSurfaceObserved", String(state.controlSurfaceObserved));
    setDataset("hearthControlSurfaceButtonsObserved", String(state.controlSurfaceButtonsObserved));
    setDataset("hearthWatchdogPassiveObservationActive", "true");
    setDataset("hearthWatchdogDeliveryLoopDisabled", "true");
    setDataset("hearthCanvasReleaseIntervalRedeliveryDisabled", "true");
    setDataset("hearthRefreshDeliveryBounded", "true");
    setDataset("hearthHtmlRebuildRequired", "false");
    setDataset("hearthIndexRebuildRequired", "false");

    setDataset("hearthSouthIndexPairReady", String(state.indexPairReady));
    setDataset("hearthSouthCarrierHostAdmissibilityReady", String(state.carrierHostAdmissibilityReady));
    setDataset("hearthSouthF8SelfDutySatisfied", String(state.routeF8GateReady));

    setDataset("hearthSouthMacroWestAuthorityObserved", String(state.macroWestAuthorityObserved));
    setDataset("hearthSouthMacroWestAdmissibilityObserved", String(state.macroWestAdmissibilityObserved));
    setDataset("hearthSouthMacroWestContract", state.macroWestContract);
    setDataset("hearthSouthWestDecision", state.westDecision);
    setDataset("hearthSouthWestHardBlock", String(state.westHardBlock));
    setDataset("hearthSouthWestForwardAllowed", String(state.westForwardAllowed));
    setDataset("hearthSouthWestCanvasReleaseApproved", String(state.westCanvasReleaseApproved));

    setDataset("hearthSouthCanvasLocalStationObserved", String(state.canvasLocalStationObserved));
    setDataset("hearthSouthCanvasLocalStationApiReady", String(state.canvasLocalStationApiReady));
    setDataset("hearthSouthCanvasLocalStationContract", state.canvasLocalStationContract);
    setDataset("hearthSouthCanvasLocalStationContractAccepted", String(state.canvasLocalStationContractAccepted));
    setDataset("hearthSouthCanvasBaselineV10_3Recognized", String(state.canvasBaselineV10_3Recognized));
    setDataset("hearthSouthCanvasLocalStationSummaryObserved", String(state.canvasLocalStationSummaryObserved));
    setDataset("hearthSouthCanvasLocalStationSummaryMethod", state.canvasLocalStationSummaryMethod);
    setDataset("hearthSouthCanvasLocalStationPushedSummaryProof", String(state.canvasLocalStationPushedSummaryProof));
    setDataset("hearthSouthCanvasLocalStationReleasePacketDelivered", String(state.canvasLocalStationReleasePacketDelivered));
    setDataset("hearthSouthCanvasLocalStationReleaseDeliveryMethod", state.canvasLocalStationReleaseDeliveryMethod);
    setDataset("hearthSouthCanvasLocalStationReleaseAccepted", String(state.canvasLocalStationReleaseAccepted));
    setDataset("hearthSouthCanvasLocalStationNotificationConsumed", String(state.canvasLocalStationNotificationConsumed));
    setDataset("hearthSouthCanvasLocalStationNotificationMethod", state.canvasLocalStationNotificationMethod);

    setDataset("hearthSouthCurrentCanvasParentObserved", String(state.currentCanvasParentObserved));
    setDataset("hearthSouthCurrentCanvasParentContractObserved", String(state.currentCanvasParentContractObserved));
    setDataset("hearthSouthCurrentCanvasParentContract", state.currentCanvasParentContract);
    setDataset("hearthSouthCurrentCanvasParentIsLocalStation", String(state.currentCanvasParentIsLocalStation));
    setDataset("hearthSouthCanvasParentBootMethodAvailable", String(state.canvasParentBootMethodAvailable));

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
    setDataset("hearthSouthF13CanvasEvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthSouthF13CanvasEvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthSouthF13CanvasEvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthSouthF13HardFail", String(state.f13HardFail));
    setDataset("hearthSouthF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthSouthF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);
    setDataset("hearthSouthChildCoordinatesTrusted", String(state.childCoordinatesTrusted));
    setDataset("hearthSouthStaleChildCoordinateOverrideActive", String(state.staleChildCoordinateOverrideActive));
    setDataset("hearthSouthNonLocalStationAggregateGateOverrideActive", String(state.nonLocalStationAggregateGateOverrideActive));

    setDataset("hearthSouthIndexGateReady", String(state.indexGateReady));
    setDataset("hearthSouthRouteF8GateReady", String(state.routeF8GateReady));
    setDataset("hearthSouthMacroWestGateReady", String(state.macroWestGateReady));
    setDataset("hearthSouthCanvasLocalStationGateReady", String(state.canvasLocalStationGateReady));
    setDataset("hearthSouthCanvasParentGateReady", String(state.canvasParentGateReady));
    setDataset("hearthSouthCanvasParentReleaseGateReady", String(state.canvasParentReleaseGateReady));
    setDataset("hearthSouthCanvasParentEastDispatchGateReady", String(state.canvasParentEastDispatchGateReady));
    setDataset("hearthSouthCanvasEastGateReady", String(state.canvasEastGateReady));
    setDataset("hearthSouthCanvasWestGateReady", String(state.canvasWestGateReady));
    setDataset("hearthSouthCanvasSouthGateReady", String(state.canvasSouthGateReady));
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

    setDataset("hearthSouthF21EligibleForNorth", "false");
    setDataset("hearthSouthF21EligibilitySubmittedToNorth", "false");
    setDataset("hearthSouthF21LatchMode", state.f21LatchMode);
    setDataset("hearthSouthCompletionLatched", "false");
    setDataset("hearthSouthReadyTextAllowed", "false");
    setDataset("hearthSouthF21ClaimedByRouteConductor", "false");

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
      reconcileCanvasAvailable: true,
      canvasReleaseReentryGuardActive: true,
      readOnlyGetterDeliveryBlocked: true,
      bridgeAlignmentActive: true,
      diagnosticBridgeActive: true,
      canvasSummaryAcceptedByContract: state.canvasSummaryAcceptedByContract,
      canvasSummaryAcceptedByShape: state.canvasSummaryAcceptedByShape,
      canvasSummaryShapeTrusted: state.canvasSummaryShapeTrusted,

      routeConductorControlBindingDisabled: true,
      indexOwnsControlBinding: true,
      routeConductorOwnsControlBinding: false,
      routeConductorUsesPassiveControlObservation: true,
      duplicateButtonHandlerRiskRemoved: true,
      routeConductorControlListenersAttached: false,
      watchdogPassiveObservationActive: true,
      watchdogDeliveryLoopDisabled: true,
      canvasReleaseIntervalRedeliveryDisabled: true,
      refreshDeliveryBounded: true,
      htmlRebuildRequired: false,
      indexRebuildRequired: false,

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

  function getReceipt() {
    const receipt = getReceiptLight(false);
    return {
      ...receipt,
      files: {
        routeConductor: FILE,
        index: INDEX_FILE,
        canvasLocalStation: CANVAS_FILE,
        macroWest: MACRO_WEST_FILE,
        north: NORTH_FILE
      },
      stationIds: clonePlain(STATION_IDS),
      acceptedCanvasLocalStationContracts: CANVAS_LOCAL_STATION_CONTRACTS.slice(),
      recognizedCanvasBaselineContracts: RECOGNIZED_CANVAS_BASELINE_CONTRACTS.slice(),
      stationBoard: clonePlain(state.stationBoard),
      canvasStationSummary: clonePlain(state.currentCanvasStationSummary),
      canvasReleasePacket: clonePlain(state.currentCanvasReleasePacket),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      currentReceiptText: composeReceiptText(receipt)
    };
  }

  function composeReceipt(input = {}) {
    const packet = input && input.contract === CONTRACT ? input : composePrimaryPacket(input, { allowDelivery: false });
    return {
      ...clonePlain(packet),
      authority: "hearth-route-conductor-canvas-local-station-bridge-alignment",
      status: "active",
      receiptComposed: true,
      currentReceipt: true,
      updatedAt: nowIso()
    };
  }

  function composeReceiptText(receipt = {}) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT",
      "",
      line("contract", r.contract || CONTRACT),
      line("receipt", r.receipt || RECEIPT),
      line("previousContract", r.previousContract || PREVIOUS_CONTRACT),
      line("previousReceipt", r.previousReceipt || PREVIOUS_RECEIPT),
      line("legacyNorthStarContract", r.legacyNorthStarContract || LEGACY_NORTH_STAR_CONTRACT),
      line("legacyNorthStarReceipt", r.legacyNorthStarReceipt || LEGACY_NORTH_STAR_RECEIPT),
      line("baselineContract", r.baselineContract || BASELINE_CONTRACT),
      line("version", r.version || VERSION),
      line("file", r.file || FILE),
      line("route", r.route || ROUTE),
      line("role", r.role || state.role),
      "",
      "BRIDGE_ALIGNMENT",
      line("bridgeAlignmentActive", true),
      line("diagnosticBridgeActive", true),
      line("diagnosticDoorwayAndReceiptSeparated", true),
      line("canvasLocalStationSummaryBridgeActive", true),
      line("canvasSummaryAcceptedByContract", state.canvasSummaryAcceptedByContract),
      line("canvasSummaryAcceptedByShape", state.canvasSummaryAcceptedByShape),
      line("canvasSummaryShapeTrusted", state.canvasSummaryShapeTrusted),
      line("contractDriftBridgeActive", true),
      "",
      "CONTROL_OWNERSHIP",
      line("routeConductorControlBindingDisabled", true),
      line("indexOwnsControlBinding", true),
      line("routeConductorOwnsControlBinding", false),
      line("routeConductorUsesPassiveControlObservation", true),
      line("duplicateButtonHandlerRiskRemoved", true),
      line("controlSurfacePassiveObservationActive", true),
      line("controlSurfaceObserved", state.controlSurfaceObserved),
      line("controlSurfaceButtonsObserved", state.controlSurfaceButtonsObserved),
      line("routeConductorControlListenersAttached", false),
      line("htmlRebuildRequired", false),
      line("indexRebuildRequired", false),
      "",
      "WATCHDOG",
      line("watchdogPassiveObservationActive", true),
      line("watchdogDeliveryLoopDisabled", true),
      line("canvasReleaseIntervalRedeliveryDisabled", true),
      line("refreshDeliveryBounded", true),
      line("passiveObservationTicks", state.passiveObservationTicks),
      line("passiveWatchdogMaxTicks", PASSIVE_WATCHDOG_MAX_TICKS),
      line("passiveWatchdogIntervalMs", PASSIVE_WATCHDOG_INTERVAL_MS),
      "",
      line("routeConductorAuthorityCardinal", r.routeConductorAuthorityCardinal || CARDINALS.NORTH),
      line("activeCycleInputCardinal", r.activeCycleInputCardinal || CARDINALS.SOUTH),
      line("activeCycleHandoffTarget", r.activeCycleHandoffTarget || ""),
      "",
      line("northStarCompletionCycleGovernorActive", r.northStarCompletionCycleGovernorActive === true),
      line("canvasLocalStationConsumptionActive", r.canvasLocalStationConsumptionActive === true),
      line("directCanvasChildScanningRemoved", r.directCanvasChildScanningRemoved === true),
      line("canvasSummarySourceRequired", r.canvasSummarySourceRequired === true),
      line("receiveCanvasStationSummaryAvailable", true),
      line("receiveCanvasLocalStationSummaryAvailable", true),
      line("receiveCanvasParentSummaryAvailable", true),
      line("reconcileCanvasAvailable", true),
      line("canvasReleaseReentryGuardActive", true),
      line("readOnlyGetterDeliveryBlocked", true),
      "",
      line("cycleNumber", r.cycleNumber || r.activeCycleNumber || ""),
      line("cycleRoute", r.cycleRoute || r.activeCycleRoute || ""),
      line("handoffTo", r.handoffTo || ""),
      "",
      line("indexPairReady", r.indexPairReady === true),
      line("carrierHostAdmissibilityReady", r.carrierHostAdmissibilityReady === true),
      line("f8SelfDutySatisfied", r.f8SelfDutySatisfied === true),
      "",
      line("macroWestAuthorityObserved", r.macroWestAuthorityObserved === true),
      line("macroWestAdmissibilityObserved", r.macroWestAdmissibilityObserved === true),
      line("macroWestMethodUsed", r.macroWestMethodUsed || ""),
      line("macroWestContract", r.macroWestContract || ""),
      line("westDecision", r.westDecision || ""),
      line("westGapClass", r.westGapClass || ""),
      line("westHardBlock", r.westHardBlock === true),
      line("westForwardAllowed", r.westForwardAllowed === true),
      line("westCanvasReleaseApproved", r.westCanvasReleaseApproved === true),
      "",
      line("canvasLocalStationObserved", r.canvasLocalStationObserved === true),
      line("canvasLocalStationApiReady", r.canvasLocalStationApiReady === true),
      line("canvasLocalStationContract", r.canvasLocalStationContract || ""),
      line("canvasLocalStationContractAccepted", r.canvasLocalStationContractAccepted === true),
      line("canvasLocalStationSummaryObserved", r.canvasLocalStationSummaryObserved === true),
      line("canvasLocalStationSummaryMethod", r.canvasLocalStationSummaryMethod || ""),
      line("canvasLocalStationPushedSummaryProof", r.canvasLocalStationPushedSummaryProof === true),
      line("currentCanvasParentObserved", r.currentCanvasParentObserved === true),
      line("currentCanvasParentContractObserved", r.currentCanvasParentContractObserved === true),
      line("currentCanvasParentContract", r.currentCanvasParentContract || ""),
      line("currentCanvasParentIsLocalStation", r.currentCanvasParentIsLocalStation === true),
      line("canvasParentBootMethodAvailable", r.canvasParentBootMethodAvailable === true),
      "",
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted === true),
      line("canvasParentReleaseObserved", r.canvasParentReleaseObserved === true),
      line("parentReleaseLawful", r.parentReleaseLawful === true),
      line("parentAcceptedRouteConductorRelease", r.parentAcceptedRouteConductorRelease === true),
      line("parentReleasePacketSentToEast", r.parentReleasePacketSentToEast === true),
      line("parentReleasePacketLawful", r.parentReleasePacketLawful === true),
      line("eastDispatchAuthorized", r.eastDispatchAuthorized === true),
      line("eastDispatchPacketPublished", r.eastDispatchPacketPublished === true),
      "",
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
      line("f13CanvasReadinessObserved", r.f13CanvasReadinessObserved === true),
      line("f13VisibleEvidenceAvailable", r.f13VisibleEvidenceAvailable === true),
      line("f13InspectEvidenceAvailable", r.f13InspectEvidenceAvailable === true),
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict === true),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded === true),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete === true),
      line("f13HardFail", r.f13HardFail === true),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap || ""),
      line("f13StrictEvidenceRepairTarget", r.f13StrictEvidenceRepairTarget || ""),
      "",
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
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized === true),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady === true),
      line("canvasReleasePacketPublished", r.canvasReleasePacketPublished === true),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason || ""),
      "",
      line("f21EligibleForNorth", false),
      line("f21EligibilitySubmittedToNorth", false),
      line("f21LatchMode", r.f21LatchMode || ""),
      line("completionLatched", false),
      line("readyTextAllowed", false),
      line("f21ClaimedByRouteConductor", false),
      "",
      line("firstFailedCoordinate", r.firstFailedCoordinate || ""),
      line("recommendedNextFile", r.recommendedNextFile || ""),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget || ""),
      line("canvasNextAuditTarget", r.canvasNextAuditTarget || ""),
      line("postgameStatus", r.postgameStatus || ""),
      "",
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
      "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("routeConductorAuthorityCardinal", r.routeConductorAuthorityCardinal),
      line("activeCycleInputCardinal", r.activeCycleInputCardinal),
      line("activeCycleHandoffTarget", r.activeCycleHandoffTarget),
      line("cycleNumber", r.cycleNumber),
      line("cycleRoute", r.cycleRoute),
      line("bridgeAlignmentActive", r.bridgeAlignmentActive),
      line("diagnosticBridgeActive", r.diagnosticBridgeActive),
      line("canvasSummaryAcceptedByContract", r.canvasSummaryAcceptedByContract),
      line("canvasSummaryAcceptedByShape", r.canvasSummaryAcceptedByShape),
      line("routeConductorControlBindingDisabled", r.routeConductorControlBindingDisabled),
      line("indexOwnsControlBinding", r.indexOwnsControlBinding),
      line("watchdogDeliveryLoopDisabled", r.watchdogDeliveryLoopDisabled),
      line("canvasReleaseIntervalRedeliveryDisabled", r.canvasReleaseIntervalRedeliveryDisabled),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("currentCanvasParentIsLocalStation", r.currentCanvasParentIsLocalStation),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("parentReleaseLawful", r.parentReleaseLawful),
      line("eastDispatchAuthorized", r.eastDispatchAuthorized),
      line("eastDispatchPacketPublished", r.eastDispatchPacketPublished),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      line("chronologicalFirstFailedCoordinate", r.chronologicalFirstFailedCoordinate),
      line("fibonacciSynchronizationScore", r.fibonacciSynchronizationScore),
      line("f21EligibleForNorth", false),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function globalsNeedRepublish() {
    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR === api &&
      root.HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR === api
    );

    const nestedApiPresent = Boolean(
      root.HEARTH &&
      root.HEARTH.routeConductor === api &&
      root.HEARTH.routeConductorNorthStarCompletionCycleGovernor === api
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT
    );

    return !(apiPresent && nestedApiPresent && receiptPresent);
  }

  function publishGlobals(reason = "publish-globals", force = false) {
    if (!force && !globalsNeedRepublish()) {
      updateDataset();
      return false;
    }

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH_ROUTE_CONDUCTOR = api;
    root.HearthRouteConductor = api;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR = api;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE = api;
    root.HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR = api;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR = api;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT = api;
    root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT = api;

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.routeConductorPrimaryGate = api;
    root.HEARTH.routeConductorNorthStarCompletionCycleGovernor = api;
    root.HEARTH.routeConductorControlOwnershipPassiveWatchdogRepair = api;
    root.HEARTH.routeConductorCanvasLocalStationBridgeAlignment = api;
    root.HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGate = api;
    root.DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor = api;
    root.DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepair = api;
    root.DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment = api;
    root.DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment = api;

    const receiptLight = getReceiptLight(false);

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4 = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT_RECEIPT = receiptLight;

    root.HEARTH.routeConductorReceipt = receiptLight;
    root.HEARTH.southRouteConductorReceipt = receiptLight;
    root.HEARTH.routeConductorPrimaryGateReceipt = receiptLight;
    root.HEARTH.routeConductorNorthStarCompletionCycleGovernorReceipt = receiptLight;
    root.HEARTH.routeConductorControlOwnershipPassiveWatchdogRepairReceipt = receiptLight;
    root.HEARTH.routeConductorCanvasLocalStationBridgeAlignmentReceipt = receiptLight;

    root.DEXTER_LAB.hearthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGateReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernorReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepairReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignmentReceipt = receiptLight;

    if (state.currentCanvasReleasePacket) {
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH_CANVAS_RELEASE_PACKET = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH.routeConductorCanvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
      root.HEARTH.canvasReleasePacket = clonePlain(state.currentCanvasReleasePacket);
    }

    record(reason, {
      apiPresent: true,
      receiptPresent: true,
      bridgeAlignmentActive: true,
      northStarCompletionCycleGovernorActive: true,
      directCanvasChildScanningRemoved: true,
      receiveCanvasStationSummaryAvailable: true,
      canvasReleaseReentryGuardActive: true,
      pushedSummaryApiReadinessCorrectionActive: true,
      contractGateOverridesStaleChildCoordinates: true,
      routeConductorControlBindingDisabled: true,
      watchdogDeliveryLoopDisabled: true,
      force: force === true
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
        publishGlobals("watchdog-passive-conditional-v9-4-bridge-republish", false);
      }

      if (
        (state.f13CanvasEvidenceStrict && state.f21EligibilitySubmittedToNorth) ||
        state.watchdogTicks >= PASSIVE_WATCHDOG_MAX_TICKS
      ) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;

        record("PASSIVE_WATCHDOG_STOPPED", {
          watchdogTicks: state.watchdogTicks,
          maxTicks: PASSIVE_WATCHDOG_MAX_TICKS,
          deliveryLoopDisabled: true,
          intervalRedeliveryDisabled: true
        });
      }
    }, PASSIVE_WATCHDOG_INTERVAL_MS);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_V9_4";

      publishEarlyMarker();
      publishGlobals("boot-early-v9-4-bridge-api-receipt-publication", true);

      refresh();

      state.booting = false;
      state.booted = true;
      state.routeConductorRuntimeActive = true;

      publishGlobals("boot-complete-v9-4-bridge-api-receipt-publication", true);
      observePassive();
      render();

      startWatchdog();

      record("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_V9_4_BOOTED", {
        route: ROUTE,
        contract: CONTRACT,
        markerPresent: state.routeConductorMarkerPresent,
        apiPresent: state.routeConductorApiPresent,
        receiptPresent: state.routeConductorReceiptPresent,
        bridgeAlignmentActive: true,
        canvasSummaryAcceptedByContract: state.canvasSummaryAcceptedByContract,
        canvasSummaryAcceptedByShape: state.canvasSummaryAcceptedByShape,
        directCanvasChildScanningRemoved: true,
        receiveCanvasStationSummaryAvailable: true,
        canvasReleaseReentryGuardActive: true,
        pushedSummaryApiReadinessCorrectionActive: true,
        contractGateOverridesStaleChildCoordinates: true,
        routeConductorControlBindingDisabled: true,
        indexOwnsControlBinding: true,
        duplicateButtonHandlerRiskRemoved: true,
        watchdogPassiveObservationActive: true,
        watchdogDeliveryLoopDisabled: true,
        canvasReleaseIntervalRedeliveryDisabled: true,
        canvasLocalStationContract: state.canvasLocalStationContract,
        canvasLocalStationApiReady: state.canvasLocalStationApiReady,
        currentCanvasParentIsLocalStation: state.currentCanvasParentIsLocalStation,
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

    record("HEARTH_ROUTE_CONDUCTOR_V9_4_BRIDGE_DISPOSED", { reason });
    render();

    return getReceipt();
  }

  function getRouteCycleReceipt(input = {}) {
    const packet = composePrimaryPacket(input, { allowDelivery: false });

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_CYCLE_RECEIPT_v9_4",
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute,
      routeConductorAuthorityCardinal: packet.routeConductorAuthorityCardinal,
      activeCycleInputCardinal: packet.activeCycleInputCardinal,
      activeCycleHandoffTarget: packet.activeCycleHandoffTarget,
      handoffTo: packet.handoffTo,
      bridgeAlignmentActive: true,
      canvasSummaryAcceptedByContract: packet.canvasSummaryAcceptedByContract,
      canvasSummaryAcceptedByShape: packet.canvasSummaryAcceptedByShape,
      northStarCompletionCycleGovernorActive: packet.northStarCompletionCycleGovernorActive,
      directCanvasChildScanningRemoved: packet.directCanvasChildScanningRemoved,
      receiveCanvasStationSummaryAvailable: true,
      canvasReleaseReentryGuardActive: true,
      readOnlyGetterDeliveryBlocked: true,
      pushedSummaryApiReadinessCorrectionActive: true,
      contractGateOverridesStaleChildCoordinates: true,
      routeConductorControlBindingDisabled: true,
      indexOwnsControlBinding: true,
      watchdogDeliveryLoopDisabled: true,
      canvasReleaseIntervalRedeliveryDisabled: true,
      canvasLocalStationContract: packet.canvasLocalStationContract,
      canvasLocalStationApiReady: packet.canvasLocalStationApiReady,
      currentCanvasParentContract: packet.currentCanvasParentContract,
      currentCanvasParentIsLocalStation: packet.currentCanvasParentIsLocalStation,
      chronologicalFirstFailedGate: packet.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: packet.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationPassed: packet.fibonacciSynchronizationPassed,
      recommendedNextFile: packet.recommendedNextFile,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,
      visualPassClaimed: false,
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
    legacyNorthStarContract: LEGACY_NORTH_STAR_CONTRACT,
    legacyNorthStarReceipt: LEGACY_NORTH_STAR_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: state.role,

    CYCLE_ROUTES,
    CARDINALS,
    STATION_IDS,
    CHRONOLOGY,
    CANVAS_LOCAL_STATION_CONTRACTS,
    RECOGNIZED_CANVAS_BASELINE_CONTRACTS,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    refresh,
    observePassive,
    render,
    setInspectMode,
    copyDiagnostic,

    receiveCanvasStationSummary,
    receiveCanvasLocalStationSummary,
    receiveCanvasParentSummary,
    reconcileCanvas,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,
    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket,

    readIndexAuthority,
    resolveF8SelfDuty,
    readMacroWestAuthority,
    classifyMacroWestAdmissibility,
    normalizeMacroWestResult,
    composeMacroWestCandidate,

    readCanvasLocalStationApi,
    readCanvasLocalStationSummary,
    normalizeCanvasStationSummary,
    isCanvasLocalStationShape,
    canvasContractAccepted,
    applyCanvasSummaryToState,
    resolveCanvasAggregateGap,
    composeCanvasReleasePacket,
    deliverReleaseToCanvasLocalStation,

    resolveNewsState,
    resolveF21Eligibility,
    composeStationBoard,
    computeFibonacci,
    selectNextFile,
    composePrimaryPacket,
    composeReceipt,

    observeControlSurface,
    scanDom,
    globalsNeedRepublish,
    publishGlobals,
    updateDataset,

    supportsNorthStarCompletionCycleGovernor: true,
    supportsCanvasLocalStationSummaryConsumption: true,
    supportsCanvasLocalStationSummaryShapeBridge: true,
    supportsContractDriftBridge: true,
    supportsDiagnosticBridge: true,
    supportsDirectCanvasChildScanRemoval: true,
    supportsNewsChronologicalOrder: true,
    supportsFibonacciChronologyFirst: true,
    supportsMacroWestBoundary: true,
    supportsCanvasReleaseBoundary: true,
    supportsCanvasSummaryReceivers: true,
    supportsReleaseDeliveryReentryGuard: true,
    supportsReadOnlyReleasePacketGetters: true,
    supportsPushedSummaryApiReadinessCorrection: true,
    supportsContractGateStaleChildCoordinateOverride: true,
    supportsF21EligibilitySubmissionOnly: true,
    supportsAntiFalseCompletionLaw: true,
    supportsPassiveControlObservation: true,
    supportsRouteConductorControlBindingDisabled: true,
    supportsPassiveWatchdogObservation: true,
    supportsCanvasReleaseIntervalRedeliveryDisabled: true,

    routeConductorAuthorityCardinal: CARDINALS.NORTH,
    activeCycleInputCardinal: CARDINALS.SOUTH,
    northStarCompletionCycleGovernorActive: true,
    bridgeAlignmentActive: true,
    diagnosticBridgeActive: true,
    canvasLocalStationSummaryBridgeActive: true,
    centralStationOverloadSuperseded: true,
    canvasLocalStationConsumptionActive: true,
    directCanvasChildScanningRemoved: true,
    canvasSummarySourceRequired: true,
    canvasParentV10_3HardExpectationRetired: true,

    receiveCanvasStationSummaryAvailable: true,
    receiveCanvasLocalStationSummaryAvailable: true,
    receiveCanvasParentSummaryAvailable: true,
    reconcileCanvasAvailable: true,
    canvasReleaseReentryGuardActive: true,
    readOnlyGetterDeliveryBlocked: true,
    v11OrLaterRequiredForLocalStationPass: true,
    pushedSummaryApiReadinessCorrectionActive: true,
    contractGateOverridesStaleChildCoordinates: true,
    nonLocalStationChildCoordinateTrustBlocked: true,

    routeConductorControlBindingDisabled: true,
    indexOwnsControlBinding: true,
    routeConductorOwnsControlBinding: false,
    routeConductorUsesPassiveControlObservation: true,
    duplicateButtonHandlerRiskRemoved: true,
    watchdogPassiveObservationActive: true,
    watchdogDeliveryLoopDisabled: true,
    canvasReleaseIntervalRedeliveryDisabled: true,
    refreshDeliveryBounded: true,
    htmlRebuildRequired: false,
    indexRebuildRequired: false,

    ownsRouteConductorRuntime: true,
    ownsNorthStarCompletionCycleGovernor: true,
    ownsNewsChronology: true,
    ownsFibonacciSynchronization: true,
    ownsMacroWestBoundaryConsumption: true,
    ownsCanvasReleasePacketComposition: true,
    ownsCanvasLocalStationSummaryConsumption: true,
    ownsCanvasLocalStationSummaryBridge: true,
    ownsF21EligibilitySubmission: true,

    ownsControlBinding: false,
    ownsHtmlButtonHandlers: false,
    ownsCanvasLocalStation: false,
    ownsCanvasChildDistribution: false,
    ownsCanvasEastAtlasTruth: false,
    ownsCanvasWestInspectionTruth: false,
    ownsCanvasSouthVisibleProofTruth: false,
    ownsCanvasDrawing: false,
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
  publishGlobals("immediate-v9-4-bridge-api-receipt-publication", true);

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
