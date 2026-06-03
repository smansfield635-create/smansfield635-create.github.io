// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7
// Full-file replacement.
// Canvas Parent / Canvas Local Station / Expression Hub / Finger Manager / Visible Base Globe Carrier.
// Purpose:
// - Preserve accepted v11_6 Expression Hub / Finger Manager duties.
// - Correct the registry to recognize the already-built base finger files.
// - Preserve the future expansion-finger architecture downstream.
// - Load or detect base fingers: boundary, mass, surface, light, inspect.
// - Accept downstream expression and receipt packets without rewriting finger files.
// - Mount a visible 2D Canvas base globe from base finger availability and safe fallback expression.
// - Keep the base globe as a carrier/inspection surface, not final terrain truth.
// - Preserve Route Conductor v9_4 recognition, diagnostic bridge, Canvas local station receipts, and hub receipts.
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
// - downstream finger truth
// - terrain/material/hydrology/elevation/mountain final truth
// - F13 latch
// - F21 latch
// - ready text
// - final visual pass

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7";
  const RECEIPT = "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT_v11_7";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_RECEIPT_v11_6";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_RECEIPT_v11_5";

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
  const TARGET_FILE = FILE;
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

  const BASE_FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    mass: "/assets/hearth/hearth.canvas.finger.mass.js",
    surface: "/assets/hearth/hearth.canvas.finger.surface.js",
    light: "/assets/hearth/hearth.canvas.finger.light.js",
    inspect: "/assets/hearth/hearth.canvas.finger.inspect.js"
  });

  const EXPANSION_FINGER_FILES = Object.freeze({
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js",
    composite: "/assets/hearth/hearth.canvas.finger.composite.js"
  });

  const FINGER_FILES = Object.freeze({
    ...BASE_FINGER_FILES,
    ...EXPANSION_FINGER_FILES
  });

  const BASE_FINGER_SEQUENCE = Object.freeze(["boundary", "mass", "surface", "light", "inspect"]);
  const EXPANSION_FINGER_SEQUENCE = Object.freeze(["landform", "elevation", "material", "hydrology", "atmosphere", "lighting", "composite"]);
  const FINGER_SEQUENCE = Object.freeze([...BASE_FINGER_SEQUENCE, ...EXPANSION_FINGER_SEQUENCE]);

  const FINGER_ROLES = Object.freeze({
    boundary: "canvas-finger-boundary-base-globe-containment-track",
    mass: "canvas-finger-mass-base-globe-body-track",
    surface: "canvas-finger-surface-base-globe-read-track",
    light: "canvas-finger-light-base-globe-visibility-track",
    inspect: "canvas-finger-inspect-base-globe-receipt-track",
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
    NONE: "NONE"
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
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

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
    role: "canvas-expression-hub-visible-base-globe-carrier",

    currentRouteConductorRequiredContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    currentRouteConductorRequiredReceipt: CURRENT_ROUTE_CONDUCTOR_RECEIPT,
    lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    lineageRouteConductorReceipt: LINEAGE_ROUTE_CONDUCTOR_RECEIPT,
    legacyRouteConductorContract: LEGACY_ROUTE_CONDUCTOR_CONTRACT,
    legacyRouteConductorReceipt: LEGACY_ROUTE_CONDUCTOR_RECEIPT,
    macroWestRequiredContract: MACRO_WEST_CONTRACT,
    currentEastContract: CURRENT_EAST_CONTRACT,

    canvasLocalStationActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    visibleBaseGlobeCarrierActive: true,
    baseFingerRegistryActive: true,
    expansionFingerRegistryActive: true,
    namedBaseFingerFilesEmbedded: true,
    namedExpansionFingerFilesEmbedded: true,
    hubOwnsFingerIntake: true,
    hubOwnsFingerRegistry: true,
    hubOwnsFingerSummary: true,
    hubOwnsVisibleBaseGlobeCarrier: true,
    hubDoesNotOwnFingerTruth: true,
    hubDoesNotOwnFinalPlanetTruth: true,
    expansionFileRenewalRule: "RENEW_ONLY_THIS_HUB_AND_NEWLY_EXPANDED_FINGER_FILES_UNLESS_EVIDENCE_PROVES_DEFECT",

    routeConductorObserved: false,
    routeConductorContractKnown: false,
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorCurrentRecognized: false,
    routeConductorCurrentV9_4Recognized: false,
    routeConductorLineageV9_3Observed: false,
    routeConductorLegacyV9_2Observed: false,
    routeConductorAuthoritySourceName: "NONE",
    routeConductorAuthoritySourceMethod: "NONE",
    routeConductorReleaseAuthorityAccepted: false,
    routeConductorReleasePacketObserved: false,
    routeConductorReleasePacketValid: false,

    releasePacketObserved: false,
    releasePacketValid: false,
    releasePacketAccepted: false,
    acceptedReleaseSource: RELEASE_SOURCE.NONE,
    releasePacketAuthoritySource: "NONE",
    releasePacketIntakeMethod: "NONE",
    routeConductorReleasePacket: null,
    candidateReleasePacket: null,
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

    eastDispatchAuthorized: false,
    eastDispatchPacketPublished: false,
    eastDispatchAttempted: false,
    eastDispatchMethod: "NONE",
    handoffTo: "NONE",
    lastEastDispatchPacket: null,

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

    baseFingerAuthorityObservedCount: 0,
    baseFingerTrackReadyCount: 0,
    baseFingerMinimumReady: false,
    allBaseFingerTracksReady: false,
    anyBaseFingerTrackActive: false,

    expansionFingerAuthorityObservedCount: 0,
    expansionFingerTrackReadyCount: 0,
    allExpansionFingerTracksReady: false,
    anyExpansionFingerTrackActive: false,

    anyFingerTrackActive: false,
    allDeclaredFingerTracksReady: false,
    firstFingerGap: "WAITING_BASE_FINGER_DETECTION",
    firstFingerGapFile: BASE_FINGER_FILES.boundary,
    nextFingerFile: BASE_FINGER_FILES.boundary,
    nextFingerKey: "boundary",

    baseGlobeMountAttempted: false,
    baseGlobeMountReady: false,
    baseGlobeCanvasCreated: false,
    baseGlobeCanvasFound: false,
    baseGlobeContainerSelector: "NONE",
    baseGlobeCanvasId: "hearth-canvas-base-globe",
    baseGlobeDrawAttempted: false,
    baseGlobeDrawComplete: false,
    baseGlobeDrawHeldReason: "NOT_ATTEMPTED",
    baseGlobeVisibleCarrierReady: false,
    baseGlobeVisualizationExpected: false,
    baseGlobeExpandable: false,
    baseGlobeDrawMode: "2D_CANVAS_SAFE_FALLBACK",
    baseGlobeFrameCount: 0,
    baseGlobeLastDrawAt: "",
    baseGlobeError: "",

    canvasEastApiReady: false,
    canvasEastEvidenceReady: false,
    canvasWestApiReady: false,
    canvasWestInspectionReady: false,
    canvasSouthApiReady: false,
    canvasSouthVisibleProofReady: false,

    diagnosticRailObserved: false,
    diagnosticBridgeSummaryStatus: "WAITING_ROUTE_CONDUCTOR_AND_DIAGNOSTIC_RECEIPT_COMPARISON",
    diagnosticBridgeMismatch: "UNKNOWN",
    diagnosticBridgeFirstFailedCoordinate: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
    diagnosticBridgeRecommendedNextFile: ROUTE_FILE,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
    f13StrictEvidenceRepairTarget: ROUTE_FILE,

    firstFailedCoordinate: "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",
    recommendedNextFile: ROUTE_FILE,
    recommendedNextRenewalTarget: ROUTE_FILE,
    canvasNextAuditTarget: ROUTE_FILE,
    postgameStatus: "CANVAS_VISIBLE_BASE_GLOBE_WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION",

    lastCanvasStationSummary: null,
    lastExpressionHubSummary: null,
    lastExpressionHubReceipt: null,
    lastDiagnosticBridgeSummary: null,
    lastRouteConductorAuthorityReceipt: null,
    localEvents: [],
    errors: [],

    bootAuditComplete: false,

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
      event: safeString(event, "CANVAS_VISIBLE_BASE_GLOBE_EVENT"),
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
      code: safeString(code, "CANVAS_VISIBLE_BASE_GLOBE_ERROR"),
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
        const result = authority[method]();
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
      ["HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3", readPath("HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_RECEIPT_v9_3")]
    ];
  }

  function legacyRouteConductorSources() {
    return [
      ["HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR", readPath("HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR")],
      ["HEARTH.routeConductorNorthStarCompletionCycleGovernor", readPath("HEARTH.routeConductorNorthStarCompletionCycleGovernor")],
      ["DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor", readPath("DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor")],
      ["HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT", readPath("HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT")]
    ];
  }

  function readContractReceiptPair(candidate) {
    if (!candidate) return { contract: "", receipt: "", body: null };

    const body = readReceipt(candidate) || (isObject(candidate) ? candidate : null);
    const contract = safeString(
      (body && (body.contract || body.CONTRACT || body.routeConductorContract || body.sourceContract)) ||
      (isObject(candidate) && (candidate.contract || candidate.CONTRACT || candidate.routeConductorContract)) ||
      "",
      ""
    );
    const receipt = safeString(
      (body && (body.receipt || body.RECEIPT || body.routeConductorReceipt || body.sourceReceipt)) ||
      (isObject(candidate) && (candidate.receipt || candidate.RECEIPT || candidate.routeConductorReceipt)) ||
      "",
      ""
    );

    return { contract, receipt, body };
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
    const contract = safeString(
      datasetValue("routeConductorContract") ||
      datasetValue("hearthRouteConductorContract") ||
      datasetValue("hearthServedRouteConductorContract") ||
      datasetValue("hearthCurrentRouteConductorContract") ||
      datasetValue("hearthCanvasCurrentRouteConductorRequiredContract") ||
      "",
      ""
    );

    const receipt = safeString(
      datasetValue("routeConductorReceipt") ||
      datasetValue("hearthRouteConductorReceipt") ||
      datasetValue("hearthServedRouteConductorReceipt") ||
      datasetValue("hearthCurrentRouteConductorReceipt") ||
      datasetValue("hearthCanvasCurrentRouteConductorRequiredReceipt") ||
      "",
      ""
    );

    return { contract, receipt };
  }

  function readRouteConductorProfile() {
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

    for (const [name, candidate] of currentRouteConductorSources()) {
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

    for (const [_name, candidate] of lineageRouteConductorSources()) {
      if (!candidate) continue;
      const pair = readContractReceiptPair(candidate);
      if (isLineageRouteConductorPair(pair.contract, pair.receipt)) {
        lineageObserved = true;
        break;
      }
    }

    for (const [_name, candidate] of legacyRouteConductorSources()) {
      if (!candidate) continue;
      const pair = readContractReceiptPair(candidate);
      if (isLegacyRouteConductorPair(pair.contract, pair.receipt)) {
        legacyObserved = true;
        break;
      }
    }

    state.routeConductorObserved = observed;
    state.routeConductorContractKnown = Boolean(contract);
    state.routeConductorContract = contract;
    state.routeConductorReceipt = receipt;
    state.routeConductorCurrentRecognized = currentRecognized;
    state.routeConductorCurrentV9_4Recognized = currentRecognized;
    state.routeConductorLineageV9_3Observed = lineageObserved;
    state.routeConductorLegacyV9_2Observed = legacyObserved;
    state.routeConductorAuthoritySourceName = sourceName;
    state.routeConductorAuthoritySourceMethod = sourceMethod;
    state.lastRouteConductorAuthorityReceipt = authorityReceipt;

    return {
      observed,
      contract,
      receipt,
      routeConductorCurrentRecognized: currentRecognized,
      routeConductorCurrentV9_4Recognized: currentRecognized,
      authorityObject,
      authorityReceipt: clonePlain(authorityReceipt),
      authoritySourceName: sourceName,
      authoritySourceMethod: sourceMethod
    };
  }

  function releasePacketFrom(value) {
    if (!isObject(value)) return null;

    const keys = [
      "canvasReleasePacket",
      "releasePacket",
      "routeConductorReleasePacket",
      "canvasParentReleasePacket",
      "canvasHandoffPacket",
      "handoffPacket",
      "releaseToCanvasPacket",
      "packet"
    ];

    for (const key of keys) {
      if (isObject(value[key])) return value[key];
    }

    if (
      value.routeConductorContract ||
      value.sourceContract ||
      value.contract ||
      value.canvasReleaseAuthorized !== undefined ||
      value.handoffTo ||
      value.destinationFile
    ) {
      return value;
    }

    return null;
  }

  function markReleasePacket(packet, source, method) {
    state.releasePacketObserved = Boolean(packet);
    state.acceptedReleaseSource = packet ? source : RELEASE_SOURCE.NONE;
    state.releasePacketAuthoritySource = packet ? source : "NONE";
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
        "getReceiptLight",
        "getReceipt"
      ];

      for (const method of methods) {
        const result = isFunction(route.authorityObject[method])
          ? safeInvoke(route.authorityObject, method)
          : null;
        const packet = releasePacketFrom(result);

        if (packet) return markReleasePacket(packet, RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_API, `CURRENT_ROUTE_CONDUCTOR_API:${method}`);
      }
    }

    if (route.routeConductorCurrentRecognized && route.authorityReceipt) {
      const packet = releasePacketFrom(route.authorityReceipt);
      if (packet) return markReleasePacket(packet, RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_RECEIPT, "CURRENT_ROUTE_CONDUCTOR_RECEIPT_SOURCE");
    }

    const optionPacket = releasePacketFrom(options);
    if (optionPacket) return markReleasePacket(optionPacket, RELEASE_SOURCE.OPTIONS_TEST, "OPTIONS_TEST_CANDIDATE");

    return markReleasePacket(null, RELEASE_SOURCE.NONE, "NONE");
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
      original: clonePlain(packet)
    };

    state.normalizedReleasePacket = clonePlain(normalized);
    return normalized;
  }

  function sourceCanBeAccepted(source, packet) {
    if (source === RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_API || source === RELEASE_SOURCE.CURRENT_ROUTE_CONDUCTOR_RECEIPT) return true;

    if (source === RELEASE_SOURCE.DIRECT_ROUTE_CONDUCTOR_CANDIDATE || source === RELEASE_SOURCE.OPTIONS_TEST) {
      return Boolean(
        state.routeConductorCurrentRecognized &&
        isObject(packet) &&
        packet.routeConductorContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT &&
        packet.routeConductorReceipt === CURRENT_ROUTE_CONDUCTOR_RECEIPT
      );
    }

    return false;
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
    state.postgameStatus = `CANVAS_VISIBLE_BASE_GLOBE_${coordinate}`;

    return false;
  }

  function acceptRelease(packet) {
    if (!state.routeConductorCurrentRecognized) {
      return clearReleaseAcceptance("WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION", "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION", ROUTE_FILE);
    }

    if (!state.releasePacketObserved) {
      return clearReleaseAcceptance("WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET", "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET", ROUTE_FILE);
    }

    if (!sourceCanBeAccepted(state.acceptedReleaseSource, packet)) {
      return clearReleaseAcceptance("WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY", "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_AUTHORITY", ROUTE_FILE);
    }

    if (!state.releasePacketValid || !isObject(packet)) {
      return clearReleaseAcceptance("CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INVALID", "WAITING_VALID_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET", ROUTE_FILE);
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
    state.canvasParentReleaseGateReady = true;
    state.parentAcceptedRouteConductorRelease = true;

    state.firstFailedCoordinate = "WAITING_BASE_GLOBE_CARRIER_DRAW";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.canvasNextAuditTarget = FILE;
    state.postgameStatus = "CANVAS_VISIBLE_BASE_GLOBE_RELEASE_ACCEPTED_PREPARING_DRAW";

    return true;
  }

  function composeEastDispatchPacket() {
    if (!state.canvasParentReleaseGateReady) {
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
      expressionHubActive: true,
      visibleBaseGlobeCarrierActive: true,
      fingerSequence: FINGER_SEQUENCE.slice(),
      baseFingerSequence: BASE_FINGER_SEQUENCE.slice(),
      expansionFingerSequence: EXPANSION_FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      cycleNumber: 2,
      cycleRoute: CYCLE_2_ROUTE,
      activeFibonacci: "F13P",
      eastActiveFibonacci: "F13E",
      canvasReleaseAuthorized: true,
      canvasReleasePacketReady: true,
      eastDispatchAuthorized: true,
      eastDispatchPacketPublished: true,
      westCanvasReleaseApproved: true,
      westHardBlock: false,
      ...FINAL_FALSE
    };

    state.lastEastDispatchPacket = clonePlain(packet);
    return packet;
  }

  function publishEastDispatchPacket(packet) {
    if (!isObject(packet)) return false;

    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasParentEastDispatchPacket = clonePlain(packet);
    hearth.canvasEastDispatchPacket = clonePlain(packet);
    lab.hearthCanvasParentEastDispatchPacket = clonePlain(packet);
    lab.hearthCanvasEastDispatchPacket = clonePlain(packet);

    root.HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET = clonePlain(packet);
    root.HEARTH_CANVAS_EAST_DISPATCH_PACKET = clonePlain(packet);

    state.eastDispatchAuthorized = true;
    state.eastDispatchPacketPublished = true;
    state.eastDispatchAttempted = true;
    state.eastDispatchMethod = "PUBLISH_PACKET_ONLY";
    state.handoffTo = "EAST";

    return true;
  }

  function normalizeFingerKey(value) {
    const raw = safeString(value).trim().toLowerCase();

    if (!raw) return "";
    if (FINGER_FILES[raw]) return raw;

    if (raw.includes("boundary") || raw.includes("shape")) return "boundary";
    if (raw.includes("mass") || raw.includes("body")) return "mass";
    if (raw.includes("surface")) return "surface";
    if (raw === "light" || raw.includes("base-light")) return "light";
    if (raw.includes("inspect")) return "inspect";
    if (raw.includes("landform") || raw.includes("landmass")) return "landform";
    if (raw.includes("elevation") || raw.includes("relief") || raw.includes("height")) return "elevation";
    if (raw.includes("material")) return "material";
    if (raw.includes("hydrology") || raw.includes("water")) return "hydrology";
    if (raw.includes("atmosphere") || raw.includes("air")) return "atmosphere";
    if (raw.includes("lighting") || raw.includes("shadow")) return "lighting";
    if (raw.includes("composite") || raw.includes("carrier")) return "composite";

    return raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function createFingerTrack(key, input = {}) {
    const normalizedKey = normalizeFingerKey(key);
    const file = safeString(input.file || FINGER_FILES[normalizedKey] || "");
    const isBase = BASE_FINGER_SEQUENCE.includes(normalizedKey);
    const isExpansion = EXPANSION_FINGER_SEQUENCE.includes(normalizedKey);

    return {
      key: normalizedKey,
      file,
      role: safeString(input.role || FINGER_ROLES[normalizedKey] || `canvas-finger-${normalizedKey}-track`),
      layer: isBase ? "BASE_VISIBILITY" : isExpansion ? "EXPANSION_EXPRESSION" : "UNCLASSIFIED",
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
      lastExpressionPacket: null,
      lastReceiptPacket: null,
      lastPacket: null,
      firstGap: "WAITING_DOWNSTREAM_FINGER_FILE",
      ownsTruth: false,
      ownedByHub: false,
      hubManagesTrack: true,
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
      packet.boundaryPacket ||
      packet.massPacket ||
      packet.surfacePacket ||
      packet.lightPacket ||
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

  function readFingerAuthority(key) {
    const normalizedKey = normalizeFingerKey(key);
    const camel = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
    const upper = normalizedKey.toUpperCase();

    const sourceNames = [
      `HEARTH_CANVAS_FINGER_${upper}`,
      `HEARTH_CANVAS_${upper}_FINGER`,
      `HEARTH.canvasFinger${camel}`,
      `HEARTH.canvas${camel}Finger`,
      `DEXTER_LAB.hearthCanvasFinger${camel}`,
      `DEXTER_LAB.hearthCanvas${camel}Finger`
    ];

    for (const name of sourceNames) {
      const found = readPath(name);
      if (found) return { name, authority: found };
    }

    return { name: "NONE", authority: null };
  }

  function scanFinger(key) {
    initializeFingerRegistry();

    const normalizedKey = normalizeFingerKey(key);
    const track = state.fingerRegistry[normalizedKey] || createFingerTrack(normalizedKey);
    const source = readFingerAuthority(normalizedKey);
    const authority = source.authority;
    const receipt = readReceipt(authority) || null;

    const apiReady = Boolean(
      authority &&
      (
        isFunction(authority.receiveHubPacket) ||
        isFunction(authority.receiveFingerPacket) ||
        isFunction(authority.receiveCanvasHubPacket) ||
        isFunction(authority.read) ||
        isFunction(authority.getReceipt) ||
        isFunction(authority.getReceiptLight)
      )
    ) || safeBool(receipt && (receipt.apiReady || receipt.fingerApiReady || receipt.canvasFingerApiReady), false);

    const hardFail = Boolean(
      safeBool(receipt && (receipt.hardFail || receipt.fingerHardFail || receipt.canvasFingerHardFail), false) ||
      hasFinalClaim(receipt)
    );

    const expressionPacketReceived = Boolean(track.expressionPacketReceived || packetHasExpressionContent(receipt));
    const receiptPacketReceived = Boolean(track.receiptPacketReceived || packetHasReceiptContent(receipt));
    const authorityObserved = Boolean(authority);

    const baseFallbackReady = BASE_FINGER_SEQUENCE.includes(normalizedKey) && authorityObserved;
    const trackReady = Boolean(apiReady || expressionPacketReceived || receiptPacketReceived || baseFallbackReady) && !hardFail;

    let status = FINGER_STATUS.DECLARED_WAITING_FILE;
    if (hardFail) status = FINGER_STATUS.HARD_FAIL;
    else if (trackReady) status = FINGER_STATUS.TRACK_READY;
    else if (receiptPacketReceived) status = FINGER_STATUS.RECEIPT_PACKET_RECEIVED;
    else if (expressionPacketReceived) status = FINGER_STATUS.EXPRESSION_PACKET_RECEIVED;
    else if (apiReady) status = FINGER_STATUS.API_READY;
    else if (authorityObserved) status = FINGER_STATUS.AUTHORITY_OBSERVED;

    state.fingerRegistry[normalizedKey] = {
      ...track,
      authorityObserved,
      apiReady,
      expressionPacketReceived,
      receiptPacketReceived,
      trackReady,
      hardFail,
      held: Boolean(receipt && upperText(receipt.status).includes("HELD")),
      status,
      lastAuthoritySourceName: source.name,
      lastReceiptPacket: receipt ? clonePlain(receipt) : track.lastReceiptPacket,
      firstGap: hardFail
        ? "FINGER_HARD_FAIL"
        : !authorityObserved
          ? "WAITING_DOWNSTREAM_FINGER_FILE"
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

    if (!state.fingerRegistry[key]) state.fingerRegistry[key] = createFingerTrack(key);

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
      expressionPacketReceived: Boolean(track.expressionPacketReceived || expressionContent),
      receiptPacketReceived: Boolean(track.receiptPacketReceived || receiptContent),
      lastExpressionPacket: expressionContent ? clonePlain(packet) : track.lastExpressionPacket,
      lastReceiptPacket: receiptContent ? clonePlain(packet) : track.lastReceiptPacket,
      trackReady: Boolean(!finalClaimBlocked && (expressionContent || receiptContent || track.trackReady)),
      status: finalClaimBlocked ? FINGER_STATUS.HARD_FAIL : FINGER_STATUS.TRACK_READY,
      firstGap: finalClaimBlocked ? "FINGER_FALSE_FINAL_CLAIM_BLOCKED" : "NONE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

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

    recomputeAll();
    drawBaseGlobe();
    updateDataset();
    publishGlobals();

    return getExpressionHubSummary();
  }

  function receiveExpressionFingerPacket(packet = {}) {
    return receiveFingerPacket({ ...packet, packetLane: "EXPRESSION" });
  }

  function receiveFingerReceipt(packet = {}) {
    return receiveFingerPacket({ ...packet, packetLane: "RECEIPT" });
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
    const baseTracks = BASE_FINGER_SEQUENCE.map((key) => state.fingerRegistry[key]).filter(Boolean);
    const expansionTracks = EXPANSION_FINGER_SEQUENCE.map((key) => state.fingerRegistry[key]).filter(Boolean);

    state.fingerAuthorityObservedCount = tracks.filter((track) => track.authorityObserved).length;
    state.fingerApiReadyCount = tracks.filter((track) => track.apiReady).length;
    state.fingerExpressionPacketCount = tracks.filter((track) => track.expressionPacketReceived).length;
    state.fingerReceiptPacketCount = tracks.filter((track) => track.receiptPacketReceived).length;
    state.fingerTrackReadyCount = tracks.filter((track) => track.trackReady).length;
    state.fingerHardFailCount = tracks.filter((track) => track.hardFail).length;

    state.baseFingerAuthorityObservedCount = baseTracks.filter((track) => track.authorityObserved).length;
    state.baseFingerTrackReadyCount = baseTracks.filter((track) => track.trackReady).length;
    state.anyBaseFingerTrackActive = baseTracks.some((track) => track.authorityObserved || track.trackReady);
    state.allBaseFingerTracksReady = baseTracks.length > 0 && baseTracks.every((track) => track.trackReady && !track.hardFail);
    state.baseFingerMinimumReady = Boolean(
      state.fingerRegistry.boundary &&
      state.fingerRegistry.mass &&
      state.fingerRegistry.surface &&
      state.fingerRegistry.light &&
      (
        state.fingerRegistry.boundary.trackReady ||
        state.fingerRegistry.boundary.authorityObserved
      ) &&
      (
        state.fingerRegistry.mass.trackReady ||
        state.fingerRegistry.mass.authorityObserved
      ) &&
      (
        state.fingerRegistry.surface.trackReady ||
        state.fingerRegistry.surface.authorityObserved
      ) &&
      (
        state.fingerRegistry.light.trackReady ||
        state.fingerRegistry.light.authorityObserved
      )
    );

    state.expansionFingerAuthorityObservedCount = expansionTracks.filter((track) => track.authorityObserved).length;
    state.expansionFingerTrackReadyCount = expansionTracks.filter((track) => track.trackReady).length;
    state.anyExpansionFingerTrackActive = expansionTracks.some((track) => track.authorityObserved || track.trackReady);
    state.allExpansionFingerTracksReady = expansionTracks.length > 0 && expansionTracks.every((track) => track.trackReady && !track.hardFail);

    state.anyFingerTrackActive = tracks.some((track) => track.authorityObserved || track.apiReady || track.expressionPacketReceived || track.receiptPacketReceived || track.trackReady);
    state.allDeclaredFingerTracksReady = tracks.length > 0 && tracks.every((track) => track.trackReady && !track.hardFail);

    const firstGapTrack =
      baseTracks.find((track) => track.firstGap && track.firstGap !== "NONE") ||
      expansionTracks.find((track) => track.firstGap && track.firstGap !== "NONE") ||
      null;

    state.firstFingerGap = firstGapTrack ? safeString(firstGapTrack.firstGap || "NONE") : "NONE";
    state.firstFingerGapFile = firstGapTrack ? safeString(firstGapTrack.file || "") : "";
    state.nextFingerFile = firstGapTrack ? safeString(firstGapTrack.file || "") : "";
    state.nextFingerKey = firstGapTrack ? safeString(firstGapTrack.key || "") : "";

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

  function findMountContainer() {
    if (!doc) return null;

    const selectors = [
      "[data-hearth-canvas-mount]",
      "[data-hearth-globe-mount]",
      "[data-hearth-planet-mount]",
      "#hearth-canvas-mount",
      "#hearth-globe-mount",
      "#hearth-planet-mount",
      "#hearth-cockpit",
      "#diagnostic-main",
      "main",
      "body"
    ];

    for (const selector of selectors) {
      const found = doc.querySelector(selector);
      if (found) {
        state.baseGlobeContainerSelector = selector;
        return found;
      }
    }

    return null;
  }

  function mountBaseGlobeCarrier() {
    state.baseGlobeMountAttempted = true;

    if (!doc) {
      state.baseGlobeMountReady = false;
      state.baseGlobeDrawHeldReason = "DOCUMENT_NOT_AVAILABLE";
      return null;
    }

    let canvas = doc.getElementById(state.baseGlobeCanvasId);
    if (canvas && canvas.tagName && canvas.tagName.toLowerCase() === "canvas") {
      state.baseGlobeCanvasFound = true;
      state.baseGlobeCanvasCreated = false;
      state.baseGlobeMountReady = true;
      return canvas;
    }

    const container = findMountContainer();
    if (!container) {
      state.baseGlobeMountReady = false;
      state.baseGlobeDrawHeldReason = "MOUNT_CONTAINER_NOT_FOUND";
      return null;
    }

    const wrap = doc.createElement("section");
    wrap.setAttribute("data-hearth-base-globe-carrier", "true");
    wrap.setAttribute("data-contract", CONTRACT);
    wrap.style.width = "min(92vw, 780px)";
    wrap.style.margin = "24px auto";
    wrap.style.padding = "16px";
    wrap.style.border = "1px solid rgba(255,255,255,.18)";
    wrap.style.borderRadius = "24px";
    wrap.style.background = "radial-gradient(circle at 50% 0%, rgba(74,122,255,.18), rgba(5,8,18,.82) 58%, rgba(0,0,0,.88))";
    wrap.style.boxShadow = "0 24px 90px rgba(0,0,0,.45)";
    wrap.style.position = "relative";
    wrap.style.zIndex = "1";

    const label = doc.createElement("div");
    label.textContent = "Hearth Base Canvas Globe";
    label.style.font = "600 13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    label.style.letterSpacing = ".14em";
    label.style.textTransform = "uppercase";
    label.style.color = "rgba(255,255,255,.82)";
    label.style.margin = "0 0 12px";
    label.style.textAlign = "center";

    canvas = doc.createElement("canvas");
    canvas.id = state.baseGlobeCanvasId;
    canvas.width = 720;
    canvas.height = 440;
    canvas.setAttribute("data-hearth-base-globe-canvas", "true");
    canvas.setAttribute("data-contract", CONTRACT);
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "720px";
    canvas.style.height = "auto";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "20px";
    canvas.style.background = "rgba(0,0,0,.35)";

    const note = doc.createElement("div");
    note.textContent = "Carrier view only · not final visual pass";
    note.style.font = "500 12px/1.5 system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    note.style.color = "rgba(255,255,255,.62)";
    note.style.textAlign = "center";
    note.style.margin = "10px 0 0";

    wrap.appendChild(label);
    wrap.appendChild(canvas);
    wrap.appendChild(note);

    if (container === doc.body) {
      doc.body.insertBefore(wrap, doc.body.firstChild);
    } else {
      container.appendChild(wrap);
    }

    state.baseGlobeCanvasCreated = true;
    state.baseGlobeCanvasFound = true;
    state.baseGlobeMountReady = true;
    return canvas;
  }

  function drawAtmosphere(ctx, cx, cy, r) {
    const glow = ctx.createRadialGradient(cx, cy, r * 0.78, cx, cy, r * 1.42);
    glow.addColorStop(0, "rgba(78, 180, 255, 0.02)");
    glow.addColorStop(0.45, "rgba(97, 190, 255, 0.18)");
    glow.addColorStop(1, "rgba(20, 34, 90, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.42, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGlobeBody(ctx, cx, cy, r) {
    const ocean = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.42, r * 0.12, cx, cy, r);
    ocean.addColorStop(0, "rgba(106, 206, 255, 1)");
    ocean.addColorStop(0.42, "rgba(28, 112, 184, 1)");
    ocean.addColorStop(0.78, "rgba(9, 42, 97, 1)");
    ocean.addColorStop(1, "rgba(2, 12, 38, 1)");

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    const land = [
      { x: -0.42, y: -0.22, sx: 0.42, sy: 0.25, rot: -0.32 },
      { x: -0.16, y: 0.18, sx: 0.34, sy: 0.19, rot: 0.18 },
      { x: 0.32, y: -0.05, sx: 0.36, sy: 0.24, rot: 0.28 },
      { x: 0.12, y: 0.36, sx: 0.24, sy: 0.13, rot: -0.2 },
      { x: 0.05, y: -0.44, sx: 0.22, sy: 0.11, rot: 0.08 }
    ];

    for (const patch of land) {
      ctx.save();
      ctx.translate(cx + patch.x * r, cy + patch.y * r);
      ctx.rotate(patch.rot);
      const grd = ctx.createRadialGradient(0, 0, r * 0.02, 0, 0, r * 0.38);
      grd.addColorStop(0, "rgba(188, 162, 101, 0.96)");
      grd.addColorStop(0.45, "rgba(82, 116, 74, 0.95)");
      grd.addColorStop(1, "rgba(37, 70, 55, 0.92)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(0, 0, patch.sx * r, patch.sy * r, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(130, 224, 220, 0.58)";
      ctx.lineWidth = Math.max(1.2, r * 0.012);
      ctx.stroke();
      ctx.restore();
    }

    for (let i = 0; i < 9; i += 1) {
      const y = cy - r + ((i + 1) * r * 2) / 10;
      ctx.strokeStyle = "rgba(255,255,255,.055)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, y, r * Math.sqrt(Math.max(0, 1 - Math.pow((y - cy) / r, 2))), r * 0.018, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    const shade = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.42, r * 0.2, cx + r * 0.35, cy + r * 0.32, r * 1.08);
    shade.addColorStop(0, "rgba(255,255,255,.32)");
    shade.addColorStop(0.44, "rgba(255,255,255,.03)");
    shade.addColorStop(0.82, "rgba(0,0,0,.22)");
    shade.addColorStop(1, "rgba(0,0,0,.54)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    ctx.strokeStyle = "rgba(208, 239, 255, 0.74)";
    ctx.lineWidth = Math.max(1.5, r * 0.016);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawBaseGlobe() {
    state.baseGlobeDrawAttempted = true;

    const canvas = mountBaseGlobeCarrier();
    if (!canvas) {
      state.baseGlobeDrawComplete = false;
      state.baseGlobeVisibleCarrierReady = false;
      return false;
    }

    const ctx = canvas.getContext ? canvas.getContext("2d") : null;
    if (!ctx) {
      state.baseGlobeDrawComplete = false;
      state.baseGlobeVisibleCarrierReady = false;
      state.baseGlobeDrawHeldReason = "2D_CONTEXT_NOT_AVAILABLE";
      state.baseGlobeError = "Canvas 2D context unavailable";
      return false;
    }

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 440;
      const cx = w * 0.5;
      const cy = h * 0.52;
      const r = Math.min(w, h) * 0.36;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "rgba(4, 8, 20, 1)");
      bg.addColorStop(0.55, "rgba(7, 13, 31, 1)");
      bg.addColorStop(1, "rgba(1, 3, 10, 1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 72; i += 1) {
        const x = (i * 97) % w;
        const y = (i * 53) % h;
        const a = 0.12 + ((i % 5) * 0.035);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, i % 3 === 0 ? 1.15 : 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      drawAtmosphere(ctx, cx, cy, r);
      drawGlobeBody(ctx, cx, cy, r);

      ctx.fillStyle = "rgba(255,255,255,.72)";
      ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Base globe carrier · boundary + mass + surface + light", cx, h - 20);

      state.baseGlobeDrawComplete = true;
      state.baseGlobeDrawHeldReason = "NONE";
      state.baseGlobeVisibleCarrierReady = true;
      state.baseGlobeVisualizationExpected = true;
      state.baseGlobeExpandable = true;
      state.baseGlobeFrameCount += 1;
      state.baseGlobeLastDrawAt = nowIso();
      state.baseGlobeError = "";

      return true;
    } catch (error) {
      state.baseGlobeDrawComplete = false;
      state.baseGlobeVisibleCarrierReady = false;
      state.baseGlobeDrawHeldReason = "DRAW_ERROR";
      state.baseGlobeError = error && error.message ? error.message : String(error);
      recordError("BASE_GLOBE_DRAW_FAILED", error);
      return false;
    }
  }

  function readCanvasChild(kind) {
    const sources = {
      east: ["HEARTH_CANVAS_EAST", "HEARTH.canvasEast", "DEXTER_LAB.hearthCanvasEast"],
      west: ["HEARTH_CANVAS_WEST", "HEARTH.canvasWest", "DEXTER_LAB.hearthCanvasWest"],
      south: ["HEARTH_CANVAS_SOUTH", "HEARTH.canvasSouth", "DEXTER_LAB.hearthCanvasSouth"]
    };

    for (const name of sources[kind] || []) {
      const found = readPath(name);
      if (found) return found;
    }

    return null;
  }

  function scanCanvasChildren() {
    const east = readCanvasChild("east");
    const west = readCanvasChild("west");
    const south = readCanvasChild("south");

    const eastReceipt = readReceipt(east) || {};
    const westReceipt = readReceipt(west) || {};
    const southReceipt = readReceipt(south) || {};

    state.canvasEastApiReady = Boolean(east || safeBool(eastReceipt.canvasEastApiReady, false));
    state.canvasEastEvidenceReady = Boolean(safeBool(eastReceipt.canvasEastEvidenceReady, false) || safeBool(eastReceipt.atlasReady, false));
    state.canvasWestApiReady = Boolean(west || safeBool(westReceipt.canvasWestApiReady, false));
    state.canvasWestInspectionReady = Boolean(safeBool(westReceipt.canvasWestInspectionReady, false) || safeBool(westReceipt.inspectionReady, false));
    state.canvasSouthApiReady = Boolean(south || safeBool(southReceipt.canvasSouthApiReady, false));
    state.canvasSouthVisibleProofReady = Boolean(safeBool(southReceipt.canvasSouthVisibleProofReady, false) || safeBool(southReceipt.visiblePlanetAvailable, false) || safeBool(southReceipt.imageRendered, false));

    return {
      east: { observed: Boolean(east), receipt: clonePlain(eastReceipt) },
      west: { observed: Boolean(west), receipt: clonePlain(westReceipt) },
      south: { observed: Boolean(south), receipt: clonePlain(southReceipt) }
    };
  }

  function resolveF13Gap() {
    let gap = "NONE_VISIBLE_BASE_GLOBE_CARRIER_READY";
    let target = FILE;
    let status = "CANVAS_VISIBLE_BASE_GLOBE_CARRIER_READY_FOR_DOWNSTREAM_EXPANSION";

    if (!state.routeConductorCurrentRecognized) {
      gap = "WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION";
      target = ROUTE_FILE;
      status = "CANVAS_VISIBLE_BASE_GLOBE_WAITING_CURRENT_ROUTE_CONDUCTOR_V9_4_RECOGNITION";
    } else if (!state.releasePacketObserved) {
      gap = "WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
      target = ROUTE_FILE;
      status = "CANVAS_VISIBLE_BASE_GLOBE_WAITING_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.releasePacketValid) {
      gap = "WAITING_VALID_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
      target = ROUTE_FILE;
      status = "CANVAS_VISIBLE_BASE_GLOBE_WAITING_VALID_CURRENT_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.canvasParentReleaseAccepted) {
      gap = "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE";
      target = FILE;
      status = "CANVAS_VISIBLE_BASE_GLOBE_WAITING_PARENT_RELEASE_ACCEPTANCE";
    } else if (!state.baseGlobeMountReady) {
      gap = "WAITING_BASE_GLOBE_MOUNT";
      target = FILE;
      status = "CANVAS_VISIBLE_BASE_GLOBE_WAITING_MOUNT";
    } else if (!state.baseGlobeDrawComplete) {
      gap = "WAITING_BASE_GLOBE_DRAW";
      target = FILE;
      status = "CANVAS_VISIBLE_BASE_GLOBE_WAITING_DRAW";
    } else if (state.fingerHardFailCount > 0) {
      gap = "FINGER_TRACK_HARD_FAIL";
      target = state.firstFingerGapFile || FILE;
      status = "CANVAS_VISIBLE_BASE_GLOBE_FINGER_TRACK_HARD_FAIL";
    } else if (!state.anyBaseFingerTrackActive) {
      gap = "BASE_GLOBE_VISIBLE_WITH_BASE_FINGERS_NOT_YET_OBSERVED";
      target = BASE_FINGER_FILES.boundary;
      status = "CANVAS_VISIBLE_BASE_GLOBE_DRAWN_WAITING_BASE_FINGER_RECEIPTS";
    } else if (!state.baseFingerMinimumReady) {
      gap = state.firstFingerGap || "WAITING_BASE_FINGER_TRACKS";
      target = state.firstFingerGapFile || state.nextFingerFile || BASE_FINGER_FILES.boundary;
      status = "CANVAS_VISIBLE_BASE_GLOBE_DRAWN_WAITING_BASE_FINGER_TRACKS";
    }

    state.f13StrictEvidenceGap = gap;
    state.f13StrictEvidenceRepairTarget = target;
    state.firstFailedCoordinate = gap;
    state.recommendedNextFile = target;
    state.recommendedNextRenewalTarget = target;
    state.canvasNextAuditTarget = target;
    state.postgameStatus = status;

    state.f13HardFail = Boolean(state.fingerHardFailCount > 0);
    state.f13VisibleEvidenceAvailable = Boolean(state.baseGlobeVisibleCarrierReady);
    state.f13InspectEvidenceAvailable = Boolean(state.fingerRegistry.inspect && state.fingerRegistry.inspect.trackReady);
    state.f13CanvasReadinessObserved = Boolean(state.baseGlobeDrawAttempted || state.anyFingerTrackActive);
    state.f13CanvasEvidenceDegraded = Boolean(state.baseGlobeVisibleCarrierReady && !state.f13HardFail);
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceComplete = Boolean(state.f13CanvasEvidenceDegraded);

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

    let observed = false;
    for (const candidate of candidates) {
      if (candidate && isObject(candidate)) {
        observed = true;
        break;
      }
    }

    state.diagnosticRailObserved = observed;
    return { observed };
  }

  function composeDiagnosticBridgeSummary() {
    const diagnostic = readDiagnosticRailSummary();

    const mismatch = !state.routeConductorCurrentRecognized
      ? "CURRENT_ROUTE_CONDUCTOR_V9_4_NOT_RECOGNIZED"
      : !state.expressionHubActive
        ? "CANVAS_EXPRESSION_HUB_NOT_ACTIVE"
        : !state.visibleBaseGlobeCarrierActive
          ? "VISIBLE_BASE_GLOBE_CARRIER_NOT_ACTIVE"
          : "false";

    state.diagnosticBridgeMismatch = mismatch;
    state.diagnosticBridgeSummaryStatus = mismatch === "false"
      ? diagnostic.observed
        ? "BRIDGE_ALIGNED_DIAGNOSTIC_CANVAS_HUB_AND_VISIBLE_BASE_GLOBE_AVAILABLE"
        : "BRIDGE_ALIGNED_CANVAS_HUB_AND_VISIBLE_BASE_GLOBE_SIDE_ONLY"
      : "BRIDGE_HELD";
    state.diagnosticBridgeFirstFailedCoordinate = mismatch === "false" ? state.firstFailedCoordinate : mismatch;
    state.diagnosticBridgeRecommendedNextFile = mismatch === "false" ? state.recommendedNextFile : FILE;

    const bridge = {
      packetType: "HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticBridgeActive: true,
      visibleBaseGlobeCarrierActive: true,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      diagnosticRailObserved: diagnostic.observed,
      diagnosticBridgeSummaryStatus: state.diagnosticBridgeSummaryStatus,
      diagnosticBridgeMismatch: state.diagnosticBridgeMismatch,
      firstFailedCoordinate: state.diagnosticBridgeFirstFailedCoordinate,
      recommendedNextFile: state.diagnosticBridgeRecommendedNextFile,
      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.lastDiagnosticBridgeSummary = clonePlain(bridge);
    return bridge;
  }

  function recomputeAll() {
    readRouteConductorProfile();
    scanAllFingers();
    recomputeFingerAggregation();
    scanCanvasChildren();
    resolveF13Gap();
    composeDiagnosticBridgeSummary();
    return clonePlain(state);
  }

  function runCanonicalParentSequence(packet, intakeMethod) {
    if (isObject(packet)) {
      state.routeConductorReleasePacket = clonePlain(packet);
      state.releasePacketObserved = true;
      state.acceptedReleaseSource = intakeMethod === "DIRECT_ROUTE_CONDUCTOR_CANDIDATE"
        ? RELEASE_SOURCE.DIRECT_ROUTE_CONDUCTOR_CANDIDATE
        : state.acceptedReleaseSource;
    }

    const normalized = normalizeReleasePacket(packet);
    validateReleasePacket(normalized);

    if (state.releasePacketValid) acceptRelease(normalized);
    else acceptRelease(normalized);

    const dispatchPacket = composeEastDispatchPacket();
    if (dispatchPacket) publishEastDispatchPacket(dispatchPacket);

    recomputeAll();
    drawBaseGlobe();
    updateDataset();
    publishGlobals();

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

  function receiveChildPacket(packet) {
    if (!isObject(packet)) return false;

    const key = inferFingerKeyFromPacket(packet);
    if (key && FINGER_FILES[key]) return receiveFingerPacket(packet);

    recomputeAll();
    updateDataset();
    publishGlobals();
    return true;
  }

  function receiveEastPacket(packet) {
    state.canvasEastApiReady = true;
    state.canvasEastEvidenceReady = packet && isObject(packet) ? packet.canvasEastEvidenceReady === true || packet.atlasReady === true : state.canvasEastEvidenceReady;
    recomputeAll();
    return getCanvasStationSummary();
  }

  function receiveWestPacket(packet) {
    state.canvasWestApiReady = true;
    state.canvasWestInspectionReady = packet && isObject(packet) ? packet.canvasWestInspectionReady === true || packet.inspectionReady === true : state.canvasWestInspectionReady;
    recomputeAll();
    return getCanvasStationSummary();
  }

  function receiveSouthPacket(packet) {
    state.canvasSouthApiReady = true;
    state.canvasSouthVisibleProofReady = packet && isObject(packet)
      ? packet.canvasSouthVisibleProofReady === true || packet.visiblePlanetAvailable === true || packet.imageRendered === true
      : state.canvasSouthVisibleProofReady;
    recomputeAll();
    return getCanvasStationSummary();
  }

  function getExpressionHubSummary() {
    initializeFingerRegistry();

    const summary = {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      expressionHubActive: true,
      fingerManagerActive: true,
      visibleBaseGlobeCarrierActive: true,
      baseFingerRegistryActive: true,
      expansionFingerRegistryActive: true,
      namedBaseFingerFilesEmbedded: true,
      namedExpansionFingerFilesEmbedded: true,
      hubOwnsVisibleBaseGlobeCarrier: true,
      hubDoesNotOwnFinalPlanetTruth: true,

      baseFingerSequence: BASE_FINGER_SEQUENCE.slice(),
      expansionFingerSequence: EXPANSION_FINGER_SEQUENCE.slice(),
      fingerSequence: FINGER_SEQUENCE.slice(),
      baseFingerFiles: clonePlain(BASE_FINGER_FILES),
      expansionFingerFiles: clonePlain(EXPANSION_FINGER_FILES),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerRegistry: getFingerRegistry(),

      fingerAuthorityObservedCount: state.fingerAuthorityObservedCount,
      fingerApiReadyCount: state.fingerApiReadyCount,
      fingerExpressionPacketCount: state.fingerExpressionPacketCount,
      fingerReceiptPacketCount: state.fingerReceiptPacketCount,
      fingerTrackReadyCount: state.fingerTrackReadyCount,
      fingerHardFailCount: state.fingerHardFailCount,

      baseFingerAuthorityObservedCount: state.baseFingerAuthorityObservedCount,
      baseFingerTrackReadyCount: state.baseFingerTrackReadyCount,
      baseFingerMinimumReady: state.baseFingerMinimumReady,
      allBaseFingerTracksReady: state.allBaseFingerTracksReady,
      anyBaseFingerTrackActive: state.anyBaseFingerTrackActive,

      expansionFingerAuthorityObservedCount: state.expansionFingerAuthorityObservedCount,
      expansionFingerTrackReadyCount: state.expansionFingerTrackReadyCount,
      anyExpansionFingerTrackActive: state.anyExpansionFingerTrackActive,
      allExpansionFingerTracksReady: state.allExpansionFingerTracksReady,

      baseGlobeMountAttempted: state.baseGlobeMountAttempted,
      baseGlobeMountReady: state.baseGlobeMountReady,
      baseGlobeCanvasCreated: state.baseGlobeCanvasCreated,
      baseGlobeCanvasFound: state.baseGlobeCanvasFound,
      baseGlobeContainerSelector: state.baseGlobeContainerSelector,
      baseGlobeCanvasId: state.baseGlobeCanvasId,
      baseGlobeDrawAttempted: state.baseGlobeDrawAttempted,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      baseGlobeDrawHeldReason: state.baseGlobeDrawHeldReason,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      baseGlobeVisualizationExpected: state.baseGlobeVisualizationExpected,
      baseGlobeExpandable: state.baseGlobeExpandable,
      baseGlobeDrawMode: state.baseGlobeDrawMode,
      baseGlobeFrameCount: state.baseGlobeFrameCount,
      baseGlobeLastDrawAt: state.baseGlobeLastDrawAt,
      baseGlobeError: state.baseGlobeError,

      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.lastExpressionHubSummary = clonePlain(summary);
    return summary;
  }

  function getExpressionHubReceipt() {
    const receipt = {
      ...getExpressionHubSummary(),
      packetType: "CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_RECEIPT",
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

  function getCanvasStationSummary() {
    recomputeAll();

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
      packetType: "CANVAS_LOCAL_STATION_VISIBLE_BASE_GLOBE_SUMMARY",
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasLocalStationActive: true,
      expressionHubActive: true,
      fingerManagerActive: true,
      visibleBaseGlobeCarrierActive: true,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractKnown: state.routeConductorContractKnown,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      routeConductorCurrentV9_4Recognized: state.routeConductorCurrentV9_4Recognized,
      routeConductorLineageV9_3Observed: state.routeConductorLineageV9_3Observed,
      routeConductorLegacyV9_2Observed: state.routeConductorLegacyV9_2Observed,
      routeConductorAuthoritySourceName: state.routeConductorAuthoritySourceName,
      routeConductorAuthoritySourceMethod: state.routeConductorAuthoritySourceMethod,
      routeConductorReleaseAuthorityAccepted: state.routeConductorReleaseAuthorityAccepted,

      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      releasePacketAccepted: state.releasePacketAccepted,
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

      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      eastDispatchAttempted: state.eastDispatchAttempted,
      eastDispatchMethod: state.eastDispatchMethod,

      expressionHubSummary: getExpressionHubSummary(),
      diagnosticBridgeSummary: composeDiagnosticBridgeSummary(),
      diagnosticBridgeSummaryStatus: state.diagnosticBridgeSummaryStatus,
      diagnosticBridgeMismatch: state.diagnosticBridgeMismatch,
      diagnosticBridgeFirstFailedCoordinate: state.diagnosticBridgeFirstFailedCoordinate,
      diagnosticBridgeRecommendedNextFile: state.diagnosticBridgeRecommendedNextFile,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      canvasNextAuditTarget: state.canvasNextAuditTarget,
      postgameStatus: state.postgameStatus,

      routeConductorShouldConsumeThisSummary: true,
      diagnosticRailMayReadThisSummary: true,
      visibleBaseGlobeCarrierMayBeUsedForTroubleshooting: true,
      finalVisualPassClaimed: false,

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
      packetType: "CANVAS_LOCAL_STATION_VISIBLE_BASE_GLOBE_RECEIPT",
      routeConductorReleasePacket: clonePlain(state.routeConductorReleasePacket),
      normalizedReleasePacket: clonePlain(state.normalizedReleasePacket),
      lastEastDispatchPacket: clonePlain(state.lastEastDispatchPacket),
      lastRouteConductorAuthorityReceipt: clonePlain(state.lastRouteConductorAuthorityReceipt),
      expressionHubReceipt: getExpressionHubReceipt(),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      currentReceipt: true,
      ...FINAL_FALSE
    };
  }

  function getDiagnosticBridgeSummary() {
    return clonePlain(state.lastDiagnosticBridgeSummary || composeDiagnosticBridgeSummary());
  }

  function getDiagnosticBridgeReceipt() {
    return {
      ...getDiagnosticBridgeSummary(),
      packetType: "HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_VISIBLE_BASE_GLOBE_RECEIPT",
      currentReceipt: true,
      expressionHubSummary: getExpressionHubSummary(),
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
      role: "canvas-visible-base-globe-structural-carrier",
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,
      expressionHubActive: true,
      visibleBaseGlobeCarrierActive: true,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      baseFingerMinimumReady: state.baseFingerMinimumReady,
      fingerRegistry: getFingerRegistry(),
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
      ...FINAL_FALSE
    };
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function getReceiptText() {
    const r = getCanvasStationSummary();
    const hub = r.expressionHubSummary || {};

    return [
      "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT",
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
      "",
      "VISIBLE_BASE_GLOBE",
      line("visibleBaseGlobeCarrierActive", true),
      line("baseGlobeMountAttempted", hub.baseGlobeMountAttempted),
      line("baseGlobeMountReady", hub.baseGlobeMountReady),
      line("baseGlobeCanvasCreated", hub.baseGlobeCanvasCreated),
      line("baseGlobeCanvasFound", hub.baseGlobeCanvasFound),
      line("baseGlobeContainerSelector", hub.baseGlobeContainerSelector),
      line("baseGlobeCanvasId", hub.baseGlobeCanvasId),
      line("baseGlobeDrawAttempted", hub.baseGlobeDrawAttempted),
      line("baseGlobeDrawComplete", hub.baseGlobeDrawComplete),
      line("baseGlobeDrawHeldReason", hub.baseGlobeDrawHeldReason),
      line("baseGlobeVisibleCarrierReady", hub.baseGlobeVisibleCarrierReady),
      line("baseGlobeVisualizationExpected", hub.baseGlobeVisualizationExpected),
      line("baseGlobeExpandable", hub.baseGlobeExpandable),
      line("baseGlobeDrawMode", hub.baseGlobeDrawMode),
      line("baseGlobeFrameCount", hub.baseGlobeFrameCount),
      line("baseGlobeError", hub.baseGlobeError),
      "",
      "BASE_FINGERS",
      line("boundary", BASE_FINGER_FILES.boundary),
      line("mass", BASE_FINGER_FILES.mass),
      line("surface", BASE_FINGER_FILES.surface),
      line("light", BASE_FINGER_FILES.light),
      line("inspect", BASE_FINGER_FILES.inspect),
      line("baseFingerAuthorityObservedCount", hub.baseFingerAuthorityObservedCount),
      line("baseFingerTrackReadyCount", hub.baseFingerTrackReadyCount),
      line("baseFingerMinimumReady", hub.baseFingerMinimumReady),
      line("allBaseFingerTracksReady", hub.allBaseFingerTracksReady),
      line("anyBaseFingerTrackActive", hub.anyBaseFingerTrackActive),
      "",
      "EXPANSION_FINGERS",
      line("landform", EXPANSION_FINGER_FILES.landform),
      line("elevation", EXPANSION_FINGER_FILES.elevation),
      line("material", EXPANSION_FINGER_FILES.material),
      line("hydrology", EXPANSION_FINGER_FILES.hydrology),
      line("atmosphere", EXPANSION_FINGER_FILES.atmosphere),
      line("lighting", EXPANSION_FINGER_FILES.lighting),
      line("composite", EXPANSION_FINGER_FILES.composite),
      line("anyExpansionFingerTrackActive", hub.anyExpansionFingerTrackActive),
      line("allExpansionFingerTracksReady", hub.allExpansionFingerTracksReady),
      "",
      "ROUTE_CONDUCTOR",
      line("currentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT),
      line("currentRouteConductorRequiredReceipt", CURRENT_ROUTE_CONDUCTOR_RECEIPT),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContractKnown", r.routeConductorContractKnown),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorReceipt", r.routeConductorReceipt),
      line("routeConductorCurrentRecognized", r.routeConductorCurrentRecognized),
      line("routeConductorCurrentV9_4Recognized", r.routeConductorCurrentV9_4Recognized),
      line("releasePacketObserved", r.releasePacketObserved),
      line("releasePacketValid", r.releasePacketValid),
      line("releasePacketAccepted", r.releasePacketAccepted),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13EligibleForCanvas", false),
      line("f13ClaimedByCanvasParent", false),
      line("f21EligibleForNorth", false),
      line("f21SubmittedToNorth", false),
      line("completionLatched", false),
      line("finalCompletionLatched", false),
      line("readyTextAllowed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false)
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

    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasVisibleBaseGlobeCarrierActive", "true");
    setDataset("hearthCanvasBaseFingerRegistryActive", "true");
    setDataset("hearthCanvasExpansionFingerRegistryActive", "true");

    setDataset("hearthCanvasCurrentRouteConductorRequiredContract", CURRENT_ROUTE_CONDUCTOR_CONTRACT);
    setDataset("hearthCanvasCurrentRouteConductorRequiredReceipt", CURRENT_ROUTE_CONDUCTOR_RECEIPT);
    setDataset("hearthCanvasRouteConductorObserved", String(state.routeConductorObserved));
    setDataset("hearthCanvasRouteConductorContractKnown", String(state.routeConductorContractKnown));
    setDataset("hearthCanvasRouteConductorContract", state.routeConductorContract);
    setDataset("hearthCanvasRouteConductorReceipt", state.routeConductorReceipt);
    setDataset("hearthCanvasRouteConductorCurrentRecognized", String(state.routeConductorCurrentRecognized));
    setDataset("hearthCanvasRouteConductorCurrentV94Recognized", String(state.routeConductorCurrentV9_4Recognized));

    setDataset("hearthCanvasReleasePacketObserved", String(state.releasePacketObserved));
    setDataset("hearthCanvasReleasePacketValid", String(state.releasePacketValid));
    setDataset("hearthCanvasReleasePacketAccepted", String(state.releasePacketAccepted));
    setDataset("hearthCanvasParentReleaseAccepted", String(state.canvasParentReleaseAccepted));
    setDataset("hearthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthCanvasReleasePacketReady", String(state.canvasReleasePacketReady));
    setDataset("hearthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthCanvasBaseGlobeMountAttempted", String(state.baseGlobeMountAttempted));
    setDataset("hearthCanvasBaseGlobeMountReady", String(state.baseGlobeMountReady));
    setDataset("hearthCanvasBaseGlobeCanvasCreated", String(state.baseGlobeCanvasCreated));
    setDataset("hearthCanvasBaseGlobeCanvasFound", String(state.baseGlobeCanvasFound));
    setDataset("hearthCanvasBaseGlobeCanvasId", state.baseGlobeCanvasId);
    setDataset("hearthCanvasBaseGlobeDrawAttempted", String(state.baseGlobeDrawAttempted));
    setDataset("hearthCanvasBaseGlobeDrawComplete", String(state.baseGlobeDrawComplete));
    setDataset("hearthCanvasBaseGlobeDrawHeldReason", state.baseGlobeDrawHeldReason);
    setDataset("hearthCanvasBaseGlobeVisibleCarrierReady", String(state.baseGlobeVisibleCarrierReady));
    setDataset("hearthCanvasBaseGlobeVisualizationExpected", String(state.baseGlobeVisualizationExpected));
    setDataset("hearthCanvasBaseGlobeExpandable", String(state.baseGlobeExpandable));
    setDataset("hearthCanvasBaseGlobeDrawMode", state.baseGlobeDrawMode);
    setDataset("hearthCanvasBaseGlobeFrameCount", String(state.baseGlobeFrameCount));
    setDataset("hearthCanvasBaseGlobeLastDrawAt", state.baseGlobeLastDrawAt);
    setDataset("hearthCanvasBaseGlobeError", state.baseGlobeError);

    setDataset("hearthCanvasBaseFingerAuthorityObservedCount", String(state.baseFingerAuthorityObservedCount));
    setDataset("hearthCanvasBaseFingerTrackReadyCount", String(state.baseFingerTrackReadyCount));
    setDataset("hearthCanvasBaseFingerMinimumReady", String(state.baseFingerMinimumReady));
    setDataset("hearthCanvasAllBaseFingerTracksReady", String(state.allBaseFingerTracksReady));
    setDataset("hearthCanvasAnyBaseFingerTrackActive", String(state.anyBaseFingerTrackActive));

    setDataset("hearthCanvasExpansionFingerAuthorityObservedCount", String(state.expansionFingerAuthorityObservedCount));
    setDataset("hearthCanvasExpansionFingerTrackReadyCount", String(state.expansionFingerTrackReadyCount));
    setDataset("hearthCanvasAnyExpansionFingerTrackActive", String(state.anyExpansionFingerTrackActive));
    setDataset("hearthCanvasAllExpansionFingerTracksReady", String(state.allExpansionFingerTracksReady));

    Object.keys(BASE_FINGER_FILES).forEach((key) => {
      setDataset(`hearthCanvasBaseFinger${key.charAt(0).toUpperCase()}${key.slice(1)}File`, BASE_FINGER_FILES[key]);
    });

    Object.keys(EXPANSION_FINGER_FILES).forEach((key) => {
      setDataset(`hearthCanvasExpansionFinger${key.charAt(0).toUpperCase()}${key.slice(1)}File`, EXPANSION_FINGER_FILES[key]);
    });

    setDataset("hearthCanvasDiagnosticBridgeSummaryStatus", state.diagnosticBridgeSummaryStatus);
    setDataset("hearthCanvasDiagnosticBridgeMismatch", state.diagnosticBridgeMismatch);
    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasF13EligibleForCanvas", "false");
    setDataset("hearthCanvasF13ClaimedByCanvasParent", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasFinalCompletionLatched", "false");
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
    hearth.canvasDiagnosticBridge = api;
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;
    hearth.canvasVisibleBaseGlobeCarrier = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;
    root.HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasDiagnosticBridge = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;
    lab.hearthCanvasVisibleBaseGlobeCarrier = api;

    const light = getReceiptLight();
    const full = getReceipt();
    const hubReceipt = getExpressionHubReceipt();
    const bridge = getDiagnosticBridgeReceipt();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_RECEIPT_v11_7 = full;
    root.HEARTH_CANVAS_DIAGNOSTIC_BRIDGE_RECEIPT = bridge;

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasExpressionHubReceipt = hubReceipt;
    hearth.canvasFingerManagerReceipt = hubReceipt;
    hearth.canvasVisibleBaseGlobeCarrierReceipt = full;
    hearth.canvasDiagnosticBridgeReceipt = bridge;

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasExpressionHubReceipt = hubReceipt;
    lab.hearthCanvasFingerManagerReceipt = hubReceipt;
    lab.hearthCanvasVisibleBaseGlobeCarrierReceipt = full;
    lab.hearthCanvasDiagnosticBridgeReceipt = bridge;

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

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
      readPath("DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment")
    ];

    const methods = [
      "receiveCanvasExpressionHubSummary",
      "receiveCanvasVisibleBaseGlobeSummary",
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
    recomputeAll();
    drawBaseGlobe();
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
      recomputeAll();
      drawBaseGlobe();
      updateDataset();
      publishGlobals();
      notifyRouteConductor();
    }

    state.bootAuditComplete = true;

    record("CANVAS_VISIBLE_BASE_GLOBE_CARRIER_BOOT_AUDIT_COMPLETE", {
      routeConductorCurrentRecognized: state.routeConductorCurrentRecognized,
      releasePacketObserved: state.releasePacketObserved,
      releasePacketValid: state.releasePacketValid,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      visibleBaseGlobeCarrierActive: true,
      baseGlobeMountReady: state.baseGlobeMountReady,
      baseGlobeDrawComplete: state.baseGlobeDrawComplete,
      baseGlobeVisibleCarrierReady: state.baseGlobeVisibleCarrierReady,
      baseFingerMinimumReady: state.baseFingerMinimumReady,
      firstFailedCoordinate: state.firstFailedCoordinate,
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

    BASE_FINGER_FILES,
    EXPANSION_FINGER_FILES,
    FINGER_FILES,
    BASE_FINGER_SEQUENCE,
    EXPANSION_FINGER_SEQUENCE,
    FINGER_SEQUENCE,
    FINGER_ROLES,

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

    initializeFingerRegistry,
    normalizeFingerKey,
    inferFingerKeyFromPacket,
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

    mountBaseGlobeCarrier,
    drawBaseGlobe,

    getExpressionHubSummary,
    getExpressionHubReceipt,
    getCanvasStationSummary,
    getCanvasStationReceipt,
    getCanvasStationReceiptLight,
    getDiagnosticBridgeSummary,
    getDiagnosticBridgeReceipt,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    updateDatasetAndReceipt,
    publishGlobals,
    notifyRouteConductor,
    recomputeAll,
    resolveF13Gap,

    supportsCanvasLocalStation: true,
    supportsExpressionHub: true,
    supportsCanvasFingerManager: true,
    supportsVisibleBaseGlobeCarrier: true,
    supportsBaseFingerRegistry: true,
    supportsExpansionFingerRegistry: true,
    supportsFingerExpressionReceiptSeparation: true,
    supportsFingerPacketIntake: true,
    supports2DCanvasOnly: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsCanvasParentIdentity: true,
    ownsExpressionHub: true,
    ownsFingerManager: true,
    ownsFingerRegistry: true,
    ownsFingerIntake: true,
    ownsVisibleBaseGlobeCarrier: true,
    ownsFinalPlanetTruth: false,
    ownsFingerTruth: false,
    ownsRouteConductorSwitching: false,
    ownsDiagnosticRailCaseSelection: false,
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
    recordError("CANVAS_VISIBLE_BASE_GLOBE_CARRIER_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
