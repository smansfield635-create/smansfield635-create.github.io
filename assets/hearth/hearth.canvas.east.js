// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_TNT_v11_4
// Full-file replacement.
// Canvas East / current Local Station v11_1 API-publication / atlas-source child.
//
// Supersedes:
// - HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_TNT_v11_3
//
// Baseline reference only:
// - HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_TNT_v10
//
// Current served chain:
// - Route Conductor: HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2
// - Macro West: LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_TNT_v4_6_3
// - Canvas Local Station: HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1 / v11
//
// Purpose:
// - Publish Canvas East API immediately and redundantly in the same served runtime.
// - Preserve strict separation between East-owned diagnostics and upstream proof.
// - Cache material authority before atlas loops; do not rediscover material authority per pixel.
// - Require exact Route Conductor v9_2 recognition before atlas-build permission.
// - Require exact Macro West v4_6_3 release recognition before atlas-build permission.
// - Bind East to current Canvas Local Station v11_1/v11, not obsolete v10_3 parent-current law.
// - Treat v10_3 as baseline-only/historical parent-chain reference.
// - Keep API readiness separate from atlas/evidence readiness.
// - Return synchronous held atlas packets when dispatch/evidence is absent or incomplete.
// - Never claim F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_TNT_v11_4";
  const RECEIPT = "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_RECEIPT_v11_4";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_TNT_v11_3";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_RECEIPT_v11_3";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_TNT_v10";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_RECEIPT_v10";

  const ROUTE_CONDUCTOR_CURRENT_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2";
  const ROUTE_CONDUCTOR_CURRENT_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_RECEIPT_v9_2";

  const MACRO_WEST_CURRENT_CONTRACT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_TNT_v4_6_3";
  const MACRO_WEST_CURRENT_RECEIPT = "LAB_RUNTIME_TABLE_CARDINAL_WEST_NORTH_TIMETABLE_ALIGNED_LOCAL_ADMISSIBILITY_CLUTCH_RECEIPT_v4_6_3";

  const LOCAL_STATION_V11_1_CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1";
  const LOCAL_STATION_V11_CONTRACT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11";
  const LOCAL_STATION_V11_1_RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT_v11_1";
  const LOCAL_STATION_V11_RECEIPT = "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_RECEIPT_v11";

  const V10_3_BASELINE_CONTRACT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3";
  const V10_3_BASELINE_RECEIPT = "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_RECEIPT_v10_3";

  const FILE = "/assets/hearth/hearth.canvas.east.js";
  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const MACRO_WEST_FILE = "/assets/lab/runtime-table.west.js";
  const CANVAS_WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const CANVAS_SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";
  const ROUTE = "/showroom/globe/hearth/";

  const ACTIVE_CYCLE_NUMBER = 2;
  const ACTIVE_CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const ACTIVE_CARDINAL = "EAST";
  const ACTIVE_STAGE_ID = "C2_CANVAS_EAST_API_PUBLICATION_AND_ATLAS_SOURCE";
  const ACTIVE_GEAR = "GEAR_C2_CANVAS_EAST_API_PUBLICATION";
  const ACTIVE_FIBONACCI = "F13E";
  const ACTIVE_NEWS_GATE = "EAST";

  const VERSION = "2026-06-02.hearth-canvas-east-current-local-station-v11-1-api-publication-v11-4";

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
    "readEastDiagnosticDataset",
    "readUpstreamDatasetProof",
    "receiveParentDispatchPacket",
    "receiveEastDispatchPacket",
    "receiveDispatchPacket",
    "receiveParentPacket",
    "receiveReleasePacket",
    "receiveCanvasParentPacket"
  ]);

  const CANVAS_CHILD_SEQUENCE = Object.freeze([
    "CANVAS_EAST_ATLAS_SOURCE",
    "CANVAS_WEST_INSPECTION_VIEW",
    "CANVAS_SOUTH_VISIBLE_PROOF",
    "CANVAS_LOCAL_STATION_F13_AGGREGATE"
  ]);

  const CHRONOLOGY = Object.freeze([
    "INDEX_CARRIER_HOST_READY",
    "ROUTE_F8_SELF_DUTY_READY",
    "MACRO_WEST_RELEASE_TO_CANVAS",
    "CANVAS_LOCAL_STATION_RELEASE_ACCEPTED",
    "CANVAS_LOCAL_STATION_EAST_DISPATCH_PUBLISHED",
    "CANVAS_EAST_API_VISIBLE",
    "CANVAS_EAST_ATLAS_EVIDENCE_READY",
    "CANVAS_WEST_INSPECTION_READY",
    "CANVAS_SOUTH_VISIBLE_PROOF_READY",
    "NORTH_F21_REVIEW_ONLY"
  ]);

  const PERMISSION = Object.freeze({
    BUILD_ALLOWED_LOCAL_STATION_DISPATCH: "BUILD_ALLOWED_LOCAL_STATION_DISPATCH",
    HELD_ROUTE_CONDUCTOR_PENDING: "HELD_ROUTE_CONDUCTOR_PENDING",
    HELD_LOCAL_STATION_PENDING: "HELD_LOCAL_STATION_PENDING",
    HELD_RELEASE_PENDING: "HELD_RELEASE_PENDING",
    HELD_EAST_DISPATCH_PENDING: "HELD_EAST_DISPATCH_PENDING",
    HELD_EAST_DISPATCH_MALFORMED: "HELD_EAST_DISPATCH_MALFORMED",
    HELD_ATLAS_EVIDENCE_PENDING: "HELD_ATLAS_EVIDENCE_PENDING",
    BLOCKED_FALSE_PROMOTION: "BLOCKED_FALSE_PROMOTION"
  });

  const PALETTE = Object.freeze({
    deepWater: [4, 14, 32],
    water: [12, 52, 92],
    shelf: [37, 93, 111],
    coast: [113, 103, 72],
    land: [78, 110, 68],
    highland: [122, 116, 80],
    ridge: [152, 139, 102],
    canyon: [72, 48, 38],
    peak: [186, 181, 156],
    ice: [202, 219, 225]
  });

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;

  const api = {};
  let atlasCanvas = null;
  let lastAtlasImageData = null;
  let cachedMaterialAuthority = null;
  let cachedMaterialSampler = null;
  let cachedMaterialReceipt = null;
  let notificationQueued = false;
  let booted = false;
  let publishDepth = 0;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    parentFile: PARENT_FILE,
    routeFile: ROUTE_FILE,
    macroWestFile: MACRO_WEST_FILE,
    canvasWestFile: CANVAS_WEST_FILE,
    canvasSouthFile: CANVAS_SOUTH_FILE,
    route: ROUTE,
    version: VERSION,
    role: "canvas-east-current-local-station-v11-1-api-publication",

    currentRouteConductorContract: ROUTE_CONDUCTOR_CURRENT_CONTRACT,
    currentMacroWestContract: MACRO_WEST_CURRENT_CONTRACT,
    currentCanvasLocalStationContracts: [LOCAL_STATION_V11_1_CONTRACT, LOCAL_STATION_V11_CONTRACT],
    v10_3BaselineContract: V10_3_BASELINE_CONTRACT,

    currentLocalStationV11_1ApiPublicationActive: true,
    sameRuntimeExposureBeaconActive: true,
    strictInitializationSafetyActive: true,
    noDuplicateRootIdentifier: true,
    datasetSelfContaminationBlocked: true,
    materialAuthorityCachedForAtlasLoop: true,
    emptyContractFalseRecognitionBlocked: true,
    routeConductorPermissionGateEnforced: true,
    localStationV11OrV11_1CurrentPassActive: true,
    v10_3BaselineRecognizedOnly: true,

    routeConductorObserved: false,
    routeConductorContractKnown: false,
    routeConductorContractRecognized: false,
    routeConductorV9_2Recognized: false,

    macroWestObserved: false,
    macroWestContractKnown: false,
    macroWestContractRecognized: false,
    macroWestV4_6_3ReleaseRecognized: false,

    canvasLocalStationV11_1Recognized: false,
    canvasLocalStationV11Recognized: false,

    apiSurfacePublished: false,
    aliasesPublished: false,
    datasetFirstProofPublished: false,
    receiptsPublished: false,
    routeConductorNotificationAttempted: false,
    routeConductorNotificationAccepted: false,
    routeConductorNotificationError: "",

    activeCycleNumber: ACTIVE_CYCLE_NUMBER,
    activeCycleRoute: ACTIVE_CYCLE_ROUTE,
    activeCardinal: ACTIVE_CARDINAL,
    activeStageId: ACTIVE_STAGE_ID,
    activeGear: ACTIVE_GEAR,
    activeFibonacci: ACTIVE_FIBONACCI,
    activeNewsGate: ACTIVE_NEWS_GATE,

    canvasEastPresent: true,
    canvasEastCurrent: true,
    canvasEastReady: true,
    canvasEastApiReady: true,
    canvasEastEvidenceReady: false,
    requiredApiSurfaceComplete: true,
    heldDoesNotMeanApiMissing: true,

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

    canvasLocalStationObserved: false,
    canvasLocalStationContractKnown: false,
    canvasLocalStationApiReady: false,
    canvasLocalStationContract: "",
    canvasLocalStationContractAccepted: false,
    canvasLocalStationSummaryObserved: false,
    canvasLocalStationSummaryMethod: "NONE",
    currentCanvasParentObserved: false,
    currentCanvasParentContract: "",
    currentCanvasParentIsLocalStation: false,
    canvasParentV10_3BaselineRecognized: false,
    canvasLocalStationReleaseAccepted: false,
    canvasLocalStationReleaseLawful: false,
    canvasLocalStationReleasePacketSentToEast: false,

    westReleaseObserved: false,
    westDecision: "",
    westHardBlock: false,
    westCanvasReleaseApproved: false,
    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,

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
    eastDispatchTargetFile: "",

    permissionClass: PERMISSION.HELD_ATLAS_EVIDENCE_PENDING,
    canvasEastMayBuildAtlas: false,
    f13BuildLawful: false,
    f13BuildBlockedReason: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
    f13PermissionSource: "NONE",

    heldAtlasPacketReturned: false,
    heldPacketWasSynchronous: false,
    buildAtlasReturnedPromise: false,

    atlasBuildRequested: false,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasBuildError: "",
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

    f13SourceStageStarted: false,
    f13SourceStageComplete: false,
    f13AtlasPacketReady: false,

    materialReceiptBridgeActive: false,
    materialContract: "",
    materialReceipt: "",
    materialAuthorityCached: false,
    materialAuthorityScanCount: 0,
    materialAuthorityScanDuringAtlasLoopBlocked: true,
    canonicalMaterialAuthorityPresent: false,
    canonicalMaterialConsumed: false,
    fallbackSampleAvailable: true,
    fallbackSampleUsedAtRuntime: false,
    emergencyFallbackUsed: false,

    chronologicalGateCount: CHRONOLOGY.length,
    chronologicalGatesSatisfied: 6,
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

    firstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    nextConsumerFile: PARENT_FILE,

    lastEastDiagnosticDataset: null,
    lastUpstreamDatasetProof: null,
    lastCanvasLocalStationSummary: null,
    lastRouteConductorState: null,
    lastWestReleaseState: null,
    lastDispatchPacket: null,
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
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByCanvasEast: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  function getRoot() {
    if (typeof window !== "undefined") return window;
    if (typeof globalThis !== "undefined") return globalThis;
    return {};
  }

  function getDocument() {
    const root = getRoot();
    return root.document || null;
  }

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

  function firstDefined(...values) {
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function objectValue(source, path, fallback = undefined) {
    if (!source || typeof source !== "object") return fallback;
    const parts = String(path || "").split(".");
    let cursor = source;

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (!cursor || typeof cursor !== "object" || cursor[part] === undefined || cursor[part] === null) return fallback;
      cursor = cursor[part];
    }

    return cursor;
  }

  function pathRead(path) {
    const root = getRoot();
    const parts = String(path || "").split(".");
    let cursor = root;

    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function datasetValue(key, fallback = "") {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readDatasetObject() {
    const doc = getDocument();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset || {};
  }

  function readEastDiagnosticDataset() {
    const ds = readDatasetObject();
    const packet = {};
    Object.keys(ds).forEach((key) => {
      if (key.indexOf("hearthCanvasEast") === 0) packet[key] = ds[key];
    });

    state.lastEastDiagnosticDataset = clonePlain(packet);
    return packet;
  }

  function readUpstreamDatasetProof() {
    const ds = readDatasetObject();

    function read(key) {
      if (key.indexOf("hearthCanvasEast") === 0) return "";
      const value = ds[key];
      return value === undefined || value === null || value === "" ? "" : value;
    }

    const packet = {
      canvasLocalStationContract: firstDefined(
        read("hearthCanvasLocalStationContract"),
        read("hearthCanvasCurrentCanvasStationContract"),
        read("hearthCanvasCurrentCanvasParentContract"),
        read("currentCanvasParentContract"),
        read("canvasLocalStationContract"),
        read("currentCanvasStationContract"),
        read("hearthCanvasContract")
      ) || "",
      canvasLocalStationReceipt: firstDefined(
        read("hearthCanvasLocalStationReceipt"),
        read("hearthCanvasCurrentCanvasStationReceipt"),
        read("hearthCanvasCurrentCanvasParentReceipt"),
        read("currentCanvasParentReceipt"),
        read("canvasLocalStationReceipt"),
        read("currentCanvasStationReceipt"),
        read("hearthCanvasReceipt")
      ) || "",
      canvasReleaseAuthorized: read("hearthCanvasReleaseAuthorized"),
      canvasReleasePacketReady: read("hearthCanvasReleasePacketReady"),
      canvasLocalStationReleaseAccepted: firstDefined(
        read("hearthCanvasReleasePacketAccepted"),
        read("hearthCanvasParentReleaseAccepted"),
        read("canvasLocalStationReleaseAccepted")
      ) || "",
      eastDispatchPacketGlobalHint: firstDefined(
        read("canvasEastDispatchPacketPublished"),
        read("canvasEastDispatchAuthorized")
      ) || "",
      westContract: firstDefined(
        read("hearthWestRuntimeTableContract"),
        read("labRuntimeTableWestContract")
      ) || "",
      westDecision: read("hearthWestDecision"),
      westHardBlock: read("hearthWestHardBlock"),
      westCanvasReleaseApproved: read("hearthWestCanvasReleaseApproved"),
      routeConductorContract: read("hearthRouteConductorContract")
    };

    state.lastUpstreamDatasetProof = clonePlain(packet);
    return packet;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getReceiptLight",
      "getReceipt",
      "getStatus"
    ];

    for (let i = 0; i < methods.length; i += 1) {
      const method = methods[i];
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
          ? authority[method](false)
          : authority[method]();

        if (isObject(result)) {
          result.__sourceMethod = method;
          return result;
        }
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.CONTRACT || authority.RECEIPT) return authority;

    return null;
  }

  function firstGlobal(paths) {
    for (let i = 0; i < paths.length; i += 1) {
      const found = pathRead(paths[i]);
      if (found) return found;
    }
    return null;
  }

  function ensureNamespaces() {
    const root = getRoot();
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};
    return root;
  }

  function blockFinalClaims() {
    state.visibleProof = false;
    state.visibleContentProof = false;
    state.visiblePlanetAvailable = false;
    state.canvasReady = false;
    state.readyTextAllowed = false;
    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21EligibilitySubmittedToNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.finalCompletionLatched = false;
    state.degradedCompletionLatched = false;
    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;
    state.visualPassClaimed = false;
  }

  function recordLocal(event, detail = {}) {
    state.localEvents.push({
      at: nowIso(),
      event: safeString(event, "CANVAS_EAST_EVENT"),
      detail: clonePlain(detail)
    });

    if (state.localEvents.length > 160) state.localEvents.splice(0, state.localEvents.length - 160);
    state.updatedAt = nowIso();
  }

  function recordError(code, error, detail = {}) {
    state.errors.push({
      at: nowIso(),
      code: safeString(code, "CANVAS_EAST_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    });

    if (state.errors.length > 100) state.errors.splice(0, state.errors.length - 100);
    state.updatedAt = nowIso();
  }

  function isCurrentLocalStationContract(contract) {
    return contract === LOCAL_STATION_V11_1_CONTRACT || contract === LOCAL_STATION_V11_CONTRACT;
  }

  function detectFalsePromotion(input = {}) {
    return Boolean(
      safeBool(input.visualPassClaimed, false) ||
      safeBool(input.readyTextAllowed, false) ||
      safeBool(input.f21EligibleForNorth, false) ||
      safeBool(input.f21SubmittedToNorth, false) ||
      safeBool(input.f21EligibilitySubmittedToNorth, false) ||
      safeBool(input.completionLatched, false) ||
      safeBool(input.finalCompletionLatched, false) ||
      safeBool(input.degradedCompletionLatched, false) ||
      safeBool(input.canvasReady, false) ||
      safeBool(input.visibleProof, false)
    );
  }

  function publishAliasStation() {
    const root = ensureNamespaces();

    const rootAliases = [
      "HEARTH_CANVAS_EAST",
      "HEARTH_CANVAS_EAST_SOURCE",
      "HEARTH_CANVAS_EAST_AUTHORITY",
      "HEARTH_CANVAS_EAST_EVIDENCE",
      "HEARTH_CANVAS_EAST_ENGINE",
      "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION",
      "HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION",
      "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR",
      "HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD"
    ];

    const hearthAliases = [
      "canvasEast",
      "canvasEastSource",
      "canvasEastAuthority",
      "canvasEastEvidence",
      "canvasEastEngine",
      "canvasEastCurrentLocalStationV111ApiPublication",
      "canvasEastSameRuntimeExposureBeaconApiPublication",
      "canvasEastParentV103DispatchApiRecognitionServedDetectionRepair",
      "canvasEastParentV103DispatchApiRecognitionAtlasSource",
      "canvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
      "canvasEastF13AtlasSourceChild",
      "canvasEastMaterialAtlasSourceMachine"
    ];

    const dexterAliases = [
      "hearthCanvasEast",
      "hearthCanvasEastSource",
      "hearthCanvasEastAuthority",
      "hearthCanvasEastEvidence",
      "hearthCanvasEastEngine",
      "hearthCanvasEastCurrentLocalStationV111ApiPublication",
      "hearthCanvasEastSameRuntimeExposureBeaconApiPublication",
      "hearthCanvasEastParentV103DispatchApiRecognitionServedDetectionRepair",
      "hearthCanvasEastParentV103DispatchApiRecognitionAtlasSource",
      "hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
      "hearthCanvasEastF13AtlasSourceChild",
      "hearthCanvasEastMaterialAtlasSourceMachine"
    ];

    rootAliases.forEach((name) => {
      root[name] = api;
    });

    hearthAliases.forEach((name) => {
      root.HEARTH[name] = api;
    });

    dexterAliases.forEach((name) => {
      root.DEXTER_LAB[name] = api;
    });

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
    root.__HEARTH_CANVAS_EAST_EVIDENCE_READY__ = Boolean(state.f13AtlasPacketReady);
    root.__HEARTH_CANVAS_EAST_VISUAL_PASS_CLAIMED__ = false;

    state.aliasesPublished = true;
    state.apiSurfacePublished = true;
    state.canvasEastApiReady = true;
    state.canvasEastReady = true;
    state.canvasEastCurrent = true;
    state.canvasEastPresent = true;
    state.requiredApiSurfaceComplete = true;

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

    setDataset("hearthCanvasEastLoaded", "true");
    setDataset("hearthCanvasEastPresent", "true");
    setDataset("hearthCanvasEastContract", CONTRACT);
    setDataset("hearthCanvasEastReceipt", RECEIPT);
    setDataset("hearthCanvasEastPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasEastBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasEastFile", FILE);
    setDataset("hearthCanvasEastVersion", VERSION);

    setDataset("hearthCanvasEastApiReady", "true");
    setDataset("hearthCanvasEastReady", "true");
    setDataset("hearthCanvasEastCurrent", "true");
    setDataset("hearthCanvasEastRequiredApiSurfaceComplete", "true");
    setDataset("hearthCanvasEastBuildAtlasAvailable", "true");
    setDataset("hearthCanvasEastSampleAvailable", "true");
    setDataset("hearthCanvasEastReadAvailable", "true");
    setDataset("hearthCanvasEastGetReceiptAvailable", "true");
    setDataset("hearthCanvasEastEvidenceReady", String(Boolean(state.f13AtlasPacketReady)));
    setDataset("hearthCanvasEastHeldDoesNotMeanApiMissing", "true");

    setDataset("hearthCanvasEastDatasetSelfContaminationBlocked", "true");
    setDataset("hearthCanvasEastMaterialAuthorityCachedForAtlasLoop", "true");
    setDataset("hearthCanvasEastEmptyContractFalseRecognitionBlocked", "true");
    setDataset("hearthCanvasEastRouteConductorPermissionGateEnforced", "true");
    setDataset("hearthCanvasEastV10_3BaselineRecognizedOnly", "true");

    setDataset("hearthCanvasEastRouteConductorObserved", String(Boolean(state.routeConductorObserved)));
    setDataset("hearthCanvasEastRouteConductorContractKnown", String(Boolean(state.routeConductorContractKnown)));
    setDataset("hearthCanvasEastRouteConductorContractRecognized", String(Boolean(state.routeConductorContractRecognized)));
    setDataset("hearthCanvasEastRouteConductorV9_2Recognized", String(Boolean(state.routeConductorV9_2Recognized)));

    setDataset("hearthCanvasEastMacroWestObserved", String(Boolean(state.macroWestObserved)));
    setDataset("hearthCanvasEastMacroWestContractKnown", String(Boolean(state.macroWestContractKnown)));
    setDataset("hearthCanvasEastMacroWestContractRecognized", String(Boolean(state.macroWestContractRecognized)));
    setDataset("hearthCanvasEastMacroWestV4_6_3ReleaseRecognized", String(Boolean(state.macroWestV4_6_3ReleaseRecognized)));

    setDataset("hearthCanvasEastActiveCycleNumber", String(ACTIVE_CYCLE_NUMBER));
    setDataset("hearthCanvasEastActiveCycleRoute", ACTIVE_CYCLE_ROUTE);
    setDataset("hearthCanvasEastActiveCardinal", ACTIVE_CARDINAL);
    setDataset("hearthCanvasEastActiveStageId", ACTIVE_STAGE_ID);
    setDataset("hearthCanvasEastActiveGear", ACTIVE_GEAR);
    setDataset("hearthCanvasEastActiveFibonacci", ACTIVE_FIBONACCI);
    setDataset("hearthCanvasEastActiveNewsGate", ACTIVE_NEWS_GATE);

    setDataset("hearthCanvasEastCanvasLocalStationObserved", String(Boolean(state.canvasLocalStationObserved)));
    setDataset("hearthCanvasEastCanvasLocalStationContractKnown", String(Boolean(state.canvasLocalStationContractKnown)));
    setDataset("hearthCanvasEastCanvasLocalStationApiReady", String(Boolean(state.canvasLocalStationApiReady)));
    setDataset("hearthCanvasEastCanvasLocalStationContract", state.canvasLocalStationContract);
    setDataset("hearthCanvasEastCanvasLocalStationContractAccepted", String(Boolean(state.canvasLocalStationContractAccepted)));
    setDataset("hearthCanvasEastCanvasLocalStationSummaryObserved", String(Boolean(state.canvasLocalStationSummaryObserved)));
    setDataset("hearthCanvasEastCanvasLocalStationSummaryMethod", state.canvasLocalStationSummaryMethod);
    setDataset("hearthCanvasEastCurrentCanvasParentObserved", String(Boolean(state.currentCanvasParentObserved)));
    setDataset("hearthCanvasEastCurrentCanvasParentContract", state.currentCanvasParentContract);
    setDataset("hearthCanvasEastCurrentCanvasParentIsLocalStation", String(Boolean(state.currentCanvasParentIsLocalStation)));
    setDataset("hearthCanvasEastCanvasParentV10_3BaselineRecognized", String(Boolean(state.canvasParentV10_3BaselineRecognized)));

    setDataset("hearthCanvasEastCanvasLocalStationReleaseAccepted", String(Boolean(state.canvasLocalStationReleaseAccepted)));
    setDataset("hearthCanvasEastCanvasLocalStationReleaseLawful", String(Boolean(state.canvasLocalStationReleaseLawful)));
    setDataset("hearthCanvasEastCanvasLocalStationReleasePacketSentToEast", String(Boolean(state.canvasLocalStationReleasePacketSentToEast)));

    setDataset("hearthCanvasEastWestReleaseObserved", String(Boolean(state.westReleaseObserved)));
    setDataset("hearthCanvasEastWestDecision", state.westDecision);
    setDataset("hearthCanvasEastWestHardBlock", String(Boolean(state.westHardBlock)));
    setDataset("hearthCanvasEastWestCanvasReleaseApproved", String(Boolean(state.westCanvasReleaseApproved)));
    setDataset("hearthCanvasEastCanvasReleaseAuthorized", String(Boolean(state.canvasReleaseAuthorized)));
    setDataset("hearthCanvasEastCanvasReleasePacketReady", String(Boolean(state.canvasReleasePacketReady)));

    setDataset("hearthCanvasEastDispatchAuthorized", String(Boolean(state.eastDispatchAuthorized)));
    setDataset("hearthCanvasEastDispatchPacketPublished", String(Boolean(state.eastDispatchPacketPublished)));
    setDataset("hearthCanvasEastDispatchPacketObserved", String(Boolean(state.eastDispatchPacketObserved)));
    setDataset("hearthCanvasEastDispatchPacketValid", String(Boolean(state.eastDispatchPacketValid)));
    setDataset("hearthCanvasEastDispatchPacketAccepted", String(Boolean(state.eastDispatchPacketAccepted)));
    setDataset("hearthCanvasEastDispatchPacketSource", state.eastDispatchPacketSource);

    setDataset("hearthCanvasEastPermissionClass", state.permissionClass);
    setDataset("hearthCanvasEastMayBuildAtlas", String(Boolean(state.canvasEastMayBuildAtlas)));
    setDataset("hearthCanvasEastF13BuildLawful", String(Boolean(state.f13BuildLawful)));
    setDataset("hearthCanvasEastF13BuildBlockedReason", state.f13BuildBlockedReason);
    setDataset("hearthCanvasEastF13PermissionSource", state.f13PermissionSource);

    setDataset("hearthCanvasEastHeldAtlasPacketReturned", String(Boolean(state.heldAtlasPacketReturned)));
    setDataset("hearthCanvasEastHeldPacketWasSynchronous", String(Boolean(state.heldPacketWasSynchronous)));
    setDataset("hearthCanvasEastBuildAtlasReturnedPromise", String(Boolean(state.buildAtlasReturnedPromise)));

    setDataset("hearthCanvasEastAtlasBuildRequested", String(Boolean(state.atlasBuildRequested)));
    setDataset("hearthCanvasEastAtlasBuildStarted", String(Boolean(state.atlasBuildStarted)));
    setDataset("hearthCanvasEastAtlasBuildProgress", String(state.atlasBuildProgress));
    setDataset("hearthCanvasEastAtlasBuildComplete", String(Boolean(state.atlasBuildComplete)));
    setDataset("hearthCanvasEastAtlasCanvasPresent", String(Boolean(state.atlasCanvasPresent)));
    setDataset("hearthCanvasEastAtlasWidth", String(state.atlasWidth));
    setDataset("hearthCanvasEastAtlasHeight", String(state.atlasHeight));
    setDataset("hearthCanvasEastF13SourceStageStarted", String(Boolean(state.f13SourceStageStarted)));
    setDataset("hearthCanvasEastF13SourceStageComplete", String(Boolean(state.f13SourceStageComplete)));
    setDataset("hearthCanvasEastF13AtlasPacketReady", String(Boolean(state.f13AtlasPacketReady)));

    setDataset("hearthCanvasEastMaterialAuthorityCached", String(Boolean(state.materialAuthorityCached)));
    setDataset("hearthCanvasEastMaterialAuthorityScanCount", String(state.materialAuthorityScanCount));
    setDataset("hearthCanvasEastMaterialAuthorityScanDuringAtlasLoopBlocked", "true");
    setDataset("hearthCanvasEastMaterialReceiptBridgeActive", String(Boolean(state.materialReceiptBridgeActive)));
    setDataset("hearthCanvasEastMaterialContract", state.materialContract);
    setDataset("hearthCanvasEastMaterialReceipt", state.materialReceipt);

    setDataset("hearthCanvasEastChronologicalGateCount", String(state.chronologicalGateCount));
    setDataset("hearthCanvasEastChronologicalGatesSatisfied", String(state.chronologicalGatesSatisfied));
    setDataset("hearthCanvasEastChronologicalFirstFailedGate", state.chronologicalFirstFailedGate);
    setDataset("hearthCanvasEastChronologicalFirstFailedCoordinate", state.chronologicalFirstFailedCoordinate);
    setDataset("hearthCanvasEastFibonacciSynchronizationScore", String(state.fibonacciSynchronizationScore));
    setDataset("hearthCanvasEastFibonacciSynchronizationExpected", String(state.fibonacciSynchronizationExpected));
    setDataset("hearthCanvasEastFibonacciSynchronizationSatisfied", String(state.fibonacciSynchronizationSatisfied));
    setDataset("hearthCanvasEastFibonacciSynchronizationPassed", String(Boolean(state.fibonacciSynchronizationPassed)));
    setDataset("hearthCanvasEastFibonacciSynchronizationDegraded", String(Boolean(state.fibonacciSynchronizationDegraded)));
    setDataset("hearthCanvasEastFibonacciSynchronizationHardFail", String(Boolean(state.fibonacciSynchronizationHardFail)));
    setDataset("hearthCanvasEastFibonacciSynchronizationHoldReason", state.fibonacciSynchronizationHoldReason);

    setDataset("hearthCanvasEastFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasEastRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasEastRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasEastNextConsumerFile", PARENT_FILE);

    setDataset("hearthCanvasEastVisibleProof", "false");
    setDataset("hearthCanvasEastVisibleContentProof", "false");
    setDataset("hearthCanvasEastVisiblePlanetAvailable", "false");
    setDataset("hearthCanvasEastCanvasReady", "false");
    setDataset("hearthCanvasEastF21EligibleForNorth", "false");
    setDataset("hearthCanvasEastF21SubmittedToNorth", "false");
    setDataset("hearthCanvasEastF21EligibilitySubmittedToNorth", "false");
    setDataset("hearthCanvasEastCompletionLatched", "false");
    setDataset("hearthCanvasEastReadyTextAllowed", "false");
    setDataset("hearthCanvasEastVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    if (!options.quiet) state.updatedAt = nowIso();
    return true;
  }

  function publishReceipts() {
    const root = ensureNamespaces();
    const light = getReceiptLight(false);

    root.HEARTH_CANVAS_EAST_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_RECEIPT_v11_4 = light;
    root.HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_RECEIPT_v11_3 = light;
    root.HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_RECEIPT_v11_2 = light;
    root.HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SAME_RUNTIME_EXPOSURE_BEACON_API_PUBLICATION_RECEIPT_v11_1 = light;
    root.HEARTH_CANVAS_EAST_PARENT_V10_3_DISPATCH_API_RECOGNITION_SERVED_DETECTION_REPAIR_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD_RECEIPT = light;

    root.HEARTH.canvasEastReceipt = light;
    root.HEARTH.canvasEastCurrentLocalStationV111ApiPublicationReceipt = light;
    root.HEARTH.canvasEastSameRuntimeExposureBeaconApiPublicationReceipt = light;
    root.HEARTH.canvasEastParentV103DispatchApiRecognitionServedDetectionRepairReceipt = light;
    root.HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = light;

    root.DEXTER_LAB.hearthCanvasEastReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastCurrentLocalStationV111ApiPublicationReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastSameRuntimeExposureBeaconApiPublicationReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastParentV103DispatchApiRecognitionServedDetectionRepairReceipt = light;
    root.DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = light;

    state.receiptsPublished = true;
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

      if (!state.localEvents.some((item) => item.event === "CANVAS_EAST_V11_4_API_SURFACE_PUBLISHED")) {
        recordLocal("CANVAS_EAST_V11_4_API_SURFACE_PUBLISHED", {
          reason,
          contract: CONTRACT,
          receipt: RECEIPT,
          apiReadyBeforeUpstreamProof: true,
          apiReadyBeforeRouteConductorScan: true,
          apiReadyBeforeAtlasEvidence: true,
          apiReadinessDoesNotRequireEvidence: true,
          datasetSelfContaminationBlocked: true,
          materialAuthorityCachedForAtlasLoop: true,
          emptyContractFalseRecognitionBlocked: true,
          routeConductorPermissionGateEnforced: true,
          canvasEastApiReady: true,
          canvasEastEvidenceReady: Boolean(state.f13AtlasPacketReady),
          visualPassClaimed: false
        });
      }

      return getReceiptLight(false);
    } finally {
      publishDepth -= 1;
    }
  }

  function getCanvasLocalStationCandidates() {
    const root = getRoot();

    return [
      pathRead("HEARTH.canvasLocalStation"),
      pathRead("HEARTH.canvasStation"),
      pathRead("HEARTH.canvasChildDistributionSwitchboard"),
      pathRead("HEARTH.canvasParentReleaseAcceptanceEastDispatchSwitchboard"),
      pathRead("HEARTH.canvasParent"),
      pathRead("HEARTH.canvasNorth"),
      pathRead("HEARTH.canvasEvidence"),
      pathRead("HEARTH.canvas"),
      root.HEARTH_CANVAS_LOCAL_STATION,
      root.HEARTH_CANVAS_STATION,
      root.HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD,
      root.HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD,
      root.HEARTH_CANVAS_PARENT,
      root.HEARTH_CANVAS_AUTHORITY,
      root.HEARTH_CANVAS_EVIDENCE,
      root.HEARTH_CANVAS,
      pathRead("DEXTER_LAB.hearthCanvasLocalStation"),
      pathRead("DEXTER_LAB.hearthCanvasStation"),
      pathRead("DEXTER_LAB.hearthCanvasChildDistributionSwitchboard"),
      pathRead("DEXTER_LAB.hearthCanvasParentReleaseAcceptanceEastDispatchSwitchboard"),
      pathRead("DEXTER_LAB.hearthCanvasParent"),
      pathRead("DEXTER_LAB.hearthCanvasEvidence"),
      pathRead("DEXTER_LAB.hearthCanvas")
    ].filter(Boolean);
  }

  function normalizeCanvasLocalStationSummary(summary = {}, authority = null) {
    const upstream = readUpstreamDatasetProof();

    const contract = safeString(firstDefined(
      summary.canvasLocalStationContract,
      summary.currentCanvasStationContract,
      summary.currentCanvasParentContract,
      summary.hearthCanvasContract,
      summary.contract,
      authority && authority.CONTRACT,
      authority && authority.contract,
      upstream.canvasLocalStationContract
    ), "");

    const receipt = safeString(firstDefined(
      summary.canvasLocalStationReceipt,
      summary.currentCanvasStationReceipt,
      summary.currentCanvasParentReceipt,
      summary.receipt,
      authority && authority.RECEIPT,
      authority && authority.receipt,
      upstream.canvasLocalStationReceipt
    ), "");

    const contractKnown = Boolean(contract);
    const localAccepted = isCurrentLocalStationContract(contract);
    const baselineV10_3 = contract === V10_3_BASELINE_CONTRACT || receipt === V10_3_BASELINE_RECEIPT;

    const summaryMethod = safeString(summary.__sourceMethod, "OBJECT_OR_UPSTREAM_DATASET");
    const summaryObserved = Boolean(
      summaryMethod !== "OBJECT_OR_UPSTREAM_DATASET" ||
      summary.packetType === "CANVAS_LOCAL_STATION_SUMMARY" ||
      summary.packetType === "CANVAS_LOCAL_STATION_RECEIPT" ||
      summary.canvasLocalStationActive === true ||
      summary.childDistributionSwitchboardActive === true ||
      localAccepted ||
      baselineV10_3
    );

    const apiReady = Boolean(
      localAccepted &&
      (
        summary.canvasLocalStationApiReady === true ||
        summary.currentCanvasParentIsLocalStation === true ||
        summary.canvasLocalStationObserved === true ||
        summary.currentCanvasParentObserved === true ||
        summary.childDistributionSwitchboardActive === true ||
        summary.canvasLocalStationActive === true ||
        isObject(authority)
      )
    );

    const releaseAccepted = Boolean(
      safeBool(summary.canvasLocalStationReleaseAccepted, false) ||
      safeBool(summary.canvasParentReleaseAccepted, false) ||
      safeBool(summary.parentReleaseAccepted, false) ||
      safeBool(summary.releasePacketAccepted, false) ||
      safeBool(summary.parentAcceptedRouteConductorRelease, false) ||
      safeBool(upstream.canvasLocalStationReleaseAccepted, false)
    );

    const releaseLawful = Boolean(
      safeBool(summary.canvasLocalStationReleaseLawful, false) ||
      safeBool(summary.canvasParentReleaseLawful, false) ||
      safeBool(summary.parentReleaseLawful, false) ||
      safeBool(summary.parentReleasePacketLawful, false) ||
      safeBool(summary.canvasReleaseAuthorized, false) ||
      safeBool(upstream.canvasReleaseAuthorized, false)
    );

    const sentToEast = Boolean(
      safeBool(summary.parentReleasePacketSentToEast, false) ||
      safeBool(summary.eastDispatchAuthorized, false) ||
      safeBool(summary.eastDispatchPacketPublished, false) ||
      safeBool(summary.canvasEastDispatchAuthorized, false) ||
      safeBool(summary.canvasEastDispatchPacketPublished, false)
    );

    return {
      contract,
      receipt,
      contractKnown,
      localAccepted,
      baselineV10_3,
      summaryMethod,
      summaryObserved,
      apiReady,
      releaseAccepted,
      releaseLawful,
      sentToEast,
      source: clonePlain(summary)
    };
  }

  function readCanvasLocalStationSummary(input = {}) {
    const directSummary = isObject(input.canvasLocalStationSummary)
      ? input.canvasLocalStationSummary
      : isObject(input.canvasStationSummary)
        ? input.canvasStationSummary
        : isObject(input.parentSummary)
          ? input.parentSummary
          : null;

    let best = null;

    if (directSummary) best = normalizeCanvasLocalStationSummary(directSummary, null);

    const candidates = getCanvasLocalStationCandidates();

    for (let i = 0; i < candidates.length; i += 1) {
      const authority = candidates[i];
      if (!isObject(authority) || authority === api) continue;

      const receipt = readReceipt(authority) || {};
      const normalized = normalizeCanvasLocalStationSummary(receipt, authority);

      if (!best) {
        best = normalized;
      } else if (normalized.localAccepted && !best.localAccepted) {
        best = normalized;
      } else if (normalized.localAccepted && normalized.apiReady && !best.apiReady) {
        best = normalized;
      } else if (normalized.baselineV10_3 && !best.localAccepted && !best.baselineV10_3) {
        best = normalized;
      }
    }

    if (!best) best = normalizeCanvasLocalStationSummary({}, null);

    state.lastCanvasLocalStationSummary = clonePlain(best);
    state.canvasLocalStationObserved = Boolean(best.summaryObserved || best.contractKnown);
    state.canvasLocalStationContractKnown = Boolean(best.contractKnown);
    state.canvasLocalStationApiReady = Boolean(best.apiReady);
    state.canvasLocalStationContract = best.contract;
    state.canvasLocalStationContractAccepted = Boolean(best.localAccepted);
    state.canvasLocalStationSummaryObserved = Boolean(best.summaryObserved);
    state.canvasLocalStationSummaryMethod = best.summaryMethod;
    state.currentCanvasParentObserved = Boolean(best.summaryObserved || best.contractKnown);
    state.currentCanvasParentContract = best.contract;
    state.currentCanvasParentIsLocalStation = Boolean(best.localAccepted);
    state.canvasParentV10_3BaselineRecognized = Boolean(best.baselineV10_3);
    state.canvasLocalStationReleaseAccepted = Boolean(best.releaseAccepted);
    state.canvasLocalStationReleaseLawful = Boolean(best.releaseLawful || best.releaseAccepted);
    state.canvasLocalStationReleasePacketSentToEast = Boolean(best.sentToEast);
    state.canvasLocalStationV11_1Recognized = best.contract === LOCAL_STATION_V11_1_CONTRACT;
    state.canvasLocalStationV11Recognized = best.contract === LOCAL_STATION_V11_CONTRACT;

    return best;
  }

  function readRouteConductorProfile(input = {}) {
    const routeApi = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR",
      "HEARTH.routeConductorNorthStarCompletionCycleGovernor",
      "DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH.routeConductor",
      "DEXTER_LAB.hearthRouteConductor",
      "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT"
    ]);

    const receipt = readReceipt(routeApi) || (isObject(input.routeConductorReceipt) ? input.routeConductorReceipt : {});
    const upstream = readUpstreamDatasetProof();

    const contract = safeString(firstDefined(
      input.routeConductorContract,
      receipt.contract,
      upstream.routeConductorContract
    ), "");

    const observed = Boolean(routeApi || contract);
    const contractKnown = Boolean(contract);
    const contractRecognized = contract === ROUTE_CONDUCTOR_CURRENT_CONTRACT;

    state.routeConductorObserved = observed;
    state.routeConductorContractKnown = contractKnown;
    state.routeConductorContractRecognized = contractRecognized;
    state.routeConductorV9_2Recognized = contractRecognized;
    state.lastRouteConductorState = {
      observed,
      contractKnown,
      contractRecognized,
      routeConductorV9_2Recognized: contractRecognized,
      contract,
      receipt: safeString(receipt.receipt, ""),
      body: clonePlain(receipt)
    };

    return state.lastRouteConductorState;
  }

  function readWestReleaseState(input = {}) {
    const westApi = firstGlobal([
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_RUNTIME_TABLE_CARDINAL_WEST",
      "HEARTH_RUNTIME_TABLE_WEST",
      "HEARTH_MACRO_WEST_AUTHORITY",
      "HEARTH_WEST_ADMISSIBILITY",
      "HEARTH.macroWestAuthority",
      "HEARTH.westAdmissibility",
      "HEARTH.runtimeTableWest",
      "HEARTH.westRuntimeTable",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.hearthRuntimeTableWest",
      "DEXTER_LAB.westAdmissibility"
    ]);

    const receipt = readReceipt(westApi) || (isObject(input.westReceipt) ? input.westReceipt : {});
    const upstream = readUpstreamDatasetProof();

    const contract = safeString(firstDefined(
      input.macroWestContract,
      receipt.contract,
      upstream.westContract
    ), "");

    const decision = safeString(firstDefined(input.westDecision, receipt.westDecision, upstream.westDecision), "");
    const hardBlock = Boolean(
      safeBool(input.westHardBlock, false) ||
      safeBool(receipt.westHardBlock, false) ||
      safeBool(upstream.westHardBlock, false) ||
      decision === "HARD_BLOCK"
    );

    const releaseApproved = Boolean(
      !hardBlock &&
      (
        safeBool(input.westCanvasReleaseApproved, false) ||
        safeBool(input.canvasReleaseApprovedByWest, false) ||
        safeBool(receipt.westCanvasReleaseApproved, false) ||
        safeBool(receipt.canvasReleaseApprovedByWest, false) ||
        safeBool(upstream.westCanvasReleaseApproved, false) ||
        decision === "RELEASE_TO_CANVAS"
      )
    );

    const releaseAuthorized = Boolean(
      !hardBlock &&
      (
        safeBool(input.canvasReleaseAuthorized, false) ||
        safeBool(input.canvasReleasePacketReady, false) ||
        safeBool(input.releaseToCanvas, false) ||
        safeBool(receipt.canvasReleaseAuthorized, false) ||
        safeBool(receipt.canvasReleasePacketReady, false) ||
        safeBool(receipt.releaseToCanvas, false) ||
        safeBool(upstream.canvasReleaseAuthorized, false) ||
        safeBool(upstream.canvasReleasePacketReady, false) ||
        releaseApproved
      )
    );

    const observed = Boolean(westApi || contract || releaseApproved || releaseAuthorized);
    const contractKnown = Boolean(contract);
    const contractRecognized = contract === MACRO_WEST_CURRENT_CONTRACT;
    const releaseRecognized = Boolean(contractRecognized && releaseApproved && releaseAuthorized && !hardBlock);

    const packet = {
      observed,
      contractKnown,
      contractRecognized,
      releaseRecognized,
      contract,
      receipt: safeString(receipt.receipt, ""),
      decision,
      westHardBlock: hardBlock,
      westReleaseObserved: releaseRecognized,
      westCanvasReleaseApproved: releaseApproved,
      canvasReleaseAuthorized: releaseAuthorized,
      canvasReleasePacketReady: Boolean(releaseAuthorized || safeBool(receipt.canvasReleasePacketReady, false) || safeBool(upstream.canvasReleasePacketReady, false)),
      body: clonePlain(receipt)
    };

    state.lastWestReleaseState = clonePlain(packet);
    state.macroWestObserved = packet.observed;
    state.macroWestContractKnown = packet.contractKnown;
    state.macroWestContractRecognized = packet.contractRecognized;
    state.macroWestV4_6_3ReleaseRecognized = packet.releaseRecognized;
    state.westReleaseObserved = packet.westReleaseObserved;
    state.westDecision = packet.decision;
    state.westHardBlock = packet.westHardBlock;
    state.westCanvasReleaseApproved = packet.westCanvasReleaseApproved;
    state.canvasReleaseAuthorized = packet.canvasReleaseAuthorized;
    state.canvasReleasePacketReady = packet.canvasReleasePacketReady;

    return packet;
  }

  function readDispatchCandidateFromGlobals() {
    const root = getRoot();

    const sources = [
      ["HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET", root.HEARTH_CANVAS_PARENT_EAST_DISPATCH_PACKET],
      ["HEARTH_CANVAS_EAST_DISPATCH_PACKET", root.HEARTH_CANVAS_EAST_DISPATCH_PACKET],
      ["HEARTH.canvasParentEastDispatchPacket", pathRead("HEARTH.canvasParentEastDispatchPacket")],
      ["HEARTH.canvasEastDispatchPacket", pathRead("HEARTH.canvasEastDispatchPacket")],
      ["HEARTH.canvasLocalStationEastDispatchPacket", pathRead("HEARTH.canvasLocalStationEastDispatchPacket")],
      ["DEXTER_LAB.hearthCanvasParentEastDispatchPacket", pathRead("DEXTER_LAB.hearthCanvasParentEastDispatchPacket")],
      ["DEXTER_LAB.hearthCanvasEastDispatchPacket", pathRead("DEXTER_LAB.hearthCanvasEastDispatchPacket")]
    ];

    for (let i = 0; i < sources.length; i += 1) {
      const source = sources[i];
      if (isObject(source[1])) return { source: source[0], packet: source[1] };
    }

    return { source: "NONE", packet: null };
  }

  function readParentEastDispatchPacket(input = {}) {
    const directPacket = isObject(input.eastDispatchPacket)
      ? input.eastDispatchPacket
      : isObject(input.dispatchPacket)
        ? input.dispatchPacket
        : isObject(input.parentEastDispatchPacket)
          ? input.parentEastDispatchPacket
          : null;

    const globalDispatch = readDispatchCandidateFromGlobals();
    const packet = directPacket || globalDispatch.packet || {};

    const localStation = readCanvasLocalStationSummary(input);
    const west = readWestReleaseState(input);

    const observed = Boolean(
      (isObject(packet) && Object.keys(packet).length) ||
      safeBool(packet.eastDispatchAuthorized, false) ||
      safeBool(packet.canvasEastDispatchAuthorized, false) ||
      safeBool(packet.eastDispatchPacketPublished, false) ||
      safeBool(packet.canvasEastDispatchPacketPublished, false) ||
      localStation.sentToEast
    );

    const authorized = Boolean(
      safeBool(packet.eastDispatchAuthorized, false) ||
      safeBool(packet.canvasEastDispatchAuthorized, false) ||
      safeBool(packet.eastDispatchPacketPublished, false) ||
      safeBool(packet.canvasEastDispatchPacketPublished, false) ||
      localStation.sentToEast
    );

    const published = Boolean(
      safeBool(packet.eastDispatchPacketPublished, false) ||
      safeBool(packet.canvasEastDispatchPacketPublished, false) ||
      localStation.sentToEast ||
      observed
    );

    const cycleNumber = safeNumber(firstDefined(packet.cycleNumber, packet.activeCycleNumber, ACTIVE_CYCLE_NUMBER), ACTIVE_CYCLE_NUMBER);
    const cycleRoute = safeString(firstDefined(packet.cycleRoute, packet.activeCycleRoute, ACTIVE_CYCLE_ROUTE), ACTIVE_CYCLE_ROUTE);
    const handoffTo = safeString(firstDefined(packet.handoffTo, packet.targetCardinal, "EAST"), "EAST");
    const receivedFrom = safeString(firstDefined(packet.receivedFrom, packet.sourceCardinal, "CANVAS_LOCAL_STATION"), "CANVAS_LOCAL_STATION");
    const targetFile = safeString(firstDefined(packet.targetFile, packet.destinationFile, FILE), FILE);

    const targetOk = !targetFile || targetFile === FILE || targetFile.indexOf("hearth.canvas.east.js") !== -1;
    const handoffOk = !handoffTo || handoffTo === "EAST" || handoffTo === "CANVAS_EAST";
    const cycleOk = !cycleNumber || cycleNumber === ACTIVE_CYCLE_NUMBER;
    const routeOk = !cycleRoute || cycleRoute === ACTIVE_CYCLE_ROUTE;

    const valid = Boolean(
      observed &&
      authorized &&
      published &&
      localStation.localAccepted &&
      west.releaseRecognized &&
      targetOk &&
      handoffOk &&
      cycleOk &&
      routeOk
    );

    const result = {
      packetType: "CANVAS_EAST_LOCAL_STATION_DISPATCH_READ",
      canvasEastApiReady: true,
      requiredApiSurfaceComplete: true,
      eastDispatchPacketObserved: observed,
      eastDispatchPacketValid: valid,
      eastDispatchPacketAccepted: valid,
      eastDispatchPacketSource: directPacket ? "DIRECT_INPUT" : globalDispatch.source,
      eastDispatchReceivedFrom: receivedFrom,
      eastDispatchHandoffTo: handoffTo,
      eastDispatchCycleNumber: cycleNumber,
      eastDispatchCycleRoute: cycleRoute,
      eastDispatchTargetFile: targetFile,
      eastDispatchAuthorized: authorized,
      eastDispatchPacketPublished: published,
      eastDispatchAtlasBuildRequested: Boolean(
        safeBool(packet.atlasBuildRequested, false) ||
        safeBool(packet.f13AtlasBuildRequested, false) ||
        safeBool(packet.buildAtlasRequested, false) ||
        authorized
      ),
      canvasLocalStationSummary: clonePlain(localStation),
      westReleaseState: clonePlain(west),
      rawDispatchPacket: clonePlain(packet),
      firstFailedCoordinate: valid
        ? "NONE_CANVAS_LOCAL_STATION_EAST_DISPATCH_ACCEPTED"
        : !localStation.localAccepted
          ? "WAITING_CURRENT_CANVAS_LOCAL_STATION_CONTRACT"
          : !west.releaseRecognized
            ? "WAITING_CANVAS_RELEASE_AUTHORIZATION"
            : !observed
              ? "WAITING_CANVAS_LOCAL_STATION_EAST_DISPATCH"
              : !authorized
                ? "WAITING_CANVAS_LOCAL_STATION_EAST_DISPATCH_AUTHORIZATION"
                : "WAITING_CANVAS_LOCAL_STATION_EAST_DISPATCH_VALID_SHAPE",
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
    state.eastDispatchTargetFile = result.eastDispatchTargetFile;
    state.eastDispatchAuthorized = result.eastDispatchAuthorized;
    state.eastDispatchPacketPublished = result.eastDispatchPacketPublished;

    return result;
  }

  function resolveAtlasBuildPermission(input = {}) {
    publishApiSurface("permission-entry");

    const falsePromotion = detectFalsePromotion(input);
    const route = readRouteConductorProfile(input);
    const localStation = readCanvasLocalStationSummary(input);
    const west = readWestReleaseState(input);
    const dispatch = readParentEastDispatchPacket(input);

    let permissionClass = PERMISSION.HELD_ATLAS_EVIDENCE_PENDING;
    let allowed = false;
    let reason = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
    let source = "NONE";
    let recommended = FILE;

    if (falsePromotion) {
      permissionClass = PERMISSION.BLOCKED_FALSE_PROMOTION;
      reason = "FALSE_PROMOTION_BLOCKED";
      recommended = FILE;
    } else if (!route.routeConductorV9_2Recognized) {
      permissionClass = PERMISSION.HELD_ROUTE_CONDUCTOR_PENDING;
      reason = "WAITING_ROUTE_CONDUCTOR_V9_2_RECOGNITION";
      recommended = ROUTE_FILE;
    } else if (!localStation.localAccepted) {
      permissionClass = PERMISSION.HELD_LOCAL_STATION_PENDING;
      reason = localStation.baselineV10_3
        ? "WAITING_CURRENT_CANVAS_LOCAL_STATION_CONTRACT"
        : "WAITING_CURRENT_CANVAS_LOCAL_STATION";
      recommended = PARENT_FILE;
    } else if (!west.releaseRecognized) {
      permissionClass = PERMISSION.HELD_RELEASE_PENDING;
      reason = "WAITING_CANVAS_RELEASE_AUTHORIZATION";
      recommended = MACRO_WEST_FILE;
    } else if (!dispatch.eastDispatchPacketObserved) {
      permissionClass = PERMISSION.HELD_EAST_DISPATCH_PENDING;
      reason = "WAITING_CANVAS_LOCAL_STATION_EAST_DISPATCH";
      recommended = PARENT_FILE;
    } else if (!dispatch.eastDispatchPacketValid) {
      permissionClass = PERMISSION.HELD_EAST_DISPATCH_MALFORMED;
      reason = dispatch.firstFailedCoordinate || "WAITING_CANVAS_LOCAL_STATION_EAST_DISPATCH_VALID_SHAPE";
      recommended = PARENT_FILE;
    } else {
      permissionClass = PERMISSION.BUILD_ALLOWED_LOCAL_STATION_DISPATCH;
      allowed = true;
      reason = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      source = dispatch.eastDispatchPacketSource || "CANVAS_LOCAL_STATION_V11_1_EAST_DISPATCH";
      recommended = FILE;
    }

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      routeFile: ROUTE_FILE,
      packetType: "CANVAS_EAST_ATLAS_BUILD_PERMISSION_PACKET",

      permissionClass,
      canvasEastMayBuildAtlas: allowed,
      f13BuildLawful: allowed,
      f13BuildBlockedReason: reason,
      f13PermissionSource: source,

      routeConductorState: clonePlain(route),
      routeConductorV9_2Recognized: Boolean(route.routeConductorV9_2Recognized),
      routeConductorContractRecognized: Boolean(route.contractRecognized),
      routeConductorContractKnown: Boolean(route.contractKnown),

      canvasLocalStationSummary: clonePlain(localStation),
      westReleaseState: clonePlain(west),
      eastDispatchState: clonePlain(dispatch),

      canvasEastApiReady: true,
      requiredApiSurfaceComplete: true,
      heldDoesNotMeanApiMissing: true,
      atlasReady: false,
      atlasBuildComplete: false,
      canvasEastEvidenceReady: false,
      f13AtlasPacketReady: false,

      firstFailedCoordinate: allowed ? "WAITING_CANVAS_EAST_ATLAS_EVIDENCE" : reason,
      recommendedNextFile: recommended,
      recommendedNextRenewalTarget: recommended,

      visibleProof: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
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
    state.f13PermissionSource = source;
    state.firstFailedCoordinate = allowed ? "WAITING_CANVAS_EAST_ATLAS_EVIDENCE" : reason;
    state.recommendedNextFile = recommended;
    state.recommendedNextRenewalTarget = recommended;

    recomputeChronology();
    publishDatasetFirstProof({ quiet: true });

    return packet;
  }

  function composeHeldAtlasPacket(input = {}, permissionInput = null) {
    publishApiSurface("held-packet-entry");

    const permission = permissionInput || resolveAtlasBuildPermission(input);

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
    state.f13BuildBlockedReason = permission.f13BuildBlockedReason || "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
    state.permissionClass = permission.permissionClass || PERMISSION.HELD_ATLAS_EVIDENCE_PENDING;
    state.atlasBuildComplete = false;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.firstFailedCoordinate = permission.firstFailedCoordinate || state.f13BuildBlockedReason || "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
    state.recommendedNextFile = permission.recommendedNextFile || FILE;
    state.recommendedNextRenewalTarget = permission.recommendedNextRenewalTarget || state.recommendedNextFile;

    blockFinalClaims();
    recomputeChronology();

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      routeFile: ROUTE_FILE,
      packetType: "CANVAS_EAST_SYNCHRONOUS_HELD_ATLAS_PACKET",

      canvasEastApiReady: true,
      canvasEastReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,

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
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: "NONE",

      routeConductorState: clonePlain(state.lastRouteConductorState),
      canvasLocalStationSummary: clonePlain(state.lastCanvasLocalStationSummary),
      westReleaseState: clonePlain(state.lastWestReleaseState),
      eastDispatchState: clonePlain(state.lastDispatchPacket),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      nextConsumerFile: PARENT_FILE,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    state.lastHeldAtlasPacket = clonePlain(packet);

    recordLocal("SYNCHRONOUS_HELD_ATLAS_PACKET_RETURNED_API_STILL_READY", {
      permissionClass: state.permissionClass,
      reason: state.f13BuildBlockedReason,
      recommendedNextFile: state.recommendedNextFile,
      apiReadyStillTrue: true,
      evidenceReadyStillFalse: true,
      heldDoesNotMeanApiMissing: true
    });

    publishApiSurface("held-packet-returned");
    return packet;
  }

  function receiveParentDispatchPacket(packet = {}) {
    publishApiSurface("receive-parent-dispatch-entry");

    const dispatch = readParentEastDispatchPacket({ eastDispatchPacket: packet });

    publishApiSurface("receive-parent-dispatch-complete");

    if (dispatch.eastDispatchPacketValid && dispatch.eastDispatchAtlasBuildRequested) {
      return buildAtlas({ eastDispatchPacket: packet });
    }

    if (dispatch.eastDispatchPacketValid) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
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

    if (options.async === true || options.defer === true || options.nonBlocking === true) {
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
    const materialContext = refreshMaterialBridge({ force: true });

    resetBuildCounters(width, height, "sync");

    try {
      atlasCanvas = createAtlasCanvas(width, height);
      const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
      if (!ctx) throw new Error("Canvas East could not create atlas 2D context.");

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const classSet = new Set();

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0.5 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0.5 : x / (width - 1);
          const material = sampleWithAuthority({ u, v }, materialContext);
          countSample(material, classSet);

          const offset = (y * width + x) * 4;
          const rgb = normalizeRgb(material.rgb || material.color, PALETTE.water);

          data[offset] = rgb[0];
          data[offset + 1] = rgb[1];
          data[offset + 2] = rgb[2];
          data[offset + 3] = clamp(Math.round(clamp01(material.alpha === undefined ? 1 : material.alpha) * 255), 0, 255);
        }

        if (y % 32 === 0 || y === height - 1) {
          state.atlasBuildProgress = Math.round(((y + 1) / height) * 100);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      lastAtlasImageData = imageData;
      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);

      return finalizeAtlasBuild(width, height, "sync");
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
    const materialContext = refreshMaterialBridge({ force: true });

    resetBuildCounters(width, height, "async");

    try {
      atlasCanvas = createAtlasCanvas(width, height);
      const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
      if (!ctx) throw new Error("Canvas East could not create atlas 2D context.");

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const classSet = new Set();

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0.5 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0.5 : x / (width - 1);
          const material = sampleWithAuthority({ u, v }, materialContext);
          countSample(material, classSet);

          const offset = (y * width + x) * 4;
          const rgb = normalizeRgb(material.rgb || material.color, PALETTE.water);

          data[offset] = rgb[0];
          data[offset + 1] = rgb[1];
          data[offset + 2] = rgb[2];
          data[offset + 3] = clamp(Math.round(clamp01(material.alpha === undefined ? 1 : material.alpha) * 255), 0, 255);
        }

        if (y % rowsPerChunk === 0 || y === height - 1) {
          state.atlasBuildProgress = Math.round(((y + 1) / height) * 100);
          await yieldBuildFrame();
        }
      }

      ctx.putImageData(imageData, 0, 0);
      lastAtlasImageData = imageData;
      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);

      return finalizeAtlasBuild(width, height, "async");
    } catch (error) {
      return atlasBuildFailure(error, width, height, "async");
    }
  }

  function createAtlasCanvas(width, height) {
    const doc = getDocument();

    if (doc && isFunction(doc.createElement)) {
      const canvas = doc.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.dataset.hearthCanvasEastAtlas = "true";
      canvas.dataset.hearthCanvasEastContract = CONTRACT;
      canvas.dataset.hearthCanvasEastSourceOnly = "true";
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
      return canvas;
    }

    if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(width, height);
    throw new Error("No canvas creation API available.");
  }

  function yieldBuildFrame() {
    const root = getRoot();

    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) root.requestAnimationFrame(() => resolve());
      else if (isFunction(root.setTimeout)) root.setTimeout(resolve, 0);
      else resolve();
    });
  }

  function resetBuildCounters(width, height, mode) {
    state.heldAtlasPacketReturned = false;
    state.heldPacketWasSynchronous = false;
    state.buildAtlasReturnedPromise = mode === "async";
    state.atlasBuildRequested = true;
    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;
    state.atlasBuildComplete = false;
    state.atlasBuildError = "";
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

    blockFinalClaims();
    publishDatasetFirstProof({ quiet: true });

    recordLocal("F13E_ATLAS_BUILD_STARTED", {
      width,
      height,
      mode,
      materialAuthorityCached: state.materialAuthorityCached,
      materialAuthorityScanCount: state.materialAuthorityScanCount,
      apiReadyBeforeBuild: true,
      routeConductorV9_2Recognized: state.routeConductorV9_2Recognized,
      visualPassClaimed: false
    });
  }

  function finalizeAtlasBuild(width, height, mode) {
    state.atlasBuildProgress = 100;
    state.atlasBuildComplete = true;
    state.atlasCanvasPresent = true;
    state.f13SourceStageComplete = true;
    state.f13AtlasPacketReady = true;
    state.canvasEastEvidenceReady = true;
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
      materialAuthorityScanCount: state.materialAuthorityScanCount,
      evidenceReturnsToLocalStation: true,
      visibleProof: false,
      canvasReady: false,
      visualPassClaimed: false
    });

    publishApiSurface("atlas-build-complete");

    return composeAtlasEvidencePacket({
      atlasCanvas,
      width,
      height
    });
  }

  function atlasBuildFailure(error, width, height, mode) {
    state.atlasBuildError = error && error.message ? error.message : String(error);
    state.atlasBuildComplete = false;
    state.atlasCanvasPresent = false;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceReady = false;
    state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_BUILD";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;

    blockFinalClaims();
    recordError("ATLAS_BUILD_FAILED_API_STILL_READY", error, { width, height, mode });
    recomputeChronology();
    publishApiSurface("atlas-build-failed");

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      packetType: "CANVAS_EAST_ATLAS_BUILD_FAILURE_PACKET",
      canvasEastApiReady: true,
      requiredApiSurfaceComplete: true,
      atlasBuildStarted: true,
      atlasBuildComplete: false,
      atlasBuildError: state.atlasBuildError,
      canvasEastEvidenceReady: false,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: FILE,
      visualPassClaimed: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      completionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
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

      atlasCanvas: config.atlasCanvas || atlasCanvas || null,
      canvas: config.atlasCanvas || atlasCanvas || null,
      width: safeNumber(config.width, state.atlasWidth),
      height: safeNumber(config.height, state.atlasHeight),
      atlasWidth: safeNumber(config.width, state.atlasWidth),
      atlasHeight: safeNumber(config.height, state.atlasHeight),
      atlasReady: Boolean(config.atlasCanvas || atlasCanvas),
      atlasBuildComplete: state.atlasBuildComplete,
      atlasCanvasPresent: state.atlasCanvasPresent,

      routeConductorState: clonePlain(state.lastRouteConductorState),
      routeConductorV9_2Recognized: state.routeConductorV9_2Recognized,

      materialAuthorityCached: state.materialAuthorityCached,
      materialAuthorityScanCount: state.materialAuthorityScanCount,
      materialAuthorityScanDuringAtlasLoopBlocked: true,

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,

      canvasLocalStationSummary: clonePlain(state.lastCanvasLocalStationSummary),
      westReleaseState: clonePlain(state.lastWestReleaseState),
      eastDispatchState: clonePlain(state.lastDispatchPacket),

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
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    state.lastAtlasPacket = clonePlain({
      ...packet,
      atlasCanvas: packet.atlasCanvas ? "[canvas]" : null,
      canvas: packet.canvas ? "[canvas]" : null
    });

    return packet;
  }

  function getMaterialAuthority() {
    const candidates = [
      pathRead("HEARTH.materials"),
      pathRead("HEARTH.materialAuthority"),
      pathRead("HEARTH.materialsAuthority"),
      pathRead("HEARTH.surfaceMaterials"),
      pathRead("DEXTER_LAB.hearthMaterials"),
      pathRead("DEXTER_LAB.hearthMaterialAuthority"),
      pathRead("HEARTH_MATERIALS"),
      pathRead("HEARTH_MATERIAL_AUTHORITY"),
      pathRead("HEARTH_MATERIALS_AUTHORITY"),
      pathRead("HEARTH_SURFACE_MATERIALS")
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      const candidate = candidates[i];
      if (!isObject(candidate) || candidate === api) continue;

      if (
        isFunction(candidate.sample) ||
        isFunction(candidate.read) ||
        isFunction(candidate.getMaterial) ||
        isFunction(candidate.materialAt) ||
        isFunction(candidate.resolveMaterial)
      ) {
        return candidate;
      }
    }

    return null;
  }

  function resolveMaterialSampler(authority) {
    if (!isObject(authority)) return null;

    const methods = ["sample", "read", "getMaterial", "materialAt", "getMaterialAt", "resolveMaterial"];

    for (let i = 0; i < methods.length; i += 1) {
      const method = methods[i];

      if (!isFunction(authority[method])) continue;

      return function runMaterialSampler(point) {
        try {
          const result = authority[method](point);
          if (isObject(result)) return result;
        } catch (_error) {}

        try {
          const result = authority[method](point.u, point.v, point.lon, point.lat);
          if (isObject(result)) return result;
        } catch (_error) {}

        return null;
      };
    }

    return null;
  }

  function refreshMaterialBridge(options = {}) {
    if (cachedMaterialAuthority && cachedMaterialSampler && options.force !== true) {
      return {
        authority: cachedMaterialAuthority,
        sampler: cachedMaterialSampler,
        receipt: clonePlain(cachedMaterialReceipt),
        materialReceiptBridgeActive: state.materialReceiptBridgeActive,
        materialContract: state.materialContract,
        materialReceipt: state.materialReceipt,
        canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
        canonicalMaterialConsumed: state.canonicalMaterialConsumed
      };
    }

    state.materialAuthorityScanCount += 1;

    const authority = getMaterialAuthority();
    const sampler = resolveMaterialSampler(authority);
    const receipt = authority ? readReceipt(authority) : null;

    cachedMaterialAuthority = authority || null;
    cachedMaterialSampler = sampler || null;
    cachedMaterialReceipt = receipt || null;

    state.materialAuthorityCached = Boolean(authority && sampler);
    state.canonicalMaterialAuthorityPresent = Boolean(authority);
    state.materialReceiptBridgeActive = Boolean(receipt);
    state.materialContract = receipt ? safeString(receipt.contract, "") : "";
    state.materialReceipt = receipt ? safeString(receipt.receipt, "") : "";
    state.canonicalMaterialConsumed = Boolean(authority);

    return {
      authority: cachedMaterialAuthority,
      sampler: cachedMaterialSampler,
      receipt: clonePlain(cachedMaterialReceipt),
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed
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

    if (Number.isFinite(Number(input)) && Number.isFinite(Number(b))) return pointFromUv(input, b);

    return pointFromUv(0.5, 0.5);
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

  function normalizeRgb(value, fallback = PALETTE.water) {
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
      isCoast: coastBand > 0.30,
      terrainClass: isWater ? (coastBand > 0.34 ? "shallow_water" : "ocean_basin") : (coastBand > 0.34 ? "coast_edge" : "continent_mass"),
      materialClass: isWater ? "fallback.water.carrier" : "fallback.land.carrier",
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
    const terrainClass = safeString(source.terrainClass || source.materialClass || "", "") || (safeBool(source.isWater, false) ? "ocean_basin" : "continent_mass");
    const isWater = safeBool(source.isWater, terrainClass.indexOf("water") !== -1 || terrainClass.indexOf("ocean") !== -1);
    const isLand = safeBool(source.isLand, !isWater);
    const isCoast = safeBool(source.isCoast, terrainClass.indexOf("coast") !== -1 || terrainClass.indexOf("shore") !== -1);
    const relief = clamp01(safeNumber(source.terrainRelief, 0) + safeNumber(source.ridgeRelief, 0));
    const rgb = normalizeRgb(source.rgb || source.color || source.baseColor || source.finalColorHint, isWater ? PALETTE.water : PALETTE.land);

    return {
      ...source,
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
      rgb,
      color: rgb,
      baseColor: rgb,
      finalColorHint: rgb,
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
      canvasReady: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function sampleWithAuthority(point = {}, materialContext = null) {
    const p = normalizePoint(point);
    const context = materialContext || refreshMaterialBridge({ force: false });
    const sampler = context && context.sampler ? context.sampler : null;

    let raw = null;
    let fallbackUsed = false;

    if (sampler) raw = sampler(p);

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
      const context = refreshMaterialBridge({ force: false });
      return sampleWithAuthority(normalizePoint(point, b, c), context);
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
      Boolean(state.canvasLocalStationReleaseAccepted || state.canvasReleaseAuthorized),
      Boolean(state.eastDispatchAuthorized || state.eastDispatchPacketPublished || state.eastDispatchPacketAccepted),
      f13ePass,
      f13fPass,
      false,
      false,
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
      firstFailedIndex === 4 ? "WAITING_CANVAS_LOCAL_STATION_EAST_DISPATCH" :
      firstFailedIndex === 3 ? "WAITING_CANVAS_LOCAL_STATION_RELEASE_ACCEPTANCE" :
      firstFailedIndex === 2 ? "WAITING_CANVAS_RELEASE_AUTHORIZATION" :
      "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";

    let score = 0;
    if (f13ePass) score += 50;
    if (f13fPass) score += 50;

    state.fibonacciSynchronizationSatisfied = score;
    state.fibonacciSynchronizationExpected = 100;
    state.fibonacciSynchronizationScore = score;
    state.fibonacciSynchronizationPassed = score === 100;
    state.fibonacciSynchronizationDegraded = score >= 50 && score < 100;
    state.fibonacciSynchronizationHardFail = state.permissionClass === PERMISSION.BLOCKED_FALSE_PROMOTION || Boolean(state.atlasBuildError);
    state.fibonacciSynchronizationHoldReason = state.fibonacciSynchronizationPassed
      ? "NONE_F13E_F13F_SYNCHRONIZED"
      : (f13ePass ? "WAITING_CANVAS_EAST_ATLAS_EVIDENCE" : "WAITING_CANVAS_EAST_API");

    if (state.permissionClass === PERMISSION.HELD_ROUTE_CONDUCTOR_PENDING) {
      state.firstFailedCoordinate = "WAITING_ROUTE_CONDUCTOR_V9_2_RECOGNITION";
      state.recommendedNextFile = ROUTE_FILE;
      state.recommendedNextRenewalTarget = ROUTE_FILE;
    } else if (f13fPass) {
      state.firstFailedCoordinate = "NONE_F13F_ATLAS_PACKET_READY";
      state.recommendedNextFile = CANVAS_WEST_FILE;
      state.recommendedNextRenewalTarget = CANVAS_WEST_FILE;
    } else if (f13ePass && !state.firstFailedCoordinate) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    } else if (!f13ePass) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    blockFinalClaims();
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
          "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR",
          "HEARTH.routeConductorNorthStarCompletionCycleGovernor",
          "DEXTER_LAB.hearthRouteConductorNorthStarCompletionCycleGovernor",
          "HEARTH_ROUTE_CONDUCTOR",
          "HEARTH.routeConductor",
          "DEXTER_LAB.hearthRouteConductor",
          "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_WEST_V4_2_SOUTH_OUTPUT_ALIGNMENT"
        ]);

        const packet = {
          contract: CONTRACT,
          receipt: RECEIPT,
          file: FILE,
          packetType: "CANVAS_EAST_API_PUBLICATION_NOTICE",
          reason,
          receivedFrom: "CANVAS_EAST",
          canvasEastApiPublished: true,
          canvasEastApiReady: true,
          requiredApiSurfaceComplete: true,
          canvasEastEvidenceReady: Boolean(state.f13AtlasPacketReady),
          heldDoesNotMeanApiMissing: true,
          firstFailedCoordinate: state.f13AtlasPacketReady ? "NONE_F13F_ATLAS_PACKET_READY" : "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
          recommendedNextFile: state.f13AtlasPacketReady ? CANVAS_WEST_FILE : FILE,
          visualPassClaimed: false,
          createdAt: nowIso()
        };

        let accepted = false;

        if (conductor && isObject(conductor)) {
          const methods = ["reconcileCanvas", "refresh", "run", "start", "boot", "init"];

          for (let i = 0; i < methods.length; i += 1) {
            const method = methods[i];
            if (!isFunction(conductor[method])) continue;

            try {
              conductor[method](packet);
              accepted = true;
              break;
            } catch (_error) {}
          }
        }

        const doc = getDocument();
        if (doc && isFunction(doc.dispatchEvent)) {
          try {
            const event = typeof CustomEvent !== "undefined"
              ? new CustomEvent("hearth:canvas-east-api-published", { detail: packet })
              : null;
            if (event) doc.dispatchEvent(event);
          } catch (_error) {}
        }

        state.routeConductorNotificationAccepted = accepted;
        recordLocal("ROUTE_CONDUCTOR_NONBLOCKING_NOTIFICATION_SENT", {
          reason,
          routeConductorObserved: Boolean(conductor),
          routeConductorNotificationAccepted: accepted,
          canvasEastApiReady: true,
          canvasEastEvidenceReady: Boolean(state.f13AtlasPacketReady)
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

    const root = getRoot();

    try {
      if (isFunction(root.queueMicrotask)) root.queueMicrotask(run);
      else if (isFunction(root.setTimeout)) root.setTimeout(run, 0);
      else run();
    } catch (_error) {
      try {
        run();
      } catch (error) {
        recordError("ROUTE_CONDUCTOR_NOTIFICATION_QUEUE_FAILED_NONBLOCKING", error);
      }
    }

    return true;
  }

  function getReceiptLight(_doRefresh = false) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      routeFile: ROUTE_FILE,
      macroWestFile: MACRO_WEST_FILE,
      canvasWestFile: CANVAS_WEST_FILE,
      canvasSouthFile: CANVAS_SOUTH_FILE,
      route: ROUTE,
      version: VERSION,
      role: state.role,

      activeCycleNumber: ACTIVE_CYCLE_NUMBER,
      activeCycleRoute: ACTIVE_CYCLE_ROUTE,
      activeCardinal: ACTIVE_CARDINAL,
      activeStageId: ACTIVE_STAGE_ID,
      activeGear: ACTIVE_GEAR,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeNewsGate: ACTIVE_NEWS_GATE,

      currentLocalStationV11_1ApiPublicationActive: true,
      sameRuntimeExposureBeaconActive: true,
      strictInitializationSafetyActive: true,
      noDuplicateRootIdentifier: true,
      datasetSelfContaminationBlocked: true,
      materialAuthorityCachedForAtlasLoop: true,
      emptyContractFalseRecognitionBlocked: true,
      routeConductorPermissionGateEnforced: true,

      routeConductorCurrentContract: ROUTE_CONDUCTOR_CURRENT_CONTRACT,
      routeConductorCurrentReceipt: ROUTE_CONDUCTOR_CURRENT_RECEIPT,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractKnown: state.routeConductorContractKnown,
      routeConductorContractRecognized: state.routeConductorContractRecognized,
      routeConductorV9_2Recognized: state.routeConductorV9_2Recognized,

      macroWestCurrentContract: MACRO_WEST_CURRENT_CONTRACT,
      macroWestCurrentReceipt: MACRO_WEST_CURRENT_RECEIPT,
      macroWestObserved: state.macroWestObserved,
      macroWestContractKnown: state.macroWestContractKnown,
      macroWestContractRecognized: state.macroWestContractRecognized,
      macroWestV4_6_3ReleaseRecognized: state.macroWestV4_6_3ReleaseRecognized,

      canvasLocalStationV11_1Contract: LOCAL_STATION_V11_1_CONTRACT,
      canvasLocalStationV11Contract: LOCAL_STATION_V11_CONTRACT,
      canvasLocalStationV11_1Recognized: state.canvasLocalStationV11_1Recognized,
      canvasLocalStationV11Recognized: state.canvasLocalStationV11Recognized,
      localStationV11OrV11_1CurrentPassActive: true,
      v10_3BaselineContract: V10_3_BASELINE_CONTRACT,
      v10_3BaselineReceipt: V10_3_BASELINE_RECEIPT,
      v10_3BaselineRecognizedOnly: true,
      canvasParentV10_3BaselineRecognized: state.canvasParentV10_3BaselineRecognized,

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
      getLastAtlasImageDataAvailable: true,
      getReceiptAvailable: true,
      getReceiptLightAvailable: true,
      getReceiptTextAvailable: true,
      receiveParentDispatchPacketAvailable: true,

      canvasEastPresent: true,
      canvasEastCurrent: true,
      canvasEastReady: true,
      canvasEastApiReady: true,
      canvasEastEvidenceReady: Boolean(state.f13AtlasPacketReady),
      heldDoesNotMeanApiMissing: true,

      canvasLocalStationObserved: state.canvasLocalStationObserved,
      canvasLocalStationContractKnown: state.canvasLocalStationContractKnown,
      canvasLocalStationApiReady: state.canvasLocalStationApiReady,
      canvasLocalStationContract: state.canvasLocalStationContract,
      canvasLocalStationContractAccepted: state.canvasLocalStationContractAccepted,
      canvasLocalStationSummaryObserved: state.canvasLocalStationSummaryObserved,
      canvasLocalStationSummaryMethod: state.canvasLocalStationSummaryMethod,
      currentCanvasParentObserved: state.currentCanvasParentObserved,
      currentCanvasParentContract: state.currentCanvasParentContract,
      currentCanvasParentIsLocalStation: state.currentCanvasParentIsLocalStation,
      canvasLocalStationReleaseAccepted: state.canvasLocalStationReleaseAccepted,
      canvasLocalStationReleaseLawful: state.canvasLocalStationReleaseLawful,
      canvasLocalStationReleasePacketSentToEast: state.canvasLocalStationReleasePacketSentToEast,

      westReleaseObserved: state.westReleaseObserved,
      westDecision: state.westDecision,
      westHardBlock: state.westHardBlock,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,

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
      eastDispatchTargetFile: state.eastDispatchTargetFile,

      permissionClass: state.permissionClass,
      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,

      heldAtlasPacketReturned: state.heldAtlasPacketReturned,
      heldPacketWasSynchronous: state.heldPacketWasSynchronous,
      buildAtlasReturnedPromise: state.buildAtlasReturnedPromise,

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

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,

      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialAuthorityCached: state.materialAuthorityCached,
      materialAuthorityScanCount: state.materialAuthorityScanCount,
      materialAuthorityScanDuringAtlasLoopBlocked: true,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canvasEastDoesNotOwnMaterialTruth: true,
      canvasStillDoesNotOwnPlanetTruth: true,

      chronology: CHRONOLOGY.slice(),
      chronologicalGateCount: state.chronologicalGateCount,
      chronologicalGatesSatisfied: state.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: state.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: state.chronologicalFirstFailedCoordinate,
      fibonacciSynchronizationChronologyFirst: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationExpected: state.fibonacciSynchronizationExpected,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationPassed: state.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,
      fibonacciSynchronizationHardFail: state.fibonacciSynchronizationHardFail,
      fibonacciSynchronizationHoldReason: state.fibonacciSynchronizationHoldReason,

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

      ownsNorthTimetableAuthority: false,
      ownsMacroWestAdmissibility: false,
      ownsRouteOrchestration: false,
      ownsCanvasLocalStationTruth: false,
      ownsCanvasWestInspection: false,
      ownsCanvasSouthVisibleProof: false,
      ownsF13AggregateProof: false,
      ownsF21: false,
      ownsReadyText: false,
      ownsCompletionLatch: false,
      ownsFinalVisualPassClaim: false,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      readyTextAllowed: false,
      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21ClaimedByCanvasEast: false,
      completionLatched: false,
      finalCompletionLatched: false,
      degradedCompletionLatched: false,
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
      eastDiagnosticDataset: clonePlain(state.lastEastDiagnosticDataset),
      upstreamDatasetProof: clonePlain(state.lastUpstreamDatasetProof),
      routeConductorState: clonePlain(state.lastRouteConductorState),
      canvasLocalStationSummary: clonePlain(state.lastCanvasLocalStationSummary),
      westReleaseState: clonePlain(state.lastWestReleaseState),
      eastDispatchState: clonePlain(state.lastDispatchPacket),
      permissionPacket: clonePlain(state.lastPermissionPacket),
      heldAtlasPacket: clonePlain(state.lastHeldAtlasPacket),
      atlasPacket: clonePlain(state.lastAtlasPacket),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors)
    };
  }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_EAST_CURRENT_LOCAL_STATION_V11_1_API_PUBLICATION_RECEIPT",
      "",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("previousContract", r.previousContract),
      line("baselineContract", r.baselineContract),
      line("file", r.file),
      line("parentFile", r.parentFile),
      line("routeFile", r.routeFile),
      line("macroWestFile", r.macroWestFile),
      line("version", r.version),
      line("role", r.role),
      "",
      line("datasetSelfContaminationBlocked", r.datasetSelfContaminationBlocked),
      line("materialAuthorityCachedForAtlasLoop", r.materialAuthorityCachedForAtlasLoop),
      line("emptyContractFalseRecognitionBlocked", r.emptyContractFalseRecognitionBlocked),
      line("routeConductorPermissionGateEnforced", r.routeConductorPermissionGateEnforced),
      "",
      line("activeCycleNumber", r.activeCycleNumber),
      line("activeCycleRoute", r.activeCycleRoute),
      line("activeCardinal", r.activeCardinal),
      line("activeStageId", r.activeStageId),
      line("activeGear", r.activeGear),
      line("activeFibonacci", r.activeFibonacci),
      line("activeNewsGate", r.activeNewsGate),
      "",
      line("apiSurfacePublished", r.apiSurfacePublished),
      line("aliasesPublished", r.aliasesPublished),
      line("datasetFirstProofPublished", r.datasetFirstProofPublished),
      line("receiptsPublished", r.receiptsPublished),
      line("requiredApiSurfaceComplete", r.requiredApiSurfaceComplete),
      line("canvasEastApiReady", r.canvasEastApiReady),
      line("canvasEastEvidenceReady", r.canvasEastEvidenceReady),
      line("heldDoesNotMeanApiMissing", r.heldDoesNotMeanApiMissing),
      "",
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContractKnown", r.routeConductorContractKnown),
      line("routeConductorContractRecognized", r.routeConductorContractRecognized),
      line("routeConductorV9_2Recognized", r.routeConductorV9_2Recognized),
      line("macroWestObserved", r.macroWestObserved),
      line("macroWestContractKnown", r.macroWestContractKnown),
      line("macroWestContractRecognized", r.macroWestContractRecognized),
      line("macroWestV4_6_3ReleaseRecognized", r.macroWestV4_6_3ReleaseRecognized),
      "",
      line("canvasLocalStationContract", r.canvasLocalStationContract),
      line("canvasLocalStationContractKnown", r.canvasLocalStationContractKnown),
      line("canvasLocalStationContractAccepted", r.canvasLocalStationContractAccepted),
      line("canvasLocalStationApiReady", r.canvasLocalStationApiReady),
      line("canvasLocalStationSummaryObserved", r.canvasLocalStationSummaryObserved),
      line("currentCanvasParentIsLocalStation", r.currentCanvasParentIsLocalStation),
      line("v10_3BaselineRecognizedOnly", r.v10_3BaselineRecognizedOnly),
      line("canvasParentV10_3BaselineRecognized", r.canvasParentV10_3BaselineRecognized),
      "",
      line("westReleaseObserved", r.westReleaseObserved),
      line("westCanvasReleaseApproved", r.westCanvasReleaseApproved),
      line("canvasReleaseAuthorized", r.canvasReleaseAuthorized),
      line("canvasReleasePacketReady", r.canvasReleasePacketReady),
      "",
      line("eastDispatchAuthorized", r.eastDispatchAuthorized),
      line("eastDispatchPacketPublished", r.eastDispatchPacketPublished),
      line("eastDispatchPacketObserved", r.eastDispatchPacketObserved),
      line("eastDispatchPacketValid", r.eastDispatchPacketValid),
      line("eastDispatchPacketAccepted", r.eastDispatchPacketAccepted),
      line("eastDispatchPacketSource", r.eastDispatchPacketSource),
      "",
      line("permissionClass", r.permissionClass),
      line("canvasEastMayBuildAtlas", r.canvasEastMayBuildAtlas),
      line("f13BuildLawful", r.f13BuildLawful),
      line("f13BuildBlockedReason", r.f13BuildBlockedReason),
      line("f13PermissionSource", r.f13PermissionSource),
      "",
      line("heldAtlasPacketReturned", r.heldAtlasPacketReturned),
      line("heldPacketWasSynchronous", r.heldPacketWasSynchronous),
      line("atlasBuildStarted", r.atlasBuildStarted),
      line("atlasBuildComplete", r.atlasBuildComplete),
      line("f13AtlasPacketReady", r.f13AtlasPacketReady),
      "",
      line("materialAuthorityCached", r.materialAuthorityCached),
      line("materialAuthorityScanCount", r.materialAuthorityScanCount),
      line("materialAuthorityScanDuringAtlasLoopBlocked", r.materialAuthorityScanDuringAtlasLoopBlocked),
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
      line("f21SubmittedToNorth", false),
      line("f21EligibilitySubmittedToNorth", false),
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
        readEastDiagnosticDataset();
        readUpstreamDatasetProof();
        readRouteConductorProfile(options);
        readCanvasLocalStationSummary(options);
        readWestReleaseState(options);
        readParentEastDispatchPacket(options);
        resolveAtlasBuildPermission(options);
      } catch (error) {
        recordError("BOOT_SCAN_FAILED_NONBLOCKING_AFTER_API_PUBLICATION", error, {
          apiAlreadyPublished: true,
          canvasEastApiReady: true
        });
      }

      recomputeChronology();
      publishApiSurface("boot-complete");

      recordLocal("CANVAS_EAST_V11_4_BOOTED", {
        file: FILE,
        contract: CONTRACT,
        receipt: RECEIPT,
        canvasEastApiReady: true,
        requiredApiSurfaceComplete: true,
        aliasesPublished: true,
        routeConductorPermissionGateEnforced: true,
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

    routeConductorCurrentContract: ROUTE_CONDUCTOR_CURRENT_CONTRACT,
    macroWestCurrentContract: MACRO_WEST_CURRENT_CONTRACT,
    localStationV111Contract: LOCAL_STATION_V11_1_CONTRACT,
    localStationV11Contract: LOCAL_STATION_V11_CONTRACT,
    v10_3BaselineContract: V10_3_BASELINE_CONTRACT,

    file: FILE,
    parentFile: PARENT_FILE,
    routeFile: ROUTE_FILE,
    macroWestFile: MACRO_WEST_FILE,
    canvasWestFile: CANVAS_WEST_FILE,
    canvasSouthFile: CANVAS_SOUTH_FILE,
    route: ROUTE,
    version: VERSION,

    REQUIRED_METHODS,
    CANVAS_CHILD_SEQUENCE,
    CHRONOLOGY,
    PERMISSION,

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

    readEastDiagnosticDataset,
    readUpstreamDatasetProof,
    readRouteConductorProfile,
    readCanvasLocalStationSummary,
    readParentAuthorityProfile: readCanvasLocalStationSummary,
    readParentState: readCanvasLocalStationSummary,
    readParentEastDispatchPacket,
    readEastDispatchPacket: readParentEastDispatchPacket,
    readWestReleaseState,
    resolveAtlasBuildPermission,
    composeAtlasBuildPermissionPacket: resolveAtlasBuildPermission,
    composeHeldAtlasPacket,
    composeAtlasEvidencePacket,
    refreshMaterialBridge,

    receiveParentDispatchPacket,
    receiveEastDispatchPacket: receiveParentDispatchPacket,
    receiveDispatchPacket: receiveParentDispatchPacket,
    receiveParentPacket: receiveParentDispatchPacket,
    receiveReleasePacket: receiveParentDispatchPacket,
    receiveCanvasParentPacket: receiveParentDispatchPacket,

    getReceipt,
    getReceiptLight,
    getReceiptText,

    currentLocalStationV11_1ApiPublicationActive: true,
    sameRuntimeExposureBeaconActive: true,
    strictInitializationSafetyActive: true,
    noDuplicateRootIdentifier: true,
    datasetSelfContaminationBlocked: true,
    materialAuthorityCachedForAtlasLoop: true,
    emptyContractFalseRecognitionBlocked: true,
    routeConductorPermissionGateEnforced: true,
    localStationV11OrV11_1CurrentPassActive: true,
    v10_3BaselineRecognizedOnly: true,

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
    heldDoesNotMeanApiMissing: true,

    ownsSourceMaterialAtlas: true,
    ownsBuildAtlasMethod: true,
    ownsSampleMethod: true,
    ownsReadMethod: true,
    ownsReceiptSurface: true,
    ownsParentDispatchRecognition: true,
    ownsSynchronousHeldPacket: true,
    ownsSameRuntimeExposureBeacon: true,

    ownsNorthTimetableAuthority: false,
    ownsMacroWestAdmissibility: false,
    ownsRouteOrchestration: false,
    ownsCanvasLocalStationTruth: false,
    ownsCanvasWestInspection: false,
    ownsCanvasSouthVisibleProof: false,
    ownsF13AggregateProof: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    visibleProof: false,
    visibleContentProof: false,
    visiblePlanetAvailable: false,
    canvasReady: false,
    readyTextAllowed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
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
    notifyRouteConductor("initial-current-local-station-v11-4-api-publication-before-any-scan");

    try {
      refreshMaterialBridge({ force: true });
    } catch (materialError) {
      recordError("MATERIAL_BRIDGE_SYNC_NONBLOCKING_FAILURE_API_STILL_READY", materialError, {
        apiAlreadyPublished: true
      });
    }

    boot({});
  } catch (error) {
    recordError("CANVAS_EAST_V11_4_INITIALIZATION_GUARD_CAUGHT_AFTER_PUBLICATION", error, {
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
