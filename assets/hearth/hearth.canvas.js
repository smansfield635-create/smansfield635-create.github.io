// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6
// Full-file replacement.
// Canvas Parent / Canvas Local Station / Expression Hub / Finger Manager.
// Purpose:
// - Preserve accepted v11_5 Route Conductor v9_4 Diagnostic Bridge Alignment.
// - Restore and hard-bind the Canvas expansion hub as this file's central duty.
// - Keep /assets/hearth/hearth.canvas.js as the bottleneck manager for downstream Canvas expression fingers.
// - Declare named downstream finger files before they are built, so future renewals can target only newly expanded finger files.
// - Preserve Route Conductor v9_4 recognition.
// - Preserve diagnostic receipt bridge and Canvas local station receipts.
// - Preserve public receiver methods as validated intake surfaces.
// - Preserve East dispatch only after accepted current Route Conductor release.
// - Preserve child aggregation summary for EAST / WEST / SOUTH.
// - Add finger registry, finger intake tracks, finger expression/receipt separation, and hub summary.
// - Keep upstream/backing files locked unless evidence proves the file itself is being expanded or defective.
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
// - terrain/material/hydrology/elevation/mountain truth
// - downstream finger truth
// - F13 latch
// - F21 latch
// - ready text
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6";
  const RECEIPT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_RECEIPT_v11_6";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_RECEIPT_v11_5";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_RECEIPT_v11_4";

  const ACCEPTED_BASELINE_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";
  const ACCEPTED_BASELINE_RECEIPT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT_v10_3";

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";
  const CURRENT_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4";

  const LINEAGE_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3";
  const LINEAGE_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3";

  const LEGACY_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2";
  const LEGACY_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT_v9_2";

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

  const FINGER_ROLES = Object.freeze({
    boundary: "canvas-finger-boundary-shape-track",
    landform: "canvas-finger-landform-mass-track",
    elevation: "canvas-finger-elevation-relief-track",
    material: "canvas-finger-material-surface-track",
    hydrology: "canvas-finger-hydrology-water-track",
    atmosphere: "canvas-finger-atmosphere-air-track",
    lighting: "canvas-finger-lighting-shadow-track",
    composite: "canvas-finger-composite-visible-carrier-track"
  });

  const RELEASE_SOURCE = Object.freeze({
    CURRENT_ROUTE_CONDUCTOR_API: "CURRENT_ROUTE_CONDUCTOR_API",
    CURRENT_ROUTE_CONDUCTOR_RECEIPT: "CURRENT_ROUTE_CONDUCTOR_RECEIPT",
    DIRECT_ROUTE_CONDUCTOR_CANDIDATE: "DIRECT_ROUTE_CONDUCTOR_CANDIDATE",
    OPTIONS_TEST: "OPTIONS_TEST",
    GLOBAL_OBSERVATION: "GLOBAL_OBSERVATION",
    DATASET_OBSERVATION: "DATASET_OBSERVATION",
    LINEAGE_V9_3_OBSERVATION_ONLY: "LINEAGE_V9_3_OBSERVATION_ONLY",
    LEGACY_V9_2_OBSERVATION_ONLY: "LEGACY_V9_2_OBSERVATION_ONLY",
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

  const FINGER_STATUS = Object.freeze({
    DECLARED_WAITING_FILE: "DECLARED_WAITING_FILE",
    AUTHORITY_OBSERVED: "AUTHORITY_OBSERVED",
    API_READY: "API_READY",
    EXPRESSION_PACKET_RECEIVED: "EXPRESSION_PACKET_RECEIVED",
    RECEIPT_PACKET_RECEIVED: "RECEIPT_PACKET_RECEIVED",
    TRACK_READY: "TRACK_READY",
    HELD: "HELD",
    HARD_FAIL: "HARD_FAIL"
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

  const FINGER_REQUIRED_METHODS = Object.freeze([
    "receiveHubPacket",
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
    acceptedBaselineContract: ACCEPTED_BASELINE_CONTRACT,
    acceptedBaselineReceipt: ACCEPTED_BASELINE_RECEIPT,

    currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    lineageRouteConductorReceipt: LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
    legacyRouteConductorContract: LEGACY_ROUTE_CONDUCTOR_CONTRACT,
    legacyRouteConductorReceipt: LEGACY_ROUTE_CONDUCTOR_RECEIPT,
    macroWestRequiredContract: MACRO_WEST_CONTRACT,
    currentEastContract: CURRENT_EAST_CONTRACT,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: "canvas-local-station-expression-hub-finger-manager",

    canvasLocalStationActive: true,
    childDistributionSwitchboardActive: true,
    releaseAcceptanceActive: true,
    eastDispatchActive: true,
    canvasChildAggregationActive: true,
    routeConductorSummarySurfaceActive: true,
    diagnosticBridgeActive: true,
    diagnosticReceiptBridgeActive: true,

    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    namedFingerFilesEmbedded: true,
    downstreamFingerTracksDeclared: true,
    hubOwnsFingerIntake: true,
    hubOwnsFingerRegistry: true,
    hubOwnsFingerSummary: true,
    hubOwnsExpressionBottleneck: true,
    hubDoesNotOwnFingerTruth: true,
    expansionFileRenewalRule: "RENEW_ONLY_THIS_HUB_AND_NEWLY_EXPANDED_FINGER_FILES_UNLESS_EVIDENCE_PROVES_DEFECT",

    expressionBridgeHeld: true,
    expressionLaneSeparateFromReceiptLane: true,
    receiptProvesExpressionDoesNotReplaceExpression: true,
    expressionPacketsSeparatedFromReceipts: true,

    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationChronologyFirst: true,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,
    fingerSequence: FINGER_SEQUENCE.slice(),

    currentCanvasParentObserved: true,
    currentCanvasParentContractObserved: true,
    currentCanvasParentContract: CONTRACT,
    currentCanvasParentIsLocalStation: true,
    currentCanvasParentIsV11_6: true,
    previousCanvasParentContract: PREVIOUS_CONTRACT,
    baselineCanvasParentContract: BASELINE_CONTRACT,
    acceptedBaselineCanvasParentContract: ACCEPTED_BASELINE_CONTRACT,
    canvasParentBootMethodAvailable: true,

    routeConductorObserved: false,
    routeConductorContractKnown: false,
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorContractRecognized: false,
    routeConductorCurrentRecognized: false,
    routeConductorCurrentV9_4Recognized: false,
    routeConductorLineageV9_3Observed: false,
    routeConductorLineageV9_3AuthorityAccepted: false,
    routeConductorLegacyV9_2Observed: false,
    routeConductorLegacyV9_2AuthorityAccepted: false,
    routeConductorAuthoritySourceName: "NONE",
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
    diagnosticBridgeFirstFailedCoordinate: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
    diagnosticBridgeRecommendedNextFile: ROUTE_FILE,

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
    canvasReleaseHeldReason: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
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

    fingerRegistry: {},
    fingerPacketLog: [],
    fingerReceiptLog: [],
    fingerExpressionPacketLog: [],
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,
    allDeclaredFingerTracksReady: false,
    anyFingerTrackActive: false,
    firstFingerGap: "WAITING_FIRST_DOWNSTREAM_FINGER_FILE",
    firstFingerGapFile: FINGER_FILES.boundary,
    nextFingerFile: FINGER_FILES.boundary,
    nextFingerKey: "boundary",
    hubReadyForDownstreamFingerFiles: true,
    hubReadyForFingerPacketIntake: true,
    hubReadyForExpressionPortAudit: true,
    hubReadyForExpressionPortBuild: false,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
    f13StrictEvidenceRepairTarget: ROUTE_FILE,

    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,

    routeConductorNotified: false,
    routeConductorNotifyMethod: "NONE",
    routeConductorNotificationError: "",

    firstFailedCoordinate: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
    recommendedNextFile: ROUTE_FILE,
    recommendedNextRenewalTarget: ROUTE_FILE,
    canvasNextAuditTarget: ROUTE_FILE,
    postgameStatus: "CANVAS_LOCAL_STATION_WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",

    lastEastDispatchPacket: null,
    lastEastReceipt: null,
    lastWestReceipt: null,
    lastSouthReceipt: null,
    lastCanvasStationSummary: null,
    lastDiagnosticBridgeSummary: null,
    lastExpressionHubSummary: null,
    lastExpressionHubReceipt: null,
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

  function camelCaseKey(key) {
    return safeString(key)
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_match, chr) => String(chr).toUpperCase());
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
      event: safeString(event, "CANVAS_EXPRESSION_HUB_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 200);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_EXPRESSION_HUB_ERROR"),
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

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubReceipt",
      "getCanvasExpressionHubReceipt",
      "getFingerReceipt",
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

  function currentRouteConductorSources() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR", readPath("HEARTH_ROUTE_CONDUCTOR")],
      ["HEARTH.routeConductor", readPath("HEARTH.routeConductor")],
      ["DEXTER_LAB.hearthRouteConductor", readPath("DEXTER_LAB.hearthRouteConductor")],
      ["HEARTH_ROUTE_CONDUCTOR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_RECEIPT")],
      ["HEARTH.routeConductorReceipt", readPath("HEARTH.routeConductorReceipt")],
      ["DEXTER_LAB.hearthRouteConductorReceipt", readPath("DEXTER_LAB.hearthRouteConductorReceipt")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT")],
      ["HEARTH.routeConductorCanvasLocalStationBridgeAlignment", readPath("HEARTH.routeConductorCanvasLocalStationBridgeAlignment")],
      ["DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment", readPath("DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT")],
      ["HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4", readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4")],
      ["HEARTH.routeConductorCanvasLocalStationBridgeAlignmentReceipt", readPath("HEARTH.routeConductorCanvasLocalStationBridgeAlignmentReceipt")],
      ["DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignmentReceipt", readPath("DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignmentReceipt")]
    ];
  }

  function lineageRouteConductorSources() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR")],
      ["HEARTH.routeConductorControlOwnershipPassiveWatchdogRepair", readPath("HEARTH.routeConductorControlOwnershipPassiveWatchdogRepair")],
      ["DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepair", readPath("DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepair")],
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT")],
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3")],
      ["HEARTH.routeConductorControlOwnershipPassiveWatchdogRepairReceipt", readPath("HEARTH.routeConductorControlOwnershipPassiveWatchdogRepairReceipt")],
      ["DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepairReceipt", readPath("DEXTER_LAB.hearthRouteConductorControlOwnershipPassiveWatchdogRepairReceipt")]
    ];
  }

  function legacyRouteConductorSources() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR", readPath("HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR")],
      ["HEARTH.routeConductorNorthStarCompletionCycleGovernor", readPath("HEARTH.routeConductorNorthStarCompletionCycleGovernor")],
      ["DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor", readPath("DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor")],
      ["HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT")],
      ["HEARTH.routeConductorNorthStarCompletionCycleGovernorReceipt", readPath("HEARTH.routeConductorNorthStarCompletionCycleGovernorReceipt")],
      ["DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernorReceipt", readPath("DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernorReceipt")]
    ];
  }

  function fallbackRouteConductorSources() {
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

  function isLegacyRouteConductorPair(contract, receipt) {
    return contract === LEGACY_ROUTE_CONDUCTOR_CONTRACT && receipt === LEGACY_ROUTE_CONDUCTOR_RECEIPT;
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

  function readDatasetRouteConductorPair() {
    const contract = safeString(readFirstDataset([
      "routeConductorContract",
      "hearthRouteConductorContract",
      "hearthSouthRouteConductorContract",
      "hearthServedRouteConductorContract",
      "hearthCurrentRouteConductorContract",
      "hearthCanvasCurrentRouteConductorRequiredContract"
    ], ""), "");

    const receipt = safeString(readFirstDataset([
      "routeConductorReceipt",
      "hearthRouteConductorReceipt",
      "hearthSouthRouteConductorReceipt",
      "hearthServedRouteConductorReceipt",
      "hearthCurrentRouteConductorReceipt",
      "hearthCanvasCurrentRouteConductorRequiredReceipt"
    ], ""), "");

    return { contract, receipt };
  }

  function readRouteConductorProfile() {
    const currentSources = currentRouteConductorSources();
    const lineageSources = lineageRouteConductorSources();
    const legacySources = legacyRouteConductorSources();
    const fallbackSources = fallbackRouteConductorSources();

    let observed = false;
    let contract = "";
    let receipt = "";
    let currentRecognized = false;
    let lineageObserved = false;
    let legacyObserved = false;
    let sourceName = "NONE";
    let sourceMethod = "NONE";
    let authorityObject = null;
    let authorityReceipt = null;

    for (const [name, candidate] of currentSources) {
      if (!candidate) continue;

      observed = true;
      const pair = readContractReceiptPair(candidate);

      if (!contract && pair.contract) contract = pair.contract;
      if (!receipt && pair.receipt) receipt = pair.receipt;

      if (isCurrentRouteConductorPair(pair.contract, pair.receipt)) {
        currentRecognized = true;
        sourceName = name;
        sourceMethod = "CURRENT_ROUTE_CONDUCTOR_AUTHORITY_SOURCE";
        authorityObject = isAuthorityObject(candidate) ? candidate : null;
        authorityReceipt = clonePlain(pair.body || candidate);
        break;
      }
    }

    const datasetPair = readDatasetRouteConductorPair();

    if (isCurrentRouteConductorPair(datasetPair.contract, datasetPair.receipt)) {
      observed = true;

      if (!contract) contract = datasetPair.contract;
      if (!receipt) receipt = datasetPair.receipt;

      if (!currentRecognized) {
        currentRecognized = true;
        sourceName = "DOCUMENT_DATASET_CURRENT_ROUTE_CONDUCTOR_CONTRACT";
        sourceMethod = "DATASET_CONTRACT_RECOGNITION_ONLY";
      }
    }

    for (const [name, candidate] of lineageSources) {
      if (!candidate) continue;

      const pair = readContractReceiptPair(candidate);
      if (isLineageRouteConductorPair(pair.contract, pair.receipt)) {
        lineageObserved = true;
        if (!observed) {
          observed = true;
          contract = pair.contract;
          receipt = pair.receipt;
          sourceName = name;
          sourceMethod = "LINEAGE_V9_3_OBSERVATION_ONLY";
          authorityReceipt = clonePlain(pair.body || candidate);
        }
        break;
      }
    }

    for (const [name, candidate] of legacySources) {
      if (!candidate) continue;

      const pair = readContractReceiptPair(candidate);
      if (isLegacyRouteConductorPair(pair.contract, pair.receipt)) {
        legacyObserved = true;
        if (!observed) {
          observed = true;
          contract = pair.contract;
          receipt = pair.receipt;
          sourceName = name;
          sourceMethod = "LEGACY_V9_2_OBSERVATION_ONLY";
          authorityReceipt = clonePlain(pair.body || candidate);
        }
        break;
      }
    }

    let fallbackContract = "";
    let fallbackReceipt = "";
    let fallbackSourceName = "NONE";

    for (const [name, candidate] of fallbackSources) {
      if (!candidate) continue;

      const pair = readContractReceiptPair(candidate);
      if (!fallbackContract && pair.contract) fallbackContract = pair.contract;
      if (!fallbackReceipt && pair.receipt) fallbackReceipt = pair.receipt;
      if (fallbackSourceName === "NONE" && (pair.contract || pair.receipt)) fallbackSourceName = name;

      if (!observed) observed = true;
    }

    state.routeConductorObserved = observed;
    state.routeConductorContractKnown = Boolean(contract);
    state.routeConductorContract = contract;
    state.routeConductorReceipt = receipt;
    state.routeConductorContractRecognized = currentRecognized;
    state.routeConductorCurrentRecognized = currentRecognized;
    state.routeConductorCurrentV9_4Recognized = currentRecognized;
    state.routeConductorLineageV9_3Observed = lineageObserved;
    state.routeConductorLineageV9_3AuthorityAccepted = false;
    state.routeConductorLegacyV9_2Observed = legacyObserved;
    state.routeConductorLegacyV9_2AuthorityAccepted = false;
    state.routeConductorAuthoritySourceName = sourceName;
    state.routeConductorAuthoritySourceMethod = sourceMethod;
    state.lastRouteConductorAuthorityReceipt = authorityReceipt;

    state.observedFallbackRouteConductorContract = fallbackContract;
    state.observedFallbackRouteConductorReceipt = fallbackReceipt;
    state.observedFallbackRouteConductorSourceName = fallbackSourceName;
    state.observedDatasetRouteConductorContract = datasetPair.contract;
    state.observedDatasetRouteConductorReceipt = datasetPair.receipt;

    return {
      observed,
      contractKnown: Boolean(contract),
      contract,
      receipt,
      routeConductorCurrentRecognized: currentRecognized,
      routeConductorCurrentV9_4Recognized: currentRecognized,
      routeConductorLineageV9_3Observed: lineageObserved,
      routeConductorLegacyV9_2Observed: legacyObserved,
      authoritySourceName: sourceName,
      authoritySourceMethod: sourceMethod,
      authorityObject,
      authorityReceipt: clonePlain(authorityReceipt),
      observedDatasetRouteConductorContract: datasetPair.contract,
      observedDatasetRouteConductorReceipt: datasetPair.receipt
    };
  }

  function releaseEvidenceKeyPresent(value, keys) {
    if (!isObject(value)) return false;

    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(value, key) && hasRealValue(value[key])) return true;
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

  function readRouteConductorReleasePacket(options = {}) {
    const route = readRouteConductorProfile();

    if (route.routeConductorCurrentRecognized && route.authorityObject) {
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
        const result = safeInvoke(route.authorityObject, method);
        const extracted = extractNestedReleasePacket(result);

        if (extracted) {
          return markAuthorityReleasePacket(extracted, RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_API, `CURRENT_ROUTE_CONDUCTOR_API:${method}`);
        }
      }
    }

    if (route.routeConductorCurrentRecognized && route.authorityReceipt) {
      const extracted = extractNestedReleasePacket(route.authorityReceipt);
      if (extracted) {
        return markAuthorityReleasePacket(extracted, RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_RECEIPT, "CURRENT_ROUTE_CONDUCTOR_RECEIPT_SOURCE");
      }
    }

    const optionPacket = extractNestedReleasePacket(options);
    if (optionPacket) return markCandidateReleasePacket(optionPacket, RELEASE_SOURCE.OPTIONS_TEST, "OPTIONS_TEST_CANDIDATE");

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

  function sourceCanBeAccepted(source, packet) {
    if (
      source === RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_API ||
      source === RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_RECEIPT
    ) {
      return true;
    }

    if (
      source === RELEASE_SOURCE.DIRECT_ROUTE_CONDUCTOR_CANDIDATE ||
      source === RELEASE_SOURCE.OPTIONS_TEST
    ) {
      return Boolean(
        state.routeConductorCurrentRecognized &&
        isObject(packet) &&
        packet.routeConductorContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT &&
        packet.routeConductorReceipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT
      );
    }

    return false;
  }

  function validationFailureToCoordinate(failure) {
    const map = {
      CURRENT_ROUTE_CONDUCTOR_NOT_RECOGNIZED: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
      RELEASE_PACKET_MISSING: "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET",
      releaseSource: "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY",
      routeConductorContract: "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_CONTRACT",
      routeConductorReceipt: "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_RECEIPT",
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

    return map[failure] || "WAITING_VALID_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
  }

  function validateReleasePacket(packet) {
    const failures = [];

    if (!state.routeConductorCurrentRecognized) failures.push("CURRENT_ROUTE_CONDUCTOR_NOT_RECOGNIZED");

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
    if (!state.routeConductorCurrentRecognized) {
      return clearReleaseAcceptance(
        "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
        "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
        ROUTE_FILE
      );
    }

    if (!state.releasePacketObserved) {
      return clearReleaseAcceptance(
        "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET",
        "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET",
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
        "CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INVALID",
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

    state.firstFailedCoordinate = "WAITING_FIRST_DOWNSTREAM_FINGER_FILE";
    state.recommendedNextFile = FINGER_FILES.boundary;
    state.recommendedNextRenewalTarget = FINGER_FILES.boundary;
    state.canvasNextAuditTarget = FINGER_FILES.boundary;
    state.postgameStatus = "CANVAS_EXPRESSION_HUB_RELEASE_ACCEPTED_WAITING_FIRST_FINGER_FILE";

    return true;
  }

  function refreshParentReleaseGateMarkers() {
    const ready = Boolean(
      state.routeConductorCurrentRecognized &&
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
    if (!state.canvasParentReleaseGateReady) {
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
      routeConductorCurrentRecognized: true,
      routeConductorCurrentV9_4Recognized: true,
      routeConductorLineageV9_3Observed: state.routeConductorLineageV9_3Observed,
      routeConductorLineageV9_3AuthorityAccepted: false,
      routeConductorLegacyV9_2Observed: state.routeConductorLegacyV9_2Observed,
      routeConductorLegacyV9_2AuthorityAccepted: false,
      routeConductorReleaseAuthorityAccepted: true,
      parentAcceptedRouteConductorRelease: true,

      expressionHubActive: true,
      fingerManagerActive: true,
      fingerRegistryActive: true,
      fingerSequence: FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),

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

      expressionHubDoesNotClaimFinalExpression: true,
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

  function createFingerTrack(key, input = {}) {
    const normalizedKey = normalizeFingerKey(key);
    const file = safeString(input.file || FINGER_FILES[normalizedKey] || "");
    const role = safeString(input.role || FINGER_ROLES[normalizedKey] || `canvas-finger-${normalizedKey}-track`);

    return {
      key: normalizedKey,
      file,
      role,
      sequenceIndex: FINGER_SEQUENCE.indexOf(normalizedKey),
      declared: true,
      authorityObserved: false,
      apiReady: false,
      expressionPacketReceived: false,
      receiptPacketReceived: false,
      trackReady: false,
      held: false,
      hardFail: false,
      status: FINGER_STATUS.DECLARED_WAITING_FILE,
      lastAuthoritySourceName: "NONE",
      lastApiMethod: "NONE",
      lastExpressionPacket: null,
      lastReceiptPacket: null,
      lastPacket: null,
      firstGap: "WAITING_DOWNSTREAM_FINGER_FILE",
      nextAction: "BUILD_OR_RENEW_THIS_FINGER_FILE_ONLY",
      ownsTruth: false,
      ownedByHub: false,
      hubManagesTrack: true,
      expressionLaneSeparateFromReceiptLane: true,
      createdAt: nowIso(),
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

  function normalizeFingerKey(value) {
    const raw = safeString(value).trim().toLowerCase();

    if (!raw) return "";
    if (FINGER_FILES[raw]) return raw;

    if (raw.includes("boundary") || raw.includes("shape")) return "boundary";
    if (raw.includes("landform") || raw.includes("landmass") || raw.includes("mass")) return "landform";
    if (raw.includes("elevation") || raw.includes("relief") || raw.includes("height")) return "elevation";
    if (raw.includes("material") || raw.includes("surface")) return "material";
    if (raw.includes("hydrology") || raw.includes("water")) return "hydrology";
    if (raw.includes("atmosphere") || raw.includes("air") || raw.includes("weather")) return "atmosphere";
    if (raw.includes("lighting") || raw.includes("light") || raw.includes("shadow")) return "lighting";
    if (raw.includes("composite") || raw.includes("carrier") || raw.includes("visible")) return "composite";

    return raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

    const role = safeString(packet.role || packet.sourceRole || packet.childRole || packet.packetType || "");
    return normalizeFingerKey(role);
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
      upperText(packet.proofScope).includes("FINAL") ||
      upperText(packet.scope).includes("FINAL") ||
      upperText(packet.claimScope).includes("FINAL")
    );
  }

  function packetHasExpressionContent(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.expressionPacket ||
      packet.expressionPayload ||
      packet.canvasExpressionPacket ||
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
      upperText(packet.packetLane).includes("EXPRESSION") ||
      upperText(packet.packetType).includes("EXPRESSION")
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
      upperText(packet.packetLane).includes("RECEIPT") ||
      upperText(packet.packetType).includes("RECEIPT")
    );
  }

  function registerFinger(definition = {}) {
    const key = normalizeFingerKey(definition.key || definition.fingerKey || definition.name || definition.role || "");
    if (!key) return null;

    const existing = state.fingerRegistry[key] || createFingerTrack(key, definition);
    const merged = {
      ...existing,
      file: safeString(definition.file || existing.file),
      role: safeString(definition.role || existing.role),
      declared: true,
      hubManagesTrack: true,
      ownsTruth: false,
      ownedByHub: false,
      updatedAt: nowIso()
    };

    state.fingerRegistry[key] = merged;
    recomputeFingerAggregation();
    updateDataset();
    publishGlobals();
    return clonePlain(merged);
  }

  function readFingerAuthority(key) {
    const normalizedKey = normalizeFingerKey(key);
    const camel = camelCaseKey(normalizedKey);
    const upper = normalizedKey.toUpperCase().replace(/[^A-Z0-9]+/g, "_");

    const sourceNames = [
      `HEARTH_CANVAS_FINGER_${upper}`,
      `HEARTH.canvasFinger${camel.charAt(0).toUpperCase()}${camel.slice(1)}`,
      `DEXTER_LAB.hearthCanvasFinger${camel.charAt(0).toUpperCase()}${camel.slice(1)}`,
      `HEARTH_CANVAS_${upper}_FINGER`,
      `HEARTH.canvas${camel.charAt(0).toUpperCase()}${camel.slice(1)}Finger`,
      `DEXTER_LAB.hearthCanvas${camel.charAt(0).toUpperCase()}${camel.slice(1)}Finger`
    ];

    for (const name of sourceNames) {
      const found = readPath(name);
      if (found) return { name, authority: found };
    }

    return { name: "NONE", authority: null };
  }

  function childHasMethods(child, methods) {
    if (!child || !isObject(child)) return false;
    return methods.every((method) => isFunction(child[method]));
  }

  function scanFinger(key) {
    initializeFingerRegistry();

    const normalizedKey = normalizeFingerKey(key);
    const track = state.fingerRegistry[normalizedKey] || createFingerTrack(normalizedKey);
    const source = readFingerAuthority(normalizedKey);
    const authority = source.authority;
    const receipt = readReceipt(authority) || null;

    const apiReady = Boolean(
      childHasMethods(authority, FINGER_REQUIRED_METHODS) ||
      Boolean(authority && (
        isFunction(authority.receiveHubPacket) ||
        isFunction(authority.receiveFingerPacket) ||
        isFunction(authority.receiveCanvasHubPacket) ||
        isFunction(authority.read) ||
        isFunction(authority.getReceipt) ||
        isFunction(authority.getReceiptLight)
      )) ||
      safeBool(receipt && receipt.apiReady, false) ||
      safeBool(receipt && receipt.fingerApiReady, false) ||
      safeBool(receipt && receipt.canvasFingerApiReady, false)
    );

    const hardFail = Boolean(
      safeBool(receipt && receipt.hardFail, false) ||
      safeBool(receipt && receipt.fingerHardFail, false) ||
      safeBool(receipt && receipt.canvasFingerHardFail, false)
    );

    const held = Boolean(
      safeBool(receipt && receipt.held, false) ||
      safeBool(receipt && receipt.fingerHeld, false) ||
      upperText(receipt && receipt.status).includes("HELD") ||
      upperText(receipt && receipt.firstFailedCoordinate).includes("WAITING")
    );

    const expressionPacketReceived = Boolean(track.expressionPacketReceived || packetHasExpressionContent(receipt));
    const receiptPacketReceived = Boolean(track.receiptPacketReceived || packetHasReceiptContent(receipt));
    const trackReady = Boolean(apiReady && !hardFail && (expressionPacketReceived || receiptPacketReceived || held));

    let status = FINGER_STATUS.DECLARED_WAITING_FILE;
    if (hardFail) status = FINGER_STATUS.HARD_FAIL;
    else if (trackReady) status = FINGER_STATUS.TRACK_READY;
    else if (receiptPacketReceived) status = FINGER_STATUS.RECEIPT_PACKET_RECEIVED;
    else if (expressionPacketReceived) status = FINGER_STATUS.EXPRESSION_PACKET_RECEIVED;
    else if (apiReady) status = FINGER_STATUS.API_READY;
    else if (authority) status = FINGER_STATUS.AUTHORITY_OBSERVED;
    else if (held) status = FINGER_STATUS.HELD;

    state.fingerRegistry[normalizedKey] = {
      ...track,
      authorityObserved: Boolean(authority),
      apiReady,
      expressionPacketReceived,
      receiptPacketReceived,
      trackReady,
      held,
      hardFail,
      status,
      lastAuthoritySourceName: source.name,
      lastReceiptPacket: receipt ? clonePlain(receipt) : track.lastReceiptPacket,
      firstGap: hardFail
        ? "FINGER_HARD_FAIL"
        : !authority
          ? "WAITING_DOWNSTREAM_FINGER_FILE"
          : !apiReady
            ? "WAITING_FINGER_API"
            : !trackReady
              ? "WAITING_FINGER_PACKET"
              : "NONE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    return clonePlain(state.fingerRegistry[normalizedKey]);
  }

  function scanAllFingers() {
    initializeFingerRegistry();
    return FINGER_SEQUENCE.map((key) => scanFinger(key));
  }

  function receiveFingerPacket(packet = {}) {
    initializeFingerRegistry();

    if (!isObject(packet)) return false;

    const key = inferFingerKeyFromPacket(packet);
    if (!key) {
      recordError("FINGER_PACKET_REJECTED_NO_KEY", "No finger key could be inferred", { packet });
      return false;
    }

    if (!state.fingerRegistry[key]) {
      state.fingerRegistry[key] = createFingerTrack(key, {
        file: safeString(packet.sourceFile || packet.file || ""),
        role: safeString(packet.role || packet.sourceRole || `canvas-finger-${key}-track`)
      });
    }

    const track = state.fingerRegistry[key];

    const finalClaimBlocked = hasFinalClaim(packet);
    const expressionContent = packetHasExpressionContent(packet);
    const receiptContent = packetHasReceiptContent(packet);

    const next = {
      ...track,
      lastPacket: clonePlain(packet),
      authorityObserved: true,
      apiReady: true,
      hardFail: Boolean(track.hardFail || packet.hardFail === true || packet.fingerHardFail === true || finalClaimBlocked),
      held: Boolean(track.held || packet.held === true || upperText(packet.status).includes("HELD")),
      expressionPacketReceived: Boolean(track.expressionPacketReceived || expressionContent),
      receiptPacketReceived: Boolean(track.receiptPacketReceived || receiptContent),
      lastExpressionPacket: expressionContent ? clonePlain(packet) : track.lastExpressionPacket,
      lastReceiptPacket: receiptContent ? clonePlain(packet) : track.lastReceiptPacket,
      status: FINGER_STATUS.TRACK_READY,
      firstGap: "NONE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    if (finalClaimBlocked) {
      next.status = FINGER_STATUS.HARD_FAIL;
      next.firstGap = "FINGER_FALSE_FINAL_CLAIM_BLOCKED";
      next.hardFail = true;
    } else if (next.held && !next.expressionPacketReceived) {
      next.status = FINGER_STATUS.HELD;
      next.firstGap = "FINGER_HELD_WAITING_EXPRESSION_PACKET";
    } else if (next.expressionPacketReceived && next.receiptPacketReceived) {
      next.status = FINGER_STATUS.TRACK_READY;
      next.trackReady = true;
    } else if (next.expressionPacketReceived) {
      next.status = FINGER_STATUS.EXPRESSION_PACKET_RECEIVED;
      next.trackReady = true;
    } else if (next.receiptPacketReceived) {
      next.status = FINGER_STATUS.RECEIPT_PACKET_RECEIVED;
      next.trackReady = true;
    } else {
      next.status = FINGER_STATUS.API_READY;
      next.trackReady = false;
      next.firstGap = "WAITING_FINGER_PACKET";
    }

    state.fingerRegistry[key] = next;

    state.fingerPacketLog.push({
      at: nowIso(),
      key,
      file: next.file,
      packetType: safeString(packet.packetType || packet.type || "FINGER_PACKET"),
      finalClaimBlocked,
      expressionContent,
      receiptContent
    });
    trimArray(state.fingerPacketLog, 160);

    if (expressionContent) {
      state.fingerExpressionPacketLog.push({ at: nowIso(), key, packet: clonePlain(packet) });
      trimArray(state.fingerExpressionPacketLog, 80);
    }

    if (receiptContent) {
      state.fingerReceiptLog.push({ at: nowIso(), key, packet: clonePlain(packet) });
      trimArray(state.fingerReceiptLog, 80);
    }

    recomputeFingerAggregation();
    recomputeParentState();
    updateDataset();
    publishGlobals();
    notifyRouteConductor();

    return getExpressionHubSummary();
  }

  function receiveExpressionFingerPacket(packet = {}) {
    return receiveFingerPacket({
      ...packet,
      packetLane: "EXPRESSION"
    });
  }

  function receiveFingerReceipt(packet = {}) {
    return receiveFingerPacket({
      ...packet,
      packetLane: "RECEIPT"
    });
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

  function recomputeFingerAggregation() {
    initializeFingerRegistry();

    const tracks = FINGER_SEQUENCE.map((key) => state.fingerRegistry[key]).filter(Boolean);

    state.fingerAuthorityObservedCount = tracks.filter((track) => track.authorityObserved).length;
    state.fingerApiReadyCount = tracks.filter((track) => track.apiReady).length;
    state.fingerExpressionPacketCount = tracks.filter((track) => track.expressionPacketReceived).length;
    state.fingerReceiptPacketCount = tracks.filter((track) => track.receiptPacketReceived).length;
    state.fingerTrackReadyCount = tracks.filter((track) => track.trackReady).length;
    state.fingerHardFailCount = tracks.filter((track) => track.hardFail).length;
    state.anyFingerTrackActive = tracks.some((track) => track.authorityObserved || track.apiReady || track.expressionPacketReceived || track.receiptPacketReceived);
    state.allDeclaredFingerTracksReady = tracks.length > 0 && tracks.every((track) => track.trackReady && !track.hardFail);

    const firstGapTrack = tracks.find((track) => track.firstGap && track.firstGap !== "NONE") || tracks[0];

    state.firstFingerGap = firstGapTrack ? safeString(firstGapTrack.firstGap || "NONE") : "NONE";
    state.firstFingerGapFile = firstGapTrack ? safeString(firstGapTrack.file || "") : "";
    state.nextFingerFile = firstGapTrack ? safeString(firstGapTrack.file || "") : "";
    state.nextFingerKey = firstGapTrack ? safeString(firstGapTrack.key || "") : "";

    state.hubReadyForDownstreamFingerFiles = true;
    state.hubReadyForFingerPacketIntake = true;
    state.hubReadyForExpressionPortAudit = true;
    state.hubReadyForExpressionPortBuild = false;

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

  function readCanvasChild(kind) {
    const sources = {
      east: [
        "HEARTH_CANVAS_EAST",
        "HEARTH_CANVAS_EAST_SOURCE",
        "HEARTH_CANVAS_EAST_AUTHORITY",
        "HEARTH_CANVAS_EAST_EVIDENCE",
        "HEARTH_CANVAS_EAST_ENGINE",
        "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastSource",
        "HEARTH.canvasEastAuthority",
        "HEARTH.canvasEastEvidence",
        "HEARTH.canvasEastEngine",
        "HEARTH.canvasEastCurrentLocalStationV111ApiPublication",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastSource",
        "DEXTER_LAB.hearthCanvasEastAuthority",
        "DEXTER_LAB.hearthCanvasEastEvidence",
        "DEXTER_LAB.hearthCanvasEastEngine",
        "DEXTER_LAB.hearthCanvasEastCurrentLocalStationV111ApiPublication"
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
        "DEXTER_LAB.hearthCanvasWest",
        "DEXTER_LAB.hearthCanvasWestAuthority",
        "DEXTER_LAB.hearthCanvasWestEvidence"
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
        "DEXTER_LAB.hearthCanvasSouth",
        "DEXTER_LAB.hearthCanvasSouthAuthority",
        "DEXTER_LAB.hearthCanvasSouthEvidence"
      ]
    };

    for (const name of sources[kind] || []) {
      const found = readPath(name);
      if (found) return found;
    }

    return null;
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

    if (hasFinalClaim(packet) && !hasAtlasEvidence(packet)) {
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
      datasetValue("hearthCanvasEastApiReady") === "true"
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
      datasetValue("hearthCanvasEastHeldDoesNotMeanApiMissing") === "true"
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
      falsePromotionBlocked: state.canvasEastFalsePromotionBlocked
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
      evidenceReady: inspectionReady
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
      stale
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
      state.canvasEastFalsePromotionBlocked ||
      state.fingerHardFailCount > 0
    );

    state.f13CanvasReadinessObserved = Boolean(
      state.canvasParentReleaseObserved ||
      state.eastDispatchPacketPublished ||
      east.observed ||
      west.observed ||
      south.observed ||
      state.anyFingerTrackActive
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
      state.allDeclaredFingerTracksReady &&
      !state.f13HardFail &&
      !state.canvasSouthProofStale
    );

    state.f13CanvasEvidenceDegraded = Boolean(
      !state.f13CanvasEvidenceStrict &&
      releaseAndDispatchReady &&
      (
        east.apiReady ||
        west.apiReady ||
        south.apiReady ||
        state.anyFingerTrackActive
      ) &&
      !state.f13HardFail
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
    let status = "CANVAS_EXPRESSION_HUB_F13_STRICT_EVIDENCE_COMPLETE";

    if (!state.routeConductorCurrentRecognized) {
      gap = "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION";
      target = ROUTE_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION";
    } else if (!state.releasePacketObserved) {
      gap = "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
      target = ROUTE_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!sourceCanBeAccepted(state.acceptedReleaseSource, state.normalizedReleasePacket)) {
      gap = "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY";
      target = ROUTE_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY";
    } else if (!state.releasePacketValid) {
      gap = validationFailureToCoordinate(state.firstReleaseValidationFailure);
      target = ROUTE_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_VALID_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.canvasParentReleaseAccepted) {
      gap = "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE";
      target = FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_PARENT_RELEASE_ACCEPTANCE";
    } else if (!state.parentReleaseLawful) {
      gap = "WAITING_CANVAS_PARENT_RELEASE_LAWFUL";
      target = FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_PARENT_RELEASE_LAWFUL";
    } else if (!state.eastDispatchAuthorized || !state.eastDispatchPacketPublished) {
      gap = "WAITING_CANVAS_PARENT_EAST_DISPATCH_PUBLICATION";
      target = FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_EAST_DISPATCH_PUBLICATION";
    } else if (state.fingerHardFailCount > 0) {
      gap = "FINGER_TRACK_HARD_FAIL";
      target = state.firstFingerGapFile || FILE;
      status = "CANVAS_EXPRESSION_HUB_FINGER_TRACK_HARD_FAIL";
    } else if (!state.anyFingerTrackActive) {
      gap = "WAITING_FIRST_DOWNSTREAM_FINGER_FILE";
      target = FINGER_FILES.boundary;
      status = "CANVAS_EXPRESSION_HUB_WAITING_FIRST_DOWNSTREAM_FINGER_FILE";
    } else if (!state.allDeclaredFingerTracksReady) {
      gap = state.firstFingerGap || "WAITING_DECLARED_FINGER_TRACKS";
      target = state.firstFingerGapFile || state.nextFingerFile || FINGER_FILES.boundary;
      status = "CANVAS_EXPRESSION_HUB_WAITING_DECLARED_FINGER_TRACKS";
    } else if (!state.eastApiReady) {
      gap = "WAITING_CANVAS_EAST_API";
      target = EAST_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CANVAS_EAST_API";
    } else if (state.canvasEastFalsePromotionBlocked) {
      gap = "EAST_FALSE_PROMOTION_BLOCKED";
      target = EAST_FILE;
      status = "CANVAS_EXPRESSION_HUB_EAST_FALSE_PROMOTION_BLOCKED";
    } else if (!state.canvasEastEvidenceReady) {
      gap = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      target = EAST_FILE;
      status = "CANVAS_EXPRESSION_HUB_EAST_API_READY_WAITING_ATLAS_EVIDENCE";
    } else if (!state.westApiReady) {
      gap = "WAITING_CANVAS_WEST_API";
      target = WEST_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CANVAS_WEST_API";
    } else if (!state.canvasWestInspectionReady) {
      gap = "WAITING_CANVAS_WEST_INSPECTION_EVIDENCE";
      target = WEST_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CANVAS_WEST_INSPECTION_EVIDENCE";
    } else if (!state.southApiReady) {
      gap = "WAITING_CANVAS_SOUTH_API";
      target = SOUTH_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CANVAS_SOUTH_API";
    } else if (state.canvasSouthHardFail) {
      gap = "CANVAS_SOUTH_VISIBLE_PROOF_HARD_FAIL";
      target = SOUTH_FILE;
      status = "CANVAS_EXPRESSION_HUB_CANVAS_SOUTH_HARD_FAIL";
    } else if (state.canvasSouthProofStale) {
      gap = "WAITING_CANVAS_SOUTH_CURRENT_NON_STALE_VISIBLE_PROOF";
      target = SOUTH_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CURRENT_SOUTH_VISIBLE_PROOF";
    } else if (!state.canvasSouthVisibleProofReady) {
      gap = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      target = SOUTH_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
    } else if (!state.f13CanvasEvidenceStrict) {
      gap = "WAITING_CANVAS_F13_STRICT_EVIDENCE";
      target = SOUTH_FILE;
      status = "CANVAS_EXPRESSION_HUB_WAITING_CANVAS_F13_STRICT_EVIDENCE";
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

    const receipt = readReceipt(apiCandidate) ||
      readPath("HEARTH_DIAGNOSTIC_RAIL_RECEIPT") ||
      readPath("HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT") ||
      null;

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

    const routeCurrent = Boolean(state.routeConductorCurrentRecognized);
    const canvasCurrent = state.currentCanvasParentContract === CONTRACT;
    const hubCurrent = state.expressionHubActive && state.fingerManagerActive && state.namedFingerFilesEmbedded;

    const mismatch = !routeCurrent
      ? "CURRENT_ROUTE_CONDUCTOR_V9_4_NOT_RECOGNIZED"
      : !canvasCurrent
        ? "CANVAS_PARENT_CONTRACT_NOT_CURRENT"
        : !hubCurrent
          ? "CANVAS_EXPRESSION_HUB_NOT_ACTIVE"
          : "false";

    const summaryStatus = mismatch === "false"
      ? diagnostic.observed
        ? "BRIDGE_ALIGNED_DIAGNOSTIC_CANVAS_AND_EXPRESSION_HUB_SUMMARIES_AVAILABLE"
        : "BRIDGE_ALIGNED_CANVAS_EXPRESSION_HUB_SIDE_ONLY_DIAGNOSTIC_RAIL_NOT_IN_THIS_WINDOW"
      : "BRIDGE_HELD";

    const firstFailed = mismatch === "false" ? state.firstFailedCoordinate : mismatch;
    const recommended = mismatch === "false"
      ? state.recommendedNextFile
      : mismatch === "CURRENT_ROUTE_CONDUCTOR_V9_4_NOT_RECOGNIZED"
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
      bridgePurpose: "ALIGN_DIAGNOSTIC_RECEIPT_WITH_CURRENT_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_AND_EXPRESSION_HUB",
      expressionHubActive: true,
      fingerManagerActive: true,
      namedFingerFilesEmbedded: true,
      expressionBridgeHeld: true,
      expressionPacketAccepted: false,
      expressionComplete: false,

      currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorLineageV9_3Observed: state.routeConductorLineageV9_3Observed,
      routeConductorLineageV9_3AuthorityAccepted: false,
      routeConductorLegacyV9_2Observed: state.routeConductorLegacyV9_2Observed,
      routeConductorLegacyV9_2AuthorityAccepted: false,

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

      fingerRegistry: getFingerRegistry(),
      fingerSequence: FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      anyFingerTrackActive: state.anyFingerTrackActive,
      allDeclaredFingerTracksReady: state.allDeclaredFingerTracksReady,
      firstFingerGap: state.firstFingerGap,
      firstFingerGapFile: state.firstFingerGapFile,

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

      bridgeReadyForExpressionPortAudit: true,
      bridgeReadyForExpressionPortBuild: false,

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lastDiagnosticBridgeSummary = clonePlain(bridge);
    return bridge;
  }

  function getExpressionHubSummary() {
    initializeFingerRegistry();

    const summary = {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_EXPRESSION_HUB_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      namedFingerFilesEmbedded: true,
      downstreamFingerTracksDeclared: true,
      hubOwnsFingerIntake: true,
      hubOwnsFingerRegistry: true,
      hubOwnsFingerSummary: true,
      hubOwnsExpressionBottleneck: true,
      hubDoesNotOwnFingerTruth: true,

      expansionFileRenewalRule: state.expansionFileRenewalRule,
      onlyRenewExpansionFilesAfterThis: true,
      upstreamBackingFilesLockedUnlessEvidenceProvesDefect: true,

      fingerSequence: FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerRegistry: getFingerRegistry(),

      fingerAuthorityObservedCount: state.fingerAuthorityObservedCount,
      fingerApiReadyCount: state.fingerApiReadyCount,
      fingerExpressionPacketCount: state.fingerExpressionPacketCount,
      fingerReceiptPacketCount: state.fingerReceiptPacketCount,
      fingerTrackReadyCount: state.fingerTrackReadyCount,
      fingerHardFailCount: state.fingerHardFailCount,
      anyFingerTrackActive: state.anyFingerTrackActive,
      allDeclaredFingerTracksReady: state.allDeclaredFingerTracksReady,
      firstFingerGap: state.firstFingerGap,
      firstFingerGapFile: state.firstFingerGapFile,
      nextFingerKey: state.nextFingerKey,
      nextFingerFile: state.nextFingerFile,

      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,

      diagnosticBridgeSummaryStatus: state.diagnosticBridgeSummaryStatus,
      diagnosticBridgeMismatch: state.diagnosticBridgeMismatch,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      hubReadyForDownstreamFingerFiles: true,
      hubReadyForFingerPacketIntake: true,
      hubReadyForExpressionPortAudit: true,
      hubReadyForExpressionPortBuild: false,

      ...FINAL_FALSE
    };

    state.lastExpressionHubSummary = clonePlain(summary);
    return summary;
  }

  function getExpressionHubReceipt() {
    const receipt = {
      ...getExpressionHubSummary(),
      packetType: "CANVAS_EXPRESSION_HUB_RECEIPT",
      currentReceipt: true,
      fingerPacketLog: clonePlain(state.fingerPacketLog),
      fingerExpressionPacketLog: clonePlain(state.fingerExpressionPacketLog),
      fingerReceiptLog: clonePlain(state.fingerReceiptLog),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.lastExpressionHubReceipt = clonePlain(receipt);
    return receipt;
  }

  function recomputeParentState() {
    state.timestamp = nowIso();

    readRouteConductorProfile();
    refreshParentReleaseGateMarkers();
    initializeFingerRegistry();
    scanAllFingers();
    recomputeFingerAggregation();
    recomputeChildAggregation();
    composeDiagnosticBridgeSummary();
    getExpressionHubSummary();

    Object.assign(state, FINAL_FALSE);
    state.updatedAt = state.timestamp;

    return clonePlain(state);
  }

  function runCanonicalParentSequence(packet, intakeMethod) {
    state.timestamp = nowIso();

    readRouteConductorProfile();

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
    trimArray(state.childPackets, 80);

    const sourceFile = safeString(packet.sourceFile || packet.file || "");
    const role = upperText(packet.childRole || packet.sourceRole || packet.role || packet.handoffFrom || packet.receivedFrom);

    if (FINGER_SEQUENCE.some((key) => sourceFile === FINGER_FILES[key] || sourceFile.includes(`finger.${key}`))) {
      receiveFingerPacket(packet);
    } else if (sourceFile === EAST_FILE || role.includes("EAST")) {
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
      acceptedBaselineContract: ACCEPTED_BASELINE_CONTRACT,
      acceptedBaselineReceipt: ACCEPTED_BASELINE_RECEIPT,
      currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorReceipt: LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
      legacyRouteConductorContract: LEGACY_ROUTE_CONDUCTOR_CONTRACT,
      legacyRouteConductorReceipt: LEGACY_ROUTE_CONDUCTOR_RECEIPT,
      macroWestRequiredContract: MACRO_WEST_CONTRACT,
      currentEastContract: CURRENT_EAST_CONTRACT,
      packetType: "CANVAS_LOCAL_STATION_EXPRESSION_HUB_SUMMARY",
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasLocalStationActive: true,
      expressionHubActive: true,
      fingerManagerActive: true,
      fingerRegistryActive: true,
      namedFingerFilesEmbedded: true,
      downstreamFingerTracksDeclared: true,
      expansionFileRenewalRule: state.expansionFileRenewalRule,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentIsLocalStation: true,
      currentCanvasParentIsV11_6: true,
      previousCanvasParentContract: PREVIOUS_CONTRACT,
      baselineCanvasParentContract: BASELINE_CONTRACT,
      acceptedBaselineCanvasParentContract: ACCEPTED_BASELINE_CONTRACT,
      canvasParentBootMethodAvailable: true,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractKnown: state.routeConductorContractKnown,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorContractRecognized: state.routeConductorContractRecognized,
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      routeConductorLineageV9_3Observed: state.routeConductorLineageV9_3Observed,
      routeConductorLineageV9_3AuthorityAccepted: false,
      routeConductorLegacyV9_2Observed: state.routeConductorLegacyV9_2Observed,
      routeConductorLegacyV9_2AuthorityAccepted: false,
      routeConductorAuthoritySourceName: state.routeConductorAuthoritySourceName,
      routeConductorAuthoritySourceMethod: state.routeConductorAuthoritySourceMethod,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,
      routeConductorReleasePacketObserved: state.routeConductorReleasePacketObserved,
      routeConductorReleasePacketValid: state.routeConductorReleasePacketValid,

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

      expressionHubSummary: getExpressionHubSummary(),
      fingerSequence: FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerRegistry: getFingerRegistry(),
      anyFingerTrackActive: state.anyFingerTrackActive,
      allDeclaredFingerTracksReady: state.allDeclaredFingerTracksReady,
      firstFingerGap: state.firstFingerGap,
      firstFingerGapFile: state.firstFingerGapFile,
      nextFingerKey: state.nextFingerKey,
      nextFingerFile: state.nextFingerFile,

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
      expressionPortBuildHeldUntilFingerTracksReady: true,

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
      packetType: "CANVAS_LOCAL_STATION_EXPRESSION_HUB_RECEIPT",
      routeConductorReleasePacket: clonePlain(state.routeConductorReleasePacket),
      candidateReleasePacket: clonePlain(state.candidateReleasePacket),
      normalizedReleasePacket: clonePlain(state.normalizedReleasePacket),
      lastEastDispatchPacket: getLastEastDispatchPacket(),
      lastEastReceipt: clonePlain(state.lastEastReceipt),
      lastWestReceipt: clonePlain(state.lastWestReceipt),
      lastSouthReceipt: clonePlain(state.lastSouthReceipt),
      lastRouteConductorAuthorityReceipt: clonePlain(state.lastRouteConductorAuthorityReceipt),
      lastDiagnosticBridgeSummary: clonePlain(state.lastDiagnosticBridgeSummary),
      lastExpressionHubReceipt: getExpressionHubReceipt()
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
      expressionHubSummary: getExpressionHubSummary(),
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
      acceptedBaselineContract: ACCEPTED_BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      role: "canvas-expression-hub-structural-carrier",

      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      canvasParentBootMethodAvailable: true,
      canvasLocalStationActive: true,
      expressionHubActive: true,
      fingerManagerActive: true,
      fingerRegistryActive: true,
      namedFingerFilesEmbedded: true,

      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,
      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,

      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,

      fingerSequence: FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerRegistry: getFingerRegistry(),
      firstFingerGap: state.firstFingerGap,
      firstFingerGapFile: state.firstFingerGapFile,

      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

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
      expressionHubReceipt: getExpressionHubReceipt(),
      childPackets: clonePlain(state.childPackets),
      fingerPacketLog: clonePlain(state.fingerPacketLog),
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
      "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_RECEIPT",
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
      "EXPRESSION_HUB",
      line("expressionHubActive", true),
      line("fingerManagerActive", true),
      line("fingerRegistryActive", true),
      line("namedFingerFilesEmbedded", true),
      line("downstreamFingerTracksDeclared", true),
      line("hubOwnsExpressionBottleneck", true),
      line("hubDoesNotOwnFingerTruth", true),
      line("expansionFileRenewalRule", state.expansionFileRenewalRule),
      "",
      "FINGER_FILES",
      line("boundary", FINGER_FILES.boundary),
      line("landform", FINGER_FILES.landform),
      line("elevation", FINGER_FILES.elevation),
      line("material", FINGER_FILES.material),
      line("hydrology", FINGER_FILES.hydrology),
      line("atmosphere", FINGER_FILES.atmosphere),
      line("lighting", FINGER_FILES.lighting),
      line("composite", FINGER_FILES.composite),
      "",
      "FINGER_STATUS",
      line("fingerAuthorityObservedCount", state.fingerAuthorityObservedCount),
      line("fingerApiReadyCount", state.fingerApiReadyCount),
      line("fingerExpressionPacketCount", state.fingerExpressionPacketCount),
      line("fingerReceiptPacketCount", state.fingerReceiptPacketCount),
      line("fingerTrackReadyCount", state.fingerTrackReadyCount),
      line("fingerHardFailCount", state.fingerHardFailCount),
      line("anyFingerTrackActive", state.anyFingerTrackActive),
      line("allDeclaredFingerTracksReady", state.allDeclaredFingerTracksReady),
      line("firstFingerGap", state.firstFingerGap),
      line("firstFingerGapFile", state.firstFingerGapFile),
      line("nextFingerKey", state.nextFingerKey),
      line("nextFingerFile", state.nextFingerFile),
      "",
      "ROUTE_CONDUCTOR_ALIGNMENT",
      line("currentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT),
      line("currentRouteConductorRequiredReceipt", CURRENT_ROUTE_CONDUCTOR_RECEIPT),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContractKnown", r.routeConductorContractKnown),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorReceipt", r.routeConductorReceipt),
      line("routeConductorCurrentRecognized", r.routeConductorCurrentRecognized),
      line("routeConductorCurrentV9_4Recognized", r.routeConductorCurrentV9_4Recognized),
      line("routeConductorLineageV9_3Observed", r.routeConductorLineageV9_3Observed),
      line("routeConductorLineageV9_3AuthorityAccepted", false),
      line("routeConductorLegacyV9_2Observed", r.routeConductorLegacyV9_2Observed),
      line("routeConductorLegacyV9_2AuthorityAccepted", false),
      line("routeConductorReleaseAuthorityAccepted", r.routeConductorReleaseAuthorityAccepted),
      "",
      "BRIDGE_ALIGNMENT",
      line("diagnosticBridgeActive", true),
      line("diagnosticReceiptBridgeActive", true),
      line("diagnosticBridgeSummaryStatus", r.diagnosticBridgeSummaryStatus),
      line("diagnosticBridgeMismatch", r.diagnosticBridgeMismatch),
      line("diagnosticBridgeFirstFailedCoordinate", r.diagnosticBridgeFirstFailedCoordinate),
      line("diagnosticBridgeRecommendedNextFile", r.diagnosticBridgeRecommendedNextFile),
      "",
      "PARENT_RELEASE",
      line("releasePacketObserved", r.releasePacketObserved),
      line("releasePacketValid", r.releasePacketValid),
      line("releasePacketAccepted", r.releasePacketAccepted),
      line("canvasParentReleaseAccepted", r.canvasParentReleaseAccepted),
      line("parentReleaseLawful", r.parentReleaseLawful),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady),
      line("canvasReleaseHeldReason", r.canvasReleaseHeldReason),
      line("canvasParentReleaseGateReady", r.canvasParentReleaseGateReady),
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
    setDataset("hearthCanvasAcceptedBaselineContract", ACCEPTED_BASELINE_CONTRACT);
    setDataset("hearthCanvasAcceptedBaselineReceipt", ACCEPTED_BASELINE_RECEIPT);

    setDataset("hearthCanvasLocalStationActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasFingerRegistryActive", "true");
    setDataset("hearthCanvasNamedFingerFilesEmbedded", "true");
    setDataset("hearthCanvasDownstreamFingerTracksDeclared", "true");
    setDataset("hearthCanvasExpansionFileRenewalRule", state.expansionFileRenewalRule);

    setDataset("hearthCanvasParentV11_6Active", "true");
    setDataset("hearthCanvasParentV11_5Superseded", "true");
    setDataset("hearthCanvasParentV11_4BaselineRecognized", "true");

    setDataset("hearthCanvasCurrentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthCanvasCurrentRouteConductorRequiredReceipt", CURRENT_ROUTE_CONDUCTOR_RECEIPT);
    setDataset("hearthCanvasRouteConductorObserved", String(state.routeConductorObserved));
    setDataset("hearthCanvasRouteConductorContractKnown", String(state.routeConductorContractKnown));
    setDataset("hearthCanvasRouteConductorContract", state.routeConductorContract);
    setDataset("hearthCanvasRouteConductorReceipt", state.routeConductorReceipt);
    setDataset("hearthCanvasRouteConductorCurrentRecognized", String(state.routeConductorCurrentRecognized));
    setDataset("hearthCanvasRouteConductorCurrentV94Recognized", String(state.routeConductorCurrentV9_4Recognized));
    setDataset("hearthCanvasRouteConductorReleaseAuthorityAccepted", String(state.routeConductorReleaseAuthorityAccepted));

    setDataset("hearthCanvasReleasePacketObserved", String(state.releasePacketObserved));
    setDataset("hearthCanvasReleasePacketValid", String(state.releasePacketValid));
    setDataset("hearthCanvasReleasePacketAccepted", String(state.releasePacketAccepted));
    setDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthCanvasParentReleaseLawful", String(state.canvasParentReleaseLawful));
    setDataset("hearthCanvasParentReleaseGateReady", String(state.canvasParentReleaseGateReady));
    setDataset("hearthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthCanvasReleasePacketReady", String(state.canvasReleasePacketReady));
    setDataset("hearthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthCanvasFingerAuthorityObservedCount", state.fingerAuthorityObservedCount);
    setDataset("hearthCanvasFingerApiReadyCount", state.fingerApiReadyCount);
    setDataset("hearthCanvasFingerExpressionPacketCount", state.fingerExpressionPacketCount);
    setDataset("hearthCanvasFingerReceiptPacketCount", state.fingerReceiptPacketCount);
    setDataset("hearthCanvasFingerTrackReadyCount", state.fingerTrackReadyCount);
    setDataset("hearthCanvasFingerHardFailCount", state.fingerHardFailCount);
    setDataset("hearthCanvasAnyFingerTrackActive", String(state.anyFingerTrackActive));
    setDataset("hearthCanvasAllDeclaredFingerTracksReady", String(state.allDeclaredFingerTracksReady));
    setDataset("hearthCanvasFirstFingerGap", state.firstFingerGap);
    setDataset("hearthCanvasFirstFingerGapFile", state.firstFingerGapFile);
    setDataset("hearthCanvasNextFingerKey", state.nextFingerKey);
    setDataset("hearthCanvasNextFingerFile", state.nextFingerFile);

    Object.keys(FINGER_FILES).forEach((key) => {
      const datasetKey = `hearthCanvasFinger${key.charAt(0).toUpperCase()}${key.slice(1)}File`;
      setDataset(datasetKey, FINGER_FILES[key]);
    });

    setDataset("hearthCanvasDiagnosticBridgeActive", "true");
    setDataset("hearthCanvasDiagnosticReceiptBridgeActive", "true");
    setDataset("hearthCanvasDiagnosticBridgeSummaryStatus", state.diagnosticBridgeSummaryStatus);
    setDataset("hearthCanvasDiagnosticBridgeMismatch", state.diagnosticBridgeMismatch);
    setDataset("hearthCanvasDiagnosticBridgeFirstFailedCoordinate", state.diagnosticBridgeFirstFailedCoordinate);
    setDataset("hearthCanvasDiagnosticBridgeRecommendedNextFile", state.diagnosticBridgeRecommendedNextFile);

    setDataset("hearthCanvasEastDispatchAuthorized", String(state.eastDispatchAuthorized));
    setDataset("hearthCanvasEastDispatchPacketPublished", String(state.eastDispatchPacketPublished));
    setDataset("hearthCanvasEastDispatchAttempted", String(state.eastDispatchAttempted));
    setDataset("hearthCanvasEastDispatchMethod", state.eastDispatchMethod);

    setDataset("hearthCanvasEastApiReady", String(state.eastApiReady));
    setDataset("hearthCanvasEastEvidenceReady", String(state.canvasEastEvidenceReady));
    setDataset("hearthCanvasWestApiReady", String(state.westApiReady));
    setDataset("hearthCanvasWestInspectionReady", String(state.canvasWestInspectionReady));
    setDataset("hearthCanvasSouthApiReady", String(state.southApiReady));
    setDataset("hearthCanvasSouthVisibleProofReady", String(state.canvasSouthVisibleProofReady));

    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
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
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD = api;
    root.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD = api;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasChildDistributionSwitchboard = api;
    lab.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard = api;
    lab.hearthCanvasDiagnosticBridge = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;

    const light = getReceiptLight();
    const full = getReceipt();
    const bridge = getDiagnosticBridgeReceipt();
    const hubReceipt = getExpressionHubReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_RECEIPT_v11_6 = full;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_RECEIPT = bridge;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_SUMMARY = clonePlain(state.lastDiagnosticBridgeSummary);

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasExpressionHubReceipt = hubReceipt;
    hearth.canvasFingerManagerReceipt = hubReceipt;
    hearth.canvasDiagnosticBridgeReceipt = bridge;
    hearth.canvasDiagnosticBridgeSummary = clonePlain(state.lastDiagnosticBridgeSummary);

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasExpressionHubReceipt = hubReceipt;
    lab.hearthCanvasFingerManagerReceipt = hubReceipt;
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
      readPath("HEARTH_ROUTE_CONDUCTOR"),
      readPath("HEARTH.routeConductor"),
      readPath("DEXTER_LAB.hearthRouteConductor"),
      readPath("HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT"),
      readPath("HEARTH.routeConductorCanvasLocalStationBridgeAlignment"),
      readPath("DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment"),
      root.HEARTH_ROUTE_CONDUCTOR
    ];

    const methods = [
      "receiveCanvasExpressionHubSummary",
      "receiveCanvasFingerManagerSummary",
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

    initializeFingerRegistry();
    publishGlobals();
    readRouteConductorProfile();

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

    record("CANVAS_EXPRESSION_HUB_FINGER_MANAGER_BOOT_AUDIT_COMPLETE", {
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,
      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      diagnosticBridgeSummaryStatus: state.diagnosticBridgeSummaryStatus,
      expressionHubActive: true,
      fingerManagerActive: true,
      namedFingerFilesEmbedded: true,
      firstFingerGap: state.firstFingerGap,
      nextFingerFile: state.nextFingerFile,
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
    ACCEPTED_BASELINE_CONTRACT,
    ACCEPTED_BASELINE_RECEIPT,
    CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
    LEGACY_ROUTE_CONDUCTOR_CONTRACT,
    LEGACY_ROUTE_CONDUCTOR_RECEIPT,
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
    FINGER_FILES,
    FINGER_SEQUENCE,
    FINGER_ROLES,

    REQUIRED_RELEASE,
    RELEASE_SOURCE,
    CHILD_STATUS,
    EAST_RESULT_CLASS,
    FINGER_STATUS,
    CANVAS_CHILD_SEQUENCE,

    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    acceptedBaselineContract: ACCEPTED_BASELINE_CONTRACT,
    acceptedBaselineReceipt: ACCEPTED_BASELINE_RECEIPT,
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

    registerFinger,
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
    getExpressionHubSummary,
    getExpressionHubReceipt,

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
    supportsCurrentRouteConductorV9_4Authority: true,
    supportsLineageRouteConductorV9_3ObservationOnly: true,
    supportsLegacyRouteConductorV9_2ObservationOnly: true,
    supportsDiagnosticBridgeSummary: true,
    supportsDiagnosticReceiptBridge: true,
    supportsExpressionHub: true,
    supportsCanvasFingerManager: true,
    supportsFingerRegistry: true,
    supportsNamedFingerFiles: true,
    supportsFingerExpressionReceiptSeparation: true,
    supportsFingerPacketIntake: true,
    supportsExpansionFileRenewalRule: true,
    supportsExpressionHeldUntilFingerTracksReady: true,
    supportsDatasetCurrentContractRecognition: true,
    supportsDatasetReportingOnlyNotReleaseAuthority: true,
    supportsGlobalObservationOnlyNotAuthority: true,
    supportsFallbackObservationOnly: true,
    supportsPublicReceiverValidatedCandidateIntake: true,
    supportsParentReleaseAcceptance: true,
    supportsEastDispatchPublication: true,
    supportsCanvasChildAggregation: true,
    supportsEastApiEvidenceSeparation: true,
    supportsHeldPacketDoesNotDemoteApi: true,
    supportsRouteConductorSummarySurface: true,
    supportsLastEastDispatchPacketGetter: true,

    ownsCanvasParentIdentity: true,
    ownsRouteConductorReleasePacketIntake: true,
    ownsParentReleaseAcceptance: true,
    ownsEastDispatchPacket: true,
    ownsCanvasChildDiscovery: true,
    ownsCanvasChildAggregateReadiness: true,
    ownsCanvasStationSummary: true,
    ownsDiagnosticBridgeSummary: true,
    ownsExpressionHub: true,
    ownsFingerManager: true,
    ownsFingerRegistry: true,
    ownsFingerIntake: true,
    ownsFingerSummary: true,

    ownsRouteConductorSwitching: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsMacroWestAdmissibility: false,
    ownsEastAtlasTruth: false,
    ownsWestInspectionTruth: false,
    ownsSouthVisibleProofTruth: false,
    ownsFingerTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsTerrainTruth: false,
    ownsMountainTruth: false,
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
        doc.addEventListener("DOMContentLoaded", () => bootAudit({}), { once: true });
      } else {
        bootAudit({});
      }
    } else {
      bootAudit({});
    }
  } catch (error) {
    recordError("CANVAS_EXPRESSION_HUB_FINGER_MANAGER_INITIALIZATION_FAILED", error);

    try {
      publishGlobals();
      updateDataset();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
