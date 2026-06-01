// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_TNT_v6
// Full-file replacement.
// Canvas parent / child-coordination authority only.
// Purpose:
// - Renew the Canvas parent so it correctly consumes Canvas East v5:
//   HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_TNT_v5.
// - Distinguish East API readiness from East F13 atlas evidence readiness.
// - Treat East v5 synchronous held packets as lawful held evidence, not API failure.
// - Compose and send lawful parent release packets to East after Macro West / parent release is observed.
// - Preserve East / West / South child separation.
// - Preserve F13 parent coordination while blocking F21, ready text, and final visual-pass claims.
// - Preserve receipt visibility, expanded diagnostic export, and copyable receipt support.
// Owns:
// - Canvas parent coordination.
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

  const CONTRACT = "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_TNT_v6";
  const RECEIPT = "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_RECEIPT_v6";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_TNT_v5";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_RECEIPT_v5";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_TNT_v5";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_RECEIPT_v5";

  const EAST_REQUIRED_CONTRACT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_TNT_v5";
  const EAST_REQUIRED_RECEIPT = "HEARTH_CANVAS_EAST_SYNCHRONOUS_HELD_PACKET_PARENT_FIRST_F13_ATLAS_SOURCE_RECEIPT_v5";

  const MATERIAL_REQUIRED_CONTRACT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_TNT_v1";
  const MATERIAL_REQUIRED_RECEIPT = "HEARTH_MATERIALS_MOUNTAIN_RANGE_CANYON_RELIEF_CONSUMER_RECEIPT_v1";

  const VERSION = "2026-06-01.hearth-canvas-parent-east-v5-synchronous-held-packet-consumption-v6";
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

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    eastRequiredContract: EAST_REQUIRED_CONTRACT,
    eastRequiredReceipt: EAST_REQUIRED_RECEIPT,
    materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
    materialRequiredReceipt: MATERIAL_REQUIRED_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "hearth-canvas-parent-east-v5-synchronous-held-packet-consumption",

    canvasParentActive: true,
    canvasParentV6Active: true,
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
    activeStageId: "F13P_CANVAS_PARENT_EAST_V5_CONSUMPTION",
    activeGearId: "F13P_CANVAS_PARENT_EAST_V5_CONSUMPTION",
    activeNewsGate: "CANVAS",
    oneActiveGearAtATime: true,

    newsAlignmentProtocolActive: true,
    newsFinalizedByCanvasParent: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: false,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,

    fibonacciSynchronizationMetricActive: true,
    fibonacciSynchronizationScore: 0,
    fibonacciSynchronizationSatisfied: 0,
    fibonacciSynchronizationExpected: 7,
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
    canvasReleaseHeldReason: "WAITING_MACRO_WEST_RELEASE",
    lastReleasePacket: null,

    f13ProofBodyAvailable: false,
    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13InspectEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "WAITING_CANVAS_EAST_API",
    f13StrictEvidenceRepairTarget: EAST_FILE,

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

    firstFailedCoordinate: "WAITING_CANVAS_EAST_API",
    recommendedNextFile: EAST_FILE,
    recommendedNextRenewalTarget: EAST_FILE,
    canvasNextAuditTarget: ASSETS_FILE,
    postgameStatus: "CANVAS_PARENT_ACTIVE_WAITING_EAST_API",

    receiptVisible: true,
    receiptExpanded: false,
    diagnosticExportCopyable: true,
    diagnosticPanelInstalled: false,

    lastAuditAt: "",
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

  function clamp(value, min, max) {
    const n = safeNumber(value, min);
    return Math.max(min, Math.min(max, n));
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

  function pathRead(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
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

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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
        if (isObject(receipt)) return receipt;
      } catch (_error) {}
    }

    if (isFunction(authority.getStatus)) {
      try {
        const receipt = authority.getStatus();
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

    if (authority.contract || authority.receipt || authority.version) return authority;

    return null;
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

  function hasRequiredEastMethods(authority) {
    return Boolean(
      authority &&
      isFunction(authority.buildAtlas) &&
      isFunction(authority.sample) &&
      isFunction(authority.read) &&
      isFunction(authority.getReceipt)
    );
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
      datasetValue("hearthCanvasWestDecision", "")
    );

    const gapClass = firstString(
      receipt.gapClass,
      receipt.westGapClass,
      datasetValue("westGapClass", ""),
      datasetValue("hearthCanvasWestGapClass", "")
    );

    const hardBlock = firstBool(
      false,
      receipt.hardBlock,
      receipt.westHardBlock,
      receipt.westAuditBlocked,
      datasetValue("westHardBlock", ""),
      datasetValue("hearthCanvasWestAuditBlocked", "")
    );

    const auditObserved = firstBool(
      Boolean(apiReady),
      receipt.westAuditObserved,
      receipt.macroWestAuthorityObserved,
      receipt.macroWestAdmissibilityObserved,
      receipt.gapAssessed,
      receipt.westReviewRecommended,
      datasetValue("macroWestAuthorityObserved", ""),
      datasetValue("macroWestAdmissibilityObserved", ""),
      datasetValue("hearthCanvasWestAuditObserved", "")
    );

    const auditAccepted = firstBool(
      false,
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
      datasetValue("hearthCanvasWestReleaseApproved", "")
    );

    const auditDegraded = firstBool(
      false,
      receipt.westAuditDegraded,
      receipt.canDegradeForward,
      receipt.westDegradedForwardApproved,
      decision === "DEGRADED_FORWARD",
      datasetValue("westDegradedForwardApproved", ""),
      datasetValue("hearthCanvasWestAuditDegraded", "")
    );

    const releaseApproved = firstBool(
      false,
      receipt.westCanvasReleaseApproved,
      receipt.canvasReleaseApprovedByWest,
      receipt.canvasReleaseAuthorized,
      receipt.releaseToCanvas,
      receipt.handoffTo === "CANVAS",
      receipt.destination === "CANVAS",
      auditAccepted,
      datasetValue("westCanvasReleaseApproved", ""),
      datasetValue("canvasReleaseAuthorized", ""),
      datasetValue("hearthCanvasReleaseAuthorized", "")
    );

    state.canvasWestObserved = Boolean(west || receipt.contract);
    state.canvasWestApiReady = apiReady;
    state.westAuditObserved = auditObserved;
    state.westAuditAccepted = Boolean(auditAccepted && !hardBlock);
    state.westAuditDegraded = Boolean(auditDegraded && !hardBlock);
    state.westHardBlock = hardBlock;
    state.westCanvasReleaseApproved = Boolean(releaseApproved && !hardBlock);
    state.westDecision = decision;
    state.westGapClass = gapClass;
    state.westFirstFailedCoordinate = firstString(
      receipt.firstFailedCoordinate,
      receipt.westFirstFailedCoordinate,
      datasetValue("westFirstFailedCoordinate", "")
    );
    state.canvasWestInspectionReady = Boolean(state.westAuditAccepted || state.westAuditDegraded || state.westCanvasReleaseApproved);
    state.canvasWestEvidenceReady = state.canvasWestInspectionReady;
    state.canvasWestStatus = state.canvasWestInspectionReady
      ? CHILD_STATUS.EVIDENCE_READY
      : apiReady
        ? CHILD_STATUS.API_READY
        : CHILD_STATUS.MISSING;
    state.canvasWestReceipt = clonePlain(receipt || null);

    return { authority: west, receipt, apiReady, releaseApproved: state.westCanvasReleaseApproved };
  }

  function scanSouthAuthority() {
    const south = getSouthAuthority();
    const receipt = readReceipt(south) || {};

    const apiReady = Boolean(south || receipt.contract);

    const strictProof = firstBool(
      false,
      receipt.visibleContentProof,
      receipt.visibleContentStrictProof,
      receipt.southStrictProofObserved,
      receipt.southVisibleProofReady,
      receipt.visibleProofReady,
      datasetValue("southStrictProofObserved", ""),
      datasetValue("canvasSouthVisibleProofReady", ""),
      datasetValue("hearthCanvasSouthVisibleProofReady", "")
    );

    const softProof = firstBool(
      false,
      receipt.visibleContentSoftGap,
      receipt.visibleForwardProgress,
      receipt.southSoftProofObserved,
      receipt.southSoftProofReady,
      receipt.degradedVisibleContentAccepted,
      datasetValue("southSoftProofObserved", ""),
      datasetValue("hearthCanvasSouthSoftProofReady", "")
    );

    const hardFail = firstBool(
      false,
      receipt.visibleContentHardFail,
      receipt.southHardFailObserved,
      receipt.f13HardFail,
      datasetValue("southHardFailObserved", ""),
      datasetValue("hearthCanvasSouthHardFail", "")
    );

    const stale = firstBool(
      false,
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

  function composeParentReleasePacket(input = {}) {
    const westReady = Boolean(state.westCanvasReleaseApproved && !state.westHardBlock);

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      parentContract: CONTRACT,
      parentReceipt: RECEIPT,
      activeParentContract: CONTRACT,
      activeParentReceipt: RECEIPT,
      file: FILE,
      parentFile: FILE,
      sourceFile: FILE,
      destinationFile: FILE,
      targetFile: EAST_FILE,
      requestedChild: "east",
      handoffTo: "EAST",
      returnTo: "CANVAS",
      receivedFrom: "CANVAS_PARENT",

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
      canvasParentReleaseObserved: westReady,
      parentRequestLawful: true,
      parentReleaseLawful: westReady,
      currentParentRecognized: true,
      parentCurrentContractIncluded: true,
      parentReleasePacketLawful: westReady,

      westReleaseObserved: state.westCanvasReleaseApproved,
      westAuditObserved: state.westAuditObserved,
      westAuditAccepted: state.westAuditAccepted,
      westAuditPassed: state.westAuditAccepted,
      westAuditDegraded: state.westAuditDegraded,
      westAuditBlocked: state.westHardBlock,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      canvasReleaseApprovedByWest: state.westCanvasReleaseApproved,
      canvasReleaseAuthorized: westReady,
      releaseToCanvas: westReady,

      atlasBuildRequested: true,
      f13AtlasBuildRequested: true,
      buildAtlasRequested: true,
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
      createdAt: nowIso()
    };

    state.lastReleasePacket = clonePlain(packet);
    state.parentReleasePacketSentToEast = true;
    state.parentWestReleaseIncluded = state.westCanvasReleaseApproved;
    state.parentCurrentContractIncluded = true;
    state.parentReleasePacketLawful = westReady;
    state.canvasReleaseAuthorized = westReady;
    state.canvasReleasePacketReady = true;
    state.canvasReleaseHeldReason = westReady ? "NONE_CANVAS_RELEASE_AUTHORIZED_BY_MACRO_WEST" : "WAITING_MACRO_WEST_RELEASE";
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
      safeBool(packet.buildAtlasReturnedPromise, false) === false && held
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
        firstFailedCoordinate: safeString(packet.f13BuildBlockedReason, "") || safeString(packet.firstFailedCoordinate, "WAITING_PARENT_WEST_RELEASE_TO_EAST"),
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
      state.f13StrictEvidenceGap = "WAITING_PARENT_WEST_RELEASE_TO_EAST";
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
      visualPassClaimed: false
    });

    recomputeParentState();
    return classification;
  }

  function callEastBuildAtlas(options = {}) {
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
        releasePacketLawful: state.parentReleasePacketLawful
      });

      recomputeParentState();

      return {
        accepted: false,
        resultClass: EAST_RESULT_CLASS.BUILD_ERROR,
        error: state.canvasEastLastError,
        firstFailedCoordinate: state.canvasEastFirstFailedCoordinate,
        recommendedNextRenewalTarget: EAST_FILE,
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

    state.westAuditObserved = firstBool(true, packet.westAuditObserved, packet.macroWestAdmissibilityObserved, packet.gapAssessed);
    state.westAuditAccepted = firstBool(false, packet.westAuditAccepted, packet.westAuditPassed, packet.forwardAllowed, packet.westForwardAllowed, packet.decision === "RELEASE_TO_CANVAS");
    state.westAuditDegraded = firstBool(false, packet.westAuditDegraded, packet.canDegradeForward, packet.westDegradedForwardApproved);
    state.westHardBlock = firstBool(false, packet.hardBlock, packet.westHardBlock, packet.westAuditBlocked);
    state.westCanvasReleaseApproved = firstBool(false, packet.westCanvasReleaseApproved, packet.canvasReleaseApprovedByWest, packet.canvasReleaseAuthorized, packet.releaseToCanvas);
    state.westDecision = firstString(packet.decision, packet.westDecision);
    state.westGapClass = firstString(packet.gapClass, packet.westGapClass);
    state.westFirstFailedCoordinate = firstString(packet.firstFailedCoordinate, packet.westFirstFailedCoordinate);
    state.canvasWestInspectionReady = Boolean((state.westAuditAccepted || state.westAuditDegraded || state.westCanvasReleaseApproved) && !state.westHardBlock);
    state.canvasWestEvidenceReady = state.canvasWestInspectionReady;
    state.canvasWestStatus = state.canvasWestInspectionReady ? CHILD_STATUS.EVIDENCE_READY : CHILD_STATUS.API_READY;

    recordEvent("CANVAS_PARENT_WEST_PACKET_RECEIVED", {
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,
      westHardBlock: state.westHardBlock
    });

    recomputeParentState();
    return getReceipt();
  }

  function receiveSouthPacket(packet = {}) {
    state.canvasSouthObserved = true;
    state.canvasSouthApiReady = true;
    state.canvasSouthReceipt = clonePlain(packet);

    state.canvasSouthVisibleProofReady = firstBool(false, packet.visibleContentProof, packet.visibleContentStrictProof, packet.southVisibleProofReady, packet.southStrictProofObserved);
    state.canvasSouthSoftProofReady = firstBool(false, packet.visibleContentSoftGap, packet.visibleForwardProgress, packet.southSoftProofReady, packet.southSoftProofObserved);
    state.canvasSouthHardFail = firstBool(false, packet.visibleContentHardFail, packet.southHardFailObserved, packet.f13HardFail);
    state.canvasSouthProofStale = firstBool(false, packet.southProofStale, packet.proofStale);

    state.canvasSouthStatus = state.canvasSouthHardFail
      ? CHILD_STATUS.BLOCKED
      : state.canvasSouthVisibleProofReady || state.canvasSouthSoftProofReady
        ? CHILD_STATUS.EVIDENCE_READY
        : CHILD_STATUS.API_READY;

    recordEvent("CANVAS_PARENT_SOUTH_PACKET_RECEIVED", {
      strictProof: state.canvasSouthVisibleProofReady,
      softProof: state.canvasSouthSoftProofReady,
      hardFail: state.canvasSouthHardFail,
      stale: state.canvasSouthProofStale
    });

    recomputeParentState();
    return getReceipt();
  }

  function computeFibonacciSynchronization() {
    const gates = [
      Boolean(state.activeFibonacci === ACTIVE_FIBONACCI),
      Boolean(state.canvasEastApiReady && !state.canvasEastApiMissing),
      Boolean(state.canvasEastHeldPacketRecognized || state.canvasEastF13AtlasPacketReady || state.canvasEastEvidenceReady),
      Boolean(state.westCanvasReleaseApproved || state.westAuditAccepted || state.westAuditDegraded),
      Boolean(state.canvasSouthVisibleProofReady || state.canvasSouthSoftProofReady || state.canvasSouthApiReady),
      Boolean(!state.f21ClaimedByCanvasParent && !state.f21EligibleForNorth),
      Boolean(!state.visualPassClaimed && !state.readyTextAllowed)
    ];

    const satisfied = gates.filter(Boolean).length;
    const expected = gates.length;
    const score = expected ? Math.round((satisfied / expected) * 100) : 0;

    state.fibonacciSynchronizationSatisfied = satisfied;
    state.fibonacciSynchronizationExpected = expected;
    state.fibonacciSynchronizationScore = score;
    state.fibonacciSynchronizationPassed = satisfied === expected;
    state.fibonacciSynchronizationDegraded = satisfied >= 5 && satisfied < expected;

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
    state.allCanvasChildrenApiReady = Boolean(
      state.canvasEastApiReady &&
      state.canvasWestApiReady &&
      state.canvasSouthApiReady
    );

    const eastEvidenceReady = Boolean(state.canvasEastEvidenceReady && state.canvasEastF13AtlasPacketReady);
    const westReady = Boolean(state.canvasWestInspectionReady || state.westCanvasReleaseApproved || state.westAuditAccepted || state.westAuditDegraded);
    const southReady = Boolean(
      (state.canvasSouthVisibleProofReady || state.canvasSouthSoftProofReady) &&
      !state.canvasSouthHardFail &&
      !state.canvasSouthProofStale
    );

    state.eastGateReady = Boolean(state.canvasEastApiReady && !state.canvasEastApiMissing);
    state.westGateReady = westReady;
    state.southGateReady = Boolean(southReady || state.canvasSouthApiReady);
    state.northGateReady = false;

    state.allCanvasChildrenEvidenceReady = Boolean(eastEvidenceReady && westReady && southReady);
    state.allCanvasChildrenReady = Boolean(state.allCanvasChildrenApiReady && state.allCanvasChildrenEvidenceReady);

    state.f13ProofBodyAvailable = Boolean(state.canvasEastApiReady && westReady && state.canvasSouthApiReady);
    state.f13CanvasReadinessObserved = Boolean(state.canvasEastApiReady && state.canvasWestApiReady && state.canvasSouthApiReady);
    state.f13VisibleEvidenceAvailable = Boolean(eastEvidenceReady && southReady);
    state.f13InspectEvidenceAvailable = Boolean(state.canvasEastApiReady || state.canvasWestInspectionReady || state.canvasSouthApiReady);

    state.f13HardFail = Boolean(
      state.f13HardFail ||
      state.canvasEastFalsePromotionBlocked ||
      state.westHardBlock ||
      state.canvasSouthHardFail ||
      state.parentStrictReadMismatch
    );

    state.f13CanvasEvidenceStrict = Boolean(eastEvidenceReady && westReady && state.canvasSouthVisibleProofReady && !state.f13HardFail);
    state.f13CanvasEvidenceDegraded = Boolean(!state.f13CanvasEvidenceStrict && eastEvidenceReady && westReady && state.canvasSouthSoftProofReady && !state.f13HardFail);
    state.f13CanvasEvidenceComplete = Boolean(state.f13CanvasEvidenceStrict || state.f13CanvasEvidenceDegraded);

    state.canvasGateReady = state.f13CanvasEvidenceComplete;
    state.newsGatePassedBeforeF21 = Boolean(state.canvasGateReady && state.f13CanvasEvidenceStrict);
    state.newsGateDegradedBeforeF21 = Boolean(state.canvasGateReady && state.f13CanvasEvidenceDegraded);

    state.f21EligibleForNorth = Boolean(state.f13CanvasEvidenceComplete && !state.f13HardFail);
    state.f21SubmittedToNorth = false;
    state.f21EligibilitySubmittedToNorth = false;
    state.f21LatchMode = state.f21EligibleForNorth ? "F13_ELIGIBLE_FOR_NORTH_ONLY" : "WAITING_CANVAS_GATE";
    state.completionLatched = false;
    state.degradedCompletionLatched = false;
    state.readyTextAllowed = false;
    state.f21ClaimedByCanvasParent = false;
    state.readyTextClaimedByCanvasParent = false;
    state.visualPassClaimed = false;

    if (state.f13HardFail) {
      state.firstFailedCoordinate = state.canvasEastFalsePromotionBlocked
        ? "EAST_FALSE_PROMOTION_BLOCKED"
        : state.westHardBlock
          ? "WEST_HARD_BLOCK"
          : state.canvasSouthHardFail
            ? "SOUTH_HARD_FAIL"
            : "PARENT_STRICT_READ_MISMATCH";

      state.recommendedNextFile = state.canvasEastFalsePromotionBlocked
        ? EAST_FILE
        : state.westHardBlock
          ? WEST_FILE
          : state.canvasSouthHardFail
            ? SOUTH_FILE
            : FILE;

      state.recommendedNextRenewalTarget = state.recommendedNextFile;
      state.f13StrictEvidenceGap = state.firstFailedCoordinate;
      state.postgameStatus = "CANVAS_PARENT_HELD_BY_HARD_FAIL";
    } else if (!state.canvasEastApiReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_API";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_EAST_API";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_EAST_API";
    } else if (state.canvasEastHeldPacketRecognized && !state.canvasEastEvidenceReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
      state.f13StrictEvidenceGap = "WAITING_PARENT_WEST_RELEASE_TO_EAST";
      state.f13StrictEvidenceRepairTarget = FILE;
      state.postgameStatus = "CANVAS_PARENT_RECOGNIZED_EAST_SYNCHRONOUS_HELD_PACKET";
    } else if (!eastEvidenceReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextRenewalTarget = EAST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_EAST_ATLAS_EVIDENCE";
      state.f13StrictEvidenceRepairTarget = EAST_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_EAST_ATLAS_EVIDENCE";
    } else if (!westReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_WEST_INSPECTION";
      state.recommendedNextFile = WEST_FILE;
      state.recommendedNextRenewalTarget = WEST_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_WEST_INSPECTION";
      state.f13StrictEvidenceRepairTarget = WEST_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_WEST_INSPECTION";
    } else if (!southReady) {
      state.firstFailedCoordinate = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      state.recommendedNextFile = SOUTH_FILE;
      state.recommendedNextRenewalTarget = SOUTH_FILE;
      state.f13StrictEvidenceGap = "WAITING_CANVAS_SOUTH_VISIBLE_PROOF";
      state.f13StrictEvidenceRepairTarget = SOUTH_FILE;
      state.postgameStatus = "CANVAS_PARENT_WAITING_SOUTH_VISIBLE_PROOF";
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

    scanMaterialAuthority();
    scanEastAuthority();
    scanWestAuthority();
    scanSouthAuthority();

    if (options.callEast !== false) {
      callEastBuildAtlas({
        reason: "auditChildren",
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

    recordEvent("CANVAS_PARENT_UNKNOWN_CHILD_PACKET_ARCHIVED", {
      keys: Object.keys(packet || {}).slice(0, 40)
    });

    return getReceipt();
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      eastRequiredContract: EAST_REQUIRED_CONTRACT,
      materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      canvasParentActive: true,
      canvasParentV6Active: true,
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

      indexGateReady: true,
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

      f21EligibleForNorth: state.f21EligibleForNorth,
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
        "canvas-parent-coordination",
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
    const r = getReceipt();

    const localEvents = (r.localEvents || [])
      .slice(-40)
      .map((event) => `- ${event.at} :: ${event.event} :: ${JSON.stringify(event.detail || {})}`)
      .join("\n") || "- none";

    const errors = (r.errors || [])
      .slice(-30)
      .map((error) => `- ${error.at} :: ${error.code} :: ${error.message}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `baselineContract=${r.baselineContract}`,
      `eastRequiredContract=${r.eastRequiredContract}`,
      `materialRequiredContract=${r.materialRequiredContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      "PARENT",
      `canvasParentActive=${r.canvasParentActive}`,
      `canvasParentV6Active=${r.canvasParentV6Active}`,
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
      "F13",
      `allCanvasChildrenApiReady=${r.allCanvasChildrenApiReady}`,
      `allCanvasChildrenEvidenceReady=${r.allCanvasChildrenEvidenceReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `canvasReleasePacketReady=${r.canvasReleasePacketReady}`,
      `canvasReleaseHeldReason=${r.canvasReleaseHeldReason}`,
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

    if (visibleToggle && !visibleToggle.__hearthCanvasParentV6Bound) {
      visibleToggle.__hearthCanvasParentV6Bound = true;
      visibleToggle.addEventListener("click", () => {
        toggleReceiptVisibility();
        render();
      });
    }

    if (expandedToggle && !expandedToggle.__hearthCanvasParentV6Bound) {
      expandedToggle.__hearthCanvasParentV6Bound = true;
      expandedToggle.addEventListener("click", () => {
        toggleReceiptExpanded();
        render();
      });
    }

    if (copyButton && !copyButton.__hearthCanvasParentV6Bound) {
      copyButton.__hearthCanvasParentV6Bound = true;
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

    setDataset("hearthCanvasParentV6Active", "true");
    setDataset("hearthCanvasEastV5SynchronousHeldPacketConsumptionActive", "true");
    setDataset("hearthCanvasParentChildReconciliationActive", "true");
    setDataset("hearthCanvasParentReleasePacketComposerActive", "true");

    setDataset("hearthCanvasCycleNumber", state.cycleNumber);
    setDataset("hearthCanvasCycleRoute", state.cycleRoute);
    setDataset("hearthCanvasActiveFibonacci", state.activeFibonacci);
    setDataset("hearthCanvasActiveFibonacciRank", state.activeFibonacciRank);
    setDataset("hearthCanvasEastActiveFibonacci", state.eastActiveFibonacci);
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

    setDataset("hearthCanvasF21EligibleForNorth", state.f21EligibleForNorth);
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
    root.DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumption = api;
    root.DEXTER_LAB.hearthCanvasParentCurrentSouthProofReconciliation = api;
    root.DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver = api;
    root.DEXTER_LAB.hearthCanvasParentPreReleaseStructuralCarrierThenWestReleaseToEast = api;

    const receipt = getReceiptLight();

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_EVIDENCE_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_CURRENT_SOUTH_PROOF_RECONCILIATION_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_RECEIPT = receipt;

    root.HEARTH.canvasReceipt = receipt;
    root.HEARTH.canvasParentReceipt = receipt;
    root.HEARTH.canvasEvidenceReceipt = receipt;
    root.HEARTH.canvasParentEastV5SynchronousHeldPacketConsumptionReceipt = receipt;

    root.DEXTER_LAB.hearthCanvasReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasEvidenceReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasParentEastV5SynchronousHeldPacketConsumptionReceipt = receipt;

    root.__HEARTH_CANVAS_LOADED__ = true;
    root.__HEARTH_CANVAS_FILE__ = FILE;
    root.__HEARTH_CANVAS_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_PARENT_V6_ACTIVE__ = true;
    root.__HEARTH_CANVAS_EAST_V5_SYNCHRONOUS_HELD_PACKET_CONSUMPTION__ = true;
    root.__HEARTH_CANVAS_F21_CLAIMED__ = false;
    root.__HEARTH_CANVAS_READY_TEXT_ALLOWED__ = false;
    root.__HEARTH_CANVAS_VISUAL_PASS_CLAIMED__ = false;

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    updateDataset();
  }

  function bootAudit() {
    state.updatedAt = nowIso();

    publishGlobals();
    updateDataset();
    installDiagnosticPanel();

    scanMaterialAuthority();
    scanEastAuthority();
    scanWestAuthority();
    scanSouthAuthority();
    recomputeParentState();

    recordEvent("CANVAS_PARENT_V6_LOADED", {
      contract: CONTRACT,
      receipt: RECEIPT,
      eastRequiredContract: EAST_REQUIRED_CONTRACT,
      materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
      visualPassClaimed: false
    });

    const run = () => {
      try {
        auditChildren({
          callEast: true,
          async: true,
          nonBlocking: true,
          width: 512,
          height: 256
        });
      } catch (error) {
        recordError("BOOT_AUDIT_FAILED", error);
        recomputeParentState();
      }
    };

    if (isFunction(root.requestAnimationFrame)) {
      root.requestAnimationFrame(() => run());
    } else {
      root.setTimeout(run, 0);
    }
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    eastRequiredContract: EAST_REQUIRED_CONTRACT,
    eastRequiredReceipt: EAST_REQUIRED_RECEIPT,
    materialRequiredContract: MATERIAL_REQUIRED_CONTRACT,
    materialRequiredReceipt: MATERIAL_REQUIRED_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,

    EAST_RESULT_CLASS,
    CHILD_STATUS,

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
    canvasParentV6Active: true,
    eastV5SynchronousHeldPacketConsumptionActive: true,
    canvasParentChildReconciliationActive: true,
    parentReleasePacketComposerActive: true,
    newsAlignmentProtocolActive: true,
    fibonacciSynchronizationMetricActive: true,

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
    recordError("CANVAS_PARENT_V6_INITIALIZATION_FAILED", error);

    try {
      publishGlobals();
      updateDataset();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
