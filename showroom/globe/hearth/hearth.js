// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10
// Internal controlled renewal:
// HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7
// Full-file replacement.
// Showroom Globe Hearth route conductor only.
//
// Purpose:
// - Preserve the public v10 Route Conductor contract expected by diagnostics, Controls, Canvas, and Index.
// - Stop normal UI/button contact from triggering heavy scans, asset loading, canvas pixel reads, or deep receipt serialization.
// - Make boot/start/init/run/render/refresh passive and UI-safe.
// - Keep explicit diagnostic/manual scanning available through runSafePacketBridgeScan({ explicitDiagnosticScan: true }).
// - Publish light route receipts and packet shells as evidence without forcing runtime ignition.
// - Never call Canvas lifecycle methods: boot/start/init/mount/render/run.
// - Never direct-load Pointer Finger.
// - Never direct-load governed source stack.
// - Never auto-load missing direct chain from ordinary UI contact.
// - Never append duplicate scripts when a matching path is already present.
// - Use file-path script load locks only when explicit manual loading is separately authorized.
// - Keep Controls as motion/input gateway authority.
// - Keep Hex Surface as downstream expression gate.
// - Keep Canvas as presentation platter / DOM surface authority.
// - Preserve no Canvas drawing ownership, no terrain truth, no hydrology truth, no material truth,
//   no Hex truth, no Pointer Finger truth, no F13 claim, no F21 claim, no ready text,
//   no final visual pass, no generated image, no GraphicBox, and no WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT_v10";

  const RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7";
  const RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_RECEIPT_v10_7";

  const PREVIOUS_RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5";
  const PREVIOUS_RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_RECEIPT_v10_5";

  const LINEAGE_V10_4_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4";
  const LINEAGE_V10_3_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3";
  const LINEAGE_V10_2_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2";
  const LINEAGE_V10_1_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1";
  const LINEAGE_V9_9_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const LINEAGE_V9_8_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8";
  const LINEAGE_V9_7_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const LINEAGE_V9_6_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const LINEAGE_V9_5_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const COMPAT_V9_4_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const VERSION =
    "2026-06-07.hearth-route-conductor-passive-ui-safe-manual-scan-v10-7";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RENEWAL_CANDIDATE =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_POINTER_FINGER_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const CONTROL_HANDSHAKE_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_TO_QUEEN_CONTROLS_PASSIVE_HANDSHAKE_PACKET_v10_7";
  const HEX_SCAN_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_TO_HEX_SURFACE_PASSIVE_SCAN_PACKET_v10_7";
  const PRESENTATION_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_TO_CANVAS_PASSIVE_PRESENTATION_PACKET_v10_7";
  const GOVERNED_SOURCE_PACKET =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_PASSIVE_PACKET_v10_7";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByRouteConductor: false,
    f13ClaimedByCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByRouteConductor: false,
    f21ClaimedByCanvas: false,
    f21SubmittedToNorth: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByRouteConductor: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const ACCEPTED_ROUTE_CONTRACTS = Object.freeze([
    CONTRACT,
    RENEWAL_CONTRACT,
    PREVIOUS_RENEWAL_CONTRACT,
    LINEAGE_V10_4_CONTRACT,
    LINEAGE_V10_3_CONTRACT,
    LINEAGE_V10_2_CONTRACT,
    LINEAGE_V10_1_CONTRACT,
    LINEAGE_V9_9_CONTRACT,
    LINEAGE_V9_8_CONTRACT,
    LINEAGE_V9_7_CONTRACT,
    LINEAGE_V9_6_CONTRACT,
    LINEAGE_V9_5_CONTRACT,
    COMPAT_V9_4_CONTRACT
  ]);

  const ACCEPTED_CONTROL_CONTRACTS = Object.freeze([
    EXPECTED_CONTROL_CONTRACT,
    EXPECTED_CONTROL_RENEWAL_CANDIDATE,
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
  ]);

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5"
  ]);

  const ACCEPTED_HEX_SURFACE_CONTRACTS = Object.freeze([
    EXPECTED_HEX_SURFACE_CONTRACT,
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_2",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4_1",
    "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v3",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v2",
    "HEARTH_HEX_SURFACE_RENDERER_TNT_v1"
  ]);

  const ACCEPTED_HEX_AUTHORITY_CONTRACTS = Object.freeze([
    EXPECTED_HEX_AUTHORITY_CONTRACT
  ]);

  const ACCEPTED_POINTER_FINGER_CONTRACTS = Object.freeze([
    EXPECTED_POINTER_FINGER_CONTRACT,
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1"
  ]);

  const NODES = Object.freeze({
    INDEX: Object.freeze({
      id: "INDEX_PRIEST",
      role: "passive-front-end-button-and-receipt-corridor",
      file: INDEX_FILE,
      required: false,
      loadEligible: false,
      expectedContracts: [EXPECTED_INDEX_CONTRACT],
      aliases: [
        "HEARTH_INDEX_JS",
        "HEARTH.indexJs",
        "HEARTH.index",
        "DEXTER_LAB.hearthIndexJs"
      ]
    }),
    ROUTE: Object.freeze({
      id: "ROUTE_CONDUCTOR",
      role: "route-permission-passive-ui-safe-manual-scan-authority",
      file: FILE,
      required: true,
      loadEligible: false,
      expectedContracts: ACCEPTED_ROUTE_CONTRACTS,
      aliases: [
        "HEARTH_ROUTE_CONDUCTOR",
        "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
        "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
        "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION",
        "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE",
        "HEARTH.routeConductor",
        "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
        "HEARTH.routeConductorPassiveUiSafeManualScan",
        "HEARTH.routeConductorSafePacketBridgeNoLifecycleIgnition",
        "HEARTH.routeConductorBilateralTriangleScanCanvasPlatterPacketBridge",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
        "DEXTER_LAB.hearthRouteConductorPassiveUiSafeManualScan"
      ]
    }),
    CONTROLS: Object.freeze({
      id: "CONTROLS_QUEEN",
      role: "motion-input-gateway-authority",
      file: CONTROL_FILE,
      required: true,
      loadEligible: false,
      expectedContracts: ACCEPTED_CONTROL_CONTRACTS,
      aliases: [
        "HEARTH_CONTROLS",
        "HEARTH_CONTROLS_QUEEN",
        "HEARTH_QUEEN_CONTROLS",
        "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
        "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
        "HEARTH.controls",
        "HEARTH.controlsQueen",
        "HEARTH.queenControls",
        "HEARTH.controlsPlanetaryViewInputHandshake",
        "HEARTH.controlsHexGatePointerFingerTransmission",
        "DEXTER_LAB.hearthControls",
        "DEXTER_LAB.hearthQueenControls",
        "DEXTER_LAB.hearthControlsHexGatePointerFingerTransmission"
      ]
    }),
    HEX_AUTHORITY: Object.freeze({
      id: "HEX_AUTHORITY",
      role: "hex-four-pair-authority",
      file: HEX_AUTHORITY_FILE,
      required: true,
      loadEligible: false,
      expectedContracts: ACCEPTED_HEX_AUTHORITY_CONTRACTS,
      aliases: [
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
        "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hexPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexFourPairAuthority"
      ]
    }),
    HEX_SURFACE: Object.freeze({
      id: "HEX_SURFACE_GATE",
      role: "downstream-expression-gate-authority",
      file: HEX_SURFACE_FILE,
      required: true,
      loadEligible: false,
      expectedContracts: ACCEPTED_HEX_SURFACE_CONTRACTS,
      aliases: [
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
        "DEXTER_LAB.hearthHexSurface"
      ]
    }),
    CANVAS: Object.freeze({
      id: "CANVAS_PLATTER",
      role: "presentation-platter-and-dom-surface-authority",
      file: CANVAS_FILE,
      required: true,
      loadEligible: false,
      expectedContracts: ACCEPTED_CANVAS_CONTRACTS,
      aliases: [
        "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
        "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
        "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
        "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
        "HEARTH_CANVAS_HUB",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_PARENT",
        "HEARTH_CANVAS_AUTHORITY",
        "HEARTH_CANVAS_LOCAL_STATION",
        "HEARTH_CANVAS_EXPRESSION_HUB",
        "HEARTH_CANVAS_VISIBLE_PLANET",
        "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
        "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasHubRafSphereRotationPairReceiver",
        "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
        "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
        "HEARTH.canvasPlanetaryViewControlReceiver",
        "HEARTH.canvasHub",
        "HEARTH.canvas",
        "HEARTH.canvasParent",
        "HEARTH.canvasAuthority",
        "HEARTH.canvasLocalStation",
        "HEARTH.canvasExpressionHub",
        "HEARTH.canvasVisiblePlanet",
        "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
        "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
        "DEXTER_LAB.hearthCanvasHub",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasParent",
        "DEXTER_LAB.hearthCanvasExpressionHub"
      ]
    }),
    POINTER_FINGER: Object.freeze({
      id: "POINTER_FINGER",
      role: "downstream-expression-authority",
      file: POINTER_FINGER_FILE,
      required: false,
      loadEligible: false,
      expectedContracts: ACCEPTED_POINTER_FINGER_CONTRACTS,
      aliases: [
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
        "DEXTER_LAB.hearthPointerFinger"
      ]
    })
  });

  const SOURCE_STACK = Object.freeze([
    Object.freeze({ id: "ELEVATION", file: "/assets/hearth/hearth.elevation.js", required: true, aliases: ["HEARTH_ELEVATION", "HEARTH.elevation", "DEXTER_LAB.hearthElevation"] }),
    Object.freeze({ id: "COMPOSITION", file: "/assets/hearth/hearth.composition.js", required: true, aliases: ["HEARTH_COMPOSITION", "HEARTH.composition", "DEXTER_LAB.hearthComposition"] }),
    Object.freeze({ id: "TECTONICS", file: "/assets/hearth/hearth.tectonics.js", required: true, aliases: ["HEARTH_TECTONICS", "HEARTH.tectonics", "DEXTER_LAB.hearthTectonics"] }),
    Object.freeze({ id: "HYDROLOGY", file: "/assets/hearth/hearth.hydrology.js", required: true, aliases: ["HEARTH_HYDROLOGY", "HEARTH.hydrology", "DEXTER_LAB.hearthHydrology"] }),
    Object.freeze({ id: "MATERIALS", file: "/assets/hearth/hearth.materials.js", required: true, aliases: ["HEARTH_MATERIALS", "HEARTH.materials", "DEXTER_LAB.hearthMaterials"] }),
    Object.freeze({ id: "LAND_CHANNEL", file: "/assets/hearth/hearth.land.channel.js", required: false, aliases: ["HEARTH_LAND_CHANNEL", "HEARTH.landChannel", "DEXTER_LAB.hearthLandChannel"] }),
    Object.freeze({ id: "WATER_CHANNEL", file: "/assets/hearth/hearth.water.channel.js", required: false, aliases: ["HEARTH_WATER_CHANNEL", "HEARTH.waterChannel", "DEXTER_LAB.hearthWaterChannel"] }),
    Object.freeze({ id: "AIR_CHANNEL", file: "/assets/hearth/hearth.air.channel.js", required: false, aliases: ["HEARTH_AIR_CHANNEL", "HEARTH.airChannel", "DEXTER_LAB.hearthAirChannel"] })
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,

    passiveUiSafeManualScanActive: true,
    normalUiContactIsPassiveOnly: true,
    buttonContactHeavyScanSuppressed: true,
    automaticBootScanSuppressed: true,
    automaticMissingChainLoadSuppressed: true,
    deepReceiptSerializationSuppressed: true,
    canvasPixelReadSuppressedForUi: true,

    safePacketBridgeActive: true,
    lifecycleIgnitionSuppressed: true,
    canvasLifecycleMethodsSuppressed: true,
    pointerFingerDirectLoadSuppressed: true,
    governedSourceStackDirectLoadSuppressed: true,
    duplicateScriptAppendSuppressed: true,
    filePathLoadLocksActive: true,
    reasonBasedLoadLocksRetired: true,

    routeConductorActiveScanAuthority: true,
    bilateralRouteCanvasScanActive: true,
    triangleScanActive: true,
    controlsRemainMotionInputGatewayAuthority: true,
    canvasRemainsPresentationPlatterAuthority: true,
    hexSurfaceRemainsDownstreamGateAuthority: true,
    pointerFingerRemainsDownstreamExpressionAuthority: true,
    pointerFingerDirectBridgePermissionGranted: false,
    singleHandshakeGreenLightBlocked: true,
    intendedHandoffVarianceIncluded: true,

    booted: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "ROUTE_CONDUCTOR_V10_7_LOADED_PASSIVE_UI_SAFE",
    latestPassiveReason: "INITIAL_LOAD",

    nodes: {},
    sourceStack: [],
    relationships: [],
    events: [],
    errors: [],

    routeActiveScanConfirmed: false,
    routeControlsHandshakePermissionGranted: false,
    controlsGatewayPermissionGranted: false,
    routeHexScanPermissionGranted: false,
    hexSurfaceScanPermissionGranted: false,
    routeCanvasPresentationPermissionGranted: false,
    canvasAcceptanceScanRequested: false,
    canvasAcceptanceScanConfirmed: false,
    bilateralRouteCanvasScanConfirmed: false,
    sourceStackObserved: false,
    sourceStackPermissionGranted: false,
    constructPermissionGranted: false,
    visibleSurfacePermissionGranted: false,
    motionPermissionGranted: false,

    controlHandshakeDeliveryStatus: "PASSIVE_PACKET_PUBLISHED_ONLY",
    controlHandshakeMethod: "NONE_UI_SAFE",
    canvasDeliveryStatus: "PASSIVE_PACKET_PUBLISHED_ONLY",
    canvasDeliveryMethod: "NONE_UI_SAFE",
    canvasDeliveryReason: "NORMAL_UI_CONTACT_DOES_NOT_CALL_CANVAS_RECEIVERS",
    hexScanDeliveryStatus: "PASSIVE_PACKET_PUBLISHED_ONLY",
    hexScanDeliveryMethod: "NONE_UI_SAFE",

    canvasMountFound: false,
    canvasElementFound: false,
    canvasInMount: false,
    canvasRectNonzero: false,
    canvasContext2dReady: false,
    canvasPixelVisible: false,
    canvasPixelSampleStatus: "NOT_SAMPLED_UI_SAFE",
    canvasSelector: "UNKNOWN",
    canvasMountSelector: "UNKNOWN",

    firstFailedCoordinate: "MANUAL_SCAN_NOT_RUN_UI_SAFE",
    recommendedNextFile: CANVAS_FILE,
    recommendedNextAction: "RUN_DIAGNOSTIC_WITH_EXPLICIT_MANUAL_SCAN_IF_DEEP_ROUTE_SCAN_IS_REQUIRED",
    postgameStatus: "ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_READY",

    packetCount: 0,
    passiveReadCount: 0,
    explicitScanCount: 0,
    blockedHeavyScanCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    lifecycleSuppressionCount: 0,

    lastPresentationPacket: null,
    lastControlHandshakePacket: null,
    lastHexScanPacket: null,
    lastReceiptLight: null,

    ...NO_CLAIMS
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
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function bounded(value, limit = 2400) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function clonePlain(value) {
    if (value === undefined || value === null) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function line(key, value) {
    if (Array.isArray(value) || isObject(value)) {
      try {
        return `${key}=${JSON.stringify(value).slice(0, 6000)}`;
      } catch (_error) {
        return `${key}=${bounded(value, 1200)}`;
      }
    }

    return `${key}=${value === undefined || value === null ? "" : safeString(value)}`;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
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

  function firstGlobal(paths, base = root) {
    for (const path of paths || []) {
      const value = readPath(path, base);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }

    return "";
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "ROUTE_CONDUCTOR_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 40);
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ROUTE_CONDUCTOR_ERROR"),
      message: error && error.message ? String(error.message) : bounded(error, 900),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 25);
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
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

  function scriptMatchesPath(script, path) {
    if (!script || !path) return false;
    const raw = script.getAttribute ? safeString(script.getAttribute("src")) : "";

    if (!raw) return false;

    try {
      const base =
        root.location && root.location.origin
          ? root.location.origin
          : "https://diamondgatebridge.com";
      const url = new URL(raw, base);
      return url.pathname === path;
    } catch (_error) {
      return raw.includes(path);
    }
  }

  function scriptInfo(path) {
    if (!doc || !doc.querySelectorAll) {
      return {
        present: false,
        count: 0,
        src: "DOCUMENT_UNAVAILABLE",
        cacheKey: "NONE"
      };
    }

    const scripts = Array.from(doc.querySelectorAll("script[src]")).filter((script) => {
      return scriptMatchesPath(script, path);
    });

    const last = scripts[scripts.length - 1] || null;
    const rawSrc = last && last.getAttribute ? safeString(last.getAttribute("src")) : "";

    let cacheKey = "NONE";

    try {
      const base =
        root.location && root.location.origin
          ? root.location.origin
          : "https://diamondgatebridge.com";
      const url = new URL(rawSrc, base);
      cacheKey =
        url.searchParams.get("v") ||
        url.searchParams.get("cache") ||
        url.searchParams.get("version") ||
        "NONE";
    } catch (_error) {}

    return {
      present: scripts.length > 0,
      count: scripts.length,
      src: rawSrc || "NOT_FOUND",
      cacheKey
    };
  }

  function readField(source, keys, fallback = "") {
    const object = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys || []) {
      try {
        if (object[key] !== undefined && object[key] !== null && object[key] !== "") {
          return object[key];
        }
      } catch (_error) {}

      const lower = safeString(key).toLowerCase();

      try {
        for (const candidate of Object.keys(object)) {
          if (candidate.toLowerCase() === lower) {
            const value = object[candidate];
            if (value !== undefined && value !== null && value !== "") return value;
          }
        }
      } catch (_error) {}
    }

    return fallback;
  }

  function passiveContractOf(authority) {
    return firstNonEmpty(
      readField(authority, [
        "renewalContract",
        "internalImplementationContract",
        "currentCanvasParentContract",
        "canvasContract",
        "controlsContract",
        "controlContract",
        "hexSurfaceContract",
        "hexAuthorityContract",
        "pointerFingerContract",
        "routeConductorContract",
        "contract",
        "CONTRACT"
      ], ""),
      authority && authority.contract,
      authority && authority.CONTRACT
    );
  }

  function passiveReceiptOf(authority) {
    return firstNonEmpty(
      readField(authority, [
        "renewalReceipt",
        "internalImplementationReceipt",
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlsReceipt",
        "controlReceipt",
        "hexSurfaceReceipt",
        "hexAuthorityReceipt",
        "pointerFingerReceipt",
        "routeConductorReceipt",
        "receipt",
        "RECEIPT"
      ], ""),
      authority && authority.receipt,
      authority && authority.RECEIPT
    );
  }

  function methodsOf(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    try {
      return Object.keys(authority)
        .filter((key) => isFunction(authority[key]))
        .sort()
        .slice(0, 80);
    } catch (_error) {
      return [];
    }
  }

  function contractRecognized(contract, accepted, family) {
    const text = safeString(contract);

    return Boolean(
      text &&
      text !== "UNKNOWN" &&
      (
        (accepted || []).includes(text) ||
        (family && text.includes(family))
      )
    );
  }

  function familyForNode(id) {
    if (id === "ROUTE_CONDUCTOR") return "HEARTH_ROUTE_CONDUCTOR";
    if (id === "CONTROLS_QUEEN") return "HEARTH_CONTROLS";
    if (id === "CANVAS_PLATTER") return "HEARTH_CANVAS";
    if (id === "HEX_SURFACE_GATE") return "HEARTH_HEX_SURFACE";
    if (id === "HEX_AUTHORITY") return "HEARTH_HEX";
    if (id === "POINTER_FINGER") return "FINGER";
    return "";
  }

  function scanNode(def) {
    const script = scriptInfo(def.file);
    const found = firstGlobal(def.aliases || []);
    const authority = found.value;
    const contract = passiveContractOf(authority) || "UNKNOWN";
    const receiptName = passiveReceiptOf(authority) || "UNKNOWN";
    const publicMethods = methodsOf(authority);
    const node = {
      id: def.id,
      role: def.role || "",
      file: def.file,
      required: def.required === true,
      loadEligible: false,
      expectedContracts: clonePlain(def.expectedContracts || []),

      scriptPresent: script.present,
      scriptCount: script.count,
      scriptSrc: script.src,
      scriptCacheKey: script.cacheKey,

      loadAttempted: false,
      loadStatus: "DIRECT_LOAD_SUPPRESSED_PASSIVE_UI_SAFE",
      duplicateScriptAppendSuppressed: true,

      observed: Boolean(authority),
      selectedAliasPath: found.path,
      contract,
      receipt: receiptName,
      contractRecognized: contractRecognized(contract, def.expectedContracts || [], familyForNode(def.id)),
      publicMethodCount: publicMethods.length,
      publicMethods,
      lifecycleMethodsObserved: publicMethods.filter((method) => {
        return ["boot", "start", "init", "mount", "render", "run"].includes(method);
      }),
      lifecycleIgnitionSuppressedByRoute: true,
      authorityReceiptMethodCallsSuppressed: true,
      receiptObjectOmitted: true,
      ...NO_CLAIMS
    };

    state.nodes[def.id] = node;
    return clonePlain(node);
  }

  function scanSourceStack() {
    const out = [];

    for (const source of SOURCE_STACK) {
      const info = scriptInfo(source.file);
      const found = firstGlobal(source.aliases || []);
      const authority = found.value;

      out.push({
        id: source.id,
        file: source.file,
        required: source.required === true,
        scriptPresent: info.present,
        scriptCount: info.count,
        scriptSrc: info.src,
        loadAttempted: false,
        loadStatus: "SOURCE_STACK_DIRECT_LOAD_SUPPRESSED_BY_ROUTE_CONDUCTOR",
        status: authority
          ? "SOURCE_AUTHORITY_PRESENT_PASSIVE_OBSERVATION"
          : source.required
            ? "SOURCE_AUTHORITY_REQUIRED_PENDING_PASSIVE_ONLY"
            : "SOURCE_AUTHORITY_OPTIONAL_PENDING_PASSIVE_ONLY",
        reason: authority ? "OBSERVED_PASSIVELY_BY_ROUTE_CONDUCTOR" : "AUTHORITY_NOT_OBSERVED_PASSIVE_ONLY",
        sourcePath: found.path,
        contract: passiveContractOf(authority) || "UNKNOWN",
        receipt: passiveReceiptOf(authority) || "UNKNOWN"
      });
    }

    state.sourceStack = out;
    state.sourceStackObserved = out.some((entry) => entry.status === "SOURCE_AUTHORITY_PRESENT_PASSIVE_OBSERVATION");
    state.sourceStackPermissionGranted = out.every((entry) => {
      return entry.required !== true || entry.status === "SOURCE_AUTHORITY_PRESENT_PASSIVE_OBSERVATION";
    });

    return clonePlain(out);
  }

  function scanCanvasSurface(options = {}) {
    const readPixels = options && options.readPixels === true && options.explicitDiagnosticScan === true;

    const mount =
      q("#hearthCanvasMount") ||
      q("[data-hearth-canvas-mount]") ||
      q("#hearthGlobeStage") ||
      q("[data-hearth-globe-stage]") ||
      q("[data-hearth-visible-planet-mount]");

    const canvas =
      q("#hearthCanvasMount canvas") ||
      q("[data-hearth-canvas-mount] canvas") ||
      q("#hearthGlobeStage canvas") ||
      q("[data-hearth-globe-stage] canvas") ||
      q("canvas[data-hearth-expression-surface='true']") ||
      q("canvas[data-hearth-visible-canvas='true']") ||
      q("canvas[data-hearth-canvas-hub='true']") ||
      q("canvas[data-hearth-canvas='true']") ||
      q("canvas[data-hearth-planet-canvas='true']");

    let canvasRectNonzero = false;
    let contextReady = false;
    let pixelVisible = false;
    let pixelStatus = readPixels ? "PIXEL_SAMPLE_NOT_READ" : "NOT_SAMPLED_UI_SAFE";

    try {
      if (canvas && canvas.getBoundingClientRect) {
        const rect = canvas.getBoundingClientRect();
        canvasRectNonzero = rect.width > 0 && rect.height > 0;
      }
    } catch (_error) {}

    try {
      if (canvas && isFunction(canvas.getContext)) {
        const ctx = canvas.getContext("2d", { willReadFrequently: readPixels });
        contextReady = Boolean(ctx);

        if (readPixels && ctx && canvas.width > 0 && canvas.height > 0) {
          const data = ctx.getImageData(
            Math.max(0, Math.floor(canvas.width / 2)),
            Math.max(0, Math.floor(canvas.height / 2)),
            1,
            1
          ).data;

          pixelVisible = Boolean(data && (data[0] || data[1] || data[2] || data[3]));
          pixelStatus = pixelVisible ? "PIXEL_SAMPLE_NONEMPTY" : "PIXEL_SAMPLE_BLANK";
        }
      }
    } catch (error) {
      pixelStatus = `PIXEL_SAMPLE_ERROR:${bounded(error && error.message ? error.message : error, 300)}`;
    }

    state.canvasMountFound = Boolean(mount);
    state.canvasElementFound = Boolean(canvas);
    state.canvasInMount = Boolean(mount && canvas && mount.contains && mount.contains(canvas));
    state.canvasRectNonzero = canvasRectNonzero;
    state.canvasContext2dReady = contextReady;
    state.canvasPixelVisible = pixelVisible;
    state.canvasPixelSampleStatus = pixelStatus;
    state.canvasSelector = canvas
      ? (canvas.id ? `#${canvas.id}` : "canvas")
      : "UNKNOWN";
    state.canvasMountSelector = mount
      ? (mount.id ? `#${mount.id}` : "data-or-stage-mount")
      : "UNKNOWN";

    state.visibleSurfacePermissionGranted = Boolean(
      state.canvasMountFound &&
      state.canvasElementFound &&
      state.canvasRectNonzero &&
      state.canvasContext2dReady
    );

    return {
      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasSelector: state.canvasSelector,
      canvasMountSelector: state.canvasMountSelector
    };
  }

  function composeControlHandshakePacket() {
    const packet = {
      packetType: CONTROL_HANDSHAKE_PACKET,
      type: CONTROL_HANDSHAKE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceRole: "route-conductor-passive-ui-safe-manual-scan-authority",

      targetFile: CONTROL_FILE,
      destinationFile: CONTROL_FILE,
      controlsFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      passivePacketOnly: true,
      normalUiContactDoesNotDeliverPacket: true,
      explicitManualScanRequiredForDelivery: true,

      controlHandshakePermissionRequested: true,
      controlHandshakePermissionGranted: false,
      controlsRemainMotionInputGatewayAuthority: true,
      canvasPublicReceiverRequired: true,
      hexGateRequiredBeforePointerFinger: true,

      lifecycleIgnitionSuppressed: true,
      pointerFingerDirectDeliveryPermissionGranted: false,
      pointerFingerDirectLoadSuppressed: true,
      sourceStackDirectLoadSuppressed: true,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastControlHandshakePacket = clonePlain(packet);
    return packet;
  }

  function composeHexScanPacket() {
    const packet = {
      packetType: HEX_SCAN_PACKET,
      type: HEX_SCAN_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceRole: "route-conductor-passive-ui-safe-manual-scan-authority",

      targetFile: HEX_SURFACE_FILE,
      destinationFile: HEX_SURFACE_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      canvasFile: CANVAS_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      intendedMode: "PASSIVE_SCAN_PACKET_ONLY",
      expectedReturnPort: false,
      routeHexScanPermissionRequested: true,
      routeHexScanPermissionGranted: false,

      safePacketBridgeActive: true,
      lifecycleIgnitionSuppressed: true,
      hexSurfaceRemainsDownstreamGateAuthority: true,
      routeDoesNotOwnHexTruth: true,
      routeDoesNotDeliverDirectlyToPointerFinger: true,
      pointerFingerDirectDeliveryPermissionGranted: false,
      pointerFingerDirectLoadSuppressed: true,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastHexScanPacket = clonePlain(packet);
    return packet;
  }

  function composeGovernedSourcePacket() {
    return {
      packetType: GOVERNED_SOURCE_PACKET,
      type: GOVERNED_SOURCE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      route: ROUTE,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",

      passivePacketOnly: true,
      sourceStackDirectLoadSuppressed: true,
      sourceStackObserved: state.sourceStackObserved,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      sourceStack: clonePlain(state.sourceStack).slice(0, 12),
      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composePresentationPacket() {
    const packet = {
      packetType: PRESENTATION_PACKET,
      type: PRESENTATION_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      routeConductorContract: CONTRACT,
      routeConductorReceipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,

      route: ROUTE,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceRole: "route-conductor-passive-ui-safe-manual-scan-authority",
      destinationFile: CANVAS_FILE,
      targetFile: CANVAS_FILE,
      handoffTo: "CANVAS_PRESENTATION_PLATTER",

      canvasFile: CANVAS_FILE,
      controlsFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,

      passivePacketOnly: true,
      normalUiContactDoesNotDeliverPacket: true,
      explicitManualScanRequiredForDelivery: true,

      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      canvasAcceptanceScanRequested: false,
      bilateralRouteCanvasScanActive: true,
      bilateralRouteCanvasScanConfirmed: false,
      safePacketBridgeActive: true,
      lifecycleIgnitionSuppressed: true,
      canvasLifecycleMethodsSuppressed: true,

      controlsRemainMotionInputGatewayAuthority: true,
      canvasRemainsPresentationPlatterAuthority: true,
      canvasOwnsDomSurface: true,
      canvasOwnsCanvasDrawing: true,
      canvasDoesNotOwnSourceTruth: true,
      routeDoesNotOwnCanvasDrawing: true,
      routeDoesNotOwnTerrainTruth: true,
      routeDoesNotOwnHydrologyTruth: true,
      routeDoesNotOwnMaterialTruth: true,
      routeDoesNotOwnHexTruth: true,
      routeDoesNotOwnPointerFingerTruth: true,

      routeToControlsHandshakePermissionGranted: state.routeControlsHandshakePermissionGranted,
      controlsGatewayPermissionGranted: state.controlsGatewayPermissionGranted,
      routeHexScanPermissionGranted: state.routeHexScanPermissionGranted,
      hexSurfaceScanPermissionGranted: state.hexSurfaceScanPermissionGranted,
      routeCanvasPresentationPermissionGranted: state.routeCanvasPresentationPermissionGranted,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      constructPermissionGranted: state.constructPermissionGranted,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      motionPermissionGranted: state.motionPermissionGranted,

      oneConfirmedHandshakeDoesNotGrantWholeChain: true,
      singleHandshakeGreenLightBlocked: true,
      intendedHandoffVarianceIncluded: true,

      governedSourcePacket: composeGovernedSourcePacket(),
      controlHandshakePacket: clonePlain(state.lastControlHandshakePacket),
      hexScanPacket: clonePlain(state.lastHexScanPacket),

      presentationSurfaceRequest: {
        mountSelector: "#hearthCanvasMount",
        canvasSelectors: [
          "#hearthCanvasMount canvas",
          "canvas[data-hearth-expression-surface='true']",
          "canvas[data-hearth-visible-canvas='true']",
          "canvas[data-hearth-canvas='true']",
          "canvas[data-hearth-planet-canvas='true']"
        ],
        canvasAcceptanceScanRequested: false,
        routeActiveScanConfirmed: state.routeActiveScanConfirmed,
        bilateralReturnPortExpected: true,
        lifecycleIgnitionPermissionGranted: false
      },

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.packetCount += 1;
    state.lastPresentationPacket = clonePlain(packet);
    return packet;
  }

  function publishPacketAliases(packet, lane) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    if (lane === "control") {
      root.HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_PACKET = cloned;
      root.HEARTH_ROUTE_CONDUCTOR_QUEEN_CONTROL_HANDSHAKE_PACKET = cloned;
      root.HEARTH_ROUTE_CONDUCTOR_HEX_GATE_CONTROL_HANDSHAKE_PACKET = cloned;
      hearth.routeConductorControlHandshakePacket = cloned;
      hearth.routeConductorQueenControlHandshakePacket = cloned;
      hearth.routeConductorHexGateControlHandshakePacket = cloned;
      lab.hearthRouteConductorControlHandshakePacket = cloned;
      return;
    }

    if (lane === "hex") {
      root.HEARTH_ROUTE_CONDUCTOR_HEX_SURFACE_SCAN_PACKET = cloned;
      root.HEARTH_ROUTE_CONDUCTOR_HEX_GATE_TRANSMISSION_PACKET = cloned;
      hearth.routeConductorHexSurfaceScanPacket = cloned;
      hearth.routeConductorHexGateTransmissionPacket = cloned;
      lab.hearthRouteConductorHexSurfaceScanPacket = cloned;
      return;
    }

    root.HEARTH_ROUTE_CONDUCTOR_PRESENTATION_PLATTER_PACKET = cloned;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_PACKET = cloned;
    root.HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_PACKET = cloned;
    root.HEARTH_CANVAS_PRESENTATION_PLATTER_PACKET = cloned;

    hearth.routeConductorPresentationPlatterPacket = cloned;
    hearth.routeConductorCanvasHandoffPacket = cloned;
    hearth.routeConductorGovernedSourcePacket = cloned;
    hearth.canvasPresentationPlatterPacket = cloned;

    lab.hearthRouteConductorPresentationPlatterPacket = cloned;
    lab.hearthRouteConductorCanvasHandoffPacket = cloned;
  }

  function publishPassivePackets() {
    publishPacketAliases(composeControlHandshakePacket(), "control");
    publishPacketAliases(composeHexScanPacket(), "hex");
    publishPacketAliases(composePresentationPacket(), "canvas");

    state.controlHandshakeDeliveryStatus = "PASSIVE_PACKET_PUBLISHED_ONLY";
    state.controlHandshakeMethod = "NONE_UI_SAFE";
    state.hexScanDeliveryStatus = "PASSIVE_PACKET_PUBLISHED_ONLY";
    state.hexScanDeliveryMethod = "NONE_UI_SAFE";
    state.canvasDeliveryStatus = "PASSIVE_PACKET_PUBLISHED_ONLY";
    state.canvasDeliveryMethod = "NONE_UI_SAFE";
    state.canvasDeliveryReason = "NORMAL_UI_CONTACT_DOES_NOT_CALL_CANVAS_RECEIVERS";
  }

  function relationship(id, fromNode, toNode, options = {}) {
    const from = state.nodes[fromNode] || {};
    const to = state.nodes[toNode] || {};

    const endpointPermissionGranted = Boolean(from.observed && to.observed);
    const requestObserved = options.requestObserved === true;
    const grantObserved = options.grantObserved === true;
    const returnObserved = options.returnObserved === true;
    const expectedReturnPort = options.expectedReturnPort === true;

    const relationshipPermissionGranted = Boolean(
      endpointPermissionGranted &&
      requestObserved &&
      grantObserved &&
      (expectedReturnPort ? returnObserved : true)
    );

    return {
      id,
      from: fromNode,
      to: toNode,
      fromFile: from.file || "UNKNOWN",
      toFile: to.file || "UNKNOWN",
      intendedMode: options.intendedMode || "HANDSHAKE",
      expectedReturnPort,
      requiredForMotion: options.requiredForMotion === true,
      requiredForVisibleSurface: options.requiredForVisibleSurface === true,

      fromObserved: Boolean(from.observed),
      toObserved: Boolean(to.observed),
      fromContract: from.contract || "UNKNOWN",
      toContract: to.contract || "UNKNOWN",
      fromContractRecognized: Boolean(from.contractRecognized),
      toContractRecognized: Boolean(to.contractRecognized),

      requestObserved,
      grantObserved,
      returnObserved,

      endpointPermissionGranted,
      requestPermissionGranted: endpointPermissionGranted && requestObserved,
      receiverPermissionGranted: endpointPermissionGranted && grantObserved,
      returnPortPermissionGranted: expectedReturnPort
        ? endpointPermissionGranted && requestObserved && grantObserved && returnObserved
        : endpointPermissionGranted,

      relationshipPermissionGranted,
      relationshipStatus: relationshipPermissionGranted
        ? expectedReturnPort
          ? "HANDSHAKE_PERMISSION_CONFIRMED_WITH_RETURN_PORT"
          : "INTENDED_PACKET_HANDOFF_PERMISSION_CONFIRMED"
        : endpointPermissionGranted
          ? "ENDPOINTS_OBSERVED_PERMISSION_NOT_CONFIRMED_PASSIVE_ONLY"
          : "RELATIONSHIP_ENDPOINT_UNOBSERVED_OR_PENDING",
      varianceClass: relationshipPermissionGranted
        ? expectedReturnPort
          ? "HANDSHAKE_COMPLETE"
          : "INTENDED_ONE_WAY_PACKET_HANDOFF_CONFIRMED"
        : endpointPermissionGranted
          ? "PASSIVE_OBSERVATION_NO_GRANT_CONFIRMED"
          : "ENDPOINT_PENDING",

      fromAlias: from.selectedAliasPath || "NONE",
      toAlias: to.selectedAliasPath || "NONE",
      lifecycleIgnitionSuppressed: true,
      ...NO_CLAIMS
    };
  }

  function resolveRelationships() {
    const routeObserved = Boolean(state.nodes.ROUTE_CONDUCTOR && state.nodes.ROUTE_CONDUCTOR.observed);
    const controlsObserved = Boolean(state.nodes.CONTROLS_QUEEN && state.nodes.CONTROLS_QUEEN.observed);
    const canvasObserved = Boolean(state.nodes.CANVAS_PLATTER && state.nodes.CANVAS_PLATTER.observed);
    const hexObserved = Boolean(state.nodes.HEX_SURFACE_GATE && state.nodes.HEX_SURFACE_GATE.observed);
    const pointerObserved = Boolean(state.nodes.POINTER_FINGER && state.nodes.POINTER_FINGER.observed);

    const rels = [
      relationship("ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE", "ROUTE_CONDUCTOR", "CONTROLS_QUEEN", {
        intendedMode: "PASSIVE_PACKET_HANDSHAKE",
        expectedReturnPort: true,
        requiredForMotion: true,
        requestObserved: Boolean(routeObserved && state.lastControlHandshakePacket),
        grantObserved: false,
        returnObserved: false
      }),
      relationship("ROUTE_TO_HEX_SURFACE_ACTIVE_SCAN_PERMISSION", "ROUTE_CONDUCTOR", "HEX_SURFACE_GATE", {
        intendedMode: "PASSIVE_PACKET_SCAN",
        expectedReturnPort: false,
        requiredForMotion: true,
        requiredForVisibleSurface: true,
        requestObserved: Boolean(routeObserved && state.lastHexScanPacket),
        grantObserved: hexObserved,
        returnObserved: false
      }),
      relationship("CONTROLS_TO_HEX_SURFACE_GATEWAY_SCAN", "CONTROLS_QUEEN", "HEX_SURFACE_GATE", {
        intendedMode: "PASSIVE_GATEWAY_OBSERVATION",
        expectedReturnPort: false,
        requiredForMotion: true,
        requestObserved: controlsObserved,
        grantObserved: hexObserved,
        returnObserved: false
      }),
      relationship("ROUTE_TO_CANVAS_PRESENTATION_PLATTER_PACKET", "ROUTE_CONDUCTOR", "CANVAS_PLATTER", {
        intendedMode: "PASSIVE_EXPLICIT_PACKET_HANDOFF",
        expectedReturnPort: true,
        requiredForVisibleSurface: true,
        requestObserved: Boolean(routeObserved && state.lastPresentationPacket),
        grantObserved: false,
        returnObserved: false
      }),
      relationship("HEX_SURFACE_TO_POINTER_FINGER_INTENDED_HANDOFF", "HEX_SURFACE_GATE", "POINTER_FINGER", {
        intendedMode: "DOWNSTREAM_HANDOFF_OBSERVED_ONLY",
        expectedReturnPort: false,
        requestObserved: hexObserved,
        grantObserved: pointerObserved,
        returnObserved: false
      })
    ];

    state.relationships = rels;

    const byId = Object.fromEntries(rels.map((rel) => [rel.id, rel]));

    state.routeControlsHandshakePermissionGranted =
      byId.ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE.relationshipPermissionGranted;
    state.controlsGatewayPermissionGranted =
      state.routeControlsHandshakePermissionGranted;
    state.routeHexScanPermissionGranted =
      byId.ROUTE_TO_HEX_SURFACE_ACTIVE_SCAN_PERMISSION.relationshipPermissionGranted;
    state.hexSurfaceScanPermissionGranted =
      byId.ROUTE_TO_HEX_SURFACE_ACTIVE_SCAN_PERMISSION.relationshipPermissionGranted &&
      byId.CONTROLS_TO_HEX_SURFACE_GATEWAY_SCAN.relationshipPermissionGranted;
    state.routeCanvasPresentationPermissionGranted =
      byId.ROUTE_TO_CANVAS_PRESENTATION_PLATTER_PACKET.relationshipPermissionGranted;

    state.motionPermissionGranted = Boolean(
      state.routeControlsHandshakePermissionGranted &&
      state.hexSurfaceScanPermissionGranted
    );

    state.constructPermissionGranted = Boolean(
      state.routeControlsHandshakePermissionGranted &&
      state.routeHexScanPermissionGranted &&
      state.hexSurfaceScanPermissionGranted &&
      state.routeCanvasPresentationPermissionGranted
    );

    state.bilateralRouteCanvasScanConfirmed = false;

    return clonePlain(rels);
  }

  function resolveDisposition() {
    if (!state.nodes.ROUTE_CONDUCTOR || !state.nodes.ROUTE_CONDUCTOR.observed) {
      state.firstFailedCoordinate = "ROUTE_CONDUCTOR_AUTHORITY_NOT_OBSERVED";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_ROUTE_CONDUCTOR_PUBLIC_AUTHORITY_PUBLICATION";
      state.postgameStatus = "ROUTE_CONDUCTOR_PASSIVE_HOLD_ROUTE_AUTHORITY_PENDING";
      return;
    }

    if (!state.nodes.CANVAS_PLATTER || !state.nodes.CANVAS_PLATTER.observed) {
      state.firstFailedCoordinate = "CANVAS_PLATTER_AUTHORITY_NOT_OBSERVED_PASSIVE_ONLY";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "VERIFY_TARGET_ROUTE_LOADS_ASSET_CANVAS_FILE_AND_PUBLISHES_CANVAS_AUTHORITY";
      state.postgameStatus = "ROUTE_CONDUCTOR_PASSIVE_HOLD_CANVAS_AUTHORITY_PENDING";
      return;
    }

    if (!state.canvasElementFound) {
      state.firstFailedCoordinate = "CANVAS_DOM_SURFACE_NOT_FOUND_PASSIVE_SCAN";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "RENEW_CANVAS_DOM_SURFACE_BINDING_WITHOUT_ROUTE_LIFECYCLE_CALLS";
      state.postgameStatus = "ROUTE_CONDUCTOR_PASSIVE_HOLD_CANVAS_DOM_SURFACE_PENDING";
      return;
    }

    if (!state.visibleSurfacePermissionGranted) {
      state.firstFailedCoordinate = "CANVAS_SURFACE_PRESENT_BUT_NOT_READY_PASSIVE_SCAN";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "RENEW_CANVAS_SURFACE_RECT_CONTEXT_OR_DRAW_PATH_WITHOUT_ROUTE_LIFECYCLE_CALLS";
      state.postgameStatus = "ROUTE_CONDUCTOR_PASSIVE_HOLD_CANVAS_SURFACE_READY_PENDING";
      return;
    }

    state.firstFailedCoordinate = "NONE_PASSIVE_SURFACE_READY_NO_FINAL_CLAIM";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "REVIEW_WITH_CANVAS_SURFACE_PRESENT_NO_FINAL_VISUAL_PASS_CLAIM";
    state.postgameStatus = "ROUTE_CONDUCTOR_PASSIVE_SURFACE_READY_NO_FINAL_CLAIM";
  }

  function passiveSnapshot(reason = "PASSIVE_OBSERVE") {
    state.passiveReadCount += 1;
    state.latestPassiveReason = bounded(reason, 160);
    state.updatedAt = nowIso();

    scanSourceStack();
    scanNode(NODES.ROUTE);
    scanNode(NODES.INDEX);
    scanNode(NODES.CONTROLS);
    scanNode(NODES.HEX_AUTHORITY);
    scanNode(NODES.HEX_SURFACE);
    scanNode(NODES.CANVAS);
    scanNode(NODES.POINTER_FINGER);

    state.routeActiveScanConfirmed = Boolean(
      state.nodes.ROUTE_CONDUCTOR &&
      state.nodes.ROUTE_CONDUCTOR.observed &&
      state.nodes.CONTROLS_QUEEN &&
      state.nodes.CONTROLS_QUEEN.observed &&
      state.nodes.HEX_SURFACE_GATE &&
      state.nodes.HEX_SURFACE_GATE.observed
    );

    scanCanvasSurface({ readPixels: false });
    publishPassivePackets();
    resolveRelationships();
    resolveDisposition();
    updateDataset();
    publishReceiptAliases(false);

    return getReceiptLight();
  }

  function explicitScanAllowed(options = {}) {
    return Boolean(
      options.explicitDiagnosticScan === true ||
      options.manualScanAuthorized === true ||
      options.explicitManualScan === true ||
      options.source === "DIAGNOSTIC_NORTH" ||
      options.source === "HEARTH_DIAGNOSTIC_NORTH" ||
      options.source === "DIAGNOSTIC_RAIL" ||
      options.source === "HEARTH_DIAGNOSTIC_RAIL"
    );
  }

  async function runSafePacketBridgeScan(options = {}) {
    if (!explicitScanAllowed(options)) {
      state.blockedHeavyScanCount += 1;
      state.latestEvent = "ROUTE_CONDUCTOR_HEAVY_SCAN_BLOCKED_UI_SAFE";
      state.firstFailedCoordinate = "EXPLICIT_MANUAL_SCAN_PERMISSION_NOT_PROVIDED";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction =
        "CALL_runSafePacketBridgeScan_WITH_explicitDiagnosticScan_TRUE_FROM_DIAGNOSTIC_CONTEXT";
      state.postgameStatus = "ROUTE_CONDUCTOR_HELD_UI_SAFE_PASSIVE_ONLY";
      record("ROUTE_CONDUCTOR_HEAVY_SCAN_BLOCKED_UI_SAFE", {
        reason: "normal-ui-contact",
        suppliedOptionKeys: Object.keys(options || {}).slice(0, 20)
      });
      return passiveSnapshot("HEAVY_SCAN_BLOCKED_UI_SAFE");
    }

    state.explicitScanCount += 1;
    state.updatedAt = nowIso();
    state.latestEvent = "ROUTE_CONDUCTOR_EXPLICIT_DIAGNOSTIC_SCAN_STARTED";

    scanSourceStack();
    scanNode(NODES.ROUTE);
    scanNode(NODES.INDEX);
    scanNode(NODES.CONTROLS);
    scanNode(NODES.HEX_AUTHORITY);
    scanNode(NODES.HEX_SURFACE);
    scanNode(NODES.CANVAS);
    scanNode(NODES.POINTER_FINGER);

    state.routeActiveScanConfirmed = Boolean(
      state.nodes.ROUTE_CONDUCTOR &&
      state.nodes.ROUTE_CONDUCTOR.observed &&
      state.nodes.CONTROLS_QUEEN &&
      state.nodes.CONTROLS_QUEEN.observed &&
      state.nodes.HEX_SURFACE_GATE &&
      state.nodes.HEX_SURFACE_GATE.observed
    );

    scanCanvasSurface({
      explicitDiagnosticScan: true,
      readPixels: options.readPixels === true
    });

    publishPassivePackets();
    resolveRelationships();
    resolveDisposition();
    updateDataset();
    publishReceiptAliases(false);

    record("ROUTE_CONDUCTOR_EXPLICIT_DIAGNOSTIC_SCAN_COMPLETE", {
      readPixels: options.readPixels === true,
      deliverPackets: false,
      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    });

    return getReceipt();
  }

  function runBilateralScan(options = {}) {
    return runSafePacketBridgeScan(options);
  }

  function loadMissingDirectChain(options = {}) {
    state.blockedHeavyScanCount += 1;
    state.latestEvent = "ROUTE_CONDUCTOR_DIRECT_CHAIN_LOAD_BLOCKED";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction =
      "DIRECT_CHAIN_AUTO_LOAD_RETIRED_USE_PAGE_LOAD_ORDER_OR_DIAGNOSTIC_FILE_AUDIT";
    state.postgameStatus = "ROUTE_CONDUCTOR_DIRECT_CHAIN_LOAD_SUPPRESSED";
    record("ROUTE_CONDUCTOR_DIRECT_CHAIN_LOAD_BLOCKED", {
      options: Object.keys(options || {}).slice(0, 20),
      pointerFingerDirectLoadSuppressed: true,
      governedSourceStackDirectLoadSuppressed: true
    });
    updateDataset();
    publishReceiptAliases(false);
    return getReceiptLight();
  }

  function readIndexSummary() {
    return clonePlain(state.nodes.INDEX_PRIEST || state.nodes.INDEX || {});
  }

  function readControlSummary() {
    return clonePlain(state.nodes.CONTROLS_QUEEN || {});
  }

  function readCanvasSummary() {
    return clonePlain(state.nodes.CANVAS_PLATTER || {});
  }

  function readHexAuthoritySummary() {
    return clonePlain(state.nodes.HEX_AUTHORITY || {});
  }

  function readHexSurfaceSummary() {
    return clonePlain(state.nodes.HEX_SURFACE_GATE || {});
  }

  function readPointerFingerSummary() {
    return clonePlain(state.nodes.POINTER_FINGER || {});
  }

  function readSourceStackSummary() {
    return clonePlain(state.sourceStack);
  }

  function readSourceSummary() {
    return readSourceStackSummary();
  }

  function getTransmissionPath() {
    return [
      INDEX_FILE,
      FILE,
      "GOVERNED_SOURCE_STACK_OBSERVED_ONLY",
      CONTROL_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      CANVAS_FILE,
      `${HEX_SURFACE_FILE} -> ${POINTER_FINGER_FILE}`
    ];
  }

  function composeSourceHoldPacket() {
    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_SOURCE_HOLD_PACKET_v10_7",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      route: ROUTE,
      file: FILE,
      sourceStackDirectLoadSuppressed: true,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      sourceStack: clonePlain(state.sourceStack).slice(0, 12),
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      ...NO_CLAIMS
    };
  }

  function getSourceHoldPacket() {
    return composeSourceHoldPacket();
  }

  function getSourceStack() {
    return clonePlain(state.sourceStack);
  }

  function getSourceStackPacket() {
    return composeGovernedSourcePacket();
  }

  function getGovernedSourcePacket() {
    return composeGovernedSourcePacket();
  }

  function getCanvasHandoffPacket() {
    return clonePlain(state.lastPresentationPacket || composePresentationPacket());
  }

  function getHandoffPacket() {
    return getCanvasHandoffPacket();
  }

  function getCanvasReleasePacket() {
    return getCanvasHandoffPacket();
  }

  function getReleasePacket() {
    return getCanvasHandoffPacket();
  }

  function getControlHandshakePacket() {
    return clonePlain(state.lastControlHandshakePacket || composeControlHandshakePacket());
  }

  function getControlsHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getPlanetaryControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getQueenControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getRouteConductorControlHandshakePacket() {
    return getControlHandshakePacket();
  }

  function getHexGateTransmissionPacket() {
    return clonePlain(state.lastHexScanPacket || composeHexScanPacket());
  }

  function getHexTransmissionPacket() {
    return getHexGateTransmissionPacket();
  }

  function getRouteConductorHexGateTransmissionPacket() {
    return getHexGateTransmissionPacket();
  }

  function getPointerFingerTransmissionPacket() {
    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_POINTER_FINGER_OBSERVATION_PACKET_v10_7",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      sourceFile: FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      pointerFingerObserved: Boolean(state.nodes.POINTER_FINGER && state.nodes.POINTER_FINGER.observed),
      pointerFingerDirectDeliveryPermissionGranted: false,
      pointerFingerDirectLoadSuppressed: true,
      intendedPath: `${HEX_SURFACE_FILE} -> ${POINTER_FINGER_FILE}`,
      ...NO_CLAIMS
    };
  }

  function getRouteConductorPointerFingerTransmissionPacket() {
    return getPointerFingerTransmissionPacket();
  }

  function composeCompatibilityReceiptV94() {
    return {
      contract: COMPAT_V9_4_CONTRACT,
      receipt: "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_RECEIPT_v9_4",
      compatibilityBridgePreserved: true,
      currentContract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      route: ROUTE,
      file: FILE,
      canvasFile: CANVAS_FILE,
      lifecycleIgnitionSuppressed: true,
      normalUiContactIsPassiveOnly: true,
      ...NO_CLAIMS
    };
  }

  function compactNodeMap() {
    const out = {};
    for (const key of Object.keys(state.nodes || {})) {
      const node = state.nodes[key] || {};
      out[key] = {
        id: node.id,
        file: node.file,
        observed: node.observed === true,
        scriptPresent: node.scriptPresent === true,
        scriptCount: node.scriptCount || 0,
        contract: node.contract || "UNKNOWN",
        receipt: node.receipt || "UNKNOWN",
        contractRecognized: node.contractRecognized === true,
        publicMethodCount: node.publicMethodCount || 0,
        lifecycleMethodsObserved: clonePlain(node.lifecycleMethodsObserved || [])
      };
    }
    return out;
  }

  function compactRelationships() {
    return (state.relationships || []).map((rel) => ({
      id: rel.id,
      from: rel.from,
      to: rel.to,
      intendedMode: rel.intendedMode,
      requiredForMotion: rel.requiredForMotion,
      requiredForVisibleSurface: rel.requiredForVisibleSurface,
      fromObserved: rel.fromObserved,
      toObserved: rel.toObserved,
      requestObserved: rel.requestObserved,
      grantObserved: rel.grantObserved,
      returnObserved: rel.returnObserved,
      relationshipPermissionGranted: rel.relationshipPermissionGranted,
      relationshipStatus: rel.relationshipStatus,
      varianceClass: rel.varianceClass
    }));
  }

  function composeReceipt(options = {}) {
    const includeDebug = options.includeDebug === true;

    const receipt = {
      packetType: "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_RECEIPT_PACKET_v10_7",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: RENEWAL_CONTRACT,
      renewalReceipt: RENEWAL_RECEIPT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
      lineageV104Contract: LINEAGE_V10_4_CONTRACT,
      lineageV103Contract: LINEAGE_V10_3_CONTRACT,
      lineageV102Contract: LINEAGE_V10_2_CONTRACT,
      lineageV101Contract: LINEAGE_V10_1_CONTRACT,
      lineageV99Contract: LINEAGE_V9_9_CONTRACT,
      lineageV98Contract: LINEAGE_V9_8_CONTRACT,
      lineageV97Contract: LINEAGE_V9_7_CONTRACT,
      lineageV96Contract: LINEAGE_V9_6_CONTRACT,
      lineageV95Contract: LINEAGE_V9_5_CONTRACT,
      compatibilityRouteConductorContract: COMPAT_V9_4_CONTRACT,
      version: VERSION,

      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_FINGER_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedPointerFingerContract: EXPECTED_POINTER_FINGER_CONTRACT,

      activeNewsCycle: "ROUTE_CONTROLS_HEX_SURFACE_TO_CANVAS_PLATTER_PASSIVE_UI_SAFE_MANUAL_SCAN",
      activeFibonacci: "F13_HELD_F21_NORTH_ONLY",

      passiveUiSafeManualScanActive: true,
      normalUiContactIsPassiveOnly: true,
      buttonContactHeavyScanSuppressed: true,
      automaticBootScanSuppressed: true,
      automaticMissingChainLoadSuppressed: true,
      deepReceiptSerializationSuppressed: true,
      canvasPixelReadSuppressedForUi: true,

      safePacketBridgeActive: true,
      lifecycleIgnitionSuppressed: true,
      canvasLifecycleMethodsSuppressed: true,
      pointerFingerDirectLoadSuppressed: true,
      governedSourceStackDirectLoadSuppressed: true,
      duplicateScriptAppendSuppressed: true,
      filePathLoadLocksActive: true,
      reasonBasedLoadLocksRetired: true,

      routeConductorActiveScanAuthority: true,
      bilateralRouteCanvasScanActive: true,
      triangleScanActive: true,
      triangleMembers: ["ROUTE_CONDUCTOR", "CONTROLS_QUEEN", "HEX_SURFACE_GATE"],
      triangleFunnelsToCanvasPlatterByRoute: true,

      controlsRemainMotionInputGatewayAuthority: true,
      canvasRemainsPresentationPlatterAuthority: true,
      hexSurfaceRemainsDownstreamGateAuthority: true,
      pointerFingerRemainsDownstreamExpressionAuthority: true,
      pointerFingerDirectDeliveryPermissionGranted: false,

      oneConfirmedHandshakeDoesNotGrantWholeChain: true,
      singleHandshakeGreenLightBlocked: true,
      intendedHandoffVarianceIncluded: true,

      transmissionPath: getTransmissionPath(),

      routeActiveScanConfirmed: state.routeActiveScanConfirmed,
      controlsGatewayPermissionGranted: state.controlsGatewayPermissionGranted,
      routeControlsHandshakePermissionGranted: state.routeControlsHandshakePermissionGranted,
      routeHexScanPermissionGranted: state.routeHexScanPermissionGranted,
      hexSurfaceScanPermissionGranted: state.hexSurfaceScanPermissionGranted,
      routeCanvasPresentationPermissionGranted: state.routeCanvasPresentationPermissionGranted,
      canvasAcceptanceScanRequested: state.canvasAcceptanceScanRequested,
      canvasAcceptanceScanConfirmed: state.canvasAcceptanceScanConfirmed,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      sourceStackObserved: state.sourceStackObserved,
      sourceStackPermissionGranted: state.sourceStackPermissionGranted,
      constructPermissionGranted: state.constructPermissionGranted,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      motionPermissionGranted: state.motionPermissionGranted,

      controlHandshakeDeliveryStatus: state.controlHandshakeDeliveryStatus,
      controlHandshakeMethod: state.controlHandshakeMethod,
      canvasDeliveryStatus: state.canvasDeliveryStatus,
      canvasDeliveryMethod: state.canvasDeliveryMethod,
      canvasDeliveryReason: state.canvasDeliveryReason,
      hexScanDeliveryStatus: state.hexScanDeliveryStatus,
      hexScanDeliveryMethod: state.hexScanDeliveryMethod,

      canvasMountFound: state.canvasMountFound,
      canvasElementFound: state.canvasElementFound,
      canvasInMount: state.canvasInMount,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasSelector: state.canvasSelector,
      canvasMountSelector: state.canvasMountSelector,

      nodes: compactNodeMap(),
      delegatoryNodes: compactNodeMap(),
      relationships: compactRelationships(),
      delegatoryRelationships: compactRelationships(),
      sourceStack: clonePlain(state.sourceStack).slice(0, 12),

      packetCount: state.packetCount,
      passiveReadCount: state.passiveReadCount,
      explicitScanCount: state.explicitScanCount,
      blockedHeavyScanCount: state.blockedHeavyScanCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      lifecycleSuppressionCount: state.lifecycleSuppressionCount,
      booted: state.booted,
      disposed: state.disposed,
      latestEvent: state.latestEvent,
      latestPassiveReason: state.latestPassiveReason,
      errorCount: state.errors.length,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsRoutePermissionCoordination: true,
      ownsActiveScan: true,
      ownsControlHandshakePacketComposition: true,
      ownsHexSurfaceScanPacketComposition: true,
      ownsCanvasPresentationPacketComposition: true,
      ownsCanvasDrawing: false,
      ownsCanvasDomSurface: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexTruth: false,
      ownsPointerFingerTruth: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };

    if (includeDebug) {
      receipt.debug = {
        events: clonePlain(state.events),
        errors: clonePlain(state.errors),
        lastPresentationPacket: clonePlain(state.lastPresentationPacket),
        lastControlHandshakePacket: clonePlain(state.lastControlHandshakePacket),
        lastHexScanPacket: clonePlain(state.lastHexScanPacket)
      };
    }

    return receipt;
  }

  function getReceiptLight() {
    const receipt = composeReceipt({ includeDebug: false });
    state.lastReceiptLight = clonePlain(receipt);
    return receipt;
  }

  function getReceipt(options = {}) {
    if (options && options.includeDebug === true) {
      return composeReceipt({ includeDebug: true });
    }

    return getReceiptLight();
  }

  function getDebugReceipt() {
    return composeReceipt({ includeDebug: true });
  }

  function getRouteCycleReceipt() {
    return getReceiptLight();
  }

  function getRoutePrimaryGateReceipt() {
    return getReceiptLight();
  }

  function composeReceiptText(receipt = getReceiptLight()) {
    const r = isObject(receipt) ? receipt : getReceiptLight();

    return [
      "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("renewalContract", RENEWAL_CONTRACT),
      line("renewalReceipt", RENEWAL_RECEIPT),
      line("previousRenewalContract", PREVIOUS_RENEWAL_CONTRACT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "UI_SAFE",
      line("passiveUiSafeManualScanActive", true),
      line("normalUiContactIsPassiveOnly", true),
      line("buttonContactHeavyScanSuppressed", true),
      line("automaticBootScanSuppressed", true),
      line("automaticMissingChainLoadSuppressed", true),
      line("deepReceiptSerializationSuppressed", true),
      line("canvasPixelReadSuppressedForUi", true),
      "",
      "SAFE_BRIDGE",
      line("safePacketBridgeActive", true),
      line("lifecycleIgnitionSuppressed", true),
      line("canvasLifecycleMethodsSuppressed", true),
      line("pointerFingerDirectLoadSuppressed", true),
      line("governedSourceStackDirectLoadSuppressed", true),
      line("duplicateScriptAppendSuppressed", true),
      "",
      "SCAN_STATE",
      line("routeActiveScanConfirmed", r.routeActiveScanConfirmed),
      line("controlsGatewayPermissionGranted", r.controlsGatewayPermissionGranted),
      line("hexSurfaceScanPermissionGranted", r.hexSurfaceScanPermissionGranted),
      line("routeCanvasPresentationPermissionGranted", r.routeCanvasPresentationPermissionGranted),
      line("constructPermissionGranted", r.constructPermissionGranted),
      line("motionPermissionGranted", r.motionPermissionGranted),
      "",
      "CANVAS_SURFACE",
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      line("canvasMountFound", r.canvasMountFound),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasInMount", r.canvasInMount),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("canvasDeliveryMethod", r.canvasDeliveryMethod),
      line("canvasDeliveryReason", r.canvasDeliveryReason),
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
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight());
  }

  function getStatusText() {
    const r = getReceiptLight();

    return [
      "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_STATUS",
      line("contract", r.contract),
      line("renewalContract", r.renewalContract),
      line("passiveUiSafeManualScanActive", true),
      line("normalUiContactIsPassiveOnly", true),
      line("buttonContactHeavyScanSuppressed", true),
      line("lifecycleIgnitionSuppressed", true),
      line("routeActiveScanConfirmed", r.routeActiveScanConfirmed),
      line("controlsGatewayPermissionGranted", r.controlsGatewayPermissionGranted),
      line("hexSurfaceScanPermissionGranted", r.hexSurfaceScanPermissionGranted),
      line("routeCanvasPresentationPermissionGranted", r.routeCanvasPresentationPermissionGranted),
      line("constructPermissionGranted", r.constructPermissionGranted),
      line("visibleSurfacePermissionGranted", r.visibleSurfacePermissionGranted),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasDeliveryStatus", r.canvasDeliveryStatus),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorRenewalContract", RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorRenewalReceipt", RENEWAL_RECEIPT);
    setDataset("hearthRouteConductorCurrent", RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorVersion", VERSION);

    setDataset("hearthRouteConductorPassiveUiSafeManualScanActive", "true");
    setDataset("hearthRouteConductorNormalUiContactIsPassiveOnly", "true");
    setDataset("hearthRouteConductorButtonContactHeavyScanSuppressed", "true");
    setDataset("hearthRouteConductorAutomaticBootScanSuppressed", "true");
    setDataset("hearthRouteConductorAutomaticMissingChainLoadSuppressed", "true");
    setDataset("hearthRouteConductorDeepReceiptSerializationSuppressed", "true");
    setDataset("hearthRouteConductorCanvasPixelReadSuppressedForUi", "true");

    setDataset("hearthRouteConductorSafePacketBridgeActive", "true");
    setDataset("hearthRouteConductorLifecycleIgnitionSuppressed", "true");
    setDataset("hearthRouteConductorCanvasLifecycleMethodsSuppressed", "true");
    setDataset("hearthRouteConductorPointerFingerDirectLoadSuppressed", "true");
    setDataset("hearthRouteConductorSourceStackDirectLoadSuppressed", "true");
    setDataset("hearthRouteConductorDuplicateScriptAppendSuppressed", "true");
    setDataset("hearthRouteConductorFilePathLoadLocksActive", "true");
    setDataset("hearthRouteConductorReasonBasedLoadLocksRetired", "true");

    setDataset("hearthRouteConductorActiveScanAuthority", "true");
    setDataset("hearthBilateralRouteCanvasScanActive", "true");
    setDataset("hearthTriangleScanActive", "true");
    setDataset("hearthTriangleFunnelsToCanvasPlatterByRoute", "true");
    setDataset("hearthSingleHandshakeGreenLightBlocked", "true");

    setDataset("hearthRouteActiveScanConfirmed", String(state.routeActiveScanConfirmed));
    setDataset("hearthControlsGatewayPermissionGranted", String(state.controlsGatewayPermissionGranted));
    setDataset("hearthRouteHexScanPermissionGranted", String(state.routeHexScanPermissionGranted));
    setDataset("hearthHexSurfaceScanPermissionGranted", String(state.hexSurfaceScanPermissionGranted));
    setDataset("hearthRouteCanvasPresentationPermissionGranted", String(state.routeCanvasPresentationPermissionGranted));
    setDataset("hearthCanvasAcceptanceScanRequested", String(state.canvasAcceptanceScanRequested));
    setDataset("hearthCanvasAcceptanceScanConfirmed", String(state.canvasAcceptanceScanConfirmed));
    setDataset("hearthBilateralRouteCanvasScanConfirmed", String(state.bilateralRouteCanvasScanConfirmed));
    setDataset("hearthConstructPermissionGranted", String(state.constructPermissionGranted));
    setDataset("hearthVisibleSurfacePermissionGranted", String(state.visibleSurfacePermissionGranted));
    setDataset("hearthMotionPermissionGranted", String(state.motionPermissionGranted));

    setDataset("hearthControlHandshakeDeliveryStatus", state.controlHandshakeDeliveryStatus);
    setDataset("hearthControlHandshakeMethod", state.controlHandshakeMethod);
    setDataset("hearthCanvasDeliveryStatus", state.canvasDeliveryStatus);
    setDataset("hearthCanvasDeliveryMethod", state.canvasDeliveryMethod);
    setDataset("hearthCanvasDeliveryReason", state.canvasDeliveryReason);
    setDataset("hearthHexScanDeliveryStatus", state.hexScanDeliveryStatus);
    setDataset("hearthHexScanDeliveryMethod", state.hexScanDeliveryMethod);

    setDataset("hearthCanvasMountFound", String(state.canvasMountFound));
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasInMount", String(state.canvasInMount));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);
    setDataset("hearthCanvasSelector", state.canvasSelector);
    setDataset("hearthCanvasMountSelector", state.canvasMountSelector);

    setDataset("hearthRouteConductorFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthRouteConductorRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthRouteConductorRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthRouteConductorPostgameStatus", state.postgameStatus);

    setDataset("hearthRouteConductorF13Claimed", "false");
    setDataset("hearthRouteConductorF21EligibleForNorth", "false");
    setDataset("hearthRouteConductorReadyTextAllowed", "false");
    setDataset("hearthRouteConductorReadyTextClaimed", "false");
    setDataset("hearthRouteConductorVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishApiAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    const paths = [
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
      "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
      "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION",
      "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF",
      "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE",
      "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH_ROUTE_NORTH_BISHOP",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
      "HEARTH.routeConductor",
      "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
      "HEARTH.routeConductorPassiveUiSafeManualScan",
      "HEARTH.routeConductorSafePacketBridgeNoLifecycleIgnition",
      "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoff",
      "HEARTH.routeConductorBilateralTriangleScanCanvasPlatterPacketBridge",
      "HEARTH.routeConductorHexGatePointerFingerTransmission",
      "HEARTH.routeConductorCanvasDomSurfaceAdmissionAndRelease",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeNorthBishop",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorPrimaryGate",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
      "DEXTER_LAB.hearthRouteConductorPassiveUiSafeManualScan",
      "DEXTER_LAB.hearthRouteConductorSafePacketBridgeNoLifecycleIgnition",
      "DEXTER_LAB.hearthRouteConductorGovernedSourceStackAdmissionCanvasHandoff",
      "DEXTER_LAB.hearthRouteConductorBilateralTriangleScanCanvasPlatterPacketBridge",
      "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmission",
      "DEXTER_LAB.hearthRouteConductorCanvasDomSurfaceAdmissionAndRelease",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
    ];

    for (const path of paths) setPath(path, api);

    state.aliasPublishCount += 1;
    return true;
  }

  function publishReceiptAliases(_includeDebug = false) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight();

    state.receiptPublishCount += 1;

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_REPORT = receipt;

    hearth.routeConductorReceipt = receipt;
    hearth.routeConductorShowtimeNewsFibonacciQueenCanvasSyncReceipt = receipt;
    hearth.routeConductorPassiveUiSafeManualScanReceipt = receipt;
    hearth.routeConductorSafePacketBridgeNoLifecycleIgnitionReceipt = receipt;
    hearth.routeConductorGovernedSourceStackAdmissionCanvasHandoffReceipt = receipt;
    hearth.routeConductorBilateralTriangleScanCanvasPlatterPacketBridgeReceipt = receipt;
    hearth.routeConductorReport = receipt;

    lab.hearthRouteConductorReceipt = receipt;
    lab.hearthRouteConductorPassiveUiSafeManualScanReceipt = receipt;
    lab.hearthRouteConductorSafePacketBridgeNoLifecycleIgnitionReceipt = receipt;
    lab.hearthRouteConductorBilateralTriangleScanCanvasPlatterPacketBridgeReceipt = receipt;
    lab.hearthRouteConductorReport = receipt;

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishApiAliases();
    updateDataset();
    publishReceiptAliases(false);

    record("ROUTE_CONDUCTOR_GLOBALS_PUBLISHED", {
      reason,
      contract: CONTRACT,
      renewalContract: RENEWAL_CONTRACT,
      passiveUiSafeManualScanActive: true,
      normalUiContactIsPassiveOnly: true,
      lifecycleIgnitionSuppressed: true,
      visualPassClaimed: false
    });

    return true;
  }

  function observePassive(reason = "observe-passive") {
    return passiveSnapshot(reason);
  }

  function refresh() {
    return observePassive("refresh-ui-safe-passive");
  }

  function render() {
    return observePassive("render-ui-safe-passive");
  }

  function boot() {
    if (state.booted) return getReceiptLight();

    state.booted = true;
    state.startedAt = state.startedAt || nowIso();
    state.updatedAt = nowIso();
    state.postgameStatus = "ROUTE_CONDUCTOR_BOOTED_PASSIVE_UI_SAFE_NO_HEAVY_SCAN";

    publishApiAliases();
    updateDataset();
    publishPassivePackets();
    publishReceiptAliases(false);

    record("ROUTE_CONDUCTOR_BOOTED_PASSIVE_UI_SAFE", {
      automaticBootScanSuppressed: true,
      normalUiContactIsPassiveOnly: true
    });

    return getReceiptLight();
  }

  function start() {
    return boot();
  }

  function init() {
    return boot();
  }

  function run() {
    return boot();
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.postgameStatus = "ROUTE_CONDUCTOR_DISPOSED";
    record("ROUTE_CONDUCTOR_DISPOSED", { reason });
    updateDataset();
    publishReceiptAliases(false);
    return getReceiptLight();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    renewalContract: RENEWAL_CONTRACT,
    renewalReceipt: RENEWAL_RECEIPT,
    previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
    previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
    version: VERSION,
    route: ROUTE,
    file: FILE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerFingerFile: POINTER_FINGER_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    activeNewsCycle: "ROUTE_CONTROLS_HEX_SURFACE_TO_CANVAS_PLATTER_PASSIVE_UI_SAFE_MANUAL_SCAN",
    activeFibonacci: "F13_HELD_F21_NORTH_ONLY",

    passiveUiSafeManualScanActive: true,
    normalUiContactIsPassiveOnly: true,
    buttonContactHeavyScanSuppressed: true,
    automaticBootScanSuppressed: true,
    automaticMissingChainLoadSuppressed: true,
    deepReceiptSerializationSuppressed: true,
    canvasPixelReadSuppressedForUi: true,

    safePacketBridgeActive: true,
    lifecycleIgnitionSuppressed: true,
    canvasLifecycleMethodsSuppressed: true,
    pointerFingerDirectLoadSuppressed: true,
    governedSourceStackDirectLoadSuppressed: true,
    duplicateScriptAppendSuppressed: true,
    filePathLoadLocksActive: true,
    reasonBasedLoadLocksRetired: true,

    routeConductorActiveScanAuthority: true,
    bilateralRouteCanvasScanActive: true,
    triangleScanActive: true,
    controlsRemainMotionInputGatewayAuthority: true,
    canvasRemainsPresentationPlatterAuthority: true,
    hexSurfaceRemainsDownstreamGateAuthority: true,
    pointerFingerRemainsDownstreamExpressionAuthority: true,
    pointerFingerDirectBridgePermissionGranted: false,
    singleHandshakeGreenLightBlocked: true,
    intendedHandoffVarianceIncluded: true,

    boot,
    start,
    init,
    run,
    refresh,
    render,
    observePassive,
    dispose,

    runSafePacketBridgeScan,
    runBilateralScan,
    loadMissingDirectChain,
    scanCanvasSurface,
    scanSourceStack,
    scanNode,

    composeReceipt,
    composeReceiptText,
    getReceipt,
    getReceiptLight,
    getDebugReceipt,
    getReceiptText,
    getStatusText,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,

    composeControlHandshakePacket,
    getControlHandshakePacket,
    getControlsHandshakePacket,
    getPlanetaryControlHandshakePacket,
    getQueenControlHandshakePacket,
    getRouteConductorControlHandshakePacket,

    composeGovernedSourcePacket,
    getGovernedSourcePacket,
    getSourceStack,
    getSourceStackPacket,
    getSourceHoldPacket,
    composeSourceHoldPacket,

    composePresentationPacket,
    composeCanvasHandoffPacket: composePresentationPacket,
    getCanvasHandoffPacket,
    getHandoffPacket,
    getCanvasReleasePacket,
    getReleasePacket,

    composeHexGateTransmissionPacket: composeHexScanPacket,
    getHexGateTransmissionPacket,
    getHexTransmissionPacket,
    getRouteConductorHexGateTransmissionPacket,

    composePointerFingerTransmissionPacket: getPointerFingerTransmissionPacket,
    getPointerFingerTransmissionPacket,
    getRouteConductorPointerFingerTransmissionPacket,

    composeCompatibilityReceiptV94,
    getTransmissionPath,

    readIndexSummary,
    readControlSummary,
    readCanvasSummary,
    readHexAuthoritySummary,
    readHexSurfaceSummary,
    readPointerFingerSummary,
    readSourceStackSummary,
    readSourceSummary,

    publishApiAliases,
    publishGlobals,
    publishReceiptAliases,
    updateDataset,

    ownsRoutePermissionCoordination: true,
    ownsActiveScan: true,
    ownsControlHandshakePacketComposition: true,
    ownsHexSurfaceScanPacketComposition: true,
    ownsCanvasPresentationPacketComposition: true,
    ownsCanvasDrawing: false,
    ownsCanvasDomSurface: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsHexTruth: false,
    ownsPointerFingerTruth: false,
    ownsFinalVisualPassClaim: false,

    supportsSafePacketBridge: true,
    supportsNoLifecycleIgnition: true,
    supportsPassiveUiSafeManualScan: true,
    supportsButtonContactHeavyScanSuppression: true,
    supportsLightReceiptOnlyForUi: true,
    supportsExplicitDiagnosticScanGate: true,
    supportsBilateralRouteCanvasScan: true,
    supportsTriangleRouteControlsHexScan: true,
    supportsCanvasPresentationPlatterPacket: true,
    supportsControlsGatewayBaseline: true,
    supportsHexSurfaceActiveScan: true,
    supportsIntendedHandoffVariance: true,
    supportsSingleHandshakeGreenLightBlocked: true,

    ...NO_CLAIMS,

    get state() {
      return state;
    },

    get receiptObject() {
      return getReceiptLight();
    },

    get report() {
      return getReceiptLight();
    }
  });

  try {
    publishApiAliases();
    updateDataset();
    publishPassivePackets();
    publishReceiptAliases(false);

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
    recordError("ROUTE_CONDUCTOR_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
