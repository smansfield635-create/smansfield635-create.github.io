// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CAUSAL_FORENSICS_LENS_TNT_v1_3
// Full-file replacement.
// Diagnostic-only Canvas surface truth / causal forensics lens.
// Purpose:
// - Preserve the existing NORTH-facing Canvas surface truth probe contract.
// - Preserve synchronous F21 diagnostic authority publication.
// - Preserve the four-lane receipt hub.
// - Upgrade the probe from a DOM-only canvas check into a causal failure ladder.
// - Distinguish:
//   1. target access failure,
//   2. Canvas script missing,
//   3. Canvas script present but execution not proven,
//   4. Canvas authority/public aliases missing,
//   5. Canvas authority present but no real DOM canvas,
//   6. real DOM canvas present but selector/mount mismatch,
//   7. canvas present but zero internal size,
//   8. canvas present but zero layout rect,
//   9. canvas present but hidden/outside viewport,
//   10. canvas present but no 2D context,
//   11. canvas present but no visible pixels,
//   12. canvas namespace/DOM receipt mismatch.
// - Explicitly classify rendered-proof-without-DOM-canvas as non-surface truth.
// - Do not create, draw, repair, release, restart, or mutate production state.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CAUSAL_FORENSICS_LENS_TNT_v1_3";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_CAUSAL_FORENSICS_LENS_RECEIPT_v1_3";

  const PREVIOUS_INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ANCHOR_SAFE_COORDINATE_LADDER_TNT_v1_2";
  const PREVIOUS_INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_ANCHOR_SAFE_COORDINATE_LADDER_RECEIPT_v1_2";

  const VERSION =
    "2026-06-07.hearth-diagnostic-probe-canvas-surface-truth-causal-forensics-lens-v1-3";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_LAUNCH_FILE = "/assets/hearth/hearth.canvas.launch.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const HTML_FILE = "/showroom/globe/hearth/index.html";

  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const SOUTH_SURFACE_POINTER_FILE =
    "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE =
    "/assets/hearth/hearth.hex.four-pair.authority.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER_TNT_v12_5",
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4",
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4",
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
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas[data-hearth-surface-canvas='true']",
    "canvas[data-hearth-dom-surface='true']",
    "#hearthCanvasMount canvas",
    "[data-hearth-canvas-mount] canvas",
    "[data-hearth-visible-planet-mount] canvas",
    "[data-hearth-expression-mount] canvas",
    "[data-hearth-globe-stage] canvas",
    "[data-hearth-planet-stage] canvas",
    "canvas"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "[data-hearth-full-planet-visibility-mount]",
    "[data-hearth-expression-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "[data-hearth-expression-stage]",
    "main",
    "body"
  ]);

  const HEARTH_DATASET_SELECTORS = Object.freeze([
    "[data-hearth-canvas]",
    "[data-hearth-canvas-hub]",
    "[data-hearth-expression-surface]",
    "[data-hearth-visible-canvas]",
    "[data-hearth-base-globe-canvas]",
    "[data-hearth-planet-canvas]",
    "[data-hearth-canvas-texture]",
    "[data-hearth-visible-planet]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-canvas-mount]",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "[data-hearth-expression-stage]",
    "[data-hearth-canvas-contract]",
    "[data-hearth-canvas-receipt]"
  ]);

  const CANVAS_AUTHORITY_PATHS = Object.freeze([
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_SOURCE_HOLD_PLANET_SURFACE_THRESHOLD_RECEIVER",
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubSourceHoldPlanetSurfaceThresholdReceiver",
    "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "HEARTH.canvasHubHexSurfacePointerFingerTransmission",
    "HEARTH.canvasHubRafSphereRotationPairReceiver",
    "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasHubPlanetaryViewControlReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubSourceHoldPlanetSurfaceThresholdReceiver",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvasHubHexSurfacePointerFingerTransmission",
    "DEXTER_LAB.hearthCanvasHubRafSphereRotationPairReceiver",
    "DEXTER_LAB.hearthCanvasHubRafFastInteractiveDeferredHexRenderReceiver",
    "DEXTER_LAB.hearthCanvasHubFastViewTransformDeferredRenderReceiver",
    "DEXTER_LAB.hearthCanvasHubPlanetaryViewControlReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const CANVAS_LAUNCH_PATHS = Object.freeze([
    "HEARTH.canvasLaunch",
    "HEARTH.canvasLaunchPrefaceGate",
    "HEARTH.canvasPrefaceHoldGate",
    "HEARTH.canvasPrefaceDecommissionGate",
    "HEARTH_CANVAS_LAUNCH",
    "HEARTH_CANVAS_LAUNCH_PREFACE_GATE",
    "HEARTH_CANVAS_PREFACE_HOLD_GATE",
    "HEARTH_CANVAS_PREFACE_DECOMMISSION_GATE",
    "DEXTER_LAB.hearthCanvasLaunch",
    "DEXTER_LAB.hearthCanvasLaunchPrefaceGate"
  ]);

  const ROUTE_CONDUCTOR_PATHS = Object.freeze([
    "HEARTH_ROUTE_CONDUCTOR",
    "HEARTH.routeConductor",
    "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
    "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoff",
    "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
    "DEXTER_LAB.hearthRouteConductor",
    "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
    "DEXTER_LAB.hearthRouteConductorGovernedSourceStackAdmissionCanvasHandoff",
    "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
  ]);

  const CONTROL_PATHS = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH.controls",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "HEARTH.planetaryControls",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthQueenControls",
    "DEXTER_LAB.hearthPlanetaryControls"
  ]);

  const FINGER_PATHS = Object.freeze([
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasPointerFinger",
    "HEARTH.pointerFinger",
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_POINTER_FINGER",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFinger"
  ]);

  const HEX_PATHS = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexGate",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_GATE",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer"
  ]);

  const LAB_PATHS = Object.freeze({
    north: [
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.northCentralTrainStation",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northCentralTrainStation"
    ],
    east: [
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "HEARTH_EAST_IGNITION",
      "HEARTH.eastIgnition",
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.hearthDiagnosticEast"
    ],
    south: [
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "HEARTH_SOUTH_OUTPUT",
      "HEARTH.southOutput",
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.hearthDiagnosticSouth"
    ],
    west: [
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "HEARTH.runtimeTableWest",
      "HEARTH.westAdmissibility",
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.hearthDiagnosticWest"
    ]
  });

  const DIAGNOSTIC_PATHS = Object.freeze({
    north: [
      "HEARTH.diagnosticRail",
      "HEARTH.parallelDiagnosticRail",
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticRailNorth",
      "HEARTH.diagnosticNorthCanvasSurfaceTruthChronologyHub",
      "HEARTH_DIAGNOSTIC_RAIL",
      "HEARTH_DIAGNOSTIC_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH",
      "DEXTER_LAB.hearthDiagnosticRail",
      "DEXTER_LAB.hearthDiagnosticNorth"
    ],
    east: [
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "HEARTH_DIAGNOSTIC_EAST",
      "HEARTH_DIAGNOSTIC_RAIL_EAST",
      "DEXTER_LAB.hearthDiagnosticEast",
      "DEXTER_LAB.hearthDiagnosticRailEast"
    ],
    west: [
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "HEARTH_DIAGNOSTIC_WEST",
      "HEARTH_DIAGNOSTIC_RAIL_WEST",
      "DEXTER_LAB.hearthDiagnosticWest",
      "DEXTER_LAB.hearthDiagnosticRailWest"
    ],
    south: [
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH_DIAGNOSTIC_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "DEXTER_LAB.hearthDiagnosticSouth",
      "DEXTER_LAB.hearthDiagnosticRailSouth"
    ],
    probeSouth: [
      "HEARTH.diagnosticProbeSouth",
      "HEARTH.diagnosticRailProbeSouth",
      "HEARTH.diagnosticSouthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      "DEXTER_LAB.hearthDiagnosticProbeSouth",
      "DEXTER_LAB.hearthDiagnosticRailProbeSouth"
    ],
    southSurfacePointer: [
      "HEARTH.diagnosticSouthSurfacePointer",
      "HEARTH.diagnosticSurfacePointerSouth",
      "HEARTH.diagnosticSouthBishopSurfacePointer",
      "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
      "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER",
      "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer",
      "DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer"
    ]
  });

  const api = {};
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

  function bool(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
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

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
  }

  function readPath(base, path) {
    const parts = safeString(path).split(".");
    let cursor = base || root;

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
      const key = parts[index];
      if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
      cursor = cursor[key];
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

  function pathMatches(targetWindow, route) {
    try {
      const path = targetWindow && targetWindow.location
        ? targetWindow.location.pathname
        : "";

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
      targetAccessError = error && error.message ? String(error.message) : safeString(error);
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
        targetAccessError = error && error.message ? String(error.message) : safeString(error);
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
        targetAccessError = error && error.message ? String(error.message) : safeString(error);
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
        targetAccessError = error && error.message ? String(error.message) : safeString(error);
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

  function normalizeUrlPath(src, base) {
    const text = safeString(src);
    if (!text) return "";

    try {
      const url = new URL(text, base || "https://diamondgatebridge.com");
      return url.pathname;
    } catch (_error) {
      return text.split("?")[0];
    }
  }

  function cacheKeyFromSrc(src) {
    const text = safeString(src);
    if (!text) return "NONE";

    try {
      const url = new URL(text, "https://diamondgatebridge.com");
      return url.searchParams.get("v") || "NONE";
    } catch (_error) {
      const match = text.match(/[?&]v=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : "NONE";
    }
  }

  function scriptInfo(targetDocument, targetWindow, path) {
    const base = targetWindow && targetWindow.location && targetWindow.location.origin
      ? targetWindow.location.origin
      : "https://diamondgatebridge.com";

    const scripts = qa(targetDocument, "script[src]");
    const matches = scripts.filter((script) => {
      const src = safeString(script.getAttribute("src"));
      const pathname = normalizeUrlPath(src, base);

      return pathname === path || pathname.endsWith(path) || src.includes(path);
    });

    const selected = matches[matches.length - 1] || null;
    const src = selected ? safeString(selected.getAttribute("src")) : "NONE";

    return {
      file: path,
      scriptPresent: matches.length > 0,
      scriptCount: matches.length,
      scriptSrc: src,
      scriptCacheKey: cacheKeyFromSrc(src),
      scriptAsync: selected ? bool(selected.async, false) : false,
      scriptDefer: selected ? bool(selected.defer, false) : false,
      scriptType: selected ? safeString(selected.getAttribute("type"), "classic") || "classic" : "NONE",
      scriptId: selected && selected.id ? selected.id : "NONE",
      scriptDataset: selected ? datasetSnapshot(selected) : {},
      scriptTagOrder: selected ? scripts.indexOf(selected) : -1,
      matchingScriptSrcs: matches.map((script) => safeString(script.getAttribute("src"))).slice(0, 8)
    };
  }

  function datasetSnapshot(element) {
    const out = {};
    if (!element || !element.dataset) return out;

    try {
      Object.keys(element.dataset).slice(0, 32).forEach((key) => {
        out[key] = safeString(element.dataset[key]);
      });
    } catch (_error) {}

    return out;
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

  function elementSummary(element, index = 0) {
    if (!element) {
      return {
        index,
        descriptor: "NONE",
        tag: "NONE",
        id: "NONE",
        className: "NONE",
        dataset: {}
      };
    }

    let className = "NONE";

    try {
      className = element.className ? safeString(element.className) : "NONE";
    } catch (_error) {
      className = "UNREADABLE";
    }

    return {
      index,
      descriptor: elementDescriptor(element),
      tag: safeString(element.tagName, "UNKNOWN").toLowerCase(),
      id: element.id || "NONE",
      className,
      dataset: datasetSnapshot(element)
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
        3,
        Math.min(18, Math.floor(Math.min(width, height) / 32))
      );

      const points = [
        [0.5, 0.5],
        [0.35, 0.35],
        [0.65, 0.35],
        [0.35, 0.65],
        [0.65, 0.65],
        [0.5, 0.28],
        [0.5, 0.72]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;
      let varianceSignal = 0;
      let previous = null;

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
          const red = data[index] || 0;
          const green = data[index + 1] || 0;
          const blue = data[index + 2] || 0;
          const alpha = data[index + 3] || 0;

          if (alpha > 0) alphaPixelCount += 1;
          if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) visiblePixelCount += 1;

          const current = `${red},${green},${blue},${alpha}`;
          if (previous && previous !== current) varianceSignal += 1;
          previous = current;
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
        varianceSignal,
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
        varianceSignal: 0,
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
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

  function primitiveSnapshot(value) {
    if (!isObject(value)) return {};

    const out = {};
    const keys = Object.keys(value).slice(0, 120);

    for (const key of keys) {
      let item;

      try {
        item = value[key];
      } catch (_error) {
        continue;
      }

      if (
        item === undefined ||
        item === null ||
        typeof item === "function" ||
        (typeof item === "object" && !Array.isArray(item))
      ) {
        continue;
      }

      if (Array.isArray(item)) {
        out[key] = item.length <= 16 ? clonePlain(item) : `ARRAY_LENGTH_${item.length}`;
        continue;
      }

      out[key] = item;
    }

    return out;
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getState",
      "getStatus",
      "getSummary",
      "getReport",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getCarrierReceipt",
      "getPrefaceHandshakePacket",
      "getCanvasSurfaceWorthinessPacket",
      "getPrefaceDecommissionPacket",
      "getCompactSummary"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.state)) return authority.state;
    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.evidence)) return authority.evidence;

    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function contractOf(value) {
    if (!isObject(value) && !isFunction(value)) return "UNKNOWN";

    return firstKnown(
      value.CONTRACT,
      value.contract,
      value.IMPLEMENTATION_CONTRACT,
      value.implementationContract,
      value.INTERNAL_RENEWAL_CONTRACT,
      value.internalRenewalContract,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.hearthCanvasContract,
      value.CANVAS_CONTRACT,
      value.CANVAS_NAMESPACE_CONTRACT,
      value.SOUTH_CONTRACT,
      value.PROBE_SOUTH_CONTRACT,
      value.EAST_CONTRACT,
      value.WEST_CONTRACT,
      value.NORTH_CONTRACT,
      value.HEX_CONTRACT,
      value.SURFACE_CONTRACT
    );
  }

  function receiptOf(value) {
    if (!isObject(value) && !isFunction(value)) return "UNKNOWN";

    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.IMPLEMENTATION_RECEIPT,
      value.implementationReceipt,
      value.INTERNAL_RENEWAL_RECEIPT,
      value.internalRenewalReceipt,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.hearthCanvasReceipt,
      value.CANVAS_RECEIPT,
      value.CANVAS_NAMESPACE_RECEIPT,
      value.SOUTH_RECEIPT,
      value.PROBE_SOUTH_RECEIPT,
      value.EAST_RECEIPT,
      value.WEST_RECEIPT,
      value.NORTH_RECEIPT,
      value.HEX_RECEIPT,
      value.SURFACE_RECEIPT
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

  function selectAuthority(name, paths, targetWindow) {
    const scopes = [
      { name: "TARGET_WINDOW", base: targetWindow || null },
      { name: "DIAGNOSTIC_WINDOW", base: root }
    ];

    const candidates = [];

    for (const scope of scopes) {
      if (!scope.base) continue;

      for (const path of paths || []) {
        const authority = readPath(scope.base, path);
        if (!authority || authority === api) continue;

        const receipt = getReceiptFromAuthority(authority) || {};
        const contract = firstKnown(contractOf(receipt), contractOf(authority));
        const receiptName = firstKnown(receiptOf(receipt), receiptOf(authority));
        const methods = methodsOf(authority);

        candidates.push({
          name,
          scope: scope.name,
          path,
          observed: true,
          contract,
          receipt: receiptName,
          methodCount: methods.length,
          methods,
          primitiveSnapshot: primitiveSnapshot(receipt),
          authority
        });
      }
    }

    const selected =
      candidates.find((candidate) => ACCEPTED_CANVAS_CONTRACTS.includes(candidate.contract)) ||
      candidates.find((candidate) => candidate.contract !== "UNKNOWN") ||
      candidates.find((candidate) => candidate.methodCount > 0) ||
      candidates[0] ||
      null;

    return {
      name,
      observed: Boolean(selected),
      scope: selected ? selected.scope : "NONE",
      path: selected ? selected.path : "NONE",
      contract: selected ? selected.contract : "UNKNOWN",
      receipt: selected ? selected.receipt : "UNKNOWN",
      methodCount: selected ? selected.methodCount : 0,
      methods: selected ? selected.methods : [],
      primitiveSnapshot: selected ? selected.primitiveSnapshot : {},
      candidates: candidates.map((candidate) => ({
        scope: candidate.scope,
        path: candidate.path,
        contract: candidate.contract,
        receipt: candidate.receipt,
        methodCount: candidate.methodCount
      })),
      authority: selected ? selected.authority : null
    };
  }

  function compactAuthority(item) {
    return {
      observed: Boolean(item && item.observed),
      scope: item ? item.scope : "NONE",
      path: item ? item.path : "NONE",
      contract: item ? item.contract : "UNKNOWN",
      receipt: item ? item.receipt : "UNKNOWN",
      methodCount: item ? item.methodCount : 0,
      methods: item && item.methods ? item.methods.slice(0, 24) : []
    };
  }

  function methodPresence(methods) {
    const list = Array.isArray(methods) ? methods : [];

    const bootMethods = ["boot", "init", "start", "mount", "run"].filter((method) => list.includes(method));
    const domMethods = [
      "mount",
      "boot",
      "start",
      "draw",
      "render",
      "paint",
      "drawInteractiveFrame",
      "drawPairFrame",
      "ensureCanvas",
      "ensureSurface",
      "createCanvas",
      "bindCanvas",
      "mountCanvas"
    ].filter((method) => list.includes(method));
    const receiptMethods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getSummary",
      "getReport",
      "getCanvasStationReceipt",
      "getVisiblePlanetReceipt"
    ].filter((method) => list.includes(method));
    const sourceReceiverMethods = [
      "receiveGovernedSourceStackPacket",
      "consumeGovernedSourceStackPacket",
      "acceptGovernedSourceStackPacket",
      "receiveGovernedSourcePacket",
      "consumeGovernedSourcePacket",
      "receiveSourceTruthPacket",
      "receiveRouteConductorGovernedSourcePacket"
    ].filter((method) => list.includes(method));
    const launchMethods = [
      "receivePrefaceLaunchPacket",
      "receiveCanvasLaunchPacket",
      "getPrefaceHandshakePacket",
      "getCanvasSurfaceWorthinessPacket",
      "getPrefaceDecommissionPacket"
    ].filter((method) => list.includes(method));

    return {
      bootMethods,
      domMethods,
      receiptMethods,
      sourceReceiverMethods,
      launchMethods,
      bootOrMountApiPresent: bootMethods.length > 0,
      domSurfaceIntentApiPresent: domMethods.length > 0,
      receiptApiPresent: receiptMethods.length > 0,
      governedSourceReceiverApiPresent: sourceReceiverMethods.length > 0,
      launchHandshakeApiPresent: launchMethods.length > 0
    };
  }

  function scanOpenShadowCanvases(rootElement, limit = 32) {
    const out = [];
    const seen = new Set();

    function visit(node) {
      if (!node || out.length >= limit) return;

      if (seen.has(node)) return;
      seen.add(node);

      try {
        if (node.shadowRoot) {
          const canvases = Array.from(node.shadowRoot.querySelectorAll("canvas")).slice(0, limit - out.length);
          for (const canvas of canvases) out.push(canvas);

          Array.from(node.shadowRoot.children || []).forEach(visit);
        }

        Array.from(node.children || []).slice(0, 80).forEach(visit);
      } catch (_error) {}
    }

    visit(rootElement);
    return out;
  }

  function collectMountChildren(mount) {
    if (!mount) return [];

    try {
      return Array.from(mount.children || [])
        .slice(0, 18)
        .map((child, index) => elementSummary(child, index));
    } catch (_error) {
      return [];
    }
  }

  function collectDatasetElements(targetDocument) {
    const selector = HEARTH_DATASET_SELECTORS.join(",");
    const nodes = qa(targetDocument, selector);

    return nodes.slice(0, 24).map((node, index) => elementSummary(node, index));
  }

  function selectCanvasCandidate(targetDocument, mount) {
    const selectorResult = firstElement(targetDocument, CANVAS_SELECTORS);
    const allCanvas = qa(targetDocument, "canvas");
    const shadowCanvas = scanOpenShadowCanvases(targetDocument.documentElement || targetDocument.body || null, 24);
    const allKnownCanvas = allCanvas.concat(shadowCanvas.filter((item) => !allCanvas.includes(item)));

    let canvas = selectorResult.element;
    let selectionSource = selectorResult.element ? `SELECTOR:${selectorResult.selector}` : "NONE";
    let selector = selectorResult.selector;

    if (!canvas && mount) {
      canvas = allKnownCanvas.find((candidate) => containsOrEquals(mount, candidate)) || null;
      if (canvas) {
        selectionSource = "FALLBACK_CANVAS_IN_MOUNT";
        selector = "canvas";
      }
    }

    if (!canvas && allKnownCanvas.length) {
      canvas = allKnownCanvas[0];
      selectionSource = "FALLBACK_FIRST_CANVAS_ANYWHERE";
      selector = "canvas";
    }

    return {
      canvas,
      selector,
      selectionSource,
      allCanvas,
      shadowCanvas,
      allKnownCanvas
    };
  }

  function summarizeCanvasCandidate(canvas, mount, targetWindow, targetDocument, index) {
    const rect = getRect(canvas);
    const css = cssSummary(targetWindow, canvas);
    const inMount = Boolean(canvas && mount && containsOrEquals(mount, canvas));

    return {
      index,
      descriptor: elementDescriptor(canvas),
      id: canvas && canvas.id ? canvas.id : "NONE",
      className: canvas && canvas.className ? safeString(canvas.className) : "NONE",
      inMount,
      width: safeNumber(canvas && canvas.width, 0),
      height: safeNumber(canvas && canvas.height, 0),
      rectWidth: rect.width,
      rectHeight: rect.height,
      rectNonzero: rectNonzero(rect),
      computedVisible: css.visible,
      viewportIntersecting: viewportIntersecting(targetWindow, rect),
      dataset: datasetSnapshot(canvas),
      ownerDocumentMatchesTarget: Boolean(canvas && canvas.ownerDocument === targetDocument)
    };
  }

  function namespaceMatchesDomSurface(namespaceInfo, canvas) {
    if (!namespaceInfo || !namespaceInfo.observed || !canvas) return false;

    let datasetContract = "UNKNOWN";

    try {
      datasetContract =
        canvas.dataset &&
        firstKnown(
          canvas.dataset.hearthCanvasContract,
          canvas.dataset.contract,
          canvas.dataset.hearthCanvasInternalRenewalContract
        );
    } catch (_error) {}

    const contractConsistent = Boolean(
      ACCEPTED_CANVAS_CONTRACTS.includes(namespaceInfo.contract) ||
      ACCEPTED_CANVAS_CONTRACTS.includes(datasetContract) ||
      safeString(namespaceInfo.contract).includes("HEARTH_CANVAS_") ||
      safeString(datasetContract).includes("HEARTH_CANVAS_")
    );

    const sizeConsistent =
      safeNumber(canvas.width, 0) > 0 && safeNumber(canvas.height, 0) > 0;

    return Boolean(contractConsistent && sizeConsistent);
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
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    if (Array.isArray(currentReport && currentReport.chronology)) return clonePlain(currentReport.chronology);

    return [];
  }

  function renderedProofFromReport(currentReport) {
    const renderedReady = bool(getRaw(currentReport, "RENDERED_PLANET_PROOF_READY", false), false);
    const visibleReady = bool(getRaw(currentReport, "VISIBLE_PLANET_PROOF_READY", false), false);
    const surfaceReady = bool(getRaw(currentReport, "CANVAS_EXPRESSION_SURFACE_READY", false), false);
    const richnessReady = bool(getRaw(currentReport, "CANVAS_EXPRESSION_RICHNESS_READY", false), false);

    return {
      renderedPlanetProofReady: renderedReady,
      visiblePlanetProofReady: visibleReady,
      canvasExpressionSurfaceReady: surfaceReady,
      canvasExpressionRichnessReady: richnessReady,
      visiblePlanetProofSource: firstKnown(
        getRaw(currentReport, "VISIBLE_PLANET_PROOF_SOURCE", "UNKNOWN"),
        getRaw(currentReport, "RENDERED_PLANET_PROOF_SOURCE", "UNKNOWN")
      ),
      canvasExpressionProofStatus: firstKnown(
        getRaw(currentReport, "CANVAS_EXPRESSION_PROOF_STATUS", "UNKNOWN"),
        getRaw(currentReport, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", "UNKNOWN")
      )
    };
  }

  function inspectCanvasSurface(targetWindow, targetDocument, contextSource, currentReport) {
    const report = {
      TARGET_CONTEXT_STATUS:
        targetDocument && targetWindow
          ? "TARGET_CONTEXT_AVAILABLE"
          : "TARGET_CONTEXT_UNAVAILABLE",
      TARGET_CONTEXT_SOURCE: contextSource || "UNKNOWN",

      CANVAS_SCRIPT_PRESENT: false,
      CANVAS_SCRIPT_COUNT: 0,
      CANVAS_SCRIPT_SRC: "NONE",
      CANVAS_SCRIPT_CACHE_KEY: "NONE",
      CANVAS_SCRIPT_TAG_ORDER: -1,
      CANVAS_SCRIPT_LOAD_INFERRED: false,
      CANVAS_SCRIPT_EXECUTION_INFERRED: false,

      CANVAS_LAUNCH_SCRIPT_PRESENT: false,
      CANVAS_LAUNCH_SCRIPT_COUNT: 0,
      CANVAS_LAUNCH_AUTHORITY_OBSERVED: false,
      CANVAS_LAUNCH_AUTHORITY_PATH: "NONE",
      CANVAS_LAUNCH_PREFACE_HELD: "UNKNOWN",
      CANVAS_LAUNCH_PREFACE_DECOMMISSIONED: "UNKNOWN",

      ROUTE_CONDUCTOR_SCRIPT_PRESENT: false,
      INDEX_SCRIPT_PRESENT: false,
      CONTROL_SCRIPT_PRESENT: false,

      CANVAS_AUTHORITY_OBSERVED: false,
      CANVAS_AUTHORITY_SCOPE: "NONE",
      CANVAS_AUTHORITY_SOURCE_PATH: "NONE",
      CANVAS_AUTHORITY_CONTRACT: "UNKNOWN",
      CANVAS_AUTHORITY_RECEIPT: "UNKNOWN",
      CANVAS_AUTHORITY_METHOD_COUNT: 0,
      CANVAS_AUTHORITY_METHODS: [],
      CANVAS_AUTHORITY_CANDIDATE_COUNT: 0,
      CANVAS_AUTHORITY_CANDIDATES: [],

      CANVAS_BOOT_OR_MOUNT_API_PRESENT: false,
      CANVAS_DOM_SURFACE_INTENT_API_PRESENT: false,
      CANVAS_RECEIPT_API_PRESENT: false,
      CANVAS_GOVERNED_SOURCE_RECEIVER_API_PRESENT: false,
      CANVAS_LAUNCH_HANDSHAKE_API_PRESENT: false,
      CANVAS_BOOT_METHODS_PRESENT: [],
      CANVAS_DOM_METHODS_PRESENT: [],
      CANVAS_RECEIPT_METHODS_PRESENT: [],
      CANVAS_SOURCE_RECEIVER_METHODS_PRESENT: [],
      CANVAS_LAUNCH_METHODS_PRESENT: [],

      CANVAS_MOUNT_FOUND: false,
      CANVAS_MOUNT_SELECTOR: "NONE",
      CANVAS_MOUNT_DESCRIPTOR: "NONE",
      CANVAS_MOUNT_CHILD_COUNT: 0,
      CANVAS_MOUNT_CHILDREN: [],

      HEARTH_DATASET_ELEMENT_COUNT: 0,
      HEARTH_DATASET_ELEMENTS: [],

      DOM_CANVAS_COUNT: 0,
      DOM_SHADOW_CANVAS_COUNT: 0,
      DOM_CANVAS_CANDIDATE_COUNT: 0,
      DOM_CANVAS_CANDIDATES: [],

      CANVAS_ELEMENT_FOUND: false,
      CANVAS_SELECTION_SOURCE: "NONE",
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
      CANVAS_PIXEL_VARIANCE_SIGNAL: 0,
      CANVAS_PIXEL_SAMPLE_REASON: "NOT_RUN",

      CANVAS_LAYER_BLOCKED: false,
      CANVAS_LAYER_BLOCKER: "UNKNOWN",
      CANVAS_LAYER_HIT_TARGET: "UNKNOWN",
      CANVAS_LAYER_HIT_WITHIN_CANVAS: false,

      CANVAS_NAMESPACE_PRESENT: false,
      CANVAS_NAMESPACE_PATH: "NONE",
      CANVAS_NAMESPACE_CONTRACT: "UNKNOWN",
      CANVAS_NAMESPACE_RECEIPT: "UNKNOWN",
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: false,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: false,

      RENDERED_PLANET_PROOF_READY_INPUT: false,
      VISIBLE_PLANET_PROOF_READY_INPUT: false,
      VISIBLE_PLANET_PROOF_SOURCE_INPUT: "UNKNOWN",
      CANVAS_EXPRESSION_SURFACE_READY_INPUT: false,
      CANVAS_EXPRESSION_RICHNESS_READY_INPUT: false,
      RENDERED_PROOF_CONFLICT_STATUS: "NOT_EVALUATED",
      RENDERED_PROOF_CONFLICT_CLASS: "NONE"
    };

    if (!targetWindow || !targetDocument) {
      return { ...report, failure: resolveCausalFailure(report) };
    }

    const canvasScript = scriptInfo(targetDocument, targetWindow, CANVAS_FILE);
    const launchScript = scriptInfo(targetDocument, targetWindow, CANVAS_LAUNCH_FILE);
    const routeScript = scriptInfo(targetDocument, targetWindow, ROUTE_CONDUCTOR_FILE);
    const indexScript = scriptInfo(targetDocument, targetWindow, INDEX_FILE);
    const controlScript = scriptInfo(targetDocument, targetWindow, CONTROL_FILE);

    report.CANVAS_SCRIPT_PRESENT = canvasScript.scriptPresent;
    report.CANVAS_SCRIPT_COUNT = canvasScript.scriptCount;
    report.CANVAS_SCRIPT_SRC = canvasScript.scriptSrc;
    report.CANVAS_SCRIPT_CACHE_KEY = canvasScript.scriptCacheKey;
    report.CANVAS_SCRIPT_TAG_ORDER = canvasScript.scriptTagOrder;
    report.CANVAS_SCRIPT_LOAD_INFERRED = canvasScript.scriptPresent;

    report.CANVAS_LAUNCH_SCRIPT_PRESENT = launchScript.scriptPresent;
    report.CANVAS_LAUNCH_SCRIPT_COUNT = launchScript.scriptCount;
    report.ROUTE_CONDUCTOR_SCRIPT_PRESENT = routeScript.scriptPresent;
    report.INDEX_SCRIPT_PRESENT = indexScript.scriptPresent;
    report.CONTROL_SCRIPT_PRESENT = controlScript.scriptPresent;

    const canvasAuthority = selectAuthority("canvas", CANVAS_AUTHORITY_PATHS, targetWindow);
    const launchAuthority = selectAuthority("canvasLaunch", CANVAS_LAUNCH_PATHS, targetWindow);

    report.CANVAS_AUTHORITY_OBSERVED = canvasAuthority.observed;
    report.CANVAS_AUTHORITY_SCOPE = canvasAuthority.scope;
    report.CANVAS_AUTHORITY_SOURCE_PATH = canvasAuthority.path;
    report.CANVAS_AUTHORITY_CONTRACT = canvasAuthority.contract;
    report.CANVAS_AUTHORITY_RECEIPT = canvasAuthority.receipt;
    report.CANVAS_AUTHORITY_METHOD_COUNT = canvasAuthority.methodCount;
    report.CANVAS_AUTHORITY_METHODS = canvasAuthority.methods.slice(0, 60);
    report.CANVAS_AUTHORITY_CANDIDATE_COUNT = canvasAuthority.candidates.length;
    report.CANVAS_AUTHORITY_CANDIDATES = canvasAuthority.candidates;

    report.CANVAS_NAMESPACE_PRESENT = canvasAuthority.observed;
    report.CANVAS_NAMESPACE_PATH = canvasAuthority.path;
    report.CANVAS_NAMESPACE_CONTRACT = canvasAuthority.contract;
    report.CANVAS_NAMESPACE_RECEIPT = canvasAuthority.receipt;
    report.CANVAS_PARENT_CONTRACT_RECOGNIZED = Boolean(
      ACCEPTED_CANVAS_CONTRACTS.includes(canvasAuthority.contract) ||
      safeString(canvasAuthority.contract).includes("HEARTH_CANVAS_")
    );

    const presence = methodPresence(canvasAuthority.methods);
    report.CANVAS_BOOT_OR_MOUNT_API_PRESENT = presence.bootOrMountApiPresent;
    report.CANVAS_DOM_SURFACE_INTENT_API_PRESENT = presence.domSurfaceIntentApiPresent;
    report.CANVAS_RECEIPT_API_PRESENT = presence.receiptApiPresent;
    report.CANVAS_GOVERNED_SOURCE_RECEIVER_API_PRESENT = presence.governedSourceReceiverApiPresent;
    report.CANVAS_LAUNCH_HANDSHAKE_API_PRESENT = presence.launchHandshakeApiPresent;
    report.CANVAS_BOOT_METHODS_PRESENT = presence.bootMethods;
    report.CANVAS_DOM_METHODS_PRESENT = presence.domMethods;
    report.CANVAS_RECEIPT_METHODS_PRESENT = presence.receiptMethods;
    report.CANVAS_SOURCE_RECEIVER_METHODS_PRESENT = presence.sourceReceiverMethods;
    report.CANVAS_LAUNCH_METHODS_PRESENT = presence.launchMethods;

    report.CANVAS_SCRIPT_EXECUTION_INFERRED = Boolean(
      canvasAuthority.observed ||
      report.CANVAS_NAMESPACE_PRESENT ||
      report.CANVAS_AUTHORITY_METHOD_COUNT > 0 ||
      dataValue(targetDocument, "hearthCanvasLoaded") === "true" ||
      dataValue(targetDocument, "hearthCanvasHubActive") === "true"
    );

    report.CANVAS_LAUNCH_AUTHORITY_OBSERVED = launchAuthority.observed;
    report.CANVAS_LAUNCH_AUTHORITY_PATH = launchAuthority.path;
    report.CANVAS_LAUNCH_PREFACE_HELD = firstKnown(
      getRaw(launchAuthority.primitiveSnapshot, "prefaceHeld", "UNKNOWN"),
      dataValue(targetDocument, "hearthCanvasLaunchPrefaceHeld")
    );
    report.CANVAS_LAUNCH_PREFACE_DECOMMISSIONED = firstKnown(
      getRaw(launchAuthority.primitiveSnapshot, "prefaceDecommissioned", "UNKNOWN"),
      dataValue(targetDocument, "hearthCanvasLaunchPrefaceDecommissioned")
    );

    const mountResult = firstElement(targetDocument, MOUNT_SELECTORS);
    const mount = mountResult.element;
    report.CANVAS_MOUNT_FOUND = Boolean(mount);
    report.CANVAS_MOUNT_SELECTOR = mountResult.selector;
    report.CANVAS_MOUNT_DESCRIPTOR = elementDescriptor(mount);
    report.CANVAS_MOUNT_CHILD_COUNT = mount && mount.children ? mount.children.length : 0;
    report.CANVAS_MOUNT_CHILDREN = collectMountChildren(mount);

    const datasetElements = collectDatasetElements(targetDocument);
    report.HEARTH_DATASET_ELEMENT_COUNT = datasetElements.length;
    report.HEARTH_DATASET_ELEMENTS = datasetElements;

    const selection = selectCanvasCandidate(targetDocument, mount);
    const canvas = selection.canvas;

    report.DOM_CANVAS_COUNT = selection.allCanvas.length;
    report.DOM_SHADOW_CANVAS_COUNT = selection.shadowCanvas.length;
    report.DOM_CANVAS_CANDIDATE_COUNT = selection.allKnownCanvas.length;
    report.DOM_CANVAS_CANDIDATES = selection.allKnownCanvas
      .slice(0, 12)
      .map((candidate, index) => summarizeCanvasCandidate(candidate, mount, targetWindow, targetDocument, index));

    report.CANVAS_ELEMENT_FOUND = Boolean(canvas);
    report.CANVAS_SELECTION_SOURCE = selection.selectionSource;
    report.CANVAS_SELECTOR = selection.selector;
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
        canvas.dataset.hearthCanvasInternalRenewalContract
      );
      report.CANVAS_DATASET_RECEIPT = firstKnown(
        canvas.dataset.hearthCanvasReceipt,
        canvas.dataset.receipt,
        canvas.dataset.hearthCanvasExpressionBridgeReceipt
      );
    }

    if (canvas) {
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
      report.CANVAS_PIXEL_VARIANCE_SIGNAL = pixels.varianceSignal;
      report.CANVAS_PIXEL_SAMPLE_REASON = pixels.reason;

      report.CANVAS_LAYER_BLOCKED = layer.blocked;
      report.CANVAS_LAYER_BLOCKER = layer.blocker;
      report.CANVAS_LAYER_HIT_TARGET = layer.hitTarget;
      report.CANVAS_LAYER_HIT_WITHIN_CANVAS = layer.hitWithinCanvas;

      report.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE = namespaceMatchesDomSurface(canvasAuthority, canvas);
    }

    const rendered = renderedProofFromReport(currentReport);
    report.RENDERED_PLANET_PROOF_READY_INPUT = rendered.renderedPlanetProofReady;
    report.VISIBLE_PLANET_PROOF_READY_INPUT = rendered.visiblePlanetProofReady;
    report.VISIBLE_PLANET_PROOF_SOURCE_INPUT = rendered.visiblePlanetProofSource;
    report.CANVAS_EXPRESSION_SURFACE_READY_INPUT = rendered.canvasExpressionSurfaceReady;
    report.CANVAS_EXPRESSION_RICHNESS_READY_INPUT = rendered.canvasExpressionRichnessReady;

    if ((rendered.renderedPlanetProofReady || rendered.visiblePlanetProofReady) && !report.CANVAS_ELEMENT_FOUND) {
      report.RENDERED_PROOF_CONFLICT_STATUS = "RENDERED_PROOF_READY_WITHOUT_DOM_CANVAS";
      report.RENDERED_PROOF_CONFLICT_CLASS = "NAMESPACE_OR_SURROGATE_PROOF_IS_NOT_CANVAS_SURFACE_TRUTH";
    } else if ((rendered.renderedPlanetProofReady || rendered.visiblePlanetProofReady) && report.CANVAS_ELEMENT_FOUND) {
      report.RENDERED_PROOF_CONFLICT_STATUS = "RENDERED_PROOF_HAS_DOM_CANVAS_CANDIDATE";
      report.RENDERED_PROOF_CONFLICT_CLASS = "DOM_CANVAS_CANDIDATE_AVAILABLE_FOR_SURFACE_TRUTH";
    } else {
      report.RENDERED_PROOF_CONFLICT_STATUS = "NO_RENDERED_PROOF_CONFLICT";
      report.RENDERED_PROOF_CONFLICT_CLASS = "NONE";
    }

    return { ...report, failure: resolveCausalFailure(report) };
  }

  function resolveCausalFailure(report) {
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
        "CANVAS_SCRIPT_EXECUTION_INFERRED",
        report.CANVAS_SCRIPT_PRESENT === true && report.CANVAS_SCRIPT_EXECUTION_INFERRED !== true,
        "CANVAS_SCRIPT_PRESENT_BUT_EXECUTION_NOT_PROVEN",
        "CANVAS_SCRIPT_TAG_EXISTS_BUT_NO_ALIAS_DATASET_OR_DOM_EXECUTION_SIGNAL_WAS_OBSERVED",
        "CANVAS_SCRIPT_EXECUTION_OR_RUNTIME_ERROR",
        CANVAS_FILE,
        "AUDIT_CANVAS_FILE_TOP_LEVEL_EXECUTION_AND_EARLY_PUBLICATION"
      ],
      [
        "CANVAS_AUTHORITY_OBSERVED",
        report.CANVAS_AUTHORITY_OBSERVED !== true,
        "CANVAS_AUTHORITY_NOT_PUBLISHED",
        "CANVAS_SCRIPT_OR_ROUTE_MAY_LOAD_BUT_EXPECTED_CANVAS_PUBLIC_NAMESPACE_IS_MISSING",
        "CANVAS_ALIAS_PUBLICATION",
        CANVAS_FILE,
        "VERIFY_CANVAS_FILE_PUBLISHES_EXPECTED_PUBLIC_ALIASES_BEFORE_OR_DURING_BOOT"
      ],
      [
        "CANVAS_BOOT_OR_MOUNT_API_PRESENT",
        report.CANVAS_BOOT_OR_MOUNT_API_PRESENT !== true,
        "CANVAS_BOOT_MOUNT_API_MISSING",
        "CANVAS_AUTHORITY_EXISTS_BUT_HAS_NO_PUBLIC_BOOT_INIT_START_OR_MOUNT_METHOD",
        "CANVAS_PUBLIC_API",
        CANVAS_FILE,
        "VERIFY_CANVAS_AUTHORITY_EXPOSES_BOOT_OR_MOUNT_PUBLIC_API"
      ],
      [
        "DOM_CANVAS_COUNT",
        safeNumber(report.DOM_CANVAS_CANDIDATE_COUNT, 0) <= 0,
        "CANVAS_DOM_SURFACE_NOT_CREATED",
        "CANVAS_AUTHORITY_EXISTS_BUT_NO_REAL_DOM_CANVAS_EXISTS_IN_TARGET_DOCUMENT_OR_OPEN_SHADOW_DOM",
        "CANVAS_DOM_SURFACE_CREATION",
        CANVAS_FILE,
        "AUDIT_CANVAS_BOOT_PATH_FOR_REAL_DOCUMENT_CREATE_ELEMENT_CANVAS_OR_EXISTING_CANVAS_BIND"
      ],
      [
        "CANVAS_ELEMENT_FOUND",
        report.CANVAS_ELEMENT_FOUND !== true,
        "CANVAS_ELEMENT_NOT_FOUND",
        "NO_CANVAS_ELEMENT_MATCHED_EXPECTED_SELECTORS_OR_FALLBACK_SCAN",
        "CANVAS_EXPRESSION_SURFACE",
        CANVAS_FILE,
        "VERIFY_CANVAS_FILE_CREATES_OR_BINDS_A_REAL_DOM_CANVAS_SURFACE"
      ],
      [
        "CANVAS_MOUNT_FOUND",
        report.CANVAS_MOUNT_FOUND !== true,
        "CANVAS_MOUNT_NOT_FOUND",
        "NO_EXPECTED_HEARTH_CANVAS_MOUNT_FOUND",
        "HTML_SHELL_OR_STAGE_MARKUP",
        HTML_FILE,
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
        HTML_FILE,
        "AUDIT_DISPLAY_VISIBILITY_OPACITY_POINTER_EVENTS"
      ],
      [
        "CANVAS_VIEWPORT_INTERSECTING",
        report.CANVAS_VIEWPORT_INTERSECTING !== true,
        "CANVAS_OUTSIDE_VIEWPORT",
        "CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT",
        "CSS_LAYOUT_OR_SCROLL_POSITION",
        HTML_FILE,
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
        HTML_FILE,
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
        reason: "DOM_CANVAS_NAMESPACE_PIXEL_AND_LAYER_PROOF_PASSED",
        owner: "NONE",
        file: "NONE",
        action: "RETURN_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_STANDARD_CHECK"
      };
    }

    return {
      coordinate: failed[0],
      failureClass: failed[2],
      reason: failed[3],
      owner: failed[4],
      file: failed[5],
      action: failed[6]
    };
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === "none") continue;

      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1400);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function collectLabCardinalReceiptBundle(targetWindow, currentReport) {
    const north = selectAuthority("north", LAB_PATHS.north, targetWindow);
    const east = selectAuthority("east", LAB_PATHS.east, targetWindow);
    const south = selectAuthority("south", LAB_PATHS.south, targetWindow);
    const west = selectAuthority("west", LAB_PATHS.west, targetWindow);

    if (currentReport.NORTH_CONTRACT && north.contract === "UNKNOWN") north.contract = currentReport.NORTH_CONTRACT;
    if (currentReport.EAST_CONTRACT && east.contract === "UNKNOWN") east.contract = currentReport.EAST_CONTRACT;
    if (currentReport.SOUTH_CONTRACT && south.contract === "UNKNOWN") south.contract = currentReport.SOUTH_CONTRACT;
    if (currentReport.WEST_CONTRACT && west.contract === "UNKNOWN") west.contract = currentReport.WEST_CONTRACT;

    const observedCount = [north, east, south, west].filter(
      (item) => item.observed || item.contract !== "UNKNOWN"
    ).length;

    return {
      receiptName: "LAB_CARDINAL_RECEIPT_BUNDLE",
      status:
        observedCount === 4
          ? "LAB_CARDINAL_RECEIPT_BUNDLE_COMPLETE"
          : observedCount > 0
            ? "LAB_CARDINAL_RECEIPT_BUNDLE_PARTIAL"
            : "LAB_CARDINAL_RECEIPT_BUNDLE_NOT_OBSERVED",
      observedCount,
      expectedCount: 4,
      north: compactAuthority(north),
      east: compactAuthority(east),
      south: compactAuthority(south),
      west: compactAuthority(west)
    };
  }

  function collectDiagnosticTrackReceipt(targetWindow, currentReport, chronology) {
    const north = selectAuthority("diagnosticNorth", DIAGNOSTIC_PATHS.north, targetWindow);
    const east = selectAuthority("diagnosticEast", DIAGNOSTIC_PATHS.east, targetWindow);
    const west = selectAuthority("diagnosticWest", DIAGNOSTIC_PATHS.west, targetWindow);
    const south = selectAuthority("diagnosticSouth", DIAGNOSTIC_PATHS.south, targetWindow);
    const probeSouth = selectAuthority("diagnosticProbeSouth", DIAGNOSTIC_PATHS.probeSouth, targetWindow);

    const entries = Array.isArray(chronology) ? chronology : [];
    const completeCount = entries.filter(
      (entry) => entry && entry.status === "COMPLETE"
    ).length;
    const firstFailure =
      entries.find((entry) => entry && entry.status && entry.status !== "COMPLETE") ||
      null;

    return {
      receiptName: "DIAGNOSTIC_TRACK_RECEIPT",
      status:
        entries.length && completeCount === entries.length
          ? "DIAGNOSTIC_TRACK_RECEIPT_COMPLETE"
          : entries.length
            ? "DIAGNOSTIC_TRACK_RECEIPT_PARTIAL"
            : "DIAGNOSTIC_TRACK_RECEIPT_FROM_ALIASES_ONLY",
      chronologyObserved: entries.length > 0,
      chronologyStepCount: entries.length,
      chronologyCompleteCount: completeCount,
      firstFailedStage: firstFailure
        ? `${firstFailure.fibonacciStage || "UNKNOWN"}:${firstFailure.id || "UNKNOWN"}`
        : "NONE",
      north: compactAuthority(north),
      east: compactAuthority(east),
      west: compactAuthority(west),
      south: compactAuthority(south),
      probeSouth: compactAuthority(probeSouth),
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

  function collectCanvasBishopReceipt(targetWindow, canvasReport, currentReport) {
    const canvasHub = selectAuthority("canvasHub", CANVAS_AUTHORITY_PATHS, targetWindow);
    const canvasLaunch = selectAuthority("canvasLaunch", CANVAS_LAUNCH_PATHS, targetWindow);
    const routeConductor = selectAuthority("routeConductor", ROUTE_CONDUCTOR_PATHS, targetWindow);
    const control = selectAuthority("control", CONTROL_PATHS, targetWindow);

    const canvasDomReady = Boolean(
      canvasReport.CANVAS_ELEMENT_FOUND === true &&
      canvasReport.CANVAS_RECT_NONZERO === true &&
      canvasReport.CANVAS_CONTEXT_2D_READY === true &&
      canvasReport.CANVAS_PIXEL_VISIBLE === true
    );

    const canvasAuthorityReady = Boolean(canvasReport.CANVAS_AUTHORITY_OBSERVED === true);

    return {
      receiptName: "CANVAS_BISHOP_RECEIPT",
      status:
        canvasDomReady && canvasAuthorityReady
          ? "CANVAS_BISHOP_RECEIPT_COMPLETE"
          : canvasDomReady || canvasAuthorityReady
            ? "CANVAS_BISHOP_RECEIPT_PARTIAL"
            : "CANVAS_BISHOP_RECEIPT_NOT_OBSERVED",
      canvasDomReady,
      canvasAuthorityReady,
      canvasScriptPresent: canvasReport.CANVAS_SCRIPT_PRESENT === true,
      canvasScriptExecutionInferred: canvasReport.CANVAS_SCRIPT_EXECUTION_INFERRED === true,
      pixelVisible: canvasReport.CANVAS_PIXEL_VISIBLE === true,
      canvasPixelSampleStatus: canvasReport.CANVAS_PIXEL_SAMPLE_STATUS,
      canvasTruthFailureClass: canvasReport.CANVAS_TRUTH_FAILURE_CLASS || "UNKNOWN",
      renderedProofConflictStatus: canvasReport.RENDERED_PROOF_CONFLICT_STATUS,
      renderedProofConflictClass: canvasReport.RENDERED_PROOF_CONFLICT_CLASS,
      canvasHub: compactAuthority(canvasHub),
      canvasLaunch: compactAuthority(canvasLaunch),
      routeConductor: compactAuthority(routeConductor),
      control: compactAuthority(control),
      currentCanvasParentContract: firstKnown(
        currentReport.CURRENT_CANVAS_PARENT_CONTRACT,
        canvasReport.CANVAS_NAMESPACE_CONTRACT,
        canvasHub.contract
      ),
      currentCanvasParentRecognized: boolText(
        canvasReport.CANVAS_PARENT_CONTRACT_RECOGNIZED === true ||
          currentReport.CURRENT_CANVAS_PARENT_RECOGNIZED === true ||
          currentReport.CURRENT_CANVAS_PARENT_RECOGNIZED === "true",
        "false"
      )
    };
  }

  function truthyAny(...values) {
    return values.some((value) => {
      if (value === true || value === 1 || value === "1") return true;
      if (typeof value === "string" && /true|ready|active|complete|observed|present|valid/i.test(value)) return true;
      return false;
    });
  }

  function callSidecarIfAvailable(authority, payload) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    const methods = [
      "runSouthSurfacePointerRead",
      "inspectSouthSurfacePointer",
      "inspectSurfacePointer",
      "runProbeSidecar",
      "inspect",
      "runDiagnostic"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method](payload);
        if (isObject(output)) {
          if (isObject(output.evidence)) return output.evidence;
          if (isObject(output.REPORT_OBJECT)) return output.REPORT_OBJECT;
          if (isObject(output.report)) return output.report;
          return output;
        }
      } catch (_error) {}
    }

    return null;
  }

  function collectFingerFileReceipt(targetWindow, currentReport, chronology, payload) {
    const surfacePointer = selectAuthority(
      "southSurfacePointer",
      DIAGNOSTIC_PATHS.southSurfacePointer,
      targetWindow
    );
    const fingerInspect = selectAuthority("fingerInspect", FINGER_PATHS, targetWindow);
    const hexSurface = selectAuthority("hexSurface", HEX_PATHS, targetWindow);

    const sidecarReport =
      callSidecarIfAvailable(surfacePointer.authority, {
        currentReport,
        chronology,
        fromCanvasTruthHub: true,
        southProbeEnvelope: clonePlain(
          lastSouthProbeEnvelope || payload.southProbeReceipt || {}
        )
      }) || {};

    const southEnvelopePresent = Boolean(
      lastSouthProbeEnvelope ||
        payload.southProbeReceipt ||
        payload.probeSouthReceipt ||
        getRaw(currentReport, "PROBE_SOUTH_RETURN_PACKET_READY", false) ||
        getRaw(currentReport, "RECEIPT_RETURN_MECHANISM_STATUS", "")
    );

    const boundaryReady = truthyAny(
      sidecarReport.BOUNDARY_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "BOUNDARY_READY", undefined),
      fingerInspect.observed
    );
    const massReady = truthyAny(
      sidecarReport.MASS_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "MASS_READY", undefined),
      fingerInspect.observed
    );
    const surfaceReady = truthyAny(
      sidecarReport.SURFACE_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "SURFACE_READY", undefined),
      fingerInspect.observed
    );
    const lightReady = truthyAny(
      sidecarReport.LIGHT_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "LIGHT_READY", undefined),
      fingerInspect.observed
    );
    const hexReady = truthyAny(
      sidecarReport.HEX_SURFACE_BRIDGE_READY,
      hexSurface.observed
    );

    const readyCount = [boundaryReady, massReady, surfaceReady, lightReady, hexReady].filter(Boolean).length;

    return {
      receiptName: "FINGER_FILE_RECEIPT",
      status:
        readyCount >= 5
          ? "FINGER_FILE_RECEIPT_COMPLETE"
          : readyCount > 0 || surfacePointer.observed || southEnvelopePresent
            ? "FINGER_FILE_RECEIPT_PARTIAL"
            : "FINGER_FILE_RECEIPT_NOT_OBSERVED",
      southProbeToTruthHubTransferStatus: southEnvelopePresent
        ? "PROBE_SOUTH_DATA_RECEIVED_OR_AVAILABLE"
        : "PROBE_SOUTH_DIRECT_DATA_NOT_PRESENT_ALIAS_READ_ATTEMPTED",
      surfacePointer: compactAuthority(surfacePointer),
      fingerInspect: compactAuthority(fingerInspect),
      hexSurface: compactAuthority(hexSurface),
      boundaryFingerReady: boolText(boundaryReady, "false"),
      massFingerReady: boolText(massReady, "false"),
      surfaceFingerReady: boolText(surfaceReady, "false"),
      lightFingerReady: boolText(lightReady, "false"),
      hexSurfaceBridgeReady: boolText(hexReady, "false"),
      readyCount,
      expectedReadyCount: 5,
      sidecarInterpretation: firstKnown(
        sidecarReport.SURFACE_POINTER_INTERPRETATION,
        sidecarReport.DOWNSTREAM_EXPRESSION_SET_STATUS
      ),
      sidecarRecommendedFile: firstKnown(
        sidecarReport.SURFACE_POINTER_RECOMMENDED_FILE,
        "UNKNOWN"
      ),
      files: {
        probeSouthFile: PROBE_SOUTH_FILE,
        southSurfacePointerFile: SOUTH_SURFACE_POINTER_FILE,
        fingerInspectFile: FINGER_INSPECT_FILE,
        hexSurfaceFile: HEX_SURFACE_FILE,
        hexFourPairFile: HEX_FOUR_PAIR_FILE
      }
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

  function makeAnchorReport() {
    return {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_CAUSAL_FORENSICS_ANCHOR_PACKET_v1_3",
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
      CANVAS_LAUNCH_FILE,
      EXPECTED_CANVAS_CONTRACT,
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
      CAUSAL_FORENSICS_VERSION: "v1_3",
      TARGET_CONTEXT_STATUS: "NOT_RUN",
      TARGET_CONTEXT_SOURCE: "ANCHOR_ONLY",

      CANVAS_SCRIPT_PRESENT: "UNKNOWN",
      CANVAS_SCRIPT_EXECUTION_INFERRED: "UNKNOWN",
      CANVAS_AUTHORITY_OBSERVED: "UNKNOWN",
      CANVAS_BOOT_OR_MOUNT_API_PRESENT: "UNKNOWN",
      DOM_CANVAS_COUNT: "UNKNOWN",
      DOM_CANVAS_CANDIDATE_COUNT: "UNKNOWN",

      CANVAS_ELEMENT_FOUND: false,
      CANVAS_SELECTOR: "NOT_RUN",
      CANVAS_MOUNT_FOUND: "UNKNOWN",
      CANVAS_MOUNT_SELECTOR: "NOT_RUN",
      CANVAS_IN_MOUNT: "UNKNOWN",
      CANVAS_RECT_NONZERO: false,
      CANVAS_COMPUTED_VISIBLE: "UNKNOWN",
      CANVAS_VIEWPORT_INTERSECTING: "UNKNOWN",
      CANVAS_CONTEXT_2D_READY: "UNKNOWN",
      CANVAS_PIXEL_SAMPLE_STATUS: "NO_PIXEL_SAMPLE_ANCHOR_ONLY",
      CANVAS_PIXEL_VISIBLE: "UNKNOWN",
      CANVAS_LAYER_BLOCKED: "UNKNOWN",
      CANVAS_LAYER_BLOCKER: "UNKNOWN",
      CANVAS_NAMESPACE_PRESENT: "UNKNOWN",
      CANVAS_NAMESPACE_PATH: "NONE",
      CANVAS_NAMESPACE_CONTRACT: "UNKNOWN",
      CANVAS_NAMESPACE_RECEIPT: "UNKNOWN",
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: "UNKNOWN",
      CANVAS_PARENT_CONTRACT_RECOGNIZED: "UNKNOWN",

      RENDERED_PROOF_CONFLICT_STATUS: "NOT_RUN",
      RENDERED_PROOF_CONFLICT_CLASS: "NOT_RUN",

      CANVAS_TRUTH_STATUS: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_CLASS: "NOT_RUN",
      CANVAS_TRUTH_FAILURE_REASON: "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL",
      CANVAS_TRUTH_RECOMMENDED_OWNER: "NONE",
      CANVAS_TRUTH_RECOMMENDED_FILE: "NONE",
      CANVAS_TRUTH_RECOMMENDED_ACTION:
        "CALL_runProbeCanvasSurfaceTruth_TO_MEASURE_CANVAS_SURFACE_CAUSAL_CHAIN",

      LAB_CARDINAL_RECEIPT_BUNDLE_STATUS: "ANCHOR_READY",
      DIAGNOSTIC_TRACK_RECEIPT_STATUS: "ANCHOR_READY",
      CANVAS_BISHOP_RECEIPT_STATUS: "ANCHOR_READY",
      FINGER_FILE_RECEIPT_STATUS: "ANCHOR_READY",
      PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS: "ANCHOR_READY",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      SECONDARY_EVIDENCE_NOTES:
        "CANVAS_SURFACE_TRUTH_CAUSAL_FORENSICS_ANCHOR_PUBLISHED_SYNCHRONOUSLY | TARGET_NOT_YET_PROBED | NO_PRODUCTION_MUTATION_AUTHORIZED",
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

    const canvasProbe = inspectCanvasSurface(
      context.targetWindow,
      context.targetDocument,
      context.targetSource,
      currentReport
    );

    const failure = canvasProbe.failure || resolveCausalFailure(canvasProbe);

    const canvasReport = {
      ...canvasProbe,
      CANVAS_TRUTH_STATUS:
        failure.coordinate === "NONE"
          ? "CANVAS_SURFACE_TRUTH_PROVEN_NO_FINAL_CLAIM"
          : "CANVAS_SURFACE_TRUTH_FAILED_AT_CAUSAL_COORDINATE",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: failure.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: failure.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: failure.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: failure.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: failure.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: failure.action
    };

    delete canvasReport.failure;

    const labBundle = collectLabCardinalReceiptBundle(context.targetWindow, currentReport);
    const diagnosticTrackReceipt = collectDiagnosticTrackReceipt(context.targetWindow, currentReport, chronology);
    const canvasBishopReceipt = collectCanvasBishopReceipt(context.targetWindow, canvasReport, currentReport);
    const fingerFileReceipt = collectFingerFileReceipt(context.targetWindow, currentReport, chronology, payload);

    const truthHubStatus = buildHubStatus(
      labBundle,
      diagnosticTrackReceipt,
      canvasBishopReceipt,
      fingerFileReceipt
    );

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "CANVAS_SURFACE_TRUTH_CAUSAL_FORENSICS_LENS_ACTIVE",
      "TRUTH_HUB_RETURNS_FOUR_COMPACT_RECEIPT_LANES",
      "LAB_CARDINAL_RECEIPT_BUNDLE_INCLUDED",
      "DIAGNOSTIC_TRACK_RECEIPT_INCLUDED",
      "CANVAS_BISHOP_RECEIPT_INCLUDED",
      "FINGER_FILE_RECEIPT_INCLUDED",
      "TRUTH_HUB_DOES_NOT_DRAW_CANVAS",
      "TRUTH_HUB_DOES_NOT_MUTATE_PRODUCTION",
      `CANVAS_SCRIPT_PRESENT:${canvasReport.CANVAS_SCRIPT_PRESENT}`,
      `CANVAS_SCRIPT_EXECUTION_INFERRED:${canvasReport.CANVAS_SCRIPT_EXECUTION_INFERRED}`,
      `CANVAS_AUTHORITY_OBSERVED:${canvasReport.CANVAS_AUTHORITY_OBSERVED}`,
      `DOM_CANVAS_CANDIDATE_COUNT:${canvasReport.DOM_CANVAS_CANDIDATE_COUNT}`,
      `CANVAS_TRUTH_FIRST_FAILED_COORDINATE:${canvasReport.CANVAS_TRUTH_FIRST_FAILED_COORDINATE}`,
      `CANVAS_TRUTH_FAILURE_CLASS:${canvasReport.CANVAS_TRUTH_FAILURE_CLASS}`,
      `RENDERED_PROOF_CONFLICT_STATUS:${canvasReport.RENDERED_PROOF_CONFLICT_STATUS}`,
      `TRUTH_HUB_STATUS:${truthHubStatus}`
    );

    const report = {
      PACKET_NAME:
        "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_CAUSAL_FORENSICS_PACKET_v1_3",
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
      CANVAS_LAUNCH_FILE,
      EXPECTED_CANVAS_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: startedAt,

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED",
      CANVAS_SURFACE_TRUTH_AVAILABLE: boolText(context.targetAvailable, "false"),
      TRUTH_HUB_ACTIVE: "true",
      TRUTH_HUB_STATUS: truthHubStatus,
      TRUTH_HUB_RECEIPT_LANE_COUNT: "4",
      TRUTH_HUB_RECEIPT_ROUTES:
        "LAB_CARDINAL_RECEIPT_BUNDLE | DIAGNOSTIC_TRACK_RECEIPT | CANVAS_BISHOP_RECEIPT | FINGER_FILE_RECEIPT",
      TRUTH_HUB_PACKET_TEXT_SAFE: "true",
      RECEIPT_RETURN_MECHANISM_STATUS:
        "TRUTH_HUB_COMPACT_CAUSAL_FORENSICS_RECEIPT_RETURN_READY",
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: "true",
      NORTH_READABLE_RECEIPT_SURFACE_READY: "true",

      CAUSAL_FORENSICS_LENS_ACTIVE: true,
      CAUSAL_FORENSICS_VERSION: "v1_3",
      TARGET_ACCESS_ERROR: context.targetAccessError || "NONE",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      ...canvasReport,

      LAB_CARDINAL_RECEIPT_BUNDLE_STATUS: labBundle.status,
      LAB_CARDINAL_RECEIPT_BUNDLE: labBundle,

      DIAGNOSTIC_TRACK_RECEIPT_STATUS: diagnosticTrackReceipt.status,
      DIAGNOSTIC_TRACK_RECEIPT: diagnosticTrackReceipt,

      CANVAS_BISHOP_RECEIPT_STATUS: canvasBishopReceipt.status,
      CANVAS_BISHOP_RECEIPT: canvasBishopReceipt,

      FINGER_FILE_RECEIPT_STATUS: fingerFileReceipt.status,
      FINGER_FILE_RECEIPT: fingerFileReceipt,

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
      packetType: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1_3",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      previousInternalRenewalContract: PREVIOUS_INTERNAL_RENEWAL_CONTRACT,
      previousInternalRenewalReceipt: PREVIOUS_INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      canvasLaunchFile: CANVAS_LAUNCH_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      diagnosticOnly: true,
      anchorSafeChronologyObservation: true,
      causalForensicsLensActive: true,
      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,

      canvasSurfaceTruthProbeStatus: getRaw(r, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "ANCHOR_READY"),
      canvasSurfaceTruthAvailable: getRaw(r, "CANVAS_SURFACE_TRUTH_AVAILABLE", "UNKNOWN"),
      truthHubActive: true,
      truthHubStatus: getRaw(r, "TRUTH_HUB_STATUS", "ANCHOR_READY_TARGET_NOT_YET_PROBED"),
      receiptLaneCount: 4,
      receiptRoutes: [
        "LAB_CARDINAL_RECEIPT_BUNDLE",
        "DIAGNOSTIC_TRACK_RECEIPT",
        "CANVAS_BISHOP_RECEIPT",
        "FINGER_FILE_RECEIPT"
      ],

      targetContextStatus: getRaw(r, "TARGET_CONTEXT_STATUS", "UNKNOWN"),
      targetContextSource: getRaw(r, "TARGET_CONTEXT_SOURCE", "UNKNOWN"),

      canvasScriptPresent: getRaw(r, "CANVAS_SCRIPT_PRESENT", "UNKNOWN"),
      canvasScriptCount: getRaw(r, "CANVAS_SCRIPT_COUNT", "UNKNOWN"),
      canvasScriptSrc: getRaw(r, "CANVAS_SCRIPT_SRC", "UNKNOWN"),
      canvasScriptCacheKey: getRaw(r, "CANVAS_SCRIPT_CACHE_KEY", "UNKNOWN"),
      canvasScriptExecutionInferred: getRaw(r, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN"),

      canvasAuthorityObserved: getRaw(r, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN"),
      canvasAuthoritySourcePath: getRaw(r, "CANVAS_AUTHORITY_SOURCE_PATH", "NONE"),
      canvasAuthorityContract: getRaw(r, "CANVAS_AUTHORITY_CONTRACT", "UNKNOWN"),
      canvasAuthorityReceipt: getRaw(r, "CANVAS_AUTHORITY_RECEIPT", "UNKNOWN"),
      canvasAuthorityMethodCount: getRaw(r, "CANVAS_AUTHORITY_METHOD_COUNT", 0),

      canvasBootOrMountApiPresent: getRaw(r, "CANVAS_BOOT_OR_MOUNT_API_PRESENT", "UNKNOWN"),
      canvasDomSurfaceIntentApiPresent: getRaw(r, "CANVAS_DOM_SURFACE_INTENT_API_PRESENT", "UNKNOWN"),
      canvasReceiptApiPresent: getRaw(r, "CANVAS_RECEIPT_API_PRESENT", "UNKNOWN"),
      canvasGovernedSourceReceiverApiPresent: getRaw(r, "CANVAS_GOVERNED_SOURCE_RECEIVER_API_PRESENT", "UNKNOWN"),
      canvasLaunchHandshakeApiPresent: getRaw(r, "CANVAS_LAUNCH_HANDSHAKE_API_PRESENT", "UNKNOWN"),

      canvasMountFound: getRaw(r, "CANVAS_MOUNT_FOUND", "UNKNOWN"),
      canvasMountSelector: getRaw(r, "CANVAS_MOUNT_SELECTOR", "UNKNOWN"),
      canvasMountChildCount: getRaw(r, "CANVAS_MOUNT_CHILD_COUNT", 0),

      domCanvasCount: getRaw(r, "DOM_CANVAS_COUNT", "UNKNOWN"),
      domShadowCanvasCount: getRaw(r, "DOM_SHADOW_CANVAS_COUNT", "UNKNOWN"),
      domCanvasCandidateCount: getRaw(r, "DOM_CANVAS_CANDIDATE_COUNT", "UNKNOWN"),

      canvasElementFound: getRaw(r, "CANVAS_ELEMENT_FOUND", false),
      canvasSelectionSource: getRaw(r, "CANVAS_SELECTION_SOURCE", "UNKNOWN"),
      canvasSelector: getRaw(r, "CANVAS_SELECTOR", "UNKNOWN"),
      canvasInMount: getRaw(r, "CANVAS_IN_MOUNT", "UNKNOWN"),
      canvasRectNonzero: getRaw(r, "CANVAS_RECT_NONZERO", false),
      canvasComputedVisible: getRaw(r, "CANVAS_COMPUTED_VISIBLE", "UNKNOWN"),
      canvasViewportIntersecting: getRaw(r, "CANVAS_VIEWPORT_INTERSECTING", "UNKNOWN"),
      canvasContext2dReady: getRaw(r, "CANVAS_CONTEXT_2D_READY", "UNKNOWN"),
      canvasPixelSampleStatus: getRaw(r, "CANVAS_PIXEL_SAMPLE_STATUS", "NO_PIXEL_SAMPLE"),
      canvasPixelVisible: getRaw(r, "CANVAS_PIXEL_VISIBLE", "UNKNOWN"),
      canvasLayerBlocked: getRaw(r, "CANVAS_LAYER_BLOCKED", "UNKNOWN"),
      canvasNamespacePresent: getRaw(r, "CANVAS_NAMESPACE_PRESENT", "UNKNOWN"),
      canvasParentContractRecognized: getRaw(r, "CANVAS_PARENT_CONTRACT_RECOGNIZED", "UNKNOWN"),
      canvasNamespaceMatchesDomSurface: getRaw(r, "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE", "UNKNOWN"),

      renderedProofConflictStatus: getRaw(r, "RENDERED_PROOF_CONFLICT_STATUS", "UNKNOWN"),
      renderedProofConflictClass: getRaw(r, "RENDERED_PROOF_CONFLICT_CLASS", "UNKNOWN"),

      canvasTruthStatus: getRaw(r, "CANVAS_TRUTH_STATUS", "ANCHOR_READY_TARGET_NOT_YET_PROBED"),
      canvasTruthFirstFailedCoordinate: getRaw(r, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "NOT_RUN"),
      canvasTruthFailureClass: getRaw(r, "CANVAS_TRUTH_FAILURE_CLASS", "NOT_RUN"),
      canvasTruthFailureReason: getRaw(r, "CANVAS_TRUTH_FAILURE_REASON", "ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL"),
      canvasTruthRecommendedOwner: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_OWNER", "NONE"),
      canvasTruthRecommendedFile: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_FILE", "NONE"),
      canvasTruthRecommendedAction: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_ACTION", "CALL_runProbeCanvasSurfaceTruth_TO_MEASURE_CANVAS_SURFACE_CAUSAL_CHAIN"),

      labCardinalReceiptBundleStatus: getRaw(r, "LAB_CARDINAL_RECEIPT_BUNDLE_STATUS", "ANCHOR_READY"),
      diagnosticTrackReceiptStatus: getRaw(r, "DIAGNOSTIC_TRACK_RECEIPT_STATUS", "ANCHOR_READY"),
      canvasBishopReceiptStatus: getRaw(r, "CANVAS_BISHOP_RECEIPT_STATUS", "ANCHOR_READY"),
      fingerFileReceiptStatus: getRaw(r, "FINGER_FILE_RECEIPT_STATUS", "ANCHOR_READY"),
      probeSouthToTruthHubTransferStatus: getRaw(r, "PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS", "ANCHOR_READY"),

      receiptReturnMechanismStatus: getRaw(r, "RECEIPT_RETURN_MECHANISM_STATUS", "ANCHOR_SAFE_RECEIPT_READY"),
      diagnosticUiReadableReceiptSurfaceReady: getRaw(r, "DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY", "true"),
      northReadableReceiptSurfaceReady: getRaw(r, "NORTH_READABLE_RECEIPT_SURFACE_READY", "true"),

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
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
      canvasSelectors: CANVAS_SELECTORS.slice(),
      mountSelectors: MOUNT_SELECTORS.slice(),
      supportsAnchorSafeChronologyObservation: true,
      supportsCoordinateSpecificFailure: true,
      supportsCausalForensicsLens: true,
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
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "CANVAS_FILE",
      "CANVAS_LAUNCH_FILE",
      "EXPECTED_CANVAS_CONTRACT",
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
      "INDEX_SCRIPT_PRESENT",
      "CONTROL_SCRIPT_PRESENT",

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
      "CANVAS_RECEIPT_API_PRESENT",
      "CANVAS_GOVERNED_SOURCE_RECEIVER_API_PRESENT",
      "CANVAS_LAUNCH_HANDSHAKE_API_PRESENT",
      "CANVAS_BOOT_METHODS_PRESENT",
      "CANVAS_DOM_METHODS_PRESENT",
      "CANVAS_RECEIPT_METHODS_PRESENT",
      "CANVAS_SOURCE_RECEIVER_METHODS_PRESENT",
      "CANVAS_LAUNCH_METHODS_PRESENT",

      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_MOUNT_DESCRIPTOR",
      "CANVAS_MOUNT_CHILD_COUNT",
      "CANVAS_MOUNT_CHILDREN",

      "HEARTH_DATASET_ELEMENT_COUNT",
      "HEARTH_DATASET_ELEMENTS",

      "DOM_CANVAS_COUNT",
      "DOM_SHADOW_CANVAS_COUNT",
      "DOM_CANVAS_CANDIDATE_COUNT",
      "DOM_CANVAS_CANDIDATES",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_SELECTION_SOURCE",
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
      "CANVAS_PIXEL_VARIANCE_SIGNAL",
      "CANVAS_PIXEL_SAMPLE_REASON",
      "CANVAS_LAYER_BLOCKED",
      "CANVAS_LAYER_BLOCKER",
      "CANVAS_LAYER_HIT_TARGET",
      "CANVAS_LAYER_HIT_WITHIN_CANVAS",
      "CANVAS_NAMESPACE_PRESENT",
      "CANVAS_NAMESPACE_PATH",
      "CANVAS_NAMESPACE_CONTRACT",
      "CANVAS_NAMESPACE_RECEIPT",
      "CANVAS_PARENT_CONTRACT_RECOGNIZED",
      "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE",

      "RENDERED_PLANET_PROOF_READY_INPUT",
      "VISIBLE_PLANET_PROOF_READY_INPUT",
      "VISIBLE_PLANET_PROOF_SOURCE_INPUT",
      "CANVAS_EXPRESSION_SURFACE_READY_INPUT",
      "CANVAS_EXPRESSION_RICHNESS_READY_INPUT",
      "RENDERED_PROOF_CONFLICT_STATUS",
      "RENDERED_PROOF_CONFLICT_CLASS",

      "CANVAS_TRUTH_STATUS",
      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",

      "LAB_CARDINAL_RECEIPT_BUNDLE_STATUS",
      "DIAGNOSTIC_TRACK_RECEIPT_STATUS",
      "CANVAS_BISHOP_RECEIPT_STATUS",
      "FINGER_FILE_RECEIPT_STATUS",
      "PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS",

      "LAB_CARDINAL_RECEIPT_BUNDLE",
      "DIAGNOSTIC_TRACK_RECEIPT",
      "CANVAS_BISHOP_RECEIPT",
      "FINGER_FILE_RECEIPT",

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
      line("TRUTH_HUB_STATUS", getRaw(report, "TRUTH_HUB_STATUS", "UNKNOWN")),
      line("CAUSAL_FORENSICS_LENS_ACTIVE", getRaw(report, "CAUSAL_FORENSICS_LENS_ACTIVE", "UNKNOWN")),
      line("TARGET_CONTEXT_STATUS", getRaw(report, "TARGET_CONTEXT_STATUS", "UNKNOWN")),
      line("CANVAS_SCRIPT_PRESENT", getRaw(report, "CANVAS_SCRIPT_PRESENT", "UNKNOWN")),
      line("CANVAS_SCRIPT_EXECUTION_INFERRED", getRaw(report, "CANVAS_SCRIPT_EXECUTION_INFERRED", "UNKNOWN")),
      line("CANVAS_AUTHORITY_OBSERVED", getRaw(report, "CANVAS_AUTHORITY_OBSERVED", "UNKNOWN")),
      line("CANVAS_AUTHORITY_SOURCE_PATH", getRaw(report, "CANVAS_AUTHORITY_SOURCE_PATH", "UNKNOWN")),
      line("CANVAS_BOOT_OR_MOUNT_API_PRESENT", getRaw(report, "CANVAS_BOOT_OR_MOUNT_API_PRESENT", "UNKNOWN")),
      line("DOM_CANVAS_CANDIDATE_COUNT", getRaw(report, "DOM_CANVAS_CANDIDATE_COUNT", "UNKNOWN")),
      line("CANVAS_ELEMENT_FOUND", getRaw(report, "CANVAS_ELEMENT_FOUND", "UNKNOWN")),
      line("CANVAS_PIXEL_SAMPLE_STATUS", getRaw(report, "CANVAS_PIXEL_SAMPLE_STATUS", "UNKNOWN")),
      line("CANVAS_PIXEL_VISIBLE", getRaw(report, "CANVAS_PIXEL_VISIBLE", "UNKNOWN")),
      line("RENDERED_PROOF_CONFLICT_STATUS", getRaw(report, "RENDERED_PROOF_CONFLICT_STATUS", "UNKNOWN")),
      line("CANVAS_TRUTH_FIRST_FAILED_COORDINATE", getRaw(report, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getRaw(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_FILE", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_ACTION", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN")),
      line("PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS", getRaw(report, "PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS", "UNKNOWN")),
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
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
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

  function publish() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    root.HEARTH.diagnosticProbeCanvasSurfaceTruth = api;
    root.HEARTH.diagnosticCanvasSurfaceTruthProbe = api;
    root.HEARTH.diagnosticProbeCanvasTruth = api;
    root.HEARTH.diagnosticCanvasTruthProbe = api;
    root.HEARTH.diagnosticRailProbeCanvasSurfaceTruth = api;
    root.HEARTH.diagnosticCanvasSurfaceTruthReceiptHub = api;
    root.HEARTH.diagnosticTruthHub = api;

    root.DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthReceiptHub = api;
    root.DEXTER_LAB.hearthDiagnosticTruthHub = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB = api;
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_REPORT = clonePlain(lastReport || makeAnchorReport());
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_REPORT = clonePlain(lastReport || makeAnchorReport());

    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_LAB_CARDINAL_RECEIPT = clonePlain(
      getRaw(lastReport || {}, "LAB_CARDINAL_RECEIPT_BUNDLE", {})
    );
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_DIAGNOSTIC_TRACK_RECEIPT = clonePlain(
      getRaw(lastReport || {}, "DIAGNOSTIC_TRACK_RECEIPT", {})
    );
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_CANVAS_BISHOP_RECEIPT = clonePlain(
      getRaw(lastReport || {}, "CANVAS_BISHOP_RECEIPT", {})
    );
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_FINGER_FILE_RECEIPT = clonePlain(
      getRaw(lastReport || {}, "FINGER_FILE_RECEIPT", {})
    );

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_COMPACT_SUMMARY = lastCompactSummary || "";

    return true;
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
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    canvasFile: CANVAS_FILE,
    canvasLaunchFile: CANVAS_LAUNCH_FILE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

    diagnosticOnly: true,
    anchorSafeChronologyObservation: true,
    receiptHubActive: true,
    fourLaneReceiptHubActive: true,
    causalForensicsLensActive: true,

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

    supportsAnchorSafeChronologyObservation: true,
    supportsCanvasScriptProbe: true,
    supportsCanvasAuthorityProbe: true,
    supportsCanvasPublicApiProbe: true,
    supportsCanvasElementProbe: true,
    supportsCanvasMountProbe: true,
    supportsCanvasRectProbe: true,
    supportsComputedVisibilityProbe: true,
    supportsViewportIntersectionProbe: true,
    supportsContext2dProbe: true,
    supportsPixelSampleProbe: true,
    supportsLayerObstructionProbe: true,
    supportsNamespaceDomMatchProbe: true,
    supportsRenderedProofConflictClassification: true,
    supportsCoordinateSpecificFailure: true,
    supportsCausalForensicsLens: true,
    supportsFourLaneReceiptHub: true,
    supportsLabCardinalReceiptBundle: true,
    supportsDiagnosticTrackReceipt: true,
    supportsCanvasBishopReceipt: true,
    supportsFingerFileReceipt: true,
    supportsProbeSouthReceiptIngestion: true,
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

  lastReceipt = buildReceipt(makeAnchorReport());
  lastPacketText = composePacketText(makeAnchorReport());
  lastCompactSummary = composeCompactSummary(makeAnchorReport());

  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
