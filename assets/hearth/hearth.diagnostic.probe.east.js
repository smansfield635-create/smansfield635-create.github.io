// /assets/hearth/hearth.diagnostic.probe.east.js
// HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic probe EAST child only.
// Purpose:
// - Add the under-hood EAST probe required by North v9 eight-way bridge.
// - Read source-side file composition and bridge surfaces without renewing diagnostic rail EAST.
// - Confirm whether the visible diagnostic receiver can keep calling NORTH only.
// - Inspect loaded script composition, global authority footprints, dataset bridge surfaces,
//   target-stage/mount/canvas/expression-surface selectors, and source-to-canvas handoff claims.
// - Distinguish served source presence from rendered-target proof.
// - Preserve Rail EAST as the source-footprint evidence standard and Probe EAST as the
//   file-composition / bridge-surface under-hood instrument.
// - Treat stale script query keys as secondary if rendered/global authority proves the current contract.
// - Report missing canvas parent / expression surface / finger composition as probe evidence, not repair.
// - Preserve no production mutation, no cache repair, no runtime restart, no Canvas release,
//   no Macro West release, no visual-pass claim, no generated image, no GraphicBox, no WebGL.
//
// Does not own:
// - final PRIMARY_CASE selection
// - final recommendation selection
// - diagnostic UI
// - diagnostic receiver HTML
// - Rail EAST replacement
// - rendered-target proof
// - hit-test proof
// - packet formatting
// - Hearth repair
// - production mutation
// - cache mutation
// - runtime restart
// - Canvas release
// - Macro West release
// - terrain/material/hydrology truth
// - control implementation
// - canvas implementation
// - bishop implementation
// - queen implementation

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_RECEIPT_v1";

  const VERSION =
    "2026-06-05.hearth-diagnostic-probe-east-served-source-file-composition-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const PARENT_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const PARENT_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_RECEIPT_v9";

  const RAIL_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const RAIL_EAST_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";

  const PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";

  const CURRENT_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const CURRENT_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const CURRENT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const ROUTE_CONDUCTOR_SCRIPT_CACHE_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const FILES = Object.freeze({
    railNorth: "/assets/hearth/hearth.diagnostic.rail.js",
    railEast: "/assets/hearth/hearth.diagnostic.east.js",
    railSouth: "/assets/hearth/hearth.diagnostic.south.js",
    railWest: "/assets/hearth/hearth.diagnostic.west.js",

    probeNorth: "/assets/hearth/hearth.diagnostic.probe.north.js",
    probeEast: FILE,
    probeSouth: "/assets/hearth/hearth.diagnostic.probe.south.js",
    probeWest: "/assets/hearth/hearth.diagnostic.probe.west.js",

    index: "/showroom/globe/hearth/index.js",
    routeConductor: "/showroom/globe/hearth/hearth.js",
    controls: "/assets/hearth/hearth.controls.js",
    canvas: "/assets/hearth/hearth.canvas.js",

    hexAuthority: "/assets/hearth/hearth.hex.four-pair.authority.js",
    hexSurface: "/assets/hearth/hearth.hex.surface.js",

    labNorth: "/assets/lab/runtime-table.js",
    labEast: "/assets/lab/runtime-table.east.js",
    labSouth: "/assets/lab/runtime-table.south.js",
    labWest: "/assets/lab/runtime-table.west.js",

    macroWest: "/assets/hearth/hearth.west.index-handoff.table.js",

    canvasNorth: "/assets/hearth/hearth.canvas.north.js",
    canvasEast: "/assets/hearth/hearth.canvas.east.js",
    canvasSouth: "/assets/hearth/hearth.canvas.south.js",
    canvasWest: "/assets/hearth/hearth.canvas.west.js",

    bishopNorth: "/assets/hearth/hearth.bishop.north.js",
    bishopEast: "/assets/hearth/hearth.bishop.east.js",
    bishopSouth: "/assets/hearth/hearth.bishop.south.js",
    bishopWest: "/assets/hearth/hearth.bishop.west.js",

    fingerBoundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    fingerMass: "/assets/hearth/hearth.canvas.finger.mass.js",
    fingerSurface: "/assets/hearth/hearth.canvas.finger.surface.js",
    fingerPointer: "/assets/hearth/hearth.canvas.finger.pointer.js",
    fingerLight: "/assets/hearth/hearth.canvas.finger.light.js",
    fingerInspect: "/assets/hearth/hearth.canvas.finger.inspect.js",
    fingerComposite: "/assets/hearth/hearth.canvas.finger.composite.js",

    landChannel: "/assets/hearth/hearth.land.channel.js",
    waterChannel: "/assets/hearth/hearth.water.channel.js",
    airChannel: "/assets/hearth/hearth.air.channel.js"
  });

  const EXPECTED_CONTRACTS = Object.freeze({
    html: CURRENT_HTML_CONTRACT,
    index: CURRENT_INDEX_JS_CONTRACT,
    routeConductor: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    routeConductorScriptCache: ROUTE_CONDUCTOR_SCRIPT_CACHE_CONTRACT,
    controls: EXPECTED_CONTROL_CONTRACT,
    canvas: EXPECTED_CANVAS_CONTRACT,
    railEast: RAIL_EAST_CONTRACT,
    railEastImplementation: RAIL_EAST_IMPLEMENTATION_CONTRACT,
    probeNorth: PROBE_NORTH_CONTRACT,
    probeEast: CONTRACT,
    probeSouth: PROBE_SOUTH_CONTRACT,
    probeWest: PROBE_WEST_CONTRACT
  });

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    ROUTE_CONDUCTOR_SCRIPT_CACHE_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NONE: "none",
    NOT_FOUND: "NOT_FOUND",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    BLOCKED: "BLOCKED",
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    READY: "READY",
    ACTIVE: "ACTIVE",
    ACTIVE_DEGRADED: "ACTIVE_DEGRADED",
    HANDSHAKE_PENDING: "HANDSHAKE_PENDING",
    EXPECTED_NOT_YET_BUILT: "EXPECTED_NOT_YET_BUILT",
    EXPECTED_NOT_YET_WIRED: "EXPECTED_NOT_YET_WIRED"
  });

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED"
  });

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const TARGET_SELECTORS = Object.freeze({
    stage: [
      "#hearthGlobeStage",
      "[data-hearth-globe-stage]",
      "[data-hearth-planet-engine-stage]",
      "[data-hearth-visible-globe-stage]",
      "[data-hearth-expression-stage]",
      "[data-hearth-canvas-stage]"
    ],
    mount: [
      "#hearthCanvasMount",
      "[data-hearth-canvas-mount]",
      "[data-hearth-visible-planet-mount]",
      "[data-hearth-visible-globe-mount]",
      "[data-hearth-expression-mount]",
      "[data-hearth-canvas-expression-mount]"
    ],
    canvas: [
      "canvas[data-hearth-canvas='true']",
      "canvas[data-hearth-canvas-texture='true']",
      "canvas[data-hearth-planet-canvas='true']",
      "#hearthCanvasMount canvas",
      "[data-hearth-canvas-mount] canvas",
      "[data-hearth-expression-mount] canvas",
      "canvas"
    ],
    expressionSurface: [
      "[data-hearth-canvas-texture='true']",
      "[data-hearth-visible-planet='true']",
      "[data-hearth-visible-globe='true']",
      "[data-hearth-visible-globe-carrier]",
      "[data-hearth-base-globe-carrier]",
      "[data-hearth-canvas-surface]",
      "[data-hearth-expression-surface]",
      "[data-hearth-planet-surface]",
      "[data-hearth-surface-layer]",
      "[data-hearth-land-layer]",
      "[data-hearth-water-layer]",
      "[data-hearth-ocean-layer]",
      "[data-hearth-atmosphere-layer]",
      "svg[data-hearth-planet-svg]",
      "svg[data-hearth-visible-globe]"
    ]
  });

  const GLOBAL_PATHS = Object.freeze({
    railNorth: [
      "HEARTH.diagnosticRailNorth",
      "HEARTH.diagnosticNorth",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH",
      "HEARTH_DIAGNOSTIC_NORTH",
      "DEXTER_LAB.hearthDiagnosticRailNorth",
      "DEXTER_LAB.hearthDiagnosticNorth"
    ],
    railEast: [
      "HEARTH.diagnosticRailEast",
      "HEARTH.diagnosticEast",
      "HEARTH_DIAGNOSTIC_RAIL_EAST",
      "HEARTH_DIAGNOSTIC_EAST",
      "DEXTER_LAB.hearthDiagnosticRailEast",
      "DEXTER_LAB.hearthDiagnosticEast"
    ],
    railSouth: [
      "HEARTH.diagnosticRailSouth",
      "HEARTH.diagnosticSouth",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "HEARTH_DIAGNOSTIC_SOUTH",
      "DEXTER_LAB.hearthDiagnosticRailSouth",
      "DEXTER_LAB.hearthDiagnosticSouth"
    ],
    railWest: [
      "HEARTH.diagnosticRailWest",
      "HEARTH.diagnosticWest",
      "HEARTH_DIAGNOSTIC_RAIL_WEST",
      "HEARTH_DIAGNOSTIC_WEST",
      "DEXTER_LAB.hearthDiagnosticRailWest",
      "DEXTER_LAB.hearthDiagnosticWest"
    ],

    probeNorth: [
      "HEARTH.diagnosticProbeNorth",
      "HEARTH.diagnosticNorthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_NORTH",
      "DEXTER_LAB.hearthDiagnosticProbeNorth"
    ],
    probeEast: [
      "HEARTH.diagnosticProbeEast",
      "HEARTH.diagnosticEastProbe",
      "HEARTH_DIAGNOSTIC_PROBE_EAST",
      "DEXTER_LAB.hearthDiagnosticProbeEast"
    ],
    probeSouth: [
      "HEARTH.diagnosticProbeSouth",
      "HEARTH.diagnosticSouthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      "DEXTER_LAB.hearthDiagnosticProbeSouth"
    ],
    probeWest: [
      "HEARTH.diagnosticProbeWest",
      "HEARTH.diagnosticWestProbe",
      "HEARTH_DIAGNOSTIC_PROBE_WEST",
      "DEXTER_LAB.hearthDiagnosticProbeWest"
    ],

    index: [
      "HEARTH.indexJs",
      "HEARTH.indexBridge",
      "HEARTH.frontendButtonAuthorityReset",
      "HEARTH_INDEX_JS",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET",
      "DEXTER_LAB.hearthIndexJs"
    ],
    routeConductor: [
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorControlFileAdmissionAndHandshakeDelivery",
      "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductor"
    ],
    controls: [
      "HEARTH.controls",
      "HEARTH.planetControls",
      "HEARTH.motionTouchControls",
      "HEARTH.viewControls",
      "HEARTH_CONTROLS",
      "HEARTH_PLANET_CONTROLS",
      "HEARTH_PLANETARY_CONTROLS",
      "HEARTH_MOTION_TOUCH_CONTROLS",
      "DEXTER_LAB.hearthControls"
    ],
    canvas: [
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasStation",
      "HEARTH.canvasChildDistributionSwitchboard",
      "HEARTH.canvasHub",
      "HEARTH.canvasParent",
      "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrier",
      "HEARTH.canvasVisibleBaseGlobeCarrier",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasFingerManager",
      "HEARTH.canvas",
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS_STATION",
      "HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_FINGER_MANAGER",
      "HEARTH_CANVAS",
      "DEXTER_LAB.hearthCanvasLocalStation",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvasParent",
      "DEXTER_LAB.hearthCanvas"
    ],
    hexAuthority: [
      "HEARTH.hexFourPairAuthority",
      "HEARTH.hexAuthority",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "DEXTER_LAB.hearthHexFourPairAuthority"
    ],
    hexSurface: [
      "HEARTH.hexSurface",
      "HEARTH.hexFourPairSurface",
      "HEARTH_HEX_SURFACE",
      "HEARTH_HEX_FOUR_PAIR_SURFACE",
      "DEXTER_LAB.hearthHexSurface"
    ],
    labNorth: [
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_CARDINAL_RUNTIME_TABLE_NORTH",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.northCentralTrainStation",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth"
    ],
    labEast: [
      "LAB_RUNTIME_TABLE_EAST",
      "LAB_CARDINAL_RUNTIME_TABLE_EAST",
      "HEARTH_EAST_FIBONACCI_MAGNIFIER",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast"
    ],
    labSouth: [
      "LAB_RUNTIME_TABLE_SOUTH",
      "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_GATE",
      "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.southPrimaryGate"
    ],
    labWest: [
      "LAB_RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "HEARTH.runtimeTableWest",
      "HEARTH.westAdmissibility",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.gapClassifierWest"
    ],
    macroWest: [
      "HEARTH_WEST_INDEX_HANDOFF_TABLE",
      "HEARTH.westIndexHandoffTable",
      "HEARTH.macroWestBridge",
      "HEARTH.westBishopCanvasBridge",
      "DEXTER_LAB.hearthWestIndexHandoffTable"
    ],
    bishopNorth: [
      "HEARTH.bishopNorth",
      "HEARTH.northBishop",
      "HEARTH_BISHOP_NORTH",
      "HEARTH_NORTH_BISHOP",
      "DEXTER_LAB.hearthBishopNorth"
    ],
    bishopEast: [
      "HEARTH.bishopEast",
      "HEARTH.eastBishop",
      "HEARTH_BISHOP_EAST",
      "HEARTH_EAST_BISHOP",
      "DEXTER_LAB.hearthBishopEast"
    ],
    bishopSouth: [
      "HEARTH.bishopSouth",
      "HEARTH.southBishop",
      "HEARTH_BISHOP_SOUTH",
      "HEARTH_SOUTH_BISHOP",
      "DEXTER_LAB.hearthBishopSouth"
    ],
    bishopWest: [
      "HEARTH.bishopWest",
      "HEARTH.westBishop",
      "HEARTH_BISHOP_WEST",
      "HEARTH_WEST_BISHOP",
      "DEXTER_LAB.hearthBishopWest"
    ],
    queen: [
      "HEARTH.queenCanvasRecognition",
      "HEARTH.canvasQueen",
      "HEARTH.routeConductorQueen",
      "HEARTH_QUEEN_CANVAS_RECOGNITION",
      "HEARTH_ROUTE_CONDUCTOR_QUEEN",
      "DEXTER_LAB.hearthQueenCanvasRecognition"
    ],
    landChannel: [
      "HEARTH.landChannel",
      "HEARTH_HEARTH_LAND_CHANNEL",
      "HEARTH_LAND_CHANNEL",
      "DEXTER_LAB.hearthLandChannel"
    ],
    waterChannel: [
      "HEARTH.waterChannel",
      "HEARTH_HEARTH_WATER_CHANNEL",
      "HEARTH_WATER_CHANNEL",
      "DEXTER_LAB.hearthWaterChannel"
    ],
    airChannel: [
      "HEARTH.airChannel",
      "HEARTH_AIR_CHANNEL",
      "DEXTER_LAB.hearthAirChannel"
    ]
  });

  const FINGER_PATHS = Object.freeze({
    boundary: [
      "HEARTH.canvasFingerBoundary",
      "HEARTH.boundaryFinger",
      "HEARTH_CANVAS_FINGER_BOUNDARY",
      "DEXTER_LAB.hearthCanvasFingerBoundary"
    ],
    mass: [
      "HEARTH.canvasFingerMass",
      "HEARTH.massFinger",
      "HEARTH_CANVAS_FINGER_MASS",
      "DEXTER_LAB.hearthCanvasFingerMass"
    ],
    surface: [
      "HEARTH.canvasFingerSurface",
      "HEARTH.surfaceFinger",
      "HEARTH_CANVAS_FINGER_SURFACE",
      "DEXTER_LAB.hearthCanvasFingerSurface"
    ],
    pointer: [
      "HEARTH.canvasFingerPointer",
      "HEARTH.pointerFinger",
      "HEARTH_CANVAS_FINGER_POINTER",
      "DEXTER_LAB.hearthCanvasFingerPointer"
    ],
    light: [
      "HEARTH.canvasFingerLight",
      "HEARTH.lightFinger",
      "HEARTH_CANVAS_FINGER_LIGHT",
      "DEXTER_LAB.hearthCanvasFingerLight"
    ],
    inspect: [
      "HEARTH.canvasFingerInspect",
      "HEARTH.inspectFinger",
      "HEARTH_CANVAS_FINGER_INSPECT",
      "DEXTER_LAB.hearthCanvasFingerInspect"
    ],
    composite: [
      "HEARTH.canvasFingerComposite",
      "HEARTH.compositeFinger",
      "HEARTH_CANVAS_FINGER_COMPOSITE",
      "DEXTER_LAB.hearthCanvasFingerComposite"
    ]
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  let lastState = null;
  let lastEvidencePacket = null;

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
    return String(value);
  }

  function clean(value, limit = 2000) {
    return safeString(value)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function boolValue(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
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

  function addNote(state, note) {
    const value = clean(note, 1600);
    if (!state || !Array.isArray(state.probeEastNotes) || !value) return;
    if (!state.probeEastNotes.includes(value)) state.probeEastNotes.push(value);
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function readPath(base, path) {
    try {
      const parts = safeString(path).split(".");
      let cursor = base;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function q(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelector)) return null;
      return context.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function qa(context, selector) {
    try {
      if (!context || !selector || !isFunction(context.querySelectorAll)) return [];
      return Array.from(context.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function qFirst(context, selectors) {
    for (const selector of selectors || []) {
      const found = q(context, selector);
      if (found) return found;
    }
    return null;
  }

  function datasetOf(el) {
    try {
      return el && el.dataset ? el.dataset : {};
    } catch (_error) {
      return {};
    }
  }

  function readDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function readBodyDataset(targetDocument) {
    try {
      return targetDocument && targetDocument.body
        ? targetDocument.body.dataset || {}
        : {};
    } catch (_error) {
      return {};
    }
  }

  function normalizeSrc(src, targetWindow) {
    const text = safeString(src);
    if (!text) return "";

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(text, origin);
      return `${url.pathname}${url.search || ""}`;
    } catch (_error) {
      return text;
    }
  }

  function readCacheKey(src, targetWindow) {
    const text = safeString(src);

    try {
      const origin =
        targetWindow && targetWindow.location && targetWindow.location.origin
          ? targetWindow.location.origin
          : root.location && root.location.origin
            ? root.location.origin
            : "https://diamondgatebridge.com";

      const url = new URL(text, origin);
      return url.searchParams.get("v") || url.searchParams.get("cache") || url.searchParams.get("version") || "";
    } catch (_error) {
      const match = text.match(/[?&](?:v|cache|version)=([^&]+)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
  }

  function scriptMatches(script, file, targetWindow) {
    try {
      const raw = script && script.getAttribute ? script.getAttribute("src") : "";
      const src = normalizeSrc(raw, targetWindow);
      const fileName = safeString(file).split("/").filter(Boolean).pop();

      return Boolean(
        src.includes(file) ||
        (fileName && src.endsWith(`/${fileName}`)) ||
        (fileName && src.includes(`/${fileName}?`))
      );
    } catch (_error) {
      return false;
    }
  }

  function findScript(targetDocument, file, targetWindow) {
    const scripts = qa(targetDocument, "script[src]");
    return scripts.find((script) => scriptMatches(script, file, targetWindow)) || null;
  }

  function readScript(targetDocument, targetWindow, file) {
    const script = targetDocument ? findScript(targetDocument, file, targetWindow) : null;
    const rawSrc = script && script.getAttribute ? script.getAttribute("src") : "";

    return {
      file,
      present: Boolean(script),
      src: script ? normalizeSrc(rawSrc, targetWindow) : FALLBACK.NOT_FOUND,
      cacheKey: script ? readCacheKey(rawSrc, targetWindow) : "",
      datasetContract: script && script.dataset
        ? clean(firstDefined(
            script.dataset.contract,
            script.dataset.hearthContract,
            script.dataset.hearthDiagnosticExpectedContract,
            script.dataset.routeConductorCurrentContract,
            script.dataset.hearthRouteConductorContract,
            script.dataset.hearthCanvasContract
          ), 500)
        : ""
    };
  }

  function readAllScripts(targetDocument, targetWindow) {
    const out = {};

    Object.keys(FILES).forEach((key) => {
      out[key] = readScript(targetDocument, targetWindow, FILES[key]);
    });

    return out;
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority)) return {};

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getProbeNorthReceipt",
      "getProbeEastReceipt",
      "getEastReceipt",
      "getWestReceipt",
      "getSouthReceipt",
      "getState",
      "getStatus",
      "getReport",
      "read"
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
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (isObject(authority.state)) return authority.state;

    if (
      authority.contract ||
      authority.CONTRACT ||
      authority.receipt ||
      authority.RECEIPT ||
      authority.implementationContract ||
      authority.version
    ) {
      return authority;
    }

    return {};
  }

  function receiptValue(receipt, keys, fallback = undefined) {
    if (!isObject(receipt)) return fallback;

    for (const key of keys || []) {
      if (receipt[key] !== undefined && receipt[key] !== null && receipt[key] !== "") {
        return receipt[key];
      }

      const lower = safeString(key).toLowerCase();

      for (const candidate of Object.keys(receipt)) {
        if (candidate.toLowerCase() === lower) {
          const value = receipt[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function readContract(authority) {
    if (!authority || !isObject(authority)) return "";

    const receipt = readReceipt(authority);

    return clean(firstDefined(
      receiptValue(receipt, [
        "contract",
        "CONTRACT",
        "currentContract",
        "implementationContract",
        "currentRouteConductorContract",
        "routeConductorContract",
        "canvasContract",
        "currentCanvasParentContract",
        "controlsContract"
      ]),
      authority.contract,
      authority.CONTRACT,
      authority.currentContract,
      authority.implementationContract,
      authority.currentRouteConductorContract,
      authority.routeConductorContract,
      authority.canvasContract,
      authority.currentCanvasParentContract,
      authority.controlsContract
    ), 500);
  }

  function findAuthority(targetWindow, paths) {
    const win = targetWindow || root;

    for (const path of paths || []) {
      const value = readPath(win, path);
      if (value && isObject(value)) {
        const receipt = readReceipt(value);
        return {
          path,
          authority: value,
          receipt,
          contract: readContract(value)
        };
      }
    }

    return {
      path: "NONE",
      authority: null,
      receipt: {},
      contract: ""
    };
  }

  function readAllAuthorities(targetWindow) {
    const out = {};

    Object.keys(GLOBAL_PATHS).forEach((key) => {
      out[key] = findAuthority(targetWindow, GLOBAL_PATHS[key]);
    });

    Object.keys(FINGER_PATHS).forEach((key) => {
      out[`finger${key.charAt(0).toUpperCase()}${key.slice(1)}`] = findAuthority(targetWindow, FINGER_PATHS[key]);
    });

    return out;
  }

  function documentRoute(targetDocument) {
    try {
      const html = targetDocument && targetDocument.documentElement;
      const body = targetDocument && targetDocument.body;
      const htmlData = readDataset(targetDocument);
      const bodyData = readBodyDataset(targetDocument);

      return clean(firstDefined(
        htmlData.route,
        html && html.getAttribute("data-route"),
        bodyData.route,
        body && body.getAttribute("data-route")
      ), 500);
    } catch (_error) {
      return "";
    }
  }

  function pathMatches(targetWindow, route) {
    try {
      const path = targetWindow && targetWindow.location ? targetWindow.location.pathname : "";
      const normal = safeString(route).replace(/\/$/, "");
      return path === route || path === normal;
    } catch (_error) {
      return false;
    }
  }

  function isDiagnosticReceiver(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;

      const data = readDataset(targetDocument);
      const contract = clean(firstDefined(
        data.contract,
        targetDocument.documentElement.getAttribute("data-contract")
      ), 500);
      const page = clean(firstDefined(data.page, targetDocument.documentElement.getAttribute("data-page")), 500);
      const route = documentRoute(targetDocument);

      return Boolean(
        pathMatches(targetWindow, DIAGNOSTIC_ROUTE) ||
        route === DIAGNOSTIC_ROUTE ||
        route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
        /HEARTH_DIAGNOSTIC_ROUTE/i.test(contract) ||
        /diagnostic/i.test(page)
      );
    } catch (_error) {
      return false;
    }
  }

  function hasHearthTargetSignals(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;
      if (isDiagnosticReceiver(targetDocument, targetWindow)) return false;

      const html = targetDocument.documentElement;
      const body = targetDocument.body;
      const htmlData = readDataset(targetDocument);
      const bodyData = readBodyDataset(targetDocument);

      const route = documentRoute(targetDocument);
      const page = clean(firstDefined(htmlData.page, html.getAttribute("data-page")), 500);
      const alias = clean(firstDefined(htmlData.pageAlias, html.getAttribute("data-page-alias")), 500);
      const context = clean(firstDefined(
        htmlData.pageContext,
        html.getAttribute("data-page-context"),
        bodyData.pageContext,
        body && body.getAttribute("data-page-context")
      ), 1000);

      return Boolean(
        pathMatches(targetWindow, TARGET_ROUTE) ||
        route === TARGET_ROUTE ||
        route === TARGET_ROUTE.replace(/\/$/, "") ||
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet engine|planet factory|visible globe|visible planet|canvas expression|mirrorland formation/i.test(context) ||
        qFirst(targetDocument, TARGET_SELECTORS.stage) ||
        qFirst(targetDocument, TARGET_SELECTORS.mount) ||
        qFirst(targetDocument, TARGET_SELECTORS.canvas) ||
        qFirst(targetDocument, TARGET_SELECTORS.expressionSurface)
      );
    } catch (_error) {
      return false;
    }
  }

  function findTargetFrame(sourceDocument) {
    if (!sourceDocument) return null;

    return (
      q(sourceDocument, "#hearthDiagnosticTargetFrame") ||
      q(sourceDocument, "iframe[data-hearth-diagnostic-target-frame='true']") ||
      q(sourceDocument, "iframe[src='/showroom/globe/hearth/']") ||
      q(sourceDocument, "iframe[src*='/showroom/globe/hearth/']")
    );
  }

  function readFrameTarget(frame, state) {
    try {
      if (!frame || !frame.contentWindow) return null;

      const targetWindow = frame.contentWindow;
      const targetDocument = targetWindow.document;

      if (!targetDocument || !targetDocument.documentElement) {
        addNote(state, "PROBE_EAST_TARGET_FRAME_FOUND_BUT_DOCUMENT_UNREADABLE");
        return null;
      }

      if (isDiagnosticReceiver(targetDocument, targetWindow)) {
        addNote(state, "PROBE_EAST_IGNORED_DIAGNOSTIC_RECEIVER_FRAME_AS_TARGET");
        return null;
      }

      return { targetDocument, targetWindow, source: "diagnosticTargetFrame" };
    } catch (error) {
      state.targetAccessError = `TARGET_FRAME_BLOCKED:${clean(error && error.message ? error.message : error, 900)}`;
      addNote(state, state.targetAccessError);
      return null;
    }
  }

  function resolveTarget(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetWindow = opts.targetWindow || opts.targetDocument.defaultView || null;

      if (!isDiagnosticReceiver(opts.targetDocument, targetWindow)) {
        state.targetAccessStatus = "TARGET_DOCUMENT_SUPPLIED";
        return {
          targetDocument: opts.targetDocument,
          targetWindow,
          source: "options.targetDocument"
        };
      }

      addNote(state, "PROBE_EAST_IGNORED_SUPPLIED_DIAGNOSTIC_RECEIVER_DOCUMENT");
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;

        if (targetDocument && targetDocument.documentElement && !isDiagnosticReceiver(targetDocument, targetWindow)) {
          state.targetAccessStatus = "TARGET_WINDOW_SUPPLIED";
          return { targetDocument, targetWindow, source: "options.targetWindow" };
        }

        addNote(state, "PROBE_EAST_IGNORED_SUPPLIED_DIAGNOSTIC_RECEIVER_WINDOW");
      } catch (error) {
        state.targetAccessStatus = "TARGET_WINDOW_BLOCKED";
        state.targetAccessError = `TARGET_WINDOW_BLOCKED:${clean(error && error.message ? error.message : error, 900)}`;
        addNote(state, state.targetAccessError);
      }
    }

    if (opts.frameElement) {
      const frameTarget = readFrameTarget(opts.frameElement, state);
      if (frameTarget) {
        state.targetAccessStatus = "TARGET_FRAME_SUPPLIED";
        return frameTarget;
      }
    }

    const discoveredFrame = findTargetFrame(doc);
    const discoveredTarget = readFrameTarget(discoveredFrame, state);
    if (discoveredTarget) {
      state.targetAccessStatus = "DISCOVERED_TARGET_FRAME";
      return discoveredTarget;
    }

    if (doc && doc.documentElement && !isDiagnosticReceiver(doc, root) && hasHearthTargetSignals(doc, root)) {
      state.targetAccessStatus = "CURRENT_HEARTH_DOCUMENT";
      return { targetDocument: doc, targetWindow: root, source: "currentHearthDocument" };
    }

    state.targetAccessStatus = "SOURCE_ONLY_NO_HEARTH_TARGET";
    state.targetAccessError = "NO_HEARTH_TARGET_DOCUMENT_AVAILABLE_TO_PROBE_EAST";
    addNote(state, "PROBE_EAST_SOURCE_ONLY_NO_HEARTH_TARGET_DOCUMENT_AVAILABLE");

    return { targetDocument: null, targetWindow: null, source: "none" };
  }

  function contractFromDataset(targetDocument) {
    if (!targetDocument || !targetDocument.documentElement) return FALLBACK.UNKNOWN;

    const data = readDataset(targetDocument);
    const bodyData = readBodyDataset(targetDocument);
    const html = targetDocument.documentElement;

    return clean(firstDefined(
      data.contract,
      data.hearthHtmlContract,
      data.hearthShellContract,
      html.getAttribute("data-contract"),
      bodyData.hearthHtmlContract
    ), 500) || FALLBACK.UNKNOWN;
  }

  function selectorName(el) {
    if (!el) return FALLBACK.NOT_FOUND;

    try {
      const tag = el.tagName ? el.tagName.toLowerCase() : "node";
      if (el.id) return `${tag}#${el.id}`;

      const attrs = [
        "data-hearth-globe-stage",
        "data-hearth-visible-globe-stage",
        "data-hearth-canvas-stage",
        "data-hearth-canvas-mount",
        "data-hearth-expression-mount",
        "data-hearth-expression-surface",
        "data-hearth-canvas-surface",
        "data-hearth-visible-planet",
        "data-hearth-visible-globe",
        "data-hearth-canvas-texture",
        "data-hearth-land-layer",
        "data-hearth-water-layer",
        "data-hearth-ocean-layer",
        "data-hearth-atmosphere-layer",
        "aria-label",
        "role"
      ];

      for (const attr of attrs) {
        if (el.hasAttribute && el.hasAttribute(attr)) {
          const value = el.getAttribute(attr);
          if (!value || value === "true") return `${tag}[${attr}]`;
          return `${tag}[${attr}="${clean(value, 120)}"]`;
        }
      }

      if (typeof el.className === "string" && el.className.trim()) {
        return `${tag}.${el.className.trim().split(/\s+/).slice(0, 4).join(".")}`;
      }

      return tag;
    } catch (_error) {
      return FALLBACK.UNREADABLE;
    }
  }

  function rectPacket(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return FALLBACK.NOT_FOUND;
      const rect = el.getBoundingClientRect();

      return [
        `left:${Math.round(rect.left)}`,
        `top:${Math.round(rect.top)}`,
        `width:${Math.round(rect.width)}`,
        `height:${Math.round(rect.height)}`
      ].join(";");
    } catch (_error) {
      return FALLBACK.UNREADABLE;
    }
  }

  function rectNonZero(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    } catch (_error) {
      return false;
    }
  }

  function readBridgeSurfaces(targetDocument, state) {
    const stage = qFirst(targetDocument, TARGET_SELECTORS.stage);
    const mount = qFirst(targetDocument, TARGET_SELECTORS.mount);
    const canvas = qFirst(targetDocument, TARGET_SELECTORS.canvas);
    const surface = qFirst(targetDocument, TARGET_SELECTORS.expressionSurface);

    state.stagePresent = boolText(Boolean(stage));
    state.stageSelector = selectorName(stage);
    state.stageRect = rectPacket(stage);
    state.stageRectNonZero = boolText(rectNonZero(stage));

    state.mountPresent = boolText(Boolean(mount));
    state.mountSelector = selectorName(mount);
    state.mountRect = rectPacket(mount);
    state.mountRectNonZero = boolText(rectNonZero(mount));

    state.canvasElementPresent = boolText(Boolean(canvas));
    state.canvasElementSelector = selectorName(canvas);
    state.canvasElementRect = rectPacket(canvas);
    state.canvasElementRectNonZero = boolText(rectNonZero(canvas));
    state.canvasAttributeWidth = canvas ? clean(canvas.width || 0, 60) : FALLBACK.NOT_FOUND;
    state.canvasAttributeHeight = canvas ? clean(canvas.height || 0, 60) : FALLBACK.NOT_FOUND;

    state.expressionSurfacePresent = boolText(Boolean(surface));
    state.expressionSurfaceSelector = selectorName(surface);
    state.expressionSurfaceRect = rectPacket(surface);
    state.expressionSurfaceRectNonZero = boolText(rectNonZero(surface));

    state.stageMountBridgeStatus =
      state.stageRectNonZero === "true" && state.mountRectNonZero === "true"
        ? "STAGE_AND_MOUNT_BRIDGE_PRESENT"
        : state.stagePresent === "true" || state.mountPresent === "true"
          ? "STAGE_OR_MOUNT_PARTIAL"
          : "STAGE_AND_MOUNT_NOT_FOUND";

    state.expressionSurfaceBridgeStatus =
      state.expressionSurfaceRectNonZero === "true"
        ? "EXPRESSION_SURFACE_BRIDGE_PRESENT"
        : state.canvasElementRectNonZero === "true"
          ? "CANVAS_ELEMENT_BRIDGE_PRESENT"
          : "EXPRESSION_SURFACE_NOT_PROVEN";

    if (state.stageRectNonZero === "true") addNote(state, "PROBE_EAST_STAGE_NONZERO_BRIDGE_SURFACE_OBSERVED");
    else addNote(state, "PROBE_EAST_STAGE_BRIDGE_SURFACE_NOT_CONFIRMED");

    if (state.mountRectNonZero === "true") addNote(state, "PROBE_EAST_MOUNT_NONZERO_BRIDGE_SURFACE_OBSERVED");
    else addNote(state, "PROBE_EAST_MOUNT_BRIDGE_SURFACE_NOT_CONFIRMED");

    if (state.canvasElementRectNonZero === "true") addNote(state, "PROBE_EAST_CANVAS_ELEMENT_BRIDGE_SURFACE_OBSERVED");
    else addNote(state, "PROBE_EAST_CANVAS_ELEMENT_NOT_CONFIRMED_AS_SOURCE_BRIDGE_SURFACE");

    if (state.expressionSurfaceRectNonZero === "true") addNote(state, "PROBE_EAST_EXPRESSION_SURFACE_BRIDGE_OBSERVED");
    else addNote(state, "PROBE_EAST_EXPRESSION_SURFACE_NOT_CONFIRMED");
  }

  function compactScriptFootprint(scriptMap) {
    const out = {};

    Object.keys(scriptMap || {}).forEach((key) => {
      const script = scriptMap[key];
      out[key] = {
        file: script.file,
        present: script.present,
        src: script.src,
        cacheKey: script.cacheKey || FALLBACK.NONE,
        datasetContract: script.datasetContract || FALLBACK.NONE
      };
    });

    return out;
  }

  function compactAuthorityFootprint(authorityMap) {
    const out = {};

    Object.keys(authorityMap || {}).forEach((key) => {
      const found = authorityMap[key] || {};
      out[key] = {
        source: found.path || "NONE",
        present: Boolean(found.authority),
        contract: found.contract || FALLBACK.UNKNOWN,
        receiptPresent: Boolean(found.receipt && Object.keys(found.receipt).length)
      };
    });

    return out;
  }

  function readReceiptStatus(found) {
    const receipt = found && found.receipt ? found.receipt : {};

    return clean(firstDefined(
      receiptValue(receipt, ["status", "STATUS", "eastStatus", "westStatus", "southStatus", "probeEastStatus"]),
      receiptValue(receipt, ["state", "STATE"]),
      found && found.authority && found.authority.status,
      found && found.authority && found.authority.state
    ), 500) || FALLBACK.UNKNOWN;
  }

  function readAuthorityBoolean(found, keys) {
    const receipt = found && found.receipt ? found.receipt : {};
    const authority = found && found.authority ? found.authority : {};

    return boolText(firstDefined(
      receiptValue(receipt, keys),
      ...keys.map((key) => authority[key])
    ), FALLBACK.UNKNOWN);
  }

  function deriveRouteConductorStatus(state, scripts, authorities) {
    const script = scripts.routeConductor || {};
    const found = authorities.routeConductor || {};
    const receipt = found.receipt || {};
    const authorityContract = found.contract || "";
    const servedContract = firstDefined(
      authorityContract,
      receiptValue(receipt, ["currentRouteConductorContract", "routeConductorContract", "contract", "CONTRACT"]),
      script.datasetContract,
      state.targetDatasetRouteConductorContract,
      state.targetDatasetRouteConductorCurrent,
      script.cacheKey
    );

    state.routeConductorScriptPresent = boolText(script.present);
    state.routeConductorScriptSrc = script.src || FALLBACK.NOT_FOUND;
    state.routeConductorScriptCacheKey = script.cacheKey || FALLBACK.NONE;
    state.routeConductorAuthoritySource = found.path || "NONE";
    state.routeConductorAuthorityPresent = boolText(Boolean(found.authority));
    state.routeConductorAuthorityContract = authorityContract || FALLBACK.UNKNOWN;
    state.routeConductorServedContract = clean(servedContract, 500) || FALLBACK.UNKNOWN;
    state.routeConductorCurrentSpreadRecognized = boolText(
      state.routeConductorServedContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT ||
      ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(state.routeConductorServedContract)
    );

    state.routeConductorRenderedAuthorityOverridesScriptCache = boolText(
      Boolean(
        authorityContract &&
        script.cacheKey &&
        authorityContract !== script.cacheKey &&
        authorityContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT
      )
    );

    state.cacheKeyStaleNonBlocking = state.routeConductorRenderedAuthorityOverridesScriptCache;
    state.servedContractMismatchIsBlocking = state.routeConductorCurrentSpreadRecognized === "true" ? "false" : FALLBACK.UNKNOWN;

    state.bishopQueenRecognitionFunnelClaim = readAuthorityBoolean(found, [
      "bishopQueenCanvasRecognitionFunnelActive",
      "bishopQueenCanvasRecognitionActive",
      "queenCanvasRecognitionActive"
    ]);

    state.routeConductorCanvasHandoffClaim = readAuthorityBoolean(found, [
      "canvasHandoffActive",
      "fourWayCanvasHandoffActive",
      "routeCanvasHandshakeReady",
      "visiblePlanetProofReady"
    ]);

    if (state.routeConductorCurrentSpreadRecognized === "true") {
      addNote(state, "PROBE_EAST_ROUTE_CONDUCTOR_CURRENT_OR_ACCEPTED_SPREAD_RECOGNIZED");
    } else {
      addNote(state, "PROBE_EAST_ROUTE_CONDUCTOR_CURRENT_SPREAD_NOT_CONFIRMED");
    }

    if (state.routeConductorRenderedAuthorityOverridesScriptCache === "true") {
      addNote(
        state,
        `PROBE_EAST_ROUTE_CONDUCTOR_AUTHORITY_OVERRIDES_STALE_SCRIPT_CACHE:${authorityContract}>${script.cacheKey}`
      );
    }
  }

  function deriveIndexStatus(state, scripts, authorities) {
    const script = scripts.index || {};
    const found = authorities.index || {};
    const receipt = found.receipt || {};
    const contract = clean(firstDefined(
      found.contract,
      receiptValue(receipt, ["contract", "CONTRACT", "currentIndexJsContract", "indexJsContract"]),
      script.datasetContract,
      state.targetDatasetIndexJsContract,
      script.cacheKey
    ), 500) || FALLBACK.UNKNOWN;

    state.indexScriptPresent = boolText(script.present);
    state.indexScriptSrc = script.src || FALLBACK.NOT_FOUND;
    state.indexScriptCacheKey = script.cacheKey || FALLBACK.NONE;
    state.indexAuthoritySource = found.path || "NONE";
    state.indexAuthorityPresent = boolText(Boolean(found.authority));
    state.indexContract = contract;
    state.indexCurrentSpreadRecognized = boolText(
      contract === CURRENT_INDEX_JS_CONTRACT ||
      contract === "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2" ||
      contract === "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1"
    );

    state.indexExpressionChainLoadClaim = readAuthorityBoolean(found, [
      "visibleExpressionChainLoaded",
      "expressionChainLoaded",
      "canvasChainLoaded",
      "hexAuthorityLoaded",
      "hexSurfaceLoaded",
      "canvasLoaded"
    ]);

    if (state.indexCurrentSpreadRecognized === "true") {
      addNote(state, "PROBE_EAST_INDEX_CURRENT_OR_ACCEPTED_SPREAD_RECOGNIZED");
    } else {
      addNote(state, "PROBE_EAST_INDEX_CURRENT_SPREAD_NOT_CONFIRMED");
    }
  }

  function deriveControlStatus(state, scripts, authorities) {
    const script = scripts.controls || {};
    const found = authorities.controls || {};
    const receipt = found.receipt || {};
    const motionReady = Boolean(
      found.authority &&
      (
        isFunction(found.authority.attach) ||
        isFunction(found.authority.mount) ||
        isFunction(found.authority.start) ||
        isFunction(found.authority.boot) ||
        isFunction(found.authority.enableMotionTouch) ||
        isFunction(found.authority.bindMotionTouch) ||
        isFunction(found.authority.bindDrag)
      )
    ) || Boolean(
      receipt.motionTouchReady === true ||
      receipt.dragReady === true ||
      receipt.viewControlReady === true ||
      receipt.controlsReady === true ||
      receipt.controlHandshakeReady === true
    );

    const present = Boolean(script.present || found.authority || found.contract || Object.keys(receipt).length);

    state.controlScriptPresent = boolText(script.present);
    state.controlScriptSrc = script.src || FALLBACK.NOT_FOUND;
    state.controlAuthoritySource = found.path || "NONE";
    state.controlAuthorityPresent = boolText(Boolean(found.authority));
    state.controlReceiptPresent = boolText(Boolean(Object.keys(receipt).length));
    state.controlContract = found.contract || clean(receiptValue(receipt, ["contract", "CONTRACT", "controlsContract"]), 500) || FALLBACK.UNKNOWN;
    state.controlFileStatus = present
      ? motionReady
        ? "CONTROL_FILE_LOADED_AND_MOTION_TOUCH_READY"
        : "CONTROL_FILE_PRESENT_HANDSHAKE_PENDING"
      : FALLBACK.EXPECTED_NOT_YET_BUILT;
    state.controlHandshakeStatus = present
      ? motionReady
        ? "HANDSHAKE_VALID"
        : "HANDSHAKE_PENDING"
      : FALLBACK.EXPECTED_NOT_YET_WIRED;
    state.motionTouchStatus = motionReady ? "ACTIVE" : FALLBACK.EXPECTED_NOT_YET_WIRED;
    state.dragStatus = motionReady ? "ACTIVE" : FALLBACK.EXPECTED_NOT_YET_WIRED;
    state.viewControlStatus = motionReady ? "ACTIVE" : FALLBACK.EXPECTED_NOT_YET_WIRED;

    if (motionReady) addNote(state, "PROBE_EAST_CONTROL_FILE_PRESENT_AND_MOTION_TOUCH_READY");
    else if (present) addNote(state, "PROBE_EAST_CONTROL_FILE_PRESENT_HANDSHAKE_PENDING");
    else addNote(state, "PROBE_EAST_CONTROL_FILE_NOT_YET_CONFIRMED");
  }

  function deriveCanvasStatus(state, scripts, authorities) {
    const script = scripts.canvas || {};
    const found = authorities.canvas || {};
    const receipt = found.receipt || {};
    const contract = clean(firstDefined(
      found.contract,
      receiptValue(receipt, [
        "currentCanvasParentContract",
        "canvasContract",
        "currentCanvasContract",
        "contract",
        "CONTRACT"
      ]),
      script.datasetContract,
      state.targetDatasetCanvasContract,
      state.expectedCanvasContract
    ), 500) || FALLBACK.UNKNOWN;

    const present = Boolean(script.present || found.authority || found.contract || Object.keys(receipt).length);

    state.canvasScriptPresent = boolText(script.present);
    state.canvasScriptSrc = script.src || FALLBACK.NOT_FOUND;
    state.canvasAuthoritySource = found.path || "NONE";
    state.canvasAuthorityPresent = boolText(Boolean(found.authority));
    state.canvasReceiptPresent = boolText(Boolean(Object.keys(receipt).length));
    state.canvasContract = contract;
    state.canvasParentRecognized = boolText(
      present &&
      (
        contract === EXPECTED_CANVAS_CONTRACT ||
        contract.includes("HEARTH_CANVAS_") ||
        state.canvasAuthorityPresent === "true"
      )
    );

    state.canvasExpressionHubClaim = readAuthorityBoolean(found, [
      "expressionHubActive",
      "canvasExpressionHubActive",
      "canvasExpressionHubReady"
    ]);

    state.canvasFingerManagerClaim = readAuthorityBoolean(found, [
      "fingerManagerActive",
      "canvasFingerManagerActive",
      "fingerRegistryActive",
      "canvasFingerRegistryActive"
    ]);

    state.visibleBaseGlobeCarrierClaim = readAuthorityBoolean(found, [
      "visibleBaseGlobeCarrierActive",
      "canvasVisibleBaseGlobeCarrierActive",
      "baseGlobeVisibleCarrierReady",
      "visiblePlanetProofReady"
    ]);

    state.canvasDrawClaim = readAuthorityBoolean(found, [
      "canvasMounted",
      "canvasDrawComplete",
      "baseGlobeDrawComplete",
      "drawComplete"
    ]);

    state.canvasSourceCompositionStatus =
      state.canvasParentRecognized === "true"
        ? "CANVAS_PARENT_OR_AUTHORITY_SOURCE_CONFIRMED"
        : script.present
          ? "CANVAS_SCRIPT_PRESENT_AUTHORITY_NOT_CONFIRMED"
          : "CANVAS_PARENT_SOURCE_NOT_CONFIRMED";

    if (state.canvasParentRecognized === "true") addNote(state, "PROBE_EAST_CANVAS_PARENT_SOURCE_CONFIRMED");
    else if (script.present) addNote(state, "PROBE_EAST_CANVAS_SCRIPT_PRESENT_PARENT_AUTHORITY_NOT_CONFIRMED");
    else addNote(state, "PROBE_EAST_CANVAS_PARENT_SOURCE_NOT_CONFIRMED");
  }

  function deriveHexChainStatus(state, scripts, authorities) {
    const hexAuthorityPresent = Boolean(scripts.hexAuthority.present || authorities.hexAuthority.authority);
    const hexSurfacePresent = Boolean(scripts.hexSurface.present || authorities.hexSurface.authority);
    const canvasPresent = Boolean(scripts.canvas.present || authorities.canvas.authority);

    state.hexAuthorityScriptPresent = boolText(scripts.hexAuthority.present);
    state.hexSurfaceScriptPresent = boolText(scripts.hexSurface.present);
    state.hexAuthorityGlobalPresent = boolText(Boolean(authorities.hexAuthority.authority));
    state.hexSurfaceGlobalPresent = boolText(Boolean(authorities.hexSurface.authority));

    state.indexVisibleExpressionChainStatus =
      hexAuthorityPresent && hexSurfacePresent && canvasPresent
        ? "VISIBLE_EXPRESSION_CHAIN_PRESENT"
        : hexAuthorityPresent || hexSurfacePresent || canvasPresent
          ? "VISIBLE_EXPRESSION_CHAIN_PARTIAL"
          : "VISIBLE_EXPRESSION_CHAIN_NOT_CONFIRMED";

    if (state.indexVisibleExpressionChainStatus === "VISIBLE_EXPRESSION_CHAIN_PRESENT") {
      addNote(state, "PROBE_EAST_VISIBLE_EXPRESSION_CHAIN_PRESENT_HEX_AUTHORITY_HEX_SURFACE_CANVAS");
    } else if (state.indexVisibleExpressionChainStatus === "VISIBLE_EXPRESSION_CHAIN_PARTIAL") {
      addNote(state, "PROBE_EAST_VISIBLE_EXPRESSION_CHAIN_PARTIAL");
    } else {
      addNote(state, "PROBE_EAST_VISIBLE_EXPRESSION_CHAIN_NOT_CONFIRMED");
    }
  }

  function deriveRailProbeStatus(state, scripts, authorities) {
    const railEast = authorities.railEast || {};
    const probeNorth = authorities.probeNorth || {};

    state.railEastScriptPresent = boolText(Boolean(scripts.railEast && scripts.railEast.present));
    state.railEastAuthoritySource = railEast.path || "NONE";
    state.railEastAuthorityPresent = boolText(Boolean(railEast.authority));
    state.railEastContract = railEast.contract || FALLBACK.UNKNOWN;
    state.railEastStatus = readReceiptStatus(railEast);

    state.probeNorthScriptPresent = boolText(Boolean(scripts.probeNorth && scripts.probeNorth.present));
    state.probeNorthAuthoritySource = probeNorth.path || "NONE";
    state.probeNorthAuthorityPresent = boolText(Boolean(probeNorth.authority));
    state.probeNorthContract = probeNorth.contract || FALLBACK.UNKNOWN;
    state.probeNorthStatus = readReceiptStatus(probeNorth);

    state.probeEastSelfObserved = "true";
    state.probeEastAuthoritySource = "HEARTH.diagnosticProbeEast";
    state.probeEastContract = CONTRACT;

    state.probeSouthScriptPresent = boolText(Boolean(scripts.probeSouth && scripts.probeSouth.present));
    state.probeSouthAuthoritySource = authorities.probeSouth ? authorities.probeSouth.path : "NONE";
    state.probeSouthAuthorityPresent = boolText(Boolean(authorities.probeSouth && authorities.probeSouth.authority));
    state.probeSouthContract = authorities.probeSouth && authorities.probeSouth.contract ? authorities.probeSouth.contract : FALLBACK.UNKNOWN;

    state.probeWestScriptPresent = boolText(Boolean(scripts.probeWest && scripts.probeWest.present));
    state.probeWestAuthoritySource = authorities.probeWest ? authorities.probeWest.path : "NONE";
    state.probeWestAuthorityPresent = boolText(Boolean(authorities.probeWest && authorities.probeWest.authority));
    state.probeWestContract = authorities.probeWest && authorities.probeWest.contract ? authorities.probeWest.contract : FALLBACK.UNKNOWN;

    if (state.railEastAuthorityPresent === "true" || state.railEastScriptPresent === "true") {
      addNote(state, "PROBE_EAST_RAIL_EAST_OBSERVED_NOT_RENEWED");
    }

    if (state.probeNorthAuthorityPresent === "true" || state.probeNorthScriptPresent === "true") {
      addNote(state, "PROBE_EAST_PROBE_NORTH_OBSERVED_AS_PARENT_COMPOSITION_COORDINATOR");
    }
  }

  function deriveLabBishopFingerStatus(state, scripts, authorities) {
    const labKeys = ["labNorth", "labEast", "labSouth", "labWest"];
    const bishopKeys = ["bishopNorth", "bishopEast", "bishopSouth", "bishopWest"];
    const channelKeys = ["landChannel", "waterChannel", "airChannel"];

    let labObserved = 0;
    let bishopObserved = 0;
    let channelObserved = 0;
    let fingerObserved = 0;

    labKeys.forEach((key) => {
      if ((scripts[key] && scripts[key].present) || (authorities[key] && authorities[key].authority)) labObserved += 1;
    });

    bishopKeys.forEach((key) => {
      if ((scripts[key] && scripts[key].present) || (authorities[key] && authorities[key].authority)) bishopObserved += 1;
    });

    channelKeys.forEach((key) => {
      if ((scripts[key] && scripts[key].present) || (authorities[key] && authorities[key].authority)) channelObserved += 1;
    });

    Object.keys(FINGER_PATHS).forEach((finger) => {
      const key = `finger${finger.charAt(0).toUpperCase()}${finger.slice(1)}`;
      const fileKey = `finger${finger.charAt(0).toUpperCase()}${finger.slice(1)}`;
      if ((scripts[fileKey] && scripts[fileKey].present) || (authorities[key] && authorities[key].authority)) {
        fingerObserved += 1;
      }
    });

    state.labFileObservedCount = String(labObserved);
    state.labBridgeCompositionStatus = labObserved > 0
      ? labObserved >= 4
        ? "LAB_FOUR_WAY_COMPOSITION_OBSERVED"
        : "LAB_PARTIAL_COMPOSITION_OBSERVED"
      : "LAB_COMPOSITION_NOT_CONFIRMED";

    state.bishopFileObservedCount = String(bishopObserved);
    state.bishopBridgeCompositionStatus = bishopObserved > 0
      ? bishopObserved >= 4
        ? "BISHOP_FOUR_WAY_COMPOSITION_OBSERVED"
        : "BISHOP_PARTIAL_COMPOSITION_OBSERVED"
      : "BISHOP_COMPOSITION_NOT_CONFIRMED";

    state.channelObservedCount = String(channelObserved);
    state.channelCompositionStatus = channelObserved > 0
      ? channelObserved >= 2
        ? "LAND_WATER_AIR_CHANNEL_COMPOSITION_PARTIAL_OR_COMPLETE"
        : "CHANNEL_COMPOSITION_PARTIAL"
      : "CHANNEL_COMPOSITION_NOT_CONFIRMED";

    state.fingerObservedCount = String(fingerObserved);
    state.fingerCompositionStatus = fingerObserved > 0
      ? fingerObserved >= 7
        ? "MODERN_FINGER_COMPOSITION_COMPLETE"
        : "MODERN_FINGER_COMPOSITION_PARTIAL"
      : "MODERN_FINGER_COMPOSITION_NOT_CONFIRMED";

    if (labObserved > 0) addNote(state, `PROBE_EAST_LAB_FILE_COMPOSITION_OBSERVED_COUNT:${labObserved}`);
    if (bishopObserved > 0) addNote(state, `PROBE_EAST_BISHOP_FILE_COMPOSITION_OBSERVED_COUNT:${bishopObserved}`);
    if (channelObserved > 0) addNote(state, `PROBE_EAST_CHANNEL_COMPOSITION_OBSERVED_COUNT:${channelObserved}`);
    if (fingerObserved > 0) addNote(state, `PROBE_EAST_FINGER_COMPOSITION_OBSERVED_COUNT:${fingerObserved}`);

    if (fingerObserved === 0) addNote(state, "PROBE_EAST_FINGER_COMPOSITION_NOT_CONFIRMED");
  }

  function readTargetDatasets(targetDocument, state) {
    const htmlData = readDataset(targetDocument);
    const bodyData = readBodyDataset(targetDocument);

    state.targetHtmlContract = contractFromDataset(targetDocument);
    state.targetRouteSignal = documentRoute(targetDocument) || FALLBACK.UNKNOWN;
    state.targetPageSignal = clean(firstDefined(htmlData.page, bodyData.page), 500) || FALLBACK.UNKNOWN;
    state.targetPageContextSignal = clean(firstDefined(htmlData.pageContext, bodyData.pageContext), 1200) || FALLBACK.UNKNOWN;

    state.targetDatasetIndexJsContract = clean(firstDefined(
      htmlData.hearthIndexJsContract,
      htmlData.expectedIndexJsContract,
      bodyData.hearthIndexJsContract
    ), 500) || FALLBACK.UNKNOWN;

    state.targetDatasetRouteConductorContract = clean(firstDefined(
      htmlData.hearthRouteConductorContract,
      htmlData.expectedRouteConductorContract,
      htmlData.routeConductorCurrentContract,
      bodyData.hearthRouteConductorContract
    ), 500) || FALLBACK.UNKNOWN;

    state.targetDatasetRouteConductorCurrent = clean(firstDefined(
      htmlData.routeConductorCurrent,
      htmlData.hearthRouteConductorCurrent,
      bodyData.routeConductorCurrent
    ), 500) || FALLBACK.UNKNOWN;

    state.targetDatasetCanvasContract = clean(firstDefined(
      htmlData.hearthCanvasContract,
      htmlData.currentCanvasParentContract,
      bodyData.hearthCanvasContract
    ), 500) || FALLBACK.UNKNOWN;

    state.targetDatasetControlContract = clean(firstDefined(
      htmlData.hearthControlsContract,
      htmlData.hearthControlContract,
      bodyData.hearthControlsContract
    ), 500) || FALLBACK.UNKNOWN;

    if (state.targetHtmlContract === CURRENT_HTML_CONTRACT) {
      addNote(state, "PROBE_EAST_HTML_CURRENT_CONTRACT_RECOGNIZED");
    } else {
      addNote(`PROBE_EAST_HTML_CONTRACT_NOT_CURRENT:${state.targetHtmlContract}`);
    }
  }

  function deriveCompositionVerdict(state) {
    const currentSpreadOk =
      state.indexCurrentSpreadRecognized === "true" &&
      state.routeConductorCurrentSpreadRecognized === "true" &&
      state.targetHtmlContract === CURRENT_HTML_CONTRACT;

    const sourceCoreOk =
      state.indexScriptPresent === "true" &&
      state.routeConductorScriptPresent === "true";

    const controlOk =
      state.controlFileStatus === "CONTROL_FILE_LOADED_AND_MOTION_TOUCH_READY" ||
      state.controlFileStatus === "CONTROL_FILE_PRESENT_HANDSHAKE_PENDING";

    const canvasConfirmed =
      state.canvasParentRecognized === "true" ||
      state.canvasScriptPresent === "true";

    const stageMountOk =
      state.stageMountBridgeStatus === "STAGE_AND_MOUNT_BRIDGE_PRESENT";

    const expressionConfirmed =
      state.expressionSurfaceBridgeStatus === "EXPRESSION_SURFACE_BRIDGE_PRESENT" ||
      state.expressionSurfaceBridgeStatus === "CANVAS_ELEMENT_BRIDGE_PRESENT";

    state.sourceSideCurrentSpreadStatus = currentSpreadOk
      ? "SOURCE_SIDE_CURRENT_SPREAD_CONFIRMED"
      : sourceCoreOk
        ? "SOURCE_SIDE_CORE_PRESENT_CURRENT_SPREAD_PARTIAL"
        : "SOURCE_SIDE_CORE_NOT_CONFIRMED";

    state.fileCompositionStatus = sourceCoreOk
      ? canvasConfirmed
        ? "SOURCE_COMPOSITION_REACHES_CANVAS_FILE_OR_AUTHORITY"
        : "SOURCE_COMPOSITION_STOPS_BEFORE_CONFIRMED_CANVAS_PARENT"
      : "SOURCE_COMPOSITION_INCOMPLETE_INDEX_OR_ROUTE_CONDUCTOR_MISSING";

    state.bridgeSurfaceCompositionStatus = stageMountOk
      ? expressionConfirmed
        ? "STAGE_MOUNT_AND_EXPRESSION_SURFACE_CONFIRMED"
        : "STAGE_AND_MOUNT_CONFIRMED_EXPRESSION_SURFACE_NOT_PROVEN"
      : "STAGE_MOUNT_BRIDGE_NOT_CONFIRMED";

    state.canvasExpressionInstrumentationStatus =
      stageMountOk && !expressionConfirmed
        ? "STAGE_AND_MOUNT_CAN_BE_RECOGNIZED_BUT_EXPRESSION_SURFACE_COMPOSITION_PENDING"
        : stageMountOk && expressionConfirmed
          ? "STAGE_MOUNT_AND_EXPRESSION_SURFACE_CAN_BE_RECOGNIZED"
          : "CANVAS_EXPRESSION_INSTRUMENTATION_INCOMPLETE";

    state.zoneOfInflictionOwner =
      canvasConfirmed
        ? expressionConfirmed
          ? "UNRESOLVED_AFTER_PROBE_EAST_SOURCE_AND_SURFACE_PRESENT"
          : "CANVAS_EXPRESSION_SURFACE_OR_FINGER_COMPOSITION"
        : sourceCoreOk
          ? "CANVAS_PARENT_SOURCE_COMPOSITION"
          : "INDEX_ROUTE_CONDUCTOR_SOURCE_COMPOSITION";

    state.zoneOfInflictionFile =
      canvasConfirmed
        ? expressionConfirmed
          ? FILE
          : FILES.canvas
        : sourceCoreOk
          ? FILES.canvas
          : FILES.index;

    state.zoneOfInflictionClass =
      canvasConfirmed
        ? expressionConfirmed
          ? "PROBE_EAST_NO_FINAL_REPAIR_SELECTION"
          : "EXPRESSION_SURFACE_NOT_PROVEN"
        : sourceCoreOk
          ? "CANVAS_PARENT_NOT_CONFIRMED"
          : "SOURCE_COMPOSITION_INCOMPLETE";

    state.zoneOfInflictionReason =
      canvasConfirmed
        ? expressionConfirmed
          ? "PROBE_EAST_CONFIRMED_SOURCE_REACH_AND_SURFACE_BRIDGE_BUT_NORTH_RETAINS_FINAL_DISPOSITION"
          : "SOURCE_REACHES_CANVAS_BUT_EXPRESSION_SURFACE_OR_FINGER_COMPOSITION_IS_NOT_PROVEN"
        : sourceCoreOk
          ? "INDEX_AND_ROUTE_CONDUCTOR_PRESENT_BUT_CANVAS_PARENT_AUTHORITY_OR_SCRIPT_IS_NOT_CONFIRMED"
          : "INDEX_OR_ROUTE_CONDUCTOR_SOURCE_COMPOSITION_IS_NOT_CONFIRMED";

    state.probeEastDisposition =
      currentSpreadOk && sourceCoreOk && controlOk && stageMountOk && !expressionConfirmed
        ? "SOURCE_SIDE_OK_CONTROL_OK_STAGE_MOUNT_OK_CANVAS_EXPRESSION_SURFACE_PENDING"
        : currentSpreadOk && sourceCoreOk && controlOk && stageMountOk && expressionConfirmed
          ? "SOURCE_SIDE_OK_CONTROL_OK_STAGE_MOUNT_AND_EXPRESSION_SURFACE_PRESENT"
          : sourceCoreOk
            ? "SOURCE_SIDE_PARTIAL_NEXT_CANVAS_EXPRESSION_COMPOSITION_REQUIRES_WEST_OR_CANVAS_PROBE"
            : "SOURCE_SIDE_INCOMPLETE";

    if (state.probeEastDisposition === "SOURCE_SIDE_OK_CONTROL_OK_STAGE_MOUNT_OK_CANVAS_EXPRESSION_SURFACE_PENDING") {
      addNote(state, "PROBE_EAST_DEFINITIVE_DISPOSITION_SOURCE_AND_CONTROL_OK_EXPRESSION_SURFACE_PENDING");
    } else {
      addNote(`PROBE_EAST_DISPOSITION:${state.probeEastDisposition}`);
    }
  }

  function makeState() {
    return {
      probeEastStatus: STATUS.READY,
      probeEastContract: CONTRACT,
      probeEastReceipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      parentNorthContract: PARENT_NORTH_CONTRACT,
      parentNorthReceipt: PARENT_NORTH_RECEIPT,
      railEastContract: RAIL_EAST_CONTRACT,
      railEastImplementationContract: RAIL_EAST_IMPLEMENTATION_CONTRACT,

      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,
      productionMutationAuthorized: false,
      cacheRepairAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      renderedTargetAuthority: false,
      packetFormattingAuthority: false,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,

      probeEastRunComplete: "false",
      probeEastRunStatus: FALLBACK.UNKNOWN,
      targetAccessStatus: FALLBACK.UNKNOWN,
      targetAccessError: FALLBACK.UNKNOWN,
      targetDocumentSource: FALLBACK.UNKNOWN,
      hearthTargetConfirmed: FALLBACK.UNKNOWN,

      targetHtmlContract: FALLBACK.UNKNOWN,
      targetRouteSignal: FALLBACK.UNKNOWN,
      targetPageSignal: FALLBACK.UNKNOWN,
      targetPageContextSignal: FALLBACK.UNKNOWN,
      targetDatasetIndexJsContract: FALLBACK.UNKNOWN,
      targetDatasetRouteConductorContract: FALLBACK.UNKNOWN,
      targetDatasetRouteConductorCurrent: FALLBACK.UNKNOWN,
      targetDatasetCanvasContract: FALLBACK.UNKNOWN,
      targetDatasetControlContract: FALLBACK.UNKNOWN,

      expectedHtmlContract: CURRENT_HTML_CONTRACT,
      expectedIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      indexScriptPresent: FALLBACK.UNKNOWN,
      indexScriptSrc: FALLBACK.UNKNOWN,
      indexScriptCacheKey: FALLBACK.UNKNOWN,
      indexAuthoritySource: FALLBACK.UNKNOWN,
      indexAuthorityPresent: FALLBACK.UNKNOWN,
      indexContract: FALLBACK.UNKNOWN,
      indexCurrentSpreadRecognized: FALLBACK.UNKNOWN,
      indexExpressionChainLoadClaim: FALLBACK.UNKNOWN,

      routeConductorScriptPresent: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptCacheKey: FALLBACK.UNKNOWN,
      routeConductorAuthoritySource: FALLBACK.UNKNOWN,
      routeConductorAuthorityPresent: FALLBACK.UNKNOWN,
      routeConductorAuthorityContract: FALLBACK.UNKNOWN,
      routeConductorServedContract: FALLBACK.UNKNOWN,
      routeConductorCurrentSpreadRecognized: FALLBACK.UNKNOWN,
      routeConductorRenderedAuthorityOverridesScriptCache: FALLBACK.UNKNOWN,
      cacheKeyStaleNonBlocking: FALLBACK.UNKNOWN,
      servedContractMismatchIsBlocking: FALLBACK.UNKNOWN,
      bishopQueenRecognitionFunnelClaim: FALLBACK.UNKNOWN,
      routeConductorCanvasHandoffClaim: FALLBACK.UNKNOWN,

      controlScriptPresent: FALLBACK.UNKNOWN,
      controlScriptSrc: FALLBACK.UNKNOWN,
      controlAuthoritySource: FALLBACK.UNKNOWN,
      controlAuthorityPresent: FALLBACK.UNKNOWN,
      controlReceiptPresent: FALLBACK.UNKNOWN,
      controlContract: FALLBACK.UNKNOWN,
      controlFileStatus: FALLBACK.UNKNOWN,
      controlHandshakeStatus: FALLBACK.UNKNOWN,
      motionTouchStatus: FALLBACK.UNKNOWN,
      dragStatus: FALLBACK.UNKNOWN,
      viewControlStatus: FALLBACK.UNKNOWN,

      canvasScriptPresent: FALLBACK.UNKNOWN,
      canvasScriptSrc: FALLBACK.UNKNOWN,
      canvasAuthoritySource: FALLBACK.UNKNOWN,
      canvasAuthorityPresent: FALLBACK.UNKNOWN,
      canvasReceiptPresent: FALLBACK.UNKNOWN,
      canvasContract: FALLBACK.UNKNOWN,
      canvasParentRecognized: FALLBACK.UNKNOWN,
      canvasExpressionHubClaim: FALLBACK.UNKNOWN,
      canvasFingerManagerClaim: FALLBACK.UNKNOWN,
      visibleBaseGlobeCarrierClaim: FALLBACK.UNKNOWN,
      canvasDrawClaim: FALLBACK.UNKNOWN,
      canvasSourceCompositionStatus: FALLBACK.UNKNOWN,

      hexAuthorityScriptPresent: FALLBACK.UNKNOWN,
      hexSurfaceScriptPresent: FALLBACK.UNKNOWN,
      hexAuthorityGlobalPresent: FALLBACK.UNKNOWN,
      hexSurfaceGlobalPresent: FALLBACK.UNKNOWN,
      indexVisibleExpressionChainStatus: FALLBACK.UNKNOWN,

      railEastScriptPresent: FALLBACK.UNKNOWN,
      railEastAuthoritySource: FALLBACK.UNKNOWN,
      railEastAuthorityPresent: FALLBACK.UNKNOWN,
      railEastContract: FALLBACK.UNKNOWN,
      railEastStatus: FALLBACK.UNKNOWN,

      probeNorthScriptPresent: FALLBACK.UNKNOWN,
      probeNorthAuthoritySource: FALLBACK.UNKNOWN,
      probeNorthAuthorityPresent: FALLBACK.UNKNOWN,
      probeNorthContract: FALLBACK.UNKNOWN,
      probeNorthStatus: FALLBACK.UNKNOWN,

      probeEastSelfObserved: "true",
      probeEastAuthoritySource: "HEARTH.diagnosticProbeEast",
      probeEastContract: CONTRACT,

      probeSouthScriptPresent: FALLBACK.UNKNOWN,
      probeSouthAuthoritySource: FALLBACK.UNKNOWN,
      probeSouthAuthorityPresent: FALLBACK.UNKNOWN,
      probeSouthContract: FALLBACK.UNKNOWN,

      probeWestScriptPresent: FALLBACK.UNKNOWN,
      probeWestAuthoritySource: FALLBACK.UNKNOWN,
      probeWestAuthorityPresent: FALLBACK.UNKNOWN,
      probeWestContract: FALLBACK.UNKNOWN,

      stagePresent: FALLBACK.UNKNOWN,
      stageSelector: FALLBACK.UNKNOWN,
      stageRect: FALLBACK.UNKNOWN,
      stageRectNonZero: FALLBACK.UNKNOWN,
      mountPresent: FALLBACK.UNKNOWN,
      mountSelector: FALLBACK.UNKNOWN,
      mountRect: FALLBACK.UNKNOWN,
      mountRectNonZero: FALLBACK.UNKNOWN,
      canvasElementPresent: FALLBACK.UNKNOWN,
      canvasElementSelector: FALLBACK.UNKNOWN,
      canvasElementRect: FALLBACK.UNKNOWN,
      canvasElementRectNonZero: FALLBACK.UNKNOWN,
      canvasAttributeWidth: FALLBACK.UNKNOWN,
      canvasAttributeHeight: FALLBACK.UNKNOWN,
      expressionSurfacePresent: FALLBACK.UNKNOWN,
      expressionSurfaceSelector: FALLBACK.UNKNOWN,
      expressionSurfaceRect: FALLBACK.UNKNOWN,
      expressionSurfaceRectNonZero: FALLBACK.UNKNOWN,
      stageMountBridgeStatus: FALLBACK.UNKNOWN,
      expressionSurfaceBridgeStatus: FALLBACK.UNKNOWN,

      labFileObservedCount: "0",
      labBridgeCompositionStatus: FALLBACK.UNKNOWN,
      bishopFileObservedCount: "0",
      bishopBridgeCompositionStatus: FALLBACK.UNKNOWN,
      channelObservedCount: "0",
      channelCompositionStatus: FALLBACK.UNKNOWN,
      fingerObservedCount: "0",
      fingerCompositionStatus: FALLBACK.UNKNOWN,

      sourceSideCurrentSpreadStatus: FALLBACK.UNKNOWN,
      fileCompositionStatus: FALLBACK.UNKNOWN,
      bridgeSurfaceCompositionStatus: FALLBACK.UNKNOWN,
      canvasExpressionInstrumentationStatus: FALLBACK.UNKNOWN,
      zoneOfInflictionOwner: FALLBACK.UNKNOWN,
      zoneOfInflictionFile: FILE,
      zoneOfInflictionClass: FALLBACK.UNKNOWN,
      zoneOfInflictionReason: FALLBACK.UNKNOWN,
      probeEastDisposition: FALLBACK.UNKNOWN,

      scriptFootprint: {},
      authorityFootprint: {},

      probeEastNotes: [],
      updatedAt: nowIso(),

      ...FINAL_FALSE
    };
  }

  function makeEvidencePacket(state) {
    return {
      PROBE_EAST_STATUS: state.probeEastStatus,
      PROBE_EAST_CONTRACT: CONTRACT,
      PROBE_EAST_RECEIPT: RECEIPT,
      PROBE_EAST_VERSION: VERSION,
      PROBE_EAST_FILE: FILE,
      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

      PARENT_NORTH_CONTRACT: state.parentNorthContract,
      PARENT_NORTH_RECEIPT: state.parentNorthReceipt,
      RAIL_EAST_CONTRACT: RAIL_EAST_CONTRACT,
      RAIL_EAST_IMPLEMENTATION_CONTRACT: RAIL_EAST_IMPLEMENTATION_CONTRACT,

      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: false,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

      PROBE_EAST_RUN_COMPLETE: state.probeEastRunComplete,
      PROBE_EAST_RUN_STATUS: state.probeEastRunStatus,
      TARGET_ACCESS_STATUS: state.targetAccessStatus,
      TARGET_ACCESS_ERROR: state.targetAccessError,
      TARGET_DOCUMENT_SOURCE: state.targetDocumentSource,
      HEARTH_TARGET_CONFIRMED: state.hearthTargetConfirmed,

      EXPECTED_HTML_CONTRACT: state.expectedHtmlContract,
      EXPECTED_INDEX_JS_CONTRACT: state.expectedIndexJsContract,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.expectedRouteConductorContract,
      EXPECTED_CONTROL_CONTRACT: state.expectedControlContract,
      EXPECTED_CANVAS_CONTRACT: state.expectedCanvasContract,

      TARGET_HTML_CONTRACT: state.targetHtmlContract,
      TARGET_ROUTE_SIGNAL: state.targetRouteSignal,
      TARGET_PAGE_SIGNAL: state.targetPageSignal,
      TARGET_PAGE_CONTEXT_SIGNAL: state.targetPageContextSignal,
      TARGET_DATASET_INDEX_JS_CONTRACT: state.targetDatasetIndexJsContract,
      TARGET_DATASET_ROUTE_CONDUCTOR_CONTRACT: state.targetDatasetRouteConductorContract,
      TARGET_DATASET_ROUTE_CONDUCTOR_CURRENT: state.targetDatasetRouteConductorCurrent,
      TARGET_DATASET_CANVAS_CONTRACT: state.targetDatasetCanvasContract,
      TARGET_DATASET_CONTROL_CONTRACT: state.targetDatasetControlContract,

      INDEX_SCRIPT_PRESENT: state.indexScriptPresent,
      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      INDEX_SCRIPT_CACHE_KEY: state.indexScriptCacheKey,
      INDEX_AUTHORITY_SOURCE: state.indexAuthoritySource,
      INDEX_AUTHORITY_PRESENT: state.indexAuthorityPresent,
      INDEX_CONTRACT: state.indexContract,
      INDEX_CURRENT_SPREAD_RECOGNIZED: state.indexCurrentSpreadRecognized,
      INDEX_EXPRESSION_CHAIN_LOAD_CLAIM: state.indexExpressionChainLoadClaim,

      ROUTE_CONDUCTOR_SCRIPT_PRESENT: state.routeConductorScriptPresent,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY: state.routeConductorScriptCacheKey,
      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: state.routeConductorAuthoritySource,
      ROUTE_CONDUCTOR_AUTHORITY_PRESENT: state.routeConductorAuthorityPresent,
      ROUTE_CONDUCTOR_AUTHORITY_CONTRACT: state.routeConductorAuthorityContract,
      ROUTE_CONDUCTOR_SERVED_CONTRACT: state.routeConductorServedContract,
      ROUTE_CONDUCTOR_CURRENT_SPREAD_RECOGNIZED: state.routeConductorCurrentSpreadRecognized,
      ROUTE_CONDUCTOR_RENDERED_AUTHORITY_OVERRIDES_SCRIPT_CACHE: state.routeConductorRenderedAuthorityOverridesScriptCache,
      CACHE_KEY_STALE_NON_BLOCKING: state.cacheKeyStaleNonBlocking,
      SERVED_CONTRACT_MISMATCH_IS_BLOCKING: state.servedContractMismatchIsBlocking,
      BISHOP_QUEEN_RECOGNITION_FUNNEL_CLAIM: state.bishopQueenRecognitionFunnelClaim,
      ROUTE_CONDUCTOR_CANVAS_HANDOFF_CLAIM: state.routeConductorCanvasHandoffClaim,

      CONTROL_SCRIPT_PRESENT: state.controlScriptPresent,
      CONTROL_SCRIPT_SRC: state.controlScriptSrc,
      CONTROL_AUTHORITY_SOURCE: state.controlAuthoritySource,
      CONTROL_AUTHORITY_PRESENT: state.controlAuthorityPresent,
      CONTROL_RECEIPT_PRESENT: state.controlReceiptPresent,
      CONTROL_CONTRACT: state.controlContract,
      CONTROL_FILE_STATUS: state.controlFileStatus,
      CONTROL_HANDSHAKE_STATUS: state.controlHandshakeStatus,
      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,

      CANVAS_SCRIPT_PRESENT: state.canvasScriptPresent,
      CANVAS_SCRIPT_SRC: state.canvasScriptSrc,
      CANVAS_AUTHORITY_SOURCE: state.canvasAuthoritySource,
      CANVAS_AUTHORITY_PRESENT: state.canvasAuthorityPresent,
      CANVAS_RECEIPT_PRESENT: state.canvasReceiptPresent,
      CANVAS_CONTRACT: state.canvasContract,
      CANVAS_PARENT_RECOGNIZED: state.canvasParentRecognized,
      CANVAS_EXPRESSION_HUB_CLAIM: state.canvasExpressionHubClaim,
      CANVAS_FINGER_MANAGER_CLAIM: state.canvasFingerManagerClaim,
      VISIBLE_BASE_GLOBE_CARRIER_CLAIM: state.visibleBaseGlobeCarrierClaim,
      CANVAS_DRAW_CLAIM: state.canvasDrawClaim,
      CANVAS_SOURCE_COMPOSITION_STATUS: state.canvasSourceCompositionStatus,

      HEX_AUTHORITY_SCRIPT_PRESENT: state.hexAuthorityScriptPresent,
      HEX_SURFACE_SCRIPT_PRESENT: state.hexSurfaceScriptPresent,
      HEX_AUTHORITY_GLOBAL_PRESENT: state.hexAuthorityGlobalPresent,
      HEX_SURFACE_GLOBAL_PRESENT: state.hexSurfaceGlobalPresent,
      INDEX_VISIBLE_EXPRESSION_CHAIN_STATUS: state.indexVisibleExpressionChainStatus,

      RAIL_EAST_SCRIPT_PRESENT: state.railEastScriptPresent,
      RAIL_EAST_AUTHORITY_SOURCE: state.railEastAuthoritySource,
      RAIL_EAST_AUTHORITY_PRESENT: state.railEastAuthorityPresent,
      RAIL_EAST_OBSERVED_CONTRACT: state.railEastContract,
      RAIL_EAST_STATUS: state.railEastStatus,

      PROBE_NORTH_SCRIPT_PRESENT: state.probeNorthScriptPresent,
      PROBE_NORTH_AUTHORITY_SOURCE: state.probeNorthAuthoritySource,
      PROBE_NORTH_AUTHORITY_PRESENT: state.probeNorthAuthorityPresent,
      PROBE_NORTH_CONTRACT: state.probeNorthContract,
      PROBE_NORTH_STATUS: state.probeNorthStatus,

      PROBE_EAST_SELF_OBSERVED: state.probeEastSelfObserved,
      PROBE_EAST_AUTHORITY_SOURCE: state.probeEastAuthoritySource,
      PROBE_EAST_OBSERVED_CONTRACT: state.probeEastContract,

      PROBE_SOUTH_SCRIPT_PRESENT: state.probeSouthScriptPresent,
      PROBE_SOUTH_AUTHORITY_SOURCE: state.probeSouthAuthoritySource,
      PROBE_SOUTH_AUTHORITY_PRESENT: state.probeSouthAuthorityPresent,
      PROBE_SOUTH_CONTRACT: state.probeSouthContract,

      PROBE_WEST_SCRIPT_PRESENT: state.probeWestScriptPresent,
      PROBE_WEST_AUTHORITY_SOURCE: state.probeWestAuthoritySource,
      PROBE_WEST_AUTHORITY_PRESENT: state.probeWestAuthorityPresent,
      PROBE_WEST_CONTRACT: state.probeWestContract,

      STAGE_PRESENT: state.stagePresent,
      STAGE_SELECTOR: state.stageSelector,
      STAGE_RECT: state.stageRect,
      STAGE_RECT_NONZERO: state.stageRectNonZero,
      MOUNT_PRESENT: state.mountPresent,
      MOUNT_SELECTOR: state.mountSelector,
      MOUNT_RECT: state.mountRect,
      MOUNT_RECT_NONZERO: state.mountRectNonZero,
      CANVAS_ELEMENT_PRESENT: state.canvasElementPresent,
      CANVAS_ELEMENT_SELECTOR: state.canvasElementSelector,
      CANVAS_ELEMENT_RECT: state.canvasElementRect,
      CANVAS_ELEMENT_RECT_NONZERO: state.canvasElementRectNonZero,
      CANVAS_ATTRIBUTE_WIDTH: state.canvasAttributeWidth,
      CANVAS_ATTRIBUTE_HEIGHT: state.canvasAttributeHeight,
      EXPRESSION_SURFACE_PRESENT: state.expressionSurfacePresent,
      EXPRESSION_SURFACE_SELECTOR: state.expressionSurfaceSelector,
      EXPRESSION_SURFACE_RECT: state.expressionSurfaceRect,
      EXPRESSION_SURFACE_RECT_NONZERO: state.expressionSurfaceRectNonZero,
      STAGE_MOUNT_BRIDGE_STATUS: state.stageMountBridgeStatus,
      EXPRESSION_SURFACE_BRIDGE_STATUS: state.expressionSurfaceBridgeStatus,

      LAB_FILE_OBSERVED_COUNT: state.labFileObservedCount,
      LAB_BRIDGE_COMPOSITION_STATUS: state.labBridgeCompositionStatus,
      BISHOP_FILE_OBSERVED_COUNT: state.bishopFileObservedCount,
      BISHOP_BRIDGE_COMPOSITION_STATUS: state.bishopBridgeCompositionStatus,
      CHANNEL_OBSERVED_COUNT: state.channelObservedCount,
      CHANNEL_COMPOSITION_STATUS: state.channelCompositionStatus,
      FINGER_OBSERVED_COUNT: state.fingerObservedCount,
      FINGER_COMPOSITION_STATUS: state.fingerCompositionStatus,

      SOURCE_SIDE_CURRENT_SPREAD_STATUS: state.sourceSideCurrentSpreadStatus,
      FILE_COMPOSITION_STATUS: state.fileCompositionStatus,
      BRIDGE_SURFACE_COMPOSITION_STATUS: state.bridgeSurfaceCompositionStatus,
      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS: state.canvasExpressionInstrumentationStatus,
      ZONE_OF_INFLICTION_OWNER: state.zoneOfInflictionOwner,
      ZONE_OF_INFLICTION_FILE: state.zoneOfInflictionFile,
      ZONE_OF_INFLICTION_CLASS: state.zoneOfInflictionClass,
      ZONE_OF_INFLICTION_REASON: state.zoneOfInflictionReason,
      PROBE_EAST_DISPOSITION: state.probeEastDisposition,

      SCRIPT_FOOTPRINT: clonePlain(state.scriptFootprint),
      AUTHORITY_FOOTPRINT: clonePlain(state.authorityFootprint),

      PROBE_EAST_NOTES: state.probeEastNotes.length ? state.probeEastNotes.join(" | ") : FALLBACK.NONE,

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CACHE_REPAIR_AUTHORIZED: false,
      HEARTH_REPAIR_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      CANVAS_RELEASE_AUTHORIZED: false,
      MACRO_WEST_RELEASE_AUTHORIZED: false,
      RENDERED_TARGET_AUTHORITY: false,
      PACKET_FORMATTING_AUTHORITY: false,
      FINAL_PRIMARY_CASE_AUTHORITY: false,
      FINAL_RECOMMENDATION_AUTHORITY: false,

      F13_CLAIMED: false,
      F21_ELIGIBLE_FOR_NORTH: false,
      F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      READY_TEXT_ALLOWED: false,
      READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false,

      updatedAt: state.updatedAt
    };
  }

  async function runProbeEast(options = {}) {
    const state = makeState();

    state.probeEastStatus = STATUS.RUNNING;
    state.probeEastRunStatus = "RUNNING";
    state.updatedAt = nowIso();

    try {
      const target = resolveTarget(options, state);

      state.targetDocumentSource = target.source || FALLBACK.UNKNOWN;
      state.hearthTargetConfirmed = boolText(Boolean(
        target.targetDocument &&
        hasHearthTargetSignals(target.targetDocument, target.targetWindow)
      ));

      if (!target.targetDocument) {
        state.probeEastStatus = STATUS.PARTIAL;
        state.probeEastRunComplete = "false";
        state.probeEastRunStatus = "PARTIAL_SOURCE_ONLY_NO_TARGET_DOCUMENT";
        state.fileCompositionStatus = "TARGET_DOCUMENT_REQUIRED_FOR_PROBE_EAST_SOURCE_COMPOSITION";
        state.bridgeSurfaceCompositionStatus = "TARGET_DOCUMENT_REQUIRED_FOR_BRIDGE_SURFACE_COMPOSITION";
        state.canvasExpressionInstrumentationStatus = "TARGET_DOCUMENT_NOT_AVAILABLE";
        state.zoneOfInflictionOwner = "TARGET_ACCESS";
        state.zoneOfInflictionFile = FILE;
        state.zoneOfInflictionClass = "NO_HEARTH_TARGET_DOCUMENT";
        state.zoneOfInflictionReason = "PROBE_EAST_COULD_NOT_ACCESS_HEARTH_TARGET_DOCUMENT";
        addNote(state, "PROBE_EAST_PARTIAL_NO_HEARTH_TARGET_DOCUMENT");

        state.updatedAt = nowIso();
        publish(state);

        return {
          ok: true,
          contract: CONTRACT,
          receipt: RECEIPT,
          evidence: clonePlain(lastEvidencePacket),
          state: clonePlain(lastState)
        };
      }

      const targetDocument = target.targetDocument;
      const targetWindow = target.targetWindow || targetDocument.defaultView || null;

      readTargetDatasets(targetDocument, state);

      const scripts = readAllScripts(targetDocument, targetWindow);
      const authorities = readAllAuthorities(targetWindow);

      state.scriptFootprint = compactScriptFootprint(scripts);
      state.authorityFootprint = compactAuthorityFootprint(authorities);

      deriveIndexStatus(state, scripts, authorities);
      deriveRouteConductorStatus(state, scripts, authorities);
      deriveControlStatus(state, scripts, authorities);
      deriveCanvasStatus(state, scripts, authorities);
      deriveHexChainStatus(state, scripts, authorities);
      deriveRailProbeStatus(state, scripts, authorities);
      readBridgeSurfaces(targetDocument, state);
      deriveLabBishopFingerStatus(state, scripts, authorities);
      deriveCompositionVerdict(state);

      state.probeEastRunComplete = "true";
      state.probeEastRunStatus = FALLBACK.COMPLETE;
      state.probeEastStatus = STATUS.COMPLETE;
      state.updatedAt = nowIso();

      addNote(state, "PROBE_EAST_SOURCE_SIDE_FILE_COMPOSITION_READ_COMPLETE");
      addNote(state, "PROBE_EAST_BRIDGE_SURFACE_COMPOSITION_READ_COMPLETE");
      addNote(state, "PROBE_EAST_NO_REPAIR_NO_MUTATION_NO_RELEASE");

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.probeEastStatus = STATUS.FAILED;
      state.probeEastRunComplete = "false";
      state.probeEastRunStatus = FALLBACK.FAILED;
      state.targetAccessError = `PROBE_EAST_TOP_LEVEL_ERROR:${clean(error && error.message ? error.message : error, 1000)}`;
      state.fileCompositionStatus = FALLBACK.FAILED;
      state.bridgeSurfaceCompositionStatus = FALLBACK.FAILED;
      state.canvasExpressionInstrumentationStatus = FALLBACK.FAILED;
      state.zoneOfInflictionOwner = "PROBE_EAST_ERROR";
      state.zoneOfInflictionFile = FILE;
      state.zoneOfInflictionClass = "PROBE_EAST_RUNTIME_ERROR";
      state.zoneOfInflictionReason = state.targetAccessError;
      addNote(state, state.targetAccessError);

      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: state.targetAccessError,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getProbeEastReceipt() {
    const evidence = lastEvidencePacket || makeEvidencePacket(makeState());

    return {
      childRole: "PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      parentNorthContract: PARENT_NORTH_CONTRACT,
      parentNorthReceipt: PARENT_NORTH_RECEIPT,
      railEastContract: RAIL_EAST_CONTRACT,
      railEastImplementationContract: RAIL_EAST_IMPLEMENTATION_CONTRACT,

      expectedContracts: clonePlain(EXPECTED_CONTRACTS),
      files: clonePlain(FILES),
      targetSelectors: clonePlain(TARGET_SELECTORS),

      servesNorth: true,
      underHoodProbeLayer: true,
      sourceSideFileCompositionOwned: true,
      bridgeSurfaceCompositionOwned: true,
      servedSourceEvidenceAuthority: true,
      railEastRenewalAuthority: false,
      renderedTargetAuthority: false,
      packetFormattingAuthority: false,
      diagnosticUiAuthority: false,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      productionMutationAuthorized: false,
      cacheRepairAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      controlImplementationAuthority: false,
      canvasImplementationAuthority: false,
      bishopImplementationAuthority: false,
      queenImplementationAuthority: false,

      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,

      runProbeEastApiAvailable: true,
      getProbeEastReceiptApiAvailable: true,
      getProbeEastStateApiAvailable: true,

      lastProbeEastStatus: evidence.PROBE_EAST_STATUS || STATUS.READY,
      lastProbeEastRunStatus: evidence.PROBE_EAST_RUN_STATUS || FALLBACK.UNKNOWN,
      lastSourceSideCurrentSpreadStatus: evidence.SOURCE_SIDE_CURRENT_SPREAD_STATUS || FALLBACK.UNKNOWN,
      lastFileCompositionStatus: evidence.FILE_COMPOSITION_STATUS || FALLBACK.UNKNOWN,
      lastBridgeSurfaceCompositionStatus: evidence.BRIDGE_SURFACE_COMPOSITION_STATUS || FALLBACK.UNKNOWN,
      lastCanvasExpressionInstrumentationStatus: evidence.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS || FALLBACK.UNKNOWN,
      lastZoneOfInflictionOwner: evidence.ZONE_OF_INFLICTION_OWNER || FALLBACK.UNKNOWN,
      lastZoneOfInflictionFile: evidence.ZONE_OF_INFLICTION_FILE || FILE,
      lastZoneOfInflictionClass: evidence.ZONE_OF_INFLICTION_CLASS || FALLBACK.UNKNOWN,
      lastProbeEastDisposition: evidence.PROBE_EAST_DISPOSITION || FALLBACK.UNKNOWN,

      ...FINAL_FALSE,

      updatedAt: nowIso()
    };
  }

  function getProbeEastState() {
    return clonePlain(lastState || makeState());
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastEvidencePacket = makeEvidencePacket(state);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticProbeEast = api;
    root.HEARTH.diagnosticEastProbe = api;
    root.HEARTH.diagnosticProbeEastServedSourceFileComposition = api;
    root.HEARTH.diagnosticProbeEastReceipt = getProbeEastReceipt();
    root.HEARTH.diagnosticProbeEastEvidence = clonePlain(lastEvidencePacket);

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthDiagnosticProbeEast = api;
    root.DEXTER_LAB.hearthDiagnosticEastProbe = api;
    root.DEXTER_LAB.hearthDiagnosticProbeEastServedSourceFileComposition = api;

    root.HEARTH_DIAGNOSTIC_PROBE_EAST = api;
    root.HEARTH_DIAGNOSTIC_EAST_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION = api;
    root.HEARTH_DIAGNOSTIC_PROBE_EAST_RECEIPT = getProbeEastReceipt();
    root.HEARTH_DIAGNOSTIC_PROBE_EAST_EVIDENCE = clonePlain(lastEvidencePacket);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    parentNorthContract: PARENT_NORTH_CONTRACT,
    parentNorthReceipt: PARENT_NORTH_RECEIPT,
    railEastContract: RAIL_EAST_CONTRACT,
    railEastImplementationContract: RAIL_EAST_IMPLEMENTATION_CONTRACT,

    expectedContracts: clonePlain(EXPECTED_CONTRACTS),
    files: clonePlain(FILES),
    targetSelectors: clonePlain(TARGET_SELECTORS),
    globalPaths: clonePlain(GLOBAL_PATHS),
    fingerPaths: clonePlain(FINGER_PATHS),

    runProbeEast,
    getProbeEastReceipt,
    getProbeEastState,

    supportsSourceSideFileComposition: true,
    supportsBridgeSurfaceComposition: true,
    supportsTargetWindowScopedRead: true,
    supportsDiagnosticReceiverRejection: true,
    supportsCurrentSpreadRecognition: true,
    supportsScriptFootprintRead: true,
    supportsAuthorityFootprintRead: true,
    supportsRouteConductorAuthorityOverridesStaleScriptCache: true,
    supportsControlLifecycleRead: true,
    supportsCanvasParentCompositionRead: true,
    supportsExpressionSurfaceBridgeRead: true,
    supportsVisibleExpressionChainRead: true,
    supportsRailEastNonRenewalBoundary: true,
    supportsNorthOnlyReceiverBoundary: true,
    supportsNoHtmlRenewalRequired: true,

    ownsSourceSideFileComposition: true,
    ownsBridgeSurfaceComposition: true,
    ownsServedSourceEvidence: true,
    ownsRailEastRenewal: false,
    ownsRenderedTargetEvidence: false,
    ownsPacketFormatting: false,
    ownsDiagnosticUi: false,
    ownsFinalPrimaryCase: false,
    ownsRecommendation: false,
    ownsRepair: false,
    ownsCacheRepair: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsMacroWestRelease: false,
    ownsControlImplementation: false,
    ownsCanvasImplementation: false,
    ownsBishopImplementation: false,
    ownsQueenImplementation: false,

    diagnosticRouteHtmlRenewalRequired: false,
    receiverStillCallsNorthOnly: true,
    productionMutationAuthorized: false,
    cacheRepairAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,

    ...FINAL_FALSE
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
