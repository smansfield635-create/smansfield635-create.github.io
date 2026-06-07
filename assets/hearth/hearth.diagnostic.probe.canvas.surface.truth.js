// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_TNT_v1_4
// Full-file replacement.
// Diagnostic-only Canvas surface truth / route-conductor admission / controls-duty forensics probe.
// Purpose:
// - Preserve the existing NORTH-facing Canvas surface truth probe contract.
// - Publish F21 diagnostic authority synchronously before target probing.
// - Preserve anchor-safe chronology behavior.
// - Preserve four-lane receipt-hub compatibility.
// - Preserve route-conductor admission forensics from v1_3.
// - Add a passive Controls duty lane without mutating Controls, Canvas, Hex, Route, Pointer Finger, or production state.
// - Distinguish:
//   1. CANVAS_SCRIPT_NOT_PRESENT
//   2. CANVAS_SCRIPT_PRESENT_BUT_AUTHORITY_NOT_PUBLISHED
//   3. CANVAS_AUTHORITY_PRESENT_BUT_DOM_SURFACE_NOT_BOUND
//   4. ROUTE_CONDUCTOR_ADMISSION_RESULT_NOT_EXPORTED
//   5. CONTROLS_AUTHORITY_NOT_OBSERVED
//   6. CONTROLS_HANDSHAKE_ACCEPTED_BUT_INPUT_NOT_BOUND
//   7. CONTROLS_DELTA_OBSERVED_BUT_CANVAS_DELIVERY_NOT_CONFIRMED
//   8. CONTROLS_READY_BUT_NOT_EXERCISED
// - Report whether Controls merely handshakes, is armed, is bound, is publishing packets,
//   is delivering to Canvas, and is exposing duty counters.
// - Keep Controls duty as a parallel lane unless Canvas surface truth passes and the only remaining
//   measurable failed coordinate is view/input duty.
// - Do not create, draw, repair, release, restart, invoke lifecycle methods, dispatch input,
//   or mutate production state.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_TNT_v1_4";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_RECEIPT_v1_4";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ROUTE_CONDUCTOR_ADMISSION_FORENSICS_TNT_v1_3";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ROUTE_CONDUCTOR_ADMISSION_FORENSICS_RECEIPT_v1_3";

  const LINEAGE_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ANCHOR_SAFE_COORDINATE_LADDER_TNT_v1_2";
  const LINEAGE_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ANCHOR_SAFE_COORDINATE_LADDER_RECEIPT_v1_2";

  const VERSION =
    "2026-06-07.hearth-diagnostic-probe-canvas-surface-truth-controls-duty-lane-v1-4";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_LAUNCH_FILE = "/assets/hearth/hearth.canvas.launch.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const SOUTH_SURFACE_POINTER_FILE =
    "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_ROUTE_CONDUCTOR_INTERNAL_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CONTROL_INTERNAL_CONTRACT =
    "HEARTH_CONTROLS_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v5";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4",
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4",
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
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

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    EXPECTED_ROUTE_CONDUCTOR_INTERNAL_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN_TNT_v10_7",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION_TNT_v10_5",
    "HEARTH_ROUTE_CONDUCTOR_BILATERAL_TRIANGLE_SCAN_CANVAS_PLATTER_PACKET_BRIDGE_TNT_v10_4",
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION_TNT_v10_2",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const ACCEPTED_CONTROL_CONTRACTS = Object.freeze([
    EXPECTED_CONTROL_CONTRACT,
    EXPECTED_CONTROL_INTERNAL_CONTRACT,
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
    "HEARTH_CONTROLS_QUEEN_WEST_GATE_HIERARCHY_SUPERCONDUCTOR_VIEW_INPUT_BRIDGE_TNT_v2"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
    f55ClaimedByTruthHub: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
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
    F21_CLAIMED_BY_PROBE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F55_CLAIMED_BY_TRUTH_HUB: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "#hearthCanvasMount canvas",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "[data-hearth-canvas-mount] canvas",
    "[data-hearth-expression-mount] canvas",
    "canvas"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "[data-hearth-full-planet-visibility-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "[data-hearth-expression-stage]",
    "main",
    "body"
  ]);

  const ROUTE_CONDUCTOR_ALIASES = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HearthRouteConductor",
    "HEARTH_SOUTH_ROUTE_CONDUCTOR",
    "HEARTH_ROUTE_CONDUCTOR_PRIMARY_GATE",
    "HEARTH_ROUTE_NORTH_BISHOP",
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC",
    "HEARTH_ROUTE_CONDUCTOR_PASSIVE_UI_SAFE_MANUAL_SCAN",
    "HEARTH_ROUTE_CONDUCTOR_SAFE_PACKET_BRIDGE_NO_LIFECYCLE_IGNITION",
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF",
    "HEARTH_ROUTE_CONDUCTOR_HEX_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE",
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
    "HEARTH.routeConductor",
    "HEARTH.southRouteConductor",
    "HEARTH.routeConductorPrimaryGate",
    "HEARTH.routeNorthBishop",
    "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
    "HEARTH.routeConductorPassiveUiSafeManualScan",
    "HEARTH.routeConductorSafePacketBridgeNoLifecycleIgnition",
    "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoff",
    "HEARTH.routeConductorHexGatePointerFingerTransmission",
    "HEARTH.routeConductorCanvasDomSurfaceAdmissionAndRelease",
    "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthSouthRouteConductor",
    "DEXTER_LAB.hearthRouteConductorPrimaryGate",
    "DEXTER_LAB.hearthRouteNorthBishop",
    "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
    "DEXTER_LAB.hearthRouteConductorPassiveUiSafeManualScan",
    "DEXTER_LAB.hearthRouteConductorSafePacketBridgeNoLifecycleIgnition",
    "DEXTER_LAB.hearthRouteConductorGovernedSourceStackAdmissionCanvasHandoff",
    "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmission",
    "DEXTER_LAB.hearthRouteConductorCanvasDomSurfaceAdmissionAndRelease",
    "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
  ]);

  const CANVAS_ALIASES = Object.freeze([
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
    "HEARTH_CANVAS_STATION",
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
    "HEARTH.canvasStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubRafSphereRotationPairReceiver",
    "DEXTER_LAB.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasLocalStation",
    "DEXTER_LAB.hearthCanvasStation",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const CONTROL_ALIASES = Object.freeze([
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

  const STRONG_CANVAS_SOURCE_RECEIVERS = Object.freeze([
    "receiveGovernedSourceStackPacket",
    "consumeGovernedSourceStackPacket",
    "acceptGovernedSourceStackPacket",
    "receiveGovernedSourcePacket",
    "consumeGovernedSourcePacket",
    "acceptGovernedSourcePacket",
    "receiveSourceStackPacket",
    "consumeSourceStackPacket",
    "acceptSourceStackPacket",
    "receiveSourceTruthPacket",
    "consumeSourceTruthPacket",
    "receiveRouteConductorGovernedSourcePacket",
    "consumeRouteConductorGovernedSourcePacket",
    "receiveRouteConductorSourceStackPacket",
    "consumeRouteConductorSourceStackPacket",
    "receiveRouteConductorCanvasGovernedHandoffPacket",
    "consumeRouteConductorCanvasGovernedHandoffPacket"
  ]);

  const WEAK_CANVAS_PACKET_RECEIVERS = Object.freeze([
    "receiveRouteConductorReleasePacket",
    "consumeRouteConductorReleasePacket",
    "receiveReleasePacket",
    "consumeReleasePacket",
    "acceptReleasePacket",
    "receivePacket",
    "receiveCanvasViewPacket",
    "receiveControlPacket",
    "drawInteractiveFrame",
    "drawPairFrame"
  ]);

  const CONTROL_HANDSHAKE_RECEIVERS = Object.freeze([
    "receiveRouteConductorControlHandshake",
    "consumeRouteConductorControlHandshake",
    "receiveHexGateControlHandshake",
    "consumeHexGateControlHandshake",
    "receiveQueenControlHandshake",
    "consumeQueenControlHandshake",
    "receiveControlHandshakePacket",
    "acceptControlHandshakePacket",
    "receiveControlHandshake",
    "consumeControlHandshake"
  ]);

  const CONTROL_DUTY_METHODS = Object.freeze([
    "bindInputIfAdmitted",
    "unbindInput",
    "applyViewDelta",
    "queueViewDelta",
    "flushQueuedViewDelta",
    "composeViewDeltaPacket",
    "deliverControlPacketToCanvas",
    "prewarmCanvasReceiver",
    "readCanvasAuthority",
    "readHexSurfaceAuthority",
    "readHexAuthority",
    "readPointerFingerAuthority",
    "getViewPacket",
    "getQueenBridgeState"
  ]);

  let lastReport = null;
  let lastReceipt = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastSouthProbeEnvelope = null;

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
    if (value === true || value === 1 || value === "1") return true;
    if (value === false || value === 0 || value === "0") return false;

    const text = safeString(value).trim().toLowerCase();
    if (text === "true" || text === "yes" || text === "ready" || text === "active") return true;
    if (text === "false" || text === "no" || text === "none" || text === "unknown") return false;

    return fallback;
  }

  function bounded(value, limit = 4000) {
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
        return bounded(JSON.stringify(value), 24000) || fallback;
      } catch (_error) {
        return bounded(value, 4000) || fallback;
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

  function readField(source, keys, fallback = "") {
    const object = isObject(source) ? source : {};

    for (const key of keys || []) {
      const value = getRaw(object, key, undefined);
      if (value !== undefined && value !== null && value !== "") return value;
    }

    return fallback;
  }

  function readPath(base, path) {
    const parts = safeString(path).split(".");
    let cursor = base || root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) {
        return null;
      }

      cursor = cursor[part];
    }

    return cursor || null;
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

  function datasetValueAny(doc, keys) {
    for (const key of keys || []) {
      const value = dataValue(doc, key);
      if (value !== "UNKNOWN") return value;
    }

    return "UNKNOWN";
  }

  function setDiagnosticDataset(key, value) {
    try {
      if (!root.document || !root.document.documentElement || !root.document.documentElement.dataset) return;
      root.document.documentElement.dataset[key] =
        value === undefined || value === null ? "" : String(value);
    } catch (_error) {}
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
        firstElement(doc, MOUNT_SELECTORS).element ||
        firstElement(doc, CANVAS_SELECTORS).element
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
      targetWindow = null;
      targetDocument = null;
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

        if (
          frameWindow &&
          frameDocument &&
          !isDiagnosticReceiver(frameDocument, frameWindow)
        ) {
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

          if (
            frameWindow &&
            frameDocument &&
            !isDiagnosticReceiver(frameDocument, frameWindow)
          ) {
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
          defer: Boolean(script.defer),
          loadedFlag: script.dataset ? firstKnown(script.dataset.loaded, script.dataset.loadStatus) : "UNKNOWN"
        });
      }
    }

    const first = matches[0] || null;
    const last = matches[matches.length - 1] || null;

    return {
      present: matches.length > 0,
      count: matches.length,
      firstOrder: first ? first.order : 0,
      lastOrder: last ? last.order : 0,
      src: last ? last.src : "NONE",
      cacheKey: last ? last.cacheKey : "NONE",
      id: last ? last.id : "NONE",
      async: last ? last.async : false,
      defer: last ? last.defer : false,
      matches
    };
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) {
      return null;
    }

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getControlReceipt",
      "getControlsReceipt",
      "getControlHandshakeReceipt",
      "getControlHandshakeSummary",
      "getControlSummary",
      "getControlState",
      "getStatus",
      "getReport",
      "getState",
      "getSummary",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getCanvasReleasePacket",
      "getReleasePacket",
      "getGovernedSourcePacket",
      "getSourceStackPacket",
      "getSourceHoldPacket",
      "getCanvasStationReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getCarrierReceipt",
      "getCompactSummary"
    ];

    for (const method of methods) {
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

    if (
      authority.contract ||
      authority.CONTRACT ||
      authority.receipt ||
      authority.RECEIPT
    ) {
      return authority;
    }

    return null;
  }

  function contractOf(value) {
    if (!isObject(value) && !isFunction(value)) return "UNKNOWN";

    return firstKnown(
      value.CONTRACT,
      value.contract,
      value.RENEWAL_CONTRACT,
      value.renewalContract,
      value.INTERNAL_RENEWAL_CONTRACT,
      value.internalRenewalContract,
      value.IMPLEMENTATION_CONTRACT,
      value.implementationContract,
      value.internalImplementationContract,
      value.controlContract,
      value.controlsContract,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.hearthCanvasContract,
      value.CANVAS_CONTRACT,
      value.CANVAS_NAMESPACE_CONTRACT,
      value.ROUTE_CONDUCTOR_CONTRACT,
      value.routeConductorContract,
      value.currentRouteConductorContract,
      value.expectedRouteConductorContract
    );
  }

  function receiptOf(value) {
    if (!isObject(value) && !isFunction(value)) return "UNKNOWN";

    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.RENEWAL_RECEIPT,
      value.renewalReceipt,
      value.INTERNAL_RENEWAL_RECEIPT,
      value.internalRenewalReceipt,
      value.IMPLEMENTATION_RECEIPT,
      value.implementationReceipt,
      value.internalImplementationReceipt,
      value.controlReceipt,
      value.controlsReceipt,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.hearthCanvasReceipt,
      value.CANVAS_RECEIPT,
      value.CANVAS_NAMESPACE_RECEIPT,
      value.ROUTE_CONDUCTOR_RECEIPT,
      value.routeConductorReceipt,
      value.currentRouteConductorReceipt
    );
  }

  function authorityMethods(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return [];

    try {
      return Object.keys(authority)
        .filter((key) => isFunction(authority[key]))
        .sort()
        .slice(0, 96);
    } catch (_error) {
      return [];
    }
  }

  function inspectAuthority(name, aliases, targetWindow) {
    const scopes = [
      { scope: "TARGET_WINDOW", base: targetWindow || null },
      { scope: "DIAGNOSTIC_WINDOW", base: root }
    ];

    const candidates = [];

    for (const scope of scopes) {
      if (!scope.base) continue;

      for (const path of aliases || []) {
        const authority = readPath(scope.base, path);
        if (!authority) continue;

        const receipt = getReceiptFromAuthority(authority) || {};
        const contract = firstKnown(contractOf(receipt), contractOf(authority));
        const receiptName = firstKnown(receiptOf(receipt), receiptOf(authority));
        const methods = authorityMethods(authority);

        candidates.push({
          name,
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
      name,
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

  function recognizedCanvasContract(contract) {
    const text = safeString(contract);
    return Boolean(
      ACCEPTED_CANVAS_CONTRACTS.includes(text) ||
      /HEARTH_CANVAS_/i.test(text)
    );
  }

  function recognizedRouteConductorContract(contract) {
    const text = safeString(contract);
    return Boolean(
      ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(text) ||
      /HEARTH_ROUTE_CONDUCTOR_/i.test(text)
    );
  }

  function recognizedControlContract(contract) {
    const text = safeString(contract);
    return Boolean(
      ACCEPTED_CONTROL_CONTRACTS.includes(text) ||
      /HEARTH_CONTROLS|HEARTH_CONTROL/i.test(text)
    );
  }

  function inspectRouteConductorAdmission(routeAuthority) {
    const receipt = isObject(routeAuthority && routeAuthority.receiptObject)
      ? routeAuthority.receiptObject
      : {};

    const gates = Array.isArray(receipt.gates) ? receipt.gates : [];
    const admissions = Array.isArray(receipt.admissions) ? receipt.admissions : [];

    const canvasGate = gates.find((gate) =>
      /CANVAS/i.test(firstKnown(gate && gate.id, gate && gate.firstFailedCoordinate, ""))
    ) || null;

    const canvasAdmission = admissions.find((entry) =>
      /CANVAS/i.test(firstKnown(entry && entry.id, entry && entry.file, entry && entry.status, ""))
    ) || null;

    const intentPresent = Boolean(
      routeAuthority && routeAuthority.observed &&
        (
          recognizedRouteConductorContract(routeAuthority.contract) ||
          getRaw(receipt, "governedSourceStackGateActive", false) === true ||
          getRaw(receipt, "governedSourceStackRequiredBeforeCanvasRelease", false) === true ||
          firstKnown(getRaw(receipt, "canvasFile", ""), getRaw(receipt, "targetFile", "")) === CANVAS_FILE ||
          canvasGate ||
          canvasAdmission ||
          isFunction(routeAuthority.authority && routeAuthority.authority.getCanvasReleasePacket) ||
          isFunction(routeAuthority.authority && routeAuthority.authority.getReleasePacket)
        )
    );

    const resultExported = Boolean(
      intentPresent &&
        (
          getRaw(receipt, "canvasObserved", undefined) !== undefined ||
          getRaw(receipt, "canvasElementFound", undefined) !== undefined ||
          getRaw(receipt, "canvasMountFound", undefined) !== undefined ||
          getRaw(receipt, "canvasGovernedSourceDeliveryStatus", undefined) !== undefined ||
          getRaw(receipt, "governedSourcePacketAcceptedByCanvas", undefined) !== undefined ||
          getRaw(receipt, "canvasReleaseHeld", undefined) !== undefined ||
          getRaw(receipt, "canvasReleaseHoldReason", undefined) !== undefined ||
          getRaw(receipt, "chronologicalFirstFailedGate", undefined) !== undefined ||
          getRaw(receipt, "chronologicalFirstFailedCoordinate", undefined) !== undefined ||
          getRaw(receipt, "recommendedNextFile", undefined) !== undefined ||
          getRaw(receipt, "postgameStatus", undefined) !== undefined ||
          canvasGate ||
          canvasAdmission
        )
    );

    const status = firstKnown(
      getRaw(receipt, "canvasGovernedSourceDeliveryStatus", ""),
      getRaw(receipt, "canvasReleaseHoldReason", ""),
      getRaw(receipt, "chronologicalFirstFailedCoordinate", ""),
      getRaw(receipt, "postgameStatus", ""),
      canvasGate && canvasGate.firstFailedCoordinate,
      canvasAdmission && canvasAdmission.status
    );

    const reason = firstKnown(
      getRaw(receipt, "canvasGovernedSourceDeliveryReason", ""),
      getRaw(receipt, "canvasReleaseHoldReason", ""),
      getRaw(receipt, "sourceHoldReason", ""),
      canvasGate && canvasGate.firstFailedCoordinate,
      canvasAdmission && canvasAdmission.reason
    );

    return {
      intentPresent,
      resultExported,
      status,
      reason,
      canvasGate: clonePlain(canvasGate || {}),
      canvasAdmission: clonePlain(canvasAdmission || {}),
      sourceStackStatus: firstKnown(getRaw(receipt, "sourceStackStatus", "")),
      sourceStackReady: boolText(getRaw(receipt, "sourceStackReady", "UNKNOWN"), "UNKNOWN"),
      governedSourcePacketAcceptedByCanvas: boolText(
        getRaw(receipt, "governedSourcePacketAcceptedByCanvas", "UNKNOWN"),
        "UNKNOWN"
      )
    };
  }

  function readDutyBool(receipt, targetDocument, receiptKeys, datasetKeys, fallback = false) {
    const receiptValue = readField(receipt, receiptKeys, undefined);

    if (receiptValue !== undefined && receiptValue !== null && receiptValue !== "") {
      return safeBool(receiptValue, fallback);
    }

    const ds = datasetValueAny(targetDocument, datasetKeys);
    if (ds !== "UNKNOWN") return safeBool(ds, fallback);

    return fallback;
  }

  function readDutyText(receipt, targetDocument, receiptKeys, datasetKeys, fallback = "UNKNOWN") {
    const receiptValue = readField(receipt, receiptKeys, undefined);

    if (receiptValue !== undefined && receiptValue !== null && receiptValue !== "") {
      return bounded(receiptValue, 4000) || fallback;
    }

    const ds = datasetValueAny(targetDocument, datasetKeys);
    if (ds !== "UNKNOWN") return ds;

    return fallback;
  }

  function readDutyNumber(receipt, targetDocument, receiptKeys, datasetKeys, fallback = 0) {
    const receiptValue = readField(receipt, receiptKeys, undefined);

    if (receiptValue !== undefined && receiptValue !== null && receiptValue !== "") {
      return safeNumber(receiptValue, fallback);
    }

    const ds = datasetValueAny(targetDocument, datasetKeys);
    if (ds !== "UNKNOWN") return safeNumber(ds, fallback);

    return fallback;
  }

  function inspectControlsDuty(targetWindow, targetDocument, controlScript) {
    const controlAuthority = inspectAuthority(
      "controlsQueen",
      CONTROL_ALIASES,
      targetWindow
    );

    const receipt = isObject(controlAuthority.receiptObject)
      ? controlAuthority.receiptObject
      : {};

    const methods = controlAuthority.methods || [];

    const handshakeReceiverMethod =
      CONTROL_HANDSHAKE_RECEIVERS.find((method) => methods.includes(method)) || "NONE";

    const dutyMethodsObserved = CONTROL_DUTY_METHODS.filter((method) => methods.includes(method));

    const contractRecognized = recognizedControlContract(controlAuthority.contract);

    const handshakeAccepted = readDutyBool(
      receipt,
      targetDocument,
      [
        "handshakeAccepted",
        "controlHandshakeAccepted",
        "routeConductorControlHandshakeAccepted",
        "controlHandshakeAcceptedByQueen",
        "controlHandshakeSatisfied"
      ],
      [
        "hearthControlHandshakeAccepted",
        "hearthControlHandshakeAcceptedByQueen",
        "hearthControlsHandshakeAccepted"
      ],
      false
    );

    const handshakeStatus = readDutyText(
      receipt,
      targetDocument,
      ["handshakeStatus", "controlHandshakeStatus", "routeConductorControlIntegrationStatus"],
      ["hearthControlHandshakeStatus", "hearthRouteConductorControlIntegrationStatus"],
      "UNKNOWN"
    );

    const inputAdmissionOpen = readDutyBool(
      receipt,
      targetDocument,
      ["inputAdmissionOpen"],
      ["hearthControlInputAdmissionOpen"],
      false
    );

    const inputBound = readDutyBool(
      receipt,
      targetDocument,
      ["inputBound", "CONTROL_INPUT_BOUND"],
      ["hearthControlInputBound"],
      false
    );

    const inputTargetFound = readDutyBool(
      receipt,
      targetDocument,
      ["inputTargetFound", "CONTROL_INPUT_TARGET_FOUND"],
      ["hearthControlInputTargetFound"],
      false
    );

    const inputTargetDescription = readDutyText(
      receipt,
      targetDocument,
      ["inputTargetDescription", "CONTROL_INPUT_TARGET_DESCRIPTION"],
      ["hearthControlInputTargetDescription"],
      "UNKNOWN"
    );

    const inputStatus = readDutyText(
      receipt,
      targetDocument,
      ["inputStatus", "PLANETARY_VIEW_INPUT_STATUS"],
      ["hearthPlanetaryViewInputStatus"],
      "UNKNOWN"
    );

    const touchStatus = readDutyText(
      receipt,
      targetDocument,
      ["touchStatus", "PLANETARY_VIEW_TOUCH_STATUS"],
      ["hearthPlanetaryViewTouchStatus"],
      "UNKNOWN"
    );

    const dragStatus = readDutyText(
      receipt,
      targetDocument,
      ["dragStatus", "PLANETARY_VIEW_DRAG_STATUS"],
      ["hearthPlanetaryViewDragStatus"],
      "UNKNOWN"
    );

    const motionStatus = readDutyText(
      receipt,
      targetDocument,
      ["motionStatus", "PLANETARY_VIEW_MOTION_STATUS"],
      ["hearthPlanetaryViewMotionStatus"],
      "UNKNOWN"
    );

    const packetCount = readDutyNumber(
      receipt,
      targetDocument,
      ["packetCount", "CONTROL_PACKET_COUNT"],
      ["hearthControlPacketCount"],
      0
    );

    const deliveryCount = readDutyNumber(
      receipt,
      targetDocument,
      ["deliveryCount", "CONTROL_DELIVERY_COUNT"],
      ["hearthControlDeliveryCount"],
      0
    );

    const coalescedFrameCount = readDutyNumber(
      receipt,
      targetDocument,
      ["coalescedFrameCount", "CONTROL_COALESCED_FRAME_COUNT"],
      ["hearthControlCoalescedFrameCount"],
      0
    );

    const rawInputEventCount = readDutyNumber(
      receipt,
      targetDocument,
      ["rawInputEventCount", "CONTROL_RAW_INPUT_EVENT_COUNT"],
      ["hearthControlRawInputEventCount"],
      0
    );

    const lightweightFramePublishCount = readDutyNumber(
      receipt,
      targetDocument,
      ["lightweightFramePublishCount"],
      ["hearthControlLightweightFramePublishCount"],
      0
    );

    const droppedEmptyFrameCount = readDutyNumber(
      receipt,
      targetDocument,
      ["droppedEmptyFrameCount"],
      ["hearthControlDroppedEmptyFrameCount"],
      0
    );

    const canvasObservedByControls = readDutyBool(
      receipt,
      targetDocument,
      ["canvasObserved", "CANVAS_OBSERVED"],
      ["hearthControlsCanvasObserved"],
      false
    );

    const canvasContractByControls = readDutyText(
      receipt,
      targetDocument,
      ["canvasContract", "CANVAS_CONTRACT"],
      ["hearthControlsCanvasContract"],
      "UNKNOWN"
    );

    const canvasDeliveryStatus = readDutyText(
      receipt,
      targetDocument,
      ["canvasDeliveryStatus", "CANVAS_DELIVERY_STATUS"],
      ["hearthControlCanvasDeliveryStatus"],
      "UNKNOWN"
    );

    const canvasDeliveryMethod = readDutyText(
      receipt,
      targetDocument,
      ["canvasDeliveryMethod", "CANVAS_DELIVERY_METHOD"],
      ["hearthControlCanvasDeliveryMethod"],
      "NONE"
    );

    const canvasDeliveryReason = readDutyText(
      receipt,
      targetDocument,
      ["canvasDeliveryReason", "CANVAS_DELIVERY_REASON"],
      ["hearthControlCanvasDeliveryReason"],
      "UNKNOWN"
    );

    const receiverCacheStatus = readDutyText(
      receipt,
      targetDocument,
      ["canvasReceiverCacheStatus", "CONTROL_RECEIVER_CACHE_STATUS"],
      ["hearthControlReceiverCacheStatus"],
      "UNKNOWN"
    );

    const receiverCacheMethod = readDutyText(
      receipt,
      targetDocument,
      ["canvasReceiverCacheMethod", "CONTROL_RECEIVER_CACHE_METHOD"],
      ["hearthControlReceiverCacheMethod"],
      "NONE"
    );

    const receiverPrewarmStatus = readDutyText(
      receipt,
      targetDocument,
      ["canvasReceiverPrewarmStatus", "CONTROL_RECEIVER_PREWARM_STATUS"],
      ["hearthControlReceiverPrewarmStatus"],
      "UNKNOWN"
    );

    const receiverPrewarmCount = readDutyNumber(
      receipt,
      targetDocument,
      ["canvasReceiverPrewarmCount", "CONTROL_RECEIVER_PREWARM_COUNT"],
      ["hearthControlReceiverPrewarmCount"],
      0
    );

    const hexSurfaceObservedByControls = readDutyBool(
      receipt,
      targetDocument,
      ["hexSurfaceObserved", "HEX_SURFACE_OBSERVED"],
      ["hearthControlsHexSurfaceObserved"],
      false
    );

    const hexGateStatus = readDutyText(
      receipt,
      targetDocument,
      ["hexGateStatus", "HEX_GATE_STATUS"],
      ["hearthControlsHexGateStatus"],
      "UNKNOWN"
    );

    const pointerFingerObservedByControls = readDutyBool(
      receipt,
      targetDocument,
      ["pointerFingerObserved", "POINTER_FINGER_OBSERVED"],
      ["hearthControlsPointerFingerObserved"],
      false
    );

    const lifecycleSuppressed = readDutyBool(
      receipt,
      targetDocument,
      [
        "canvasLifecycleCallsSuppressedDuringDragFrames",
        "CANVAS_LIFECYCLE_CALLS_SUPPRESSED_DURING_DRAG_FRAMES",
        "suppressesCanvasLifecycleCallsDuringDragFrames"
      ],
      ["hearthControlsCanvasLifecycleCallsSuppressedDuringDragFrames"],
      false
    );

    const packetPhaseFixedAtZero = readDutyBool(
      receipt,
      targetDocument,
      ["packetPhaseFixedAtZero", "PACKET_PHASE_FIXED_AT_ZERO"],
      ["hearthControlsPacketPhaseFixedAtZero"],
      false
    );

    const noDirectPointer = readDutyBool(
      receipt,
      targetDocument,
      ["pointerFingerDirectDeliverySuppressed", "POINTER_FINGER_DIRECT_DELIVERY_SUPPRESSED"],
      ["hearthControlsPointerFingerDirectDeliverySuppressed"],
      false
    );

    const deltaObserved = Boolean(
      packetCount > 0 ||
      coalescedFrameCount > 0 ||
      rawInputEventCount > 0 ||
      lightweightFramePublishCount > 0 ||
      isObject(getRaw(receipt, "lastDeltaPacket", null)) ||
      isObject(getRaw(receipt, "lastViewPacket", null))
    );

    const canvasDeliveryConfirmed = Boolean(
      deliveryCount > 0 ||
      /DELIVERED|RECEIVER_CALLED|CONTROL_PACKET_DELIVERED/i.test(canvasDeliveryStatus)
    );

    const receiverMethodResolved = Boolean(
      canvasDeliveryMethod !== "NONE" ||
      (receiverCacheMethod !== "NONE" && receiverCacheMethod !== "UNKNOWN")
    );

    const authorityApiReady = Boolean(
      handshakeReceiverMethod !== "NONE" &&
      dutyMethodsObserved.includes("bindInputIfAdmitted") &&
      dutyMethodsObserved.includes("deliverControlPacketToCanvas") &&
      dutyMethodsObserved.includes("composeViewDeltaPacket")
    );

    let laneStatus = "CONTROLS_DUTY_NOT_RUN";
    let laneClean = false;
    let laneBlocking = false;
    let firstFailedCoordinate = "NONE";
    let failureClass = "NONE";
    let failureReason = "NONE";
    let recommendedOwner = "NONE";
    let recommendedFile = "NONE";
    let recommendedAction = "NONE";

    if (!controlScript.present) {
      laneStatus = "CONTROLS_SCRIPT_NOT_PRESENT";
      laneClean = false;
      laneBlocking = false;
      firstFailedCoordinate = "CONTROL_SCRIPT_PRESENT";
      failureClass = "CONTROLS_SCRIPT_NOT_PRESENT";
      failureReason = "TARGET_DOCUMENT_DOES_NOT_CONTAIN_THE_CONTROLS_SCRIPT";
      recommendedOwner = "CONTROL_LOAD_CHAIN_OR_ROUTE_CONDUCTOR";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "VERIFY_TARGET_ROUTE_LOADS_ASSET_CONTROLS_FILE";
    } else if (!controlAuthority.observed) {
      laneStatus = "CONTROLS_SCRIPT_PRESENT_BUT_AUTHORITY_NOT_OBSERVED";
      laneClean = false;
      laneBlocking = true;
      firstFailedCoordinate = "CONTROL_AUTHORITY_OBSERVED";
      failureClass = "CONTROLS_AUTHORITY_NOT_OBSERVED";
      failureReason = "CONTROLS_SCRIPT_EXISTS_BUT_EXPECTED_PUBLIC_CONTROLS_AUTHORITY_WAS_NOT_OBSERVED";
      recommendedOwner = "CONTROLS_ALIAS_PUBLICATION_OR_CONTROLS_SCRIPT_EXECUTION";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "VERIFY_CONTROLS_FILE_EXECUTES_AND_PUBLISHES_EXPECTED_PUBLIC_ALIASES";
    } else if (!contractRecognized) {
      laneStatus = "CONTROLS_AUTHORITY_PRESENT_CONTRACT_UNRECOGNIZED";
      laneClean = false;
      laneBlocking = true;
      firstFailedCoordinate = "CONTROL_CONTRACT_RECOGNIZED";
      failureClass = "CONTROLS_CONTRACT_UNRECOGNIZED";
      failureReason = "CONTROLS_NAMESPACE_EXISTS_BUT_CONTRACT_IS_NOT_IN_ACCEPTED_LINEAGE";
      recommendedOwner = "CONTROLS_CONTRACT_PUBLICATION";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "VERIFY_CONTROLS_PUBLIC_CONTRACT_AND_ACCEPTED_LINEAGE";
    } else if (!authorityApiReady) {
      laneStatus = "CONTROLS_AUTHORITY_PRESENT_BUT_DUTY_API_INCOMPLETE";
      laneClean = false;
      laneBlocking = true;
      firstFailedCoordinate = "CONTROL_DUTY_API_READY";
      failureClass = "CONTROLS_DUTY_API_INCOMPLETE";
      failureReason = "CONTROLS_HANDSHAKE_OR_DELTA_DELIVERY_METHODS_ARE_NOT_OBSERVED";
      recommendedOwner = "CONTROLS_QUEEN";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "PUBLISH_HANDSHAKE_RECEIVER_AND_VIEW_DELTA_DELIVERY_DUTY_METHODS";
    } else if (!handshakeAccepted) {
      laneStatus = "CONTROLS_READY_WAITING_ROUTE_HANDSHAKE";
      laneClean = true;
      laneBlocking = false;
      firstFailedCoordinate = "CONTROL_HANDSHAKE_ACCEPTED";
      failureClass = "CONTROLS_READY_HANDSHAKE_NOT_ACCEPTED_YET";
      failureReason = handshakeStatus;
      recommendedOwner = "ROUTE_CONDUCTOR_OR_CONTROLS_HANDSHAKE";
      recommendedFile = ROUTE_CONDUCTOR_FILE;
      recommendedAction = "CONFIRM_ROUTE_TO_CONTROLS_HANDSHAKE_DELIVERY_AND_RETURN_STATUS";
    } else if (handshakeAccepted && inputAdmissionOpen && !inputBound) {
      laneStatus = "CONTROLS_HANDSHAKE_ACCEPTED_BUT_INPUT_NOT_BOUND";
      laneClean = false;
      laneBlocking = true;
      firstFailedCoordinate = "CONTROL_INPUT_BOUND";
      failureClass = "CONTROLS_HANDSHAKE_ACCEPTED_INPUT_NOT_BOUND";
      failureReason = inputTargetFound
        ? "INPUT_TARGET_FOUND_BUT_CONTROLS_DID_NOT_BIND_INPUT"
        : "INPUT_TARGET_NOT_FOUND_OR_CONTROLS_DID_NOT_BIND_INPUT";
      recommendedOwner = "CONTROLS_QUEEN_OR_CANVAS_DOM_TARGET";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "VERIFY_CONTROLS_BIND_INPUT_TO_CANVAS_SURFACE_AFTER_HANDSHAKE_WITHOUT_BUTTON_UI_HEAVY_SCAN";
    } else if (deltaObserved && !canvasDeliveryConfirmed) {
      laneStatus = "CONTROLS_DELTA_OBSERVED_BUT_CANVAS_DELIVERY_NOT_CONFIRMED";
      laneClean = false;
      laneBlocking = true;
      firstFailedCoordinate = "CONTROL_CANVAS_DELIVERY_CONFIRMED";
      failureClass = "CONTROLS_DELTA_DELIVERY_NOT_CONFIRMED";
      failureReason = canvasDeliveryReason;
      recommendedOwner = "CONTROLS_QUEEN_TO_CANVAS_PUBLIC_RECEIVER";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "VERIFY_CONTROLS_DELIVER_VIEW_DELTA_TO_CANVAS_PUBLIC_RECEIVER_AND_EXPORT_DELIVERY_COUNT";
    } else if (handshakeAccepted && inputAdmissionOpen && inputBound && !deltaObserved) {
      laneStatus = "CONTROLS_DUTY_READY_BUT_NOT_EXERCISED";
      laneClean = true;
      laneBlocking = false;
      firstFailedCoordinate = "CONTROL_DELTA_OBSERVED";
      failureClass = "CONTROLS_READY_NO_INPUT_DELTA_OBSERVED";
      failureReason = "CONTROLS_ARE_ARMED_BUT_NO_POINTER_TOUCH_WHEEL_OR_KEYBOARD_DELTA_HAS_BEEN_OBSERVED";
      recommendedOwner = "DIAGNOSTIC_OBSERVATION_OR_USER_INPUT";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "EXERCISE_INPUT_OR_READ_COUNTERS_AFTER_POINTER_TOUCH_WHEEL_OR_KEYBOARD_EVENT";
    } else if (handshakeAccepted && inputAdmissionOpen && inputBound && deltaObserved && canvasDeliveryConfirmed) {
      laneStatus = "CONTROLS_DUTIES_PERFORMED_AND_DELIVERY_CONFIRMED";
      laneClean = true;
      laneBlocking = false;
    } else {
      laneStatus = "CONTROLS_DUTY_STATE_PARTIAL";
      laneClean = true;
      laneBlocking = false;
      firstFailedCoordinate = "CONTROL_DUTY_STATE_PARTIAL";
      failureClass = "CONTROLS_DUTY_PARTIAL_NON_BLOCKING";
      failureReason = "CONTROLS_AUTHORITY_IS_PRESENT_BUT_DUTY_PERFORMANCE_REQUIRES_EXERCISED_INPUT_OR_MORE_COUNTER_EVIDENCE";
      recommendedOwner = "DIAGNOSTIC_OBSERVATION";
      recommendedFile = CONTROL_FILE;
      recommendedAction = "READ_CONTROLS_RECEIPT_AFTER_EXERCISING_INPUT";
    }

    const dutiesPerformed = Boolean(
      handshakeAccepted &&
      inputAdmissionOpen &&
      inputBound &&
      deltaObserved &&
      canvasDeliveryConfirmed
    );

    const dutiesArmed = Boolean(
      controlAuthority.observed &&
      contractRecognized &&
      authorityApiReady &&
      handshakeAccepted &&
      inputAdmissionOpen &&
      inputBound
    );

    return {
      CONTROL_DUTY_LANE_ACTIVE: true,
      CONTROL_DUTY_LANE_STATUS: laneStatus,
      CONTROL_DUTY_LANE_CLEAN: laneClean,
      CONTROL_DUTY_LANE_BLOCKING: laneBlocking,
      CONTROL_DUTY_FIRST_FAILED_COORDINATE: firstFailedCoordinate,
      CONTROL_DUTY_FAILURE_CLASS: failureClass,
      CONTROL_DUTY_FAILURE_REASON: failureReason,
      CONTROL_DUTY_RECOMMENDED_OWNER: recommendedOwner,
      CONTROL_DUTY_RECOMMENDED_FILE: recommendedFile,
      CONTROL_DUTY_RECOMMENDED_ACTION: recommendedAction,

      CONTROL_SCRIPT_PRESENT: controlScript.present,
      CONTROL_SCRIPT_COUNT: controlScript.count,
      CONTROL_SCRIPT_SRC: controlScript.src,
      CONTROL_SCRIPT_CACHE_KEY: controlScript.cacheKey,
      CONTROL_SCRIPT_TAG_ORDER: controlScript.lastOrder || "NONE",

      CONTROL_AUTHORITY_OBSERVED: controlAuthority.observed,
      CONTROL_AUTHORITY_SCOPE: controlAuthority.scope,
      CONTROL_AUTHORITY_SOURCE_PATH: controlAuthority.path,
      CONTROL_AUTHORITY_CONTRACT: controlAuthority.contract,
      CONTROL_AUTHORITY_RECEIPT: controlAuthority.receipt,
      CONTROL_AUTHORITY_CONTRACT_RECOGNIZED: contractRecognized,
      CONTROL_AUTHORITY_METHOD_COUNT: controlAuthority.methodCount,
      CONTROL_AUTHORITY_METHODS: methods.join(",") || "NONE",
      CONTROL_AUTHORITY_CANDIDATE_COUNT: controlAuthority.candidates.length,
      CONTROL_AUTHORITY_CANDIDATES: controlAuthority.candidates,

      CONTROL_HANDSHAKE_RECEIVER_PRESENT: handshakeReceiverMethod !== "NONE",
      CONTROL_HANDSHAKE_RECEIVER_METHOD: handshakeReceiverMethod,
      CONTROL_DUTY_API_READY: authorityApiReady,
      CONTROL_DUTY_METHOD_COUNT: dutyMethodsObserved.length,
      CONTROL_DUTY_METHODS_OBSERVED: dutyMethodsObserved.join(",") || "NONE",

      CONTROL_HANDSHAKE_STATUS: handshakeStatus,
      CONTROL_HANDSHAKE_ACCEPTED: handshakeAccepted,
      CONTROL_INPUT_ADMISSION_OPEN: inputAdmissionOpen,
      CONTROL_INPUT_BOUND: inputBound,
      CONTROL_INPUT_TARGET_FOUND: inputTargetFound,
      CONTROL_INPUT_TARGET_DESCRIPTION: inputTargetDescription,
      CONTROL_INPUT_STATUS: inputStatus,
      CONTROL_TOUCH_STATUS: touchStatus,
      CONTROL_DRAG_STATUS: dragStatus,
      CONTROL_MOTION_STATUS: motionStatus,

      CONTROL_PACKET_COUNT: packetCount,
      CONTROL_DELIVERY_COUNT: deliveryCount,
      CONTROL_COALESCED_FRAME_COUNT: coalescedFrameCount,
      CONTROL_RAW_INPUT_EVENT_COUNT: rawInputEventCount,
      CONTROL_LIGHTWEIGHT_FRAME_PUBLISH_COUNT: lightweightFramePublishCount,
      CONTROL_DROPPED_EMPTY_FRAME_COUNT: droppedEmptyFrameCount,
      CONTROL_DELTA_OBSERVED: deltaObserved,

      CONTROL_CANVAS_OBSERVED_BY_CONTROLS: canvasObservedByControls,
      CONTROL_CANVAS_CONTRACT_BY_CONTROLS: canvasContractByControls,
      CONTROL_CANVAS_DELIVERY_STATUS: canvasDeliveryStatus,
      CONTROL_CANVAS_DELIVERY_METHOD: canvasDeliveryMethod,
      CONTROL_CANVAS_DELIVERY_REASON: canvasDeliveryReason,
      CONTROL_CANVAS_DELIVERY_CONFIRMED: canvasDeliveryConfirmed,

      CONTROL_RECEIVER_CACHE_STATUS: receiverCacheStatus,
      CONTROL_RECEIVER_CACHE_METHOD: receiverCacheMethod,
      CONTROL_RECEIVER_METHOD_RESOLVED: receiverMethodResolved,
      CONTROL_RECEIVER_PREWARM_STATUS: receiverPrewarmStatus,
      CONTROL_RECEIVER_PREWARM_COUNT: receiverPrewarmCount,

      CONTROL_HEX_SURFACE_OBSERVED_BY_CONTROLS: hexSurfaceObservedByControls,
      CONTROL_HEX_GATE_STATUS: hexGateStatus,
      CONTROL_POINTER_FINGER_OBSERVED_BY_CONTROLS: pointerFingerObservedByControls,

      CONTROL_CANVAS_LIFECYCLE_SUPPRESSED_DURING_DRAG: lifecycleSuppressed,
      CONTROL_PACKET_PHASE_FIXED_AT_ZERO: packetPhaseFixedAtZero,
      CONTROL_POINTER_FINGER_DIRECT_DELIVERY_SUPPRESSED: noDirectPointer,

      CONTROL_DUTIES_ARMED: dutiesArmed,
      CONTROL_DUTIES_PERFORMED: dutiesPerformed,
      CONTROL_DUTY_CAN_DISTINGUISH_READY_FROM_PERFORMED: true,

      authority: controlAuthority
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
    if (!targetWindow || !element || !isFunction(targetWindow.getComputedStyle)) {
      return {
        visible: false,
        display: "UNKNOWN",
        visibility: "UNKNOWN",
        opacity: "UNKNOWN",
        position: "UNKNOWN",
        zIndex: "UNKNOWN",
        pointerEvents: "UNKNOWN"
      };
    }

    try {
      const style = targetWindow.getComputedStyle(element);
      const display = safeString(style.display, "UNKNOWN");
      const visibility = safeString(style.visibility, "UNKNOWN");
      const opacity = safeString(style.opacity, "UNKNOWN");

      return {
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
        pointerEvents: safeString(style.pointerEvents, "UNKNOWN")
      };
    } catch (_error) {
      return {
        visible: false,
        display: "UNREADABLE",
        visibility: "UNREADABLE",
        opacity: "UNREADABLE",
        position: "UNREADABLE",
        zIndex: "UNREADABLE",
        pointerEvents: "UNREADABLE"
      };
    }
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

  function elementDescriptor(element) {
    if (!element) return "NONE";

    const tag = safeString(element.tagName, "UNKNOWN").toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    let classes = "";

    try {
      classes =
        element.classList && element.classList.length
          ? `.${Array.from(element.classList).slice(0, 4).join(".")}`
          : "";
    } catch (_error) {}

    return `${tag}${id}${classes}` || "UNKNOWN_ELEMENT";
  }

  function inspectLayerBlock(targetWindow, targetDocument, canvas, rect) {
    if (
      !targetDocument ||
      !canvas ||
      !rectNonzero(rect) ||
      !isFunction(targetDocument.elementFromPoint)
    ) {
      return {
        blocked: false,
        blocker: "UNREADABLE",
        hitTarget: "UNREADABLE",
        hitWithinCanvas: false
      };
    }

    const viewportWidth = safeNumber(targetWindow && targetWindow.innerWidth, 0);
    const viewportHeight = safeNumber(targetWindow && targetWindow.innerHeight, 0);

    if (viewportWidth <= 0 || viewportHeight <= 0) {
      return {
        blocked: false,
        blocker: "VIEWPORT_UNREADABLE",
        hitTarget: "VIEWPORT_UNREADABLE",
        hitWithinCanvas: false
      };
    }

    const points = [
      [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5],
      [rect.left + rect.width * 0.33, rect.top + rect.height * 0.33],
      [rect.left + rect.width * 0.67, rect.top + rect.height * 0.67]
    ];

    const hits = [];

    for (const [rawX, rawY] of points) {
      const x = Math.max(0, Math.min(viewportWidth - 1, rawX));
      const y = Math.max(0, Math.min(viewportHeight - 1, rawY));

      try {
        const hit = targetDocument.elementFromPoint(x, y);
        if (hit) hits.push(hit);
      } catch (_error) {}
    }

    if (!hits.length) {
      return {
        blocked: false,
        blocker: "NO_HIT_TARGET",
        hitTarget: "NO_HIT_TARGET",
        hitWithinCanvas: false
      };
    }

    const firstHit = hits[0];
    const canvasHit = hits.some(
      (hit) => containsOrEquals(canvas, hit) || containsOrEquals(hit, canvas)
    );
    const firstBlocker = hits.find(
      (hit) => !containsOrEquals(canvas, hit) && !containsOrEquals(hit, canvas)
    );

    return {
      blocked: Boolean(!canvasHit && firstBlocker),
      blocker: firstBlocker ? elementDescriptor(firstBlocker) : "NONE",
      hitTarget: elementDescriptor(firstHit),
      hitWithinCanvas: canvasHit
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
        status: `CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 500)}`
      };
    }
  }

  function samplePixels(canvas, ctx) {
    if (!canvas || !ctx) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: "CANVAS_OR_CONTEXT_UNAVAILABLE"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0 || !isFunction(ctx.getImageData)) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: "CANVAS_INTERNAL_SIZE_OR_GET_IMAGE_DATA_UNAVAILABLE"
      };
    }

    try {
      const sampleSize = Math.max(
        2,
        Math.min(16, Math.floor(Math.min(width, height) / 36))
      );

      const points = [
        [0.5, 0.5],
        [0.35, 0.35],
        [0.65, 0.35],
        [0.35, 0.65],
        [0.65, 0.65],
        [0.5, 0.25],
        [0.5, 0.75]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;

      for (const [px, py] of points) {
        const x = Math.max(
          0,
          Math.min(width - sampleSize, Math.floor(width * px - sampleSize / 2))
        );
        const y = Math.max(
          0,
          Math.min(height - sampleSize, Math.floor(height * py - sampleSize / 2))
        );

        const data = ctx.getImageData(x, y, sampleSize, sampleSize).data;
        sampleCount += data.length / 4;

        for (let index = 0; index < data.length; index += 4) {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const alpha = data[index + 3];

          if (alpha > 0) alphaPixelCount += 1;
          if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) {
            visiblePixelCount += 1;
          }
        }
      }

      const visible = visiblePixelCount > 0;

      return {
        status: visible
          ? "PIXEL_SAMPLE_VISIBLE"
          : alphaPixelCount > 0
            ? "PIXEL_SAMPLE_ALPHA_ONLY"
            : "PIXEL_SAMPLE_BLANK",
        visible,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        reason: visible
          ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
          : "NO_VISIBLE_NON_BLANK_PIXELS_FOUND"
      };
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function namespaceMatchesDomSurface(canvasAuthority, canvas) {
    if (!canvasAuthority || !canvasAuthority.observed || !canvas) return false;

    let datasetContract = "UNKNOWN";

    try {
      datasetContract =
        canvas.dataset &&
        firstKnown(
          canvas.dataset.hearthCanvasContract,
          canvas.dataset.contract,
          canvas.dataset.hearthCanvasInternalRenewalContract,
          canvas.dataset.hearthCanvasCurrentParentContract
        );
    } catch (_error) {}

    const contractConsistent = Boolean(
      recognizedCanvasContract(canvasAuthority.contract) ||
      recognizedCanvasContract(datasetContract)
    );

    const sizeConsistent =
      safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0;

    return Boolean(contractConsistent && sizeConsistent);
  }

  function inspectCanvasDom(targetWindow, targetDocument, canvasAuthority) {
    const report = {
      CANVAS_MOUNT_FOUND: false,
      CANVAS_MOUNT_SELECTOR: "NONE",
      CANVAS_MOUNT_DESCRIPTOR: "NONE",

      CANVAS_ELEMENT_FOUND: false,
      CANVAS_DOM_SURFACE_FOUND: false,
      CANVAS_SELECTOR: "NONE",
      CANVAS_TAG: "NONE",
      CANVAS_ID: "NONE",
      CANVAS_CLASS: "NONE",
      CANVAS_DATASET_CONTRACT: "UNKNOWN",
      CANVAS_DATASET_RECEIPT: "UNKNOWN",
      CANVAS_IN_MOUNT: false,

      CANVAS_WIDTH_ATTRIBUTE: 0,
      CANVAS_HEIGHT_ATTRIBUTE: 0,
      CANVAS_INTERNAL_SIZE_NONZERO: false,

      CANVAS_RECT_LEFT: 0,
      CANVAS_RECT_TOP: 0,
      CANVAS_RECT_WIDTH: 0,
      CANVAS_RECT_HEIGHT: 0,
      CANVAS_RECT_NONZERO: false,

      CANVAS_COMPUTED_VISIBLE: false,
      CANVAS_COMPUTED_DISPLAY: "UNKNOWN",
      CANVAS_COMPUTED_VISIBILITY: "UNKNOWN",
      CANVAS_COMPUTED_OPACITY: "UNKNOWN",
      CANVAS_COMPUTED_POSITION: "UNKNOWN",
      CANVAS_COMPUTED_Z_INDEX: "UNKNOWN",
      CANVAS_COMPUTED_POINTER_EVENTS: "UNKNOWN",

      CANVAS_VIEWPORT_WIDTH: 0,
      CANVAS_VIEWPORT_HEIGHT: 0,
      CANVAS_VIEWPORT_INTERSECTING: false,

      CANVAS_CONTEXT_2D_READY: false,
      CANVAS_CONTEXT_2D_STATUS: "NOT_ATTEMPTED",

      CANVAS_PIXEL_SAMPLE_STATUS: "NO_PIXEL_SAMPLE",
      CANVAS_PIXEL_VISIBLE: false,
      CANVAS_PIXEL_SAMPLE_COUNT: 0,
      CANVAS_VISIBLE_PIXEL_COUNT: 0,
      CANVAS_ALPHA_PIXEL_COUNT: 0,
      CANVAS_PIXEL_SAMPLE_REASON: "NOT_RUN",

      CANVAS_LAYER_BLOCKED: false,
      CANVAS_LAYER_BLOCKER: "UNKNOWN",
      CANVAS_LAYER_HIT_TARGET: "UNKNOWN",
      CANVAS_LAYER_HIT_WITHIN_CANVAS: false,

      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: false
    };

    if (!targetWindow || !targetDocument) return report;

    const mountResult = firstElement(targetDocument, MOUNT_SELECTORS);
    const canvasResult = firstElement(targetDocument, CANVAS_SELECTORS);
    const mount = mountResult.element;
    const canvas = canvasResult.element;

    report.CANVAS_MOUNT_FOUND = Boolean(mount);
    report.CANVAS_MOUNT_SELECTOR = mountResult.selector;
    report.CANVAS_MOUNT_DESCRIPTOR = elementDescriptor(mount);

    report.CANVAS_ELEMENT_FOUND = Boolean(canvas);
    report.CANVAS_DOM_SURFACE_FOUND = Boolean(canvas);
    report.CANVAS_SELECTOR = canvasResult.selector;
    report.CANVAS_TAG = canvas ? safeString(canvas.tagName, "UNKNOWN").toLowerCase() : "NONE";
    report.CANVAS_ID = canvas && canvas.id ? canvas.id : "NONE";

    try {
      report.CANVAS_CLASS = canvas && canvas.className ? safeString(canvas.className) : "NONE";
    } catch (_error) {
      report.CANVAS_CLASS = "UNREADABLE";
    }

    report.CANVAS_IN_MOUNT = Boolean(canvas && mount && containsOrEquals(mount, canvas));

    if (canvas && canvas.dataset) {
      report.CANVAS_DATASET_CONTRACT = firstKnown(
        canvas.dataset.hearthCanvasContract,
        canvas.dataset.contract,
        canvas.dataset.hearthCanvasInternalRenewalContract,
        canvas.dataset.hearthCanvasCurrentParentContract
      );
      report.CANVAS_DATASET_RECEIPT = firstKnown(
        canvas.dataset.hearthCanvasReceipt,
        canvas.dataset.receipt,
        canvas.dataset.hearthCanvasExpressionBridgeReceipt
      );
    }

    if (!canvas) return report;

    const rect = getRect(canvas);
    const css = cssSummary(targetWindow, canvas);
    const ctx = getCanvas2d(canvas);
    const pixels = samplePixels(canvas, ctx.ctx);
    const layer = inspectLayerBlock(targetWindow, targetDocument, canvas, rect);

    report.CANVAS_WIDTH_ATTRIBUTE = safeNumber(canvas.width, 0);
    report.CANVAS_HEIGHT_ATTRIBUTE = safeNumber(canvas.height, 0);
    report.CANVAS_INTERNAL_SIZE_NONZERO = Boolean(
      report.CANVAS_WIDTH_ATTRIBUTE > 0 && report.CANVAS_HEIGHT_ATTRIBUTE > 0
    );

    report.CANVAS_RECT_LEFT = rect.left;
    report.CANVAS_RECT_TOP = rect.top;
    report.CANVAS_RECT_WIDTH = rect.width;
    report.CANVAS_RECT_HEIGHT = rect.height;
    report.CANVAS_RECT_NONZERO = rectNonzero(rect);

    report.CANVAS_COMPUTED_VISIBLE = css.visible;
    report.CANVAS_COMPUTED_DISPLAY = css.display;
    report.CANVAS_COMPUTED_VISIBILITY = css.visibility;
    report.CANVAS_COMPUTED_OPACITY = css.opacity;
    report.CANVAS_COMPUTED_POSITION = css.position;
    report.CANVAS_COMPUTED_Z_INDEX = css.zIndex;
    report.CANVAS_COMPUTED_POINTER_EVENTS = css.pointerEvents;

    report.CANVAS_VIEWPORT_WIDTH = safeNumber(targetWindow.innerWidth, 0);
    report.CANVAS_VIEWPORT_HEIGHT = safeNumber(targetWindow.innerHeight, 0);
    report.CANVAS_VIEWPORT_INTERSECTING = viewportIntersecting(targetWindow, rect);

    report.CANVAS_CONTEXT_2D_READY = ctx.ready;
    report.CANVAS_CONTEXT_2D_STATUS = ctx.status;

    report.CANVAS_PIXEL_SAMPLE_STATUS = pixels.status;
    report.CANVAS_PIXEL_VISIBLE = pixels.visible;
    report.CANVAS_PIXEL_SAMPLE_COUNT = pixels.sampleCount;
    report.CANVAS_VISIBLE_PIXEL_COUNT = pixels.visiblePixelCount;
    report.CANVAS_ALPHA_PIXEL_COUNT = pixels.alphaPixelCount;
    report.CANVAS_PIXEL_SAMPLE_REASON = pixels.reason;

    report.CANVAS_LAYER_BLOCKED = layer.blocked;
    report.CANVAS_LAYER_BLOCKER = layer.blocker;
    report.CANVAS_LAYER_HIT_TARGET = layer.hitTarget;
    report.CANVAS_LAYER_HIT_WITHIN_CANVAS = layer.hitWithinCanvas;

    report.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE = namespaceMatchesDomSurface(
      canvasAuthority,
      canvas
    );

    return report;
  }

  function resolveCanvasFailure(report) {
    const checks = [
      [
        "TARGET_CONTEXT_STATUS",
        report.TARGET_CONTEXT_STATUS !== "TARGET_CONTEXT_AVAILABLE",
        "TARGET_CONTEXT_UNAVAILABLE",
        "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE",
        "DIAGNOSTIC_TARGET_ACCESS",
        FILE,
        "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_CANVAS_SURFACE_TRUTH_PROBE"
      ],
      [
        "CANVAS_SCRIPT_PRESENT",
        report.CANVAS_SCRIPT_PRESENT !== true,
        "CANVAS_SCRIPT_NOT_PRESENT",
        "TARGET_DOCUMENT_DOES_NOT_CONTAIN_THE_CANVAS_SCRIPT",
        "CANVAS_LOAD_CHAIN_OR_ROUTE_CONDUCTOR",
        CANVAS_FILE,
        "VERIFY_THE_TARGET_ROUTE_LOADS_ASSET_CANVAS_FILE"
      ],
      [
        "ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED",
        report.ROUTE_CONDUCTOR_OBSERVED === true &&
          report.ROUTE_CONDUCTOR_CANVAS_ADMISSION_INTENT_PRESENT === true &&
          report.ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED !== true,
        "ROUTE_CONDUCTOR_ADMISSION_RESULT_NOT_EXPORTED",
        "ROUTE_CONDUCTOR_SHOWS_CANVAS_ADMISSION_INTENT_BUT_DOES_NOT_EXPORT_A_CANVAS_ADMISSION_RESULT",
        "ROUTE_CONDUCTOR",
        ROUTE_CONDUCTOR_FILE,
        "EXPORT_CANVAS_ADMISSION_RESULT_COORDINATES_FROM_ROUTE_CONDUCTOR_RECEIPT"
      ],
      [
        "CANVAS_AUTHORITY_OBSERVED",
        report.CANVAS_SCRIPT_PRESENT === true && report.CANVAS_AUTHORITY_OBSERVED !== true,
        "CANVAS_SCRIPT_PRESENT_BUT_AUTHORITY_NOT_PUBLISHED",
        "CANVAS_SCRIPT_TAG_EXISTS_BUT_EXPECTED_CANVAS_PUBLIC_AUTHORITY_WAS_NOT_OBSERVED",
        "CANVAS_ALIAS_PUBLICATION_OR_CANVAS_SCRIPT_EXECUTION",
        CANVAS_FILE,
        "VERIFY_CANVAS_FILE_EXECUTES_AND_PUBLISHES_EXPECTED_PUBLIC_ALIASES"
      ],
      [
        "CANVAS_DOM_SURFACE_FOUND",
        report.CANVAS_AUTHORITY_OBSERVED === true && report.CANVAS_DOM_SURFACE_FOUND !== true,
        "CANVAS_AUTHORITY_PRESENT_BUT_DOM_SURFACE_NOT_BOUND",
        "CANVAS_PUBLIC_AUTHORITY_EXISTS_BUT_NO_DOM_CANVAS_SURFACE_MATCHES_EXPECTED_SELECTORS",
        "CANVAS_DOM_BINDING",
        CANVAS_FILE,
        "BIND_OR_CREATE_THE_VISIBLE_DOM_CANVAS_SURFACE_WITH_EXPECTED_SELECTOR_OR_DATASET"
      ],
      [
        "CANVAS_MOUNT_FOUND",
        report.CANVAS_MOUNT_FOUND !== true,
        "CANVAS_MOUNT_NOT_FOUND",
        "NO_EXPECTED_HEARTH_CANVAS_MOUNT_FOUND",
        "HTML_SHELL_OR_STAGE_MARKUP",
        "/showroom/globe/hearth/index.html",
        "VERIFY_EXPECTED_CANVAS_MOUNT_OR_STAGE_MARKUP"
      ],
      [
        "CANVAS_IN_MOUNT",
        report.CANVAS_IN_MOUNT !== true,
        "CANVAS_OUTSIDE_EXPECTED_MOUNT",
        "CANVAS_EXISTS_BUT_IS_NOT_CONTAINED_BY_EXPECTED_HEARTH_MOUNT",
        "CANVAS_PLACEMENT_OR_HTML_MOUNT_ALIGNMENT",
        CANVAS_FILE,
        "ALIGN_CANVAS_DOM_SURFACE_WITH_HEARTH_CANVAS_MOUNT"
      ],
      [
        "CANVAS_WIDTH_ATTRIBUTE",
        safeNumber(report.CANVAS_WIDTH_ATTRIBUTE, 0) <= 0,
        "CANVAS_WIDTH_ATTRIBUTE_ZERO",
        "CANVAS_WIDTH_ATTRIBUTE_IS_ZERO",
        "CANVAS_EXPRESSION_SURFACE",
        CANVAS_FILE,
        "VERIFY_CANVAS_INTERNAL_WIDTH_ATTRIBUTE"
      ],
      [
        "CANVAS_HEIGHT_ATTRIBUTE",
        safeNumber(report.CANVAS_HEIGHT_ATTRIBUTE, 0) <= 0,
        "CANVAS_HEIGHT_ATTRIBUTE_ZERO",
        "CANVAS_HEIGHT_ATTRIBUTE_IS_ZERO",
        "CANVAS_EXPRESSION_SURFACE",
        CANVAS_FILE,
        "VERIFY_CANVAS_INTERNAL_HEIGHT_ATTRIBUTE"
      ],
      [
        "CANVAS_RECT_NONZERO",
        report.CANVAS_RECT_NONZERO !== true,
        "CANVAS_ZERO_RECT",
        "CANVAS_ELEMENT_EXISTS_BUT_BOUNDING_RECT_IS_ZERO",
        "CSS_LAYOUT_OR_CANVAS_PLACEMENT",
        CANVAS_FILE,
        "VERIFY_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT"
      ],
      [
        "CANVAS_COMPUTED_VISIBLE",
        report.CANVAS_COMPUTED_VISIBLE !== true,
        "CANVAS_COMPUTED_STYLE_HIDDEN",
        "CANVAS_COMPUTED_STYLE_IS_NOT_VISIBLE",
        "CSS_VISIBILITY_OR_ROUTE_SHELL",
        "/showroom/globe/hearth/index.html",
        "AUDIT_DISPLAY_VISIBILITY_OPACITY_POINTER_EVENTS"
      ],
      [
        "CANVAS_VIEWPORT_INTERSECTING",
        report.CANVAS_VIEWPORT_INTERSECTING !== true,
        "CANVAS_OUTSIDE_VIEWPORT",
        "CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT",
        "CSS_LAYOUT_OR_SCROLL_POSITION",
        "/showroom/globe/hearth/index.html",
        "AUDIT_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_INTERSECTION"
      ],
      [
        "CANVAS_CONTEXT_2D_READY",
        report.CANVAS_CONTEXT_2D_READY !== true,
        "CANVAS_CONTEXT_2D_NOT_READY",
        "CANVAS_DOES_NOT_EXPOSE_A_2D_CONTEXT",
        "CANVAS_EXPRESSION_SURFACE",
        CANVAS_FILE,
        "VERIFY_DOM_SURFACE_IS_STANDARD_2D_CANVAS"
      ],
      [
        "CANVAS_PIXEL_VISIBLE",
        report.CANVAS_PIXEL_VISIBLE !== true,
        "CANVAS_PIXEL_SAMPLE_NOT_VISIBLE",
        report.CANVAS_PIXEL_SAMPLE_STATUS || "CANVAS_PIXEL_VISIBLE_FALSE",
        "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        CANVAS_FILE,
        "AUDIT_CANVAS_DRAW_PATH_AND_DOWNSTREAM_EXPRESSION_ADAPTER"
      ],
      [
        "CANVAS_LAYER_BLOCKED",
        report.CANVAS_LAYER_BLOCKED === true,
        "CANVAS_LAYER_OBSTRUCTED",
        "CANVAS_IS_PRESENT_BUT_ELEMENT_FROM_POINT_HIT_TEST_INDICATES_OVERLAY_BLOCKAGE",
        "CSS_LAYERING_OR_OVERLAY",
        "/showroom/globe/hearth/index.html",
        "AUDIT_Z_INDEX_POINTER_LAYER_AND_OVERLAY_ELEMENTS"
      ],
      [
        "CANVAS_PARENT_CONTRACT_RECOGNIZED",
        report.CANVAS_PARENT_CONTRACT_RECOGNIZED !== true,
        "CANVAS_PARENT_CONTRACT_UNRECOGNIZED",
        "CANVAS_NAMESPACE_EXISTS_BUT_CONTRACT_IS_NOT_IN_ACCEPTED_CANVAS_LINEAGE",
        "CANVAS_CONTRACT_PUBLICATION",
        CANVAS_FILE,
        "VERIFY_CANVAS_PARENT_CONTRACT_AND_ACCEPTED_LINEAGE"
      ],
      [
        "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE",
        report.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE !== true,
        "CANVAS_NAMESPACE_DOM_MISMATCH",
        "CANVAS_NAMESPACE_RECEIPT_DOES_NOT_MATCH_THE_DOM_CANVAS_SURFACE",
        "CANVAS_RECEIPT_PUBLICATION",
        CANVAS_FILE,
        "ALIGN_CANVAS_RECEIPT_WITH_DOM_SURFACE_PROOF"
      ]
    ];

    const failed = checks.find((entry) => entry[1]);

    if (!failed) {
      return {
        coordinate: "NONE",
        failureClass: "CANVAS_SURFACE_TRUTH_PROVEN_NO_FINAL_CLAIM",
        reason: "CANVAS_SCRIPT_AUTHORITY_DOM_PIXEL_LAYER_AND_RECEIPT_ALIGNMENT_PASSED",
        owner: "NONE",
        file: "NONE",
        action: "RETURN_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_STANDARD_CHECK",
        certainty: "DEFINITIVE_COORDINATE_PASS",
        sourceLane: "CANVAS_SURFACE_TRUTH_LANE"
      };
    }

    return {
      coordinate: failed[0],
      failureClass: failed[2],
      reason: failed[3],
      owner: failed[4],
      file: failed[5],
      action: failed[6],
      certainty: "DEFINITIVE_FIRST_FAILED_COORDINATE",
      sourceLane: "CANVAS_SURFACE_TRUTH_LANE"
    };
  }

  function resolveFinalFailure(canvasFailure, controlsDuty) {
    if (canvasFailure.coordinate !== "NONE") return canvasFailure;

    if (controlsDuty && controlsDuty.CONTROL_DUTY_LANE_BLOCKING === true) {
      return {
        coordinate: controlsDuty.CONTROL_DUTY_FIRST_FAILED_COORDINATE,
        failureClass: controlsDuty.CONTROL_DUTY_FAILURE_CLASS,
        reason: controlsDuty.CONTROL_DUTY_FAILURE_REASON,
        owner: controlsDuty.CONTROL_DUTY_RECOMMENDED_OWNER,
        file: controlsDuty.CONTROL_DUTY_RECOMMENDED_FILE,
        action: controlsDuty.CONTROL_DUTY_RECOMMENDED_ACTION,
        certainty: "DEFINITIVE_CONTROL_DUTY_COORDINATE_AFTER_CANVAS_SURFACE_PASS",
        sourceLane: "CONTROLS_DUTY_LANE"
      };
    }

    return canvasFailure;
  }

  function collectLabCardinalReceiptBundle(targetWindow, currentReport) {
    return {
      receiptName: "LAB_CARDINAL_RECEIPT_BUNDLE",
      status: "LAB_CARDINAL_RECEIPT_BUNDLE_PRESERVED_BY_F21_FORENSICS_LENS",
      observedCount: "UNKNOWN",
      expectedCount: 4,
      north: {
        contract: firstKnown(currentReport.NORTH_CONTRACT, currentReport.LAB_NORTH_CONTRACT),
        observed: safeBool(currentReport.LAB_NORTH_OBSERVED, false)
      },
      east: {
        contract: firstKnown(currentReport.EAST_CONTRACT, currentReport.LAB_EAST_CONTRACT),
        observed: safeBool(currentReport.LAB_EAST_OBSERVED, false)
      },
      south: {
        contract: firstKnown(currentReport.SOUTH_CONTRACT, currentReport.LAB_SOUTH_CONTRACT),
        observed: safeBool(currentReport.MACRO_SOUTH_OBSERVED, safeBool(currentReport.LAB_SOUTH_OBSERVED, false))
      },
      west: {
        contract: firstKnown(currentReport.WEST_CONTRACT, currentReport.MACRO_WEST_CONTRACT),
        observed: safeBool(currentReport.MACRO_WEST_OBSERVED, false)
      },
      targetWindowAvailable: Boolean(targetWindow)
    };
  }

  function collectDiagnosticTrackReceipt(currentReport, chronology) {
    const entries = Array.isArray(chronology) ? chronology : [];
    const completeCount = entries.filter((entry) => entry && entry.status === "COMPLETE").length;
    const firstFailure = entries.find((entry) => entry && entry.status && entry.status !== "COMPLETE") || null;

    return {
      receiptName: "DIAGNOSTIC_TRACK_RECEIPT",
      status:
        entries.length && completeCount === entries.length
          ? "DIAGNOSTIC_TRACK_RECEIPT_COMPLETE"
          : entries.length
            ? "DIAGNOSTIC_TRACK_RECEIPT_PARTIAL"
            : "DIAGNOSTIC_TRACK_RECEIPT_FROM_PARENT_REPORT",
      chronologyObserved: entries.length > 0,
      chronologyStepCount: entries.length,
      chronologyCompleteCount: completeCount,
      firstFailedStage: firstFailure
        ? `${firstFailure.fibonacciStage || "UNKNOWN"}:${firstFailure.id || "UNKNOWN"}`
        : "NONE",
      diagnosticTrackNewsAlignmentStatus: firstKnown(
        currentReport.DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_STATUS,
        currentReport.NEWS_ALIGNMENT_STATUS
      ),
      diagnosticTrackFibonacciSynchronizationStatus: firstKnown(
        currentReport.DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_STATUS,
        currentReport.FIBONACCI_SYNCHRONIZATION_STATUS
      )
    };
  }

  function collectCanvasBishopReceipt(canvasReport, routeAuthority, canvasAuthority) {
    const canvasReady = Boolean(
      canvasReport.CANVAS_ELEMENT_FOUND === true &&
      canvasReport.CANVAS_RECT_NONZERO === true &&
      canvasReport.CANVAS_CONTEXT_2D_READY === true &&
      canvasReport.CANVAS_AUTHORITY_OBSERVED === true
    );

    const bishopReady = Boolean(
      routeAuthority.observed &&
      /BISHOP|QUEEN|CANVAS|ROUTE_CONDUCTOR/i.test(
        `${routeAuthority.path} ${routeAuthority.contract} ${packetValue(routeAuthority.receiptObject, "")}`
      )
    );

    return {
      receiptName: "CANVAS_BISHOP_RECEIPT",
      status:
        canvasReady && bishopReady
          ? "CANVAS_BISHOP_RECEIPT_COMPLETE"
          : canvasReady || bishopReady
            ? "CANVAS_BISHOP_RECEIPT_PARTIAL"
            : "CANVAS_BISHOP_RECEIPT_NOT_OBSERVED",
      canvasReady,
      bishopReady,
      pixelVisible: canvasReport.CANVAS_PIXEL_VISIBLE === true,
      canvasPixelSampleStatus: canvasReport.CANVAS_PIXEL_SAMPLE_STATUS,
      canvasTruthFailureClass: canvasReport.CANVAS_TRUTH_FAILURE_CLASS || "UNKNOWN",
      routeConductor: {
        observed: routeAuthority.observed,
        path: routeAuthority.path,
        contract: routeAuthority.contract,
        receipt: routeAuthority.receipt
      },
      canvasAuthority: {
        observed: canvasAuthority.observed,
        path: canvasAuthority.path,
        contract: canvasAuthority.contract,
        receipt: canvasAuthority.receipt,
        methodCount: canvasAuthority.methodCount
      }
    };
  }

  function collectFingerFileReceipt(targetWindow, currentReport, payload) {
    const southEnvelopePresent = Boolean(
      lastSouthProbeEnvelope ||
      payload.southProbeReceipt ||
      payload.probeSouthReceipt ||
      getRaw(currentReport, "PROBE_SOUTH_RETURN_PACKET_READY", false) ||
      getRaw(currentReport, "RECEIPT_RETURN_MECHANISM_STATUS", "")
    );

    const finger = inspectAuthority(
      "fingerInspect",
      [
        "HEARTH.canvasFingerInspect",
        "HEARTH.hearthCanvasFingerInspect",
        "HEARTH.diagnosticCanvasFingerInspect",
        "DEXTER_LAB.hearthCanvasFingerInspect",
        "DEXTER_LAB.hearthDiagnosticCanvasFingerInspect",
        "HEARTH_CANVAS_FINGER_INSPECT"
      ],
      targetWindow
    );

    const hexSurface = inspectAuthority(
      "hexSurface",
      [
        "HEARTH.hexSurface",
        "HEARTH.hearthHexSurface",
        "HEARTH.canvasHexSurface",
        "HEARTH.hearthCanvasHexSurface",
        "DEXTER_LAB.hearthHexSurface",
        "HEARTH_HEX_SURFACE"
      ],
      targetWindow
    );

    const fourPairAuthority = inspectAuthority(
      "fourPairAuthority",
      [
        "HEARTH.hexFourPairAuthority",
        "HEARTH.hearthHexFourPairAuthority",
        "HEARTH.fourPairAuthority",
        "HEARTH.hexFourPairPixelHandshakeAuthority",
        "DEXTER_LAB.hearthHexFourPairAuthority",
        "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY"
      ],
      targetWindow
    );

    const readyCount = [finger.observed, hexSurface.observed, fourPairAuthority.observed].filter(Boolean).length;

    return {
      receiptName: "FINGER_FILE_RECEIPT",
      status:
        readyCount >= 3
          ? "FINGER_FILE_RECEIPT_COMPLETE"
          : readyCount > 0 || southEnvelopePresent
            ? "FINGER_FILE_RECEIPT_PARTIAL"
            : "FINGER_FILE_RECEIPT_NOT_OBSERVED",
      southProbeToTruthHubTransferStatus: southEnvelopePresent
        ? "PROBE_SOUTH_DATA_RECEIVED_OR_AVAILABLE"
        : "PROBE_SOUTH_DIRECT_DATA_NOT_PRESENT_ALIAS_READ_ATTEMPTED",
      fingerInspect: {
        observed: finger.observed,
        path: finger.path,
        contract: finger.contract,
        receipt: finger.receipt
      },
      hexSurface: {
        observed: hexSurface.observed,
        path: hexSurface.path,
        contract: hexSurface.contract,
        receipt: hexSurface.receipt
      },
      fourPairAuthority: {
        observed: fourPairAuthority.observed,
        path: fourPairAuthority.path,
        contract: fourPairAuthority.contract,
        receipt: fourPairAuthority.receipt
      },
      readyCount,
      expectedReadyCount: 3,
      files: {
        probeSouthFile: PROBE_SOUTH_FILE,
        southSurfacePointerFile: SOUTH_SURFACE_POINTER_FILE,
        fingerInspectFile: FINGER_INSPECT_FILE,
        hexSurfaceFile: HEX_SURFACE_FILE,
        hexFourPairFile: HEX_FOUR_PAIR_FILE
      }
    };
  }

  function collectControlsDutyReceipt(controlsDuty) {
    return {
      receiptName: "CONTROLS_DUTY_LANE_RECEIPT",
      status: controlsDuty.CONTROL_DUTY_LANE_STATUS,
      laneClean: controlsDuty.CONTROL_DUTY_LANE_CLEAN,
      laneBlocking: controlsDuty.CONTROL_DUTY_LANE_BLOCKING,
      scriptPresent: controlsDuty.CONTROL_SCRIPT_PRESENT,
      authorityObserved: controlsDuty.CONTROL_AUTHORITY_OBSERVED,
      contract: controlsDuty.CONTROL_AUTHORITY_CONTRACT,
      contractRecognized: controlsDuty.CONTROL_AUTHORITY_CONTRACT_RECOGNIZED,
      handshakeAccepted: controlsDuty.CONTROL_HANDSHAKE_ACCEPTED,
      inputAdmissionOpen: controlsDuty.CONTROL_INPUT_ADMISSION_OPEN,
      inputBound: controlsDuty.CONTROL_INPUT_BOUND,
      deltaObserved: controlsDuty.CONTROL_DELTA_OBSERVED,
      canvasDeliveryConfirmed: controlsDuty.CONTROL_CANVAS_DELIVERY_CONFIRMED,
      packetCount: controlsDuty.CONTROL_PACKET_COUNT,
      deliveryCount: controlsDuty.CONTROL_DELIVERY_COUNT,
      coalescedFrameCount: controlsDuty.CONTROL_COALESCED_FRAME_COUNT,
      rawInputEventCount: controlsDuty.CONTROL_RAW_INPUT_EVENT_COUNT,
      receiverMethodResolved: controlsDuty.CONTROL_RECEIVER_METHOD_RESOLVED,
      dutiesArmed: controlsDuty.CONTROL_DUTIES_ARMED,
      dutiesPerformed: controlsDuty.CONTROL_DUTIES_PERFORMED,
      firstFailedCoordinate: controlsDuty.CONTROL_DUTY_FIRST_FAILED_COORDINATE,
      failureClass: controlsDuty.CONTROL_DUTY_FAILURE_CLASS,
      failureReason: controlsDuty.CONTROL_DUTY_FAILURE_REASON,
      recommendedFile: controlsDuty.CONTROL_DUTY_RECOMMENDED_FILE,
      recommendedAction: controlsDuty.CONTROL_DUTY_RECOMMENDED_ACTION
    };
  }

  function buildHubStatus(lab, diagnostic, canvasBishop, finger) {
    const lanes = [lab, diagnostic, canvasBishop, finger];
    const complete = lanes.filter((lane) => /COMPLETE$/.test(lane.status)).length;
    const partial = lanes.filter((lane) => /PARTIAL$/.test(lane.status)).length;

    if (complete === lanes.length) return "TRUTH_HUB_RECEIPT_BUNDLE_COMPLETE";
    if (complete || partial) return "TRUTH_HUB_RECEIPT_BUNDLE_PARTIAL";
    return "TRUTH_HUB_RECEIPT_BUNDLE_NOT_OBSERVED";
  }

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);

    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }

    if (isObject(lastSouthProbeEnvelope && lastSouthProbeEnvelope.report)) {
      return clonePlain(lastSouthProbeEnvelope.report);
    }

    return {};
  }

  function extractChronology(input, currentReport) {
    if (Array.isArray(input && input.chronology)) return clonePlain(input.chronology);
    if (Array.isArray(input && input.CHRONOLOGY_SEQUENCE)) return clonePlain(input.CHRONOLOGY_SEQUENCE);
    if (Array.isArray(input && input.CHRONOLOGY_SEQUENCE_JSON)) return clonePlain(input.CHRONOLOGY_SEQUENCE_JSON);

    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE_JSON)) return clonePlain(currentReport.CHRONOLOGY_SEQUENCE_JSON);
    if (Array.isArray(currentReport && currentReport.chronology)) return clonePlain(currentReport.chronology);

    return [];
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === "none") continue;

      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1200);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function makeAnchorReport() {
    return {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_ANCHOR_PACKET_v1_4",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      LINEAGE_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      ROUTE_CONDUCTOR_FILE,
      INDEX_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      CANVAS_LAUNCH_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_INTERNAL_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_INTERNAL_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "ANCHOR_READY",
      CANVAS_SURFACE_TRUTH_AVAILABLE: "UNKNOWN",
      TRUTH_HUB_ACTIVE: "true",
      TRUTH_HUB_STATUS: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "4",
      TRUTH_HUB_RECEIPT_ROUTES:
        "LAB_CARDINAL_RECEIPT_BUNDLE | DIAGNOSTIC_TRACK_RECEIPT | CANVAS_BISHOP_RECEIPT | FINGER_FILE_RECEIPT",
      TRUTH_HUB_PACKET_TEXT_SAFE: "true",
      RECEIPT_RETURN_MECHANISM_STATUS: "ANCHOR_SAFE_RECEIPT_READY",
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: "true",
      NORTH_READABLE_RECEIPT_SURFACE_READY: "true",

      CAUSAL_FORENSICS_LENS_ACTIVE: true,
      CAUSAL_FORENSICS_VERSION: "v1_4",
      CONTROLS_DUTY_LANE_ACTIVE: true,
      CONTROLS_DUTY_LANE_MODE: "PASSIVE_RECEIPT_AND_NAMESPACE_OBSERVATION_ONLY",
      CONTROLS_DUTY_LANE_DISRUPTION_RISK: "NONE_NO_METHOD_CALLS_EXCEPT_PASSIVE_RECEIPT_READS",

      TARGET_CONTEXT_STATUS: "NOT_RUN",
      TARGET_CONTEXT_SOURCE: "ANCHOR_ONLY",
      TARGET_ACCESS_ERROR: "NONE",

      CANVAS_SCRIPT_PRESENT: "UNKNOWN",
      CANVAS_SCRIPT_COUNT: 0,
      CANVAS_SCRIPT_SRC: "NOT_RUN",
      CANVAS_SCRIPT_CACHE_KEY: "NOT_RUN",
      CANVAS_SCRIPT_TAG_ORDER: "NOT_RUN",
      CANVAS_SCRIPT_LOAD_INFERRED: "UNKNOWN",
      CANVAS_SCRIPT_EXECUTION_INFERRED: "UNKNOWN",

      CANVAS_LAUNCH_SCRIPT_PRESENT: "UNKNOWN",
      CANVAS_LAUNCH_SCRIPT_COUNT: 0,
      CANVAS_LAUNCH_AUTHORITY_OBSERVED: "UNKNOWN",
      CANVAS_LAUNCH_AUTHORITY_PATH: "NONE",
      CANVAS_LAUNCH_PREFACE_HELD: "UNKNOWN",
      CANVAS_LAUNCH_PREFACE_DECOMMISSIONED: "UNKNOWN",

      ROUTE_CONDUCTOR_OBSERVED: "UNKNOWN",
      ROUTE_CONDUCTOR_SOURCE_PATH: "NONE",
      ROUTE_CONDUCTOR_CONTRACT: "UNKNOWN",
      ROUTE_CONDUCTOR_RECEIPT: "UNKNOWN",
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: "UNKNOWN",
      ROUTE_CONDUCTOR_CANVAS_ADMISSION_INTENT_PRESENT: "UNKNOWN",
      ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED: "UNKNOWN",
      ROUTE_CONDUCTOR_CANVAS_ADMISSION_STATUS: "UNKNOWN",
      ROUTE_CONDUCTOR_CANVAS_ADMISSION_REASON: "UNKNOWN",

      CONTROL_DUTY_LANE_STATUS: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CONTROL_DUTY_LANE_CLEAN: "UNKNOWN",
      CONTROL_DUTY_LANE_BLOCKING: "UNKNOWN",
      CONTROL_DUTY_FIRST_FAILED_COORDINATE: "NOT_RUN",
      CONTROL_DUTY_FAILURE_CLASS: "NOT_RUN",
      CONTROL_DUTY_FAILURE_REASON: "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL",
      CONTROL_DUTY_RECOMMENDED_OWNER: "NONE",
      CONTROL_DUTY_RECOMMENDED_FILE: "NONE",
      CONTROL_DUTY_RECOMMENDED_ACTION: "CALL_runProbeCanvasSurfaceTruth",
      CONTROL_SCRIPT_PRESENT: "UNKNOWN",
      CONTROL_AUTHORITY_OBSERVED: "UNKNOWN",
      CONTROL_AUTHORITY_CONTRACT: "UNKNOWN",
      CONTROL_AUTHORITY_CONTRACT_RECOGNIZED: "UNKNOWN",
      CONTROL_HANDSHAKE_ACCEPTED: "UNKNOWN",
      CONTROL_INPUT_ADMISSION_OPEN: "UNKNOWN",
      CONTROL_INPUT_BOUND: "UNKNOWN",
      CONTROL_DELTA_OBSERVED: "UNKNOWN",
      CONTROL_CANVAS_DELIVERY_CONFIRMED: "UNKNOWN",
      CONTROL_DUTIES_ARMED: "UNKNOWN",
      CONTROL_DUTIES_PERFORMED: "UNKNOWN",

      CANVAS_AUTHORITY_OBSERVED: "UNKNOWN",
      CANVAS_AUTHORITY_SCOPE: "NONE",
      CANVAS_AUTHORITY_SOURCE_PATH: "NONE",
      CANVAS_AUTHORITY_CONTRACT: "UNKNOWN",
      CANVAS_AUTHORITY_RECEIPT: "UNKNOWN",
      CANVAS_AUTHORITY_METHOD_COUNT: 0,
      CANVAS_AUTHORITY_METHODS: "NONE",
      CANVAS_AUTHORITY_CANDIDATE_COUNT: 0,
      CANVAS_AUTHORITY_CANDIDATES: "NONE",
      CANVAS_BOOT_OR_MOUNT_API_PRESENT: "UNKNOWN",
      CANVAS_DOM_SURFACE_INTENT_API_PRESENT: "UNKNOWN",
      CANVAS_STRONG_GOVERNED_SOURCE_RECEIVER_PRESENT: "UNKNOWN",
      CANVAS_WEAK_PACKET_RECEIVER_PRESENT: "UNKNOWN",

      CANVAS_MOUNT_FOUND: "UNKNOWN",
      CANVAS_ELEMENT_FOUND: "UNKNOWN",
      CANVAS_DOM_SURFACE_FOUND: "UNKNOWN",
      CANVAS_SELECTOR: "NOT_RUN",
      CANVAS_IN_MOUNT: "UNKNOWN",
      CANVAS_RECT_NONZERO: "UNKNOWN",
      CANVAS_COMPUTED_VISIBLE: "UNKNOWN",
      CANVAS_VIEWPORT_INTERSECTING: "UNKNOWN",
      CANVAS_CONTEXT_2D_READY: "UNKNOWN",
      CANVAS_PIXEL_SAMPLE_STATUS: "NO_PIXEL_SAMPLE_ANCHOR_ONLY",
      CANVAS_PIXEL_VISIBLE: "UNKNOWN",
      CANVAS_LAYER_BLOCKED: "UNKNOWN",
      CANVAS_LAYER_BLOCKER: "UNKNOWN",
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: "UNKNOWN",
      CANVAS_PARENT_CONTRACT_RECOGNIZED: "UNKNOWN",

      CANVAS_TRUTH_STATUS: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_CLASS: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_REASON: "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "NONE",
      CANVAS_TRUTH_RECOMMENDED_FILE: "NONE",
      CANVAS_TRUTH_RECOMMENDED_ACTION:
        "CALL_runProbeCanvasSurfaceTruth_TO_MEASURE_CANVAS_SURFACE",
      FINAL_ARBITRATION_SOURCE_LANE: "ANCHOR_ONLY",
      DIAGNOSTIC_CERTAINTY: "ANCHOR_ONLY",
      OBSERVABLE_CAUSE: "ANCHOR_PUBLISHED_TARGET_NOT_YET_PROBED",
      RECOMMENDED_NEXT_FILE: "NONE",
      RECOMMENDED_NEXT_ACTION: "CALL_runProbeCanvasSurfaceTruth",

      LAB_CARDINAL_RECEIPT_BUNDLE_STATUS: "ANCHOR_READY",
      DIAGNOSTIC_TRACK_RECEIPT_STATUS: "ANCHOR_READY",
      CANVAS_BISHOP_RECEIPT_STATUS: "ANCHOR_READY",
      FINGER_FILE_RECEIPT_STATUS: "ANCHOR_READY",
      CONTROLS_DUTY_RECEIPT_STATUS: "ANCHOR_READY",
      PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS: "ANCHOR_READY",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_ANCHOR_PUBLISHED_SYNCHRONOUSLY | TARGET_NOT_YET_PROBED | CONTROLS_DUTY_LANE_PASSIVE_ONLY | NO_PRODUCTION_MUTATION_AUTHORIZED",
      CANVAS_SURFACE_TRUTH_NOTES:
        "ANCHOR_SAFE_CHRONOLOGY_OBSERVATION_READY | HEAVY_TARGET_PROBE_NOT_RUN_DURING_PUBLISH",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function inspectCanvasSurfaceTruth(payload = {}) {
    const startedAt = nowIso();
    const currentReport = extractCurrentReport(payload);
    const chronology = extractChronology(payload, currentReport);
    const context = getTargetContext(payload);

    const targetWindow = context.targetWindow;
    const targetDocument = context.targetDocument;

    const canvasScript = scriptInfo(targetDocument, CANVAS_FILE);
    const canvasLaunchScript = scriptInfo(targetDocument, CANVAS_LAUNCH_FILE);
    const routeScript = scriptInfo(targetDocument, ROUTE_CONDUCTOR_FILE);
    const indexScript = scriptInfo(targetDocument, INDEX_FILE);
    const controlScript = scriptInfo(targetDocument, CONTROL_FILE);

    const routeAuthority = inspectAuthority(
      "routeConductor",
      ROUTE_CONDUCTOR_ALIASES,
      targetWindow
    );

    const canvasAuthority = inspectAuthority(
      "canvasAuthority",
      CANVAS_ALIASES,
      targetWindow
    );

    const routeAdmission = inspectRouteConductorAdmission(routeAuthority);
    const domReport = inspectCanvasDom(targetWindow, targetDocument, canvasAuthority);
    const controlsDuty = inspectControlsDuty(targetWindow, targetDocument, controlScript);

    const canvasBootOrMountApiPresent = Boolean(
      canvasAuthority.authority &&
        ["boot", "init", "start", "mount", "render", "draw", "refresh"]
          .some((method) => isFunction(canvasAuthority.authority[method]))
    );

    const canvasDomSurfaceIntentApiPresent = Boolean(
      canvasAuthority.authority &&
        [
          "getCanvasElement",
          "getDomCanvas",
          "getSurface",
          "getCanvasStationReceipt",
          "getVisiblePlanetReceipt",
          "receiveRouteConductorReleasePacket",
          "receiveRouteConductorCanvasGovernedHandoffPacket"
        ].some((method) => isFunction(canvasAuthority.authority[method]))
    );

    const strongReceiver = canvasAuthority.authority
      ? STRONG_CANVAS_SOURCE_RECEIVERS.find((method) => isFunction(canvasAuthority.authority[method])) || "NONE"
      : "NONE";

    const weakReceiver = canvasAuthority.authority
      ? WEAK_CANVAS_PACKET_RECEIVERS.find((method) => isFunction(canvasAuthority.authority[method])) || "NONE"
      : "NONE";

    const canvasScriptExecutionInferred = Boolean(
      canvasScript.present &&
        (
          canvasAuthority.observed ||
          domReport.CANVAS_ELEMENT_FOUND === true ||
          dataValue(targetDocument, "hearthCanvasLoaded") === "true" ||
          dataValue(targetDocument, "hearthCanvasHubActive") === "true" ||
          dataValue(targetDocument, "hearthCanvasExpressionHubActive") === "true"
        )
    );

    const canvasScriptLoadInferred = Boolean(
      canvasScript.present &&
        (
          canvasScriptExecutionInferred ||
          canvasScript.src !== "NONE" ||
          canvasScript.count > 0
        )
    );

    const canvasParentContractRecognized = Boolean(
      recognizedCanvasContract(canvasAuthority.contract) ||
      recognizedCanvasContract(domReport.CANVAS_DATASET_CONTRACT)
    );

    const baseReport = {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_PACKET_v1_4",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      LINEAGE_INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      ROUTE_CONDUCTOR_FILE,
      INDEX_FILE,
      CONTROL_FILE,
      CANVAS_FILE,
      CANVAS_LAUNCH_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_INTERNAL_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CONTROL_INTERNAL_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: startedAt,

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED",
      CANVAS_SURFACE_TRUTH_AVAILABLE: boolText(context.targetAvailable, "false"),
      TRUTH_HUB_ACTIVE: "true",
      TRUTH_HUB_RECEIPT_LANE_COUNT: "4",
      TRUTH_HUB_RECEIPT_ROUTES:
        "LAB_CARDINAL_RECEIPT_BUNDLE | DIAGNOSTIC_TRACK_RECEIPT | CANVAS_BISHOP_RECEIPT | FINGER_FILE_RECEIPT",
      TRUTH_HUB_PACKET_TEXT_SAFE: "true",
      RECEIPT_RETURN_MECHANISM_STATUS:
        "TRUTH_HUB_COMPACT_RECEIPT_RETURN_READY",
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: "true",
      NORTH_READABLE_RECEIPT_SURFACE_READY: "true",

      CAUSAL_FORENSICS_LENS_ACTIVE: true,
      CAUSAL_FORENSICS_VERSION: "v1_4",
      CONTROLS_DUTY_LANE_ACTIVE: true,
      CONTROLS_DUTY_LANE_MODE: "PASSIVE_RECEIPT_AND_NAMESPACE_OBSERVATION_ONLY",
      CONTROLS_DUTY_LANE_DISRUPTION_RISK: "NONE_NO_METHOD_CALLS_EXCEPT_PASSIVE_RECEIPT_READS",

      TARGET_CONTEXT_STATUS:
        context.targetAvailable
          ? "TARGET_CONTEXT_AVAILABLE"
          : "TARGET_CONTEXT_UNAVAILABLE",
      TARGET_CONTEXT_SOURCE: context.targetSource,
      TARGET_ACCESS_ERROR: context.targetAccessError,

      CANVAS_SCRIPT_PRESENT: canvasScript.present,
      CANVAS_SCRIPT_COUNT: canvasScript.count,
      CANVAS_SCRIPT_SRC: canvasScript.src,
      CANVAS_SCRIPT_CACHE_KEY: canvasScript.cacheKey,
      CANVAS_SCRIPT_TAG_ORDER: canvasScript.lastOrder || "NONE",
      CANVAS_SCRIPT_LOAD_INFERRED: canvasScriptLoadInferred,
      CANVAS_SCRIPT_EXECUTION_INFERRED: canvasScriptExecutionInferred,

      CANVAS_LAUNCH_SCRIPT_PRESENT: canvasLaunchScript.present,
      CANVAS_LAUNCH_SCRIPT_COUNT: canvasLaunchScript.count,
      CANVAS_LAUNCH_AUTHORITY_OBSERVED: false,
      CANVAS_LAUNCH_AUTHORITY_PATH: "NONE",
      CANVAS_LAUNCH_PREFACE_HELD: "UNKNOWN",
      CANVAS_LAUNCH_PREFACE_DECOMMISSIONED: "UNKNOWN",

      ROUTE_CONDUCTOR_SCRIPT_PRESENT: routeScript.present,
      ROUTE_CONDUCTOR_SCRIPT_COUNT: routeScript.count,
      ROUTE_CONDUCTOR_SCRIPT_SRC: routeScript.src,
      ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY: routeScript.cacheKey,
      INDEX_SCRIPT_PRESENT: indexScript.present,
      INDEX_SCRIPT_SRC: indexScript.src,

      ROUTE_CONDUCTOR_OBSERVED: routeAuthority.observed,
      ROUTE_CONDUCTOR_SOURCE_PATH: routeAuthority.path,
      ROUTE_CONDUCTOR_SCOPE: routeAuthority.scope,
      ROUTE_CONDUCTOR_CONTRACT: routeAuthority.contract,
      ROUTE_CONDUCTOR_RECEIPT: routeAuthority.receipt,
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED:
        recognizedRouteConductorContract(routeAuthority.contract),
      ROUTE_CONDUCTOR_METHOD_COUNT: routeAuthority.methodCount,
      ROUTE_CONDUCTOR_METHODS: routeAuthority.methods.join(",") || "NONE",
      ROUTE_CONDUCTOR_CANDIDATE_COUNT: routeAuthority.candidates.length,
      ROUTE_CONDUCTOR_CANDIDATES: routeAuthority.candidates,

      ROUTE_CONDUCTOR_CANVAS_ADMISSION_INTENT_PRESENT:
        routeAdmission.intentPresent,
      ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED:
        routeAdmission.resultExported,
      ROUTE_CONDUCTOR_CANVAS_ADMISSION_STATUS: routeAdmission.status,
      ROUTE_CONDUCTOR_CANVAS_ADMISSION_REASON: routeAdmission.reason,
      ROUTE_CONDUCTOR_SOURCE_STACK_STATUS: routeAdmission.sourceStackStatus,
      ROUTE_CONDUCTOR_SOURCE_STACK_READY: routeAdmission.sourceStackReady,
      ROUTE_CONDUCTOR_GOVERNED_SOURCE_PACKET_ACCEPTED_BY_CANVAS:
        routeAdmission.governedSourcePacketAcceptedByCanvas,

      ...controlsDuty,

      CANVAS_AUTHORITY_OBSERVED: canvasAuthority.observed,
      CANVAS_AUTHORITY_SCOPE: canvasAuthority.scope,
      CANVAS_AUTHORITY_SOURCE_PATH: canvasAuthority.path,
      CANVAS_AUTHORITY_CONTRACT: canvasAuthority.contract,
      CANVAS_AUTHORITY_RECEIPT: canvasAuthority.receipt,
      CANVAS_AUTHORITY_METHOD_COUNT: canvasAuthority.methodCount,
      CANVAS_AUTHORITY_METHODS: canvasAuthority.methods.join(",") || "NONE",
      CANVAS_AUTHORITY_CANDIDATE_COUNT: canvasAuthority.candidates.length,
      CANVAS_AUTHORITY_CANDIDATES: canvasAuthority.candidates,
      CANVAS_BOOT_OR_MOUNT_API_PRESENT: canvasBootOrMountApiPresent,
      CANVAS_DOM_SURFACE_INTENT_API_PRESENT: canvasDomSurfaceIntentApiPresent,
      CANVAS_STRONG_GOVERNED_SOURCE_RECEIVER_PRESENT: strongReceiver !== "NONE",
      CANVAS_STRONG_GOVERNED_SOURCE_RECEIVER_METHOD: strongReceiver,
      CANVAS_WEAK_PACKET_RECEIVER_PRESENT: weakReceiver !== "NONE",
      CANVAS_WEAK_PACKET_RECEIVER_METHOD: weakReceiver,

      CANVAS_NAMESPACE_PRESENT: canvasAuthority.observed,
      CANVAS_NAMESPACE_PATH: canvasAuthority.path,
      CANVAS_NAMESPACE_CONTRACT: canvasAuthority.contract,
      CANVAS_NAMESPACE_RECEIPT: canvasAuthority.receipt,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: canvasParentContractRecognized,

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      ...domReport,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    delete baseReport.authority;

    const canvasFailure = resolveCanvasFailure(baseReport);
    const finalFailure = resolveFinalFailure(canvasFailure, controlsDuty);

    const canvasReport = {
      ...baseReport,
      CANVAS_SURFACE_TRUTH_LANE_STATUS:
        canvasFailure.coordinate === "NONE"
          ? "CANVAS_SURFACE_TRUTH_LANE_PASSED_NO_FINAL_CLAIM"
          : "CANVAS_SURFACE_TRUTH_LANE_FAILED",
      CANVAS_SURFACE_TRUTH_LANE_CLEAN: canvasFailure.coordinate === "NONE",
      CANVAS_SURFACE_TRUTH_LANE_FIRST_FAILED_COORDINATE: canvasFailure.coordinate,
      CANVAS_SURFACE_TRUTH_LANE_FAILURE_CLASS: canvasFailure.failureClass,
      CANVAS_SURFACE_TRUTH_LANE_FAILURE_REASON: canvasFailure.reason,

      CANVAS_TRUTH_STATUS:
        finalFailure.coordinate === "NONE"
          ? "CANVAS_SURFACE_TRUTH_PROVEN_NO_FINAL_CLAIM"
          : finalFailure.sourceLane === "CONTROLS_DUTY_LANE"
            ? "CANVAS_SURFACE_TRUTH_PROVEN_CONTROLS_DUTY_FAILED"
            : "CANVAS_SURFACE_TRUTH_FAILED_AT_COORDINATE",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: finalFailure.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: finalFailure.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: finalFailure.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: finalFailure.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: finalFailure.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: finalFailure.action,
      FINAL_ARBITRATION_SOURCE_LANE: finalFailure.sourceLane,
      DIAGNOSTIC_CERTAINTY: finalFailure.certainty,
      OBSERVABLE_CAUSE: `${finalFailure.sourceLane}:${finalFailure.coordinate}:${finalFailure.failureClass}:${finalFailure.reason}`,
      RECOMMENDED_NEXT_FILE: finalFailure.file,
      RECOMMENDED_NEXT_ACTION: finalFailure.action
    };

    const labBundle = collectLabCardinalReceiptBundle(targetWindow, currentReport);
    const diagnosticTrackReceipt = collectDiagnosticTrackReceipt(currentReport, chronology);
    const canvasBishopReceipt = collectCanvasBishopReceipt(canvasReport, routeAuthority, canvasAuthority);
    const fingerFileReceipt = collectFingerFileReceipt(targetWindow, currentReport, payload);
    const controlsDutyReceipt = collectControlsDutyReceipt(controlsDuty);

    const truthHubStatus = buildHubStatus(
      labBundle,
      diagnosticTrackReceipt,
      canvasBishopReceipt,
      fingerFileReceipt
    );

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "CANVAS_SURFACE_TRUTH_CONTROLS_DUTY_LANE_ACTIVE",
      "F21_LENS_DISTINGUISHES_SCRIPT_AUTHORITY_DOM_BINDING_ROUTE_ADMISSION_AND_CONTROLS_DUTY",
      `CANVAS_SCRIPT_PRESENT:${canvasReport.CANVAS_SCRIPT_PRESENT}`,
      `CANVAS_SCRIPT_EXECUTION_INFERRED:${canvasReport.CANVAS_SCRIPT_EXECUTION_INFERRED}`,
      `ROUTE_CONDUCTOR_OBSERVED:${canvasReport.ROUTE_CONDUCTOR_OBSERVED}`,
      `ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED:${canvasReport.ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED}`,
      `CANVAS_AUTHORITY_OBSERVED:${canvasReport.CANVAS_AUTHORITY_OBSERVED}`,
      `CANVAS_DOM_SURFACE_FOUND:${canvasReport.CANVAS_DOM_SURFACE_FOUND}`,
      `CONTROL_SCRIPT_PRESENT:${canvasReport.CONTROL_SCRIPT_PRESENT}`,
      `CONTROL_AUTHORITY_OBSERVED:${canvasReport.CONTROL_AUTHORITY_OBSERVED}`,
      `CONTROL_HANDSHAKE_ACCEPTED:${canvasReport.CONTROL_HANDSHAKE_ACCEPTED}`,
      `CONTROL_INPUT_BOUND:${canvasReport.CONTROL_INPUT_BOUND}`,
      `CONTROL_DELTA_OBSERVED:${canvasReport.CONTROL_DELTA_OBSERVED}`,
      `CONTROL_CANVAS_DELIVERY_CONFIRMED:${canvasReport.CONTROL_CANVAS_DELIVERY_CONFIRMED}`,
      `CONTROL_DUTY_LANE_STATUS:${canvasReport.CONTROL_DUTY_LANE_STATUS}`,
      `CANVAS_TRUTH_FIRST_FAILED_COORDINATE:${canvasReport.CANVAS_TRUTH_FIRST_FAILED_COORDINATE}`,
      `CANVAS_TRUTH_FAILURE_CLASS:${canvasReport.CANVAS_TRUTH_FAILURE_CLASS}`,
      `FINAL_ARBITRATION_SOURCE_LANE:${canvasReport.FINAL_ARBITRATION_SOURCE_LANE}`,
      `TRUTH_HUB_STATUS:${truthHubStatus}`,
      "TRUTH_HUB_DOES_NOT_DRAW_CANVAS",
      "TRUTH_HUB_DOES_NOT_MUTATE_PRODUCTION",
      "CONTROLS_DUTY_LANE_DOES_NOT_CALL_CONTROLS_DUTY_METHODS"
    );

    const report = {
      ...canvasReport,
      TRUTH_HUB_STATUS: truthHubStatus,

      LAB_CARDINAL_RECEIPT_BUNDLE_STATUS: labBundle.status,
      LAB_CARDINAL_RECEIPT_BUNDLE: labBundle,

      DIAGNOSTIC_TRACK_RECEIPT_STATUS: diagnosticTrackReceipt.status,
      DIAGNOSTIC_TRACK_RECEIPT: diagnosticTrackReceipt,

      CANVAS_BISHOP_RECEIPT_STATUS: canvasBishopReceipt.status,
      CANVAS_BISHOP_RECEIPT: canvasBishopReceipt,

      FINGER_FILE_RECEIPT_STATUS: fingerFileReceipt.status,
      FINGER_FILE_RECEIPT: fingerFileReceipt,

      CONTROLS_DUTY_RECEIPT_STATUS: controlsDutyReceipt.status,
      CONTROLS_DUTY_RECEIPT: controlsDutyReceipt,

      PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS:
        fingerFileReceipt.southProbeToTruthHubTransferStatus,

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      CANVAS_SURFACE_TRUTH_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    lastReport = clonePlain(report);
    lastReceipt = buildReceipt(report);
    lastPacketText = composePacketText(report);
    lastCompactSummary = composeCompactSummary(report);

    publish();

    return clonePlain(report);
  }

  function buildReceipt(report = lastReport || makeAnchorReport()) {
    const r = report || makeAnchorReport();

    return {
      packetType: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1_4",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
      lineageInternalRenewalReceipt: LINEAGE_INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      canvasLaunchFile: CANVAS_LAUNCH_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,

      diagnosticOnly: true,
      anchorSafeChronologyObservation: true,
      causalForensicsLensActive: true,
      causalForensicsVersion: "v1_4",
      controlsDutyLaneActive: true,
      controlsDutyLaneMode: "PASSIVE_RECEIPT_AND_NAMESPACE_OBSERVATION_ONLY",
      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,

      canvasSurfaceTruthProbeStatus: getRaw(
        r,
        "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
        "ANCHOR_READY"
      ),
      canvasSurfaceTruthAvailable: getRaw(
        r,
        "CANVAS_SURFACE_TRUTH_AVAILABLE",
        "UNKNOWN"
      ),
      truthHubActive: true,
      truthHubStatus: getRaw(
        r,
        "TRUTH_HUB_STATUS",
        "ANCHOR_READY_TARGET_NOT_YET_PROBED"
      ),
      receiptLaneCount: 4,

      targetContextStatus: getRaw(r, "TARGET_CONTEXT_STATUS", "UNKNOWN"),
      targetContextSource: getRaw(r, "TARGET_CONTEXT_SOURCE", "UNKNOWN"),

      canvasScriptPresent: getRaw(r, "CANVAS_SCRIPT_PRESENT", "UNKNOWN"),
      canvasScriptCount: getRaw(r, "CANVAS_SCRIPT_COUNT", 0),
      canvasScriptSrc: getRaw(r, "CANVAS_SCRIPT_SRC", "UNKNOWN"),
      canvasScriptTagOrder: getRaw(r, "CANVAS_SCRIPT_TAG_ORDER", "UNKNOWN"),
      canvasScriptLoadInferred: getRaw(r, "CANVAS_SCRIPT_LOAD_INFERRED", "UNKNOWN"),
      canvasScriptExecutionInferred: getRaw(r, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN"),

      routeConductorObserved: getRaw(r, "ROUTE_CONDUCTOR_OBSERVED", "UNKNOWN"),
      routeConductorSourcePath: getRaw(r, "ROUTE_CONDUCTOR_SOURCE_PATH", "NONE"),
      routeConductorContract: getRaw(r, "ROUTE_CONDUCTOR_CONTRACT", "UNKNOWN"),
      routeConductorCanvasAdmissionIntentPresent: getRaw(
        r,
        "ROUTE_CONDUCTOR_CANVAS_ADMISSION_INTENT_PRESENT",
        "UNKNOWN"
      ),
      routeConductorCanvasAdmissionResultExported: getRaw(
        r,
        "ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED",
        "UNKNOWN"
      ),
      routeConductorCanvasAdmissionStatus: getRaw(
        r,
        "ROUTE_CONDUCTOR_CANVAS_ADMISSION_STATUS",
        "UNKNOWN"
      ),
      routeConductorCanvasAdmissionReason: getRaw(
        r,
        "ROUTE_CONDUCTOR_CANVAS_ADMISSION_REASON",
        "UNKNOWN"
      ),

      controlsDutyLaneStatus: getRaw(r, "CONTROL_DUTY_LANE_STATUS", "UNKNOWN"),
      controlsDutyLaneClean: getRaw(r, "CONTROL_DUTY_LANE_CLEAN", "UNKNOWN"),
      controlsDutyLaneBlocking: getRaw(r, "CONTROL_DUTY_LANE_BLOCKING", "UNKNOWN"),
      controlsDutyFirstFailedCoordinate: getRaw(r, "CONTROL_DUTY_FIRST_FAILED_COORDINATE", "UNKNOWN"),
      controlsDutyFailureClass: getRaw(r, "CONTROL_DUTY_FAILURE_CLASS", "UNKNOWN"),
      controlsDutyFailureReason: getRaw(r, "CONTROL_DUTY_FAILURE_REASON", "UNKNOWN"),
      controlsDutyRecommendedFile: getRaw(r, "CONTROL_DUTY_RECOMMENDED_FILE", "UNKNOWN"),
      controlsDutyRecommendedAction: getRaw(r, "CONTROL_DUTY_RECOMMENDED_ACTION", "UNKNOWN"),

      controlScriptPresent: getRaw(r, "CONTROL_SCRIPT_PRESENT", "UNKNOWN"),
      controlAuthorityObserved: getRaw(r, "CONTROL_AUTHORITY_OBSERVED", "UNKNOWN"),
      controlAuthorityContract: getRaw(r, "CONTROL_AUTHORITY_CONTRACT", "UNKNOWN"),
      controlAuthorityContractRecognized: getRaw(r, "CONTROL_AUTHORITY_CONTRACT_RECOGNIZED", "UNKNOWN"),
      controlHandshakeReceiverPresent: getRaw(r, "CONTROL_HANDSHAKE_RECEIVER_PRESENT", "UNKNOWN"),
      controlDutyApiReady: getRaw(r, "CONTROL_DUTY_API_READY", "UNKNOWN"),
      controlHandshakeAccepted: getRaw(r, "CONTROL_HANDSHAKE_ACCEPTED", "UNKNOWN"),
      controlInputAdmissionOpen: getRaw(r, "CONTROL_INPUT_ADMISSION_OPEN", "UNKNOWN"),
      controlInputBound: getRaw(r, "CONTROL_INPUT_BOUND", "UNKNOWN"),
      controlDeltaObserved: getRaw(r, "CONTROL_DELTA_OBSERVED", "UNKNOWN"),
      controlCanvasDeliveryConfirmed: getRaw(r, "CONTROL_CANVAS_DELIVERY_CONFIRMED", "UNKNOWN"),
      controlPacketCount: getRaw(r, "CONTROL_PACKET_COUNT", 0),
      controlDeliveryCount: getRaw(r, "CONTROL_DELIVERY_COUNT", 0),
      controlCoalescedFrameCount: getRaw(r, "CONTROL_COALESCED_FRAME_COUNT", 0),
      controlRawInputEventCount: getRaw(r, "CONTROL_RAW_INPUT_EVENT_COUNT", 0),
      controlDutiesArmed: getRaw(r, "CONTROL_DUTIES_ARMED", "UNKNOWN"),
      controlDutiesPerformed: getRaw(r, "CONTROL_DUTIES_PERFORMED", "UNKNOWN"),

      canvasAuthorityObserved: getRaw(r, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN"),
      canvasAuthoritySourcePath: getRaw(r, "CANVAS_AUTHORITY_SOURCE_PATH", "NONE"),
      canvasAuthorityContract: getRaw(r, "CANVAS_AUTHORITY_CONTRACT", "UNKNOWN"),
      canvasAuthorityReceipt: getRaw(r, "CANVAS_AUTHORITY_RECEIPT", "UNKNOWN"),
      canvasBootOrMountApiPresent: getRaw(
        r,
        "CANVAS_BOOT_OR_MOUNT_API_PRESENT",
        "UNKNOWN"
      ),
      canvasDomSurfaceIntentApiPresent: getRaw(
        r,
        "CANVAS_DOM_SURFACE_INTENT_API_PRESENT",
        "UNKNOWN"
      ),

      canvasElementFound: getRaw(r, "CANVAS_ELEMENT_FOUND", "UNKNOWN"),
      canvasDomSurfaceFound: getRaw(r, "CANVAS_DOM_SURFACE_FOUND", "UNKNOWN"),
      canvasMountFound: getRaw(r, "CANVAS_MOUNT_FOUND", "UNKNOWN"),
      canvasInMount: getRaw(r, "CANVAS_IN_MOUNT", "UNKNOWN"),
      canvasRectNonzero: getRaw(r, "CANVAS_RECT_NONZERO", "UNKNOWN"),
      canvasComputedVisible: getRaw(r, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN"),
      canvasViewportIntersecting: getRaw(r, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN"),
      canvasContext2dReady: getRaw(r, "CANVAS_CONTEXT_2D_READY", "UNKNOWN"),
      canvasPixelSampleStatus: getRaw(r, "CANVAS_PIXEL_SAMPLE_STATUS", "NO_PIXEL_SAMPLE"),
      canvasPixelVisible: getRaw(r, "CANVAS_PIXEL_VISIBLE", "UNKNOWN"),
      canvasLayerBlocked: getRaw(r, "CANVAS_LAYER_BLOCKED", "UNKNOWN"),
      canvasNamespaceMatchesDomSurface: getRaw(
        r,
        "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE",
        "UNKNOWN"
      ),
      canvasParentContractRecognized: getRaw(
        r,
        "CANVAS_PARENT_CONTRACT_RECOGNIZED",
        "UNKNOWN"
      ),

      canvasSurfaceTruthLaneStatus: getRaw(
        r,
        "CANVAS_SURFACE_TRUTH_LANE_STATUS",
        "UNKNOWN"
      ),
      canvasTruthStatus: getRaw(
        r,
        "CANVAS_TRUTH_STATUS",
        "ANCHOR_READY_TARGET_NOT_YET_PROBED"
      ),
      canvasTruthFirstFailedCoordinate: getRaw(
        r,
        "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
        "NOT_RUN"
      ),
      canvasTruthFailureClass: getRaw(r, "CANVAS_TRUTH_FAILURE_CLASS", "NOT_RUN"),
      canvasTruthFailureReason: getRaw(
        r,
        "CANVAS_TRUTH_FAILURE_REASON",
        "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL"
      ),
      canvasTruthRecommendedOwner: getRaw(
        r,
        "CANVAS_TRUTH_RECOMMENDED_OWNER",
        "NONE"
      ),
      canvasTruthRecommendedFile: getRaw(
        r,
        "CANVAS_TRUTH_RECOMMENDED_FILE",
        "NONE"
      ),
      canvasTruthRecommendedAction: getRaw(
        r,
        "CANVAS_TRUTH_RECOMMENDED_ACTION",
        "CALL_runProbeCanvasSurfaceTruth_TO_MEASURE_CANVAS_SURFACE"
      ),
      finalArbitrationSourceLane: getRaw(r, "FINAL_ARBITRATION_SOURCE_LANE", "UNKNOWN"),
      diagnosticCertainty: getRaw(r, "DIAGNOSTIC_CERTAINTY", "UNKNOWN"),
      observableCause: getRaw(r, "OBSERVABLE_CAUSE", "UNKNOWN"),
      recommendedNextFile: getRaw(r, "RECOMMENDED_NEXT_FILE", "NONE"),
      recommendedNextAction: getRaw(r, "RECOMMENDED_NEXT_ACTION", "NONE"),

      runProbeCanvasSurfaceTruthApiAvailable: true,
      runCanvasSurfaceTruthApiAvailable: true,
      receiveSouthProbeReceiptApiAvailable: true,
      receiveProbeSouthReceiptApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReport() {
    return clonePlain(lastReport || makeAnchorReport());
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
      labCardinalReceiptBundle: clonePlain(getRaw(report, "LAB_CARDINAL_RECEIPT_BUNDLE", {})),
      diagnosticTrackReceipt: clonePlain(getRaw(report, "DIAGNOSTIC_TRACK_RECEIPT", {})),
      canvasBishopReceipt: clonePlain(getRaw(report, "CANVAS_BISHOP_RECEIPT", {})),
      fingerFileReceipt: clonePlain(getRaw(report, "FINGER_FILE_RECEIPT", {})),
      controlsDutyReceipt: clonePlain(getRaw(report, "CONTROLS_DUTY_RECEIPT", {})),
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
      acceptedControlContracts: ACCEPTED_CONTROL_CONTRACTS.slice(),
      canvasSelectors: CANVAS_SELECTORS.slice(),
      mountSelectors: MOUNT_SELECTORS.slice(),
      supportsAnchorSafeChronologyObservation: true,
      supportsCoordinateSpecificFailure: true,
      supportsRouteConductorAdmissionForensics: true,
      supportsControlsDutyLane: true,
      supportsControlsReadyVsPerformedDistinction: true,
      supportsFourLaneReceiptHub: true,
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
      "LINEAGE_INTERNAL_RENEWAL_CONTRACT",
      "LINEAGE_INTERNAL_RENEWAL_RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "ROUTE_CONDUCTOR_FILE",
      "INDEX_FILE",
      "CONTROL_FILE",
      "CANVAS_FILE",
      "CANVAS_LAUNCH_FILE",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_INTERNAL_CONTRACT",
      "EXPECTED_CONTROL_CONTRACT",
      "EXPECTED_CONTROL_INTERNAL_CONTRACT",
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_SURFACE_TRUTH_AVAILABLE",
      "TRUTH_HUB_ACTIVE",
      "TRUTH_HUB_STATUS",
      "TRUTH_HUB_RECEIPT_LANE_COUNT",
      "TRUTH_HUB_RECEIPT_ROUTES",
      "TRUTH_HUB_PACKET_TEXT_SAFE",
      "RECEIPT_RETURN_MECHANISM_STATUS",
      "DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY",
      "NORTH_READABLE_RECEIPT_SURFACE_READY",

      "CAUSAL_FORENSICS_LENS_ACTIVE",
      "CAUSAL_FORENSICS_VERSION",
      "CONTROLS_DUTY_LANE_ACTIVE",
      "CONTROLS_DUTY_LANE_MODE",
      "CONTROLS_DUTY_LANE_DISRUPTION_RISK",
      "TARGET_CONTEXT_STATUS",
      "TARGET_CONTEXT_SOURCE",
      "TARGET_ACCESS_ERROR",

      "CANVAS_SCRIPT_PRESENT",
      "CANVAS_SCRIPT_COUNT",
      "CANVAS_SCRIPT_SRC",
      "CANVAS_SCRIPT_CACHE_KEY",
      "CANVAS_SCRIPT_TAG_ORDER",
      "CANVAS_SCRIPT_LOAD_INFERRED",
      "CANVAS_SCRIPT_EXECUTION_INFERRED",

      "CANVAS_LAUNCH_SCRIPT_PRESENT",
      "CANVAS_LAUNCH_SCRIPT_COUNT",
      "CANVAS_LAUNCH_AUTHORITY_OBSERVED",
      "CANVAS_LAUNCH_AUTHORITY_PATH",
      "CANVAS_LAUNCH_PREFACE_HELD",
      "CANVAS_LAUNCH_PREFACE_DECOMMISSIONED",

      "ROUTE_CONDUCTOR_SCRIPT_PRESENT",
      "ROUTE_CONDUCTOR_SCRIPT_COUNT",
      "ROUTE_CONDUCTOR_SCRIPT_SRC",
      "ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY",
      "INDEX_SCRIPT_PRESENT",
      "INDEX_SCRIPT_SRC",

      "ROUTE_CONDUCTOR_OBSERVED",
      "ROUTE_CONDUCTOR_SOURCE_PATH",
      "ROUTE_CONDUCTOR_SCOPE",
      "ROUTE_CONDUCTOR_CONTRACT",
      "ROUTE_CONDUCTOR_RECEIPT",
      "ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED",
      "ROUTE_CONDUCTOR_METHOD_COUNT",
      "ROUTE_CONDUCTOR_METHODS",
      "ROUTE_CONDUCTOR_CANDIDATE_COUNT",
      "ROUTE_CONDUCTOR_CANDIDATES",
      "ROUTE_CONDUCTOR_CANVAS_ADMISSION_INTENT_PRESENT",
      "ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED",
      "ROUTE_CONDUCTOR_CANVAS_ADMISSION_STATUS",
      "ROUTE_CONDUCTOR_CANVAS_ADMISSION_REASON",
      "ROUTE_CONDUCTOR_SOURCE_STACK_STATUS",
      "ROUTE_CONDUCTOR_SOURCE_STACK_READY",
      "ROUTE_CONDUCTOR_GOVERNED_SOURCE_PACKET_ACCEPTED_BY_CANVAS",

      "CONTROL_DUTY_LANE_ACTIVE",
      "CONTROL_DUTY_LANE_STATUS",
      "CONTROL_DUTY_LANE_CLEAN",
      "CONTROL_DUTY_LANE_BLOCKING",
      "CONTROL_DUTY_FIRST_FAILED_COORDINATE",
      "CONTROL_DUTY_FAILURE_CLASS",
      "CONTROL_DUTY_FAILURE_REASON",
      "CONTROL_DUTY_RECOMMENDED_OWNER",
      "CONTROL_DUTY_RECOMMENDED_FILE",
      "CONTROL_DUTY_RECOMMENDED_ACTION",

      "CONTROL_SCRIPT_PRESENT",
      "CONTROL_SCRIPT_COUNT",
      "CONTROL_SCRIPT_SRC",
      "CONTROL_SCRIPT_CACHE_KEY",
      "CONTROL_SCRIPT_TAG_ORDER",
      "CONTROL_AUTHORITY_OBSERVED",
      "CONTROL_AUTHORITY_SCOPE",
      "CONTROL_AUTHORITY_SOURCE_PATH",
      "CONTROL_AUTHORITY_CONTRACT",
      "CONTROL_AUTHORITY_RECEIPT",
      "CONTROL_AUTHORITY_CONTRACT_RECOGNIZED",
      "CONTROL_AUTHORITY_METHOD_COUNT",
      "CONTROL_AUTHORITY_METHODS",
      "CONTROL_AUTHORITY_CANDIDATE_COUNT",
      "CONTROL_AUTHORITY_CANDIDATES",
      "CONTROL_HANDSHAKE_RECEIVER_PRESENT",
      "CONTROL_HANDSHAKE_RECEIVER_METHOD",
      "CONTROL_DUTY_API_READY",
      "CONTROL_DUTY_METHOD_COUNT",
      "CONTROL_DUTY_METHODS_OBSERVED",
      "CONTROL_HANDSHAKE_STATUS",
      "CONTROL_HANDSHAKE_ACCEPTED",
      "CONTROL_INPUT_ADMISSION_OPEN",
      "CONTROL_INPUT_BOUND",
      "CONTROL_INPUT_TARGET_FOUND",
      "CONTROL_INPUT_TARGET_DESCRIPTION",
      "CONTROL_INPUT_STATUS",
      "CONTROL_TOUCH_STATUS",
      "CONTROL_DRAG_STATUS",
      "CONTROL_MOTION_STATUS",
      "CONTROL_PACKET_COUNT",
      "CONTROL_DELIVERY_COUNT",
      "CONTROL_COALESCED_FRAME_COUNT",
      "CONTROL_RAW_INPUT_EVENT_COUNT",
      "CONTROL_LIGHTWEIGHT_FRAME_PUBLISH_COUNT",
      "CONTROL_DROPPED_EMPTY_FRAME_COUNT",
      "CONTROL_DELTA_OBSERVED",
      "CONTROL_CANVAS_OBSERVED_BY_CONTROLS",
      "CONTROL_CANVAS_CONTRACT_BY_CONTROLS",
      "CONTROL_CANVAS_DELIVERY_STATUS",
      "CONTROL_CANVAS_DELIVERY_METHOD",
      "CONTROL_CANVAS_DELIVERY_REASON",
      "CONTROL_CANVAS_DELIVERY_CONFIRMED",
      "CONTROL_RECEIVER_CACHE_STATUS",
      "CONTROL_RECEIVER_CACHE_METHOD",
      "CONTROL_RECEIVER_METHOD_RESOLVED",
      "CONTROL_RECEIVER_PREWARM_STATUS",
      "CONTROL_RECEIVER_PREWARM_COUNT",
      "CONTROL_HEX_SURFACE_OBSERVED_BY_CONTROLS",
      "CONTROL_HEX_GATE_STATUS",
      "CONTROL_POINTER_FINGER_OBSERVED_BY_CONTROLS",
      "CONTROL_CANVAS_LIFECYCLE_SUPPRESSED_DURING_DRAG",
      "CONTROL_PACKET_PHASE_FIXED_AT_ZERO",
      "CONTROL_POINTER_FINGER_DIRECT_DELIVERY_SUPPRESSED",
      "CONTROL_DUTIES_ARMED",
      "CONTROL_DUTIES_PERFORMED",
      "CONTROL_DUTY_CAN_DISTINGUISH_READY_FROM_PERFORMED",

      "CANVAS_AUTHORITY_OBSERVED",
      "CANVAS_AUTHORITY_SCOPE",
      "CANVAS_AUTHORITY_SOURCE_PATH",
      "CANVAS_AUTHORITY_CONTRACT",
      "CANVAS_AUTHORITY_RECEIPT",
      "CANVAS_AUTHORITY_METHOD_COUNT",
      "CANVAS_AUTHORITY_METHODS",
      "CANVAS_AUTHORITY_CANDIDATE_COUNT",
      "CANVAS_AUTHORITY_CANDIDATES",
      "CANVAS_BOOT_OR_MOUNT_API_PRESENT",
      "CANVAS_DOM_SURFACE_INTENT_API_PRESENT",
      "CANVAS_STRONG_GOVERNED_SOURCE_RECEIVER_PRESENT",
      "CANVAS_STRONG_GOVERNED_SOURCE_RECEIVER_METHOD",
      "CANVAS_WEAK_PACKET_RECEIVER_PRESENT",
      "CANVAS_WEAK_PACKET_RECEIVER_METHOD",

      "CANVAS_NAMESPACE_PRESENT",
      "CANVAS_NAMESPACE_PATH",
      "CANVAS_NAMESPACE_CONTRACT",
      "CANVAS_NAMESPACE_RECEIPT",
      "CANVAS_PARENT_CONTRACT_RECOGNIZED",

      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_MOUNT_DESCRIPTOR",
      "CANVAS_ELEMENT_FOUND",
      "CANVAS_DOM_SURFACE_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_TAG",
      "CANVAS_ID",
      "CANVAS_CLASS",
      "CANVAS_DATASET_CONTRACT",
      "CANVAS_DATASET_RECEIPT",
      "CANVAS_IN_MOUNT",
      "CANVAS_WIDTH_ATTRIBUTE",
      "CANVAS_HEIGHT_ATTRIBUTE",
      "CANVAS_INTERNAL_SIZE_NONZERO",
      "CANVAS_RECT_LEFT",
      "CANVAS_RECT_TOP",
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
      "CANVAS_VIEWPORT_WIDTH",
      "CANVAS_VIEWPORT_HEIGHT",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_CONTEXT_2D_STATUS",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_PIXEL_SAMPLE_COUNT",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_SAMPLE_REASON",
      "CANVAS_LAYER_BLOCKED",
      "CANVAS_LAYER_BLOCKER",
      "CANVAS_LAYER_HIT_TARGET",
      "CANVAS_LAYER_HIT_WITHIN_CANVAS",
      "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE",

      "CANVAS_SURFACE_TRUTH_LANE_STATUS",
      "CANVAS_SURFACE_TRUTH_LANE_CLEAN",
      "CANVAS_SURFACE_TRUTH_LANE_FIRST_FAILED_COORDINATE",
      "CANVAS_SURFACE_TRUTH_LANE_FAILURE_CLASS",
      "CANVAS_SURFACE_TRUTH_LANE_FAILURE_REASON",

      "CANVAS_TRUTH_STATUS",
      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",
      "FINAL_ARBITRATION_SOURCE_LANE",
      "DIAGNOSTIC_CERTAINTY",
      "OBSERVABLE_CAUSE",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",

      "LAB_CARDINAL_RECEIPT_BUNDLE_STATUS",
      "DIAGNOSTIC_TRACK_RECEIPT_STATUS",
      "CANVAS_BISHOP_RECEIPT_STATUS",
      "FINGER_FILE_RECEIPT_STATUS",
      "CONTROLS_DUTY_RECEIPT_STATUS",
      "PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS",

      "LAB_CARDINAL_RECEIPT_BUNDLE",
      "DIAGNOSTIC_TRACK_RECEIPT",
      "CANVAS_BISHOP_RECEIPT",
      "FINGER_FILE_RECEIPT",
      "CONTROLS_DUTY_RECEIPT",

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
      if (field === "authority") continue;
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
      line("TRUTH_HUB_STATUS", getRaw(report, "TRUTH_HUB_STATUS", "UNKNOWN")),
      line("CANVAS_SCRIPT_PRESENT", getRaw(report, "CANVAS_SCRIPT_PRESENT", "UNKNOWN")),
      line("CANVAS_SCRIPT_EXECUTION_INFERRED", getRaw(report, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN")),
      line("ROUTE_CONDUCTOR_OBSERVED", getRaw(report, "ROUTE_CONDUCTOR_OBSERVED", "UNKNOWN")),
      line("ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED", getRaw(report, "ROUTE_CONDUCTOR_CANVAS_ADMISSION_RESULT_EXPORTED", "UNKNOWN")),
      line("CONTROL_SCRIPT_PRESENT", getRaw(report, "CONTROL_SCRIPT_PRESENT", "UNKNOWN")),
      line("CONTROL_AUTHORITY_OBSERVED", getRaw(report, "CONTROL_AUTHORITY_OBSERVED", "UNKNOWN")),
      line("CONTROL_HANDSHAKE_ACCEPTED", getRaw(report, "CONTROL_HANDSHAKE_ACCEPTED", "UNKNOWN")),
      line("CONTROL_INPUT_BOUND", getRaw(report, "CONTROL_INPUT_BOUND", "UNKNOWN")),
      line("CONTROL_DELTA_OBSERVED", getRaw(report, "CONTROL_DELTA_OBSERVED", "UNKNOWN")),
      line("CONTROL_CANVAS_DELIVERY_CONFIRMED", getRaw(report, "CONTROL_CANVAS_DELIVERY_CONFIRMED", "UNKNOWN")),
      line("CONTROL_DUTY_LANE_STATUS", getRaw(report, "CONTROL_DUTY_LANE_STATUS", "UNKNOWN")),
      line("CANVAS_AUTHORITY_OBSERVED", getRaw(report, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN")),
      line("CANVAS_DOM_SURFACE_FOUND", getRaw(report, "CANVAS_DOM_SURFACE_FOUND", "UNKNOWN")),
      line("CANVAS_TRUTH_FIRST_FAILED_COORDINATE", getRaw(report, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getRaw(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("FINAL_ARBITRATION_SOURCE_LANE", getRaw(report, "FINAL_ARBITRATION_SOURCE_LANE", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_FILE", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN")),
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

  function getPacketText() {
    if (!lastPacketText) lastPacketText = composePacketText(lastReport || makeAnchorReport());
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) lastCompactSummary = composeCompactSummary(lastReport || makeAnchorReport());
    return lastCompactSummary;
  }

  function getStatusText() {
    return getCompactSummary();
  }

  function publish() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeCanvasSurfaceTruth = api;
    root.HEARTH.diagnosticCanvasSurfaceTruthProbe = api;
    root.HEARTH.diagnosticProbeCanvasTruth = api;
    root.HEARTH.diagnosticCanvasTruthProbe = api;
    root.HEARTH.diagnosticRailProbeCanvasSurfaceTruth = api;
    root.HEARTH.diagnosticCanvasSurfaceTruthReceiptHub = api;
    root.HEARTH.diagnosticTruthHub = api;
    root.HEARTH.diagnosticControlsDutyLane = api;

    root.DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthReceiptHub = api;
    root.DEXTER_LAB.hearthDiagnosticTruthHub = api;
    root.DEXTER_LAB.hearthDiagnosticControlsDutyLane = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB = api;
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB = api;
    root.HEARTH_DIAGNOSTIC_CONTROLS_DUTY_LANE = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CONTROLS_DUTY_LANE_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CONTROLS_DUTY_LANE_REPORT = clonePlain(lastReport || makeAnchorReport());

    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_LAB_CARDINAL_RECEIPT = clonePlain(getRaw(lastReport || {}, "LAB_CARDINAL_RECEIPT_BUNDLE", {}));
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_DIAGNOSTIC_TRACK_RECEIPT = clonePlain(getRaw(lastReport || {}, "DIAGNOSTIC_TRACK_RECEIPT", {}));
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_CANVAS_BISHOP_RECEIPT = clonePlain(getRaw(lastReport || {}, "CANVAS_BISHOP_RECEIPT", {}));
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_FINGER_FILE_RECEIPT = clonePlain(getRaw(lastReport || {}, "FINGER_FILE_RECEIPT", {}));
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_CONTROLS_DUTY_RECEIPT = clonePlain(getRaw(lastReport || {}, "CONTROLS_DUTY_RECEIPT", {}));

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_COMPACT_SUMMARY = lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_CONTROLS_DUTY_LANE_PACKET_TEXT = lastPacketText || "";

    setDiagnosticDataset("hearthDiagnosticCanvasSurfaceTruthProbeContract", CONTRACT);
    setDiagnosticDataset("hearthDiagnosticCanvasSurfaceTruthProbeRenewalContract", INTERNAL_RENEWAL_CONTRACT);
    setDiagnosticDataset("hearthDiagnosticCanvasSurfaceTruthProbeStatus", getRaw(lastReport || {}, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY"));
    setDiagnosticDataset("hearthDiagnosticCanvasSurfaceTruthFailureClass", getRaw(lastReport || {}, "CANVAS_TRUTH_FAILURE_CLASS", "ANCHOR_READY"));
    setDiagnosticDataset("hearthDiagnosticControlsDutyLaneStatus", getRaw(lastReport || {}, "CONTROL_DUTY_LANE_STATUS", "ANCHOR_READY"));
    setDiagnosticDataset("hearthDiagnosticControlsDutyFailureClass", getRaw(lastReport || {}, "CONTROL_DUTY_FAILURE_CLASS", "ANCHOR_READY"));

    return true;
  }

  function runProbeCanvasSurfaceTruth(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runCanvasSurfaceTruth(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runProbe(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function inspect(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runDiagnostic(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function receiveSouthProbeReceipt(input = {}) {
    lastSouthProbeEnvelope = clonePlain({
      receivedAt: nowIso(),
      source: "PROBE_SOUTH_TO_CANVAS_SURFACE_TRUTH_HUB",
      report: extractCurrentReport(input),
      raw: input
    });

    const report = inspectCanvasSurfaceTruth({
      currentReport: lastSouthProbeEnvelope.report,
      southProbeReceipt: lastSouthProbeEnvelope.raw,
      chronology: input.chronology || getRaw(input, "CHRONOLOGY_SEQUENCE", [])
    });

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      received: true,
      report,
      packetText: getPacketText(),
      compactSummary: getCompactSummary(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function receiveProbeSouthReceipt(input = {}) {
    return receiveSouthProbeReceipt(input);
  }

  function ingestSouthProbeReceipt(input = {}) {
    return receiveSouthProbeReceipt(input);
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
    lineageInternalRenewalContract: LINEAGE_INTERNAL_RENEWAL_CONTRACT,
    lineageInternalRenewalReceipt: LINEAGE_INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    canvasFile: CANVAS_FILE,
    canvasLaunchFile: CANVAS_LAUNCH_FILE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,

    diagnosticOnly: true,
    anchorSafeChronologyObservation: true,
    receiptHubActive: true,
    fourLaneReceiptHubActive: true,
    causalForensicsLensActive: true,
    controlsDutyLaneActive: true,

    runProbeCanvasSurfaceTruth,
    runCanvasSurfaceTruth,
    runProbe,
    inspect,
    runDiagnostic,
    receiveSouthProbeReceipt,
    receiveProbeSouthReceipt,
    ingestSouthProbeReceipt,

    getReport,
    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getPacketText,
    getCompactSummary,
    getStatusText,

    canvasSelectors: CANVAS_SELECTORS,
    mountSelectors: MOUNT_SELECTORS,
    acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS,
    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS,
    acceptedControlContracts: ACCEPTED_CONTROL_CONTRACTS,

    supportsAnchorSafeChronologyObservation: true,
    supportsCanvasScriptPresenceProbe: true,
    supportsCanvasScriptExecutionInference: true,
    supportsRouteConductorAdmissionForensics: true,
    supportsRouteConductorAdmissionResultExportCheck: true,
    supportsControlsDutyLane: true,
    supportsControlsScriptPresenceProbe: true,
    supportsControlsAuthorityPublicationProbe: true,
    supportsControlsHandshakeAcceptedProbe: true,
    supportsControlsInputBindingProbe: true,
    supportsControlsDeltaCounterProbe: true,
    supportsControlsCanvasDeliveryProbe: true,
    supportsControlsReadyVsPerformedDistinction: true,
    supportsCanvasAuthorityPublicationProbe: true,
    supportsCanvasDomSurfaceBindingProbe: true,
    supportsCanvasElementProbe: true,
    supportsCanvasMountProbe: true,
    supportsCanvasRectProbe: true,
    supportsComputedVisibilityProbe: true,
    supportsViewportIntersectionProbe: true,
    supportsContext2dProbe: true,
    supportsPixelSampleProbe: true,
    supportsLayerObstructionProbe: true,
    supportsNamespaceDomMatchProbe: true,
    supportsCoordinateSpecificFailure: true,
    supportsFourLaneReceiptHub: true,
    supportsCompactPacketText: true,

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
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsVisualPass: false,

    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,

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
