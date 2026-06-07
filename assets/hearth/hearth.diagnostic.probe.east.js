// /assets/hearth/hearth.diagnostic.probe.east.js
// HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1
// Internal controlled renewal:
// HEARTH_DIAGNOSTIC_PROBE_EAST_ANCHOR_SAFE_CHRONOLOGY_OBSERVATION_TNT_v1_1
// Full-file replacement.
// Diagnostic probe EAST child only.
// Purpose:
// - Preserve the public v1 Probe EAST contract expected by North chronology.
// - Fix the chronology failure class where the script is already present but the Probe EAST
//   authority is not observed at HEARTH.diagnosticProbeEast.
// - Publish the Probe EAST authority immediately and synchronously before any target probing.
// - Preserve runProbeEast as the public call method expected by North.
// - Read source-side file composition, script footprints, global authority footprints,
//   target-stage/mount/canvas/expression-surface selectors, and source-to-canvas handoff claims.
// - Distinguish diagnostic-anchor failure from production/canvas failure.
// - Preserve Rail EAST as the source-footprint evidence standard.
// - Preserve Probe EAST as the under-hood file-composition / bridge-surface instrument.
// - Do not renew Rail EAST.
// - Do not mutate production, route, cache, controls, canvas, diagnostics chronology, or receiver HTML.
// - Do not claim F13, F21, ready text, final readiness, visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_RECEIPT_v1";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_ANCHOR_SAFE_CHRONOLOGY_OBSERVATION_TNT_v1_1";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_ANCHOR_SAFE_CHRONOLOGY_OBSERVATION_RECEIPT_v1_1";

  const VERSION =
    "2026-06-07.hearth-diagnostic-probe-east-anchor-safe-chronology-observation-v1-1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const PARENT_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const PARENT_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";

  const PREVIOUS_PARENT_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";

  const RAIL_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const RAIL_EAST_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const FILES = Object.freeze({
    railNorth: "/assets/hearth/hearth.diagnostic.rail.js",
    railEast: "/assets/hearth/hearth.diagnostic.east.js",
    railWest: "/assets/hearth/hearth.diagnostic.west.js",
    railSouth: "/assets/hearth/hearth.diagnostic.south.js",

    probeNorth: "/assets/hearth/hearth.diagnostic.probe.north.js",
    probeEast: FILE,
    probeWest: "/assets/hearth/hearth.diagnostic.probe.west.js",
    probeCanvasSurfaceTruth:
      "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js",
    probeSouth: "/assets/hearth/hearth.diagnostic.probe.south.js",

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

    landChannel: "/assets/hearth/hearth.land.channel.js",
    waterChannel: "/assets/hearth/hearth.water.channel.js",
    airChannel: "/assets/hearth/hearth.air.channel.js",

    fingerBoundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    fingerMass: "/assets/hearth/hearth.canvas.finger.mass.js",
    fingerSurface: "/assets/hearth/hearth.canvas.finger.surface.js",
    fingerPointer: "/assets/hearth/hearth.canvas.finger.pointer.js",
    fingerLight: "/assets/hearth/hearth.canvas.finger.light.js",
    fingerInspect: "/assets/hearth/hearth.canvas.finger.inspect.js",
    fingerComposite: "/assets/hearth/hearth.canvas.finger.composite.js"
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
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-expression-surface='true']",
      "canvas[data-hearth-canvas='true']",
      "canvas[data-hearth-canvas-texture='true']",
      "canvas[data-hearth-planet-canvas='true']",
      "canvas[data-hearth-canvas-hub='true']",
      "#hearthCanvasMount canvas",
      "[data-hearth-canvas-mount] canvas",
      "[data-hearth-expression-mount] canvas",
      "canvas"
    ],
    expressionSurface: [
      "canvas[data-hearth-visible-canvas='true']",
      "canvas[data-hearth-expression-surface='true']",
      "[data-hearth-expression-surface='true']",
      "[data-hearth-canvas-surface]",
      "[data-hearth-visible-planet='true']",
      "[data-hearth-visible-globe='true']",
      "[data-hearth-visible-globe-carrier]",
      "[data-hearth-base-globe-carrier]",
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
    railEast: [
      "HEARTH.diagnosticRailEast",
      "HEARTH.diagnosticEast",
      "HEARTH_DIAGNOSTIC_RAIL_EAST",
      "HEARTH_DIAGNOSTIC_EAST",
      "DEXTER_LAB.hearthDiagnosticRailEast",
      "DEXTER_LAB.hearthDiagnosticEast"
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
      "HEARTH_DIAGNOSTIC_EAST_PROBE",
      "DEXTER_LAB.hearthDiagnosticProbeEast"
    ],
    probeWest: [
      "HEARTH.diagnosticProbeWest",
      "HEARTH.diagnosticWestProbe",
      "HEARTH_DIAGNOSTIC_PROBE_WEST",
      "DEXTER_LAB.hearthDiagnosticProbeWest"
    ],
    probeCanvasSurfaceTruth: [
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.diagnosticCanvasSurfaceTruthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth"
    ],
    probeSouth: [
      "HEARTH.diagnosticProbeSouth",
      "HEARTH.diagnosticSouthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      "DEXTER_LAB.hearthDiagnosticProbeSouth"
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
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductorGovernedSourceStackAdmissionCanvasHandoff",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
    ],
    controls: [
      "HEARTH.controls",
      "HEARTH.planetaryControls",
      "HEARTH.motionTouchControls",
      "HEARTH.viewControls",
      "HEARTH_CONTROLS",
      "HEARTH_PLANETARY_CONTROLS",
      "HEARTH_MOTION_TOUCH_CONTROLS",
      "DEXTER_LAB.hearthControls"
    ],
    canvas: [
      "HEARTH.canvas",
      "HEARTH.canvasHub",
      "HEARTH.canvasParent",
      "HEARTH.canvasAuthority",
      "HEARTH.canvasVisiblePlanet",
      "HEARTH.canvasHubGovernedSourcePacketVisible2dReceiver",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_AUTHORITY",
      "HEARTH_CANVAS_HUB_GOVERNED_SOURCE_PACKET_VISIBLE_2D_RECEIVER",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvasParent"
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
      "HEARTH.hexSurfaceRenderer",
      "HEARTH_HEX_SURFACE",
      "DEXTER_LAB.hearthHexSurface"
    ],
    labNorth: [
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "HEARTH.northCommandRuntimeTable",
      "DEXTER_LAB.runtimeTable"
    ],
    labEast: [
      "LAB_RUNTIME_TABLE_EAST",
      "HEARTH_EAST_FIBONACCI_MAGNIFIER",
      "DEXTER_LAB.runtimeTableEast"
    ],
    labSouth: [
      "LAB_RUNTIME_TABLE_SOUTH",
      "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_GATE",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "DEXTER_LAB.runtimeTableSouth"
    ],
    labWest: [
      "LAB_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "HEARTH.runtimeTableWest",
      "DEXTER_LAB.runtimeTableWest"
    ],
    macroWest: [
      "HEARTH_WEST_INDEX_HANDOFF_TABLE",
      "HEARTH.westIndexHandoffTable",
      "HEARTH.macroWestBridge",
      "DEXTER_LAB.hearthWestIndexHandoffTable"
    ],
    landChannel: [
      "HEARTH.landChannel",
      "HEARTH_LAND_CHANNEL",
      "DEXTER_LAB.hearthLandChannel"
    ],
    waterChannel: [
      "HEARTH.waterChannel",
      "HEARTH_WATER_CHANNEL",
      "DEXTER_LAB.hearthWaterChannel"
    ],
    airChannel: [
      "HEARTH.airChannel",
      "HEARTH_AIR_CHANNEL",
      "HEARTH.atmosphere",
      "DEXTER_LAB.hearthAirChannel"
    ]
  });

  const FINGER_PATHS = Object.freeze({
    boundary: [
      "HEARTH.canvasFingerBoundary",
      "HEARTH_CANVAS_FINGER_BOUNDARY",
      "DEXTER_LAB.hearthCanvasFingerBoundary"
    ],
    mass: [
      "HEARTH.canvasFingerMass",
      "HEARTH_CANVAS_FINGER_MASS",
      "DEXTER_LAB.hearthCanvasFingerMass"
    ],
    surface: [
      "HEARTH.canvasFingerSurface",
      "HEARTH_CANVAS_FINGER_SURFACE",
      "DEXTER_LAB.hearthCanvasFingerSurface"
    ],
    pointer: [
      "HEARTH.canvasFingerPointer",
      "HEARTH_CANVAS_FINGER_POINTER",
      "DEXTER_LAB.hearthCanvasFingerPointer"
    ],
    light: [
      "HEARTH.canvasFingerLight",
      "HEARTH_CANVAS_FINGER_LIGHT",
      "DEXTER_LAB.hearthCanvasFingerLight"
    ],
    inspect: [
      "HEARTH.canvasFingerInspect",
      "HEARTH_CANVAS_FINGER_INSPECT",
      "DEXTER_LAB.hearthCanvasFingerInspect"
    ],
    composite: [
      "HEARTH.canvasFingerComposite",
      "HEARTH_CANVAS_FINGER_COMPOSITE",
      "DEXTER_LAB.hearthCanvasFingerComposite"
    ]
  });

  const ACCEPTED_INDEX_CONTRACTS = Object.freeze([
    EXPECTED_INDEX_JS_CONTRACT,
    "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2",
    "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1",
    "HEARTH_INDEX_JS_PASSIVE_BUTTON_RECEIPT_CORRIDOR_ALIGNMENT_TNT_v5_4_3"
  ]);

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_GOVERNED_SOURCE_STACK_ADMISSION_CANVAS_HANDOFF_TNT_v10_3",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_DOM_SURFACE_ADMISSION_AND_RELEASE_TNT_v10_1",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
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
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

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
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function clean(value, limit = 1600) {
    return safeString(value)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
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

  function addNote(state, note) {
    if (!state || !Array.isArray(state.notes)) return;
    const text = clean(note, 1200);
    if (text && !state.notes.includes(text)) state.notes.push(text);
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
      return (
        url.searchParams.get("v") ||
        url.searchParams.get("cache") ||
        url.searchParams.get("version") ||
        ""
      );
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

  function readScript(targetDocument, targetWindow, file) {
    const scripts = qa(targetDocument, "script[src]");
    const script = scripts.find((item) => scriptMatches(item, file, targetWindow)) || null;
    const rawSrc = script && script.getAttribute ? script.getAttribute("src") : "";

    return {
      file,
      present: Boolean(script),
      src: script ? normalizeSrc(rawSrc, targetWindow) : "NOT_FOUND",
      cacheKey: script ? readCacheKey(rawSrc, targetWindow) : "NONE",
      datasetContract:
        script && script.dataset
          ? clean(firstDefined(
              script.dataset.contract,
              script.dataset.hearthContract,
              script.dataset.hearthDiagnosticExpectedContract,
              script.dataset.routeConductorCurrentContract,
              script.dataset.hearthRouteConductorContract,
              script.dataset.hearthCanvasContract
            ), 500)
          : "NONE"
    };
  }

  function readAllScripts(targetDocument, targetWindow) {
    const out = {};
    Object.keys(FILES).forEach((key) => {
      out[key] = readScript(targetDocument, targetWindow, FILES[key]);
    });
    return out;
  }

  function receiptValue(receipt, keys, fallback = undefined) {
    if (!isObject(receipt)) return fallback;

    for (const key of keys || []) {
      if (receipt[key] !== undefined && receipt[key] !== null && receipt[key] !== "") return receipt[key];

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

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getProbeEastReceipt",
      "getEastReceipt",
      "getWestReceipt",
      "getSouthReceipt",
      "getState",
      "getStatus",
      "getReport",
      "getSummary"
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

  function readContract(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

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
      if (value && (isObject(value) || isFunction(value))) {
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
      const authorityKey = `finger${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      out[authorityKey] = findAuthority(targetWindow, FINGER_PATHS[key]);
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
      const page = clean(firstDefined(
        data.page,
        targetDocument.documentElement.getAttribute("data-page")
      ), 500);
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
      const suppliedFrameTarget = readFrameTarget(opts.frameElement, state);
      if (suppliedFrameTarget) {
        state.targetAccessStatus = "TARGET_FRAME_SUPPLIED";
        return suppliedFrameTarget;
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
      return {
        targetDocument: doc,
        targetWindow: root,
        source: "currentHearthDocument"
      };
    }

    state.targetAccessStatus = "SOURCE_ONLY_NO_HEARTH_TARGET";
    state.targetAccessError = "NO_HEARTH_TARGET_DOCUMENT_AVAILABLE_TO_PROBE_EAST";
    addNote(state, "PROBE_EAST_SOURCE_ONLY_NO_HEARTH_TARGET_DOCUMENT_AVAILABLE");

    return { targetDocument: null, targetWindow: null, source: "none" };
  }

  function contractFromDataset(targetDocument) {
    if (!targetDocument || !targetDocument.documentElement) return "UNKNOWN";

    const data = readDataset(targetDocument);
    const bodyData = readBodyDataset(targetDocument);
    const html = targetDocument.documentElement;

    return clean(firstDefined(
      data.contract,
      data.hearthHtmlContract,
      data.hearthShellContract,
      html.getAttribute("data-contract"),
      bodyData.hearthHtmlContract
    ), 500) || "UNKNOWN";
  }

  function selectorName(el) {
    if (!el) return "NOT_FOUND";

    try {
      const tag = el.tagName ? el.tagName.toLowerCase() : "node";
      if (el.id) return `${tag}#${el.id}`;

      const attrs = [
        "data-hearth-visible-canvas",
        "data-hearth-expression-surface",
        "data-hearth-canvas",
        "data-hearth-canvas-texture",
        "data-hearth-planet-canvas",
        "data-hearth-globe-stage",
        "data-hearth-canvas-mount",
        "data-hearth-visible-planet-mount",
        "data-hearth-expression-mount",
        "data-hearth-visible-planet",
        "data-hearth-visible-globe",
        "data-hearth-canvas-surface",
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
      return "UNREADABLE";
    }
  }

  function rectPacket(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return "NOT_FOUND";
      const rect = el.getBoundingClientRect();

      return [
        `left:${Math.round(rect.left)}`,
        `top:${Math.round(rect.top)}`,
        `width:${Math.round(rect.width)}`,
        `height:${Math.round(rect.height)}`
      ].join(";");
    } catch (_error) {
      return "UNREADABLE";
    }
  }

  function rectNonzero(el) {
    try {
      if (!el || !isFunction(el.getBoundingClientRect)) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    } catch (_error) {
      return false;
    }
  }

  function compactScriptFootprint(scriptMap) {
    const out = {};
    Object.keys(scriptMap || {}).forEach((key) => {
      const script = scriptMap[key] || {};
      out[key] = {
        file: script.file || "UNKNOWN",
        present: Boolean(script.present),
        src: script.src || "NOT_FOUND",
        cacheKey: script.cacheKey || "NONE",
        datasetContract: script.datasetContract || "NONE"
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
        contract: found.contract || "UNKNOWN",
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
    ), 500) || "UNKNOWN";
  }

  function readAuthorityBoolean(found, keys) {
    const receipt = found && found.receipt ? found.receipt : {};
    const authority = found && found.authority ? found.authority : {};

    return boolText(firstDefined(
      receiptValue(receipt, keys),
      ...keys.map((key) => authority[key])
    ), "UNKNOWN");
  }

  function readTargetDatasets(targetDocument, state) {
    const htmlData = readDataset(targetDocument);
    const bodyData = readBodyDataset(targetDocument);

    state.targetHtmlContract = contractFromDataset(targetDocument);
    state.targetRouteSignal = documentRoute(targetDocument) || "UNKNOWN";
    state.targetPageSignal = clean(firstDefined(htmlData.page, bodyData.page), 500) || "UNKNOWN";
    state.targetPageContextSignal = clean(firstDefined(htmlData.pageContext, bodyData.pageContext), 1200) || "UNKNOWN";

    state.targetDatasetIndexJsContract = clean(firstDefined(
      htmlData.hearthIndexJsContract,
      htmlData.expectedIndexJsContract,
      bodyData.hearthIndexJsContract
    ), 500) || "UNKNOWN";

    state.targetDatasetRouteConductorContract = clean(firstDefined(
      htmlData.hearthRouteConductorContract,
      htmlData.expectedRouteConductorContract,
      htmlData.routeConductorCurrentContract,
      bodyData.hearthRouteConductorContract
    ), 500) || "UNKNOWN";

    state.targetDatasetRouteConductorCurrent = clean(firstDefined(
      htmlData.routeConductorCurrent,
      htmlData.hearthRouteConductorCurrent,
      bodyData.routeConductorCurrent
    ), 500) || "UNKNOWN";

    state.targetDatasetCanvasContract = clean(firstDefined(
      htmlData.hearthCanvasContract,
      htmlData.currentCanvasParentContract,
      bodyData.hearthCanvasContract
    ), 500) || "UNKNOWN";

    state.targetDatasetControlContract = clean(firstDefined(
      htmlData.hearthControlsContract,
      htmlData.hearthControlContract,
      bodyData.hearthControlsContract
    ), 500) || "UNKNOWN";

    if (state.targetHtmlContract === EXPECTED_HTML_CONTRACT) {
      addNote(state, "PROBE_EAST_HTML_CURRENT_CONTRACT_RECOGNIZED");
    } else {
      addNote(state, `PROBE_EAST_HTML_CONTRACT_NOT_CURRENT:${state.targetHtmlContract}`);
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
    state.stageRectNonzero = boolText(rectNonzero(stage));

    state.mountPresent = boolText(Boolean(mount));
    state.mountSelector = selectorName(mount);
    state.mountRect = rectPacket(mount);
    state.mountRectNonzero = boolText(rectNonzero(mount));

    state.canvasElementPresent = boolText(Boolean(canvas));
    state.canvasElementSelector = selectorName(canvas);
    state.canvasElementRect = rectPacket(canvas);
    state.canvasElementRectNonzero = boolText(rectNonzero(canvas));
    state.canvasAttributeWidth = canvas ? clean(canvas.width || 0, 60) : "NOT_FOUND";
    state.canvasAttributeHeight = canvas ? clean(canvas.height || 0, 60) : "NOT_FOUND";

    state.expressionSurfacePresent = boolText(Boolean(surface));
    state.expressionSurfaceSelector = selectorName(surface);
    state.expressionSurfaceRect = rectPacket(surface);
    state.expressionSurfaceRectNonzero = boolText(rectNonzero(surface));

    state.stageMountBridgeStatus =
      state.stageRectNonzero === "true" && state.mountRectNonzero === "true"
        ? "STAGE_AND_MOUNT_BRIDGE_PRESENT"
        : state.stagePresent === "true" || state.mountPresent === "true"
          ? "STAGE_OR_MOUNT_PARTIAL"
          : "STAGE_AND_MOUNT_NOT_FOUND";

    state.expressionSurfaceBridgeStatus =
      state.expressionSurfaceRectNonzero === "true"
        ? "EXPRESSION_SURFACE_BRIDGE_PRESENT"
        : state.canvasElementRectNonzero === "true"
          ? "CANVAS_ELEMENT_BRIDGE_PRESENT"
          : "EXPRESSION_SURFACE_NOT_PROVEN";

    if (state.stageRectNonzero === "true") addNote(state, "PROBE_EAST_STAGE_NONZERO_BRIDGE_SURFACE_OBSERVED");
    else addNote(state, "PROBE_EAST_STAGE_BRIDGE_SURFACE_NOT_CONFIRMED");

    if (state.mountRectNonzero === "true") addNote(state, "PROBE_EAST_MOUNT_NONZERO_BRIDGE_SURFACE_OBSERVED");
    else addNote(state, "PROBE_EAST_MOUNT_BRIDGE_SURFACE_NOT_CONFIRMED");

    if (state.canvasElementRectNonzero === "true") addNote(state, "PROBE_EAST_CANVAS_ELEMENT_BRIDGE_SURFACE_OBSERVED");
    else addNote(state, "PROBE_EAST_CANVAS_ELEMENT_NOT_CONFIRMED_AS_SOURCE_BRIDGE_SURFACE");

    if (state.expressionSurfaceRectNonzero === "true") addNote(state, "PROBE_EAST_EXPRESSION_SURFACE_BRIDGE_OBSERVED");
    else addNote(state, "PROBE_EAST_EXPRESSION_SURFACE_NOT_CONFIRMED");
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
    ), 500) || "UNKNOWN";

    state.indexScriptPresent = boolText(script.present);
    state.indexScriptSrc = script.src || "NOT_FOUND";
    state.indexScriptCacheKey = script.cacheKey || "NONE";
    state.indexAuthoritySource = found.path || "NONE";
    state.indexAuthorityPresent = boolText(Boolean(found.authority));
    state.indexContract = contract;
    state.indexCurrentSpreadRecognized = boolText(ACCEPTED_INDEX_CONTRACTS.includes(contract));

    state.indexExpressionChainLoadClaim = readAuthorityBoolean(found, [
      "visibleExpressionChainLoaded",
      "expressionChainLoaded",
      "canvasChainLoaded",
      "hexAuthorityLoaded",
      "hexSurfaceLoaded",
      "canvasLoaded"
    ]);

    if (state.indexCurrentSpreadRecognized === "true") addNote(state, "PROBE_EAST_INDEX_CURRENT_OR_ACCEPTED_SPREAD_RECOGNIZED");
    else addNote(state, "PROBE_EAST_INDEX_CURRENT_SPREAD_NOT_CONFIRMED");
  }

  function deriveRouteConductorStatus(state, scripts, authorities) {
    const script = scripts.routeConductor || {};
    const found = authorities.routeConductor || {};
    const receipt = found.receipt || {};
    const authorityContract = found.contract || "";

    const servedContract = clean(firstDefined(
      authorityContract,
      receiptValue(receipt, ["currentRouteConductorContract", "routeConductorContract", "contract", "CONTRACT"]),
      script.datasetContract,
      state.targetDatasetRouteConductorContract,
      state.targetDatasetRouteConductorCurrent,
      script.cacheKey
    ), 500) || "UNKNOWN";

    state.routeConductorScriptPresent = boolText(script.present);
    state.routeConductorScriptSrc = script.src || "NOT_FOUND";
    state.routeConductorScriptCacheKey = script.cacheKey || "NONE";
    state.routeConductorAuthoritySource = found.path || "NONE";
    state.routeConductorAuthorityPresent = boolText(Boolean(found.authority));
    state.routeConductorAuthorityContract = authorityContract || "UNKNOWN";
    state.routeConductorServedContract = servedContract;
    state.routeConductorCurrentSpreadRecognized = boolText(ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(servedContract));

    state.routeConductorRenderedAuthorityOverridesScriptCache = boolText(Boolean(
      authorityContract &&
      script.cacheKey &&
      authorityContract !== script.cacheKey &&
      ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.includes(authorityContract)
    ));

    state.cacheKeyStaleNonBlocking = state.routeConductorRenderedAuthorityOverridesScriptCache;
    state.servedContractMismatchIsBlocking =
      state.routeConductorCurrentSpreadRecognized === "true" ? "false" : "UNKNOWN";

    state.bishopQueenRecognitionFunnelClaim = readAuthorityBoolean(found, [
      "bishopQueenCanvasRecognitionFunnelActive",
      "bishopQueenCanvasRecognitionActive",
      "queenCanvasRecognitionActive"
    ]);

    state.routeConductorCanvasHandoffClaim = readAuthorityBoolean(found, [
      "canvasHandoffActive",
      "fourWayCanvasHandoffActive",
      "routeCanvasHandshakeReady",
      "visiblePlanetProofReady",
      "renderedPlanetProofReady"
    ]);

    if (state.routeConductorCurrentSpreadRecognized === "true") {
      addNote(state, "PROBE_EAST_ROUTE_CONDUCTOR_CURRENT_OR_ACCEPTED_SPREAD_RECOGNIZED");
    } else {
      addNote(state, `PROBE_EAST_ROUTE_CONDUCTOR_CURRENT_SPREAD_NOT_CONFIRMED:${servedContract}`);
    }

    if (state.routeConductorRenderedAuthorityOverridesScriptCache === "true") {
      addNote(state, `PROBE_EAST_ROUTE_CONDUCTOR_AUTHORITY_OVERRIDES_STALE_SCRIPT_CACHE:${authorityContract}>${script.cacheKey}`);
    }
  }

  function deriveControlStatus(state, scripts, authorities) {
    const script = scripts.controls || {};
    const found = authorities.controls || {};
    const receipt = found.receipt || {};

    const present = Boolean(script.present || found.authority || found.contract || Object.keys(receipt).length);

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

    state.controlScriptPresent = boolText(script.present);
    state.controlScriptSrc = script.src || "NOT_FOUND";
    state.controlAuthoritySource = found.path || "NONE";
    state.controlAuthorityPresent = boolText(Boolean(found.authority));
    state.controlReceiptPresent = boolText(Boolean(Object.keys(receipt).length));
    state.controlContract = found.contract || clean(receiptValue(receipt, ["contract", "CONTRACT", "controlsContract"]), 500) || "UNKNOWN";

    state.controlFileStatus = present
      ? motionReady
        ? "CONTROL_FILE_LOADED_AND_MOTION_TOUCH_READY"
        : "CONTROL_FILE_PRESENT_HANDSHAKE_PENDING"
      : "CONTROL_FILE_NOT_CONFIRMED";

    state.controlHandshakeStatus = present
      ? motionReady
        ? "HANDSHAKE_VALID"
        : "HANDSHAKE_PENDING"
      : "CONTROL_HANDSHAKE_NOT_CONFIRMED";

    state.motionTouchStatus = motionReady ? "ACTIVE" : "NOT_CONFIRMED";
    state.dragStatus = motionReady ? "ACTIVE" : "NOT_CONFIRMED";
    state.viewControlStatus = motionReady ? "ACTIVE" : "NOT_CONFIRMED";

    if (motionReady) addNote(state, "PROBE_EAST_CONTROL_FILE_PRESENT_AND_MOTION_TOUCH_READY");
    else if (present) addNote(state, "PROBE_EAST_CONTROL_FILE_PRESENT_HANDSHAKE_PENDING");
    else addNote(state, "PROBE_EAST_CONTROL_FILE_NOT_CONFIRMED");
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
      state.targetDatasetCanvasContract
    ), 500) || "UNKNOWN";

    const present = Boolean(script.present || found.authority || found.contract || Object.keys(receipt).length);

    state.canvasScriptPresent = boolText(script.present);
    state.canvasScriptSrc = script.src || "NOT_FOUND";
    state.canvasAuthoritySource = found.path || "NONE";
    state.canvasAuthorityPresent = boolText(Boolean(found.authority));
    state.canvasReceiptPresent = boolText(Boolean(Object.keys(receipt).length));
    state.canvasContract = contract;
    state.canvasParentRecognized = boolText(Boolean(
      present &&
      (
        contract === EXPECTED_CANVAS_CONTRACT ||
        contract.includes("HEARTH_CANVAS_") ||
        state.canvasAuthorityPresent === "true"
      )
    ));

    state.canvasExpressionHubClaim = readAuthorityBoolean(found, [
      "expressionHubActive",
      "canvasExpressionHubActive",
      "canvasExpressionHubReady",
      "governedSourceReceiverActive"
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
      "visiblePlanetProofReady",
      "visible2dOutputActive",
      "pixelVisible",
      "canvasPixelVisible"
    ]);

    state.canvasDrawClaim = readAuthorityBoolean(found, [
      "canvasMounted",
      "canvasDrawComplete",
      "baseGlobeDrawComplete",
      "drawComplete",
      "pixelVisible",
      "canvasPixelVisible"
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

    addNote(state, `PROBE_EAST_VISIBLE_EXPRESSION_CHAIN_STATUS:${state.indexVisibleExpressionChainStatus}`);
  }

  function deriveRailProbeStatus(state, scripts, authorities) {
    state.railEastScriptPresent = boolText(Boolean(scripts.railEast && scripts.railEast.present));
    state.railEastAuthoritySource = authorities.railEast ? authorities.railEast.path : "NONE";
    state.railEastAuthorityPresent = boolText(Boolean(authorities.railEast && authorities.railEast.authority));
    state.railEastContract = authorities.railEast && authorities.railEast.contract ? authorities.railEast.contract : "UNKNOWN";
    state.railEastStatus = readReceiptStatus(authorities.railEast || {});

    state.probeNorthScriptPresent = boolText(Boolean(scripts.probeNorth && scripts.probeNorth.present));
    state.probeNorthAuthoritySource = authorities.probeNorth ? authorities.probeNorth.path : "NONE";
    state.probeNorthAuthorityPresent = boolText(Boolean(authorities.probeNorth && authorities.probeNorth.authority));
    state.probeNorthContract = authorities.probeNorth && authorities.probeNorth.contract ? authorities.probeNorth.contract : "UNKNOWN";
    state.probeNorthStatus = readReceiptStatus(authorities.probeNorth || {});

    state.probeEastSelfObserved = "true";
    state.probeEastAuthoritySource = "HEARTH.diagnosticProbeEast";
    state.probeEastObservedContract = CONTRACT;

    state.probeWestScriptPresent = boolText(Boolean(scripts.probeWest && scripts.probeWest.present));
    state.probeWestAuthoritySource = authorities.probeWest ? authorities.probeWest.path : "NONE";
    state.probeWestAuthorityPresent = boolText(Boolean(authorities.probeWest && authorities.probeWest.authority));
    state.probeWestContract = authorities.probeWest && authorities.probeWest.contract ? authorities.probeWest.contract : "UNKNOWN";

    state.probeCanvasSurfaceTruthScriptPresent = boolText(Boolean(scripts.probeCanvasSurfaceTruth && scripts.probeCanvasSurfaceTruth.present));
    state.probeCanvasSurfaceTruthAuthoritySource = authorities.probeCanvasSurfaceTruth ? authorities.probeCanvasSurfaceTruth.path : "NONE";
    state.probeCanvasSurfaceTruthAuthorityPresent = boolText(Boolean(authorities.probeCanvasSurfaceTruth && authorities.probeCanvasSurfaceTruth.authority));
    state.probeCanvasSurfaceTruthContract = authorities.probeCanvasSurfaceTruth && authorities.probeCanvasSurfaceTruth.contract
      ? authorities.probeCanvasSurfaceTruth.contract
      : "UNKNOWN";

    state.probeSouthScriptPresent = boolText(Boolean(scripts.probeSouth && scripts.probeSouth.present));
    state.probeSouthAuthoritySource = authorities.probeSouth ? authorities.probeSouth.path : "NONE";
    state.probeSouthAuthorityPresent = boolText(Boolean(authorities.probeSouth && authorities.probeSouth.authority));
    state.probeSouthContract = authorities.probeSouth && authorities.probeSouth.contract ? authorities.probeSouth.contract : "UNKNOWN";

    if (state.railEastAuthorityPresent === "true" || state.railEastScriptPresent === "true") {
      addNote(state, "PROBE_EAST_RAIL_EAST_OBSERVED_NOT_RENEWED");
    }

    if (state.probeCanvasSurfaceTruthScriptPresent === "true" && state.probeCanvasSurfaceTruthAuthorityPresent !== "true") {
      addNote(state, "PROBE_EAST_SURFACE_TRUTH_PROBE_SCRIPT_PRESENT_BUT_AUTHORITY_NOT_OBSERVED");
    }
  }

  function deriveLabChannelFingerStatus(state, scripts, authorities) {
    const labKeys = ["labNorth", "labEast", "labSouth", "labWest"];
    const channelKeys = ["landChannel", "waterChannel", "airChannel"];

    let labObserved = 0;
    let channelObserved = 0;
    let fingerObserved = 0;

    labKeys.forEach((key) => {
      if ((scripts[key] && scripts[key].present) || (authorities[key] && authorities[key].authority)) labObserved += 1;
    });

    channelKeys.forEach((key) => {
      if ((scripts[key] && scripts[key].present) || (authorities[key] && authorities[key].authority)) channelObserved += 1;
    });

    Object.keys(FINGER_PATHS).forEach((finger) => {
      const key = `finger${finger.charAt(0).toUpperCase()}${finger.slice(1)}`;
      if ((scripts[key] && scripts[key].present) || (authorities[key] && authorities[key].authority)) fingerObserved += 1;
    });

    state.labFileObservedCount = String(labObserved);
    state.labBridgeCompositionStatus =
      labObserved >= 4
        ? "LAB_FOUR_WAY_COMPOSITION_OBSERVED"
        : labObserved > 0
          ? "LAB_PARTIAL_COMPOSITION_OBSERVED"
          : "LAB_COMPOSITION_NOT_CONFIRMED";

    state.channelObservedCount = String(channelObserved);
    state.channelCompositionStatus =
      channelObserved >= 2
        ? "LAND_WATER_AIR_CHANNEL_COMPOSITION_PARTIAL_OR_COMPLETE"
        : channelObserved > 0
          ? "CHANNEL_COMPOSITION_PARTIAL"
          : "CHANNEL_COMPOSITION_NOT_CONFIRMED";

    state.fingerObservedCount = String(fingerObserved);
    state.fingerCompositionStatus =
      fingerObserved >= 7
        ? "MODERN_FINGER_COMPOSITION_COMPLETE"
        : fingerObserved > 0
          ? "MODERN_FINGER_COMPOSITION_PARTIAL"
          : "MODERN_FINGER_COMPOSITION_NOT_CONFIRMED";

    addNote(state, `PROBE_EAST_LAB_FILE_COMPOSITION_OBSERVED_COUNT:${labObserved}`);
    addNote(state, `PROBE_EAST_CHANNEL_COMPOSITION_OBSERVED_COUNT:${channelObserved}`);
    addNote(state, `PROBE_EAST_FINGER_COMPOSITION_OBSERVED_COUNT:${fingerObserved}`);
  }

  function deriveCompositionVerdict(state) {
    const sourceCoreOk =
      state.indexScriptPresent === "true" &&
      state.routeConductorScriptPresent === "true";

    const currentSpreadOk =
      state.indexCurrentSpreadRecognized === "true" &&
      state.routeConductorCurrentSpreadRecognized === "true";

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
      stageMountOk && expressionConfirmed
        ? "STAGE_MOUNT_AND_EXPRESSION_SURFACE_CAN_BE_RECOGNIZED"
        : stageMountOk
          ? "STAGE_AND_MOUNT_CAN_BE_RECOGNIZED_BUT_EXPRESSION_SURFACE_COMPOSITION_PENDING"
          : "CANVAS_EXPRESSION_INSTRUMENTATION_INCOMPLETE";

    if (!sourceCoreOk) {
      state.zoneOfInflictionOwner = "INDEX_ROUTE_CONDUCTOR_SOURCE_COMPOSITION";
      state.zoneOfInflictionFile = FILES.index;
      state.zoneOfInflictionClass = "SOURCE_COMPOSITION_INCOMPLETE";
      state.zoneOfInflictionReason = "INDEX_OR_ROUTE_CONDUCTOR_SOURCE_COMPOSITION_IS_NOT_CONFIRMED";
    } else if (!canvasConfirmed) {
      state.zoneOfInflictionOwner = "CANVAS_PARENT_SOURCE_COMPOSITION";
      state.zoneOfInflictionFile = FILES.canvas;
      state.zoneOfInflictionClass = "CANVAS_PARENT_NOT_CONFIRMED";
      state.zoneOfInflictionReason = "INDEX_AND_ROUTE_CONDUCTOR_PRESENT_BUT_CANVAS_PARENT_AUTHORITY_OR_SCRIPT_IS_NOT_CONFIRMED";
    } else if (!expressionConfirmed) {
      state.zoneOfInflictionOwner = "CANVAS_EXPRESSION_SURFACE";
      state.zoneOfInflictionFile = FILES.canvas;
      state.zoneOfInflictionClass = "EXPRESSION_SURFACE_NOT_PROVEN";
      state.zoneOfInflictionReason = "SOURCE_REACHES_CANVAS_BUT_DOM_CANVAS_OR_EXPRESSION_SURFACE_IS_NOT_PROVEN_BY_PROBE_EAST";
    } else {
      state.zoneOfInflictionOwner = "NONE";
      state.zoneOfInflictionFile = "NONE";
      state.zoneOfInflictionClass = "NONE";
      state.zoneOfInflictionReason = "PROBE_EAST_CONFIRMED_SOURCE_REACH_AND_BRIDGE_SURFACE;NORTH_RETAINS_FINAL_DISPOSITION";
    }

    state.probeEastDisposition =
      currentSpreadOk && sourceCoreOk && controlOk && stageMountOk && expressionConfirmed
        ? "SOURCE_SIDE_OK_CONTROL_OK_STAGE_MOUNT_AND_EXPRESSION_SURFACE_PRESENT"
        : sourceCoreOk && controlOk && stageMountOk && !expressionConfirmed
          ? "SOURCE_SIDE_OK_CONTROL_OK_STAGE_MOUNT_OK_CANVAS_EXPRESSION_SURFACE_PENDING"
          : sourceCoreOk
            ? "SOURCE_SIDE_PARTIAL_NEXT_CANVAS_EXPRESSION_COMPOSITION_REQUIRES_WEST_OR_CANVAS_SURFACE_TRUTH_PROBE"
            : "SOURCE_SIDE_INCOMPLETE";

    addNote(state, `PROBE_EAST_DISPOSITION:${state.probeEastDisposition}`);
  }

  function makeState(status = "ANCHOR_PUBLISHED_WAITING_RUN") {
    return {
      PROBE_EAST_STATUS: status === "COMPLETE" ? "COMPLETE" : "READY",
      probeEastStatus: status === "COMPLETE" ? "COMPLETE" : "READY",

      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,

      parentNorthContract: PARENT_NORTH_CONTRACT,
      parentNorthReceipt: PARENT_NORTH_RECEIPT,
      previousParentNorthContract: PREVIOUS_PARENT_NORTH_CONTRACT,
      railEastContract: RAIL_EAST_CONTRACT,
      railEastImplementationContract: RAIL_EAST_IMPLEMENTATION_CONTRACT,

      anchorStatus: "ANCHOR_PUBLISHED_SYNCHRONOUSLY",
      anchorSourcePathPrimary: "HEARTH.diagnosticProbeEast",
      anchorSourcePaths:
        "HEARTH.diagnosticProbeEast,HEARTH.diagnosticEastProbe,HEARTH_DIAGNOSTIC_PROBE_EAST,DEXTER_LAB.hearthDiagnosticProbeEast",
      anchorObserved: "true",
      chronologyObservationGuard: "PUBLIC_AUTHORITY_PUBLISHED_BEFORE_TARGET_PROBE",
      chronologyFailureClassAddressed: "SCRIPT_ALREADY_PRESENT_AUTHORITY_NOT_OBSERVED",

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
      probeEastRunStatus: status,
      targetAccessStatus: "UNKNOWN",
      targetAccessError: "UNKNOWN",
      targetDocumentSource: "UNKNOWN",
      hearthTargetConfirmed: "UNKNOWN",

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      expectedRouteConductorLineageContract: EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      targetHtmlContract: "UNKNOWN",
      targetRouteSignal: "UNKNOWN",
      targetPageSignal: "UNKNOWN",
      targetPageContextSignal: "UNKNOWN",
      targetDatasetIndexJsContract: "UNKNOWN",
      targetDatasetRouteConductorContract: "UNKNOWN",
      targetDatasetRouteConductorCurrent: "UNKNOWN",
      targetDatasetCanvasContract: "UNKNOWN",
      targetDatasetControlContract: "UNKNOWN",

      indexScriptPresent: "UNKNOWN",
      indexScriptSrc: "UNKNOWN",
      indexScriptCacheKey: "UNKNOWN",
      indexAuthoritySource: "UNKNOWN",
      indexAuthorityPresent: "UNKNOWN",
      indexContract: "UNKNOWN",
      indexCurrentSpreadRecognized: "UNKNOWN",
      indexExpressionChainLoadClaim: "UNKNOWN",

      routeConductorScriptPresent: "UNKNOWN",
      routeConductorScriptSrc: "UNKNOWN",
      routeConductorScriptCacheKey: "UNKNOWN",
      routeConductorAuthoritySource: "UNKNOWN",
      routeConductorAuthorityPresent: "UNKNOWN",
      routeConductorAuthorityContract: "UNKNOWN",
      routeConductorServedContract: "UNKNOWN",
      routeConductorCurrentSpreadRecognized: "UNKNOWN",
      routeConductorRenderedAuthorityOverridesScriptCache: "UNKNOWN",
      cacheKeyStaleNonBlocking: "UNKNOWN",
      servedContractMismatchIsBlocking: "UNKNOWN",
      bishopQueenRecognitionFunnelClaim: "UNKNOWN",
      routeConductorCanvasHandoffClaim: "UNKNOWN",

      controlScriptPresent: "UNKNOWN",
      controlScriptSrc: "UNKNOWN",
      controlAuthoritySource: "UNKNOWN",
      controlAuthorityPresent: "UNKNOWN",
      controlReceiptPresent: "UNKNOWN",
      controlContract: "UNKNOWN",
      controlFileStatus: "UNKNOWN",
      controlHandshakeStatus: "UNKNOWN",
      motionTouchStatus: "UNKNOWN",
      dragStatus: "UNKNOWN",
      viewControlStatus: "UNKNOWN",

      canvasScriptPresent: "UNKNOWN",
      canvasScriptSrc: "UNKNOWN",
      canvasAuthoritySource: "UNKNOWN",
      canvasAuthorityPresent: "UNKNOWN",
      canvasReceiptPresent: "UNKNOWN",
      canvasContract: "UNKNOWN",
      canvasParentRecognized: "UNKNOWN",
      canvasExpressionHubClaim: "UNKNOWN",
      canvasFingerManagerClaim: "UNKNOWN",
      visibleBaseGlobeCarrierClaim: "UNKNOWN",
      canvasDrawClaim: "UNKNOWN",
      canvasSourceCompositionStatus: "UNKNOWN",

      hexAuthorityScriptPresent: "UNKNOWN",
      hexSurfaceScriptPresent: "UNKNOWN",
      hexAuthorityGlobalPresent: "UNKNOWN",
      hexSurfaceGlobalPresent: "UNKNOWN",
      indexVisibleExpressionChainStatus: "UNKNOWN",

      railEastScriptPresent: "UNKNOWN",
      railEastAuthoritySource: "UNKNOWN",
      railEastAuthorityPresent: "UNKNOWN",
      railEastContractObserved: "UNKNOWN",
      railEastStatus: "UNKNOWN",

      probeNorthScriptPresent: "UNKNOWN",
      probeNorthAuthoritySource: "UNKNOWN",
      probeNorthAuthorityPresent: "UNKNOWN",
      probeNorthContract: "UNKNOWN",
      probeNorthStatus: "UNKNOWN",

      probeEastSelfObserved: "true",
      probeEastAuthoritySource: "HEARTH.diagnosticProbeEast",
      probeEastObservedContract: CONTRACT,

      probeWestScriptPresent: "UNKNOWN",
      probeWestAuthoritySource: "UNKNOWN",
      probeWestAuthorityPresent: "UNKNOWN",
      probeWestContract: "UNKNOWN",

      probeCanvasSurfaceTruthScriptPresent: "UNKNOWN",
      probeCanvasSurfaceTruthAuthoritySource: "UNKNOWN",
      probeCanvasSurfaceTruthAuthorityPresent: "UNKNOWN",
      probeCanvasSurfaceTruthContract: "UNKNOWN",

      probeSouthScriptPresent: "UNKNOWN",
      probeSouthAuthoritySource: "UNKNOWN",
      probeSouthAuthorityPresent: "UNKNOWN",
      probeSouthContract: "UNKNOWN",

      stagePresent: "UNKNOWN",
      stageSelector: "UNKNOWN",
      stageRect: "UNKNOWN",
      stageRectNonzero: "UNKNOWN",
      mountPresent: "UNKNOWN",
      mountSelector: "UNKNOWN",
      mountRect: "UNKNOWN",
      mountRectNonzero: "UNKNOWN",
      canvasElementPresent: "UNKNOWN",
      canvasElementSelector: "UNKNOWN",
      canvasElementRect: "UNKNOWN",
      canvasElementRectNonzero: "UNKNOWN",
      canvasAttributeWidth: "UNKNOWN",
      canvasAttributeHeight: "UNKNOWN",
      expressionSurfacePresent: "UNKNOWN",
      expressionSurfaceSelector: "UNKNOWN",
      expressionSurfaceRect: "UNKNOWN",
      expressionSurfaceRectNonzero: "UNKNOWN",
      stageMountBridgeStatus: "UNKNOWN",
      expressionSurfaceBridgeStatus: "UNKNOWN",

      labFileObservedCount: "0",
      labBridgeCompositionStatus: "UNKNOWN",
      channelObservedCount: "0",
      channelCompositionStatus: "UNKNOWN",
      fingerObservedCount: "0",
      fingerCompositionStatus: "UNKNOWN",

      sourceSideCurrentSpreadStatus: "UNKNOWN",
      fileCompositionStatus: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      bridgeSurfaceCompositionStatus: "ANCHOR_READY_TARGET_NOT_YET_PROBED",
      canvasExpressionInstrumentationStatus: "ANCHOR_READY_TARGET_NOT_YET_PROBED",

      zoneOfInflictionOwner: "NONE",
      zoneOfInflictionFile: "NONE",
      zoneOfInflictionClass: "NONE",
      zoneOfInflictionReason: "PROBE_EAST_ANCHOR_PUBLISHED_WAITING_FOR_NORTH_CALL",
      probeEastDisposition: "ANCHOR_READY_WAITING_RUN",

      scriptFootprint: {},
      authorityFootprint: {},
      notes: ["PROBE_EAST_ANCHOR_PUBLISHED_SYNCHRONOUSLY"],

      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function makeEvidencePacket(state) {
    return {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_PROBE_EAST_ANCHOR_SAFE_EVIDENCE_PACKET_v1_1",

      PROBE_EAST_STATUS: state.probeEastStatus || state.PROBE_EAST_STATUS || "READY",
      PROBE_EAST_CONTRACT: CONTRACT,
      PROBE_EAST_RECEIPT: RECEIPT,
      PROBE_EAST_IMPLEMENTATION_CONTRACT: INTERNAL_IMPLEMENTATION_CONTRACT,
      PROBE_EAST_IMPLEMENTATION_RECEIPT: INTERNAL_IMPLEMENTATION_RECEIPT,
      PROBE_EAST_VERSION: VERSION,
      PROBE_EAST_FILE: FILE,

      TARGET_ROUTE: TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: DIAGNOSTIC_ROUTE,

      PARENT_NORTH_CONTRACT: PARENT_NORTH_CONTRACT,
      PARENT_NORTH_RECEIPT: PARENT_NORTH_RECEIPT,
      PREVIOUS_PARENT_NORTH_CONTRACT: PREVIOUS_PARENT_NORTH_CONTRACT,
      RAIL_EAST_CONTRACT: RAIL_EAST_CONTRACT,
      RAIL_EAST_IMPLEMENTATION_CONTRACT: RAIL_EAST_IMPLEMENTATION_CONTRACT,

      PROBE_EAST_ANCHOR_STATUS: state.anchorStatus,
      PROBE_EAST_ANCHOR_OBSERVED: state.anchorObserved,
      PROBE_EAST_ANCHOR_SOURCE_PATH_PRIMARY: state.anchorSourcePathPrimary,
      PROBE_EAST_ANCHOR_SOURCE_PATHS: state.anchorSourcePaths,
      PROBE_EAST_CHRONOLOGY_OBSERVATION_GUARD: state.chronologyObservationGuard,
      PROBE_EAST_CHRONOLOGY_FAILURE_CLASS_ADDRESSED: state.chronologyFailureClassAddressed,

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
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT: state.expectedRouteConductorLineageContract,
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
      RAIL_EAST_OBSERVED_CONTRACT: state.railEastContractObserved,
      RAIL_EAST_STATUS: state.railEastStatus,

      PROBE_NORTH_SCRIPT_PRESENT: state.probeNorthScriptPresent,
      PROBE_NORTH_AUTHORITY_SOURCE: state.probeNorthAuthoritySource,
      PROBE_NORTH_AUTHORITY_PRESENT: state.probeNorthAuthorityPresent,
      PROBE_NORTH_CONTRACT: state.probeNorthContract,
      PROBE_NORTH_STATUS: state.probeNorthStatus,

      PROBE_EAST_SELF_OBSERVED: state.probeEastSelfObserved,
      PROBE_EAST_AUTHORITY_SOURCE: state.probeEastAuthoritySource,
      PROBE_EAST_OBSERVED_CONTRACT: state.probeEastObservedContract,

      PROBE_WEST_SCRIPT_PRESENT: state.probeWestScriptPresent,
      PROBE_WEST_AUTHORITY_SOURCE: state.probeWestAuthoritySource,
      PROBE_WEST_AUTHORITY_PRESENT: state.probeWestAuthorityPresent,
      PROBE_WEST_CONTRACT: state.probeWestContract,

      PROBE_CANVAS_SURFACE_TRUTH_SCRIPT_PRESENT: state.probeCanvasSurfaceTruthScriptPresent,
      PROBE_CANVAS_SURFACE_TRUTH_AUTHORITY_SOURCE: state.probeCanvasSurfaceTruthAuthoritySource,
      PROBE_CANVAS_SURFACE_TRUTH_AUTHORITY_PRESENT: state.probeCanvasSurfaceTruthAuthorityPresent,
      PROBE_CANVAS_SURFACE_TRUTH_CONTRACT: state.probeCanvasSurfaceTruthContract,

      PROBE_SOUTH_SCRIPT_PRESENT: state.probeSouthScriptPresent,
      PROBE_SOUTH_AUTHORITY_SOURCE: state.probeSouthAuthoritySource,
      PROBE_SOUTH_AUTHORITY_PRESENT: state.probeSouthAuthorityPresent,
      PROBE_SOUTH_CONTRACT: state.probeSouthContract,

      STAGE_PRESENT: state.stagePresent,
      STAGE_SELECTOR: state.stageSelector,
      STAGE_RECT: state.stageRect,
      STAGE_RECT_NONZERO: state.stageRectNonzero,
      MOUNT_PRESENT: state.mountPresent,
      MOUNT_SELECTOR: state.mountSelector,
      MOUNT_RECT: state.mountRect,
      MOUNT_RECT_NONZERO: state.mountRectNonzero,
      CANVAS_ELEMENT_PRESENT: state.canvasElementPresent,
      CANVAS_ELEMENT_SELECTOR: state.canvasElementSelector,
      CANVAS_ELEMENT_RECT: state.canvasElementRect,
      CANVAS_ELEMENT_RECT_NONZERO: state.canvasElementRectNonzero,
      CANVAS_ATTRIBUTE_WIDTH: state.canvasAttributeWidth,
      CANVAS_ATTRIBUTE_HEIGHT: state.canvasAttributeHeight,
      EXPRESSION_SURFACE_PRESENT: state.expressionSurfacePresent,
      EXPRESSION_SURFACE_SELECTOR: state.expressionSurfaceSelector,
      EXPRESSION_SURFACE_RECT: state.expressionSurfaceRect,
      EXPRESSION_SURFACE_RECT_NONZERO: state.expressionSurfaceRectNonzero,
      STAGE_MOUNT_BRIDGE_STATUS: state.stageMountBridgeStatus,
      EXPRESSION_SURFACE_BRIDGE_STATUS: state.expressionSurfaceBridgeStatus,

      LAB_FILE_OBSERVED_COUNT: state.labFileObservedCount,
      LAB_BRIDGE_COMPOSITION_STATUS: state.labBridgeCompositionStatus,
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
      PROBE_EAST_NOTES: state.notes.length ? state.notes.join(" | ") : "NONE",

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

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: state.updatedAt
    };
  }

  function publish(state) {
    lastState = clonePlain(state || makeState());
    lastEvidencePacket = makeEvidencePacket(lastState);

    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.diagnosticProbeEast = api;
    hearth.diagnosticEastProbe = api;
    hearth.diagnosticProbeEastServedSourceFileComposition = api;
    hearth.diagnosticProbeEastAnchorSafeChronologyObservation = api;
    hearth.diagnosticProbeEastReceipt = getProbeEastReceipt();
    hearth.diagnosticProbeEastEvidence = clonePlain(lastEvidencePacket);

    lab.hearthDiagnosticProbeEast = api;
    lab.hearthDiagnosticEastProbe = api;
    lab.hearthDiagnosticProbeEastServedSourceFileComposition = api;
    lab.hearthDiagnosticProbeEastAnchorSafeChronologyObservation = api;

    root.HEARTH_DIAGNOSTIC_PROBE_EAST = api;
    root.HEARTH_DIAGNOSTIC_EAST_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION = api;
    root.HEARTH_DIAGNOSTIC_PROBE_EAST_ANCHOR_SAFE_CHRONOLOGY_OBSERVATION = api;
    root.HEARTH_DIAGNOSTIC_PROBE_EAST_RECEIPT = getProbeEastReceipt();
    root.HEARTH_DIAGNOSTIC_PROBE_EAST_EVIDENCE = clonePlain(lastEvidencePacket);

    return true;
  }

  function runProbeEast(options = {}) {
    const state = makeState("RUNNING");

    state.probeEastStatus = "RUNNING";
    state.PROBE_EAST_STATUS = "RUNNING";
    state.probeEastRunStatus = "RUNNING";
    state.probeEastRunComplete = "false";
    state.updatedAt = nowIso();

    publish(state);

    try {
      const target = resolveTarget(options, state);

      state.targetDocumentSource = target.source || "UNKNOWN";
      state.hearthTargetConfirmed = boolText(Boolean(
        target.targetDocument &&
        hasHearthTargetSignals(target.targetDocument, target.targetWindow)
      ));

      if (!target.targetDocument) {
        state.probeEastStatus = "PARTIAL";
        state.PROBE_EAST_STATUS = "PARTIAL";
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

        return clonePlain(lastEvidencePacket);
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
      deriveLabChannelFingerStatus(state, scripts, authorities);
      deriveCompositionVerdict(state);

      state.probeEastRunComplete = "true";
      state.probeEastRunStatus = "COMPLETE";
      state.probeEastStatus = "COMPLETE";
      state.PROBE_EAST_STATUS = "COMPLETE";
      state.updatedAt = nowIso();

      addNote(state, "PROBE_EAST_SOURCE_SIDE_FILE_COMPOSITION_READ_COMPLETE");
      addNote(state, "PROBE_EAST_BRIDGE_SURFACE_COMPOSITION_READ_COMPLETE");
      addNote(state, "PROBE_EAST_ANCHOR_SAFE_OBSERVATION_COMPLETE");
      addNote(state, "PROBE_EAST_NO_REPAIR_NO_MUTATION_NO_RELEASE");

      publish(state);
      return clonePlain(lastEvidencePacket);
    } catch (error) {
      state.probeEastStatus = "FAILED";
      state.PROBE_EAST_STATUS = "FAILED";
      state.probeEastRunComplete = "false";
      state.probeEastRunStatus = "FAILED";
      state.targetAccessError = `PROBE_EAST_TOP_LEVEL_ERROR:${clean(error && error.message ? error.message : error, 1000)}`;
      state.fileCompositionStatus = "FAILED";
      state.bridgeSurfaceCompositionStatus = "FAILED";
      state.canvasExpressionInstrumentationStatus = "FAILED";
      state.zoneOfInflictionOwner = "PROBE_EAST_ERROR";
      state.zoneOfInflictionFile = FILE;
      state.zoneOfInflictionClass = "PROBE_EAST_RUNTIME_ERROR";
      state.zoneOfInflictionReason = state.targetAccessError;
      addNote(state, state.targetAccessError);

      state.updatedAt = nowIso();
      publish(state);

      return clonePlain(lastEvidencePacket);
    }
  }

  function getProbeEastReceipt() {
    const evidence = lastEvidencePacket || makeEvidencePacket(makeState());

    return {
      childRole: "PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      implementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      parentNorthContract: PARENT_NORTH_CONTRACT,
      parentNorthReceipt: PARENT_NORTH_RECEIPT,
      previousParentNorthContract: PREVIOUS_PARENT_NORTH_CONTRACT,
      railEastContract: RAIL_EAST_CONTRACT,
      railEastImplementationContract: RAIL_EAST_IMPLEMENTATION_CONTRACT,

      anchorStatus: evidence.PROBE_EAST_ANCHOR_STATUS || "ANCHOR_PUBLISHED_SYNCHRONOUSLY",
      anchorObserved: true,
      anchorSourcePathPrimary: "HEARTH.diagnosticProbeEast",
      chronologyObservationGuard: "PUBLIC_AUTHORITY_PUBLISHED_BEFORE_TARGET_PROBE",
      chronologyFailureClassAddressed: "SCRIPT_ALREADY_PRESENT_AUTHORITY_NOT_OBSERVED",

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

      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,

      runProbeEastApiAvailable: true,
      getProbeEastReceiptApiAvailable: true,
      getProbeEastStateApiAvailable: true,

      lastProbeEastStatus: evidence.PROBE_EAST_STATUS || "READY",
      lastProbeEastRunStatus: evidence.PROBE_EAST_RUN_STATUS || "UNKNOWN",
      lastSourceSideCurrentSpreadStatus: evidence.SOURCE_SIDE_CURRENT_SPREAD_STATUS || "UNKNOWN",
      lastFileCompositionStatus: evidence.FILE_COMPOSITION_STATUS || "UNKNOWN",
      lastBridgeSurfaceCompositionStatus: evidence.BRIDGE_SURFACE_COMPOSITION_STATUS || "UNKNOWN",
      lastCanvasExpressionInstrumentationStatus: evidence.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS || "UNKNOWN",
      lastZoneOfInflictionOwner: evidence.ZONE_OF_INFLICTION_OWNER || "UNKNOWN",
      lastZoneOfInflictionFile: evidence.ZONE_OF_INFLICTION_FILE || FILE,
      lastZoneOfInflictionClass: evidence.ZONE_OF_INFLICTION_CLASS || "UNKNOWN",
      lastProbeEastDisposition: evidence.PROBE_EAST_DISPOSITION || "UNKNOWN",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,

      updatedAt: nowIso()
    };
  }

  function getProbeEastState() {
    return clonePlain(lastState || makeState());
  }

  function getReceipt() {
    return getProbeEastReceipt();
  }

  function getReceiptLight() {
    return getProbeEastReceipt();
  }

  function getState() {
    return getProbeEastState();
  }

  function getReport() {
    return {
      receipt: getProbeEastReceipt(),
      evidence: clonePlain(lastEvidencePacket || makeEvidencePacket(makeState())),
      state: getProbeEastState()
    };
  }

  function getStatusText() {
    const evidence = lastEvidencePacket || makeEvidencePacket(makeState());

    return [
      "HEARTH_DIAGNOSTIC_PROBE_EAST_ANCHOR_SAFE_STATUS",
      `contract=${CONTRACT}`,
      `receipt=${RECEIPT}`,
      `implementationContract=${INTERNAL_IMPLEMENTATION_CONTRACT}`,
      `file=${FILE}`,
      `anchorStatus=${evidence.PROBE_EAST_ANCHOR_STATUS}`,
      `anchorObserved=${evidence.PROBE_EAST_ANCHOR_OBSERVED}`,
      `probeEastStatus=${evidence.PROBE_EAST_STATUS}`,
      `probeEastRunStatus=${evidence.PROBE_EAST_RUN_STATUS}`,
      `targetAccessStatus=${evidence.TARGET_ACCESS_STATUS}`,
      `fileCompositionStatus=${evidence.FILE_COMPOSITION_STATUS}`,
      `bridgeSurfaceCompositionStatus=${evidence.BRIDGE_SURFACE_COMPOSITION_STATUS}`,
      `zoneOfInflictionOwner=${evidence.ZONE_OF_INFLICTION_OWNER}`,
      `zoneOfInflictionFile=${evidence.ZONE_OF_INFLICTION_FILE}`,
      `zoneOfInflictionClass=${evidence.ZONE_OF_INFLICTION_CLASS}`,
      "f13Claimed=false",
      "f21EligibleForNorth=false",
      "readyTextAllowed=false",
      "visualPassClaimed=false",
      "generatedImage=false",
      "graphicBox=false",
      "webGL=false"
    ].join("\n");
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    implementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    parentNorthContract: PARENT_NORTH_CONTRACT,
    parentNorthReceipt: PARENT_NORTH_RECEIPT,
    previousParentNorthContract: PREVIOUS_PARENT_NORTH_CONTRACT,
    railEastContract: RAIL_EAST_CONTRACT,
    railEastImplementationContract: RAIL_EAST_IMPLEMENTATION_CONTRACT,

    files: clonePlain(FILES),
    targetSelectors: clonePlain(TARGET_SELECTORS),
    globalPaths: clonePlain(GLOBAL_PATHS),
    fingerPaths: clonePlain(FINGER_PATHS),

    anchorStatus: "ANCHOR_PUBLISHED_SYNCHRONOUSLY",
    anchorObserved: true,
    anchorSourcePathPrimary: "HEARTH.diagnosticProbeEast",
    chronologyObservationGuard: "PUBLIC_AUTHORITY_PUBLISHED_BEFORE_TARGET_PROBE",
    chronologyFailureClassAddressed: "SCRIPT_ALREADY_PRESENT_AUTHORITY_NOT_OBSERVED",

    runProbeEast,
    getProbeEastReceipt,
    getProbeEastState,
    getReceipt,
    getReceiptLight,
    getStatus: getReceiptLight,
    getState,
    getReport,
    getStatusText,

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
    supportsAnchorSafeChronologyObservation: true,

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

    diagnosticRouteHtmlRenewalRequired: false,
    receiverStillCallsNorthOnly: true,
    productionMutationAuthorized: false,
    cacheRepairAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

    get evidence() {
      return clonePlain(lastEvidencePacket || makeEvidencePacket(makeState()));
    },

    get state() {
      return getProbeEastState();
    }
  });

  publish(makeState("ANCHOR_PUBLISHED_WAITING_RUN"));

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
