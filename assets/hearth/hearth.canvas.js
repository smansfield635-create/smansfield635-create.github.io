// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2
// Full-file replacement.
// Canvas parent / governed F13 evidence receiver / parent-child reconciliation gate.
// Purpose:
// - Preserve Canvas as one physical parent file.
// - Preserve governed release, parent identity guard, boot handshake, stale-consumption guard, carrier mount, child consumption, render chain, and upstream return packet.
// - Renew parent-child reconciliation after East, West, and South child renewals.
// - Read renewed child receipts directly:
//   East = atlas/source readiness.
//   West = F13N inspection/view/invalidation readiness.
//   South = F13S texture/render/visible-proof readiness.
// - Split child API readiness from child evidence readiness.
// - Expose current NEWS fields and Fibonacci fields.
// - Keep Canvas strictly F13 evidence only.
// - Never claim F21, READY text, completion latch, or final visual pass.
// Does not own:
// - planet truth
// - material truth
// - elevation truth
// - hydrology truth
// - runtime-table governance
// - route orchestration
// - West admissibility
// - North NEWS finalization
// - F21 completion latch
// - ready text
// - final visual pass claim

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_TNT_v2";
  const RECEIPT = "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_RECEIPT_v2";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_AFTER_WEST_RELEASE_TNT_v1";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_AFTER_WEST_RELEASE_RECEIPT_v1";
  const LEGACY_BASELINE_CONTRACT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_TNT_v1";
  const LEGACY_BASELINE_RECEIPT = "HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION_RECEIPT_v1";

  const SPLIT_CONTRACT = CONTRACT;
  const SPLIT_RECEIPT = RECEIPT;

  const VERSION = "2026-05-31.hearth-canvas-parent-child-reconciliation-f13-evidence-receiver-v2";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/hearth/hearth.canvas.east.js";
  const WEST_FILE = "/assets/hearth/hearth.canvas.west.js";
  const SOUTH_FILE = "/assets/hearth/hearth.canvas.south.js";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const DEFAULT_SIZE = 600;
  const MIN_SIZE = 360;
  const DEFAULT_ATLAS_WIDTH = 512;
  const DEFAULT_ATLAS_HEIGHT = 256;
  const CHILD_LOAD_TIMEOUT_MS = 2600;
  const CHILD_METHOD_TIMEOUT_MS = 9000;
  const MAX_LOG = 180;

  const MACRO_CYCLE_1 = "NORTH_EAST_WEST_SOUTH_NORTH";
  const MACRO_CYCLE_2 = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const CANVAS_CHILD_SEQUENCE = "CANVAS_EAST_ATLAS_SOURCE__CANVAS_WEST_INSPECTION_VIEW__CANVAS_SOUTH_TEXTURE_RENDER__CANVAS_PARENT_F13_EVIDENCE";
  const DEPRECATED_CYCLE_ORDER = "EAST_WEST_NORTH_SOUTH_CHECKPOINT_EAST";

  const RELEASE_STATUS = Object.freeze({
    ACCEPTED: "RELEASE_ACCEPTED",
    HELD_CYCLE_ONE: "RELEASE_HELD_CYCLE_ONE",
    HELD_UNKNOWN_CYCLE: "RELEASE_HELD_UNKNOWN_CYCLE",
    HELD_WEST_AUDIT_REQUIRED: "RELEASE_HELD_WEST_AUDIT_REQUIRED",
    HELD_SOUTH_ONLY_PACKET: "RELEASE_HELD_SOUTH_ONLY_PACKET",
    HELD_PARENT_IDENTITY_MISMATCH: "RELEASE_HELD_PARENT_IDENTITY_MISMATCH",
    HELD_STALE_PARENT: "RELEASE_HELD_STALE_PARENT",
    HELD_FALLBACK: "RELEASE_HELD_FALLBACK"
  });

  const STALE_PARENT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PHYSICAL_CARRIER_F13_PROOF_PARENT_RENEWAL_TNT_v1",
    "HEARTH_CANVAS_PHYSICAL_OBJECT_BOOTSTRAP_F13_CARRIER_TNT_v1",
    "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_SCHEMATIC_TNT_v2",
    "HEARTH_CANVAS_SINGLE_FILE_INTERNAL_NEWS_F13_TEXTURE_FRAME_PROOF_CLOSURE_TNT_v3",
    "HEARTH_CANVAS_PARENT_IDENTITY_BOOT_HANDSHAKE_STALE_CONSUMPTION_GUARD_TNT_v4",
    "HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER_AFTER_WEST_RELEASE_TNT_v1"
  ]);

  const CHILDREN = Object.freeze({
    east: {
      file: EAST_FILE,
      globals: [
        "HEARTH_CANVAS_EAST",
        "HEARTH.canvasEast",
        "HEARTH.canvasEastMaterialAtlasSourceMachine",
        "HEARTH.canvasEastMaterialAtlasSourceTransistor",
        "HEARTH.canvasEastF13AtlasSourceChild",
        "HEARTH_CANVAS_EAST_PARENT_ALIGNED_MATERIAL_ATLAS_SOURCE_TRANSISTOR",
        "HEARTH_CANVAS_EAST_MATERIAL_ATLAS_SOURCE_MACHINE",
        "DEXTER_LAB.hearthCanvasEast",
        "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine",
        "DEXTER_LAB.hearthCanvasEastF13AtlasSourceChild"
      ],
      requiredMethods: ["buildAtlas", "sample", "read", "getReceipt"]
    },
    west: {
      file: WEST_FILE,
      globals: [
        "HEARTH_CANVAS_WEST",
        "HEARTH.canvasWest",
        "HEARTH.canvasWestInspectionInvalidationControl",
        "HEARTH.canvasWestF13NInspectionViewInvalidationChild",
        "HEARTH_CANVAS_WEST_INSPECTION_INVALIDATION_CONTROL",
        "HEARTH_CANVAS_WEST_F13N_INSPECTION_VIEW_INVALIDATION_CHILD",
        "DEXTER_LAB.hearthCanvasWest",
        "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl",
        "DEXTER_LAB.hearthCanvasWestF13NInspectionViewInvalidationChild"
      ],
      requiredMethods: ["bindInspection", "getViewState", "setRotation", "resetRotation", "setZoom", "getReceipt"]
    },
    south: {
      file: SOUTH_FILE,
      globals: [
        "HEARTH_CANVAS_SOUTH",
        "HEARTH.canvasSouth",
        "HEARTH.canvasSouthTextureSphereVisibleProof",
        "HEARTH.canvasSouthSplitAdapterDrainVisibleProofHardening",
        "HEARTH.canvasSouthF13STextureRenderVisibleProofChild",
        "HEARTH_CANVAS_SOUTH_TEXTURE_SPHERE_VISIBLE_PROOF",
        "HEARTH_CANVAS_SOUTH_SPLIT_ADAPTER_DRAIN_VISIBLE_PROOF_HARDENING",
        "HEARTH_CANVAS_SOUTH_F13S_TEXTURE_RENDER_VISIBLE_PROOF_CHILD",
        "DEXTER_LAB.hearthCanvasSouth",
        "DEXTER_LAB.hearthCanvasSouthTextureSphereVisibleProof",
        "DEXTER_LAB.hearthCanvasSouthSplitAdapterDrainVisibleProofHardening",
        "DEXTER_LAB.hearthCanvasSouthF13STextureRenderVisibleProofChild"
      ],
      requiredMethods: [
        "composeTexture",
        "renderSphere",
        "renderSphereSync",
        "getTextureCanvas",
        "sampleVisibleContent",
        "classifyVisibleContentEvidence",
        "invalidateTexture",
        "getReceipt"
      ]
    }
  });

  const preexisting = (() => {
    const prior =
      root.HEARTH_CANVAS ||
      (root.HEARTH && root.HEARTH.canvas) ||
      (root.DEXTER_LAB && root.DEXTER_LAB.hearthCanvasEvidence) ||
      null;

    if (!prior || typeof prior !== "object") {
      return {
        detected: false,
        contract: "",
        receipt: "",
        splitContract: "",
        splitReceipt: "",
        stale: false
      };
    }

    const priorContract = String(prior.contract || "");
    const priorSplit = String(prior.splitContract || prior.SPLIT_CONTRACT || priorContract || "");

    return {
      detected: true,
      contract: priorContract,
      receipt: String(prior.receipt || ""),
      splitContract: priorSplit,
      splitReceipt: String(prior.splitReceipt || ""),
      stale: Boolean(priorSplit && priorSplit !== SPLIT_CONTRACT)
    };
  })();

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: LEGACY_BASELINE_CONTRACT,
    baselineReceipt: LEGACY_BASELINE_RECEIPT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    version: VERSION,
    file: FILE,
    role: "canvas-parent-child-reconciliation-f13-evidence-receiver",

    governedF13EvidenceReceiverActive: true,
    parentChildReconciliationActive: true,
    waitsForWestRelease: true,
    cycleOneHeld: true,
    cycleTwoReleaseRequired: true,
    singlePhysicalFile: true,
    internalNewsZonesActive: true,
    noAdditionalCanvasFileSplit: true,

    parentIdentityGuardActive: true,
    bootHandshakeGuardActive: true,
    staleConsumptionGuardActive: true,
    expectedParentContract: CONTRACT,
    expectedParentSplitContract: SPLIT_CONTRACT,
    currentParentIdentityAccepted: false,
    currentParentIdentityMismatch: true,
    staleParentDetected: preexisting.stale,
    preexistingParentDetected: preexisting.detected,
    preexistingParentContract: preexisting.contract,
    preexistingParentReceipt: preexisting.receipt,
    preexistingParentSplitContract: preexisting.splitContract,
    preexistingParentSplitReceipt: preexisting.splitReceipt,

    release: {
      releaseAccepted: false,
      releaseStatus: RELEASE_STATUS.HELD_UNKNOWN_CYCLE,
      releaseReason: "waiting-governed-release-packet",
      receivedFrom: "",
      returnTo: "",
      handoffTo: "",
      cycleNumber: 0,
      cycleRoute: "",
      westAuditObserved: false,
      westAuditAccepted: false,
      westCanvasReleaseApproved: false,
      westAuditRequired: true,
      northCanvasReleaseAuthorized: false,
      canvasReleaseAuthorized: false,
      canvasReleaseReceived: false,
      sourceFile: "",
      destinationFile: FILE,
      acceptedAt: "",
      lastInput: null
    },

    newsProtocolSynchronized: true,
    northGateReady: false,
    eastGateReady: false,
    westGateReady: false,
    southGateReady: false,
    canvasGateReady: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: true,
    canvasFinalizesNews: false,

    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,
    deprecatedCycleOrder: DEPRECATED_CYCLE_ORDER,
    canvasParentMacroNorth: false,
    canvasParentChildParent: true,
    canvasParentDoesNotAuthorizeRelease: true,
    canvasParentDoesNotLatchF21: true,

    fibonacciAlignmentSynchronized: true,
    activeFibonacci: 13,
    activeFibonacciRank: "F13P",
    activeStageId: "canvas-parent-f13-evidence-receiver",
    activeGearId: "hearth-canvas-parent-f13",
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,
    f8SelfDutySatisfied: false,

    f13ReleaseReceived: false,
    f13ParentIdentityAccepted: false,
    f13PhysicalCarrierMounted: false,
    f13ChildrenApiReady: false,
    f13ChildrenEvidenceReady: false,
    f13AtlasReady: false,
    f13InspectReady: false,
    f13TextureReady: false,
    f13RenderReady: false,
    f13FrameReady: false,
    f13VisibleEvidenceAvailable: false,
    f13VisibleEvidenceStrict: false,
    f13VisibleEvidenceDegraded: false,
    f13CanvasEvidencePreserved: true,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,
    completionLatched: false,
    degradedCompletionLatched: false,
    f21LatchMode: "north-only",

    canvasNorthActive: true,
    physicalObjectBootstrapActive: true,
    physicalCarrierProofActive: true,
    carrierReadyIsNotPlanetReady: true,
    canvasReadyRequiresTextureFrameAndProof: true,
    f13PhysicalProofRequired: true,
    emergencyF13DiagnosticPlanetAllowed: true,
    emergencyF13DiagnosticPlanetUsed: false,

    mount: null,
    canvas: null,
    context: null,
    cssSize: 0,
    dpr: 1,
    carrierPhysicalWidth: 0,
    carrierPhysicalHeight: 0,

    canvasCarrierRequested: false,
    canvasCarrierMounted: false,
    canvasContextReady: false,
    carrierReady: false,
    canvasCarrierReady: false,
    canvasCarrierHandoffOk: false,
    canvasCarrierHandoffError: "",
    canvasCarrierMethod: "parent-child-reconciliation-f13-evidence-receiver",

    physicalBootRequested: false,
    physicalBootStarted: false,
    physicalBootResolved: false,
    physicalBootRejected: false,
    physicalBootComplete: false,
    canvasBootRequested: false,
    canvasBootStarted: false,
    canvasBootResolved: false,
    canvasBootRejected: false,
    canvasBootAttempts: 0,
    canvasBootError: "",
    canvasBootComplete: false,

    canvasReady: false,
    visibleCanvasReady: false,
    canvasLaneClosed: false,

    planetCanvasPresent: false,
    planetCanvasNonZeroSize: false,
    planetFramePainted: false,
    nonblankPlanetVisible: false,
    planetNotObstructed: false,
    visiblePlanetAvailable: false,
    visiblePlanetHintPresent: false,

    childLoadAttempted: false,
    childLoadComplete: false,
    childLoadError: "",

    canvasEastPresent: false,
    canvasWestPresent: false,
    canvasSouthPresent: false,

    canvasEastApiReady: false,
    canvasWestApiReady: false,
    canvasSouthApiReady: false,
    allCanvasChildrenApiReady: false,

    canvasEastEvidenceReady: false,
    canvasWestInspectionReady: false,
    canvasSouthVisibleProofReady: false,
    allCanvasChildrenEvidenceReady: false,

    canvasEastReady: false,
    canvasWestReady: false,
    canvasSouthReady: false,
    allCanvasChildrenReady: false,

    canvasEastMissingMethods: "",
    canvasWestMissingMethods: "",
    canvasSouthMissingMethods: "",
    nextAuditTarget: "",

    eastReceipt: {},
    westReceipt: {},
    southReceipt: {},

    atlasCanvas: null,
    textureCanvas: null,
    atlasWidth: DEFAULT_ATLAS_WIDTH,
    atlasHeight: DEFAULT_ATLAS_HEIGHT,

    atlasBuildStarted: false,
    atlasBuildProgress: 0,
    atlasBuildComplete: false,
    atlasBuildError: "",

    textureComposeStarted: false,
    textureComposeProgress: 0,
    textureComposeComplete: false,
    textureComposeError: "",
    textureReady: false,

    firstFrameRequested: false,
    firstFrameDetected: false,
    imageRendered: false,
    imageRenderedMeansFrameDrawnOnly: true,
    imageRenderedDoesNotMeanVisualPass: true,
    imageRenderedDoesNotMeanF21: true,
    renderedAfterTexture: false,
    renderReady: false,

    dragInspectionBound: false,
    zoomInspectionBound: false,
    inspectModeAvailable: false,
    inspectPlanetControlAvailable: false,
    diagnosticCanLeavePlanetFrame: false,

    rotationYaw: -0.18,
    rotationPitch: 0.05,
    zoomLevel: 1,
    zoomMin: 0.82,
    zoomMax: 2.8,
    pointerDragCount: 0,
    renderFrameCount: 0,
    interactiveFrameCount: 0,

    visibleContentProofStarted: false,
    visibleContentProof: false,
    visibleContentStrictProof: false,
    visibleContentSoftGap: false,
    visibleContentHardFail: false,
    visibleForwardProgress: false,
    visibleContentAdmissible: false,
    visibleContentProofMethod: "",
    visibleContentProofError: "",
    visibleContentSampleCount: 0,
    visibleContentVarianceScore: 0,
    visibleContentClassCount: 0,
    visibleContentClasses: [],
    visibleContentLandSampleCount: 0,
    visibleContentWaterSampleCount: 0,
    visibleContentOtherSampleCount: 0,
    visibleContentCarrierSampleCount: 0,
    carrierOnlyDetected: false,
    visibleProofReady: false,

    materialReceiptBridgeActive: false,
    materialNestedReceiptAvailable: false,
    materialContract: "",
    materialReceipt: "",
    materialContractMatchesExpected: false,
    materialReceiptMatchesExpected: false,
    canonicalMaterialConsumed: false,

    northAuthorityPresent: false,
    checkpointSessionSubmissionAvailable: false,
    canvasEvidenceSubmittedToNorth: false,
    canvasEvidenceBodyComposed: false,
    canvasReturnPacketReady: false,

    booting: false,
    booted: false,
    bootStartedAt: "",
    bootCompletedAt: "",
    bootElapsedMs: 0,

    firstFailedCoordinate: "WAITING_CANVAS_GOVERNED_RELEASE_PACKET",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,

    callbacks: [],
    canvasPhaseEvents: [],
    progressOnlyEvents: [],
    localEvents: [],
    errors: [],

    ownsCanvasEvidenceOnly: true,
    ownsGovernedF13EvidenceReceiver: true,
    ownsParentChildReconciliation: true,
    ownsCanvasParentGate: true,
    ownsParentIdentityGuard: true,
    ownsBootHandshakeGuard: true,
    ownsStaleConsumptionDetection: true,
    ownsPhysicalCarrierProof: true,
    ownsEmergencyF13DiagnosticPlanet: true,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsWestAdmissibility: false,
    ownsNewsFinalAuthority: false,
    ownsReadyText: false,
    ownsF21: false,

    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    updatedAt: ""
  };

  let bootPromise = null;
  let childrenPromise = null;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object");
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
    if (value === "true" || value === "1" || value === 1) return true;
    if (value === "false" || value === "0" || value === 0) return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function asArray(value) {
    if (Array.isArray(value)) return value.slice();
    if (value === undefined || value === null || value === "") return [];
    return [value];
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function trimArray(array, max = MAX_LOG) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
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

  function readDataset(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function fieldDeep(input, names, maxDepth = 7) {
    const wanted = new Set(asArray(names));
    const queue = [{ value: input, depth: 0 }];
    const seen = typeof WeakSet !== "undefined" ? new WeakSet() : null;

    while (queue.length) {
      const current = queue.shift();
      const value = current.value;

      if (!isObject(value) || current.depth > maxDepth) continue;
      if (seen && seen.has(value)) continue;
      if (seen) seen.add(value);

      for (const key of Object.keys(value)) {
        if (wanted.has(key)) return value[key];
      }

      for (const key of Object.keys(value)) {
        const next = value[key];
        if (isObject(next)) queue.push({ value: next, depth: current.depth + 1 });
      }
    }

    return undefined;
  }

  function getAnyString(input, names, fallback = "") {
    const value = fieldDeep(input, names);
    return value === undefined || value === null ? fallback : String(value);
  }

  function getAnyBool(input, names, fallback = false) {
    return safeBool(fieldDeep(input, names), fallback);
  }

  function getAnyNumber(input, names, fallback = 0) {
    return safeNumber(fieldDeep(input, names), fallback);
  }

  function withTimeout(promise, timeoutMs, label) {
    return new Promise((resolve, reject) => {
      let settled = false;

      const timer = root.setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error(`${label || "operation"} timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      Promise.resolve(promise)
        .then((value) => {
          if (settled) return;
          settled = true;
          root.clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          if (settled) return;
          settled = true;
          root.clearTimeout(timer);
          reject(error);
        });
    });
  }

  function recordLocal(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "LOCAL_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(code, "CANVAS_ERROR"),
      code: safeString(code, "CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors);
    state.updatedAt = item.at;
    updateDataset();

    return item;
  }

  function safeChildReceipt(child) {
    if (!child || !isObject(child)) return {};

    if (isFunction(child.getReceipt)) {
      try {
        const receipt = child.getReceipt();
        return isObject(receipt) ? receipt : {};
      } catch (_error) {
        return {};
      }
    }

    if (isObject(child.receiptPacket)) return child.receiptPacket;
    if (isObject(child.receipt)) return child.receipt;
    if (child.contract || child.version) return child;

    return {};
  }

  function publishEarlyMarker() {
    root.__HEARTH_CANVAS_PARENT_MARKER__ = true;
    root.__HEARTH_CANVAS_PARENT_FILE__ = FILE;
    root.__HEARTH_CANVAS_PARENT_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_PARENT_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_CONTRACT__ = SPLIT_CONTRACT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_RECEIPT__ = SPLIT_RECEIPT;
    root.__HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION__ = true;
    root.__HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER__ = true;
    root.__HEARTH_CANVAS_STALE_PARENT_DETECTED_BEFORE_RECONCILIATION__ = state.staleParentDetected;
  }

  function verifyCurrentParentIdentity(reason = "identity-check") {
    const markerContract = safeString(root.__HEARTH_CANVAS_PARENT_CONTRACT__, "");
    const markerSplit = safeString(root.__HEARTH_CANVAS_PARENT_SPLIT_CONTRACT__, "");
    const datasetContract = readDataset("hearthCanvasContract", "");
    const datasetSplit = readDataset("hearthCanvasSplitContract", "");
    const globalContract = root.HEARTH_CANVAS && root.HEARTH_CANVAS.contract
      ? safeString(root.HEARTH_CANVAS.contract)
      : "";
    const globalSplit = root.HEARTH_CANVAS && root.HEARTH_CANVAS.splitContract
      ? safeString(root.HEARTH_CANVAS.splitContract)
      : "";

    const mismatch = Boolean(
      (markerContract && markerContract !== CONTRACT) ||
      (markerSplit && markerSplit !== SPLIT_CONTRACT) ||
      (datasetContract && datasetContract !== CONTRACT) ||
      (datasetSplit && datasetSplit !== SPLIT_CONTRACT) ||
      (globalContract && globalContract !== CONTRACT) ||
      (globalSplit && globalSplit !== SPLIT_CONTRACT)
    );

    state.currentParentIdentityAccepted = !mismatch;
    state.currentParentIdentityMismatch = mismatch;
    state.f13ParentIdentityAccepted = !mismatch;

    if (mismatch) {
      state.firstFailedCoordinate = "WAITING_CANVAS_PARENT_IDENTITY_MATCH";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;

      recordError("PARENT_IDENTITY_MISMATCH", "Live parent identity does not match parent-child reconciliation F13 identity.", {
        reason,
        expectedContract: CONTRACT,
        expectedSplit: SPLIT_CONTRACT,
        markerContract,
        markerSplit,
        datasetContract,
        datasetSplit,
        globalContract,
        globalSplit
      });
    }

    return !mismatch;
  }

  function normalizeCycleRoute(value = "") {
    const text = safeString(value).toUpperCase().replace(/\s+/g, "");

    if (
      text.includes("NORTH_EAST_WEST_SOUTH_NORTH") ||
      text.includes("NORTH→EAST→WEST→SOUTH→NORTH") ||
      text.includes("NORTH->EAST->WEST->SOUTH->NORTH")
    ) {
      return MACRO_CYCLE_1;
    }

    if (
      text.includes("NORTH_EAST_SOUTH_WEST_CANVAS") ||
      text.includes("NORTH→EAST→SOUTH→WEST→CANVAS") ||
      text.includes("NORTH->EAST->SOUTH->WEST->CANVAS")
    ) {
      return MACRO_CYCLE_2;
    }

    return safeString(value, "");
  }

  function normalizeCardinal(value = "") {
    const text = safeString(value).trim().toUpperCase();
    if (["NORTH", "EAST", "SOUTH", "WEST", "CANVAS"].includes(text)) return text;
    return text;
  }

  function normalizeCanvasReleaseInput(input = {}) {
    const source = isObject(input) ? input : {};
    const detail = isObject(source.detail) ? source.detail : {};
    const snapshot = isObject(source.snapshot) ? source.snapshot : {};
    const release = isObject(source.release) ? source.release : {};
    const receipt = isObject(source.receiptPacket) ? source.receiptPacket : {};
    const flat = {
      ...snapshot,
      ...detail,
      ...release,
      ...receipt,
      ...source
    };

    const receivedFrom = normalizeCardinal(
      getAnyString(flat, ["receivedFrom", "sourceCardinal", "activeCardinal", "sender"], "") ||
      readDataset("hearthCanvasReceivedFrom", "")
    );

    const cycleRoute = normalizeCycleRoute(
      getAnyString(flat, ["cycleRoute", "activeCycleRoute", "routeCycle"], "") ||
      readDataset("hearthCanvasCycleRoute", "")
    );

    let cycleNumber = getAnyNumber(flat, ["cycleNumber", "activeCycleNumber"], 0);
    if (!cycleNumber && cycleRoute === MACRO_CYCLE_1) cycleNumber = 1;
    if (!cycleNumber && cycleRoute === MACRO_CYCLE_2) cycleNumber = 2;

    const cycleOneDetected = Boolean(
      cycleNumber === 1 ||
      cycleRoute === MACRO_CYCLE_1 ||
      getAnyBool(flat, ["cycleOneDetected", "cycle1Detected"], false)
    );

    const cycleTwoDetected = Boolean(
      cycleNumber === 2 ||
      cycleRoute === MACRO_CYCLE_2 ||
      getAnyBool(flat, ["cycleTwoDetected", "cycle2Detected"], false)
    );

    const westAuditObserved = Boolean(
      getAnyBool(flat, ["westAuditObserved", "westAuditPresent", "westReviewObserved"], false) ||
      readDataset("hearthCanvasWestAuditObserved", "") === "true" ||
      receivedFrom === "WEST"
    );

    const westAuditAccepted = Boolean(
      getAnyBool(flat, ["westAuditAccepted", "westAccepted", "westHandoffAccepted", "auditAccepted"], false) ||
      readDataset("hearthCanvasWestAuditAccepted", "") === "true"
    );

    const westCanvasReleaseApproved = Boolean(
      getAnyBool(flat, ["westCanvasReleaseApproved", "canvasReleaseApprovedByWest", "westReleaseApproved"], false) ||
      readDataset("hearthCanvasWestReleaseApproved", "") === "true"
    );

    const northCanvasReleaseAuthorized = Boolean(
      getAnyBool(flat, ["northCanvasReleaseAuthorized", "canvasReleaseAuthorizedByNorth", "northReleaseAuthorized"], false) ||
      readDataset("hearthCanvasNorthReleaseAuthorized", "") === "true"
    );

    const canvasReleaseAuthorized = Boolean(
      getAnyBool(flat, ["canvasReleaseAuthorized", "releaseAuthorized", "canvasRelease"], false) ||
      readDataset("hearthCanvasReleaseAuthorized", "") === "true"
    );

    const canvasReleaseReceived = Boolean(
      getAnyBool(flat, ["canvasReleaseReceived", "releaseReceived"], false) ||
      westCanvasReleaseApproved ||
      canvasReleaseAuthorized ||
      northCanvasReleaseAuthorized ||
      receivedFrom === "WEST"
    );

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,

      sourceFile: getAnyString(flat, ["sourceFile", "file", "fromFile"], ""),
      destinationFile: getAnyString(flat, ["destinationFile", "targetFile", "toFile"], FILE),
      activeCycleNumber: cycleNumber,
      cycleNumber,
      activeCycleRoute: cycleRoute,
      cycleRoute,
      receivedFrom,
      returnTo: normalizeCardinal(getAnyString(flat, ["returnTo"], "")),
      handoffTo: normalizeCardinal(getAnyString(flat, ["handoffTo"], "")),
      activeCardinal: "CANVAS",
      activeFileGate: FILE,

      activeFibonacci: getAnyNumber(flat, ["activeFibonacci"], 13),
      activeFibonacciRank: getAnyString(flat, ["activeFibonacciRank"], "F13P"),
      activeStageId: getAnyString(flat, ["activeStageId"], "canvas-parent-f13-evidence-receiver"),
      activeGearId: getAnyString(flat, ["activeGearId"], "hearth-canvas-parent-f13"),
      activeNewsGate: getAnyString(flat, ["activeNewsGate", "activeNEWSGate"], "CANVAS"),

      westAuditObserved,
      westAuditAccepted,
      westCanvasReleaseApproved,
      westAuditRequired: getAnyBool(flat, ["westAuditRequired"], true),
      northCanvasReleaseAuthorized,
      canvasReleaseAuthorized,
      canvasReleaseReceived,
      cycleOneDetected,
      cycleTwoDetected,

      staleParentDetected: getAnyBool(flat, ["staleParentDetected", "staleConsumptionDetected"], state.staleParentDetected),
      currentParentIdentityAccepted: getAnyBool(flat, ["currentParentIdentityAccepted", "parentIdentityAccepted"], state.currentParentIdentityAccepted),
      currentParentIdentityMismatch: getAnyBool(flat, ["currentParentIdentityMismatch", "parentIdentityMismatch"], state.currentParentIdentityMismatch),

      firstFailedCoordinate: getAnyString(flat, ["firstFailedCoordinate"], state.firstFailedCoordinate),
      recommendedNextFile: getAnyString(flat, ["recommendedNextFile"], state.recommendedNextFile),
      recommendedNextRenewalTarget: getAnyString(flat, ["recommendedNextRenewalTarget"], state.recommendedNextRenewalTarget),

      raw: clonePlain(source),
      normalizedAt: nowIso()
    };
  }

  function applyHeldRelease(status, reason, normalized = {}) {
    state.release.releaseAccepted = false;
    state.release.releaseStatus = status;
    state.release.releaseReason = reason;
    state.release.receivedFrom = normalized.receivedFrom || "";
    state.release.returnTo = normalized.returnTo || "";
    state.release.handoffTo = normalized.handoffTo || "";
    state.release.cycleNumber = normalized.cycleNumber || 0;
    state.release.cycleRoute = normalized.cycleRoute || "";
    state.release.westAuditObserved = normalized.westAuditObserved === true;
    state.release.westAuditAccepted = normalized.westAuditAccepted === true;
    state.release.westCanvasReleaseApproved = normalized.westCanvasReleaseApproved === true;
    state.release.westAuditRequired = normalized.westAuditRequired !== false;
    state.release.northCanvasReleaseAuthorized = normalized.northCanvasReleaseAuthorized === true;
    state.release.canvasReleaseAuthorized = normalized.canvasReleaseAuthorized === true;
    state.release.canvasReleaseReceived = normalized.canvasReleaseReceived === true;
    state.release.sourceFile = normalized.sourceFile || "";
    state.release.destinationFile = FILE;
    state.release.acceptedAt = "";
    state.release.lastInput = clonePlain(normalized);

    state.f13ReleaseReceived = false;
    state.canvasEvidenceBodyComposed = false;
    state.canvasReturnPacketReady = false;

    state.firstFailedCoordinate =
      status === RELEASE_STATUS.HELD_CYCLE_ONE ? "WAITING_CYCLE_TWO_WEST_RELEASE" :
      status === RELEASE_STATUS.HELD_SOUTH_ONLY_PACKET ? "WAITING_WEST_RELEASE_AFTER_SOUTH" :
      status === RELEASE_STATUS.HELD_PARENT_IDENTITY_MISMATCH ? "WAITING_CANVAS_PARENT_IDENTITY_MATCH" :
      status === RELEASE_STATUS.HELD_STALE_PARENT ? "WAITING_CANVAS_STALE_PARENT_CLEARANCE" :
      status === RELEASE_STATUS.HELD_WEST_AUDIT_REQUIRED ? "WAITING_WEST_CANVAS_RELEASE" :
      "WAITING_CANVAS_GOVERNED_RELEASE_PACKET";

    state.recommendedNextFile = status === RELEASE_STATUS.HELD_WEST_AUDIT_REQUIRED ? "/assets/lab/runtime-table.west.js" : FILE;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;

    updateDataset();

    return {
      accepted: false,
      releaseAccepted: false,
      releaseStatus: status,
      reason,
      canvasMayBoot: false,
      canvasMayMount: false,
      canvasMayRender: false,
      canvasMayCallChildren: false,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      normalized: clonePlain(normalized),
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function applyAcceptedRelease(normalized = {}) {
    state.release.releaseAccepted = true;
    state.release.releaseStatus = RELEASE_STATUS.ACCEPTED;
    state.release.releaseReason = "lawful-cycle-two-west-release-accepted";
    state.release.receivedFrom = normalized.receivedFrom || "WEST";
    state.release.returnTo = "NORTH";
    state.release.handoffTo = "CANVAS";
    state.release.cycleNumber = 2;
    state.release.cycleRoute = MACRO_CYCLE_2;
    state.release.westAuditObserved = normalized.westAuditObserved === true;
    state.release.westAuditAccepted = normalized.westAuditAccepted === true;
    state.release.westCanvasReleaseApproved = normalized.westCanvasReleaseApproved === true;
    state.release.westAuditRequired = true;
    state.release.northCanvasReleaseAuthorized = normalized.northCanvasReleaseAuthorized === true;
    state.release.canvasReleaseAuthorized = true;
    state.release.canvasReleaseReceived = true;
    state.release.sourceFile = normalized.sourceFile || "/assets/lab/runtime-table.west.js";
    state.release.destinationFile = FILE;
    state.release.acceptedAt = nowIso();
    state.release.lastInput = clonePlain(normalized);

    state.f13ReleaseReceived = true;
    state.firstFailedCoordinate = "NONE_CANVAS_RELEASE_ACCEPTED";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;

    recordLocal("CANVAS_GOVERNED_RELEASE_ACCEPTED", {
      cycleNumber: 2,
      cycleRoute: MACRO_CYCLE_2,
      receivedFrom: state.release.receivedFrom,
      westAuditObserved: state.release.westAuditObserved,
      westCanvasReleaseApproved: state.release.westCanvasReleaseApproved,
      northCanvasReleaseAuthorized: state.release.northCanvasReleaseAuthorized
    });

    updateDataset();

    return {
      accepted: true,
      releaseAccepted: true,
      releaseStatus: RELEASE_STATUS.ACCEPTED,
      reason: "lawful-cycle-two-west-release-accepted",
      canvasMayBoot: true,
      canvasMayMount: true,
      canvasMayRender: true,
      canvasMayCallChildren: true,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      normalized: clonePlain(normalized),
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function resolveCanvasRelease(input = {}) {
    let normalized;

    try {
      verifyCurrentParentIdentity("resolveCanvasRelease");
      normalized = normalizeCanvasReleaseInput(input);
    } catch (error) {
      recordError("CANVAS_RELEASE_NORMALIZATION_FAILED", error);
      return applyHeldRelease(RELEASE_STATUS.HELD_FALLBACK, "release-normalization-failed", {});
    }

    if (normalized.currentParentIdentityMismatch || !state.currentParentIdentityAccepted) {
      return applyHeldRelease(RELEASE_STATUS.HELD_PARENT_IDENTITY_MISMATCH, "parent-identity-mismatch", normalized);
    }

    if (normalized.staleParentDetected && !normalized.westCanvasReleaseApproved && !normalized.northCanvasReleaseAuthorized) {
      return applyHeldRelease(RELEASE_STATUS.HELD_STALE_PARENT, "stale-parent-detected-without-release-override", normalized);
    }

    if (normalized.cycleOneDetected) {
      return applyHeldRelease(RELEASE_STATUS.HELD_CYCLE_ONE, "cycle-one-does-not-act-canvas", normalized);
    }

    if (!normalized.cycleTwoDetected && normalized.receivedFrom !== "WEST") {
      return applyHeldRelease(RELEASE_STATUS.HELD_UNKNOWN_CYCLE, "unknown-cycle-held", normalized);
    }

    if (normalized.receivedFrom === "SOUTH" && !normalized.westCanvasReleaseApproved && !normalized.northCanvasReleaseAuthorized && !normalized.westAuditObserved) {
      return applyHeldRelease(RELEASE_STATUS.HELD_SOUTH_ONLY_PACKET, "south-only-packet-without-west-release", normalized);
    }

    const directWestRelease = normalized.westCanvasReleaseApproved === true;
    const westAcceptedCanvasRelease = normalized.westAuditAccepted === true && normalized.canvasReleaseAuthorized === true;
    const northWithWestObserved = normalized.northCanvasReleaseAuthorized === true && normalized.westAuditObserved === true;
    const cycleTwoFromWest = normalized.cycleNumber === 2 && normalized.cycleRoute === MACRO_CYCLE_2 && normalized.receivedFrom === "WEST";
    const authorizedFromWest = normalized.canvasReleaseAuthorized === true && normalized.receivedFrom === "WEST";

    const releaseOk = Boolean(
      directWestRelease ||
      westAcceptedCanvasRelease ||
      northWithWestObserved ||
      cycleTwoFromWest ||
      authorizedFromWest
    );

    if (!releaseOk) {
      return applyHeldRelease(RELEASE_STATUS.HELD_WEST_AUDIT_REQUIRED, "west-release-evidence-required", normalized);
    }

    return applyAcceptedRelease(normalized);
  }

  function holdCanvasUntilRelease(input = {}) {
    return resolveCanvasRelease(input);
  }

  function acceptCanvasReleasePacket(packet = {}) {
    return resolveCanvasRelease(packet);
  }

  function guardReleaseOrReturn(options = {}) {
    const release = resolveCanvasRelease(options.releasePacket || options.release || options);

    if (!release.releaseAccepted) {
      return {
        held: true,
        receipt: getReceipt(),
        release
      };
    }

    return {
      held: false,
      release
    };
  }

  function resolveChild(key) {
    const spec = CHILDREN[key];
    if (!spec) return null;

    for (const globalName of spec.globals) {
      const found = pathRead(globalName);
      if (found && isObject(found)) return found;
    }

    return null;
  }

  function childMissingMethods(key, child = resolveChild(key)) {
    const spec = CHILDREN[key];
    if (!spec) return [];
    if (!child) return spec.requiredMethods.slice();
    return spec.requiredMethods.filter((method) => !isFunction(child[method]));
  }

  function markChildrenPresence() {
    const east = resolveChild("east");
    const west = resolveChild("west");
    const south = resolveChild("south");

    const eastMissing = childMissingMethods("east", east);
    const westMissing = childMissingMethods("west", west);
    const southMissing = childMissingMethods("south", south);

    state.canvasEastPresent = Boolean(east);
    state.canvasWestPresent = Boolean(west);
    state.canvasSouthPresent = Boolean(south);

    state.canvasEastApiReady = Boolean(east && eastMissing.length === 0);
    state.canvasWestApiReady = Boolean(west && westMissing.length === 0);
    state.canvasSouthApiReady = Boolean(south && southMissing.length === 0);
    state.allCanvasChildrenApiReady = Boolean(state.canvasEastApiReady && state.canvasWestApiReady && state.canvasSouthApiReady);

    state.canvasEastMissingMethods = eastMissing.join(",");
    state.canvasWestMissingMethods = westMissing.join(",");
    state.canvasSouthMissingMethods = southMissing.join(",");

    state.eastReceipt = safeChildReceipt(east);
    state.westReceipt = safeChildReceipt(west);
    state.southReceipt = safeChildReceipt(south);

    deriveParentReadiness();

    if (!state.release.releaseAccepted) state.nextAuditTarget = "/assets/lab/runtime-table.west.js";
    else if (state.currentParentIdentityMismatch) state.nextAuditTarget = FILE;
    else if (!state.canvasEastApiReady) state.nextAuditTarget = EAST_FILE;
    else if (!state.canvasWestApiReady) state.nextAuditTarget = WEST_FILE;
    else if (!state.canvasSouthApiReady) state.nextAuditTarget = SOUTH_FILE;
    else if (!state.canvasEastEvidenceReady) state.nextAuditTarget = EAST_FILE;
    else if (!state.canvasWestInspectionReady) state.nextAuditTarget = WEST_FILE;
    else if (!state.canvasSouthVisibleProofReady) state.nextAuditTarget = SOUTH_FILE;
    else if (!state.f13CanvasEvidenceComplete) state.nextAuditTarget = FILE;
    else state.nextAuditTarget = "read-canvas-return-packet-or-north-receipt-after-f13";

    return { east, west, south };
  }

  function deriveParentReadiness() {
    const east = state.eastReceipt || {};
    const west = state.westReceipt || {};
    const south = state.southReceipt || {};

    const eastAtlasReady = Boolean(
      safeBool(east.atlasBuildComplete, false) ||
      safeBool(east.atlasReady, false) ||
      safeBool(east.f13AtlasReady, false) ||
      safeBool(east.f13AtlasEvidenceAvailable, false) ||
      safeBool(east.canvasEastReady, false)
    );

    const westInspectReady = Boolean(
      safeBool(west.f13InspectEvidenceAvailable, false) ||
      safeBool(west.f13nInspectionReady, false) ||
      safeBool(west.inspectionReady, false) ||
      safeBool(west.canvasWestReady, false) && safeBool(west.westGateReady, false)
    );

    const southTextureReady = Boolean(
      safeBool(south.textureReady, false) ||
      safeBool(south.textureComposeComplete, false) ||
      safeBool(south.textureProofComplete, false)
    );

    const southRenderReady = Boolean(
      safeBool(south.renderReady, false) ||
      (safeBool(south.imageRendered, false) && safeBool(south.firstFrameDetected, false)) ||
      safeBool(south.sphereProjectionComplete, false)
    );

    const southVisibleReady = Boolean(
      safeBool(south.f13sVisibleProofReady, false) ||
      safeBool(south.f13VisibleEvidenceAvailable, false) ||
      safeBool(south.visibleProofReady, false) ||
      safeBool(south.visibleContentProof, false) ||
      safeBool(south.visibleContentSoftGap, false)
    );

    const southVisibleStrict = Boolean(
      safeBool(south.visibleContentStrictProof, false) ||
      (safeBool(south.f13VisibleEvidenceAvailable, false) && !safeBool(south.f13VisibleEvidenceDegraded, false))
    );

    const southVisibleDegraded = Boolean(
      safeBool(south.f13VisibleEvidenceDegraded, false) ||
      safeBool(south.visibleContentSoftGap, false) ||
      safeBool(south.visibleForwardProgress, false) ||
      safeBool(south.visibleContentAdmissible, false)
    );

    state.canvasEastEvidenceReady = eastAtlasReady;
    state.canvasWestInspectionReady = westInspectReady;
    state.canvasSouthVisibleProofReady = southVisibleReady;

    state.canvasEastReady = state.canvasEastApiReady && state.canvasEastEvidenceReady;
    state.canvasWestReady = state.canvasWestApiReady && state.canvasWestInspectionReady;
    state.canvasSouthReady = state.canvasSouthApiReady && state.canvasSouthVisibleProofReady;

    state.allCanvasChildrenReady = Boolean(state.canvasEastReady && state.canvasWestReady && state.canvasSouthReady);
    state.allCanvasChildrenEvidenceReady = Boolean(eastAtlasReady && westInspectReady && southVisibleReady);

    state.atlasBuildComplete = Boolean(state.atlasBuildComplete || eastAtlasReady);
    state.textureComposeComplete = Boolean(state.textureComposeComplete || southTextureReady);
    state.textureReady = southTextureReady;
    state.firstFrameDetected = Boolean(state.firstFrameDetected || safeBool(south.firstFrameDetected, false));
    state.imageRendered = Boolean(state.imageRendered || safeBool(south.imageRendered, false));
    state.renderReady = southRenderReady;
    state.visibleProofReady = southVisibleReady;

    state.f13PhysicalCarrierMounted = Boolean(state.canvasCarrierMounted && state.canvasContextReady);
    state.f13ChildrenApiReady = state.allCanvasChildrenApiReady;
    state.f13ChildrenEvidenceReady = state.allCanvasChildrenEvidenceReady;
    state.f13ChildrenReady = state.allCanvasChildrenReady;
    state.f13AtlasReady = eastAtlasReady || state.atlasBuildComplete;
    state.f13InspectReady = westInspectReady;
    state.f13TextureReady = southTextureReady || state.textureComposeComplete;
    state.f13RenderReady = southRenderReady || state.renderReady;
    state.f13FrameReady = Boolean(state.firstFrameDetected && state.imageRendered);
    state.f13VisibleEvidenceAvailable = southVisibleReady || state.visibleContentProof || state.visibleContentSoftGap || state.visibleForwardProgress || state.visibleContentAdmissible;
    state.f13VisibleEvidenceStrict = southVisibleStrict || state.visibleContentStrictProof;
    state.f13VisibleEvidenceDegraded = southVisibleDegraded || state.visibleContentSoftGap || state.visibleForwardProgress || state.visibleContentAdmissible;

    state.f13CanvasEvidenceStrict = Boolean(
      state.release.releaseAccepted &&
      state.currentParentIdentityAccepted &&
      state.f13PhysicalCarrierMounted &&
      state.f13ChildrenEvidenceReady &&
      state.f13AtlasReady &&
      state.f13InspectReady &&
      state.f13TextureReady &&
      state.f13FrameReady &&
      state.f13VisibleEvidenceStrict
    );

    state.f13CanvasEvidenceDegraded = Boolean(
      !state.f13CanvasEvidenceStrict &&
      state.release.releaseAccepted &&
      state.currentParentIdentityAccepted &&
      state.f13PhysicalCarrierMounted &&
      state.f13ChildrenApiReady &&
      state.f13AtlasReady &&
      state.f13TextureReady &&
      state.f13FrameReady &&
      state.f13VisibleEvidenceAvailable
    );

    state.f13CanvasEvidenceComplete = Boolean(state.f13CanvasEvidenceStrict || state.f13CanvasEvidenceDegraded);
    state.f13HardFail = Boolean(
      !state.f13CanvasEvidenceComplete &&
      (
        safeBool(south.f13HardFail, false) ||
        safeBool(south.visibleContentHardFail, false) ||
        safeBool(south.textureHardFail, false) ||
        safeBool(south.renderHardFail, false)
      )
    );

    state.canvasReady = state.f13CanvasEvidenceComplete;
    state.visibleCanvasReady = state.f13CanvasEvidenceComplete;
    state.canvasLaneClosed = state.f13CanvasEvidenceComplete;

    state.northGateReady = false;
    state.eastGateReady = state.canvasEastReady;
    state.westGateReady = state.canvasWestReady;
    state.southGateReady = state.canvasSouthReady;
    state.canvasGateReady = state.f13CanvasEvidenceComplete;
    state.newsGatePassedBeforeF21 = false;
    state.newsGateDegradedBeforeF21 = true;

    state.f13ProofBodyAvailable = state.f13CanvasEvidenceComplete;
    state.f13InspectEvidenceAvailable = state.f13InspectReady;

    state.f21EligibleForNorth = false;
    state.f21SubmittedToNorth = false;
    state.f21ClaimedByCanvas = false;
    state.readyTextClaimedByCanvas = false;
    state.completionLatched = false;
    state.degradedCompletionLatched = false;
    state.f21LatchMode = "north-only";

    state.generatedImage = false;
    state.graphicBox = false;
    state.webGL = false;
    state.visualPassClaimed = false;

    return {
      eastAtlasReady,
      westInspectReady,
      southTextureReady,
      southRenderReady,
      southVisibleReady,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete
    };
  }

  function scriptAlreadyPresent(file) {
    if (!doc || !file) return null;

    return Array.from(doc.scripts || []).find((script) => {
      const src = script.getAttribute("src") || script.src || "";
      return src.includes(file);
    }) || null;
  }

  function loadScriptOnce(file) {
    if (!doc || !file) return Promise.resolve(false);

    const existing = scriptAlreadyPresent(file);
    if (existing && existing.dataset.hearthCanvasChildLoaded === "true") return Promise.resolve(true);

    return new Promise((resolve) => {
      const script = existing || doc.createElement("script");
      let settled = false;

      function finish(ok) {
        if (settled) return;
        settled = true;
        script.dataset.hearthCanvasChildLoaded = String(ok);
        resolve(ok);
      }

      script.async = false;
      script.defer = false;
      script.dataset.hearthCanvasChildLoadedBy = CONTRACT;
      script.dataset.hearthCanvasChildFile = file;
      script.dataset.generatedImage = "false";
      script.dataset.graphicBox = "false";
      script.dataset.webgl = "false";
      script.dataset.visualPassClaimed = "false";

      if (!existing) {
        script.src = `${file}?v=${encodeURIComponent(`${CONTRACT}-${VERSION}`)}`;
        script.onload = () => finish(true);
        script.onerror = () => {
          recordError("CANVAS_CHILD_SCRIPT_LOAD_FAILED", `Failed to load ${file}`, { file });
          finish(false);
        };
        (doc.head || doc.documentElement).appendChild(script);
      } else {
        finish(true);
      }

      root.setTimeout(() => finish(Boolean(scriptAlreadyPresent(file))), CHILD_LOAD_TIMEOUT_MS);
    });
  }

  function waitForChild(key, timeoutMs = CHILD_LOAD_TIMEOUT_MS) {
    const started = Date.now ? Date.now() : new Date().getTime();

    return new Promise((resolve) => {
      const timer = root.setInterval(() => {
        const child = resolveChild(key);

        if (child) {
          root.clearInterval(timer);
          resolve(child);
          return;
        }

        const current = Date.now ? Date.now() : new Date().getTime();

        if (current - started >= timeoutMs) {
          root.clearInterval(timer);
          resolve(null);
        }
      }, 80);
    });
  }

  async function ensureChildren(options = {}) {
    const gate = guardReleaseOrReturn(options);
    if (gate.held) return markChildrenPresence();

    if (childrenPromise) return childrenPromise;

    childrenPromise = (async () => {
      state.childLoadAttempted = true;
      state.childLoadError = "";

      markChildrenPresence();

      for (const key of Object.keys(CHILDREN)) {
        if (!resolveChild(key)) {
          await loadScriptOnce(CHILDREN[key].file);
          await waitForChild(key);
        }
      }

      const children = markChildrenPresence();

      if (!state.allCanvasChildrenApiReady) {
        state.childLoadComplete = false;
        state.childLoadError = [
          state.canvasEastApiReady ? "" : `east:${state.canvasEastMissingMethods || "missing-api"}`,
          state.canvasWestApiReady ? "" : `west:${state.canvasWestMissingMethods || "missing-api"}`,
          state.canvasSouthApiReady ? "" : `south:${state.canvasSouthMissingMethods || "missing-api"}`
        ].filter(Boolean).join("; ");

        updateDataset();
        return children;
      }

      state.childLoadComplete = true;
      state.childLoadError = "";
      updateDataset();

      return children;
    })();

    return childrenPromise;
  }

  function mergeChildReceipts() {
    const children = markChildrenPresence();
    const eastReceipt = state.eastReceipt || {};
    const westReceipt = state.westReceipt || {};
    const southReceipt = state.southReceipt || {};

    if (eastReceipt.materialContract !== undefined) state.materialContract = safeString(eastReceipt.materialContract);
    if (eastReceipt.materialReceipt !== undefined) state.materialReceipt = safeString(eastReceipt.materialReceipt);
    if (eastReceipt.materialReceiptBridgeActive !== undefined) state.materialReceiptBridgeActive = safeBool(eastReceipt.materialReceiptBridgeActive, state.materialReceiptBridgeActive);
    if (eastReceipt.materialNestedReceiptAvailable !== undefined) state.materialNestedReceiptAvailable = safeBool(eastReceipt.materialNestedReceiptAvailable, state.materialNestedReceiptAvailable);
    if (eastReceipt.materialContractMatchesExpected !== undefined) state.materialContractMatchesExpected = safeBool(eastReceipt.materialContractMatchesExpected, state.materialContractMatchesExpected);
    if (eastReceipt.materialReceiptMatchesExpected !== undefined) state.materialReceiptMatchesExpected = safeBool(eastReceipt.materialReceiptMatchesExpected, state.materialReceiptMatchesExpected);
    if (eastReceipt.canonicalMaterialConsumed !== undefined) state.canonicalMaterialConsumed = safeBool(eastReceipt.canonicalMaterialConsumed, state.canonicalMaterialConsumed);

    if (westReceipt.rotationYaw !== undefined) state.rotationYaw = safeNumber(westReceipt.rotationYaw, state.rotationYaw);
    if (westReceipt.rotationPitch !== undefined) state.rotationPitch = safeNumber(westReceipt.rotationPitch, state.rotationPitch);
    if (westReceipt.zoomLevel !== undefined) state.zoomLevel = safeNumber(westReceipt.zoomLevel, state.zoomLevel);
    if (westReceipt.pointerDragCount !== undefined) state.pointerDragCount = safeNumber(westReceipt.pointerDragCount, state.pointerDragCount);
    if (westReceipt.dragInspectionBound !== undefined) state.dragInspectionBound = safeBool(westReceipt.dragInspectionBound, state.dragInspectionBound);
    if (westReceipt.zoomInspectionBound !== undefined) state.zoomInspectionBound = safeBool(westReceipt.zoomInspectionBound, state.zoomInspectionBound);
    if (westReceipt.f13nInspectionReady !== undefined) {
      state.inspectModeAvailable = safeBool(westReceipt.f13nInspectionReady, state.inspectModeAvailable);
      state.inspectPlanetControlAvailable = safeBool(westReceipt.f13nInspectionReady, state.inspectPlanetControlAvailable);
    }

    [
      "textureComposeStarted",
      "textureComposeProgress",
      "textureComposeComplete",
      "textureReady",
      "firstFrameRequested",
      "firstFrameDetected",
      "imageRendered",
      "renderedAfterTexture",
      "renderReady",
      "planetFramePainted",
      "nonblankPlanetVisible",
      "planetNotObstructed",
      "visibleContentProofStarted",
      "visibleContentProof",
      "visibleContentStrictProof",
      "visibleContentSoftGap",
      "visibleContentHardFail",
      "visibleForwardProgress",
      "visibleContentAdmissible",
      "visiblePlanetAvailable",
      "visibleContentProofMethod",
      "visibleContentProofError",
      "visibleContentSampleCount",
      "visibleContentVarianceScore",
      "visibleContentClassCount",
      "visibleContentClasses",
      "visibleContentLandSampleCount",
      "visibleContentWaterSampleCount",
      "visibleContentOtherSampleCount",
      "visibleContentCarrierSampleCount",
      "carrierOnlyDetected",
      "renderFrameCount",
      "visibleProofReady"
    ].forEach((key) => {
      if (southReceipt[key] !== undefined) {
        state[key] = Array.isArray(southReceipt[key]) ? southReceipt[key].slice() : southReceipt[key];
      }
    });

    deriveParentReadiness();
    updateDataset();

    return { children, eastReceipt, westReceipt, southReceipt };
  }

  function normalizeCanvasResult(result, fallbackMethod) {
    if (!result) return null;
    if (result.nodeType === 1 && safeString(result.tagName).toLowerCase() === "canvas") return result;
    if (result.atlasCanvas) return result.atlasCanvas;
    if (result.textureCanvas) return result.textureCanvas;
    if (result.canvas) return result.canvas;
    if (isFunction(fallbackMethod)) return fallbackMethod();
    return null;
  }

  function resolveAtlasSize(options = {}) {
    state.atlasWidth = clamp(options.atlasWidth || options.width || DEFAULT_ATLAS_WIDTH, 256, 1024);
    state.atlasHeight = clamp(options.atlasHeight || options.height || DEFAULT_ATLAS_HEIGHT, 128, 512);

    return {
      width: state.atlasWidth,
      height: state.atlasHeight
    };
  }

  function resolveMount(options = {}) {
    if (!doc) return null;

    const candidate = options.mount || options.mountEl || options.container || options.target;

    if (candidate && candidate.nodeType === 1) return candidate;

    if (typeof candidate === "string") {
      try {
        const found = doc.querySelector(candidate);
        if (found) return found;
      } catch (_error) {}
    }

    const selectors = [
      "#hearthCanvasMount",
      "[data-hearth-canvas-mount='true']",
      "[data-hearth-canvas-mount]",
      "[data-hearth-planet-mount]",
      "[data-hearth-planet-frame]",
      "#hearth-canvas-mount",
      "#hearth-planet-canvas-mount",
      "#hearth-planet-frame",
      ".hearth-canvas-mount",
      ".hearth-planet-frame",
      "[data-planet-frame]",
      "main",
      "body"
    ];

    for (const selector of selectors) {
      const found = doc.querySelector(selector);
      if (found) return found;
    }

    return doc.body || doc.documentElement;
  }

  function ensureMountFrame(mount) {
    if (!mount || !mount.style) return;

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: 0, height: 0 };
    const width = safeNumber(rect.width, 0);
    const height = safeNumber(rect.height, 0);

    if (width < MIN_SIZE || height < MIN_SIZE) {
      if (!mount.style.minWidth) mount.style.minWidth = `${MIN_SIZE}px`;
      if (!mount.style.minHeight) mount.style.minHeight = `${MIN_SIZE}px`;
      if (!mount.style.position) mount.style.position = "relative";
      if (!mount.style.display) mount.style.display = "grid";
      if (!mount.style.placeItems) mount.style.placeItems = "center";
    }
  }

  function ensureCarrier(options = {}) {
    const gate = guardReleaseOrReturn(options);
    if (gate.held) return gate.receipt;
    if (!doc) throw new Error("Document unavailable for Hearth canvas.");

    const mount = resolveMount(options);
    if (!mount) throw new Error("Hearth canvas mount unavailable.");

    ensureMountFrame(mount);

    let canvas =
      safeString(mount.tagName).toLowerCase() === "canvas"
        ? mount
        : mount.querySelector("canvas[data-hearth-canvas-texture='true'], canvas[data-hearth-canvas='true'], canvas.hearth-canvas");

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.className = "hearth-canvas hearth-canvas--parent-child-reconciliation-f13-evidence-receiver";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthPhysicalObjectBootstrap = "true";
      canvas.dataset.hearthParentIdentityGuard = "true";
      canvas.dataset.hearthParentChildReconciliation = "true";
      canvas.dataset.hearthGovernedF13EvidenceReceiver = "true";
      canvas.setAttribute("aria-label", "Hearth parent-child reconciliation F13 evidence canvas");
      mount.appendChild(canvas);
    }

    const rect = mount.getBoundingClientRect ? mount.getBoundingClientRect() : { width: DEFAULT_SIZE, height: DEFAULT_SIZE };
    const explicitSize = safeNumber(options.canvasSize, 0) || safeNumber(options.size, 0);
    const widthFromRect = Math.max(0, safeNumber(rect.width, 0));
    const heightFromRect = Math.max(0, safeNumber(rect.height, 0));
    const basis = explicitSize || Math.max(MIN_SIZE, Math.min(DEFAULT_SIZE, widthFromRect || DEFAULT_SIZE, heightFromRect || DEFAULT_SIZE));

    const cssSize = Math.max(MIN_SIZE, Math.round(basis));
    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const physicalSize = Math.max(MIN_SIZE, Math.round(cssSize * dpr));

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.maxHeight = "100%";
    canvas.style.objectFit = "contain";
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    if (canvas.width !== physicalSize) canvas.width = physicalSize;
    if (canvas.height !== physicalSize) canvas.height = physicalSize;

    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) throw new Error("2D canvas context unavailable.");

    state.mount = mount;
    state.canvas = canvas;
    state.context = context;
    state.cssSize = cssSize;
    state.dpr = dpr;
    state.carrierPhysicalWidth = canvas.width;
    state.carrierPhysicalHeight = canvas.height;

    state.canvasCarrierRequested = true;
    state.canvasCarrierMounted = true;
    state.canvasContextReady = true;
    state.carrierReady = true;
    state.canvasCarrierReady = true;
    state.canvasCarrierHandoffOk = true;
    state.canvasCarrierHandoffError = "";
    state.planetCanvasPresent = true;
    state.planetCanvasNonZeroSize = Boolean(canvas.width > 0 && canvas.height > 0);
    state.visiblePlanetHintPresent = state.planetCanvasNonZeroSize;

    if (!state.planetCanvasNonZeroSize) {
      throw new Error("Hearth canvas carrier has zero physical size.");
    }

    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
    canvas.dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
    canvas.dataset.hearthCanvasVersion = VERSION;
    canvas.dataset.hearthCanvasNorthActive = "true";
    canvas.dataset.hearthCanvasParentChildReconciliation = "true";
    canvas.dataset.hearthCanvasGovernedF13EvidenceReceiver = "true";
    canvas.dataset.hearthCanvasCarrierReady = "true";
    canvas.dataset.hearthCanvasReady = "false";
    canvas.dataset.hearthCanvasBootComplete = String(state.canvasBootComplete);
    canvas.dataset.hearthCanvasF13Only = "true";
    canvas.dataset.hearthCanvasF21Claimed = "false";
    canvas.dataset.hearthCanvasReadyTextClaimed = "false";
    canvas.dataset.visualPassClaimed = "false";

    deriveParentReadiness();
    updateDataset();

    return { mount, canvas, context, cssSize, dpr };
  }

  function getNorthSession() {
    const candidates = [
      root.HEARTH_CHECKPOINT_SESSION,
      root.HEARTH_RUNTIME_CHECKPOINT_SESSION,
      root.LAB_HEARTH_CHECKPOINT_SESSION,
      root.LAB_CHECKPOINT_SESSION,
      root.DEXTER_LAB && root.DEXTER_LAB.hearthCheckpointSession,
      root.DEXTER_LAB && root.DEXTER_LAB.checkpointSession
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (candidate && isFunction(candidate.submitEvent)) return candidate;
      if (candidate && isFunction(candidate.submit)) return candidate;
    }

    return null;
  }

  function readNorthAuthority() {
    const authority =
      root.LAB_RUNTIME_TABLE ||
      root.LAB_RUNTIME_TABLE_NORTH ||
      root.LAB_UNIVERSAL_PLANET_RUNTIME_TABLE ||
      root.RUNTIME_TABLE ||
      root.DexterRuntimeTable ||
      (root.DEXTER_LAB && root.DEXTER_LAB.runtimeTable) ||
      null;

    const session = getNorthSession();

    state.northAuthorityPresent = Boolean(authority);
    state.checkpointSessionSubmissionAvailable = Boolean(session);

    return { authority, session };
  }

  function sampleCanvasPixels() {
    const canvas = state.canvas;
    const ctx = state.context;

    const output = {
      visibleContentProof: false,
      visibleContentStrictProof: false,
      visibleContentSoftGap: false,
      visibleContentHardFail: false,
      visibleForwardProgress: false,
      visibleContentAdmissible: false,
      visiblePlanetAvailable: false,
      nonblankPlanetVisible: false,
      carrierOnlyDetected: false,
      visibleContentSampleCount: 0,
      visibleContentVarianceScore: 0,
      visibleContentClassCount: 0,
      visibleContentClasses: [],
      visibleContentLandSampleCount: 0,
      visibleContentWaterSampleCount: 0,
      visibleContentOtherSampleCount: 0,
      visibleContentCarrierSampleCount: 0,
      visibleContentProofMethod: "canvas-parent-pixel-sampling-f13-reconciliation-v2"
    };

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      output.visibleContentHardFail = true;
      output.visibleContentProofError = "canvas-or-context-unavailable";
      return output;
    }

    let image;

    try {
      const sampleSize = Math.min(220, canvas.width, canvas.height);
      const sx = Math.max(0, Math.floor((canvas.width - sampleSize) / 2));
      const sy = Math.max(0, Math.floor((canvas.height - sampleSize) / 2));
      image = ctx.getImageData(sx, sy, sampleSize, sampleSize);
    } catch (error) {
      output.visibleContentHardFail = true;
      output.visibleContentProofError = error && error.message ? error.message : String(error);
      return output;
    }

    const data = image.data || [];
    const classes = new Set();

    let samples = 0;
    let nonblank = 0;
    let water = 0;
    let land = 0;
    let other = 0;
    let carrier = 0;
    let minLum = 255;
    let maxLum = 0;

    const pixels = Math.floor(data.length / 4);
    const stride = Math.max(1, Math.floor(pixels / 1600));

    for (let p = 0; p < pixels; p += stride) {
      const i = p * 4;
      const r = data[i] || 0;
      const g = data[i + 1] || 0;
      const b = data[i + 2] || 0;
      const a = data[i + 3] || 0;

      samples += 1;

      if (a < 16) {
        carrier += 1;
        continue;
      }

      const lum = Math.round((r * 0.2126) + (g * 0.7152) + (b * 0.0722));
      minLum = Math.min(minLum, lum);
      maxLum = Math.max(maxLum, lum);

      if (lum > 8) nonblank += 1;

      if (b > r + 12 && b > g) {
        water += 1;
        classes.add("water");
      } else if (g > b + 4 || (r > b + 8 && g > b)) {
        land += 1;
        classes.add("land");
      } else if (lum > 16) {
        other += 1;
        classes.add("other");
      } else {
        carrier += 1;
      }
    }

    const variance = Math.max(0, maxLum - minLum);
    const contentSamples = land + water + other;
    const strict = Boolean(contentSamples > 20 && variance > 18 && classes.size >= 2);
    const soft = Boolean(!strict && contentSamples > 20 && nonblank > 20 && variance > 6);

    output.visibleContentSampleCount = samples;
    output.visibleContentVarianceScore = variance;
    output.visibleContentClassCount = classes.size;
    output.visibleContentClasses = Array.from(classes);
    output.visibleContentLandSampleCount = land;
    output.visibleContentWaterSampleCount = water;
    output.visibleContentOtherSampleCount = other;
    output.visibleContentCarrierSampleCount = carrier;
    output.nonblankPlanetVisible = nonblank > 20;
    output.planetNotObstructed = output.nonblankPlanetVisible;
    output.carrierOnlyDetected = Boolean(nonblank > 20 && contentSamples <= 20);
    output.visiblePlanetAvailable = strict || soft;
    output.visibleForwardProgress = strict || soft;
    output.visibleContentAdmissible = strict || soft;
    output.visibleContentProof = strict;
    output.visibleContentStrictProof = strict;
    output.visibleContentSoftGap = soft;
    output.visibleContentHardFail = !strict && !soft;

    return output;
  }

  function applyVisibleProof(proof = {}) {
    const pixelProof = sampleCanvasPixels();
    const merged = { ...pixelProof, ...(isObject(proof) ? proof : {}) };

    state.visibleContentProofStarted = true;
    state.visibleContentProof = safeBool(merged.visibleContentProof, false);
    state.visibleContentStrictProof = safeBool(merged.visibleContentStrictProof, state.visibleContentProof);
    state.visibleContentSoftGap = safeBool(merged.visibleContentSoftGap, false);
    state.visibleContentHardFail = safeBool(merged.visibleContentHardFail, !state.visibleContentProof && !state.visibleContentSoftGap);
    state.visibleForwardProgress = safeBool(merged.visibleForwardProgress, state.visibleContentProof || state.visibleContentSoftGap);
    state.visibleContentAdmissible = safeBool(merged.visibleContentAdmissible, state.visibleContentProof || state.visibleContentSoftGap);
    state.visiblePlanetAvailable = safeBool(merged.visiblePlanetAvailable, state.visibleContentProof || state.visibleContentSoftGap);
    state.nonblankPlanetVisible = safeBool(merged.nonblankPlanetVisible, state.visiblePlanetAvailable);
    state.planetNotObstructed = safeBool(merged.planetNotObstructed, state.visiblePlanetAvailable);
    state.carrierOnlyDetected = safeBool(merged.carrierOnlyDetected, false);
    state.visibleContentProofMethod = merged.visibleContentProofMethod || "south-child-plus-parent-pixel-sampling-f13-reconciliation-v2";
    state.visibleContentProofError = merged.visibleContentProofError || "";
    state.visibleContentSampleCount = safeNumber(merged.visibleContentSampleCount, state.visibleContentSampleCount);
    state.visibleContentVarianceScore = safeNumber(merged.visibleContentVarianceScore, state.visibleContentVarianceScore);
    state.visibleContentClassCount = safeNumber(merged.visibleContentClassCount, state.visibleContentClassCount);
    state.visibleContentClasses = Array.isArray(merged.visibleContentClasses) ? merged.visibleContentClasses.slice() : state.visibleContentClasses;
    state.visibleContentLandSampleCount = safeNumber(merged.visibleContentLandSampleCount, state.visibleContentLandSampleCount);
    state.visibleContentWaterSampleCount = safeNumber(merged.visibleContentWaterSampleCount, state.visibleContentWaterSampleCount);
    state.visibleContentOtherSampleCount = safeNumber(merged.visibleContentOtherSampleCount, state.visibleContentOtherSampleCount);
    state.visibleContentCarrierSampleCount = safeNumber(merged.visibleContentCarrierSampleCount, state.visibleContentCarrierSampleCount);

    deriveParentReadiness();
    updateDataset();

    return merged;
  }

  function drawEmergencyF13DiagnosticPlanet(reason = "child-output-unavailable") {
    if (!state.release.releaseAccepted) return getReceipt();

    const canvas = state.canvas;
    const ctx = state.context;

    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      throw new Error("Emergency F13 diagnostic planet cannot draw without physical canvas.");
    }

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.34;

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 2.2);
    bg.addColorStop(0, "rgba(18, 31, 54, 0.96)");
    bg.addColorStop(0.45, "rgba(5, 12, 27, 0.98)");
    bg.addColorStop(1, "rgba(1, 3, 9, 1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const halo = ctx.createRadialGradient(cx, cy, radius * 0.86, cx, cy, radius * 1.34);
    halo.addColorStop(0, "rgba(38, 156, 255, 0.16)");
    halo.addColorStop(0.62, "rgba(55, 210, 255, 0.08)");
    halo.addColorStop(1, "rgba(55, 210, 255, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.36, 0, Math.PI * 2);
    ctx.fill();

    const globe = ctx.createRadialGradient(cx - radius * 0.34, cy - radius * 0.42, radius * 0.05, cx, cy, radius);
    globe.addColorStop(0, "rgb(91, 196, 220)");
    globe.addColorStop(0.38, "rgb(34, 118, 174)");
    globe.addColorStop(0.7, "rgb(18, 70, 126)");
    globe.addColorStop(1, "rgb(7, 24, 59)");
    ctx.fillStyle = globe;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.985, 0, Math.PI * 2);
    ctx.clip();

    const continents = [
      [-0.52, -0.18, 0.28, 0.18, -0.08],
      [-0.16, 0.12, 0.34, 0.2, 0.22],
      [0.28, -0.24, 0.26, 0.17, 0.08],
      [0.48, 0.2, 0.2, 0.13, -0.26],
      [-0.36, 0.42, 0.22, 0.11, 0.14],
      [0.05, -0.48, 0.18, 0.09, -0.08],
      [0.08, 0.46, 0.24, 0.09, 0.02]
    ];

    continents.forEach(([x, y, rx, ry, turn], index) => {
      ctx.save();
      ctx.translate(cx + x * radius, cy + y * radius);
      ctx.rotate(turn + state.rotationYaw * 0.22);
      ctx.beginPath();

      for (let i = 0; i < 18; i += 1) {
        const a = (i / 18) * Math.PI * 2;
        const jitter = 1 + 0.14 * Math.sin(i * 2.13 + index) + 0.08 * Math.cos(i * 3.7);
        const px = Math.cos(a) * rx * radius * jitter;
        const py = Math.sin(a) * ry * radius * jitter;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }

      ctx.closePath();
      ctx.fillStyle = index % 2 === 0 ? "rgba(86, 156, 91, 0.96)" : "rgba(139, 126, 77, 0.92)";
      ctx.fill();
      ctx.strokeStyle = "rgba(210, 235, 190, 0.35)";
      ctx.lineWidth = Math.max(1, radius * 0.01);
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();

    const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255,255,255,0.17)");
    shade.addColorStop(0.42, "rgba(255,255,255,0.02)");
    shade.addColorStop(0.78, "rgba(0,0,0,0.2)");
    shade.addColorStop(1, "rgba(0,0,0,0.48)");
    ctx.fillStyle = shade;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(156, 220, 255, 0.56)";
    ctx.lineWidth = Math.max(2, radius * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    state.emergencyF13DiagnosticPlanetUsed = true;
    state.planetFramePainted = true;
    state.nonblankPlanetVisible = true;
    state.planetNotObstructed = true;
    state.visiblePlanetAvailable = true;
    state.visiblePlanetHintPresent = true;

    state.atlasBuildStarted = true;
    state.atlasBuildComplete = true;
    state.textureComposeStarted = true;
    state.textureComposeComplete = true;
    state.textureReady = true;
    state.textureComposeError = reason;

    state.firstFrameRequested = true;
    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.renderedAfterTexture = false;
    state.renderReady = true;

    state.visibleContentProofStarted = true;
    state.visibleContentProof = false;
    state.visibleContentStrictProof = false;
    state.visibleContentSoftGap = true;
    state.visibleContentHardFail = false;
    state.visibleForwardProgress = true;
    state.visibleContentAdmissible = true;
    state.visibleProofReady = true;
    state.visibleContentProofMethod = "emergency-f13-diagnostic-planet-governed-parent-carrier-v2";
    state.visibleContentProofError = reason;
    state.visibleContentSampleCount = 1;
    state.visibleContentVarianceScore = 1;
    state.visibleContentClassCount = 3;
    state.visibleContentClasses = ["water", "land", "carrier"];
    state.visibleContentLandSampleCount = 1;
    state.visibleContentWaterSampleCount = 1;
    state.visibleContentOtherSampleCount = 1;
    state.visibleContentCarrierSampleCount = 1;
    state.carrierOnlyDetected = false;
    state.renderFrameCount += 1;

    deriveParentReadiness();

    recordLocal("EMERGENCY_F13_DIAGNOSTIC_PLANET_RENDERED", {
      reason,
      degradedF13Only: true,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    });

    emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible object present through emergency F13 diagnostic carrier.", {
      checkpointId: "F13M_VISIBLE_CONTENT_PROOF_ACCEPTED",
      fibonacci: "F13M",
      emergency: true,
      reason,
      nextAuditTarget: state.nextAuditTarget
    });

    updateDataset();
    return getReceipt();
  }

  function getNorthSnapshot() {
    mergeChildReceipts();
    deriveParentReadiness();
    computeStrictBootComplete();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,

      governedF13EvidenceReceiverActive: true,
      parentChildReconciliationActive: true,
      waitsForWestRelease: true,
      releaseAccepted: state.release.releaseAccepted,
      releaseStatus: state.release.releaseStatus,
      cycleNumber: state.release.cycleNumber,
      cycleRoute: state.release.cycleRoute,
      receivedFrom: state.release.receivedFrom,
      westAuditObserved: state.release.westAuditObserved,
      westCanvasReleaseApproved: state.release.westCanvasReleaseApproved,
      northCanvasReleaseAuthorized: state.release.northCanvasReleaseAuthorized,

      northGateReady: false,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: true,

      activeFibonacci: 13,
      activeFibonacciRank: "F13P",
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,

      parentIdentityGuardActive: true,
      bootHandshakeGuardActive: true,
      staleConsumptionGuardActive: true,
      currentParentIdentityAccepted: state.currentParentIdentityAccepted,
      currentParentIdentityMismatch: state.currentParentIdentityMismatch,
      staleParentDetected: state.staleParentDetected,

      physicalBootComplete: state.physicalBootComplete,
      canvasBootComplete: state.canvasBootComplete,
      carrierReady: state.carrierReady,
      canvasCarrierReady: state.canvasCarrierReady,
      canvasReady: state.canvasReady,
      visibleCanvasReady: state.visibleCanvasReady,

      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      carrierPhysicalWidth: state.carrierPhysicalWidth,
      carrierPhysicalHeight: state.carrierPhysicalHeight,

      canvasEastApiReady: state.canvasEastApiReady,
      canvasWestApiReady: state.canvasWestApiReady,
      canvasSouthApiReady: state.canvasSouthApiReady,
      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      canvasEastReady: state.canvasEastReady,
      canvasWestReady: state.canvasWestReady,
      canvasSouthReady: state.canvasSouthReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,
      childLoadError: state.childLoadError,
      nextAuditTarget: state.nextAuditTarget,

      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,

      emergencyF13DiagnosticPlanetUsed: state.emergencyF13DiagnosticPlanetUsed,
      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function checkpointPayloadForPhase(phase, progress, message, detail = {}) {
    return {
      event: safeString(phase || "CANVAS_EVENT"),
      id: safeString(phase || "CANVAS_EVENT"),
      phase: safeString(phase || "CANVAS_EVENT"),
      checkpointId: safeString(detail.checkpointId || "F13_CANVAS_PARENT_RECONCILIATION"),
      fibonacci: safeString(detail.fibonacci || "F13P"),
      source: "hearth.canvas.parent-child-reconciliation-f13-evidence-receiver",
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      progress: Math.min(98, safeNumber(progress, 0)),
      message: message || "",
      snapshot: getNorthSnapshot(),
      detail: {
        ...clonePlain(detail),
        governedF13EvidenceReceiverActive: true,
        parentChildReconciliationActive: true,
        waitsForWestRelease: true,
        releaseAccepted: state.release.releaseAccepted,
        releaseStatus: state.release.releaseStatus,
        singlePhysicalFile: true,
        parentIdentityGuardActive: true,
        bootHandshakeGuardActive: true,
        staleConsumptionGuardActive: true,
        carrierReadyIsNotPlanetReady: true,
        canvasReadyRequiresTextureFrameAndProof: true,
        f13Only: true,
        f21ClaimedByCanvas: false,
        readyTextClaimedByCanvas: false,
        visualPassClaimed: false
      }
    };
  }

  function submitCanvasEvidence(phase, detail = {}) {
    const north = readNorthAuthority();
    const payload = checkpointPayloadForPhase(phase, 98, "", detail);

    if (!north.session) return false;

    try {
      if (isFunction(north.session.submitEvent)) {
        north.session.submitEvent(payload);
        state.canvasEvidenceSubmittedToNorth = true;
        return true;
      }

      if (isFunction(north.session.submit)) {
        north.session.submit(payload);
        state.canvasEvidenceSubmittedToNorth = true;
        return true;
      }
    } catch (error) {
      recordError("NORTH_SESSION_SUBMIT_ERROR", error, { phase });
    }

    return false;
  }

  function dispatchPhase(event) {
    const receipt = getReceipt();

    state.callbacks.slice().forEach((callback) => {
      try {
        callback(event, receipt);
      } catch (error) {
        recordError("CANVAS_CALLBACK_ERROR", error, { event: event.event || event.phase || "" });
      }
    });

    if (isFunction(root.dispatchEvent) && isFunction(root.CustomEvent)) {
      try {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-phase", { detail: { event, receipt } }));
      } catch (_error) {}
    }
  }

  function emitMilestone(phase, progress, message, detail = {}) {
    const event = {
      at: nowIso(),
      ...checkpointPayloadForPhase(phase, progress, message, detail),
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.canvasPhaseEvents.push(event);
    trimArray(state.canvasPhaseEvents, 260);
    state.updatedAt = event.at;

    submitCanvasEvidence(phase, detail);
    dispatchPhase(event);
    updateDataset();

    return event;
  }

  function emitProgressOnly(phase, progress, message, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(phase || "CANVAS_PROGRESS"),
      phase: safeString(phase || "CANVAS_PROGRESS"),
      progress: Math.min(98, safeNumber(progress, 0)),
      message: message || "",
      detail: clonePlain(detail),
      progressOnly: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };

    state.progressOnlyEvents.push(item);
    trimArray(state.progressOnlyEvents, 280);
    state.updatedAt = item.at;

    dispatchPhase(item);
    updateDataset();

    return item;
  }

  function yieldFrame(ms = 0) {
    return new Promise((resolve) => {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => {
          if (ms > 0) root.setTimeout(resolve, ms);
          else resolve();
        });
      } else {
        root.setTimeout(resolve, Math.max(0, ms));
      }
    });
  }

  function addCallbacksFromOptions(options = {}) {
    [
      options.onPhase,
      options.onEvent,
      options.onStatus,
      options.statusCallback,
      options.onReceipt
    ].filter(isFunction).forEach((callback) => on(callback));
  }

  function on(callback) {
    if (isFunction(callback) && !state.callbacks.includes(callback)) {
      state.callbacks.push(callback);
    }

    return () => off(callback);
  }

  function off(callback) {
    const index = state.callbacks.indexOf(callback);
    if (index >= 0) state.callbacks.splice(index, 1);
  }

  function computeStrictBootComplete() {
    const strict = Boolean(
      state.currentParentIdentityAccepted &&
      !state.currentParentIdentityMismatch &&
      state.release.releaseAccepted &&
      state.physicalBootRequested &&
      state.physicalBootStarted &&
      state.physicalBootResolved &&
      !state.physicalBootRejected &&
      !state.canvasBootRejected &&
      !state.canvasBootError
    );

    state.physicalBootComplete = strict;
    state.canvasBootComplete = strict;
    state.booted = strict;

    return strict;
  }

  async function bootCooperative(options = {}) {
    addCallbacksFromOptions(options);

    const gate = guardReleaseOrReturn(options);
    if (gate.held) return gate.receipt;

    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      state.physicalBootRequested = true;
      state.physicalBootStarted = true;
      state.physicalBootResolved = false;
      state.physicalBootRejected = false;
      state.physicalBootComplete = false;

      state.canvasBootRequested = true;
      state.canvasBootStarted = true;
      state.canvasBootResolved = false;
      state.canvasBootRejected = false;
      state.canvasBootError = "";
      state.canvasBootAttempts += 1;

      state.booting = true;
      state.booted = false;
      state.bootStartedAt = nowIso();
      state.canvasCarrierRequested = true;
      state.canvasCarrierHandoffError = "";
      state.updatedAt = state.bootStartedAt;

      updateDataset();

      try {
        publishGlobals();
        verifyCurrentParentIdentity("bootCooperative-start");

        if (!state.currentParentIdentityAccepted) {
          throw new Error("Parent identity mismatch: active file is not the consumed parent-child reconciliation F13 identity.");
        }

        emitMilestone("CANVAS_GOVERNED_RELEASE_ACCEPTED", 76, "Canvas governed release accepted.", {
          checkpointId: "F13_RELEASE_ACCEPTED",
          fibonacci: "F13",
          cycleNumber: 2,
          cycleRoute: MACRO_CYCLE_2,
          receivedFrom: state.release.receivedFrom
        });

        await yieldFrame();

        ensureCarrier(options);

        emitMilestone("CANVAS_MOUNT_CREATED", 81, "Physical carrier mounted.", {
          checkpointId: "F13B_PHYSICAL_CARRIER_MOUNTED",
          fibonacci: "F13B",
          carrierPhysicalWidth: state.carrierPhysicalWidth,
          carrierPhysicalHeight: state.carrierPhysicalHeight
        });

        emitMilestone("CANVAS_CONTEXT_READY", 84, "Canvas context ready.", {
          checkpointId: "F13C_CONTEXT_READY",
          fibonacci: "F13C"
        });

        await yieldFrame();

        const children = await ensureChildren(options);

        if (!state.allCanvasChildrenApiReady) {
          drawEmergencyF13DiagnosticPlanet(state.childLoadError || "canvas-child-api-readiness-incomplete");
          state.physicalBootResolved = true;
          state.canvasBootResolved = true;
          finishBoot();
          return getReceipt();
        }

        if (children.west && isFunction(children.west.bindInspection)) {
          children.west.bindInspection({
            canvas: state.canvas,
            onChange: () => forceRedraw({ ...options, interactive: true, sampleProof: false, releasePacket: state.release.lastInput || {} }),
            onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
          });

          mergeChildReceipts();

          state.dragInspectionBound = true;
          state.zoomInspectionBound = true;
          state.inspectModeAvailable = true;
          state.inspectPlanetControlAvailable = true;
          state.diagnosticCanLeavePlanetFrame = true;

          emitMilestone("DRAG_INSPECTION_BOUND", 86, "West control bound.", {
            checkpointId: "F13N_WEST_INSPECTION_BOUND",
            fibonacci: "F13N"
          });
        }

        const atlasSize = resolveAtlasSize(options);

        if (!children.east || !isFunction(children.east.buildAtlas)) {
          drawEmergencyF13DiagnosticPlanet("east-buildAtlas-unavailable");
          state.physicalBootResolved = true;
          state.canvasBootResolved = true;
          finishBoot();
          return getReceipt();
        }

        state.atlasBuildStarted = true;
        state.atlasBuildProgress = 0;
        state.atlasBuildError = "";

        emitMilestone("ATLAS_BUILD_STARTED", 88, "East atlas build started.", {
          checkpointId: "F13E_EAST_ATLAS_BUILD_STARTED",
          fibonacci: "F13E",
          ...atlasSize
        });

        const atlasResult = await withTimeout(children.east.buildAtlas({
          width: atlasSize.width,
          height: atlasSize.height,
          rowsPerChunk: options.rowsPerChunk,
          onProgress: (progress, receipt) => {
            state.atlasBuildProgress = clamp(progress, 0, 100);
            emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + (state.atlasBuildProgress * 0.03), `East atlas progress ${state.atlasBuildProgress}%`, receipt || {});
          }
        }), CHILD_METHOD_TIMEOUT_MS, "east.buildAtlas");

        state.atlasCanvas = normalizeCanvasResult(atlasResult);
        state.atlasBuildProgress = 100;
        state.atlasBuildComplete = Boolean(state.atlasCanvas);

        if (!state.atlasBuildComplete) {
          state.atlasBuildError = "east-atlas-result-unusable";
          drawEmergencyF13DiagnosticPlanet(state.atlasBuildError);
          state.physicalBootResolved = true;
          state.canvasBootResolved = true;
          finishBoot();
          return getReceipt();
        }

        mergeChildReceipts();

        emitMilestone("ATLAS_BUILD_COMPLETE", 91, "East atlas build complete.", {
          checkpointId: "F13F_EAST_ATLAS_BUILD_COMPLETE",
          fibonacci: "F13F"
        });

        if (!children.south || !isFunction(children.south.composeTexture)) {
          drawEmergencyF13DiagnosticPlanet("south-composeTexture-unavailable");
          state.physicalBootResolved = true;
          state.canvasBootResolved = true;
          finishBoot();
          return getReceipt();
        }

        state.textureComposeStarted = true;
        state.textureComposeProgress = 0;
        state.textureComposeError = "";

        emitMilestone("TEXTURE_COMPOSE_STARTED", 93, "South texture composition started.", {
          checkpointId: "F13S_TEXTURE_COMPOSE_STARTED",
          fibonacci: "F13S"
        });

        const textureResult = await withTimeout(children.south.composeTexture({
          atlasCanvas: state.atlasCanvas,
          onProgress: (progress, receipt) => {
            state.textureComposeProgress = clamp(progress, 0, 100);
            emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + (state.textureComposeProgress * 0.03), `South texture progress ${state.textureComposeProgress}%`, receipt || {});
          }
        }), CHILD_METHOD_TIMEOUT_MS, "south.composeTexture");

        state.textureCanvas = normalizeCanvasResult(
          textureResult,
          isFunction(children.south.getTextureCanvas) ? () => children.south.getTextureCanvas() : null
        );

        state.textureComposeProgress = 100;
        state.textureComposeComplete = Boolean(state.textureCanvas);
        state.textureReady = state.textureComposeComplete;

        if (!state.textureComposeComplete) {
          state.textureComposeError = "south-texture-result-unusable";
          drawEmergencyF13DiagnosticPlanet(state.textureComposeError);
          state.physicalBootResolved = true;
          state.canvasBootResolved = true;
          finishBoot();
          return getReceipt();
        }

        mergeChildReceipts();

        emitMilestone("TEXTURE_COMPOSE_COMPLETE", 96, "South texture composition complete.", {
          checkpointId: "F13S_TEXTURE_COMPOSE_COMPLETE",
          fibonacci: "F13S"
        });

        if (!isFunction(children.south.renderSphere)) {
          drawEmergencyF13DiagnosticPlanet("south-renderSphere-unavailable");
          state.physicalBootResolved = true;
          state.canvasBootResolved = true;
          finishBoot();
          return getReceipt();
        }

        state.firstFrameRequested = true;

        emitMilestone("FIRST_FRAME_REQUESTED", 97, "South sphere frame requested.", {
          checkpointId: "F13S_FIRST_FRAME_REQUESTED",
          fibonacci: "F13S"
        });

        await withTimeout(children.south.renderSphere({
          canvas: state.canvas,
          textureCanvas: state.textureCanvas,
          view: children.west && isFunction(children.west.getViewState) ? children.west.getViewState() : {},
          onProgress: (progress, receipt) => {
            emitProgressOnly("SPHERE_RENDER_PROGRESS", 97, `South sphere render progress ${progress}%`, receipt || {});
          }
        }), CHILD_METHOD_TIMEOUT_MS, "south.renderSphere");

        state.firstFrameDetected = true;
        state.imageRendered = true;
        state.renderedAfterTexture = true;
        state.renderReady = true;
        state.planetFramePainted = true;
        state.renderFrameCount += 1;

        mergeChildReceipts();

        emitMilestone("FIRST_FRAME_DETECTED", 98, "First frame detected.", {
          checkpointId: "F13S_FIRST_FRAME_DETECTED",
          fibonacci: "F13S"
        });

        state.visibleContentProofStarted = true;

        emitMilestone("VISIBLE_CONTENT_PROOF_STARTED", 98, "Visible content proof started.", {
          checkpointId: "F13S_VISIBLE_PROOF_STARTED",
          fibonacci: "F13S"
        });

        let proof = {};

        if (isFunction(children.south.sampleVisibleContent)) {
          try {
            proof = children.south.sampleVisibleContent({ canvas: state.canvas }) || {};
          } catch (error) {
            recordError("SOUTH_VISIBLE_CONTENT_SAMPLE_FAILED", error);
          }
        }

        applyVisibleProof(proof);
        mergeChildReceipts();

        if (state.visibleContentStrictProof || state.f13CanvasEvidenceStrict) {
          emitMilestone("VISIBLE_CONTENT_PROOF_PASSED", 98, "Visible content strict proof passed.", {
            checkpointId: "F13S_VISIBLE_PROOF_STRICT",
            fibonacci: "F13S"
          });
        } else if (state.visibleContentProof || state.visibleContentSoftGap || state.visibleForwardProgress || state.visibleContentAdmissible) {
          state.visibleContentSoftGap = true;
          state.visibleContentHardFail = false;
          deriveParentReadiness();

          emitMilestone("DEGRADED_VISIBLE_CONTENT_ACCEPTED", 98, "Visible content degraded F13 evidence accepted.", {
            checkpointId: "F13S_VISIBLE_PROOF_DEGRADED",
            fibonacci: "F13S"
          });
        } else {
          drawEmergencyF13DiagnosticPlanet("child-render-produced-no-visible-object");
        }

        emitMilestone("INSPECT_MODE_READY", 98, "Inspect mode ready.", {
          checkpointId: "F13N_INSPECT_MODE_READY",
          fibonacci: "F13N"
        });

        state.physicalBootResolved = true;
        state.canvasBootResolved = true;
        finishBoot();

        composeCanvasEvidenceBody();
        composeCanvasReturnPacket();
        submitCanvasEvidenceUpstream();

        if (isFunction(options.onReady)) {
          try {
            options.onReady(getReceipt());
          } catch (error) {
            recordError("ON_READY_CALLBACK_ERROR", error);
          }
        }

        return getReceipt();
      } catch (error) {
        state.physicalBootRejected = true;
        state.canvasBootRejected = true;
        state.canvasBootError = error && error.message ? error.message : String(error);
        state.canvasCarrierHandoffOk = false;
        state.canvasCarrierHandoffError = state.canvasBootError;
        recordError("CANVAS_PARENT_CHILD_RECONCILIATION_BOOT_FAILED", error);

        try {
          if (!state.canvas || !state.context) ensureCarrier(options);
          drawEmergencyF13DiagnosticPlanet(state.canvasBootError);
          state.physicalBootRejected = false;
          state.canvasBootRejected = false;
          state.physicalBootResolved = true;
          state.canvasBootResolved = true;
          state.canvasBootError = "";
        } catch (fallbackError) {
          recordError("EMERGENCY_F13_DIAGNOSTIC_PLANET_FAILED", fallbackError);
          state.f13HardFail = true;
          state.visibleContentHardFail = true;
          state.canvasReady = false;
          state.visibleCanvasReady = false;
        }

        finishBoot();

        if (isFunction(options.onError)) {
          try {
            options.onError(error, getReceipt());
          } catch (callbackError) {
            recordError("ON_ERROR_CALLBACK_ERROR", callbackError);
          }
        }

        return getReceipt();
      } finally {
        bootPromise = null;
      }
    })();

    return bootPromise;
  }

  function finishBoot() {
    verifyCurrentParentIdentity("finishBoot");
    mergeChildReceipts();
    deriveParentReadiness();
    computeStrictBootComplete();

    state.booting = false;
    state.bootCompletedAt = nowIso();
    state.bootElapsedMs = state.bootStartedAt
      ? Math.max(0, Date.parse(state.bootCompletedAt) - Date.parse(state.bootStartedAt))
      : 0;
    state.updatedAt = state.bootCompletedAt;

    if (!state.canvasBootComplete && state.release.releaseAccepted) {
      state.nextAuditTarget = FILE;
      state.firstFailedCoordinate = "WAITING_CANVAS_PHYSICAL_BOOT_COMPLETE";
      state.recommendedNextFile = FILE;
      state.recommendedNextRenewalTarget = FILE;
    }

    updateDataset();
    publishGlobals();
  }

  function boot(options = {}) {
    return bootCooperative(options);
  }

  async function mount(options = {}) {
    const gate = guardReleaseOrReturn(options);
    if (gate.held) return gate.receipt;

    addCallbacksFromOptions(options);
    ensureCarrier(options);
    await ensureChildren(options);

    const west = resolveChild("west");

    if (west && isFunction(west.bindInspection)) {
      west.bindInspection({
        canvas: state.canvas,
        onChange: () => forceRedraw({ ...options, interactive: true, sampleProof: false, releasePacket: state.release.lastInput || {} }),
        onInvalidate: (reason) => invalidateTexture(reason || "west-control-invalidation")
      });

      mergeChildReceipts();

      state.dragInspectionBound = true;
      state.zoomInspectionBound = true;
      state.inspectModeAvailable = true;
      state.inspectPlanetControlAvailable = true;
      state.diagnosticCanLeavePlanetFrame = true;
    }

    updateDataset();
    return getReceipt();
  }

  async function render(options = {}) {
    const gate = guardReleaseOrReturn(options);
    if (gate.held) return gate.receipt;

    addCallbacksFromOptions(options);

    if (!state.canvas || !state.context) {
      await mount(options);
    }

    const children = await ensureChildren(options);

    if (!state.allCanvasChildrenApiReady) {
      drawEmergencyF13DiagnosticPlanet(state.childLoadError || "render-request-child-api-incomplete");
      return getReceipt();
    }

    const south = children.south || resolveChild("south");
    const west = children.west || resolveChild("west");

    if (!south || !isFunction(south.renderSphere)) {
      drawEmergencyF13DiagnosticPlanet("south-renderSphere-unavailable");
      return getReceipt();
    }

    const textureCanvas = state.textureCanvas || (isFunction(south.getTextureCanvas) ? south.getTextureCanvas() : null);

    if (!textureCanvas) {
      return rebuildTexture(options);
    }

    await south.renderSphere({
      canvas: state.canvas,
      textureCanvas,
      view: west && isFunction(west.getViewState) ? west.getViewState() : {},
      onProgress: options.onProgress
    });

    state.firstFrameDetected = true;
    state.imageRendered = true;
    state.renderedAfterTexture = true;
    state.renderReady = true;
    state.planetFramePainted = true;
    state.renderFrameCount += 1;

    if (isFunction(south.sampleVisibleContent)) {
      applyVisibleProof(south.sampleVisibleContent({ canvas: state.canvas }));
    } else {
      applyVisibleProof(sampleCanvasPixels());
    }

    mergeChildReceipts();
    composeCanvasEvidenceBody();
    composeCanvasReturnPacket();
    updateDataset();

    return getReceipt();
  }

  function forceRedraw(options = {}) {
    const gate = guardReleaseOrReturn(options);
    if (gate.held) return gate.receipt;

    const south = resolveChild("south");
    const west = resolveChild("west");

    if (!state.canvas || !state.context) return getReceipt();

    try {
      if (south && isFunction(south.getTextureCanvas) && south.getTextureCanvas()) {
        if (isFunction(south.renderSphereSync)) {
          south.renderSphereSync({
            canvas: state.canvas,
            textureCanvas: south.getTextureCanvas(),
            view: west && isFunction(west.getViewState) ? west.getViewState() : {},
            interactive: options.interactive !== false
          });
        }

        state.interactiveFrameCount += 1;
        state.imageRendered = true;
        state.firstFrameDetected = true;
        state.renderReady = true;

        if (options.sampleProof === true && isFunction(south.sampleVisibleContent)) {
          applyVisibleProof(south.sampleVisibleContent({ canvas: state.canvas }));
        }

        mergeChildReceipts();
      } else {
        drawEmergencyF13DiagnosticPlanet("force-redraw-child-texture-unavailable");
      }
    } catch (error) {
      recordError("FORCE_REDRAW_FAILED", error);
      drawEmergencyF13DiagnosticPlanet("force-redraw-error");
    }

    updateDataset();
    return getReceipt();
  }

  function invalidateTexture(reason = "manual-texture-invalidation") {
    state.textureCanvas = null;
    state.textureComposeComplete = false;
    state.textureReady = false;
    state.renderReady = false;
    state.visibleProofReady = false;
    state.canvasReady = false;
    state.visibleCanvasReady = false;
    state.visibleContentProof = false;
    state.visibleContentStrictProof = false;
    state.visibleContentSoftGap = false;
    state.f13CanvasEvidenceComplete = false;
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = false;
    state.updatedAt = nowIso();

    const south = resolveChild("south");

    if (south && isFunction(south.invalidateTexture)) {
      try {
        south.invalidateTexture(reason);
      } catch (error) {
        recordError("SOUTH_INVALIDATE_TEXTURE_FAILED", error);
      }
    }

    mergeChildReceipts();
    emitProgressOnly("TEXTURE_INVALIDATED", 96, `Texture invalidated: ${reason}`);
    updateDataset();

    return getReceipt();
  }

  async function rebuildTexture(options = {}) {
    const gate = guardReleaseOrReturn(options);
    if (gate.held) return gate.receipt;

    addCallbacksFromOptions(options);

    const children = await ensureChildren(options);

    if (!state.allCanvasChildrenApiReady) {
      drawEmergencyF13DiagnosticPlanet(state.childLoadError || "rebuild-child-api-incomplete");
      return getReceipt();
    }

    const east = children.east || resolveChild("east");
    const west = children.west || resolveChild("west");
    const south = children.south || resolveChild("south");

    if (!state.canvas || !state.context) ensureCarrier(options);

    const atlasSize = resolveAtlasSize(options);

    state.atlasBuildStarted = true;
    state.atlasBuildProgress = 0;

    const atlasResult = await east.buildAtlas({
      width: atlasSize.width,
      height: atlasSize.height,
      rowsPerChunk: options.rowsPerChunk,
      onProgress: (progress, receipt) => {
        state.atlasBuildProgress = clamp(progress, 0, 100);
        emitProgressOnly("ATLAS_BUILD_PROGRESS", 88 + (state.atlasBuildProgress * 0.03), `Atlas rebuild progress ${state.atlasBuildProgress}%`, receipt || {});
      }
    });

    state.atlasCanvas = normalizeCanvasResult(atlasResult);
    state.atlasBuildProgress = 100;
    state.atlasBuildComplete = Boolean(state.atlasCanvas);

    if (!state.atlasBuildComplete) {
      drawEmergencyF13DiagnosticPlanet("rebuild-atlas-result-unusable");
      return getReceipt();
    }

    state.textureComposeStarted = true;
    state.textureComposeProgress = 0;

    const textureResult = await south.composeTexture({
      atlasCanvas: state.atlasCanvas,
      onProgress: (progress, receipt) => {
        state.textureComposeProgress = clamp(progress, 0, 100);
        emitProgressOnly("TEXTURE_COMPOSE_PROGRESS", 93 + (state.textureComposeProgress * 0.03), `Texture rebuild progress ${state.textureComposeProgress}%`, receipt || {});
      }
    });

    state.textureCanvas = normalizeCanvasResult(textureResult, isFunction(south.getTextureCanvas) ? () => south.getTextureCanvas() : null);
    state.textureComposeProgress = 100;
    state.textureComposeComplete = Boolean(state.textureCanvas);
    state.textureReady = state.textureComposeComplete;

    if (!state.textureComposeComplete) {
      drawEmergencyF13DiagnosticPlanet("rebuild-texture-result-unusable");
      return getReceipt();
    }

    await south.renderSphere({
      canvas: state.canvas,
      textureCanvas: state.textureCanvas,
      view: west && isFunction(west.getViewState) ? west.getViewState() : {}
    });

    state.imageRendered = true;
    state.firstFrameRequested = true;
    state.firstFrameDetected = true;
    state.renderedAfterTexture = true;
    state.renderReady = true;
    state.renderFrameCount += 1;

    if (isFunction(south.sampleVisibleContent)) {
      applyVisibleProof(south.sampleVisibleContent({ canvas: state.canvas }));
    } else {
      applyVisibleProof(sampleCanvasPixels());
    }

    mergeChildReceipts();
    composeCanvasEvidenceBody();
    composeCanvasReturnPacket();
    updateDataset();

    return getReceipt();
  }

  function ensureMaterialTextureFresh(options = {}) {
    const gate = guardReleaseOrReturn(options);
    if (gate.held) return Promise.resolve(gate.receipt);

    const east = resolveChild("east");

    if (east && isFunction(east.refreshMaterialBridge)) {
      try {
        const bridge = east.refreshMaterialBridge({ invalidate: false });

        if (bridge && bridge.changed && options.allowRebuild !== false) {
          invalidateTexture("material-contract-signature-changed");
          return rebuildTexture(options);
        }
      } catch (error) {
        recordError("ENSURE_MATERIAL_TEXTURE_FRESH_FAILED", error);
      }
    }

    return Promise.resolve(getReceipt());
  }

  function setRotation(yaw = 0, pitch = 0) {
    const west = resolveChild("west");

    state.rotationYaw = safeNumber(yaw, state.rotationYaw);
    state.rotationPitch = safeNumber(pitch, state.rotationPitch);

    if (west && isFunction(west.setRotation)) west.setRotation({ yaw: state.rotationYaw, pitch: state.rotationPitch });

    return forceRedraw({ releasePacket: state.release.lastInput || {}, interactive: true, sampleProof: false });
  }

  function resetRotation() {
    const west = resolveChild("west");

    state.rotationYaw = -0.18;
    state.rotationPitch = 0.05;

    if (west && isFunction(west.resetRotation)) west.resetRotation();

    return forceRedraw({ releasePacket: state.release.lastInput || {}, interactive: true, sampleProof: false });
  }

  function setZoom(value = 1, options = {}) {
    const west = resolveChild("west");

    state.zoomLevel = clamp(value, state.zoomMin, state.zoomMax);

    if (west && isFunction(west.setZoom)) {
      west.setZoom({ zoomLevel: state.zoomLevel, source: options.source || "canvas-parent-setZoom", notify: options.notify, invalidate: options.invalidate });
    }

    return forceRedraw({ ...options, releasePacket: options.releasePacket || state.release.lastInput || {}, interactive: true, sampleProof: options.sampleProof === true });
  }

  function zoomIn(step = 0.18) {
    return setZoom(state.zoomLevel + Math.abs(safeNumber(step, 0.18)), { source: "zoomIn", releasePacket: state.release.lastInput || {} });
  }

  function zoomOut(step = 0.18) {
    return setZoom(state.zoomLevel - Math.abs(safeNumber(step, 0.18)), { source: "zoomOut", releasePacket: state.release.lastInput || {} });
  }

  function resetZoom() {
    return setZoom(1, { source: "resetZoom", releasePacket: state.release.lastInput || {} });
  }

  function sample(point = {}) {
    const east = resolveChild("east");

    if (east && isFunction(east.sample)) return east.sample(point);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      u: safeNumber(point.u, 0.5),
      v: safeNumber(point.v, 0.5),
      rgb: [0, 0, 0],
      canvasStillDoesNotOwnPlanetTruth: true,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false
    };
  }

  function read(point = {}) {
    return sample(point);
  }

  function sampleVisibleContent() {
    if (!state.release.releaseAccepted) return sampleCanvasPixels();

    const south = resolveChild("south");
    let proof = {};

    if (south && isFunction(south.sampleVisibleContent)) {
      try {
        proof = south.sampleVisibleContent({ canvas: state.canvas }) || {};
      } catch (error) {
        recordError("SOUTH_SAMPLE_VISIBLE_CONTENT_FAILED", error);
      }
    }

    const applied = applyVisibleProof(proof);
    mergeChildReceipts();
    composeCanvasEvidenceBody();
    composeCanvasReturnPacket();
    updateDataset();

    return applied;
  }

  function classifyVisibleContentEvidence(metrics = {}) {
    if (!state.release.releaseAccepted) return applyVisibleProof({ visibleContentHardFail: false });

    const south = resolveChild("south");

    if (south && isFunction(south.classifyVisibleContentEvidence)) {
      try {
        return applyVisibleProof(south.classifyVisibleContentEvidence(metrics));
      } catch (error) {
        recordError("SOUTH_CLASSIFY_VISIBLE_CONTENT_FAILED", error);
      }
    }

    return applyVisibleProof(metrics);
  }

  function getMaterialBridgeReceipt() {
    mergeChildReceipts();

    return {
      materialReceiptBridgeActive: state.materialReceiptBridgeActive === true,
      materialNestedReceiptAvailable: state.materialNestedReceiptAvailable === true,
      materialContract: state.materialContract || "",
      materialReceipt: state.materialReceipt || "",
      materialContractMatchesExpected: state.materialContractMatchesExpected === true,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected === true,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed === true
    };
  }

  function composeCanvasEvidenceBody(input = {}) {
    mergeChildReceipts();
    deriveParentReadiness();
    computeStrictBootComplete();

    const proofChannels = [
      state.release.releaseAccepted,
      state.currentParentIdentityAccepted,
      state.canvasCarrierMounted,
      state.canvasContextReady,
      state.allCanvasChildrenApiReady,
      state.allCanvasChildrenEvidenceReady,
      state.atlasBuildComplete,
      state.textureComposeComplete,
      state.firstFrameDetected,
      state.imageRendered,
      state.visibleContentProof,
      state.visibleContentSoftGap,
      state.visibleForwardProgress,
      state.visibleContentAdmissible,
      state.inspectModeAvailable,
      state.materialReceiptBridgeActive
    ].filter(Boolean).length;

    state.canvasEvidenceBodyComposed = proofChannels > 0;

    const body = {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      file: FILE,
      role: state.role,

      canvasEvidenceBodyComposed: state.canvasEvidenceBodyComposed,
      proofChannels,

      releaseProof: {
        releaseAccepted: state.release.releaseAccepted,
        releaseStatus: state.release.releaseStatus,
        receivedFrom: state.release.receivedFrom,
        cycleNumber: state.release.cycleNumber,
        cycleRoute: state.release.cycleRoute,
        westAuditObserved: state.release.westAuditObserved,
        westAuditAccepted: state.release.westAuditAccepted,
        westCanvasReleaseApproved: state.release.westCanvasReleaseApproved,
        northCanvasReleaseAuthorized: state.release.northCanvasReleaseAuthorized
      },

      newsObservation: {
        northGateReady: false,
        eastGateReady: state.eastGateReady,
        westGateReady: state.westGateReady,
        southGateReady: state.southGateReady,
        canvasGateReady: state.canvasGateReady,
        newsGatePassedBeforeF21: false,
        newsGateDegradedBeforeF21: true,
        canvasFinalizesNews: false
      },

      fibonacciObservation: {
        activeFibonacci: 13,
        activeFibonacciRank: "F13P",
        activeStageId: state.activeStageId,
        activeGearId: state.activeGearId,
        futureFibonacciGate: "F21",
        f21ClaimedByCanvas: false,
        f21LatchMode: "north-only"
      },

      parentIdentityProof: {
        parentIdentityGuardActive: true,
        currentParentIdentityAccepted: state.currentParentIdentityAccepted,
        currentParentIdentityMismatch: state.currentParentIdentityMismatch,
        staleParentDetected: state.staleParentDetected
      },

      bootHandshakeProof: {
        physicalBootRequested: state.physicalBootRequested,
        physicalBootStarted: state.physicalBootStarted,
        physicalBootResolved: state.physicalBootResolved,
        physicalBootRejected: state.physicalBootRejected,
        physicalBootComplete: state.physicalBootComplete,
        canvasBootComplete: state.canvasBootComplete
      },

      carrierProof: {
        canvasCarrierMounted: state.canvasCarrierMounted,
        canvasContextReady: state.canvasContextReady,
        planetCanvasPresent: state.planetCanvasPresent,
        planetCanvasNonZeroSize: state.planetCanvasNonZeroSize
      },

      childReadinessProof: {
        canvasEastApiReady: state.canvasEastApiReady,
        canvasWestApiReady: state.canvasWestApiReady,
        canvasSouthApiReady: state.canvasSouthApiReady,
        allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
        canvasEastEvidenceReady: state.canvasEastEvidenceReady,
        canvasWestInspectionReady: state.canvasWestInspectionReady,
        canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
        allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
        canvasEastReady: state.canvasEastReady,
        canvasWestReady: state.canvasWestReady,
        canvasSouthReady: state.canvasSouthReady,
        allCanvasChildrenReady: state.allCanvasChildrenReady,
        childLoadError: state.childLoadError
      },

      f13Proof: {
        f13ReleaseReceived: state.f13ReleaseReceived,
        f13ParentIdentityAccepted: state.f13ParentIdentityAccepted,
        f13PhysicalCarrierMounted: state.f13PhysicalCarrierMounted,
        f13ChildrenApiReady: state.f13ChildrenApiReady,
        f13ChildrenEvidenceReady: state.f13ChildrenEvidenceReady,
        f13AtlasReady: state.f13AtlasReady,
        f13InspectReady: state.f13InspectReady,
        f13TextureReady: state.f13TextureReady,
        f13RenderReady: state.f13RenderReady,
        f13FrameReady: state.f13FrameReady,
        f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
        f13VisibleEvidenceStrict: state.f13VisibleEvidenceStrict,
        f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
        f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
        f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
        f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
        f13HardFail: state.f13HardFail
      },

      visibleProof: {
        visibleContentProof: state.visibleContentProof,
        visibleContentStrictProof: state.visibleContentStrictProof,
        visibleContentSoftGap: state.visibleContentSoftGap,
        visibleContentHardFail: state.visibleContentHardFail,
        visibleForwardProgress: state.visibleForwardProgress,
        visibleContentAdmissible: state.visibleContentAdmissible,
        visibleContentProofMethod: state.visibleContentProofMethod,
        visibleContentProofError: state.visibleContentProofError
      },

      inspectProof: {
        dragInspectionBound: state.dragInspectionBound,
        zoomInspectionBound: state.zoomInspectionBound,
        inspectModeAvailable: state.inspectModeAvailable,
        inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
        diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame
      },

      materialBridgeProof: getMaterialBridgeReceipt(),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      composedAt: nowIso()
    };

    updateDataset();
    return body;
  }

  function composeCanvasEvidenceReceipt(input = {}) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      file: FILE,
      role: state.role,
      canvasEvidenceReceipt: true,
      canvasEvidenceBody: composeCanvasEvidenceBody(input),
      release: clonePlain(state.release),
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      completionLatched: false,
      degradedCompletionLatched: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function composeCanvasReturnPacket(input = {}) {
    const body = composeCanvasEvidenceBody(input);

    const packet = {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      sourceFile: FILE,
      targetFile: NORTH_FILE,

      cycleNumber: 2,
      cycleRoute: MACRO_CYCLE_2,
      receivedFrom: state.release.receivedFrom || "WEST",
      returnTo: "NORTH",
      handoffTo: "",
      activeCardinal: "CANVAS",
      activeFibonacci: 13,
      activeFibonacciRank: "F13P",
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeNewsGate: "CANVAS",

      northGateReady: false,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: true,

      canvasReleaseAccepted: state.release.releaseAccepted,
      canvasReleaseStatus: state.release.releaseStatus,
      canvasEvidenceBodyComposed: body.canvasEvidenceBodyComposed,
      canvasEvidenceReceiptComposed: true,
      physicalBootComplete: state.physicalBootComplete,
      canvasBootComplete: state.canvasBootComplete,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      completionLatched: false,
      degradedCompletionLatched: false,
      f21LatchMode: "north-only",
      visualPassClaimed: false,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      canvasEvidenceBody: body,
      composedAt: nowIso()
    };

    state.canvasReturnPacketReady = true;
    updateDataset();

    return packet;
  }

  function submitCanvasEvidenceUpstream(input = {}) {
    const packet = composeCanvasReturnPacket(input);
    const north = readNorthAuthority();

    if (!north.session) return false;

    try {
      if (isFunction(north.session.submitEvent)) {
        north.session.submitEvent(packet);
        state.canvasEvidenceSubmittedToNorth = true;
        updateDataset();
        return true;
      }

      if (isFunction(north.session.submit)) {
        north.session.submit(packet);
        state.canvasEvidenceSubmittedToNorth = true;
        updateDataset();
        return true;
      }
    } catch (error) {
      recordError("SUBMIT_CANVAS_RETURN_PACKET_FAILED", error);
    }

    return false;
  }

  function getCanvasReleaseReceipt() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      file: FILE,
      release: clonePlain(state.release),
      releaseAccepted: state.release.releaseAccepted,
      releaseStatus: state.release.releaseStatus,
      waitsForWestRelease: true,
      cycleOneHeld: true,
      cycleTwoReleaseRequired: true,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      visualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function getCanvasPrimaryGateReceipt() {
    return getReceipt();
  }

  function getState() {
    return state;
  }

  function getReceipt() {
    readNorthAuthority();
    markChildrenPresence();
    mergeChildReceipts();
    deriveParentReadiness();
    computeStrictBootComplete();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: LEGACY_BASELINE_CONTRACT,
      baselineReceipt: LEGACY_BASELINE_RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      version: VERSION,
      file: FILE,
      role: state.role,

      governedF13EvidenceReceiverActive: true,
      parentChildReconciliationActive: true,
      waitsForWestRelease: true,
      cycleOneHeld: true,
      cycleTwoReleaseRequired: true,
      singlePhysicalFile: true,
      internalNewsZonesActive: true,
      noAdditionalCanvasFileSplit: true,

      releaseAccepted: state.release.releaseAccepted,
      releaseStatus: state.release.releaseStatus,
      releaseReason: state.release.releaseReason,
      cycleNumber: state.release.cycleNumber,
      cycleRoute: state.release.cycleRoute,
      receivedFrom: state.release.receivedFrom,
      returnTo: state.release.returnTo,
      handoffTo: state.release.handoffTo,
      westAuditObserved: state.release.westAuditObserved,
      westAuditAccepted: state.release.westAuditAccepted,
      westReleaseApproved: state.release.westCanvasReleaseApproved,
      northReleaseAuthorized: state.release.northCanvasReleaseAuthorized,
      canvasReleaseAuthorized: state.release.canvasReleaseAuthorized,

      parentIdentityGuardActive: true,
      bootHandshakeGuardActive: true,
      staleConsumptionGuardActive: true,
      expectedParentContract: CONTRACT,
      expectedParentSplitContract: SPLIT_CONTRACT,
      currentParentIdentityAccepted: state.currentParentIdentityAccepted,
      currentParentIdentityMismatch: state.currentParentIdentityMismatch,
      staleParentDetected: state.staleParentDetected,
      preexistingParentDetected: state.preexistingParentDetected,
      preexistingParentContract: state.preexistingParentContract,
      preexistingParentReceipt: state.preexistingParentReceipt,
      preexistingParentSplitContract: state.preexistingParentSplitContract,
      preexistingParentSplitReceipt: state.preexistingParentSplitReceipt,
      staleParentContracts: STALE_PARENT_CONTRACTS.slice(),

      newsProtocolSynchronized: true,
      northGateReady: false,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,
      newsGatePassedBeforeF21: false,
      newsGateDegradedBeforeF21: true,
      canvasFinalizesNews: false,

      macroCycle1: state.macroCycle1,
      macroCycle2: state.macroCycle2,
      canvasChildSequence: state.canvasChildSequence,
      deprecatedCycleOrder: state.deprecatedCycleOrder,
      canvasParentMacroNorth: false,
      canvasParentChildParent: true,
      canvasParentDoesNotAuthorizeRelease: true,
      canvasParentDoesNotLatchF21: true,

      fibonacciAlignmentSynchronized: true,
      activeFibonacci: 13,
      activeFibonacciRank: "F13P",
      activeStageId: state.activeStageId,
      activeGearId: state.activeGearId,
      activeFibonacciGate: "F13",
      futureFibonacciGate: "F21",
      oneActiveGearAtATime: true,
      f8SelfDutySatisfied: false,

      canvasNorthActive: true,
      physicalObjectBootstrapActive: true,
      physicalCarrierProofActive: true,
      carrierReadyIsNotPlanetReady: true,
      canvasReadyRequiresTextureFrameAndProof: true,
      f13PhysicalProofRequired: true,
      emergencyF13DiagnosticPlanetAllowed: true,
      emergencyF13DiagnosticPlanetUsed: state.emergencyF13DiagnosticPlanetUsed,

      physicalBootRequested: state.physicalBootRequested,
      physicalBootStarted: state.physicalBootStarted,
      physicalBootResolved: state.physicalBootResolved,
      physicalBootRejected: state.physicalBootRejected,
      physicalBootComplete: state.physicalBootComplete,

      canvasBootRequested: state.canvasBootRequested,
      canvasBootStarted: state.canvasBootStarted,
      canvasBootResolved: state.canvasBootResolved,
      canvasBootRejected: state.canvasBootRejected,
      canvasBootAttempts: state.canvasBootAttempts,
      canvasBootError: state.canvasBootError,
      canvasBootComplete: state.canvasBootComplete,

      canvasCarrierRequested: state.canvasCarrierRequested,
      canvasCarrierMounted: state.canvasCarrierMounted,
      canvasContextReady: state.canvasContextReady,
      carrierReady: state.carrierReady,
      canvasCarrierReady: state.canvasCarrierReady,
      canvasCarrierHandoffOk: state.canvasCarrierHandoffOk,
      canvasCarrierHandoffError: state.canvasCarrierHandoffError,
      canvasCarrierMethod: state.canvasCarrierMethod,

      canvasReady: state.canvasReady,
      visibleCanvasReady: state.visibleCanvasReady,
      canvasLaneClosed: state.canvasLaneClosed,

      planetCanvasPresent: state.planetCanvasPresent,
      planetCanvasNonZeroSize: state.planetCanvasNonZeroSize,
      carrierPhysicalWidth: state.carrierPhysicalWidth,
      carrierPhysicalHeight: state.carrierPhysicalHeight,
      planetFramePainted: state.planetFramePainted,
      nonblankPlanetVisible: state.nonblankPlanetVisible,
      planetNotObstructed: state.planetNotObstructed,
      visiblePlanetAvailable: state.visiblePlanetAvailable,
      visiblePlanetHintPresent: state.visiblePlanetHintPresent,

      canvasEastPresent: state.canvasEastPresent,
      canvasWestPresent: state.canvasWestPresent,
      canvasSouthPresent: state.canvasSouthPresent,

      canvasEastApiReady: state.canvasEastApiReady,
      canvasWestApiReady: state.canvasWestApiReady,
      canvasSouthApiReady: state.canvasSouthApiReady,
      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,

      canvasEastEvidenceReady: state.canvasEastEvidenceReady,
      canvasWestInspectionReady: state.canvasWestInspectionReady,
      canvasSouthVisibleProofReady: state.canvasSouthVisibleProofReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,

      canvasEastReady: state.canvasEastReady,
      canvasWestReady: state.canvasWestReady,
      canvasSouthReady: state.canvasSouthReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      canvasEastMissingMethods: state.canvasEastMissingMethods,
      canvasWestMissingMethods: state.canvasWestMissingMethods,
      canvasSouthMissingMethods: state.canvasSouthMissingMethods,
      childLoadAttempted: state.childLoadAttempted,
      childLoadComplete: state.childLoadComplete,
      childLoadError: state.childLoadError,
      nextAuditTarget: state.nextAuditTarget,

      atlasBuildStarted: state.atlasBuildStarted,
      atlasBuildProgress: state.atlasBuildProgress,
      atlasBuildComplete: state.atlasBuildComplete,
      atlasBuildError: state.atlasBuildError,
      textureComposeStarted: state.textureComposeStarted,
      textureComposeProgress: state.textureComposeProgress,
      textureComposeComplete: state.textureComposeComplete,
      textureReady: state.textureReady,
      textureComposeError: state.textureComposeError,
      firstFrameRequested: state.firstFrameRequested,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      imageRenderedMeansFrameDrawnOnly: true,
      imageRenderedDoesNotMeanVisualPass: true,
      imageRenderedDoesNotMeanF21: true,
      renderedAfterTexture: state.renderedAfterTexture,
      renderReady: state.renderReady,
      renderFrameCount: state.renderFrameCount,

      dragInspectionBound: state.dragInspectionBound,
      zoomInspectionBound: state.zoomInspectionBound,
      inspectModeAvailable: state.inspectModeAvailable,
      inspectPlanetControlAvailable: state.inspectPlanetControlAvailable,
      diagnosticCanLeavePlanetFrame: state.diagnosticCanLeavePlanetFrame,

      materialReceiptBridge: getMaterialBridgeReceipt(),
      materialReceiptBridgeActive: state.materialReceiptBridgeActive,
      materialContract: state.materialContract,
      materialReceipt: state.materialReceipt,
      materialContractMatchesExpected: state.materialContractMatchesExpected,
      materialReceiptMatchesExpected: state.materialReceiptMatchesExpected,
      canonicalMaterialConsumed: state.canonicalMaterialConsumed,

      visibleContentProofStarted: state.visibleContentProofStarted,
      visibleContentProof: state.visibleContentProof,
      visibleContentStrictProof: state.visibleContentStrictProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,
      visibleForwardProgress: state.visibleForwardProgress,
      visibleContentAdmissible: state.visibleContentAdmissible,
      visibleContentProofMethod: state.visibleContentProofMethod,
      visibleContentProofError: state.visibleContentProofError,
      visibleContentSampleCount: state.visibleContentSampleCount,
      visibleContentVarianceScore: state.visibleContentVarianceScore,
      visibleContentClassCount: state.visibleContentClassCount,
      visibleContentClasses: state.visibleContentClasses.slice(),
      visibleContentLandSampleCount: state.visibleContentLandSampleCount,
      visibleContentWaterSampleCount: state.visibleContentWaterSampleCount,
      visibleContentOtherSampleCount: state.visibleContentOtherSampleCount,
      visibleContentCarrierSampleCount: state.visibleContentCarrierSampleCount,
      carrierOnlyDetected: state.carrierOnlyDetected,

      f13ReleaseReceived: state.f13ReleaseReceived,
      f13ParentIdentityAccepted: state.f13ParentIdentityAccepted,
      f13PhysicalCarrierMounted: state.f13PhysicalCarrierMounted,
      f13ChildrenApiReady: state.f13ChildrenApiReady,
      f13ChildrenEvidenceReady: state.f13ChildrenEvidenceReady,
      f13AtlasReady: state.f13AtlasReady,
      f13InspectReady: state.f13InspectReady,
      f13TextureReady: state.f13TextureReady,
      f13RenderReady: state.f13RenderReady,
      f13FrameReady: state.f13FrameReady,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13VisibleEvidenceStrict: state.f13VisibleEvidenceStrict,
      f13VisibleEvidenceDegraded: state.f13VisibleEvidenceDegraded,
      f13CanvasEvidencePreserved: true,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,

      northAuthorityPresent: state.northAuthorityPresent,
      checkpointSessionSubmissionAvailable: state.checkpointSessionSubmissionAvailable,
      canvasEvidenceSubmittedToNorth: state.canvasEvidenceSubmittedToNorth,
      canvasEvidenceBodyComposed: state.canvasEvidenceBodyComposed,
      canvasReturnPacketReady: state.canvasReturnPacketReady,

      f21EligibleForNorth: false,
      f21SubmittedToNorth: false,
      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      completionLatched: false,
      degradedCompletionLatched: false,
      f21LatchMode: "north-only",

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      booting: state.booting,
      booted: state.booted,
      bootStartedAt: state.bootStartedAt,
      bootCompletedAt: state.bootCompletedAt,
      bootElapsedMs: state.bootElapsedMs,

      canvasPhaseEvents: clonePlain(state.canvasPhaseEvents),
      progressOnlyEvents: clonePlain(state.progressOnlyEvents),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),

      ownsCanvasEvidenceOnly: true,
      ownsGovernedF13EvidenceReceiver: true,
      ownsParentChildReconciliation: true,
      ownsCanvasParentGate: true,
      ownsParentIdentityGuard: true,
      ownsBootHandshakeGuard: true,
      ownsStaleConsumptionDetection: true,
      ownsPhysicalCarrierProof: true,
      ownsEmergencyF13DiagnosticPlanet: true,
      ownsPlanetTruth: false,
      ownsMaterialTruth: false,
      ownsElevationTruth: false,
      ownsHydrologyTruth: false,
      ownsRuntimeTableGovernance: false,
      ownsWestAdmissibility: false,
      ownsNewsFinalAuthority: false,
      ownsReadyText: false,
      ownsF21: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceipt();

    const errors = (r.errors || [])
      .map((event) => `- ${event.at} :: ${event.code || event.event} :: ${event.message}`)
      .join("\n") || "- none";

    const phases = (r.canvasPhaseEvents || [])
      .slice(-40)
      .map((event) => `- ${event.at} :: ${event.fibonacci || ""} :: ${event.event || event.phase || ""} :: ${event.message || ""}`)
      .join("\n") || "- none";

    return [
      "HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_RECEIPT",
      "",
      "IDENTITY",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `baselineContract=${r.baselineContract}`,
      `splitContract=${r.splitContract}`,
      `splitReceipt=${r.splitReceipt}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `role=${r.role}`,
      "",
      "RELEASE",
      `governedF13EvidenceReceiverActive=${r.governedF13EvidenceReceiverActive}`,
      `parentChildReconciliationActive=${r.parentChildReconciliationActive}`,
      `waitsForWestRelease=${r.waitsForWestRelease}`,
      `cycleNumber=${r.cycleNumber}`,
      `cycleRoute=${r.cycleRoute}`,
      `receivedFrom=${r.receivedFrom}`,
      `returnTo=${r.returnTo}`,
      `releaseAccepted=${r.releaseAccepted}`,
      `releaseStatus=${r.releaseStatus}`,
      `westAuditObserved=${r.westAuditObserved}`,
      `westReleaseApproved=${r.westReleaseApproved}`,
      `northReleaseAuthorized=${r.northReleaseAuthorized}`,
      "",
      "NEWS",
      `northGateReady=${r.northGateReady}`,
      `eastGateReady=${r.eastGateReady}`,
      `westGateReady=${r.westGateReady}`,
      `southGateReady=${r.southGateReady}`,
      `canvasGateReady=${r.canvasGateReady}`,
      `newsGatePassedBeforeF21=${r.newsGatePassedBeforeF21}`,
      `newsGateDegradedBeforeF21=${r.newsGateDegradedBeforeF21}`,
      `canvasFinalizesNews=${r.canvasFinalizesNews}`,
      "",
      "CYCLE",
      `macroCycle1=${r.macroCycle1}`,
      `macroCycle2=${r.macroCycle2}`,
      `canvasChildSequence=${r.canvasChildSequence}`,
      `deprecatedCycleOrder=${r.deprecatedCycleOrder}`,
      `canvasParentMacroNorth=${r.canvasParentMacroNorth}`,
      `canvasParentChildParent=${r.canvasParentChildParent}`,
      `canvasParentDoesNotAuthorizeRelease=${r.canvasParentDoesNotAuthorizeRelease}`,
      `canvasParentDoesNotLatchF21=${r.canvasParentDoesNotLatchF21}`,
      "",
      "FIBONACCI",
      `activeFibonacci=${r.activeFibonacci}`,
      `activeFibonacciRank=${r.activeFibonacciRank}`,
      `activeStageId=${r.activeStageId}`,
      `activeGearId=${r.activeGearId}`,
      `activeFibonacciGate=${r.activeFibonacciGate}`,
      `futureFibonacciGate=${r.futureFibonacciGate}`,
      "",
      "IDENTITY_GUARD",
      `parentIdentityGuardActive=${r.parentIdentityGuardActive}`,
      `currentParentIdentityAccepted=${r.currentParentIdentityAccepted}`,
      `currentParentIdentityMismatch=${r.currentParentIdentityMismatch}`,
      `staleParentDetected=${r.staleParentDetected}`,
      `preexistingParentContract=${r.preexistingParentContract}`,
      `preexistingParentSplitContract=${r.preexistingParentSplitContract}`,
      "",
      "BOOT_AND_CARRIER",
      `physicalBootComplete=${r.physicalBootComplete}`,
      `canvasBootComplete=${r.canvasBootComplete}`,
      `carrierReady=${r.carrierReady}`,
      `canvasCarrierMounted=${r.canvasCarrierMounted}`,
      `canvasContextReady=${r.canvasContextReady}`,
      `canvasReady=${r.canvasReady}`,
      `visibleCanvasReady=${r.visibleCanvasReady}`,
      `planetCanvasPresent=${r.planetCanvasPresent}`,
      `planetCanvasNonZeroSize=${r.planetCanvasNonZeroSize}`,
      `carrierPhysicalWidth=${r.carrierPhysicalWidth}`,
      `carrierPhysicalHeight=${r.carrierPhysicalHeight}`,
      "",
      "CHILD_RECONCILIATION",
      `canvasEastApiReady=${r.canvasEastApiReady}`,
      `canvasWestApiReady=${r.canvasWestApiReady}`,
      `canvasSouthApiReady=${r.canvasSouthApiReady}`,
      `allCanvasChildrenApiReady=${r.allCanvasChildrenApiReady}`,
      `canvasEastEvidenceReady=${r.canvasEastEvidenceReady}`,
      `canvasWestInspectionReady=${r.canvasWestInspectionReady}`,
      `canvasSouthVisibleProofReady=${r.canvasSouthVisibleProofReady}`,
      `allCanvasChildrenEvidenceReady=${r.allCanvasChildrenEvidenceReady}`,
      `canvasEastReady=${r.canvasEastReady}`,
      `canvasWestReady=${r.canvasWestReady}`,
      `canvasSouthReady=${r.canvasSouthReady}`,
      `allCanvasChildrenReady=${r.allCanvasChildrenReady}`,
      `childLoadError=${r.childLoadError}`,
      `nextAuditTarget=${r.nextAuditTarget}`,
      "",
      "F13_EVIDENCE",
      `atlasBuildComplete=${r.atlasBuildComplete}`,
      `textureComposeComplete=${r.textureComposeComplete}`,
      `textureReady=${r.textureReady}`,
      `firstFrameDetected=${r.firstFrameDetected}`,
      `imageRendered=${r.imageRendered}`,
      `imageRenderedMeansFrameDrawnOnly=${r.imageRenderedMeansFrameDrawnOnly}`,
      `imageRenderedDoesNotMeanVisualPass=${r.imageRenderedDoesNotMeanVisualPass}`,
      `imageRenderedDoesNotMeanF21=${r.imageRenderedDoesNotMeanF21}`,
      `renderReady=${r.renderReady}`,
      `visibleContentProof=${r.visibleContentProof}`,
      `visibleContentStrictProof=${r.visibleContentStrictProof}`,
      `visibleContentSoftGap=${r.visibleContentSoftGap}`,
      `visibleContentHardFail=${r.visibleContentHardFail}`,
      `visibleForwardProgress=${r.visibleForwardProgress}`,
      `visibleContentAdmissible=${r.visibleContentAdmissible}`,
      `visibleContentProofMethod=${r.visibleContentProofMethod}`,
      "",
      "F13_PARENT_CLASSIFICATION",
      `f13ReleaseReceived=${r.f13ReleaseReceived}`,
      `f13ParentIdentityAccepted=${r.f13ParentIdentityAccepted}`,
      `f13PhysicalCarrierMounted=${r.f13PhysicalCarrierMounted}`,
      `f13ChildrenApiReady=${r.f13ChildrenApiReady}`,
      `f13ChildrenEvidenceReady=${r.f13ChildrenEvidenceReady}`,
      `f13AtlasReady=${r.f13AtlasReady}`,
      `f13InspectReady=${r.f13InspectReady}`,
      `f13TextureReady=${r.f13TextureReady}`,
      `f13RenderReady=${r.f13RenderReady}`,
      `f13FrameReady=${r.f13FrameReady}`,
      `f13VisibleEvidenceAvailable=${r.f13VisibleEvidenceAvailable}`,
      `f13VisibleEvidenceStrict=${r.f13VisibleEvidenceStrict}`,
      `f13VisibleEvidenceDegraded=${r.f13VisibleEvidenceDegraded}`,
      `f13CanvasEvidenceStrict=${r.f13CanvasEvidenceStrict}`,
      `f13CanvasEvidenceDegraded=${r.f13CanvasEvidenceDegraded}`,
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13HardFail=${r.f13HardFail}`,
      "",
      "UPSTREAM_RETURN",
      `canvasEvidenceBodyComposed=${r.canvasEvidenceBodyComposed}`,
      `canvasReturnPacketReady=${r.canvasReturnPacketReady}`,
      `canvasEvidenceSubmittedToNorth=${r.canvasEvidenceSubmittedToNorth}`,
      "",
      "F21_BOUNDARY",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21ClaimedByCanvas=${r.f21ClaimedByCanvas}`,
      `readyTextClaimedByCanvas=${r.readyTextClaimedByCanvas}`,
      `completionLatched=${r.completionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `f21LatchMode=${r.f21LatchMode}`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      "",
      "CANVAS_PHASE_EVENTS",
      phases,
      "",
      "ERRORS",
      errors,
      "",
      "FINAL_CLAIMS",
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `updatedAt=${r.updatedAt}`
    ].join("\n");
  }

  function getReceiptLight() {
    deriveParentReadiness();
    computeStrictBootComplete();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      splitContract: SPLIT_CONTRACT,
      splitReceipt: SPLIT_RECEIPT,
      version: VERSION,
      file: FILE,
      role: state.role,

      governedF13EvidenceReceiverActive: true,
      parentChildReconciliationActive: true,
      waitsForWestRelease: true,
      releaseAccepted: state.release.releaseAccepted,
      releaseStatus: state.release.releaseStatus,
      cycleNumber: state.release.cycleNumber,
      cycleRoute: state.release.cycleRoute,
      receivedFrom: state.release.receivedFrom,

      parentIdentityGuardActive: true,
      bootHandshakeGuardActive: true,
      staleConsumptionGuardActive: true,
      currentParentIdentityAccepted: state.currentParentIdentityAccepted,
      currentParentIdentityMismatch: state.currentParentIdentityMismatch,
      staleParentDetected: state.staleParentDetected,

      northGateReady: false,
      eastGateReady: state.eastGateReady,
      westGateReady: state.westGateReady,
      southGateReady: state.southGateReady,
      canvasGateReady: state.canvasGateReady,

      activeFibonacci: 13,
      activeFibonacciRank: "F13P",

      physicalBootComplete: state.physicalBootComplete,
      canvasBootComplete: state.canvasBootComplete,
      carrierReady: state.carrierReady,
      canvasCarrierReady: state.canvasCarrierReady,
      canvasReady: state.canvasReady,
      visibleCanvasReady: state.visibleCanvasReady,

      allCanvasChildrenApiReady: state.allCanvasChildrenApiReady,
      allCanvasChildrenEvidenceReady: state.allCanvasChildrenEvidenceReady,
      allCanvasChildrenReady: state.allCanvasChildrenReady,

      atlasBuildComplete: state.atlasBuildComplete,
      textureComposeComplete: state.textureComposeComplete,
      firstFrameDetected: state.firstFrameDetected,
      imageRendered: state.imageRendered,
      visibleContentProof: state.visibleContentProof,
      visibleContentSoftGap: state.visibleContentSoftGap,
      visibleContentHardFail: state.visibleContentHardFail,

      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,

      nextAuditTarget: state.nextAuditTarget,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,

      f21ClaimedByCanvas: false,
      readyTextClaimedByCanvas: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,
      visualPassClaimed: false,
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function updateDataset() {
    deriveParentReadiness();

    if (!doc || !doc.documentElement) return;

    const dataset = doc.documentElement.dataset;

    dataset.hearthCanvasLoaded = "true";
    dataset.hearthCanvasContract = CONTRACT;
    dataset.hearthCanvasReceipt = RECEIPT;
    dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    dataset.hearthCanvasBaselineContract = LEGACY_BASELINE_CONTRACT;
    dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
    dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
    dataset.hearthCanvasVersion = VERSION;
    dataset.hearthCanvasRole = state.role;

    dataset.hearthCanvasGovernedF13EvidenceReceiverActive = "true";
    dataset.hearthCanvasParentChildReconciliationActive = "true";
    dataset.hearthCanvasWaitsForWestRelease = "true";
    dataset.hearthCanvasCycleOneHeld = "true";
    dataset.hearthCanvasCycleTwoReleaseRequired = "true";
    dataset.hearthCanvasReleaseAccepted = String(state.release.releaseAccepted);
    dataset.hearthCanvasReleaseStatus = state.release.releaseStatus;
    dataset.hearthCanvasReceivedFrom = state.release.receivedFrom;
    dataset.hearthCanvasCycleNumber = String(state.release.cycleNumber);
    dataset.hearthCanvasCycleRoute = state.release.cycleRoute;
    dataset.hearthCanvasWestAuditObserved = String(state.release.westAuditObserved);
    dataset.hearthCanvasWestReleaseApproved = String(state.release.westCanvasReleaseApproved);
    dataset.hearthCanvasNorthReleaseAuthorized = String(state.release.northCanvasReleaseAuthorized);
    dataset.hearthCanvasReleaseAuthorized = String(state.release.canvasReleaseAuthorized);

    dataset.hearthCanvasNewsProtocolSynchronized = "true";
    dataset.hearthCanvasNorthGateReady = "false";
    dataset.hearthCanvasEastGateReady = String(state.eastGateReady);
    dataset.hearthCanvasWestGateReady = String(state.westGateReady);
    dataset.hearthCanvasSouthGateReady = String(state.southGateReady);
    dataset.hearthCanvasCanvasGateReady = String(state.canvasGateReady);
    dataset.hearthCanvasNewsGatePassedBeforeF21 = "false";
    dataset.hearthCanvasNewsGateDegradedBeforeF21 = "true";
    dataset.hearthCanvasFinalizesNews = "false";

    dataset.hearthCanvasMacroCycle1 = state.macroCycle1;
    dataset.hearthCanvasMacroCycle2 = state.macroCycle2;
    dataset.hearthCanvasChildSequence = state.canvasChildSequence;
    dataset.hearthCanvasDeprecatedCycleOrder = state.deprecatedCycleOrder;
    dataset.hearthCanvasParentDoesNotAuthorizeRelease = "true";
    dataset.hearthCanvasParentDoesNotLatchF21 = "true";

    dataset.hearthCanvasFibonacciAlignmentSynchronized = "true";
    dataset.hearthCanvasActiveFibonacci = "13";
    dataset.hearthCanvasActiveFibonacciRank = "F13P";
    dataset.hearthCanvasActiveStageId = state.activeStageId;
    dataset.hearthCanvasActiveGearId = state.activeGearId;
    dataset.hearthCanvasActiveFibonacciGate = "F13";
    dataset.hearthCanvasFutureFibonacciGate = "F21";
    dataset.hearthCanvasOneActiveGearAtATime = "true";

    dataset.hearthCanvasParentIdentityGuardActive = "true";
    dataset.hearthCanvasBootHandshakeGuardActive = "true";
    dataset.hearthCanvasStaleConsumptionGuardActive = "true";
    dataset.hearthCanvasExpectedParentContract = CONTRACT;
    dataset.hearthCanvasExpectedParentSplitContract = SPLIT_CONTRACT;
    dataset.hearthCanvasCurrentParentIdentityAccepted = String(state.currentParentIdentityAccepted);
    dataset.hearthCanvasCurrentParentIdentityMismatch = String(state.currentParentIdentityMismatch);
    dataset.hearthCanvasStaleParentDetected = String(state.staleParentDetected);
    dataset.hearthCanvasPreexistingParentContract = state.preexistingParentContract || "";
    dataset.hearthCanvasPreexistingParentSplitContract = state.preexistingParentSplitContract || "";

    dataset.hearthCanvasPhysicalBootRequested = String(state.physicalBootRequested);
    dataset.hearthCanvasPhysicalBootStarted = String(state.physicalBootStarted);
    dataset.hearthCanvasPhysicalBootResolved = String(state.physicalBootResolved);
    dataset.hearthCanvasPhysicalBootRejected = String(state.physicalBootRejected);
    dataset.hearthCanvasPhysicalBootComplete = String(state.physicalBootComplete);

    dataset.hearthCanvasBootRequested = String(state.canvasBootRequested);
    dataset.hearthCanvasBootStarted = String(state.canvasBootStarted);
    dataset.hearthCanvasBootResolved = String(state.canvasBootResolved);
    dataset.hearthCanvasBootRejected = String(state.canvasBootRejected);
    dataset.hearthCanvasBootAttempts = String(state.canvasBootAttempts);
    dataset.hearthCanvasBootError = state.canvasBootError;
    dataset.hearthCanvasBootComplete = String(state.canvasBootComplete);

    dataset.hearthCanvasCarrierRequested = String(state.canvasCarrierRequested);
    dataset.hearthCanvasCarrierMounted = String(state.canvasCarrierMounted);
    dataset.hearthCanvasContextReady = String(state.canvasContextReady);
    dataset.hearthCanvasCarrierReady = String(state.carrierReady);
    dataset.hearthCanvasCarrierHandoffOk = String(state.canvasCarrierHandoffOk);
    dataset.hearthCanvasCarrierHandoffError = state.canvasCarrierHandoffError;
    dataset.hearthCanvasReady = String(state.canvasReady);
    dataset.hearthCanvasVisibleReady = String(state.visibleCanvasReady);

    dataset.hearthPlanetCanvasPresent = String(state.planetCanvasPresent);
    dataset.hearthPlanetCanvasNonZeroSize = String(state.planetCanvasNonZeroSize);
    dataset.hearthCanvasPlanetFramePainted = String(state.planetFramePainted);
    dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
    dataset.hearthCanvasVisiblePlanetHintPresent = String(state.visiblePlanetHintPresent);
    dataset.hearthCanvasNonblankPlanetVisible = String(state.nonblankPlanetVisible);

    dataset.hearthCanvasEastPresent = String(state.canvasEastPresent);
    dataset.hearthCanvasWestPresent = String(state.canvasWestPresent);
    dataset.hearthCanvasSouthPresent = String(state.canvasSouthPresent);

    dataset.hearthCanvasEastApiReady = String(state.canvasEastApiReady);
    dataset.hearthCanvasWestApiReady = String(state.canvasWestApiReady);
    dataset.hearthCanvasSouthApiReady = String(state.canvasSouthApiReady);
    dataset.hearthCanvasAllChildrenApiReady = String(state.allCanvasChildrenApiReady);

    dataset.hearthCanvasEastEvidenceReady = String(state.canvasEastEvidenceReady);
    dataset.hearthCanvasWestInspectionReady = String(state.canvasWestInspectionReady);
    dataset.hearthCanvasSouthVisibleProofReady = String(state.canvasSouthVisibleProofReady);
    dataset.hearthCanvasAllChildrenEvidenceReady = String(state.allCanvasChildrenEvidenceReady);

    dataset.hearthCanvasEastReady = String(state.canvasEastReady);
    dataset.hearthCanvasWestReady = String(state.canvasWestReady);
    dataset.hearthCanvasSouthReady = String(state.canvasSouthReady);
    dataset.hearthCanvasAllChildrenReady = String(state.allCanvasChildrenReady);

    dataset.hearthCanvasEastMissingMethods = state.canvasEastMissingMethods;
    dataset.hearthCanvasWestMissingMethods = state.canvasWestMissingMethods;
    dataset.hearthCanvasSouthMissingMethods = state.canvasSouthMissingMethods;
    dataset.hearthCanvasChildLoadAttempted = String(state.childLoadAttempted);
    dataset.hearthCanvasChildLoadComplete = String(state.childLoadComplete);
    dataset.hearthCanvasChildLoadError = state.childLoadError;
    dataset.hearthCanvasNextAuditTarget = state.nextAuditTarget || "";

    dataset.hearthCanvasAtlasBuildStarted = String(state.atlasBuildStarted);
    dataset.hearthCanvasAtlasBuildProgress = String(state.atlasBuildProgress);
    dataset.hearthCanvasAtlasBuildComplete = String(state.atlasBuildComplete);
    dataset.hearthCanvasAtlasBuildError = state.atlasBuildError;
    dataset.hearthCanvasTextureComposeStarted = String(state.textureComposeStarted);
    dataset.hearthCanvasTextureComposeProgress = String(state.textureComposeProgress);
    dataset.hearthCanvasTextureComposeComplete = String(state.textureComposeComplete);
    dataset.hearthCanvasTextureReady = String(state.textureReady);
    dataset.hearthCanvasTextureComposeError = state.textureComposeError;
    dataset.hearthCanvasFirstFrameRequested = String(state.firstFrameRequested);
    dataset.hearthCanvasFirstFrameDetected = String(state.firstFrameDetected);
    dataset.hearthCanvasImageRendered = String(state.imageRendered);
    dataset.hearthCanvasImageRenderedMeansFrameDrawnOnly = "true";
    dataset.hearthCanvasImageRenderedDoesNotMeanVisualPass = "true";
    dataset.hearthCanvasImageRenderedDoesNotMeanF21 = "true";
    dataset.hearthCanvasRenderReady = String(state.renderReady);

    dataset.hearthCanvasVisibleContentProofStarted = String(state.visibleContentProofStarted);
    dataset.hearthCanvasVisibleContentProof = String(state.visibleContentProof);
    dataset.hearthCanvasVisibleContentStrictProof = String(state.visibleContentStrictProof);
    dataset.hearthCanvasVisibleContentSoftGap = String(state.visibleContentSoftGap);
    dataset.hearthCanvasVisibleContentHardFail = String(state.visibleContentHardFail);
    dataset.hearthCanvasVisibleForwardProgress = String(state.visibleForwardProgress);
    dataset.hearthCanvasVisibleContentAdmissible = String(state.visibleContentAdmissible);
    dataset.hearthCanvasVisibleProofReady = String(state.visibleProofReady);

    dataset.hearthCanvasDragInspectionBound = String(state.dragInspectionBound);
    dataset.hearthCanvasZoomInspectionBound = String(state.zoomInspectionBound);
    dataset.hearthCanvasInspectModeAvailable = String(state.inspectModeAvailable);
    dataset.hearthCanvasInspectPlanetControlAvailable = String(state.inspectPlanetControlAvailable);
    dataset.hearthCanvasDiagnosticCanLeavePlanetFrame = String(state.diagnosticCanLeavePlanetFrame);

    dataset.hearthCanvasF13ReleaseReceived = String(state.f13ReleaseReceived);
    dataset.hearthCanvasF13ParentIdentityAccepted = String(state.f13ParentIdentityAccepted);
    dataset.hearthCanvasF13PhysicalCarrierMounted = String(state.f13PhysicalCarrierMounted);
    dataset.hearthCanvasF13ChildrenApiReady = String(state.f13ChildrenApiReady);
    dataset.hearthCanvasF13ChildrenEvidenceReady = String(state.f13ChildrenEvidenceReady);
    dataset.hearthCanvasF13AtlasReady = String(state.f13AtlasReady);
    dataset.hearthCanvasF13InspectReady = String(state.f13InspectReady);
    dataset.hearthCanvasF13TextureReady = String(state.f13TextureReady);
    dataset.hearthCanvasF13RenderReady = String(state.f13RenderReady);
    dataset.hearthCanvasF13FrameReady = String(state.f13FrameReady);
    dataset.hearthCanvasF13VisibleEvidenceAvailable = String(state.f13VisibleEvidenceAvailable);
    dataset.hearthCanvasF13VisibleEvidenceStrict = String(state.f13VisibleEvidenceStrict);
    dataset.hearthCanvasF13VisibleEvidenceDegraded = String(state.f13VisibleEvidenceDegraded);
    dataset.hearthCanvasF13EvidencePreserved = "true";
    dataset.hearthCanvasF13EvidenceStrict = String(state.f13CanvasEvidenceStrict);
    dataset.hearthCanvasF13EvidenceDegraded = String(state.f13CanvasEvidenceDegraded);
    dataset.hearthCanvasF13EvidenceComplete = String(state.f13CanvasEvidenceComplete);
    dataset.hearthCanvasF13HardFail = String(state.f13HardFail);

    dataset.hearthCanvasEvidenceBodyComposed = String(state.canvasEvidenceBodyComposed);
    dataset.hearthCanvasReturnPacketReady = String(state.canvasReturnPacketReady);
    dataset.hearthCanvasEvidenceSubmittedToNorth = String(state.canvasEvidenceSubmittedToNorth);

    dataset.hearthCanvasF21EligibleForNorth = "false";
    dataset.hearthCanvasF21SubmittedToNorth = "false";
    dataset.hearthCanvasF21Claimed = "false";
    dataset.hearthCanvasReadyTextClaimed = "false";
    dataset.hearthCanvasF21LatchMode = "north-only";
    dataset.hearthCanvasVisualPassClaimed = "false";

    dataset.hearthCanvasFirstFailedCoordinate = state.firstFailedCoordinate;
    dataset.hearthCanvasRecommendedNextFile = state.recommendedNextFile;
    dataset.hearthCanvasRecommendedNextRenewalTarget = state.recommendedNextRenewalTarget;

    dataset.generatedImage = "false";
    dataset.graphicBox = "false";
    dataset.webgl = "false";
    dataset.visualPassClaimed = "false";

    if (state.canvas) {
      state.canvas.dataset.hearthCanvasContract = CONTRACT;
      state.canvas.dataset.hearthCanvasReceipt = RECEIPT;
      state.canvas.dataset.hearthCanvasSplitContract = SPLIT_CONTRACT;
      state.canvas.dataset.hearthCanvasSplitReceipt = SPLIT_RECEIPT;
      state.canvas.dataset.hearthCanvasVersion = VERSION;
      state.canvas.dataset.hearthCanvasNorthActive = "true";
      state.canvas.dataset.hearthCanvasParentChildReconciliation = "true";
      state.canvas.dataset.hearthCanvasGovernedF13EvidenceReceiver = "true";
      state.canvas.dataset.hearthCanvasCarrierReady = String(state.carrierReady);
      state.canvas.dataset.hearthCanvasBootComplete = String(state.canvasBootComplete);
      state.canvas.dataset.hearthCanvasReady = String(state.canvasReady);
      state.canvas.dataset.hearthCanvasVisiblePlanetAvailable = String(state.visiblePlanetAvailable);
      state.canvas.dataset.hearthCanvasF13Only = "true";
      state.canvas.dataset.hearthCanvasF21Claimed = "false";
      state.canvas.dataset.hearthCanvasReadyTextClaimed = "false";
      state.canvas.dataset.visualPassClaimed = "false";
    }
  }

  function publishGlobals() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvas = api;
    root.HEARTH.canvasAuthority = api;
    root.HEARTH.canvasEvidence = api;
    root.HEARTH.canvasNorth = api;
    root.HEARTH.canvasSplitAdapter = api;
    root.HEARTH.canvasTransistorGate = api;
    root.HEARTH.canvasPhysicalObjectBootstrap = api;
    root.HEARTH.canvasSingleFileInternalNews = api;
    root.HEARTH.canvasParentIdentityBootHandshake = api;
    root.HEARTH.canvasParentGovernedF13EvidenceReceiver = api;
    root.HEARTH.canvasParentChildReconciliationF13EvidenceReceiver = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_NORTH = api;
    root.HEARTH_CANVAS_TEXTURE = api;
    root.HEARTH_CANVAS_SOFT_GAP_ADAPTER = api;
    root.HEARTH_CANVAS_VISUAL_FIDELITY = api;
    root.HEARTH_CANVAS_INTERACTIVE_ROTATION = api;
    root.HEARTH_CANVAS_STALE_PROTECTION = api;
    root.HEARTH_CANVAS_MATERIALS_RELIEF_CONSUMPTION_INVALIDATION = api;
    root.HEARTH_CANVAS_PARENT_GOVERNED_F13_EVIDENCE_RECEIVER = api;
    root.HEARTH_CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER = api;

    root.DEXTER_LAB.hearthCanvasEvidence = api;
    root.DEXTER_LAB.hearthCanvasNorth = api;
    root.DEXTER_LAB.hearthCanvasSplitAdapter = api;
    root.DEXTER_LAB.hearthCanvasTransistorGate = api;
    root.DEXTER_LAB.hearthCanvasMaterialsReliefConsumptionInvalidation = api;
    root.DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver = api;
    root.DEXTER_LAB.hearthCanvasParentChildReconciliationF13EvidenceReceiver = api;

    const light = getReceiptLight();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_EVIDENCE_RECEIPT = light;
    root.HEARTH_CANVAS_POSTGAME_RECEIPT = light;
    root.HEARTH.canvasReceipt = light;
    root.HEARTH.canvasEvidenceReceipt = light;

    root.__HEARTH_CANVAS_PARENT_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_PARENT_RECEIPT__ = RECEIPT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_CONTRACT__ = SPLIT_CONTRACT;
    root.__HEARTH_CANVAS_PARENT_SPLIT_RECEIPT__ = SPLIT_RECEIPT;

    updateDataset();
  }

  function fallbackReceipt(error = null) {
    const message = error && error.message ? error.message : safeString(error, "Canvas fallback used.");

    state.firstFailedCoordinate = "WAITING_CANVAS_GOVERNED_RELEASE_PACKET";
    state.recommendedNextFile = FILE;
    state.recommendedNextRenewalTarget = FILE;
    state.release.releaseAccepted = false;
    state.release.releaseStatus = RELEASE_STATUS.HELD_FALLBACK;
    state.release.releaseReason = message;
    state.physicalBootComplete = false;
    state.canvasBootComplete = false;
    state.canvasEvidenceBodyComposed = false;
    state.f13CanvasEvidenceComplete = false;
    state.f13HardFail = false;
    state.f21ClaimedByCanvas = false;
    state.readyTextClaimedByCanvas = false;
    state.visualPassClaimed = false;

    recordError("CANVAS_FALLBACK_USED", message);

    return getReceipt();
  }

  const api = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: LEGACY_BASELINE_CONTRACT,
    splitContract: SPLIT_CONTRACT,
    splitReceipt: SPLIT_RECEIPT,
    version: VERSION,
    file: FILE,

    normalizeCanvasReleaseInput,
    resolveCanvasRelease,
    holdCanvasUntilRelease,
    acceptCanvasReleasePacket,
    composeCanvasEvidenceBody,
    composeCanvasEvidenceReceipt,
    composeCanvasReturnPacket,
    submitCanvasEvidenceUpstream,
    getCanvasReleaseReceipt,
    getCanvasPrimaryGateReceipt,

    bootCooperative,
    boot,
    mount,
    render,
    forceRedraw,
    setRotation,
    resetRotation,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    invalidateTexture,
    rebuildTexture,
    ensureMaterialTextureFresh,
    sample,
    read,
    sampleVisibleContent,
    classifyVisibleContentEvidence,
    exportCanvasEvidenceReceipt: getReceipt,
    readNorthAuthority,
    submitCanvasEvidence,
    getReceipt,
    getReceiptText,
    getMaterialBridgeReceipt,
    getState,
    on,
    off,
    ensureChildren,
    resolveChild,
    ensureCarrier,
    drawEmergencyF13DiagnosticPlanet,
    verifyCurrentParentIdentity,
    deriveParentReadiness,
    mergeChildReceipts,

    canvasNorthActive: true,
    physicalObjectBootstrapActive: true,
    physicalCarrierProofActive: true,
    splitAdapterActive: true,
    transistorAdapterActive: true,

    governedF13EvidenceReceiverActive: true,
    parentChildReconciliationActive: true,
    waitsForWestRelease: true,
    cycleOneHeld: true,
    cycleTwoReleaseRequired: true,
    singlePhysicalFile: true,
    internalNewsZonesActive: true,
    noAdditionalCanvasFileSplit: true,

    parentIdentityGuardActive: true,
    bootHandshakeGuardActive: true,
    staleConsumptionGuardActive: true,
    expectedParentContract: CONTRACT,
    expectedParentSplitContract: SPLIT_CONTRACT,

    newsProtocolSynchronized: true,
    northGateReady: false,
    canvasFinalizesNews: false,
    newsGatePassedBeforeF21: false,
    newsGateDegradedBeforeF21: true,

    macroCycle1: MACRO_CYCLE_1,
    macroCycle2: MACRO_CYCLE_2,
    canvasChildSequence: CANVAS_CHILD_SEQUENCE,

    fibonacciAlignmentSynchronized: true,
    activeFibonacci: 13,
    activeFibonacciRank: "F13P",
    activeStageId: "canvas-parent-f13-evidence-receiver",
    activeGearId: "hearth-canvas-parent-f13",
    activeFibonacciGate: "F13",
    futureFibonacciGate: "F21",
    oneActiveGearAtATime: true,

    ownsCanvasEvidenceOnly: true,
    ownsGovernedF13EvidenceReceiver: true,
    ownsParentChildReconciliation: true,
    ownsCanvasParentGate: true,
    ownsParentIdentityGuard: true,
    ownsBootHandshakeGuard: true,
    ownsStaleConsumptionDetection: true,
    ownsPhysicalCarrierProof: true,
    ownsEmergencyF13DiagnosticPlanet: true,
    ownsPlanetTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsHydrologyTruth: false,
    ownsRuntimeTableGovernance: false,
    ownsWestAdmissibility: false,
    ownsNewsFinalAuthority: false,
    ownsReadyText: false,
    ownsF21: false,

    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByCanvas: false,
    readyTextClaimedByCanvas: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,

    get state() {
      deriveParentReadiness();
      return state;
    }
  };

  try {
    state.updatedAt = nowIso();
    publishEarlyMarker();
    publishGlobals();
    verifyCurrentParentIdentity("initial-publish");
    markChildrenPresence();
    updateDataset();

    recordLocal("CANVAS_PARENT_CHILD_RECONCILIATION_F13_EVIDENCE_RECEIVER_LOADED", {
      file: FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      waitsForWestRelease: true,
      autoBootSuppressed: true,
      parentChildReconciliationActive: true,
      visualPassClaimed: false
    });
  } catch (error) {
    fallbackReceipt(error);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
