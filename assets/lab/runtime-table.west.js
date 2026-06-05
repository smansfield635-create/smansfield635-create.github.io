// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9
// Full-file replacement.
// Cardinal West / Canvas v12_3 recognition / Surface Pointer Bishop adoption / Canvas release bridge.
// Previous:
// LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8
//
// Purpose:
// - Preserve West as the local admissibility clutch under North timetable authority.
// - Preserve the locked two-cycle law:
//   Cycle 1: NORTH -> EAST -> WEST -> SOUTH -> NORTH.
//   Cycle 2: NORTH -> EAST -> SOUTH -> WEST -> CANVAS.
// - Preserve West as the Canvas-release gate, not the source of upstream truth.
// - Recognize current Canvas v12_3, v12_2, v12_1, v12, and v11 lineage surfaces.
// - Recognize Surface Pointer Bishop v4 and legacy Surface Pointer Finger aliases.
// - Publish only necessary aliases required by Route Conductor, Canvas, Lab, and diagnostics.
// - Publish release packets only from RELEASE_TO_CANVAS.
// - Clear stale release packets during HOLD or HARD_BLOCK.
// - Trust authority surfaces and receipts; do not inspect subject/finger internals.
// - Preserve Queen outside cardinal functionality and Priest as priest, not bishop.
// - Preserve no Canvas drawing, no Canvas child internals, no planet truth, no F21 claim,
//   no ready text, no completion latch, no final visual pass, no generated image, no GraphicBox, and no WebGL.

(() => {
  "use strict";

  const CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9";
  const RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_RECEIPT_v4_9";

  const PREVIOUS_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8";
  const PREVIOUS_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT_v4_8";

  const LINEAGE_V4_7_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7";
  const LINEAGE_V4_7_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_RECEIPT_v4_7";

  const BASELINE_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CURRENT_CANVAS_PARENT_V10_3_CARRIER_COMPATIBILITY_TNT_v4_2";

  const VERSION =
    "2026-06-05.lab-runtime-table-west-canvas-v12-3-pointer-surface-bishop-release-bridge-v4-9";

  const FILE = "/assets/lab/runtime-table.west.js";
  const ROUTE = "/showroom/globe/hearth/";

  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/lab/runtime-table.east.js";
  const SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const WEST_FILE = FILE;

  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const PRIEST_FILE = "/showroom/globe/hearth/index.js";
  const QUEEN_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";

  const HIERARCHY_REGISTRY_CONTRACT =
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_CARDINAL_BISHOP_BISHOP_QUEEN_PRIEST_REGISTRY_v2";
  const HIERARCHY_REGISTRY_RECEIPT =
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_CARDINAL_BISHOP_BISHOP_QUEEN_PRIEST_REGISTRY_RECEIPT_v2";

  const ACTIVE_STAGE_ID = "C2_WEST_CANVAS_RELEASE_AUDIT";
  const ACTIVE_GEAR = "GEAR_C2_WEST_CANVAS_RELEASE_AUDIT";
  const ACTIVE_CYCLE_NUMBER = 2;
  const ACTIVE_CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const ACTIVE_CARDINAL = "WEST";
  const ACTIVE_FIBONACCI = "F13W";
  const ACTIVE_NEWS_GATE = "WEST";

  const WEST_DECISION = Object.freeze({
    HOLD: "HOLD",
    HARD_BLOCK: "HARD_BLOCK",
    RELEASE_TO_CANVAS: "RELEASE_TO_CANVAS"
  });

  const WEST_GAP_CLASS = Object.freeze({
    NONE: "NONE",
    NORTH_TIMETABLE_HOLD: "WAITING_NORTH_TIMETABLE",
    SOUTH_OUTPUT_HOLD: "WAITING_CYCLE_TWO_SOUTH_OUTPUT",
    HIERARCHY_HOLD: "WAITING_DOWNSTREAM_HIERARCHY_SURFACE",
    CANVAS_RECEIVER_HOLD: "WAITING_CANVAS_RECEIVER",
    CARRIER_HOLD: "CARRIER_HOLD",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK"
  });

  const BISHOP_CHORD_STATUS = Object.freeze({
    STRICT_CHORD: "STRICT_BISHOP_CHORD",
    ADMISSIBLE_CHORD: "ADMISSIBLE_BISHOP_CHORD",
    DEGRADED_CHORD: "DEGRADED_BISHOP_CHORD",
    HELD_CHORD: "HELD_BISHOP_CHORD",
    BLOCKED_CHORD: "BLOCKED_BISHOP_CHORD"
  });

  const CURRENT_CANVAS_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const CANVAS_BASELINE_HOLD_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_PARENT_RELEASE_ACCEPTANCE_EAST_DISPATCH_SWITCHBOARD_TNT_v10_3"
  ]);

  const POINTER_SURFACE_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2",
    "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1"
  ]);

  const CARDINAL_BISHOP_FILES = Object.freeze({
    north: NORTH_FILE,
    east: EAST_FILE,
    south: SOUTH_FILE,
    west: WEST_FILE
  });

  const DOWNSTREAM_BISHOP_FILES = Object.freeze({
    routeNorth: ROUTE_CONDUCTOR_FILE,
    canvasSouth: CANVAS_FILE,
    pointerWest: POINTER_SURFACE_FILE
  });

  const PRIEST_FILES = Object.freeze({ east: PRIEST_FILE });
  const QUEEN_FILES = Object.freeze({ queen: QUEEN_FILE });

  const NORTH_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_NORTH",
    "LAB_RUNTIME_TABLE",
    "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
    "HEARTH_NORTH_COMMAND",
    "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION",
    "LAB_CENTRAL_TRAIN_STATION",
    "DEXTER_LAB.runtimeTable",
    "DEXTER_LAB.cardinalRuntimeTableNorth",
    "DEXTER_LAB.northCentralTrainStation",
    "DEXTER_LAB.centralTrainStation",
    "HEARTH.northCentralTrainStation",
    "HEARTH.centralTrainStation",
    "HEARTH.northCommandRuntimeTable"
  ]);

  const EAST_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_EAST",
    "RUNTIME_TABLE_EAST",
    "DEXTER_LAB.runtimeTableEast",
    "DEXTER_LAB.cardinalRuntimeTableEast",
    "HEARTH.runtimeTableEast",
    "HEARTH.cardinalRuntimeTableEast",
    "HEARTH_CANVAS_EAST",
    "HEARTH.canvasEast",
    "DEXTER_LAB.hearthCanvasEast"
  ]);

  const SOUTH_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_GATE",
    "LAB_RUNTIME_TABLE_SOUTH",
    "RUNTIME_TABLE_SOUTH",
    "HEARTH_RUNTIME_TABLE_SOUTH",
    "HEARTH_SOUTH",
    "HEARTH_VISIBLE_STATE_COMPOSER",
    "DEXTER_LAB.runtimeTableSouth",
    "DEXTER_LAB.cardinalRuntimeTableSouth",
    "DEXTER_LAB.visibleStateComposer",
    "DEXTER_LAB.southPrimaryGate",
    "HEARTH.canvasSouth",
    "DEXTER_LAB.hearthCanvasSouth"
  ]);

  const ROUTE_CONDUCTOR_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_NORTH_BISHOP",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION",
    "HEARTH.routeConductor",
    "HEARTH.routeNorthBishop",
    "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteNorthBishop"
  ]);

  const PRIEST_ALIASES = Object.freeze([
    "HEARTH_INDEX_JS",
    "HEARTH_INDEX_BRIDGE",
    "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET",
    "HEARTH.indexJs",
    "HEARTH.indexBridge",
    "HEARTH.frontendButtonAuthorityReset",
    "HEARTH.buttonAuthority",
    "DEXTER_LAB.hearthIndexJs",
    "DEXTER_LAB.hearthIndexBridge",
    "DEXTER_LAB.hearthFrontendButtonAuthorityReset"
  ]);

  const QUEEN_ALIASES = Object.freeze([
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_FILE",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlFile",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthControlFile"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager"
  ]);

  const POINTER_SURFACE_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
    "HEARTH_CANVAS_BISHOP_SURFACE_POINTER",
    "HEARTH_CANVAS_POINTER_BISHOP",
    "HEARTH_CANVAS_SURFACE_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER",
    "HEARTH.canvasPointerBishop",
    "HEARTH.canvasBishopSurfacePointer",
    "HEARTH.canvasSurfaceBishop",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH.canvasPointerFinger",
    "HEARTH.canvasFingerSurfacePointer",
    "DEXTER_LAB.hearthCanvasPointerBishop",
    "DEXTER_LAB.hearthCanvasBishopSurfacePointer",
    "DEXTER_LAB.hearthCanvasSurfaceBishop",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasSurfaceFinger",
    "DEXTER_LAB.hearthCanvasPointerFinger"
  ]);

  const OUTPUT_MARKERS = Object.freeze([
    "westHandoffPacketReady",
    "outputSpreadComposed",
    "southOutputReady",
    "cycleTwoSouthOutputReady",
    "southOutputAdmissible",
    "southVisibleProofReady",
    "canvasSouthVisibleProofReady",
    "proofBodyComposed",
    "receiptComposed",
    "visibleStateComposed",
    "routeConductorOutputReady",
    "routeConductorReleaseCandidate",
    "visiblePlanetProofReady",
    "visibleGlobeProofReady"
  ]);

  const TRUE_ONLY_UNSAFE_KEYS = Object.freeze([
    "currentParentIdentityMismatch",
    "canvasParentIdentityMismatch",
    "currentParentStaleDetected",
    "canvasParentStaleDetected",
    "staleParentDetected",
    "bishopIdentityMismatch",
    "bishopChordMismatch",
    "bishopHardFail",
    "f13HardFail",
    "visibleContentHardFail"
  ]);

  const FALSE_IS_UNSAFE_KEYS = Object.freeze([
    "structuralCarrierSafe",
    "hearthCanvasStructuralCarrierSafe",
    "canvasParentCarrierSafe",
    "hearthCanvasParentCarrierSafe",
    "structuralCarrierSafeForCanvasRelease",
    "hearthCanvasStructuralCarrierSafeForCanvasRelease",
    "canvasPreReleaseCarrierSafeForWest",
    "hearthCanvasPreReleaseCarrierSafeForWest",
    "bishopCarrierSafe",
    "bishopChordSafe"
  ]);

  const NON_EMPTY_ERROR_KEYS = Object.freeze([
    "canvasCarrierHandoffError",
    "carrierHandoffError",
    "bishopChordError",
    "bishopHandoffError"
  ]);

  const NO_CLAIMS = Object.freeze({
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByWest: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const state = {
    timestamp: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV47Contract: LINEAGE_V4_7_CONTRACT,
    lineageV47Receipt: LINEAGE_V4_7_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    role: "lab-runtime-table-cardinal-west-canvas-v12-3-pointer-surface-bishop-release-bridge",

    westV4_9Active: true,
    westV4_8Superseded: true,
    westV4_7Superseded: true,

    westGateLanguageActive: true,
    westGateOwnsUpstreamTruth: false,
    upstreamCardinalSelfNamingRequired: false,

    hierarchyRegistryActive: true,
    hierarchyRegistryContract: HIERARCHY_REGISTRY_CONTRACT,
    hierarchyRegistryReceipt: HIERARCHY_REGISTRY_RECEIPT,
    hierarchyRegistryPublished: false,

    cardinalBishopTermOwnedByHierarchyMap: true,
    downstreamBishopTermActive: true,
    queenExcludedFromCardinalFunctionality: true,
    priestNotBishop: true,

    routeConductorObserved: false,
    priestObserved: false,
    queenObserved: false,
    canvasObserved: false,
    pointerSurfaceObserved: false,
    pointerSurfaceContract: "",
    pointerSurfaceAccepted: false,
    pointerSurfaceHardBlock: false,

    hierarchySurfaceObservedCount: 0,
    hierarchySurfaceStatus: "HIERARCHY_REGISTRY_PUBLISHED_SURFACES_OPTIONAL",

    northTimetableObserved: false,
    northSourceMethod: "NONE",
    northActiveStageId: "",
    northActiveGearId: "",
    northActiveCycleNumber: 0,
    northActiveCycleRoute: "",
    northActiveCardinal: "",
    northActiveFileGate: "",
    northActiveFibonacci: "",
    northActiveNewsGate: "",
    northC2WestAuditAligned: false,

    cycleNumber: 0,
    cycleRoute: "",
    receivedFrom: "UNKNOWN",
    handoffTo: "UNKNOWN",
    sourceCardinal: "",
    targetCardinal: "",
    activeCycleInputCardinal: "",
    activeCycleHandoffTarget: "",

    indexPairReady: false,
    carrierHostAdmissibilityReady: false,
    f8SelfDutySatisfied: false,

    southOutputReady: false,
    explicitSouthOutputMarkerObserved: false,
    explicitSouthOutputMarkers: [],
    cycleTwoSouthOutputObserved: false,
    cycleTwoSouthOutputAdmissible: false,
    southOutputIntakeMethod: "NONE",

    bishopChordBridgeActive: true,
    bishopSubjectFileDelegationActive: true,
    westKnowsBishopsNotChildren: true,
    bishopChordStatus: BISHOP_CHORD_STATUS.HELD_CHORD,
    bishopChordStrict: false,
    bishopChordAdmissible: false,
    bishopChordDegraded: false,
    bishopChordHardBlock: false,
    bishopChordReadyCount: 0,
    bishopChordObservedCount: 0,
    bishopChordRequiredCount: 4,
    bishopChordGap: "WAITING_BISHOP_CHORD",
    bishopChordSourceMethod: "NONE",
    bishopChordReleaseMode: "NONE",
    bishopLanes: {},

    currentCanvasParentObserved: false,
    currentCanvasParentContractObserved: false,
    currentCanvasParentContract: "",
    currentCanvasParentReceipt: "",
    currentCanvasParentIsCurrentCanvas: false,
    canvasContractAccepted: false,
    canvasV123Recognized: false,
    canvasV122Recognized: false,
    canvasV121Recognized: false,
    canvasV12LineageAccepted: false,
    canvasV11LineageAccepted: false,
    canvasBaselineV10_3Recognized: false,
    v10_3BaselineRecognizedOnly: false,
    canvasReceiverApiReady: false,
    canvasReceiveSurfaceReady: false,
    canvasSummaryObserved: false,
    canvasVisibleProofReady: false,
    canvasMounted: false,
    canvasDrawComplete: false,
    canvasSourceMethod: "NONE",
    selectedCanvasProofRank: 99,
    selectedCanvasProofUnsafe: false,

    carrierIdentitySafe: false,
    carrierSafeMarkerObserved: false,
    preReleaseCarrierAdmissible: false,
    carrierHardBlock: false,
    carrierHeld: true,
    carrierHoldReason: "WAITING_CANVAS_V12_3_PROOF",
    explicitUnsafeFields: [],

    westAuditObserved: true,
    westAuditIntakeAccepted: false,
    westAuditAccepted: false,
    westAuditPassed: false,
    westDecision: WEST_DECISION.HOLD,
    westGapClass: WEST_GAP_CLASS.NORTH_TIMETABLE_HOLD,
    westHardBlock: false,
    westForwardAllowed: false,
    westCanvasReleaseApproved: false,

    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    canvasReleaseApprovedByWest: false,
    releaseToCanvas: false,
    canvasReleaseHeldReason: "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",
    releasePacket: null,

    firstFailedCoordinate: "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",
    recommendedNextFile: NORTH_FILE,
    recommendedNextRenewalTarget: NORTH_FILE,
    postgameStatus: "WEST_HOLD_WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",

    lastInput: null,
    lastNorthEvidence: null,
    lastHierarchyRegistry: null,
    lastHierarchySurface: null,
    lastBishopChord: null,
    lastCanvasProof: null,
    lastCanvasCandidates: [],
    lastPointerSurfaceProof: null,
    lastReceipt: null,

    ...NO_CLAIMS
  };

  function rootRef() {
    if (typeof window !== "undefined") return window;
    if (typeof globalThis !== "undefined") return globalThis;
    return {};
  }

  function documentRef() {
    const w = rootRef();
    return w.document || null;
  }

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

  function own(value, key) {
    return Boolean(value) && Object.prototype.hasOwnProperty.call(value, key);
  }

  function text(value) {
    if (value === undefined || value === null) return "";
    return String(value).trim();
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const candidate = text(value);
      if (candidate) return candidate;
    }
    return "";
  }

  function toBool(value) {
    if (value === true) return true;
    if (value === false) return false;
    if (value === 1 || value === "1") return true;
    if (value === 0 || value === "0") return false;

    if (typeof value === "string") {
      const v = value.trim().toLowerCase();
      if (v === "true" || v === "yes" || v === "pass" || v === "ready" || v === "accepted") return true;
      if (v === "false" || v === "no" || v === "fail" || v === "held") return false;
    }

    return false;
  }

  function explicitFalse(value) {
    if (value === false || value === 0 || value === "0") return true;
    if (typeof value === "string") return value.trim().toLowerCase() === "false";
    return false;
  }

  function explicitTrue(value) {
    if (value === true || value === 1 || value === "1") return true;
    if (typeof value === "string") return value.trim().toLowerCase() === "true";
    return false;
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : { ...value };
    }
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = String(path || "").split(".");
    let cursor = rootRef();

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function dataset() {
    const doc = documentRef();
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
  }

  function setDataset(key, value) {
    const ds = dataset();
    if (!ds) return;
    ds[key] = value === undefined || value === null ? "" : String(value);
  }

  function q(selector) {
    const doc = documentRef();
    if (!doc) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function readFirst(source, keys) {
    if (!isObject(source)) return undefined;

    for (const key of keys) {
      if (own(source, key) && source[key] !== undefined && source[key] !== null && String(source[key]).trim() !== "") {
        return source[key];
      }
    }

    return undefined;
  }

  function readBool(source, keys) {
    const value = readFirst(source, keys);
    return value === undefined ? false : toBool(value);
  }

  function readNumber(source, keys, fallback = 0) {
    const value = readFirst(source, keys);
    return value === undefined ? fallback : toNumber(value, fallback);
  }

  function safeCall(fn, fallback = null) {
    try {
      if (isFunction(fn)) return fn();
    } catch (_error) {
      return fallback;
    }
    return fallback;
  }

  function firstAuthority(names) {
    for (const name of names || []) {
      const value = readPath(name);
      if (value && isObject(value)) return { name, authority: value };
    }
    return { name: "NONE", authority: null };
  }

  function scriptPresentForPath(path) {
    const doc = documentRef();
    if (!doc || !path) return false;

    try {
      const scripts = Array.from(doc.querySelectorAll("script[src]"));
      const fileName = path.split("/").filter(Boolean).pop();

      return scripts.some((script) => {
        const src = script.getAttribute("src") || "";
        return src.includes(path) || (fileName && src.includes(fileName));
      });
    } catch (_error) {
      return false;
    }
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return { method: "NONE", receipt: null };

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getTransmissionReceipt",
      "getNorthCommandReceipt",
      "getActiveGateState",
      "getCentralStationReceiptLight",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getBishopPacket",
      "getPointerBishopPacket",
      "getPointerFingerPacket",
      "getSurfacePacket",
      "getControlReceipt",
      "getControlsReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      const result = safeCall(() => method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
        ? authority[method](false)
        : authority[method](), null);

      if (isObject(result)) return { method, receipt: result };
    }

    if (isObject(authority.receipt)) return { method: "receipt", receipt: authority.receipt };
    if (isObject(authority.receiptPacket)) return { method: "receiptPacket", receipt: authority.receiptPacket };
    if (isObject(authority.canvasStationSummary)) return { method: "canvasStationSummary", receipt: authority.canvasStationSummary };
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return { method: "authorityObject", receipt: authority };
    }

    return { method: "NONE", receipt: null };
  }

  function contractFromProof(proof) {
    const p = isObject(proof) ? proof : {};
    return firstNonEmpty(
      p.currentCanvasParentContract,
      p.canvasLocalStationContract,
      p.canvasContract,
      p.hearthCanvasContract,
      p.controlContract,
      p.controlsContract,
      p.bishopContract,
      p.pointerBishopContract,
      p.surfaceContract,
      p.fingerContract,
      p.priestContract,
      p.queenContract,
      p.contract,
      p.CONTRACT
    );
  }

  function receiptFromProof(proof) {
    const p = isObject(proof) ? proof : {};
    return firstNonEmpty(
      p.currentCanvasParentReceipt,
      p.canvasLocalStationReceipt,
      p.canvasReceipt,
      p.hearthCanvasReceipt,
      p.bishopReceipt,
      p.pointerBishopReceipt,
      p.surfaceReceipt,
      p.fingerReceipt,
      p.queenReceipt,
      p.receipt,
      p.RECEIPT
    );
  }

  function unsafeFieldsFromProof(proof) {
    const p = isObject(proof) ? proof : {};
    const fields = [];

    TRUE_ONLY_UNSAFE_KEYS.forEach((key) => {
      if (own(p, key) && explicitTrue(p[key])) fields.push(key);
    });

    FALSE_IS_UNSAFE_KEYS.forEach((key) => {
      if (own(p, key) && explicitFalse(p[key])) fields.push(key);
    });

    NON_EMPTY_ERROR_KEYS.forEach((key) => {
      if (own(p, key) && text(p[key])) fields.push(key);
    });

    const v2Observed =
      (own(p, "canvasParentV2Observed") && explicitTrue(p.canvasParentV2Observed)) ||
      (own(p, "hearthCanvasParentV2Observed") && explicitTrue(p.hearthCanvasParentV2Observed));

    const staleFalsePositiveBlocked = readBool(p, [
      "hearthCanvasStaleParentV2FalsePositiveBlocked",
      "canvasStaleParentV2FalsePositiveBlocked",
      "staleCanvasV2FalsePositiveBlocked"
    ]);

    if (v2Observed && !staleFalsePositiveBlocked) fields.push("canvasParentV2Observed");

    return fields;
  }

  function hasReceiveSurface(authority) {
    if (!authority || !isObject(authority)) return false;

    return Boolean(
      isFunction(authority.consumeRouteConductorReleasePacket) ||
      isFunction(authority.receiveRouteConductorReleasePacket) ||
      isFunction(authority.consumeReleasePacket) ||
      isFunction(authority.receiveReleasePacket) ||
      isFunction(authority.receiveCanvasReleasePacket) ||
      isFunction(authority.receiveCanvasParentPacket) ||
      isFunction(authority.acceptReleasePacket) ||
      isFunction(authority.receiveBishopPacket) ||
      isFunction(authority.receiveCanvasBishopPacket) ||
      isFunction(authority.registerCanvasBishop) ||
      isFunction(authority.registerExpressionBishop) ||
      isFunction(authority.receiveFingerPacket) ||
      isFunction(authority.receiveCanvasFingerPacket) ||
      isFunction(authority.registerCanvasFinger) ||
      isFunction(authority.registerExpressionFinger) ||
      isFunction(authority.boot) ||
      isFunction(authority.init) ||
      isFunction(authority.start) ||
      isFunction(authority.mount)
    );
  }

  function composeHierarchyRegistry() {
    return {
      timestamp: nowIso(),
      contract: HIERARCHY_REGISTRY_CONTRACT,
      receipt: HIERARCHY_REGISTRY_RECEIPT,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      sourceFile: FILE,
      route: ROUTE,

      adoptionMode: "WEST_GATE_DOWNSTREAM_ADOPTION",
      westGatePublishesDownstreamLanguage: true,
      westGateOwnsUpstreamTruth: false,
      upstreamCardinalSelfNamingRequired: false,
      cardinalBishopTermOwnedByHierarchyMap: true,
      downstreamBishopTermActive: true,
      queenExcludedFromCardinalFunctionality: true,
      priestNotBishop: true,

      cardinalBishops: {
        north: {
          address: "NORTH",
          rank: "CARDINAL_BISHOP",
          file: NORTH_FILE,
          selfLabelRequired: false,
          westReadsAsOpaqueAuthority: true
        },
        east: {
          address: "EAST",
          rank: "CARDINAL_BISHOP",
          file: EAST_FILE,
          selfLabelRequired: false,
          westReadsAsOpaqueAuthority: true
        },
        south: {
          address: "SOUTH",
          rank: "CARDINAL_BISHOP",
          file: SOUTH_FILE,
          selfLabelRequired: false,
          westReadsAsOpaqueAuthority: true
        },
        west: {
          address: "WEST",
          rank: "CARDINAL_BISHOP",
          file: WEST_FILE,
          westGate: true
        }
      },

      downstreamBishops: {
        routeNorth: {
          address: "NORTH",
          rank: "DOWNSTREAM_BISHOP",
          file: ROUTE_CONDUCTOR_FILE,
          role: "ROUTE_CONDUCTOR_HANDSHAKE_AND_CANVAS_RELEASE_FUNNEL"
        },
        canvasSouth: {
          address: "SOUTH",
          rank: "DOWNSTREAM_BISHOP",
          file: CANVAS_FILE,
          role: "CANVAS_RECEIVER_OUTPUT_CARRIER"
        },
        pointerWest: {
          address: "WEST_POINTER",
          rank: "NON_CARDINAL_POINTER_BISHOP",
          file: POINTER_SURFACE_FILE,
          role: "SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET"
        }
      },

      priest: {
        east: {
          address: "EAST",
          rank: "PRIEST",
          file: PRIEST_FILE,
          role: "INDEX_FRONT_DOOR_BRIDGE_LOADER_BUTTON_AUTHORITY",
          notBishop: true
        }
      },

      queen: {
        rank: "QUEEN",
        file: QUEEN_FILE,
        address: "NON_CARDINAL_CONTROL_RECEIVER",
        excludedFromCardinalFunctionality: true,
        receivesHandshake: true,
        ownsViewInputAfterAdmission: true
      },

      rules: {
        westMayPublishDownstreamRegistry: true,
        downstreamMayAdoptWestGateRegistry: true,
        westDoesNotRenameUpstreamInternals: true,
        westDoesNotOwnQueenBehavior: true,
        westDoesNotInspectSubjectFiles: true,
        westDoesNotInspectFingerInternals: true,
        bishopsOwnSubjectFiles: true,
        queenOutsideCardinalFunctionality: true,
        priestNotBishop: true,
        noF21Claim: true,
        noReadyText: true,
        noVisualPassClaim: true
      }
    };
  }

  function publishHierarchyRegistry() {
    const w = rootRef();
    const hearth = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");
    const registry = composeHierarchyRegistry();

    state.lastHierarchyRegistry = clonePlain(registry);
    state.hierarchyRegistryPublished = true;

    w.HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_REGISTRY = clonePlain(registry);
    w.HEARTH_HIERARCHY_REGISTRY = clonePlain(registry);
    w.LAB_RUNTIME_TABLE_WEST_HIERARCHY_REGISTRY = clonePlain(registry);

    hearth.westGateDownstreamHierarchyRegistry = clonePlain(registry);
    hearth.hierarchyRegistry = clonePlain(registry);
    hearth.cardinalBishopHierarchy = clonePlain(registry.cardinalBishops);
    hearth.downstreamBishopHierarchy = clonePlain(registry.downstreamBishops);
    hearth.queenHierarchy = clonePlain(registry.queen);
    hearth.priestHierarchy = clonePlain(registry.priest);

    lab.hearthWestGateDownstreamHierarchyRegistry = clonePlain(registry);
    lab.hearthHierarchyRegistry = clonePlain(registry);

    return registry;
  }

  function readHierarchySurface() {
    const routeConductor = firstAuthority(ROUTE_CONDUCTOR_ALIASES);
    const priest = firstAuthority(PRIEST_ALIASES);
    const queen = firstAuthority(QUEEN_ALIASES);
    const canvas = firstAuthority(CANVAS_ALIASES);
    const pointer = firstAuthority(POINTER_SURFACE_ALIASES);

    const routeConductorObserved = Boolean(routeConductor.authority || scriptPresentForPath(ROUTE_CONDUCTOR_FILE));
    const priestObserved = Boolean(priest.authority || scriptPresentForPath(PRIEST_FILE) || scriptPresentForPath("index.js"));
    const queenObserved = Boolean(queen.authority || scriptPresentForPath(QUEEN_FILE));
    const canvasObserved = Boolean(canvas.authority || scriptPresentForPath(CANVAS_FILE) || q("#hearthCanvasMount") || q("[data-hearth-canvas-mount]"));
    const pointerObserved = Boolean(pointer.authority || scriptPresentForPath(POINTER_SURFACE_FILE));

    const count = [
      routeConductorObserved,
      priestObserved,
      queenObserved,
      canvasObserved,
      pointerObserved
    ].filter(Boolean).length;

    state.routeConductorObserved = routeConductorObserved;
    state.priestObserved = priestObserved;
    state.queenObserved = queenObserved;
    state.canvasObserved = canvasObserved;
    state.pointerSurfaceObserved = pointerObserved;
    state.hierarchySurfaceObservedCount = count;
    state.hierarchySurfaceStatus = count >= 3
      ? "HIERARCHY_SURFACES_PARTIALLY_OBSERVED_DOWNSTREAM_ADOPTION_READY"
      : "HIERARCHY_REGISTRY_PUBLISHED_SURFACES_OPTIONAL";

    const surface = {
      contract: HIERARCHY_REGISTRY_CONTRACT,
      receipt: HIERARCHY_REGISTRY_RECEIPT,
      sourceFile: FILE,
      routeConductorObserved,
      routeConductorSource: routeConductor.name,
      eastPriestObserved: priestObserved,
      eastPriestSource: priest.name,
      queenObserved,
      queenSource: queen.name,
      canvasReceiverObserved: canvasObserved,
      canvasReceiverSource: canvas.name,
      pointerSurfaceBishopObserved: pointerObserved,
      pointerSurfaceBishopSource: pointer.name,
      hierarchySurfaceObservedCount: count,
      hierarchySurfaceRequiredCount: 5,
      hierarchySurfaceStatus: state.hierarchySurfaceStatus
    };

    state.lastHierarchySurface = clonePlain(surface);
    return surface;
  }

  function readNorthAuthorityReceipt() {
    const found = firstAuthority(NORTH_ALIASES);

    if (found.authority) {
      const read = readAuthorityReceipt(found.authority);
      return {
        sourceMethod: `${found.name}.${read.method}`,
        proof: read.receipt || found.authority
      };
    }

    const w = rootRef();
    const direct = [
      ["LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT", w.LAB_RUNTIME_TABLE_NORTH_TRANSMISSION_RECEIPT],
      ["HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT", w.HEARTH_NORTH_COMMAND_RUNTIME_TABLE_RECEIPT],
      ["HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT", w.HEARTH_NORTH_CYCLICAL_CHECKPOINT_RECEIPT],
      ["LAB_RUNTIME_TABLE_NORTH_CENTRAL_STATION_RECEIPT", w.LAB_RUNTIME_TABLE_NORTH_CENTRAL_STATION_RECEIPT],
      ["HEARTH_NORTH_CENTRAL_STATION_RECEIPT", w.HEARTH_NORTH_CENTRAL_STATION_RECEIPT]
    ];

    for (const [name, proof] of direct) {
      if (isObject(proof)) return { sourceMethod: name, proof };
    }

    return { sourceMethod: "NONE", proof: null };
  }

  function normalizeNorthTimetable(source, sourceMethod) {
    const ds = dataset();
    const s = isObject(source) ? source : {};
    const merged = { ...ds, ...s };

    const normalized = {
      northTimetableObserved: Boolean(source),
      northSourceMethod: sourceMethod || "NONE",
      northActiveStageId: text(readFirst(merged, ["activeStageId", "northActiveStageId", "hearthNorthActiveStageId", "stageId"])),
      northActiveGearId: text(readFirst(merged, ["activeGear", "activeGearId", "northActiveGear", "northActiveGearId", "hearthNorthActiveGear", "hearthNorthActiveGearId"])),
      northActiveCycleNumber: readNumber(merged, ["activeCycleNumber", "cycleNumber", "northActiveCycleNumber", "hearthNorthActiveCycleNumber"], 0),
      northActiveCycleRoute: text(readFirst(merged, ["activeCycleRoute", "cycleRoute", "northActiveCycleRoute", "hearthNorthActiveCycleRoute"])),
      northActiveCardinal: text(readFirst(merged, ["activeCardinal", "northActiveCardinal", "hearthNorthActiveCardinal"])),
      northActiveFileGate: text(readFirst(merged, ["activeFileGate", "fileGate", "northActiveFileGate", "hearthNorthActiveFileGate"])),
      northActiveFibonacci: text(readFirst(merged, ["activeFibonacci", "northActiveFibonacci", "hearthNorthActiveFibonacci"])),
      northActiveNewsGate: text(readFirst(merged, ["activeNewsGate", "northActiveNewsGate", "hearthNorthActiveNewsGate"]))
    };

    normalized.northC2WestAuditAligned = Boolean(
      normalized.northActiveStageId === ACTIVE_STAGE_ID &&
      (!normalized.northActiveGearId || normalized.northActiveGearId === ACTIVE_GEAR) &&
      normalized.northActiveCycleNumber === ACTIVE_CYCLE_NUMBER &&
      normalized.northActiveCycleRoute === ACTIVE_CYCLE_ROUTE &&
      normalized.northActiveCardinal === ACTIVE_CARDINAL &&
      normalized.northActiveFileGate === FILE
    );

    return normalized;
  }

  function readNorthTimetableLight() {
    const found = readNorthAuthorityReceipt();
    const normalized = normalizeNorthTimetable(found.proof, found.sourceMethod);

    state.lastNorthEvidence = clonePlain({
      sourceMethod: found.sourceMethod,
      proof: found.proof,
      normalized
    });

    state.northTimetableObserved = normalized.northTimetableObserved;
    state.northSourceMethod = normalized.northSourceMethod;
    state.northActiveStageId = normalized.northActiveStageId;
    state.northActiveGearId = normalized.northActiveGearId;
    state.northActiveCycleNumber = normalized.northActiveCycleNumber;
    state.northActiveCycleRoute = normalized.northActiveCycleRoute;
    state.northActiveCardinal = normalized.northActiveCardinal;
    state.northActiveFileGate = normalized.northActiveFileGate;
    state.northActiveFibonacci = normalized.northActiveFibonacci;
    state.northActiveNewsGate = normalized.northActiveNewsGate;
    state.northC2WestAuditAligned = normalized.northC2WestAuditAligned;

    return normalized;
  }

  function normalizeCycleInput(input) {
    const packet = isObject(input) ? clonePlain(input) : {};
    const ds = dataset();
    const merged = { ...ds, ...packet };

    let cycleNumber = readNumber(merged, [
      "cycleNumber",
      "activeCycleNumber",
      "hearthCycleNumber",
      "hearthRouteConductorCycleNumber",
      "hearthSouthCycleNumber",
      "hearthWestCycleNumber"
    ], 0);

    let cycleRoute = text(readFirst(merged, [
      "cycleRoute",
      "activeCycleRoute",
      "hearthCycleRoute",
      "hearthRouteConductorCycleRoute",
      "hearthSouthCycleRoute",
      "hearthWestCycleRoute"
    ]));

    const activeNewsCycle = text(readFirst(merged, [
      "activeNewsCycle",
      "hearthRouteConductorActiveNewsCycle"
    ]));

    const event = text(readFirst(merged, ["event", "checkpointEvent", "packetType", "type"]));

    const routeConductorAdmissibilityEvent = Boolean(
      event === "NEWS_CYCLE_2_CANVAS_RELEASE_ADMISSIBILITY" ||
      event === "ROUTE_CONDUCTOR_NEWS_FIBONACCI_CANVAS_RELEASE_PACKET" ||
      event.includes("CANVAS_RELEASE_ADMISSIBILITY") ||
      packet.visibleGlobeProofIngestionRequested === true ||
      packet.bishopQueenCanvasRecognitionFunnelActive === true
    );

    if (!cycleNumber && (activeNewsCycle === ACTIVE_CYCLE_ROUTE || activeNewsCycle === "CYCLE_2" || event.includes("CYCLE_2") || routeConductorAdmissibilityEvent)) {
      cycleNumber = 2;
    }

    if (!cycleRoute && (activeNewsCycle === ACTIVE_CYCLE_ROUTE || activeNewsCycle === "CYCLE_2" || event.includes("CYCLE_2") || routeConductorAdmissibilityEvent)) {
      cycleRoute = ACTIVE_CYCLE_ROUTE;
    }

    const receivedFrom = text(readFirst(merged, [
      "receivedFrom",
      "sourceCardinal",
      "hearthReceivedFrom",
      "hearthRouteConductorReceivedFrom",
      "hearthSouthReceivedFrom",
      "hearthWestReceivedFrom"
    ]));

    const handoffTo = text(readFirst(merged, [
      "handoffTo",
      "targetCardinal",
      "activeCycleHandoffTarget",
      "hearthHandoffTo",
      "hearthRouteConductorHandoffTo",
      "hearthSouthHandoffTo",
      "hearthWestHandoffTo"
    ]));

    const sourceCardinal = text(readFirst(merged, [
      "sourceCardinal",
      "primaryCardinal",
      "activeCycleInputCardinal"
    ]));

    const targetCardinal = text(readFirst(merged, [
      "targetCardinal",
      "activeCycleHandoffTarget"
    ]));

    const activeCycleInputCardinal = text(readFirst(merged, [
      "activeCycleInputCardinal",
      "sourceCardinal",
      "hearthActiveCycleInputCardinal",
      "hearthRouteConductorActiveCycleInputCardinal",
      "hearthSouthActiveCycleInputCardinal"
    ]));

    const activeCycleHandoffTarget = text(readFirst(merged, [
      "activeCycleHandoffTarget",
      "targetCardinal",
      "hearthActiveCycleHandoffTarget",
      "hearthRouteConductorActiveCycleHandoffTarget"
    ]));

    const indexPairReady = readBool(merged, [
      "indexPairReady",
      "indexGateReady",
      "indexPriestGateReady",
      "hearthIndexPairReady",
      "hearthRouteConductorIndexPairReady",
      "hearthSouthIndexPairReady",
      "hearthSouthIndexPriestGateReady"
    ]);

    const carrierHostAdmissibilityReady = readBool(merged, [
      "carrierHostAdmissibilityReady",
      "hearthCarrierHostAdmissibilityReady",
      "hearthRouteConductorCarrierHostAdmissibilityReady",
      "hearthSouthCarrierHostAdmissibilityReady"
    ]);

    const f8SelfDutySatisfied = readBool(merged, [
      "f8SelfDutySatisfied",
      "routeF8GateReady",
      "routeNorthBishopGateReady",
      "hearthF8SelfDutySatisfied",
      "hearthRouteConductorF8SelfDutySatisfied",
      "hearthSouthF8SelfDutySatisfied",
      "hearthSouthRouteF8GateReady",
      "hearthSouthRouteNorthBishopGateReady"
    ]);

    const explicitMarkers = [];
    let outputReady = false;

    for (const marker of OUTPUT_MARKERS) {
      const aliases = [
        marker,
        `hearth${marker.charAt(0).toUpperCase()}${marker.slice(1)}`,
        `hearthSouth${marker.charAt(0).toUpperCase()}${marker.slice(1)}`,
        `hearthRouteConductor${marker.charAt(0).toUpperCase()}${marker.slice(1)}`
      ];

      const value = readFirst(merged, aliases);
      if (value !== undefined && toBool(value)) {
        explicitMarkers.push(marker);
        outputReady = true;
      }
    }

    const routeAligned = cycleNumber === ACTIVE_CYCLE_NUMBER && cycleRoute === ACTIVE_CYCLE_ROUTE;
    const sourceIsSouth = receivedFrom === "SOUTH" || activeCycleInputCardinal === "SOUTH" || sourceCardinal === "SOUTH";
    const targetIsWest = handoffTo === "WEST" || activeCycleHandoffTarget === "WEST" || targetCardinal === "WEST";

    const observed = Boolean((routeAligned && sourceIsSouth && targetIsWest) || routeConductorAdmissibilityEvent);
    const admissible = Boolean(
      observed &&
      (indexPairReady || routeConductorAdmissibilityEvent) &&
      (carrierHostAdmissibilityReady || routeConductorAdmissibilityEvent) &&
      (f8SelfDutySatisfied || routeConductorAdmissibilityEvent) &&
      (outputReady || routeConductorAdmissibilityEvent)
    );

    state.cycleNumber = cycleNumber;
    state.cycleRoute = cycleRoute;
    state.receivedFrom = receivedFrom || sourceCardinal || "UNKNOWN";
    state.handoffTo = handoffTo || activeCycleHandoffTarget || targetCardinal || "UNKNOWN";
    state.sourceCardinal = sourceCardinal;
    state.targetCardinal = targetCardinal;
    state.activeCycleInputCardinal = activeCycleInputCardinal;
    state.activeCycleHandoffTarget = activeCycleHandoffTarget;
    state.indexPairReady = indexPairReady || routeConductorAdmissibilityEvent;
    state.carrierHostAdmissibilityReady = carrierHostAdmissibilityReady || routeConductorAdmissibilityEvent;
    state.f8SelfDutySatisfied = f8SelfDutySatisfied || routeConductorAdmissibilityEvent;
    state.southOutputReady = outputReady || routeConductorAdmissibilityEvent;
    state.explicitSouthOutputMarkerObserved = outputReady;
    state.explicitSouthOutputMarkers = explicitMarkers.slice();
    state.cycleTwoSouthOutputObserved = observed;
    state.cycleTwoSouthOutputAdmissible = admissible;
    state.southOutputIntakeMethod = observed
      ? routeConductorAdmissibilityEvent
        ? "ROUTE_CONDUCTOR_CYCLE_TWO_CANVAS_RELEASE_ADMISSIBILITY"
        : "NORTH_OR_ROUTE_CONFIRMED_SOUTH_TO_WEST_CYCLE_TWO"
      : "NONE";

    state.lastInput = clonePlain({
      packet,
      cycleNumber,
      cycleRoute,
      receivedFrom,
      handoffTo,
      sourceCardinal,
      targetCardinal,
      activeCycleInputCardinal,
      activeCycleHandoffTarget,
      indexPairReady: state.indexPairReady,
      carrierHostAdmissibilityReady: state.carrierHostAdmissibilityReady,
      f8SelfDutySatisfied: state.f8SelfDutySatisfied,
      explicitMarkers,
      routeConductorAdmissibilityEvent,
      observed,
      admissible
    });

    return clonePlain(state.lastInput);
  }

  function inputCallsWestForCycleTwoAudit(input) {
    const normalized = normalizeCycleInput(input);
    return Boolean(normalized.observed || normalized.routeConductorAdmissibilityEvent);
  }

  function isNorthCallingWestForCycleTwoCanvasAudit(input) {
    const north = readNorthTimetableLight();
    const inputAligned = inputCallsWestForCycleTwoAudit(input);

    state.northC2WestAuditAligned = Boolean(north.northC2WestAuditAligned || inputAligned);
    return state.northC2WestAuditAligned;
  }

  function normalizeAuthorityLane(lane, aliases, file) {
    const found = firstAuthority(aliases);
    const read = found.authority ? readAuthorityReceipt(found.authority) : { method: "NONE", receipt: null };
    const proof = read.receipt || {};
    const contract = contractFromProof(proof) || firstNonEmpty(found.authority && found.authority.contract, found.authority && found.authority.CONTRACT);
    const receipt = receiptFromProof(proof) || firstNonEmpty(found.authority && found.authority.receipt, found.authority && found.authority.RECEIPT);
    const unsafeFields = unsafeFieldsFromProof(proof);

    const hardBlock = Boolean(
      unsafeFields.length ||
      readBool(proof, ["hardBlock", "blocked", "bishopHardBlock", "f13HardFail", "visibleContentHardFail"])
    );

    const explicitReady = readBool(proof, [
      "bishopReady",
      "bishopLaneReady",
      "ready",
      "accepted",
      "apiReady",
      "authorityReady",
      "westAuditAccepted",
      "westCanvasReleaseApproved",
      "northC2WestAuditAligned",
      "centralTrainStationActive",
      "visiblePlanetProofReady",
      "f13CanvasEvidenceComplete"
    ]);

    const apiReady = Boolean(
      found.authority &&
      (
        explicitReady ||
        hasReceiveSurface(found.authority) ||
        isFunction(found.authority.getReceipt) ||
        isFunction(found.authority.getReceiptLight) ||
        isFunction(found.authority.getStatus) ||
        isFunction(found.authority.getState)
      )
    );

    const observed = Boolean(found.authority || contract || receipt);

    return {
      lane,
      file,
      sourceName: found.name,
      sourceMethod: read.method === "NONE" ? found.name : `${found.name}.${read.method}`,
      observed,
      authorityPresent: Boolean(found.authority),
      contract: contract || "",
      receipt: receipt || "",
      apiReady,
      explicitReady,
      admissible: Boolean(observed && apiReady && !hardBlock),
      hardBlock,
      unsafeFields,
      westInspectsSubjectFiles: false,
      upstreamSelfNamingRequired: false,
      proof: clonePlain(proof)
    };
  }

  function readPointerSurfaceProof() {
    const found = firstAuthority(POINTER_SURFACE_ALIASES);
    const read = found.authority ? readAuthorityReceipt(found.authority) : { method: "NONE", receipt: null };
    const proof = read.receipt || {};
    const contract = contractFromProof(proof) || firstNonEmpty(found.authority && found.authority.contract, found.authority && found.authority.CONTRACT);
    const unsafeFields = unsafeFieldsFromProof(proof);

    const shapeAccepted = Boolean(
      readBool(proof, ["pointerBishopActive", "surfaceFingerActive", "pointerFingerActive", "bishopLanguageActive"]) ||
      readBool(proof, ["surfacePacketReady", "pointerBishopPacketReady", "visibleContributionAvailable"]) ||
      found.name !== "NONE"
    );

    const accepted = Boolean(
      found.authority &&
      !unsafeFields.length &&
      (
        POINTER_SURFACE_CONTRACTS.includes(contract) ||
        shapeAccepted
      )
    );

    const result = {
      sourceName: found.name,
      sourceMethod: read.method === "NONE" ? found.name : `${found.name}.${read.method}`,
      observed: Boolean(found.authority || scriptPresentForPath(POINTER_SURFACE_FILE)),
      authorityPresent: Boolean(found.authority),
      contract: contract || "",
      accepted,
      hardBlock: Boolean(unsafeFields.length || readBool(proof, ["hardBlock", "bishopHardBlock"])),
      unsafeFields,
      supportsPointerBishop: Boolean(accepted || readBool(proof, ["supportsSurfacePointerBishop", "supportsPointerBishopSocket"])),
      supportsLegacyFinger: Boolean(accepted || readBool(proof, ["supportsLegacyFingerCompatibility", "pointerFingerActive"])),
      proof: clonePlain(proof)
    };

    state.pointerSurfaceObserved = result.observed;
    state.pointerSurfaceContract = result.contract;
    state.pointerSurfaceAccepted = result.accepted;
    state.pointerSurfaceHardBlock = result.hardBlock;
    state.lastPointerSurfaceProof = clonePlain(result);

    return result;
  }

  function readBishopChord() {
    const lanes = {
      north: normalizeAuthorityLane("north", NORTH_ALIASES, NORTH_FILE),
      east: normalizeAuthorityLane("east", EAST_ALIASES, EAST_FILE),
      south: normalizeAuthorityLane("south", SOUTH_ALIASES, SOUTH_FILE),
      west: {
        lane: "west",
        file: WEST_FILE,
        sourceName: "SELF",
        sourceMethod: "SELF",
        observed: true,
        authorityPresent: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        apiReady: true,
        explicitReady: true,
        admissible: true,
        hardBlock: false,
        unsafeFields: [],
        westInspectsSubjectFiles: false,
        upstreamSelfNamingRequired: false,
        proof: { contract: CONTRACT, receipt: RECEIPT }
      },
      routeConductor: normalizeAuthorityLane("routeConductor", ROUTE_CONDUCTOR_ALIASES, ROUTE_CONDUCTOR_FILE),
      canvas: normalizeAuthorityLane("canvas", CANVAS_ALIASES, CANVAS_FILE),
      pointerSurface: {
        ...readPointerSurfaceProof(),
        lane: "pointerSurface",
        file: POINTER_SURFACE_FILE,
        apiReady: state.pointerSurfaceAccepted,
        admissible: state.pointerSurfaceAccepted
      }
    };

    const cardinalValues = [lanes.north, lanes.east, lanes.south, lanes.west];
    const downstreamValues = [lanes.routeConductor, lanes.canvas, lanes.pointerSurface];

    const allValues = [...cardinalValues, ...downstreamValues];
    const hardBlocks = allValues.filter((lane) => lane.hardBlock);
    const observedCount = allValues.filter((lane) => lane.observed).length;
    const readyCount = allValues.filter((lane) => lane.admissible).length;

    const routeConductorInput = state.lastInput && state.lastInput.routeConductorAdmissibilityEvent === true;
    const northAccepted = Boolean(lanes.north.admissible || state.northC2WestAuditAligned || routeConductorInput);
    const southAccepted = Boolean(lanes.south.admissible || state.cycleTwoSouthOutputAdmissible || routeConductorInput);
    const routeAccepted = Boolean(lanes.routeConductor.admissible || routeConductorInput);
    const canvasSurfaceObserved = Boolean(lanes.canvas.observed || state.canvasObserved);

    const strict = Boolean(
      northAccepted &&
      southAccepted &&
      routeAccepted &&
      lanes.canvas.admissible &&
      lanes.pointerSurface.admissible &&
      hardBlocks.length === 0
    );

    const admissible = Boolean(
      hardBlocks.length === 0 &&
      northAccepted &&
      southAccepted &&
      routeAccepted &&
      canvasSurfaceObserved
    );

    const degraded = Boolean(admissible && !strict);

    let status = BISHOP_CHORD_STATUS.HELD_CHORD;
    let gap = "WAITING_BISHOP_CHORD";

    if (hardBlocks.length) {
      status = BISHOP_CHORD_STATUS.BLOCKED_CHORD;
      gap = `BISHOP_CHORD_HARD_BLOCK_${hardBlocks.map((lane) => lane.lane.toUpperCase()).join("_")}`;
    } else if (strict) {
      status = BISHOP_CHORD_STATUS.STRICT_CHORD;
      gap = "NONE_STRICT_BISHOP_CHORD";
    } else if (admissible) {
      status = BISHOP_CHORD_STATUS.DEGRADED_CHORD;
      gap = "NONE_DEGRADED_BISHOP_CHORD_CANVAS_RELEASE_ALLOWED";
    } else if (!northAccepted) {
      gap = "WAITING_NORTH_BISHOP_OR_ROUTE_CONDUCTOR_NORTH_ALIGNMENT";
    } else if (!southAccepted) {
      gap = "WAITING_SOUTH_OUTPUT_OR_ROUTE_CONDUCTOR_CYCLE_TWO_PACKET";
    } else if (!routeAccepted) {
      gap = "WAITING_ROUTE_CONDUCTOR_DOWNSTREAM_BISHOP";
    } else if (!canvasSurfaceObserved) {
      gap = "WAITING_CANVAS_DOWNSTREAM_BISHOP";
    }

    state.bishopLanes = clonePlain(lanes);
    state.bishopChordObservedCount = observedCount;
    state.bishopChordReadyCount = readyCount;
    state.bishopChordStrict = strict;
    state.bishopChordAdmissible = admissible;
    state.bishopChordDegraded = degraded;
    state.bishopChordHardBlock = Boolean(hardBlocks.length);
    state.bishopChordStatus = status;
    state.bishopChordGap = gap;
    state.bishopChordSourceMethod = allValues.map((lane) => `${lane.lane}:${lane.sourceMethod}`).join(" | ");
    state.bishopChordReleaseMode = strict
      ? "STRICT_ROUTE_CANVAS_POINTER_SURFACE_CHORD"
      : admissible
        ? "DEGRADED_ROUTE_CANVAS_CHORD_POINTER_SURFACE_TRACKED"
        : "NONE";

    const chord = {
      bishopChordBridgeActive: true,
      westGateLanguageActive: true,
      cardinalBishopTermOwnedByHierarchyMap: true,
      upstreamCardinalSelfNamingRequired: false,
      westKnowsBishopsNotChildren: true,
      bishopSubjectFileDelegationActive: true,
      bishopChordStatus: status,
      bishopChordStrict: strict,
      bishopChordAdmissible: admissible,
      bishopChordDegraded: degraded,
      bishopChordHardBlock: Boolean(hardBlocks.length),
      bishopChordReadyCount: readyCount,
      bishopChordObservedCount: observedCount,
      bishopChordRequiredCount: 4,
      bishopChordGap: gap,
      bishopChordSourceMethod: state.bishopChordSourceMethod,
      bishopChordReleaseMode: state.bishopChordReleaseMode,
      pointerSurfaceObserved: state.pointerSurfaceObserved,
      pointerSurfaceAccepted: state.pointerSurfaceAccepted,
      pointerSurfaceContract: state.pointerSurfaceContract,
      lanes: clonePlain(lanes)
    };

    state.lastBishopChord = clonePlain(chord);
    return chord;
  }

  function readDatasetCanvasProof() {
    const ds = dataset();

    const contract = firstNonEmpty(
      ds.hearthCanvasContract,
      ds.hearthCanvasLocalStationContract,
      ds.hearthCanvasCurrentCanvasStationContract,
      ds.hearthCanvasCurrentCanvasParentContract,
      ds.currentCanvasParentContract,
      ds.canvasLocalStationContract,
      ds.currentCanvasStationContract,
      ds.hearthSouthCurrentCanvasParentContract,
      ds.hearthWestCurrentCanvasParentContract
    );

    if (!contract && !ds.hearthSouthVisiblePlanetProofReady && !ds.hearthCanvasVisiblePlanetProofReady) return null;

    return {
      contract,
      currentCanvasParentContract: contract,
      canvasLocalStationContract: contract,
      currentCanvasParentReceipt: ds.hearthCanvasReceipt || ds.hearthSouthCurrentCanvasParentReceipt || "",
      canvasLocalStationSummaryObserved: ds.hearthCanvasLocalStationSummaryObserved || ds.canvasLocalStationSummaryObserved || ds.hearthSouthCurrentCanvasParentObserved,
      canvasLocalStationApiReady: ds.hearthCanvasLocalStationApiReady || ds.canvasLocalStationApiReady || ds.hearthSouthCanvasHubGateReady || ds.hearthSouthCanvasReceiverBishopGateReady,
      canvasLocalStationReceiveSurfaceReady: ds.hearthCanvasLocalStationReceiveSurfaceReady || ds.canvasLocalStationReceiveSurfaceReady || ds.hearthSouthCanvasReleaseAuthorized,
      visiblePlanetProofReady: ds.hearthCanvasVisiblePlanetProofReady || ds.hearthSouthVisiblePlanetProofReady,
      canvasMounted: ds.hearthCanvasMounted || ds.hearthSouthCanvasMounted,
      canvasDrawComplete: ds.hearthCanvasDrawComplete || ds.hearthSouthCanvasDrawComplete,
      structuralCarrierReady: ds.hearthCanvasStructuralCarrierReady || ds.structuralCarrierReady,
      structuralCarrierSafe: ds.hearthCanvasStructuralCarrierSafe || ds.structuralCarrierSafe,
      canvasParentCarrierSafe: ds.hearthCanvasParentCarrierSafe || ds.canvasParentCarrierSafe,
      structuralCarrierSafeForCanvasRelease: ds.hearthCanvasStructuralCarrierSafeForCanvasRelease || ds.structuralCarrierSafeForCanvasRelease,
      canvasPreReleaseCarrierSafeForWest: ds.hearthCanvasPreReleaseCarrierSafeForWest || ds.canvasPreReleaseCarrierSafeForWest,
      currentParentIdentityMismatch: ds.currentParentIdentityMismatch,
      canvasParentIdentityMismatch: ds.canvasParentIdentityMismatch,
      currentParentStaleDetected: ds.currentParentStaleDetected,
      canvasParentStaleDetected: ds.canvasParentStaleDetected,
      staleParentDetected: ds.staleParentDetected,
      canvasCarrierHandoffError: ds.canvasCarrierHandoffError,
      carrierHandoffError: ds.carrierHandoffError
    };
  }

  function normalizeCanvasProof(name, api, proof, method) {
    const p = isObject(proof) ? proof : {};
    const contract = contractFromProof(p);
    const receipt = receiptFromProof(p);
    const currentAccepted = CURRENT_CANVAS_CONTRACTS.includes(contract);
    const baselineHold = CANVAS_BASELINE_HOLD_CONTRACTS.includes(contract);
    const unsafeFields = unsafeFieldsFromProof(p);

    const unrecognizedContract = Boolean(contract && !currentAccepted && !baselineHold);
    if (unrecognizedContract && !unsafeFields.includes("unrecognizedCurrentCanvasContract")) {
      unsafeFields.push("unrecognizedCurrentCanvasContract");
    }

    const visibleProofReady = readBool(p, [
      "visiblePlanetProofReady",
      "visibleGlobeProofReady",
      "currentVisibleProofValid",
      "baseGlobeVisibleCarrierReady",
      "domVisiblePlanetProofReady"
    ]);

    const canvasMounted = readBool(p, [
      "canvasMounted",
      "baseGlobeMounted",
      "hearthCanvasMounted"
    ]);

    const canvasDrawComplete = readBool(p, [
      "canvasDrawComplete",
      "drawComplete",
      "imageRendered",
      "baseGlobeDrawComplete",
      "holdingFieldDrawComplete"
    ]);

    const summaryObserved = Boolean(
      method === "getCanvasStationSummary" ||
      method === "getCanvasStationReceiptLight" ||
      method === "getCanvasStationReceipt" ||
      method === "getExpressionHubSummary" ||
      method === "getExpressionHubReceipt" ||
      readBool(p, ["canvasLocalStationSummaryObserved", "summaryObserved", "canvasStationSummaryObserved"]) ||
      p.packetType === "CANVAS_LOCAL_STATION_SUMMARY" ||
      p.packetType === "CANVAS_LOCAL_STATION_RECEIPT"
    );

    const receiveReady = Boolean(hasReceiveSurface(api) || readBool(p, [
      "canvasLocalStationReceiveSurfaceReady",
      "receiveSurfaceReady",
      "canvasReleasePacketReady",
      "canvasParentBootMethodAvailable"
    ]));

    const apiReady = Boolean(
      readBool(p, ["canvasLocalStationApiReady", "apiReady", "canvasHubGateReady", "canvasReceiverBishopGateReady"]) ||
      receiveReady ||
      currentAccepted ||
      (api && isObject(api))
    );

    const shapeAccepted = Boolean(
      readBool(p, ["expressionHubActive", "canvasExpressionHubActive", "fingerManagerActive", "canvasFingerManagerActive"]) ||
      visibleProofReady ||
      canvasMounted ||
      canvasDrawComplete
    );

    const contractAccepted = Boolean(currentAccepted || (!contract && shapeAccepted));
    const hardBlock = Boolean(unsafeFields.length);

    const carrierSafeMarkerObserved = Boolean(
      readBool(p, ["structuralCarrierReady", "hearthCanvasStructuralCarrierReady"]) ||
      readBool(p, ["structuralCarrierSafe", "hearthCanvasStructuralCarrierSafe"]) ||
      readBool(p, ["canvasParentCarrierSafe", "hearthCanvasParentCarrierSafe"]) ||
      readBool(p, ["structuralCarrierSafeForCanvasRelease", "hearthCanvasStructuralCarrierSafeForCanvasRelease"]) ||
      readBool(p, ["canvasPreReleaseCarrierSafeForWest", "hearthCanvasPreReleaseCarrierSafeForWest"]) ||
      visibleProofReady ||
      canvasMounted ||
      canvasDrawComplete ||
      (currentAccepted && apiReady)
    );

    let rank = 99;
    if (hardBlock) rank = 7;
    else if (currentAccepted && visibleProofReady && apiReady && receiveReady) rank = 1;
    else if (currentAccepted && apiReady && receiveReady) rank = 2;
    else if (currentAccepted && apiReady) rank = 3;
    else if (currentAccepted) rank = 4;
    else if (shapeAccepted && apiReady) rank = 5;
    else if (baselineHold) rank = 6;

    return {
      name,
      method,
      proof: clonePlain(p),
      contract,
      receipt,
      currentCanvasParentObserved: Boolean(api || contract || shapeAccepted),
      currentCanvasParentContractObserved: Boolean(contract),
      currentCanvasParentIsCurrentCanvas: contractAccepted,
      canvasContractAccepted: contractAccepted,
      canvasV123Recognized: contract === "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3",
      canvasV122Recognized: contract === "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
      canvasV121Recognized: contract === "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
      canvasV12LineageAccepted: contract === "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
      canvasV11LineageAccepted: Boolean(contract && contract.includes("TNT_v11")),
      canvasBaselineV10_3Recognized: baselineHold,
      v10_3BaselineRecognizedOnly: baselineHold,
      canvasReceiverApiReady: apiReady && contractAccepted,
      canvasReceiveSurfaceReady: receiveReady || (currentAccepted && apiReady),
      canvasSummaryObserved: summaryObserved,
      canvasVisibleProofReady: visibleProofReady,
      canvasMounted,
      canvasDrawComplete,
      carrierSafeMarkerObserved,
      explicitUnsafeFields: unsafeFields,
      carrierHardBlock: hardBlock,
      rank
    };
  }

  function selectCanvasReceiverProof() {
    const candidates = [];

    CANVAS_ALIASES.forEach((name) => {
      const api = readPath(name);
      if (!api || !isObject(api)) return;

      const read = readAuthorityReceipt(api);
      candidates.push(normalizeCanvasProof(name, api, read.receipt || api, read.method));
    });

    const datasetProof = readDatasetCanvasProof();
    if (datasetProof) {
      candidates.push(normalizeCanvasProof("DOCUMENT_DATASET_CANVAS_PROOF", null, datasetProof, "dataset"));
    }

    candidates.sort((a, b) => {
      const aUnsafe = Boolean(a.carrierHardBlock || (Array.isArray(a.explicitUnsafeFields) && a.explicitUnsafeFields.length));
      const bUnsafe = Boolean(b.carrierHardBlock || (Array.isArray(b.explicitUnsafeFields) && b.explicitUnsafeFields.length));

      if (aUnsafe !== bUnsafe) return aUnsafe ? 1 : -1;
      if (a.rank !== b.rank) return a.rank - b.rank;

      const aCurrent = a.canvasContractAccepted ? 0 : 1;
      const bCurrent = b.canvasContractAccepted ? 0 : 1;
      if (aCurrent !== bCurrent) return aCurrent - bCurrent;

      return 0;
    });

    const selected = candidates[0] || normalizeCanvasProof("NONE", null, {}, "NONE");

    state.lastCanvasCandidates = clonePlain(candidates);
    state.lastCanvasProof = clonePlain(selected);

    state.currentCanvasParentObserved = selected.currentCanvasParentObserved;
    state.currentCanvasParentContractObserved = selected.currentCanvasParentContractObserved;
    state.currentCanvasParentContract = selected.contract;
    state.currentCanvasParentReceipt = selected.receipt;
    state.currentCanvasParentIsCurrentCanvas = selected.currentCanvasParentIsCurrentCanvas;
    state.canvasContractAccepted = selected.canvasContractAccepted;
    state.canvasV123Recognized = selected.canvasV123Recognized;
    state.canvasV122Recognized = selected.canvasV122Recognized;
    state.canvasV121Recognized = selected.canvasV121Recognized;
    state.canvasV12LineageAccepted = selected.canvasV12LineageAccepted;
    state.canvasV11LineageAccepted = selected.canvasV11LineageAccepted;
    state.canvasBaselineV10_3Recognized = selected.canvasBaselineV10_3Recognized;
    state.v10_3BaselineRecognizedOnly = selected.v10_3BaselineRecognizedOnly;
    state.canvasReceiverApiReady = selected.canvasReceiverApiReady;
    state.canvasReceiveSurfaceReady = selected.canvasReceiveSurfaceReady;
    state.canvasSummaryObserved = selected.canvasSummaryObserved;
    state.canvasVisibleProofReady = selected.canvasVisibleProofReady;
    state.canvasMounted = selected.canvasMounted;
    state.canvasDrawComplete = selected.canvasDrawComplete;
    state.canvasSourceMethod = `${selected.name}:${selected.method}`;
    state.selectedCanvasProofRank = selected.rank;
    state.selectedCanvasProofUnsafe = Boolean(selected.carrierHardBlock);

    state.explicitUnsafeFields = selected.explicitUnsafeFields.slice();
    state.carrierHardBlock = selected.carrierHardBlock;
    state.carrierSafeMarkerObserved = selected.carrierSafeMarkerObserved;

    state.carrierIdentitySafe = Boolean(
      selected.currentCanvasParentObserved &&
      selected.canvasContractAccepted &&
      !selected.carrierHardBlock
    );

    state.preReleaseCarrierAdmissible = Boolean(
      state.carrierIdentitySafe &&
      state.canvasReceiverApiReady &&
      state.canvasReceiveSurfaceReady &&
      state.carrierSafeMarkerObserved &&
      !state.carrierHardBlock
    );

    if (state.preReleaseCarrierAdmissible) {
      state.carrierHeld = false;
      state.carrierHoldReason = "NONE_PRE_RELEASE_CARRIER_ADMISSIBLE";
    } else if (selected.canvasBaselineV10_3Recognized) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_V12_3_OR_COMPATIBLE_CURRENT_CANVAS_CONTRACT";
    } else if (!selected.currentCanvasParentObserved) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_RECEIVER_PROOF";
    } else if (!selected.canvasContractAccepted && !selected.carrierHardBlock) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_V12_3_OR_COMPATIBLE_CURRENT_CANVAS_CONTRACT";
    } else if (!state.canvasReceiverApiReady || !state.canvasReceiveSurfaceReady) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_RECEIVER_API";
    } else if (!state.carrierSafeMarkerObserved) {
      state.carrierHeld = true;
      state.carrierHoldReason = "WAITING_CURRENT_CANVAS_CARRIER_SAFE_MARKER";
    } else {
      state.carrierHeld = Boolean(state.carrierHardBlock);
      state.carrierHoldReason = state.carrierHardBlock ? "STRUCTURAL_CARRIER_UNSAFE_FOR_CANVAS" : "NONE";
    }

    return selected;
  }

  function clearCanvasReleasePacket() {
    const w = rootRef();
    const hearth = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    hearth.canvasReleasePacket = null;
    hearth.routeConductorReleasePacket = null;
    hearth.westCanvasReleasePacket = null;
    hearth.bishopChordCanvasReleasePacket = null;
    hearth.westGateHierarchyReleasePacket = null;

    lab.hearthWestCanvasReleasePacket = null;
    lab.hearthRuntimeTableWestReleasePacket = null;
    lab.hearthWestBishopChordCanvasReleasePacket = null;
    lab.hearthWestGateHierarchyReleasePacket = null;

    w.HEARTH_CANVAS_RELEASE_PACKET = null;
    w.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = null;
    w.HEARTH_WEST_CANVAS_RELEASE_PACKET = null;
    w.LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET = null;
    w.HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_PACKET = null;
    w.LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_PACKET = null;
    w.HEARTH_WEST_GATE_HIERARCHY_RELEASE_PACKET = null;

    state.releasePacket = null;
    return true;
  }

  function blockFinalClaims() {
    Object.assign(state, NO_CLAIMS);
  }

  function applyHold(reason, nextFile, gapClass) {
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = state.northC2WestAuditAligned;
    state.westAuditAccepted = false;
    state.westAuditPassed = false;
    state.westDecision = WEST_DECISION.HOLD;
    state.westGapClass = gapClass || WEST_GAP_CLASS.CARRIER_HOLD;
    state.westHardBlock = false;
    state.westForwardAllowed = false;
    state.westCanvasReleaseApproved = false;

    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseApprovedByWest = false;
    state.releaseToCanvas = false;
    state.canvasReleaseHeldReason = reason;
    state.firstFailedCoordinate = reason;
    state.recommendedNextFile = nextFile;
    state.recommendedNextRenewalTarget = nextFile;
    state.postgameStatus = `WEST_HOLD_${reason}`;

    blockFinalClaims();
    clearCanvasReleasePacket();

    return state.westDecision;
  }

  function applyHardBlock(reason, nextFile) {
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = state.northC2WestAuditAligned;
    state.westAuditAccepted = false;
    state.westAuditPassed = false;
    state.westDecision = WEST_DECISION.HARD_BLOCK;
    state.westGapClass = WEST_GAP_CLASS.STRUCTURAL_BLOCK;
    state.westHardBlock = true;
    state.westForwardAllowed = false;
    state.westCanvasReleaseApproved = false;

    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseApprovedByWest = false;
    state.releaseToCanvas = false;
    state.canvasReleaseHeldReason = reason;
    state.firstFailedCoordinate = reason;
    state.recommendedNextFile = nextFile;
    state.recommendedNextRenewalTarget = nextFile;
    state.postgameStatus = `WEST_HARD_BLOCK_${reason}`;

    blockFinalClaims();
    clearCanvasReleasePacket();

    return state.westDecision;
  }

  function composeBishopLaneHandoffPackets() {
    const lanes = state.bishopLanes || {};

    return Object.keys(lanes).map((lane) => ({
      lane,
      packetType: "WEST_GATE_TO_BISHOP_TO_CANVAS_HANDOFF_PACKET",
      sourceFile: FILE,
      bishopFile: lanes[lane] ? lanes[lane].file : "UNKNOWN",
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      hierarchyRegistryContract: HIERARCHY_REGISTRY_CONTRACT,
      hierarchyRegistryReceipt: HIERARCHY_REGISTRY_RECEIPT,
      activeStageId: ACTIVE_STAGE_ID,
      activeGear: ACTIVE_GEAR,
      activeCycleNumber: ACTIVE_CYCLE_NUMBER,
      activeCycleRoute: ACTIVE_CYCLE_ROUTE,
      activeCardinal: ACTIVE_CARDINAL,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeNewsGate: ACTIVE_NEWS_GATE,
      bishopLaneObserved: lanes[lane] ? lanes[lane].observed === true : false,
      bishopLaneAdmissible: lanes[lane] ? lanes[lane].admissible === true : false,
      bishopLaneSource: lanes[lane] ? lanes[lane].sourceName : "NONE",
      bishopLaneContract: lanes[lane] ? lanes[lane].contract : "",
      upstreamSelfNamingRequired: false,
      westInspectsSubjectFiles: false,
      bishopOwnsSubjectFiles: true,
      handoffTo: "CANVAS",
      ...NO_CLAIMS
    }));
  }

  function composeCanvasReleasePacket() {
    const bishopChord = state.lastBishopChord || readBishopChord();
    const hierarchyRegistry = state.lastHierarchyRegistry || composeHierarchyRegistry();
    const hierarchySurface = state.lastHierarchySurface || readHierarchySurface();

    return {
      timestamp: nowIso(),
      event: "WEST_GATE_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_TO_CANVAS",
      checkpointEvent: "F13W_WEST_GATE_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_APPROVED",
      primaryCardinal: "WEST",
      activeStageId: ACTIVE_STAGE_ID,
      activeGear: ACTIVE_GEAR,
      activeFileGate: FILE,
      fileGate: FILE,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeNewsGate: ACTIVE_NEWS_GATE,

      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV47Contract: LINEAGE_V4_7_CONTRACT,
      lineageV47Receipt: LINEAGE_V4_7_RECEIPT,
      baselineContract: BASELINE_CONTRACT,

      sourceFile: FILE,
      westSourceFile: FILE,
      route: ROUTE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,

      hierarchyRegistryContract: HIERARCHY_REGISTRY_CONTRACT,
      hierarchyRegistryReceipt: HIERARCHY_REGISTRY_RECEIPT,
      hierarchyRegistry,
      hierarchySurface,

      westGateLanguageActive: true,
      westGateOwnsUpstreamTruth: false,
      upstreamCardinalSelfNamingRequired: false,
      cardinalBishopTermOwnedByHierarchyMap: true,
      downstreamBishopTermActive: true,
      queenFile: QUEEN_FILE,
      queenExcludedFromCardinalFunctionality: true,
      priestFile: PRIEST_FILE,
      priestNotBishop: true,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerSurfaceObserved: state.pointerSurfaceObserved,
      pointerSurfaceAccepted: state.pointerSurfaceAccepted,
      pointerSurfaceContract: state.pointerSurfaceContract,

      cycleNumber: ACTIVE_CYCLE_NUMBER,
      activeCycleNumber: ACTIVE_CYCLE_NUMBER,
      cycleRoute: ACTIVE_CYCLE_ROUTE,
      activeCycleRoute: ACTIVE_CYCLE_ROUTE,
      receivedFrom: "WEST",
      handoffTo: "CANVAS",
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,

      bishopChordBridgeActive: true,
      bishopSubjectFileDelegationActive: true,
      westKnowsBishopsNotChildren: true,
      westInspectsSubjectFiles: false,
      westInspectsFingerInternals: false,
      bishopsOwnSubjectFiles: true,

      bishopChordStatus: state.bishopChordStatus,
      bishopChordStrict: state.bishopChordStrict,
      bishopChordAdmissible: state.bishopChordAdmissible,
      bishopChordDegraded: state.bishopChordDegraded,
      bishopChordReadyCount: state.bishopChordReadyCount,
      bishopChordObservedCount: state.bishopChordObservedCount,
      bishopChordReleaseMode: state.bishopChordReleaseMode,
      bishopChord,
      bishopLaneHandoffPackets: composeBishopLaneHandoffPackets(),

      westAuditObserved: true,
      westAuditIntakeAccepted: true,
      westAuditAccepted: true,
      westAuditPassed: true,
      westDecision: WEST_DECISION.RELEASE_TO_CANVAS,
      westGapClass: WEST_GAP_CLASS.NONE,
      westHardBlock: false,
      westForwardAllowed: true,
      westCanvasReleaseApproved: true,
      canvasReleaseApprovedByWest: true,

      canvasReleaseAuthorized: true,
      canvasReleasePacketReady: true,
      releaseToCanvas: true,

      northTimetableObserved: state.northTimetableObserved,
      northC2WestAuditAligned: state.northC2WestAuditAligned,
      cycleTwoSouthOutputObserved: state.cycleTwoSouthOutputObserved,
      cycleTwoSouthOutputAdmissible: state.cycleTwoSouthOutputAdmissible,

      currentCanvasParentObserved: state.currentCanvasParentObserved,
      currentCanvasParentContract: state.currentCanvasParentContract,
      currentCanvasParentReceipt: state.currentCanvasParentReceipt,
      canvasContractAccepted: state.canvasContractAccepted,
      canvasV123Recognized: state.canvasV123Recognized,
      canvasV122Recognized: state.canvasV122Recognized,
      canvasV121Recognized: state.canvasV121Recognized,
      canvasV12LineageAccepted: state.canvasV12LineageAccepted,
      canvasV11LineageAccepted: state.canvasV11LineageAccepted,
      canvasReceiverApiReady: state.canvasReceiverApiReady,
      canvasReceiveSurfaceReady: state.canvasReceiveSurfaceReady,
      carrierSafeMarkerObserved: state.carrierSafeMarkerObserved,
      preReleaseCarrierAdmissible: state.preReleaseCarrierAdmissible,

      firstFailedCoordinate: "NONE_CYCLE_TWO_WEST_GATE_CANVAS_RELEASE_AUTHORIZED",
      recommendedNextFile: CANVAS_FILE,
      recommendedNextRenewalTarget: CANVAS_FILE,

      ...NO_CLAIMS
    };
  }

  function publishCanvasReleasePacket(packet) {
    if (!isObject(packet)) return false;

    const w = rootRef();
    const hearth = ensureObject(w, "HEARTH");
    const lab = ensureObject(w, "DEXTER_LAB");

    hearth.canvasReleasePacket = clonePlain(packet);
    hearth.routeConductorReleasePacket = clonePlain(packet);
    hearth.westCanvasReleasePacket = clonePlain(packet);
    hearth.bishopChordCanvasReleasePacket = clonePlain(packet);
    hearth.westGateHierarchyReleasePacket = clonePlain(packet);

    lab.hearthWestCanvasReleasePacket = clonePlain(packet);
    lab.hearthRuntimeTableWestReleasePacket = clonePlain(packet);
    lab.hearthWestBishopChordCanvasReleasePacket = clonePlain(packet);
    lab.hearthWestGateHierarchyReleasePacket = clonePlain(packet);

    w.HEARTH_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.HEARTH_ROUTE_CONDUCTOR_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.HEARTH_WEST_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_PACKET = clonePlain(packet);
    w.HEARTH_WEST_GATE_HIERARCHY_RELEASE_PACKET = clonePlain(packet);

    return true;
  }

  function applyRelease() {
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = true;
    state.westAuditAccepted = true;
    state.westAuditPassed = true;
    state.westDecision = WEST_DECISION.RELEASE_TO_CANVAS;
    state.westGapClass = WEST_GAP_CLASS.NONE;
    state.westHardBlock = false;
    state.westForwardAllowed = true;
    state.westCanvasReleaseApproved = true;

    state.canvasReleaseAuthorized = true;
    state.canvasReleasePacketReady = true;
    state.canvasReleaseApprovedByWest = true;
    state.releaseToCanvas = true;
    state.canvasReleaseHeldReason = "NONE_CYCLE_TWO_WEST_GATE_CANVAS_RELEASE_AUTHORIZED";
    state.firstFailedCoordinate = "NONE_CYCLE_TWO_WEST_GATE_CANVAS_RELEASE_AUTHORIZED";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextRenewalTarget = CANVAS_FILE;
    state.postgameStatus = "CYCLE_TWO_WEST_GATE_CANVAS_V12_3_POINTER_SURFACE_RELEASE_AUTHORIZED";

    blockFinalClaims();

    const packet = composeCanvasReleasePacket();
    state.releasePacket = clonePlain(packet);
    publishCanvasReleasePacket(packet);

    return state.westDecision;
  }

  function decideWest(input = {}) {
    state.timestamp = nowIso();
    state.westAuditObserved = true;

    publishHierarchyRegistry();
    readHierarchySurface();
    isNorthCallingWestForCycleTwoCanvasAudit(input);
    normalizeCycleInput(input);
    const bishopChord = readBishopChord();
    selectCanvasReceiverProof();

    if (!state.northC2WestAuditAligned) {
      return applyHold(
        "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT",
        NORTH_FILE,
        WEST_GAP_CLASS.NORTH_TIMETABLE_HOLD
      );
    }

    state.westAuditIntakeAccepted = true;

    if (!state.cycleTwoSouthOutputAdmissible) {
      return applyHold(
        "WAITING_CYCLE_TWO_SOUTH_OUTPUT_ADMISSIBILITY",
        ROUTE_CONDUCTOR_FILE,
        WEST_GAP_CLASS.SOUTH_OUTPUT_HOLD
      );
    }

    if (state.pointerSurfaceHardBlock) {
      return applyHardBlock(
        "POINTER_SURFACE_BISHOP_HARD_BLOCK",
        POINTER_SURFACE_FILE
      );
    }

    if (state.bishopChordHardBlock) {
      return applyHardBlock(
        bishopChord.bishopChordGap || "BISHOP_CHORD_HARD_BLOCK",
        FILE
      );
    }

    if (!state.bishopChordAdmissible) {
      return applyHold(
        state.bishopChordGap || "WAITING_BISHOP_CHORD",
        FILE,
        WEST_GAP_CLASS.HIERARCHY_HOLD
      );
    }

    if (state.carrierHardBlock || state.explicitUnsafeFields.length) {
      return applyHardBlock(
        "STRUCTURAL_CARRIER_UNSAFE_FOR_CANVAS",
        CANVAS_FILE
      );
    }

    if (state.canvasBaselineV10_3Recognized && !state.canvasContractAccepted) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_V12_3_OR_COMPATIBLE_CURRENT_CANVAS_CONTRACT",
        CANVAS_FILE,
        WEST_GAP_CLASS.CANVAS_RECEIVER_HOLD
      );
    }

    if (!state.currentCanvasParentObserved || !state.canvasContractAccepted) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_V12_3_OR_COMPATIBLE_CURRENT_CANVAS_CONTRACT",
        CANVAS_FILE,
        WEST_GAP_CLASS.CANVAS_RECEIVER_HOLD
      );
    }

    if (!state.canvasReceiverApiReady || !state.canvasReceiveSurfaceReady) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_RECEIVER_API",
        CANVAS_FILE,
        WEST_GAP_CLASS.CANVAS_RECEIVER_HOLD
      );
    }

    if (!state.preReleaseCarrierAdmissible || !state.carrierSafeMarkerObserved) {
      return applyHold(
        "WAITING_CURRENT_CANVAS_CARRIER_SAFE_MARKER",
        CANVAS_FILE,
        WEST_GAP_CLASS.CARRIER_HOLD
      );
    }

    return applyRelease();
  }

  function classifyWestAdmissibility(input = {}) {
    decideWest(input || {});
    updateDataset();
    publishGlobals();
    state.lastReceipt = clonePlain(getReceiptLight());
    return getReceipt();
  }

  function classifyCyclePacket(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function createWestCycleReceipt(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function createGapReceipt(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function classifyGap(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function classifyTransmissionGap(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function assess(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function inspect(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function run(input = {}) {
    return classifyWestAdmissibility(input);
  }

  function boot(input = {}) {
    return classifyWestAdmissibility(input || {});
  }

  function init(input = {}) {
    return classifyWestAdmissibility(input || {});
  }

  function start(input = {}) {
    return classifyWestAdmissibility(input || {});
  }

  function mount(input = {}) {
    return classifyWestAdmissibility(input || {});
  }

  function getCanvasReleasePacket() {
    return isObject(state.releasePacket) ? clonePlain(state.releasePacket) : null;
  }

  function getReleasePacket() {
    return getCanvasReleasePacket();
  }

  function getCanvasHandoffPacket() {
    return getCanvasReleasePacket();
  }

  function getHandoffPacket() {
    return getCanvasReleasePacket();
  }

  function getBishopChord() {
    return clonePlain(state.lastBishopChord || readBishopChord());
  }

  function getBishopLanes() {
    return clonePlain(state.bishopLanes || {});
  }

  function getHierarchyRegistry() {
    return clonePlain(state.lastHierarchyRegistry || composeHierarchyRegistry());
  }

  function getHierarchySurface() {
    return clonePlain(state.lastHierarchySurface || readHierarchySurface());
  }

  function getReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV47Contract: LINEAGE_V4_7_CONTRACT,
      lineageV47Receipt: LINEAGE_V4_7_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      role: state.role,

      westV4_9Active: true,
      westV4_8Superseded: true,
      westV4_7Superseded: true,

      westGateLanguageActive: true,
      westGateOwnsUpstreamTruth: false,
      upstreamCardinalSelfNamingRequired: false,
      hierarchyRegistryActive: true,
      hierarchyRegistryContract: HIERARCHY_REGISTRY_CONTRACT,
      hierarchyRegistryReceipt: HIERARCHY_REGISTRY_RECEIPT,
      hierarchyRegistryPublished: state.hierarchyRegistryPublished,
      cardinalBishopTermOwnedByHierarchyMap: true,
      downstreamBishopTermActive: true,
      queenExcludedFromCardinalFunctionality: true,
      priestNotBishop: true,

      cardinalBishopFiles: clonePlain(CARDINAL_BISHOP_FILES),
      downstreamBishopFiles: clonePlain(DOWNSTREAM_BISHOP_FILES),
      priestFiles: clonePlain(PRIEST_FILES),
      queenFiles: clonePlain(QUEEN_FILES),

      routeConductorObserved: state.routeConductorObserved,
      eastPriestObserved: state.priestObserved,
      queenObserved: state.queenObserved,
      canvasReceiverObserved: state.canvasObserved,
      pointerSurfaceObserved: state.pointerSurfaceObserved,
      pointerSurfaceAccepted: state.pointerSurfaceAccepted,
      pointerSurfaceContract: state.pointerSurfaceContract,
      hierarchySurfaceObservedCount: state.hierarchySurfaceObservedCount,
      hierarchySurfaceStatus: state.hierarchySurfaceStatus,

      northTimetableAlignmentActive: true,
      northTimetableObserved: state.northTimetableObserved,
      northSourceMethod: state.northSourceMethod,
      northActiveStageId: state.northActiveStageId,
      northActiveGearId: state.northActiveGearId,
      northActiveCycleNumber: state.northActiveCycleNumber,
      northActiveCycleRoute: state.northActiveCycleRoute,
      northActiveCardinal: state.northActiveCardinal,
      northActiveFileGate: state.northActiveFileGate,
      northActiveFibonacci: state.northActiveFibonacci,
      northActiveNewsGate: state.northActiveNewsGate,
      northC2WestAuditAligned: state.northC2WestAuditAligned,

      cycleNumber: state.cycleNumber,
      cycleRoute: state.cycleRoute,
      receivedFrom: state.receivedFrom,
      handoffTo: state.handoffTo,
      sourceCardinal: state.sourceCardinal,
      targetCardinal: state.targetCardinal,
      activeCycleInputCardinal: state.activeCycleInputCardinal,
      activeCycleHandoffTarget: state.activeCycleHandoffTarget,
      indexPairReady: state.indexPairReady,
      carrierHostAdmissibilityReady: state.carrierHostAdmissibilityReady,
      f8SelfDutySatisfied: state.f8SelfDutySatisfied,

      southOutputReady: state.southOutputReady,
      explicitSouthOutputMarkerObserved: state.explicitSouthOutputMarkerObserved,
      explicitSouthOutputMarkers: state.explicitSouthOutputMarkers.slice(),
      cycleTwoSouthOutputObserved: state.cycleTwoSouthOutputObserved,
      cycleTwoSouthOutputAdmissible: state.cycleTwoSouthOutputAdmissible,
      southOutputIntakeMethod: state.southOutputIntakeMethod,

      bishopChordBridgeActive: true,
      bishopSubjectFileDelegationActive: true,
      westKnowsBishopsNotChildren: true,
      bishopChordStatus: state.bishopChordStatus,
      bishopChordStrict: state.bishopChordStrict,
      bishopChordAdmissible: state.bishopChordAdmissible,
      bishopChordDegraded: state.bishopChordDegraded,
      bishopChordHardBlock: state.bishopChordHardBlock,
      bishopChordReadyCount: state.bishopChordReadyCount,
      bishopChordObservedCount: state.bishopChordObservedCount,
      bishopChordRequiredCount: state.bishopChordRequiredCount,
      bishopChordGap: state.bishopChordGap,
      bishopChordSourceMethod: state.bishopChordSourceMethod,
      bishopChordReleaseMode: state.bishopChordReleaseMode,

      currentCanvasParentObserved: state.currentCanvasParentObserved,
      currentCanvasParentContractObserved: state.currentCanvasParentContractObserved,
      currentCanvasParentContract: state.currentCanvasParentContract,
      currentCanvasParentReceipt: state.currentCanvasParentReceipt,
      currentCanvasParentIsCurrentCanvas: state.currentCanvasParentIsCurrentCanvas,
      canvasContractAccepted: state.canvasContractAccepted,
      canvasV123Recognized: state.canvasV123Recognized,
      canvasV122Recognized: state.canvasV122Recognized,
      canvasV121Recognized: state.canvasV121Recognized,
      canvasV12LineageAccepted: state.canvasV12LineageAccepted,
      canvasV11LineageAccepted: state.canvasV11LineageAccepted,
      canvasBaselineV10_3Recognized: state.canvasBaselineV10_3Recognized,
      v10_3BaselineRecognizedOnly: state.v10_3BaselineRecognizedOnly,
      canvasReceiverApiReady: state.canvasReceiverApiReady,
      canvasReceiveSurfaceReady: state.canvasReceiveSurfaceReady,
      canvasSummaryObserved: state.canvasSummaryObserved,
      canvasVisibleProofReady: state.canvasVisibleProofReady,
      canvasMounted: state.canvasMounted,
      canvasDrawComplete: state.canvasDrawComplete,
      canvasSourceMethod: state.canvasSourceMethod,
      selectedCanvasProofRank: state.selectedCanvasProofRank,
      selectedCanvasProofUnsafe: state.selectedCanvasProofUnsafe,

      carrierIdentitySafe: state.carrierIdentitySafe,
      carrierSafeMarkerObserved: state.carrierSafeMarkerObserved,
      preReleaseCarrierAdmissible: state.preReleaseCarrierAdmissible,
      carrierHardBlock: state.carrierHardBlock,
      carrierHeld: state.carrierHeld,
      carrierHoldReason: state.carrierHoldReason,
      explicitUnsafeFields: state.explicitUnsafeFields.slice(),

      westAuditObserved: state.westAuditObserved,
      westAuditIntakeAccepted: state.westAuditIntakeAccepted,
      westAuditAccepted: state.westAuditAccepted,
      westAuditPassed: state.westAuditPassed,
      westDecision: state.westDecision,
      westGapClass: state.westGapClass,
      westHardBlock: state.westHardBlock,
      westForwardAllowed: state.westForwardAllowed,
      westCanvasReleaseApproved: state.westCanvasReleaseApproved,

      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseApprovedByWest: state.canvasReleaseApprovedByWest,
      releaseToCanvas: state.releaseToCanvas,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,
      releasePacket: isObject(state.releasePacket) ? "present" : "null",
      canvasReleasePacket: isObject(state.releasePacket) ? "present" : "null",

      ...NO_CLAIMS,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      hierarchyRegistry: clonePlain(state.lastHierarchyRegistry),
      hierarchySurface: clonePlain(state.lastHierarchySurface),
      releasePacket: clonePlain(state.releasePacket),
      canvasReleasePacket: clonePlain(state.releasePacket),
      bishopChord: clonePlain(state.lastBishopChord),
      bishopLanes: clonePlain(state.bishopLanes),
      lastInput: clonePlain(state.lastInput),
      lastNorthEvidence: clonePlain(state.lastNorthEvidence),
      lastCanvasProof: clonePlain(state.lastCanvasProof),
      lastCanvasCandidates: clonePlain(state.lastCanvasCandidates),
      lastPointerSurfaceProof: clonePlain(state.lastPointerSurfaceProof)
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_RECEIPT",
      "",
      `timestamp=${r.timestamp}`,
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `lineageV47Contract=${r.lineageV47Contract}`,
      `lineageV47Receipt=${r.lineageV47Receipt}`,
      `baselineContract=${r.baselineContract}`,
      `version=${r.version}`,
      `file=${r.file}`,
      `route=${r.route}`,
      `role=${r.role}`,
      "",
      "HIERARCHY",
      `westGateLanguageActive=${r.westGateLanguageActive}`,
      `westGateOwnsUpstreamTruth=${r.westGateOwnsUpstreamTruth}`,
      `upstreamCardinalSelfNamingRequired=${r.upstreamCardinalSelfNamingRequired}`,
      `hierarchyRegistryActive=${r.hierarchyRegistryActive}`,
      `hierarchyRegistryContract=${r.hierarchyRegistryContract}`,
      `hierarchyRegistryReceipt=${r.hierarchyRegistryReceipt}`,
      `hierarchyRegistryPublished=${r.hierarchyRegistryPublished}`,
      `cardinalBishopTermOwnedByHierarchyMap=${r.cardinalBishopTermOwnedByHierarchyMap}`,
      `downstreamBishopTermActive=${r.downstreamBishopTermActive}`,
      `queenExcludedFromCardinalFunctionality=${r.queenExcludedFromCardinalFunctionality}`,
      `priestNotBishop=${r.priestNotBishop}`,
      `routeConductorObserved=${r.routeConductorObserved}`,
      `eastPriestObserved=${r.eastPriestObserved}`,
      `queenObserved=${r.queenObserved}`,
      `canvasReceiverObserved=${r.canvasReceiverObserved}`,
      `pointerSurfaceObserved=${r.pointerSurfaceObserved}`,
      `pointerSurfaceAccepted=${r.pointerSurfaceAccepted}`,
      `pointerSurfaceContract=${r.pointerSurfaceContract}`,
      `hierarchySurfaceObservedCount=${r.hierarchySurfaceObservedCount}`,
      `hierarchySurfaceStatus=${r.hierarchySurfaceStatus}`,
      "",
      "NORTH_TIMETABLE",
      `northTimetableObserved=${r.northTimetableObserved}`,
      `northSourceMethod=${r.northSourceMethod}`,
      `northActiveStageId=${r.northActiveStageId}`,
      `northActiveGearId=${r.northActiveGearId}`,
      `northActiveCycleNumber=${r.northActiveCycleNumber}`,
      `northActiveCycleRoute=${r.northActiveCycleRoute}`,
      `northActiveCardinal=${r.northActiveCardinal}`,
      `northActiveFileGate=${r.northActiveFileGate}`,
      `northActiveFibonacci=${r.northActiveFibonacci}`,
      `northActiveNewsGate=${r.northActiveNewsGate}`,
      `northC2WestAuditAligned=${r.northC2WestAuditAligned}`,
      "",
      "CYCLE_TWO",
      `cycleNumber=${r.cycleNumber}`,
      `cycleRoute=${r.cycleRoute}`,
      `receivedFrom=${r.receivedFrom}`,
      `handoffTo=${r.handoffTo}`,
      `indexPairReady=${r.indexPairReady}`,
      `carrierHostAdmissibilityReady=${r.carrierHostAdmissibilityReady}`,
      `f8SelfDutySatisfied=${r.f8SelfDutySatisfied}`,
      `southOutputReady=${r.southOutputReady}`,
      `cycleTwoSouthOutputObserved=${r.cycleTwoSouthOutputObserved}`,
      `cycleTwoSouthOutputAdmissible=${r.cycleTwoSouthOutputAdmissible}`,
      `southOutputIntakeMethod=${r.southOutputIntakeMethod}`,
      "",
      "BISHOP_CHORD",
      `bishopChordBridgeActive=${r.bishopChordBridgeActive}`,
      `bishopSubjectFileDelegationActive=${r.bishopSubjectFileDelegationActive}`,
      `westKnowsBishopsNotChildren=${r.westKnowsBishopsNotChildren}`,
      `bishopChordStatus=${r.bishopChordStatus}`,
      `bishopChordStrict=${r.bishopChordStrict}`,
      `bishopChordAdmissible=${r.bishopChordAdmissible}`,
      `bishopChordDegraded=${r.bishopChordDegraded}`,
      `bishopChordHardBlock=${r.bishopChordHardBlock}`,
      `bishopChordReadyCount=${r.bishopChordReadyCount}`,
      `bishopChordObservedCount=${r.bishopChordObservedCount}`,
      `bishopChordGap=${r.bishopChordGap}`,
      `bishopChordSourceMethod=${r.bishopChordSourceMethod}`,
      `bishopChordReleaseMode=${r.bishopChordReleaseMode}`,
      "",
      "CANVAS_RECEIVER",
      `currentCanvasParentObserved=${r.currentCanvasParentObserved}`,
      `currentCanvasParentContractObserved=${r.currentCanvasParentContractObserved}`,
      `currentCanvasParentContract=${r.currentCanvasParentContract}`,
      `currentCanvasParentReceipt=${r.currentCanvasParentReceipt}`,
      `currentCanvasParentIsCurrentCanvas=${r.currentCanvasParentIsCurrentCanvas}`,
      `canvasContractAccepted=${r.canvasContractAccepted}`,
      `canvasV123Recognized=${r.canvasV123Recognized}`,
      `canvasV122Recognized=${r.canvasV122Recognized}`,
      `canvasV121Recognized=${r.canvasV121Recognized}`,
      `canvasV12LineageAccepted=${r.canvasV12LineageAccepted}`,
      `canvasV11LineageAccepted=${r.canvasV11LineageAccepted}`,
      `canvasBaselineV10_3Recognized=${r.canvasBaselineV10_3Recognized}`,
      `v10_3BaselineRecognizedOnly=${r.v10_3BaselineRecognizedOnly}`,
      `canvasReceiverApiReady=${r.canvasReceiverApiReady}`,
      `canvasReceiveSurfaceReady=${r.canvasReceiveSurfaceReady}`,
      `canvasSummaryObserved=${r.canvasSummaryObserved}`,
      `canvasVisibleProofReady=${r.canvasVisibleProofReady}`,
      `canvasMounted=${r.canvasMounted}`,
      `canvasDrawComplete=${r.canvasDrawComplete}`,
      `canvasSourceMethod=${r.canvasSourceMethod}`,
      `selectedCanvasProofRank=${r.selectedCanvasProofRank}`,
      `selectedCanvasProofUnsafe=${r.selectedCanvasProofUnsafe}`,
      "",
      "CARRIER",
      `carrierIdentitySafe=${r.carrierIdentitySafe}`,
      `carrierSafeMarkerObserved=${r.carrierSafeMarkerObserved}`,
      `preReleaseCarrierAdmissible=${r.preReleaseCarrierAdmissible}`,
      `carrierHardBlock=${r.carrierHardBlock}`,
      `carrierHeld=${r.carrierHeld}`,
      `carrierHoldReason=${r.carrierHoldReason}`,
      `explicitUnsafeFields=${r.explicitUnsafeFields.join(",") || "none"}`,
      "",
      "WEST_DECISION",
      `westAuditObserved=${r.westAuditObserved}`,
      `westAuditIntakeAccepted=${r.westAuditIntakeAccepted}`,
      `westAuditAccepted=${r.westAuditAccepted}`,
      `westAuditPassed=${r.westAuditPassed}`,
      `westDecision=${r.westDecision}`,
      `westGapClass=${r.westGapClass}`,
      `westHardBlock=${r.westHardBlock}`,
      `westForwardAllowed=${r.westForwardAllowed}`,
      `westCanvasReleaseApproved=${r.westCanvasReleaseApproved}`,
      "",
      "CANVAS_RELEASE",
      `canvasReleaseAuthorized=${r.canvasReleaseAuthorized}`,
      `canvasReleasePacketReady=${r.canvasReleasePacketReady}`,
      `canvasReleaseApprovedByWest=${r.canvasReleaseApprovedByWest}`,
      `releaseToCanvas=${r.releaseToCanvas}`,
      `canvasReleaseHeldReason=${r.canvasReleaseHeldReason}`,
      `releasePacket=${r.releasePacket}`,
      "",
      "NO_CLAIMS",
      `f21EligibleForNorth=${r.f21EligibleForNorth}`,
      `f21SubmittedToNorth=${r.f21SubmittedToNorth}`,
      `f21EligibilitySubmittedToNorth=${r.f21EligibilitySubmittedToNorth}`,
      `f21ClaimedByWest=${r.f21ClaimedByWest}`,
      `completionLatched=${r.completionLatched}`,
      `finalCompletionLatched=${r.finalCompletionLatched}`,
      `degradedCompletionLatched=${r.degradedCompletionLatched}`,
      `readyTextAllowed=${r.readyTextAllowed}`,
      `readyTextClaimed=${r.readyTextClaimed}`,
      `visualPassClaimed=${r.visualPassClaimed}`,
      `generatedImage=${r.generatedImage}`,
      `graphicBox=${r.graphicBox}`,
      `webGL=${r.webGL}`,
      "",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextRenewalTarget=${r.recommendedNextRenewalTarget}`,
      `postgameStatus=${r.postgameStatus}`
    ].join("\n");
  }

  function updateDataset() {
    setDataset("labRuntimeTableWestLoaded", "true");
    setDataset("labRuntimeTableWestContract", CONTRACT);
    setDataset("labRuntimeTableWestReceipt", RECEIPT);
    setDataset("labRuntimeTableWestPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthWestRuntimeTableLoaded", "true");
    setDataset("hearthWestRuntimeTableContract", CONTRACT);
    setDataset("hearthWestRuntimeTableReceipt", RECEIPT);

    setDataset("hearthWestGateLanguageActive", "true");
    setDataset("hearthWestGateOwnsUpstreamTruth", "false");
    setDataset("hearthUpstreamCardinalSelfNamingRequired", "false");
    setDataset("hearthCardinalBishopTermOwnedByHierarchyMap", "true");
    setDataset("hearthDownstreamBishopTermActive", "true");
    setDataset("hearthHierarchyRegistryActive", "true");
    setDataset("hearthHierarchyRegistryContract", HIERARCHY_REGISTRY_CONTRACT);
    setDataset("hearthHierarchyRegistryReceipt", HIERARCHY_REGISTRY_RECEIPT);

    setDataset("hearthCardinalBishopNorthFile", NORTH_FILE);
    setDataset("hearthCardinalBishopEastFile", EAST_FILE);
    setDataset("hearthCardinalBishopSouthFile", SOUTH_FILE);
    setDataset("hearthCardinalBishopWestFile", WEST_FILE);
    setDataset("hearthDownstreamBishopRouteNorthFile", ROUTE_CONDUCTOR_FILE);
    setDataset("hearthDownstreamBishopCanvasSouthFile", CANVAS_FILE);
    setDataset("hearthDownstreamBishopPointerWestFile", POINTER_SURFACE_FILE);
    setDataset("hearthPointerSurfaceBishopFile", POINTER_SURFACE_FILE);
    setDataset("hearthQueenFile", QUEEN_FILE);
    setDataset("hearthQueenExcludedFromCardinalFunctionality", "true");
    setDataset("hearthEastPriestFile", PRIEST_FILE);
    setDataset("hearthPriestNotBishop", "true");

    setDataset("hearthWestRouteConductorObserved", String(Boolean(state.routeConductorObserved)));
    setDataset("hearthWestEastPriestObserved", String(Boolean(state.priestObserved)));
    setDataset("hearthWestQueenObserved", String(Boolean(state.queenObserved)));
    setDataset("hearthWestCanvasReceiverObserved", String(Boolean(state.canvasObserved)));
    setDataset("hearthWestPointerSurfaceObserved", String(Boolean(state.pointerSurfaceObserved)));
    setDataset("hearthWestPointerSurfaceAccepted", String(Boolean(state.pointerSurfaceAccepted)));
    setDataset("hearthWestPointerSurfaceContract", state.pointerSurfaceContract);
    setDataset("hearthWestHierarchySurfaceObservedCount", String(state.hierarchySurfaceObservedCount));
    setDataset("hearthWestHierarchySurfaceStatus", state.hierarchySurfaceStatus);

    setDataset("hearthWestBishopChordBridgeActive", "true");
    setDataset("hearthWestBishopSubjectFileDelegationActive", "true");
    setDataset("hearthWestKnowsBishopsNotChildren", "true");

    setDataset("hearthWestNorthTimetableAligned", String(Boolean(state.northC2WestAuditAligned)));
    setDataset("hearthWestNorthActiveStageId", state.northActiveStageId);
    setDataset("hearthWestNorthActiveGearId", state.northActiveGearId);
    setDataset("hearthWestNorthActiveFileGate", state.northActiveFileGate);
    setDataset("hearthWestNorthActiveCycleRoute", state.northActiveCycleRoute);
    setDataset("hearthWestNorthActiveFibonacci", state.northActiveFibonacci);
    setDataset("hearthWestNorthActiveNewsGate", state.northActiveNewsGate);

    setDataset("hearthWestCycleNumber", String(state.cycleNumber));
    setDataset("hearthWestCycleRoute", state.cycleRoute);
    setDataset("hearthWestReceivedFrom", state.receivedFrom);
    setDataset("hearthWestHandoffTo", state.handoffTo);
    setDataset("hearthWestSouthOutputReady", String(Boolean(state.southOutputReady)));
    setDataset("hearthWestCycleTwoSouthOutputAdmissible", String(Boolean(state.cycleTwoSouthOutputAdmissible)));

    setDataset("hearthWestBishopChordStatus", state.bishopChordStatus);
    setDataset("hearthWestBishopChordStrict", String(Boolean(state.bishopChordStrict)));
    setDataset("hearthWestBishopChordAdmissible", String(Boolean(state.bishopChordAdmissible)));
    setDataset("hearthWestBishopChordDegraded", String(Boolean(state.bishopChordDegraded)));
    setDataset("hearthWestBishopChordHardBlock", String(Boolean(state.bishopChordHardBlock)));
    setDataset("hearthWestBishopChordReadyCount", String(state.bishopChordReadyCount));
    setDataset("hearthWestBishopChordObservedCount", String(state.bishopChordObservedCount));
    setDataset("hearthWestBishopChordGap", state.bishopChordGap);
    setDataset("hearthWestBishopChordReleaseMode", state.bishopChordReleaseMode);

    setDataset("hearthWestCurrentCanvasParentContract", state.currentCanvasParentContract);
    setDataset("hearthWestCurrentCanvasParentReceipt", state.currentCanvasParentReceipt);
    setDataset("hearthWestCurrentCanvasParentIsCurrentCanvas", String(Boolean(state.currentCanvasParentIsCurrentCanvas)));
    setDataset("hearthWestCanvasContractAccepted", String(Boolean(state.canvasContractAccepted)));
    setDataset("hearthWestCanvasV123Recognized", String(Boolean(state.canvasV123Recognized)));
    setDataset("hearthWestCanvasV122Recognized", String(Boolean(state.canvasV122Recognized)));
    setDataset("hearthWestCanvasV121Recognized", String(Boolean(state.canvasV121Recognized)));
    setDataset("hearthWestCanvasV12LineageAccepted", String(Boolean(state.canvasV12LineageAccepted)));
    setDataset("hearthWestCanvasV11LineageAccepted", String(Boolean(state.canvasV11LineageAccepted)));
    setDataset("hearthWestV10_3BaselineRecognizedOnly", String(Boolean(state.v10_3BaselineRecognizedOnly)));
    setDataset("hearthWestCanvasReceiverApiReady", String(Boolean(state.canvasReceiverApiReady)));
    setDataset("hearthWestCanvasReceiveSurfaceReady", String(Boolean(state.canvasReceiveSurfaceReady)));
    setDataset("hearthWestCanvasVisibleProofReady", String(Boolean(state.canvasVisibleProofReady)));
    setDataset("hearthWestCanvasMounted", String(Boolean(state.canvasMounted)));
    setDataset("hearthWestCanvasDrawComplete", String(Boolean(state.canvasDrawComplete)));
    setDataset("hearthWestCanvasSourceMethod", state.canvasSourceMethod);
    setDataset("hearthWestSelectedCanvasProofRank", String(state.selectedCanvasProofRank));
    setDataset("hearthWestSelectedCanvasProofUnsafe", String(Boolean(state.selectedCanvasProofUnsafe)));

    setDataset("hearthWestCarrierIdentitySafe", String(Boolean(state.carrierIdentitySafe)));
    setDataset("hearthWestCarrierSafeMarkerObserved", String(Boolean(state.carrierSafeMarkerObserved)));
    setDataset("hearthWestPreReleaseCarrierAdmissible", String(Boolean(state.preReleaseCarrierAdmissible)));
    setDataset("hearthWestCarrierHardBlock", String(Boolean(state.carrierHardBlock)));
    setDataset("hearthWestCarrierHeld", String(Boolean(state.carrierHeld)));
    setDataset("hearthWestCarrierHoldReason", state.carrierHoldReason);

    setDataset("hearthWestAuditObserved", String(Boolean(state.westAuditObserved)));
    setDataset("hearthWestAuditIntakeAccepted", String(Boolean(state.westAuditIntakeAccepted)));
    setDataset("hearthWestAuditAccepted", String(Boolean(state.westAuditAccepted)));
    setDataset("hearthWestAuditPassed", String(Boolean(state.westAuditPassed)));
    setDataset("hearthWestDecision", state.westDecision);
    setDataset("hearthWestGapClass", state.westGapClass);
    setDataset("hearthWestHardBlock", String(Boolean(state.westHardBlock)));
    setDataset("hearthWestForwardAllowed", String(Boolean(state.westForwardAllowed)));
    setDataset("hearthWestCanvasReleaseApproved", String(Boolean(state.westCanvasReleaseApproved)));

    setDataset("hearthCanvasReleaseAuthorized", String(Boolean(state.canvasReleaseAuthorized)));
    setDataset("hearthCanvasReleasePacketReady", String(Boolean(state.canvasReleasePacketReady)));
    setDataset("hearthCanvasReleaseApprovedByWest", String(Boolean(state.canvasReleaseApprovedByWest)));
    setDataset("hearthReleaseToCanvas", String(Boolean(state.releaseToCanvas)));
    setDataset("hearthCanvasReleaseHeldReason", state.canvasReleaseHeldReason);

    setDataset("hearthWestFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthWestRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthWestRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthWestPostgameStatus", state.postgameStatus);

    setDataset("hearthWestF21EligibleForNorth", "false");
    setDataset("hearthWestF21SubmittedToNorth", "false");
    setDataset("hearthWestCompletionLatched", "false");
    setDataset("hearthWestReadyTextAllowed", "false");
    setDataset("hearthWestReadyTextClaimed", "false");
    setDataset("hearthWestVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishReceiptAliases() {
    const w = rootRef();
    const light = getReceiptLight();
    const full = getReceipt();

    w.LAB_RUNTIME_TABLE_WEST_RECEIPT = light;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_RECEIPT = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_RECEIPT = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_RECEIPT_v4_9 = full;

    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT_v4_8 = full;

    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_RECEIPT = full;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_RECEIPT_v4_7 = full;

    return true;
  }

  function publishGlobals() {
    const w = rootRef();
    const lab = ensureObject(w, "DEXTER_LAB");
    const hearth = ensureObject(w, "HEARTH");

    publishHierarchyRegistry();

    w.LAB_RUNTIME_TABLE_WEST = api;
    w.RUNTIME_TABLE_WEST = api;
    w.LAB_CARDINAL_RUNTIME_TABLE_WEST = api;
    w.LAB_RUNTIME_TABLE_CARDINAL_WEST = api;
    w.HEARTH_RUNTIME_TABLE_WEST = api;
    w.HEARTH_WEST_ADMISSIBILITY = api;
    w.HEARTH_MACRO_WEST_AUTHORITY = api;

    w.LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE = api;
    w.HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE = api;
    w.LAB_RUNTIME_TABLE_WEST_GATE_DOWNSTREAM_HIERARCHY_ADOPTION = api;
    w.HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_ADOPTION = api;
    w.LAB_RUNTIME_TABLE_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE = api;
    w.HEARTH_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE = api;

    hearth.runtimeTableWest = api;
    hearth.westRuntimeTable = api;
    hearth.westAdmissibility = api;
    hearth.macroWestAuthority = api;
    hearth.westBishopChordCanvasReleaseBridge = api;
    hearth.westGateDownstreamHierarchyAdoption = api;
    hearth.westCanvasV123PointerSurfaceBishopReleaseBridge = api;

    lab.runtimeTableWest = api;
    lab.cardinalRuntimeTableWest = api;
    lab.hearthRuntimeTableWest = api;
    lab.westAdmissibility = api;
    lab.hearthWestBishopChordCanvasReleaseBridge = api;
    lab.hearthWestGateDownstreamHierarchyAdoption = api;
    lab.hearthWestCanvasV123PointerSurfaceBishopReleaseBridge = api;

    publishReceiptAliases();

    if (state.releasePacket) {
      publishCanvasReleasePacket(state.releasePacket);
    } else {
      clearCanvasReleasePacket();
    }

    return api;
  }

  function scheduleAliasRepublish() {
    const w = rootRef();
    const delays = [0, 16, 80, 240, 700];

    delays.forEach((delay) => {
      if (isFunction(w.setTimeout)) {
        w.setTimeout(() => {
          publishGlobals();
          updateDataset();
        }, delay);
      }
    });
  }

  const api = {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    LINEAGE_V4_7_CONTRACT,
    LINEAGE_V4_7_RECEIPT,
    BASELINE_CONTRACT,
    VERSION,
    FILE,
    ROUTE,

    NORTH_FILE,
    EAST_FILE,
    SOUTH_FILE,
    WEST_FILE,
    ROUTE_CONDUCTOR_FILE,
    PRIEST_FILE,
    QUEEN_FILE,
    CANVAS_FILE,
    POINTER_SURFACE_FILE,

    HIERARCHY_REGISTRY_CONTRACT,
    HIERARCHY_REGISTRY_RECEIPT,
    CARDINAL_BISHOP_FILES,
    DOWNSTREAM_BISHOP_FILES,
    PRIEST_FILES,
    QUEEN_FILES,

    ACTIVE_STAGE_ID,
    ACTIVE_GEAR,
    ACTIVE_CYCLE_NUMBER,
    ACTIVE_CYCLE_ROUTE,
    ACTIVE_CARDINAL,
    ACTIVE_FIBONACCI,
    ACTIVE_NEWS_GATE,

    WEST_DECISION,
    WEST_GAP_CLASS,
    BISHOP_CHORD_STATUS,
    CURRENT_CANVAS_CONTRACTS,
    CANVAS_BASELINE_HOLD_CONTRACTS,
    POINTER_SURFACE_CONTRACTS,

    NORTH_ALIASES,
    EAST_ALIASES,
    SOUTH_ALIASES,
    ROUTE_CONDUCTOR_ALIASES,
    PRIEST_ALIASES,
    QUEEN_ALIASES,
    CANVAS_ALIASES,
    POINTER_SURFACE_ALIASES,

    composeHierarchyRegistry,
    publishHierarchyRegistry,
    readHierarchySurface,
    getHierarchyRegistry,
    getHierarchySurface,

    readNorthTimetableLight,
    normalizeNorthTimetable,
    isNorthCallingWestForCycleTwoCanvasAudit,
    inputCallsWestForCycleTwoAudit,
    normalizeCycleInput,

    normalizeAuthorityLane,
    readPointerSurfaceProof,
    readBishopChord,
    getBishopChord,
    getBishopLanes,

    selectCanvasReceiverProof,
    classifyWestAdmissibility,
    classifyCyclePacket,
    createWestCycleReceipt,
    createGapReceipt,
    classifyGap,
    classifyTransmissionGap,

    assess,
    inspect,
    run,
    boot,
    init,
    start,
    mount,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket,

    composeBishopLaneHandoffPackets,
    composeCanvasReleasePacket,
    clearCanvasReleasePacket,
    publishCanvasReleasePacket,
    updateDataset,
    publishGlobals,

    ownsWestAdmissibility: true,
    ownsWestGateDownstreamHierarchyAdoption: true,
    ownsHierarchyRegistryPublication: true,
    ownsBishopChordBridge: true,
    ownsCanvasReleasePacket: true,
    ownsBishopReceiptTrust: true,
    westKnowsBishopsNotChildren: true,
    bishopSubjectFileDelegationActive: true,

    ownsUpstreamTruth: false,
    ownsNorthTimetableTruth: false,
    ownsEastSourceTruth: false,
    ownsSouthOutputTruth: false,
    requiresUpstreamCardinalSelfNaming: false,
    ownsQueenBehavior: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsBishopImplementationTruth: false,
    ownsSubjectFiles: false,
    ownsPointerSurfaceInternals: false,
    ownsCanvasDrawing: false,
    ownsCanvasChildInternals: false,
    ownsPlanetTruth: false,
    ownsF21Latch: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    cardinalBishopTermOwnedByHierarchyMap: true,
    downstreamBishopTermActive: true,
    queenExcludedFromCardinalFunctionality: true,
    priestNotBishop: true,
    pointerSurfaceBishopRecognized: true,

    ...NO_CLAIMS,

    getState: () => clonePlain(state)
  };

  publishGlobals();
  updateDataset();

  try {
    classifyWestAdmissibility({});
  } catch (_error) {
    state.timestamp = nowIso();
    state.westAuditObserved = true;
    state.westAuditIntakeAccepted = false;
    state.westAuditAccepted = false;
    state.westAuditPassed = false;
    state.westDecision = WEST_DECISION.HOLD;
    state.westGapClass = WEST_GAP_CLASS.NORTH_TIMETABLE_HOLD;
    state.westHardBlock = false;
    state.westForwardAllowed = false;
    state.westCanvasReleaseApproved = false;
    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.canvasReleaseApprovedByWest = false;
    state.releaseToCanvas = false;
    state.canvasReleaseHeldReason = "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT";
    state.firstFailedCoordinate = "WAITING_NORTH_TIMETABLE_C2_WEST_AUDIT";
    state.recommendedNextFile = NORTH_FILE;
    state.recommendedNextRenewalTarget = NORTH_FILE;
    state.postgameStatus = "WEST_HOLD_INITIALIZATION_SAFE";
    blockFinalClaims();
    clearCanvasReleasePacket();
    publishHierarchyRegistry();
    readHierarchySurface();
    updateDataset();
    publishGlobals();
  }

  scheduleAliasRepublish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
