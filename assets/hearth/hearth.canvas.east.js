// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_TNT_v7
// Full-file replacement.
// Canvas East / parent-observation-renewal-split synchronous held-packet F13 atlas source.
// Purpose:
// - Keep Canvas East API visible synchronously before any atlas build.
// - Make buildAtlas() return a synchronous held packet when parent/West permission is missing.
// - Clear the East break by making East accustom itself to the authoritative Canvas parent.
// - Stop using downstream East audit to infer that the upstream parent must be renewed.
// - Separate parent observation pending, parent corruption/staleness, parent release pending, West release pending, and East recognition mismatch.
// - Preserve governed F13 atlas build after lawful parent/West release.
// - Preserve material bridge to HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1.
// - Preserve all Canvas parent aliases and methods.
// - Keep East source/intake only.
// - Keep F13E/F13F synchronized without promoting East into visible proof, Canvas readiness, F21, ready text, or final visual pass.
// Does not own:
// - planet truth
// - elevation truth
// - hydrology truth
// - material truth
// - texture composition
// - sphere rendering
// - visible proof
// - Canvas release
// - West admissibility audit
// - runtime-table governance
// - route orchestration
// - NEWS finalization
// - F21
// - ready text
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_TNT_v7";
  const RECEIPT = "HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_RECEIPT_v7";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_AUTHORITY_ACCLIMATION_SYNC_HELD_PACKET_TNT_v6";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_AUTHORITY_ACCLIMATION_SYNC_HELD_PACKET_RECEIPT_v6";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v3";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT_v3";

  const COMPATIBILITY_CONTRACT = BASELINE_CONTRACT;
  const COMPATIBILITY_RECEIPT = BASELINE_RECEIPT;

  const FILE = "/assets/hearth/hearth.canvas.east.js";
  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const VERSION = "2026-06-01.hearth-canvas-east-parent-observation-renewal-split-sync-held-packet-v7";

  const ACTIVE_FIBONACCI_GATE = "F13E_F13F";
  const FUTURE_FIBONACCI_GATE = "F21";
  const CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const CYCLE_ORDER = "PARENT_AUTHORITY_PROFILE -> OBSERVATION_RENEWAL_SPLIT -> SYNCHRONOUS_HELD_PACKET_OR_LAWFUL_BUILD -> EAST_SOURCE_F13E -> EAST_ATLAS_F13F -> PARENT_F13_RECEIPT";

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;

  const REQUIRED_METHODS = Object.freeze([
    "buildAtlas",
    "buildAtlasSync",
    "buildAtlasAsync",
    "sample",
    "read",
    "getReceipt",
    "getReceiptText"
  ]);

  const ACCEPTED_PARENT_AUTHORITY_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_TNT_v5",
    "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_TNT_v6",
    "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST_TNT_v4",
    "HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE_TNT_v3",
    "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_TNT_v1",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_AFTER_WEST_RELEASE_TNT_v1"
  ]);

  const RETIRED_PARENT_SPLIT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1",
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_RECEIPT_v1",
    "HEARTH_CANVAS_PARENT_IDENTITY_BOOT_HANDSHAKE_STALE_CONSUMPTION_GUARD_TNT_v4",
    "HEARTH_CANVAS_PARENT_IDENTITY_BOOT_HANDSHAKE_STALE_CONSUMPTION_GUARD_RECEIPT_v4",
    "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_TEXTURE_FRAME_PROOF_CLOSURE_TNT_v3",
    "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_SCHEMATIC_TNT_v2",
    "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2",
    "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1"
  ]);

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

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  let atlasCanvas = null;
  let lastAtlasImageData = null;
  let materialSampler = null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
    expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    westFile: WEST_FILE,
    routeFile: ROUTE_FILE,
    role: "canvas-east-parent-observation-renewal-split-sync-held-packet",

    parentAuthorityIsUpstream: true,
    eastAccustomsToParent: true,
    parentRenewalNotInferredFromEastAudit: true,
    parentContractExactMatchRequired: false,
    eastRecognitionMismatchRepairTarget: FILE,
    parentObservationRenewalSplitActive: true,
    parentObservationDoesNotEqualRenewal: true,

    parentFirstApiRecognitionBootstrapActive: true,
    parentAuthorityProfileActive: true,
    synchronousBuildAtlasDispatcherActive: true,
    synchronousHeldPacketActive: true,
    asyncHeldPacketRetired: true,
    parentFirstApiPublished: false,
    parentCompatibilityAliasesPublished: false,
    datasetFirstProofPublished: false,
    governedCanvasParentAligned: true,
    afterWestReleaseOnly: true,
    canvasEastSourceOnly: true,

    requiredApiSurfaceComplete: true,
    requiredMethods: REQUIRED_METHODS.slice(),
    buildAtlasAvailable: true,
    buildAtlasSyncAvailable: true,
    buildAtlasAsyncAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getReceiptAvailable: true,
    getReceiptTextAvailable: true,
    canvasEastApiReady: true,
    canvasEastCurrent: true,
    canvasEastPresent: true,
    canvasEastEvidenceReady: false,

    parentObserved: false,
    parentApiPresent: false,
    parentCallable: false,
    parentReceiptObserved: false,
    parentContract: "",
    parentReceiptId: "",
    parentReleaseObserved: false,
    parentRequestObserved: false,
    parentAuthorityAccepted: false,
    parentRecognitionMismatch: false,
    parentAbsent: true,
    parentCorruptOrStale: false,
    parentRecommendedForRenewal: false,
    eastRecommendedForAcclimation: false,
    parentObservationRequired: true,
    parentRenewalRequired: false,
    eastAcclimationRequired: false,
    parentReleasePending: false,
    westReleasePending: false,
    heldReasonClass: "PARENT_OBSERVATION_PENDING",
    parentProfileFirstFailedCoordinate: "WAITING_PARENT_OBSERVATION",

    newsProtocolSynchronized: true,
    newsFinalizedByCanvasEast: false,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    northGateReady: false,
    eastGateReady: true,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,

    f21EligibleForNorth: false,
    f21ClaimedByCanvasEast: false,
    readyTextClaimedByCanvasEast: false,
    completionLatched: false,

    canvasEastMayBuildAtlas: false,
    f13BuildLawful: false,
    f13BuildBlockedReason: "WAITING_PARENT_OBSERVATION",
    f13PermissionSource: "NONE",
    heldAtlasPacketReturned: false,
    heldPacketWasSynchronous: false,
    buildAtlasReturnedPromise: false,

    westReleaseObserved: false,
    westReleaseRequired: true,
    westAuditObserved: false,
    westAuditPassed: false,
    westAuditDegraded: false,
    westAuditBlocked: false,
    westCanvasReleaseApproved: false,
    canvasReleaseAuthorized: false,

    emergencyF13Requested: false,
    emergencyF13Reason: "",
    emergencyF13AtlasPacket: false,

    sourceFile: "",
    destinationFile: PARENT_FILE,
    receivedFrom: "",
    requestedBy: "",
    requestSource: "",
    activeCycleNumber: 2,
    activeCycleRoute: CYCLE_ROUTE,
    activeCardinal: "EAST",
    activeStageId: "F13E_F13F_PARENT_OBSERVATION_RENEWAL_SPLIT_ATLAS_SOURCE",
    activeGearId: "F13E_F13F_PARENT_OBSERVATION_RENEWAL_SPLIT_ATLAS_SOURCE",
    activeNewsGate: "F13_CANVAS_EVIDENCE",

    materialReceiptBridgeActive: false,
    materialNestedReceiptAvailable: false,
    materialContract: "",
    materialReceipt: "",
    materialExpectedContract: EXPECTED_MATERIAL_CONTRACT,
    materialExpectedReceipt: EXPECTED_MATERIAL_RECEIPT,
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    materialPreviousContract: "",
    materialBaselineContract: "",
    materialVersion: "",
    materialRole: "",
    materialBridgeSignature: "",
    previousMaterialBridgeSignature: "",
    materialBridgeChanged: false,
    materialBridgeSyncCount: 0,
    materialBridgeLastSyncedAt: "",

    canonicalMaterialAuthorityPresent: false,
    canonicalMaterialConsumed: false,
    canonicalMaterialColorPrimary: false,
    canonicalMaterialShapePrimary: false,
    materialsPrimaryWhenValid: true,
    rawSourceColorDemotedToPaletteInfluence: true,
    canvasStillDoesNotOwnPlanetTruth: true,
    canvasEastDoesNotOwnMaterialTruth: true,

    atlasSourceActive: true,
    upstreamFirstAtlasActive: true,
    atlasBuildRequested: false,
    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasBuildError: "",
    atlasBuildStartedAt: "",
    atlasBuildCompletedAt: "",
    atlasBuildElapsedMs: 0,
    atlasCanvasPresent: false,
    atlasWidth: DEFAULT_ATLAS_WIDTH,
    atlasHeight: DEFAULT_ATLAS_HEIGHT,
    atlasPixelCount: 0,

    atlasCanonicalMaterialSampleCount: 0,
    atlasMaterialSampleCount: 0,
    atlasElevationHydrologySampleCount: 0,
    atlasFallbackSampleCount: 0,
    atlasUnknownUpstreamSampleCount: 0,
    atlasTotalSampleCount: 0,
    atlasLandSampleCount: 0,
    atlasWaterSampleCount: 0,
    atlasCoastSampleCount: 0,
    atlasReliefSampleCount: 0,
    atlasClassCount: 0,
    atlasClasses: [],

    sevenContinentFallbackEmergencyOnly: true,
    sevenContinentFallbackUsed: false,
    sevenContinentFallbackSuppressedByUpstream: false,
    emergencyFallbackUsed: false,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlinesReadFromHydrologyAndMaterials: true,
    landChannelStillReceiverOnly: true,

    cachedAtlasInvalidationAvailable: true,
    atlasInvalidationCount: 0,
    atlasInvalidated: false,
    atlasInvalidationReason: "",
    fallbackSampleAvailable: true,
    fallbackSampleUsedAtRuntime: false,

    f13SourceStageStarted: false,
    f13SourceStageComplete: false,
    f13AtlasPacketReady: false,

    firstFailedCoordinate: "WAITING_PARENT_OBSERVATION",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,

    lastNormalizedInput: null,
    lastParentAuthorityProfile: null,
    lastPermissionPacket: null,
    lastAtlasPacket: null,
    lastHeldAtlasPacket: null,
    lastSampleAt: "",
    lastBuildAt: "",
    publishedAt: "",
    updatedAt: "",

    localEvents: [],
    errors: [],

    visibleProof: false,
    visibleContentProof: false,
    visiblePlanetAvailable: false,
    canvasReady: false,
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

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
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

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max = 160) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LOCAL_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    updateDataset();
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
    trimArray(state.errors, 140);
    state.updatedAt = item.at;
    updateDataset();
    return item;
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

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }

    return undefined;
  }

  function firstString(...values) {
    const value = firstDefined(...values);
    return value === undefined ? "" : String(value);
  }

  function firstBool(fallback, ...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return safeBool(value, fallback);
    }

    return fallback;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = pathRead(name);
      if (found) return found;
    }

    return null;
  }

  function findNestedReceipt(source, names) {
    if (!isObject(source)) return {};

    for (const name of names || []) {
      const direct = objectValue(source, name);
      if (isObject(direct)) return direct;
    }

    return {};
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getReceiptLight)) {
      try {
        const receipt = authority.getReceiptLight();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version || authority.splitContract) return authority;

    return null;
  }

  function contractIsRetiredParent(contractOrReceipt = "") {
    const value = safeString(contractOrReceipt, "");
    if (!value) return false;
    return RETIRED_PARENT_SPLIT_CONTRACTS.includes(value);
  }

  function contractLooksLikeCanvasParent(value = "") {
    const text = safeString(value, "");
    return Boolean(
      text.includes("HEARTH_CANVAS_PARENT") ||
      text.includes("HEARTH_CANVAS") ||
      text.includes("CANVAS_PARENT") ||
      text.includes("F13_EVIDENCE_RECEIVER") ||
      text.includes("SOUTH_PROOF_RECONCILIATION")
    );
  }

  function parentContractAccepted(contract = "", receipt = "") {
    const c = safeString(contract, "");
    const r = safeString(receipt, "");

    if (ACCEPTED_PARENT_AUTHORITY_CONTRACTS.includes(c)) return true;
    if (ACCEPTED_PARENT_AUTHORITY_CONTRACTS.includes(r)) return true;
    if (contractLooksLikeCanvasParent(c) && !c.includes("STALE") && !c.includes("RETIRED")) return true;
    if (contractLooksLikeCanvasParent(r) && !r.includes("STALE") && !r.includes("RETIRED")) return true;

    return false;
  }

  function hasCallableParentMethod(parentApi) {
    if (!parentApi || !isObject(parentApi)) return false;

    return Boolean(
      isFunction(parentApi.boot) ||
      isFunction(parentApi.bootCooperative) ||
      isFunction(parentApi.mount) ||
      isFunction(parentApi.render) ||
      isFunction(parentApi.ensureCarrier) ||
      isFunction(parentApi.ensurePreReleaseStructuralCarrier) ||
      isFunction(parentApi.receiveEastAtlas) ||
      isFunction(parentApi.receiveAtlas) ||
      isFunction(parentApi.consumeEastAtlas) ||
      isFunction(parentApi.getReceipt)
    );
  }

  function classifyHeldReasonClass(reason) {
    if (reason === "STALE_PARENT_CONTRACT_DETECTED") return "PARENT_RENEWAL_REQUIRED";
    if (reason === "WAITING_PARENT_OBSERVATION") return "PARENT_OBSERVATION_PENDING";
    if (reason === "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH") return "EAST_ACCLIMATION_REQUIRED";
    if (reason === "WAITING_PARENT_RELEASE") return "PARENT_RELEASE_PENDING";
    if (reason === "WAITING_WEST_RELEASE") return "WEST_RELEASE_PENDING";
    if (reason === "FALSE_PROMOTION_BLOCKED") return "FALSE_PROMOTION_BLOCKED";
    if (reason === "WAITING_CANVAS_EAST_ATLAS_BUILD") return "EAST_ATLAS_BUILD_PENDING";
    return reason ? "HELD_OTHER" : "NONE";
  }

  function readParentAuthorityProfile(input = {}) {
    const source = isObject(input) ? input : {};

    const directParent = findNestedReceipt(source, [
      "parent",
      "parentReceipt",
      "parentReceiptPacket",
      "canvasParent",
      "canvasParentReceipt",
      "canvasParentReceiptPacket",
      "canvasParentReceiptBody",
      "governedParent",
      "governedParentReceipt",
      "currentParent",
      "currentParentReceipt",
      "releasePacket.parent",
      "releasePacket.parentReceipt",
      "releasePacket.canvasParent",
      "canvasReleasePacket.parent",
      "canvasReleasePacket.canvasParent"
    ]);

    const parentApi = firstGlobal([
      "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION",
      "HEARTH.canvasParentCurrentSouthProofReconciliation",
      "DEXTER_LAB.hearthCanvasParentCurrentSouthProofReconciliation",

      "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION",
      "HEARTH.canvasParentEastV5SynchronousHeldPacketConsumption",
      "DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumption",

      "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST",
      "HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
      "DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",

      "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvasParentChildReconciliationF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentChildReconciliationF13EvidenceReceiver",

      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver",

      "HEARTH_CANVAS_PARENT",
      "HEARTH.canvasParent",
      "DEXTER_LAB.hearthCanvasParent",

      "HEARTH_CANVAS",
      "HEARTH.canvas",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasEvidence",
      "HEARTH.canvasNorth",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvasNorth"
    ]);

    const parentReceipt = isObject(directParent) && Object.keys(directParent).length
      ? directParent
      : (readReceipt(parentApi) || {});

    const contract = firstString(
      source.parentContract,
      source.governedParentContract,
      source.parentSplitContract,
      objectValue(source, "releasePacket.parentContract"),
      objectValue(source, "canvasReleasePacket.parentContract"),
      parentReceipt.contract,
      parentReceipt.splitContract,
      parentReceipt.parentContract,
      parentReceipt.activeParentContract,
      parentApi && parentApi.contract,
      parentApi && parentApi.splitContract,
      datasetValue("hearthCanvasContract", ""),
      datasetValue("hearthCanvasSplitContract", ""),
      datasetValue("hearthCanvasParentContract", "")
    );

    const receipt = firstString(
      source.parentReceipt,
      source.governedParentReceipt,
      source.parentReceiptId,
      source.governedParentReceiptId,
      source.parentSplitReceipt,
      objectValue(source, "releasePacket.parentReceipt"),
      objectValue(source, "canvasReleasePacket.parentReceipt"),
      parentReceipt.receipt,
      parentReceipt.splitReceipt,
      parentReceipt.parentReceipt,
      parentReceipt.activeParentReceipt,
      parentApi && parentApi.receipt,
      parentApi && parentApi.splitReceipt,
      datasetValue("hearthCanvasReceipt", ""),
      datasetValue("hearthCanvasSplitReceipt", ""),
      datasetValue("hearthCanvasParentReceipt", "")
    );

    const parentApiPresent = Boolean(parentApi);
    const parentCallable = hasCallableParentMethod(parentApi);
    const parentReceiptObserved = Boolean(
      parentReceipt.contract ||
      parentReceipt.receipt ||
      parentReceipt.splitContract ||
      parentReceipt.splitReceipt ||
      contract ||
      receipt
    );

    const parentObserved = Boolean(
      parentApiPresent ||
      parentCallable ||
      parentReceiptObserved ||
      datasetValue("hearthCanvasLoaded") === "true" ||
      datasetValue("hearthCanvasParentMarkerPresent") === "true" ||
      datasetValue("hearthSouthCurrentCanvasParentObserved") === "true" ||
      datasetValue("hearthCanvasParentChildReconciliationActive") === "true" ||
      datasetValue("hearthCanvasEastV5SynchronousHeldPacketConsumptionActive") === "true" ||
      source.canvasParentObserved === true ||
      source.currentCanvasParentObserved === true
    );

    const parentReleaseObserved = firstBool(
      false,
      source.canvasParentReleaseObserved,
      source.parentReleaseObserved,
      source.parentReleaseLawful,
      source.canvasReleaseAuthorized,
      source.releaseToCanvas,
      objectValue(source, "releasePacket.canvasReleaseAuthorized"),
      objectValue(source, "canvasReleasePacket.canvasReleaseAuthorized"),
      parentReceipt.canvasParentReleaseObserved,
      parentReceipt.parentReleaseLawful,
      parentReceipt.eastAtlasReleaseAuthorized,
      parentReceipt.canvasEastMayBuildAtlas,
      parentReceipt.f13EastAtlasReleaseAuthorized,
      parentReceipt.releaseAccepted,
      parentReceipt.canvasReleaseAccepted,
      parentReceipt.canvasReleaseAuthorized,
      parentReceipt.westCanvasReleaseApproved,
      parentReceipt.westReleaseObserved,
      datasetValue("hearthCanvasReleaseAccepted", ""),
      datasetValue("hearthCanvasReleaseAuthorized", ""),
      datasetValue("hearthSouthCanvasReleaseAuthorized", "")
    );

    const parentRequestObserved = firstBool(
      false,
      source.canvasParentRequestObserved,
      source.parentRequestObserved,
      source.atlasBuildRequested,
      source.f13AtlasBuildRequested,
      source.buildAtlasRequested,
      source.requestedBy === "canvas-parent",
      source.requestSource === "canvas-parent-current-south-proof-reconciliation",
      parentReceipt.canvasEastRequestObserved,
      parentReceipt.canvasEastBuildRequested,
      parentReceipt.f13AtlasBuildRequested,
      parentReceipt.f13SourceRequestToEast,
      parentReceipt.requestEastAtlas,
      parentReceipt.eastAtlasReleaseAuthorized,
      parentReceipt.canvasEastMayBuildAtlas,
      parentReceipt.handoffTo === "EAST",
      parentReceipt.requestedChild === "east",
      parentReceipt.activeCardinal === "EAST",
      datasetValue("hearthCanvasEastRequestObserved", ""),
      datasetValue("hearthCanvasF13AtlasBuildRequested", "")
    );

    const parentCorruptOrStale = Boolean(
      contractIsRetiredParent(contract) ||
      contractIsRetiredParent(receipt) ||
      firstBool(
        false,
        source.staleParentContractDetected,
        source.currentParentStaleDetected,
        parentReceipt.staleParentDetected,
        parentReceipt.currentParentStaleDetected,
        parentReceipt.currentParentIdentityMismatch,
        parentReceipt.parentCorruptOrStale,
        datasetValue("hearthCanvasParentStaleDetected", ""),
        datasetValue("hearthCanvasCurrentParentStaleDetected", "")
      )
    );

    const parentAuthorityAccepted = Boolean(
      parentObserved &&
      !parentCorruptOrStale &&
      (
        parentContractAccepted(contract, receipt) ||
        parentCallable ||
        parentReleaseObserved ||
        parentRequestObserved ||
        safeBool(parentReceipt.parentAuthorityAccepted, false) ||
        safeBool(parentReceipt.currentCanvasParentObserved, false) ||
        safeBool(parentReceipt.canvasParentV6Active, false) ||
        safeBool(parentReceipt.parentChildReconciliationActive, false) ||
        datasetValue("hearthSouthCurrentCanvasParentObserved") === "true" ||
        datasetValue("hearthCanvasLoaded") === "true"
      )
    );

    const parentAbsent = !parentObserved;

    const parentRecognitionMismatch = Boolean(
      parentObserved &&
      !parentCorruptOrStale &&
      !parentAuthorityAccepted
    );

    let firstFailedCoordinate = "NONE_PARENT_AUTHORITY_PROFILE_ACCEPTED";
    let recommendedNextFile = FILE;
    let recommendedNextRenewalTarget = FILE;
    let parentObservationRequired = false;
    let parentRenewalRequired = false;
    let eastAcclimationRequired = false;

    if (parentCorruptOrStale) {
      firstFailedCoordinate = "STALE_PARENT_CONTRACT_DETECTED";
      recommendedNextFile = PARENT_FILE;
      recommendedNextRenewalTarget = PARENT_FILE;
      parentObservationRequired = false;
      parentRenewalRequired = true;
      eastAcclimationRequired = false;
    } else if (parentAbsent) {
      firstFailedCoordinate = "WAITING_PARENT_OBSERVATION";
      recommendedNextFile = FILE;
      recommendedNextRenewalTarget = FILE;
      parentObservationRequired = true;
      parentRenewalRequired = false;
      eastAcclimationRequired = false;
    } else if (parentRecognitionMismatch) {
      firstFailedCoordinate = "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH";
      recommendedNextFile = FILE;
      recommendedNextRenewalTarget = FILE;
      parentObservationRequired = false;
      parentRenewalRequired = false;
      eastAcclimationRequired = true;
    }

    const profile = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "PARENT_AUTHORITY_PROFILE",
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentContractExactMatchRequired: false,
      parentObservationRenewalSplitActive: true,
      parentObservationDoesNotEqualRenewal: true,

      parentObserved,
      parentApiPresent,
      parentCallable,
      parentReceiptObserved,
      parentContract: contract,
      parentReceiptId: receipt,
      parentReleaseObserved,
      parentRequestObserved,
      parentAuthorityAccepted,
      parentRecognitionMismatch,
      parentAbsent,
      parentCorruptOrStale,

      parentRecommendedForRenewal: parentRenewalRequired,
      eastRecommendedForAcclimation: eastAcclimationRequired,
      parentObservationRequired,
      parentRenewalRequired,
      eastAcclimationRequired,
      parentReleasePending: false,
      westReleasePending: false,
      heldReasonClass: classifyHeldReasonClass(firstFailedCoordinate),

      firstFailedCoordinate,
      recommendedNextFile,
      recommendedNextRenewalTarget,
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
    state.parentReleaseObserved = profile.parentReleaseObserved;
    state.parentRequestObserved = profile.parentRequestObserved;
    state.parentAuthorityAccepted = profile.parentAuthorityAccepted;
    state.parentRecognitionMismatch = profile.parentRecognitionMismatch;
    state.parentAbsent = profile.parentAbsent;
    state.parentCorruptOrStale = profile.parentCorruptOrStale;
    state.parentRecommendedForRenewal = profile.parentRecommendedForRenewal;
    state.eastRecommendedForAcclimation = profile.eastRecommendedForAcclimation;
    state.parentObservationRequired = profile.parentObservationRequired;
    state.parentRenewalRequired = profile.parentRenewalRequired;
    state.eastAcclimationRequired = profile.eastAcclimationRequired;
    state.parentReleasePending = false;
    state.westReleasePending = false;
    state.heldReasonClass = profile.heldReasonClass;
    state.parentProfileFirstFailedCoordinate = profile.firstFailedCoordinate;

    updateDataset();
    return profile;
  }

  function readParentState(input = {}) {
    return readParentAuthorityProfile(input);
  }

  function readWestReleaseState(input = {}) {
    const directWest = findNestedReceipt(input, [
      "west",
      "westReceipt",
      "westRelease",
      "westReleaseReceipt",
      "westAudit",
      "westAuditReceipt",
      "release",
      "releasePacket",
      "canvasReleasePacket",
      "westReleasePacket",
      "admissibility",
      "gap"
    ]);

    const westApi = firstGlobal([
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "HEARTH.westCycleAwareAdmissibilityClutch",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.cycleAwareAdmissibilityClutchWest"
    ]);

    const westReceipt = isObject(directWest) && Object.keys(directWest).length
      ? directWest
      : (readReceipt(westApi) || {});

    const cycleNumber = safeNumber(
      firstDefined(input.cycleNumber, input.activeCycleNumber, westReceipt.cycleNumber, westReceipt.activeCycleNumber),
      2
    );

    const cycleRoute = firstString(input.cycleRoute, input.activeCycleRoute, westReceipt.cycleRoute, westReceipt.activeCycleRoute);

    const cycle2 = Boolean(
      cycleNumber === 2 ||
      cycleRoute.includes(CYCLE_ROUTE) ||
      cycleRoute.includes("CYCLE_2") ||
      cycleRoute.includes("NORTH_EAST_SOUTH_WEST_CANVAS")
    );

    const auditObserved = firstBool(
      false,
      input.westAuditObserved,
      input.westReleaseObserved,
      input.macroWestAdmissibilityObserved,
      westReceipt.westAuditObserved,
      westReceipt.westReviewRecommended,
      westReceipt.gapAssessed,
      westReceipt.westAuthority,
      westReceipt.macroWestAuthorityObserved,
      datasetValue("hearthCanvasWestAuditObserved", ""),
      datasetValue("hearthSouthMacroWestAdmissibilityObserved", ""),
      datasetValue("westGateReady", "")
    );

    const auditPassed = firstBool(
      false,
      input.westAuditPassed,
      input.westReleasePassed,
      input.westAuditAccepted,
      input.westCanvasReleaseApproved,
      input.canvasReleaseApprovedByWest,
      input.canvasReleaseAuthorized,
      input.releaseToCanvas,
      westReceipt.westAuditPassed,
      westReceipt.westAuditAccepted,
      westReceipt.westGateReady,
      westReceipt.gapClass === "NONE",
      westReceipt.gapSeverity === "NONE",
      westReceipt.decision === "RELEASE_TO_CANVAS",
      westReceipt.decision === "FULL_PASS",
      westReceipt.forwardAllowed === true && westReceipt.hardBlock !== true,
      westReceipt.westCanvasReleaseApproved,
      westReceipt.canvasReleaseAuthorized,
      datasetValue("hearthCanvasWestReleaseApproved", ""),
      datasetValue("hearthSouthWestCanvasReleaseApproved", ""),
      datasetValue("westCanvasReleaseAuthorized", "")
    );

    const auditDegraded = firstBool(
      false,
      input.westAuditDegraded,
      input.westReleaseDegraded,
      westReceipt.westAuditDegraded,
      westReceipt.westGateDegradedReady,
      westReceipt.canDegradeForward,
      westReceipt.decision === "DEGRADED_FORWARD",
      datasetValue("hearthCanvasWestAuditDegraded", ""),
      datasetValue("hearthSouthWestDegradedForwardApproved", "")
    );

    const auditBlocked = firstBool(
      false,
      input.westAuditBlocked,
      westReceipt.westAuditBlocked,
      westReceipt.hardBlock,
      westReceipt.westHardBlock,
      westReceipt.decision === "HARD_BLOCK",
      datasetValue("hearthCanvasWestAuditBlocked", ""),
      datasetValue("hearthSouthWestHardBlock", "")
    );

    const westCanvasReleaseApproved = firstBool(
      false,
      input.westCanvasReleaseApproved,
      input.canvasReleaseApprovedByWest,
      input.canvasReleaseAuthorized,
      input.releaseToCanvas,
      westReceipt.westCanvasReleaseApproved,
      westReceipt.canvasReleaseApprovedByWest,
      westReceipt.canvasReleaseAuthorized,
      westReceipt.releaseToCanvas,
      westReceipt.handoffTo === "CANVAS",
      westReceipt.destination === "CANVAS",
      westReceipt.targetCardinal === "CANVAS",
      datasetValue("hearthCanvasWestReleaseApproved", ""),
      datasetValue("hearthSouthWestCanvasReleaseApproved", "")
    );

    const canvasReleaseAuthorized = firstBool(
      false,
      input.canvasReleaseAuthorized,
      input.releaseToCanvas,
      westReceipt.canvasReleaseAuthorized,
      westReceipt.releaseToCanvas,
      westCanvasReleaseApproved,
      datasetValue("hearthCanvasReleaseAuthorized", ""),
      datasetValue("hearthSouthCanvasReleaseAuthorized", "")
    );

    const releaseObserved = Boolean(
      !auditBlocked &&
      cycle2 &&
      firstBool(
        Boolean((auditObserved && (auditPassed || auditDegraded)) || westCanvasReleaseApproved || canvasReleaseAuthorized),
        input.westReleaseObserved,
        input.westReleaseLawful,
        westReceipt.westReleaseObserved,
        westReceipt.westReleaseLawful,
        westReceipt.canvasReleaseAuthorized,
        westReceipt.releaseToCanvas,
        westReceipt.handoffTo === "CANVAS",
        westReceipt.releasedTo === "CANVAS",
        datasetValue("hearthCanvasWestReleaseObserved", "")
      )
    );

    return {
      westApiPresent: Boolean(westApi),
      westReceipt: clonePlain(westReceipt),
      westReleaseObserved: releaseObserved,
      westReleaseRequired: true,
      westAuditObserved: auditObserved,
      westAuditPassed: auditPassed,
      westAuditDegraded: auditDegraded,
      westAuditBlocked: auditBlocked,
      westCanvasReleaseApproved,
      canvasReleaseAuthorized
    };
  }

  function detectFalsePromotion(input = {}) {
    let text = "";

    try {
      text = JSON.stringify(input || {});
    } catch (_error) {
      text = String(input || "");
    }

    return Boolean(
      safeBool(input.visibleProof, false) ||
      safeBool(input.visibleContentProof, false) ||
      safeBool(input.visiblePlanetAvailable, false) ||
      safeBool(input.canvasReady, false) ||
      safeBool(input.readyTextAllowed, false) ||
      safeBool(input.f21Allowed, false) ||
      safeBool(input.completionLatched, false) ||
      safeBool(input.finalCompletionLatched, false) ||
      safeBool(input.f21ClaimedByCanvasEast, false) ||
      safeBool(input.readyTextClaimedByCanvasEast, false) ||
      safeBool(input.visualPassClaimed, false) ||
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true") ||
      text.includes('"completionLatched":true') ||
      text.includes("completionLatched=true") ||
      text.includes('"readyTextAllowed":true') ||
      text.includes("readyTextAllowed=true")
    );
  }

  function normalizeCanvasEastInput(input = {}) {
    const source = isObject(input) ? input : {};
    const parent = readParentAuthorityProfile(source);
    const west = readWestReleaseState(source);

    const emergencyF13Requested = firstBool(
      false,
      source.emergencyF13Requested,
      source.allowEmergencyF13,
      source.emergency === true,
      source.f13EmergencyCarrierSupport,
      source.degradedEmergencyF13,
      datasetValue("hearthCanvasEastEmergencyF13Requested", "")
    );

    const atlasBuildRequested = firstBool(
      true,
      source.atlasBuildRequested,
      source.f13AtlasBuildRequested,
      source.buildAtlasRequested,
      parent.parentRequestObserved,
      parent.parentReleaseObserved
    );

    const receivedFrom = firstString(
      source.receivedFrom,
      source.sourceCardinal,
      source.requestedBy,
      parent.parentReleaseObserved ? "PARENT" : "",
      west.westReleaseObserved ? "WEST" : ""
    );

    const normalized = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      sourceFile: firstString(source.sourceFile, source.file, FILE),
      destinationFile: firstString(source.destinationFile, source.handoffToFile, PARENT_FILE),
      parentFile: PARENT_FILE,

      receivedFrom,
      requestedBy: firstString(source.requestedBy, source.requestSource, "canvas-parent"),
      requestSource: firstString(source.requestSource, receivedFrom, "unknown"),

      activeCycleNumber: safeNumber(firstDefined(source.activeCycleNumber, source.cycleNumber), 2),
      activeCycleRoute: firstString(source.activeCycleRoute, source.cycleRoute, CYCLE_ROUTE),
      activeCardinal: "EAST",
      activeFibonacci: ACTIVE_FIBONACCI_GATE,
      activeFibonacciRank: ACTIVE_FIBONACCI_GATE,
      activeStageId: firstString(source.activeStageId, source.activeGearId, "F13E_F13F_PARENT_OBSERVATION_RENEWAL_SPLIT_ATLAS_SOURCE"),
      activeGearId: firstString(source.activeGearId, source.activeStageId, "F13E_F13F_PARENT_OBSERVATION_RENEWAL_SPLIT_ATLAS_SOURCE"),
      activeNewsGate: firstString(source.activeNewsGate, "F13_CANVAS_EVIDENCE"),

      parent,
      west,

      parentObserved: parent.parentObserved,
      parentApiPresent: parent.parentApiPresent,
      parentCallable: parent.parentCallable,
      parentReceiptObserved: parent.parentReceiptObserved,
      parentContract: parent.parentContract,
      parentReceiptId: parent.parentReceiptId,
      parentReleaseObserved: parent.parentReleaseObserved,
      parentRequestObserved: parent.parentRequestObserved,
      parentAuthorityAccepted: parent.parentAuthorityAccepted,
      parentRecognitionMismatch: parent.parentRecognitionMismatch,
      parentAbsent: parent.parentAbsent,
      parentCorruptOrStale: parent.parentCorruptOrStale,
      parentRecommendedForRenewal: parent.parentRecommendedForRenewal,
      eastRecommendedForAcclimation: parent.eastRecommendedForAcclimation,
      parentObservationRequired: parent.parentObservationRequired,
      parentRenewalRequired: parent.parentRenewalRequired,
      eastAcclimationRequired: parent.eastAcclimationRequired,

      westReleaseObserved: west.westReleaseObserved,
      westReleaseRequired: true,
      westAuditObserved: west.westAuditObserved,
      westAuditPassed: west.westAuditPassed,
      westAuditDegraded: west.westAuditDegraded,
      westAuditBlocked: west.westAuditBlocked,
      westCanvasReleaseApproved: west.westCanvasReleaseApproved,
      canvasReleaseAuthorized: west.canvasReleaseAuthorized,

      emergencyF13Requested,
      emergencyF13Reason: firstString(source.emergencyF13Reason, source.reason, parent.parentCorruptOrStale ? "stale-parent-contract" : ""),
      atlasBuildRequested,
      atlasBuildPermissionRequired: true,
      falsePromotionDetected: detectFalsePromotion(source),

      materialAuthorityObserved: Boolean(getMaterialAuthority()),
      materialBridgeActive: state.materialReceiptBridgeActive,
      materialBridgeChanged: state.materialBridgeChanged,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,

      northGateReady: false,
      eastGateReady: true,
      westGateReady: firstBool(false, source.westGateReady, west.westAuditPassed || west.westAuditDegraded || west.westCanvasReleaseApproved),
      southGateReady: firstBool(false, source.southGateReady, objectValue(parent.parentReceipt, "southGateReady")),
      canvasGateReady: false,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: false,
      f21EligibleForNorth: false,

      raw: clonePlain(source),
      normalizedAt: nowIso()
    };

    normalized.parentReleasePending = Boolean(
      normalized.parentAuthorityAccepted &&
      !normalized.parentReleaseObserved &&
      !normalized.parentAbsent &&
      !normalized.parentCorruptOrStale &&
      !normalized.parentRecognitionMismatch
    );

    normalized.westReleasePending = Boolean(
      normalized.parentRequestObserved &&
      normalized.parentAuthorityAccepted &&
      !normalized.westReleaseObserved &&
      !normalized.westAuditBlocked &&
      !normalized.parentCorruptOrStale &&
      !normalized.parentRecognitionMismatch &&
      !normalized.parentAbsent
    );

    state.lastNormalizedInput = clonePlain(normalized);
    applyNormalizedState(normalized);

    return normalized;
  }

  function applyNormalizedState(normalized) {
    state.sourceFile = normalized.sourceFile;
    state.destinationFile = normalized.destinationFile;
    state.receivedFrom = normalized.receivedFrom;
    state.requestedBy = normalized.requestedBy;
    state.requestSource = normalized.requestSource;
    state.activeCycleNumber = normalized.activeCycleNumber;
    state.activeCycleRoute = normalized.activeCycleRoute;
    state.activeCardinal = "EAST";
    state.activeStageId = normalized.activeStageId;
    state.activeGearId = normalized.activeGearId;
    state.activeNewsGate = normalized.activeNewsGate;

    state.parentObserved = normalized.parentObserved;
    state.parentApiPresent = normalized.parentApiPresent;
    state.parentCallable = normalized.parentCallable;
    state.parentReceiptObserved = normalized.parentReceiptObserved;
    state.parentContract = normalized.parentContract;
    state.parentReceiptId = normalized.parentReceiptId;
    state.parentReleaseObserved = normalized.parentReleaseObserved;
    state.parentRequestObserved = normalized.parentRequestObserved;
    state.parentAuthorityAccepted = normalized.parentAuthorityAccepted;
    state.parentRecognitionMismatch = normalized.parentRecognitionMismatch;
    state.parentAbsent = normalized.parentAbsent;
    state.parentCorruptOrStale = normalized.parentCorruptOrStale;
    state.parentRecommendedForRenewal = normalized.parentRecommendedForRenewal;
    state.eastRecommendedForAcclimation = normalized.eastRecommendedForAcclimation;
    state.parentObservationRequired = normalized.parentObservationRequired;
    state.parentRenewalRequired = normalized.parentRenewalRequired;
    state.eastAcclimationRequired = normalized.eastAcclimationRequired;
    state.parentReleasePending = normalized.parentReleasePending;
    state.westReleasePending = normalized.westReleasePending;

    state.westReleaseObserved = normalized.westReleaseObserved;
    state.westAuditObserved = normalized.westAuditObserved;
    state.westAuditPassed = normalized.westAuditPassed;
    state.westAuditDegraded = normalized.westAuditDegraded;
    state.westAuditBlocked = normalized.westAuditBlocked;
    state.westCanvasReleaseApproved = normalized.westCanvasReleaseApproved;
    state.canvasReleaseAuthorized = normalized.canvasReleaseAuthorized;

    state.emergencyF13Requested = normalized.emergencyF13Requested;
    state.emergencyF13Reason = normalized.emergencyF13Reason;
    state.atlasBuildRequested = normalized.atlasBuildRequested;

    state.northGateReady = false;
    state.eastGateReady = true;
    state.westGateReady = normalized.westGateReady;
    state.southGateReady = normalized.southGateReady;
    state.canvasGateReady = false;
    state.newsGatePassedBeforeF21 = false;
    state.newsGateDegradedBeforeF21 = false;
    state.f21EligibleForNorth = false;

    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.visualPassClaimed = false;
  }

  function resolveParentRequest(input = {}) {
    const normalized = isObject(input) && input.parent ? input : normalizeCanvasEastInput(input);
    return Boolean(normalized.parentRequestObserved && normalized.parentAuthorityAccepted && !normalized.parentCorruptOrStale);
  }

  function resolveWestRelease(input = {}) {
    const normalized = isObject(input) && input.west ? input : normalizeCanvasEastInput(input);
    return Boolean(normalized.westReleaseObserved && !normalized.westAuditBlocked);
  }

  function resolveAtlasBuildPermission(input = {}) {
    const normalized = isObject(input) && input.parent && input.west ? input : normalizeCanvasEastInput(input);

    let allowed = false;
    let source = "NONE";
    let reason = "WAITING_PARENT_OBSERVATION";
    let recommended = FILE;

    if (normalized.falsePromotionDetected) {
      allowed = false;
      source = "NONE";
      reason = "FALSE_PROMOTION_BLOCKED";
      recommended = FILE;
    } else if (normalized.parentCorruptOrStale) {
      allowed = false;
      source = "NONE";
      reason = "STALE_PARENT_CONTRACT_DETECTED";
      recommended = PARENT_FILE;
    } else if (normalized.parentAbsent) {
      allowed = false;
      source = "NONE";
      reason = "WAITING_PARENT_OBSERVATION";
      recommended = FILE;
    } else if (normalized.parentRecognitionMismatch) {
      allowed = false;
      source = "NONE";
      reason = "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH";
      recommended = FILE;
    } else if (normalized.emergencyF13Requested) {
      allowed = true;
      source = "EMERGENCY_F13";
      reason = "";
      recommended = FILE;
    } else if (normalized.parentReleaseObserved && normalized.parentAuthorityAccepted) {
      allowed = true;
      source = "PARENT_RELEASE_OBSERVED";
      reason = "";
      recommended = FILE;
    } else if (normalized.parentRequestObserved && normalized.parentAuthorityAccepted && normalized.westReleaseObserved && !normalized.westAuditBlocked) {
      allowed = true;
      source = "PARENT_REQUEST_AFTER_WEST_RELEASE";
      reason = "";
      recommended = FILE;
    } else if (normalized.westReleaseObserved && normalized.canvasReleaseAuthorized && normalized.parentAuthorityAccepted) {
      allowed = true;
      source = "WEST_CANVAS_RELEASE";
      reason = "";
      recommended = FILE;
    } else if (normalized.parentRequestObserved && normalized.parentAuthorityAccepted && !normalized.westReleaseObserved) {
      allowed = false;
      source = "NONE";
      reason = "WAITING_WEST_RELEASE";
      recommended = WEST_FILE;
    } else if (normalized.parentAuthorityAccepted && !normalized.parentReleaseObserved) {
      allowed = false;
      source = "NONE";
      reason = "WAITING_PARENT_RELEASE";
      recommended = PARENT_FILE;
    } else {
      allowed = false;
      source = "NONE";
      reason = "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH";
      recommended = FILE;
    }

    const heldReasonClass = classifyHeldReasonClass(reason);
    const parentObservationRequired = reason === "WAITING_PARENT_OBSERVATION";
    const parentRenewalRequired = reason === "STALE_PARENT_CONTRACT_DETECTED";
    const eastAcclimationRequired = reason === "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH";
    const parentReleasePending = reason === "WAITING_PARENT_RELEASE";
    const westReleasePending = reason === "WAITING_WEST_RELEASE";

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      westFile: WEST_FILE,

      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentContractExactMatchRequired: false,
      eastRecognitionMismatchRepairTarget: FILE,
      parentObservationRenewalSplitActive: true,
      parentObservationDoesNotEqualRenewal: true,

      parentFirstApiRecognitionBootstrapActive: true,
      parentAuthorityProfileActive: true,
      synchronousBuildAtlasDispatcherActive: true,
      synchronousHeldPacketActive: true,
      asyncHeldPacketRetired: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,

      canvasEastMayBuildAtlas: allowed,
      f13BuildLawful: allowed,
      f13BuildBlockedReason: allowed ? "" : reason,
      f13PermissionSource: source,
      heldReasonClass: allowed ? "NONE" : heldReasonClass,

      parentAuthorityProfile: clonePlain(normalized.parent),
      parentObserved: normalized.parentObserved,
      parentApiPresent: normalized.parentApiPresent,
      parentCallable: normalized.parentCallable,
      parentReceiptObserved: normalized.parentReceiptObserved,
      parentContract: normalized.parentContract,
      parentReceiptId: normalized.parentReceiptId,
      parentReleaseObserved: normalized.parentReleaseObserved,
      parentRequestObserved: normalized.parentRequestObserved,
      parentAuthorityAccepted: normalized.parentAuthorityAccepted,
      parentRecognitionMismatch: normalized.parentRecognitionMismatch,
      parentAbsent: normalized.parentAbsent,
      parentCorruptOrStale: normalized.parentCorruptOrStale,
      parentRecommendedForRenewal: parentRenewalRequired,
      eastRecommendedForAcclimation: eastAcclimationRequired,
      parentObservationRequired,
      parentRenewalRequired,
      eastAcclimationRequired,
      parentReleasePending,
      westReleasePending,

      westReleaseObserved: normalized.westReleaseObserved,
      westAuditObserved: normalized.westAuditObserved,
      westAuditPassed: normalized.westAuditPassed,
      westAuditDegraded: normalized.westAuditDegraded,
      westAuditBlocked: normalized.westAuditBlocked,
      westCanvasReleaseApproved: normalized.westCanvasReleaseApproved,
      canvasReleaseAuthorized: normalized.canvasReleaseAuthorized,

      emergencyF13Requested: normalized.emergencyF13Requested,
      emergencyF13Reason: normalized.emergencyF13Reason,
      falsePromotionDetected: normalized.falsePromotionDetected,

      firstFailedCoordinate: allowed ? "NONE_F13_ATLAS_BUILD_PERMISSION_GRANTED" : reason,
      recommendedNextFile: recommended,
      recommendedNextRenewalTarget: recommended,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
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

    state.canvasEastMayBuildAtlas = allowed;
    state.f13BuildLawful = allowed;
    state.f13BuildBlockedReason = allowed ? "" : reason;
    state.f13PermissionSource = source;
    state.heldReasonClass = allowed ? "NONE" : heldReasonClass;
    state.parentObservationRequired = parentObservationRequired;
    state.parentRenewalRequired = parentRenewalRequired;
    state.eastAcclimationRequired = eastAcclimationRequired;
    state.parentReleasePending = parentReleasePending;
    state.westReleasePending = westReleasePending;
    state.parentRecommendedForRenewal = parentRenewalRequired;
    state.eastRecommendedForAcclimation = eastAcclimationRequired;
    state.firstFailedCoordinate = allowed ? "NONE_F13_ATLAS_BUILD_PERMISSION_GRANTED" : reason;
    state.recommendedNextFile = recommended;
    state.recommendedNextRenewalTarget = recommended;
    state.lastPermissionPacket = clonePlain(packet);

    updateDataset();
    return packet;
  }

  function composeAtlasBuildPermissionPacket(input = {}) {
    return resolveAtlasBuildPermission(input);
  }

  function composeHeldAtlasPacket(input = {}, permission = null) {
    const normalized = isObject(input) && input.parent && input.west ? input : normalizeCanvasEastInput(input);
    const gate = permission || resolveAtlasBuildPermission(normalized);

    state.heldAtlasPacketReturned = true;
    state.heldPacketWasSynchronous = true;
    state.buildAtlasReturnedPromise = false;
    state.canvasEastApiReady = true;
    state.canvasEastCurrent = true;
    state.requiredApiSurfaceComplete = true;
    state.canvasEastEvidenceReady = false;
    state.canvasEastMayBuildAtlas = false;
    state.f13BuildLawful = false;
    state.f13BuildBlockedReason = gate.f13BuildBlockedReason || "WAITING_PARENT_OBSERVATION";
    state.f13PermissionSource = "NONE";
    state.heldReasonClass = gate.heldReasonClass || classifyHeldReasonClass(state.f13BuildBlockedReason);
    state.parentObservationRequired = gate.parentObservationRequired === true;
    state.parentRenewalRequired = gate.parentRenewalRequired === true;
    state.eastAcclimationRequired = gate.eastAcclimationRequired === true;
    state.parentReleasePending = gate.parentReleasePending === true;
    state.westReleasePending = gate.westReleasePending === true;
    state.atlasBuildStarted = false;
    state.atlasBuildComplete = false;
    state.f13SourceStageStarted = false;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.firstFailedCoordinate = state.f13BuildBlockedReason;
    state.recommendedNextFile = gate.recommendedNextFile || FILE;
    state.recommendedNextRenewalTarget = gate.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.visualPassClaimed = false;
    state.updatedAt = nowIso();

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      compatibilityContract: COMPATIBILITY_CONTRACT,
      file: FILE,
      parentFile: PARENT_FILE,
      westFile: WEST_FILE,

      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentContractExactMatchRequired: false,
      eastRecognitionMismatchRepairTarget: FILE,
      parentObservationRenewalSplitActive: true,
      parentObservationDoesNotEqualRenewal: true,

      parentFirstApiRecognitionBootstrapActive: true,
      parentAuthorityProfileActive: true,
      synchronousBuildAtlasDispatcherActive: true,
      synchronousHeldPacketActive: true,
      asyncHeldPacketRetired: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,
      buildAtlasAvailable: true,
      buildAtlasSyncAvailable: true,
      buildAtlasAsyncAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,
      getReceiptTextAvailable: true,

      heldAtlasPacketReturned: true,
      heldPacketWasSynchronous: true,
      buildAtlasReturnedPromise: false,
      heldDoesNotMeanApiMissing: true,
      heldDoesNotMeanParentRenewalUnlessCorruptOrStale: true,
      heldMayMeanParentObservationPending: true,
      heldMayMeanWestReleasePending: true,
      heldMayMeanParentReleasePending: true,

      atlasCanvas: null,
      canvas: null,
      width: safeNumber(normalized.raw && (normalized.raw.width || normalized.raw.atlasWidth), DEFAULT_ATLAS_WIDTH),
      height: safeNumber(normalized.raw && (normalized.raw.height || normalized.raw.atlasHeight), DEFAULT_ATLAS_HEIGHT),
      atlasReady: false,
      atlasBuildComplete: false,
      canvasEastEvidenceReady: false,

      canvasEastMayBuildAtlas: false,
      f13BuildLawful: false,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: "NONE",
      heldReasonClass: state.heldReasonClass,
      f13SourceStageStarted: false,
      f13SourceStageComplete: false,
      f13AtlasPacketReady: false,

      parentAuthorityProfile: clonePlain(gate.parentAuthorityProfile || normalized.parent),
      parentObserved: normalized.parentObserved,
      parentApiPresent: normalized.parentApiPresent,
      parentCallable: normalized.parentCallable,
      parentReceiptObserved: normalized.parentReceiptObserved,
      parentContract: normalized.parentContract,
      parentReceiptId: normalized.parentReceiptId,
      parentReleaseObserved: normalized.parentReleaseObserved,
      parentRequestObserved: normalized.parentRequestObserved,
      parentAuthorityAccepted: normalized.parentAuthorityAccepted,
      parentRecognitionMismatch: normalized.parentRecognitionMismatch,
      parentAbsent: normalized.parentAbsent,
      parentCorruptOrStale: normalized.parentCorruptOrStale,
      parentRecommendedForRenewal: state.parentRenewalRequired,
      eastRecommendedForAcclimation: state.eastAcclimationRequired,
      parentObservationRequired: state.parentObservationRequired,
      parentRenewalRequired: state.parentRenewalRequired,
      eastAcclimationRequired: state.eastAcclimationRequired,
      parentReleasePending: state.parentReleasePending,
      westReleasePending: state.westReleasePending,

      westReleaseObserved: normalized.westReleaseObserved,
      westCanvasReleaseApproved: normalized.westCanvasReleaseApproved,
      canvasReleaseAuthorized: normalized.canvasReleaseAuthorized,
      emergencyF13Requested: normalized.emergencyF13Requested,

      newsProtocolSynchronized: true,
      newsFinalizedByCanvasEast: false,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      oneActiveGearAtATime: true,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      completionLatched: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    state.lastHeldAtlasPacket = clonePlain(packet);

    recordLocal("SYNCHRONOUS_HELD_ATLAS_PACKET_RETURNED", {
      firstFailedCoordinate: packet.firstFailedCoordinate,
      heldReasonClass: packet.heldReasonClass,
      recommendedNextFile: packet.recommendedNextFile,
      apiReadyStillTrue: true,
      evidenceReadyStillFalse: true,
      returnedPromise: false,
      parentRenewalInferredFromEastAudit: false,
      parentObservationDoesNotEqualRenewal: true
    });

    updateDataset();
    publishGlobals();

    return packet;
  }

  function composeEmergencyF13AtlasPacket(packet = {}) {
    return {
      ...packet,
      emergencyF13Requested: true,
      emergencyF13AtlasPacket: true,
      emergencyFallbackUsed: true,
      sevenContinentFallbackEmergencyOnly: true,
      sevenContinentFallbackUsed: true,
      f13PermissionSource: "EMERGENCY_F13",
      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
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
      compatibilityContract: COMPATIBILITY_CONTRACT,
      file: FILE,
      parentFile: PARENT_FILE,

      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentContractExactMatchRequired: false,
      parentObservationRenewalSplitActive: true,
      parentObservationDoesNotEqualRenewal: true,

      parentFirstApiRecognitionBootstrapActive: true,
      parentAuthorityProfileActive: true,
      synchronousBuildAtlasDispatcherActive: true,
      synchronousHeldPacketActive: true,
      asyncHeldPacketRetired: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,

      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,

      parentAuthorityProfile: clonePlain(state.lastParentAuthorityProfile),

      atlasCanvas: config.atlasCanvas || atlasCanvas || null,
      canvas: config.atlasCanvas || atlasCanvas || null,
      width: safeNumber(config.width, state.atlasWidth),
      height: safeNumber(config.height, state.atlasHeight),
      atlasWidth: safeNumber(config.width, state.atlasWidth),
      atlasHeight: safeNumber(config.height, state.atlasHeight),
      atlasReady: Boolean(config.atlasCanvas || atlasCanvas),
      atlasBuildComplete: state.atlasBuildComplete,
      sourceRole: "east-material-atlas-source",
      materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false }),

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,

      newsProtocolSynchronized: true,
      newsFinalizedByCanvasEast: false,
      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      oneActiveGearAtATime: true,

      nextConsumerFile: PARENT_FILE,
      recommendedNextFile: PARENT_FILE,
      recommendedNextRenewalTarget: PARENT_FILE,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
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

    return state.emergencyF13Requested ? composeEmergencyF13AtlasPacket(packet) : packet;
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
      if (Number.isFinite(Number(input.u)) && Number.isFinite(Number(input.v))) {
        return pointFromUv(input.u, input.v);
      }

      if (Number.isFinite(Number(input.lon)) && Number.isFinite(Number(input.lat))) {
        return pointFromUv((Number(input.lon) + 180) / 360, (90 - Number(input.lat)) / 180);
      }

      if (
        Number.isFinite(Number(input.x)) &&
        Number.isFinite(Number(input.y)) &&
        Number.isFinite(Number(input.z))
      ) {
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

  function getMaterialAuthority() {
    const candidates = [
      pathRead("HEARTH.materials"),
      pathRead("HEARTH.materialAuthority"),
      pathRead("HEARTH.materialsAuthority"),
      pathRead("HEARTH.surfaceMaterials"),
      pathRead("HEARTH.assets"),
      pathRead("HEARTH.assetsAuthority"),
      root.HEARTH_MATERIALS,
      root.HEARTH_MATERIAL_AUTHORITY,
      root.HEARTH_MATERIALS_AUTHORITY,
      root.HEARTH_SURFACE_MATERIALS,
      root.HEARTH_ASSETS,
      root.HEARTH_ASSETS_AUTHORITY,
      root.HearthMaterials,
      root.HearthMaterialAuthority,
      root.HearthAssets,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterials,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthMaterialAuthority,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthAssets
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
        isFunction(candidate.getSurfaceMaterial) ||
        isFunction(candidate.resolve) ||
        isFunction(candidate.resolveMaterial)
      ) {
        return candidate;
      }
    }

    return null;
  }

  function resolveMaterialSampler(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "sample",
      "read",
      "getMaterial",
      "materialAt",
      "getMaterialAt",
      "getSurfaceMaterial",
      "resolve",
      "resolveMaterial"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      return function runMaterialSampler(point) {
        try {
          const result = authority[method](point);
          if (result && typeof result === "object") return result;
        } catch (_error) {}

        try {
          const result = authority[method](point.u, point.v, point.lon, point.lat);
          if (result && typeof result === "object") return result;
        } catch (_error2) {}

        try {
          const result = authority[method](point.x, point.y, point.z);
          if (result && typeof result === "object") return result;
        } catch (_error3) {}

        return null;
      };
    }

    return null;
  }

  function readMaterialReceipt(authority = getMaterialAuthority()) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (receipt && typeof receipt === "object") return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getStatus)) {
      try {
        const receipt = authority.getStatus();
        if (receipt && typeof receipt === "object") return receipt;
      } catch (_error) {}
    }

    return {
      contract: authority.contract || "",
      receipt: authority.receipt || "",
      previousContract: authority.previousContract || authority.previousAssetsContract || "",
      baselineContract: authority.baselineContract || authority.previousMaterialContract || "",
      requiredElevationContract: authority.requiredElevationContract || authority.requiredElevation || "",
      optionalReliefChildContract: authority.optionalReliefChildContract || "",
      version: authority.version || "",
      authority: authority.authority || "materials",
      role: authority.role || "materials"
    };
  }

  function signatureFromReceipt(receipt) {
    if (!receipt || typeof receipt !== "object") return "NONE";

    return [
      receipt.contract || "",
      receipt.receipt || "",
      receipt.version || "",
      receipt.requiredElevationContract || "",
      receipt.optionalReliefChildContract || "",
      receipt.authority || receipt.role || ""
    ].join("::");
  }

  function syncMaterialBridge(options = {}) {
    const authority = options.authority || getMaterialAuthority();
    const materialReceipt = readMaterialReceipt(authority);
    const signature = signatureFromReceipt(materialReceipt);
    const previousSignature = state.materialBridgeSignature || "";

    materialSampler = resolveMaterialSampler(authority);

    state.materialBridgeSyncCount += 1;
    state.materialBridgeLastSyncedAt = nowIso();

    state.canonicalMaterialAuthorityPresent = Boolean(authority);
    state.materialNestedReceiptAvailable = Boolean(materialReceipt);
    state.materialReceiptBridgeActive = Boolean(materialReceipt);

    state.materialContract = materialReceipt ? safeString(materialReceipt.contract, "") : "";
    state.materialReceipt = materialReceipt ? safeString(materialReceipt.receipt, "") : "";
    state.materialPreviousContract = materialReceipt ? safeString(materialReceipt.previousContract, "") : "";
    state.materialBaselineContract = materialReceipt ? safeString(materialReceipt.baselineContract, "") : "";
    state.materialVersion = materialReceipt ? safeString(materialReceipt.version, "") : "";
    state.materialRole = materialReceipt ? safeString(materialReceipt.authority || materialReceipt.role || "materials", "materials") : "";

    state.materialExpectedContract = EXPECTED_MATERIAL_CONTRACT;
    state.materialExpectedReceipt = EXPECTED_MATERIAL_RECEIPT;
    state.materialContractMatchesExpected = state.materialContract === EXPECTED_MATERIAL_CONTRACT;
    state.materialReceiptMatchesExpected = state.materialReceipt === EXPECTED_MATERIAL_RECEIPT;

    state.canonicalMaterialConsumed = Boolean(authority && state.materialContractMatchesExpected);
    state.canonicalMaterialColorPrimary = Boolean(authority);
    state.canonicalMaterialShapePrimary = Boolean(authority);

    state.previousMaterialBridgeSignature = previousSignature;
    state.materialBridgeSignature = signature;
    state.materialBridgeChanged = Boolean(previousSignature && previousSignature !== signature);
    state.updatedAt = state.materialBridgeLastSyncedAt;

    if (state.materialBridgeChanged && options.invalidate === true) {
      invalidateAtlas("material-bridge-signature-changed", { skipDataset: true });
    }

    if (options.updateDataset !== false) updateDataset();

    return {
      changed: state.materialBridgeChanged,
      signature,
      previousSignature,
      authorityPresent: Boolean(authority),
      materialReceipt: clonePlain(materialReceipt || null),
      materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false })
    };
  }

  function refreshMaterialBridge(options = {}) {
    return syncMaterialBridge(options);
  }

  function getMaterialBridgeReceipt(options = {}) {
    if (options.sync !== false) {
      syncMaterialBridge({ updateDataset: false, invalidate: false });
    }

    return {
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialExpectedContract: state.materialExpectedContract,
      materialExpectedReceipt: state.materialExpectedReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialPreviousContract: state.materialPreviousContract,
      materialBaselineContract: state.materialBaselineContract,
      materialVersion: state.materialVersion,
      materialRole: state.materialRole,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary,
      materialBridgeSignature: state.materialBridgeSignature,
      previousMaterialBridgeSignature: state.previousMaterialBridgeSignature,
      materialBridgeChanged: state.materialBridgeChanged,
      materialBridgeSyncCount: state.materialBridgeSyncCount,
      materialBridgeLastSyncedAt: state.materialBridgeLastSyncedAt
    };
  }

  function numberField(source, key, fallback = 0) {
    const n = Number(source && source[key]);
    return Number.isFinite(n) ? n : fallback;
  }

  function boolField(source, key, fallback = false) {
    return typeof (source && source[key]) === "boolean" ? source[key] : fallback;
  }

  function stringField(source, key, fallback = "") {
    return typeof (source && source[key]) === "string" && source[key] ? source[key] : fallback;
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

    if (coastBand > 0.30) {
      rgb = mixColor(rgb, isWater ? PALETTE.shelf : PALETTE.coast, coastBand * 0.20);
    }

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
      continentId: isLand ? "fallback_visible_body" : "open_ocean",
      waterFillStrength: isWater ? clamp01(0.44 + (0.40 - landSignal) * 0.68) : 0,
      waterDepth: isWater ? clamp01(0.30 + (0.40 - landSignal) * 0.74) : 0,
      waterlineMaterialFeed: coastBand,
      beachMaterialFeed: coastBand * 0.26,
      wetStoneMaterialFeed: coastBand * 0.18,
      hardCoastMaterialFeed: coastBand * 0.12,
      shorelineGrounding: coastBand * 0.30,
      terrainRelief: isLand ? clamp01(n * 0.26 + landSignal * 0.22) : 0,
      ridgeRelief: isLand ? clamp01(n * 0.18) : 0,
      basinShade: isWater ? clamp01((0.40 - landSignal) * 0.42) : 0,
      mountainRangeMaterialFeed: isLand ? clamp01(Math.max(0, n - 0.64) * 0.38) : 0,
      ridgeChainMaterialFeed: isLand ? clamp01(Math.max(0, n - 0.58) * 0.28) : 0,
      canyonCarveMaterialFeed: isLand ? clamp01(Math.max(0, 0.34 - n) * 0.24) : 0,
      canyonDepthMaterialFeed: isLand ? clamp01(Math.max(0, 0.28 - n) * 0.22) : 0,
      sevenContinentFallbackUsed: true,
      fallbackOnly: true,
      canvasEastSourceOnly: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      canvasEastDoesNotOwnMaterialTruth: true,
      f21ClaimedByCanvasEast: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    };
  }

  function classifySampleSource(raw, fallbackUsed) {
    if (fallbackUsed) return "fallback";
    if (!raw || typeof raw !== "object") return "fallback";

    const contract = String(raw.contract || "");

    if (contract === EXPECTED_MATERIAL_CONTRACT) return "canonical-material";
    if (contract.includes("MATERIAL")) return "material";
    if (Number.isFinite(Number(raw.elevation)) || typeof raw.hydrologyClass === "string") return "elevation-hydrology";

    return "unknown-upstream";
  }

  function applyAtlasExpression(samplePacket, point) {
    let rgb = normalizeRgb(
      samplePacket.rgb ||
      samplePacket.color ||
      samplePacket.baseColor ||
      samplePacket.finalColorHint,
      samplePacket.isWater ? PALETTE.water : PALETTE.land
    );

    const n = textureNoise(point, 733);

    const water = clamp01(
      numberField(samplePacket, "waterFillMaterialFeed", 0) * 0.34 +
      numberField(samplePacket, "waterFillStrength", 0) * 0.28 +
      numberField(samplePacket, "waterDepth", 0) * 0.18 +
      (samplePacket.isWater ? 0.12 : 0)
    );

    const coast = clamp01(
      numberField(samplePacket, "waterlineMaterialFeed", 0) * 0.24 +
      numberField(samplePacket, "shorelineGrounding", 0) * 0.20 +
      numberField(samplePacket, "beachMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "wetStoneMaterialFeed", 0) * 0.16 +
      numberField(samplePacket, "hardCoastMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "cliffWaterEdgeMaterialFeed", 0) * 0.12
    );

    const relief = clamp01(
      numberField(samplePacket, "terrainRelief", 0) * 0.24 +
      numberField(samplePacket, "ridgeRelief", 0) * 0.18 +
      numberField(samplePacket, "mountainRangeMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "ridgeChainMaterialFeed", 0) * 0.16 +
      numberField(samplePacket, "canyonCarveMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "canyonDepthMaterialFeed", 0) * 0.16
    );

    const shelf = clamp01(
      numberField(samplePacket, "shallowShelfMaterialFeed", 0) * 0.24 +
      numberField(samplePacket, "sandShelfMaterialFeed", 0) * 0.18 +
      numberField(samplePacket, "shelfTransition", 0) * 0.16
    );

    const scar = clamp01(
      numberField(samplePacket, "submergedScarMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "submergedBlockMaterialFeed", 0) * 0.18 +
      numberField(samplePacket, "oldCoastalTechUnderwaterMaterialFeed", 0) * 0.14 +
      numberField(samplePacket, "boundaryMorphologyFeed", 0) * 0.12
    );

    const peak = clamp01(
      numberField(samplePacket, "peakMassifMaterialFeed", 0) * 0.32 +
      numberField(samplePacket, "coordinateSummitMaterialFeed", 0) * 0.18
    );

    const canyon = clamp01(
      numberField(samplePacket, "canyonCarveMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "canyonDepthMaterialFeed", 0) * 0.24 +
      numberField(samplePacket, "exposedWaterCutMaterialFeed", 0) * 0.20
    );

    if (water > 0.10) rgb = mixColor(rgb, PALETTE.water, water * 0.08);
    if (water > 0.34) rgb = mixColor(rgb, PALETTE.deepWater, water * 0.10);
    if (shelf > 0.12) rgb = mixColor(rgb, PALETTE.shelf, shelf * 0.10);
    if (coast > 0.12) rgb = mixColor(rgb, PALETTE.wetStone, coast * 0.08);
    if (relief > 0.14 && !samplePacket.isWater) rgb = mixColor(rgb, PALETTE.ridge, relief * 0.10);
    if (peak > 0.12 && !samplePacket.isWater) rgb = mixColor(rgb, PALETTE.peak, peak * 0.10);
    if (canyon > 0.12) rgb = mixColor(rgb, PALETTE.canyon, canyon * 0.12);
    if (scar > 0.10) rgb = mixColor(rgb, PALETTE.scar, scar * 0.10);

    const greenSuppression = clamp01(scar * 0.08 + canyon * 0.06 + relief * 0.03 + water * 0.04);
    rgb[1] = clamp(Math.round(rgb[1] * (1 - greenSuppression)), 0, 255);

    const microContrast = 1 + (n - 0.5) * (0.030 + relief * 0.030 + coast * 0.014);
    return scaleColor(rgb, microContrast);
  }

  function normalizeSample(raw, point, fallbackUsed) {
    const source = raw && typeof raw === "object" ? raw : fallbackTerrain(point);
    const sourceType = classifySampleSource(source, fallbackUsed);
    const rgb = applyAtlasExpression(source, point);

    const terrainClass =
      stringField(source, "terrainClass") ||
      stringField(source, "worldTerrainClass") ||
      stringField(source, "expandedTerrainClass") ||
      stringField(source, "semanticTerrainClass") ||
      (boolField(source, "isWater", false) ? "ocean_basin" : "continent_mass");

    const isWater = boolField(source, "isWater", terrainClass.includes("water") || terrainClass.includes("ocean"));
    const isLand = boolField(source, "isLand", !isWater);
    const isCoast = terrainClass.includes("coast") || terrainClass.includes("shore") || numberField(source, "waterlineMaterialFeed", 0) > 0.25;
    const relief = clamp01(
      numberField(source, "terrainRelief", 0) +
      numberField(source, "ridgeRelief", 0) +
      numberField(source, "mountainRangeMaterialFeed", 0) +
      numberField(source, "canyonCarveMaterialFeed", 0)
    );

    return {
      ...source,
      contract: source.contract || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER" : "UNKNOWN_MATERIAL_SOURCE"),
      receipt: source.receipt || (fallbackUsed ? "HEARTH_CANVAS_EAST_EMERGENCY_F13_ATLAS_CARRIER_RECEIPT" : "UNKNOWN_MATERIAL_RECEIPT"),
      eastContract: CONTRACT,
      eastReceipt: RECEIPT,
      compatibilityContract: COMPATIBILITY_CONTRACT,
      sourceType,
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
      alpha: clamp01(numberField(source, "alpha", 1)),
      terrainClass,
      isWater,
      isLand,
      isCoast,
      relief,
      canonicalMaterialSample: sourceType === "canonical-material",
      materialSample: sourceType === "canonical-material" || sourceType === "material",
      elevationHydrologySample: sourceType === "elevation-hydrology",
      fallbackSample: sourceType === "fallback",
      unknownUpstreamSample: sourceType === "unknown-upstream",
      atlasExpressionApplied: true,
      canvasEastSourceOnly: true,
      canvasStillDoesNotOwnPlanetTruth: true,
      canvasEastDoesNotOwnMaterialTruth: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
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

  function sampleWithAuthority(point = {}, authority = null, options = {}) {
    const p = normalizePoint(point);
    const materialAuthority = authority || getMaterialAuthority();

    if (options.syncBridge !== false) {
      syncMaterialBridge({
        authority: materialAuthority,
        updateDataset: options.updateDataset !== false,
        invalidate: false
      });
    }

    let raw = null;
    let fallbackUsed = false;

    if (materialAuthority) {
      const sampler = materialSampler || resolveMaterialSampler(materialAuthority);
      if (sampler) raw = sampler(p);
    }

    if (!raw || typeof raw !== "object") {
      raw = fallbackTerrain(p);
      fallbackUsed = true;
      state.fallbackSampleUsedAtRuntime = true;
      state.sevenContinentFallbackUsed = true;
      state.emergencyFallbackUsed = Boolean(state.emergencyF13Requested);
      state.sevenContinentFallbackSuppressedByUpstream = false;
    } else {
      state.sevenContinentFallbackSuppressedByUpstream = true;
    }

    state.lastSampleAt = nowIso();

    return normalizeSample(raw, p, fallbackUsed);
  }

  function sample(point = {}, b, c) {
    try {
      return sampleWithAuthority(normalizePoint(point, b, c), getMaterialAuthority(), {
        syncBridge: true,
        updateDataset: false
      });
    } catch (error) {
      recordError("SAMPLE_FAILED_USING_FALLBACK", error);
      return normalizeSample(fallbackTerrain(normalizePoint(point, b, c)), normalizePoint(point, b, c), true);
    }
  }

  function read(point = {}, b, c) {
    return sample(point, b, c);
  }

  function createAtlasCanvas(width, height) {
    if (!doc || !isFunction(doc.createElement)) {
      throw new Error("Canvas East requires document.createElement to build atlas.");
    }

    const canvas = doc.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    canvas.dataset.hearthCanvasEastAtlas = "true";
    canvas.dataset.hearthCanvasEastContract = CONTRACT;
    canvas.dataset.hearthCanvasEastReceipt = RECEIPT;
    canvas.dataset.hearthCanvasEastCompatibilityContract = COMPATIBILITY_CONTRACT;
    canvas.dataset.hearthCanvasEastParentAuthorityAcclimation = "true";
    canvas.dataset.hearthCanvasEastParentAuthorityIsUpstream = "true";
    canvas.dataset.hearthCanvasEastAccustomsToParent = "true";
    canvas.dataset.hearthCanvasEastParentRenewalNotInferredFromEastAudit = "true";
    canvas.dataset.hearthCanvasEastParentObservationRenewalSplit = "true";
    canvas.dataset.hearthCanvasEastParentObservationDoesNotEqualRenewal = "true";
    canvas.dataset.hearthCanvasEastParentContractExactMatchRequired = "false";
    canvas.dataset.hearthCanvasEastSynchronousHeldPacket = "true";
    canvas.dataset.hearthCanvasEastGovernedParentAligned = "true";
    canvas.dataset.hearthCanvasEastAfterWestReleaseOnly = "true";
    canvas.dataset.hearthCanvasEastSourceOnly = "true";
    canvas.dataset.hearthCanvasEastF13Only = "true";
    canvas.dataset.hearthCanvasEastTransistorRole = "source";
    canvas.dataset.hearthCanvasEastMaterialAtlasPrimary = "true";
    canvas.dataset.hearthCanvasEastVisibleProof = "false";
    canvas.dataset.hearthCanvasEastCanvasReady = "false";
    canvas.dataset.hearthCanvasEastF21Claimed = "false";
    canvas.dataset.hearthCanvasEastReadyTextClaimed = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    return canvas;
  }

  function yieldBuildFrame() {
    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => resolve());
      } else {
        root.setTimeout(resolve, 0);
      }
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
    state.atlasBuildElapsedMs = 0;
    state.atlasCanvasPresent = false;
    state.atlasWidth = width;
    state.atlasHeight = height;
    state.atlasPixelCount = width * height;

    state.atlasCanonicalMaterialSampleCount = 0;
    state.atlasMaterialSampleCount = 0;
    state.atlasElevationHydrologySampleCount = 0;
    state.atlasFallbackSampleCount = 0;
    state.atlasUnknownUpstreamSampleCount = 0;
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

    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.visualPassClaimed = false;

    state.updatedAt = state.atlasBuildStartedAt;

    recordLocal("F13E_ATLAS_BUILD_STARTED", {
      width,
      height,
      mode,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      permissionSource: state.f13PermissionSource,
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentObservationRenewalSplitActive: true,
      apiWasReadyBeforeBuild: true
    });
  }

  function countSample(material, classSet) {
    state.atlasTotalSampleCount += 1;

    if (material.canonicalMaterialSample) state.atlasCanonicalMaterialSampleCount += 1;
    if (material.materialSample) state.atlasMaterialSampleCount += 1;
    if (material.elevationHydrologySample) state.atlasElevationHydrologySampleCount += 1;
    if (material.fallbackSample) state.atlasFallbackSampleCount += 1;
    if (material.unknownUpstreamSample) state.atlasUnknownUpstreamSampleCount += 1;
    if (material.isLand) state.atlasLandSampleCount += 1;
    if (material.isWater) state.atlasWaterSampleCount += 1;
    if (material.isCoast) state.atlasCoastSampleCount += 1;
    if (material.relief > 0.18) state.atlasReliefSampleCount += 1;

    const className = material.terrainClass || material.materialClass || material.sourceType || "unknown";
    if (className) classSet.add(className);
  }

  function progressCallback(options, progress, detail = {}) {
    state.atlasBuildProgress = clamp(progress, 0, 100);
    state.updatedAt = nowIso();

    if (isFunction(options.onProgress)) {
      try {
        options.onProgress(state.atlasBuildProgress, {
          contract: CONTRACT,
          receipt: RECEIPT,
          compatibilityContract: COMPATIBILITY_CONTRACT,
          event: "ATLAS_BUILD_PROGRESS",
          fibonacci: ACTIVE_FIBONACCI_GATE,
          progress: state.atlasBuildProgress,
          detail: clonePlain(detail),
          canvasEastApiReady: true,
          canvasEastCurrent: true,
          visibleProof: false,
          visibleContentProof: false,
          visiblePlanetAvailable: false,
          canvasReady: false,
          f21ClaimedByCanvasEast: false,
          readyTextClaimedByCanvasEast: false,
          visualPassClaimed: false
        });
      } catch (error) {
        recordError("ATLAS_PROGRESS_CALLBACK_FAILED", error);
      }
    }

    updateDataset();
  }

  function finalizeAtlasBuild(width, height, mode, options = {}) {
    state.atlasBuildProgress = 100;
    state.atlasBuildComplete = true;
    state.atlasCanvasPresent = true;
    state.atlasInvalidated = false;
    state.atlasInvalidationReason = "";
    state.atlasBuildCompletedAt = nowIso();
    state.atlasBuildElapsedMs = Math.max(0, Date.parse(state.atlasBuildCompletedAt) - Date.parse(state.atlasBuildStartedAt));
    state.lastBuildAt = state.atlasBuildCompletedAt;
    state.f13SourceStageComplete = true;
    state.f13AtlasPacketReady = true;
    state.canvasEastEvidenceReady = true;
    state.firstFailedCoordinate = "NONE_F13F_ATLAS_PACKET_READY";
    state.recommendedNextFile = PARENT_FILE;
    state.recommendedNextRenewalTarget = PARENT_FILE;
    state.heldReasonClass = "NONE";
    state.parentObservationRequired = false;
    state.parentRenewalRequired = false;
    state.eastAcclimationRequired = false;
    state.parentReleasePending = false;
    state.westReleasePending = false;
    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.visualPassClaimed = false;
    state.updatedAt = state.atlasBuildCompletedAt;

    recordLocal("F13F_ATLAS_BUILD_COMPLETE", {
      width,
      height,
      mode,
      atlasPixelCount: state.atlasPixelCount,
      atlasClassCount: state.atlasClassCount,
      fallbackSamples: state.atlasFallbackSampleCount,
      materialSamples: state.atlasMaterialSampleCount,
      canonicalMaterialSamples: state.atlasCanonicalMaterialSampleCount,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      permissionSource: state.f13PermissionSource,
      apiReadyBeforeEvidence: true,
      parentAuthorityIsUpstream: true,
      evidenceReturnsToParent: true,
      visibleProof: false,
      canvasReady: false,
      f21ClaimedByCanvasEast: false,
      visualPassClaimed: false
    });

    updateDataset();
    publishGlobals();

    const packet = composeAtlasEvidencePacket({
      atlasCanvas,
      width,
      height
    });

    if (isFunction(options.onComplete)) {
      try {
        options.onComplete(packet);
      } catch (error) {
        recordError("ATLAS_COMPLETE_CALLBACK_FAILED", error);
      }
    }

    return packet;
  }

  function buildAtlasSync(options = {}, normalized = null, permission = null) {
    const localNormalized = normalized || normalizeCanvasEastInput(options);
    const gate = permission || resolveAtlasBuildPermission(localNormalized);

    if (!gate.canvasEastMayBuildAtlas || !gate.f13BuildLawful) {
      return composeHeldAtlasPacket(localNormalized, gate);
    }

    const width = clamp(
      Math.round(safeNumber(options.width || options.atlasWidth, DEFAULT_ATLAS_WIDTH)),
      MIN_ATLAS_WIDTH,
      MAX_ATLAS_WIDTH
    );

    const height = clamp(
      Math.round(safeNumber(options.height || options.atlasHeight, DEFAULT_ATLAS_HEIGHT)),
      MIN_ATLAS_HEIGHT,
      MAX_ATLAS_HEIGHT
    );

    const materialAuthority = localNormalized.emergencyF13Requested ? null : getMaterialAuthority();

    resetBuildCounters(width, height, "sync");

    syncMaterialBridge({
      authority: materialAuthority,
      updateDataset: false,
      invalidate: false
    });

    try {
      atlasCanvas = createAtlasCanvas(width, height);
      const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });

      if (!ctx) {
        throw new Error("Canvas East could not create atlas 2D context.");
      }

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const classSet = new Set();

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0.5 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0.5 : x / (width - 1);
          const material = sampleWithAuthority({ u, v }, materialAuthority, {
            syncBridge: false,
            updateDataset: false
          });

          countSample(material, classSet);

          const offset = (y * width + x) * 4;
          const rgb = normalizeRgb(material.rgb || material.color, PALETTE.void);
          const alpha = clamp(Math.round(clamp01(material.alpha === undefined ? 1 : material.alpha) * 255), 0, 255);

          data[offset] = rgb[0];
          data[offset + 1] = rgb[1];
          data[offset + 2] = rgb[2];
          data[offset + 3] = alpha;
        }

        if (y % 32 === 0 || y === height - 1) {
          progressCallback(options, Math.round(((y + 1) / height) * 100), {
            row: y,
            height,
            mode: "sync"
          });
        }
      }

      ctx.putImageData(imageData, 0, 0);
      lastAtlasImageData = imageData;

      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);

      return finalizeAtlasBuild(width, height, "sync", options);
    } catch (error) {
      state.atlasBuildError = error && error.message ? error.message : String(error);
      state.atlasBuildComplete = false;
      state.f13SourceStageComplete = false;
      state.f13AtlasPacketReady = false;
      state.canvasEastEvidenceReady = false;
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_BUILD";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.heldReasonClass = "EAST_ATLAS_BUILD_PENDING";
      state.parentObservationRequired = false;
      state.parentRenewalRequired = false;
      state.eastAcclimationRequired = false;
      state.parentReleasePending = false;
      state.westReleasePending = false;
      state.f21EligibleForNorth = false;
      state.f21ClaimedByCanvasEast = false;
      state.readyTextClaimedByCanvasEast = false;
      state.completionLatched = false;
      state.visualPassClaimed = false;
      state.updatedAt = nowIso();

      recordError("ATLAS_BUILD_FAILED", error, {
        width,
        height,
        mode: "sync",
        permissionSource: state.f13PermissionSource
      });

      updateDataset();
      publishGlobals();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        parentFile: PARENT_FILE,
        compatibilityContract: COMPATIBILITY_CONTRACT,
        parentAuthorityIsUpstream: true,
        eastAccustomsToParent: true,
        parentRenewalNotInferredFromEastAudit: true,
        parentObservationRenewalSplitActive: true,
        parentFirstApiRecognitionBootstrapActive: true,
        parentAuthorityProfileActive: true,
        synchronousBuildAtlasDispatcherActive: true,
        canvasEastApiReady: true,
        canvasEastCurrent: true,
        requiredApiSurfaceComplete: true,
        atlasBuildStarted: true,
        atlasBuildComplete: false,
        atlasBuildError: state.atlasBuildError,
        f13SourceStageStarted: true,
        f13SourceStageComplete: false,
        f13AtlasPacketReady: false,
        canvasEastEvidenceReady: false,
        firstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_BUILD",
        heldReasonClass: "EAST_ATLAS_BUILD_PENDING",
        recommendedNextFile: FILE,
        recommendedNextRenewalTarget: FILE,
        visibleProof: false,
        visibleContentProof: false,
        visiblePlanetAvailable: false,
        canvasReady: false,
        f21EligibleForNorth: false,
        f21ClaimedByCanvasEast: false,
        readyTextClaimedByCanvasEast: false,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }
  }

  async function buildAtlasAsync(options = {}) {
    publishParentFirstApiSurface("buildAtlasAsync-entry");

    const normalized = normalizeCanvasEastInput(options);
    const permission = resolveAtlasBuildPermission(normalized);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(normalized, permission);
    }

    const width = clamp(
      Math.round(safeNumber(options.width || options.atlasWidth, DEFAULT_ATLAS_WIDTH)),
      MIN_ATLAS_WIDTH,
      MAX_ATLAS_WIDTH
    );

    const height = clamp(
      Math.round(safeNumber(options.height || options.atlasHeight, DEFAULT_ATLAS_HEIGHT)),
      MIN_ATLAS_HEIGHT,
      MAX_ATLAS_HEIGHT
    );

    const rowsPerChunk = clamp(Math.round(safeNumber(options.rowsPerChunk, 10)), 1, 40);
    const materialAuthority = normalized.emergencyF13Requested ? null : getMaterialAuthority();

    resetBuildCounters(width, height, "async");

    syncMaterialBridge({
      authority: materialAuthority,
      updateDataset: false,
      invalidate: false
    });

    try {
      atlasCanvas = createAtlasCanvas(width, height);
      const ctx = atlasCanvas.getContext("2d", { alpha: true, willReadFrequently: true });

      if (!ctx) {
        throw new Error("Canvas East could not create atlas 2D context.");
      }

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const classSet = new Set();

      for (let y = 0; y < height; y += 1) {
        const v = height <= 1 ? 0.5 : y / (height - 1);

        for (let x = 0; x < width; x += 1) {
          const u = width <= 1 ? 0.5 : x / (width - 1);
          const material = sampleWithAuthority({ u, v }, materialAuthority, {
            syncBridge: false,
            updateDataset: false
          });

          countSample(material, classSet);

          const offset = (y * width + x) * 4;
          const rgb = normalizeRgb(material.rgb || material.color, PALETTE.void);
          const alpha = clamp(Math.round(clamp01(material.alpha === undefined ? 1 : material.alpha) * 255), 0, 255);

          data[offset] = rgb[0];
          data[offset + 1] = rgb[1];
          data[offset + 2] = rgb[2];
          data[offset + 3] = alpha;
        }

        if (y % rowsPerChunk === 0 || y === height - 1) {
          progressCallback(options, Math.round(((y + 1) / height) * 100), {
            row: y,
            height,
            mode: "async"
          });
          await yieldBuildFrame();
        }
      }

      ctx.putImageData(imageData, 0, 0);
      lastAtlasImageData = imageData;

      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);

      return finalizeAtlasBuild(width, height, "async", options);
    } catch (error) {
      state.atlasBuildError = error && error.message ? error.message : String(error);
      state.atlasBuildComplete = false;
      state.f13SourceStageComplete = false;
      state.f13AtlasPacketReady = false;
      state.canvasEastEvidenceReady = false;
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_BUILD";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.heldReasonClass = "EAST_ATLAS_BUILD_PENDING";
      state.parentObservationRequired = false;
      state.parentRenewalRequired = false;
      state.eastAcclimationRequired = false;
      state.parentReleasePending = false;
      state.westReleasePending = false;
      state.f21EligibleForNorth = false;
      state.f21ClaimedByCanvasEast = false;
      state.readyTextClaimedByCanvasEast = false;
      state.completionLatched = false;
      state.visualPassClaimed = false;
      state.updatedAt = nowIso();

      recordError("ATLAS_BUILD_FAILED", error, {
        width,
        height,
        mode: "async",
        permissionSource: state.f13PermissionSource
      });

      updateDataset();
      publishGlobals();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        parentFile: PARENT_FILE,
        compatibilityContract: COMPATIBILITY_CONTRACT,
        parentAuthorityIsUpstream: true,
        eastAccustomsToParent: true,
        parentRenewalNotInferredFromEastAudit: true,
        parentObservationRenewalSplitActive: true,
        parentFirstApiRecognitionBootstrapActive: true,
        parentAuthorityProfileActive: true,
        synchronousBuildAtlasDispatcherActive: true,
        canvasEastApiReady: true,
        canvasEastCurrent: true,
        requiredApiSurfaceComplete: true,
        atlasBuildStarted: true,
        atlasBuildComplete: false,
        atlasBuildError: state.atlasBuildError,
        f13SourceStageStarted: true,
        f13SourceStageComplete: false,
        f13AtlasPacketReady: false,
        canvasEastEvidenceReady: false,
        firstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_BUILD",
        heldReasonClass: "EAST_ATLAS_BUILD_PENDING",
        recommendedNextFile: FILE,
        recommendedNextRenewalTarget: FILE,
        visibleProof: false,
        visibleContentProof: false,
        visiblePlanetAvailable: false,
        canvasReady: false,
        f21EligibleForNorth: false,
        f21ClaimedByCanvasEast: false,
        readyTextClaimedByCanvasEast: false,
        generatedImage: false,
        graphicBox: false,
        webGL: false,
        visualPassClaimed: false
      };
    }
  }

  function buildAtlas(options = {}) {
    publishParentFirstApiSurface("buildAtlas-sync-dispatcher-entry");

    const normalized = normalizeCanvasEastInput(options);
    const permission = resolveAtlasBuildPermission(normalized);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(normalized, permission);
    }

    if (options && (options.async === true || options.defer === true || options.nonBlocking === true)) {
      state.buildAtlasReturnedPromise = true;
      return buildAtlasAsync(options);
    }

    return buildAtlasSync(options, normalized, permission);
  }

  function invalidateAtlas(reason = "manual-invalidation", options = {}) {
    state.atlasInvalidationCount += 1;
    state.atlasInvalidated = true;
    state.atlasInvalidationReason = safeString(reason, "manual-invalidation");
    state.atlasBuildComplete = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceReady = false;
    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.visualPassClaimed = false;
    state.updatedAt = nowIso();

    atlasCanvas = null;
    lastAtlasImageData = null;

    recordLocal("ATLAS_INVALIDATED", {
      reason: state.atlasInvalidationReason,
      apiStillReady: true,
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentObservationRenewalSplitActive: true
    });

    if (!options.skipDataset) updateDataset();
    publishGlobals();

    return getReceipt();
  }

  function getAtlasCanvas() {
    return atlasCanvas;
  }

  function getLastAtlasImageData() {
    return lastAtlasImageData;
  }

  function composeCanvasEastReceipt() {
    return getReceipt();
  }

  function getCanvasEastGateReceipt() {
    return getReceipt();
  }

  function getReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      compatibilityContract: COMPATIBILITY_CONTRACT,
      compatibilityReceipt: COMPATIBILITY_RECEIPT,
      expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
      expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,
      version: VERSION,
      file: FILE,
      parentFile: PARENT_FILE,
      westFile: WEST_FILE,
      routeFile: ROUTE_FILE,
      role: state.role,

      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentContractExactMatchRequired: false,
      eastRecognitionMismatchRepairTarget: FILE,
      parentObservationRenewalSplitActive: true,
      parentObservationDoesNotEqualRenewal: true,

      parentFirstApiRecognitionBootstrapActive: true,
      parentAuthorityProfileActive: true,
      synchronousBuildAtlasDispatcherActive: true,
      synchronousHeldPacketActive: true,
      asyncHeldPacketRetired: true,
      parentFirstApiPublished: state.parentFirstApiPublished,
      parentCompatibilityAliasesPublished: state.parentCompatibilityAliasesPublished,
      datasetFirstProofPublished: state.datasetFirstProofPublished,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      requiredApiSurfaceComplete: true,
      requiredMethods: state.requiredMethods.slice(),
      buildAtlasAvailable: true,
      buildAtlasSyncAvailable: true,
      buildAtlasAsyncAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,
      getReceiptTextAvailable: true,

      canvasEastPresent: true,
      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,

      heldAtlasPacketReturned: state.heldAtlasPacketReturned,
      heldPacketWasSynchronous: state.heldPacketWasSynchronous,
      buildAtlasReturnedPromise: state.buildAtlasReturnedPromise,
      heldDoesNotMeanApiMissing: true,
      heldDoesNotMeanParentRenewalUnlessCorruptOrStale: true,
      heldMayMeanParentObservationPending: true,
      heldMayMeanWestReleasePending: true,
      heldMayMeanParentReleasePending: true,

      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,
      heldReasonClass: state.heldReasonClass,

      parentAuthorityProfile: clonePlain(state.lastParentAuthorityProfile),
      parentObserved: state.parentObserved,
      parentApiPresent: state.parentApiPresent,
      parentCallable: state.parentCallable,
      parentReceiptObserved: state.parentReceiptObserved,
      parentContract: state.parentContract,
      parentReceiptId: state.parentReceiptId,
      parentReleaseObserved: state.parentReleaseObserved,
      parentRequestObserved: state.parentRequestObserved,
      parentAuthorityAccepted: state.parentAuthorityAccepted,
      parentRecognitionMismatch: state.parentRecognitionMismatch,
      parentAbsent: state.parentAbsent,
      parentCorruptOrStale: state.parentCorruptOrStale,
      parentRecommendedForRenewal: state.parentRecommendedForRenewal,
      eastRecommendedForAcclimation: state.eastRecommendedForAcclimation,
      parentObservationRequired: state.parentObservationRequired,
      parentRenewalRequired: state.parentRenewalRequired,
      eastAcclimationRequired: state.eastAcclimationRequired,
      parentReleasePending: state.parentReleasePending,
      westReleasePending: state.westReleasePending,
      parentProfileFirstFailedCoordinate: state.parentProfileFirstFailedCoordinate,

      westReleaseObserved: state.westReleaseObserved,
      westReleaseRequired: state.westReleaseRequired,
      westAuditObserved: state.westAuditObserved,
      westAuditPassed: state.westAuditPassed,
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: state.westAuditBlocked,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,

      emergencyF13Requested: state.emergencyF13Requested,
      emergencyF13Reason: state.emergencyF13Reason,
      emergencyF13AtlasPacket: state.emergencyF13AtlasPacket,

      newsProtocolSynchronized: true,
      newsFinalizedByCanvasEast: false,
      northGateReady: false,
      eastGateReady: true,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: false,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: false,

      fibonacciAlignmentSynchronized: true,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      oneActiveGearAtATime: true,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      cycleOrder: CYCLE_ORDER,

      materialReceiptBridge: getMaterialBridgeReceipt({ sync: false }),
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialExpectedContract: state.materialExpectedContract,
      materialExpectedReceipt: state.materialExpectedReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialPreviousContract: state.materialPreviousContract,
      materialBaselineContract: state.materialBaselineContract,
      materialVersion: state.materialVersion,
      materialRole: state.materialRole,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary,
      canvasStillDoesNotOwnPlanetTruth: true,
      canvasEastDoesNotOwnMaterialTruth: true,

      atlasSourceActive: true,
      upstreamFirstAtlasActive: true,
      atlasBuildRequested: state.atlasBuildRequested,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      atlasBuildError: state.atlasBuildError,
      atlasBuildStartedAt: state.atlasBuildStartedAt,
      atlasBuildCompletedAt: state.atlasBuildCompletedAt,
      atlasBuildElapsedMs: state.atlasBuildElapsedMs,
      atlasCanvasPresent: state.atlasCanvasPresent,
      atlasWidth: state.atlasWidth,
      atlasHeight: state.atlasHeight,
      atlasPixelCount: state.atlasPixelCount,

      atlasCanonicalMaterialSampleCount: state.atlasCanonicalMaterialSampleCount,
      atlasMaterialSampleCount: state.atlasMaterialSampleCount,
      atlasElevationHydrologySampleCount: state.atlasElevationHydrologySampleCount,
      atlasFallbackSampleCount: state.atlasFallbackSampleCount,
      atlasUnknownUpstreamSampleCount: state.atlasUnknownUpstreamSampleCount,
      atlasTotalSampleCount: state.atlasTotalSampleCount,
      atlasLandSampleCount: state.atlasLandSampleCount,
      atlasWaterSampleCount: state.atlasWaterSampleCount,
      atlasCoastSampleCount: state.atlasCoastSampleCount,
      atlasReliefSampleCount: state.atlasReliefSampleCount,
      atlasClassCount: state.atlasClassCount,
      atlasClasses: state.atlasClasses.slice(),

      sevenContinentFallbackEmergencyOnly: true,
      sevenContinentFallbackUsed: state.sevenContinentFallbackUsed,
      sevenContinentFallbackSuppressedByUpstream: state.sevenContinentFallbackSuppressedByUpstream,
      emergencyFallbackUsed: state.emergencyFallbackUsed,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlinesReadFromHydrologyAndMaterials: true,
      landChannelStillReceiverOnly: true,

      cachedAtlasInvalidationAvailable: true,
      atlasInvalidationCount: state.atlasInvalidationCount,
      atlasInvalidated: state.atlasInvalidated,
      atlasInvalidationReason: state.atlasInvalidationReason,
      fallbackSampleAvailable: true,
      fallbackSampleUsedAtRuntime: state.fallbackSampleUsedAtRuntime,

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      completionLatched: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      ownsSourceMaterialAtlas: true,
      ownsBuildAtlasMethod: true,
      ownsBuildAtlasSyncMethod: true,
      ownsBuildAtlasAsyncMethod: true,
      ownsSampleMethod: true,
      ownsReadMethod: true,
      ownsReceiptSurface: true,
      ownsParentFirstApiRecognition: true,
      ownsParentAuthorityProfile: true,
      ownsParentObservationRenewalSplit: true,
      ownsSynchronousHeldPacket: true,
      ownsEastAcclimationToParent: true,

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
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      publishedAt: state.publishedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const classes = (r.atlasClasses || []).join(",");
    const events = (r.localEvents || [])
      .slice(-36)
      .map((event) => `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .map((error) => `- ${error.at} :: ${error.code} :: ${error.message}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `baselineContract=${r.baselineContract}`,
      `baselineReceipt=${r.baselineReceipt}`,
      `compatibilityContract=${r.compatibilityContract}`,
      `compatibilityReceipt=${r.compatibilityReceipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `parentFile=${r.parentFile}`,
      `westFile=${r.westFile}`,
      `role=${r.role}`,
      "",
      "PARENT_AUTHORITY_ACCLIMATION",
      `parentAuthorityIsUpstream=${r.parentAuthorityIsUpstream}`,
      `eastAccustomsToParent=${r.eastAccustomsToParent}`,
      `parentRenewalNotInferredFromEastAudit=${r.parentRenewalNotInferredFromEastAudit}`,
      `parentContractExactMatchRequired=${r.parentContractExactMatchRequired}`,
      `eastRecognitionMismatchRepairTarget=${r.eastRecognitionMismatchRepairTarget}`,
      `parentObservationRenewalSplitActive=${r.parentObservationRenewalSplitActive}`,
      `parentObservationDoesNotEqualRenewal=${r.parentObservationDoesNotEqualRenewal}`,
      "",
      "API_SURFACE",
      `parentFirstApiRecognitionBootstrapActive=${r.parentFirstApiRecognitionBootstrapActive}`,
      `parentAuthorityProfileActive=${r.parentAuthorityProfileActive}`,
      `synchronousBuildAtlasDispatcherActive=${r.synchronousBuildAtlasDispatcherActive}`,
      `synchronousHeldPacketActive=${r.synchronousHeldPacketActive}`,
      `asyncHeldPacketRetired=${r.asyncHeldPacketRetired}`,
      `parentFirstApiPublished=${r.parentFirstApiPublished}`,
      `parentCompatibilityAliasesPublished=${r.parentCompatibilityAliasesPublished}`,
      `datasetFirstProofPublished=${r.datasetFirstProofPublished}`,
      `governedCanvasParentAligned=${r.governedCanvasParentAligned}`,
      `afterWestReleaseOnly=${r.afterWestReleaseOnly}`,
      `canvasEastSourceOnly=${r.canvasEastSourceOnly}`,
      `requiredApiSurfaceComplete=${r.requiredApiSurfaceComplete}`,
      `buildAtlasAvailable=${r.buildAtlasAvailable}`,
      `buildAtlasSyncAvailable=${r.buildAtlasSyncAvailable}`,
      `buildAtlasAsyncAvailable=${r.buildAtlasAsyncAvailable}`,
      `sampleAvailable=${r.sampleAvailable}`,
      `readAvailable=${r.readAvailable}`,
      `getReceiptAvailable=${r.getReceiptAvailable}`,
      `getReceiptTextAvailable=${r.getReceiptTextAvailable}`,
      `canvasEastApiReady=${r.canvasEastApiReady}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      "",
      "PARENT_PROFILE",
      `parentObserved=${r.parentObserved}`,
      `parentApiPresent=${r.parentApiPresent}`,
      `parentCallable=${r.parentCallable}`,
      `parentReceiptObserved=${r.parentReceiptObserved}`,
      `parentContract=${r.parentContract}`,
      `parentReceiptId=${r.parentReceiptId}`,
      `parentReleaseObserved=${r.parentReleaseObserved}`,
      `parentRequestObserved=${r.parentRequestObserved}`,
      `parentAuthorityAccepted=${r.parentAuthorityAccepted}`,
      `parentRecognitionMismatch=${r.parentRecognitionMismatch}`,
      `parentAbsent=${r.parentAbsent}`,
      `parentCorruptOrStale=${r.parentCorruptOrStale}`,
      `parentRecommendedForRenewal=${r.parentRecommendedForRenewal}`,
      `eastRecommendedForAcclimation=${r.eastRecommendedForAcclimation}`,
      `parentObservationRequired=${r.parentObservationRequired}`,
      `parentRenewalRequired=${r.parentRenewalRequired}`,
      `eastAcclimationRequired=${r.eastAcclimationRequired}`,
      `parentReleasePending=${r.parentReleasePending}`,
      `westReleasePending=${r.westReleasePending}`,
      `parentProfileFirstFailedCoordinate=${r.parentProfileFirstFailedCoordinate}`,
      "",
      "SYNCHRONOUS_HELD_PACKET",
      `heldAtlasPacketReturned=${r.heldAtlasPacketReturned}`,
      `heldPacketWasSynchronous=${r.heldPacketWasSynchronous}`,
      `buildAtlasReturnedPromise=${r.buildAtlasReturnedPromise}`,
      `heldDoesNotMeanApiMissing=${r.heldDoesNotMeanApiMissing}`,
      `heldDoesNotMeanParentRenewalUnlessCorruptOrStale=${r.heldDoesNotMeanParentRenewalUnlessCorruptOrStale}`,
      `heldMayMeanParentObservationPending=${r.heldMayMeanParentObservationPending}`,
      `heldMayMeanWestReleasePending=${r.heldMayMeanWestReleasePending}`,
      `heldMayMeanParentReleasePending=${r.heldMayMeanParentReleasePending}`,
      "",
      "BUILD_PERMISSION",
      `canvasEastMayBuildAtlas=${r.canvasEastMayBuildAtlas}`,
      `f13BuildLawful=${r.f13BuildLawful}`,
      `f13BuildBlockedReason=${r.f13BuildBlockedReason}`,
      `f13PermissionSource=${r.f13PermissionSource}`,
      `heldReasonClass=${r.heldReasonClass}`,
      `westReleaseObserved=${r.westReleaseObserved}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `emergencyF13Requested=${r.emergencyF13Requested}`,
      "",
      "NEWS_AND_FIBONACCI",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `newsFinalizedByCanvasEast=${r.newsFinalizedByCanvasEast}`,
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      "",
      "MATERIAL_BRIDGE",
      `materialReceiptBridgeActive=${r.materialReceiptBridgeActive}`,
      `materialNestedReceiptAvailable=${r.materialNestedReceiptAvailable}`,
      `materialContract=${r.materialContract}`,
      `materialReceipt=${r.materialReceipt}`,
      `materialContractMatchesExpected=${r.materialContractMatchesExpected}`,
      `materialReceiptMatchesExpected=${r.materialReceiptMatchesExpected}`,
      `canonicalMaterialAuthorityPresent=${r.canonicalMaterialAuthorityPresent}`,
      `canonicalMaterialConsumed=${r.canonicalMaterialConsumed}`,
      "",
      "ATLAS",
      `atlasBuildStarted=${r.atlasBuildStarted}`,
      `atlasBuildProgress=${r.atlasBuildProgress}`,
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `atlasBuildError=${r.atlasBuildError}`,
      `atlasCanvasPresent=${r.atlasCanvasPresent}`,
      `atlasWidth=${r.atlasWidth}`,
      `atlasHeight=${r.atlasHeight}`,
      `atlasPixelCount=${r.atlasPixelCount}`,
      `atlasClassCount=${r.atlasClassCount}`,
      `atlasClasses=${classes}`,
      "",
      "F13_F21_BOUNDARY",
      `f13SourceStageStarted=${r.f13SourceStageStarted}`,
      `f13SourceStageComplete=${r.f13SourceStageComplete}`,
      `f13AtlasPacketReady=${r.f13AtlasPacketReady}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21ClaimedByCanvasEast=${r.f21ClaimedByCanvasEast}`,
      `readyTextClaimedByCanvasEast=${r.readyTextClaimedByCanvasEast}`,
      `completionLatched=${r.completionLatched}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "OWNERSHIP",
      `ownsSourceMaterialAtlas=${r.ownsSourceMaterialAtlas}`,
      `ownsBuildAtlasMethod=${r.ownsBuildAtlasMethod}`,
      `ownsBuildAtlasSyncMethod=${r.ownsBuildAtlasSyncMethod}`,
      `ownsBuildAtlasAsyncMethod=${r.ownsBuildAtlasAsyncMethod}`,
      `ownsSampleMethod=${r.ownsSampleMethod}`,
      `ownsReadMethod=${r.ownsReadMethod}`,
      `ownsReceiptSurface=${r.ownsReceiptSurface}`,
      `ownsParentFirstApiRecognition=${r.ownsParentFirstApiRecognition}`,
      `ownsParentAuthorityProfile=${r.ownsParentAuthorityProfile}`,
      `ownsParentObservationRenewalSplit=${r.ownsParentObservationRenewalSplit}`,
      `ownsSynchronousHeldPacket=${r.ownsSynchronousHeldPacket}`,
      `ownsEastAcclimationToParent=${r.ownsEastAcclimationToParent}`,
      `ownsPlanetTruth=${r.ownsPlanetTruth}`,
      `ownsMaterialTruth=${r.ownsMaterialTruth}`,
      `ownsTextureComposition=${r.ownsTextureComposition}`,
      `ownsSphereRendering=${r.ownsSphereRendering}`,
      `ownsVisibleProof=${r.ownsVisibleProof}`,
      `ownsCanvasRelease=${r.ownsCanvasRelease}`,
      `ownsWestAudit=${r.ownsWestAudit}`,
      `ownsF21=${r.ownsF21}`,
      `ownsReadyText=${r.ownsReadyText}`,
      `ownsFinalVisualPassClaim=${r.ownsFinalVisualPassClaim}`,
      "",
      "LOCAL_EVENTS",
      events,
      "",
      "ERRORS",
      errors,
      "",
      "FINAL_CLAIMS",
      `visibleProof=${r.visibleProof}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `canvasReady=${r.canvasReady}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      "",
      `publishedAt=${r.publishedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasEastLoaded = "true";
    dataset.hearthCanvasEastPresent = "true";
    dataset.hearthCanvasEastContract = CONTRACT;
    dataset.hearthCanvasEastReceipt = RECEIPT;
    dataset.hearthCanvasEastPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasEastBaselineContract = BASELINE_CONTRACT;
    dataset.hearthCanvasEastCompatibilityContract = COMPATIBILITY_CONTRACT;
    dataset.hearthCanvasEastVersion = VERSION;

    dataset.hearthCanvasEastParentAuthorityIsUpstream = "true";
    dataset.hearthCanvasEastAccustomsToParent = "true";
    dataset.hearthCanvasEastParentRenewalNotInferredFromEastAudit = "true";
    dataset.hearthCanvasEastParentContractExactMatchRequired = "false";
    dataset.hearthCanvasEastRecognitionMismatchRepairTarget = FILE;
    dataset.hearthCanvasEastParentObservationRenewalSplitActive = "true";
    dataset.hearthCanvasEastParentObservationDoesNotEqualRenewal = "true";

    dataset.hearthCanvasEastParentFirstApiRecognition = "true";
    dataset.hearthCanvasEastParentAuthorityProfileActive = "true";
    dataset.hearthCanvasEastSynchronousBuildAtlasDispatcher = "true";
    dataset.hearthCanvasEastSynchronousHeldPacket = "true";
    dataset.hearthCanvasEastAsyncHeldPacketRetired = "true";
    dataset.hearthCanvasEastParentFirstApiPublished = String(state.parentFirstApiPublished);
    dataset.hearthCanvasEastParentCompatibilityAliasesPublished = String(state.parentCompatibilityAliasesPublished);
    dataset.hearthCanvasEastDatasetFirstProofPublished = String(state.datasetFirstProofPublished);
    dataset.hearthCanvasEastGovernedParentAligned = "true";
    dataset.hearthCanvasEastAfterWestReleaseOnly = "true";
    dataset.hearthCanvasEastSourceOnly = "true";

    dataset.hearthCanvasEastRequiredApiSurfaceComplete = "true";
    dataset.hearthCanvasEastBuildAtlasAvailable = "true";
    dataset.hearthCanvasEastBuildAtlasSyncAvailable = "true";
    dataset.hearthCanvasEastBuildAtlasAsyncAvailable = "true";
    dataset.hearthCanvasEastSampleAvailable = "true";
    dataset.hearthCanvasEastReadAvailable = "true";
    dataset.hearthCanvasEastGetReceiptAvailable = "true";
    dataset.hearthCanvasEastGetReceiptTextAvailable = "true";
    dataset.hearthCanvasEastApiReady = "true";
    dataset.hearthCanvasEastCurrent = "true";
    dataset.hearthCanvasEastEvidenceReady = String(state.f13AtlasPacketReady);

    dataset.hearthCanvasEastParentObserved = String(state.parentObserved);
    dataset.hearthCanvasEastParentApiPresent = String(state.parentApiPresent);
    dataset.hearthCanvasEastParentCallable = String(state.parentCallable);
    dataset.hearthCanvasEastParentReceiptObserved = String(state.parentReceiptObserved);
    dataset.hearthCanvasEastParentContract = state.parentContract;
    dataset.hearthCanvasEastParentReceiptId = state.parentReceiptId;
    dataset.hearthCanvasEastParentReleaseObserved = String(state.parentReleaseObserved);
    dataset.hearthCanvasEastParentRequestObserved = String(state.parentRequestObserved);
    dataset.hearthCanvasEastParentAuthorityAccepted = String(state.parentAuthorityAccepted);
    dataset.hearthCanvasEastParentRecognitionMismatch = String(state.parentRecognitionMismatch);
    dataset.hearthCanvasEastParentAbsent = String(state.parentAbsent);
    dataset.hearthCanvasEastParentCorruptOrStale = String(state.parentCorruptOrStale);
    dataset.hearthCanvasEastParentRecommendedForRenewal = String(state.parentRecommendedForRenewal);
    dataset.hearthCanvasEastEastRecommendedForAcclimation = String(state.eastRecommendedForAcclimation);
    dataset.hearthCanvasEastParentObservationRequired = String(state.parentObservationRequired);
    dataset.hearthCanvasEastParentRenewalRequired = String(state.parentRenewalRequired);
    dataset.hearthCanvasEastEastAcclimationRequired = String(state.eastAcclimationRequired);
    dataset.hearthCanvasEastParentReleasePending = String(state.parentReleasePending);
    dataset.hearthCanvasEastWestReleasePending = String(state.westReleasePending);
    dataset.hearthCanvasEastHeldReasonClass = state.heldReasonClass;
    dataset.hearthCanvasEastParentProfileFirstFailedCoordinate = state.parentProfileFirstFailedCoordinate;

    dataset.hearthCanvasEastHeldAtlasPacketReturned = String(state.heldAtlasPacketReturned);
    dataset.hearthCanvasEastHeldPacketWasSynchronous = String(state.heldPacketWasSynchronous);
    dataset.hearthCanvasEastBuildAtlasReturnedPromise = String(state.buildAtlasReturnedPromise);
    dataset.hearthCanvasEastHeldDoesNotMeanApiMissing = "true";
    dataset.hearthCanvasEastHeldDoesNotMeanParentRenewalUnlessCorruptOrStale = "true";
    dataset.hearthCanvasEastHeldMayMeanParentObservationPending = "true";
    dataset.hearthCanvasEastHeldMayMeanWestReleasePending = "true";
    dataset.hearthCanvasEastHeldMayMeanParentReleasePending = "true";

    dataset.hearthCanvasEastMayBuildAtlas = String(state.canvasEastMayBuildAtlas);
    dataset.hearthCanvasEastF13BuildLawful = String(state.f13BuildLawful);
    dataset.hearthCanvasEastF13BuildBlockedReason = state.f13BuildBlockedReason;
    dataset.hearthCanvasEastF13PermissionSource = state.f13PermissionSource;

    dataset.hearthCanvasEastWestReleaseObserved = String(state.westReleaseObserved);
    dataset.hearthCanvasEastWestCanvasReleaseApproved = String(state.westCanvasReleaseApproved);
    dataset.hearthCanvasEastCanvasReleaseAuthorized = String(state.canvasReleaseAuthorized);
    dataset.hearthCanvasEastEmergencyF13Requested = String(state.emergencyF13Requested);

    dataset.hearthCanvasEastNewsProtocolSynchronized = "true";
    dataset.hearthCanvasEastNewsFinalized = "false";
    dataset.hearthCanvasEastNorthGateReady = "false";
    dataset.hearthCanvasEastEastGateReady = "true";
    dataset.hearthCanvasEastWestGateReady = String(state.westGateReady);
    dataset.hearthCanvasEastSouthGateReady = String(state.southGateReady);
    dataset.hearthCanvasEastCanvasGateReady = "false";
    dataset.hearthCanvasEastNewsGatePassedBeforeF21 = "false";
    dataset.hearthCanvasEastNewsGateDegradedBeforeF21 = "false";

    dataset.hearthCanvasEastFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasEastActiveFibonacciGate = ACTIVE_FIBONACCI_GATE;
    dataset.hearthCanvasEastFutureFibonacciGate = FUTURE_FIBONACCI_GATE;
    dataset.hearthCanvasEastOneActiveGearAtATime = "true";

    dataset.hearthCanvasEastMaterialReceiptBridgeActive = String(state.materialReceiptBridgeActive);
    dataset.hearthCanvasEastMaterialContract = state.materialContract;
    dataset.hearthCanvasEastMaterialReceipt = state.materialReceipt;
    dataset.hearthCanvasEastMaterialContractMatchesExpected = String(state.materialContractMatchesExpected);
    dataset.hearthCanvasEastMaterialReceiptMatchesExpected = String(state.materialReceiptMatchesExpected);
    dataset.hearthCanvasEastCanonicalMaterialConsumed = String(state.canonicalMaterialConsumed);

    dataset.hearthCanvasEastAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthCanvasEastAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthCanvasEastAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthCanvasEastAtlasCanvasPresent = String(state.atlasCanvasPresent);
    dataset.hearthCanvasEastAtlasWidth = String(state.atlasWidth);
    dataset.hearthCanvasEastAtlasHeight = String(state.atlasHeight);
    dataset.hearthCanvasEastAtlasClassCount = String(state.atlasClassCount);
    dataset.hearthCanvasEastFallbackSampleUsedAtRuntime = String(state.fallbackSampleUsedAtRuntime);
    dataset.hearthCanvasEastAtlasInvalidated = String(state.atlasInvalidated);
    dataset.hearthCanvasEastAtlasInvalidationReason = state.atlasInvalidationReason;

    dataset.hearthCanvasEastF13SourceStageStarted = String(state.f13SourceStageStarted);
    dataset.hearthCanvasEastF13SourceStageComplete = String(state.f13SourceStageComplete);
    dataset.hearthCanvasEastF13AtlasPacketReady = String(state.f13AtlasPacketReady);

    dataset.hearthCanvasEastF21EligibleForNorth = "false";
    dataset.hearthCanvasEastF21Claimed = "false";
    dataset.hearthCanvasEastReadyTextClaimed = "false";
    dataset.hearthCanvasEastCompletionLatched = "false";
    dataset.hearthCanvasEastVisibleProof = "false";
    dataset.hearthCanvasEastVisibleContentProof = "false";
    dataset.hearthCanvasEastVisiblePlanetAvailable = "false";
    dataset.hearthCanvasEastCanvasReady = "false";

    dataset.hearthCanvasEastFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthCanvasEastRecommendedNextFile = state.recommendedNextFile;
    dataset.hearthCanvasEastRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    state.datasetFirstProofPublished = true;
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasEast = api;
    root.HEARTH.canvasEastMaterialAtlasSourceMachine = api;
    root.HEARTH.canvasEastMaterialAtlasSourceTransistor = api;
    root.HEARTH.canvasEastF13AtlasSourceChild = api;
    root.HEARTH.canvasEastGovernedF13AtlasSource = api;
    root.HEARTH.canvasEastCurrentParentRecognizedF13AtlasSource = api;
    root.HEARTH.canvasEastParentFirstApiRecognitionBootstrap = api;
    root.HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource = api;
    root.HEARTH.canvasEastParentAuthorityAcclimationSyncHeldPacket = api;
    root.HEARTH.canvasEastParentObservationRenewalSplitSyncHeldPacket = api;
    root.HEARTH.canvasEastSource = api;

    root.HEARTH_CANVAS_EAST = api;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE = api;
    root.HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR = api;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP = api;
    root.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_PARENT_AUTHORITY_ACCLIMATION_SYNC_HELD_PACKET = api;
    root.HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET = api;
    root.HEARTH_CANVAS_EAST_SOURCE = api;

    root.DEXTER_LAB.hearthCanvasEast = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceTransistor = api;
    root.DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild = api;
    root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrap = api;
    root.DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastParentAuthorityAcclimationSyncHeldPacket = api;
    root.DEXTER_LAB.hearthCanvasEastParentObservationRenewalSplitSyncHeldPacket = api;
    root.DEXTER_LAB.hearthCanvasEastSource = api;

    const receipt = getReceipt();

    root.HEARTH_CANVAS_EAST_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_PARENT_AUTHORITY_ACCLIMATION_SYNC_HELD_PACKET_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_RECEIPT = receipt;

    root.HEARTH.canvasEastReceipt = receipt;
    root.HEARTH.canvasEastMaterialAtlasSourceMachineReceipt = receipt;
    root.HEARTH.canvasEastMaterialAtlasSourceTransistorReceipt = receipt;
    root.HEARTH.canvasEastF13AtlasSourceChildReceipt = receipt;
    root.HEARTH.canvasEastGovernedF13AtlasSourceReceipt = receipt;
    root.HEARTH.canvasEastCurrentParentRecognizedF13AtlasSourceReceipt = receipt;
    root.HEARTH.canvasEastParentFirstApiRecognitionBootstrapReceipt = receipt;
    root.HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = receipt;
    root.HEARTH.canvasEastParentAuthorityAcclimationSyncHeldPacketReceipt = receipt;
    root.HEARTH.canvasEastParentObservationRenewalSplitSyncHeldPacketReceipt = receipt;

    root.DEXTER_LAB.hearthCanvasEastReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachineReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceTransistorReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastF13AtlasSourceChildReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSourceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSourceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrapReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastParentAuthorityAcclimationSyncHeldPacketReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastParentObservationRenewalSplitSyncHeldPacketReceipt = receipt;

    root.__HEARTH_CANVAS_EAST_LOADED__ = true;
    root.__HEARTH_CANVAS_EAST_PRESENT__ = true;
    root.__HEARTH_CANVAS_EAST_FILE__ = FILE;
    root.__HEARTH_CANVAS_EAST_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_EAST_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_EAST_COMPATIBILITY_CONTRACT__ = COMPATIBILITY_CONTRACT;
    root.__HEARTH_CANVAS_EAST_PARENT_AUTHORITY_IS_UPSTREAM__ = true;
    root.__HEARTH_CANVAS_EAST_ACCUSTOMS_TO_PARENT__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_RENEWAL_NOT_INFERRED_FROM_EAST_AUDIT__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_CONTRACT_EXACT_MATCH_REQUIRED__ = false;
    root.__HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_ACTIVE__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_OBSERVATION_DOES_NOT_EQUAL_RENEWAL__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_AUTHORITY_PROFILE_ACTIVE__ = true;
    root.__HEARTH_CANVAS_EAST_SYNCHRONOUS_BUILD_ATLAS_DISPATCHER__ = true;
    root.__HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET__ = true;
    root.__HEARTH_CANVAS_EAST_ASYNC_HELD_PACKET_RETIRED__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_COMPATIBILITY_ALIASES_PUBLISHED__ = true;
    root.__HEARTH_CANVAS_EAST_REQUIRED_API_SURFACE_COMPLETE__ = true;
    root.__HEARTH_CANVAS_EAST_API_READY__ = true;
    root.__HEARTH_CANVAS_EAST_CURRENT__ = true;
    root.__HEARTH_CANVAS_EAST_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_EAST_READY_TEXT_CLAIMED__ = false;
    root.__HEARTH_CANVAS_EAST_VISUAL_PASS_CLAIMED__ = false;

    state.parentCompatibilityAliasesPublished = true;
    state.parentFirstApiPublished = true;
    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    updateDataset();
  }

  function publishParentFirstApiSurface(reason = "initial-parent-observation-renewal-split-api-publication") {
    state.parentFirstApiRecognitionBootstrapActive = true;
    state.parentAuthorityProfileActive = true;
    state.synchronousBuildAtlasDispatcherActive = true;
    state.synchronousHeldPacketActive = true;
    state.asyncHeldPacketRetired = true;
    state.requiredApiSurfaceComplete = true;
    state.buildAtlasAvailable = true;
    state.buildAtlasSyncAvailable = true;
    state.buildAtlasAsyncAvailable = true;
    state.sampleAvailable = true;
    state.readAvailable = true;
    state.getReceiptAvailable = true;
    state.getReceiptTextAvailable = true;
    state.canvasEastApiReady = true;
    state.canvasEastCurrent = true;
    state.canvasEastPresent = true;
    state.eastGateReady = true;
    state.visibleProof = false;
    state.visibleContentProof = false;
    state.visiblePlanetAvailable = false;
    state.canvasReady = false;
    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;
    state.visualPassClaimed = false;

    publishGlobals();

    if (!state.localEvents.some((event) => event.event === "PARENT_OBSERVATION_RENEWAL_SPLIT_API_SURFACE_PUBLISHED")) {
      recordLocal("PARENT_OBSERVATION_RENEWAL_SPLIT_API_SURFACE_PUBLISHED", {
        reason,
        contract: CONTRACT,
        receipt: RECEIPT,
        compatibilityContract: COMPATIBILITY_CONTRACT,
        methods: REQUIRED_METHODS.slice(),
        parentAuthorityIsUpstream: true,
        eastAccustomsToParent: true,
        parentRenewalNotInferredFromEastAudit: true,
        parentObservationRenewalSplitActive: true,
        parentObservationDoesNotEqualRenewal: true,
        parentContractExactMatchRequired: false,
        apiReadyBeforeAtlasEvidence: true,
        synchronousHeldPacketActive: true,
        asyncHeldPacketRetired: true,
        atlasEvidenceReady: state.f13AtlasPacketReady,
        noF21Claim: true,
        visualPassClaimed: false
      });
    }

    return getReceipt();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    westFile: WEST_FILE,
    routeFile: ROUTE_FILE,

    buildAtlas,
    buildAtlasSync,
    buildAtlasAsync,
    sample,
    read,
    getReceipt,

    normalizeCanvasEastInput,
    readParentAuthorityProfile,
    readParentState,
    readGovernedParentState: readParentAuthorityProfile,
    readWestReleaseState,
    resolveParentRequest,
    resolveWestRelease,
    resolveAtlasBuildPermission,
    composeAtlasBuildPermissionPacket,
    composeHeldAtlasPacket,
    composeAtlasEvidencePacket,
    composeEmergencyF13AtlasPacket,
    composeCanvasEastReceipt,
    getCanvasEastGateReceipt,

    invalidateAtlas,
    refreshMaterialBridge,
    getMaterialBridgeReceipt,
    getReceiptText,
    getAtlasCanvas,
    getLastAtlasImageData,
    publishParentFirstApiSurface,

    requiredApiSurfaceComplete: true,
    buildAtlasAvailable: true,
    buildAtlasSyncAvailable: true,
    buildAtlasAsyncAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getReceiptAvailable: true,
    getReceiptTextAvailable: true,

    canvasEastApiReady: true,
    canvasEastCurrent: true,
    canvasEastPresent: true,
    parentAuthorityIsUpstream: true,
    eastAccustomsToParent: true,
    parentRenewalNotInferredFromEastAudit: true,
    parentContractExactMatchRequired: false,
    eastRecognitionMismatchRepairTarget: FILE,
    parentObservationRenewalSplitActive: true,
    parentObservationDoesNotEqualRenewal: true,

    parentFirstApiRecognitionBootstrapActive: true,
    parentAuthorityProfileActive: true,
    synchronousBuildAtlasDispatcherActive: true,
    synchronousHeldPacketActive: true,
    asyncHeldPacketRetired: true,
    parentCompatibilityAliasesPublished: true,
    governedCanvasParentAligned: true,
    afterWestReleaseOnly: true,
    canvasEastSourceOnly: true,

    newsProtocolSynchronized: true,
    newsFinalizedByCanvasEast: false,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,

    ownsSourceMaterialAtlas: true,
    ownsBuildAtlasMethod: true,
    ownsBuildAtlasSyncMethod: true,
    ownsBuildAtlasAsyncMethod: true,
    ownsSampleMethod: true,
    ownsReadMethod: true,
    ownsReceiptSurface: true,
    ownsParentFirstApiRecognition: true,
    ownsParentAuthorityProfile: true,
    ownsParentObservationRenewalSplit: true,
    ownsSynchronousHeldPacket: true,
    ownsEastAcclimationToParent: true,

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
  };

  try {
    state.updatedAt = nowIso();

    publishParentFirstApiSurface("initial-load-before-material-bridge");

    try {
      syncMaterialBridge({
        updateDataset: false,
        invalidate: false
      });
    } catch (materialError) {
      recordError("MATERIAL_BRIDGE_SYNC_NONBLOCKING_FAILURE", materialError, {
        apiAlreadyPublished: true,
        apiReadinessUnaffected: true
      });
    }

    try {
      readParentAuthorityProfile({});
    } catch (profileError) {
      recordError("PARENT_AUTHORITY_PROFILE_NONBLOCKING_FAILURE", profileError, {
        apiAlreadyPublished: true,
        apiReadinessUnaffected: true
      });
    }

    publishParentFirstApiSurface("post-material-bridge-and-parent-profile-api-confirmation");

    recordLocal("CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_LOADED", {
      file: FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      compatibilityContract: COMPATIBILITY_CONTRACT,
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentObservationRenewalSplitActive: true,
      parentObservationDoesNotEqualRenewal: true,
      parentContractExactMatchRequired: false,
      parentFirstApiPublished: true,
      parentCompatibilityAliasesPublished: true,
      datasetFirstProofPublished: true,
      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,
      buildAtlasAlwaysCallable: true,
      buildAtlasHeldPathSynchronous: true,
      heldAtlasPacketDoesNotMeanApiMissing: true,
      heldDoesNotMeanParentRenewalUnlessCorruptOrStale: true,
      heldMayMeanParentObservationPending: true,
      heldMayMeanWestReleasePending: true,
      heldMayMeanParentReleasePending: true,
      asyncHeldPacketRetired: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    });
  } catch (error) {
    recordError("CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_INITIALIZATION_FAILED", error);

    try {
      publishGlobals();
      updateDataset();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
