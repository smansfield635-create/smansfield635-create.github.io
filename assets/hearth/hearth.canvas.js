// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_TNT_v8
// Full-file replacement.
// Canvas parent / route-conductor release-packet intake / structural carrier / East v5 handoff authority.
// Purpose:
// - Accept the upstream route-conductor Canvas release packet as the primary Canvas release authority.
// - Preserve structural-carrier safety before East atlas evidence exists.
// - Preserve Canvas East v5 consumption:
//   HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_TNT_v5.
// - Treat East v5 synchronous held packets as lawful held evidence, not API failure.
// - Compose and send lawful parent release packets to East after route-conductor release is accepted.
// - Preserve East / West / South child separation.
// - Preserve F13 parent coordination while blocking F21, ready text, completion latch, and final visual-pass claims.
// - Publish explicit stale-parent-negative markers so stale parent-v2 detection cannot override current parent v8.
// Owns:
// - Canvas parent structural carrier.
// - Parent boot/init/start/mount aliases.
// - Route-conductor release-packet intake.
// - Parent release acceptance.
// - Child API recognition.
// - East / West / South child packet intake.
// - Canvas F13 evidence classification.
// - Parent release packet composition to East.
// - Atlas evidence intake from East.
// - Synchronous held-packet interpretation.
// - Canvas parent receipt and dataset publication.
// Does not own:
// - material truth
// - elevation truth
// - hydrology truth
// - East atlas source truth
// - West admissibility truth
// - South visible proof truth
// - route orchestration
// - North F21 latch
// - ready text
// - final visual pass claim
// No GraphicBox. No generated image. No WebGL. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_TNT_v8";
  const RECEIPT = "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_RECEIPT_v8";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_TNT_v7";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_RECEIPT_v7";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_TNT_v7";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_RECEIPT_v7";

  const UPSTREAM_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_TNT_v6";
  const UPSTREAM_ROUTE_CONDUCTOR_RECEIPT = "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_RECEIPT_v6";

  const EAST_REQUIRED_CONTRACT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_TNT_v5";
  const EAST_REQUIRED_RECEIPT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT_v5";

  const MATERIAL_REQUIRED_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const MATERIAL_REQUIRED_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const VERSION = "2026-06-01.hearth-canvas-parent-route-conductor-release-packet-intake-east-v5-handoff-v8";
  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";

  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";
  const ASSETS_FILE = "/assets/hearth/hearth.assets.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";

  const CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const ACTIVE_FIBONACCI = "F13P";
  const EAST_FIBONACCI = "F13E_F13F";
  const WEST_FIBONACCI = "F13W";
  const SOUTH_FIBONACCI = "F13S";
  const FUTURE_FIBONACCI = "F21";

  const EAST_RESULT_CLASS = Object.freeze({
    API_MISSING: "EAST_API_MISSING",
    HELD_SYNCHRONOUS: "EAST_HELD_SYNCHRONOUS",
    ATLAS_EVIDENCE_READY: "EAST_ATLAS_EVIDENCE_READY",
    FALSE_PROMOTION_BLOCKED: "EAST_FALSE_PROMOTION_BLOCKED",
    BUILD_ERROR: "EAST_BUILD_ERROR",
    PENDING_ASYNC: "EAST_PENDING_ASYNC",
    NOT_CALLED: "EAST_NOT_CALLED"
  });

  const CHILD_STATUS = Object.freeze({
    MISSING: "MISSING",
    API_READY: "API_READY",
    HELD: "HELD",
    EVIDENCE_READY: "EVIDENCE_READY",
    BLOCKED: "BLOCKED",
    ERROR: "ERROR"
  });

  const RELEASE_SOURCE = Object.freeze({
    ROUTE_CONDUCTOR: "ROUTE_CONDUCTOR",
    LOCAL_WEST_FALLBACK: "LOCAL_WEST_FALLBACK",
    NONE: "NONE"
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    upstreamRouteConductorRequiredContract: UPSTREAM_ROUTE_CONDUCTOR_CONTRACT,
    upstreamRouteConductorRequiredReceipt: UPSTREAM_ROUTE_CONDUCTOR_RECEIPT,
    eastRequiredContract: EAST_REQUIRED_CONTRACT,
    eastRequiredReceipt: EAST_REQUIRED_RECEIPT,
    materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
    materialRequiredReceipt: MATERIAL_REQUIRED_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "hearth-canvas-parent-route-conductor-release-packet-intake-east-v5-handoff",

    canvasParentActive: true,
    canvasParentV8Active: true,
    canvasParentV7Compatible: true,
    canvasParentV6Compatible: true,
    canvasParentV2Observed: false,
    hearthCanvasParentV2Observed: false,
    staleParentV2Retired: true,

    routeConductorReleasePacketIntakeActive: true,
    routeConductorReleasePacketPrimary: true,
    localWestReleaseFallbackActive: true,
    localWestReleaseUsed: false,
    acceptedReleaseSource: RELEASE_SOURCE.NONE,

    upstreamReleasePacketObserved: false,
    upstreamReleasePacketReady: false,
    upstreamReleaseAccepted: false,
    upstreamReleaseRejectedReason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    upstreamRouteConductorContract: "",
    upstreamRouteConductorReceipt: "",
    upstreamRouteConductorContractObserved: false,
    upstreamRouteConductorReceiptObserved: false,
    upstreamCanvasReleaseAuthorized: false,
    upstreamWestCanvasReleaseApproved: false,
    upstreamWestForwardAllowed: false,
    upstreamWestHardBlock: false,
    upstreamCarrierHostAdmissibilityReady: false,
    upstreamCarrierHostAdmissibilityPacketReady: false,
    upstreamIndexPairReady: false,
    upstreamIndexMacroWestCandidateReady: false,
    upstreamHandoffToCanvas: false,
    upstreamDestinationIsCanvas: false,
    upstreamCycleNumber: 0,
    upstreamCycleRoute: "",
    upstreamReceivedFrom: "",
    upstreamSourceFile: "",
    upstreamDestinationFile: "",
    upstreamTargetFile: "",
    upstreamFirstFailedCoordinate: "",
    upstreamRecommendedNextFile: "",
    upstreamRecommendedNextRenewalTarget: "",
    upstreamReleasePacket: null,
    upstreamReleaseObservedAt: "",

    structuralCarrierActive: true,
    structuralCarrierPublished: false,
    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,
    carrierPrecheckReady: true,
    macroWestPrecheckCarrierReady: true,
    canvasParentBootMethodAvailable: true,
    bootMethodAvailable: true,
    mountMethodAvailable: true,
    initMethodAvailable: true,
    startMethodAvailable: true,
    getStructuralCarrierAvailable: true,
    readStructuralCarrierAvailable: true,
    getCanvasCarrierAvailable: true,
    getCarrierReceiptAvailable: true,
    parentCarrierSafeIsNotMacroWestPrerequisite: true,
    parentStructuralCarrierFirstPublishedAt: "",

    eastV5SynchronousHeldPacketConsumptionActive: true,
    canvasParentChildReconciliationActive: true,
    parentReleasePacketComposerActive: true,
    parentReleasePacketSentToEast: false,
    parentReleasePacketLawful: false,
    parentWestReleaseIncluded: false,
    parentCurrentContractIncluded: true,
    parentEastBuildAtlasCalled: false,
    parentEastBuildAtlasResultClass: EAST_RESULT_CLASS.NOT_CALLED,

    cycleNumber: 2,
    cycleRoute: CYCLE_ROUTE,
    activeFibonacci: ACTIVE_FIBONACCI,
    activeFibonacciRank: "F13P",
    eastActiveFibonacci: EAST_FIBONACCI,
    westActiveFibonacci: WEST_FIBONACCI,
    southActiveFibonacci: SOUTH_FIBONACCI,
    futureFibonacci: FUTURE_FIBONACCI,
    activeStageId: "F13P_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF",
    activeGearId: "F13P_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF",
    activeNewsGate: "CANVAS",
    oneActiveGearAtATime: true,

    newsAlignmentProtocolActive: true,
    newsFinalizedByCanvasParent: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,
    indexGateReady: false,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,

    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationExpected: 10,
    fibonacciSynchronizationPassed: false,
    fibonacciSynchronizationDegraded: false,

    canvasEastObserved: false,
    canvasEastRequiredContractObserved: false,
    canvasEastApiReady: false,
    canvasEastApiMissing: true,
    canvasEastStatus: CHILD_STATUS.MISSING,
    canvasEastEvidenceReady: false,
    canvasEastHeldPacketRecognized: false,
    canvasEastHeldPacketWasSynchronous: false,
    canvasEastBuildAtlasReturnedPromise: false,
    canvasEastF13AtlasPacketReady: false,
    canvasEastAtlasBuildComplete: false,
    canvasEastAtlasCanvasPresent: false,
    canvasEastFalsePromotionBlocked: false,
    canvasEastFirstFailedCoordinate: "WAITING_CANVAS_EAST_API",
    canvasEastRecommendedNextRenewalTarget: EAST_FILE,
    canvasEastReceipt: null,
    canvasEastLastPacket: null,
    canvasEastLastHeldPacket: null,
    canvasEastLastAtlasPacket: null,
    canvasEastLastError: "",

    canvasWestObserved: false,
    canvasWestApiReady: false,
    canvasWestInspectionReady: false,
    canvasWestEvidenceReady: false,
    canvasWestStatus: CHILD_STATUS.MISSING,
    westAuditObserved: false,
    westAuditAccepted: false,
    westAuditDegraded: false,
    westHardBlock: false,
    westCanvasReleaseApproved: false,
    westForwardAllowed: false,
    westDecision: "",
    westGapClass: "",
    westFirstFailedCoordinate: "",
    canvasWestReceipt: null,

    canvasSouthObserved: false,
    canvasSouthApiReady: false,
    canvasSouthVisibleProofReady: false,
    canvasSouthSoftProofReady: false,
    canvasSouthHardFail: false,
    canvasSouthProofStale: false,
    canvasSouthStatus: CHILD_STATUS.MISSING,
    canvasSouthReceipt: null,

    materialAuthorityObserved: false,
    materialContract: "",
    materialReceipt: "",
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    materialReceiptBridgeActive: false,

    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseRequiresWestAudit: true,
    canvasReleaseRequiresMacroWest: true,
    canvasReleaseHeldReason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    canvasParentReleaseAccepted: false,
    canvasParentReleaseObserved: false,
    canvasParentRequestObserved: true,
    parentRequestLawful: true,
    parentReleaseLawful: false,
    lastReleasePacket: null,

    f13ProofBodyAvailable: false,
    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    f13StrictEvidenceRepairTarget: ROUTE_CONDUCTOR_FILE,

    parentStrictReadMismatch: false,
    parentStrictReadMismatchReason: "",
    degradedF13IsFunctional: false,
    functionalPageObserved: false,
    strictVisualProofPending: false,

    allCanvasChildrenApiReady: false,
    allCanvasChildrenEvidenceReady: false,
    allCanvasChildrenReady: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21LatchMode: "BLOCKED_BY_CANVAS_PARENT",
    completionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    f21ClaimedByCanvasParent: false,
    readyTextClaimedByCanvasParent: false,

    firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    recommendedNextFile: ROUTE_CONDUCTOR_FILE,
    recommendedNextRenewalTarget: ROUTE_CONDUCTOR_FILE,
    canvasNextAuditTarget: EAST_FILE,
    postgameStatus: "CANVAS_PARENT_STRUCTURAL_CARRIER_SAFE_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",

    receiptVisible: true,
    receiptExpanded: false,
    diagnosticExportCopyable: true,
    diagnosticPanelInstalled: false,

    lastAuditAt: "",
    lastBootAt: "",
    lastCarrierReadAt: "",
    lastReleaseAt: "",
    lastEastCallAt: "",
    publishedAt: "",
    updatedAt: "",
    localEvents: [],
    errors: [],

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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true") return true;
    if (value === false || value === 0 || value === "0" || value === "false") return false;
    return fallback;
  }

  function anyTrue(...values) {
    return values.some((value) => safeBool(value, false) === true);
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

  function objectValue(source, path, fallback = undefined) {
    if (!isObject(source)) return fallback;

    const parts = safeString(path).split(".");
    let cursor = source;

    for (const part of parts) {
      if (!cursor || !isObject(cursor) || cursor[part] === undefined || cursor[part] === null) {
        return fallback;
      }

      cursor = cursor[part];
    }

    return cursor;
  }

  function pathRead(path) {
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

    if (isFunction(authority.getCarrierReceipt)) {
      try {
        const receipt = authority.getCarrierReceipt();
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
  }

  function recordEvent(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_PARENT_EVENT"),
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
      code: safeString(code, "CANVAS_PARENT_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 120);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function hasFalsePromotion(packet = {}) {
    if (!isObject(packet)) return false;

    let text = "";
    try {
      text = JSON.stringify(packet);
    } catch (_error) {
      text = String(packet);
    }

    return Boolean(
      safeBool(packet.visibleProof, false) ||
      safeBool(packet.visibleContentProof, false) ||
      safeBool(packet.visiblePlanetAvailable, false) ||
      safeBool(packet.canvasReady, false) ||
      safeBool(packet.readyTextAllowed, false) ||
      safeBool(packet.f21EligibleForNorth, false) ||
      safeBool(packet.f21ClaimedByCanvasEast, false) ||
      safeBool(packet.f21ClaimedByCanvasParent, false) ||
      safeBool(packet.readyTextClaimedByCanvasEast, false) ||
      safeBool(packet.readyTextClaimedByCanvasParent, false) ||
      safeBool(packet.completionLatched, false) ||
      safeBool(packet.finalCompletionLatched, false) ||
      safeBool(packet.visualPassClaimed, false) ||
      text.includes('"visualPassClaimed":true') ||
      text.includes("visualPassClaimed=true") ||
      text.includes('"completionLatched":true') ||
      text.includes("completionLatched=true") ||
      text.includes('"readyTextAllowed":true') ||
      text.includes("readyTextAllowed=true")
    );
  }

  function getEastAuthority() {
    return firstGlobal([
      "HEARTH.canvasEast",
      "HEARTH.canvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
      "HEARTH.canvasEastParentFirstApiRecognitionBootstrap",
      "HEARTH.canvasEastCurrentParentRecognizedF13AtlasSource",
      "HEARTH.canvasEastGovernedF13AtlasSource",
      "HEARTH.canvasEastF13AtlasSourceChild",
      "HEARTH.canvasEastMaterialAtlasSourceMachine",
      "HEARTH_CANVAS_EAST",
      "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_PARENT_FIRST_API_RECOGNITION_BOOTSTRAP",
      "HEARTH_CANVAS_EAST_CURRENT_PARENT_RECOGNIZED_F13_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_GOVERNED_F13_ATLAS_SOURCE",
      "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE",
      "DEXTER_LAB.hearthCanvasEast",
      "DEXTER_LAB.hearthCanvasEastSynchronousHeldPacketParentFirstF13AtlasSource",
      "DEXTER_LAB.hearthCanvasEastParentFirstApiRecognitionBootstrap",
      "DEXTER_LAB.hearthCanvasEastCurrentParentRecognizedF13AtlasSource",
      "DEXTER_LAB.hearthCanvasEastGovernedF13AtlasSource",
      "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild"
    ]);
  }

  function getWestAuthority() {
    return firstGlobal([
      "HEARTH.canvasWest",
      "HEARTH_CANVAS_WEST",
      "HEARTH.canvasWestReceipt",
      "HEARTH_CANVAS_WEST_RECEIPT",
      "HEARTH.westCycleAwareAdmissibilityClutch",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "DEXTER_LAB.hearthCanvasWest",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.cycleAwareAdmissibilityClutchWest"
    ]);
  }

  function getSouthAuthority() {
    return firstGlobal([
      "HEARTH.canvasSouth",
      "HEARTH_CANVAS_SOUTH",
      "HEARTH.canvasSouthReceipt",
      "HEARTH_CANVAS_SOUTH_RECEIPT",
      "HEARTH.visibleStateComposer",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
      "LAB_VISIBLE_STATE_COMPOSER_SOUTH",
      "DEXTER_LAB.hearthCanvasSouth",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.visibleStateComposer",
      "DEXTER_LAB.southPrimaryGate"
    ]);
  }

  function getMaterialAuthority() {
    return firstGlobal([
      "HEARTH.materials",
      "HEARTH.materialAuthority",
      "HEARTH.materialsAuthority",
      "HEARTH.surfaceMaterials",
      "HEARTH.assets",
      "HEARTH.assetsAuthority",
      "HEARTH_MATERIALS",
      "HEARTH_MATERIAL_AUTHORITY",
      "HEARTH_MATERIALS_AUTHORITY",
      "HEARTH_SURFACE_MATERIALS",
      "HEARTH_ASSETS",
      "HEARTH_ASSETS_AUTHORITY",
      "HearthMaterials",
      "HearthMaterialAuthority",
      "HearthAssets",
      "DEXTER_LAB.hearthMaterials",
      "DEXTER_LAB.hearthMaterialAuthority",
      "DEXTER_LAB.hearthAssets"
    ]);
  }

  function getRouteConductorAuthority() {
    return firstGlobal([
      "HEARTH.routeConductorTwoFileNewsFibonacciCarrierHostConsumer",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "DEXTER_LAB.hearthRouteConductorTwoFileNewsFibonacciCarrierHostConsumer",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthSouthRouteConductor"
    ]);
  }

  function hasRequiredEastMethods(authority) {
    return Boolean(
      authority &&
      isFunction(authority.buildAtlas) &&
      isFunction(authority.sample) &&
      isFunction(authority.read) &&
      isFunction(authority.getReceipt)
    );
  }

  function extractRouteReleasePacket(options = {}) {
    if (!isObject(options)) return null;

    const candidates = [
      options.releasePacket,
      options.routeReleasePacket,
      options.canvasReleasePacket,
      options.preAuthorizedRelease,
      objectValue(options, "detail.releasePacket"),
      objectValue(options, "detail.canvasReleasePacket"),
      objectValue(options, "detail.routeReleasePacket"),
      objectValue(options, "raw.releasePacket"),
      objectValue(options, "raw.canvasReleasePacket")
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return candidate;
    }

    if (
      options.packetType === "CANVAS_RELEASE_PACKET" ||
      options.canvasReleaseAuthorized !== undefined ||
      options.westCanvasReleaseApproved !== undefined ||
      options.handoffTo === "CANVAS" ||
      options.destinationFile === FILE
    ) {
      return options;
    }

    return null;
  }

  function readGlobalRouteConductorPacket() {
    const authority = getRouteConductorAuthority();
    const receipt = readReceipt(authority);

    if (isObject(receipt) && (
      receipt.canvasReleaseAuthorized !== undefined ||
      receipt.westCanvasReleaseApproved !== undefined ||
      receipt.canvasReleasePacket ||
      receipt.macroWestAdmissibility
    )) {
      return isObject(receipt.canvasReleasePacket) ? receipt.canvasReleasePacket : receipt;
    }

    const explicitReceipt = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_TWO_FILE_NEWS_FIBONACCI_CARRIER_HOST_CONSUMER_RECEIPT",
      "HEARTH_ROUTE_CONDUCTOR_RECEIPT",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR_RECEIPT",
      "HEARTH.routeConductorTwoFileNewsFibonacciCarrierHostConsumerReceipt",
      "HEARTH.routeConductorReceipt",
      "DEXTER_LAB.hearthRouteConductorTwoFileNewsFibonacciCarrierHostConsumerReceipt",
      "DEXTER_LAB.hearthRouteConductorReceipt"
    ]);

    if (isObject(explicitReceipt) && (
      explicitReceipt.canvasReleaseAuthorized !== undefined ||
      explicitReceipt.westCanvasReleaseApproved !== undefined ||
      explicitReceipt.canvasReleasePacket ||
      explicitReceipt.macroWestAdmissibility
    )) {
      return isObject(explicitReceipt.canvasReleasePacket) ? explicitReceipt.canvasReleasePacket : explicitReceipt;
    }

    const datasetPacket = {
      contract: datasetValue("hearthRouteConductorContract", ""),
      receipt: datasetValue("hearthRouteConductorReceipt", ""),
      sourceFile: ROUTE_CONDUCTOR_FILE,
      destinationFile: FILE,
      targetFile: FILE,
      handoffTo: datasetValue("hearthSouthHandoffTo", "") || datasetValue("hearthRouteConductorHandoffTo", ""),
      cycleNumber: safeNumber(datasetValue("hearthSouthActiveCycleNumber", 0), 0),
      cycleRoute: datasetValue("hearthSouthActiveCycleRoute", ""),
      canvasReleaseAuthorized: anyTrue(
        datasetValue("hearthRouteConductorCanvasReleaseAuthorized", ""),
        datasetValue("hearthSouthCanvasReleaseAuthorized", "")
      ),
      westCanvasReleaseApproved: anyTrue(
        datasetValue("hearthSouthWestCanvasReleaseApproved", ""),
        datasetValue("hearthRouteConductorWestCanvasReleaseApproved", "")
      ),
      westForwardAllowed: anyTrue(
        datasetValue("hearthSouthWestForwardAllowed", ""),
        datasetValue("hearthRouteConductorWestForwardAllowed", "")
      ),
      westHardBlock: anyTrue(
        datasetValue("hearthSouthWestHardBlock", ""),
        datasetValue("hearthRouteConductorWestHardBlock", "")
      ),
      carrierHostAdmissibilityReady: anyTrue(
        datasetValue("hearthSouthCarrierHostAdmissibilityReady", ""),
        datasetValue("hearthCarrierHostAdmissibilityReady", "")
      ),
      carrierHostAdmissibilityPacketReady: anyTrue(
        datasetValue("hearthSouthCarrierHostAdmissibilityPacketReady", ""),
        datasetValue("hearthCarrierHostAdmissibilityPacketReady", "")
      ),
      indexPairReady: anyTrue(
        datasetValue("hearthSouthIndexPairReady", ""),
        datasetValue("hearthIndexPairReady", "")
      ),
      indexMacroWestCandidateReady: anyTrue(
        datasetValue("hearthSouthIndexMacroWestCandidateReady", ""),
        datasetValue("hearthIndexMacroWestCandidateReady", "")
      ),
      firstFailedCoordinate: datasetValue("hearthSouthFirstFailedCoordinate", ""),
      recommendedNextFile: datasetValue("hearthSouthRecommendedNextFile", ""),
      recommendedNextRenewalTarget: datasetValue("hearthSouthRecommendedNextRenewalTarget", "")
    };

    const hasDatasetSignal = Boolean(
      datasetPacket.canvasReleaseAuthorized ||
      datasetPacket.westCanvasReleaseApproved ||
      datasetPacket.carrierHostAdmissibilityReady ||
      datasetPacket.indexPairReady ||
      datasetPacket.contract
    );

    return hasDatasetSignal ? datasetPacket : null;
  }

  function isCanvasDestination(packet = {}) {
    const handoffTo = firstString(packet.handoffTo, packet.destination, packet.target, packet.destinationCardinal, packet.targetCardinal).toUpperCase();
    const destinationFile = firstString(packet.destinationFile, packet.targetFile, packet.file);
    const packetType = firstString(packet.packetType);

    return Boolean(
      handoffTo.includes("CANVAS") ||
      destinationFile === FILE ||
      destinationFile === "/assets/hearth/hearth.canvas.js" ||
      packetType === "CANVAS_RELEASE_PACKET" ||
      safeBool(packet.canvasReleaseReceived, false)
    );
  }

  function consumeRouteReleasePacket(packet = {}, source = "explicit") {
    const release = isObject(packet) ? packet : null;

    if (!release) {
      return {
        observed: false,
        accepted: false,
        reason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET"
      };
    }

    const contract = firstString(
      release.contract,
      release.sourceContract,
      release.routeConductorContract,
      objectValue(release, "macroWestAdmissibility.contract")
    );

    const receipt = firstString(
      release.receipt,
      release.sourceReceipt,
      release.routeConductorReceipt
    );

    const canvasReleaseAuthorized = anyTrue(
      release.canvasReleaseAuthorized,
      release.canvasReleaseApproved,
      release.canvasReleaseReceived,
      release.releaseToCanvas
    );

    const westCanvasReleaseApproved = anyTrue(
      release.westCanvasReleaseApproved,
      release.westAuditAccepted,
      release.westAuditApproved,
      release.westAuditPassed,
      release.westForwardAllowed,
      release.forwardAllowed,
      objectValue(release, "macroWestAdmissibility.westCanvasReleaseApproved"),
      objectValue(release, "macroWestAdmissibility.westForwardAllowed")
    );

    const westForwardAllowed = anyTrue(
      release.westForwardAllowed,
      release.forwardAllowed,
      objectValue(release, "macroWestAdmissibility.westForwardAllowed")
    );

    const westHardBlock = anyTrue(
      release.westHardBlock,
      release.westAuditBlocked,
      release.hardBlock,
      objectValue(release, "macroWestAdmissibility.westHardBlock")
    );

    const carrierHostAdmissibilityReady = anyTrue(
      release.carrierHostAdmissibilityReady,
      release.carrierHostAdmissible,
      objectValue(release, "proofBody.carrierHostAdmissibilityProof.ready")
    );

    const carrierHostAdmissibilityPacketReady = anyTrue(
      release.carrierHostAdmissibilityPacketReady,
      release.carrierHostAdmissibilityPacketPublished,
      release.routeConductorHandoffPacketReady
    );

    const indexPairReady = anyTrue(
      release.indexPairReady,
      objectValue(release, "proofBody.indexPairProof.ready")
    );

    const indexMacroWestCandidateReady = anyTrue(
      release.indexMacroWestCandidateReady,
      release.indexHandoffToRouteConductor
    );

    const destinationIsCanvas = isCanvasDestination(release);
    const handoffToCanvas = firstString(release.handoffTo, release.destination, release.target).toUpperCase().includes("CANVAS");

    const accepted = Boolean(
      canvasReleaseAuthorized &&
      westCanvasReleaseApproved &&
      !westHardBlock &&
      carrierHostAdmissibilityReady &&
      indexPairReady &&
      destinationIsCanvas
    );

    const rejectedReason = accepted
      ? "NONE_ROUTE_CONDUCTOR_RELEASE_ACCEPTED"
      : !canvasReleaseAuthorized
        ? "WAITING_UPSTREAM_CANVAS_RELEASE_AUTHORIZATION"
        : !westCanvasReleaseApproved
          ? "WAITING_UPSTREAM_WEST_CANVAS_RELEASE_APPROVAL"
          : westHardBlock
            ? "UPSTREAM_WEST_HARD_BLOCK"
            : !carrierHostAdmissibilityReady
              ? "WAITING_UPSTREAM_CARRIER_HOST_ADMISSIBILITY"
              : !indexPairReady
                ? "WAITING_UPSTREAM_INDEX_PAIR_READY"
                : !destinationIsCanvas
                  ? "WAITING_UPSTREAM_HANDOFF_TO_CANVAS"
                  : "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";

    state.upstreamReleasePacketObserved = true;
    state.upstreamReleasePacketReady = Boolean(canvasReleaseAuthorized || westCanvasReleaseApproved || destinationIsCanvas);
    state.upstreamReleaseAccepted = accepted;
    state.upstreamReleaseRejectedReason = rejectedReason;

    state.upstreamRouteConductorContract = contract;
    state.upstreamRouteConductorReceipt = receipt;
    state.upstreamRouteConductorContractObserved = Boolean(contract);
    state.upstreamRouteConductorReceiptObserved = Boolean(receipt);
    state.upstreamCanvasReleaseAuthorized = canvasReleaseAuthorized;
    state.upstreamWestCanvasReleaseApproved = westCanvasReleaseApproved;
    state.upstreamWestForwardAllowed = westForwardAllowed;
    state.upstreamWestHardBlock = westHardBlock;
    state.upstreamCarrierHostAdmissibilityReady = carrierHostAdmissibilityReady;
    state.upstreamCarrierHostAdmissibilityPacketReady = carrierHostAdmissibilityPacketReady;
    state.upstreamIndexPairReady = indexPairReady;
    state.upstreamIndexMacroWestCandidateReady = indexMacroWestCandidateReady;
    state.upstreamHandoffToCanvas = handoffToCanvas || destinationIsCanvas;
    state.upstreamDestinationIsCanvas = destinationIsCanvas;
    state.upstreamCycleNumber = safeNumber(firstDefined(release.cycleNumber, release.activeCycleNumber), 0);
    state.upstreamCycleRoute = firstString(release.cycleRoute, release.activeCycleRoute);
    state.upstreamReceivedFrom = firstString(release.receivedFrom, release.sourceCardinal, release.source);
    state.upstreamSourceFile = firstString(release.sourceFile);
    state.upstreamDestinationFile = firstString(release.destinationFile);
    state.upstreamTargetFile = firstString(release.targetFile);
    state.upstreamFirstFailedCoordinate = firstString(release.firstFailedCoordinate);
    state.upstreamRecommendedNextFile = firstString(release.recommendedNextFile);
    state.upstreamRecommendedNextRenewalTarget = firstString(release.recommendedNextRenewalTarget);
    state.upstreamReleasePacket = clonePlain(release);
    state.upstreamReleaseObservedAt = nowIso();

    recordEvent("CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_CONSUMED", {
      source,
      accepted,
      rejectedReason,
      contract,
      receipt,
      canvasReleaseAuthorized,
      westCanvasReleaseApproved,
      westHardBlock,
      carrierHostAdmissibilityReady,
      indexPairReady,
      destinationIsCanvas,
      visualPassClaimed: false
    });

    updateDataset();

    return {
      observed: true,
      accepted,
      reason: rejectedReason,
      packet: clonePlain(release)
    };
  }

  function consumeReleaseFromOptions(options = {}, source = "options") {
    const packet = extractRouteReleasePacket(options);
    if (packet) return consumeRouteReleasePacket(packet, source);

    const globalPacket = readGlobalRouteConductorPacket();
    if (globalPacket) return consumeRouteReleasePacket(globalPacket, "global-route-conductor");

    return {
      observed: false,
      accepted: false,
      reason: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET"
    };
  }

  function resolveAcceptedRelease() {
    const routeAccepted = Boolean(state.upstreamReleaseAccepted);
    const localWestAccepted = Boolean(state.westCanvasReleaseApproved && !state.westHardBlock);

    if (routeAccepted) {
      state.acceptedReleaseSource = RELEASE_SOURCE.ROUTE_CONDUCTOR;
      state.localWestReleaseUsed = false;
      return {
        accepted: true,
        source: RELEASE_SOURCE.ROUTE_CONDUCTOR,
        heldReason: "NONE_CANVAS_RELEASE_AUTHORIZED_BY_ROUTE_CONDUCTOR"
      };
    }

    if (localWestAccepted) {
      state.acceptedReleaseSource = RELEASE_SOURCE.LOCAL_WEST_FALLBACK;
      state.localWestReleaseUsed = true;
      return {
        accepted: true,
        source: RELEASE_SOURCE.LOCAL_WEST_FALLBACK,
        heldReason: "NONE_CANVAS_RELEASE_AUTHORIZED_BY_LOCAL_WEST_FALLBACK"
      };
    }

    state.acceptedReleaseSource = RELEASE_SOURCE.NONE;
    state.localWestReleaseUsed = false;

    return {
      accepted: false,
      source: RELEASE_SOURCE.NONE,
      heldReason: state.upstreamReleasePacketObserved
        ? state.upstreamReleaseRejectedReason || "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET"
        : "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET"
    };
  }

  function scanMaterialAuthority() {
    const authority = getMaterialAuthority();
    const receipt = readReceipt(authority) || {};

    state.materialAuthorityObserved = Boolean(authority || receipt.contract);
    state.materialContract = firstString(receipt.contract, authority && authority.contract);
    state.materialReceipt = firstString(receipt.receipt, authority && authority.receipt);
    state.materialContractMatchesExpected = state.materialContract === MATERIAL_REQUIRED_CONTRACT;
    state.materialReceiptMatchesExpected = state.materialReceipt === MATERIAL_REQUIRED_RECEIPT;
    state.materialReceiptBridgeActive = Boolean(state.materialAuthorityObserved && state.materialContract);

    return {
      authority,
      receipt,
      observed: state.materialAuthorityObserved,
      contract: state.materialContract,
      receiptId: state.materialReceipt,
      contractMatchesExpected: state.materialContractMatchesExpected,
      receiptMatchesExpected: state.materialReceiptMatchesExpected
    };
  }

  function scanEastAuthority() {
    const east = getEastAuthority();
    const receipt = readReceipt(east) || {};

    const apiReady = Boolean(
      east &&
      (
        hasRequiredEastMethods(east) ||
        safeBool(east.canvasEastApiReady, false) ||
        safeBool(receipt.canvasEastApiReady, false) ||
        safeBool(receipt.requiredApiSurfaceComplete, false)
      )
    );

    const requiredContractObserved = Boolean(
      firstString(east && east.contract, receipt.contract) === EAST_REQUIRED_CONTRACT ||
      firstString(east && east.receipt, receipt.receipt) === EAST_REQUIRED_RECEIPT ||
      safeBool(receipt.synchronousHeldPacketActive, false) ||
      safeBool(east && east.synchronousHeldPacketActive, false)
    );

    state.canvasEastObserved = Boolean(east || receipt.contract);
    state.canvasEastRequiredContractObserved = requiredContractObserved;
    state.canvasEastApiReady = apiReady;
    state.canvasEastApiMissing = !apiReady;
    state.canvasEastReceipt = clonePlain(receipt || null);

    if (!apiReady) {
      state.canvasEastStatus = CHILD_STATUS.MISSING;
      state.canvasEastEvidenceReady = false;
      state.canvasEastFirstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.canvasEastRecommendedNextRenewalTarget = EAST_FILE;
    } else if (!state.canvasEastEvidenceReady && !state.canvasEastHeldPacketRecognized) {
      state.canvasEastStatus = CHILD_STATUS.API_READY;
      state.canvasEastFirstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.canvasEastRecommendedNextRenewalTarget = FILE;
    }

    return { authority: east, receipt, apiReady, requiredContractObserved };
  }

  function scanWestAuthority() {
    const west = getWestAuthority();
    const receipt = readReceipt(west) || {};

    const apiReady = Boolean(west || receipt.contract);

    const decision = firstString(
      receipt.decision,
      receipt.westDecision,
      receipt.auditDecision,
      datasetValue("westDecision", ""),
      datasetValue("hearthCanvasWestDecision", ""),
      state.upstreamWestCanvasReleaseApproved ? "RELEASE_TO_CANVAS" : ""
    );

    const gapClass = firstString(
      receipt.gapClass,
      receipt.westGapClass,
      datasetValue("westGapClass", ""),
      datasetValue("hearthCanvasWestGapClass", ""),
      state.upstreamWestCanvasReleaseApproved ? "NONE" : ""
    );

    const hardBlock = anyTrue(
      receipt.hardBlock,
      receipt.westHardBlock,
      receipt.westAuditBlocked,
      datasetValue("westHardBlock", ""),
      datasetValue("hearthCanvasWestAuditBlocked", ""),
      state.upstreamWestHardBlock
    );

    const auditObserved = anyTrue(
      apiReady,
      receipt.westAuditObserved,
      receipt.macroWestAuthorityObserved,
      receipt.macroWestAdmissibilityObserved,
      receipt.gapAssessed,
      receipt.westReviewRecommended,
      datasetValue("macroWestAuthorityObserved", ""),
      datasetValue("macroWestAdmissibilityObserved", ""),
      datasetValue("hearthCanvasWestAuditObserved", ""),
      state.upstreamWestCanvasReleaseApproved
    );

    const auditAccepted = anyTrue(
      receipt.westAuditAccepted,
      receipt.westAuditPassed,
      receipt.forwardAllowed,
      receipt.westForwardAllowed,
      receipt.decision === "RELEASE_TO_CANVAS",
      decision === "RELEASE_TO_CANVAS",
      decision === "FULL_PASS",
      gapClass === "NONE",
      receipt.westGapClass === "NONE",
      datasetValue("westForwardAllowed", ""),
      datasetValue("westCanvasReleaseApproved", ""),
      datasetValue("hearthCanvasWestReleaseApproved", ""),
      state.upstreamWestCanvasReleaseApproved
    );

    const auditDegraded = anyTrue(
      receipt.westAuditDegraded,
      receipt.canDegradeForward,
      receipt.westDegradedForwardApproved,
      decision === "DEGRADED_FORWARD",
      datasetValue("westDegradedForwardApproved", ""),
      datasetValue("hearthCanvasWestAuditDegraded", "")
    );

    const releaseApproved = anyTrue(
      receipt.westCanvasReleaseApproved,
      receipt.canvasReleaseApprovedByWest,
      receipt.canvasReleaseAuthorized,
      receipt.releaseToCanvas,
      receipt.handoffTo === "CANVAS",
      receipt.destination === "CANVAS",
      auditAccepted,
      datasetValue("westCanvasReleaseApproved", ""),
      datasetValue("canvasReleaseAuthorized", ""),
      datasetValue("hearthCanvasReleaseAuthorized", ""),
      state.upstreamWestCanvasReleaseApproved
    );

    state.canvasWestObserved = Boolean(west || receipt.contract || state.upstreamWestCanvasReleaseApproved);
    state.canvasWestApiReady = Boolean(apiReady || state.upstreamWestCanvasReleaseApproved);
    state.westAuditObserved = auditObserved;
    state.westAuditAccepted = Boolean(auditAccepted && !hardBlock);
    state.westAuditDegraded = Boolean(auditDegraded && !hardBlock);
    state.westHardBlock = hardBlock;
    state.westCanvasReleaseApproved = Boolean(releaseApproved && !hardBlock);
    state.westForwardAllowed = Boolean(anyTrue(receipt.forwardAllowed, receipt.westForwardAllowed, state.upstreamWestForwardAllowed, state.upstreamWestCanvasReleaseApproved) && !hardBlock);
    state.westDecision = decision;
    state.westGapClass = gapClass;
    state.westFirstFailedCoordinate = firstString(
      receipt.firstFailedCoordinate,
      receipt.westFirstFailedCoordinate,
      datasetValue("westFirstFailedCoordinate", ""),
      state.upstreamFirstFailedCoordinate
    );
    state.canvasWestInspectionReady = Boolean(state.westAuditAccepted || state.westAuditDegraded || state.westCanvasReleaseApproved);
    state.canvasWestEvidenceReady = state.canvasWestInspectionReady;
    state.canvasWestStatus = state.canvasWestInspectionReady
      ? CHILD_STATUS.EVIDENCE_READY
      : state.canvasWestApiReady
        ? CHILD_STATUS.API_READY
        : CHILD_STATUS.MISSING;
    state.canvasWestReceipt = clonePlain(receipt || null);

    return { authority: west, receipt, apiReady: state.canvasWestApiReady, releaseApproved: state.westCanvasReleaseApproved };
  }

  function scanSouthAuthority() {
    const south = getSouthAuthority();
    const receipt = readReceipt(south) || {};

    const apiReady = Boolean(south || receipt.contract);

    const strictProof = anyTrue(
      receipt.visibleContentProof,
      receipt.visibleContentStrictProof,
      receipt.southStrictProofObserved,
      receipt.southVisibleProofReady,
      receipt.visibleProofReady,
      datasetValue("southStrictProofObserved", ""),
      datasetValue("canvasSouthVisibleProofReady", ""),
      datasetValue("hearthCanvasSouthVisibleProofReady", "")
    );

    const softProof = anyTrue(
      receipt.visibleContentSoftGap,
      receipt.visibleForwardProgress,
      receipt.southSoftProofObserved,
      receipt.southSoftProofReady,
      receipt.degradedVisibleContentAccepted,
      datasetValue("southSoftProofObserved", ""),
      datasetValue("hearthCanvasSouthSoftProofReady", "")
    );

    const hardFail = anyTrue(
      receipt.visibleContentHardFail,
      receipt.southHardFailObserved,
      receipt.f13HardFail,
      datasetValue("southHardFailObserved", ""),
      datasetValue("hearthCanvasSouthHardFail", "")
    );

    const stale = anyTrue(
      receipt.southProofStale,
      receipt.proofStale,
      datasetValue("southProofStale", ""),
      datasetValue("hearthCanvasSouthProofStale", "")
    );

    state.canvasSouthObserved = Boolean(south || receipt.contract);
    state.canvasSouthApiReady = apiReady;
    state.canvasSouthVisibleProofReady = Boolean(strictProof && !hardFail && !stale);
    state.canvasSouthSoftProofReady = Boolean(softProof && !hardFail && !stale);
    state.canvasSouthHardFail = hardFail;
    state.canvasSouthProofStale = stale;
    state.canvasSouthStatus = hardFail
      ? CHILD_STATUS.BLOCKED
      : state.canvasSouthVisibleProofReady || state.canvasSouthSoftProofReady
        ? CHILD_STATUS.EVIDENCE_READY
        : apiReady
          ? CHILD_STATUS.API_READY
          : CHILD_STATUS.MISSING;
    state.canvasSouthReceipt = clonePlain(receipt || null);

    return { authority: south, receipt, apiReady };
  }

  function composeStructuralCarrier(input = {}) {
    const accepted = resolveAcceptedRelease();

    state.structuralCarrierActive = true;
    state.structuralCarrierReady = true;
    state.structuralCarrierSafe = true;
    state.canvasParentCarrierSafe = true;
    state.carrierPrecheckReady = true;
    state.macroWestPrecheckCarrierReady = true;
    state.parentCarrierSafeIsNotMacroWestPrerequisite = true;
    state.canvasParentV2Observed = false;
    state.hearthCanvasParentV2Observed = false;
    state.staleParentV2Retired = true;
    state.lastCarrierReadAt = nowIso();

    if (!state.parentStructuralCarrierFirstPublishedAt) {
      state.parentStructuralCarrierFirstPublishedAt = state.lastCarrierReadAt;
    }

    state.canvasParentReleaseAccepted = accepted.accepted;
    state.canvasParentReleaseObserved = accepted.accepted;
    state.parentReleaseLawful = accepted.accepted;
    state.canvasReleaseAuthorized = accepted.accepted;
    state.canvasReleaseHeldReason = accepted.heldReason;

    const carrier = {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      upstreamRouteConductorRequiredContract: UPSTREAM_ROUTE_CONDUCTOR_CONTRACT,
      file: FILE,
      route: ROUTE,
      role: "hearth-canvas-parent-structural-carrier-route-release-intake",

      structuralCarrierActive: true,
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,
      carrierPrecheckReady: true,
      macroWestPrecheckCarrierReady: true,
      parentCarrierSafeIsNotMacroWestPrerequisite: true,

      canvasParentActive: true,
      canvasParentV8Active: true,
      canvasParentV7Compatible: true,
      canvasParentV6Compatible: true,
      canvasParentV2Observed: false,
      hearthCanvasParentV2Observed: false,
      staleParentV2Retired: true,

      bootMethodAvailable: true,
      canvasParentBootMethodAvailable: true,
      mountMethodAvailable: true,
      initMethodAvailable: true,
      startMethodAvailable: true,
      getStructuralCarrierAvailable: true,
      readStructuralCarrierAvailable: true,
      getCanvasCarrierAvailable: true,
      getCarrierReceiptAvailable: true,

      routeConductorReleasePacketIntakeActive: true,
      routeConductorReleasePacketPrimary: true,
      upstreamReleasePacketObserved: state.upstreamReleasePacketObserved,
      upstreamReleaseAccepted: state.upstreamReleaseAccepted,
      upstreamReleaseRejectedReason: state.upstreamReleaseRejectedReason,
      upstreamRouteConductorContract: state.upstreamRouteConductorContract,
      upstreamRouteConductorReceipt: state.upstreamRouteConductorReceipt,
      upstreamCanvasReleaseAuthorized: state.upstreamCanvasReleaseAuthorized,
      upstreamWestCanvasReleaseApproved: state.upstreamWestCanvasReleaseApproved,
      upstreamCarrierHostAdmissibilityReady: state.upstreamCarrierHostAdmissibilityReady,
      upstreamIndexPairReady: state.upstreamIndexPairReady,
      acceptedReleaseSource: accepted.source,

      cycleNumber: 2,
      cycleRoute: CYCLE_ROUTE,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeFibonacciRank: "F13P",
      activeStageId: "F13P_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE",
      activeGearId: "F13P_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE",
      activeNewsGate: "CANVAS",
      futureFibonacci: FUTURE_FIBONACCI,

      canvasParentRequestObserved: true,
      parentRequestLawful: true,
      canvasParentReleaseObserved: accepted.accepted,
      canvasParentReleaseAccepted: accepted.accepted,
      parentReleaseLawful: accepted.accepted,
      canvasReleaseAuthorized: accepted.accepted,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseRequiresWestAudit: true,
      canvasReleaseRequiresMacroWest: true,
      canvasReleaseHeldReason: accepted.heldReason,

      canvasEastApiReady: state.canvasEastApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastStatus: state.canvasEastStatus,

      canvasWestApiReady: state.canvasWestApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      westAuditObserved: state.westAuditObserved,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      westHardBlock: state.westHardBlock,

      canvasSouthApiReady: state.canvasSouthApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      canvasSouthSoftProofReady: state.canvasSouthSoftProofReady,
      canvasSouthHardFail: state.canvasSouthHardFail,

      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      completionLatched: false,
      readyTextAllowed: false,
      f21ClaimedByCanvasParent: false,
      readyTextClaimedByCanvasParent: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      input: clonePlain(input),
      createdAt: state.lastCarrierReadAt
    };

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = carrier;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER = carrier;
    root.HEARTH_CANVAS_CARRIER_RECEIPT = carrier;

    if (root.HEARTH) {
      root.HEARTH.canvasStructuralCarrier = carrier;
      root.HEARTH.canvasParentStructuralCarrier = carrier;
      root.HEARTH.canvasCarrierReceipt = carrier;
    }

    if (root.DEXTER_LAB) {
      root.DEXTER_LAB.hearthCanvasStructuralCarrier = carrier;
      root.DEXTER_LAB.hearthCanvasParentStructuralCarrier = carrier;
      root.DEXTER_LAB.hearthCanvasCarrierReceipt = carrier;
    }

    updateDataset();
    return carrier;
  }

  function getStructuralCarrier(input = {}) {
    return composeStructuralCarrier(input);
  }

  function readStructuralCarrier(input = {}) {
    return composeStructuralCarrier(input);
  }

  function getCanvasCarrier(input = {}) {
    return composeStructuralCarrier(input);
  }

  function getCarrierReceipt(input = {}) {
    return composeStructuralCarrier(input);
  }

  function composeParentReleasePacket(input = {}) {
    const accepted = resolveAcceptedRelease();
    const releaseAccepted = accepted.accepted;

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      activeParentContract: CONTRACT,
      activeParentReceipt: RECEIPT,
      previousParentContract: PREVIOUS_CONTRACT,
      baselineParentContract: BASELINE_CONTRACT,

      upstreamRouteConductorContract: state.upstreamRouteConductorContract || UPSTREAM_ROUTE_CONDUCTOR_CONTRACT,
      upstreamRouteConductorReceipt: state.upstreamRouteConductorReceipt || UPSTREAM_ROUTE_CONDUCTOR_RECEIPT,
      upstreamReleasePacketObserved: state.upstreamReleasePacketObserved,
      upstreamReleaseAccepted: state.upstreamReleaseAccepted,
      upstreamCanvasReleaseAuthorized: state.upstreamCanvasReleaseAuthorized,
      upstreamWestCanvasReleaseApproved: state.upstreamWestCanvasReleaseApproved,
      upstreamCarrierHostAdmissibilityReady: state.upstreamCarrierHostAdmissibilityReady,
      upstreamCarrierHostAdmissibilityPacketReady: state.upstreamCarrierHostAdmissibilityPacketReady,
      upstreamIndexPairReady: state.upstreamIndexPairReady,
      upstreamIndexMacroWestCandidateReady: state.upstreamIndexMacroWestCandidateReady,
      upstreamHandoffToCanvas: state.upstreamHandoffToCanvas,
      acceptedReleaseSource: accepted.source,

      file: FILE,
      parentFile: FILE,
      sourceFile: FILE,
      destinationFile: FILE,
      targetFile: EAST_FILE,
      requestedChild: "east",
      handoffTo: "EAST",
      returnTo: "CANVAS",
      receivedFrom: "CANVAS_PARENT",

      structuralCarrierActive: true,
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,
      carrierPrecheckReady: true,
      macroWestPrecheckCarrierReady: true,
      parentCarrierSafeIsNotMacroWestPrerequisite: true,
      bootMethodAvailable: true,
      canvasParentBootMethodAvailable: true,
      canvasParentV8Active: true,
      canvasParentV7Compatible: true,
      canvasParentV2Observed: false,
      hearthCanvasParentV2Observed: false,

      activeCycleNumber: 2,
      cycleNumber: 2,
      activeCycleRoute: CYCLE_ROUTE,
      cycleRoute: CYCLE_ROUTE,
      activeCardinal: "EAST",
      activeFibonacci: ACTIVE_FIBONACCI,
      activeFibonacciRank: "F13P",
      activeNewsGate: "CANVAS",
      eastActiveFibonacci: EAST_FIBONACCI,

      canvasParentObserved: true,
      canvasParentRequestObserved: true,
      canvasParentReleaseObserved: releaseAccepted,
      canvasParentReleaseAccepted: releaseAccepted,
      parentRequestLawful: true,
      parentReleaseLawful: releaseAccepted,
      currentParentRecognized: true,
      parentCurrentContractIncluded: true,
      parentReleasePacketLawful: releaseAccepted,

      westReleaseObserved: Boolean(state.upstreamWestCanvasReleaseApproved || state.westCanvasReleaseApproved),
      westAuditObserved: Boolean(state.westAuditObserved || state.upstreamWestCanvasReleaseApproved),
      westAuditAccepted: Boolean((state.westAuditAccepted || state.upstreamWestCanvasReleaseApproved) && !state.westHardBlock),
      westAuditPassed: Boolean((state.westAuditAccepted || state.upstreamWestCanvasReleaseApproved) && !state.westAuditDegraded && !state.westHardBlock),
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: Boolean(state.westHardBlock || state.upstreamWestHardBlock),
      westCanvasReleaseApproved: Boolean(state.upstreamWestCanvasReleaseApproved || state.westCanvasReleaseApproved),
      canvasReleaseApprovedByWest: Boolean(state.upstreamWestCanvasReleaseApproved || state.westCanvasReleaseApproved),
      canvasReleaseAuthorized: releaseAccepted,
      releaseToCanvas: releaseAccepted,

      atlasBuildRequested: releaseAccepted,
      f13AtlasBuildRequested: releaseAccepted,
      buildAtlasRequested: releaseAccepted,
      async: true,
      nonBlocking: true,
      rowsPerChunk: 8,

      visibleProof: false,
      visibleContentProof: false,
      visiblePlanetAvailable: false,
      canvasReady: false,
      f21EligibleForNorth: false,
      f21ClaimedByCanvasParent: false,
      readyTextClaimedByCanvasParent: false,
      completionLatched: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,

      detail: clonePlain(input),
      upstreamReleasePacket: clonePlain(state.upstreamReleasePacket),
      createdAt: nowIso()
    };

    state.lastReleasePacket = clonePlain(packet);
    state.parentReleasePacketSentToEast = true;
    state.parentWestReleaseIncluded = Boolean(state.upstreamWestCanvasReleaseApproved || state.westCanvasReleaseApproved);
    state.parentCurrentContractIncluded = true;
    state.parentReleasePacketLawful = releaseAccepted;
    state.canvasReleaseAuthorized = releaseAccepted;
    state.canvasParentReleaseAccepted = releaseAccepted;
    state.canvasParentReleaseObserved = releaseAccepted;
    state.parentReleaseLawful = releaseAccepted;
    state.canvasReleasePacketReady = true;
    state.canvasReleaseHeldReason = releaseAccepted ? accepted.heldReason : accepted.heldReason;
    state.lastReleaseAt = packet.createdAt;

    return packet;
  }

  function classifyEastPacket(packet = {}) {
    if (!isObject(packet)) {
      return {
        resultClass: EAST_RESULT_CLASS.BUILD_ERROR,
        status: CHILD_STATUS.ERROR,
        firstFailedCoordinate: "EAST_RETURNED_NON_OBJECT_PACKET",
        recommendedNextRenewalTarget: EAST_FILE
      };
    }

    if (hasFalsePromotion(packet)) {
      return {
        resultClass: EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED,
        status: CHILD_STATUS.BLOCKED,
        firstFailedCoordinate: "EAST_FALSE_PROMOTION_BLOCKED",
        recommendedNextRenewalTarget: EAST_FILE
      };
    }

    const held = Boolean(
      safeBool(packet.heldAtlasPacketReturned, false) ||
      safeBool(packet.synchronousHeldPacketActive, false) ||
      safeBool(packet.heldPacketWasSynchronous, false) ||
      safeString(packet.f13BuildBlockedReason, "") ||
      safeString(packet.firstFailedCoordinate, "").includes("WAITING")
    );

    const heldSync = Boolean(
      safeBool(packet.heldPacketWasSynchronous, false) ||
      (safeBool(packet.buildAtlasReturnedPromise, false) === false && held)
    );

    const atlasReady = Boolean(
      safeBool(packet.f13AtlasPacketReady, false) ||
      safeBool(packet.canvasEastEvidenceReady, false) ||
      safeBool(packet.atlasBuildComplete, false) ||
      safeBool(packet.atlasReady, false) ||
      safeBool(packet.atlasCanvasPresent, false) ||
      packet.atlasCanvas ||
      packet.canvas
    );

    if (atlasReady) {
      return {
        resultClass: EAST_RESULT_CLASS.ATLAS_EVIDENCE_READY,
        status: CHILD_STATUS.EVIDENCE_READY,
        firstFailedCoordinate: "NONE_CANVAS_EAST_F13_ATLAS_EVIDENCE_READY",
        recommendedNextRenewalTarget: FILE
      };
    }

    if (held) {
      return {
        resultClass: EAST_RESULT_CLASS.HELD_SYNCHRONOUS,
        status: CHILD_STATUS.HELD,
        firstFailedCoordinate: safeString(packet.f13BuildBlockedReason, "") || safeString(packet.firstFailedCoordinate, "WAITING_CANVAS_EAST_ATLAS_EVIDENCE"),
        recommendedNextRenewalTarget: FILE,
        heldPacketWasSynchronous: heldSync
      };
    }

    return {
      resultClass: EAST_RESULT_CLASS.BUILD_ERROR,
      status: CHILD_STATUS.ERROR,
      firstFailedCoordinate: "WAITING_CANVAS_EAST_ATLAS_EVIDENCE",
      recommendedNextRenewalTarget: EAST_FILE
    };
  }

  function applyEastPacket(packet = {}, source = "unknown") {
    const classification = classifyEastPacket(packet);

    state.canvasEastLastPacket = clonePlain({
      ...packet,
      atlasCanvas: packet && packet.atlasCanvas ? "[canvas]" : undefined,
      canvas: packet && packet.canvas ? "[canvas]" : undefined
    });

    state.parentEastBuildAtlasResultClass = classification.resultClass;
    state.canvasEastStatus = classification.status;
    state.canvasEastApiReady = true;
    state.canvasEastApiMissing = false;
    state.canvasEastObserved = true;
    state.canvasEastEvidenceReady = classification.resultClass === EAST_RESULT_CLASS.ATLAS_EVIDENCE_READY;
    state.canvasEastHeldPacketRecognized = classification.resultClass === EAST_RESULT_CLASS.HELD_SYNCHRONOUS;
    state.canvasEastHeldPacketWasSynchronous = Boolean(classification.heldPacketWasSynchronous);
    state.canvasEastBuildAtlasReturnedPromise = safeBool(packet.buildAtlasReturnedPromise, false);
    state.canvasEastF13AtlasPacketReady = Boolean(
      safeBool(packet.f13AtlasPacketReady, false) ||
      classification.resultClass === EAST_RESULT_CLASS.ATLAS_EVIDENCE_READY
    );
    state.canvasEastAtlasBuildComplete = safeBool(packet.atlasBuildComplete, false);
    state.canvasEastAtlasCanvasPresent = Boolean(
      safeBool(packet.atlasCanvasPresent, false) ||
      packet.atlasCanvas ||
      packet.canvas
    );
    state.canvasEastFalsePromotionBlocked = classification.resultClass === EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED;
    state.canvasEastFirstFailedCoordinate = classification.firstFailedCoordinate;
    state.canvasEastRecommendedNextRenewalTarget = classification.recommendedNextRenewalTarget;

    if (classification.resultClass === EAST_RESULT_CLASS.HELD_SYNCHRONOUS) {
      state.canvasEastLastHeldPacket = clonePlain(state.canvasEastLastPacket);
      state.f13StrictEvidenceGap = state.upstreamReleaseAccepted
        ? "WAITING_CANVAS_EAST_ATLAS_EVIDENCE_AFTER_ROUTE_RELEASE"
        : "WAITING_PARENT_WEST_RELEASE_TO_EAST";
      state.f13StrictEvidenceRepairTarget = FILE;
    }

    if (classification.resultClass === EAST_RESULT_CLASS.ATLAS_EVIDENCE_READY) {
      state.canvasEastLastAtlasPacket = clonePlain(state.canvasEastLastPacket);
      state.f13StrictEvidenceGap = "NONE_CANVAS_EAST_ATLAS_EVIDENCE_READY";
      state.f13StrictEvidenceRepairTarget = FILE;
      state.f13CanvasReadinessObserved = true;
      state.f13InspectEvidenceAvailable = true;
    }

    if (classification.resultClass === EAST_RESULT_CLASS.FALSE_PROMOTION_BLOCKED) {
      state.f13HardFail = true;
      state.parentStrictReadMismatch = true;
      state.parentStrictReadMismatchReason = "East attempted to promote source/intake evidence into visible proof, Canvas readiness, F21, ready text, completion latch, or visual pass.";
      state.f13StrictEvidenceGap = "EAST_FALSE_PROMOTION_BLOCKED";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
    }

    state.updatedAt = nowIso();

    recordEvent("CANVAS_PARENT_EAST_PACKET_CLASSIFIED", {
      source,
      resultClass: classification.resultClass,
      status: classification.status,
      firstFailedCoordinate: classification.firstFailedCoordinate,
      heldPacketWasSynchronous: state.canvasEastHeldPacketWasSynchronous,
      evidenceReady: state.canvasEastEvidenceReady,
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      carrierSafe: true,
      visualPassClaimed: false
    });

    recomputeParentState();
    return classification;
  }

  function callEastBuildAtlas(options = {}) {
    consumeReleaseFromOptions(options, "callEastBuildAtlas-options");

    const eastScan = scanEastAuthority();
    const east = eastScan.authority;

    if (!eastScan.apiReady || !east || !isFunction(east.buildAtlas)) {
      state.parentEastBuildAtlasCalled = false;
      state.parentEastBuildAtlasResultClass = EAST_RESULT_CLASS.API_MISSING;
      state.canvasEastStatus = CHILD_STATUS.MISSING;
      state.canvasEastApiReady = false;
      state.canvasEastApiMissing = true;
      state.canvasEastEvidenceReady = false;
      state.canvasEastFirstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.canvasEastRecommendedNextRenewalTarget = EAST_FILE;

      recomputeParentState();

      return {
        accepted: false,
        resultClass: EAST_RESULT_CLASS.API_MISSING,
        reason: "Canvas East API missing or buildAtlas unavailable.",
        firstFailedCoordinate: "WAITING_CANVAS_EAST_API",
        recommendedNextRenewalTarget: EAST_FILE,
        carrierSafe: true,
        routeReleaseAccepted: state.upstreamReleaseAccepted,
        visualPassClaimed: false
      };
    }

    const releasePacket = composeParentReleasePacket(options);

    state.parentEastBuildAtlasCalled = true;
    state.lastEastCallAt = nowIso();

    let result;

    try {
      result = east.buildAtlas(releasePacket);
    } catch (error) {
      state.parentEastBuildAtlasResultClass = EAST_RESULT_CLASS.BUILD_ERROR;
      state.canvasEastStatus = CHILD_STATUS.ERROR;
      state.canvasEastLastError = error && error.message ? String(error.message) : String(error);
      state.canvasEastFirstFailedCoordinate = "EAST_BUILD_ATLAS_THROWN_ERROR";
      state.canvasEastRecommendedNextRenewalTarget = EAST_FILE;

      recordError("EAST_BUILD_ATLAS_THROWN_ERROR", error, {
        releasePacketLawful: state.parentReleasePacketLawful,
        routeReleaseAccepted: state.upstreamReleaseAccepted,
        carrierSafe: true
      });

      recomputeParentState();

      return {
        accepted: false,
        resultClass: EAST_RESULT_CLASS.BUILD_ERROR,
        error: state.canvasEastLastError,
        firstFailedCoordinate: state.canvasEastFirstFailedCoordinate,
        recommendedNextRenewalTarget: EAST_FILE,
        carrierSafe: true,
        visualPassClaimed: false
      };
    }

    if (result && isFunction(result.then)) {
      state.parentEastBuildAtlasResultClass = EAST_RESULT_CLASS.PENDING_ASYNC;
      state.canvasEastBuildAtlasReturnedPromise = true;
      state.canvasEastStatus = CHILD_STATUS.API_READY;
      state.canvasEastEvidenceReady = false;
      state.canvasEastFirstFailedCoordinate = "WAITING_CANVAS_EAST_ASYNC_ATLAS_PACKET";
      state.canvasEastRecommendedNextRenewalTarget = FILE;

      result
        .then((packet) => {
          applyEastPacket(packet, "east-buildAtlas-async-resolution");
          publishGlobals();
          updateDataset();
        })
        .catch((error) => {
          state.parentEastBuildAtlasResultClass = EAST_RESULT_CLASS.BUILD_ERROR;
          state.canvasEastStatus = CHILD_STATUS.ERROR;
          state.canvasEastLastError = error && error.message ? String(error.message) : String(error);
          state.canvasEastFirstFailedCoordinate = "EAST_ASYNC_ATLAS_PACKET_REJECTED";
          state.canvasEastRecommendedNextRenewalTarget = EAST_FILE;
          recordError("EAST_ASYNC_ATLAS_PACKET_REJECTED", error);
          recomputeParentState();
          publishGlobals();
          updateDataset();
        });

      recomputeParentState();

      return {
        accepted: true,
        resultClass: EAST_RESULT_CLASS.PENDING_ASYNC,
        buildAtlasReturnedPromise: true,
        firstFailedCoordinate: "WAITING_CANVAS_EAST_ASYNC_ATLAS_PACKET",
        recommendedNextRenewalTarget: FILE,
        routeReleaseAccepted: state.upstreamReleaseAccepted,
        carrierSafe: true,
        visualPassClaimed: false
      };
    }

    const classification = applyEastPacket(result, "east-buildAtlas-sync-return");

    return {
      accepted: classification.resultClass !== EAST_RESULT_CLASS.BUILD_ERROR,
      resultClass: classification.resultClass,
      buildAtlasReturnedPromise: false,
      firstFailedCoordinate: classification.firstFailedCoordinate,
      recommendedNextRenewalTarget: classification.recommendedNextRenewalTarget,
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      carrierSafe: true,
      visualPassClaimed: false
    };
  }

  function receiveEastPacket(packet = {}) {
    scanEastAuthority();
    return applyEastPacket(packet, "receiveEastPacket");
  }

  function receiveWestPacket(packet = {}) {
    state.canvasWestObserved = true;
    state.canvasWestApiReady = true;
    state.canvasWestReceipt = clonePlain(packet);

    state.westAuditObserved = anyTrue(true, packet.westAuditObserved, packet.macroWestAdmissibilityObserved, packet.gapAssessed);
    state.westAuditAccepted = anyTrue(packet.westAuditAccepted, packet.westAuditPassed, packet.forwardAllowed, packet.westForwardAllowed, packet.decision === "RELEASE_TO_CANVAS");
    state.westAuditDegraded = anyTrue(packet.westAuditDegraded, packet.canDegradeForward, packet.westDegradedForwardApproved);
    state.westHardBlock = anyTrue(packet.hardBlock, packet.westHardBlock, packet.westAuditBlocked);
    state.westCanvasReleaseApproved = anyTrue(packet.westCanvasReleaseApproved, packet.canvasReleaseApprovedByWest, packet.canvasReleaseAuthorized, packet.releaseToCanvas);
    state.westForwardAllowed = anyTrue(packet.forwardAllowed, packet.westForwardAllowed, state.westCanvasReleaseApproved);
    state.westDecision = firstString(packet.decision, packet.westDecision);
    state.westGapClass = firstString(packet.gapClass, packet.westGapClass);
    state.westFirstFailedCoordinate = firstString(packet.firstFailedCoordinate, packet.westFirstFailedCoordinate);
    state.canvasWestInspectionReady = Boolean((state.westAuditAccepted || state.westAuditDegraded || state.westCanvasReleaseApproved) && !state.westHardBlock);
    state.canvasWestEvidenceReady = state.canvasWestInspectionReady;
    state.canvasWestStatus = state.canvasWestInspectionReady ? CHILD_STATUS.EVIDENCE_READY : CHILD_STATUS.API_READY;

    recordEvent("CANVAS_PARENT_WEST_PACKET_RECEIVED", {
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      westHardBlock: state.westHardBlock,
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      carrierSafe: true
    });

    recomputeParentState();
    return getReceipt();
  }

  function receiveSouthPacket(packet = {}) {
    state.canvasSouthObserved = true;
    state.canvasSouthApiReady = true;
    state.canvasSouthReceipt = clonePlain(packet);

    state.canvasSouthVisibleProofReady = anyTrue(packet.visibleContentProof, packet.visibleContentStrictProof, packet.southVisibleProofReady, packet.southStrictProofObserved);
    state.canvasSouthSoftProofReady = anyTrue(packet.visibleContentSoftGap, packet.visibleForwardProgress, packet.southSoftProofReady, packet.southSoftProofObserved);
    state.canvasSouthHardFail = anyTrue(packet.visibleContentHardFail, packet.southHardFailObserved, packet.f13HardFail);
    state.canvasSouthProofStale = anyTrue(packet.southProofStale, packet.proofStale);

    state.canvasSouthStatus = state.canvasSouthHardFail
      ? CHILD_STATUS.BLOCKED
      : state.canvasSouthVisibleProofReady || state.canvasSouthSoftProofReady
        ? CHILD_STATUS.EVIDENCE_READY
        : CHILD_STATUS.API_READY;

    recordEvent("CANVAS_PARENT_SOUTH_PACKET_RECEIVED", {
      strictProof: state.canvasSouthVisibleProofReady,
      softProof: state.canvasSouthSoftProofReady,
      hardFail: state.canvasSouthHardFail,
      stale: state.canvasSouthProofStale,
      carrierSafe: true
    });

    recomputeParentState();
    return getReceipt();
  }

  function computeFibonacciSynchronization() {
    const gates = [
      Boolean(state.activeFibonacci === ACTIVE_FIBONACCI),
      Boolean(state.structuralCarrierReady && state.canvasParentCarrierSafe),
      Boolean(state.routeConductorReleasePacketIntakeActive),
      Boolean(state.upstreamReleasePacketObserved || state.localWestReleaseFallbackActive),
      Boolean(state.canvasParentReleaseAccepted || state.canvasReleaseHeldReason),
      Boolean(state.canvasEastApiReady && !state.canvasEastApiMissing),
      Boolean(state.canvasEastHeldPacketRecognized || state.canvasEastF13AtlasPacketReady || state.canvasEastEvidenceReady || state.parentEastBuildAtlasResultClass === EAST_RESULT_CLASS.API_MISSING),
      Boolean(state.westCanvasReleaseApproved || state.westAuditAccepted || state.westAuditDegraded || state.upstreamWestCanvasReleaseApproved || state.upstreamReleasePacketObserved),
      Boolean(state.canvasSouthVisibleProofReady || state.canvasSouthSoftProofReady || state.canvasSouthApiReady || state.canvasSouthStatus === CHILD_STATUS.MISSING),
      Boolean(!state.f21ClaimedByCanvasParent && !state.f21EligibleForNorth && !state.visualPassClaimed && !state.readyTextAllowed && !state.completionLatched)
    ];

    const satisfied = gates.filter(Boolean).length;
    const expected = gates.length;
    const score = expected ? Math.round((satisfied / expected) * 100) : 0;

    state.fibonacciSynchronizationSatisfied = satisfied;
    state.fibonacciSynchronizationExpected = expected;
    state.fibonacciSynchronizationScore = score;
    state.fibonacciSynchronizationPassed = satisfied === expected;
    state.fibonacciSynchronizationDegraded = satisfied >= Math.max(1, expected - 2) && satisfied < expected;

    return {
      score,
      satisfied,
      expected,
      passed: state.fibonacciSynchronizationPassed,
      degraded: state.fibonacciSynchronizationDegraded,
      gates
    };
  }

  function recomputeParentState() {
    state.structuralCarrierActive = true;
    state.structuralCarrierReady = true;
    state.structuralCarrierSafe = true;
    state.canvasParentCarrierSafe = true;
    state.carrierPrecheckReady = true;
    state.macroWestPrecheckCarrierReady = true;
    state.parentCarrierSafeIsNotMacroWestPrerequisite = true;
    state.canvasParentV2Observed = false;
    state.hearthCanvasParentV2Observed = false;
    state.staleParentV2Retired = true;

    const accepted = resolveAcceptedRelease();

    state.canvasParentReleaseAccepted = accepted.accepted;
    state.canvasParentReleaseObserved = accepted.accepted;
    state.parentReleaseLawful = accepted.accepted;
    state.canvasReleaseAuthorized = accepted.accepted;
    state.canvasReleaseHeldReason = accepted.heldReason;

    state.allCanvasChildrenApiReady = Boolean(
      state.canvasEastApiReady &&
      state.canvasWestApiReady &&
      state.canvasSouthApiReady
    );

    const eastEvidenceReady = Boolean(state.canvasEastEvidenceReady && state.canvasEastF13AtlasPacketReady);
    const westReady = Boolean(
      state.canvasWestInspectionReady ||
      state.westCanvasReleaseApproved ||
      state.westAuditAccepted ||
      state.westAuditDegraded ||
      state.upstreamWestCanvasReleaseApproved
    );
    const southReady = Boolean(
      (state.canvasSouthVisibleProofReady || state.canvasSouthSoftProofReady) &&
      !state.canvasSouthHardFail &&
      !state.canvasSouthProofStale
    );

    state.indexGateReady = Boolean(state.upstreamIndexPairReady || state.upstreamReleaseAccepted || state.localWestReleaseUsed);
    state.eastGateReady = Boolean(state.canvasEastApiReady && !state.canvasEastApiMissing);
    state.westGateReady = Boolean(westReady || state.upstreamReleaseAccepted);
    state.southGateReady = Boolean(southReady || state.canvasSouthApiReady);
    state.northGateReady = false;

    state.allCanvasChildrenEvidenceReady = Boolean(eastEvidenceReady && westReady && southReady);
    state.allCanvasChildrenReady = Boolean(state.allCanvasChildrenApiReady && state.allCanvasChildrenEvidenceReady);

    state.f13ProofBodyAvailable = Boolean(state.canvasParentCarrierSafe && (state.canvasEastApiReady || state.canvasWestApiReady || state.canvasSouthApiReady || state.upstreamReleasePacketObserved));
    state.f13CanvasReadinessObserved = Boolean(state.canvasParentCarrierSafe && accepted.accepted && (state.canvasEastApiReady || state.canvasEastHeldPacketRecognized || state.canvasEastEvidenceReady));
    state.f13VisibleEvidenceAvailable = Boolean(eastEvidenceReady && southReady);
    state.f13InspectEvidenceAvailable = Boolean(state.canvasParentCarrierSafe || state.canvasEastApiReady || state.canvasWestInspectionReady || state.canvasSouthApiReady);

    state.f13HardFail = Boolean(
      state.canvasEastFalsePromotionBlocked ||
      state.westHardBlock ||
      state.upstreamWestHardBlock ||
      state.canvasSouthHardFail ||
      state.parentStrictReadMismatch
    );

    state.f13CanvasEvidenceStrict = Boolean(eastEvidenceReady && westReady && state.canvasSouthVisibleProofReady && !state.f13HardFail);
    state.f13CanvasEvidenceDegraded = Boolean(!state.f13CanvasEvidenceStrict && eastEvidenceReady && westReady && state.canvasSouthSoftProofReady && !state.f13HardFail);
    state.f13CanvasEvidenceComplete = Boolean(state.f13CanvasEvidenceStrict || state.f13CanvasEvidenceDegraded);

    state.canvasGateReady = state.f13CanvasEvidenceComplete;
    state.newsGatePassedBeforeF21 = Boolean(state.canvasGateReady && state.f13CanvasEvidenceStrict);
    state.newsGateDegradedBeforeF21 = Boolean(state.canvasGateReady && state.f13CanvasEvidenceDegraded);

    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21EligibilitySubmittedToNorth = false;
    state.f21LatchMode = state.f13CanvasEvidenceComplete
      ? "F13_COMPLETE_HELD_FOR_NORTH_SUBMISSION_NOT_LATCHED"
      : "WAITING_CANVAS_GATE";
    state.completionLatched = false;
    state.degradedCompletionLatched = false;
    state.readyTextAllowed = false;
    state.f21ClaimedByCanvasParent = false;
    state.readyTextClaimedByCanvasParent = false;
    state.visualPassClaimed = false;

    if (state.f13HardFail) {
      state.firstFailedCoordinate = state.canvasEastFalsePromotionBlocked
        ? "EAST_FALSE_PROMOTION_BLOCKED"
        : state.westHardBlock || state.upstreamWestHardBlock
          ? "WEST_HARD_BLOCK"
          : state.canvasSouthHardFail
            ? "SOUTH_HARD_FAIL"
            : "PARENT_STRICT_READ_MISMATCH";

      state.recommendedNextFile = state.canvasEastFalsePromotionBlocked
        ? EAST_FILE
        : state.westHardBlock || state.upstreamWestHardBlock
          ? WEST_FILE
          : state.canvasSouthHardFail
            ? SOUTH_FILE
            : FILE;

      state.recommendedNextRenewalTarget = state.recommendedNextFile;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.f13StrictEvidenceRepairTarget = state.recommendedNextFile;
      state.postgameStatus = "CANVAS_PARENT_HELD_BY_HARD_FAIL";
    } else if (!accepted.accepted) {
      state.firstFailedCoordinate = accepted.heldReason;
      state.recommendedNextFile = state.upstreamReleasePacketObserved ? ROUTE_CONDUCTOR_FILE : ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = state.recommendedNextFile;
      state.f13StrictEvidenceGap = accepted.heldReason;
      state.f13StrictEvidenceRepairTarget = ROUTE_CONDUCTOR_FILE;
      state.postgameStatus = "CANVAS_PARENT_STRUCTURAL_CARRIER_SAFE_WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET";
    } else if (!state.canvasEastApiReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_EAST_API";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_ROUTE_RELEASE_ACCEPTED_WAITING_EAST_API";
    } else if (state.canvasEastHeldPacketRecognized && !state.canvasEastEvidenceReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE_AFTER_ROUTE_RELEASE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE_AFTER_ROUTE_RELEASE";
      state.f13StrictEvidenceRepairTarget = FILE;
      state.postgameStatus = "CANVAS_PARENT_RECOGNIZED_EAST_SYNCHRONOUS_HELD_PACKET_AFTER_ROUTE_RELEASE";
    } else if (!eastEvidenceReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_ROUTE_RELEASE_ACCEPTED_WAITING_EAST_ATLAS_EVIDENCE";
    } else if (!westReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_WEST_INSPECTION";
      state.recommendedNextFile = WEST_FILE;
      state.recommendedNextRenewalTarget = WEST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_WEST_INSPECTION";
      state.f13StrictEvidenceRepairTarget = WEST_FILE;
      state.postgameStatus = "CANVAS_PARENT_STRUCTURAL_CARRIER_SAFE_WAITING_WEST_INSPECTION";
    } else if (!southReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      state.recommendedNextFile = SOUTH_FILE;
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      state.f13StrictEvidenceRepairTarget = SOUTH_FILE;
      state.postgameStatus = "CANVAS_PARENT_ROUTE_RELEASE_ACCEPTED_WAITING_SOUTH_VISIBLE_PROOF";
    } else {
      state.firstFailedCoordinate = "NONE_CANVAS_F13_EVIDENCE_COMPLETE";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextRenewalTarget = ROUTE_CONDUCTOR_FILE;
      state.f13StrictEvidenceGap = "NONE_CANVAS_F13_EVIDENCE_COMPLETE";
      state.f13StrictEvidenceRepairTarget = NORTH_FILE;
      state.postgameStatus = state.f13CanvasEvidenceStrict
        ? "CANVAS_PARENT_F13_STRICT_EVIDENCE_COMPLETE"
        : "CANVAS_PARENT_F13_DEGRADED_EVIDENCE_COMPLETE";
    }

    computeFibonacciSynchronization();
    state.updatedAt = nowIso();

    updateDataset();
    return getReceiptLight();
  }

  function auditChildren(options = {}) {
    state.lastAuditAt = nowIso();

    consumeReleaseFromOptions(options, "auditChildren-options");

    scanMaterialAuthority();
    scanEastAuthority();
    scanWestAuthority();
    scanSouthAuthority();

    if (options.callEast !== false) {
      callEastBuildAtlas({
        reason: "auditChildren",
        releasePacket: extractRouteReleasePacket(options) || state.upstreamReleasePacket,
        width: options.width || 512,
        height: options.height || 256,
        async: options.async !== false,
        nonBlocking: options.nonBlocking !== false
      });
    } else {
      recomputeParentState();
    }

    recordEvent("CANVAS_PARENT_CHILD_AUDIT_COMPLETED", {
      callEast: options.callEast !== false,
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      canvasParentCarrierSafe: true,
      canvasEastApiReady: state.canvasEastApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasGateReady: state.canvasGateReady,
      firstFailedCoordinate: state.firstFailedCoordinate
    });

    publishGlobals();
    updateDataset();

    return getReceipt();
  }

  function receiveChildPacket(packet = {}) {
    const text = (() => {
      try {
        return JSON.stringify(packet);
      } catch (_error) {
        return "";
      }
    })();

    if (
      packet.eastContract === EAST_REQUIRED_CONTRACT ||
      packet.contract === EAST_REQUIRED_CONTRACT ||
      text.includes("CANVAS_EAST") ||
      packet.activeCardinal === "EAST" ||
      packet.sourceRole === "east-material-atlas-source"
    ) {
      return receiveEastPacket(packet);
    }

    if (
      text.includes("WEST") ||
      packet.activeCardinal === "WEST" ||
      packet.westAuditObserved !== undefined ||
      packet.westCanvasReleaseApproved !== undefined ||
      packet.canvasReleaseApprovedByWest !== undefined
    ) {
      return receiveWestPacket(packet);
    }

    if (
      text.includes("SOUTH") ||
      packet.activeCardinal === "SOUTH" ||
      packet.visibleContentProof !== undefined ||
      packet.southStrictProofObserved !== undefined ||
      packet.southSoftProofObserved !== undefined
    ) {
      return receiveSouthPacket(packet);
    }

    if (
      packet.canvasReleaseAuthorized !== undefined ||
      packet.packetType === "CANVAS_RELEASE_PACKET" ||
      packet.handoffTo === "CANVAS" ||
      packet.destinationFile === FILE
    ) {
      consumeRouteReleasePacket(packet, "receiveChildPacket-route-release");
      recomputeParentState();
      return getReceipt();
    }

    recordEvent("CANVAS_PARENT_UNKNOWN_CHILD_PACKET_ARCHIVED", {
      keys: Object.keys(packet || {}).slice(0, 40),
      carrierSafe: true
    });

    return getReceipt();
  }

  function boot(options = {}) {
    state.lastBootAt = nowIso();
    state.structuralCarrierPublished = true;

    consumeReleaseFromOptions(options, "boot-options");

    publishGlobals();
    updateDataset();
    installDiagnosticPanel();

    scanMaterialAuthority();
    scanEastAuthority();
    scanWestAuthority();
    scanSouthAuthority();
    recomputeParentState();

    const carrier = composeStructuralCarrier({
      reason: firstString(options.reason, "boot"),
      callEast: safeBool(options.callEast, false),
      routeReleaseAccepted: state.upstreamReleaseAccepted
    });

    recordEvent("CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_BOOT_METHOD_CALLED", {
      reason: firstString(options.reason, "boot"),
      callEast: safeBool(options.callEast, false),
      routeReleasePacketObserved: state.upstreamReleasePacketObserved,
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      acceptedReleaseSource: state.acceptedReleaseSource,
      carrierSafe: true,
      canvasParentV2Observed: false,
      visualPassClaimed: false
    });

    const shouldCallEast = safeBool(options.callEast, true);

    if (shouldCallEast) {
      try {
        auditChildren({
          callEast: true,
          async: options.async !== false,
          nonBlocking: options.nonBlocking !== false,
          width: options.width || 512,
          height: options.height || 256,
          releasePacket: extractRouteReleasePacket(options) || state.upstreamReleasePacket
        });
      } catch (error) {
        recordError("BOOT_METHOD_CHILD_AUDIT_FAILED", error);
      }
    }

    publishGlobals();
    updateDataset();

    return carrier;
  }

  function init(options = {}) {
    return boot({ ...options, reason: firstString(options.reason, "init") });
  }

  function start(options = {}) {
    return boot({ ...options, reason: firstString(options.reason, "start") });
  }

  function mount(options = {}) {
    return boot({ ...options, reason: firstString(options.reason, "mount") });
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      upstreamRouteConductorRequiredContract: UPSTREAM_ROUTE_CONDUCTOR_CONTRACT,
      upstreamRouteConductorRequiredReceipt: UPSTREAM_ROUTE_CONDUCTOR_RECEIPT,
      eastRequiredContract: EAST_REQUIRED_CONTRACT,
      materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      canvasParentActive: true,
      canvasParentV8Active: true,
      canvasParentV7Compatible: true,
      canvasParentV6Compatible: true,
      canvasParentV2Observed: false,
      hearthCanvasParentV2Observed: false,
      staleParentV2Retired: true,

      routeConductorReleasePacketIntakeActive: true,
      routeConductorReleasePacketPrimary: true,
      localWestReleaseFallbackActive: true,
      localWestReleaseUsed: state.localWestReleaseUsed,
      acceptedReleaseSource: state.acceptedReleaseSource,

      upstreamReleasePacketObserved: state.upstreamReleasePacketObserved,
      upstreamReleasePacketReady: state.upstreamReleasePacketReady,
      upstreamReleaseAccepted: state.upstreamReleaseAccepted,
      upstreamReleaseRejectedReason: state.upstreamReleaseRejectedReason,
      upstreamRouteConductorContract: state.upstreamRouteConductorContract,
      upstreamRouteConductorReceipt: state.upstreamRouteConductorReceipt,
      upstreamRouteConductorContractObserved: state.upstreamRouteConductorContractObserved,
      upstreamRouteConductorReceiptObserved: state.upstreamRouteConductorReceiptObserved,
      upstreamCanvasReleaseAuthorized: state.upstreamCanvasReleaseAuthorized,
      upstreamWestCanvasReleaseApproved: state.upstreamWestCanvasReleaseApproved,
      upstreamWestForwardAllowed: state.upstreamWestForwardAllowed,
      upstreamWestHardBlock: state.upstreamWestHardBlock,
      upstreamCarrierHostAdmissibilityReady: state.upstreamCarrierHostAdmissibilityReady,
      upstreamCarrierHostAdmissibilityPacketReady: state.upstreamCarrierHostAdmissibilityPacketReady,
      upstreamIndexPairReady: state.upstreamIndexPairReady,
      upstreamIndexMacroWestCandidateReady: state.upstreamIndexMacroWestCandidateReady,
      upstreamHandoffToCanvas: state.upstreamHandoffToCanvas,
      upstreamDestinationIsCanvas: state.upstreamDestinationIsCanvas,
      upstreamCycleNumber: state.upstreamCycleNumber,
      upstreamCycleRoute: state.upstreamCycleRoute,
      upstreamReceivedFrom: state.upstreamReceivedFrom,
      upstreamSourceFile: state.upstreamSourceFile,
      upstreamDestinationFile: state.upstreamDestinationFile,
      upstreamTargetFile: state.upstreamTargetFile,
      upstreamFirstFailedCoordinate: state.upstreamFirstFailedCoordinate,
      upstreamRecommendedNextFile: state.upstreamRecommendedNextFile,
      upstreamRecommendedNextRenewalTarget: state.upstreamRecommendedNextRenewalTarget,
      upstreamReleaseObservedAt: state.upstreamReleaseObservedAt,

      structuralCarrierActive: true,
      structuralCarrierPublished: state.structuralCarrierPublished,
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasParentCarrierSafe: true,
      carrierPrecheckReady: true,
      macroWestPrecheckCarrierReady: true,
      parentCarrierSafeIsNotMacroWestPrerequisite: true,
      canvasParentBootMethodAvailable: true,
      bootMethodAvailable: true,
      mountMethodAvailable: true,
      initMethodAvailable: true,
      startMethodAvailable: true,
      getStructuralCarrierAvailable: true,
      readStructuralCarrierAvailable: true,
      getCanvasCarrierAvailable: true,
      getCarrierReceiptAvailable: true,
      parentStructuralCarrierFirstPublishedAt: state.parentStructuralCarrierFirstPublishedAt,

      eastV5SynchronousHeldPacketConsumptionActive: true,
      canvasParentChildReconciliationActive: true,
      parentReleasePacketComposerActive: true,

      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      activeFibonacci: state.activeFibonacci,
      activeFibonacciRank: state.activeFibonacciRank,
      eastActiveFibonacci: state.eastActiveFibonacci,
      westActiveFibonacci: state.westActiveFibonacci,
      southActiveFibonacci: state.southActiveFibonacci,
      futureFibonacci: state.futureFibonacci,
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeNewsGate: state.activeNewsGate,
      oneActiveGearAtATime: true,

      parentReleasePacketSentToEast: state.parentReleasePacketSentToEast,
      parentReleasePacketLawful: state.parentReleasePacketLawful,
      parentWestReleaseIncluded: state.parentWestReleaseIncluded,
      parentCurrentContractIncluded: state.parentCurrentContractIncluded,
      parentEastBuildAtlasCalled: state.parentEastBuildAtlasCalled,
      parentEastBuildAtlasResultClass: state.parentEastBuildAtlasResultClass,

      canvasEastObserved: state.canvasEastObserved,
      canvasEastRequiredContractObserved: state.canvasEastRequiredContractObserved,
      canvasEastApiReady: state.canvasEastApiReady,
      canvasEastApiMissing: state.canvasEastApiMissing,
      canvasEastStatus: state.canvasEastStatus,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasEastHeldPacketRecognized: state.canvasEastHeldPacketRecognized,
      canvasEastHeldPacketWasSynchronous: state.canvasEastHeldPacketWasSynchronous,
      canvasEastBuildAtlasReturnedPromise: state.canvasEastBuildAtlasReturnedPromise,
      canvasEastF13AtlasPacketReady: state.canvasEastF13AtlasPacketReady,
      canvasEastAtlasBuildComplete: state.canvasEastAtlasBuildComplete,
      canvasEastAtlasCanvasPresent: state.canvasEastAtlasCanvasPresent,
      canvasEastFalsePromotionBlocked: state.canvasEastFalsePromotionBlocked,
      canvasEastFirstFailedCoordinate: state.canvasEastFirstFailedCoordinate,
      canvasEastRecommendedNextRenewalTarget: state.canvasEastRecommendedNextRenewalTarget,

      canvasWestObserved: state.canvasWestObserved,
      canvasWestApiReady: state.canvasWestApiReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasWestEvidenceReady: state.canvasWestEvidenceReady,
      canvasWestStatus: state.canvasWestStatus,
      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westAuditDegraded: state.westAuditDegraded,
      westHardBlock: state.westHardBlock,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      westForwardAllowed: state.westForwardAllowed,
      westDecision: state.westDecision,
      westGapClass: state.westGapClass,

      canvasSouthObserved: state.canvasSouthObserved,
      canvasSouthApiReady: state.canvasSouthApiReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      canvasSouthSoftProofReady: state.canvasSouthSoftProofReady,
      canvasSouthHardFail: state.canvasSouthHardFail,
      canvasSouthProofStale: state.canvasSouthProofStale,
      canvasSouthStatus: state.canvasSouthStatus,

      materialAuthorityObserved: state.materialAuthorityObserved,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,

      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      canvasParentRequestObserved: true,
      parentRequestLawful: true,
      canvasParentReleaseObserved: state.canvasParentReleaseObserved,
      canvasParentReleaseAccepted: state.canvasParentReleaseAccepted,
      parentReleaseLawful: state.parentReleaseLawful,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseRequiresWestAudit: state.canvasReleaseRequiresWestAudit,
      canvasReleaseRequiresMacroWest: state.canvasReleaseRequiresMacroWest,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,

      f13ProofBodyAvailable: state.f13ProofBodyAvailable,
      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13InspectEvidenceAvailable: state.f13InspectEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      parentStrictReadMismatch: state.parentStrictReadMismatch,
      parentStrictReadMismatchReason: state.parentStrictReadMismatchReason,
      degradedF13IsFunctional: state.degradedF13IsFunctional,
      functionalPageObserved: state.functionalPageObserved,
      strictVisualProofPending: state.strictVisualProofPending,

      indexGateReady: state.indexGateReady,
      canvasGateReady: state.canvasGateReady,
      northGateReady: state.northGateReady,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      newsAlignmentProtocolActive: true,
      newsFinalizedByCanvasParent: false,
      newsGatePassedBeforeF21: state.newsGatePassedBeforeF21,
      newsGateDegradedBeforeF21: state.newsGateDegradedBeforeF21,

      fibonacciSynchronizationMetricActive: true,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationSatisfied: state.fibonacciSynchronizationSatisfied,
      fibonacciSynchronizationExpected: state.fibonacciSynchronizationExpected,
      fibonacciSynchronizationPassed: state.fibonacciSynchronizationPassed,
      fibonacciSynchronizationDegraded: state.fibonacciSynchronizationDegraded,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21EligibilitySubmittedToNorth: false,
      f21LatchMode: state.f21LatchMode,
      completionLatched: false,
      degradedCompletionLatched: false,
      readyTextAllowed: false,
      f21ClaimedByCanvasParent: false,
      readyTextClaimedByCanvasParent: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      canvasNextAuditTarget: state.canvasNextAuditTarget,
      postgameStatus: state.postgameStatus,

      receiptVisible: state.receiptVisible,
      receiptExpanded: state.receiptExpanded,
      diagnosticExportCopyable: true,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      lastAuditAt: state.lastAuditAt,
      lastBootAt: state.lastBootAt,
      lastCarrierReadAt: state.lastCarrierReadAt,
      lastReleaseAt: state.lastReleaseAt,
      lastEastCallAt: state.lastEastCallAt,
      publishedAt: state.publishedAt,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      owns: [
        "canvas-parent-structural-carrier",
        "canvas-parent-boot-method-aliases",
        "route-conductor-release-packet-intake",
        "parent-release-acceptance",
        "child-api-recognition",
        "east-west-south-child-packet-intake",
        "canvas-f13-evidence-classification",
        "parent-release-packet-composition-to-east",
        "east-synchronous-held-packet-interpretation",
        "canvas-parent-receipt-dataset-publication"
      ],

      doesNotOwn: [
        "material-truth",
        "elevation-truth",
        "hydrology-truth",
        "east-atlas-source-truth",
        "west-admissibility-truth",
        "south-visible-proof-truth",
        "route-orchestration",
        "north-f21-latch",
        "ready-text",
        "final-visual-pass-claim"
      ],

      childResultClasses: clonePlain(EAST_RESULT_CLASS),
      childStatuses: clonePlain(CHILD_STATUS),
      releaseSources: clonePlain(RELEASE_SOURCE),

      structuralCarrier: composeStructuralCarrier({ reason: "getReceipt" }),

      upstreamReleasePacket: clonePlain(state.upstreamReleasePacket),
      lastReleasePacket: clonePlain(state.lastReleasePacket),
      canvasEastReceipt: clonePlain(state.canvasEastReceipt),
      canvasEastLastPacket: clonePlain(state.canvasEastLastPacket),
      canvasEastLastHeldPacket: clonePlain(state.canvasEastLastHeldPacket),
      canvasEastLastAtlasPacket: clonePlain(state.canvasEastLastAtlasPacket),
      canvasWestReceipt: clonePlain(state.canvasWestReceipt),
      canvasSouthReceipt: clonePlain(state.canvasSouthReceipt),

      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors)
    };
  }

  function getDiagnosticExport() {
    return getReceiptText();
  }

  function getReceiptText() {
    const r = getReceiptLight();

    const localEvents = (state.localEvents || [])
      .slice(-40)
      .map((event) => `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`)
      .join("\n") || "- none";

    const errors = (state.errors || [])
      .slice(-30)
      .map((error) => `- ${error.at} :: ${error.code} :: ${error.message}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `upstreamRouteConductorRequiredContract=${r.upstreamRouteConductorRequiredContract}`,
      `eastRequiredContract=${r.eastRequiredContract}`,
      `materialRequiredContract=${r.materialRequiredContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      "UPSTREAM_ROUTE_CONDUCTOR_RELEASE",
      `routeConductorReleasePacketIntakeActive=${r.routeConductorReleasePacketIntakeActive}`,
      `routeConductorReleasePacketPrimary=${r.routeConductorReleasePacketPrimary}`,
      `localWestReleaseFallbackActive=${r.localWestReleaseFallbackActive}`,
      `localWestReleaseUsed=${r.localWestReleaseUsed}`,
      `acceptedReleaseSource=${r.acceptedReleaseSource}`,
      `upstreamReleasePacketObserved=${r.upstreamReleasePacketObserved}`,
      `upstreamReleasePacketReady=${r.upstreamReleasePacketReady}`,
      `upstreamReleaseAccepted=${r.upstreamReleaseAccepted}`,
      `upstreamReleaseRejectedReason=${r.upstreamReleaseRejectedReason}`,
      `upstreamRouteConductorContract=${r.upstreamRouteConductorContract}`,
      `upstreamRouteConductorReceipt=${r.upstreamRouteConductorReceipt}`,
      `upstreamRouteConductorContractObserved=${r.upstreamRouteConductorContractObserved}`,
      `upstreamRouteConductorReceiptObserved=${r.upstreamRouteConductorReceiptObserved}`,
      `upstreamCanvasReleaseAuthorized=${r.upstreamCanvasReleaseAuthorized}`,
      `upstreamWestCanvasReleaseApproved=${r.upstreamWestCanvasReleaseApproved}`,
      `upstreamWestForwardAllowed=${r.upstreamWestForwardAllowed}`,
      `upstreamWestHardBlock=${r.upstreamWestHardBlock}`,
      `upstreamCarrierHostAdmissibilityReady=${r.upstreamCarrierHostAdmissibilityReady}`,
      `upstreamCarrierHostAdmissibilityPacketReady=${r.upstreamCarrierHostAdmissibilityPacketReady}`,
      `upstreamIndexPairReady=${r.upstreamIndexPairReady}`,
      `upstreamIndexMacroWestCandidateReady=${r.upstreamIndexMacroWestCandidateReady}`,
      `upstreamHandoffToCanvas=${r.upstreamHandoffToCanvas}`,
      `upstreamDestinationIsCanvas=${r.upstreamDestinationIsCanvas}`,
      `upstreamCycleNumber=${r.upstreamCycleNumber}`,
      `upstreamCycleRoute=${r.upstreamCycleRoute}`,
      `upstreamReceivedFrom=${r.upstreamReceivedFrom}`,
      `upstreamSourceFile=${r.upstreamSourceFile}`,
      `upstreamDestinationFile=${r.upstreamDestinationFile}`,
      `upstreamTargetFile=${r.upstreamTargetFile}`,
      `upstreamFirstFailedCoordinate=${r.upstreamFirstFailedCoordinate}`,
      `upstreamRecommendedNextFile=${r.upstreamRecommendedNextFile}`,
      `upstreamRecommendedNextRenewalTarget=${r.upstreamRecommendedNextRenewalTarget}`,
      `upstreamReleaseObservedAt=${r.upstreamReleaseObservedAt}`,
      "",
      "STRUCTURAL_CARRIER",
      `canvasParentActive=${r.canvasParentActive}`,
      `canvasParentV8Active=${r.canvasParentV8Active}`,
      `canvasParentV7Compatible=${r.canvasParentV7Compatible}`,
      `canvasParentV6Compatible=${r.canvasParentV6Compatible}`,
      `canvasParentV2Observed=${r.canvasParentV2Observed}`,
      `hearthCanvasParentV2Observed=${r.hearthCanvasParentV2Observed}`,
      `staleParentV2Retired=${r.staleParentV2Retired}`,
      `structuralCarrierActive=${r.structuralCarrierActive}`,
      `structuralCarrierPublished=${r.structuralCarrierPublished}`,
      `structuralCarrierReady=${r.structuralCarrierReady}`,
      `structuralCarrierSafe=${r.structuralCarrierSafe}`,
      `canvasParentCarrierSafe=${r.canvasParentCarrierSafe}`,
      `carrierPrecheckReady=${r.carrierPrecheckReady}`,
      `macroWestPrecheckCarrierReady=${r.macroWestPrecheckCarrierReady}`,
      `parentCarrierSafeIsNotMacroWestPrerequisite=${r.parentCarrierSafeIsNotMacroWestPrerequisite}`,
      `canvasParentBootMethodAvailable=${r.canvasParentBootMethodAvailable}`,
      `bootMethodAvailable=${r.bootMethodAvailable}`,
      `mountMethodAvailable=${r.mountMethodAvailable}`,
      `initMethodAvailable=${r.initMethodAvailable}`,
      `startMethodAvailable=${r.startMethodAvailable}`,
      `getStructuralCarrierAvailable=${r.getStructuralCarrierAvailable}`,
      `readStructuralCarrierAvailable=${r.readStructuralCarrierAvailable}`,
      `getCanvasCarrierAvailable=${r.getCanvasCarrierAvailable}`,
      `getCarrierReceiptAvailable=${r.getCarrierReceiptAvailable}`,
      `parentStructuralCarrierFirstPublishedAt=${r.parentStructuralCarrierFirstPublishedAt}`,
      "",
      "PARENT",
      `eastV5SynchronousHeldPacketConsumptionActive=${r.eastV5SynchronousHeldPacketConsumptionActive}`,
      `canvasParentChildReconciliationActive=${r.canvasParentChildReconciliationActive}`,
      `parentReleasePacketComposerActive=${r.parentReleasePacketComposerActive}`,
      `parentReleasePacketSentToEast=${r.parentReleasePacketSentToEast}`,
      `parentReleasePacketLawful=${r.parentReleasePacketLawful}`,
      `parentWestReleaseIncluded=${r.parentWestReleaseIncluded}`,
      `parentCurrentContractIncluded=${r.parentCurrentContractIncluded}`,
      `parentEastBuildAtlasCalled=${r.parentEastBuildAtlasCalled}`,
      `parentEastBuildAtlasResultClass=${r.parentEastBuildAtlasResultClass}`,
      "",
      "CYCLE",
      `cycleNumber=${r.cycleNumber}`,
      `cycleRoute=${r.cycleRoute}`,
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `eastActiveFibonacci=${r.eastActiveFibonacci}`,
      `westActiveFibonacci=${r.westActiveFibonacci}`,
      `southActiveFibonacci=${r.southActiveFibonacci}`,
      `futureFibonacci=${r.futureFibonacci}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeNewsGate=${r.activeNewsGate}`,
      `oneActiveGearAtATime=${r.oneActiveGearAtATime}`,
      "",
      "EAST",
      `canvasEastObserved=${r.canvasEastObserved}`,
      `canvasEastRequiredContractObserved=${r.canvasEastRequiredContractObserved}`,
      `canvasEastApiReady=${r.canvasEastApiReady}`,
      `canvasEastApiMissing=${r.canvasEastApiMissing}`,
      `canvasEastStatus=${r.canvasEastStatus}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      `canvasEastHeldPacketRecognized=${r.canvasEastHeldPacketRecognized}`,
      `canvasEastHeldPacketWasSynchronous=${r.canvasEastHeldPacketWasSynchronous}`,
      `canvasEastBuildAtlasReturnedPromise=${r.canvasEastBuildAtlasReturnedPromise}`,
      `canvasEastF13AtlasPacketReady=${r.canvasEastF13AtlasPacketReady}`,
      `canvasEastAtlasBuildComplete=${r.canvasEastAtlasBuildComplete}`,
      `canvasEastAtlasCanvasPresent=${r.canvasEastAtlasCanvasPresent}`,
      `canvasEastFalsePromotionBlocked=${r.canvasEastFalsePromotionBlocked}`,
      `canvasEastFirstFailedCoordinate=${r.canvasEastFirstFailedCoordinate}`,
      `canvasEastRecommendedNextRenewalTarget=${r.canvasEastRecommendedNextRenewalTarget}`,
      "",
      "WEST",
      `canvasWestObserved=${r.canvasWestObserved}`,
      `canvasWestApiReady=${r.canvasWestApiReady}`,
      `canvasWestInspectionReady=${r.canvasWestInspectionReady}`,
      `canvasWestEvidenceReady=${r.canvasWestEvidenceReady}`,
      `canvasWestStatus=${r.canvasWestStatus}`,
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditAccepted=${r.westAuditAccepted}`,
      `westAuditDegraded=${r.westAuditDegraded}`,
      `westHardBlock=${r.westHardBlock}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      `westForwardAllowed=${r.westForwardAllowed}`,
      `westDecision=${r.westDecision}`,
      `westGapClass=${r.westGapClass}`,
      "",
      "SOUTH",
      `canvasSouthObserved=${r.canvasSouthObserved}`,
      `canvasSouthApiReady=${r.canvasSouthApiReady}`,
      `canvasSouthVisibleProofReady=${r.canvasSouthVisibleProofReady}`,
      `canvasSouthSoftProofReady=${r.canvasSouthSoftProofReady}`,
      `canvasSouthHardFail=${r.canvasSouthHardFail}`,
      `canvasSouthProofStale=${r.canvasSouthProofStale}`,
      `canvasSouthStatus=${r.canvasSouthStatus}`,
      "",
      "MATERIALS",
      `materialAuthorityObserved=${r.materialAuthorityObserved}`,
      `materialContract=${r.materialContract}`,
      `materialReceipt=${r.materialReceipt}`,
      `materialContractMatchesExpected=${r.materialContractMatchesExpected}`,
      `materialReceiptMatchesExpected=${r.materialReceiptMatchesExpected}`,
      `materialReceiptBridgeActive=${r.materialReceiptBridgeActive}`,
      "",
      "RELEASE",
      `canvasParentRequestObserved=${r.canvasParentRequestObserved}`,
      `parentRequestLawful=${r.parentRequestLawful}`,
      `canvasParentReleaseObserved=${r.canvasParentReleaseObserved}`,
      `canvasParentReleaseAccepted=${r.canvasParentReleaseAccepted}`,
      `parentReleaseLawful=${r.parentReleaseLawful}`,
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `canvasReleasePacketReady=${r.canvasReleasePacketReady}`,
      `canvasReleaseRequiresWestAudit=${r.canvasReleaseRequiresWestAudit}`,
      `canvasReleaseRequiresMacroWest=${r.canvasReleaseRequiresMacroWest}`,
      `canvasReleaseHeldReason=${r.canvasReleaseHeldReason}`,
      "",
      "F13",
      `allCanvasChildrenApiReady=${r.allCanvasChildrenApiReady}`,
      `allCanvasChildrenEvidenceReady=${r.allCanvasChildrenEvidenceReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `f13ProofBodyAvailable=${r.f13ProofBodyAvailable}`,
      `f13CanvasReadinessObserved=${r.f13CanvasReadinessObserved}`,
      `f13VisibleEvidenceAvailable=${r.f13VisibleEvidenceAvailable}`,
      `f13InspectEvidenceAvailable=${r.f13InspectEvidenceAvailable}`,
      `f13CanvasEvidenceStrict=${r.f13CanvasEvidenceStrict}`,
      `f13CanvasEvidenceDegraded=${r.f13CanvasEvidenceDegraded}`,
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13HardFail=${r.f13HardFail}`,
      `f13StrictEvidenceGap=${r.f13StrictEvidenceGap}`,
      `f13StrictEvidenceRepairTarget=${r.f13StrictEvidenceRepairTarget}`,
      "",
      "NEWS",
      `indexGateReady=${r.indexGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `newsAlignmentProtocolActive=${r.newsAlignmentProtocolActive}`,
      `newsFinalizedByCanvasParent=${r.newsFinalizedByCanvasParent}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      "",
      "FIBONACCI_SYNCHRONIZATION",
      `fibonacciSynchronizationMetricActive=${r.fibonacciSynchronizationMetricActive}`,
      `fibonacciSynchronizationScore=${r.fibonacciSynchronizationScore}`,
      `fibonacciSynchronizationSatisfied=${r.fibonacciSynchronizationSatisfied}`,
      `fibonacciSynchronizationExpected=${r.fibonacciSynchronizationExpected}`,
      `fibonacciSynchronizationPassed=${r.fibonacciSynchronizationPassed}`,
      `fibonacciSynchronizationDegraded=${r.fibonacciSynchronizationDegraded}`,
      "",
      "F21_BOUNDARY",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21EligibilitySubmittedToNorth=${r.f21EligibilitySubmittedToNorth}`,
      `f21LatchMode=${r.f21LatchMode}`,
      `completionLatched=${r.completionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `f21ClaimedByCanvasParent=${r.f21ClaimedByCanvasParent}`,
      `readyTextClaimedByCanvasParent=${r.readyTextClaimedByCanvasParent}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `canvasNextAuditTarget=${r.canvasNextAuditTarget}`,
      `postgameStatus=${r.postgameStatus}`,
      "",
      "DIAGNOSTIC_UI",
      `receiptVisible=${r.receiptVisible}`,
      `receiptExpanded=${r.receiptExpanded}`,
      `diagnosticExportCopyable=${r.diagnosticExportCopyable}`,
      "",
      "LOCAL_EVENTS",
      localEvents,
      "",
      "ERRORS",
      errors,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `lastAuditAt=${r.lastAuditAt}`,
      `lastBootAt=${r.lastBootAt}`,
      `lastCarrierReadAt=${r.lastCarrierReadAt}`,
      `lastReleaseAt=${r.lastReleaseAt}`,
      `lastEastCallAt=${r.lastEastCallAt}`,
      `publishedAt=${r.publishedAt}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function setReceiptVisible(value = true) {
    state.receiptVisible = safeBool(value, true);
    updateDataset();
    return getReceiptLight();
  }

  function toggleReceiptVisibility() {
    state.receiptVisible = !state.receiptVisible;
    updateDataset();
    return getReceiptLight();
  }

  function setReceiptExpanded(value = true) {
    state.receiptExpanded = safeBool(value, true);
    updateDataset();
    return getReceiptLight();
  }

  function toggleReceiptExpanded() {
    state.receiptExpanded = !state.receiptExpanded;
    updateDataset();
    return getReceiptLight();
  }

  function copyDiagnosticExport() {
    const text = getDiagnosticExport();

    if (root.navigator && root.navigator.clipboard && isFunction(root.navigator.clipboard.writeText)) {
      return root.navigator.clipboard.writeText(text)
        .then(() => {
          recordEvent("DIAGNOSTIC_EXPORT_COPIED", { method: "navigator.clipboard" });
          return { copied: true, method: "navigator.clipboard", text };
        })
        .catch((error) => {
          recordError("DIAGNOSTIC_EXPORT_COPY_FAILED", error);
          return { copied: false, method: "navigator.clipboard", error: String(error), text };
        });
    }

    recordEvent("DIAGNOSTIC_EXPORT_COPY_RETURNED_TEXT", { method: "return-text" });
    return { copied: false, method: "return-text", text };
  }

  function installDiagnosticPanel() {
    if (!doc || !doc.documentElement) return false;

    const panel =
      doc.querySelector("[data-hearth-canvas-receipt-panel]") ||
      doc.querySelector("#hearth-canvas-receipt-panel") ||
      doc.querySelector("[data-hearth-receipt-panel]");

    if (!panel) {
      state.diagnosticPanelInstalled = false;
      return false;
    }

    const render = () => {
      const text = state.receiptExpanded ? getReceiptText() : JSON.stringify(getReceiptLight(), null, 2);
      panel.textContent = state.receiptVisible ? text : "";
      panel.setAttribute("data-hearth-canvas-receipt-visible", String(state.receiptVisible));
      panel.setAttribute("data-hearth-canvas-receipt-expanded", String(state.receiptExpanded));
    };

    const visibleToggle =
      doc.querySelector("[data-hearth-canvas-receipt-toggle]") ||
      doc.querySelector("[data-hearth-receipt-toggle]");

    const expandedToggle =
      doc.querySelector("[data-hearth-canvas-receipt-expand]") ||
      doc.querySelector("[data-hearth-receipt-expand]");

    const copyButton =
      doc.querySelector("[data-hearth-canvas-receipt-copy]") ||
      doc.querySelector("[data-hearth-receipt-copy]");

    if (visibleToggle && !visibleToggle.__hearthCanvasParentV8Bound) {
      visibleToggle.__hearthCanvasParentV8Bound = true;
      visibleToggle.addEventListener("click", () => {
        toggleReceiptVisibility();
        render();
      });
    }

    if (expandedToggle && !expandedToggle.__hearthCanvasParentV8Bound) {
      expandedToggle.__hearthCanvasParentV8Bound = true;
      expandedToggle.addEventListener("click", () => {
        toggleReceiptExpanded();
        render();
      });
    }

    if (copyButton && !copyButton.__hearthCanvasParentV8Bound) {
      copyButton.__hearthCanvasParentV8Bound = true;
      copyButton.addEventListener("click", () => {
        copyDiagnosticExport();
      });
    }

    state.diagnosticPanelInstalled = true;
    render();

    return true;
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasParentMarkerPresent", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasVersion", VERSION);
    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasRole", state.role);

    setDataset("hearthCanvasParentV8Active", "true");
    setDataset("hearthCanvasParentV7Compatible", "true");
    setDataset("hearthCanvasParentV6Compatible", "true");
    setDataset("hearthCanvasParentV2Observed", "false");
    setDataset("hearthCanvasV2Observed", "false");
    setDataset("canvasParentV2Observed", "false");
    setDataset("hearthCanvasParentStaleV2Retired", "true");

    setDataset("hearthCanvasRouteConductorReleasePacketIntakeActive", "true");
    setDataset("hearthCanvasRouteConductorReleasePacketPrimary", "true");
    setDataset("hearthCanvasLocalWestReleaseFallbackActive", "true");
    setDataset("hearthCanvasLocalWestReleaseUsed", state.localWestReleaseUsed);
    setDataset("hearthCanvasAcceptedReleaseSource", state.acceptedReleaseSource);

    setDataset("hearthCanvasUpstreamReleasePacketObserved", state.upstreamReleasePacketObserved);
    setDataset("hearthCanvasUpstreamReleasePacketReady", state.upstreamReleasePacketReady);
    setDataset("hearthCanvasUpstreamReleaseAccepted", state.upstreamReleaseAccepted);
    setDataset("hearthCanvasUpstreamReleaseRejectedReason", state.upstreamReleaseRejectedReason);
    setDataset("hearthCanvasUpstreamRouteConductorContract", state.upstreamRouteConductorContract);
    setDataset("hearthCanvasUpstreamRouteConductorReceipt", state.upstreamRouteConductorReceipt);
    setDataset("hearthCanvasUpstreamCanvasReleaseAuthorized", state.upstreamCanvasReleaseAuthorized);
    setDataset("hearthCanvasUpstreamWestCanvasReleaseApproved", state.upstreamWestCanvasReleaseApproved);
    setDataset("hearthCanvasUpstreamWestForwardAllowed", state.upstreamWestForwardAllowed);
    setDataset("hearthCanvasUpstreamWestHardBlock", state.upstreamWestHardBlock);
    setDataset("hearthCanvasUpstreamCarrierHostAdmissibilityReady", state.upstreamCarrierHostAdmissibilityReady);
    setDataset("hearthCanvasUpstreamCarrierHostAdmissibilityPacketReady", state.upstreamCarrierHostAdmissibilityPacketReady);
    setDataset("hearthCanvasUpstreamIndexPairReady", state.upstreamIndexPairReady);
    setDataset("hearthCanvasUpstreamIndexMacroWestCandidateReady", state.upstreamIndexMacroWestCandidateReady);
    setDataset("hearthCanvasUpstreamHandoffToCanvas", state.upstreamHandoffToCanvas);
    setDataset("hearthCanvasUpstreamDestinationIsCanvas", state.upstreamDestinationIsCanvas);

    setDataset("hearthCanvasStructuralCarrierActive", "true");
    setDataset("hearthCanvasStructuralCarrierPublished", state.structuralCarrierPublished);
    setDataset("hearthCanvasStructuralCarrierReady", "true");
    setDataset("hearthCanvasStructuralCarrierSafe", "true");
    setDataset("hearthCanvasParentCarrierSafe", "true");
    setDataset("canvasParentCarrierSafe", "true");
    setDataset("hearthCanvasParentCarrierSafeIsNotMacroWestPrerequisite", "true");
    setDataset("hearthCanvasCarrierPrecheckReady", "true");
    setDataset("hearthCanvasMacroWestPrecheckCarrierReady", "true");
    setDataset("hearthCanvasParentBootMethodAvailable", "true");
    setDataset("hearthCanvasBootMethodAvailable", "true");
    setDataset("hearthCanvasMountMethodAvailable", "true");
    setDataset("hearthCanvasInitMethodAvailable", "true");
    setDataset("hearthCanvasStartMethodAvailable", "true");
    setDataset("hearthCanvasGetStructuralCarrierAvailable", "true");
    setDataset("hearthCanvasReadStructuralCarrierAvailable", "true");
    setDataset("hearthCanvasGetCanvasCarrierAvailable", "true");
    setDataset("hearthCanvasGetCarrierReceiptAvailable", "true");

    setDataset("hearthCanvasEastV5SynchronousHeldPacketConsumptionActive", "true");
    setDataset("hearthCanvasParentChildReconciliationActive", "true");
    setDataset("hearthCanvasParentReleasePacketComposerActive", "true");

    setDataset("hearthCanvasCycleNumber", state.cycleNumber);
    setDataset("hearthCanvasCycleRoute", state.cycleRoute);
    setDataset("hearthCanvasActiveFibonacci", state.activeFibonacci);
    setDataset("hearthCanvasActiveFibonacciRank", state.activeFibonacciRank);
    setDataset("hearthCanvasEastActiveFibonacci", state.eastActiveFibonacci);
    setDataset("hearthCanvasWestActiveFibonacci", state.westActiveFibonacci);
    setDataset("hearthCanvasSouthActiveFibonacci", state.southActiveFibonacci);
    setDataset("hearthCanvasFutureFibonacci", state.futureFibonacci);
    setDataset("hearthCanvasActiveStageId", state.activeStageId);
    setDataset("hearthCanvasActiveGearId", state.activeGearId);

    setDataset("hearthCanvasParentReleasePacketSentToEast", state.parentReleasePacketSentToEast);
    setDataset("hearthCanvasParentReleasePacketLawful", state.parentReleasePacketLawful);
    setDataset("hearthCanvasParentWestReleaseIncluded", state.parentWestReleaseIncluded);
    setDataset("hearthCanvasParentCurrentContractIncluded", state.parentCurrentContractIncluded);
    setDataset("hearthCanvasParentEastBuildAtlasCalled", state.parentEastBuildAtlasCalled);
    setDataset("hearthCanvasParentEastBuildAtlasResultClass", state.parentEastBuildAtlasResultClass);

    setDataset("hearthCanvasEastObserved", state.canvasEastObserved);
    setDataset("hearthCanvasEastRequiredContractObserved", state.canvasEastRequiredContractObserved);
    setDataset("hearthCanvasEastApiReady", state.canvasEastApiReady);
    setDataset("hearthCanvasEastApiMissing", state.canvasEastApiMissing);
    setDataset("hearthCanvasEastStatus", state.canvasEastStatus);
    setDataset("hearthCanvasEastEvidenceReady", state.canvasEastEvidenceReady);
    setDataset("hearthCanvasEastHeldPacketRecognized", state.canvasEastHeldPacketRecognized);
    setDataset("hearthCanvasEastHeldPacketWasSynchronous", state.canvasEastHeldPacketWasSynchronous);
    setDataset("hearthCanvasEastBuildAtlasReturnedPromise", state.canvasEastBuildAtlasReturnedPromise);
    setDataset("hearthCanvasEastF13AtlasPacketReady", state.canvasEastF13AtlasPacketReady);
    setDataset("hearthCanvasEastAtlasBuildComplete", state.canvasEastAtlasBuildComplete);
    setDataset("hearthCanvasEastAtlasCanvasPresent", state.canvasEastAtlasCanvasPresent);
    setDataset("hearthCanvasEastFalsePromotionBlocked", state.canvasEastFalsePromotionBlocked);
    setDataset("hearthCanvasEastFirstFailedCoordinate", state.canvasEastFirstFailedCoordinate);
    setDataset("hearthCanvasEastRecommendedNextRenewalTarget", state.canvasEastRecommendedNextRenewalTarget);

    setDataset("hearthCanvasWestObserved", state.canvasWestObserved);
    setDataset("hearthCanvasWestApiReady", state.canvasWestApiReady);
    setDataset("hearthCanvasWestInspectionReady", state.canvasWestInspectionReady);
    setDataset("hearthCanvasWestEvidenceReady", state.canvasWestEvidenceReady);
    setDataset("hearthCanvasWestStatus", state.canvasWestStatus);
    setDataset("hearthCanvasWestAuditObserved", state.westAuditObserved);
    setDataset("hearthCanvasWestAuditAccepted", state.westAuditAccepted);
    setDataset("hearthCanvasWestAuditDegraded", state.westAuditDegraded);
    setDataset("hearthCanvasWestHardBlock", state.westHardBlock);
    setDataset("hearthCanvasWestReleaseApproved", state.westCanvasReleaseApproved);
    setDataset("hearthCanvasWestForwardAllowed", state.westForwardAllowed);
    setDataset("hearthCanvasWestDecision", state.westDecision);
    setDataset("hearthCanvasWestGapClass", state.westGapClass);

    setDataset("hearthCanvasSouthObserved", state.canvasSouthObserved);
    setDataset("hearthCanvasSouthApiReady", state.canvasSouthApiReady);
    setDataset("hearthCanvasSouthVisibleProofReady", state.canvasSouthVisibleProofReady);
    setDataset("hearthCanvasSouthSoftProofReady", state.canvasSouthSoftProofReady);
    setDataset("hearthCanvasSouthHardFail", state.canvasSouthHardFail);
    setDataset("hearthCanvasSouthProofStale", state.canvasSouthProofStale);
    setDataset("hearthCanvasSouthStatus", state.canvasSouthStatus);

    setDataset("hearthCanvasMaterialAuthorityObserved", state.materialAuthorityObserved);
    setDataset("hearthCanvasMaterialContract", state.materialContract);
    setDataset("hearthCanvasMaterialReceipt", state.materialReceipt);
    setDataset("hearthCanvasMaterialContractMatchesExpected", state.materialContractMatchesExpected);
    setDataset("hearthCanvasMaterialReceiptMatchesExpected", state.materialReceiptMatchesExpected);

    setDataset("hearthCanvasAllChildrenApiReady", state.allCanvasChildrenApiReady);
    setDataset("hearthCanvasAllChildrenEvidenceReady", state.allCanvasChildrenEvidenceReady);
    setDataset("hearthCanvasAllChildrenReady", state.allCanvasChildrenReady);

    setDataset("hearthCanvasParentRequestObserved", "true");
    setDataset("hearthCanvasParentRequestLawful", "true");
    setDataset("hearthCanvasParentReleaseObserved", state.canvasParentReleaseObserved);
    setDataset("hearthCanvasParentReleaseAccepted", state.canvasParentReleaseAccepted);
    setDataset("hearthCanvasParentReleaseLawful", state.parentReleaseLawful);
    setDataset("hearthCanvasReleaseAuthorized", state.canvasReleaseAuthorized);
    setDataset("hearthCanvasReleasePacketReady", state.canvasReleasePacketReady);
    setDataset("hearthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthCanvasF13ProofBodyAvailable", state.f13ProofBodyAvailable);
    setDataset("hearthCanvasF13ReadinessObserved", state.f13CanvasReadinessObserved);
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", state.f13VisibleEvidenceAvailable);
    setDataset("hearthCanvasF13InspectEvidenceAvailable", state.f13InspectEvidenceAvailable);
    setDataset("hearthCanvasF13EvidenceStrict", state.f13CanvasEvidenceStrict);
    setDataset("hearthCanvasF13EvidenceDegraded", state.f13CanvasEvidenceDegraded);
    setDataset("hearthCanvasF13EvidenceComplete", state.f13CanvasEvidenceComplete);
    setDataset("hearthCanvasF13HardFail", state.f13HardFail);
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasGateReady", state.canvasGateReady);
    setDataset("hearthCanvasIndexGateReady", state.indexGateReady);
    setDataset("hearthCanvasNorthGateReady", state.northGateReady);
    setDataset("hearthCanvasEastGateReady", state.eastGateReady);
    setDataset("hearthCanvasWestGateReady", state.westGateReady);
    setDataset("hearthCanvasSouthGateReady", state.southGateReady);
    setDataset("hearthCanvasNewsGatePassedBeforeF21", state.newsGatePassedBeforeF21);
    setDataset("hearthCanvasNewsGateDegradedBeforeF21", state.newsGateDegradedBeforeF21);

    setDataset("hearthCanvasFibonacciSynchronizationMetricActive", state.fibonacciSynchronizationMetricActive);
    setDataset("hearthCanvasFibonacciSynchronizationScore", state.fibonacciSynchronizationScore);
    setDataset("hearthCanvasFibonacciSynchronizationSatisfied", state.fibonacciSynchronizationSatisfied);
    setDataset("hearthCanvasFibonacciSynchronizationExpected", state.fibonacciSynchronizationExpected);
    setDataset("hearthCanvasFibonacciSynchronizationPassed", state.fibonacciSynchronizationPassed);
    setDataset("hearthCanvasFibonacciSynchronizationDegraded", state.fibonacciSynchronizationDegraded);

    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21EligibilitySubmittedToNorth", "false");
    setDataset("hearthCanvasF21LatchMode", state.f21LatchMode);
    setDataset("hearthCanvasCompletionLatched", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasF21ClaimedByCanvasParent", "false");

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasNextAuditTarget", state.canvasNextAuditTarget);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasReceiptVisible", state.receiptVisible);
    setDataset("hearthCanvasReceiptExpanded", state.receiptExpanded);
    setDataset("hearthCanvasDiagnosticExportCopyable", "true");

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvas = api;
    root.HEARTH.canvasParent = api;
    root.HEARTH.canvasNorth = api;
    root.HEARTH.canvasEvidence = api;
    root.HEARTH.canvasParentRouteConductorReleasePacketIntakeEastV5Handoff = api;
    root.HEARTH.canvasParentStructuralCarrierBootMethodEastV5Consumption = api;
    root.HEARTH.canvasParentStructuralCarrier = api;
    root.HEARTH.canvasParentEastV5SynchronousHeldPacketConsumption = api;
    root.HEARTH.canvasParentCurrentSouthProofReconciliation = api;
    root.HEARTH.canvasParentGovernedF13EvidenceReceiver = api;
    root.HEARTH.canvasParentPreReleaseStructuralCarrierThenWestReleaseToEast = api;
    root.HEARTH.canvasSplitAdapter = api;
    root.HEARTH.canvasTransistorGate = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_NORTH = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF = api;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION = api;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER = api;
    root.HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION = api;
    root.HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION = api;
    root.HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER = api;
    root.HEARTH_CANVAS_PARENT_PRE_RELEASE_STRUCTURAL_CARRIER_THEN_WEST_RELEASE_TO_EAST = api;
    root.HEARTH_CANVAS_SPLIT_ADAPTER = api;
    root.HEARTH_CANVAS_TRANSISTOR_GATE = api;

    root.DEXTER_LAB.hearthCanvas = api;
    root.DEXTER_LAB.hearthCanvasParent = api;
    root.DEXTER_LAB.hearthCanvasNorth = api;
    root.DEXTER_LAB.hearthCanvasEvidence = api;
    root.DEXTER_LAB.hearthCanvasParentRouteConductorReleasePacketIntakeEastV5Handoff = api;
    root.DEXTER_LAB.hearthCanvasParentStructuralCarrierBootMethodEastV5Consumption = api;
    root.DEXTER_LAB.hearthCanvasParentStructuralCarrier = api;
    root.DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumption = api;
    root.DEXTER_LAB.hearthCanvasParentCurrentSouthProofReconciliation = api;
    root.DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver = api;
    root.DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast = api;

    const receipt = getReceiptLight();
    const carrier = composeStructuralCarrier({ reason: "publishGlobals" });

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_EVIDENCE_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_EAST_V5_HANDOFF_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_BOOT_METHOD_EAST_V5_CONSUMPTION_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_STRUCTURAL_CARRIER_RECEIPT = carrier;
    root.HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_RECEIPT = receipt;

    root.HEARTH.canvasReceipt = receipt;
    root.HEARTH.canvasParentReceipt = receipt;
    root.HEARTH.canvasEvidenceReceipt = receipt;
    root.HEARTH.canvasParentRouteConductorReleasePacketIntakeEastV5HandoffReceipt = receipt;
    root.HEARTH.canvasParentStructuralCarrierBootMethodEastV5ConsumptionReceipt = receipt;
    root.HEARTH.canvasParentStructuralCarrierReceipt = carrier;
    root.HEARTH.canvasParentEastV5SynchronousHeldPacketConsumptionReceipt = receipt;

    root.DEXTER_LAB.hearthCanvasReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEvidenceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentRouteConductorReleasePacketIntakeEastV5HandoffReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentStructuralCarrierBootMethodEastV5ConsumptionReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentStructuralCarrierReceipt = carrier;
    root.DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumptionReceipt = receipt;

    root.__HEARTH_CANVAS_LOADED__ = true;
    root.__HEARTH_CANVAS_FILE__ = FILE;
    root.__HEARTH_CANVAS_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_PARENT_V8_ACTIVE__ = true;
    root.__HEARTH_CANVAS_PARENT_V7_COMPATIBLE__ = true;
    root.__HEARTH_CANVAS_PARENT_V2_OBSERVED__ = false;
    root.__HEARTH_CANVAS_PARENT_CARRIER_SAFE__ = true;
    root.__HEARTH_CANVAS_PARENT_BOOT_METHOD_AVAILABLE__ = true;
    root.__HEARTH_CANVAS_STRUCTURAL_CARRIER_READY__ = true;
    root.__HEARTH_CANVAS_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE__ = true;
    root.__HEARTH_CANVAS_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION__ = true;
    root.__HEARTH_CANVAS_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_READY_TEXT_ALLOWED__ = false;
    root.__HEARTH_CANVAS_VISUAL_PASS_CLAIMED__ = false;

    state.structuralCarrierPublished = true;
    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    updateDataset();
  }

  function bootAudit() {
    state.updatedAt = nowIso();

    consumeReleaseFromOptions({}, "bootAudit-global-route-conductor");

    publishGlobals();
    updateDataset();
    installDiagnosticPanel();

    scanMaterialAuthority();
    scanEastAuthority();
    scanWestAuthority();
    scanSouthAuthority();
    recomputeParentState();
    composeStructuralCarrier({ reason: "bootAudit-initial-carrier" });

    recordEvent("CANVAS_PARENT_V8_ROUTE_CONDUCTOR_RELEASE_PACKET_INTAKE_LOADED", {
      contract: CONTRACT,
      receipt: RECEIPT,
      upstreamRouteConductorRequiredContract: UPSTREAM_ROUTE_CONDUCTOR_CONTRACT,
      eastRequiredContract: EAST_REQUIRED_CONTRACT,
      materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
      routeReleasePacketObserved: state.upstreamReleasePacketObserved,
      routeReleaseAccepted: state.upstreamReleaseAccepted,
      canvasParentCarrierSafe: true,
      canvasParentBootMethodAvailable: true,
      canvasParentV2Observed: false,
      visualPassClaimed: false
    });

    const run = () => {
      try {
        auditChildren({
          callEast: true,
          async: true,
          nonBlocking: true,
          width: 512,
          height: 256,
          releasePacket: state.upstreamReleasePacket
        });
      } catch (error) {
        recordError("BOOT_AUDIT_FAILED", error);
        recomputeParentState();
      }
    };

    if (isFunction(root.requestAnimationFrame)) {
      root.requestAnimationFrame(() => run());
    } else if (isFunction(root.setTimeout)) {
      root.setTimeout(run, 0);
    } else {
      run();
    }

    if (isFunction(root.setTimeout)) {
      root.setTimeout(() => {
        try {
          consumeReleaseFromOptions({}, "post-boot-rescan-global-route-conductor");
          scanEastAuthority();
          scanWestAuthority();
          scanSouthAuthority();
          recomputeParentState();
          publishGlobals();
        } catch (error) {
          recordError("POST_BOOT_RESCAN_FAILED", error);
        }
      }, 80);

      root.setTimeout(() => {
        try {
          consumeReleaseFromOptions({}, "post-boot-rescan-late-global-route-conductor");
          scanEastAuthority();
          scanWestAuthority();
          scanSouthAuthority();
          recomputeParentState();
          publishGlobals();
        } catch (error) {
          recordError("POST_BOOT_RESCAN_LATE_FAILED", error);
        }
      }, 300);
    }
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    upstreamRouteConductorRequiredContract: UPSTREAM_ROUTE_CONDUCTOR_CONTRACT,
    upstreamRouteConductorRequiredReceipt: UPSTREAM_ROUTE_CONDUCTOR_RECEIPT,
    eastRequiredContract: EAST_REQUIRED_CONTRACT,
    eastRequiredReceipt: EAST_REQUIRED_RECEIPT,
    materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
    materialRequiredReceipt: MATERIAL_REQUIRED_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    EAST_RESULT_CLASS,
    CHILD_STATUS,
    RELEASE_SOURCE,

    boot,
    init,
    start,
    mount,
    composeStructuralCarrier,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,

    consumeRouteReleasePacket,
    consumeReleaseFromOptions,
    readGlobalRouteConductorPacket,
    resolveAcceptedRelease,

    auditChildren,
    scanMaterialAuthority,
    scanEastAuthority,
    scanWestAuthority,
    scanSouthAuthority,
    composeParentReleasePacket,
    callEastBuildAtlas,
    classifyEastPacket,
    applyEastPacket,
    receiveEastPacket,
    receiveWestPacket,
    receiveSouthPacket,
    receiveChildPacket,
    recomputeParentState,
    computeFibonacciSynchronization,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getDiagnosticExport,
    copyDiagnosticExport,
    setReceiptVisible,
    toggleReceiptVisibility,
    setReceiptExpanded,
    toggleReceiptExpanded,
    installDiagnosticPanel,

    canvasParentActive: true,
    canvasParentV8Active: true,
    canvasParentV7Compatible: true,
    canvasParentV6Compatible: true,
    canvasParentV2Observed: false,
    hearthCanvasParentV2Observed: false,
    staleParentV2Retired: true,

    routeConductorReleasePacketIntakeActive: true,
    routeConductorReleasePacketPrimary: true,
    localWestReleaseFallbackActive: true,

    structuralCarrierActive: true,
    structuralCarrierReady: true,
    structuralCarrierSafe: true,
    canvasParentCarrierSafe: true,
    carrierPrecheckReady: true,
    macroWestPrecheckCarrierReady: true,
    parentCarrierSafeIsNotMacroWestPrerequisite: true,
    canvasParentBootMethodAvailable: true,
    bootMethodAvailable: true,
    mountMethodAvailable: true,
    initMethodAvailable: true,
    startMethodAvailable: true,
    getStructuralCarrierAvailable: true,
    readStructuralCarrierAvailable: true,
    getCanvasCarrierAvailable: true,
    getCarrierReceiptAvailable: true,

    eastV5SynchronousHeldPacketConsumptionActive: true,
    canvasParentChildReconciliationActive: true,
    parentReleasePacketComposerActive: true,
    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationMetricActive: true,

    ownsCanvasParentStructuralCarrier: true,
    ownsCanvasParentBootMethodAliases: true,
    ownsRouteConductorReleasePacketIntake: true,
    ownsParentReleaseAcceptance: true,
    ownsCanvasParentCoordination: true,
    ownsChildApiRecognition: true,
    ownsChildPacketIntake: true,
    ownsF13EvidenceClassification: true,
    ownsParentReleasePacketCompositionToEast: true,
    ownsEastSynchronousHeldPacketInterpretation: true,
    ownsCanvasParentReceipt: true,

    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsEastAtlasSourceTruth: false,
    ownsWestAdmissibilityTruth: false,
    ownsSouthVisibleProofTruth: false,
    ownsRouteOrchestration: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    f21EligibleForNorth: false,
    f21ClaimedByCanvasParent: false,
    readyTextClaimedByCanvasParent: false,
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
    bootAudit();
  } catch (error) {
    recordError("CANVAS_PARENT_V8_INITIALIZATION_FAILED", error);

    try {
      publishGlobals();
      updateDataset();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
