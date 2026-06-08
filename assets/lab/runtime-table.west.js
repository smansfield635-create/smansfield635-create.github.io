// /assets/lab/runtime-table.west.js
// LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9
// Internal controlled renewal:
// LAB_RUNTIME_TABLE_CARDINAL_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP_TNT_v5_1
// Full-file replacement.
// Cardinal West / diagnostic cycle-closure / pointer-surface bishop mapping correction.
//
// Purpose:
// - Preserve public LabWest v4_9 contract and aliases.
// - Correct the downstream chain map:
//   Route Conductor -> Controls Queen -> Canvas Public Receiver -> Hex Surface Gate -> Pointer Surface Bishop -> Canvas Public Receiver.
// - Treat /assets/hearth/hearth.canvas.finger.surface.js as the Pointer Surface Bishop gate.
// - Treat /assets/hearth/hearth.canvas.finger.inspect.js as a child/priest organizer beneath Pointer Surface, not the main-chain gate.
// - Allow diagnostics to isolate the missing/dark main-chain file correctly.
// - Keep Inspect visible as advisory child evidence only.
// - Never draw Canvas.
// - Never call Canvas lifecycle methods.
// - Never direct-load Pointer Surface, Pointer Inspect, or governed source stack.
// - Never claim F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_TNT_v4_9";
  const RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_RECEIPT_v4_9";

  const INTERNAL_RENEWAL_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP_TNT_v5_1";
  const INTERNAL_RENEWAL_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP_RECEIPT_v5_1";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_DIAGNOSTIC_CYCLE_CLOSURE_CANVAS_RETURN_RECEIPT_TNT_v5";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_DIAGNOSTIC_CYCLE_CLOSURE_CANVAS_RETURN_RECEIPT_RECEIPT_v5";

  const PREVIOUS_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_TNT_v4_8";
  const PREVIOUS_RECEIPT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_GATE_DOWNSTREAM_HIERARCHY_BISHOP_QUEEN_PRIEST_ADOPTION_RECEIPT_v4_8";

  const VERSION =
    "2026-06-08.lab-runtime-table-west-pointer-surface-bishop-chain-map-v5-1";

  const FILE = "/assets/lab/runtime-table.west.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const NORTH_FILE = "/assets/lab/runtime-table.js";
  const EAST_FILE = "/assets/lab/runtime-table.east.js";
  const SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const WEST_FILE = FILE;

  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROLS_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const ACTIVE_STAGE_ID = "C2_WEST_POINTER_SURFACE_BISHOP_CHAIN_AUDIT";
  const ACTIVE_GEAR = "GEAR_C2_WEST_POINTER_SURFACE_BISHOP_CHAIN_AUDIT";
  const ACTIVE_CYCLE_NUMBER = 2;
  const ACTIVE_CYCLE_ROUTE = "NORTH_EAST_SOUTH_WEST_CANVAS";
  const ACTIVE_CARDINAL = "WEST";
  const ACTIVE_FIBONACCI = "F13W";
  const ACTIVE_NEWS_GATE = "WEST";

  const LOOP = Object.freeze([
    "ROUTE_TO_CONTROLS",
    "CONTROLS_TO_CANVAS",
    "CANVAS_TO_HEX_SURFACE",
    "HEX_SURFACE_TO_POINTER_SURFACE_BISHOP",
    "POINTER_SURFACE_BISHOP_TO_CANVAS_RETURN"
  ]);

  const ADVISORY_CHILDREN = Object.freeze([
    "POINTER_SURFACE_BISHOP_TO_INSPECT_PRIEST_ORGANIZER"
  ]);

  const WEST_DECISION = Object.freeze({
    HOLD: "HOLD",
    HARD_BLOCK: "HARD_BLOCK",
    RELEASE_TO_CANVAS_RETURN_RECEIPT: "RELEASE_TO_CANVAS_RETURN_RECEIPT"
  });

  const WEST_GAP_CLASS = Object.freeze({
    NONE: "NONE",
    WAITING_CHRONOLOGY: "WAITING_DIAGNOSTIC_CHRONOLOGY",
    WAITING_ROUTE: "WAITING_ROUTE_CONDUCTOR",
    WAITING_CONTROLS: "WAITING_CONTROLS_QUEEN",
    WAITING_CANVAS: "WAITING_CANVAS_PUBLIC_RECEIVER",
    WAITING_HEX: "WAITING_HEX_SURFACE_GATE",
    WAITING_POINTER_SURFACE: "WAITING_POINTER_SURFACE_BISHOP",
    WAITING_RETURN: "WAITING_CANVAS_RETURN_RECEIPT",
    REQUEST_ONLY: "REQUEST_OBSERVED_GRANT_NOT_CONFIRMED",
    RETURN_NOT_CONFIRMED: "GRANT_OBSERVED_RETURN_NOT_CONFIRMED",
    ARTIFACT_NOT_APPLIED: "RETURN_ARTIFACT_NOT_APPLIED",
    STRUCTURAL_BLOCK: "STRUCTURAL_BLOCK"
  });

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByWest: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21Claimed: false,
    f21ClaimedByWest: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
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

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const ACCEPTED_CONTROLS_CONTRACTS = Object.freeze([
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1",
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5",
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
  ]);

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4",
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4",
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
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
    "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_2",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_1",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v3",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v2",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v1"
  ]);

  const ACCEPTED_HEX_AUTHORITY_CONTRACTS = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1"
  ]);

  const ACCEPTED_POINTER_SURFACE_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_GATE_TNT_v5",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2",
    "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1"
  ]);

  const ACCEPTED_POINTER_INSPECT_CONTRACTS = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1"
  ]);

  const READ_RECEIPT_METHODS = Object.freeze([
    "getReceiptLight",
    "getReceipt",
    "getReport",
    "getStatus",
    "getState",
    "getSummary",
    "getControlReceipt",
    "getControlsReceipt",
    "getControlHandshakeReceipt",
    "getCanvasStationSummary",
    "getCanvasStationReceiptLight",
    "getCanvasStationReceipt",
    "getExpressionHubSummary",
    "getExpressionHubReceipt",
    "getVisiblePlanetReceipt",
    "getVisibleGlobeReceipt",
    "getHexSurfaceReceipt",
    "getHexSurfaceSummary",
    "getHexReceipt",
    "getPointerSurfaceReceipt",
    "getPointerSurfaceSummary",
    "getPointerBishopReceipt",
    "getPointerBishopSummary",
    "getPointerFingerReceipt",
    "getPointerFingerSummary",
    "getFingerSurfaceReceipt",
    "getFingerSurfaceSummary",
    "getFingerInspectReceipt",
    "getFingerInspectSummary",
    "getCanvasReturnReceipt",
    "getCanvasReturnPacket",
    "getReturnReceipt",
    "getReturnPacket",
    "getCycleClosureReceipt",
    "getCycleClosurePacket",
    "getBishopChord",
    "getHierarchySurface",
    "getHierarchyRegistry"
  ]);

  const MUTATING_OR_LIFECYCLE_METHODS = Object.freeze([
    "boot",
    "start",
    "init",
    "mount",
    "render",
    "run",
    "draw",
    "drawFrame",
    "drawVisibleExpression",
    "drawInteractiveFrame",
    "drawPairFrame",
    "receiveControlPacket",
    "receiveViewDelta",
    "receiveViewState",
    "receiveRouteConductorReleasePacket",
    "receiveRouteConductorCanvasGovernedHandoffPacket",
    "receiveHexSurfacePacket",
    "receivePointerSurfacePacket",
    "receivePointerFingerPacket",
    "receiveFingerInspectPacket",
    "receiveCanvasReturnPacket",
    "consumeControlPacket",
    "consumeViewDelta",
    "consumeViewState",
    "consumeRouteConductorReleasePacket",
    "consumeRouteConductorCanvasGovernedHandoffPacket",
    "consumeHexSurfacePacket",
    "consumePointerSurfacePacket",
    "consumePointerFingerPacket",
    "consumeFingerInspectPacket",
    "consumeCanvasReturnPacket",
    "applyViewState",
    "applyViewDelta",
    "setView",
    "updateView"
  ]);

  const ROUTE_CONDUCTOR_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
    "HEARTH.routeConductor",
    "HEARTH.routeNorthBishop",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteNorthBishop"
  ]);

  const CONTROLS_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH.controls",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.planetaryControls",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthQueenControls"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent"
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE",
    "HEARTH.hexSurfacePairPointerFingerGate",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurface",
    "DEXTER_LAB.hearthHexSurfacePairPointerFingerGate",
    "DEXTER_LAB.hearthHexSurface"
  ]);

  const POINTER_SURFACE_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_GATE",
    "HEARTH_CANVAS_POINTER_SURFACE_BISHOP",
    "HEARTH_POINTER_SURFACE_BISHOP",
    "HEARTH_SURFACE_POINTER_BISHOP",
    "HEARTH_CANVAS_BISHOP_SURFACE_POINTER",
    "HEARTH_CANVAS_SURFACE_BISHOP",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasFingerSurfacePointerBishop",
    "HEARTH.canvasFingerSurfacePointerBishopGate",
    "HEARTH.canvasPointerSurfaceBishop",
    "HEARTH.pointerSurfaceBishop",
    "HEARTH.surfacePointerBishop",
    "HEARTH.canvasBishopSurfacePointer",
    "HEARTH.canvasSurfaceBishop",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointerBishop",
    "DEXTER_LAB.hearthCanvasPointerSurfaceBishop",
    "DEXTER_LAB.hearthPointerSurfaceBishop"
  ]);

  const POINTER_INSPECT_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECT_PRIEST",
    "HEARTH_CANVAS_FINGER_CHILD_ORGANIZER",
    "HEARTH_POINTER_INSPECT_PRIEST",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspectPriest",
    "HEARTH.canvasFingerChildOrganizer",
    "HEARTH.pointerInspectPriest",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthPointerInspectPriest"
  ]);

  const DIAGNOSTIC_ALIASES = Object.freeze([
    "HEARTH_DIAGNOSTIC_RAIL_NORTH",
    "HEARTH_DIAGNOSTIC_RAIL",
    "HEARTH.diagnosticRail",
    "HEARTH.diagnosticNorth",
    "HEARTH.diagnosticTruthHub",
    "HEARTH.diagnosticProbeCanvasSurfaceTruth",
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
    "DEXTER_LAB.hearthDiagnosticRail",
    "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth"
  ]);

  const WEST_ALIAS_PATHS = Object.freeze([
    "LAB_RUNTIME_TABLE_WEST",
    "RUNTIME_TABLE_WEST",
    "LAB_CARDINAL_RUNTIME_TABLE_WEST",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST",
    "HEARTH_RUNTIME_TABLE_WEST",
    "HEARTH_WEST_ADMISSIBILITY",
    "HEARTH_MACRO_WEST_AUTHORITY",
    "LAB_RUNTIME_TABLE_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
    "HEARTH_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_DIAGNOSTIC_CYCLE_CLOSURE_CANVAS_RETURN_RECEIPT",
    "HEARTH_WEST_DIAGNOSTIC_CYCLE_CLOSURE_CANVAS_RETURN_RECEIPT",
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP",
    "HEARTH_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP",
    "HEARTH.runtimeTableWest",
    "HEARTH.westRuntimeTable",
    "HEARTH.westAdmissibility",
    "HEARTH.macroWestAuthority",
    "HEARTH.westCanvasV123PointerSurfaceBishopReleaseBridge",
    "HEARTH.westDiagnosticCycleClosureCanvasReturnReceipt",
    "HEARTH.westPointerSurfaceBishopChainMap",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.cardinalRuntimeTableWest",
    "DEXTER_LAB.hearthRuntimeTableWest",
    "DEXTER_LAB.westAdmissibility",
    "DEXTER_LAB.hearthWestCanvasV123PointerSurfaceBishopReleaseBridge",
    "DEXTER_LAB.hearthWestDiagnosticCycleClosureCanvasReturnReceipt",
    "DEXTER_LAB.hearthWestPointerSurfaceBishopChainMap"
  ]);

  const state = {
    timestamp: "",
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    cycleClosureActive: true,
    pointerSurfaceBishopChainMapActive: true,
    pointerSurfaceBishopIsMainGate: true,
    pointerInspectIsChildOrganizerOnly: true,
    pointerInspectIsMainChainGate: false,
    pointerInspectCanBlockMainLoop: false,
    expressionLoopActive: true,
    canvasReturnReceiptRequiredForClosure: true,
    passiveReadOnlyAudit: true,

    routeConductorObserved: false,
    controlsObserved: false,
    canvasObserved: false,
    hexAuthorityObserved: false,
    hexSurfaceObserved: false,
    pointerSurfaceBishopObserved: false,
    pointerInspectPriestObserved: false,
    diagnosticChronologyObserved: false,

    routeConductorContract: "",
    controlsContract: "",
    canvasContract: "",
    hexAuthorityContract: "",
    hexSurfaceContract: "",
    pointerSurfaceBishopContract: "",
    pointerInspectPriestContract: "",

    routeConductorRecognized: false,
    controlsRecognized: false,
    canvasRecognized: false,
    hexAuthorityRecognized: false,
    hexSurfaceRecognized: false,
    pointerSurfaceBishopRecognized: false,
    pointerInspectPriestRecognized: false,

    chronologyStatus: "UNKNOWN",
    chronologyClean: false,
    chronologyStepCount: 0,
    chronologyCompleteCount: 0,

    routeToControlsConfirmed: false,
    controlsToCanvasConfirmed: false,
    canvasToHexConfirmed: false,
    hexToPointerSurfaceConfirmed: false,
    pointerSurfaceToCanvasReturnConfirmed: false,
    pointerSurfaceToInspectAdvisoryObserved: false,

    canvasReturnReceiptPublished: false,
    canvasReturnArtifactReceived: false,
    canvasReturnArtifactAccepted: false,
    canvasReturnArtifactApplied: false,

    cycleClosed: false,
    cycleClosureStatus: "NOT_RUN",
    firstOpenDutyCoordinate: "NOT_RUN",
    firstOpenDutyClass: "NOT_RUN",
    firstOpenDutyReason: "NOT_RUN",
    firstOpenDutyFile: "NONE",
    firstOpenDutyOwner: "NONE",

    westDecision: WEST_DECISION.HOLD,
    westGapClass: WEST_GAP_CLASS.WAITING_CHRONOLOGY,
    westForwardAllowed: false,
    canvasReleaseAuthorized: false,
    canvasReleasePacketReady: false,
    releaseToCanvas: false,
    releasePacket: null,

    authorities: {},
    relationships: [],
    advisoryRelationships: [],
    relationshipCount: 0,
    relationshipClosedCount: 0,

    firstFailedCoordinate: "NOT_RUN",
    recommendedNextFile: "NONE",
    recommendedNextAction: "RUN_LAB_WEST_POINTER_SURFACE_BISHOP_CHAIN_AUDIT",
    postgameStatus: "WEST_POINTER_SURFACE_CHAIN_ANCHOR_READY",

    aliasPublishCount: 0,
    receiptPublishCount: 0,
    runCount: 0,
    errorCount: 0,
    errors: [],

    ...NO_CLAIMS
  };

  const api = {};

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
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1") return true;
    if (value === false || value === 0 || value === "0") return false;

    const text = safeString(value).trim().toLowerCase();
    if (["true", "yes", "ready", "active", "accepted", "complete", "closed", "present"].includes(text)) return true;
    if (["false", "no", "held", "pending", "blocked", "none", "missing"].includes(text)) return false;

    return fallback;
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clonePlain(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function readPath(path, base = root) {
    const parts = safeString(path).split(".");
    let cursor = base;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null ? fallback : value;
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null ? fallback : value;
      }
    }

    return fallback;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (!text) continue;
      if (["UNKNOWN", "NONE", "NOT_FOUND", "UNREADABLE", "INACCESSIBLE"].includes(text)) continue;
      return text;
    }
    return "";
  }

  function textContains(source, patterns) {
    const text = safeString(source).toUpperCase();
    return (patterns || []).some((pattern) => text.includes(safeString(pattern).toUpperCase()));
  }

  function objectText(...objects) {
    return objects
      .map((object) => {
        try {
          return JSON.stringify(object || {});
        } catch (_error) {
          return "";
        }
      })
      .join(" | ");
  }

  function truthyAny(source, keys) {
    return (keys || []).some((key) => safeBool(readRaw(source, key, false), false));
  }

  function scriptInfo(path) {
    if (!doc || !isFunction(doc.querySelectorAll)) {
      return { present: false, count: 0, src: "NONE", cacheKey: "NONE", matches: [] };
    }

    const matches = [];
    const fileName = path.split("/").filter(Boolean).pop();

    try {
      const scripts = Array.from(doc.querySelectorAll("script[src]"));

      scripts.forEach((script, index) => {
        const src = safeString(script.getAttribute("src"));
        let pathname = src;
        let cacheKey = "NONE";

        try {
          const base = root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com";
          const url = new URL(src, base);
          pathname = url.pathname;
          cacheKey = url.searchParams.get("v") || url.searchParams.get("cacheKey") || "NONE";
        } catch (_error) {}

        if (pathname === path || pathname.endsWith(path) || src.includes(path) || (fileName && src.includes(fileName))) {
          matches.push({ order: index + 1, src, pathname, cacheKey });
        }
      });
    } catch (_error) {}

    const last = matches[matches.length - 1] || null;

    return {
      present: matches.length > 0,
      count: matches.length,
      src: last ? last.src : "NONE",
      cacheKey: last ? last.cacheKey : "NONE",
      matches
    };
  }

  function authorityMethods(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];
    try {
      return Object.keys(authority).filter((key) => isFunction(authority[key])).sort();
    } catch (_error) {
      return [];
    }
  }

  function hasMethod(authorityRecord, names) {
    const methods = authorityRecord.methods || [];
    return (names || []).some((name) => methods.includes(name));
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) {
      return { method: "NONE", receipt: null, callAttempted: false, callError: "NONE" };
    }

    for (const method of READ_RECEIPT_METHODS) {
      if (!isFunction(authority[method])) continue;
      if (MUTATING_OR_LIFECYCLE_METHODS.includes(method)) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) {
          return { method, receipt: output, callAttempted: true, callError: "NONE" };
        }
      } catch (error) {
        return {
          method,
          receipt: null,
          callAttempted: true,
          callError: safeString(error && error.message ? error.message : error)
        };
      }
    }

    if (isObject(authority.receipt)) return { method: "receipt", receipt: authority.receipt, callAttempted: false, callError: "NONE" };
    if (isObject(authority.receiptPacket)) return { method: "receiptPacket", receipt: authority.receiptPacket, callAttempted: false, callError: "NONE" };
    if (isObject(authority.state)) return { method: "state", receipt: authority.state, callAttempted: false, callError: "NONE" };
    if (isObject(authority.report)) return { method: "report", receipt: authority.report, callAttempted: false, callError: "NONE" };

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return { method: "authorityObject", receipt: authority, callAttempted: false, callError: "NONE" };
    }

    return { method: "NONE", receipt: null, callAttempted: false, callError: "NONE" };
  }

  function contractOf(value) {
    const v = isObject(value) ? value : {};
    return firstKnown(
      v.CONTRACT,
      v.contract,
      v.internalRenewalContract,
      v.INTERNAL_RENEWAL_CONTRACT,
      v.renewalContract,
      v.RENEWAL_CONTRACT,
      v.currentCanvasParentContract,
      v.canvasContract,
      v.hearthCanvasContract,
      v.controlContract,
      v.controlsContract,
      v.routeConductorContract,
      v.currentRouteConductorContract,
      v.hexSurfaceContract,
      v.hexAuthorityContract,
      v.pointerSurfaceContract,
      v.pointerBishopContract,
      v.fingerSurfaceContract,
      v.pointerFingerContract,
      v.pointerInspectContract,
      v.fingerInspectContract,
      v.sourceContract
    );
  }

  function receiptOf(value) {
    const v = isObject(value) ? value : {};
    return firstKnown(
      v.RECEIPT,
      v.receipt,
      v.internalRenewalReceipt,
      v.INTERNAL_RENEWAL_RECEIPT,
      v.renewalReceipt,
      v.RENEWAL_RECEIPT,
      v.currentCanvasParentReceipt,
      v.canvasReceipt,
      v.hearthCanvasReceipt,
      v.controlReceipt,
      v.controlsReceipt,
      v.routeConductorReceipt,
      v.currentRouteConductorReceipt,
      v.hexSurfaceReceipt,
      v.hexAuthorityReceipt,
      v.pointerSurfaceReceipt,
      v.pointerBishopReceipt,
      v.fingerSurfaceReceipt,
      v.pointerFingerReceipt,
      v.pointerInspectReceipt,
      v.fingerInspectReceipt,
      v.sourceReceipt
    );
  }

  function recognize(contract, accepted, familyPattern) {
    const text = safeString(contract);
    if (!text) return false;
    if ((accepted || []).includes(text)) return true;
    return Boolean(familyPattern && familyPattern.test(text));
  }

  function inspectAuthority(name, aliases, file, acceptedContracts, familyPattern) {
    const candidates = [];

    for (const path of aliases || []) {
      const authority = readPath(path);
      if (!authority) continue;

      const read = readAuthorityReceipt(authority);
      const receipt = read.receipt || {};
      const contract = firstKnown(contractOf(receipt), contractOf(authority));
      const receiptName = firstKnown(receiptOf(receipt), receiptOf(authority));
      const methods = authorityMethods(authority);

      candidates.push({
        name,
        path,
        authority,
        receiptObject: receipt,
        contract,
        receipt: receiptName,
        method: read.method,
        methodCount: methods.length,
        methods,
        callError: read.callError
      });
    }

    const script = scriptInfo(file);
    const selected =
      candidates.find((candidate) => recognize(candidate.contract, acceptedContracts, familyPattern)) ||
      candidates.find((candidate) => candidate.contract) ||
      candidates[0] ||
      null;

    return {
      name,
      file,
      observed: Boolean(selected || script.present),
      authorityPresent: Boolean(selected && selected.authority),
      sourcePath: selected ? selected.path : "NONE",
      contract: selected ? selected.contract : "",
      receipt: selected ? selected.receipt : "",
      recognized: selected ? recognize(selected.contract, acceptedContracts, familyPattern) : false,
      method: selected ? selected.method : "NONE",
      methodCount: selected ? selected.methodCount : 0,
      methods: selected ? selected.methods.slice(0, 120) : [],
      receiptObject: selected ? clonePlain(selected.receiptObject) : {},
      scriptPresent: script.present,
      scriptCount: script.count,
      scriptSrc: script.src,
      scriptCacheKey: script.cacheKey,
      candidates: candidates.map((candidate) => ({
        path: candidate.path,
        contract: candidate.contract,
        receipt: candidate.receipt,
        method: candidate.method,
        methodCount: candidate.methodCount
      }))
    };
  }

  function inspectDiagnosticChronology() {
    const diagnostic = inspectAuthority(
      "diagnosticChronology",
      DIAGNOSTIC_ALIASES,
      "/assets/hearth/hearth.diagnostic.rail.js",
      [
        "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11",
        "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10",
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1"
      ],
      /HEARTH_DIAGNOSTIC/i
    );

    const r = diagnostic.receiptObject || {};
    const chronology =
      Array.isArray(r.chronology) ? r.chronology :
      Array.isArray(r.CHRONOLOGY_SEQUENCE) ? r.CHRONOLOGY_SEQUENCE :
      Array.isArray(r.CHRONOLOGY_SEQUENCE_JSON) ? r.CHRONOLOGY_SEQUENCE_JSON :
      [];

    const completeCount = chronology.filter((entry) => entry && entry.status === "COMPLETE").length;
    const clean = Boolean(
      (chronology.length > 0 && completeCount === chronology.length) ||
      safeBool(readRaw(r, "CHRONOLOGY_EXECUTION_LANE_CLEAN", false), false)
    );

    const status = firstKnown(
      readRaw(r, "CHRONOLOGY_EXECUTION_LANE_STATUS", ""),
      readRaw(r, "CHRONOLOGY_COMPLETION_STATUS", ""),
      clean ? "CHRONOLOGY_EXECUTION_LANE_COMPLETE" : ""
    ) || "UNKNOWN";

    return {
      ...diagnostic,
      chronology,
      chronologyStatus: status,
      chronologyClean: clean,
      chronologyStepCount: chronology.length,
      chronologyCompleteCount: completeCount
    };
  }

  function inspectAuthorities() {
    const authorities = {
      route: inspectAuthority("routeConductor", ROUTE_CONDUCTOR_ALIASES, ROUTE_CONDUCTOR_FILE, ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS, /HEARTH_ROUTE_CONDUCTOR/i),
      controls: inspectAuthority("controlsQueen", CONTROLS_ALIASES, CONTROLS_FILE, ACCEPTED_CONTROLS_CONTRACTS, /HEARTH_CONTROLS/i),
      canvas: inspectAuthority("canvasPublicReceiver", CANVAS_ALIASES, CANVAS_FILE, ACCEPTED_CANVAS_CONTRACTS, /HEARTH_CANVAS/i),
      hexAuthority: inspectAuthority("hexAuthority", HEX_AUTHORITY_ALIASES, HEX_AUTHORITY_FILE, ACCEPTED_HEX_AUTHORITY_CONTRACTS, /HEARTH_HEX_FOUR_PAIR/i),
      hexSurface: inspectAuthority("hexSurfaceGate", HEX_SURFACE_ALIASES, HEX_SURFACE_FILE, ACCEPTED_HEX_SURFACE_CONTRACTS, /HEARTH_HEX_SURFACE/i),
      pointerSurface: inspectAuthority("pointerSurfaceBishop", POINTER_SURFACE_ALIASES, POINTER_SURFACE_FILE, ACCEPTED_POINTER_SURFACE_CONTRACTS, /HEARTH_CANVAS_FINGER_SURFACE|HEARTH_POINTER_SURFACE|SURFACE.*BISHOP/i),
      pointerInspect: inspectAuthority("pointerInspectPriest", POINTER_INSPECT_ALIASES, POINTER_INSPECT_FILE, ACCEPTED_POINTER_INSPECT_CONTRACTS, /HEARTH_CANVAS_FINGER_INSPECT|INSPECT/i),
      diagnostic: inspectDiagnosticChronology()
    };

    state.authorities = clonePlain(authorities);

    state.routeConductorObserved = authorities.route.observed;
    state.controlsObserved = authorities.controls.observed;
    state.canvasObserved = authorities.canvas.observed;
    state.hexAuthorityObserved = authorities.hexAuthority.observed;
    state.hexSurfaceObserved = authorities.hexSurface.observed;
    state.pointerSurfaceBishopObserved = authorities.pointerSurface.observed;
    state.pointerInspectPriestObserved = authorities.pointerInspect.observed;
    state.diagnosticChronologyObserved = authorities.diagnostic.observed;

    state.routeConductorContract = authorities.route.contract;
    state.controlsContract = authorities.controls.contract;
    state.canvasContract = authorities.canvas.contract;
    state.hexAuthorityContract = authorities.hexAuthority.contract;
    state.hexSurfaceContract = authorities.hexSurface.contract;
    state.pointerSurfaceBishopContract = authorities.pointerSurface.contract;
    state.pointerInspectPriestContract = authorities.pointerInspect.contract;

    state.routeConductorRecognized = authorities.route.recognized;
    state.controlsRecognized = authorities.controls.recognized;
    state.canvasRecognized = authorities.canvas.recognized;
    state.hexAuthorityRecognized = authorities.hexAuthority.recognized;
    state.hexSurfaceRecognized = authorities.hexSurface.recognized;
    state.pointerSurfaceBishopRecognized = authorities.pointerSurface.recognized;
    state.pointerInspectPriestRecognized = authorities.pointerInspect.recognized;

    state.chronologyStatus = authorities.diagnostic.chronologyStatus;
    state.chronologyClean = authorities.diagnostic.chronologyClean;
    state.chronologyStepCount = authorities.diagnostic.chronologyStepCount;
    state.chronologyCompleteCount = authorities.diagnostic.chronologyCompleteCount;

    return authorities;
  }

  function canvasReturnReceiverPresent(canvasAuthority) {
    return hasMethod(canvasAuthority, [
      "receivePointerSurfaceReturnPacket",
      "consumePointerSurfaceReturnPacket",
      "receivePointerBishopReturnPacket",
      "consumePointerBishopReturnPacket",
      "receiveFingerSurfaceReturnPacket",
      "consumeFingerSurfaceReturnPacket",
      "receiveCanvasReturnPacket",
      "consumeCanvasReturnPacket",
      "receivePointerExpressionArtifact",
      "consumePointerExpressionArtifact",
      "receiveFingerArtifact",
      "consumeFingerArtifact"
    ]);
  }

  function canvasViewReceiverPresent(canvasAuthority) {
    return hasMethod(canvasAuthority, [
      "receiveHexGateViewControlPacket",
      "consumeHexGateViewControlPacket",
      "receiveControlsHexGatePacket",
      "consumeControlsHexGatePacket",
      "receivePlanetaryViewControlPacket",
      "consumePlanetaryViewControlPacket",
      "receiveViewControlPacket",
      "consumeViewControlPacket",
      "receiveCanvasViewState",
      "consumeCanvasViewState",
      "receiveViewState",
      "setViewState"
    ]);
  }

  function hexReceivesCanvasPresent(hexAuthority) {
    return hasMethod(hexAuthority, [
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "receiveHexGateViewPacket",
      "consumeHexGateViewPacket",
      "receivePairRenderPacket",
      "consumePairRenderPacket"
    ]);
  }

  function pointerSurfaceReceivesHexPresent(pointerSurfaceAuthority) {
    return hasMethod(pointerSurfaceAuthority, [
      "receiveHexSurfacePacket",
      "consumeHexSurfacePacket",
      "receiveHexPointerPacket",
      "consumeHexPointerPacket",
      "receiveSurfacePointerPacket",
      "consumeSurfacePointerPacket",
      "receiveBishopGatePacket",
      "consumeBishopGatePacket",
      "receivePairPointerPacket",
      "consumePairPointerPacket"
    ]);
  }

  function pointerInspectChildPresent(pointerInspectAuthority) {
    return Boolean(
      pointerInspectAuthority.observed ||
      hasMethod(pointerInspectAuthority, [
        "receivePointerSurfaceChildPacket",
        "consumePointerSurfaceChildPacket",
        "receiveFingerSurfacePacket",
        "consumeFingerSurfacePacket",
        "organizeChildren",
        "inspectChildren",
        "getFingerInspectReceipt"
      ])
    );
  }

  function makeRelationship(id, from, to, file, requestObserved, grantObserved, returnObserved, artifactReceived, artifactAccepted, artifactApplied, reason) {
    const closed = Boolean(requestObserved && grantObserved && returnObserved);
    const fullyApplied = Boolean(closed && artifactReceived && artifactAccepted && artifactApplied);

    let status = "NOT_OBSERVED";
    let varianceClass = "NOT_OBSERVED";

    if (fullyApplied) {
      status = "DUTY_CLOSED_ARTIFACT_APPLIED";
      varianceClass = "DUTY_COMPLETE";
    } else if (closed) {
      status = "HANDSHAKE_CLOSED_RETURN_OBSERVED";
      varianceClass = "RETURN_OBSERVED_ARTIFACT_APPLICATION_PENDING";
    } else if (requestObserved && grantObserved && !returnObserved) {
      status = "GRANT_OBSERVED_RETURN_NOT_CONFIRMED";
      varianceClass = WEST_GAP_CLASS.RETURN_NOT_CONFIRMED;
    } else if (requestObserved && !grantObserved) {
      status = "REQUEST_OBSERVED_GRANT_NOT_CONFIRMED";
      varianceClass = WEST_GAP_CLASS.REQUEST_ONLY;
    } else if (!requestObserved && (grantObserved || returnObserved)) {
      status = "DOWNSTREAM_SIGNAL_WITHOUT_UPSTREAM_REQUEST";
      varianceClass = "ASYMMETRIC_SIGNAL";
    }

    return {
      id,
      from,
      to,
      file,
      requestObserved: Boolean(requestObserved),
      grantObserved: Boolean(grantObserved),
      returnObserved: Boolean(returnObserved),
      artifactReceived: Boolean(artifactReceived),
      artifactAccepted: Boolean(artifactAccepted),
      artifactApplied: Boolean(artifactApplied),
      relationshipClosed: closed,
      relationshipFullyApplied: fullyApplied,
      relationshipStatus: status,
      varianceClass,
      reason,
      ...NO_CLAIMS
    };
  }

  function inspectDutyCycle(authorities) {
    const routeReceipt = authorities.route.receiptObject || {};
    const controlsReceipt = authorities.controls.receiptObject || {};
    const canvasReceipt = authorities.canvas.receiptObject || {};
    const hexReceipt = authorities.hexSurface.receiptObject || {};
    const pointerSurfaceReceipt = authorities.pointerSurface.receiptObject || {};
    const pointerInspectReceipt = authorities.pointerInspect.receiptObject || {};

    const routeText = objectText(routeReceipt, authorities.route);
    const controlsText = objectText(controlsReceipt, authorities.controls);
    const canvasText = objectText(canvasReceipt, authorities.canvas);
    const hexText = objectText(hexReceipt, authorities.hexSurface);
    const pointerSurfaceText = objectText(pointerSurfaceReceipt, authorities.pointerSurface);
    const pointerInspectText = objectText(pointerInspectReceipt, authorities.pointerInspect);

    const routeToControlsRequest = Boolean(
      authorities.route.observed &&
      (
        textContains(routeText, ["CONTROL", "CONTROLS", "QUEEN", "ROUTE_TO_CONTROLS"]) ||
        hasMethod(authorities.route, ["getControlHandshakePacket", "getControlsHandshakePacket", "composeControlHandshakePacket"])
      )
    );

    const routeToControlsGrant = Boolean(
      authorities.controls.observed &&
      (
        truthyAny(controlsReceipt, ["handshakeAccepted", "controlHandshakeAccepted", "inputAdmissionOpen"]) ||
        textContains(controlsText, ["HANDSHAKE_ACCEPTED", "INPUT_ADMISSION_OPEN", "HEX_GATE_TRANSMISSION_READY"])
      )
    );

    const routeToControlsReturn = Boolean(routeToControlsGrant && (authorities.controls.method !== "NONE" || authorities.controls.methodCount > 0));

    const controlsToCanvasRequest = Boolean(
      authorities.controls.observed &&
      (
        truthyAny(controlsReceipt, ["supportsCanvasPublicPacketDelivery", "hexGateTransmissionActive", "viewPacketReady"]) ||
        textContains(controlsText, ["CANVAS_PUBLIC", "VIEW_DELTA", "VIEW_CONTROL", "HEX_GATE"])
      )
    );

    const controlsToCanvasGrant = Boolean(
      authorities.canvas.observed &&
      (
        canvasViewReceiverPresent(authorities.canvas) ||
        truthyAny(canvasReceipt, ["controlsReceiverReady", "viewPacketAccepted", "planetaryViewControlPacketAccepted"]) ||
        textContains(canvasText, ["CONTROL", "VIEW", "RECEIVER", "PLANETARY_VIEW"])
      )
    );

    const controlsToCanvasReturn = Boolean(
      controlsToCanvasGrant &&
      (
        truthyAny(canvasReceipt, ["viewStateApplied", "viewPacketApplied", "controlsPacketApplied", "interactiveViewApplied"]) ||
        textContains(canvasText, ["VIEW_APPLIED", "VIEW_STATE", "FAST_VIEW", "INTERACTIVE"])
      )
    );

    const canvasToHexRequest = Boolean(
      authorities.canvas.observed &&
      (
        truthyAny(canvasReceipt, ["hexGateTransmissionActive", "hexGatePacketReady", "hexSurfacePacketReady"]) ||
        textContains(canvasText, ["HEX_GATE", "HEX_SURFACE", "PAIR_RENDERER"])
      )
    );

    const canvasToHexGrant = Boolean(
      authorities.hexSurface.observed &&
      (
        hexReceivesCanvasPresent(authorities.hexSurface) ||
        truthyAny(hexReceipt, ["canvasPacketAccepted", "hexGatePacketAccepted", "pairRenderPacketAccepted", "hexSurfaceReady"]) ||
        textContains(hexText, ["CANVAS", "HEX_GATE", "PAIR_RENDER"])
      )
    );

    const canvasToHexReturn = Boolean(
      canvasToHexGrant &&
      (
        truthyAny(hexReceipt, ["pairRenderReady", "hexSurfaceRendered", "hexGateApplied", "pointerSurfacePacketReady", "pointerBishopPacketReady"]) ||
        textContains(hexText, ["POINTER_SURFACE", "SURFACE_BISHOP", "BISHOP", "RETURN", "RENDER_READY"])
      )
    );

    const hexToPointerSurfaceRequest = Boolean(
      authorities.hexSurface.observed &&
      (
        truthyAny(hexReceipt, ["pointerSurfacePacketReady", "pointerBishopPacketReady", "pointerSurfaceHandoffReady", "hexSurfaceMayForwardToPointerSurface"]) ||
        textContains(hexText, ["POINTER_SURFACE", "SURFACE_BISHOP", "FINGER_SURFACE", "BISHOP"])
      )
    );

    const hexToPointerSurfaceGrant = Boolean(
      authorities.pointerSurface.observed &&
      (
        pointerSurfaceReceivesHexPresent(authorities.pointerSurface) ||
        truthyAny(pointerSurfaceReceipt, ["hexSurfacePacketAccepted", "pointerSurfacePacketAccepted", "bishopGateReady", "fingerSurfaceReady"]) ||
        textContains(pointerSurfaceText, ["HEX", "SURFACE", "BISHOP", "GATE"])
      )
    );

    const hexToPointerSurfaceReturn = Boolean(
      hexToPointerSurfaceGrant &&
      (
        truthyAny(pointerSurfaceReceipt, ["canvasReturnPacketReady", "canvasReturnReceiptReady", "returnPacketReady", "artifactReady"]) ||
        textContains(pointerSurfaceText, ["ARTIFACT", "RETURN", "CANVAS_RETURN", "CHILDREN"])
      )
    );

    const pointerSurfaceToCanvasRequest = Boolean(
      authorities.pointerSurface.observed &&
      (
        truthyAny(pointerSurfaceReceipt, ["canvasReturnPacketReady", "canvasReturnReceiptReady", "returnPacketReady", "artifactReady"]) ||
        textContains(pointerSurfaceText, ["CANVAS_RETURN", "RETURN_PACKET", "ARTIFACT"])
      )
    );

    const pointerSurfaceToCanvasGrant = Boolean(
      authorities.canvas.observed &&
      (
        canvasReturnReceiverPresent(authorities.canvas) ||
        truthyAny(canvasReceipt, ["canvasReturnReceiverReady", "pointerSurfaceReturnReceiverReady", "fingerSurfaceArtifactReceiverReady"]) ||
        textContains(canvasText, ["RETURN_RECEIVER", "POINTER_SURFACE_RETURN", "FINGER_SURFACE_ARTIFACT", "BISHOP_RETURN"])
      )
    );

    const pointerSurfaceToCanvasReturn = Boolean(
      pointerSurfaceToCanvasGrant &&
      (
        truthyAny(canvasReceipt, ["canvasReturnReceiptPublished", "pointerSurfaceReturnReceiptPublished", "fingerSurfaceArtifactReceived", "canvasReturnArtifactReceived"]) ||
        textContains(canvasText, ["RETURN_RECEIPT", "ARTIFACT_RECEIVED", "ARTIFACT_ACCEPTED", "ARTIFACT_APPLIED"])
      )
    );

    const canvasReturnArtifactReceived = Boolean(
      pointerSurfaceToCanvasReturn ||
      truthyAny(canvasReceipt, ["canvasReturnArtifactReceived", "fingerSurfaceArtifactReceived", "pointerSurfaceArtifactReceived"])
    );

    const canvasReturnArtifactAccepted = Boolean(
      truthyAny(canvasReceipt, ["canvasReturnArtifactAccepted", "fingerSurfaceArtifactAccepted", "pointerSurfaceArtifactAccepted"]) ||
      textContains(canvasText, ["ARTIFACT_ACCEPTED"])
    );

    const canvasReturnArtifactApplied = Boolean(
      truthyAny(canvasReceipt, ["canvasReturnArtifactApplied", "fingerSurfaceArtifactApplied", "pointerSurfaceArtifactApplied", "returnArtifactApplied"]) ||
      textContains(canvasText, ["ARTIFACT_APPLIED", "RETURN_APPLIED"])
    );

    const relationships = [
      makeRelationship(
        "ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE",
        "ROUTE_CONDUCTOR",
        "CONTROLS_QUEEN",
        CONTROLS_FILE,
        routeToControlsRequest,
        routeToControlsGrant,
        routeToControlsReturn,
        routeToControlsGrant,
        routeToControlsGrant,
        routeToControlsReturn,
        "Route must request and Controls must accept admission before motion duties can be trusted."
      ),
      makeRelationship(
        "CONTROLS_TO_CANVAS_VIEW_DELTA_HANDSHAKE",
        "CONTROLS_QUEEN",
        "CANVAS_PUBLIC_RECEIVER",
        CANVAS_FILE,
        controlsToCanvasRequest,
        controlsToCanvasGrant,
        controlsToCanvasReturn,
        controlsToCanvasGrant,
        controlsToCanvasReturn,
        controlsToCanvasReturn,
        "Controls must deliver view duty to Canvas public receiver."
      ),
      makeRelationship(
        "CANVAS_TO_HEX_SURFACE_EXPRESSION_GATE",
        "CANVAS_PUBLIC_RECEIVER",
        "HEX_SURFACE_GATE",
        HEX_SURFACE_FILE,
        canvasToHexRequest,
        canvasToHexGrant,
        canvasToHexReturn,
        canvasToHexGrant,
        canvasToHexReturn,
        canvasToHexReturn,
        "Canvas must pass expression duty through Hex Surface gate."
      ),
      makeRelationship(
        "HEX_SURFACE_TO_POINTER_SURFACE_BISHOP_GATE",
        "HEX_SURFACE_GATE",
        "POINTER_SURFACE_BISHOP",
        POINTER_SURFACE_FILE,
        hexToPointerSurfaceRequest,
        hexToPointerSurfaceGrant,
        hexToPointerSurfaceReturn,
        hexToPointerSurfaceGrant,
        hexToPointerSurfaceReturn,
        hexToPointerSurfaceReturn,
        "Hex Surface must hand off to Pointer Surface Bishop. Inspect is not the main-chain gate."
      ),
      makeRelationship(
        "POINTER_SURFACE_BISHOP_TO_CANVAS_RETURN_ARTIFACT",
        "POINTER_SURFACE_BISHOP",
        "CANVAS_PUBLIC_RECEIVER",
        CANVAS_FILE,
        pointerSurfaceToCanvasRequest,
        pointerSurfaceToCanvasGrant,
        pointerSurfaceToCanvasReturn,
        canvasReturnArtifactReceived,
        canvasReturnArtifactAccepted,
        canvasReturnArtifactApplied,
        "Pointer Surface Bishop must return expression artifact or receipt to Canvas Public Receiver."
      )
    ];

    const advisoryRelationships = [
      {
        id: "POINTER_SURFACE_BISHOP_TO_INSPECT_PRIEST_ORGANIZER",
        from: "POINTER_SURFACE_BISHOP",
        to: "POINTER_INSPECT_PRIEST",
        file: POINTER_INSPECT_FILE,
        requestObserved: Boolean(
          authorities.pointerSurface.observed &&
          (
            truthyAny(pointerSurfaceReceipt, ["inspectChildReady", "childOrganizerReady", "fingerInspectReady"]) ||
            textContains(pointerSurfaceText, ["INSPECT", "CHILD", "ORGANIZER", "PRIEST"])
          )
        ),
        grantObserved: pointerInspectChildPresent(authorities.pointerInspect),
        returnObserved: Boolean(
          pointerInspectChildPresent(authorities.pointerInspect) &&
          (
            truthyAny(pointerInspectReceipt, ["childOrganizationComplete", "inspectionComplete", "inspectReceiptReady"]) ||
            textContains(pointerInspectText, ["INSPECTION", "ORGANIZED", "CHILD"])
          )
        ),
        requiredForMainLoop: false,
        advisoryOnly: true,
        relationshipCanBlockMainLoop: false,
        relationshipStatus: pointerInspectChildPresent(authorities.pointerInspect)
          ? "ADVISORY_CHILD_OBSERVED"
          : "ADVISORY_CHILD_NOT_OBSERVED",
        varianceClass: pointerInspectChildPresent(authorities.pointerInspect)
          ? "ADVISORY_CHILD_PRESENT"
          : "ADVISORY_CHILD_DARK_NON_BLOCKING",
        reason: "Inspect is a child/priest organizer under Pointer Surface Bishop. It is not the main-chain gate.",
        ...NO_CLAIMS
      }
    ];

    state.routeToControlsConfirmed = relationships[0].relationshipClosed;
    state.controlsToCanvasConfirmed = relationships[1].relationshipClosed;
    state.canvasToHexConfirmed = relationships[2].relationshipClosed;
    state.hexToPointerSurfaceConfirmed = relationships[3].relationshipClosed;
    state.pointerSurfaceToCanvasReturnConfirmed = relationships[4].relationshipClosed;
    state.pointerSurfaceToInspectAdvisoryObserved = advisoryRelationships[0].grantObserved;

    state.canvasReturnReceiptPublished = pointerSurfaceToCanvasReturn;
    state.canvasReturnArtifactReceived = canvasReturnArtifactReceived;
    state.canvasReturnArtifactAccepted = canvasReturnArtifactAccepted;
    state.canvasReturnArtifactApplied = canvasReturnArtifactApplied;

    state.relationships = clonePlain(relationships);
    state.advisoryRelationships = clonePlain(advisoryRelationships);
    state.relationshipCount = relationships.length;
    state.relationshipClosedCount = relationships.filter((relationship) => relationship.relationshipClosed).length;

    return relationships;
  }

  function resolveFirstOpenDuty(relationships) {
    if (!state.diagnosticChronologyObserved) {
      return {
        coordinate: "DIAGNOSTIC_CHRONOLOGY",
        failureClass: WEST_GAP_CLASS.WAITING_CHRONOLOGY,
        reason: "Diagnostic chronology authority was not observed by LabWest.",
        file: "/assets/hearth/hearth.diagnostic.rail.js",
        owner: "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB"
      };
    }

    if (!state.routeConductorObserved) {
      return {
        coordinate: "ROUTE_CONDUCTOR",
        failureClass: WEST_GAP_CLASS.WAITING_ROUTE,
        reason: "Route Conductor authority or script was not observed.",
        file: ROUTE_CONDUCTOR_FILE,
        owner: "ROUTE_CONDUCTOR"
      };
    }

    if (!state.controlsObserved) {
      return {
        coordinate: "CONTROLS_QUEEN",
        failureClass: WEST_GAP_CLASS.WAITING_CONTROLS,
        reason: "Controls Queen authority or script was not observed.",
        file: CONTROLS_FILE,
        owner: "CONTROLS_QUEEN"
      };
    }

    if (!state.canvasObserved) {
      return {
        coordinate: "CANVAS_PUBLIC_RECEIVER",
        failureClass: WEST_GAP_CLASS.WAITING_CANVAS,
        reason: "Canvas public receiver authority or script was not observed.",
        file: CANVAS_FILE,
        owner: "CANVAS_PUBLIC_RECEIVER"
      };
    }

    if (!state.hexSurfaceObserved) {
      return {
        coordinate: "HEX_SURFACE_GATE",
        failureClass: WEST_GAP_CLASS.WAITING_HEX,
        reason: "Hex Surface gate authority or script was not observed.",
        file: HEX_SURFACE_FILE,
        owner: "HEX_SURFACE_GATE"
      };
    }

    if (!state.pointerSurfaceBishopObserved) {
      return {
        coordinate: "POINTER_SURFACE_BISHOP",
        failureClass: WEST_GAP_CLASS.WAITING_POINTER_SURFACE,
        reason: "Pointer Surface Bishop authority or script was not observed. Inspect is only child/advisory and cannot satisfy this coordinate.",
        file: POINTER_SURFACE_FILE,
        owner: "POINTER_SURFACE_BISHOP"
      };
    }

    const open = (relationships || []).find((relationship) => !relationship.relationshipClosed);

    if (open) {
      return {
        coordinate: open.id,
        failureClass: open.varianceClass,
        reason: open.relationshipStatus,
        file: open.file,
        owner: open.to
      };
    }

    if (!state.canvasReturnArtifactApplied) {
      return {
        coordinate: "CANVAS_RETURN_ARTIFACT_APPLIED",
        failureClass: WEST_GAP_CLASS.ARTIFACT_NOT_APPLIED,
        reason: "Pointer Surface-to-Canvas return exists but Canvas has not exposed artifact-applied proof.",
        file: CANVAS_FILE,
        owner: "CANVAS_PUBLIC_RECEIVER"
      };
    }

    return {
      coordinate: "NONE",
      failureClass: WEST_GAP_CLASS.NONE,
      reason: "Cycle loop closed through Pointer Surface Bishop and Canvas return receipt.",
      file: "NONE",
      owner: "NONE"
    };
  }

  function clearReleasePacket() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_CANVAS_RELEASE_PACKET = null;
    root.HEARTH_WEST_CANVAS_RELEASE_PACKET = null;
    root.LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET = null;
    root.HEARTH_WEST_CYCLE_CLOSURE_RETURN_RECEIPT_PACKET = null;
    root.LAB_RUNTIME_TABLE_WEST_CYCLE_CLOSURE_RETURN_RECEIPT_PACKET = null;

    hearth.canvasReleasePacket = null;
    hearth.westCanvasReleasePacket = null;
    hearth.westCycleClosureReturnReceiptPacket = null;

    lab.hearthWestCanvasReleasePacket = null;
    lab.hearthRuntimeTableWestReleasePacket = null;
    lab.hearthWestCycleClosureReturnReceiptPacket = null;

    state.releasePacket = null;
    return true;
  }

  function composeReleasePacket() {
    return {
      packetType: "LAB_WEST_POINTER_SURFACE_BISHOP_CYCLE_CLOSURE_CANVAS_RETURN_RECEIPT_PACKET_v5_1",
      event: "RELEASE_TO_CANVAS_RETURN_RECEIPT",
      timestamp: nowIso(),

      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      route: ROUTE,

      activeStageId: ACTIVE_STAGE_ID,
      activeGear: ACTIVE_GEAR,
      activeCycleNumber: ACTIVE_CYCLE_NUMBER,
      activeCycleRoute: ACTIVE_CYCLE_ROUTE,
      activeCardinal: ACTIVE_CARDINAL,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeNewsGate: ACTIVE_NEWS_GATE,

      expressionLoop: LOOP.slice(),
      advisoryChildren: ADVISORY_CHILDREN.slice(),

      pointerSurfaceBishopFile: POINTER_SURFACE_FILE,
      pointerInspectPriestFile: POINTER_INSPECT_FILE,
      pointerSurfaceBishopIsMainGate: true,
      pointerInspectIsChildOrganizerOnly: true,
      pointerInspectIsMainChainGate: false,
      pointerInspectCanBlockMainLoop: false,

      routeToControlsConfirmed: state.routeToControlsConfirmed,
      controlsToCanvasConfirmed: state.controlsToCanvasConfirmed,
      canvasToHexConfirmed: state.canvasToHexConfirmed,
      hexToPointerSurfaceConfirmed: state.hexToPointerSurfaceConfirmed,
      pointerSurfaceToCanvasReturnConfirmed: state.pointerSurfaceToCanvasReturnConfirmed,

      canvasReturnReceiptPublished: state.canvasReturnReceiptPublished,
      canvasReturnArtifactReceived: state.canvasReturnArtifactReceived,
      canvasReturnArtifactAccepted: state.canvasReturnArtifactAccepted,
      canvasReturnArtifactApplied: state.canvasReturnArtifactApplied,
      cycleClosed: state.cycleClosed,
      cycleClosureStatus: state.cycleClosureStatus,

      westDecision: state.westDecision,
      westGapClass: state.westGapClass,
      westForwardAllowed: state.westForwardAllowed,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      releaseToCanvas: state.releaseToCanvas,

      relationships: clonePlain(state.relationships),
      advisoryRelationships: clonePlain(state.advisoryRelationships),
      authorities: clonePlain(state.authorities),

      ownsCanvasDrawing: false,
      ownsCanvasLifecycle: false,
      ownsControlsBehavior: false,
      ownsHexTruth: false,
      ownsPointerSurfaceTruth: false,
      ownsPointerInspectTruth: false,
      ownsPlanetTruth: false,
      passiveReadOnlyAudit: true,

      ...NO_CLAIMS
    };
  }

  function publishReleasePacket(packet) {
    if (!isObject(packet)) return false;

    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_CANVAS_RELEASE_PACKET = clonePlain(packet);
    root.HEARTH_WEST_CANVAS_RELEASE_PACKET = clonePlain(packet);
    root.LAB_RUNTIME_TABLE_WEST_CANVAS_RELEASE_PACKET = clonePlain(packet);
    root.HEARTH_WEST_CYCLE_CLOSURE_RETURN_RECEIPT_PACKET = clonePlain(packet);
    root.LAB_RUNTIME_TABLE_WEST_CYCLE_CLOSURE_RETURN_RECEIPT_PACKET = clonePlain(packet);

    hearth.canvasReleasePacket = clonePlain(packet);
    hearth.westCanvasReleasePacket = clonePlain(packet);
    hearth.westCycleClosureReturnReceiptPacket = clonePlain(packet);

    lab.hearthWestCanvasReleasePacket = clonePlain(packet);
    lab.hearthRuntimeTableWestReleasePacket = clonePlain(packet);
    lab.hearthWestCycleClosureReturnReceiptPacket = clonePlain(packet);

    return true;
  }

  function applyHold(failure) {
    state.cycleClosed = false;
    state.cycleClosureStatus = "CYCLE_OPEN_HELD";
    state.westDecision = WEST_DECISION.HOLD;
    state.westGapClass = failure.failureClass || WEST_GAP_CLASS.WAITING_RETURN;
    state.westForwardAllowed = false;
    state.canvasReleaseAuthorized = false;
    state.canvasReleasePacketReady = false;
    state.releaseToCanvas = false;

    state.firstOpenDutyCoordinate = failure.coordinate;
    state.firstOpenDutyClass = failure.failureClass;
    state.firstOpenDutyReason = failure.reason;
    state.firstOpenDutyFile = failure.file;
    state.firstOpenDutyOwner = failure.owner;

    state.firstFailedCoordinate = failure.coordinate;
    state.recommendedNextFile = failure.file;
    state.recommendedNextAction = `CONFIRM_${failure.coordinate}_DUTY`;
    state.postgameStatus = `WEST_HOLD_${failure.coordinate}`;

    clearReleasePacket();
  }

  function applyRelease() {
    state.cycleClosed = true;
    state.cycleClosureStatus = "CYCLE_CLOSED_POINTER_SURFACE_BISHOP_CANVAS_RETURN_RECEIPT_CONFIRMED";
    state.westDecision = WEST_DECISION.RELEASE_TO_CANVAS_RETURN_RECEIPT;
    state.westGapClass = WEST_GAP_CLASS.NONE;
    state.westForwardAllowed = true;
    state.canvasReleaseAuthorized = true;
    state.canvasReleasePacketReady = true;
    state.releaseToCanvas = true;

    state.firstOpenDutyCoordinate = "NONE";
    state.firstOpenDutyClass = WEST_GAP_CLASS.NONE;
    state.firstOpenDutyReason = "CYCLE_CLOSED";
    state.firstOpenDutyFile = "NONE";
    state.firstOpenDutyOwner = "NONE";

    state.firstFailedCoordinate = "NONE_CYCLE_CLOSED_POINTER_SURFACE_BISHOP_CANVAS_RETURN_CONFIRMED";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "ACCEPT_WEST_POINTER_SURFACE_BISHOP_CYCLE_CLOSURE_RETURN_RECEIPT";
    state.postgameStatus = "WEST_RELEASE_TO_CANVAS_RETURN_RECEIPT";

    const packet = composeReleasePacket();
    state.releasePacket = clonePlain(packet);
    publishReleasePacket(packet);
  }

  function runCycleClosureAudit() {
    state.runCount += 1;
    state.timestamp = nowIso();

    try {
      const authorities = inspectAuthorities();
      const relationships = inspectDutyCycle(authorities);
      const failure = resolveFirstOpenDuty(relationships);

      if (failure.coordinate === "NONE") {
        applyRelease();
      } else {
        applyHold(failure);
      }

      updateDataset();
      publishGlobals();

      return getReceipt();
    } catch (error) {
      state.errorCount += 1;
      state.errors.push({
        at: nowIso(),
        message: safeString(error && error.message ? error.message : error)
      });

      applyHold({
        coordinate: "LAB_WEST_AUDIT_ERROR",
        failureClass: WEST_GAP_CLASS.STRUCTURAL_BLOCK,
        reason: safeString(error && error.message ? error.message : error),
        file: FILE,
        owner: "LAB_WEST"
      });

      updateDataset();
      publishGlobals();

      return getReceipt();
    }
  }

  function composeHierarchyRegistry() {
    return {
      timestamp: nowIso(),
      contract: "HEARTH_WEST_POINTER_SURFACE_BISHOP_HIERARCHY_REGISTRY_v5_1",
      receipt: "HEARTH_WEST_POINTER_SURFACE_BISHOP_HIERARCHY_REGISTRY_RECEIPT_v5_1",
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,

      correctedMainLoop: LOOP.slice(),
      advisoryChildren: ADVISORY_CHILDREN.slice(),

      chainMap: {
        routeConductor: { file: ROUTE_CONDUCTOR_FILE, role: "ROUTE_CONDUCTOR" },
        controlsQueen: { file: CONTROLS_FILE, role: "VIEW_INPUT_GATEWAY_AUTHORITY" },
        canvasPublicReceiver: { file: CANVAS_FILE, role: "PRESENTATION_SURFACE_AND_RETURN_RECEIVER" },
        hexAuthority: { file: HEX_AUTHORITY_FILE, role: "HEX_FOUR_PAIR_AUTHORITY" },
        hexSurfaceGate: { file: HEX_SURFACE_FILE, role: "DOWNSTREAM_EXPRESSION_GATE" },
        pointerSurfaceBishop: { file: POINTER_SURFACE_FILE, role: "MAIN_CHAIN_POINTER_SURFACE_BISHOP_GATE" },
        pointerInspectPriest: { file: POINTER_INSPECT_FILE, role: "CHILD_ORGANIZER_PRIEST_ADVISORY_ONLY" }
      },

      correction: {
        previousMisread: "POINTER_INSPECT_TREATED_AS_POINTER_GATE",
        correctedRead: "POINTER_SURFACE_IS_BISHOP_GATE_INSPECT_IS_CHILD_PRIEST_ORGANIZER",
        pointerSurfaceBishopIsMainGate: true,
        pointerInspectIsChildOrganizerOnly: true,
        pointerInspectIsMainChainGate: false,
        pointerInspectCanBlockMainLoop: false,
        missingMainChainPointerFileShouldResolveTo: POINTER_SURFACE_FILE
      },

      rules: {
        westReadsReceiptsOnly: true,
        westDoesNotMutateProduction: true,
        westDoesNotDrawCanvas: true,
        westDoesNotCallLifecycle: true,
        westDoesNotDirectLoadPointerSurface: true,
        westDoesNotDirectLoadPointerInspect: true,
        westDoesNotDirectLoadGovernedSourceStack: true,
        canvasReturnReceiptRequiredForClosure: true,
        noF21Claim: true,
        noReadyText: true,
        noVisualPassClaim: true
      },

      ...NO_CLAIMS
    };
  }

  function getHierarchyRegistry() {
    return clonePlain(composeHierarchyRegistry());
  }

  function getHierarchySurface() {
    return {
      timestamp: nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      pointerSurfaceBishopChainMapActive: true,
      pointerSurfaceBishopObserved: state.pointerSurfaceBishopObserved,
      pointerInspectPriestObserved: state.pointerInspectPriestObserved,
      pointerInspectIsChildOrganizerOnly: true,
      pointerInspectCanBlockMainLoop: false,
      relationshipCount: state.relationshipCount,
      relationshipClosedCount: state.relationshipClosedCount,
      cycleClosed: state.cycleClosed,
      firstOpenDutyCoordinate: state.firstOpenDutyCoordinate,
      firstOpenDutyFile: state.firstOpenDutyFile,
      ...NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      activeStageId: ACTIVE_STAGE_ID,
      activeGear: ACTIVE_GEAR,
      activeCycleNumber: ACTIVE_CYCLE_NUMBER,
      activeCycleRoute: ACTIVE_CYCLE_ROUTE,
      activeCardinal: ACTIVE_CARDINAL,
      activeFibonacci: ACTIVE_FIBONACCI,
      activeNewsGate: ACTIVE_NEWS_GATE,

      expressionLoopActive: true,
      expressionLoop: LOOP.slice(),
      advisoryChildren: ADVISORY_CHILDREN.slice(),
      pointerSurfaceBishopChainMapActive: true,
      pointerSurfaceBishopIsMainGate: true,
      pointerSurfaceBishopFile: POINTER_SURFACE_FILE,
      pointerInspectPriestFile: POINTER_INSPECT_FILE,
      pointerInspectIsChildOrganizerOnly: true,
      pointerInspectIsMainChainGate: false,
      pointerInspectCanBlockMainLoop: false,
      passiveReadOnlyAudit: true,

      routeConductorObserved: state.routeConductorObserved,
      controlsObserved: state.controlsObserved,
      canvasObserved: state.canvasObserved,
      hexAuthorityObserved: state.hexAuthorityObserved,
      hexSurfaceObserved: state.hexSurfaceObserved,
      pointerSurfaceBishopObserved: state.pointerSurfaceBishopObserved,
      pointerInspectPriestObserved: state.pointerInspectPriestObserved,
      diagnosticChronologyObserved: state.diagnosticChronologyObserved,

      routeConductorContract: state.routeConductorContract,
      controlsContract: state.controlsContract,
      canvasContract: state.canvasContract,
      hexAuthorityContract: state.hexAuthorityContract,
      hexSurfaceContract: state.hexSurfaceContract,
      pointerSurfaceBishopContract: state.pointerSurfaceBishopContract,
      pointerInspectPriestContract: state.pointerInspectPriestContract,

      routeConductorRecognized: state.routeConductorRecognized,
      controlsRecognized: state.controlsRecognized,
      canvasRecognized: state.canvasRecognized,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      hexSurfaceRecognized: state.hexSurfaceRecognized,
      pointerSurfaceBishopRecognized: state.pointerSurfaceBishopRecognized,
      pointerInspectPriestRecognized: state.pointerInspectPriestRecognized,

      chronologyStatus: state.chronologyStatus,
      chronologyClean: state.chronologyClean,
      chronologyStepCount: state.chronologyStepCount,
      chronologyCompleteCount: state.chronologyCompleteCount,

      routeToControlsConfirmed: state.routeToControlsConfirmed,
      controlsToCanvasConfirmed: state.controlsToCanvasConfirmed,
      canvasToHexConfirmed: state.canvasToHexConfirmed,
      hexToPointerSurfaceConfirmed: state.hexToPointerSurfaceConfirmed,
      pointerSurfaceToCanvasReturnConfirmed: state.pointerSurfaceToCanvasReturnConfirmed,
      pointerSurfaceToInspectAdvisoryObserved: state.pointerSurfaceToInspectAdvisoryObserved,

      canvasReturnReceiptPublished: state.canvasReturnReceiptPublished,
      canvasReturnArtifactReceived: state.canvasReturnArtifactReceived,
      canvasReturnArtifactAccepted: state.canvasReturnArtifactAccepted,
      canvasReturnArtifactApplied: state.canvasReturnArtifactApplied,

      relationshipCount: state.relationshipCount,
      relationshipClosedCount: state.relationshipClosedCount,

      cycleClosed: state.cycleClosed,
      cycleClosureStatus: state.cycleClosureStatus,
      firstOpenDutyCoordinate: state.firstOpenDutyCoordinate,
      firstOpenDutyClass: state.firstOpenDutyClass,
      firstOpenDutyReason: state.firstOpenDutyReason,
      firstOpenDutyFile: state.firstOpenDutyFile,
      firstOpenDutyOwner: state.firstOpenDutyOwner,

      westDecision: state.westDecision,
      westGapClass: state.westGapClass,
      westForwardAllowed: state.westForwardAllowed,
      canvasReleaseAuthorized: state.canvasReleaseAuthorized,
      canvasReleasePacketReady: state.canvasReleasePacketReady,
      releaseToCanvas: state.releaseToCanvas,
      releasePacket: isObject(state.releasePacket) ? "present" : "null",

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsWestAdmissibility: true,
      ownsCycleClosureReceiptAudit: true,
      ownsPointerSurfaceBishopChainMap: true,
      ownsCanvasReleasePacket: true,
      ownsHierarchyRegistryPublication: true,
      ownsCanvasDrawing: false,
      ownsCanvasLifecycle: false,
      ownsControlsBehavior: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsHexTruth: false,
      ownsPointerSurfaceTruth: false,
      ownsPointerInspectTruth: false,
      ownsPlanetTruth: false,
      ownsF21Latch: false,
      ownsReadyText: false,
      ownsCompletionLatch: false,
      ownsFinalVisualPassClaim: false,

      runCount: state.runCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      errorCount: state.errorCount,

      ...NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      authorities: clonePlain(state.authorities),
      relationships: clonePlain(state.relationships),
      advisoryRelationships: clonePlain(state.advisoryRelationships),
      hierarchyRegistry: composeHierarchyRegistry(),
      hierarchySurface: getHierarchySurface(),
      releasePacket: clonePlain(state.releasePacket),
      errors: clonePlain(state.errors),
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      acceptedControlsContracts: ACCEPTED_CONTROLS_CONTRACTS.slice(),
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
      acceptedHexSurfaceContracts: ACCEPTED_HEX_SURFACE_CONTRACTS.slice(),
      acceptedHexAuthorityContracts: ACCEPTED_HEX_AUTHORITY_CONTRACTS.slice(),
      acceptedPointerSurfaceContracts: ACCEPTED_POINTER_SURFACE_CONTRACTS.slice(),
      acceptedPointerInspectContracts: ACCEPTED_POINTER_INSPECT_CONTRACTS.slice()
    };
  }

  function line(key, value) {
    if (value === undefined || value === null) return `${key}=`;
    if (Array.isArray(value) || isObject(value)) {
      try {
        return `${key}=${JSON.stringify(value)}`;
      } catch (_error) {
        return `${key}=UNSERIALIZABLE`;
      }
    }
    return `${key}=${String(value)}`;
  }

  function composeReceiptText() {
    const r = getReceiptLight();

    return [
      "LAB_RUNTIME_TABLE_CARDINAL_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP_RECEIPT",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalRenewalContract", r.internalRenewalContract),
      line("internalRenewalReceipt", r.internalRenewalReceipt),
      line("previousInternalRenewalContract", r.previousInternalRenewalContract),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("expressionLoop", r.expressionLoop.join(" -> ")),
      line("pointerSurfaceBishopIsMainGate", r.pointerSurfaceBishopIsMainGate),
      line("pointerSurfaceBishopFile", r.pointerSurfaceBishopFile),
      line("pointerInspectPriestFile", r.pointerInspectPriestFile),
      line("pointerInspectIsChildOrganizerOnly", r.pointerInspectIsChildOrganizerOnly),
      line("pointerInspectIsMainChainGate", r.pointerInspectIsMainChainGate),
      line("pointerInspectCanBlockMainLoop", r.pointerInspectCanBlockMainLoop),
      line("diagnosticChronologyObserved", r.diagnosticChronologyObserved),
      line("chronologyClean", r.chronologyClean),
      line("routeConductorObserved", r.routeConductorObserved),
      line("controlsObserved", r.controlsObserved),
      line("canvasObserved", r.canvasObserved),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("pointerSurfaceBishopObserved", r.pointerSurfaceBishopObserved),
      line("pointerInspectPriestObserved", r.pointerInspectPriestObserved),
      line("routeToControlsConfirmed", r.routeToControlsConfirmed),
      line("controlsToCanvasConfirmed", r.controlsToCanvasConfirmed),
      line("canvasToHexConfirmed", r.canvasToHexConfirmed),
      line("hexToPointerSurfaceConfirmed", r.hexToPointerSurfaceConfirmed),
      line("pointerSurfaceToCanvasReturnConfirmed", r.pointerSurfaceToCanvasReturnConfirmed),
      line("pointerSurfaceToInspectAdvisoryObserved", r.pointerSurfaceToInspectAdvisoryObserved),
      line("canvasReturnReceiptPublished", r.canvasReturnReceiptPublished),
      line("canvasReturnArtifactApplied", r.canvasReturnArtifactApplied),
      line("cycleClosed", r.cycleClosed),
      line("cycleClosureStatus", r.cycleClosureStatus),
      line("firstOpenDutyCoordinate", r.firstOpenDutyCoordinate),
      line("firstOpenDutyClass", r.firstOpenDutyClass),
      line("firstOpenDutyReason", r.firstOpenDutyReason),
      line("firstOpenDutyFile", r.firstOpenDutyFile),
      line("firstOpenDutyOwner", r.firstOpenDutyOwner),
      line("westDecision", r.westDecision),
      line("westGapClass", r.westGapClass),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByWest", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false)
    ].join("\n");
  }

  function composeCompactSummary() {
    const r = getReceiptLight();

    return [
      line("CONTRACT", r.contract),
      line("INTERNAL_RENEWAL_CONTRACT", r.internalRenewalContract),
      line("POINTER_SURFACE_BISHOP_IS_MAIN_GATE", r.pointerSurfaceBishopIsMainGate),
      line("POINTER_SURFACE_BISHOP_FILE", r.pointerSurfaceBishopFile),
      line("POINTER_INSPECT_IS_CHILD_ORGANIZER_ONLY", r.pointerInspectIsChildOrganizerOnly),
      line("POINTER_INSPECT_CAN_BLOCK_MAIN_LOOP", r.pointerInspectCanBlockMainLoop),
      line("POINTER_SURFACE_BISHOP_OBSERVED", r.pointerSurfaceBishopObserved),
      line("POINTER_INSPECT_PRIEST_OBSERVED", r.pointerInspectPriestObserved),
      line("CYCLE_CLOSED", r.cycleClosed),
      line("CYCLE_CLOSURE_STATUS", r.cycleClosureStatus),
      line("FIRST_OPEN_DUTY_COORDINATE", r.firstOpenDutyCoordinate),
      line("FIRST_OPEN_DUTY_CLASS", r.firstOpenDutyClass),
      line("FIRST_OPEN_DUTY_FILE", r.firstOpenDutyFile),
      line("RECOMMENDED_NEXT_FILE", r.recommendedNextFile),
      line("WEST_DECISION", r.westDecision),
      line("f21EligibleForNorth", false),
      line("readyTextAllowed", false),
      line("visualPassClaimed", false)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText();
  }

  function getStatusText() {
    return composeCompactSummary();
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
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      expressionLoop: LOOP.slice(),
      advisoryChildren: ADVISORY_CHILDREN.slice(),
      pointerSurfaceBishopFile: POINTER_SURFACE_FILE,
      pointerInspectPriestFile: POINTER_INSPECT_FILE,
      pointerSurfaceBishopIsMainGate: true,
      pointerInspectIsChildOrganizerOnly: true,
      pointerInspectCanBlockMainLoop: false,
      relationships: clonePlain(state.relationships),
      advisoryRelationships: clonePlain(state.advisoryRelationships),
      cycleClosed: state.cycleClosed,
      firstOpenDutyCoordinate: state.firstOpenDutyCoordinate,
      firstOpenDutyFile: state.firstOpenDutyFile,
      ...NO_CLAIMS
    };
  }

  function getBishopLanes() {
    return clonePlain(state.relationships);
  }

  function getAdvisoryChildLanes() {
    return clonePlain(state.advisoryRelationships);
  }

  function getState() {
    return clonePlain(state);
  }

  function updateDataset() {
    setDataset("labRuntimeTableWestLoaded", "true");
    setDataset("labRuntimeTableWestContract", CONTRACT);
    setDataset("labRuntimeTableWestReceipt", RECEIPT);
    setDataset("labRuntimeTableWestInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("labRuntimeTableWestInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);

    setDataset("hearthWestPointerSurfaceBishopChainMapActive", "true");
    setDataset("hearthWestExpressionLoop", LOOP.join(" -> "));
    setDataset("hearthWestAdvisoryChildren", ADVISORY_CHILDREN.join(" -> "));

    setDataset("hearthWestPointerSurfaceBishopIsMainGate", "true");
    setDataset("hearthWestPointerSurfaceBishopFile", POINTER_SURFACE_FILE);
    setDataset("hearthWestPointerInspectPriestFile", POINTER_INSPECT_FILE);
    setDataset("hearthWestPointerInspectIsChildOrganizerOnly", "true");
    setDataset("hearthWestPointerInspectIsMainChainGate", "false");
    setDataset("hearthWestPointerInspectCanBlockMainLoop", "false");

    setDataset("hearthWestRouteConductorObserved", String(state.routeConductorObserved));
    setDataset("hearthWestControlsObserved", String(state.controlsObserved));
    setDataset("hearthWestCanvasObserved", String(state.canvasObserved));
    setDataset("hearthWestHexAuthorityObserved", String(state.hexAuthorityObserved));
    setDataset("hearthWestHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthWestPointerSurfaceBishopObserved", String(state.pointerSurfaceBishopObserved));
    setDataset("hearthWestPointerInspectPriestObserved", String(state.pointerInspectPriestObserved));
    setDataset("hearthWestDiagnosticChronologyObserved", String(state.diagnosticChronologyObserved));

    setDataset("hearthWestRouteToControlsConfirmed", String(state.routeToControlsConfirmed));
    setDataset("hearthWestControlsToCanvasConfirmed", String(state.controlsToCanvasConfirmed));
    setDataset("hearthWestCanvasToHexConfirmed", String(state.canvasToHexConfirmed));
    setDataset("hearthWestHexToPointerSurfaceConfirmed", String(state.hexToPointerSurfaceConfirmed));
    setDataset("hearthWestPointerSurfaceToCanvasReturnConfirmed", String(state.pointerSurfaceToCanvasReturnConfirmed));
    setDataset("hearthWestPointerSurfaceToInspectAdvisoryObserved", String(state.pointerSurfaceToInspectAdvisoryObserved));

    setDataset("hearthWestCanvasReturnReceiptPublished", String(state.canvasReturnReceiptPublished));
    setDataset("hearthWestCanvasReturnArtifactReceived", String(state.canvasReturnArtifactReceived));
    setDataset("hearthWestCanvasReturnArtifactAccepted", String(state.canvasReturnArtifactAccepted));
    setDataset("hearthWestCanvasReturnArtifactApplied", String(state.canvasReturnArtifactApplied));

    setDataset("hearthWestCycleClosed", String(state.cycleClosed));
    setDataset("hearthWestCycleClosureStatus", state.cycleClosureStatus);
    setDataset("hearthWestFirstOpenDutyCoordinate", state.firstOpenDutyCoordinate);
    setDataset("hearthWestFirstOpenDutyClass", state.firstOpenDutyClass);
    setDataset("hearthWestFirstOpenDutyReason", state.firstOpenDutyReason);
    setDataset("hearthWestFirstOpenDutyFile", state.firstOpenDutyFile);
    setDataset("hearthWestFirstOpenDutyOwner", state.firstOpenDutyOwner);

    setDataset("hearthWestDecision", state.westDecision);
    setDataset("hearthWestGapClass", state.westGapClass);
    setDataset("hearthWestForwardAllowed", String(state.westForwardAllowed));
    setDataset("hearthCanvasReleaseAuthorized", String(state.canvasReleaseAuthorized));
    setDataset("hearthCanvasReleasePacketReady", String(state.canvasReleasePacketReady));
    setDataset("hearthReleaseToCanvas", String(state.releaseToCanvas));

    setDataset("hearthWestRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthWestRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthWestPostgameStatus", state.postgameStatus);

    setDataset("hearthWestF13Claimed", "false");
    setDataset("hearthWestF21EligibleForNorth", "false");
    setDataset("hearthWestF21ClaimedByWest", "false");
    setDataset("hearthWestReadyTextAllowed", "false");
    setDataset("hearthWestReadyTextClaimed", "false");
    setDataset("hearthWestCompletionLatched", "false");
    setDataset("hearthWestVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishAliasPaths() {
    for (const path of WEST_ALIAS_PATHS) setPath(path, api);
    state.aliasPublishCount += 1;
    return true;
  }

  function publishReceiptAliases() {
    const light = getReceiptLight();
    const full = getReceipt();
    const text = composeReceiptText();
    const compact = composeCompactSummary();

    root.LAB_RUNTIME_TABLE_WEST_RECEIPT = light;
    root.LAB_RUNTIME_TABLE_CARDINAL_WEST_RECEIPT = full;
    root.LAB_RUNTIME_TABLE_CARDINAL_WEST_CANVAS_V12_3_POINTER_SURFACE_BISHOP_RELEASE_BRIDGE_RECEIPT = full;
    root.LAB_RUNTIME_TABLE_CARDINAL_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP_RECEIPT = full;

    root.HEARTH_WEST_CYCLE_CLOSURE_RECEIPT = full;
    root.HEARTH_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP_RECEIPT = full;
    root.HEARTH_WEST_CYCLE_CLOSURE_PACKET_TEXT = text;
    root.HEARTH_WEST_CYCLE_CLOSURE_COMPACT_SUMMARY = compact;

    root.HEARTH_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP = {
      pointerSurfaceBishopFile: POINTER_SURFACE_FILE,
      pointerInspectPriestFile: POINTER_INSPECT_FILE,
      pointerSurfaceBishopIsMainGate: true,
      pointerInspectIsChildOrganizerOnly: true,
      pointerInspectIsMainChainGate: false,
      pointerInspectCanBlockMainLoop: false,
      expressionLoop: LOOP.slice(),
      advisoryChildren: ADVISORY_CHILDREN.slice(),
      firstOpenDutyCoordinate: state.firstOpenDutyCoordinate,
      firstOpenDutyFile: state.firstOpenDutyFile,
      recommendedNextFile: state.recommendedNextFile,
      receipt: light
    };

    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.westCycleClosureReceipt = full;
    hearth.westPointerSurfaceBishopChainMapReceipt = full;
    hearth.westCycleClosurePacketText = text;
    hearth.westCycleClosureCompactSummary = compact;
    hearth.westPointerSurfaceBishopChainMap = root.HEARTH_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP;

    lab.hearthWestCycleClosureReceipt = full;
    lab.hearthWestPointerSurfaceBishopChainMapReceipt = full;
    lab.hearthWestPointerSurfaceBishopChainMap = root.HEARTH_WEST_POINTER_SURFACE_BISHOP_CHAIN_MAP;

    state.receiptPublishCount += 1;
    return true;
  }

  function publishGlobals() {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    if (state.releasePacket) {
      publishReleasePacket(state.releasePacket);
    } else {
      clearReleasePacket();
    }

    return api;
  }

  function scheduleRepublish() {
    const delays = [0, 16, 80, 240, 700, 1400];

    delays.forEach((delay) => {
      if (isFunction(root.setTimeout)) {
        root.setTimeout(() => {
          publishGlobals();
        }, delay);
      }
    });
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    INTERNAL_RENEWAL_CONTRACT,
    INTERNAL_RENEWAL_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    VERSION,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,

    NORTH_FILE,
    EAST_FILE,
    SOUTH_FILE,
    WEST_FILE,
    ROUTE_CONDUCTOR_FILE,
    INDEX_FILE,
    CONTROLS_FILE,
    CANVAS_FILE,
    HEX_AUTHORITY_FILE,
    HEX_SURFACE_FILE,
    POINTER_SURFACE_FILE,
    POINTER_INSPECT_FILE,

    ACTIVE_STAGE_ID,
    ACTIVE_GEAR,
    ACTIVE_CYCLE_NUMBER,
    ACTIVE_CYCLE_ROUTE,
    ACTIVE_CARDINAL,
    ACTIVE_FIBONACCI,
    ACTIVE_NEWS_GATE,

    LOOP,
    ADVISORY_CHILDREN,
    WEST_DECISION,
    WEST_GAP_CLASS,

    inspectAuthorities,
    inspectDiagnosticChronology,
    inspectDutyCycle,
    runCycleClosureAudit,
    classifyWestAdmissibility: runCycleClosureAudit,
    classifyCyclePacket: runCycleClosureAudit,
    createWestCycleReceipt: runCycleClosureAudit,
    createGapReceipt: runCycleClosureAudit,
    classifyGap: runCycleClosureAudit,
    classifyTransmissionGap: runCycleClosureAudit,
    assess: runCycleClosureAudit,
    inspect: runCycleClosureAudit,
    run: runCycleClosureAudit,
    boot: runCycleClosureAudit,
    init: runCycleClosureAudit,
    start: runCycleClosureAudit,
    mount: runCycleClosureAudit,

    composeHierarchyRegistry,
    getHierarchyRegistry,
    getHierarchySurface,
    getBishopChord,
    getBishopLanes,
    getAdvisoryChildLanes,

    getReceipt,
    getReceiptLight,
    getReceiptText,
    getStatus: getReceiptLight,
    getStatusText,
    getCompactSummary: composeCompactSummary,
    getPacketText: composeReceiptText,
    getState,

    getCanvasReleasePacket,
    getReleasePacket,
    getCanvasHandoffPacket,
    getHandoffPacket,
    composeReleasePacket,
    clearReleasePacket,
    publishReleasePacket,

    updateDataset,
    publishGlobals,
    publishAliasPaths,
    publishReceiptAliases,

    ownsWestAdmissibility: true,
    ownsCycleClosureReceiptAudit: true,
    ownsPointerSurfaceBishopChainMap: true,
    ownsCanvasReleasePacket: true,
    ownsHierarchyRegistryPublication: true,
    ownsBishopReceiptTrust: true,

    cycleClosureActive: true,
    pointerSurfaceBishopChainMapActive: true,
    pointerSurfaceBishopIsMainGate: true,
    pointerSurfaceBishopFile: POINTER_SURFACE_FILE,
    pointerInspectPriestFile: POINTER_INSPECT_FILE,
    pointerInspectIsChildOrganizerOnly: true,
    pointerInspectIsMainChainGate: false,
    pointerInspectCanBlockMainLoop: false,
    expressionLoopActive: true,
    canvasReturnReceiptRequiredForClosure: true,
    passiveReadOnlyAudit: true,

    ownsUpstreamTruth: false,
    ownsNorthTimetableTruth: false,
    ownsEastSourceTruth: false,
    ownsSouthOutputTruth: false,
    ownsControlsBehavior: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasLifecycle: false,
    ownsCanvasChildInternals: false,
    ownsHexTruth: false,
    ownsPointerSurfaceTruth: false,
    ownsPointerInspectTruth: false,
    ownsPlanetTruth: false,
    ownsF21Latch: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    mutatingOrLifecycleMethodsSuppressed: MUTATING_OR_LIFECYCLE_METHODS.slice(),

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  state.timestamp = nowIso();

  publishGlobals();

  try {
    runCycleClosureAudit();
  } catch (_error) {
    publishGlobals();
  }

  scheduleRepublish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
