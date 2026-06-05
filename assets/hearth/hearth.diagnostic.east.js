// /assets/hearth/hearth.diagnostic.east.js
// HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1
// Full-file replacement.
// Internal implementation:
// HEARTH_DIAGNOSTIC_EAST_CURRENT_SERVED_SPREAD_BISHOP_CANVAS_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v7
// Purpose:
// - Preserve EAST as served-source evidence only.
// - Recognize current Hearth HTML v5_1 and Route Conductor v9_9 without false CASE_5.
// - Preserve v4/v5_4/v9_7/v9_6/v9_5/v9_4 lineage as accepted transition where source evidence proves it.
// - Treat route-conductor rendered/global authority as stronger than script cache query text.
// - Preserve planetary-control footprint fields before or after /assets/hearth/hearth.controls.js exists.
// - Treat missing controls as EXPECTED_NOT_YET_BUILT, not failure, not CASE_5.
// - Add Lab Runtime Table, Macro West, Canvas Local Station, bishop hub, and modern finger source-footprint language.
// - Preserve NORTH as final PRIMARY_CASE and recommendation authority.
// - Preserve WEST as rendered-target authority.
// - Preserve SOUTH as report-output authority.
// - Preserve no repair, no cache mutation, no F13, no F21, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CURRENT_SERVED_SPREAD_BISHOP_CANVAS_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v7";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_EAST_CURRENT_SERVED_SPREAD_BISHOP_CANVAS_SOURCE_FOOTPRINT_ALIGNMENT_RECEIPT_v7";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_LAB_CANVAS_BRIDGE_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v6";
  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_PLANETARY_CONTROL_FOOTPRINT_SOURCE_READER_TNT_v5";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";

  const VERSION =
    "2026-06-05.hearth-diagnostic-east-current-served-spread-bishop-canvas-source-footprint-alignment-v7";

  const FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CURRENT_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const PREVIOUS_HTML_CONTRACT =
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4";
  const FOUNDATION_HTML_CONTRACT =
    "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3";
  const DIAGNOSTIC_RECEIVER_CONTRACT =
    "HEARTH_DIAGNOSTIC_ROUTE_PLANETARY_BUILD_OBSERVER_RECEIVER_TNT_v2_2";

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    CURRENT_HTML_CONTRACT,
    PREVIOUS_HTML_CONTRACT,
    FOUNDATION_HTML_CONTRACT,
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5",
    "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const CURRENT_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const ACCEPTED_INDEX_JS_CONTRACTS = Object.freeze([
    CURRENT_INDEX_JS_CONTRACT,
    "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2",
    "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1",
    "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3"
  ]);

  const CURRENT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7";
  const NEWS_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const COMPAT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const LINEAGE_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT,
    NEWS_ROUTE_CONDUCTOR_CONTRACT,
    COMPAT_ROUTE_CONDUCTOR_CONTRACT,
    LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_OWNERSHIP_PASSIVE_WATCHDOG_REPAIR_TNT_v9_3",
    "HEARTH_ROUTE_CONDUCTOR_NORTH_STAR_COMPLETION_CYCLE_GOVERNOR_TNT_v9_2"
  ]);

  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEARTH_JS_CONTROL_FUNNEL_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_JS_FILE = "/showroom/globe/hearth/index.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const MACRO_WEST_HANDOFF_FILE = "/assets/hearth/hearth.west.index-handoff.table.js";

  const LAB_FILES = Object.freeze({
    north: "/assets/lab/runtime-table.js",
    east: "/assets/lab/runtime-table.east.js",
    south: "/assets/lab/runtime-table.south.js",
    west: "/assets/lab/runtime-table.west.js"
  });

  const MODERN_FINGER_FILES = Object.freeze({
    boundary: "/assets/hearth/hearth.canvas.finger.boundary.js",
    mass: "/assets/hearth/hearth.canvas.finger.mass.js",
    surfacePointer: "/assets/hearth/hearth.canvas.finger.surface.js",
    light: "/assets/hearth/hearth.canvas.finger.light.js",
    inspect: "/assets/hearth/hearth.canvas.finger.inspect.js",
    composite: "/assets/hearth/hearth.canvas.finger.composite.js"
  });

  const LEGACY_FINGER_FILES = Object.freeze({
    landform: "/assets/hearth/hearth.canvas.finger.landform.js",
    elevation: "/assets/hearth/hearth.canvas.finger.elevation.js",
    material: "/assets/hearth/hearth.canvas.finger.material.js",
    hydrology: "/assets/hearth/hearth.canvas.finger.hydrology.js",
    atmosphere: "/assets/hearth/hearth.canvas.finger.atmosphere.js",
    lighting: "/assets/hearth/hearth.canvas.finger.lighting.js"
  });

  const FINGER_FILES = Object.freeze({
    ...MODERN_FINGER_FILES,
    ...LEGACY_FINGER_FILES
  });

  const LAB_GLOBALS = Object.freeze({
    north: [
      "LAB_RUNTIME_TABLE",
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_CARDINAL_RUNTIME_TABLE_NORTH",
      "LAB_CENTRAL_TRAIN_STATION",
      "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND",
      "HEARTH.northCommandRuntimeTable",
      "HEARTH.northCentralTrainStation",
      "HEARTH.centralTrainStation",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.centralTrainStation",
      "DEXTER_LAB.northCentralTrainStation"
    ],
    east: [
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "LAB_CARDINAL_RUNTIME_TABLE_EAST",
      "LAB_CHECKPOINT_GOVERNOR_EAST",
      "HEARTH_EAST_FIBONACCI_MAGNIFIER",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.checkpointGovernorEast"
    ],
    south: [
      "LAB_RUNTIME_TABLE_SOUTH_PRIMARY_GATE",
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "LAB_CARDINAL_RUNTIME_TABLE_SOUTH",
      "LAB_VISIBLE_STATE_COMPOSER_SOUTH",
      "HEARTH_RUNTIME_TABLE_SOUTH",
      "HEARTH_SOUTH",
      "HEARTH_VISIBLE_STATE_COMPOSER",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.south",
      "DEXTER_LAB.visibleStateComposer",
      "DEXTER_LAB.southPrimaryGate"
    ],
    west: [
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "LAB_CARDINAL_RUNTIME_TABLE_WEST",
      "LAB_GAP_CLASSIFIER_WEST",
      "LAB_TRANSMISSION_GAP_CLASSIFIER_WEST",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "HEARTH_RUNTIME_TABLE_WEST",
      "HEARTH_WEST_ADMISSIBILITY",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.gapClassifierWest",
      "DEXTER_LAB.transmissionGapClassifierWest",
      "DEXTER_LAB.westAdmissibility"
    ]
  });

  const MACRO_WEST_GLOBALS = Object.freeze([
    "HEARTH_WEST_INDEX_HANDOFF_TABLE",
    "HEARTH_WEST_INDEX_HANDOFF",
    "HEARTH.westIndexHandoffTable",
    "HEARTH.westIndexHandoff",
    "HEARTH.macroWestBridge",
    "HEARTH.westBishopCanvasBridge",
    "DEXTER_LAB.hearthWestIndexHandoffTable",
    "DEXTER_LAB.hearthMacroWestBridge",
    "LAB_RUNTIME_TABLE_WEST",
    "LAB_GAP_CLASSIFIER_WEST",
    "DEXTER_LAB.runtimeTableWest",
    "DEXTER_LAB.gapClassifierWest",
    "DEXTER_LAB.westAdmissibility"
  ]);

  const CANVAS_GLOBALS = Object.freeze({
    parent: [
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS_STATION",
      "HEARTH_CANVAS_CHILD_DISTRIBUTION_SWITCHBOARD",
      "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER",
      "HEARTH_CANVAS_VISIBLE_BASE_GLOBE_CARRIER",
      "HEARTH_CANVAS_BASE_GLOBE_CARRIER",
      "HEARTH_CANVAS_VISIBLE_PLANET",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_FINGER_MANAGER",
      "HEARTH_CANVAS",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasStation",
      "HEARTH.canvasChildDistributionSwitchboard",
      "HEARTH.canvasExpressionHubVisibleBaseGlobeCarrier",
      "HEARTH.canvasVisibleBaseGlobeCarrier",
      "HEARTH.canvasVisiblePlanet",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasFingerManager",
      "HEARTH.canvas",
      "DEXTER_LAB.hearthCanvasLocalStation",
      "DEXTER_LAB.hearthCanvasStation",
      "DEXTER_LAB.hearthCanvasChildDistributionSwitchboard",
      "DEXTER_LAB.hearthCanvas"
    ],
    north: [
      "HEARTH_CANVAS_NORTH",
      "HEARTH.canvasNorth",
      "HEARTH.canvasParentGovernedF13EvidenceReceiver",
      "HEARTH.canvasParentChildReconciliationF13EvidenceReceiver",
      "DEXTER_LAB.hearthCanvasNorth",
      "DEXTER_LAB.hearthCanvasParentGovernedF13EvidenceReceiver"
    ],
    east: [
      "HEARTH_CANVAS_EAST",
      "HEARTH.canvasEast",
      "HEARTH.canvasEastMaterialAtlasSourceMachine",
      "HEARTH.canvasEastMaterialAtlasSourceTransistor",
      "DEXTER_LAB.hearthCanvasEast",
      "DEXTER_LAB.hearthCanvasEastMaterialAtlasSourceMachine"
    ],
    south: [
      "HEARTH_CANVAS_SOUTH",
      "HEARTH.canvasSouth",
      "HEARTH.canvasSouthF13SStrictVisibleProofClassifierChild",
      "DEXTER_LAB.hearthCanvasSouth",
      "DEXTER_LAB.hearthCanvasSouthF13SStrictVisibleProofClassifierChild"
    ],
    west: [
      "HEARTH_CANVAS_WEST",
      "HEARTH.canvasWest",
      "HEARTH.canvasWestInspectionInvalidationControl",
      "DEXTER_LAB.hearthCanvasWest",
      "DEXTER_LAB.hearthCanvasWestInspectionInvalidationControl"
    ]
  });

  const BISHOP_HUBS = Object.freeze({
    north: {
      file: "/assets/hearth/hearth.bishop.north.js",
      globals: [
        "HEARTH_BISHOP_NORTH",
        "HEARTH_NORTH_BISHOP",
        "HEARTH.bishopNorth",
        "HEARTH.northBishop",
        "HEARTH.bishops.north",
        "DEXTER_LAB.hearthBishopNorth"
      ]
    },
    east: {
      file: "/assets/hearth/hearth.bishop.east.js",
      globals: [
        "HEARTH_BISHOP_EAST",
        "HEARTH_EAST_BISHOP",
        "HEARTH.bishopEast",
        "HEARTH.eastBishop",
        "HEARTH.bishops.east",
        "DEXTER_LAB.hearthBishopEast"
      ]
    },
    south: {
      file: "/assets/hearth/hearth.bishop.south.js",
      globals: [
        "HEARTH_BISHOP_SOUTH",
        "HEARTH_SOUTH_BISHOP",
        "HEARTH.bishopSouth",
        "HEARTH.southBishop",
        "HEARTH.bishops.south",
        "DEXTER_LAB.hearthBishopSouth"
      ]
    },
    west: {
      file: "/assets/hearth/hearth.bishop.west.js",
      globals: [
        "HEARTH_BISHOP_WEST",
        "HEARTH_WEST_BISHOP",
        "HEARTH.bishopWest",
        "HEARTH.westBishop",
        "HEARTH.bishops.west",
        "DEXTER_LAB.hearthBishopWest"
      ]
    }
  });

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NOT_FOUND: "NOT_FOUND",
    BLOCKED: "BLOCKED",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
    EXPECTED: "EXPECTED",
    EXPECTED_NOT_YET_BUILT: "EXPECTED_NOT_YET_BUILT",
    EXPECTED_NOT_YET_WIRED: "EXPECTED_NOT_YET_WIRED",
    EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST: "EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST",
    BRIDGE_NOT_CONFIRMED_BY_EAST: "BRIDGE_NOT_CONFIRMED_BY_EAST",
    WAITING_CONTROL_FILE: "WAITING_CONTROL_FILE",
    READY: "READY",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    COMPLETE: "COMPLETE",
    HELD: "HELD",
    NONE: "none"
  });

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED"
  });

  const SUPPORT = Object.freeze({
    TRUE: "true",
    FALSE: "false",
    UNKNOWN: FALLBACK.UNKNOWN,
    INSUFFICIENT_EVIDENCE: FALLBACK.INSUFFICIENT_EVIDENCE
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

  function safeTrim(value, fallback = "") {
    return safeString(value, fallback).replace(/\s+/g, " ").trim();
  }

  function bounded(value, limit = 2400) {
    return safeTrim(value).slice(0, limit);
  }

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
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
    const clean = bounded(note, 1600);
    if (!state || !Array.isArray(state.eastSecondaryEvidenceNotes) || !clean) return;
    if (!state.eastSecondaryEvidenceNotes.includes(clean)) state.eastSecondaryEvidenceNotes.push(clean);
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
      return targetDocument && targetDocument.body ? targetDocument.body.dataset || {} : {};
    } catch (_error) {
      return {};
    }
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
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

  function scriptMatches(script, path, targetWindow) {
    const src = normalizeSrc(script && script.getAttribute ? script.getAttribute("src") : "", targetWindow);
    if (!src) return false;

    const cleanPath = safeString(path);
    const fileName = cleanPath.split("/").filter(Boolean).pop();

    return Boolean(
      src.includes(cleanPath) ||
      (fileName && src.endsWith(`/${fileName}`)) ||
      (fileName && src.includes(`/${fileName}?`))
    );
  }

  function findScriptByPaths(targetDocument, paths, targetWindow) {
    const scripts = qa(targetDocument, "script[src]");
    return scripts.find((script) => paths.some((path) => scriptMatches(script, path, targetWindow))) || null;
  }

  function readCacheKeyFromSrc(src, targetWindow) {
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

  function contractRecognized(contract, accepted) {
    const c = safeString(contract);

    if (!c || c === FALLBACK.UNKNOWN || c === FALLBACK.NOT_FOUND || c === FALLBACK.UNREADABLE) {
      return FALLBACK.UNKNOWN;
    }

    return accepted.includes(c) ? "true" : "false";
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getRoutePrimaryGateReceipt",
      "getRouteCycleReceipt",
      "getCentralStationReceiptLight",
      "getCentralStationReceipt",
      "getCanvasStationSummary",
      "getCanvasStationReceiptLight",
      "getControlsReceipt",
      "getState",
      "getStatus",
      "getReport"
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

    return null;
  }

  function readAuthorityContract(authority) {
    if (!authority || !isObject(authority)) return "";

    const receipt = readAuthorityReceipt(authority) || {};

    return safeString(firstDefined(
      receipt.contract,
      receipt.CONTRACT,
      receipt.currentContract,
      receipt.currentRouteConductorContract,
      receipt.routeConductorContract,
      receipt.canvasContract,
      receipt.controlsContract,
      receipt.implementationContract,
      receipt.stationReceipt,
      authority.contract,
      authority.CONTRACT,
      authority.currentContract,
      authority.currentRouteConductorContract,
      authority.routeConductorContract,
      authority.canvasContract,
      authority.controlsContract,
      authority.implementationContract
    ), "");
  }

  function findWindowAuthority(targetWindow, paths) {
    const win = targetWindow || root;

    for (const path of paths) {
      const value = readPath(win, path);
      if (value && isObject(value)) {
        return {
          path,
          authority: value,
          contract: readAuthorityContract(value),
          receipt: readAuthorityReceipt(value)
        };
      }
    }

    return { path: "NONE", authority: null, contract: "", receipt: null };
  }

  function readScriptFootprint(targetDocument, targetWindow, file) {
    const script = targetDocument ? findScriptByPaths(targetDocument, [file, file.split("/").pop()], targetWindow) : null;
    const src = script ? normalizeSrc(script.getAttribute("src"), targetWindow) : FALLBACK.NOT_FOUND;
    const cacheKey = script ? readCacheKeyFromSrc(script.getAttribute("src"), targetWindow) : "";

    return {
      script,
      present: Boolean(script),
      src,
      cacheKey
    };
  }

  function classifySourcePresence(scriptPresent, authorityFound, contract) {
    if (authorityFound && contract) return "AUTHORITY_AND_CONTRACT_PRESENT";
    if (authorityFound) return "AUTHORITY_PRESENT";
    if (scriptPresent) return "SCRIPT_PRESENT";
    return FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST;
  }

  function findRouteConductorAuthority(targetWindow) {
    const found = findWindowAuthority(targetWindow, [
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION",
      "HEARTH.routeConductorControlHandshakeIntegration",
      "DEXTER_LAB.hearthRouteConductorControlHandshakeIntegration",
      "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION",
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_SOUTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION",
      "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT",
      "HEARTH.routeConductorNewsFibonacciVisibleGlobeProofSynchronization",
      "HEARTH.routeConductor",
      "HEARTH.southRouteConductor",
      "HEARTH.routeConductorCanvasExpressionHubVisibleGlobeProofIngestion",
      "HEARTH.routeConductorCanvasLocalStationBridgeAlignment",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthSouthRouteConductor"
    ]);

    if (found.authority || found.contract) return found;

    try {
      const markerContract = safeString((targetWindow || root).__HEARTH_ROUTE_CONDUCTOR_CONTRACT__ || "");
      if (markerContract) {
        return {
          path: "__HEARTH_ROUTE_CONDUCTOR_CONTRACT__",
          authority: null,
          contract: markerContract,
          receipt: null
        };
      }
    } catch (_error) {}

    return found;
  }

  function findIndexAuthority(targetWindow) {
    return findWindowAuthority(targetWindow, [
      "HEARTH_INDEX_JS",
      "HEARTH_INDEX_BRIDGE",
      "HEARTH_FRONTEND_BUTTON_AUTHORITY_RESET",
      "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET",
      "HEARTH.indexJs",
      "HEARTH.indexBridge",
      "HEARTH.frontendButtonAuthorityReset",
      "HEARTH.buttonAuthority",
      "DEXTER_LAB.hearthIndexJs",
      "DEXTER_LAB.hearthFrontendButtonAuthorityReset"
    ]);
  }

  function findControlsAuthority(targetWindow) {
    return findWindowAuthority(targetWindow, [
      "HEARTH_CONTROLS",
      "HEARTH_PLANET_CONTROLS",
      "HEARTH_MOTION_TOUCH_CONTROLS",
      "HEARTH.controls",
      "HEARTH.planetControls",
      "HEARTH.motionTouchControls",
      "HEARTH.viewControls",
      "HEARTH.hearthControls",
      "DEXTER_LAB.hearthControls",
      "DEXTER_LAB.hearthPlanetControls",
      "DEXTER_LAB.hearthMotionTouchControls"
    ]);
  }

  function findCanvasAuthority(targetWindow) {
    return findWindowAuthority(targetWindow, CANVAS_GLOBALS.parent);
  }

  function routeMatches(targetWindow) {
    try {
      const win = targetWindow || root;
      const path = win.location && win.location.pathname ? win.location.pathname : "";
      return path === TARGET_ROUTE || path === TARGET_ROUTE.replace(/\/$/, "");
    } catch (_error) {
      return false;
    }
  }

  function diagnosticRouteMatches(targetWindow) {
    try {
      const win = targetWindow || root;
      const path = win.location && win.location.pathname ? win.location.pathname : "";
      return path === DIAGNOSTIC_ROUTE || path === DIAGNOSTIC_ROUTE.replace(/\/$/, "");
    } catch (_error) {
      return false;
    }
  }

  function documentRoute(targetDocument) {
    try {
      const dataset = readDataset(targetDocument);
      const bodyDataset = readBodyDataset(targetDocument);
      return safeString(firstDefined(
        dataset.route,
        targetDocument.documentElement && targetDocument.documentElement.getAttribute("data-route"),
        bodyDataset.route
      ), "");
    } catch (_error) {
      return "";
    }
  }

  function isDiagnosticReceiverDocument(targetDocument, targetWindow) {
    const route = documentRoute(targetDocument);
    const dataset = readDataset(targetDocument);
    const contract = safeString(firstDefined(
      dataset.contract,
      targetDocument && targetDocument.documentElement
        ? targetDocument.documentElement.getAttribute("data-contract")
        : ""
    ), "");

    return Boolean(
      diagnosticRouteMatches(targetWindow) ||
      route === DIAGNOSTIC_ROUTE ||
      route === DIAGNOSTIC_ROUTE.replace(/\/$/, "") ||
      contract === DIAGNOSTIC_RECEIVER_CONTRACT ||
      /diagnostic/i.test(safeString(dataset.page || ""))
    );
  }

  function hasHearthSignals(targetDocument, targetWindow) {
    try {
      if (!targetDocument || !targetDocument.documentElement) return false;
      if (isDiagnosticReceiverDocument(targetDocument, targetWindow)) return false;

      const html = targetDocument.documentElement;
      const body = targetDocument.body;
      const htmlData = readDataset(targetDocument);
      const bodyData = readBodyDataset(targetDocument);

      const route = safeString(html.getAttribute("data-route") || htmlData.route || "");
      const page = safeString(html.getAttribute("data-page") || htmlData.page || "");
      const alias = safeString(html.getAttribute("data-page-alias") || htmlData.pageAlias || "");
      const context = safeString(html.getAttribute("data-page-context") || htmlData.pageContext || "");
      const bodyRoute = body ? safeString(body.getAttribute("data-route") || bodyData.route || "") : "";

      return Boolean(
        route === TARGET_ROUTE ||
        route === TARGET_ROUTE.replace(/\/$/, "") ||
        bodyRoute === TARGET_ROUTE ||
        bodyRoute === TARGET_ROUTE.replace(/\/$/, "") ||
        routeMatches(targetWindow) ||
        /hearth/i.test(page) ||
        /hearth/i.test(alias) ||
        /planet factory|planet engine|mirrorland formation|visible globe|visible planet/i.test(context) ||
        q(targetDocument, "#hearthCanvasMount") ||
        q(targetDocument, "[data-hearth-canvas-mount]") ||
        q(targetDocument, "#hearthGlobeStage") ||
        q(targetDocument, "[data-hearth-globe-stage]")
      );
    } catch (_error) {
      return false;
    }
  }

  function findDiagnosticTargetFrame(sourceDocument) {
    if (!sourceDocument) return null;

    return (
      q(sourceDocument, "#hearthDiagnosticTargetFrame") ||
      q(sourceDocument, "iframe[data-hearth-diagnostic-target-frame='true']") ||
      q(sourceDocument, "iframe[src='/showroom/globe/hearth/']") ||
      q(sourceDocument, "iframe[src*='/showroom/globe/hearth/']")
    );
  }

  function readFrame(frame, state) {
    try {
      if (!frame) return null;

      const targetWindow = frame.contentWindow || null;
      const targetDocument = targetWindow ? targetWindow.document : null;

      if (targetDocument && targetDocument.documentElement) {
        return {
          targetDocument,
          targetWindow,
          source: "diagnosticTargetFrame"
        };
      }

      addNote(state, "EAST_TARGET_FRAME_FOUND_BUT_DOCUMENT_INACCESSIBLE");
      return null;
    } catch (error) {
      addNote(state, `EAST_TARGET_FRAME_BLOCKED:${bounded(error && error.message ? error.message : error, 700)}`);
      return null;
    }
  }

  function resolveTargetDocument(options, state) {
    const opts = options || {};

    if (opts.targetDocument && opts.targetDocument.documentElement) {
      const targetWindow = opts.targetDocument.defaultView || opts.targetWindow || null;

      if (!isDiagnosticReceiverDocument(opts.targetDocument, targetWindow)) {
        state.diagnosticTargetAccessStatus = "SOURCE_TARGET_DOCUMENT_SUPPLIED";
        return { targetDocument: opts.targetDocument, targetWindow, source: "options.targetDocument" };
      }

      addNote(state, "EAST_IGNORED_SUPPLIED_DIAGNOSTIC_RECEIVER_DOCUMENT_AS_TARGET");
    }

    if (opts.targetWindow) {
      try {
        const targetWindow = opts.targetWindow;
        const targetDocument = targetWindow.document;

        if (targetDocument && targetDocument.documentElement && !isDiagnosticReceiverDocument(targetDocument, targetWindow)) {
          state.diagnosticTargetAccessStatus = "SOURCE_TARGET_WINDOW_SUPPLIED";
          return { targetDocument, targetWindow, source: "options.targetWindow" };
        }

        addNote(state, "EAST_IGNORED_SUPPLIED_DIAGNOSTIC_RECEIVER_WINDOW_AS_TARGET");
      } catch (error) {
        state.diagnosticTargetAccessStatus = "TARGET_WINDOW_BLOCKED";
        state.diagnosticTargetAccessError = `TARGET_WINDOW_BLOCKED:${bounded(error && error.message ? error.message : error, 700)}`;
        addNote(state, state.diagnosticTargetAccessError);
      }
    }

    if (opts.frameElement) {
      const fromOptionFrame = readFrame(opts.frameElement, state);

      if (fromOptionFrame && !isDiagnosticReceiverDocument(fromOptionFrame.targetDocument, fromOptionFrame.targetWindow)) {
        state.diagnosticTargetAccessStatus = "SOURCE_TARGET_FRAME_SUPPLIED";
        return fromOptionFrame;
      }
    }

    const diagnosticFrame = findDiagnosticTargetFrame(doc);
    const fromDiscoveredFrame = readFrame(diagnosticFrame, state);

    if (fromDiscoveredFrame && !isDiagnosticReceiverDocument(fromDiscoveredFrame.targetDocument, fromDiscoveredFrame.targetWindow)) {
      state.diagnosticTargetAccessStatus = "SOURCE_DISCOVERED_DIAGNOSTIC_TARGET_FRAME";
      return fromDiscoveredFrame;
    }

    if (doc && doc.documentElement && !isDiagnosticReceiverDocument(doc, root) && (routeMatches(root) || hasHearthSignals(doc, root))) {
      state.diagnosticTargetAccessStatus = "SOURCE_CURRENT_HEARTH_DOCUMENT";
      return { targetDocument: doc, targetWindow: root, source: "currentHearthDocument" };
    }

    state.diagnosticTargetAccessStatus = "SOURCE_ONLY_NO_HEARTH_TARGET_DOCUMENT";
    state.diagnosticTargetAccessError = "NO_HEARTH_TARGET_DOCUMENT_AVAILABLE_TO_EAST";
    addNote(state, "EAST_SOURCE_ONLY_BASELINE_NO_HEARTH_TARGET_DOCUMENT_AVAILABLE");

    return { targetDocument: null, targetWindow: null, source: "none" };
  }

  function readHtmlEvidence(targetDocument, targetWindow, state) {
    if (!targetDocument || !targetDocument.documentElement) {
      state.expectedHtmlContract = CURRENT_HTML_CONTRACT;
      state.currentExpectedHtmlContract = CURRENT_HTML_CONTRACT;
      state.servedHtmlContract = FALLBACK.UNKNOWN;
      state.htmlContractRecognized = FALLBACK.UNKNOWN;
      return;
    }

    const html = targetDocument.documentElement;
    const dataset = readDataset(targetDocument);
    const bodyDataset = readBodyDataset(targetDocument);

    const served = safeString(firstDefined(
      dataset.contract,
      dataset.hearthHtmlContract,
      dataset.hearthShellContract,
      html.getAttribute("data-contract"),
      bodyDataset.hearthHtmlContract
    ), FALLBACK.UNKNOWN);

    state.expectedHtmlContract = CURRENT_HTML_CONTRACT;
    state.currentExpectedHtmlContract = CURRENT_HTML_CONTRACT;
    state.previousHtmlContract = PREVIOUS_HTML_CONTRACT;
    state.foundationHtmlContract = FOUNDATION_HTML_CONTRACT;
    state.servedHtmlContract = served;

    if (served === DIAGNOSTIC_RECEIVER_CONTRACT || isDiagnosticReceiverDocument(targetDocument, targetWindow)) {
      state.htmlContractRecognized = FALLBACK.UNKNOWN;
      state.servedHtmlContract = FALLBACK.UNKNOWN;
      addNote(state, "DIAGNOSTIC_RECEIVER_HTML_CONTRACT_IGNORED_AS_NON_TARGET_SOURCE");
    } else {
      state.htmlContractRecognized = contractRecognized(served, ACCEPTED_HTML_CONTRACTS);
    }

    if (state.htmlContractRecognized === "true") {
      if (served === CURRENT_HTML_CONTRACT) addNote(state, "HTML_CONTRACT_RECOGNIZED_CURRENT_V5_1");
      else addNote(state, "HTML_CONTRACT_RECOGNIZED_ACCEPTED_LINEAGE");
    } else if (state.htmlContractRecognized === "false") {
      addNote(state, `HTML_CONTRACT_UNRECOGNIZED:${served}`);
    }

    state.targetRouteSignal = safeString(firstDefined(
      dataset.route,
      html.getAttribute("data-route"),
      bodyDataset.route
    ), FALLBACK.UNKNOWN);

    state.planetContextSignal = safeString(firstDefined(
      dataset.pageContext,
      html.getAttribute("data-page-context"),
      dataset.publicFacingPurpose,
      bodyDataset.pageContext
    ), FALLBACK.UNKNOWN);
  }

  function readIndexEvidence(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const indexAuthority = findIndexAuthority(targetWindow);
    const script = target
      ? findScriptByPaths(target, [INDEX_JS_FILE, "index.js"], targetWindow)
      : null;

    const src = script ? normalizeSrc(script.getAttribute("src"), targetWindow) : FALLBACK.NOT_FOUND;
    const cacheKey = script ? readCacheKeyFromSrc(script.getAttribute("src"), targetWindow) : "";
    const dataset = target ? readDataset(target) : {};
    const authorityContract = indexAuthority.contract || "";

    const scriptContract = safeString(firstDefined(
      script && script.dataset ? script.dataset.hearthIndexJsContract : "",
      script && script.dataset ? script.dataset.jsSelectorCacheKey : "",
      script && script.dataset ? script.dataset.hearthDiagnosticExpectedContract : "",
      cacheKey,
      dataset.hearthIndexJsContract,
      dataset.expectedIndexJsContract,
      dataset.selectorCacheBust
    ), "");

    const served = safeString(firstDefined(
      authorityContract,
      scriptContract,
      dataset.hearthIndexJsContract,
      dataset.expectedIndexJsContract
    ), FALLBACK.UNKNOWN);

    state.expectedIndexJsContract = CURRENT_INDEX_JS_CONTRACT;
    state.currentExpectedIndexJsContract = CURRENT_INDEX_JS_CONTRACT;
    state.servedIndexJsContract = served;
    state.indexScriptSrc = src;
    state.indexScriptPresent = boolText(Boolean(script));
    state.indexAuthoritySource = indexAuthority.path;
    state.indexContractRecognized = contractRecognized(served, ACCEPTED_INDEX_JS_CONTRACTS);

    if (state.indexContractRecognized === "true") {
      addNote(state, "INDEX_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
    } else if (state.indexContractRecognized === "false") {
      addNote(state, `INDEX_CONTRACT_UNRECOGNIZED:${served}`);
    }

    if (!script && !authorityContract) {
      addNote(state, "INDEX_SCRIPT_OR_AUTHORITY_NOT_FOUND_IN_HEARTH_TARGET");
    }
  }

  function readRouteConductorEvidence(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const conductor = findRouteConductorAuthority(targetWindow);
    const script = target
      ? findScriptByPaths(target, [HEARTH_JS_CONTROL_FUNNEL_FILE, "hearth.js"], targetWindow)
      : null;

    const src = script ? normalizeSrc(script.getAttribute("src"), targetWindow) : FALLBACK.NOT_FOUND;
    const cacheKey = script ? readCacheKeyFromSrc(script.getAttribute("src"), targetWindow) : "";
    const dataset = target ? readDataset(target) : {};
    const authorityContract = conductor.contract || "";

    const scriptContract = safeString(firstDefined(
      script && script.dataset ? script.dataset.routeConductorCurrentContract : "",
      script && script.dataset ? script.dataset.hearthRouteConductorContract : "",
      script && script.dataset ? script.dataset.hearthDiagnosticExpectedContract : "",
      cacheKey,
      dataset.hearthRouteConductorContract,
      dataset.routeConductorCurrentContract,
      dataset.expectedRouteConductorContract,
      dataset.routeConductorCurrent
    ), "");

    const served = safeString(firstDefined(
      authorityContract,
      scriptContract,
      dataset.hearthRouteConductorContract,
      dataset.expectedRouteConductorContract,
      dataset.routeConductorCurrentContract,
      dataset.routeConductorCurrent
    ), FALLBACK.UNKNOWN);

    state.expectedRouteConductorContract = CURRENT_ROUTE_CONDUCTOR_CONTRACT;
    state.currentExpectedRouteConductorContract = CURRENT_ROUTE_CONDUCTOR_CONTRACT;
    state.scriptCacheRouteConductorContract = SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT;
    state.newsRouteConductorContract = NEWS_ROUTE_CONDUCTOR_CONTRACT;
    state.compatRouteConductorContract = COMPAT_ROUTE_CONDUCTOR_CONTRACT;
    state.lineageRouteConductorContract = LINEAGE_ROUTE_CONDUCTOR_CONTRACT;
    state.servedRouteConductorContract = served;
    state.routeConductorScriptSrc = src;
    state.routeConductorScriptPresent = boolText(Boolean(script));
    state.routeConductorAuthoritySource = conductor.path;
    state.routeConductorScriptCacheKey = cacheKey || FALLBACK.UNKNOWN;
    state.routeConductorAuthorityContract = authorityContract || FALLBACK.UNKNOWN;
    state.routeConductorContractRecognized = contractRecognized(served, ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS);

    const v99 = served === CURRENT_ROUTE_CONDUCTOR_CONTRACT;
    const v97 = served === SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT;
    const v96 = served === NEWS_ROUTE_CONDUCTOR_CONTRACT;
    const v95 = served === COMPAT_ROUTE_CONDUCTOR_CONTRACT;
    const v94 = served === LINEAGE_ROUTE_CONDUCTOR_CONTRACT;

    state.primaryRouteConductorContractRecognized = boolText(
      v99 || v97 || v96 || v95 || v94 || state.routeConductorContractRecognized === "true",
      state.routeConductorContractRecognized
    );

    state.routeConductorV99PrimaryNotTreatedAsCase5 = boolText(v99);
    state.routeConductorV97ScriptCacheAccepted = boolText(v99 || v97);
    state.routeConductorV96PrimaryNotTreatedAsCase5 = boolText(v99 || v97 || v96);
    state.routeConductorV95CompatibilityAccepted = boolText(v99 || v97 || v96 || v95);
    state.routeConductorV95PrimaryNotTreatedAsCase5 = boolText(v99 || v97 || v96 || v95);
    state.routeConductorV94LineageAccepted = boolText(v99 || v97 || v96 || v95 || v94);

    if (authorityContract && cacheKey && authorityContract !== cacheKey) {
      addNote(state, `ROUTE_CONDUCTOR_RENDERED_AUTHORITY_OVERRIDES_SCRIPT_CACHE:${authorityContract}>${cacheKey}`);
    }

    if (v99) {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5");
      addNote(state, "ROUTE_CONDUCTOR_V9_7_SCRIPT_CACHE_ACCEPTED_AS_TRANSITION");
      addNote(state, "ROUTE_CONDUCTOR_V9_6_PRIMARY_NOT_TREATED_AS_CASE_5");
      addNote(state, "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5");
      addNote(state, "ROUTE_CONDUCTOR_V9_5_COMPATIBILITY_SURFACE_ACCEPTED_UNDER_V9_6");
      addNote(state, "ACCEPTED_ROUTE_CONDUCTOR_CONTRACT_LINEAGE_RECOGNIZED");
    } else if (v97) {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_V9_7_SCRIPT_CACHE_ACCEPTED_AS_TRANSITION");
      addNote(state, "ROUTE_CONDUCTOR_V9_6_PRIMARY_NOT_TREATED_AS_CASE_5");
      addNote(state, "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5");
      addNote(state, "ACCEPTED_ROUTE_CONDUCTOR_CONTRACT_LINEAGE_RECOGNIZED");
    } else if (v96) {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_V9_6_PRIMARY_NOT_TREATED_AS_CASE_5");
      addNote(state, "ROUTE_CONDUCTOR_V9_5_COMPATIBILITY_SURFACE_ACCEPTED_UNDER_V9_6");
    } else if (v95) {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5");
    } else if (v94) {
      addNote(state, "ACCEPTED_ROUTE_CONDUCTOR_CONTRACT_LINEAGE_RECOGNIZED");
      addNote(state, "ROUTE_CONDUCTOR_SOURCE_FETCH_FALLBACK_DIRECT_FILE_MATCHED_NO_FALSE_CASE_5");
    } else if (state.routeConductorContractRecognized === "true") {
      addNote(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");
    } else if (state.routeConductorContractRecognized === "false") {
      addNote(state, `ROUTE_CONDUCTOR_CONTRACT_UNRECOGNIZED:${served}`);
    }

    if (!script && !authorityContract) {
      addNote(state, "ROUTE_CONDUCTOR_SCRIPT_OR_AUTHORITY_NOT_FOUND_IN_HEARTH_TARGET");
    }
  }

  function controlAuthorityHasMotion(authority, receipt) {
    if (!authority && !receipt) return false;

    return Boolean(
      isFunction(authority && authority.attach) ||
      isFunction(authority && authority.mount) ||
      isFunction(authority && authority.start) ||
      isFunction(authority && authority.boot) ||
      isFunction(authority && authority.enableMotionTouch) ||
      isFunction(authority && authority.bindMotionTouch) ||
      isFunction(authority && authority.bindDrag) ||
      (receipt && (
        receipt.motionTouchReady === true ||
        receipt.dragReady === true ||
        receipt.viewControlReady === true ||
        receipt.controlsReady === true ||
        receipt.touchReady === true ||
        receipt.motionReady === true
      ))
    );
  }

  function readControlFootprint(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const controls = findControlsAuthority(targetWindow);
    const receipt = controls.receipt || {};
    const script = target ? findScriptByPaths(target, [CONTROL_FILE, "hearth.controls.js"], targetWindow) : null;
    const src = script ? normalizeSrc(script.getAttribute("src"), targetWindow) : FALLBACK.NOT_FOUND;
    const dataset = target ? readDataset(target) : {};

    const controlContract = safeString(firstDefined(
      controls.contract,
      receipt.contract,
      receipt.CONTRACT,
      dataset.hearthControlsContract,
      dataset.hearthControlContract
    ), "");

    const controlsPresent = Boolean(script || controls.authority || controlContract);
    const motionReady = controlAuthorityHasMotion(controls.authority, receipt);

    state.planetaryControlSchemaActive = true;
    state.planetaryControlFootprintActive = true;

    state.controlFile = CONTROL_FILE;
    state.controlFileExpected = true;
    state.controlScriptSrc = src;
    state.controlScriptPresent = boolText(Boolean(script));
    state.controlAuthoritySource = controls.path;
    state.controlContract = controlContract || FALLBACK.UNKNOWN;

    state.controlFileStatus = controlsPresent
      ? motionReady
        ? "CONTROL_FILE_LOADED_AND_MOTION_TOUCH_READY"
        : "CONTROL_FILE_PRESENT_HANDSHAKE_PENDING"
      : FALLBACK.EXPECTED_NOT_YET_BUILT;

    state.controlAbsenceIsFailure = "false";
    state.controlAbsenceIsCase5 = "false";
    state.controlAbsenceBlocksVisiblePlanet = "false";
    state.controlAbsenceBlocksMotionTouch = controlsPresent && motionReady ? "false" : "true";

    state.hearthJsControlFunnelFile = HEARTH_JS_CONTROL_FUNNEL_FILE;
    state.hearthJsControlFunnelStatus = state.routeConductorContractRecognized === "true"
      ? "ROUTE_CONDUCTOR_FUNNEL_RECOGNIZED"
      : state.servedRouteConductorContract !== FALLBACK.UNKNOWN
        ? "ROUTE_CONDUCTOR_FUNNEL_PRESENT_BUT_CONTRACT_NOT_RECOGNIZED"
        : FALLBACK.EXPECTED_NOT_YET_WIRED;

    state.hearthJsControlHandshakeStatus = controlsPresent
      ? motionReady
        ? "CONTROL_HANDSHAKE_READY"
        : "CONTROL_FILE_PRESENT_WAITING_ROUTE_HANDSHAKE"
      : FALLBACK.EXPECTED_NOT_YET_WIRED;

    state.indexJsControlDisposition = "INDEX_OWNS_BUTTON_AUTHORITY_ONLY";
    state.indexJsControlLoadSlotStatus = "INDEX_DOES_NOT_OWN_PLANETARY_MOTION_TOUCH";

    state.motionTouchStatus = controlsPresent && motionReady ? FALLBACK.READY : FALLBACK.WAITING_CONTROL_FILE;
    state.dragStatus = controlsPresent && motionReady ? FALLBACK.READY : FALLBACK.WAITING_CONTROL_FILE;
    state.viewControlStatus = controlsPresent && motionReady ? FALLBACK.READY : FALLBACK.WAITING_CONTROL_FILE;

    state.visiblePlanetBlockedByControlAbsence = "false";
    state.motionTouchBlockedByControlAbsence = state.controlAbsenceBlocksMotionTouch;

    if (!controlsPresent) {
      addNote(state, "EAST_CONTROL_FILE_EXPECTED_NOT_YET_BUILT");
      addNote(state, "EAST_CONTROL_ABSENCE_NOT_TREATED_AS_CASE_5");
      addNote(state, "EAST_CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET");
    } else if (motionReady) {
      addNote(state, "EAST_CONTROL_FILE_PRESENT_AND_MOTION_TOUCH_READY");
    } else {
      addNote(state, "EAST_CONTROL_FILE_PRESENT_HANDSHAKE_PENDING");
    }
  }

  function readLabBridgeFootprint(targetDocument, targetWindow, state) {
    const footprint = {};

    Object.keys(LAB_FILES).forEach((key) => {
      const file = LAB_FILES[key];
      const script = readScriptFootprint(targetDocument, targetWindow, file);
      const authority = findWindowAuthority(targetWindow, LAB_GLOBALS[key] || []);
      const contract = safeString(firstDefined(authority.contract, script.cacheKey), FALLBACK.UNKNOWN);

      footprint[key] = {
        file,
        scriptPresent: script.present,
        scriptSrc: script.src,
        authoritySource: authority.path,
        contract,
        status: classifySourcePresence(script.present, Boolean(authority.authority), contract)
      };
    });

    state.labBridgeFootprint = footprint;
    state.labRuntimeTableNorthFile = LAB_FILES.north;
    state.labRuntimeTableEastFile = LAB_FILES.east;
    state.labRuntimeTableSouthFile = LAB_FILES.south;
    state.labRuntimeTableWestFile = LAB_FILES.west;

    state.labRuntimeTableNorthStatus = footprint.north.status;
    state.labRuntimeTableEastStatus = footprint.east.status;
    state.labRuntimeTableSouthStatus = footprint.south.status;
    state.labRuntimeTableWestStatus = footprint.west.status;

    state.labRuntimeTableNorthContract = footprint.north.contract;
    state.labRuntimeTableEastContract = footprint.east.contract;
    state.labRuntimeTableSouthContract = footprint.south.contract;
    state.labRuntimeTableWestContract = footprint.west.contract;

    state.labTwoCycleLanguageRecognized = Boolean(
      footprint.north.status !== FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST ||
      footprint.west.status !== FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST
    )
      ? "true"
      : FALLBACK.UNKNOWN;

    state.labCanvasSharedLanguageStatus = state.labTwoCycleLanguageRecognized === "true"
      ? "LAB_RUNTIME_TABLE_LANGUAGE_SOURCE_FOOTPRINT_OBSERVED"
      : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST;

    state.labBridgeAbsenceIsFailure = "false";
    state.labBridgeAbsenceIsCase5 = "false";

    addNote(state, "EAST_LAB_RUNTIME_TABLE_BRIDGE_SOURCE_FOOTPRINT_READ_COMPLETE");

    if (state.labTwoCycleLanguageRecognized === "true") {
      addNote(state, "EAST_LAB_TWO_CYCLE_LANGUAGE_SOURCE_FOOTPRINT_OBSERVED");
    } else {
      addNote(state, "EAST_LAB_TWO_CYCLE_LANGUAGE_NOT_CONFIRMED_BUT_NOT_FAILURE");
    }
  }

  function readMacroWestBridgeFootprint(targetDocument, targetWindow, state) {
    const handoffScript = readScriptFootprint(targetDocument, targetWindow, MACRO_WEST_HANDOFF_FILE);
    const labWestScript = readScriptFootprint(targetDocument, targetWindow, LAB_FILES.west);
    const authority = findWindowAuthority(targetWindow, MACRO_WEST_GLOBALS);
    const contract = safeString(firstDefined(authority.contract, handoffScript.cacheKey, labWestScript.cacheKey), FALLBACK.UNKNOWN);

    state.macroWestBridgeFile = MACRO_WEST_HANDOFF_FILE;
    state.macroWestBridgeScriptPresent = boolText(handoffScript.present || labWestScript.present);
    state.macroWestBridgeAuthoritySource = authority.path;
    state.macroWestBridgeContract = contract;
    state.macroWestBridgeStatus = classifySourcePresence(
      handoffScript.present || labWestScript.present,
      Boolean(authority.authority),
      contract
    );

    state.westAnointingBridgeLanguageExpected = true;
    state.westAnointingBridgeSourceFootprintStatus = state.macroWestBridgeStatus;
    state.westKnowsBishopsByHubBoundaryOnly = true;
    state.westDoesNotNeedBishopInternals = true;
    state.bishopInternalsReadByEast = false;
    state.bishopInternalsReadByWestRequired = false;

    addNote(state, "EAST_MACRO_WEST_BRIDGE_SOURCE_FOOTPRINT_READ_COMPLETE");

    if (state.macroWestBridgeStatus !== FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST) {
      addNote(state, "EAST_MACRO_WEST_BRIDGE_SOURCE_FOOTPRINT_OBSERVED");
    } else {
      addNote(state, "EAST_MACRO_WEST_BRIDGE_NOT_CONFIRMED_BUT_NOT_FAILURE");
    }
  }

  function readCanvasAndFingerFootprint(targetDocument, targetWindow, state) {
    const target = targetDocument || doc;
    const canvasAuthority = findCanvasAuthority(targetWindow);
    const canvasScript = target ? findScriptByPaths(target, [CANVAS_FILE, "hearth.canvas.js"], targetWindow) : null;
    const canvasReceipt = canvasAuthority.receipt || {};
    const dataset = target ? readDataset(target) : {};

    state.canvasFile = CANVAS_FILE;
    state.canvasScriptPresent = boolText(Boolean(canvasScript));
    state.canvasAuthoritySource = canvasAuthority.path;
    state.canvasContract = safeString(firstDefined(
      canvasAuthority.contract,
      canvasReceipt.contract,
      canvasReceipt.CONTRACT,
      dataset.hearthCanvasContract
    ), FALLBACK.UNKNOWN);

    state.canvasAuthorityStatus = canvasAuthority.authority || canvasAuthority.contract || canvasScript
      ? "CANVAS_SOURCE_FOOTPRINT_OBSERVED"
      : FALLBACK.UNKNOWN;

    state.canvasLocalStationStatus = (
      canvasAuthority.path.includes("LOCAL_STATION") ||
      canvasAuthority.path.includes("canvasLocalStation") ||
      canvasReceipt.localStationReady === true ||
      canvasReceipt.canvasLocalStationReady === true ||
      dataset.hearthCanvasLocalStationReady === "true"
    )
      ? "CANVAS_LOCAL_STATION_SOURCE_FOOTPRINT_OBSERVED"
      : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST;

    state.visiblePlanetSourceStatus = (
      canvasReceipt.visiblePlanetProofReady === true ||
      canvasReceipt.baseGlobeVisibleCarrierReady === true ||
      dataset.hearthCanvasVisiblePlanetProofReady === "true" ||
      dataset.hearthSouthVisiblePlanetProofReady === "true"
    )
      ? "VISIBLE_PLANET_SOURCE_PROOF_OBSERVED"
      : "VISIBLE_PLANET_SOURCE_PROOF_NOT_REQUIRED_BY_EAST";

    const childFootprint = {};
    ["north", "east", "south", "west"].forEach((key) => {
      const found = findWindowAuthority(targetWindow, CANVAS_GLOBALS[key] || []);
      childFootprint[key] = {
        authoritySource: found.path,
        contract: found.contract || FALLBACK.UNKNOWN,
        receiptPresent: Boolean(found.receipt),
        status: found.authority || found.contract || found.receipt
          ? "CANVAS_CHILD_LANE_SOURCE_FOOTPRINT_OBSERVED"
          : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST
      };
    });

    state.canvasChildLaneFootprint = childFootprint;
    state.canvasNorthLaneStatus = childFootprint.north.status;
    state.canvasEastLaneStatus = childFootprint.east.status;
    state.canvasSouthLaneStatus = childFootprint.south.status;
    state.canvasWestLaneStatus = childFootprint.west.status;

    const observedLaneCount = Object.keys(childFootprint).filter((key) => (
      childFootprint[key].status === "CANVAS_CHILD_LANE_SOURCE_FOOTPRINT_OBSERVED"
    )).length;

    state.canvasFourWayHandoffExpected = true;
    state.canvasFourWayHandoffObservedLaneCount = observedLaneCount;
    state.canvasFourWayHandoffStatus = observedLaneCount >= 4
      ? "CANVAS_FOUR_WAY_HANDOFF_SOURCE_FOOTPRINT_OBSERVED"
      : observedLaneCount > 0
        ? "CANVAS_FOUR_WAY_HANDOFF_PARTIAL_SOURCE_FOOTPRINT_OBSERVED"
        : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST;

    const fingerStatuses = {};
    Object.keys(FINGER_FILES).forEach((key) => {
      const file = FINGER_FILES[key];
      const script = target ? findScriptByPaths(target, [file, file.split("/").pop()], targetWindow) : null;

      fingerStatuses[key] = {
        file,
        scriptPresent: Boolean(script),
        status: script ? "SCRIPT_PRESENT" : "EXPECTED_OR_EMBEDDED_NOT_CONFIRMED_BY_EAST"
      };
    });

    state.fingerFileFootprint = fingerStatuses;
    state.modernFingerVocabularyActive = true;
    state.surfacePointerFingerVocabularyActive = true;
    state.planetaryFileFootprintActive = true;

    addNote(state, "EAST_CANVAS_AUTHORITY_AND_FOUR_WAY_HANDOFF_SOURCE_FOOTPRINT_READ_COMPLETE");
    addNote(state, "EAST_MODERN_FINGER_VOCABULARY_BOUNDARY_MASS_SURFACE_POINTER_LIGHT_INSPECT_COMPOSITE_ACTIVE");

    if (state.canvasFourWayHandoffStatus === "CANVAS_FOUR_WAY_HANDOFF_SOURCE_FOOTPRINT_OBSERVED") {
      addNote(state, "EAST_CANVAS_FOUR_WAY_HANDOFF_SOURCE_FOOTPRINT_OBSERVED");
    } else if (state.canvasFourWayHandoffStatus === "CANVAS_FOUR_WAY_HANDOFF_PARTIAL_SOURCE_FOOTPRINT_OBSERVED") {
      addNote(state, "EAST_CANVAS_FOUR_WAY_HANDOFF_PARTIAL_SOURCE_FOOTPRINT_OBSERVED");
    } else {
      addNote(state, "EAST_CANVAS_FOUR_WAY_HANDOFF_NOT_CONFIRMED_BUT_NOT_FAILURE");
    }
  }

  function readBishopHubFootprint(targetDocument, targetWindow, state) {
    const footprint = {};

    Object.keys(BISHOP_HUBS).forEach((key) => {
      const hub = BISHOP_HUBS[key];
      const script = readScriptFootprint(targetDocument, targetWindow, hub.file);
      const authority = findWindowAuthority(targetWindow, hub.globals || []);
      const contract = safeString(firstDefined(authority.contract, script.cacheKey), FALLBACK.UNKNOWN);

      footprint[key] = {
        file: hub.file,
        scriptPresent: script.present,
        scriptSrc: script.src,
        authoritySource: authority.path,
        contract,
        status: classifySourcePresence(script.present, Boolean(authority.authority), contract)
      };
    });

    state.bishopHubFootprint = footprint;
    state.bishopHubVocabularyActive = true;
    state.bishopHubAbsenceIsFailure = "false";
    state.bishopHubAbsenceIsCase5 = "false";
    state.bishopNorthHubStatus = footprint.north.status;
    state.bishopEastHubStatus = footprint.east.status;
    state.bishopSouthHubStatus = footprint.south.status;
    state.bishopWestHubStatus = footprint.west.status;

    const observed = Object.keys(footprint).filter((key) => (
      footprint[key].status !== FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST
    )).length;

    state.bishopHubObservedCount = observed;
    state.bishopHubBridgeStatus = observed >= 4
      ? "BISHOP_HUB_FOUR_WAY_SOURCE_FOOTPRINT_OBSERVED"
      : observed > 0
        ? "BISHOP_HUB_PARTIAL_SOURCE_FOOTPRINT_OBSERVED"
        : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST;

    addNote(state, "EAST_BISHOP_HUB_PATH_VOCABULARY_ADMITTED_WITHOUT_INTERNAL_OWNERSHIP");

    if (observed > 0) {
      addNote(state, "EAST_BISHOP_HUB_SOURCE_FOOTPRINT_PARTIALLY_OBSERVED");
    } else {
      addNote(state, "EAST_BISHOP_HUBS_NOT_CONFIRMED_BUT_NOT_FAILURE");
    }
  }

  function deriveMismatch(state) {
    const htmlKnown = state.servedHtmlContract !== FALLBACK.UNKNOWN && state.servedHtmlContract !== FALLBACK.NOT_FOUND;
    const indexKnown = state.servedIndexJsContract !== FALLBACK.UNKNOWN && state.servedIndexJsContract !== FALLBACK.NOT_FOUND;
    const routeKnown = state.servedRouteConductorContract !== FALLBACK.UNKNOWN && state.servedRouteConductorContract !== FALLBACK.NOT_FOUND;

    const htmlBad = htmlKnown && state.htmlContractRecognized === "false";
    const indexBad = indexKnown && state.indexContractRecognized === "false";
    const routeBad = routeKnown && state.routeConductorContractRecognized === "false";

    if (htmlBad || indexBad || routeBad) {
      state.cacheOrServedContractMismatch = "true";
      state.case5Support = SUPPORT.TRUE;

      if (htmlBad) addNote(state, "CASE_5_SUPPORT_HTML_CONTRACT_UNRECOGNIZED");
      if (indexBad) addNote(state, "CASE_5_SUPPORT_INDEX_CONTRACT_UNRECOGNIZED");
      if (routeBad) addNote(state, "CASE_5_SUPPORT_ROUTE_CONDUCTOR_CONTRACT_UNRECOGNIZED");
      return;
    }

    if (htmlKnown || indexKnown || routeKnown) {
      state.cacheOrServedContractMismatch = "false";
      state.case5Support = SUPPORT.FALSE;
      addNote(state, "CASE_5_FALSE_CURRENT_OR_ACCEPTED_SPREAD_RECOGNIZED");
      return;
    }

    state.cacheOrServedContractMismatch = FALLBACK.UNKNOWN;
    state.case5Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    addNote(state, "CASE_5_INSUFFICIENT_EVIDENCE_NO_SERVED_CONTRACTS_READABLE");
  }

  function makeState() {
    return {
      eastStatus: STATUS.READY,
      eastContract: CONTRACT,
      eastReceipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      eastSourceReadComplete: "false",
      eastSourceReadStatus: FALLBACK.UNKNOWN,

      diagnosticTargetAccessStatus: FALLBACK.UNKNOWN,
      diagnosticTargetAccessError: "",
      targetDocumentSource: FALLBACK.UNKNOWN,

      expectedHtmlContract: CURRENT_HTML_CONTRACT,
      expectedIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,

      currentExpectedHtmlContract: CURRENT_HTML_CONTRACT,
      currentExpectedIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      currentExpectedRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      foundationHtmlContract: FOUNDATION_HTML_CONTRACT,
      scriptCacheRouteConductorContract: SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT,
      newsRouteConductorContract: NEWS_ROUTE_CONDUCTOR_CONTRACT,
      compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,

      servedHtmlContract: FALLBACK.UNKNOWN,
      servedIndexJsContract: FALLBACK.UNKNOWN,
      servedRouteConductorContract: FALLBACK.UNKNOWN,

      htmlContractRecognized: FALLBACK.UNKNOWN,
      indexContractRecognized: FALLBACK.UNKNOWN,
      routeConductorContractRecognized: FALLBACK.UNKNOWN,

      primaryRouteConductorContractRecognized: FALLBACK.UNKNOWN,
      routeConductorV99PrimaryNotTreatedAsCase5: FALLBACK.UNKNOWN,
      routeConductorV97ScriptCacheAccepted: FALLBACK.UNKNOWN,
      routeConductorV96PrimaryNotTreatedAsCase5: FALLBACK.UNKNOWN,
      routeConductorV95CompatibilityAccepted: FALLBACK.UNKNOWN,
      routeConductorV95PrimaryNotTreatedAsCase5: FALLBACK.UNKNOWN,
      routeConductorV94LineageAccepted: FALLBACK.UNKNOWN,
      eastCurrentSpreadAlignmentRecognized: FALLBACK.UNKNOWN,

      indexScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptCacheKey: FALLBACK.UNKNOWN,
      routeConductorAuthorityContract: FALLBACK.UNKNOWN,
      indexScriptPresent: FALLBACK.UNKNOWN,
      routeConductorScriptPresent: FALLBACK.UNKNOWN,
      indexAuthoritySource: FALLBACK.UNKNOWN,
      routeConductorAuthoritySource: FALLBACK.UNKNOWN,

      targetRouteSignal: FALLBACK.UNKNOWN,
      planetContextSignal: FALLBACK.UNKNOWN,

      cacheOrServedContractMismatch: FALLBACK.UNKNOWN,
      case5Support: FALLBACK.INSUFFICIENT_EVIDENCE,

      planetaryControlSchemaActive: true,
      planetaryControlFootprintActive: true,
      controlFile: CONTROL_FILE,
      controlFileExpected: true,
      controlFileStatus: FALLBACK.EXPECTED_NOT_YET_BUILT,
      controlScriptSrc: FALLBACK.NOT_FOUND,
      controlScriptPresent: "false",
      controlAuthoritySource: "NONE",
      controlContract: FALLBACK.UNKNOWN,
      controlAbsenceIsFailure: "false",
      controlAbsenceIsCase5: "false",
      controlAbsenceBlocksVisiblePlanet: "false",
      controlAbsenceBlocksMotionTouch: "true",

      hearthJsControlFunnelFile: HEARTH_JS_CONTROL_FUNNEL_FILE,
      hearthJsControlFunnelStatus: FALLBACK.EXPECTED_NOT_YET_WIRED,
      hearthJsControlHandshakeStatus: FALLBACK.EXPECTED_NOT_YET_WIRED,
      indexJsControlDisposition: "INDEX_OWNS_BUTTON_AUTHORITY_ONLY",
      indexJsControlLoadSlotStatus: "INDEX_DOES_NOT_OWN_PLANETARY_MOTION_TOUCH",

      motionTouchStatus: FALLBACK.WAITING_CONTROL_FILE,
      dragStatus: FALLBACK.WAITING_CONTROL_FILE,
      viewControlStatus: FALLBACK.WAITING_CONTROL_FILE,
      visiblePlanetBlockedByControlAbsence: "false",
      motionTouchBlockedByControlAbsence: "true",

      labBridgeFootprint: {},
      labRuntimeTableNorthFile: LAB_FILES.north,
      labRuntimeTableEastFile: LAB_FILES.east,
      labRuntimeTableSouthFile: LAB_FILES.south,
      labRuntimeTableWestFile: LAB_FILES.west,
      labRuntimeTableNorthStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      labRuntimeTableEastStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      labRuntimeTableSouthStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      labRuntimeTableWestStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      labRuntimeTableNorthContract: FALLBACK.UNKNOWN,
      labRuntimeTableEastContract: FALLBACK.UNKNOWN,
      labRuntimeTableSouthContract: FALLBACK.UNKNOWN,
      labRuntimeTableWestContract: FALLBACK.UNKNOWN,
      labTwoCycleLanguageRecognized: FALLBACK.UNKNOWN,
      labCanvasSharedLanguageStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      labBridgeAbsenceIsFailure: "false",
      labBridgeAbsenceIsCase5: "false",

      macroWestBridgeFile: MACRO_WEST_HANDOFF_FILE,
      macroWestBridgeScriptPresent: FALLBACK.UNKNOWN,
      macroWestBridgeAuthoritySource: FALLBACK.UNKNOWN,
      macroWestBridgeContract: FALLBACK.UNKNOWN,
      macroWestBridgeStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      westAnointingBridgeLanguageExpected: true,
      westAnointingBridgeSourceFootprintStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      westKnowsBishopsByHubBoundaryOnly: true,
      westDoesNotNeedBishopInternals: true,
      bishopInternalsReadByEast: false,
      bishopInternalsReadByWestRequired: false,

      canvasFile: CANVAS_FILE,
      canvasScriptPresent: FALLBACK.UNKNOWN,
      canvasAuthoritySource: FALLBACK.UNKNOWN,
      canvasContract: FALLBACK.UNKNOWN,
      canvasAuthorityStatus: FALLBACK.UNKNOWN,
      canvasLocalStationStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      visiblePlanetSourceStatus: FALLBACK.UNKNOWN,
      canvasChildLaneFootprint: {},
      canvasFourWayHandoffExpected: true,
      canvasFourWayHandoffObservedLaneCount: 0,
      canvasFourWayHandoffStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      canvasNorthLaneStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      canvasEastLaneStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      canvasSouthLaneStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      canvasWestLaneStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,

      planetaryFileFootprintActive: true,
      modernFingerVocabularyActive: true,
      surfacePointerFingerVocabularyActive: true,
      fingerFileFootprint: {},

      bishopHubVocabularyActive: true,
      bishopHubFootprint: {},
      bishopHubAbsenceIsFailure: "false",
      bishopHubAbsenceIsCase5: "false",
      bishopNorthHubStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      bishopEastHubStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      bishopSouthHubStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      bishopWestHubStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      bishopHubObservedCount: 0,
      bishopHubBridgeStatus: FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,

      diagnosticLabCanvasBridgeLanguageActive: true,
      diagnosticGaugeAuthorityBridgeLanguageActive: true,
      sourceFootprintBridgeOnly: true,
      readOnlyInspectionComplete: false,
      servedSourceAuthorityOnly: true,
      renderedTargetAuthority: false,
      syntheticActivationAuthority: false,
      productionMutationAuthorized: false,
      cacheRepairAuthorized: false,
      hearthRepairAuthorized: false,

      eastSecondaryEvidenceNotes: [],
      updatedAt: nowIso(),

      ...FINAL_FALSE
    };
  }

  function makeEvidencePacket(state) {
    return {
      EAST_STATUS: state.eastStatus,
      EAST_CONTRACT: CONTRACT,
      EAST_RECEIPT: RECEIPT,
      EAST_ALIGNMENT_CONTRACT: IMPLEMENTATION_CONTRACT,
      EAST_ALIGNMENT_RECEIPT: IMPLEMENTATION_RECEIPT,
      EAST_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      EAST_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      EAST_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      EAST_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      EAST_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      EAST_VERSION: VERSION,

      EAST_SOURCE_READ_COMPLETE: state.eastSourceReadComplete,
      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,
      TARGET_DOCUMENT_SOURCE: state.targetDocumentSource,

      EXPECTED_HTML_CONTRACT: state.expectedHtmlContract,
      EXPECTED_INDEX_JS_CONTRACT: state.expectedIndexJsContract,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.expectedRouteConductorContract,

      CURRENT_EXPECTED_HTML_CONTRACT: state.currentExpectedHtmlContract,
      CURRENT_EXPECTED_INDEX_JS_CONTRACT: state.currentExpectedIndexJsContract,
      CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.currentExpectedRouteConductorContract,
      PREVIOUS_HTML_CONTRACT: state.previousHtmlContract,
      FOUNDATION_HTML_CONTRACT: state.foundationHtmlContract,
      SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT: state.scriptCacheRouteConductorContract,
      NEWS_ROUTE_CONDUCTOR_CONTRACT: state.newsRouteConductorContract,
      COMPAT_ROUTE_CONDUCTOR_CONTRACT: state.compatRouteConductorContract,
      PRIOR_ROUTE_CONDUCTOR_CONTRACT: state.lineageRouteConductorContract,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,

      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_CACHE_KEY: state.routeConductorScriptCacheKey,
      ROUTE_CONDUCTOR_AUTHORITY_CONTRACT: state.routeConductorAuthorityContract,
      INDEX_SCRIPT_PRESENT: state.indexScriptPresent,
      ROUTE_CONDUCTOR_SCRIPT_PRESENT: state.routeConductorScriptPresent,

      INDEX_AUTHORITY_SOURCE: state.indexAuthoritySource,
      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: state.routeConductorAuthoritySource,

      HTML_CONTRACT_RECOGNIZED: state.htmlContractRecognized,
      INDEX_CONTRACT_RECOGNIZED: state.indexContractRecognized,
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.routeConductorContractRecognized,

      PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.primaryRouteConductorContractRecognized,
      ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5: state.routeConductorV99PrimaryNotTreatedAsCase5,
      ROUTE_CONDUCTOR_V9_7_SCRIPT_CACHE_ACCEPTED: state.routeConductorV97ScriptCacheAccepted,
      ROUTE_CONDUCTOR_V9_6_PRIMARY_NOT_TREATED_AS_CASE_5: state.routeConductorV96PrimaryNotTreatedAsCase5,
      ROUTE_CONDUCTOR_V9_5_COMPATIBILITY_ACCEPTED: state.routeConductorV95CompatibilityAccepted,
      ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5: state.routeConductorV95PrimaryNotTreatedAsCase5,
      ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED: state.routeConductorV94LineageAccepted,
      EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED: state.eastCurrentSpreadAlignmentRecognized,

      TARGET_ROUTE_SIGNAL: state.targetRouteSignal,
      PLANET_CONTEXT_SIGNAL: state.planetContextSignal,

      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,
      CASE_5_SUPPORT: state.case5Support,

      PLANETARY_CONTROL_SCHEMA_ACTIVE: state.planetaryControlSchemaActive,
      PLANETARY_CONTROL_FOOTPRINT_ACTIVE: state.planetaryControlFootprintActive,
      CONTROL_FILE: state.controlFile,
      CONTROL_FILE_EXPECTED: state.controlFileExpected,
      CONTROL_FILE_STATUS: state.controlFileStatus,
      CONTROL_SCRIPT_SRC: state.controlScriptSrc,
      CONTROL_SCRIPT_PRESENT: state.controlScriptPresent,
      CONTROL_AUTHORITY_SOURCE: state.controlAuthoritySource,
      CONTROL_CONTRACT: state.controlContract,
      CONTROL_ABSENCE_IS_FAILURE: state.controlAbsenceIsFailure,
      CONTROL_ABSENCE_IS_CASE_5: state.controlAbsenceIsCase5,
      CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET: state.controlAbsenceBlocksVisiblePlanet,
      CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH: state.controlAbsenceBlocksMotionTouch,

      HEARTH_JS_CONTROL_FUNNEL_FILE: state.hearthJsControlFunnelFile,
      HEARTH_JS_CONTROL_FUNNEL_STATUS: state.hearthJsControlFunnelStatus,
      HEARTH_JS_CONTROL_HANDSHAKE_STATUS: state.hearthJsControlHandshakeStatus,
      INDEX_JS_CONTROL_DISPOSITION: state.indexJsControlDisposition,
      INDEX_JS_CONTROL_LOAD_SLOT_STATUS: state.indexJsControlLoadSlotStatus,

      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,
      VISIBLE_PLANET_BLOCKED_BY_CONTROL_ABSENCE: state.visiblePlanetBlockedByControlAbsence,
      MOTION_TOUCH_BLOCKED_BY_CONTROL_ABSENCE: state.motionTouchBlockedByControlAbsence,

      DIAGNOSTIC_LAB_CANVAS_BRIDGE_LANGUAGE_ACTIVE: state.diagnosticLabCanvasBridgeLanguageActive,
      DIAGNOSTIC_GAUGE_AUTHORITY_BRIDGE_LANGUAGE_ACTIVE: state.diagnosticGaugeAuthorityBridgeLanguageActive,
      SOURCE_FOOTPRINT_BRIDGE_ONLY: state.sourceFootprintBridgeOnly,

      LAB_BRIDGE_FOOTPRINT: clonePlain(state.labBridgeFootprint),
      LAB_RUNTIME_TABLE_NORTH_FILE: state.labRuntimeTableNorthFile,
      LAB_RUNTIME_TABLE_EAST_FILE: state.labRuntimeTableEastFile,
      LAB_RUNTIME_TABLE_SOUTH_FILE: state.labRuntimeTableSouthFile,
      LAB_RUNTIME_TABLE_WEST_FILE: state.labRuntimeTableWestFile,
      LAB_RUNTIME_TABLE_NORTH_STATUS: state.labRuntimeTableNorthStatus,
      LAB_RUNTIME_TABLE_EAST_STATUS: state.labRuntimeTableEastStatus,
      LAB_RUNTIME_TABLE_SOUTH_STATUS: state.labRuntimeTableSouthStatus,
      LAB_RUNTIME_TABLE_WEST_STATUS: state.labRuntimeTableWestStatus,
      LAB_RUNTIME_TABLE_NORTH_CONTRACT: state.labRuntimeTableNorthContract,
      LAB_RUNTIME_TABLE_EAST_CONTRACT: state.labRuntimeTableEastContract,
      LAB_RUNTIME_TABLE_SOUTH_CONTRACT: state.labRuntimeTableSouthContract,
      LAB_RUNTIME_TABLE_WEST_CONTRACT: state.labRuntimeTableWestContract,
      LAB_TWO_CYCLE_LANGUAGE_RECOGNIZED: state.labTwoCycleLanguageRecognized,
      LAB_CANVAS_SHARED_LANGUAGE_STATUS: state.labCanvasSharedLanguageStatus,
      LAB_BRIDGE_ABSENCE_IS_FAILURE: state.labBridgeAbsenceIsFailure,
      LAB_BRIDGE_ABSENCE_IS_CASE_5: state.labBridgeAbsenceIsCase5,

      MACRO_WEST_BRIDGE_FILE: state.macroWestBridgeFile,
      MACRO_WEST_BRIDGE_SCRIPT_PRESENT: state.macroWestBridgeScriptPresent,
      MACRO_WEST_BRIDGE_AUTHORITY_SOURCE: state.macroWestBridgeAuthoritySource,
      MACRO_WEST_BRIDGE_CONTRACT: state.macroWestBridgeContract,
      MACRO_WEST_BRIDGE_STATUS: state.macroWestBridgeStatus,
      WEST_ANOINTING_BRIDGE_LANGUAGE_EXPECTED: state.westAnointingBridgeLanguageExpected,
      WEST_ANOINTING_BRIDGE_SOURCE_FOOTPRINT_STATUS: state.westAnointingBridgeSourceFootprintStatus,
      WEST_KNOWS_BISHOPS_BY_HUB_BOUNDARY_ONLY: state.westKnowsBishopsByHubBoundaryOnly,
      WEST_DOES_NOT_NEED_BISHOP_INTERNALS: state.westDoesNotNeedBishopInternals,
      BISHOP_INTERNALS_READ_BY_EAST: state.bishopInternalsReadByEast,
      BISHOP_INTERNALS_READ_BY_WEST_REQUIRED: state.bishopInternalsReadByWestRequired,

      CANVAS_FILE: state.canvasFile,
      CANVAS_SCRIPT_PRESENT: state.canvasScriptPresent,
      CANVAS_AUTHORITY_SOURCE: state.canvasAuthoritySource,
      CANVAS_CONTRACT: state.canvasContract,
      CANVAS_AUTHORITY_STATUS: state.canvasAuthorityStatus,
      CANVAS_LOCAL_STATION_STATUS: state.canvasLocalStationStatus,
      VISIBLE_PLANET_SOURCE_STATUS: state.visiblePlanetSourceStatus,
      CANVAS_CHILD_LANE_FOOTPRINT: clonePlain(state.canvasChildLaneFootprint),
      CANVAS_FOUR_WAY_HANDOFF_EXPECTED: state.canvasFourWayHandoffExpected,
      CANVAS_FOUR_WAY_HANDOFF_OBSERVED_LANE_COUNT: state.canvasFourWayHandoffObservedLaneCount,
      CANVAS_FOUR_WAY_HANDOFF_STATUS: state.canvasFourWayHandoffStatus,
      CANVAS_NORTH_LANE_STATUS: state.canvasNorthLaneStatus,
      CANVAS_EAST_LANE_STATUS: state.canvasEastLaneStatus,
      CANVAS_SOUTH_LANE_STATUS: state.canvasSouthLaneStatus,
      CANVAS_WEST_LANE_STATUS: state.canvasWestLaneStatus,

      PLANETARY_FILE_FOOTPRINT_ACTIVE: state.planetaryFileFootprintActive,
      MODERN_FINGER_VOCABULARY_ACTIVE: state.modernFingerVocabularyActive,
      SURFACE_POINTER_FINGER_VOCABULARY_ACTIVE: state.surfacePointerFingerVocabularyActive,
      FINGER_FILE_FOOTPRINT: clonePlain(state.fingerFileFootprint),

      BISHOP_HUB_VOCABULARY_ACTIVE: state.bishopHubVocabularyActive,
      BISHOP_HUB_FOOTPRINT: clonePlain(state.bishopHubFootprint),
      BISHOP_HUB_ABSENCE_IS_FAILURE: state.bishopHubAbsenceIsFailure,
      BISHOP_HUB_ABSENCE_IS_CASE_5: state.bishopHubAbsenceIsCase5,
      BISHOP_NORTH_HUB_STATUS: state.bishopNorthHubStatus,
      BISHOP_EAST_HUB_STATUS: state.bishopEastHubStatus,
      BISHOP_SOUTH_HUB_STATUS: state.bishopSouthHubStatus,
      BISHOP_WEST_HUB_STATUS: state.bishopWestHubStatus,
      BISHOP_HUB_OBSERVED_COUNT: state.bishopHubObservedCount,
      BISHOP_HUB_BRIDGE_STATUS: state.bishopHubBridgeStatus,

      EAST_SECONDARY_EVIDENCE_NOTES: state.eastSecondaryEvidenceNotes.length
        ? state.eastSecondaryEvidenceNotes.join(" | ")
        : FALLBACK.NONE,

      F13_CLAIMED: false,
      F21_ELIGIBLE_FOR_NORTH: false,
      F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      READY_TEXT_ALLOWED: false,
      READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false
    };
  }

  async function runEastSourceRead(options = {}) {
    const state = makeState();
    state.eastStatus = STATUS.RUNNING;
    state.updatedAt = nowIso();

    try {
      const target = resolveTargetDocument(options, state);
      const targetDocument = target.targetDocument;
      const targetWindow = target.targetWindow || (targetDocument ? targetDocument.defaultView : null);

      state.targetDocumentSource = target.source || FALLBACK.UNKNOWN;

      if (targetDocument && !hasHearthSignals(targetDocument, targetWindow) && !routeMatches(targetWindow)) {
        addNote(state, "TARGET_DOCUMENT_ACCESSIBLE_BUT_HEARTH_SIGNALS_NOT_CONFIRMED");
      }

      readHtmlEvidence(targetDocument, targetWindow, state);
      readIndexEvidence(targetDocument, targetWindow, state);
      readRouteConductorEvidence(targetDocument, targetWindow, state);
      readControlFootprint(targetDocument, targetWindow, state);
      readLabBridgeFootprint(targetDocument, targetWindow, state);
      readMacroWestBridgeFootprint(targetDocument, targetWindow, state);
      readCanvasAndFingerFootprint(targetDocument, targetWindow, state);
      readBishopHubFootprint(targetDocument, targetWindow, state);
      deriveMismatch(state);

      state.eastCurrentSpreadAlignmentRecognized = boolText(
        state.htmlContractRecognized === "true" &&
        (
          state.indexContractRecognized === "true" ||
          state.servedIndexJsContract === FALLBACK.UNKNOWN
        ) &&
        (
          state.routeConductorContractRecognized === "true" ||
          state.primaryRouteConductorContractRecognized === "true"
        )
      );

      if (state.eastCurrentSpreadAlignmentRecognized === "true") {
        addNote(state, "EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED");
      }

      addNote(state, "EAST_CURRENT_SERVED_SPREAD_BISHOP_CANVAS_SOURCE_FOOTPRINT_ALIGNMENT_COMPLETE");

      state.eastSourceReadComplete = "true";
      state.eastSourceReadStatus = FALLBACK.COMPLETE;
      state.readOnlyInspectionComplete = true;
      state.eastStatus = STATUS.COMPLETE;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.eastStatus = STATUS.FAILED;
      state.eastSourceReadComplete = "false";
      state.eastSourceReadStatus = FALLBACK.FAILED;
      state.diagnosticTargetAccessError = `EAST_SOURCE_READ_TOP_LEVEL_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`;
      state.cacheOrServedContractMismatch = FALLBACK.UNKNOWN;
      state.case5Support = FALLBACK.INSUFFICIENT_EVIDENCE;
      addNote(state, state.diagnosticTargetAccessError);
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: state.diagnosticTargetAccessError,
        evidence: clonePlain(lastEvidencePacket),
        state: clonePlain(lastState)
      };
    }
  }

  function getEastReceipt() {
    return {
      childRole: "EAST_SERVED_SOURCE_EVIDENCE",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      servesNorth: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      renderedTargetAuthority: false,
      syntheticActivationAuthority: false,
      servedSourceAuthority: true,
      case5EvidenceSupportOnly: true,
      packetFormattingAuthority: false,
      diagnosticUiAuthority: false,

      productionMutationAuthorized: false,
      cacheRepairAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,

      runEastSourceReadApiAvailable: true,
      getEastReceiptApiAvailable: true,
      getEastStateApiAvailable: true,

      currentSpreadCompatibilityOwned: true,
      servedSourceEvidenceOnlyOwned: true,
      contractRecognitionOwned: true,
      cacheMismatchEvidenceOwned: true,
      falseCase5PreventionOwned: true,
      targetWindowScopedReadOwned: true,
      diagnosticReceiverHtmlIgnoredAsTargetOwned: true,
      planetaryControlFootprintReadOwned: true,
      missingControlsExpectedNotYetBuiltOwned: true,
      controlAbsenceNotCase5Owned: true,
      motionTouchAbsenceFootprintOwned: true,

      labBridgeSourceFootprintOwned: true,
      labRuntimeTableAuthorityOwned: false,
      labTwoCycleLanguageReadOnlyObserved: true,
      macroWestBridgeSourceFootprintOwned: true,
      macroWestReleaseAuthorityOwned: false,
      canvasAuthoritySourceFootprintOwned: true,
      canvasDrawingAuthorityOwned: false,
      canvasFourWayHandoffSourceFootprintOwned: true,
      bishopHubPathVocabularyOwned: true,
      bishopInternalSubjectFileOwnership: false,
      bishopInternalInspectionOwned: false,
      modernFingerVocabularyOwned: true,
      surfacePointerFingerVocabularyOwned: true,

      currentHtmlContract: CURRENT_HTML_CONTRACT,
      previousHtmlContract: PREVIOUS_HTML_CONTRACT,
      foundationHtmlContract: FOUNDATION_HTML_CONTRACT,
      currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
      scriptCacheRouteConductorContract: SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT,
      newsRouteConductorContract: NEWS_ROUTE_CONDUCTOR_CONTRACT,
      compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,

      controlFile: CONTROL_FILE,
      hearthJsControlFunnelFile: HEARTH_JS_CONTROL_FUNNEL_FILE,
      indexJsFile: INDEX_JS_FILE,
      canvasFile: CANVAS_FILE,
      macroWestBridgeFile: MACRO_WEST_HANDOFF_FILE,
      labFiles: clonePlain(LAB_FILES),
      bishopHubs: clonePlain(BISHOP_HUBS),
      fingerFiles: clonePlain(FINGER_FILES),
      modernFingerFiles: clonePlain(MODERN_FINGER_FILES),
      legacyFingerFiles: clonePlain(LEGACY_FINGER_FILES),

      acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
      acceptedIndexJsContracts: ACCEPTED_INDEX_JS_CONTRACTS.slice(),
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),

      lastEastStatus: lastEvidencePacket ? lastEvidencePacket.EAST_STATUS : STATUS.READY,
      lastEastSourceReadStatus: lastEvidencePacket ? lastEvidencePacket.EAST_SOURCE_READ_STATUS : FALLBACK.UNKNOWN,
      lastCacheOrServedContractMismatch: lastEvidencePacket
        ? lastEvidencePacket.CACHE_OR_SERVED_CONTRACT_MISMATCH
        : FALLBACK.UNKNOWN,
      lastCase5Support: lastEvidencePacket ? lastEvidencePacket.CASE_5_SUPPORT : FALLBACK.INSUFFICIENT_EVIDENCE,
      lastServedHtmlContract: lastEvidencePacket ? lastEvidencePacket.SERVED_HTML_CONTRACT : FALLBACK.UNKNOWN,
      lastServedIndexJsContract: lastEvidencePacket ? lastEvidencePacket.SERVED_INDEX_JS_CONTRACT : FALLBACK.UNKNOWN,
      lastServedRouteConductorContract: lastEvidencePacket
        ? lastEvidencePacket.SERVED_ROUTE_CONDUCTOR_CONTRACT
        : FALLBACK.UNKNOWN,
      lastControlFileStatus: lastEvidencePacket ? lastEvidencePacket.CONTROL_FILE_STATUS : FALLBACK.EXPECTED_NOT_YET_BUILT,
      lastMotionTouchStatus: lastEvidencePacket ? lastEvidencePacket.MOTION_TOUCH_STATUS : FALLBACK.WAITING_CONTROL_FILE,
      lastHearthJsControlHandshakeStatus: lastEvidencePacket
        ? lastEvidencePacket.HEARTH_JS_CONTROL_HANDSHAKE_STATUS
        : FALLBACK.EXPECTED_NOT_YET_WIRED,
      lastLabCanvasSharedLanguageStatus: lastEvidencePacket
        ? lastEvidencePacket.LAB_CANVAS_SHARED_LANGUAGE_STATUS
        : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      lastMacroWestBridgeStatus: lastEvidencePacket
        ? lastEvidencePacket.MACRO_WEST_BRIDGE_STATUS
        : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      lastCanvasFourWayHandoffStatus: lastEvidencePacket
        ? lastEvidencePacket.CANVAS_FOUR_WAY_HANDOFF_STATUS
        : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,
      lastBishopHubBridgeStatus: lastEvidencePacket
        ? lastEvidencePacket.BISHOP_HUB_BRIDGE_STATUS
        : FALLBACK.EXPECTED_OR_BRIDGE_NOT_CONFIRMED_BY_EAST,

      ...FINAL_FALSE,

      updatedAt: nowIso()
    };
  }

  function getEastState() {
    return clonePlain(lastState || makeState());
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastEvidencePacket = makeEvidencePacket(state);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticEast = api;
    root.HEARTH.diagnosticRailEast = api;
    root.HEARTH.diagnosticEastCurrentServedSpreadBishopCanvasSourceFootprint = api;
    root.HEARTH.diagnosticEastLabCanvasBridgeSourceFootprint = api;
    root.HEARTH.diagnosticEastReceipt = getEastReceipt();
    root.HEARTH.diagnosticRailEastReceipt = getEastReceipt();
    root.HEARTH.diagnosticEastEvidence = clonePlain(lastEvidencePacket);
    root.HEARTH.diagnosticRailEastEvidence = clonePlain(lastEvidencePacket);

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthDiagnosticEast = api;
    root.DEXTER_LAB.hearthDiagnosticRailEast = api;
    root.DEXTER_LAB.hearthDiagnosticEastCurrentServedSpreadBishopCanvasSourceFootprint = api;
    root.DEXTER_LAB.hearthDiagnosticEastLabCanvasBridgeSourceFootprint = api;

    root.HEARTH_DIAGNOSTIC_EAST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_EAST = api;
    root.HEARTH_DIAGNOSTIC_EAST_CURRENT_SERVED_SPREAD_BISHOP_CANVAS_SOURCE_FOOTPRINT = api;
    root.HEARTH_DIAGNOSTIC_EAST_LAB_CANVAS_BRIDGE_SOURCE_FOOTPRINT = api;
    root.HEARTH_DIAGNOSTIC_EAST_RECEIPT = getEastReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT = getEastReceipt();
    root.HEARTH_DIAGNOSTIC_EAST_EVIDENCE = clonePlain(lastEvidencePacket);
    root.HEARTH_DIAGNOSTIC_RAIL_EAST_EVIDENCE = clonePlain(lastEvidencePacket);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    currentHtmlContract: CURRENT_HTML_CONTRACT,
    previousHtmlContract: PREVIOUS_HTML_CONTRACT,
    foundationHtmlContract: FOUNDATION_HTML_CONTRACT,
    currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
    currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    scriptCacheRouteConductorContract: SCRIPT_CACHE_ROUTE_CONDUCTOR_CONTRACT,
    newsRouteConductorContract: NEWS_ROUTE_CONDUCTOR_CONTRACT,
    compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
    lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,

    controlFile: CONTROL_FILE,
    hearthJsControlFunnelFile: HEARTH_JS_CONTROL_FUNNEL_FILE,
    indexJsFile: INDEX_JS_FILE,
    canvasFile: CANVAS_FILE,
    macroWestBridgeFile: MACRO_WEST_HANDOFF_FILE,
    labFiles: clonePlain(LAB_FILES),
    canvasGlobals: clonePlain(CANVAS_GLOBALS),
    bishopHubs: clonePlain(BISHOP_HUBS),
    fingerFiles: clonePlain(FINGER_FILES),
    modernFingerFiles: clonePlain(MODERN_FINGER_FILES),
    legacyFingerFiles: clonePlain(LEGACY_FINGER_FILES),

    acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
    acceptedIndexJsContracts: ACCEPTED_INDEX_JS_CONTRACTS.slice(),
    acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),

    runEastSourceRead,
    getEastReceipt,
    getEastState,

    supportsServedSourceEvidence: true,
    supportsCurrentSpreadCompatibilitySplit: true,
    supportsHtmlV51CurrentSpread: true,
    supportsRouteConductorV99CurrentSpread: true,
    supportsRouteConductorV97ScriptCacheTransition: true,
    supportsRouteConductorV96Lineage: true,
    supportsRouteConductorV95Compatibility: true,
    supportsRouteConductorV94Lineage: true,
    supportsFalseCase5Prevention: true,
    supportsNorthOnlyAdjudication: true,
    supportsTargetWindowScopedRead: true,
    supportsDiagnosticReceiverHtmlNonTargetGuard: true,
    supportsPlanetaryControlFootprint: true,
    supportsExpectedMissingControlFile: true,
    supportsMotionTouchFootprint: true,
    supportsPlanetaryFileFootprint: true,

    supportsLabRuntimeTableBridgeFootprint: true,
    supportsLabCanvasSharedLanguageFootprint: true,
    supportsMacroWestBridgeFootprint: true,
    supportsCanvasAuthorityFootprint: true,
    supportsCanvasLocalStationFootprint: true,
    supportsCanvasFourWayHandoffFootprint: true,
    supportsBishopHubVocabulary: true,
    supportsBishopInternalsAsNonEastResponsibility: true,
    supportsModernFingerVocabulary: true,
    supportsSurfacePointerFingerVocabulary: true,

    ownsServedSourceEvidence: true,
    ownsCase5EvidenceSupportOnly: true,
    ownsPlanetaryControlFootprintEvidence: true,
    ownsLabBridgeSourceFootprintEvidence: true,
    ownsMacroWestBridgeSourceFootprintEvidence: true,
    ownsCanvasAuthoritySourceFootprintEvidence: true,
    ownsBishopHubPathVocabulary: true,
    ownsModernFingerVocabulary: true,
    ownsSurfacePointerFingerVocabulary: true,

    ownsRenderedTargetEvidence: false,
    ownsFinalPrimaryCase: false,
    ownsRecommendation: false,
    ownsRepair: false,
    ownsCacheRepair: false,
    ownsRuntimeRestart: false,
    ownsCanvasRelease: false,
    ownsMacroWestRelease: false,
    ownsLabRuntimeAuthority: false,
    ownsBishopInternals: false,
    ownsCanvasDrawing: false,
    ownsF13: false,
    ownsF21: false,

    ...FINAL_FALSE
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
