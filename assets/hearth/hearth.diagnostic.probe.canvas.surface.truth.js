// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_TNT_v1_8
// Full-file replacement.
// Diagnostic-only Canvas surface truth probe.
//
// Purpose:
// - Preserve the public NORTH-facing Canvas surface truth probe contract.
// - Preserve v1_7 canonical DOM / layout / pixel truth arbitration.
// - Add v1_8 Boundary Diagnosis Matrix.
// - Stop reducing missing runtime proof to one recommended file unless single-file causality is proven.
// - Diagnose the boundary where proof disappears:
//   1. Route Conductor -> Canvas
//   2. Canvas -> Hex Surface
//   3. Hex Surface -> Pointer Surface Bishop
//   4. Pointer Surface Bishop -> Canvas return
//   5. Controls -> Canvas
// - Return boundary-related facts around missing runtime proof without inventing missing facts.
// - Keep F21 as diagnostic evidence only; do not claim F21 authority.
// - Do not create, draw, repair, release, restart, invoke lifecycle methods,
//   dispatch input, or mutate production state.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  const CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_TNT_v1_8";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_RECEIPT_v1_8";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_TNT_v1_7";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_RECEIPT_v1_7";

  const LINEAGE_V1_6_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARDED_TRANSITION_SURFACE_DISAMBIGUATION_TNT_v1_6";
  const LINEAGE_V1_5_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_TNT_v1_5";

  const VERSION =
    "2026-06-08.hearth-diagnostic-probe-canvas-surface-truth-boundary-diagnosis-matrix-v1-8";

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
  const POINTER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_CANVAS_RENEWAL_CANDIDATE =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_RENEWAL_CANDIDATE =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";
  const EXPECTED_POINTER_SURFACE_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const EXPECTED_POINTER_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const CANONICAL_MOUNT_SELECTOR = "#hearthCanvasMount";
  const CANONICAL_FRAME_SELECTOR = "#hearthCanvasRectLockFrame";
  const CANONICAL_CANVAS_ID = "hearthVisibleCanvas";

  const CANONICAL_CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas",
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
    ".hearth-globe-stage",
    ".hearth-stage",
    ".hearth-canvas-stage"
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
    pointerInspect: POINTER_INSPECT_FILE,
    pointerBoundary: POINTER_BOUNDARY_FILE,
    pointerLight: POINTER_LIGHT_FILE
  });

  const ROUTE_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION",
    "HEARTH.routeConductor",
    "HEARTH.routeAuthority",
    "DEXTER_LAB.hearthRouteConductor"
  ]);

  const CANVAS_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
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
    "HEARTH.canvasHubHexSurfacePointerFingerTransmission",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexRenderReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexRenderReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubHexSurfacePointerFingerTransmission",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexRenderReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const CONTROL_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controlsHexGatePointerFingerTransmission",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthControlAuthority",
    "DEXTER_LAB.hearthControlsQueen"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
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

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "HEARTH.hexAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthHexAuthority"
  ]);

  const POINTER_SURFACE_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthPointerFingerSurface"
  ]);

  const POINTER_INSPECT_ALIASES = Object.freeze([
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

  const SAFE_RECEIPT_METHODS = Object.freeze([
    "getReceiptLight",
    "getReceipt",
    "getStatus",
    "getReport",
    "getState",
    "getSummary",
    "getCanvasStationReceipt",
    "getCanvasStationSummary",
    "getVisiblePlanetReceipt",
    "getHexSurfaceReceipt",
    "getHexReceipt",
    "getControlReceipt",
    "getControlSummary",
    "getReceiptText",
    "getStatusText"
  ]);

  const FALLBACK_PATTERNS = Object.freeze([
    /fallback/i,
    /cartoon/i,
    /placeholder/i,
    /static/i,
    /demo/i,
    /sample/i,
    /temporary/i
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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
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
        return bounded(JSON.stringify(value), 40000) || fallback;
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

  function firstRawKnown(...values) {
    for (const value of values) {
      if (value === undefined || value === null || value === "") continue;
      const text = safeString(value);
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return value;
    }
    return undefined;
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

    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
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

  function pathMatches(win, route) {
    try {
      const path = win && win.location ? win.location.pathname : "";
      const normal = safeString(route).replace(/\/$/, "");
      return path === route || path === normal;
    } catch (_error) {
      return false;
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

      try {
        const output = method === "getReceiptLight" ? authority[method](false) : authority[method]();
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
      value.INTERNAL_IMPLEMENTATION_CONTRACT,
      value.internalImplementationContract,
      value.RENEWAL_CONTRACT,
      value.renewalContract,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.routeConductorContract,
      value.controlContract,
      value.controlsContract,
      value.hexSurfaceContract,
      value.hexAuthorityContract,
      value.pointerSurfaceContract,
      value.pointerFingerContract,
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
      value.INTERNAL_IMPLEMENTATION_RECEIPT,
      value.internalImplementationReceipt,
      value.RENEWAL_RECEIPT,
      value.renewalReceipt,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.routeConductorReceipt,
      value.controlReceipt,
      value.controlsReceipt,
      value.hexSurfaceReceipt,
      value.hexAuthorityReceipt,
      value.pointerSurfaceReceipt,
      value.pointerFingerReceipt,
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

  function inspectAuthority(targetWindow, aliases) {
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
          authority,
          receiptObject: receipt,
          contract,
          receipt: receiptName,
          methodCount: methods.length,
          methods
        });
      }
    }

    const selected =
      candidates.find((candidate) => candidate.scope === "TARGET_WINDOW" && candidate.contract !== "UNKNOWN") ||
      candidates.find((candidate) => candidate.scope === "TARGET_WINDOW") ||
      candidates.find((candidate) => candidate.contract !== "UNKNOWN") ||
      candidates[0] ||
      null;

    return {
      observed: Boolean(selected),
      scope: selected ? selected.scope : "NONE",
      path: selected ? selected.path : "NONE",
      authority: selected ? selected.authority : null,
      receiptObject: selected ? selected.receiptObject : {},
      contract: selected ? selected.contract : "UNKNOWN",
      receipt: selected ? selected.receipt : "UNKNOWN",
      methodCount: selected ? selected.methodCount : 0,
      methods: selected ? selected.methods : [],
      candidates: candidates.map((candidate) => ({
        scope: candidate.scope,
        path: candidate.path,
        contract: candidate.contract,
        receipt: candidate.receipt,
        methodCount: candidate.methodCount
      }))
    };
  }

  function hasMethod(authoritySummary, namesOrRegex) {
    const methods = Array.isArray(authoritySummary && authoritySummary.methods)
      ? authoritySummary.methods
      : [];

    for (const candidate of namesOrRegex || []) {
      if (candidate instanceof RegExp) {
        if (methods.some((method) => candidate.test(method))) return true;
      } else if (methods.includes(candidate)) {
        return true;
      }
    }

    return false;
  }

  function receiptValue(authoritySummary, keys, fallback = undefined) {
    const receipt = authoritySummary && isObject(authoritySummary.receiptObject)
      ? authoritySummary.receiptObject
      : {};
    const authority = authoritySummary && authoritySummary.authority
      ? authoritySummary.authority
      : {};

    for (const key of keys || []) {
      const value = firstRawKnown(getRaw(receipt, key), getRaw(authority, key));
      if (value !== undefined) return value;
    }

    return fallback;
  }

  function numericReceiptValue(authoritySummary, keys) {
    const value = receiptValue(authoritySummary, keys, undefined);
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function booleanReceiptSignal(authoritySummary, keys) {
    const value = receiptValue(authoritySummary, keys, undefined);
    if (value === undefined) return "UNKNOWN";
    return safeBool(value, false) ? true : false;
  }

  function textReceiptSignal(authoritySummary, keys) {
    const value = receiptValue(authoritySummary, keys, undefined);
    return value === undefined ? "UNKNOWN" : safeString(value, "UNKNOWN");
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
    if (!targetWindow || !element || !isFunction(targetWindow.getComputedStyle)) {
      return {
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
        alignItems: "UNKNOWN",
        justifyContent: "UNKNOWN",
        boxSizing: "UNKNOWN"
      };
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
        alignItems: safeString(style.alignItems, "UNKNOWN"),
        justifyContent: safeString(style.justifyContent, "UNKNOWN"),
        boxSizing: safeString(style.boxSizing, "UNKNOWN")
      };
    } catch (_error) {
      return {
        readable: false,
        visible: false,
        display: "UNREADABLE",
        visibility: "UNREADABLE",
        opacity: "UNREADABLE",
        position: "UNREADABLE",
        zIndex: "UNREADABLE",
        pointerEvents: "UNREADABLE",
        transform: "UNREADABLE",
        overflow: "UNREADABLE",
        overflowX: "UNREADABLE",
        overflowY: "UNREADABLE",
        contain: "UNREADABLE",
        contentVisibility: "UNREADABLE",
        width: "UNREADABLE",
        height: "UNREADABLE",
        minWidth: "UNREADABLE",
        minHeight: "UNREADABLE",
        maxWidth: "UNREADABLE",
        maxHeight: "UNREADABLE",
        flex: "UNREADABLE",
        flexBasis: "UNREADABLE",
        alignItems: "UNREADABLE",
        justifyContent: "UNREADABLE",
        boxSizing: "UNREADABLE"
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
          ? `.${Array.from(element.classList).slice(0, 5).join(".")}`
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
        selectionMode: "UNKNOWN"
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
      selectionMode: firstKnown(canvas.dataset.hearthCanvasSelectionMode)
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

  function fallbackSignals(targetDocument, element) {
    const text = bounded(
      [
        element && element.getAttribute ? element.getAttribute("aria-label") : "",
        element && element.getAttribute ? element.getAttribute("title") : "",
        element && element.getAttribute ? element.getAttribute("data-label") : "",
        element && element.dataset ? JSON.stringify(element.dataset) : "",
        targetDocument && targetDocument.body ? targetDocument.body.innerText : ""
      ].join(" "),
      12000
    );

    const matched = FALLBACK_PATTERNS.some((pattern) => pattern.test(text));

    return {
      fallbackTextObserved: matched,
      fallbackTextBasis: matched
        ? "FALLBACK_OR_CARTOON_TEXT_PATTERN_OBSERVED"
        : "NO_FALLBACK_TEXT_PATTERN_OBSERVED"
    };
  }

  function parentChain(targetWindow, element, stopAt) {
    const chain = [];
    let cursor = element || null;
    let depth = 0;

    while (cursor && depth < 16) {
      const rect = getRect(cursor);
      const css = cssSummary(targetWindow, cursor);
      const parent = cursor.parentElement || null;

      chain.push({
        depth,
        descriptor: elementDescriptor(cursor),
        id: cursor.id || "NONE",
        rectNonzero: rectNonzero(rect),
        rectWidth: rect.width,
        rectHeight: rect.height,
        rectLeft: rect.left,
        rectTop: rect.top,
        computedVisible: css.visible,
        display: css.display,
        visibility: css.visibility,
        opacity: css.opacity,
        position: css.position,
        zIndex: css.zIndex,
        overflow: css.overflow,
        contain: css.contain,
        contentVisibility: css.contentVisibility,
        width: css.width,
        height: css.height,
        minWidth: css.minWidth,
        minHeight: css.minHeight,
        flex: css.flex,
        flexBasis: css.flexBasis,
        parentDescriptor: elementDescriptor(parent)
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
        firstCollapsedDepth: -1,
        firstCollapsedDescriptor: "NONE",
        firstHiddenDepth: -1,
        firstHiddenDescriptor: "NONE",
        firstContainmentRiskDepth: -1,
        firstContainmentRiskDescriptor: "NONE"
      };
    }

    const collapsed = chain.find((item) => item.rectNonzero === false);
    const hidden = chain.find((item) => item.computedVisible === false);
    const containmentRisk = chain.find((item) =>
      /paint|layout|strict|content/i.test(item.contain) ||
      /hidden|auto/i.test(item.contentVisibility)
    );

    return {
      status:
        collapsed || hidden || containmentRisk
          ? "PARENT_CHAIN_HAS_LAYOUT_RISK"
          : "PARENT_CHAIN_LAYOUT_READABLE",
      firstCollapsedDepth: collapsed ? collapsed.depth : -1,
      firstCollapsedDescriptor: collapsed ? collapsed.descriptor : "NONE",
      firstCollapsedWidth: collapsed ? collapsed.rectWidth : 0,
      firstCollapsedHeight: collapsed ? collapsed.rectHeight : 0,
      firstHiddenDepth: hidden ? hidden.depth : -1,
      firstHiddenDescriptor: hidden ? hidden.descriptor : "NONE",
      firstContainmentRiskDepth: containmentRisk ? containmentRisk.depth : -1,
      firstContainmentRiskDescriptor: containmentRisk ? containmentRisk.descriptor : "NONE",
      firstContainmentRiskContain: containmentRisk ? containmentRisk.contain : "NONE",
      firstContainmentRiskContentVisibility: containmentRisk ? containmentRisk.contentVisibility : "NONE"
    };
  }

  function describeCanvas(targetWindow, targetDocument, canvas, index, selector, canonicalMount, canonicalFrame) {
    const rect = getRect(canvas);
    const css = cssSummary(targetWindow, canvas);
    const ctx = getCanvas2d(canvas);
    const pixels = samplePixels(canvas, ctx.ctx);
    const dataset = canvasDataset(canvas);
    const fallback = fallbackSignals(targetDocument, canvas);

    const internalSizeNonzero = Boolean(
      canvas && safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0
    );

    const rectOk = rectNonzero(rect);
    const viewportOk = viewportIntersecting(targetWindow, rect);
    const inMount = Boolean(canonicalMount && canvas && containsOrEquals(canonicalMount, canvas));
    const inFrame = Boolean(canonicalFrame && canvas && containsOrEquals(canonicalFrame, canvas));

    const bufferCssWidthRatio =
      rect.width > 0 ? safeNumber(canvas && canvas.width, 0) / rect.width : 0;
    const bufferCssHeightRatio =
      rect.height > 0 ? safeNumber(canvas && canvas.height, 0) / rect.height : 0;

    return {
      index,
      selector: selector || "canvas",
      descriptor: elementDescriptor(canvas, index),
      id: canvas && canvas.id ? canvas.id : "NONE",
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
      inCanonicalMount: inMount,
      inCanonicalFrame: inFrame,
      directParentDescriptor: elementDescriptor(canvas && canvas.parentElement),
      widthAttribute: canvas ? safeNumber(canvas.width, 0) : 0,
      heightAttribute: canvas ? safeNumber(canvas.height, 0) : 0,
      internalSizeNonzero,
      rectLeft: rect.left,
      rectTop: rect.top,
      rectRight: rect.right,
      rectBottom: rect.bottom,
      rectWidth: rect.width,
      rectHeight: rect.height,
      rectNonzero: rectOk,
      bufferCssWidthRatio,
      bufferCssHeightRatio,
      computedVisible: css.visible,
      computedDisplay: css.display,
      computedVisibility: css.visibility,
      computedOpacity: css.opacity,
      computedPosition: css.position,
      computedZIndex: css.zIndex,
      computedPointerEvents: css.pointerEvents,
      computedTransform: css.transform,
      computedOverflow: css.overflow,
      computedContain: css.contain,
      computedContentVisibility: css.contentVisibility,
      computedWidth: css.width,
      computedHeight: css.height,
      computedMinWidth: css.minWidth,
      computedMinHeight: css.minHeight,
      computedFlex: css.flex,
      computedFlexBasis: css.flexBasis,
      computedBoxSizing: css.boxSizing,
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
        rectOk &&
        css.visible &&
        viewportOk &&
        ctx.ready
      ),
      surfaceVisibleAdmissible: Boolean(
        internalSizeNonzero &&
        rectOk &&
        css.visible &&
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

  function captureSurfaceSnapshot(payload = {}, phase = "IMMEDIATE_SYNC") {
    const context = getTargetContext(payload);
    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    const scripts = inspectScripts(targetDocument);

    const authorities = {
      route: inspectAuthority(targetWindow, ROUTE_AUTHORITY_ALIASES),
      canvas: inspectAuthority(targetWindow, CANVAS_AUTHORITY_ALIASES),
      controls: inspectAuthority(targetWindow, CONTROL_AUTHORITY_ALIASES),
      hexSurface: inspectAuthority(targetWindow, HEX_SURFACE_ALIASES),
      hexAuthority: inspectAuthority(targetWindow, HEX_AUTHORITY_ALIASES),
      pointerSurface: inspectAuthority(targetWindow, POINTER_SURFACE_ALIASES),
      pointerInspect: inspectAuthority(targetWindow, POINTER_INSPECT_ALIASES)
    };

    const stageFound = findStage(targetDocument);
    const stageElement = stageFound.element;
    const stageRect = getRect(stageElement);
    const stageCss = cssSummary(targetWindow, stageElement);

    const canonicalMount = q(targetDocument, CANONICAL_MOUNT_SELECTOR);
    const canonicalFrame = q(targetDocument, CANONICAL_FRAME_SELECTOR);
    const canonicalFound = findCanonicalCanvas(targetDocument);
    const canonicalCanvas = canonicalFound.element;

    const mountRect = getRect(canonicalMount);
    const mountCss = cssSummary(targetWindow, canonicalMount);
    const frameRect = getRect(canonicalFrame);
    const frameCss = cssSummary(targetWindow, canonicalFrame);

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

    return {
      phase,
      capturedAt: nowIso(),

      context,
      targetWindow,
      targetDocument,
      scripts,
      authorities,

      stageFound: Boolean(stageElement),
      stageSelector: stageFound.selector,
      stageDescriptor: elementDescriptor(stageElement),
      stageRectNonzero: rectNonzero(stageRect),
      stageRectWidth: stageRect.width,
      stageRectHeight: stageRect.height,
      stageComputedVisible: stageCss.visible,
      stageComputedDisplay: stageCss.display,
      stageComputedPosition: stageCss.position,
      stageComputedOverflow: stageCss.overflow,

      canonicalMount,
      canonicalMountFound: Boolean(canonicalMount),
      canonicalMountDescriptor: elementDescriptor(canonicalMount),
      canonicalMountRectNonzero: rectNonzero(mountRect),
      canonicalMountRectWidth: mountRect.width,
      canonicalMountRectHeight: mountRect.height,
      canonicalMountComputedVisible: mountCss.visible,
      canonicalMountComputedDisplay: mountCss.display,
      canonicalMountComputedPosition: mountCss.position,
      canonicalMountComputedOverflow: mountCss.overflow,
      canonicalMountComputedContain: mountCss.contain,
      canonicalMountComputedContentVisibility: mountCss.contentVisibility,
      canonicalMountComputedWidth: mountCss.width,
      canonicalMountComputedHeight: mountCss.height,

      canonicalFrame,
      canonicalFrameFound: Boolean(canonicalFrame),
      canonicalFrameDescriptor: elementDescriptor(canonicalFrame),
      canonicalFrameRectNonzero: rectNonzero(frameRect),
      canonicalFrameRectWidth: frameRect.width,
      canonicalFrameRectHeight: frameRect.height,
      canonicalFrameComputedVisible: frameCss.visible,
      canonicalFrameComputedDisplay: frameCss.display,
      canonicalFrameComputedPosition: frameCss.position,
      canonicalFrameComputedOverflow: frameCss.overflow,
      canonicalFrameComputedContain: frameCss.contain,
      canonicalFrameComputedContentVisibility: frameCss.contentVisibility,
      canonicalFrameComputedWidth: frameCss.width,
      canonicalFrameComputedHeight: frameCss.height,

      canonicalCanvas,
      canonicalFound,
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
  }

  function resolveSurfaceVerdict(snapshot) {
    const canonicalSummary = snapshot.canonicalSummary || {};
    const chain = snapshot.canonicalParentChainClassification || {};
    const mountChain = snapshot.mountParentChainClassification || {};

    if (!snapshot.context.targetAvailable) {
      return {
        status: "TARGET_CONTEXT_UNAVAILABLE",
        clean: false,
        coordinate: "TARGET_CONTEXT_STATUS",
        failureClass: "TARGET_CONTEXT_UNAVAILABLE",
        owner: "DIAGNOSTIC_TARGET_ACCESS",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE",
        action: "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_CANVAS_SURFACE_TRUTH_PROBE",
        certainty: "DEFINITIVE_TARGET_CONTEXT_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [FILE]
      };
    }

    if (!snapshot.canonicalMountFound) {
      return {
        status: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_MOUNT_FOUND",
        failureClass: "CANONICAL_CANVAS_MOUNT_NOT_FOUND",
        owner: "HTML_SHELL_OR_CANVAS_PLACEMENT_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasMount_WAS_NOT_FOUND_IN_TARGET_DOCUMENT",
        action: "READ_SURFACE_DOM_BOUNDARY_FACTS_BEFORE_FILE_RENEWAL",
        certainty: "DEFINITIVE_CANONICAL_MOUNT_ABSENCE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (snapshot.canonicalMountFound && !snapshot.canonicalMountRectNonzero) {
      return {
        status: "CANONICAL_MOUNT_ZERO_RECT",
        clean: false,
        coordinate: "CANONICAL_MOUNT_RECT_NONZERO",
        failureClass: "CANONICAL_MOUNT_ZERO_RECT",
        owner: "HTML_SHELL_OR_STAGE_LAYOUT_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: `#hearthCanvasMount_EXISTS_BUT_RECT_IS_ZERO_PARENT_CHAIN:${mountChain.firstCollapsedDescriptor || "UNKNOWN"}`,
        action: "READ_PARENT_CHAIN_AND_STAGE_USED_SIZE_FACTS",
        certainty: "DEFINITIVE_MOUNT_LAYOUT_MATH_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!snapshot.canonicalFrameFound) {
      return {
        status: "CANONICAL_RECT_LOCK_FRAME_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_FRAME_FOUND",
        failureClass: "CANONICAL_RECT_LOCK_FRAME_NOT_FOUND",
        owner: "HTML_CANVAS_DOM_CHAIN_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasMount_EXISTS_BUT_#hearthCanvasRectLockFrame_IS_MISSING",
        action: "READ_CANONICAL_DOM_CHAIN_OWNERSHIP_FACTS",
        certainty: "DEFINITIVE_CANONICAL_FRAME_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (snapshot.canonicalFrameFound && !snapshot.canonicalFrameRectNonzero) {
      return {
        status: "CANONICAL_RECT_LOCK_FRAME_ZERO_RECT",
        clean: false,
        coordinate: "CANONICAL_FRAME_RECT_NONZERO",
        failureClass: "CANONICAL_RECT_LOCK_FRAME_ZERO_RECT",
        owner: "HTML_CANVAS_DOM_CHAIN_LAYOUT_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasRectLockFrame_EXISTS_BUT_RECT_IS_ZERO",
        action: "READ_RECT_LOCK_FRAME_STYLE_WIDTH_HEIGHT_FLEX_BASIS_AND_PARENT_LAYOUT_FACTS",
        certainty: "DEFINITIVE_CANONICAL_FRAME_LAYOUT_MATH_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!snapshot.canonicalCanvas) {
      return {
        status: "CANONICAL_CANVAS_NOT_FOUND",
        clean: false,
        coordinate: "CANONICAL_CANVAS_FOUND",
        failureClass: "CANONICAL_CANVAS_NOT_FOUND",
        owner: "HTML_CANVAS_DOM_CHAIN_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "#hearthCanvasMount_EXISTS_BUT_NO_CANONICAL_CANVAS_SELECTOR_MATCHED",
        action: "READ_CANONICAL_SELECTOR_AND_PIXEL_BEARING_SURFACE_FACTS",
        certainty: "DEFINITIVE_CANONICAL_CANVAS_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
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
        owner: "CANVAS_IDENTITY_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "VISIBLE_PIXELS_EXIST_BUT_THE_PIXEL_BEARING_CANVAS_IS_NOT_THE_CANONICAL_CANVAS",
        action: "READ_PIXEL_BEARING_CANVAS_IDENTITY_AND_CANONICAL_SELECTOR_FACTS",
        certainty: "DEFINITIVE_CANVAS_IDENTITY_DIVERGENCE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!canonicalSummary.inCanonicalMount) {
      return {
        status: "CANONICAL_CANVAS_NOT_IN_CANONICAL_MOUNT",
        clean: false,
        coordinate: "CANVAS_IN_MOUNT",
        failureClass: "CANONICAL_CANVAS_CONNECTION_MISMATCH",
        owner: "HTML_CANVAS_DOM_CHAIN_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_SELECTOR_MATCHED_BUT_CANVAS_IS_NOT_INSIDE_#hearthCanvasMount",
        action: "READ_CANONICAL_CANVAS_PLACEMENT_FACTS",
        certainty: "DEFINITIVE_CANVAS_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!canonicalSummary.inCanonicalFrame) {
      return {
        status: "CANONICAL_CANVAS_NOT_IN_RECT_LOCK_FRAME",
        clean: false,
        coordinate: "CANVAS_IN_FRAME",
        failureClass: "CANONICAL_CANVAS_FRAME_CONNECTION_MISMATCH",
        owner: "HTML_CANVAS_DOM_CHAIN_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_IS_IN_MOUNT_BUT_NOT_IN_#hearthCanvasRectLockFrame",
        action: "READ_CANONICAL_FRAME_PLACEMENT_FACTS",
        certainty: "DEFINITIVE_CANVAS_FRAME_CONNECTION_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!canonicalSummary.internalSizeNonzero) {
      return {
        status: "CANONICAL_CANVAS_INTERNAL_SIZE_ZERO",
        clean: false,
        coordinate: "CANVAS_INTERNAL_SIZE_NONZERO",
        failureClass: "CANONICAL_CANVAS_INTERNAL_SIZE_ZERO",
        owner: "CANVAS_DOM_SURFACE_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_WIDTH_OR_HEIGHT_ATTRIBUTE_IS_ZERO",
        action: "READ_CANONICAL_CANVAS_BUFFER_WIDTH_AND_HEIGHT_FACTS",
        certainty: "DEFINITIVE_CANVAS_BUFFER_MATH_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!canonicalSummary.rectNonzero) {
      const collapsedDescriptor =
        chain.firstCollapsedDescriptor && chain.firstCollapsedDescriptor !== "NONE"
          ? chain.firstCollapsedDescriptor
          : canonicalSummary.descriptor;

      return {
        status: "CANONICAL_CANVAS_ZERO_RECT",
        clean: false,
        coordinate: "CANVAS_RECT_NONZERO",
        failureClass: "CANONICAL_CANVAS_ZERO_RECT",
        owner: "CSS_LAYOUT_OR_CANVAS_PLACEMENT_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: canonicalSummary.pixelVisible
          ? `CANONICAL_CANVAS_HAS_PIXEL_DATA_BUT_BOUNDING_RECT_IS_ZERO_COLLAPSED_AT:${collapsedDescriptor}`
          : `CANONICAL_CANVAS_EXISTS_BUT_BOUNDING_RECT_IS_ZERO_COLLAPSED_AT:${collapsedDescriptor}`,
        action: "READ_CANONICAL_CANVAS_CSS_USED_SIZE_PARENT_CHAIN_AND_RECT_LOCK_MATH_FACTS",
        certainty: "DEFINITIVE_CANONICAL_RECT_MATH_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!canonicalSummary.computedVisible) {
      return {
        status: "CANONICAL_CANVAS_HIDDEN",
        clean: false,
        coordinate: "CANVAS_COMPUTED_VISIBLE",
        failureClass: "CANONICAL_CANVAS_COMPUTED_STYLE_HIDDEN",
        owner: "CSS_VISIBILITY_OR_ROUTE_SHELL_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_COMPUTED_STYLE_IS_NOT_VISIBLE",
        action: "READ_DISPLAY_VISIBILITY_OPACITY_AND_ROUTE_STAGE_VISIBILITY_FACTS",
        certainty: "DEFINITIVE_CANONICAL_VISIBILITY_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!canonicalSummary.viewportIntersecting) {
      return {
        status: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        clean: false,
        coordinate: "CANVAS_VIEWPORT_INTERSECTING",
        failureClass: "CANONICAL_CANVAS_OUTSIDE_VIEWPORT",
        owner: "CSS_LAYOUT_OR_SCROLL_POSITION_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT",
        action: "READ_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_INTERSECTION_FACTS",
        certainty: "DEFINITIVE_CANONICAL_VIEWPORT_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (!canonicalSummary.context2dReady) {
      return {
        status: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        clean: false,
        coordinate: "CANVAS_CONTEXT_2D_READY",
        failureClass: "CANONICAL_CANVAS_CONTEXT_2D_NOT_READY",
        owner: "CANVAS_DOM_SURFACE_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: canonicalSummary.context2dStatus,
        action: "READ_CANONICAL_DOM_SURFACE_CONTEXT_FACTS",
        certainty: "DEFINITIVE_CANONICAL_CONTEXT_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
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
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: `CENTER_POINT_TOP_ELEMENT_IS_${snapshot.layering.centerElementDescriptor}`,
        action: "READ_CANVAS_LAYERING_Z_INDEX_AND_OVERLAY_FACTS",
        certainty: "DEFINITIVE_CANONICAL_LAYERING_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [HTML_FILE, CANVAS_FILE]
      };
    }

    if (snapshot.fallbackObserved) {
      return {
        status: "CANONICAL_CANVAS_VISIBLE_BUT_FALLBACK_OR_CARTOON_INDICATED",
        clean: false,
        coordinate: "FALLBACK_CARTOON_SIGNAL",
        failureClass: "CANONICAL_CANVAS_FALLBACK_OR_CARTOON_SURFACE",
        owner: "CANVAS_FALLBACK_PATH_OR_ROUTE_CONDUCTOR_SETTLED_STATE_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: "CANONICAL_CANVAS_IS_VISIBLE_AND_PIXEL_BEARING_BUT_FALLBACK_OR_CARTOON_SIGNAL_IS_PRESENT",
        action: "READ_ROUTE_SETTLED_STATE_AND_DOWNSTREAM_FALLBACK_SUPPRESSION_FACTS",
        certainty: "DEFINITIVE_FALLBACK_SURFACE_SIGNAL",
        singleCausalFileProven: false,
        adjacentFiles: [ROUTE_CONDUCTOR_FILE, CANVAS_FILE, HEX_SURFACE_FILE, POINTER_SURFACE_FILE]
      };
    }

    if (snapshot.canonicalSurfaceAdmissible && !canonicalSummary.pixelVisible) {
      return {
        status: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        clean: false,
        coordinate: "CANVAS_PIXEL_VISIBLE",
        failureClass: "CANONICAL_CANVAS_BOUND_BUT_PIXEL_BLANK",
        owner: "CANVAS_DRAW_PATH_OR_DOWNSTREAM_EXPRESSION_BOUNDARY",
        provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
        reason: canonicalSummary.pixelSampleReason,
        action: "READ_BOUNDARY_DIAGNOSIS_MATRIX_FOR_MISSING_RUNTIME_PROOF",
        certainty: "DEFINITIVE_CANONICAL_PIXEL_FAILURE",
        singleCausalFileProven: false,
        adjacentFiles: [ROUTE_CONDUCTOR_FILE, CANVAS_FILE, HEX_SURFACE_FILE, POINTER_SURFACE_FILE]
      };
    }

    if (snapshot.canonicalSurfaceTruthPassed) {
      return {
        status: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        clean: true,
        coordinate: "NONE",
        failureClass: "CANONICAL_CANVAS_SURFACE_TRUTH_PASSED",
        owner: "NONE",
        provenFile: "NONE",
        reason: "CANONICAL_CANVAS_IS_MOUNTED_FRAMED_NONZERO_VISIBLE_VIEWPORT_INTERSECTING_CONTEXT_READY_AND_PIXEL_BEARING",
        action: "RETURN_CANONICAL_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_LAWFUL_CHECK",
        certainty: "DEFINITIVE_CANONICAL_SURFACE_PASS_NO_FINAL_CLAIM",
        singleCausalFileProven: false,
        adjacentFiles: []
      };
    }

    return {
      status: "DIAGNOSTIC_BLIND_SPOT",
      clean: false,
      coordinate: "UNCLASSIFIED_CANVAS_SURFACE_TRUTH_STATE",
      failureClass: "DIAGNOSTIC_BLIND_SPOT",
      owner: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      provenFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      reason: "CANONICAL_CANVAS_STATE_DID_NOT_MATCH_ANY_DEFINED_FAILURE_OR_PASS_CLASS",
      action: "EXPAND_DIAGNOSTIC_CLASSIFIER_FOR_THIS_SURFACE_STATE",
      certainty: "BLIND_SPOT_IDENTIFIED",
      singleCausalFileProven: false,
      adjacentFiles: [FILE]
    };
  }

  function signalTruth(value) {
    if (value === true) return true;
    if (value === false) return false;
    if (value === "UNKNOWN") return "UNKNOWN";
    return safeBool(value, false);
  }

  function statusFromBoundary(row) {
    if (!row.fromObserved) return "FROM_AUTHORITY_NOT_OBSERVED";
    if (!row.toObserved) return "TO_AUTHORITY_NOT_OBSERVED";
    if (!row.toReceiverAvailable) return "TO_PUBLIC_RECEIVER_NOT_OBSERVED";
    if (row.requestObserved === false) return "REQUEST_NOT_OBSERVED";
    if (row.grantObserved === false) return "REQUEST_OBSERVED_GRANT_NOT_CONFIRMED";
    if (row.expectsReturn && row.returnObserved === false) return "GRANT_OBSERVED_RETURN_NOT_CONFIRMED";
    if (row.ackRequired && row.ackObserved === false) return "ACK_NOT_CONFIRMED";
    if (row.pixelEffectRequired && row.pixelEffectObserved === false) return "PIXEL_EFFECT_NOT_CONFIRMED";
    if (row.requestObserved === "UNKNOWN" || row.grantObserved === "UNKNOWN") return "BOUNDARY_FACTS_PARTIAL";
    if (row.expectsReturn && row.returnObserved === "UNKNOWN") return "BOUNDARY_FACTS_PARTIAL";
    if (row.ackRequired && row.ackObserved === "UNKNOWN") return "BOUNDARY_FACTS_PARTIAL";
    return row.expectsReturn ? "HANDSHAKE_BOUNDARY_CONFIRMED" : "ONE_WAY_HANDOFF_BOUNDARY_CONFIRMED";
  }

  function missingRuntimeFact(row) {
    if (!row.fromObserved) return "FROM_AUTHORITY_MISSING_OR_ALIAS_NOT_OBSERVED";
    if (!row.toObserved) return "TO_AUTHORITY_MISSING_OR_ALIAS_NOT_OBSERVED";
    if (!row.toReceiverAvailable) return "TO_PUBLIC_RECEIVER_METHOD_NOT_OBSERVED";
    if (row.requestObserved === false) return "REQUEST_PACKET_OR_COUNTER_NOT_OBSERVED";
    if (row.grantObserved === false) return "RECEIVER_GRANT_OR_ACCEPT_COUNTER_NOT_OBSERVED";
    if (row.expectsReturn && row.returnObserved === false) return "RETURN_PACKET_OR_RETURN_COUNTER_NOT_OBSERVED";
    if (row.ackRequired && row.ackObserved === false) return "ACK_COUNTER_OR_RECEIPT_NOT_OBSERVED";
    if (row.pixelEffectRequired && row.pixelEffectObserved === false) return "PIXEL_EFFECT_NOT_OBSERVED_AFTER_BOUNDARY";
    if (
      row.requestObserved === "UNKNOWN" ||
      row.grantObserved === "UNKNOWN" ||
      (row.expectsReturn && row.returnObserved === "UNKNOWN") ||
      (row.ackRequired && row.ackObserved === "UNKNOWN")
    ) {
      return "BOUNDARY_FACT_PARTIAL_OR_NOT_EXPOSED";
    }
    return "NONE";
  }

  function makeBoundaryRow(config, snapshot) {
    const from = config.from;
    const to = config.to;

    const requestObserved = signalTruth(config.requestObserved(snapshot));
    const grantObserved = signalTruth(config.grantObserved(snapshot));
    const returnObserved = signalTruth(config.returnObserved(snapshot));
    const ackObserved = signalTruth(config.ackObserved(snapshot));
    const pixelEffectObserved = signalTruth(config.pixelEffectObserved(snapshot));

    const row = {
      id: config.id,
      relationship: config.relationship,
      fromOwner: config.fromOwner,
      toOwner: config.toOwner,
      fromFile: config.fromFile,
      toFile: config.toFile,
      fromObserved: Boolean(from.observed),
      toObserved: Boolean(to.observed),
      fromScope: from.scope || "NONE",
      toScope: to.scope || "NONE",
      fromSourcePath: from.path || "NONE",
      toSourcePath: to.path || "NONE",
      fromContract: from.contract || "UNKNOWN",
      toContract: to.contract || "UNKNOWN",
      fromReceipt: from.receipt || "UNKNOWN",
      toReceipt: to.receipt || "UNKNOWN",
      fromMethodAvailable: config.fromMethodAvailable(from),
      toReceiverAvailable: config.toReceiverAvailable(to),
      requestObserved,
      grantObserved,
      returnObserved,
      ackObserved,
      pixelEffectObserved,
      expectsReturn: config.expectsReturn === true,
      ackRequired: config.ackRequired === true,
      pixelEffectRequired: config.pixelEffectRequired === true,
      proofBasis: config.proofBasis(snapshot),
      adjacentFiles: config.adjacentFiles.slice(),
      causalFileProven: false,
      provenCausalFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      provenCausalReason: "BOUNDARY_RELATED_FACTS_ONLY_SINGLE_FILE_CAUSALITY_NOT_PROVEN"
    };

    row.boundaryStatus = statusFromBoundary(row);
    row.missingRuntimeFact = missingRuntimeFact(row);

    return row;
  }

  function globalPacketObserved(targetWindow, names) {
    const scopes = [targetWindow, root].filter(Boolean);

    for (const scope of scopes) {
      for (const name of names || []) {
        const value = readPath(scope, name);
        if (value !== null && value !== undefined) return true;
      }
    }

    return false;
  }

  function buildBoundaryMatrix(snapshot) {
    const a = snapshot.authorities || {};
    const canvasPixelVisible = Boolean(snapshot.canonicalSummary && snapshot.canonicalSummary.pixelVisible);
    const canonicalSurfaceAdmissible = Boolean(snapshot.canonicalSurfaceAdmissible);

    const routeAcceptedCount = numericReceiptValue(a.canvas, [
      "routePacketAcceptedCount",
      "ROUTE_PACKET_ACCEPTED_COUNT"
    ]);

    const hexGateComposedCount = numericReceiptValue(a.canvas, [
      "hexGatePacketComposedCount",
      "HEX_GATE_PACKET_COMPOSED_COUNT"
    ]);

    const hexGateReturnCount = numericReceiptValue(a.canvas, [
      "hexGateDeliveryReturnCount",
      "HEX_GATE_DELIVERY_RETURN_COUNT"
    ]);

    const surfaceReturnAcceptedCount = numericReceiptValue(a.canvas, [
      "surfaceReturnAcceptedCount",
      "SURFACE_RETURN_ACCEPTED_COUNT"
    ]);

    const drawCount = numericReceiptValue(a.canvas, [
      "drawCount",
      "DRAW_COUNT"
    ]);

    const hexAcceptedCount = numericReceiptValue(a.hexSurface, [
      "acceptedPacketCount",
      "ACCEPTED_PACKET_COUNT"
    ]);

    const hexTransmissionCount = numericReceiptValue(a.hexSurface, [
      "transmissionCount",
      "TRANSMISSION_COUNT"
    ]);

    const hexDeliveryCount = numericReceiptValue(a.hexSurface, [
      "deliveryCount",
      "DELIVERY_COUNT"
    ]);

    const pointerActiveCount = numericReceiptValue(a.hexSurface, [
      "pointerFingerActiveCount",
      "POINTER_FINGER_ACTIVE_COUNT"
    ]);

    const viewPacketCount = numericReceiptValue(a.canvas, [
      "viewPacketReceivedCount",
      "VIEW_PACKET_RECEIVED_COUNT"
    ]);

    const configs = [
      {
        id: "ROUTE_CONDUCTOR_TO_CANVAS",
        relationship: "ROUTE_CONDUCTOR -> CANVAS",
        fromOwner: "ROUTE_CONDUCTOR",
        toOwner: "CANVAS_RECEIVER",
        fromFile: ROUTE_CONDUCTOR_FILE,
        toFile: CANVAS_FILE,
        from: a.route || {},
        to: a.canvas || {},
        expectsReturn: true,
        ackRequired: true,
        pixelEffectRequired: false,
        adjacentFiles: [ROUTE_CONDUCTOR_FILE, CANVAS_FILE],
        fromMethodAvailable: (from) => hasMethod(from, [
          "composeCanvasHandoffPacket",
          "getCanvasHandoffPacket",
          "getHandoffPacket",
          "composePresentationPacket",
          "loadMissingDirectChain",
          "runSafePacketBridgeScan",
          /Canvas/i
        ]),
        toReceiverAvailable: (to) => hasMethod(to, [
          "receiveRouteConductorCanvasTransactionPacket",
          "consumeRouteConductorCanvasTransactionPacket",
          "acceptRouteConductorCanvasTransactionPacket",
          "receiveRouteConductorHandoffPacket",
          "receiveGovernedSourcePacket",
          "receiveCanvasHandoffPacket",
          "receivePresentationPacket",
          "receive",
          /RouteConductor/i,
          /CanvasHandoff/i
        ]),
        requestObserved: () => {
          const routeRequest = booleanReceiptSignal(a.route, [
            "routeCanvasPairPermissionRequested",
            "routeCanvasPairPermissionGranted",
            "canvasAssetTransactionResetActive"
          ]);
          return routeRequest !== "UNKNOWN"
            ? routeRequest
            : globalPacketObserved(snapshot.targetWindow, [
                "HEARTH_ROUTE_CONDUCTOR_CANVAS_HANDOFF_PACKET",
                "HEARTH_ROUTE_CONDUCTOR_HANDOFF_PACKET",
                "HEARTH.routeConductorCanvasHandoffPacket"
              ]);
        },
        grantObserved: () => routeAcceptedCount > 0 || booleanReceiptSignal(a.route, [
          "routeCanvasPairPermissionGranted",
          "canvasReceiverReady",
          "routeCanvasHandoffStatus"
        ]) === true,
        returnObserved: () => hexGateComposedCount > 0 || booleanReceiptSignal(a.route, [
          "routeCanvasPairPermissionGranted",
          "routeCanvasHandoffStatus"
        ]) === true,
        ackObserved: () => routeAcceptedCount > 0 || hexGateComposedCount > 0,
        pixelEffectObserved: () => canvasPixelVisible,
        proofBasis: () => ({
          canvasRoutePacketAcceptedCount: routeAcceptedCount,
          canvasHexGatePacketComposedCount: hexGateComposedCount,
          routeCanvasHandoffStatus: textReceiptSignal(a.route, ["routeCanvasHandoffStatus"]),
          routeCanvasPairPermissionGranted: booleanReceiptSignal(a.route, ["routeCanvasPairPermissionGranted"])
        })
      },
      {
        id: "CANVAS_TO_HEX_SURFACE",
        relationship: "CANVAS -> HEX_SURFACE",
        fromOwner: "CANVAS_RECEIVER",
        toOwner: "HEX_SURFACE_GATE",
        fromFile: CANVAS_FILE,
        toFile: HEX_SURFACE_FILE,
        from: a.canvas || {},
        to: a.hexSurface || {},
        expectsReturn: true,
        ackRequired: true,
        pixelEffectRequired: false,
        adjacentFiles: [CANVAS_FILE, HEX_SURFACE_FILE],
        fromMethodAvailable: (from) => hasMethod(from, [
          "composeCanvasHexGatePacket",
          "deliverCanvasHexGatePacket",
          "publishTransmissionPacketGlobals",
          /HexGate/i,
          /HexSurface/i
        ]),
        toReceiverAvailable: (to) => hasMethod(to, [
          "receiveCanvasHexGatePacket",
          "consumeCanvasHexGatePacket",
          "acceptCanvasHexGatePacket",
          "receiveCanvasViewPacket",
          "consumeCanvasViewPacket",
          "receiveInteractiveFramePacket",
          "drawInteractiveFrame",
          "drawPairFrame",
          "receive",
          /CanvasHex/i,
          /CanvasView/i
        ]),
        requestObserved: () => hexGateComposedCount > 0 || globalPacketObserved(snapshot.targetWindow, [
          "HEARTH_CANVAS_HEX_GATE_PACKET",
          "HEARTH_CANVAS_LAST_HEX_GATE_PACKET",
          "HEARTH.canvasHexGatePacket"
        ]),
        grantObserved: () => hexAcceptedCount > 0 || textReceiptSignal(a.hexSurface, [
          "lastValidationStatus",
          "LAST_VALIDATION_STATUS"
        ]) === "ACCEPTED",
        returnObserved: () => hexGateReturnCount > 0 || textReceiptSignal(a.canvas, [
          "lastHexSurfaceDeliveryResult.status",
          "HEX_SURFACE_METHOD"
        ]) !== "UNKNOWN",
        ackObserved: () => hexTransmissionCount > 0 || hexDeliveryCount > 0 || hexAcceptedCount > 0,
        pixelEffectObserved: () => canvasPixelVisible,
        proofBasis: () => ({
          canvasHexGatePacketComposedCount: hexGateComposedCount,
          canvasHexGateDeliveryReturnCount: hexGateReturnCount,
          hexSurfaceAcceptedPacketCount: hexAcceptedCount,
          hexSurfaceTransmissionCount: hexTransmissionCount,
          hexSurfaceDeliveryCount: hexDeliveryCount
        })
      },
      {
        id: "HEX_SURFACE_TO_POINTER_SURFACE_BISHOP",
        relationship: "HEX_SURFACE -> POINTER_SURFACE_BISHOP",
        fromOwner: "HEX_SURFACE_GATE",
        toOwner: "POINTER_SURFACE_BISHOP",
        fromFile: HEX_SURFACE_FILE,
        toFile: POINTER_SURFACE_FILE,
        from: a.hexSurface || {},
        to: a.pointerSurface || {},
        expectsReturn: false,
        ackRequired: true,
        pixelEffectRequired: false,
        adjacentFiles: [HEX_SURFACE_FILE, POINTER_SURFACE_FILE],
        fromMethodAvailable: (from) => hasMethod(from, [
          "composePointerFingerTransmissionPacket",
          "deliverPointerFingerTransmission",
          "publishTransmissionGlobals",
          /PointerFinger/i,
          /Transmission/i
        ]),
        toReceiverAvailable: (to) => hasMethod(to, [
          "receiveHexSurfaceTransmissionPacket",
          "consumeHexSurfaceTransmissionPacket",
          "receivePointerFingerTransmissionPacket",
          "consumePointerFingerTransmissionPacket",
          "receiveCanvasFingerPacket",
          "receiveHexGatePacket",
          "receiveSurfacePacket",
          "acceptTransmissionPacket",
          "receive",
          /Transmission/i,
          /Surface/i
        ]),
        requestObserved: () => hexTransmissionCount > 0 || globalPacketObserved(snapshot.targetWindow, [
          "HEARTH_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_PACKET",
          "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_POINTER_FINGER_TRANSMISSION_PACKET",
          "HEARTH_POINTER_FINGER_TRANSMISSION_PACKET",
          "HEARTH.hexSurfacePointerFingerTransmissionPacket"
        ]),
        grantObserved: () => pointerActiveCount > 0 || booleanReceiptSignal(a.hexSurface, [
          "pointerFingerSurfaceObserved",
          "POINTER_FINGER_SURFACE_OBSERVED"
        ]) === true,
        returnObserved: () => "NOT_REQUIRED_ONE_WAY_HANDOFF",
        ackObserved: () => pointerActiveCount > 0 || hexDeliveryCount > 0,
        pixelEffectObserved: () => canvasPixelVisible,
        proofBasis: () => ({
          hexSurfaceTransmissionCount: hexTransmissionCount,
          hexSurfaceDeliveryCount: hexDeliveryCount,
          pointerFingerActiveCount: pointerActiveCount,
          pointerSurfaceObservedByHexSurface: booleanReceiptSignal(a.hexSurface, [
            "pointerFingerSurfaceObserved",
            "POINTER_FINGER_SURFACE_OBSERVED"
          ])
        })
      },
      {
        id: "POINTER_SURFACE_BISHOP_TO_CANVAS_RETURN",
        relationship: "POINTER_SURFACE_BISHOP -> CANVAS",
        fromOwner: "POINTER_SURFACE_BISHOP",
        toOwner: "CANVAS_RECEIVER",
        fromFile: POINTER_SURFACE_FILE,
        toFile: CANVAS_FILE,
        from: a.pointerSurface || {},
        to: a.canvas || {},
        expectsReturn: true,
        ackRequired: true,
        pixelEffectRequired: true,
        adjacentFiles: [POINTER_SURFACE_FILE, CANVAS_FILE],
        fromMethodAvailable: (from) => hasMethod(from, [
          "composeSurfaceExpressionPacket",
          "returnSurfaceExpressionPacket",
          "publishSurfaceExpressionPacket",
          "receiveHexSurfaceTransmissionPacket",
          /Surface/i,
          /Expression/i,
          /Canvas/i
        ]),
        toReceiverAvailable: (to) => hasMethod(to, [
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
          /PointerSurface/i,
          /SurfaceExpression/i
        ]),
        requestObserved: () => globalPacketObserved(snapshot.targetWindow, [
          "HEARTH_POINTER_SURFACE_CANVAS_RETURN_PACKET",
          "HEARTH_CANVAS_FINGER_SURFACE_EXPRESSION_PACKET",
          "HEARTH_SURFACE_EXPRESSION_PACKET",
          "HEARTH.pointerSurfaceExpressionPacket"
        ]),
        grantObserved: () => surfaceReturnAcceptedCount > 0,
        returnObserved: () => surfaceReturnAcceptedCount > 0,
        ackObserved: () => drawCount > 0 && surfaceReturnAcceptedCount > 0,
        pixelEffectObserved: () => canvasPixelVisible,
        proofBasis: () => ({
          canvasSurfaceReturnAcceptedCount: surfaceReturnAcceptedCount,
          canvasDrawCount: drawCount,
          canvasPixelVisible,
          canonicalSurfaceAdmissible
        })
      },
      {
        id: "CONTROLS_TO_CANVAS",
        relationship: "CONTROLS -> CANVAS",
        fromOwner: "CONTROLS_QUEEN",
        toOwner: "CANVAS_RECEIVER",
        fromFile: CONTROL_FILE,
        toFile: CANVAS_FILE,
        from: a.controls || {},
        to: a.canvas || {},
        expectsReturn: true,
        ackRequired: true,
        pixelEffectRequired: false,
        adjacentFiles: [CONTROL_FILE, CANVAS_FILE],
        fromMethodAvailable: (from) => hasMethod(from, [
          "receiveRouteConductorControlHandshakePacket",
          "composePlanetaryViewPacket",
          "deliverViewPacket",
          "bind",
          "start",
          /View/i,
          /Control/i,
          /Pointer/i
        ]),
        toReceiverAvailable: (to) => hasMethod(to, [
          "receivePlanetaryViewControlPacket",
          "consumePlanetaryViewControlPacket",
          "receiveViewControlPacket",
          "consumeViewControlPacket",
          "receive",
          /ViewControl/i,
          /PlanetaryView/i
        ]),
        requestObserved: () => viewPacketCount > 0 || booleanReceiptSignal(a.controls, [
          "hexGateTransmissionActive",
          "smoothInputRenewalActive",
          "canvasPublicReceiverRequired",
          "CONTROL_HANDSHAKE_STATUS"
        ]) === true,
        grantObserved: () => viewPacketCount > 0 || textReceiptSignal(a.canvas, [
          "controlHandshakeStatus",
          "CONTROL_HANDSHAKE_STATUS"
        ]) !== "UNKNOWN",
        returnObserved: () => viewPacketCount > 0 || booleanReceiptSignal(a.controls, [
          "canvasReceiverCacheActive",
          "canvasReceiverPrewarmActive"
        ]) === true,
        ackObserved: () => viewPacketCount > 0 || textReceiptSignal(a.canvas, [
          "viewControlStatus",
          "VIEW_CONTROL_STATUS"
        ]) !== "UNKNOWN",
        pixelEffectObserved: () => canvasPixelVisible,
        proofBasis: () => ({
          canvasViewPacketReceivedCount: viewPacketCount,
          controlsContract: a.controls ? a.controls.contract : "UNKNOWN",
          canvasControlHandshakeStatus: textReceiptSignal(a.canvas, ["controlHandshakeStatus", "CONTROL_HANDSHAKE_STATUS"]),
          canvasViewControlStatus: textReceiptSignal(a.canvas, ["viewControlStatus", "VIEW_CONTROL_STATUS"])
        })
      }
    ];

    const rows = configs.map((config) => makeBoundaryRow(config, snapshot));

    const failedRows = rows.filter((row) => !/CONFIRMED$/.test(row.boundaryStatus));
    const firstFailed = failedRows[0] || null;
    const partialRows = rows.filter((row) => row.boundaryStatus === "BOUNDARY_FACTS_PARTIAL");

    return {
      matrixVersion: "HEARTH_BOUNDARY_DIAGNOSIS_MATRIX_v1_8",
      generatedAt: nowIso(),
      boundaryDiagnosisAvailable: true,
      boundaryRelationshipCount: rows.length,
      boundaryConfirmedCount: rows.filter((row) => /CONFIRMED$/.test(row.boundaryStatus)).length,
      boundaryFailedOrPartialCount: failedRows.length,
      boundaryPartialCount: partialRows.length,
      singleCausalFileProven: false,
      provenCausalFile: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      provenCausalReason: "BOUNDARY_MATRIX_REPORTS_MISSING_RUNTIME_FACT_LOCATION_NOT_SINGLE_FILE_CAUSALITY",
      missingRuntimeFactLocation: firstFailed ? "BOUNDARY_NOT_FILE" : "NONE",
      firstFailedBoundary: firstFailed ? firstFailed.id : "NONE",
      firstFailedBoundaryRelationship: firstFailed ? firstFailed.relationship : "NONE",
      firstFailedBoundaryStatus: firstFailed ? firstFailed.boundaryStatus : "NONE",
      firstMissingRuntimeFact: firstFailed ? firstFailed.missingRuntimeFact : "NONE",
      firstAdjacentFiles: firstFailed ? firstFailed.adjacentFiles.slice() : [],
      rows
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
      "BOUNDARY_FIRST_FAILED_BOUNDARY",
      "BOUNDARY_FIRST_FAILED_STATUS",
      "BOUNDARY_FIRST_MISSING_RUNTIME_FACT"
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
    const surfaceVerdict = resolveSurfaceVerdict(snapshot);
    const boundaryMatrix = buildBoundaryMatrix(snapshot);
    const canonicalSummary = snapshot.canonicalSummary || {};
    const firstPixelBearingSummary = snapshot.firstPixelBearingSummary || {};
    const scripts = snapshot.scripts || {};
    const authorities = snapshot.authorities || {};
    const layering = snapshot.layering || {};
    const chain = snapshot.canonicalParentChainClassification || {};
    const mountChain = snapshot.mountParentChainClassification || {};
    const comparison = compareImmediateToSettled(lastReport, lastSettledReport);

    const boundaryRows = boundaryMatrix.rows || [];
    const boundaryText = boundaryRows
      .map((row) => `${row.id}:${row.boundaryStatus}:${row.missingRuntimeFact}`)
      .join(" | ");

    const adjacentFiles = Array.from(new Set(
      (surfaceVerdict.adjacentFiles || []).concat(boundaryMatrix.firstAdjacentFiles || [])
    ));

    const notes = [
      "V1_8_BOUNDARY_DIAGNOSIS_MATRIX_ACTIVE",
      "V1_7_LAYOUT_MATH_CONNECTION_BLINDSPOT_ARBITRATION_PRESERVED",
      "V1_6_CALL_GUARDED_TRANSITION_SURFACE_DISAMBIGUATION_PRESERVED",
      "V1_5_CANONICAL_VISIBLE_SURFACE_DISAMBIGUATION_PRESERVED",
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
      `CANONICAL_MOUNT_FOUND:${snapshot.canonicalMountFound}`,
      `CANONICAL_MOUNT_RECT_NONZERO:${snapshot.canonicalMountRectNonzero}`,
      `CANONICAL_FRAME_FOUND:${snapshot.canonicalFrameFound}`,
      `CANONICAL_FRAME_RECT_NONZERO:${snapshot.canonicalFrameRectNonzero}`,
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
      `CANVAS_TRUTH_FAILURE_CLASS:${surfaceVerdict.failureClass}`,
      `BOUNDARY_FIRST_FAILED:${boundaryMatrix.firstFailedBoundary}`,
      `BOUNDARY_FIRST_MISSING_RUNTIME_FACT:${boundaryMatrix.firstMissingRuntimeFact}`,
      `DIAGNOSTIC_CERTAINTY:${surfaceVerdict.certainty}`
    ];

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_PACKET_v1_8",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
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
      POINTER_BOUNDARY_FILE,
      POINTER_LIGHT_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_RENEWAL_CANDIDATE,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_HEX_AUTHORITY_CONTRACT,
      EXPECTED_POINTER_SURFACE_CONTRACT,
      EXPECTED_POINTER_INSPECT_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED",
      CANVAS_SURFACE_TRUTH_AVAILABLE: snapshot.context.targetAvailable ? "true" : "false",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CANONICAL_SURFACE_TRUTH_PLUS_BOUNDARY_DIAGNOSIS_MATRIX_ONLY",
      CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS:
        "BOUNDARY_RELATED_FACTS_AROUND_MISSING_RUNTIME_PROOF",

      NEWS_ALIGNMENT_PROTOCOL_ACTIVE: true,
      NEWS_ALIGNMENT_STATUS: "NORTH_EAST_WEST_SOUTH_BOUNDARY_DIAGNOSIS_ALIGNED",
      NEWS_NORTH_ROLE: "ARBITRATION_OUTPUT_NO_F21_CLAIM",
      NEWS_EAST_ROLE: "SOURCE_OBSERVATION_NO_MUTATION",
      NEWS_WEST_ROLE: "BOUNDARY_COMPARISON_NO_SINGLE_FILE_COLLAPSE",
      NEWS_SOUTH_ROLE: "PACKET_RETURN_NO_DRAW_REPAIR_RELEASE",
      FIBONACCI_SYNCHRONIZATION_ACTIVE: true,
      FIBONACCI_SEQUENCE:
        "F1_ANCHOR | F2_TARGET_CONTEXT | F3_DOM_SURFACE | F5_PIXEL_IDENTITY | F8_AUTHORITY_OBSERVATION | F13_BOUNDARY_MATRIX | F21_ARBITRATION_NO_AUTHORITY_CLAIM | F34_OUTPUT | F55_SETTLED_SAMPLE",
      FIBONACCI_CURRENT_STAGE: "F13_BOUNDARY_MATRIX_TO_F21_DIAGNOSTIC_ARBITRATION",

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
      CONTROL_SCRIPT_PRESENT: scripts.controls ? scripts.controls.present : false,
      CONTROL_SCRIPT_SRC: scripts.controls ? scripts.controls.src : "NONE",
      CANVAS_SCRIPT_PRESENT: scripts.canvas ? scripts.canvas.present : false,
      CANVAS_SCRIPT_COUNT: scripts.canvas ? scripts.canvas.count : 0,
      CANVAS_SCRIPT_SRC: scripts.canvas ? scripts.canvas.src : "NONE",
      CANVAS_SCRIPT_CACHE_KEY: scripts.canvas ? scripts.canvas.cacheKey : "NONE",
      CANVAS_SCRIPT_TAG_ORDER: scripts.canvas ? scripts.canvas.lastOrder : 0,
      CANVAS_SCRIPT_LOAD_INFERRED: Boolean(scripts.canvas && scripts.canvas.present),
      CANVAS_SCRIPT_EXECUTION_INFERRED: Boolean(
        scripts.canvas &&
        scripts.canvas.present &&
        (
          authorities.canvas.observed ||
          Boolean(snapshot.canonicalCanvas) ||
          snapshot.allCanvases.length > 0 ||
          dataValue(snapshot.targetDocument, "hearthCanvasLoaded") === "true"
        )
      ),
      HEX_SURFACE_SCRIPT_PRESENT: scripts.hexSurface ? scripts.hexSurface.present : false,
      HEX_SURFACE_SCRIPT_SRC: scripts.hexSurface ? scripts.hexSurface.src : "NONE",
      POINTER_SURFACE_SCRIPT_PRESENT: scripts.pointerSurface ? scripts.pointerSurface.present : false,
      POINTER_SURFACE_SCRIPT_SRC: scripts.pointerSurface ? scripts.pointerSurface.src : "NONE",

      ROUTE_AUTHORITY_OBSERVED: authorities.route.observed || false,
      ROUTE_AUTHORITY_SCOPE: authorities.route.scope || "NONE",
      ROUTE_AUTHORITY_SOURCE_PATH: authorities.route.path || "NONE",
      ROUTE_AUTHORITY_CONTRACT: authorities.route.contract || "UNKNOWN",
      ROUTE_AUTHORITY_RECEIPT: authorities.route.receipt || "UNKNOWN",
      ROUTE_AUTHORITY_METHOD_COUNT: authorities.route.methodCount || 0,

      CANVAS_AUTHORITY_OBSERVED: authorities.canvas.observed || false,
      CANVAS_AUTHORITY_SCOPE: authorities.canvas.scope || "NONE",
      CANVAS_AUTHORITY_SOURCE_PATH: authorities.canvas.path || "NONE",
      CANVAS_AUTHORITY_CONTRACT: authorities.canvas.contract || "UNKNOWN",
      CANVAS_AUTHORITY_RECEIPT: authorities.canvas.receipt || "UNKNOWN",
      CANVAS_AUTHORITY_METHOD_COUNT: authorities.canvas.methodCount || 0,
      CANVAS_AUTHORITY_METHODS: Array.isArray(authorities.canvas.methods)
        ? authorities.canvas.methods.join(",") || "NONE"
        : "NONE",
      CANVAS_AUTHORITY_CANDIDATE_COUNT: Array.isArray(authorities.canvas.candidates)
        ? authorities.canvas.candidates.length
        : 0,
      CANVAS_AUTHORITY_CANDIDATES: clonePlain(authorities.canvas.candidates || []),

      CONTROL_AUTHORITY_OBSERVED: authorities.controls.observed || false,
      CONTROL_AUTHORITY_SOURCE_PATH: authorities.controls.path || "NONE",
      CONTROL_AUTHORITY_CONTRACT: authorities.controls.contract || "UNKNOWN",
      CONTROL_AUTHORITY_RECEIPT: authorities.controls.receipt || "UNKNOWN",

      HEX_SURFACE_AUTHORITY_OBSERVED: authorities.hexSurface.observed || false,
      HEX_SURFACE_AUTHORITY_SOURCE_PATH: authorities.hexSurface.path || "NONE",
      HEX_SURFACE_AUTHORITY_CONTRACT: authorities.hexSurface.contract || "UNKNOWN",
      HEX_SURFACE_AUTHORITY_RECEIPT: authorities.hexSurface.receipt || "UNKNOWN",
      HEX_SURFACE_AUTHORITY_METHOD_COUNT: authorities.hexSurface.methodCount || 0,

      HEX_AUTHORITY_OBSERVED: authorities.hexAuthority.observed || false,
      HEX_AUTHORITY_SOURCE_PATH: authorities.hexAuthority.path || "NONE",
      HEX_AUTHORITY_CONTRACT: authorities.hexAuthority.contract || "UNKNOWN",
      HEX_AUTHORITY_RECEIPT: authorities.hexAuthority.receipt || "UNKNOWN",

      POINTER_SURFACE_BISHOP_OBSERVED: authorities.pointerSurface.observed || false,
      POINTER_SURFACE_BISHOP_SOURCE_PATH: authorities.pointerSurface.path || "NONE",
      POINTER_SURFACE_BISHOP_CONTRACT: authorities.pointerSurface.contract || "UNKNOWN",
      POINTER_SURFACE_BISHOP_RECEIPT: authorities.pointerSurface.receipt || "UNKNOWN",
      POINTER_INSPECT_PRIEST_OBSERVED: authorities.pointerInspect.observed || false,
      POINTER_INSPECT_PRIEST_SOURCE_PATH: authorities.pointerInspect.path || "NONE",
      POINTER_INSPECT_PRIEST_CONTRACT: authorities.pointerInspect.contract || "UNKNOWN",
      POINTER_INSPECT_PRIEST_RECEIPT: authorities.pointerInspect.receipt || "UNKNOWN",

      STAGE_PRESENT: snapshot.stageFound,
      STAGE_SELECTOR: snapshot.stageSelector,
      STAGE_DESCRIPTOR: snapshot.stageDescriptor,
      STAGE_RECT_NONZERO: snapshot.stageRectNonzero,
      STAGE_RECT_WIDTH: snapshot.stageRectWidth,
      STAGE_RECT_HEIGHT: snapshot.stageRectHeight,
      STAGE_COMPUTED_VISIBLE: snapshot.stageComputedVisible,
      STAGE_COMPUTED_DISPLAY: snapshot.stageComputedDisplay,
      STAGE_COMPUTED_POSITION: snapshot.stageComputedPosition,
      STAGE_COMPUTED_OVERFLOW: snapshot.stageComputedOverflow,

      CANONICAL_MOUNT_SELECTOR,
      CANONICAL_FRAME_SELECTOR,
      CANONICAL_CANVAS_ID,
      CANONICAL_CANVAS_SELECTORS: CANONICAL_CANVAS_SELECTORS.slice(),

      CANONICAL_MOUNT_FOUND: snapshot.canonicalMountFound,
      CANONICAL_MOUNT_DESCRIPTOR: snapshot.canonicalMountDescriptor,
      CANONICAL_MOUNT_RECT_NONZERO: snapshot.canonicalMountRectNonzero,
      CANONICAL_MOUNT_RECT_WIDTH: snapshot.canonicalMountRectWidth,
      CANONICAL_MOUNT_RECT_HEIGHT: snapshot.canonicalMountRectHeight,
      CANONICAL_MOUNT_COMPUTED_VISIBLE: snapshot.canonicalMountComputedVisible,
      CANONICAL_MOUNT_COMPUTED_DISPLAY: snapshot.canonicalMountComputedDisplay,
      CANONICAL_MOUNT_COMPUTED_POSITION: snapshot.canonicalMountComputedPosition,
      CANONICAL_MOUNT_COMPUTED_OVERFLOW: snapshot.canonicalMountComputedOverflow,
      CANONICAL_MOUNT_COMPUTED_CONTAIN: snapshot.canonicalMountComputedContain,
      CANONICAL_MOUNT_COMPUTED_CONTENT_VISIBILITY: snapshot.canonicalMountComputedContentVisibility,
      CANONICAL_MOUNT_COMPUTED_WIDTH: snapshot.canonicalMountComputedWidth,
      CANONICAL_MOUNT_COMPUTED_HEIGHT: snapshot.canonicalMountComputedHeight,

      CANONICAL_FRAME_FOUND: snapshot.canonicalFrameFound,
      CANONICAL_FRAME_DESCRIPTOR: snapshot.canonicalFrameDescriptor,
      CANONICAL_FRAME_RECT_NONZERO: snapshot.canonicalFrameRectNonzero,
      CANONICAL_FRAME_RECT_WIDTH: snapshot.canonicalFrameRectWidth,
      CANONICAL_FRAME_RECT_HEIGHT: snapshot.canonicalFrameRectHeight,
      CANONICAL_FRAME_COMPUTED_VISIBLE: snapshot.canonicalFrameComputedVisible,
      CANONICAL_FRAME_COMPUTED_DISPLAY: snapshot.canonicalFrameComputedDisplay,
      CANONICAL_FRAME_COMPUTED_POSITION: snapshot.canonicalFrameComputedPosition,
      CANONICAL_FRAME_COMPUTED_OVERFLOW: snapshot.canonicalFrameComputedOverflow,
      CANONICAL_FRAME_COMPUTED_CONTAIN: snapshot.canonicalFrameComputedContain,
      CANONICAL_FRAME_COMPUTED_CONTENT_VISIBILITY: snapshot.canonicalFrameComputedContentVisibility,
      CANONICAL_FRAME_COMPUTED_WIDTH: snapshot.canonicalFrameComputedWidth,
      CANONICAL_FRAME_COMPUTED_HEIGHT: snapshot.canonicalFrameComputedHeight,

      CANONICAL_CANVAS_FOUND: Boolean(snapshot.canonicalCanvas),
      CANONICAL_CANVAS_SELECTOR: snapshot.canonicalFound.selector,
      CANONICAL_CANVAS_DESCRIPTOR: canonicalSummary.descriptor || "NONE",
      CANONICAL_CANVAS_INDEX: canonicalSummary.index || 0,
      CANONICAL_CANVAS_IN_CANONICAL_MOUNT: canonicalSummary.inCanonicalMount || false,
      CANONICAL_CANVAS_IN_CANONICAL_FRAME: canonicalSummary.inCanonicalFrame || false,

      CANVAS_ELEMENT_FOUND: Boolean(snapshot.canonicalCanvas),
      CANVAS_DOM_SURFACE_FOUND: Boolean(snapshot.canonicalCanvas),
      CANVAS_SELECTOR: snapshot.canonicalFound.selector,
      CANVAS_MOUNT_FOUND: snapshot.canonicalMountFound,
      CANVAS_MOUNT_SELECTOR: CANONICAL_MOUNT_SELECTOR,
      CANVAS_FRAME_FOUND: snapshot.canonicalFrameFound,
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
      CANONICAL_CANVAS_PIXEL_VISIBLE: canonicalSummary.pixelVisible || false,
      CANONICAL_CANVAS_SURFACE_ADMISSIBLE: snapshot.canonicalSurfaceAdmissible,

      CANONICAL_PARENT_CHAIN_STATUS: chain.status || "UNKNOWN",
      CANONICAL_PARENT_FIRST_COLLAPSED_DEPTH: chain.firstCollapsedDepth,
      CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR: chain.firstCollapsedDescriptor,
      CANONICAL_PARENT_FIRST_COLLAPSED_WIDTH: chain.firstCollapsedWidth,
      CANONICAL_PARENT_FIRST_COLLAPSED_HEIGHT: chain.firstCollapsedHeight,
      CANONICAL_PARENT_FIRST_HIDDEN_DEPTH: chain.firstHiddenDepth,
      CANONICAL_PARENT_FIRST_HIDDEN_DESCRIPTOR: chain.firstHiddenDescriptor,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_DEPTH: chain.firstContainmentRiskDepth,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_DESCRIPTOR: chain.firstContainmentRiskDescriptor,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_CONTAIN: chain.firstContainmentRiskContain,
      CANONICAL_PARENT_FIRST_CONTAINMENT_RISK_CONTENT_VISIBILITY:
        chain.firstContainmentRiskContentVisibility,

      MOUNT_PARENT_CHAIN_STATUS: mountChain.status || "UNKNOWN",
      MOUNT_PARENT_FIRST_COLLAPSED_DEPTH: mountChain.firstCollapsedDepth,
      MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR: mountChain.firstCollapsedDescriptor,
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

      BOUNDARY_DIAGNOSIS_AVAILABLE: true,
      BOUNDARY_DIAGNOSIS_MATRIX_VERSION: boundaryMatrix.matrixVersion,
      BOUNDARY_RELATIONSHIP_COUNT: boundaryMatrix.boundaryRelationshipCount,
      BOUNDARY_CONFIRMED_COUNT: boundaryMatrix.boundaryConfirmedCount,
      BOUNDARY_FAILED_OR_PARTIAL_COUNT: boundaryMatrix.boundaryFailedOrPartialCount,
      BOUNDARY_PARTIAL_COUNT: boundaryMatrix.boundaryPartialCount,
      BOUNDARY_FIRST_FAILED_BOUNDARY: boundaryMatrix.firstFailedBoundary,
      BOUNDARY_FIRST_FAILED_RELATIONSHIP: boundaryMatrix.firstFailedBoundaryRelationship,
      BOUNDARY_FIRST_FAILED_STATUS: boundaryMatrix.firstFailedBoundaryStatus,
      BOUNDARY_FIRST_MISSING_RUNTIME_FACT: boundaryMatrix.firstMissingRuntimeFact,
      BOUNDARY_MISSING_RUNTIME_FACT_LOCATION: boundaryMatrix.missingRuntimeFactLocation,
      BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN: boundaryMatrix.singleCausalFileProven,
      BOUNDARY_PROVEN_CAUSAL_FILE: boundaryMatrix.provenCausalFile,
      BOUNDARY_PROVEN_CAUSAL_REASON: boundaryMatrix.provenCausalReason,
      BOUNDARY_ADJACENT_FILES: adjacentFiles.join(" | ") || "NONE",
      BOUNDARY_MATRIX_SUMMARY_TEXT: boundaryText || "NONE",
      BOUNDARY_MATRIX: clonePlain(boundaryMatrix.rows),
      BOUNDARY_MATRIX_JSON: clonePlain(boundaryMatrix.rows),

      ROUTE_TO_CANVAS_BOUNDARY_STATUS:
        getBoundaryField(boundaryRows, "ROUTE_CONDUCTOR_TO_CANVAS", "boundaryStatus"),
      CANVAS_TO_HEX_SURFACE_BOUNDARY_STATUS:
        getBoundaryField(boundaryRows, "CANVAS_TO_HEX_SURFACE", "boundaryStatus"),
      HEX_SURFACE_TO_POINTER_SURFACE_BOUNDARY_STATUS:
        getBoundaryField(boundaryRows, "HEX_SURFACE_TO_POINTER_SURFACE_BISHOP", "boundaryStatus"),
      POINTER_SURFACE_TO_CANVAS_BOUNDARY_STATUS:
        getBoundaryField(boundaryRows, "POINTER_SURFACE_BISHOP_TO_CANVAS_RETURN", "boundaryStatus"),
      CONTROLS_TO_CANVAS_BOUNDARY_STATUS:
        getBoundaryField(boundaryRows, "CONTROLS_TO_CANVAS", "boundaryStatus"),

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: surfaceVerdict.status,
      CANVAS_SURFACE_TRUTH_LANE_STATUS: surfaceVerdict.clean
        ? "CANVAS_SURFACE_TRUTH_LANE_PASSED_NO_FINAL_CLAIM"
        : "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: surfaceVerdict.clean,

      CANVAS_TRUTH_STATUS: surfaceVerdict.status,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: surfaceVerdict.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: surfaceVerdict.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: surfaceVerdict.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: surfaceVerdict.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      CANVAS_TRUTH_RECOMMENDED_ACTION: surfaceVerdict.action,

      SINGLE_CAUSAL_FILE_PROVEN: false,
      PROVEN_CAUSAL_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      PROVEN_CAUSAL_REASON:
        "DIAGNOSTIC_REPORTS_SURFACE_AND_BOUNDARY_FACTS_NO_SINGLE_FILE_CAUSALITY_PROVEN",
      MISSING_RUNTIME_FACT_LOCATION:
        surfaceVerdict.clean ? boundaryMatrix.missingRuntimeFactLocation : "SURFACE_OR_BOUNDARY_FACTS",
      FINAL_ARBITRATION_SOURCE_LANE:
        "CANONICAL_SURFACE_TRUTH_AND_BOUNDARY_DIAGNOSIS_MATRIX",
      DIAGNOSTIC_CERTAINTY: surfaceVerdict.certainty,
      OBSERVABLE_CAUSE:
        `CANONICAL:${surfaceVerdict.coordinate}:${surfaceVerdict.failureClass}:${surfaceVerdict.reason}`,
      RECOMMENDED_NEXT_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      RECOMMENDED_NEXT_ACTION: "READ_BOUNDARY_DIAGNOSIS_MATRIX_AND_SURFACE_FACTS",

      CANONICAL_CANVAS_SUMMARY: clonePlain(canonicalSummary),
      FIRST_PIXEL_BEARING_CANVAS_SUMMARY: clonePlain(firstPixelBearingSummary),
      PIXEL_BEARING_CANVAS_SUMMARIES: clonePlain(snapshot.pixelBearingSummaries),
      ALL_CANVAS_SUMMARIES: clonePlain(snapshot.allCanvasSummaries),
      CANONICAL_PARENT_CHAIN: clonePlain(snapshot.canonicalParentChain),
      MOUNT_PARENT_CHAIN: clonePlain(snapshot.mountParentChain),

      CONTROL_DUTY_LANE_STATUS: "BOUNDARY_MATRIX_EVALUATED_READ_ONLY",
      DELEGATORY_PERMISSION_LANE_STATUS: "BOUNDARY_MATRIX_EVALUATED_READ_ONLY",
      ROUTE_CONDUCTOR_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      HEX_SURFACE_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      POINTER_SURFACE_LANE_STATUS: "OBSERVED_READ_ONLY_NO_REPAIR",
      TRUTH_HUB_STATUS: "CANONICAL_SURFACE_TRUTH_PLUS_BOUNDARY_DIAGNOSIS_MATRIX",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "2",
      TRUTH_HUB_RECEIPT_ROUTES:
        "CANONICAL_SURFACE_TRUTH_LANE | BOUNDARY_DIAGNOSIS_MATRIX_LANE",

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

  function getBoundaryField(rows, id, field) {
    const row = Array.isArray(rows) ? rows.find((entry) => entry.id === id) : null;
    return row ? row[field] : "UNKNOWN";
  }

  function makeErrorReport(error, payload = {}) {
    const message = bounded(error && error.message ? error.message : error, 1200);

    return {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_ERROR_PACKET_v1_8",
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
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED_WITH_INTERNAL_ERROR_PACKET",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "false",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CALL_GUARDED_CANONICAL_SURFACE_TRUTH_PLUS_BOUNDARY_DIAGNOSIS_MATRIX_ONLY",
      TARGET_CONTEXT_STATUS: "UNKNOWN",
      TARGET_CONTEXT_SOURCE: "UNKNOWN",
      TARGET_ACCESS_ERROR: "UNKNOWN",

      BOUNDARY_DIAGNOSIS_AVAILABLE: false,
      BOUNDARY_DIAGNOSIS_MATRIX_VERSION: "UNAVAILABLE_ERROR_PACKET",
      BOUNDARY_RELATIONSHIP_COUNT: 0,
      BOUNDARY_FIRST_FAILED_BOUNDARY: "PROBE_CALL_GUARD",
      BOUNDARY_FIRST_FAILED_STATUS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      BOUNDARY_FIRST_MISSING_RUNTIME_FACT: message || "UNKNOWN_INTERNAL_ERROR",
      BOUNDARY_MISSING_RUNTIME_FACT_LOCATION: "DIAGNOSTIC_PROBE_CALL_GUARD",
      BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN: false,
      BOUNDARY_PROVEN_CAUSAL_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      BOUNDARY_PROVEN_CAUSAL_REASON: "PROBE_INTERNAL_ERROR_DOES_NOT_PROVE_PRODUCTION_FILE_CAUSALITY",
      BOUNDARY_ADJACENT_FILES: FILE,
      BOUNDARY_MATRIX: [],

      CANVAS_IDENTITY_DISAMBIGUATION_STATUS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_SURFACE_TRUTH_LANE_STATUS: "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: false,

      CANVAS_TRUTH_STATUS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "PROBE_CALL_GUARD",
      CANVAS_TRUTH_FAILURE_CLASS: "PROBE_INTERNAL_ERROR_PACKET_RETURNED",
      CANVAS_TRUTH_FAILURE_REASON: message || "UNKNOWN_INTERNAL_ERROR",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      CANVAS_TRUTH_RECOMMENDED_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      CANVAS_TRUTH_RECOMMENDED_ACTION:
        "RENEW_PROBE_CANVAS_SURFACE_TRUTH_CALL_GUARD_OR_RETURN_PACKET",

      SINGLE_CAUSAL_FILE_PROVEN: false,
      PROVEN_CAUSAL_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      PROVEN_CAUSAL_REASON: "PROBE_INTERNAL_ERROR_DOES_NOT_PROVE_PRODUCTION_FILE_CAUSALITY",
      MISSING_RUNTIME_FACT_LOCATION: "DIAGNOSTIC_PROBE_CALL_GUARD",
      FINAL_ARBITRATION_SOURCE_LANE:
        "CALL_GUARDED_BOUNDARY_DIAGNOSIS_MATRIX_ERROR_PACKET",
      DIAGNOSTIC_CERTAINTY: "DEFINITIVE_PROBE_INTERNAL_ERROR",
      OBSERVABLE_CAUSE: `PROBE_CALL_GUARD:${message || "UNKNOWN_INTERNAL_ERROR"}`,
      RECOMMENDED_NEXT_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
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
        "V1_8_CALL_GUARD_RETURNED_ERROR_PACKET | NO_THROW_TO_NORTH | NO_SINGLE_FILE_CAUSALITY_CLAIMED | NO_PRODUCTION_MUTATION_AUTHORIZED",
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
        root.HEARTH_DIAGNOSTIC_CANVAS_BOUNDARY_DIAGNOSIS_MATRIX_SETTLED_REPORT =
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
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_ANCHOR_PACKET_v1_8",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      LINEAGE_V1_6_CONTRACT,
      LINEAGE_V1_5_CONTRACT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_CANVAS_RENEWAL_CANDIDATE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "ANCHOR_READY",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "UNKNOWN",
      CANVAS_SURFACE_TRUTH_SCOPE:
        "CALL_GUARDED_CANONICAL_SURFACE_TRUTH_PLUS_BOUNDARY_DIAGNOSIS_MATRIX_ONLY",
      TARGET_CONTEXT_STATUS: "NOT_RUN",
      TARGET_CONTEXT_SOURCE: "ANCHOR_ONLY",
      TARGET_ACCESS_ERROR: "NONE",

      NEWS_ALIGNMENT_PROTOCOL_ACTIVE: true,
      NEWS_ALIGNMENT_STATUS: "ANCHOR_READY",
      FIBONACCI_SYNCHRONIZATION_ACTIVE: true,
      FIBONACCI_CURRENT_STAGE: "F1_ANCHOR",

      BOUNDARY_DIAGNOSIS_AVAILABLE: true,
      BOUNDARY_DIAGNOSIS_MATRIX_VERSION: "HEARTH_BOUNDARY_DIAGNOSIS_MATRIX_v1_8",
      BOUNDARY_RELATIONSHIP_COUNT: 5,
      BOUNDARY_FIRST_FAILED_BOUNDARY: "NOT_RUN",
      BOUNDARY_FIRST_FAILED_STATUS: "NOT_RUN",
      BOUNDARY_FIRST_MISSING_RUNTIME_FACT: "ANCHOR_ONLY",
      BOUNDARY_MISSING_RUNTIME_FACT_LOCATION: "NOT_RUN",
      BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN: false,
      BOUNDARY_PROVEN_CAUSAL_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      BOUNDARY_PROVEN_CAUSAL_REASON: "ANCHOR_ONLY",
      BOUNDARY_ADJACENT_FILES: "NONE",
      BOUNDARY_MATRIX: [],

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
      CANVAS_TRUTH_RECOMMENDED_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      CANVAS_TRUTH_RECOMMENDED_ACTION: "CALL_runProbeCanvasSurfaceTruth",

      SINGLE_CAUSAL_FILE_PROVEN: false,
      PROVEN_CAUSAL_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      PROVEN_CAUSAL_REASON: "ANCHOR_ONLY",
      MISSING_RUNTIME_FACT_LOCATION: "NOT_RUN",
      RECOMMENDED_NEXT_FILE: "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN",
      RECOMMENDED_NEXT_ACTION: "CALL_runProbeCanvasSurfaceTruth",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "V1_8_ANCHOR_READY | BOUNDARY_DIAGNOSIS_MATRIX_READY | CALL_GUARDED | TARGET_NOT_YET_PROBED | NO_PRODUCTION_MUTATION_AUTHORIZED",
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
        "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_BOUNDARY_DIAGNOSIS_MATRIX_RECEIPT_PACKET_v1_8",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageV16Contract: LINEAGE_V1_6_CONTRACT,
      lineageV15Contract: LINEAGE_V1_5_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      pointerSurfaceFile: POINTER_SURFACE_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,

      diagnosticOnly: true,
      anchorSafeChronologyObservation: true,
      callGuardActive: true,
      layoutMathArbitrationActive: true,
      connectionArbitrationActive: true,
      blindSpotArbitrationActive: true,
      canonicalVisibleSurfaceDisambiguationActive: true,
      transitionSurfaceDisambiguationActive: true,
      flashToFallbackMeasurementActive: true,
      boundaryDiagnosisMatrixActive: true,
      oneBoundaryOneRow: true,
      oneMissingProofOneMissingFact: true,
      noSingleFileRecommendationUnlessProven: true,

      canvasSurfaceTruthProbeStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY"),
      targetContextStatus: getRaw(r, "TARGET_CONTEXT_STATUS", "UNKNOWN"),
      targetContextSource: getRaw(r, "TARGET_CONTEXT_SOURCE", "UNKNOWN"),

      boundaryDiagnosisAvailable: getRaw(r, "BOUNDARY_DIAGNOSIS_AVAILABLE", true),
      boundaryDiagnosisMatrixVersion: getRaw(r, "BOUNDARY_DIAGNOSIS_MATRIX_VERSION", "HEARTH_BOUNDARY_DIAGNOSIS_MATRIX_v1_8"),
      boundaryRelationshipCount: getRaw(r, "BOUNDARY_RELATIONSHIP_COUNT", 5),
      boundaryConfirmedCount: getRaw(r, "BOUNDARY_CONFIRMED_COUNT", 0),
      boundaryFailedOrPartialCount: getRaw(r, "BOUNDARY_FAILED_OR_PARTIAL_COUNT", 0),
      boundaryFirstFailedBoundary: getRaw(r, "BOUNDARY_FIRST_FAILED_BOUNDARY", "UNKNOWN"),
      boundaryFirstFailedRelationship: getRaw(r, "BOUNDARY_FIRST_FAILED_RELATIONSHIP", "UNKNOWN"),
      boundaryFirstFailedStatus: getRaw(r, "BOUNDARY_FIRST_FAILED_STATUS", "UNKNOWN"),
      boundaryFirstMissingRuntimeFact: getRaw(r, "BOUNDARY_FIRST_MISSING_RUNTIME_FACT", "UNKNOWN"),
      boundaryMissingRuntimeFactLocation: getRaw(r, "BOUNDARY_MISSING_RUNTIME_FACT_LOCATION", "UNKNOWN"),
      boundarySingleCausalFileProven: getRaw(r, "BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN", false),
      boundaryProvenCausalFile: getRaw(r, "BOUNDARY_PROVEN_CAUSAL_FILE", "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN"),
      boundaryAdjacentFiles: getRaw(r, "BOUNDARY_ADJACENT_FILES", "NONE"),

      transitionMeasurementMode: getRaw(r, "TRANSITION_MEASUREMENT_MODE", "UNKNOWN"),
      transitionSamplePhase: getRaw(r, "TRANSITION_SAMPLE_PHASE", "UNKNOWN"),
      transitionSettledSampleScheduled: getRaw(r, "TRANSITION_SETTLED_SAMPLE_SCHEDULED", false),
      transitionSettledSampleAvailable: Boolean(lastSettledReport),
      transitionComparisonStatus: getRaw(r, "TRANSITION_COMPARISON_STATUS", "UNKNOWN"),
      transitionComparisonClass: getRaw(r, "TRANSITION_COMPARISON_CLASS", "UNKNOWN"),
      transitionComparisonReason: getRaw(r, "TRANSITION_COMPARISON_REASON", "UNKNOWN"),

      canvasScriptPresent: getRaw(r, "CANVAS_SCRIPT_PRESENT", "UNKNOWN"),
      canvasScriptExecutionInferred: getRaw(r, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN"),
      canvasAuthorityObserved: getRaw(r, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN"),
      canvasAuthoritySourcePath: getRaw(r, "CANVAS_AUTHORITY_SOURCE_PATH", "NONE"),
      canvasAuthorityContract: getRaw(r, "CANVAS_AUTHORITY_CONTRACT", "UNKNOWN"),

      canonicalMountFound: getRaw(r, "CANONICAL_MOUNT_FOUND", "UNKNOWN"),
      canonicalMountRectNonzero: getRaw(r, "CANONICAL_MOUNT_RECT_NONZERO", "UNKNOWN"),
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

      canonicalParentChainStatus: getRaw(r, "CANONICAL_PARENT_CHAIN_STATUS", "UNKNOWN"),
      canonicalParentFirstCollapsedDescriptor:
        getRaw(r, "CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN"),
      mountParentChainStatus: getRaw(r, "MOUNT_PARENT_CHAIN_STATUS", "UNKNOWN"),
      mountParentFirstCollapsedDescriptor:
        getRaw(r, "MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR", "UNKNOWN"),

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
      canvasTruthRecommendedFile: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_FILE", "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN"),
      canvasTruthRecommendedAction: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN"),
      singleCausalFileProven: getRaw(r, "SINGLE_CAUSAL_FILE_PROVEN", false),
      provenCausalFile: getRaw(r, "PROVEN_CAUSAL_FILE", "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN"),
      missingRuntimeFactLocation: getRaw(r, "MISSING_RUNTIME_FACT_LOCATION", "UNKNOWN"),
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
      "POINTER_BOUNDARY_FILE",
      "POINTER_LIGHT_FILE",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_CANVAS_RENEWAL_CANDIDATE",
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_SURFACE_TRUTH_AVAILABLE",
      "CANVAS_SURFACE_TRUTH_SCOPE",
      "CANVAS_SURFACE_TRUTH_RENEWAL_FOCUS",

      "NEWS_ALIGNMENT_PROTOCOL_ACTIVE",
      "NEWS_ALIGNMENT_STATUS",
      "FIBONACCI_SYNCHRONIZATION_ACTIVE",
      "FIBONACCI_CURRENT_STAGE",

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

      "INDEX_SCRIPT_PRESENT",
      "INDEX_SCRIPT_SRC",
      "ROUTE_CONDUCTOR_SCRIPT_PRESENT",
      "ROUTE_CONDUCTOR_SCRIPT_SRC",
      "CONTROL_SCRIPT_PRESENT",
      "CONTROL_SCRIPT_SRC",
      "CANVAS_SCRIPT_PRESENT",
      "CANVAS_SCRIPT_COUNT",
      "CANVAS_SCRIPT_SRC",
      "CANVAS_SCRIPT_CACHE_KEY",
      "CANVAS_SCRIPT_TAG_ORDER",
      "CANVAS_SCRIPT_LOAD_INFERRED",
      "CANVAS_SCRIPT_EXECUTION_INFERRED",
      "HEX_SURFACE_SCRIPT_PRESENT",
      "HEX_SURFACE_SCRIPT_SRC",
      "POINTER_SURFACE_SCRIPT_PRESENT",
      "POINTER_SURFACE_SCRIPT_SRC",

      "ROUTE_AUTHORITY_OBSERVED",
      "ROUTE_AUTHORITY_SOURCE_PATH",
      "ROUTE_AUTHORITY_CONTRACT",
      "ROUTE_AUTHORITY_RECEIPT",
      "CANVAS_AUTHORITY_OBSERVED",
      "CANVAS_AUTHORITY_SCOPE",
      "CANVAS_AUTHORITY_SOURCE_PATH",
      "CANVAS_AUTHORITY_CONTRACT",
      "CANVAS_AUTHORITY_RECEIPT",
      "CANVAS_AUTHORITY_METHOD_COUNT",
      "CONTROL_AUTHORITY_OBSERVED",
      "CONTROL_AUTHORITY_SOURCE_PATH",
      "CONTROL_AUTHORITY_CONTRACT",
      "HEX_SURFACE_AUTHORITY_OBSERVED",
      "HEX_SURFACE_AUTHORITY_SOURCE_PATH",
      "HEX_SURFACE_AUTHORITY_CONTRACT",
      "HEX_SURFACE_AUTHORITY_METHOD_COUNT",
      "HEX_AUTHORITY_OBSERVED",
      "HEX_AUTHORITY_SOURCE_PATH",
      "HEX_AUTHORITY_CONTRACT",
      "POINTER_SURFACE_BISHOP_OBSERVED",
      "POINTER_SURFACE_BISHOP_SOURCE_PATH",
      "POINTER_SURFACE_BISHOP_CONTRACT",
      "POINTER_INSPECT_PRIEST_OBSERVED",
      "POINTER_INSPECT_PRIEST_SOURCE_PATH",
      "POINTER_INSPECT_PRIEST_CONTRACT",

      "STAGE_PRESENT",
      "STAGE_SELECTOR",
      "STAGE_DESCRIPTOR",
      "STAGE_RECT_NONZERO",
      "STAGE_RECT_WIDTH",
      "STAGE_RECT_HEIGHT",

      "CANONICAL_MOUNT_SELECTOR",
      "CANONICAL_FRAME_SELECTOR",
      "CANONICAL_CANVAS_ID",
      "CANONICAL_CANVAS_SELECTORS",

      "CANONICAL_MOUNT_FOUND",
      "CANONICAL_MOUNT_DESCRIPTOR",
      "CANONICAL_MOUNT_RECT_NONZERO",
      "CANONICAL_MOUNT_RECT_WIDTH",
      "CANONICAL_MOUNT_RECT_HEIGHT",
      "CANONICAL_MOUNT_COMPUTED_VISIBLE",
      "CANONICAL_MOUNT_COMPUTED_DISPLAY",
      "CANONICAL_MOUNT_COMPUTED_POSITION",
      "CANONICAL_MOUNT_COMPUTED_OVERFLOW",
      "CANONICAL_MOUNT_COMPUTED_CONTAIN",
      "CANONICAL_MOUNT_COMPUTED_CONTENT_VISIBILITY",
      "CANONICAL_MOUNT_COMPUTED_WIDTH",
      "CANONICAL_MOUNT_COMPUTED_HEIGHT",

      "CANONICAL_FRAME_FOUND",
      "CANONICAL_FRAME_DESCRIPTOR",
      "CANONICAL_FRAME_RECT_NONZERO",
      "CANONICAL_FRAME_RECT_WIDTH",
      "CANONICAL_FRAME_RECT_HEIGHT",
      "CANONICAL_FRAME_COMPUTED_VISIBLE",
      "CANONICAL_FRAME_COMPUTED_DISPLAY",
      "CANONICAL_FRAME_COMPUTED_POSITION",
      "CANONICAL_FRAME_COMPUTED_OVERFLOW",
      "CANONICAL_FRAME_COMPUTED_CONTAIN",
      "CANONICAL_FRAME_COMPUTED_CONTENT_VISIBILITY",
      "CANONICAL_FRAME_COMPUTED_WIDTH",
      "CANONICAL_FRAME_COMPUTED_HEIGHT",

      "CANONICAL_CANVAS_FOUND",
      "CANONICAL_CANVAS_SELECTOR",
      "CANONICAL_CANVAS_DESCRIPTOR",
      "CANONICAL_CANVAS_INDEX",
      "CANONICAL_CANVAS_IN_CANONICAL_MOUNT",
      "CANONICAL_CANVAS_IN_CANONICAL_FRAME",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_DOM_SURFACE_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_FRAME_FOUND",
      "CANVAS_FRAME_SELECTOR",
      "CANVAS_IN_MOUNT",
      "CANVAS_IN_FRAME",

      "CANVAS_WIDTH_ATTRIBUTE",
      "CANVAS_HEIGHT_ATTRIBUTE",
      "CANVAS_INTERNAL_SIZE_NONZERO",
      "CANVAS_RECT_LEFT",
      "CANVAS_RECT_TOP",
      "CANVAS_RECT_RIGHT",
      "CANVAS_RECT_BOTTOM",
      "CANVAS_RECT_WIDTH",
      "CANVAS_RECT_HEIGHT",
      "CANVAS_RECT_NONZERO",

      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_COMPUTED_DISPLAY",
      "CANVAS_COMPUTED_VISIBILITY",
      "CANVAS_COMPUTED_OPACITY",
      "CANVAS_COMPUTED_POSITION",
      "CANVAS_COMPUTED_Z_INDEX",
      "CANVAS_COMPUTED_POINTER_EVENTS",
      "CANVAS_COMPUTED_TRANSFORM",
      "CANVAS_COMPUTED_OVERFLOW",
      "CANVAS_COMPUTED_CONTAIN",
      "CANVAS_COMPUTED_CONTENT_VISIBILITY",
      "CANVAS_COMPUTED_WIDTH",
      "CANVAS_COMPUTED_HEIGHT",
      "CANVAS_COMPUTED_MIN_WIDTH",
      "CANVAS_COMPUTED_MIN_HEIGHT",
      "CANVAS_COMPUTED_FLEX",
      "CANVAS_COMPUTED_FLEX_BASIS",
      "CANVAS_COMPUTED_BOX_SIZING",

      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_CONTEXT_2D_STATUS",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_SAMPLE_READABLE",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_PIXEL_SAMPLE_COUNT",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_UNIQUE_COLOR_COUNT",
      "CANVAS_PIXEL_AVERAGE_BRIGHTNESS",
      "CANVAS_PIXEL_SAMPLE_REASON",

      "CANONICAL_PARENT_CHAIN_STATUS",
      "CANONICAL_PARENT_FIRST_COLLAPSED_DEPTH",
      "CANONICAL_PARENT_FIRST_COLLAPSED_DESCRIPTOR",
      "CANONICAL_PARENT_FIRST_COLLAPSED_WIDTH",
      "CANONICAL_PARENT_FIRST_COLLAPSED_HEIGHT",
      "MOUNT_PARENT_CHAIN_STATUS",
      "MOUNT_PARENT_FIRST_COLLAPSED_DEPTH",
      "MOUNT_PARENT_FIRST_COLLAPSED_DESCRIPTOR",

      "FALLBACK_OR_CARTOON_SIGNAL_OBSERVED",
      "FALLBACK_OR_CARTOON_SIGNAL_BASIS",
      "CANVAS_LAYER_CHECK_STATUS",
      "CANVAS_LAYER_CENTER_ELEMENT_DESCRIPTOR",
      "CANVAS_LAYER_POSSIBLE_BLOCKER",

      "TOTAL_CANVAS_COUNT",
      "PIXEL_BEARING_CANVAS_FOUND",
      "PIXEL_BEARING_CANVAS_COUNT",
      "PIXEL_BEARING_CANVAS_IS_CANONICAL",
      "PIXEL_BEARING_CANVAS_SELECTOR",
      "PIXEL_BEARING_CANVAS_DESCRIPTOR",
      "NON_CANONICAL_PIXEL_BEARING_CANVAS_COUNT",

      "BOUNDARY_DIAGNOSIS_AVAILABLE",
      "BOUNDARY_DIAGNOSIS_MATRIX_VERSION",
      "BOUNDARY_RELATIONSHIP_COUNT",
      "BOUNDARY_CONFIRMED_COUNT",
      "BOUNDARY_FAILED_OR_PARTIAL_COUNT",
      "BOUNDARY_FIRST_FAILED_BOUNDARY",
      "BOUNDARY_FIRST_FAILED_RELATIONSHIP",
      "BOUNDARY_FIRST_FAILED_STATUS",
      "BOUNDARY_FIRST_MISSING_RUNTIME_FACT",
      "BOUNDARY_MISSING_RUNTIME_FACT_LOCATION",
      "BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN",
      "BOUNDARY_PROVEN_CAUSAL_FILE",
      "BOUNDARY_PROVEN_CAUSAL_REASON",
      "BOUNDARY_ADJACENT_FILES",
      "BOUNDARY_MATRIX_SUMMARY_TEXT",
      "ROUTE_TO_CANVAS_BOUNDARY_STATUS",
      "CANVAS_TO_HEX_SURFACE_BOUNDARY_STATUS",
      "HEX_SURFACE_TO_POINTER_SURFACE_BOUNDARY_STATUS",
      "POINTER_SURFACE_TO_CANVAS_BOUNDARY_STATUS",
      "CONTROLS_TO_CANVAS_BOUNDARY_STATUS",

      "CANVAS_IDENTITY_DISAMBIGUATION_STATUS",
      "CANVAS_SURFACE_TRUTH_LANE_STATUS",
      "CANVAS_SURFACE_TRUTH_LANE_CLEAN",
      "CANVAS_TRUTH_STATUS",
      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",

      "SINGLE_CAUSAL_FILE_PROVEN",
      "PROVEN_CAUSAL_FILE",
      "PROVEN_CAUSAL_REASON",
      "MISSING_RUNTIME_FACT_LOCATION",
      "FINAL_ARBITRATION_SOURCE_LANE",
      "DIAGNOSTIC_CERTAINTY",
      "OBSERVABLE_CAUSE",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",

      "CONTROL_DUTY_LANE_STATUS",
      "DELEGATORY_PERMISSION_LANE_STATUS",
      "ROUTE_CONDUCTOR_LANE_STATUS",
      "HEX_SURFACE_LANE_STATUS",
      "POINTER_SURFACE_LANE_STATUS",
      "TRUTH_HUB_STATUS",
      "TRUTH_HUB_RECEIPT_LANE_COUNT",
      "TRUTH_HUB_RECEIPT_ROUTES",

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
      line("TRANSITION_COMPARISON_STATUS", getRaw(report, "TRANSITION_COMPARISON_STATUS", "UNKNOWN")),
      line("CANVAS_IDENTITY_DISAMBIGUATION_STATUS", getRaw(report, "CANVAS_IDENTITY_DISAMBIGUATION_STATUS", "UNKNOWN")),
      line("CANONICAL_MOUNT_FOUND", getRaw(report, "CANONICAL_MOUNT_FOUND", "UNKNOWN")),
      line("CANONICAL_MOUNT_RECT_NONZERO", getRaw(report, "CANONICAL_MOUNT_RECT_NONZERO", "UNKNOWN")),
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
      line("BOUNDARY_FIRST_FAILED_BOUNDARY", getRaw(report, "BOUNDARY_FIRST_FAILED_BOUNDARY", "UNKNOWN")),
      line("BOUNDARY_FIRST_FAILED_STATUS", getRaw(report, "BOUNDARY_FIRST_FAILED_STATUS", "UNKNOWN")),
      line("BOUNDARY_FIRST_MISSING_RUNTIME_FACT", getRaw(report, "BOUNDARY_FIRST_MISSING_RUNTIME_FACT", "UNKNOWN")),
      line("BOUNDARY_MISSING_RUNTIME_FACT_LOCATION", getRaw(report, "BOUNDARY_MISSING_RUNTIME_FACT_LOCATION", "UNKNOWN")),
      line("BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN", getRaw(report, "BOUNDARY_SINGLE_CAUSAL_FILE_PROVEN", false)),
      line("BOUNDARY_PROVEN_CAUSAL_FILE", getRaw(report, "BOUNDARY_PROVEN_CAUSAL_FILE", "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN")),
      line("BOUNDARY_ADJACENT_FILES", getRaw(report, "BOUNDARY_ADJACENT_FILES", "NONE")),
      line("CANVAS_TRUTH_FIRST_FAILED_COORDINATE", getRaw(report, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getRaw(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_REASON", getRaw(report, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_FILE", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_FILE", "NONE_SINGLE_CAUSAL_FILE_NOT_PROVEN")),
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
      boundaryMatrix: clonePlain(getRaw(report, "BOUNDARY_MATRIX", [])),
      canonicalCanvasSummary: clonePlain(getRaw(report, "CANONICAL_CANVAS_SUMMARY", {})),
      firstPixelBearingCanvasSummary: clonePlain(getRaw(report, "FIRST_PIXEL_BEARING_CANVAS_SUMMARY", {})),
      pixelBearingCanvasSummaries: clonePlain(getRaw(report, "PIXEL_BEARING_CANVAS_SUMMARIES", [])),
      allCanvasSummaries: clonePlain(getRaw(report, "ALL_CANVAS_SUMMARIES", [])),
      canonicalParentChain: clonePlain(getRaw(report, "CANONICAL_PARENT_CHAIN", [])),
      mountParentChain: clonePlain(getRaw(report, "MOUNT_PARENT_CHAIN", [])),
      canvasAuthorityCandidates: clonePlain(getRaw(report, "CANVAS_AUTHORITY_CANDIDATES", [])),
      canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS.slice(),
      routeAuthorityAliases: ROUTE_AUTHORITY_ALIASES.slice(),
      canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES.slice(),
      controlAuthorityAliases: CONTROL_AUTHORITY_ALIASES.slice(),
      hexSurfaceAliases: HEX_SURFACE_ALIASES.slice(),
      pointerSurfaceAliases: POINTER_SURFACE_ALIASES.slice(),
      supportsCallGuardedReturnPacket: true,
      supportsLayoutMathArbitration: true,
      supportsConnectionArbitration: true,
      supportsBlindSpotArbitration: true,
      supportsCanonicalVisibleSurfaceDisambiguation: true,
      supportsTransitionSurfaceDisambiguation: true,
      supportsFlashToFallbackMeasurement: true,
      supportsPixelBearingCanvasIdentityCheck: true,
      supportsCanonicalZeroRectCheck: true,
      supportsParentChainCollapseCheck: true,
      supportsCanonicalBlankPixelCheck: true,
      supportsLayerBlockerCheck: true,
      supportsFallbackCartoonSignalCheck: true,
      supportsBoundaryDiagnosisMatrix: true,
      supportsOneBoundaryOneRow: true,
      supportsMissingRuntimeFactLocation: true,
      supportsSingleFileCausalitySuppression: true,
      supportsSimplifiedF21Focus: true,
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
      "HEARTH.diagnosticCanvasBoundaryDiagnosisMatrix",
      "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
      "DEXTER_LAB.hearthDiagnosticCanvasTruthProbe",
      "DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanonicalCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasLayoutMathConnectionBlindspot",
      "DEXTER_LAB.hearthDiagnosticCanvasBoundaryDiagnosisMatrix",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT",
      "HEARTH_DIAGNOSTIC_CANVAS_BOUNDARY_DIAGNOSIS_MATRIX"
    ];

    for (const path of aliasPaths) setPath(path, api);

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_BOUNDARY_DIAGNOSIS_MATRIX_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_LAYOUT_MATH_CONNECTION_BLINDSPOT_REPORT =
      clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_BOUNDARY_DIAGNOSIS_MATRIX_REPORT =
      clonePlain(lastReport || makeAnchorReport());

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_BOUNDARY_DIAGNOSIS_MATRIX_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_COMPACT_SUMMARY =
      lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_BOUNDARY_DIAGNOSIS_MATRIX_COMPACT_SUMMARY =
      lastCompactSummary || "";

    if (lastSettledReport) {
      root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
        clonePlain(lastSettledReport);
      root.HEARTH_DIAGNOSTIC_CANONICAL_CANVAS_SURFACE_TRUTH_SETTLED_REPORT =
        clonePlain(lastSettledReport);
      root.HEARTH_DIAGNOSTIC_CANVAS_BOUNDARY_DIAGNOSIS_MATRIX_SETTLED_REPORT =
        clonePlain(lastSettledReport);
    }

    try {
      if (root.document && root.document.documentElement && root.document.documentElement.dataset) {
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthProbeContract = CONTRACT;
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthProbeRenewalContract =
          INTERNAL_RENEWAL_CONTRACT;
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthProbeStatus =
          getRaw(lastReport || {}, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasSurfaceTruthFailureClass =
          getRaw(lastReport || {}, "CANVAS_TRUTH_FAILURE_CLASS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanonicalCanvasSurfaceTruthStatus =
          getRaw(lastReport || {}, "CANVAS_IDENTITY_DISAMBIGUATION_STATUS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasTransitionComparisonStatus =
          getRaw(lastReport || {}, "TRANSITION_COMPARISON_STATUS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasLayoutMathCoordinate =
          getRaw(lastReport || {}, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasBoundaryDiagnosisStatus =
          getRaw(lastReport || {}, "BOUNDARY_FIRST_FAILED_STATUS", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasBoundaryFirstFailed =
          getRaw(lastReport || {}, "BOUNDARY_FIRST_FAILED_BOUNDARY", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasBoundaryMissingRuntimeFact =
          getRaw(lastReport || {}, "BOUNDARY_FIRST_MISSING_RUNTIME_FACT", "ANCHOR_READY");
        root.document.documentElement.dataset.hearthDiagnosticCanvasSingleCausalFileProven =
          String(getRaw(lastReport || {}, "SINGLE_CAUSAL_FILE_PROVEN", false));
      }
    } catch (_error) {}

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
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedCanvasRenewalCandidate: EXPECTED_CANVAS_RENEWAL_CANDIDATE,

    diagnosticOnly: true,
    anchorSafeChronologyObservation: true,
    callGuardActive: true,
    layoutMathArbitrationActive: true,
    connectionArbitrationActive: true,
    blindSpotArbitrationActive: true,
    canonicalVisibleSurfaceDisambiguationActive: true,
    transitionSurfaceDisambiguationActive: true,
    flashToFallbackMeasurementActive: true,
    boundaryDiagnosisMatrixActive: true,
    oneBoundaryOneRow: true,
    oneMissingProofOneMissingFact: true,
    noSingleFileRecommendationUnlessProven: true,
    focusedOnCanonicalCanvasIdentity: true,
    controlsDutyLaneEvaluated: true,
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
    canonicalCanvasId: CANONICAL_CANVAS_ID,
    canonicalCanvasSelectors: CANONICAL_CANVAS_SELECTORS,
    routeAuthorityAliases: ROUTE_AUTHORITY_ALIASES,
    canvasAuthorityAliases: CANVAS_AUTHORITY_ALIASES,
    controlAuthorityAliases: CONTROL_AUTHORITY_ALIASES,
    hexSurfaceAliases: HEX_SURFACE_ALIASES,
    hexAuthorityAliases: HEX_AUTHORITY_ALIASES,
    pointerSurfaceAliases: POINTER_SURFACE_ALIASES,
    pointerInspectAliases: POINTER_INSPECT_ALIASES,

    supportsCallGuardedReturnPacket: true,
    supportsLayoutMathArbitration: true,
    supportsConnectionArbitration: true,
    supportsBlindSpotArbitration: true,
    supportsCanonicalVisibleSurfaceDisambiguation: true,
    supportsTransitionSurfaceDisambiguation: true,
    supportsFlashToFallbackMeasurement: true,
    supportsPixelBearingCanvasIdentityCheck: true,
    supportsCanonicalZeroRectCheck: true,
    supportsParentChainCollapseCheck: true,
    supportsCanonicalBlankPixelCheck: true,
    supportsLayerBlockerCheck: true,
    supportsFallbackCartoonSignalCheck: true,
    supportsBoundaryDiagnosisMatrix: true,
    supportsOneBoundaryOneRow: true,
    supportsMissingRuntimeFactLocation: true,
    supportsSingleFileCausalitySuppression: true,
    supportsCoordinateSpecificFailure: true,
    supportsCompactPacketText: true,
    supportsSimplifiedF21Focus: true,

    ownsDiagnosticProbeOnly: true,
    ownsBoundaryDiagnosisOnly: true,
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
