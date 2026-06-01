// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_TNT_v7
// Full-file replacement.
// Hearth route conductor / central-station switchboard / NEWS chronology / Fibonacci synchronization parent coordinator.
// Purpose:
// - Renew the route conductor into the parent switchboard that coordinates Index Host, Runtime Table, Macro West,
//   Canvas Parent, Canvas East, Canvas West, Canvas South, Canvas F13, and North F21 eligibility.
// - Anchor the route conductor to the upstream Index Host + Macro West release path and the downstream Canvas solution.
// - Stop child-level recommendations from outranking parent release chronology.
// - Correct the unlawful v6 state where canvasReleaseAuthorized=true but canvasParentReleaseAccepted=false still routed next to Canvas East.
// - Treat Canvas Parent release acceptance as the required gate before Canvas East can become the next file.
// - Replace score-only Fibonacci synchronization with chronology-first synchronization.
// - Block stale Canvas v2 false positives when current Canvas Parent v7/v6 is observed.
// - Preserve two-cycle law:
//   Cycle 1: NORTH -> EAST -> WEST -> SOUTH -> NORTH.
//   Cycle 2: NORTH -> EAST -> SOUTH -> WEST -> CANVAS.
// - Preserve Macro West as admissibility judge.
// - Preserve Canvas as F13 evidence authority only.
// - Preserve North as the only F21 latch authority.
// - Never claim ready text, F21 latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_TNT_v7";
  const RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT_v7";
  const PREVIOUS_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_TNT_v6";
  const BASELINE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_TNT_v6";
  const VERSION = "2026-06-01.hearth-route-conductor-central-station-switchboard-news-fibonacci-parent-coordination-v7";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";

  const FILE_GATES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
    macroWest: "/assets/lab/runtime-table.west.js",
    west: "/assets/lab/runtime-table.west.js",
    south: "/assets/lab/runtime-table.south.js",
    routeConductor: "/showroom/globe/hearth/hearth.js",
    hearthIndex: "/showroom/globe/hearth/index.js",
    canvas: "/assets/hearth/hearth.canvas.js",
    canvasEast: "/assets/hearth/hearth.canvas.east.js",
    canvasWest: "/assets/hearth/hearth.canvas.west.js",
    canvasSouth: "/assets/hearth/hearth.canvas.south.js"
  });

  const CYCLE_ROUTES = Object.freeze({
    CYCLE_1: "NORTH_EAST_WEST_SOUTH_NORTH",
    CYCLE_2: "NORTH_EAST_SOUTH_WEST_CANVAS"
  });

  const CARDINALS = Object.freeze({
    NORTH: "NORTH",
    EAST: "EAST",
    SOUTH: "SOUTH",
    WEST: "WEST",
    CANVAS: "CANVAS",
    UNKNOWN: "UNKNOWN"
  });

  const WEST_DECISION = Object.freeze({
    RELEASE_TO_CANVAS: "RELEASE_TO_CANVAS",
    FULL_PASS: "FULL_PASS",
    DEGRADED_FORWARD: "DEGRADED_FORWARD",
    ADMIT_TO_SOUTH: "ADMIT_TO_SOUTH",
    RETURN_TO_NORTH: "RETURN_TO_NORTH",
    RETURN_TO_NORTH_FOR_F21: "RETURN_TO_NORTH_FOR_F21",
    HOLD_ACTIVE: "HOLD_ACTIVE",
    HOLD_FOR_CYCLE: "HOLD_FOR_CYCLE",
    HARD_BLOCK: "HARD_BLOCK",
    UNKNOWN: "UNKNOWN"
  });

  const STATION_IDS = Object.freeze({
    INDEX_HOST: "INDEX_HOST",
    ROUTE_F8: "ROUTE_F8_SELF_DUTY",
    MACRO_WEST: "MACRO_WEST_ADMISSIBILITY",
    CANVAS_PARENT_CURRENT: "CANVAS_PARENT_CURRENT_CONTRACT",
    CANVAS_PARENT_RELEASE: "CANVAS_PARENT_RELEASE_ACCEPTANCE",
    CANVAS_EAST: "CANVAS_EAST_ATLAS_EVIDENCE",
    CANVAS_WEST: "CANVAS_WEST_INSPECTION_EVIDENCE",
    CANVAS_SOUTH: "CANVAS_SOUTH_VISIBLE_PROOF",
    CANVAS_F13: "CANVAS_F13_GATE",
    NORTH_F21: "NORTH_F21_ELIGIBILITY_BOUNDARY"
  });

  const INDEX_CONTRACTS = Object.freeze([
    "HEARTH_INDEX_JS_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_ALIGNMENT_TNT_v5",
    "HEARTH_INDEX_JS_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST_TNT_v4",
    "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE_TNT_v2",
    "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR_NON_BLOCKING_BOOT_TNT_v1"
  ]);

  const CURRENT_CANVAS_PARENT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_TNT_v7",
    "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_TNT_v6",
    "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST_TNT_v4",
    "HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE_TNT_v3",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_TNT_v1",
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1"
  ]);

  const LEGACY_CANVAS_V2_CONTRACT = "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2";
  const LEGACY_CANVAS_V2_RECEIPT = "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_RECEIPT_v2";

  const STRICT_PROOF_MINIMUMS = Object.freeze({
    sampleCount: 36,
    contentCount: 18,
    varianceScore: 18,
    classCount: 2,
    landWaterBothRequired: true
  });

  const MAX_LOG = 220;
  const WATCHDOG_MS = 900;
  const WATCHDOG_LIMIT = 120;

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "hearth-route-conductor-central-station-switchboard-news-fibonacci-parent-coordination",

    centralStationSwitchboardActive: true,
    stationBoardComposed: false,
    switchPriorityApplied: false,
    rawSignalsNormalized: false,

    twoFileIntegrationActive: true,
    carrierHostAdmissibilityConsumptionActive: true,
    routeConductorPrimaryGateActive: true,
    strictF13DownstreamAlignmentActive: true,
    canvasParentChildReconciliationActive: true,
    cycleAwareRoutingActive: true,
    macroWestAdmissibilityConsumptionActive: true,
    canvasReleaseFirewallActive: true,

    newsAlignmentProtocolActive: true,
    newsChronologicalOrderLocked: true,
    fibonacciSynchronizationChronologyFirst: true,
    canvasParentReleaseAcceptanceGateActive: true,
    downstreamRecommendationBlockedUntilParentAccepted: true,
    parentReleaseGatePrecedesChildDispatch: true,
    staleCanvasV2FalsePositiveBlocked: true,

    activeCycleNumber: 1,
    activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
    receivedFrom: CARDINALS.UNKNOWN,
    returnTo: CARDINALS.NORTH,
    handoffTo: "",
    activeCardinal: CARDINALS.SOUTH,
    activeFileGate: FILE,
    activeNewsGate: CARDINALS.SOUTH,
    activeFibonacci: "F8",
    activeFibonacciRank: 8,
    activeStageId: "F8_SOUTH_SELF_DUTY",
    activeGearId: "F8_SOUTH_SELF_DUTY",

    indexAuthorityObserved: false,
    indexPairObserved: false,
    indexPairReady: false,
    indexShellAccepted: false,
    indexRuntimeReleaseAuthorized: false,
    indexRuntimeReleaseComplete: false,
    indexMountPresent: false,
    indexControlsBound: false,
    indexPairHoldReason: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",

    carrierHostAdmissibilityObserved: false,
    carrierHostAdmissibilityReady: false,
    carrierHostAdmissibilityPacketReady: false,
    carrierHostAdmissibilityPacketPublished: false,
    carrierHostAdmissibilityHoldReason: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
    indexMacroWestCandidateReady: false,
    indexHandoffToRouteConductor: false,
    routeConductorHandoffPacketReady: false,

    routeConductorMarkerPresent: false,
    routeConductorApiPresent: false,
    routeConductorReceiptPresent: false,
    routeConductorRuntimeActive: false,
    routeConductorHydrated: false,
    f8SelfDutySatisfied: false,

    northAuthorityObserved: false,
    eastAuthorityObserved: false,
    macroWestAuthorityObserved: false,
    westAuthorityObserved: false,
    southAuthorityObserved: false,
    hearthIndexObserved: false,

    macroWestAdmissibilityObserved: false,
    macroWestMethodUsed: "",
    westDecision: WEST_DECISION.UNKNOWN,
    westGapClass: "",
    westGapSeverity: "",
    westHardBlock: false,
    westForwardAllowed: false,
    westCanvasReleaseApproved: false,
    westDegradedForwardApproved: false,
    westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION",
    westRecommendedNextRenewalTarget: FILE_GATES.macroWest,

    canvasAuthorityObserved: false,
    currentCanvasParentObserved: false,
    currentCanvasParentContractObserved: false,
    currentCanvasParentContract: "",
    canvasParentV2Observed: false,
    canvasParentV2Superseded: false,
    canvasParentBootMethodAvailable: false,
    canvasParentCarrierSafe: false,
    canvasParentCarrierSafeObservedOnly: false,
    canvasParentReleaseAccepted: false,
    canvasParentReleaseObserved: false,
    parentReleaseLawful: false,
    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,

    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseRequiresWestAudit: true,
    canvasReleaseRequiresMacroWest: true,
    canvasReleaseHeldReason: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY_OR_MACRO_WEST",

    canvasBootAttempted: false,
    canvasBootInFlight: false,
    canvasBootResultObserved: false,

    canvasEastApiReady: false,
    canvasWestApiReady: false,
    canvasSouthApiReady: false,
    allCanvasChildrenApiReady: false,
    canvasEastEvidenceReady: false,
    canvasWestInspectionReady: false,
    canvasSouthVisibleProofReady: false,
    allCanvasChildrenEvidenceReady: false,
    allCanvasChildrenReady: false,

    f13ProofBodyAvailable: false,
    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_CANVAS_F13_EVIDENCE",
    f13StrictEvidenceRepairTarget: FILE_GATES.canvas,

    southStrictProofObserved: false,
    southSoftProofObserved: false,
    southHardFailObserved: false,
    southProofStale: false,
    parentStrictReadMismatch: false,
    degradedF13IsFunctional: false,
    functionalPageObserved: false,
    strictVisualProofPending: false,

    indexGateReady: false,
    routeF8GateReady: false,
    macroWestGateReady: false,
    canvasParentGateReady: false,
    canvasParentReleaseGateReady: false,
    canvasEastGateReady: false,
    canvasWestGateReady: false,
    canvasSouthGateReady: false,
    canvasGateReady: false,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,

    chronologicalGateCount: 10,
    chronologicalGatesSatisfied: 0,
    chronologicalFirstFailedGate: "INDEX_HOST",
    chronologicalFirstFailedCoordinate: "WAITING_BOOT",
    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationExpected: 100,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,
    fibonacciSynchronizationHardFail: false,
    fibonacciSynchronizationHoldReason: "WAITING_BOOT",

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21EligibilitySubmittedAt: "",
    f21EligibilitySubmissionCount: 0,
    f21LatchMode: "WAITING_CANVAS_GATE",
    completionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    f21ClaimedByRouteConductor: false,
    northRepairRequired: false,
    northRepairReason: "NONE",

    stationBoard: null,
    currentPacket: null,
    currentReceipt: null,
    currentReceiptText: "",

    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    canvasNextAuditTarget: FILE_GATES.canvas,
    postgameStatus: "LOADED",

    refsBound: false,
    booted: false,
    booting: false,
    watchdogTicks: 0,
    renderCount: 0,
    latestEvent: "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_LOADED",
    startedAt: "",
    updatedAt: "",

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const refs = {
    mount: null,
    cockpit: null,
    stage: null,
    heartbeat: null,
    latest: null,
    fill: null,
    percent: null,
    lanes: null,
    receiptBox: null,
    receiptText: null,
    copyButton: null,
    toggleButton: null,
    inspectButton: null,
    showTab: null,
    status: null
  };

  let bootPromise = null;
  let watchdogTimer = 0;
  let renderTimer = 0;
  let autoBootTimer = 0;

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
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
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

  function trimLog(array) {
    if (Array.isArray(array) && array.length > MAX_LOG) {
      array.splice(0, array.length - MAX_LOG);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimLog(state.localEvents);
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
    trimLog(state.errors);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function objectValue(source, path, fallback = undefined) {
    if (!source || (!isObject(source) && !Array.isArray(source))) return fallback;

    const parts = String(path || "").split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return fallback;
      cursor = cursor[part];
    }

    return cursor;
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

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = readPath(name);
      if (found) return found;
    }
    return null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = ["getReceipt", "getReceiptLight", "getStatus", "getCarrierReceipt"];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const receipt = authority[method]();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

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

  function normalizeCardinal(value, fallback = CARDINALS.UNKNOWN) {
    const text = safeString(value, fallback).toUpperCase();
    if (text.includes("NORTH")) return CARDINALS.NORTH;
    if (text.includes("EAST")) return CARDINALS.EAST;
    if (text.includes("SOUTH")) return CARDINALS.SOUTH;
    if (text.includes("WEST")) return CARDINALS.WEST;
    if (text.includes("CANVAS")) return CARDINALS.CANVAS;
    return fallback;
  }

  function normalizeCycleRoute(value) {
    const text = safeString(value, "").toUpperCase();

    if (
      text.includes(CYCLE_ROUTES.CYCLE_1) ||
      text.includes("NORTH->EAST->WEST->SOUTH->NORTH") ||
      text.includes("NORTH→EAST→WEST→SOUTH→NORTH")
    ) {
      return CYCLE_ROUTES.CYCLE_1;
    }

    if (
      text.includes(CYCLE_ROUTES.CYCLE_2) ||
      text.includes("NORTH->EAST->SOUTH->WEST->CANVAS") ||
      text.includes("NORTH→EAST→SOUTH→WEST→CANVAS")
    ) {
      return CYCLE_ROUTES.CYCLE_2;
    }

    return "";
  }

  function childHasMethods(child, methods) {
    if (!child || !isObject(child)) return false;
    return methods.every((method) => isFunction(child[method]));
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
        diagnosticCanLeavePlanetFrame: false,
        diagnosticDockRestorable: false,
        showTabVisible: false,
        inspectFallbackReady: false,
        inspectStrictReady: false
      };
    }

    refs.mount =
      doc.getElementById("hearthCanvasMount") ||
      doc.querySelector("[data-hearth-canvas-mount='true']") ||
      doc.querySelector("[data-hearth-canvas-mount]");

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
    refs.copyButton = doc.querySelector("[data-hearth-copy-diagnostic]");
    refs.toggleButton = doc.querySelector("[data-hearth-toggle-receipt]");
    refs.inspectButton = doc.querySelector("[data-hearth-inspect-planet]");
    refs.showTab =
      doc.querySelector("[data-hearth-south-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-east-show-diagnostic-tab]") ||
      doc.querySelector("[data-hearth-index-show-diagnostic-tab]");
    refs.status = doc.getElementById("hearth-route-status") || doc.querySelector("[data-hearth-route-status]");

    const canvas = refs.mount
      ? refs.mount.querySelector("canvas")
      : doc.querySelector("canvas[data-hearth-canvas='true'],canvas[data-hearth-canvas-texture='true'],canvas[data-hearth-planet-canvas='true']");

    const rect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    const nonZero = Boolean(
      canvas &&
      (
        (safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0) ||
        (rect && safeNumber(rect.width, 0) > 0 && safeNumber(rect.height, 0) > 0)
      )
    );

    const copyDiagnosticReady = Boolean(refs.copyButton);
    const receiptToggleReady = Boolean(refs.toggleButton || refs.receiptText || refs.receiptBox);
    const inspectPlanetControlAvailable = Boolean(refs.inspectButton);
    const inspectModeAvailable = Boolean(refs.inspectButton && refs.cockpit);
    const diagnosticCanLeavePlanetFrame = Boolean(refs.inspectButton && refs.cockpit && refs.showTab);
    const diagnosticDockRestorable = Boolean(refs.cockpit);
    const showTabVisible = Boolean(refs.showTab && refs.showTab.hidden === false);
    const inspectFallbackReady = Boolean(copyDiagnosticReady || receiptToggleReady || diagnosticDockRestorable);
    const inspectStrictReady = Boolean(inspectModeAvailable && diagnosticCanLeavePlanetFrame && copyDiagnosticReady && receiptToggleReady);

    bindControls();

    return {
      mountPresent: Boolean(refs.mount),
      cockpitPresent: Boolean(refs.cockpit),
      planetCanvasPresent: Boolean(canvas),
      planetCanvasNonZeroSize: nonZero,
      copyDiagnosticReady,
      receiptToggleReady,
      inspectPlanetControlAvailable,
      inspectModeAvailable,
      diagnosticCanLeavePlanetFrame,
      diagnosticDockRestorable,
      showTabVisible,
      inspectFallbackReady,
      inspectStrictReady
    };
  }

  function publishEarlyMarker() {
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FILE__ = FILE;
    root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ = CONTRACT;
    root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__ = RECEIPT;
    root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ = false;
    root.__HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_NEWS_CHRONOLOGY_LOCKED__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_FIBONACCI_CHRONOLOGY_FIRST__ = true;
    root.__HEARTH_ROUTE_CONDUCTOR_PARENT_RELEASE_GATE_PRECEDES_CHILD__ = true;

    state.routeConductorMarkerPresent = true;
    updateDataset();
  }

  function readNorthAuthority() {
    const api = firstGlobal([
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_UNIVERSAL_PLANET_RUNTIME_TABLE",
      "RUNTIME_TABLE",
      "DexterRuntimeTable",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_TABLE",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northMacroDistributor"
    ]);

    const receipt =
      readReceipt(api) ||
      firstGlobal([
        "HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT",
        "HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT",
        "LAB_RUNTIME_TABLE_NORTH_MACRO_DISTRIBUTOR_RECEIPT"
      ]) ||
      {};

    return {
      authority: api || null,
      receipt: isObject(receipt) ? receipt : {},
      observed: Boolean(api || (isObject(receipt) && receipt.contract)),
      file: FILE_GATES.north
    };
  }

  function readEastAuthority() {
    const api = firstGlobal([
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "DEXTER_LAB_RUNTIME_TABLE_EAST",
      "LAB_CARDINAL_RUNTIME_TABLE_EAST",
      "LAB_CHECKPOINT_GOVERNOR_EAST",
      "HEARTH_EAST_FIBONACCI_MAGNIFIER",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.checkpointGovernorEast",
      "DEXTER_LAB.hearthEastFibonacciMagnifier"
    ]);

    return {
      authority: api || null,
      receipt: readReceipt(api) || {},
      observed: Boolean(api),
      file: FILE_GATES.east
    };
  }

  function readMacroWestAuthority() {
    const api = firstGlobal([
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "DEXTER_LAB.cycleAwareAdmissibilityClutchWest",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.transmissionGapClassifierWest",
      "HEARTH.westCycleAwareAdmissibilityClutch"
    ]);

    const receipt = readReceipt(api) || {};

    const observed = Boolean(
      api ||
      receipt.contract ||
      datasetValue("labRuntimeTableWestLoaded") === "true" ||
      datasetValue("westCycleAwareAdmissibilityClutch") === "true" ||
      datasetValue("hearthSouthMacroWestAuthorityObserved") === "true"
    );

    return {
      authority: api || null,
      receipt,
      observed,
      file: FILE_GATES.macroWest
    };
  }

  function readWestAuthority() {
    return readMacroWestAuthority();
  }

  function readSouthPrimaryGate() {
    const api = firstGlobal([
      "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_GATE",
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "DEXTER_LAB_RUNTIME_TABLE_SOUTH",
      "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
      "LAB_VISIBLE_STATE_COMPOSER_SOUTH",
      "HEARTH_RUNTIME_TABLE_SOUTH",
      "HEARTH_SOUTH",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.south",
      "DEXTER_LAB.visibleStateComposer",
      "DEXTER_LAB.transmissionVisibleStateComposer",
      "DEXTER_LAB.southPrimaryGate"
    ]);

    const receipt = readReceipt(api) || {};

    return {
      authority: api || null,
      receipt,
      observed: Boolean(api),
      primaryGateObserved: Boolean(api && (
        api.southPrimaryGate === true ||
        api.southPrimaryGateActive === true ||
        api.outputProofComposerActive === true ||
        isFunction(api.composeSouthPrimaryPacket) ||
        isFunction(api.composeNorthReturnPacket) ||
        isFunction(api.composeWestHandoffPacket)
      )),
      file: FILE_GATES.south
    };
  }

  function readHearthIndexAuthority() {
    const api = firstGlobal([
      "HEARTH_INDEX_JS_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_ALIGNMENT",
      "HEARTH_INDEX_JS_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST",
      "HEARTH_INDEX_RUNTIME_HOST",
      "HEARTH_HTML_SHELL_ANCHOR_AUDIT_RUNTIME_HOST",
      "HEARTH_INDEX_JS",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_EAST_SOUTH_PAIR_DYNAMIC_SELECTOR_RUNTIME_RELEASE",
      "HEARTH_EAST_SOUTH_PAIR_FEMALE_SELECTOR",
      "HEARTH.indexRuntimeHost",
      "HEARTH.htmlShellAnchorAuditRuntimeHost",
      "HEARTH.indexBridge",
      "HEARTH.indexJs",
      "HEARTH.dynamicSelectorRuntimeRelease",
      "HEARTH.eastSouthPairFemaleSelector",
      "HEARTH.twoFileNewsFibonacciCarrierHostAlignment",
      "DEXTER_LAB.hearthIndexRuntimeHost",
      "DEXTER_LAB.hearthHtmlShellAnchorAuditRuntimeHost",
      "DEXTER_LAB.hearthDynamicSelectorRuntimeRelease",
      "DEXTER_LAB.hearthTwoFileNewsFibonacciCarrierHostAlignment"
    ]);

    const carrierPacket = firstGlobal([
      "HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY",
      "HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY_RECEIPT",
      "HEARTH.indexCarrierHostAdmissibility",
      "HEARTH.indexCarrierHostAdmissibilityReceipt",
      "HEARTH.carrierHostAdmissibility",
      "HEARTH.carrierHostAdmissibilityReceipt",
      "DEXTER_LAB.hearthIndexCarrierHostAdmissibility",
      "DEXTER_LAB.hearthCarrierHostAdmissibility"
    ]);

    const apiReceipt = readReceipt(api) || {};
    const receipt = isObject(carrierPacket) && (carrierPacket.packetType || carrierPacket.contract)
      ? carrierPacket
      : apiReceipt;

    const dom = scanDom();

    const contract = safeString(firstDefined(
      receipt.contract,
      apiReceipt.contract,
      datasetValue("hearthIndexJsContract", ""),
      datasetValue("hearthFemaleSelectorContract", ""),
      datasetValue("hearthIndexContract", "")
    ), "");

    const observed = Boolean(
      api ||
      receipt.contract ||
      INDEX_CONTRACTS.includes(contract) ||
      datasetValue("hearthIndexJsLoaded") === "true" ||
      datasetValue("hearthFemaleSelectorLoaded") === "true" ||
      datasetValue("hearthShellDetected") === "true" ||
      datasetValue("hearthRuntimeReleaseAuthorized") === "true"
    );

    const shellAccepted = Boolean(
      safeBool(receipt.shellAccepted, false) ||
      safeBool(apiReceipt.shellAccepted, false) ||
      datasetValue("hearthShellAccepted") === "true" ||
      datasetValue("hearthRuntimeReleaseAuthorized") === "true"
    );

    const dynamicAnchorsPass = Boolean(
      safeBool(receipt.dynamicAnchorsPass, false) ||
      safeBool(apiReceipt.dynamicAnchorsPass, false) ||
      datasetValue("hearthDynamicAnchorsPass") === "true"
    );

    const controlsBound = Boolean(
      safeBool(receipt.shellControlsBound, false) ||
      safeBool(apiReceipt.shellControlsBound, false) ||
      datasetValue("hearthShellControlsBound") === "true" ||
      (dom.copyDiagnosticReady && dom.receiptToggleReady && dom.inspectPlanetControlAvailable)
    );

    const runtimeReleaseAuthorized = Boolean(
      safeBool(receipt.runtimeReleaseAuthorized, false) ||
      safeBool(apiReceipt.runtimeReleaseAuthorized, false) ||
      datasetValue("hearthRuntimeReleaseAuthorized") === "true"
    );

    const runtimeReleaseComplete = Boolean(
      safeBool(receipt.runtimeReleaseComplete, false) ||
      safeBool(apiReceipt.runtimeReleaseComplete, false) ||
      datasetValue("hearthRuntimeReleaseComplete") === "true" ||
      datasetValue("hearthRuntimeLoaded", "").includes("/assets/lab/runtime-table.js")
    );

    const runtimeHeld = Boolean(
      safeBool(receipt.runtimeHeld, false) ||
      safeBool(apiReceipt.runtimeHeld, false) ||
      datasetValue("hearthRuntimeHeld") === "true"
    );

    const mountPresent = Boolean(
      safeBool(receipt.mountPresent, false) ||
      safeBool(apiReceipt.mountPresent, false) ||
      datasetValue("hearthMountPresent") === "true" ||
      dom.mountPresent
    );

    const carrierHostReady = Boolean(
      safeBool(receipt.carrierHostReady, false) ||
      safeBool(apiReceipt.carrierHostReady, false) ||
      datasetValue("hearthCarrierHostReady") === "true" ||
      mountPresent
    );

    const carrierHostPacketReady = Boolean(
      safeBool(receipt.carrierHostPacketReady, false) ||
      safeBool(apiReceipt.carrierHostPacketReady, false) ||
      datasetValue("hearthCarrierHostPacketReady") === "true" ||
      carrierHostReady
    );

    const carrierHostAdmissibilityReady = Boolean(
      safeBool(receipt.carrierHostAdmissibilityReady, false) ||
      safeBool(apiReceipt.carrierHostAdmissibilityReady, false) ||
      root.HEARTH_INDEX_CARRIER_HOST_ADMISSIBILITY_READY === true ||
      datasetValue("hearthCarrierHostAdmissibilityReady") === "true"
    );

    const carrierHostAdmissibilityPacketReady = Boolean(
      safeBool(receipt.carrierHostAdmissibilityPacketReady, false) ||
      safeBool(apiReceipt.carrierHostAdmissibilityPacketReady, false) ||
      datasetValue("hearthCarrierHostAdmissibilityPacketReady") === "true" ||
      carrierHostAdmissibilityReady
    );

    const carrierHostAdmissibilityPacketPublished = Boolean(
      safeBool(receipt.carrierHostAdmissibilityPacketPublished, false) ||
      safeBool(apiReceipt.carrierHostAdmissibilityPacketPublished, false) ||
      datasetValue("hearthCarrierHostAdmissibilityPacketPublished") === "true" ||
      Boolean(carrierPacket)
    );

    const indexMacroWestCandidateReady = Boolean(
      safeBool(receipt.indexMacroWestCandidateReady, false) ||
      safeBool(apiReceipt.indexMacroWestCandidateReady, false) ||
      root.HEARTH_INDEX_MACRO_WEST_CANDIDATE_READY === true ||
      datasetValue("hearthIndexMacroWestCandidateReady") === "true" ||
      carrierHostAdmissibilityReady
    );

    const handoffToRouteConductor = Boolean(
      safeBool(receipt.handoffToRouteConductor, false) ||
      safeBool(apiReceipt.handoffToRouteConductor, false) ||
      root.HEARTH_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR === true ||
      datasetValue("hearthIndexHandoffToRouteConductor") === "true" ||
      carrierHostAdmissibilityReady
    );

    const missingHooks = Array.isArray(receipt.missingHooks)
      ? receipt.missingHooks.slice()
      : safeString(datasetValue("hearthMissingHooks", "")).split(",").filter(Boolean);

    const ready = Boolean(
      observed &&
      shellAccepted &&
      dynamicAnchorsPass &&
      controlsBound &&
      mountPresent &&
      carrierHostReady &&
      carrierHostPacketReady &&
      carrierHostAdmissibilityReady &&
      carrierHostAdmissibilityPacketReady &&
      runtimeReleaseAuthorized &&
      runtimeReleaseComplete &&
      handoffToRouteConductor
    );

    const holdReason = ready
      ? "NONE_INDEX_CARRIER_HOST_ADMISSIBILITY_READY"
      : !observed
        ? "WAITING_INDEX_PAIR_OBSERVATION"
        : !shellAccepted
          ? "WAITING_INDEX_HTML_SHELL_ACCEPTANCE"
          : !dynamicAnchorsPass
            ? "WAITING_INDEX_DYNAMIC_ANCHORS"
            : !controlsBound
              ? "WAITING_INDEX_DYNAMIC_ANCHORS_OR_CONTROLS"
              : !mountPresent || !carrierHostReady || !carrierHostPacketReady
                ? "WAITING_INDEX_CARRIER_HOST_PACKET"
                : !runtimeReleaseAuthorized
                  ? "WAITING_INDEX_RUNTIME_RELEASE_AUTHORIZATION"
                  : !runtimeReleaseComplete
                    ? "WAITING_INDEX_RUNTIME_RELEASE_COMPLETION"
                    : runtimeHeld
                      ? "INDEX_RUNTIME_RELEASE_HELD"
                      : !carrierHostAdmissibilityReady
                        ? safeString(firstDefined(receipt.carrierHostAdmissibilityHoldReason, datasetValue("hearthCarrierHostAdmissibilityHoldReason", "")), "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY")
                        : !handoffToRouteConductor
                          ? "WAITING_INDEX_HANDOFF_TO_ROUTE_CONDUCTOR"
                          : "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY_READY";

    return {
      authority: api || null,
      receipt,
      apiReceipt,
      observed,
      file: FILE_GATES.hearthIndex,
      contract,

      indexPairReady: ready,
      shellDetected: Boolean(safeBool(receipt.shellDetected, false) || datasetValue("hearthShellDetected") === "true" || dom.mountPresent),
      shellSelected: Boolean(safeBool(receipt.shellSelected, false) || datasetValue("hearthShellSelected") === "true" || shellAccepted),
      shellAccepted,
      dynamicAnchorsPass,
      hooksBound: controlsBound,
      runtimeReleaseAuthorized,
      runtimeReleaseComplete,
      runtimeHeld,
      runtimeReleaseHeldReason: safeString(firstDefined(receipt.runtimeReleaseHeldReason, datasetValue("hearthRuntimeReleaseHeldReason", "")), ""),
      mountPresent,
      controlsBound,
      missingHooks,

      carrierHostReady,
      carrierHostPacketReady,
      carrierHostAdmissibilityObserved: Boolean(carrierPacket || datasetValue("hearthCarrierHostAdmissibilityActive") === "true"),
      carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady,
      carrierHostAdmissibilityPacketPublished,
      carrierHostAdmissibilityHoldReason: safeString(firstDefined(
        receipt.carrierHostAdmissibilityHoldReason,
        datasetValue("hearthCarrierHostAdmissibilityHoldReason", "")
      ), holdReason),
      indexMacroWestCandidateReady,
      handoffToRouteConductor,
      routeConductorHandoffPacketReady: Boolean(
        safeBool(receipt.routeConductorHandoffPacketReady, false) ||
        datasetValue("hearthIndexRouteConductorHandoffPacketReady") === "true" ||
        handoffToRouteConductor
      ),

      carrierPacket: clonePlain(carrierPacket || null),
      activeFibonacci: safeString(firstDefined(receipt.activeFibonacci, datasetValue("hearthActiveFibonacci", "F1")), "F1"),
      activeStage: safeString(firstDefined(receipt.activeStageId, receipt.activeStage, datasetValue("hearthActiveStageId", ""), datasetValue("hearthActiveStage", "")), ""),
      postgameStatus: safeString(firstDefined(receipt.postgameStatus, datasetValue("hearthPostgameStatus", "")), ""),
      holdReason,
      recommendedNextFile: FILE_GATES.hearthIndex,
      dom
    };
  }

  function readCanvasApi() {
    return firstGlobal([
      "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION",
      "HEARTH.canvasParentStructuralCarrierBootMethodEastV5Consumption",
      "DEXTER_LAB.hearthCanvasParentStructuralCarrierBootMethodEastV5Consumption",

      "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION",
      "HEARTH.canvasParentEastV5SynchronousHeldPacketConsumption",
      "DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumption",

      "HEARTH_CANVAS_PARENT",
      "HEARTH.canvasParent",
      "DEXTER_LAB.hearthCanvasParent",

      "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER",
      "HEARTH.canvasParentStructuralCarrier",
      "DEXTER_LAB.hearthCanvasParentStructuralCarrier",

      "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST",
      "HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
      "DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",

      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver",

      "HEARTH_CANVAS_NORTH",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasEvidence",
      "HEARTH.canvasNorth",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvasNorth"
    ]);
  }

  function readCanvasReceipt() {
    const api = readCanvasApi();
    const receipt = readReceipt(api);
    if (receipt) return receipt;

    const fallback = firstGlobal([
      "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_RECEIPT",
      "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_RECEIPT",
      "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_RECEIPT",
      "HEARTH_CANVAS_PARENT_RECEIPT",
      "HEARTH_CANVAS_RECEIPT",
      "HEARTH_CANVAS_EVIDENCE_RECEIPT",
      "HEARTH.canvasParentStructuralCarrierBootMethodEastV5ConsumptionReceipt",
      "HEARTH.canvasParentEastV5SynchronousHeldPacketConsumptionReceipt",
      "HEARTH.canvasParentStructuralCarrierReceipt",
      "HEARTH.canvasParentReceipt",
      "HEARTH.canvasReceipt",
      "HEARTH.canvasEvidenceReceipt",
      "DEXTER_LAB.hearthCanvasParentStructuralCarrierBootMethodEastV5ConsumptionReceipt",
      "DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumptionReceipt",
      "DEXTER_LAB.hearthCanvasParentReceipt",
      "DEXTER_LAB.hearthCanvasReceipt"
    ]);

    return isObject(fallback) ? fallback : {};
  }

  function readCanvasChild(key) {
    const names = {
      east: [
        "HEARTH_CANVAS_EAST",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "HEARTH.canvasEastF13AtlasSourceChild",
        "HEARTH.canvasEastGovernedF13AtlasSource",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild"
      ],
      west: [
        "HEARTH_CANVAS_WEST",
        "HEARTH.canvasWest",
        "HEARTH.canvasWestInspectionInvalidationControl",
        "HEARTH.canvasWestF13NInspectionViewInvalidationChild",
        "DEXTER_LAB.hearthCanvasWest",
        "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl"
      ],
      south: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH.canvasSouth",
        "HEARTH.canvasSouthTextureSphereVisibleProof",
        "HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardening",
        "HEARTH.canvasSouthF13STextureRenderVisibleProofChild",
        "DEXTER_LAB.hearthCanvasSouth",
        "DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof",
        "DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild"
      ]
    };

    return firstGlobal(names[key] || []);
  }

  function selectCanvasMethod(canvas) {
    if (!canvas || !isObject(canvas)) return "";
    if (isFunction(canvas.bootCooperative)) return "bootCooperative";
    if (isFunction(canvas.boot)) return "boot";
    if (isFunction(canvas.init)) return "init";
    if (isFunction(canvas.start)) return "start";
    if (isFunction(canvas.mount)) return "mount";
    if (isFunction(canvas.render)) return "render";
    return "";
  }

  function detectCurrentCanvasParent(receipt = {}, api = null) {
    const receiptContract = safeString(firstDefined(receipt.contract, receipt.splitContract, api && api.contract), "");
    const receiptName = safeString(firstDefined(receipt.receipt, receipt.splitReceipt, api && api.receipt), "");

    const currentContractObserved = Boolean(
      CURRENT_CANVAS_PARENT_CONTRACTS.includes(receiptContract) ||
      CURRENT_CANVAS_PARENT_CONTRACTS.includes(safeString(api && api.contract, "")) ||
      safeBool(receipt.canvasParentV7Active, false) ||
      safeBool(receipt.canvasParentV6Compatible, false) ||
      safeBool(receipt.eastV5SynchronousHeldPacketConsumptionActive, false) ||
      safeBool(receipt.structuralCarrierActive, false) ||
      safeBool(receipt.canvasParentBootMethodAvailable, false) ||
      datasetValue("hearthCanvasParentV7Active") === "true" ||
      datasetValue("hearthCanvasParentV6Compatible") === "true" ||
      datasetValue("hearthCanvasEastV5SynchronousHeldPacketConsumptionActive") === "true" ||
      datasetValue("hearthCanvasStructuralCarrierActive") === "true" ||
      datasetValue("hearthCanvasParentBootMethodAvailable") === "true"
    );

    const currentParentObserved = Boolean(
      api ||
      currentContractObserved ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasParentMarkerPresent") === "true"
    );

    const actualLegacyV2 = Boolean(
      receiptContract === LEGACY_CANVAS_V2_CONTRACT ||
      receiptName === LEGACY_CANVAS_V2_RECEIPT
    );

    const broadLegacyV2Signal = Boolean(
      safeBool(receipt.canvasParentChildReconciliationActive, false) ||
      safeBool(receipt.parentChildReconciliationActive, false) ||
      safeBool(receipt.ownsParentChildReconciliation, false) ||
      datasetValue("hearthCanvasParentChildReconciliationActive") === "true"
    );

    const canvasParentV2Observed = Boolean(actualLegacyV2 && !currentParentObserved);
    const canvasParentV2Superseded = Boolean(currentParentObserved && (actualLegacyV2 || broadLegacyV2Signal));

    return {
      currentCanvasParentObserved: currentParentObserved,
      currentCanvasParentContractObserved: currentContractObserved,
      currentCanvasParentContract: receiptContract || safeString(api && api.contract, ""),
      canvasParentV2Observed,
      canvasParentV2Superseded,
      staleCanvasV2FalsePositiveBlocked: Boolean(!canvasParentV2Observed && broadLegacyV2Signal && currentParentObserved)
    };
  }

  function resolveCanvasParentReleaseAcceptance(receipt = {}, releaseAuthorized = false) {
    const accepted = Boolean(
      safeBool(receipt.canvasParentReleaseAccepted, false) ||
      safeBool(receipt.canvasParentReleaseObserved, false) ||
      safeBool(receipt.parentReleaseLawful, false) ||
      safeBool(receipt.parentReleasePacketLawful, false) ||
      datasetValue("hearthCanvasParentReleaseAccepted") === "true" ||
      datasetValue("hearthCanvasParentReleaseLawful") === "true" ||
      datasetValue("hearthCanvasParentReleasePacketLawful") === "true"
    );

    const packetSent = Boolean(
      safeBool(receipt.parentReleasePacketSentToEast, false) ||
      datasetValue("hearthCanvasParentReleasePacketSentToEast") === "true"
    );

    const packetLawful = Boolean(
      safeBool(receipt.parentReleasePacketLawful, false) ||
      safeBool(receipt.parentReleaseLawful, false) ||
      datasetValue("hearthCanvasParentReleasePacketLawful") === "true" ||
      datasetValue("hearthCanvasParentReleaseLawful") === "true"
    );

    const holdReason = releaseAuthorized && !accepted
      ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
      : accepted
        ? "NONE_CANVAS_PARENT_RELEASE_ACCEPTED"
        : "WAITING_MACRO_WEST_RELEASE";

    return {
      canvasParentReleaseAccepted: accepted,
      canvasParentReleaseObserved: accepted,
      parentReleaseLawful: accepted,
      parentReleasePacketSentToEast: packetSent,
      parentReleasePacketLawful: packetLawful,
      holdReason
    };
  }

  function readCanvasEvidence(releaseAuthorizedHint = false) {
    const api = readCanvasApi();
    const receipt = readCanvasReceipt();
    const dom = scanDom();

    const eastChild = readCanvasChild("east");
    const westChild = readCanvasChild("west");
    const southChild = readCanvasChild("south");

    const eastReceipt = readReceipt(eastChild) || {};
    const westReceipt = readReceipt(westChild) || {};
    const southReceipt = readReceipt(southChild) || {};

    const parentDetection = detectCurrentCanvasParent(receipt, api);
    const parentBootMethod = selectCanvasMethod(api);
    const parentBootMethodAvailable = Boolean(
      parentBootMethod ||
      safeBool(receipt.canvasParentBootMethodAvailable, false) ||
      safeBool(receipt.bootMethodAvailable, false) ||
      safeBool(receipt.mountMethodAvailable, false) ||
      datasetValue("hearthCanvasParentBootMethodAvailable") === "true" ||
      datasetValue("hearthCanvasBootMethodAvailable") === "true"
    );

    const releaseAccepted = resolveCanvasParentReleaseAcceptance(receipt, releaseAuthorizedHint);

    const parentCarrierSafe = Boolean(
      safeBool(receipt.structuralCarrierSafe, false) ||
      safeBool(receipt.canvasParentCarrierSafe, false) ||
      safeBool(receipt.carrierPrecheckReady, false) ||
      safeBool(receipt.macroWestPrecheckCarrierReady, false) ||
      datasetValue("hearthCanvasStructuralCarrierSafe") === "true" ||
      datasetValue("hearthCanvasParentCarrierSafe") === "true"
    );

    const eastApiFallback = childHasMethods(eastChild, ["buildAtlas", "sample", "read", "getReceipt"]);
    const westApiFallback = Boolean(westChild && (
      childHasMethods(westChild, ["getReceipt"]) ||
      isFunction(westChild.bindInspection) ||
      isFunction(westChild.getViewState) ||
      isFunction(westChild.setRotation) ||
      isFunction(westChild.setZoom)
    ));
    const southApiFallback = Boolean(southChild && (
      childHasMethods(southChild, ["getReceipt"]) ||
      isFunction(southChild.composeTexture) ||
      isFunction(southChild.renderSphere) ||
      isFunction(southChild.renderSphereSync) ||
      isFunction(southChild.getTextureCanvas) ||
      isFunction(southChild.sampleVisibleContent)
    ));

    const canvasEastApiReady = safeBool(
      firstDefined(receipt.canvasEastApiReady, eastReceipt.canvasEastApiReady, eastReceipt.requiredApiSurfaceComplete),
      eastApiFallback
    );

    const canvasWestApiReady = safeBool(
      firstDefined(receipt.canvasWestApiReady, westReceipt.canvasWestApiReady, westReceipt.canvasWestReady),
      westApiFallback
    );

    const canvasSouthApiReady = safeBool(
      firstDefined(receipt.canvasSouthApiReady, southReceipt.canvasSouthApiReady, southReceipt.canvasSouthReady),
      southApiFallback
    );

    const allCanvasChildrenApiReady = Boolean(canvasEastApiReady && canvasWestApiReady && canvasSouthApiReady);

    const atlasBuildComplete = safeBool(
      firstDefined(
        receipt.canvasEastEvidenceReady,
        receipt.canvasEastF13AtlasPacketReady,
        receipt.atlasBuildComplete,
        receipt.f13AtlasReady,
        eastReceipt.canvasEastEvidenceReady,
        eastReceipt.f13AtlasPacketReady,
        eastReceipt.atlasBuildComplete,
        eastReceipt.atlasReady,
        datasetValue("hearthCanvasEastEvidenceReady", ""),
        datasetValue("hearthCanvasEastF13AtlasPacketReady", "")
      ),
      false
    );

    const canvasEastEvidenceReady = Boolean(canvasEastApiReady && releaseAccepted.canvasParentReleaseAccepted && atlasBuildComplete);

    const canvasWestInspectionReady = Boolean(
      canvasWestApiReady &&
      (
        safeBool(receipt.canvasWestInspectionReady, false) ||
        safeBool(receipt.canvasWestEvidenceReady, false) ||
        safeBool(receipt.inspectModeAvailable, false) ||
        safeBool(westReceipt.f13nInspectionReady, false) ||
        safeBool(westReceipt.inspectionReady, false) ||
        safeBool(westReceipt.dragInspectionBound, false) ||
        safeBool(westReceipt.zoomInspectionBound, false) ||
        dom.inspectStrictReady ||
        dom.inspectFallbackReady ||
        datasetValue("hearthCanvasWestInspectionReady") === "true"
      )
    );

    const visibleContentStrictProof = Boolean(
      safeBool(receipt.visibleContentStrictProof, false) ||
      safeBool(receipt.f13CanvasEvidenceStrict, false) ||
      safeBool(southReceipt.visibleContentStrictProof, false) ||
      safeBool(southReceipt.f13VisibleEvidenceStrict, false) ||
      datasetValue("hearthCanvasF13EvidenceStrict") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentStrictProof") === "true"
    );

    const visibleContentSoftGap = Boolean(
      safeBool(receipt.visibleContentSoftGap, false) ||
      safeBool(receipt.f13CanvasEvidenceDegraded, false) ||
      safeBool(southReceipt.visibleContentSoftGap, false) ||
      safeBool(southReceipt.f13VisibleEvidenceDegraded, false) ||
      datasetValue("hearthCanvasF13EvidenceDegraded") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentSoftGap") === "true"
    );

    const visibleContentHardFail = Boolean(
      safeBool(receipt.visibleContentHardFail, false) ||
      safeBool(receipt.f13HardFail, false) ||
      safeBool(southReceipt.visibleContentHardFail, false) ||
      safeBool(southReceipt.f13HardFail, false) ||
      datasetValue("hearthCanvasF13HardFail") === "true" ||
      datasetValue("hearthCanvasSouthVisibleContentHardFail") === "true"
    );

    const visibleForwardProgress = Boolean(
      safeBool(receipt.visibleForwardProgress, false) ||
      safeBool(southReceipt.visibleForwardProgress, false) ||
      datasetValue("hearthCanvasVisibleForwardProgress") === "true"
    );

    const visiblePlanetAvailable = Boolean(
      safeBool(receipt.visiblePlanetAvailable, false) ||
      safeBool(southReceipt.visiblePlanetAvailable, false) ||
      datasetValue("hearthCanvasVisiblePlanetAvailable") === "true" ||
      datasetValue("hearthCanvasSouthVisiblePlanetAvailable") === "true"
    );

    const imageRendered = Boolean(
      safeBool(receipt.imageRendered, false) ||
      safeBool(southReceipt.imageRendered, false) ||
      datasetValue("hearthCanvasImageRendered") === "true" ||
      datasetValue("hearthCanvasSouthImageRendered") === "true"
    );

    const firstFrameDetected = Boolean(
      safeBool(receipt.firstFrameDetected, false) ||
      safeBool(southReceipt.firstFrameDetected, false) ||
      datasetValue("hearthCanvasFirstFrameDetected") === "true"
    );

    const visibleContentSampleCount = safeNumber(firstDefined(receipt.visibleContentSampleCount, southReceipt.visibleContentSampleCount), 0);
    const visibleContentVarianceScore = safeNumber(firstDefined(receipt.visibleContentVarianceScore, southReceipt.visibleContentVarianceScore), 0);
    const visibleContentClassCount = safeNumber(firstDefined(receipt.visibleContentClassCount, southReceipt.visibleContentClassCount), 0);
    const visibleContentLandSampleCount = safeNumber(firstDefined(receipt.visibleContentLandSampleCount, southReceipt.visibleContentLandSampleCount), 0);
    const visibleContentWaterSampleCount = safeNumber(firstDefined(receipt.visibleContentWaterSampleCount, southReceipt.visibleContentWaterSampleCount), 0);
    const visibleContentOtherSampleCount = safeNumber(firstDefined(receipt.visibleContentOtherSampleCount, southReceipt.visibleContentOtherSampleCount), 0);
    const visibleProofStale = Boolean(
      safeBool(receipt.visibleProofStale, false) ||
      safeBool(southReceipt.visibleProofStale, false) ||
      safeBool(receipt.renderFrameStale, false) ||
      safeBool(southReceipt.renderFrameStale, false)
    );
    const textureInvalidated = Boolean(
      safeBool(receipt.textureInvalidated, false) ||
      safeBool(southReceipt.textureInvalidated, false)
    );
    const carrierOnlyDetected = Boolean(
      safeBool(receipt.carrierOnlyDetected, false) ||
      safeBool(southReceipt.carrierOnlyDetected, false)
    );

    const contentCount = visibleContentLandSampleCount + visibleContentWaterSampleCount + visibleContentOtherSampleCount;

    const strictByMetrics = Boolean(
      visibleContentSampleCount >= STRICT_PROOF_MINIMUMS.sampleCount &&
      contentCount >= STRICT_PROOF_MINIMUMS.contentCount &&
      visibleContentVarianceScore >= STRICT_PROOF_MINIMUMS.varianceScore &&
      visibleContentClassCount >= STRICT_PROOF_MINIMUMS.classCount &&
      visibleContentLandSampleCount > 0 &&
      visibleContentWaterSampleCount > 0 &&
      !carrierOnlyDetected &&
      !visibleProofStale &&
      !textureInvalidated
    );

    const southStrictProofObserved = Boolean(
      visibleContentStrictProof ||
      strictByMetrics ||
      (safeBool(southReceipt.currentVisibleProofValid, false) && safeString(southReceipt.proofBin, "") === "STRICT")
    );

    const southSoftProofObserved = Boolean(
      visibleContentSoftGap ||
      visibleForwardProgress ||
      visiblePlanetAvailable ||
      imageRendered ||
      safeString(southReceipt.proofBin, "") === "SOFT_GAP"
    );

    const southHardFailObserved = Boolean(
      visibleContentHardFail ||
      safeString(southReceipt.proofBin, "") === "HARD_FAIL"
    );

    const canvasSouthVisibleProofReady = Boolean(
      canvasSouthApiReady &&
      !southHardFailObserved &&
      !visibleProofStale &&
      (
        southStrictProofObserved ||
        southSoftProofObserved ||
        visiblePlanetAvailable ||
        (firstFrameDetected && imageRendered)
      )
    );

    const allCanvasChildrenEvidenceReady = Boolean(
      releaseAccepted.canvasParentReleaseAccepted &&
      canvasEastEvidenceReady &&
      canvasWestInspectionReady &&
      canvasSouthVisibleProofReady
    );

    const allCanvasChildrenReady = Boolean(allCanvasChildrenApiReady && allCanvasChildrenEvidenceReady);

    const f13HardFail = Boolean(
      visibleContentHardFail ||
      southHardFailObserved ||
      safeBool(receipt.f13HardFail, false)
    );

    const f13CanvasEvidenceStrict = Boolean(
      releaseAccepted.canvasParentReleaseAccepted &&
      allCanvasChildrenReady &&
      canvasEastEvidenceReady &&
      canvasWestInspectionReady &&
      canvasSouthVisibleProofReady &&
      southStrictProofObserved &&
      !f13HardFail &&
      !visibleProofStale &&
      !textureInvalidated
    );

    const f13CanvasEvidenceDegraded = Boolean(
      !f13CanvasEvidenceStrict &&
      releaseAccepted.canvasParentReleaseAccepted &&
      canvasEastEvidenceReady &&
      canvasWestInspectionReady &&
      canvasSouthVisibleProofReady &&
      southSoftProofObserved &&
      !f13HardFail &&
      !visibleProofStale &&
      !textureInvalidated
    );

    const f13CanvasEvidenceComplete = Boolean(f13CanvasEvidenceStrict || f13CanvasEvidenceDegraded);

    const canvasGateReady = Boolean(
      parentDetection.currentCanvasParentObserved &&
      parentBootMethodAvailable &&
      releaseAccepted.canvasParentReleaseAccepted &&
      allCanvasChildrenReady &&
      f13CanvasEvidenceComplete &&
      !f13HardFail
    );

    const f13StrictEvidenceGap = resolveStrictF13Gap({
      currentCanvasParentObserved: parentDetection.currentCanvasParentObserved,
      parentBootMethodAvailable,
      canvasParentReleaseAccepted: releaseAccepted.canvasParentReleaseAccepted,
      canvasEastApiReady,
      canvasEastEvidenceReady,
      canvasWestApiReady,
      canvasWestInspectionReady,
      canvasSouthApiReady,
      canvasSouthVisibleProofReady,
      f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete,
      f13HardFail,
      southHardFailObserved,
      visibleProofStale,
      textureInvalidated
    });

    return {
      authority: api || null,
      receipt,
      eastReceipt,
      westReceipt,
      southReceipt,
      file: FILE_GATES.canvas,

      observed: Boolean(
        api ||
        receipt.contract ||
        parentDetection.currentCanvasParentObserved ||
        canvasEastApiReady ||
        canvasWestApiReady ||
        canvasSouthApiReady ||
        f13CanvasEvidenceComplete
      ),

      parentPresent: Boolean(api),
      parentBootMethod,
      parentBootMethodAvailable,

      ...parentDetection,

      parentCarrierSafe,
      parentCarrierObservedOnly: parentCarrierSafe,
      canvasParentReleaseAccepted: releaseAccepted.canvasParentReleaseAccepted,
      canvasParentReleaseObserved: releaseAccepted.canvasParentReleaseObserved,
      parentReleaseLawful: releaseAccepted.parentReleaseLawful,
      parentReleasePacketSentToEast: releaseAccepted.parentReleasePacketSentToEast,
      parentReleasePacketLawful: releaseAccepted.parentReleasePacketLawful,
      canvasParentReleaseHoldReason: releaseAccepted.holdReason,

      canvasEastApiReady,
      canvasWestApiReady,
      canvasSouthApiReady,
      allCanvasChildrenApiReady,

      canvasEastEvidenceReady,
      canvasWestInspectionReady,
      canvasSouthVisibleProofReady,
      allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady,

      atlasBuildComplete,
      imageRendered,
      firstFrameDetected,

      visibleContentStrictProof,
      visibleContentSoftGap,
      visibleContentHardFail,
      visibleForwardProgress,
      visiblePlanetAvailable,
      visibleContentSampleCount,
      visibleContentVarianceScore,
      visibleContentClassCount,
      visibleContentLandSampleCount,
      visibleContentWaterSampleCount,
      visibleContentOtherSampleCount,
      carrierOnlyDetected,
      visibleProofStale,
      textureInvalidated,

      southStrictProofObserved,
      southSoftProofObserved,
      southHardFailObserved,

      f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete,
      f13HardFail,

      canvasGateReady,
      f13VisibleEvidenceAvailable: f13CanvasEvidenceComplete,
      f13InspectEvidenceAvailable: Boolean(
        canvasWestInspectionReady ||
        dom.inspectStrictReady ||
        dom.inspectFallbackReady ||
        safeBool(receipt.inspectStrictReady, false) ||
        safeBool(receipt.inspectFallbackReady, false)
      ),
      f13CanvasReadinessObserved: Boolean(
        parentDetection.currentCanvasParentObserved ||
        parentBootMethodAvailable ||
        allCanvasChildrenApiReady ||
        allCanvasChildrenEvidenceReady ||
        f13CanvasEvidenceComplete
      ),

      f13StrictEvidenceGap: f13StrictEvidenceGap.gap,
      f13StrictEvidenceRepairTarget: f13StrictEvidenceGap.repairTarget,
      degradedF13IsFunctional: Boolean(f13CanvasEvidenceDegraded && f13CanvasEvidenceComplete && !f13CanvasEvidenceStrict && !f13HardFail),
      strictVisualProofPending: Boolean(f13CanvasEvidenceComplete && !f13CanvasEvidenceStrict && !f13HardFail),
      functionalPageObserved: Boolean(
        releaseAccepted.canvasParentReleaseAccepted &&
        parentDetection.currentCanvasParentObserved &&
        allCanvasChildrenApiReady &&
        imageRendered &&
        f13CanvasEvidenceComplete &&
        !f13HardFail
      ),

      nextAuditTarget: safeString(firstDefined(
        receipt.nextAuditTarget,
        receipt.recommendedNextFile,
        receipt.recommendedNextRenewalTarget,
        datasetValue("hearthCanvasNextAuditTarget", "")
      ), ""),
      dom
    };
  }

  function resolveStrictF13Gap(canvas = {}) {
    if (!canvas.currentCanvasParentObserved) {
      return { gap: "WAITING_CURRENT_CANVAS_PARENT", repairTarget: FILE_GATES.canvas };
    }

    if (!canvas.parentBootMethodAvailable) {
      return { gap: "WAITING_CANVAS_PARENT_BOOT_METHOD", repairTarget: FILE_GATES.canvas };
    }

    if (!canvas.canvasParentReleaseAccepted) {
      return { gap: "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE", repairTarget: FILE_GATES.canvas };
    }

    if (!canvas.canvasEastApiReady) {
      return { gap: "WAITING_CANVAS_EAST_API", repairTarget: FILE_GATES.canvasEast };
    }

    if (!canvas.canvasEastEvidenceReady) {
      return { gap: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE", repairTarget: FILE_GATES.canvasEast };
    }

    if (!canvas.canvasWestApiReady) {
      return { gap: "WAITING_CANVAS_WEST_API", repairTarget: FILE_GATES.canvasWest };
    }

    if (!canvas.canvasWestInspectionReady) {
      return { gap: "WAITING_CANVAS_WEST_INSPECTION_EVIDENCE", repairTarget: FILE_GATES.canvasWest };
    }

    if (!canvas.canvasSouthApiReady) {
      return { gap: "WAITING_CANVAS_SOUTH_API", repairTarget: FILE_GATES.canvasSouth };
    }

    if (canvas.visibleProofStale || canvas.textureInvalidated) {
      return { gap: "WAITING_CANVAS_SOUTH_CURRENT_NON_STALE_VISIBLE_PROOF", repairTarget: FILE_GATES.canvasSouth };
    }

    if (canvas.f13HardFail || canvas.southHardFailObserved) {
      return { gap: "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL", repairTarget: FILE_GATES.canvasSouth };
    }

    if (!canvas.canvasSouthVisibleProofReady) {
      return { gap: "WAITING_CANVAS_SOUTH_VISIBLE_PROOF", repairTarget: FILE_GATES.canvasSouth };
    }

    if (canvas.f13CanvasEvidenceComplete && canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict) {
      return { gap: "WAITING_CANVAS_SOUTH_STRICT_VISIBLE_PROOF", repairTarget: FILE_GATES.canvasSouth };
    }

    if (canvas.f13CanvasEvidenceStrict) {
      return { gap: "NONE_F13_STRICT_EVIDENCE_COMPLETE", repairTarget: FILE_GATES.north };
    }

    return { gap: "WAITING_CANVAS_F13_STRICT_EVIDENCE", repairTarget: FILE_GATES.canvasSouth };
  }

  function resolveF8SelfDuty() {
    const markerPresent = Boolean(
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true ||
      datasetValue("hearthRouteConductorMarkerPresent") === "true" ||
      state.routeConductorMarkerPresent
    );

    const globalApi = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR",
      "HearthRouteConductor",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
      "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION",
      "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorPrimaryGate",
      "HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordination",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthSouthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorPrimaryGate",
      "DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardNewsFibonacciParentCoordination"
    ]);

    const apiPresent = Boolean(globalApi);
    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT.contract === CONTRACT
    );

    const runtimeActive = true;
    const hydrated = Boolean(markerPresent && apiPresent && receiptPresent && runtimeActive);

    return {
      routeConductorMarkerPresent: markerPresent,
      routeConductorApiPresent: apiPresent,
      routeConductorReceiptPresent: receiptPresent,
      routeConductorRuntimeActive: runtimeActive,
      routeConductorHydrated: hydrated,
      f8SelfDutySatisfied: hydrated,
      markerIsNotHydrationProof: true,
      apiRequiredForF8: true,
      receiptRequiredForF8: true,
      runtimeRequiredForF8: true,
      firstFailedCoordinate: hydrated
        ? "NONE_F8_SELF_DUTY_SATISFIED"
        : markerPresent
          ? "WAITING_ROUTE_CONDUCTOR_API_RECEIPT_RUNTIME"
          : "WAITING_ROUTE_CONDUCTOR_MARKER_API_RECEIPT_RUNTIME"
    };
  }

  function pickWestNode(result = {}) {
    const candidates = [
      result && result.admissibility,
      result && result.gap,
      result && result.admissibility && result.admissibility.gap,
      result && result.gap && result.gap.gap,
      result && result.lastAdmissibility,
      result && result.lastAdmissibility && result.lastAdmissibility.gap,
      result
    ].filter(isObject);

    return candidates.reduce((acc, item) => ({ ...acc, ...item }), {});
  }

  function normalizeMacroWestResult(result = {}, methodUsed = "", authorityObserved = false) {
    const rootResult = isObject(result) ? result : {};
    const admissibility = isObject(rootResult.admissibility) ? rootResult.admissibility : {};
    const gap = isObject(rootResult.gap) ? rootResult.gap : isObject(admissibility.gap) ? admissibility.gap : {};
    const node = pickWestNode(rootResult);

    const decision = safeString(firstDefined(
      rootResult.decision,
      admissibility.decision,
      gap.decision,
      node.decision
    ), WEST_DECISION.UNKNOWN);

    const gapClass = safeString(firstDefined(
      rootResult.gapClass,
      admissibility.gapClass,
      gap.gapClass,
      node.gapClass
    ), "");

    const gapSeverity = safeString(firstDefined(
      rootResult.gapSeverity,
      admissibility.gapSeverity,
      gap.gapSeverity,
      node.gapSeverity
    ), "");

    const hardBlock = Boolean(
      safeBool(rootResult.hardBlock, false) ||
      safeBool(admissibility.hardBlock, false) ||
      safeBool(gap.hardBlock, false) ||
      decision === WEST_DECISION.HARD_BLOCK ||
      gapClass === "FALSE_COMPLETION_BLOCK" ||
      gapClass === "STRUCTURAL_BLOCK"
    );

    const forwardAllowed = Boolean(
      safeBool(rootResult.forwardAllowed, false) ||
      safeBool(admissibility.forwardAllowed, false) ||
      safeBool(gap.forwardAllowed, false) ||
      safeBool(rootResult.packetAdmissible, false) ||
      safeBool(admissibility.packetAdmissible, false) ||
      safeBool(rootResult.carrierHostAdmissible, false) ||
      decision === WEST_DECISION.RELEASE_TO_CANVAS ||
      decision === WEST_DECISION.FULL_PASS ||
      decision === WEST_DECISION.DEGRADED_FORWARD
    );

    const canvasReleaseApproved = Boolean(
      !hardBlock &&
      (
        safeBool(rootResult.canvasReleaseAuthorized, false) ||
        safeBool(admissibility.canvasReleaseAuthorized, false) ||
        safeBool(gap.canvasRelease, false) ||
        safeBool(rootResult.releaseToCanvas, false) ||
        decision === WEST_DECISION.RELEASE_TO_CANVAS ||
        (decision === WEST_DECISION.FULL_PASS && forwardAllowed) ||
        (decision === WEST_DECISION.DEGRADED_FORWARD && forwardAllowed)
      )
    );

    const degradedForwardApproved = Boolean(
      !hardBlock &&
      (
        safeBool(rootResult.degradedForward, false) ||
        safeBool(admissibility.degradedForward, false) ||
        safeBool(gap.canDegradeForward, false) ||
        decision === WEST_DECISION.DEGRADED_FORWARD
      )
    );

    const firstFailedCoordinate = safeString(firstDefined(
      rootResult.firstFailedCoordinate,
      admissibility.firstFailedCoordinate,
      gap.firstFailedCoordinate,
      node.firstFailedCoordinate
    ), canvasReleaseApproved ? "NONE_MACRO_WEST_CANVAS_RELEASE_APPROVED" : "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION");

    const recommended = safeString(firstDefined(
      rootResult.recommendedNextRenewalTarget,
      rootResult.recommendedNextFile,
      admissibility.recommendedNextRenewalTarget,
      gap.recommendedNextRenewalTarget,
      gap.recommendedNextFile,
      node.recommendedNextRenewalTarget,
      node.recommendedNextFile
    ), canvasReleaseApproved ? FILE_GATES.canvas : FILE_GATES.macroWest);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      macroWestAuthorityObserved: authorityObserved,
      macroWestAdmissibilityObserved: Boolean(result && isObject(result) && Object.keys(result).length),
      macroWestMethodUsed: methodUsed,
      westDecision: decision,
      westGapClass: gapClass,
      westGapSeverity: gapSeverity,
      westHardBlock: hardBlock,
      westForwardAllowed: forwardAllowed,
      westCanvasReleaseApproved: canvasReleaseApproved,
      westDegradedForwardApproved: degradedForwardApproved,
      westFirstFailedCoordinate: firstFailedCoordinate,
      westRecommendedNextRenewalTarget: recommended || (canvasReleaseApproved ? FILE_GATES.canvas : FILE_GATES.macroWest),
      westReleaseReceiptObserved: Boolean(canvasReleaseApproved || decision !== WEST_DECISION.UNKNOWN),
      raw: clonePlain(rootResult),
      normalizedAt: nowIso()
    };
  }

  function classifyMacroWestAdmissibility(normalized = {}) {
    const west = normalized.authorities ? normalized.authorities.west : readMacroWestAuthority();
    const index = normalized.authorities ? normalized.authorities.hearthIndex : readHearthIndexAuthority();

    if (!index.indexPairReady || !index.carrierHostAdmissibilityReady || !index.indexMacroWestCandidateReady || !index.handoffToRouteConductor) {
      return {
        ...normalizeMacroWestResult({}, "index-carrier-host-admissibility-precheck", Boolean(west.observed)),
        macroWestAuthorityObserved: Boolean(west.observed),
        macroWestAdmissibilityObserved: false,
        westDecision: WEST_DECISION.HOLD_ACTIVE,
        westGapClass: "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
        westGapSeverity: "HELD",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westDegradedForwardApproved: false,
        westFirstFailedCoordinate: index.holdReason || index.carrierHostAdmissibilityHoldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
        westRecommendedNextRenewalTarget: FILE_GATES.hearthIndex,
        raw: {
          indexPairReady: index.indexPairReady,
          carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
          indexMacroWestCandidateReady: index.indexMacroWestCandidateReady,
          handoffToRouteConductor: index.handoffToRouteConductor,
          indexHoldReason: index.holdReason,
          carrierHostAdmissibilityHoldReason: index.carrierHostAdmissibilityHoldReason
        },
        normalizedAt: nowIso()
      };
    }

    const authority = west.authority;

    if (!authority || !isObject(authority)) {
      const receiptResult = normalizeMacroWestResult(west.receipt || {}, "receipt-fallback-no-api", Boolean(west.observed));

      if (receiptResult.westCanvasReleaseApproved) return receiptResult;

      return {
        ...receiptResult,
        macroWestAuthorityObserved: Boolean(west.observed),
        macroWestAdmissibilityObserved: false,
        westDecision: WEST_DECISION.HOLD_ACTIVE,
        westGapClass: "WAITING_MACRO_WEST_AUTHORITY",
        westGapSeverity: "HELD",
        westHardBlock: false,
        westForwardAllowed: false,
        westCanvasReleaseApproved: false,
        westDegradedForwardApproved: false,
        westFirstFailedCoordinate: "WAITING_MACRO_WEST_ADMISSIBILITY_AUTHORITY",
        westRecommendedNextRenewalTarget: FILE_GATES.macroWest,
        raw: clonePlain(west.receipt || {}),
        normalizedAt: nowIso()
      };
    }

    const candidate = composeMacroWestCandidate(normalized);
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
          sourceCardinal: CARDINALS.SOUTH,
          targetCardinal: CARDINALS.CANVAS,
          destinationCardinal: CARDINALS.CANVAS,
          sourceFile: FILE,
          targetFile: FILE_GATES.canvas,
          destinationFile: FILE_GATES.canvas,
          activeCycle: "CYCLE_2",
          cycle: "CYCLE_2",
          cycleTwoActive: true,
          activeCycleNumber: 2,
          activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
          activeCheckpointId: "F13N_INSPECT_GATE",
          checkpointId: "F13N_INSPECT_GATE",
          activeFibonacci: "F13N",
          canvasReleaseRequested: true,
          releaseToCanvas: true,
          indexPairReady: true,
          carrierHostAdmissibilityReady: true,
          indexMacroWestCandidateReady: true,
          parentCarrierSafeIsNotMacroWestPrerequisite: true,
          canvasStructuralCarrierOwnedByCanvas: true
        });

        const normalizedResult = normalizeMacroWestResult(result, method, true);

        record("MACRO_WEST_ADMISSIBILITY_CLASSIFIED", {
          method,
          decision: normalizedResult.westDecision,
          gapClass: normalizedResult.westGapClass,
          forwardAllowed: normalizedResult.westForwardAllowed,
          canvasReleaseApproved: normalizedResult.westCanvasReleaseApproved,
          firstFailedCoordinate: normalizedResult.westFirstFailedCoordinate
        });

        return normalizedResult;
      } catch (error) {
        recordError("MACRO_WEST_METHOD_FAILED", error, { method });
      }
    }

    return {
      ...normalizeMacroWestResult(west.receipt || {}, "receipt-fallback", true),
      macroWestAuthorityObserved: true,
      macroWestAdmissibilityObserved: Boolean(west.receipt && Object.keys(west.receipt).length),
      westFirstFailedCoordinate: "WAITING_MACRO_WEST_CLASSIFIER_METHOD",
      westRecommendedNextRenewalTarget: FILE_GATES.macroWest
    };
  }

  function normalizeRouteConductorInput(input = {}) {
    const source = isObject(input) ? input : {};
    const authorities = {
      north: readNorthAuthority(),
      east: readEastAuthority(),
      west: readMacroWestAuthority(),
      south: readSouthPrimaryGate(),
      hearthIndex: readHearthIndexAuthority()
    };

    const receivedFrom = normalizeCardinal(firstDefined(
      source.receivedFrom,
      source.sourceCardinal,
      source.from,
      objectValue(source, "detail.receivedFrom"),
      objectValue(authorities.south.receipt, "receivedFrom"),
      objectValue(authorities.west.receipt, "sourceCardinal"),
      objectValue(authorities.west.receipt, "receivedFrom")
    ));

    const cycleRoute = normalizeCycleRoute(firstDefined(
      source.cycleRoute,
      source.activeCycleRoute,
      objectValue(authorities.south.receipt, "cycleRoute"),
      objectValue(authorities.north.receipt, "activeCycleRoute"),
      datasetValue("hearthSouthActiveCycleRoute", "")
    ));

    const f8 = resolveF8SelfDuty();

    return {
      source: clonePlain(source),
      authorities,
      f8,

      sourceFile: safeString(source.sourceFile || source.file || ""),
      destinationFile: FILE,

      activeCycleNumber: safeNumber(source.activeCycleNumber, 0),
      activeCycleRoute: cycleRoute,
      receivedFrom,
      returnTo: normalizeCardinal(source.returnTo, ""),
      handoffTo: normalizeCardinal(source.handoffTo, ""),

      activeCardinal: CARDINALS.SOUTH,
      activeFileGate: FILE,
      activeFibonacci: "F8",
      activeFibonacciRank: 8,
      activeStageId: "F8_SOUTH_SELF_DUTY",
      activeGearId: "F8_SOUTH_SELF_DUTY",
      activeNewsGate: CARDINALS.SOUTH,

      outputSpreadAvailable: Boolean(
        safeBool(source.outputSpreadAvailable, false) ||
        safeBool(source.outputSpreadComposed, false) ||
        safeBool(objectValue(authorities.south.receipt, "outputSpreadAvailable"), false) ||
        safeBool(objectValue(authorities.south.receipt, "outputSpreadComposed"), false) ||
        authorities.hearthIndex.carrierHostAdmissibilityReady
      ),

      proofBodyAvailable: Boolean(
        safeBool(source.proofBodyAvailable, false) ||
        safeBool(source.proofBodyComposed, false) ||
        safeBool(objectValue(authorities.south.receipt, "proofBodyAvailable"), false) ||
        safeBool(objectValue(authorities.south.receipt, "proofBodyComposed"), false)
      ),

      receiptAvailable: Boolean(
        safeBool(source.receiptAvailable, true) ||
        safeBool(objectValue(authorities.south.receipt, "receiptAvailable"), true) ||
        Boolean(authorities.south.receipt && authorities.south.receipt.receipt)
      ),

      normalizedAt: nowIso()
    };
  }

  function resolveRouteCycle(normalized = {}) {
    const explicitCycleRoute = normalizeCycleRoute(normalized.activeCycleRoute);
    const receivedFrom = normalized.receivedFrom || CARDINALS.UNKNOWN;

    const cycleOne = Boolean(
      explicitCycleRoute === CYCLE_ROUTES.CYCLE_1 ||
      receivedFrom === CARDINALS.WEST ||
      (
        normalized.authorities &&
        normalized.authorities.west &&
        normalized.authorities.west.observed &&
        !normalized.outputSpreadAvailable
      )
    );

    const cycleTwo = Boolean(
      explicitCycleRoute === CYCLE_ROUTES.CYCLE_2 ||
      receivedFrom === CARDINALS.EAST ||
      receivedFrom === CARDINALS.NORTH ||
      receivedFrom === CARDINALS.UNKNOWN ||
      normalized.outputSpreadAvailable ||
      (
        normalized.authorities &&
        normalized.authorities.hearthIndex &&
        normalized.authorities.hearthIndex.carrierHostAdmissibilityReady
      )
    );

    if (cycleOne && !cycleTwo) {
      return {
        cycleKnown: true,
        cycleNumber: 1,
        cycleRoute: CYCLE_ROUTES.CYCLE_1,
        receivedFrom,
        returnTo: CARDINALS.NORTH,
        handoffTo: "",
        northReturnRequired: true,
        westAuditRequired: false,
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: "NONE_CYCLE_1_ROUTE_RESOLVED"
      };
    }

    return {
      cycleKnown: true,
      cycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      receivedFrom,
      returnTo: "",
      handoffTo: CARDINALS.WEST,
      northReturnRequired: false,
      westAuditRequired: true,
      canvasReleaseAuthorized: false,
      firstFailedCoordinate: "NONE_CYCLE_2_ROUTE_RESOLVED"
    };
  }

  function composeMacroWestCandidate(normalized = {}) {
    const index = normalized.authorities.hearthIndex;
    const canvas = readCanvasEvidence(false);

    const hostPrereqsReady = Boolean(
      index.indexPairReady &&
      index.carrierHostAdmissibilityReady &&
      index.indexMacroWestCandidateReady &&
      index.handoffToRouteConductor
    );

    return {
      event: "CYCLE_2_SOUTH_OUTPUT_FOR_CANVAS_RELEASE",
      id: "F13N_INSPECT_GATE",
      phase: "F13N_INSPECT_GATE",
      checkpointId: "F13N_INSPECT_GATE",
      activeFibonacci: "F13N",
      fibonacci: "F13N",
      activeCheckpointId: "F13N_INSPECT_GATE",
      activeGateId: "F13N_INSPECT_GATE",

      sourceCardinal: CARDINALS.SOUTH,
      source: CARDINALS.SOUTH,
      activeCardinal: CARDINALS.SOUTH,
      targetCardinal: CARDINALS.CANVAS,
      destinationCardinal: CARDINALS.CANVAS,
      destination: CARDINALS.CANVAS,
      target: CARDINALS.CANVAS,

      sourceFile: FILE,
      destinationFile: FILE_GATES.canvas,
      targetFile: FILE_GATES.canvas,

      cycleTwoActive: true,
      cycleNumber: 2,
      activeCycleNumber: 2,
      cycleRoute: CYCLE_ROUTES.CYCLE_2,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_2,

      canvasReleaseRequested: hostPrereqsReady,
      releaseToCanvas: hostPrereqsReady,

      indexPairObserved: index.observed,
      indexPairReady: index.indexPairReady,
      indexShellAccepted: index.shellAccepted,
      indexRuntimeReleaseAuthorized: index.runtimeReleaseAuthorized,
      indexRuntimeReleaseComplete: index.runtimeReleaseComplete,
      indexMountPresent: index.mountPresent,
      indexControlsBound: index.controlsBound,
      indexPairHoldReason: index.holdReason,

      carrierHostAdmissibilityObserved: index.carrierHostAdmissibilityObserved,
      carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
      carrierHostAdmissibilityPacketPublished: index.carrierHostAdmissibilityPacketPublished,
      carrierHostAdmissibilityHoldReason: index.carrierHostAdmissibilityHoldReason,
      indexMacroWestCandidateReady: index.indexMacroWestCandidateReady,
      indexHandoffToRouteConductor: index.handoffToRouteConductor,
      routeConductorHandoffPacketReady: index.routeConductorHandoffPacketReady,

      routeMounted: index.mountPresent,
      planetCanvasPresent: canvas.dom ? canvas.dom.planetCanvasPresent : false,
      planetCanvasNonZeroSize: canvas.dom ? canvas.dom.planetCanvasNonZeroSize : false,
      carrierHostReady: index.carrierHostReady,
      carrierHostPacketReady: index.carrierHostPacketReady,
      carrierHostSafeForMacroWest: hostPrereqsReady,

      canvasTargetPresent: canvas.parentPresent || canvas.currentCanvasParentObserved,
      currentCanvasParentObserved: canvas.currentCanvasParentObserved,
      canvasParentBootMethodAvailable: canvas.parentBootMethodAvailable,
      canvasStructuralCarrierOwnedByCanvas: true,
      structuralCarrierSafeForCanvasRelease: false,
      canvasParentCarrierSafeObservedOnly: canvas.parentCarrierObservedOnly,
      parentCarrierSafeIsNotMacroWestPrerequisite: true,
      preMacroWestCanvasStructuralCarrierGateRemoved: true,

      proofBodyComposed: true,
      outputSpreadComposed: true,
      visibleStateComposed: true,
      receiptComposed: true,

      f21EligibleForNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      firstFailedCoordinate: hostPrereqsReady
        ? "NONE_MACRO_WEST_CANDIDATE_READY"
        : !index.indexPairReady
          ? index.holdReason
          : "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
      recommendedNextFile: hostPrereqsReady ? FILE_GATES.macroWest : FILE_GATES.hearthIndex,
      recommendedNextRenewalTarget: hostPrereqsReady ? FILE_GATES.macroWest : FILE_GATES.hearthIndex,
      createdAt: nowIso()
    };
  }

  function composeCanvasReleasePacket(normalized = {}, macroWest = null, canvas = null) {
    const cycle = resolveRouteCycle(normalized);
    const index = normalized.authorities.hearthIndex;
    const westResult = macroWest || classifyMacroWestAdmissibility(normalized);
    const canvasEvidence = canvas || readCanvasEvidence(Boolean(westResult.westCanvasReleaseApproved));

    const lawfulCycle = cycle.cycleNumber === 2 && cycle.cycleRoute === CYCLE_ROUTES.CYCLE_2;

    const indexCarrierHostReady = Boolean(
      index.indexPairReady &&
      index.carrierHostAdmissibilityReady &&
      index.carrierHostAdmissibilityPacketReady &&
      index.handoffToRouteConductor &&
      index.indexMacroWestCandidateReady
    );

    const canvasParentReceivable = Boolean(
      canvasEvidence.parentPresent ||
      canvasEvidence.currentCanvasParentObserved ||
      canvasEvidence.parentBootMethodAvailable
    );

    const southProofReady = Boolean(normalized.proofBodyAvailable || normalized.outputSpreadAvailable || indexCarrierHostReady);

    const macroWestReleaseEvidence = Boolean(
      westResult.macroWestAdmissibilityObserved &&
      westResult.westCanvasReleaseApproved &&
      westResult.westForwardAllowed &&
      !westResult.westHardBlock
    );

    const noVisibleHardFail = !canvasEvidence.f13HardFail;

    const authorized = Boolean(
      lawfulCycle &&
      indexCarrierHostReady &&
      canvasParentReceivable &&
      southProofReady &&
      macroWestReleaseEvidence &&
      noVisibleHardFail
    );

    const heldReason = authorized
      ? "NONE_CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST"
      : !lawfulCycle
        ? "WAITING_CYCLE_2_ROUTE"
        : !indexCarrierHostReady
          ? index.holdReason || index.carrierHostAdmissibilityHoldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY"
          : !canvasParentReceivable
            ? "WAITING_CANVAS_PARENT_API_OR_BOOT_METHOD"
            : !southProofReady
              ? "WAITING_SOUTH_OUTPUT_PROOF_PACKET"
              : !westResult.macroWestAuthorityObserved
                ? "WAITING_MACRO_WEST_AUTHORITY"
                : !westResult.macroWestAdmissibilityObserved
                  ? "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION"
                  : westResult.westHardBlock
                    ? "MACRO_WEST_HARD_BLOCK"
                    : !westResult.westCanvasReleaseApproved
                      ? westResult.westFirstFailedCoordinate || "WAITING_MACRO_WEST_CANVAS_RELEASE_APPROVAL"
                      : !noVisibleHardFail
                        ? "CANVAS_F13_HARD_FAIL_BLOCKS_RELEASE"
                        : "WAITING_MACRO_WEST_CANVAS_RELEASE_EVIDENCE";

    const recommended = authorized
      ? FILE_GATES.canvas
      : !indexCarrierHostReady
        ? FILE_GATES.hearthIndex
        : !canvasParentReceivable
          ? FILE_GATES.canvas
          : !southProofReady
            ? FILE_GATES.south
            : !westResult.macroWestAuthorityObserved || !westResult.macroWestAdmissibilityObserved || westResult.westHardBlock || !westResult.westCanvasReleaseApproved
              ? FILE_GATES.macroWest
              : FILE_GATES.canvas;

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_RELEASE_PACKET",
      cycleNumber: cycle.cycleNumber,
      cycleRoute: cycle.cycleRoute,
      activeCycleNumber: cycle.cycleNumber,
      activeCycleRoute: cycle.cycleRoute,
      receivedFrom: CARDINALS.WEST,
      sourceCardinal: CARDINALS.WEST,
      sourceFile: FILE_GATES.macroWest,
      destinationFile: FILE_GATES.canvas,
      targetFile: FILE_GATES.canvas,
      returnTo: "",
      handoffTo: authorized ? CARDINALS.CANVAS : "",

      indexPairObserved: index.observed,
      indexPairReady: index.indexPairReady,
      carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
      carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
      indexMacroWestCandidateReady: index.indexMacroWestCandidateReady,
      indexHandoffToRouteConductor: index.handoffToRouteConductor,
      indexPairHoldReason: index.holdReason,

      canvasParentReceivable,
      currentCanvasParentObserved: canvasEvidence.currentCanvasParentObserved,
      currentCanvasParentContractObserved: canvasEvidence.currentCanvasParentContractObserved,
      currentCanvasParentContract: canvasEvidence.currentCanvasParentContract,
      canvasParentV2Observed: canvasEvidence.canvasParentV2Observed,
      canvasParentV2Superseded: canvasEvidence.canvasParentV2Superseded,
      canvasParentBootMethodAvailable: canvasEvidence.parentBootMethodAvailable,
      canvasParentCarrierSafeObservedOnly: canvasEvidence.parentCarrierObservedOnly,
      canvasStructuralCarrierOwnedByCanvas: true,
      parentCarrierSafeIsNotMacroWestPrerequisite: true,

      westAuditObserved: westResult.macroWestAdmissibilityObserved,
      westAuditAccepted: westResult.westCanvasReleaseApproved,
      westCanvasReleaseApproved: westResult.westCanvasReleaseApproved,
      westAuditPassed: westResult.westCanvasReleaseApproved && !westResult.westDegradedForwardApproved,
      westAuditDegraded: westResult.westDegradedForwardApproved,
      westAuditBlocked: westResult.westHardBlock,

      macroWestAuthorityObserved: westResult.macroWestAuthorityObserved,
      macroWestAdmissibilityObserved: westResult.macroWestAdmissibilityObserved,
      macroWestMethodUsed: westResult.macroWestMethodUsed,
      westDecision: westResult.westDecision,
      westGapClass: westResult.westGapClass,
      westGapSeverity: westResult.westGapSeverity,
      westHardBlock: westResult.westHardBlock,
      westForwardAllowed: westResult.westForwardAllowed,
      westDegradedForwardApproved: westResult.westDegradedForwardApproved,
      westFirstFailedCoordinate: westResult.westFirstFailedCoordinate,
      westRecommendedNextRenewalTarget: westResult.westRecommendedNextRenewalTarget,

      canvasReleaseAuthorized: authorized,
      canvasReleaseApproved: authorized,
      canvasReleaseReceived: authorized,
      canvasReleasePacketReady: authorized,
      canvasReleaseRequiresWestAudit: true,
      canvasReleaseRequiresMacroWest: true,
      canvasReleaseHeldReason: heldReason,

      lawfulCycle,
      southProofReady,
      macroWestReleaseEvidence,
      noVisibleHardFail,

      completionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      recommendedNextFile: recommended,
      recommendedNextRenewalTarget: recommended,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      composedAt: nowIso()
    };
  }

  function publishReleaseToCanvasParent(canvas, releasePacket) {
    if (!canvas || !isObject(canvas) || !releasePacket || !releasePacket.canvasReleaseAuthorized) {
      return {
        accepted: false,
        action: "HELD",
        reason: "canvas-parent-release-not-published",
        visualPassClaimed: false
      };
    }

    const parentReleasePacket = {
      ...clonePlain(releasePacket),
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      destinationFile: FILE_GATES.canvas,
      targetFile: FILE_GATES.canvas,
      handoffTo: CARDINALS.CANVAS,
      receivedFrom: CARDINALS.WEST,

      westAuditObserved: true,
      westAuditAccepted: true,
      westAuditPassed: true,
      westCanvasReleaseApproved: true,
      canvasReleaseApprovedByWest: true,
      canvasReleaseAuthorized: true,
      releaseToCanvas: true,

      canvasParentReleaseRequested: true,
      parentReleaseRequested: true,
      parentReleasePacketLawful: true,
      parentCarrierSafeIsNotMacroWestPrerequisite: true,
      canvasStructuralCarrierOwnedByCanvas: true,

      f21EligibleForNorth: false,
      completionLatched: false,
      readyTextAllowed: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      createdAt: nowIso()
    };

    let result = null;
    const methods = ["receiveWestPacket", "receiveChildPacket", "receiveReleasePacket", "acceptReleasePacket"];

    for (const method of methods) {
      if (!isFunction(canvas[method])) continue;

      try {
        result = canvas[method](parentReleasePacket);
        record("CANVAS_PARENT_RELEASE_PACKET_PUBLISHED", {
          method,
          canvasReleaseAuthorized: true,
          westCanvasReleaseApproved: true,
          parentReleasePacketLawful: true
        });

        return {
          accepted: true,
          action: "PUBLISHED_TO_CANVAS_PARENT",
          method,
          result: clonePlain(result),
          visualPassClaimed: false
        };
      } catch (error) {
        recordError("CANVAS_PARENT_RELEASE_PACKET_METHOD_FAILED", error, { method });
      }
    }

    return {
      accepted: false,
      action: "HELD",
      reason: "canvas-parent-release-receive-method-missing",
      visualPassClaimed: false
    };
  }

  function composeStation(stationId, file, gate) {
    const passed = Boolean(gate.passed);
    const hardFail = Boolean(gate.hardFail);
    const firstFailedCoordinate = passed
      ? `NONE_${stationId}_PASSED`
      : safeString(gate.firstFailedCoordinate, `WAITING_${stationId}`);

    return {
      stationId,
      file,
      observed: Boolean(gate.observed),
      apiReady: Boolean(gate.apiReady),
      evidenceReady: Boolean(gate.evidenceReady),
      releaseAccepted: Boolean(gate.releaseAccepted),
      hardFail,
      degraded: Boolean(gate.degraded),
      firstFailedCoordinate,
      recommendedNextFile: safeString(gate.recommendedNextFile, file),
      weight: 10,
      passed,
      blockedByChronology: false
    };
  }

  function composeStationBoard(normalized, macroWest, canvas, releasePacket, f21) {
    const index = normalized.authorities.hearthIndex;
    const f8 = normalized.f8;

    const stations = [
      composeStation(STATION_IDS.INDEX_HOST, FILE_GATES.hearthIndex, {
        observed: index.observed,
        apiReady: index.observed,
        evidenceReady: index.indexPairReady && index.carrierHostAdmissibilityReady,
        releaseAccepted: index.carrierHostAdmissibilityReady,
        passed: index.indexPairReady && index.carrierHostAdmissibilityReady && index.handoffToRouteConductor,
        firstFailedCoordinate: index.holdReason || index.carrierHostAdmissibilityHoldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
        recommendedNextFile: FILE_GATES.hearthIndex
      }),

      composeStation(STATION_IDS.ROUTE_F8, FILE, {
        observed: f8.routeConductorMarkerPresent,
        apiReady: f8.routeConductorApiPresent,
        evidenceReady: f8.f8SelfDutySatisfied,
        passed: f8.f8SelfDutySatisfied,
        firstFailedCoordinate: f8.firstFailedCoordinate,
        recommendedNextFile: FILE
      }),

      composeStation(STATION_IDS.MACRO_WEST, FILE_GATES.macroWest, {
        observed: macroWest.macroWestAuthorityObserved,
        apiReady: macroWest.macroWestAuthorityObserved,
        evidenceReady: macroWest.macroWestAdmissibilityObserved,
        releaseAccepted: macroWest.westCanvasReleaseApproved,
        hardFail: macroWest.westHardBlock,
        degraded: macroWest.westDegradedForwardApproved,
        passed: macroWest.macroWestAdmissibilityObserved && macroWest.westCanvasReleaseApproved && macroWest.westForwardAllowed && !macroWest.westHardBlock,
        firstFailedCoordinate: macroWest.westFirstFailedCoordinate,
        recommendedNextFile: FILE_GATES.macroWest
      }),

      composeStation(STATION_IDS.CANVAS_PARENT_CURRENT, FILE_GATES.canvas, {
        observed: canvas.currentCanvasParentObserved,
        apiReady: canvas.parentBootMethodAvailable,
        evidenceReady: canvas.currentCanvasParentObserved && canvas.parentBootMethodAvailable,
        releaseAccepted: false,
        hardFail: canvas.canvasParentV2Observed,
        passed: canvas.currentCanvasParentObserved && canvas.parentBootMethodAvailable && !canvas.canvasParentV2Observed,
        firstFailedCoordinate: canvas.canvasParentV2Observed ? "STALE_CANVAS_PARENT_V2_OBSERVED" : "WAITING_CURRENT_CANVAS_PARENT",
        recommendedNextFile: FILE_GATES.canvas
      }),

      composeStation(STATION_IDS.CANVAS_PARENT_RELEASE, FILE_GATES.canvas, {
        observed: releasePacket.canvasReleaseAuthorized,
        apiReady: canvas.parentBootMethodAvailable,
        evidenceReady: canvas.canvasParentReleaseAccepted,
        releaseAccepted: canvas.canvasParentReleaseAccepted,
        passed: releasePacket.canvasReleaseAuthorized && canvas.canvasParentReleaseAccepted && canvas.parentReleaseLawful,
        firstFailedCoordinate: releasePacket.canvasReleaseAuthorized
          ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
          : releasePacket.canvasReleaseHeldReason,
        recommendedNextFile: FILE_GATES.canvas
      }),

      composeStation(STATION_IDS.CANVAS_EAST, FILE_GATES.canvasEast, {
        observed: canvas.canvasEastApiReady,
        apiReady: canvas.canvasEastApiReady,
        evidenceReady: canvas.canvasEastEvidenceReady,
        passed: canvas.canvasParentReleaseAccepted && canvas.canvasEastApiReady && canvas.canvasEastEvidenceReady,
        firstFailedCoordinate: canvas.canvasEastApiReady ? "WAITING_CANVAS_EAST_ATLAS_EVIDENCE" : "WAITING_CANVAS_EAST_API",
        recommendedNextFile: FILE_GATES.canvasEast
      }),

      composeStation(STATION_IDS.CANVAS_WEST, FILE_GATES.canvasWest, {
        observed: canvas.canvasWestApiReady,
        apiReady: canvas.canvasWestApiReady,
        evidenceReady: canvas.canvasWestInspectionReady,
        passed: canvas.canvasWestApiReady && canvas.canvasWestInspectionReady,
        firstFailedCoordinate: canvas.canvasWestApiReady ? "WAITING_CANVAS_WEST_INSPECTION_EVIDENCE" : "WAITING_CANVAS_WEST_API",
        recommendedNextFile: FILE_GATES.canvasWest
      }),

      composeStation(STATION_IDS.CANVAS_SOUTH, FILE_GATES.canvasSouth, {
        observed: canvas.canvasSouthApiReady,
        apiReady: canvas.canvasSouthApiReady,
        evidenceReady: canvas.canvasSouthVisibleProofReady,
        hardFail: canvas.f13HardFail || canvas.southHardFailObserved,
        degraded: canvas.southSoftProofObserved && !canvas.southStrictProofObserved,
        passed: canvas.canvasSouthApiReady && canvas.canvasSouthVisibleProofReady && !canvas.f13HardFail,
        firstFailedCoordinate: canvas.f13HardFail ? "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL" : "WAITING_CANVAS_SOUTH_VISIBLE_PROOF",
        recommendedNextFile: FILE_GATES.canvasSouth
      }),

      composeStation(STATION_IDS.CANVAS_F13, FILE_GATES.canvas, {
        observed: canvas.f13CanvasReadinessObserved,
        apiReady: canvas.allCanvasChildrenApiReady,
        evidenceReady: canvas.f13CanvasEvidenceComplete,
        hardFail: canvas.f13HardFail,
        degraded: canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict,
        passed: canvas.canvasGateReady && canvas.f13CanvasEvidenceComplete && !canvas.f13HardFail,
        firstFailedCoordinate: canvas.f13StrictEvidenceGap,
        recommendedNextFile: canvas.f13StrictEvidenceRepairTarget || FILE_GATES.canvas
      }),

      composeStation(STATION_IDS.NORTH_F21, FILE_GATES.north, {
        observed: normalized.authorities.north.observed,
        apiReady: normalized.authorities.north.observed,
        evidenceReady: f21.f21EligibleForNorth,
        releaseAccepted: false,
        passed: f21.f21EligibleForNorth,
        firstFailedCoordinate: f21.firstFailedCoordinate || "WAITING_NORTH_F21_ELIGIBILITY_BOUNDARY",
        recommendedNextFile: FILE_GATES.north
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

    const board = {
      centralStationSwitchboardActive: true,
      stationBoardComposed: true,
      switchPriorityApplied: true,
      rawSignalsNormalized: true,
      chronologicalGateCount: stations.length,
      chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: firstFailed ? firstFailed.stationId : "NONE",
      chronologicalFirstFailedCoordinate: firstFailed ? firstFailed.firstFailedCoordinate : "NONE_CHRONOLOGY_COMPLETE",
      stations,
      composedAt: nowIso()
    };

    state.stationBoard = clonePlain(board);
    state.stationBoardComposed = true;
    state.switchPriorityApplied = true;
    state.rawSignalsNormalized = true;

    return board;
  }

  function computeChronologyFirstFibonacci(board, canvas) {
    const chronologicalGateCount = safeNumber(board.chronologicalGateCount, 10);
    const chronologicalGatesSatisfied = safeNumber(board.chronologicalGatesSatisfied, 0);
    const score = Math.round((chronologicalGatesSatisfied / chronologicalGateCount) * 100);

    const hardFailStation = (board.stations || []).find((station) => station.hardFail);
    const gatesThroughF13Passed = chronologicalGatesSatisfied >= 9;
    const strictComplete = Boolean(canvas.f13CanvasEvidenceStrict && canvas.f13CanvasEvidenceComplete && !canvas.f13HardFail);
    const degradedComplete = Boolean(canvas.f13CanvasEvidenceDegraded && canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict && !canvas.f13HardFail);

    const pass = Boolean(
      chronologicalGatesSatisfied === chronologicalGateCount &&
      strictComplete &&
      !hardFailStation &&
      canvas.canvasParentReleaseAccepted
    );

    const degraded = Boolean(
      !pass &&
      gatesThroughF13Passed &&
      degradedComplete &&
      !hardFailStation &&
      canvas.canvasParentReleaseAccepted
    );

    const hardFail = Boolean(hardFailStation || canvas.f13HardFail);

    const holdReason = pass
      ? "NONE_FIBONACCI_SYNCHRONIZATION_STRICT_PASS"
      : hardFail
        ? (hardFailStation ? hardFailStation.firstFailedCoordinate : "F13_HARD_FAIL")
        : !canvas.canvasParentReleaseAccepted
          ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
          : board.chronologicalFirstFailedCoordinate;

    return {
      fibonacciSynchronizationChronologyFirst: true,
      chronologicalGateCount,
      chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: board.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: board.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationScore: score,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationSatisfied: score,
      fibonacciSynchronizationPassed: pass,
      fibonacciSynchronizationDegraded: degraded,
      fibonacciSynchronizationHardFail: hardFail,
      fibonacciSynchronizationHoldReason: holdReason
    };
  }

  function resolveNewsState(index, f8, macroWest, canvas) {
    const indexGateReady = Boolean(index.indexPairReady && index.carrierHostAdmissibilityReady);
    const routeF8GateReady = Boolean(f8.f8SelfDutySatisfied);
    const macroWestGateReady = Boolean(macroWest.macroWestAdmissibilityObserved && macroWest.westCanvasReleaseApproved && macroWest.westForwardAllowed && !macroWest.westHardBlock);
    const canvasParentGateReady = Boolean(canvas.currentCanvasParentObserved && canvas.parentBootMethodAvailable && !canvas.canvasParentV2Observed);
    const canvasParentReleaseGateReady = Boolean(canvas.canvasParentReleaseAccepted && canvas.parentReleaseLawful);
    const canvasEastGateReady = Boolean(canvas.canvasEastApiReady && canvas.canvasEastEvidenceReady);
    const canvasWestGateReady = Boolean(canvas.canvasWestApiReady && canvas.canvasWestInspectionReady);
    const canvasSouthGateReady = Boolean(canvas.canvasSouthApiReady && canvas.canvasSouthVisibleProofReady && !canvas.f13HardFail);
    const canvasGateReady = Boolean(canvas.canvasGateReady);

    const baseBeforeF21 = Boolean(
      indexGateReady &&
      routeF8GateReady &&
      macroWestGateReady &&
      canvasParentGateReady &&
      canvasParentReleaseGateReady &&
      canvasEastGateReady &&
      canvasWestGateReady &&
      canvasSouthGateReady &&
      canvasGateReady &&
      !canvas.f13HardFail
    );

    return {
      routeNewsObserved: true,
      routeNewsComposed: true,
      indexGateReady,
      routeF8GateReady,
      macroWestGateReady,
      canvasParentGateReady,
      canvasParentReleaseGateReady,
      canvasEastGateReady,
      canvasWestGateReady,
      canvasSouthGateReady,
      canvasGateReady,

      northGateReady: true,
      eastGateReady: true,
      westGateReady: macroWestGateReady,
      southGateReady: routeF8GateReady,

      newsGatePassedBeforeF21: Boolean(baseBeforeF21 && canvas.f13CanvasEvidenceStrict),
      newsGateDegradedBeforeF21: Boolean(baseBeforeF21 && canvas.f13CanvasEvidenceDegraded && !canvas.f13CanvasEvidenceStrict)
    };
  }

  function resolveF21Eligibility(index, f8, macroWest, canvas, news) {
    const northReceipt = readNorthAuthority().receipt || {};
    const northAlreadyLatched = Boolean(
      safeBool(northReceipt.completionLatched, false) ||
      safeBool(northReceipt.finalCompletionLatched, false) ||
      datasetValue("hearthSouthCompletionLatched") === "true"
    );

    const northAlreadyLatchedDegraded = Boolean(
      safeBool(northReceipt.degradedCompletionLatched, false) ||
      datasetValue("hearthSouthDegradedCompletionLatched") === "true"
    );

    const eligible = Boolean(
      index.indexPairReady &&
      index.carrierHostAdmissibilityReady &&
      f8.f8SelfDutySatisfied &&
      macroWest.macroWestAdmissibilityObserved &&
      macroWest.westCanvasReleaseApproved &&
      macroWest.westForwardAllowed &&
      !macroWest.westHardBlock &&
      canvas.currentCanvasParentObserved &&
      canvas.parentBootMethodAvailable &&
      canvas.canvasParentReleaseAccepted &&
      canvas.canvasGateReady &&
      canvas.f13CanvasEvidenceComplete &&
      !canvas.f13HardFail &&
      (news.newsGatePassedBeforeF21 || news.newsGateDegradedBeforeF21)
    );

    const failed = eligible
      ? "NONE_F21_ELIGIBLE_FOR_NORTH"
      : !index.indexPairReady || !index.carrierHostAdmissibilityReady
        ? index.holdReason || index.carrierHostAdmissibilityHoldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY"
        : !f8.f8SelfDutySatisfied
          ? "WAITING_F8_SELF_DUTY"
          : !macroWest.macroWestAdmissibilityObserved || !macroWest.westCanvasReleaseApproved
            ? "WAITING_MACRO_WEST_CANVAS_RELEASE"
            : !canvas.currentCanvasParentObserved
              ? "WAITING_CURRENT_CANVAS_PARENT"
              : !canvas.canvasParentReleaseAccepted
                ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
                : !canvas.canvasGateReady
                  ? "WAITING_CANVAS_GATE"
                  : !canvas.f13CanvasEvidenceComplete
                    ? "WAITING_CANVAS_F13_EVIDENCE"
                    : canvas.f13HardFail
                      ? "CANVAS_F13_HARD_FAIL"
                      : "WAITING_NEWS_GATE_BEFORE_F21";

    const northRepairRequired = Boolean(
      canvas.f13CanvasEvidenceStrict &&
      eligible &&
      !northAlreadyLatched &&
      state.f21EligibilitySubmittedToNorth &&
      state.f21EligibilitySubmissionCount > 0
    );

    return {
      f21EligibleForNorth: eligible,
      f21SubmittedToNorth: state.f21SubmittedToNorth,
      f21EligibilitySubmittedToNorth: state.f21EligibilitySubmittedToNorth,
      f21EligibilitySubmittedAt: state.f21EligibilitySubmittedAt,
      f21EligibilitySubmissionCount: state.f21EligibilitySubmissionCount,
      f21LatchMode: northAlreadyLatched
        ? northAlreadyLatchedDegraded
          ? "DEGRADED_LATCHED_BY_NORTH"
          : "FULL_LATCHED_BY_NORTH"
        : eligible
          ? canvas.f13CanvasEvidenceStrict
            ? "READY_FOR_NORTH_STRICT_F21_LATCH"
            : "READY_FOR_NORTH_DEGRADED_F21_LATCH"
          : failed,
      completionLatched: northAlreadyLatched,
      degradedCompletionLatched: northAlreadyLatchedDegraded,
      readyTextAllowed: northAlreadyLatched,
      f21NorthLatchOnly: true,
      routeMaySubmitF21EligibilityOnly: true,
      northRepairRequired,
      northRepairReason: northRepairRequired ? "STRICT_F21_ELIGIBILITY_SUBMITTED_BUT_NORTH_NOT_LATCHED" : "NONE",
      firstFailedCoordinate: failed,
      visualPassClaimed: false
    };
  }

  function selectSwitchboardNextFile(board, index, f8, macroWest, canvas, f21, releasePacket) {
    if (!index.indexPairReady || !index.carrierHostAdmissibilityReady || !index.handoffToRouteConductor) {
      return FILE_GATES.hearthIndex;
    }

    if (!f8.f8SelfDutySatisfied) {
      return FILE;
    }

    if (!macroWest.macroWestAuthorityObserved || !macroWest.macroWestAdmissibilityObserved || macroWest.westHardBlock || !macroWest.westCanvasReleaseApproved || !macroWest.westForwardAllowed) {
      return FILE_GATES.macroWest;
    }

    if (!canvas.currentCanvasParentObserved || !canvas.parentBootMethodAvailable || canvas.canvasParentV2Observed) {
      return FILE_GATES.canvas;
    }

    if (releasePacket.canvasReleaseAuthorized && !canvas.canvasParentReleaseAccepted) {
      return FILE_GATES.canvas;
    }

    if (!canvas.canvasEastApiReady || !canvas.canvasEastEvidenceReady) {
      return FILE_GATES.canvasEast;
    }

    if (!canvas.canvasWestApiReady || !canvas.canvasWestInspectionReady) {
      return FILE_GATES.canvasWest;
    }

    if (!canvas.canvasSouthApiReady || !canvas.canvasSouthVisibleProofReady || canvas.f13HardFail) {
      return FILE_GATES.canvasSouth;
    }

    if (canvas.f13CanvasEvidenceComplete && !canvas.f13CanvasEvidenceStrict) {
      return canvas.f13StrictEvidenceRepairTarget || FILE_GATES.canvasSouth;
    }

    if (canvas.f13CanvasEvidenceStrict && f21.f21EligibleForNorth) {
      return FILE_GATES.north;
    }

    const failedStation = (board.stations || []).find((station) => station.blockedByChronology === false && station.passed === false);
    return failedStation ? failedStation.recommendedNextFile : FILE;
  }

  function applyAntiFalseSynchronization(packet) {
    const p = isObject(packet) ? packet : {};

    if (p.chronologicalGatesSatisfied < p.chronologicalGateCount) {
      p.fibonacciSynchronizationPassed = false;
    }

    if (p.canvasParentReleaseAccepted === false) {
      p.fibonacciSynchronizationPassed = false;
      p.newsGatePassedBeforeF21 = false;
      p.newsGateDegradedBeforeF21 = false;
    }

    if (p.canvasReleaseAuthorized === true && p.canvasParentReleaseAccepted === false) {
      p.firstFailedCoordinate = "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE";
      p.recommendedNextFile = FILE_GATES.canvas;
      p.recommendedNextRenewalTarget = FILE_GATES.canvas;
      p.fibonacciSynchronizationHoldReason = "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE";
      p.downstreamRecommendationBlockedUntilParentAccepted = true;
      p.parentReleaseGatePrecedesChildDispatch = true;
    }

    p.readyTextAllowed = false;
    p.completionLatched = false;
    p.f21ClaimedByRouteConductor = false;
    p.generatedImage = false;
    p.graphicBox = false;
    p.webGL = false;
    p.visualPassClaimed = false;

    return p;
  }

  function composeProofBody(index, f8, macroWest, canvas, f21, stationBoard) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      proofBodyComposed: true,
      proofBodyAvailable: true,

      indexPairProof: {
        present: index.observed,
        observed: index.observed,
        ready: index.indexPairReady,
        shellAccepted: index.shellAccepted,
        runtimeReleaseAuthorized: index.runtimeReleaseAuthorized,
        runtimeReleaseComplete: index.runtimeReleaseComplete,
        mountPresent: index.mountPresent,
        controlsBound: index.controlsBound,
        holdReason: index.holdReason,
        carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady
      },

      routeConductorProof: {
        markerPresent: f8.routeConductorMarkerPresent,
        apiPresent: f8.routeConductorApiPresent,
        receiptPresent: f8.routeConductorReceiptPresent,
        runtimeActive: f8.routeConductorRuntimeActive,
        hydrated: f8.routeConductorHydrated,
        f8SelfDutySatisfied: f8.f8SelfDutySatisfied
      },

      macroWestProof: {
        authorityObserved: macroWest.macroWestAuthorityObserved,
        admissibilityObserved: macroWest.macroWestAdmissibilityObserved,
        decision: macroWest.westDecision,
        gapClass: macroWest.westGapClass,
        hardBlock: macroWest.westHardBlock,
        forwardAllowed: macroWest.westForwardAllowed,
        canvasReleaseApproved: macroWest.westCanvasReleaseApproved
      },

      canvasParentProof: {
        currentCanvasParentObserved: canvas.currentCanvasParentObserved,
        currentCanvasParentContractObserved: canvas.currentCanvasParentContractObserved,
        currentCanvasParentContract: canvas.currentCanvasParentContract,
        canvasParentV2Observed: canvas.canvasParentV2Observed,
        canvasParentV2Superseded: canvas.canvasParentV2Superseded,
        parentBootMethodAvailable: canvas.parentBootMethodAvailable,
        canvasParentReleaseAccepted: canvas.canvasParentReleaseAccepted,
        parentReleaseLawful: canvas.parentReleaseLawful
      },

      canvasChildrenProof: {
        canvasEastApiReady: canvas.canvasEastApiReady,
        canvasEastEvidenceReady: canvas.canvasEastEvidenceReady,
        canvasWestApiReady: canvas.canvasWestApiReady,
        canvasWestInspectionReady: canvas.canvasWestInspectionReady,
        canvasSouthApiReady: canvas.canvasSouthApiReady,
        canvasSouthVisibleProofReady: canvas.canvasSouthVisibleProofReady,
        allCanvasChildrenApiReady: canvas.allCanvasChildrenApiReady,
        allCanvasChildrenEvidenceReady: canvas.allCanvasChildrenEvidenceReady,
        allCanvasChildrenReady: canvas.allCanvasChildrenReady
      },

      f13ProofSummary: {
        f13CanvasReadinessObserved: canvas.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: canvas.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: canvas.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: canvas.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: canvas.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: canvas.f13CanvasEvidenceComplete,
        f13HardFail: canvas.f13HardFail,
        f13StrictEvidenceGap: canvas.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: canvas.f13StrictEvidenceRepairTarget
      },

      f21EligibilitySummary: {
        f21EligibleForNorth: f21.f21EligibleForNorth,
        f21SubmittedToNorth: f21.f21SubmittedToNorth,
        f21LatchMode: f21.f21LatchMode,
        completionLatched: f21.completionLatched,
        degradedCompletionLatched: f21.degradedCompletionLatched,
        northRepairRequired: f21.northRepairRequired,
        northRepairReason: f21.northRepairReason
      },

      switchboardProof: clonePlain(stationBoard),

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function composeRoutePrimaryPacket(input = {}) {
    try {
      const normalized = input && input.normalizedAt ? input : normalizeRouteConductorInput(input);
      const cycle = resolveRouteCycle(normalized);
      const index = normalized.authorities.hearthIndex;
      const f8 = normalized.f8;
      const macroWest = classifyMacroWestAdmissibility(normalized);
      const releasePacketSeed = composeCanvasReleasePacket(normalized, macroWest, readCanvasEvidence(Boolean(macroWest.westCanvasReleaseApproved)));
      const canvas = readCanvasEvidence(Boolean(releasePacketSeed.canvasReleaseAuthorized));
      const news = resolveNewsState(index, f8, macroWest, canvas);
      const f21 = resolveF21Eligibility(index, f8, macroWest, canvas, news);
      const stationBoard = composeStationBoard(normalized, macroWest, canvas, releasePacketSeed, f21);
      const fibonacci = computeChronologyFirstFibonacci(stationBoard, canvas);
      const recommendedNextFile = selectSwitchboardNextFile(stationBoard, index, f8, macroWest, canvas, f21, releasePacketSeed);
      const proofBody = composeProofBody(index, f8, macroWest, canvas, f21, stationBoard);

      const firstFailedCoordinate =
        releasePacketSeed.canvasReleaseAuthorized && !canvas.canvasParentReleaseAccepted
          ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
          : stationBoard.chronologicalFirstFailedCoordinate !== "NONE_CHRONOLOGY_COMPLETE"
            ? stationBoard.chronologicalFirstFailedCoordinate
            : f21.firstFailedCoordinate || "NONE_SWITCHBOARD_COMPLETE";

      const degradedFunctional = Boolean(canvas.degradedF13IsFunctional);
      const strictPending = Boolean(canvas.strictVisualProofPending);

      const postgameStatus =
        releasePacketSeed.canvasReleaseAuthorized && !canvas.canvasParentReleaseAccepted
          ? "CANVAS_RELEASE_AUTHORIZED_WAITING_PARENT_ACCEPTANCE"
          : f21.completionLatched && canvas.f13CanvasEvidenceStrict
            ? f21.degradedCompletionLatched
              ? "READY_DEGRADED_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
              : "READY_PLANET_VISIBLE_DIAGNOSTIC_AVAILABLE"
            : degradedFunctional || strictPending
              ? "FUNCTIONAL_DEGRADED_F13_STRICT_PROOF_PENDING"
              : f21.f21EligibleForNorth
                ? "WAITING_NORTH_F21_LATCH"
                : canvas.f13CanvasEvidenceComplete
                  ? "CANVAS_F13_EVIDENCE_COMPLETE_WAITING_NORTH"
                  : releasePacketSeed.canvasReleaseAuthorized
                    ? "CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST"
                    : cycle.cycleNumber === 2
                      ? "CYCLE_2_WAITING_MACRO_WEST_ADMISSIBILITY_OR_CANVAS_RELEASE"
                      : "CYCLE_1_RETURNING_TO_NORTH";

      const packet = {
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        baselineContract: BASELINE_CONTRACT,
        version: VERSION,
        file: FILE,
        route: ROUTE,
        role: state.role,

        centralStationSwitchboardActive: true,
        stationBoardComposed: true,
        switchPriorityApplied: true,
        rawSignalsNormalized: true,

        twoFileIntegrationActive: true,
        carrierHostAdmissibilityConsumptionActive: true,
        routeConductorPrimaryGateActive: true,
        strictF13DownstreamAlignmentActive: true,
        canvasParentChildReconciliationActive: true,
        cycleAwareRoutingActive: true,
        macroWestAdmissibilityConsumptionActive: true,
        canvasReleaseFirewallActive: true,

        newsAlignmentProtocolActive: true,
        newsChronologicalOrderLocked: true,
        fibonacciSynchronizationChronologyFirst: true,
        canvasParentReleaseAcceptanceGateActive: true,
        downstreamRecommendationBlockedUntilParentAccepted: true,
        parentReleaseGatePrecedesChildDispatch: true,
        staleCanvasV2FalsePositiveBlocked: true,

        cycleOneIsPosition: true,
        cycleTwoIsCoordination: true,
        cycleNumber: cycle.cycleNumber,
        cycleRoute: cycle.cycleRoute,
        activeCycleNumber: cycle.cycleNumber,
        activeCycleRoute: cycle.cycleRoute,
        cycleKnown: cycle.cycleKnown,
        receivedFrom: cycle.receivedFrom,
        returnTo: cycle.returnTo,
        handoffTo: releasePacketSeed.canvasReleaseAuthorized ? CARDINALS.CANVAS : cycle.handoffTo,

        activeCardinal: CARDINALS.SOUTH,
        activeFileGate: FILE,
        activeFibonacci: "F8",
        activeFibonacciRank: 8,
        activeStageId: "F8_SOUTH_SELF_DUTY",
        activeGearId: "F8_SOUTH_SELF_DUTY",
        activeGearLabel: "F8_SOUTH_SELF_DUTY",
        activeNewsGate: CARDINALS.SOUTH,

        indexFile: FILE_GATES.hearthIndex,
        indexAuthorityObserved: index.observed,
        indexPairObserved: index.observed,
        indexPairReady: index.indexPairReady,
        indexShellAccepted: index.shellAccepted,
        indexRuntimeReleaseAuthorized: index.runtimeReleaseAuthorized,
        indexRuntimeReleaseComplete: index.runtimeReleaseComplete,
        indexMountPresent: index.mountPresent,
        indexControlsBound: index.controlsBound,
        indexMissingHooks: (index.missingHooks || []).join(","),
        indexPairHoldReason: index.holdReason,

        carrierHostAdmissibilityObserved: index.carrierHostAdmissibilityObserved,
        carrierHostAdmissibilityReady: index.carrierHostAdmissibilityReady,
        carrierHostAdmissibilityPacketReady: index.carrierHostAdmissibilityPacketReady,
        carrierHostAdmissibilityPacketPublished: index.carrierHostAdmissibilityPacketPublished,
        carrierHostAdmissibilityHoldReason: index.carrierHostAdmissibilityHoldReason,
        indexMacroWestCandidateReady: index.indexMacroWestCandidateReady,
        indexHandoffToRouteConductor: index.handoffToRouteConductor,
        routeConductorHandoffPacketReady: index.routeConductorHandoffPacketReady,

        routeConductorMarkerPresent: f8.routeConductorMarkerPresent,
        routeConductorApiPresent: f8.routeConductorApiPresent,
        routeConductorReceiptPresent: f8.routeConductorReceiptPresent,
        routeConductorRuntimeActive: f8.routeConductorRuntimeActive,
        routeConductorHydrated: f8.routeConductorHydrated,
        f8SelfDutySatisfied: f8.f8SelfDutySatisfied,

        northAuthorityObserved: normalized.authorities.north.observed,
        eastAuthorityObserved: normalized.authorities.east.observed,
        westAuthorityObserved: normalized.authorities.west.observed,
        macroWestAuthorityObserved: macroWest.macroWestAuthorityObserved,
        southAuthorityObserved: normalized.authorities.south.observed,
        hearthIndexObserved: index.observed,

        macroWestAdmissibilityObserved: macroWest.macroWestAdmissibilityObserved,
        macroWestMethodUsed: macroWest.macroWestMethodUsed,
        westDecision: macroWest.westDecision,
        westGapClass: macroWest.westGapClass,
        westGapSeverity: macroWest.westGapSeverity,
        westHardBlock: macroWest.westHardBlock,
        westForwardAllowed: macroWest.westForwardAllowed,
        westCanvasReleaseApproved: macroWest.westCanvasReleaseApproved,
        westDegradedForwardApproved: macroWest.westDegradedForwardApproved,
        westFirstFailedCoordinate: macroWest.westFirstFailedCoordinate,
        westRecommendedNextRenewalTarget: macroWest.westRecommendedNextRenewalTarget,

        canvasAuthorityObserved: Boolean(canvas.authority),
        currentCanvasParentObserved: canvas.currentCanvasParentObserved,
        currentCanvasParentContractObserved: canvas.currentCanvasParentContractObserved,
        currentCanvasParentContract: canvas.currentCanvasParentContract,
        canvasParentV2Observed: canvas.canvasParentV2Observed,
        canvasParentV2Superseded: canvas.canvasParentV2Superseded,
        canvasParentBootMethodAvailable: canvas.parentBootMethodAvailable,
        canvasParentCarrierSafe: canvas.parentCarrierSafe,
        canvasParentCarrierSafeObservedOnly: canvas.parentCarrierObservedOnly,
        canvasStructuralCarrierOwnedByCanvas: true,
        parentCarrierSafeIsNotMacroWestPrerequisite: true,
        canvasParentReleaseAccepted: canvas.canvasParentReleaseAccepted,
        canvasParentReleaseObserved: canvas.canvasParentReleaseObserved,
        parentReleaseLawful: canvas.parentReleaseLawful,
        parentReleasePacketSentToEast: canvas.parentReleasePacketSentToEast,
        parentReleasePacketLawful: canvas.parentReleasePacketLawful,

        canvasReleaseAuthorized: releasePacketSeed.canvasReleaseAuthorized,
        canvasReleasePacketReady: releasePacketSeed.canvasReleasePacketReady,
        canvasReleaseRequiresWestAudit: true,
        canvasReleaseRequiresMacroWest: true,
        canvasReleaseHeldReason: releasePacketSeed.canvasReleaseHeldReason,

        canvasEastApiReady: canvas.canvasEastApiReady,
        canvasWestApiReady: canvas.canvasWestApiReady,
        canvasSouthApiReady: canvas.canvasSouthApiReady,
        allCanvasChildrenApiReady: canvas.allCanvasChildrenApiReady,
        canvasEastEvidenceReady: canvas.canvasEastEvidenceReady,
        canvasWestInspectionReady: canvas.canvasWestInspectionReady,
        canvasSouthVisibleProofReady: canvas.canvasSouthVisibleProofReady,
        allCanvasChildrenEvidenceReady: canvas.allCanvasChildrenEvidenceReady,
        allCanvasChildrenReady: canvas.allCanvasChildrenReady,

        f13ProofBodyAvailable: true,
        f13CanvasReadinessObserved: canvas.f13CanvasReadinessObserved,
        f13VisibleEvidenceAvailable: canvas.f13VisibleEvidenceAvailable,
        f13InspectEvidenceAvailable: canvas.f13InspectEvidenceAvailable,
        f13CanvasEvidenceStrict: canvas.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: canvas.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: canvas.f13CanvasEvidenceComplete,
        f13HardFail: canvas.f13HardFail,
        f13StrictEvidenceGap: canvas.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: canvas.f13StrictEvidenceRepairTarget,

        southStrictProofObserved: canvas.southStrictProofObserved,
        southSoftProofObserved: canvas.southSoftProofObserved,
        southHardFailObserved: canvas.southHardFailObserved,
        southProofStale: canvas.visibleProofStale,
        parentStrictReadMismatch: false,
        degradedF13IsFunctional: degradedFunctional,
        functionalPageObserved: canvas.functionalPageObserved,
        strictVisualProofPending: strictPending,

        indexGateReady: news.indexGateReady,
        routeF8GateReady: news.routeF8GateReady,
        macroWestGateReady: news.macroWestGateReady,
        canvasParentGateReady: news.canvasParentGateReady,
        canvasParentReleaseGateReady: news.canvasParentReleaseGateReady,
        canvasEastGateReady: news.canvasEastGateReady,
        canvasWestGateReady: news.canvasWestGateReady,
        canvasSouthGateReady: news.canvasSouthGateReady,
        canvasGateReady: news.canvasGateReady,
        northGateReady: news.northGateReady,
        eastGateReady: news.eastGateReady,
        westGateReady: news.westGateReady,
        southGateReady: news.southGateReady,
        newsGatePassedBeforeF21: news.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: news.newsGateDegradedBeforeF21,
        routeNewsObserved: news.routeNewsObserved,
        routeNewsComposed: news.routeNewsComposed,

        ...fibonacci,

        f21EligibleForNorth: f21.f21EligibleForNorth,
        f21SubmittedToNorth: f21.f21SubmittedToNorth,
        f21EligibilitySubmittedToNorth: f21.f21EligibilitySubmittedToNorth,
        f21EligibilitySubmittedAt: f21.f21EligibilitySubmittedAt,
        f21EligibilitySubmissionCount: f21.f21EligibilitySubmissionCount,
        f21LatchMode: f21.f21LatchMode,
        completionLatched: false,
        degradedCompletionLatched: f21.degradedCompletionLatched,
        readyTextAllowed: false,
        f21NorthLatchOnly: true,
        routeMaySubmitF21EligibilityOnly: true,
        f21ClaimedByRouteConductor: false,
        northRepairRequired: f21.northRepairRequired,
        northRepairReason: f21.northRepairReason,

        stationBoard,
        canvasReleasePacket: releasePacketSeed,
        macroWestAdmissibility: macroWest,
        proofBody,

        proofBodyAvailable: true,
        proofBodyComposed: true,
        outputSpreadAvailable: normalized.outputSpreadAvailable || true,
        outputSpreadComposed: true,
        visibleStateAvailable: true,
        visibleStateComposed: true,
        receiptAvailable: true,
        receiptComposed: true,
        northReturnPacketReady: cycle.cycleNumber === 1,
        westHandoffPacketReady: cycle.cycleNumber === 2,

        postgameStatus,
        firstFailedCoordinate,
        recommendedNextFile,
        recommendedNextRenewalTarget: recommendedNextFile,
        canvasNextAuditTarget: recommendedNextFile,

        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false,
        composedAt: nowIso()
      };

      packet.visibleState = composeVisibleStateFromPrimary(packet);
      return applyAntiFalseSynchronization(packet);
    } catch (error) {
      recordError("COMPOSE_ROUTE_PRIMARY_PACKET_FAILED", error);
      return composeFallbackRoutePrimaryPacket(error);
    }
  }

  function composeFallbackRoutePrimaryPacket(error = null) {
    const message = error && error.message ? error.message : safeString(error, "route-conductor-switchboard-fallback");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      centralStationSwitchboardActive: true,
      stationBoardComposed: false,
      switchPriorityApplied: false,
      rawSignalsNormalized: false,
      routeConductorFallbackUsed: true,
      routeConductorCompositionOk: false,
      routeConductorCompositionError: message,

      cycleNumber: 1,
      cycleRoute: CYCLE_ROUTES.CYCLE_1,
      activeCycleNumber: 1,
      activeCycleRoute: CYCLE_ROUTES.CYCLE_1,
      receivedFrom: CARDINALS.UNKNOWN,
      returnTo: CARDINALS.NORTH,
      handoffTo: "",

      activeCardinal: CARDINALS.SOUTH,
      activeFileGate: FILE,
      activeFibonacci: "F8",
      activeFibonacciRank: 8,
      activeStageId: "F8_SOUTH_SELF_DUTY",
      activeGearId: "F8_SOUTH_SELF_DUTY",
      activeNewsGate: CARDINALS.SOUTH,

      canvasReleaseAuthorized: false,
      canvasReleaseHeldReason: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      currentCanvasParentObserved: false,
      canvasParentReleaseAccepted: false,
      f13CanvasEvidenceStrict: false,
      f13CanvasEvidenceDegraded: false,
      f13CanvasEvidenceComplete: false,
      f13HardFail: false,

      chronologicalGateCount: 10,
      chronologicalGatesSatisfied: 0,
      chronologicalFirstFailedGate: "ROUTE_COMPOSITION",
      chronologicalFirstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      fibonacciSynchronizationScore: 0,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationSatisfied: 0,
      fibonacciSynchronizationPassed: false,
      fibonacciSynchronizationDegraded: false,
      fibonacciSynchronizationHardFail: false,
      fibonacciSynchronizationHoldReason: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21LatchMode: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      completionLatched: false,
      readyTextAllowed: false,
      f21ClaimedByRouteConductor: false,

      firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_PRIMARY_GATE_COMPOSITION",
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      postgameStatus: "ROUTE_CONDUCTOR_SWITCHBOARD_FALLBACK_ACTIVE",

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };
  }

  function composeVisibleStateFromPrimary(packet) {
    const p = isObject(packet) ? packet : {};

    const visibleProgress = p.completionLatched && p.f13CanvasEvidenceStrict
      ? 100
      : p.f21EligibleForNorth
        ? p.f13CanvasEvidenceStrict ? 94 : 88
        : p.f13CanvasEvidenceComplete
          ? p.f13CanvasEvidenceStrict ? 90 : 82
          : p.canvasParentReleaseAccepted
            ? 78
            : p.canvasReleaseAuthorized
              ? 70
              : p.macroWestAdmissibilityObserved
                ? 62
                : p.carrierHostAdmissibilityReady
                  ? 54
                  : p.indexPairReady
                    ? 48
                    : p.f8SelfDutySatisfied
                      ? 40
                      : p.routeConductorMarkerPresent
                        ? 24
                        : 12;

    const visibleStatusText = p.completionLatched && p.f13CanvasEvidenceStrict
      ? "Ready"
      : p.canvasReleaseAuthorized && !p.canvasParentReleaseAccepted
        ? "Canvas release authorized · waiting Canvas Parent acceptance"
        : p.degradedCompletionLatched || (p.f13CanvasEvidenceComplete && p.f13CanvasEvidenceDegraded && !p.f13CanvasEvidenceStrict)
          ? "Functional page · strict F13 proof pending"
          : !p.indexPairReady || !p.carrierHostAdmissibilityReady
            ? "Waiting index carrier-host admissibility"
            : p.f21EligibleForNorth
              ? "Ready for North latch"
              : p.f13CanvasEvidenceComplete
                ? "Canvas F13 evidence complete"
                : p.canvasReleaseAuthorized
                  ? "Canvas release authorized by Macro West"
                  : p.activeCycleNumber === 2 && !p.macroWestAdmissibilityObserved
                    ? "Cycle 2: waiting Macro West admissibility"
                    : p.activeCycleNumber === 2
                      ? "Cycle 2: Macro West hold"
                      : "Cycle 1: returning proof to North";

    return {
      activeCycleNumber: p.activeCycleNumber,
      activeCycleRoute: p.activeCycleRoute,
      activeFileGate: p.activeFileGate,
      activeCardinal: CARDINALS.SOUTH,
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
      indexPairReady: p.indexPairReady,
      carrierHostAdmissibilityReady: p.carrierHostAdmissibilityReady,
      macroWestAdmissibilityObserved: p.macroWestAdmissibilityObserved,
      westDecision: p.westDecision,
      canvasReleaseAuthorized: p.canvasReleaseAuthorized,
      canvasParentReleaseAccepted: p.canvasParentReleaseAccepted,
      f13CanvasEvidenceStrict: p.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: p.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: p.f13CanvasEvidenceComplete,
      f13StrictEvidenceGap: p.f13StrictEvidenceGap,
      fibonacciSynchronizationScore: p.fibonacciSynchronizationScore,
      fibonacciSynchronizationPassed: p.fibonacciSynchronizationPassed,
      completionLatched: false,
      visualPassClaimed: false
    };
  }

  function updateStateFromPacket(packet) {
    const p = isObject(packet) ? packet : composeFallbackRoutePrimaryPacket();

    state.currentPacket = clonePlain(p);
    state.currentReceipt = composeRouteReceipt(p);
    state.currentReceiptText = composeReceiptText(state.currentReceipt);

    Object.assign(state, {
      activeCycleNumber: p.activeCycleNumber || p.cycleNumber || 1,
      activeCycleRoute: p.activeCycleRoute || p.cycleRoute || CYCLE_ROUTES.CYCLE_1,
      receivedFrom: p.receivedFrom || CARDINALS.UNKNOWN,
      returnTo: p.returnTo || "",
      handoffTo: p.handoffTo || "",
      activeCardinal: CARDINALS.SOUTH,
      activeFileGate: FILE,
      activeNewsGate: CARDINALS.SOUTH,
      activeFibonacci: "F8",
      activeFibonacciRank: 8,
      activeStageId: "F8_SOUTH_SELF_DUTY",
      activeGearId: "F8_SOUTH_SELF_DUTY",

      stationBoardComposed: p.stationBoardComposed === true,
      switchPriorityApplied: p.switchPriorityApplied === true,
      rawSignalsNormalized: p.rawSignalsNormalized === true,

      indexAuthorityObserved: p.indexAuthorityObserved === true,
      indexPairObserved: p.indexPairObserved === true,
      indexPairReady: p.indexPairReady === true,
      indexShellAccepted: p.indexShellAccepted === true,
      indexRuntimeReleaseAuthorized: p.indexRuntimeReleaseAuthorized === true,
      indexRuntimeReleaseComplete: p.indexRuntimeReleaseComplete === true,
      indexMountPresent: p.indexMountPresent === true,
      indexControlsBound: p.indexControlsBound === true,
      indexPairHoldReason: p.indexPairHoldReason || "WAITING_INDEX_PAIR_OBSERVATION",

      carrierHostAdmissibilityObserved: p.carrierHostAdmissibilityObserved === true,
      carrierHostAdmissibilityReady: p.carrierHostAdmissibilityReady === true,
      carrierHostAdmissibilityPacketReady: p.carrierHostAdmissibilityPacketReady === true,
      carrierHostAdmissibilityPacketPublished: p.carrierHostAdmissibilityPacketPublished === true,
      carrierHostAdmissibilityHoldReason: p.carrierHostAdmissibilityHoldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY",
      indexMacroWestCandidateReady: p.indexMacroWestCandidateReady === true,
      indexHandoffToRouteConductor: p.indexHandoffToRouteConductor === true,
      routeConductorHandoffPacketReady: p.routeConductorHandoffPacketReady === true,

      routeConductorMarkerPresent: p.routeConductorMarkerPresent === true,
      routeConductorApiPresent: p.routeConductorApiPresent === true,
      routeConductorReceiptPresent: p.routeConductorReceiptPresent === true,
      routeConductorRuntimeActive: p.routeConductorRuntimeActive === true,
      routeConductorHydrated: p.routeConductorHydrated === true,
      f8SelfDutySatisfied: p.f8SelfDutySatisfied === true,

      northAuthorityObserved: p.northAuthorityObserved === true,
      eastAuthorityObserved: p.eastAuthorityObserved === true,
      westAuthorityObserved: p.westAuthorityObserved === true,
      macroWestAuthorityObserved: p.macroWestAuthorityObserved === true,
      southAuthorityObserved: p.southAuthorityObserved === true,
      hearthIndexObserved: p.hearthIndexObserved === true,

      macroWestAdmissibilityObserved: p.macroWestAdmissibilityObserved === true,
      macroWestMethodUsed: p.macroWestMethodUsed || "",
      westDecision: p.westDecision || WEST_DECISION.UNKNOWN,
      westGapClass: p.westGapClass || "",
      westGapSeverity: p.westGapSeverity || "",
      westHardBlock: p.westHardBlock === true,
      westForwardAllowed: p.westForwardAllowed === true,
      westCanvasReleaseApproved: p.westCanvasReleaseApproved === true,
      westDegradedForwardApproved: p.westDegradedForwardApproved === true,
      westFirstFailedCoordinate: p.westFirstFailedCoordinate || "WAITING_MACRO_WEST_ADMISSIBILITY_DECISION",
      westRecommendedNextRenewalTarget: p.westRecommendedNextRenewalTarget || FILE_GATES.macroWest,

      canvasAuthorityObserved: p.canvasAuthorityObserved === true,
      currentCanvasParentObserved: p.currentCanvasParentObserved === true,
      currentCanvasParentContractObserved: p.currentCanvasParentContractObserved === true,
      currentCanvasParentContract: p.currentCanvasParentContract || "",
      canvasParentV2Observed: p.canvasParentV2Observed === true,
      canvasParentV2Superseded: p.canvasParentV2Superseded === true,
      canvasParentBootMethodAvailable: p.canvasParentBootMethodAvailable === true,
      canvasParentCarrierSafe: p.canvasParentCarrierSafe === true,
      canvasParentCarrierObservedOnly: p.canvasParentCarrierSafeObservedOnly === true,
      canvasParentReleaseAccepted: p.canvasParentReleaseAccepted === true,
      canvasParentReleaseObserved: p.canvasParentReleaseObserved === true,
      parentReleaseLawful: p.parentReleaseLawful === true,
      parentReleasePacketSentToEast: p.parentReleasePacketSentToEast === true,
      parentReleasePacketLawful: p.parentReleasePacketLawful === true,

      canvasReleaseAuthorized: p.canvasReleaseAuthorized === true,
      canvasReleasePacketReady: p.canvasReleasePacketReady === true,
      canvasReleaseHeldReason: p.canvasReleaseHeldReason || "WAITING_INDEX_CARRIER_HOST_ADMISSIBILITY_OR_MACRO_WEST",

      canvasEastApiReady: p.canvasEastApiReady === true,
      canvasWestApiReady: p.canvasWestApiReady === true,
      canvasSouthApiReady: p.canvasSouthApiReady === true,
      allCanvasChildrenApiReady: p.allCanvasChildrenApiReady === true,
      canvasEastEvidenceReady: p.canvasEastEvidenceReady === true,
      canvasWestInspectionReady: p.canvasWestInspectionReady === true,
      canvasSouthVisibleProofReady: p.canvasSouthVisibleProofReady === true,
      allCanvasChildrenEvidenceReady: p.allCanvasChildrenEvidenceReady === true,
      allCanvasChildrenReady: p.allCanvasChildrenReady === true,

      f13ProofBodyAvailable: p.f13ProofBodyAvailable === true,
      f13CanvasReadinessObserved: p.f13CanvasReadinessObserved === true,
      f13VisibleEvidenceAvailable: p.f13VisibleEvidenceAvailable === true,
      f13InspectEvidenceAvailable: p.f13InspectEvidenceAvailable === true,
      f13CanvasEvidenceStrict: p.f13CanvasEvidenceStrict === true,
      f13CanvasEvidenceDegraded: p.f13CanvasEvidenceDegraded === true,
      f13CanvasEvidenceComplete: p.f13CanvasEvidenceComplete === true,
      f13HardFail: p.f13HardFail === true,
      f13StrictEvidenceGap: p.f13StrictEvidenceGap || "WAITING_CANVAS_F13_EVIDENCE",
      f13StrictEvidenceRepairTarget: p.f13StrictEvidenceRepairTarget || FILE_GATES.canvas,

      southStrictProofObserved: p.southStrictProofObserved === true,
      southSoftProofObserved: p.southSoftProofObserved === true,
      southHardFailObserved: p.southHardFailObserved === true,
      southProofStale: p.southProofStale === true,
      parentStrictReadMismatch: p.parentStrictReadMismatch === true,
      degradedF13IsFunctional: p.degradedF13IsFunctional === true,
      functionalPageObserved: p.functionalPageObserved === true,
      strictVisualProofPending: p.strictVisualProofPending === true,

      indexGateReady: p.indexGateReady === true,
      routeF8GateReady: p.routeF8GateReady === true,
      macroWestGateReady: p.macroWestGateReady === true,
      canvasParentGateReady: p.canvasParentGateReady === true,
      canvasParentReleaseGateReady: p.canvasParentReleaseGateReady === true,
      canvasEastGateReady: p.canvasEastGateReady === true,
      canvasWestGateReady: p.canvasWestGateReady === true,
      canvasSouthGateReady: p.canvasSouthGateReady === true,
      canvasGateReady: p.canvasGateReady === true,
      northGateReady: p.northGateReady === true,
      eastGateReady: p.eastGateReady === true,
      westGateReady: p.westGateReady === true,
      southGateReady: p.southGateReady === true,
      newsGatePassedBeforeF21: p.newsGatePassedBeforeF21 === true,
      newsGateDegradedBeforeF21: p.newsGateDegradedBeforeF21 === true,

      chronologicalGateCount: safeNumber(p.chronologicalGateCount, 10),
      chronologicalGatesSatisfied: safeNumber(p.chronologicalGatesSatisfied, 0),
      chronologicalFirstFailedGate: p.chronologicalFirstFailedGate || "",
      chronologicalFirstFailedCoordinate: p.chronologicalFirstFailedCoordinate || "",
      fibonacciSynchronizationScore: safeNumber(p.fibonacciSynchronizationScore, 0),
      fibonacciSynchronizationExpected: safeNumber(p.fibonacciSynchronizationExpected, 100),
      fibonacciSynchronizationSatisfied: safeNumber(p.fibonacciSynchronizationSatisfied, 0),
      fibonacciSynchronizationPassed: p.fibonacciSynchronizationPassed === true,
      fibonacciSynchronizationDegraded: p.fibonacciSynchronizationDegraded === true,
      fibonacciSynchronizationHardFail: p.fibonacciSynchronizationHardFail === true,
      fibonacciSynchronizationHoldReason: p.fibonacciSynchronizationHoldReason || "",

      f21EligibleForNorth: p.f21EligibleForNorth === true,
      f21SubmittedToNorth: p.f21SubmittedToNorth === true,
      f21EligibilitySubmittedToNorth: p.f21EligibilitySubmittedToNorth === true,
      f21LatchMode: p.f21LatchMode || "WAITING_CANVAS_GATE",
      completionLatched: false,
      degradedCompletionLatched: p.degradedCompletionLatched === true,
      readyTextAllowed: false,
      northRepairRequired: p.northRepairRequired === true,
      northRepairReason: p.northRepairReason || "NONE",

      firstFailedCoordinate: p.firstFailedCoordinate || "WAITING_ROUTE_CONDUCTOR_SWITCHBOARD",
      recommendedNextFile: p.recommendedNextFile || FILE,
      recommendedNextRenewalTarget: p.recommendedNextRenewalTarget || FILE,
      canvasNextAuditTarget: p.canvasNextAuditTarget || p.recommendedNextFile || FILE,
      postgameStatus: p.postgameStatus || "ACTIVE",
      stationBoard: clonePlain(p.stationBoard || null),
      updatedAt: nowIso()
    });

    updateDataset();

    return p;
  }

  function refresh(input = {}) {
    const packet = composeRoutePrimaryPacket(input || {});
    updateStateFromPacket(packet);

    if (packet.f21EligibleForNorth && !state.f21EligibilitySubmittedToNorth) {
      submitF21EligibilityToNorth(packet);
    }

    maybeAutoBootCanvas(packet);
    scheduleRender();

    return getReceiptLight(false);
  }

  function reconcileCanvas(input = {}) {
    const packet = composeRoutePrimaryPacket({
      ...clonePlain(input),
      receivedFrom: input.receivedFrom || state.receivedFrom,
      activeCycleRoute: input.activeCycleRoute || state.activeCycleRoute
    });

    updateStateFromPacket(packet);
    scheduleRender();

    return getReceiptLight(false);
  }

  function bootCanvas(options = {}) {
    const normalized = normalizeRouteConductorInput({
      ...clonePlain(options),
      receivedFrom: options.receivedFrom || state.receivedFrom,
      activeCycleRoute: options.activeCycleRoute || state.activeCycleRoute || CYCLE_ROUTES.CYCLE_2,
      outputSpreadAvailable: options.outputSpreadAvailable !== false
    });

    const macroWest = classifyMacroWestAdmissibility(normalized);
    const releasePacket = options.preAuthorizedRelease && isObject(options.preAuthorizedRelease)
      ? options.preAuthorizedRelease
      : composeCanvasReleasePacket(normalized, macroWest, readCanvasEvidence(Boolean(macroWest.westCanvasReleaseApproved)));

    if (!releasePacket.canvasReleaseAuthorized) {
      record("CANVAS_RELEASE_HELD", {
        reason: releasePacket.canvasReleaseHeldReason,
        cycleNumber: releasePacket.cycleNumber,
        cycleRoute: releasePacket.cycleRoute,
        westDecision: releasePacket.westDecision,
        indexPairReady: releasePacket.indexPairReady,
        carrierHostAdmissibilityReady: releasePacket.carrierHostAdmissibilityReady,
        canvasParentReceivable: releasePacket.canvasParentReceivable
      });

      refresh({
        ...normalized.source,
        canvasReleaseAuthorized: false
      });

      return Promise.resolve({
        accepted: false,
        action: "HELD",
        contract: CONTRACT,
        receipt: RECEIPT,
        reason: releasePacket.canvasReleaseHeldReason,
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: releasePacket.canvasReleaseHeldReason,
        recommendedNextFile: releasePacket.recommendedNextFile,
        recommendedNextRenewalTarget: releasePacket.recommendedNextRenewalTarget,
        visualPassClaimed: false
      });
    }

    const canvas = readCanvasApi();
    const method = selectCanvasMethod(canvas);

    state.canvasBootAttempted = true;

    if (!canvas || !method) {
      updateDataset();

      return Promise.resolve({
        accepted: false,
        action: "HELD",
        contract: CONTRACT,
        receipt: RECEIPT,
        reason: !canvas ? "canvas-parent-api-missing" : "canvas-parent-boot-method-missing",
        canvasReleaseAuthorized: false,
        firstFailedCoordinate: !canvas ? "WAITING_CANVAS_PARENT_API" : "WAITING_CANVAS_PARENT_BOOT_METHOD",
        recommendedNextFile: FILE_GATES.canvas,
        recommendedNextRenewalTarget: FILE_GATES.canvas,
        visualPassClaimed: false
      });
    }

    const publishResult = publishReleaseToCanvasParent(canvas, releasePacket);

    record("CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST", {
      method,
      cycleRoute: releasePacket.cycleRoute,
      westDecision: releasePacket.westDecision,
      macroWestMethodUsed: releasePacket.macroWestMethodUsed,
      indexPairReady: releasePacket.indexPairReady,
      carrierHostAdmissibilityReady: releasePacket.carrierHostAdmissibilityReady,
      parentCarrierSafeIsNotMacroWestPrerequisite: true,
      releasePublishedToParent: publishResult.accepted
    });

    state.canvasBootInFlight = true;
    updateDataset();

    try {
      return Promise.resolve(canvas[method]({
        mount: refs.mount || "#hearthCanvasMount",
        route: ROUTE,
        callEast: true,
        async: true,
        nonBlocking: true,
        releasePacket: {
          ...releasePacket,
          receivedFrom: CARDINALS.WEST,
          cycleNumber: 2,
          cycleRoute: CYCLE_ROUTES.CYCLE_2,
          westAuditObserved: true,
          westAuditAccepted: true,
          westCanvasReleaseApproved: true,
          canvasReleaseAuthorized: true,
          canvasReleaseReceived: true,
          indexPairReady: true,
          carrierHostAdmissibilityReady: true,
          parentCarrierSafeIsNotMacroWestPrerequisite: true,
          canvasStructuralCarrierOwnedByCanvas: true,
          visualPassClaimed: false
        },
        onReady: () => reconcileCanvas({ receivedFrom: CARDINALS.CANVAS }),
        onError: (error) => {
          recordError("CANVAS_RELEASED_BOOT_ERROR", error);
          reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
        },
        onPhase: () => reconcileCanvas({ receivedFrom: CARDINALS.CANVAS })
      })).then((result) => {
        state.canvasBootInFlight = false;
        state.canvasBootResultObserved = true;
        reconcileCanvas({ receivedFrom: CARDINALS.CANVAS, canvasBootResult: result });
        return result;
      }).catch((error) => {
        state.canvasBootInFlight = false;
        recordError("CANVAS_RELEASED_BOOT_FAILED", error);
        reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
        return null;
      });
    } catch (error) {
      state.canvasBootInFlight = false;
      recordError("CANVAS_RELEASED_BOOT_SYNC_FAILED", error);
      reconcileCanvas({ receivedFrom: CARDINALS.CANVAS });
      return Promise.resolve(null);
    }
  }

  function maybeAutoBootCanvas(packet = state.currentPacket || {}) {
    if (!packet || !packet.canvasReleaseAuthorized) return;
    if (!packet.indexPairReady || !packet.carrierHostAdmissibilityReady) return;
    if (state.canvasBootAttempted || state.canvasBootInFlight || state.f13CanvasEvidenceComplete) return;
    if (!readCanvasApi()) return;
    if (autoBootTimer) return;

    autoBootTimer = root.setTimeout(() => {
      autoBootTimer = 0;
      bootCanvas({
        receivedFrom: CARDINALS.WEST,
        activeCycleRoute: CYCLE_ROUTES.CYCLE_2,
        outputSpreadAvailable: true,
        preAuthorizedRelease: packet.canvasReleasePacket
      });
    }, 40);
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

    const north = readNorthAuthority().authority;
    const session = firstGlobal([
      "HEARTH_CHECKPOINT_SESSION",
      "HEARTH_RUNTIME_CHECKPOINT_SESSION",
      "LAB_HEARTH_CHECKPOINT_SESSION",
      "LAB_CHECKPOINT_SESSION",
      "DEXTER_LAB.hearthCheckpointSession",
      "DEXTER_LAB.checkpointSession"
    ]);

    const payload = {
      event: "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
      checkpointEvent: "F21_ELIGIBILITY_SUBMITTED_TO_NORTH",
      id: "F21_COMPLETION_LATCH",
      phase: "F21_COMPLETION_LATCH",
      checkpointId: "F21_COMPLETION_LATCH",
      activeFibonacci: "F21",
      activeCardinal: CARDINALS.NORTH,
      source: "hearth-route-conductor-central-station-switchboard-news-fibonacci-parent-coordination",
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
        indexPairReady: packet.indexPairReady,
        carrierHostAdmissibilityReady: packet.carrierHostAdmissibilityReady,
        f8SelfDutySatisfied: packet.f8SelfDutySatisfied,
        macroWestAdmissibilityObserved: packet.macroWestAdmissibilityObserved,
        westDecision: packet.westDecision,
        canvasParentReleaseAccepted: packet.canvasParentReleaseAccepted,
        f13CanvasEvidenceStrict: packet.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: packet.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: packet.f13CanvasEvidenceComplete,
        f13HardFail: packet.f13HardFail,
        f13StrictEvidenceGap: packet.f13StrictEvidenceGap,
        f13StrictEvidenceRepairTarget: packet.f13StrictEvidenceRepairTarget,
        canvasGateReady: packet.canvasGateReady,
        newsGatePassedBeforeF21: packet.newsGatePassedBeforeF21,
        newsGateDegradedBeforeF21: packet.newsGateDegradedBeforeF21
      }
    };

    let result = null;

    try {
      if (session && isFunction(session.submitF21Eligibility)) result = session.submitF21Eligibility(payload);
      else if (session && isFunction(session.acceptF21Eligibility)) result = session.acceptF21Eligibility(payload);
      else if (session && isFunction(session.submitEvent)) result = session.submitEvent(payload);
      else if (session && isFunction(session.submit)) result = session.submit(payload);
      else if (north && isFunction(north.submitF21Eligibility)) result = north.submitF21Eligibility(payload);
      else if (north && isFunction(north.acceptF21Eligibility)) result = north.acceptF21Eligibility(payload);
      else if (north && isFunction(north.receiveF21Eligibility)) result = north.receiveF21Eligibility(payload);

      state.f21SubmittedToNorth = true;
      state.f21EligibilitySubmittedToNorth = true;
      state.f21EligibilitySubmittedAt = nowIso();
      state.f21EligibilitySubmissionCount += 1;

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
        f21SubmittedToNorth: true,
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

  function bindControls() {
    if (!doc) return;

    if (refs.copyButton && refs.copyButton.dataset.hearthRouteConductorSwitchboardBound !== "true") {
      refs.copyButton.dataset.hearthRouteConductorSwitchboardBound = "true";
      refs.copyButton.addEventListener("click", copyDiagnostic);
    }

    if (refs.toggleButton && refs.toggleButton.dataset.hearthRouteConductorSwitchboardBound !== "true") {
      refs.toggleButton.dataset.hearthRouteConductorSwitchboardBound = "true";
      refs.toggleButton.addEventListener("click", () => {
        const visible = refs.receiptBox ? refs.receiptBox.dataset.visible !== "true" : true;
        if (refs.receiptBox) refs.receiptBox.dataset.visible = String(visible);
        if (refs.receiptText) refs.receiptText.textContent = visible ? getReceiptText() : "";
        if (refs.toggleButton) refs.toggleButton.textContent = visible ? "Hide receipt" : "Show receipt";
      });
    }

    if (refs.inspectButton && refs.inspectButton.dataset.hearthRouteConductorSwitchboardBound !== "true") {
      refs.inspectButton.dataset.hearthRouteConductorSwitchboardBound = "true";
      refs.inspectButton.addEventListener("click", () => {
        setInspectMode(!(doc.documentElement.dataset.hearthSouthPlanetInspect === "true"));
      });
    }

    if (refs.showTab && refs.showTab.dataset.hearthRouteConductorSwitchboardBound !== "true") {
      refs.showTab.dataset.hearthRouteConductorSwitchboardBound = "true";
      refs.showTab.addEventListener("click", () => setInspectMode(false));
    }

    state.refsBound = Boolean(refs.copyButton || refs.toggleButton || refs.inspectButton || refs.showTab);
  }

  function setInspectMode(active) {
    if (!doc) return getReceipt();

    scanDom();

    doc.documentElement.dataset.hearthSouthPlanetInspect = String(active);
    doc.documentElement.dataset.hearthEastInspectReservedActive = String(active);

    if (refs.cockpit) refs.cockpit.dataset.cockpitMode = active ? "planet-inspect" : "diagnostic-dock";

    if (refs.showTab) {
      refs.showTab.hidden = !active;
      refs.showTab.dataset.visible = String(active);
    }

    if (refs.inspectButton) {
      refs.inspectButton.textContent = active ? "Show diagnostic" : "Inspect planet";
    }

    record(active ? "INSPECT_MODE_ACTIVE" : "INSPECT_MODE_RELEASED", { active });
    refresh();

    return getReceipt();
  }

  async function copyDiagnostic() {
    const text = getReceiptText();

    try {
      if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
        await root.navigator.clipboard.writeText(text);
      } else if (doc) {
        const area = doc.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "readonly");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        doc.body.appendChild(area);
        area.select();
        doc.execCommand("copy");
        area.remove();
      }

      if (refs.copyButton) {
        const prior = refs.copyButton.textContent || "Copy diagnostic";
        refs.copyButton.textContent = "Copied";
        root.setTimeout(() => {
          refs.copyButton.textContent = prior;
        }, 900);
      }

      return true;
    } catch (error) {
      recordError("COPY_DIAGNOSTIC_FAILED", error);
      return false;
    }
  }

  function renderLanes() {
    const packet = state.currentPacket || {};

    const rows = [
      ["F1", "Index host", packet.carrierHostAdmissibilityReady ? "READY" : "WAITING"],
      ["F8", "Self-duty", packet.f8SelfDutySatisfied ? "COMPLETE" : "ACTIVE"],
      ["W", "Macro West", packet.macroWestAdmissibilityObserved ? packet.westCanvasReleaseApproved ? "RELEASE" : "HELD" : "WAITING"],
      ["P", "Canvas parent", packet.canvasParentReleaseAccepted ? "ACCEPTED" : packet.canvasReleaseAuthorized ? "WAITING_PARENT" : "PENDING"],
      ["F13", "Canvas evidence", packet.f13CanvasEvidenceStrict ? "STRICT" : packet.f13CanvasEvidenceComplete ? "DEGRADED" : packet.f13CanvasReadinessObserved ? "ACTIVE" : "PENDING"],
      ["NEXT", "Switch target", packet.recommendedNextFile || state.recommendedNextFile || FILE]
    ];

    return rows.map(([fib, label, status]) => {
      const progress =
        status === "READY" || status === "COMPLETE" || status === "STRICT" || status === "RELEASE" || status === "ACCEPTED" ? 100 :
          status === "DEGRADED" ? 82 :
            status === "WAITING_PARENT" ? 70 :
              status === "HELD" ? 64 :
                status === "ACTIVE" ? 55 :
                  status === "WAITING" ? 35 :
                    48;

      return [
        `<section class="hearth-ledger-lane" data-lane="${fib}" data-status="${String(status).replace(/"/g, "")}">`,
        `<div class="hearth-ledger-lane-top">`,
        `<span class="hearth-ledger-lane-title"><strong>${fib} · ${label}</strong><span>SWITCHBOARD</span></span>`,
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

    const packet = state.currentPacket || composeRoutePrimaryPacket();
    const visible = packet.visibleState || composeVisibleStateFromPrimary(packet);

    if (refs.stage) refs.stage.textContent = `${visible.activeCycleRoute || packet.cycleRoute} · ${visible.activeFibonacci || packet.activeFibonacci}`;
    if (refs.heartbeat) refs.heartbeat.textContent = visible.visibleStatusText || packet.postgameStatus || "Route conductor switchboard active";
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

  function globalsNeedRepublish() {
    const apiPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR &&
      root.HearthRouteConductor &&
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR &&
      root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE &&
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION
    );

    const nestedApiPresent = Boolean(
      root.HEARTH &&
      root.HEARTH.routeConductor &&
      root.HEARTH.southRouteConductor &&
      root.HEARTH.routeConductorPrimaryGate &&
      root.HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordination
    );

    const dexterApiPresent = Boolean(
      root.DEXTER_LAB &&
      root.DEXTER_LAB.hearthRouteConductor &&
      root.DEXTER_LAB.hearthSouthRouteConductor &&
      root.DEXTER_LAB.hearthRouteConductorPrimaryGate &&
      root.DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardNewsFibonacciParentCoordination
    );

    const receiptPresent = Boolean(
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT.receipt === RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT &&
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT.contract === CONTRACT
    );

    const markerValid = Boolean(
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER__ === true &&
      root.__HEARTH_ROUTE_CONDUCTOR_MARKER_IS_HYDRATION_PROOF__ === false &&
      root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ === CONTRACT
    );

    return !(apiPresent && nestedApiPresent && dexterApiPresent && receiptPresent && markerValid);
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
    root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT = api;
    root.HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER = api;
    root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION = api;

    root.HEARTH.routeConductor = api;
    root.HEARTH.southRouteConductor = api;
    root.HEARTH.routeConductorPrimaryGate = api;
    root.HEARTH.routeConductorStrictF13DownstreamAlignment = api;
    root.HEARTH.routeConductorTwoFileNewsFibonacciCarrierHostConsumer = api;
    root.HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordination = api;

    root.DEXTER_LAB.hearthRouteConductor = api;
    root.DEXTER_LAB.hearthSouthRouteConductor = api;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGate = api;
    root.DEXTER_LAB.hearthRouteConductorStrictF13DownstreamAlignment = api;
    root.DEXTER_LAB.hearthRouteConductorTwoFileNewsFibonacciCarrierHostConsumer = api;
    root.DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardNewsFibonacciParentCoordination = api;

    const receiptLight = getReceiptLight(false);

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_STRICT_F13_DOWNSTREAM_ALIGNMENT_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_RECEIPT = receiptLight;
    root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT = receiptLight;

    root.HEARTH.routeConductorReceipt = receiptLight;
    root.HEARTH.southRouteConductorReceipt = receiptLight;
    root.HEARTH.routeConductorPrimaryGateReceipt = receiptLight;
    root.HEARTH.routeConductorStrictF13DownstreamAlignmentReceipt = receiptLight;
    root.HEARTH.routeConductorTwoFileNewsFibonacciCarrierHostConsumerReceipt = receiptLight;
    root.HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordinationReceipt = receiptLight;

    root.DEXTER_LAB.hearthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthSouthRouteConductorReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorPrimaryGateReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorStrictF13DownstreamAlignmentReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorTwoFileNewsFibonacciCarrierHostConsumerReceipt = receiptLight;
    root.DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardNewsFibonacciParentCoordinationReceipt = receiptLight;

    record(reason, {
      apiPresent: true,
      receiptPresent: true,
      centralStationSwitchboardActive: true,
      newsChronologicalOrderLocked: true,
      fibonacciSynchronizationChronologyFirst: true,
      parentReleaseGatePrecedesChildDispatch: true,
      force: force === true
    });

    updateDataset();
    return true;
  }

  function composeRouteReceipt(input = {}) {
    const packet = input && input.contract === CONTRACT ? input : composeRoutePrimaryPacket(input);

    return {
      ...clonePlain(packet),
      authority: "hearth-route-conductor-central-station-switchboard-news-fibonacci-parent-coordination",
      status: "active",
      receiptComposed: true,
      currentReceipt: true,
      updatedAt: nowIso()
    };
  }

  function composeReceiptText(receipt = {}) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT",
      "",
      line("contract", r.contract || CONTRACT),
      line("receipt", r.receipt || RECEIPT),
      line("previousContract", r.previousContract || PREVIOUS_CONTRACT),
      line("baselineContract", r.baselineContract || BASELINE_CONTRACT),
      line("version", r.version || VERSION),
      line("file", r.file || FILE),
      line("route", r.route || ROUTE),
      line("role", r.role || state.role),
      "",
      line("centralStationSwitchboardActive", r.centralStationSwitchboardActive === true),
      line("stationBoardComposed", r.stationBoardComposed === true),
      line("switchPriorityApplied", r.switchPriorityApplied === true),
      line("rawSignalsNormalized", r.rawSignalsNormalized === true),
      line("newsAlignmentProtocolActive", r.newsAlignmentProtocolActive === true),
      line("newsChronologicalOrderLocked", r.newsChronologicalOrderLocked === true),
      line("fibonacciSynchronizationChronologyFirst", r.fibonacciSynchronizationChronologyFirst === true),
      line("canvasParentReleaseAcceptanceGateActive", r.canvasParentReleaseAcceptanceGateActive === true),
      line("downstreamRecommendationBlockedUntilParentAccepted", r.downstreamRecommendationBlockedUntilParentAccepted === true),
      line("parentReleaseGatePrecedesChildDispatch", r.parentReleaseGatePrecedesChildDispatch === true),
      line("staleCanvasV2FalsePositiveBlocked", r.staleCanvasV2FalsePositiveBlocked === true),
      "",
      line("cycleNumber", r.cycleNumber || r.activeCycleNumber || ""),
      line("cycleRoute", r.cycleRoute || r.activeCycleRoute || ""),
      line("receivedFrom", r.receivedFrom || ""),
      line("returnTo", r.returnTo || ""),
      line("handoffTo", r.handoffTo || ""),
      "",
      line("indexPairReady", r.indexPairReady === true),
      line("carrierHostAdmissibilityReady", r.carrierHostAdmissibilityReady === true),
      line("f8SelfDutySatisfied", r.f8SelfDutySatisfied === true),
      "",
      line("macroWestAuthorityObserved", r.macroWestAuthorityObserved === true),
      line("macroWestAdmissibilityObserved", r.macroWestAdmissibilityObserved === true),
      line("macroWestMethodUsed", r.macroWestMethodUsed || ""),
      line("westDecision", r.westDecision || ""),
      line("westGapClass", r.westGapClass || ""),
      line("westHardBlock", r.westHardBlock === true),
      line("westForwardAllowed", r.westForwardAllowed === true),
      line("westCanvasReleaseApproved", r.westCanvasReleaseApproved === true),
      "",
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized === true),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady === true),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason || ""),
      "",
      line("currentCanvasParentObserved", r.currentCanvasParentObserved === true),
      line("currentCanvasParentContractObserved", r.currentCanvasParentContractObserved === true),
      line("currentCanvasParentContract", r.currentCanvasParentContract || ""),
      line("canvasParentV2Observed", r.canvasParentV2Observed === true),
      line("canvasParentV2Superseded", r.canvasParentV2Superseded === true),
      line("canvasParentBootMethodAvailable", r.canvasParentBootMethodAvailable === true),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted === true),
      line("canvasParentReleaseObserved", r.canvasParentReleaseObserved === true),
      line("parentReleaseLawful", r.parentReleaseLawful === true),
      line("parentReleasePacketSentToEast", r.parentReleasePacketSentToEast === true),
      line("parentReleasePacketLawful", r.parentReleasePacketLawful === true),
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
      line("indexGateReady", r.indexGateReady === true),
      line("routeF8GateReady", r.routeF8GateReady === true),
      line("macroWestGateReady", r.macroWestGateReady === true),
      line("canvasParentGateReady", r.canvasParentGateReady === true),
      line("canvasParentReleaseGateReady", r.canvasParentReleaseGateReady === true),
      line("canvasEastGateReady", r.canvasEastGateReady === true),
      line("canvasWestGateReady", r.canvasWestGateReady === true),
      line("canvasSouthGateReady", r.canvasSouthGateReady === true),
      line("canvasGateReady", r.canvasGateReady === true),
      line("newsGatePassedBeforeF21", r.newsGatePassedBeforeF21 === true),
      line("newsGateDegradedBeforeF21", r.newsGateDegradedBeforeF21 === true),
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
      line("f21EligibleForNorth", r.f21EligibleForNorth === true),
      line("f21SubmittedToNorth", r.f21SubmittedToNorth === true),
      line("f21EligibilitySubmittedToNorth", r.f21EligibilitySubmittedToNorth === true),
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

  function getReceiptLight(doRefresh = true) {
    if (doRefresh) {
      const packet = composeRoutePrimaryPacket();
      updateStateFromPacket(packet);
    }

    const packet = state.currentPacket || composeFallbackRoutePrimaryPacket();

    return {
      ...clonePlain(packet),
      currentReceiptLight: true,
      renderCount: state.renderCount,
      watchdogTicks: state.watchdogTicks,
      booted: state.booted,
      booting: state.booting,
      canvasBootAttempted: state.canvasBootAttempted,
      canvasBootInFlight: state.canvasBootInFlight,
      canvasBootResultObserved: state.canvasBootResultObserved,
      latestEvent: state.latestEvent,
      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    const receipt = getReceiptLight(true);

    return {
      ...receipt,
      files: clonePlain(FILE_GATES),
      stationIds: clonePlain(STATION_IDS),
      indexContracts: INDEX_CONTRACTS.slice(),
      currentCanvasParentContracts: CURRENT_CANVAS_PARENT_CONTRACTS.slice(),
      legacyCanvasV2Contract: LEGACY_CANVAS_V2_CONTRACT,
      strictProofMinimums: clonePlain(STRICT_PROOF_MINIMUMS),
      stationBoard: clonePlain(state.stationBoard),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      currentReceiptText: composeReceiptText(receipt)
    };
  }

  function getReceiptText() {
    const receipt = getReceiptLight(false);
    return composeReceiptText(receipt);
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("cycleNumber", r.cycleNumber),
      line("cycleRoute", r.cycleRoute),
      line("centralStationSwitchboardActive", r.centralStationSwitchboardActive),
      line("stationBoardComposed", r.stationBoardComposed),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("currentCanvasParentContract", r.currentCanvasParentContract),
      line("canvasParentV2Observed", r.canvasParentV2Observed),
      line("canvasParentV2Superseded", r.canvasParentV2Superseded),
      line("chronologicalFirstFailedGate", r.chronologicalFirstFailedGate),
      line("chronologicalFirstFailedCoordinate", r.chronologicalFirstFailedCoordinate),
      line("fibonacciSynchronizationScore", r.fibonacciSynchronizationScore),
      line("fibonacciSynchronizationPassed", r.fibonacciSynchronizationPassed),
      line("fibonacciSynchronizationDegraded", r.fibonacciSynchronizationDegraded),
      line("fibonacciSynchronizationHoldReason", r.fibonacciSynchronizationHoldReason),
      line("newsGatePassedBeforeF21", r.newsGatePassedBeforeF21),
      line("newsGateDegradedBeforeF21", r.newsGateDegradedBeforeF21),
      line("f21EligibleForNorth", r.f21EligibleForNorth),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", r.visualPassClaimed),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthRouteConductorMarkerPresent", "true");
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthRouteConductorBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthRouteConductorVersion", VERSION);

    setDataset("hearthRouteConductorCentralStationSwitchboardActive", "true");
    setDataset("hearthRouteConductorStationBoardComposed", String(state.stationBoardComposed));
    setDataset("hearthRouteConductorSwitchPriorityApplied", String(state.switchPriorityApplied));
    setDataset("hearthRouteConductorRawSignalsNormalized", String(state.rawSignalsNormalized));
    setDataset("hearthRouteConductorNewsChronologicalOrderLocked", "true");
    setDataset("hearthRouteConductorFibonacciChronologyFirst", "true");
    setDataset("hearthRouteConductorCanvasParentReleaseAcceptanceGateActive", "true");
    setDataset("hearthRouteConductorDownstreamRecommendationBlockedUntilParentAccepted", "true");
    setDataset("hearthRouteConductorParentReleaseGatePrecedesChildDispatch", "true");
    setDataset("hearthRouteConductorStaleCanvasV2FalsePositiveBlocked", "true");

    setDataset("hearthSouthRouteConductorLoaded", "true");
    setDataset("hearthSouthRouteConductorPresent", "true");
    setDataset("hearthSouthRouteConductorContract", CONTRACT);
    setDataset("hearthSouthRouteConductorReceipt", RECEIPT);
    setDataset("hearthSouthRouteConductorHydrated", String(state.routeConductorHydrated));

    setDataset("hearthSouthIndexPairReady", String(state.indexPairReady));
    setDataset("hearthSouthCarrierHostAdmissibilityReady", String(state.carrierHostAdmissibilityReady));
    setDataset("hearthSouthF8SelfDutySatisfied", String(state.f8SelfDutySatisfied));

    setDataset("hearthSouthMacroWestAuthorityObserved", String(state.macroWestAuthorityObserved));
    setDataset("hearthSouthMacroWestAdmissibilityObserved", String(state.macroWestAdmissibilityObserved));
    setDataset("hearthSouthWestDecision", state.westDecision);
    setDataset("hearthSouthWestHardBlock", String(state.westHardBlock));
    setDataset("hearthSouthWestForwardAllowed", String(state.westForwardAllowed));
    setDataset("hearthSouthWestCanvasReleaseApproved", String(state.westCanvasReleaseApproved));

    setDataset("hearthSouthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthSouthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);
    setDataset("hearthSouthCurrentCanvasParentObserved", String(state.currentCanvasParentObserved));
    setDataset("hearthSouthCurrentCanvasParentContractObserved", String(state.currentCanvasParentContractObserved));
    setDataset("hearthSouthCurrentCanvasParentContract", state.currentCanvasParentContract);
    setDataset("hearthSouthCanvasParentV2Observed", String(state.canvasParentV2Observed));
    setDataset("hearthSouthCanvasParentV2Superseded", String(state.canvasParentV2Superseded));
    setDataset("hearthSouthCanvasParentBootMethodAvailable", String(state.canvasParentBootMethodAvailable));
    setDataset("hearthSouthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthSouthParentReleaseLawful", String(state.parentReleaseLawful));
    setDataset("hearthSouthParentReleasePacketSentToEast", String(state.parentReleasePacketSentToEast));
    setDataset("hearthSouthParentReleasePacketLawful", String(state.parentReleasePacketLawful));

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

    setDataset("hearthSouthIndexGateReady", String(state.indexGateReady));
    setDataset("hearthSouthRouteF8GateReady", String(state.routeF8GateReady));
    setDataset("hearthSouthMacroWestGateReady", String(state.macroWestGateReady));
    setDataset("hearthSouthCanvasParentGateReady", String(state.canvasParentGateReady));
    setDataset("hearthSouthCanvasParentReleaseGateReady", String(state.canvasParentReleaseGateReady));
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

    setDataset("hearthSouthF21EligibleForNorth", String(state.f21EligibleForNorth));
    setDataset("hearthSouthF21EligibilitySubmittedToNorth", String(state.f21EligibilitySubmittedToNorth));
    setDataset("hearthSouthCompletionLatched", "false");
    setDataset("hearthSouthReadyTextAllowed", "false");
    setDataset("hearthSouthF21LatchMode", state.f21LatchMode);
    setDataset("hearthSouthF21ClaimedByRouteConductor", "false");

    setDataset("hearthSouthFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthSouthRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthSouthRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthSouthPostgameStatus", state.postgameStatus);

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function startWatchdog() {
    if (watchdogTimer) root.clearInterval(watchdogTimer);

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      refresh();

      if (globalsNeedRepublish()) {
        publishGlobals("watchdog-conditional-switchboard-republish", false);
      }

      if (
        (state.f13CanvasEvidenceStrict && state.f21EligibilitySubmittedToNorth) ||
        state.watchdogTicks >= WATCHDOG_LIMIT
      ) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;
      }
    }, WATCHDOG_MS);
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "BOOTING_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD";

      publishEarlyMarker();
      publishGlobals("boot-early-central-station-switchboard-api-receipt-publication", true);

      refresh();

      state.booting = false;
      state.booted = true;
      state.routeConductorRuntimeActive = true;

      publishGlobals("boot-complete-central-station-switchboard-api-receipt-publication", true);
      refresh();
      render();

      startWatchdog();

      record("HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_BOOTED", {
        route: ROUTE,
        markerPresent: state.routeConductorMarkerPresent,
        apiPresent: state.routeConductorApiPresent,
        receiptPresent: state.routeConductorReceiptPresent,
        hydrated: state.routeConductorHydrated,
        centralStationSwitchboardActive: true,
        stationBoardComposed: state.stationBoardComposed,
        newsChronologicalOrderLocked: true,
        fibonacciSynchronizationChronologyFirst: true,
        canvasReleaseAuthorized: state.canvasReleaseAuthorized,
        canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
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

    if (autoBootTimer) {
      root.clearTimeout(autoBootTimer);
      autoBootTimer = 0;
    }

    record("HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_DISPOSED", { reason });
    render();

    return getReceipt();
  }

  function getRouteCycleReceipt(input = {}) {
    const packet = composeRoutePrimaryPacket(input);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      cycleReceipt: "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_CYCLE_RECEIPT_v7",
      cycleNumber: packet.cycleNumber,
      cycleRoute: packet.cycleRoute,
      receivedFrom: packet.receivedFrom,
      returnTo: packet.returnTo,
      handoffTo: packet.handoffTo,
      centralStationSwitchboardActive: packet.centralStationSwitchboardActive,
      chronologicalFirstFailedGate: packet.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: packet.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationPassed: packet.fibonacciSynchronizationPassed,
      canvasReleaseAuthorized: packet.canvasReleaseAuthorized,
      canvasParentReleaseAccepted: packet.canvasParentReleaseAccepted,
      recommendedNextFile: packet.recommendedNextFile,
      recommendedNextRenewalTarget: packet.recommendedNextRenewalTarget,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getRoutePrimaryGateReceipt(input = {}) {
    return composeRouteReceipt(input);
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: state.role,

    FILE_GATES,
    CYCLE_ROUTES,
    CARDINALS,
    WEST_DECISION,
    STATION_IDS,
    INDEX_CONTRACTS,
    CURRENT_CANVAS_PARENT_CONTRACTS,
    LEGACY_CANVAS_V2_CONTRACT,
    STRICT_PROOF_MINIMUMS,

    boot,
    start: boot,
    init: boot,
    run: boot,
    dispose,
    refresh,
    render,
    bootCanvas,
    reconcileCanvas,
    setInspectMode,
    copyDiagnostic,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatusText,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,

    readNorthAuthority,
    readEastAuthority,
    readWestAuthority,
    readMacroWestAuthority,
    readSouthPrimaryGate,
    readHearthIndexAuthority,
    readCanvasApi,
    readCanvasReceipt,
    readCanvasEvidence,

    detectCurrentCanvasParent,
    resolveCanvasParentReleaseAcceptance,
    resolveStrictF13Gap,
    resolveRouteCycle,
    resolveF8SelfDuty,
    resolveNewsState,
    resolveF21Eligibility,

    composeMacroWestCandidate,
    classifyMacroWestAdmissibility,
    normalizeMacroWestResult,
    composeCanvasReleasePacket,
    publishReleaseToCanvasParent,
    composeStationBoard,
    computeChronologyFirstFibonacci,
    selectSwitchboardNextFile,
    applyAntiFalseSynchronization,
    composeProofBody,
    composeRoutePrimaryPacket,
    composeRouteReceipt,

    globalsNeedRepublish,
    publishGlobals,

    supportsCentralStationSwitchboard: true,
    supportsStationBoardComposition: true,
    supportsSwitchPriorityRouting: true,
    supportsNewsChronologicalOrder: true,
    supportsFibonacciChronologyFirst: true,
    supportsCanvasParentReleaseAcceptanceGate: true,
    supportsParentReleaseBeforeChildDispatch: true,
    supportsStaleCanvasV2FalsePositiveBlock: true,
    supportsMacroWestAdmissibilityConsumption: true,
    supportsCanvasReleaseFirewall: true,
    supportsF21EligibilitySubmissionOnly: true,

    centralStationSwitchboardActive: true,
    stationBoardComposed: true,
    switchPriorityApplied: true,
    rawSignalsNormalized: true,
    newsAlignmentProtocolActive: true,
    newsChronologicalOrderLocked: true,
    fibonacciSynchronizationChronologyFirst: true,
    canvasParentReleaseAcceptanceGateActive: true,
    downstreamRecommendationBlockedUntilParentAccepted: true,
    parentReleaseGatePrecedesChildDispatch: true,
    staleCanvasV2FalsePositiveBlocked: true,

    ownsRouteConductorRuntime: true,
    ownsCentralStationSwitchboard: true,
    ownsStationBoard: true,
    ownsRouteCycleResolution: true,
    ownsIndexPairConsumption: true,
    ownsCarrierHostAdmissibilityConsumption: true,
    ownsMacroWestAdmissibilityConsumption: true,
    ownsCanvasReleasePacket: true,
    ownsCanvasParentReleaseAcceptanceVerification: true,
    ownsStrictF13RepairRouting: true,
    ownsF21EligibilitySubmission: true,

    ownsIndexShellTruth: false,
    ownsIndexRuntimeReleaseTruth: false,
    ownsCarrierHostTruth: false,
    ownsMacroWestTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasStructuralCarrierTruth: false,
    ownsCanvasParentF13Truth: false,
    ownsCanvasChildren: false,
    ownsCanvasEastAtlasTruth: false,
    ownsCanvasWestInspectionTruth: false,
    ownsCanvasSouthVisibleProofTruth: false,
    ownsNorthCheckpointTruth: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  };

  publishEarlyMarker();
  publishGlobals("immediate-central-station-switchboard-api-receipt-publication", true);

  if (doc) {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
