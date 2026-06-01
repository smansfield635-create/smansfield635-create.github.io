// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE_TNT_v8
// Full-file replacement.
// Canvas East / spine-nodal source platform / synchronous held-packet / parent-accepted F13 atlas source.
// Purpose:
// - Publish Canvas East API before parent scans, West scans, material scans, atlas builds, receipt expansion, or async branches.
// - Make Canvas East impossible for the route conductor and Canvas parent to miss.
// - Anchor directly to the upstream route conductor central station:
//   HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_TNT_v7.
// - Anchor directly to the upstream Canvas parent:
//   HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_TNT_v8.
// - Keep East as source/intake only.
// - Distinguish East API visibility from East F13 atlas evidence.
// - Return synchronous held packets when parent / West / release permission is not sufficient.
// - Treat held packets as lawful non-evidence, not API failure.
// - Build F13E/F13F atlas evidence only after lawful parent/West release.
// - Return atlas evidence to the Canvas parent, not to North, South, route conductor, or final visual pass.
// Does not own:
// - planet truth
// - elevation truth
// - hydrology truth
// - material truth
// - texture composition
// - sphere rendering
// - visible proof
// - Canvas release authority
// - West admissibility audit
// - runtime-table governance
// - route orchestration
// - NEWS finalization
// - F21
// - ready text
// - final visual pass claim
// No generated image. No GraphicBox. No WebGL. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE_TNT_v8";
  const RECEIPT = "HEARTH_CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE_RECEIPT_v8";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_TNT_v7";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_RECEIPT_v7";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_TNT_v7";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_RECEIPT_v7";

  const COMPATIBILITY_CONTRACT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_TNT_v5";
  const COMPATIBILITY_RECEIPT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT_v5";

  const ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_TNT_v7";
  const ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION_RECEIPT_v7";

  const CURRENT_PARENT_CONTRACT = "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_TNT_v8";
  const CURRENT_PARENT_RECEIPT = "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_RECEIPT_v8";

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const VERSION = "2026-06-01.hearth-canvas-east-spine-nodal-parent-acceptance-sync-held-atlas-source-v8";

  const FILE = "/assets/hearth/hearth.canvas.east.js";
  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";
  const WEST_FILE = "/assets/lab/runtime-table.west.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";

  const ACTIVE_FIBONACCI_GATE = "F13E_F13F";
  const F13E_GATE = "F13E_API_SOURCE_VISIBLE";
  const F13F_GATE = "F13F_ATLAS_EVIDENCE_READY";
  const FUTURE_FIBONACCI_GATE = "F21";
  const CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";

  const CHRONOLOGY = Object.freeze([
    "INDEX_CARRIER_HOST_READY",
    "ROUTE_F8_SELF_DUTY_READY",
    "MACRO_WEST_RELEASE_TO_CANVAS",
    "CANVAS_PARENT_RELEASE_ACCEPTED",
    "CANVAS_EAST_API_VISIBLE",
    "CANVAS_EAST_HELD_OR_ATLAS_EVIDENCE_CLASSIFIED",
    "CANVAS_WEST_INSPECTION_READY",
    "CANVAS_SOUTH_VISIBLE_PROOF_READY",
    "CANVAS_PARENT_F13_EVIDENCE_COMPLETE",
    "NORTH_F21_LATCH_ELIGIBILITY"
  ]);

  const REQUIRED_METHODS = Object.freeze([
    "buildAtlas",
    "buildAtlasSync",
    "buildAtlasAsync",
    "sample",
    "read",
    "getReceipt",
    "getReceiptLight",
    "getReceiptText",
    "publishApiSurface",
    "readParentAuthorityProfile",
    "readWestReleaseState",
    "resolveAtlasBuildPermission",
    "composeHeldAtlasPacket",
    "composeAtlasEvidencePacket"
  ]);

  const ACCEPTED_PARENT_CONTRACTS = Object.freeze([
    CURRENT_PARENT_CONTRACT,
    "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_TNT_v7",
    "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_TNT_v6",
    "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_TNT_v5",
    "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST_TNT_v4",
    "HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE_TNT_v3",
    "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_TNT_v1",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_AFTER_WEST_RELEASE_TNT_v1"
  ]);

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    ROUTE_CONDUCTOR_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_TNT_v6",
    "HEARTH_ROUTE_CONDUCTOR_MALE_PAIR_INDEX_SELECTOR_INTEGRATION_STRICT_F13_TNT_v5"
  ]);

  const RETIRED_PARENT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1",
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_RECEIPT_v1",
    "HEARTH_CANVAS_PARENT_IDENTITY_BOOT_HANDSHAKE_STALE_CONSUMPTION_GUARD_TNT_v4",
    "HEARTH_CANVAS_PARENT_IDENTITY_BOOT_HANDSHAKE_STALE_CONSUMPTION_GUARD_RECEIPT_v4",
    "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_TEXTURE_FRAME_PROOF_CLOSURE_TNT_v3",
    "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_SCHEMATIC_TNT_v2",
    "HEARTH_CANVAS_CARDINAL_SPLIT_NORTH_PARENT_TNT_v2",
    "HEARTH_CANVAS_SPLIT_ADAPTER_TRANSISTOR_GATE_NORTH_PARENT_TNT_v1"
  ]);

  const PERMISSION = Object.freeze({
    BUILD_ALLOWED_PARENT_RELEASE: "BUILD_ALLOWED_PARENT_RELEASE",
    BUILD_ALLOWED_WEST_RELEASE: "BUILD_ALLOWED_WEST_RELEASE",
    HELD_PARENT_OBSERVATION_PENDING: "HELD_PARENT_OBSERVATION_PENDING",
    HELD_PARENT_RELEASE_PENDING: "HELD_PARENT_RELEASE_PENDING",
    HELD_WEST_RELEASE_PENDING: "HELD_WEST_RELEASE_PENDING",
    HELD_PARENT_STALE_OR_CORRUPT: "HELD_PARENT_STALE_OR_CORRUPT",
    HELD_EAST_RECOGNITION_MISMATCH: "HELD_EAST_RECOGNITION_MISMATCH",
    BLOCKED_FALSE_PROMOTION: "BLOCKED_FALSE_PROMOTION"
  });

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;

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
  let publishDepth = 0;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    currentParentContract: CURRENT_PARENT_CONTRACT,
    currentParentReceipt: CURRENT_PARENT_RECEIPT,
    routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
    routeConductorReceipt: ROUTE_CONDUCTOR_RECEIPT,
    expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
    expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    westFile: WEST_FILE,
    routeFile: ROUTE_FILE,
    role: "canvas-east-spine-nodal-parent-acceptance-sync-held-atlas-source",

    spineNodalStructureActive: true,
    earlyApiSurfaceActive: true,
    aliasStationActive: true,
    datasetFirstProofActive: true,
    parentProfileNodeActive: true,
    westReleaseNodeActive: true,
    permissionGateNodeActive: true,
    synchronousHeldPacketNodeActive: true,
    atlasBuildNodeActive: true,
    parentReturnNodeActive: true,
    receiptLightFirstNodeActive: true,

    apiSurfacePublished: false,
    aliasesPublished: false,
    datasetFirstProofPublished: false,
    parentFirstApiPublished: false,
    routeConductorCentralStationConsumed: false,
    currentParentAcceptedExplicitly: false,

    requiredApiSurfaceComplete: true,
    requiredMethods: REQUIRED_METHODS.slice(),
    buildAtlasAvailable: true,
    buildAtlasSyncAvailable: true,
    buildAtlasAsyncAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getReceiptAvailable: true,
    getReceiptLightAvailable: true,
    getReceiptTextAvailable: true,
    canvasEastPresent: true,
    canvasEastCurrent: true,
    canvasEastReady: true,
    canvasEastApiReady: true,
    canvasEastEvidenceReady: false,

    parentAuthorityIsUpstream: true,
    eastAccustomsToParent: true,
    parentRenewalNotInferredFromEastAudit: true,
    parentObservationDoesNotEqualRenewal: true,
    parentContractExactMatchRequired: false,

    parentObserved: false,
    parentApiPresent: false,
    parentCallable: false,
    parentReceiptObserved: false,
    parentContract: "",
    parentReceiptId: "",
    parentReleaseObserved: false,
    parentReleaseAccepted: false,
    parentReleaseLawful: false,
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

    routeConductorObserved: false,
    routeConductorContractObserved: "",
    routeConductorReceiptObserved: "",
    routeConductorCentralStationActive: false,

    westReleaseObserved: false,
    westReleaseRequired: true,
    westAuditObserved: false,
    westAuditPassed: false,
    westAuditDegraded: false,
    westAuditBlocked: false,
    westCanvasReleaseApproved: false,
    canvasReleaseAuthorized: false,

    permissionClass: PERMISSION.HELD_PARENT_OBSERVATION_PENDING,
    canvasEastMayBuildAtlas: false,
    f13BuildLawful: false,
    f13BuildBlockedReason: "WAITING_PARENT_OBSERVATION",
    f13PermissionSource: "NONE",

    heldAtlasPacketReturned: false,
    heldPacketWasSynchronous: false,
    buildAtlasReturnedPromise: false,
    heldDoesNotMeanApiMissing: true,
    heldDoesNotMeanParentRenewalUnlessCorruptOrStale: true,
    heldMayMeanParentObservationPending: true,
    heldMayMeanWestReleasePending: true,
    heldMayMeanParentReleasePending: true,

    newsAlignmentProtocolActive: true,
    newsChronologicalOrderLocked: true,
    newsFinalizedByCanvasEast: false,
    chronology: CHRONOLOGY.slice(),
    chronologicalGateCount: CHRONOLOGY.length,
    chronologicalGatesSatisfied: 0,
    chronologicalFirstFailedGate: "CANVAS_EAST_ATLAS_EVIDENCE",
    chronologicalFirstFailedCoordinate: "WAITING_PARENT_OBSERVATION",

    fibonacciSynchronizationChronologyFirst: true,
    fibonacciAlignmentSynchronized: true,
    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationExpected: 100,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,
    fibonacciSynchronizationHardFail: false,
    fibonacciSynchronizationHoldReason: "WAITING_PARENT_OBSERVATION",
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    activeF13EGate: F13E_GATE,
    activeF13FGate: F13F_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    oneActiveGearAtATime: true,
    activeCycleNumber: 2,
    activeCycleRoute: CYCLE_ROUTE,
    activeCardinal: "EAST",
    activeStageId: "F13E_F13F_SPINE_NODAL_PARENT_ACCEPTANCE_ATLAS_SOURCE",
    activeGearId: "F13E_F13F_SPINE_NODAL_PARENT_ACCEPTANCE_ATLAS_SOURCE",
    activeNewsGate: "CANVAS_EAST_SOURCE",

    indexGateReady: true,
    routeF8GateReady: true,
    macroWestGateReady: false,
    canvasParentGateReady: false,
    canvasParentReleaseGateReady: false,
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
    materialExpectedContract: EXPECTED_MATERIAL_CONTRACT,
    materialExpectedReceipt: EXPECTED_MATERIAL_RECEIPT,
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
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
    canvasEastDoesNotOwnMaterialTruth: true,
    canvasStillDoesNotOwnPlanetTruth: true,

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

    fallbackSampleAvailable: true,
    fallbackSampleUsedAtRuntime: false,
    sevenContinentFallbackEmergencyOnly: true,
    sevenContinentFallbackUsed: false,
    sevenContinentFallbackSuppressedByUpstream: false,
    emergencyF13Requested: false,
    emergencyF13Reason: "",
    emergencyFallbackUsed: false,
    elevationControlsLandShape: true,
    hydrologyControlsWaterShape: true,
    coastlinesReadFromHydrologyAndMaterials: true,

    cachedAtlasInvalidationAvailable: true,
    atlasInvalidationCount: 0,
    atlasInvalidated: false,
    atlasInvalidationReason: "",

    f13SourceStageStarted: false,
    f13SourceStageComplete: false,
    f13AtlasPacketReady: false,
    f21EligibleForNorth: false,
    f21ClaimedByCanvasEast: false,
    readyTextClaimedByCanvasEast: false,
    completionLatched: false,

    firstFailedCoordinate: "WAITING_PARENT_OBSERVATION",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    nextConsumerFile: PARENT_FILE,

    lastNormalizedInput: null,
    lastParentAuthorityProfile: null,
    lastWestReleaseState: null,
    lastPermissionPacket: null,
    lastHeldAtlasPacket: null,
    lastAtlasPacket: null,
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
    readyTextAllowed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    compatibilityContract: COMPATIBILITY_CONTRACT,
    compatibilityReceipt: COMPATIBILITY_RECEIPT,
    currentParentContract: CURRENT_PARENT_CONTRACT,
    currentParentReceipt: CURRENT_PARENT_RECEIPT,
    routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
    routeConductorReceipt: ROUTE_CONDUCTOR_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    westFile: WEST_FILE,
    routeFile: ROUTE_FILE,

    REQUIRED_METHODS,
    ACCEPTED_PARENT_CONTRACTS,
    ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS,
    RETIRED_PARENT_CONTRACTS,
    PERMISSION,
    CHRONOLOGY,

    buildAtlas,
    buildAtlasSync,
    buildAtlasAsync,
    sample,
    read,

    publishApiSurface,
    publishGlobals: publishApiSurface,
    publishAliasStation,
    publishDatasetFirstProof,

    normalizeCanvasEastInput,
    readParentAuthorityProfile,
    readParentState: readParentAuthorityProfile,
    readGovernedParentState: readParentAuthorityProfile,
    readWestReleaseState,
    resolveAtlasBuildPermission,
    composeAtlasBuildPermissionPacket: resolveAtlasBuildPermission,
    composeHeldAtlasPacket,
    composeAtlasEvidencePacket,
    getMaterialBridgeReceipt,
    refreshMaterialBridge,
    invalidateAtlas,
    getAtlasCanvas,
    getLastAtlasImageData,

    getReceipt,
    getReceiptLight,
    getReceiptText,

    spineNodalStructureActive: true,
    earlyApiSurfaceActive: true,
    aliasStationActive: true,
    datasetFirstProofActive: true,
    parentProfileNodeActive: true,
    westReleaseNodeActive: true,
    permissionGateNodeActive: true,
    synchronousHeldPacketNodeActive: true,
    atlasBuildNodeActive: true,
    parentReturnNodeActive: true,
    receiptLightFirstNodeActive: true,

    requiredApiSurfaceComplete: true,
    buildAtlasAvailable: true,
    buildAtlasSyncAvailable: true,
    buildAtlasAsyncAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getReceiptAvailable: true,
    getReceiptLightAvailable: true,
    getReceiptTextAvailable: true,
    canvasEastApiReady: true,
    canvasEastReady: true,
    canvasEastCurrent: true,
    canvasEastPresent: true,

    parentAuthorityIsUpstream: true,
    eastAccustomsToParent: true,
    parentRenewalNotInferredFromEastAudit: true,
    parentObservationDoesNotEqualRenewal: true,
    parentContractExactMatchRequired: false,

    newsAlignmentProtocolActive: true,
    newsChronologicalOrderLocked: true,
    newsFinalizedByCanvasEast: false,
    fibonacciSynchronizationChronologyFirst: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    activeF13EGate: F13E_GATE,
    activeF13FGate: F13F_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    oneActiveGearAtATime: true,

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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
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
      event: safeString(event, "CANVAS_EAST_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 180);
    state.updatedAt = item.at;
    publishDatasetFirstProof({ quiet: true });
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
    publishDatasetFirstProof({ quiet: true });
    return item;
  }

  function objectValue(source, path, fallback = undefined) {
    if (!isObject(source)) return fallback;

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

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceiptLight)) {
      try {
        const receipt = authority.getReceiptLight(false);
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getStatus)) {
      try {
        const receipt = authority.getStatus();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version || authority.splitContract) return authority;

    return null;
  }

  function findNestedObject(source, paths) {
    if (!isObject(source)) return {};

    for (const path of paths || []) {
      const value = objectValue(source, path);
      if (isObject(value) && Object.keys(value).length) return value;
    }

    return {};
  }

  function contractIsRetired(contractOrReceipt = "") {
    const text = safeString(contractOrReceipt, "");
    return Boolean(text && RETIRED_PARENT_CONTRACTS.includes(text));
  }

  function contractLooksLikeParent(value = "") {
    const text = safeString(value, "");
    return Boolean(
      text.includes("HEARTH_CANVAS_PARENT") ||
      text.includes("CANVAS_PARENT") ||
      text.includes("ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE") ||
      text.includes("EAST_V5_HANDOFF") ||
      text.includes("F13_EVIDENCE_RECEIVER") ||
      text.includes("SOUTH_PROOF_RECONCILIATION")
    );
  }

  function parentContractAccepted(contract = "", receipt = "") {
    const c = safeString(contract, "");
    const r = safeString(receipt, "");

    if (ACCEPTED_PARENT_CONTRACTS.includes(c)) return true;
    if (ACCEPTED_PARENT_CONTRACTS.includes(r)) return true;

    if (
      contractLooksLikeParent(c) &&
      !c.includes("STALE") &&
      !c.includes("RETIRED") &&
      !c.includes("BOOTSTRAP_F13_CARRIER_TNT_v1")
    ) {
      return true;
    }

    if (
      contractLooksLikeParent(r) &&
      !r.includes("STALE") &&
      !r.includes("RETIRED") &&
      !r.includes("BOOTSTRAP_F13_CARRIER_RECEIPT_v1")
    ) {
      return true;
    }

    return false;
  }

  function routeConductorContractAccepted(contract = "", receipt = "") {
    const c = safeString(contract, "");
    const r = safeString(receipt, "");

    if (ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(c)) return true;
    if (ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(r)) return true;
    return Boolean(c.includes("HEARTH_ROUTE_CONDUCTOR") || r.includes("HEARTH_ROUTE_CONDUCTOR"));
  }

  function hasCallableParentMethod(parentApi) {
    if (!parentApi || !isObject(parentApi)) return false;

    return Boolean(
      isFunction(parentApi.boot) ||
      isFunction(parentApi.init) ||
      isFunction(parentApi.start) ||
      isFunction(parentApi.mount) ||
      isFunction(parentApi.render) ||
      isFunction(parentApi.getStructuralCarrier) ||
      isFunction(parentApi.readStructuralCarrier) ||
      isFunction(parentApi.getCanvasCarrier) ||
      isFunction(parentApi.getCarrierReceipt) ||
      isFunction(parentApi.callEastBuildAtlas) ||
      isFunction(parentApi.receiveEastPacket) ||
      isFunction(parentApi.receiveEastAtlas) ||
      isFunction(parentApi.receiveAtlas) ||
      isFunction(parentApi.consumeEastAtlas) ||
      isFunction(parentApi.getReceipt)
    );
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
      safeBool(input.f21EligibleForNorth, false) ||
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

  function readRouteConductorProfile(input = {}) {
    const routeApi = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_CENTRAL_STATION_SWITCHBOARD_NEWS_FIBONACCI_PARENT_COORDINATION",
      "HEARTH.routeConductorCentralStationSwitchboardNewsFibonacciParentCoordination",
      "DEXTER_LAB.hearthRouteConductorCentralStationSwitchboardNewsFibonacciParentCoordination",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH.routeConductor",
      "DEXTER_LAB.hearthRouteConductor"
    ]);

    const routeReceipt =
      readReceipt(routeApi) ||
      findNestedObject(input, ["routeConductor", "routeConductorReceipt", "centralStation", "centralStationReceipt"]) ||
      {};

    const contract = firstString(
      input.routeConductorContract,
      routeReceipt.contract,
      datasetValue("hearthRouteConductorContract", ""),
      datasetValue("hearthSouthRouteConductorContract", "")
    );

    const receipt = firstString(
      input.routeConductorReceipt,
      routeReceipt.receipt,
      datasetValue("hearthRouteConductorReceipt", ""),
      datasetValue("hearthSouthRouteConductorReceipt", "")
    );

    const observed = Boolean(
      routeApi ||
      routeReceipt.contract ||
      routeReceipt.receipt ||
      routeConductorContractAccepted(contract, receipt) ||
      datasetValue("hearthRouteConductorLoaded") === "true" ||
      datasetValue("hearthSouthRouteConductorLoaded") === "true"
    );

    const centralStationActive = Boolean(
      routeConductorContractAccepted(contract, receipt) ||
      safeBool(routeReceipt.centralStationSwitchboardActive, false) ||
      datasetValue("hearthRouteConductorCentralStationSwitchboardActive") === "true"
    );

    state.routeConductorObserved = observed;
    state.routeConductorContractObserved = contract;
    state.routeConductorReceiptObserved = receipt;
    state.routeConductorCentralStationActive = centralStationActive;
    state.routeConductorCentralStationConsumed = centralStationActive;

    return {
      observed,
      contract,
      receipt,
      centralStationActive,
      receiptBody: clonePlain(routeReceipt)
    };
  }

  function readParentAuthorityProfile(input = {}) {
    const source = isObject(input) ? input : {};
    const directParent = findNestedObject(source, [
      "parent",
      "parentReceipt",
      "parentReceiptPacket",
      "canvasParent",
      "canvasParentReceipt",
      "canvasParentReceiptPacket",
      "currentParent",
      "currentParentReceipt",
      "releasePacket.parent",
      "releasePacket.parentReceipt",
      "releasePacket.canvasParent",
      "canvasReleasePacket.parent",
      "canvasReleasePacket.parentReceipt",
      "canvasReleasePacket.canvasParent"
    ]);

    const parentApi = firstGlobal([
      "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF",
      "HEARTH.canvasParentRouteConductorReleasePacketIntakeEastV5Handoff",
      "DEXTER_LAB.hearthCanvasParentRouteConductorReleasePacketIntakeEastV5Handoff",

      "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION",
      "HEARTH.canvasParentStructuralCarrierBootMethodEastV5Consumption",
      "DEXTER_LAB.hearthCanvasParentStructuralCarrierBootMethodEastV5Consumption",

      "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION",
      "HEARTH.canvasParentEastV5SynchronousHeldPacketConsumption",
      "DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumption",

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
      source.activeParentContract,
      source.currentCanvasParentContract,
      source.governedParentContract,
      source.contract && contractLooksLikeParent(source.contract) ? source.contract : "",
      objectValue(source, "releasePacket.parentContract"),
      objectValue(source, "releasePacket.activeParentContract"),
      objectValue(source, "canvasReleasePacket.parentContract"),
      parentReceipt.contract,
      parentReceipt.parentContract,
      parentReceipt.activeParentContract,
      parentReceipt.currentCanvasParentContract,
      parentReceipt.splitContract,
      parentApi && parentApi.contract,
      parentApi && parentApi.parentContract,
      datasetValue("hearthCanvasContract", ""),
      datasetValue("hearthCanvasParentContract", ""),
      datasetValue("hearthSouthCurrentCanvasParentContract", "")
    );

    const receipt = firstString(
      source.parentReceipt,
      source.activeParentReceipt,
      source.currentCanvasParentReceipt,
      source.governedParentReceipt,
      source.receipt && contractLooksLikeParent(source.receipt) ? source.receipt : "",
      objectValue(source, "releasePacket.parentReceipt"),
      objectValue(source, "releasePacket.activeParentReceipt"),
      objectValue(source, "canvasReleasePacket.parentReceipt"),
      parentReceipt.receipt,
      parentReceipt.parentReceipt,
      parentReceipt.activeParentReceipt,
      parentReceipt.currentCanvasParentReceipt,
      parentReceipt.splitReceipt,
      parentApi && parentApi.receipt,
      parentApi && parentApi.parentReceipt,
      datasetValue("hearthCanvasReceipt", ""),
      datasetValue("hearthCanvasParentReceipt", "")
    );

    const parentApiPresent = Boolean(parentApi);
    const parentCallable = hasCallableParentMethod(parentApi);
    const parentReceiptObserved = Boolean(
      parentReceipt.contract ||
      parentReceipt.receipt ||
      parentReceipt.parentContract ||
      parentReceipt.activeParentContract ||
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
      source.canvasParentObserved === true ||
      source.currentCanvasParentObserved === true
    );

    const parentReleaseObserved = firstBool(
      false,
      source.canvasParentReleaseObserved,
      source.canvasParentReleaseAccepted,
      source.parentReleaseObserved,
      source.parentReleaseAccepted,
      source.parentReleaseLawful,
      source.parentReleasePacketLawful,
      source.canvasReleaseAuthorized,
      source.releaseToCanvas,
      source.westCanvasReleaseApproved,
      objectValue(source, "releasePacket.canvasParentReleaseAccepted"),
      objectValue(source, "releasePacket.parentReleaseLawful"),
      objectValue(source, "releasePacket.canvasReleaseAuthorized"),
      objectValue(source, "canvasReleasePacket.canvasReleaseAuthorized"),
      parentReceipt.canvasParentReleaseObserved,
      parentReceipt.canvasParentReleaseAccepted,
      parentReceipt.parentReleaseObserved,
      parentReceipt.parentReleaseAccepted,
      parentReceipt.parentReleaseLawful,
      parentReceipt.parentReleasePacketLawful,
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
      datasetValue("hearthSouthCanvasParentReleaseAccepted", ""),
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
      source.requestSource === "canvas-parent",
      source.handoffTo === "EAST",
      source.requestedChild === "east",
      objectValue(source, "releasePacket.requestedChild") === "east",
      objectValue(source, "releasePacket.handoffTo") === "EAST",
      objectValue(source, "canvasReleasePacket.requestedChild") === "east",
      parentReceipt.canvasEastRequestObserved,
      parentReceipt.canvasEastBuildRequested,
      parentReceipt.parentEastBuildAtlasCalled,
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
      contractIsRetired(contract) ||
      contractIsRetired(receipt) ||
      firstBool(
        false,
        source.staleParentContractDetected,
        source.currentParentStaleDetected,
        source.canvasParentV2Observed === true && source.canvasParentV2Superseded !== true,
        parentReceipt.staleParentDetected,
        parentReceipt.currentParentStaleDetected,
        parentReceipt.currentParentIdentityMismatch,
        parentReceipt.parentCorruptOrStale,
        parentReceipt.canvasParentV2Observed === true && parentReceipt.canvasParentV2Superseded !== true,
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
        safeBool(parentReceipt.currentCanvasParentContractObserved, false) ||
        safeBool(parentReceipt.canvasParentV7Active, false) ||
        safeBool(parentReceipt.canvasParentV8Active, false) ||
        datasetValue("hearthSouthCurrentCanvasParentObserved") === "true" ||
        datasetValue("hearthCanvasLoaded") === "true"
      )
    );

    const parentAbsent = !parentObserved;
    const parentRecognitionMismatch = Boolean(parentObserved && !parentCorruptOrStale && !parentAuthorityAccepted);

    let firstFailedCoordinate = "NONE_PARENT_AUTHORITY_ACCEPTED";
    let recommendedNextFile = FILE;
    let recommendedNextRenewalTarget = FILE;
    let parentObservationRequired = false;
    let parentRenewalRequired = false;
    let eastAcclimationRequired = false;

    if (parentCorruptOrStale) {
      firstFailedCoordinate = "STALE_PARENT_CONTRACT_DETECTED";
      recommendedNextFile = PARENT_FILE;
      recommendedNextRenewalTarget = PARENT_FILE;
      parentRenewalRequired = true;
    } else if (parentAbsent) {
      firstFailedCoordinate = "WAITING_PARENT_OBSERVATION";
      recommendedNextFile = FILE;
      recommendedNextRenewalTarget = FILE;
      parentObservationRequired = true;
    } else if (parentRecognitionMismatch) {
      firstFailedCoordinate = "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH";
      recommendedNextFile = FILE;
      recommendedNextRenewalTarget = FILE;
      eastAcclimationRequired = true;
    }

    const profile = {
      contract: CONTRACT,
      receipt: RECEIPT,
      packetType: "PARENT_AUTHORITY_PROFILE",
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentObservationDoesNotEqualRenewal: true,
      parentContractExactMatchRequired: false,

      parentObserved,
      parentApiPresent,
      parentCallable,
      parentReceiptObserved,
      parentContract: contract,
      parentReceiptId: receipt,
      currentParentContractAcceptedExplicitly: contract === CURRENT_PARENT_CONTRACT || receipt === CURRENT_PARENT_RECEIPT,
      parentReleaseObserved,
      parentReleaseAccepted: parentReleaseObserved,
      parentReleaseLawful: parentReleaseObserved,
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
    state.currentParentAcceptedExplicitly = profile.currentParentContractAcceptedExplicitly;
    state.parentReleaseObserved = profile.parentReleaseObserved;
    state.parentReleaseAccepted = profile.parentReleaseAccepted;
    state.parentReleaseLawful = profile.parentReleaseLawful;
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

    publishDatasetFirstProof({ quiet: true });
    return profile;
  }

  function readWestReleaseState(input = {}) {
    const source = isObject(input) ? input : {};
    const directWest = findNestedObject(source, [
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
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "HEARTH.westCycleAwareAdmissibilityClutch",
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.cycleAwareAdmissibilityClutchWest"
    ]);

    const westReceipt = isObject(directWest) && Object.keys(directWest).length
      ? directWest
      : (readReceipt(westApi) || {});

    const cycleNumber = safeNumber(firstDefined(source.cycleNumber, source.activeCycleNumber, westReceipt.cycleNumber, westReceipt.activeCycleNumber), 2);
    const cycleRoute = firstString(source.cycleRoute, source.activeCycleRoute, westReceipt.cycleRoute, westReceipt.activeCycleRoute, CYCLE_ROUTE);
    const cycle2 = Boolean(cycleNumber === 2 || cycleRoute.includes(CYCLE_ROUTE) || cycleRoute.includes("CYCLE_2"));

    const auditObserved = firstBool(
      false,
      source.westAuditObserved,
      source.westReleaseObserved,
      source.macroWestAdmissibilityObserved,
      source.westCanvasReleaseApproved,
      westReceipt.westAuditObserved,
      westReceipt.westReviewRecommended,
      westReceipt.gapAssessed,
      westReceipt.macroWestAuthorityObserved,
      westReceipt.macroWestAdmissibilityObserved,
      datasetValue("hearthCanvasWestAuditObserved", ""),
      datasetValue("hearthSouthMacroWestAdmissibilityObserved", "")
    );

    const auditBlocked = firstBool(
      false,
      source.westAuditBlocked,
      source.westHardBlock,
      westReceipt.westAuditBlocked,
      westReceipt.hardBlock,
      westReceipt.westHardBlock,
      westReceipt.decision === "HARD_BLOCK",
      datasetValue("hearthCanvasWestAuditBlocked", ""),
      datasetValue("hearthSouthWestHardBlock", "")
    );

    const auditPassed = firstBool(
      false,
      source.westAuditPassed,
      source.westAuditAccepted,
      source.westForwardAllowed,
      source.westCanvasReleaseApproved,
      source.canvasReleaseApprovedByWest,
      source.canvasReleaseAuthorized,
      source.releaseToCanvas,
      westReceipt.westAuditPassed,
      westReceipt.westAuditAccepted,
      westReceipt.forwardAllowed,
      westReceipt.westCanvasReleaseApproved,
      westReceipt.canvasReleaseAuthorized,
      westReceipt.releaseToCanvas,
      westReceipt.gapClass === "NONE",
      westReceipt.gapSeverity === "NONE",
      westReceipt.decision === "RELEASE_TO_CANVAS",
      westReceipt.decision === "FULL_PASS",
      datasetValue("hearthCanvasWestReleaseApproved", ""),
      datasetValue("hearthSouthWestCanvasReleaseApproved", "")
    );

    const auditDegraded = firstBool(
      false,
      source.westAuditDegraded,
      source.westDegradedForwardApproved,
      westReceipt.westAuditDegraded,
      westReceipt.canDegradeForward,
      westReceipt.decision === "DEGRADED_FORWARD",
      datasetValue("hearthCanvasWestAuditDegraded", ""),
      datasetValue("hearthSouthWestDegradedForwardApproved", "")
    );

    const westCanvasReleaseApproved = firstBool(
      false,
      source.westCanvasReleaseApproved,
      source.canvasReleaseApprovedByWest,
      source.canvasReleaseAuthorized,
      source.releaseToCanvas,
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
      source.canvasReleaseAuthorized,
      source.releaseToCanvas,
      westReceipt.canvasReleaseAuthorized,
      westReceipt.releaseToCanvas,
      westCanvasReleaseApproved,
      datasetValue("hearthCanvasReleaseAuthorized", ""),
      datasetValue("hearthSouthCanvasReleaseAuthorized", "")
    );

    const releaseObserved = Boolean(
      cycle2 &&
      !auditBlocked &&
      (
        westCanvasReleaseApproved ||
        canvasReleaseAuthorized ||
        (auditObserved && (auditPassed || auditDegraded))
      )
    );

    const packet = {
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

    state.lastWestReleaseState = clonePlain(packet);
    state.westReleaseObserved = packet.westReleaseObserved;
    state.westAuditObserved = packet.westAuditObserved;
    state.westAuditPassed = packet.westAuditPassed;
    state.westAuditDegraded = packet.westAuditDegraded;
    state.westAuditBlocked = packet.westAuditBlocked;
    state.westCanvasReleaseApproved = packet.westCanvasReleaseApproved;
    state.canvasReleaseAuthorized = packet.canvasReleaseAuthorized;
    state.macroWestGateReady = Boolean(packet.westReleaseObserved || packet.westCanvasReleaseApproved || packet.canvasReleaseAuthorized);
    state.westGateReady = state.macroWestGateReady;

    publishDatasetFirstProof({ quiet: true });
    return packet;
  }

  function normalizeCanvasEastInput(input = {}) {
    publishApiSurface("normalize-entry");

    const source = isObject(input) ? input : {};
    const routeConductor = readRouteConductorProfile(source);
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

    const falsePromotionDetected = detectFalsePromotion(source);

    const atlasBuildRequested = firstBool(
      true,
      source.atlasBuildRequested,
      source.f13AtlasBuildRequested,
      source.buildAtlasRequested,
      parent.parentRequestObserved,
      parent.parentReleaseObserved,
      west.westReleaseObserved
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
      routeFile: ROUTE_FILE,
      westFile: WEST_FILE,

      receivedFrom,
      requestedBy: firstString(source.requestedBy, source.requestSource, "canvas-parent"),
      requestSource: firstString(source.requestSource, receivedFrom, "unknown"),

      activeCycleNumber: safeNumber(firstDefined(source.activeCycleNumber, source.cycleNumber), 2),
      activeCycleRoute: firstString(source.activeCycleRoute, source.cycleRoute, CYCLE_ROUTE),
      activeCardinal: "EAST",
      activeFibonacci: ACTIVE_FIBONACCI_GATE,
      activeFibonacciRank: ACTIVE_FIBONACCI_GATE,
      activeStageId: firstString(source.activeStageId, source.activeGearId, state.activeStageId),
      activeGearId: firstString(source.activeGearId, source.activeStageId, state.activeGearId),
      activeNewsGate: firstString(source.activeNewsGate, "CANVAS_EAST_SOURCE"),

      routeConductor,
      parent,
      west,

      routeConductorObserved: routeConductor.observed,
      routeConductorCentralStationActive: routeConductor.centralStationActive,

      parentObserved: parent.parentObserved,
      parentApiPresent: parent.parentApiPresent,
      parentCallable: parent.parentCallable,
      parentReceiptObserved: parent.parentReceiptObserved,
      parentContract: parent.parentContract,
      parentReceiptId: parent.parentReceiptId,
      parentReleaseObserved: parent.parentReleaseObserved,
      parentReleaseAccepted: parent.parentReleaseAccepted,
      parentReleaseLawful: parent.parentReleaseLawful,
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
      emergencyF13Reason: firstString(source.emergencyF13Reason, source.reason, ""),
      atlasBuildRequested,
      falsePromotionDetected,

      width: safeNumber(firstDefined(source.width, source.atlasWidth), DEFAULT_ATLAS_WIDTH),
      height: safeNumber(firstDefined(source.height, source.atlasHeight), DEFAULT_ATLAS_HEIGHT),
      async: safeBool(firstDefined(source.async, source.defer, source.nonBlocking), false),
      rowsPerChunk: safeNumber(source.rowsPerChunk, 10),
      onProgress: isFunction(source.onProgress) ? source.onProgress : null,
      onComplete: isFunction(source.onComplete) ? source.onComplete : null,

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
    state.activeCycleNumber = normalized.activeCycleNumber;
    state.activeCycleRoute = normalized.activeCycleRoute;
    state.activeCardinal = "EAST";
    state.activeStageId = normalized.activeStageId;
    state.activeGearId = normalized.activeGearId;
    state.activeNewsGate = normalized.activeNewsGate;
    state.emergencyF13Requested = normalized.emergencyF13Requested;
    state.emergencyF13Reason = normalized.emergencyF13Reason;
    state.atlasBuildRequested = normalized.atlasBuildRequested;
    state.parentReleasePending = normalized.parentReleasePending;
    state.westReleasePending = normalized.westReleasePending;

    recomputeChronology();
    publishDatasetFirstProof({ quiet: true });

    return normalized;
  }

  function resolveAtlasBuildPermission(input = {}) {
    publishApiSurface("permission-gate-entry");

    const normalized = isObject(input) && input.parent && input.west ? input : normalizeCanvasEastInput(input);

    let permissionClass = PERMISSION.HELD_PARENT_OBSERVATION_PENDING;
    let allowed = false;
    let source = "NONE";
    let reason = "WAITING_PARENT_OBSERVATION";
    let recommended = FILE;

    if (normalized.falsePromotionDetected) {
      permissionClass = PERMISSION.BLOCKED_FALSE_PROMOTION;
      reason = "FALSE_PROMOTION_BLOCKED";
      recommended = FILE;
    } else if (normalized.parentCorruptOrStale) {
      permissionClass = PERMISSION.HELD_PARENT_STALE_OR_CORRUPT;
      reason = "STALE_PARENT_CONTRACT_DETECTED";
      recommended = PARENT_FILE;
    } else if (normalized.parentAbsent) {
      permissionClass = PERMISSION.HELD_PARENT_OBSERVATION_PENDING;
      reason = "WAITING_PARENT_OBSERVATION";
      recommended = FILE;
    } else if (normalized.parentRecognitionMismatch) {
      permissionClass = PERMISSION.HELD_EAST_RECOGNITION_MISMATCH;
      reason = "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH";
      recommended = FILE;
    } else if (normalized.emergencyF13Requested) {
      permissionClass = PERMISSION.BUILD_ALLOWED_PARENT_RELEASE;
      allowed = true;
      source = "EMERGENCY_F13";
      reason = "";
      recommended = FILE;
    } else if (normalized.parentReleaseObserved && normalized.parentAuthorityAccepted) {
      permissionClass = PERMISSION.BUILD_ALLOWED_PARENT_RELEASE;
      allowed = true;
      source = "PARENT_RELEASE_OBSERVED";
      reason = "";
      recommended = FILE;
    } else if (normalized.parentRequestObserved && normalized.parentAuthorityAccepted && normalized.westReleaseObserved && !normalized.westAuditBlocked) {
      permissionClass = PERMISSION.BUILD_ALLOWED_WEST_RELEASE;
      allowed = true;
      source = "PARENT_REQUEST_AFTER_WEST_RELEASE";
      reason = "";
      recommended = FILE;
    } else if (normalized.westReleaseObserved && normalized.canvasReleaseAuthorized && normalized.parentAuthorityAccepted) {
      permissionClass = PERMISSION.BUILD_ALLOWED_WEST_RELEASE;
      allowed = true;
      source = "WEST_CANVAS_RELEASE";
      reason = "";
      recommended = FILE;
    } else if (normalized.parentRequestObserved && normalized.parentAuthorityAccepted && !normalized.westReleaseObserved) {
      permissionClass = PERMISSION.HELD_WEST_RELEASE_PENDING;
      reason = "WAITING_WEST_RELEASE";
      recommended = WEST_FILE;
    } else if (normalized.parentAuthorityAccepted && !normalized.parentReleaseObserved) {
      permissionClass = PERMISSION.HELD_PARENT_RELEASE_PENDING;
      reason = "WAITING_PARENT_RELEASE";
      recommended = PARENT_FILE;
    } else {
      permissionClass = PERMISSION.HELD_EAST_RECOGNITION_MISMATCH;
      reason = "EAST_PARENT_RECOGNITION_ADAPTER_MISMATCH";
      recommended = FILE;
    }

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      westFile: WEST_FILE,
      routeFile: ROUTE_FILE,
      packetType: "CANVAS_EAST_ATLAS_BUILD_PERMISSION_PACKET",

      spineNodalStructureActive: true,
      permissionGateNodeActive: true,
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentObservationDoesNotEqualRenewal: true,
      parentContractExactMatchRequired: false,

      canvasEastApiReady: true,
      canvasEastReady: true,
      canvasEastCurrent: true,
      requiredApiSurfaceComplete: true,

      permissionClass,
      canvasEastMayBuildAtlas: allowed,
      f13BuildLawful: allowed,
      f13BuildBlockedReason: reason,
      f13PermissionSource: source,

      routeConductorObserved: normalized.routeConductorObserved,
      routeConductorCentralStationActive: normalized.routeConductorCentralStationActive,

      parentAuthorityProfile: clonePlain(normalized.parent),
      parentObserved: normalized.parentObserved,
      parentApiPresent: normalized.parentApiPresent,
      parentCallable: normalized.parentCallable,
      parentReceiptObserved: normalized.parentReceiptObserved,
      parentContract: normalized.parentContract,
      parentReceiptId: normalized.parentReceiptId,
      parentReleaseObserved: normalized.parentReleaseObserved,
      parentReleaseAccepted: normalized.parentReleaseAccepted,
      parentReleaseLawful: normalized.parentReleaseLawful,
      parentRequestObserved: normalized.parentRequestObserved,
      parentAuthorityAccepted: normalized.parentAuthorityAccepted,
      parentRecognitionMismatch: normalized.parentRecognitionMismatch,
      parentAbsent: normalized.parentAbsent,
      parentCorruptOrStale: normalized.parentCorruptOrStale,
      parentRecommendedForRenewal: permissionClass === PERMISSION.HELD_PARENT_STALE_OR_CORRUPT,
      eastRecommendedForAcclimation: permissionClass === PERMISSION.HELD_EAST_RECOGNITION_MISMATCH,
      parentObservationRequired: permissionClass === PERMISSION.HELD_PARENT_OBSERVATION_PENDING,
      parentRenewalRequired: permissionClass === PERMISSION.HELD_PARENT_STALE_OR_CORRUPT,
      eastAcclimationRequired: permissionClass === PERMISSION.HELD_EAST_RECOGNITION_MISMATCH,
      parentReleasePending: permissionClass === PERMISSION.HELD_PARENT_RELEASE_PENDING,
      westReleasePending: permissionClass === PERMISSION.HELD_WEST_RELEASE_PENDING,

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

      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      activeF13EGate: F13E_GATE,
      activeF13FGate: F13F_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      newsFinalizedByCanvasEast: false,

      firstFailedCoordinate: allowed ? "NONE_F13_ATLAS_BUILD_PERMISSION_GRANTED" : reason,
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

    state.permissionClass = permissionClass;
    state.canvasEastMayBuildAtlas = allowed;
    state.f13BuildLawful = allowed;
    state.f13BuildBlockedReason = reason;
    state.f13PermissionSource = source;
    state.firstFailedCoordinate = allowed ? "NONE_F13_ATLAS_BUILD_PERMISSION_GRANTED" : reason;
    state.recommendedNextFile = recommended;
    state.recommendedNextRenewalTarget = recommended;
    state.parentRecommendedForRenewal = packet.parentRenewalRequired;
    state.eastRecommendedForAcclimation = packet.eastAcclimationRequired;
    state.parentObservationRequired = packet.parentObservationRequired;
    state.parentRenewalRequired = packet.parentRenewalRequired;
    state.eastAcclimationRequired = packet.eastAcclimationRequired;
    state.parentReleasePending = packet.parentReleasePending;
    state.westReleasePending = packet.westReleasePending;
    state.lastPermissionPacket = clonePlain(packet);

    recomputeChronology();
    publishDatasetFirstProof({ quiet: true });

    return packet;
  }

  function composeHeldAtlasPacket(input = {}, permission = null) {
    publishApiSurface("held-packet-entry");

    const normalized = isObject(input) && input.parent && input.west ? input : normalizeCanvasEastInput(input);
    const gate = permission || resolveAtlasBuildPermission(normalized);
    const reason = gate.f13BuildBlockedReason || "WAITING_PARENT_OBSERVATION";

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
    state.f13PermissionSource = "NONE";
    state.permissionClass = gate.permissionClass || PERMISSION.HELD_PARENT_OBSERVATION_PENDING;
    state.atlasBuildStarted = false;
    state.atlasBuildComplete = false;
    state.f13SourceStageStarted = false;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceGateReady = false;
    state.firstFailedCoordinate = reason;
    state.recommendedNextFile = gate.recommendedNextFile || FILE;
    state.recommendedNextRenewalTarget = gate.recommendedNextRenewalTarget || state.recommendedNextFile;
    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.readyTextAllowed = false;
    state.canvasReady = false;
    state.visibleProof = false;
    state.visibleContentProof = false;
    state.visiblePlanetAvailable = false;
    state.visualPassClaimed = false;
    state.updatedAt = nowIso();

    recomputeChronology();

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      compatibilityContract: COMPATIBILITY_CONTRACT,
      file: FILE,
      parentFile: PARENT_FILE,
      westFile: WEST_FILE,
      routeFile: ROUTE_FILE,
      packetType: "CANVAS_EAST_SYNCHRONOUS_HELD_ATLAS_PACKET",

      spineNodalStructureActive: true,
      synchronousHeldPacketNodeActive: true,
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentObservationDoesNotEqualRenewal: true,
      parentContractExactMatchRequired: false,

      canvasEastApiReady: true,
      canvasEastReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,
      buildAtlasAvailable: true,
      buildAtlasSyncAvailable: true,
      buildAtlasAsyncAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,
      getReceiptLightAvailable: true,
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

      parentAuthorityProfile: clonePlain(gate.parentAuthorityProfile || normalized.parent),
      parentObserved: normalized.parentObserved,
      parentApiPresent: normalized.parentApiPresent,
      parentCallable: normalized.parentCallable,
      parentReceiptObserved: normalized.parentReceiptObserved,
      parentContract: normalized.parentContract,
      parentReceiptId: normalized.parentReceiptId,
      parentReleaseObserved: normalized.parentReleaseObserved,
      parentReleaseAccepted: normalized.parentReleaseAccepted,
      parentReleaseLawful: normalized.parentReleaseLawful,
      parentRequestObserved: normalized.parentRequestObserved,
      parentAuthorityAccepted: normalized.parentAuthorityAccepted,
      parentRecognitionMismatch: normalized.parentRecognitionMismatch,
      parentAbsent: normalized.parentAbsent,
      parentCorruptOrStale: normalized.parentCorruptOrStale,
      parentRecommendedForRenewal: gate.parentRenewalRequired === true,
      eastRecommendedForAcclimation: gate.eastAcclimationRequired === true,
      parentObservationRequired: gate.parentObservationRequired === true,
      parentRenewalRequired: gate.parentRenewalRequired === true,
      eastAcclimationRequired: gate.eastAcclimationRequired === true,
      parentReleasePending: gate.parentReleasePending === true,
      westReleasePending: gate.westReleasePending === true,

      westReleaseObserved: normalized.westReleaseObserved,
      westCanvasReleaseApproved: normalized.westCanvasReleaseApproved,
      canvasReleaseAuthorized: normalized.canvasReleaseAuthorized,

      newsAlignmentProtocolActive: true,
      newsChronologicalOrderLocked: true,
      newsFinalizedByCanvasEast: false,
      chronologicalGateCount: state.chronologicalGateCount,
      chronologicalGatesSatisfied: state.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: state.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: state.chronologicalFirstFailedCoordinate,

      fibonacciSynchronizationChronologyFirst: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationExpected: state.fibonacciSynchronizationExpected,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationPassed: false,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,
      fibonacciSynchronizationHardFail: state.fibonacciSynchronizationHardFail,
      fibonacciSynchronizationHoldReason: reason,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      activeF13EGate: F13E_GATE,
      activeF13FGate: F13F_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      oneActiveGearAtATime: true,

      nextConsumerFile: PARENT_FILE,
      firstFailedCoordinate: reason,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

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

    recordLocal("SYNCHRONOUS_HELD_ATLAS_PACKET_RETURNED", {
      reason,
      permissionClass: state.permissionClass,
      apiReadyStillTrue: true,
      evidenceReadyStillFalse: true,
      returnedPromise: false,
      heldDoesNotMeanApiMissing: true,
      parentRenewalInferredFromEastAudit: false
    });

    publishApiSurface("held-packet-returned");
    return packet;
  }

  function buildAtlas(options = {}) {
    publishApiSurface("buildAtlas-entry");

    const normalized = normalizeCanvasEastInput(options);
    const permission = resolveAtlasBuildPermission(normalized);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(normalized, permission);
    }

    if (options && (options.async === true || options.defer === true || options.nonBlocking === true)) {
      state.buildAtlasReturnedPromise = true;
      publishDatasetFirstProof({ quiet: true });
      return buildAtlasAsync(options, normalized, permission);
    }

    return buildAtlasSync(options, normalized, permission);
  }

  function buildAtlasSync(options = {}, normalizedInput = null, permissionInput = null) {
    publishApiSurface("buildAtlasSync-entry");

    const normalized = normalizedInput || normalizeCanvasEastInput(options);
    const permission = permissionInput || resolveAtlasBuildPermission(normalized);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(normalized, permission);
    }

    const width = clamp(Math.round(safeNumber(options.width || options.atlasWidth, DEFAULT_ATLAS_WIDTH)), MIN_ATLAS_WIDTH, MAX_ATLAS_WIDTH);
    const height = clamp(Math.round(safeNumber(options.height || options.atlasHeight, DEFAULT_ATLAS_HEIGHT)), MIN_ATLAS_HEIGHT, MAX_ATLAS_HEIGHT);

    resetBuildCounters(width, height, "sync");
    syncMaterialBridge({ updateDataset: false, invalidate: false });

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
          const material = sampleWithAuthority({ u, v }, getMaterialAuthority(), { syncBridge: false, updateDataset: false });
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

  async function buildAtlasAsync(options = {}, normalizedInput = null, permissionInput = null) {
    publishApiSurface("buildAtlasAsync-entry");

    const normalized = normalizedInput || normalizeCanvasEastInput(options);
    const permission = permissionInput || resolveAtlasBuildPermission(normalized);

    if (!permission.canvasEastMayBuildAtlas || !permission.f13BuildLawful) {
      return composeHeldAtlasPacket(normalized, permission);
    }

    const width = clamp(Math.round(safeNumber(options.width || options.atlasWidth, DEFAULT_ATLAS_WIDTH)), MIN_ATLAS_WIDTH, MAX_ATLAS_WIDTH);
    const height = clamp(Math.round(safeNumber(options.height || options.atlasHeight, DEFAULT_ATLAS_HEIGHT)), MIN_ATLAS_HEIGHT, MAX_ATLAS_HEIGHT);
    const rowsPerChunk = clamp(Math.round(safeNumber(options.rowsPerChunk, 10)), 1, 40);

    resetBuildCounters(width, height, "async");
    syncMaterialBridge({ updateDataset: false, invalidate: false });

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
          const material = sampleWithAuthority({ u, v }, getMaterialAuthority(), { syncBridge: false, updateDataset: false });
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
      canvas.dataset.hearthCanvasEastSpineNodal = "true";
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
    state.canvasEastEvidenceGateReady = false;

    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.readyTextAllowed = false;
    state.canvasReady = false;
    state.visibleProof = false;
    state.visibleContentProof = false;
    state.visiblePlanetAvailable = false;
    state.visualPassClaimed = false;

    state.updatedAt = state.atlasBuildStartedAt;

    recordLocal("F13E_ATLAS_BUILD_STARTED", {
      width,
      height,
      mode,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      permissionSource: state.f13PermissionSource,
      apiWasReadyBeforeBuild: true
    });
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
    state.canvasEastEvidenceGateReady = true;
    state.firstFailedCoordinate = "NONE_F13F_ATLAS_PACKET_READY";
    state.recommendedNextFile = PARENT_FILE;
    state.recommendedNextRenewalTarget = PARENT_FILE;
    state.nextConsumerFile = PARENT_FILE;
    state.permissionClass = state.permissionClass || PERMISSION.BUILD_ALLOWED_PARENT_RELEASE;

    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.readyTextAllowed = false;
    state.canvasReady = false;
    state.visibleProof = false;
    state.visibleContentProof = false;
    state.visiblePlanetAvailable = false;
    state.visualPassClaimed = false;
    state.updatedAt = state.atlasBuildCompletedAt;

    recomputeChronology();

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
    state.f21EligibleForNorth = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.completionLatched = false;
    state.readyTextAllowed = false;
    state.canvasReady = false;
    state.visibleProof = false;
    state.visibleContentProof = false;
    state.visiblePlanetAvailable = false;
    state.visualPassClaimed = false;
    state.updatedAt = nowIso();

    recordError("ATLAS_BUILD_FAILED", error, { width, height, mode, permissionSource: state.f13PermissionSource });
    recomputeChronology();
    publishApiSurface("atlas-build-failed");

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
      routeFile: ROUTE_FILE,
      packetType: "CANVAS_EAST_F13_ATLAS_EVIDENCE_PACKET",

      spineNodalStructureActive: true,
      atlasBuildNodeActive: true,
      parentReturnNodeActive: true,
      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentObservationDoesNotEqualRenewal: true,
      parentContractExactMatchRequired: false,

      canvasEastApiReady: true,
      canvasEastReady: true,
      canvasEastCurrent: true,
      canvasEastPresent: true,
      requiredApiSurfaceComplete: true,

      permissionClass: state.permissionClass,
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
      atlasCanvasPresent: state.atlasCanvasPresent,
      sourceRole: "east-material-atlas-source",
      materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false }),

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,

      newsAlignmentProtocolActive: true,
      newsChronologicalOrderLocked: true,
      newsFinalizedByCanvasEast: false,
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
      fibonacciSynchronizationHardFail: false,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      activeF13EGate: F13E_GATE,
      activeF13FGate: F13F_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      oneActiveGearAtATime: true,

      nextConsumerFile: PARENT_FILE,
      destinationFile: PARENT_FILE,
      recommendedNextFile: PARENT_FILE,
      recommendedNextRenewalTarget: PARENT_FILE,

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
          readyTextClaimedByCanvasEast: false,
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
          if (isObject(result)) return result;
        } catch (_error) {}

        try {
          const result = authority[method](point.u, point.v, point.lon, point.lat);
          if (isObject(result)) return result;
        } catch (_error2) {}

        try {
          const result = authority[method](point.x, point.y, point.z);
          if (isObject(result)) return result;
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
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getStatus)) {
      try {
        const receipt = authority.getStatus();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    return {
      contract: authority.contract || "",
      receipt: authority.receipt || "",
      previousContract: authority.previousContract || authority.previousAssetsContract || "",
      baselineContract: authority.baselineContract || authority.previousMaterialContract || "",
      version: authority.version || "",
      authority: authority.authority || "materials",
      role: authority.role || "materials"
    };
  }

  function signatureFromReceipt(receipt) {
    if (!isObject(receipt)) return "NONE";
    return [
      receipt.contract || "",
      receipt.receipt || "",
      receipt.version || "",
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

    if (options.updateDataset !== false) publishDatasetFirstProof({ quiet: true });

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
      waterFillStrength: isWater ? clamp01(0.44 + (0.40 - landSignal) * 0.68) : 0,
      waterDepth: isWater ? clamp01(0.30 + (0.40 - landSignal) * 0.74) : 0,
      waterlineMaterialFeed: coastBand,
      terrainRelief: isLand ? clamp01(n * 0.26 + landSignal * 0.22) : 0,
      ridgeRelief: isLand ? clamp01(n * 0.18) : 0,
      basinShade: isWater ? clamp01((0.40 - landSignal) * 0.42) : 0,
      mountainRangeMaterialFeed: isLand ? clamp01(Math.max(0, n - 0.64) * 0.38) : 0,
      canyonCarveMaterialFeed: isLand ? clamp01(Math.max(0, 0.34 - n) * 0.24) : 0,
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

  function classifySampleSource(raw, fallbackUsed) {
    if (fallbackUsed) return "fallback";
    if (!isObject(raw)) return "fallback";
    const contract = String(raw.contract || "");
    if (contract === EXPECTED_MATERIAL_CONTRACT) return "canonical-material";
    if (contract.includes("MATERIAL")) return "material";
    if (Number.isFinite(Number(raw.elevation)) || typeof raw.hydrologyClass === "string") return "elevation-hydrology";
    return "unknown-upstream";
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
      numberField(samplePacket, "hardCoastMaterialFeed", 0) * 0.14
    );

    const relief = clamp01(
      numberField(samplePacket, "terrainRelief", 0) * 0.24 +
      numberField(samplePacket, "ridgeRelief", 0) * 0.18 +
      numberField(samplePacket, "mountainRangeMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "ridgeChainMaterialFeed", 0) * 0.16 +
      numberField(samplePacket, "canyonCarveMaterialFeed", 0) * 0.14
    );

    const shelf = clamp01(
      numberField(samplePacket, "shallowShelfMaterialFeed", 0) * 0.24 +
      numberField(samplePacket, "sandShelfMaterialFeed", 0) * 0.18 +
      numberField(samplePacket, "shelfTransition", 0) * 0.16
    );

    const scar = clamp01(
      numberField(samplePacket, "submergedScarMaterialFeed", 0) * 0.22 +
      numberField(samplePacket, "submergedBlockMaterialFeed", 0) * 0.18 +
      numberField(samplePacket, "oldCoastalTechUnderwaterMaterialFeed", 0) * 0.14
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
    const source = isObject(raw) ? raw : fallbackTerrain(point);
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

    if (!isObject(raw)) {
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
    publishApiSurface("sample-entry");
    try {
      return sampleWithAuthority(normalizePoint(point, b, c), getMaterialAuthority(), {
        syncBridge: true,
        updateDataset: false
      });
    } catch (error) {
      recordError("SAMPLE_FAILED_USING_FALLBACK", error);
      const p = normalizePoint(point, b, c);
      return normalizeSample(fallbackTerrain(p), p, true);
    }
  }

  function read(point = {}, b, c) {
    return sample(point, b, c);
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

  function recomputeChronology() {
    const gates = [
      true,
      true,
      Boolean(state.westReleaseObserved || state.westCanvasReleaseApproved || state.canvasReleaseAuthorized),
      Boolean(state.parentReleaseObserved || state.parentReleaseAccepted || state.parentReleaseLawful),
      Boolean(state.canvasEastApiReady && state.requiredApiSurfaceComplete),
      Boolean(state.heldAtlasPacketReturned || state.f13AtlasPacketReady),
      Boolean(state.canvasWestGateReady),
      Boolean(state.canvasSouthGateReady),
      false,
      false
    ];

    const firstFailedIndex = gates.findIndex((value) => !value);
    const satisfied = gates.filter(Boolean).length;

    state.chronologicalGateCount = CHRONOLOGY.length;
    state.chronologicalGatesSatisfied = satisfied;
    state.chronologicalFirstFailedGate = firstFailedIndex >= 0 ? CHRONOLOGY[firstFailedIndex] : "NONE_CHRONOLOGY_COMPLETE";
    state.chronologicalFirstFailedCoordinate = state.firstFailedCoordinate || "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";

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
      : state.firstFailedCoordinate;

    state.canvasEastGateReady = f13ePass;
    state.canvasEastEvidenceGateReady = f13fPass;
    state.newsGatePassedBeforeF21 = false;
    state.newsGateDegradedBeforeF21 = false;
  }

  function invalidateAtlas(reason = "manual-invalidation", options = {}) {
    state.atlasInvalidationCount += 1;
    state.atlasInvalidated = true;
    state.atlasInvalidationReason = safeString(reason, "manual-invalidation");
    state.atlasBuildComplete = false;
    state.atlasCanvasPresent = false;
    state.f13AtlasPacketReady = false;
    state.canvasEastEvidenceReady = false;
    state.canvasEastEvidenceGateReady = false;
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
      eastAccustomsToParent: true
    });

    recomputeChronology();
    if (!options.skipDataset) publishDatasetFirstProof({ quiet: true });
    publishApiSurface("atlas-invalidated");

    return getReceipt();
  }

  function getAtlasCanvas() {
    return atlasCanvas;
  }

  function getLastAtlasImageData() {
    return lastAtlasImageData;
  }

  function publishAliasStation() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasEast = api;
    root.HEARTH.canvasEastSource = api;
    root.HEARTH.canvasEastSpineNodalParentAcceptanceSyncHeldAtlasSource = api;
    root.HEARTH.canvasEastParentObservationRenewalSplitSyncHeldPacket = api;
    root.HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource = api;
    root.HEARTH.canvasEastParentFirstApiRecognitionBootstrap = api;
    root.HEARTH.canvasEastGovernedF13AtlasSource = api;
    root.HEARTH.canvasEastCurrentParentRecognizedF13AtlasSource = api;
    root.HEARTH.canvasEastMaterialAtlasSourceMachine = api;
    root.HEARTH.canvasEastMaterialAtlasSourceTransistor = api;
    root.HEARTH.canvasEastF13AtlasSourceChild = api;

    root.HEARTH_CANVAS_EAST = api;
    root.HEARTH_CANVAS_EAST_SOURCE = api;
    root.HEARTH_CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET = api;
    root.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP = api;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE = api;
    root.HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR = api;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_TRANSISTOR = api;
    root.HEARTH_CANVAS_EAST_F13_ATLAS_SOURCE_CHILD = api;

    root.DEXTER_LAB.hearthCanvasEast = api;
    root.DEXTER_LAB.hearthCanvasEastSource = api;
    root.DEXTER_LAB.hearthCanvasEastSpineNodalParentAcceptanceSyncHeldAtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastParentObservationRenewalSplitSyncHeldPacket = api;
    root.DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrap = api;
    root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceTransistor = api;
    root.DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild = api;

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
    root.__HEARTH_CANVAS_EAST_PARENT_AUTHORITY_IS_UPSTREAM__ = true;
    root.__HEARTH_CANVAS_EAST_ACCUSTOMS_TO_PARENT__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_RENEWAL_NOT_INFERRED_FROM_EAST_AUDIT__ = true;
    root.__HEARTH_CANVAS_EAST_VISUAL_PASS_CLAIMED__ = false;

    state.aliasesPublished = true;
    state.parentFirstApiPublished = true;
    state.apiSurfacePublished = true;
    state.canvasEastApiReady = true;
    state.canvasEastReady = true;
    state.canvasEastCurrent = true;
    state.canvasEastPresent = true;
    state.requiredApiSurfaceComplete = true;
    state.updatedAt = nowIso();

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
    setDataset("hearthCanvasEastCompatibilityContract", COMPATIBILITY_CONTRACT);
    setDataset("hearthCanvasEastVersion", VERSION);

    setDataset("hearthCanvasEastSpineNodalStructureActive", "true");
    setDataset("hearthCanvasEastEarlyApiSurfaceActive", "true");
    setDataset("hearthCanvasEastAliasStationActive", "true");
    setDataset("hearthCanvasEastDatasetFirstProofActive", "true");
    setDataset("hearthCanvasEastApiSurfacePublished", String(state.apiSurfacePublished));
    setDataset("hearthCanvasEastAliasesPublished", String(state.aliasesPublished));
    setDataset("hearthCanvasEastDatasetFirstProofPublished", "true");

    setDataset("hearthCanvasEastRequiredApiSurfaceComplete", "true");
    setDataset("hearthCanvasEastBuildAtlasAvailable", "true");
    setDataset("hearthCanvasEastBuildAtlasSyncAvailable", "true");
    setDataset("hearthCanvasEastBuildAtlasAsyncAvailable", "true");
    setDataset("hearthCanvasEastSampleAvailable", "true");
    setDataset("hearthCanvasEastReadAvailable", "true");
    setDataset("hearthCanvasEastGetReceiptAvailable", "true");
    setDataset("hearthCanvasEastGetReceiptLightAvailable", "true");
    setDataset("hearthCanvasEastGetReceiptTextAvailable", "true");
    setDataset("hearthCanvasEastApiReady", "true");
    setDataset("hearthCanvasEastReady", "true");
    setDataset("hearthCanvasEastCurrent", "true");
    setDataset("hearthCanvasEastEvidenceReady", String(state.f13AtlasPacketReady));

    setDataset("hearthCanvasEastCurrentParentContract", state.parentContract);
    setDataset("hearthCanvasEastParentObserved", String(state.parentObserved));
    setDataset("hearthCanvasEastParentApiPresent", String(state.parentApiPresent));
    setDataset("hearthCanvasEastParentCallable", String(state.parentCallable));
    setDataset("hearthCanvasEastParentReceiptObserved", String(state.parentReceiptObserved));
    setDataset("hearthCanvasEastParentReleaseObserved", String(state.parentReleaseObserved));
    setDataset("hearthCanvasEastParentReleaseAccepted", String(state.parentReleaseAccepted));
    setDataset("hearthCanvasEastParentReleaseLawful", String(state.parentReleaseLawful));
    setDataset("hearthCanvasEastParentAuthorityAccepted", String(state.parentAuthorityAccepted));
    setDataset("hearthCanvasEastParentAbsent", String(state.parentAbsent));
    setDataset("hearthCanvasEastParentCorruptOrStale", String(state.parentCorruptOrStale));
    setDataset("hearthCanvasEastParentRecommendedForRenewal", String(state.parentRecommendedForRenewal));
    setDataset("hearthCanvasEastEastRecommendedForAcclimation", String(state.eastRecommendedForAcclimation));
    setDataset("hearthCanvasEastCurrentParentAcceptedExplicitly", String(state.currentParentAcceptedExplicitly));

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
    setDataset("hearthCanvasEastHeldDoesNotMeanParentRenewalUnlessCorruptOrStale", "true");

    setDataset("hearthCanvasEastNewsAlignmentProtocolActive", "true");
    setDataset("hearthCanvasEastNewsChronologicalOrderLocked", "true");
    setDataset("hearthCanvasEastNewsFinalized", "false");
    setDataset("hearthCanvasEastChronologicalGateCount", String(state.chronologicalGateCount));
    setDataset("hearthCanvasEastChronologicalGatesSatisfied", String(state.chronologicalGatesSatisfied));
    setDataset("hearthCanvasEastChronologicalFirstFailedGate", state.chronologicalFirstFailedGate);
    setDataset("hearthCanvasEastChronologicalFirstFailedCoordinate", state.chronologicalFirstFailedCoordinate);

    setDataset("hearthCanvasEastFibonacciSynchronizationChronologyFirst", "true");
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

    setDataset("hearthCanvasEastGateReady", String(state.canvasEastGateReady));
    setDataset("hearthCanvasEastEvidenceGateReady", String(state.canvasEastEvidenceGateReady));
    setDataset("hearthCanvasEastCanvasGateReady", "false");
    setDataset("hearthCanvasEastNewsGatePassedBeforeF21", "false");
    setDataset("hearthCanvasEastNewsGateDegradedBeforeF21", "false");

    setDataset("hearthCanvasEastMaterialReceiptBridgeActive", String(state.materialReceiptBridgeActive));
    setDataset("hearthCanvasEastMaterialContract", state.materialContract);
    setDataset("hearthCanvasEastMaterialReceipt", state.materialReceipt);
    setDataset("hearthCanvasEastMaterialContractMatchesExpected", String(state.materialContractMatchesExpected));
    setDataset("hearthCanvasEastCanonicalMaterialConsumed", String(state.canonicalMaterialConsumed));

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

    setDataset("hearthCanvasEastNextConsumerFile", PARENT_FILE);
    setDataset("hearthCanvasEastFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasEastRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasEastRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);

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

    if (!options.quiet) {
      state.updatedAt = nowIso();
    }

    return true;
  }

  function publishReceipts() {
    const light = getReceiptLight(false);

    root.HEARTH_CANVAS_EAST_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_PARENT_OBSERVATION_RENEWAL_SPLIT_SYNC_HELD_PACKET_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_RECEIPT = light;
    root.HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT = light;

    if (root.HEARTH) {
      root.HEARTH.canvasEastReceipt = light;
      root.HEARTH.canvasEastSourceReceipt = light;
      root.HEARTH.canvasEastSpineNodalParentAcceptanceSyncHeldAtlasSourceReceipt = light;
      root.HEARTH.canvasEastParentObservationRenewalSplitSyncHeldPacketReceipt = light;
      root.HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = light;
      root.HEARTH.canvasEastParentFirstApiRecognitionBootstrapReceipt = light;
      root.HEARTH.canvasEastGovernedF13AtlasSourceReceipt = light;
      root.HEARTH.canvasEastCurrentParentRecognizedF13AtlasSourceReceipt = light;
      root.HEARTH.canvasEastMaterialAtlasSourceMachineReceipt = light;
    }

    if (root.DEXTER_LAB) {
      root.DEXTER_LAB.hearthCanvasEastReceipt = light;
      root.DEXTER_LAB.hearthCanvasEastSourceReceipt = light;
      root.DEXTER_LAB.hearthCanvasEastSpineNodalParentAcceptanceSyncHeldAtlasSourceReceipt = light;
      root.DEXTER_LAB.hearthCanvasEastParentObservationRenewalSplitSyncHeldPacketReceipt = light;
      root.DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSourceReceipt = light;
      root.DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrapReceipt = light;
      root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSourceReceipt = light;
      root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSourceReceipt = light;
    }
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
      state.parentFirstApiPublished = true;
      state.publishedAt = state.publishedAt || nowIso();
      state.updatedAt = nowIso();

      if (!state.localEvents.some((event) => event.event === "CANVAS_EAST_SPINE_NODAL_API_SURFACE_PUBLISHED")) {
        state.localEvents.push({
          at: nowIso(),
          event: "CANVAS_EAST_SPINE_NODAL_API_SURFACE_PUBLISHED",
          detail: {
            reason,
            contract: CONTRACT,
            receipt: RECEIPT,
            methods: REQUIRED_METHODS.slice(),
            apiReadyBeforeParentScan: true,
            apiReadyBeforeMaterialScan: true,
            apiReadyBeforeAtlasEvidence: true,
            visualPassClaimed: false
          }
        });
        trimArray(state.localEvents, 180);
      }

      return getReceiptLight(false);
    } finally {
      publishDepth -= 1;
    }
  }

  function getReceiptLight(_doRefresh = false) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      compatibilityContract: COMPATIBILITY_CONTRACT,
      compatibilityReceipt: COMPATIBILITY_RECEIPT,
      currentParentContract: CURRENT_PARENT_CONTRACT,
      currentParentReceipt: CURRENT_PARENT_RECEIPT,
      routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
      routeConductorReceipt: ROUTE_CONDUCTOR_RECEIPT,
      version: VERSION,
      file: FILE,
      parentFile: PARENT_FILE,
      westFile: WEST_FILE,
      routeFile: ROUTE_FILE,
      role: state.role,

      spineNodalStructureActive: true,
      earlyApiSurfaceActive: true,
      aliasStationActive: true,
      datasetFirstProofActive: true,
      parentProfileNodeActive: true,
      westReleaseNodeActive: true,
      permissionGateNodeActive: true,
      synchronousHeldPacketNodeActive: true,
      atlasBuildNodeActive: true,
      parentReturnNodeActive: true,
      receiptLightFirstNodeActive: true,

      apiSurfacePublished: state.apiSurfacePublished,
      aliasesPublished: state.aliasesPublished,
      datasetFirstProofPublished: state.datasetFirstProofPublished,
      parentFirstApiPublished: state.parentFirstApiPublished,
      routeConductorCentralStationConsumed: state.routeConductorCentralStationConsumed,
      currentParentAcceptedExplicitly: state.currentParentAcceptedExplicitly,

      requiredApiSurfaceComplete: true,
      requiredMethods: state.requiredMethods.slice(),
      buildAtlasAvailable: true,
      buildAtlasSyncAvailable: true,
      buildAtlasAsyncAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,
      getReceiptLightAvailable: true,
      getReceiptTextAvailable: true,
      canvasEastPresent: true,
      canvasEastCurrent: true,
      canvasEastReady: true,
      canvasEastApiReady: true,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,

      parentAuthorityIsUpstream: true,
      eastAccustomsToParent: true,
      parentRenewalNotInferredFromEastAudit: true,
      parentObservationDoesNotEqualRenewal: true,
      parentContractExactMatchRequired: false,

      parentObserved: state.parentObserved,
      parentApiPresent: state.parentApiPresent,
      parentCallable: state.parentCallable,
      parentReceiptObserved: state.parentReceiptObserved,
      parentContract: state.parentContract,
      parentReceiptId: state.parentReceiptId,
      parentReleaseObserved: state.parentReleaseObserved,
      parentReleaseAccepted: state.parentReleaseAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
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

      routeConductorObserved: state.routeConductorObserved,
      routeConductorContractObserved: state.routeConductorContractObserved,
      routeConductorReceiptObserved: state.routeConductorReceiptObserved,
      routeConductorCentralStationActive: state.routeConductorCentralStationActive,

      westReleaseObserved: state.westReleaseObserved,
      westReleaseRequired: true,
      westAuditObserved: state.westAuditObserved,
      westAuditPassed: state.westAuditPassed,
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: state.westAuditBlocked,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,

      permissionClass: state.permissionClass,
      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,

      heldAtlasPacketReturned: state.heldAtlasPacketReturned,
      heldPacketWasSynchronous: state.heldPacketWasSynchronous,
      buildAtlasReturnedPromise: state.buildAtlasReturnedPromise,
      heldDoesNotMeanApiMissing: true,
      heldDoesNotMeanParentRenewalUnlessCorruptOrStale: true,
      heldMayMeanParentObservationPending: true,
      heldMayMeanWestReleasePending: true,
      heldMayMeanParentReleasePending: true,

      newsAlignmentProtocolActive: true,
      newsChronologicalOrderLocked: true,
      newsFinalizedByCanvasEast: false,
      chronology: CHRONOLOGY.slice(),
      chronologicalGateCount: state.chronologicalGateCount,
      chronologicalGatesSatisfied: state.chronologicalGatesSatisfied,
      chronologicalFirstFailedGate: state.chronologicalFirstFailedGate,
      chronologicalFirstFailedCoordinate: state.chronologicalFirstFailedCoordinate,

      fibonacciSynchronizationChronologyFirst: true,
      fibonacciAlignmentSynchronized: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationExpected: state.fibonacciSynchronizationExpected,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationPassed: state.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,
      fibonacciSynchronizationHardFail: state.fibonacciSynchronizationHardFail,
      fibonacciSynchronizationHoldReason: state.fibonacciSynchronizationHoldReason,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      activeF13EGate: F13E_GATE,
      activeF13FGate: F13F_GATE,
      futureFibonacciGate: FUTURE_FIBONACCI_GATE,
      oneActiveGearAtATime: true,
      activeCycleNumber: state.activeCycleNumber,
      activeCycleRoute: state.activeCycleRoute,
      activeCardinal: state.activeCardinal,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeNewsGate: state.activeNewsGate,

      indexGateReady: state.indexGateReady,
      routeF8GateReady: state.routeF8GateReady,
      macroWestGateReady: state.macroWestGateReady,
      canvasParentGateReady: state.parentAuthorityAccepted,
      canvasParentReleaseGateReady: state.parentReleaseAccepted,
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
      materialExpectedContract: state.materialExpectedContract,
      materialExpectedReceipt: state.materialExpectedReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialVersion: state.materialVersion,
      materialRole: state.materialRole,
      canonicalMaterialAuthorityPresent: state.canonicalMaterialAuthorityPresent,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,
      canonicalMaterialColorPrimary: state.canonicalMaterialColorPrimary,
      canonicalMaterialShapePrimary: state.canonicalMaterialShapePrimary,
      canvasEastDoesNotOwnMaterialTruth: true,
      canvasStillDoesNotOwnPlanetTruth: true,

      atlasSourceActive: true,
      upstreamFirstAtlasActive: true,
      atlasBuildRequested: state.atlasBuildRequested,
      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      atlasBuildError: state.atlasBuildError,
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

      fallbackSampleAvailable: true,
      fallbackSampleUsedAtRuntime: state.fallbackSampleUsedAtRuntime,
      sevenContinentFallbackEmergencyOnly: true,
      sevenContinentFallbackUsed: state.sevenContinentFallbackUsed,
      sevenContinentFallbackSuppressedByUpstream: state.sevenContinentFallbackSuppressedByUpstream,
      emergencyF13Requested: state.emergencyF13Requested,
      emergencyF13Reason: state.emergencyF13Reason,
      emergencyFallbackUsed: state.emergencyFallbackUsed,
      elevationControlsLandShape: true,
      hydrologyControlsWaterShape: true,
      coastlinesReadFromHydrologyAndMaterials: true,

      cachedAtlasInvalidationAvailable: true,
      atlasInvalidationCount: state.atlasInvalidationCount,
      atlasInvalidated: state.atlasInvalidated,
      atlasInvalidationReason: state.atlasInvalidationReason,

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      completionLatched: false,
      readyTextAllowed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      nextConsumerFile: PARENT_FILE,

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
      readyTextAllowed: false,
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
    const classes = (r.atlasClasses || []).join(",");

    return [
      "HEARTH_CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `baselineContract=${r.baselineContract}`,
      `baselineReceipt=${r.baselineReceipt}`,
      `compatibilityContract=${r.compatibilityContract}`,
      `compatibilityReceipt=${r.compatibilityReceipt}`,
      `currentParentContract=${r.currentParentContract}`,
      `routeConductorContract=${r.routeConductorContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `parentFile=${r.parentFile}`,
      `westFile=${r.westFile}`,
      `routeFile=${r.routeFile}`,
      `role=${r.role}`,
      "",
      "SPINE",
      `spineNodalStructureActive=${r.spineNodalStructureActive}`,
      `earlyApiSurfaceActive=${r.earlyApiSurfaceActive}`,
      `aliasStationActive=${r.aliasStationActive}`,
      `datasetFirstProofActive=${r.datasetFirstProofActive}`,
      `parentProfileNodeActive=${r.parentProfileNodeActive}`,
      `westReleaseNodeActive=${r.westReleaseNodeActive}`,
      `permissionGateNodeActive=${r.permissionGateNodeActive}`,
      `synchronousHeldPacketNodeActive=${r.synchronousHeldPacketNodeActive}`,
      `atlasBuildNodeActive=${r.atlasBuildNodeActive}`,
      `parentReturnNodeActive=${r.parentReturnNodeActive}`,
      `receiptLightFirstNodeActive=${r.receiptLightFirstNodeActive}`,
      "",
      "API",
      `apiSurfacePublished=${r.apiSurfacePublished}`,
      `aliasesPublished=${r.aliasesPublished}`,
      `datasetFirstProofPublished=${r.datasetFirstProofPublished}`,
      `requiredApiSurfaceComplete=${r.requiredApiSurfaceComplete}`,
      `buildAtlasAvailable=${r.buildAtlasAvailable}`,
      `buildAtlasSyncAvailable=${r.buildAtlasSyncAvailable}`,
      `buildAtlasAsyncAvailable=${r.buildAtlasAsyncAvailable}`,
      `sampleAvailable=${r.sampleAvailable}`,
      `readAvailable=${r.readAvailable}`,
      `getReceiptAvailable=${r.getReceiptAvailable}`,
      `getReceiptLightAvailable=${r.getReceiptLightAvailable}`,
      `getReceiptTextAvailable=${r.getReceiptTextAvailable}`,
      `canvasEastPresent=${r.canvasEastPresent}`,
      `canvasEastCurrent=${r.canvasEastCurrent}`,
      `canvasEastReady=${r.canvasEastReady}`,
      `canvasEastApiReady=${r.canvasEastApiReady}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      "",
      "PARENT",
      `parentAuthorityIsUpstream=${r.parentAuthorityIsUpstream}`,
      `eastAccustomsToParent=${r.eastAccustomsToParent}`,
      `parentRenewalNotInferredFromEastAudit=${r.parentRenewalNotInferredFromEastAudit}`,
      `parentObservationDoesNotEqualRenewal=${r.parentObservationDoesNotEqualRenewal}`,
      `parentContractExactMatchRequired=${r.parentContractExactMatchRequired}`,
      `currentParentAcceptedExplicitly=${r.currentParentAcceptedExplicitly}`,
      `parentObserved=${r.parentObserved}`,
      `parentApiPresent=${r.parentApiPresent}`,
      `parentCallable=${r.parentCallable}`,
      `parentReceiptObserved=${r.parentReceiptObserved}`,
      `parentContract=${r.parentContract}`,
      `parentReceiptId=${r.parentReceiptId}`,
      `parentReleaseObserved=${r.parentReleaseObserved}`,
      `parentReleaseAccepted=${r.parentReleaseAccepted}`,
      `parentReleaseLawful=${r.parentReleaseLawful}`,
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
      "",
      "WEST_RELEASE",
      `routeConductorObserved=${r.routeConductorObserved}`,
      `routeConductorCentralStationActive=${r.routeConductorCentralStationActive}`,
      `westReleaseObserved=${r.westReleaseObserved}`,
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditPassed=${r.westAuditPassed}`,
      `westAuditDegraded=${r.westAuditDegraded}`,
      `westAuditBlocked=${r.westAuditBlocked}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      "",
      "PERMISSION",
      `permissionClass=${r.permissionClass}`,
      `canvasEastMayBuildAtlas=${r.canvasEastMayBuildAtlas}`,
      `f13BuildLawful=${r.f13BuildLawful}`,
      `f13BuildBlockedReason=${r.f13BuildBlockedReason}`,
      `f13PermissionSource=${r.f13PermissionSource}`,
      "",
      "HELD_PACKET",
      `heldAtlasPacketReturned=${r.heldAtlasPacketReturned}`,
      `heldPacketWasSynchronous=${r.heldPacketWasSynchronous}`,
      `buildAtlasReturnedPromise=${r.buildAtlasReturnedPromise}`,
      `heldDoesNotMeanApiMissing=${r.heldDoesNotMeanApiMissing}`,
      `heldDoesNotMeanParentRenewalUnlessCorruptOrStale=${r.heldDoesNotMeanParentRenewalUnlessCorruptOrStale}`,
      "",
      "NEWS_ALIGNMENT",
      `newsAlignmentProtocolActive=${r.newsAlignmentProtocolActive}`,
      `newsChronologicalOrderLocked=${r.newsChronologicalOrderLocked}`,
      `newsFinalizedByCanvasEast=${r.newsFinalizedByCanvasEast}`,
      `chronologicalGateCount=${r.chronologicalGateCount}`,
      `chronologicalGatesSatisfied=${r.chronologicalGatesSatisfied}`,
      `chronologicalFirstFailedGate=${r.chronologicalFirstFailedGate}`,
      `chronologicalFirstFailedCoordinate=${r.chronologicalFirstFailedCoordinate}`,
      "",
      "FIBONACCI_SYNCHRONIZATION",
      `fibonacciSynchronizationChronologyFirst=${r.fibonacciSynchronizationChronologyFirst}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      `fibonacciSynchronizationExpected=${r.fibonacciSynchronizationExpected}`,
      `fibonacciSynchronizationSatisfied=${r.fibonacciSynchronizationSatisfied}`,
      `fibonacciSynchronizationPassed=${r.fibonacciSynchronizationPassed}`,
      `fibonacciSynchronizationDegraded=${r.fibonacciSynchronizationDegraded}`,
      `fibonacciSynchronizationHardFail=${r.fibonacciSynchronizationHardFail}`,
      `fibonacciSynchronizationHoldReason=${r.fibonacciSynchronizationHoldReason}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `activeF13EGate=${r.activeF13EGate}`,
      `activeF13FGate=${r.activeF13FGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
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
      `f13SourceStageStarted=${r.f13SourceStageStarted}`,
      `f13SourceStageComplete=${r.f13SourceStageComplete}`,
      `f13AtlasPacketReady=${r.f13AtlasPacketReady}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `nextConsumerFile=${r.nextConsumerFile}`,
      "",
      "FINAL_CLAIMS",
      `visibleProof=${r.visibleProof}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visiblePlanetAvailable=${r.visiblePlanetAvailable}`,
      `canvasReady=${r.canvasReady}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21ClaimedByCanvasEast=${r.f21ClaimedByCanvasEast}`,
      `readyTextClaimedByCanvasEast=${r.readyTextClaimedByCanvasEast}`,
      `completionLatched=${r.completionLatched}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `publishedAt=${r.publishedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  try {
    state.updatedAt = nowIso();
    publishApiSurface("initial-spine-api-surface-before-any-scan");

    try {
      syncMaterialBridge({ updateDataset: false, invalidate: false });
    } catch (materialError) {
      recordError("MATERIAL_BRIDGE_SYNC_NONBLOCKING_FAILURE", materialError, {
        apiAlreadyPublished: true,
        apiReadinessUnaffected: true
      });
    }

    try {
      readRouteConductorProfile({});
      readParentAuthorityProfile({});
      readWestReleaseState({});
      resolveAtlasBuildPermission({});
    } catch (profileError) {
      recordError("PROFILE_SCAN_NONBLOCKING_FAILURE", profileError, {
        apiAlreadyPublished: true,
        apiReadinessUnaffected: true
      });
    }

    publishApiSurface("post-profile-confirmation-api-surface");

    recordLocal("CANVAS_EAST_SPINE_NODAL_PARENT_ACCEPTANCE_SYNC_HELD_ATLAS_SOURCE_LOADED", {
      file: FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      currentParentContract: CURRENT_PARENT_CONTRACT,
      routeConductorContract: ROUTE_CONDUCTOR_CONTRACT,
      apiReadyBeforeParentScan: true,
      apiReadyBeforeMaterialScan: true,
      apiReadyBeforeAtlasEvidence: true,
      canvasEastApiReady: true,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,
      buildAtlasAlwaysCallable: true,
      buildAtlasHeldPathSynchronous: true,
      heldAtlasPacketDoesNotMeanApiMissing: true,
      parentRenewalNotInferredFromEastAudit: true,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
    });
  } catch (error) {
    recordError("CANVAS_EAST_SPINE_NODAL_INITIALIZATION_FAILED", error);

    try {
      publishAliasStation();
      publishDatasetFirstProof({ quiet: true });
      publishReceipts();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
