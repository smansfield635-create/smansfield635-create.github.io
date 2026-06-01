// /assets/hearth/hearth.canvas.east.js
// HEARTH_CANVAS_EAST_PARENT_ACCEPTED_COMPATIBILITY_ATLAS_SOURCE_TNT_v3
// Full-file replacement.
// Canvas East / parent-accepted compatibility atlas source child only.
// Purpose:
// - Make the active Canvas parent v5 recognize East immediately without renewing parent, West, South, route conductor, index, or HTML.
// - Preserve parent-facing contract identity already accepted by Canvas parent v5.
// - Carry the new renewal identity internally without breaking the parent whitelist.
// - Preserve buildAtlas, sample, read, getReceipt, material bridge, atlas cache, and all parent-required aliases.
// - Accept active Canvas parent v5 release packets, lawful Cycle 2 West release evidence, parent release evidence, or explicit emergency F13 support.
// - Build a governed F13E/F13F atlas/source packet after West release.
// - Keep East source/intake only.
// - Never promote atlas readiness into visible proof, Canvas readiness, F21, ready text, or final visual pass.
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

  /*
   * Parent-facing identity must remain one of the active Canvas parent v5 accepted contracts.
   * The renewal identity is carried internally only.
   */
  const CONTRACT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v3";
  const RECEIPT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT_v3";

  const INTERNAL_RENEWAL_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_ACCEPTED_COMPATIBILITY_ATLAS_SOURCE_TNT_v3";
  const INTERNAL_RENEWAL_RECEIPT = "HEARTH_CANVAS_EAST_PARENT_ACCEPTED_COMPATIBILITY_ATLAS_SOURCE_RECEIPT_v3";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE_AFTER_WEST_RELEASE_TNT_v2";
  const BASELINE_CONTRACT = "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_TNT_v3";

  const ACTIVE_PARENT_CONTRACT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_TNT_v5";
  const ACTIVE_PARENT_RECEIPT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_RECEIPT_v5";

  const VERSION = "2026-06-01.hearth-canvas-east-parent-accepted-compatibility-atlas-source-v3";
  const FILE = "/assets/hearth/hearth.canvas.east.js";
  const PARENT_FILE = "/assets/hearth/hearth.canvas.js";

  const EXPECTED_MATERIAL_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const EXPECTED_MATERIAL_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const ACTIVE_FIBONACCI_GATE = "F13E_F13F";
  const FUTURE_FIBONACCI_GATE = "F21";
  const CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const CYCLE_ORDER = "CANVAS_PARENT_V5_RELEASE_ACCEPTED -> EAST_SOURCE_F13E -> EAST_ATLAS_F13F -> PARENT_F13_RECEIPT";

  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const MIN_ATLAS_WIDTH = 256;
  const MIN_ATLAS_HEIGHT = 128;
  const MAX_ATLAS_WIDTH = 1024;
  const MAX_ATLAS_HEIGHT = 512;
  const REQUIRED_METHODS = Object.freeze(["buildAtlas", "sample", "read", "getReceipt"]);

  const LEGACY_PARENT_CONTRACTS_ACCEPTED_AS_CONTEXT = Object.freeze([
    "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST_TNT_v4",
    "HEARTH_CANVAS_PARENT_RELEASE_PACKET_TO_EAST_STALE_CLEARANCE_TNT_v3",
    "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2",
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

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

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
    scar: [31, 39, 39]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    activeParentContract: ACTIVE_PARENT_CONTRACT,
    activeParentReceipt: ACTIVE_PARENT_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,
    role: "canvas-east-parent-accepted-compatibility-atlas-source",

    parentFacingCompatibilityContractActive: true,
    currentParentRecognized: true,
    parentCompatibilityAliasesPublished: true,
    governedCanvasParentAligned: true,
    afterWestReleaseOnly: true,
    canvasEastSourceOnly: true,
    requiredApiSurfaceComplete: true,
    requiredMethods: REQUIRED_METHODS.slice(),

    newsProtocolSynchronized: true,
    fibonacciAlignmentSynchronized: true,
    activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
    futureFibonacciGate: FUTURE_FIBONACCI_GATE,
    oneActiveGearAtATime: true,
    cycleOrder: CYCLE_ORDER,
    newsFinalizedByCanvasEast: false,

    canvasEastApiReady: true,
    canvasEastCurrent: true,
    canvasEastEvidenceReady: false,

    canvasEastMayBuildAtlas: false,
    f13BuildLawful: false,
    f13BuildBlockedReason: "WAITING_CURRENT_PARENT_OR_WEST_RELEASE",
    f13PermissionSource: "NONE",
    heldAtlasPacketReturned: false,

    westReleaseObserved: false,
    westReleaseRequired: true,
    westAuditObserved: false,
    westAuditPassed: false,
    westAuditDegraded: false,
    westAuditBlocked: false,
    westCanvasReleaseApproved: false,
    canvasReleaseAuthorized: false,

    canvasParentObserved: false,
    canvasParentRequestObserved: false,
    canvasParentReleaseObserved: false,
    parentRequestLawful: false,
    parentReleaseLawful: false,
    parentCurrentContractObserved: false,
    parentLegacyContextObserved: false,
    staleParentContractDetected: false,

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
    activeStageId: "F13E_F13F_ATLAS_SOURCE",
    activeGearId: "F13E_F13F_ATLAS_SOURCE",
    activeNewsGate: "F13_CANVAS_EVIDENCE",

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

    firstFailedCoordinate: "WAITING_CURRENT_PARENT_OR_WEST_RELEASE",
    recommendedNextFile: PARENT_FILE,
    recommendedNextRenewalTarget: PARENT_FILE,

    lastNormalizedInput: null,
    lastPermissionPacket: null,
    lastAtlasPacket: null,
    lastHeldAtlasPacket: null,
    lastSampleAt: "",
    lastBuildAt: "",
    publishedAt: "",
    updatedAt: "",

    localEvents: [],
    errors: [],

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  };

  let atlasCanvas = null;
  let lastAtlasImageData = null;
  let materialSampler = null;

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

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
    return fallback;
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
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
    trimArray(state.localEvents, 160);
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
    trimArray(state.errors, 120);
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
      if (!cursor || typeof cursor !== "object" || cursor[part] === undefined || cursor[part] === null) return fallback;
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

  function findNestedReceipt(source, names) {
    if (!isObject(source)) return {};

    for (const name of names || []) {
      const direct = objectValue(source, name);
      if (isObject(direct)) return direct;
    }

    return {};
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const found = pathRead(name);
      if (found) return found;
    }

    return null;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    if (isFunction(authority.getReceipt)) {
      try {
        const receipt = authority.getReceipt();
        return isObject(receipt) ? receipt : null;
      } catch (_error) {
        return null;
      }
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version || authority.splitContract) return authority;

    return null;
  }

  function currentParentContractAccepted(contract = "") {
    const value = safeString(contract, "");

    if (!value) return false;
    if (value === ACTIVE_PARENT_CONTRACT) return true;
    if (LEGACY_PARENT_CONTRACTS_ACCEPTED_AS_CONTEXT.includes(value)) return true;
    if (value.includes("HEARTH_CANVAS_PARENT") && !value.includes("STALE")) return true;

    return false;
  }

  function readGovernedParentState(input = {}) {
    const directParent = findNestedReceipt(input, [
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
      "currentParentReceipt"
    ]);

    const parentApi = firstGlobal([
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION",
      "HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST",
      "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER",
      "HEARTH.canvas",
      "HEARTH.canvasParentCurrentSouthProofReconciliation",
      "HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasEvidence",
      "DEXTER_LAB.hearthCanvasParentCurrentSouthProofReconciliation",
      "DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver"
    ]);

    const parentReceipt = isObject(directParent) && Object.keys(directParent).length
      ? directParent
      : (readReceipt(parentApi) || {});

    const contract = firstString(
      input.parentContract,
      input.governedParentContract,
      input.parentSplitContract,
      parentReceipt.contract,
      parentReceipt.splitContract,
      parentReceipt.parentContract,
      parentReceipt.activeParentContract,
      parentApi && parentApi.contract,
      parentApi && parentApi.splitContract,
      datasetValue("hearthCanvasContract", ""),
      datasetValue("hearthCanvasSplitContract", "")
    );

    const receipt = firstString(
      input.parentReceipt,
      input.governedParentReceipt,
      input.parentSplitReceipt,
      parentReceipt.receipt,
      parentReceipt.splitReceipt,
      parentReceipt.parentReceipt,
      parentReceipt.activeParentReceipt,
      parentApi && parentApi.receipt,
      parentApi && parentApi.splitReceipt,
      datasetValue("hearthCanvasReceipt", ""),
      datasetValue("hearthCanvasSplitReceipt", "")
    );

    const currentParentObserved = contract === ACTIVE_PARENT_CONTRACT || receipt === ACTIVE_PARENT_RECEIPT;
    const legacyContextObserved = LEGACY_PARENT_CONTRACTS_ACCEPTED_AS_CONTEXT.includes(contract);

    const stale = Boolean(
      RETIRED_PARENT_SPLIT_CONTRACTS.includes(contract) ||
      RETIRED_PARENT_SPLIT_CONTRACTS.includes(receipt) ||
      firstBool(
        false,
        input.staleParentContractDetected,
        input.currentParentStaleDetected,
        parentReceipt.staleParentDetected,
        parentReceipt.currentParentStaleDetected,
        parentReceipt.currentParentIdentityMismatch
      )
    );

    const parentObserved = Boolean(
      parentApi ||
      parentReceipt.contract ||
      parentReceipt.splitContract ||
      contract ||
      datasetValue("hearthCanvasLoaded", "") === "true" ||
      datasetValue("hearthCanvasParentMarkerPresent", "") === "true"
    );

    const parentRequestObserved = firstBool(
      false,
      input.canvasParentRequestObserved,
      input.parentRequestObserved,
      input.atlasBuildRequested,
      input.f13AtlasBuildRequested,
      input.buildAtlasRequested,
      input.requestedBy === "canvas-parent",
      input.requestSource === "canvas-parent-current-south-proof-reconciliation",
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

    const parentReleaseObserved = firstBool(
      false,
      input.canvasParentReleaseObserved,
      input.parentReleaseObserved,
      input.parentReleaseLawful,
      input.canvasReleaseAuthorized,
      input.releaseToCanvas,
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
      datasetValue("hearthCanvasReleaseAuthorized", "")
    );

    const parentCurrentAccepted = currentParentContractAccepted(contract) || currentParentObserved;
    const parentLaw = Boolean(parentObserved && parentCurrentAccepted && !stale);
    const parentRequestLawful = Boolean(parentLaw && parentRequestObserved);
    const parentReleaseLawful = Boolean(parentLaw && parentReleaseObserved);

    return {
      parentApiPresent: Boolean(parentApi),
      parentObserved,
      parentReceipt: clonePlain(parentReceipt),
      parentContract: contract,
      parentReceiptId: receipt,
      parentCurrentContractObserved: currentParentObserved,
      parentLegacyContextObserved: legacyContextObserved,
      parentCurrentAccepted,
      staleParentContractDetected: stale,
      activeParentContract: ACTIVE_PARENT_CONTRACT,
      activeParentReceipt: ACTIVE_PARENT_RECEIPT,
      governedCanvasParentAligned: true,
      canvasParentRequestObserved: parentRequestObserved,
      canvasParentReleaseObserved: parentReleaseObserved,
      parentRequestLawful,
      parentReleaseLawful
    };
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

    const westAuditObserved = firstBool(
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
      datasetValue("westGateReady", "")
    );

    const westAuditPassed = firstBool(
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
      datasetValue("westCanvasReleaseAuthorized", "")
    );

    const westAuditDegraded = firstBool(
      false,
      input.westAuditDegraded,
      input.westReleaseDegraded,
      westReceipt.westAuditDegraded,
      westReceipt.westGateDegradedReady,
      westReceipt.canDegradeForward,
      westReceipt.decision === "DEGRADED_FORWARD",
      datasetValue("hearthCanvasWestAuditDegraded", "")
    );

    const westAuditBlocked = firstBool(
      false,
      input.westAuditBlocked,
      westReceipt.westAuditBlocked,
      westReceipt.hardBlock,
      westReceipt.westHardBlock,
      westReceipt.decision === "HARD_BLOCK",
      datasetValue("hearthCanvasWestAuditBlocked", "")
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
      datasetValue("hearthCanvasWestReleaseApproved", "")
    );

    const canvasReleaseAuthorized = firstBool(
      false,
      input.canvasReleaseAuthorized,
      input.releaseToCanvas,
      westReceipt.canvasReleaseAuthorized,
      westReceipt.releaseToCanvas,
      westCanvasReleaseApproved,
      datasetValue("hearthCanvasReleaseAuthorized", "")
    );

    const cycle2 = Boolean(
      safeNumber(input.cycleNumber || input.activeCycleNumber || westReceipt.cycleNumber || westReceipt.activeCycleNumber, 2) === 2 ||
      firstString(input.cycleRoute, input.activeCycleRoute, westReceipt.cycleRoute, westReceipt.activeCycleRoute).includes(CYCLE_ROUTE)
    );

    const westReleaseObserved = Boolean(
      !westAuditBlocked &&
      cycle2 &&
      firstBool(
        Boolean((westAuditObserved && (westAuditPassed || westAuditDegraded)) || westCanvasReleaseApproved || canvasReleaseAuthorized),
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
      westReleaseObserved,
      westReleaseRequired: true,
      westAuditObserved,
      westAuditPassed,
      westAuditDegraded,
      westAuditBlocked,
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
    const parent = readGovernedParentState(source);
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
      parent.canvasParentRequestObserved,
      parent.canvasParentReleaseObserved
    );

    const receivedFrom = firstString(
      source.receivedFrom,
      source.sourceCardinal,
      source.requestedBy,
      parent.parentReleaseLawful ? "PARENT" : "",
      west.westReleaseObserved ? "WEST" : ""
    );

    const normalized = {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
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
      activeStageId: firstString(source.activeStageId, source.activeGearId, "F13E_F13F_ATLAS_SOURCE"),
      activeGearId: firstString(source.activeGearId, source.activeStageId, "F13E_F13F_ATLAS_SOURCE"),
      activeNewsGate: firstString(source.activeNewsGate, "F13_CANVAS_EVIDENCE"),

      parent,
      west,

      westReleaseObserved: west.westReleaseObserved,
      westReleaseRequired: true,
      westAuditObserved: west.westAuditObserved,
      westAuditPassed: west.westAuditPassed,
      westAuditDegraded: west.westAuditDegraded,
      westAuditBlocked: west.westAuditBlocked,
      westCanvasReleaseApproved: west.westCanvasReleaseApproved,
      canvasReleaseAuthorized: west.canvasReleaseAuthorized,

      canvasParentObserved: parent.parentObserved,
      canvasParentRequestObserved: parent.canvasParentRequestObserved,
      canvasParentReleaseObserved: parent.canvasParentReleaseObserved,
      parentRequestLawful: parent.parentRequestLawful,
      parentReleaseLawful: parent.parentReleaseLawful,
      parentCurrentContractObserved: parent.parentCurrentContractObserved,
      parentLegacyContextObserved: parent.parentLegacyContextObserved,
      staleParentContractDetected: parent.staleParentContractDetected,

      emergencyF13Requested,
      emergencyF13Reason: firstString(source.emergencyF13Reason, source.reason, parent.staleParentContractDetected ? "stale-parent-contract" : ""),
      atlasBuildRequested,
      atlasBuildPermissionRequired: true,

      materialAuthorityObserved: Boolean(getMaterialAuthority()),
      materialBridgeActive: state.materialReceiptBridgeActive,
      materialBridgeChanged: state.materialBridgeChanged,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,

      newsGatePassedBeforeF21: firstBool(false, source.newsGatePassedBeforeF21, objectValue(parent.parentReceipt, "newsGatePassedBeforeF21")),
      newsGateDegradedBeforeF21: firstBool(false, source.newsGateDegradedBeforeF21, objectValue(parent.parentReceipt, "newsGateDegradedBeforeF21")),
      northGateReady: firstBool(false, source.northGateReady, objectValue(parent.parentReceipt, "northGateReady")),
      eastGateReady: true,
      westGateReady: firstBool(false, source.westGateReady, west.westAuditPassed || west.westAuditDegraded || west.westCanvasReleaseApproved),
      southGateReady: firstBool(false, source.southGateReady, objectValue(parent.parentReceipt, "southGateReady")),
      canvasGateReady: firstBool(false, source.canvasGateReady, objectValue(parent.parentReceipt, "canvasGateReady")),

      f21EligibleForNorth: firstBool(false, source.f21EligibleForNorth, objectValue(parent.parentReceipt, "f21EligibleForNorth")),
      falsePromotionDetected: detectFalsePromotion(source),

      firstFailedCoordinate: firstString(source.firstFailedCoordinate, "WAITING_CURRENT_PARENT_OR_WEST_RELEASE"),
      recommendedNextFile: firstString(source.recommendedNextFile, PARENT_FILE),
      recommendedNextRenewalTarget: firstString(source.recommendedNextRenewalTarget, PARENT_FILE),

      raw: clonePlain(source),
      normalizedAt: nowIso()
    };

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

    state.westReleaseObserved = normalized.westReleaseObserved;
    state.westReleaseRequired = true;
    state.westAuditObserved = normalized.westAuditObserved;
    state.westAuditPassed = normalized.westAuditPassed;
    state.westAuditDegraded = normalized.westAuditDegraded;
    state.westAuditBlocked = normalized.westAuditBlocked;
    state.westCanvasReleaseApproved = normalized.westCanvasReleaseApproved;
    state.canvasReleaseAuthorized = normalized.canvasReleaseAuthorized;

    state.canvasParentObserved = normalized.canvasParentObserved;
    state.canvasParentRequestObserved = normalized.canvasParentRequestObserved;
    state.canvasParentReleaseObserved = normalized.canvasParentReleaseObserved;
    state.parentRequestLawful = normalized.parentRequestLawful;
    state.parentReleaseLawful = normalized.parentReleaseLawful;
    state.parentCurrentContractObserved = normalized.parentCurrentContractObserved;
    state.parentLegacyContextObserved = normalized.parentLegacyContextObserved;
    state.staleParentContractDetected = normalized.staleParentContractDetected;

    state.emergencyF13Requested = normalized.emergencyF13Requested;
    state.emergencyF13Reason = normalized.emergencyF13Reason;
    state.atlasBuildRequested = normalized.atlasBuildRequested;

    state.northGateReady = normalized.northGateReady;
    state.eastGateReady = true;
    state.westGateReady = normalized.westGateReady;
    state.southGateReady = normalized.southGateReady;
    state.canvasGateReady = normalized.canvasGateReady;
    state.newsGatePassedBeforeF21 = normalized.newsGatePassedBeforeF21;
    state.newsGateDegradedBeforeF21 = normalized.newsGateDegradedBeforeF21;
    state.f21EligibleForNorth = normalized.f21EligibleForNorth;

    state.canvasEastApiReady = true;
    state.canvasEastCurrent = true;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.visualPassClaimed = false;
  }

  function resolveParentRequest(input = {}) {
    const normalized = isObject(input) && input.parent ? input : normalizeCanvasEastInput(input);
    return Boolean(normalized.canvasParentRequestObserved && normalized.parentRequestLawful && !normalized.staleParentContractDetected);
  }

  function resolveWestRelease(input = {}) {
    const normalized = isObject(input) && input.west ? input : normalizeCanvasEastInput(input);
    return Boolean(normalized.westReleaseObserved && !normalized.westAuditBlocked);
  }

  function resolveAtlasBuildPermission(input = {}) {
    const normalized = isObject(input) && input.parent && input.west ? input : normalizeCanvasEastInput(input);

    let allowed = false;
    let source = "NONE";
    let reason = "WAITING_CURRENT_PARENT_OR_WEST_RELEASE";

    if (normalized.falsePromotionDetected) {
      allowed = false;
      source = "NONE";
      reason = "FALSE_PROMOTION_BLOCKED";
    } else if (normalized.staleParentContractDetected) {
      allowed = false;
      source = "NONE";
      reason = "STALE_PARENT_CONTRACT_DETECTED";
    } else if (normalized.emergencyF13Requested) {
      allowed = true;
      source = "EMERGENCY_F13";
      reason = "NONE_EMERGENCY_F13_ATLAS_ALLOWED";
    } else if (normalized.parentReleaseLawful) {
      allowed = true;
      source = "CURRENT_PARENT_RELEASE";
      reason = "NONE_CURRENT_PARENT_RELEASE_LAWFUL";
    } else if (normalized.parentRequestLawful && normalized.westReleaseObserved) {
      allowed = true;
      source = "CURRENT_PARENT_REQUEST_AFTER_WEST_RELEASE";
      reason = "NONE_CURRENT_PARENT_REQUEST_AFTER_WEST_RELEASE";
    } else if (normalized.westReleaseObserved && normalized.canvasReleaseAuthorized) {
      allowed = true;
      source = "WEST_CANVAS_RELEASE";
      reason = "NONE_WEST_RELEASE_TO_CANVAS_PARENT";
    } else if (normalized.westCanvasReleaseApproved && normalized.destinationFile === PARENT_FILE) {
      allowed = true;
      source = "WEST_RELEASE_TO_PARENT";
      reason = "NONE_WEST_RELEASE_TO_PARENT";
    }

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      activeParentContract: ACTIVE_PARENT_CONTRACT,
      activeParentReceipt: ACTIVE_PARENT_RECEIPT,
      parentFacingCompatibilityContractActive: true,
      currentParentRecognized: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      canvasEastMayBuildAtlas: allowed,
      f13BuildLawful: allowed,
      f13BuildBlockedReason: allowed ? "" : reason,
      f13PermissionSource: source,

      westReleaseObserved: normalized.westReleaseObserved,
      westAuditObserved: normalized.westAuditObserved,
      westAuditPassed: normalized.westAuditPassed,
      westAuditDegraded: normalized.westAuditDegraded,
      westAuditBlocked: normalized.westAuditBlocked,
      westCanvasReleaseApproved: normalized.westCanvasReleaseApproved,
      canvasReleaseAuthorized: normalized.canvasReleaseAuthorized,

      canvasParentObserved: normalized.canvasParentObserved,
      canvasParentRequestObserved: normalized.canvasParentRequestObserved,
      canvasParentReleaseObserved: normalized.canvasParentReleaseObserved,
      parentRequestLawful: normalized.parentRequestLawful,
      parentReleaseLawful: normalized.parentReleaseLawful,
      parentCurrentContractObserved: normalized.parentCurrentContractObserved,
      parentLegacyContextObserved: normalized.parentLegacyContextObserved,

      emergencyF13Requested: normalized.emergencyF13Requested,
      emergencyF13Reason: normalized.emergencyF13Reason,
      falsePromotionDetected: normalized.falsePromotionDetected,
      staleParentContractDetected: normalized.staleParentContractDetected,

      firstFailedCoordinate: allowed ? "NONE_F13_ATLAS_BUILD_PERMISSION_GRANTED" : reason,
      recommendedNextFile: allowed ? FILE : PARENT_FILE,
      recommendedNextRenewalTarget: allowed ? FILE : PARENT_FILE,

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
      visualPassClaimed: false,
      createdAt: nowIso()
    };

    state.canvasEastMayBuildAtlas = allowed;
    state.f13BuildLawful = allowed;
    state.f13BuildBlockedReason = allowed ? "" : reason;
    state.f13PermissionSource = source;
    state.firstFailedCoordinate = packet.firstFailedCoordinate;
    state.recommendedNextFile = packet.recommendedNextFile;
    state.recommendedNextRenewalTarget = packet.recommendedNextRenewalTarget;
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
    state.canvasEastMayBuildAtlas = false;
    state.f13BuildLawful = false;
    state.f13BuildBlockedReason = gate.f13BuildBlockedReason || "WAITING_CURRENT_PARENT_OR_WEST_RELEASE";
    state.f13PermissionSource = "NONE";
    state.atlasBuildStarted = false;
    state.atlasBuildComplete = false;
    state.canvasEastEvidenceReady = false;
    state.f13SourceStageStarted = false;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.firstFailedCoordinate = state.f13BuildBlockedReason;
    state.recommendedNextFile = PARENT_FILE;
    state.recommendedNextRenewalTarget = PARENT_FILE;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.visualPassClaimed = false;

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      activeParentContract: ACTIVE_PARENT_CONTRACT,
      parentFacingCompatibilityContractActive: true,
      currentParentRecognized: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      heldAtlasPacketReturned: true,
      atlasCanvas: null,
      canvas: null,
      width: safeNumber(normalized.raw && (normalized.raw.width || normalized.raw.atlasWidth), DEFAULT_ATLAS_WIDTH),
      height: safeNumber(normalized.raw && (normalized.raw.height || normalized.raw.atlasHeight), DEFAULT_ATLAS_HEIGHT),
      atlasReady: false,
      atlasBuildComplete: false,

      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastEvidenceReady: false,
      canvasEastMayBuildAtlas: false,
      f13BuildLawful: false,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: "NONE",
      f13SourceStageStarted: false,
      f13SourceStageComplete: false,
      f13AtlasPacketReady: false,

      westReleaseObserved: normalized.westReleaseObserved,
      westCanvasReleaseApproved: normalized.westCanvasReleaseApproved,
      canvasReleaseAuthorized: normalized.canvasReleaseAuthorized,
      canvasParentObserved: normalized.canvasParentObserved,
      canvasParentRequestObserved: normalized.canvasParentRequestObserved,
      canvasParentReleaseObserved: normalized.canvasParentReleaseObserved,
      parentCurrentContractObserved: normalized.parentCurrentContractObserved,
      emergencyF13Requested: normalized.emergencyF13Requested,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
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
      f21ClaimedByCanvasEast: false,
      readyTextClaimedByCanvasEast: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false
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

  function normalizePoint(input = {}) {
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

    return pointFromUv(0.5, 0.5);
  }

  function getMaterialAuthority() {
    const candidates = [
      pathRead("HEARTH.materials"),
      pathRead("HEARTH.materialAuthority"),
      pathRead("HEARTH.materialsAuthority"),
      pathRead("HEARTH.surfaceMaterials"),
      root.HEARTH_MATERIALS,
      root.HEARTH_MATERIAL_AUTHORITY,
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

    return {
      contract: authority.contract || "",
      receipt: authority.receipt || "",
      previousContract: authority.previousContract || "",
      baselineContract: authority.baselineContract || "",
      requiredElevationContract: authority.requiredElevationContract || "",
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
      (n - 0.5) * 0.18
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

    if (isLand && n > 0.68) {
      rgb = mixColor(rgb, PALETTE.ridge, clamp01((n - 0.68) * 0.54));
    }

    if (isLand && n > 0.84) {
      rgb = mixColor(rgb, PALETTE.peak, clamp01((n - 0.84) * 0.62));
    }

    if (isLand && n < 0.22) {
      rgb = mixColor(rgb, PALETTE.canyon, clamp01((0.22 - n) * 0.44));
    }

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

    const greenSuppression = clamp01(
      scar * 0.08 +
      canyon * 0.06 +
      relief * 0.03 +
      water * 0.04
    );

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
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      activeParentContract: ACTIVE_PARENT_CONTRACT,
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

  function sample(point = {}) {
    try {
      return sampleWithAuthority(point, getMaterialAuthority(), {
        syncBridge: true,
        updateDataset: false
      });
    } catch (error) {
      recordError("SAMPLE_FAILED_USING_FALLBACK", error);
      return normalizeSample(fallbackTerrain(normalizePoint(point)), normalizePoint(point), true);
    }
  }

  function read(point = {}) {
    return sample(point);
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
    canvas.dataset.hearthCanvasEastInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    canvas.dataset.hearthCanvasEastActiveParentContract = ACTIVE_PARENT_CONTRACT;
    canvas.dataset.hearthCanvasEastCurrentParentRecognized = "true";
    canvas.dataset.hearthCanvasEastParentFacingCompatibilityContract = "true";
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

  function resetBuildCounters(width, height) {
    state.heldAtlasPacketReturned = false;
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

    state.canvasEastEvidenceReady = false;
    state.f13SourceStageStarted = true;
    state.f13SourceStageComplete = false;
    state.f13AtlasPacketReady = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.visualPassClaimed = false;

    state.updatedAt = state.atlasBuildStartedAt;

    recordLocal("F13E_ATLAS_BUILD_STARTED", {
      width,
      height,
      activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
      permissionSource: state.f13PermissionSource,
      contract: CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      activeParentContract: ACTIVE_PARENT_CONTRACT
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
          internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
          internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
          activeParentContract: ACTIVE_PARENT_CONTRACT,
          event: "ATLAS_BUILD_PROGRESS",
          fibonacci: ACTIVE_FIBONACCI_GATE,
          progress: state.atlasBuildProgress,
          detail: clonePlain(detail),
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

  async function buildAtlas(options = {}) {
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

    resetBuildCounters(width, height);
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
            height
          });
          await yieldBuildFrame();
        }
      }

      ctx.putImageData(imageData, 0, 0);
      lastAtlasImageData = imageData;

      state.atlasBuildProgress = 100;
      state.atlasBuildComplete = true;
      state.atlasCanvasPresent = true;
      state.atlasInvalidated = false;
      state.atlasInvalidationReason = "";
      state.atlasClassCount = classSet.size;
      state.atlasClasses = Array.from(classSet).slice(0, 64);
      state.atlasBuildCompletedAt = nowIso();
      state.atlasBuildElapsedMs = Math.max(0, Date.parse(state.atlasBuildCompletedAt) - Date.parse(state.atlasBuildStartedAt));
      state.lastBuildAt = state.atlasBuildCompletedAt;
      state.canvasEastEvidenceReady = true;
      state.f13SourceStageComplete = true;
      state.f13AtlasPacketReady = true;
      state.firstFailedCoordinate = "NONE_F13F_ATLAS_PACKET_READY";
      state.recommendedNextFile = PARENT_FILE;
      state.recommendedNextRenewalTarget = PARENT_FILE;
      state.f21ClaimedByCanvasEast = false;
      state.readyTextClaimedByCanvasEast = false;
      state.visualPassClaimed = false;
      state.updatedAt = state.atlasBuildCompletedAt;

      recordLocal("F13F_ATLAS_BUILD_COMPLETE", {
        width,
        height,
        atlasPixelCount: state.atlasPixelCount,
        atlasClassCount: state.atlasClassCount,
        fallbackSamples: state.atlasFallbackSampleCount,
        materialSamples: state.atlasMaterialSampleCount,
        canonicalMaterialSamples: state.atlasCanonicalMaterialSampleCount,
        activeFibonacciGate: ACTIVE_FIBONACCI_GATE,
        permissionSource: state.f13PermissionSource,
        canvasEastEvidenceReady: true,
        visibleProof: false,
        visibleContentProof: false,
        visiblePlanetAvailable: false,
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
    } catch (error) {
      state.atlasBuildError = error && error.message ? error.message : String(error);
      state.atlasBuildComplete = false;
      state.canvasEastEvidenceReady = false;
      state.f13SourceStageComplete = false;
      state.f13AtlasPacketReady = false;
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_BUILD";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.f21ClaimedByCanvasEast = false;
      state.readyTextClaimedByCanvasEast = false;
      state.visualPassClaimed = false;
      state.updatedAt = nowIso();

      recordError("ATLAS_BUILD_FAILED", error, {
        width,
        height,
        permissionSource: state.f13PermissionSource
      });

      updateDataset();
      publishGlobals();

      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
        internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
        file: FILE,
        parentFile: PARENT_FILE,
        activeParentContract: ACTIVE_PARENT_CONTRACT,
        parentFacingCompatibilityContractActive: true,
        currentParentRecognized: true,
        governedCanvasParentAligned: true,
        afterWestReleaseOnly: true,
        canvasEastSourceOnly: true,
        canvasEastApiReady: true,
        canvasEastCurrent: true,
        canvasEastEvidenceReady: false,
        atlasBuildStarted: true,
        atlasBuildComplete: false,
        atlasBuildError: state.atlasBuildError,
        f13SourceStageStarted: true,
        f13SourceStageComplete: false,
        f13AtlasPacketReady: false,
        firstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_BUILD",
        recommendedNextFile: FILE,
        recommendedNextRenewalTarget: FILE,
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
  }

  function composeAtlasEvidencePacket(config = {}) {
    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      file: FILE,
      parentFile: PARENT_FILE,
      activeParentContract: ACTIVE_PARENT_CONTRACT,
      activeParentReceipt: ACTIVE_PARENT_RECEIPT,
      parentFacingCompatibilityContractActive: true,
      currentParentRecognized: true,
      parentCompatibilityAliasesPublished: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,

      atlasCanvas: config.atlasCanvas || atlasCanvas || null,
      canvas: config.atlasCanvas || atlasCanvas || null,
      width: safeNumber(config.width, state.atlasWidth),
      height: safeNumber(config.height, state.atlasHeight),
      atlasWidth: safeNumber(config.width, state.atlasWidth),
      atlasHeight: safeNumber(config.height, state.atlasHeight),
      atlasReady: Boolean(config.atlasCanvas || atlasCanvas),
      atlasBuildComplete: state.atlasBuildComplete,
      f13AtlasReady: state.f13AtlasPacketReady,
      f13AtlasEvidenceAvailable: state.f13AtlasPacketReady,
      f13AtlasPacketReady: state.f13AtlasPacketReady,
      sourceRole: "east-material-atlas-source",
      materialBridgeReceipt: getMaterialBridgeReceipt({ sync: false }),

      f13SourceStageStarted: state.f13SourceStageStarted,
      f13SourceStageComplete: state.f13SourceStageComplete,

      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,
      canvasEastReady: state.f13AtlasPacketReady,

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
      visualPassClaimed: false,
      getReceipt,
      createdAt: nowIso()
    };

    state.lastAtlasPacket = clonePlain({
      ...packet,
      atlasCanvas: packet.atlasCanvas ? "[canvas]" : null,
      canvas: packet.canvas ? "[canvas]" : null,
      getReceipt: "[function]"
    });

    return state.emergencyF13Requested ? composeEmergencyF13AtlasPacket(packet) : packet;
  }

  function invalidateAtlas(reason = "manual-invalidation", options = {}) {
    state.atlasInvalidationCount += 1;
    state.atlasInvalidated = true;
    state.atlasInvalidationReason = safeString(reason, "manual-invalidation");
    state.atlasBuildComplete = false;
    state.atlasCanvasPresent = false;
    state.canvasEastEvidenceReady = false;
    state.f13AtlasPacketReady = false;
    state.f13SourceStageComplete = false;
    state.f21ClaimedByCanvasEast = false;
    state.readyTextClaimedByCanvasEast = false;
    state.visualPassClaimed = false;
    state.updatedAt = nowIso();

    atlasCanvas = null;
    lastAtlasImageData = null;

    recordLocal("ATLAS_INVALIDATED", {
      reason: state.atlasInvalidationReason
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
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      activeParentContract: ACTIVE_PARENT_CONTRACT,
      activeParentReceipt: ACTIVE_PARENT_RECEIPT,
      expectedMaterialContract: EXPECTED_MATERIAL_CONTRACT,
      expectedMaterialReceipt: EXPECTED_MATERIAL_RECEIPT,
      version: VERSION,
      file: FILE,
      parentFile: PARENT_FILE,
      role: state.role,

      parentFacingCompatibilityContractActive: true,
      currentParentRecognized: true,
      parentCompatibilityAliasesPublished: true,
      governedCanvasParentAligned: true,
      afterWestReleaseOnly: true,
      canvasEastSourceOnly: true,

      requiredApiSurfaceComplete: true,
      requiredMethods: state.requiredMethods.slice(),
      buildAtlasAvailable: true,
      sampleAvailable: true,
      readAvailable: true,
      getReceiptAvailable: true,

      canvasEastApiReady: true,
      canvasEastCurrent: true,
      canvasEastEvidenceReady: state.f13AtlasPacketReady,
      canvasEastReady: state.f13AtlasPacketReady,

      canvasEastMayBuildAtlas: state.canvasEastMayBuildAtlas,
      f13BuildLawful: state.f13BuildLawful,
      f13BuildBlockedReason: state.f13BuildBlockedReason,
      f13PermissionSource: state.f13PermissionSource,

      westReleaseObserved: state.westReleaseObserved,
      westReleaseRequired: state.westReleaseRequired,
      westAuditObserved: state.westAuditObserved,
      westAuditPassed: state.westAuditPassed,
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: state.westAuditBlocked,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,

      canvasParentObserved: state.canvasParentObserved,
      canvasParentRequestObserved: state.canvasParentRequestObserved,
      canvasParentReleaseObserved: state.canvasParentReleaseObserved,
      parentRequestLawful: state.parentRequestLawful,
      parentReleaseLawful: state.parentReleaseLawful,
      parentCurrentContractObserved: state.parentCurrentContractObserved,
      parentLegacyContextObserved: state.parentLegacyContextObserved,
      staleParentContractDetected: state.staleParentContractDetected,

      emergencyF13Requested: state.emergencyF13Requested,
      emergencyF13Reason: state.emergencyF13Reason,
      emergencyF13AtlasPacket: state.emergencyF13AtlasPacket,

      newsProtocolSynchronized: true,
      newsFinalizedByCanvasEast: false,
      northGateReady: state.northGateReady,
      eastGateReady: true,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
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
      atlasReady: state.atlasBuildComplete,
      f13AtlasReady: state.f13AtlasPacketReady,
      f13AtlasEvidenceAvailable: state.f13AtlasPacketReady,
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

      heldAtlasPacketReturned: state.heldAtlasPacketReturned,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      ownsSourceMaterialAtlas: true,
      ownsBuildAtlasMethod: true,
      ownsSampleMethod: true,
      ownsReadMethod: true,
      ownsReceiptSurface: true,

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
      .slice(-32)
      .map((event) => `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .map((error) => `- ${error.at} :: ${error.code} :: ${error.message}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_EAST_PARENT_ACCEPTED_COMPATIBILITY_ATLAS_SOURCE_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `internalRenewalContract=${r.internalRenewalContract}`,
      `internalRenewalReceipt=${r.internalRenewalReceipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `activeParentContract=${r.activeParentContract}`,
      `activeParentReceipt=${r.activeParentReceipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `parentFile=${r.parentFile}`,
      `role=${r.role}`,
      "",
      `parentFacingCompatibilityContractActive=${r.parentFacingCompatibilityContractActive}`,
      `currentParentRecognized=${r.currentParentRecognized}`,
      `parentCompatibilityAliasesPublished=${r.parentCompatibilityAliasesPublished}`,
      `governedCanvasParentAligned=${r.governedCanvasParentAligned}`,
      `afterWestReleaseOnly=${r.afterWestReleaseOnly}`,
      `canvasEastSourceOnly=${r.canvasEastSourceOnly}`,
      "",
      `requiredApiSurfaceComplete=${r.requiredApiSurfaceComplete}`,
      `buildAtlasAvailable=${r.buildAtlasAvailable}`,
      `sampleAvailable=${r.sampleAvailable}`,
      `readAvailable=${r.readAvailable}`,
      `getReceiptAvailable=${r.getReceiptAvailable}`,
      `canvasEastApiReady=${r.canvasEastApiReady}`,
      `canvasEastCurrent=${r.canvasEastCurrent}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      "",
      `canvasEastMayBuildAtlas=${r.canvasEastMayBuildAtlas}`,
      `f13BuildLawful=${r.f13BuildLawful}`,
      `f13BuildBlockedReason=${r.f13BuildBlockedReason}`,
      `f13PermissionSource=${r.f13PermissionSource}`,
      `westReleaseObserved=${r.westReleaseObserved}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `canvasParentObserved=${r.canvasParentObserved}`,
      `canvasParentReleaseObserved=${r.canvasParentReleaseObserved}`,
      `parentCurrentContractObserved=${r.parentCurrentContractObserved}`,
      `emergencyF13Requested=${r.emergencyF13Requested}`,
      "",
      `newsProtocolSynchronized=${r.newsProtocolSynchronized}`,
      `newsFinalizedByCanvasEast=${r.newsFinalizedByCanvasEast}`,
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      "",
      `fibonacciAlignmentSynchronized=${r.fibonacciAlignmentSynchronized}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      "",
      `materialReceiptBridgeActive=${r.materialReceiptBridgeActive}`,
      `materialNestedReceiptAvailable=${r.materialNestedReceiptAvailable}`,
      `materialContract=${r.materialContract}`,
      `materialReceipt=${r.materialReceipt}`,
      `materialContractMatchesExpected=${r.materialContractMatchesExpected}`,
      `materialReceiptMatchesExpected=${r.materialReceiptMatchesExpected}`,
      `canonicalMaterialAuthorityPresent=${r.canonicalMaterialAuthorityPresent}`,
      `canonicalMaterialConsumed=${r.canonicalMaterialConsumed}`,
      "",
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
      `f13SourceStageStarted=${r.f13SourceStageStarted}`,
      `f13SourceStageComplete=${r.f13SourceStageComplete}`,
      `f13AtlasPacketReady=${r.f13AtlasPacketReady}`,
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21ClaimedByCanvasEast=${r.f21ClaimedByCanvasEast}`,
      `readyTextClaimedByCanvasEast=${r.readyTextClaimedByCanvasEast}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      `ownsSourceMaterialAtlas=${r.ownsSourceMaterialAtlas}`,
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
    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasEastLoaded = "true";
    dataset.hearthCanvasEastPresent = "true";
    dataset.hearthCanvasEastContract = CONTRACT;
    dataset.hearthCanvasEastReceipt = RECEIPT;
    dataset.hearthCanvasEastInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
    dataset.hearthCanvasEastInternalRenewalReceipt = INTERNAL_RENEWAL_RECEIPT;
    dataset.hearthCanvasEastVersion = VERSION;

    dataset.hearthCanvasEastParentFacingCompatibilityContractActive = "true";
    dataset.hearthCanvasEastActiveParentContract = ACTIVE_PARENT_CONTRACT;
    dataset.hearthCanvasEastCurrentParentRecognized = "true";
    dataset.hearthCanvasEastParentCompatibilityAliasesPublished = "true";
    dataset.hearthCanvasEastGovernedParentAligned = "true";
    dataset.hearthCanvasEastAfterWestReleaseOnly = "true";
    dataset.hearthCanvasEastSourceOnly = "true";

    dataset.hearthCanvasEastRequiredApiSurfaceComplete = "true";
    dataset.hearthCanvasEastBuildAtlasAvailable = "true";
    dataset.hearthCanvasEastSampleAvailable = "true";
    dataset.hearthCanvasEastReadAvailable = "true";
    dataset.hearthCanvasEastGetReceiptAvailable = "true";
    dataset.hearthCanvasEastApiReady = "true";
    dataset.hearthCanvasEastCurrent = "true";
    dataset.hearthCanvasEastEvidenceReady = String(state.f13AtlasPacketReady);

    dataset.hearthCanvasEastMayBuildAtlas = String(state.canvasEastMayBuildAtlas);
    dataset.hearthCanvasEastF13BuildLawful = String(state.f13BuildLawful);
    dataset.hearthCanvasEastF13BuildBlockedReason = state.f13BuildBlockedReason;
    dataset.hearthCanvasEastF13PermissionSource = state.f13PermissionSource;
    dataset.hearthCanvasEastWestReleaseObserved = String(state.westReleaseObserved);
    dataset.hearthCanvasEastWestCanvasReleaseApproved = String(state.westCanvasReleaseApproved);
    dataset.hearthCanvasEastCanvasReleaseAuthorized = String(state.canvasReleaseAuthorized);
    dataset.hearthCanvasEastCanvasParentObserved = String(state.canvasParentObserved);
    dataset.hearthCanvasEastCanvasParentRequestObserved = String(state.canvasParentRequestObserved);
    dataset.hearthCanvasEastCanvasParentReleaseObserved = String(state.canvasParentReleaseObserved);
    dataset.hearthCanvasEastParentCurrentContractObserved = String(state.parentCurrentContractObserved);
    dataset.hearthCanvasEastEmergencyF13Requested = String(state.emergencyF13Requested);

    dataset.hearthCanvasEastNewsProtocolSynchronized = "true";
    dataset.hearthCanvasEastNewsFinalized = "false";
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

    dataset.hearthCanvasEastF21Claimed = "false";
    dataset.hearthCanvasEastReadyTextClaimed = "false";
    dataset.hearthCanvasEastVisibleProof = "false";
    dataset.hearthCanvasEastVisibleContentProof = "false";
    dataset.hearthCanvasEastVisiblePlanetAvailable = "false";
    dataset.hearthCanvasEastCanvasReady = "false";

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";
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
    root.HEARTH.canvasEastParentAcceptedCompatibilityAtlasSource = api;
    root.HEARTH.canvasEastSource = api;

    root.HEARTH_CANVAS_EAST = api;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE = api;
    root.HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR = api;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_PARENT_ACCEPTED_COMPATIBILITY_ATLAS_SOURCE = api;
    root.HEARTH_CANVAS_EAST_SOURCE = api;

    root.DEXTER_LAB.hearthCanvasEast = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine = api;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceTransistor = api;
    root.DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild = api;
    root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastParentAcceptedCompatibilityAtlasSource = api;
    root.DEXTER_LAB.hearthCanvasEastSource = api;

    const receipt = getReceipt();

    root.HEARTH_CANVAS_EAST_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE_RECEIPT = receipt;
    root.HEARTH_CANVAS_EAST_PARENT_ACCEPTED_COMPATIBILITY_ATLAS_SOURCE_RECEIPT = receipt;

    root.HEARTH.canvasEastReceipt = receipt;
    root.HEARTH.canvasEastMaterialAtlasSourceMachineReceipt = receipt;
    root.HEARTH.canvasEastMaterialAtlasSourceTransistorReceipt = receipt;
    root.HEARTH.canvasEastF13AtlasSourceChildReceipt = receipt;
    root.HEARTH.canvasEastGovernedF13AtlasSourceReceipt = receipt;
    root.HEARTH.canvasEastCurrentParentRecognizedF13AtlasSourceReceipt = receipt;
    root.HEARTH.canvasEastParentAcceptedCompatibilityAtlasSourceReceipt = receipt;

    root.DEXTER_LAB.hearthCanvasEastReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachineReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceTransistorReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastF13AtlasSourceChildReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSourceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSourceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEastParentAcceptedCompatibilityAtlasSourceReceipt = receipt;

    root.__HEARTH_CANVAS_EAST_LOADED__ = true;
    root.__HEARTH_CANVAS_EAST_FILE__ = FILE;
    root.__HEARTH_CANVAS_EAST_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_EAST_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_EAST_INTERNAL_RENEWAL_CONTRACT__ = INTERNAL_RENEWAL_CONTRACT;
    root.__HEARTH_CANVAS_EAST_INTERNAL_RENEWAL_RECEIPT__ = INTERNAL_RENEWAL_RECEIPT;
    root.__HEARTH_CANVAS_EAST_ACTIVE_PARENT_CONTRACT__ = ACTIVE_PARENT_CONTRACT;
    root.__HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_FACING_COMPATIBILITY_CONTRACT_ACTIVE__ = true;
    root.__HEARTH_CANVAS_EAST_PARENT_COMPATIBILITY_ALIASES_PUBLISHED__ = true;
    root.__HEARTH_CANVAS_EAST_REQUIRED_API_SURFACE_COMPLETE__ = true;
    root.__HEARTH_CANVAS_EAST_API_READY__ = true;
    root.__HEARTH_CANVAS_EAST_CURRENT__ = true;
    root.__HEARTH_CANVAS_EAST_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_EAST_VISUAL_PASS_CLAIMED__ = false;

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    updateDataset();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    activeParentContract: ACTIVE_PARENT_CONTRACT,
    activeParentReceipt: ACTIVE_PARENT_RECEIPT,
    version: VERSION,
    file: FILE,
    parentFile: PARENT_FILE,

    buildAtlas,
    sample,
    read,
    getReceipt,

    normalizeCanvasEastInput,
    readGovernedParentState,
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

    requiredApiSurfaceComplete: true,
    buildAtlasAvailable: true,
    sampleAvailable: true,
    readAvailable: true,
    getReceiptAvailable: true,

    canvasEastApiReady: true,
    canvasEastCurrent: true,
    parentFacingCompatibilityContractActive: true,
    currentParentRecognized: true,
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
    ownsSampleMethod: true,
    ownsReadMethod: true,
    ownsReceiptSurface: true,

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

    get state() {
      return state;
    }
  };

  state.updatedAt = nowIso();

  syncMaterialBridge({
    updateDataset: false,
    invalidate: false
  });

  recordLocal("CANVAS_EAST_PARENT_ACCEPTED_COMPATIBILITY_ATLAS_SOURCE_PUBLISHED", {
    contract: CONTRACT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    requiredMethods: state.requiredMethods.slice(),
    activeParentContract: ACTIVE_PARENT_CONTRACT,
    parentFacingCompatibilityContractActive: true,
    currentParentRecognized: true,
    parentCompatibilityAliasesPublished: true,
    afterWestReleaseOnly: true,
    aliasSet: [
      "HEARTH_CANVAS_EAST",
      "HEARTH.canvasEast",
      "HEARTH.canvasEastMaterialAtlasSourceMachine",
      "HEARTH.canvasEastMaterialAtlasSourceTransistor",
      "HEARTH.canvasEastF13AtlasSourceChild",
      "HEARTH.canvasEastGovernedF13AtlasSource",
      "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR",
      "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE",
      "HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE",
      "DEXTER_LAB.hearthCanvasEast",
      "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine",
      "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceTransistor",
      "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild",
      "DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource"
    ],
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false
  });

  publishGlobals();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
