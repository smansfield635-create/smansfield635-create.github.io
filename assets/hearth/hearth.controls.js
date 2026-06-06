// /assets/hearth/hearth.controls.js
// HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1
// Internal renewal:
// HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1
// Full-file replacement.
// Planetary Controls / Queen view-input authority only.
// Purpose:
// - Preserve the public v1 Controls contract expected by HTML, Route Conductor, diagnostics, and Canvas.
// - Accept Route Conductor control/Queen handshake packets only after validation.
// - Preserve compatibility with Route Conductor v10, v9_9, v9_8, v9_7, v9_6, v9_5, and v9_4.
// - Correct horizontal drag polarity so finger-right turns the visible globe right.
// - Coalesce pointer/touch/wheel/keyboard deltas through requestAnimationFrame.
// - Cache and prewarm Canvas public receiver lookup during active input.
// - Publish lightweight view packets during drag.
// - Preserve full receipts for boot, handshake, bind, refresh, and dispose.
// - Keep per-frame Canvas delivery limited to view/control receiver APIs only.
// - Do not call Canvas lifecycle, mount, boot, start, init, render, drawFrame, or drawVisibleExpression from per-frame input.
// - Keep packet phase at 0 so yaw is not double-applied by Canvas/Hex Surface.
// - Forward view-control delta packets to Canvas through public Canvas APIs only.
// - Preserve Canvas as receiver/output carrier.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth,
//   Canvas drawing authority, F13 claim, F21 claim, ready text, completion latch,
//   final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const RECEIPT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT_v1";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_RECEIPT_v4_1";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_RECEIPT_v4";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_QUEEN_V9_9_NEWS_FIBONACCI_CANVAS_DELTA_ALIGNMENT_TNT_v3";

  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2";

  const VERSION =
    "2026-06-06.hearth-controls-smooth-pointer-delta-canvas-frame-alignment-v4-1";

  const FILE = "/assets/hearth/hearth.controls.js";
  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const SURFACE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const ROUTE_CONDUCTOR_V10 =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const ROUTE_CONDUCTOR_V9_9 =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const ROUTE_CONDUCTOR_V9_8 =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8";
  const ROUTE_CONDUCTOR_V9_7 =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const ROUTE_CONDUCTOR_V9_6 =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const ROUTE_CONDUCTOR_V9_5 =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const ROUTE_CONDUCTOR_V9_4 =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    ROUTE_CONDUCTOR_V10,
    ROUTE_CONDUCTOR_V9_9,
    ROUTE_CONDUCTOR_V9_8,
    ROUTE_CONDUCTOR_V9_7,
    ROUTE_CONDUCTOR_V9_6,
    ROUTE_CONDUCTOR_V9_5,
    ROUTE_CONDUCTOR_V9_4,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const CURRENT_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    CURRENT_CANVAS_CONTRACT,
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

  const ACCEPTED_LABWEST_CONTRACTS = Object.freeze([
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7"
  ]);

  const HIERARCHY_REGISTRY_CONTRACT =
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_CARDINAL_BISHOP_BISHOP_QUEEN_PRIEST_REGISTRY_v1";
  const HIERARCHY_REGISTRY_RECEIPT =
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_CARDINAL_BISHOP_BISHOP_QUEEN_PRIEST_REGISTRY_RECEIPT_v1";

  const CONTROL_PACKET = "HEARTH_CONTROLS_PLANETARY_VIEW_DELTA_PACKET_v4_1";
  const HANDSHAKE_PACKET = "HEARTH_ROUTE_CONDUCTOR_TO_QUEEN_CONTROLS_HANDSHAKE_PACKET_v4_1";
  const QUEEN_PACKET = "HEARTH_QUEEN_CONTROLS_VIEW_PACKET_v4_1";

  const HANDSHAKE_STATUS = Object.freeze({
    WAITING_ROUTE_CONDUCTOR_AUTHORITY: "WAITING_ROUTE_CONDUCTOR_AUTHORITY",
    WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE: "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    ACCEPTED: "ACCEPTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    REJECTED: "REJECTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE"
  });

  const CONTROL_STATUS = Object.freeze({
    LOADED: "CONTROL_FILE_LOADED",
    WAITING_HANDSHAKE: "CONTROL_FILE_PRESENT_WAITING_HANDSHAKE",
    ACTIVE: "CONTROL_RUNTIME_ACTIVE",
    TARGET_PENDING: "CONTROL_RUNTIME_ACTIVE_CANVAS_TARGET_PENDING",
    DISPOSED: "CONTROL_RUNTIME_DISPOSED"
  });

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByControls: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByControls: false,
    f21ClaimedByRouteConductor: false,
    f21ClaimedByDiagnosticRail: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByControls: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const INPUT_TUNING = Object.freeze({
    horizontalPolarity: -1,
    pointerYawScale: 0.0068,
    pointerPitchScale: 0.0054,
    wheelZoomScale: -0.0012,
    keyboardYawStep: 0.06,
    keyboardPitchStep: 0.06,
    keyboardZoomStep: 0.08,
    receiverCacheMs: 1800,
    watchdogIntervalMs: 900,
    watchdogMaxTicks: 60,
    minPointerDelta: 0.01
  });

  const ROUTE_CONDUCTOR_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_NORTH_BISHOP",
    "HEARTH_SOUTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT",
    "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
    "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
    "HEARTH.routeConductor",
    "HEARTH.routeNorthBishop",
    "HEARTH.southRouteConductor",
    "HEARTH.routeConductorPrimaryGate",
    "HEARTH.routeConductorControlFileAdmissionAndHandshakeDelivery",
    "HEARTH.routeConductorControlHandshakeIntegration",
    "HEARTH.routeConductorNewsFibonacciVisibleGlobeProofSynchronization",
    "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion",
    "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
    "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
    "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteNorthBishop",
    "DEXTER_LAB.hearthSouthRouteConductor",
    "DEXTER_LAB.hearthRouteConductorPrimaryGate",
    "DEXTER_LAB.hearthRouteConductorControlFileAdmissionAndHandshakeDelivery",
    "DEXTER_LAB.hearthRouteConductorControlHandshakeIntegration",
    "DEXTER_LAB.hearthRouteConductorNewsFibonacciVisibleGlobeProofSynchronization",
    "DEXTER_LAB.hearthRouteConductorCanvasExpressionHubVisibleGlobeProofIngestion",
    "DEXTER_LAB.hearthRouteConductorCanvasLocalStationBridgeAlignment"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EVIDENCE",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasEvidence",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasVisibleBaseGlobeCarrier",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasEvidence",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const LABWEST_ALIASES = Object.freeze([
    "LAB_RUNTIME_TABLE_WEST",
    "RUNTIME_TABLE_WEST",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST",
    "HEARTH_RUNTIME_TABLE_WEST",
    "HEARTH_WEST_ADMISSIBILITY",
    "HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_ADOPTION",
    "LAB_RUNTIME_TABLE_WEST_GATE_DOWNSTREAM_HIERARCHY_ADOPTION",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT_v4_8",
    "LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE",
    "LAB_RUNTIME_TABLE_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
    "HEARTH.runtimeTableWest",
    "HEARTH.westRuntimeTable",
    "HEARTH.westAdmissibility",
    "HEARTH.westBishopChordCanvasReleaseBridge",
    "HEARTH.westGateDownstreamHierarchyAdoption",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.westAdmissibility",
    "DEXTER_LAB.hearthWestBishopChordCanvasReleaseBridge",
    "DEXTER_LAB.hearthWestGateDownstreamHierarchyAdoption"
  ]);

  const HIERARCHY_REGISTRY_ALIASES = Object.freeze([
    "HEARTH_WEST_GATE_DOWNSTREAM_HIERARCHY_REGISTRY",
    "HEARTH_HIERARCHY_REGISTRY",
    "LAB_RUNTIME_TABLE_WEST_HIERARCHY_REGISTRY",
    "HEARTH.westGateDownstreamHierarchyRegistry",
    "HEARTH.hierarchyRegistry",
    "HEARTH.cardinalBishopHierarchy",
    "HEARTH.downstreamBishopHierarchy",
    "HEARTH.queenHierarchy",
    "HEARTH.priestHierarchy",
    "DEXTER_LAB.hearthWestGateDownstreamHierarchyRegistry",
    "DEXTER_LAB.hearthHierarchyRegistry"
  ]);

  const QUEEN_ALIAS_PATHS = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_FILE",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_PLANETARY_VIEW_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_QUEEN_SUPERCONDUCTOR_CONTROLS",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlFile",
    "HEARTH.controlAuthority",
    "HEARTH.planetaryViewControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.queenSuperconductorControls",
    "HEARTH.controlsSmoothPointerDeltaCanvasFrameAlignment",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthControlFile",
    "DEXTER_LAB.hearthControlAuthority",
    "DEXTER_LAB.hearthPlanetaryViewControls",
    "DEXTER_LAB.hearthControlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthQueenSuperconductorControls",
    "DEXTER_LAB.hearthControlsSmoothPointerDeltaCanvasFrameAlignment"
  ]);

  const api = {};

  const view = {
    yaw: 0,
    pitch: 0,
    zoom: 1,
    phase: 0,
    minPitch: -1.25,
    maxPitch: 1.25,
    minZoom: 0.55,
    maxZoom: 2.4
  };

  const input = {
    bound: false,
    target: null,
    restoreTouchAction: "",
    restoreTabIndex: null,
    pointerActive: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    handlers: Object.create(null)
  };

  const frame = {
    rafId: 0,
    scheduled: false,
    pending: false,
    deltaYaw: 0,
    deltaPitch: 0,
    deltaZoom: 0,
    rawDx: 0,
    rawDy: 0,
    rawWheelY: 0,
    key: "",
    inputType: "view-delta",
    queuedAt: "",
    flushCount: 0
  };

  const receiverCache = {
    authority: null,
    authoritySource: "NONE",
    contract: "",
    receipt: "",
    method: "",
    expiresAt: 0,
    missCount: 0,
    hitCount: 0,
    prewarmCount: 0,
    prewarmStatus: "NOT_RUN",
    prewarmAt: ""
  };

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    canvasFile: CANVAS_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    surfaceFingerFile: SURFACE_FINGER_FILE,
    labWestFile: LABWEST_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CONTROLS_V4_1_LOADED",

    queenControlBridgeActive: true,
    queenSuperconductorLanguageActive: true,
    queenOutsideCardinalFunctionality: true,
    queenIsBishop: false,
    queenReadsLabWestAsOpaqueSuperconductor: true,
    controlsInspectBishopInternals: false,
    controlsInspectSubjectFiles: false,
    controlsInspectChildFiles: false,
    controlsInspectFingerFiles: false,

    newsAlignmentActive: true,
    fibonacciSynchronizationActive: true,
    activeNewsCycle: "INDEX_PASSIVE_ROUTE_CONDUCTOR_QUEEN_CANVAS",
    activeFibonacci: "F8_TO_F13_CONTROL_EXTENSION",

    smoothInputRenewalActive: true,
    requestAnimationFrameCoalescingActive: true,
    canvasReceiverCacheActive: true,
    canvasReceiverPrewarmActive: true,
    horizontalDragPolarityCorrected: true,
    pointerRightTurnsGlobeRight: true,
    packetPhaseFixedAtZero: true,
    canvasLifecycleCallsSuppressedDuringDragFrames: true,
    fullReceiptSuppressedDuringDragFrames: true,

    handshakeRequired: true,
    handshakeStatus: HANDSHAKE_STATUS.WAITING_ROUTE_CONDUCTOR_AUTHORITY,
    handshakeAccepted: false,
    handshakeRejected: false,
    handshakePacket: null,
    handshakeSource: "NONE",
    handshakeRejectionReason: "",

    controlStatus: CONTROL_STATUS.LOADED,
    inputAdmissionOpen: false,
    inputBound: false,
    inputTargetFound: false,
    inputTargetDescription: "NONE",

    touchStatus: "WAITING_HANDSHAKE",
    dragStatus: "WAITING_HANDSHAKE",
    motionStatus: "WAITING_HANDSHAKE",
    zoomStatus: "WAITING_HANDSHAKE",
    keyboardStatus: "WAITING_HANDSHAKE",
    inputStatus: "WAITING_HANDSHAKE",

    routeConductorObserved: false,
    routeConductorAuthoritySource: "NONE",
    routeConductorContract: "",
    routeConductorReceipt: "",
    routeConductorContractRecognized: false,
    routeConductorControlIntegrationStatus: "WAITING_ROUTE_CONDUCTOR_AUTHORITY",

    canvasObserved: false,
    canvasAuthoritySource: "NONE",
    canvasContract: "",
    canvasReceipt: "",
    canvasContractRecognized: false,
    canvasDeliveryStatus: "NOT_DELIVERED",
    canvasDeliveryMethod: "NONE",
    canvasDeliveryReason: "WAITING_CONTROL_DELTA",
    canvasReceiverCacheStatus: "EMPTY",
    canvasReceiverCacheMethod: "NONE",
    canvasReceiverCacheHits: 0,
    canvasReceiverCacheMisses: 0,
    canvasReceiverPrewarmStatus: "NOT_RUN",
    canvasReceiverPrewarmCount: 0,

    labWestObserved: false,
    labWestAuthoritySource: "NONE",
    labWestContract: "",
    labWestReceipt: "",
    labWestContractRecognized: false,
    labWestSuperconductorStatus: "LABWEST_SUPERCONDUCTOR_NOT_OBSERVED",
    bishopChordBridgeActive: false,
    bishopSubjectFileDelegationActive: false,
    westKnowsBishopsNotChildren: true,
    bishopChordStatus: "UNKNOWN",
    bishopChordAdmissible: "UNKNOWN",
    bishopChordStrict: "UNKNOWN",
    bishopChordDegraded: "UNKNOWN",
    bishopChordHardBlock: "UNKNOWN",
    bishopChordReadyCount: "UNKNOWN",
    bishopChordObservedCount: "UNKNOWN",
    bishopChordReleaseMode: "UNKNOWN",
    fourWayCanvasHandoffActive: false,
    canvasReleaseApprovedByWest: false,
    releaseToCanvas: false,
    canvasReleasePacketReady: false,
    canvasReleaseHeldReason: "UNKNOWN",

    hierarchyRegistryObserved: false,
    hierarchyRegistryAuthoritySource: "NONE",
    hierarchyRegistryContract: "",
    hierarchyRegistryReceipt: "",
    hierarchyRegistryStatus: "HIERARCHY_REGISTRY_NOT_OBSERVED",
    cardinalBishopTermOwnedByHierarchyMap: "UNKNOWN",
    highBishopTermRejected: "UNKNOWN",
    queenExcludedFromCardinalFunctionality: "true",
    priestNotBishop: "UNKNOWN",
    pointerFingerFileConfirmed: "true",

    eventCount: 0,
    packetCount: 0,
    deliveryCount: 0,
    rejectionCount: 0,
    watchdogTicks: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    fullReceiptPublishCount: 0,
    lightweightFramePublishCount: 0,
    coalescedFrameCount: 0,
    rawInputEventCount: 0,
    droppedEmptyFrameCount: 0,

    lastInputType: "NONE",
    lastDeltaPacket: null,
    lastViewPacket: null,
    lastControlPacketPublishedAt: "",
    lastBishopContextPacket: null,
    lastHierarchyRegistry: null,
    lastFrameFlushAt: "",
    lastFrameDeltaYaw: 0,
    lastFrameDeltaPitch: 0,
    lastFrameDeltaZoom: 0,

    firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    recommendedNextFile: ROUTE_CONDUCTOR_FILE,
    recommendedNextAction: "PUBLISH_ROUTE_CONDUCTOR_TO_QUEEN_CONTROL_HANDSHAKE",
    postgameStatus: "QUEEN_LOADED_WAITING_ROUTE_CONDUCTOR_HANDSHAKE",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  let bootPromise = null;
  let watchdogTimer = 0;

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return "";
    }
  }

  function nowMs() {
    try {
      return Date.now();
    } catch (_error) {
      return 0;
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

  function boolText(value) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return safeString(value || "UNKNOWN");
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function clamp(value, min, max) {
    const number = safeNumber(value, min);
    return Math.max(min, Math.min(max, number));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
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

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(names) {
    for (const name of names) {
      const value = readPath(name);
      if (value && isObject(value)) return { name, value };
    }

    return { name: "NONE", value: null };
  }

  function dataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
  }

  function datasetValue(key, fallback = "") {
    const value = dataset()[key];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function q(selector) {
    if (!doc) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function describeElement(element) {
    if (!element || !element.tagName) return "NONE";

    const tag = safeString(element.tagName).toLowerCase();
    const id = element.id ? `#${element.id}` : "";

    const role =
      element.getAttribute && element.getAttribute("data-hearth-canvas-mount") !== null
        ? "[data-hearth-canvas-mount]"
        : element.getAttribute && element.getAttribute("data-hearth-globe-stage") !== null
          ? "[data-hearth-globe-stage]"
          : element.getAttribute && element.getAttribute("data-hearth-visible-planet-mount") !== null
            ? "[data-hearth-visible-planet-mount]"
            : element.getAttribute && element.getAttribute("data-hearth-expression-surface") !== null
              ? "[data-hearth-expression-surface]"
              : element.getAttribute && element.getAttribute("data-hearth-visible-canvas") !== null
                ? "[data-hearth-visible-canvas]"
                : "";

    return `${tag}${id}${role}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CONTROLS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 160);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CONTROLS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 100);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function readField(source, keys, fallback = "") {
    const s = isObject(source) ? source : {};

    for (const key of keys) {
      if (s[key] !== undefined && s[key] !== null && s[key] !== "") return s[key];

      const lower = key.toLowerCase();

      for (const candidate of Object.keys(s)) {
        if (candidate.toLowerCase() === lower) {
          const value = s[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function contractOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentContract",
        "canvasLocalStationContract",
        "canvasContract",
        "hearthCanvasContract",
        "controlContract",
        "controlsContract",
        "routeConductorContract",
        "currentRouteConductorContract",
        "servedRouteConductorContract",
        "contract",
        "CONTRACT",
        "sourceContract"
      ], ""),
      value && value.contract,
      value && value.CONTRACT
    );
  }

  function receiptOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentReceipt",
        "canvasLocalStationReceipt",
        "canvasReceipt",
        "hearthCanvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "routeConductorReceipt",
        "currentRouteConductorReceipt",
        "receipt",
        "RECEIPT",
        "sourceReceipt"
      ], ""),
      value && value.receipt,
      value && value.RECEIPT
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getControlReceipt",
      "getControlHandshakeReceipt",
      "getControlHandshakeSummary",
      "getQueenBridgeState",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getExpressionHubSummary",
      "getExpressionHubReceipt",
      "getVisibleBaseGlobeReceipt",
      "getVisibleGlobeReceipt",
      "getVisiblePlanetReceipt",
      "getCanvasVisibleProofReceipt",
      "getHierarchyRegistry",
      "getHierarchySurface",
      "getTransmissionReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result =
          method === "getReceiptLight" || method === "getCanvasStationReceiptLight"
            ? authority[method](false)
            : authority[method]();

        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.controlReceipt)) return authority.controlReceipt;
    if (isObject(authority.controlHandshakeReceipt)) return authority.controlHandshakeReceipt;
    if (isObject(authority.canvasStationSummary)) return authority.canvasStationSummary;
    if (isObject(authority.hierarchyRegistry)) return authority.hierarchyRegistry;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function routeContractRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(text) || text.includes("HEARTH_ROUTE_CONDUCTOR");
  }

  function canvasContractRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_CANVAS_CONTRACTS.includes(text) || text.includes("HEARTH_CANVAS");
  }

  function labWestContractRecognized(contract) {
    return ACCEPTED_LABWEST_CONTRACTS.includes(safeString(contract));
  }

  function readRouteConductorAuthority() {
    const found = firstGlobal(ROUTE_CONDUCTOR_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      root.__HEARTH_ROUTE_CONDUCTOR_CONTRACT__,
      ds.hearthRouteConductorContract,
      ds.hearthSouthJsRouteConductorContract,
      ds.routeConductorCurrentContract,
      ds.hearthRouteConductorCurrent,
      ds.hearthRouteConductorServedContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      root.__HEARTH_ROUTE_CONDUCTOR_RECEIPT__,
      ds.hearthRouteConductorReceipt
    );

    state.routeConductorObserved = Boolean(found.value || contract);
    state.routeConductorAuthoritySource = found.name;
    state.routeConductorContract = contract;
    state.routeConductorReceipt = receiptName;
    state.routeConductorContractRecognized = routeContractRecognized(contract);

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName
    };
  }

  function readCanvasAuthority(force = false) {
    const now = nowMs();

    if (!force && receiverCache.authority && receiverCache.expiresAt > now) {
      receiverCache.hitCount += 1;
      state.canvasReceiverCacheHits = receiverCache.hitCount;
      state.canvasReceiverCacheStatus = "HIT";
      state.canvasReceiverCacheMethod = receiverCache.method || "NONE";

      return {
        name: receiverCache.authoritySource,
        authority: receiverCache.authority,
        receipt: {},
        contract: receiverCache.contract,
        receiptName: receiverCache.receipt,
        cached: true
      };
    }

    receiverCache.missCount += 1;
    state.canvasReceiverCacheMisses = receiverCache.missCount;
    state.canvasReceiverCacheStatus = "MISS";

    const found = firstGlobal(CANVAS_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthCanvasContract,
      ds.hearthSouthCurrentCanvasParentContract,
      ds.hearthCurrentCanvasParentContract,
      ds.hearthCanvasParentContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthCanvasReceipt,
      ds.hearthSouthCurrentCanvasParentReceipt
    );

    state.canvasObserved = Boolean(found.value || contract);
    state.canvasAuthoritySource = found.name;
    state.canvasContract = contract;
    state.canvasReceipt = receiptName;
    state.canvasContractRecognized = canvasContractRecognized(contract);

    receiverCache.authority = found.value;
    receiverCache.authoritySource = found.name;
    receiverCache.contract = contract;
    receiverCache.receipt = receiptName;
    receiverCache.expiresAt = now + INPUT_TUNING.receiverCacheMs;

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName,
      cached: false
    };
  }

  function invalidateCanvasReceiverCache(reason = "manual") {
    receiverCache.authority = null;
    receiverCache.authoritySource = "NONE";
    receiverCache.contract = "";
    receiverCache.receipt = "";
    receiverCache.method = "";
    receiverCache.expiresAt = 0;
    state.canvasReceiverCacheStatus = `INVALIDATED:${reason}`;
    state.canvasReceiverCacheMethod = "NONE";
  }

  function getCanvasReceiverMethods() {
    return [
      "receivePlanetaryViewControlPacket",
      "consumePlanetaryViewControlPacket",
      "receiveViewControlPacket",
      "consumeViewControlPacket",
      "receiveCanvasViewState",
      "consumeCanvasViewState",
      "receiveViewState",
      "setViewState",
      "applyViewState",
      "receiveControlPacket",
      "receiveControlViewPacket",
      "receiveControlsPacket",
      "receivePlanetaryControlPacket",
      "receiveViewDelta",
      "applyViewDelta",
      "setView",
      "updateView"
    ];
  }

  function resolveCanvasReceiverMethod(authority) {
    if (!authority || !isObject(authority)) return "";

    if (
      receiverCache.authority === authority &&
      receiverCache.method &&
      isFunction(authority[receiverCache.method])
    ) {
      return receiverCache.method;
    }

    for (const method of getCanvasReceiverMethods()) {
      if (isFunction(authority[method])) {
        receiverCache.method = method;
        state.canvasReceiverCacheMethod = method;
        return method;
      }
    }

    receiverCache.method = "";
    state.canvasReceiverCacheMethod = "NONE";
    return "";
  }

  function prewarmCanvasReceiver(reason = "pointerdown") {
    const canvas = readCanvasAuthority(true);
    const method = resolveCanvasReceiverMethod(canvas.authority);

    receiverCache.prewarmCount += 1;
    receiverCache.prewarmAt = nowIso();
    receiverCache.prewarmStatus = method ? "PREWARMED" : "NO_PUBLIC_VIEW_RECEIVER_FOUND";

    state.canvasReceiverPrewarmCount = receiverCache.prewarmCount;
    state.canvasReceiverPrewarmStatus = receiverCache.prewarmStatus;
    state.canvasReceiverCacheMethod = method || "NONE";

    updateDatasetLight();

    return {
      prewarmed: Boolean(method),
      method,
      reason,
      canvasAuthoritySource: canvas.name,
      canvasContract: canvas.contract
    };
  }

  function readHierarchyRegistry() {
    const found = firstGlobal(HIERARCHY_REGISTRY_ALIASES);
    const registry = isObject(found.value) ? found.value : {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(registry),
      ds.hearthHierarchyRegistryContract,
      ds.hearthControlsHierarchyRegistryContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(registry),
      ds.hearthHierarchyRegistryReceipt,
      ds.hearthControlsHierarchyRegistryReceipt
    );

    const observed = Boolean(
      found.value ||
      contract === HIERARCHY_REGISTRY_CONTRACT ||
      ds.hearthHierarchyRegistryActive === "true" ||
      ds.hearthWestGateLanguageActive === "true" ||
      ds.hearthControlsHierarchyRegistryObserved === "true"
    );

    state.hierarchyRegistryObserved = observed;
    state.hierarchyRegistryAuthoritySource = found.name;
    state.hierarchyRegistryContract = contract;
    state.hierarchyRegistryReceipt = receiptName;
    state.hierarchyRegistryStatus = observed
      ? "WEST_GATE_HIERARCHY_REGISTRY_OBSERVED"
      : "HIERARCHY_REGISTRY_NOT_OBSERVED";

    state.cardinalBishopTermOwnedByHierarchyMap = boolText(firstDefined(
      readField(registry, ["cardinalBishopTermOwnedByHierarchyMap"], ""),
      ds.hearthCardinalBishopTermOwnedByHierarchyMap,
      ds.hearthControlsCardinalBishopTermOwnedByHierarchyMap
    ));

    state.highBishopTermRejected = boolText(firstDefined(
      readField(registry, ["highBishopTermRejected"], ""),
      ds.hearthHighBishopTermRejected,
      ds.hearthControlsHighBishopTermRejected
    ));

    state.queenExcludedFromCardinalFunctionality = boolText(firstDefined(
      readField(registry, ["queenExcludedFromCardinalFunctionality"], ""),
      ds.hearthQueenExcludedFromCardinalFunctionality,
      ds.hearthControlsQueenExcludedFromCardinalFunctionality,
      "true"
    ));

    state.priestNotBishop = boolText(firstDefined(
      readField(registry, ["priestNotBishop"], ""),
      ds.hearthPriestNotBishop,
      ds.hearthControlsPriestNotBishop
    ));

    state.pointerFingerFileConfirmed = boolText(firstDefined(
      readField(registry, ["pointerFingerFileConfirmed"], ""),
      ds.hearthPointerFingerFileConfirmed,
      ds.hearthControlsPointerFingerFileConfirmed,
      "true"
    ));

    state.lastHierarchyRegistry = clonePlain(registry);

    return {
      observed,
      name: found.name,
      registry,
      contract,
      receiptName
    };
  }

  function readLabWestBishopBridge() {
    const found = firstGlobal(LABWEST_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const registry = readHierarchyRegistry();
    const ds = dataset();
    const merged = Object.assign({}, ds, receipt);

    const contract = firstNonEmpty(
      contractOf(merged),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthWestRuntimeTableContract,
      ds.labRuntimeTableWestContract,
      ds.hearthSouthCardinalWestBishopContract,
      ds.hearthControlsLabWestContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(merged),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthWestRuntimeTableReceipt,
      ds.labRuntimeTableWestReceipt
    );

    const observed = Boolean(
      found.value ||
      contract ||
      ds.hearthWestBishopChordBridgeActive === "true" ||
      ds.hearthWestGateLanguageActive === "true" ||
      ds.hearthSouthCardinalWestBishopObserved === "true" ||
      registry.observed
    );

    state.labWestObserved = observed;
    state.labWestAuthoritySource = found.name;
    state.labWestContract = contract;
    state.labWestReceipt = receiptName;
    state.labWestContractRecognized = labWestContractRecognized(contract);

    state.labWestSuperconductorStatus = registry.observed
      ? "LABWEST_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_OBSERVED"
      : observed
        ? "LABWEST_BISHOP_CHORD_COMPAT_SUPERCONDUCTOR_OBSERVED"
        : "LABWEST_SUPERCONDUCTOR_NOT_OBSERVED";

    state.bishopChordBridgeActive = safeBool(
      readField(merged, ["bishopChordBridgeActive", "hearthWestBishopChordBridgeActive", "hearthSouthBishopChordBridgeActive"], observed),
      observed
    );

    state.bishopSubjectFileDelegationActive = safeBool(
      readField(merged, ["bishopSubjectFileDelegationActive", "hearthWestBishopSubjectFileDelegationActive", "hearthSouthBishopSubjectFileDelegationActive"], observed),
      observed
    );

    state.westKnowsBishopsNotChildren = safeBool(
      readField(merged, ["westKnowsBishopsNotChildren", "hearthWestKnowsBishopsNotChildren", "hearthSouthWestKnowsBishopsNotChildren"], true),
      true
    );

    state.bishopChordStatus = safeString(
      readField(merged, ["bishopChordStatus", "hearthWestBishopChordStatus", "hearthSouthBishopChordStatus"], "UNKNOWN")
    );

    state.bishopChordAdmissible = boolText(
      readField(merged, ["bishopChordAdmissible", "hearthWestBishopChordAdmissible", "hearthSouthBishopChordAdmissible"], "UNKNOWN")
    );

    state.bishopChordStrict = boolText(
      readField(merged, ["bishopChordStrict", "hearthWestBishopChordStrict"], "UNKNOWN")
    );

    state.bishopChordDegraded = boolText(
      readField(merged, ["bishopChordDegraded", "hearthWestBishopChordDegraded"], "UNKNOWN")
    );

    state.bishopChordHardBlock = boolText(
      readField(merged, ["bishopChordHardBlock", "hearthWestBishopChordHardBlock"], "UNKNOWN")
    );

    state.bishopChordReadyCount = safeString(
      readField(merged, ["bishopChordReadyCount", "hearthWestBishopChordReadyCount"], "UNKNOWN")
    );

    state.bishopChordObservedCount = safeString(
      readField(merged, ["bishopChordObservedCount", "hearthWestBishopChordObservedCount"], "UNKNOWN")
    );

    state.bishopChordReleaseMode = safeString(
      readField(merged, ["bishopChordReleaseMode", "hearthWestBishopChordReleaseMode"], "UNKNOWN")
    );

    state.fourWayCanvasHandoffActive = safeBool(
      readField(merged, ["fourWayCanvasHandoffActive", "hearthWestFourWayCanvasHandoffActive"], observed),
      observed
    );

    state.canvasReleaseApprovedByWest = safeBool(
      readField(merged, ["canvasReleaseApprovedByWest", "hearthWestCanvasReleaseApproved", "hearthSouthCanvasReleaseAuthorized"], false),
      false
    );

    state.releaseToCanvas = safeBool(
      readField(merged, ["releaseToCanvas", "hearthReleaseToCanvas"], false),
      false
    );

    state.canvasReleasePacketReady = safeBool(
      readField(merged, ["canvasReleasePacketReady", "hearthCanvasReleasePacketReady", "hearthSouthCanvasReleasePacketReady"], false),
      false
    );

    state.canvasReleaseHeldReason = safeString(
      readField(merged, ["canvasReleaseHeldReason", "hearthCanvasReleaseHeldReason", "hearthSouthCanvasReleaseHeldReason"], "UNKNOWN")
    );

    return {
      observed,
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName,
      hierarchyRegistry: registry
    };
  }

  function hasNoForbiddenClaims(packet) {
    const p = isObject(packet) ? packet : {};

    return !(
      p.f13Claimed === true ||
      p.f13CanvasClaimed === true ||
      p.f13ClaimedByControls === true ||
      p.f13ClaimedByCanvas === true ||
      p.f21EligibleForNorth === true ||
      p.f21Claimed === true ||
      p.f21ClaimedByControls === true ||
      p.f21ClaimedByRouteConductor === true ||
      p.f21ClaimedByDiagnosticRail === true ||
      p.f21SubmittedToNorth === true ||
      p.readyTextAllowed === true ||
      p.readyTextClaimed === true ||
      p.completionLatched === true ||
      p.finalCompletionLatched === true ||
      p.degradedCompletionLatched === true ||
      p.visualPassClaimed === true ||
      p.finalVisualPassClaimed === true ||
      p.generatedImage === true ||
      p.graphicBox === true ||
      p.webGL === true ||
      p.webgl === true
    );
  }

  function packetTargetsControls(packet) {
    if (!isObject(packet)) return false;

    const packetType = safeString(packet.packetType || packet.type || "");
    const handoffTo = safeString(packet.handoffTo || packet.destination || packet.target || "");
    const targetFile = safeString(firstDefined(
      packet.targetFile,
      packet.destinationFile,
      packet.controlFile,
      packet.controlsFile,
      packet.targetControlFile,
      packet.expectedControlFile,
      packet.jsControlFile
    ), "");

    return Boolean(
      packetType.includes("CONTROL") ||
      packetType.includes("CONTROLS") ||
      packetType.includes("QUEEN") ||
      handoffTo.toUpperCase().includes("CONTROL") ||
      handoffTo.toUpperCase().includes("CONTROLS") ||
      handoffTo.toUpperCase().includes("QUEEN") ||
      targetFile === FILE ||
      targetFile.endsWith("/hearth.controls.js") ||
      safeBool(packet.controlHandshakeAuthorized, false) ||
      safeBool(packet.controlsHandshakeAuthorized, false) ||
      safeBool(packet.planetaryControlHandshakeAuthorized, false) ||
      safeBool(packet.queenHandshakeAuthorized, false) ||
      safeBool(packet.queenControlAdmissionAuthorized, false) ||
      safeBool(packet.controlAdmissionAuthorized, false) ||
      safeBool(packet.controlsAdmissionAuthorized, false) ||
      safeBool(packet.planetaryControlAdmissionAuthorized, false)
    );
  }

  function packetSourceIsRouteConductor(packet) {
    if (!isObject(packet)) return false;

    const sourceFile = safeString(packet.sourceFile || packet.fromFile || "");
    const sourceRole = safeString(packet.sourceRole || packet.role || packet.authority || packet.sourceAuthority || "");
    const contract = safeString(firstDefined(
      packet.routeConductorContract,
      packet.sourceContract,
      packet.contract,
      packet.CONTRACT
    ), "");

    return Boolean(
      sourceFile === ROUTE_CONDUCTOR_FILE ||
      sourceFile.endsWith("/showroom/globe/hearth/hearth.js") ||
      sourceRole.includes("route-conductor") ||
      sourceRole.includes("ROUTE_CONDUCTOR") ||
      sourceRole.includes("route-conductor-north-bishop") ||
      routeContractRecognized(contract) ||
      contract.includes("HEARTH_ROUTE_CONDUCTOR")
    );
  }

  function validateHandshake(packet) {
    if (!isObject(packet)) {
      return { accepted: false, reason: "HANDSHAKE_PACKET_NOT_OBJECT" };
    }

    if (!hasNoForbiddenClaims(packet)) {
      return { accepted: false, reason: "HANDSHAKE_PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM" };
    }

    if (!packetTargetsControls(packet)) {
      return { accepted: false, reason: "HANDSHAKE_PACKET_DOES_NOT_TARGET_CONTROLS_OR_QUEEN" };
    }

    if (!packetSourceIsRouteConductor(packet)) {
      return { accepted: false, reason: "HANDSHAKE_PACKET_NOT_FROM_ROUTE_CONDUCTOR" };
    }

    if (
      packet.controlAdmissionAuthorized === false ||
      packet.controlsAdmissionAuthorized === false ||
      packet.planetaryControlAdmissionAuthorized === false ||
      packet.queenControlAdmissionAuthorized === false ||
      packet.controlHandshakeAuthorized === false ||
      packet.controlsHandshakeAuthorized === false ||
      packet.planetaryControlHandshakeAuthorized === false ||
      packet.queenHandshakeAuthorized === false
    ) {
      return { accepted: false, reason: "ROUTE_CONDUCTOR_CONTROL_OR_QUEEN_ADMISSION_FALSE" };
    }

    return { accepted: true, reason: "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_ACCEPTED" };
  }

  function routeImpliesControlAdmission(route) {
    const receipt = isObject(route && route.receipt) ? route.receipt : {};
    const ds = dataset();
    const contract = safeString(route && route.contract);

    if (!routeContractRecognized(contract)) return false;

    const explicitDenial = Boolean(
      receipt.controlAdmissionAuthorized === false ||
      receipt.controlsAdmissionAuthorized === false ||
      receipt.planetaryControlAdmissionAuthorized === false ||
      receipt.queenControlAdmissionAuthorized === false ||
      /REJECTED|DENIED|FALSE/i.test(safeString(ds.hearthRouteConductorControlIntegrationStatus))
    );

    if (explicitDenial) return false;

    const text = [
      readField(receipt, ["controlHandshakeStatus", "controlsHandshakeStatus", "queenHandshakeStatus", "routeConductorControlIntegrationStatus"], ""),
      readField(receipt, ["postgameStatus", "runtimeReleaseState", "latestEvent"], ""),
      ds.hearthRouteConductorControlIntegrationStatus,
      ds.hearthSouthControlHandshakeStatus,
      ds.hearthSouthRouteConductorControlIntegrationStatus,
      ds.hearthControlHandshakeStatus,
      ds.hearthRuntimeReleaseState,
      ds.hearthPostgameStatus,
      ds.hearthRouteConductorCurrent
    ].filter(Boolean).join(" | ");

    if (/ACCEPTED|ADMITTED|CONTROL_HANDSHAKE|QUEEN_HANDSHAKE|HANDSHAKE_DELIVERY|CONTROL_FILE_ADMISSION|QUEEN_CANVAS_SYNC/i.test(text)) {
      return true;
    }

    if (safeBool(readField(receipt, [
      "controlHandshakeAccepted",
      "controlsHandshakeAccepted",
      "planetaryControlHandshakeAccepted",
      "controlAdmissionAuthorized",
      "controlsAdmissionAuthorized",
      "planetaryControlAdmissionAuthorized",
      "queenHandshakeAuthorized",
      "queenControlAdmissionAuthorized",
      "controlFileAdmissionAuthorized",
      "controlHandshakePacketReady",
      "controlHandshakePacketDelivered",
      "controlsHandshakeDelivered"
    ], false), false)) {
      return true;
    }

    return (
      contract === ROUTE_CONDUCTOR_V10 ||
      contract === ROUTE_CONDUCTOR_V9_9 ||
      contract === ROUTE_CONDUCTOR_V9_8 ||
      contract === ROUTE_CONDUCTOR_V9_7
    );
  }

  function composeImplicitHandshake(route, reason) {
    return {
      packetType: HANDSHAKE_PACKET,
      type: HANDSHAKE_PACKET,
      contract: route.contract || ROUTE_CONDUCTOR_V10,
      receipt: route.receiptName || "",
      sourceFile: ROUTE_CONDUCTOR_FILE,
      sourceRole: "route-conductor-north-bishop",
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceContract: route.contract || ROUTE_CONDUCTOR_V10,
      sourceReceipt: route.receiptName || "",
      targetFile: FILE,
      destinationFile: FILE,
      controlsFile: FILE,
      controlHandshakeAuthorized: true,
      controlsHandshakeAuthorized: true,
      planetaryControlHandshakeAuthorized: true,
      queenHandshakeAuthorized: true,
      queenControlAdmissionAuthorized: true,
      controlAdmissionAuthorized: true,
      controlsAdmissionAuthorized: true,
      planetaryControlAdmissionAuthorized: true,
      routeConductorOwnsControlFileAdmission: true,
      routeConductorOwnsControlHandshakeDelivery: true,
      reason,
      derivedFromRouteConductorReceipt: true,
      derivedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getHandshakePacketFromRouteConductor(route) {
    const authority = route && route.authority;

    if (authority && isObject(authority)) {
      const methods = [
        "getQueenControlHandshakePacket",
        "getRouteConductorControlHandshakePacket",
        "getPlanetaryControlHandshakePacket",
        "getControlHandshakePacket",
        "getControlsHandshakePacket",
        "getControlPacket",
        "getPlanetaryControlsHandoffPacket",
        "getControlsHandoffPacket",
        "getControlHandoffPacket"
      ];

      for (const method of methods) {
        if (!isFunction(authority[method])) continue;

        try {
          const result = authority[method]({
            requester: CONTRACT,
            requesterFile: FILE,
            targetFile: FILE,
            destinationFile: FILE,
            canvasFile: CANVAS_FILE,
            queenControlBridgeActive: true,
            queenOutsideCardinalFunctionality: true,
            pointerFingerFile: POINTER_FINGER_FILE,
            ...NO_CLAIMS
          });

          if (isObject(result)) {
            return { packet: result, source: `${route.name}.${method}` };
          }
        } catch (error) {
          recordError("ROUTE_CONDUCTOR_HANDSHAKE_METHOD_FAILED", error, { method });
        }
      }
    }

    const receipt = route && route.receipt ? route.receipt : {};
    const candidates = [
      receipt.controlHandshakePacket,
      receipt.controlsHandshakePacket,
      receipt.planetaryControlHandshakePacket,
      receipt.routeConductorControlHandshakePacket,
      receipt.queenControlHandshakePacket,
      receipt.routeConductorQueenControlHandshakePacket,
      receipt.controlHandoffPacket,
      receipt.controlsHandoffPacket,
      authority && authority.controlHandshakePacket,
      authority && authority.controlsHandshakePacket,
      authority && authority.planetaryControlHandshakePacket,
      authority && authority.queenControlHandshakePacket
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) {
        return { packet: candidate, source: `${route.name}.receipt-or-property` };
      }
    }

    if (routeImpliesControlAdmission(route)) {
      return {
        packet: composeImplicitHandshake(route, "ROUTE_CONDUCTOR_CURRENT_CONTRACT_OR_RECEIPT_IMPLIES_CONTROL_ADMISSION"),
        source: `${route.name}.implicit-current-route-conductor-admission`
      };
    }

    return null;
  }

  function getGlobalHandshakePacket() {
    const found = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_QUEEN_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_ROUTE_CONDUCTOR_CONTROLS_HANDSHAKE_PACKET",
      "HEARTH_PLANETARY_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_CONTROLS_HANDSHAKE_PACKET",
      "HEARTH_CONTROL_HANDSHAKE_PACKET",
      "HEARTH.routeConductorQueenControlHandshakePacket",
      "HEARTH.queenControlHandshakePacket",
      "HEARTH.routeConductorControlHandshakePacket",
      "HEARTH.controlHandshakePacket",
      "HEARTH.controlsHandshakePacket",
      "HEARTH.planetaryControlHandshakePacket",
      "DEXTER_LAB.hearthRouteConductorQueenControlHandshakePacket",
      "DEXTER_LAB.hearthQueenControlHandshakePacket",
      "DEXTER_LAB.hearthControlHandshakePacket",
      "DEXTER_LAB.hearthControlsHandshakePacket"
    ]);

    if (isObject(found.value)) return { packet: found.value, source: found.name };
    return null;
  }

  function openInputAdmission(handshakePacket, source) {
    state.handshakeAccepted = true;
    state.handshakeRejected = false;
    state.handshakeStatus = HANDSHAKE_STATUS.ACCEPTED;
    state.handshakePacket = clonePlain(handshakePacket);
    state.handshakeSource = source || "ROUTE_CONDUCTOR";
    state.handshakeRejectionReason = "";
    state.inputAdmissionOpen = true;
    state.controlStatus = CONTROL_STATUS.ACTIVE;
    state.routeConductorControlIntegrationStatus = "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_ACCEPTED";
    state.firstFailedCoordinate = "NONE_QUEEN_HANDSHAKE_ACCEPTED";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "BIND_INPUT_AND_DELIVER_VIEW_DELTAS_TO_CANVAS";
    state.postgameStatus = "QUEEN_HANDSHAKE_ACCEPTED_INPUT_ADMISSION_OPEN";

    invalidateCanvasReceiverCache("handshake-accepted");

    record("HEARTH_CONTROLS_QUEEN_HANDSHAKE_ACCEPTED", {
      source: state.handshakeSource,
      routeConductorContract: state.routeConductorContract,
      targetFile: FILE
    });

    bindInputIfAdmitted();
    prewarmCanvasReceiver("handshake-accepted");
    publishGlobals("handshake-accepted");

    return getReceiptLight(false);
  }

  function rejectHandshake(packet, reason, source) {
    state.handshakeAccepted = false;
    state.handshakeRejected = true;
    state.handshakeStatus = HANDSHAKE_STATUS.REJECTED;
    state.handshakePacket = clonePlain(packet || null);
    state.handshakeSource = source || "UNKNOWN";
    state.handshakeRejectionReason = reason || "HANDSHAKE_REJECTED";
    state.inputAdmissionOpen = false;
    state.rejectionCount += 1;
    state.controlStatus = CONTROL_STATUS.WAITING_HANDSHAKE;
    state.routeConductorControlIntegrationStatus = "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REJECTED";
    state.firstFailedCoordinate = state.handshakeRejectionReason;
    state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
    state.recommendedNextAction = "REISSUE_LAWFUL_ROUTE_CONDUCTOR_TO_QUEEN_HANDSHAKE";
    state.postgameStatus = "QUEEN_HANDSHAKE_REJECTED";

    record("HEARTH_CONTROLS_QUEEN_HANDSHAKE_REJECTED", {
      source: state.handshakeSource,
      reason: state.handshakeRejectionReason
    });

    publishGlobals("handshake-rejected");

    return getReceiptLight(false);
  }

  function receiveRouteConductorControlHandshake(packet, source = "direct-receiveRouteConductorControlHandshake") {
    const validation = validateHandshake(packet);
    if (!validation.accepted) return rejectHandshake(packet, validation.reason, source);
    return openInputAdmission(packet, source);
  }

  function consumeRouteConductorControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-consumeRouteConductorControlHandshake");
  }

  function receiveControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-receiveControlHandshake");
  }

  function consumeControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-consumeControlHandshake");
  }

  function receiveControlHandshakePacket(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-receiveControlHandshakePacket");
  }

  function acceptControlHandshakePacket(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-acceptControlHandshakePacket");
  }

  function receiveQueenControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-receiveQueenControlHandshake");
  }

  function consumeQueenControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-consumeQueenControlHandshake");
  }

  function observeHandshake() {
    const route = readRouteConductorAuthority();

    if (!route.authority && !route.contract) {
      state.handshakeStatus = HANDSHAKE_STATUS.WAITING_ROUTE_CONDUCTOR_AUTHORITY;
      state.routeConductorControlIntegrationStatus = "WAITING_ROUTE_CONDUCTOR_AUTHORITY";
      state.controlStatus = CONTROL_STATUS.WAITING_HANDSHAKE;
      state.firstFailedCoordinate = "WAITING_ROUTE_CONDUCTOR_AUTHORITY";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "CONFIRM_ROUTE_CONDUCTOR_PUBLICATION";
      state.postgameStatus = "QUEEN_WAITING_ROUTE_CONDUCTOR_AUTHORITY";
      updateDataset();
      return getReceiptLight(false);
    }

    const routePacket = getHandshakePacketFromRouteConductor(route);
    const packet = routePacket || getGlobalHandshakePacket();

    if (packet && isObject(packet.packet)) {
      return receiveRouteConductorControlHandshake(packet.packet, packet.source);
    }

    if (!state.handshakeAccepted) {
      state.handshakeStatus = HANDSHAKE_STATUS.WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE;
      state.routeConductorControlIntegrationStatus = "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE";
      state.controlStatus = CONTROL_STATUS.WAITING_HANDSHAKE;
      state.firstFailedCoordinate = "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "PUBLISH_ROUTE_CONDUCTOR_TO_QUEEN_CONTROL_HANDSHAKE";
      state.postgameStatus = "QUEEN_WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE";
    }

    updateDataset();
    return getReceiptLight(false);
  }

  function findInputTarget() {
    if (!doc) return null;

    return (
      q("#hearthCanvasMount canvas") ||
      q("[data-hearth-canvas-mount] canvas") ||
      q("#hearthGlobeStage canvas") ||
      q("[data-hearth-globe-stage] canvas") ||
      q("[data-hearth-visible-planet-mount] canvas") ||
      q("canvas[data-hearth-expression-surface='true']") ||
      q("canvas[data-hearth-visible-canvas='true']") ||
      q("canvas[data-hearth-canvas-hub='true']") ||
      q("canvas[data-hearth-canvas='true']") ||
      q("canvas[data-hearth-canvas-texture='true']") ||
      q("canvas[data-hearth-planet-canvas='true']") ||
      q("#hearthCanvasMount") ||
      q("[data-hearth-canvas-mount]") ||
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-visible-planet-mount]")
    );
  }

  function updateInputState() {
    if (!state.inputAdmissionOpen) {
      state.touchStatus = "WAITING_HANDSHAKE";
      state.dragStatus = "WAITING_HANDSHAKE";
      state.motionStatus = "WAITING_HANDSHAKE";
      state.zoomStatus = "WAITING_HANDSHAKE";
      state.keyboardStatus = "WAITING_HANDSHAKE";
      state.inputStatus = "WAITING_HANDSHAKE";
      return;
    }

    if (!state.inputTargetFound) {
      state.touchStatus = "WAITING_CANVAS_TARGET";
      state.dragStatus = "WAITING_CANVAS_TARGET";
      state.motionStatus = "WAITING_CANVAS_TARGET";
      state.zoomStatus = "WAITING_CANVAS_TARGET";
      state.keyboardStatus = "WAITING_CANVAS_TARGET";
      state.inputStatus = "WAITING_CANVAS_TARGET";
      state.controlStatus = CONTROL_STATUS.TARGET_PENDING;
      state.firstFailedCoordinate = "WAITING_CANVAS_INPUT_TARGET";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "CONFIRM_CANVAS_SURFACE_OR_MOUNT_EXISTS";
      return;
    }

    state.touchStatus = input.bound ? "TOUCH_INPUT_BOUND" : "TOUCH_INPUT_PENDING";
    state.dragStatus = input.bound ? "DRAG_INPUT_BOUND" : "DRAG_INPUT_PENDING";
    state.motionStatus = input.bound ? "VIEW_MOTION_CONTROL_READY" : "VIEW_MOTION_CONTROL_PENDING";
    state.zoomStatus = input.bound ? "ZOOM_INPUT_BOUND" : "ZOOM_INPUT_PENDING";
    state.keyboardStatus = input.bound ? "KEYBOARD_INPUT_BOUND" : "KEYBOARD_INPUT_PENDING";
    state.inputStatus = input.bound ? "PLANETARY_VIEW_INPUT_ADMITTED" : "PLANETARY_VIEW_INPUT_PENDING";

    if (input.bound) {
      state.controlStatus = CONTROL_STATUS.ACTIVE;
      state.firstFailedCoordinate = "NONE_QUEEN_INPUT_BOUND";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "OBSERVE_CONTROL_DELTA_DELIVERY_TO_CANVAS";
      state.postgameStatus = "QUEEN_INPUT_BOUND_CANVAS_DELTA_DELIVERY_READY";
    }
  }

  function bindInputIfAdmitted() {
    if (!doc || !state.inputAdmissionOpen || input.bound || state.disposed) {
      updateInputState();
      return false;
    }

    const target = findInputTarget();

    input.target = target;
    state.inputTargetFound = Boolean(target);
    state.inputTargetDescription = describeElement(target);

    if (!target) {
      updateInputState();
      updateDataset();
      return false;
    }

    input.restoreTouchAction = target.style ? target.style.touchAction || "" : "";
    input.restoreTabIndex = target.getAttribute ? target.getAttribute("tabindex") : null;

    try {
      if (target.style) {
        target.style.touchAction = "none";
        target.style.userSelect = "none";
        target.style.webkitUserSelect = "none";
      }

      if (target.setAttribute && !target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "0");
      }
    } catch (_error) {}

    input.handlers.pointerdown = onPointerDown;
    input.handlers.pointermove = onPointerMove;
    input.handlers.pointerup = onPointerUp;
    input.handlers.pointercancel = onPointerUp;
    input.handlers.wheel = onWheel;
    input.handlers.keydown = onKeyDown;

    try {
      target.addEventListener("pointerdown", input.handlers.pointerdown, { passive: false });
      target.addEventListener("pointermove", input.handlers.pointermove, { passive: false });
      target.addEventListener("pointerup", input.handlers.pointerup, { passive: false });
      target.addEventListener("pointercancel", input.handlers.pointercancel, { passive: false });
      target.addEventListener("wheel", input.handlers.wheel, { passive: false });
      doc.addEventListener("keydown", input.handlers.keydown, { passive: false });

      input.bound = true;
      state.inputBound = true;

      updateInputState();
      updateDataset();

      record("HEARTH_CONTROLS_QUEEN_INPUT_BOUND", {
        target: state.inputTargetDescription,
        handshakeStatus: state.handshakeStatus,
        smoothInputRenewalActive: true,
        requestAnimationFrameCoalescingActive: true,
        canvasReceiverPrewarmActive: true,
        horizontalDragPolarityCorrected: true,
        packetPhaseFixedAtZero: true,
        canvasLifecycleCallsSuppressedDuringDragFrames: true
      });

      prewarmCanvasReceiver("input-bound");
      publishGlobals("input-bound");
      return true;
    } catch (error) {
      recordError("HEARTH_CONTROLS_QUEEN_BIND_FAILED", error, { target: state.inputTargetDescription });
      updateInputState();
      updateDataset();
      return false;
    }
  }

  function unbindInput() {
    if (!doc || !input.bound || !input.target) return;

    try {
      input.target.removeEventListener("pointerdown", input.handlers.pointerdown);
      input.target.removeEventListener("pointermove", input.handlers.pointermove);
      input.target.removeEventListener("pointerup", input.handlers.pointerup);
      input.target.removeEventListener("pointercancel", input.handlers.pointercancel);
      input.target.removeEventListener("wheel", input.handlers.wheel);
      doc.removeEventListener("keydown", input.handlers.keydown);

      if (input.target.style) input.target.style.touchAction = input.restoreTouchAction || "";

      if (input.restoreTabIndex === null && input.target.removeAttribute) {
        input.target.removeAttribute("tabindex");
      } else if (input.target.setAttribute) {
        input.target.setAttribute("tabindex", input.restoreTabIndex);
      }
    } catch (error) {
      recordError("HEARTH_CONTROLS_QUEEN_UNBIND_FAILED", error);
    }

    input.bound = false;
    input.target = null;
    input.pointerActive = false;
    input.pointerId = null;
    input.handlers = Object.create(null);

    state.inputBound = false;
    updateInputState();
    updateDataset();
  }

  function eventBelongsToInput(event) {
    if (!event || !event.target || !input.target) return false;
    if (event.target === input.target) return true;
    return Boolean(input.target.contains && input.target.contains(event.target));
  }

  function targetIsEditable(event) {
    const target = event && event.target;
    if (!target || !target.tagName) return false;

    const tag = safeString(target.tagName).toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable === true;
  }

  function onPointerDown(event) {
    if (!state.inputAdmissionOpen || state.disposed) return;
    if (event.button !== undefined && event.button !== 0) return;

    input.pointerActive = true;
    input.pointerId = event.pointerId;
    input.lastX = safeNumber(event.clientX, 0);
    input.lastY = safeNumber(event.clientY, 0);
    state.lastInputType = "pointerdown";

    prewarmCanvasReceiver("pointerdown");

    try {
      if (event.currentTarget && isFunction(event.currentTarget.setPointerCapture)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    } catch (_error) {}

    if (isFunction(event.preventDefault)) event.preventDefault();
  }

  function onPointerMove(event) {
    if (!state.inputAdmissionOpen || state.disposed || !input.pointerActive) return;
    if (input.pointerId !== null && event.pointerId !== input.pointerId) return;

    const x = safeNumber(event.clientX, input.lastX);
    const y = safeNumber(event.clientY, input.lastY);
    const dx = x - input.lastX;
    const dy = y - input.lastY;

    input.lastX = x;
    input.lastY = y;

    if (
      Math.abs(dx) < INPUT_TUNING.minPointerDelta &&
      Math.abs(dy) < INPUT_TUNING.minPointerDelta
    ) {
      return;
    }

    if (isFunction(event.preventDefault)) event.preventDefault();

    state.rawInputEventCount += 1;
    state.lastInputType = "pointer-drag";

    queueViewDelta({
      inputType: "pointer-drag",
      deltaYaw: dx * INPUT_TUNING.pointerYawScale * INPUT_TUNING.horizontalPolarity,
      deltaPitch: dy * INPUT_TUNING.pointerPitchScale,
      deltaZoom: 0,
      rawDx: dx,
      rawDy: dy
    });
  }

  function onPointerUp(event) {
    if (!input.pointerActive) return;

    try {
      if (event.currentTarget && isFunction(event.currentTarget.releasePointerCapture)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (_error) {}

    input.pointerActive = false;
    input.pointerId = null;
    state.lastInputType = "pointerup";

    flushQueuedViewDelta("pointerup");
  }

  function onWheel(event) {
    if (!state.inputAdmissionOpen || state.disposed) return;
    if (!eventBelongsToInput(event)) return;

    const dy = safeNumber(event.deltaY, 0);
    if (Math.abs(dy) < 0.01) return;

    if (isFunction(event.preventDefault)) event.preventDefault();

    state.rawInputEventCount += 1;
    state.lastInputType = "wheel-zoom";

    prewarmCanvasReceiver("wheel");

    queueViewDelta({
      inputType: "wheel-zoom",
      deltaYaw: 0,
      deltaPitch: 0,
      deltaZoom: dy * INPUT_TUNING.wheelZoomScale,
      rawWheelY: dy
    });
  }

  function onKeyDown(event) {
    if (!state.inputAdmissionOpen || state.disposed || targetIsEditable(event)) return;

    const key = safeString(event.key);
    const active = doc && doc.activeElement;

    const targetActive = Boolean(
      active === input.target ||
      active === doc.body ||
      (input.target && input.target.contains && input.target.contains(active))
    );

    if (!targetActive) return;

    let deltaYaw = 0;
    let deltaPitch = 0;
    let deltaZoom = 0;

    if (key === "ArrowLeft") deltaYaw = -INPUT_TUNING.keyboardYawStep;
    else if (key === "ArrowRight") deltaYaw = INPUT_TUNING.keyboardYawStep;
    else if (key === "ArrowUp") deltaPitch = -INPUT_TUNING.keyboardPitchStep;
    else if (key === "ArrowDown") deltaPitch = INPUT_TUNING.keyboardPitchStep;
    else if (key === "+" || key === "=") deltaZoom = INPUT_TUNING.keyboardZoomStep;
    else if (key === "-" || key === "_") deltaZoom = -INPUT_TUNING.keyboardZoomStep;
    else return;

    if (isFunction(event.preventDefault)) event.preventDefault();

    state.rawInputEventCount += 1;
    state.lastInputType = "keyboard-view";

    prewarmCanvasReceiver("keyboard");

    queueViewDelta({
      inputType: "keyboard-view",
      deltaYaw,
      deltaPitch,
      deltaZoom,
      key
    });
  }

  function requestFrame(callback) {
    if (isFunction(root.requestAnimationFrame)) {
      return root.requestAnimationFrame(callback);
    }

    if (isFunction(root.setTimeout)) {
      return root.setTimeout(() => callback(nowMs()), 16);
    }

    callback(nowMs());
    return 0;
  }

  function cancelFrame(id) {
    if (!id) return;

    if (isFunction(root.cancelAnimationFrame)) {
      root.cancelAnimationFrame(id);
      return;
    }

    if (isFunction(root.clearTimeout)) {
      root.clearTimeout(id);
    }
  }

  function queueViewDelta(delta = {}) {
    if (!state.inputAdmissionOpen || state.disposed) return null;

    frame.pending = true;
    frame.deltaYaw += safeNumber(delta.deltaYaw, 0);
    frame.deltaPitch += safeNumber(delta.deltaPitch, 0);
    frame.deltaZoom += safeNumber(delta.deltaZoom, 0);
    frame.rawDx += safeNumber(delta.rawDx, 0);
    frame.rawDy += safeNumber(delta.rawDy, 0);
    frame.rawWheelY += safeNumber(delta.rawWheelY, 0);
    frame.key = safeString(delta.key || frame.key);
    frame.inputType = safeString(delta.inputType || frame.inputType || "view-delta");
    frame.queuedAt = frame.queuedAt || nowIso();

    if (!frame.scheduled) {
      frame.scheduled = true;
      frame.rafId = requestFrame(() => flushQueuedViewDelta("raf"));
    }

    return getViewPacket();
  }

  function resetFrameQueue() {
    frame.rafId = 0;
    frame.scheduled = false;
    frame.pending = false;
    frame.deltaYaw = 0;
    frame.deltaPitch = 0;
    frame.deltaZoom = 0;
    frame.rawDx = 0;
    frame.rawDy = 0;
    frame.rawWheelY = 0;
    frame.key = "";
    frame.inputType = "view-delta";
    frame.queuedAt = "";
  }

  function flushQueuedViewDelta(reason = "manual") {
    if (!frame.pending) {
      state.droppedEmptyFrameCount += 1;
      frame.scheduled = false;
      frame.rafId = 0;
      return null;
    }

    const delta = {
      inputType: frame.inputType,
      deltaYaw: frame.deltaYaw,
      deltaPitch: frame.deltaPitch,
      deltaZoom: frame.deltaZoom,
      rawDx: frame.rawDx,
      rawDy: frame.rawDy,
      rawWheelY: frame.rawWheelY,
      key: frame.key,
      flushReason: reason,
      queuedAt: frame.queuedAt
    };

    resetFrameQueue();

    if (
      Math.abs(delta.deltaYaw) < 0.000001 &&
      Math.abs(delta.deltaPitch) < 0.000001 &&
      Math.abs(delta.deltaZoom) < 0.000001
    ) {
      state.droppedEmptyFrameCount += 1;
      return null;
    }

    return applyViewDeltaNow(delta);
  }

  function composeQueenBridgeContext() {
    return {
      queenControlBridgeActive: true,
      queenSuperconductorLanguageActive: true,
      queenOutsideCardinalFunctionality: true,
      queenExcludedFromCardinalFunctionality: true,
      queenIsBishop: false,
      routeConductorRemainsHandshakeAuthority: true,
      controlsOwnViewInputOnly: true,

      smoothInputRenewalActive: true,
      requestAnimationFrameCoalescingActive: true,
      canvasReceiverCacheActive: true,
      canvasReceiverPrewarmActive: true,
      horizontalDragPolarityCorrected: true,
      pointerRightTurnsGlobeRight: true,
      packetPhaseFixedAtZero: true,
      canvasLifecycleCallsSuppressedDuringDragFrames: true,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      activeNewsCycle: state.activeNewsCycle,
      activeFibonacci: state.activeFibonacci,

      pointerFingerFile: POINTER_FINGER_FILE,
      surfaceFingerFile: SURFACE_FINGER_FILE,
      pointerFingerFileConfirmed: state.pointerFingerFileConfirmed,

      hierarchyRegistryObserved: state.hierarchyRegistryObserved,
      hierarchyRegistryAuthoritySource: state.hierarchyRegistryAuthoritySource,
      hierarchyRegistryContract: state.hierarchyRegistryContract,
      hierarchyRegistryReceipt: state.hierarchyRegistryReceipt,
      hierarchyRegistryStatus: state.hierarchyRegistryStatus,
      cardinalBishopTermOwnedByHierarchyMap: state.cardinalBishopTermOwnedByHierarchyMap,
      highBishopTermRejected: state.highBishopTermRejected,
      priestNotBishop: state.priestNotBishop,

      labWestObserved: state.labWestObserved,
      labWestAuthoritySource: state.labWestAuthoritySource,
      labWestContract: state.labWestContract,
      labWestReceipt: state.labWestReceipt,
      labWestContractRecognized: state.labWestContractRecognized,
      labWestSuperconductorStatus: state.labWestSuperconductorStatus,

      bishopChordBridgeActive: state.bishopChordBridgeActive,
      bishopSubjectFileDelegationActive: state.bishopSubjectFileDelegationActive,
      westKnowsBishopsNotChildren: state.westKnowsBishopsNotChildren,
      bishopChordStatus: state.bishopChordStatus,
      bishopChordAdmissible: state.bishopChordAdmissible,
      bishopChordStrict: state.bishopChordStrict,
      bishopChordDegraded: state.bishopChordDegraded,
      bishopChordHardBlock: state.bishopChordHardBlock,
      bishopChordReadyCount: state.bishopChordReadyCount,
      bishopChordObservedCount: state.bishopChordObservedCount,
      bishopChordReleaseMode: state.bishopChordReleaseMode,

      fourWayCanvasHandoffActive: state.fourWayCanvasHandoffActive,
      canvasReleaseApprovedByWest: state.canvasReleaseApprovedByWest,
      releaseToCanvas: state.releaseToCanvas,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      canvasReleaseHeldReason: state.canvasReleaseHeldReason,

      controlsInspectBishopInternals: false,
      controlsInspectSubjectFiles: false,
      controlsInspectChildFiles: false,
      controlsInspectFingerFiles: false
    };
  }

  function composeViewDeltaPacket(delta = {}) {
    return {
      packetType: CONTROL_PACKET,
      queenPacketType: QUEEN_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CONTROLS_QUEEN",
      sourceRole: "queen-planetary-view-input-authority",
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      handoffTo: "CANVAS",

      controlHandshakeStatus: state.handshakeStatus,
      handshakeAccepted: state.handshakeAccepted,
      controlHandshakeAccepted: state.handshakeAccepted,
      routeConductorControlHandshakeAccepted: state.handshakeAccepted,
      controlHandshakeAcceptedByQueen: state.handshakeAccepted,
      inputAdmissionOpen: state.inputAdmissionOpen === true,
      inputBound: input.bound === true,

      inputType: safeString(delta.inputType, "view-delta"),
      deltaYaw: safeNumber(delta.deltaYaw, 0),
      deltaPitch: safeNumber(delta.deltaPitch, 0),
      deltaZoom: safeNumber(delta.deltaZoom, 0),
      rawDx: delta.rawDx !== undefined ? safeNumber(delta.rawDx, 0) : undefined,
      rawDy: delta.rawDy !== undefined ? safeNumber(delta.rawDy, 0) : undefined,
      rawWheelY: delta.rawWheelY !== undefined ? safeNumber(delta.rawWheelY, 0) : undefined,
      key: delta.key || "",
      flushReason: delta.flushReason || "",

      viewState: {
        yaw: view.yaw,
        pitch: view.pitch,
        zoom: view.zoom,
        phase: 0,
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },

      yaw: view.yaw,
      pitch: view.pitch,
      zoom: view.zoom,
      phase: 0,

      queenBridge: composeQueenBridgeContext(),
      route: ROUTE,
      controlsFile: FILE,
      canvasFile: CANVAS_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      composedAt: nowIso(),

      frameCoalesced: true,
      requestAnimationFrameCoalescingActive: true,
      canvasReceiverCacheActive: true,
      canvasReceiverPrewarmActive: true,
      horizontalDragPolarityCorrected: true,
      pointerRightTurnsGlobeRight: true,
      packetPhaseFixedAtZero: true,
      canvasLifecycleCallsSuppressedDuringDragFrames: true,
      fullReceiptSuppressedDuringDragFrames: true,

      ...NO_CLAIMS
    };
  }

  function applyViewDelta(delta = {}) {
    return queueViewDelta(delta);
  }

  function applyViewDeltaNow(delta = {}) {
    if (!state.inputAdmissionOpen || state.disposed) return null;

    view.yaw += safeNumber(delta.deltaYaw, 0);
    view.pitch = clamp(view.pitch + safeNumber(delta.deltaPitch, 0), view.minPitch, view.maxPitch);
    view.zoom = clamp(view.zoom + safeNumber(delta.deltaZoom, 0), view.minZoom, view.maxZoom);
    view.phase = 0;

    state.lastInputType = delta.inputType || "view-delta";

    const packet = composeViewDeltaPacket(delta);

    state.lastDeltaPacket = clonePlain(packet);
    state.lastViewPacket = clonePlain(packet);
    state.packetCount += 1;
    state.coalescedFrameCount += 1;
    state.lightweightFramePublishCount += 1;
    state.lastControlPacketPublishedAt = packet.composedAt;
    state.lastFrameFlushAt = packet.composedAt;
    state.lastFrameDeltaYaw = packet.deltaYaw;
    state.lastFrameDeltaPitch = packet.deltaPitch;
    state.lastFrameDeltaZoom = packet.deltaZoom;
    frame.flushCount += 1;

    publishControlPacketLight(packet);
    deliverControlPacketToCanvas(packet);
    updateDatasetLight(packet);

    return packet;
  }

  function publishControlPacketLight(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const cloned = clonePlain(packet);
    const viewState = clonePlain(packet.viewState);

    root.HEARTH_CONTROLS_VIEW_PACKET = cloned;
    root.HEARTH_PLANETARY_VIEW_CONTROL_PACKET = cloned;
    root.HEARTH_CONTROLS_LAST_DELTA_PACKET = cloned;
    root.HEARTH_QUEEN_CONTROLS_VIEW_PACKET = cloned;
    root.HEARTH_QUEEN_SUPERCONDUCTOR_VIEW_PACKET = cloned;

    root.HEARTH_CANVAS_VIEW_STATE = viewState;
    root.HEARTH_CANVAS_LAST_VIEW_PACKET = cloned;

    hearth.controlsViewPacket = cloned;
    hearth.planetaryViewControlPacket = cloned;
    hearth.controlsLastDeltaPacket = cloned;
    hearth.queenControlsViewPacket = cloned;
    hearth.queenSuperconductorViewPacket = cloned;
    hearth.canvasViewState = viewState;
    hearth.canvasLastViewPacket = cloned;

    lab.hearthControlsViewPacket = cloned;
    lab.hearthPlanetaryViewControlPacket = cloned;
    lab.hearthQueenControlsViewPacket = cloned;
    lab.hearthCanvasViewState = viewState;
  }

  function deliverControlPacketToCanvas(packet) {
    const canvas = readCanvasAuthority(false);

    if (!canvas.authority || !isObject(canvas.authority)) {
      state.canvasDeliveryStatus = "CANVAS_AUTHORITY_PENDING_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "WAITING_CANVAS_PUBLIC_CONTROL_RECEIVER";
      broadcastControlEvent(packet);
      updateDatasetLight(packet);

      return {
        delivered: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.canvasDeliveryReason
      };
    }

    const method = resolveCanvasReceiverMethod(canvas.authority);

    if (!method) {
      state.canvasDeliveryStatus = "CANVAS_CONTROL_RECEIVER_NOT_FOUND_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "CANVAS_PUBLIC_CONTROL_RECEIVER_MISSING";
      broadcastControlEvent(packet);
      updateDatasetLight(packet);

      return {
        delivered: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.canvasDeliveryReason
      };
    }

    try {
      const payload = clonePlain(packet);
      const result = canvas.authority[method](payload);

      state.canvasDeliveryStatus = "CONTROL_PACKET_DELIVERED_TO_CANVAS";
      state.canvasDeliveryMethod = method;
      state.canvasDeliveryReason = "CANVAS_PUBLIC_VIEW_CONTROL_RECEIVER_CALLED";
      state.deliveryCount += 1;

      if (result && isFunction(result.then)) {
        result.catch((error) => {
          recordError("HEARTH_CONTROLS_QUEEN_CANVAS_ASYNC_RECEIVER_FAILED", error, { method });
        });
      }

      broadcastControlEvent(packet);
      updateDatasetLight(packet);

      return {
        delivered: true,
        method,
        reason: state.canvasDeliveryReason
      };
    } catch (error) {
      invalidateCanvasReceiverCache(`receiver-failed:${method}`);
      recordError("HEARTH_CONTROLS_QUEEN_CANVAS_RECEIVER_FAILED", error, { method });

      state.canvasDeliveryStatus = "CANVAS_RECEIVER_FAILED_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "CANVAS_PUBLIC_RECEIVER_THROWN";
      broadcastControlEvent(packet);
      updateDatasetLight(packet);

      return {
        delivered: false,
        method: "GLOBAL_PACKET_PUBLICATION",
        reason: state.canvasDeliveryReason
      };
    }
  }

  function broadcastControlEvent(packet) {
    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:planetary-view-control", { detail: clonePlain(packet) }));
        doc.dispatchEvent(new root.CustomEvent("hearth:queen-view-control", { detail: clonePlain(packet) }));
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-view-state", { detail: clonePlain(packet) }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:planetary-view-control", { detail: clonePlain(packet) }));
        root.dispatchEvent(new root.CustomEvent("hearth:queen-view-control", { detail: clonePlain(packet) }));
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-view-state", { detail: clonePlain(packet) }));
      }
    } catch (_error) {}
  }

  function receiveBishopChordContext(packet, source = "direct-receiveBishopChordContext") {
    if (!isObject(packet)) {
      recordError("BISHOP_CONTEXT_REJECTED", "BISHOP_CONTEXT_PACKET_NOT_OBJECT", { source });
      return getQueenBridgeState();
    }

    state.lastBishopContextPacket = clonePlain(packet);
    state.labWestObserved = true;
    state.labWestSuperconductorStatus = "BISHOP_CHORD_CONTEXT_RECEIVED_BY_QUEEN";
    state.bishopChordBridgeActive = safeBool(packet.bishopChordBridgeActive, state.bishopChordBridgeActive);
    state.bishopSubjectFileDelegationActive = safeBool(packet.bishopSubjectFileDelegationActive, state.bishopSubjectFileDelegationActive);
    state.westKnowsBishopsNotChildren = safeBool(packet.westKnowsBishopsNotChildren, true);
    state.bishopChordStatus = safeString(packet.bishopChordStatus || state.bishopChordStatus);
    state.bishopChordAdmissible = boolText(packet.bishopChordAdmissible !== undefined ? packet.bishopChordAdmissible : state.bishopChordAdmissible);
    state.bishopChordStrict = boolText(packet.bishopChordStrict !== undefined ? packet.bishopChordStrict : state.bishopChordStrict);
    state.bishopChordDegraded = boolText(packet.bishopChordDegraded !== undefined ? packet.bishopChordDegraded : state.bishopChordDegraded);
    state.bishopChordHardBlock = boolText(packet.bishopChordHardBlock !== undefined ? packet.bishopChordHardBlock : state.bishopChordHardBlock);
    state.fourWayCanvasHandoffActive = safeBool(packet.fourWayCanvasHandoffActive, state.fourWayCanvasHandoffActive);
    state.canvasReleaseApprovedByWest = safeBool(packet.canvasReleaseApprovedByWest, state.canvasReleaseApprovedByWest);
    state.releaseToCanvas = safeBool(packet.releaseToCanvas, state.releaseToCanvas);

    record("HEARTH_CONTROLS_QUEEN_BISHOP_CONTEXT_RECEIVED", { source });
    updateDataset();
    publishGlobals("bishop-context");

    return getQueenBridgeState();
  }

  function consumeBishopChordContext(packet) {
    return receiveBishopChordContext(packet, "direct-consumeBishopChordContext");
  }

  function receiveWestGateHierarchyContext(packet, source = "direct-receiveWestGateHierarchyContext") {
    if (!isObject(packet)) {
      recordError("WEST_GATE_HIERARCHY_CONTEXT_REJECTED", "WEST_GATE_HIERARCHY_PACKET_NOT_OBJECT", { source });
      return getQueenBridgeState();
    }

    state.lastHierarchyRegistry = clonePlain(packet);
    state.hierarchyRegistryObserved = true;
    state.hierarchyRegistryAuthoritySource = source;
    state.hierarchyRegistryContract = safeString(packet.contract || packet.hierarchyRegistryContract || HIERARCHY_REGISTRY_CONTRACT);
    state.hierarchyRegistryReceipt = safeString(packet.receipt || packet.hierarchyRegistryReceipt || HIERARCHY_REGISTRY_RECEIPT);
    state.hierarchyRegistryStatus = "WEST_GATE_HIERARCHY_CONTEXT_RECEIVED_BY_QUEEN";
    state.cardinalBishopTermOwnedByHierarchyMap = boolText(packet.cardinalBishopTermOwnedByHierarchyMap);
    state.highBishopTermRejected = boolText(packet.highBishopTermRejected);
    state.queenExcludedFromCardinalFunctionality = boolText(
      packet.queenExcludedFromCardinalFunctionality !== undefined
        ? packet.queenExcludedFromCardinalFunctionality
        : packet.queen && packet.queen.excludedFromCardinalFunctionality
    );
    state.priestNotBishop = boolText(packet.priestNotBishop);
    state.pointerFingerFileConfirmed = boolText(packet.pointerFingerFileConfirmed !== undefined ? packet.pointerFingerFileConfirmed : "true");

    record("HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_CONTEXT_RECEIVED", { source });
    updateDataset();
    publishGlobals("west-gate-hierarchy-context");

    return getQueenBridgeState();
  }

  function consumeWestGateHierarchyContext(packet) {
    return receiveWestGateHierarchyContext(packet, "direct-consumeWestGateHierarchyContext");
  }

  function composeDiagnosticFields() {
    const admitted = state.inputAdmissionOpen === true;
    const bound = input.bound === true;

    return {
      PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE: "true",
      PLANETARY_CONTROL_FOOTPRINT_STATUS: admitted ? "CONTROL_RUNTIME_ACTIVE" : "CONTROL_FILE_PRESENT_WAITING_HANDSHAKE",
      PLANETARY_CONTROL_DIAGNOSTIC_STATUS: state.controlStatus,
      PLANETARY_CONTROL_GATE_STATUS: admitted ? "CONTROL_GATE_OPEN" : "CONTROL_GATE_WAITING_HANDSHAKE",

      EXPECTED_CONTROL_FILE: FILE,
      EXPECTED_CONTROL_CONTRACT: CONTRACT,
      CONTROL_FILE: FILE,
      CONTROL_FILE_PRESENT: "true",
      CONTROL_FILE_SRC: FILE,
      CONTROL_FILE_CONTRACT: CONTRACT,
      CONTROL_FILE_RECEIPT: RECEIPT,
      CONTROL_FILE_AUTHORITY_SOURCE: "HEARTH_CONTROLS_QUEEN",
      CONTROL_FILE_EXPECTED_NOT_YET_BUILT: "false",
      CONTROL_FILE_ABSENCE_EXPECTED: "false",
      CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5: "true",
      CONTROL_FILE_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET: "false",

      CONTROL_HANDSHAKE_REQUIRED: "true",
      CONTROL_HANDSHAKE_STATUS: state.handshakeStatus,
      CONTROL_HANDSHAKE_ACCEPTED: String(state.handshakeAccepted === true),
      CONTROL_HANDSHAKE_ACCEPTED_BY_QUEEN: String(state.handshakeAccepted === true),
      CONTROL_HANDSHAKE_TARGET: FILE,
      CONTROL_HANDSHAKE_FUNNEL_OWNER: "ROUTE_CONDUCTOR",

      JS_INTEGRATION_FUNNEL: "INDEX_PASSIVE_CORRIDOR -> ROUTE_CONDUCTOR_V10_OR_V9_9 -> CONTROLS_QUEEN_V4_1 -> CANVAS_VIEW_RECEIVER_ONLY",
      JS_INDEX_FILE: INDEX_FILE,
      JS_INDEX_CONTRACT: EXPECTED_INDEX_CONTRACT,
      JS_ROUTE_CONDUCTOR_FILE: ROUTE_CONDUCTOR_FILE,
      JS_ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract || ROUTE_CONDUCTOR_V10,
      JS_CONTROL_FILE: FILE,
      JS_CONTROL_CONTRACT: CONTRACT,
      JS_CANVAS_FILE: CANVAS_FILE,

      ROUTE_CONDUCTOR_CONTROL_INTEGRATION_STATUS: state.routeConductorControlIntegrationStatus,
      ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REQUIRED: "true",
      ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_TARGET: FILE,
      ROUTE_CONDUCTOR_CONTROL_FUNNEL_OWNER: "ROUTE_CONDUCTOR",

      QUEEN_AUTHORITY_OBSERVED: "true",
      QUEEN_CONTROL_BRIDGE_ACTIVE: "true",
      QUEEN_SUPERCONDUCTOR_LANGUAGE_ACTIVE: "true",
      QUEEN_OUTSIDE_CARDINAL_FUNCTIONALITY: "true",
      QUEEN_IS_BISHOP: "false",
      QUEEN_EXCLUDED_FROM_CARDINAL_FUNCTIONALITY: "true",

      SMOOTH_INPUT_RENEWAL_ACTIVE: "true",
      REQUEST_ANIMATION_FRAME_COALESCING_ACTIVE: "true",
      CANVAS_RECEIVER_CACHE_ACTIVE: "true",
      CANVAS_RECEIVER_PREWARM_ACTIVE: "true",
      HORIZONTAL_DRAG_POLARITY_CORRECTED: "true",
      POINTER_RIGHT_TURNS_GLOBE_RIGHT: "true",
      PACKET_PHASE_FIXED_AT_ZERO: "true",
      CANVAS_LIFECYCLE_CALLS_SUPPRESSED_DURING_DRAG_FRAMES: "true",
      FULL_RECEIPT_SUPPRESSED_DURING_DRAG_FRAMES: "true",

      POINTER_FINGER_FILE: POINTER_FINGER_FILE,
      SURFACE_FINGER_FILE: SURFACE_FINGER_FILE,
      POINTER_FINGER_FILE_CONFIRMED: "true",

      HIERARCHY_REGISTRY_OBSERVED: String(Boolean(state.hierarchyRegistryObserved)),
      HIERARCHY_REGISTRY_CONTRACT: state.hierarchyRegistryContract,
      HIERARCHY_REGISTRY_STATUS: state.hierarchyRegistryStatus,
      CARDINAL_BISHOP_TERM_OWNED_BY_HIERARCHY_MAP: state.cardinalBishopTermOwnedByHierarchyMap,
      HIGH_BISHOP_TERM_REJECTED: state.highBishopTermRejected,
      PRIEST_NOT_BISHOP: state.priestNotBishop,

      LABWEST_SUPERCONDUCTOR_STATUS: state.labWestSuperconductorStatus,
      LABWEST_AUTHORITY_SOURCE: state.labWestAuthoritySource,
      LABWEST_CONTRACT: state.labWestContract,
      LABWEST_CONTRACT_RECOGNIZED: String(Boolean(state.labWestContractRecognized)),
      BISHOP_CHORD_BRIDGE_ACTIVE: String(Boolean(state.bishopChordBridgeActive)),
      BISHOP_SUBJECT_FILE_DELEGATION_ACTIVE: String(Boolean(state.bishopSubjectFileDelegationActive)),
      WEST_KNOWS_BISHOPS_NOT_CHILDREN: String(Boolean(state.westKnowsBishopsNotChildren)),
      BISHOP_CHORD_STATUS: state.bishopChordStatus,
      BISHOP_CHORD_ADMISSIBLE: state.bishopChordAdmissible,
      FOUR_WAY_CANVAS_HANDOFF_ACTIVE: String(Boolean(state.fourWayCanvasHandoffActive)),
      CONTROLS_INSPECT_BISHOP_INTERNALS: "false",
      CONTROLS_INSPECT_SUBJECT_FILES: "false",
      CONTROLS_INSPECT_CHILD_FILES: "false",
      CONTROLS_INSPECT_FINGER_FILES: "false",

      PLANETARY_VIEW_CONTROL_STATUS: admitted ? (bound ? "PLANETARY_VIEW_CONTROL_ACTIVE" : "PLANETARY_VIEW_CONTROL_TARGET_PENDING") : "WAITING_ROUTE_CONDUCTOR_HANDSHAKE",
      PLANETARY_VIEW_TOUCH_STATUS: state.touchStatus,
      PLANETARY_VIEW_DRAG_STATUS: state.dragStatus,
      PLANETARY_VIEW_MOTION_STATUS: state.motionStatus,
      PLANETARY_VIEW_ZOOM_STATUS: state.zoomStatus,
      PLANETARY_VIEW_KEYBOARD_STATUS: state.keyboardStatus,
      PLANETARY_VIEW_INPUT_STATUS: state.inputStatus,

      PLANETARY_FILES_TRACK_STATUS: "CONTROL_FILE_PRESENT",
      PLANETARY_FINGERS_TRACK_STATUS: "NOT_OWNED_BY_CONTROLS_POINTER_FINGER_ANCHORED_TO_INSPECT",
      PLANETARY_CANVAS_TRACK_STATUS: state.canvasObserved ? "CANVAS_AUTHORITY_OBSERVED" : "WAITING_CANVAS_AUTHORITY",
      PLANETARY_VIEW_TRACK_STATUS: admitted ? "VIEW_CONTROL_TRACK_ACTIVE" : "VIEW_CONTROL_TRACK_WAITING_HANDSHAKE",

      PLANETARY_CONTROL_RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      PLANETARY_CONTROL_RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      CONTROL_INPUT_BOUND: String(bound),
      CONTROL_INPUT_TARGET_FOUND: String(state.inputTargetFound === true),
      CONTROL_INPUT_TARGET_DESCRIPTION: state.inputTargetDescription,
      CONTROL_CANVAS_DELIVERY_STATUS: state.canvasDeliveryStatus,
      CONTROL_CANVAS_DELIVERY_METHOD: state.canvasDeliveryMethod,
      CONTROL_CANVAS_DELIVERY_REASON: state.canvasDeliveryReason,
      CONTROL_PACKET_COUNT: String(state.packetCount),
      CONTROL_DELIVERY_COUNT: String(state.deliveryCount),
      CONTROL_COALESCED_FRAME_COUNT: String(state.coalescedFrameCount),
      CONTROL_RAW_INPUT_EVENT_COUNT: String(state.rawInputEventCount),
      CONTROL_RECEIVER_CACHE_STATUS: state.canvasReceiverCacheStatus,
      CONTROL_RECEIVER_CACHE_METHOD: state.canvasReceiverCacheMethod,
      CONTROL_RECEIVER_PREWARM_STATUS: state.canvasReceiverPrewarmStatus,
      CONTROL_RECEIVER_PREWARM_COUNT: String(state.canvasReceiverPrewarmCount),

      f13Claimed: "false",
      f13CanvasClaimed: "false",
      f21EligibleForNorth: "false",
      f21ClaimedByControls: "false",
      f21ClaimedByDiagnosticRail: "false",
      readyTextAllowed: "false",
      readyTextClaimed: "false",
      visualPassClaimed: "false",
      generatedImage: "false",
      graphicBox: "false",
      webGL: "false",
      webgl: "false"
    };
  }

  function composeReceiptLight() {
    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT",
      queenPacketType: "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_RECEIPT",
      contract: CONTRACT,
      receipt: RECEIPT,
      controlContract: CONTRACT,
      controlsContract: CONTRACT,
      controlReceipt: RECEIPT,
      controlsReceipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      canvasFile: CANVAS_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      surfaceFingerFile: SURFACE_FINGER_FILE,
      labWestFile: LABWEST_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: "queen-planetary-view-input-authority-smooth-frame-delta-aligned-v4-1",

      loaded: true,
      booted: state.booted,
      disposed: state.disposed,
      controlStatus: state.controlStatus,

      newsAlignmentActive: true,
      fibonacciSynchronizationActive: true,
      activeNewsCycle: state.activeNewsCycle,
      activeFibonacci: state.activeFibonacci,

      smoothInputRenewalActive: true,
      requestAnimationFrameCoalescingActive: true,
      canvasReceiverCacheActive: true,
      canvasReceiverPrewarmActive: true,
      horizontalDragPolarityCorrected: true,
      pointerRightTurnsGlobeRight: true,
      packetPhaseFixedAtZero: true,
      canvasLifecycleCallsSuppressedDuringDragFrames: true,
      fullReceiptSuppressedDuringDragFrames: true,
      pointerYawScale: INPUT_TUNING.pointerYawScale,
      pointerPitchScale: INPUT_TUNING.pointerPitchScale,
      horizontalPolarity: INPUT_TUNING.horizontalPolarity,

      queenAuthorityObserved: true,
      queenControlBridgeActive: true,
      queenSuperconductorLanguageActive: true,
      queenReadsLabWestAsOpaqueSuperconductor: true,
      queenOutsideCardinalFunctionality: true,
      queenExcludedFromCardinalFunctionality: true,
      queenIsBishop: false,

      handshakeRequired: true,
      handshakePacketType: HANDSHAKE_PACKET,
      handshakeStatus: state.handshakeStatus,
      handshakeAccepted: state.handshakeAccepted,
      controlHandshakeAccepted: state.handshakeAccepted,
      routeConductorControlHandshakeAccepted: state.handshakeAccepted,
      controlHandshakeAcceptedByQueen: state.handshakeAccepted,
      controlHandshakeAcceptedByControl: state.handshakeAccepted,
      controlHandshakeSatisfied: state.handshakeAccepted,
      handshakeRejected: state.handshakeRejected,
      handshakeSource: state.handshakeSource,
      handshakeRejectionReason: state.handshakeRejectionReason,

      controlFilePresent: true,
      controlHandshakeRequired: true,
      controlHandshakeReady: Boolean(state.routeConductorObserved && state.routeConductorContractRecognized),
      controlHandshakeReceiverObserved: true,
      controlHandshakeReceiverApiReady: true,
      controlBootApiReady: true,
      controlHandshakeStatus: state.handshakeStatus,
      controlHandshakeTarget: FILE,
      controlHandshakeFunnelOwner: "route-conductor-north-bishop",

      routeConductorObserved: state.routeConductorObserved,
      routeConductorAuthoritySource: state.routeConductorAuthoritySource,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorContractRecognized: state.routeConductorContractRecognized,
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      routeConductorControlIntegrationStatus: state.routeConductorControlIntegrationStatus,

      queenBridge: composeQueenBridgeContext(),
      hierarchyRegistryContractExpected: HIERARCHY_REGISTRY_CONTRACT,
      labWestContractsAccepted: ACCEPTED_LABWEST_CONTRACTS.slice(),

      inputAdmissionOpen: state.inputAdmissionOpen,
      inputBound: input.bound,
      inputTargetFound: state.inputTargetFound,
      inputTargetDescription: state.inputTargetDescription,

      touchStatus: state.touchStatus,
      dragStatus: state.dragStatus,
      motionStatus: state.motionStatus,
      zoomStatus: state.zoomStatus,
      keyboardStatus: state.keyboardStatus,
      inputStatus: state.inputStatus,

      planetaryViewControlStatus: diagnosticFields.PLANETARY_VIEW_CONTROL_STATUS,
      planetaryViewTouchStatus: state.touchStatus,
      planetaryViewDragStatus: state.dragStatus,
      planetaryViewMotionStatus: state.motionStatus,
      planetaryViewZoomStatus: state.zoomStatus,
      planetaryViewInputStatus: state.inputStatus,

      viewState: {
        yaw: view.yaw,
        pitch: view.pitch,
        zoom: view.zoom,
        phase: 0,
        minPitch: view.minPitch,
        maxPitch: view.maxPitch,
        minZoom: view.minZoom,
        maxZoom: view.maxZoom
      },

      canvasObserved: state.canvasObserved,
      canvasAuthoritySource: state.canvasAuthoritySource,
      canvasContract: state.canvasContract,
      canvasReceipt: state.canvasReceipt,
      canvasContractRecognized: state.canvasContractRecognized,
      canvasDeliveryStatus: state.canvasDeliveryStatus,
      canvasDeliveryMethod: state.canvasDeliveryMethod,
      canvasDeliveryReason: state.canvasDeliveryReason,
      canvasReceiverCacheStatus: state.canvasReceiverCacheStatus,
      canvasReceiverCacheMethod: state.canvasReceiverCacheMethod,
      canvasReceiverCacheHits: state.canvasReceiverCacheHits,
      canvasReceiverCacheMisses: state.canvasReceiverCacheMisses,
      canvasReceiverPrewarmStatus: state.canvasReceiverPrewarmStatus,
      canvasReceiverPrewarmCount: state.canvasReceiverPrewarmCount,

      lastInputType: state.lastInputType,
      lastDeltaPacket: clonePlain(state.lastDeltaPacket),
      packetCount: state.packetCount,
      deliveryCount: state.deliveryCount,
      rejectionCount: state.rejectionCount,
      watchdogTicks: state.watchdogTicks,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      fullReceiptPublishCount: state.fullReceiptPublishCount,
      lightweightFramePublishCount: state.lightweightFramePublishCount,
      coalescedFrameCount: state.coalescedFrameCount,
      rawInputEventCount: state.rawInputEventCount,
      droppedEmptyFrameCount: state.droppedEmptyFrameCount,
      latestEvent: state.latestEvent,
      errorCount: state.errors.length,

      diagnosticFields: clonePlain(diagnosticFields),
      ...diagnosticFields,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      supportsRouteConductorV10QueenCanvasSync: true,
      supportsRouteConductorV99QueenHandshake: true,
      supportsRouteConductorV98ControlAdmission: true,
      supportsRouteConductorV97ControlHandshakeIntegration: true,
      supportsPlanetaryViewInput: true,
      supportsPointerDrag: true,
      supportsTouchDrag: true,
      supportsWheelZoom: true,
      supportsKeyboardViewControl: true,
      supportsCanvasPublicPacketDelivery: true,
      supportsDiagnosticControlFootprint: true,
      supportsQueenWestGateHierarchyLanguage: true,
      supportsLabWestOpaqueContext: true,
      supportsPointerFingerInspectAnchor: true,
      supportsRequestAnimationFrameCoalescing: true,
      supportsCanvasReceiverCache: true,
      supportsCanvasReceiverPrewarm: true,
      supportsHorizontalDragPolarityCorrection: true,
      supportsPacketPhaseZero: true,
      suppressesCanvasLifecycleCallsDuringDragFrames: true,

      ownsInputAdmission: true,
      ownsPointerInput: true,
      ownsTouchInput: true,
      ownsDragInput: true,
      ownsWheelInput: true,
      ownsKeyboardInput: true,
      ownsPlanetaryViewControlDeltas: true,
      ownsControlReceiptPublication: true,

      ownsHtmlShell: false,
      ownsIndexButtonAuthority: false,
      ownsEastPriestAuthority: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsWestGateHierarchyTruth: false,
      ownsBishopImplementationTruth: false,
      ownsBishopSubjectFiles: false,
      ownsBishopChildFiles: false,
      ownsFingerFiles: false,
      ownsCanvasDrawing: false,
      ownsCanvasExpressionTruth: false,
      ownsCanvasFingerTruth: false,
      ownsPlanetTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsMacroWestRelease: false,
      ownsNorthF21Latch: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) refresh();
    return composeReceiptLight();
  }

  function getReceipt() {
    state.fullReceiptPublishCount += 1;

    return {
      ...composeReceiptLight(),
      handshakePacket: clonePlain(state.handshakePacket),
      lastViewPacket: clonePlain(state.lastViewPacket),
      lastBishopContextPacket: clonePlain(state.lastBishopContextPacket),
      lastHierarchyRegistry: clonePlain(state.lastHierarchyRegistry),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("previousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT),
      line("previousImplementationReceipt", PREVIOUS_IMPLEMENTATION_RECEIPT),
      line("lineageImplementationContract", LINEAGE_IMPLEMENTATION_CONTRACT),
      line("baselineImplementationContract", BASELINE_IMPLEMENTATION_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      line("routeConductorFile", ROUTE_CONDUCTOR_FILE),
      line("canvasFile", CANVAS_FILE),
      line("pointerFingerFile", POINTER_FINGER_FILE),
      line("surfaceFingerFile", SURFACE_FINGER_FILE),
      "",
      "SMOOTH_INPUT",
      line("smoothInputRenewalActive", true),
      line("requestAnimationFrameCoalescingActive", true),
      line("canvasReceiverCacheActive", true),
      line("canvasReceiverPrewarmActive", true),
      line("horizontalDragPolarityCorrected", true),
      line("pointerRightTurnsGlobeRight", true),
      line("packetPhaseFixedAtZero", true),
      line("canvasLifecycleCallsSuppressedDuringDragFrames", true),
      line("fullReceiptSuppressedDuringDragFrames", true),
      line("horizontalPolarity", INPUT_TUNING.horizontalPolarity),
      line("pointerYawScale", INPUT_TUNING.pointerYawScale),
      line("pointerPitchScale", INPUT_TUNING.pointerPitchScale),
      line("coalescedFrameCount", state.coalescedFrameCount),
      line("rawInputEventCount", state.rawInputEventCount),
      line("lightweightFramePublishCount", state.lightweightFramePublishCount),
      "",
      "HANDSHAKE",
      line("handshakeRequired", true),
      line("handshakeStatus", r.handshakeStatus),
      line("handshakeAccepted", r.handshakeAccepted),
      line("controlHandshakeAcceptedByQueen", r.controlHandshakeAcceptedByQueen),
      line("handshakeRejected", r.handshakeRejected),
      line("handshakeSource", r.handshakeSource),
      line("handshakeRejectionReason", r.handshakeRejectionReason),
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorAuthoritySource", r.routeConductorAuthoritySource),
      line("routeConductorContract", r.routeConductorContract),
      line("routeConductorContractRecognized", r.routeConductorContractRecognized),
      line("routeConductorControlIntegrationStatus", r.routeConductorControlIntegrationStatus),
      "",
      "QUEEN_BOUNDARY",
      line("queenControlBridgeActive", true),
      line("queenSuperconductorLanguageActive", true),
      line("queenOutsideCardinalFunctionality", true),
      line("queenExcludedFromCardinalFunctionality", true),
      line("queenIsBishop", false),
      line("controlsInspectBishopInternals", false),
      line("controlsInspectSubjectFiles", false),
      line("controlsInspectChildFiles", false),
      line("controlsInspectFingerFiles", false),
      "",
      "NEWS_FIBONACCI",
      line("newsAlignmentActive", true),
      line("fibonacciSynchronizationActive", true),
      line("activeNewsCycle", state.activeNewsCycle),
      line("activeFibonacci", state.activeFibonacci),
      "",
      "HIERARCHY_CONTEXT",
      line("hierarchyRegistryObserved", state.hierarchyRegistryObserved),
      line("hierarchyRegistryContract", state.hierarchyRegistryContract),
      line("cardinalBishopTermOwnedByHierarchyMap", state.cardinalBishopTermOwnedByHierarchyMap),
      line("highBishopTermRejected", state.highBishopTermRejected),
      line("queenExcludedFromCardinalFunctionality", state.queenExcludedFromCardinalFunctionality),
      line("priestNotBishop", state.priestNotBishop),
      line("pointerFingerFileConfirmed", state.pointerFingerFileConfirmed),
      "",
      "LABWEST_OPAQUE_CONTEXT",
      line("labWestObserved", state.labWestObserved),
      line("labWestAuthoritySource", state.labWestAuthoritySource),
      line("labWestContract", state.labWestContract),
      line("labWestContractRecognized", state.labWestContractRecognized),
      line("labWestSuperconductorStatus", state.labWestSuperconductorStatus),
      line("bishopChordBridgeActive", state.bishopChordBridgeActive),
      line("bishopSubjectFileDelegationActive", state.bishopSubjectFileDelegationActive),
      line("westKnowsBishopsNotChildren", state.westKnowsBishopsNotChildren),
      line("bishopChordStatus", state.bishopChordStatus),
      line("fourWayCanvasHandoffActive", state.fourWayCanvasHandoffActive),
      "",
      "INPUT",
      line("inputAdmissionOpen", r.inputAdmissionOpen),
      line("inputBound", r.inputBound),
      line("inputTargetFound", r.inputTargetFound),
      line("inputTargetDescription", r.inputTargetDescription),
      line("touchStatus", r.touchStatus),
      line("dragStatus", r.dragStatus),
      line("motionStatus", r.motionStatus),
      line("zoomStatus", r.zoomStatus),
      line("keyboardStatus", r.keyboardStatus),
      line("inputStatus", r.inputStatus),
      "",
      "CANVAS_DELIVERY",
      line("canvasObserved", r.canvasObserved),
      line("canvasAuthoritySource", r.canvasAuthoritySource),
      line("canvasContract", r.canvasContract),
      line("canvasContractRecognized", r.canvasContractRecognized),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("canvasDeliveryMethod", r.canvasDeliveryMethod),
      line("canvasDeliveryReason", r.canvasDeliveryReason),
      line("canvasReceiverCacheStatus", r.canvasReceiverCacheStatus),
      line("canvasReceiverCacheMethod", r.canvasReceiverCacheMethod),
      line("canvasReceiverCacheHits", r.canvasReceiverCacheHits),
      line("canvasReceiverCacheMisses", r.canvasReceiverCacheMisses),
      line("canvasReceiverPrewarmStatus", r.canvasReceiverPrewarmStatus),
      line("canvasReceiverPrewarmCount", r.canvasReceiverPrewarmCount),
      line("packetCount", r.packetCount),
      line("deliveryCount", r.deliveryCount),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f13CanvasClaimed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByControls", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("controlStatus", r.controlStatus),
      line("handshakeStatus", r.handshakeStatus),
      line("handshakeAccepted", r.handshakeAccepted),
      line("inputAdmissionOpen", r.inputAdmissionOpen),
      line("inputBound", r.inputBound),
      line("inputStatus", r.inputStatus),
      line("smoothInputRenewalActive", r.smoothInputRenewalActive),
      line("horizontalDragPolarityCorrected", r.horizontalDragPolarityCorrected),
      line("pointerRightTurnsGlobeRight", r.pointerRightTurnsGlobeRight),
      line("packetPhaseFixedAtZero", r.packetPhaseFixedAtZero),
      line("canvasLifecycleCallsSuppressedDuringDragFrames", r.canvasLifecycleCallsSuppressedDuringDragFrames),
      line("requestAnimationFrameCoalescingActive", r.requestAnimationFrameCoalescingActive),
      line("canvasReceiverCacheActive", r.canvasReceiverCacheActive),
      line("canvasReceiverPrewarmActive", r.canvasReceiverPrewarmActive),
      line("routeConductorContract", r.routeConductorContract),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("canvasDeliveryMethod", r.canvasDeliveryMethod),
      line("packetCount", r.packetCount),
      line("coalescedFrameCount", r.coalescedFrameCount),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      view: clonePlain(view),
      input: {
        bound: input.bound,
        pointerActive: input.pointerActive,
        pointerId: input.pointerId,
        targetDescription: state.inputTargetDescription
      },
      frame: clonePlain(frame),
      receiverCache: {
        authoritySource: receiverCache.authoritySource,
        contract: receiverCache.contract,
        receipt: receiverCache.receipt,
        method: receiverCache.method,
        expiresAt: receiverCache.expiresAt,
        missCount: receiverCache.missCount,
        hitCount: receiverCache.hitCount,
        prewarmCount: receiverCache.prewarmCount,
        prewarmStatus: receiverCache.prewarmStatus,
        prewarmAt: receiverCache.prewarmAt
      }
    };
  }

  function getViewPacket() {
    return clonePlain(state.lastViewPacket || composeViewDeltaPacket({
      inputType: "view-state-read",
      deltaYaw: 0,
      deltaPitch: 0,
      deltaZoom: 0
    }));
  }

  function getQueenBridgeState() {
    return clonePlain(composeQueenBridgeContext());
  }

  function refresh() {
    readRouteConductorAuthority();
    readCanvasAuthority(true);
    readLabWestBishopBridge();

    if (!state.handshakeAccepted) observeHandshake();
    else if (!input.bound) bindInputIfAdmitted();
    else prewarmCanvasReceiver("refresh");

    updateInputState();
    updateDataset();
    publishGlobals("refresh");

    return getReceiptLight(false);
  }

  function dispose(reason = "manual-dispose") {
    if (watchdogTimer) {
      root.clearInterval(watchdogTimer);
      watchdogTimer = 0;
    }

    if (frame.rafId) cancelFrame(frame.rafId);
    resetFrameQueue();

    unbindInput();
    invalidateCanvasReceiverCache("dispose");

    state.disposed = true;
    state.controlStatus = CONTROL_STATUS.DISPOSED;
    state.inputAdmissionOpen = false;

    updateInputState();
    updateDataset();

    record("HEARTH_CONTROLS_QUEEN_DISPOSED", { reason });
    publishGlobals("dispose");

    return getReceipt();
  }

  function startWatchdog() {
    if (!root.setInterval || watchdogTimer) return;

    watchdogTimer = root.setInterval(() => {
      state.watchdogTicks += 1;

      readLabWestBishopBridge();

      if (!state.handshakeAccepted) observeHandshake();
      else if (!input.bound) bindInputIfAdmitted();
      else {
        readCanvasAuthority(false);
        updateInputState();
        updateDataset();
      }

      if (state.watchdogTicks >= INPUT_TUNING.watchdogMaxTicks || state.disposed) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;

        record("HEARTH_CONTROLS_QUEEN_WATCHDOG_STOPPED", {
          watchdogTicks: state.watchdogTicks,
          handshakeAccepted: state.handshakeAccepted,
          inputBound: input.bound
        });
      }
    }, INPUT_TUNING.watchdogIntervalMs);
  }

  function updateDatasetLight(packet = null) {
    setDataset("hearthControlsLoaded", "true");
    setDataset("hearthControlsPresent", "true");
    setDataset("hearthControlsContract", CONTRACT);
    setDataset("hearthControlsReceipt", RECEIPT);
    setDataset("hearthControlsInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthControlsInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthControlsVersion", VERSION);

    setDataset("hearthControlsSmoothInputRenewalActive", "true");
    setDataset("hearthControlsRequestAnimationFrameCoalescingActive", "true");
    setDataset("hearthControlsCanvasReceiverCacheActive", "true");
    setDataset("hearthControlsCanvasReceiverPrewarmActive", "true");
    setDataset("hearthControlsHorizontalDragPolarityCorrected", "true");
    setDataset("hearthControlsPointerRightTurnsGlobeRight", "true");
    setDataset("hearthControlsPacketPhaseFixedAtZero", "true");
    setDataset("hearthControlsCanvasLifecycleCallsSuppressedDuringDragFrames", "true");
    setDataset("hearthControlsFullReceiptSuppressedDuringDragFrames", "true");

    setDataset("hearthControlHandshakeStatus", state.handshakeStatus);
    setDataset("hearthControlHandshakeAccepted", String(state.handshakeAccepted));
    setDataset("hearthControlInputAdmissionOpen", String(state.inputAdmissionOpen));
    setDataset("hearthControlInputBound", String(input.bound === true));
    setDataset("hearthPlanetaryViewTouchStatus", state.touchStatus);
    setDataset("hearthPlanetaryViewDragStatus", state.dragStatus);
    setDataset("hearthPlanetaryViewMotionStatus", state.motionStatus);
    setDataset("hearthPlanetaryViewZoomStatus", state.zoomStatus);
    setDataset("hearthPlanetaryViewKeyboardStatus", state.keyboardStatus);
    setDataset("hearthPlanetaryViewInputStatus", state.inputStatus);

    setDataset("hearthControlsViewYaw", String(view.yaw));
    setDataset("hearthControlsViewPitch", String(view.pitch));
    setDataset("hearthControlsViewZoom", String(view.zoom));
    setDataset("hearthControlsViewPhase", "0");

    setDataset("hearthControlCanvasDeliveryStatus", state.canvasDeliveryStatus);
    setDataset("hearthControlCanvasDeliveryMethod", state.canvasDeliveryMethod);
    setDataset("hearthControlCanvasDeliveryReason", state.canvasDeliveryReason);
    setDataset("hearthControlPacketCount", String(state.packetCount));
    setDataset("hearthControlDeliveryCount", String(state.deliveryCount));
    setDataset("hearthControlCoalescedFrameCount", String(state.coalescedFrameCount));
    setDataset("hearthControlRawInputEventCount", String(state.rawInputEventCount));
    setDataset("hearthControlReceiverCacheStatus", state.canvasReceiverCacheStatus);
    setDataset("hearthControlReceiverCacheMethod", state.canvasReceiverCacheMethod);
    setDataset("hearthControlReceiverPrewarmStatus", state.canvasReceiverPrewarmStatus);
    setDataset("hearthControlReceiverPrewarmCount", String(state.canvasReceiverPrewarmCount));

    if (packet) {
      setDataset("hearthControlsLastInputType", packet.inputType || "");
      setDataset("hearthControlsLastDeltaYaw", String(packet.deltaYaw || 0));
      setDataset("hearthControlsLastDeltaPitch", String(packet.deltaPitch || 0));
      setDataset("hearthControlsLastDeltaZoom", String(packet.deltaZoom || 0));
      setDataset("hearthControlsLastFrameAt", packet.composedAt || "");
      setDataset("hearthControlsLastFramePhase", "0");
    }

    setDataset("hearthControlsF13Claimed", "false");
    setDataset("hearthControlsF13CanvasClaimed", "false");
    setDataset("hearthControlsF21EligibleForNorth", "false");
    setDataset("hearthControlsF21Claimed", "false");
    setDataset("hearthControlsReadyTextAllowed", "false");
    setDataset("hearthControlsReadyTextClaimed", "false");
    setDataset("hearthControlsVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function updateDataset() {
    const fields = composeDiagnosticFields();

    updateDatasetLight();

    setDataset("hearthControlFilePresent", "true");
    setDataset("hearthControlFile", FILE);
    setDataset("hearthControlFileContract", CONTRACT);
    setDataset("hearthControlFileReceipt", RECEIPT);
    setDataset("hearthControlFileExpectedNotYetBuilt", "false");
    setDataset("hearthControlFileAbsenceExpected", "false");
    setDataset("hearthControlAbsenceNotTreatedAsCase5", "true");

    setDataset("hearthControlHandshakeRequired", "true");
    setDataset("hearthControlHandshakeAcceptedByQueen", String(state.handshakeAccepted));
    setDataset("hearthControlHandshakeTarget", FILE);
    setDataset("hearthControlHandshakeFunnelOwner", "ROUTE_CONDUCTOR");

    setDataset("hearthRouteConductorControlIntegrationStatus", state.routeConductorControlIntegrationStatus);
    setDataset("hearthRouteConductorControlHandshakeRequired", "true");
    setDataset("hearthRouteConductorControlHandshakeTarget", FILE);
    setDataset("hearthRouteConductorContract", state.routeConductorContract);
    setDataset("hearthRouteConductorReceipt", state.routeConductorReceipt);
    setDataset("hearthRouteConductorContractRecognized", String(state.routeConductorContractRecognized));

    setDataset("hearthQueenAuthorityObserved", "true");
    setDataset("hearthQueenControlBridgeActive", "true");
    setDataset("hearthQueenSuperconductorLanguageActive", "true");
    setDataset("hearthQueenOutsideCardinalFunctionality", "true");
    setDataset("hearthQueenExcludedFromCardinalFunctionality", "true");
    setDataset("hearthQueenIsBishop", "false");

    setDataset("hearthControlsPointerFingerFile", POINTER_FINGER_FILE);
    setDataset("hearthControlsSurfaceFingerFile", SURFACE_FINGER_FILE);
    setDataset("hearthControlsPointerFingerFileConfirmed", "true");

    setDataset("hearthControlsInspectBishopInternals", "false");
    setDataset("hearthControlsInspectSubjectFiles", "false");
    setDataset("hearthControlsInspectChildFiles", "false");
    setDataset("hearthControlsInspectFingerFiles", "false");

    setDataset("hearthControlsHierarchyRegistryObserved", String(Boolean(state.hierarchyRegistryObserved)));
    setDataset("hearthControlsHierarchyRegistryContract", state.hierarchyRegistryContract);
    setDataset("hearthControlsHierarchyRegistryReceipt", state.hierarchyRegistryReceipt);
    setDataset("hearthControlsHierarchyRegistryStatus", state.hierarchyRegistryStatus);
    setDataset("hearthControlsCardinalBishopTermOwnedByHierarchyMap", state.cardinalBishopTermOwnedByHierarchyMap);
    setDataset("hearthControlsHighBishopTermRejected", state.highBishopTermRejected);
    setDataset("hearthControlsQueenExcludedFromCardinalFunctionality", state.queenExcludedFromCardinalFunctionality);
    setDataset("hearthControlsPriestNotBishop", state.priestNotBishop);

    setDataset("hearthControlsLabWestSuperconductorStatus", state.labWestSuperconductorStatus);
    setDataset("hearthControlsLabWestAuthoritySource", state.labWestAuthoritySource);
    setDataset("hearthControlsLabWestContract", state.labWestContract);
    setDataset("hearthControlsLabWestContractRecognized", String(Boolean(state.labWestContractRecognized)));
    setDataset("hearthControlsBishopChordBridgeActive", String(Boolean(state.bishopChordBridgeActive)));
    setDataset("hearthControlsBishopSubjectFileDelegationActive", String(Boolean(state.bishopSubjectFileDelegationActive)));
    setDataset("hearthControlsWestKnowsBishopsNotChildren", String(Boolean(state.westKnowsBishopsNotChildren)));
    setDataset("hearthControlsBishopChordStatus", state.bishopChordStatus);
    setDataset("hearthControlsFourWayCanvasHandoffActive", String(Boolean(state.fourWayCanvasHandoffActive)));

    setDataset("hearthJsIntegrationFunnel", fields.JS_INTEGRATION_FUNNEL);

    setDataset("hearthPlanetaryControlLifecycleSchemaActive", "true");
    setDataset("hearthPlanetaryControlFootprintStatus", fields.PLANETARY_CONTROL_FOOTPRINT_STATUS);
    setDataset("hearthPlanetaryControlDiagnosticStatus", state.controlStatus);
    setDataset("hearthPlanetaryControlGateStatus", fields.PLANETARY_CONTROL_GATE_STATUS);

    setDataset("hearthPlanetaryViewControlStatus", fields.PLANETARY_VIEW_CONTROL_STATUS);
    setDataset("hearthControlInputTargetFound", String(state.inputTargetFound === true));
    setDataset("hearthControlInputTargetDescription", state.inputTargetDescription);

    setDataset("hearthControlsFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthControlsRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthControlsRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthControlsPostgameStatus", state.postgameStatus);

    root.HEARTH_CONTROLS_DIAGNOSTIC_FIELDS = clonePlain(fields);
    if (root.HEARTH && typeof root.HEARTH === "object") root.HEARTH.controlsDiagnosticFields = clonePlain(fields);
  }

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of QUEEN_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();
    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_CONTROLS_RECEIPT = receipt;
    root.HEARTH_PLANETARY_CONTROLS_RECEIPT = receipt;
    root.HEARTH_CONTROL_FILE_RECEIPT = receipt;
    root.HEARTH_CONTROL_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT = receipt;
    root.HEARTH_CONTROLS_QUEEN_RECEIPT = receipt;
    root.HEARTH_QUEEN_CONTROLS_RECEIPT = receipt;
    root.HEARTH_QUEEN_SUPERCONDUCTOR_CONTROLS_RECEIPT = receipt;
    root.HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_RECEIPT = receipt;
    root.HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_RECEIPT_v4_1 = receipt;
    root.HEARTH_CONTROL_HANDSHAKE_RECEIPT = receipt;
    root.HEARTH_CONTROLS_HANDSHAKE_RECEIPT = receipt;
    root.HEARTH_QUEEN_CONTROL_HANDSHAKE_RECEIPT = receipt;

    hearth.controlsReceipt = receipt;
    hearth.planetaryControlsReceipt = receipt;
    hearth.controlFileReceipt = receipt;
    hearth.controlAuthorityReceipt = receipt;
    hearth.controlsPlanetaryViewInputHandshakeReceipt = receipt;
    hearth.controlsQueenReceipt = receipt;
    hearth.queenControlsReceipt = receipt;
    hearth.queenSuperconductorControlsReceipt = receipt;
    hearth.controlsSmoothPointerDeltaCanvasFrameAlignmentReceipt = receipt;
    hearth.controlHandshakeReceipt = receipt;
    hearth.controlsHandshakeReceipt = receipt;
    hearth.queenControlHandshakeReceipt = receipt;

    lab.hearthControlsReceipt = receipt;
    lab.hearthPlanetaryControlsReceipt = receipt;
    lab.hearthControlFileReceipt = receipt;
    lab.hearthControlAuthorityReceipt = receipt;
    lab.hearthQueenControlsReceipt = receipt;
    lab.hearthQueenSuperconductorControlsReceipt = receipt;
    lab.hearthControlsSmoothPointerDeltaCanvasFrameAlignmentReceipt = receipt;

    root.HEARTH_CONTROLS_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);
    root.HEARTH_CONTROLS_QUEEN_BRIDGE_STATE = getQueenBridgeState();
    hearth.controlsDiagnosticFields = clonePlain(receipt.diagnosticFields);
    hearth.controlsQueenBridgeState = getQueenBridgeState();

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    if (reason !== "view-delta") {
      record("HEARTH_CONTROLS_QUEEN_GLOBALS_PUBLISHED", {
        reason,
        contract: CONTRACT,
        internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
        handshakeStatus: state.handshakeStatus,
        handshakeAccepted: state.handshakeAccepted,
        inputBound: input.bound,
        pointerFingerFile: POINTER_FINGER_FILE,
        smoothInputRenewalActive: true,
        packetPhaseFixedAtZero: true,
        canvasLifecycleCallsSuppressedDuringDragFrames: true,
        visualPassClaimed: false
      });
    }

    return true;
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "QUEEN_BOOTING_SMOOTH_FRAME_DELTA_ALIGNMENT_V4_1";

      publishGlobals("boot-early");
      readRouteConductorAuthority();
      readCanvasAuthority(true);
      readLabWestBishopBridge();
      observeHandshake();

      state.booted = true;
      state.booting = false;

      refresh();
      startWatchdog();

      record("HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_V4_1_BOOTED", {
        contract: CONTRACT,
        file: FILE,
        routeConductorContract: state.routeConductorContract,
        handshakeStatus: state.handshakeStatus,
        inputAdmissionOpen: state.inputAdmissionOpen,
        inputBound: input.bound,
        pointerFingerFile: POINTER_FINGER_FILE,
        smoothInputRenewalActive: true,
        horizontalDragPolarityCorrected: true,
        requestAnimationFrameCoalescingActive: true,
        canvasReceiverCacheActive: true,
        canvasReceiverPrewarmActive: true,
        packetPhaseFixedAtZero: true,
        canvasLifecycleCallsSuppressedDuringDragFrames: true,
        visualPassClaimed: false
      });

      publishGlobals("boot-complete");
      return getReceipt();
    });

    return bootPromise;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    canvasFile: CANVAS_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    surfaceFingerFile: SURFACE_FINGER_FILE,
    labWestFile: LABWEST_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    ROUTE_CONDUCTOR_V10,
    ROUTE_CONDUCTOR_V9_9,
    ROUTE_CONDUCTOR_V9_8,
    ROUTE_CONDUCTOR_V9_7,
    ROUTE_CONDUCTOR_V9_6,
    ROUTE_CONDUCTOR_V9_5,
    ROUTE_CONDUCTOR_V9_4,
    CURRENT_CANVAS_CONTRACT,

    controlPacket: CONTROL_PACKET,
    handshakePacket: HANDSHAKE_PACKET,
    queenPacket: QUEEN_PACKET,

    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
    acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
    acceptedLabWestContracts: ACCEPTED_LABWEST_CONTRACTS.slice(),
    hierarchyRegistryContract: HIERARCHY_REGISTRY_CONTRACT,
    hierarchyRegistryReceipt: HIERARCHY_REGISTRY_RECEIPT,

    boot,
    start: boot,
    init: boot,
    run: boot,
    refresh,
    dispose,

    observeHandshake,
    receiveRouteConductorControlHandshake,
    consumeRouteConductorControlHandshake,
    receiveControlHandshake,
    consumeControlHandshake,
    receiveControlHandshakePacket,
    acceptControlHandshakePacket,
    receiveQueenControlHandshake,
    consumeQueenControlHandshake,

    receiveBishopChordContext,
    consumeBishopChordContext,
    receiveWestGateHierarchyContext,
    consumeWestGateHierarchyContext,

    readRouteConductorAuthority,
    readCanvasAuthority,
    invalidateCanvasReceiverCache,
    prewarmCanvasReceiver,
    readLabWestBishopBridge,
    readHierarchyRegistry,
    getQueenBridgeState,

    bindInputIfAdmitted,
    unbindInput,
    applyViewDelta,
    queueViewDelta,
    flushQueuedViewDelta,
    composeViewDeltaPacket,
    deliverControlPacketToCanvas,

    getReceipt,
    getReceiptLight,
    getControlReceipt: getReceiptLight,
    getControlsReceipt: getReceiptLight,
    getControlHandshakeReceipt: getReceiptLight,
    getControlHandshakeSummary: getReceiptLight,
    getControlSummary: getReceiptLight,
    getControlState: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getReceiptText,
    getStatusText,
    getState,
    getViewPacket,
    composeDiagnosticFields,

    publishGlobals,
    publishAliasPaths,
    publishReceiptAliases,
    publishControlPacketLight,
    updateDataset,
    updateDatasetLight,

    supportsRouteConductorV10QueenCanvasSync: true,
    supportsRouteConductorV99QueenHandshake: true,
    supportsRouteConductorV98ControlAdmission: true,
    supportsRouteConductorV97ControlHandshakeIntegration: true,
    supportsPlanetaryViewInput: true,
    supportsPointerDrag: true,
    supportsTouchDrag: true,
    supportsWheelZoom: true,
    supportsKeyboardViewControl: true,
    supportsCanvasPublicPacketDelivery: true,
    supportsDiagnosticControlFootprint: true,
    supportsQueenWestGateHierarchyLanguage: true,
    supportsLabWestOpaqueContext: true,
    supportsPointerFingerInspectAnchor: true,
    supportsRequestAnimationFrameCoalescing: true,
    supportsCanvasReceiverCache: true,
    supportsCanvasReceiverPrewarm: true,
    supportsHorizontalDragPolarityCorrection: true,
    supportsPacketPhaseZero: true,
    suppressesCanvasLifecycleCallsDuringDragFrames: true,

    smoothInputRenewalActive: true,
    requestAnimationFrameCoalescingActive: true,
    canvasReceiverCacheActive: true,
    canvasReceiverPrewarmActive: true,
    horizontalDragPolarityCorrected: true,
    pointerRightTurnsGlobeRight: true,
    packetPhaseFixedAtZero: true,
    canvasLifecycleCallsSuppressedDuringDragFrames: true,
    fullReceiptSuppressedDuringDragFrames: true,

    ownsInputAdmission: true,
    ownsPointerInput: true,
    ownsTouchInput: true,
    ownsDragInput: true,
    ownsWheelInput: true,
    ownsKeyboardInput: true,
    ownsPlanetaryViewControlDeltas: true,
    ownsControlReceiptPublication: true,

    ownsHtmlShell: false,
    ownsIndexButtonAuthority: false,
    ownsEastPriestAuthority: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsWestGateHierarchyTruth: false,
    ownsBishopImplementationTruth: false,
    ownsBishopSubjectFiles: false,
    ownsBishopChildFiles: false,
    ownsFingerFiles: false,
    ownsCanvasDrawing: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasFingerTruth: false,
    ownsPlanetTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsMacroWestRelease: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    queenOutsideCardinalFunctionality: true,
    queenExcludedFromCardinalFunctionality: true,
    queenIsBishop: false,
    controlsInspectBishopInternals: false,
    controlsInspectSubjectFiles: false,
    controlsInspectChildFiles: false,
    controlsInspectFingerFiles: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    },

    get view() {
      return view;
    }
  });

  try {
    publishGlobals("immediate-publication");

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
      } else {
        boot();
      }
    } else {
      boot();
    }
  } catch (error) {
    recordError("HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_V4_1_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
