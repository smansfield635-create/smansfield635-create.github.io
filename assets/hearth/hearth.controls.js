// /assets/hearth/hearth.controls.js
// HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1
// Internal renewal:
// HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5
// Full-file replacement.
// Planetary Controls / Queen view-input authority only.
// Purpose:
// - Preserve the public v1 Controls contract expected by Route Conductor, diagnostics, Canvas, and Hex Surface.
// - Accept Route Conductor v10_2 / v10_1 / v10 / v9 lineage control-handshake packets after validation.
// - Keep Controls as the Queen view-input authority, outside the cardinal Bishop files.
// - Transmit input through the lawful path:
//   Route Conductor -> Controls Queen -> Canvas public receiver -> Hex Surface gate -> Pointer Finger.
// - Preserve horizontal drag polarity because finger-right already turns the visible globe right.
// - Preserve corrected vertical drag polarity: finger-up turns globe up, finger-down turns globe down.
// - Coalesce pointer/touch/wheel/keyboard deltas through requestAnimationFrame.
// - Cache and prewarm Canvas public receiver lookup during active input.
// - Publish lightweight view packets during drag.
// - Keep packet phase at 0 so yaw/phase is not double-applied by Canvas/Hex Surface.
// - Require Hex Surface as the downstream gate before Pointer Finger expression.
// - Do not deliver directly to Pointer Finger.
// - Do not call Canvas lifecycle, mount, boot, start, init, render, drawFrame, or drawVisibleExpression from per-frame input.
// - Preserve no terrain truth, hydrology truth, elevation truth, material truth,
//   Canvas drawing authority, Hex truth, Pointer Finger truth, F13 claim, F21 claim,
//   ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const RECEIPT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_RECEIPT_v1";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT_v5";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_RECEIPT_v4_2";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2";

  const VERSION =
    "2026-06-06.hearth-controls-hex-gate-pointer-finger-transmission-v5";

  const FILE = "/assets/hearth/hearth.controls.js";
  const ROUTE = "/showroom/globe/hearth/";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const ROUTE_CONDUCTOR_V10_2 =
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2";
  const ROUTE_CONDUCTOR_V10_1 =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1";
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
    ROUTE_CONDUCTOR_V10_2,
    ROUTE_CONDUCTOR_V10_1,
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

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3",
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const ACCEPTED_HEX_SURFACE_CONTRACTS = Object.freeze([
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_1",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_2",
    "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v3",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v2",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v1"
  ]);

  const ACCEPTED_HEX_AUTHORITY_CONTRACTS = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1"
  ]);

  const CONTROL_PACKET = "HEARTH_CONTROLS_HEX_GATE_VIEW_DELTA_PACKET_v5";
  const HANDSHAKE_PACKET = "HEARTH_ROUTE_CONDUCTOR_TO_QUEEN_CONTROLS_HEX_GATE_HANDSHAKE_PACKET_v5";
  const QUEEN_PACKET = "HEARTH_QUEEN_CONTROLS_HEX_GATE_VIEW_PACKET_v5";

  const INPUT_TUNING = Object.freeze({
    horizontalPolarity: -1,
    verticalPolarity: -1,
    pointerYawScale: 0.0092,
    pointerPitchScale: 0.0084,
    wheelZoomScale: -0.00135,
    keyboardYawStep: 0.075,
    keyboardPitchStep: 0.075,
    keyboardZoomStep: 0.09,
    receiverCacheMs: 1800,
    watchdogIntervalMs: 850,
    watchdogMaxTicks: 72,
    minPointerDelta: 0.01
  });

  const HANDSHAKE_STATUS = Object.freeze({
    WAITING_ROUTE_CONDUCTOR_AUTHORITY: "WAITING_ROUTE_CONDUCTOR_AUTHORITY",
    WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE: "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    ACCEPTED: "ACCEPTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    REJECTED: "REJECTED_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE"
  });

  const CONTROL_STATUS = Object.freeze({
    LOADED: "CONTROL_FILE_LOADED",
    WAITING_HANDSHAKE: "CONTROL_FILE_PRESENT_WAITING_HANDSHAKE",
    ACTIVE: "CONTROL_RUNTIME_ACTIVE_HEX_GATE_TRANSMISSION_READY",
    TARGET_PENDING: "CONTROL_RUNTIME_ACTIVE_CANVAS_TARGET_PENDING",
    DISPOSED: "CONTROL_RUNTIME_DISPOSED"
  });

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByControls: false,
    f13ClaimedByCanvas: false,
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
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
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

  const ROUTE_CONDUCTOR_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE",
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
    "HEARTH.routeConductorHexGatePointerFingerTransmission",
    "HEARTH.routeConductorCanvasDomSurfaceAdmissionAndRelease",
    "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
    "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
    "HEARTH.routeConductor",
    "HEARTH.routeNorthBishop",
    "HEARTH.southRouteConductor",
    "HEARTH.routeConductorPrimaryGate",
    "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmission",
    "DEXTER_LAB.hearthRouteConductorCanvasDomSurfaceAdmissionAndRelease",
    "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
    "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteNorthBishop",
    "DEXTER_LAB.hearthSouthRouteConductor"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
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
    "HEARTH.canvasHubRafSphereRotationPairReceiver",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
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
    "DEXTER_LAB.hearthCanvasHubRafSphereRotationPairReceiver",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver",
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

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_PAIR_RENDERER",
    "HEARTH_HEX_INTERACTIVE_SURFACE",
    "HEARTH.hexSurfacePairPointerFingerGate",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurface",
    "HEARTH.hexPairRenderer",
    "HEARTH.hexInteractiveSurface",
    "DEXTER_LAB.hearthHexSurfacePairPointerFingerGate",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexPairRenderer"
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthHexPixelHandshakeAuthority"
  ]);

  const POINTER_FINGER_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_POINTER",
    "HEARTH_POINTER_FINGER",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerPointer",
    "HEARTH.pointerFinger",
    "HEARTH.canvasPointerFinger",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerPointer",
    "DEXTER_LAB.hearthPointerFinger",
    "DEXTER_LAB.hearthCanvasPointerFinger"
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
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT",
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlFile",
    "HEARTH.controlAuthority",
    "HEARTH.planetaryViewControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.queenSuperconductorControls",
    "HEARTH.controlsVerticalPolaritySmoothCanvasHexPairAlignment",
    "HEARTH.controlsHexGatePointerFingerTransmission",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthControlFile",
    "DEXTER_LAB.hearthControlAuthority",
    "DEXTER_LAB.hearthPlanetaryViewControls",
    "DEXTER_LAB.hearthControlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthQueenSuperconductorControls",
    "DEXTER_LAB.hearthControlsVerticalPolaritySmoothCanvasHexPairAlignment",
    "DEXTER_LAB.hearthControlsHexGatePointerFingerTransmission"
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
    restoreUserSelect: "",
    restoreWebkitUserSelect: "",
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
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CONTROLS_V5_LOADED",

    queenControlBridgeActive: true,
    queenOutsideCardinalFunctionality: true,
    queenExcludedFromCardinalFunctionality: true,
    queenIsBishop: false,

    activeNewsCycle: "ROUTE_CONDUCTOR_QUEEN_CANVAS_HEX_GATE_POINTER_FINGER",
    activeFibonacci: "F8_TO_F13_CONTROL_EXTENSION_HELD",

    hexGateTransmissionActive: true,
    hexGateRequiredBeforePointerFinger: true,
    pointerFingerDirectDeliverySuppressed: true,
    canvasPublicReceiverRequired: true,
    canvasLifecycleCallsSuppressedDuringDragFrames: true,

    smoothInputRenewalActive: true,
    requestAnimationFrameCoalescingActive: true,
    canvasReceiverCacheActive: true,
    canvasReceiverPrewarmActive: true,
    horizontalDragPolarityPreserved: true,
    verticalDragPolarityCorrected: true,
    pointerRightTurnsGlobeRight: true,
    pointerUpTurnsGlobeUp: true,
    pointerDownTurnsGlobeDown: true,
    modestResponseIncreaseActive: true,
    packetPhaseFixedAtZero: true,
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

    hexSurfaceObserved: false,
    hexSurfaceAuthoritySource: "NONE",
    hexSurfaceContract: "",
    hexSurfaceReceipt: "",
    hexSurfaceContractRecognized: false,
    hexGateStatus: "WAITING_CANVAS_TO_HEX_GATE_TRANSMISSION",

    hexAuthorityObserved: false,
    hexAuthoritySource: "NONE",
    hexAuthorityContract: "",
    hexAuthorityReceipt: "",
    hexAuthorityRecognized: false,

    pointerFingerObserved: false,
    pointerFingerAuthoritySource: "NONE",
    pointerFingerContract: "",
    pointerFingerReceipt: "",
    pointerFingerDirectDeliverySuppressedStatus: "DIRECT_DELIVERY_SUPPRESSED_HEX_GATE_REQUIRED",

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
    lastFrameFlushAt: "",
    lastFrameDeltaYaw: 0,
    lastFrameDeltaPitch: 0,
    lastFrameDeltaZoom: 0,
    lastRawDx: 0,
    lastRawDy: 0,

    firstFailedCoordinate: "WAITING_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE",
    recommendedNextFile: ROUTE_CONDUCTOR_FILE,
    recommendedNextAction: "PUBLISH_ROUTE_CONDUCTOR_TO_QUEEN_HEX_GATE_CONTROL_HANDSHAKE",
    postgameStatus: "QUEEN_LOADED_WAITING_ROUTE_CONDUCTOR_HEX_GATE_HANDSHAKE",

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
    for (const name of names || []) {
      const value = readPath(name);
      if (value && isObject(value)) return { name, value };
    }

    return { name: "NONE", value: null };
  }

  function dataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
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
            : element.getAttribute && element.getAttribute("data-hearth-visible-canvas") !== null
              ? "[data-hearth-visible-canvas]"
              : element.getAttribute && element.getAttribute("data-hearth-canvas-hub") !== null
                ? "[data-hearth-canvas-hub]"
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
        "hexSurfaceContract",
        "currentHexSurfaceContract",
        "hexContract",
        "hexAuthorityContract",
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
        "hexSurfaceReceipt",
        "currentHexSurfaceReceipt",
        "hexReceipt",
        "hexAuthorityReceipt",
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
      "getHexSurfaceReceipt",
      "getHexSurfaceSummary",
      "getHexReceipt",
      "getPointerFingerReceipt",
      "getPointerFingerSummary",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.controlReceipt)) return authority.controlReceipt;
    if (isObject(authority.controlHandshakeReceipt)) return authority.controlHandshakeReceipt;
    if (isObject(authority.canvasStationSummary)) return authority.canvasStationSummary;
    if (isObject(authority.hexSurfaceReceipt)) return authority.hexSurfaceReceipt;
    if (isObject(authority.pointerFingerReceipt)) return authority.pointerFingerReceipt;
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

  function hexSurfaceContractRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_HEX_SURFACE_CONTRACTS.includes(text) || text.includes("HEARTH_HEX_SURFACE");
  }

  function hexAuthorityRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_HEX_AUTHORITY_CONTRACTS.includes(text) || text.includes("HEARTH_HEX_FOUR_PAIR");
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
      ds.hearthCanvasCurrentParentContract,
      ds.hearthCanvasParentContract,
      ds.hearthSouthCurrentCanvasParentContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthCanvasReceipt,
      ds.hearthCanvasCurrentParentReceipt,
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

  function readHexSurfaceAuthority() {
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthHexSurfaceContract,
      ds.hearthHexSurfaceRendererContract,
      ds.hearthHexPairRendererContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthHexSurfaceReceipt,
      ds.hearthHexSurfaceRendererReceipt
    );

    state.hexSurfaceObserved = Boolean(found.value || contract);
    state.hexSurfaceAuthoritySource = found.name;
    state.hexSurfaceContract = contract;
    state.hexSurfaceReceipt = receiptName;
    state.hexSurfaceContractRecognized = hexSurfaceContractRecognized(contract);

    state.hexGateStatus = state.hexSurfaceObserved
      ? "HEX_SURFACE_GATE_OBSERVED_FOR_CANVAS_TRANSMISSION"
      : "WAITING_HEX_SURFACE_GATE";

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName
    };
  }

  function readHexAuthority() {
    const found = firstGlobal(HEX_AUTHORITY_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthHexAuthorityContract,
      ds.hearthHexFourPairAuthorityContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthHexAuthorityReceipt,
      ds.hearthHexFourPairAuthorityReceipt
    );

    state.hexAuthorityObserved = Boolean(found.value || contract);
    state.hexAuthoritySource = found.name;
    state.hexAuthorityContract = contract;
    state.hexAuthorityReceipt = receiptName;
    state.hexAuthorityRecognized = hexAuthorityRecognized(contract);

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName
    };
  }

  function readPointerFingerAuthority() {
    const found = firstGlobal(POINTER_FINGER_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthPointerFingerContract,
      ds.hearthCanvasFingerInspectContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthPointerFingerReceipt,
      ds.hearthCanvasFingerInspectReceipt
    );

    state.pointerFingerObserved = Boolean(found.value || contract);
    state.pointerFingerAuthoritySource = found.name;
    state.pointerFingerContract = contract;
    state.pointerFingerReceipt = receiptName;
    state.pointerFingerDirectDeliverySuppressedStatus =
      "DIRECT_DELIVERY_SUPPRESSED_HEX_GATE_REQUIRED";

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract,
      receiptName
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
      "receiveHexGateViewControlPacket",
      "consumeHexGateViewControlPacket",
      "receiveControlsHexGatePacket",
      "consumeControlsHexGatePacket",
      "receiveQueenHexGateViewPacket",
      "consumeQueenHexGateViewPacket",
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

    readHexSurfaceAuthority();
    readHexAuthority();
    readPointerFingerAuthority();

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
      canvasContract: canvas.contract,
      hexSurfaceObserved: state.hexSurfaceObserved,
      pointerFingerObserved: state.pointerFingerObserved
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
      p.controlReadyClaimed === true ||
      p.motionReadyClaimed === true ||
      p.touchReadyClaimed === true ||
      p.dragReadyClaimed === true ||
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
      packetType.includes("HEX_GATE") ||
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
      readField(receipt, [
        "controlHandshakeStatus",
        "controlsHandshakeStatus",
        "queenHandshakeStatus",
        "routeConductorControlIntegrationStatus",
        "hexGateHandshakeStatus",
        "postgameStatus",
        "runtimeReleaseState",
        "latestEvent"
      ], ""),
      ds.hearthRouteConductorControlIntegrationStatus,
      ds.hearthSouthControlHandshakeStatus,
      ds.hearthSouthRouteConductorControlIntegrationStatus,
      ds.hearthControlHandshakeStatus,
      ds.hearthRuntimeReleaseState,
      ds.hearthPostgameStatus,
      ds.hearthRouteConductorCurrent
    ].filter(Boolean).join(" | ");

    if (/ACCEPTED|ADMITTED|CONTROL_HANDSHAKE|QUEEN_HANDSHAKE|HEX_GATE|POINTER_FINGER|HANDSHAKE_DELIVERY|CONTROL_FILE_ADMISSION|QUEEN_CANVAS_SYNC/i.test(text)) {
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
      contract === ROUTE_CONDUCTOR_V10_2 ||
      contract === ROUTE_CONDUCTOR_V10_1 ||
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
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      controlHandshakeAuthorized: true,
      controlsHandshakeAuthorized: true,
      planetaryControlHandshakeAuthorized: true,
      queenHandshakeAuthorized: true,
      queenControlAdmissionAuthorized: true,
      controlAdmissionAuthorized: true,
      controlsAdmissionAuthorized: true,
      planetaryControlAdmissionAuthorized: true,
      canvasPublicReceiverRequired: true,
      hexGateRequiredBeforePointerFinger: true,
      pointerFingerDirectDeliverySuppressed: true,
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
        "getQueenHexGateControlHandshakePacket",
        "getRouteConductorHexGateControlHandshakePacket",
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
            hexSurfaceFile: HEX_SURFACE_FILE,
            hexAuthorityFile: HEX_AUTHORITY_FILE,
            pointerFingerFile: POINTER_FINGER_FILE,
            queenControlBridgeActive: true,
            queenOutsideCardinalFunctionality: true,
            hexGateRequiredBeforePointerFinger: true,
            pointerFingerDirectDeliverySuppressed: true,
            verticalDragPolarityCorrected: true,
            ...NO_CLAIMS
          });

          if (isObject(result)) return { packet: result, source: `${route.name}.${method}` };
        } catch (error) {
          recordError("ROUTE_CONDUCTOR_HEX_GATE_HANDSHAKE_METHOD_FAILED", error, { method });
        }
      }
    }

    const receipt = route && route.receipt ? route.receipt : {};
    const candidates = [
      receipt.hexGateControlHandshakePacket,
      receipt.controlsHexGateHandshakePacket,
      receipt.controlHandshakePacket,
      receipt.controlsHandshakePacket,
      receipt.planetaryControlHandshakePacket,
      receipt.routeConductorControlHandshakePacket,
      receipt.queenControlHandshakePacket,
      receipt.routeConductorQueenControlHandshakePacket,
      receipt.controlHandoffPacket,
      receipt.controlsHandoffPacket,
      authority && authority.hexGateControlHandshakePacket,
      authority && authority.controlHandshakePacket,
      authority && authority.controlsHandshakePacket,
      authority && authority.planetaryControlHandshakePacket,
      authority && authority.queenControlHandshakePacket
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return { packet: candidate, source: `${route.name}.receipt-or-property` };
    }

    if (routeImpliesControlAdmission(route)) {
      return {
        packet: composeImplicitHandshake(route, "ROUTE_CONDUCTOR_CURRENT_CONTRACT_OR_RECEIPT_IMPLIES_HEX_GATE_CONTROL_ADMISSION"),
        source: `${route.name}.implicit-current-route-conductor-admission`
      };
    }

    return null;
  }

  function getGlobalHandshakePacket() {
    const found = firstGlobal([
      "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_ROUTE_CONDUCTOR_QUEEN_HEX_GATE_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_QUEEN_HEX_GATE_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_QUEEN_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_ROUTE_CONDUCTOR_CONTROLS_HANDSHAKE_PACKET",
      "HEARTH_PLANETARY_CONTROL_HANDSHAKE_PACKET",
      "HEARTH_CONTROLS_HANDSHAKE_PACKET",
      "HEARTH_CONTROL_HANDSHAKE_PACKET",
      "HEARTH.routeConductorHexGateControlHandshakePacket",
      "HEARTH.routeConductorQueenHexGateControlHandshakePacket",
      "HEARTH.queenHexGateControlHandshakePacket",
      "HEARTH.routeConductorQueenControlHandshakePacket",
      "HEARTH.queenControlHandshakePacket",
      "HEARTH.routeConductorControlHandshakePacket",
      "HEARTH.controlHandshakePacket",
      "HEARTH.controlsHandshakePacket",
      "HEARTH.planetaryControlHandshakePacket",
      "DEXTER_LAB.hearthRouteConductorHexGateControlHandshakePacket",
      "DEXTER_LAB.hearthRouteConductorQueenHexGateControlHandshakePacket",
      "DEXTER_LAB.hearthQueenHexGateControlHandshakePacket",
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
    state.routeConductorControlIntegrationStatus = "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_ACCEPTED_HEX_GATE_TRANSMISSION_READY";
    state.firstFailedCoordinate = "NONE_QUEEN_HEX_GATE_HANDSHAKE_ACCEPTED";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "BIND_INPUT_AND_TRANSMIT_VIEW_DELTAS_TO_CANVAS_PUBLIC_RECEIVER_FOR_HEX_GATE_POINTER_FINGER_PATH";
    state.postgameStatus = "QUEEN_HANDSHAKE_ACCEPTED_INPUT_ADMISSION_OPEN_HEX_GATE_TRANSMISSION_READY";

    invalidateCanvasReceiverCache("handshake-accepted");

    record("HEARTH_CONTROLS_QUEEN_HEX_GATE_HANDSHAKE_ACCEPTED", {
      source: state.handshakeSource,
      routeConductorContract: state.routeConductorContract,
      targetFile: FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      verticalDragPolarityCorrected: true,
      pointerFingerDirectDeliverySuppressed: true
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
    state.recommendedNextAction = "REISSUE_LAWFUL_ROUTE_CONDUCTOR_TO_QUEEN_HEX_GATE_HANDSHAKE";
    state.postgameStatus = "QUEEN_HEX_GATE_HANDSHAKE_REJECTED";

    record("HEARTH_CONTROLS_QUEEN_HEX_GATE_HANDSHAKE_REJECTED", {
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

  function receiveHexGateControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-receiveHexGateControlHandshake");
  }

  function consumeHexGateControlHandshake(packet) {
    return receiveRouteConductorControlHandshake(packet, "direct-consumeHexGateControlHandshake");
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
      state.routeConductorControlIntegrationStatus = "WAITING_ROUTE_CONDUCTOR_HEX_GATE_CONTROL_HANDSHAKE";
      state.controlStatus = CONTROL_STATUS.WAITING_HANDSHAKE;
      state.firstFailedCoordinate = "WAITING_ROUTE_CONDUCTOR_HEX_GATE_CONTROL_HANDSHAKE";
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "PUBLISH_ROUTE_CONDUCTOR_TO_QUEEN_HEX_GATE_CONTROL_HANDSHAKE";
      state.postgameStatus = "QUEEN_WAITING_ROUTE_CONDUCTOR_HEX_GATE_CONTROL_HANDSHAKE";
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

    state.touchStatus = input.bound ? "TOUCH_INPUT_BOUND_HEX_GATE_TRANSMISSION_READY" : "TOUCH_INPUT_PENDING";
    state.dragStatus = input.bound ? "DRAG_INPUT_BOUND_HEX_GATE_TRANSMISSION_READY" : "DRAG_INPUT_PENDING";
    state.motionStatus = input.bound ? "VIEW_MOTION_CONTROL_READY_HEX_GATE_TRANSMISSION_READY" : "VIEW_MOTION_CONTROL_PENDING";
    state.zoomStatus = input.bound ? "ZOOM_INPUT_BOUND" : "ZOOM_INPUT_PENDING";
    state.keyboardStatus = input.bound ? "KEYBOARD_INPUT_BOUND_HEX_GATE_TRANSMISSION_READY" : "KEYBOARD_INPUT_PENDING";
    state.inputStatus = input.bound ? "PLANETARY_VIEW_INPUT_ADMITTED_HEX_GATE_TRANSMISSION_READY" : "PLANETARY_VIEW_INPUT_PENDING";

    if (input.bound) {
      state.controlStatus = CONTROL_STATUS.ACTIVE;
      state.firstFailedCoordinate = "NONE_QUEEN_INPUT_BOUND_HEX_GATE_TRANSMISSION_READY";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "OBSERVE_CONTROL_DELTA_DELIVERY_TO_CANVAS_PUBLIC_RECEIVER_FOR_HEX_GATE";
      state.postgameStatus = "QUEEN_INPUT_BOUND_CANVAS_HEX_GATE_DELTA_DELIVERY_READY";
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
    input.restoreUserSelect = target.style ? target.style.userSelect || "" : "";
    input.restoreWebkitUserSelect = target.style ? target.style.webkitUserSelect || "" : "";
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

      record("HEARTH_CONTROLS_QUEEN_INPUT_BOUND_HEX_GATE_TRANSMISSION", {
        target: state.inputTargetDescription,
        handshakeStatus: state.handshakeStatus,
        smoothInputRenewalActive: true,
        requestAnimationFrameCoalescingActive: true,
        canvasReceiverPrewarmActive: true,
        horizontalDragPolarityPreserved: true,
        verticalDragPolarityCorrected: true,
        pointerUpTurnsGlobeUp: true,
        pointerDownTurnsGlobeDown: true,
        packetPhaseFixedAtZero: true,
        canvasLifecycleCallsSuppressedDuringDragFrames: true,
        pointerFingerDirectDeliverySuppressed: true,
        hexGateRequiredBeforePointerFinger: true
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

      if (input.target.style) {
        input.target.style.touchAction = input.restoreTouchAction || "";
        input.target.style.userSelect = input.restoreUserSelect || "";
        input.target.style.webkitUserSelect = input.restoreWebkitUserSelect || "";
      }

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
    state.lastRawDx = dx;
    state.lastRawDy = dy;

    queueViewDelta({
      inputType: "pointer-drag",
      deltaYaw: dx * INPUT_TUNING.pointerYawScale * INPUT_TUNING.horizontalPolarity,
      deltaPitch: dy * INPUT_TUNING.pointerPitchScale * INPUT_TUNING.verticalPolarity,
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
    else if (key === "ArrowUp") deltaPitch = INPUT_TUNING.keyboardPitchStep;
    else if (key === "ArrowDown") deltaPitch = -INPUT_TUNING.keyboardPitchStep;
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
    if (isFunction(root.requestAnimationFrame)) return root.requestAnimationFrame(callback);

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

    if (isFunction(root.clearTimeout)) root.clearTimeout(id);
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
      queenOutsideCardinalFunctionality: true,
      queenExcludedFromCardinalFunctionality: true,
      queenIsBishop: false,
      routeConductorRemainsHandshakeAuthority: true,
      controlsOwnViewInputOnly: true,

      transmissionPath: "ROUTE_CONDUCTOR -> CONTROLS_QUEEN -> CANVAS_PUBLIC_RECEIVER -> HEX_SURFACE_GATE -> POINTER_FINGER",
      canvasPublicReceiverRequired: true,
      hexGateTransmissionActive: true,
      hexGateRequiredBeforePointerFinger: true,
      pointerFingerDirectDeliverySuppressed: true,
      pointerFingerDownstreamOfHexOnly: true,

      smoothInputRenewalActive: true,
      requestAnimationFrameCoalescingActive: true,
      canvasReceiverCacheActive: true,
      canvasReceiverPrewarmActive: true,
      horizontalDragPolarityPreserved: true,
      horizontalDragPolarityCorrected: true,
      verticalDragPolarityCorrected: true,
      pointerRightTurnsGlobeRight: true,
      pointerUpTurnsGlobeUp: true,
      pointerDownTurnsGlobeDown: true,
      modestResponseIncreaseActive: true,
      packetPhaseFixedAtZero: true,
      canvasLifecycleCallsSuppressedDuringDragFrames: true,

      activeNewsCycle: state.activeNewsCycle,
      activeFibonacci: state.activeFibonacci,

      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      controlsInspectBishopInternals: false,
      controlsInspectSubjectFiles: false,
      controlsInspectChildFiles: false,
      controlsInspectFingerFiles: false,
      controlsDeliverDirectlyToPointerFinger: false
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
      handoffTo: "CANVAS_PUBLIC_RECEIVER",
      nextGateFile: HEX_SURFACE_FILE,
      finalPointerFile: POINTER_FINGER_FILE,

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

      inputTuning: {
        horizontalPolarity: INPUT_TUNING.horizontalPolarity,
        verticalPolarity: INPUT_TUNING.verticalPolarity,
        pointerYawScale: INPUT_TUNING.pointerYawScale,
        pointerPitchScale: INPUT_TUNING.pointerPitchScale,
        wheelZoomScale: INPUT_TUNING.wheelZoomScale
      },

      directionalContract: {
        fingerRightTurnsGlobeRight: true,
        fingerLeftTurnsGlobeLeft: true,
        fingerUpTurnsGlobeUp: true,
        fingerDownTurnsGlobeDown: true,
        horizontalPolarityPreserved: true,
        verticalPolarityCorrectedAtControls: true,
        canvasMustNotCounterInvertVertical: true,
        hexSurfaceReceivesCorrectedProjectionState: true,
        pointerFingerReceivesOnlyAfterHexGate: true
      },

      transmissionContract: {
        path: "CONTROLS_QUEEN_TO_CANVAS_PUBLIC_RECEIVER_TO_HEX_SURFACE_GATE_TO_POINTER_FINGER",
        canvasPublicReceiverRequired: true,
        hexGateRequiredBeforePointerFinger: true,
        pointerFingerDirectDeliverySuppressed: true,
        controlsDeliverDirectlyToPointerFinger: false,
        canvasMayForwardToHexSurface: true,
        hexSurfaceMayForwardToPointerFinger: true,
        controlsMayPublishGlobalPacketOnlyAsFallback: true
      },

      queenBridge: composeQueenBridgeContext(),
      route: ROUTE,
      controlsFile: FILE,
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      composedAt: nowIso(),

      frameCoalesced: true,
      requestAnimationFrameCoalescingActive: true,
      canvasReceiverCacheActive: true,
      canvasReceiverPrewarmActive: true,
      horizontalDragPolarityPreserved: true,
      verticalDragPolarityCorrected: true,
      pointerRightTurnsGlobeRight: true,
      pointerUpTurnsGlobeUp: true,
      pointerDownTurnsGlobeDown: true,
      packetPhaseFixedAtZero: true,
      canvasLifecycleCallsSuppressedDuringDragFrames: true,
      fullReceiptSuppressedDuringDragFrames: true,
      hexGateTransmissionActive: true,
      hexGateRequiredBeforePointerFinger: true,
      pointerFingerDirectDeliverySuppressed: true,

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
    root.HEARTH_QUEEN_HEX_GATE_VIEW_PACKET = cloned;
    root.HEARTH_CONTROLS_HEX_GATE_VIEW_PACKET = cloned;

    root.HEARTH_CANVAS_VIEW_STATE = viewState;
    root.HEARTH_CANVAS_LAST_VIEW_PACKET = cloned;
    root.HEARTH_CANVAS_HEX_GATE_VIEW_PACKET = cloned;

    root.HEARTH_HEX_GATE_VIEW_PACKET = cloned;
    root.HEARTH_HEX_SURFACE_VIEW_PACKET = cloned;

    hearth.controlsViewPacket = cloned;
    hearth.planetaryViewControlPacket = cloned;
    hearth.controlsLastDeltaPacket = cloned;
    hearth.queenControlsViewPacket = cloned;
    hearth.queenHexGateViewPacket = cloned;
    hearth.controlsHexGateViewPacket = cloned;
    hearth.canvasViewState = viewState;
    hearth.canvasLastViewPacket = cloned;
    hearth.canvasHexGateViewPacket = cloned;
    hearth.hexGateViewPacket = cloned;
    hearth.hexSurfaceViewPacket = cloned;

    lab.hearthControlsViewPacket = cloned;
    lab.hearthPlanetaryViewControlPacket = cloned;
    lab.hearthQueenControlsViewPacket = cloned;
    lab.hearthQueenHexGateViewPacket = cloned;
    lab.hearthCanvasViewState = viewState;
    lab.hearthHexGateViewPacket = cloned;
  }

  function deliverControlPacketToCanvas(packet) {
    const canvas = readCanvasAuthority(false);
    readHexSurfaceAuthority();
    readHexAuthority();
    readPointerFingerAuthority();

    if (!canvas.authority || !isObject(canvas.authority)) {
      state.canvasDeliveryStatus = "CANVAS_AUTHORITY_PENDING_HEX_GATE_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "WAITING_CANVAS_PUBLIC_HEX_GATE_CONTROL_RECEIVER";
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
      state.canvasDeliveryStatus = "CANVAS_HEX_GATE_CONTROL_RECEIVER_NOT_FOUND_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "CANVAS_PUBLIC_HEX_GATE_CONTROL_RECEIVER_MISSING";
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

      state.canvasDeliveryStatus = "CONTROL_PACKET_DELIVERED_TO_CANVAS_PUBLIC_RECEIVER_FOR_HEX_GATE";
      state.canvasDeliveryMethod = method;
      state.canvasDeliveryReason = "CANVAS_PUBLIC_VIEW_CONTROL_RECEIVER_CALLED_HEX_GATE_PATH";
      state.deliveryCount += 1;

      if (result && isFunction(result.then)) {
        result.catch((error) => {
          recordError("HEARTH_CONTROLS_QUEEN_CANVAS_ASYNC_HEX_GATE_RECEIVER_FAILED", error, { method });
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
      recordError("HEARTH_CONTROLS_QUEEN_CANVAS_HEX_GATE_RECEIVER_FAILED", error, { method });

      state.canvasDeliveryStatus = "CANVAS_RECEIVER_FAILED_HEX_GATE_PACKET_PUBLISHED";
      state.canvasDeliveryMethod = "GLOBAL_PACKET_PUBLICATION";
      state.canvasDeliveryReason = "CANVAS_PUBLIC_HEX_GATE_RECEIVER_THROWN";
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
      const detail = clonePlain(packet);

      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:planetary-view-control", { detail }));
        doc.dispatchEvent(new root.CustomEvent("hearth:queen-view-control", { detail }));
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-view-state", { detail }));
        doc.dispatchEvent(new root.CustomEvent("hearth:controls-hex-gate-view-packet", { detail }));
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-view-packet", { detail }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:planetary-view-control", { detail }));
        root.dispatchEvent(new root.CustomEvent("hearth:queen-view-control", { detail }));
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-view-state", { detail }));
        root.dispatchEvent(new root.CustomEvent("hearth:controls-hex-gate-view-packet", { detail }));
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-view-packet", { detail }));
      }
    } catch (_error) {}
  }

  function composeDiagnosticFields() {
    const admitted = state.inputAdmissionOpen === true;
    const bound = input.bound === true;

    return {
      PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE: "true",
      PLANETARY_CONTROL_FOOTPRINT_STATUS: admitted ? "CONTROL_RUNTIME_ACTIVE_HEX_GATE_TRANSMISSION_READY" : "CONTROL_FILE_PRESENT_WAITING_HANDSHAKE",
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

      JS_INTEGRATION_FUNNEL: "ROUTE_CONDUCTOR -> CONTROLS_QUEEN_V5 -> CANVAS_PUBLIC_RECEIVER -> HEX_SURFACE_GATE -> POINTER_FINGER",
      JS_INDEX_FILE: INDEX_FILE,
      JS_INDEX_CONTRACT: EXPECTED_INDEX_CONTRACT,
      JS_ROUTE_CONDUCTOR_FILE: ROUTE_CONDUCTOR_FILE,
      JS_ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract || ROUTE_CONDUCTOR_V10,
      JS_CONTROL_FILE: FILE,
      JS_CONTROL_CONTRACT: CONTRACT,
      JS_CANVAS_FILE: CANVAS_FILE,
      JS_HEX_SURFACE_FILE: HEX_SURFACE_FILE,
      JS_HEX_AUTHORITY_FILE: HEX_AUTHORITY_FILE,
      JS_POINTER_FINGER_FILE: POINTER_FINGER_FILE,

      ROUTE_CONDUCTOR_CONTROL_INTEGRATION_STATUS: state.routeConductorControlIntegrationStatus,
      ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REQUIRED: "true",
      ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_TARGET: FILE,
      ROUTE_CONDUCTOR_CONTROL_FUNNEL_OWNER: "ROUTE_CONDUCTOR",

      QUEEN_AUTHORITY_OBSERVED: "true",
      QUEEN_CONTROL_BRIDGE_ACTIVE: "true",
      QUEEN_OUTSIDE_CARDINAL_FUNCTIONALITY: "true",
      QUEEN_EXCLUDED_FROM_CARDINAL_FUNCTIONALITY: "true",
      QUEEN_IS_BISHOP: "false",

      HEX_GATE_TRANSMISSION_ACTIVE: "true",
      HEX_GATE_REQUIRED_BEFORE_POINTER_FINGER: "true",
      POINTER_FINGER_DIRECT_DELIVERY_SUPPRESSED: "true",
      CONTROLS_DELIVER_DIRECTLY_TO_POINTER_FINGER: "false",

      CANVAS_PUBLIC_RECEIVER_REQUIRED: "true",
      CANVAS_OBSERVED: String(state.canvasObserved === true),
      CANVAS_CONTRACT: state.canvasContract || "",
      CANVAS_CONTRACT_RECOGNIZED: String(state.canvasContractRecognized === true),
      CANVAS_DELIVERY_STATUS: state.canvasDeliveryStatus,
      CANVAS_DELIVERY_METHOD: state.canvasDeliveryMethod,
      CANVAS_DELIVERY_REASON: state.canvasDeliveryReason,

      HEX_SURFACE_OBSERVED: String(state.hexSurfaceObserved === true),
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract || "",
      HEX_SURFACE_CONTRACT_RECOGNIZED: String(state.hexSurfaceContractRecognized === true),
      HEX_GATE_STATUS: state.hexGateStatus,

      HEX_AUTHORITY_OBSERVED: String(state.hexAuthorityObserved === true),
      HEX_AUTHORITY_CONTRACT: state.hexAuthorityContract || "",
      HEX_AUTHORITY_RECOGNIZED: String(state.hexAuthorityRecognized === true),

      POINTER_FINGER_OBSERVED: String(state.pointerFingerObserved === true),
      POINTER_FINGER_CONTRACT: state.pointerFingerContract || "",
      POINTER_FINGER_DIRECT_DELIVERY_STATUS: state.pointerFingerDirectDeliverySuppressedStatus,

      SMOOTH_INPUT_RENEWAL_ACTIVE: "true",
      REQUEST_ANIMATION_FRAME_COALESCING_ACTIVE: "true",
      CANVAS_RECEIVER_CACHE_ACTIVE: "true",
      CANVAS_RECEIVER_PREWARM_ACTIVE: "true",
      HORIZONTAL_DRAG_POLARITY_PRESERVED: "true",
      HORIZONTAL_DRAG_POLARITY_CORRECTED: "true",
      VERTICAL_DRAG_POLARITY_CORRECTED: "true",
      POINTER_RIGHT_TURNS_GLOBE_RIGHT: "true",
      POINTER_UP_TURNS_GLOBE_UP: "true",
      POINTER_DOWN_TURNS_GLOBE_DOWN: "true",
      MODEST_RESPONSE_INCREASE_ACTIVE: "true",
      PACKET_PHASE_FIXED_AT_ZERO: "true",
      CANVAS_LIFECYCLE_CALLS_SUPPRESSED_DURING_DRAG_FRAMES: "true",
      FULL_RECEIPT_SUPPRESSED_DURING_DRAG_FRAMES: "true",

      HORIZONTAL_POLARITY: String(INPUT_TUNING.horizontalPolarity),
      VERTICAL_POLARITY: String(INPUT_TUNING.verticalPolarity),
      POINTER_YAW_SCALE: String(INPUT_TUNING.pointerYawScale),
      POINTER_PITCH_SCALE: String(INPUT_TUNING.pointerPitchScale),

      PLANETARY_VIEW_CONTROL_STATUS: admitted ? (bound ? "PLANETARY_VIEW_CONTROL_ACTIVE_HEX_GATE_TRANSMISSION_READY" : "PLANETARY_VIEW_CONTROL_TARGET_PENDING") : "WAITING_ROUTE_CONDUCTOR_HANDSHAKE",
      PLANETARY_VIEW_TOUCH_STATUS: state.touchStatus,
      PLANETARY_VIEW_DRAG_STATUS: state.dragStatus,
      PLANETARY_VIEW_MOTION_STATUS: state.motionStatus,
      PLANETARY_VIEW_ZOOM_STATUS: state.zoomStatus,
      PLANETARY_VIEW_KEYBOARD_STATUS: state.keyboardStatus,
      PLANETARY_VIEW_INPUT_STATUS: state.inputStatus,

      PLANETARY_CONTROL_RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      PLANETARY_CONTROL_RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      CONTROL_INPUT_BOUND: String(bound),
      CONTROL_INPUT_TARGET_FOUND: String(state.inputTargetFound === true),
      CONTROL_INPUT_TARGET_DESCRIPTION: state.inputTargetDescription,
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
      queenPacketType: "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT",
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
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: "queen-planetary-view-input-authority-hex-gate-pointer-finger-transmission-v5",

      loaded: true,
      booted: state.booted,
      disposed: state.disposed,
      controlStatus: state.controlStatus,

      activeNewsCycle: state.activeNewsCycle,
      activeFibonacci: state.activeFibonacci,

      hexGateTransmissionActive: true,
      canvasPublicReceiverRequired: true,
      hexGateRequiredBeforePointerFinger: true,
      pointerFingerDirectDeliverySuppressed: true,
      controlsDeliverDirectlyToPointerFinger: false,

      smoothInputRenewalActive: true,
      requestAnimationFrameCoalescingActive: true,
      canvasReceiverCacheActive: true,
      canvasReceiverPrewarmActive: true,
      horizontalDragPolarityPreserved: true,
      horizontalDragPolarityCorrected: true,
      verticalDragPolarityCorrected: true,
      pointerRightTurnsGlobeRight: true,
      pointerUpTurnsGlobeUp: true,
      pointerDownTurnsGlobeDown: true,
      modestResponseIncreaseActive: true,
      packetPhaseFixedAtZero: true,
      canvasLifecycleCallsSuppressedDuringDragFrames: true,
      fullReceiptSuppressedDuringDragFrames: true,
      pointerYawScale: INPUT_TUNING.pointerYawScale,
      pointerPitchScale: INPUT_TUNING.pointerPitchScale,
      horizontalPolarity: INPUT_TUNING.horizontalPolarity,
      verticalPolarity: INPUT_TUNING.verticalPolarity,

      queenAuthorityObserved: true,
      queenControlBridgeActive: true,
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

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceAuthoritySource: state.hexSurfaceAuthoritySource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceContractRecognized: state.hexSurfaceContractRecognized,
      hexGateStatus: state.hexGateStatus,

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityReceipt: state.hexAuthorityReceipt,
      hexAuthorityRecognized: state.hexAuthorityRecognized,

      pointerFingerObserved: state.pointerFingerObserved,
      pointerFingerAuthoritySource: state.pointerFingerAuthoritySource,
      pointerFingerContract: state.pointerFingerContract,
      pointerFingerReceipt: state.pointerFingerReceipt,
      pointerFingerDirectDeliverySuppressedStatus: state.pointerFingerDirectDeliverySuppressedStatus,

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

      supportsRouteConductorV102HexGateTransmission: true,
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
      supportsHexGateTransmission: true,
      supportsPointerFingerDownstreamGate: true,
      supportsDiagnosticControlFootprint: true,
      supportsRequestAnimationFrameCoalescing: true,
      supportsCanvasReceiverCache: true,
      supportsCanvasReceiverPrewarm: true,
      supportsHorizontalDragPolarityPreservation: true,
      supportsVerticalDragPolarityCorrection: true,
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
      ownsCanvasDrawing: false,
      ownsCanvasExpressionTruth: false,
      ownsCanvasFingerTruth: false,
      ownsHexTruth: false,
      ownsHexSurfaceTruth: false,
      ownsPointerFingerTruth: false,
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
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: nowIso()
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("previousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT),
      line("previousImplementationReceipt", PREVIOUS_IMPLEMENTATION_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      line("routeConductorFile", ROUTE_CONDUCTOR_FILE),
      line("canvasFile", CANVAS_FILE),
      line("hexSurfaceFile", HEX_SURFACE_FILE),
      line("hexAuthorityFile", HEX_AUTHORITY_FILE),
      line("pointerFingerFile", POINTER_FINGER_FILE),
      "",
      "TRANSMISSION",
      line("transmissionPath", "ROUTE_CONDUCTOR -> CONTROLS_QUEEN -> CANVAS_PUBLIC_RECEIVER -> HEX_SURFACE_GATE -> POINTER_FINGER"),
      line("canvasPublicReceiverRequired", true),
      line("hexGateTransmissionActive", true),
      line("hexGateRequiredBeforePointerFinger", true),
      line("pointerFingerDirectDeliverySuppressed", true),
      line("controlsDeliverDirectlyToPointerFinger", false),
      "",
      "DIRECTIONAL_CORRECTION",
      line("horizontalDragPolarityPreserved", true),
      line("horizontalPolarity", INPUT_TUNING.horizontalPolarity),
      line("pointerRightTurnsGlobeRight", true),
      line("verticalDragPolarityCorrected", true),
      line("verticalPolarity", INPUT_TUNING.verticalPolarity),
      line("pointerUpTurnsGlobeUp", true),
      line("pointerDownTurnsGlobeDown", true),
      line("canvasMustNotCounterInvertVertical", true),
      line("hexSurfaceReceivesCorrectedProjectionState", true),
      "",
      "SMOOTH_INPUT",
      line("smoothInputRenewalActive", true),
      line("requestAnimationFrameCoalescingActive", true),
      line("canvasReceiverCacheActive", true),
      line("canvasReceiverPrewarmActive", true),
      line("packetPhaseFixedAtZero", true),
      line("canvasLifecycleCallsSuppressedDuringDragFrames", true),
      line("fullReceiptSuppressedDuringDragFrames", true),
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
      line("canvasReceiverPrewarmStatus", r.canvasReceiverPrewarmStatus),
      line("packetCount", r.packetCount),
      line("deliveryCount", r.deliveryCount),
      "",
      "HEX_GATE",
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceAuthoritySource", r.hexSurfaceAuthoritySource),
      line("hexSurfaceContract", r.hexSurfaceContract),
      line("hexSurfaceContractRecognized", r.hexSurfaceContractRecognized),
      line("hexGateStatus", r.hexGateStatus),
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexAuthorityContract", r.hexAuthorityContract),
      line("hexAuthorityRecognized", r.hexAuthorityRecognized),
      "",
      "POINTER_FINGER",
      line("pointerFingerObserved", r.pointerFingerObserved),
      line("pointerFingerAuthoritySource", r.pointerFingerAuthoritySource),
      line("pointerFingerContract", r.pointerFingerContract),
      line("pointerFingerDirectDeliverySuppressedStatus", r.pointerFingerDirectDeliverySuppressedStatus),
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
      "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("controlStatus", r.controlStatus),
      line("handshakeStatus", r.handshakeStatus),
      line("handshakeAccepted", r.handshakeAccepted),
      line("inputAdmissionOpen", r.inputAdmissionOpen),
      line("inputBound", r.inputBound),
      line("inputStatus", r.inputStatus),
      line("transmissionPath", "CONTROLS_QUEEN_TO_CANVAS_PUBLIC_RECEIVER_TO_HEX_SURFACE_GATE_TO_POINTER_FINGER"),
      line("hexGateRequiredBeforePointerFinger", true),
      line("pointerFingerDirectDeliverySuppressed", true),
      line("horizontalDragPolarityPreserved", r.horizontalDragPolarityPreserved),
      line("verticalDragPolarityCorrected", r.verticalDragPolarityCorrected),
      line("pointerRightTurnsGlobeRight", r.pointerRightTurnsGlobeRight),
      line("pointerUpTurnsGlobeUp", r.pointerUpTurnsGlobeUp),
      line("pointerDownTurnsGlobeDown", r.pointerDownTurnsGlobeDown),
      line("packetPhaseFixedAtZero", r.packetPhaseFixedAtZero),
      line("canvasLifecycleCallsSuppressedDuringDragFrames", r.canvasLifecycleCallsSuppressedDuringDragFrames),
      line("requestAnimationFrameCoalescingActive", r.requestAnimationFrameCoalescingActive),
      line("canvasReceiverCacheActive", r.canvasReceiverCacheActive),
      line("canvasReceiverPrewarmActive", r.canvasReceiverPrewarmActive),
      line("routeConductorContract", r.routeConductorContract),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("canvasDeliveryMethod", r.canvasDeliveryMethod),
      line("hexGateStatus", r.hexGateStatus),
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
    readHexSurfaceAuthority();
    readHexAuthority();
    readPointerFingerAuthority();

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

      if (!state.handshakeAccepted) observeHandshake();
      else if (!input.bound) bindInputIfAdmitted();
      else {
        readCanvasAuthority(false);
        readHexSurfaceAuthority();
        readHexAuthority();
        readPointerFingerAuthority();
        updateInputState();
        updateDataset();
      }

      if (state.watchdogTicks >= INPUT_TUNING.watchdogMaxTicks || state.disposed) {
        root.clearInterval(watchdogTimer);
        watchdogTimer = 0;

        record("HEARTH_CONTROLS_QUEEN_WATCHDOG_STOPPED", {
          watchdogTicks: state.watchdogTicks,
          handshakeAccepted: state.handshakeAccepted,
          inputBound: input.bound,
          hexSurfaceObserved: state.hexSurfaceObserved,
          pointerFingerObserved: state.pointerFingerObserved
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
    setDataset("hearthControlsPreviousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT);
    setDataset("hearthControlsVersion", VERSION);

    setDataset("hearthControlsHexGateTransmissionActive", "true");
    setDataset("hearthControlsCanvasPublicReceiverRequired", "true");
    setDataset("hearthControlsHexGateRequiredBeforePointerFinger", "true");
    setDataset("hearthControlsPointerFingerDirectDeliverySuppressed", "true");
    setDataset("hearthControlsDeliverDirectlyToPointerFinger", "false");

    setDataset("hearthControlsSmoothInputRenewalActive", "true");
    setDataset("hearthControlsRequestAnimationFrameCoalescingActive", "true");
    setDataset("hearthControlsCanvasReceiverCacheActive", "true");
    setDataset("hearthControlsCanvasReceiverPrewarmActive", "true");
    setDataset("hearthControlsHorizontalDragPolarityPreserved", "true");
    setDataset("hearthControlsHorizontalDragPolarityCorrected", "true");
    setDataset("hearthControlsVerticalDragPolarityCorrected", "true");
    setDataset("hearthControlsPointerRightTurnsGlobeRight", "true");
    setDataset("hearthControlsPointerUpTurnsGlobeUp", "true");
    setDataset("hearthControlsPointerDownTurnsGlobeDown", "true");
    setDataset("hearthControlsModestResponseIncreaseActive", "true");
    setDataset("hearthControlsHorizontalPolarity", String(INPUT_TUNING.horizontalPolarity));
    setDataset("hearthControlsVerticalPolarity", String(INPUT_TUNING.verticalPolarity));
    setDataset("hearthControlsPointerYawScale", String(INPUT_TUNING.pointerYawScale));
    setDataset("hearthControlsPointerPitchScale", String(INPUT_TUNING.pointerPitchScale));
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

    setDataset("hearthControlsHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthControlsHexSurfaceContract", state.hexSurfaceContract || "");
    setDataset("hearthControlsHexSurfaceContractRecognized", String(state.hexSurfaceContractRecognized));
    setDataset("hearthControlsHexGateStatus", state.hexGateStatus);
    setDataset("hearthControlsHexAuthorityObserved", String(state.hexAuthorityObserved));
    setDataset("hearthControlsHexAuthorityContract", state.hexAuthorityContract || "");
    setDataset("hearthControlsHexAuthorityRecognized", String(state.hexAuthorityRecognized));
    setDataset("hearthControlsPointerFingerObserved", String(state.pointerFingerObserved));
    setDataset("hearthControlsPointerFingerContract", state.pointerFingerContract || "");
    setDataset("hearthControlsPointerFingerDirectDeliverySuppressedStatus", state.pointerFingerDirectDeliverySuppressedStatus);

    if (packet) {
      setDataset("hearthControlsLastInputType", packet.inputType || "");
      setDataset("hearthControlsLastDeltaYaw", String(packet.deltaYaw || 0));
      setDataset("hearthControlsLastDeltaPitch", String(packet.deltaPitch || 0));
      setDataset("hearthControlsLastDeltaZoom", String(packet.deltaZoom || 0));
      setDataset("hearthControlsLastFrameAt", packet.composedAt || "");
      setDataset("hearthControlsLastFramePhase", "0");
      setDataset("hearthControlsLastRawDx", String(packet.rawDx || 0));
      setDataset("hearthControlsLastRawDy", String(packet.rawDy || 0));
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
    setDataset("hearthQueenOutsideCardinalFunctionality", "true");
    setDataset("hearthQueenExcludedFromCardinalFunctionality", "true");
    setDataset("hearthQueenIsBishop", "false");

    setDataset("hearthControlsCanvasFile", CANVAS_FILE);
    setDataset("hearthControlsHexSurfaceFile", HEX_SURFACE_FILE);
    setDataset("hearthControlsHexAuthorityFile", HEX_AUTHORITY_FILE);
    setDataset("hearthControlsPointerFingerFile", POINTER_FINGER_FILE);

    setDataset("hearthControlsInspectBishopInternals", "false");
    setDataset("hearthControlsInspectSubjectFiles", "false");
    setDataset("hearthControlsInspectChildFiles", "false");
    setDataset("hearthControlsInspectFingerFiles", "false");

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
    root.HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_RECEIPT = receipt;
    root.HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT = receipt;
    root.HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT_v5 = receipt;
    root.HEARTH_CONTROL_HANDSHAKE_RECEIPT = receipt;
    root.HEARTH_CONTROLS_HANDSHAKE_RECEIPT = receipt;
    root.HEARTH_QUEEN_CONTROL_HANDSHAKE_RECEIPT = receipt;
    root.HEARTH_QUEEN_HEX_GATE_CONTROL_HANDSHAKE_RECEIPT = receipt;

    hearth.controlsReceipt = receipt;
    hearth.planetaryControlsReceipt = receipt;
    hearth.controlFileReceipt = receipt;
    hearth.controlAuthorityReceipt = receipt;
    hearth.controlsPlanetaryViewInputHandshakeReceipt = receipt;
    hearth.controlsQueenReceipt = receipt;
    hearth.queenControlsReceipt = receipt;
    hearth.queenSuperconductorControlsReceipt = receipt;
    hearth.controlsVerticalPolaritySmoothCanvasHexPairAlignmentReceipt = receipt;
    hearth.controlsHexGatePointerFingerTransmissionReceipt = receipt;
    hearth.controlHandshakeReceipt = receipt;
    hearth.controlsHandshakeReceipt = receipt;
    hearth.queenControlHandshakeReceipt = receipt;
    hearth.queenHexGateControlHandshakeReceipt = receipt;

    lab.hearthControlsReceipt = receipt;
    lab.hearthPlanetaryControlsReceipt = receipt;
    lab.hearthControlFileReceipt = receipt;
    lab.hearthControlAuthorityReceipt = receipt;
    lab.hearthQueenControlsReceipt = receipt;
    lab.hearthQueenSuperconductorControlsReceipt = receipt;
    lab.hearthControlsVerticalPolaritySmoothCanvasHexPairAlignmentReceipt = receipt;
    lab.hearthControlsHexGatePointerFingerTransmissionReceipt = receipt;

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
        transmissionPath: "CONTROLS_QUEEN_TO_CANVAS_PUBLIC_RECEIVER_TO_HEX_SURFACE_GATE_TO_POINTER_FINGER",
        hexGateRequiredBeforePointerFinger: true,
        pointerFingerDirectDeliverySuppressed: true,
        horizontalDragPolarityPreserved: true,
        verticalDragPolarityCorrected: true,
        pointerUpTurnsGlobeUp: true,
        pointerDownTurnsGlobeDown: true,
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
      state.postgameStatus = "QUEEN_BOOTING_HEX_GATE_POINTER_FINGER_TRANSMISSION_V5";

      publishGlobals("boot-early");
      readRouteConductorAuthority();
      readCanvasAuthority(true);
      readHexSurfaceAuthority();
      readHexAuthority();
      readPointerFingerAuthority();
      observeHandshake();

      state.booted = true;
      state.booting = false;

      refresh();
      startWatchdog();

      record("HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_V5_BOOTED", {
        contract: CONTRACT,
        file: FILE,
        routeConductorContract: state.routeConductorContract,
        handshakeStatus: state.handshakeStatus,
        inputAdmissionOpen: state.inputAdmissionOpen,
        inputBound: input.bound,
        canvasObserved: state.canvasObserved,
        hexSurfaceObserved: state.hexSurfaceObserved,
        pointerFingerObserved: state.pointerFingerObserved,
        hexGateRequiredBeforePointerFinger: true,
        pointerFingerDirectDeliverySuppressed: true,
        horizontalDragPolarityPreserved: true,
        verticalDragPolarityCorrected: true,
        pointerRightTurnsGlobeRight: true,
        pointerUpTurnsGlobeUp: true,
        pointerDownTurnsGlobeDown: true,
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
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    ROUTE_CONDUCTOR_V10_2,
    ROUTE_CONDUCTOR_V10_1,
    ROUTE_CONDUCTOR_V10,
    ROUTE_CONDUCTOR_V9_9,
    ROUTE_CONDUCTOR_V9_8,
    ROUTE_CONDUCTOR_V9_7,
    ROUTE_CONDUCTOR_V9_6,
    ROUTE_CONDUCTOR_V9_5,
    ROUTE_CONDUCTOR_V9_4,

    controlPacket: CONTROL_PACKET,
    handshakePacket: HANDSHAKE_PACKET,
    queenPacket: QUEEN_PACKET,

    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
    acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
    acceptedHexSurfaceContracts: ACCEPTED_HEX_SURFACE_CONTRACTS.slice(),
    acceptedHexAuthorityContracts: ACCEPTED_HEX_AUTHORITY_CONTRACTS.slice(),

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
    receiveHexGateControlHandshake,
    consumeHexGateControlHandshake,

    readRouteConductorAuthority,
    readCanvasAuthority,
    readHexSurfaceAuthority,
    readHexAuthority,
    readPointerFingerAuthority,
    invalidateCanvasReceiverCache,
    prewarmCanvasReceiver,
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

    supportsRouteConductorV102HexGateTransmission: true,
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
    supportsHexGateTransmission: true,
    supportsPointerFingerDownstreamGate: true,
    supportsDiagnosticControlFootprint: true,
    supportsRequestAnimationFrameCoalescing: true,
    supportsCanvasReceiverCache: true,
    supportsCanvasReceiverPrewarm: true,
    supportsHorizontalDragPolarityPreservation: true,
    supportsVerticalDragPolarityCorrection: true,
    supportsPacketPhaseZero: true,
    suppressesCanvasLifecycleCallsDuringDragFrames: true,

    smoothInputRenewalActive: true,
    requestAnimationFrameCoalescingActive: true,
    canvasReceiverCacheActive: true,
    canvasReceiverPrewarmActive: true,
    horizontalDragPolarityPreserved: true,
    horizontalDragPolarityCorrected: true,
    verticalDragPolarityCorrected: true,
    pointerRightTurnsGlobeRight: true,
    pointerUpTurnsGlobeUp: true,
    pointerDownTurnsGlobeDown: true,
    modestResponseIncreaseActive: true,
    packetPhaseFixedAtZero: true,
    canvasLifecycleCallsSuppressedDuringDragFrames: true,
    fullReceiptSuppressedDuringDragFrames: true,
    hexGateTransmissionActive: true,
    canvasPublicReceiverRequired: true,
    hexGateRequiredBeforePointerFinger: true,
    pointerFingerDirectDeliverySuppressed: true,
    controlsDeliverDirectlyToPointerFinger: false,

    inputTuning: clonePlain(INPUT_TUNING),

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
    ownsCanvasDrawing: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasFingerTruth: false,
    ownsHexTruth: false,
    ownsHexSurfaceTruth: false,
    ownsPointerFingerTruth: false,
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
    recordError("HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_V5_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
