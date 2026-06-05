// /assets/hearth/hearth.diagnostic.rail.js
// HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9
// Full-file replacement.
// Diagnostic rail NORTH parent only.
// Purpose:
// - Preserve NORTH as the integrated diagnostic rail parent already called by the diagnostic receiver.
// - Preserve existing diagnostic route integration: receiver still calls NORTH only.
// - Preserve v8 Canvas-expression / WEST-standard adjudication behavior and compatibility surfaces.
// - Add the eight-way probe bridge map without requiring diagnostic route HTML renewal.
// - Start the under-hood diagnostic instrument from NORTH, not from a separate route.
// - Recognize/load the NORTH probe file as the first under-hood probe bridge file.
// - Preserve EAST as served-source lane, WEST as rendered-target lane, SOUTH as packet-output lane.
// - Add probe lanes: probe.north, probe.east, probe.south, probe.west.
// - Coordinate file-composition knowledge, bridge presence, authority boundaries, and zone-of-infliction reporting.
// - Keep production Hearth files read-only.
// - Keep probes diagnostic-only.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - Macro West release
// - Lab runtime authority
// - Queen/control implementation
// - finger implementation
// - terrain/material/hydrology truth
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_RECEIPT_v9";

  const PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_RECEIPT_v8";

  const LINEAGE_V7_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_TNT_v7";
  const LINEAGE_V7_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_RECEIPT_v7";

  const BASELINE_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_BISHOP_QUEEN_ACCEPTANCE_SCHEMA_ORCHESTRATOR_TNT_v6";
  const BASELINE_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_BISHOP_QUEEN_ACCEPTANCE_SCHEMA_ORCHESTRATOR_RECEIPT_v6";

  const FOUNDATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_TNT_v5";
  const FOUNDATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_RECEIPT_v5";

  const VERSION =
    "2026-06-05.hearth-diagnostic-rail-north-eight-way-probe-bridge-orchestrator-v9";

  const FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const DIAGNOSTIC_HTML_FILE = "/showroom/globe/hearth/diagnostic/index.html";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const RAIL_NORTH_FILE = FILE;
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const LAB_NORTH_FILE = "/assets/lab/runtime-table.js";
  const LAB_EAST_FILE = "/assets/lab/runtime-table.east.js";
  const LAB_SOUTH_FILE = "/assets/lab/runtime-table.south.js";
  const LAB_WEST_FILE = "/assets/lab/runtime-table.west.js";

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const EAST_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const WEST_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const SOUTH_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";

  const PROBE_NORTH_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const PROBE_EAST_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const PROBE_SOUTH_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const PROBE_WEST_TARGET_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    EXPECTED_HTML_CONTRACT,
    "HEARTH_HTML_CONTROL_HANDSHAKE_ROUTE_SHELL_INTEGRATION_TNT_v5",
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4",
    "HEARTH_HTML_PLANET_FACTORY_MIRRORLAND_PUBLIC_SHELL_TNT_v3",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6",
    "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_OPTIMAL_STANDARD_TNT_v2_5",
    "HEARTH_HTML_SINGLE_FLOATING_DIAGNOSTIC_DOORWAY_NO_DUPLICATE_TOP_BANNER_TNT_v2_4",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_TOP_PRIORITY_NATIVE_ACCESS_DOORWAY_TNT_v2_3",
    "HEARTH_HTML_PARALLEL_DIAGNOSTIC_RAIL_NATIVE_ACCESS_DOORWAY_TNT_v2_2",
    "HEARTH_HTML_CONTROL_SURFACE_CACHE_KEY_TOUCH_BINDING_REPAIR_TNT_v2_1"
  ]);

  const ACCEPTED_INDEX_CONTRACTS = Object.freeze([
    EXPECTED_INDEX_CONTRACT,
    "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2",
    "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1",
    "HEARTH_INDEX_JS_CONTROL_SURFACE_EARLY_ACTIVATION_SHIELD_TNT_v5_3"
  ]);

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

  const EIGHT_WAY_BRIDGE = Object.freeze({
    north: Object.freeze({
      railFile: RAIL_NORTH_FILE,
      probeFile: PROBE_NORTH_FILE,
      railContract: CONTRACT,
      probeContract: PROBE_NORTH_TARGET_CONTRACT,
      role: "north-parent-and-file-composition-zone-coordinator"
    }),
    east: Object.freeze({
      railFile: RAIL_EAST_FILE,
      probeFile: PROBE_EAST_FILE,
      railContract: EAST_TARGET_CONTRACT,
      probeContract: PROBE_EAST_TARGET_CONTRACT,
      role: "served-source-and-source-composition-probe"
    }),
    south: Object.freeze({
      railFile: RAIL_SOUTH_FILE,
      probeFile: PROBE_SOUTH_FILE,
      railContract: SOUTH_TARGET_CONTRACT,
      probeContract: PROBE_SOUTH_TARGET_CONTRACT,
      role: "packet-output-and-meaning-preservation-probe"
    }),
    west: Object.freeze({
      railFile: RAIL_WEST_FILE,
      probeFile: PROBE_WEST_FILE,
      railContract: WEST_TARGET_CONTRACT,
      probeContract: PROBE_WEST_TARGET_CONTRACT,
      role: "rendered-target-and-expression-composition-probe"
    })
  });

  const NO_CLAIMS = Object.freeze({
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

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  let lastState = null;
  let lastReport = null;
  let lastVerdict = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let loadProbeNorthPromise = null;

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

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function findFirstPath(paths) {
    for (const path of paths) {
      const value = readPath(path);
      if (value) return { path, value };
    }
    return { path: "NONE", value: null };
  }

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      return source[key] === undefined || source[key] === null ? fallback : source[key];
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

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((entry) => bounded(entry, 1200)).filter(Boolean).join(" | ");
      return joined || fallback;
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

  function getValue(source, key, fallback = "UNKNOWN") {
    return packetValue(getRaw(source, key, undefined), fallback);
  }

  function asBool(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
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

  function addNote(state, note) {
    const clean = bounded(note, 1400);
    if (!clean) return;
    if (!state.notes.includes(clean)) state.notes.push(clean);
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getStatus",
      "getState",
      "getNorthVerdict",
      "getEastReceipt",
      "getWestReceipt",
      "getSouthReceipt",
      "getProbeReceipt",
      "getProbeNorthReceipt",
      "getCompositionReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;
      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.report)) return authority.report;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function scriptExistsFor(path) {
    if (!doc) return false;
    const scripts = Array.from(doc.querySelectorAll("script[src]"));
    return scripts.some((script) => {
      const src = safeString(script.getAttribute("src"));
      try {
        const url = new URL(src, root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com");
        return url.pathname === path;
      } catch (_error) {
        return src.includes(path);
      }
    });
  }

  function loadScriptOnce(path, id) {
    if (!doc) {
      return Promise.resolve({
        attempted: false,
        loaded: false,
        status: "DOCUMENT_UNAVAILABLE",
        path
      });
    }

    if (scriptExistsFor(path)) {
      return Promise.resolve({
        attempted: false,
        loaded: true,
        status: "SCRIPT_ALREADY_PRESENT",
        path
      });
    }

    return new Promise((resolve) => {
      try {
        const script = doc.createElement("script");
        script.id = id;
        script.src = `${path}?v=${encodeURIComponent(CONTRACT)}`;
        script.async = false;
        script.defer = true;
        script.dataset.loadedBy = CONTRACT;
        script.dataset.diagnosticProbeBridge = "true";
        script.dataset.productionMutationAuthorized = "false";
        script.dataset.visualPassClaimed = "false";
        script.dataset.generatedImage = "false";
        script.dataset.graphicBox = "false";
        script.dataset.webgl = "false";

        script.addEventListener("load", () => {
          resolve({
            attempted: true,
            loaded: true,
            status: "SCRIPT_LOAD_COMPLETE",
            path
          });
        }, { once: true });

        script.addEventListener("error", () => {
          resolve({
            attempted: true,
            loaded: false,
            status: "SCRIPT_LOAD_ERROR_OR_NOT_YET_DEPLOYED",
            path
          });
        }, { once: true });

        (doc.head || doc.documentElement || doc.body).appendChild(script);
      } catch (error) {
        resolve({
          attempted: true,
          loaded: false,
          status: `SCRIPT_LOAD_EXCEPTION:${bounded(error && error.message ? error.message : error, 1000)}`,
          path
        });
      }
    });
  }

  function discoverRailChildren() {
    return {
      east: findFirstPath([
        "HEARTH.diagnosticEast",
        "HEARTH.diagnosticRailEast",
        "HEARTH_DIAGNOSTIC_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_EAST",
        "DEXTER_LAB.hearthDiagnosticEast",
        "DEXTER_LAB.hearthDiagnosticRailEast"
      ]),
      west: findFirstPath([
        "HEARTH.diagnosticWest",
        "HEARTH.diagnosticRailWest",
        "HEARTH_DIAGNOSTIC_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_WEST",
        "DEXTER_LAB.hearthDiagnosticWest",
        "DEXTER_LAB.hearthDiagnosticRailWest"
      ]),
      south: findFirstPath([
        "HEARTH.diagnosticSouth",
        "HEARTH.diagnosticRailSouth",
        "HEARTH_DIAGNOSTIC_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
        "DEXTER_LAB.hearthDiagnosticSouth",
        "DEXTER_LAB.hearthDiagnosticRailSouth"
      ])
    };
  }

  function discoverProbeNorth() {
    return findFirstPath([
      "HEARTH.diagnosticProbeNorth",
      "HEARTH.diagnosticRailProbeNorth",
      "HEARTH.diagnosticNorthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_NORTH",
      "DEXTER_LAB.hearthDiagnosticProbeNorth",
      "DEXTER_LAB.hearthDiagnosticRailProbeNorth"
    ]);
  }

  function discoverExistingAuthorities() {
    const labNorth = findFirstPath([
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND",
      "LAB_RUNTIME_TABLE_NORTH_CENTRAL_TRAIN_STATION",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northCentralTrainStation",
      "DEXTER_LAB.hearthCheckpointSession",
      "HEARTH.northCentralTrainStation",
      "HEARTH.northCommandRuntimeTable"
    ]);

    const macroWest = findFirstPath([
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "HEARTH_RUNTIME_TABLE_WEST",
      "HEARTH_WEST_ADMISSIBILITY",
      "HEARTH.westRuntimeTable",
      "HEARTH.runtimeTableWest",
      "HEARTH.westAdmissibility",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.hearthRuntimeTableWest",
      "DEXTER_LAB.westAdmissibility"
    ]);

    const canvas = findFirstPath([
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH_CANVAS_LOCAL_STATION",
      "HEARTH_CANVAS_STATION",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasHub",
      "HEARTH.canvas",
      "HEARTH.canvasExpressionHub",
      "HEARTH.canvasLocalStation",
      "HEARTH.canvasStation",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasExpressionHub",
      "DEXTER_LAB.hearthCanvasLocalStation"
    ]);

    const routeConductor = findFirstPath([
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH_ROUTE_NORTH_BISHOP",
      "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "HEARTH.routeConductor",
      "HEARTH.routeNorthBishop",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteNorthBishop",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
    ]);

    const controls = findFirstPath([
      "HEARTH_CONTROLS_QUEEN",
      "HEARTH_QUEEN_CONTROLS",
      "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
      "HEARTH_CONTROLS",
      "HEARTH.controlsQueen",
      "HEARTH.queenControls",
      "HEARTH.controlsPlanetaryViewInputHandshake",
      "HEARTH.controls",
      "DEXTER_LAB.hearthQueenControls",
      "DEXTER_LAB.hearthControls"
    ]);

    return { labNorth, macroWest, canvas, routeConductor, controls };
  }

  function makeState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV7Contract: LINEAGE_V7_CONTRACT,
      lineageV7Receipt: LINEAGE_V7_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      foundationContract: FOUNDATION_CONTRACT,
      foundationReceipt: FOUNDATION_RECEIPT,
      version: VERSION,

      packetName: REPORT_PACKET,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: nowIso(),

      northFile: RAIL_NORTH_FILE,
      eastFile: RAIL_EAST_FILE,
      southFile: RAIL_SOUTH_FILE,
      westFile: RAIL_WEST_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeSouthFile: PROBE_SOUTH_FILE,
      probeWestFile: PROBE_WEST_FILE,

      eightWayProbeBridgeActive: true,
      eightWayProbeBridgeMap: clonePlain(EIGHT_WAY_BRIDGE),
      visibleParentIntegrated: true,
      receiverStillCallsNorthOnly: true,
      diagnosticRouteHtmlRenewalRequired: false,

      probeNorthLoadAttempted: false,
      probeNorthLoadStatus: "NOT_ATTEMPTED",
      probeNorthObserved: false,
      probeNorthSourcePath: "NONE",
      probeNorthContract: "UNKNOWN",
      probeNorthReceipt: "UNKNOWN",
      probeNorthStatus: "WAITING_PROBE_NORTH",
      probeNorthRequiredNext: true,

      probeEastObserved: false,
      probeSouthObserved: false,
      probeWestObserved: false,

      eastRailObserved: false,
      eastRailStatus: "UNKNOWN",
      eastRailContract: "UNKNOWN",
      eastRailEvidenceStatus: "UNKNOWN",
      eastEvidence: {},

      westRailObserved: false,
      westRailStatus: "UNKNOWN",
      westRailContract: "UNKNOWN",
      westRailEvidenceStatus: "UNKNOWN",
      westEvidence: {},

      southRailObserved: false,
      southRailStatus: "UNKNOWN",
      southRailContract: "UNKNOWN",
      southOutputStatus: "UNKNOWN",
      southMeaningPreserved: "UNKNOWN",

      labNorthObserved: false,
      labNorthSourcePath: "NONE",
      labNorthContract: "UNKNOWN",
      macroWestObserved: false,
      macroWestSourcePath: "NONE",
      macroWestContract: "UNKNOWN",
      canvasObserved: false,
      canvasSourcePath: "NONE",
      canvasContract: "UNKNOWN",
      routeConductorObserved: false,
      routeConductorSourcePath: "NONE",
      routeConductorContract: "UNKNOWN",
      controlsObserved: false,
      controlsSourcePath: "NONE",
      controlsContract: "UNKNOWN",

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexJsContract: EXPECTED_INDEX_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      servedHtmlContract: "UNKNOWN",
      servedIndexJsContract: "UNKNOWN",
      servedRouteConductorContract: "UNKNOWN",
      indexScriptSrc: "UNKNOWN",
      routeConductorScriptSrc: "UNKNOWN",
      currentVisibleHearthStatus: "UNKNOWN",
      cacheOrServedContractMismatch: "UNKNOWN",
      servedContractMismatchIsBlocking: "UNKNOWN",
      cacheKeyStaleNonBlocking: "UNKNOWN",

      diagnosticTargetAccessStatus: "UNKNOWN",
      diagnosticTargetAccessError: "UNKNOWN",
      renderedPlanetProofReady: "UNKNOWN",
      visiblePlanetProofReady: "UNKNOWN",
      visiblePlanetProofSource: "UNKNOWN",
      canvasExpressionProofStatus: "UNKNOWN",
      canvasExpressionBottleneckClass: "UNKNOWN",
      canvasExpressionSurfaceReady: "UNKNOWN",
      canvasExpressionRichnessReady: "UNKNOWN",
      domExpressionSurfaceProofReady: "UNKNOWN",
      canvasPixelVarianceStatus: "UNKNOWN",
      canvasFingerExpressionStatus: "UNKNOWN",
      fourWayCanvasHandoffStatus: "UNKNOWN",
      currentCanvasParentContract: "UNKNOWN",
      currentCanvasParentRecognized: "UNKNOWN",

      controlFileStatus: "UNKNOWN",
      controlFileLoaded: "UNKNOWN",
      controlGlobalPresent: "UNKNOWN",
      controlReceiptPresent: "UNKNOWN",
      controlHandshakeStatus: "UNKNOWN",
      motionTouchStatus: "UNKNOWN",
      dragStatus: "UNKNOWN",
      viewControlStatus: "UNKNOWN",
      visiblePlanetAllowedWithoutControls: "true",

      showReceiptActionResult: "UNKNOWN",
      runtimeReleaseState: "UNKNOWN",
      runtimeReleaseIsLock: "UNKNOWN",

      fileCompositionStatus: "WAITING_PROBE_NORTH",
      diagnosticInstrumentStatus: "VISIBLE_PARENT_PRESENT_UNDER_HOOD_PROBE_NORTH_PENDING",
      canvasExpressionInstrumentationStatus: "STAGE_AND_MOUNT_CAN_BE_RECOGNIZED_BUT_COMPOSITION_PROBE_PENDING",

      zoneOfInflictionOwner: "UNRESOLVED_UNTIL_PROBE_NORTH",
      zoneOfInflictionFile: PROBE_NORTH_FILE,
      zoneOfInflictionClass: "PROBE_NORTH_REQUIRED",
      zoneOfInflictionReason: "NORTH_PARENT_RENEWED_FIRST_PROBE_NORTH_MUST_SUPPLY_FILE_COMPOSITION_AND_ZONE_COORDINATION",

      primaryCase: "INCONCLUSIVE_EVIDENCE",
      calibrationStatus: "CALIBRATION_HOLD_PROBE_NORTH_REQUIRED",
      calibrationHoldReason: "VISIBLE_DIAGNOSTIC_PARENT_PRESENT_UNDER_HOOD_PROBE_NORTH_NOT_YET_PRESENT",
      diagnosticRailClean: "false",
      calibrationPointReached: "false",

      newsAlignmentStatus: "NEWS_ALIGNMENT_PARTIAL",
      newsAlignmentScore: 0,
      newsAlignmentFirstFailedStage: "PROBE_NORTH_READ",
      fibonacciSynchronizationStatus: "FIBONACCI_SYNCHRONIZATION_PARTIAL",
      fibonacciSynchronizationScore: 0,
      fibonacciSynchronizationFirstFailedStage: "F8",

      recommendedNextOwner: "DIAGNOSTIC_PROBE_NORTH",
      recommendedNextFile: PROBE_NORTH_FILE,
      recommendedNextAction: "CREATE_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_AS_SECOND_FILE_IN_EIGHT_WAY_BRIDGE",

      notes: [
        "NORTH_V9_EIGHT_WAY_PROBE_BRIDGE_SCHEMA_ACTIVE",
        "NORTH_PARENT_REMAINS_EXISTING_DIAGNOSTIC_RAIL_INTEGRATION_POINT",
        "DIAGNOSTIC_RECEIVER_STILL_CALLS_NORTH_ONLY",
        "PROBE_NORTH_IS_FIRST_UNDER_HOOD_FILE_COMPOSITION_INSTRUMENT",
        "NO_PRODUCTION_MUTATION_AUTHORIZED"
      ],

      reportObject: {},
      northVerdict: {},
      fullPacketText: "",
      compactSummary: "",

      ...NO_CLAIMS
    };
  }

  function applyAuthorityRead(state) {
    const authorities = discoverExistingAuthorities();

    const labNorthReceipt = getReceiptFromAuthority(authorities.labNorth.value) || {};
    state.labNorthObserved = Boolean(authorities.labNorth.value || labNorthReceipt.contract || labNorthReceipt.CONTRACT);
    state.labNorthSourcePath = authorities.labNorth.path;
    state.labNorthContract = firstNonEmpty(labNorthReceipt.contract, labNorthReceipt.CONTRACT, authorities.labNorth.value && authorities.labNorth.value.contract, "UNKNOWN");

    const macroWestReceipt = getReceiptFromAuthority(authorities.macroWest.value) || {};
    state.macroWestObserved = Boolean(authorities.macroWest.value || macroWestReceipt.contract || macroWestReceipt.CONTRACT);
    state.macroWestSourcePath = authorities.macroWest.path;
    state.macroWestContract = firstNonEmpty(macroWestReceipt.contract, macroWestReceipt.CONTRACT, authorities.macroWest.value && authorities.macroWest.value.contract, "UNKNOWN");

    const canvasReceipt = getReceiptFromAuthority(authorities.canvas.value) || {};
    state.canvasObserved = Boolean(authorities.canvas.value || canvasReceipt.contract || canvasReceipt.CONTRACT);
    state.canvasSourcePath = authorities.canvas.path;
    state.canvasContract = firstNonEmpty(
      canvasReceipt.currentCanvasParentContract,
      canvasReceipt.canvasContract,
      canvasReceipt.contract,
      canvasReceipt.CONTRACT,
      authorities.canvas.value && authorities.canvas.value.contract,
      "UNKNOWN"
    );

    const routeReceipt = getReceiptFromAuthority(authorities.routeConductor.value) || {};
    state.routeConductorObserved = Boolean(authorities.routeConductor.value || routeReceipt.contract || routeReceipt.CONTRACT);
    state.routeConductorSourcePath = authorities.routeConductor.path;
    state.routeConductorContract = firstNonEmpty(
      routeReceipt.contract,
      routeReceipt.CONTRACT,
      authorities.routeConductor.value && authorities.routeConductor.value.contract,
      "UNKNOWN"
    );

    const controlReceipt = getReceiptFromAuthority(authorities.controls.value) || {};
    state.controlsObserved = Boolean(authorities.controls.value || controlReceipt.contract || controlReceipt.CONTRACT);
    state.controlsSourcePath = authorities.controls.path;
    state.controlsContract = firstNonEmpty(
      controlReceipt.controlContract,
      controlReceipt.contract,
      controlReceipt.CONTRACT,
      authorities.controls.value && authorities.controls.value.contract,
      "UNKNOWN"
    );

    if (state.labNorthObserved) addNote(state, `LAB_NORTH_AUTHORITY_OBSERVED:${state.labNorthSourcePath}`);
    if (state.macroWestObserved) addNote(state, `MACRO_WEST_AUTHORITY_OBSERVED:${state.macroWestSourcePath}`);
    if (state.canvasObserved) addNote(state, `CANVAS_AUTHORITY_OBSERVED:${state.canvasSourcePath}`);
    if (state.routeConductorObserved) addNote(state, `ROUTE_CONDUCTOR_AUTHORITY_OBSERVED:${state.routeConductorSourcePath}`);
    if (state.controlsObserved) addNote(state, `CONTROL_AUTHORITY_OBSERVED:${state.controlsSourcePath}`);
  }

  async function ensureProbeNorth(state, options = {}) {
    const foundBefore = discoverProbeNorth();

    if (foundBefore.value) {
      state.probeNorthObserved = true;
      state.probeNorthSourcePath = foundBefore.path;
      const receipt = getReceiptFromAuthority(foundBefore.value) || {};
      state.probeNorthContract = firstNonEmpty(receipt.contract, receipt.CONTRACT, foundBefore.value.contract, "UNKNOWN");
      state.probeNorthReceipt = firstNonEmpty(receipt.receipt, receipt.RECEIPT, foundBefore.value.receipt, "UNKNOWN");
      state.probeNorthStatus = "PROBE_NORTH_OBSERVED";
      state.probeNorthRequiredNext = false;
      addNote(state, `PROBE_NORTH_OBSERVED:${foundBefore.path}`);
      return foundBefore;
    }

    if (options.loadProbeNorth === false) {
      state.probeNorthLoadStatus = "LOAD_SKIPPED_BY_OPTIONS";
      state.probeNorthStatus = "PROBE_NORTH_NOT_OBSERVED";
      return foundBefore;
    }

    if (!loadProbeNorthPromise) {
      loadProbeNorthPromise = loadScriptOnce(PROBE_NORTH_FILE, "hearth-diagnostic-probe-north-script");
    }

    const load = await loadProbeNorthPromise;
    state.probeNorthLoadAttempted = load.attempted === true;
    state.probeNorthLoadStatus = load.status;

    const foundAfter = discoverProbeNorth();

    if (foundAfter.value) {
      state.probeNorthObserved = true;
      state.probeNorthSourcePath = foundAfter.path;
      const receipt = getReceiptFromAuthority(foundAfter.value) || {};
      state.probeNorthContract = firstNonEmpty(receipt.contract, receipt.CONTRACT, foundAfter.value.contract, "UNKNOWN");
      state.probeNorthReceipt = firstNonEmpty(receipt.receipt, receipt.RECEIPT, foundAfter.value.receipt, "UNKNOWN");
      state.probeNorthStatus = "PROBE_NORTH_OBSERVED_AFTER_PARENT_LOAD";
      state.probeNorthRequiredNext = false;
      addNote(state, `PROBE_NORTH_OBSERVED_AFTER_PARENT_LOAD:${foundAfter.path}`);
      return foundAfter;
    }

    state.probeNorthObserved = false;
    state.probeNorthStatus = "PROBE_NORTH_EXPECTED_NOT_YET_PRESENT";
    state.probeNorthRequiredNext = true;
    addNote(state, "PROBE_NORTH_EXPECTED_NOT_YET_PRESENT_SECOND_FILE_REQUIRED");
    return foundAfter;
  }

  async function runProbeNorth(state, probeFound, railPayload, options = {}) {
    const probe = probeFound && probeFound.value;

    if (!probe || !isObject(probe)) {
      state.fileCompositionStatus = "WAITING_PROBE_NORTH";
      state.diagnosticInstrumentStatus = "VISIBLE_PARENT_PRESENT_UNDER_HOOD_PROBE_NORTH_PENDING";
      state.zoneOfInflictionOwner = "DIAGNOSTIC_PROBE_NORTH";
      state.zoneOfInflictionFile = PROBE_NORTH_FILE;
      state.zoneOfInflictionClass = "PROBE_NORTH_REQUIRED";
      state.zoneOfInflictionReason =
        "NORTH_PARENT_CAN_SEE_RAILS_BUT_PROBE_NORTH_MUST_COORDINATE_FILE_COMPOSITION_AND_ZONE_OF_INFLICTION";
      return {};
    }

    const methods = [
      "runProbeNorth",
      "inspectFileComposition",
      "composeFileComposition",
      "runProbe",
      "inspect"
    ];

    for (const method of methods) {
      if (!isFunction(probe[method])) continue;

      try {
        const output = await Promise.resolve(probe[method]({
          northContract: CONTRACT,
          previousNorthContract: PREVIOUS_CONTRACT,
          targetRoute: TARGET_ROUTE,
          diagnosticRoute: DIAGNOSTIC_ROUTE,
          eightWayBridgeMap: clonePlain(EIGHT_WAY_BRIDGE),
          railPayload: clonePlain(railPayload),
          state: clonePlain(state),
          options: clonePlain(options),
          noClaims: clonePlain(NO_CLAIMS)
        }));

        const report = isObject(output && output.report) ? output.report :
          isObject(output && output.evidence) ? output.evidence :
            isObject(output) ? output : {};

        state.fileCompositionStatus = getValue(report, "FILE_COMPOSITION_STATUS", getValue(report, "fileCompositionStatus", "PROBE_NORTH_COMPOSITION_RETURNED"));
        state.diagnosticInstrumentStatus = getValue(report, "DIAGNOSTIC_INSTRUMENT_STATUS", getValue(report, "diagnosticInstrumentStatus", "UNDER_HOOD_PROBE_NORTH_ACTIVE"));
        state.canvasExpressionInstrumentationStatus = getValue(report, "CANVAS_EXPRESSION_INSTRUMENTATION_STATUS", getValue(report, "canvasExpressionInstrumentationStatus", state.canvasExpressionInstrumentationStatus));

        state.zoneOfInflictionOwner = getValue(report, "ZONE_OF_INFLICTION_OWNER", getValue(report, "zoneOfInflictionOwner", state.zoneOfInflictionOwner));
        state.zoneOfInflictionFile = getValue(report, "ZONE_OF_INFLICTION_FILE", getValue(report, "zoneOfInflictionFile", state.zoneOfInflictionFile));
        state.zoneOfInflictionClass = getValue(report, "ZONE_OF_INFLICTION_CLASS", getValue(report, "zoneOfInflictionClass", state.zoneOfInflictionClass));
        state.zoneOfInflictionReason = getValue(report, "ZONE_OF_INFLICTION_REASON", getValue(report, "zoneOfInflictionReason", state.zoneOfInflictionReason));

        addNote(state, `PROBE_NORTH_RAN:${method}`);
        return report;
      } catch (error) {
        addNote(state, `PROBE_NORTH_METHOD_FAILED:${method}:${bounded(error && error.message ? error.message : error, 1000)}`);
      }
    }

    state.fileCompositionStatus = "PROBE_NORTH_OBSERVED_API_MISSING";
    state.diagnosticInstrumentStatus = "PROBE_NORTH_PRESENT_BUT_NO_ACCEPTED_RUN_METHOD";
    state.zoneOfInflictionOwner = "DIAGNOSTIC_PROBE_NORTH";
    state.zoneOfInflictionFile = PROBE_NORTH_FILE;
    state.zoneOfInflictionClass = "PROBE_NORTH_API_MISSING";
    state.zoneOfInflictionReason = "PROBE_NORTH_PRESENT_BUT_REQUIRED_RUN_INTERFACE_NOT_FOUND";

    return {};
  }

  async function runEastRail(state, children, options = {}) {
    const child = children.east.value;

    state.eastRailObserved = Boolean(child);
    if (!child) {
      state.eastRailStatus = "EAST_RAIL_NOT_OBSERVED";
      state.eastRailEvidenceStatus = "MISSING";
      addNote(state, "EAST_RAIL_NOT_OBSERVED");
      return {};
    }

    const receipt = getReceiptFromAuthority(child) || {};
    state.eastRailContract = firstNonEmpty(receipt.contract, receipt.CONTRACT, receipt.implementationContract, "UNKNOWN");

    if (!isFunction(child.runEastSourceRead)) {
      state.eastRailStatus = "EAST_RAIL_API_MISSING";
      state.eastRailEvidenceStatus = "INVALID_API";
      addNote(state, "EAST_RAIL_API_MISSING_RUN_EAST_SOURCE_READ");
      return {};
    }

    try {
      const output = await Promise.resolve(child.runEastSourceRead({
        northContract: CONTRACT,
        previousNorthContract: PREVIOUS_CONTRACT,
        currentHtmlContract: EXPECTED_HTML_CONTRACT,
        currentIndexJsContract: EXPECTED_INDEX_CONTRACT,
        currentRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
        acceptedIndexContracts: ACCEPTED_INDEX_CONTRACTS.slice(),
        acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
        eightWayProbeBridgeActive: true,
        probeNorthFile: PROBE_NORTH_FILE,
        canvasFile: CANVAS_FILE,
        controlFile: CONTROL_FILE,
        options: clonePlain(options)
      }));

      const evidence = isObject(output && output.evidence) ? output.evidence :
        isObject(output && output.report) ? output.report :
          isObject(output) ? output : {};

      state.eastEvidence = clonePlain(evidence);
      state.eastRailStatus = getValue(evidence, "EAST_SOURCE_READ_STATUS", "COMPLETE");
      state.eastRailEvidenceStatus = "VALID_OR_COMPATIBLE";

      state.servedHtmlContract = getValue(evidence, "SERVED_HTML_CONTRACT", state.servedHtmlContract);
      state.servedIndexJsContract = getValue(evidence, "SERVED_INDEX_JS_CONTRACT", state.servedIndexJsContract);
      state.servedRouteConductorContract = getValue(evidence, "SERVED_ROUTE_CONDUCTOR_CONTRACT", state.servedRouteConductorContract);
      state.indexScriptSrc = getValue(evidence, "INDEX_SCRIPT_SRC", state.indexScriptSrc);
      state.routeConductorScriptSrc = getValue(evidence, "ROUTE_CONDUCTOR_SCRIPT_SRC", state.routeConductorScriptSrc);
      state.cacheOrServedContractMismatch = getValue(evidence, "CACHE_OR_SERVED_CONTRACT_MISMATCH", state.cacheOrServedContractMismatch);

      state.controlFileStatus = getValue(evidence, "CONTROL_FILE_STATUS", state.controlFileStatus);
      state.controlFileLoaded = getValue(evidence, "CONTROL_FILE_LOADED", state.controlFileLoaded);
      state.controlGlobalPresent = getValue(evidence, "CONTROL_GLOBAL_PRESENT", state.controlGlobalPresent);
      state.controlReceiptPresent = getValue(evidence, "CONTROL_RECEIPT_PRESENT", state.controlReceiptPresent);
      state.controlHandshakeStatus = getValue(evidence, "CONTROL_HANDSHAKE_STATUS", state.controlHandshakeStatus);
      state.motionTouchStatus = getValue(evidence, "MOTION_TOUCH_STATUS", state.motionTouchStatus);
      state.dragStatus = getValue(evidence, "DRAG_STATUS", state.dragStatus);
      state.viewControlStatus = getValue(evidence, "VIEW_CONTROL_STATUS", state.viewControlStatus);

      for (const note of normalizeNotes(getValue(evidence, "EAST_SECONDARY_EVIDENCE_NOTES", ""), getValue(evidence, "SECONDARY_EVIDENCE_NOTES", ""))) {
        addNote(state, note);
      }

      addNote(state, "EAST_RAIL_EVIDENCE_CONSUMED_BY_NORTH_V9");
      return evidence;
    } catch (error) {
      state.eastRailStatus = "EAST_RAIL_RUN_ERROR";
      state.eastRailEvidenceStatus = "UNREADABLE";
      addNote(state, `EAST_RAIL_RUN_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
      return {};
    }
  }

  async function runWestRail(state, children, options = {}) {
    const child = children.west.value;

    state.westRailObserved = Boolean(child);
    if (!child) {
      state.westRailStatus = "WEST_RAIL_NOT_OBSERVED";
      state.westRailEvidenceStatus = "MISSING";
      addNote(state, "WEST_RAIL_NOT_OBSERVED");
      return {};
    }

    const receipt = getReceiptFromAuthority(child) || {};
    state.westRailContract = firstNonEmpty(receipt.contract, receipt.CONTRACT, receipt.implementationContract, "UNKNOWN");

    if (!isFunction(child.runWestRenderedRead)) {
      state.westRailStatus = "WEST_RAIL_API_MISSING";
      state.westRailEvidenceStatus = "INVALID_API";
      addNote(state, "WEST_RAIL_API_MISSING_RUN_WEST_RENDERED_READ");
      return {};
    }

    try {
      const westOptions = {
        northContract: CONTRACT,
        previousNorthContract: PREVIOUS_CONTRACT,
        currentRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
        westStandardImplementationContract: WEST_TARGET_CONTRACT,
        eightWayProbeBridgeActive: true,
        probeNorthObserved: state.probeNorthObserved,
        probeNorthFile: PROBE_NORTH_FILE,
        labNorthObserved: state.labNorthObserved,
        macroWestObserved: state.macroWestObserved,
        canvasObserved: state.canvasObserved,
        canvasContract: state.canvasContract,
        options: clonePlain(options)
      };

      if (options.targetDocument) westOptions.targetDocument = options.targetDocument;
      if (options.targetWindow) westOptions.targetWindow = options.targetWindow;
      if (options.frameElement) westOptions.frameElement = options.frameElement;

      const output = await Promise.resolve(child.runWestRenderedRead(westOptions));

      const evidence = isObject(output && output.evidence) ? output.evidence :
        isObject(output && output.report) ? output.report :
          isObject(output) ? output : {};

      state.westEvidence = clonePlain(evidence);
      state.westRailStatus = getValue(evidence, "WEST_RENDERED_READ_STATUS", "COMPLETE");
      state.westRailEvidenceStatus = "VALID_OR_COMPATIBLE";

      state.diagnosticTargetAccessStatus = getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_STATUS", state.diagnosticTargetAccessStatus);
      state.diagnosticTargetAccessError = getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_ERROR", state.diagnosticTargetAccessError);
      state.currentVisibleHearthStatus = getValue(evidence, "CURRENT_VISIBLE_HEARTH_STATUS", state.currentVisibleHearthStatus);

      state.renderedPlanetProofReady = getValue(evidence, "RENDERED_PLANET_PROOF_READY", state.renderedPlanetProofReady);
      state.visiblePlanetProofReady = getValue(evidence, "VISIBLE_PLANET_PROOF_READY", state.visiblePlanetProofReady);
      state.visiblePlanetProofSource = getValue(evidence, "VISIBLE_PLANET_PROOF_SOURCE", state.visiblePlanetProofSource);
      state.canvasExpressionProofStatus = getValue(evidence, "CANVAS_EXPRESSION_PROOF_STATUS", state.canvasExpressionProofStatus);
      state.canvasExpressionBottleneckClass = getValue(evidence, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", state.canvasExpressionBottleneckClass);
      state.canvasExpressionSurfaceReady = getValue(evidence, "CANVAS_EXPRESSION_SURFACE_READY", state.canvasExpressionSurfaceReady);
      state.canvasExpressionRichnessReady = getValue(evidence, "CANVAS_EXPRESSION_RICHNESS_READY", state.canvasExpressionRichnessReady);
      state.domExpressionSurfaceProofReady = getValue(evidence, "DOM_EXPRESSION_SURFACE_PROOF_READY", state.domExpressionSurfaceProofReady);
      state.canvasPixelVarianceStatus = getValue(evidence, "CANVAS_PIXEL_VARIANCE_STATUS", state.canvasPixelVarianceStatus);
      state.canvasFingerExpressionStatus = getValue(evidence, "CANVAS_FINGER_EXPRESSION_STATUS", state.canvasFingerExpressionStatus);
      state.fourWayCanvasHandoffStatus = getValue(evidence, "FOUR_WAY_CANVAS_HANDOFF_STATUS", state.fourWayCanvasHandoffStatus);
      state.currentCanvasParentContract = getValue(evidence, "CURRENT_CANVAS_PARENT_CONTRACT", state.currentCanvasParentContract);
      state.currentCanvasParentRecognized = getValue(evidence, "CURRENT_CANVAS_PARENT_RECOGNIZED", state.currentCanvasParentRecognized);

      state.showReceiptActionResult = getValue(evidence, "SHOW_RECEIPT_ACTION_RESULT", state.showReceiptActionResult);
      state.runtimeReleaseState = getValue(evidence, "RUNTIME_RELEASE_STATE", state.runtimeReleaseState);
      state.runtimeReleaseIsLock = getValue(evidence, "RUNTIME_RELEASE_IS_LOCK", state.runtimeReleaseIsLock);

      state.controlFileStatus = getValue(evidence, "CONTROL_FILE_STATUS", state.controlFileStatus);
      state.controlFileLoaded = getValue(evidence, "CONTROL_FILE_LOADED", state.controlFileLoaded);
      state.controlGlobalPresent = getValue(evidence, "CONTROL_GLOBAL_PRESENT", state.controlGlobalPresent);
      state.controlReceiptPresent = getValue(evidence, "CONTROL_RECEIPT_PRESENT", state.controlReceiptPresent);
      state.controlHandshakeStatus = getValue(evidence, "CONTROL_HANDSHAKE_STATUS", state.controlHandshakeStatus);
      state.motionTouchStatus = getValue(evidence, "MOTION_TOUCH_STATUS", state.motionTouchStatus);
      state.dragStatus = getValue(evidence, "DRAG_STATUS", state.dragStatus);
      state.viewControlStatus = getValue(evidence, "VIEW_CONTROL_STATUS", state.viewControlStatus);

      for (const note of normalizeNotes(getValue(evidence, "WEST_SECONDARY_EVIDENCE_NOTES", ""), getValue(evidence, "SECONDARY_EVIDENCE_NOTES", ""))) {
        addNote(state, note);
      }

      addNote(state, "WEST_RAIL_EVIDENCE_CONSUMED_BY_NORTH_V9");
      return evidence;
    } catch (error) {
      state.westRailStatus = "WEST_RAIL_RUN_ERROR";
      state.westRailEvidenceStatus = "UNREADABLE";
      addNote(state, `WEST_RAIL_RUN_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
      return {};
    }
  }

  function routeContractRecognized(state) {
    const joined = [
      state.servedRouteConductorContract,
      state.routeConductorContract,
      state.currentVisibleHearthStatus,
      state.runtimeReleaseState
    ].join(" | ");

    return ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.some((contract) => joined.includes(contract));
  }

  function currentSpreadRecognized(state) {
    const htmlOk = state.servedHtmlContract === "UNKNOWN" || ACCEPTED_HTML_CONTRACTS.includes(state.servedHtmlContract);
    const indexOk = state.servedIndexJsContract === "UNKNOWN" || ACCEPTED_INDEX_CONTRACTS.includes(state.servedIndexJsContract);
    const routeOk = routeContractRecognized(state) || state.servedRouteConductorContract === "UNKNOWN";

    return htmlOk && indexOk && routeOk;
  }

  function applyNorthAdjudication(state, probeReport = {}) {
    const spreadOk = currentSpreadRecognized(state);
    const staleQueryKey = safeString(state.routeConductorScriptSrc).includes("HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7") && routeContractRecognized(state);

    state.cacheKeyStaleNonBlocking = boolText(staleQueryKey, "false");
    state.servedContractMismatchIsBlocking = boolText(!spreadOk, "false");

    if (staleQueryKey) addNote(state, "CACHE_KEY_STALE_NON_BLOCKING:SCRIPT_QUERY_KEY_DOES_NOT_CONTROL_RENDERED_CONTRACT");

    if (state.probeNorthObserved && state.fileCompositionStatus !== "WAITING_PROBE_NORTH") {
      state.probeNorthRequiredNext = false;
      state.calibrationStatus = getValue(probeReport, "CALIBRATION_STATUS", state.calibrationStatus);
      state.calibrationHoldReason = getValue(probeReport, "CALIBRATION_HOLD_REASON", state.calibrationHoldReason);
      state.recommendedNextOwner = getValue(probeReport, "RECOMMENDED_NEXT_OWNER", state.recommendedNextOwner);
      state.recommendedNextFile = getValue(probeReport, "RECOMMENDED_NEXT_FILE", state.recommendedNextFile);
      state.recommendedNextAction = getValue(probeReport, "RECOMMENDED_NEXT_ACTION", state.recommendedNextAction);
      state.primaryCase = getValue(probeReport, "PRIMARY_CASE", state.primaryCase);

      addNote(state, "NORTH_V9_ACCEPTED_PROBE_NORTH_FILE_COMPOSITION_OUTPUT");
      return;
    }

    if (!state.probeNorthObserved) {
      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_HOLD_PROBE_NORTH_REQUIRED";
      state.calibrationHoldReason = "VISIBLE_DIAGNOSTIC_PARENT_PRESENT_UNDER_HOOD_PROBE_NORTH_NOT_YET_PRESENT";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = "DIAGNOSTIC_PROBE_NORTH";
      state.recommendedNextFile = PROBE_NORTH_FILE;
      state.recommendedNextAction = "CREATE_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_AS_SECOND_FILE_IN_EIGHT_WAY_BRIDGE";
      return;
    }

    if (state.canvasExpressionProofStatus === "ACTIVE_DEGRADED" || state.canvasExpressionSurfaceReady === "false") {
      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_HOLD_CANVAS_EXPRESSION_BOTTLENECK";
      state.calibrationHoldReason = `WEST_CANVAS_EXPRESSION_BOTTLENECK:${state.canvasExpressionBottleneckClass}`;
      state.recommendedNextOwner = "CANVAS_EXPRESSION_CARRIER_REVIEW";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "REVIEW_CANVAS_EXPRESSION_BOTTLENECK_AFTER_PROBE_NORTH_ZONE_COORDINATION";
      return;
    }

    state.primaryCase = "INCONCLUSIVE_EVIDENCE";
    state.calibrationStatus = "CALIBRATION_INSUFFICIENT_FILE_COMPOSITION_EVIDENCE";
    state.calibrationHoldReason = "NORTH_V9_REQUIRES_PROBE_BRIDGE_OUTPUT_TO_COORDINATE_ZONE_OF_INFLICTION";
    state.recommendedNextOwner = "DIAGNOSTIC_PROBE_NORTH";
    state.recommendedNextFile = PROBE_NORTH_FILE;
    state.recommendedNextAction = "COMPLETE_PROBE_NORTH_BEFORE_RENEWING_CANVAS_OR_DIAGNOSTIC_RAIL_CHILDREN";
  }

  function resolveAlignment(state) {
    const stages = [
      { name: "NORTH_PARENT_PRESENT", passed: true },
      { name: "EAST_RAIL_READ", passed: state.eastRailObserved && state.eastRailEvidenceStatus !== "UNREADABLE" },
      { name: "WEST_RAIL_READ", passed: state.westRailObserved && state.westRailEvidenceStatus !== "UNREADABLE" },
      { name: "PROBE_NORTH_READ", passed: state.probeNorthObserved },
      { name: "FILE_COMPOSITION_ZONE_COORDINATION", passed: state.fileCompositionStatus !== "WAITING_PROBE_NORTH" && !state.fileCompositionStatus.includes("MISSING") },
      { name: "SOUTH_OUTPUT", passed: state.southOutputStatus === "COMPLETE" || state.southOutputStatus === "FALLBACK_NOT_REQUIRED_FOR_PROBE_NORTH_HOLD" },
      { name: "NORTH_FINAL_REPORT", passed: Boolean(state.primaryCase && state.recommendedNextFile) }
    ];

    const passed = stages.filter((stage) => stage.passed).length;
    const firstFailed = stages.find((stage) => !stage.passed);

    state.newsAlignmentScore = Math.round((passed / stages.length) * 100);
    state.newsAlignmentStatus = firstFailed ? "NEWS_ALIGNMENT_PARTIAL" : "NEWS_ALIGNMENT_COMPLETE";
    state.newsAlignmentFirstFailedStage = firstFailed ? firstFailed.name : "NONE";

    const fib = [
      { key: "F1", passed: true },
      { key: "F2", passed: state.eastRailObserved || state.westRailObserved },
      { key: "F3", passed: state.eastRailEvidenceStatus !== "UNREADABLE" },
      { key: "F5", passed: state.westRailEvidenceStatus !== "UNREADABLE" },
      { key: "F8", passed: state.probeNorthObserved },
      { key: "F13", passed: state.southOutputStatus === "COMPLETE" || state.southOutputStatus === "FALLBACK_NOT_REQUIRED_FOR_PROBE_NORTH_HOLD" },
      { key: "F21", passed: state.f21EligibleForNorth === false && state.f21ClaimedByDiagnosticRail === false }
    ];

    const fibPassed = fib.filter((stage) => stage.passed).length;
    const fibFirstFailed = fib.find((stage) => !stage.passed);

    state.fibonacciSynchronizationScore = Math.round((fibPassed / fib.length) * 100);
    state.fibonacciSynchronizationStatus = fibFirstFailed ? "FIBONACCI_SYNCHRONIZATION_PARTIAL" : "FIBONACCI_SYNCHRONIZATION_COMPLETE";
    state.fibonacciSynchronizationFirstFailedStage = fibFirstFailed ? fibFirstFailed.key : "NONE";

    if (firstFailed) addNote(state, `NEWS_ALIGNMENT_FIRST_FAILED_STAGE:${firstFailed.name}`);
    if (fibFirstFailed) addNote(state, `FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE:${fibFirstFailed.key}`);
  }

  function buildReportObject(state) {
    const notes = normalizeNotes(state.notes).join(" | ") || "none";

    return {
      PACKET_NAME: REPORT_PACKET,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: state.diagnosticTimestamp,

      NORTH_CONTRACT: CONTRACT,
      NORTH_RECEIPT: RECEIPT,
      PREVIOUS_NORTH_CONTRACT: PREVIOUS_CONTRACT,
      PREVIOUS_NORTH_RECEIPT: PREVIOUS_RECEIPT,
      LINEAGE_V7_NORTH_CONTRACT: LINEAGE_V7_CONTRACT,
      BASELINE_NORTH_CONTRACT: BASELINE_CONTRACT,
      FOUNDATION_NORTH_CONTRACT: FOUNDATION_CONTRACT,

      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: true,
      EIGHT_WAY_PROBE_BRIDGE_MAP: clonePlain(EIGHT_WAY_BRIDGE),
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: false,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_SOUTH_FILE,
      PROBE_WEST_FILE,

      PROBE_NORTH_EXPECTED_CONTRACT: PROBE_NORTH_TARGET_CONTRACT,
      PROBE_EAST_EXPECTED_CONTRACT: PROBE_EAST_TARGET_CONTRACT,
      PROBE_SOUTH_EXPECTED_CONTRACT: PROBE_SOUTH_TARGET_CONTRACT,
      PROBE_WEST_EXPECTED_CONTRACT: PROBE_WEST_TARGET_CONTRACT,

      PROBE_NORTH_LOAD_ATTEMPTED: state.probeNorthLoadAttempted,
      PROBE_NORTH_LOAD_STATUS: state.probeNorthLoadStatus,
      PROBE_NORTH_OBSERVED: state.probeNorthObserved,
      PROBE_NORTH_SOURCE_PATH: state.probeNorthSourcePath,
      PROBE_NORTH_CONTRACT: state.probeNorthContract,
      PROBE_NORTH_RECEIPT: state.probeNorthReceipt,
      PROBE_NORTH_STATUS: state.probeNorthStatus,
      PROBE_NORTH_REQUIRED_NEXT: state.probeNorthRequiredNext,

      DIAGNOSTIC_INSTRUMENT_STATUS: state.diagnosticInstrumentStatus,
      FILE_COMPOSITION_STATUS: state.fileCompositionStatus,
      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS: state.canvasExpressionInstrumentationStatus,

      ZONE_OF_INFLICTION_OWNER: state.zoneOfInflictionOwner,
      ZONE_OF_INFLICTION_FILE: state.zoneOfInflictionFile,
      ZONE_OF_INFLICTION_CLASS: state.zoneOfInflictionClass,
      ZONE_OF_INFLICTION_REASON: state.zoneOfInflictionReason,

      LAB_NORTH_OBSERVED: state.labNorthObserved,
      LAB_NORTH_SOURCE_PATH: state.labNorthSourcePath,
      LAB_NORTH_CONTRACT: state.labNorthContract,
      MACRO_WEST_OBSERVED: state.macroWestObserved,
      MACRO_WEST_SOURCE_PATH: state.macroWestSourcePath,
      MACRO_WEST_CONTRACT: state.macroWestContract,
      CANVAS_AUTHORITY_OBSERVED: state.canvasObserved,
      CANVAS_AUTHORITY_SOURCE_PATH: state.canvasSourcePath,
      CANVAS_AUTHORITY_CONTRACT: state.canvasContract,
      ROUTE_CONDUCTOR_OBSERVED: state.routeConductorObserved,
      ROUTE_CONDUCTOR_SOURCE_PATH: state.routeConductorSourcePath,
      ROUTE_CONDUCTOR_CONTRACT: state.routeConductorContract,
      CONTROL_AUTHORITY_OBSERVED: state.controlsObserved,
      CONTROL_AUTHORITY_SOURCE_PATH: state.controlsSourcePath,
      CONTROL_AUTHORITY_CONTRACT: state.controlsContract,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT: EXPECTED_INDEX_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,
      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,
      CACHE_KEY_STALE_NON_BLOCKING: state.cacheKeyStaleNonBlocking,
      SERVED_CONTRACT_MISMATCH_IS_BLOCKING: state.servedContractMismatchIsBlocking,
      CURRENT_VISIBLE_HEARTH_STATUS: state.currentVisibleHearthStatus,

      EAST_RAIL_OBSERVED: state.eastRailObserved,
      EAST_RAIL_STATUS: state.eastRailStatus,
      EAST_RAIL_CONTRACT: state.eastRailContract,
      EAST_RAIL_EVIDENCE_STATUS: state.eastRailEvidenceStatus,

      WEST_RAIL_OBSERVED: state.westRailObserved,
      WEST_RAIL_STATUS: state.westRailStatus,
      WEST_RAIL_CONTRACT: state.westRailContract,
      WEST_RAIL_EVIDENCE_STATUS: state.westRailEvidenceStatus,

      SOUTH_RAIL_OBSERVED: state.southRailObserved,
      SOUTH_RAIL_STATUS: state.southRailStatus,
      SOUTH_RAIL_CONTRACT: state.southRailContract,
      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
      SOUTH_MEANING_PRESERVED: state.southMeaningPreserved,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,
      RENDERED_PLANET_PROOF_READY: state.renderedPlanetProofReady,
      VISIBLE_PLANET_PROOF_READY: state.visiblePlanetProofReady,
      VISIBLE_PLANET_PROOF_SOURCE: state.visiblePlanetProofSource,
      CANVAS_EXPRESSION_PROOF_STATUS: state.canvasExpressionProofStatus,
      CANVAS_EXPRESSION_BOTTLENECK_CLASS: state.canvasExpressionBottleneckClass,
      CANVAS_EXPRESSION_SURFACE_READY: state.canvasExpressionSurfaceReady,
      CANVAS_EXPRESSION_RICHNESS_READY: state.canvasExpressionRichnessReady,
      DOM_EXPRESSION_SURFACE_PROOF_READY: state.domExpressionSurfaceProofReady,
      CANVAS_PIXEL_VARIANCE_STATUS: state.canvasPixelVarianceStatus,
      CANVAS_FINGER_EXPRESSION_STATUS: state.canvasFingerExpressionStatus,
      FOUR_WAY_CANVAS_HANDOFF_STATUS: state.fourWayCanvasHandoffStatus,
      CURRENT_CANVAS_PARENT_CONTRACT: state.currentCanvasParentContract,
      CURRENT_CANVAS_PARENT_RECOGNIZED: state.currentCanvasParentRecognized,

      CONTROL_FILE: CONTROL_FILE,
      CONTROL_FILE_STATUS: state.controlFileStatus,
      CONTROL_FILE_LOADED: state.controlFileLoaded,
      CONTROL_GLOBAL_PRESENT: state.controlGlobalPresent,
      CONTROL_RECEIPT_PRESENT: state.controlReceiptPresent,
      CONTROL_HANDSHAKE_STATUS: state.controlHandshakeStatus,
      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,
      VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS: state.visiblePlanetAllowedWithoutControls,

      SHOW_RECEIPT_ACTION_RESULT: state.showReceiptActionResult,
      RUNTIME_RELEASE_STATE: state.runtimeReleaseState,
      RUNTIME_RELEASE_IS_LOCK: state.runtimeReleaseIsLock,

      PRIMARY_CASE: state.primaryCase,
      CALIBRATION_STATUS: state.calibrationStatus,
      CALIBRATION_HOLD_REASON: state.calibrationHoldReason,
      DIAGNOSTIC_RAIL_CLEAN: state.diagnosticRailClean,
      CALIBRATION_POINT_REACHED: state.calibrationPointReached,

      NEWS_ALIGNMENT_STATUS: state.newsAlignmentStatus,
      NEWS_ALIGNMENT_SCORE: state.newsAlignmentScore,
      NEWS_ALIGNMENT_FIRST_FAILED_STAGE: state.newsAlignmentFirstFailedStage,
      FIBONACCI_SYNCHRONIZATION_STATUS: state.fibonacciSynchronizationStatus,
      FIBONACCI_SYNCHRONIZATION_SCORE: state.fibonacciSynchronizationScore,
      FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: state.fibonacciSynchronizationFirstFailedStage,

      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      SECONDARY_EVIDENCE_NOTES: notes,
      NORTH_SECONDARY_EVIDENCE_NOTES: notes,

      NORTH_VERDICT: clonePlain(state.northVerdict),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildNorthVerdict(state) {
    return {
      schema: "HEARTH_DIAGNOSTIC_NORTH_EIGHT_WAY_PROBE_BRIDGE_VERDICT_SCHEMA_v9",
      northContract: CONTRACT,
      northReceipt: RECEIPT,
      previousNorthContract: PREVIOUS_CONTRACT,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: state.diagnosticTimestamp,

      bridge: {
        eightWayProbeBridgeActive: true,
        diagnosticRouteHtmlRenewalRequired: false,
        receiverStillCallsNorthOnly: true,
        railNorthFile: RAIL_NORTH_FILE,
        probeNorthFile: PROBE_NORTH_FILE,
        probeNorthObserved: state.probeNorthObserved,
        probeNorthStatus: state.probeNorthStatus,
        probeNorthRequiredNext: state.probeNorthRequiredNext
      },

      diagnosticInstrument: {
        status: state.diagnosticInstrumentStatus,
        fileCompositionStatus: state.fileCompositionStatus,
        canvasExpressionInstrumentationStatus: state.canvasExpressionInstrumentationStatus
      },

      zoneOfInfliction: {
        owner: state.zoneOfInflictionOwner,
        file: state.zoneOfInflictionFile,
        class: state.zoneOfInflictionClass,
        reason: state.zoneOfInflictionReason
      },

      currentSpread: {
        expectedHtmlContract: EXPECTED_HTML_CONTRACT,
        expectedIndexJsContract: EXPECTED_INDEX_CONTRACT,
        expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        servedHtmlContract: state.servedHtmlContract,
        servedIndexJsContract: state.servedIndexJsContract,
        servedRouteConductorContract: state.servedRouteConductorContract,
        routeConductorRuntimeContract: state.routeConductorContract,
        cacheKeyStaleNonBlocking: state.cacheKeyStaleNonBlocking,
        servedContractMismatchIsBlocking: state.servedContractMismatchIsBlocking
      },

      canvasExpression: {
        canvasAuthorityObserved: state.canvasObserved,
        canvasAuthorityContract: state.canvasContract,
        renderedPlanetProofReady: state.renderedPlanetProofReady,
        visiblePlanetProofReady: state.visiblePlanetProofReady,
        visiblePlanetProofSource: state.visiblePlanetProofSource,
        canvasExpressionProofStatus: state.canvasExpressionProofStatus,
        canvasExpressionBottleneckClass: state.canvasExpressionBottleneckClass,
        fourWayCanvasHandoffStatus: state.fourWayCanvasHandoffStatus,
        currentCanvasParentContract: state.currentCanvasParentContract,
        currentCanvasParentRecognized: state.currentCanvasParentRecognized
      },

      railChildren: {
        eastObserved: state.eastRailObserved,
        eastStatus: state.eastRailStatus,
        eastContract: state.eastRailContract,
        westObserved: state.westRailObserved,
        westStatus: state.westRailStatus,
        westContract: state.westRailContract,
        southObserved: state.southRailObserved,
        southStatus: state.southRailStatus,
        southContract: state.southRailContract
      },

      authorityBoundaries: {
        productionMutationAuthorized: false,
        hearthRepairAuthorized: false,
        runtimeRestartAuthorized: false,
        canvasReleaseAuthorized: false,
        macroWestReleaseAuthorized: false,
        canvasDrawingAuthority: false,
        terrainTruthAuthority: false,
        hydrologyTruthAuthority: false,
        materialTruthAuthority: false,
        controlImplementationAuthority: false
      },

      primaryCase: state.primaryCase,
      calibrationStatus: state.calibrationStatus,
      calibrationHoldReason: state.calibrationHoldReason,
      diagnosticRailClean: state.diagnosticRailClean,
      calibrationPointReached: state.calibrationPointReached,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      notes: normalizeNotes(state.notes),

      ...NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",
      "PROBE_NORTH_FILE",
      "PROBE_NORTH_EXPECTED_CONTRACT",
      "PROBE_NORTH_LOAD_ATTEMPTED",
      "PROBE_NORTH_LOAD_STATUS",
      "PROBE_NORTH_OBSERVED",
      "PROBE_NORTH_STATUS",
      "DIAGNOSTIC_INSTRUMENT_STATUS",
      "FILE_COMPOSITION_STATUS",
      "ZONE_OF_INFLICTION_OWNER",
      "ZONE_OF_INFLICTION_FILE",
      "ZONE_OF_INFLICTION_CLASS",
      "ZONE_OF_INFLICTION_REASON",
      "CANVAS_EXPRESSION_INSTRUMENTATION_STATUS",
      "RAIL_EAST_FILE",
      "RAIL_SOUTH_FILE",
      "RAIL_WEST_FILE",
      "PROBE_EAST_FILE",
      "PROBE_SOUTH_FILE",
      "PROBE_WEST_FILE",
      "EXPECTED_HTML_CONTRACT",
      "EXPECTED_INDEX_JS_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
      "SERVED_HTML_CONTRACT",
      "SERVED_INDEX_JS_CONTRACT",
      "SERVED_ROUTE_CONDUCTOR_CONTRACT",
      "INDEX_SCRIPT_SRC",
      "ROUTE_CONDUCTOR_SCRIPT_SRC",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "CACHE_KEY_STALE_NON_BLOCKING",
      "SERVED_CONTRACT_MISMATCH_IS_BLOCKING",
      "CURRENT_VISIBLE_HEARTH_STATUS",
      "DIAGNOSTIC_TARGET_ACCESS_STATUS",
      "DIAGNOSTIC_TARGET_ACCESS_ERROR",
      "RENDERED_PLANET_PROOF_READY",
      "VISIBLE_PLANET_PROOF_READY",
      "VISIBLE_PLANET_PROOF_SOURCE",
      "CANVAS_EXPRESSION_PROOF_STATUS",
      "CANVAS_EXPRESSION_BOTTLENECK_CLASS",
      "CANVAS_EXPRESSION_SURFACE_READY",
      "CANVAS_EXPRESSION_RICHNESS_READY",
      "DOM_EXPRESSION_SURFACE_PROOF_READY",
      "CANVAS_PIXEL_VARIANCE_STATUS",
      "CANVAS_FINGER_EXPRESSION_STATUS",
      "FOUR_WAY_CANVAS_HANDOFF_STATUS",
      "CURRENT_CANVAS_PARENT_CONTRACT",
      "CURRENT_CANVAS_PARENT_RECOGNIZED",
      "CONTROL_FILE_STATUS",
      "CONTROL_HANDSHAKE_STATUS",
      "MOTION_TOUCH_STATUS",
      "DRAG_STATUS",
      "VIEW_CONTROL_STATUS",
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",
      "DIAGNOSTIC_RAIL_CLEAN",
      "CALIBRATION_POINT_REACHED",
      "NEWS_ALIGNMENT_STATUS",
      "NEWS_ALIGNMENT_SCORE",
      "NEWS_ALIGNMENT_FIRST_FAILED_STAGE",
      "FIBONACCI_SYNCHRONIZATION_STATUS",
      "FIBONACCI_SYNCHRONIZATION_SCORE",
      "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "SECONDARY_EVIDENCE_NOTES",
      "NORTH_SECONDARY_EVIDENCE_NOTES",
      "NORTH_VERDICT",
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

  function composePacketText(report) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("NORTH_CONTRACT", getValue(report, "NORTH_CONTRACT", CONTRACT)),
      line("EIGHT_WAY_PROBE_BRIDGE_ACTIVE", getValue(report, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", true)),
      line("PROBE_NORTH_STATUS", getValue(report, "PROBE_NORTH_STATUS", "UNKNOWN")),
      line("DIAGNOSTIC_INSTRUMENT_STATUS", getValue(report, "DIAGNOSTIC_INSTRUMENT_STATUS", "UNKNOWN")),
      line("FILE_COMPOSITION_STATUS", getValue(report, "FILE_COMPOSITION_STATUS", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_OWNER", getValue(report, "ZONE_OF_INFLICTION_OWNER", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_FILE", getValue(report, "ZONE_OF_INFLICTION_FILE", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_CLASS", getValue(report, "ZONE_OF_INFLICTION_CLASS", "UNKNOWN")),
      line("CANVAS_EXPRESSION_PROOF_STATUS", getValue(report, "CANVAS_EXPRESSION_PROOF_STATUS", "UNKNOWN")),
      line("CANVAS_EXPRESSION_BOTTLENECK_CLASS", getValue(report, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", "UNKNOWN")),
      line("PRIMARY_CASE", getValue(report, "PRIMARY_CASE", "UNKNOWN")),
      line("CALIBRATION_STATUS", getValue(report, "CALIBRATION_STATUS", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_ACTION", getValue(report, "RECOMMENDED_NEXT_ACTION", "UNKNOWN"))
    ].join("\n");
  }

  async function runSouthRail(state, children, report, options = {}) {
    const child = children.south.value;

    state.southRailObserved = Boolean(child);

    if (!child) {
      state.southRailStatus = "SOUTH_RAIL_NOT_OBSERVED";
      state.southOutputStatus = "FALLBACK_NOT_REQUIRED_FOR_PROBE_NORTH_HOLD";
      state.southMeaningPreserved = "false";
      addNote(state, "SOUTH_RAIL_NOT_OBSERVED_NORTH_PACKET_COMPOSED_DIRECTLY");
      return null;
    }

    const receipt = getReceiptFromAuthority(child) || {};
    state.southRailContract = firstNonEmpty(receipt.contract, receipt.CONTRACT, receipt.implementationContract, "UNKNOWN");

    if (!isFunction(child.composeSouthReport)) {
      state.southRailStatus = "SOUTH_RAIL_API_MISSING";
      state.southOutputStatus = "FALLBACK_NOT_REQUIRED_FOR_PROBE_NORTH_HOLD";
      state.southMeaningPreserved = "false";
      addNote(state, "SOUTH_RAIL_API_MISSING_COMPOSE_SOUTH_REPORT");
      return null;
    }

    try {
      const output = await Promise.resolve(child.composeSouthReport(report, {
        northContract: CONTRACT,
        previousNorthContract: PREVIOUS_CONTRACT,
        eightWayProbeBridgeActive: true,
        probeNorthFile: PROBE_NORTH_FILE,
        preserveNorthMeaning: true,
        includeNoClaims: true,
        options: clonePlain(options)
      }));

      const reportObject = isObject(output && output.REPORT_OBJECT) ? output.REPORT_OBJECT :
        isObject(output && output.report) ? output.report :
          isObject(output) ? output : null;

      state.southRailStatus = "SOUTH_RAIL_OUTPUT_RETURNED";
      state.southOutputStatus = getValue(output, "SOUTH_OUTPUT_STATUS", "COMPLETE");
      state.southMeaningPreserved = reportObject ? "true" : "false";

      if (reportObject) addNote(state, "SOUTH_OUTPUT_RETURNED_REPORT_OBJECT");
      else addNote(state, "SOUTH_OUTPUT_RETURNED_WITHOUT_REPORT_OBJECT_NORTH_WILL_PRESERVE_FINAL_FIELDS");

      return reportObject;
    } catch (error) {
      state.southRailStatus = "SOUTH_RAIL_RUN_ERROR";
      state.southOutputStatus = "FALLBACK_NOT_REQUIRED_FOR_PROBE_NORTH_HOLD";
      state.southMeaningPreserved = "false";
      addNote(state, `SOUTH_RAIL_RUN_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
      return null;
    }
  }

  async function runDiagnostic(options = {}) {
    const state = makeState();

    try {
      applyAuthorityRead(state);

      const railChildren = discoverRailChildren();

      const probeFound = await ensureProbeNorth(state, options);

      const eastEvidence = await runEastRail(state, railChildren, options);
      const westEvidence = await runWestRail(state, railChildren, options);

      const railPayload = {
        eastEvidence: clonePlain(eastEvidence),
        westEvidence: clonePlain(westEvidence),
        authorities: {
          labNorthObserved: state.labNorthObserved,
          macroWestObserved: state.macroWestObserved,
          canvasObserved: state.canvasObserved,
          routeConductorObserved: state.routeConductorObserved,
          controlsObserved: state.controlsObserved
        }
      };

      const probeReport = await runProbeNorth(state, probeFound, railPayload, options);

      applyNorthAdjudication(state, probeReport);
      resolveAlignment(state);

      state.northVerdict = buildNorthVerdict(state);
      let northReport = buildReportObject(state);

      const southReport = await runSouthRail(state, railChildren, northReport, options);

      if (southReport && isObject(southReport)) {
        northReport = {
          ...clonePlain(southReport),
          ...clonePlain(northReport),
          NORTH_VERDICT: clonePlain(state.northVerdict),
          ...NO_CLAIMS,
          ...UPPER_NO_CLAIMS
        };
        addNote(state, "NORTH_V9_FINAL_PACKET_RECOMPOSED_AFTER_SOUTH_WITH_NORTH_FIELDS_PRESERVED");
      } else {
        addNote(state, "NORTH_V9_FINAL_PACKET_COMPOSED_DIRECTLY_WITHOUT_SOUTH_OVERRIDE");
      }

      state.reportObject = clonePlain(northReport);
      state.fullPacketText = composePacketText(northReport);
      state.compactSummary = composeCompactSummary(northReport);

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        verdict: clonePlain(lastVerdict),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_NORTH_V9_TOP_LEVEL_ERROR";
      state.calibrationHoldReason = bounded(error && error.message ? error.message : error, 1000);
      state.recommendedNextOwner = "DIAGNOSTIC_NORTH_PARENT";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_NORTH_V9_TOP_LEVEL_ERROR_BEFORE_PROBE_RENEWAL";
      addNote(state, `NORTH_V9_TOP_LEVEL_ERROR:${state.calibrationHoldReason}`);
      resolveAlignment(state);
      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);
      state.fullPacketText = composePacketText(state.reportObject);
      state.compactSummary = composeCompactSummary(state.reportObject);
      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        error: state.calibrationHoldReason,
        verdict: clonePlain(lastVerdict),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState)
      };
    }
  }

  function getReport() {
    return clonePlain(lastReport || buildReportObject(makeState()));
  }

  function getNorthVerdict() {
    return clonePlain(lastVerdict || buildNorthVerdict(makeState()));
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    const state = makeState();
    const report = buildReportObject(state);
    return composePacketText(report);
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    const state = makeState();
    const report = buildReportObject(state);
    return composeCompactSummary(report);
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getReceiptLight() {
    const state = lastState || makeState();

    return {
      parentRole: "NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV7Contract: LINEAGE_V7_CONTRACT,
      lineageV7Receipt: LINEAGE_V7_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      foundationContract: FOUNDATION_CONTRACT,
      foundationReceipt: FOUNDATION_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      eightWayProbeBridgeActive: true,
      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,
      visibleParentIntegrated: true,

      railNorthFile: RAIL_NORTH_FILE,
      railEastFile: RAIL_EAST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
      railWestFile: RAIL_WEST_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeSouthFile: PROBE_SOUTH_FILE,
      probeWestFile: PROBE_WEST_FILE,
      eightWayProbeBridgeMap: clonePlain(EIGHT_WAY_BRIDGE),

      probeNorthExpectedContract: PROBE_NORTH_TARGET_CONTRACT,
      probeNorthLoadAttempted: state.probeNorthLoadAttempted,
      probeNorthLoadStatus: state.probeNorthLoadStatus,
      probeNorthObserved: state.probeNorthObserved,
      probeNorthSourcePath: state.probeNorthSourcePath,
      probeNorthContract: state.probeNorthContract,
      probeNorthReceipt: state.probeNorthReceipt,
      probeNorthStatus: state.probeNorthStatus,
      probeNorthRequiredNext: state.probeNorthRequiredNext,

      diagnosticInstrumentStatus: state.diagnosticInstrumentStatus,
      fileCompositionStatus: state.fileCompositionStatus,
      canvasExpressionInstrumentationStatus: state.canvasExpressionInstrumentationStatus,
      zoneOfInflictionOwner: state.zoneOfInflictionOwner,
      zoneOfInflictionFile: state.zoneOfInflictionFile,
      zoneOfInflictionClass: state.zoneOfInflictionClass,
      zoneOfInflictionReason: state.zoneOfInflictionReason,

      eastRailObserved: state.eastRailObserved,
      westRailObserved: state.westRailObserved,
      southRailObserved: state.southRailObserved,

      labNorthObserved: state.labNorthObserved,
      macroWestObserved: state.macroWestObserved,
      canvasObserved: state.canvasObserved,
      routeConductorObserved: state.routeConductorObserved,
      controlsObserved: state.controlsObserved,

      currentHtmlContract: EXPECTED_HTML_CONTRACT,
      currentIndexJsContract: EXPECTED_INDEX_CONTRACT,
      currentRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      renderedPlanetProofReady: state.renderedPlanetProofReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      canvasExpressionProofStatus: state.canvasExpressionProofStatus,
      canvasExpressionBottleneckClass: state.canvasExpressionBottleneckClass,
      fourWayCanvasHandoffStatus: state.fourWayCanvasHandoffStatus,

      primaryCase: state.primaryCase,
      calibrationStatus: state.calibrationStatus,
      calibrationHoldReason: state.calibrationHoldReason,
      diagnosticRailClean: state.diagnosticRailClean,
      calibrationPointReached: state.calibrationPointReached,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,

      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getNorthVerdictApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getStateApiAvailable: true,

      northIsDiagnosticAnchor: true,
      northOwnsProbeBridgeCoordination: true,
      northOwnsFileCompositionAdjudication: true,
      northOwnsZoneOfInflictionSelection: true,
      northOwnsFinalReportAuthority: true,

      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      canvasDrawingAuthority: false,
      routeConductorImplementationAuthority: false,
      controlImplementationAuthority: false,
      terrainTruthAuthority: false,
      hydrologyTruthAuthority: false,
      materialTruthAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      northContract: CONTRACT,
      northReceipt: RECEIPT,
      previousNorthContract: PREVIOUS_CONTRACT,
      previousNorthReceipt: PREVIOUS_RECEIPT,
      lineageV7NorthContract: LINEAGE_V7_CONTRACT,
      baselineNorthContract: BASELINE_CONTRACT,
      foundationNorthContract: FOUNDATION_CONTRACT,

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,
      labNorthFile: LAB_NORTH_FILE,
      labEastFile: LAB_EAST_FILE,
      labSouthFile: LAB_SOUTH_FILE,
      labWestFile: LAB_WEST_FILE,
      diagnosticHtmlFile: DIAGNOSTIC_HTML_FILE,

      acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
      acceptedIndexContracts: ACCEPTED_INDEX_CONTRACTS.slice(),
      acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),

      northVerdict: clonePlain(lastVerdict || buildNorthVerdict(lastState || makeState())),
      reportObject: clonePlain(lastReport || buildReportObject(lastState || makeState())),

      supportsEightWayProbeBridge: true,
      supportsProbeNorthDynamicRecognition: true,
      supportsProbeNorthParentLoadAttempt: true,
      supportsExistingDiagnosticRouteIntegration: true,
      supportsNorthOnlyReceiverCall: true,
      supportsV8CompatibilitySurface: true,
      supportsCurrentSpreadCalibration: true,
      supportsCacheKeyStaleNonBlockingRecognition: true,
      supportsZoneOfInflictionReporting: true,
      supportsFileCompositionAdjudication: true,

      ...NO_CLAIMS
    };
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastVerdict = clonePlain(state.northVerdict && Object.keys(state.northVerdict).length ? state.northVerdict : buildNorthVerdict(state));
    lastReport = clonePlain(state.reportObject && Object.keys(state.reportObject).length ? state.reportObject : buildReportObject(state));
    lastPacketText = state.fullPacketText || composePacketText(lastReport);
    lastCompactSummary = state.compactSummary || composeCompactSummary(lastReport);

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticRail = api;
    root.HEARTH.parallelDiagnosticRail = api;
    root.HEARTH.diagnosticNorth = api;
    root.HEARTH.diagnosticRailNorth = api;
    root.HEARTH.diagnosticNorthAnchor = api;
    root.HEARTH.diagnosticNorthEightWayProbeBridge = api;

    root.DEXTER_LAB.hearthDiagnosticRail = api;
    root.DEXTER_LAB.hearthDiagnosticNorth = api;
    root.DEXTER_LAB.hearthDiagnosticNorthAnchor = api;
    root.DEXTER_LAB.hearthDiagnosticNorthEightWayProbeBridge = api;

    root.HEARTH_DIAGNOSTIC_RAIL = api;
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL = api;
    root.HEARTH_DIAGNOSTIC_NORTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH = api;
    root.HEARTH_DIAGNOSTIC_NORTH_ANCHOR = api;
    root.HEARTH_DIAGNOSTIC_NORTH_EIGHT_WAY_PROBE_BRIDGE = api;

    root.HEARTH_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_ANCHOR_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_EIGHT_WAY_PROBE_BRIDGE_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_EIGHT_WAY_PROBE_BRIDGE_REPORT = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_EIGHT_WAY_PROBE_BRIDGE_VERDICT = clonePlain(lastVerdict);

    root.HEARTH_DIAGNOSTIC_RAIL_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_PACKET_TEXT = lastPacketText;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV7Contract: LINEAGE_V7_CONTRACT,
    lineageV7Receipt: LINEAGE_V7_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    foundationContract: FOUNDATION_CONTRACT,
    foundationReceipt: FOUNDATION_RECEIPT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    railWestFile: RAIL_WEST_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,
    probeWestFile: PROBE_WEST_FILE,
    eightWayProbeBridgeMap: EIGHT_WAY_BRIDGE,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

    probeNorthExpectedContract: PROBE_NORTH_TARGET_CONTRACT,
    probeEastExpectedContract: PROBE_EAST_TARGET_CONTRACT,
    probeSouthExpectedContract: PROBE_SOUTH_TARGET_CONTRACT,
    probeWestExpectedContract: PROBE_WEST_TARGET_CONTRACT,

    runDiagnostic,
    getReport,
    getNorthVerdict,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getReceiptLight,
    getState,

    supportsEightWayProbeBridge: true,
    supportsProbeNorthDynamicRecognition: true,
    supportsProbeNorthParentLoadAttempt: true,
    supportsExistingDiagnosticRouteIntegration: true,
    supportsNorthOnlyReceiverCall: true,
    supportsV8CompatibilitySurface: true,
    supportsCurrentSpreadCalibration: true,
    supportsCacheKeyStaleNonBlockingRecognition: true,
    supportsZoneOfInflictionReporting: true,
    supportsFileCompositionAdjudication: true,

    northIsDiagnosticAnchor: true,
    northOwnsProbeBridgeCoordination: true,
    northOwnsFileCompositionAdjudication: true,
    northOwnsZoneOfInflictionSelection: true,
    northOwnsFinalReportAuthority: true,

    diagnosticUiAuthority: false,
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    canvasDrawingAuthority: false,
    routeConductorImplementationAuthority: false,
    controlImplementationAuthority: false,
    terrainTruthAuthority: false,
    hydrologyTruthAuthority: false,
    materialTruthAuthority: false,

    ...NO_CLAIMS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
