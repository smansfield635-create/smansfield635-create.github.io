// /showroom/globe/hearth/hearth.js
// HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10
// Internal controlled renewal:
// HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_TNT_v10_8
// Full-file replacement.
// Route Conductor / showroom-side Canvas transaction coordinator only.
// Purpose:
// - Preserve the public v10 route-conductor contract expected by HTML, index.js, diagnostics, and receipts.
// - Reset the route-side Canvas transaction so the route points to Canvas first, not to Inspect/Finger internals.
// - Load/observe the minimal Canvas asset transaction chain:
//   1. /assets/hearth/hearth.hex.four-pair.authority.js
//   2. /assets/hearth/hearth.hex.surface.js
//   3. /assets/hearth/hearth.canvas.js
// - Publish lawful Canvas handoff packets for the Canvas asset to consume.
// - Preserve Hex Surface as the downstream gate after Canvas.
// - Preserve Pointer Surface as downstream Bishop gate.
// - Preserve Pointer Inspect as child organizer / proof surface only.
// - Do not renew or load Controls here.
// - Do not load Finger Surface directly from the route.
// - Do not create Canvas, draw Canvas, repair Canvas pixels, restart runtime, or claim final visual pass.
// Does not own:
// - HTML shell geometry
// - Canvas drawing
// - Canvas lifecycle authority
// - Controls motion/input
// - Hex authority truth
// - Hex Surface truth
// - Pointer/Finger truth
// - terrain/material/hydrology/elevation truth
// - F13 claim
// - F21 latch
// - ready text
// - final visual pass

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT_v10";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_TNT_v10_8";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_RECEIPT_v10_8";

  const PREVIOUS_RENEWAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7";
  const PREVIOUS_RENEWAL_RECEIPT =
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_RECEIPT_v10_7";

  const LINEAGE_V10_5_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5";
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
  const COMPATIBILITY_V9_4_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const VERSION =
    "2026-06-08.hearth-route-conductor-canvas-asset-transaction-reset-v10-8";

  const ROUTE = "/showroom/globe/hearth/";
  const FILE = "/showroom/globe/hearth/hearth.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";

  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const POINTER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
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
  const EXPECTED_POINTER_SURFACE_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const EXPECTED_POINTER_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const PACKET_CANVAS_TRANSACTION =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_PACKET_v10_8";
  const PACKET_GOVERNED_SOURCE =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_PACKET_v10_8";
  const PACKET_SOURCE_HOLD =
    "HEARTH_ROUTE_CONDUCTOR_SOURCE_HOLD_PACKET_v10_8";
  const PACKET_HEX_GATE =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_HEX_GATE_INTENT_PACKET_v10_8";
  const PACKET_POINTER_PATH =
    "HEARTH_ROUTE_CONDUCTOR_POINTER_SURFACE_BISHOP_PATH_PACKET_v10_8";

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

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_PERMISSION_GRANTED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION",
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
    "HEARTH.canvasHubHexSurfacePointerFingerTransmission",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubRafSphereRotationPairReceiver",
    "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "HEARTH.canvasRouteConductorReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubHexSurfacePointerFingerTransmission",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasRouteConductorReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const CANVAS_RECEIVER_METHODS = Object.freeze([
    "receiveRouteConductorCanvasTransactionPacket",
    "consumeRouteConductorCanvasTransactionPacket",
    "acceptRouteConductorCanvasTransactionPacket",
    "receiveRouteConductorHandoffPacket",
    "consumeRouteConductorHandoffPacket",
    "acceptRouteConductorHandoffPacket",
    "receiveGovernedSourcePacket",
    "consumeGovernedSourcePacket",
    "receiveCanvasHandoffPacket",
    "consumeCanvasHandoffPacket",
    "acceptCanvasHandoffPacket",
    "receivePresentationPacket",
    "receiveHandoffPacket",
    "consumeHandoffPacket",
    "acceptHandoffPacket",
    "receive"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_BINDING_POINTER_TRANSMISSION",
    "HEARTH_HEX_PAIR_SURFACE",
    "HEARTH_HEX_PAIR_RENDERER",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexSurfaceCanonicalMapTupleBindingPointerTransmission",
    "HEARTH.hexPairSurface",
    "HEARTH.hexPairRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurfaceCanonicalMapTupleBindingPointerTransmission",
    "DEXTER_LAB.hearthHexPairSurface",
    "DEXTER_LAB.hearthHexPairRenderer"
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_HANDSHAKE_AUTHORITY",
    "HEARTH_HEXGRID_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthHexAuthority"
  ]);

  const CONTROL_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controlsHexGatePointerFingerTransmission",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthQueenControls"
  ]);

  const POINTER_SURFACE_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH_CANVAS_FINGER_SURFACE_BISHOP",
    "HEARTH_POINTER_SURFACE_BISHOP",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerFingerSurface",
    "HEARTH.canvasFingerSurfaceBishop",
    "HEARTH.pointerSurfaceBishop",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthPointerFingerSurface",
    "DEXTER_LAB.hearthPointerSurfaceBishop"
  ]);

  const POINTER_INSPECT_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECTOR",
    "HEARTH_DIAGNOSTIC_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_SURFACE_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_GATE_POINTER_FINGER_INSPECT_RECEIVER",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspector",
    "HEARTH.diagnosticCanvasFingerInspect",
    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerReceiver",
    "HEARTH.hexGatePointerFingerInspectReceiver",
    "HEARTH.hexSurfacePointerFingerReceiver",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerInspector",
    "DEXTER_LAB.hearthDiagnosticCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerReceiver",
    "DEXTER_LAB.hearthHexSurfacePointerFingerReceiver"
  ]);

  const ROUTE_CONDUCTOR_ALIAS_PATHS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET",
    "HEARTH.routeConductor",
    "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
    "HEARTH.routeConductorCanvasAssetTransactionReset",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteConductorCanvasAssetTransactionReset"
  ]);

  const ASSET_CHAIN = Object.freeze([
    {
      id: "HEX_AUTHORITY",
      role: "hex-four-pair-authority",
      file: HEX_AUTHORITY_FILE,
      contract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      requiredForCanvasTransaction: true,
      aliases: HEX_AUTHORITY_ALIASES
    },
    {
      id: "HEX_SURFACE",
      role: "canvas-facing-hex-surface-gate",
      file: HEX_SURFACE_FILE,
      contract: EXPECTED_HEX_SURFACE_CONTRACT,
      requiredForCanvasTransaction: true,
      aliases: HEX_SURFACE_ALIASES
    },
    {
      id: "CANVAS",
      role: "visible-output-receiver-and-hex-surface-caller",
      file: CANVAS_FILE,
      contract: EXPECTED_CANVAS_CONTRACT,
      requiredForCanvasTransaction: true,
      aliases: CANVAS_ALIASES
    }
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
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
    pointerSurfaceFile: POINTER_SURFACE_FILE,
    pointerInspectFile: POINTER_INSPECT_FILE,
    pointerFingerFile: POINTER_SURFACE_FILE,
    legacyPointerFingerFile: POINTER_INSPECT_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_ROUTE_CONDUCTOR_V10_8_LOADED",

    canvasAssetTransactionResetActive: true,
    routeConductorActiveScanAuthority: true,
    canvasAssetDirectLoadAuthority: true,
    canvasFirstTransactionPathActive: true,
    controlsRenewalAuthorizedHere: false,
    controlsDirectLoadSuppressed: true,
    pointerFingerDirectLoadSuppressed: true,
    pointerSurfaceDirectLoadSuppressed: true,
    inspectFileNotPrimaryChainEndpoint: true,
    pointerSurfaceBishopPathRecognized: true,
    canvasLifecycleMethodsSuppressed: true,
    canvasDrawingSuppressed: true,
    runtimeRestartSuppressed: true,
    deepReceiptSerializationSuppressedForUi: true,
    canvasPixelReadSuppressedForRouteConductor: true,
    duplicateScriptAppendSuppressed: true,
    filePathLoadLocksActive: true,

    sourceStackObserved: false,
    sourceStackPermissionGranted: true,
    routeCanvasPairPermissionRequested: false,
    routeCanvasPairPermissionGranted: false,
    routeCanvasHandoffReturnObserved: false,
    routeCanvasHandoffMethod: "NONE",
    routeCanvasHandoffStatus: "WAITING_CANVAS_ASSET",
    routeCanvasHandoffReason: "CANVAS_ASSET_NOT_YET_OBSERVED",

    constructPermissionGranted: false,
    visibleSurfacePermissionGranted: false,
    motionPermissionGranted: false,
    controlsGatewayPermissionGranted: false,
    routeControlsHandshakePermissionGranted: false,
    routeHexScanPermissionGranted: false,
    hexSurfaceScanPermissionGranted: false,
    canvasAcceptanceScanRequested: false,
    canvasAcceptanceScanConfirmed: false,
    bilateralRouteCanvasScanConfirmed: false,

    assetLoadAttempted: false,
    assetLoadStatus: "NOT_STARTED",
    assetLoadCount: 0,
    assetLoadErrorCount: 0,
    firstAssetLoadFailureFile: "NONE",
    firstAssetLoadFailureReason: "NONE",
    loadedAssetFiles: [],
    observedAssetFiles: [],
    missingAssetFiles: [],

    canvasSummary: null,
    hexSurfaceSummary: null,
    hexAuthoritySummary: null,
    controlSummary: null,
    pointerFingerSummary: null,
    sourceStack: [],
    canvasSurfaceScan: null,

    lastCanvasHandoffPacket: null,
    lastGovernedSourcePacket: null,
    lastSourceHoldPacket: null,
    lastHexGateTransmissionPacket: null,
    lastPointerFingerTransmissionPacket: null,
    lastReceipt: null,
    lastReceiptText: "",

    packetCount: 0,
    passiveReadCount: 0,
    explicitScanCount: 0,
    blockedHeavyScanCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    lifecycleSuppressionCount: 0,
    eventCount: 0,
    errorCount: 0,

    firstFailedCoordinate: "CANVAS_ASSET_TRANSACTION_NOT_RUN",
    recommendedNextFile: CANVAS_FILE,
    recommendedNextAction: "INSTALL_CANVAS_ASSET_FILE_PAIR_SECOND",
    postgameStatus: "ROUTE_CONDUCTOR_LOADED_WAITING_CANVAS_ASSET_TRANSACTION",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  const api = {};
  const loadLocks = {};
  let bootPromise = null;

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

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
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

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return Object.assign({}, value);
    }
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;
    if (Array.isArray(value)) return value.map((entry) => packetValue(entry, "")).filter(Boolean).join(" | ") || fallback;

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 22000) || fallback;
      } catch (_error) {
        return bounded(String(value), 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_ROUTE_CONDUCTOR_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 180);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_ROUTE_CONDUCTOR_ERROR"),
      message: bounded(error && error.message ? error.message : error, 1200),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 120);
    state.errorCount = state.errors.length;
    state.latestEvent = item.code;
    state.updatedAt = item.at;

    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(path) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    if (!parts.length) return false;

    let cursor = root;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!part) continue;
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && (isObject(value) || isFunction(value))) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function dataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readField(source, keys, fallback = "") {
    const obj = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];

      const lower = key.toLowerCase();
      const candidates = Object.keys(obj);
      for (const candidate of candidates) {
        if (candidate.toLowerCase() === lower) {
          const value = obj[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority)) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getSummary",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getControlReceipt",
      "getControlSummary",
      "getHexReceipt",
      "getHexAuthorityReceipt",
      "getHexSurfaceReceipt",
      "getFingerReceipt",
      "getPointerFingerReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.canvasReceipt)) return authority.canvasReceipt;
    if (isObject(authority.hexReceipt)) return authority.hexReceipt;
    if (isObject(authority.hexAuthorityReceipt)) return authority.hexAuthorityReceipt;
    if (isObject(authority.hexSurfaceReceipt)) return authority.hexSurfaceReceipt;
    if (isObject(authority.pointerFingerReceipt)) return authority.pointerFingerReceipt;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function contractOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexContract",
        "hexSurfaceContract",
        "pointerFingerContract",
        "pointerSurfaceContract",
        "implementationContract",
        "internalImplementationContract",
        "internalRenewalContract",
        "contract",
        "CONTRACT",
        "sourceContract"
      ]),
      value && value.contract,
      value && value.CONTRACT
    ) || "UNKNOWN";
  }

  function receiptOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexAuthorityReceipt",
        "hexReceipt",
        "hexSurfaceReceipt",
        "pointerFingerReceipt",
        "pointerSurfaceReceipt",
        "implementationReceipt",
        "internalImplementationReceipt",
        "internalRenewalReceipt",
        "receipt",
        "RECEIPT",
        "sourceReceipt"
      ]),
      value && value.receipt,
      value && value.RECEIPT
    ) || "UNKNOWN";
  }

  function safeKeys(value) {
    try {
      if (isObject(value) || isFunction(value)) return Object.keys(value);
    } catch (_error) {}
    return [];
  }

  function methodList(value) {
    return safeKeys(value).filter((key) => isFunction(value[key]));
  }

  function resolveMethod(authority, methods) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "NONE";
    for (const method of methods || []) {
      if (isFunction(authority[method])) return method;
    }
    return "NONE";
  }

  function summarizeAuthority(paths, expectedContract = "") {
    const found = firstGlobal(paths);
    const receipt = readAuthorityReceipt(found.value) || {};
    const contract = contractOf(receipt) !== "UNKNOWN" ? contractOf(receipt) : contractOf(found.value || {});
    const receiptName = receiptOf(receipt) !== "UNKNOWN" ? receiptOf(receipt) : receiptOf(found.value || {});
    const methods = methodList(found.value || {});

    return {
      observed: Boolean(found.value),
      path: found.path,
      contract,
      receipt: receiptName,
      recognized: Boolean(contract && contract !== "UNKNOWN" && (!expectedContract || contract === expectedContract || contract.includes(expectedContract.split("_TNT_")[0]))),
      keyCount: safeKeys(found.value || {}).length,
      methodCount: methods.length,
      methods: methods.slice(0, 64),
      receiverMethod: resolveMethod(found.value, CANVAS_RECEIVER_METHODS),
      authority: found.value || null
    };
  }

  function queryFirst(selectors) {
    if (!doc || !doc.querySelector) return null;

    for (const selector of selectors || []) {
      try {
        const node = doc.querySelector(selector);
        if (node) return { selector, node };
      } catch (_error) {}
    }

    return null;
  }

  function rectSummary(node) {
    if (!node || !node.getBoundingClientRect) {
      return {
        found: false,
        rectNonzero: false,
        width: 0,
        height: 0,
        visible: false,
        intersecting: false
      };
    }

    let rect = null;
    let style = null;

    try {
      rect = node.getBoundingClientRect();
    } catch (_error) {
      rect = null;
    }

    try {
      style = root.getComputedStyle ? root.getComputedStyle(node) : null;
    } catch (_error) {
      style = null;
    }

    const width = safeNumber(rect && rect.width, 0);
    const height = safeNumber(rect && rect.height, 0);
    const rectNonzero = width > 0 && height > 0;

    const visible =
      rectNonzero &&
      (!style ||
        (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.visibility !== "collapse" &&
          safeNumber(style.opacity, 1) > 0
        ));

    const viewportWidth = safeNumber(root.innerWidth, 0);
    const viewportHeight = safeNumber(root.innerHeight, 0);

    const intersecting =
      rectNonzero &&
      viewportWidth > 0 &&
      viewportHeight > 0 &&
      rect.left < viewportWidth &&
      rect.right > 0 &&
      rect.top < viewportHeight &&
      rect.bottom > 0;

    return {
      found: true,
      rectNonzero,
      left: safeNumber(rect && rect.left, 0),
      top: safeNumber(rect && rect.top, 0),
      width,
      height,
      visible,
      intersecting,
      display: style ? safeString(style.display, "UNKNOWN") : "UNKNOWN",
      visibility: style ? safeString(style.visibility, "UNKNOWN") : "UNKNOWN",
      opacity: style ? safeString(style.opacity, "UNKNOWN") : "UNKNOWN"
    };
  }

  function scanCanvasSurface() {
    const mountFound = queryFirst(["#hearthCanvasMount", "[data-hearth-canvas-mount='canonical']"]);
    const frameFound = queryFirst(["#hearthCanvasRectLockFrame", "[data-hearth-canvas-rect-lock-frame='canonical']"]);
    const canvasFound = queryFirst(["#hearthVisibleCanvas", "[data-hearth-visible-canvas='canonical']", "#hearthCanvasMount canvas"]);

    const mount = mountFound ? mountFound.node : null;
    const frame = frameFound ? frameFound.node : null;
    const canvas = canvasFound ? canvasFound.node : null;

    let contextReady = false;
    let contextStatus = "CANVAS_NOT_FOUND";

    if (canvas && canvas.getContext) {
      try {
        contextReady = Boolean(canvas.getContext("2d"));
        contextStatus = contextReady ? "CANVAS_CONTEXT_2D_READY" : "CANVAS_CONTEXT_2D_NULL";
      } catch (error) {
        contextReady = false;
        contextStatus = `CANVAS_CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 600)}`;
      }
    }

    const mountRect = rectSummary(mount);
    const frameRect = rectSummary(frame);
    const canvasRect = rectSummary(canvas);

    const scan = {
      mountFound: Boolean(mount),
      mountSelector: mountFound ? mountFound.selector : "NONE",
      mountRectNonzero: mountRect.rectNonzero,
      mountVisible: mountRect.visible,
      mountViewportIntersecting: mountRect.intersecting,
      mountRect,

      frameFound: Boolean(frame),
      frameSelector: frameFound ? frameFound.selector : "NONE",
      frameRectNonzero: frameRect.rectNonzero,
      frameVisible: frameRect.visible,
      frameRect,

      canvasElementFound: Boolean(canvas),
      canvasSelector: canvasFound ? canvasFound.selector : "NONE",
      canvasInMount: Boolean(canvas && mount && mount.contains(canvas)),
      canvasInFrame: Boolean(canvas && frame && frame.contains(canvas)),
      canvasRectNonzero: canvasRect.rectNonzero,
      canvasComputedVisible: canvasRect.visible,
      canvasViewportIntersecting: canvasRect.intersecting,
      canvasContext2dReady: contextReady,
      canvasContext2dStatus: contextStatus,
      canvasPixelReadSuppressedForRouteConductor: true,
      canvasPixelVisible: "NOT_SAMPLED_BY_ROUTE_CONDUCTOR",
      canvasRect,

      surfaceTruthReadyForCanvasAsset:
        Boolean(mount && frame && canvas && mountRect.rectNonzero && frameRect.rectNonzero && canvasRect.rectNonzero && contextReady),

      firstFailedCoordinate:
        !mount ? "CANONICAL_MOUNT_NOT_FOUND" :
        !mountRect.rectNonzero ? "CANONICAL_MOUNT_RECT_NONZERO" :
        !frame ? "CANONICAL_FRAME_NOT_FOUND" :
        !frameRect.rectNonzero ? "CANONICAL_FRAME_RECT_NONZERO" :
        !canvas ? "CANONICAL_CANVAS_NOT_FOUND" :
        !canvasRect.rectNonzero ? "CANONICAL_CANVAS_RECT_NONZERO" :
        !contextReady ? "CANVAS_CONTEXT_2D_READY" :
        "NONE",

      recommendedOwner:
        !mount || !mountRect.rectNonzero || !frame || !frameRect.rectNonzero || !canvas || !canvasRect.rectNonzero
          ? "HTML_SHELL_OR_STAGE_LAYOUT"
          : "CANVAS_ASSET_RECEIVER",

      recommendedFile:
        !mount || !mountRect.rectNonzero || !frame || !frameRect.rectNonzero || !canvas || !canvasRect.rectNonzero
          ? HTML_FILE
          : CANVAS_FILE,

      recommendedAction:
        !mount || !mountRect.rectNonzero || !frame || !frameRect.rectNonzero || !canvas || !canvasRect.rectNonzero
          ? "RESTORE_CANONICAL_MOUNT_FRAME_CANVAS_RECT"
          : "INSTALL_OR_REFRESH_CANVAS_ASSET_RECEIVER"
    };

    state.canvasSurfaceScan = clonePlain(scan);
    return scan;
  }

  function scriptPathFromSrc(src) {
    const text = safeString(src);
    if (!text) return "";

    try {
      return new URL(text, root.location && root.location.href ? root.location.href : "https://local.invalid/").pathname;
    } catch (_error) {
      return text.split("?")[0].split("#")[0];
    }
  }

  function findScript(file) {
    if (!doc || !doc.querySelectorAll) return null;

    try {
      const scripts = Array.from(doc.querySelectorAll("script[src]"));
      return scripts.find((script) => scriptPathFromSrc(script.getAttribute("src") || script.src) === file) || null;
    } catch (_error) {
      return null;
    }
  }

  function appendScriptFile(file, contract, reason = "canvas-asset-transaction") {
    if (!doc || !doc.createElement || !doc.head) {
      return Promise.resolve({
        file,
        attempted: false,
        loaded: false,
        observed: false,
        status: "DOCUMENT_HEAD_NOT_AVAILABLE"
      });
    }

    const existing = findScript(file);
    if (existing) {
      return Promise.resolve({
        file,
        attempted: false,
        loaded: true,
        observed: true,
        status: "SCRIPT_ALREADY_PRESENT",
        src: existing.getAttribute("src") || existing.src || file
      });
    }

    if (loadLocks[file]) return loadLocks[file];

    const promise = new Promise((resolve) => {
      const script = doc.createElement("script");
      const src = `${file}?v=${encodeURIComponent(contract || INTERNAL_RENEWAL_CONTRACT)}`;

      script.src = src;
      script.async = false;
      script.defer = true;
      script.dataset.hearthRouteConductorLoaded = "true";
      script.dataset.hearthRouteConductorLoadReason = reason;
      script.dataset.hearthExpectedContract = contract || "";

      script.onload = () => {
        state.assetLoadCount += 1;
        state.loadedAssetFiles.push(file);
        trimLog(state.loadedAssetFiles, 24);
        record("HEARTH_ROUTE_CONDUCTOR_ASSET_SCRIPT_LOADED", { file, contract, reason });
        resolve({
          file,
          attempted: true,
          loaded: true,
          observed: true,
          status: "SCRIPT_LOAD_RETURNED",
          src
        });
      };

      script.onerror = () => {
        state.assetLoadErrorCount += 1;
        if (state.firstAssetLoadFailureFile === "NONE") {
          state.firstAssetLoadFailureFile = file;
          state.firstAssetLoadFailureReason = "SCRIPT_ERROR";
        }

        recordError("HEARTH_ROUTE_CONDUCTOR_ASSET_SCRIPT_LOAD_FAILED", "SCRIPT_ERROR", { file, contract, reason });

        resolve({
          file,
          attempted: true,
          loaded: false,
          observed: false,
          status: "SCRIPT_LOAD_ERROR",
          src
        });
      };

      doc.head.appendChild(script);
    });

    loadLocks[file] = promise;
    return promise;
  }

  function loadMissingDirectChain(options = {}) {
    const reason = safeString(options.reason || "loadMissingDirectChain");
    state.assetLoadAttempted = true;
    state.assetLoadStatus = "RUNNING_CANVAS_ASSET_TRANSACTION_CHAIN";

    const results = [];

    return ASSET_CHAIN.reduce((chain, entry) => {
      return chain.then(() => {
        const existing = findScript(entry.file);
        const observed = firstGlobal(entry.aliases).value;

        if (existing || observed) {
          const result = {
            id: entry.id,
            file: entry.file,
            attempted: false,
            loaded: true,
            observed: Boolean(observed),
            scriptPresent: Boolean(existing),
            status: existing ? "SCRIPT_ALREADY_PRESENT" : "AUTHORITY_ALREADY_OBSERVED"
          };

          results.push(result);
          return result;
        }

        return appendScriptFile(entry.file, entry.contract, reason).then((result) => {
          results.push({
            id: entry.id,
            ...result
          });
          return result;
        });
      });
    }, Promise.resolve()).then(() => {
      const missing = [];

      for (const entry of ASSET_CHAIN) {
        const observed = firstGlobal(entry.aliases).value;
        const scriptPresent = Boolean(findScript(entry.file));

        if (observed || scriptPresent) {
          if (!state.observedAssetFiles.includes(entry.file)) state.observedAssetFiles.push(entry.file);
        } else {
          missing.push(entry.file);
        }
      }

      state.missingAssetFiles = missing;
      state.assetLoadStatus = missing.length
        ? "CANVAS_ASSET_TRANSACTION_CHAIN_PARTIAL"
        : "CANVAS_ASSET_TRANSACTION_CHAIN_SCRIPT_PRESENT_OR_OBSERVED";

      state.firstFailedCoordinate = missing.length ? "ASSET_CHAIN_MISSING_FILE" : "NONE_CANVAS_ASSET_CHAIN_PRESENT";
      state.recommendedNextFile = missing.length ? missing[0] : CANVAS_FILE;
      state.recommendedNextAction = missing.length
        ? "VERIFY_ASSET_FILE_PATH_AND_SCRIPT_LOAD"
        : "INSTALL_OR_RUN_CANVAS_ASSET_RECEIVER";

      record("HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_CHAIN_LOAD_COMPLETE", {
        reason,
        status: state.assetLoadStatus,
        missingAssetFiles: missing
      });

      refresh({ reason: "asset-chain-load-complete", attemptHandoff: true });

      return {
        ok: missing.length === 0,
        status: state.assetLoadStatus,
        results: clonePlain(results),
        missingAssetFiles: missing.slice(),
        receipt: getReceiptLight(false)
      };
    });
  }

  function readIndexSummary() {
    const ds = dataset();
    const scripts = doc && doc.querySelectorAll ? Array.from(doc.querySelectorAll("script[src]")) : [];
    const indexScript = scripts.find((script) => scriptPathFromSrc(script.getAttribute("src") || script.src) === INDEX_FILE) || null;

    return {
      file: INDEX_FILE,
      observed: Boolean(indexScript || ds.indexJsContract || ds.hearthIndexJsContract),
      scriptPresent: Boolean(indexScript),
      scriptSrc: indexScript ? indexScript.getAttribute("src") || indexScript.src || "UNKNOWN" : "NOT_FOUND",
      contract: firstNonEmpty(ds.indexJsContract, ds.hearthIndexJsContract, EXPECTED_INDEX_CONTRACT),
      contractRecognized: firstNonEmpty(ds.indexJsContract, ds.hearthIndexJsContract, EXPECTED_INDEX_CONTRACT) === EXPECTED_INDEX_CONTRACT
    };
  }

  function readCanvasSummary() {
    const summary = summarizeAuthority(CANVAS_ALIASES, EXPECTED_CANVAS_CONTRACT);
    const scan = scanCanvasSurface();

    const output = {
      file: CANVAS_FILE,
      expectedContract: EXPECTED_CANVAS_CONTRACT,
      expectedRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      observed: summary.observed,
      authorityPresent: summary.observed,
      authoritySource: summary.path,
      contract: summary.contract,
      receipt: summary.receipt,
      contractRecognized:
        summary.contract === EXPECTED_CANVAS_CONTRACT ||
        summary.contract === EXPECTED_CANVAS_RENEWAL_CANDIDATE ||
        safeString(summary.contract).includes("HEARTH_CANVAS"),
      keyCount: summary.keyCount,
      methodCount: summary.methodCount,
      methods: summary.methods,
      receiverMethod: summary.receiverMethod,
      receiverReady: summary.receiverMethod !== "NONE",
      scriptPresent: Boolean(findScript(CANVAS_FILE)),
      surfaceScan: scan
    };

    state.canvasSummary = clonePlain(output);
    return output;
  }

  function readHexSurfaceSummary() {
    const summary = summarizeAuthority(HEX_SURFACE_ALIASES, EXPECTED_HEX_SURFACE_CONTRACT);

    const receiverMethods = [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "drawInteractiveFrame",
      "drawPairFrame",
      "receiveInteractiveFramePacket"
    ];

    const output = {
      file: HEX_SURFACE_FILE,
      expectedContract: EXPECTED_HEX_SURFACE_CONTRACT,
      observed: summary.observed,
      authorityPresent: summary.observed,
      authoritySource: summary.path,
      contract: summary.contract,
      receipt: summary.receipt,
      contractRecognized:
        summary.contract === EXPECTED_HEX_SURFACE_CONTRACT ||
        safeString(summary.contract).includes("HEARTH_HEX_SURFACE"),
      keyCount: summary.keyCount,
      methodCount: summary.methodCount,
      methods: summary.methods,
      canvasGateReceiverMethod: resolveMethod(summary.authority, receiverMethods),
      canvasGateReceiverReady: resolveMethod(summary.authority, receiverMethods) !== "NONE",
      scriptPresent: Boolean(findScript(HEX_SURFACE_FILE))
    };

    state.hexSurfaceSummary = clonePlain(output);
    return output;
  }

  function readHexAuthoritySummary() {
    const summary = summarizeAuthority(HEX_AUTHORITY_ALIASES, EXPECTED_HEX_AUTHORITY_CONTRACT);

    const output = {
      file: HEX_AUTHORITY_FILE,
      expectedContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      observed: summary.observed,
      authorityPresent: summary.observed,
      authoritySource: summary.path,
      contract: summary.contract,
      receipt: summary.receipt,
      contractRecognized:
        summary.contract === EXPECTED_HEX_AUTHORITY_CONTRACT ||
        safeString(summary.contract).includes("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY"),
      keyCount: summary.keyCount,
      methodCount: summary.methodCount,
      methods: summary.methods,
      scriptPresent: Boolean(findScript(HEX_AUTHORITY_FILE))
    };

    state.hexAuthoritySummary = clonePlain(output);
    return output;
  }

  function readControlSummary() {
    const summary = summarizeAuthority(CONTROL_ALIASES, EXPECTED_CONTROL_CONTRACT);

    const output = {
      file: CONTROL_FILE,
      expectedContract: EXPECTED_CONTROL_CONTRACT,
      expectedRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      observed: summary.observed,
      authorityPresent: summary.observed,
      authoritySource: summary.path,
      contract: summary.contract,
      receipt: summary.receipt,
      contractRecognized:
        summary.contract === EXPECTED_CONTROL_CONTRACT ||
        summary.contract === EXPECTED_CONTROL_RENEWAL_CANDIDATE ||
        safeString(summary.contract).includes("HEARTH_CONTROLS"),
      keyCount: summary.keyCount,
      methodCount: summary.methodCount,
      methods: summary.methods,
      scriptPresent: Boolean(findScript(CONTROL_FILE)),
      directLoadSuppressedByThisFile: true,
      renewalAuthorizedHere: false,
      requiredForVisibleSurface: false,
      requiredForMotion: true,
      status: summary.observed ? "CONTROL_AUTHORITY_OBSERVED" : "EXPECTED_NOT_YET_WIRED"
    };

    state.controlSummary = clonePlain(output);
    return output;
  }

  function readPointerFingerSummary() {
    const surface = summarizeAuthority(POINTER_SURFACE_ALIASES, EXPECTED_POINTER_SURFACE_CONTRACT);
    const inspect = summarizeAuthority(POINTER_INSPECT_ALIASES, EXPECTED_POINTER_INSPECT_CONTRACT);

    const output = {
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      pointerFingerFile: POINTER_SURFACE_FILE,
      legacyPointerFingerFile: POINTER_INSPECT_FILE,

      pointerSurfaceRole: "BISHOP_GATE_DOWNSTREAM_OF_HEX_SURFACE",
      pointerInspectRole: "CHILD_ORGANIZER_PRIEST_PROOF_SURFACE",
      inspectIsPrimaryChainEndpoint: false,

      pointerSurfaceObserved: surface.observed,
      pointerSurfaceAuthorityPresent: surface.observed,
      pointerSurfaceSource: surface.path,
      pointerSurfaceContract: surface.contract,
      pointerSurfaceReceipt: surface.receipt,
      pointerSurfaceRecognized:
        safeString(surface.contract).includes("HEARTH_CANVAS_FINGER_SURFACE") ||
        safeString(surface.contract).includes("POINTER_BISHOP"),

      pointerInspectObserved: inspect.observed,
      pointerInspectAuthorityPresent: inspect.observed,
      pointerInspectSource: inspect.path,
      pointerInspectContract: inspect.contract,
      pointerInspectReceipt: inspect.receipt,
      pointerInspectRecognized:
        inspect.contract === EXPECTED_POINTER_INSPECT_CONTRACT ||
        safeString(inspect.contract).includes("HEARTH_CANVAS_FINGER_INSPECT"),

      pointerFingerObservedCount: [surface.observed, inspect.observed].filter(Boolean).length,
      pointerFingerActiveCount: [surface, inspect].filter((item) => item.methodCount > 0).length,

      pointerSurfaceScriptPresent: Boolean(findScript(POINTER_SURFACE_FILE)),
      pointerInspectScriptPresent: Boolean(findScript(POINTER_INSPECT_FILE)),
      pointerSurfaceDirectLoadSuppressedByThisFile: true,
      pointerInspectDirectLoadSuppressedByThisFile: true,
      directRouteToInspectRetired: true,
      routeDoesNotDeliverToPointerFingerDirectly: true
    };

    state.pointerFingerSummary = clonePlain(output);
    return output;
  }

  function readSourceSummary() {
    return {
      route: ROUTE,
      file: FILE,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      canvasFirstTransactionPathActive: true,
      controlsRenewalAuthorizedHere: false,
      pointerSurfaceDirectLoadSuppressed: true,
      canvasDrawingOwned: false,
      canvasLifecycleOwned: false,
      finalVisualPassClaimed: false,
      updatedAt: nowIso()
    };
  }

  function readSourceStackSummary() {
    return {
      sourceStackObserved: state.sourceStackObserved,
      sourceStackPermissionGranted: true,
      stack: getSourceStack(),
      transmissionPath: getTransmissionPath()
    };
  }

  function getSourceStack() {
    const stack = [
      {
        order: 1,
        id: "HTML_SHELL",
        file: HTML_FILE,
        role: "canonical-mount-geometry-owner",
        expectedContract: EXPECTED_HTML_CONTRACT,
        loadedByRouteConductor: false,
        mutationAuthorizedHere: false
      },
      {
        order: 2,
        id: "INDEX_JS",
        file: INDEX_FILE,
        role: "front-end-button-authority-and-route-entry-bridge",
        expectedContract: EXPECTED_INDEX_CONTRACT,
        loadedByRouteConductor: false,
        mutationAuthorizedHere: false
      },
      {
        order: 3,
        id: "ROUTE_CONDUCTOR",
        file: FILE,
        role: "canvas-asset-transaction-coordinator",
        expectedContract: CONTRACT,
        loadedByRouteConductor: false,
        mutationAuthorizedHere: false
      },
      {
        order: 4,
        id: "HEX_AUTHORITY",
        file: HEX_AUTHORITY_FILE,
        role: "hex-four-pair-authority",
        expectedContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
        loadedByRouteConductor: true,
        directMutationAuthorizedHere: false
      },
      {
        order: 5,
        id: "HEX_SURFACE",
        file: HEX_SURFACE_FILE,
        role: "canvas-facing-hex-gate",
        expectedContract: EXPECTED_HEX_SURFACE_CONTRACT,
        loadedByRouteConductor: true,
        directMutationAuthorizedHere: false
      },
      {
        order: 6,
        id: "CANVAS_ASSET",
        file: CANVAS_FILE,
        role: "visible-output-receiver-and-hex-surface-caller",
        expectedContract: EXPECTED_CANVAS_CONTRACT,
        expectedRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
        loadedByRouteConductor: true,
        directMutationAuthorizedHere: false
      },
      {
        order: 7,
        id: "POINTER_SURFACE_BISHOP",
        file: POINTER_SURFACE_FILE,
        role: "downstream-pointer-surface-bishop-gate",
        expectedContract: EXPECTED_POINTER_SURFACE_CONTRACT,
        loadedByRouteConductor: false,
        directMutationAuthorizedHere: false
      },
      {
        order: 8,
        id: "POINTER_INSPECT_PRIEST",
        file: POINTER_INSPECT_FILE,
        role: "child-organizer-proof-surface-not-primary-endpoint",
        expectedContract: EXPECTED_POINTER_INSPECT_CONTRACT,
        loadedByRouteConductor: false,
        directMutationAuthorizedHere: false
      },
      {
        order: 9,
        id: "CONTROLS",
        file: CONTROL_FILE,
        role: "motion-input-authority-later",
        expectedContract: EXPECTED_CONTROL_CONTRACT,
        expectedRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
        loadedByRouteConductor: false,
        directMutationAuthorizedHere: false
      }
    ];

    state.sourceStack = clonePlain(stack);
    state.sourceStackObserved = true;
    return stack;
  }

  function getTransmissionPath() {
    return [
      INDEX_FILE,
      FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      CANVAS_FILE,
      `${CANVAS_FILE} -> ${HEX_SURFACE_FILE}`,
      `${HEX_SURFACE_FILE} -> ${POINTER_SURFACE_FILE}`,
      `${POINTER_SURFACE_FILE} -> ${POINTER_INSPECT_FILE}`,
      `${CONTROL_FILE} is not renewed or loaded by this file`
    ];
  }

  function composeSourceHoldPacket() {
    const packet = {
      packetType: PACKET_SOURCE_HOLD,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      route: ROUTE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      controlFile: CONTROL_FILE,
      sourceStack: getSourceStack(),
      transmissionPath: getTransmissionPath(),
      canvasFirstTransactionPathActive: true,
      controlsRenewalAuthorizedHere: false,
      controlsDirectLoadSuppressed: true,
      pointerFingerDirectLoadSuppressed: true,
      pointerSurfaceDirectLoadSuppressed: true,
      inspectFileNotPrimaryChainEndpoint: true,
      routeDoesNotDeliverToInspectDirectly: true,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      runtimeRestartAuthorized: false,
      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastSourceHoldPacket = clonePlain(packet);
    state.packetCount += 1;
    return packet;
  }

  function composeGovernedSourcePacket() {
    const canvas = readCanvasSummary();
    const hexSurface = readHexSurfaceSummary();
    const hexAuthority = readHexAuthoritySummary();
    const control = readControlSummary();
    const pointer = readPointerFingerSummary();

    const packet = {
      packetType: PACKET_GOVERNED_SOURCE,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      route: ROUTE,

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
      expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

      canvasSummary: clonePlain(canvas),
      hexSurfaceSummary: clonePlain(hexSurface),
      hexAuthoritySummary: clonePlain(hexAuthority),
      controlSummary: clonePlain(control),
      pointerFingerSummary: clonePlain(pointer),

      canvasFirstTransactionPathActive: true,
      routeToCanvasHandoffExpected: true,
      canvasToHexSurfaceExpected: true,
      hexSurfaceToPointerSurfaceExpected: true,
      pointerSurfaceToInspectChildObservedOnly: true,
      controlsObservedOnly: true,
      controlsRenewalAuthorizedHere: false,
      controlsDirectLoadSuppressed: true,

      sourceStack: getSourceStack(),
      transmissionPath: getTransmissionPath(),
      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastGovernedSourcePacket = clonePlain(packet);
    state.packetCount += 1;
    return packet;
  }

  function composeHexGateTransmissionPacket() {
    const packet = {
      packetType: PACKET_HEX_GATE,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      route: ROUTE,
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,

      intendedRecipientFile: CANVAS_FILE,
      nextGateAfterCanvas: HEX_SURFACE_FILE,
      downstreamAfterHexSurface: POINTER_SURFACE_FILE,
      childProofAfterPointerSurface: POINTER_INSPECT_FILE,

      routeDoesNotCallHexSurfaceDirectlyForCanvasDraw: true,
      routeProvidesHexGateIntentForCanvas: true,
      hexSurfaceGateExpected: true,
      canvasMustCallHexSurfacePublicApi: true,

      canvasHexGateAuthorized: true,
      pointerFingerTransmissionAuthorizedByRouteIntentOnly: true,
      directPointerFingerDeliveryByRouteAuthorized: false,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastHexGateTransmissionPacket = clonePlain(packet);
    state.packetCount += 1;
    return packet;
  }

  function composePointerFingerTransmissionPacket() {
    const packet = {
      packetType: PACKET_POINTER_PATH,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      route: ROUTE,

      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      pointerBoundaryFile: POINTER_BOUNDARY_FILE,
      pointerLightFile: POINTER_LIGHT_FILE,

      pointerSurfaceRole: "BISHOP_GATE_DOWNSTREAM_OF_HEX_SURFACE",
      pointerInspectRole: "CHILD_ORGANIZER_PRIEST_PROOF_SURFACE",
      inspectIsPrimaryChainEndpoint: false,
      routeDoesNotDeliverToPointerFingerDirectly: true,
      hexSurfaceOwnsPointerTransmission: true,
      canvasOwnsCallingHexSurface: true,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastPointerFingerTransmissionPacket = clonePlain(packet);
    state.packetCount += 1;
    return packet;
  }

  function composeCanvasHandoffPacket(options = {}) {
    const governedSourcePacket = composeGovernedSourcePacket();
    const sourceHoldPacket = composeSourceHoldPacket();
    const hexGateIntentPacket = composeHexGateTransmissionPacket();
    const pointerPathPacket = composePointerFingerTransmissionPacket();
    const surfaceScan = scanCanvasSurface();

    const packet = {
      packetType: PACKET_CANVAS_TRANSACTION,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_ROUTE_CONDUCTOR",
      sourceRole: "route-canvas-asset-transaction-coordinator",
      destinationFile: CANVAS_FILE,
      destinationRole: "canvas-visible-output-receiver-and-hex-surface-caller",
      route: ROUTE,
      targetRoute: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
      expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,

      canonicalMountSelector: "#hearthCanvasMount",
      canonicalFrameSelector: "#hearthCanvasRectLockFrame",
      canonicalCanvasSelector: "#hearthVisibleCanvas",
      canonicalChain: "#hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas",
      canvasSurfaceScan: clonePlain(surfaceScan),

      governedSourcePacket,
      sourceHoldPacket,
      hexGateIntentPacket,
      pointerPathPacket,

      canvasFirstTransactionPathActive: true,
      canvasReceiverExpected: true,
      canvasMustBindExistingCanonicalCanvas: true,
      canvasMustNotCreateCanvas: true,
      canvasMustNotRestartRuntime: true,
      canvasMayCallHexSurfacePublicApi: true,
      canvasMustNotCallPointerFingerDirectly: true,

      routeToCanvasHandoffRequested: true,
      routeCanvasPairPermissionRequested: true,
      routeCanvasPairPermissionGranted: false,
      visibleSurfacePermissionGranted: false,
      motionPermissionGranted: false,
      constructPermissionGranted: false,

      controlsRenewalAuthorizedHere: false,
      controlsDirectLoadSuppressed: true,
      controlsRequiredForVisibleSurface: false,
      controlsRequiredForMotion: true,

      pointerSurfaceIsBishopGate: true,
      pointerInspectIsChildOrganizerPriest: true,
      inspectFileNotPrimaryChainEndpoint: true,
      routeDoesNotDeliverToPointerFingerDirectly: true,

      canvasDrawingAuthorizedByRoute: false,
      canvasCreationAuthorizedByRoute: false,
      canvasLifecycleCallAuthorizedByRoute: false,
      routeRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      finalVisualPassAuthority: false,

      reason: safeString(options.reason || "CANVAS_ASSET_TRANSACTION_RESET"),
      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastCanvasHandoffPacket = clonePlain(packet);
    state.packetCount += 1;
    return packet;
  }

  function composePresentationPacket() {
    return composeCanvasHandoffPacket({ reason: "PRESENTATION_PACKET_CANVAS_FIRST" });
  }

  function composeControlHandshakePacket() {
    return {
      packetType: "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_OBSERVATION_PACKET_v10_8",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      controlFile: CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      controlSummary: readControlSummary(),
      controlsRenewalAuthorizedHere: false,
      controlsDirectLoadSuppressed: true,
      relationshipStatus: "CONTROL_HANDSHAKE_OBSERVED_ONLY_NOT_RENEWED_BY_ROUTE_CONDUCTOR",
      requiredForVisibleSurface: false,
      requiredForMotion: true,
      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composeCompatibilityReceiptV94() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      compatibilityRouteConductorContract: COMPATIBILITY_V9_4_CONTRACT,
      currentInternalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      route: ROUTE,
      file: FILE,
      canvasFile: CANVAS_FILE,
      canvasFirstTransactionPathActive: true,
      pointerInspectLegacyDemoted: true,
      ...NO_CLAIMS
    };
  }

  function attemptCanvasHandoff(reason = "attemptCanvasHandoff") {
    const canvas = readCanvasSummary();
    const authority = firstGlobal(CANVAS_ALIASES).value;
    const method = resolveMethod(authority, CANVAS_RECEIVER_METHODS);
    const packet = composeCanvasHandoffPacket({ reason });

    state.routeCanvasPairPermissionRequested = true;
    state.canvasAcceptanceScanRequested = true;

    publishRoutePackets(packet);

    if (!authority) {
      state.routeCanvasHandoffMethod = "NONE";
      state.routeCanvasHandoffStatus = "CANVAS_RECEIVER_WAITING";
      state.routeCanvasHandoffReason = "CANVAS_AUTHORITY_NOT_OBSERVED";
      state.routeCanvasPairPermissionGranted = false;
      state.canvasAcceptanceScanConfirmed = false;
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "INSTALL_CANVAS_ASSET_FILE_PAIR_SECOND";
      state.postgameStatus = "ROUTE_PACKET_PUBLISHED_WAITING_CANVAS_ASSET_RECEIVER";

      record("HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_WAITING", {
        reason,
        canvasObserved: false,
        packetPublished: true
      });

      return {
        delivered: false,
        method: "NONE",
        status: state.routeCanvasHandoffStatus,
        reason: state.routeCanvasHandoffReason,
        packet
      };
    }

    if (method === "NONE") {
      state.routeCanvasHandoffMethod = "NONE";
      state.routeCanvasHandoffStatus = "CANVAS_RECEIVER_METHOD_MISSING";
      state.routeCanvasHandoffReason = "CANVAS_AUTHORITY_OBSERVED_BUT_NO_PUBLIC_ROUTE_RECEIVER_METHOD";
      state.routeCanvasPairPermissionGranted = false;
      state.canvasAcceptanceScanConfirmed = false;
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "PUBLISH_CANVAS_PUBLIC_ROUTE_RECEIVER_METHOD";
      state.postgameStatus = "ROUTE_PACKET_PUBLISHED_CANVAS_RECEIVER_METHOD_MISSING";

      record("HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_METHOD_MISSING", {
        reason,
        canvasAuthoritySource: canvas.authoritySource,
        canvasContract: canvas.contract
      });

      return {
        delivered: false,
        method: "NONE",
        status: state.routeCanvasHandoffStatus,
        reason: state.routeCanvasHandoffReason,
        packet
      };
    }

    try {
      const result = authority[method](clonePlain(packet), {
        source: "HEARTH_ROUTE_CONDUCTOR",
        reason,
        routeCanvasPairPermissionRequested: true,
        canvasDrawingAuthorityNotGrantedByRoute: true
      });

      const accepted = !(isObject(result) && result.accepted === false);

      state.routeCanvasHandoffMethod = method;
      state.routeCanvasHandoffStatus = accepted
        ? "ROUTE_CANVAS_HANDOFF_RETURNED"
        : "ROUTE_CANVAS_HANDOFF_RETURNED_REJECTED";
      state.routeCanvasHandoffReason = accepted
        ? "CANVAS_PUBLIC_RECEIVER_RETURNED"
        : "CANVAS_PUBLIC_RECEIVER_REJECTED_PACKET";
      state.routeCanvasHandoffReturnObserved = true;
      state.routeCanvasPairPermissionGranted = accepted;
      state.canvasAcceptanceScanConfirmed = accepted;
      state.bilateralRouteCanvasScanConfirmed = accepted;
      state.visibleSurfacePermissionGranted = accepted && canvas.surfaceScan && canvas.surfaceScan.surfaceTruthReadyForCanvasAsset === true;
      state.constructPermissionGranted = accepted;
      state.recommendedNextFile = accepted ? CANVAS_FILE : CANVAS_FILE;
      state.recommendedNextAction = accepted
        ? "RUN_DIAGNOSTIC_AFTER_CANVAS_ASSET_PAIR_IS_INSTALLED"
        : "AUDIT_CANVAS_ROUTE_PACKET_REJECTION";
      state.postgameStatus = accepted
        ? "ROUTE_CANVAS_HANDOFF_DELIVERED_TO_CANVAS_ASSET_RECEIVER"
        : "ROUTE_CANVAS_HANDOFF_RETURNED_REJECTED_BY_CANVAS_ASSET";

      record("HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_RETURNED", {
        reason,
        method,
        accepted,
        canvasAuthoritySource: canvas.authoritySource,
        canvasContract: canvas.contract
      });

      if (result && isFunction(result.then)) {
        result.catch((error) => {
          recordError("HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_ASYNC_REJECTION", error, { method, reason });
        });
      }

      return {
        delivered: true,
        accepted,
        method,
        status: state.routeCanvasHandoffStatus,
        reason: state.routeCanvasHandoffReason,
        packet,
        result
      };
    } catch (error) {
      state.routeCanvasHandoffMethod = method;
      state.routeCanvasHandoffStatus = "ROUTE_CANVAS_HANDOFF_THROWN";
      state.routeCanvasHandoffReason = bounded(error && error.message ? error.message : error, 1000);
      state.routeCanvasPairPermissionGranted = false;
      state.canvasAcceptanceScanConfirmed = false;
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "AUDIT_CANVAS_PUBLIC_ROUTE_RECEIVER_THROW";
      state.postgameStatus = "ROUTE_CANVAS_HANDOFF_THROWN_BY_CANVAS_ASSET";

      recordError("HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_THROWN", error, { method, reason });

      return {
        delivered: false,
        method,
        status: state.routeCanvasHandoffStatus,
        reason: state.routeCanvasHandoffReason,
        packet
      };
    }
  }

  function publishRoutePackets(canvasPacket = null) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const handoff = canvasPacket || state.lastCanvasHandoffPacket || composeCanvasHandoffPacket({ reason: "publishRoutePackets" });
    const governed = state.lastGovernedSourcePacket || composeGovernedSourcePacket();
    const sourceHold = state.lastSourceHoldPacket || composeSourceHoldPacket();
    const hexGate = state.lastHexGateTransmissionPacket || composeHexGateTransmissionPacket();
    const pointerPath = state.lastPointerFingerTransmissionPacket || composePointerFingerTransmissionPacket();

    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_TRANSACTION_PACKET = clonePlain(handoff);
    root.HEARTH_CANVAS_HANDOFF_PACKET = clonePlain(handoff);
    root.HEARTH_ROUTE_CANVAS_HANDOFF_PACKET = clonePlain(handoff);
    root.HEARTH_GOVERNED_SOURCE_PACKET = clonePlain(governed);
    root.HEARTH_SOURCE_HOLD_PACKET = clonePlain(sourceHold);
    root.HEARTH_ROUTE_CONDUCTOR_HEX_GATE_TRANSMISSION_PACKET = clonePlain(hexGate);
    root.HEARTH_ROUTE_CONDUCTOR_POINTER_SURFACE_PATH_PACKET = clonePlain(pointerPath);

    hearth.routeConductorCanvasTransactionPacket = clonePlain(handoff);
    hearth.canvasHandoffPacket = clonePlain(handoff);
    hearth.routeCanvasHandoffPacket = clonePlain(handoff);
    hearth.governedSourcePacket = clonePlain(governed);
    hearth.sourceHoldPacket = clonePlain(sourceHold);
    hearth.routeConductorHexGateTransmissionPacket = clonePlain(hexGate);
    hearth.routeConductorPointerSurfacePathPacket = clonePlain(pointerPath);

    lab.hearthRouteConductorCanvasTransactionPacket = clonePlain(handoff);
    lab.hearthCanvasHandoffPacket = clonePlain(handoff);
    lab.hearthGovernedSourcePacket = clonePlain(governed);
    lab.hearthSourceHoldPacket = clonePlain(sourceHold);

    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:route-canvas-transaction", { detail: clonePlain(handoff) }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:route-canvas-transaction", { detail: clonePlain(handoff) }));
      }
    } catch (_error) {}

    return handoff;
  }

  function scanNode(nodeId) {
    const id = safeString(nodeId || "").toUpperCase();

    if (id.includes("CANVAS")) return readCanvasSummary();
    if (id.includes("HEX_SURFACE")) return readHexSurfaceSummary();
    if (id.includes("HEX_AUTHORITY")) return readHexAuthoritySummary();
    if (id.includes("CONTROL")) return readControlSummary();
    if (id.includes("POINTER") || id.includes("FINGER")) return readPointerFingerSummary();
    if (id.includes("INDEX")) return readIndexSummary();

    return readSourceSummary();
  }

  function scanSourceStack() {
    return {
      stack: getSourceStack(),
      index: readIndexSummary(),
      canvas: readCanvasSummary(),
      hexAuthority: readHexAuthoritySummary(),
      hexSurface: readHexSurfaceSummary(),
      controls: readControlSummary(),
      pointerFinger: readPointerFingerSummary()
    };
  }

  function runBilateralScan(options = {}) {
    state.explicitScanCount += 1;
    const result = attemptCanvasHandoff(safeString(options.reason || "runBilateralScan"));

    refresh({
      reason: "runBilateralScan",
      attemptHandoff: false
    });

    return {
      ok: result.delivered === true,
      result,
      receipt: getReceipt()
    };
  }

  function runSafePacketBridgeScan(options = {}) {
    state.explicitScanCount += 1;

    const receipt = refresh({
      reason: safeString(options.reason || "runSafePacketBridgeScan"),
      attemptHandoff: options.attemptHandoff !== false
    });

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      scanMode: "SAFE_PACKET_BRIDGE_CANVAS_FIRST",
      canvasDrawingAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      receiptObject: receipt,
      ...NO_CLAIMS
    };
  }

  function observePassive(reason = "observePassive") {
    state.passiveReadCount += 1;

    readIndexSummary();
    readCanvasSummary();
    readHexAuthoritySummary();
    readHexSurfaceSummary();
    readControlSummary();
    readPointerFingerSummary();
    publishRoutePackets();

    state.postgameStatus = "ROUTE_CONDUCTOR_PASSIVE_OBSERVATION_COMPLETE_CANVAS_FIRST";
    record("HEARTH_ROUTE_CONDUCTOR_PASSIVE_OBSERVATION_COMPLETE", { reason });

    updateDataset();

    return getReceiptLight(false);
  }

  function refresh(options = {}) {
    const reason = safeString(options.reason || "refresh");

    readIndexSummary();
    readCanvasSummary();
    readHexAuthoritySummary();
    readHexSurfaceSummary();
    readControlSummary();
    readPointerFingerSummary();

    const shouldAttemptHandoff = options.attemptHandoff === true;
    if (shouldAttemptHandoff) {
      attemptCanvasHandoff(reason);
    } else {
      publishRoutePackets();
    }

    if (state.routeCanvasHandoffStatus === "WAITING_CANVAS_ASSET" && state.canvasSummary && state.canvasSummary.observed) {
      state.routeCanvasHandoffStatus = "CANVAS_ASSET_OBSERVED_HANDOFF_NOT_ATTEMPTED";
      state.routeCanvasHandoffReason = "REFRESH_WITHOUT_HANDOFF_ATTEMPT";
    }

    updateDataset();
    publishReceiptAliases();

    return getReceiptLight(false);
  }

  function render(options = {}) {
    state.lifecycleSuppressionCount += 1;
    record("HEARTH_ROUTE_CONDUCTOR_RENDER_CALL_SUPPRESSED_TO_PACKET_REFRESH", {
      reason: options.reason || "render",
      canvasDrawingAuthorized: false
    });

    return refresh({
      reason: "render-call-suppressed",
      attemptHandoff: options.attemptHandoff === true
    });
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.postgameStatus = "ROUTE_CONDUCTOR_DISPOSED";
    state.recommendedNextAction = "REBOOT_ROUTE_CONDUCTOR_IF_CANVAS_TRANSACTION_REQUIRED";

    record("HEARTH_ROUTE_CONDUCTOR_DISPOSED", { reason });
    updateDataset();
    publishGlobals("dispose");

    return getReceipt();
  }

  function updateDataset() {
    setDataset("hearthRouteConductorPresent", "true");
    setDataset("hearthRouteConductorLoaded", "true");
    setDataset("hearthRouteConductorContract", CONTRACT);
    setDataset("hearthRouteConductorReceipt", RECEIPT);
    setDataset("hearthRouteConductorInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthRouteConductorPreviousRenewalContract", PREVIOUS_RENEWAL_CONTRACT);
    setDataset("hearthRouteConductorVersion", VERSION);

    setDataset("hearthRouteConductorFile", FILE);
    setDataset("hearthRouteConductorHtmlFile", HTML_FILE);
    setDataset("hearthRouteConductorIndexFile", INDEX_FILE);
    setDataset("hearthRouteConductorCanvasFile", CANVAS_FILE);
    setDataset("hearthRouteConductorControlFile", CONTROL_FILE);
    setDataset("hearthRouteConductorHexAuthorityFile", HEX_AUTHORITY_FILE);
    setDataset("hearthRouteConductorHexSurfaceFile", HEX_SURFACE_FILE);
    setDataset("hearthRouteConductorPointerSurfaceFile", POINTER_SURFACE_FILE);
    setDataset("hearthRouteConductorPointerInspectFile", POINTER_INSPECT_FILE);

    setDataset("hearthRouteConductorCanvasAssetTransactionResetActive", "true");
    setDataset("hearthRouteConductorCanvasFirstTransactionPathActive", "true");
    setDataset("hearthRouteConductorCanvasAssetDirectLoadAuthority", "true");
    setDataset("hearthRouteConductorControlsRenewalAuthorizedHere", "false");
    setDataset("hearthRouteConductorControlsDirectLoadSuppressed", "true");
    setDataset("hearthRouteConductorPointerSurfaceDirectLoadSuppressed", "true");
    setDataset("hearthRouteConductorInspectFileNotPrimaryChainEndpoint", "true");

    setDataset("hearthRouteConductorAssetLoadStatus", state.assetLoadStatus);
    setDataset("hearthRouteConductorMissingAssetFiles", state.missingAssetFiles.join(" | "));
    setDataset("hearthRouteConductorRouteCanvasHandoffStatus", state.routeCanvasHandoffStatus);
    setDataset("hearthRouteConductorRouteCanvasHandoffMethod", state.routeCanvasHandoffMethod);
    setDataset("hearthRouteConductorRouteCanvasPairPermissionRequested", String(state.routeCanvasPairPermissionRequested));
    setDataset("hearthRouteConductorRouteCanvasPairPermissionGranted", String(state.routeCanvasPairPermissionGranted));

    setDataset("hearthRouteConductorCanvasObserved", String(state.canvasSummary && state.canvasSummary.observed === true));
    setDataset("hearthRouteConductorCanvasReceiverReady", String(state.canvasSummary && state.canvasSummary.receiverReady === true));
    setDataset("hearthRouteConductorHexSurfaceObserved", String(state.hexSurfaceSummary && state.hexSurfaceSummary.observed === true));
    setDataset("hearthRouteConductorHexSurfaceCanvasGateReady", String(state.hexSurfaceSummary && state.hexSurfaceSummary.canvasGateReceiverReady === true));
    setDataset("hearthRouteConductorHexAuthorityObserved", String(state.hexAuthoritySummary && state.hexAuthoritySummary.observed === true));

    setDataset("hearthRouteConductorControlObservedOnly", String(state.controlSummary && state.controlSummary.observed === true));
    setDataset("hearthRouteConductorControlRenewalAuthorizedHere", "false");

    setDataset("hearthRouteConductorCanvasMountRectNonzero", String(state.canvasSurfaceScan && state.canvasSurfaceScan.mountRectNonzero === true));
    setDataset("hearthRouteConductorCanvasFrameRectNonzero", String(state.canvasSurfaceScan && state.canvasSurfaceScan.frameRectNonzero === true));
    setDataset("hearthRouteConductorCanvasRectNonzero", String(state.canvasSurfaceScan && state.canvasSurfaceScan.canvasRectNonzero === true));
    setDataset("hearthRouteConductorCanvasContext2dReady", String(state.canvasSurfaceScan && state.canvasSurfaceScan.canvasContext2dReady === true));

    setDataset("hearthRouteConductorFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthRouteConductorRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthRouteConductorRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthRouteConductorPostgameStatus", state.postgameStatus);

    setDataset("hearthRouteConductorCanvasDrawingAuthorized", "false");
    setDataset("hearthRouteConductorCanvasCreationAuthorized", "false");
    setDataset("hearthRouteConductorRuntimeRestartAuthorized", "false");
    setDataset("hearthRouteConductorFinalVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function composeDiagnosticFields() {
    const canvas = state.canvasSummary || readCanvasSummary();
    const hexSurface = state.hexSurfaceSummary || readHexSurfaceSummary();
    const hexAuthority = state.hexAuthoritySummary || readHexAuthoritySummary();
    const control = state.controlSummary || readControlSummary();
    const pointer = state.pointerFingerSummary || readPointerFingerSummary();
    const surface = state.canvasSurfaceScan || scanCanvasSurface();

    return {
      ROUTE_CONDUCTOR_FILE: FILE,
      ROUTE_CONDUCTOR_CONTRACT: CONTRACT,
      ROUTE_CONDUCTOR_RECEIPT: RECEIPT,
      ROUTE_CONDUCTOR_INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      ROUTE_CONDUCTOR_INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      ROUTE_CONDUCTOR_PREVIOUS_RENEWAL_CONTRACT: PREVIOUS_RENEWAL_CONTRACT,
      ROUTE_CONDUCTOR_VERSION: VERSION,

      HTML_FILE,
      INDEX_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      POINTER_SURFACE_FILE,
      POINTER_INSPECT_FILE,
      POINTER_FINGER_FILE: POINTER_SURFACE_FILE,
      LEGACY_POINTER_FINGER_FILE: POINTER_INSPECT_FILE,

      CANVAS_ASSET_TRANSACTION_RESET_ACTIVE: "true",
      CANVAS_FIRST_TRANSACTION_PATH_ACTIVE: "true",
      CONTROLS_RENEWAL_AUTHORIZED_HERE: "false",
      CONTROLS_DIRECT_LOAD_SUPPRESSED: "true",
      POINTER_SURFACE_DIRECT_LOAD_SUPPRESSED: "true",
      INSPECT_FILE_NOT_PRIMARY_CHAIN_ENDPOINT: "true",
      ROUTE_DOES_NOT_DELIVER_TO_POINTER_FINGER_DIRECTLY: "true",

      ASSET_LOAD_ATTEMPTED: String(state.assetLoadAttempted),
      ASSET_LOAD_STATUS: state.assetLoadStatus,
      ASSET_LOAD_COUNT: String(state.assetLoadCount),
      ASSET_LOAD_ERROR_COUNT: String(state.assetLoadErrorCount),
      FIRST_ASSET_LOAD_FAILURE_FILE: state.firstAssetLoadFailureFile,
      FIRST_ASSET_LOAD_FAILURE_REASON: state.firstAssetLoadFailureReason,
      MISSING_ASSET_FILES: state.missingAssetFiles.join(" | ") || "NONE",

      CANVAS_OBSERVED: String(canvas.observed),
      CANVAS_AUTHORITY_SOURCE: canvas.authoritySource,
      CANVAS_CONTRACT: canvas.contract,
      CANVAS_CONTRACT_RECOGNIZED: String(canvas.contractRecognized),
      CANVAS_RECEIVER_READY: String(canvas.receiverReady),
      CANVAS_RECEIVER_METHOD: canvas.receiverMethod,
      CANVAS_SCRIPT_PRESENT: String(canvas.scriptPresent),

      HEX_AUTHORITY_OBSERVED: String(hexAuthority.observed),
      HEX_AUTHORITY_SOURCE: hexAuthority.authoritySource,
      HEX_AUTHORITY_CONTRACT: hexAuthority.contract,
      HEX_AUTHORITY_RECOGNIZED: String(hexAuthority.contractRecognized),
      HEX_AUTHORITY_SCRIPT_PRESENT: String(hexAuthority.scriptPresent),

      HEX_SURFACE_OBSERVED: String(hexSurface.observed),
      HEX_SURFACE_SOURCE: hexSurface.authoritySource,
      HEX_SURFACE_CONTRACT: hexSurface.contract,
      HEX_SURFACE_RECOGNIZED: String(hexSurface.contractRecognized),
      HEX_SURFACE_CANVAS_GATE_READY: String(hexSurface.canvasGateReceiverReady),
      HEX_SURFACE_CANVAS_GATE_METHOD: hexSurface.canvasGateReceiverMethod,
      HEX_SURFACE_SCRIPT_PRESENT: String(hexSurface.scriptPresent),

      CONTROL_OBSERVED_ONLY: String(control.observed),
      CONTROL_CONTRACT: control.contract,
      CONTROL_STATUS: control.status,
      CONTROL_SCRIPT_PRESENT: String(control.scriptPresent),
      CONTROL_RENEWAL_AUTHORIZED_HERE: "false",

      POINTER_SURFACE_OBSERVED: String(pointer.pointerSurfaceObserved),
      POINTER_SURFACE_AUTHORITY_PRESENT: String(pointer.pointerSurfaceAuthorityPresent),
      POINTER_SURFACE_CONTRACT: pointer.pointerSurfaceContract,
      POINTER_SURFACE_SCRIPT_PRESENT: String(pointer.pointerSurfaceScriptPresent),
      POINTER_SURFACE_ROLE: pointer.pointerSurfaceRole,

      POINTER_INSPECT_OBSERVED: String(pointer.pointerInspectObserved),
      POINTER_INSPECT_AUTHORITY_PRESENT: String(pointer.pointerInspectAuthorityPresent),
      POINTER_INSPECT_CONTRACT: pointer.pointerInspectContract,
      POINTER_INSPECT_SCRIPT_PRESENT: String(pointer.pointerInspectScriptPresent),
      POINTER_INSPECT_ROLE: pointer.pointerInspectRole,

      CANONICAL_MOUNT_FOUND: String(surface.mountFound),
      CANONICAL_MOUNT_RECT_NONZERO: String(surface.mountRectNonzero),
      CANONICAL_FRAME_FOUND: String(surface.frameFound),
      CANONICAL_FRAME_RECT_NONZERO: String(surface.frameRectNonzero),
      CANONICAL_CANVAS_FOUND: String(surface.canvasElementFound),
      CANONICAL_CANVAS_RECT_NONZERO: String(surface.canvasRectNonzero),
      CANONICAL_CANVAS_CONTEXT_2D_READY: String(surface.canvasContext2dReady),
      CANVAS_PIXEL_READ_SUPPRESSED_FOR_ROUTE_CONDUCTOR: "true",

      ROUTE_CANVAS_PAIR_PERMISSION_REQUESTED: String(state.routeCanvasPairPermissionRequested),
      ROUTE_CANVAS_PAIR_PERMISSION_GRANTED: String(state.routeCanvasPairPermissionGranted),
      ROUTE_CANVAS_HANDOFF_STATUS: state.routeCanvasHandoffStatus,
      ROUTE_CANVAS_HANDOFF_METHOD: state.routeCanvasHandoffMethod,
      ROUTE_CANVAS_HANDOFF_REASON: state.routeCanvasHandoffReason,
      CANVAS_ACCEPTANCE_SCAN_REQUESTED: String(state.canvasAcceptanceScanRequested),
      CANVAS_ACCEPTANCE_SCAN_CONFIRMED: String(state.canvasAcceptanceScanConfirmed),
      BILATERAL_ROUTE_CANVAS_SCAN_CONFIRMED: String(state.bilateralRouteCanvasScanConfirmed),

      VISIBLE_SURFACE_PERMISSION_GRANTED: String(state.visibleSurfacePermissionGranted),
      MOTION_PERMISSION_GRANTED: String(state.motionPermissionGranted),
      CONSTRUCT_PERMISSION_GRANTED: String(state.constructPermissionGranted),

      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      POSTGAME_STATUS: state.postgameStatus,

      CANVAS_DRAWING_AUTHORIZED_BY_ROUTE: "false",
      CANVAS_CREATION_AUTHORIZED_BY_ROUTE: "false",
      CANVAS_LIFECYCLE_AUTHORIZED_BY_ROUTE: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",

      f13Claimed: "false",
      f21EligibleForNorth: "false",
      f21Claimed: "false",
      readyTextAllowed: "false",
      readyTextClaimed: "false",
      visualPassClaimed: "false",
      finalVisualPassClaimed: "false",
      generatedImage: "false",
      graphicBox: "false",
      webGL: "false",
      webgl: "false"
    };
  }

  function composeReceipt() {
    const diagnosticFields = composeDiagnosticFields();

    const notes = [
      "ROUTE_CONDUCTOR_V10_PUBLIC_CONTRACT_PRESERVED",
      "INTERNAL_V10_8_CANVAS_ASSET_TRANSACTION_RESET_ACTIVE",
      "ROUTE_POINTS_TO_CANVAS_FIRST_NOT_POINTER_INSPECT",
      "HEX_SURFACE_REMAINS_DOWNSTREAM_GATE_AFTER_CANVAS",
      "POINTER_SURFACE_ADMITTED_AS_DOWNSTREAM_BISHOP_GATE",
      "POINTER_INSPECT_DEMOTED_TO_CHILD_ORGANIZER_PRIEST",
      "INSPECT_FILE_NOT_PRIMARY_CHAIN_ENDPOINT",
      "CONTROLS_NOT_RENEWED_OR_LOADED_BY_THIS_FILE",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_CREATION",
      "NO_CANVAS_LIFECYCLE_CALL",
      "NO_CONTROL_MUTATION",
      "NO_RUNTIME_RESTART",
      "NO_FINAL_VISUAL_PASS_CLAIM"
    ];

    const receipt = {
      packetType: "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_RECEIPT_PACKET_v10_8",
      contract: CONTRACT,
      receipt: RECEIPT,
      renewalContract: INTERNAL_RENEWAL_CONTRACT,
      renewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousRenewalContract: PREVIOUS_RENEWAL_CONTRACT,
      previousRenewalReceipt: PREVIOUS_RENEWAL_RECEIPT,
      lineageV105Contract: LINEAGE_V10_5_CONTRACT,
      lineageV104Contract: LINEAGE_V10_4_CONTRACT,
      lineageV103Contract: LINEAGE_V10_3_CONTRACT,
      lineageV102Contract: LINEAGE_V10_2_CONTRACT,
      lineageV101Contract: LINEAGE_V10_1_CONTRACT,
      lineageV99Contract: LINEAGE_V9_9_CONTRACT,
      lineageV98Contract: LINEAGE_V9_8_CONTRACT,
      lineageV97Contract: LINEAGE_V9_7_CONTRACT,
      lineageV96Contract: LINEAGE_V9_6_CONTRACT,
      lineageV95Contract: LINEAGE_V9_5_CONTRACT,
      compatibilityRouteConductorContract: COMPATIBILITY_V9_4_CONTRACT,
      version: VERSION,
      route: ROUTE,
      file: FILE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerFingerFile: POINTER_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      legacyPointerFingerFile: POINTER_INSPECT_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
      expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

      activeNewsCycle: "ROUTE_TO_CANVAS_ASSET_TRANSACTION_RESET_CANVAS_FIRST",
      activeFibonacci: "F13_HELD_F21_NORTH_ONLY",
      canvasAssetTransactionResetActive: true,
      routeConductorActiveScanAuthority: true,
      canvasAssetDirectLoadAuthority: true,
      canvasFirstTransactionPathActive: true,
      controlsRenewalAuthorizedHere: false,
      controlsDirectLoadSuppressed: true,
      pointerFingerDirectLoadSuppressed: true,
      pointerSurfaceDirectLoadSuppressed: true,
      inspectFileNotPrimaryChainEndpoint: true,
      pointerSurfaceBishopPathRecognized: true,

      canvasLifecycleMethodsSuppressed: true,
      canvasDrawingSuppressed: true,
      runtimeRestartSuppressed: true,
      duplicateScriptAppendSuppressed: true,
      filePathLoadLocksActive: true,
      deepReceiptSerializationSuppressedForUi: true,
      canvasPixelReadSuppressedForRouteConductor: true,

      transmissionPath: getTransmissionPath(),
      sourceStack: getSourceStack(),

      routeCanvasPairPermissionRequested: state.routeCanvasPairPermissionRequested,
      routeCanvasPairPermissionGranted: state.routeCanvasPairPermissionGranted,
      routeCanvasHandoffReturnObserved: state.routeCanvasHandoffReturnObserved,
      routeCanvasHandoffMethod: state.routeCanvasHandoffMethod,
      routeCanvasHandoffStatus: state.routeCanvasHandoffStatus,
      routeCanvasHandoffReason: state.routeCanvasHandoffReason,

      controlsGatewayPermissionGranted: false,
      routeControlsHandshakePermissionGranted: false,
      routeHexScanPermissionGranted: false,
      hexSurfaceScanPermissionGranted: false,
      canvasAcceptanceScanRequested: state.canvasAcceptanceScanRequested,
      canvasAcceptanceScanConfirmed: state.canvasAcceptanceScanConfirmed,
      bilateralRouteCanvasScanConfirmed: state.bilateralRouteCanvasScanConfirmed,
      sourceStackObserved: state.sourceStackObserved,
      sourceStackPermissionGranted: true,
      constructPermissionGranted: state.constructPermissionGranted,
      visibleSurfacePermissionGranted: state.visibleSurfacePermissionGranted,
      motionPermissionGranted: false,

      assetLoadAttempted: state.assetLoadAttempted,
      assetLoadStatus: state.assetLoadStatus,
      assetLoadCount: state.assetLoadCount,
      assetLoadErrorCount: state.assetLoadErrorCount,
      firstAssetLoadFailureFile: state.firstAssetLoadFailureFile,
      firstAssetLoadFailureReason: state.firstAssetLoadFailureReason,
      loadedAssetFiles: state.loadedAssetFiles.slice(),
      observedAssetFiles: state.observedAssetFiles.slice(),
      missingAssetFiles: state.missingAssetFiles.slice(),

      canvasSummary: clonePlain(state.canvasSummary || {}),
      hexAuthoritySummary: clonePlain(state.hexAuthoritySummary || {}),
      hexSurfaceSummary: clonePlain(state.hexSurfaceSummary || {}),
      controlSummary: clonePlain(state.controlSummary || {}),
      pointerFingerSummary: clonePlain(state.pointerFingerSummary || {}),
      canvasSurfaceScan: clonePlain(state.canvasSurfaceScan || {}),

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
      errorCount: state.errorCount,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      diagnosticFields: clonePlain(diagnosticFields),
      ...diagnosticFields,

      ownsRoutePermissionCoordination: true,
      ownsActiveScan: true,
      ownsControlHandshakePacketComposition: true,
      ownsHexSurfaceScanPacketComposition: true,
      ownsCanvasPresentationPacketComposition: true,
      ownsCanvasDrawing: false,
      ownsCanvasDomSurface: false,
      ownsCanvasLifecycle: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexTruth: false,
      ownsHexAuthorityTruth: false,
      ownsHexSurfaceTruth: false,
      ownsPointerFingerTruth: false,
      ownsFinalVisualPassClaim: false,

      secondaryEvidenceNotes: notes.join(" | "),
      ...NO_CLAIMS,
      updatedAt: nowIso()
    };

    state.lastReceipt = clonePlain(receipt);
    state.lastReceiptText = composeReceiptTextFromObject(receipt);

    return receipt;
  }

  function getReceiptLight() {
    const receipt = state.lastReceipt || composeReceipt();

    return {
      packetType: receipt.packetType,
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      renewalContract: INTERNAL_RENEWAL_CONTRACT,
      renewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
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
      pointerFingerFile: POINTER_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      legacyPointerFingerFile: POINTER_INSPECT_FILE,

      activeNewsCycle: receipt.activeNewsCycle,
      activeFibonacci: receipt.activeFibonacci,

      canvasAssetTransactionResetActive: true,
      canvasFirstTransactionPathActive: true,
      controlsRenewalAuthorizedHere: false,
      controlsDirectLoadSuppressed: true,
      pointerSurfaceDirectLoadSuppressed: true,
      inspectFileNotPrimaryChainEndpoint: true,

      assetLoadStatus: state.assetLoadStatus,
      routeCanvasHandoffStatus: state.routeCanvasHandoffStatus,
      routeCanvasHandoffMethod: state.routeCanvasHandoffMethod,
      routeCanvasPairPermissionRequested: state.routeCanvasPairPermissionRequested,
      routeCanvasPairPermissionGranted: state.routeCanvasPairPermissionGranted,

      canvasObserved: state.canvasSummary && state.canvasSummary.observed === true,
      canvasReceiverReady: state.canvasSummary && state.canvasSummary.receiverReady === true,
      hexSurfaceObserved: state.hexSurfaceSummary && state.hexSurfaceSummary.observed === true,
      hexSurfaceCanvasGateReady: state.hexSurfaceSummary && state.hexSurfaceSummary.canvasGateReceiverReady === true,
      hexAuthorityObserved: state.hexAuthoritySummary && state.hexAuthoritySummary.observed === true,
      controlObservedOnly: state.controlSummary && state.controlSummary.observed === true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsCanvasDrawing: false,
      ownsCanvasCreation: false,
      ownsCanvasLifecycle: false,
      ownsControlsRenewal: false,
      ownsPointerFingerTruth: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    const receipt = composeReceipt();

    return {
      ...receipt,
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      lastCanvasHandoffPacket: clonePlain(state.lastCanvasHandoffPacket || {}),
      lastGovernedSourcePacket: clonePlain(state.lastGovernedSourcePacket || {}),
      lastHexGateTransmissionPacket: clonePlain(state.lastHexGateTransmissionPacket || {}),
      lastPointerFingerTransmissionPacket: clonePlain(state.lastPointerFingerTransmissionPacket || {}),
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptTextFromObject(receipt) {
    const r = isObject(receipt) ? receipt : composeReceipt();

    const fields = [
      "packetType",
      "contract",
      "receipt",
      "renewalContract",
      "renewalReceipt",
      "internalRenewalContract",
      "internalRenewalReceipt",
      "previousRenewalContract",
      "previousRenewalReceipt",
      "version",
      "route",
      "file",
      "htmlFile",
      "indexFile",
      "controlFile",
      "canvasFile",
      "hexAuthorityFile",
      "hexSurfaceFile",
      "pointerFingerFile",
      "pointerSurfaceFile",
      "pointerInspectFile",
      "legacyPointerFingerFile",
      "diagnosticRoute",
      "activeNewsCycle",
      "activeFibonacci",
      "canvasAssetTransactionResetActive",
      "canvasFirstTransactionPathActive",
      "controlsRenewalAuthorizedHere",
      "controlsDirectLoadSuppressed",
      "pointerSurfaceDirectLoadSuppressed",
      "inspectFileNotPrimaryChainEndpoint",
      "assetLoadStatus",
      "missingAssetFiles",
      "routeCanvasHandoffStatus",
      "routeCanvasHandoffMethod",
      "routeCanvasHandoffReason",
      "routeCanvasPairPermissionRequested",
      "routeCanvasPairPermissionGranted",
      "visibleSurfacePermissionGranted",
      "motionPermissionGranted",
      "constructPermissionGranted",
      "firstFailedCoordinate",
      "recommendedNextFile",
      "recommendedNextAction",
      "postgameStatus",
      "ownsCanvasDrawing",
      "ownsCanvasDomSurface",
      "ownsCanvasLifecycle",
      "ownsControlsRenewal",
      "ownsPointerFingerTruth",
      "ownsFinalVisualPassClaim",
      "secondaryEvidenceNotes",
      "updatedAt"
    ];

    return [
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_RECEIPT",
      "",
      ...fields.map((field) => line(field, r[field])),
      "",
      "DIAGNOSTIC_FIELDS",
      ...Object.keys(r.diagnosticFields || {}).map((field) => line(field, r.diagnosticFields[field])),
      "",
      "NO_CLAIMS",
      ...Object.keys(NO_CLAIMS).map((field) => line(field, false))
    ].join("\n");
  }

  function composeReceiptText() {
    const receipt = composeReceipt();
    return composeReceiptTextFromObject(receipt);
  }

  function getReceiptText() {
    if (!state.lastReceiptText) composeReceipt();
    return state.lastReceiptText;
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalRenewalContract", r.internalRenewalContract),
      line("canvasAssetTransactionResetActive", r.canvasAssetTransactionResetActive),
      line("canvasFirstTransactionPathActive", r.canvasFirstTransactionPathActive),
      line("controlsRenewalAuthorizedHere", r.controlsRenewalAuthorizedHere),
      line("assetLoadStatus", r.assetLoadStatus),
      line("canvasObserved", r.canvasObserved),
      line("canvasReceiverReady", r.canvasReceiverReady),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceCanvasGateReady", r.hexSurfaceCanvasGateReady),
      line("routeCanvasHandoffStatus", r.routeCanvasHandoffStatus),
      line("routeCanvasPairPermissionGranted", r.routeCanvasPairPermissionGranted),
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      diagnosticFields: composeDiagnosticFields()
    };
  }

  function getDebugReceipt() {
    return getReceipt();
  }

  function getCanvasHandoffPacket() {
    return clonePlain(state.lastCanvasHandoffPacket || composeCanvasHandoffPacket({ reason: "getCanvasHandoffPacket" }));
  }

  function getHandoffPacket() {
    return getCanvasHandoffPacket();
  }

  function getReleasePacket() {
    return getCanvasHandoffPacket();
  }

  function getCanvasReleasePacket() {
    return getCanvasHandoffPacket();
  }

  function getGovernedSourcePacket() {
    return clonePlain(state.lastGovernedSourcePacket || composeGovernedSourcePacket());
  }

  function getSourceHoldPacket() {
    return clonePlain(state.lastSourceHoldPacket || composeSourceHoldPacket());
  }

  function getSourceStackPacket() {
    return clonePlain(composeGovernedSourcePacket());
  }

  function getHexGateTransmissionPacket() {
    return clonePlain(state.lastHexGateTransmissionPacket || composeHexGateTransmissionPacket());
  }

  function getHexTransmissionPacket() {
    return getHexGateTransmissionPacket();
  }

  function getRouteConductorHexGateTransmissionPacket() {
    return getHexGateTransmissionPacket();
  }

  function getPointerFingerTransmissionPacket() {
    return clonePlain(state.lastPointerFingerTransmissionPacket || composePointerFingerTransmissionPacket());
  }

  function getRouteConductorPointerFingerTransmissionPacket() {
    return getPointerFingerTransmissionPacket();
  }

  function getControlHandshakePacket() {
    return composeControlHandshakePacket();
  }

  function getControlsHandshakePacket() {
    return composeControlHandshakePacket();
  }

  function getQueenControlHandshakePacket() {
    return composeControlHandshakePacket();
  }

  function getPlanetaryControlHandshakePacket() {
    return composeControlHandshakePacket();
  }

  function getRouteConductorControlHandshakePacket() {
    return composeControlHandshakePacket();
  }

  function getRouteCycleReceipt() {
    return getReceiptLight(false);
  }

  function getRoutePrimaryGateReceipt() {
    return getReceiptLight(false);
  }

  function publishApiAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of ROUTE_CONDUCTOR_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();

    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_ROUTE_CONDUCTOR_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_RECEIPT = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_RECEIPT_v10_8 = receipt;
    root.HEARTH_ROUTE_CONDUCTOR_DIAGNOSTIC_FIELDS = clonePlain(composeDiagnosticFields());

    hearth.routeConductorReceipt = receipt;
    hearth.routeConductorCanvasAssetTransactionResetReceipt = receipt;
    hearth.routeConductorDiagnosticFields = clonePlain(composeDiagnosticFields());

    lab.hearthRouteConductorReceipt = receipt;
    lab.hearthRouteConductorCanvasAssetTransactionResetReceipt = receipt;
    lab.hearthRouteConductorDiagnosticFields = clonePlain(composeDiagnosticFields());

    return true;
  }

  function publishGlobals(reason = "publishGlobals") {
    publishApiAliases();
    publishRoutePackets();
    updateDataset();
    publishReceiptAliases();

    record("HEARTH_ROUTE_CONDUCTOR_GLOBALS_PUBLISHED", {
      reason,
      contract: CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      canvasFirstTransactionPathActive: true,
      controlsRenewalAuthorizedHere: false,
      pointerSurfaceDirectLoadSuppressed: true,
      routeCanvasHandoffStatus: state.routeCanvasHandoffStatus
    });

    return true;
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "ROUTE_CONDUCTOR_BOOTING_CANVAS_ASSET_TRANSACTION_RESET";

      publishApiAliases();
      observePassive("boot-early");

      return loadMissingDirectChain({ reason: "boot-canvas-asset-transaction-reset" }).then(() => {
        refresh({
          reason: "boot-complete",
          attemptHandoff: true
        });

        state.booted = true;
        state.booting = false;

        record("HEARTH_ROUTE_CONDUCTOR_CANVAS_ASSET_TRANSACTION_RESET_BOOTED", {
          contract: CONTRACT,
          internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
          assetLoadStatus: state.assetLoadStatus,
          canvasObserved: state.canvasSummary && state.canvasSummary.observed === true,
          canvasReceiverReady: state.canvasSummary && state.canvasSummary.receiverReady === true,
          hexSurfaceObserved: state.hexSurfaceSummary && state.hexSurfaceSummary.observed === true,
          controlsRenewalAuthorizedHere: false,
          visualPassClaimed: false
        });

        publishGlobals("boot-complete");

        return getReceipt();
      });
    }).catch((error) => {
      state.booting = false;
      recordError("HEARTH_ROUTE_CONDUCTOR_BOOT_FAILED", error);
      publishGlobals("boot-failed-fallback-publication");
      return getReceipt();
    });

    return bootPromise;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    renewalContract: INTERNAL_RENEWAL_CONTRACT,
    renewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
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
    pointerFingerFile: POINTER_SURFACE_FILE,
    pointerSurfaceFile: POINTER_SURFACE_FILE,
    pointerInspectFile: POINTER_INSPECT_FILE,
    legacyPointerFingerFile: POINTER_INSPECT_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexContract: EXPECTED_INDEX_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
    expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

    boot,
    start: boot,
    init: boot,
    run: boot,
    refresh,
    render,
    dispose,

    loadMissingDirectChain,
    observePassive,
    publishApiAliases,
    publishGlobals,
    publishReceiptAliases,
    updateDataset,

    readCanvasSummary,
    readControlSummary,
    readHexAuthoritySummary,
    readHexSurfaceSummary,
    readIndexSummary,
    readPointerFingerSummary,
    readSourceStackSummary,
    readSourceSummary,
    scanCanvasSurface,
    scanNode,
    scanSourceStack,
    runBilateralScan,
    runSafePacketBridgeScan,

    composeCanvasHandoffPacket,
    composeGovernedSourcePacket,
    composeSourceHoldPacket,
    composeControlHandshakePacket,
    composeHexGateTransmissionPacket,
    composePointerFingerTransmissionPacket,
    composePresentationPacket,
    composeCompatibilityReceiptV94,
    composeReceipt,
    composeReceiptText,
    composeDiagnosticFields,

    getCanvasHandoffPacket,
    getCanvasReleasePacket,
    getControlHandshakePacket,
    getControlsHandshakePacket,
    getDebugReceipt,
    getGovernedSourcePacket,
    getHandoffPacket,
    getHexGateTransmissionPacket,
    getHexTransmissionPacket,
    getPlanetaryControlHandshakePacket,
    getPointerFingerTransmissionPacket,
    getQueenControlHandshakePacket,
    getReceipt,
    getReceiptLight,
    getReceiptText,
    getReleasePacket,
    getRouteConductorControlHandshakePacket,
    getRouteConductorHexGateTransmissionPacket,
    getRouteConductorPointerFingerTransmissionPacket,
    getRouteCycleReceipt,
    getRoutePrimaryGateReceipt,
    getSourceHoldPacket,
    getSourceStack,
    getSourceStackPacket,
    getStatusText,
    getTransmissionPath,
    getState,

    canvasAssetTransactionResetActive: true,
    routeConductorActiveScanAuthority: true,
    canvasAssetDirectLoadAuthority: true,
    canvasFirstTransactionPathActive: true,
    controlsRenewalAuthorizedHere: false,
    controlsDirectLoadSuppressed: true,
    pointerFingerDirectLoadSuppressed: true,
    pointerSurfaceDirectLoadSuppressed: true,
    inspectFileNotPrimaryChainEndpoint: true,
    pointerSurfaceBishopPathRecognized: true,
    canvasLifecycleMethodsSuppressed: true,
    canvasDrawingSuppressed: true,
    runtimeRestartSuppressed: true,

    ownsRoutePermissionCoordination: true,
    ownsActiveScan: true,
    ownsControlHandshakePacketComposition: true,
    ownsHexSurfaceScanPacketComposition: true,
    ownsCanvasPresentationPacketComposition: true,
    ownsCanvasDrawing: false,
    ownsCanvasDomSurface: false,
    ownsCanvasLifecycle: false,
    ownsControlsRenewal: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsHexTruth: false,
    ownsHexAuthorityTruth: false,
    ownsHexSurfaceTruth: false,
    ownsPointerFingerTruth: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    publishApiAliases();
    publishRoutePackets();
    updateDataset();
    publishReceiptAliases();

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
    recordError("HEARTH_ROUTE_CONDUCTOR_V10_8_INITIALIZATION_FAILED", error);

    try {
      publishApiAliases();
      updateDataset();
      publishReceiptAliases();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
