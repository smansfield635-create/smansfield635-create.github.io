// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_TNT_v11_1
// Full-file replacement.
// Canvas East / same-runtime exposure beacon / API-publication / atlas-source child.
//
// Baseline authority:
// - HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_TNT_v10
//
// Supersedes defective draft:
// - HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_TNT_v11
//
// Purpose:
// - Keep Canvas East as the lawful next target while Route Conductor reports WAITING_CANVAS_EAST_API.
// - Publish Canvas East API into the same served runtime immediately and redundantly.
// - Expose the exact aliases already scanned by Route Conductor v8_2.
// - Preserve strict separation between East API readiness and East atlas evidence readiness.
// - Treat held atlas packets as lawful non-evidence, not API failure.
// - Keep API readiness true when parent dispatch, material authority, atlas evidence, West, South, or route conductor are absent.
// - Notify Route Conductor nonblockingly after East publication.
// - Never claim final visible proof, ready text, completion latch, F21, generated image, GraphicBox, WebGL, or final visual pass.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_TNT_v11_1";
  const RECEIPT = "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_RECEIPT_v11_1";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_TNT_v11";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_RECEIPT_v11";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_TNT_v10";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_RECEIPT_v10";

  const LEGACY_BASELINE_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE_TNT_v9";
  const LEGACY_BASELINE_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE_RECEIPT_v9";

  const COMPATIBILITY_CONTRACT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_TNT_v5";
  const COMPATIBILITY_RECEIPT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT_v5";

  const ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT_TNT_v8_2";
  const ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT_RECEIPT_v8_2";

  const CURRENT_PARENT_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";
  const CURRENT_PARENT_RECEIPT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT_v10_3";

  const MACRO_WEST_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_2";

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const VERSION = "2026-06-01.hearth-canvas-east-same-runtime-exposure-beacon-api-publication-v11-1";

  const FILE = "/assets/hearth/hearth.canvas.east.js";
  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const MACRO_WEST_FILE = "/assets/lab/runtime-table.west.js";
  const CANVAS_WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const CANVAS_SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";

  const ACTIVE_CYCLE_NUMBER = 2;
  const ACTIVE_CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const ACTIVE_CARDINAL = "EAST";

  const ACTIVE_FIBONACCI_GATE = "F13E_F13F";
  const F13E_GATE = "F13E_API_SOURCE_VISIBLE";
  const F13F_GATE = "F13F_ATLAS_EVIDENCE_READY";
  const FUTURE_FIBONACCI_GATE = "F21";

  const CANVAS_CHILD_SEQUENCE = Object.freeze([
    "CANVAS_EAST_ATLAS_SOURCE",
    "CANVAS_WEST_INSPECTION_VIEW",
    "CANVAS_SOUTH_TEXTURE_RENDER",
    "CANVAS_PARENT_F13_EVIDENCE"
  ]);

  const CHRONOLOGY = Object.freeze([
    "INDEX_CARRIER_HOST_READY",
    "ROUTE_F8_SELF_DUTY_READY",
    "MACRO_WEST_RELEASE_TO_CANVAS",
    "CANVAS_PARENT_RELEASE_ACCEPTED",
    "CANVAS_PARENT_EAST_DISPATCH_PUBLISHED",
    "CANVAS_EAST_API_VISIBLE",
    "CANVAS_EAST_ATLAS_EVIDENCE_READY",
    "CANVAS_WEST_INSPECTION_READY",
    "CANVAS_SOUTH_VISIBLE_PROOF_READY",
    "NORTH_F21_LATCH_ELIGIBILITY"
  ]);

  const REQUIRED_METHODS = Object.freeze([
    "boot",
    "init",
    "start",
    "mount",
    "buildAtlas",
    "buildAtlasSync",
    "buildAtlasAsync",
    "sample",
    "read",
    "getAtlas",
    "getAtlasCanvas",
    "getAtlasPacket",
    "getLastAtlasImageData",
    "getReceipt",
    "getReceiptLight",
    "getReceiptText",
    "publishApiSurface",
    "publishAliasStation",
    "publishDatasetFirstProof",
    "publishReceipts",
    "notifyRouteConductor",
    "readParentAuthorityProfile",
    "readParentEastDispatchPacket",
    "readWestReleaseState",
    "resolveAtlasBuildPermission",
    "composeHeldAtlasPacket",
    "composeAtlasEvidencePacket",
    "receiveParentDispatchPacket",
    "receiveEastDispatchPacket",
    "receiveDispatchPacket",
    "receiveParentPacket",
    "receiveReleasePacket",
    "receiveCanvasParentPacket"
  ]);

  const PUBLIC_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_EAST",
    "HEARTH_CANVAS_EAST_SOURCE",
    "HEARTH_CANVAS_EAST_AUTHORITY",
    "HEARTH_CANVAS_EAST_EVIDENCE",
    "HEARTH_CANVAS_EAST_ENGINE",
    "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION",
    "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR",
    "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE",
    "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE",
    "HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD"
  ]);

  const PUBLIC_NESTED_ALIAS_PATHS = Object.freeze([
    "canvasEast",
    "canvasEastSource",
    "canvasEastAuthority",
    "canvasEastEvidence",
    "canvasEastEngine",
    "canvasEastSameRuntimeExposureBeaconApiPublication",
    "canvasEastParentV103DispatchApiRecognitionServedDetectionRepair",
    "canvasEastParentV103DispatchApiRecognitionAtlasSource",
    "canvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
    "canvasEastF13AtlasSourceChild",
    "canvasEastMaterialAtlasSourceMachine"
  ]);

  const PERMISSION = Object.freeze({
    BUILD_ALLOWED_PARENT_DISPATCH: "BUILD_ALLOWED_PARENT_DISPATCH",
    HELD_PARENT_OBSERVATION_PENDING: "HELD_PARENT_OBSERVATION_PENDING",
    HELD_PARENT_RELEASE_PENDING: "HELD_PARENT_RELEASE_PENDING",
    HELD_EAST_DISPATCH_PENDING: "HELD_EAST_DISPATCH_PENDING",
    HELD_EAST_DISPATCH_MALFORMED: "HELD_EAST_DISPATCH_MALFORMED",
    HELD_PARENT_STALE_OR_CORRUPT: "HELD_PARENT_STALE_OR_CORRUPT",
    BLOCKED_FALSE_PROMOTION: "BLOCKED_FALSE_PROMOTION"
  });

  const PALETTE = Object.freeze({
    void: [0, 0, 0],
    deepWater: [4, 12, 27],
    water: [11, 42, 75],
    shelf: [28, 75, 87],
    coast: [93, 92, 70],
    land: [86, 112, 69],
    highland: [119, 113, 83],
    ridge: [146, 134, 100],
    canyon: [62, 45, 34],
    peak: [178, 172, 148],
    wetStone: [45, 58, 55],
    scar: [31, 39, 39],
    ice: [196, 214, 218]
  });

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  let atlasCanvas = null;
  let lastAtlasImageData = null;
  let materialSampler = null;
  let publishDepth = 0;
  let notificationQueued = false;
  let booted = false;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    legacyBaselineContract: LEGACY_BASELINE_CONTRACT,
    legacyBaselineReceipt: LEGACY_BASELINE_RECEIPT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    currentParentContract: CURRENT_PARENT_CONTRACT,
    currentParentReceipt: CURRENT_PARENT_RECEIPT,
    routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
    routeConductorReceipt: ROUTE_CONDUCTOR_RECEIPT,
    macroWestContract: MACRO_WEST_CONTRACT,
    expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
    expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,

    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    routeFile: ROUTE_FILE,
    macroWestFile: MACRO_WEST_FILE,
    canvasWestFile: CANVAS_WEST_FILE,
    canvasSouthFile: CANVAS_SOUTH_FILE,
    role: "canvas-east-same-runtime-exposure-beacon-api-publication",

    sameRuntimeExposureBeaconActive: true,
    strictInitializationSafetyActive: true,
    undefinedStateReferenceCorrectionActive: true,
    servedDetectionRepairActive: true,
    parentV10_3DispatchRecognitionActive: true,
    routeConductorV8_2AlignmentActive: true,
    macroWestV4_2ReleaseChainRecognized: true,
    earlyApiSurfaceActive: true,
    aliasStationActive: true,
    datasetFirstProofActive: true,
    receiptFirstProofActive: true,
    routeConductorNotificationActive: true,
    synchronousHeldPacketActive: true,
    atlasSourceActive: true,
    parentReturnNodeActive: true,

    canvasChildSequence: CANVAS_CHILD_SEQUENCE.slice(),
    activeCycleNumber: ACTIVE_CYCLE_NUMBER,
    activeCycleRoute: ACTIVE_CYCLE_ROUTE,
    activeCardinal: ACTIVE_CARDINAL,
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    activeF13EGate: F13E_GATE,
    activeF13FGate: F13F_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    activeStageId: "F13E_F13F_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION",
    activeGearId: "F13E_F13F_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION",
    activeNewsGate: "CANVAS_EAST_SOURCE",

    apiSurfacePublished: false,
    aliasesPublished: false,
    datasetFirstProofPublished: false,
    receiptsPublished: false,
    routeConductorNotificationAttempted: false,
    routeConductorNotificationAccepted: false,
    routeConductorNotificationError: "",

    requiredApiSurfaceComplete: true,
    requiredMethods: REQUIRED_METHODS.slice(),

    buildAtlasAvailable: true,
    buildAtlasSyncAvailable: true,
    buildAtlasAsyncAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getAtlasAvailable: true,
    getAtlasCanvasAvailable: true,
    getAtlasPacketAvailable: true,
    getReceiptAvailable: true,
    getReceiptLightAvailable: true,
    getReceiptTextAvailable: true,
    publishApiSurfaceAvailable: true,
    publishAliasStationAvailable: true,
    publishDatasetFirstProofAvailable: true,
    publishReceiptsAvailable: true,
    notifyRouteConductorAvailable: true,
    receiveParentDispatchPacketAvailable: true,

    canvasEastPresent: true,
    canvasEastCurrent: true,
    canvasEastReady: true,
    canvasEastApiReady: true,
    canvasEastEvidenceReady: false,

    parentObserved: false,
    parentApiPresent: false,
    parentCallable: false,
    parentReceiptObserved: false,
    parentContract: "",
    parentReceiptId: "",
    currentParentIsV10_3: false,
    parentReleaseObserved: false,
    parentReleaseAccepted: false,
    parentReleaseLawful: false,
    canvasParentReleaseGateReady: false,
    parentAcceptedRouteConductorRelease: false,
    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,
    parentCorruptOrStale: false,
    parentAbsent: true,

    eastDispatchAuthorized: false,
    eastDispatchPacketPublished: false,
    eastDispatchPacketObserved: false,
    eastDispatchPacketValid: false,
    eastDispatchPacketAccepted: false,
    eastDispatchPacketSource: "NONE",
    eastDispatchReceivedFrom: "",
    eastDispatchHandoffTo: "",
    eastDispatchCycleNumber: 0,
    eastDispatchCycleRoute: "",
    eastDispatchParentContract: "",
    eastDispatchTargetFile: "",
    eastDispatchAtlasBuildRequested: false,

    routeConductorObserved: false,
    routeConductorContractObserved: "",
    routeConductorReceiptObserved: "",
    routeConductorCentralStationActive: false,

    westReleaseObserved: false,
    westAuditObserved: false,
    westAuditPassed: false,
    westAuditBlocked: false,
    westCanvasReleaseApproved: false,
    canvasReleaseAuthorized: false,

    permissionClass: PERMISSION.HELD_EAST_DISPATCH_PENDING,
    canvasEastMayBuildAtlas: false,
    f13BuildLawful: false,
    f13BuildBlockedReason: "WAITING_CANVAS_PARENT_EAST_DISPATCH",
    f13PermissionSource: "NONE",

    heldAtlasPacketReturned: false,
    heldPacketWasSynchronous: false,
    buildAtlasReturnedPromise: false,
    heldDoesNotMeanApiMissing: true,

    newsAlignmentProtocolActive: true,
    newsChronologicalOrderLocked: true,
    newsFinalizedByCanvasEast: false,
    fibonacciSynchronizationChronologyFirst: true,
    fibonacciSynchronizationScore: 50,
    fibonacciSynchronizationExpected: 100,
    fibonacciSynchronizationSatisfied: 50,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: true,
    fibonacciSynchronizationHardFail: false,
    fibonacciSynchronizationHoldReason: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",

    chronologicalGateCount: CHRONOLOGY.length,
    chronologicalGatesSatisfied: 6,
    chronologicalFirstFailedGate: "CANVAS_EAST_ATLAS_EVIDENCE_READY",
    chronologicalFirstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",

    indexGateReady: true,
    routeF8GateReady: true,
    macroWestGateReady: false,
    canvasParentGateReady: false,
    canvasParentReleaseGateReady: false,
    canvasParentEastDispatchGateReady: false,
    canvasEastGateReady: true,
    canvasEastEvidenceGateReady: false,
    canvasWestGateReady: false,
    canvasSouthGateReady: false,
    canvasGateReady: false,
    northGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,

    materialReceiptBridgeActive: false,
    materialNestedReceiptAvailable: false,
    materialContract: "",
    materialReceipt: "",
    materialVersion: "",
    materialRole: "",
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    canonicalMaterialAuthorityPresent: false,
    canonicalMaterialConsumed: false,
    canvasEastDoesNotOwnMaterialTruth: true,
    canvasStillDoesNotOwnPlanetTruth: true,

    atlasBuildRequested: false,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasBuildError: "",
    atlasBuildStartedAt: "",
    atlasBuildCompletedAt: "",
    atlasCanvasPresent: false,
    atlasWidth: DEFAULT_ATLAS_WIDTH,
    atlasHeight: DEFAULT_ATLAS_HEIGHT,
    atlasPixelCount: 0,
    atlasTotalSampleCount: 0,
    atlasLandSampleCount: 0,
    atlasWaterSampleCount: 0,
    atlasCoastSampleCount: 0,
    atlasReliefSampleCount: 0,
    atlasClassCount: 0,
    atlasClasses: [],

    fallbackSampleAvailable: true,
    fallbackSampleUsedAtRuntime: false,
    emergencyFallbackUsed: false,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlinesReadFromHydrologyAndMaterials: true,

    f13SourceStageStarted: false,
    f13SourceStageComplete: false,
    f13AtlasPacketReady: false,

    firstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    nextConsumerFile: PARENT_FILE,

    lastParentAuthorityProfile: null,
    lastDispatchPacket: null,
    lastWestReleaseState: null,
    lastPermissionPacket: null,
    lastHeldAtlasPacket: null,
    lastAtlasPacket: null,

    localEvents: [],
    errors: [],
    publishedAt: "",
    updatedAt: "",

    visibleProof: false,
    visibleContentProof: false,
    visiblePlanetAvailable: false,
    canvasReady: false,
    readyTextAllowed: false,
    f21EligibleForNorth: false,
    f21ClaimedByCanvasEast: false,
    readyTextClaimedByCanvasEast: false,
    completionLatched: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
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

  function trimArray(array, max = 180) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function objectValue(source, path, fallback = undefined) {
    if (!source || typeof source !== "object") return fallback;
    const parts = String(path || "").split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || typeof cursor !== "object" || cursor[part] === undefined || cursor[part] === null) {
        return fallback;
      }
      cursor = cursor[part];
    }

    return cursor;
  }

  function pathRead(path) {
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
      const found = pathRead(name);
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

  function findNestedObject(source, paths) {
    if (!isObject(source)) return {};
    for (const path of paths || []) {
      const value = objectValue(source, path);
      if (isObject(value) && Object.keys(value).length) return value;
    }
    return {};
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceipt",
      "getReceiptLight",
      "getCarrierReceipt",
      "readStructuralCarrier",
      "getStructuralCarrier",
      "getCanvasCarrier",
      "getStatus"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;
      try {
        const receipt = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EAST_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 220);
    state.updatedAt = item.at;

    try {
      publishDatasetFirstProof({ quiet: true });
    } catch (_error) {}

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_EAST_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 160);
    state.updatedAt = item.at;

    try {
      publishDatasetFirstProof({ quiet: true });
    } catch (_error) {}

    return item;
  }

  function blockFinalClaims() {
    state.visibleProof = false;
    state.visibleContentProof = false;
    state.visiblePlanetAvailable = false;
    state.canvasReady = false;
    state.readyTextAllowed = false;
    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;
    state.visualPassClaimed = false;
  }

  function detectFalsePromotion(input = {}) {
    let text = "";
    try {
      text = JSON.stringify(input || {});
    } catch (_error) {
      text = String(input || "");
    }

    return Boolean(
      safeBool(input.visualPassClaimed, false) ||
      safeBool(input.readyTextAllowed, false) ||
      safeBool(input.f21EligibleForNorth, false) ||
      safeBool(input.f21SubmittedToNorth, false) ||
      safeBool(input.f21ClaimedByCanvasEast, false) ||
      safeBool(input.completionLatched, false) ||
      safeBool(input.finalCompletionLatched, false) ||
      safeBool(input.degradedCompletionLatched, false) ||
      text.includes('"visualPassClaimed":true') ||
      text.includes('"readyTextAllowed":true') ||
      text.includes('"f21EligibleForNorth":true') ||
      text.includes('"completionLatched":true')
    );
  }

  function ensureNamespaces() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    return true;
  }

  function publishAliasStation() {
    ensureNamespaces();

    root.HEARTH.canvasEast = api;
    root.HEARTH.canvasEastSource = api;
    root.HEARTH.canvasEastAuthority = api;
    root.HEARTH.canvasEastEvidence = api;
    root.HEARTH.canvasEastEngine = api;
    root.HEARTH.canvasEastSameRuntimeExposureBeaconApiPublication = api;
    root.HEARTH.canvasEastParentV103DispatchApiRecognitionServedDetectionRepair = api;
    root.HEARTH.canvasEastParentV103DispatchApiRecognitionAtlasSource = api;
    root.HEARTH.canvasEastSpineNodalParentAcceptanceSyncHeldAtlasSource = api;
    root.HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource = api;
    root.HEARTH.canvasEastParentFirstApiRecognitionBootstrap = api;
    root.HEARTH.canvasEastCurrentParentRecognizedF13AtlasSource = api;
    root.HEARTH.canvasEastGovernedF13AtlasSource = api;
    root.HEARTH.canvasEastF13AtlasSourceChild = api;
    root.HEARTH.canvasEastMaterialAtlasSourceMachine = api;

    root.HEARTH_CANVAS_EAST = api;
    root.HEARTH_CANVAS_EAST_SOURCE = api;
    root.HEARTH_CANVAS_EAST_AUTHORITY = api;
    root.HEARTH_CANVAS_EAST_EVIDENCE = api;
    root.HEARTH_CANVAS_EAST_ENGINE = api;
    root.HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION = api;
    root.HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR = api;
    root.HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP = api;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD = api;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE = api;

    root.DEXTER_LAB.hearthCanvasEast = api;
    root.DEXTER_LAB.hearthCanvasEastSource = api;
    root.DEXTER_LAB.hearthCanvasEastAuthority = api;
    root.DEXTER_LAB.hearthCanvasEastEvidence = api;
    root.DEXTER_LAB.hearthCanvasEastEngine = api;
    root.DEXTER_LAB.hearthCanvasEastSameRuntimeExposureBeaconApiPublication = api;
    root.DEXTER_LAB.hearthCanvasEastParentV103DispatchApiRecognitionServedDetectionRepair = api;
    root.DEXTER_LAB.hearthCanvasEastParentV103DispatchApiRecognitionAtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastSpineNodalParentAcceptanceSyncHeldAtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrap = api;
    root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine = api;

    root.__HEARTH_CANVAS_EAST_LOADED__ = true;
    root.__HEARTH_CANVAS_EAST_PRESENT__ = true;
    root.__HEARTH_CANVAS_EAST_FILE__ = FILE;
    root.__HEARTH_CANVAS_EAST_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_EAST_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_EAST_API_READY__ = true;
    root.__HEARTH_CANVAS_EAST_READY__ = true;
    root.__HEARTH_CANVAS_EAST_CURRENT__ = true;
    root.__HEARTH_CANVAS_EAST_REQUIRED_API_SURFACE_COMPLETE__ = true;
    root.__HEARTH_CANVAS_EAST_BUILD_ATLAS_AVAILABLE__ = true;
    root.__HEARTH_CANVAS_EAST_SAMPLE_AVAILABLE__ = true;
    root.__HEARTH_CANVAS_EAST_READ_AVAILABLE__ = true;
    root.__HEARTH_CANVAS_EAST_GET_RECEIPT_AVAILABLE__ = true;
    root.__HEARTH_CANVAS_EAST_EVIDENCE_READY__ = false;
    root.__HEARTH_CANVAS_EAST_VISUAL_PASS_CLAIMED__ = false;

    state.aliasesPublished = true;
    state.apiSurfacePublished = true;
    state.canvasEastApiReady = true;
    state.canvasEastReady = true;
    state.canvasEastCurrent = true;
    state.canvasEastPresent = true;
    state.requiredApiSurfaceComplete = true;
    state.canvasEastGateReady = true;
    state.updatedAt = nowIso();

    blockFinalClaims();
    return true;
  }

  function publishDatasetFirstProof(options = {}) {
    state.datasetFirstProofPublished = true;
    state.canvasEastApiReady = true;
    state.canvasEastReady = true;
    state.canvasEastCurrent = true;
    state.canvasEastPresent = true;
    state.requiredApiSurfaceComplete = true;
    state.canvasEastGateReady = true;

    setDataset("hearthCanvasEastLoaded", "true");
    setDataset("hearthCanvasEastPresent", "true");
    setDataset("hearthCanvasEastContract", CONTRACT);
    setDataset("hearthCanvasEastReceipt", RECEIPT);
    setDataset("hearthCanvasEastPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasEastBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasEastLegacyBaselineContract", LEGACY_BASELINE_CONTRACT);
    setDataset("hearthCanvasEastVersion", VERSION);
    setDataset("hearthCanvasEastFile", FILE);

    setDataset("hearthCanvasEastSameRuntimeExposureBeaconActive", "true");
    setDataset("hearthCanvasEastStrictInitializationSafetyActive", "true");
    setDataset("hearthCanvasEastUndefinedStateReferenceCorrectionActive", "true");
    setDataset("hearthCanvasEastServedDetectionRepairActive", "true");
    setDataset("hearthCanvasEastParentV10_3DispatchRecognitionActive", "true");
    setDataset("hearthCanvasEastRouteConductorV8_2AlignmentActive", "true");
    setDataset("hearthCanvasEastMacroWestV4_2ReleaseChainRecognized", "true");
    setDataset("hearthCanvasEastApiSurfacePublished", String(state.apiSurfacePublished));
    setDataset("hearthCanvasEastAliasesPublished", String(state.aliasesPublished));
    setDataset("hearthCanvasEastDatasetFirstProofPublished", "true");
    setDataset("hearthCanvasEastReceiptsPublished", String(state.receiptsPublished));

    setDataset("hearthCanvasEastRequiredApiSurfaceComplete", "true");
    setDataset("hearthCanvasEastBuildAtlasAvailable", "true");
    setDataset("hearthCanvasEastBuildAtlasSyncAvailable", "true");
    setDataset("hearthCanvasEastBuildAtlasAsyncAvailable", "true");
    setDataset("hearthCanvasEastSampleAvailable", "true");
    setDataset("hearthCanvasEastReadAvailable", "true");
    setDataset("hearthCanvasEastGetAtlasAvailable", "true");
    setDataset("hearthCanvasEastGetAtlasCanvasAvailable", "true");
    setDataset("hearthCanvasEastGetAtlasPacketAvailable", "true");
    setDataset("hearthCanvasEastGetReceiptAvailable", "true");
    setDataset("hearthCanvasEastGetReceiptLightAvailable", "true");
    setDataset("hearthCanvasEastGetReceiptTextAvailable", "true");
    setDataset("hearthCanvasEastReceiveParentDispatchPacketAvailable", "true");
    setDataset("hearthCanvasEastApiReady", "true");
    setDataset("hearthCanvasEastReady", "true");
    setDataset("hearthCanvasEastCurrent", "true");
    setDataset("hearthCanvasEastEvidenceReady", String(state.f13AtlasPacketReady));

    setDataset("hearthCanvasEastChildSequence", CANVAS_CHILD_SEQUENCE.join("__"));
    setDataset("hearthCanvasEastActiveCycleNumber", String(ACTIVE_CYCLE_NUMBER));
    setDataset("hearthCanvasEastActiveCycleRoute", ACTIVE_CYCLE_ROUTE);
    setDataset("hearthCanvasEastActiveCardinal", ACTIVE_CARDINAL);

    setDataset("hearthCanvasEastParentObserved", String(state.parentObserved));
    setDataset("hearthCanvasEastParentApiPresent", String(state.parentApiPresent));
    setDataset("hearthCanvasEastParentCallable", String(state.parentCallable));
    setDataset("hearthCanvasEastParentContract", state.parentContract);
    setDataset("hearthCanvasEastCurrentParentIsV10_3", String(state.currentParentIsV10_3));
    setDataset("hearthCanvasEastParentReleaseAccepted", String(state.parentReleaseAccepted));
    setDataset("hearthCanvasEastParentReleaseLawful", String(state.parentReleaseLawful));
    setDataset("hearthCanvasEastCanvasParentReleaseGateReady", String(state.canvasParentReleaseGateReady));
    setDataset("hearthCanvasEastParentAcceptedRouteConductorRelease", String(state.parentAcceptedRouteConductorRelease));
    setDataset("hearthCanvasEastParentReleasePacketSentToEast", String(state.parentReleasePacketSentToEast));
    setDataset("hearthCanvasEastParentReleasePacketLawful", String(state.parentReleasePacketLawful));

    setDataset("hearthCanvasEastDispatchAuthorized", String(state.eastDispatchAuthorized));
    setDataset("hearthCanvasEastDispatchPacketPublished", String(state.eastDispatchPacketPublished));
    setDataset("hearthCanvasEastDispatchPacketObserved", String(state.eastDispatchPacketObserved));
    setDataset("hearthCanvasEastDispatchPacketValid", String(state.eastDispatchPacketValid));
    setDataset("hearthCanvasEastDispatchPacketAccepted", String(state.eastDispatchPacketAccepted));
    setDataset("hearthCanvasEastDispatchPacketSource", state.eastDispatchPacketSource);

    setDataset("hearthCanvasEastWestReleaseObserved", String(state.westReleaseObserved));
    setDataset("hearthCanvasEastWestCanvasReleaseApproved", String(state.westCanvasReleaseApproved));
    setDataset("hearthCanvasEastCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));

    setDataset("hearthCanvasEastPermissionClass", state.permissionClass);
    setDataset("hearthCanvasEastMayBuildAtlas", String(state.canvasEastMayBuildAtlas));
    setDataset("hearthCanvasEastF13BuildLawful", String(state.f13BuildLawful));
    setDataset("hearthCanvasEastF13BuildBlockedReason", state.f13BuildBlockedReason);
    setDataset("hearthCanvasEastF13PermissionSource", state.f13PermissionSource);

    setDataset("hearthCanvasEastHeldAtlasPacketReturned", String(state.heldAtlasPacketReturned));
    setDataset("hearthCanvasEastHeldPacketWasSynchronous", String(state.heldPacketWasSynchronous));
    setDataset("hearthCanvasEastBuildAtlasReturnedPromise", String(state.buildAtlasReturnedPromise));
    setDataset("hearthCanvasEastHeldDoesNotMeanApiMissing", "true");

    setDataset("hearthCanvasEastChronologicalGateCount", String(state.chronologicalGateCount));
    setDataset("hearthCanvasEastChronologicalGatesSatisfied", String(state.chronologicalGatesSatisfied));
    setDataset("hearthCanvasEastChronologicalFirstFailedGate", state.chronologicalFirstFailedGate);
    setDataset("hearthCanvasEastChronologicalFirstFailedCoordinate", state.chronologicalFirstFailedCoordinate);

    setDataset("hearthCanvasEastFibonacciSynchronizationScore", String(state.fibonacciSynchronizationScore));
    setDataset("hearthCanvasEastFibonacciSynchronizationExpected", String(state.fibonacciSynchronizationExpected));
    setDataset("hearthCanvasEastFibonacciSynchronizationSatisfied", String(state.fibonacciSynchronizationSatisfied));
    setDataset("hearthCanvasEastFibonacciSynchronizationPassed", String(state.fibonacciSynchronizationPassed));
    setDataset("hearthCanvasEastFibonacciSynchronizationDegraded", String(state.fibonacciSynchronizationDegraded));
    setDataset("hearthCanvasEastFibonacciSynchronizationHardFail", String(state.fibonacciSynchronizationHardFail));
    setDataset("hearthCanvasEastFibonacciSynchronizationHoldReason", state.fibonacciSynchronizationHoldReason);
    setDataset("hearthCanvasEastActiveFibonacciGate", ACTIVE_FIBONACCI_GATE);
    setDataset("hearthCanvasEastActiveF13EGate", F13E_GATE);
    setDataset("hearthCanvasEastActiveF13FGate", F13F_GATE);
    setDataset("hearthCanvasEastFutureFibonacciGate", FUTURE_FIBONACCI_GATE);

    setDataset("hearthCanvasEastGateReady", "true");
    setDataset("hearthCanvasEastEvidenceGateReady", String(state.canvasEastEvidenceGateReady));
    setDataset("hearthCanvasEastCanvasGateReady", "false");
    setDataset("hearthCanvasEastNewsGatePassedBeforeF21", "false");
    setDataset("hearthCanvasEastNewsGateDegradedBeforeF21", "false");

    setDataset("hearthCanvasEastMaterialReceiptBridgeActive", String(state.materialReceiptBridgeActive));
    setDataset("hearthCanvasEastMaterialContract", state.materialContract);
    setDataset("hearthCanvasEastMaterialReceipt", state.materialReceipt);
    setDataset("hearthCanvasEastCanonicalMaterialConsumed", String(state.canonicalMaterialConsumed));

    setDataset("hearthCanvasEastAtlasBuildRequested", String(state.atlasBuildRequested));
    setDataset("hearthCanvasEastAtlasBuildStarted", String(state.atlasBuildStarted));
    setDataset("hearthCanvasEastAtlasBuildProgress", String(state.atlasBuildProgress));
    setDataset("hearthCanvasEastAtlasBuildComplete", String(state.atlasBuildComplete));
    setDataset("hearthCanvasEastAtlasCanvasPresent", String(state.atlasCanvasPresent));
    setDataset("hearthCanvasEastAtlasWidth", String(state.atlasWidth));
    setDataset("hearthCanvasEastAtlasHeight", String(state.atlasHeight));
    setDataset("hearthCanvasEastAtlasClassCount", String(state.atlasClassCount));
    setDataset("hearthCanvasEastF13SourceStageStarted", String(state.f13SourceStageStarted));
    setDataset("hearthCanvasEastF13SourceStageComplete", String(state.f13SourceStageComplete));
    setDataset("hearthCanvasEastF13AtlasPacketReady", String(state.f13AtlasPacketReady));

    setDataset("hearthCanvasEastFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasEastRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasEastRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasEastNextConsumerFile", PARENT_FILE);

    setDataset("hearthCanvasEastRouteConductorNotificationAttempted", String(state.routeConductorNotificationAttempted));
    setDataset("hearthCanvasEastRouteConductorNotificationAccepted", String(state.routeConductorNotificationAccepted));
    setDataset("hearthCanvasEastRouteConductorNotificationError", state.routeConductorNotificationError);

    setDataset("hearthCanvasEastVisibleProof", "false");
    setDataset("hearthCanvasEastVisibleContentProof", "false");
    setDataset("hearthCanvasEastVisiblePlanetAvailable", "false");
    setDataset("hearthCanvasEastCanvasReady", "false");
    setDataset("hearthCanvasEastReadyTextAllowed", "false");
    setDataset("hearthCanvasEastF21EligibleForNorth", "false");
    setDataset("hearthCanvasEastF21Claimed", "false");
    setDataset("hearthCanvasEastReadyTextClaimed", "false");
    setDataset("hearthCanvasEastCompletionLatched", "false");

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    if (!options.quiet) state.updatedAt = nowIso();

    return true;
  }

  function publishReceipts() {
    const light = getReceiptLight(false);

    ensureNamespaces();

    root.HEARTH_CANVAS_EAST_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_RECEIPT_v11_1 = light;
    root.HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD_RECEIPT = light;

    root.HEARTH.canvasEastReceipt = light;
    root.HEARTH.canvasEastSameRuntimeExposureBeaconApiPublicationReceipt = light;
    root.HEARTH.canvasEastParentV103DispatchApiRecognitionServedDetectionRepairReceipt = light;
    root.HEARTH.canvasEastParentV103DispatchApiRecognitionAtlasSourceReceipt = light;
    root.HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = light;

    root.DEXTER_LAB.hearthCanvasEastReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastSameRuntimeExposureBeaconApiPublicationReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastParentV103DispatchApiRecognitionServedDetectionRepairReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastParentV103DispatchApiRecognitionAtlasSourceReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = light;

    state.receiptsPublished = true;
    return true;
  }

  function notifyRouteConductor(reason = "canvas-east-api-published") {
    if (notificationQueued) return false;

    notificationQueued = true;

    const run = () => {
      notificationQueued = false;
      state.routeConductorNotificationAttempted = true;
      state.routeConductorNotificationError = "";

      try {
        const conductor = firstGlobal([
          "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT",
          "HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment",
          "DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment",
          "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION",
          "HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordination",
          "DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardNewsFibonacciParentCoordination",
          "HEARTH_ROUTE_CONDUCTOR",
          "HEARTH.routeConductor",
          "DEXTER_LAB.hearthRouteConductor"
        ]);

        const packet = {
          contract: CONTRACT,
          receipt: RECEIPT,
          file: FILE,
          packetType: "CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON",
          reason,
          canvasEastApiReady: true,
          requiredApiSurfaceComplete: true,
          aliasesPublished: true,
          datasetFirstProofPublished: true,
          receiptsPublished: true,
          buildAtlasAvailable: true,
          sampleAvailable: true,
          readAvailable: true,
          getReceiptAvailable: true,
          canvasEastEvidenceReady: state.f13AtlasPacketReady,
          heldDoesNotMeanApiMissing: true,
          firstFailedCoordinate: state.f13AtlasPacketReady ? "NONE_F13F_ATLAS_PACKET_READY" : "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
          recommendedNextFile: state.f13AtlasPacketReady ? CANVAS_WEST_FILE : FILE,
          visualPassClaimed: false,
          createdAt: nowIso()
        };

        let accepted = false;

        if (conductor && isObject(conductor)) {
          const methods = ["reconcileCanvas", "refresh", "run", "start", "boot", "init"];
          for (const method of methods) {
            if (!isFunction(conductor[method])) continue;
            try {
              conductor[method]({
                receivedFrom: "CANVAS_EAST",
                activeCycleRoute: ACTIVE_CYCLE_ROUTE,
                canvasEastApiPublished: true,
                canvasEastApiReady: true,
                canvasEastExposureBeacon: packet
              });
              accepted = true;
              break;
            } catch (_error) {}
          }
        }

        if (doc && isFunction(doc.dispatchEvent)) {
          try {
            const event = typeof CustomEvent !== "undefined"
              ? new CustomEvent("hearth:canvas-east-api-published", { detail: packet })
              : null;
            if (event) doc.dispatchEvent(event);
          } catch (_error) {}
        }

        state.routeConductorObserved = Boolean(conductor);
        state.routeConductorNotificationAccepted = accepted;
        recordLocal("ROUTE_CONDUCTOR_NONBLOCKING_NOTIFICATION_SENT", {
          reason,
          routeConductorObserved: Boolean(conductor),
          routeConductorNotificationAccepted: accepted,
          canvasEastApiReady: true,
          canvasEastEvidenceReady: state.f13AtlasPacketReady
        });

        publishDatasetFirstProof({ quiet: true });
        publishReceipts();
      } catch (error) {
        state.routeConductorNotificationAccepted = false;
        state.routeConductorNotificationError = error && error.message ? error.message : String(error);
        recordError("ROUTE_CONDUCTOR_NOTIFICATION_FAILED_NONBLOCKING", error, {
          apiAlreadyPublished: true
        });
      }
    };

    try {
      if (isFunction(root.queueMicrotask)) root.queueMicrotask(run);
      else root.setTimeout(run, 0);
    } catch (_error) {
      try {
        root.setTimeout(run, 0);
      } catch (error) {
        recordError("ROUTE_CONDUCTOR_NOTIFICATION_QUEUE_FAILED_NONBLOCKING", error, {
          apiAlreadyPublished: true
        });
      }
    }

    return true;
  }

  function publishApiSurface(reason = "publish-api-surface") {
    if (publishDepth > 4) return getReceiptLight(false);

    publishDepth += 1;

    try {
      publishAliasStation();
      recomputeChronology();
      publishDatasetFirstProof({ quiet: true });
      publishReceipts();

      state.apiSurfacePublished = true;
      state.aliasesPublished = true;
      state.datasetFirstProofPublished = true;
      state.receiptsPublished = true;
      state.publishedAt = state.publishedAt || nowIso();
      state.updatedAt = nowIso();

      if (!state.localEvents.some((item) => item.event === "CANVAS_EAST_V11_1_API_SURFACE_PUBLISHED")) {
        state.localEvents.push({
          at: nowIso(),
          event: "CANVAS_EAST_V11_1_API_SURFACE_PUBLISHED",
          detail: {
            reason,
            contract: CONTRACT,
            receipt: RECEIPT,
            baselineContract: BASELINE_CONTRACT,
            methods: REQUIRED_METHODS.slice(),
            aliases: PUBLIC_ALIAS_PATHS.slice(),
            nestedAliases: PUBLIC_NESTED_ALIAS_PATHS.slice(),
            apiReadyBeforeParentScan: true,
            apiReadyBeforeRouteConductorScan: true,
            apiReadyBeforeAtlasEvidence: true,
            apiReadyDoesNotRequireEvidence: true,
            visualPassClaimed: false
          }
        });
        trimArray(state.localEvents, 220);
      }

      notifyRouteConductor(reason);
      return getReceiptLight(false);
    } finally {
      publishDepth -= 1;
    }
  }

  function readParentApi() {
    return firstGlobal([
      "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD",
      "HEARTH.canvasParentReleaseAcceptanceEastDispatchSwitchboard",
      "DEXTER_LAB.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard",
      "HEARTH_CANVAS_PARENT",
      "HEARTH.canvasParent",
      "DEXTER_LAB.hearthCanvasParent",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_EVIDENCE",
      "HEARTH_CANVAS",
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasEvidence",
      "HEARTH.canvasNorth",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasEvidence"
    ]);
  }

  function hasParentCallable(parentApi) {
    if (!parentApi || !isObject(parentApi)) return false;

    return Boolean(
      isFunction(parentApi.boot) ||
      isFunction(parentApi.init) ||
      isFunction(parentApi.start) ||
      isFunction(parentApi.mount) ||
      isFunction(parentApi.consumeRouteConductorReleasePacket) ||
      isFunction(parentApi.receiveCanvasReleasePacket) ||
      isFunction(parentApi.receiveEastPacket) ||
      isFunction(parentApi.getReceipt) ||
      isFunction(parentApi.getReceiptLight) ||
      isFunction(parentApi.getStructuralCarrier)
    );
  }

  function readParentAuthorityProfile(input = {}) {
    const source = isObject(input) ? input : {};

    const directParent = findNestedObject(source, [
      "parent",
      "canvasParent",
      "parentReceipt",
      "canvasParentReceipt",
      "releasePacket.parent",
      "releasePacket.canvasParent",
      "eastDispatchPacket.parent",
      "parentAuthorityProfile"
    ]);

    const parentApi = readParentApi();
    const parentReceipt = Object.keys(directParent).length ? directParent : (readReceipt(parentApi) || {});

    const contract = safeString(firstDefined(
      source.parentContract,
      source.currentCanvasParentContract,
      source.parentContractFromDispatch,
      objectValue(source, "eastDispatchPacket.parentContract"),
      objectValue(source, "dispatchPacket.parentContract"),
      parentReceipt.contract,
      parentReceipt.parentContract,
      parentReceipt.currentCanvasParentContract,
      parentReceipt.sourceParentContract,
      parentApi && parentApi.contract,
      datasetValue("hearthCanvasContract", ""),
      datasetValue("hearthCanvasParentContract", ""),
      datasetValue("hearthSouthCurrentCanvasParentContract", "")
    ), "");

    const receipt = safeString(firstDefined(
      source.parentReceipt,
      source.currentCanvasParentReceipt,
      objectValue(source, "eastDispatchPacket.parentReceipt"),
      objectValue(source, "dispatchPacket.parentReceipt"),
      parentReceipt.receipt,
      parentReceipt.parentReceipt,
      parentReceipt.currentCanvasParentReceipt,
      parentReceipt.sourceParentReceipt,
      parentApi && parentApi.receipt,
      datasetValue("hearthCanvasReceipt", ""),
      datasetValue("hearthCanvasParentReceipt", "")
    ), "");

    const currentParentIsV10_3 = contract === CURRENT_PARENT_CONTRACT || receipt === CURRENT_PARENT_RECEIPT;

    const parentObserved = Boolean(
      parentApi ||
      parentReceipt.contract ||
      parentReceipt.receipt ||
      contract ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasParentV10_3Active") === "true" ||
      datasetValue("hearthSouthCurrentCanvasParentObserved") === "true"
    );

    const parentReleaseAccepted = Boolean(
      safeBool(source.canvasParentReleaseAccepted, false) ||
      safeBool(source.parentReleaseAccepted, false) ||
      safeBool(parentReceipt.canvasParentReleaseAccepted, false) ||
      safeBool(parentReceipt.canvasParentReleaseObserved, false) ||
      safeBool(parentReceipt.releasePacketAccepted, false) ||
      safeBool(parentReceipt.parentAcceptedRouteConductorRelease, false) ||
      datasetValue("hearthCanvasParentReleaseAccepted") === "true" ||
      datasetValue("hearthSouthCanvasParentReleaseAccepted") === "true"
    );

    const parentReleaseLawful = Boolean(
      safeBool(source.parentReleaseLawful, false) ||
      safeBool(source.canvasParentReleaseLawful, false) ||
      safeBool(parentReceipt.parentReleaseLawful, false) ||
      safeBool(parentReceipt.canvasParentReleaseLawful, false) ||
      safeBool(parentReceipt.parentReleasePacketLawful, false) ||
      datasetValue("hearthCanvasParentReleaseLawful") === "true" ||
      datasetValue("hearthSouthParentReleaseLawful") === "true"
    );

    const canvasParentReleaseGateReady = Boolean(
      safeBool(source.canvasParentReleaseGateReady, false) ||
      safeBool(parentReceipt.canvasParentReleaseGateReady, false) ||
      safeBool(parentReceipt.hearthCanvasParentReleaseGateReady, false) ||
      datasetValue("hearthCanvasParentReleaseGateReady") === "true" ||
      datasetValue("hearthSouthCanvasParentReleaseGateReady") === "true"
    );

    const parentAcceptedRouteConductorRelease = Boolean(
      safeBool(source.parentAcceptedRouteConductorRelease, false) ||
      safeBool(parentReceipt.parentAcceptedRouteConductorRelease, false) ||
      safeBool(parentReceipt.hearthCanvasParentAcceptedRouteConductorRelease, false) ||
      datasetValue("hearthCanvasParentAcceptedRouteConductorRelease") === "true"
    );

    const parentReleasePacketSentToEast = Boolean(
      safeBool(source.parentReleasePacketSentToEast, false) ||
      safeBool(parentReceipt.parentReleasePacketSentToEast, false) ||
      safeBool(parentReceipt.hearthCanvasParentReleasePacketSentToEast, false) ||
      datasetValue("hearthCanvasParentReleasePacketSentToEast") === "true" ||
      datasetValue("hearthSouthParentReleasePacketSentToEast") === "true"
    );

    const parentReleasePacketLawful = Boolean(
      safeBool(source.parentReleasePacketLawful, false) ||
      safeBool(parentReceipt.parentReleasePacketLawful, false) ||
      safeBool(parentReceipt.hearthCanvasParentReleasePacketLawful, false) ||
      datasetValue("hearthCanvasParentReleasePacketLawful") === "true" ||
      datasetValue("hearthSouthParentReleasePacketLawful") === "true"
    );

    const eastDispatchAuthorized = Boolean(
      safeBool(source.eastDispatchAuthorized, false) ||
      safeBool(source.canvasEastDispatchAuthorized, false) ||
      safeBool(parentReceipt.eastDispatchAuthorized, false) ||
      safeBool(parentReceipt.canvasEastDispatchAuthorized, false) ||
      safeBool(parentReceipt.hearthCanvasEastDispatchAuthorized, false) ||
      datasetValue("hearthCanvasEastDispatchAuthorized") === "true"
    );

    const eastDispatchPacketPublished = Boolean(
      safeBool(source.eastDispatchPacketPublished, false) ||
      safeBool(parentReceipt.eastDispatchPacketPublished, false) ||
      safeBool(parentReceipt.hearthCanvasEastDispatchPacketPublished, false) ||
      datasetValue("hearthCanvasEastDispatchPacketPublished") === "true"
    );

    const parentCorruptOrStale = Boolean(
      safeBool(parentReceipt.currentParentStaleDetected, false) ||
      safeBool(parentReceipt.staleParentDetected, false) ||
      safeBool(parentReceipt.currentParentIdentityMismatch, false) ||
      (parentObserved && contract && !currentParentIsV10_3 && contract.includes("HEARTH_CANVAS_PARENT"))
    );

    const profile = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_EAST_PARENT_AUTHORITY_PROFILE",
      parentObserved,
      parentApiPresent: Boolean(parentApi),
      parentCallable: hasParentCallable(parentApi),
      parentReceiptObserved: Boolean(parentReceipt.contract || parentReceipt.receipt || contract || receipt),
      parentContract: contract,
      parentReceiptId: receipt,
      currentParentIsV10_3,
      parentReleaseObserved: parentReleaseAccepted || parentReleaseLawful || canvasParentReleaseGateReady,
      parentReleaseAccepted,
      parentReleaseLawful,
      canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease,
      parentReleasePacketSentToEast,
      parentReleasePacketLawful,
      eastDispatchAuthorized,
      eastDispatchPacketPublished,
      parentCorruptOrStale,
      parentAbsent: !parentObserved,
      parentReceipt: clonePlain(parentReceipt),
      createdAt: nowIso()
    };

    state.lastParentAuthorityProfile = clonePlain(profile);
    state.parentObserved = profile.parentObserved;
    state.parentApiPresent = profile.parentApiPresent;
    state.parentCallable = profile.parentCallable;
    state.parentReceiptObserved = profile.parentReceiptObserved;
    state.parentContract = profile.parentContract;
    state.parentReceiptId = profile.parentReceiptId;
    state.currentParentIsV10_3 = profile.currentParentIsV10_3;
    state.parentReleaseObserved = profile.parentReleaseObserved;
    state.parentReleaseAccepted = profile.parentReleaseAccepted;
    state.parentReleaseLawful = profile.parentReleaseLawful;
    state.canvasParentReleaseGateReady = Boolean(profile.parentReleaseAccepted && profile.parentReleaseLawful && profile.canvasParentReleaseGateReady);
    state.parentAcceptedRouteConductorRelease = profile.parentAcceptedRouteConductorRelease;
    state.parentReleasePacketSentToEast = profile.parentReleasePacketSentToEast;
    state.parentReleasePacketLawful = profile.parentReleasePacketLawful;
    state.eastDispatchAuthorized = profile.eastDispatchAuthorized;
    state.eastDispatchPacketPublished = profile.eastDispatchPacketPublished;
    state.parentCorruptOrStale = profile.parentCorruptOrStale;
    state.parentAbsent = profile.parentAbsent;
    state.canvasParentGateReady = Boolean(profile.parentObserved && profile.currentParentIsV10_3 && !profile.parentCorruptOrStale);
    state.canvasParentEastDispatchGateReady = Boolean(profile.eastDispatchAuthorized || profile.eastDispatchPacketPublished);

    return profile;
  }

  function readRouteConductorProfile(input = {}) {
    const source = isObject(input) ? input : {};

    const routeApi = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT",
      "HEARTH.routeConductorCentralStationSwitchboardWestV42SouthOutputAlignment",
      "DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardWestV42SouthOutputAlignment",
      "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION",
      "HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordination",
      "DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardNewsFibonacciParentCoordination",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH.routeConductor",
      "DEXTER_LAB.hearthRouteConductor"
    ]);

    const routeReceipt = readReceipt(routeApi) || findNestedObject(source, [
      "routeConductor",
      "routeConductorReceipt",
      "routeReceipt"
    ]) || {};

    const contract = safeString(firstDefined(
      source.routeConductorContract,
      routeReceipt.contract,
      datasetValue("hearthRouteConductorContract", ""),
      datasetValue("hearthSouthRouteConductorContract", "")
    ), "");

    const receipt = safeString(firstDefined(
      source.routeConductorReceipt,
      routeReceipt.receipt,
      datasetValue("hearthRouteConductorReceipt", ""),
      datasetValue("hearthSouthRouteConductorReceipt", "")
    ), "");

    const observed = Boolean(
      routeApi ||
      contract ||
      receipt ||
      datasetValue("hearthRouteConductorLoaded") === "true" ||
      datasetValue("hearthSouthRouteConductorLoaded") === "true"
    );

    const centralStationActive = Boolean(
      safeBool(routeReceipt.centralStationSwitchboardActive, false) ||
      contract.includes("HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD") ||
      datasetValue("hearthRouteConductorCentralStationSwitchboardActive") === "true"
    );

    state.routeConductorObserved = observed;
    state.routeConductorContractObserved = contract;
    state.routeConductorReceiptObserved = receipt;
    state.routeConductorCentralStationActive = centralStationActive;

    return {
      observed,
      contract,
      receipt,
      centralStationActive,
      receiptBody: clonePlain(routeReceipt)
    };
  }

  function readWestReleaseState(input = {}) {
    const source = isObject(input) ? input : {};

    const westApi = firstGlobal([
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "HEARTH.westCycleAwareAdmissibilityClutch",
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest"
    ]);

    const westReceipt = readReceipt(westApi) || findNestedObject(source, [
      "west",
      "westReceipt",
      "westRelease",
      "releasePacket",
      "canvasReleasePacket"
    ]) || {};

    const observed = Boolean(
      westApi ||
      westReceipt.contract ||
      westReceipt.receipt ||
      safeBool(source.westCanvasReleaseApproved, false) ||
      datasetValue("hearthSouthMacroWestAdmissibilityObserved") === "true"
    );

    const blocked = Boolean(
      safeBool(source.westHardBlock, false) ||
      safeBool(source.westAuditBlocked, false) ||
      safeBool(westReceipt.westHardBlock, false) ||
      safeBool(westReceipt.hardBlock, false) ||
      westReceipt.westDecision === "HARD_BLOCK" ||
      westReceipt.decision === "HARD_BLOCK" ||
      datasetValue("hearthSouthWestHardBlock") === "true"
    );

    const westCanvasReleaseApproved = Boolean(
      !blocked &&
      (
        safeBool(source.westCanvasReleaseApproved, false) ||
        safeBool(source.canvasReleaseApprovedByWest, false) ||
        safeBool(westReceipt.westCanvasReleaseApproved, false) ||
        safeBool(westReceipt.canvasReleaseApprovedByWest, false) ||
        westReceipt.westDecision === "RELEASE_TO_CANVAS" ||
        westReceipt.decision === "RELEASE_TO_CANVAS" ||
        datasetValue("hearthSouthWestCanvasReleaseApproved") === "true"
      )
    );

    const canvasReleaseAuthorized = Boolean(
      !blocked &&
      (
        safeBool(source.canvasReleaseAuthorized, false) ||
        safeBool(source.releaseToCanvas, false) ||
        safeBool(westReceipt.canvasReleaseAuthorized, false) ||
        safeBool(westReceipt.releaseToCanvas, false) ||
        westCanvasReleaseApproved ||
        datasetValue("hearthSouthCanvasReleaseAuthorized") === "true"
      )
    );

    const packet = {
      westApiPresent: Boolean(westApi),
      westReceipt: clonePlain(westReceipt),
      westReleaseObserved: Boolean(observed && canvasReleaseAuthorized && westCanvasReleaseApproved),
      westAuditObserved: observed,
      westAuditPassed: Boolean(westCanvasReleaseApproved && !blocked),
      westAuditBlocked: blocked,
      westCanvasReleaseApproved,
      canvasReleaseAuthorized
    };

    state.lastWestReleaseState = clonePlain(packet);
    state.westReleaseObserved = packet.westReleaseObserved;
    state.westAuditObserved = packet.westAuditObserved;
    state.westAuditPassed = packet.westAuditPassed;
    state.westAuditBlocked = packet.westAuditBlocked;
    state.westCanvasReleaseApproved = packet.westCanvasReleaseApproved;
    state.canvasReleaseAuthorized = packet.canvasReleaseAuthorized;
    state.macroWestGateReady = packet.westReleaseObserved;

    return packet;
  }

  function readDispatchCandidateFromGlobals() {
    const sources = [
      ["HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET", root.HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET],
      ["HEARTH_CANVAS_EAST_DISPATCH_PACKET", root.HEARTH_CANVAS_EAST_DISPATCH_PACKET],
      ["HEARTH.canvasParentEastDispatchPacket", pathRead("HEARTH.canvasParentEastDispatchPacket")],
      ["HEARTH.canvasEastDispatchPacket", pathRead("HEARTH.canvasEastDispatchPacket")],
      ["DEXTER_LAB.hearthCanvasParentEastDispatchPacket", pathRead("DEXTER_LAB.hearthCanvasParentEastDispatchPacket")],
      ["DEXTER_LAB.hearthCanvasEastDispatchPacket", pathRead("DEXTER_LAB.hearthCanvasEastDispatchPacket")]
    ];

    for (const [name, packet] of sources) {
      if (isObject(packet)) return { source: name, packet };
    }

    return { source: "NONE", packet: null };
  }

  function readDatasetDispatchPacket() {
    const packet = {
      eastDispatchAuthorized: datasetValue("hearthCanvasEastDispatchAuthorized") === "true",
      eastDispatchPacketPublished: datasetValue("hearthCanvasEastDispatchPacketPublished") === "true",
      parentContract: datasetValue("hearthCanvasContract", ""),
      parentReceipt: datasetValue("hearthCanvasReceipt", ""),
      targetFile: FILE,
      handoffTo: "EAST",
      receivedFrom: "CANVAS_PARENT",
      cycleNumber: ACTIVE_CYCLE_NUMBER,
      cycleRoute: ACTIVE_CYCLE_ROUTE,
      atlasBuildRequested: true,
      source: "DOCUMENT_DATASET_EAST_DISPATCH"
    };

    if (packet.eastDispatchAuthorized || packet.eastDispatchPacketPublished) return packet;
    return null;
  }

  function readParentEastDispatchPacket(input = {}) {
    const source = isObject(input) ? input : {};

    const directDispatch = findNestedObject(source, [
      "eastDispatchPacket",
      "dispatchPacket",
      "parentEastDispatchPacket",
      "canvasEastDispatchPacket",
      "releasePacket.eastDispatchPacket",
      "canvasReleasePacket.eastDispatchPacket"
    ]);

    const globalDispatch = readDispatchCandidateFromGlobals();
    const datasetDispatch = readDatasetDispatchPacket();

    const packet = Object.keys(directDispatch).length
      ? directDispatch
      : (globalDispatch.packet || datasetDispatch || {});

    const packetSource = Object.keys(directDispatch).length
      ? "DIRECT_INPUT"
      : (globalDispatch.packet ? globalDispatch.source : (datasetDispatch ? "DOCUMENT_DATASET" : "NONE"));

    const parent = readParentAuthorityProfile(source);
    const west = readWestReleaseState(source);

    const parentContract = safeString(firstDefined(
      packet.parentContract,
      packet.sourceParentContract,
      packet.contract === CURRENT_PARENT_CONTRACT ? packet.contract : "",
      parent.parentContract
    ), "");

    const targetFile = safeString(firstDefined(packet.targetFile, packet.destinationFile, ""), "");
    const handoffTo = safeString(firstDefined(packet.handoffTo, packet.targetCardinal, ""), "");
    const receivedFrom = safeString(firstDefined(packet.receivedFrom, packet.sourceCardinal, ""), "");
    const cycleNumber = safeNumber(firstDefined(packet.cycleNumber, packet.activeCycleNumber), 0);
    const cycleRoute = safeString(firstDefined(packet.cycleRoute, packet.activeCycleRoute, ""), "");

    const dispatchObserved = Boolean(
      Object.keys(packet).length ||
      parent.eastDispatchAuthorized ||
      parent.eastDispatchPacketPublished ||
      datasetValue("hearthCanvasEastDispatchAuthorized") === "true" ||
      datasetValue("hearthCanvasEastDispatchPacketPublished") === "true"
    );

    const dispatchAuthorized = Boolean(
      safeBool(packet.eastDispatchAuthorized, false) ||
      safeBool(packet.canvasEastDispatchAuthorized, false) ||
      parent.eastDispatchAuthorized ||
      datasetValue("hearthCanvasEastDispatchAuthorized") === "true"
    );

    const dispatchPublished = Boolean(
      safeBool(packet.eastDispatchPacketPublished, false) ||
      safeBool(packet.parentReleasePacketPublishedForEast, false) ||
      parent.eastDispatchPacketPublished ||
      dispatchObserved ||
      datasetValue("hearthCanvasEastDispatchPacketPublished") === "true"
    );

    const atlasBuildRequested = Boolean(
      safeBool(packet.atlasBuildRequested, false) ||
      safeBool(packet.f13AtlasBuildRequested, false) ||
      safeBool(packet.buildAtlasRequested, false) ||
      dispatchAuthorized
    );

    const targetOk = Boolean(!targetFile || targetFile === FILE || targetFile.includes("hearth.canvas.east.js"));
    const handoffOk = Boolean(!handoffTo || handoffTo === "EAST" || handoffTo === "CANVAS_EAST");
    const receivedOk = Boolean(!receivedFrom || receivedFrom === "CANVAS_PARENT" || receivedFrom === "PARENT" || receivedFrom === "CANVAS");
    const cycleOk = Boolean(!cycleNumber || cycleNumber === ACTIVE_CYCLE_NUMBER);
    const routeOk = Boolean(!cycleRoute || cycleRoute === ACTIVE_CYCLE_ROUTE);

    const parentChainOk = Boolean(
      parent.currentParentIsV10_3 &&
      parent.parentReleaseAccepted &&
      parent.parentReleaseLawful &&
      (
        parent.canvasParentReleaseGateReady ||
        parent.parentAcceptedRouteConductorRelease ||
        parent.parentReleasePacketLawful ||
        parent.parentReleasePacketSentToEast
      )
    );

    const westChainOk = Boolean(
      west.canvasReleaseAuthorized &&
      west.westCanvasReleaseApproved
    );

    const valid = Boolean(
      dispatchObserved &&
      dispatchAuthorized &&
      dispatchPublished &&
      parentChainOk &&
      westChainOk &&
      targetOk &&
      handoffOk &&
      receivedOk &&
      cycleOk &&
      routeOk
    );

    const result = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "CANVAS_EAST_PARENT_DISPATCH_READ",
      canvasEastApiReady: true,
      requiredApiSurfaceComplete: true,
      eastDispatchPacketObserved: dispatchObserved,
      eastDispatchPacketValid: valid,
      eastDispatchPacketAccepted: valid,
      eastDispatchPacketSource: packetSource,
      eastDispatchReceivedFrom: receivedFrom || "CANVAS_PARENT",
      eastDispatchHandoffTo: handoffTo || "EAST",
      eastDispatchCycleNumber: cycleNumber || ACTIVE_CYCLE_NUMBER,
      eastDispatchCycleRoute: cycleRoute || ACTIVE_CYCLE_ROUTE,
      eastDispatchParentContract: parentContract || parent.parentContract,
      eastDispatchTargetFile: targetFile || FILE,
      eastDispatchAuthorized: dispatchAuthorized,
      eastDispatchPacketPublished: dispatchPublished,
      eastDispatchAtlasBuildRequested: atlasBuildRequested,
      parentAuthorityProfile: clonePlain(parent),
      westReleaseState: clonePlain(west),
      rawDispatchPacket: clonePlain(packet),
      firstFailedCoordinate: valid
        ? "NONE_CANVAS_PARENT_EAST_DISPATCH_ACCEPTED"
        : !dispatchObserved
          ? "WAITING_CANVAS_PARENT_EAST_DISPATCH"
          : !dispatchAuthorized
            ? "WAITING_CANVAS_PARENT_EAST_DISPATCH_AUTHORIZATION"
            : !dispatchPublished
              ? "WAITING_CANVAS_PARENT_EAST_DISPATCH_PACKET_PUBLICATION"
              : !parent.currentParentIsV10_3
                ? "WAITING_CURRENT_CANVAS_PARENT_V10_3"
                : !parent.parentReleaseAccepted
                  ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE"
                  : !parent.parentReleaseLawful
                    ? "WAITING_CANVAS_PARENT_RELEASE_LAWFUL"
                    : !west.canvasReleaseAuthorized || !west.westCanvasReleaseApproved
                      ? "WAITING_MACRO_WEST_CANVAS_RELEASE"
                      : "WAITING_CANVAS_PARENT_EAST_DISPATCH_VALID_SHAPE",
      recommendedNextFile: valid ? FILE : PARENT_FILE,
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    state.lastDispatchPacket = clonePlain(result);
    state.eastDispatchPacketObserved = result.eastDispatchPacketObserved;
    state.eastDispatchPacketValid = result.eastDispatchPacketValid;
    state.eastDispatchPacketAccepted = result.eastDispatchPacketAccepted;
    state.eastDispatchPacketSource = result.eastDispatchPacketSource;
    state.eastDispatchReceivedFrom = result.eastDispatchReceivedFrom;
    state.eastDispatchHandoffTo = result.eastDispatchHandoffTo;
    state.eastDispatchCycleNumber = result.eastDispatchCycleNumber;
    state.eastDispatchCycleRoute = result.eastDispatchCycleRoute;
    state.eastDispatchParentContract = result.eastDispatchParentContract;
    state.eastDispatchTargetFile = result.eastDispatchTargetFile;
    state.eastDispatchAtlasBuildRequested = result.eastDispatchAtlasBuildRequested;
    state.eastDispatchAuthorized = result.eastDispatchAuthorized;
    state.eastDispatchPacketPublished = result.eastDispatchPacketPublished;
    state.canvasParentEastDispatchGateReady = Boolean(result.eastDispatchPacketAccepted || result.eastDispatchAuthorized || result.eastDispatchPacketPublished);

    return result;
  }

  function resolveAtlasBuildPermission(input = {}) {
    publishApiSurface("permission-gate-entry");

    const source = isObject(input) ? input : {};
    const falsePromotion = detectFalsePromotion(source);
    const parent = readParentAuthorityProfile(source);
    const west = readWestReleaseState(source);
    const dispatch = readParentEastDispatchPacket(source);

    let permissionClass = PERMISSION.HELD_EAST_DISPATCH_PENDING;
    let allowed = false;
    let reason = "WAITING_CANVAS_PARENT_EAST_DISPATCH";
    let permissionSource = "NONE";
    let recommended = PARENT_FILE;

    if (falsePromotion) {
      permissionClass = PERMISSION.BLOCKED_FALSE_PROMOTION;
      reason = "FALSE_PROMOTION_BLOCKED";
      recommended = FILE;
    } else if (parent.parentCorruptOrStale || (parent.parentObserved && !parent.currentParentIsV10_3)) {
      permissionClass = PERMISSION.HELD_PARENT_STALE_OR_CORRUPT;
      reason = "WAITING_CURRENT_CANVAS_PARENT_V10_3";
      recommended = PARENT_FILE;
    } else if (!parent.parentObserved) {
      permissionClass = PERMISSION.HELD_PARENT_OBSERVATION_PENDING;
      reason = "WAITING_CANVAS_PARENT_OBSERVATION";
      recommended = PARENT_FILE;
    } else if (!parent.parentReleaseAccepted || !parent.parentReleaseLawful) {
      permissionClass = PERMISSION.HELD_PARENT_RELEASE_PENDING;
      reason = !parent.parentReleaseAccepted ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE" : "WAITING_CANVAS_PARENT_RELEASE_LAWFUL";
      recommended = PARENT_FILE;
    } else if (!dispatch.eastDispatchPacketObserved) {
      permissionClass = PERMISSION.HELD_EAST_DISPATCH_PENDING;
      reason = "WAITING_CANVAS_PARENT_EAST_DISPATCH";
      recommended = PARENT_FILE;
    } else if (!dispatch.eastDispatchPacketValid) {
      permissionClass = PERMISSION.HELD_EAST_DISPATCH_MALFORMED;
      reason = dispatch.firstFailedCoordinate || "WAITING_CANVAS_PARENT_EAST_DISPATCH_VALID_SHAPE";
      recommended = PARENT_FILE;
    } else {
      permissionClass = PERMISSION.BUILD_ALLOWED_PARENT_DISPATCH;
      allowed = true;
      reason = "";
      permissionSource = dispatch.eastDispatchPacketSource || "CANVAS_PARENT_V10_3_EAST_DISPATCH";
      recommended = FILE;
    }

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      packetType: "CANVAS_EAST_ATLAS_BUILD_PERMISSION_PACKET",
      permissionClass,
      canvasEastMayBuildAtlas: allowed,
      f13BuildLawful: allowed,
      f13BuildBlockedReason: reason,
      f13PermissionSource: permissionSource,
      parentAuthorityProfile: clonePlain(parent),
      westReleaseState: clonePlain(west),
      eastDispatchState: clonePlain(dispatch),
      canvasEastApiReady: true,
      requiredApiSurfaceComplete: true,
      eastDispatchPacketObserved: dispatch.eastDispatchPacketObserved,
      eastDispatchPacketValid: dispatch.eastDispatchPacketValid,
      eastDispatchPacketAccepted: dispatch.eastDispatchPacketAccepted,
      firstFailedCoordinate: allowed ? "NONE_CANVAS_EAST_ATLAS_BUILD_PERMISSION_GRANTED" : reason,
      recommendedNextFile: recommended,
      recommendedNextRenewalTarget: recommended,
      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      completionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    state.lastPermissionPacket = clonePlain(packet);
    state.permissionClass = permissionClass;
    state.canvasEastMayBuildAtlas = allowed;
    state.f13BuildLawful = allowed;
    state.f13BuildBlockedReason = reason;
    state.f13PermissionSource = permissionSource;
    state.firstFailedCoordinate = allowed
      ? (state.f13AtlasPacketReady ? "NONE_F13F_ATLAS_PACKET_READY" : "WAITING_CANVAS_EAST_ATLAS_EVIDENCE")
      : "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
    state.recommendedNextFile = allowed
      ? (state.f13AtlasPacketReady ? CANVAS_WEST_FILE : FILE)
      : FILE;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;

    recomputeChronology();
    publishDatasetFirstProof({ quiet: true });

    return packet;
  }

  function composeHeldAtlasPacket(input = {}, permission = null) {
    publishApiSurface("held-packet-entry");

    const gate = permission || resolveAtlasBuildPermission(input);
    const reason = gate.f13BuildBlockedReason || "WAITING_CANVAS_PARENT_EAST_DISPATCH";

    state.heldAtlasPacketReturned = true;
    state.heldPacketWasSynchronous = true;
    state.buildAtlasReturnedPromise = false;
    state.canvasEastApiReady = true;
    state.canvasEastReady = true;
    state.canvasEastCurrent = true;
    state.requiredApiSurfaceComplete = true;
    state.canvasEastEvidenceReady = false;
    state.canvasEastMayBuildAtlas = false;
    state.f13BuildLawful = false;
    state.f13BuildBlockedReason = reason;
    state.permissionClass = gate.permissionClass || PERMISSION.HELD_EAST_DISPATCH_PENDING;
    state.atlasBuildStarted = false;
    state.atlasBuildComplete = false;
    state.f13SourceStageStarted = false;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceGateReady = false;
    state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;

    blockFinalClaims();
    recomputeChronology();

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      parentFile: PARENT_FILE,
      packetType: "CANVAS_EAST_SYNCHRONOUS_HELD_ATLAS_PACKET",

      canvasEastApiReady: true,
      canvasEastReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,
      aliasesPublished: true,
      datasetFirstProofPublished: true,
      receiptsPublished: true,

      heldAtlasPacketReturned: true,
      synchronousHeldPacketActive: true,
      heldPacketWasSynchronous: true,
      buildAtlasReturnedPromise: false,
      heldDoesNotMeanApiMissing: true,

      atlasReady: false,
      atlasBuildComplete: false,
      atlasCanvasPresent: false,
      canvasEastEvidenceReady: false,
      f13AtlasPacketReady: false,

      permissionClass: state.permissionClass,
      canvasEastMayBuildAtlas: false,
      f13BuildLawful: false,
      f13BuildBlockedReason: reason,
      f13PermissionSource: "NONE",

      parentAuthorityProfile: clonePlain(state.lastParentAuthorityProfile),
      westReleaseState: clonePlain(state.lastWestReleaseState),
      eastDispatchState: clonePlain(state.lastDispatchPacket),

      chronologicalGateCount: state.chronologicalGateCount,
      chronologicalGatesSatisfied: state.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: "CANVAS_EAST_ATLAS_EVIDENCE_READY",
      chronologicalFirstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",

      fibonacciSynchronizationChronologyFirst: true,
      fibonacciSynchronizationScore: 50,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationSatisfied: 50,
      fibonacciSynchronizationPassed: false,
      fibonacciSynchronizationDegraded: true,
      fibonacciSynchronizationHardFail: false,
      fibonacciSynchronizationHoldReason: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",

      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      activeF13EGate: F13E_GATE,
      activeF13FGate: F13F_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,

      firstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      nextConsumerFile: PARENT_FILE,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      completionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    state.lastHeldAtlasPacket = clonePlain(packet);

    recordLocal("SYNCHRONOUS_HELD_ATLAS_PACKET_RETURNED_API_STILL_READY", {
      reason,
      permissionClass: state.permissionClass,
      apiReadyStillTrue: true,
      evidenceReadyStillFalse: true,
      heldDoesNotMeanApiMissing: true
    });

    publishApiSurface("held-packet-returned-api-still-ready");
    return packet;
  }

  function receiveParentDispatchPacket(packet = {}) {
    publishApiSurface("receive-parent-dispatch-entry");

    const dispatch = readParentEastDispatchPacket({ eastDispatchPacket: packet });

    if (dispatch.eastDispatchPacketValid) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.atlasBuildRequested = dispatch.eastDispatchAtlasBuildRequested;
    } else {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    recomputeChronology();
    publishApiSurface("receive-parent-dispatch-complete");

    if (dispatch.eastDispatchPacketValid && dispatch.eastDispatchAtlasBuildRequested) {
      return buildAtlas({ eastDispatchPacket: packet });
    }

    if (dispatch.eastDispatchPacketValid) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        packetType: "CANVAS_EAST_PARENT_DISPATCH_ACCEPTANCE_RECEIPT",
        canvasEastApiReady: true,
        requiredApiSurfaceComplete: true,
        eastDispatchPacketObserved: true,
        eastDispatchPacketValid: true,
        eastDispatchPacketAccepted: true,
        atlasBuildRequested: dispatch.eastDispatchAtlasBuildRequested,
        canvasEastEvidenceReady: state.f13AtlasPacketReady,
        firstFailedCoordinate: state.f13AtlasPacketReady ? "NONE_F13F_ATLAS_PACKET_READY" : "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
        recommendedNextFile: state.f13AtlasPacketReady ? CANVAS_WEST_FILE : FILE,
        recommendedNextRenewalTarget: state.f13AtlasPacketReady ? CANVAS_WEST_FILE : FILE,
        f21EligibleForNorth: false,
        readyTextAllowed: false,
        completionLatched: false,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }

    return composeHeldAtlasPacket({}, resolveAtlasBuildPermission({ eastDispatchPacket: packet }));
  }

  function buildAtlas(options = {}) {
    publishApiSurface("buildAtlas-entry");

    const permission = resolveAtlasBuildPermission(options);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(options, permission);
    }

    if (options && (options.async === true || options.defer === true || options.nonBlocking === true)) {
      state.buildAtlasReturnedPromise = true;
      publishDatasetFirstProof({ quiet: true });
      return buildAtlasAsync(options, permission);
    }

    return buildAtlasSync(options, permission);
  }

  function buildAtlasSync(options = {}, permissionInput = null) {
    publishApiSurface("buildAtlasSync-entry");

    const permission = permissionInput || resolveAtlasBuildPermission(options);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(options, permission);
    }

    const width = clamp(Math.round(safeNumber(options.width || options.atlasWidth, DEFAULT_ATLAS_WIDTH)), MIN_ATLAS_WIDTH, MAX_ATLAS_WIDTH);
    const height = clamp(Math.round(safeNumber(options.height || options.atlasHeight, DEFAULT_ATLAS_HEIGHT)), MIN_ATLAS_HEIGHT, MAX_ATLAS_HEIGHT);

    resetBuildCounters(width, height, "sync");
    refreshMaterialBridge({ updateDataset: false });

    try {
      atlasCanvas = createAtlasCanvas(width, height);
      const ctx = atlasCanvas && isFunction(atlasCanvas.getContext)
        ? atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true })
        : null;

      if (!ctx) throw new Error("Canvas East could not create atlas 2D context.");

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const classSet = new Set();

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0.5 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0.5 : x / (width - 1);
          const material = sampleWithAuthority({ u, v });
          countSample(material, classSet);

          const offset = (y * width + x) * 4;
          const rgb = normalizeRgb(material.rgb || material.color, PALETTE.void);
          data[offset] = rgb[0];
          data[offset + 1] = rgb[1];
          data[offset + 2] = rgb[2];
          data[offset + 3] = clamp(Math.round(clamp01(material.alpha === undefined ? 1 : material.alpha) * 255), 0, 255);
        }

        if (y % 32 === 0 || y === height - 1) {
          progressCallback(options, Math.round(((y + 1) / height) * 100), { row: y, height, mode: "sync" });
        }
      }

      ctx.putImageData(imageData, 0, 0);
      lastAtlasImageData = imageData;
      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);

      return finalizeAtlasBuild(width, height, "sync", options);
    } catch (error) {
      return atlasBuildFailure(error, width, height, "sync");
    }
  }

  async function buildAtlasAsync(options = {}, permissionInput = null) {
    publishApiSurface("buildAtlasAsync-entry");

    const permission = permissionInput || resolveAtlasBuildPermission(options);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(options, permission);
    }

    const width = clamp(Math.round(safeNumber(options.width || options.atlasWidth, DEFAULT_ATLAS_WIDTH)), MIN_ATLAS_WIDTH, MAX_ATLAS_WIDTH);
    const height = clamp(Math.round(safeNumber(options.height || options.atlasHeight, DEFAULT_ATLAS_HEIGHT)), MIN_ATLAS_HEIGHT, MAX_ATLAS_HEIGHT);
    const rowsPerChunk = clamp(Math.round(safeNumber(options.rowsPerChunk, 10)), 1, 40);

    resetBuildCounters(width, height, "async");
    refreshMaterialBridge({ updateDataset: false });

    try {
      atlasCanvas = createAtlasCanvas(width, height);
      const ctx = atlasCanvas && isFunction(atlasCanvas.getContext)
        ? atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true })
        : null;

      if (!ctx) throw new Error("Canvas East could not create atlas 2D context.");

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const classSet = new Set();

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0.5 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0.5 : x / (width - 1);
          const material = sampleWithAuthority({ u, v });
          countSample(material, classSet);

          const offset = (y * width + x) * 4;
          const rgb = normalizeRgb(material.rgb || material.color, PALETTE.void);
          data[offset] = rgb[0];
          data[offset + 1] = rgb[1];
          data[offset + 2] = rgb[2];
          data[offset + 3] = clamp(Math.round(clamp01(material.alpha === undefined ? 1 : material.alpha) * 255), 0, 255);
        }

        if (y % rowsPerChunk === 0 || y === height - 1) {
          progressCallback(options, Math.round(((y + 1) / height) * 100), { row: y, height, mode: "async" });
          await yieldBuildFrame();
        }
      }

      ctx.putImageData(imageData, 0, 0);
      lastAtlasImageData = imageData;
      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);

      return finalizeAtlasBuild(width, height, "async", options);
    } catch (error) {
      return atlasBuildFailure(error, width, height, "async");
    }
  }

  function createAtlasCanvas(width, height) {
    if (doc && isFunction(doc.createElement)) {
      const canvas = doc.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.dataset.hearthCanvasEastAtlas = "true";
      canvas.dataset.hearthCanvasEastContract = CONTRACT;
      canvas.dataset.hearthCanvasEastReceipt = RECEIPT;
      canvas.dataset.hearthCanvasEastSourceOnly = "true";
      canvas.dataset.hearthCanvasEastVisibleProof = "false";
      canvas.dataset.hearthCanvasEastCanvasReady = "false";
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
      return canvas;
    }

    if (typeof OffscreenCanvas !== "undefined") {
      return new OffscreenCanvas(width, height);
    }

    throw new Error("No canvas creation API available.");
  }

  function yieldBuildFrame() {
    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) root.requestAnimationFrame(() => resolve());
      else root.setTimeout(resolve, 0);
    });
  }

  function resetBuildCounters(width, height, mode = "sync") {
    state.heldAtlasPacketReturned = false;
    state.heldPacketWasSynchronous = false;
    state.buildAtlasReturnedPromise = mode === "async";
    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;
    state.atlasBuildComplete = false;
    state.atlasBuildError = "";
    state.atlasBuildStartedAt = nowIso();
    state.atlasBuildCompletedAt = "";
    state.atlasCanvasPresent = false;
    state.atlasWidth = width;
    state.atlasHeight = height;
    state.atlasPixelCount = width * height;
    state.atlasTotalSampleCount = 0;
    state.atlasLandSampleCount = 0;
    state.atlasWaterSampleCount = 0;
    state.atlasCoastSampleCount = 0;
    state.atlasReliefSampleCount = 0;
    state.atlasClassCount = 0;
    state.atlasClasses = [];
    state.f13SourceStageStarted = true;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceReady = false;
    state.canvasEastEvidenceGateReady = false;

    blockFinalClaims();
    state.updatedAt = state.atlasBuildStartedAt;

    recordLocal("F13E_ATLAS_BUILD_STARTED", {
      width,
      height,
      mode,
      permissionSource: state.f13PermissionSource,
      apiReadyBeforeBuild: true
    });
  }

  function finalizeAtlasBuild(width, height, mode, options = {}) {
    state.atlasBuildProgress = 100;
    state.atlasBuildComplete = true;
    state.atlasCanvasPresent = true;
    state.atlasBuildCompletedAt = nowIso();
    state.f13SourceStageComplete = true;
    state.f13AtlasPacketReady = true;
    state.canvasEastEvidenceReady = true;
    state.canvasEastEvidenceGateReady = true;
    state.firstFailedCoordinate = "NONE_F13F_ATLAS_PACKET_READY";
    state.recommendedNextFile = CANVAS_WEST_FILE;
    state.recommendedNextRenewalTarget = CANVAS_WEST_FILE;
    state.nextConsumerFile = PARENT_FILE;

    blockFinalClaims();
    recomputeChronology();

    recordLocal("F13F_ATLAS_BUILD_COMPLETE", {
      width,
      height,
      mode,
      atlasPixelCount: state.atlasPixelCount,
      atlasClassCount: state.atlasClassCount,
      evidenceReturnsToParent: true,
      visibleProof: false,
      canvasReady: false,
      f21ClaimedByCanvasEast: false,
      visualPassClaimed: false
    });

    publishApiSurface("atlas-build-complete");

    const packet = composeAtlasEvidencePacket({ atlasCanvas, width, height });

    if (isFunction(options.onComplete)) {
      try {
        options.onComplete(packet);
      } catch (error) {
        recordError("ATLAS_COMPLETE_CALLBACK_FAILED", error);
      }
    }

    return packet;
  }

  function atlasBuildFailure(error, width, height, mode) {
    state.atlasBuildError = error && error.message ? error.message : String(error);
    state.atlasBuildComplete = false;
    state.atlasCanvasPresent = false;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceReady = false;
    state.canvasEastEvidenceGateReady = false;
    state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_BUILD";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;

    blockFinalClaims();

    recordError("ATLAS_BUILD_FAILED", error, { width, height, mode });
    recomputeChronology();
    publishApiSurface("atlas-build-failed-api-still-ready");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      packetType: "CANVAS_EAST_ATLAS_BUILD_FAILURE_PACKET",
      canvasEastApiReady: true,
      canvasEastReady: true,
      canvasEastCurrent: true,
      requiredApiSurfaceComplete: true,
      atlasBuildStarted: true,
      atlasBuildComplete: false,
      atlasBuildError: state.atlasBuildError,
      f13SourceStageStarted: true,
      f13SourceStageComplete: false,
      f13AtlasPacketReady: false,
      canvasEastEvidenceReady: false,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: FILE,
      recommendedNextRenewalTarget: FILE,
      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      completionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function composeAtlasEvidencePacket(config = {}) {
    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      parentFile: PARENT_FILE,
      routeFile: ROUTE_FILE,
      packetType: "CANVAS_EAST_F13_ATLAS_EVIDENCE_PACKET",

      canvasEastApiReady: true,
      canvasEastReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,

      eastDispatchPacketObserved: state.eastDispatchPacketObserved,
      eastDispatchPacketValid: state.eastDispatchPacketValid,
      eastDispatchPacketAccepted: state.eastDispatchPacketAccepted,
      eastDispatchPacketSource: state.eastDispatchPacketSource,

      permissionClass: state.permissionClass,
      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,

      parentAuthorityProfile: clonePlain(state.lastParentAuthorityProfile),
      westReleaseState: clonePlain(state.lastWestReleaseState),

      atlasCanvas: config.atlasCanvas || atlasCanvas || null,
      canvas: config.atlasCanvas || atlasCanvas || null,
      width: safeNumber(config.width, state.atlasWidth),
      height: safeNumber(config.height, state.atlasHeight),
      atlasWidth: safeNumber(config.width, state.atlasWidth),
      atlasHeight: safeNumber(config.height, state.atlasHeight),
      atlasReady: Boolean(config.atlasCanvas || atlasCanvas),
      atlasBuildComplete: state.atlasBuildComplete,
      atlasCanvasPresent: state.atlasCanvasPresent,
      sourceRole: "east-material-atlas-source",
      materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false }),

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,

      chronologicalGateCount: state.chronologicalGateCount,
      chronologicalGatesSatisfied: state.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: state.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: state.chronologicalFirstFailedCoordinate,

      fibonacciSynchronizationChronologyFirst: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationPassed: state.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,
      fibonacciSynchronizationHardFail: false,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      activeF13EGate: F13E_GATE,
      activeF13FGate: F13F_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,

      nextConsumerFile: PARENT_FILE,
      destinationFile: PARENT_FILE,
      recommendedNextFile: CANVAS_WEST_FILE,
      recommendedNextRenewalTarget: CANVAS_WEST_FILE,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      completionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      getReceipt,
      createdAt: nowIso()
    };

    state.lastAtlasPacket = clonePlain({
      ...packet,
      atlasCanvas: packet.atlasCanvas ? "[canvas]" : null,
      canvas: packet.canvas ? "[canvas]" : null
    });

    return packet;
  }

  function progressCallback(options, progress, detail = {}) {
    state.atlasBuildProgress = clamp(progress, 0, 100);
    state.updatedAt = nowIso();

    if (isFunction(options.onProgress)) {
      try {
        options.onProgress(state.atlasBuildProgress, {
          contract: CONTRACT,
          receipt: RECEIPT,
          event: "ATLAS_BUILD_PROGRESS",
          fibonacci: ACTIVE_FIBONACCI_GATE,
          progress: state.atlasBuildProgress,
          detail: clonePlain(detail),
          canvasEastApiReady: true,
          canvasEastEvidenceReady: false,
          visibleProof: false,
          canvasReady: false,
          f21ClaimedByCanvasEast: false,
          visualPassClaimed: false
        });
      } catch (error) {
        recordError("ATLAS_PROGRESS_CALLBACK_FAILED", error);
      }
    }

    publishDatasetFirstProof({ quiet: true });
  }

  function getMaterialAuthority() {
    const candidates = [
      pathRead("HEARTH.materials"),
      pathRead("HEARTH.materialAuthority"),
      pathRead("HEARTH.materialsAuthority"),
      pathRead("HEARTH.surfaceMaterials"),
      root.HEARTH_MATERIALS,
      root.HEARTH_MATERIAL_AUTHORITY,
      root.HEARTH_MATERIALS_AUTHORITY,
      root.HEARTH_SURFACE_MATERIALS,
      root.HearthMaterials,
      root.HearthMaterialAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterials,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterialAuthority
    ];

    for (const candidate of candidates) {
      if (!candidate || !isObject(candidate)) continue;
      if (candidate === api) continue;
      if (candidate.contract === CONTRACT || candidate.receipt === RECEIPT) continue;

      if (
        isFunction(candidate.sample) ||
        isFunction(candidate.read) ||
        isFunction(candidate.getMaterial) ||
        isFunction(candidate.materialAt) ||
        isFunction(candidate.getMaterialAt) ||
        isFunction(candidate.resolveMaterial)
      ) {
        return candidate;
      }
    }

    return null;
  }

  function resolveMaterialSampler(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = ["sample", "read", "getMaterial", "materialAt", "getMaterialAt", "resolveMaterial"];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      return function runMaterialSampler(point) {
        try {
          const result = authority[method](point);
          if (isObject(result)) return result;
        } catch (_error) {}

        try {
          const result = authority[method](point.u, point.v, point.lon, point.lat);
          if (isObject(result)) return result;
        } catch (_error2) {}

        return null;
      };
    }

    return null;
  }

  function readMaterialReceipt(authority = getMaterialAuthority()) {
    if (!authority || !isObject(authority)) return null;

    const receipt = readReceipt(authority);
    if (receipt) return receipt;

    return {
      contract: authority.contract || "",
      receipt: authority.receipt || "",
      version: authority.version || "",
      role: authority.role || "materials"
    };
  }

  function refreshMaterialBridge(options = {}) {
    const authority = options.authority || getMaterialAuthority();
    const materialReceipt = readMaterialReceipt(authority);

    materialSampler = resolveMaterialSampler(authority);

    state.canonicalMaterialAuthorityPresent = Boolean(authority);
    state.materialNestedReceiptAvailable = Boolean(materialReceipt);
    state.materialReceiptBridgeActive = Boolean(materialReceipt);
    state.materialContract = materialReceipt ? safeString(materialReceipt.contract, "") : "";
    state.materialReceipt = materialReceipt ? safeString(materialReceipt.receipt, "") : "";
    state.materialVersion = materialReceipt ? safeString(materialReceipt.version, "") : "";
    state.materialRole = materialReceipt ? safeString(materialReceipt.authority || materialReceipt.role || "materials", "materials") : "";
    state.materialContractMatchesExpected = state.materialContract === EXPECTED_MATERIAL_CONTRACT;
    state.materialReceiptMatchesExpected = state.materialReceipt === EXPECTED_MATERIAL_RECEIPT;
    state.canonicalMaterialConsumed = Boolean(authority && state.materialContractMatchesExpected);

    if (options.updateDataset !== false) publishDatasetFirstProof({ quiet: true });

    return {
      authorityPresent: Boolean(authority),
      materialReceipt: clonePlain(materialReceipt || null),
      materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false })
    };
  }

  function getMaterialBridgeReceipt(options = {}) {
    if (options.sync !== false) refreshMaterialBridge({ updateDataset: false });

    return {
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialExpectedContract: EXPECTED_MATERIAL_CONTRACT,
      materialExpectedReceipt: EXPECTED_MATERIAL_RECEIPT,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialVersion: state.materialVersion,
      materialRole: state.materialRole,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed
    };
  }

  function pointFromUv(u, v) {
    const uu = ((safeNumber(u, 0.5) % 1) + 1) % 1;
    const vv = clamp(safeNumber(v, 0.5), 0, 1);
    const lon = uu * 360 - 180;
    const lat = 90 - vv * 180;
    const lonRad = lon * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const c = Math.cos(latRad);

    return {
      u: uu,
      v: vv,
      lon,
      lat,
      x: Math.sin(lonRad) * c,
      y: Math.sin(latRad),
      z: Math.cos(lonRad) * c
    };
  }

  function normalizePoint(input = {}, b, c) {
    if (isObject(input)) {
      if (Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) return pointFromUv(input.u, input.v);

      if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
        return pointFromUv((Number(input.lon) + 180) / 360, (90 - Number(input.lat)) / 180);
      }

      if (Number.isFinite(Number(input.x)) && Number.isFinite(Number(input.y)) && Number.isFinite(Number(input.z))) {
        const x = Number(input.x);
        const y = Number(input.y);
        const z = Number(input.z);
        const m = Math.hypot(x, y, z) || 1;
        const nx = x / m;
        const ny = y / m;
        const nz = z / m;
        const lon = Math.atan2(nx, nz) * 180 / Math.PI;
        const lat = Math.asin(clamp(ny, -1, 1)) * 180 / Math.PI;
        return {
          x: nx,
          y: ny,
          z: nz,
          lon,
          lat,
          u: ((lon + 180) / 360 % 1 + 1) % 1,
          v: clamp((90 - lat) / 180, 0, 1)
        };
      }
    }

    if (Number.isFinite(Number(input)) && Number.isFinite(Number(b)) && Number.isFinite(Number(c))) {
      return normalizePoint({ x: input, y: b, z: c });
    }

    if (Number.isFinite(Number(input)) && Number.isFinite(Number(b))) {
      return pointFromUv(input, b);
    }

    return pointFromUv(0.5, 0.5);
  }

  function hashNoise(x, y, z, salt = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 89.17) * 43758.5453123;
    return n - Math.floor(n);
  }

  function textureNoise(point, salt = 0) {
    const n1 = hashNoise(point.u || 0, point.v || 0, point.x || 0, salt);
    const n2 = hashNoise(point.v || 0, point.z || 0, point.y || 0, salt + 13);
    const n3 = hashNoise(point.x || 0, point.y || 0, point.z || 0, salt + 31);
    return clamp01(n1 * 0.46 + n2 * 0.34 + n3 * 0.20);
  }

  function mixNumber(a, b, t) {
    const k = clamp01(t);
    return a + (b - a) * k;
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(mixNumber(a[0], b[0], k)),
      Math.round(mixNumber(a[1], b[1], k)),
      Math.round(mixNumber(a[2], b[2], k))
    ];
  }

  function scaleColor(color, scalar) {
    const s = Number.isFinite(Number(scalar)) ? Number(scalar) : 1;
    return [
      clamp(Math.round(color[0] * s), 0, 255),
      clamp(Math.round(color[1] * s), 0, 255),
      clamp(Math.round(color[2] * s), 0, 255)
    ];
  }

  function normalizeRgb(value, fallback = PALETTE.void) {
    if (!Array.isArray(value) || value.length < 3) return fallback.slice();

    return [
      clamp(Math.round(safeNumber(value[0], fallback[0])), 0, 255),
      clamp(Math.round(safeNumber(value[1], fallback[1])), 0, 255),
      clamp(Math.round(safeNumber(value[2], fallback[2])), 0, 255)
    ];
  }

  function fallbackTerrain(point) {
    const n = textureNoise(point, 411);
    const n2 = textureNoise(point, 503);
    const latAbs = Math.abs(point.lat) / 90;
    const equator = 1 - latAbs;

    const massA = Math.max(0, 0.62 - Math.hypot(point.u - 0.18, point.v - 0.36) * 1.45);
    const massB = Math.max(0, 0.58 - Math.hypot(point.u - 0.45, point.v - 0.48) * 1.55);
    const massC = Math.max(0, 0.57 - Math.hypot(point.u - 0.74, point.v - 0.28) * 1.50);
    const massD = Math.max(0, 0.52 - Math.hypot(point.u - 0.66, point.v - 0.72) * 1.70);
    const polarShelf = Math.max(0, 0.42 - Math.abs(point.v - 0.12) * 2.2) + Math.max(0, 0.36 - Math.abs(point.v - 0.86) * 2.6);

    const landSignal = clamp01(
      massA * 0.34 +
      massB * 0.31 +
      massC * 0.28 +
      massD * 0.23 +
      polarShelf * 0.12 +
      equator * 0.07 +
      (n - 0.5) * 0.18 +
      (n2 - 0.5) * 0.08
    );

    const coastBand = clamp01(1 - Math.abs(landSignal - 0.40) / 0.17);
    const isLand = landSignal > 0.40;
    const isWater = !isLand;
    const elevation = isLand ? landSignal * 0.68 : -0.18 - (1 - landSignal) * 0.44;

    let rgb = isWater
      ? mixColor(PALETTE.water, PALETTE.deepWater, clamp01((0.40 - landSignal) * 1.6))
      : mixColor(PALETTE.land, PALETTE.highland, clamp01(landSignal * 0.58));

    if (coastBand > 0.30) rgb = mixColor(rgb, isWater ? PALETTE.shelf : PALETTE.coast, coastBand * 0.20);
    if (isLand && n > 0.68) rgb = mixColor(rgb, PALETTE.ridge, clamp01((n - 0.68) * 0.54));
    if (isLand && n > 0.84) rgb = mixColor(rgb, PALETTE.peak, clamp01((n - 0.84) * 0.62));
    if (isLand && n < 0.22) rgb = mixColor(rgb, PALETTE.canyon, clamp01((0.22 - n) * 0.44));
    if (Math.abs(point.lat) > 72) rgb = mixColor(rgb, PALETTE.ice, clamp01((Math.abs(point.lat) - 72) / 18) * 0.28);

    return {
      contract: "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER",
      receipt: "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER_RECEIPT",
      rgb,
      color: rgb,
      alpha: 1,
      elevation,
      isLand,
      isWater,
      terrainClass: isWater ? (coastBand > 0.34 ? "shallow_water" : "ocean_basin") : (coastBand > 0.34 ? "coast_edge" : "continent_mass"),
      materialClass: isWater ? "fallback.water.carrier" : "fallback.land.carrier",
      hydrologyClass: isWater ? "fallback_ocean_basin" : "fallback_coastal_transition",
      terrainRelief: isLand ? clamp01(n * 0.26 + landSignal * 0.22) : 0,
      fallbackOnly: true,
      canvasEastSourceOnly: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      canvasEastDoesNotOwnMaterialTruth: true,
      visibleProof: false,
      canvasReady: false,
      f21ClaimedByCanvasEast: false,
      visualPassClaimed: false
    };
  }

  function normalizeSample(raw, point, fallbackUsed) {
    const source = isObject(raw) ? raw : fallbackTerrain(point);
    const terrainClass = safeString(source.terrainClass || source.worldTerrainClass || source.expandedTerrainClass || source.semanticTerrainClass, "") || (safeBool(source.isWater, false) ? "ocean_basin" : "continent_mass");

    const isWater = safeBool(source.isWater, terrainClass.includes("water") || terrainClass.includes("ocean"));
    const isLand = safeBool(source.isLand, !isWater);
    const isCoast = terrainClass.includes("coast") || terrainClass.includes("shore");
    const relief = clamp01(safeNumber(source.terrainRelief, 0) + safeNumber(source.ridgeRelief, 0));

    const rgb = normalizeRgb(source.rgb || source.color || source.baseColor || source.finalColorHint, isWater ? PALETTE.water : PALETTE.land);
    const n = textureNoise(point, 733);
    const finalRgb = scaleColor(rgb, 1 + (n - 0.5) * (0.03 + relief * 0.03));

    return {
      ...source,
      contract: source.contract || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER" : "UNKNOWN_MATERIAL_SOURCE"),
      receipt: source.receipt || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER_RECEIPT" : "UNKNOWN_MATERIAL_RECEIPT"),
      eastContract: CONTRACT,
      eastReceipt: RECEIPT,
      sourceType: fallbackUsed ? "fallback" : "material",
      u: point.u,
      v: point.v,
      lon: point.lon,
      lat: point.lat,
      x: point.x,
      y: point.y,
      z: point.z,
      rgb: finalRgb,
      color: finalRgb,
      baseColor: finalRgb,
      finalColorHint: finalRgb,
      alpha: clamp01(safeNumber(source.alpha, 1)),
      terrainClass,
      isWater,
      isLand,
      isCoast,
      relief,
      fallbackSample: fallbackUsed,
      materialSample: !fallbackUsed,
      atlasExpressionApplied: true,
      canvasEastSourceOnly: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      canvasEastDoesNotOwnMaterialTruth: true,
      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function sampleWithAuthority(point = {}) {
    const p = normalizePoint(point);
    const materialAuthority = getMaterialAuthority();
    refreshMaterialBridge({ authority: materialAuthority, updateDataset: false });

    let raw = null;
    let fallbackUsed = false;

    if (materialAuthority) {
      const sampler = materialSampler || resolveMaterialSampler(materialAuthority);
      if (sampler) raw = sampler(p);
    }

    if (!isObject(raw)) {
      raw = fallbackTerrain(p);
      fallbackUsed = true;
      state.fallbackSampleUsedAtRuntime = true;
      state.emergencyFallbackUsed = Boolean(state.canvasEastMayBuildAtlas);
    }

    return normalizeSample(raw, p, fallbackUsed);
  }

  function sample(point = {}, b, c) {
    publishApiSurface("sample-entry");

    try {
      return sampleWithAuthority(normalizePoint(point, b, c));
    } catch (error) {
      recordError("SAMPLE_FAILED_USING_FALLBACK_API_STILL_READY", error);
      const p = normalizePoint(point, b, c);
      return normalizeSample(fallbackTerrain(p), p, true);
    }
  }

  function read(point = {}, b, c) {
    return sample(point, b, c);
  }

  function countSample(material, classSet) {
    state.atlasTotalSampleCount += 1;
    if (material.isLand) state.atlasLandSampleCount += 1;
    if (material.isWater) state.atlasWaterSampleCount += 1;
    if (material.isCoast) state.atlasCoastSampleCount += 1;
    if (material.relief > 0.18) state.atlasReliefSampleCount += 1;

    const className = material.terrainClass || material.materialClass || material.sourceType || "unknown";
    if (className) classSet.add(className);
  }

  function getAtlasCanvas() {
    return atlasCanvas;
  }

  function getLastAtlasImageData() {
    return lastAtlasImageData;
  }

  function getAtlasPacket() {
    if (!state.f13AtlasPacketReady) return null;
    return composeAtlasEvidencePacket({ atlasCanvas, width: state.atlasWidth, height: state.atlasHeight });
  }

  function getAtlas() {
    return getAtlasPacket();
  }

  function invalidateAtlas(reason = "manual-invalidation", options = {}) {
    state.atlasBuildComplete = false;
    state.atlasCanvasPresent = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceReady = false;
    state.canvasEastEvidenceGateReady = false;
    state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    atlasCanvas = null;
    lastAtlasImageData = null;

    blockFinalClaims();

    recordLocal("ATLAS_INVALIDATED_API_STILL_READY", {
      reason,
      apiStillReady: true
    });

    recomputeChronology();
    if (!options.skipDataset) publishDatasetFirstProof({ quiet: true });
    publishApiSurface("atlas-invalidated-api-still-ready");

    return getReceipt();
  }

  function recomputeChronology() {
    const f13ePass = Boolean(
      state.canvasEastApiReady &&
      state.requiredApiSurfaceComplete &&
      state.buildAtlasAvailable &&
      state.sampleAvailable &&
      state.readAvailable &&
      state.getReceiptAvailable &&
      state.aliasesPublished
    );

    const f13fPass = Boolean(
      state.atlasBuildComplete &&
      state.atlasCanvasPresent &&
      state.f13AtlasPacketReady &&
      state.canvasEastEvidenceReady
    );

    const gates = [
      true,
      true,
      Boolean(state.westReleaseObserved || state.westCanvasReleaseApproved || state.canvasReleaseAuthorized),
      Boolean(state.parentReleaseAccepted && state.parentReleaseLawful),
      Boolean(state.eastDispatchAuthorized || state.eastDispatchPacketPublished || state.eastDispatchPacketAccepted),
      f13ePass,
      f13fPass,
      Boolean(state.canvasWestGateReady),
      Boolean(state.canvasSouthGateReady),
      false
    ];

    const firstFailedIndex = gates.findIndex((value) => !value);
    const satisfied = gates.filter(Boolean).length;

    state.chronologicalGateCount = CHRONOLOGY.length;
    state.chronologicalGatesSatisfied = satisfied;
    state.chronologicalFirstFailedGate = firstFailedIndex >= 0 ? CHRONOLOGY[firstFailedIndex] : "NONE_CHRONOLOGY_COMPLETE";
    state.chronologicalFirstFailedCoordinate =
      firstFailedIndex === 6 ? "WAITING_CANVAS_EAST_ATLAS_EVIDENCE" :
      firstFailedIndex === 5 ? "WAITING_CANVAS_EAST_API" :
      firstFailedIndex === 4 ? "WAITING_CANVAS_PARENT_EAST_DISPATCH" :
      firstFailedIndex === 3 ? "WAITING_CANVAS_PARENT_RELEASE_ACCEPTANCE" :
      state.firstFailedCoordinate || "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";

    let score = 0;
    if (f13ePass) score += 50;
    if (f13fPass) score += 50;

    state.fibonacciSynchronizationSatisfied = score;
    state.fibonacciSynchronizationExpected = 100;
    state.fibonacciSynchronizationScore = score;
    state.fibonacciSynchronizationPassed = score === 100;
    state.fibonacciSynchronizationDegraded = score >= 50 && score < 100 && !state.fibonacciSynchronizationHardFail;
    state.fibonacciSynchronizationHardFail = Boolean(
      state.permissionClass === PERMISSION.BLOCKED_FALSE_PROMOTION ||
      state.permissionClass === PERMISSION.HELD_PARENT_STALE_OR_CORRUPT ||
      state.atlasBuildError
    );
    state.fibonacciSynchronizationHoldReason = state.fibonacciSynchronizationPassed
      ? "NONE_F13E_F13F_SYNCHRONIZED"
      : (f13ePass ? "WAITING_CANVAS_EAST_ATLAS_EVIDENCE" : "WAITING_CANVAS_EAST_API");

    state.canvasEastGateReady = f13ePass;
    state.canvasEastEvidenceGateReady = f13fPass;

    if (f13fPass) {
      state.firstFailedCoordinate = "NONE_F13F_ATLAS_PACKET_READY";
      state.recommendedNextFile = CANVAS_WEST_FILE;
      state.recommendedNextRenewalTarget = CANVAS_WEST_FILE;
    } else if (f13ePass) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    } else {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    blockFinalClaims();
  }

  function getReceiptLight(_doRefresh = false) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      legacyBaselineContract: LEGACY_BASELINE_CONTRACT,
      legacyBaselineReceipt: LEGACY_BASELINE_RECEIPT,
      compatibilityContract: COMPATIBILITY_CONTRACT,
      compatibilityReceipt: COMPATIBILITY_RECEIPT,
      currentParentContract: CURRENT_PARENT_CONTRACT,
      currentParentReceipt: CURRENT_PARENT_RECEIPT,
      routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
      routeConductorReceipt: ROUTE_CONDUCTOR_RECEIPT,
      macroWestContract: MACRO_WEST_CONTRACT,

      version: VERSION,
      file: FILE,
      parentFile: PARENT_FILE,
      routeFile: ROUTE_FILE,
      macroWestFile: MACRO_WEST_FILE,
      canvasWestFile: CANVAS_WEST_FILE,
      canvasSouthFile: CANVAS_SOUTH_FILE,
      role: state.role,

      sameRuntimeExposureBeaconActive: true,
      strictInitializationSafetyActive: true,
      undefinedStateReferenceCorrectionActive: true,
      servedDetectionRepairActive: true,
      parentV10_3DispatchRecognitionActive: true,
      routeConductorV8_2AlignmentActive: true,
      macroWestV4_2ReleaseChainRecognized: true,
      earlyApiSurfaceActive: true,
      aliasStationActive: true,
      datasetFirstProofActive: true,
      receiptFirstProofActive: true,
      routeConductorNotificationActive: true,
      synchronousHeldPacketActive: true,
      atlasSourceActive: true,
      parentReturnNodeActive: true,

      canvasChildSequence: CANVAS_CHILD_SEQUENCE.slice(),

      apiSurfacePublished: state.apiSurfacePublished,
      aliasesPublished: state.aliasesPublished,
      datasetFirstProofPublished: state.datasetFirstProofPublished,
      receiptsPublished: state.receiptsPublished,
      routeConductorNotificationAttempted: state.routeConductorNotificationAttempted,
      routeConductorNotificationAccepted: state.routeConductorNotificationAccepted,
      routeConductorNotificationError: state.routeConductorNotificationError,

      requiredApiSurfaceComplete: true,
      requiredMethods: REQUIRED_METHODS.slice(),

      buildAtlasAvailable: true,
      buildAtlasSyncAvailable: true,
      buildAtlasAsyncAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getAtlasAvailable: true,
      getAtlasCanvasAvailable: true,
      getAtlasPacketAvailable: true,
      getReceiptAvailable: true,
      getReceiptLightAvailable: true,
      getReceiptTextAvailable: true,
      receiveParentDispatchPacketAvailable: true,

      canvasEastPresent: true,
      canvasEastCurrent: true,
      canvasEastReady: true,
      canvasEastApiReady: true,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,

      parentObserved: state.parentObserved,
      parentApiPresent: state.parentApiPresent,
      parentCallable: state.parentCallable,
      parentReceiptObserved: state.parentReceiptObserved,
      parentContract: state.parentContract,
      parentReceiptId: state.parentReceiptId,
      currentParentIsV10_3: state.currentParentIsV10_3,
      parentReleaseObserved: state.parentReleaseObserved,
      parentReleaseAccepted: state.parentReleaseAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      parentAcceptedRouteConductorRelease: state.parentAcceptedRouteConductorRelease,
      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      parentCorruptOrStale: state.parentCorruptOrStale,
      parentAbsent: state.parentAbsent,

      eastDispatchAuthorized: state.eastDispatchAuthorized,
      eastDispatchPacketPublished: state.eastDispatchPacketPublished,
      eastDispatchPacketObserved: state.eastDispatchPacketObserved,
      eastDispatchPacketValid: state.eastDispatchPacketValid,
      eastDispatchPacketAccepted: state.eastDispatchPacketAccepted,
      eastDispatchPacketSource: state.eastDispatchPacketSource,
      eastDispatchReceivedFrom: state.eastDispatchReceivedFrom,
      eastDispatchHandoffTo: state.eastDispatchHandoffTo,
      eastDispatchCycleNumber: state.eastDispatchCycleNumber,
      eastDispatchCycleRoute: state.eastDispatchCycleRoute,
      eastDispatchParentContract: state.eastDispatchParentContract,
      eastDispatchTargetFile: state.eastDispatchTargetFile,
      eastDispatchAtlasBuildRequested: state.eastDispatchAtlasBuildRequested,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractObserved: state.routeConductorContractObserved,
      routeConductorReceiptObserved: state.routeConductorReceiptObserved,
      routeConductorCentralStationActive: state.routeConductorCentralStationActive,

      westReleaseObserved: state.westReleaseObserved,
      westAuditObserved: state.westAuditObserved,
      westAuditPassed: state.westAuditPassed,
      westAuditBlocked: state.westAuditBlocked,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,

      permissionClass: state.permissionClass,
      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,

      heldAtlasPacketReturned: state.heldAtlasPacketReturned,
      synchronousHeldPacketActive: true,
      heldPacketWasSynchronous: state.heldPacketWasSynchronous,
      buildAtlasReturnedPromise: state.buildAtlasReturnedPromise,
      heldDoesNotMeanApiMissing: true,

      newsAlignmentProtocolActive: true,
      newsChronologicalOrderLocked: true,
      newsFinalizedByCanvasEast: false,
      chronology: CHRONOLOGY.slice(),
      chronologicalGateCount: state.chronologicalGateCount,
      chronologicalGatesSatisfied: state.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: state.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: state.chronologicalFirstFailedCoordinate,

      fibonacciSynchronizationChronologyFirst: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationExpected: 100,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationPassed: state.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,
      fibonacciSynchronizationHardFail: state.fibonacciSynchronizationHardFail,
      fibonacciSynchronizationHoldReason: state.fibonacciSynchronizationHoldReason,

      activeCycleNumber: state.activeCycleNumber,
      activeCycleRoute: state.activeCycleRoute,
      activeCardinal: state.activeCardinal,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      activeF13EGate: F13E_GATE,
      activeF13FGate: F13F_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeNewsGate: state.activeNewsGate,

      indexGateReady: state.indexGateReady,
      routeF8GateReady: state.routeF8GateReady,
      macroWestGateReady: state.macroWestGateReady,
      canvasParentGateReady: state.canvasParentGateReady,
      canvasParentReleaseGateReady: state.canvasParentReleaseGateReady,
      canvasParentEastDispatchGateReady: state.canvasParentEastDispatchGateReady,
      canvasEastGateReady: state.canvasEastGateReady,
      canvasEastEvidenceGateReady: state.canvasEastEvidenceGateReady,
      canvasWestGateReady: state.canvasWestGateReady,
      canvasSouthGateReady: state.canvasSouthGateReady,
      canvasGateReady: false,
      northGateReady: false,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: false,

      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialVersion: state.materialVersion,
      materialRole: state.materialRole,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canvasEastDoesNotOwnMaterialTruth: true,
      canvasStillDoesNotOwnPlanetTruth: true,

      atlasBuildRequested: state.atlasBuildRequested,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      atlasBuildError: state.atlasBuildError,
      atlasCanvasPresent: state.atlasCanvasPresent,
      atlasWidth: state.atlasWidth,
      atlasHeight: state.atlasHeight,
      atlasPixelCount: state.atlasPixelCount,
      atlasTotalSampleCount: state.atlasTotalSampleCount,
      atlasLandSampleCount: state.atlasLandSampleCount,
      atlasWaterSampleCount: state.atlasWaterSampleCount,
      atlasCoastSampleCount: state.atlasCoastSampleCount,
      atlasReliefSampleCount: state.atlasReliefSampleCount,
      atlasClassCount: state.atlasClassCount,
      atlasClasses: state.atlasClasses.slice(),

      fallbackSampleAvailable: true,
      fallbackSampleUsedAtRuntime: state.fallbackSampleUsedAtRuntime,
      emergencyFallbackUsed: state.emergencyFallbackUsed,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlinesReadFromHydrologyAndMaterials: true,

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      nextConsumerFile: PARENT_FILE,

      ownsSourceMaterialAtlas: true,
      ownsBuildAtlasMethod: true,
      ownsSampleMethod: true,
      ownsReadMethod: true,
      ownsReceiptSurface: true,
      ownsParentDispatchRecognition: true,
      ownsSynchronousHeldPacket: true,
      ownsSameRuntimeExposureBeacon: true,

      ownsPlanetTruth: false,
      ownsElevationTruth: false,
      ownsHydrologyTruth: false,
      ownsMaterialTruth: false,
      ownsTextureComposition: false,
      ownsSphereRendering: false,
      ownsVisibleProof: false,
      ownsRuntimeTableGovernance: false,
      ownsRouteOrchestration: false,
      ownsNewsFinalization: false,
      ownsCanvasRelease: false,
      ownsWestAudit: false,
      ownsF21: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      completionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      localEventCount: state.localEvents.length,
      errorCount: state.errors.length,
      publishedAt: state.publishedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      parentAuthorityProfile: clonePlain(state.lastParentAuthorityProfile),
      eastDispatchState: clonePlain(state.lastDispatchPacket),
      westReleaseState: clonePlain(state.lastWestReleaseState),
      permissionPacket: clonePlain(state.lastPermissionPacket),
      heldAtlasPacket: clonePlain(state.lastHeldAtlasPacket),
      atlasPacket: clonePlain(state.lastAtlasPacket),
      materialReceiptBridge: getMaterialBridgeReceipt({ sync: false }),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors)
    };
  }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_RECEIPT",
      "",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("baselineContract", r.baselineContract),
      line("legacyBaselineContract", r.legacyBaselineContract),
      line("currentParentContract", r.currentParentContract),
      line("routeConductorContract", r.routeConductorContract),
      line("macroWestContract", r.macroWestContract),
      line("version", r.version),
      line("file", r.file),
      line("parentFile", r.parentFile),
      line("routeFile", r.routeFile),
      line("macroWestFile", r.macroWestFile),
      line("role", r.role),
      "",
      line("sameRuntimeExposureBeaconActive", r.sameRuntimeExposureBeaconActive),
      line("strictInitializationSafetyActive", r.strictInitializationSafetyActive),
      line("undefinedStateReferenceCorrectionActive", r.undefinedStateReferenceCorrectionActive),
      line("servedDetectionRepairActive", r.servedDetectionRepairActive),
      line("parentV10_3DispatchRecognitionActive", r.parentV10_3DispatchRecognitionActive),
      line("routeConductorV8_2AlignmentActive", r.routeConductorV8_2AlignmentActive),
      line("macroWestV4_2ReleaseChainRecognized", r.macroWestV4_2ReleaseChainRecognized),
      "",
      line("apiSurfacePublished", r.apiSurfacePublished),
      line("aliasesPublished", r.aliasesPublished),
      line("datasetFirstProofPublished", r.datasetFirstProofPublished),
      line("receiptsPublished", r.receiptsPublished),
      line("routeConductorNotificationAttempted", r.routeConductorNotificationAttempted),
      line("routeConductorNotificationAccepted", r.routeConductorNotificationAccepted),
      "",
      line("requiredApiSurfaceComplete", r.requiredApiSurfaceComplete),
      line("buildAtlasAvailable", r.buildAtlasAvailable),
      line("buildAtlasSyncAvailable", r.buildAtlasSyncAvailable),
      line("buildAtlasAsyncAvailable", r.buildAtlasAsyncAvailable),
      line("sampleAvailable", r.sampleAvailable),
      line("readAvailable", r.readAvailable),
      line("getReceiptAvailable", r.getReceiptAvailable),
      line("receiveParentDispatchPacketAvailable", r.receiveParentDispatchPacketAvailable),
      line("canvasEastApiReady", r.canvasEastApiReady),
      line("canvasEastEvidenceReady", r.canvasEastEvidenceReady),
      "",
      line("canvasChildSequence", CANVAS_CHILD_SEQUENCE.join("__")),
      line("activeCycleNumber", r.activeCycleNumber),
      line("activeCycleRoute", r.activeCycleRoute),
      line("activeCardinal", r.activeCardinal),
      line("activeFibonacciGate", r.activeFibonacciGate),
      line("activeF13EGate", r.activeF13EGate),
      line("activeF13FGate", r.activeF13FGate),
      "",
      line("parentObserved", r.parentObserved),
      line("parentContract", r.parentContract),
      line("currentParentIsV10_3", r.currentParentIsV10_3),
      line("parentReleaseAccepted", r.parentReleaseAccepted),
      line("parentReleaseLawful", r.parentReleaseLawful),
      line("canvasParentReleaseGateReady", r.canvasParentReleaseGateReady),
      line("parentAcceptedRouteConductorRelease", r.parentAcceptedRouteConductorRelease),
      line("parentReleasePacketSentToEast", r.parentReleasePacketSentToEast),
      line("parentReleasePacketLawful", r.parentReleasePacketLawful),
      line("eastDispatchAuthorized", r.eastDispatchAuthorized),
      line("eastDispatchPacketPublished", r.eastDispatchPacketPublished),
      "",
      line("eastDispatchPacketObserved", r.eastDispatchPacketObserved),
      line("eastDispatchPacketValid", r.eastDispatchPacketValid),
      line("eastDispatchPacketAccepted", r.eastDispatchPacketAccepted),
      line("eastDispatchPacketSource", r.eastDispatchPacketSource),
      line("eastDispatchReceivedFrom", r.eastDispatchReceivedFrom),
      line("eastDispatchHandoffTo", r.eastDispatchHandoffTo),
      line("eastDispatchCycleNumber", r.eastDispatchCycleNumber),
      line("eastDispatchCycleRoute", r.eastDispatchCycleRoute),
      line("eastDispatchTargetFile", r.eastDispatchTargetFile),
      "",
      line("westReleaseObserved", r.westReleaseObserved),
      line("westCanvasReleaseApproved", r.westCanvasReleaseApproved),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      "",
      line("permissionClass", r.permissionClass),
      line("canvasEastMayBuildAtlas", r.canvasEastMayBuildAtlas),
      line("f13BuildLawful", r.f13BuildLawful),
      line("f13BuildBlockedReason", r.f13BuildBlockedReason),
      line("f13PermissionSource", r.f13PermissionSource),
      "",
      line("heldAtlasPacketReturned", r.heldAtlasPacketReturned),
      line("synchronousHeldPacketActive", r.synchronousHeldPacketActive),
      line("heldPacketWasSynchronous", r.heldPacketWasSynchronous),
      line("heldDoesNotMeanApiMissing", r.heldDoesNotMeanApiMissing),
      "",
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
      line("atlasBuildRequested", r.atlasBuildRequested),
      line("atlasBuildStarted", r.atlasBuildStarted),
      line("atlasBuildProgress", r.atlasBuildProgress),
      line("atlasBuildComplete", r.atlasBuildComplete),
      line("atlasCanvasPresent", r.atlasCanvasPresent),
      line("f13SourceStageStarted", r.f13SourceStageStarted),
      line("f13SourceStageComplete", r.f13SourceStageComplete),
      line("f13AtlasPacketReady", r.f13AtlasPacketReady),
      "",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("nextConsumerFile", r.nextConsumerFile),
      "",
      line("visibleProof", false),
      line("visibleContentProof", false),
      line("visiblePlanetAvailable", false),
      line("canvasReady", false),
      line("readyTextAllowed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByCanvasEast", false),
      line("readyTextClaimedByCanvasEast", false),
      line("completionLatched", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function boot(options = {}) {
    publishApiSurface("boot-entry");

    if (!booted) {
      booted = true;
      state.updatedAt = nowIso();

      try {
        readRouteConductorProfile(options);
        readParentAuthorityProfile(options);
        readWestReleaseState(options);
        readParentEastDispatchPacket(options);
        resolveAtlasBuildPermission(options);
      } catch (error) {
        recordError("BOOT_PROFILE_SCAN_FAILED_NONBLOCKING_AFTER_API_PUBLICATION", error, {
          apiAlreadyPublished: true,
          canvasEastApiReady: true
        });
      }

      recomputeChronology();
      publishApiSurface("boot-complete");

      recordLocal("CANVAS_EAST_V11_1_SAME_RUNTIME_EXPOSURE_BEACON_BOOTED", {
        file: FILE,
        contract: CONTRACT,
        receipt: RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        canvasEastApiReady: true,
        requiredApiSurfaceComplete: true,
        aliasesPublished: true,
        firstFailedCoordinate: state.firstFailedCoordinate,
        visualPassClaimed: false
      });
    }

    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    legacyBaselineContract: LEGACY_BASELINE_CONTRACT,
    legacyBaselineReceipt: LEGACY_BASELINE_RECEIPT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    currentParentContract: CURRENT_PARENT_CONTRACT,
    currentParentReceipt: CURRENT_PARENT_RECEIPT,
    routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
    routeConductorReceipt: ROUTE_CONDUCTOR_RECEIPT,
    macroWestContract: MACRO_WEST_CONTRACT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    routeFile: ROUTE_FILE,
    macroWestFile: MACRO_WEST_FILE,
    canvasWestFile: CANVAS_WEST_FILE,
    canvasSouthFile: CANVAS_SOUTH_FILE,

    REQUIRED_METHODS,
    PUBLIC_ALIAS_PATHS,
    PUBLIC_NESTED_ALIAS_PATHS,
    CANVAS_CHILD_SEQUENCE,
    PERMISSION,
    CHRONOLOGY,

    boot,
    init: boot,
    start: boot,
    mount: boot,

    buildAtlas,
    buildAtlasSync,
    buildAtlasAsync,
    sample,
    read,

    getAtlas,
    getAtlasCanvas,
    getAtlasPacket,
    getLastAtlasImageData,

    publishApiSurface,
    publishGlobals: publishApiSurface,
    publishAliasStation,
    publishDatasetFirstProof,
    publishReceipts,
    notifyRouteConductor,

    readParentAuthorityProfile,
    readParentState: readParentAuthorityProfile,
    readParentEastDispatchPacket,
    readEastDispatchPacket: readParentEastDispatchPacket,
    readWestReleaseState,
    resolveAtlasBuildPermission,
    composeAtlasBuildPermissionPacket: resolveAtlasBuildPermission,
    composeHeldAtlasPacket,
    composeAtlasEvidencePacket,

    receiveParentDispatchPacket,
    receiveEastDispatchPacket: receiveParentDispatchPacket,
    receiveDispatchPacket: receiveParentDispatchPacket,
    receiveParentPacket: receiveParentDispatchPacket,
    receiveReleasePacket: receiveParentDispatchPacket,
    receiveCanvasParentPacket: receiveParentDispatchPacket,

    getMaterialBridgeReceipt,
    refreshMaterialBridge,
    invalidateAtlas,

    getReceipt,
    getReceiptLight,
    getReceiptText,

    sameRuntimeExposureBeaconActive: true,
    strictInitializationSafetyActive: true,
    undefinedStateReferenceCorrectionActive: true,
    servedDetectionRepairActive: true,
    parentV10_3DispatchRecognitionActive: true,
    routeConductorV8_2AlignmentActive: true,
    macroWestV4_2ReleaseChainRecognized: true,
    earlyApiSurfaceActive: true,
    aliasStationActive: true,
    datasetFirstProofActive: true,
    receiptFirstProofActive: true,
    routeConductorNotificationActive: true,
    synchronousHeldPacketActive: true,
    atlasSourceActive: true,

    requiredApiSurfaceComplete: true,
    buildAtlasAvailable: true,
    buildAtlasSyncAvailable: true,
    buildAtlasAsyncAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getAtlasAvailable: true,
    getAtlasCanvasAvailable: true,
    getAtlasPacketAvailable: true,
    getReceiptAvailable: true,
    getReceiptLightAvailable: true,
    getReceiptTextAvailable: true,
    receiveParentDispatchPacketAvailable: true,
    canvasEastPresent: true,
    canvasEastCurrent: true,
    canvasEastReady: true,
    canvasEastApiReady: true,

    ownsSourceMaterialAtlas: true,
    ownsBuildAtlasMethod: true,
    ownsSampleMethod: true,
    ownsReadMethod: true,
    ownsReceiptSurface: true,
    ownsParentDispatchRecognition: true,
    ownsSynchronousHeldPacket: true,
    ownsSameRuntimeExposureBeacon: true,

    ownsPlanetTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsTextureComposition: false,
    ownsSphereRendering: false,
    ownsVisibleProof: false,
    ownsRuntimeTableGovernance: false,
    ownsRouteOrchestration: false,
    ownsNewsFinalization: false,
    ownsCanvasRelease: false,
    ownsWestAudit: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    visibleProof: false,
    visibleContentProof: false,
    visiblePlanetAvailable: false,
    canvasReady: false,
    readyTextAllowed: false,
    f21EligibleForNorth: false,
    f21ClaimedByCanvasEast: false,
    readyTextClaimedByCanvasEast: false,
    completionLatched: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      return state;
    }
  });

  try {
    state.updatedAt = nowIso();

    publishAliasStation();
    publishDatasetFirstProof({ quiet: true });
    publishReceipts();
    notifyRouteConductor("initial-same-runtime-exposure-before-any-scan");

    try {
      refreshMaterialBridge({ updateDataset: false });
    } catch (materialError) {
      recordError("MATERIAL_BRIDGE_SYNC_NONBLOCKING_FAILURE_API_STILL_READY", materialError, {
        apiAlreadyPublished: true,
        canvasEastApiReady: true
      });
    }

    boot({});
  } catch (error) {
    recordError("CANVAS_EAST_V11_1_INITIALIZATION_GUARD_CAUGHT_AFTER_PUBLICATION", error, {
      attemptedAliasPublication: true
    });

    try {
      publishAliasStation();
      publishDatasetFirstProof({ quiet: true });
      publishReceipts();
      notifyRouteConductor("fallback-publication-after-initialization-guard");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
