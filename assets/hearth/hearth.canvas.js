// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4
// Full-file replacement.
// Canvas Hub / canonical DOM surface receiver / visible 2D output carrier only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by route conductor, diagnostics, and receipts.
// - Add v12_4 live surface identity binding to the canonical HTML canvas chain.
// - Bind only the existing canonical DOM chain:
//   #hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas
// - Receive route-conductor canvas transaction packets through public receiver APIs.
// - Compose and deliver Canvas Hex Gate packets to Hex Surface through public APIs only.
// - Receive downstream Pointer Surface/Bishop expression packets back into Canvas through public APIs.
// - Paint visible 2D output on the canonical canvas only.
// - Publish receipts proving DOM binding, receiver readiness, Hex Surface delivery, and downstream return state.
// - Preserve Controls as absent/held unless separately renewed.
// - Preserve Hex Surface as downstream gate.
// - Preserve Pointer Surface as downstream Bishop gate.
// - Preserve Inspect as child proof/organizer, not primary endpoint.
// Does not own:
// - HTML shell geometry repair
// - Controls renewal or input authority
// - Route conductor authority
// - Hex Authority truth
// - Hex Surface truth
// - Pointer Finger truth
// - terrain/material/hydrology/elevation truth
// - final visual pass
// - ready text
// - F13 or F21 latch
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_v12_4";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4";

  const LINEAGE_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";

  const VERSION =
    "2026-06-08.hearth-canvas-hub-live-surface-identity-unified-visible-2d-output-v12-4";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const POINTER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const CANONICAL_MOUNT_SELECTOR = "#hearthCanvasMount";
  const CANONICAL_FRAME_SELECTOR = "#hearthCanvasRectLockFrame";
  const CANONICAL_CANVAS_SELECTOR = "#hearthVisibleCanvas";
  const CANONICAL_CHAIN_SELECTOR =
    "#hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RENEWAL_CANDIDATE =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_POINTER_SURFACE_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const EXPECTED_POINTER_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const CANVAS_HEX_GATE_PACKET =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_CANVAS_HEX_GATE_PACKET_v12_4";
  const CANVAS_TRANSACTION_PACKET =
    "HEARTH_CANVAS_HUB_ROUTE_CONDUCTOR_CANVAS_TRANSACTION_RECEIPT_PACKET_v12_4";
  const SURFACE_RETURN_PACKET =
    "HEARTH_CANVAS_HUB_POINTER_SURFACE_RETURN_RECEIPT_PACKET_v12_4";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByCanvas: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21ClaimedByDiagnosticRail: false,
    f21SubmittedToNorth: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByCanvas: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    controlReadyClaimed: false,
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

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F13_CANVAS_CLAIMED: false,
    F13_CLAIMED_BY_CANVAS: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_CANVAS: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_SUBMITTED_TO_NORTH: false,
    READY_TEXT_PERMISSION_GRANTED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    MOTION_READY_CLAIMED: false,
    TOUCH_READY_CLAIMED: false,
    DRAG_READY_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const CANVAS_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_CANVAS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIVER",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexRenderReceiver",
    "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "HEARTH.canvasHubHexSurfacePointerFingerTransmission",
    "HEARTH.canvasHexGatePointerFingerTransmissionReceiver",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexRenderReceiver",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubHexSurfacePointerFingerTransmission"
  ]);

  const ROUTE_CONDUCTOR_ALIAS_PATHS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH.routeConductor",
    "HEARTH.routeAuthority",
    "DEXTER_LAB.hearthRouteConductor"
  ]);

  const HEX_SURFACE_ALIAS_PATHS = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_BINDING_POINTER_TRANSMISSION",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexSurfaceCanonicalMapTupleBindingPointerTransmission",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurfaceCanonicalMapTupleBindingPointerTransmission"
  ]);

  const HEX_AUTHORITY_ALIAS_PATHS = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.pixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority"
  ]);

  const CONTROL_ALIAS_PATHS = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "HEARTH.controlsQueen",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controlsHexGatePointerFingerTransmission",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthControlAuthority",
    "DEXTER_LAB.hearthControlsQueen"
  ]);

  const POINTER_SURFACE_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthPointerFingerSurface"
  ]);

  const POINTER_INSPECT_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_RECEIVER",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerReceiver",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerReceiver"
  ]);

  const RECEIVER_METHOD_NAMES = Object.freeze([
    "receiveRouteConductorCanvasTransactionPacket",
    "consumeRouteConductorCanvasTransactionPacket",
    "acceptRouteConductorCanvasTransactionPacket",
    "receiveRouteConductorHandoffPacket",
    "receiveGovernedSourcePacket",
    "receiveCanvasHandoffPacket",
    "receivePresentationPacket",
    "receivePlanetaryViewControlPacket",
    "consumePlanetaryViewControlPacket",
    "receiveViewControlPacket",
    "consumeViewControlPacket",
    "receivePointerSurfaceExpressionPacket",
    "consumePointerSurfaceExpressionPacket",
    "acceptPointerSurfaceExpressionPacket",
    "receiveSurfaceExpressionPacket",
    "consumeSurfaceExpressionPacket",
    "acceptSurfaceExpressionPacket",
    "receiveCanvasFingerSurfacePacket",
    "receiveHexSurfaceReturnPacket",
    "receiveHexSurfaceTransmissionPacket",
    "receive",
    "mount",
    "boot",
    "init",
    "start",
    "run",
    "refresh"
  ]);

  const SAFE_RECEIPT_METHODS = Object.freeze([
    "getReceiptLight",
    "getReceipt",
    "getStatus",
    "getReport",
    "getState",
    "getSummary",
    "getReceiptText",
    "getStatusText"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    mounted: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CANVAS_V12_4_LOADED",

    canvasCreatesDom: false,
    canvasUsesCanonicalDomOnly: true,
    canvasDrawingAuthority: true,
    canvasDomSurfaceAuthority: false,
    routeAuthorityOwned: false,
    controlsOwned: false,
    controlsRenewedHere: false,
    controlsLoadedHere: false,
    hexSurfaceOwned: false,
    hexAuthorityOwned: false,
    pointerSurfaceOwned: false,
    pointerInspectOwned: false,

    canonicalMountFound: false,
    canonicalFrameFound: false,
    canonicalCanvasFound: false,
    canonicalCanvasInMount: false,
    canonicalCanvasInFrame: false,
    canonicalMountRectNonzero: false,
    canonicalFrameRectNonzero: false,
    canonicalCanvasRectNonzero: false,
    canonicalChainValid: false,
    canvasContext2dReady: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasCssWidth: 0,
    canvasCssHeight: 0,
    devicePixelRatio: 1,
    canvasPixelVisible: false,
    canvasPixelSampleStatus: "NOT_SAMPLED",
    canvasPixelUniqueColorCount: 0,
    canvasVisiblePixelCount: 0,
    firstSurfaceFailureCoordinate: "NOT_MOUNTED",

    routeConductorObserved: false,
    routeConductorSource: "NONE",
    routeConductorContract: "UNKNOWN",
    routeConductorReceipt: "UNKNOWN",
    routeConductorRecognized: false,

    controlsObserved: false,
    controlsSource: "NONE",
    controlsContract: "UNKNOWN",
    controlsReceipt: "UNKNOWN",
    controlsRecognized: false,
    controlHandshakeStatus: "CONTROL_FILE_NOT_RENEWED_BY_CANVAS",
    motionTouchStatus: "WAITING_CONTROL_FILE",
    dragStatus: "WAITING_CONTROL_FILE",
    viewControlStatus: "CONTROL_VIEW_PACKETS_OPTIONAL_RECEIVER_READY",

    hexAuthorityObserved: false,
    hexAuthoritySource: "NONE",
    hexAuthorityContract: "UNKNOWN",
    hexAuthorityReceipt: "UNKNOWN",
    hexAuthorityRecognized: false,

    hexSurfaceObserved: false,
    hexSurfaceSource: "NONE",
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceReceipt: "UNKNOWN",
    hexSurfaceRecognized: false,
    hexSurfaceMethod: "NONE",

    pointerSurfaceObserved: false,
    pointerSurfaceSource: "NONE",
    pointerSurfaceContract: "UNKNOWN",
    pointerSurfaceReceipt: "UNKNOWN",
    pointerSurfaceRecognized: false,

    pointerInspectObserved: false,
    pointerInspectSource: "NONE",
    pointerInspectContract: "UNKNOWN",
    pointerInspectReceipt: "UNKNOWN",
    pointerInspectRecognized: false,

    receiverMethodCount: 0,
    routePacketReceivedCount: 0,
    routePacketAcceptedCount: 0,
    routePacketRejectedCount: 0,
    viewPacketReceivedCount: 0,
    hexGatePacketComposedCount: 0,
    hexGateDeliveryAttemptCount: 0,
    hexGateDeliveryReturnCount: 0,
    hexGateDeliveryErrorCount: 0,
    surfaceReturnPacketReceivedCount: 0,
    surfaceReturnAcceptedCount: 0,
    surfaceReturnRejectedCount: 0,
    drawCount: 0,
    resizeCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    datasetPublishCount: 0,
    eventCount: 0,
    errorCount: 0,

    lastReceivedMethod: "NONE",
    lastReceivedAt: "",
    lastReceivedPacketType: "NONE",
    lastReceivedPacketSummary: null,
    lastAcceptedRoutePacket: null,
    lastRejectedPacket: null,
    lastRejectionReason: "",
    lastCanvasHexGatePacket: null,
    lastHexSurfaceReturn: null,
    lastHexSurfaceDeliveryResult: null,
    lastSurfaceReturnPacket: null,
    lastSurfaceExpression: null,
    lastDrawReason: "NOT_DRAWN",

    viewState: {
      yaw: 0,
      pitch: 0,
      zoom: 1,
      phase: 0,
      minPitch: -1.25,
      maxPitch: 1.25,
      minZoom: 0.55,
      maxZoom: 2.4
    },

    activeSurfaceSamples: [],
    activeSurfaceSampleCount: 0,
    activeSurfaceSource: "NONE",
    activeSurfaceStatus: "WAITING_POINTER_SURFACE_RETURN_OR_ROUTE_PACKET",

    firstFailedCoordinate: "NOT_MOUNTED",
    recommendedNextFile: HTML_FILE,
    recommendedNextAction: "CONFIRM_CANONICAL_CANVAS_DOM_CHAIN_HAS_NONZERO_RECT",
    postgameStatus: "CANVAS_LOADED_WAITING_BOOT",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  const api = {};
  let mountRef = null;
  let frameRef = null;
  let canvasRef = null;
  let ctxRef = null;
  let resizeObserver = null;
  let bootPromise = null;
  let drawScheduled = false;

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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function wrap01(value) {
    const n = safeNumber(value, 0);
    return ((n % 1) + 1) % 1;
  }

  function wrapPi(value) {
    const two = Math.PI * 2;
    const n = safeNumber(value, 0);
    return ((n + Math.PI) % two + two) % two - Math.PI;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function bounded(value, limit = 2400) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const out = value.map((entry) => packetValue(entry, "")).filter(Boolean).join(" | ");
      return out || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 20000) || fallback;
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
      event: safeString(event, "HEARTH_CANVAS_EVENT"),
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
      code: safeString(code, "HEARTH_CANVAS_ERROR"),
      message: bounded(error && error.message ? error.message : error, 1400),
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

  function safeKeys(value) {
    try {
      if (isObject(value) || isFunction(value)) return Object.keys(value);
    } catch (_error) {}
    return [];
  }

  function readField(source, keys, fallback = "") {
    const obj = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];

      const lower = key.toLowerCase();
      for (const candidate of safeKeys(obj)) {
        if (candidate.toLowerCase() === lower) {
          const value = obj[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value, 4000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }

    return "UNKNOWN";
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority)) || authority === api) return null;

    for (const method of SAFE_RECEIPT_METHODS) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function contractOf(value) {
    return firstKnown(
      readField(value, [
        "contract",
        "CONTRACT",
        "canvasContract",
        "currentCanvasParentContract",
        "routeConductorContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexSurfaceContract",
        "pointerSurfaceContract",
        "pointerFingerContract",
        "sourceContract",
        "implementationContract",
        "internalRenewalContract",
        "internalImplementationContract"
      ]),
      "UNKNOWN"
    );
  }

  function receiptOf(value) {
    return firstKnown(
      readField(value, [
        "receipt",
        "RECEIPT",
        "canvasReceipt",
        "currentCanvasParentReceipt",
        "routeConductorReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexAuthorityReceipt",
        "hexSurfaceReceipt",
        "pointerSurfaceReceipt",
        "pointerFingerReceipt",
        "sourceReceipt",
        "implementationReceipt",
        "internalRenewalReceipt",
        "internalImplementationReceipt"
      ]),
      "UNKNOWN"
    );
  }

  function summarizeAuthority(paths, family) {
    const found = firstGlobal(paths);
    const receipt = readAuthorityReceipt(found.value) || {};
    const contract = firstKnown(contractOf(receipt), contractOf(found.value), datasetContractFallback(family), "UNKNOWN");
    const receiptName = firstKnown(receiptOf(receipt), receiptOf(found.value), datasetReceiptFallback(family), "UNKNOWN");
    const keys = safeKeys(found.value);
    const methods = keys.filter((key) => isFunction(found.value && found.value[key]));

    return {
      observed: Boolean(found.value || contract !== "UNKNOWN"),
      source: found.path,
      value: found.value,
      contract,
      receipt: receiptName,
      keyCount: keys.length,
      methodCount: methods.length,
      methods
    };
  }

  function datasetContractFallback(family) {
    const ds = dataset();

    if (family === "route") {
      return firstKnown(
        ds.hearthRouteConductorContract,
        ds.routeConductorContract,
        ds.hearthRouteConductorCurrent,
        "UNKNOWN"
      );
    }

    if (family === "controls") {
      return firstKnown(
        ds.hearthControlsContract,
        ds.hearthControlContract,
        ds.controlContract,
        "UNKNOWN"
      );
    }

    if (family === "hexAuthority") {
      return firstKnown(
        ds.hearthHexAuthorityContract,
        ds.hearthHexFourPairAuthorityContract,
        ds.hearthHexFourPairPixelHandshakeAuthorityContract,
        "UNKNOWN"
      );
    }

    if (family === "hexSurface") {
      return firstKnown(
        ds.hearthHexSurfaceContract,
        ds.hexSurfaceContract,
        "UNKNOWN"
      );
    }

    if (family === "pointerSurface") {
      return firstKnown(
        ds.hearthPointerSurfaceContract,
        ds.hearthPointerFingerContract,
        "UNKNOWN"
      );
    }

    if (family === "pointerInspect") {
      return firstKnown(
        ds.hearthPointerInspectContract,
        ds.hearthPointerFingerContract,
        "UNKNOWN"
      );
    }

    return "UNKNOWN";
  }

  function datasetReceiptFallback(family) {
    const ds = dataset();

    if (family === "route") return firstKnown(ds.hearthRouteConductorReceipt, "UNKNOWN");
    if (family === "controls") return firstKnown(ds.hearthControlsReceipt, ds.hearthControlReceipt, "UNKNOWN");
    if (family === "hexAuthority") return firstKnown(ds.hearthHexAuthorityReceipt, "UNKNOWN");
    if (family === "hexSurface") return firstKnown(ds.hearthHexSurfaceReceipt, "UNKNOWN");
    if (family === "pointerSurface") return firstKnown(ds.hearthPointerSurfaceReceipt, "UNKNOWN");
    if (family === "pointerInspect") return firstKnown(ds.hearthPointerInspectReceipt, "UNKNOWN");

    return "UNKNOWN";
  }

  function contractRecognized(contract, family) {
    const text = safeString(contract);

    if (family === "route") {
      return text === EXPECTED_ROUTE_CONDUCTOR_CONTRACT || text.includes("HEARTH_ROUTE_CONDUCTOR");
    }

    if (family === "controls") {
      return text === EXPECTED_CONTROL_CONTRACT ||
        text === EXPECTED_CONTROL_RENEWAL_CANDIDATE ||
        text.includes("HEARTH_CONTROLS");
    }

    if (family === "hexAuthority") {
      return text === EXPECTED_HEX_AUTHORITY_CONTRACT ||
        text.includes("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY");
    }

    if (family === "hexSurface") {
      return text === EXPECTED_HEX_SURFACE_CONTRACT ||
        text.includes("HEARTH_HEX_SURFACE");
    }

    if (family === "pointerSurface") {
      return text === EXPECTED_POINTER_SURFACE_CONTRACT ||
        text.includes("HEARTH_CANVAS_FINGER_SURFACE") ||
        text.includes("HEARTH_POINTER_FINGER_SURFACE");
    }

    if (family === "pointerInspect") {
      return text === EXPECTED_POINTER_INSPECT_CONTRACT ||
        text.includes("HEARTH_CANVAS_FINGER_INSPECT") ||
        text.includes("HEARTH_POINTER_FINGER_INSPECT");
    }

    return false;
  }

  function refreshAuthoritySnapshots() {
    const route = summarizeAuthority(ROUTE_CONDUCTOR_ALIAS_PATHS, "route");
    state.routeConductorObserved = route.observed;
    state.routeConductorSource = route.source;
    state.routeConductorContract = route.contract;
    state.routeConductorReceipt = route.receipt;
    state.routeConductorRecognized = contractRecognized(route.contract, "route");

    const controls = summarizeAuthority(CONTROL_ALIAS_PATHS, "controls");
    state.controlsObserved = controls.observed;
    state.controlsSource = controls.source;
    state.controlsContract = controls.contract;
    state.controlsReceipt = controls.receipt;
    state.controlsRecognized = contractRecognized(controls.contract, "controls");

    const hexAuthority = summarizeAuthority(HEX_AUTHORITY_ALIAS_PATHS, "hexAuthority");
    state.hexAuthorityObserved = hexAuthority.observed;
    state.hexAuthoritySource = hexAuthority.source;
    state.hexAuthorityContract = hexAuthority.contract;
    state.hexAuthorityReceipt = hexAuthority.receipt;
    state.hexAuthorityRecognized = contractRecognized(hexAuthority.contract, "hexAuthority");

    const hexSurface = summarizeAuthority(HEX_SURFACE_ALIAS_PATHS, "hexSurface");
    state.hexSurfaceObserved = hexSurface.observed;
    state.hexSurfaceSource = hexSurface.source;
    state.hexSurfaceContract = hexSurface.contract;
    state.hexSurfaceReceipt = hexSurface.receipt;
    state.hexSurfaceRecognized = contractRecognized(hexSurface.contract, "hexSurface");
    state.hexSurfaceMethod = resolveHexSurfaceMethod(hexSurface.value) || "NONE";

    const pointerSurface = summarizeAuthority(POINTER_SURFACE_ALIAS_PATHS, "pointerSurface");
    state.pointerSurfaceObserved = pointerSurface.observed;
    state.pointerSurfaceSource = pointerSurface.source;
    state.pointerSurfaceContract = pointerSurface.contract;
    state.pointerSurfaceReceipt = pointerSurface.receipt;
    state.pointerSurfaceRecognized = contractRecognized(pointerSurface.contract, "pointerSurface");

    const pointerInspect = summarizeAuthority(POINTER_INSPECT_ALIAS_PATHS, "pointerInspect");
    state.pointerInspectObserved = pointerInspect.observed;
    state.pointerInspectSource = pointerInspect.source;
    state.pointerInspectContract = pointerInspect.contract;
    state.pointerInspectReceipt = pointerInspect.receipt;
    state.pointerInspectRecognized = contractRecognized(pointerInspect.contract, "pointerInspect");

    return {
      route,
      controls,
      hexAuthority,
      hexSurface,
      pointerSurface,
      pointerInspect
    };
  }

  function resolveHexSurfaceMethod(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

    const methods = [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "receiveInteractiveFramePacket",
      "drawInteractiveFrame",
      "drawPairFrame",
      "receive"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function query(selector) {
    if (!doc || !doc.querySelector) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function rectOf(node) {
    if (!node || !node.getBoundingClientRect) {
      return {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        nonzero: false
      };
    }

    try {
      const rect = node.getBoundingClientRect();
      const width = safeNumber(rect.width, 0);
      const height = safeNumber(rect.height, 0);

      return {
        width,
        height,
        left: safeNumber(rect.left, 0),
        top: safeNumber(rect.top, 0),
        right: safeNumber(rect.right, 0),
        bottom: safeNumber(rect.bottom, 0),
        nonzero: width > 0 && height > 0
      };
    } catch (_error) {
      return {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        nonzero: false
      };
    }
  }

  function computedVisible(node, rect) {
    if (!node || !rect || !rect.nonzero) return false;

    let style = null;
    try {
      style = root.getComputedStyle ? root.getComputedStyle(node) : null;
    } catch (_error) {
      style = null;
    }

    if (!style) return true;

    return Boolean(
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.visibility !== "collapse" &&
      safeNumber(style.opacity, 1) > 0
    );
  }

  function viewportIntersecting(rect) {
    const width = safeNumber(root.innerWidth, 0);
    const height = safeNumber(root.innerHeight, 0);

    return Boolean(
      rect &&
      rect.nonzero &&
      width > 0 &&
      height > 0 &&
      rect.left < width &&
      rect.right > 0 &&
      rect.top < height &&
      rect.bottom > 0
    );
  }

  function bindCanonicalCanvas(reason = "bind") {
    mountRef = query(CANONICAL_MOUNT_SELECTOR);
    frameRef = query(CANONICAL_FRAME_SELECTOR);
    canvasRef = query(CANONICAL_CANVAS_SELECTOR);

    const mountRect = rectOf(mountRef);
    const frameRect = rectOf(frameRef);
    const canvasRect = rectOf(canvasRef);

    state.canonicalMountFound = Boolean(mountRef);
    state.canonicalFrameFound = Boolean(frameRef);
    state.canonicalCanvasFound = Boolean(canvasRef);
    state.canonicalCanvasInMount = Boolean(mountRef && canvasRef && mountRef.contains(canvasRef));
    state.canonicalCanvasInFrame = Boolean(frameRef && canvasRef && frameRef.contains(canvasRef));
    state.canonicalMountRectNonzero = mountRect.nonzero;
    state.canonicalFrameRectNonzero = frameRect.nonzero;
    state.canonicalCanvasRectNonzero = canvasRect.nonzero;
    state.canvasCssWidth = canvasRect.width;
    state.canvasCssHeight = canvasRect.height;
    state.canvasComputedVisible = computedVisible(canvasRef, canvasRect);
    state.canvasViewportIntersecting = viewportIntersecting(canvasRect);

    state.canonicalChainValid = Boolean(
      state.canonicalMountFound &&
      state.canonicalFrameFound &&
      state.canonicalCanvasFound &&
      state.canonicalCanvasInMount &&
      state.canonicalCanvasInFrame &&
      state.canonicalMountRectNonzero &&
      state.canonicalFrameRectNonzero &&
      state.canonicalCanvasRectNonzero
    );

    ctxRef = null;
    state.canvasContext2dReady = false;

    if (canvasRef && canvasRef.getContext) {
      try {
        ctxRef = canvasRef.getContext("2d", { alpha: true, willReadFrequently: true });
      } catch (_error) {
        try {
          ctxRef = canvasRef.getContext("2d");
        } catch (error) {
          recordError("HEARTH_CANVAS_CONTEXT_2D_BIND_FAILED", error, { reason });
        }
      }

      state.canvasContext2dReady = Boolean(ctxRef);
    }

    if (canvasRef && state.canonicalCanvasRectNonzero) {
      resizeCanvasBackingStore(canvasRect);
    }

    deriveSurfaceFailureCoordinate();

    state.mounted = Boolean(state.canonicalChainValid && state.canvasContext2dReady);
    state.firstFailedCoordinate = state.mounted ? "NONE" : state.firstSurfaceFailureCoordinate;
    state.recommendedNextFile = state.mounted ? HEX_SURFACE_FILE : HTML_FILE;
    state.recommendedNextAction = state.mounted
      ? "DELIVER_ROUTE_CANVAS_TRANSACTION_PACKET_TO_HEX_SURFACE"
      : "RESTORE_CANONICAL_CANVAS_DOM_CHAIN_RECT_AND_2D_CONTEXT";
    state.postgameStatus = state.mounted
      ? "CANVAS_CANONICAL_DOM_SURFACE_BOUND_AND_READY_FOR_ROUTE_TRANSACTION"
      : "CANVAS_CANONICAL_DOM_SURFACE_NOT_READY";

    updateDataset();
    publishReceiptAliases();

    record("HEARTH_CANVAS_CANONICAL_DOM_BINDING_REFRESHED", {
      reason,
      canonicalChainValid: state.canonicalChainValid,
      mounted: state.mounted,
      canvasContext2dReady: state.canvasContext2dReady,
      firstFailedCoordinate: state.firstSurfaceFailureCoordinate
    });

    return state.mounted;
  }

  function deriveSurfaceFailureCoordinate() {
    if (!state.canonicalMountFound) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_MOUNT_NOT_FOUND";
      return;
    }

    if (!state.canonicalMountRectNonzero) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_MOUNT_RECT_NONZERO";
      return;
    }

    if (!state.canonicalFrameFound) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_FRAME_NOT_FOUND";
      return;
    }

    if (!state.canonicalFrameRectNonzero) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_FRAME_RECT_NONZERO";
      return;
    }

    if (!state.canonicalCanvasFound) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_CANVAS_NOT_FOUND";
      return;
    }

    if (!state.canonicalCanvasInMount) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_CANVAS_IN_MOUNT";
      return;
    }

    if (!state.canonicalCanvasInFrame) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_CANVAS_IN_FRAME";
      return;
    }

    if (!state.canonicalCanvasRectNonzero) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_CANVAS_RECT_NONZERO";
      return;
    }

    if (!state.canvasContext2dReady) {
      state.firstSurfaceFailureCoordinate = "CANONICAL_CANVAS_CONTEXT_2D_READY";
      return;
    }

    state.firstSurfaceFailureCoordinate = "NONE";
  }

  function resizeCanvasBackingStore(canvasRect) {
    if (!canvasRef) return false;

    const dpr = clamp(safeNumber(root.devicePixelRatio, 1), 1, 3);
    const cssWidth = Math.max(1, Math.round(safeNumber(canvasRect && canvasRect.width, canvasRef.clientWidth || 1024)));
    const cssHeight = Math.max(1, Math.round(safeNumber(canvasRect && canvasRect.height, canvasRef.clientHeight || 1024)));
    const width = Math.max(1, Math.round(cssWidth * dpr));
    const height = Math.max(1, Math.round(cssHeight * dpr));

    state.devicePixelRatio = dpr;
    state.canvasCssWidth = cssWidth;
    state.canvasCssHeight = cssHeight;

    if (canvasRef.width !== width || canvasRef.height !== height) {
      canvasRef.width = width;
      canvasRef.height = height;
      state.resizeCount += 1;
      state.canvasWidth = width;
      state.canvasHeight = height;
      return true;
    }

    state.canvasWidth = canvasRef.width;
    state.canvasHeight = canvasRef.height;
    return false;
  }

  function setupResizeObserver() {
    if (!doc || !root.ResizeObserver || !mountRef) return false;

    try {
      if (resizeObserver && isFunction(resizeObserver.disconnect)) resizeObserver.disconnect();

      resizeObserver = new root.ResizeObserver(() => {
        bindCanonicalCanvas("resize-observer");
        scheduleDraw("resize-observer");
      });

      resizeObserver.observe(mountRef);
      if (frameRef) resizeObserver.observe(frameRef);
      if (canvasRef) resizeObserver.observe(canvasRef);

      return true;
    } catch (error) {
      recordError("HEARTH_CANVAS_RESIZE_OBSERVER_FAILED", error);
      return false;
    }
  }

  function hasForbiddenClaims(packet) {
    const p = isObject(packet) ? packet : {};

    return Boolean(
      p.f13Claimed === true ||
      p.f13CanvasClaimed === true ||
      p.f13ClaimedByCanvas === true ||
      p.f21EligibleForNorth === true ||
      p.f21Claimed === true ||
      p.f21ClaimedByCanvas === true ||
      p.f21ClaimedByDiagnosticRail === true ||
      p.f21SubmittedToNorth === true ||
      p.readyTextAllowed === true ||
      p.readyTextClaimed === true ||
      p.motionReadyClaimed === true ||
      p.touchReadyClaimed === true ||
      p.dragReadyClaimed === true ||
      p.downstreamReleaseClaimed === true ||
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

  function summarizePacket(packet) {
    const p = isObject(packet) ? packet : {};

    return {
      packetType: firstKnown(p.packetType, p.type, "UNKNOWN"),
      sourceFile: firstKnown(p.sourceFile, p.fromFile, p.file, "UNKNOWN"),
      sourceAuthority: firstKnown(p.sourceAuthority, p.sourceRole, p.role, p.authority, "UNKNOWN"),
      destinationFile: firstKnown(p.destinationFile, p.targetFile, p.handoffTo, "UNKNOWN"),
      contract: firstKnown(p.contract, p.CONTRACT, p.sourceContract, "UNKNOWN"),
      receipt: firstKnown(p.receipt, p.RECEIPT, p.sourceReceipt, "UNKNOWN"),
      composedAt: firstKnown(p.composedAt, p.updatedAt, p.timestamp, "UNKNOWN"),
      hasViewState: Boolean(isObject(p.viewState)),
      hasProjectionState: Boolean(isObject(p.projectionState)),
      hasCanonicalMapTuple: Boolean(isObject(p.canonicalMapTuple)),
      keyCount: safeKeys(p).length,
      sampleKeys: safeKeys(p).slice(0, 36)
    };
  }

  function validateRoutePacket(packet, options = {}) {
    if (!isObject(packet)) return { accepted: false, reason: "PACKET_NOT_OBJECT" };
    if (hasForbiddenClaims(packet)) return { accepted: false, reason: "PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM" };

    const summary = summarizePacket(packet);
    const sourceFile = safeString(summary.sourceFile);
    const sourceAuthority = safeString(summary.sourceAuthority);
    const packetType = safeString(summary.packetType);
    const contract = safeString(summary.contract);

    const routeLike =
      sourceFile === ROUTE_CONDUCTOR_FILE ||
      sourceFile.endsWith("/showroom/globe/hearth/hearth.js") ||
      sourceAuthority.toUpperCase().includes("ROUTE") ||
      packetType.toUpperCase().includes("ROUTE") ||
      packetType.toUpperCase().includes("CANVAS") ||
      contract.includes("HEARTH_ROUTE_CONDUCTOR") ||
      options.allowDirect === true;

    const canvasTargeted =
      packetType.toUpperCase().includes("CANVAS") ||
      safeString(packet.handoffTo || "").toUpperCase().includes("CANVAS") ||
      safeString(packet.destinationFile || packet.targetFile || "").endsWith("/assets/hearth/hearth.canvas.js") ||
      packet.canvasDeliveryAuthorized !== false ||
      options.allowDirect === true;

    if (!routeLike) return { accepted: false, reason: "PACKET_SOURCE_NOT_ROUTE_CONDUCTOR_OR_CANVAS_TRANSACTION" };
    if (!canvasTargeted) return { accepted: false, reason: "PACKET_DOES_NOT_TARGET_CANVAS_RECEIVER" };

    return { accepted: true, reason: "ROUTE_CANVAS_TRANSACTION_PACKET_ACCEPTED" };
  }

  function receiveRoutePacket(packet, method, options = {}) {
    state.routePacketReceivedCount += 1;
    state.lastReceivedMethod = method;
    state.lastReceivedAt = nowIso();
    state.lastReceivedPacketType = firstKnown(packet && packet.packetType, packet && packet.type, "UNKNOWN");
    state.lastReceivedPacketSummary = summarizePacket(packet);

    const valid = validateRoutePacket(packet, options);

    if (!valid.accepted) {
      state.routePacketRejectedCount += 1;
      state.lastRejectedPacket = clonePlain(packet || null);
      state.lastRejectionReason = valid.reason;
      state.firstFailedCoordinate = valid.reason;
      state.recommendedNextFile = ROUTE_CONDUCTOR_FILE;
      state.recommendedNextAction = "SEND_LAWFUL_ROUTE_CONDUCTOR_CANVAS_TRANSACTION_PACKET";
      state.postgameStatus = "CANVAS_REJECTED_ROUTE_PACKET";
      record("HEARTH_CANVAS_ROUTE_PACKET_REJECTED", { method, reason: valid.reason });
      publishReceiptAliases();
      updateDataset();
      return getReceiptLight(false);
    }

    state.routePacketAcceptedCount += 1;
    state.lastAcceptedRoutePacket = clonePlain(packet);
    state.lastRejectionReason = "";

    bindCanonicalCanvas(`receive-route:${method}`);
    normalizeViewStateFromPacket(packet, method);

    const surfaceSamples = extractSurfaceSamples(packet);
    if (surfaceSamples.length) {
      state.activeSurfaceSamples = surfaceSamples;
      state.activeSurfaceSampleCount = surfaceSamples.length;
      state.activeSurfaceSource = `ROUTE_PACKET:${method}`;
      state.activeSurfaceStatus = "ROUTE_PACKET_SURFACE_SAMPLES_AVAILABLE";
    }

    const drawResult = drawVisibleFrame(`route-packet:${method}`);
    const hexPacket = composeCanvasHexGatePacket(packet, {
      receiver: method,
      drawResult,
      routePacketValidationReason: valid.reason
    });
    const hexResult = deliverCanvasHexGatePacket(hexPacket);

    state.postgameStatus = hexResult.returned
      ? "CANVAS_ACCEPTED_ROUTE_PACKET_DREW_VISIBLE_OUTPUT_AND_HEX_SURFACE_RETURNED"
      : "CANVAS_ACCEPTED_ROUTE_PACKET_DREW_VISIBLE_OUTPUT_HEX_SURFACE_WAITING_OR_NOT_OBSERVED";

    record("HEARTH_CANVAS_ROUTE_PACKET_ACCEPTED", {
      method,
      routePacketType: state.lastReceivedPacketType,
      canonicalChainValid: state.canonicalChainValid,
      drawStatus: drawResult.status,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceMethod: state.hexSurfaceMethod,
      hexDeliveryStatus: hexResult.status
    });

    publishReceiptAliases();
    updateDataset();

    return {
      ...getReceiptLight(false),
      accepted: true,
      packetType: CANVAS_TRANSACTION_PACKET,
      receiver: method,
      canvasHexGatePacket: clonePlain(hexPacket),
      hexSurfaceDelivery: clonePlain(hexResult),
      drawResult: clonePlain(drawResult),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function normalizeViewStateFromPacket(packet = {}, method = "packet") {
    const source = isObject(packet.viewState) ? packet.viewState : packet;
    const current = state.viewState;

    const deltaYaw = safeNumber(packet.deltaYaw, 0);
    const deltaPitch = safeNumber(packet.deltaPitch, 0);
    const deltaZoom = safeNumber(packet.deltaZoom, 0);

    const hasAbsoluteYaw = source.yaw !== undefined;
    const hasAbsolutePitch = source.pitch !== undefined;
    const hasAbsoluteZoom = source.zoom !== undefined;

    const yaw = hasAbsoluteYaw
      ? safeNumber(source.yaw, current.yaw)
      : current.yaw + deltaYaw;

    const pitch = hasAbsolutePitch
      ? safeNumber(source.pitch, current.pitch)
      : current.pitch + deltaPitch;

    let zoom = hasAbsoluteZoom
      ? safeNumber(source.zoom, current.zoom)
      : current.zoom;

    if (deltaZoom) zoom += deltaZoom;

    if (packet.rawWheelY !== undefined) {
      zoom *= Math.exp(-safeNumber(packet.rawWheelY, 0) * 0.001);
    }

    current.yaw = wrapPi(yaw);
    current.pitch = clamp(pitch, current.minPitch, current.maxPitch);
    current.zoom = clamp(zoom, current.minZoom, current.maxZoom);
    current.phase = safeNumber(source.phase, current.phase);

    record("HEARTH_CANVAS_VIEW_STATE_UPDATED", {
      method,
      yaw: current.yaw,
      pitch: current.pitch,
      zoom: current.zoom,
      phase: current.phase,
      controlsOwned: false,
      controlsRenewedHere: false
    });

    return clonePlain(current);
  }

  function composeCanvasHexGatePacket(routePacket = {}, options = {}) {
    refreshAuthoritySnapshots();

    state.hexGatePacketComposedCount += 1;

    const viewState = clonePlain(state.viewState);
    const center = viewStateToCanonicalCenter(viewState);
    const packet = {
      packetType: CANVAS_HEX_GATE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-hub-live-surface-identity-visible-2d-output-carrier",
      destinationFile: HEX_SURFACE_FILE,
      handoffTo: "HEARTH_HEX_SURFACE",

      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,

      receiverMethod: options.receiver || "UNKNOWN",
      routePacketValidationReason: options.routePacketValidationReason || "UNKNOWN",
      originalRoutePacketType: firstKnown(routePacket.packetType, routePacket.type, "UNKNOWN"),
      originalRoutePacketSummary: summarizePacket(routePacket),

      canvasHexGateAuthorized: true,
      hexSurfaceGateAuthorized: true,
      pointerFingerTransmissionAuthorized: true,
      canvasDeliveryAuthorized: true,
      visibleSurfacePermissionGrantedByCanvas: state.canonicalChainValid && state.canvasContext2dReady,
      routeCanvasPairPermissionGrantedByCanvas: state.canonicalChainValid && state.canvasContext2dReady,
      constructPermissionGrantedByCanvas: state.canonicalChainValid && state.canvasContext2dReady,
      motionPermissionGranted: false,

      canonicalMountSelector: CANONICAL_MOUNT_SELECTOR,
      canonicalFrameSelector: CANONICAL_FRAME_SELECTOR,
      canonicalCanvasSelector: CANONICAL_CANVAS_SELECTOR,
      canonicalChainSelector: CANONICAL_CHAIN_SELECTOR,
      canonicalMountFound: state.canonicalMountFound,
      canonicalFrameFound: state.canonicalFrameFound,
      canonicalCanvasFound: state.canonicalCanvasFound,
      canonicalCanvasInMount: state.canonicalCanvasInMount,
      canonicalCanvasInFrame: state.canonicalCanvasInFrame,
      canonicalMountRectNonzero: state.canonicalMountRectNonzero,
      canonicalFrameRectNonzero: state.canonicalFrameRectNonzero,
      canonicalCanvasRectNonzero: state.canonicalCanvasRectNonzero,
      canonicalChainValid: state.canonicalChainValid,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasCssWidth: state.canvasCssWidth,
      canvasCssHeight: state.canvasCssHeight,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorSource: state.routeConductorSource,
      routeConductorContract: state.routeConductorContract,
      routeConductorRecognized: state.routeConductorRecognized,

      controlsObserved: state.controlsObserved,
      controlsSource: state.controlsSource,
      controlsContract: state.controlsContract,
      controlsRecognized: state.controlsRecognized,
      controlsRenewedHere: false,
      controlsLoadedHere: false,
      controlHandshakeStatus: state.controlHandshakeStatus,

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityRecognized: state.hexAuthorityRecognized,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceRecognized: state.hexSurfaceRecognized,

      pointerSurfaceObserved: state.pointerSurfaceObserved,
      pointerSurfaceSource: state.pointerSurfaceSource,
      pointerSurfaceContract: state.pointerSurfaceContract,
      pointerSurfaceRecognized: state.pointerSurfaceRecognized,
      pointerSurfaceIsBishopGate: true,
      pointerInspectObserved: state.pointerInspectObserved,
      pointerInspectSource: state.pointerInspectSource,
      pointerInspectContract: state.pointerInspectContract,
      pointerInspectRecognized: state.pointerInspectRecognized,
      pointerInspectIsPrimaryEndpoint: false,
      pointerInspectIsChildOrganizer: true,

      viewState,
      yaw: viewState.yaw,
      pitch: viewState.pitch,
      zoom: viewState.zoom,
      phase: viewState.phase,

      canonicalMapTuple: clonePlain(firstCanonicalMapTuple(routePacket) || center),
      mapTuple: clonePlain(firstCanonicalMapTuple(routePacket) || center),
      coord: {
        u: center.u,
        v: center.v,
        lon: center.lon,
        lat: center.lat,
        x: center.x,
        y: center.y,
        z: center.z
      },
      u: center.u,
      v: center.v,
      lon: center.lon,
      lat: center.lat,
      x: center.x,
      y: center.y,
      z: center.z,

      surfaceSamples: clonePlain(state.activeSurfaceSamples.slice(0, 240)),
      surfaceSampleCount: state.activeSurfaceSampleCount,
      activeSurfaceSource: state.activeSurfaceSource,
      activeSurfaceStatus: state.activeSurfaceStatus,

      projectionState: {
        renderer: "canonical-visible-2d-canvas-output",
        canvasOwns2dOutput: true,
        canvasOwnsTruth: false,
        hexSurfaceReceivesPacket: true,
        pointerRightTurnsGlobeRight: true,
        pointerUpTurnsGlobeUp: true,
        pointerDownTurnsGlobeDown: true,
        verticalDragPolarityCorrected: true,
        horizontalPolarityPreserved: true,
        canvasMustNotCounterInvertVertical: true,
        noWebGL: true
      },

      drawResult: clonePlain(options.drawResult || {}),
      originalPacket: clonePlain(routePacket),
      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastCanvasHexGatePacket = clonePlain(packet);
    publishTransmissionPacketGlobals(packet);

    return packet;
  }

  function firstCanonicalMapTuple(packet) {
    if (!isObject(packet)) return null;

    const candidates = [
      packet.canonicalMapTuple,
      packet.mapTuple,
      packet.hexMapTuple,
      packet.coord,
      packet.coordinate,
      packet.surfaceCoordinate,
      packet.surfaceCoord,
      packet.cell
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return clonePlain(candidate);
    }

    return null;
  }

  function viewStateToCanonicalCenter(viewState = state.viewState) {
    const yaw = safeNumber(viewState.yaw, 0);
    const pitch = safeNumber(viewState.pitch, 0);

    const lon = ((yaw / Math.PI) * 180 + 540) % 360 - 180;
    const lat = clamp((pitch / Math.PI) * 180, -90, 90);
    const u = wrap01((lon + 180) / 360);
    const v = clamp01((90 - lat) / 180);
    const lonRad = lon * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const cosLat = Math.cos(latRad);

    return {
      tupleType: "HEARTH_CANVAS_VIEW_STATE_CENTER_CANONICAL_MAP_TUPLE",
      mapBindingStatus: "CANVAS_VIEW_STATE_CENTER_DERIVED_FOR_HEX_SURFACE",
      mapBindingSource: "CANVAS_VIEW_STATE",
      u,
      v,
      lon,
      lat,
      x: Math.sin(lonRad) * cosLat,
      y: Math.sin(latRad),
      z: Math.cos(lonRad) * cosLat,
      cellId: "CANVAS_VIEW_CENTER",
      stateId: "CANVAS_VIEW_CENTER",
      row: "UNKNOWN",
      column: "UNKNOWN",
      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function deliverCanvasHexGatePacket(packet) {
    refreshAuthoritySnapshots();

    state.hexGateDeliveryAttemptCount += 1;

    const found = firstGlobal(HEX_SURFACE_ALIAS_PATHS);
    const hexSurface = found.value;
    const method = resolveHexSurfaceMethod(hexSurface);

    if (!hexSurface || !method) {
      const result = {
        returned: false,
        status: "HEX_SURFACE_NOT_OBSERVED_OR_PUBLIC_RECEIVER_MISSING",
        method: "NONE",
        source: found.path,
        reason: "CANVAS_DID_NOT_LOAD_HEX_SURFACE_DIRECTLY",
        attemptedAt: nowIso()
      };

      state.lastHexSurfaceDeliveryResult = result;
      state.firstFailedCoordinate = "HEX_SURFACE_PUBLIC_RECEIVER_NOT_AVAILABLE";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "ENSURE_HEX_SURFACE_IS_LOADED_BY_EXISTING_ROUTE_CHAIN";
      state.postgameStatus = "CANVAS_HEX_GATE_PACKET_PUBLISHED_WAITING_HEX_SURFACE";
      publishTransmissionPacketGlobals(packet);

      return result;
    }

    try {
      const output = hexSurface[method](clonePlain(packet), {
        source: "HEARTH_CANVAS_HUB",
        callerFile: FILE,
        receiver: method,
        noCanvasLifecycleCall: true,
        noFinalVisualPassClaim: true
      });

      state.hexGateDeliveryReturnCount += 1;

      const result = {
        returned: true,
        status: "HEX_SURFACE_PUBLIC_RECEIVER_RETURNED",
        method,
        source: found.path,
        resultObserved: isObject(output),
        returnedAt: nowIso(),
        resultSummary: summarizePacket(isObject(output) ? output : {})
      };

      state.lastHexSurfaceReturn = clonePlain(output || null);
      state.lastHexSurfaceDeliveryResult = result;
      state.firstFailedCoordinate = "NONE";
      state.recommendedNextFile = POINTER_SURFACE_FILE;
      state.recommendedNextAction = "VERIFY_POINTER_SURFACE_BISHOP_RECEIVES_HEX_SURFACE_CANONICAL_MAP_TUPLE_TRANSMISSION";
      state.postgameStatus = "CANVAS_HEX_GATE_DELIVERED_TO_HEX_SURFACE";

      return result;
    } catch (error) {
      state.hexGateDeliveryErrorCount += 1;
      recordError("HEARTH_CANVAS_HEX_SURFACE_DELIVERY_FAILED", error, {
        method,
        source: found.path
      });

      const result = {
        returned: false,
        status: "HEX_SURFACE_PUBLIC_RECEIVER_THROWN",
        method,
        source: found.path,
        error: bounded(error && error.message ? error.message : error, 1200),
        returnedAt: nowIso()
      };

      state.lastHexSurfaceDeliveryResult = result;
      state.firstFailedCoordinate = "HEX_SURFACE_PUBLIC_RECEIVER_THROWN";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "AUDIT_HEX_SURFACE_PUBLIC_CANVAS_GATE_RECEIVER";
      state.postgameStatus = "CANVAS_HEX_GATE_DELIVERY_ERROR";

      return result;
    } finally {
      publishReceiptAliases();
      updateDataset();
    }
  }

  function publishTransmissionPacketGlobals(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet || {});

    root.HEARTH_CANVAS_LAST_HEX_GATE_PACKET = cloned;
    root.HEARTH_CANVAS_HEX_GATE_PACKET = cloned;
    root.HEARTH_CANVAS_HUB_LAST_CANVAS_HEX_GATE_PACKET = cloned;

    hearth.canvasLastHexGatePacket = cloned;
    hearth.canvasHexGatePacket = cloned;
    hearth.canvasHubLastCanvasHexGatePacket = cloned;

    lab.hearthCanvasLastHexGatePacket = cloned;
    lab.hearthCanvasHexGatePacket = cloned;
  }

  function receiveSurfaceReturnPacket(packet, method, options = {}) {
    state.surfaceReturnPacketReceivedCount += 1;
    state.lastReceivedMethod = method;
    state.lastReceivedAt = nowIso();
    state.lastReceivedPacketType = firstKnown(packet && packet.packetType, packet && packet.type, "UNKNOWN");
    state.lastReceivedPacketSummary = summarizePacket(packet);

    if (!isObject(packet)) {
      state.surfaceReturnRejectedCount += 1;
      state.lastRejectionReason = "SURFACE_RETURN_PACKET_NOT_OBJECT";
      return getReceiptLight(false);
    }

    if (hasForbiddenClaims(packet)) {
      state.surfaceReturnRejectedCount += 1;
      state.lastRejectionReason = "SURFACE_RETURN_PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM";
      return getReceiptLight(false);
    }

    state.surfaceReturnAcceptedCount += 1;
    state.lastSurfaceReturnPacket = clonePlain(packet);
    state.lastRejectionReason = "";

    const samples = extractSurfaceSamples(packet);
    if (samples.length) {
      state.activeSurfaceSamples = samples;
      state.activeSurfaceSampleCount = samples.length;
      state.activeSurfaceSource = `POINTER_SURFACE_RETURN:${method}`;
      state.activeSurfaceStatus = "POINTER_SURFACE_RETURN_SAMPLES_ACCEPTED";
    } else {
      state.activeSurfaceSource = `POINTER_SURFACE_RETURN:${method}`;
      state.activeSurfaceStatus = "POINTER_SURFACE_RETURN_ACCEPTED_NO_SAMPLE_ARRAY";
    }

    state.lastSurfaceExpression = clonePlain({
      packetType: firstKnown(packet.packetType, packet.type, "UNKNOWN"),
      method,
      sampleCount: samples.length,
      canonicalMapTuple: firstCanonicalMapTuple(packet),
      receivedAt: nowIso()
    });

    bindCanonicalCanvas(`surface-return:${method}`);
    const drawResult = drawVisibleFrame(`surface-return:${method}`);

    state.recommendedNextFile = state.canonicalChainValid ? HEX_SURFACE_FILE : HTML_FILE;
    state.recommendedNextAction = state.canonicalChainValid
      ? "CONTINUE_ROUTE_TO_CANVAS_TO_HEX_SURFACE_TO_POINTER_SURFACE_TRANSACTION"
      : "RESTORE_CANONICAL_CANVAS_DOM_SURFACE";
    state.postgameStatus = "CANVAS_RECEIVED_POINTER_SURFACE_RETURN_AND_DREW_VISIBLE_2D_OUTPUT";

    record("HEARTH_CANVAS_POINTER_SURFACE_RETURN_ACCEPTED", {
      method,
      sampleCount: samples.length,
      drawStatus: drawResult.status,
      canvasPixelVisible: state.canvasPixelVisible
    });

    publishReceiptAliases();
    updateDataset();

    return {
      ...getReceiptLight(false),
      packetType: SURFACE_RETURN_PACKET,
      accepted: true,
      receiver: method,
      drawResult,
      sampleCount: samples.length,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function extractSurfaceSamples(packet) {
    if (!isObject(packet)) return [];

    const arrays = [
      packet.surfaceSamples,
      packet.samples,
      packet.cells,
      packet.surfaceCells,
      packet.mapCells,
      packet.points,
      packet.surfacePoints,
      packet.pixelSamples,
      packet.materialSamples,
      packet.terrainSamples,
      packet.hexFramePacket && packet.hexFramePacket.surfaceSamples,
      packet.hexFramePacket && packet.hexFramePacket.samples,
      packet.originalPacket && packet.originalPacket.surfaceSamples,
      packet.originalPacket && packet.originalPacket.samples
    ];

    for (const list of arrays) {
      if (Array.isArray(list) && list.length) {
        return list
          .filter((entry) => isObject(entry))
          .slice(0, 1200)
          .map(normalizeSample)
          .filter(Boolean);
      }
    }

    const tuple = firstCanonicalMapTuple(packet);
    if (tuple) {
      const sample = normalizeSample(tuple);
      return sample ? [sample] : [];
    }

    return [];
  }

  function normalizeSample(sample) {
    if (!isObject(sample)) return null;

    const coord = isObject(sample.coord) ? sample.coord : sample;

    const lon = firstNumber(
      coord.lon,
      coord.longitude,
      coord.mapLon,
      coord.sourceLon,
      coord.u !== undefined ? safeNumber(coord.u, 0.5) * 360 - 180 : undefined
    );

    const lat = firstNumber(
      coord.lat,
      coord.latitude,
      coord.mapLat,
      coord.sourceLat,
      coord.v !== undefined ? 90 - safeNumber(coord.v, 0.5) * 180 : undefined
    );

    const u = coord.u !== undefined || coord.mapU !== undefined || coord.sourceU !== undefined
      ? wrap01(firstNumber(coord.u, coord.mapU, coord.sourceU, 0.5))
      : wrap01((lon + 180) / 360);

    const v = coord.v !== undefined || coord.mapV !== undefined || coord.sourceV !== undefined
      ? clamp01(firstNumber(coord.v, coord.mapV, coord.sourceV, 0.5))
      : clamp01((90 - lat) / 180);

    const value = firstNumber(
      sample.value,
      sample.intensity,
      sample.weight,
      sample.elevation,
      sample.height,
      sample.alpha,
      1
    );

    const material = firstKnown(
      sample.material,
      sample.materialClass,
      sample.terrain,
      sample.terrainClass,
      sample.className,
      sample.stateClass,
      sample.kind,
      "surface"
    );

    const water =
      /water|ocean|sea|lake|basin|river|channel/i.test(material) ||
      sample.water === true ||
      sample.ocean === true;

    const land =
      /land|rock|terrain|shelf|ridge|mount|soil|dry|continent/i.test(material) ||
      sample.land === true ||
      sample.body === true;

    return {
      u,
      v,
      lon: clamp(lon, -180, 180),
      lat: clamp(lat, -90, 90),
      value,
      material,
      water,
      land,
      cellId: firstKnown(sample.cellId, sample.hexId, sample.id, "UNKNOWN"),
      stateId: firstKnown(sample.stateId, sample.state, "UNKNOWN")
    };
  }

  function firstNumber(...values) {
    for (const value of values) {
      const n = Number(value);
      if (Number.isFinite(n)) return n;
    }

    return 0;
  }

  function scheduleDraw(reason = "schedule") {
    if (drawScheduled) return false;
    drawScheduled = true;

    const raf = root.requestAnimationFrame || ((fn) => setTimeout(fn, 16));

    raf(() => {
      drawScheduled = false;
      drawVisibleFrame(reason);
    });

    return true;
  }

  function drawVisibleFrame(reason = "draw") {
    bindCanonicalCanvas(`draw:${reason}`);

    if (!state.canonicalChainValid || !ctxRef || !canvasRef) {
      state.lastDrawReason = `DRAW_SKIPPED:${state.firstSurfaceFailureCoordinate}`;
      state.canvasPixelVisible = false;
      state.canvasPixelSampleStatus = "DRAW_SKIPPED_CANONICAL_SURFACE_NOT_READY";

      return {
        ok: false,
        status: "DRAW_SKIPPED_CANONICAL_SURFACE_NOT_READY",
        reason: state.firstSurfaceFailureCoordinate,
        canvasPixelVisible: false
      };
    }

    const ctx = ctxRef;
    const width = canvasRef.width;
    const height = canvasRef.height;
    const min = Math.min(width, height);
    const cx = width / 2;
    const cy = height / 2;
    const radius = min * 0.44 * state.viewState.zoom;

    try {
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      drawSpace(ctx, width, height);
      drawGlobeBase(ctx, cx, cy, radius);
      drawSurfaceSamples(ctx, cx, cy, radius);
      drawTerminatorAndRim(ctx, cx, cy, radius);

      ctx.restore();

      state.drawCount += 1;
      state.lastDrawReason = reason;

      const pixel = inspectCanvasPixels();
      state.canvasPixelVisible = pixel.visible;
      state.canvasPixelSampleStatus = pixel.status;
      state.canvasPixelUniqueColorCount = pixel.uniqueColorCount;
      state.canvasVisiblePixelCount = pixel.visiblePixelCount;

      publishReceiptAliases();
      updateDataset();

      return {
        ok: true,
        status: "VISIBLE_2D_OUTPUT_DRAWN_ON_CANONICAL_CANVAS",
        reason,
        canvasPixelVisible: state.canvasPixelVisible,
        canvasPixelSampleStatus: state.canvasPixelSampleStatus,
        drawCount: state.drawCount,
        sampleCount: state.activeSurfaceSampleCount,
        ...NO_CLAIMS
      };
    } catch (error) {
      try {
        ctx.restore();
      } catch (_restoreError) {}

      recordError("HEARTH_CANVAS_DRAW_VISIBLE_FRAME_FAILED", error, { reason });

      state.lastDrawReason = "DRAW_ERROR";
      state.canvasPixelVisible = false;
      state.canvasPixelSampleStatus = "DRAW_ERROR";
      state.firstFailedCoordinate = "CANVAS_2D_DRAW_ERROR";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "AUDIT_CANVAS_VISIBLE_2D_OUTPUT_DRAW_PATH";

      return {
        ok: false,
        status: "DRAW_ERROR",
        reason: bounded(error && error.message ? error.message : error, 1200),
        canvasPixelVisible: false
      };
    }
  }

  function drawSpace(ctx, width, height) {
    const g = ctx.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.65);
    g.addColorStop(0, "rgba(24,44,61,0.56)");
    g.addColorStop(0.45, "rgba(5,12,20,0.96)");
    g.addColorStop(1, "rgba(1,3,6,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 44; i += 1) {
      const x = ((i * 97) % 997) / 997 * width;
      const y = ((i * 53) % 991) / 991 * height;
      const r = 0.7 + ((i * 13) % 7) * 0.18;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(205,226,255,0.42)";
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGlobeBase(ctx, cx, cy, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(
      cx - radius * 0.28,
      cy - radius * 0.34,
      radius * 0.05,
      cx,
      cy,
      radius
    );
    ocean.addColorStop(0, "rgba(105,170,210,1)");
    ocean.addColorStop(0.34, "rgba(33,91,130,1)");
    ocean.addColorStop(0.72, "rgba(12,46,82,1)");
    ocean.addColorStop(1, "rgba(3,17,34,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    drawCarrierContinents(ctx, cx, cy, radius);
    drawLatitudeLongitudeLines(ctx, cx, cy, radius);

    ctx.restore();
  }

  function drawCarrierContinents(ctx, cx, cy, radius) {
    const yaw = state.viewState.yaw;
    const pitch = state.viewState.pitch;

    const continents = [
      [[-125, 52], [-96, 64], [-62, 48], [-76, 22], [-106, 15], [-132, 32]],
      [[-78, 12], [-48, 4], [-42, -26], [-64, -55], [-82, -30]],
      [[-12, 58], [32, 64], [76, 48], [100, 20], [48, 4], [2, 22]],
      [[18, 32], [44, 16], [38, -22], [20, -36], [2, -8]],
      [[70, 28], [116, 32], [146, 2], [120, -18], [76, -8]],
      [[112, -16], [154, -22], [146, -44], [116, -38]],
      [[-24, -64], [38, -70], [108, -66], [168, -72], [78, -82], [-74, -78]]
    ];

    ctx.save();

    for (const poly of continents) {
      const projected = poly
        .map(([lon, lat]) => projectLonLat(lon, lat, cx, cy, radius, yaw, pitch))
        .filter((point) => point.visible);

      if (projected.length < 3) continue;

      ctx.beginPath();
      projected.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();

      const land = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.22, radius * 0.1, cx, cy, radius);
      land.addColorStop(0, "rgba(167,140,86,0.92)");
      land.addColorStop(0.52, "rgba(100,105,70,0.9)");
      land.addColorStop(1, "rgba(40,63,50,0.86)");
      ctx.fillStyle = land;
      ctx.fill();

      ctx.lineWidth = Math.max(1, radius * 0.008);
      ctx.strokeStyle = "rgba(226,205,148,0.42)";
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawSurfaceSamples(ctx, cx, cy, radius) {
    const samples = state.activeSurfaceSamples || [];
    if (!samples.length) return;

    const yaw = state.viewState.yaw;
    const pitch = state.viewState.pitch;

    ctx.save();

    for (const sample of samples.slice(0, 900)) {
      const point = projectLonLat(sample.lon, sample.lat, cx, cy, radius, yaw, pitch);
      if (!point.visible) continue;

      const size = clamp(radius * 0.006 * (0.75 + Math.abs(sample.value || 1)), 1.2, radius * 0.022);

      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);

      if (sample.water) {
        ctx.fillStyle = "rgba(79,159,215,0.68)";
      } else if (sample.land) {
        ctx.fillStyle = "rgba(197,160,86,0.72)";
      } else {
        ctx.fillStyle = "rgba(218,231,218,0.5)";
      }

      ctx.fill();
    }

    ctx.restore();
  }

  function drawLatitudeLongitudeLines(ctx, cx, cy, radius) {
    ctx.save();
    ctx.lineWidth = Math.max(1, radius * 0.0028);
    ctx.strokeStyle = "rgba(217,237,255,0.11)";

    for (let lat = -60; lat <= 60; lat += 30) {
      drawProjectedPolyline(ctx, buildLatLine(lat), cx, cy, radius);
    }

    for (let lon = -150; lon <= 180; lon += 30) {
      drawProjectedPolyline(ctx, buildLonLine(lon), cx, cy, radius);
    }

    ctx.restore();
  }

  function drawProjectedPolyline(ctx, points, cx, cy, radius) {
    let open = false;

    for (const [lon, lat] of points) {
      const point = projectLonLat(lon, lat, cx, cy, radius, state.viewState.yaw, state.viewState.pitch);

      if (!point.visible) {
        if (open) ctx.stroke();
        open = false;
        continue;
      }

      if (!open) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        open = true;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    if (open) ctx.stroke();
  }

  function buildLatLine(lat) {
    const points = [];
    for (let lon = -180; lon <= 180; lon += 4) points.push([lon, lat]);
    return points;
  }

  function buildLonLine(lon) {
    const points = [];
    for (let lat = -86; lat <= 86; lat += 4) points.push([lon, lat]);
    return points;
  }

  function drawTerminatorAndRim(ctx, cx, cy, radius) {
    ctx.save();

    const shade = ctx.createRadialGradient(
      cx - radius * 0.38,
      cy - radius * 0.36,
      radius * 0.15,
      cx + radius * 0.2,
      cy + radius * 0.15,
      radius * 1.15
    );
    shade.addColorStop(0, "rgba(255,255,255,0.14)");
    shade.addColorStop(0.46, "rgba(255,255,255,0.02)");
    shade.addColorStop(0.78, "rgba(0,0,0,0.2)");
    shade.addColorStop(1, "rgba(0,0,0,0.58)");

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = shade;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(2, radius * 0.014);
    ctx.strokeStyle = "rgba(196,225,255,0.24)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.012, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.strokeStyle = "rgba(216,168,93,0.18)";
    ctx.stroke();

    ctx.restore();
  }

  function projectLonLat(lonDeg, latDeg, cx, cy, radius, yaw, pitch) {
    const lon = safeNumber(lonDeg, 0) * Math.PI / 180;
    const lat = safeNumber(latDeg, 0) * Math.PI / 180;

    let x = Math.sin(lon) * Math.cos(lat);
    let y = Math.sin(lat);
    let z = Math.cos(lon) * Math.cos(lat);

    const cyaw = Math.cos(yaw);
    const syaw = Math.sin(yaw);
    const x1 = x * cyaw + z * syaw;
    const z1 = -x * syaw + z * cyaw;

    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const y2 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp;

    return {
      x: cx + x1 * radius,
      y: cy - y2 * radius,
      z: z2,
      visible: z2 > -0.08
    };
  }

  function inspectCanvasPixels() {
    if (!canvasRef || !ctxRef) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        uniqueColorCount: 0,
        visiblePixelCount: 0
      };
    }

    const width = safeNumber(canvasRef.width, 0);
    const height = safeNumber(canvasRef.height, 0);

    if (width <= 0 || height <= 0) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE_ZERO_DIMENSIONS",
        visible: false,
        uniqueColorCount: 0,
        visiblePixelCount: 0
      };
    }

    const points = [
      [0.18, 0.18],
      [0.32, 0.28],
      [0.5, 0.5],
      [0.68, 0.32],
      [0.82, 0.18],
      [0.28, 0.68],
      [0.72, 0.72],
      [0.5, 0.82]
    ];

    const unique = new Set();
    let visiblePixelCount = 0;
    let alphaCount = 0;

    try {
      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(width - 1, Math.round(width * px)));
        const y = Math.max(0, Math.min(height - 1, Math.round(height * py)));
        const data = ctxRef.getImageData(x, y, 1, 1).data;

        const r = data[0] || 0;
        const g = data[1] || 0;
        const b = data[2] || 0;
        const a = data[3] || 0;

        unique.add(`${r},${g},${b},${a}`);

        if (a > 0) alphaCount += 1;
        if (a > 0 && (r > 5 || g > 5 || b > 5)) visiblePixelCount += 1;
      }
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_ERROR",
        visible: false,
        uniqueColorCount: unique.size,
        visiblePixelCount,
        reason: bounded(error && error.message ? error.message : error, 1200)
      };
    }

    return {
      status: visiblePixelCount > 0
        ? "PIXEL_SAMPLE_VISIBLE"
        : alphaCount > 0
          ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
          : "PIXEL_SAMPLE_BLANK",
      visible: visiblePixelCount > 0,
      uniqueColorCount: unique.size,
      visiblePixelCount
    };
  }

  function receiveRouteConductorCanvasTransactionPacket(packet, options = {}) {
    return receiveRoutePacket(packet, "receiveRouteConductorCanvasTransactionPacket", options);
  }

  function consumeRouteConductorCanvasTransactionPacket(packet, options = {}) {
    return receiveRoutePacket(packet, "consumeRouteConductorCanvasTransactionPacket", options);
  }

  function acceptRouteConductorCanvasTransactionPacket(packet, options = {}) {
    return receiveRoutePacket(packet, "acceptRouteConductorCanvasTransactionPacket", options);
  }

  function receiveRouteConductorHandoffPacket(packet, options = {}) {
    return receiveRoutePacket(packet, "receiveRouteConductorHandoffPacket", options);
  }

  function receiveGovernedSourcePacket(packet, options = {}) {
    return receiveRoutePacket(packet, "receiveGovernedSourcePacket", options);
  }

  function receiveCanvasHandoffPacket(packet, options = {}) {
    return receiveRoutePacket(packet, "receiveCanvasHandoffPacket", options);
  }

  function receivePresentationPacket(packet, options = {}) {
    return receiveRoutePacket(packet, "receivePresentationPacket", options);
  }

  function receivePlanetaryViewControlPacket(packet, options = {}) {
    state.viewPacketReceivedCount += 1;
    normalizeViewStateFromPacket(packet || {}, "receivePlanetaryViewControlPacket");
    return receiveRoutePacket(packet || {}, "receivePlanetaryViewControlPacket", {
      ...options,
      allowDirect: true
    });
  }

  function consumePlanetaryViewControlPacket(packet, options = {}) {
    state.viewPacketReceivedCount += 1;
    normalizeViewStateFromPacket(packet || {}, "consumePlanetaryViewControlPacket");
    return receiveRoutePacket(packet || {}, "consumePlanetaryViewControlPacket", {
      ...options,
      allowDirect: true
    });
  }

  function receiveViewControlPacket(packet, options = {}) {
    state.viewPacketReceivedCount += 1;
    normalizeViewStateFromPacket(packet || {}, "receiveViewControlPacket");
    return receiveRoutePacket(packet || {}, "receiveViewControlPacket", {
      ...options,
      allowDirect: true
    });
  }

  function consumeViewControlPacket(packet, options = {}) {
    state.viewPacketReceivedCount += 1;
    normalizeViewStateFromPacket(packet || {}, "consumeViewControlPacket");
    return receiveRoutePacket(packet || {}, "consumeViewControlPacket", {
      ...options,
      allowDirect: true
    });
  }

  function receivePointerSurfaceExpressionPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "receivePointerSurfaceExpressionPacket", options);
  }

  function consumePointerSurfaceExpressionPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "consumePointerSurfaceExpressionPacket", options);
  }

  function acceptPointerSurfaceExpressionPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "acceptPointerSurfaceExpressionPacket", options);
  }

  function receiveSurfaceExpressionPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "receiveSurfaceExpressionPacket", options);
  }

  function consumeSurfaceExpressionPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "consumeSurfaceExpressionPacket", options);
  }

  function acceptSurfaceExpressionPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "acceptSurfaceExpressionPacket", options);
  }

  function receiveCanvasFingerSurfacePacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "receiveCanvasFingerSurfacePacket", options);
  }

  function receiveHexSurfaceReturnPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "receiveHexSurfaceReturnPacket", options);
  }

  function receiveHexSurfaceTransmissionPacket(packet, options = {}) {
    return receiveSurfaceReturnPacket(packet, "receiveHexSurfaceTransmissionPacket", options);
  }

  function receive(packet, options = {}) {
    if (isObject(packet) && /SURFACE|FINGER|POINTER|EXPRESSION/i.test(safeString(packet.packetType || packet.type || ""))) {
      return receiveSurfaceReturnPacket(packet, "receive", options);
    }

    return receiveRoutePacket(packet || {}, "receive", {
      ...options,
      allowDirect: true
    });
  }

  function composeDiagnosticFields() {
    return {
      CANVAS_FILE: FILE,
      CANVAS_CONTRACT: CONTRACT,
      CANVAS_RECEIPT: RECEIPT,
      CURRENT_CANVAS_PARENT_CONTRACT: CONTRACT,
      CURRENT_CANVAS_PARENT_RECEIPT: RECEIPT,
      CURRENT_CANVAS_PARENT_RECOGNIZED: "true",
      CANVAS_INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      CANVAS_INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      CANVAS_PREVIOUS_INTERNAL_RENEWAL_CONTRACT: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      CANVAS_LINEAGE_INTERNAL_RENEWAL_CONTRACT: LINEAGE_INTERNAL_RENEWAL_CONTRACT,

      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      POINTER_SURFACE_FILE,
      POINTER_INSPECT_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      EXPECTED_HEX_AUTHORITY_CONTRACT,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_POINTER_SURFACE_CONTRACT,
      EXPECTED_POINTER_INSPECT_CONTRACT,

      CANVAS_HUB_LIVE_SURFACE_IDENTITY_ACTIVE: "true",
      CANVAS_USES_CANONICAL_DOM_ONLY: "true",
      CANVAS_CREATES_DOM: "false",
      CANVAS_OWNS_VISIBLE_2D_OUTPUT: "true",
      CANVAS_OWNS_CANVAS_DOM_SURFACE: "false",
      CANVAS_OWNS_ROUTE_CONDUCTOR: "false",
      CANVAS_OWNS_CONTROLS: "false",
      CANVAS_RENEWS_CONTROLS: "false",
      CANVAS_LOADS_CONTROLS: "false",
      CANVAS_OWNS_HEX_SURFACE: "false",
      CANVAS_OWNS_HEX_AUTHORITY: "false",
      CANVAS_OWNS_POINTER_SURFACE: "false",
      CANVAS_OWNS_POINTER_INSPECT: "false",

      CANONICAL_MOUNT_SELECTOR,
      CANONICAL_FRAME_SELECTOR,
      CANONICAL_CANVAS_SELECTOR,
      CANONICAL_CHAIN_SELECTOR,
      CANONICAL_MOUNT_FOUND: String(state.canonicalMountFound),
      CANONICAL_FRAME_FOUND: String(state.canonicalFrameFound),
      CANONICAL_CANVAS_FOUND: String(state.canonicalCanvasFound),
      CANONICAL_CANVAS_IN_MOUNT: String(state.canonicalCanvasInMount),
      CANONICAL_CANVAS_IN_FRAME: String(state.canonicalCanvasInFrame),
      CANONICAL_MOUNT_RECT_NONZERO: String(state.canonicalMountRectNonzero),
      CANONICAL_FRAME_RECT_NONZERO: String(state.canonicalFrameRectNonzero),
      CANONICAL_CANVAS_RECT_NONZERO: String(state.canonicalCanvasRectNonzero),
      CANONICAL_CHAIN_VALID: String(state.canonicalChainValid),
      CANVAS_CONTEXT_2D_READY: String(state.canvasContext2dReady),
      CANVAS_COMPUTED_VISIBLE: String(state.canvasComputedVisible),
      CANVAS_VIEWPORT_INTERSECTING: String(state.canvasViewportIntersecting),
      CANVAS_WIDTH: String(state.canvasWidth),
      CANVAS_HEIGHT: String(state.canvasHeight),
      CANVAS_CSS_WIDTH: String(state.canvasCssWidth),
      CANVAS_CSS_HEIGHT: String(state.canvasCssHeight),
      CANVAS_PIXEL_VISIBLE: String(state.canvasPixelVisible),
      CANVAS_PIXEL_SAMPLE_STATUS: state.canvasPixelSampleStatus,
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: String(state.canvasPixelUniqueColorCount),
      CANVAS_VISIBLE_PIXEL_COUNT: String(state.canvasVisiblePixelCount),

      ROUTE_CONDUCTOR_OBSERVED: String(state.routeConductorObserved),
      ROUTE_CONDUCTOR_SOURCE: state.routeConductorSource,
      ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract,
      ROUTE_CONDUCTOR_RECOGNIZED: String(state.routeConductorRecognized),

      CONTROL_FILE_STATUS: state.controlsObserved ? "OBSERVED_NOT_RENEWED_BY_CANVAS" : "EXPECTED_NOT_YET_BUILT_OR_NOT_LOADED",
      CONTROL_GLOBAL_PRESENT: String(state.controlsObserved),
      CONTROL_CONTRACT: state.controlsContract,
      CONTROL_CONTRACT_RECOGNIZED: String(state.controlsRecognized),
      CONTROL_HANDSHAKE_STATUS: state.controlHandshakeStatus,
      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,

      HEX_AUTHORITY_OBSERVED: String(state.hexAuthorityObserved),
      HEX_AUTHORITY_SOURCE: state.hexAuthoritySource,
      HEX_AUTHORITY_CONTRACT: state.hexAuthorityContract,
      HEX_AUTHORITY_RECOGNIZED: String(state.hexAuthorityRecognized),

      HEX_SURFACE_OBSERVED: String(state.hexSurfaceObserved),
      HEX_SURFACE_SOURCE: state.hexSurfaceSource,
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract,
      HEX_SURFACE_RECOGNIZED: String(state.hexSurfaceRecognized),
      HEX_SURFACE_METHOD: state.hexSurfaceMethod,

      POINTER_SURFACE_BISHOP_OBSERVED: String(state.pointerSurfaceObserved),
      POINTER_SURFACE_BISHOP_SOURCE: state.pointerSurfaceSource,
      POINTER_SURFACE_BISHOP_CONTRACT: state.pointerSurfaceContract,
      POINTER_SURFACE_BISHOP_RECOGNIZED: String(state.pointerSurfaceRecognized),
      POINTER_SURFACE_IS_BISHOP_GATE: "true",
      POINTER_INSPECT_PRIEST_OBSERVED: String(state.pointerInspectObserved),
      POINTER_INSPECT_PRIEST_SOURCE: state.pointerInspectSource,
      POINTER_INSPECT_PRIEST_CONTRACT: state.pointerInspectContract,
      POINTER_INSPECT_PRIEST_RECOGNIZED: String(state.pointerInspectRecognized),
      POINTER_INSPECT_IS_PRIMARY_ENDPOINT: "false",
      POINTER_INSPECT_IS_CHILD_ORGANIZER: "true",

      RECEIVER_METHOD_COUNT: String(state.receiverMethodCount),
      ROUTE_PACKET_RECEIVED_COUNT: String(state.routePacketReceivedCount),
      ROUTE_PACKET_ACCEPTED_COUNT: String(state.routePacketAcceptedCount),
      ROUTE_PACKET_REJECTED_COUNT: String(state.routePacketRejectedCount),
      VIEW_PACKET_RECEIVED_COUNT: String(state.viewPacketReceivedCount),
      HEX_GATE_PACKET_COMPOSED_COUNT: String(state.hexGatePacketComposedCount),
      HEX_GATE_DELIVERY_ATTEMPT_COUNT: String(state.hexGateDeliveryAttemptCount),
      HEX_GATE_DELIVERY_RETURN_COUNT: String(state.hexGateDeliveryReturnCount),
      HEX_GATE_DELIVERY_ERROR_COUNT: String(state.hexGateDeliveryErrorCount),
      SURFACE_RETURN_PACKET_RECEIVED_COUNT: String(state.surfaceReturnPacketReceivedCount),
      SURFACE_RETURN_ACCEPTED_COUNT: String(state.surfaceReturnAcceptedCount),
      SURFACE_RETURN_REJECTED_COUNT: String(state.surfaceReturnRejectedCount),
      DRAW_COUNT: String(state.drawCount),
      RESIZE_COUNT: String(state.resizeCount),

      LAST_RECEIVED_METHOD: state.lastReceivedMethod,
      LAST_RECEIVED_AT: state.lastReceivedAt || "NONE",
      LAST_RECEIVED_PACKET_TYPE: state.lastReceivedPacketType,
      LAST_REJECTION_REASON: state.lastRejectionReason || "NONE",
      LAST_DRAW_REASON: state.lastDrawReason,

      ACTIVE_SURFACE_STATUS: state.activeSurfaceStatus,
      ACTIVE_SURFACE_SOURCE: state.activeSurfaceSource,
      ACTIVE_SURFACE_SAMPLE_COUNT: String(state.activeSurfaceSampleCount),

      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      FIRST_SURFACE_FAILURE_COORDINATE: state.firstSurfaceFailureCoordinate,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      POSTGAME_STATUS: state.postgameStatus,

      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_DOM_CREATION_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      CONTROL_LOAD_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",
      GENERATED_IMAGE: "false",
      GRAPHIC_BOX: "false",
      WEBGL: "false",

      ...UPPER_NO_CLAIMS
    };
  }

  function getReceiptLight(refreshFirst = false) {
    if (refreshFirst) refresh();

    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_PACKET_v12_4",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      canvasContract: CONTRACT,
      canvasReceipt: RECEIPT,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      pointerBoundaryFile: POINTER_BOUNDARY_FILE,
      pointerLightFile: POINTER_LIGHT_FILE,

      role: "canvas-hub-live-surface-identity-visible-2d-output-carrier",

      loaded: true,
      booted: state.booted,
      mounted: state.mounted,
      disposed: state.disposed,

      canvasCreatesDom: false,
      canvasUsesCanonicalDomOnly: true,
      canvasDrawingAuthority: true,
      canvasDomSurfaceAuthority: false,
      routeAuthorityOwned: false,
      controlsOwned: false,
      controlsRenewedHere: false,
      controlsLoadedHere: false,
      hexSurfaceOwned: false,
      hexAuthorityOwned: false,
      pointerSurfaceOwned: false,
      pointerInspectOwned: false,

      canonicalMountSelector: CANONICAL_MOUNT_SELECTOR,
      canonicalFrameSelector: CANONICAL_FRAME_SELECTOR,
      canonicalCanvasSelector: CANONICAL_CANVAS_SELECTOR,
      canonicalChainSelector: CANONICAL_CHAIN_SELECTOR,
      canonicalMountFound: state.canonicalMountFound,
      canonicalFrameFound: state.canonicalFrameFound,
      canonicalCanvasFound: state.canonicalCanvasFound,
      canonicalCanvasInMount: state.canonicalCanvasInMount,
      canonicalCanvasInFrame: state.canonicalCanvasInFrame,
      canonicalMountRectNonzero: state.canonicalMountRectNonzero,
      canonicalFrameRectNonzero: state.canonicalFrameRectNonzero,
      canonicalCanvasRectNonzero: state.canonicalCanvasRectNonzero,
      canonicalChainValid: state.canonicalChainValid,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasCssWidth: state.canvasCssWidth,
      canvasCssHeight: state.canvasCssHeight,
      canvasPixelVisible: state.canvasPixelVisible,
      canvasPixelSampleStatus: state.canvasPixelSampleStatus,
      canvasPixelUniqueColorCount: state.canvasPixelUniqueColorCount,
      canvasVisiblePixelCount: state.canvasVisiblePixelCount,

      routeConductorObserved: state.routeConductorObserved,
      routeConductorSource: state.routeConductorSource,
      routeConductorContract: state.routeConductorContract,
      routeConductorReceipt: state.routeConductorReceipt,
      routeConductorRecognized: state.routeConductorRecognized,

      controlsObserved: state.controlsObserved,
      controlsSource: state.controlsSource,
      controlsContract: state.controlsContract,
      controlsReceipt: state.controlsReceipt,
      controlsRecognized: state.controlsRecognized,
      controlHandshakeStatus: state.controlHandshakeStatus,
      motionTouchStatus: state.motionTouchStatus,
      dragStatus: state.dragStatus,
      viewControlStatus: state.viewControlStatus,

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityReceipt: state.hexAuthorityReceipt,
      hexAuthorityRecognized: state.hexAuthorityRecognized,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceRecognized: state.hexSurfaceRecognized,
      hexSurfaceMethod: state.hexSurfaceMethod,

      pointerSurfaceObserved: state.pointerSurfaceObserved,
      pointerSurfaceSource: state.pointerSurfaceSource,
      pointerSurfaceContract: state.pointerSurfaceContract,
      pointerSurfaceReceipt: state.pointerSurfaceReceipt,
      pointerSurfaceRecognized: state.pointerSurfaceRecognized,
      pointerSurfaceIsBishopGate: true,

      pointerInspectObserved: state.pointerInspectObserved,
      pointerInspectSource: state.pointerInspectSource,
      pointerInspectContract: state.pointerInspectContract,
      pointerInspectReceipt: state.pointerInspectReceipt,
      pointerInspectRecognized: state.pointerInspectRecognized,
      pointerInspectIsPrimaryEndpoint: false,
      pointerInspectIsChildOrganizer: true,

      receiverMethodCount: state.receiverMethodCount,
      routePacketReceivedCount: state.routePacketReceivedCount,
      routePacketAcceptedCount: state.routePacketAcceptedCount,
      routePacketRejectedCount: state.routePacketRejectedCount,
      viewPacketReceivedCount: state.viewPacketReceivedCount,
      hexGatePacketComposedCount: state.hexGatePacketComposedCount,
      hexGateDeliveryAttemptCount: state.hexGateDeliveryAttemptCount,
      hexGateDeliveryReturnCount: state.hexGateDeliveryReturnCount,
      hexGateDeliveryErrorCount: state.hexGateDeliveryErrorCount,
      surfaceReturnPacketReceivedCount: state.surfaceReturnPacketReceivedCount,
      surfaceReturnAcceptedCount: state.surfaceReturnAcceptedCount,
      surfaceReturnRejectedCount: state.surfaceReturnRejectedCount,
      drawCount: state.drawCount,
      resizeCount: state.resizeCount,

      lastReceivedMethod: state.lastReceivedMethod,
      lastReceivedAt: state.lastReceivedAt || "NONE",
      lastReceivedPacketType: state.lastReceivedPacketType,
      lastReceivedPacketSummary: clonePlain(state.lastReceivedPacketSummary || {}),
      lastRejectionReason: state.lastRejectionReason || "NONE",
      lastHexSurfaceDeliveryResult: clonePlain(state.lastHexSurfaceDeliveryResult || {}),
      lastSurfaceExpression: clonePlain(state.lastSurfaceExpression || {}),
      lastDrawReason: state.lastDrawReason,

      activeSurfaceStatus: state.activeSurfaceStatus,
      activeSurfaceSource: state.activeSurfaceSource,
      activeSurfaceSampleCount: state.activeSurfaceSampleCount,

      viewState: clonePlain(state.viewState),
      firstFailedCoordinate: state.firstFailedCoordinate,
      firstSurfaceFailureCoordinate: state.firstSurfaceFailureCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      diagnosticFields: clonePlain(diagnosticFields),
      ...diagnosticFields,

      supportsRouteConductorCanvasTransactionPacket: true,
      supportsGovernedSourcePacket: true,
      supportsCanvasHandoffPacket: true,
      supportsPresentationPacket: true,
      supportsPlanetaryViewControlPacket: true,
      supportsPointerSurfaceReturnPacket: true,
      supportsCanvasHexGatePacketComposition: true,
      supportsHexSurfacePublicDelivery: true,
      supportsVisible2dOutput: true,

      ownsCanvasDrawing: true,
      ownsCanvas2dOutput: true,
      ownsCanvasDomCreation: false,
      ownsCanvasDomRepair: false,
      ownsControls: false,
      ownsRouteConductor: false,
      ownsHexSurface: false,
      ownsHexAuthorityTruth: false,
      ownsPointerSurface: false,
      ownsPointerFingerTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,
      ownsNorthF21Latch: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      state: clonePlain({
        ...state,
        lastAcceptedRoutePacket: undefined,
        lastCanvasHexGatePacket: state.lastCanvasHexGatePacket ? summarizePacket(state.lastCanvasHexGatePacket) : null,
        lastSurfaceReturnPacket: state.lastSurfaceReturnPacket ? summarizePacket(state.lastSurfaceReturnPacket) : null
      }),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("internalRenewalContract", INTERNAL_RENEWAL_CONTRACT),
      line("internalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("targetRoute", TARGET_ROUTE),
      "",
      "DOM",
      line("canonicalMountFound", r.canonicalMountFound),
      line("canonicalMountRectNonzero", r.canonicalMountRectNonzero),
      line("canonicalFrameFound", r.canonicalFrameFound),
      line("canonicalFrameRectNonzero", r.canonicalFrameRectNonzero),
      line("canonicalCanvasFound", r.canonicalCanvasFound),
      line("canonicalCanvasRectNonzero", r.canonicalCanvasRectNonzero),
      line("canonicalChainValid", r.canonicalChainValid),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      "",
      "TRANSACTION",
      line("receiverMethodCount", r.receiverMethodCount),
      line("routePacketReceivedCount", r.routePacketReceivedCount),
      line("routePacketAcceptedCount", r.routePacketAcceptedCount),
      line("hexGatePacketComposedCount", r.hexGatePacketComposedCount),
      line("hexGateDeliveryAttemptCount", r.hexGateDeliveryAttemptCount),
      line("hexGateDeliveryReturnCount", r.hexGateDeliveryReturnCount),
      line("surfaceReturnPacketReceivedCount", r.surfaceReturnPacketReceivedCount),
      line("surfaceReturnAcceptedCount", r.surfaceReturnAcceptedCount),
      line("drawCount", r.drawCount),
      "",
      "AUTHORITIES",
      line("routeConductorObserved", r.routeConductorObserved),
      line("routeConductorContract", r.routeConductorContract),
      line("controlsObserved", r.controlsObserved),
      line("controlsRenewedHere", false),
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexAuthorityContract", r.hexAuthorityContract),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceMethod", r.hexSurfaceMethod),
      line("pointerSurfaceObserved", r.pointerSurfaceObserved),
      line("pointerSurfaceIsBishopGate", true),
      line("pointerInspectObserved", r.pointerInspectObserved),
      line("pointerInspectIsPrimaryEndpoint", false),
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
      line("f21ClaimedByCanvas", false),
      line("readyTextClaimed", false),
      line("motionReadyClaimed", false),
      line("touchReadyClaimed", false),
      line("dragReadyClaimed", false),
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
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_STATUS",
      line("contract", r.contract),
      line("internalRenewalContract", r.internalRenewalContract),
      line("mounted", r.mounted),
      line("canonicalChainValid", r.canonicalChainValid),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.canvasPixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("routePacketAcceptedCount", r.routePacketAcceptedCount),
      line("hexGateDeliveryReturnCount", r.hexGateDeliveryReturnCount),
      line("surfaceReturnAcceptedCount", r.surfaceReturnAcceptedCount),
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceMethod", r.hexSurfaceMethod),
      line("controlsRenewedHere", false),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false)
    ].join("\n");
  }

  function getState() {
    return clonePlain(state);
  }

  function updateDataset() {
    state.datasetPublishCount += 1;

    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasPresent", "true");
    setDataset("hearthCanvasContract", CONTRACT);
    setDataset("hearthCanvasReceipt", RECEIPT);
    setDataset("hearthCanvasInternalRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDataset("hearthCanvasInternalRenewalReceipt", INTERNAL_RENEWAL_RECEIPT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasCanonicalMountSelector", CANONICAL_MOUNT_SELECTOR);
    setDataset("hearthCanvasCanonicalFrameSelector", CANONICAL_FRAME_SELECTOR);
    setDataset("hearthCanvasCanonicalCanvasSelector", CANONICAL_CANVAS_SELECTOR);
    setDataset("hearthCanvasCanonicalChainSelector", CANONICAL_CHAIN_SELECTOR);

    setDataset("hearthCanvasCanonicalMountFound", String(state.canonicalMountFound));
    setDataset("hearthCanvasCanonicalFrameFound", String(state.canonicalFrameFound));
    setDataset("hearthCanvasCanonicalCanvasFound", String(state.canonicalCanvasFound));
    setDataset("hearthCanvasCanonicalMountRectNonzero", String(state.canonicalMountRectNonzero));
    setDataset("hearthCanvasCanonicalFrameRectNonzero", String(state.canonicalFrameRectNonzero));
    setDataset("hearthCanvasCanonicalCanvasRectNonzero", String(state.canonicalCanvasRectNonzero));
    setDataset("hearthCanvasCanonicalChainValid", String(state.canonicalChainValid));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasPixelVisible", String(state.canvasPixelVisible));
    setDataset("hearthCanvasPixelSampleStatus", state.canvasPixelSampleStatus);

    setDataset("hearthCanvasRoutePacketAcceptedCount", String(state.routePacketAcceptedCount));
    setDataset("hearthCanvasHexGatePacketComposedCount", String(state.hexGatePacketComposedCount));
    setDataset("hearthCanvasHexGateDeliveryReturnCount", String(state.hexGateDeliveryReturnCount));
    setDataset("hearthCanvasSurfaceReturnAcceptedCount", String(state.surfaceReturnAcceptedCount));
    setDataset("hearthCanvasDrawCount", String(state.drawCount));

    setDataset("hearthCanvasRouteConductorObserved", String(state.routeConductorObserved));
    setDataset("hearthCanvasControlsObserved", String(state.controlsObserved));
    setDataset("hearthCanvasControlsRenewedHere", "false");
    setDataset("hearthCanvasControlsLoadedHere", "false");
    setDataset("hearthCanvasHexAuthorityObserved", String(state.hexAuthorityObserved));
    setDataset("hearthCanvasHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthCanvasHexSurfaceMethod", state.hexSurfaceMethod);
    setDataset("hearthCanvasPointerSurfaceObserved", String(state.pointerSurfaceObserved));
    setDataset("hearthCanvasPointerInspectObserved", String(state.pointerInspectObserved));

    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasOwnsVisible2dOutput", "true");
    setDataset("hearthCanvasOwnsCanvasDomCreation", "false");
    setDataset("hearthCanvasOwnsControls", "false");
    setDataset("hearthCanvasOwnsRouteConductor", "false");
    setDataset("hearthCanvasOwnsHexSurface", "false");
    setDataset("hearthCanvasOwnsPointerSurface", "false");
    setDataset("hearthCanvasOwnsFinalVisualPassClaim", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasMotionReadyClaimed", "false");
    setDataset("hearthCanvasTouchReadyClaimed", "false");
    setDataset("hearthCanvasDragReadyClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("hearthCanvasFinalVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    root.HEARTH_CANVAS_DIAGNOSTIC_FIELDS = composeDiagnosticFields();
    if (root.HEARTH && typeof root.HEARTH === "object") {
      root.HEARTH.canvasDiagnosticFields = root.HEARTH_CANVAS_DIAGNOSTIC_FIELDS;
    }
  }

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of CANVAS_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();
    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT = receipt;

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasAuthorityReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexRenderReceiverReceipt = receipt;
    hearth.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutputReceipt = receipt;

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasParentReceipt = receipt;
    lab.hearthCanvasAuthorityReceipt = receipt;
    lab.hearthCanvasVisiblePlanetReceipt = receipt;

    root.HEARTH_CANVAS_RECEIPT_TEXT = composeReceiptText(receipt);
    hearth.canvasReceiptText = root.HEARTH_CANVAS_RECEIPT_TEXT;

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    record("HEARTH_CANVAS_GLOBALS_PUBLISHED", {
      reason,
      contract: CONTRACT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      canonicalChainValid: state.canonicalChainValid,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasPixelVisible: state.canvasPixelVisible,
      routePacketAcceptedCount: state.routePacketAcceptedCount,
      hexGateDeliveryReturnCount: state.hexGateDeliveryReturnCount,
      controlsRenewedHere: false,
      visualPassClaimed: false
    });

    return true;
  }

  function mount(options = {}) {
    bindCanonicalCanvas(options.reason || "mount");
    setupResizeObserver();
    scheduleDraw("mount");
    publishGlobals("mount");
    return getReceipt();
  }

  function boot(options = {}) {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "CANVAS_BOOTING_LIVE_SURFACE_IDENTITY_V12_4";

      publishAliasPaths();
      refreshAuthoritySnapshots();
      bindCanonicalCanvas(options.reason || "boot");
      setupResizeObserver();

      state.booted = true;
      state.booting = false;

      drawVisibleFrame("boot-first-visible-output");

      state.postgameStatus = state.mounted
        ? "CANVAS_BOOTED_CANONICAL_SURFACE_BOUND_VISIBLE_2D_OUTPUT_READY"
        : "CANVAS_BOOTED_CANONICAL_SURFACE_NOT_READY";

      record("HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_V12_4_BOOTED", {
        contract: CONTRACT,
        file: FILE,
        mounted: state.mounted,
        canonicalChainValid: state.canonicalChainValid,
        canvasContext2dReady: state.canvasContext2dReady,
        canvasPixelVisible: state.canvasPixelVisible,
        routeConductorObserved: state.routeConductorObserved,
        hexSurfaceObserved: state.hexSurfaceObserved,
        pointerSurfaceObserved: state.pointerSurfaceObserved,
        controlsRenewedHere: false,
        visualPassClaimed: false
      });

      publishGlobals("boot-complete");
      return getReceipt();
    });

    return bootPromise;
  }

  function refresh(options = {}) {
    refreshAuthoritySnapshots();
    bindCanonicalCanvas(options.reason || "refresh");

    if (options.draw !== false) drawVisibleFrame("refresh");

    publishGlobals("refresh");

    return getReceiptLight(false);
  }

  function run(options = {}) {
    return boot(options);
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.postgameStatus = "CANVAS_DISPOSED";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction = "REBOOT_CANVAS_IF_VISIBLE_OUTPUT_REQUIRED";

    if (resizeObserver && isFunction(resizeObserver.disconnect)) {
      try {
        resizeObserver.disconnect();
      } catch (_error) {}
    }

    record("HEARTH_CANVAS_DISPOSED", { reason });
    publishGlobals("dispose");

    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    canvasContract: CONTRACT,
    canvasReceipt: RECEIPT,
    currentCanvasParentContract: CONTRACT,
    currentCanvasParentReceipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerSurfaceFile: POINTER_SURFACE_FILE,
    pointerInspectFile: POINTER_INSPECT_FILE,
    pointerBoundaryFile: POINTER_BOUNDARY_FILE,
    pointerLightFile: POINTER_LIGHT_FILE,

    canonicalMountSelector: CANONICAL_MOUNT_SELECTOR,
    canonicalFrameSelector: CANONICAL_FRAME_SELECTOR,
    canonicalCanvasSelector: CANONICAL_CANVAS_SELECTOR,
    canonicalChainSelector: CANONICAL_CHAIN_SELECTOR,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexContract: EXPECTED_INDEX_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
    expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

    boot,
    init: boot,
    start: boot,
    run,
    mount,
    refresh,
    dispose,

    bindCanonicalCanvas,
    setupResizeObserver,
    drawVisibleFrame,
    scheduleDraw,
    inspectCanvasPixels,

    receiveRouteConductorCanvasTransactionPacket,
    consumeRouteConductorCanvasTransactionPacket,
    acceptRouteConductorCanvasTransactionPacket,
    receiveRouteConductorHandoffPacket,
    receiveGovernedSourcePacket,
    receiveCanvasHandoffPacket,
    receivePresentationPacket,

    receivePlanetaryViewControlPacket,
    consumePlanetaryViewControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,

    receivePointerSurfaceExpressionPacket,
    consumePointerSurfaceExpressionPacket,
    acceptPointerSurfaceExpressionPacket,
    receiveSurfaceExpressionPacket,
    consumeSurfaceExpressionPacket,
    acceptSurfaceExpressionPacket,
    receiveCanvasFingerSurfacePacket,
    receiveHexSurfaceReturnPacket,
    receiveHexSurfaceTransmissionPacket,
    receive,

    composeCanvasHexGatePacket,
    deliverCanvasHexGatePacket,
    publishTransmissionPacketGlobals,

    refreshAuthoritySnapshots,
    getReceipt,
    getReceiptLight,
    getCanvasStationReceipt: getReceiptLight,
    getCanvasStationSummary: getReceiptLight,
    getVisiblePlanetReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getState,
    getReceiptText,
    getStatusText,
    composeReceiptText,
    composeDiagnosticFields,

    publishGlobals,
    publishAliasPaths,
    publishReceiptAliases,
    updateDataset,

    supportsRouteConductorCanvasTransactionPacket: true,
    supportsGovernedSourcePacket: true,
    supportsCanvasHandoffPacket: true,
    supportsPresentationPacket: true,
    supportsPlanetaryViewControlPacket: true,
    supportsPointerSurfaceReturnPacket: true,
    supportsCanvasHexGatePacketComposition: true,
    supportsHexSurfacePublicDelivery: true,
    supportsVisible2dOutput: true,

    canvasCreatesDom: false,
    canvasUsesCanonicalDomOnly: true,
    canvasDrawingAuthority: true,
    canvasDomSurfaceAuthority: false,
    routeAuthorityOwned: false,
    controlsOwned: false,
    controlsRenewedHere: false,
    controlsLoadedHere: false,
    hexSurfaceOwned: false,
    hexAuthorityOwned: false,
    pointerSurfaceOwned: false,
    pointerInspectOwned: false,

    ownsCanvasDrawing: true,
    ownsCanvas2dOutput: true,
    ownsCanvasDomCreation: false,
    ownsCanvasDomRepair: false,
    ownsControls: false,
    ownsRouteConductor: false,
    ownsHexSurface: false,
    ownsHexAuthorityTruth: false,
    ownsPointerSurface: false,
    ownsPointerFingerTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,
    ownsNorthF21Latch: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  state.receiverMethodCount = RECEIVER_METHOD_NAMES.filter((method) => isFunction(api[method])).length;

  try {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "dom-content-loaded" }), { once: true });
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document" });
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
