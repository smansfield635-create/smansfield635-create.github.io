// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal renewal:
// HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_ALIGNMENT_TNT_v12_5
// Full-file replacement.
// Canvas Hub / bridge-between-bridges / downstream receiver-output-carrier bishop.
// Public Canvas contract intentionally remains v12_3 because Route Conductor v9_9 currently recognizes v12_3 as the current Canvas parent.
// This renewal updates the bridge language, recognition surfaces, pointer-finger anchor, current Route Conductor recognition,
// LabWest bridge recognition, Queen bridge recognition, diagnostic receipt publication, and downstream finger bridge alignment.
//
// Purpose:
// - Preserve the public Canvas Hub contract expected by Route Conductor v9_9, Controls Queen, LabWest, diagnostics, and finger files.
// - Treat this file as the bridge between the bridges:
//   1. Route Conductor North Bishop <-> Canvas receiver/output bishop.
//   2. Controls Queen <-> Canvas fast-view receiver.
//   3. LabWest Cardinal Bishop <-> Canvas admissible release context.
//   4. Diagnostic rail <-> Canvas receipt/read surface.
//   5. Pointer-finger bishop <-> Canvas finger registry.
// - Recognize Route Conductor v9_9 as current while preserving v9_8, v9_7, v9_6, v9_5, and v9_4 lineage.
// - Recognize LabWest v4_8 hierarchy and v4_7 bishop-chord lineage.
// - Recognize Queen controls v2 hierarchy, v2 bishop-chord, and v1 public control contract.
// - Correct pointer-finger bishop anchor to inspect, while preserving surface as a separate lower-surface finger.
// - Preserve Composite-first visible path, drawToCanvas(canvasOrContext), fast view transform, and deferred Hex render.
// - Always republish current receipts and aliases so stale receipt readers are replaced.
// - Preserve Canvas as receiver/output carrier only.
//
// Does not own:
// - controls input admission
// - route conductor handshake truth
// - LabWest admissibility truth
// - diagnostic rail case selection
// - Composite truth
// - Hex Four-Pair truth
// - Hex Surface truth
// - finger truth
// - pointer truth
// - terrain, elevation, hydrology, material, atmosphere, or lighting truth
// - F13 final claim
// - F21 latch
// - ready text
// - final visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_ALIGNMENT_TNT_v12_5";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_ALIGNMENT_RECEIPT_v12_5";

  const PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_DOWNSTREAM_BISHOP_OUTPUT_CARRIER_WEST_GATE_HIERARCHY_ADOPTION_TNT_v12_4";
  const PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_DOWNSTREAM_BISHOP_OUTPUT_CARRIER_WEST_GATE_HIERARCHY_ADOPTION_RECEIPT_v12_4";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_RECEIPT_v12_2";

  const LINEAGE_V12_1_CONTRACT = "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const LINEAGE_V12_1_RECEIPT = "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT_v12_1";

  const BASELINE_CONTRACT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";
  const BASELINE_RECEIPT = "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_RECEIPT_v12";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";

  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_EAST_FILE = "/assets/lab/runtime-table.east.js";
  const LAB_SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";

  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  const ROUTE_CONDUCTOR_V9_9_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const ROUTE_CONDUCTOR_V9_9_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_RECEIPT_v9_9";

  const ROUTE_CONDUCTOR_V9_8_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8";
  const ROUTE_CONDUCTOR_V9_8_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_RECEIPT_v9_8";

  const ROUTE_CONDUCTOR_V9_7_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const ROUTE_CONDUCTOR_V9_6_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const ROUTE_CONDUCTOR_V9_5_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const ROUTE_CONDUCTOR_V9_4_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    ROUTE_CONDUCTOR_V9_9_CONTRACT,
    ROUTE_CONDUCTOR_V9_8_CONTRACT,
    ROUTE_CONDUCTOR_V9_7_CONTRACT,
    ROUTE_CONDUCTOR_V9_6_CONTRACT,
    ROUTE_CONDUCTOR_V9_5_CONTRACT,
    ROUTE_CONDUCTOR_V9_4_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const LABWEST_V4_8_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8";
  const LABWEST_V4_8_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT_v4_8";
  const LABWEST_V4_7_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7";
  const LABWEST_V4_7_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_RECEIPT_v4_7";

  const ACCEPTED_LABWEST_CONTRACTS = Object.freeze([
    LABWEST_V4_8_CONTRACT,
    LABWEST_V4_7_CONTRACT
  ]);

  const QUEEN_V2_HIERARCHY_CONTRACT =
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2";
  const QUEEN_V2_BISHOP_CHORD_CONTRACT =
    "HEARTH_CONTROLS_QUEEN_BISHOP_CHORD_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2";
  const QUEEN_V1_PUBLIC_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const QUEEN_V1_PUBLIC_RECEIPT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT_v1";

  const ACCEPTED_QUEEN_CONTRACTS = Object.freeze([
    QUEEN_V2_HIERARCHY_CONTRACT,
    QUEEN_V2_BISHOP_CHORD_CONTRACT,
    QUEEN_V1_PUBLIC_CONTRACT
  ]);

  const HEX_FOUR_PAIR_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const HEX_SURFACE_V2_CONTRACT =
    "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2";
  const HEX_SURFACE_V1_CONTRACT =
    "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";

  const ACCEPTED_HEX_SURFACE_CONTRACTS = Object.freeze([
    HEX_SURFACE_V2_CONTRACT,
    HEX_SURFACE_V1_CONTRACT
  ]);

  const FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    mass: "/assets/hearth/hearth.canvas.finger.mass.js",
    surface: "/assets/hearth/hearth.canvas.finger.surface.js",
    light: "/assets/hearth/hearth.canvas.finger.light.js",
    inspect: "/assets/hearth/hearth.canvas.finger.inspect.js",
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js",
    composite: COMPOSITE_FILE
  });

  const FINGER_SEQUENCE = Object.freeze([
    "boundary",
    "mass",
    "surface",
    "light",
    "inspect",
    "landform",
    "elevation",
    "material",
    "hydrology",
    "atmosphere",
    "lighting",
    "composite"
  ]);

  const POINTER_FINGER_KEY = "inspect";
  const POINTER_FINGER_FILE = FINGER_FILES.inspect;
  const LOWER_SURFACE_FINGER_KEY = "surface";
  const LOWER_SURFACE_FINGER_FILE = FINGER_FILES.surface;

  const CANVAS_MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "main",
    "body"
  ]);

  const GLOBE_STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "[data-hearth-planet-engine-stage]"
  ]);

  const FAST_TRANSFORM_DELAY_MS = 0;
  const DEFERRED_RENDER_DELAY_MS = 180;
  const DEFERRED_RENDER_MAX_WAIT_MS = 880;
  const DEFERRED_HEX_MIN_DELAY_MS = 1700;

  const HIERARCHY_ROLE = Object.freeze({
    rank: "DOWNSTREAM_RECEIVER_OUTPUT_BISHOP",
    title: "Canvas Hub bridge-between-bridges receiver/output carrier bishop",
    bridgeRole: "BRIDGE_BETWEEN_BRIDGES",
    cardinalAddress: "CANVAS_RECEIVER",
    definitiveFile: FILE,
    definitiveContract: CONTRACT,
    definitiveReceipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    routeNorthBishopFile: ROUTE_FILE,
    queenFile: CONTROL_FILE,
    cardinalWestBishopFile: LAB_WEST_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    pointerFingerBishopKey: POINTER_FINGER_KEY,
    pointerFingerBishopFile: POINTER_FINGER_FILE,
    lowerSurfaceFingerKey: LOWER_SURFACE_FINGER_KEY,
    lowerSurfaceFingerFile: LOWER_SURFACE_FINGER_FILE,
    compositeFingerFile: COMPOSITE_FILE,
    ownsCanvasReceiver: true,
    ownsOutputCarrier: true,
    ownsBridgeReceipts: true,
    ownsViewProjectionApplication: true,
    ownsCanvasRedrawFromViewState: true,
    ownsInputAdmission: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsQueenTruth: false,
    ownsDiagnosticCaseSelection: false,
    ownsFingerTruth: false,
    ownsPointerTruth: false,
    ownsPlanetTruth: false
  });

  const FINAL_FALSE = Object.freeze({
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByCanvasParent: false,
    f21Claimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    readyTextClaimed: false,
    downstreamReleaseClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const view = {
    yaw: 0,
    pitch: 0,
    zoom: 1,
    phase: 0,
    minPitch: -1.25,
    maxPitch: 1.25,
    minZoom: 0.55,
    maxZoom: 2.4,
    lastAppliedAt: ""
  };

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV121Contract: LINEAGE_V12_1_CONTRACT,
    lineageV121Receipt: LINEAGE_V12_1_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeFile: ROUTE_FILE,
    controlFile: CONTROL_FILE,
    labWestFile: LAB_WEST_FILE,
    canvasRole: HIERARCHY_ROLE.title,

    bridgeBetweenBridgesActive: true,
    bridgeBetweenControlsAndQueen: true,
    bridgeBetweenWestAndLab: true,
    bridgeBetweenDiagnosticsAndCanvas: true,
    bridgeBetweenPointerFingerAndSurface: true,
    downstreamReceiverOutputBishopActive: true,
    canvasReceiverOutputCarrierBishopActive: true,
    hierarchyRole: HIERARCHY_ROLE.rank,
    hierarchyTitle: HIERARCHY_ROLE.title,
    hierarchyBridgeRole: HIERARCHY_ROLE.bridgeRole,
    cardinalAddress: HIERARCHY_ROLE.cardinalAddress,

    routeConductorObserved: false,
    routeConductorAuthoritySource: "NONE",
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorContractRecognized: false,
    routeConductorV99Recognized: false,
    routeConductorV98LineageAccepted: false,
    routeConductorV97LineageAccepted: false,
    routeConductorV96LineageAccepted: false,
    routeConductorV95LineageAccepted: false,
    routeConductorV94LineageAccepted: false,
    routeConductorBridgeStatus: "ROUTE_CONDUCTOR_NOT_OBSERVED",

    labWestObserved: false,
    labWestAuthoritySource: "NONE",
    labWestContract: "",
    labWestReceipt: "",
    labWestContractRecognized: false,
    labWestV48HierarchyRecognized: false,
    labWestV47BishopChordRecognized: false,
    labWestBridgeStatus: "LABWEST_NOT_OBSERVED",

    queenObserved: false,
    queenAuthoritySource: "NONE",
    queenContract: "",
    queenReceipt: "",
    queenContractRecognized: false,
    queenHandshakeAccepted: false,
    queenInputAdmissionOpen: false,
    queenSuperconductorLanguageObserved: false,
    queenBridgeStatus: "QUEEN_NOT_OBSERVED",

    pointerFingerBishopObserved: false,
    pointerFingerBishopKey: POINTER_FINGER_KEY,
    pointerFingerBishopFile: POINTER_FINGER_FILE,
    pointerFingerBishopStatus: "POINTER_FINGER_BISHOP_NOT_OBSERVED",
    lowerSurfaceFingerObserved: false,
    lowerSurfaceFingerKey: LOWER_SURFACE_FINGER_KEY,
    lowerSurfaceFingerFile: LOWER_SURFACE_FINGER_FILE,
    lowerSurfaceFingerStatus: "LOWER_SURFACE_FINGER_NOT_OBSERVED",

    diagnosticReceiptSurfaceActive: true,
    diagnosticRailMayReadThisSummary: true,
    latestReceiptAlwaysRepublished: true,
    staleReceiptPublicationBlocked: true,
    receiptPublishCount: 0,

    canvasHubLoaded: true,
    canvasHubActive: true,
    canvasLocalStationActive: true,
    expressionHubActive: true,
    canvasExpressionHubActive: true,
    fingerManagerActive: true,
    canvasFingerManagerActive: true,
    fingerRegistryActive: true,
    threeFileStretchActive: true,

    compositeFirstVisiblePathActive: true,
    compositeDrawToCanvasHandshakeRecognized: true,
    hexSurfaceDeferredPathActive: true,
    hexSurfaceBootBlockingRejected: true,

    planetaryViewControlReceiverActive: true,
    viewControlPacketReceiverReady: true,
    fastViewTransformActive: true,
    deferredRendererActive: true,
    expensiveRedrawDetachedFromInputPacket: true,

    globeStageFound: false,
    globeStageSelector: "NONE",
    globeStageRectNonzero: false,

    canvasMountAttempted: false,
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasMountRectNonzero: false,
    canvasElementFound: false,
    canvasCreated: false,
    canvasReused: false,
    canvasId: "hearthCanvas",
    canvasRectNonzero: false,
    canvasAttributeWidth: 0,
    canvasAttributeHeight: 0,
    canvasContext2dReady: false,
    canvasDrawAttempted: false,
    canvasDrawComplete: false,
    canvasDrawError: "",
    holdingFieldDrawComplete: false,
    holdingFieldVisible: false,

    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "NOT_ATTEMPTED",
    renderedPlanetProofReady: false,
    domVisiblePlanetProofReady: false,
    stageMountDomProofReady: false,

    compositeDetected: false,
    compositeContract: "",
    compositeReceipt: "",
    compositeSourceName: "NONE",
    compositeDrawMethodAvailable: false,
    compositeDrawMethod: "NONE",
    compositeDrawAttempted: false,
    compositeDrawComplete: false,
    compositeDrawReceipt: null,
    compositeDrawError: "",

    hexFourPairAuthorityDetected: false,
    hexFourPairAuthorityContract: "",
    hexFourPairAuthorityContractRecognized: false,
    hexFourPairWideProbeAvailable: false,
    hexFourPairEveryPixelHasFourPairSet: false,
    hexFourPairBodyBound: false,
    hexFourPairAllowedToFloat: true,
    hexFourPairValidationReceipt: null,
    hexFourPairValidationError: "",
    hexFourPairSourceName: "NONE",

    hexSurfaceRendererDetected: false,
    hexSurfaceRendererContract: "",
    hexSurfaceRendererContractRecognized: false,
    hexSurfaceRendererV2Recognized: false,
    hexSurfaceRendererV1LineageAccepted: false,
    hexSurfaceRendererSourceName: "NONE",
    hexSurfaceRendererDrawMethodAvailable: false,
    hexSurfaceRendererDrawMethod: "NONE",
    hexSurfaceRendererDrawAttempted: false,
    hexSurfaceRendererDrawComplete: false,
    hexSurfaceRendererFrameReceipt: null,
    hexSurfaceRendererDrawError: "",
    hexSurfaceRendererDeferred: true,
    hexSurfaceRendererSkippedBecauseCompositeReady: false,
    hexSurfaceRendererLastDeferredAt: "",

    supportLoadAttempted: false,
    supportLoadComplete: false,
    supportLoadCompositeAttempted: false,
    supportLoadCompositeComplete: false,
    supportLoadHexFourPairAttempted: false,
    supportLoadHexFourPairComplete: false,
    supportLoadHexSurfaceAttempted: false,
    supportLoadHexSurfaceComplete: false,
    supportLoadErrors: [],

    fingerRegistry: {},
    fingerAuthorityObservedCount: 0,
    fingerApiReadyCount: 0,
    fingerExpressionPacketCount: 0,
    fingerReceiptPacketCount: 0,
    fingerTrackReadyCount: 0,
    fingerHardFailCount: 0,

    releasePacketObserved: false,
    releasePacketAccepted: false,
    releasePacketLastSource: "NONE",
    releasePacketLastReceivedAt: "",
    releasePacketDeliveryStatus: "WAITING_ROUTE_CONDUCTOR_RELEASE_PACKET",
    lastReleasePacket: null,

    controlPacketCount: 0,
    controlPacketAcceptedCount: 0,
    controlPacketRejectedCount: 0,
    controlPacketLastAcceptedAt: "",
    controlPacketLastRejectedAt: "",
    controlPacketLastRejectionReason: "",
    controlPacketDeliveryStatus: "WAITING_CONTROL_PACKET",
    controlPacketDeliveryMethod: "NONE",
    controlPacketLastSource: "NONE",
    lastControlPacket: null,
    lastViewPacket: null,

    fastTransformAttemptCount: 0,
    fastTransformAppliedCount: 0,
    fastTransformLastAppliedAt: "",
    fastTransformLastReason: "NOT_RUN",
    viewTransformApplied: false,
    viewTransformCss: "",

    deferredRenderScheduled: false,
    deferredRenderReason: "NONE",
    deferredRenderStartedAt: "",
    deferredRenderLastRunAt: "",
    deferredRenderRunCount: 0,
    deferredRenderSkippedDuringInputCount: 0,
    deferredRenderLastResult: "NOT_RUN",

    viewRedrawScheduled: false,
    viewRedrawCount: 0,
    viewMotionStatus: "FAST_VIEW_TRANSFORM_RECEIVER_READY",
    touchRuntimeStatus: "WAITING_CONTROL_PACKET",
    dragRuntimeStatus: "WAITING_CONTROL_PACKET",
    zoomRuntimeStatus: "WAITING_CONTROL_PACKET",
    keyboardRuntimeStatus: "WAITING_CONTROL_PACKET",
    planetaryViewInputStatus: "CANVAS_FAST_VIEW_RECEIVER_READY",

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "VISIBLE_EXPRESSION_NOT_ATTEMPTED",
    f13StrictEvidenceRepairTarget: FILE,

    firstFailedCoordinate: "VISIBLE_EXPRESSION_NOT_ATTEMPTED",
    recommendedNextFile: FILE,
    recommendedNextAction: "RUN_CANVAS_HUB",
    recommendedNextRenewalTarget: FILE,
    postgameStatus: "CANVAS_BRIDGE_BETWEEN_BRIDGES_NOT_STARTED",

    hierarchyContextPacket: null,
    localEvents: [],
    errors: [],
    bootAuditComplete: false,

    ...FINAL_FALSE
  };

  let deferredRenderTimer = 0;
  let deferredRenderMaxTimer = 0;
  let transformTimer = 0;
  let compositeSupportPromise = null;
  let hexSupportPromise = null;
  let deferredHexTimer = 0;

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

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) array.splice(0, array.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_BRIDGE_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 260);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_BRIDGE_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 160);
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
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function contractOf(value) {
    if (!isObject(value)) return "";
    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.currentContract ||
      value.sourceContract ||
      value.internalImplementationContract ||
      value.currentRouteConductorContract ||
      value.routeConductorContract ||
      value.currentCanvasParentContract ||
      value.canvasContract ||
      value.hearthCanvasContract ||
      value.controlContract ||
      value.controlsContract ||
      ""
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";
    return safeString(
      value.receipt ||
      value.RECEIPT ||
      value.currentReceipt ||
      value.sourceReceipt ||
      value.internalImplementationReceipt ||
      value.currentRouteConductorReceipt ||
      value.routeConductorReceipt ||
      value.currentCanvasParentReceipt ||
      value.canvasReceipt ||
      value.hearthCanvasReceipt ||
      value.controlReceipt ||
      value.controlsReceipt ||
      ""
    );
  }

  function safeInvoke(target, method, args = []) {
    if (!target || !isFunction(target[method])) {
      return { ok: false, value: null, error: `method-unavailable:${method}` };
    }

    try {
      return {
        ok: true,
        value: target[method](...(Array.isArray(args) ? args : [args])),
        error: ""
      };
    } catch (error) {
      return {
        ok: false,
        value: null,
        error: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return null;
    if (authority === api) return null;

    const methods = [
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getExpressionHubReceipt",
      "getExpressionHubSummary",
      "getCompositePacket",
      "getCompositeModel",
      "getWorldExpressionPacket",
      "getCarrierReceipt",
      "readStructuralCarrier",
      "getStructuralCarrier",
      "getCanvasCarrier",
      "getQueenBridgeState",
      "getControlViewReceipt",
      "getControlsReceipt",
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;
      const result = safeInvoke(authority, method);
      if (result.ok && isObject(result.value)) return result.value;
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.canvasStationSummary)) return authority.canvasStationSummary;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function firstElement(selectors) {
    if (!doc) return { element: null, selector: "NONE" };

    for (const selector of selectors) {
      try {
        const element = doc.querySelector(selector);
        if (element) return { element, selector };
      } catch (_error) {}
    }

    return { element: null, selector: "NONE" };
  }

  function rectNonzero(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) return false;

    try {
      const rect = element.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    } catch (_error) {
      return false;
    }
  }

  function firstAuthority(names) {
    for (const name of names) {
      const value = readPath(name);
      if (value && isObject(value)) return { name, authority: value };
    }

    return { name: "NONE", authority: null };
  }

  function routeConductorAliases() {
    return [
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH_ROUTE_CONDUCTOR",
      "HearthRouteConductor",
      "HEARTH_ROUTE_NORTH_BISHOP",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION",
      "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductor",
      "HEARTH.routeNorthBishop",
      "HEARTH.routeConductorControlFileAdmissionAndHandshakeDelivery",
      "HEARTH.routeConductorControlHandshakeIntegration",
      "HEARTH.routeConductorNewsFibonacciVisibleGlobeProofSynchronization",
      "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion",
      "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteNorthBishop",
      "DEXTER_LAB.hearthRouteConductorControlFileAdmissionAndHandshakeDelivery",
      "DEXTER_LAB.hearthRouteConductorControlHandshakeIntegration",
      "DEXTER_LAB.hearthRouteConductorNewsFibonacciVisibleGlobeProofSynchronization",
      "DEXTER_LAB.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestion",
      "DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment"
    ];
  }

  function labWestAliases() {
    return [
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION",
      "LAB_RUNTIME_TABLE_WEST_GATE_HIERARCHY",
      "HEARTH_WEST_GATE_HIERARCHY",
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
      "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
      "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
      "HEARTH_WEST_ANOINTED_BISHOP_CHORD_BRIDGE",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "DEXTER_LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "LAB_RUNTIME_TABLE_CARDINAL_WEST",
      "HEARTH_RUNTIME_TABLE_WEST",
      "HEARTH_MACRO_WEST_AUTHORITY",
      "HEARTH_WEST_ADMISSIBILITY",
      "HEARTH.runtimeTableWest",
      "HEARTH.westRuntimeTable",
      "HEARTH.westAdmissibility",
      "HEARTH.macroWestAuthority",
      "HEARTH.westGateHierarchy",
      "HEARTH.westBishopChordCanvasReleaseBridge",
      "HEARTH.westAnointedBishopChordBridge",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.hearthRuntimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.transmissionGapClassifierWest",
      "DEXTER_LAB.westAdmissibility",
      "DEXTER_LAB.hearthWestGateHierarchy",
      "DEXTER_LAB.hearthWestBishopChordCanvasReleaseBridge",
      "DEXTER_LAB.hearthWestAnointedBishopChordBridge"
    ];
  }

  function queenAliases() {
    return [
      "HEARTH_CONTROLS_QUEEN",
      "HEARTH_QUEEN_CONTROLS",
      "HEARTH_QUEEN_SUPERCONDUCTOR_CONTROLS",
      "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
      "HEARTH_CONTROLS",
      "HEARTH_PLANETARY_CONTROLS",
      "HEARTH_CONTROL_FILE",
      "HEARTH_CONTROL_AUTHORITY",
      "HEARTH_PLANETARY_VIEW_CONTROLS",
      "HEARTH.controlsQueen",
      "HEARTH.queenControls",
      "HEARTH.queenSuperconductorControls",
      "HEARTH.controlsPlanetaryViewInputHandshake",
      "HEARTH.controls",
      "HEARTH.planetaryControls",
      "HEARTH.controlFile",
      "HEARTH.controlAuthority",
      "HEARTH.planetaryViewControls",
      "DEXTER_LAB.hearthQueenControls",
      "DEXTER_LAB.hearthQueenSuperconductorControls",
      "DEXTER_LAB.hearthControlsPlanetaryViewInputHandshake",
      "DEXTER_LAB.hearthControls",
      "DEXTER_LAB.hearthPlanetaryControls",
      "DEXTER_LAB.hearthControlFile",
      "DEXTER_LAB.hearthControlAuthority"
    ];
  }

  function compositeAliases() {
    return [
      "HEARTH_CANVAS_FINGER_COMPOSITE",
      "HEARTH_CANVAS_COMPOSITE_FINGER",
      "HEARTH_CANVAS_COMPOSITE",
      "HEARTH.canvasFingerComposite",
      "HEARTH.canvasCompositeFinger",
      "HEARTH.canvasComposite",
      "DEXTER_LAB.hearthCanvasFingerComposite",
      "DEXTER_LAB.hearthCanvasCompositeFinger",
      "DEXTER_LAB.hearthCanvasComposite"
    ];
  }

  function hexFourPairAliases() {
    return [
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
      "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_HANDSHAKE_AUTHORITY",
      "HEARTH_HEXGRID_AUTHORITY",
      "HEARTH.hexFourPairAuthority",
      "HEARTH.hexAuthority",
      "DEXTER_LAB.hearthHexFourPairAuthority",
      "DEXTER_LAB.hearthHexAuthority"
    ];
  }

  function hexSurfaceAliases() {
    return [
      "HEARTH_HEX_SURFACE",
      "HEARTH_HEX_SURFACE_RENDERER",
      "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER",
      "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER",
      "HEARTH.hexSurface",
      "HEARTH.hexSurfaceRenderer",
      "HEARTH.hexSurfaceConsumer",
      "DEXTER_LAB.hearthHexSurface",
      "DEXTER_LAB.hearthHexSurfaceRenderer"
    ];
  }

  function readContractPair(candidate) {
    const receipt = readReceipt(candidate) || (isObject(candidate) ? candidate : null);
    return {
      contract: contractOf(receipt || candidate),
      receipt: receiptOf(receipt || candidate),
      body: receipt
    };
  }

  function readRouteConductorProfile() {
    const found = firstAuthority(routeConductorAliases());
    const receipt = readReceipt(found.authority) || {};
    const contract =
      contractOf(receipt) ||
      (found.authority && contractOf(found.authority)) ||
      datasetValue("hearthRouteConductorContract") ||
      datasetValue("hearthSouthJsRouteConductorContract") ||
      datasetValue("hearthCanvasRouteConductorContract") ||
      datasetValue("routeConductorContract");

    const receiptName =
      receiptOf(receipt) ||
      (found.authority && receiptOf(found.authority)) ||
      datasetValue("hearthRouteConductorReceipt") ||
      datasetValue("routeConductorReceipt");

    const observed = Boolean(
      found.authority ||
      contract ||
      datasetValue("hearthRouteConductorLoaded") === "true" ||
      datasetValue("hearthRouteConductorMarkerPresent") === "true" ||
      root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__
    );

    state.routeConductorObserved = observed;
    state.routeConductorAuthoritySource = found.name;
    state.routeConductorContract = contract || "";
    state.routeConductorReceipt = receiptName || "";
    state.routeConductorContractRecognized = ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(contract);
    state.routeConductorV99Recognized = contract === ROUTE_CONDUCTOR_V9_9_CONTRACT || receiptName === ROUTE_CONDUCTOR_V9_9_RECEIPT;
    state.routeConductorV98LineageAccepted = contract === ROUTE_CONDUCTOR_V9_8_CONTRACT || receiptName === ROUTE_CONDUCTOR_V9_8_RECEIPT;
    state.routeConductorV97LineageAccepted = contract === ROUTE_CONDUCTOR_V9_7_CONTRACT;
    state.routeConductorV96LineageAccepted = contract === ROUTE_CONDUCTOR_V9_6_CONTRACT;
    state.routeConductorV95LineageAccepted = contract === ROUTE_CONDUCTOR_V9_5_CONTRACT;
    state.routeConductorV94LineageAccepted = contract === ROUTE_CONDUCTOR_V9_4_CONTRACT;
    state.routeConductorBridgeStatus = observed
      ? state.routeConductorContractRecognized
        ? "ROUTE_CONDUCTOR_CURRENT_OR_LINEAGE_RECOGNIZED"
        : "ROUTE_CONDUCTOR_OBSERVED_UNRECOGNIZED_CONTRACT"
      : "ROUTE_CONDUCTOR_NOT_OBSERVED";

    return {
      observed,
      authoritySource: found.name,
      contract: state.routeConductorContract,
      receipt: state.routeConductorReceipt,
      contractRecognized: state.routeConductorContractRecognized,
      v99Recognized: state.routeConductorV99Recognized,
      v98LineageAccepted: state.routeConductorV98LineageAccepted,
      v97LineageAccepted: state.routeConductorV97LineageAccepted,
      v96LineageAccepted: state.routeConductorV96LineageAccepted,
      v95LineageAccepted: state.routeConductorV95LineageAccepted,
      v94LineageAccepted: state.routeConductorV94LineageAccepted,
      bridgeStatus: state.routeConductorBridgeStatus,
      receiptBody: clonePlain(receipt)
    };
  }

  function readLabWestProfile() {
    const found = firstAuthority(labWestAliases());
    const receipt = readReceipt(found.authority) || {};

    const contract =
      contractOf(receipt) ||
      (found.authority && contractOf(found.authority)) ||
      datasetValue("hearthWestGateHierarchyContract") ||
      datasetValue("hearthWestRuntimeTableContract") ||
      datasetValue("labRuntimeTableWestContract") ||
      datasetValue("hearthSouthCardinalWestBishopContract");

    const receiptName =
      receiptOf(receipt) ||
      (found.authority && receiptOf(found.authority)) ||
      datasetValue("hearthWestGateHierarchyReceipt") ||
      datasetValue("hearthWestRuntimeTableReceipt") ||
      datasetValue("labRuntimeTableWestReceipt") ||
      datasetValue("hearthSouthCardinalWestBishopReceipt");

    const observed = Boolean(
      found.authority ||
      contract ||
      datasetValue("hearthWestBishopChordBridgeActive") === "true" ||
      datasetValue("hearthWestGateHierarchyActive") === "true" ||
      datasetValue("hearthSouthCardinalWestBishopObserved") === "true"
    );

    state.labWestObserved = observed;
    state.labWestAuthoritySource = found.name;
    state.labWestContract = contract || "";
    state.labWestReceipt = receiptName || "";
    state.labWestContractRecognized = ACCEPTED_LABWEST_CONTRACTS.includes(contract);
    state.labWestV48HierarchyRecognized = contract === LABWEST_V4_8_CONTRACT || receiptName === LABWEST_V4_8_RECEIPT;
    state.labWestV47BishopChordRecognized = contract === LABWEST_V4_7_CONTRACT || receiptName === LABWEST_V4_7_RECEIPT;
    state.labWestBridgeStatus = observed
      ? state.labWestContractRecognized
        ? "LABWEST_CURRENT_OR_LINEAGE_RECOGNIZED"
        : "LABWEST_LANGUAGE_OBSERVED"
      : "LABWEST_NOT_OBSERVED";

    return {
      observed,
      authoritySource: found.name,
      contract: state.labWestContract,
      receipt: state.labWestReceipt,
      contractRecognized: state.labWestContractRecognized,
      v48HierarchyRecognized: state.labWestV48HierarchyRecognized,
      v47BishopChordRecognized: state.labWestV47BishopChordRecognized,
      bridgeStatus: state.labWestBridgeStatus,
      receiptBody: clonePlain(receipt)
    };
  }

  function readQueenProfile() {
    const found = firstAuthority(queenAliases());
    const receipt = readReceipt(found.authority) || {};

    const contract =
      contractOf(receipt) ||
      (found.authority && contractOf(found.authority)) ||
      datasetValue("hearthControlsInternalImplementationContract") ||
      datasetValue("hearthControlsContract") ||
      datasetValue("hearthControlFileContract") ||
      datasetValue("hearthSouthControlFileContract");

    const receiptName =
      receiptOf(receipt) ||
      (found.authority && receiptOf(found.authority)) ||
      datasetValue("hearthControlsInternalImplementationReceipt") ||
      datasetValue("hearthControlsReceipt") ||
      datasetValue("hearthControlFileReceipt") ||
      datasetValue("hearthSouthControlFileReceipt");

    const observed = Boolean(
      found.authority ||
      contract ||
      datasetValue("hearthControlsLoaded") === "true" ||
      datasetValue("hearthSouthControlFilePresent") === "true"
    );

    state.queenObserved = observed;
    state.queenAuthoritySource = found.name;
    state.queenContract = contract || "";
    state.queenReceipt = receiptName || "";
    state.queenContractRecognized = ACCEPTED_QUEEN_CONTRACTS.includes(contract);
    state.queenHandshakeAccepted = Boolean(
      safeBool(receipt.handshakeAccepted, false) ||
      safeBool(receipt.controlHandshakeAccepted, false) ||
      safeBool(receipt.routeConductorControlHandshakeAccepted, false) ||
      safeBool(receipt.inputAdmissionOpen, false) ||
      datasetValue("hearthSouthControlHandshakeAcceptedByQueen") === "true" ||
      datasetValue("hearthControlHandshakeStatus") === "ACCEPTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE"
    );
    state.queenInputAdmissionOpen = Boolean(
      safeBool(receipt.inputAdmissionOpen, false) ||
      safeBool(receipt.inputBound, false) ||
      datasetValue("hearthPlanetaryViewInputStatus") === "PLANETARY_VIEW_INPUT_ADMITTED"
    );
    state.queenSuperconductorLanguageObserved = Boolean(
      safeBool(receipt.supportsQueenSuperconductorLanguage, false) ||
      safeBool(receipt.queenSuperconductorLanguageActive, false) ||
      datasetValue("hearthQueenSuperconductorLanguageActive") === "true" ||
      datasetValue("hearthSouthQueenSuperconductorLanguageActive") === "true" ||
      datasetValue("hearthControlsLabWestSuperconductorStatus") !== ""
    );

    state.queenBridgeStatus = observed
      ? state.queenContractRecognized
        ? "QUEEN_CURRENT_OR_LINEAGE_RECOGNIZED"
        : "QUEEN_OBSERVED_UNRECOGNIZED_CONTRACT"
      : "QUEEN_NOT_OBSERVED";

    return {
      observed,
      authoritySource: found.name,
      contract: state.queenContract,
      receipt: state.queenReceipt,
      contractRecognized: state.queenContractRecognized,
      handshakeAccepted: state.queenHandshakeAccepted,
      inputAdmissionOpen: state.queenInputAdmissionOpen,
      queenSuperconductorLanguageObserved: state.queenSuperconductorLanguageObserved,
      bridgeStatus: state.queenBridgeStatus,
      receiptBody: clonePlain(receipt)
    };
  }

  function normalizeFingerKey(value) {
    const raw = safeString(value).trim().toLowerCase();

    if (!raw) return "";
    if (FINGER_FILES[raw]) return raw;
    if (raw.includes("boundary") || raw.includes("shape")) return "boundary";
    if (raw.includes("mass") || raw.includes("body")) return "mass";
    if (raw.includes("inspect") || raw.includes("pointer")) return "inspect";
    if (raw.includes("surface")) return "surface";
    if (raw === "light" || raw.includes("base-light")) return "light";
    if (raw.includes("landform") || raw.includes("landmass")) return "landform";
    if (raw.includes("elevation") || raw.includes("relief") || raw.includes("height")) return "elevation";
    if (raw.includes("material")) return "material";
    if (raw.includes("hydrology") || raw.includes("water")) return "hydrology";
    if (raw.includes("atmosphere") || raw.includes("air")) return "atmosphere";
    if (raw.includes("lighting") || raw.includes("shadow")) return "lighting";
    if (raw.includes("composite") || raw.includes("carrier")) return "composite";

    return raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function createFingerTrack(key) {
    const normalizedKey = normalizeFingerKey(key);

    return {
      key: normalizedKey,
      file: FINGER_FILES[normalizedKey] || "",
      declared: true,
      authorityObserved: false,
      apiReady: false,
      expressionPacketReceived: false,
      receiptPacketReceived: false,
      trackReady: false,
      hardFail: false,
      status: "DECLARED_WAITING_FILE",
      firstGap: "WAITING_DOWNSTREAM_FINGER_FILE",
      rank: normalizedKey === POINTER_FINGER_KEY ? "POINTER_FINGER_BISHOP" : "DOWNSTREAM_FINGER_BISHOP",
      cardinalAddress: normalizedKey === POINTER_FINGER_KEY ? "INSPECT_POINTER" : "FINGER_TRACK",
      ownsTruth: false,
      ownedByCanvasHub: false,
      canvasHubManagesTrack: true,
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

  function fingerAuthorityAliases(key) {
    const normalizedKey = normalizeFingerKey(key);
    const camel = normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1);
    const upper = normalizedKey.toUpperCase();

    const names = [
      `HEARTH_CANVAS_FINGER_${upper}`,
      `HEARTH_CANVAS_${upper}_FINGER`,
      `HEARTH.canvasFinger${camel}`,
      `HEARTH.canvas${camel}Finger`,
      `DEXTER_LAB.hearthCanvasFinger${camel}`,
      `DEXTER_LAB.hearthCanvas${camel}Finger`
    ];

    if (normalizedKey === POINTER_FINGER_KEY) {
      names.unshift(
        "HEARTH_POINTER_FINGER",
        "HEARTH_CANVAS_POINTER_FINGER",
        "HEARTH_CANVAS_FINGER_INSPECT",
        "HEARTH.canvasPointerFinger",
        "HEARTH.canvasFingerInspect",
        "DEXTER_LAB.hearthCanvasPointerFinger",
        "DEXTER_LAB.hearthCanvasFingerInspect"
      );
    }

    return names;
  }

  function readFingerAuthority(key) {
    const names = fingerAuthorityAliases(key);

    for (const name of names) {
      const authority = readPath(name);
      if (authority) return { name, authority };
    }

    return { name: "NONE", authority: null };
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

    return normalizeFingerKey(packet.role || packet.sourceRole || packet.childRole || packet.packetType || "");
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
      safeString(packet.proofScope).toUpperCase().includes("FINAL") ||
      safeString(packet.scope).toUpperCase().includes("FINAL") ||
      safeString(packet.claimScope).toUpperCase().includes("FINAL")
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
      packet.inspectPacket ||
      packet.pointerPacket ||
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
      safeString(packet.packetLane).toUpperCase().includes("EXPRESSION") ||
      safeString(packet.packetType).toUpperCase().includes("EXPRESSION")
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
      safeString(packet.packetLane).toUpperCase().includes("RECEIPT") ||
      safeString(packet.packetType).toUpperCase().includes("RECEIPT")
    );
  }

  function scanFinger(key) {
    initializeFingerRegistry();

    const normalizedKey = normalizeFingerKey(key);
    const track = state.fingerRegistry[normalizedKey] || createFingerTrack(normalizedKey);
    const source = readFingerAuthority(normalizedKey);
    const authority = source.authority;
    const receipt = readReceipt(authority);

    const authorityObserved = Boolean(authority);
    const apiReady = Boolean(
      authority &&
      (
        isFunction(authority.receiveHubPacket) ||
        isFunction(authority.receiveFingerPacket) ||
        isFunction(authority.receiveCanvasHubPacket) ||
        isFunction(authority.read) ||
        isFunction(authority.getReceipt) ||
        isFunction(authority.getReceiptLight) ||
        isFunction(authority.draw) ||
        isFunction(authority.render) ||
        isFunction(authority.drawFrame) ||
        isFunction(authority.drawToCanvas)
      )
    ) || safeBool(receipt && (receipt.apiReady || receipt.fingerApiReady || receipt.canvasFingerApiReady), false);

    const hardFail = Boolean(
      safeBool(receipt && (receipt.hardFail || receipt.fingerHardFail || receipt.canvasFingerHardFail), false) ||
      hasFinalClaim(receipt)
    );

    const expressionPacketReceived = Boolean(track.expressionPacketReceived || packetHasExpressionContent(receipt));
    const receiptPacketReceived = Boolean(track.receiptPacketReceived || packetHasReceiptContent(receipt));
    const trackReady = Boolean(apiReady || expressionPacketReceived || receiptPacketReceived || authorityObserved) && !hardFail;

    state.fingerRegistry[normalizedKey] = {
      ...track,
      authorityObserved,
      apiReady,
      expressionPacketReceived,
      receiptPacketReceived,
      trackReady,
      hardFail,
      status: hardFail ? "HARD_FAIL" : trackReady ? "TRACK_READY" : authorityObserved ? "AUTHORITY_OBSERVED" : "DECLARED_WAITING_FILE",
      lastAuthoritySourceName: source.name,
      lastReceiptPacket: receipt ? clonePlain(receipt) : track.lastReceiptPacket || null,
      firstGap: hardFail ? "FINGER_HARD_FAIL" : trackReady ? "NONE" : "WAITING_DOWNSTREAM_FINGER_FILE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    if (normalizedKey === POINTER_FINGER_KEY) {
      state.pointerFingerBishopObserved = authorityObserved || trackReady;
      state.pointerFingerBishopStatus = state.pointerFingerBishopObserved
        ? "INSPECT_POINTER_FINGER_BISHOP_OBSERVED"
        : "POINTER_FINGER_BISHOP_NOT_OBSERVED";
    }

    if (normalizedKey === LOWER_SURFACE_FINGER_KEY) {
      state.lowerSurfaceFingerObserved = authorityObserved || trackReady;
      state.lowerSurfaceFingerStatus = state.lowerSurfaceFingerObserved
        ? "LOWER_SURFACE_FINGER_OBSERVED"
        : "LOWER_SURFACE_FINGER_NOT_OBSERVED";
    }

    return clonePlain(state.fingerRegistry[normalizedKey]);
  }

  function recomputeFingerAggregation() {
    initializeFingerRegistry();

    const tracks = FINGER_SEQUENCE.map((key) => state.fingerRegistry[key]).filter(Boolean);

    state.fingerAuthorityObservedCount = tracks.filter((track) => track.authorityObserved).length;
    state.fingerApiReadyCount = tracks.filter((track) => track.apiReady).length;
    state.fingerExpressionPacketCount = tracks.filter((track) => track.expressionPacketReceived).length;
    state.fingerReceiptPacketCount = tracks.filter((track) => track.receiptPacketReceived).length;
    state.fingerTrackReadyCount = tracks.filter((track) => track.trackReady).length;
    state.fingerHardFailCount = tracks.filter((track) => track.hardFail).length;

    return getFingerRegistry();
  }

  function scanAllFingers() {
    initializeFingerRegistry();

    for (const key of FINGER_SEQUENCE) scanFinger(key);

    recomputeFingerAggregation();
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

    state.fingerRegistry[key] = {
      ...track,
      lastPacket: clonePlain(packet),
      authorityObserved: true,
      apiReady: true,
      hardFail: Boolean(track.hardFail || packet.hardFail === true || packet.fingerHardFail === true || finalClaimBlocked),
      expressionPacketReceived: Boolean(track.expressionPacketReceived || expressionContent),
      receiptPacketReceived: Boolean(track.receiptPacketReceived || receiptContent),
      lastExpressionPacket: expressionContent ? clonePlain(packet) : track.lastExpressionPacket || null,
      lastReceiptPacket: receiptContent ? clonePlain(packet) : track.lastReceiptPacket || null,
      trackReady: Boolean(!finalClaimBlocked && (expressionContent || receiptContent || track.trackReady)),
      status: finalClaimBlocked ? "HARD_FAIL" : "TRACK_READY",
      firstGap: finalClaimBlocked ? "FINGER_FALSE_FINAL_CLAIM_BLOCKED" : "NONE",
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    recomputeFingerAggregation();
    refreshBridgeProfiles();
    scheduleDeferredRender("finger-packet-received");
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

  function findDrawMethod(target, methods) {
    if (!target || !isObject(target)) return "NONE";

    for (const method of methods) {
      if (isFunction(target[method])) return method;
    }

    return "NONE";
  }

  function detectComposite() {
    const found = firstAuthority(compositeAliases());
    const receipt = readReceipt(found.authority);
    const method = findDrawMethod(found.authority, [
      "drawToCanvas",
      "drawHearthCompositeFrame",
      "drawCompositeFrame",
      "drawFrame",
      "renderComposite",
      "render",
      "draw",
      "compose"
    ]);

    state.compositeDetected = Boolean(found.authority);
    state.compositeContract = contractOf(receipt || found.authority);
    state.compositeReceipt = receiptOf(receipt || found.authority);
    state.compositeDrawMethodAvailable = Boolean(found.authority && method !== "NONE");
    state.compositeDrawMethod = method;
    state.compositeSourceName = found.name;

    if (state.fingerRegistry.composite) {
      state.fingerRegistry.composite.authorityObserved = Boolean(found.authority);
      state.fingerRegistry.composite.apiReady = Boolean(found.authority && method !== "NONE");
      state.fingerRegistry.composite.trackReady = Boolean(found.authority);
      state.fingerRegistry.composite.status = found.authority ? "TRACK_READY" : "DECLARED_WAITING_FILE";
      state.fingerRegistry.composite.firstGap = found.authority ? "NONE" : "WAITING_DOWNSTREAM_FINGER_FILE";
    }

    return { api: found.authority, receipt, method, sourceName: found.name };
  }

  function detectHexFourPairAuthority() {
    const found = firstAuthority(hexFourPairAliases());
    const receipt = readReceipt(found.authority);
    const actualContract = contractOf(receipt || found.authority);
    let wideProbeAvailable = false;
    let everyPixelHasFourPairSet = false;
    let bodyBound = false;
    let allowedToFloat = true;
    let validationReceipt = null;
    let validationError = "";

    try {
      if (found.authority && isFunction(found.authority.sample)) {
        const sample = found.authority.sample({ u: 0.5, v: 0.5 });
        everyPixelHasFourPairSet = Boolean(sample && sample.everyPixelHasFourPairSet === true);
        bodyBound = Boolean(sample && (sample.bodyBound === true || sample.surfaceBound === true));
        allowedToFloat = sample ? sample.allowedToFloat !== false : true;
      }

      if (found.authority && isFunction(found.authority.wideProbe)) {
        wideProbeAvailable = true;
        validationReceipt = found.authority.wideProbe({ rows: 5, columns: 9 });

        if (validationReceipt && validationReceipt.everyPixelHasFourPairSet === true) everyPixelHasFourPairSet = true;

        if (validationReceipt && validationReceipt.failedCount === 0) {
          bodyBound = true;
          allowedToFloat = false;
        }
      }
    } catch (error) {
      validationError = error && error.message ? String(error.message) : String(error);
      recordError("HEX_FOUR_PAIR_VALIDATION_FAILED", error);
    }

    state.hexFourPairAuthorityDetected = Boolean(found.authority);
    state.hexFourPairAuthorityContract = actualContract;
    state.hexFourPairAuthorityContractRecognized = actualContract === HEX_FOUR_PAIR_CONTRACT;
    state.hexFourPairWideProbeAvailable = wideProbeAvailable;
    state.hexFourPairEveryPixelHasFourPairSet = everyPixelHasFourPairSet;
    state.hexFourPairBodyBound = bodyBound;
    state.hexFourPairAllowedToFloat = allowedToFloat;
    state.hexFourPairValidationReceipt = validationReceipt ? clonePlain(validationReceipt) : null;
    state.hexFourPairValidationError = validationError;
    state.hexFourPairSourceName = found.name;

    return { api: found.authority, receipt, sourceName: found.name };
  }

  function detectHexSurfaceRenderer() {
    const found = firstAuthority(hexSurfaceAliases());
    const receipt = readReceipt(found.authority);
    const actualContract = contractOf(receipt || found.authority);
    const method = findDrawMethod(found.authority, [
      "drawHearthHexSurfaceFrame",
      "drawFrame",
      "render",
      "renderFrame",
      "draw"
    ]);

    state.hexSurfaceRendererDetected = Boolean(found.authority);
    state.hexSurfaceRendererContract = actualContract;
    state.hexSurfaceRendererContractRecognized = ACCEPTED_HEX_SURFACE_CONTRACTS.includes(actualContract);
    state.hexSurfaceRendererV2Recognized = actualContract === HEX_SURFACE_V2_CONTRACT;
    state.hexSurfaceRendererV1LineageAccepted = actualContract === HEX_SURFACE_V1_CONTRACT;
    state.hexSurfaceRendererDrawMethodAvailable = Boolean(found.authority && method !== "NONE");
    state.hexSurfaceRendererDrawMethod = method;
    state.hexSurfaceRendererSourceName = found.name;

    return { api: found.authority, receipt, method, sourceName: found.name };
  }

  function readHierarchyContext() {
    const routeConductor = readRouteConductorProfile();
    const labWest = readLabWestProfile();
    const queen = readQueenProfile();
    scanAllFingers();

    const context = {
      packetType: "HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_CONTEXT_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      hierarchyRole: HIERARCHY_ROLE,
      bridgeBetweenBridgesActive: true,
      bridgeBetweenControlsAndQueen: true,
      bridgeBetweenWestAndLab: true,
      bridgeBetweenDiagnosticsAndCanvas: true,
      bridgeBetweenPointerFingerAndSurface: true,

      routeConductor,
      labWest,
      queen,

      pointerFingerBishop: {
        key: POINTER_FINGER_KEY,
        file: POINTER_FINGER_FILE,
        observed: state.pointerFingerBishopObserved,
        status: state.pointerFingerBishopStatus,
        track: clonePlain(state.fingerRegistry[POINTER_FINGER_KEY] || createFingerTrack(POINTER_FINGER_KEY))
      },

      lowerSurfaceFinger: {
        key: LOWER_SURFACE_FINGER_KEY,
        file: LOWER_SURFACE_FINGER_FILE,
        observed: state.lowerSurfaceFingerObserved,
        status: state.lowerSurfaceFingerStatus,
        track: clonePlain(state.fingerRegistry[LOWER_SURFACE_FINGER_KEY] || createFingerTrack(LOWER_SURFACE_FINGER_KEY))
      },

      canvasOwnsReceiverOutputCarrier: true,
      canvasOwnsViewProjectionApplication: true,
      canvasOwnsCanvasRedrawFromViewState: true,
      canvasOwnsInputAdmission: false,
      canvasOwnsRouteConductorHandshakeTruth: false,
      canvasOwnsLabWestAdmissibilityTruth: false,
      canvasOwnsQueenTruth: false,
      canvasOwnsDiagnosticCaseSelection: false,
      canvasOwnsFingerTruth: false,
      canvasOwnsPointerTruth: false,
      canvasOwnsPlanetTruth: false,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.hierarchyContextPacket = clonePlain(context);
    return context;
  }

  function refreshBridgeProfiles() {
    readRouteConductorProfile();
    readLabWestProfile();
    readQueenProfile();
    scanAllFingers();
    return readHierarchyContext();
  }

  function choosePixelSize(container) {
    let cssWidth = 720;

    if (container && isFunction(container.getBoundingClientRect)) {
      try {
        const rect = container.getBoundingClientRect();
        if (rect && rect.width > 0) cssWidth = rect.width;
      } catch (_error) {}
    }

    if ((!cssWidth || cssWidth < 260) && root.innerWidth) {
      cssWidth = Math.min(800, Math.max(320, root.innerWidth * 0.9));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1120, Math.round(cssWidth * ratio)));
  }

  function findCanvasElement(mount, stage) {
    if (!doc) return null;

    const direct = doc.getElementById(state.canvasId);
    if (direct && direct.tagName && direct.tagName.toLowerCase() === "canvas") return direct;

    const selectors = [
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-base-globe-canvas='true']",
      "canvas[data-hearth-planet-canvas='true']",
      "canvas"
    ];

    for (const selector of selectors) {
      try {
        const found =
          (mount && mount.querySelector ? mount.querySelector(selector) : null) ||
          (stage && stage.querySelector ? stage.querySelector(selector) : null);

        if (found && found.tagName && found.tagName.toLowerCase() === "canvas") return found;
      } catch (_error) {}
    }

    return null;
  }

  function sizeCanvas(canvas, mount) {
    const px = choosePixelSize(mount);

    if (canvas.width !== px) canvas.width = px;
    if (canvas.height !== px) canvas.height = px;

    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.maxWidth = "min(88vw, 760px)";
    canvas.style.height = "auto";
    canvas.style.aspectRatio = "1 / 1";
    canvas.style.margin = "0 auto";
    canvas.style.borderRadius = "50%";
    canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(5,18,42,.92), rgba(0,0,0,.98))";
    canvas.style.boxSizing = "border-box";
    canvas.style.transformOrigin = "50% 50%";
    canvas.style.willChange = "transform";
    canvas.style.touchAction = "none";
    canvas.style.contain = "layout paint style";
    canvas.style.backfaceVisibility = "hidden";
  }

  function applyCanvasViewTransform(reason = "view-transform") {
    const canvas = state.canvasElement;
    if (!canvas || !canvas.style) return false;

    state.fastTransformAttemptCount += 1;

    const yaw = safeNumber(view.yaw, 0);
    const zoom = clamp(safeNumber(view.zoom, 1), view.minZoom, view.maxZoom);
    const pitch = clamp(safeNumber(view.pitch, 0), view.minPitch, view.maxPitch);
    const shift = Math.round(pitch * 18);

    const css = `translate3d(0, ${shift}px, 0) rotate(${yaw}rad) scale(${zoom})`;

    canvas.style.transform = css;
    canvas.dataset.hearthViewYaw = String(view.yaw);
    canvas.dataset.hearthViewPitch = String(view.pitch);
    canvas.dataset.hearthViewZoom = String(view.zoom);
    canvas.dataset.hearthViewPhase = String(view.phase);
    canvas.dataset.hearthViewTransformApplied = "true";
    canvas.dataset.hearthFastViewTransformActive = "true";
    canvas.dataset.hearthDeferredRendererActive = "true";
    canvas.dataset.hearthCanvasBridgeBetweenBridges = "true";
    canvas.dataset.hearthCanvasDownstreamBishop = "true";
    canvas.dataset.hearthCanvasCardinalAddress = HIERARCHY_ROLE.cardinalAddress;
    canvas.dataset.hearthCanvasPointerFingerKey = POINTER_FINGER_KEY;

    state.viewTransformApplied = true;
    state.viewTransformCss = css;
    state.fastTransformAppliedCount += 1;
    state.fastTransformLastAppliedAt = nowIso();
    state.fastTransformLastReason = reason;
    view.lastAppliedAt = state.fastTransformLastAppliedAt;

    return true;
  }

  function scheduleFastTransform(reason = "fast-transform") {
    if (FAST_TRANSFORM_DELAY_MS === 0) {
      return applyCanvasViewTransform(reason);
    }

    if (transformTimer) return true;

    const runner = () => {
      transformTimer = 0;
      applyCanvasViewTransform(reason);
    };

    if (root.requestAnimationFrame) transformTimer = root.requestAnimationFrame(runner);
    else transformTimer = root.setTimeout(runner, FAST_TRANSFORM_DELAY_MS);

    return true;
  }

  function ensureCanvas() {
    state.canvasMountAttempted = true;

    if (!doc) {
      state.canvasMountFound = false;
      state.canvasElementFound = false;
      state.canvasDrawError = "DOCUMENT_NOT_AVAILABLE";
      return null;
    }

    const stageResult = firstElement(GLOBE_STAGE_SELECTORS);
    const mountResult = firstElement(CANVAS_MOUNT_SELECTORS);
    const stage = stageResult.element;
    const mount = mountResult.element || stage;

    state.globeStageFound = Boolean(stage);
    state.globeStageSelector = stageResult.selector;
    state.globeStageRectNonzero = rectNonzero(stage);

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;
    state.canvasMountRectNonzero = rectNonzero(mount);

    state.stageMountDomProofReady = Boolean(
      (state.globeStageFound && state.globeStageRectNonzero) ||
      (state.canvasMountFound && state.canvasMountRectNonzero)
    );
    state.domVisiblePlanetProofReady = state.stageMountDomProofReady;

    if (!mount) {
      state.canvasElementFound = false;
      state.firstFailedCoordinate = "CANVAS_MOUNT_NOT_FOUND";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_HEARTH_HTML_MOUNT";
      return null;
    }

    let canvas = findCanvasElement(mount, stage);

    if (canvas) {
      state.canvasReused = true;
      state.canvasCreated = false;
    } else {
      canvas = doc.createElement("canvas");
      canvas.id = state.canvasId;
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-hub", "true");
      canvas.setAttribute("data-contract", CONTRACT);
      canvas.setAttribute("aria-label", "Hearth visible planet canvas");

      if (mount.firstChild) mount.insertBefore(canvas, mount.firstChild);
      else mount.appendChild(canvas);

      state.canvasCreated = true;
      state.canvasReused = false;
    }

    sizeCanvas(canvas, mount);

    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthCanvasContract = CONTRACT;
    canvas.dataset.hearthCanvasReceipt = RECEIPT;
    canvas.dataset.hearthCanvasInternalImplementationContract = INTERNAL_IMPLEMENTATION_CONTRACT;
    canvas.dataset.hearthCanvasInternalImplementationReceipt = INTERNAL_IMPLEMENTATION_RECEIPT;
    canvas.dataset.hearthCanvasPreviousInternalImplementationContract = PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT;
    canvas.dataset.hearthCanvasPreviousContract = PREVIOUS_CONTRACT;
    canvas.dataset.hearthCanvasBaselineContract = BASELINE_CONTRACT;
    canvas.dataset.hearthCanvasBridgeBetweenBridges = "true";
    canvas.dataset.hearthCanvasDownstreamBishop = "true";
    canvas.dataset.hearthCanvasHierarchyRank = HIERARCHY_ROLE.rank;
    canvas.dataset.hearthCanvasCardinalAddress = HIERARCHY_ROLE.cardinalAddress;
    canvas.dataset.hearthCanvasOutputCarrierBishop = "true";
    canvas.dataset.hearthCanvasPointerFingerKey = POINTER_FINGER_KEY;
    canvas.dataset.hearthCanvasPointerFingerFile = POINTER_FINGER_FILE;
    canvas.dataset.hearthCanvasLowerSurfaceFingerKey = LOWER_SURFACE_FINGER_KEY;
    canvas.dataset.hearthCanvasLowerSurfaceFingerFile = LOWER_SURFACE_FINGER_FILE;
    canvas.dataset.hearthPlanetaryViewControlReceiverActive = "true";
    canvas.dataset.hearthCompositeFirstVisiblePathActive = "true";
    canvas.dataset.hearthFastViewTransformActive = "true";
    canvas.dataset.hearthDeferredRendererActive = "true";
    canvas.dataset.hearthHexSurfaceBootBlockingRejected = "true";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";

    const ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true, willReadFrequently: false }) : null;

    state.canvasElementFound = true;
    state.canvasRectNonzero = rectNonzero(canvas) || Boolean(canvas.width > 0 && canvas.height > 0);
    state.canvasAttributeWidth = safeNumber(canvas.width, 0);
    state.canvasAttributeHeight = safeNumber(canvas.height, 0);
    state.canvasContext2dReady = Boolean(ctx);
    state.canvasElement = canvas;
    state.canvasContext = ctx;
    state.canvasMountElement = mount;
    state.globeStageElement = stage;

    applyCanvasViewTransform("ensure-canvas");

    return { canvas, ctx, mount, stage };
  }

  function canvasHasVisiblePixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) return false;

    try {
      const w = canvas.width;
      const h = canvas.height;
      const sampleSize = Math.max(1, Math.min(18, Math.floor(Math.min(w, h) / 42)));
      const x = Math.max(0, Math.floor(w / 2 - sampleSize / 2));
      const y = Math.max(0, Math.floor(h / 2 - sampleSize / 2));
      const data = ctx.getImageData(x, y, sampleSize, sampleSize).data;

      for (let index = 0; index < data.length; index += 4) {
        if (data[index + 3] > 0 && (data[index] > 3 || data[index + 1] > 3 || data[index + 2] > 3)) return true;
      }
    } catch (_error) {
      return true;
    }

    return false;
  }

  function drawHoldingField(canvas, ctx, reason) {
    if (!canvas || !ctx) return false;

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 720;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.38;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.62);
      bg.addColorStop(0, "rgba(18,42,74,0.82)");
      bg.addColorStop(0.58, "rgba(7,12,28,0.96)");
      bg.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const spin = safeNumber(view.phase, 0) + safeNumber(view.yaw, 0);
      const lightX = cx - Math.cos(spin) * r * 0.28;
      const lightY = cy - r * 0.33 + Math.sin(safeNumber(view.pitch, 0)) * r * 0.08;

      const globe = ctx.createRadialGradient(lightX, lightY, r * 0.05, cx, cy, r);
      globe.addColorStop(0, "rgba(108,192,244,0.94)");
      globe.addColorStop(0.34, "rgba(28,86,144,0.90)");
      globe.addColorStop(0.76, "rgba(7,28,76,0.98)");
      globe.addColorStop(1, "rgba(1,6,24,1)");

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = globe;
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.985, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = "rgba(186,226,255,0.18)";
      ctx.lineWidth = Math.max(1, r * 0.006);

      for (let i = -3; i <= 3; i += 1) {
        const y = cy + (i / 4) * r * 0.76 + Math.sin(spin + i) * r * 0.025;
        ctx.beginPath();
        ctx.ellipse(cx, y, r * 0.92, r * 0.13, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 7; i += 1) {
        const x = cx + Math.sin(spin + i) * r * 0.72;
        ctx.beginPath();
        ctx.ellipse(x, cy, r * 0.14, r * 0.94, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      ctx.strokeStyle = "rgba(186,226,255,0.56)";
      ctx.lineWidth = Math.max(1, r * 0.012);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.62)";
      ctx.font = `${Math.max(11, Math.floor(w / 58))}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("Hearth Canvas bridge field", cx, h - Math.max(22, h * 0.055));

      if (reason) {
        ctx.fillStyle = "rgba(255,255,255,0.42)";
        ctx.font = `${Math.max(10, Math.floor(w / 72))}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
        ctx.fillText(String(reason).slice(0, 78), cx, h - Math.max(10, h * 0.028));
      }

      state.holdingFieldDrawComplete = true;
      state.holdingFieldVisible = true;
      state.canvasDrawComplete = true;
      state.visiblePlanetProofReady = true;
      state.renderedPlanetProofReady = true;
      state.visiblePlanetProofSource = "SAFE_BRIDGE_HOLDING_FIELD";
      state.visiblePlanetProofReason = "SAFE_BRIDGE_HOLDING_FIELD_DRAW_COMPLETE";
      state.f13CanvasEvidenceDegraded = true;
      state.f13CanvasEvidenceComplete = true;
      state.f13CanvasEvidenceStrict = false;
      state.f13StrictEvidenceGap = "SAFE_BRIDGE_HOLDING_FIELD_VISIBLE_COMPOSITE_PENDING";
      state.postgameStatus = "CANVAS_BRIDGE_FIELD_VISIBLE_COMPOSITE_PENDING";
      applyCanvasViewTransform("holding-field");
      return true;
    } catch (error) {
      state.holdingFieldDrawComplete = false;
      recordError("HOLDING_FIELD_DRAW_FAILED", error);
      return false;
    }
  }

  function buildDrawState(canvas, ctx, mount, stage, mode) {
    return {
      canvas,
      ctx,
      context: ctx,
      mount,
      stage,
      mode,
      source: "Canvas Hub bridge-between-bridges receiver/output bishop",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      route: ROUTE,
      file: FILE,
      hierarchyContext: readHierarchyContext(),
      viewState: clonePlain(view),
      yaw: view.yaw,
      pitch: view.pitch,
      zoom: view.zoom,
      phase: view.phase,
      fastViewTransformActive: true,
      deferredRendererActive: true,
      compositeFirstVisiblePathActive: true,
      hexSurfaceDeferredPathActive: true,
      hexFourPairAuthority: detectHexFourPairAuthority().api,
      hexSurfaceRenderer: detectHexSurfaceRenderer().api,
      canvasHub: api,
      getReceipt: getReceiptLight,
      pointerFingerKey: POINTER_FINGER_KEY,
      pointerFingerFile: POINTER_FINGER_FILE,
      lowerSurfaceFingerKey: LOWER_SURFACE_FINGER_KEY,
      lowerSurfaceFingerFile: LOWER_SURFACE_FINGER_FILE,
      ...FINAL_FALSE
    };
  }

  function attemptCompositeDraw(canvas, ctx, mount, stage) {
    const detected = detectComposite();
    state.compositeDrawAttempted = Boolean(detected.api && detected.method !== "NONE");

    if (!detected.api || detected.method === "NONE") {
      state.compositeDrawComplete = false;
      state.compositeDrawError = detected.api ? "COMPOSITE_DRAW_METHOD_UNAVAILABLE" : "COMPOSITE_NOT_DETECTED";
      return false;
    }

    let result;

    if (detected.method === "drawToCanvas") {
      result = safeInvoke(detected.api, detected.method, [canvas, {
        source: "Canvas Hub bridge-between-bridges receiver/output bishop",
        contract: CONTRACT,
        receipt: RECEIPT,
        internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
        internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
        hierarchyContext: readHierarchyContext(),
        preferredVisibleExpression: true,
        compositeFirstVisiblePathActive: true,
        fastViewTransformActive: true,
        deferredRendererActive: true,
        viewState: clonePlain(view),
        pointerFingerKey: POINTER_FINGER_KEY,
        pointerFingerFile: POINTER_FINGER_FILE,
        finalVisualPassClaimed: false,
        visualPassClaimed: false,
        ...FINAL_FALSE
      }]);
    } else {
      const drawState = buildDrawState(canvas, ctx, mount, stage, "COMPOSITE");
      result = safeInvoke(detected.api, detected.method, [drawState, {
        source: "Canvas Hub bridge-between-bridges receiver/output bishop",
        contract: CONTRACT,
        receipt: RECEIPT,
        preferredVisibleExpression: true,
        compositeFirstVisiblePathActive: true,
        fastViewTransformActive: true,
        deferredRendererActive: true,
        viewState: clonePlain(view),
        finalVisualPassClaimed: false,
        visualPassClaimed: false,
        ...FINAL_FALSE
      }]);

      if (!result.ok) {
        result = safeInvoke(detected.api, detected.method, [ctx, {
          canvas,
          source: "Canvas Hub bridge-between-bridges receiver/output bishop",
          contract: CONTRACT,
          receipt: RECEIPT,
          viewState: clonePlain(view),
          ...FINAL_FALSE
        }]);
      }
    }

    if (!result.ok) {
      state.compositeDrawComplete = false;
      state.compositeDrawError = result.error;
      recordError("COMPOSITE_DRAW_FAILED", result.error, { method: detected.method });
      return false;
    }

    const receipt = isObject(result.value) ? result.value : readReceipt(detected.api);
    const explicitFail = isObject(receipt) && (
      receipt.drawComplete === false ||
      receipt.drawn === false ||
      receipt.compositeDrawComplete === false ||
      receipt.visiblePlanetProofReady === false ||
      receipt.hardFail === true
    );

    const pixelEvidence = canvasHasVisiblePixels(canvas, ctx);

    state.compositeDrawReceipt = receipt ? clonePlain(receipt) : null;
    state.compositeDrawComplete = Boolean(!explicitFail && (pixelEvidence || result.value !== false));
    state.compositeDrawError = state.compositeDrawComplete ? "" : "COMPOSITE_DRAW_DID_NOT_PRODUCE_VISIBLE_PIXEL_EVIDENCE";

    if (state.compositeDrawComplete) {
      state.holdingFieldVisible = false;
      state.visiblePlanetProofReady = true;
      state.renderedPlanetProofReady = true;
      state.visiblePlanetProofSource = detected.method === "drawToCanvas" ? "COMPOSITE_DRAW_TO_CANVAS" : "COMPOSITE";
      state.visiblePlanetProofReason = "COMPOSITE_FIRST_VISIBLE_PATH_DRAW_COMPLETE";
      state.canvasDrawComplete = true;
      state.hexSurfaceRendererSkippedBecauseCompositeReady = true;
      applyCanvasViewTransform("composite-draw-complete");
      return true;
    }

    return false;
  }

  function attemptHexSurfaceDraw(canvas, ctx, mount, stage, options = {}) {
    if (options.forceHex !== true && state.compositeDrawComplete === true) {
      state.hexSurfaceRendererSkippedBecauseCompositeReady = true;
      state.hexSurfaceRendererDeferred = true;
      state.hexSurfaceRendererLastDeferredAt = nowIso();
      return false;
    }

    detectHexFourPairAuthority();

    const detected = detectHexSurfaceRenderer();
    state.hexSurfaceRendererDrawAttempted = Boolean(detected.api && detected.method !== "NONE");

    if (!detected.api || detected.method === "NONE") {
      state.hexSurfaceRendererDrawComplete = false;
      state.hexSurfaceRendererDrawError = detected.api ? "HEX_SURFACE_RENDERER_DRAW_METHOD_UNAVAILABLE" : "HEX_SURFACE_RENDERER_NOT_DETECTED";
      return false;
    }

    if (!state.hexSurfaceRendererContractRecognized) {
      state.hexSurfaceRendererDrawComplete = false;
      state.hexSurfaceRendererDrawError = `HEX_SURFACE_RENDERER_CONTRACT_NOT_RECOGNIZED:${state.hexSurfaceRendererContract || "UNKNOWN"}`;
      return false;
    }

    const target = {
      canvas,
      ctx,
      context: ctx,
      mount,
      stage,
      phase: view.phase,
      source: "Canvas Hub bridge-between-bridges receiver/output bishop",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      hierarchyContext: readHierarchyContext(),
      viewState: clonePlain(view),
      pointerFingerKey: POINTER_FINGER_KEY,
      pointerFingerFile: POINTER_FINGER_FILE,
      ...FINAL_FALSE
    };

    const result = safeInvoke(detected.api, detected.method, [target, {
      source: "Canvas Hub bridge-between-bridges receiver/output bishop",
      contract: CONTRACT,
      receipt: RECEIPT,
      supportVisibleExpression: true,
      hexSurfaceDeferredPathActive: true,
      viewState: clonePlain(view),
      fastViewTransformActive: true,
      deferredRendererActive: true,
      finalVisualPassClaimed: false,
      visualPassClaimed: false,
      ...FINAL_FALSE
    }]);

    if (!result.ok) {
      state.hexSurfaceRendererDrawComplete = false;
      state.hexSurfaceRendererDrawError = result.error;
      recordError("HEX_SURFACE_RENDERER_DRAW_FAILED", result.error, { method: detected.method });
      return false;
    }

    const receipt = isObject(result.value) ? result.value : readReceipt(detected.api);
    const explicitFail = isObject(receipt) && (
      receipt.ok === false ||
      receipt.drawComplete === false ||
      receipt.hexSurfaceRendererDrawComplete === false ||
      receipt.hardFail === true
    );

    const pixelEvidence = canvasHasVisiblePixels(canvas, ctx);

    state.hexSurfaceRendererFrameReceipt = receipt ? clonePlain(receipt) : null;
    state.hexSurfaceRendererDrawComplete = Boolean(!explicitFail && (pixelEvidence || result.value !== false));
    state.hexSurfaceRendererDrawError = state.hexSurfaceRendererDrawComplete ? "" : "HEX_SURFACE_RENDERER_DID_NOT_PRODUCE_VISIBLE_PIXEL_EVIDENCE";

    if (state.hexSurfaceRendererDrawComplete) {
      state.holdingFieldVisible = false;
      state.visiblePlanetProofReady = true;
      state.renderedPlanetProofReady = true;
      state.visiblePlanetProofSource = "HEX_SURFACE_RENDERER_DEFERRED";
      state.visiblePlanetProofReason = "HEX_SURFACE_RENDERER_DEFERRED_DRAW_COMPLETE";
      state.canvasDrawComplete = true;
      applyCanvasViewTransform("hex-surface-deferred-draw-complete");
      return true;
    }

    return false;
  }

  function refreshSupportDetections() {
    detectComposite();
    detectHexFourPairAuthority();
    detectHexSurfaceRenderer();
    scanAllFingers();
    readHierarchyContext();
    return true;
  }

  function resolveF13Gap() {
    let gap = "NONE_VISIBLE_EXPRESSION_READY";
    let status = "CANVAS_BRIDGE_VISIBLE_EXPRESSION_READY";

    if (!state.canvasMountFound) {
      gap = "CANVAS_MOUNT_NOT_FOUND";
      status = "CANVAS_BRIDGE_WAITING_HEARTH_CANVAS_MOUNT";
    } else if (!state.canvasElementFound) {
      gap = "CANVAS_ELEMENT_NOT_FOUND";
      status = "CANVAS_BRIDGE_WAITING_CANVAS_ELEMENT";
    } else if (!state.canvasContext2dReady) {
      gap = "CANVAS_2D_CONTEXT_NOT_READY";
      status = "CANVAS_BRIDGE_WAITING_2D_CONTEXT";
    } else if (!state.visiblePlanetProofReady) {
      gap = "VISIBLE_EXPRESSION_NOT_PROVEN";
      status = "CANVAS_BRIDGE_VISIBLE_EXPRESSION_NOT_PROVEN";
    } else if (state.visiblePlanetProofSource === "COMPOSITE_DRAW_TO_CANVAS") {
      gap = "NONE_COMPOSITE_DRAW_TO_CANVAS_VISIBLE_EXPRESSION_READY";
      status = "CANVAS_BRIDGE_COMPOSITE_DRAW_TO_CANVAS_VISIBLE_EXPRESSION_ACTIVE";
    } else if (state.visiblePlanetProofSource === "COMPOSITE") {
      gap = "NONE_COMPOSITE_VISIBLE_EXPRESSION_READY";
      status = "CANVAS_BRIDGE_COMPOSITE_VISIBLE_EXPRESSION_ACTIVE";
    } else if (state.visiblePlanetProofSource === "HEX_SURFACE_RENDERER_DEFERRED") {
      gap = "NONE_DEFERRED_HEX_SURFACE_VISIBLE_EXPRESSION_READY";
      status = "CANVAS_BRIDGE_DEFERRED_HEX_SURFACE_VISIBLE_EXPRESSION_ACTIVE";
    } else if (state.visiblePlanetProofSource === "SAFE_BRIDGE_HOLDING_FIELD") {
      gap = "SAFE_BRIDGE_HOLDING_FIELD_VISIBLE_COMPOSITE_PENDING";
      status = "CANVAS_BRIDGE_FIELD_VISIBLE_COMPOSITE_PENDING";
    }

    state.f13CanvasReadinessObserved = Boolean(state.canvasElementFound || state.canvasDrawAttempted);
    state.f13VisibleEvidenceAvailable = Boolean(state.visiblePlanetProofReady);
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = Boolean(state.visiblePlanetProofReady);
    state.f13CanvasEvidenceComplete = Boolean(state.visiblePlanetProofReady);
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = gap;
    state.f13StrictEvidenceRepairTarget =
      state.visiblePlanetProofSource === "SAFE_BRIDGE_HOLDING_FIELD"
        ? COMPOSITE_FILE
        : FILE;

    state.firstFailedCoordinate = gap;
    state.recommendedNextFile = state.visiblePlanetProofSource === "SAFE_BRIDGE_HOLDING_FIELD" ? COMPOSITE_FILE : FILE;
    state.recommendedNextRenewalTarget = state.recommendedNextFile;
    state.postgameStatus = status;

    if (state.visiblePlanetProofReady) {
      state.recommendedNextAction = "OBSERVE_ROUTE_CONDUCTOR_AND_QUEEN_BRIDGE_RECEIPTS";
    }

    return { gap, status };
  }

  function drawVisibleExpression(reason = "manual", options = {}) {
    state.canvasDrawAttempted = true;
    state.canvasDrawError = "";
    state.visiblePlanetProofReason = safeString(reason, "manual");

    const target = ensureCanvas();

    if (!target || !target.canvas || !target.ctx) {
      state.canvasDrawComplete = false;
      state.firstFailedCoordinate = target ? "CANVAS_CONTEXT_NOT_AVAILABLE" : "CANVAS_MOUNT_OR_ELEMENT_NOT_AVAILABLE";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "RENEW_CANVAS_BRIDGE_MOUNT_COORDINATION";
      resolveF13Gap();
      updateDataset();
      return false;
    }

    refreshSupportDetections();

    if (attemptCompositeDraw(target.canvas, target.ctx, target.mount, target.stage)) {
      resolveF13Gap();
      updateDataset();
      publishGlobals();
      record("CANVAS_BRIDGE_VISIBLE_EXPRESSION_COMPLETE", {
        source: state.visiblePlanetProofSource,
        reason,
        viewState: clonePlain(view),
        hierarchyRole: HIERARCHY_ROLE.title,
        compositeFirstVisiblePathActive: true,
        deferredRendererActive: true
      });
      return true;
    }

    if (!state.holdingFieldDrawComplete || options.redrawHoldingField === true) {
      drawHoldingField(target.canvas, target.ctx, "Composite pending; Hex deferred");
    }

    if (options.allowHeavyHex === true) {
      if (attemptHexSurfaceDraw(target.canvas, target.ctx, target.mount, target.stage, { forceHex: options.forceHex === true })) {
        resolveF13Gap();
        updateDataset();
        publishGlobals();
        record("CANVAS_BRIDGE_VISIBLE_EXPRESSION_COMPLETE", {
          source: "HEX_SURFACE_RENDERER_DEFERRED",
          reason,
          viewState: clonePlain(view),
          hierarchyRole: HIERARCHY_ROLE.title,
          compositeFirstVisiblePathActive: true,
          deferredRendererActive: true
        });
        return true;
      }
    } else {
      state.hexSurfaceRendererDeferred = true;
      state.hexSurfaceRendererLastDeferredAt = nowIso();
    }

    resolveF13Gap();
    updateDataset();
    publishGlobals();

    record("CANVAS_BRIDGE_VISIBLE_EXPRESSION_HELD_OR_DEGRADED", {
      source: state.visiblePlanetProofSource,
      reason,
      compositeDetected: state.compositeDetected,
      compositeDrawComplete: state.compositeDrawComplete,
      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,
      hexSurfaceDeferred: true
    });

    return state.visiblePlanetProofReady === true;
  }

  function clearDeferredRenderTimers() {
    if (deferredRenderTimer) {
      try {
        root.clearTimeout(deferredRenderTimer);
      } catch (_error) {}
      deferredRenderTimer = 0;
    }

    if (deferredRenderMaxTimer) {
      try {
        root.clearTimeout(deferredRenderMaxTimer);
      } catch (_error) {}
      deferredRenderMaxTimer = 0;
    }
  }

  function runDeferredRender(reason = "deferred-render") {
    clearDeferredRenderTimers();

    state.deferredRenderScheduled = false;
    state.viewRedrawScheduled = false;
    state.deferredRenderRunCount += 1;
    state.viewRedrawCount += 1;
    state.deferredRenderLastRunAt = nowIso();

    view.phase += 0.012;

    const ok = drawVisibleExpression(`deferred-render:${reason || state.deferredRenderReason}`, {
      redrawHoldingField: true,
      allowHeavyHex: false
    });

    state.deferredRenderLastResult = ok ? "DEFERRED_RENDER_COMPLETE_OR_DEGRADED" : "DEFERRED_RENDER_HELD";

    notifyRouteConductor();

    updateDataset();
    publishGlobals();

    return ok;
  }

  function scheduleDeferredRender(reason = "view-control-packet") {
    state.deferredRenderScheduled = true;
    state.viewRedrawScheduled = true;
    state.deferredRenderReason = safeString(reason, "view-control-packet");
    state.deferredRenderStartedAt = state.deferredRenderStartedAt || nowIso();

    if (deferredRenderTimer) {
      try {
        root.clearTimeout(deferredRenderTimer);
      } catch (_error) {}
      state.deferredRenderSkippedDuringInputCount += 1;
    }

    deferredRenderTimer = root.setTimeout(() => runDeferredRender(state.deferredRenderReason), DEFERRED_RENDER_DELAY_MS);

    if (!deferredRenderMaxTimer) {
      deferredRenderMaxTimer = root.setTimeout(() => runDeferredRender("max-wait"), DEFERRED_RENDER_MAX_WAIT_MS);
    }

    return true;
  }

  function scheduleDeferredHexRender(reason = "deferred-hex-render") {
    if (deferredHexTimer) return true;
    if (state.compositeDrawComplete === true) {
      state.hexSurfaceRendererSkippedBecauseCompositeReady = true;
      return false;
    }

    deferredHexTimer = root.setTimeout(() => {
      deferredHexTimer = 0;

      if (state.compositeDrawComplete === true) {
        state.hexSurfaceRendererSkippedBecauseCompositeReady = true;
        updateDataset();
        return;
      }

      drawVisibleExpression(`deferred-hex:${reason}`, {
        allowHeavyHex: true,
        forceHex: true
      });
    }, DEFERRED_HEX_MIN_DELAY_MS);

    state.hexSurfaceRendererDeferred = true;
    state.hexSurfaceRendererLastDeferredAt = nowIso();
    return true;
  }

  function forbiddenControlClaim(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.f13Claimed === true ||
      packet.f13CanvasClaimed === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21ClaimedByControls === true ||
      packet.f21ClaimedByRouteConductor === true ||
      packet.f21ClaimedByDiagnosticRail === true ||
      packet.readyTextAllowed === true ||
      packet.readyTextClaimed === true ||
      packet.completionLatched === true ||
      packet.finalCompletionLatched === true ||
      packet.visualPassClaimed === true ||
      packet.generatedImage === true ||
      packet.graphicBox === true ||
      packet.webGL === true ||
      packet.webgl === true
    );
  }

  function normalizeControlPacket(packet = {}) {
    const input = isObject(packet) ? packet : {};
    const viewState = isObject(input.viewState) ? input.viewState : null;

    if (isObject(input.queenBridge)) {
      state.queenObserved = true;
      state.queenBridgeStatus = "QUEEN_CONTEXT_OBSERVED_IN_CONTROL_PACKET";
      state.queenSuperconductorLanguageObserved = safeBool(
        input.queenBridge.queenSuperconductorLanguageActive,
        state.queenSuperconductorLanguageObserved
      );
    }

    return {
      packetType: safeString(input.packetType || input.type || "CANVAS_VIEW_CONTROL_PACKET"),
      sourceFile: safeString(input.sourceFile || input.controlsFile || CONTROL_FILE),
      contract: safeString(input.contract || ""),
      receipt: safeString(input.receipt || ""),
      inputType: safeString(input.inputType || "view-control"),
      deltaYaw: safeNumber(input.deltaYaw, 0),
      deltaPitch: safeNumber(input.deltaPitch, 0),
      deltaZoom: safeNumber(input.deltaZoom, 0),
      rawDx: input.rawDx !== undefined ? safeNumber(input.rawDx, 0) : undefined,
      rawDy: input.rawDy !== undefined ? safeNumber(input.rawDy, 0) : undefined,
      rawWheelY: input.rawWheelY !== undefined ? safeNumber(input.rawWheelY, 0) : undefined,
      key: safeString(input.key || ""),
      queenBridge: isObject(input.queenBridge) ? clonePlain(input.queenBridge) : null,
      hierarchyContext: isObject(input.hierarchyContext) ? clonePlain(input.hierarchyContext) : null,
      viewState: viewState ? {
        yaw: safeNumber(viewState.yaw, view.yaw),
        pitch: safeNumber(viewState.pitch, view.pitch),
        zoom: safeNumber(viewState.zoom, view.zoom),
        phase: safeNumber(viewState.phase, view.phase),
        minPitch: safeNumber(viewState.minPitch, view.minPitch),
        maxPitch: safeNumber(viewState.maxPitch, view.maxPitch),
        minZoom: safeNumber(viewState.minZoom, view.minZoom),
        maxZoom: safeNumber(viewState.maxZoom, view.maxZoom)
      } : null,
      receivedAt: nowIso(),
      raw: clonePlain(input),
      ...FINAL_FALSE
    };
  }

  function applyFastViewPacket(packet) {
    if (packet.viewState) {
      view.yaw = safeNumber(packet.viewState.yaw, view.yaw);
      view.pitch = clamp(safeNumber(packet.viewState.pitch, view.pitch), packet.viewState.minPitch, packet.viewState.maxPitch);
      view.zoom = clamp(safeNumber(packet.viewState.zoom, view.zoom), packet.viewState.minZoom, packet.viewState.maxZoom);
      view.phase = safeNumber(packet.viewState.phase, view.phase);
      view.minPitch = packet.viewState.minPitch;
      view.maxPitch = packet.viewState.maxPitch;
      view.minZoom = packet.viewState.minZoom;
      view.maxZoom = packet.viewState.maxZoom;
    } else {
      view.yaw += safeNumber(packet.deltaYaw, 0);
      view.pitch = clamp(view.pitch + safeNumber(packet.deltaPitch, 0), view.minPitch, view.maxPitch);
      view.zoom = clamp(view.zoom + safeNumber(packet.deltaZoom, 0), view.minZoom, view.maxZoom);
    }

    view.phase += Math.abs(packet.deltaYaw || 0) + Math.abs(packet.deltaPitch || 0) * 0.25;

    state.lastControlPacket = clonePlain(packet.raw || packet);
    state.lastViewPacket = clonePlain(packet);
    state.controlPacketLastSource = packet.sourceFile || CONTROL_FILE;
    state.controlPacketDeliveryStatus = "CONTROL_PACKET_ACCEPTED_FAST_TRANSFORM_APPLIED_HEX_REDRAW_DEFERRED";
    state.controlPacketDeliveryMethod = "canvas-bridge-between-bridges-fast-view-transform-deferred-render-receiver";
    state.controlPacketLastAcceptedAt = packet.receivedAt;
    state.viewMotionStatus = "FAST_VIEW_TRANSFORM_APPLIED";
    state.touchRuntimeStatus = packet.inputType.includes("pointer") || packet.inputType.includes("touch")
      ? "TOUCH_RUNTIME_FAST_TRANSFORM_APPLIED"
      : state.touchRuntimeStatus;
    state.dragRuntimeStatus = packet.inputType.includes("drag")
      ? "DRAG_RUNTIME_FAST_TRANSFORM_APPLIED"
      : state.dragRuntimeStatus;
    state.zoomRuntimeStatus = packet.inputType.includes("zoom") || packet.deltaZoom !== 0
      ? "ZOOM_RUNTIME_FAST_TRANSFORM_APPLIED"
      : state.zoomRuntimeStatus;
    state.keyboardRuntimeStatus = packet.inputType.includes("keyboard")
      ? "KEYBOARD_RUNTIME_FAST_TRANSFORM_APPLIED"
      : state.keyboardRuntimeStatus;
    state.planetaryViewInputStatus = "PLANETARY_VIEW_INPUT_FAST_TRANSFORM_APPLIED";

    ensureCanvas();
    scheduleFastTransform(`control-packet:${packet.inputType}`);
    publishViewGlobals();
    updateFastControlDataset();
    scheduleDeferredRender(`control-packet:${packet.inputType}`);

    return getControlViewReceipt();
  }

  function receivePlanetaryControlPacket(packet = {}) {
    state.controlPacketCount += 1;
    readQueenProfile();

    if (!isObject(packet)) {
      state.controlPacketRejectedCount += 1;
      state.controlPacketLastRejectedAt = nowIso();
      state.controlPacketLastRejectionReason = "CONTROL_PACKET_NOT_OBJECT";
      state.controlPacketDeliveryStatus = "CONTROL_PACKET_REJECTED";
      record("CANVAS_CONTROL_PACKET_REJECTED", { reason: state.controlPacketLastRejectionReason });
      updateFastControlDataset();
      return getControlViewReceipt();
    }

    if (forbiddenControlClaim(packet)) {
      state.controlPacketRejectedCount += 1;
      state.controlPacketLastRejectedAt = nowIso();
      state.controlPacketLastRejectionReason = "CONTROL_PACKET_CONTAINS_FORBIDDEN_CLAIM";
      state.controlPacketDeliveryStatus = "CONTROL_PACKET_REJECTED";
      record("CANVAS_CONTROL_PACKET_REJECTED", { reason: state.controlPacketLastRejectionReason });
      updateFastControlDataset();
      return getControlViewReceipt();
    }

    const normalized = normalizeControlPacket(packet);
    state.controlPacketAcceptedCount += 1;

    record("CANVAS_CONTROL_PACKET_ACCEPTED_FAST_PATH", {
      inputType: normalized.inputType,
      deltaYaw: normalized.deltaYaw,
      deltaPitch: normalized.deltaPitch,
      deltaZoom: normalized.deltaZoom,
      sourceFile: normalized.sourceFile,
      hierarchyRole: HIERARCHY_ROLE.title,
      expensiveRedrawDeferred: true,
      hexSurfaceDeferred: true
    });

    return applyFastViewPacket(normalized);
  }

  function consumePlanetaryControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function receiveControlsPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function consumeControlsPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function receiveControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function consumeControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function receiveViewControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }
  function consumeViewControlPacket(packet = {}) { return receivePlanetaryControlPacket(packet); }

  function receiveViewDelta(delta = {}) {
    return receivePlanetaryControlPacket({
      packetType: "DIRECT_VIEW_DELTA_PACKET",
      sourceFile: CONTROL_FILE,
      inputType: safeString(delta.inputType || "direct-view-delta"),
      deltaYaw: safeNumber(delta.deltaYaw, 0),
      deltaPitch: safeNumber(delta.deltaPitch, 0),
      deltaZoom: safeNumber(delta.deltaZoom, 0),
      viewState: isObject(delta.viewState) ? delta.viewState : undefined,
      hierarchyContext: readHierarchyContext(),
      ...FINAL_FALSE
    });
  }

  function applyViewDelta(delta = {}) {
    return receiveViewDelta(delta);
  }

  function setView(nextView = {}) {
    return receivePlanetaryControlPacket({
      packetType: "DIRECT_SET_VIEW_PACKET",
      sourceFile: CONTROL_FILE,
      inputType: "set-view",
      viewState: {
        yaw: safeNumber(nextView.yaw, view.yaw),
        pitch: safeNumber(nextView.pitch, view.pitch),
        zoom: safeNumber(nextView.zoom, view.zoom),
        phase: safeNumber(nextView.phase, view.phase),
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },
      hierarchyContext: readHierarchyContext(),
      ...FINAL_FALSE
    });
  }

  function updateView(nextView = {}) {
    return setView({ ...view, ...nextView });
  }

  function getViewState() {
    return clonePlain(view);
  }

  function publishViewGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const packet = {
      packetType: "HEARTH_CANVAS_VIEW_STATE_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      sourceFile: FILE,
      hierarchyContext: clonePlain(state.hierarchyContextPacket || readHierarchyContext()),
      fastViewTransformActive: true,
      deferredRendererActive: true,
      expensiveRedrawDetachedFromInputPacket: true,
      compositeFirstVisiblePathActive: true,
      hexSurfaceDeferredPathActive: true,
      bridgeBetweenBridgesActive: true,
      viewState: clonePlain(view),
      controlPacketCount: state.controlPacketCount,
      controlPacketAcceptedCount: state.controlPacketAcceptedCount,
      controlPacketDeliveryStatus: state.controlPacketDeliveryStatus,
      fastTransformAppliedCount: state.fastTransformAppliedCount,
      deferredRenderScheduled: state.deferredRenderScheduled,
      deferredRenderRunCount: state.deferredRenderRunCount,
      updatedAt: nowIso(),
      ...FINAL_FALSE
    };

    root.HEARTH_CANVAS_VIEW_STATE = clonePlain(packet);
    root.HEARTH_CANVAS_LAST_VIEW_PACKET = clonePlain(state.lastViewPacket || packet);
    hearth.canvasViewState = clonePlain(packet);
    hearth.canvasLastViewPacket = clonePlain(state.lastViewPacket || packet);
    lab.hearthCanvasViewState = clonePlain(packet);

    return packet;
  }

  function getControlViewReceipt() {
    return {
      packetType: "HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_RECEIPT",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      file: FILE,
      controlFile: CONTROL_FILE,

      bridgeBetweenBridgesActive: true,
      hierarchyRole: HIERARCHY_ROLE.rank,
      cardinalAddress: HIERARCHY_ROLE.cardinalAddress,
      title: HIERARCHY_ROLE.title,
      hierarchyContext: clonePlain(state.hierarchyContextPacket || readHierarchyContext()),

      planetaryViewControlReceiverActive: true,
      viewControlPacketReceiverReady: true,
      fastViewTransformActive: true,
      deferredRendererActive: true,
      expensiveRedrawDetachedFromInputPacket: true,
      compositeFirstVisiblePathActive: true,
      hexSurfaceDeferredPathActive: true,

      controlPacketCount: state.controlPacketCount,
      controlPacketAcceptedCount: state.controlPacketAcceptedCount,
      controlPacketRejectedCount: state.controlPacketRejectedCount,
      controlPacketDeliveryStatus: state.controlPacketDeliveryStatus,
      controlPacketDeliveryMethod: state.controlPacketDeliveryMethod,
      controlPacketLastAcceptedAt: state.controlPacketLastAcceptedAt,
      controlPacketLastRejectedAt: state.controlPacketLastRejectedAt,
      controlPacketLastRejectionReason: state.controlPacketLastRejectionReason,
      controlPacketLastSource: state.controlPacketLastSource,

      viewState: clonePlain(view),
      viewTransformApplied: state.viewTransformApplied,
      viewTransformCss: state.viewTransformCss,

      fastTransformAttemptCount: state.fastTransformAttemptCount,
      fastTransformAppliedCount: state.fastTransformAppliedCount,
      fastTransformLastAppliedAt: state.fastTransformLastAppliedAt,
      fastTransformLastReason: state.fastTransformLastReason,

      deferredRenderScheduled: state.deferredRenderScheduled,
      deferredRenderReason: state.deferredRenderReason,
      deferredRenderStartedAt: state.deferredRenderStartedAt,
      deferredRenderLastRunAt: state.deferredRenderLastRunAt,
      deferredRenderRunCount: state.deferredRenderRunCount,
      deferredRenderSkippedDuringInputCount: state.deferredRenderSkippedDuringInputCount,
      deferredRenderLastResult: state.deferredRenderLastResult,

      viewRedrawScheduled: state.viewRedrawScheduled,
      viewRedrawCount: state.viewRedrawCount,
      viewMotionStatus: state.viewMotionStatus,
      touchRuntimeStatus: state.touchRuntimeStatus,
      dragRuntimeStatus: state.dragRuntimeStatus,
      zoomRuntimeStatus: state.zoomRuntimeStatus,
      keyboardRuntimeStatus: state.keyboardRuntimeStatus,
      planetaryViewInputStatus: state.planetaryViewInputStatus,

      ownsControlRuntimeTruth: false,
      ownsInputAdmission: false,
      ownsPointerInput: false,
      ownsTouchInput: false,
      ownsDragInput: false,
      ownsWheelInput: false,
      ownsKeyboardInput: false,
      ownsViewProjectionApplication: true,
      ownsCanvasRedrawFromViewState: true,
      ownsFinalPlanetTruth: false,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };
  }

  function refreshState() {
    refreshBridgeProfiles();
    refreshSupportDetections();
    ensureCanvas();
    resolveF13Gap();
    state.updatedAt = nowIso();

    return {
      contract: state.contract,
      receipt: state.receipt,
      internalImplementationContract: state.internalImplementationContract,
      internalImplementationReceipt: state.internalImplementationReceipt,
      bridgeBetweenBridgesActive: true,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      firstFailedCoordinate: state.firstFailedCoordinate
    };
  }

  function loadScriptOnce(src, attemptKey, completeKey) {
    if (!doc || !doc.head) return Promise.resolve(false);

    state[attemptKey] = true;
    state.supportLoadAttempted = true;

    const existing = Array.from(doc.querySelectorAll("script[src]")).find((script) => {
      try {
        const url = new URL(script.getAttribute("src"), root.location && root.location.href ? root.location.href : "https://diamondgatebridge.com/");
        return url.pathname === src;
      } catch (_error) {
        return safeString(script.getAttribute("src")).split("?")[0] === src;
      }
    });

    if (existing) {
      state[completeKey] = true;
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = doc.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(INTERNAL_IMPLEMENTATION_CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-hearth-canvas-hub-support", "true");
      script.setAttribute("data-contract", CONTRACT);
      script.setAttribute("data-hearth-canvas-bridge-between-bridges", INTERNAL_IMPLEMENTATION_CONTRACT);

      script.onload = () => {
        state[completeKey] = true;
        state.updatedAt = nowIso();
        resolve(true);
      };

      script.onerror = () => {
        const item = { at: nowIso(), file: src, error: "SCRIPT_LOAD_ERROR" };
        state.supportLoadErrors.push(item);
        trimArray(state.supportLoadErrors, 40);
        state[completeKey] = false;
        state.updatedAt = item.at;
        resolve(false);
      };

      doc.head.appendChild(script);
    });
  }

  function ensureCompositeSupportLoaded() {
    if (compositeSupportPromise) return compositeSupportPromise;

    state.supportLoadAttempted = true;

    compositeSupportPromise = loadScriptOnce(COMPOSITE_FILE, "supportLoadCompositeAttempted", "supportLoadCompositeComplete")
      .then(() => {
        refreshState();
        drawVisibleExpression("composite-support-loaded", {
          redrawHoldingField: false,
          allowHeavyHex: false
        });
        updateDataset();
        publishGlobals();
        return getReceipt();
      })
      .finally(() => {
        compositeSupportPromise = null;
      });

    return compositeSupportPromise;
  }

  function ensureHexSupportLoadedDeferred() {
    if (hexSupportPromise) return hexSupportPromise;

    state.supportLoadAttempted = true;

    hexSupportPromise = loadScriptOnce(HEX_FOUR_PAIR_FILE, "supportLoadHexFourPairAttempted", "supportLoadHexFourPairComplete")
      .then(() => loadScriptOnce(HEX_SURFACE_FILE, "supportLoadHexSurfaceAttempted", "supportLoadHexSurfaceComplete"))
      .then(() => {
        state.supportLoadComplete = true;
        refreshState();

        if (!state.compositeDrawComplete) {
          scheduleDeferredHexRender("hex-support-loaded-no-composite");
        }

        updateDataset();
        publishGlobals();
        return getReceipt();
      })
      .finally(() => {
        hexSupportPromise = null;
      });

    return hexSupportPromise;
  }

  function ensureSupportFilesLoaded() {
    ensureCompositeSupportLoaded();

    root.setTimeout(() => {
      ensureHexSupportLoadedDeferred();
    }, DEFERRED_HEX_MIN_DELAY_MS);

    return Promise.resolve(true);
  }

  function consumeRouteConductorReleasePacket(packet = {}) {
    state.lastReleasePacket = clonePlain(packet || {});
    state.releasePacketObserved = isObject(packet);
    state.releasePacketLastReceivedAt = nowIso();
    state.releasePacketLastSource = isObject(packet) ? safeString(packet.sourceFile || ROUTE_FILE) : "UNKNOWN";

    if (isObject(packet) && hasFinalClaim(packet)) {
      state.releasePacketAccepted = false;
      state.releasePacketDeliveryStatus = "ROUTE_CONDUCTOR_RELEASE_PACKET_REJECTED_FALSE_FINAL_CLAIM";
      recordError("RELEASE_PACKET_REJECTED_FALSE_FINAL_CLAIM", "Route conductor release packet contained forbidden final claim", { packet });
      updateDataset();
      publishGlobals();
      return getReceipt();
    }

    if (isObject(packet) && isObject(packet.hierarchyContext)) {
      state.hierarchyContextPacket = clonePlain(packet.hierarchyContext);
    }

    state.releasePacketAccepted = true;
    state.releasePacketDeliveryStatus = "ROUTE_CONDUCTOR_RELEASE_PACKET_ACCEPTED_BY_CANVAS_BRIDGE";

    refreshState();
    scheduleDeferredRender("route-conductor-release-packet");
    updateDataset();
    publishGlobals();

    return getReceipt();
  }

  function receiveRouteConductorReleasePacket(packet = {}) { return consumeRouteConductorReleasePacket(packet); }
  function consumeReleasePacket(packet = {}) { return consumeRouteConductorReleasePacket(packet); }
  function receiveReleasePacket(packet = {}) { return consumeRouteConductorReleasePacket(packet); }
  function receiveCanvasReleasePacket(packet = {}) { return consumeRouteConductorReleasePacket(packet); }
  function receiveCanvasParentPacket(packet = {}) { return consumeRouteConductorReleasePacket(packet); }
  function acceptReleasePacket(packet = {}) { return consumeRouteConductorReleasePacket(packet); }

  function readRouteConductorReleasePacket() {
    return clonePlain(state.lastReleasePacket || null);
  }

  function receiveHierarchyContext(packet = {}) {
    if (!isObject(packet)) return getHierarchyContext();

    state.hierarchyContextPacket = clonePlain({
      ...readHierarchyContext(),
      receivedPacket: clonePlain(packet),
      receivedAt: nowIso()
    });

    updateDataset();
    publishGlobals();
    return getHierarchyContext();
  }

  function consumeHierarchyContext(packet = {}) { return receiveHierarchyContext(packet); }
  function receiveBishopContext(packet = {}) { return receiveHierarchyContext(packet); }
  function consumeBishopContext(packet = {}) { return receiveHierarchyContext(packet); }

  function receiveQueenContext(packet = {}) {
    if (isObject(packet)) {
      state.queenObserved = true;
      state.queenBridgeStatus = "QUEEN_CONTEXT_RECEIVED_BY_CANVAS_BRIDGE";
      state.queenSuperconductorLanguageObserved = safeBool(packet.queenSuperconductorLanguageActive, state.queenSuperconductorLanguageObserved);
    }

    return receiveHierarchyContext({
      queenContext: clonePlain(packet),
      receivedBy: FILE,
      receiverRank: HIERARCHY_ROLE.rank,
      ...FINAL_FALSE
    });
  }

  function consumeQueenContext(packet = {}) { return receiveQueenContext(packet); }

  function receiveLabWestContext(packet = {}) {
    if (isObject(packet)) {
      state.labWestObserved = true;
      state.labWestBridgeStatus = "LABWEST_CONTEXT_RECEIVED_BY_CANVAS_BRIDGE";
    }

    return receiveHierarchyContext({
      labWestContext: clonePlain(packet),
      receivedBy: FILE,
      receiverRank: HIERARCHY_ROLE.rank,
      ...FINAL_FALSE
    });
  }

  function consumeLabWestContext(packet = {}) { return receiveLabWestContext(packet); }

  function receiveRouteConductorContext(packet = {}) {
    if (isObject(packet)) {
      state.routeConductorObserved = true;
      state.routeConductorBridgeStatus = "ROUTE_CONDUCTOR_CONTEXT_RECEIVED_BY_CANVAS_BRIDGE";
    }

    return receiveHierarchyContext({
      routeConductorContext: clonePlain(packet),
      receivedBy: FILE,
      receiverRank: HIERARCHY_ROLE.rank,
      ...FINAL_FALSE
    });
  }

  function consumeRouteConductorContext(packet = {}) { return receiveRouteConductorContext(packet); }

  function receiveChildPacket(packet = {}) {
    if (!isObject(packet)) return false;

    const key = inferFingerKeyFromPacket(packet);
    if (key && FINGER_FILES[key]) return receiveFingerPacket(packet);

    refreshState();
    updateDataset();
    publishGlobals();
    return true;
  }

  function receiveEastPacket(packet = {}) {
    state.canvasEastApiReady = true;
    state.canvasEastEvidenceReady = packet && isObject(packet)
      ? packet.canvasEastEvidenceReady === true || packet.atlasReady === true
      : state.canvasEastEvidenceReady;

    refreshState();
    return getCanvasStationSummary();
  }

  function receiveWestPacket(packet = {}) {
    state.canvasWestApiReady = true;
    state.canvasWestInspectionReady = packet && isObject(packet)
      ? packet.canvasWestInspectionReady === true || packet.inspectionReady === true
      : state.canvasWestInspectionReady;

    refreshState();
    return getCanvasStationSummary();
  }

  function receiveSouthPacket(packet = {}) {
    state.canvasSouthApiReady = true;
    state.canvasSouthVisibleProofReady = packet && isObject(packet)
      ? packet.canvasSouthVisibleProofReady === true || packet.visiblePlanetAvailable === true || packet.imageRendered === true
      : state.canvasSouthVisibleProofReady;

    refreshState();
    return getCanvasStationSummary();
  }

  function getHierarchyContext() {
    return clonePlain(state.hierarchyContextPacket || readHierarchyContext());
  }

  function getExpressionHubSummary() {
    refreshSupportDetections();
    recomputeFingerAggregation();

    return {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_EXPRESSION_HUB_BRIDGE_BETWEEN_BRIDGES_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      hierarchyContext: getHierarchyContext(),
      bridgeBetweenBridgesActive: true,
      canvasReceiverOutputCarrierBishopActive: true,
      hierarchyRole: HIERARCHY_ROLE.rank,
      cardinalAddress: HIERARCHY_ROLE.cardinalAddress,

      canvasHubLoaded: true,
      canvasHubActive: true,
      expressionHubActive: true,
      fingerManagerActive: true,
      threeFileStretchActive: true,
      planetaryViewControlReceiverActive: true,
      fastViewTransformActive: true,
      deferredRendererActive: true,
      compositeFirstVisiblePathActive: true,
      compositeDrawToCanvasHandshakeRecognized: true,
      hexSurfaceDeferredPathActive: true,
      hexSurfaceBootBlockingRejected: true,

      compositeFile: COMPOSITE_FILE,
      hexFourPairFile: HEX_FOUR_PAIR_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerKey: POINTER_FINGER_KEY,
      pointerFingerFile: POINTER_FINGER_FILE,
      lowerSurfaceFingerKey: LOWER_SURFACE_FINGER_KEY,
      lowerSurfaceFingerFile: LOWER_SURFACE_FINGER_FILE,

      compositeDetected: state.compositeDetected,
      compositeContract: state.compositeContract,
      compositeDrawMethodAvailable: state.compositeDrawMethodAvailable,
      compositeDrawMethod: state.compositeDrawMethod,
      compositeDrawAttempted: state.compositeDrawAttempted,
      compositeDrawComplete: state.compositeDrawComplete,

      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairWideProbeAvailable: state.hexFourPairWideProbeAvailable,
      hexFourPairEveryPixelHasFourPairSet: state.hexFourPairEveryPixelHasFourPairSet,
      hexFourPairBodyBound: state.hexFourPairBodyBound,
      hexFourPairAllowedToFloat: state.hexFourPairAllowedToFloat,

      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererContract: state.hexSurfaceRendererContract,
      hexSurfaceRendererContractRecognized: state.hexSurfaceRendererContractRecognized,
      hexSurfaceRendererV2Recognized: state.hexSurfaceRendererV2Recognized,
      hexSurfaceRendererV1LineageAccepted: state.hexSurfaceRendererV1LineageAccepted,
      hexSurfaceRendererDrawMethodAvailable: state.hexSurfaceRendererDrawMethodAvailable,
      hexSurfaceRendererDrawAttempted: state.hexSurfaceRendererDrawAttempted,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,
      hexSurfaceRendererDeferred: state.hexSurfaceRendererDeferred,
      hexSurfaceRendererSkippedBecauseCompositeReady: state.hexSurfaceRendererSkippedBecauseCompositeReady,

      fingerSequence: FINGER_SEQUENCE.slice(),
      fingerFiles: clonePlain(FINGER_FILES),
      fingerRegistry: getFingerRegistry(),
      fingerAuthorityObservedCount: state.fingerAuthorityObservedCount,
      fingerApiReadyCount: state.fingerApiReadyCount,
      fingerExpressionPacketCount: state.fingerExpressionPacketCount,
      fingerReceiptPacketCount: state.fingerReceiptPacketCount,
      fingerTrackReadyCount: state.fingerTrackReadyCount,
      fingerHardFailCount: state.fingerHardFailCount,
      pointerFingerBishopObserved: state.pointerFingerBishopObserved,
      pointerFingerBishopStatus: state.pointerFingerBishopStatus,
      lowerSurfaceFingerObserved: state.lowerSurfaceFingerObserved,
      lowerSurfaceFingerStatus: state.lowerSurfaceFingerStatus,

      controlViewReceipt: getControlViewReceipt(),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getExpressionHubReceipt() {
    return {
      ...getExpressionHubSummary(),
      packetType: "CANVAS_EXPRESSION_HUB_BRIDGE_BETWEEN_BRIDGES_RECEIPT",
      currentReceipt: true,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getCanvasStationSummary() {
    resolveF13Gap();

    return {
      timestamp: state.timestamp || nowIso(),
      packetType: "CANVAS_HUB_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV121Contract: LINEAGE_V12_1_CONTRACT,
      lineageV121Receipt: LINEAGE_V12_1_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      indexFile: INDEX_FILE,
      routeFile: ROUTE_FILE,
      controlFile: CONTROL_FILE,

      bridgeBetweenBridgesActive: true,
      bridgeBetweenControlsAndQueen: true,
      bridgeBetweenWestAndLab: true,
      bridgeBetweenDiagnosticsAndCanvas: true,
      bridgeBetweenPointerFingerAndSurface: true,
      downstreamReceiverOutputBishopActive: true,
      canvasReceiverOutputCarrierBishopActive: true,
      hierarchyRole: HIERARCHY_ROLE.rank,
      hierarchyTitle: HIERARCHY_ROLE.title,
      hierarchyBridgeRole: HIERARCHY_ROLE.bridgeRole,
      cardinalAddress: HIERARCHY_ROLE.cardinalAddress,
      hierarchyContext: getHierarchyContext(),

      currentRouteConductorRequiredContract: ROUTE_CONDUCTOR_V9_9_CONTRACT,
      currentRouteConductorRequiredReceipt: ROUTE_CONDUCTOR_V9_9_RECEIPT,
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      routeConductorObserved: state.routeConductorObserved,
      routeConductorAuthoritySource: state.routeConductorAuthoritySource,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorContractRecognized: state.routeConductorContractRecognized,
      routeConductorV99Recognized: state.routeConductorV99Recognized,
      routeConductorV98LineageAccepted: state.routeConductorV98LineageAccepted,
      routeConductorV97LineageAccepted: state.routeConductorV97LineageAccepted,
      routeConductorV96LineageAccepted: state.routeConductorV96LineageAccepted,
      routeConductorV95LineageAccepted: state.routeConductorV95LineageAccepted,
      routeConductorV94LineageAccepted: state.routeConductorV94LineageAccepted,
      routeConductorBridgeStatus: state.routeConductorBridgeStatus,

      labWestObserved: state.labWestObserved,
      labWestAuthoritySource: state.labWestAuthoritySource,
      labWestContract: state.labWestContract,
      labWestReceipt: state.labWestReceipt,
      labWestContractRecognized: state.labWestContractRecognized,
      labWestV48HierarchyRecognized: state.labWestV48HierarchyRecognized,
      labWestV47BishopChordRecognized: state.labWestV47BishopChordRecognized,
      labWestBridgeStatus: state.labWestBridgeStatus,

      queenObserved: state.queenObserved,
      queenAuthoritySource: state.queenAuthoritySource,
      queenContract: state.queenContract,
      queenReceipt: state.queenReceipt,
      queenContractRecognized: state.queenContractRecognized,
      queenHandshakeAccepted: state.queenHandshakeAccepted,
      queenInputAdmissionOpen: state.queenInputAdmissionOpen,
      queenSuperconductorLanguageObserved: state.queenSuperconductorLanguageObserved,
      queenBridgeStatus: state.queenBridgeStatus,

      pointerFingerBishopKey: POINTER_FINGER_KEY,
      pointerFingerBishopFile: POINTER_FINGER_FILE,
      pointerFingerBishopObserved: state.pointerFingerBishopObserved,
      pointerFingerBishopStatus: state.pointerFingerBishopStatus,
      lowerSurfaceFingerKey: LOWER_SURFACE_FINGER_KEY,
      lowerSurfaceFingerFile: LOWER_SURFACE_FINGER_FILE,
      lowerSurfaceFingerObserved: state.lowerSurfaceFingerObserved,
      lowerSurfaceFingerStatus: state.lowerSurfaceFingerStatus,

      canvasHubLoaded: true,
      canvasHubActive: true,
      canvasLocalStationActive: true,
      expressionHubActive: true,
      canvasExpressionHubActive: true,
      fingerManagerActive: true,
      canvasFingerManagerActive: true,
      fingerRegistryActive: true,
      threeFileStretchActive: true,
      planetaryViewControlReceiverActive: true,
      viewControlPacketReceiverReady: true,
      fastViewTransformActive: true,
      deferredRendererActive: true,
      expensiveRedrawDetachedFromInputPacket: true,
      compositeFirstVisiblePathActive: true,
      compositeDrawToCanvasHandshakeRecognized: true,
      hexSurfaceDeferredPathActive: true,
      hexSurfaceBootBlockingRejected: true,

      canvasMountAttempted: state.canvasMountAttempted,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasMountRectNonzero: state.canvasMountRectNonzero,
      globeStageFound: state.globeStageFound,
      globeStageSelector: state.globeStageSelector,
      globeStageRectNonzero: state.globeStageRectNonzero,
      canvasElementFound: state.canvasElementFound,
      canvasCreated: state.canvasCreated,
      canvasReused: state.canvasReused,
      canvasMounted: Boolean(state.canvasElementFound && state.canvasContext2dReady),
      canvasRectNonzero: state.canvasRectNonzero,
      canvasAttributeWidth: state.canvasAttributeWidth,
      canvasAttributeHeight: state.canvasAttributeHeight,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasDrawAttempted: state.canvasDrawAttempted,
      canvasDrawComplete: state.canvasDrawComplete,
      canvasDrawError: state.canvasDrawError,
      holdingFieldDrawComplete: state.holdingFieldDrawComplete,
      holdingFieldVisible: state.holdingFieldVisible,

      compositeDetected: state.compositeDetected,
      compositeContract: state.compositeContract,
      compositeDrawMethodAvailable: state.compositeDrawMethodAvailable,
      compositeDrawMethod: state.compositeDrawMethod,
      compositeDrawAttempted: state.compositeDrawAttempted,
      compositeDrawComplete: state.compositeDrawComplete,
      compositeDrawError: state.compositeDrawError,

      hexFourPairAuthorityDetected: state.hexFourPairAuthorityDetected,
      hexFourPairAuthorityContract: state.hexFourPairAuthorityContract,
      hexFourPairAuthorityContractRecognized: state.hexFourPairAuthorityContractRecognized,
      hexFourPairWideProbeAvailable: state.hexFourPairWideProbeAvailable,
      hexFourPairEveryPixelHasFourPairSet: state.hexFourPairEveryPixelHasFourPairSet,
      hexFourPairBodyBound: state.hexFourPairBodyBound,
      hexFourPairAllowedToFloat: state.hexFourPairAllowedToFloat,

      hexSurfaceRendererDetected: state.hexSurfaceRendererDetected,
      hexSurfaceRendererContract: state.hexSurfaceRendererContract,
      hexSurfaceRendererContractRecognized: state.hexSurfaceRendererContractRecognized,
      hexSurfaceRendererV2Recognized: state.hexSurfaceRendererV2Recognized,
      hexSurfaceRendererV1LineageAccepted: state.hexSurfaceRendererV1LineageAccepted,
      hexSurfaceRendererDrawMethodAvailable: state.hexSurfaceRendererDrawMethodAvailable,
      hexSurfaceRendererDrawMethod: state.hexSurfaceRendererDrawMethod,
      hexSurfaceRendererDrawAttempted: state.hexSurfaceRendererDrawAttempted,
      hexSurfaceRendererDrawComplete: state.hexSurfaceRendererDrawComplete,
      hexSurfaceRendererDrawError: state.hexSurfaceRendererDrawError,
      hexSurfaceRendererDeferred: state.hexSurfaceRendererDeferred,
      hexSurfaceRendererSkippedBecauseCompositeReady: state.hexSurfaceRendererSkippedBecauseCompositeReady,

      visibleBaseGlobeCarrierActive: state.visiblePlanetProofReady,
      canvasVisibleBaseGlobeCarrierActive: state.visiblePlanetProofReady,
      baseGlobeDrawComplete: state.canvasDrawComplete,
      baseGlobeVisibleCarrierReady: state.visiblePlanetProofReady,
      visibleGlobeCarrierReady: state.visiblePlanetProofReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,
      visiblePlanetProofIngestedByRoute: state.visiblePlanetProofReady,
      visiblePlanetReceiptObserved: state.visiblePlanetProofReady,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      domVisiblePlanetProofReady: state.domVisiblePlanetProofReady,
      stageMountDomProofReady: state.stageMountDomProofReady,

      supportLoadAttempted: state.supportLoadAttempted,
      supportLoadComplete: state.supportLoadComplete,
      supportLoadCompositeAttempted: state.supportLoadCompositeAttempted,
      supportLoadCompositeComplete: state.supportLoadCompositeComplete,
      supportLoadHexFourPairAttempted: state.supportLoadHexFourPairAttempted,
      supportLoadHexFourPairComplete: state.supportLoadHexFourPairComplete,
      supportLoadHexSurfaceAttempted: state.supportLoadHexSurfaceAttempted,
      supportLoadHexSurfaceComplete: state.supportLoadHexSurfaceComplete,

      expressionHubSummary: getExpressionHubSummary(),
      controlViewReceipt: getControlViewReceipt(),

      releasePacketObserved: state.releasePacketObserved,
      releasePacketAccepted: state.releasePacketAccepted,
      releasePacketLastSource: state.releasePacketLastSource,
      releasePacketLastReceivedAt: state.releasePacketLastReceivedAt,
      releasePacketDeliveryStatus: state.releasePacketDeliveryStatus,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13CanvasEvidenceStrict: state.f13CanvasEvidenceStrict,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: state.f13HardFail,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      routeConductorShouldConsumeThisSummary: true,
      diagnosticRailMayReadThisSummary: true,
      latestReceiptAlwaysRepublished: true,
      staleReceiptPublicationBlocked: true,
      receiptPublishCount: state.receiptPublishCount,

      ownsCanvasHubIdentity: true,
      ownsCanvasParentIdentity: true,
      ownsExpressionHub: true,
      ownsFingerManager: true,
      ownsFingerRegistry: true,
      ownsFingerIntake: true,
      ownsVisibleCanvasPlacement: true,
      ownsOutputCarrier: true,
      ownsViewProjectionApplication: true,
      ownsCanvasRedrawFromViewState: true,
      ownsBridgeReceipts: true,

      ownsInputAdmission: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsQueenTruth: false,
      ownsFingerTruth: false,
      ownsPointerTruth: false,
      ownsFinalPlanetTruth: false,
      ownsCompositeTruth: false,
      ownsHexFourPairTruth: false,
      ownsHexSurfaceTruth: false,
      ownsDiagnosticRailCaseSelection: false,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getCanvasStationReceiptLight() {
    return getCanvasStationSummary();
  }

  function getCanvasStationReceipt() {
    return {
      ...getCanvasStationSummary(),
      packetType: "CANVAS_HUB_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_RECEIPT",
      currentReceipt: true,
      compositeDrawReceipt: clonePlain(state.compositeDrawReceipt),
      hexFourPairValidationReceipt: clonePlain(state.hexFourPairValidationReceipt),
      hexSurfaceRendererFrameReceipt: clonePlain(state.hexSurfaceRendererFrameReceipt),
      expressionHubReceipt: getExpressionHubReceipt(),
      controlViewReceipt: getControlViewReceipt(),
      hierarchyContext: getHierarchyContext(),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      supportLoadErrors: clonePlain(state.supportLoadErrors),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getStructuralCarrier() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousContract: PREVIOUS_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      hierarchyContext: getHierarchyContext(),
      structuralCarrierReady: true,
      structuralCarrierSafe: true,
      canvasHubActive: true,
      bridgeBetweenBridgesActive: true,
      canvasReceiverOutputCarrierBishopActive: true,
      hierarchyRole: HIERARCHY_ROLE.rank,
      cardinalAddress: HIERARCHY_ROLE.cardinalAddress,
      compositeFirstVisiblePathActive: true,
      planetaryViewControlReceiverActive: true,
      fastViewTransformActive: true,
      deferredRendererActive: true,
      hexSurfaceDeferredPathActive: true,
      pointerFingerKey: POINTER_FINGER_KEY,
      pointerFingerFile: POINTER_FINGER_FILE,
      lowerSurfaceFingerKey: LOWER_SURFACE_FINGER_KEY,
      lowerSurfaceFingerFile: LOWER_SURFACE_FINGER_FILE,
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      viewState: clonePlain(view),
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      ...FINAL_FALSE
    };
  }

  function readStructuralCarrier() { return getStructuralCarrier(); }
  function getCanvasCarrier() { return getStructuralCarrier(); }
  function getCarrierReceipt() { return getStructuralCarrier(); }

  function getReceiptLight() {
    return {
      ...getCanvasStationSummary(),
      currentReceiptLight: true,
      bridgeBetweenBridgesReceipt: true,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getCanvasStationReceipt(),
      currentReceipt: true,
      structuralCarrier: getStructuralCarrier(),
      expressionHubReceipt: getExpressionHubReceipt(),
      controlViewReceipt: getControlViewReceipt(),
      hierarchyContext: getHierarchyContext(),
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceiptText() {
    const r = getCanvasStationSummary();
    const c = getControlViewReceipt();

    return [
      "HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalImplementationContract", r.internalImplementationContract),
      line("internalImplementationReceipt", r.internalImplementationReceipt),
      line("previousInternalImplementationContract", r.previousInternalImplementationContract),
      line("previousContract", r.previousContract),
      line("previousReceipt", r.previousReceipt),
      line("baselineContract", r.baselineContract),
      line("baselineReceipt", r.baselineReceipt),
      line("file", FILE),
      line("route", ROUTE),
      line("diagnosticRoute", DIAGNOSTIC_ROUTE),
      "",
      "BRIDGE_BETWEEN_BRIDGES",
      line("bridgeBetweenBridgesActive", true),
      line("bridgeBetweenControlsAndQueen", true),
      line("bridgeBetweenWestAndLab", true),
      line("bridgeBetweenDiagnosticsAndCanvas", true),
      line("bridgeBetweenPointerFingerAndSurface", true),
      line("hierarchyRole", r.hierarchyRole),
      line("hierarchyTitle", r.hierarchyTitle),
      line("cardinalAddress", r.cardinalAddress),
      "",
      "ROUTE_CONDUCTOR_BRIDGE",
      line("currentRouteConductorRequiredContract", ROUTE_CONDUCTOR_V9_9_CONTRACT),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorAuthoritySource", r.routeConductorAuthoritySource),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorContractRecognized", r.routeConductorContractRecognized),
      line("routeConductorV99Recognized", r.routeConductorV99Recognized),
      line("routeConductorV98LineageAccepted", r.routeConductorV98LineageAccepted),
      line("routeConductorV97LineageAccepted", r.routeConductorV97LineageAccepted),
      line("routeConductorV96LineageAccepted", r.routeConductorV96LineageAccepted),
      line("routeConductorV95LineageAccepted", r.routeConductorV95LineageAccepted),
      line("routeConductorV94LineageAccepted", r.routeConductorV94LineageAccepted),
      line("routeConductorBridgeStatus", r.routeConductorBridgeStatus),
      "",
      "LABWEST_BRIDGE",
      line("labWestObserved", r.labWestObserved),
      line("labWestAuthoritySource", r.labWestAuthoritySource),
      line("labWestContract", r.labWestContract),
      line("labWestContractRecognized", r.labWestContractRecognized),
      line("labWestV48HierarchyRecognized", r.labWestV48HierarchyRecognized),
      line("labWestV47BishopChordRecognized", r.labWestV47BishopChordRecognized),
      line("labWestBridgeStatus", r.labWestBridgeStatus),
      "",
      "QUEEN_BRIDGE",
      line("queenObserved", r.queenObserved),
      line("queenAuthoritySource", r.queenAuthoritySource),
      line("queenContract", r.queenContract),
      line("queenContractRecognized", r.queenContractRecognized),
      line("queenHandshakeAccepted", r.queenHandshakeAccepted),
      line("queenInputAdmissionOpen", r.queenInputAdmissionOpen),
      line("queenSuperconductorLanguageObserved", r.queenSuperconductorLanguageObserved),
      line("queenBridgeStatus", r.queenBridgeStatus),
      "",
      "FINGER_BRIDGE",
      line("pointerFingerBishopKey", POINTER_FINGER_KEY),
      line("pointerFingerBishopFile", POINTER_FINGER_FILE),
      line("pointerFingerBishopObserved", r.pointerFingerBishopObserved),
      line("pointerFingerBishopStatus", r.pointerFingerBishopStatus),
      line("lowerSurfaceFingerKey", LOWER_SURFACE_FINGER_KEY),
      line("lowerSurfaceFingerFile", LOWER_SURFACE_FINGER_FILE),
      line("lowerSurfaceFingerObserved", r.lowerSurfaceFingerObserved),
      line("lowerSurfaceFingerStatus", r.lowerSurfaceFingerStatus),
      line("fingerAuthorityObservedCount", r.expressionHubSummary.fingerAuthorityObservedCount),
      line("fingerApiReadyCount", r.expressionHubSummary.fingerApiReadyCount),
      line("fingerExpressionPacketCount", r.expressionHubSummary.fingerExpressionPacketCount),
      line("fingerReceiptPacketCount", r.expressionHubSummary.fingerReceiptPacketCount),
      line("fingerTrackReadyCount", r.expressionHubSummary.fingerTrackReadyCount),
      line("fingerHardFailCount", r.expressionHubSummary.fingerHardFailCount),
      "",
      "MOUNT",
      line("globeStageFound", r.globeStageFound),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasDrawAttempted", r.canvasDrawAttempted),
      line("canvasDrawComplete", r.canvasDrawComplete),
      line("holdingFieldDrawComplete", r.holdingFieldDrawComplete),
      line("holdingFieldVisible", r.holdingFieldVisible),
      "",
      "COMPOSITE_FIRST_VISIBLE_EXPRESSION",
      line("compositeFirstVisiblePathActive", r.compositeFirstVisiblePathActive),
      line("compositeDrawToCanvasHandshakeRecognized", r.compositeDrawToCanvasHandshakeRecognized),
      line("compositeDetected", r.compositeDetected),
      line("compositeDrawMethod", r.compositeDrawMethod),
      line("compositeDrawComplete", r.compositeDrawComplete),
      "",
      "DEFERRED_HEX_SURFACE",
      line("hexSurfaceDeferredPathActive", r.hexSurfaceDeferredPathActive),
      line("hexSurfaceBootBlockingRejected", r.hexSurfaceBootBlockingRejected),
      line("hexFourPairAuthorityDetected", r.hexFourPairAuthorityDetected),
      line("hexSurfaceRendererDetected", r.hexSurfaceRendererDetected),
      line("hexSurfaceRendererContract", r.hexSurfaceRendererContract),
      line("hexSurfaceRendererContractRecognized", r.hexSurfaceRendererContractRecognized),
      line("hexSurfaceRendererV2Recognized", r.hexSurfaceRendererV2Recognized),
      line("hexSurfaceRendererV1LineageAccepted", r.hexSurfaceRendererV1LineageAccepted),
      line("hexSurfaceRendererDrawComplete", r.hexSurfaceRendererDrawComplete),
      line("hexSurfaceRendererDeferred", r.hexSurfaceRendererDeferred),
      line("hexSurfaceRendererSkippedBecauseCompositeReady", r.hexSurfaceRendererSkippedBecauseCompositeReady),
      "",
      "VISIBLE_PROOF",
      line("visiblePlanetProofReady", r.visiblePlanetProofReady),
      line("visiblePlanetProofSource", r.visiblePlanetProofSource),
      line("visiblePlanetProofReason", r.visiblePlanetProofReason),
      "",
      "FAST_VIEW_TRANSFORM",
      line("planetaryViewControlReceiverActive", c.planetaryViewControlReceiverActive),
      line("viewControlPacketReceiverReady", c.viewControlPacketReceiverReady),
      line("fastViewTransformActive", c.fastViewTransformActive),
      line("deferredRendererActive", c.deferredRendererActive),
      line("expensiveRedrawDetachedFromInputPacket", c.expensiveRedrawDetachedFromInputPacket),
      line("controlPacketCount", c.controlPacketCount),
      line("controlPacketAcceptedCount", c.controlPacketAcceptedCount),
      line("controlPacketRejectedCount", c.controlPacketRejectedCount),
      line("controlPacketDeliveryStatus", c.controlPacketDeliveryStatus),
      line("viewYaw", c.viewState.yaw),
      line("viewPitch", c.viewState.pitch),
      line("viewZoom", c.viewState.zoom),
      line("viewPhase", c.viewState.phase),
      line("viewTransformApplied", c.viewTransformApplied),
      line("fastTransformAppliedCount", c.fastTransformAppliedCount),
      line("fastTransformLastAppliedAt", c.fastTransformLastAppliedAt),
      line("fastTransformLastReason", c.fastTransformLastReason),
      "",
      "RELEASE_PACKET",
      line("releasePacketObserved", r.releasePacketObserved),
      line("releasePacketAccepted", r.releasePacketAccepted),
      line("releasePacketLastSource", r.releasePacketLastSource),
      line("releasePacketDeliveryStatus", r.releasePacketDeliveryStatus),
      "",
      "F13_EVIDENCE",
      line("f13CanvasEvidenceStrict", r.f13CanvasEvidenceStrict),
      line("f13CanvasEvidenceDegraded", r.f13CanvasEvidenceDegraded),
      line("f13CanvasEvidenceComplete", r.f13CanvasEvidenceComplete),
      line("f13HardFail", r.f13HardFail),
      line("f13StrictEvidenceGap", r.f13StrictEvidenceGap),
      "",
      "RECEIPT_PUBLICATION",
      line("staleReceiptPublicationBlocked", true),
      line("latestReceiptAlwaysRepublished", true),
      line("receiptPublishCount", state.receiptPublishCount),
      "",
      "BOUNDARIES",
      line("ownsOutputCarrier", true),
      line("ownsBridgeReceipts", true),
      line("ownsInputAdmission", false),
      line("ownsRouteConductorHandshakeTruth", false),
      line("ownsLabWestAdmissibilityTruth", false),
      line("ownsQueenTruth", false),
      line("ownsDiagnosticRailCaseSelection", false),
      line("ownsFingerTruth", false),
      line("ownsPointerTruth", false),
      line("ownsFinalPlanetTruth", false),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21Claimed", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("controlReadyClaimed", false),
      line("motionReadyClaimed", false),
      line("touchReadyClaimed", false),
      line("dragReadyClaimed", false),
      line("downstreamReleaseClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function updateHierarchyDataset() {
    setDataset("hearthCanvasBridgeBetweenBridgesActive", "true");
    setDataset("hearthCanvasBridgeBetweenControlsAndQueen", "true");
    setDataset("hearthCanvasBridgeBetweenWestAndLab", "true");
    setDataset("hearthCanvasBridgeBetweenDiagnosticsAndCanvas", "true");
    setDataset("hearthCanvasBridgeBetweenPointerFingerAndSurface", "true");
    setDataset("hearthCanvasDownstreamReceiverOutputBishopActive", "true");
    setDataset("hearthCanvasReceiverOutputCarrierBishopActive", "true");
    setDataset("hearthCanvasHierarchyRole", HIERARCHY_ROLE.rank);
    setDataset("hearthCanvasHierarchyTitle", HIERARCHY_ROLE.title);
    setDataset("hearthCanvasHierarchyBridgeRole", HIERARCHY_ROLE.bridgeRole);
    setDataset("hearthCanvasCardinalAddress", HIERARCHY_ROLE.cardinalAddress);
    setDataset("hearthCanvasDefinitiveFile", FILE);
    setDataset("hearthCanvasDefinitiveContract", CONTRACT);
    setDataset("hearthCanvasDefinitiveReceipt", RECEIPT);
    setDataset("hearthCanvasInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasPreviousInternalImplementationContract", PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT);

    setDataset("hearthCanvasRouteConductorObserved", String(Boolean(state.routeConductorObserved)));
    setDataset("hearthCanvasRouteConductorAuthoritySource", state.routeConductorAuthoritySource);
    setDataset("hearthCanvasRouteConductorContract", state.routeConductorContract);
    setDataset("hearthCanvasRouteConductorReceipt", state.routeConductorReceipt);
    setDataset("hearthCanvasRouteConductorContractRecognized", String(Boolean(state.routeConductorContractRecognized)));
    setDataset("hearthCanvasRouteConductorV99Recognized", String(Boolean(state.routeConductorV99Recognized)));
    setDataset("hearthCanvasRouteConductorV98LineageAccepted", String(Boolean(state.routeConductorV98LineageAccepted)));
    setDataset("hearthCanvasRouteConductorV97LineageAccepted", String(Boolean(state.routeConductorV97LineageAccepted)));
    setDataset("hearthCanvasRouteConductorV96LineageAccepted", String(Boolean(state.routeConductorV96LineageAccepted)));
    setDataset("hearthCanvasRouteConductorV95LineageAccepted", String(Boolean(state.routeConductorV95LineageAccepted)));
    setDataset("hearthCanvasRouteConductorV94LineageAccepted", String(Boolean(state.routeConductorV94LineageAccepted)));
    setDataset("hearthCanvasRouteConductorBridgeStatus", state.routeConductorBridgeStatus);

    setDataset("hearthCanvasLabWestObserved", String(Boolean(state.labWestObserved)));
    setDataset("hearthCanvasLabWestAuthoritySource", state.labWestAuthoritySource);
    setDataset("hearthCanvasLabWestContract", state.labWestContract);
    setDataset("hearthCanvasLabWestReceipt", state.labWestReceipt);
    setDataset("hearthCanvasLabWestContractRecognized", String(Boolean(state.labWestContractRecognized)));
    setDataset("hearthCanvasLabWestV48HierarchyRecognized", String(Boolean(state.labWestV48HierarchyRecognized)));
    setDataset("hearthCanvasLabWestV47BishopChordRecognized", String(Boolean(state.labWestV47BishopChordRecognized)));
    setDataset("hearthCanvasLabWestBridgeStatus", state.labWestBridgeStatus);

    setDataset("hearthCanvasQueenObserved", String(Boolean(state.queenObserved)));
    setDataset("hearthCanvasQueenAuthoritySource", state.queenAuthoritySource);
    setDataset("hearthCanvasQueenBridgeStatus", state.queenBridgeStatus);
    setDataset("hearthCanvasQueenContract", state.queenContract);
    setDataset("hearthCanvasQueenReceipt", state.queenReceipt);
    setDataset("hearthCanvasQueenContractRecognized", String(Boolean(state.queenContractRecognized)));
    setDataset("hearthCanvasQueenHandshakeAccepted", String(Boolean(state.queenHandshakeAccepted)));
    setDataset("hearthCanvasQueenInputAdmissionOpen", String(Boolean(state.queenInputAdmissionOpen)));
    setDataset("hearthCanvasQueenSuperconductorLanguageObserved", String(Boolean(state.queenSuperconductorLanguageObserved)));

    setDataset("hearthCanvasPointerFingerBishopKey", POINTER_FINGER_KEY);
    setDataset("hearthCanvasPointerFingerBishopFile", POINTER_FINGER_FILE);
    setDataset("hearthCanvasPointerFingerBishopObserved", String(Boolean(state.pointerFingerBishopObserved)));
    setDataset("hearthCanvasPointerFingerBishopStatus", state.pointerFingerBishopStatus);
    setDataset("hearthCanvasLowerSurfaceFingerKey", LOWER_SURFACE_FINGER_KEY);
    setDataset("hearthCanvasLowerSurfaceFingerFile", LOWER_SURFACE_FINGER_FILE);
    setDataset("hearthCanvasLowerSurfaceFingerObserved", String(Boolean(state.lowerSurfaceFingerObserved)));
    setDataset("hearthCanvasLowerSurfaceFingerStatus", state.lowerSurfaceFingerStatus);

    setDataset("hearthCanvasOwnsOutputCarrier", "true");
    setDataset("hearthCanvasOwnsBridgeReceipts", "true");
    setDataset("hearthCanvasOwnsInputAdmission", "false");
    setDataset("hearthCanvasOwnsRouteConductorHandshakeTruth", "false");
    setDataset("hearthCanvasOwnsLabWestAdmissibilityTruth", "false");
    setDataset("hearthCanvasOwnsQueenTruth", "false");
    setDataset("hearthCanvasOwnsDiagnosticRailCaseSelection", "false");
    setDataset("hearthCanvasOwnsFingerTruth", "false");
    setDataset("hearthCanvasOwnsPointerTruth", "false");
  }

  function updateFastControlDataset() {
    setDataset("hearthCanvasControlPacketCount", String(state.controlPacketCount));
    setDataset("hearthCanvasControlPacketAcceptedCount", String(state.controlPacketAcceptedCount));
    setDataset("hearthCanvasControlPacketRejectedCount", String(state.controlPacketRejectedCount));
    setDataset("hearthCanvasControlPacketDeliveryStatus", state.controlPacketDeliveryStatus);

    setDataset("hearthCanvasFastViewTransformActive", "true");
    setDataset("hearthCanvasDeferredRendererActive", "true");
    setDataset("hearthCanvasExpensiveRedrawDetachedFromInputPacket", "true");
    setDataset("hearthCanvasCompositeFirstVisiblePathActive", "true");
    setDataset("hearthCanvasHexSurfaceDeferredPathActive", "true");

    setDataset("hearthCanvasViewYaw", String(view.yaw));
    setDataset("hearthCanvasViewPitch", String(view.pitch));
    setDataset("hearthCanvasViewZoom", String(view.zoom));
    setDataset("hearthCanvasViewPhase", String(view.phase));
    setDataset("hearthCanvasViewTransformApplied", String(state.viewTransformApplied));
    setDataset("hearthCanvasFastTransformAppliedCount", String(state.fastTransformAppliedCount));
    setDataset("hearthCanvasFastTransformLastAppliedAt", state.fastTransformLastAppliedAt);
    setDataset("hearthCanvasViewMotionStatus", state.viewMotionStatus);
    setDataset("hearthCanvasTouchRuntimeStatus", state.touchRuntimeStatus);
    setDataset("hearthCanvasDragRuntimeStatus", state.dragRuntimeStatus);
    setDataset("hearthCanvasZoomRuntimeStatus", state.zoomRuntimeStatus);
    setDataset("hearthCanvasPlanetaryViewInputStatus", state.planetaryViewInputStatus);
    setDataset("hearthCanvasDeferredRenderScheduled", String(state.deferredRenderScheduled));
    setDataset("hearthCanvasDeferredRenderRunCount", String(state.deferredRenderRunCount));
    setDataset("hearthCanvasDeferredRenderSkippedDuringInputCount", String(state.deferredRenderSkippedDuringInputCount));

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function updateDataset() {
    readHierarchyContext();

    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasPreviousInternalImplementationContract", PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasPreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasPreviousReceipt", PREVIOUS_RECEIPT);
    setDataset("hearthCanvasBaselineContract", BASELINE_CONTRACT);
    setDataset("hearthCanvasBaselineReceipt", BASELINE_RECEIPT);

    updateHierarchyDataset();

    setDataset("hearthCanvasHubLoaded", "true");
    setDataset("hearthCanvasHubActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasFingerManagerActive", "true");
    setDataset("hearthCanvasThreeFileStretchActive", "true");
    setDataset("hearthCanvasPlanetaryViewControlReceiverActive", "true");
    setDataset("hearthCanvasViewControlPacketReceiverReady", "true");
    setDataset("hearthCanvasFastViewTransformActive", "true");
    setDataset("hearthCanvasDeferredRendererActive", "true");
    setDataset("hearthCanvasExpensiveRedrawDetachedFromInputPacket", "true");
    setDataset("hearthCanvasCompositeFirstVisiblePathActive", "true");
    setDataset("hearthCanvasCompositeDrawToCanvasHandshakeRecognized", "true");
    setDataset("hearthCanvasHexSurfaceDeferredPathActive", "true");
    setDataset("hearthCanvasHexSurfaceBootBlockingRejected", "true");

    setDataset("hearthCanvasMountAttempted", String(state.canvasMountAttempted));
    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasDrawAttempted", String(state.canvasDrawAttempted));
    setDataset("hearthCanvasDrawComplete", String(state.canvasDrawComplete));
    setDataset("hearthCanvasHoldingFieldDrawComplete", String(state.holdingFieldDrawComplete));
    setDataset("hearthCanvasHoldingFieldVisible", String(state.holdingFieldVisible));

    setDataset("hearthCanvasCompositeDetected", String(state.compositeDetected));
    setDataset("hearthCanvasCompositeDrawMethod", state.compositeDrawMethod);
    setDataset("hearthCanvasCompositeDrawComplete", String(state.compositeDrawComplete));
    setDataset("hearthCanvasHexFourPairAuthorityDetected", String(state.hexFourPairAuthorityDetected));
    setDataset("hearthCanvasHexSurfaceRendererDetected", String(state.hexSurfaceRendererDetected));
    setDataset("hearthCanvasHexSurfaceRendererContract", state.hexSurfaceRendererContract);
    setDataset("hearthCanvasHexSurfaceRendererContractRecognized", String(state.hexSurfaceRendererContractRecognized));
    setDataset("hearthCanvasHexSurfaceRendererV2Recognized", String(state.hexSurfaceRendererV2Recognized));
    setDataset("hearthCanvasHexSurfaceRendererV1LineageAccepted", String(state.hexSurfaceRendererV1LineageAccepted));
    setDataset("hearthCanvasHexSurfaceRendererDrawComplete", String(state.hexSurfaceRendererDrawComplete));
    setDataset("hearthCanvasHexSurfaceRendererDeferred", String(state.hexSurfaceRendererDeferred));
    setDataset("hearthCanvasHexSurfaceRendererSkippedBecauseCompositeReady", String(state.hexSurfaceRendererSkippedBecauseCompositeReady));

    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofReason", state.visiblePlanetProofReason);
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasDomVisiblePlanetProofReady", String(state.domVisiblePlanetProofReady));
    setDataset("hearthCanvasStageMountDomProofReady", String(state.stageMountDomProofReady));

    updateFastControlDataset();

    setDataset("hearthCanvasReleasePacketObserved", String(state.releasePacketObserved));
    setDataset("hearthCanvasReleasePacketAccepted", String(state.releasePacketAccepted));
    setDataset("hearthCanvasReleasePacketLastSource", state.releasePacketLastSource);
    setDataset("hearthCanvasReleasePacketDeliveryStatus", state.releasePacketDeliveryStatus);

    setDataset("hearthCanvasF13EvidenceStrict", String(state.f13CanvasEvidenceStrict));
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13VisibleEvidenceAvailable", String(state.f13VisibleEvidenceAvailable));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasStaleReceiptPublicationBlocked", "true");
    setDataset("hearthCanvasLatestReceiptAlwaysRepublished", "true");
    setDataset("hearthCanvasReceiptPublishCount", String(state.receiptPublishCount));

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasControlReadyClaimed", "false");
    setDataset("hearthCanvasMotionReadyClaimed", "false");
    setDataset("hearthCanvasTouchReadyClaimed", "false");
    setDataset("hearthCanvasDragReadyClaimed", "false");
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
    hearth.canvasHub = api;
    hearth.canvasEvidence = api;
    hearth.canvasLocalStation = api;
    hearth.canvasStation = api;
    hearth.canvasExpressionHub = api;
    hearth.canvasFingerManager = api;
    hearth.canvasPlanetaryViewControlReceiver = api;
    hearth.canvasFastViewTransformReceiver = api;
    hearth.canvasDeferredRenderReceiver = api;
    hearth.canvasCompositeFirstFastViewDeferredHexReceiver = api;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    hearth.canvasDownstreamBishop = api;
    hearth.canvasOutputCarrierBishop = api;
    hearth.canvasBridgeBetweenBridges = api;
    hearth.canvasReceiverOutputCarrierBridge = api;

    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_PARENT = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS_AUTHORITY = api;
    root.HEARTH_CANVAS_EVIDENCE = api;
    root.HEARTH_CANVAS_LOCAL_STATION = api;
    root.HEARTH_CANVAS_STATION = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_CANVAS_FINGER_MANAGER = api;
    root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER = api;
    root.HEARTH_CANVAS_FAST_VIEW_TRANSFORM_RECEIVER = api;
    root.HEARTH_CANVAS_DEFERRED_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_DOWNSTREAM_BISHOP = api;
    root.HEARTH_CANVAS_OUTPUT_CARRIER_BISHOP = api;
    root.HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES = api;
    root.HEARTH_CANVAS_RECEIVER_OUTPUT_CARRIER_BRIDGE = api;
    root.HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_ALIGNMENT = api;

    lab.hearthCanvas = api;
    lab.hearthCanvasParent = api;
    lab.hearthCanvasHub = api;
    lab.hearthCanvasEvidence = api;
    lab.hearthCanvasLocalStation = api;
    lab.hearthCanvasStation = api;
    lab.hearthCanvasExpressionHub = api;
    lab.hearthCanvasFingerManager = api;
    lab.hearthCanvasPlanetaryViewControlReceiver = api;
    lab.hearthCanvasFastViewTransformReceiver = api;
    lab.hearthCanvasDeferredRenderReceiver = api;
    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiver = api;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    lab.hearthCanvasDownstreamBishop = api;
    lab.hearthCanvasOutputCarrierBishop = api;
    lab.hearthCanvasBridgeBetweenBridges = api;
    lab.hearthCanvasReceiverOutputCarrierBridge = api;

    const light = getReceiptLight();
    const full = getReceipt();
    const hubReceipt = getExpressionHubReceipt();
    const controlReceipt = getControlViewReceipt();
    const hierarchyContext = getHierarchyContext();

    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH_CANVAS_PARENT_RECEIPT = light;
    root.HEARTH_CANVAS_HUB_RECEIPT = full;
    root.HEARTH_CANVAS_LOCAL_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_STATION_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_FINGER_MANAGER_RECEIPT = hubReceipt;
    root.HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER_RECEIPT = controlReceipt;
    root.HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = full;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3 = full;
    root.HEARTH_CANVAS_DOWNSTREAM_BISHOP_RECEIPT = full;
    root.HEARTH_CANVAS_OUTPUT_CARRIER_BISHOP_RECEIPT = full;
    root.HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_RECEIPT = full;
    root.HEARTH_CANVAS_RECEIVER_OUTPUT_CARRIER_BRIDGE_RECEIPT = full;
    root.HEARTH_CANVAS_BRIDGE_BETWEEN_BRIDGES_RECEIVER_OUTPUT_CARRIER_ALIGNMENT_RECEIPT = full;
    root.HEARTH_CANVAS_HIERARCHY_CONTEXT = hierarchyContext;

    hearth.canvasReceipt = light;
    hearth.canvasParentReceipt = light;
    hearth.canvasHubReceipt = full;
    hearth.canvasLocalStationReceipt = full;
    hearth.canvasStationReceipt = full;
    hearth.canvasExpressionHubReceipt = hubReceipt;
    hearth.canvasFingerManagerReceipt = hubReceipt;
    hearth.canvasPlanetaryViewControlReceiverReceipt = controlReceipt;
    hearth.canvasCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    hearth.canvasDownstreamBishopReceipt = full;
    hearth.canvasOutputCarrierBishopReceipt = full;
    hearth.canvasBridgeBetweenBridgesReceipt = full;
    hearth.canvasReceiverOutputCarrierBridgeReceipt = full;
    hearth.canvasHierarchyContext = hierarchyContext;

    lab.hearthCanvasReceipt = light;
    lab.hearthCanvasParentReceipt = light;
    lab.hearthCanvasHubReceipt = full;
    lab.hearthCanvasLocalStationReceipt = full;
    lab.hearthCanvasStationReceipt = full;
    lab.hearthCanvasExpressionHubReceipt = hubReceipt;
    lab.hearthCanvasFingerManagerReceipt = hubReceipt;
    lab.hearthCanvasPlanetaryViewControlReceiverReceipt = controlReceipt;
    lab.hearthCanvasCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = full;
    lab.hearthCanvasDownstreamBishopReceipt = full;
    lab.hearthCanvasOutputCarrierBishopReceipt = full;
    lab.hearthCanvasBridgeBetweenBridgesReceipt = full;
    lab.hearthCanvasReceiverOutputCarrierBridgeReceipt = full;
    lab.hearthCanvasHierarchyContext = hierarchyContext;

    root.HEARTH_CANVAS_STRUCTURAL_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_CARRIER = getStructuralCarrier();
    root.HEARTH_CANVAS_PARENT_CARRIER = getStructuralCarrier();

    publishViewGlobals();

    state.receiptPublishCount += 1;
    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    updateDataset();

    return api;
  }

  function notifyRouteConductor() {
    const summary = getCanvasStationSummary();

    const candidates = routeConductorAliases()
      .map((name) => readPath(name))
      .filter((target) => target && isObject(target));

    const methods = [
      "receiveCanvasHubSummary",
      "receiveCanvasExpressionHubSummary",
      "receiveVisibleGlobeProofSummary",
      "receiveCanvasStationSummary",
      "receiveCanvasLocalStationSummary",
      "receiveCanvasParentSummary",
      "receiveCanvasDownstreamBishopSummary",
      "receiveHierarchyContext",
      "reconcileCanvas"
    ];

    for (const target of candidates) {
      for (const method of methods) {
        if (!isFunction(target[method])) continue;

        const result = safeInvoke(target, method, [clonePlain(summary)]);

        if (result.ok) {
          state.routeConductorNotified = true;
          state.routeConductorNotifyMethod = method;
          return true;
        }
      }
    }

    state.routeConductorNotified = false;
    state.routeConductorNotifyMethod = "NONE";
    return false;
  }

  function ingestPendingControlPacket() {
    const pending =
      readPath("HEARTH_CONTROLS_VIEW_PACKET") ||
      readPath("HEARTH_PLANETARY_VIEW_CONTROL_PACKET") ||
      readPath("HEARTH_CONTROLS_LAST_DELTA_PACKET") ||
      readPath("HEARTH_QUEEN_CONTROLS_VIEW_PACKET") ||
      readPath("HEARTH_QUEEN_SUPERCONDUCTOR_VIEW_PACKET") ||
      readPath("HEARTH.controlsViewPacket") ||
      readPath("HEARTH.planetaryViewControlPacket") ||
      readPath("HEARTH.controlsLastDeltaPacket") ||
      readPath("HEARTH.queenControlsViewPacket") ||
      readPath("HEARTH.queenSuperconductorViewPacket");

    if (isObject(pending)) {
      receivePlanetaryControlPacket(pending);
      return true;
    }

    return false;
  }

  function bootAudit(options = {}) {
    state.timestamp = nowIso();

    initializeFingerRegistry();
    refreshBridgeProfiles();
    updateDataset();
    publishGlobals();

    const target = ensureCanvas();

    if (target && target.canvas && target.ctx) {
      drawHoldingField(target.canvas, target.ctx, "Composite-first boot; Hex deferred");
    }

    refreshState();
    drawVisibleExpression(options && options.reason ? options.reason : "boot-audit", {
      redrawHoldingField: false,
      allowHeavyHex: false
    });

    ingestPendingControlPacket();
    notifyRouteConductor();

    state.bootAuditComplete = true;

    record("CANVAS_BRIDGE_BETWEEN_BRIDGES_BOOT_AUDIT_COMPLETE", {
      hierarchyRole: HIERARCHY_ROLE.rank,
      cardinalAddress: HIERARCHY_ROLE.cardinalAddress,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      routeConductorV99Recognized: state.routeConductorV99Recognized,
      labWestObserved: state.labWestObserved,
      labWestContract: state.labWestContract,
      queenObserved: state.queenObserved,
      queenContract: state.queenContract,
      pointerFingerBishopObserved: state.pointerFingerBishopObserved,
      lowerSurfaceFingerObserved: state.lowerSurfaceFingerObserved,
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      compositeDetected: state.compositeDetected,
      compositeDrawMethod: state.compositeDrawMethod,
      compositeDrawComplete: state.compositeDrawComplete,
      hexSurfaceRendererDeferred: state.hexSurfaceRendererDeferred,
      controlPacketCount: state.controlPacketCount,
      fastTransformAppliedCount: state.fastTransformAppliedCount,
      deferredRenderRunCount: state.deferredRenderRunCount,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      visualPassClaimed: false
    });

    ensureSupportFilesLoaded();

    updateDataset();
    publishGlobals();
    return getReceipt();
  }

  function boot(options = {}) { return bootAudit(options || {}); }
  function init(options = {}) { return bootAudit(options || {}); }
  function start(options = {}) { return bootAudit(options || {}); }
  function mount(options = {}) { return bootAudit(options || {}); }

  function drawBaseGlobe() {
    return drawVisibleExpression("compatibility-drawBaseGlobe", {
      redrawHoldingField: true,
      allowHeavyHex: false
    });
  }

  function mountBaseGlobeCarrier() {
    const target = ensureCanvas();
    return target ? target.canvas : null;
  }

  function recomputeAll() {
    return refreshState();
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    INTERNAL_IMPLEMENTATION_CONTRACT,
    INTERNAL_IMPLEMENTATION_RECEIPT,
    PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    LINEAGE_V12_1_CONTRACT,
    LINEAGE_V12_1_RECEIPT,
    BASELINE_CONTRACT,
    BASELINE_RECEIPT,

    ROUTE_CONDUCTOR_V9_9_CONTRACT,
    ROUTE_CONDUCTOR_V9_9_RECEIPT,
    ROUTE_CONDUCTOR_V9_8_CONTRACT,
    ROUTE_CONDUCTOR_V9_8_RECEIPT,
    ROUTE_CONDUCTOR_V9_7_CONTRACT,
    ROUTE_CONDUCTOR_V9_6_CONTRACT,
    ROUTE_CONDUCTOR_V9_5_CONTRACT,
    ROUTE_CONDUCTOR_V9_4_CONTRACT,
    ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS,

    LABWEST_V4_8_CONTRACT,
    LABWEST_V4_8_RECEIPT,
    LABWEST_V4_7_CONTRACT,
    LABWEST_V4_7_RECEIPT,
    ACCEPTED_LABWEST_CONTRACTS,

    QUEEN_V2_HIERARCHY_CONTRACT,
    QUEEN_V2_BISHOP_CHORD_CONTRACT,
    QUEEN_V1_PUBLIC_CONTRACT,
    QUEEN_V1_PUBLIC_RECEIPT,
    ACCEPTED_QUEEN_CONTRACTS,

    HEX_FOUR_PAIR_CONTRACT,
    HEX_SURFACE_V2_CONTRACT,
    HEX_SURFACE_V1_CONTRACT,
    ACCEPTED_HEX_SURFACE_CONTRACTS,

    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    HTML_FILE,
    INDEX_FILE,
    ROUTE_FILE,
    CONTROL_FILE,
    LAB_NORTH_FILE,
    LAB_EAST_FILE,
    LAB_SOUTH_FILE,
    LAB_WEST_FILE,
    COMPOSITE_FILE,
    HEX_FOUR_PAIR_FILE,
    HEX_SURFACE_FILE,
    POINTER_FINGER_KEY,
    POINTER_FINGER_FILE,
    LOWER_SURFACE_FINGER_KEY,
    LOWER_SURFACE_FINGER_FILE,
    HIERARCHY_ROLE,
    FINGER_FILES,
    FINGER_SEQUENCE,

    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    role: state.canvasRole,

    boot,
    init,
    start,
    mount,
    bootAudit,

    ensureCanvas,
    drawVisibleExpression,
    mountBaseGlobeCarrier,
    drawBaseGlobe,
    scheduleDeferredRender,
    runDeferredRender,
    scheduleDeferredHexRender,
    applyCanvasViewTransform,

    readHierarchyContext,
    getHierarchyContext,
    refreshBridgeProfiles,
    readRouteConductorProfile,
    readLabWestProfile,
    readQueenProfile,

    receiveHierarchyContext,
    consumeHierarchyContext,
    receiveBishopContext,
    consumeBishopContext,
    receiveQueenContext,
    consumeQueenContext,
    receiveLabWestContext,
    consumeLabWestContext,
    receiveRouteConductorContext,
    consumeRouteConductorContext,

    readRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveRouteConductorReleasePacket,
    consumeReleasePacket,
    receiveReleasePacket,
    receiveCanvasReleasePacket,
    receiveCanvasParentPacket,
    acceptReleasePacket,

    detectComposite,
    detectHexFourPairAuthority,
    detectHexSurfaceRenderer,
    refreshSupportDetections,
    ensureSupportFilesLoaded,
    ensureCompositeSupportLoaded,
    ensureHexSupportLoadedDeferred,

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

    receivePlanetaryControlPacket,
    consumePlanetaryControlPacket,
    receiveControlsPacket,
    consumeControlsPacket,
    receiveControlPacket,
    consumeControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receiveViewDelta,
    applyViewDelta,
    setView,
    updateView,
    getViewState,
    getControlViewReceipt,

    getExpressionHubSummary,
    getExpressionHubReceipt,
    getCanvasStationSummary,
    getCanvasStationReceipt,
    getCanvasStationReceiptLight,
    getStructuralCarrier,
    readStructuralCarrier,
    getCanvasCarrier,
    getCarrierReceipt,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    updateHierarchyDataset,
    updateFastControlDataset,
    publishGlobals,
    publishViewGlobals,
    notifyRouteConductor,
    recomputeAll,
    refreshState,
    resolveF13Gap,

    supportsBridgeBetweenBridges: true,
    supportsRouteConductorV99Contract: true,
    supportsRouteConductorV98Lineage: true,
    supportsRouteConductorV97Lineage: true,
    supportsRouteConductorV96Lineage: true,
    supportsRouteConductorV95Lineage: true,
    supportsRouteConductorV94Lineage: true,
    supportsLabWestV48Hierarchy: true,
    supportsLabWestV47BishopChord: true,
    supportsQueenSuperconductorContext: true,
    supportsPointerFingerBishopInspectAnchor: true,
    supportsLowerSurfaceFingerAsSeparateSurface: true,

    supportsCanvasHub: true,
    supportsCanvasLocalStation: true,
    supportsExpressionHub: true,
    supportsCanvasFingerManager: true,
    supportsThreeFileStretch: true,
    supportsCompositePreferredPath: true,
    supportsCompositeDrawToCanvasHandshake: true,
    supportsHexSurfaceDeferredPath: true,
    supportsHexSurfaceV2Contract: true,
    supportsHexSurfaceV1Lineage: true,
    supportsPlanetaryViewControlReceiver: true,
    supportsControlPacketIntake: true,
    supportsViewStateApplication: true,
    supportsCssLevelVisibleMotion: true,
    supportsFastViewTransform: true,
    supportsDeferredRenderer: true,
    supportsExpensiveRedrawDetachedFromInputPacket: true,
    supportsRendererRedrawFromViewState: true,
    supportsAlwaysFreshReceiptPublication: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsCanvasHubIdentity: true,
    ownsCanvasParentIdentity: true,
    ownsExpressionHub: true,
    ownsFingerManager: true,
    ownsFingerRegistry: true,
    ownsFingerIntake: true,
    ownsVisibleCanvasPlacement: true,
    ownsOutputCarrier: true,
    ownsViewProjectionApplication: true,
    ownsCanvasRedrawFromViewState: true,
    ownsBridgeReceipts: true,

    ownsFinalPlanetTruth: false,
    ownsCompositeTruth: false,
    ownsHexFourPairTruth: false,
    ownsHexSurfaceTruth: false,
    ownsFingerTruth: false,
    ownsPointerTruth: false,
    ownsRouteConductorSwitching: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsQueenTruth: false,
    ownsControlRuntimeTruth: false,
    ownsInputAdmission: false,
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
    refreshBridgeProfiles();
    updateDataset();
    publishGlobals();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => bootAudit({ reason: "dom-content-loaded" }), { once: true });
      } else {
        bootAudit({ reason: "document-ready" });
      }
    } else {
      bootAudit({ reason: "no-document-runtime" });
    }
  } catch (error) {
    recordError("CANVAS_BRIDGE_BETWEEN_BRIDGES_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
