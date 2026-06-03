// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4
// Full-file replacement.
// Canvas Parent / Canvas Local Station / Diagnostic Bridge Alignment.
// Purpose:
// - Preserve accepted v11_3_1 Canvas Local Station / Child Distribution Switchboard architecture.
// - Renew the Canvas parent to recognize the current Route Conductor v9_3 authority.
// - Preserve v9_2 as accepted lineage / observation-only history, not current authority.
// - Bridge the diagnostic receipt side and the route-conductor/canvas receipt side without building expression ports yet.
// - Preserve public receiver methods as validated intake surfaces.
// - Preserve East dispatch only after accepted current Route Conductor release.
// - Preserve child aggregation summary for EAST / WEST / SOUTH.
// - Publish bridge summary fields usable by Route Conductor, Diagnostic Rail, and future expression-port work.
// - Keep expression, terrain, mountain, material, hydrology, and planet-geometry ports held.
// - Never claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.
// Does not own:
// - HTML shell
// - front-end button binding
// - diagnostic rail final case selection
// - Route Conductor systemic cycle authority
// - Macro West admissibility
// - EAST atlas truth
// - WEST inspection truth
// - SOUTH visible proof truth
// - terrain/material/hydrology/elevation/mountain expression
// - expression-port construction
// - F13 latch
// - F21 latch
// - ready text
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4";
  const RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_RECEIPT_v11_4";
  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_1";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT_v11_3_1";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT_v10_3";

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3";
  const CURRENT_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3";
  const LINEAGE_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2";
  const LINEAGE_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT_v9_2";

  const MACRO_WEST_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_TNT_v4_6_3";
  const CURRENT_EAST_CONTRACT = "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_TNT_v11_4";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";
  const MACRO_WEST_FILE = "/assets/lab/runtime-table.west.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const CYCLE_2_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const RELEASE_SOURCE = Object.freeze({
    ROUTE_CONDUCTOR_CURRENT_V9_3_API: "ROUTE_CONDUCTOR_CURRENT_V9_3_API",
    ROUTE_CONDUCTOR_CURRENT_V9_3_RECEIPT: "ROUTE_CONDUCTOR_CURRENT_V9_3_RECEIPT",
    DIRECT_ROUTE_CONDUCTOR_CANDIDATE: "DIRECT_ROUTE_CONDUCTOR_CANDIDATE",
    OPTIONS_TEST: "OPTIONS_TEST",
    GLOBAL_OBSERVATION: "GLOBAL_OBSERVATION",
    DATASET_OBSERVATION: "DATASET_OBSERVATION",
    LINEAGE_V9_2_OBSERVATION_ONLY: "LINEAGE_V9_2_OBSERVATION_ONLY",
    NONE: "NONE"
  });

  const CHILD_STATUS = Object.freeze({
    MISSING_API: "MISSING_API",
    API_READY_EVIDENCE_WAIT: "API_READY_EVIDENCE_WAIT",
    HELD_PACKET_API_READY: "HELD_PACKET_API_READY",
    EVIDENCE_READY: "EVIDENCE_READY",
    HARD_FAIL: "HARD_FAIL",
    FALSE_PROMOTION_BLOCKED: "FALSE_PROMOTION_BLOCKED"
  });

  const EAST_RESULT_CLASS = Object.freeze({
    NOT_DISPATCHED: "NOT_DISPATCHED",
    MISSING_API: "MISSING_API",
    WAITING_RESPONSE: "WAITING_RESPONSE",
    HELD_PACKET: "HELD_PACKET",
    ATLAS_EVIDENCE: "ATLAS_EVIDENCE",
    FALSE_PROMOTION_BLOCKED: "FALSE_PROMOTION_BLOCKED"
  });

  const CANVAS_CHILD_SEQUENCE = Object.freeze([
    "CANVAS_EAST_API",
    "CANVAS_EAST_ATLAS_EVIDENCE",
    "CANVAS_WEST_API",
    "CANVAS_WEST_INSPECTION_EVIDENCE",
    "CANVAS_SOUTH_API",
    "CANVAS_SOUTH_VISIBLE_PROOF"
  ]);

  const REQUIRED_RELEASE = Object.freeze({
    routeConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    routeConductorReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    canvasReleaseAuthorized: true,
    canvasReleasePacketReady: true,
    westCanvasReleaseApproved: true,
    westHardBlock: false,
    carrierHostAdmissibilityReady: true,
    indexPairReady: true,
    handoffTo: "CANVAS",
    destinationFile: TARGET_FILE,
    cycleNumber: 2,
    cycleRoute: CYCLE_2_ROUTE
  });

  const EAST_REQUIRED_METHODS = Object.freeze([
    "buildAtlas",
    "sample",
    "read",
    "getReceipt"
  ]);

  const FINAL_FALSE = Object.freeze({
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByCanvasParent: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    expressionPortBuilt: false,
    expressionPacketAccepted: false,
    expressionComplete: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,

    currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    lineageRouteConductorReceipt: LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
    macroWestRequiredContract: MACRO_WEST_CONTRACT,
    currentEastContract: CURRENT_EAST_CONTRACT,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: "canvas-local-station-diagnostic-bridge-alignment",

    canvasLocalStationActive: true,
    childDistributionSwitchboardActive: true,
    releaseAcceptanceActive: true,
    eastDispatchActive: true,
    canvasChildAggregationActive: true,
    routeConductorSummarySurfaceActive: true,
    diagnosticBridgeActive: true,
    diagnosticReceiptBridgeActive: true,
    expressionBridgeHeld: true,
    expressionPortsBuilt: false,
    expressionLaneSeparateFromReceiptLane: true,
    receiptProvesExpressionDoesNotReplaceExpression: true,

    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationChronologyFirst: true,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,

    currentCanvasParentObserved: true,
    currentCanvasParentContractObserved: true,
    currentCanvasParentContract: CONTRACT,
    currentCanvasParentIsLocalStation: true,
    currentCanvasParentIsV11_4: true,
    previousCanvasParentContract: PREVIOUS_CONTRACT,
    baselineCanvasParentContract: BASELINE_CONTRACT,
    canvasParentBootMethodAvailable: true,
    v10_3BaselineRecognizedOnly: false,

    routeConductorObserved: false,
    routeConductorContractKnown: false,
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorContractRecognized: false,
    routeConductorCurrentV9_3Recognized: false,
    routeConductorLineageV9_2Observed: false,
    routeConductorLineageV9_2AuthorityAccepted: false,
    routeConductorAuthoritySourceAlias: "NONE",
    routeConductorAuthoritySourceMethod: "NONE",
    routeConductorReleaseAuthorityAccepted: false,
    routeConductorReleasePacketObserved: false,
    routeConductorReleasePacketValid: false,

    diagnosticRailObserved: false,
    diagnosticRailContract: "",
    diagnosticRailReceipt: "",
    diagnosticRailLastPrimaryCase: "",
    diagnosticRailLastRunStatus: "",
    diagnosticRailSummaryAvailable: false,
    diagnosticBridgeSummaryStatus: "WAITING_ROUTE_CONDUCTOR_AND_DIAGNOSTIC_RECEIPT_COMPARISON",
    diagnosticBridgeMismatch: "UNKNOWN",
    diagnosticBridgeFirstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",
    diagnosticBridgeRecommendedNextFile: ROUTE_FILE,

    observedDatasetRouteConductorContract: "",
    observedDatasetRouteConductorReceipt: "",
    observedDatasetReleasePacket: null,
    observedGlobalRouteConductorContract: "",
    observedGlobalRouteConductorReceipt: "",
    observedGlobalReleasePacket: null,
    observedFallbackRouteConductorContract: "",
    observedFallbackRouteConductorReceipt: "",
    observedFallbackRouteConductorAlias: "NONE",
    datasetIsReportingOnlyNotAuthority: true,
    datasetReleaseAuthorityBlocked: false,
    globalFallbackIsObservationOnlyUnlessCurrentV9_3: true,
    globalReleaseAuthorityBlocked: false,
    fallbackAliasesAreObservationOnly: true,

    releasePacketObserved: false,
    releasePacketValid: false,
    releasePacketAccepted: false,
    acceptedReleaseSource: RELEASE_SOURCE.NONE,
    releasePacketAuthoritySource: "NONE",
    releasePacketIntakeMethod: "NONE",
    routeConductorReleasePacket: null,
    candidateReleasePacket: null,
    candidateReleaseIntakeMethod: "NONE",
    normalizedReleasePacket: null,
    releaseValidationFailures: [],
    firstReleaseValidationFailure: "",

    canvasParentReleaseObserved: false,
    canvasParentReleaseAccepted: false,
    canvasParentReleaseLawful: false,
    parentReleaseLawful: false,
    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseHeldReason: "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",
    canvasParentReleaseGateReady: false,
    parentAcceptedRouteConductorRelease: false,

    parentReleasePacketComposed: false,
    parentReleasePacketPublishedForEast: false,
    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,
    eastDispatchAuthorized: false,
    eastDispatchPacketPublished: false,
    eastDispatchAttempted: false,
    eastDispatchMethod: "NONE",
    handoffTo: "NONE",

    eastObserved: false,
    eastApiReady: false,
    eastRequiredMethodsPresent: false,
    eastResponseClass: EAST_RESULT_CLASS.NOT_DISPATCHED,
    eastResponseObserved: false,
    eastResponseReceived: false,
    eastResponse: null,
    canvasEastHeldPacketRecognized: false,
    canvasEastEvidenceReady: false,
    canvasEastF13AtlasPacketReady: false,
    canvasEastFalsePromotionBlocked: false,
    canvasEastFalsePromotionReasons: [],

    westObserved: false,
    westApiReady: false,
    canvasWestInspectionReady: false,
    canvasWestEvidenceReady: false,

    southObserved: false,
    southApiReady: false,
    canvasSouthVisibleProofReady: false,
    canvasSouthEvidenceReady: false,
    canvasSouthHardFail: false,
    canvasSouthProofStale: false,

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
    f13StrictEvidenceGap: "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",
    f13StrictEvidenceRepairTarget: ROUTE_FILE,

    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,

    routeConductorNotified: false,
    routeConductorNotifyMethod: "NONE",
    routeConductorNotificationError: "",

    firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",
    recommendedNextFile: ROUTE_FILE,
    recommendedNextRenewalTarget: ROUTE_FILE,
    canvasNextAuditTarget: ROUTE_FILE,
    postgameStatus: "CANVAS_LOCAL_STATION_WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",

    lastEastDispatchPacket: null,
    lastEastReceipt: null,
    lastWestReceipt: null,
    lastSouthReceipt: null,
    lastCanvasStationSummary: null,
    lastDiagnosticBridgeSummary: null,
    lastRouteConductorAuthorityReceipt: null,
    lastChildPacket: null,
    childPackets: [],
    localEvents: [],
    errors: [],

    bootAuditComplete: false,
    publishedAt: "",
    updatedAt: "",

    ...FINAL_FALSE
  };

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function own(value, key) {
    return Boolean(value) && Object.prototype.hasOwnProperty.call(value, key);
  }

  function hasRealValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
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

  function sameText(a, b) {
    return safeString(a).trim() === safeString(b).trim();
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

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_LOCAL_STATION_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_LOCAL_STATION_ERROR"),
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
    return hasRealValue(value) ? value : fallback;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readFirstDataset(keys, fallback = undefined) {
    for (const key of keys || []) {
      const value = datasetValue(key, "");
      if (hasRealValue(value)) return value;
    }
    return fallback;
  }

  function safeInvoke(source, methodName, args = []) {
    if (!source || !isFunction(source[methodName])) return null;

    try {
      return source[methodName](...args);
    } catch (error) {
      recordError("SAFE_INVOKE_FAILED", error, { methodName });
      return null;
    }
  }

  function candidateFromApi(source, methodName) {
    if (!source || !isFunction(source[methodName])) return null;
    return safeInvoke(source, methodName);
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getReceiptLight",
      "getReceipt",
      "getCarrierReceipt",
      "readStructuralCarrier",
      "getStructuralCarrier",
      "getCanvasCarrier",
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

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function readCurrentRouteConductorAuthorityAliases() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR")],
      ["HEARTH.routeConductorControlOwnershipPassiveWatchdogRepair", readPath("HEARTH.routeConductorControlOwnershipPassiveWatchdogRepair")],
      ["DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepair", readPath("DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepair")],
      ["HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR", readPath("HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR")],
      ["HEARTH.routeConductorNorthStarCompletionCycleGovernor", readPath("HEARTH.routeConductorNorthStarCompletionCycleGovernor")],
      ["DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor", readPath("DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor")],
      ["HEARTH_ROUTE_CONDUCTOR", readPath("HEARTH_ROUTE_CONDUCTOR")],
      ["HEARTH.routeConductor", readPath("HEARTH.routeConductor")],
      ["DEXTER_LAB.hearthRouteConductor", readPath("DEXTER_LAB.hearthRouteConductor")],
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT")],
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3")],
      ["HEARTH.routeConductorControlOwnershipPassiveWatchdogRepairReceipt", readPath("HEARTH.routeConductorControlOwnershipPassiveWatchdogRepairReceipt")],
      ["DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepairReceipt", readPath("DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepairReceipt")],
      ["HEARTH_ROUTE_CONDUCTOR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_RECEIPT")],
      ["HEARTH.routeConductorReceipt", readPath("HEARTH.routeConductorReceipt")],
      ["DEXTER_LAB.hearthRouteConductorReceipt", readPath("DEXTER_LAB.hearthRouteConductorReceipt")]
    ];
  }

  function readRouteConductorLineageAliases() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT")],
      ["HEARTH.routeConductorNorthStarCompletionCycleGovernorReceipt", readPath("HEARTH.routeConductorNorthStarCompletionCycleGovernorReceipt")],
      ["DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernorReceipt", readPath("DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernorReceipt")]
    ];
  }

  function readRouteConductorFallbackAliases() {
    return [
      ["HEARTH_SOUTH_ROUTE_CONDUCTOR", readPath("HEARTH_SOUTH_ROUTE_CONDUCTOR")],
      ["HEARTH.southRouteConductor", readPath("HEARTH.southRouteConductor")],
      ["DEXTER_LAB.hearthSouthRouteConductor", readPath("DEXTER_LAB.hearthSouthRouteConductor")],
      ["HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT", readPath("HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT")],
      ["HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT", readPath("HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT")],
      ["HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment", readPath("HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment")],
      ["DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment", readPath("DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment")]
    ];
  }

  function readContractReceiptPair(candidate) {
    if (!candidate) return { contract: "", receipt: "", body: null };

    const receiptBody = readReceipt(candidate) || (isObject(candidate) ? candidate : null);

    const contract = safeString(
      (receiptBody && (receiptBody.contract || receiptBody.CONTRACT || receiptBody.routeConductorContract || receiptBody.sourceContract)) ||
      (isObject(candidate) && (candidate.contract || candidate.CONTRACT || candidate.routeConductorContract)) ||
      "",
      ""
    );

    const receipt = safeString(
      (receiptBody && (receiptBody.receipt || receiptBody.RECEIPT || receiptBody.routeConductorReceipt || receiptBody.sourceReceipt)) ||
      (isObject(candidate) && (candidate.receipt || candidate.RECEIPT || candidate.routeConductorReceipt)) ||
      "",
      ""
    );

    return { contract, receipt, body: receiptBody };
  }

  function isCurrentRouteConductorPair(contract, receipt) {
    return contract === CURRENT_ROUTE_CONDUCTOR_CONTRACT && receipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT;
  }

  function isLineageRouteConductorPair(contract, receipt) {
    return contract === LINEAGE_ROUTE_CONDUCTOR_CONTRACT && receipt === LINEAGE_ROUTE_CONDUCTOR_RECEIPT;
  }

  function isAuthorityObject(candidate) {
    return Boolean(
      isObject(candidate) &&
      (
        isFunction(candidate.getCanvasReleasePacket) ||
        isFunction(candidate.getReleasePacket) ||
        isFunction(candidate.getCanvasHandoffPacket) ||
        isFunction(candidate.getHandoffPacket) ||
        isFunction(candidate.getReceipt) ||
        isFunction(candidate.getReceiptLight)
      )
    );
  }

  function readRouteConductorProfile(_input = {}) {
    const currentAliases = readCurrentRouteConductorAuthorityAliases();
    const lineageAliases = readRouteConductorLineageAliases();
    const fallbackAliases = readRouteConductorFallbackAliases();

    let observed = false;
    let contract = "";
    let receipt = "";
    let currentRecognized = false;
    let lineageObserved = false;
    let sourceAlias = "NONE";
    let sourceMethod = "NONE";
    let authorityObject = null;
    let authorityReceipt = null;

    for (const [alias, candidate] of currentAliases) {
      if (!candidate) continue;

      observed = true;
      const pair = readContractReceiptPair(candidate);

      if (!contract && pair.contract) contract = pair.contract;
      if (!receipt && pair.receipt) receipt = pair.receipt;

      if (isCurrentRouteConductorPair(pair.contract, pair.receipt)) {
        currentRecognized = true;
        sourceAlias = alias;
        sourceMethod = "CURRENT_V9_3_AUTHORITY_ALIAS";
        authorityObject = isAuthorityObject(candidate) ? candidate : null;
        authorityReceipt = clonePlain(pair.body || candidate);
        break;
      }
    }

    for (const [alias, candidate] of lineageAliases) {
      if (!candidate) continue;

      const pair = readContractReceiptPair(candidate);
      if (isLineageRouteConductorPair(pair.contract, pair.receipt)) {
        lineageObserved = true;
        if (!observed) {
          observed = true;
          contract = pair.contract;
          receipt = pair.receipt;
          sourceAlias = alias;
          sourceMethod = "LINEAGE_V9_2_OBSERVATION_ONLY";
          authorityReceipt = clonePlain(pair.body || candidate);
        }
        break;
      }
    }

    let fallbackContract = "";
    let fallbackReceipt = "";
    let fallbackAlias = "NONE";

    for (const [alias, candidate] of fallbackAliases) {
      if (!candidate) continue;

      const pair = readContractReceiptPair(candidate);
      if (!fallbackContract && pair.contract) fallbackContract = pair.contract;
      if (!fallbackReceipt && pair.receipt) fallbackReceipt = pair.receipt;
      if (fallbackAlias === "NONE" && (pair.contract || pair.receipt)) fallbackAlias = alias;

      if (!observed) observed = true;
    }

    const observedDatasetContract = safeString(readFirstDataset([
      "hearthRouteConductorContract",
      "hearthSouthRouteConductorContract",
      "routeConductorContract"
    ], ""), "");

    const observedDatasetReceipt = safeString(readFirstDataset([
      "hearthRouteConductorReceipt",
      "hearthSouthRouteConductorReceipt",
      "routeConductorReceipt"
    ], ""), "");

    if (isCurrentRouteConductorPair(observedDatasetContract, observedDatasetReceipt)) {
      observed = true;
      if (!currentRecognized) {
        contract = observedDatasetContract;
        receipt = observedDatasetReceipt;
      }
    }

    state.routeConductorObserved = observed;
    state.routeConductorContractKnown = Boolean(contract);
    state.routeConductorContract = contract;
    state.routeConductorReceipt = receipt;
    state.routeConductorContractRecognized = currentRecognized;
    state.routeConductorCurrentV9_3Recognized = currentRecognized;
    state.routeConductorLineageV9_2Observed = lineageObserved;
    state.routeConductorLineageV9_2AuthorityAccepted = false;
    state.routeConductorAuthoritySourceAlias = sourceAlias;
    state.routeConductorAuthoritySourceMethod = sourceMethod;
    state.lastRouteConductorAuthorityReceipt = authorityReceipt;

    state.observedFallbackRouteConductorContract = fallbackContract;
    state.observedFallbackRouteConductorReceipt = fallbackReceipt;
    state.observedFallbackRouteConductorAlias = fallbackAlias;
    state.observedDatasetRouteConductorContract = observedDatasetContract;
    state.observedDatasetRouteConductorReceipt = observedDatasetReceipt;

    return {
      observed,
      contractKnown: Boolean(contract),
      contract,
      receipt,
      contractRecognized: currentRecognized,
      routeConductorCurrentV9_3Recognized: currentRecognized,
      routeConductorLineageV9_2Observed: lineageObserved,
      routeConductorLineageV9_2AuthorityAccepted: false,
      authoritySourceAlias: sourceAlias,
      authoritySourceMethod: sourceMethod,
      authorityObject,
      authorityReceipt: clonePlain(authorityReceipt),
      observedFallbackRouteConductorContract: fallbackContract,
      observedFallbackRouteConductorReceipt: fallbackReceipt,
      observedFallbackRouteConductorAlias: fallbackAlias,
      observedDatasetRouteConductorContract: observedDatasetContract,
      observedDatasetRouteConductorReceipt: observedDatasetReceipt
    };
  }

  function releaseEvidenceKeyPresent(value, keys) {
    if (!isObject(value)) return false;

    for (const key of keys) {
      if (own(value, key) && hasRealValue(value[key])) return true;
    }

    return false;
  }

  function hasUsefulReleaseShape(value) {
    if (!isObject(value)) return false;

    return Boolean(
      releaseEvidenceKeyPresent(value, [
        "routeConductorContract",
        "routeConductorReceipt",
        "sourceContract",
        "sourceReceipt",
        "contract",
        "receipt",
        "canvasReleaseAuthorized",
        "canvasReleasePacketReady",
        "westCanvasReleaseApproved",
        "westHardBlock",
        "carrierHostAdmissibilityReady",
        "indexPairReady",
        "handoffTo",
        "destinationFile",
        "targetFile",
        "cycleNumber",
        "cycleRoute",
        "firstFailedCoordinate",
        "recommendedNextFile",
        "recommendedNextRenewalTarget",
        "postgameStatus"
      ]) ||
      isObject(value.releasePacket) ||
      isObject(value.canvasReleasePacket) ||
      isObject(value.routeConductorReleasePacket)
    );
  }

  function extractNestedReleasePacket(value) {
    if (!isObject(value)) return null;

    const keys = [
      "canvasReleasePacket",
      "releasePacket",
      "routeConductorReleasePacket",
      "southRouteConductorReleasePacket",
      "canvasParentReleasePacket",
      "canvasHandoffPacket",
      "handoffPacket",
      "releaseToCanvasPacket",
      "canvasRelease",
      "packet"
    ];

    for (const key of keys) {
      const nested = value[key];
      if (isObject(nested) && hasUsefulReleaseShape(nested)) return nested;
    }

    if (isObject(value.options)) {
      const nested = extractNestedReleasePacket(value.options);
      if (nested) return nested;
    }

    if (isObject(value.receipt)) {
      const nested = extractNestedReleasePacket(value.receipt);
      if (nested) return nested;
      if (hasUsefulReleaseShape(value.receipt)) return value.receipt;
    }

    if (isObject(value.dataset)) {
      const nested = extractNestedReleasePacket(value.dataset);
      if (nested) return nested;
      if (hasUsefulReleaseShape(value.dataset)) return value.dataset;
    }

    if (hasUsefulReleaseShape(value)) return value;

    return null;
  }

  function markAuthorityReleasePacket(packet, source, method) {
    state.releasePacketObserved = Boolean(packet);
    state.acceptedReleaseSource = packet ? source : RELEASE_SOURCE.NONE;
    state.releasePacketAuthoritySource = packet ? source : "NONE";
    state.releasePacketIntakeMethod = packet ? method : "NONE";
    state.routeConductorReleasePacket = packet ? clonePlain(packet) : null;
    state.routeConductorReleasePacketObserved = Boolean(packet);
    return packet || null;
  }

  function markCandidateReleasePacket(packet, source, method) {
    state.candidateReleasePacket = packet ? clonePlain(packet) : null;
    state.candidateReleaseIntakeMethod = packet ? method : "NONE";
    state.releasePacketObserved = Boolean(packet);
    state.acceptedReleaseSource = source || RELEASE_SOURCE.NONE;
    state.releasePacketAuthoritySource = source || RELEASE_SOURCE.NONE;
    state.releasePacketIntakeMethod = packet ? method : "NONE";
    state.routeConductorReleasePacket = packet ? clonePlain(packet) : null;
    state.routeConductorReleasePacketObserved = Boolean(packet);
    return packet || null;
  }

  function readOptionsPacket(options) {
    const extracted = extractNestedReleasePacket(options);
    if (!extracted) return null;
    return markCandidateReleasePacket(extracted, RELEASE_SOURCE.OPTIONS_TEST, "OPTIONS_TEST_CANDIDATE");
  }

  function readDatasetPacketObservation() {
    const fieldMap = {
      routeConductorContract: ["routeConductorContract", "hearthRouteConductorContract", "hearthSouthRouteConductorContract"],
      routeConductorReceipt: ["routeConductorReceipt", "hearthRouteConductorReceipt", "hearthSouthRouteConductorReceipt"],
      canvasReleaseAuthorized: ["canvasReleaseAuthorized", "hearthCanvasReleaseAuthorized", "hearthSouthCanvasReleaseAuthorized", "hearthRouteConductorCanvasReleaseAuthorized"],
      canvasReleasePacketReady: ["canvasReleasePacketReady", "hearthCanvasReleasePacketReady", "hearthSouthCanvasReleasePacketReady", "hearthRouteConductorCanvasReleasePacketReady"],
      westCanvasReleaseApproved: ["westCanvasReleaseApproved", "hearthWestCanvasReleaseApproved", "hearthSouthWestCanvasReleaseApproved", "hearthRouteConductorWestCanvasReleaseApproved"],
      westHardBlock: ["westHardBlock", "hearthWestHardBlock", "hearthSouthWestHardBlock", "hearthRouteConductorWestHardBlock"],
      carrierHostAdmissibilityReady: ["carrierHostAdmissibilityReady", "hearthCarrierHostAdmissibilityReady", "hearthSouthCarrierHostAdmissibilityReady", "hearthRouteConductorCarrierHostAdmissibilityReady"],
      indexPairReady: ["indexPairReady", "hearthIndexPairReady", "hearthSouthIndexPairReady", "hearthRouteConductorIndexPairReady"],
      handoffTo: ["handoffTo", "hearthHandoffTo", "hearthSouthHandoffTo", "hearthRouteConductorHandoffTo"],
      destinationFile: ["destinationFile", "targetFile", "hearthDestinationFile", "hearthTargetFile", "hearthSouthDestinationFile", "hearthSouthTargetFile", "hearthRouteConductorDestinationFile", "hearthRouteConductorTargetFile"],
      cycleNumber: ["cycleNumber", "hearthCycleNumber", "hearthSouthCycleNumber", "hearthRouteConductorCycleNumber"],
      cycleRoute: ["cycleRoute", "hearthCycleRoute", "hearthSouthCycleRoute", "hearthRouteConductorCycleRoute"]
    };

    const packet = { source: "DOCUMENT_DATASET_RELEASE_OBSERVATION_ONLY" };
    let hasAnyRealDatasetValue = false;

    Object.keys(fieldMap).forEach((normalizedKey) => {
      const value = readFirstDataset(fieldMap[normalizedKey]);
      if (hasRealValue(value)) {
        packet[normalizedKey] = value;
        hasAnyRealDatasetValue = true;
      }
    });

    if (!hasAnyRealDatasetValue || !hasUsefulReleaseShape(packet)) {
      state.observedDatasetReleasePacket = null;
      return null;
    }

    state.observedDatasetReleasePacket = clonePlain(packet);
    state.datasetReleaseAuthorityBlocked = true;
    return packet;
  }

  function readGlobalReleaseObservation() {
    const globalSources = [
      readPath("HEARTH.canvasReleasePacket"),
      readPath("HEARTH.routeConductorCanvasReleasePacket"),
      readPath("HEARTH.routeConductorReleasePacket"),
      readPath("HEARTH.southRouteConductorReleasePacket"),
      readPath("HEARTH.canvasParentReleasePacket"),
      readPath("DEXTER_LAB.hearthRouteConductorReceipt"),
      readPath("DEXTER_LAB.hearthSouthRouteConductorReceipt"),
      root.HEARTH_CANVAS_RELEASE_PACKET,
      root.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET,
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET,
      root.HEARTH_ROUTE_CONDUCTOR_RECEIPT,
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT
    ];

    for (const source of globalSources) {
      const extracted = extractNestedReleasePacket(source);
      if (extracted) {
        state.observedGlobalReleasePacket = clonePlain(extracted);
        state.globalReleaseAuthorityBlocked = true;

        const contract = safeString(extracted.routeConductorContract || extracted.sourceContract || extracted.contract || "");
        const receipt = safeString(extracted.routeConductorReceipt || extracted.sourceReceipt || extracted.receipt || "");
        if (contract) state.observedGlobalRouteConductorContract = contract;
        if (receipt) state.observedGlobalRouteConductorReceipt = receipt;

        return extracted;
      }
    }

    state.observedGlobalReleasePacket = null;
    return null;
  }

  function readRouteConductorReleasePacket(options = {}) {
    const route = readRouteConductorProfile(options || {});

    if (route.routeConductorCurrentV9_3Recognized && route.authorityObject) {
      const methods = [
        "getCanvasReleasePacket",
        "getReleasePacket",
        "getCanvasHandoffPacket",
        "getHandoffPacket",
        "getRoutePrimaryGateReceipt",
        "getRouteCycleReceipt",
        "getReceiptLight",
        "getReceipt"
      ];

      for (const method of methods) {
        const result = candidateFromApi(route.authorityObject, method);
        const extracted = extractNestedReleasePacket(result);

        if (extracted) {
          return markAuthorityReleasePacket(extracted, RELEASE_SOURCE.ROUTE_CONDUCTOR_CURRENT_V9_3_API, `ROUTE_CONDUCTOR_V9_3_API:${method}`);
        }
      }
    }

    if (route.routeConductorCurrentV9_3Recognized && route.authorityReceipt) {
      const extracted = extractNestedReleasePacket(route.authorityReceipt);
      if (extracted) {
        return markAuthorityReleasePacket(extracted, RELEASE_SOURCE.ROUTE_CONDUCTOR_CURRENT_V9_3_RECEIPT, "ROUTE_CONDUCTOR_V9_3_RECEIPT_ALIAS");
      }
    }

    const optionPacket = readOptionsPacket(options);
    if (optionPacket) return optionPacket;

    readGlobalReleaseObservation();
    readDatasetPacketObservation();

    return markAuthorityReleasePacket(null, RELEASE_SOURCE.NONE, "NONE");
  }

  function normalizeReleasePacket(packet) {
    if (!isObject(packet)) {
      state.normalizedReleasePacket = null;
      return null;
    }

    const normalized = {
      routeConductorContract: safeString(packet.routeConductorContract || packet.sourceContract || packet.contract || ""),
      routeConductorReceipt: safeString(packet.routeConductorReceipt || packet.sourceReceipt || packet.receipt || ""),
      canvasReleaseAuthorized: safeBool(packet.canvasReleaseAuthorized, false),
      canvasReleasePacketReady: safeBool(packet.canvasReleasePacketReady, false),
      westCanvasReleaseApproved: safeBool(packet.westCanvasReleaseApproved, false),
      westHardBlock: safeBool(packet.westHardBlock, false),
      carrierHostAdmissibilityReady: safeBool(packet.carrierHostAdmissibilityReady, false),
      indexPairReady: safeBool(packet.indexPairReady, false),
      handoffTo: safeString(packet.handoffTo || packet.handoff || ""),
      destinationFile: safeString(packet.destinationFile || packet.targetFile || ""),
      cycleNumber: safeNumber(packet.cycleNumber || packet.activeCycleNumber, 0),
      cycleRoute: safeString(packet.cycleRoute || packet.activeCycleRoute || packet.routeCycle || ""),
      source: safeString(packet.source || packet.releaseSource || "ROUTE_CONDUCTOR_RELEASE_PACKET"),
      firstFailedCoordinate: safeString(packet.firstFailedCoordinate || ""),
      recommendedNextFile: safeString(packet.recommendedNextFile || ""),
      recommendedNextRenewalTarget: safeString(packet.recommendedNextRenewalTarget || ""),
      postgameStatus: safeString(packet.postgameStatus || ""),
      original: clonePlain(packet)
    };

    state.normalizedReleasePacket = clonePlain(normalized);
    return normalized;
  }

  function validationFailureToCoordinate(failure) {
    const map = {
      ROUTE_CONDUCTOR_V9_3_NOT_RECOGNIZED: "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",
      RELEASE_PACKET_MISSING: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
      releaseSource: "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY",
      routeConductorContract: "WAITING_ROUTE_CONDUCTOR_V9_3_RELEASE_CONTRACT",
      routeConductorReceipt: "WAITING_ROUTE_CONDUCTOR_V9_3_RELEASE_RECEIPT",
      canvasReleaseAuthorized: "WAITING_CANVAS_RELEASE_AUTHORIZATION",
      canvasReleasePacketReady: "WAITING_CANVAS_RELEASE_PACKET_READY",
      westCanvasReleaseApproved: "WAITING_WEST_CANVAS_RELEASE_APPROVAL",
      westHardBlock: "UPSTREAM_WEST_HARD_BLOCK",
      carrierHostAdmissibilityReady: "WAITING_CARRIER_HOST_ADMISSIBILITY",
      indexPairReady: "WAITING_INDEX_PAIR_READY",
      handoffTo: "WAITING_HANDOFF_TO_CANVAS",
      destinationFile: "WAITING_CANVAS_RELEASE_DESTINATION",
      cycleNumber: "WAITING_CYCLE_TWO_CANVAS_ROUTE",
      cycleRoute: "WAITING_CYCLE_TWO_CANVAS_ROUTE"
    };

    return map[failure] || "WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
  }

  function sourceCanBeAccepted(source, packet) {
    if (
      source === RELEASE_SOURCE.ROUTE_CONDUCTOR_CURRENT_V9_3_API ||
      source === RELEASE_SOURCE.ROUTE_CONDUCTOR_CURRENT_V9_3_RECEIPT
    ) {
      return true;
    }

    if (
      source === RELEASE_SOURCE.DIRECT_ROUTE_CONDUCTOR_CANDIDATE ||
      source === RELEASE_SOURCE.OPTIONS_TEST
    ) {
      return Boolean(
        state.routeConductorCurrentV9_3Recognized &&
        isObject(packet) &&
        packet.routeConductorContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT &&
        packet.routeConductorReceipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT
      );
    }

    return false;
  }

  function validateReleasePacket(packet) {
    const failures = [];

    if (!state.routeConductorCurrentV9_3Recognized) {
      failures.push("ROUTE_CONDUCTOR_V9_3_NOT_RECOGNIZED");
    }

    if (!isObject(packet)) {
      failures.push("RELEASE_PACKET_MISSING");
    } else {
      if (!sourceCanBeAccepted(state.acceptedReleaseSource, packet)) failures.push("releaseSource");
      if (packet.routeConductorContract !== REQUIRED_RELEASE.routeConductorContract) failures.push("routeConductorContract");
      if (packet.routeConductorReceipt !== REQUIRED_RELEASE.routeConductorReceipt) failures.push("routeConductorReceipt");
      if (packet.canvasReleaseAuthorized !== true) failures.push("canvasReleaseAuthorized");
      if (packet.canvasReleasePacketReady !== true) failures.push("canvasReleasePacketReady");
      if (packet.westCanvasReleaseApproved !== true) failures.push("westCanvasReleaseApproved");
      if (packet.westHardBlock !== false) failures.push("westHardBlock");
      if (packet.carrierHostAdmissibilityReady !== true) failures.push("carrierHostAdmissibilityReady");
      if (packet.indexPairReady !== true) failures.push("indexPairReady");
      if (!sameText(packet.handoffTo, REQUIRED_RELEASE.handoffTo)) failures.push("handoffTo");
      if (!sameText(packet.destinationFile, REQUIRED_RELEASE.destinationFile)) failures.push("destinationFile");
      if (safeNumber(packet.cycleNumber, 0) !== REQUIRED_RELEASE.cycleNumber) failures.push("cycleNumber");
      if (!sameText(packet.cycleRoute, REQUIRED_RELEASE.cycleRoute)) failures.push("cycleRoute");
    }

    state.releaseValidationFailures = failures.slice();
    state.firstReleaseValidationFailure = failures[0] || "";
    state.releasePacketValid = failures.length === 0;
    state.routeConductorReleasePacketValid = state.releasePacketValid;

    return state.releasePacketValid;
  }

  function clearReleaseAcceptance(reason, coordinate, target) {
    state.releasePacketAccepted = false;
    state.routeConductorReleaseAuthorityAccepted = false;
    state.canvasParentReleaseObserved = false;
    state.canvasParentReleaseAccepted = false;
    state.canvasParentReleaseLawful = false;
    state.parentReleaseLawful = false;
    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseHeldReason = reason;
    state.canvasParentReleaseGateReady = false;
    state.parentAcceptedRouteConductorRelease = false;

    state.parentReleasePacketComposed = false;
    state.parentReleasePacketPublishedForEast = false;
    state.parentReleasePacketSentToEast = false;
    state.parentReleasePacketLawful = false;
    state.eastDispatchAuthorized = false;
    state.eastDispatchPacketPublished = false;
    state.eastDispatchAttempted = false;
    state.eastDispatchMethod = "NONE";
    state.handoffTo = "NONE";
    state.lastEastDispatchPacket = null;

    state.firstFailedCoordinate = coordinate;
    state.recommendedNextFile = target;
    state.recommendedNextRenewalTarget = target;
    state.canvasNextAuditTarget = target;
    state.postgameStatus = `CANVAS_LOCAL_STATION_${coordinate}`;

    refreshParentReleaseGateMarkers();
    return false;
  }

  function acceptRelease(packet) {
    if (!state.routeConductorCurrentV9_3Recognized) {
      return clearReleaseAcceptance(
        "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",
        "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION",
        ROUTE_FILE
      );
    }

    if (!state.releasePacketObserved) {
      return clearReleaseAcceptance(
        "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
        "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
        ROUTE_FILE
      );
    }

    if (!sourceCanBeAccepted(state.acceptedReleaseSource, packet)) {
      return clearReleaseAcceptance(
        "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY",
        "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY",
        ROUTE_FILE
      );
    }

    if (!state.releasePacketValid || !isObject(packet)) {
      return clearReleaseAcceptance(
        "ROUTE_CONDUCTOR_RELEASE_PACKET_INVALID",
        validationFailureToCoordinate(state.firstReleaseValidationFailure),
        ROUTE_FILE
      );
    }

    state.releasePacketAccepted = true;
    state.routeConductorReleaseAuthorityAccepted = true;
    state.canvasParentReleaseObserved = true;
    state.canvasParentReleaseAccepted = true;
    state.canvasParentReleaseLawful = true;
    state.parentReleaseLawful = true;
    state.canvasReleaseAuthorized = true;
    state.canvasReleasePacketReady = true;
    state.canvasReleaseHeldReason = "NONE_CANVAS_PARENT_RELEASE_ACCEPTED";

    refreshParentReleaseGateMarkers();

    state.firstFailedCoordinate = "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.canvasNextAuditTarget = FILE;
    state.postgameStatus = "CANVAS_LOCAL_STATION_RELEASE_ACCEPTED_PREPARING_EAST_DISPATCH";

    return true;
  }

  function refreshParentReleaseGateMarkers() {
    const ready = Boolean(
      state.routeConductorCurrentV9_3Recognized &&
      state.routeConductorReleaseAuthorityAccepted &&
      state.releasePacketObserved &&
      state.releasePacketValid &&
      state.releasePacketAccepted &&
      state.canvasParentReleaseObserved &&
      state.canvasParentReleaseAccepted &&
      state.canvasParentReleaseLawful &&
      state.parentReleaseLawful &&
      state.canvasReleaseAuthorized &&
      state.canvasReleasePacketReady
    );

    state.canvasParentReleaseGateReady = ready;
    state.parentAcceptedRouteConductorRelease = ready;

    return ready;
  }

  function composeEastDispatchPacket() {
    if (!(
      state.routeConductorCurrentV9_3Recognized &&
      state.routeConductorReleaseAuthorityAccepted &&
      state.releasePacketObserved &&
      state.releasePacketValid &&
      state.releasePacketAccepted &&
      state.canvasParentReleaseAccepted &&
      state.parentReleaseLawful &&
      state.canvasReleaseAuthorized &&
      state.canvasReleasePacketReady &&
      state.canvasParentReleaseGateReady
    )) {
      state.parentReleasePacketComposed = false;
      state.parentReleasePacketPublishedForEast = false;
      state.parentReleasePacketLawful = false;
      state.lastEastDispatchPacket = null;
      return null;
    }

    const packet = {
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      previousParentContract: PREVIOUS_CONTRACT,
      sourceFile: FILE,
      targetFile: EAST_FILE,
      destinationFile: EAST_FILE,
      handoffTo: "EAST",
      receivedFrom: "CANVAS_PARENT",

      routeConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      routeConductorReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
      routeConductorCurrentV9_3Recognized: true,
      routeConductorLineageV9_2Observed: state.routeConductorLineageV9_2Observed,
      routeConductorLineageV9_2AuthorityAccepted: false,
      routeConductorReleaseAuthorityAccepted: true,
      parentAcceptedRouteConductorRelease: true,

      cycleNumber: 2,
      cycleRoute: CYCLE_2_ROUTE,
      activeCycleNumber: 2,
      activeCycleRoute: CYCLE_2_ROUTE,
      activeFibonacci: "F13P",
      eastActiveFibonacci: "F13E",

      canvasParentReleaseObserved: true,
      canvasParentReleaseAccepted: true,
      canvasParentReleaseLawful: true,
      canvasParentReleaseGateReady: true,
      parentReleaseLawful: true,
      parentReleasePacketLawful: true,
      parentReleasePacketSentToEast: true,

      canvasReleaseAuthorized: true,
      canvasReleasePacketReady: true,
      eastDispatchAuthorized: true,
      eastDispatchPacketPublished: true,

      westCanvasReleaseApproved: true,
      westHardBlock: false,

      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      atlasBuildRequested: true,
      f13AtlasBuildRequested: true,
      buildAtlasRequested: true,

      expressionPortBuilt: false,
      expressionPacketAccepted: false,
      expressionComplete: false,
      expressionBridgeHeld: true,
      canvasEastApiReadinessDoesNotRequireAtlasEvidence: true,
      heldEastPacketDoesNotDemoteApiReadiness: true,
      missingMaterialDoesNotDemoteApiReadiness: true,

      ...FINAL_FALSE
    };

    state.parentReleasePacketComposed = true;
    state.parentReleasePacketLawful = true;
    state.lastEastDispatchPacket = clonePlain(packet);

    return packet;
  }

  function getLastEastDispatchPacket() {
    return clonePlain(state.lastEastDispatchPacket);
  }

  function publishEastDispatchPacket(packet) {
    if (!isObject(packet) || !state.parentReleasePacketLawful) {
      state.eastDispatchPacketPublished = false;
      return false;
    }

    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasParentEastDispatchPacket = clonePlain(packet);
    hearth.canvasEastDispatchPacket = clonePlain(packet);
    lab.hearthCanvasParentEastDispatchPacket = clonePlain(packet);
    lab.hearthCanvasEastDispatchPacket = clonePlain(packet);

    root.HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET = clonePlain(packet);
    root.HEARTH_CANVAS_EAST_DISPATCH_PACKET = clonePlain(packet);

    state.parentReleasePacketPublishedForEast = true;
    state.eastDispatchPacketPublished = true;
    state.eastDispatchAuthorized = true;
    state.handoffTo = "EAST";

    return true;
  }

  function readCanvasChild(kind) {
    const aliases = {
      east: [
        "HEARTH_CANVAS_EAST",
        "HEARTH_CANVAS_EAST_SOURCE",
        "HEARTH_CANVAS_EAST_AUTHORITY",
        "HEARTH_CANVAS_EAST_EVIDENCE",
        "HEARTH_CANVAS_EAST_ENGINE",
        "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION",
        "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR",
        "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE",
        "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION",
        "HEARTH_CANVAS_EAST_SOUTH_MATH_FORWARD_ATLAS_EXPRESSION",
        "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE",
        "HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastSource",
        "HEARTH.canvasEastAuthority",
        "HEARTH.canvasEastEvidence",
        "HEARTH.canvasEastEngine",
        "HEARTH.canvasEastCurrentLocalStationV111ApiPublication",
        "HEARTH.canvasEastSameRuntimeExposureBeaconApiPublication",
        "HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
        "HEARTH.canvasEastF13AtlasSourceChild",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastSource",
        "DEXTER_LAB.hearthCanvasEastAuthority",
        "DEXTER_LAB.hearthCanvasEastEvidence",
        "DEXTER_LAB.hearthCanvasEastEngine",
        "DEXTER_LAB.hearthCanvasEastCurrentLocalStationV111ApiPublication",
        "DEXTER_LAB.hearthCanvasEastSameRuntimeExposureBeaconApiPublication",
        "DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
        "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild"
      ],
      west: [
        "HEARTH_CANVAS_WEST",
        "HEARTH_CANVAS_WEST_AUTHORITY",
        "HEARTH_CANVAS_WEST_EVIDENCE",
        "HEARTH_CANVAS_WEST_ENGINE",
        "HEARTH.canvasWest",
        "HEARTH.canvasWestAuthority",
        "HEARTH.canvasWestEvidence",
        "HEARTH.canvasWestEngine",
        "HEARTH.canvasWestInspectionInvalidationControl",
        "HEARTH.canvasWestF13NInspectionViewInvalidationChild",
        "DEXTER_LAB.hearthCanvasWest",
        "DEXTER_LAB.hearthCanvasWestAuthority",
        "DEXTER_LAB.hearthCanvasWestEvidence",
        "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl"
      ],
      south: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH_CANVAS_SOUTH_AUTHORITY",
        "HEARTH_CANVAS_SOUTH_EVIDENCE",
        "HEARTH_CANVAS_SOUTH_ENGINE",
        "HEARTH.canvasSouth",
        "HEARTH.canvasSouthAuthority",
        "HEARTH.canvasSouthEvidence",
        "HEARTH.canvasSouthEngine",
        "HEARTH.canvasSouthTextureSphereVisibleProof",
        "HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardening",
        "HEARTH.canvasSouthF13STextureRenderVisibleProofChild",
        "DEXTER_LAB.hearthCanvasSouth",
        "DEXTER_LAB.hearthCanvasSouthAuthority",
        "DEXTER_LAB.hearthCanvasSouthEvidence",
        "DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof",
        "DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild"
      ]
    };

    for (const name of aliases[kind] || []) {
      const found = readPath(name);
      if (found) return found;
    }

    return null;
  }

  function childHasMethods(child, methods) {
    if (!child || !isObject(child)) return false;
    return methods.every((method) => isFunction(child[method]));
  }

  function packetHasFinalClaim(packet) {
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
      upperText(packet.proofScope).includes("FINAL") ||
      upperText(packet.scope).includes("FINAL") ||
      upperText(packet.claimScope).includes("FINAL")
    );
  }

  function hasAtlasEvidence(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.f13AtlasPacketReady === true ||
      packet.atlasBuildComplete === true ||
      packet.atlasCanvasPresent === true ||
      packet.atlasReady === true ||
      packet.canvasEastEvidenceReady === true ||
      packet.canvasEastF13AtlasPacketReady === true ||
      packet.f13SourceStageComplete === true ||
      packet.packetType === "CANVAS_EAST_F13_ATLAS_EVIDENCE_PACKET"
    );
  }

  function isHeldEastPacket(packet) {
    if (!isObject(packet)) return false;

    const coordinate = safeString(packet.firstFailedCoordinate);

    return Boolean(
      packet.heldAtlasPacketReturned === true ||
      packet.synchronousHeldPacketActive === true ||
      packet.heldPacketWasSynchronous === true ||
      packet.heldDoesNotMeanApiMissing === true ||
      (packet.permissionClass && safeString(packet.permissionClass).includes("HELD")) ||
      coordinate.includes("WAITING") ||
      packet.f13BuildBlockedReason
    );
  }

  function falsePromotionReasons(packet) {
    if (!isObject(packet)) return [];

    const reasons = [];

    if (packet.visualPassClaimed === true) reasons.push("visualPassClaimed");
    if (packet.readyTextAllowed === true) reasons.push("readyTextAllowed");
    if (packet.f21EligibleForNorth === true) reasons.push("f21EligibleForNorth");
    if (packet.f21SubmittedToNorth === true) reasons.push("f21SubmittedToNorth");
    if (packet.completionLatched === true) reasons.push("completionLatched");
    if (packet.finalCompletionLatched === true) reasons.push("finalCompletionLatched");
    if (packet.degradedCompletionLatched === true) reasons.push("degradedCompletionLatched");

    if (packetHasFinalClaim(packet) && !hasAtlasEvidence(packet)) {
      reasons.push("FINAL_CLAIM_WITHOUT_ATLAS_EVIDENCE");
    }

    return reasons;
  }

  function classifyEastResponse(response) {
    state.eastResponseObserved = response !== null && response !== undefined;
    state.eastResponseReceived = isObject(response);
    state.eastResponse = isObject(response) ? clonePlain(response) : response;

    if (!state.eastObserved || !state.eastApiReady) {
      state.eastResponseClass = EAST_RESULT_CLASS.MISSING_API;
      state.canvasEastEvidenceReady = false;
      state.canvasEastF13AtlasPacketReady = false;
      state.canvasEastHeldPacketRecognized = false;
      state.canvasEastFalsePromotionBlocked = false;
      state.canvasEastFalsePromotionReasons = [];
      return state.eastResponseClass;
    }

    if (!isObject(response)) {
      state.eastResponseClass = EAST_RESULT_CLASS.WAITING_RESPONSE;
      return state.eastResponseClass;
    }

    const promotion = falsePromotionReasons(response);

    if (promotion.length) {
      state.canvasEastFalsePromotionBlocked = true;
      state.canvasEastFalsePromotionReasons = promotion.slice();
      state.eastResponseClass = EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED;
      return state.eastResponseClass;
    }

    if (hasAtlasEvidence(response)) {
      state.canvasEastEvidenceReady = true;
      state.canvasEastF13AtlasPacketReady = true;
      state.canvasEastHeldPacketRecognized = false;
      state.eastResponseClass = EAST_RESULT_CLASS.ATLAS_EVIDENCE;
      return state.eastResponseClass;
    }

    if (isHeldEastPacket(response)) {
      state.canvasEastHeldPacketRecognized = true;
      state.canvasEastEvidenceReady = false;
      state.canvasEastF13AtlasPacketReady = false;
      state.eastResponseClass = EAST_RESULT_CLASS.HELD_PACKET;
      return state.eastResponseClass;
    }

    state.eastResponseClass = EAST_RESULT_CLASS.WAITING_RESPONSE;
    return state.eastResponseClass;
  }

  function dispatchEast(packet) {
    if (!isObject(packet) || !state.parentReleasePacketLawful) {
      state.eastDispatchAttempted = false;
      state.eastDispatchMethod = "NONE";
      return null;
    }

    publishEastDispatchPacket(packet);

    state.eastDispatchAttempted = true;
    state.parentReleasePacketSentToEast = true;
    state.parentReleasePacketLawful = true;

    const east = readCanvasChild("east");
    let response = null;

    if (isObject(east)) {
      state.eastObserved = true;

      const methods = [
        "receiveParentDispatchPacket",
        "receiveEastDispatchPacket",
        "receiveDispatchPacket",
        "receiveParentPacket",
        "receiveReleasePacket",
        "receiveCanvasParentPacket",
        "receiveParentReleasePacket",
        "buildAtlas",
        "read",
        "getReceipt",
        "getReceiptLight"
      ];

      for (const method of methods) {
        if (!isFunction(east[method])) continue;

        state.eastDispatchMethod = method;
        response = method === "getReceipt" || method === "getReceiptLight"
          ? safeInvoke(east, method)
          : safeInvoke(east, method, [clonePlain(packet)]);

        break;
      }

      state.eastRequiredMethodsPresent = childHasMethods(east, EAST_REQUIRED_METHODS);
      state.eastApiReady = Boolean(
        state.eastRequiredMethodsPresent ||
        methods.some((method) => isFunction(east[method]))
      );
    } else if (isFunction(east)) {
      state.eastObserved = true;
      state.eastApiReady = true;
      state.eastRequiredMethodsPresent = false;
      state.eastDispatchMethod = "function";
      try {
        response = east(clonePlain(packet));
      } catch (error) {
        recordError("EAST_FUNCTION_DISPATCH_FAILED", error);
        response = null;
      }
    } else {
      state.eastObserved = false;
      state.eastApiReady = false;
      state.eastRequiredMethodsPresent = false;
      state.eastDispatchMethod = "MISSING_EAST_AUTHORITY";
    }

    classifyEastResponse(response);
    return response;
  }

  function scanEast() {
    const east = readCanvasChild("east");
    const receipt = readReceipt(east) || {};
    state.lastEastReceipt = clonePlain(receipt);

    const methodReady = childHasMethods(east, EAST_REQUIRED_METHODS);
    const apiReady = Boolean(
      methodReady ||
      safeBool(receipt.canvasEastApiReady, false) ||
      safeBool(receipt.requiredApiSurfaceComplete, false) ||
      (safeBool(receipt.buildAtlasAvailable, false) &&
        safeBool(receipt.sampleAvailable, false) &&
        safeBool(receipt.readAvailable, false) &&
        safeBool(receipt.getReceiptAvailable, false)) ||
      datasetValue("hearthCanvasEastApiReady") === "true" ||
      datasetValue("hearthCanvasEastRequiredApiSurfaceComplete") === "true"
    );

    const evidenceReady = Boolean(
      hasAtlasEvidence(receipt) ||
      state.canvasEastEvidenceReady ||
      datasetValue("hearthCanvasEastEvidenceReady") === "true" ||
      datasetValue("hearthCanvasEastF13AtlasPacketReady") === "true"
    );

    const heldReady = Boolean(
      isHeldEastPacket(receipt) ||
      state.canvasEastHeldPacketRecognized ||
      datasetValue("hearthCanvasEastHeldDoesNotMeanApiMissing") === "true" ||
      datasetValue("hearthCanvasEastHeldAtlasPacketReturned") === "true"
    );

    const promotion = falsePromotionReasons(receipt);

    state.eastObserved = Boolean(east || apiReady);
    state.eastRequiredMethodsPresent = methodReady;
    state.eastApiReady = apiReady;
    state.canvasEastEvidenceReady = evidenceReady;
    state.canvasEastF13AtlasPacketReady = evidenceReady;
    state.canvasEastHeldPacketRecognized = Boolean(heldReady && apiReady && !evidenceReady);
    state.canvasEastFalsePromotionBlocked = promotion.length > 0 || state.canvasEastFalsePromotionBlocked;
    if (promotion.length) state.canvasEastFalsePromotionReasons = promotion.slice();

    return {
      child: east,
      receipt,
      observed: state.eastObserved,
      apiReady: state.eastApiReady,
      requiredMethodsPresent: state.eastRequiredMethodsPresent,
      evidenceReady: state.canvasEastEvidenceReady,
      heldPacketRecognized: state.canvasEastHeldPacketRecognized,
      falsePromotionBlocked: state.canvasEastFalsePromotionBlocked,
      status: !state.eastApiReady
        ? CHILD_STATUS.MISSING_API
        : state.canvasEastFalsePromotionBlocked
          ? CHILD_STATUS.FALSE_PROMOTION_BLOCKED
          : state.canvasEastEvidenceReady
            ? CHILD_STATUS.EVIDENCE_READY
            : state.canvasEastHeldPacketRecognized
              ? CHILD_STATUS.HELD_PACKET_API_READY
              : CHILD_STATUS.API_READY_EVIDENCE_WAIT
    };
  }

  function scanWest() {
    const west = readCanvasChild("west");
    const receipt = readReceipt(west) || {};
    state.lastWestReceipt = clonePlain(receipt);

    const apiReady = Boolean(
      childHasMethods(west, ["getReceipt"]) ||
      Boolean(west && (
        isFunction(west.bindInspection) ||
        isFunction(west.getViewState) ||
        isFunction(west.setRotation) ||
        isFunction(west.setZoom) ||
        isFunction(west.inspect) ||
        isFunction(west.getInspectionPacket) ||
        isFunction(west.getInspectionReceipt)
      )) ||
      safeBool(receipt.canvasWestApiReady, false) ||
      safeBool(receipt.canvasWestReady, false) ||
      datasetValue("hearthCanvasWestApiReady") === "true"
    );

    const inspectionReady = Boolean(
      apiReady &&
      (
        safeBool(receipt.canvasWestInspectionReady, false) ||
        safeBool(receipt.canvasWestEvidenceReady, false) ||
        safeBool(receipt.f13nInspectionReady, false) ||
        safeBool(receipt.inspectionReady, false) ||
        safeBool(receipt.dragInspectionBound, false) ||
        safeBool(receipt.zoomInspectionBound, false) ||
        datasetValue("hearthCanvasWestInspectionReady") === "true" ||
        state.canvasWestInspectionReady
      )
    );

    state.westObserved = Boolean(west || apiReady);
    state.westApiReady = apiReady;
    state.canvasWestInspectionReady = inspectionReady;
    state.canvasWestEvidenceReady = inspectionReady;

    return {
      child: west,
      receipt,
      observed: state.westObserved,
      apiReady,
      inspectionReady,
      evidenceReady: inspectionReady,
      status: !apiReady
        ? CHILD_STATUS.MISSING_API
        : inspectionReady
          ? CHILD_STATUS.EVIDENCE_READY
          : CHILD_STATUS.API_READY_EVIDENCE_WAIT
    };
  }

  function scanSouth() {
    const south = readCanvasChild("south");
    const receipt = readReceipt(south) || {};
    state.lastSouthReceipt = clonePlain(receipt);

    const apiReady = Boolean(
      childHasMethods(south, ["getReceipt"]) ||
      Boolean(south && (
        isFunction(south.composeTexture) ||
        isFunction(south.renderSphere) ||
        isFunction(south.renderSphereSync) ||
        isFunction(south.getTextureCanvas) ||
        isFunction(south.sampleVisibleContent) ||
        isFunction(south.getVisibleProof) ||
        isFunction(south.getVisibleProofReceipt)
      )) ||
      safeBool(receipt.canvasSouthApiReady, false) ||
      safeBool(receipt.canvasSouthReady, false) ||
      datasetValue("hearthCanvasSouthApiReady") === "true"
    );

    const hardFail = Boolean(
      safeBool(receipt.f13HardFail, false) ||
      safeBool(receipt.visibleContentHardFail, false) ||
      safeBool(receipt.southHardFailObserved, false) ||
      datasetValue("hearthCanvasF13HardFail") === "true"
    );

    const stale = Boolean(
      safeBool(receipt.visibleProofStale, false) ||
      safeBool(receipt.renderFrameStale, false) ||
      safeBool(receipt.textureInvalidated, false)
    );

    const visibleProofReady = Boolean(
      apiReady &&
      !hardFail &&
      !stale &&
      (
        safeBool(receipt.canvasSouthVisibleProofReady, false) ||
        safeBool(receipt.canvasSouthEvidenceReady, false) ||
        safeBool(receipt.visibleContentStrictProof, false) ||
        safeBool(receipt.visiblePlanetAvailable, false) ||
        safeBool(receipt.imageRendered, false) ||
        safeBool(receipt.firstFrameDetected, false) ||
        safeBool(receipt.currentVisibleProofValid, false) ||
        datasetValue("hearthCanvasSouthVisibleProofReady") === "true" ||
        state.canvasSouthVisibleProofReady
      )
    );

    state.southObserved = Boolean(south || apiReady);
    state.southApiReady = apiReady;
    state.canvasSouthHardFail = hardFail;
    state.canvasSouthProofStale = stale;
    state.canvasSouthVisibleProofReady = visibleProofReady;
    state.canvasSouthEvidenceReady = visibleProofReady;

    return {
      child: south,
      receipt,
      observed: state.southObserved,
      apiReady,
      visibleProofReady,
      evidenceReady: visibleProofReady,
      hardFail,
      stale,
      status: hardFail
        ? CHILD_STATUS.HARD_FAIL
        : !apiReady
          ? CHILD_STATUS.MISSING_API
          : visibleProofReady
            ? CHILD_STATUS.EVIDENCE_READY
            : CHILD_STATUS.API_READY_EVIDENCE_WAIT
    };
  }

  function recomputeChildAggregation() {
    const east = scanEast();
    const west = scanWest();
    const south = scanSouth();

    state.allCanvasChildrenApiReady = Boolean(east.apiReady && west.apiReady && south.apiReady);
    state.allCanvasChildrenEvidenceReady = Boolean(
      east.evidenceReady &&
      west.inspectionReady &&
      south.visibleProofReady
    );

    state.allCanvasChildrenReady = Boolean(
      state.allCanvasChildrenApiReady &&
      state.allCanvasChildrenEvidenceReady
    );

    state.f13HardFail = Boolean(
      south.hardFail ||
      east.falsePromotionBlocked ||
      state.canvasEastFalsePromotionBlocked
    );

    state.f13CanvasReadinessObserved = Boolean(
      state.canvasParentReleaseObserved ||
      state.eastDispatchPacketPublished ||
      east.observed ||
      west.observed ||
      south.observed
    );

    state.f13InspectEvidenceAvailable = Boolean(west.inspectionReady);
    state.f13VisibleEvidenceAvailable = Boolean(south.visibleProofReady);

    const releaseAndDispatchReady = Boolean(
      state.canvasParentReleaseAccepted &&
      state.parentReleaseLawful &&
      state.canvasParentReleaseGateReady &&
      state.eastDispatchAuthorized &&
      state.eastDispatchPacketPublished
    );

    state.f13CanvasEvidenceStrict = Boolean(
      releaseAndDispatchReady &&
      east.apiReady &&
      east.evidenceReady &&
      west.apiReady &&
      west.inspectionReady &&
      south.apiReady &&
      south.visibleProofReady &&
      !state.f13HardFail &&
      !state.canvasSouthProofStale
    );

    state.f13CanvasEvidenceDegraded = Boolean(
      !state.f13CanvasEvidenceStrict &&
      releaseAndDispatchReady &&
      east.apiReady &&
      west.apiReady &&
      south.apiReady &&
      !state.f13HardFail &&
      (
        east.evidenceReady ||
        east.heldPacketRecognized ||
        west.inspectionReady ||
        south.visibleProofReady
      )
    );

    state.f13CanvasEvidenceComplete = Boolean(
      state.f13CanvasEvidenceStrict ||
      state.f13CanvasEvidenceDegraded
    );

    resolveF13Gap();

    return {
      east,
      west,
      south,
      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget
    };
  }

  function resolveF13Gap() {
    let gap = "NONE_F13_STRICT_EVIDENCE_COMPLETE";
    let target = NORTH_FILE;
    let status = "CANVAS_LOCAL_STATION_F13_STRICT_EVIDENCE_COMPLETE";

    if (!state.routeConductorCurrentV9_3Recognized) {
      gap = "WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION";
      target = ROUTE_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_ROUTE_CONDUCTOR_V9_3_RECOGNITION";
    } else if (!state.releasePacketObserved) {
      gap = "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
      target = ROUTE_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!sourceCanBeAccepted(state.acceptedReleaseSource, state.normalizedReleasePacket)) {
      gap = "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY";
      target = ROUTE_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY";
    } else if (!state.releasePacketValid) {
      gap = validationFailureToCoordinate(state.firstReleaseValidationFailure);
      target = ROUTE_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_VALID_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.canvasParentReleaseAccepted) {
      gap = "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE";
      target = FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_PARENT_RELEASE_ACCEPTANCE";
    } else if (!state.parentReleaseLawful) {
      gap = "WAITING_CANVAS_PARENT_RELEASE_LAWFUL";
      target = FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_PARENT_RELEASE_LAWFUL";
    } else if (!state.eastDispatchAuthorized || !state.eastDispatchPacketPublished) {
      gap = "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION";
      target = FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_EAST_DISPATCH_PUBLICATION";
    } else if (!state.eastApiReady) {
      gap = "WAITING_CANVAS_EAST_API";
      target = EAST_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_EAST_API";
    } else if (state.canvasEastFalsePromotionBlocked) {
      gap = "EAST_FALSE_PROMOTION_BLOCKED";
      target = EAST_FILE;
      status = "CANVAS_LOCAL_STATION_EAST_FALSE_PROMOTION_BLOCKED";
    } else if (!state.canvasEastEvidenceReady) {
      gap = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      target = EAST_FILE;
      status = "CANVAS_LOCAL_STATION_EAST_API_READY_WAITING_ATLAS_EVIDENCE";
    } else if (!state.westApiReady) {
      gap = "WAITING_CANVAS_WEST_API";
      target = WEST_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_WEST_API";
    } else if (!state.canvasWestInspectionReady) {
      gap = "WAITING_CANVAS_WEST_INSPECTION_EVIDENCE";
      target = WEST_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_WEST_INSPECTION_EVIDENCE";
    } else if (!state.southApiReady) {
      gap = "WAITING_CANVAS_SOUTH_API";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_SOUTH_API";
    } else if (state.canvasSouthHardFail) {
      gap = "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_CANVAS_SOUTH_HARD_FAIL";
    } else if (state.canvasSouthProofStale) {
      gap = "WAITING_CANVAS_SOUTH_CURRENT_NON_STALE_VISIBLE_PROOF";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CURRENT_SOUTH_VISIBLE_PROOF";
    } else if (!state.canvasSouthVisibleProofReady) {
      gap = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
    } else if (!state.f13CanvasEvidenceStrict) {
      gap = "WAITING_CANVAS_F13_STRICT_EVIDENCE";
      target = SOUTH_FILE;
      status = "CANVAS_LOCAL_STATION_WAITING_CANVAS_F13_STRICT_EVIDENCE";
    }

    state.f13StrictEvidenceGap = gap;
    state.f13StrictEvidenceRepairTarget = target;
    state.firstFailedCoordinate = gap;
    state.recommendedNextFile = target;
    state.recommendedNextRenewalTarget = target;
    state.canvasNextAuditTarget = target;
    state.postgameStatus = status;

    return { gap, target, status };
  }

  function readDiagnosticRailSummary() {
    const candidates = [
      readPath("HEARTH_DIAGNOSTIC_RAIL"),
      readPath("HEARTH_PARALLEL_DIAGNOSTIC_RAIL"),
      readPath("HEARTH.diagnosticRail"),
      readPath("HEARTH.parallelDiagnosticRail"),
      readPath("DEXTER_LAB.hearthDiagnosticRail")
    ];

    let apiCandidate = null;
    for (const candidate of candidates) {
      if (candidate && isObject(candidate)) {
        apiCandidate = candidate;
        break;
      }
    }

    const receipt = readReceipt(apiCandidate) || readPath("HEARTH_DIAGNOSTIC_RAIL_RECEIPT") || readPath("HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT") || null;
    const report = apiCandidate && isFunction(apiCandidate.getReport) ? safeInvoke(apiCandidate, "getReport") : null;
    const statePacket = apiCandidate && isFunction(apiCandidate.getState) ? safeInvoke(apiCandidate, "getState") : null;

    state.diagnosticRailObserved = Boolean(apiCandidate || receipt || report || statePacket);
    state.diagnosticRailContract = safeString((receipt && receipt.contract) || (apiCandidate && apiCandidate.contract) || "");
    state.diagnosticRailReceipt = safeString((receipt && receipt.receipt) || (apiCandidate && apiCandidate.receipt) || "");
    state.diagnosticRailLastPrimaryCase = safeString(
      (receipt && receipt.lastPrimaryCase) ||
      (report && report.PRIMARY_CASE) ||
      (statePacket && statePacket.primaryCase) ||
      ""
    );
    state.diagnosticRailLastRunStatus = safeString(
      (receipt && receipt.lastDiagnosticRunStatus) ||
      (statePacket && statePacket.diagnosticRunStatus) ||
      ""
    );
    state.diagnosticRailSummaryAvailable = Boolean(receipt || report || statePacket);

    return {
      observed: state.diagnosticRailObserved,
      contract: state.diagnosticRailContract,
      receipt: state.diagnosticRailReceipt,
      lastPrimaryCase: state.diagnosticRailLastPrimaryCase,
      lastDiagnosticRunStatus: state.diagnosticRailLastRunStatus,
      summaryAvailable: state.diagnosticRailSummaryAvailable,
      receiptObject: clonePlain(receipt),
      reportObject: clonePlain(report),
      stateObject: clonePlain(statePacket)
    };
  }

  function composeDiagnosticBridgeSummary() {
    const diagnostic = readDiagnosticRailSummary();

    const routeCurrent = Boolean(state.routeConductorCurrentV9_3Recognized);
    const canvasCurrent = state.currentCanvasParentContract === CONTRACT;
    const childSideKnown = Boolean(
      state.eastObserved ||
      state.westObserved ||
      state.southObserved ||
      state.allCanvasChildrenApiReady ||
      state.f13CanvasReadinessObserved
    );

    const mismatch = !routeCurrent
      ? "ROUTE_CONDUCTOR_CURRENT_V9_3_NOT_RECOGNIZED"
      : !canvasCurrent
        ? "CANVAS_PARENT_CONTRACT_NOT_CURRENT"
        : "false";

    const summaryStatus = mismatch === "false"
      ? diagnostic.observed
        ? "BRIDGE_ALIGNED_DIAGNOSTIC_AND_CANVAS_SUMMARIES_AVAILABLE"
        : "BRIDGE_ALIGNED_CANVAS_ROUTE_SIDE_ONLY_DIAGNOSTIC_RAIL_NOT_IN_THIS_WINDOW"
      : "BRIDGE_HELD";

    const firstFailed = mismatch === "false"
      ? state.firstFailedCoordinate
      : mismatch;

    const recommended = mismatch === "false"
      ? state.recommendedNextFile
      : mismatch === "ROUTE_CONDUCTOR_CURRENT_V9_3_NOT_RECOGNIZED"
        ? ROUTE_FILE
        : FILE;

    state.diagnosticBridgeSummaryStatus = summaryStatus;
    state.diagnosticBridgeMismatch = mismatch;
    state.diagnosticBridgeFirstFailedCoordinate = firstFailed;
    state.diagnosticBridgeRecommendedNextFile = recommended;

    const bridge = {
      packetType: "HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      diagnosticBridgeActive: true,
      diagnosticReceiptBridgeActive: true,
      bridgePurpose: "ALIGN_DIAGNOSTIC_RECEIPT_WITH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_RECEIPT_BEFORE_EXPRESSION_PORTS",
      expressionBridgeHeld: true,
      expressionPortsBuilt: false,
      expressionPacketAccepted: false,
      expressionComplete: false,

      routeConductorCurrentV9_3Recognized: state.routeConductorCurrentV9_3Recognized,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorLineageV9_2Observed: state.routeConductorLineageV9_2Observed,
      routeConductorLineageV9_2AuthorityAccepted: false,

      canvasParentCurrentContract: CONTRACT,
      canvasParentPreviousContract: PREVIOUS_CONTRACT,
      canvasParentContractCurrent: canvasCurrent,
      canvasLocalStationActive: true,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,

      diagnosticRailObserved: diagnostic.observed,
      diagnosticRailContract: diagnostic.contract,
      diagnosticRailReceipt: diagnostic.receipt,
      diagnosticRailLastPrimaryCase: diagnostic.lastPrimaryCase,
      diagnosticRailLastDiagnosticRunStatus: diagnostic.lastDiagnosticRunStatus,
      diagnosticRailSummaryAvailable: diagnostic.summaryAvailable,

      childSideKnown,
      canvasEastApiReady: state.eastApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasWestApiReady: state.westApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasSouthApiReady: state.southApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,

      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,

      diagnosticBridgeSummaryStatus: summaryStatus,
      diagnosticBridgeMismatch: mismatch,
      firstFailedCoordinate: firstFailed,
      recommendedNextFile: recommended,
      recommendedNextRenewalTarget: recommended,
      bridgeReadyForExpressionPortAudit: Boolean(mismatch === "false"),
      bridgeReadyForExpressionPortBuild: false,

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lastDiagnosticBridgeSummary = clonePlain(bridge);
    return bridge;
  }

  function recomputeParentState() {
    state.timestamp = nowIso();

    readRouteConductorProfile({});
    refreshParentReleaseGateMarkers();
    recomputeChildAggregation();
    composeDiagnosticBridgeSummary();

    Object.assign(state, FINAL_FALSE);
    state.updatedAt = state.timestamp;

    return clonePlain(state);
  }

  function runCanonicalParentSequence(packet, intakeMethod) {
    state.timestamp = nowIso();

    readRouteConductorProfile({});

    if (isObject(packet)) {
      const method = safeString(intakeMethod || "DIRECT_ROUTE_CONDUCTOR_CANDIDATE");

      if (method === "DIRECT_ROUTE_CONDUCTOR_CANDIDATE") {
        markCandidateReleasePacket(packet, RELEASE_SOURCE.DIRECT_ROUTE_CONDUCTOR_CANDIDATE, method);
      } else if (method === "OPTIONS_TEST_CANDIDATE") {
        markCandidateReleasePacket(packet, RELEASE_SOURCE.OPTIONS_TEST, method);
      } else {
        state.releasePacketObserved = true;
        state.routeConductorReleasePacketObserved = true;
        state.releasePacketIntakeMethod = method;
        state.routeConductorReleasePacket = clonePlain(packet);
      }
    }

    const normalized = normalizeReleasePacket(packet);
    const valid = validateReleasePacket(normalized);

    if (valid && acceptRelease(normalized)) {
      const dispatchPacket = composeEastDispatchPacket();
      publishEastDispatchPacket(dispatchPacket);
      dispatchEast(dispatchPacket);
    } else {
      acceptRelease(normalized);
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();

    return getReceipt();
  }

  function consumeRouteConductorReleasePacket(packet) {
    return runCanonicalParentSequence(packet, "DIRECT_ROUTE_CONDUCTOR_CANDIDATE");
  }

  function receiveRouteConductorReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function consumeReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveCanvasReleasePacket(packet) {
    return consumeRouteConductorReleasePacket(packet);
  }

  function receiveEastPacket(packet) {
    classifyEastResponse(packet);
    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();
    return getCanvasStationSummary();
  }

  function receiveWestPacket(packet) {
    if (isObject(packet)) {
      state.lastChildPacket = clonePlain(packet);
      state.childPackets.push(clonePlain(packet));
      trimArray(state.childPackets, 60);

      state.westObserved = true;
      state.westApiReady = true;
      state.canvasWestInspectionReady = Boolean(
        packet.canvasWestInspectionReady === true ||
        packet.canvasWestEvidenceReady === true ||
        packet.f13nInspectionReady === true ||
        packet.inspectionReady === true ||
        state.canvasWestInspectionReady
      );
      state.canvasWestEvidenceReady = state.canvasWestInspectionReady;
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();
    return getCanvasStationSummary();
  }

  function receiveSouthPacket(packet) {
    if (isObject(packet)) {
      state.lastChildPacket = clonePlain(packet);
      state.childPackets.push(clonePlain(packet));
      trimArray(state.childPackets, 60);

      state.southObserved = true;
      state.southApiReady = true;
      state.canvasSouthHardFail = Boolean(packet.f13HardFail === true || packet.visibleContentHardFail === true);
      state.canvasSouthProofStale = Boolean(packet.visibleProofStale === true || packet.textureInvalidated === true);
      state.canvasSouthVisibleProofReady = Boolean(
        !state.canvasSouthHardFail &&
        !state.canvasSouthProofStale &&
        (
          packet.canvasSouthVisibleProofReady === true ||
          packet.canvasSouthEvidenceReady === true ||
          packet.visibleContentStrictProof === true ||
          packet.visiblePlanetAvailable === true ||
          packet.imageRendered === true ||
          state.canvasSouthVisibleProofReady
        )
      );
      state.canvasSouthEvidenceReady = state.canvasSouthVisibleProofReady;
    }

    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();
    return getCanvasStationSummary();
  }

  function receiveChildPacket(packet) {
    if (!isObject(packet)) return false;

    state.lastChildPacket = clonePlain(packet);
    state.childPackets.push(clonePlain(packet));
    trimArray(state.childPackets, 60);

    const sourceFile = safeString(packet.sourceFile || packet.file || "");
    const role = upperText(packet.childRole || packet.sourceRole || packet.role || packet.handoffFrom || packet.receivedFrom);

    if (sourceFile === EAST_FILE || role.includes("EAST")) {
      receiveEastPacket(packet);
    } else if (sourceFile === WEST_FILE || role.includes("WEST")) {
      receiveWestPacket(packet);
    } else if (sourceFile === SOUTH_FILE || role.includes("SOUTH")) {
      receiveSouthPacket(packet);
    } else {
      recomputeParentState();
      updateDataset();
      publishGlobals();
      notifyRouteConductor();
    }

    return true;
  }

  function getCanvasStationSummary() {
    recomputeParentState();

    const summary = {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorReceipt: LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
      macroWestRequiredContract: MACRO_WEST_CONTRACT,
      currentEastContract: CURRENT_EAST_CONTRACT,
      packetType: "CANVAS_LOCAL_STATION_SUMMARY",
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasLocalStationActive: true,
      childDistributionSwitchboardActive: true,
      releaseAcceptanceActive: true,
      eastDispatchActive: true,
      canvasChildAggregationActive: true,
      routeConductorSummarySurfaceActive: true,
      diagnosticBridgeActive: true,
      diagnosticReceiptBridgeActive: true,
      expressionBridgeHeld: true,
      expressionPortsBuilt: false,
      expressionPacketAccepted: false,
      expressionComplete: false,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentIsLocalStation: true,
      currentCanvasParentIsV11_4: true,
      previousCanvasParentContract: PREVIOUS_CONTRACT,
      baselineCanvasParentContract: BASELINE_CONTRACT,
      v10_3BaselineRecognizedOnly: false,
      canvasParentBootMethodAvailable: true,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractKnown: state.routeConductorContractKnown,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorContractRecognized: state.routeConductorContractRecognized,
      routeConductorCurrentV9_3Recognized: state.routeConductorCurrentV9_3Recognized,
      routeConductorLineageV9_2Observed: state.routeConductorLineageV9_2Observed,
      routeConductorLineageV9_2AuthorityAccepted: false,
      routeConductorAuthoritySourceAlias: state.routeConductorAuthoritySourceAlias,
      routeConductorAuthoritySourceMethod: state.routeConductorAuthoritySourceMethod,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,
      routeConductorReleasePacketObserved: state.routeConductorReleasePacketObserved,
      routeConductorReleasePacketValid: state.routeConductorReleasePacketValid,

      observedDatasetRouteConductorContract: state.observedDatasetRouteConductorContract,
      observedDatasetRouteConductorReceipt: state.observedDatasetRouteConductorReceipt,
      observedDatasetReleasePacket: clonePlain(state.observedDatasetReleasePacket),
      observedGlobalRouteConductorContract: state.observedGlobalRouteConductorContract,
      observedGlobalRouteConductorReceipt: state.observedGlobalRouteConductorReceipt,
      observedGlobalReleasePacket: clonePlain(state.observedGlobalReleasePacket),
      observedFallbackRouteConductorContract: state.observedFallbackRouteConductorContract,
      observedFallbackRouteConductorReceipt: state.observedFallbackRouteConductorReceipt,
      observedFallbackRouteConductorAlias: state.observedFallbackRouteConductorAlias,
      datasetIsReportingOnlyNotAuthority: true,
      datasetReleaseAuthorityBlocked: state.datasetReleaseAuthorityBlocked,
      globalFallbackIsObservationOnlyUnlessCurrentV9_3: true,
      globalReleaseAuthorityBlocked: state.globalReleaseAuthorityBlocked,
      fallbackAliasesAreObservationOnly: true,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,
      acceptedReleaseSource: state.acceptedReleaseSource,
      releasePacketAuthoritySource: state.releasePacketAuthoritySource,
      releasePacketIntakeMethod: state.releasePacketIntakeMethod,
      candidateReleaseIntakeMethod: state.candidateReleaseIntakeMethod,
      releaseValidationFailures: state.releaseValidationFailures.slice(),
      firstReleaseValidationFailure: state.firstReleaseValidationFailure,

      canvasParentReleaseObserved: state.canvasParentReleaseObserved,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      canvasParentReleaseLawful: state.canvasParentReleaseLawful,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      parentReleasePacketComposed: state.parentReleasePacketComposed,
      parentReleasePacketPublishedForEast: state.parentReleasePacketPublishedForEast,
      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      eastDispatchAttempted: state.eastDispatchAttempted,
      eastDispatchMethod: state.eastDispatchMethod,
      handoffTo: state.handoffTo,
      getLastEastDispatchPacketAvailable: true,

      canvasEastApiReady: state.eastApiReady,
      canvasEastRequiredMethodsPresent: state.eastRequiredMethodsPresent,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastF13AtlasPacketReady: state.canvasEastF13AtlasPacketReady,
      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastFalsePromotionBlocked: state.canvasEastFalsePromotionBlocked,
      canvasEastFalsePromotionReasons: state.canvasEastFalsePromotionReasons.slice(),
      eastResponseClass: state.eastResponseClass,

      canvasWestApiReady: state.westApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasWestEvidenceReady: state.canvasWestEvidenceReady,

      canvasSouthApiReady: state.southApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      canvasSouthEvidenceReady: state.canvasSouthEvidenceReady,
      canvasSouthHardFail: state.canvasSouthHardFail,
      canvasSouthProofStale: state.canvasSouthProofStale,

      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      diagnosticBridgeSummary: clonePlain(state.lastDiagnosticBridgeSummary || composeDiagnosticBridgeSummary()),
      diagnosticBridgeSummaryStatus: state.diagnosticBridgeSummaryStatus,
      diagnosticBridgeMismatch: state.diagnosticBridgeMismatch,
      diagnosticBridgeFirstFailedCoordinate: state.diagnosticBridgeFirstFailedCoordinate,
      diagnosticBridgeRecommendedNextFile: state.diagnosticBridgeRecommendedNextFile,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      canvasNextAuditTarget: state.canvasNextAuditTarget,
      postgameStatus: state.postgameStatus,

      routeConductorShouldConsumeThisSummary: true,
      routeConductorShouldNotScanChildrenDirectlyAfterV9: true,
      diagnosticRailMayReadThisSummary: true,
      expressionPortBuildHeldUntilBridgeStable: true,

      ...FINAL_FALSE
    };

    state.lastCanvasStationSummary = clonePlain(summary);
    return summary;
  }

  function getCanvasStationReceiptLight() {
    return getCanvasStationSummary();
  }

  function getCanvasStationReceipt() {
    return {
      ...getCanvasStationSummary(),
      packetType: "CANVAS_LOCAL_STATION_RECEIPT",
      routeConductorReleasePacket: clonePlain(state.routeConductorReleasePacket),
      candidateReleasePacket: clonePlain(state.candidateReleasePacket),
      normalizedReleasePacket: clonePlain(state.normalizedReleasePacket),
      lastEastDispatchPacket: getLastEastDispatchPacket(),
      lastEastReceipt: clonePlain(state.lastEastReceipt),
      lastWestReceipt: clonePlain(state.lastWestReceipt),
      lastSouthReceipt: clonePlain(state.lastSouthReceipt),
      lastRouteConductorAuthorityReceipt: clonePlain(state.lastRouteConductorAuthorityReceipt),
      lastDiagnosticBridgeSummary: clonePlain(state.lastDiagnosticBridgeSummary)
    };
  }

  function getDiagnosticBridgeSummary() {
    recomputeParentState();
    return clonePlain(state.lastDiagnosticBridgeSummary || composeDiagnosticBridgeSummary());
  }

  function getDiagnosticBridgeReceipt() {
    return {
      ...getDiagnosticBridgeSummary(),
      packetType: "HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_RECEIPT",
      currentReceipt: true,
      childAggregationSummary: {
        canvasEastApiReady: state.eastApiReady,
        canvasEastEvidenceReady: state.canvasEastEvidenceReady,
        canvasWestApiReady: state.westApiReady,
        canvasWestInspectionReady: state.canvasWestInspectionReady,
        canvasSouthApiReady: state.southApiReady,
        canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
        allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
        allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady
      },
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
      role: "canvas-local-station-structural-carrier",

      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      canvasParentBootMethodAvailable: true,
      canvasLocalStationActive: true,
      childDistributionSwitchboardActive: true,
      releaseAcceptanceActive: true,
      eastDispatchActive: true,
      canvasChildAggregationActive: true,
      diagnosticBridgeActive: true,

      routeConductorCurrentV9_3Recognized: state.routeConductorCurrentV9_3Recognized,
      routeConductorLineageV9_2Observed: state.routeConductorLineageV9_2Observed,
      routeConductorLineageV9_2AuthorityAccepted: false,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,
      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,

      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,

      canvasEastApiReady: state.eastApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasWestApiReady: state.westApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasSouthApiReady: state.southApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,

      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      diagnosticBridgeSummaryStatus: state.diagnosticBridgeSummaryStatus,
      diagnosticBridgeMismatch: state.diagnosticBridgeMismatch,
      diagnosticBridgeFirstFailedCoordinate: state.diagnosticBridgeFirstFailedCoordinate,
      diagnosticBridgeRecommendedNextFile: state.diagnosticBridgeRecommendedNextFile,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

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
      currentReceiptLight: true
    };
  }

  function getReceipt() {
    return {
      ...getCanvasStationReceipt(),
      currentReceipt: true,
      structuralCarrier: getStructuralCarrier(),
      diagnosticBridgeReceipt: getDiagnosticBridgeReceipt(),
      childPackets: clonePlain(state.childPackets),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors)
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getCanvasStationSummary();

    return [
      "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_RECEIPT",
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
      line("role", state.role),
      "",
      "BRIDGE_ALIGNMENT",
      line("diagnosticBridgeActive", true),
      line("diagnosticReceiptBridgeActive", true),
      line("diagnosticBridgeSummaryStatus", r.diagnosticBridgeSummaryStatus),
      line("diagnosticBridgeMismatch", r.diagnosticBridgeMismatch),
      line("diagnosticBridgeFirstFailedCoordinate", r.diagnosticBridgeFirstFailedCoordinate),
      line("diagnosticBridgeRecommendedNextFile", r.diagnosticBridgeRecommendedNextFile),
      line("expressionBridgeHeld", true),
      line("expressionPortsBuilt", false),
      line("expressionPacketAccepted", false),
      line("expressionComplete", false),
      "",
      "ROUTE_CONDUCTOR_ALIGNMENT",
      line("currentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT),
      line("currentRouteConductorRequiredReceipt", CURRENT_ROUTE_CONDUCTOR_RECEIPT),
      line("lineageRouteConductorContract", LINEAGE_ROUTE_CONDUCTOR_CONTRACT),
      line("lineageRouteConductorReceipt", LINEAGE_ROUTE_CONDUCTOR_RECEIPT),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContractKnown", r.routeConductorContractKnown),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorReceipt", r.routeConductorReceipt),
      line("routeConductorContractRecognized", r.routeConductorContractRecognized),
      line("routeConductorCurrentV9_3Recognized", r.routeConductorCurrentV9_3Recognized),
      line("routeConductorLineageV9_2Observed", r.routeConductorLineageV9_2Observed),
      line("routeConductorLineageV9_2AuthorityAccepted", false),
      line("routeConductorAuthoritySourceAlias", r.routeConductorAuthoritySourceAlias),
      line("routeConductorAuthoritySourceMethod", r.routeConductorAuthoritySourceMethod),
      line("routeConductorReleaseAuthorityAccepted", r.routeConductorReleaseAuthorityAccepted),
      "",
      "OBSERVATION_BOUNDARY",
      line("observedFallbackRouteConductorAlias", r.observedFallbackRouteConductorAlias),
      line("observedFallbackRouteConductorContract", r.observedFallbackRouteConductorContract),
      line("observedFallbackRouteConductorReceipt", r.observedFallbackRouteConductorReceipt),
      line("fallbackAliasesAreObservationOnly", r.fallbackAliasesAreObservationOnly),
      line("datasetIsReportingOnlyNotAuthority", r.datasetIsReportingOnlyNotAuthority),
      line("datasetReleaseAuthorityBlocked", r.datasetReleaseAuthorityBlocked),
      line("globalFallbackIsObservationOnlyUnlessCurrentV9_3", r.globalFallbackIsObservationOnlyUnlessCurrentV9_3),
      line("globalReleaseAuthorityBlocked", r.globalReleaseAuthorityBlocked),
      "",
      "RELEASE_INTAKE",
      line("releasePacketObserved", r.releasePacketObserved),
      line("releasePacketValid", r.releasePacketValid),
      line("releasePacketAccepted", r.releasePacketAccepted),
      line("acceptedReleaseSource", r.acceptedReleaseSource),
      line("releasePacketAuthoritySource", r.releasePacketAuthoritySource),
      line("releasePacketIntakeMethod", r.releasePacketIntakeMethod),
      line("candidateReleaseIntakeMethod", r.candidateReleaseIntakeMethod),
      line("releaseValidationFailures", r.releaseValidationFailures.join(",") || "none"),
      "",
      "PARENT_RELEASE",
      line("canvasParentReleaseObserved", r.canvasParentReleaseObserved),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("canvasParentReleaseLawful", r.canvasParentReleaseLawful),
      line("parentReleaseLawful", r.parentReleaseLawful),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason),
      line("canvasParentReleaseGateReady", r.canvasParentReleaseGateReady),
      line("parentAcceptedRouteConductorRelease", r.parentAcceptedRouteConductorRelease),
      "",
      "EAST_DISPATCH",
      line("parentReleasePacketComposed", r.parentReleasePacketComposed),
      line("parentReleasePacketPublishedForEast", r.parentReleasePacketPublishedForEast),
      line("parentReleasePacketSentToEast", r.parentReleasePacketSentToEast),
      line("parentReleasePacketLawful", r.parentReleasePacketLawful),
      line("eastDispatchAuthorized", r.eastDispatchAuthorized),
      line("eastDispatchPacketPublished", r.eastDispatchPacketPublished),
      line("eastDispatchAttempted", r.eastDispatchAttempted),
      line("eastDispatchMethod", r.eastDispatchMethod),
      line("getLastEastDispatchPacketAvailable", true),
      "",
      "CHILD_AGGREGATION",
      line("canvasEastApiReady", r.canvasEastApiReady),
      line("canvasEastRequiredMethodsPresent", r.canvasEastRequiredMethodsPresent),
      line("canvasEastEvidenceReady", r.canvasEastEvidenceReady),
      line("canvasEastF13AtlasPacketReady", r.canvasEastF13AtlasPacketReady),
      line("canvasEastHeldPacketRecognized", r.canvasEastHeldPacketRecognized),
      line("canvasEastFalsePromotionBlocked", r.canvasEastFalsePromotionBlocked),
      line("eastResponseClass", r.eastResponseClass),
      line("canvasWestApiReady", r.canvasWestApiReady),
      line("canvasWestInspectionReady", r.canvasWestInspectionReady),
      line("canvasWestEvidenceReady", r.canvasWestEvidenceReady),
      line("canvasSouthApiReady", r.canvasSouthApiReady),
      line("canvasSouthVisibleProofReady", r.canvasSouthVisibleProofReady),
      line("canvasSouthEvidenceReady", r.canvasSouthEvidenceReady),
      line("canvasSouthHardFail", r.canvasSouthHardFail),
      line("canvasSouthProofStale", r.canvasSouthProofStale),
      line("allCanvasChildrenApiReady", r.allCanvasChildrenApiReady),
      line("allCanvasChildrenEvidenceReady", r.allCanvasChildrenEvidenceReady),
      line("allCanvasChildrenReady", r.allCanvasChildrenReady),
      "",
      "F13_STATUS",
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
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("canvasNextAuditTarget", r.canvasNextAuditTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13EligibleForCanvas", false),
      line("f13ClaimedByCanvasParent", false),
      line("f21EligibleForNorth", false),
      line("f21SubmittedToNorth", false),
      line("f21EligibilitySubmittedToNorth", false),
      line("completionLatched", false),
      line("finalCompletionLatched", false),
      line("degradedCompletionLatched", false),
      line("readyTextAllowed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthCanvasBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasBaselineReceipt", BASELINE_RECEIPT);
    setDataset("hearthCanvasLocalStationActive", "true");
    setDataset("hearthCanvasChildDistributionSwitchboardActive", "true");
    setDataset("hearthCanvasParentV11_4Active", "true");
    setDataset("hearthCanvasParentV11_3_1Superseded", "true");
    setDataset("hearthCanvasParentV10_3BaselineRecognized", "true");
    setDataset("hearthCanvasV10_3BaselineRecognizedOnly", "false");

    setDataset("hearthCanvasDiagnosticBridgeActive", "true");
    setDataset("hearthCanvasDiagnosticReceiptBridgeActive", "true");
    setDataset("hearthCanvasDiagnosticBridgeSummaryStatus", state.diagnosticBridgeSummaryStatus);
    setDataset("hearthCanvasDiagnosticBridgeMismatch", state.diagnosticBridgeMismatch);
    setDataset("hearthCanvasDiagnosticBridgeFirstFailedCoordinate", state.diagnosticBridgeFirstFailedCoordinate);
    setDataset("hearthCanvasDiagnosticBridgeRecommendedNextFile", state.diagnosticBridgeRecommendedNextFile);
    setDataset("hearthCanvasExpressionBridgeHeld", "true");
    setDataset("hearthCanvasExpressionPortsBuilt", "false");
    setDataset("hearthCanvasExpressionPacketAccepted", "false");
    setDataset("hearthCanvasExpressionComplete", "false");

    setDataset("hearthCanvasCurrentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthCanvasCurrentRouteConductorRequiredReceipt", CURRENT_ROUTE_CONDUCTOR_RECEIPT);
    setDataset("hearthCanvasLineageRouteConductorContract", LINEAGE_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthCanvasLineageRouteConductorReceipt", LINEAGE_ROUTE_CONDUCTOR_RECEIPT);
    setDataset("hearthCanvasRouteConductorObserved", String(state.routeConductorObserved));
    setDataset("hearthCanvasRouteConductorContractKnown", String(state.routeConductorContractKnown));
    setDataset("hearthCanvasRouteConductorContract", state.routeConductorContract);
    setDataset("hearthCanvasRouteConductorReceipt", state.routeConductorReceipt);
    setDataset("hearthCanvasRouteConductorContractRecognized", String(state.routeConductorContractRecognized));
    setDataset("hearthCanvasRouteConductorCurrentV93Recognized", String(state.routeConductorCurrentV9_3Recognized));
    setDataset("hearthCanvasRouteConductorLineageV92Observed", String(state.routeConductorLineageV9_2Observed));
    setDataset("hearthCanvasRouteConductorLineageV92AuthorityAccepted", "false");
    setDataset("hearthCanvasRouteConductorReleaseAuthorityAccepted", String(state.routeConductorReleaseAuthorityAccepted));
    setDataset("hearthCanvasRouteConductorAuthoritySourceAlias", state.routeConductorAuthoritySourceAlias);
    setDataset("hearthCanvasRouteConductorAuthoritySourceMethod", state.routeConductorAuthoritySourceMethod);

    setDataset("hearthCanvasObservedDatasetRouteConductorContract", state.observedDatasetRouteConductorContract);
    setDataset("hearthCanvasObservedDatasetRouteConductorReceipt", state.observedDatasetRouteConductorReceipt);
    setDataset("hearthCanvasObservedFallbackRouteConductorAlias", state.observedFallbackRouteConductorAlias);
    setDataset("hearthCanvasObservedFallbackRouteConductorContract", state.observedFallbackRouteConductorContract);
    setDataset("hearthCanvasObservedFallbackRouteConductorReceipt", state.observedFallbackRouteConductorReceipt);
    setDataset("hearthCanvasFallbackAliasesAreObservationOnly", "true");
    setDataset("hearthCanvasDatasetIsReportingOnlyNotAuthority", "true");
    setDataset("hearthCanvasDatasetReleaseAuthorityBlocked", String(state.datasetReleaseAuthorityBlocked));
    setDataset("hearthCanvasGlobalFallbackIsObservationOnlyUnlessCurrentV93", "true");
    setDataset("hearthCanvasGlobalReleaseAuthorityBlocked", String(state.globalReleaseAuthorityBlocked));

    setDataset("hearthCanvasCurrentCanvasParentObserved", "true");
    setDataset("hearthCanvasCurrentCanvasParentContractObserved", "true");
    setDataset("hearthCanvasCurrentCanvasParentContract", CONTRACT);
    setDataset("hearthCanvasParentBootMethodAvailable", "true");

    setDataset("hearthCanvasReleasePacketObserved", String(state.releasePacketObserved));
    setDataset("hearthCanvasReleasePacketValid", String(state.releasePacketValid));
    setDataset("hearthCanvasReleasePacketAccepted", String(state.releasePacketAccepted));
    setDataset("hearthCanvasAcceptedReleaseSource", state.acceptedReleaseSource);
    setDataset("hearthCanvasReleasePacketAuthoritySource", state.releasePacketAuthoritySource);
    setDataset("hearthCanvasReleasePacketIntakeMethod", state.releasePacketIntakeMethod);
    setDataset("hearthCanvasCandidateReleaseIntakeMethod", state.candidateReleaseIntakeMethod);

    setDataset("hearthCanvasParentReleaseObserved", String(state.canvasParentReleaseObserved));
    setDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthCanvasParentReleaseLawful", String(state.canvasParentReleaseLawful));
    setDataset("hearthCanvasParentReleaseGateReady", String(state.canvasParentReleaseGateReady));
    setDataset("hearthCanvasParentAcceptedRouteConductorRelease", String(state.parentAcceptedRouteConductorRelease));
    setDataset("hearthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthCanvasReleasePacketReady", String(state.canvasReleasePacketReady));
    setDataset("hearthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthCanvasParentReleasePacketComposed", String(state.parentReleasePacketComposed));
    setDataset("hearthCanvasParentReleasePacketPublishedForEast", String(state.parentReleasePacketPublishedForEast));
    setDataset("hearthCanvasParentReleasePacketSentToEast", String(state.parentReleasePacketSentToEast));
    setDataset("hearthCanvasParentReleasePacketLawful", String(state.parentReleasePacketLawful));
    setDataset("hearthCanvasEastDispatchAuthorized", String(state.eastDispatchAuthorized));
    setDataset("hearthCanvasEastDispatchPacketPublished", String(state.eastDispatchPacketPublished));
    setDataset("hearthCanvasEastDispatchAttempted", String(state.eastDispatchAttempted));
    setDataset("hearthCanvasEastDispatchMethod", state.eastDispatchMethod);
    setDataset("hearthCanvasGetLastEastDispatchPacketAvailable", "true");

    setDataset("hearthCanvasEastObserved", String(state.eastObserved));
    setDataset("hearthCanvasEastApiReady", String(state.eastApiReady));
    setDataset("hearthCanvasEastRequiredMethodsPresent", String(state.eastRequiredMethodsPresent));
    setDataset("hearthCanvasEastEvidenceReady", String(state.canvasEastEvidenceReady));
    setDataset("hearthCanvasEastF13AtlasPacketReady", String(state.canvasEastF13AtlasPacketReady));
    setDataset("hearthCanvasEastHeldPacketRecognized", String(state.canvasEastHeldPacketRecognized));
    setDataset("hearthCanvasEastFalsePromotionBlocked", String(state.canvasEastFalsePromotionBlocked));
    setDataset("hearthCanvasEastResponseClass", state.eastResponseClass);

    setDataset("hearthCanvasWestObserved", String(state.westObserved));
    setDataset("hearthCanvasWestApiReady", String(state.westApiReady));
    setDataset("hearthCanvasWestInspectionReady", String(state.canvasWestInspectionReady));
    setDataset("hearthCanvasWestEvidenceReady", String(state.canvasWestEvidenceReady));

    setDataset("hearthCanvasSouthObserved", String(state.southObserved));
    setDataset("hearthCanvasSouthApiReady", String(state.southApiReady));
    setDataset("hearthCanvasSouthVisibleProofReady", String(state.canvasSouthVisibleProofReady));
    setDataset("hearthCanvasSouthEvidenceReady", String(state.canvasSouthEvidenceReady));
    setDataset("hearthCanvasSouthHardFail", String(state.canvasSouthHardFail));
    setDataset("hearthCanvasSouthProofStale", String(state.canvasSouthProofStale));

    setDataset("hearthCanvasAllChildrenApiReady", String(state.allCanvasChildrenApiReady));
    setDataset("hearthCanvasAllChildrenEvidenceReady", String(state.allCanvasChildrenEvidenceReady));
    setDataset("hearthCanvasAllChildrenReady", String(state.allCanvasChildrenReady));

    setDataset("hearthCanvasF13ReadinessObserved", String(state.f13CanvasReadinessObserved));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13InspectEvidenceAvailable", String(state.f13InspectEvidenceAvailable));
    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13CanvasEvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13HardFail", String(state.f13HardFail));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasNextAuditTarget", state.canvasNextAuditTarget);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF13EligibleForCanvas", "false");
    setDataset("hearthCanvasF13ClaimedByCanvasParent", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21EligibilitySubmittedToNorth", "false");
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasFinalCompletionLatched", "false");
    setDataset("hearthCanvasDegradedCompletionLatched", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");

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
    hearth.canvasNorth = api;
    hearth.canvasEvidence = api;
    hearth.canvasLocalStation = api;
    hearth.canvasStation = api;
    hearth.canvasChildDistributionSwitchboard = api;
    hearth.canvasParentReleaseAcceptanceEastDispatchSwitchboard = api;
    hearth.canvasDiagnosticBridge = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD = api;
    root.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD = api;
    root.HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD = api;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasChildDistributionSwitchboard = api;
    lab.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard = api;
    lab.hearthCanvasDiagnosticBridge = api;

    const light = getReceiptLight();
    const full = getReceipt();
    const bridge = getDiagnosticBridgeReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_RECEIPT_v11_4 = full;
    root.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT = full;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_RECEIPT = bridge;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_SUMMARY = clonePlain(state.lastDiagnosticBridgeSummary);

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasChildDistributionSwitchboardReceipt = full;
    hearth.canvasDiagnosticBridgeReceipt = bridge;
    hearth.canvasDiagnosticBridgeSummary = clonePlain(state.lastDiagnosticBridgeSummary);

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasChildDistributionSwitchboardReceipt = full;
    lab.hearthCanvasDiagnosticBridgeReceipt = bridge;
    lab.hearthCanvasDiagnosticBridgeSummary = clonePlain(state.lastDiagnosticBridgeSummary);

    hearth.canvasStructuralCarrier = getStructuralCarrier();
    hearth.canvasCarrier = getStructuralCarrier();
    hearth.canvasParentCarrier = getStructuralCarrier();

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

    if (state.lastEastDispatchPacket && state.parentReleasePacketLawful) {
      publishEastDispatchPacket(state.lastEastDispatchPacket);
    }

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function notifyRouteConductor() {
    const summary = getCanvasStationSummary();

    const candidates = [
      readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR"),
      readPath("HEARTH.routeConductorControlOwnershipPassiveWatchdogRepair"),
      readPath("DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepair"),
      readPath("HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR"),
      readPath("HEARTH.routeConductorNorthStarCompletionCycleGovernor"),
      readPath("DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor"),
      readPath("HEARTH.routeConductor"),
      readPath("HEARTH.southRouteConductor"),
      readPath("HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment"),
      readPath("DEXTER_LAB.hearthRouteConductor"),
      readPath("DEXTER_LAB.hearthSouthRouteConductor"),
      readPath("DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment"),
      root.HEARTH_ROUTE_CONDUCTOR,
      root.HEARTH_SOUTH_ROUTE_CONDUCTOR,
      root.HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT
    ];

    const methods = [
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

        try {
          target[method](clonePlain(summary));
          state.routeConductorNotified = true;
          state.routeConductorNotifyMethod = method;
          state.routeConductorNotificationError = "";
          return true;
        } catch (error) {
          state.routeConductorNotificationError = error && error.message ? error.message : String(error);
          recordError("ROUTE_CONDUCTOR_NOTIFICATION_FAILED_NONBLOCKING", error, { method });
          return false;
        }
      }
    }

    state.routeConductorNotified = false;
    state.routeConductorNotifyMethod = "NONE";
    return false;
  }

  function updateDatasetAndReceipt() {
    recomputeParentState();
    updateDataset();
    publishGlobals();
    return getReceipt();
  }

  function bootAudit(options = {}) {
    state.timestamp = nowIso();

    publishGlobals();
    readRouteConductorProfile(options || {});

    const rawPacket = readRouteConductorReleasePacket(options || {});

    if (rawPacket) {
      runCanonicalParentSequence(rawPacket, state.releasePacketIntakeMethod);
    } else {
      recomputeParentState();
      updateDataset();
      publishGlobals();
      notifyRouteConductor();
    }

    state.bootAuditComplete = true;

    record("CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_BOOT_AUDIT_COMPLETE", {
      routeConductorCurrentV9_3Recognized: state.routeConductorCurrentV9_3Recognized,
      routeConductorLineageV9_2Observed: state.routeConductorLineageV9_2Observed,
      routeConductorLineageV9_2AuthorityAccepted: false,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,
      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,
      acceptedReleaseSource: state.acceptedReleaseSource,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      diagnosticBridgeSummaryStatus: state.diagnosticBridgeSummaryStatus,
      expressionBridgeHeld: true,
      expressionPortsBuilt: false,
      getLastEastDispatchPacketAvailable: true,
      canvasEastApiReady: state.eastApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      recommendedNextFile: state.recommendedNextFile,
      visualPassClaimed: false
    });

    return updateDatasetAndReceipt();
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

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,
    CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
    MACRO_WEST_CONTRACT,
    CURRENT_EAST_CONTRACT,
    FILE,
    TARGET_FILE,
    ROUTE_FILE,
    INDEX_FILE,
    EAST_FILE,
    WEST_FILE,
    SOUTH_FILE,
    MACRO_WEST_FILE,
    NORTH_FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,

    REQUIRED_RELEASE,
    RELEASE_SOURCE,
    CHILD_STATUS,
    EAST_RESULT_CLASS,
    CANVAS_CHILD_SEQUENCE,

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

    readRouteConductorProfile,
    readRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveRouteConductorReleasePacket,
    consumeReleasePacket,
    receiveReleasePacket,
    receiveCanvasReleasePacket,

    receiveChildPacket,
    receiveEastPacket,
    receiveWestPacket,
    receiveSouthPacket,

    normalizeReleasePacket,
    validateReleasePacket,
    acceptRelease,
    composeEastDispatchPacket,
    getLastEastDispatchPacket,
    publishEastDispatchPacket,
    dispatchEast,
    classifyEastResponse,

    readCanvasChild,
    scanEast,
    scanWest,
    scanSouth,
    recomputeChildAggregation,
    recomputeParentState,
    resolveF13Gap,

    readDiagnosticRailSummary,
    composeDiagnosticBridgeSummary,
    getDiagnosticBridgeSummary,
    getDiagnosticBridgeReceipt,

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

    publishGlobals,
    updateDataset,
    updateDatasetAndReceipt,
    notifyRouteConductor,

    supportsCanvasLocalStation: true,
    supportsChildDistributionSwitchboard: true,
    supportsRouteConductorReleasePacketIntake: true,
    supportsCurrentRouteConductorV9_3Authority: true,
    supportsLineageRouteConductorV9_2ObservationOnly: true,
    supportsDiagnosticBridgeSummary: true,
    supportsDiagnosticReceiptBridge: true,
    supportsExpressionHeldUntilBridgeStable: true,
    supportsDatasetReportingOnlyNotAuthority: true,
    supportsGlobalObservationOnlyNotAuthority: true,
    supportsFallbackAliasObservationOnly: true,
    supportsPublicReceiverValidatedCandidateIntake: true,
    supportsParentReleaseAcceptance: true,
    supportsEastDispatchPublication: true,
    supportsCanvasChildAggregation: true,
    supportsEastApiEvidenceSeparation: true,
    supportsHeldPacketDoesNotDemoteApi: true,
    supportsRouteConductorSummarySurface: true,
    supportsDatasetFallbackBlankPacketBlock: true,
    supportsLastEastDispatchPacketGetter: true,

    ownsCanvasParentIdentity: true,
    ownsRouteConductorReleasePacketIntake: true,
    ownsParentReleaseAcceptance: true,
    ownsEastDispatchPacket: true,
    ownsCanvasChildDiscovery: true,
    ownsCanvasChildAggregateReadiness: true,
    ownsCanvasStationSummary: true,
    ownsDiagnosticBridgeSummary: true,

    ownsRouteConductorSwitching: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsMacroWestAdmissibility: false,
    ownsEastAtlasTruth: false,
    ownsWestInspectionTruth: false,
    ownsSouthVisibleProofTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsTerrainTruth: false,
    ownsMountainTruth: false,
    ownsExpressionPortBuild: false,
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
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => bootAudit({}), { once: true });
      } else {
        bootAudit({});
      }
    } else {
      bootAudit({});
    }
  } catch (error) {
    recordError("CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_INITIALIZATION_FAILED", error);

    try {
      publishGlobals();
      updateDataset();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
