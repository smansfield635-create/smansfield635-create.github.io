// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_TNT_v2_0
// Full-file replacement.
// Diagnostic-only Canvas surface truth probe.
//
// Purpose:
// - Preserve the public NORTH-facing Canvas surface truth probe contract.
// - Correct the runtime boundary map used by the probe:
//   Route Conductor -> Controls Queen -> Canvas Receiver -> Hex Surface Gate
//   -> Pointer Surface Bishop -> child organizer/proof files -> Canvas return.
// - Treat /assets/hearth/hearth.canvas.finger.surface.js as Pointer Surface Bishop.
// - Treat /assets/hearth/hearth.canvas.finger.inspect.js as child organizer / priest evidence only.
// - Preserve parent-chain / used-size / boundary-fact reporting.
// - Produce one boundary row per boundary.
// - Produce one missing-proof / missing-fact statement per unresolved boundary.
// - Avoid single-file causal recommendations unless a single causal file is proven.
// - Keep F21 as diagnostic evidence only; do not claim F21 authority.
// - Do not create, draw, repair, release, restart, invoke lifecycle methods,
//   dispatch input, or mutate production state.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_TNT_v2_0";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_RECEIPT_v2_0";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_TNT_v1_9";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_RECEIPT_v1_9";

  const LINEAGE_V1_8_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_TNT_v1_8";
  const LINEAGE_V1_7_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_TNT_v1_7";
  const LINEAGE_V1_6_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARDED_TRANSITION_SURFACE_DISAMBIGUATION_TNT_v1_6";
  const LINEAGE_V1_5_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_TNT_v1_5";

  const VERSION =
    "2026-06-08.hearth-diagnostic-probe-canvas-surface-truth-pointer-surface-bishop-boundary-fact-matrix-v2-0";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const POINTER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
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
  const EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE =
    "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE_TNT_v5";
  const EXPECTED_POINTER_SURFACE_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const EXPECTED_POINTER_SURFACE_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_GATE_TNT_v5";
  const EXPECTED_POINTER_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const CANONICAL_MOUNT_SELECTOR = "#hearthCanvasMount";
  const CANONICAL_FRAME_SELECTOR = "#hearthCanvasRectLockFrame";
  const CANONICAL_CANVAS_SELECTOR = "#hearthVisibleCanvas";
  const CANONICAL_CHAIN_SELECTOR =
    "#hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas";

  const CANONICAL_CANVAS_SELECTORS = Object.freeze([
    CANONICAL_CHAIN_SELECTOR,
    "#hearthCanvasMount #hearthCanvasRectLockFrame #hearthVisibleCanvas",
    "#hearthCanvasMount #hearthVisibleCanvas",
    "#hearthCanvasMount canvas[data-hearth-canonical-visible-canvas='true']",
    "#hearthCanvasMount canvas[data-hearth-visible-canvas='true']",
    "#hearthCanvasMount canvas[data-hearth-expression-surface='true']",
    "#hearthCanvasMount canvas[data-hearth-canvas-hub='true']",
    "#hearthCanvasMount canvas[data-hearth-canvas='true']",
    "#hearthCanvasMount canvas"
  ]);

  const STAGE_SELECTORS = Object.freeze([
    "#hearthGlobeStage",
    "#hearthPlanetStage",
    "#hearthStage",
    "#hearthCanvasStage",
    "[data-hearth-globe-stage='true']",
    "[data-hearth-planet-stage='true']",
    "[data-hearth-stage='true']",
    "[data-hearth-canvas-stage='true']",
    ".hearth-stage",
    ".hearth-canvas-stage",
    ".globe-stage",
    ".planet-stage"
  ]);

  const SCRIPT_PATHS = Object.freeze({
    html: HTML_FILE,
    index: INDEX_FILE,
    routeConductor: ROUTE_CONDUCTOR_FILE,
    controls: CONTROL_FILE,
    canvas: CANVAS_FILE,
    hexAuthority: HEX_AUTHORITY_FILE,
    hexSurface: HEX_SURFACE_FILE,
    pointerSurface: POINTER_SURFACE_FILE,
    pointerInspect: POINTER_INSPECT_FILE
  });

  const SAFE_RECEIPT_METHODS = Object.freeze([
    "getReceiptLight",
    "getReceipt",
    "getStatus",
    "getReport",
    "getState",
    "getSummary",
    "getReceiptText",
    "getStatusText",
    "getControlReceipt",
    "getControlsReceipt",
    "getControlHandshakeReceipt",
    "getCanvasStationReceipt",
    "getCanvasStationSummary",
    "getVisiblePlanetReceipt",
    "getVisibleGlobeReceipt",
    "getHexSurfaceReceipt",
    "getHexSurfaceSummary",
    "getPointerSurfaceReceipt",
    "getPointerSurfaceSummary",
    "getPointerBishopReceipt",
    "getPointerBishopSummary",
    "getSurfaceBishopReceipt",
    "getSurfaceBishopSummary",
    "getFingerSurfaceReceipt",
    "getFingerSurfaceSummary",
    "getFingerInspectReceipt",
    "getFingerInspectSummary",
    "getCanvasReturnReceipt",
    "getReturnReceipt",
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

  const CANVAS_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER",
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "HEARTH.canvasHubInternalizedExpressionSurfaceProofReceiver",
    "HEARTH.canvasHubHexSurfacePointerFingerTransmission",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexRenderReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubInternalizedExpressionSurfaceProofReceiver",
    "DEXTER_LAB.hearthCanvasHubHexSurfacePointerFingerTransmission",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexRenderReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const ROUTE_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION",
    "HEARTH.routeConductor",
    "HEARTH.routeNorthBishop",
    "HEARTH.routeAuthority",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteNorthBishop"
  ]);

  const CONTROL_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH.controls",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controlsHexGatePointerFingerTransmission",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthControlAuthority"
  ]);

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "HEARTH.hexAuthority",
    "HEARTH.pixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthHexAuthority"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE_PAIR_POINTER_FINGER_GATE",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_BINDING_POINTER_TRANSMISSION",
    "HEARTH.hexSurfacePairPointerFingerGate",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexGate",
    "HEARTH.hexRenderGate",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexSurfaceCanonicalMapTupleBindingPointerTransmission",
    "DEXTER_LAB.hearthHexSurfacePairPointerFingerGate",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexGate"
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
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasFingerSurfacePointerBishop",
    "HEARTH.canvasFingerSurfacePointerBishopGate",
    "HEARTH.canvasFingerSurfaceBishop",
    "HEARTH.canvasPointerSurfaceBishop",
    "HEARTH.pointerSurfaceBishop",
    "HEARTH.surfacePointerBishop",
    "HEARTH.canvasBishopSurfacePointer",
    "HEARTH.canvasSurfaceBishop",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointerBishop",
    "DEXTER_LAB.hearthCanvasFingerSurfaceBishop",
    "DEXTER_LAB.hearthCanvasPointerSurfaceBishop",
    "DEXTER_LAB.hearthPointerSurfaceBishop",
    "DEXTER_LAB.hearthCanvasSurfaceBishop",
    "DEXTER_LAB.hearthPointerFingerSurface"
  ]);

  const POINTER_INSPECT_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECT_PRIEST",
    "HEARTH_CANVAS_FINGER_CHILD_ORGANIZER",
    "HEARTH_POINTER_INSPECT_PRIEST",
    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_RECEIVER",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspectPriest",
    "HEARTH.canvasFingerChildOrganizer",
    "HEARTH.pointerInspectPriest",
    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerReceiver",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthPointerInspectPriest",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerReceiver"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextPermissionGranted: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_PROBE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_PERMISSION_GRANTED: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false,
    PRODUCTION_MUTATION_AUTHORIZED: false,
    CANVAS_DRAWING_AUTHORIZED: false,
    CANVAS_CREATION_AUTHORIZED: false,
    CANVAS_REPAIR_AUTHORIZED: false,
    ROUTE_REPAIR_AUTHORIZED: false,
    CONTROL_MUTATION_AUTHORIZED: false,
    RUNTIME_RESTART_AUTHORIZED: false
  });

  let lastReport = null;
  let lastReceipt = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastSettledReport = null;
  let settledSampleScheduled = false;

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
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function bounded(value, limit = 5000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
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

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value) || isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 50000) || fallback;
      } catch (_error) {
        return bounded(value, 5000) || fallback;
      }
    }

    return bounded(value, 5000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }

    return "UNKNOWN";
  }

  function getRaw(source, key, fallback = undefined) {
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

  function readPath(base, path) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    let cursor = base || root;

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

  function q(doc, selector) {
    if (!doc || !isFunction(doc.querySelector)) return null;
    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(doc, selector) {
    if (!doc || !isFunction(doc.querySelectorAll)) return [];
    try {
      return Array.from(doc.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function firstElement(doc, selectors) {
    for (const selector of selectors || []) {
      const element = q(doc, selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function pathMatches(win, route) {
    try {
      const path = win && win.location ? win.location.pathname : "";
      const normal = safeString(route).replace(/\/$/, "");
      return path === route || path === normal;
    } catch (_error) {
      return false;
    }
  }

  function dataValue(doc, key) {
    try {
      const html = doc && doc.documentElement;
      const body = doc && doc.body;

      return firstKnown(
        html && html.dataset ? html.dataset[key] : "",
        body && body.dataset ? body.dataset[key] : "",
        html && html.getAttribute ? html.getAttribute(`data-${key}`) : "",
        body && body.getAttribute ? body.getAttribute(`data-${key}`) : ""
      );
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function documentRoute(doc) {
    try {
      const html = doc && doc.documentElement;
      const body = doc && doc.body;

      return firstKnown(
        html && html.dataset ? html.dataset.route : "",
        body && body.dataset ? body.dataset.route : "",
        html && html.getAttribute ? html.getAttribute("data-route") : "",
        body && body.getAttribute ? body.getAttribute("data-route") : ""
      );
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function contractFromDataset(doc) {
    try {
      const html = doc && doc.documentElement;
      const body = doc && doc.body;

      return firstKnown(
        html && html.dataset ? html.dataset.contract : "",
        html && html.dataset ? html.dataset.hearthHtmlContract : "",
        html && html.dataset ? html.dataset.hearthShellContract : "",
        body && body.dataset ? body.dataset.contract : "",
        body && body.dataset ? body.dataset.hearthHtmlContract : "",
        html && html.getAttribute ? html.getAttribute("data-contract") : ""
      );
    } catch (_error) {
      return "UNKNOWN";
    }
  }

  function isDiagnosticReceiver(doc, win) {
    try {
      if (!doc || !doc.documentElement) return false;

      const contract = contractFromDataset(doc);
      const page = dataValue(doc, "page");
      const route = documentRoute(doc);

      return Boolean(
        pathMatches(win, DIAGNOSTIC_ROUTE) ||
        route === DIAGNOSTIC_ROUTE ||
        route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
        /diagnostic/i.test(page) ||
        /HEARTH_DIAGNOSTIC_ROUTE/i.test(contract)
      );
    } catch (_error) {
      return false;
    }
  }

  function hasHearthTargetSignals(doc, win) {
    try {
      if (!doc || !doc.documentElement) return false;
      if (isDiagnosticReceiver(doc, win)) return false;

      const page = dataValue(doc, "page");
      const alias = dataValue(doc, "pageAlias");
      const context = firstKnown(dataValue(doc, "pageContext"), dataValue(doc, "context"));
      const route = documentRoute(doc);

      return Boolean(
        pathMatches(win, TARGET_ROUTE) ||
        route === TARGET_ROUTE ||
        route === TARGET_ROUTE.replace(/\/$/, "") ||
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet engine|planet factory|visible globe|visible planet|canvas expression|mirrorland formation/i.test(context) ||
        q(doc, CANONICAL_MOUNT_SELECTOR) ||
        q(doc, "canvas")
      );
    } catch (_error) {
      return false;
    }
  }

  function getTargetContext(payload = {}) {
    const ownDocument = root.document || null;

    let targetWindow = null;
    let targetDocument = null;
    let targetSource = "UNKNOWN";
    let targetAccessError = "NONE";

    try {
      if (payload.targetWindow && payload.targetDocument) {
        targetWindow = payload.targetWindow;
        targetDocument = payload.targetDocument;
        targetSource = "PAYLOAD_TARGET_WINDOW_DOCUMENT";
      } else if (payload.targetWindow && payload.targetWindow.document) {
        targetWindow = payload.targetWindow;
        targetDocument = payload.targetWindow.document;
        targetSource = "PAYLOAD_TARGET_WINDOW";
      } else if (payload.targetDocument) {
        targetWindow = payload.targetDocument.defaultView || root;
        targetDocument = payload.targetDocument;
        targetSource = "PAYLOAD_TARGET_DOCUMENT";
      }
    } catch (error) {
      targetSource = "PAYLOAD_TARGET_BLOCKED";
      targetAccessError = bounded(error && error.message ? error.message : error, 900);
    }

    if (targetDocument && isDiagnosticReceiver(targetDocument, targetWindow)) {
      targetWindow = null;
      targetDocument = null;
      targetSource = "PAYLOAD_DIAGNOSTIC_RECEIVER_REJECTED";
    }

    if (!targetDocument && payload.frameElement) {
      try {
        const frameWindow = payload.frameElement.contentWindow;
        const frameDocument =
          payload.frameElement.contentDocument ||
          (frameWindow && frameWindow.document);

        if (frameWindow && frameDocument && !isDiagnosticReceiver(frameDocument, frameWindow)) {
          targetWindow = frameWindow;
          targetDocument = frameDocument;
          targetSource = "PAYLOAD_FRAME_ELEMENT";
        }
      } catch (error) {
        targetAccessError = bounded(error && error.message ? error.message : error, 900);
      }
    }

    if (!targetDocument && ownDocument) {
      try {
        const frames = qa(ownDocument, "iframe");
        const frame = frames.find((candidate) => {
          const src = safeString(candidate.getAttribute("src"));
          const id = safeString(candidate.id);
          const flag =
            candidate.dataset &&
            candidate.dataset.hearthDiagnosticTargetFrame === "true";

          return (
            flag ||
            id === "hearthDiagnosticTargetFrame" ||
            src.includes(TARGET_ROUTE) ||
            src === TARGET_ROUTE
          );
        });

        if (frame) {
          const frameWindow = frame.contentWindow;
          const frameDocument =
            frame.contentDocument || (frameWindow && frameWindow.document);

          if (frameWindow && frameDocument && !isDiagnosticReceiver(frameDocument, frameWindow)) {
            targetWindow = frameWindow;
            targetDocument = frameDocument;
            targetSource = "DISCOVERED_TARGET_IFRAME";
          }
        }
      } catch (error) {
        targetAccessError = bounded(error && error.message ? error.message : error, 900);
      }
    }

    if (!targetDocument && ownDocument) {
      try {
        if (!isDiagnosticReceiver(ownDocument, root) && hasHearthTargetSignals(ownDocument, root)) {
          targetWindow = root;
          targetDocument = ownDocument;
          targetSource = "CURRENT_HEARTH_DOCUMENT";
        }
      } catch (error) {
        targetAccessError = bounded(error && error.message ? error.message : error, 900);
      }
    }

    return {
      targetWindow,
      targetDocument,
      targetSource,
      targetAvailable: Boolean(targetWindow && targetDocument),
      targetAccessError
    };
  }

  function scriptInfo(doc, path) {
    const scripts = qa(doc, "script[src]");
    const matches = [];

    for (let index = 0; index < scripts.length; index += 1) {
      const script = scripts[index];
      const src = safeString(script.getAttribute("src"));

      let pathname = src;
      let cacheKey = "NONE";

      try {
        const base =
          root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";
        const url = new URL(src, base);
        pathname = url.pathname;
        cacheKey =
          url.searchParams.get("v") ||
          url.searchParams.get("cacheKey") ||
          url.searchParams.get("cache") ||
          url.searchParams.get("version") ||
          url.searchParams.get("northRecovery") ||
          "NONE";
      } catch (_error) {}

      if (pathname === path || pathname.endsWith(path) || src.includes(path)) {
        matches.push({
          order: index + 1,
          src,
          pathname,
          cacheKey,
          id: safeString(script.id, "NONE"),
          async: Boolean(script.async),
          defer: Boolean(script.defer)
        });
      }
    }

    const last = matches[matches.length - 1] || null;

    return {
      present: matches.length > 0,
      count: matches.length,
      lastOrder: last ? last.order : 0,
      src: last ? last.src : "NONE",
      cacheKey: last ? last.cacheKey : "NONE",
      id: last ? last.id : "NONE",
      matches
    };
  }

  function inspectScripts(targetDocument) {
    const out = {};
    for (const [key, path] of Object.entries(SCRIPT_PATHS)) {
      out[key] = scriptInfo(targetDocument, path);
    }

    return out;
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    for (const method of SAFE_RECEIPT_METHODS) {
      if (!isFunction(authority[method])) continue;
      if (MUTATING_OR_LIFECYCLE_METHODS.includes(method)) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.state)) return authority.state;
    if (isObject(authority.report)) return authority.report;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return null;
  }

  function contractOf(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return "UNKNOWN";

    return firstKnown(
      value.CONTRACT,
      value.contract,
      value.INTERNAL_RENEWAL_CONTRACT,
      value.internalRenewalContract,
      value.RENEWAL_CONTRACT,
      value.renewalContract,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.routeConductorContract,
      value.controlContract,
      value.controlsContract,
      value.hexAuthorityContract,
      value.hexSurfaceContract,
      value.pointerSurfaceContract,
      value.surfaceBishopContract,
      value.pointerBishopContract,
      value.fingerSurfaceContract,
      value.pointerFingerContract,
      value.pointerInspectContract,
      value.fingerInspectContract,
      value.sourceContract
    );
  }

  function receiptOf(value) {
    if (!value || (!isObject(value) && !isFunction(value))) return "UNKNOWN";

    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.INTERNAL_RENEWAL_RECEIPT,
      value.internalRenewalReceipt,
      value.RENEWAL_RECEIPT,
      value.renewalReceipt,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.routeConductorReceipt,
      value.controlReceipt,
      value.controlsReceipt,
      value.hexAuthorityReceipt,
      value.hexSurfaceReceipt,
      value.pointerSurfaceReceipt,
      value.surfaceBishopReceipt,
      value.pointerBishopReceipt,
      value.fingerSurfaceReceipt,
      value.pointerFingerReceipt,
      value.pointerInspectReceipt,
      value.fingerInspectReceipt,
      value.sourceReceipt
    );
  }

  function authorityMethods(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    try {
      return Object.keys(authority)
        .filter((key) => isFunction(authority[key]))
        .sort()
        .slice(0, 180);
    } catch (_error) {
      return [];
    }
  }

  function contractRecognized(contract, family) {
    const text = safeString(contract);

    if (family === "route") {
      return text === EXPECTED_ROUTE_CONDUCTOR_CONTRACT || text.includes("HEARTH_ROUTE_CONDUCTOR");
    }

    if (family === "controls") {
      return (
        text === EXPECTED_CONTROL_CONTRACT ||
        text === EXPECTED_CONTROL_RENEWAL_CANDIDATE ||
        text.includes("HEARTH_CONTROLS")
      );
    }

    if (family === "canvas") {
      return (
        text === EXPECTED_CANVAS_CONTRACT ||
        text === EXPECTED_CANVAS_RENEWAL_CANDIDATE ||
        text.includes("HEARTH_CANVAS")
      );
    }

    if (family === "hexAuthority") {
      return (
        text === EXPECTED_HEX_AUTHORITY_CONTRACT ||
        text.includes("HEARTH_HEX_FOUR_PAIR") ||
        text.includes("PIXEL_HANDSHAKE_AUTHORITY")
      );
    }

    if (family === "hexSurface") {
      return (
        text === EXPECTED_HEX_SURFACE_CONTRACT ||
        text === EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE ||
        text.includes("HEARTH_HEX_SURFACE")
      );
    }

    if (family === "pointerSurface") {
      return (
        text === EXPECTED_POINTER_SURFACE_CONTRACT ||
        text === EXPECTED_POINTER_SURFACE_RENEWAL_CANDIDATE ||
        text.includes("HEARTH_CANVAS_FINGER_SURFACE") ||
        text.includes("HEARTH_POINTER_SURFACE") ||
        text.includes("SURFACE_BISHOP") ||
        text.includes("POINTER_BISHOP")
      );
    }

    if (family === "pointerInspect") {
      return (
        text === EXPECTED_POINTER_INSPECT_CONTRACT ||
        text.includes("HEARTH_CANVAS_FINGER_INSPECT") ||
        text.includes("HEARTH_POINTER_FINGER_INSPECT") ||
        text.includes("INSPECT")
      );
    }

    return false;
  }

  function inspectAuthority(targetWindow, aliases, family) {
    const scopes = [
      { scope: "TARGET_WINDOW", base: targetWindow || null },
      { scope: "DIAGNOSTIC_WINDOW", base: root }
    ];

    const candidates = [];

    for (const scope of scopes) {
      if (!scope.base) continue;

      for (const path of aliases) {
        const authority = readPath(scope.base, path);
        if (!authority) continue;

        const receipt = getReceiptFromAuthority(authority) || {};
        const contract = firstKnown(contractOf(receipt), contractOf(authority));
        const receiptName = firstKnown(receiptOf(receipt), receiptOf(authority));
        const methods = authorityMethods(authority);

        candidates.push({
          observed: true,
          scope: scope.scope,
          path,
          contract,
          receipt: receiptName,
          contractRecognized: contractRecognized(contract, family),
          methodCount: methods.length,
          methods,
          receiptObject: clonePlain(receipt)
        });
      }
    }

    const selected =
      candidates.find((candidate) => candidate.scope === "TARGET_WINDOW" && candidate.contractRecognized) ||
      candidates.find((candidate) => candidate.scope === "TARGET_WINDOW" && candidate.contract !== "UNKNOWN") ||
      candidates.find((candidate) => candidate.scope === "TARGET_WINDOW") ||
      candidates.find((candidate) => candidate.contractRecognized) ||
      candidates.find((candidate) => candidate.contract !== "UNKNOWN") ||
      candidates[0] ||
      null;

    return {
      observed: Boolean(selected),
      scope: selected ? selected.scope : "NONE",
      path: selected ? selected.path : "NONE",
      contract: selected ? selected.contract : "UNKNOWN",
      receipt: selected ? selected.receipt : "UNKNOWN",
      contractRecognized: selected ? selected.contractRecognized : false,
      methodCount: selected ? selected.methodCount : 0,
      methods: selected ? selected.methods : [],
      receiptObject: selected ? clonePlain(selected.receiptObject) : {},
      candidates: candidates.map((candidate) => ({
        scope: candidate.scope,
        path: candidate.path,
        contract: candidate.contract,
        receipt: candidate.receipt,
        contractRecognized: candidate.contractRecognized,
        methodCount: candidate.methodCount
      }))
    };
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();

      return {
        left: safeNumber(rect.left),
        top: safeNumber(rect.top),
        right: safeNumber(rect.right),
        bottom: safeNumber(rect.bottom),
        width: safeNumber(rect.width),
        height: safeNumber(rect.height)
      };
    } catch (_error) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }
  }

  function rectNonzero(rect) {
    return Boolean(rect && rect.width > 0 && rect.height > 0);
  }

  function viewportIntersecting(targetWindow, rect) {
    if (!targetWindow || !rectNonzero(rect)) return false;

    const viewportWidth = safeNumber(targetWindow.innerWidth, 0);
    const viewportHeight = safeNumber(targetWindow.innerHeight, 0);

    if (!viewportWidth || !viewportHeight) return false;

    return !(
      rect.right <= 0 ||
      rect.bottom <= 0 ||
      rect.left >= viewportWidth ||
      rect.top >= viewportHeight
    );
  }

  function cssSummary(targetWindow, element) {
    const unavailable = {
      readable: false,
      visible: false,
      display: "UNKNOWN",
      visibility: "UNKNOWN",
      opacity: "UNKNOWN",
      position: "UNKNOWN",
      zIndex: "UNKNOWN",
      pointerEvents: "UNKNOWN",
      transform: "UNKNOWN",
      overflow: "UNKNOWN",
      overflowX: "UNKNOWN",
      overflowY: "UNKNOWN",
      contain: "UNKNOWN",
      contentVisibility: "UNKNOWN",
      width: "UNKNOWN",
      height: "UNKNOWN",
      minWidth: "UNKNOWN",
      minHeight: "UNKNOWN",
      maxWidth: "UNKNOWN",
      maxHeight: "UNKNOWN",
      flex: "UNKNOWN",
      flexBasis: "UNKNOWN",
      flexGrow: "UNKNOWN",
      flexShrink: "UNKNOWN",
      alignItems: "UNKNOWN",
      alignSelf: "UNKNOWN",
      justifyContent: "UNKNOWN",
      boxSizing: "UNKNOWN",
      aspectRatio: "UNKNOWN",
      gridArea: "UNKNOWN",
      gridColumn: "UNKNOWN",
      gridRow: "UNKNOWN",
      margin: "UNKNOWN",
      padding: "UNKNOWN",
      border: "UNKNOWN"
    };

    if (!targetWindow || !element || !isFunction(targetWindow.getComputedStyle)) {
      return unavailable;
    }

    try {
      const style = targetWindow.getComputedStyle(element);
      const display = safeString(style.display, "UNKNOWN");
      const visibility = safeString(style.visibility, "UNKNOWN");
      const opacity = safeString(style.opacity, "UNKNOWN");

      return {
        readable: true,
        visible: Boolean(
          display !== "none" &&
          visibility !== "hidden" &&
          visibility !== "collapse" &&
          safeNumber(opacity, 1) > 0
        ),
        display,
        visibility,
        opacity,
        position: safeString(style.position, "UNKNOWN"),
        zIndex: safeString(style.zIndex, "UNKNOWN"),
        pointerEvents: safeString(style.pointerEvents, "UNKNOWN"),
        transform: safeString(style.transform, "UNKNOWN"),
        overflow: safeString(style.overflow, "UNKNOWN"),
        overflowX: safeString(style.overflowX, "UNKNOWN"),
        overflowY: safeString(style.overflowY, "UNKNOWN"),
        contain: safeString(style.contain, "UNKNOWN"),
        contentVisibility: safeString(style.contentVisibility, "UNKNOWN"),
        width: safeString(style.width, "UNKNOWN"),
        height: safeString(style.height, "UNKNOWN"),
        minWidth: safeString(style.minWidth, "UNKNOWN"),
        minHeight: safeString(style.minHeight, "UNKNOWN"),
        maxWidth: safeString(style.maxWidth, "UNKNOWN"),
        maxHeight: safeString(style.maxHeight, "UNKNOWN"),
        flex: safeString(style.flex, "UNKNOWN"),
        flexBasis: safeString(style.flexBasis, "UNKNOWN"),
        flexGrow: safeString(style.flexGrow, "UNKNOWN"),
        flexShrink: safeString(style.flexShrink, "UNKNOWN"),
        alignItems: safeString(style.alignItems, "UNKNOWN"),
        alignSelf: safeString(style.alignSelf, "UNKNOWN"),
        justifyContent: safeString(style.justifyContent, "UNKNOWN"),
        boxSizing: safeString(style.boxSizing, "UNKNOWN"),
        aspectRatio: safeString(style.aspectRatio, "UNKNOWN"),
        gridArea: safeString(style.gridArea, "UNKNOWN"),
        gridColumn: safeString(style.gridColumn, "UNKNOWN"),
        gridRow: safeString(style.gridRow, "UNKNOWN"),
        margin: safeString(style.margin, "UNKNOWN"),
        padding: safeString(style.padding, "UNKNOWN"),
        border: safeString(style.border, "UNKNOWN")
      };
    } catch (_error) {
      return {
        ...unavailable,
        display: "UNREADABLE",
        visibility: "UNREADABLE",
        opacity: "UNREADABLE",
        position: "UNREADABLE",
        width: "UNREADABLE",
        height: "UNREADABLE"
      };
    }
  }

  function elementDescriptor(element, index = 0) {
    if (!element) return "NONE";

    const tag = safeString(element.tagName, "UNKNOWN").toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    let classes = "";

    try {
      classes =
        element.classList && element.classList.length
          ? `.${Array.from(element.classList).slice(0, 6).join(".")}`
          : "";
    } catch (_error) {}

    return `${tag}${id}${classes}${index ? `[${index}]` : ""}` || "UNKNOWN_ELEMENT";
  }

  function containsOrEquals(parent, child) {
    if (!parent || !child) return false;
    if (parent === child) return true;

    try {
      return Boolean(parent.contains(child));
    } catch (_error) {
      return false;
    }
  }

  function numberFromStyleSize(value) {
    const text = safeString(value);
    const match = text.match(/^(-?\d+(?:\.\d+)?)px$/i);
    return match ? safeNumber(match[1], 0) : null;
  }

  function usedSizeStatus(summary) {
    if (!summary || summary.exists === false) {
      return {
        clean: false,
        class: "ELEMENT_NOT_FOUND",
        firstMissingFact: "ELEMENT_PRESENT",
        reason: "ELEMENT_NOT_FOUND"
      };
    }

    if (!summary.cssReadable) {
      return {
        clean: false,
        class: "COMPUTED_STYLE_UNREADABLE",
        firstMissingFact: "COMPUTED_STYLE_READABLE",
        reason: "COMPUTED_STYLE_UNREADABLE"
      };
    }

    if (summary.computedDisplay === "none") {
      return {
        clean: false,
        class: "DISPLAY_NONE",
        firstMissingFact: "COMPUTED_DISPLAY_VISIBLE",
        reason: "COMPUTED_DISPLAY_NONE"
      };
    }

    if (summary.computedVisibility === "hidden" || summary.computedVisibility === "collapse") {
      return {
        clean: false,
        class: "VISIBILITY_HIDDEN_OR_COLLAPSE",
        firstMissingFact: "COMPUTED_VISIBILITY_VISIBLE",
        reason: `COMPUTED_VISIBILITY_${summary.computedVisibility}`
      };
    }

    if (safeNumber(summary.computedOpacity, 1) <= 0) {
      return {
        clean: false,
        class: "OPACITY_ZERO",
        firstMissingFact: "COMPUTED_OPACITY_NONZERO",
        reason: "COMPUTED_OPACITY_ZERO"
      };
    }

    if (!summary.rectNonzero) {
      const cssWidth = numberFromStyleSize(summary.computedWidth);
      const cssHeight = numberFromStyleSize(summary.computedHeight);

      if (cssWidth === 0 || cssHeight === 0) {
        return {
          clean: false,
          class: "CSS_USED_SIZE_ZERO",
          firstMissingFact: cssWidth === 0 ? "COMPUTED_WIDTH_NONZERO" : "COMPUTED_HEIGHT_NONZERO",
          reason: `COMPUTED_WIDTH:${summary.computedWidth}_COMPUTED_HEIGHT:${summary.computedHeight}`
        };
      }

      if (!summary.offsetSizeNonzero && !summary.clientSizeNonzero) {
        return {
          clean: false,
          class: "RECT_OFFSET_CLIENT_SIZE_ZERO",
          firstMissingFact: "RECT_OR_OFFSET_OR_CLIENT_SIZE_NONZERO",
          reason: `RECT:${summary.rectWidth}x${summary.rectHeight}_OFFSET:${summary.offsetWidth}x${summary.offsetHeight}_CLIENT:${summary.clientWidth}x${summary.clientHeight}`
        };
      }

      return {
        clean: false,
        class: "BOUNDING_RECT_ZERO",
        firstMissingFact: "BOUNDING_RECT_NONZERO",
        reason: `RECT:${summary.rectWidth}x${summary.rectHeight}`
      };
    }

    return {
      clean: true,
      class: "USED_SIZE_FACTS_PRESENT",
      firstMissingFact: "NONE",
      reason: `RECT:${summary.rectWidth}x${summary.rectHeight}`
    };
  }

  function measureElement(targetWindow, element, label, index = 0) {
    const rect = getRect(element);
    const css = cssSummary(targetWindow, element);

    const offsetWidth = element ? safeNumber(element.offsetWidth, 0) : 0;
    const offsetHeight = element ? safeNumber(element.offsetHeight, 0) : 0;
    const clientWidth = element ? safeNumber(element.clientWidth, 0) : 0;
    const clientHeight = element ? safeNumber(element.clientHeight, 0) : 0;
    const scrollWidth = element ? safeNumber(element.scrollWidth, 0) : 0;
    const scrollHeight = element ? safeNumber(element.scrollHeight, 0) : 0;

    const summary = {
      label,
      index,
      exists: Boolean(element),
      descriptor: elementDescriptor(element, index),
      id: element && element.id ? element.id : "NONE",
      tagName: element ? safeString(element.tagName, "UNKNOWN") : "NONE",
      className: element ? bounded(element.className || "NONE", 600) : "NONE",
      parentDescriptor: elementDescriptor(element && element.parentElement),
      childElementCount: element ? safeNumber(element.childElementCount, 0) : 0,

      rectLeft: rect.left,
      rectTop: rect.top,
      rectRight: rect.right,
      rectBottom: rect.bottom,
      rectWidth: rect.width,
      rectHeight: rect.height,
      rectNonzero: rectNonzero(rect),

      offsetWidth,
      offsetHeight,
      offsetSizeNonzero: offsetWidth > 0 && offsetHeight > 0,
      clientWidth,
      clientHeight,
      clientSizeNonzero: clientWidth > 0 && clientHeight > 0,
      scrollWidth,
      scrollHeight,
      scrollSizeNonzero: scrollWidth > 0 && scrollHeight > 0,

      cssReadable: css.readable,
      computedVisible: css.visible,
      computedDisplay: css.display,
      computedVisibility: css.visibility,
      computedOpacity: css.opacity,
      computedPosition: css.position,
      computedZIndex: css.zIndex,
      computedPointerEvents: css.pointerEvents,
      computedTransform: css.transform,
      computedOverflow: css.overflow,
      computedOverflowX: css.overflowX,
      computedOverflowY: css.overflowY,
      computedContain: css.contain,
      computedContentVisibility: css.contentVisibility,
      computedWidth: css.width,
      computedHeight: css.height,
      computedMinWidth: css.minWidth,
      computedMinHeight: css.minHeight,
      computedMaxWidth: css.maxWidth,
      computedMaxHeight: css.maxHeight,
      computedFlex: css.flex,
      computedFlexBasis: css.flexBasis,
      computedFlexGrow: css.flexGrow,
      computedFlexShrink: css.flexShrink,
      computedAlignItems: css.alignItems,
      computedAlignSelf: css.alignSelf,
      computedJustifyContent: css.justifyContent,
      computedBoxSizing: css.boxSizing,
      computedAspectRatio: css.aspectRatio,
      computedGridArea: css.gridArea,
      computedGridColumn: css.gridColumn,
      computedGridRow: css.gridRow,
      computedMargin: css.margin,
      computedPadding: css.padding,
      computedBorder: css.border
    };

    const status = usedSizeStatus(summary);

    return {
      ...summary,
      usedSizeClean: status.clean,
      usedSizeClass: status.class,
      usedSizeFirstMissingFact: status.firstMissingFact,
      usedSizeReason: status.reason
    };
  }

  function parentChain(targetWindow, element, stopAt) {
    const chain = [];
    let cursor = element || null;
    let depth = 0;

    while (cursor && depth < 24) {
      const summary = measureElement(targetWindow, cursor, "PARENT_CHAIN_NODE", depth);
      const parent = cursor.parentElement || null;

      chain.push({
        depth,
        ...summary,
        parentDescriptor: elementDescriptor(parent),
        isStopNode: Boolean(stopAt && cursor === stopAt)
      });

      if (cursor === stopAt) break;
      cursor = parent;
      depth += 1;
    }

    return chain;
  }

  function classifyParentChain(chain) {
    if (!Array.isArray(chain) || !chain.length) {
      return {
        status: "PARENT_CHAIN_UNAVAILABLE",
        clean: false,
        firstCollapsedDepth: -1,
        firstCollapsedDescriptor: "NONE",
        firstCollapsedMissingFact: "PARENT_CHAIN_AVAILABLE",
        firstHiddenDepth: -1,
        firstHiddenDescriptor: "NONE",
        firstContainmentRiskDepth: -1,
        firstContainmentRiskDescriptor: "NONE"
      };
    }

    const collapsed = chain.find((item) => item.rectNonzero === false);
    const hidden = chain.find((item) => item.computedVisible === false);
    const containmentRisk = chain.find((item) =>
      /paint|layout|strict|content/i.test(item.computedContain) ||
      /hidden|auto/i.test(item.computedContentVisibility)
    );

    const status =
      collapsed || hidden || containmentRisk
        ? "PARENT_CHAIN_HAS_LAYOUT_RISK"
        : "PARENT_CHAIN_USED_SIZE_FACTS_PRESENT";

    return {
      status,
      clean: !collapsed && !hidden,
      firstCollapsedDepth: collapsed ? collapsed.depth : -1,
      firstCollapsedDescriptor: collapsed ? collapsed.descriptor : "NONE",
      firstCollapsedWidth: collapsed ? collapsed.rectWidth : 0,
      firstCollapsedHeight: collapsed ? collapsed.rectHeight : 0,
      firstCollapsedComputedWidth: collapsed ? collapsed.computedWidth : "NONE",
      firstCollapsedComputedHeight: collapsed ? collapsed.computedHeight : "NONE",
      firstCollapsedMissingFact: collapsed ? collapsed.usedSizeFirstMissingFact : "NONE",
      firstCollapsedClass: collapsed ? collapsed.usedSizeClass : "NONE",
      firstHiddenDepth: hidden ? hidden.depth : -1,
      firstHiddenDescriptor: hidden ? hidden.descriptor : "NONE",
      firstHiddenDisplay: hidden ? hidden.computedDisplay : "NONE",
      firstHiddenVisibility: hidden ? hidden.computedVisibility : "NONE",
      firstHiddenOpacity: hidden ? hidden.computedOpacity : "NONE",
      firstContainmentRiskDepth: containmentRisk ? containmentRisk.depth : -1,
      firstContainmentRiskDescriptor: containmentRisk ? containmentRisk.descriptor : "NONE",
      firstContainmentRiskContain: containmentRisk ? containmentRisk.computedContain : "NONE",
      firstContainmentRiskContentVisibility:
        containmentRisk ? containmentRisk.computedContentVisibility : "NONE"
    };
  }

  function getCanvas2d(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) {
      return { ready: false, ctx: null, status: "CANVAS_GET_CONTEXT_UNAVAILABLE" };
    }

    try {
      const ctx = canvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true
      });

      return {
        ready: Boolean(ctx),
        ctx,
        status: ctx ? "CONTEXT_2D_READY" : "CONTEXT_2D_NULL"
      };
    } catch (error) {
      return {
        ready: false,
        ctx: null,
        status: `CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 600)}`
      };
    }
  }

  function samplePixels(canvas, ctx) {
    if (!canvas || !ctx) {
      return {
        status: "NO_PIXEL_SAMPLE",
        readable: false,
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        averageBrightness: 0,
        reason: "CANVAS_OR_CONTEXT_UNAVAILABLE"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0 || !isFunction(ctx.getImageData)) {
      return {
        status: "NO_PIXEL_SAMPLE",
        readable: false,
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        averageBrightness: 0,
        reason: "CANVAS_INTERNAL_SIZE_OR_GET_IMAGE_DATA_UNAVAILABLE"
      };
    }

    try {
      const points = [
        [0.5, 0.5],
        [0.35, 0.35],
        [0.65, 0.35],
        [0.35, 0.65],
        [0.65, 0.65],
        [0.5, 0.18],
        [0.5, 0.82],
        [0.18, 0.5],
        [0.82, 0.5],
        [0.12, 0.12],
        [0.88, 0.12],
        [0.12, 0.88],
        [0.88, 0.88]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;
      let brightnessTotal = 0;
      const unique = new Set();

      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(width - 1, Math.floor(width * px)));
        const y = Math.max(0, Math.min(height - 1, Math.floor(height * py)));
        const data = ctx.getImageData(x, y, 1, 1).data;

        sampleCount += 1;

        const red = data[0] || 0;
        const green = data[1] || 0;
        const blue = data[2] || 0;
        const alpha = data[3] || 0;
        const brightness = (red + green + blue) / 3;

        brightnessTotal += brightness;

        if (alpha > 0) alphaPixelCount += 1;
        if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) visiblePixelCount += 1;

        unique.add(`${red},${green},${blue},${alpha}`);
      }

      const visible = visiblePixelCount > 0;
      const averageBrightness = sampleCount ? Math.round(brightnessTotal / sampleCount) : 0;

      return {
        status: visible
          ? "PIXEL_SAMPLE_VISIBLE"
          : alphaPixelCount > 0
            ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
            : "PIXEL_SAMPLE_BLANK",
        readable: true,
        visible,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        uniqueColorCount: unique.size,
        averageBrightness,
        reason: visible
          ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
          : alphaPixelCount > 0
            ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
            : "NO_VISIBLE_NON_BLANK_PIXELS_FOUND"
      };
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        readable: false,
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        averageBrightness: 0,
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function canvasDataset(canvas) {
    if (!canvas || !canvas.dataset) {
      return {
        contract: "UNKNOWN",
        receipt: "UNKNOWN",
        visibleCanvas: "UNKNOWN",
        expressionSurface: "UNKNOWN",
        canonicalVisibleCanvas: "UNKNOWN",
        canvasHub: "UNKNOWN",
        fallback: "UNKNOWN",
        cartoon: "UNKNOWN",
        downstreamObserved: "UNKNOWN",
        downstreamLatched: "UNKNOWN",
        selectionMode: "UNKNOWN",
        pointerSurfaceObserved: "UNKNOWN",
        pointerSurfaceLatched: "UNKNOWN",
        pointerInspectObserved: "UNKNOWN"
      };
    }

    return {
      contract: firstKnown(
        canvas.dataset.hearthCanvasContract,
        canvas.dataset.contract,
        canvas.dataset.hearthCanvasRenewalContract,
        canvas.dataset.hearthCanvasCurrentParentContract
      ),
      receipt: firstKnown(
        canvas.dataset.hearthCanvasReceipt,
        canvas.dataset.receipt,
        canvas.dataset.hearthCanvasRenewalReceipt,
        canvas.dataset.hearthCanvasExpressionBridgeReceipt
      ),
      visibleCanvas: firstKnown(canvas.dataset.hearthVisibleCanvas),
      expressionSurface: firstKnown(canvas.dataset.hearthExpressionSurface),
      canonicalVisibleCanvas: firstKnown(canvas.dataset.hearthCanonicalVisibleCanvas),
      canvasHub: firstKnown(canvas.dataset.hearthCanvasHub),
      fallback: firstKnown(canvas.dataset.hearthFallback, canvas.dataset.fallback),
      cartoon: firstKnown(canvas.dataset.hearthCartoon, canvas.dataset.cartoon),
      downstreamObserved: firstKnown(canvas.dataset.hearthDownstreamSurfaceObserved),
      downstreamLatched: firstKnown(canvas.dataset.hearthDownstreamSurfaceLatched),
      selectionMode: firstKnown(canvas.dataset.hearthCanvasSelectionMode),
      pointerSurfaceObserved: firstKnown(
        canvas.dataset.hearthPointerSurfaceObserved,
        canvas.dataset.hearthPointerSurfaceBishopObserved,
        canvas.dataset.hearthCanvasFingerSurfaceObserved
      ),
      pointerSurfaceLatched: firstKnown(
        canvas.dataset.hearthPointerSurfaceLatched,
        canvas.dataset.hearthPointerSurfaceBishopLatched,
        canvas.dataset.hearthCanvasFingerSurfaceLatched
      ),
      pointerInspectObserved: firstKnown(
        canvas.dataset.hearthPointerInspectObserved,
        canvas.dataset.hearthCanvasFingerInspectObserved
      )
    };
  }

  function fallbackSignals(targetDocument, element) {
    const text = bounded(
      [
        element && element.getAttribute ? element.getAttribute("aria-label") : "",
        element && element.getAttribute ? element.getAttribute("title") : "",
        element && element.getAttribute ? element.getAttribute("data-label") : "",
        element && element.dataset ? JSON.stringify(element.dataset) : "",
        targetDocument && targetDocument.body ? targetDocument.body.innerText : ""
      ].join(" "),
      9000
    );

    const matched = /fallback|cartoon|placeholder|static|demo|sample|temporary/i.test(text);

    return {
      fallbackTextObserved: matched,
      fallbackTextBasis: matched
        ? "FALLBACK_OR_CARTOON_TEXT_PATTERN_OBSERVED"
        : "NO_FALLBACK_TEXT_PATTERN_OBSERVED"
    };
  }

  function describeCanvas(targetWindow, targetDocument, canvas, index, selector, canonicalMount, canonicalFrame) {
    const measured = measureElement(targetWindow, canvas, "CANVAS", index);
    const ctx = getCanvas2d(canvas);
    const pixels = samplePixels(canvas, ctx.ctx);
    const dataset = canvasDataset(canvas);
    const fallback = fallbackSignals(targetDocument, canvas);

    const internalSizeNonzero = Boolean(
      canvas && safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0
    );

    const viewportOk = viewportIntersecting(targetWindow, {
      left: measured.rectLeft,
      top: measured.rectTop,
      right: measured.rectRight,
      bottom: measured.rectBottom,
      width: measured.rectWidth,
      height: measured.rectHeight
    });

    const inMount = Boolean(canonicalMount && canvas && containsOrEquals(canonicalMount, canvas));
    const inFrame = Boolean(canonicalFrame && canvas && containsOrEquals(canonicalFrame, canvas));

    const bufferCssWidthRatio =
      measured.rectWidth > 0 ? safeNumber(canvas && canvas.width, 0) / measured.rectWidth : 0;
    const bufferCssHeightRatio =
      measured.rectHeight > 0 ? safeNumber(canvas && canvas.height, 0) / measured.rectHeight : 0;

    return {
      ...measured,
      index,
      selector: selector || "canvas",
      datasetContract: dataset.contract,
      datasetReceipt: dataset.receipt,
      datasetVisibleCanvas: dataset.visibleCanvas,
      datasetExpressionSurface: dataset.expressionSurface,
      datasetCanonicalVisibleCanvas: dataset.canonicalVisibleCanvas,
      datasetCanvasHub: dataset.canvasHub,
      datasetFallback: dataset.fallback,
      datasetCartoon: dataset.cartoon,
      datasetDownstreamObserved: dataset.downstreamObserved,
      datasetDownstreamLatched: dataset.downstreamLatched,
      datasetSelectionMode: dataset.selectionMode,
      datasetPointerSurfaceObserved: dataset.pointerSurfaceObserved,
      datasetPointerSurfaceLatched: dataset.pointerSurfaceLatched,
      datasetPointerInspectObserved: dataset.pointerInspectObserved,
      inCanonicalMount: inMount,
      inCanonicalFrame: inFrame,
      widthAttribute: canvas ? safeNumber(canvas.width, 0) : 0,
      heightAttribute: canvas ? safeNumber(canvas.height, 0) : 0,
      internalSizeNonzero,
      bufferCssWidthRatio,
      bufferCssHeightRatio,
      viewportIntersecting: viewportOk,
      context2dReady: ctx.ready,
      context2dStatus: ctx.status,
      pixelSampleStatus: pixels.status,
      pixelSampleReadable: pixels.readable,
      pixelVisible: pixels.visible,
      pixelSampleCount: pixels.sampleCount,
      visiblePixelCount: pixels.visiblePixelCount,
      alphaPixelCount: pixels.alphaPixelCount,
      uniqueColorCount: pixels.uniqueColorCount,
      averageBrightness: pixels.averageBrightness,
      pixelSampleReason: pixels.reason,
      fallbackTextObserved: fallback.fallbackTextObserved,
      fallbackTextBasis: fallback.fallbackTextBasis,
      surfaceAdmissible: Boolean(
        internalSizeNonzero &&
        measured.rectNonzero &&
        measured.computedVisible &&
        viewportOk &&
        ctx.ready
      ),
      surfaceVisibleAdmissible: Boolean(
        internalSizeNonzero &&
        measured.rectNonzero &&
        measured.computedVisible &&
        viewportOk &&
        ctx.ready &&
        pixels.visible
      )
    };
  }

  function inspectLayering(targetWindow, targetDocument, canonicalCanvas) {
    if (!targetDocument || !targetWindow || !canonicalCanvas) {
      return {
        status: "NOT_EVALUATED",
        centerElementDescriptor: "NONE",
        centerElementIsCanonicalCanvas: false,
        centerElementContainsCanonicalCanvas: false,
        canonicalCanvasContainsCenterElement: false,
        possibleLayerBlocker: "UNKNOWN"
      };
    }

    const rect = getRect(canonicalCanvas);
    if (!rectNonzero(rect)) {
      return {
        status: "CANONICAL_RECT_ZERO",
        centerElementDescriptor: "NONE",
        centerElementIsCanonicalCanvas: false,
        centerElementContainsCanonicalCanvas: false,
        canonicalCanvasContainsCenterElement: false,
        possibleLayerBlocker: "UNKNOWN"
      };
    }

    try {
      const x = Math.max(1, Math.floor(rect.left + rect.width / 2));
      const y = Math.max(1, Math.floor(rect.top + rect.height / 2));
      const element = isFunction(targetDocument.elementFromPoint)
        ? targetDocument.elementFromPoint(x, y)
        : null;

      const same = element === canonicalCanvas;
      const contains = containsOrEquals(element, canonicalCanvas);
      const canvasContains = containsOrEquals(canonicalCanvas, element);
      const descriptor = elementDescriptor(element);

      return {
        status: "EVALUATED",
        centerX: x,
        centerY: y,
        centerElementDescriptor: descriptor,
        centerElementIsCanonicalCanvas: same,
        centerElementContainsCanonicalCanvas: contains,
        canonicalCanvasContainsCenterElement: canvasContains,
        possibleLayerBlocker: same || canvasContains ? "false" : descriptor
      };
    } catch (error) {
      return {
        status: "UNREADABLE",
        centerElementDescriptor: "UNKNOWN",
        centerElementIsCanonicalCanvas: false,
        centerElementContainsCanonicalCanvas: false,
        canonicalCanvasContainsCenterElement: false,
        possibleLayerBlocker: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function findStage(targetDocument) {
    return firstElement(targetDocument, STAGE_SELECTORS);
  }

  function findCanonicalCanvas(targetDocument) {
    return firstElement(targetDocument, CANONICAL_CANVAS_SELECTORS);
  }

  function makeBoundaryRow(input) {
    const clean = Boolean(input.clean);

    return {
      order: input.order || 0,
      id: input.id || "UNKNOWN_BOUNDARY",
      boundaryType: input.boundaryType || "UNKNOWN",
      from: input.from || "UNKNOWN",
      to: input.to || "UNKNOWN",
      fromFile: input.fromFile || "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      toFile: input.toFile || "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      observed: Boolean(input.observed),
      blocking: input.blocking !== false,
      clean,
      status: input.status || (clean ? "BOUNDARY_CLEAN" : "BOUNDARY_UNRESOLVED"),
      class: input.class || (clean ? "BOUNDARY_FACTS_PRESENT" : "BOUNDARY_FACT_MISSING"),
      firstMissingProof: input.firstMissingProof || (clean ? "NONE" : "BOUNDARY_PROOF_MISSING"),
      firstMissingFact: input.firstMissingFact || (clean ? "NONE" : "BOUNDARY_FACT_MISSING"),
      observedFacts: input.observedFacts || [],
      missingFacts: input.missingFacts || [],
      diagnosticFacts: input.diagnosticFacts || {},
      singleCausalFileProven: Boolean(input.singleCausalFileProven),
      recommendedOwner: input.recommendedOwner || "BOUNDARY_FACTS_ONLY",
      recommendedFile: input.singleCausalFileProven
        ? input.recommendedFile || "UNKNOWN_SINGLE_CAUSAL_FILE"
        : "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      recommendedAction: input.recommendedAction || "READ_BOUNDARY_FACTS",
      reason: input.reason || "UNKNOWN",
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function compactElementFacts(summary) {
    if (!summary) return {};
    return {
      exists: summary.exists,
      descriptor: summary.descriptor,
      parentDescriptor: summary.parentDescriptor,
      rectNonzero: summary.rectNonzero,
      rectWidth: summary.rectWidth,
      rectHeight: summary.rectHeight,
      offsetWidth: summary.offsetWidth,
      offsetHeight: summary.offsetHeight,
      clientWidth: summary.clientWidth,
      clientHeight: summary.clientHeight,
      computedDisplay: summary.computedDisplay,
      computedVisibility: summary.computedVisibility,
      computedOpacity: summary.computedOpacity,
      computedPosition: summary.computedPosition,
      computedOverflow: summary.computedOverflow,
      computedContain: summary.computedContain,
      computedContentVisibility: summary.computedContentVisibility,
      computedWidth: summary.computedWidth,
      computedHeight: summary.computedHeight,
      computedMinWidth: summary.computedMinWidth,
      computedMinHeight: summary.computedMinHeight,
      computedFlex: summary.computedFlex,
      computedFlexBasis: summary.computedFlexBasis,
      computedBoxSizing: summary.computedBoxSizing,
      usedSizeClean: summary.usedSizeClean,
      usedSizeClass: summary.usedSizeClass,
      usedSizeFirstMissingFact: summary.usedSizeFirstMissingFact,
      usedSizeReason: summary.usedSizeReason
    };
  }

  function buildLayoutBoundaryRows(snapshot) {
    const rows = [];
    const stage = snapshot.stageSummary;
    const mount = snapshot.mountSummary;
    const frame = snapshot.frameSummary;
    const canvas = snapshot.canonicalSummary || {};
    const mountChain = snapshot.mountParentChainClassification || {};
    const canvasChain = snapshot.canonicalParentChainClassification || {};
    const layering = snapshot.layering || {};

    rows.push(makeBoundaryRow({
      order: 1,
      id: "TARGET_CONTEXT_ACCESS",
      boundaryType: "CONTEXT",
      from: "DIAGNOSTIC_PROBE",
      to: "TARGET_DOCUMENT",
      observed: snapshot.context.targetAvailable,
      clean: snapshot.context.targetAvailable,
      class: snapshot.context.targetAvailable ? "TARGET_CONTEXT_AVAILABLE" : "TARGET_CONTEXT_UNAVAILABLE",
      firstMissingProof: snapshot.context.targetAvailable ? "NONE" : "TARGET_WINDOW_OR_DOCUMENT_ACCESS",
      firstMissingFact: snapshot.context.targetAvailable ? "NONE" : "TARGET_DOCUMENT_AVAILABLE",
      observedFacts: [
        `TARGET_CONTEXT_SOURCE:${snapshot.context.targetSource}`,
        `TARGET_ACCESS_ERROR:${snapshot.context.targetAccessError}`
      ],
      missingFacts: snapshot.context.targetAvailable ? [] : ["targetWindow", "targetDocument"],
      diagnosticFacts: clonePlain(snapshot.context),
      recommendedOwner: "DIAGNOSTIC_TARGET_ACCESS_BOUNDARY",
      recommendedAction: snapshot.context.targetAvailable
        ? "CONTINUE_LAYOUT_BOUNDARY_FACT_READ"
        : "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_PROBE",
      reason: snapshot.context.targetAvailable
        ? "TARGET_DOCUMENT_AVAILABLE"
        : "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE"
    }));

    rows.push(makeBoundaryRow({
      order: 2,
      id: "STAGE_SELECTION_BOUNDARY",
      boundaryType: "LAYOUT",
      from: "TARGET_DOCUMENT",
      to: "HEARTH_STAGE",
      observed: stage.exists,
      clean: stage.exists,
      blocking: false,
      class: stage.exists ? "STAGE_ELEMENT_SELECTED" : "STAGE_ELEMENT_NOT_SELECTED",
      firstMissingProof: stage.exists ? "NONE" : "STAGE_SELECTOR_MATCH",
      firstMissingFact: stage.exists ? "NONE" : "STAGE_ELEMENT_PRESENT",
      observedFacts: [
        `STAGE_SELECTOR:${snapshot.stageSelector}`,
        `STAGE_DESCRIPTOR:${stage.descriptor}`
      ],
      missingFacts: stage.exists ? [] : ["stage element selector match"],
      diagnosticFacts: compactElementFacts(stage),
      recommendedOwner: "HTML_SHELL_OR_STAGE_LAYOUT_BOUNDARY",
      recommendedAction: stage.exists
        ? "READ_STAGE_USED_SIZE_FACTS"
        : "CONFIRM_STAGE_SELECTOR_OR_ACCEPT_MOUNT_AS_PRIMARY_SURFACE_CONTAINER",
      reason: stage.exists ? "STAGE_ELEMENT_OBSERVED" : "NO_STAGE_SELECTOR_MATCHED"
    }));

    rows.push(makeBoundaryRow({
      order: 3,
      id: "STAGE_USED_SIZE_BOUNDARY",
      boundaryType: "LAYOUT_USED_SIZE",
      from: "HEARTH_STAGE",
      to: "STAGE_BOX",
      observed: stage.exists,
      clean: !stage.exists || stage.usedSizeClean,
      blocking: false,
      class: stage.exists ? stage.usedSizeClass : "STAGE_NOT_OBSERVED_NON_BLOCKING_IF_MOUNT_EXISTS",
      firstMissingProof: stage.usedSizeClean ? "NONE" : "STAGE_USED_SIZE_PROOF",
      firstMissingFact: stage.usedSizeFirstMissingFact,
      observedFacts: [
        `STAGE_RECT:${stage.rectWidth}x${stage.rectHeight}`,
        `STAGE_COMPUTED_SIZE:${stage.computedWidth}x${stage.computedHeight}`,
        `STAGE_DISPLAY:${stage.computedDisplay}`
      ],
      missingFacts: stage.usedSizeClean ? [] : [stage.usedSizeFirstMissingFact],
      diagnosticFacts: compactElementFacts(stage),
      recommendedOwner: "HTML_SHELL_OR_STAGE_LAYOUT_BOUNDARY",
      recommendedAction: stage.usedSizeClean
        ? "CONTINUE_TO_MOUNT_BOUNDARY"
        : "READ_STAGE_PARENT_USED_SIZE_FACTS",
      reason: stage.usedSizeReason
    }));

    rows.push(makeBoundaryRow({
      order: 4,
      id: "MOUNT_SELECTION_BOUNDARY",
      boundaryType: "LAYOUT",
      from: "TARGET_DOCUMENT",
      to: "CANONICAL_MOUNT",
      observed: mount.exists,
      clean: mount.exists,
      class: mount.exists ? "CANONICAL_MOUNT_FOUND" : "CANONICAL_MOUNT_NOT_FOUND",
      firstMissingProof: mount.exists ? "NONE" : "CANONICAL_MOUNT_SELECTOR_MATCH",
      firstMissingFact: mount.exists ? "NONE" : "CANONICAL_MOUNT_PRESENT",
      observedFacts: [
        `MOUNT_SELECTOR:${CANONICAL_MOUNT_SELECTOR}`,
        `MOUNT_DESCRIPTOR:${mount.descriptor}`
      ],
      missingFacts: mount.exists ? [] : [CANONICAL_MOUNT_SELECTOR],
      diagnosticFacts: compactElementFacts(mount),
      recommendedOwner: "HTML_SHELL_OR_CANVAS_PLACEMENT_BOUNDARY",
      recommendedAction: mount.exists
        ? "READ_MOUNT_USED_SIZE_FACTS"
        : "CONFIRM_CANONICAL_MOUNT_EXISTS_IN_TARGET_DOM",
      reason: mount.exists
        ? "#hearthCanvasMount_OBSERVED"
        : "#hearthCanvasMount_NOT_FOUND"
    }));

    rows.push(makeBoundaryRow({
      order: 5,
      id: "MOUNT_USED_SIZE_BOUNDARY",
      boundaryType: "LAYOUT_USED_SIZE",
      from: "CANONICAL_MOUNT",
      to: "MOUNT_BOX",
      observed: mount.exists,
      clean: mount.exists && mount.usedSizeClean,
      class: mount.exists ? mount.usedSizeClass : "CANONICAL_MOUNT_NOT_FOUND",
      firstMissingProof: mount.usedSizeClean ? "NONE" : "CANONICAL_MOUNT_USED_SIZE_PROOF",
      firstMissingFact: mount.usedSizeFirstMissingFact,
      observedFacts: [
        `MOUNT_RECT:${mount.rectWidth}x${mount.rectHeight}`,
        `MOUNT_OFFSET:${mount.offsetWidth}x${mount.offsetHeight}`,
        `MOUNT_CLIENT:${mount.clientWidth}x${mount.clientHeight}`,
        `MOUNT_COMPUTED_SIZE:${mount.computedWidth}x${mount.computedHeight}`,
        `MOUNT_DISPLAY:${mount.computedDisplay}`,
        `MOUNT_POSITION:${mount.computedPosition}`
      ],
      missingFacts: mount.usedSizeClean ? [] : [mount.usedSizeFirstMissingFact],
      diagnosticFacts: compactElementFacts(mount),
      recommendedOwner: "HTML_SHELL_OR_STAGE_LAYOUT_BOUNDARY",
      recommendedAction: mount.usedSizeClean
        ? "CONTINUE_TO_FRAME_BOUNDARY"
        : "READ_PARENT_CHAIN_AND_STAGE_USED_SIZE_FACTS",
      reason: mount.usedSizeReason
    }));

    rows.push(makeBoundaryRow({
      order: 6,
      id: "MOUNT_PARENT_CHAIN_USED_SIZE_BOUNDARY",
      boundaryType: "PARENT_CHAIN",
      from: "CANONICAL_MOUNT",
      to: "ANCESTOR_USED_SIZE_CHAIN",
      observed: Array.isArray(snapshot.mountParentChain) && snapshot.mountParentChain.length > 0,
      clean: mountChain.clean,
      class: mountChain.status || "PARENT_CHAIN_UNAVAILABLE",
      firstMissingProof: mountChain.clean ? "NONE" : "ANCESTOR_USED_SIZE_PROOF",
      firstMissingFact: mountChain.firstCollapsedMissingFact || "PARENT_CHAIN_FACTS",
      observedFacts: [
        `FIRST_COLLAPSED:${mountChain.firstCollapsedDescriptor}`,
        `FIRST_COLLAPSED_DEPTH:${mountChain.firstCollapsedDepth}`,
        `FIRST_COLLAPSED_SIZE:${mountChain.firstCollapsedWidth}x${mountChain.firstCollapsedHeight}`,
        `FIRST_COLLAPSED_COMPUTED_SIZE:${mountChain.firstCollapsedComputedWidth}x${mountChain.firstCollapsedComputedHeight}`
      ],
      missingFacts: mountChain.clean ? [] : [mountChain.firstCollapsedMissingFact || "ANCESTOR_RECT_NONZERO"],
      diagnosticFacts: clonePlain(mountChain),
      recommendedOwner: "HTML_SHELL_OR_STAGE_LAYOUT_BOUNDARY",
      recommendedAction: mountChain.clean
        ? "CONTINUE_TO_FRAME_BOUNDARY"
        : "READ_PARENT_CHAIN_AND_STAGE_USED_SIZE_FACTS",
      reason: mountChain.clean
        ? "MOUNT_PARENT_CHAIN_USED_SIZE_FACTS_PRESENT"
        : `PARENT_CHAIN_COLLAPSED_AT:${mountChain.firstCollapsedDescriptor}`
    }));

    rows.push(makeBoundaryRow({
      order: 7,
      id: "FRAME_SELECTION_BOUNDARY",
      boundaryType: "LAYOUT",
      from: "CANONICAL_MOUNT",
      to: "CANONICAL_RECT_LOCK_FRAME",
      observed: frame.exists,
      clean: frame.exists,
      class: frame.exists ? "CANONICAL_FRAME_FOUND" : "CANONICAL_FRAME_NOT_FOUND",
      firstMissingProof: frame.exists ? "NONE" : "CANONICAL_FRAME_SELECTOR_MATCH",
      firstMissingFact: frame.exists ? "NONE" : "CANONICAL_FRAME_PRESENT",
      observedFacts: [
        `FRAME_SELECTOR:${CANONICAL_FRAME_SELECTOR}`,
        `FRAME_DESCRIPTOR:${frame.descriptor}`
      ],
      missingFacts: frame.exists ? [] : [CANONICAL_FRAME_SELECTOR],
      diagnosticFacts: compactElementFacts(frame),
      recommendedOwner: "CANVAS_DOM_BINDING_BOUNDARY",
      recommendedAction: frame.exists
        ? "READ_FRAME_USED_SIZE_FACTS"
        : "CONFIRM_CANONICAL_RECT_LOCK_FRAME_EXISTS_UNDER_MOUNT",
      reason: frame.exists
        ? "#hearthCanvasRectLockFrame_OBSERVED"
        : "#hearthCanvasRectLockFrame_NOT_FOUND"
    }));

    rows.push(makeBoundaryRow({
      order: 8,
      id: "MOUNT_TO_FRAME_CONNECTION_BOUNDARY",
      boundaryType: "DOM_CONNECTION",
      from: "CANONICAL_MOUNT",
      to: "CANONICAL_RECT_LOCK_FRAME",
      observed: mount.exists && frame.exists,
      clean: Boolean(mount.exists && frame.exists && containsOrEquals(snapshot.canonicalMount, snapshot.canonicalFrame)),
      class: mount.exists && frame.exists && containsOrEquals(snapshot.canonicalMount, snapshot.canonicalFrame)
        ? "FRAME_INSIDE_MOUNT"
        : "FRAME_NOT_INSIDE_MOUNT_OR_UNOBSERVED",
      firstMissingProof: mount.exists && frame.exists ? "NONE" : "MOUNT_FRAME_CONNECTION_PROOF",
      firstMissingFact: mount.exists && frame.exists ? "NONE" : "MOUNT_AND_FRAME_PRESENT",
      observedFacts: [
        `MOUNT_FOUND:${mount.exists}`,
        `FRAME_FOUND:${frame.exists}`,
        `FRAME_IN_MOUNT:${containsOrEquals(snapshot.canonicalMount, snapshot.canonicalFrame)}`
      ],
      missingFacts: mount.exists && frame.exists ? [] : ["mount/frame DOM connection"],
      diagnosticFacts: {
        mountDescriptor: mount.descriptor,
        frameDescriptor: frame.descriptor,
        frameInMount: containsOrEquals(snapshot.canonicalMount, snapshot.canonicalFrame)
      },
      recommendedOwner: "CANVAS_DOM_BINDING_BOUNDARY",
      recommendedAction: "VERIFY_MOUNT_FRAME_DOM_CONNECTION",
      reason: containsOrEquals(snapshot.canonicalMount, snapshot.canonicalFrame)
        ? "FRAME_IS_WITHIN_CANONICAL_MOUNT"
        : "FRAME_NOT_CONFIRMED_WITHIN_CANONICAL_MOUNT"
    }));

    rows.push(makeBoundaryRow({
      order: 9,
      id: "FRAME_USED_SIZE_BOUNDARY",
      boundaryType: "LAYOUT_USED_SIZE",
      from: "CANONICAL_RECT_LOCK_FRAME",
      to: "FRAME_BOX",
      observed: frame.exists,
      clean: frame.exists && frame.usedSizeClean,
      class: frame.exists ? frame.usedSizeClass : "CANONICAL_FRAME_NOT_FOUND",
      firstMissingProof: frame.usedSizeClean ? "NONE" : "CANONICAL_FRAME_USED_SIZE_PROOF",
      firstMissingFact: frame.usedSizeFirstMissingFact,
      observedFacts: [
        `FRAME_RECT:${frame.rectWidth}x${frame.rectHeight}`,
        `FRAME_OFFSET:${frame.offsetWidth}x${frame.offsetHeight}`,
        `FRAME_CLIENT:${frame.clientWidth}x${frame.clientHeight}`,
        `FRAME_COMPUTED_SIZE:${frame.computedWidth}x${frame.computedHeight}`
      ],
      missingFacts: frame.usedSizeClean ? [] : [frame.usedSizeFirstMissingFact],
      diagnosticFacts: compactElementFacts(frame),
      recommendedOwner: "CANVAS_DOM_BINDING_OR_CSS_LAYOUT_BOUNDARY",
      recommendedAction: frame.usedSizeClean
        ? "CONTINUE_TO_CANVAS_BOUNDARY"
        : "READ_FRAME_PARENT_CHAIN_USED_SIZE_FACTS",
      reason: frame.usedSizeReason
    }));

    rows.push(makeBoundaryRow({
      order: 10,
      id: "CANVAS_SELECTION_BOUNDARY",
      boundaryType: "LAYOUT",
      from: "CANONICAL_RECT_LOCK_FRAME",
      to: "CANONICAL_CANVAS",
      observed: Boolean(snapshot.canonicalCanvas),
      clean: Boolean(snapshot.canonicalCanvas),
      class: snapshot.canonicalCanvas ? "CANONICAL_CANVAS_FOUND" : "CANONICAL_CANVAS_NOT_FOUND",
      firstMissingProof: snapshot.canonicalCanvas ? "NONE" : "CANONICAL_CANVAS_SELECTOR_MATCH",
      firstMissingFact: snapshot.canonicalCanvas ? "NONE" : "CANONICAL_CANVAS_PRESENT",
      observedFacts: [
        `CANVAS_SELECTOR:${snapshot.canonicalFound.selector}`,
        `CANVAS_DESCRIPTOR:${canvas.descriptor || "NONE"}`
      ],
      missingFacts: snapshot.canonicalCanvas ? [] : [CANONICAL_CHAIN_SELECTOR],
      diagnosticFacts: compactElementFacts(canvas),
      recommendedOwner: "CANVAS_DOM_BINDING_BOUNDARY",
      recommendedAction: snapshot.canonicalCanvas
        ? "READ_CANVAS_USED_SIZE_FACTS"
        : "CONFIRM_CANONICAL_CANVAS_SELECTOR_CHAIN",
      reason: snapshot.canonicalCanvas
        ? "#hearthVisibleCanvas_OBSERVED"
        : "NO_CANONICAL_CANVAS_SELECTOR_MATCHED"
    }));

    rows.push(makeBoundaryRow({
      order: 11,
      id: "FRAME_TO_CANVAS_CONNECTION_BOUNDARY",
      boundaryType: "DOM_CONNECTION",
      from: "CANONICAL_RECT_LOCK_FRAME",
      to: "CANONICAL_CANVAS",
      observed: frame.exists && Boolean(snapshot.canonicalCanvas),
      clean: Boolean(frame.exists && snapshot.canonicalCanvas && canvas.inCanonicalFrame),
      class: canvas.inCanonicalFrame ? "CANVAS_INSIDE_FRAME" : "CANVAS_NOT_INSIDE_FRAME_OR_UNOBSERVED",
      firstMissingProof: canvas.inCanonicalFrame ? "NONE" : "FRAME_CANVAS_CONNECTION_PROOF",
      firstMissingFact: canvas.inCanonicalFrame ? "NONE" : "CANVAS_IN_FRAME",
      observedFacts: [
        `FRAME_FOUND:${frame.exists}`,
        `CANVAS_FOUND:${Boolean(snapshot.canonicalCanvas)}`,
        `CANVAS_IN_FRAME:${canvas.inCanonicalFrame === true}`,
        `CANVAS_IN_MOUNT:${canvas.inCanonicalMount === true}`
      ],
      missingFacts: canvas.inCanonicalFrame ? [] : ["canvas must be inside #hearthCanvasRectLockFrame"],
      diagnosticFacts: {
        frameDescriptor: frame.descriptor,
        canvasDescriptor: canvas.descriptor || "NONE",
        canvasInFrame: canvas.inCanonicalFrame === true,
        canvasInMount: canvas.inCanonicalMount === true
      },
      recommendedOwner: "CANVAS_DOM_BINDING_BOUNDARY",
      recommendedAction: "VERIFY_FRAME_CANVAS_DOM_CONNECTION",
      reason: canvas.inCanonicalFrame
        ? "CANVAS_IS_WITHIN_CANONICAL_RECT_LOCK_FRAME"
        : "CANVAS_NOT_CONFIRMED_WITHIN_CANONICAL_RECT_LOCK_FRAME"
    }));

    rows.push(makeBoundaryRow({
      order: 12,
      id: "CANVAS_USED_SIZE_BOUNDARY",
      boundaryType: "LAYOUT_USED_SIZE",
      from: "CANONICAL_CANVAS",
      to: "CANVAS_DOM_BOX",
      observed: Boolean(snapshot.canonicalCanvas),
      clean: Boolean(snapshot.canonicalCanvas && canvas.usedSizeClean),
      class: snapshot.canonicalCanvas ? canvas.usedSizeClass : "CANONICAL_CANVAS_NOT_FOUND",
      firstMissingProof: canvas.usedSizeClean ? "NONE" : "CANONICAL_CANVAS_USED_SIZE_PROOF",
      firstMissingFact: canvas.usedSizeFirstMissingFact || "CANONICAL_CANVAS_RECT_NONZERO",
      observedFacts: [
        `CANVAS_RECT:${canvas.rectWidth || 0}x${canvas.rectHeight || 0}`,
        `CANVAS_OFFSET:${canvas.offsetWidth || 0}x${canvas.offsetHeight || 0}`,
        `CANVAS_CLIENT:${canvas.clientWidth || 0}x${canvas.clientHeight || 0}`,
        `CANVAS_COMPUTED_SIZE:${canvas.computedWidth || "UNKNOWN"}x${canvas.computedHeight || "UNKNOWN"}`
      ],
      missingFacts: canvas.usedSizeClean ? [] : [canvas.usedSizeFirstMissingFact || "CANVAS_RECT_NONZERO"],
      diagnosticFacts: compactElementFacts(canvas),
      recommendedOwner: "CSS_LAYOUT_OR_CANVAS_PLACEMENT_BOUNDARY",
      recommendedAction: canvas.usedSizeClean
        ? "CONTINUE_TO_CANVAS_BUFFER_BOUNDARY"
        : "READ_CANVAS_AND_PARENT_CHAIN_USED_SIZE_FACTS",
      reason: canvas.usedSizeReason || "CANVAS_USED_SIZE_FACTS_UNAVAILABLE"
    }));

    rows.push(makeBoundaryRow({
      order: 13,
      id: "CANVAS_BUFFER_TO_DOM_SIZE_BOUNDARY",
      boundaryType: "CANVAS_BUFFER",
      from: "CANVAS_WIDTH_HEIGHT_ATTRIBUTES",
      to: "CANVAS_DOM_BOX",
      observed: Boolean(snapshot.canonicalCanvas),
      clean: Boolean(canvas.internalSizeNonzero),
      class: canvas.internalSizeNonzero ? "CANVAS_INTERNAL_BUFFER_NONZERO" : "CANVAS_INTERNAL_BUFFER_ZERO_OR_UNOBSERVED",
      firstMissingProof: canvas.internalSizeNonzero ? "NONE" : "CANVAS_BUFFER_SIZE_PROOF",
      firstMissingFact: canvas.internalSizeNonzero ? "NONE" : "CANVAS_WIDTH_HEIGHT_ATTRIBUTES_NONZERO",
      observedFacts: [
        `WIDTH_ATTRIBUTE:${canvas.widthAttribute || 0}`,
        `HEIGHT_ATTRIBUTE:${canvas.heightAttribute || 0}`,
        `BUFFER_CSS_RATIO:${canvas.bufferCssWidthRatio || 0}x${canvas.bufferCssHeightRatio || 0}`
      ],
      missingFacts: canvas.internalSizeNonzero ? [] : ["canvas.width", "canvas.height"],
      diagnosticFacts: {
        widthAttribute: canvas.widthAttribute || 0,
        heightAttribute: canvas.heightAttribute || 0,
        internalSizeNonzero: canvas.internalSizeNonzero || false,
        bufferCssWidthRatio: canvas.bufferCssWidthRatio || 0,
        bufferCssHeightRatio: canvas.bufferCssHeightRatio || 0
      },
      recommendedOwner: "CANVAS_DOM_SURFACE_BOUNDARY",
      recommendedAction: canvas.internalSizeNonzero
        ? "CONTINUE_TO_VIEWPORT_BOUNDARY"
        : "VERIFY_CANONICAL_CANVAS_BUFFER_WIDTH_AND_HEIGHT_ATTRIBUTES",
      reason: canvas.internalSizeNonzero
        ? "CANVAS_INTERNAL_BUFFER_NONZERO"
        : "CANVAS_WIDTH_OR_HEIGHT_ATTRIBUTE_ZERO"
    }));

    rows.push(makeBoundaryRow({
      order: 14,
      id: "CANVAS_VIEWPORT_BOUNDARY",
      boundaryType: "VIEWPORT",
      from: "CANONICAL_CANVAS_DOM_BOX",
      to: "VIEWPORT",
      observed: Boolean(snapshot.canonicalCanvas),
      clean: Boolean(canvas.viewportIntersecting),
      class: canvas.viewportIntersecting ? "CANVAS_INTERSECTS_VIEWPORT" : "CANVAS_OUTSIDE_VIEWPORT_OR_ZERO_RECT",
      firstMissingProof: canvas.viewportIntersecting ? "NONE" : "CANVAS_VIEWPORT_INTERSECTION_PROOF",
      firstMissingFact: canvas.viewportIntersecting ? "NONE" : "CANVAS_VIEWPORT_INTERSECTING",
      observedFacts: [
        `CANVAS_RECT:${canvas.rectLeft || 0},${canvas.rectTop || 0},${canvas.rectRight || 0},${canvas.rectBottom || 0}`,
        `VIEWPORT:${safeNumber(snapshot.context.targetWindow && snapshot.context.targetWindow.innerWidth, 0)}x${safeNumber(snapshot.context.targetWindow && snapshot.context.targetWindow.innerHeight, 0)}`
      ],
      missingFacts: canvas.viewportIntersecting ? [] : ["canvas visible rect must intersect viewport"],
      diagnosticFacts: {
        viewportIntersecting: canvas.viewportIntersecting || false,
        rectLeft: canvas.rectLeft || 0,
        rectTop: canvas.rectTop || 0,
        rectRight: canvas.rectRight || 0,
        rectBottom: canvas.rectBottom || 0
      },
      recommendedOwner: "CSS_LAYOUT_OR_SCROLL_POSITION_BOUNDARY",
      recommendedAction: canvas.viewportIntersecting
        ? "CONTINUE_TO_LAYER_BOUNDARY"
        : "READ_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_FACTS",
      reason: canvas.viewportIntersecting
        ? "CANVAS_INTERSECTS_VIEWPORT"
        : "CANVAS_DOES_NOT_INTERSECT_VIEWPORT_OR_RECT_IS_ZERO"
    }));

    rows.push(makeBoundaryRow({
      order: 15,
      id: "CANVAS_LAYER_BOUNDARY",
      boundaryType: "LAYERING",
      from: "CANONICAL_CANVAS",
      to: "TOPMOST_CENTER_ELEMENT",
      observed: layering.status === "EVALUATED",
      clean: layering.status !== "EVALUATED" || layering.possibleLayerBlocker === "false",
      class: layering.status === "EVALUATED"
        ? layering.possibleLayerBlocker === "false"
          ? "CANVAS_TOPMOST_OR_CONTAINS_CENTER_ELEMENT"
          : "CANVAS_LAYER_BLOCKED_OR_NOT_TOPMOST"
        : layering.status || "NOT_EVALUATED",
      firstMissingProof: layering.possibleLayerBlocker === "false" ? "NONE" : "CANVAS_TOPMOST_PROOF",
      firstMissingFact: layering.possibleLayerBlocker === "false" ? "NONE" : "CANVAS_LAYER_TOPMOST",
      observedFacts: [
        `LAYER_STATUS:${layering.status || "UNKNOWN"}`,
        `CENTER_ELEMENT:${layering.centerElementDescriptor || "NONE"}`,
        `POSSIBLE_BLOCKER:${layering.possibleLayerBlocker || "UNKNOWN"}`
      ],
      missingFacts: layering.possibleLayerBlocker === "false" ? [] : ["elementFromPoint center must resolve to canvas or contained child"],
      diagnosticFacts: clonePlain(layering),
      recommendedOwner: "CSS_LAYERING_OR_ROUTE_STAGE_BOUNDARY",
      recommendedAction: layering.possibleLayerBlocker === "false"
        ? "CONTINUE_TO_PIXEL_BOUNDARY"
        : "READ_LAYERING_Z_INDEX_AND_OVERLAY_FACTS",
      reason: layering.possibleLayerBlocker === "false"
        ? "CANVAS_CENTER_NOT_BLOCKED"
        : `CENTER_POINT_TOP_ELEMENT_IS_${layering.centerElementDescriptor || "UNKNOWN"}`
    }));

    rows.push(makeBoundaryRow({
      order: 16,
      id: "CANVAS_PIXEL_BOUNDARY",
      boundaryType: "PIXEL_SURFACE",
      from: "CANVAS_2D_CONTEXT",
      to: "VISIBLE_PIXEL_SAMPLE",
      observed: Boolean(snapshot.canonicalCanvas),
      clean: Boolean(canvas.pixelVisible),
      class: canvas.pixelVisible ? "CANVAS_PIXEL_SAMPLE_VISIBLE" : "CANVAS_PIXEL_SAMPLE_NOT_VISIBLE",
      firstMissingProof: canvas.pixelVisible ? "NONE" : "VISIBLE_CANVAS_PIXEL_PROOF",
      firstMissingFact: canvas.pixelVisible ? "NONE" : "CANVAS_PIXEL_VISIBLE",
      observedFacts: [
        `CONTEXT_2D_READY:${canvas.context2dReady || false}`,
        `PIXEL_SAMPLE_STATUS:${canvas.pixelSampleStatus || "UNKNOWN"}`,
        `VISIBLE_PIXEL_COUNT:${canvas.visiblePixelCount || 0}`,
        `UNIQUE_COLOR_COUNT:${canvas.uniqueColorCount || 0}`
      ],
      missingFacts: canvas.pixelVisible ? [] : ["visible non-blank sampled pixels"],
      diagnosticFacts: {
        context2dReady: canvas.context2dReady || false,
        pixelSampleStatus: canvas.pixelSampleStatus || "UNKNOWN",
        pixelSampleReason: canvas.pixelSampleReason || "UNKNOWN",
        visiblePixelCount: canvas.visiblePixelCount || 0,
        uniqueColorCount: canvas.uniqueColorCount || 0
      },
      recommendedOwner: "CANVAS_DRAW_PATH_OR_DOWNSTREAM_EXPRESSION_BOUNDARY",
      recommendedAction: canvas.pixelVisible
        ? "RETURN_CANONICAL_SURFACE_TRUTH_PASS_TO_NORTH"
        : "DO_NOT_AUDIT_PIXEL_DRAW_PATH_UNTIL_USED_SIZE_BOUNDARIES_ARE_CLEAN",
      reason: canvas.pixelSampleReason || "PIXEL_SAMPLE_NOT_VISIBLE"
    }));

    return rows;
  }

  function runtimeNodeRow(id, role, file, family, authority, script, options = {}) {
    const observed = Boolean(authority.observed || (script && script.present));
    const authorityPresent = Boolean(authority.observed);
    const scriptPresent = Boolean(script && script.present);
    const recognized = Boolean(authority.contractRecognized);

    let nodeStatus = "SCRIPT_AND_AUTHORITY_NOT_OBSERVED";
    let missingRuntimeFact = "SCRIPT_PRESENT_OR_PUBLIC_AUTHORITY_ALIAS_OBSERVED";

    if (authorityPresent && recognized) {
      nodeStatus = "AUTHORITY_OBSERVED_CONTRACT_RECOGNIZED";
      missingRuntimeFact = "NONE";
    } else if (authorityPresent && !recognized) {
      nodeStatus = "AUTHORITY_OBSERVED_CONTRACT_UNRECOGNIZED";
      missingRuntimeFact = "CONTRACT_RECOGNITION_OR_ALIAS_FAMILY_ALIGNMENT";
    } else if (scriptPresent && !authorityPresent) {
      nodeStatus = "SCRIPT_PRESENT_AUTHORITY_NOT_OBSERVED";
      missingRuntimeFact = "PUBLIC_AUTHORITY_ALIAS_OBSERVED";
    }

    return {
      id,
      role,
      file,
      family,
      observed,
      authorityPresent,
      scriptPresent,
      scriptCount: script ? script.count : 0,
      scriptSrc: script ? script.src : "NONE",
      scriptCacheKey: script ? script.cacheKey : "NONE",
      authorityScope: authority.scope || "NONE",
      authorityPath: authority.path || "NONE",
      contract: authority.contract || "UNKNOWN",
      receipt: authority.receipt || "UNKNOWN",
      contractRecognized: recognized,
      methodCount: authority.methodCount || 0,
      publicMethods: Array.isArray(authority.methods) ? authority.methods.slice(0, 100) : [],
      candidates: clonePlain(authority.candidates || []),
      childOf: options.childOf || "NONE",
      advisoryChild: options.advisoryChild === true,
      primaryChainGate: options.primaryChainGate === true,
      nodeStatus,
      missingRuntimeFact,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildRuntimeBoundaryRows(snapshot) {
    const nodes = snapshot.runtimeNodes || {};

    const relationships = [
      {
        order: 1,
        id: "ROUTE_TO_CONTROLS_CONTROL_HANDSHAKE",
        from: nodes.route,
        to: nodes.controls,
        fromFile: ROUTE_CONDUCTOR_FILE,
        toFile: CONTROL_FILE,
        requiredForVisibleSurface: false,
        expectedMode: "HANDSHAKE"
      },
      {
        order: 2,
        id: "ROUTE_TO_CANVAS_GOVERNED_SOURCE_HANDSHAKE",
        from: nodes.route,
        to: nodes.canvas,
        fromFile: ROUTE_CONDUCTOR_FILE,
        toFile: CANVAS_FILE,
        requiredForVisibleSurface: true,
        expectedMode: "HANDSHAKE"
      },
      {
        order: 3,
        id: "CONTROLS_TO_CANVAS_VIEW_DELTA_HANDSHAKE",
        from: nodes.controls,
        to: nodes.canvas,
        fromFile: CONTROL_FILE,
        toFile: CANVAS_FILE,
        requiredForVisibleSurface: false,
        expectedMode: "HANDSHAKE"
      },
      {
        order: 4,
        id: "CANVAS_TO_HEX_AUTHORITY_TRUTH_READ",
        from: nodes.canvas,
        to: nodes.hexAuthority,
        fromFile: CANVAS_FILE,
        toFile: HEX_AUTHORITY_FILE,
        requiredForVisibleSurface: true,
        expectedMode: "READ_OR_HANDOFF"
      },
      {
        order: 5,
        id: "CANVAS_TO_HEX_SURFACE_EXPRESSION_GATE",
        from: nodes.canvas,
        to: nodes.hexSurface,
        fromFile: CANVAS_FILE,
        toFile: HEX_SURFACE_FILE,
        requiredForVisibleSurface: true,
        expectedMode: "HANDSHAKE_OR_HANDOFF"
      },
      {
        order: 6,
        id: "HEX_SURFACE_TO_POINTER_SURFACE_BISHOP_GATE",
        from: nodes.hexSurface,
        to: nodes.pointerSurface,
        fromFile: HEX_SURFACE_FILE,
        toFile: POINTER_SURFACE_FILE,
        requiredForVisibleSurface: true,
        expectedMode: "HANDOFF"
      },
      {
        order: 7,
        id: "POINTER_SURFACE_BISHOP_TO_CANVAS_RETURN_SOCKET",
        from: nodes.pointerSurface,
        to: nodes.canvas,
        fromFile: POINTER_SURFACE_FILE,
        toFile: CANVAS_FILE,
        requiredForVisibleSurface: true,
        expectedMode: "RETURN_SOCKET"
      },
      {
        order: 8,
        id: "POINTER_SURFACE_BISHOP_TO_INSPECT_PRIEST_CHILD_ORGANIZER",
        from: nodes.pointerSurface,
        to: nodes.pointerInspect,
        fromFile: POINTER_SURFACE_FILE,
        toFile: POINTER_INSPECT_FILE,
        requiredForVisibleSurface: false,
        expectedMode: "CHILD_ORGANIZER",
        advisoryChild: true
      }
    ];

    return relationships.map((rel) => {
      const fromObserved = Boolean(rel.from && rel.from.observed);
      const toObserved = Boolean(rel.to && rel.to.observed);
      const fromRecognized = Boolean(rel.from && rel.from.contractRecognized);
      const toRecognized = Boolean(rel.to && rel.to.contractRecognized);
      const endpointFactsPresent = fromObserved && toObserved;
      const recognizedEnough =
        rel.expectedMode === "CHILD_ORGANIZER"
          ? fromRecognized && toObserved
          : fromRecognized && toRecognized;

      let clean = endpointFactsPresent && recognizedEnough;
      let firstMissingFact = "NONE";
      let klass = "RUNTIME_BOUNDARY_FACTS_PRESENT";

      if (!fromObserved) {
        clean = false;
        firstMissingFact = "FROM_AUTHORITY_MISSING_OR_ALIAS_NOT_OBSERVED";
        klass = "FROM_ENDPOINT_NOT_OBSERVED";
      } else if (!toObserved) {
        clean = false;
        firstMissingFact = "TO_AUTHORITY_MISSING_OR_ALIAS_NOT_OBSERVED";
        klass = "TO_ENDPOINT_NOT_OBSERVED";
      } else if (!fromRecognized) {
        clean = false;
        firstMissingFact = "FROM_CONTRACT_NOT_RECOGNIZED";
        klass = "FROM_CONTRACT_UNRECOGNIZED";
      } else if (!toRecognized && rel.expectedMode !== "CHILD_ORGANIZER") {
        clean = false;
        firstMissingFact = "TO_CONTRACT_NOT_RECOGNIZED";
        klass = "TO_CONTRACT_UNRECOGNIZED";
      }

      return makeBoundaryRow({
        order: rel.order,
        id: rel.id,
        boundaryType: rel.expectedMode === "CHILD_ORGANIZER"
          ? "RUNTIME_ADVISORY_CHILD_RELATIONSHIP_FACT"
          : "RUNTIME_RELATIONSHIP_FACT",
        from: rel.from ? rel.from.id : "UNKNOWN_FROM",
        to: rel.to ? rel.to.id : "UNKNOWN_TO",
        fromFile: rel.fromFile,
        toFile: rel.toFile,
        observed: endpointFactsPresent,
        clean,
        blocking: rel.requiredForVisibleSurface,
        class: klass,
        firstMissingProof: clean ? "NONE" : "RUNTIME_RELATIONSHIP_ENDPOINT_PROOF",
        firstMissingFact,
        observedFacts: [
          `FROM_OBSERVED:${fromObserved}`,
          `TO_OBSERVED:${toObserved}`,
          `FROM_CONTRACT:${rel.from ? rel.from.contract : "UNKNOWN"}`,
          `TO_CONTRACT:${rel.to ? rel.to.contract : "UNKNOWN"}`,
          `FROM_RECOGNIZED:${fromRecognized}`,
          `TO_RECOGNIZED:${toRecognized}`,
          `EXPECTED_MODE:${rel.expectedMode}`,
          `ADVISORY_CHILD:${rel.advisoryChild === true}`
        ],
        missingFacts: clean ? [] : [firstMissingFact],
        diagnosticFacts: {
          from: clonePlain(rel.from || {}),
          to: clonePlain(rel.to || {}),
          requiredForVisibleSurface: rel.requiredForVisibleSurface,
          expectedMode: rel.expectedMode,
          advisoryChild: rel.advisoryChild === true
        },
        recommendedOwner: "RUNTIME_BOUNDARY_FACTS_ONLY",
        recommendedAction: clean
          ? "CONTINUE_RUNTIME_BOUNDARY_SCAN"
          : "CONFIRM_PUBLIC_AUTHORITY_ALIAS_CONTRACT_AND_RELATIONSHIP_PERMISSION_FACTS",
        reason: clean
          ? "RUNTIME_BOUNDARY_FACTS_PRESENT"
          : `${rel.id}:${firstMissingFact}`
      });
    });
  }

  function captureSurfaceSnapshot(payload = {}, phase = "IMMEDIATE_SYNC") {
    const context = getTargetContext(payload);
    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    const scripts = inspectScripts(targetDocument);

    const routeAuthority = inspectAuthority(targetWindow, ROUTE_AUTHORITY_ALIASES, "route");
    const controlAuthority = inspectAuthority(targetWindow, CONTROL_AUTHORITY_ALIASES, "controls");
    const canvasAuthority = inspectAuthority(targetWindow, CANVAS_AUTHORITY_ALIASES, "canvas");
    const hexAuthority = inspectAuthority(targetWindow, HEX_AUTHORITY_ALIASES, "hexAuthority");
    const hexSurfaceAuthority = inspectAuthority(targetWindow, HEX_SURFACE_ALIASES, "hexSurface");
    const pointerSurfaceAuthority = inspectAuthority(targetWindow, POINTER_SURFACE_ALIASES, "pointerSurface");
    const pointerInspectAuthority = inspectAuthority(targetWindow, POINTER_INSPECT_ALIASES, "pointerInspect");

    const runtimeNodes = {
      route: runtimeNodeRow("ROUTE_CONDUCTOR", "route-permission-and-active-scan-authority", ROUTE_CONDUCTOR_FILE, "route", routeAuthority, scripts.routeConductor),
      controls: runtimeNodeRow("CONTROLS_QUEEN", "motion-input-and-view-control-gateway", CONTROL_FILE, "controls", controlAuthority, scripts.controls),
      canvas: runtimeNodeRow("CANVAS_RECEIVER", "canonical-visible-2d-output-carrier-and-return-receiver", CANVAS_FILE, "canvas", canvasAuthority, scripts.canvas),
      hexAuthority: runtimeNodeRow("HEX_AUTHORITY", "hex-four-pair-truth-authority", HEX_AUTHORITY_FILE, "hexAuthority", hexAuthority, scripts.hexAuthority),
      hexSurface: runtimeNodeRow("HEX_SURFACE_GATE", "downstream-hex-surface-gate-before-pointer-surface", HEX_SURFACE_FILE, "hexSurface", hexSurfaceAuthority, scripts.hexSurface),
      pointerSurface: runtimeNodeRow(
        "POINTER_SURFACE_BISHOP",
        "main-chain-pointer-surface-bishop-gate",
        POINTER_SURFACE_FILE,
        "pointerSurface",
        pointerSurfaceAuthority,
        scripts.pointerSurface,
        { primaryChainGate: true }
      ),
      pointerInspect: runtimeNodeRow(
        "POINTER_INSPECT_PRIEST",
        "child-organizer-priest-not-primary-chain-endpoint",
        POINTER_INSPECT_FILE,
        "pointerInspect",
        pointerInspectAuthority,
        scripts.pointerInspect,
        { childOf: "POINTER_SURFACE_BISHOP", advisoryChild: true }
      )
    };

    const stageFound = findStage(targetDocument);
    const stageElement = stageFound.element;
    const stageSummary = measureElement(targetWindow, stageElement, "STAGE");

    const canonicalMount = q(targetDocument, CANONICAL_MOUNT_SELECTOR);
    const canonicalFrame = q(targetDocument, CANONICAL_FRAME_SELECTOR);
    const canonicalFound = findCanonicalCanvas(targetDocument);
    const canonicalCanvas = canonicalFound.element;

    const mountSummary = measureElement(targetWindow, canonicalMount, "CANONICAL_MOUNT");
    const frameSummary = measureElement(targetWindow, canonicalFrame, "CANONICAL_FRAME");

    const allCanvases = qa(targetDocument, "canvas");
    const allCanvasSummaries = allCanvases.map((canvas, index) =>
      describeCanvas(
        targetWindow,
        targetDocument,
        canvas,
        index + 1,
        canvas === canonicalCanvas ? canonicalFound.selector : "canvas",
        canonicalMount,
        canonicalFrame
      )
    );

    const canonicalSummary = canonicalCanvas
      ? describeCanvas(
          targetWindow,
          targetDocument,
          canonicalCanvas,
          allCanvases.indexOf(canonicalCanvas) + 1 || 1,
          canonicalFound.selector,
          canonicalMount,
          canonicalFrame
        )
      : null;

    const pixelBearingSummaries = allCanvasSummaries.filter((entry) => entry.pixelVisible === true);
    const firstPixelBearingSummary = pixelBearingSummaries[0] || null;
    const firstPixelBearingCanvas = firstPixelBearingSummary
      ? allCanvases[firstPixelBearingSummary.index - 1]
      : null;

    const pixelBearingCanvasFound = Boolean(firstPixelBearingSummary);
    const pixelBearingCanvasIsCanonical = Boolean(
      canonicalCanvas &&
      firstPixelBearingCanvas &&
      canonicalCanvas === firstPixelBearingCanvas
    );

    const nonCanonicalPixelBearingCanvasCount = pixelBearingSummaries.filter((entry) => {
      const canvas = allCanvases[entry.index - 1];
      return canvas && canonicalCanvas && canvas !== canonicalCanvas;
    }).length;

    const canonicalParentChain = parentChain(targetWindow, canonicalCanvas, canonicalMount || stageElement || null);
    const canonicalParentChainClassification = classifyParentChain(canonicalParentChain);

    const mountParentChain = parentChain(targetWindow, canonicalMount, stageElement || null);
    const mountParentChainClassification = classifyParentChain(mountParentChain);

    const canonicalSurfaceAdmissible = Boolean(
      canonicalSummary &&
      canonicalSummary.inCanonicalMount &&
      canonicalSummary.inCanonicalFrame &&
      canonicalSummary.surfaceAdmissible
    );

    const canonicalSurfaceTruthPassed = Boolean(
      canonicalSurfaceAdmissible &&
      canonicalSummary &&
      canonicalSummary.pixelVisible &&
      pixelBearingCanvasIsCanonical
    );

    const fallbackObserved = Boolean(
      canonicalSummary &&
      (
        canonicalSummary.fallbackTextObserved ||
        canonicalSummary.datasetFallback === "true" ||
        canonicalSummary.datasetCartoon === "true"
      )
    );

    const layering = inspectLayering(targetWindow, targetDocument, canonicalCanvas);

    const snapshot = {
      phase,
      capturedAt: nowIso(),

      context,
      targetWindow,
      targetDocument,

      scripts,
      routeAuthority,
      controlAuthority,
      canvasAuthority,
      hexAuthority,
      hexSurfaceAuthority,
      pointerSurfaceAuthority,
      pointerInspectAuthority,
      runtimeNodes,

      stageElement,
      stageSelector: stageFound.selector,
      stageSummary,

      canonicalMount,
      canonicalFrame,
      canonicalCanvas,
      canonicalFound,
      mountSummary,
      frameSummary,
      canonicalSummary,

      canonicalParentChain,
      canonicalParentChainClassification,
      mountParentChain,
      mountParentChainClassification,

      allCanvases,
      allCanvasSummaries,
      pixelBearingSummaries,
      firstPixelBearingSummary,
      firstPixelBearingCanvas,
      pixelBearingCanvasFound,
      pixelBearingCanvasIsCanonical,
      nonCanonicalPixelBearingCanvasCount,
      canonicalSurfaceAdmissible,
      canonicalSurfaceTruthPassed,
      fallbackObserved,
      layering
    };

    snapshot.layoutBoundaryRows = buildLayoutBoundaryRows(snapshot);
    snapshot.runtimeBoundaryRows = buildRuntimeBoundaryRows(snapshot);
    snapshot.boundaryRows = snapshot.layoutBoundaryRows.concat(snapshot.runtimeBoundaryRows);

    return snapshot;
  }

  function firstFailedBoundary(rows, options = {}) {
    const onlyBlocking = options.onlyBlocking !== false;

    const found = (rows || []).find((row) =>
      row &&
      row.clean === false &&
      (onlyBlocking ? row.blocking !== false : true)
    );

    return found || null;
  }

  function resolveBoundaryVerdict(snapshot) {
    const canonicalSummary = snapshot.canonicalSummary || {};
    const mount = snapshot.mountSummary || {};
    const frame = snapshot.frameSummary || {};
    const mountChain = snapshot.mountParentChainClassification || {};
    const canvasChain = snapshot.canonicalParentChainClassification || {};
    const layoutFirst = firstFailedBoundary(snapshot.layoutBoundaryRows || [], { onlyBlocking: true });
    const runtimeFirst = firstFailedBoundary(snapshot.runtimeBoundaryRows || [], { onlyBlocking: true });
    const anyFirst = layoutFirst || runtimeFirst;

    if (!snapshot.context.targetAvailable) {
      return {
        status: "TARGET_CONTEXT_UNAVAILABLE",
        clean: false,
        coordinate: "TARGET_CONTEXT_STATUS",
        failureClass: "TARGET_CONTEXT_UNAVAILABLE",
        owner: "DIAGNOSTIC_TARGET_ACCESS_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE",
        action: "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_CANVAS_SURFACE_TRUTH_PROBE",
        certainty: "DEFINITIVE_TARGET_CONTEXT_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!mount.exists) {
      return {
        status: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_MOUNT_FOUND",
        failureClass: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        owner: "HTML_SHELL_OR_CANVAS_PLACEMENT_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasMount_WAS_NOT_FOUND_IN_TARGET_DOCUMENT",
        action: "CONFIRM_CANONICAL_MOUNT_EXISTS_IN_TARGET_DOM",
        certainty: "DEFINITIVE_CANONICAL_MOUNT_ABSENCE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (mount.exists && !mount.rectNonzero) {
      const collapsedDescriptor =
        mountChain.firstCollapsedDescriptor && mountChain.firstCollapsedDescriptor !== "NONE"
          ? mountChain.firstCollapsedDescriptor
          : mount.descriptor;

      return {
        status: "CANONICAL_MOUNT_ZERO_RECT",
        clean: false,
        coordinate: "CANONICAL_MOUNT_RECT_NONZERO",
        failureClass: "CANONICAL_MOUNT_ZERO_RECT",
        owner: "HTML_SHELL_OR_STAGE_LAYOUT_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: `#hearthCanvasMount_EXISTS_BUT_RECT_IS_ZERO_PARENT_CHAIN:${collapsedDescriptor}`,
        action: "READ_PARENT_CHAIN_AND_STAGE_USED_SIZE_FACTS",
        certainty: "DEFINITIVE_MOUNT_LAYOUT_MATH_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!frame.exists) {
      return {
        status: "CANONICAL_RECT_LOCK_FRAME_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_FRAME_FOUND",
        failureClass: "CANONICAL_RECT_LOCK_FRAME_NOT_FOUND",
        owner: "CANVAS_DOM_BINDING_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasMount_EXISTS_BUT_#hearthCanvasRectLockFrame_IS_MISSING",
        action: "CONFIRM_CANONICAL_RECT_LOCK_FRAME_EXISTS_UNDER_MOUNT",
        certainty: "DEFINITIVE_CANONICAL_FRAME_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (frame.exists && !frame.rectNonzero) {
      return {
        status: "CANONICAL_RECT_LOCK_FRAME_ZERO_RECT",
        clean: false,
        coordinate: "CANONICAL_FRAME_RECT_NONZERO",
        failureClass: "CANONICAL_RECT_LOCK_FRAME_ZERO_RECT",
        owner: "CANVAS_DOM_BINDING_OR_CSS_LAYOUT_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasRectLockFrame_EXISTS_BUT_RECT_IS_ZERO",
        action: "READ_FRAME_AND_PARENT_CHAIN_USED_SIZE_FACTS",
        certainty: "DEFINITIVE_CANONICAL_FRAME_LAYOUT_MATH_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!snapshot.canonicalCanvas) {
      return {
        status: "CANONICAL_CANVAS_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_CANVAS_FOUND",
        failureClass: "CANONICAL_CANVAS_NOT_FOUND",
        owner: "CANVAS_DOM_BINDING_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasMount_EXISTS_BUT_NO_CANONICAL_CANVAS_SELECTOR_MATCHED",
        action: "CONFIRM_CANONICAL_CANVAS_SELECTOR_CHAIN",
        certainty: "DEFINITIVE_CANONICAL_CANVAS_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (
      snapshot.pixelBearingCanvasFound &&
      !snapshot.pixelBearingCanvasIsCanonical &&
      snapshot.nonCanonicalPixelBearingCanvasCount > 0
    ) {
      return {
        status: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        clean: false,
        coordinate: "PIXEL_BEARING_CANVAS_IS_CANONICAL",
        failureClass: "PIXEL_BEARING_CANVAS_NOT_CANONICAL",
        owner: "CANVAS_SELECTOR_OR_CANVAS_PLACEMENT_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "VISIBLE_PIXELS_EXIST_BUT_THE_PIXEL_BEARING_CANVAS_IS_NOT_THE_CANONICAL_CANVAS",
        action: "ALIGN_RENDERED_PIXEL_SURFACE_WITH_CANONICAL_SELECTOR_CHAIN",
        certainty: "DEFINITIVE_CANVAS_IDENTITY_DIVERGENCE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!canonicalSummary.inCanonicalMount) {
      return {
        status: "CANONICAL_CANVAS_NOT_IN_CANONICAL_MOUNT",
        clean: false,
        coordinate: "CANVAS_IN_MOUNT",
        failureClass: "CANONICAL_CANVAS_CONNECTION_MISMATCH",
        owner: "CANVAS_DOM_BINDING_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_SELECTOR_MATCHED_BUT_CANVAS_IS_NOT_INSIDE_#hearthCanvasMount",
        action: "VERIFY_CANONICAL_CANVAS_DOM_PLACEMENT_UNDER_MOUNT",
        certainty: "DEFINITIVE_CANVAS_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!canonicalSummary.inCanonicalFrame) {
      return {
        status: "CANONICAL_CANVAS_NOT_IN_RECT_LOCK_FRAME",
        clean: false,
        coordinate: "CANVAS_IN_FRAME",
        failureClass: "CANONICAL_CANVAS_FRAME_CONNECTION_MISMATCH",
        owner: "CANVAS_DOM_BINDING_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_IS_IN_MOUNT_BUT_NOT_IN_#hearthCanvasRectLockFrame",
        action: "VERIFY_CANONICAL_CANVAS_DOM_PLACEMENT_UNDER_RECT_LOCK_FRAME",
        certainty: "DEFINITIVE_CANVAS_FRAME_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!canonicalSummary.internalSizeNonzero) {
      return {
        status: "CANONICAL_CANVAS_INTERNAL_SIZE_ZERO",
        clean: false,
        coordinate: "CANVAS_INTERNAL_SIZE_NONZERO",
        failureClass: "CANONICAL_CANVAS_INTERNAL_SIZE_ZERO",
        owner: "CANVAS_DOM_SURFACE_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_WIDTH_OR_HEIGHT_ATTRIBUTE_IS_ZERO",
        action: "VERIFY_CANONICAL_CANVAS_BUFFER_WIDTH_AND_HEIGHT_ATTRIBUTES",
        certainty: "DEFINITIVE_CANVAS_BUFFER_MATH_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!canonicalSummary.rectNonzero) {
      const collapsedDescriptor =
        canvasChain.firstCollapsedDescriptor && canvasChain.firstCollapsedDescriptor !== "NONE"
          ? canvasChain.firstCollapsedDescriptor
          : canonicalSummary.descriptor;

      return {
        status: "CANONICAL_CANVAS_ZERO_RECT",
        clean: false,
        coordinate: "CANVAS_RECT_NONZERO",
        failureClass: "CANONICAL_CANVAS_ZERO_RECT",
        owner: "CSS_LAYOUT_OR_CANVAS_PLACEMENT_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: `CANONICAL_CANVAS_EXISTS_BUT_BOUNDING_RECT_IS_ZERO_COLLAPSED_AT:${collapsedDescriptor}`,
        action: "READ_CANVAS_AND_PARENT_CHAIN_USED_SIZE_FACTS",
        certainty: "DEFINITIVE_CANONICAL_RECT_MATH_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!canonicalSummary.computedVisible) {
      return {
        status: "CANONICAL_CANVAS_HIDDEN",
        clean: false,
        coordinate: "CANVAS_COMPUTED_VISIBLE",
        failureClass: "CANONICAL_CANVAS_COMPUTED_STYLE_HIDDEN",
        owner: "CSS_VISIBILITY_OR_ROUTE_SHELL_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_COMPUTED_STYLE_IS_NOT_VISIBLE",
        action: "READ_DISPLAY_VISIBILITY_OPACITY_AND_ROUTE_STAGE_FACTS",
        certainty: "DEFINITIVE_CANONICAL_VISIBILITY_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!canonicalSummary.viewportIntersecting) {
      return {
        status: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        clean: false,
        coordinate: "CANVAS_VIEWPORT_INTERSECTING",
        failureClass: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        owner: "CSS_LAYOUT_OR_SCROLL_POSITION_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT",
        action: "READ_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_FACTS",
        certainty: "DEFINITIVE_CANONICAL_VIEWPORT_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (!canonicalSummary.context2dReady) {
      return {
        status: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        clean: false,
        coordinate: "CANVAS_CONTEXT_2D_READY",
        failureClass: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        owner: "CANVAS_DOM_SURFACE_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: canonicalSummary.context2dStatus,
        action: "VERIFY_CANONICAL_DOM_SURFACE_IS_STANDARD_2D_CANVAS",
        certainty: "DEFINITIVE_CANONICAL_CONTEXT_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (
      snapshot.layering.status === "EVALUATED" &&
      snapshot.layering.possibleLayerBlocker !== "false"
    ) {
      return {
        status: "CANONICAL_CANVAS_LAYER_BLOCKED_OR_NOT_TOPMOST",
        clean: false,
        coordinate: "CANVAS_LAYER_TOPMOST",
        failureClass: "CANONICAL_CANVAS_LAYER_BLOCKED_OR_NOT_TOPMOST",
        owner: "CSS_LAYERING_OR_ROUTE_STAGE_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: `CENTER_POINT_TOP_ELEMENT_IS_${snapshot.layering.centerElementDescriptor}`,
        action: "READ_LAYERING_Z_INDEX_AND_OVERLAY_FACTS",
        certainty: "DEFINITIVE_CANONICAL_LAYERING_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (snapshot.fallbackObserved) {
      return {
        status: "CANONICAL_CANVAS_VISIBLE_BUT_FALLBACK_OR_CARTOON_INDICATED",
        clean: false,
        coordinate: "FALLBACK_CARTOON_SIGNAL",
        failureClass: "CANONICAL_CANVAS_FALLBACK_OR_CARTOON_SURFACE",
        owner: "CANVAS_FALLBACK_PATH_OR_ROUTE_CONDUCTOR_SETTLED_STATE_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_IS_VISIBLE_AND_PIXEL_BEARING_BUT_FALLBACK_OR_CARTOON_SIGNAL_IS_PRESENT",
        action: "READ_ROUTE_SETTLED_STATE_AND_DOWNSTREAM_FALLBACK_SUPPRESSION_FACTS",
        certainty: "DEFINITIVE_FALLBACK_SURFACE_SIGNAL",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (snapshot.canonicalSurfaceAdmissible && !canonicalSummary.pixelVisible) {
      return {
        status: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        clean: false,
        coordinate: "CANVAS_PIXEL_VISIBLE",
        failureClass: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        owner: "CANVAS_DRAW_PATH_OR_DOWNSTREAM_EXPRESSION_BOUNDARY",
        file: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: canonicalSummary.pixelSampleReason,
        action: "READ_CANVAS_DRAW_AND_DOWNSTREAM_EXPRESSION_FACTS",
        certainty: "DEFINITIVE_CANONICAL_PIXEL_FAILURE",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    if (runtimeFirst && runtimeFirst.blocking !== false) {
      return {
        status: "CANONICAL_CANVAS_SURFACE_VISIBLE_BUT_RUNTIME_BOUNDARY_PARTIAL",
        clean: false,
        coordinate: runtimeFirst.id,
        failureClass: runtimeFirst.class,
        owner: runtimeFirst.recommendedOwner,
        file: runtimeFirst.recommendedFile,
        reason: runtimeFirst.reason,
        action: runtimeFirst.recommendedAction,
        certainty: "RUNTIME_BOUNDARY_FACT_FAILURE_NO_SINGLE_FILE_CAUSALITY",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst: runtimeFirst
      };
    }

    if (snapshot.canonicalSurfaceTruthPassed) {
      return {
        status: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        clean: true,
        coordinate: "NONE",
        failureClass: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        owner: "NONE",
        file: "NONE",
        reason: "CANONICAL_CANVAS_IS_MOUNTED_FRAMED_NONZERO_VISIBLE_VIEWPORT_INTERSECTING_CONTEXT_READY_AND_PIXEL_BEARING",
        action: "RETURN_CANONICAL_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_LAWFUL_CHECK",
        certainty: "DEFINITIVE_CANONICAL_SURFACE_PASS_NO_FINAL_CLAIM",
        singleCausalFileProven: false,
        layoutFirst,
        runtimeFirst,
        anyFirst
      };
    }

    return {
      status: "DIAGNOSTIC_BLIND_SPOT",
      clean: false,
      coordinate: "UNCLASSIFIED_CANVAS_SURFACE_TRUTH_STATE",
      failureClass: "DIAGNOSTIC_BLIND_SPOT",
      owner: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      file: FILE,
      reason: "CANONICAL_CANVAS_STATE_DID_NOT_MATCH_ANY_DEFINED_FAILURE_OR_PASS_CLASS",
      action: "EXPAND_DIAGNOSTIC_CLASSIFIER_FOR_THIS_SURFACE_STATE",
      certainty: "BLIND_SPOT_IDENTIFIED",
      singleCausalFileProven: true,
      layoutFirst,
      runtimeFirst,
      anyFirst
    };
  }

  function compareImmediateToSettled(immediate, settled) {
    if (!immediate || !settled) {
      return {
        status: "TRANSITION_COMPARISON_UNAVAILABLE",
        class: "NO_SETTLED_SAMPLE",
        reason: "SETTLED_SAMPLE_NOT_AVAILABLE",
        changed: []
      };
    }

    const fields = [
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_RECT_NONZERO",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_VIEWPORT_INTERSECTING",
      "PIXEL_BEARING_CANVAS_IS_CANONICAL",
      "FALLBACK_OR_CARTOON_SIGNAL_OBSERVED",
      "CANVAS_LAYER_POSSIBLE_BLOCKER",
      "BOUNDARY_LAYOUT_FIRST_FAILED",
      "BOUNDARY_RUNTIME_FIRST_FAILED",
      "BOUNDARY_FIRST_MISSING_FACT",
      "POINTER_SURFACE_BISHOP_OBSERVED",
      "POINTER_SURFACE_BISHOP_RECOGNIZED",
      "POINTER_INSPECT_IS_PRIMARY_CHAIN_ENDPOINT"
    ];

    const changed = fields
      .map((field) => ({
        field,
        before: getRaw(immediate, field, "UNKNOWN"),
        after: getRaw(settled, field, "UNKNOWN")
      }))
      .filter((entry) => String(entry.before) !== String(entry.after));

    if (changed.length) {
      return {
        status: "TRANSITION_STATE_CHANGED",
        class: "IMMEDIATE_TO_SETTLED_COORDINATE_CHANGED",
        reason: changed.map((entry) => `${entry.field}:${entry.before}>${entry.after}`).join("|"),
        changed
      };
    }

    return {
      status: "TRANSITION_STATE_STABLE",
      class: "IMMEDIATE_AND_SETTLED_SURFACE_MATCH",
      reason: getRaw(immediate, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN"),
      changed: []
    };
  }

  function buildReportFromSnapshot(snapshot, transitionMode = "IMMEDIATE_SYNC") {
    const verdict = resolveBoundaryVerdict(snapshot);
    const canonicalSummary = snapshot.canonicalSummary || {};
    const firstPixelBearingSummary = snapshot.firstPixelBearingSummary || {};
    const scripts = snapshot.scripts || {};
    const layering = snapshot.layering || {};
    const chain = snapshot.canonicalParentChainClassification || {};
    const mountChain = snapshot.mountParentChainClassification || {};
    const stage = snapshot.stageSummary || {};
    const mount = snapshot.mountSummary || {};
    const frame = snapshot.frameSummary || {};
    const runtimeNodes = snapshot.runtimeNodes || {};
    const layoutFirst = verdict.layoutFirst || null;
    const runtimeFirst = verdict.runtimeFirst || null;
    const anyFirst = verdict.anyFirst || layoutFirst || runtimeFirst || null;
    const comparison = compareImmediateToSettled(lastReport, lastSettledReport);

    const boundaryClean = !firstFailedBoundary(snapshot.boundaryRows || [], { onlyBlocking: true });
    const layoutClean = !firstFailedBoundary(snapshot.layoutBoundaryRows || [], { onlyBlocking: true });
    const runtimeClean = !firstFailedBoundary(snapshot.runtimeBoundaryRows || [], { onlyBlocking: true });

    const darkRuntimeFiles = Object.values(runtimeNodes).filter((node) =>
      node &&
      (
        node.observed === false ||
        node.authorityPresent === false ||
        node.contractRecognized === false
      )
    );

    const notes = [
      "V2_0_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_ACTIVE",
      "V1_9_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_PRESERVED",
      "V1_8_BOUNDARY_DIAGNOSIS_MATRIX_PRESERVED",
      "V1_7_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_PRESERVED",
      "V1_6_CALL_GUARDED_TRANSITION_SURFACE_DISAMBIGUATION_PRESERVED",
      "V1_5_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_PRESERVED",
      "POINTER_SURFACE_FILE_IS_BISHOP_GATE",
      "POINTER_INSPECT_FILE_IS_CHILD_ORGANIZER_PRIEST_ONLY",
      "INSPECT_FILE_NOT_PRIMARY_CHAIN_ENDPOINT",
      "ONE_BOUNDARY_ONE_ROW",
      "ONE_MISSING_PROOF_ONE_MISSING_FACT",
      "NO_SINGLE_FILE_RECOMMENDATION_UNLESS_SINGLE_FILE_CAUSALITY_PROVEN",
      "RUN_PROBE_RETURNS_PACKET_UNDER_COORDINATE_FAILURE_GUARD",
      "NO_CANVAS_CREATION",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_REPAIR",
      "NO_ROUTE_REPAIR",
      "NO_CONTROL_MUTATION",
      "NO_RUNTIME_RESTART",
      `CANONICAL_MOUNT_FOUND:${mount.exists}`,
      `CANONICAL_MOUNT_RECT_NONZERO:${mount.rectNonzero}`,
      `CANONICAL_FRAME_FOUND:${frame.exists}`,
      `CANONICAL_FRAME_RECT_NONZERO:${frame.rectNonzero}`,
      `CANONICAL_CANVAS_FOUND:${Boolean(snapshot.canonicalCanvas)}`,
      `CANONICAL_CANVAS_IN_MOUNT:${canonicalSummary.inCanonicalMount === true}`,
      `CANONICAL_CANVAS_IN_FRAME:${canonicalSummary.inCanonicalFrame === true}`,
      `CANONICAL_CANVAS_RECT_NONZERO:${canonicalSummary.rectNonzero === true}`,
      `CANONICAL_CANVAS_PIXEL_VISIBLE:${canonicalSummary.pixelVisible === true}`,
      `PIXEL_BEARING_CANVAS_FOUND:${snapshot.pixelBearingCanvasFound}`,
      `PIXEL_BEARING_CANVAS_IS_CANONICAL:${snapshot.pixelBearingCanvasIsCanonical}`,
      `NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT:${snapshot.nonCanonicalPixelBearingCanvasCount}`,
      `PARENT_CHAIN_STATUS:${chain.status || "UNKNOWN"}`,
      `MOUNT_PARENT_CHAIN_STATUS:${mountChain.status || "UNKNOWN"}`,
      `BOUNDARY_LAYOUT_FIRST_FAILED:${layoutFirst ? layoutFirst.id : "NONE"}`,
      `BOUNDARY_RUNTIME_FIRST_FAILED:${runtimeFirst ? runtimeFirst.id : "NONE"}`,
      `BOUNDARY_FIRST_MISSING_FACT:${anyFirst ? anyFirst.firstMissingFact : "NONE"}`,
      `POINTER_SURFACE_BISHOP_STATUS:${runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.nodeStatus : "UNKNOWN"}`,
      `POINTER_INSPECT_PRIEST_STATUS:${runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.nodeStatus : "UNKNOWN"}`,
      `CANVAS_TRUTH_FAILURE_CLASS:${verdict.failureClass}`,
      `DIAGNOSTIC_CERTAINTY:${verdict.certainty}`
    ];

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_PACKET_v2_0",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      LINEAGE_V1_8_CONTRACT,
      LINEAGE_V1_7_CONTRACT,
      LINEAGE_V1_6_CONTRACT,
      LINEAGE_V1_5_CONTRACT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      HEX_AUTHORITY_FILE,
      HEX_SURFACE_FILE,
      POINTER_SURFACE_FILE,
      POINTER_INSPECT_FILE,
      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_HEX_AUTHORITY_CONTRACT,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE,
      EXPECTED_POINTER_SURFACE_CONTRACT,
      EXPECTED_POINTER_SURFACE_RENEWAL_CANDIDATE,
      EXPECTED_POINTER_INSPECT_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED",
      CANVAS_SURFACE_TRUTH_AVAILABLE: snapshot.context.targetAvailable ? "true" : "false",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CANONICAL_CANVAS_PARENT_CHAIN_USED_SIZE_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_ONLY",
      CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS:
        "REPORT_BOUNDARY_FACTS_WITH_POINTER_SURFACE_BISHOP_MAP_WITHOUT_SINGLE_FILE_CAUSALITY_INVENTION",

      POINTER_SURFACE_BISHOP_MAPPING_ACTIVE: true,
      POINTER_SURFACE_BISHOP_FILE: POINTER_SURFACE_FILE,
      POINTER_INSPECT_PRIEST_FILE: POINTER_INSPECT_FILE,
      POINTER_SURFACE_IS_MAIN_CHAIN_BISHOP_GATE: true,
      POINTER_INSPECT_IS_PRIMARY_CHAIN_ENDPOINT: false,
      POINTER_INSPECT_IS_CHILD_ORGANIZER: true,
      POINTER_INSPECT_CAN_BLOCK_MAIN_LOOP: false,

      CORRECTED_EXPRESSION_CHAIN:
        "ROUTE_CONDUCTOR -> CONTROLS_QUEEN -> CANVAS_RECEIVER -> HEX_SURFACE_GATE -> POINTER_SURFACE_BISHOP -> CHILD_ORGANIZER_PROOF_FILES -> CANVAS_RETURN",

      TRANSITION_MEASUREMENT_MODE: transitionMode,
      TRANSITION_SAMPLE_PHASE: snapshot.phase,
      TRANSITION_SETTLED_SAMPLE_SCHEDULED: transitionMode === "IMMEDIATE_SYNC",
      TRANSITION_SETTLED_SAMPLE_AVAILABLE: Boolean(lastSettledReport),
      TRANSITION_COMPARISON_STATUS: comparison.status,
      TRANSITION_COMPARISON_CLASS: comparison.class,
      TRANSITION_COMPARISON_REASON: comparison.reason,

      TARGET_CONTEXT_STATUS: snapshot.context.targetAvailable
        ? "TARGET_CONTEXT_AVAILABLE"
        : "TARGET_CONTEXT_UNAVAILABLE",
      TARGET_CONTEXT_SOURCE: snapshot.context.targetSource,
      TARGET_ACCESS_ERROR: snapshot.context.targetAccessError,

      INDEX_SCRIPT_PRESENT: scripts.index ? scripts.index.present : false,
      INDEX_SCRIPT_SRC: scripts.index ? scripts.index.src : "NONE",
      ROUTE_CONDUCTOR_SCRIPT_PRESENT: scripts.routeConductor ? scripts.routeConductor.present : false,
      ROUTE_CONDUCTOR_SCRIPT_SRC: scripts.routeConductor ? scripts.routeConductor.src : "NONE",
      ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY: scripts.routeConductor ? scripts.routeConductor.cacheKey : "NONE",
      CONTROL_SCRIPT_PRESENT: scripts.controls ? scripts.controls.present : false,
      CONTROL_SCRIPT_SRC: scripts.controls ? scripts.controls.src : "NONE",
      CANVAS_SCRIPT_PRESENT: scripts.canvas ? scripts.canvas.present : false,
      CANVAS_SCRIPT_COUNT: scripts.canvas ? scripts.canvas.count : 0,
      CANVAS_SCRIPT_SRC: scripts.canvas ? scripts.canvas.src : "NONE",
      CANVAS_SCRIPT_CACHE_KEY: scripts.canvas ? scripts.canvas.cacheKey : "NONE",
      HEX_AUTHORITY_SCRIPT_PRESENT: scripts.hexAuthority ? scripts.hexAuthority.present : false,
      HEX_SURFACE_SCRIPT_PRESENT: scripts.hexSurface ? scripts.hexSurface.present : false,
      POINTER_SURFACE_SCRIPT_PRESENT: scripts.pointerSurface ? scripts.pointerSurface.present : false,
      POINTER_SURFACE_SCRIPT_SRC: scripts.pointerSurface ? scripts.pointerSurface.src : "NONE",
      POINTER_SURFACE_SCRIPT_CACHE_KEY: scripts.pointerSurface ? scripts.pointerSurface.cacheKey : "NONE",
      POINTER_INSPECT_SCRIPT_PRESENT: scripts.pointerInspect ? scripts.pointerInspect.present : false,
      POINTER_INSPECT_SCRIPT_SRC: scripts.pointerInspect ? scripts.pointerInspect.src : "NONE",

      ROUTE_AUTHORITY_OBSERVED: runtimeNodes.route ? runtimeNodes.route.authorityPresent : false,
      ROUTE_AUTHORITY_SOURCE_PATH: runtimeNodes.route ? runtimeNodes.route.authorityPath : "NONE",
      ROUTE_AUTHORITY_CONTRACT: runtimeNodes.route ? runtimeNodes.route.contract : "UNKNOWN",
      ROUTE_AUTHORITY_RECOGNIZED: runtimeNodes.route ? runtimeNodes.route.contractRecognized : false,

      CONTROL_AUTHORITY_OBSERVED: runtimeNodes.controls ? runtimeNodes.controls.authorityPresent : false,
      CONTROL_AUTHORITY_SOURCE_PATH: runtimeNodes.controls ? runtimeNodes.controls.authorityPath : "NONE",
      CONTROL_AUTHORITY_CONTRACT: runtimeNodes.controls ? runtimeNodes.controls.contract : "UNKNOWN",
      CONTROL_AUTHORITY_RECOGNIZED: runtimeNodes.controls ? runtimeNodes.controls.contractRecognized : false,

      CANVAS_AUTHORITY_OBSERVED: runtimeNodes.canvas ? runtimeNodes.canvas.authorityPresent : false,
      CANVAS_AUTHORITY_SOURCE_PATH: runtimeNodes.canvas ? runtimeNodes.canvas.authorityPath : "NONE",
      CANVAS_AUTHORITY_CONTRACT: runtimeNodes.canvas ? runtimeNodes.canvas.contract : "UNKNOWN",
      CANVAS_AUTHORITY_RECEIPT: runtimeNodes.canvas ? runtimeNodes.canvas.receipt : "UNKNOWN",
      CANVAS_AUTHORITY_RECOGNIZED: runtimeNodes.canvas ? runtimeNodes.canvas.contractRecognized : false,

      HEX_AUTHORITY_OBSERVED: runtimeNodes.hexAuthority ? runtimeNodes.hexAuthority.authorityPresent : false,
      HEX_AUTHORITY_CONTRACT: runtimeNodes.hexAuthority ? runtimeNodes.hexAuthority.contract : "UNKNOWN",
      HEX_AUTHORITY_RECOGNIZED: runtimeNodes.hexAuthority ? runtimeNodes.hexAuthority.contractRecognized : false,

      HEX_SURFACE_AUTHORITY_OBSERVED: runtimeNodes.hexSurface ? runtimeNodes.hexSurface.authorityPresent : false,
      HEX_SURFACE_AUTHORITY_CONTRACT: runtimeNodes.hexSurface ? runtimeNodes.hexSurface.contract : "UNKNOWN",
      HEX_SURFACE_AUTHORITY_RECOGNIZED: runtimeNodes.hexSurface ? runtimeNodes.hexSurface.contractRecognized : false,

      POINTER_SURFACE_BISHOP_OBSERVED: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.observed : false,
      POINTER_SURFACE_BISHOP_SCRIPT_PRESENT: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.scriptPresent : false,
      POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.authorityPresent : false,
      POINTER_SURFACE_BISHOP_AUTHORITY_PATH: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.authorityPath : "NONE",
      POINTER_SURFACE_BISHOP_CONTRACT: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.contract : "UNKNOWN",
      POINTER_SURFACE_BISHOP_RECEIPT: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.receipt : "UNKNOWN",
      POINTER_SURFACE_BISHOP_RECOGNIZED: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.contractRecognized : false,
      POINTER_SURFACE_BISHOP_STATUS: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.nodeStatus : "UNKNOWN",
      POINTER_SURFACE_BISHOP_MISSING_RUNTIME_FACT: runtimeNodes.pointerSurface ? runtimeNodes.pointerSurface.missingRuntimeFact : "UNKNOWN",

      POINTER_INSPECT_PRIEST_OBSERVED: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.observed : false,
      POINTER_INSPECT_PRIEST_SCRIPT_PRESENT: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.scriptPresent : false,
      POINTER_INSPECT_PRIEST_AUTHORITY_PRESENT: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.authorityPresent : false,
      POINTER_INSPECT_PRIEST_AUTHORITY_PATH: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.authorityPath : "NONE",
      POINTER_INSPECT_PRIEST_CONTRACT: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.contract : "UNKNOWN",
      POINTER_INSPECT_PRIEST_RECEIPT: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.receipt : "UNKNOWN",
      POINTER_INSPECT_PRIEST_RECOGNIZED: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.contractRecognized : false,
      POINTER_INSPECT_PRIEST_STATUS: runtimeNodes.pointerInspect ? runtimeNodes.pointerInspect.nodeStatus : "UNKNOWN",

      STAGE_PRESENT: stage.exists,
      STAGE_SELECTOR: snapshot.stageSelector,
      STAGE_DESCRIPTOR: stage.descriptor,
      STAGE_RECT_NONZERO: stage.rectNonzero,
      STAGE_RECT_WIDTH: stage.rectWidth,
      STAGE_RECT_HEIGHT: stage.rectHeight,
      STAGE_OFFSET_WIDTH: stage.offsetWidth,
      STAGE_OFFSET_HEIGHT: stage.offsetHeight,
      STAGE_CLIENT_WIDTH: stage.clientWidth,
      STAGE_CLIENT_HEIGHT: stage.clientHeight,
      STAGE_COMPUTED_VISIBLE: stage.computedVisible,
      STAGE_COMPUTED_DISPLAY: stage.computedDisplay,
      STAGE_COMPUTED_POSITION: stage.computedPosition,
      STAGE_COMPUTED_OVERFLOW: stage.computedOverflow,
      STAGE_COMPUTED_WIDTH: stage.computedWidth,
      STAGE_COMPUTED_HEIGHT: stage.computedHeight,
      STAGE_USED_SIZE_CLASS: stage.usedSizeClass,
      STAGE_USED_SIZE_FIRST_MISSING_FACT: stage.usedSizeFirstMissingFact,

      CANONICAL_MOUNT_SELECTOR,
      CANONICAL_FRAME_SELECTOR,
      CANONICAL_CANVAS_SELECTOR,
      CANONICAL_CHAIN_SELECTOR,
      CANONICAL_CANVAS_SELECTORS: CANONICAL_CANVAS_SELECTORS.slice(),

      CANONICAL_MOUNT_FOUND: mount.exists,
      CANONICAL_MOUNT_DESCRIPTOR: mount.descriptor,
      CANONICAL_MOUNT_RECT_NONZERO: mount.rectNonzero,
      CANONICAL_MOUNT_RECT_WIDTH: mount.rectWidth,
      CANONICAL_MOUNT_RECT_HEIGHT: mount.rectHeight,
      CANONICAL_MOUNT_OFFSET_WIDTH: mount.offsetWidth,
      CANONICAL_MOUNT_OFFSET_HEIGHT: mount.offsetHeight,
      CANONICAL_MOUNT_CLIENT_WIDTH: mount.clientWidth,
      CANONICAL_MOUNT_CLIENT_HEIGHT: mount.clientHeight,
      CANONICAL_MOUNT_COMPUTED_VISIBLE: mount.computedVisible,
      CANONICAL_MOUNT_COMPUTED_DISPLAY: mount.computedDisplay,
      CANONICAL_MOUNT_COMPUTED_POSITION: mount.computedPosition,
      CANONICAL_MOUNT_COMPUTED_OVERFLOW: mount.computedOverflow,
      CANONICAL_MOUNT_COMPUTED_CONTAIN: mount.computedContain,
      CANONICAL_MOUNT_COMPUTED_CONTENT_VISIBILITY: mount.computedContentVisibility,
      CANONICAL_MOUNT_COMPUTED_WIDTH: mount.computedWidth,
      CANONICAL_MOUNT_COMPUTED_HEIGHT: mount.computedHeight,
      CANONICAL_MOUNT_COMPUTED_MIN_WIDTH: mount.computedMinWidth,
      CANONICAL_MOUNT_COMPUTED_MIN_HEIGHT: mount.computedMinHeight,
      CANONICAL_MOUNT_COMPUTED_FLEX: mount.computedFlex,
      CANONICAL_MOUNT_COMPUTED_FLEX_BASIS: mount.computedFlexBasis,
      CANONICAL_MOUNT_USED_SIZE_CLASS: mount.usedSizeClass,
      CANONICAL_MOUNT_USED_SIZE_FIRST_MISSING_FACT: mount.usedSizeFirstMissingFact,
      CANONICAL_MOUNT_USED_SIZE_REASON: mount.usedSizeReason,

      CANONICAL_FRAME_FOUND: frame.exists,
      CANONICAL_FRAME_DESCRIPTOR: frame.descriptor,
      CANONICAL_FRAME_RECT_NONZERO: frame.rectNonzero,
      CANONICAL_FRAME_RECT_WIDTH: frame.rectWidth,
      CANONICAL_FRAME_RECT_HEIGHT: frame.rectHeight,
      CANONICAL_FRAME_OFFSET_WIDTH: frame.offsetWidth,
      CANONICAL_FRAME_OFFSET_HEIGHT: frame.offsetHeight,
      CANONICAL_FRAME_CLIENT_WIDTH: frame.clientWidth,
      CANONICAL_FRAME_CLIENT_HEIGHT: frame.clientHeight,
      CANONICAL_FRAME_COMPUTED_VISIBLE: frame.computedVisible,
      CANONICAL_FRAME_COMPUTED_DISPLAY: frame.computedDisplay,
      CANONICAL_FRAME_COMPUTED_POSITION: frame.computedPosition,
      CANONICAL_FRAME_COMPUTED_OVERFLOW: frame.computedOverflow,
      CANONICAL_FRAME_COMPUTED_CONTAIN: frame.computedContain,
      CANONICAL_FRAME_COMPUTED_CONTENT_VISIBILITY: frame.computedContentVisibility,
      CANONICAL_FRAME_COMPUTED_WIDTH: frame.computedWidth,
      CANONICAL_FRAME_COMPUTED_HEIGHT: frame.computedHeight,
      CANONICAL_FRAME_USED_SIZE_CLASS: frame.usedSizeClass,
      CANONICAL_FRAME_USED_SIZE_FIRST_MISSING_FACT: frame.usedSizeFirstMissingFact,

      CANONICAL_CANVAS_FOUND: Boolean(snapshot.canonicalCanvas),
      CANONICAL_CANVAS_SELECTOR: snapshot.canonicalFound.selector,
      CANONICAL_CANVAS_DESCRIPTOR: canonicalSummary.descriptor || "NONE",
      CANONICAL_CANVAS_INDEX: canonicalSummary.index || 0,
      CANONICAL_CANVAS_IN_CANONICAL_MOUNT: canonicalSummary.inCanonicalMount || false,
      CANONICAL_CANVAS_IN_CANONICAL_FRAME: canonicalSummary.inCanonicalFrame || false,

      CANVAS_ELEMENT_FOUND: Boolean(snapshot.canonicalCanvas),
      CANVAS_DOM_SURFACE_FOUND: Boolean(snapshot.canonicalCanvas),
      CANVAS_SELECTOR: snapshot.canonicalFound.selector,
      CANVAS_MOUNT_FOUND: mount.exists,
      CANVAS_MOUNT_SELECTOR: CANONICAL_MOUNT_SELECTOR,
      CANVAS_FRAME_FOUND: frame.exists,
      CANVAS_FRAME_SELECTOR: CANONICAL_FRAME_SELECTOR,
      CANVAS_IN_MOUNT: canonicalSummary.inCanonicalMount || false,
      CANVAS_IN_FRAME: canonicalSummary.inCanonicalFrame || false,

      CANVAS_WIDTH_ATTRIBUTE: canonicalSummary.widthAttribute || 0,
      CANVAS_HEIGHT_ATTRIBUTE: canonicalSummary.heightAttribute || 0,
      CANVAS_INTERNAL_SIZE_NONZERO: canonicalSummary.internalSizeNonzero || false,

      CANVAS_RECT_LEFT: canonicalSummary.rectLeft || 0,
      CANVAS_RECT_TOP: canonicalSummary.rectTop || 0,
      CANVAS_RECT_RIGHT: canonicalSummary.rectRight || 0,
      CANVAS_RECT_BOTTOM: canonicalSummary.rectBottom || 0,
      CANVAS_RECT_WIDTH: canonicalSummary.rectWidth || 0,
      CANVAS_RECT_HEIGHT: canonicalSummary.rectHeight || 0,
      CANVAS_RECT_NONZERO: canonicalSummary.rectNonzero || false,
      CANVAS_OFFSET_WIDTH: canonicalSummary.offsetWidth || 0,
      CANVAS_OFFSET_HEIGHT: canonicalSummary.offsetHeight || 0,
      CANVAS_CLIENT_WIDTH: canonicalSummary.clientWidth || 0,
      CANVAS_CLIENT_HEIGHT: canonicalSummary.clientHeight || 0,
      CANVAS_BUFFER_CSS_WIDTH_RATIO: canonicalSummary.bufferCssWidthRatio || 0,
      CANVAS_BUFFER_CSS_HEIGHT_RATIO: canonicalSummary.bufferCssHeightRatio || 0,

      CANVAS_COMPUTED_VISIBLE: canonicalSummary.computedVisible || false,
      CANVAS_COMPUTED_DISPLAY: canonicalSummary.computedDisplay || "UNKNOWN",
      CANVAS_COMPUTED_VISIBILITY: canonicalSummary.computedVisibility || "UNKNOWN",
      CANVAS_COMPUTED_OPACITY: canonicalSummary.computedOpacity || "UNKNOWN",
      CANVAS_COMPUTED_POSITION: canonicalSummary.computedPosition || "UNKNOWN",
      CANVAS_COMPUTED_Z_INDEX: canonicalSummary.computedZIndex || "UNKNOWN",
      CANVAS_COMPUTED_POINTER_EVENTS: canonicalSummary.computedPointerEvents || "UNKNOWN",
      CANVAS_COMPUTED_TRANSFORM: canonicalSummary.computedTransform || "UNKNOWN",
      CANVAS_COMPUTED_OVERFLOW: canonicalSummary.computedOverflow || "UNKNOWN",
      CANVAS_COMPUTED_CONTAIN: canonicalSummary.computedContain || "UNKNOWN",
      CANVAS_COMPUTED_CONTENT_VISIBILITY: canonicalSummary.computedContentVisibility || "UNKNOWN",
      CANVAS_COMPUTED_WIDTH: canonicalSummary.computedWidth || "UNKNOWN",
      CANVAS_COMPUTED_HEIGHT: canonicalSummary.computedHeight || "UNKNOWN",
      CANVAS_COMPUTED_MIN_WIDTH: canonicalSummary.computedMinWidth || "UNKNOWN",
      CANVAS_COMPUTED_MIN_HEIGHT: canonicalSummary.computedMinHeight || "UNKNOWN",
      CANVAS_COMPUTED_FLEX: canonicalSummary.computedFlex || "UNKNOWN",
      CANVAS_COMPUTED_FLEX_BASIS: canonicalSummary.computedFlexBasis || "UNKNOWN",
      CANVAS_COMPUTED_BOX_SIZING: canonicalSummary.computedBoxSizing || "UNKNOWN",
      CANVAS_USED_SIZE_CLASS: canonicalSummary.usedSizeClass || "UNKNOWN",
      CANVAS_USED_SIZE_FIRST_MISSING_FACT:
        canonicalSummary.usedSizeFirstMissingFact || "UNKNOWN",
      CANVAS_USED_SIZE_REASON: canonicalSummary.usedSizeReason || "UNKNOWN",

      CANVAS_VIEWPORT_INTERSECTING: canonicalSummary.viewportIntersecting || false,
      CANVAS_CONTEXT_2D_READY: canonicalSummary.context2dReady || false,
      CANVAS_CONTEXT_2D_STATUS: canonicalSummary.context2dStatus || "NOT_ATTEMPTED",

      CANVAS_PIXEL_SAMPLE_STATUS: canonicalSummary.pixelSampleStatus || "NO_PIXEL_SAMPLE",
      CANVAS_PIXEL_SAMPLE_READABLE: canonicalSummary.pixelSampleReadable || false,
      CANVAS_PIXEL_VISIBLE: canonicalSummary.pixelVisible || false,
      CANVAS_PIXEL_SAMPLE_COUNT: canonicalSummary.pixelSampleCount || 0,
      CANVAS_VISIBLE_PIXEL_COUNT: canonicalSummary.visiblePixelCount || 0,
      CANVAS_ALPHA_PIXEL_COUNT: canonicalSummary.alphaPixelCount || 0,
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: canonicalSummary.uniqueColorCount || 0,
      CANVAS_PIXEL_AVERAGE_BRIGHTNESS: canonicalSummary.averageBrightness || 0,
      CANVAS_PIXEL_SAMPLE_REASON: canonicalSummary.pixelSampleReason || "NO_CANONICAL_CANVAS",

      CANONICAL_CANVAS_DATASET_CONTRACT: canonicalSummary.datasetContract || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_RECEIPT: canonicalSummary.datasetReceipt || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_FALLBACK: canonicalSummary.datasetFallback || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_CARTOON: canonicalSummary.datasetCartoon || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_DOWNSTREAM_OBSERVED: canonicalSummary.datasetDownstreamObserved || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_DOWNSTREAM_LATCHED: canonicalSummary.datasetDownstreamLatched || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_SELECTION_MODE: canonicalSummary.datasetSelectionMode || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_POINTER_SURFACE_OBSERVED:
        canonicalSummary.datasetPointerSurfaceObserved || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_POINTER_SURFACE_LATCHED:
        canonicalSummary.datasetPointerSurfaceLatched || "UNKNOWN",
      CANONICAL_CANVAS_DATASET_POINTER_INSPECT_OBSERVED:
        canonicalSummary.datasetPointerInspectObserved || "UNKNOWN",
      CANONICAL_CANVAS_PIXEL_VISIBLE: canonicalSummary.pixelVisible || false,
      CANONICAL_CANVAS_SURFACE_ADMISSIBLE: snapshot.canonicalSurfaceAdmissible,

      CANONICAL_PARENT_CHAIN_STATUS: chain.status || "UNKNOWN",
      CANONICAL_PARENT_FIRST_COLLAPSED_DEPTH: chain.firstCollapsedDepth,
      CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR: chain.firstCollapsedDescriptor,
      CANONICAL_PARENT_FIRST_COLLAPSED_WIDTH: chain.firstCollapsedWidth,
      CANONICAL_PARENT_FIRST_COLLAPSED_HEIGHT: chain.firstCollapsedHeight,
      CANONICAL_PARENT_FIRST_COLLAPSED_COMPUTED_WIDTH: chain.firstCollapsedComputedWidth,
      CANONICAL_PARENT_FIRST_COLLAPSED_COMPUTED_HEIGHT: chain.firstCollapsedComputedHeight,
      CANONICAL_PARENT_FIRST_COLLAPSED_CLASS: chain.firstCollapsedClass,
      CANONICAL_PARENT_FIRST_COLLAPSED_MISSING_FACT: chain.firstCollapsedMissingFact,
      CANONICAL_PARENT_FIRST_HIDDEN_DEPTH: chain.firstHiddenDepth,
      CANONICAL_PARENT_FIRST_HIDDEN_DESCRIPTOR: chain.firstHiddenDescriptor,

      MOUNT_PARENT_CHAIN_STATUS: mountChain.status || "UNKNOWN",
      MOUNT_PARENT_FIRST_COLLAPSED_DEPTH: mountChain.firstCollapsedDepth,
      MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR: mountChain.firstCollapsedDescriptor,
      MOUNT_PARENT_FIRST_COLLAPSED_WIDTH: mountChain.firstCollapsedWidth,
      MOUNT_PARENT_FIRST_COLLAPSED_HEIGHT: mountChain.firstCollapsedHeight,
      MOUNT_PARENT_FIRST_COLLAPSED_COMPUTED_WIDTH: mountChain.firstCollapsedComputedWidth,
      MOUNT_PARENT_FIRST_COLLAPSED_COMPUTED_HEIGHT: mountChain.firstCollapsedComputedHeight,
      MOUNT_PARENT_FIRST_COLLAPSED_CLASS: mountChain.firstCollapsedClass,
      MOUNT_PARENT_FIRST_COLLAPSED_MISSING_FACT: mountChain.firstCollapsedMissingFact,
      MOUNT_PARENT_FIRST_HIDDEN_DEPTH: mountChain.firstHiddenDepth,
      MOUNT_PARENT_FIRST_HIDDEN_DESCRIPTOR: mountChain.firstHiddenDescriptor,

      FALLBACK_OR_CARTOON_SIGNAL_OBSERVED: snapshot.fallbackObserved,
      FALLBACK_OR_CARTOON_SIGNAL_BASIS: canonicalSummary.fallbackTextBasis || "UNKNOWN",

      CANVAS_LAYER_CHECK_STATUS: layering.status || "NOT_EVALUATED",
      CANVAS_LAYER_CENTER_ELEMENT_DESCRIPTOR: layering.centerElementDescriptor || "NONE",
      CANVAS_LAYER_CENTER_ELEMENT_IS_CANONICAL_CANVAS: layering.centerElementIsCanonicalCanvas || false,
      CANVAS_LAYER_CENTER_ELEMENT_CONTAINS_CANONICAL_CANVAS:
        layering.centerElementContainsCanonicalCanvas || false,
      CANVAS_LAYER_CANONICAL_CANVAS_CONTAINS_CENTER_ELEMENT:
        layering.canonicalCanvasContainsCenterElement || false,
      CANVAS_LAYER_POSSIBLE_BLOCKER: layering.possibleLayerBlocker || "UNKNOWN",

      TOTAL_CANVAS_COUNT: snapshot.allCanvases.length,
      PIXEL_BEARING_CANVAS_FOUND: snapshot.pixelBearingCanvasFound,
      PIXEL_BEARING_CANVAS_COUNT: snapshot.pixelBearingSummaries.length,
      PIXEL_BEARING_CANVAS_IS_CANONICAL: snapshot.pixelBearingCanvasIsCanonical,
      PIXEL_BEARING_CANVAS_SELECTOR: firstPixelBearingSummary.selector || "NONE",
      PIXEL_BEARING_CANVAS_DESCRIPTOR: firstPixelBearingSummary.descriptor || "NONE",
      PIXEL_BEARING_CANVAS_INDEX: firstPixelBearingSummary.index || 0,
      PIXEL_BEARING_CANVAS_RECT_NONZERO: firstPixelBearingSummary.rectNonzero || false,
      PIXEL_BEARING_CANVAS_IN_CANONICAL_MOUNT:
        firstPixelBearingSummary.inCanonicalMount || false,
      NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT: snapshot.nonCanonicalPixelBearingCanvasCount,

      BOUNDARY_FACT_MATRIX_ACTIVE: true,
      BOUNDARY_ONE_ROW_PER_BOUNDARY: true,
      BOUNDARY_ONE_MISSING_PROOF_ONE_MISSING_FACT: true,
      BOUNDARY_NO_SINGLE_FILE_RECOMMENDATION_UNLESS_PROVEN: true,
      BOUNDARY_TOTAL_ROW_COUNT: snapshot.boundaryRows.length,
      BOUNDARY_LAYOUT_ROW_COUNT: snapshot.layoutBoundaryRows.length,
      BOUNDARY_RUNTIME_ROW_COUNT: snapshot.runtimeBoundaryRows.length,
      BOUNDARY_ALL_BLOCKING_CLEAN: boundaryClean,
      BOUNDARY_LAYOUT_BLOCKING_CLEAN: layoutClean,
      BOUNDARY_RUNTIME_BLOCKING_CLEAN: runtimeClean,
      BOUNDARY_FIRST_FAILED: anyFirst ? anyFirst.id : "NONE",
      BOUNDARY_FIRST_FAILED_CLASS: anyFirst ? anyFirst.class : "NONE",
      BOUNDARY_FIRST_MISSING_PROOF: anyFirst ? anyFirst.firstMissingProof : "NONE",
      BOUNDARY_FIRST_MISSING_FACT: anyFirst ? anyFirst.firstMissingFact : "NONE",
      BOUNDARY_FIRST_RECOMMENDED_OWNER: anyFirst ? anyFirst.recommendedOwner : "NONE",
      BOUNDARY_FIRST_RECOMMENDED_FILE: anyFirst ? anyFirst.recommendedFile : "NONE",
      BOUNDARY_FIRST_RECOMMENDED_ACTION: anyFirst ? anyFirst.recommendedAction : "NONE",
      BOUNDARY_LAYOUT_FIRST_FAILED: layoutFirst ? layoutFirst.id : "NONE",
      BOUNDARY_LAYOUT_FIRST_MISSING_FACT: layoutFirst ? layoutFirst.firstMissingFact : "NONE",
      BOUNDARY_RUNTIME_FIRST_FAILED: runtimeFirst ? runtimeFirst.id : "NONE",
      BOUNDARY_RUNTIME_FIRST_MISSING_FACT: runtimeFirst ? runtimeFirst.firstMissingFact : "NONE",
      BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN: verdict.singleCausalFileProven === true,
      BOUNDARY_SINGLE_CAUSAL_FILE: verdict.singleCausalFileProven ? verdict.file : "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: verdict.status,
      CANVAS_SURFACE_TRUTH_LANE_STATUS: verdict.clean
        ? "CANVAS_SURFACE_TRUTH_LANE_PASSED_NO_FINAL_CLAIM"
        : "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: verdict.clean,

      CANVAS_TRUTH_STATUS: verdict.status,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: verdict.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: verdict.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: verdict.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: verdict.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: verdict.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: verdict.action,

      ZONE_OF_INFLICTION_OWNER: verdict.owner,
      ZONE_OF_INFLICTION_FILE: verdict.file,
      ZONE_OF_INFLICTION_CLASS: verdict.failureClass,
      ZONE_OF_INFLICTION_REASON: verdict.reason,

      FINAL_ARBITRATION_SOURCE_LANE:
        "POINTER_SURFACE_BISHOP_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_LANE",
      DIAGNOSTIC_CERTAINTY: verdict.certainty,
      OBSERVABLE_CAUSE:
        `CANONICAL:${verdict.coordinate}:${verdict.failureClass}:${verdict.reason}`,
      RECOMMENDED_NEXT_OWNER: verdict.owner,
      RECOMMENDED_NEXT_FILE: verdict.file,
      RECOMMENDED_NEXT_ACTION: verdict.action,

      RUNTIME_DARK_FILE_COUNT: darkRuntimeFiles.length,
      RUNTIME_DARK_FILES: clonePlain(darkRuntimeFiles),
      FIRST_DARK_RUNTIME_OWNER: darkRuntimeFiles[0] ? darkRuntimeFiles[0].id : "NONE",
      FIRST_DARK_RUNTIME_FILE: darkRuntimeFiles[0] ? darkRuntimeFiles[0].file : "NONE",
      FIRST_DARK_RUNTIME_CLASS: darkRuntimeFiles[0] ? darkRuntimeFiles[0].nodeStatus : "NONE",
      FIRST_DARK_RUNTIME_ACTION: darkRuntimeFiles[0]
        ? "CONFIRM_PUBLIC_AUTHORITY_CONTRACT_AND_ALIAS_FAMILY_ALIGNMENT"
        : "NONE",

      BOUNDARY_FACT_ROWS: clonePlain(snapshot.boundaryRows),
      LAYOUT_BOUNDARY_FACT_ROWS: clonePlain(snapshot.layoutBoundaryRows),
      RUNTIME_BOUNDARY_FACT_ROWS: clonePlain(snapshot.runtimeBoundaryRows),
      RUNTIME_NODES: clonePlain(runtimeNodes),
      CANONICAL_CANVAS_SUMMARY: clonePlain(canonicalSummary),
      STAGE_USED_SIZE_SUMMARY: clonePlain(stage),
      MOUNT_USED_SIZE_SUMMARY: clonePlain(mount),
      FRAME_USED_SIZE_SUMMARY: clonePlain(frame),
      FIRST_PIXEL_BEARING_CANVAS_SUMMARY: clonePlain(firstPixelBearingSummary),
      PIXEL_BEARING_CANVAS_SUMMARIES: clonePlain(snapshot.pixelBearingSummaries),
      ALL_CANVAS_SUMMARIES: clonePlain(snapshot.allCanvasSummaries),
      CANONICAL_PARENT_CHAIN: clonePlain(snapshot.canonicalParentChain),
      MOUNT_PARENT_CHAIN: clonePlain(snapshot.mountParentChain),

      CONTROL_DUTY_LANE_STATUS: "READ_ONLY_RUNTIME_BOUNDARY_FACTS_REPORTED",
      DELEGATORY_PERMISSION_LANE_STATUS: "READ_ONLY_BOUNDARY_FACTS_REPORTED_NO_PERMISSION_INVENTION",
      ROUTE_CONDUCTOR_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      HEX_SURFACE_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      POINTER_SURFACE_BISHOP_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      POINTER_INSPECT_PRIEST_LANE_STATUS: "ADVISORY_CHILD_READ_ONLY_NO_REPAIR",
      TRUTH_HUB_STATUS: "POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_ONLY",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "2",
      TRUTH_HUB_RECEIPT_ROUTES:
        "LAYOUT_PARENT_CHAIN_USED_SIZE_BOUNDARY_LANE|RUNTIME_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_LANE",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      CANVAS_SURFACE_TRUTH_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function makeErrorReport(error, payload = {}) {
    const message = bounded(error && error.message ? error.message : error, 1200);

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_ERROR_PACKET_v2_0",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      POINTER_SURFACE_FILE,
      POINTER_INSPECT_FILE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED_WITH_INTERNAL_ERROR_PACKET",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "false",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CALL_GUARDED_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_ONLY",
      TARGET_CONTEXT_STATUS: "UNKNOWN",
      TARGET_CONTEXT_SOURCE: "UNKNOWN",
      TARGET_ACCESS_ERROR: "UNKNOWN",

      POINTER_SURFACE_BISHOP_MAPPING_ACTIVE: true,
      POINTER_SURFACE_IS_MAIN_CHAIN_BISHOP_GATE: true,
      POINTER_INSPECT_IS_PRIMARY_CHAIN_ENDPOINT: false,
      POINTER_INSPECT_IS_CHILD_ORGANIZER: true,
      POINTER_INSPECT_CAN_BLOCK_MAIN_LOOP: false,

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_SURFACE_TRUTH_LANE_STATUS: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: false,

      BOUNDARY_FACT_MATRIX_ACTIVE: true,
      BOUNDARY_FIRST_FAILED: "PROBE_CALL_GUARD",
      BOUNDARY_FIRST_MISSING_PROOF: "PROBE_RETURN_PACKET_PROOF",
      BOUNDARY_FIRST_MISSING_FACT: "PROBE_INTERNAL_ERROR_ABSENT",
      BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN: true,
      BOUNDARY_SINGLE_CAUSAL_FILE: FILE,

      CANVAS_TRUTH_STATUS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "PROBE_CALL_GUARD",
      CANVAS_TRUTH_FAILURE_CLASS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_TRUTH_FAILURE_REASON: message || "UNKNOWN_INTERNAL_ERROR",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      CANVAS_TRUTH_RECOMMENDED_FILE: FILE,
      CANVAS_TRUTH_RECOMMENDED_ACTION:
        "RENEW_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARD_OR_RETURN_PACKET",

      FINAL_ARBITRATION_SOURCE_LANE:
        "POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_LANE",
      DIAGNOSTIC_CERTAINTY: "DEFINITIVE_PROBE_INTERNAL_ERROR",
      OBSERVABLE_CAUSE: `PROBE_CALL_GUARD:${message || "UNKNOWN_INTERNAL_ERROR"}`,
      RECOMMENDED_NEXT_OWNER: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      RECOMMENDED_NEXT_FILE: FILE,
      RECOMMENDED_NEXT_ACTION:
        "RENEW_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARD_OR_RETURN_PACKET",

      CALL_GUARD_ACTIVE: true,
      CALL_GUARD_CAUGHT_ERROR: message || "UNKNOWN_INTERNAL_ERROR",
      PAYLOAD_KEYS: isObject(payload)
        ? Object.keys(payload).join(",") || "NONE"
        : "NON_OBJECT_PAYLOAD",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "V2_0_CALL_GUARD_RETURNED_ERROR_PACKET | NO_THROW_TO_NORTH | NO_PRODUCTION_MUTATION_AUTHORIZED",
      CANVAS_SURFACE_TRUTH_NOTES:
        "CALL_GUARD_PREVENTED_CHRONOLOGY_HARD_FAILURE",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function scheduleSettledSample(payload) {
    if (settledSampleScheduled) return;
    settledSampleScheduled = true;

    const run = () => {
      try {
        const snapshot = captureSurfaceSnapshot(payload, "SETTLED_PASSIVE_DELAYED");
        const report = buildReportFromSnapshot(snapshot, "SETTLED_PASSIVE_DELAYED");
        const comparison = compareImmediateToSettled(lastReport, report);

        report.TRANSITION_SETTLED_SAMPLE_AVAILABLE = true;
        report.TRANSITION_COMPARISON_STATUS = comparison.status;
        report.TRANSITION_COMPARISON_CLASS = comparison.class;
        report.TRANSITION_COMPARISON_REASON = comparison.reason;

        lastSettledReport = clonePlain(report);

        root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
          clonePlain(lastSettledReport);
        root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
          clonePlain(lastSettledReport);
        root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_SETTLED_REPORT =
          clonePlain(lastSettledReport);

        publish();
      } catch (error) {
        lastSettledReport = makeErrorReport(error, payload);
        publish();
      }
    };

    try {
      if (isFunction(root.requestAnimationFrame)) {
        root.requestAnimationFrame(() => {
          try {
            root.setTimeout(run, 280);
          } catch (_error) {
            run();
          }
        });
      } else if (isFunction(root.setTimeout)) {
        root.setTimeout(run, 280);
      }
    } catch (_error) {}
  }

  function inspectSurface(payload = {}) {
    try {
      const snapshot = captureSurfaceSnapshot(payload, "IMMEDIATE_SYNC");
      const report = buildReportFromSnapshot(snapshot, "IMMEDIATE_SYNC");

      lastReport = clonePlain(report);
      lastReceipt = buildReceipt(lastReport);
      lastPacketText = composePacketText(lastReport);
      lastCompactSummary = composeCompactSummary(lastReport);

      scheduleSettledSample(payload);
      publish();

      return clonePlain(report);
    } catch (error) {
      const report = makeErrorReport(error, payload);

      lastReport = clonePlain(report);
      lastReceipt = buildReceipt(lastReport);
      lastPacketText = composePacketText(lastReport);
      lastCompactSummary = composeCompactSummary(lastReport);

      publish();

      return clonePlain(report);
    }
  }

  function makeAnchorReport() {
    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_ANCHOR_PACKET_v2_0",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      LINEAGE_V1_8_CONTRACT,
      LINEAGE_V1_7_CONTRACT,
      LINEAGE_V1_6_CONTRACT,
      LINEAGE_V1_5_CONTRACT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      POINTER_SURFACE_FILE,
      POINTER_INSPECT_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_POINTER_SURFACE_CONTRACT,
      EXPECTED_POINTER_SURFACE_RENEWAL_CANDIDATE,
      EXPECTED_POINTER_INSPECT_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "ANCHOR_READY",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "UNKNOWN",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CALL_GUARDED_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_ONLY",
      TARGET_CONTEXT_STATUS: "NOT_RUN",
      TARGET_CONTEXT_SOURCE: "ANCHOR_ONLY",
      TARGET_ACCESS_ERROR: "NONE",

      POINTER_SURFACE_BISHOP_MAPPING_ACTIVE: true,
      POINTER_SURFACE_BISHOP_FILE: POINTER_SURFACE_FILE,
      POINTER_INSPECT_PRIEST_FILE: POINTER_INSPECT_FILE,
      POINTER_SURFACE_IS_MAIN_CHAIN_BISHOP_GATE: true,
      POINTER_INSPECT_IS_PRIMARY_CHAIN_ENDPOINT: false,
      POINTER_INSPECT_IS_CHILD_ORGANIZER: true,
      POINTER_INSPECT_CAN_BLOCK_MAIN_LOOP: false,

      TRANSITION_MEASUREMENT_MODE: "ANCHOR_ONLY",
      TRANSITION_SAMPLE_PHASE: "ANCHOR_ONLY",
      TRANSITION_SETTLED_SAMPLE_SCHEDULED: false,
      TRANSITION_SETTLED_SAMPLE_AVAILABLE: false,
      TRANSITION_COMPARISON_STATUS: "NOT_RUN",
      TRANSITION_COMPARISON_CLASS: "NOT_RUN",
      TRANSITION_COMPARISON_REASON: "ANCHOR_ONLY",

      BOUNDARY_FACT_MATRIX_ACTIVE: true,
      BOUNDARY_ONE_ROW_PER_BOUNDARY: true,
      BOUNDARY_ONE_MISSING_PROOF_ONE_MISSING_FACT: true,
      BOUNDARY_NO_SINGLE_FILE_RECOMMENDATION_UNLESS_PROVEN: true,
      BOUNDARY_FIRST_FAILED: "NOT_RUN",
      BOUNDARY_FIRST_MISSING_PROOF: "NOT_RUN",
      BOUNDARY_FIRST_MISSING_FACT: "NOT_RUN",
      BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN: false,
      BOUNDARY_SINGLE_CAUSAL_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS:
        "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_SURFACE_TRUTH_LANE_STATUS:
        "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: "UNKNOWN",

      CANVAS_TRUTH_STATUS: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_CLASS: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_REASON: "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "NONE",
      CANVAS_TRUTH_RECOMMENDED_FILE: "NONE",
      CANVAS_TRUTH_RECOMMENDED_ACTION: "CALL_runProbeCanvasSurfaceTruth",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "V2_0_ANCHOR_READY | POINTER_SURFACE_BISHOP_MAP_ACTIVE | INSPECT_DEMOTED_TO_CHILD_ORGANIZER | CALL_GUARDED | TARGET_NOT_YET_PROBED | NO_PRODUCTION_MUTATION_AUTHORIZED",
      CANVAS_SURFACE_TRUTH_NOTES:
        "ANCHOR_SAFE_CHRONOLOGY_OBSERVATION_READY | HEAVY_TARGET_PROBE_NOT_RUN_DURING_PUBLISH",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildReceipt(report = lastReport || makeAnchorReport()) {
    const r = report || makeAnchorReport();

    return {
      packetType:
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_RECEIPT_PACKET_v2_0",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageV18Contract: LINEAGE_V1_8_CONTRACT,
      lineageV17Contract: LINEAGE_V1_7_CONTRACT,
      lineageV16Contract: LINEAGE_V1_6_CONTRACT,
      lineageV15Contract: LINEAGE_V1_5_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      pointerInspectFile: POINTER_INSPECT_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
      expectedPointerSurfaceRenewalCandidate: EXPECTED_POINTER_SURFACE_RENEWAL_CANDIDATE,
      expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

      diagnosticOnly: true,
      anchorSafeChronologyObservation: true,
      callGuardActive: true,
      pointerSurfaceBishopBoundaryFactMatrixActive: true,
      pointerSurfaceBishopMappingActive: true,
      pointerSurfaceIsMainChainBishopGate: true,
      pointerInspectIsPrimaryChainEndpoint: false,
      pointerInspectIsChildOrganizer: true,
      pointerInspectCanBlockMainLoop: false,
      parentChainUsedSizeFactMatrixActive: true,
      boundaryDiagnosisMatrixActive: true,
      oneBoundaryOneRowActive: true,
      oneMissingProofOneMissingFactActive: true,
      noSingleFileRecommendationUnlessProven: true,
      layoutMathArbitrationActive: true,
      connectionArbitrationActive: true,
      blindSpotArbitrationActive: true,
      canonicalVisibleSurfaceDisambiguationActive: true,
      transitionSurfaceDisambiguationActive: true,
      focusedOnCanonicalCanvasIdentity: true,

      canvasSurfaceTruthProbeStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY"),
      targetContextStatus: getRaw(r, "TARGET_CONTEXT_STATUS", "UNKNOWN"),
      targetContextSource: getRaw(r, "TARGET_CONTEXT_SOURCE", "UNKNOWN"),

      transitionMeasurementMode: getRaw(r, "TRANSITION_MEASUREMENT_MODE", "UNKNOWN"),
      transitionSamplePhase: getRaw(r, "TRANSITION_SAMPLE_PHASE", "UNKNOWN"),
      transitionSettledSampleScheduled: getRaw(r, "TRANSITION_SETTLED_SAMPLE_SCHEDULED", false),
      transitionSettledSampleAvailable: Boolean(lastSettledReport),
      transitionComparisonStatus: getRaw(r, "TRANSITION_COMPARISON_STATUS", "UNKNOWN"),
      transitionComparisonClass: getRaw(r, "TRANSITION_COMPARISON_CLASS", "UNKNOWN"),
      transitionComparisonReason: getRaw(r, "TRANSITION_COMPARISON_REASON", "UNKNOWN"),

      boundaryFactMatrixActive: getRaw(r, "BOUNDARY_FACT_MATRIX_ACTIVE", true),
      boundaryTotalRowCount: getRaw(r, "BOUNDARY_TOTAL_ROW_COUNT", 0),
      boundaryLayoutRowCount: getRaw(r, "BOUNDARY_LAYOUT_ROW_COUNT", 0),
      boundaryRuntimeRowCount: getRaw(r, "BOUNDARY_RUNTIME_ROW_COUNT", 0),
      boundaryFirstFailed: getRaw(r, "BOUNDARY_FIRST_FAILED", "UNKNOWN"),
      boundaryFirstMissingProof: getRaw(r, "BOUNDARY_FIRST_MISSING_PROOF", "UNKNOWN"),
      boundaryFirstMissingFact: getRaw(r, "BOUNDARY_FIRST_MISSING_FACT", "UNKNOWN"),
      boundarySingleCausalFileProven: getRaw(r, "BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN", false),
      boundarySingleCausalFile: getRaw(r, "BOUNDARY_SINGLE_CAUSAL_FILE", "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN"),
      boundaryLayoutFirstFailed: getRaw(r, "BOUNDARY_LAYOUT_FIRST_FAILED", "UNKNOWN"),
      boundaryRuntimeFirstFailed: getRaw(r, "BOUNDARY_RUNTIME_FIRST_FAILED", "UNKNOWN"),

      canvasScriptPresent: getRaw(r, "CANVAS_SCRIPT_PRESENT", "UNKNOWN"),
      canvasAuthorityObserved: getRaw(r, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN"),
      canvasAuthoritySourcePath: getRaw(r, "CANVAS_AUTHORITY_SOURCE_PATH", "NONE"),
      canvasAuthorityContract: getRaw(r, "CANVAS_AUTHORITY_CONTRACT", "UNKNOWN"),

      pointerSurfaceBishopObserved: getRaw(r, "POINTER_SURFACE_BISHOP_OBSERVED", "UNKNOWN"),
      pointerSurfaceBishopScriptPresent: getRaw(r, "POINTER_SURFACE_BISHOP_SCRIPT_PRESENT", "UNKNOWN"),
      pointerSurfaceBishopAuthorityPresent: getRaw(r, "POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT", "UNKNOWN"),
      pointerSurfaceBishopContract: getRaw(r, "POINTER_SURFACE_BISHOP_CONTRACT", "UNKNOWN"),
      pointerSurfaceBishopRecognized: getRaw(r, "POINTER_SURFACE_BISHOP_RECOGNIZED", "UNKNOWN"),
      pointerSurfaceBishopStatus: getRaw(r, "POINTER_SURFACE_BISHOP_STATUS", "UNKNOWN"),
      pointerInspectPriestObserved: getRaw(r, "POINTER_INSPECT_PRIEST_OBSERVED", "UNKNOWN"),
      pointerInspectPriestScriptPresent: getRaw(r, "POINTER_INSPECT_PRIEST_SCRIPT_PRESENT", "UNKNOWN"),
      pointerInspectPriestAuthorityPresent: getRaw(r, "POINTER_INSPECT_PRIEST_AUTHORITY_PRESENT", "UNKNOWN"),
      pointerInspectPriestContract: getRaw(r, "POINTER_INSPECT_PRIEST_CONTRACT", "UNKNOWN"),
      pointerInspectPriestRecognized: getRaw(r, "POINTER_INSPECT_PRIEST_RECOGNIZED", "UNKNOWN"),
      pointerInspectPriestStatus: getRaw(r, "POINTER_INSPECT_PRIEST_STATUS", "UNKNOWN"),

      canonicalMountFound: getRaw(r, "CANONICAL_MOUNT_FOUND", "UNKNOWN"),
      canonicalMountRectNonzero: getRaw(r, "CANONICAL_MOUNT_RECT_NONZERO", "UNKNOWN"),
      canonicalMountUsedSizeClass: getRaw(r, "CANONICAL_MOUNT_USED_SIZE_CLASS", "UNKNOWN"),
      canonicalMountUsedSizeFirstMissingFact:
        getRaw(r, "CANONICAL_MOUNT_USED_SIZE_FIRST_MISSING_FACT", "UNKNOWN"),
      canonicalFrameFound: getRaw(r, "CANONICAL_FRAME_FOUND", "UNKNOWN"),
      canonicalFrameRectNonzero: getRaw(r, "CANONICAL_FRAME_RECT_NONZERO", "UNKNOWN"),
      canonicalCanvasFound: getRaw(r, "CANONICAL_CANVAS_FOUND", "UNKNOWN"),
      canonicalCanvasSelector: getRaw(r, "CANONICAL_CANVAS_SELECTOR", "UNKNOWN"),
      canonicalCanvasDescriptor: getRaw(r, "CANONICAL_CANVAS_DESCRIPTOR", "UNKNOWN"),
      canonicalCanvasSurfaceAdmissible: getRaw(r, "CANONICAL_CANVAS_SURFACE_ADMISSIBLE", "UNKNOWN"),

      canvasElementFound: getRaw(r, "CANVAS_ELEMENT_FOUND", "UNKNOWN"),
      canvasInMount: getRaw(r, "CANVAS_IN_MOUNT", "UNKNOWN"),
      canvasInFrame: getRaw(r, "CANVAS_IN_FRAME", "UNKNOWN"),
      canvasRectNonzero: getRaw(r, "CANVAS_RECT_NONZERO", "UNKNOWN"),
      canvasComputedVisible: getRaw(r, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN"),
      canvasViewportIntersecting: getRaw(r, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN"),
      canvasContext2dReady: getRaw(r, "CANVAS_CONTEXT_2D_READY", "UNKNOWN"),
      canvasPixelSampleStatus: getRaw(r, "CANVAS_PIXEL_SAMPLE_STATUS", "NO_PIXEL_SAMPLE"),
      canvasPixelVisible: getRaw(r, "CANVAS_PIXEL_VISIBLE", "UNKNOWN"),

      stageUsedSizeClass: getRaw(r, "STAGE_USED_SIZE_CLASS", "UNKNOWN"),
      mountParentChainStatus: getRaw(r, "MOUNT_PARENT_CHAIN_STATUS", "UNKNOWN"),
      mountParentFirstCollapsedDescriptor:
        getRaw(r, "MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN"),
      mountParentFirstCollapsedMissingFact:
        getRaw(r, "MOUNT_PARENT_FIRST_COLLAPSED_MISSING_FACT", "UNKNOWN"),
      canonicalParentChainStatus: getRaw(r, "CANONICAL_PARENT_CHAIN_STATUS", "UNKNOWN"),
      canonicalParentFirstCollapsedDescriptor:
        getRaw(r, "CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN"),

      fallbackOrCartoonSignalObserved: getRaw(r, "FALLBACK_OR_CARTOON_SIGNAL_OBSERVED", "UNKNOWN"),
      canvasLayerCheckStatus: getRaw(r, "CANVAS_LAYER_CHECK_STATUS", "UNKNOWN"),
      canvasLayerPossibleBlocker: getRaw(r, "CANVAS_LAYER_POSSIBLE_BLOCKER", "UNKNOWN"),

      pixelBearingCanvasFound: getRaw(r, "PIXEL_BEARING_CANVAS_FOUND", "UNKNOWN"),
      pixelBearingCanvasCount: getRaw(r, "PIXEL_BEARING_CANVAS_COUNT", "UNKNOWN"),
      pixelBearingCanvasIsCanonical: getRaw(r, "PIXEL_BEARING_CANVAS_IS_CANONICAL", "UNKNOWN"),
      nonCanonicalPixelBearingCanvasCount:
        getRaw(r, "NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT", "UNKNOWN"),

      canvasIdentityDisambiguationStatus: getRaw(r, "CANVAS_IDENTITY_DISAMBIGUATION_STATUS", "UNKNOWN"),
      canvasSurfaceTruthLaneStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_LANE_STATUS", "UNKNOWN"),
      canvasTruthStatus: getRaw(r, "CANVAS_TRUTH_STATUS", "UNKNOWN"),
      canvasTruthFirstFailedCoordinate: getRaw(r, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN"),
      canvasTruthFailureClass: getRaw(r, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN"),
      canvasTruthFailureReason: getRaw(r, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN"),
      canvasTruthRecommendedOwner: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_OWNER", "UNKNOWN"),
      canvasTruthRecommendedFile: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN"),
      canvasTruthRecommendedAction: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN"),
      finalArbitrationSourceLane: getRaw(r, "FINAL_ARBITRATION_SOURCE_LANE", "UNKNOWN"),
      diagnosticCertainty: getRaw(r, "DIAGNOSTIC_CERTAINTY", "UNKNOWN"),
      observableCause: getRaw(r, "OBSERVABLE_CAUSE", "UNKNOWN"),

      runProbeCanvasSurfaceTruthApiAvailable: true,
      runCanvasSurfaceTruthApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getSettledReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "PREVIOUS_INTERNAL_RENEWAL_CONTRACT",
      "PREVIOUS_INTERNAL_RENEWAL_RECEIPT",
      "LINEAGE_V1_8_CONTRACT",
      "LINEAGE_V1_7_CONTRACT",
      "LINEAGE_V1_6_CONTRACT",
      "LINEAGE_V1_5_CONTRACT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "HTML_FILE",
      "INDEX_FILE",
      "ROUTE_CONDUCTOR_FILE",
      "CONTROL_FILE",
      "CANVAS_FILE",
      "HEX_AUTHORITY_FILE",
      "HEX_SURFACE_FILE",
      "POINTER_SURFACE_FILE",
      "POINTER_INSPECT_FILE",
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_SURFACE_TRUTH_AVAILABLE",
      "CANVAS_SURFACE_TRUTH_SCOPE",
      "CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS",

      "POINTER_SURFACE_BISHOP_MAPPING_ACTIVE",
      "POINTER_SURFACE_BISHOP_FILE",
      "POINTER_INSPECT_PRIEST_FILE",
      "POINTER_SURFACE_IS_MAIN_CHAIN_BISHOP_GATE",
      "POINTER_INSPECT_IS_PRIMARY_CHAIN_ENDPOINT",
      "POINTER_INSPECT_IS_CHILD_ORGANIZER",
      "POINTER_INSPECT_CAN_BLOCK_MAIN_LOOP",
      "CORRECTED_EXPRESSION_CHAIN",

      "TRANSITION_MEASUREMENT_MODE",
      "TRANSITION_SAMPLE_PHASE",
      "TRANSITION_SETTLED_SAMPLE_SCHEDULED",
      "TRANSITION_SETTLED_SAMPLE_AVAILABLE",
      "TRANSITION_COMPARISON_STATUS",
      "TRANSITION_COMPARISON_CLASS",
      "TRANSITION_COMPARISON_REASON",

      "TARGET_CONTEXT_STATUS",
      "TARGET_CONTEXT_SOURCE",
      "TARGET_ACCESS_ERROR",

      "BOUNDARY_FACT_MATRIX_ACTIVE",
      "BOUNDARY_ONE_ROW_PER_BOUNDARY",
      "BOUNDARY_ONE_MISSING_PROOF_ONE_MISSING_FACT",
      "BOUNDARY_NO_SINGLE_FILE_RECOMMENDATION_UNLESS_PROVEN",
      "BOUNDARY_TOTAL_ROW_COUNT",
      "BOUNDARY_LAYOUT_ROW_COUNT",
      "BOUNDARY_RUNTIME_ROW_COUNT",
      "BOUNDARY_ALL_BLOCKING_CLEAN",
      "BOUNDARY_LAYOUT_BLOCKING_CLEAN",
      "BOUNDARY_RUNTIME_BLOCKING_CLEAN",
      "BOUNDARY_FIRST_FAILED",
      "BOUNDARY_FIRST_FAILED_CLASS",
      "BOUNDARY_FIRST_MISSING_PROOF",
      "BOUNDARY_FIRST_MISSING_FACT",
      "BOUNDARY_FIRST_RECOMMENDED_OWNER",
      "BOUNDARY_FIRST_RECOMMENDED_FILE",
      "BOUNDARY_FIRST_RECOMMENDED_ACTION",
      "BOUNDARY_LAYOUT_FIRST_FAILED",
      "BOUNDARY_LAYOUT_FIRST_MISSING_FACT",
      "BOUNDARY_RUNTIME_FIRST_FAILED",
      "BOUNDARY_RUNTIME_FIRST_MISSING_FACT",
      "BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN",
      "BOUNDARY_SINGLE_CAUSAL_FILE",

      "POINTER_SURFACE_BISHOP_OBSERVED",
      "POINTER_SURFACE_BISHOP_SCRIPT_PRESENT",
      "POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT",
      "POINTER_SURFACE_BISHOP_AUTHORITY_PATH",
      "POINTER_SURFACE_BISHOP_CONTRACT",
      "POINTER_SURFACE_BISHOP_RECEIPT",
      "POINTER_SURFACE_BISHOP_RECOGNIZED",
      "POINTER_SURFACE_BISHOP_STATUS",
      "POINTER_SURFACE_BISHOP_MISSING_RUNTIME_FACT",

      "POINTER_INSPECT_PRIEST_OBSERVED",
      "POINTER_INSPECT_PRIEST_SCRIPT_PRESENT",
      "POINTER_INSPECT_PRIEST_AUTHORITY_PRESENT",
      "POINTER_INSPECT_PRIEST_AUTHORITY_PATH",
      "POINTER_INSPECT_PRIEST_CONTRACT",
      "POINTER_INSPECT_PRIEST_RECEIPT",
      "POINTER_INSPECT_PRIEST_RECOGNIZED",
      "POINTER_INSPECT_PRIEST_STATUS",

      "INDEX_SCRIPT_PRESENT",
      "INDEX_SCRIPT_SRC",
      "ROUTE_CONDUCTOR_SCRIPT_PRESENT",
      "ROUTE_CONDUCTOR_SCRIPT_SRC",
      "ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY",
      "CONTROL_SCRIPT_PRESENT",
      "CONTROL_SCRIPT_SRC",
      "CANVAS_SCRIPT_PRESENT",
      "CANVAS_SCRIPT_COUNT",
      "CANVAS_SCRIPT_SRC",
      "CANVAS_SCRIPT_CACHE_KEY",
      "HEX_AUTHORITY_SCRIPT_PRESENT",
      "HEX_SURFACE_SCRIPT_PRESENT",
      "POINTER_SURFACE_SCRIPT_PRESENT",
      "POINTER_SURFACE_SCRIPT_SRC",
      "POINTER_INSPECT_SCRIPT_PRESENT",
      "POINTER_INSPECT_SCRIPT_SRC",

      "CANVAS_AUTHORITY_OBSERVED",
      "CANVAS_AUTHORITY_SOURCE_PATH",
      "CANVAS_AUTHORITY_CONTRACT",
      "CANVAS_AUTHORITY_RECEIPT",
      "CANVAS_AUTHORITY_RECOGNIZED",

      "STAGE_PRESENT",
      "STAGE_SELECTOR",
      "STAGE_DESCRIPTOR",
      "STAGE_RECT_NONZERO",
      "STAGE_RECT_WIDTH",
      "STAGE_RECT_HEIGHT",
      "STAGE_COMPUTED_WIDTH",
      "STAGE_COMPUTED_HEIGHT",
      "STAGE_USED_SIZE_CLASS",
      "STAGE_USED_SIZE_FIRST_MISSING_FACT",

      "CANONICAL_MOUNT_SELECTOR",
      "CANONICAL_FRAME_SELECTOR",
      "CANONICAL_CANVAS_SELECTOR",
      "CANONICAL_CHAIN_SELECTOR",
      "CANONICAL_MOUNT_FOUND",
      "CANONICAL_MOUNT_DESCRIPTOR",
      "CANONICAL_MOUNT_RECT_NONZERO",
      "CANONICAL_MOUNT_RECT_WIDTH",
      "CANONICAL_MOUNT_RECT_HEIGHT",
      "CANONICAL_MOUNT_OFFSET_WIDTH",
      "CANONICAL_MOUNT_OFFSET_HEIGHT",
      "CANONICAL_MOUNT_CLIENT_WIDTH",
      "CANONICAL_MOUNT_CLIENT_HEIGHT",
      "CANONICAL_MOUNT_COMPUTED_DISPLAY",
      "CANONICAL_MOUNT_COMPUTED_POSITION",
      "CANONICAL_MOUNT_COMPUTED_WIDTH",
      "CANONICAL_MOUNT_COMPUTED_HEIGHT",
      "CANONICAL_MOUNT_COMPUTED_FLEX",
      "CANONICAL_MOUNT_COMPUTED_FLEX_BASIS",
      "CANONICAL_MOUNT_USED_SIZE_CLASS",
      "CANONICAL_MOUNT_USED_SIZE_FIRST_MISSING_FACT",
      "CANONICAL_MOUNT_USED_SIZE_REASON",

      "MOUNT_PARENT_CHAIN_STATUS",
      "MOUNT_PARENT_FIRST_COLLAPSED_DEPTH",
      "MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR",
      "MOUNT_PARENT_FIRST_COLLAPSED_WIDTH",
      "MOUNT_PARENT_FIRST_COLLAPSED_HEIGHT",
      "MOUNT_PARENT_FIRST_COLLAPSED_COMPUTED_WIDTH",
      "MOUNT_PARENT_FIRST_COLLAPSED_COMPUTED_HEIGHT",
      "MOUNT_PARENT_FIRST_COLLAPSED_CLASS",
      "MOUNT_PARENT_FIRST_COLLAPSED_MISSING_FACT",

      "CANONICAL_FRAME_FOUND",
      "CANONICAL_FRAME_DESCRIPTOR",
      "CANONICAL_FRAME_RECT_NONZERO",
      "CANONICAL_FRAME_RECT_WIDTH",
      "CANONICAL_FRAME_RECT_HEIGHT",
      "CANONICAL_FRAME_USED_SIZE_CLASS",
      "CANONICAL_FRAME_USED_SIZE_FIRST_MISSING_FACT",

      "CANONICAL_CANVAS_FOUND",
      "CANONICAL_CANVAS_SELECTOR",
      "CANONICAL_CANVAS_DESCRIPTOR",
      "CANONICAL_CANVAS_IN_CANONICAL_MOUNT",
      "CANONICAL_CANVAS_IN_CANONICAL_FRAME",

      "CANVAS_RECT_WIDTH",
      "CANVAS_RECT_HEIGHT",
      "CANVAS_RECT_NONZERO",
      "CANVAS_COMPUTED_WIDTH",
      "CANVAS_COMPUTED_HEIGHT",
      "CANVAS_USED_SIZE_CLASS",
      "CANVAS_USED_SIZE_FIRST_MISSING_FACT",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",

      "CANVAS_TRUTH_STATUS",
      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",
      "ZONE_OF_INFLICTION_OWNER",
      "ZONE_OF_INFLICTION_FILE",
      "ZONE_OF_INFLICTION_CLASS",
      "ZONE_OF_INFLICTION_REASON",
      "DIAGNOSTIC_CERTAINTY",
      "OBSERVABLE_CAUSE",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",

      "RUNTIME_DARK_FILE_COUNT",
      "FIRST_DARK_RUNTIME_OWNER",
      "FIRST_DARK_RUNTIME_FILE",
      "FIRST_DARK_RUNTIME_CLASS",
      "FIRST_DARK_RUNTIME_ACTION",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",

      "SECONDARY_EVIDENCE_NOTES",
      "CANVAS_SURFACE_TRUTH_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

    for (const field of priority.concat(Object.keys(report || {}))) {
      if (seen.has(field)) continue;
      seen.add(field);
      out.push(field);
    }

    return out;
  }

  function composePacketText(report = lastReport || makeAnchorReport()) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report = lastReport || makeAnchorReport()) {
    return [
      line("CONTRACT", getRaw(report, "CONTRACT", CONTRACT)),
      line("INTERNAL_RENEWAL_CONTRACT", getRaw(report, "INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT)),
      line("CANVAS_SURFACE_TRUTH_PROBE_STATUS", getRaw(report, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY")),
      line("POINTER_SURFACE_IS_MAIN_CHAIN_BISHOP_GATE", getRaw(report, "POINTER_SURFACE_IS_MAIN_CHAIN_BISHOP_GATE", true)),
      line("POINTER_INSPECT_IS_PRIMARY_CHAIN_ENDPOINT", getRaw(report, "POINTER_INSPECT_IS_PRIMARY_CHAIN_ENDPOINT", false)),
      line("POINTER_INSPECT_IS_CHILD_ORGANIZER", getRaw(report, "POINTER_INSPECT_IS_CHILD_ORGANIZER", true)),
      line("POINTER_SURFACE_BISHOP_STATUS", getRaw(report, "POINTER_SURFACE_BISHOP_STATUS", "UNKNOWN")),
      line("POINTER_SURFACE_BISHOP_OBSERVED", getRaw(report, "POINTER_SURFACE_BISHOP_OBSERVED", "UNKNOWN")),
      line("POINTER_SURFACE_BISHOP_RECOGNIZED", getRaw(report, "POINTER_SURFACE_BISHOP_RECOGNIZED", "UNKNOWN")),
      line("POINTER_INSPECT_PRIEST_STATUS", getRaw(report, "POINTER_INSPECT_PRIEST_STATUS", "UNKNOWN")),
      line("TRANSITION_COMPARISON_STATUS", getRaw(report, "TRANSITION_COMPARISON_STATUS", "UNKNOWN")),
      line("BOUNDARY_FACT_MATRIX_ACTIVE", getRaw(report, "BOUNDARY_FACT_MATRIX_ACTIVE", true)),
      line("BOUNDARY_FIRST_FAILED", getRaw(report, "BOUNDARY_FIRST_FAILED", "UNKNOWN")),
      line("BOUNDARY_FIRST_MISSING_PROOF", getRaw(report, "BOUNDARY_FIRST_MISSING_PROOF", "UNKNOWN")),
      line("BOUNDARY_FIRST_MISSING_FACT", getRaw(report, "BOUNDARY_FIRST_MISSING_FACT", "UNKNOWN")),
      line("BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN", getRaw(report, "BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN", false)),
      line("BOUNDARY_SINGLE_CAUSAL_FILE", getRaw(report, "BOUNDARY_SINGLE_CAUSAL_FILE", "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN")),
      line("CANONICAL_MOUNT_FOUND", getRaw(report, "CANONICAL_MOUNT_FOUND", "UNKNOWN")),
      line("CANONICAL_MOUNT_RECT_NONZERO", getRaw(report, "CANONICAL_MOUNT_RECT_NONZERO", "UNKNOWN")),
      line("CANONICAL_MOUNT_USED_SIZE_CLASS", getRaw(report, "CANONICAL_MOUNT_USED_SIZE_CLASS", "UNKNOWN")),
      line("CANONICAL_MOUNT_USED_SIZE_FIRST_MISSING_FACT", getRaw(report, "CANONICAL_MOUNT_USED_SIZE_FIRST_MISSING_FACT", "UNKNOWN")),
      line("MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR", getRaw(report, "MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN")),
      line("MOUNT_PARENT_FIRST_COLLAPSED_MISSING_FACT", getRaw(report, "MOUNT_PARENT_FIRST_COLLAPSED_MISSING_FACT", "UNKNOWN")),
      line("CANONICAL_FRAME_FOUND", getRaw(report, "CANONICAL_FRAME_FOUND", "UNKNOWN")),
      line("CANONICAL_FRAME_RECT_NONZERO", getRaw(report, "CANONICAL_FRAME_RECT_NONZERO", "UNKNOWN")),
      line("CANONICAL_CANVAS_FOUND", getRaw(report, "CANONICAL_CANVAS_FOUND", "UNKNOWN")),
      line("CANVAS_IN_MOUNT", getRaw(report, "CANVAS_IN_MOUNT", "UNKNOWN")),
      line("CANVAS_IN_FRAME", getRaw(report, "CANVAS_IN_FRAME", "UNKNOWN")),
      line("CANVAS_RECT_NONZERO", getRaw(report, "CANVAS_RECT_NONZERO", "UNKNOWN")),
      line("CANVAS_COMPUTED_VISIBLE", getRaw(report, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN")),
      line("CANVAS_VIEWPORT_INTERSECTING", getRaw(report, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN")),
      line("CANVAS_CONTEXT_2D_READY", getRaw(report, "CANVAS_CONTEXT_2D_READY", "UNKNOWN")),
      line("CANVAS_PIXEL_VISIBLE", getRaw(report, "CANVAS_PIXEL_VISIBLE", "UNKNOWN")),
      line("CANVAS_TRUTH_FIRST_FAILED_COORDINATE", getRaw(report, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getRaw(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_REASON", getRaw(report, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_OWNER", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_OWNER", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_FILE", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_ACTION", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN")),
      line("DIAGNOSTIC_CERTAINTY", getRaw(report, "DIAGNOSTIC_CERTAINTY", "UNKNOWN")),
      "f13Claimed=false",
      "f21EligibleForNorth=false",
      "f21ClaimedByDiagnosticRail=false",
      "readyTextAllowed=false",
      "visualPassClaimed=false",
      "generatedImage=false",
      "graphicBox=false",
      "webGL=false"
    ].join("\n");
  }

  function getReport() {
    return clonePlain(lastReport || makeAnchorReport());
  }

  function getSettledReport() {
    return clonePlain(lastSettledReport || {});
  }

  function getReceiptLight() {
    if (!lastReceipt) lastReceipt = buildReceipt(lastReport || makeAnchorReport());
    return clonePlain(lastReceipt);
  }

  function getReceipt() {
    const report = lastReport || makeAnchorReport();

    return {
      ...getReceiptLight(),
      report: clonePlain(report),
      settledReport: clonePlain(lastSettledReport || {}),
      boundaryFactRows: clonePlain(getRaw(report, "BOUNDARY_FACT_ROWS", [])),
      layoutBoundaryFactRows: clonePlain(getRaw(report, "LAYOUT_BOUNDARY_FACT_ROWS", [])),
      runtimeBoundaryFactRows: clonePlain(getRaw(report, "RUNTIME_BOUNDARY_FACT_ROWS", [])),
      runtimeNodes: clonePlain(getRaw(report, "RUNTIME_NODES", {})),
      runtimeDarkFiles: clonePlain(getRaw(report, "RUNTIME_DARK_FILES", [])),
      canonicalCanvasSummary: clonePlain(getRaw(report, "CANONICAL_CANVAS_SUMMARY", {})),
      stageUsedSizeSummary: clonePlain(getRaw(report, "STAGE_USED_SIZE_SUMMARY", {})),
      mountUsedSizeSummary: clonePlain(getRaw(report, "MOUNT_USED_SIZE_SUMMARY", {})),
      frameUsedSizeSummary: clonePlain(getRaw(report, "FRAME_USED_SIZE_SUMMARY", {})),
      firstPixelBearingCanvasSummary: clonePlain(getRaw(report, "FIRST_PIXEL_BEARING_CANVAS_SUMMARY", {})),
      pixelBearingCanvasSummaries: clonePlain(getRaw(report, "PIXEL_BEARING_CANVAS_SUMMARIES", [])),
      allCanvasSummaries: clonePlain(getRaw(report, "ALL_CANVAS_SUMMARIES", [])),
      canonicalParentChain: clonePlain(getRaw(report, "CANONICAL_PARENT_CHAIN", [])),
      mountParentChain: clonePlain(getRaw(report, "MOUNT_PARENT_CHAIN", [])),
      canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS.slice(),
      canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES.slice(),
      routeAuthorityAliases: ROUTE_AUTHORITY_ALIASES.slice(),
      controlAuthorityAliases: CONTROL_AUTHORITY_ALIASES.slice(),
      hexAuthorityAliases: HEX_AUTHORITY_ALIASES.slice(),
      hexSurfaceAliases: HEX_SURFACE_ALIASES.slice(),
      pointerSurfaceAliases: POINTER_SURFACE_ALIASES.slice(),
      pointerInspectAliases: POINTER_INSPECT_ALIASES.slice(),
      supportsCallGuardedReturnPacket: true,
      supportsParentChainUsedSizeFacts: true,
      supportsBoundaryFactMatrix: true,
      supportsOneBoundaryOneRow: true,
      supportsOneMissingProofOneMissingFact: true,
      supportsNoSingleFileRecommendationUnlessProven: true,
      supportsLayoutMathArbitration: true,
      supportsConnectionArbitration: true,
      supportsBlindSpotArbitration: true,
      supportsCanonicalVisibleSurfaceDisambiguation: true,
      supportsTransitionSurfaceDisambiguation: true,
      supportsPixelBearingCanvasIdentityCheck: true,
      supportsCanonicalZeroRectCheck: true,
      supportsParentChainCollapseCheck: true,
      supportsCanonicalBlankPixelCheck: true,
      supportsLayerBlockerCheck: true,
      supportsFallbackCartoonSignalCheck: true,
      supportsSimplifiedF21Focus: true,
      supportsPointerSurfaceBishopMapping: true,
      supportsPointerInspectPriestDemotion: true,
      supportsRuntimeDarkFileInventory: true,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getPacketText() {
    if (!lastPacketText) lastPacketText = composePacketText(lastReport || makeAnchorReport());
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) {
      lastCompactSummary = composeCompactSummary(lastReport || makeAnchorReport());
    }

    return lastCompactSummary;
  }

  function getStatusText() {
    return getCompactSummary();
  }

  function publish() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    const aliasPaths = [
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.diagnosticCanvasSurfaceTruthProbe",
      "HEARTH.diagnosticProbeCanvasTruth",
      "HEARTH.diagnosticCanvasTruthProbe",
      "HEARTH.diagnosticRailProbeCanvasSurfaceTruth",
      "HEARTH.diagnosticCanvasSurfaceTruthReceiptHub",
      "HEARTH.diagnosticTruthHub",
      "HEARTH.diagnosticCanonicalCanvasSurfaceTruth",
      "HEARTH.diagnosticCanvasLayoutMathConnectionBlindspot",
      "HEARTH.diagnosticCanvasParentChainUsedSizeBoundaryFactMatrix",
      "HEARTH.diagnosticCanvasPointerSurfaceBishopBoundaryFactMatrix",
      "HEARTH.diagnosticPointerSurfaceBishopCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
      "DEXTER_LAB.hearthDiagnosticCanvasTruthProbe",
      "DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanonicalCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasLayoutMathConnectionBlindspot",
      "DEXTER_LAB.hearthDiagnosticCanvasParentChainUsedSizeBoundaryFactMatrix",
      "DEXTER_LAB.hearthDiagnosticCanvasPointerSurfaceBishopBoundaryFactMatrix",
      "DEXTER_LAB.hearthDiagnosticPointerSurfaceBishopCanvasSurfaceTruth",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT",
      "HEARTH_DIAGNOSTIC_CANVAS_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX",
      "HEARTH_DIAGNOSTIC_CANVAS_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX",
      "HEARTH_DIAGNOSTIC_POINTER_SURFACE_BISHOP_CANVAS_SURFACE_TRUTH"
    ];

    for (const path of aliasPaths) setPath(path, api);

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_RECEIPT =
      getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_RECEIPT =
      getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_REPORT =
      clonePlain(lastReport || makeAnchorReport());

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_COMPACT_SUMMARY =
      lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_PACKET_TEXT =
      lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_COMPACT_SUMMARY =
      lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_PACKET_TEXT =
      lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_COMPACT_SUMMARY =
      lastCompactSummary || "";

    if (lastSettledReport) {
      root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
        clonePlain(lastSettledReport);
      root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
        clonePlain(lastSettledReport);
      root.HEARTH_DIAGNOSTIC_CANVAS_PARENT_CHAIN_USED_SIZE_BOUNDARY_FACT_MATRIX_SETTLED_REPORT =
        clonePlain(lastSettledReport);
      root.HEARTH_DIAGNOSTIC_CANVAS_POINTER_SURFACE_BISHOP_BOUNDARY_FACT_MATRIX_SETTLED_REPORT =
        clonePlain(lastSettledReport);
    }

    return true;
  }

  function runProbeCanvasSurfaceTruth(payload = {}) {
    return inspectSurface(payload);
  }

  function runCanvasSurfaceTruth(payload = {}) {
    return inspectSurface(payload);
  }

  function runProbe(payload = {}) {
    return inspectSurface(payload);
  }

  function inspect(payload = {}) {
    return inspectSurface(payload);
  }

  function runDiagnostic(payload = {}) {
    return inspectSurface(payload);
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
    previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
    lineageV18Contract: LINEAGE_V1_8_CONTRACT,
    lineageV17Contract: LINEAGE_V1_7_CONTRACT,
    lineageV16Contract: LINEAGE_V1_6_CONTRACT,
    lineageV15Contract: LINEAGE_V1_5_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    htmlFile: HTML_FILE,
    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    pointerSurfaceFile: POINTER_SURFACE_FILE,
    pointerInspectFile: POINTER_INSPECT_FILE,
    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedControlRenewalCandidate: EXPECTED_CONTROL_RENEWAL_CANDIDATE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedHexSurfaceRenewalCandidate: EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE,
    expectedPointerSurfaceContract: EXPECTED_POINTER_SURFACE_CONTRACT,
    expectedPointerSurfaceRenewalCandidate: EXPECTED_POINTER_SURFACE_RENEWAL_CANDIDATE,
    expectedPointerInspectContract: EXPECTED_POINTER_INSPECT_CONTRACT,

    diagnosticOnly: true,
    anchorSafeChronologyObservation: true,
    callGuardActive: true,
    parentChainUsedSizeFactMatrixActive: true,
    boundaryDiagnosisMatrixActive: true,
    pointerSurfaceBishopBoundaryFactMatrixActive: true,
    pointerSurfaceBishopMappingActive: true,
    pointerSurfaceIsMainChainBishopGate: true,
    pointerInspectIsPrimaryChainEndpoint: false,
    pointerInspectIsChildOrganizer: true,
    pointerInspectCanBlockMainLoop: false,
    oneBoundaryOneRowActive: true,
    oneMissingProofOneMissingFactActive: true,
    noSingleFileRecommendationUnlessProven: true,
    layoutMathArbitrationActive: true,
    connectionArbitrationActive: true,
    blindSpotArbitrationActive: true,
    canonicalVisibleSurfaceDisambiguationActive: true,
    transitionSurfaceDisambiguationActive: true,
    focusedOnCanonicalCanvasIdentity: true,
    controlsDutyLaneEvaluated: false,
    delegatoryMatrixEvaluated: true,
    southFingerBundleEvaluated: false,
    labCardinalReceiptsEvaluated: false,

    runProbeCanvasSurfaceTruth,
    runCanvasSurfaceTruth,
    runProbe,
    inspect,
    runDiagnostic,

    getReport,
    getSettledReport,
    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getPacketText,
    getCompactSummary,
    getStatusText,

    canonicalMountSelector: CANONICAL_MOUNT_SELECTOR,
    canonicalFrameSelector: CANONICAL_FRAME_SELECTOR,
    canonicalCanvasSelector: CANONICAL_CANVAS_SELECTOR,
    canonicalChainSelector: CANONICAL_CHAIN_SELECTOR,
    canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS,
    stageSelectors: STAGE_SELECTORS,
    canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES,
    routeAuthorityAliases: ROUTE_AUTHORITY_ALIASES,
    controlAuthorityAliases: CONTROL_AUTHORITY_ALIASES,
    hexAuthorityAliases: HEX_AUTHORITY_ALIASES,
    hexSurfaceAliases: HEX_SURFACE_ALIASES,
    pointerSurfaceAliases: POINTER_SURFACE_ALIASES,
    pointerInspectAliases: POINTER_INSPECT_ALIASES,

    supportsCallGuardedReturnPacket: true,
    supportsParentChainUsedSizeFacts: true,
    supportsBoundaryFactMatrix: true,
    supportsOneBoundaryOneRow: true,
    supportsOneMissingProofOneMissingFact: true,
    supportsNoSingleFileRecommendationUnlessProven: true,
    supportsLayoutMathArbitration: true,
    supportsConnectionArbitration: true,
    supportsBlindSpotArbitration: true,
    supportsCanonicalVisibleSurfaceDisambiguation: true,
    supportsTransitionSurfaceDisambiguation: true,
    supportsPixelBearingCanvasIdentityCheck: true,
    supportsCanonicalZeroRectCheck: true,
    supportsParentChainCollapseCheck: true,
    supportsCanonicalBlankPixelCheck: true,
    supportsLayerBlockerCheck: true,
    supportsFallbackCartoonSignalCheck: true,
    supportsSimplifiedF21Focus: true,
    supportsCoordinateSpecificFailure: true,
    supportsCompactPacketText: true,
    supportsPointerSurfaceBishopMapping: true,
    supportsPointerInspectPriestDemotion: true,
    supportsRuntimeDarkFileInventory: true,

    ownsDiagnosticProbeOnly: true,
    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasRepair: false,
    ownsRouteRepair: false,
    ownsControlMutation: false,
    ownsRuntimeRestart: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsPointerSurfaceTruth: false,
    ownsPointerInspectTruth: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsVisualPass: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get evidence() {
      return getReport();
    },

    get state() {
      return getReport();
    }
  });

  lastReport = makeAnchorReport();
  lastReceipt = buildReceipt(lastReport);
  lastPacketText = composePacketText(lastReport);
  lastCompactSummary = composeCompactSummary(lastReport);

  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
