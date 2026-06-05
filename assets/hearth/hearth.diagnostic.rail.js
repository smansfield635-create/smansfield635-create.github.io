// /assets/hearth/hearth.diagnostic.rail.js
// HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10
// Full-file replacement.
// Diagnostic rail NORTH parent only.
// Purpose:
// - Preserve NORTH as the diagnostic receiver entrypoint.
// - Renew NORTH from “eight-way bridge owner” into chronology hub.
// - NORTH chronologizes the eight diagnostic files; it does not own their evidence.
// - Preserve existing receiver behavior: diagnostic HTML still calls NORTH only.
// - Load or recognize child rails and probe files in a lawful order.
// - Record EXPECTED, LOAD_ATTEMPTED, OBSERVED, CALL_ATTEMPTED, CALL_RETURNED, CALL_FAILED.
// - Preserve EAST as served-source evidence authority.
// - Preserve WEST as rendered-target evidence authority.
// - Preserve SOUTH as packet-output authority.
// - Preserve probes as under-hood diagnostic-only deepening instruments.
// - Detect repeated diagnostic signatures with changed timestamps as potential repeat/cache signature.
// - Return a clearer zone of infliction from chronological failure, not assumption.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
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
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_RECEIPT_v9";

  const LINEAGE_V8_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const LINEAGE_V8_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_RECEIPT_v8";

  const LINEAGE_V7_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_TNT_v7";
  const BASELINE_V6_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_BISHOP_QUEEN_ACCEPTANCE_SCHEMA_ORCHESTRATOR_TNT_v6";
  const FOUNDATION_V5_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_TNT_v5";

  const VERSION =
    "2026-06-05.hearth-diagnostic-rail-north-chronology-hub-standard-v10";

  const FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

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

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const EXPECTED_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const EXPECTED_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const EXPECTED_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";

  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";

  const ACCEPTED_HTML_CONTRACTS = Object.freeze([
    EXPECTED_HTML_CONTRACT,
    "HEARTH_HTML_CONTROL_HANDSHAKE_ROUTE_SHELL_INTEGRATION_TNT_v5",
    "HEARTH_HTML_FULL_PLANET_VISIBILITY_DOWNSTREAM_SHELL_ALIGNMENT_TNT_v4"
  ]);

  const ACCEPTED_INDEX_CONTRACTS = Object.freeze([
    EXPECTED_INDEX_JS_CONTRACT,
    "HEARTH_INDEX_JS_VISIBLE_EXPRESSION_CHAIN_LOADER_BRIDGE_TNT_v5_4_2",
    "HEARTH_INDEX_JS_PAGE_RECEIPT_TARGET_BINDING_RENEWAL_TNT_v5_4_1"
  ]);

  const ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS = Object.freeze([
    EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_FILE_ADMISSION_AND_HANDSHAKE_DELIVERY_TNT_v9_8",
    "HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7",
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5",
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4"
  ]);

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

  const CHRONOLOGY_STEPS = Object.freeze([
    Object.freeze({
      id: "NORTH_RAIL",
      order: 1,
      role: "north-chronology-hub",
      file: FILE,
      expectedContract: CONTRACT,
      owner: "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
      paths: [
        "HEARTH.diagnosticRail",
        "HEARTH.parallelDiagnosticRail",
        "HEARTH.diagnosticNorth",
        "HEARTH.diagnosticRailNorth",
        "HEARTH_DIAGNOSTIC_RAIL",
        "HEARTH_PARALLEL_DIAGNOSTIC_RAIL",
        "HEARTH_DIAGNOSTIC_NORTH",
        "HEARTH_DIAGNOSTIC_RAIL_NORTH",
        "DEXTER_LAB.hearthDiagnosticRail",
        "DEXTER_LAB.hearthDiagnosticNorth"
      ],
      methods: []
    }),
    Object.freeze({
      id: "PROBE_NORTH",
      order: 2,
      role: "file-composition-zone-coordinator",
      file: PROBE_NORTH_FILE,
      expectedContract: EXPECTED_PROBE_NORTH_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_NORTH",
      paths: [
        "HEARTH.diagnosticProbeNorth",
        "HEARTH.diagnosticRailProbeNorth",
        "HEARTH.diagnosticNorthProbe",
        "HEARTH_DIAGNOSTIC_PROBE_NORTH",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_NORTH",
        "DEXTER_LAB.hearthDiagnosticProbeNorth",
        "DEXTER_LAB.hearthDiagnosticRailProbeNorth"
      ],
      methods: [
        "runProbeNorth",
        "inspectFileComposition",
        "composeFileComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    }),
    Object.freeze({
      id: "RAIL_EAST",
      order: 3,
      role: "served-source-evidence",
      file: RAIL_EAST_FILE,
      expectedContract: EXPECTED_EAST_CONTRACT,
      owner: "DIAGNOSTIC_RAIL_EAST",
      paths: [
        "HEARTH.diagnosticEast",
        "HEARTH.diagnosticRailEast",
        "HEARTH_DIAGNOSTIC_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_EAST",
        "DEXTER_LAB.hearthDiagnosticEast",
        "DEXTER_LAB.hearthDiagnosticRailEast"
      ],
      methods: [
        "runEastSourceRead",
        "readServedSource",
        "runEast",
        "inspectSource",
        "inspect",
        "runDiagnostic"
      ]
    }),
    Object.freeze({
      id: "PROBE_EAST",
      order: 4,
      role: "served-source-file-composition-probe",
      file: PROBE_EAST_FILE,
      expectedContract: EXPECTED_PROBE_EAST_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_EAST",
      paths: [
        "HEARTH.diagnosticProbeEast",
        "HEARTH.diagnosticRailProbeEast",
        "HEARTH.diagnosticEastProbe",
        "HEARTH_DIAGNOSTIC_PROBE_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_EAST",
        "DEXTER_LAB.hearthDiagnosticProbeEast",
        "DEXTER_LAB.hearthDiagnosticRailProbeEast"
      ],
      methods: [
        "runProbeEast",
        "inspectServedSourceComposition",
        "inspectSourceComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    }),
    Object.freeze({
      id: "RAIL_WEST",
      order: 5,
      role: "rendered-target-evidence",
      file: RAIL_WEST_FILE,
      expectedContract: EXPECTED_WEST_CONTRACT,
      owner: "DIAGNOSTIC_RAIL_WEST",
      paths: [
        "HEARTH.diagnosticWest",
        "HEARTH.diagnosticRailWest",
        "HEARTH_DIAGNOSTIC_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_WEST",
        "DEXTER_LAB.hearthDiagnosticWest",
        "DEXTER_LAB.hearthDiagnosticRailWest"
      ],
      methods: [
        "runWestRenderedRead",
        "readRenderedTarget",
        "runWest",
        "inspectRenderedTarget",
        "inspect",
        "runDiagnostic"
      ]
    }),
    Object.freeze({
      id: "PROBE_WEST",
      order: 6,
      role: "rendered-target-file-composition-probe",
      file: PROBE_WEST_FILE,
      expectedContract: EXPECTED_PROBE_WEST_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_WEST",
      paths: [
        "HEARTH.diagnosticProbeWest",
        "HEARTH.diagnosticRailProbeWest",
        "HEARTH.diagnosticWestProbe",
        "HEARTH_DIAGNOSTIC_PROBE_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_WEST",
        "DEXTER_LAB.hearthDiagnosticProbeWest",
        "DEXTER_LAB.hearthDiagnosticRailProbeWest"
      ],
      methods: [
        "runProbeWest",
        "inspectRenderedTargetComposition",
        "inspectRenderedComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    }),
    Object.freeze({
      id: "RAIL_SOUTH",
      order: 7,
      role: "packet-output",
      file: RAIL_SOUTH_FILE,
      expectedContract: EXPECTED_SOUTH_CONTRACT,
      owner: "DIAGNOSTIC_RAIL_SOUTH",
      paths: [
        "HEARTH.diagnosticSouth",
        "HEARTH.diagnosticRailSouth",
        "HEARTH_DIAGNOSTIC_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
        "DEXTER_LAB.hearthDiagnosticSouth",
        "DEXTER_LAB.hearthDiagnosticRailSouth"
      ],
      methods: [
        "composeSouthReport",
        "runSouth",
        "composeReport",
        "inspect",
        "runDiagnostic"
      ]
    }),
    Object.freeze({
      id: "PROBE_SOUTH",
      order: 8,
      role: "packet-meaning-file-composition-probe",
      file: PROBE_SOUTH_FILE,
      expectedContract: EXPECTED_PROBE_SOUTH_CONTRACT,
      owner: "DIAGNOSTIC_PROBE_SOUTH",
      paths: [
        "HEARTH.diagnosticProbeSouth",
        "HEARTH.diagnosticRailProbeSouth",
        "HEARTH.diagnosticSouthProbe",
        "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
        "DEXTER_LAB.hearthDiagnosticProbeSouth",
        "DEXTER_LAB.hearthDiagnosticRailProbeSouth"
      ],
      methods: [
        "runProbeSouth",
        "inspectPacketMeaning",
        "inspectPacketComposition",
        "runProbe",
        "inspect",
        "runDiagnostic"
      ]
    })
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  let lastState = null;
  let lastReport = null;
  let lastVerdict = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  const loadPromises = Object.create(null);

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

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
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
    for (const path of paths || []) {
      const value = readPath(path);
      if (value) return { path, value };
    }

    return { path: "NONE", value: null };
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

  function getValue(source, key, fallback = "UNKNOWN") {
    return packetValue(getRaw(source, key, undefined), fallback);
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
      "getState",
      "getStatus",
      "getNorthVerdict",
      "getProbeReceipt",
      "getEastReceipt",
      "getWestReceipt",
      "getSouthReceipt"
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
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function extractEvidence(output) {
    if (!isObject(output)) return {};

    if (isObject(output.evidence)) return output.evidence;
    if (isObject(output.report)) return output.report;
    if (isObject(output.REPORT_OBJECT)) return output.REPORT_OBJECT;
    if (isObject(output.output) && isObject(output.output.REPORT_OBJECT)) return output.output.REPORT_OBJECT;
    if (isObject(output.output) && isObject(output.output.report)) return output.output.report;
    if (isObject(output.state) && isObject(output.state.reportObject)) return output.state.reportObject;

    return output;
  }

  function scriptExistsFor(path) {
    if (!doc) return false;

    const scripts = Array.from(doc.querySelectorAll("script[src]"));

    return scripts.some((script) => {
      const src = safeString(script.getAttribute("src"));

      try {
        const base = root.location && root.location.origin ? root.location.origin : "https://diamondgatebridge.com";
        const url = new URL(src, base);
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

    if (loadPromises[path]) return loadPromises[path];

    loadPromises[path] = new Promise((resolve) => {
      try {
        const script = doc.createElement("script");
        script.id = id;
        script.src = `${path}?v=${encodeURIComponent(CONTRACT)}`;
        script.async = false;
        script.defer = true;
        script.dataset.loadedBy = CONTRACT;
        script.dataset.diagnosticChronologyHub = "true";
        script.dataset.productionMutationAuthorized = "false";
        script.dataset.hearthRepairAuthorized = "false";
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
            status: "SCRIPT_LOAD_ERROR_OR_NOT_DEPLOYED",
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

    return loadPromises[path];
  }

  function discoverExistingAuthorities() {
    return {
      labNorth: findFirstPath([
        "LAB_RUNTIME_TABLE_NORTH",
        "LAB_RUNTIME_TABLE",
        "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
        "HEARTH_NORTH_COMMAND",
        "DEXTER_LAB.runtimeTable",
        "DEXTER_LAB.cardinalRuntimeTableNorth",
        "DEXTER_LAB.northCentralTrainStation",
        "HEARTH.northCentralTrainStation",
        "HEARTH.northCommandRuntimeTable"
      ]),
      macroWest: findFirstPath([
        "LAB_RUNTIME_TABLE_WEST",
        "RUNTIME_TABLE_WEST",
        "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
        "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
        "HEARTH.runtimeTableWest",
        "HEARTH.westAdmissibility",
        "DEXTER_LAB.runtimeTableWest",
        "DEXTER_LAB.cardinalRuntimeTableWest",
        "DEXTER_LAB.hearthRuntimeTableWest"
      ]),
      canvas: findFirstPath([
        "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
        "HEARTH_CANVAS_HUB",
        "HEARTH_CANVAS",
        "HEARTH_CANVAS_EXPRESSION_HUB",
        "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
        "HEARTH.canvasHub",
        "HEARTH.canvas",
        "HEARTH.canvasExpressionHub",
        "DEXTER_LAB.hearthCanvasHub",
        "DEXTER_LAB.hearthCanvas",
        "DEXTER_LAB.hearthCanvasExpressionHub"
      ]),
      routeConductor: findFirstPath([
        "HEARTH_ROUTE_CONDUCTOR",
        "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
        "HEARTH.routeConductor",
        "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
        "DEXTER_LAB.hearthRouteConductor",
        "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
      ]),
      controls: findFirstPath([
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
      ])
    };
  }

  function makeState() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV8Contract: LINEAGE_V8_CONTRACT,
      lineageV8Receipt: LINEAGE_V8_RECEIPT,
      lineageV7Contract: LINEAGE_V7_CONTRACT,
      baselineV6Contract: BASELINE_V6_CONTRACT,
      foundationV5Contract: FOUNDATION_V5_CONTRACT,
      version: VERSION,

      packetName: REPORT_PACKET,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: nowIso(),

      chronologyHubActive: true,
      eightWayProbeBridgeActive: false,
      eightFileChronologyActive: true,
      receiverStillCallsNorthOnly: true,
      diagnosticRouteHtmlRenewalRequired: false,

      chronology: [],
      evidenceByStep: {},
      notes: [
        "NORTH_V10_CHRONOLOGY_HUB_STANDARD_ACTIVE",
        "NORTH_IS_HUB_NOT_EIGHT_FILE_BRIDGE_OWNER",
        "DIAGNOSTIC_RECEIVER_STILL_CALLS_NORTH_ONLY",
        "CHILDREN_AND_PROBES_RETAIN_SEPARATE_AUTHORITY",
        "NO_PRODUCTION_MUTATION_AUTHORIZED"
      ],

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
      expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      servedHtmlContract: "UNKNOWN",
      servedIndexJsContract: "UNKNOWN",
      servedRouteConductorContract: "UNKNOWN",
      indexScriptSrc: "UNKNOWN",
      routeConductorScriptSrc: "UNKNOWN",
      cacheOrServedContractMismatch: "UNKNOWN",
      cacheKeyStaleNonBlocking: "UNKNOWN",
      servedContractMismatchIsBlocking: "UNKNOWN",
      currentVisibleHearthStatus: "UNKNOWN",

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

      chronologyCompletionStatus: "NOT_RUN",
      firstChronologyFailureOwner: "UNKNOWN",
      firstChronologyFailureFile: "UNKNOWN",
      firstChronologyFailureClass: "UNKNOWN",
      firstChronologyFailureReason: "UNKNOWN",

      zoneOfInflictionOwner: "UNKNOWN",
      zoneOfInflictionFile: "UNKNOWN",
      zoneOfInflictionClass: "UNKNOWN",
      zoneOfInflictionReason: "UNKNOWN",

      diagnosticInstrumentStatus: "NOT_RUN",
      fileCompositionStatus: "NOT_RUN",
      canvasExpressionInstrumentationStatus: "UNKNOWN",

      primaryCase: "INCONCLUSIVE_EVIDENCE",
      calibrationStatus: "CALIBRATION_NOT_RUN",
      calibrationHoldReason: "RUN_NORTH_CHRONOLOGY_HUB",
      diagnosticRailClean: "false",
      calibrationPointReached: "false",

      newsAlignmentStatus: "NEWS_ALIGNMENT_NOT_RUN",
      newsAlignmentScore: 0,
      newsAlignmentFirstFailedStage: "NORTH_NOT_RUN",
      fibonacciSynchronizationStatus: "FIBONACCI_SYNCHRONIZATION_NOT_RUN",
      fibonacciSynchronizationScore: 0,
      fibonacciSynchronizationFirstFailedStage: "F1",

      recommendedNextOwner: "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
      recommendedNextFile: FILE,
      recommendedNextAction: "RUN_NORTH_CHRONOLOGY_HUB",

      potentialRepeatSignature: false,
      receiptSignature: "UNKNOWN",
      previousReceiptSignature: "UNKNOWN",
      previousReceiptTimestamp: "UNKNOWN",
      repeatSignatureBasis: "UNKNOWN",

      southOutputStatus: "UNKNOWN",
      southMeaningPreserved: "UNKNOWN",

      reportObject: {},
      northVerdict: {},
      fullPacketText: "",
      compactSummary: "",

      ...NO_CLAIMS
    };
  }

  function applyAuthorityRead(state) {
    const authorities = discoverExistingAuthorities();

    const labReceipt = getReceiptFromAuthority(authorities.labNorth.value) || {};
    state.labNorthObserved = Boolean(authorities.labNorth.value);
    state.labNorthSourcePath = authorities.labNorth.path;
    state.labNorthContract = firstKnown(labReceipt.contract, labReceipt.CONTRACT);

    const westReceipt = getReceiptFromAuthority(authorities.macroWest.value) || {};
    state.macroWestObserved = Boolean(authorities.macroWest.value);
    state.macroWestSourcePath = authorities.macroWest.path;
    state.macroWestContract = firstKnown(westReceipt.contract, westReceipt.CONTRACT);

    const canvasReceipt = getReceiptFromAuthority(authorities.canvas.value) || {};
    state.canvasObserved = Boolean(authorities.canvas.value);
    state.canvasSourcePath = authorities.canvas.path;
    state.canvasContract = firstKnown(
      canvasReceipt.currentCanvasParentContract,
      canvasReceipt.canvasContract,
      canvasReceipt.contract,
      canvasReceipt.CONTRACT
    );

    const routeReceipt = getReceiptFromAuthority(authorities.routeConductor.value) || {};
    state.routeConductorObserved = Boolean(authorities.routeConductor.value);
    state.routeConductorSourcePath = authorities.routeConductor.path;
    state.routeConductorContract = firstKnown(routeReceipt.contract, routeReceipt.CONTRACT);

    const controlsReceipt = getReceiptFromAuthority(authorities.controls.value) || {};
    state.controlsObserved = Boolean(authorities.controls.value);
    state.controlsSourcePath = authorities.controls.path;
    state.controlsContract = firstKnown(
      controlsReceipt.controlContract,
      controlsReceipt.contract,
      controlsReceipt.CONTRACT
    );

    if (state.labNorthObserved) addNote(state, `LAB_NORTH_OBSERVED:${state.labNorthSourcePath}`);
    if (state.macroWestObserved) addNote(state, `MACRO_WEST_OBSERVED:${state.macroWestSourcePath}`);
    if (state.canvasObserved) addNote(state, `CANVAS_AUTHORITY_OBSERVED:${state.canvasSourcePath}`);
    if (state.routeConductorObserved) addNote(state, `ROUTE_CONDUCTOR_OBSERVED:${state.routeConductorSourcePath}`);
    if (state.controlsObserved) addNote(state, `CONTROL_AUTHORITY_OBSERVED:${state.controlsSourcePath}`);
  }

  function updateStateFromEvidence(state, step, evidence) {
    if (!isObject(evidence)) return;

    state.evidenceByStep[step.id] = clonePlain(evidence);

    state.servedHtmlContract = firstKnown(getValue(evidence, "SERVED_HTML_CONTRACT", ""), state.servedHtmlContract);
    state.servedIndexJsContract = firstKnown(getValue(evidence, "SERVED_INDEX_JS_CONTRACT", ""), state.servedIndexJsContract);
    state.servedRouteConductorContract = firstKnown(getValue(evidence, "SERVED_ROUTE_CONDUCTOR_CONTRACT", ""), state.servedRouteConductorContract);
    state.indexScriptSrc = firstKnown(getValue(evidence, "INDEX_SCRIPT_SRC", ""), state.indexScriptSrc);
    state.routeConductorScriptSrc = firstKnown(getValue(evidence, "ROUTE_CONDUCTOR_SCRIPT_SRC", ""), state.routeConductorScriptSrc);
    state.cacheOrServedContractMismatch = firstKnown(getValue(evidence, "CACHE_OR_SERVED_CONTRACT_MISMATCH", ""), state.cacheOrServedContractMismatch);
    state.currentVisibleHearthStatus = firstKnown(getValue(evidence, "CURRENT_VISIBLE_HEARTH_STATUS", ""), state.currentVisibleHearthStatus);

    state.diagnosticTargetAccessStatus = firstKnown(getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_STATUS", ""), state.diagnosticTargetAccessStatus);
    state.diagnosticTargetAccessError = firstKnown(getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_ERROR", ""), state.diagnosticTargetAccessError);
    state.renderedPlanetProofReady = firstKnown(getValue(evidence, "RENDERED_PLANET_PROOF_READY", ""), state.renderedPlanetProofReady);
    state.visiblePlanetProofReady = firstKnown(getValue(evidence, "VISIBLE_PLANET_PROOF_READY", ""), state.visiblePlanetProofReady);
    state.visiblePlanetProofSource = firstKnown(getValue(evidence, "VISIBLE_PLANET_PROOF_SOURCE", ""), state.visiblePlanetProofSource);
    state.canvasExpressionProofStatus = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_PROOF_STATUS", ""), state.canvasExpressionProofStatus);
    state.canvasExpressionBottleneckClass = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", ""), state.canvasExpressionBottleneckClass);
    state.canvasExpressionSurfaceReady = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_SURFACE_READY", ""), state.canvasExpressionSurfaceReady);
    state.canvasExpressionRichnessReady = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_RICHNESS_READY", ""), state.canvasExpressionRichnessReady);
    state.domExpressionSurfaceProofReady = firstKnown(getValue(evidence, "DOM_EXPRESSION_SURFACE_PROOF_READY", ""), state.domExpressionSurfaceProofReady);
    state.canvasPixelVarianceStatus = firstKnown(getValue(evidence, "CANVAS_PIXEL_VARIANCE_STATUS", ""), state.canvasPixelVarianceStatus);
    state.canvasFingerExpressionStatus = firstKnown(getValue(evidence, "CANVAS_FINGER_EXPRESSION_STATUS", ""), state.canvasFingerExpressionStatus);
    state.fourWayCanvasHandoffStatus = firstKnown(getValue(evidence, "FOUR_WAY_CANVAS_HANDOFF_STATUS", ""), state.fourWayCanvasHandoffStatus);
    state.currentCanvasParentContract = firstKnown(getValue(evidence, "CURRENT_CANVAS_PARENT_CONTRACT", ""), state.currentCanvasParentContract);
    state.currentCanvasParentRecognized = firstKnown(getValue(evidence, "CURRENT_CANVAS_PARENT_RECOGNIZED", ""), state.currentCanvasParentRecognized);

    state.controlFileStatus = firstKnown(getValue(evidence, "CONTROL_FILE_STATUS", ""), state.controlFileStatus);
    state.controlFileLoaded = firstKnown(getValue(evidence, "CONTROL_FILE_LOADED", ""), state.controlFileLoaded);
    state.controlGlobalPresent = firstKnown(getValue(evidence, "CONTROL_GLOBAL_PRESENT", ""), state.controlGlobalPresent);
    state.controlReceiptPresent = firstKnown(getValue(evidence, "CONTROL_RECEIPT_PRESENT", ""), state.controlReceiptPresent);
    state.controlHandshakeStatus = firstKnown(getValue(evidence, "CONTROL_HANDSHAKE_STATUS", ""), state.controlHandshakeStatus);
    state.motionTouchStatus = firstKnown(getValue(evidence, "MOTION_TOUCH_STATUS", ""), state.motionTouchStatus);
    state.dragStatus = firstKnown(getValue(evidence, "DRAG_STATUS", ""), state.dragStatus);
    state.viewControlStatus = firstKnown(getValue(evidence, "VIEW_CONTROL_STATUS", ""), state.viewControlStatus);

    state.fileCompositionStatus = firstKnown(getValue(evidence, "FILE_COMPOSITION_STATUS", ""), state.fileCompositionStatus);
    state.diagnosticInstrumentStatus = firstKnown(getValue(evidence, "DIAGNOSTIC_INSTRUMENT_STATUS", ""), state.diagnosticInstrumentStatus);
    state.canvasExpressionInstrumentationStatus = firstKnown(getValue(evidence, "CANVAS_EXPRESSION_INSTRUMENTATION_STATUS", ""), state.canvasExpressionInstrumentationStatus);

    state.zoneOfInflictionOwner = firstKnown(getValue(evidence, "ZONE_OF_INFLICTION_OWNER", ""), state.zoneOfInflictionOwner);
    state.zoneOfInflictionFile = firstKnown(getValue(evidence, "ZONE_OF_INFLICTION_FILE", ""), state.zoneOfInflictionFile);
    state.zoneOfInflictionClass = firstKnown(getValue(evidence, "ZONE_OF_INFLICTION_CLASS", ""), state.zoneOfInflictionClass);
    state.zoneOfInflictionReason = firstKnown(getValue(evidence, "ZONE_OF_INFLICTION_REASON", ""), state.zoneOfInflictionReason);

    state.primaryCase = firstKnown(getValue(evidence, "PRIMARY_CASE", ""), state.primaryCase);
    state.calibrationStatus = firstKnown(getValue(evidence, "CALIBRATION_STATUS", ""), state.calibrationStatus);
    state.calibrationHoldReason = firstKnown(getValue(evidence, "CALIBRATION_HOLD_REASON", ""), state.calibrationHoldReason);
    state.recommendedNextOwner = firstKnown(getValue(evidence, "RECOMMENDED_NEXT_OWNER", ""), state.recommendedNextOwner);
    state.recommendedNextFile = firstKnown(getValue(evidence, "RECOMMENDED_NEXT_FILE", ""), state.recommendedNextFile);
    state.recommendedNextAction = firstKnown(getValue(evidence, "RECOMMENDED_NEXT_ACTION", ""), state.recommendedNextAction);

    for (const note of normalizeNotes(
      getValue(evidence, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "EAST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "WEST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(evidence, "SOUTH_SECONDARY_OUTPUT_NOTES", "")
    )) {
      addNote(state, note);
    }
  }

  async function processStep(state, step, options = {}) {
    const entry = {
      order: step.order,
      id: step.id,
      role: step.role,
      file: step.file,
      expectedContract: step.expectedContract,
      owner: step.owner,
      expected: true,
      loadAttempted: false,
      loadStatus: step.id === "NORTH_RAIL" ? "SELF" : "NOT_ATTEMPTED",
      observedBeforeLoad: false,
      observedAfterLoad: false,
      observed: false,
      sourcePath: "NONE",
      contract: "UNKNOWN",
      receipt: "UNKNOWN",
      callAttempted: false,
      callMethod: "NONE",
      callReturned: false,
      callStatus: step.id === "NORTH_RAIL" ? "SELF_READY" : "NOT_CALLED",
      callError: "NONE",
      outputKeys: "NONE",
      status: "PENDING"
    };

    if (step.id === "NORTH_RAIL") {
      entry.observedBeforeLoad = true;
      entry.observedAfterLoad = true;
      entry.observed = true;
      entry.sourcePath = "SELF";
      entry.contract = CONTRACT;
      entry.receipt = RECEIPT;
      entry.status = "COMPLETE";
      state.chronology.push(entry);
      addNote(state, "CHRONOLOGY_STEP_COMPLETE:NORTH_RAIL");
      return { entry, output: {}, evidence: {} };
    }

    const foundBefore = findFirstPath(step.paths);
    entry.observedBeforeLoad = Boolean(foundBefore.value);

    let found = foundBefore;

    if (!foundBefore.value && options.loadMissingScripts !== false) {
      const load = await loadScriptOnce(step.file, `hearth-diagnostic-${step.id.toLowerCase()}-script`);
      entry.loadAttempted = load.attempted === true;
      entry.loadStatus = load.status;
      found = findFirstPath(step.paths);
    } else if (foundBefore.value) {
      entry.loadStatus = "ALREADY_OBSERVED";
    } else {
      entry.loadStatus = "LOAD_SKIPPED_BY_OPTIONS";
    }

    entry.observedAfterLoad = Boolean(found.value);
    entry.observed = Boolean(found.value);
    entry.sourcePath = found.path;

    if (!found.value) {
      entry.status = "NOT_OBSERVED";
      entry.callStatus = "NOT_CALLED_NOT_OBSERVED";
      state.chronology.push(entry);
      addNote(state, `CHRONOLOGY_STEP_NOT_OBSERVED:${step.id}:${step.file}`);
      return { entry, output: {}, evidence: {} };
    }

    const receipt = getReceiptFromAuthority(found.value) || {};
    entry.contract = firstKnown(
      receipt.contract,
      receipt.CONTRACT,
      receipt.implementationContract,
      found.value.contract,
      found.value.CONTRACT
    );
    entry.receipt = firstKnown(
      receipt.receipt,
      receipt.RECEIPT,
      receipt.implementationReceipt,
      found.value.receipt,
      found.value.RECEIPT
    );

    const acceptedMethod = (step.methods || []).find((method) => isFunction(found.value[method]));

    if (!acceptedMethod) {
      entry.status = "OBSERVED_API_MISSING";
      entry.callStatus = "CALL_METHOD_NOT_FOUND";
      state.chronology.push(entry);
      addNote(state, `CHRONOLOGY_STEP_OBSERVED_API_MISSING:${step.id}`);
      return { entry, output: receipt || {}, evidence: receipt || {} };
    }

    entry.callAttempted = true;
    entry.callMethod = acceptedMethod;

    try {
      const payload = {
        northContract: CONTRACT,
        northReceipt: RECEIPT,
        previousNorthContract: PREVIOUS_CONTRACT,
        chronologyHubActive: true,
        eightWayProbeBridgeActive: false,
        targetRoute: TARGET_ROUTE,
        diagnosticRoute: DIAGNOSTIC_ROUTE,
        currentReport: clonePlain(state.reportObject || {}),
        chronology: clonePlain(state.chronology),
        evidenceByStep: clonePlain(state.evidenceByStep),
        expectedHtmlContract: EXPECTED_HTML_CONTRACT,
        expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
        expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        expectedControlContract: EXPECTED_CONTROL_CONTRACT,
        expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
        acceptedHtmlContracts: ACCEPTED_HTML_CONTRACTS.slice(),
        acceptedIndexContracts: ACCEPTED_INDEX_CONTRACTS.slice(),
        acceptedRouteConductorContracts: ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.slice(),
        noClaims: clonePlain(NO_CLAIMS),
        options: clonePlain(options)
      };

      if (options.targetDocument) payload.targetDocument = options.targetDocument;
      if (options.targetWindow) payload.targetWindow = options.targetWindow;
      if (options.frameElement) payload.frameElement = options.frameElement;

      const output = await Promise.resolve(found.value[acceptedMethod](payload));
      const evidence = extractEvidence(output);

      entry.callReturned = true;
      entry.callStatus = "CALL_RETURNED";
      entry.status = "COMPLETE";
      entry.outputKeys = Object.keys(evidence || {}).slice(0, 40).join(",") || "OUTPUT_EMPTY";

      state.chronology.push(entry);
      updateStateFromEvidence(state, step, evidence);

      if (step.id === "RAIL_SOUTH") {
        state.southOutputStatus = firstKnown(
          getValue(output, "SOUTH_OUTPUT_STATUS", ""),
          getValue(output && output.output, "SOUTH_OUTPUT_STATUS", ""),
          getValue(evidence, "SOUTH_OUTPUT_STATUS", ""),
          "COMPLETE"
        );
        state.southMeaningPreserved = firstKnown(
          getValue(output, "SOUTH_MEANING_PRESERVED", ""),
          getValue(output && output.output, "SOUTH_MEANING_PRESERVED", ""),
          getValue(evidence, "SOUTH_MEANING_PRESERVED", ""),
          "UNKNOWN"
        );
      }

      addNote(state, `CHRONOLOGY_STEP_COMPLETE:${step.id}:${acceptedMethod}`);
      return { entry, output, evidence };
    } catch (error) {
      entry.callReturned = false;
      entry.callStatus = "CALL_FAILED";
      entry.callError = bounded(error && error.message ? error.message : error, 1000);
      entry.status = "CALL_FAILED";

      state.chronology.push(entry);
      addNote(state, `CHRONOLOGY_STEP_CALL_FAILED:${step.id}:${entry.callError}`);

      return { entry, output: {}, evidence: {} };
    }
  }

  function applySpreadRecognition(state) {
    const joined = [
      state.servedRouteConductorContract,
      state.routeConductorContract,
      state.currentVisibleHearthStatus,
      state.routeConductorScriptSrc
    ].join(" | ");

    const routeRecognized = ACCEPTED_ROUTE_CONDUCTOR_CONTRACTS.some((contract) => joined.includes(contract));
    const scriptCacheStale =
      safeString(state.routeConductorScriptSrc).includes("HEARTH_ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_INTEGRATION_TNT_v9_7") &&
      routeRecognized &&
      joined.includes(EXPECTED_ROUTE_CONDUCTOR_CONTRACT);

    state.cacheKeyStaleNonBlocking = boolText(scriptCacheStale, "false");

    const htmlOk =
      state.servedHtmlContract === "UNKNOWN" ||
      ACCEPTED_HTML_CONTRACTS.includes(state.servedHtmlContract);

    const indexOk =
      state.servedIndexJsContract === "UNKNOWN" ||
      ACCEPTED_INDEX_CONTRACTS.includes(state.servedIndexJsContract);

    const routeOk = state.servedRouteConductorContract === "UNKNOWN" || routeRecognized;

    state.servedContractMismatchIsBlocking = boolText(!(htmlOk && indexOk && routeOk), "false");

    if (scriptCacheStale) {
      addNote(state, "CACHE_KEY_STALE_NON_BLOCKING:SCRIPT_QUERY_KEY_DOES_NOT_CONTROL_RENDERED_CONTRACT");
    }

    if (routeRecognized) {
      addNote(state, "ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED_CURRENT_OR_ACCEPTED_LINEAGE");
    }
  }

  function resolveChronologyDisposition(state) {
    const firstFailure = state.chronology.find((entry) => {
      return (
        entry.id !== "NORTH_RAIL" &&
        (
          entry.status === "NOT_OBSERVED" ||
          entry.status === "CALL_FAILED" ||
          entry.status === "OBSERVED_API_MISSING"
        )
      );
    });

    if (firstFailure) {
      state.chronologyCompletionStatus = "CHRONOLOGY_STOPPED_AT_FIRST_FAILURE";
      state.firstChronologyFailureOwner = firstFailure.owner;
      state.firstChronologyFailureFile = firstFailure.file;
      state.firstChronologyFailureClass = firstFailure.status;
      state.firstChronologyFailureReason =
        firstFailure.status === "NOT_OBSERVED"
          ? "EXPECTED_DIAGNOSTIC_FILE_NOT_OBSERVED_AFTER_LOAD_ATTEMPT"
          : firstFailure.status === "OBSERVED_API_MISSING"
            ? "EXPECTED_DIAGNOSTIC_FILE_OBSERVED_BUT_REQUIRED_CALL_SURFACE_MISSING"
            : "EXPECTED_DIAGNOSTIC_FILE_CALL_FAILED";

      state.zoneOfInflictionOwner = firstFailure.owner;
      state.zoneOfInflictionFile = firstFailure.file;
      state.zoneOfInflictionClass = firstFailure.status;
      state.zoneOfInflictionReason = state.firstChronologyFailureReason;

      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = `CALIBRATION_HOLD_${firstFailure.id}`;
      state.calibrationHoldReason = state.firstChronologyFailureReason;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = firstFailure.owner;
      state.recommendedNextFile = firstFailure.file;
      state.recommendedNextAction = `CRAFT_OR_RENEW_${firstFailure.id}_TO_CHRONOLOGY_STANDARD_AND_RERUN_DIAGNOSTIC`;

      addNote(state, `ZONE_OF_INFLICTION_FROM_CHRONOLOGY:${firstFailure.id}:${firstFailure.file}`);
      return;
    }

    const surfaceFalse =
      state.canvasExpressionSurfaceReady === "false" ||
      state.domExpressionSurfaceProofReady === "false" ||
      state.canvasExpressionProofStatus === "HANDSHAKE_PENDING" ||
      state.canvasExpressionProofStatus === "ACTIVE_DEGRADED";

    if (surfaceFalse) {
      state.chronologyCompletionStatus = "CHRONOLOGY_COMPLETE_EXPRESSION_SURFACE_NOT_PROVEN";
      state.firstChronologyFailureOwner = "NONE";
      state.firstChronologyFailureFile = "NONE";
      state.firstChronologyFailureClass = "NONE";
      state.firstChronologyFailureReason = "ALL_OBSERVED_CHRONOLOGY_STEPS_RETURNED_OR_WERE_READABLE";

      state.zoneOfInflictionOwner = "CANVAS_EXPRESSION_SURFACE";
      state.zoneOfInflictionFile = CANVAS_FILE;
      state.zoneOfInflictionClass = "EXPRESSION_SURFACE_NOT_PROVEN";
      state.zoneOfInflictionReason =
        firstKnown(state.canvasExpressionBottleneckClass, "CHRONOLOGY_COMPLETED_BUT_CANVAS_EXPRESSION_SURFACE_REMAINS_UNPROVEN");

      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_HOLD_CANVAS_EXPRESSION_SURFACE";
      state.calibrationHoldReason = state.zoneOfInflictionReason;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = "CANVAS_EXPRESSION_SURFACE";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction =
        "AUDIT_CANVAS_EXPRESSION_SURFACE_RECEIVER_AFTER_CHRONOLOGY_CONFIRMS_DIAGNOSTIC_TRACK";

      addNote(state, "ZONE_OF_INFLICTION_FROM_EXPRESSION_SURFACE_NOT_CHRONOLOGY");
      return;
    }

    state.chronologyCompletionStatus = "CHRONOLOGY_COMPLETE";
    state.firstChronologyFailureOwner = "NONE";
    state.firstChronologyFailureFile = "NONE";
    state.firstChronologyFailureClass = "NONE";
    state.firstChronologyFailureReason = "NONE";

    state.zoneOfInflictionOwner = "NONE";
    state.zoneOfInflictionFile = "NONE";
    state.zoneOfInflictionClass = "NONE";
    state.zoneOfInflictionReason = "CHRONOLOGY_COMPLETE_NO_DIAGNOSTIC_FILE_FAILURE_DETECTED";

    state.primaryCase = "DIAGNOSTIC_TRACK_COMPLETE_NO_VISUAL_PASS_CLAIM";
    state.calibrationStatus = "CALIBRATION_TRACK_COMPLETE";
    state.calibrationHoldReason = "NONE";
    state.diagnosticRailClean = "true";
    state.calibrationPointReached = "true";
    state.recommendedNextOwner = "TEACHER_REVIEW";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction =
      "REVIEW_EXPRESSION_OUTPUT_WITH_DIAGNOSTIC_TRACK_COMPLETE_NO_READY_OR_VISUAL_PASS_CLAIM";

    addNote(state, "CHRONOLOGY_COMPLETE_NO_FILE_FAILURE_DETECTED");
  }

  function resolveAlignment(state) {
    const required = CHRONOLOGY_STEPS.length;
    const complete = state.chronology.filter((entry) => entry.status === "COMPLETE").length;
    const firstFailed = state.chronology.find((entry) => entry.status !== "COMPLETE");

    state.newsAlignmentScore = Math.round((complete / required) * 100);
    state.newsAlignmentStatus = firstFailed ? "NEWS_ALIGNMENT_PARTIAL" : "NEWS_ALIGNMENT_COMPLETE";
    state.newsAlignmentFirstFailedStage = firstFailed ? firstFailed.id : "NONE";

    const fibStages = [
      { key: "F1", passed: Boolean(state.chronology.find((entry) => entry.id === "NORTH_RAIL" && entry.status === "COMPLETE")) },
      { key: "F2", passed: Boolean(state.chronology.find((entry) => entry.id === "PROBE_NORTH" && entry.status === "COMPLETE")) },
      { key: "F3", passed: Boolean(state.chronology.find((entry) => entry.id === "RAIL_EAST" && entry.status === "COMPLETE")) },
      { key: "F5", passed: Boolean(state.chronology.find((entry) => entry.id === "PROBE_EAST" && entry.status === "COMPLETE")) },
      { key: "F8", passed: Boolean(state.chronology.find((entry) => entry.id === "RAIL_WEST" && entry.status === "COMPLETE")) },
      { key: "F13", passed: Boolean(state.chronology.find((entry) => entry.id === "PROBE_WEST" && entry.status === "COMPLETE")) },
      { key: "F21", passed: Boolean(state.chronology.find((entry) => entry.id === "RAIL_SOUTH" && entry.status === "COMPLETE")) && state.f21ClaimedByDiagnosticRail === false },
      { key: "F34", passed: Boolean(state.chronology.find((entry) => entry.id === "PROBE_SOUTH" && entry.status === "COMPLETE")) }
    ];

    const fibPassed = fibStages.filter((stage) => stage.passed).length;
    const fibFirstFailed = fibStages.find((stage) => !stage.passed);

    state.fibonacciSynchronizationScore = Math.round((fibPassed / fibStages.length) * 100);
    state.fibonacciSynchronizationStatus = fibFirstFailed
      ? "FIBONACCI_SYNCHRONIZATION_PARTIAL"
      : "FIBONACCI_SYNCHRONIZATION_COMPLETE";
    state.fibonacciSynchronizationFirstFailedStage = fibFirstFailed ? fibFirstFailed.key : "NONE";

    if (firstFailed) addNote(state, `NEWS_ALIGNMENT_FIRST_FAILED_STAGE:${firstFailed.id}`);
    if (fibFirstFailed) addNote(state, `FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE:${fibFirstFailed.key}`);
  }

  function stableSignatureMaterial(report) {
    const clone = clonePlain(report || {});

    delete clone.DIAGNOSTIC_TIMESTAMP;
    delete clone.NORTH_VERDICT;
    delete clone.RECEIPT_SIGNATURE;
    delete clone.PREVIOUS_RECEIPT_SIGNATURE;
    delete clone.PREVIOUS_RECEIPT_TIMESTAMP;
    delete clone.POTENTIAL_REPEAT_SIGNATURE;

    return JSON.stringify(clone);
  }

  function simpleHash(text) {
    let hash = 2166136261;

    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    return `h${(hash >>> 0).toString(16)}`;
  }

  function applyRepeatSignature(state, report) {
    const material = stableSignatureMaterial(report);
    const signature = simpleHash(material);
    const key = "HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_LAST_SIGNATURE";

    state.receiptSignature = signature;
    state.repeatSignatureBasis = "REPORT_WITH_TIMESTAMP_AND_SIGNATURE_FIELDS_REMOVED";

    try {
      const previousRaw = root.localStorage && root.localStorage.getItem(key);
      const previous = previousRaw ? JSON.parse(previousRaw) : null;

      state.previousReceiptSignature = previous && previous.signature ? previous.signature : "NONE";
      state.previousReceiptTimestamp = previous && previous.timestamp ? previous.timestamp : "NONE";

      state.potentialRepeatSignature =
        Boolean(previous && previous.signature === signature && previous.timestamp !== state.diagnosticTimestamp);

      if (state.potentialRepeatSignature) {
        addNote(state, "POTENTIAL_REPEAT_SIGNATURE:IDENTICAL_DIAGNOSTIC_SIGNATURE_WITH_CHANGED_TIMESTAMP");
      }

      if (root.localStorage) {
        root.localStorage.setItem(key, JSON.stringify({
          signature,
          timestamp: state.diagnosticTimestamp,
          contract: CONTRACT,
          zoneOfInflictionFile: state.zoneOfInflictionFile,
          recommendedNextFile: state.recommendedNextFile
        }));
      }
    } catch (_error) {
      state.previousReceiptSignature = "LOCAL_STORAGE_UNREADABLE";
      state.previousReceiptTimestamp = "LOCAL_STORAGE_UNREADABLE";
      state.potentialRepeatSignature = false;
    }
  }

  function buildNorthVerdict(state) {
    return {
      schema: "HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_VERDICT_SCHEMA_v10",
      northContract: CONTRACT,
      northReceipt: RECEIPT,
      previousNorthContract: PREVIOUS_CONTRACT,
      lineageV8NorthContract: LINEAGE_V8_CONTRACT,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: state.diagnosticTimestamp,

      hub: {
        chronologyHubActive: true,
        northIsHubOnly: true,
        eightWayProbeBridgeActive: false,
        eightFileChronologyActive: true,
        receiverStillCallsNorthOnly: true,
        diagnosticRouteHtmlRenewalRequired: false
      },

      chronology: clonePlain(state.chronology),
      chronologyCompletionStatus: state.chronologyCompletionStatus,

      firstChronologyFailure: {
        owner: state.firstChronologyFailureOwner,
        file: state.firstChronologyFailureFile,
        class: state.firstChronologyFailureClass,
        reason: state.firstChronologyFailureReason
      },

      zoneOfInfliction: {
        owner: state.zoneOfInflictionOwner,
        file: state.zoneOfInflictionFile,
        class: state.zoneOfInflictionClass,
        reason: state.zoneOfInflictionReason
      },

      currentSpread: {
        expectedHtmlContract: EXPECTED_HTML_CONTRACT,
        expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
        expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        servedHtmlContract: state.servedHtmlContract,
        servedIndexJsContract: state.servedIndexJsContract,
        servedRouteConductorContract: state.servedRouteConductorContract,
        routeConductorRuntimeContract: state.routeConductorContract,
        cacheKeyStaleNonBlocking: state.cacheKeyStaleNonBlocking,
        servedContractMismatchIsBlocking: state.servedContractMismatchIsBlocking
      },

      expression: {
        renderedPlanetProofReady: state.renderedPlanetProofReady,
        visiblePlanetProofReady: state.visiblePlanetProofReady,
        visiblePlanetProofSource: state.visiblePlanetProofSource,
        canvasExpressionProofStatus: state.canvasExpressionProofStatus,
        canvasExpressionBottleneckClass: state.canvasExpressionBottleneckClass,
        canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
        canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
        domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
        currentCanvasParentContract: state.currentCanvasParentContract,
        currentCanvasParentRecognized: state.currentCanvasParentRecognized
      },

      repeatSignature: {
        potentialRepeatSignature: state.potentialRepeatSignature,
        receiptSignature: state.receiptSignature,
        previousReceiptSignature: state.previousReceiptSignature,
        previousReceiptTimestamp: state.previousReceiptTimestamp,
        basis: state.repeatSignatureBasis
      },

      authorityBoundaries: {
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
        materialTruthAuthority: false
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

  function chronologyText(state) {
    return state.chronology.map((entry) => {
      return [
        `${entry.order}.${entry.id}`,
        `file:${entry.file}`,
        `load:${entry.loadStatus}`,
        `observed:${entry.observed}`,
        `call:${entry.callStatus}`,
        `status:${entry.status}`
      ].join(" ");
    }).join(" | ");
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
      LINEAGE_V8_NORTH_CONTRACT: LINEAGE_V8_CONTRACT,
      LINEAGE_V7_NORTH_CONTRACT: LINEAGE_V7_CONTRACT,
      BASELINE_V6_NORTH_CONTRACT: BASELINE_V6_CONTRACT,
      FOUNDATION_V5_NORTH_CONTRACT: FOUNDATION_V5_CONTRACT,

      NORTH_CHRONOLOGY_HUB_ACTIVE: true,
      NORTH_IS_HUB_ONLY: true,
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: false,
      EIGHT_FILE_CHRONOLOGY_ACTIVE: true,
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: false,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

      RAIL_NORTH_FILE: FILE,
      RAIL_EAST_FILE,
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      CHRONOLOGY_SEQUENCE: clonePlain(state.chronology),
      CHRONOLOGY_SEQUENCE_TEXT: chronologyText(state),
      CHRONOLOGY_COMPLETION_STATUS: state.chronologyCompletionStatus,

      FIRST_CHRONOLOGY_FAILURE_OWNER: state.firstChronologyFailureOwner,
      FIRST_CHRONOLOGY_FAILURE_FILE: state.firstChronologyFailureFile,
      FIRST_CHRONOLOGY_FAILURE_CLASS: state.firstChronologyFailureClass,
      FIRST_CHRONOLOGY_FAILURE_REASON: state.firstChronologyFailureReason,

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

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,
      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,
      CACHE_KEY_STALE_NON_BLOCKING: state.cacheKeyStaleNonBlocking,
      SERVED_CONTRACT_MISMATCH_IS_BLOCKING: state.servedContractMismatchIsBlocking,
      CURRENT_VISIBLE_HEARTH_STATUS: state.currentVisibleHearthStatus,

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

      CONTROL_FILE,
      CONTROL_FILE_STATUS: state.controlFileStatus,
      CONTROL_FILE_LOADED: state.controlFileLoaded,
      CONTROL_GLOBAL_PRESENT: state.controlGlobalPresent,
      CONTROL_RECEIPT_PRESENT: state.controlReceiptPresent,
      CONTROL_HANDSHAKE_STATUS: state.controlHandshakeStatus,
      MOTION_TOUCH_STATUS: state.motionTouchStatus,
      DRAG_STATUS: state.dragStatus,
      VIEW_CONTROL_STATUS: state.viewControlStatus,
      VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS: state.visiblePlanetAllowedWithoutControls,

      DIAGNOSTIC_INSTRUMENT_STATUS: state.diagnosticInstrumentStatus,
      FILE_COMPOSITION_STATUS: state.fileCompositionStatus,
      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS: state.canvasExpressionInstrumentationStatus,

      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
      SOUTH_MEANING_PRESERVED: state.southMeaningPreserved,

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

      POTENTIAL_REPEAT_SIGNATURE: state.potentialRepeatSignature,
      RECEIPT_SIGNATURE: state.receiptSignature,
      PREVIOUS_RECEIPT_SIGNATURE: state.previousReceiptSignature,
      PREVIOUS_RECEIPT_TIMESTAMP: state.previousReceiptTimestamp,
      REPEAT_SIGNATURE_BASIS: state.repeatSignatureBasis,

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

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
      "EIGHT_FILE_CHRONOLOGY_ACTIVE",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",
      "CHRONOLOGY_COMPLETION_STATUS",
      "FIRST_CHRONOLOGY_FAILURE_OWNER",
      "FIRST_CHRONOLOGY_FAILURE_FILE",
      "FIRST_CHRONOLOGY_FAILURE_CLASS",
      "FIRST_CHRONOLOGY_FAILURE_REASON",
      "ZONE_OF_INFLICTION_OWNER",
      "ZONE_OF_INFLICTION_FILE",
      "ZONE_OF_INFLICTION_CLASS",
      "ZONE_OF_INFLICTION_REASON",
      "CHRONOLOGY_SEQUENCE_TEXT",
      "CHRONOLOGY_SEQUENCE",
      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_SOUTH_FILE",
      "RAIL_WEST_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_WEST_FILE",
      "PROBE_SOUTH_FILE",
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
      "POTENTIAL_REPEAT_SIGNATURE",
      "RECEIPT_SIGNATURE",
      "PREVIOUS_RECEIPT_SIGNATURE",
      "PREVIOUS_RECEIPT_TIMESTAMP",
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
      line("NORTH_CHRONOLOGY_HUB_ACTIVE", getValue(report, "NORTH_CHRONOLOGY_HUB_ACTIVE", "true")),
      line("EIGHT_WAY_PROBE_BRIDGE_ACTIVE", getValue(report, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", "false")),
      line("CHRONOLOGY_COMPLETION_STATUS", getValue(report, "CHRONOLOGY_COMPLETION_STATUS", "UNKNOWN")),
      line("FIRST_CHRONOLOGY_FAILURE_FILE", getValue(report, "FIRST_CHRONOLOGY_FAILURE_FILE", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_OWNER", getValue(report, "ZONE_OF_INFLICTION_OWNER", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_FILE", getValue(report, "ZONE_OF_INFLICTION_FILE", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_CLASS", getValue(report, "ZONE_OF_INFLICTION_CLASS", "UNKNOWN")),
      line("CANVAS_EXPRESSION_PROOF_STATUS", getValue(report, "CANVAS_EXPRESSION_PROOF_STATUS", "UNKNOWN")),
      line("CANVAS_EXPRESSION_BOTTLENECK_CLASS", getValue(report, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", "UNKNOWN")),
      line("POTENTIAL_REPEAT_SIGNATURE", getValue(report, "POTENTIAL_REPEAT_SIGNATURE", "UNKNOWN")),
      line("PRIMARY_CASE", getValue(report, "PRIMARY_CASE", "UNKNOWN")),
      line("CALIBRATION_STATUS", getValue(report, "CALIBRATION_STATUS", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_ACTION", getValue(report, "RECOMMENDED_NEXT_ACTION", "UNKNOWN"))
    ].join("\n");
  }

  async function runDiagnostic(options = {}) {
    const state = makeState();

    try {
      applyAuthorityRead(state);

      const firstSix = CHRONOLOGY_STEPS.filter((step) => step.order <= 6);
      for (const step of firstSix) {
        await processStep(state, step, options);
      }

      applySpreadRecognition(state);
      resolveChronologyDisposition(state);
      resolveAlignment(state);

      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);

      const southRail = CHRONOLOGY_STEPS.find((step) => step.id === "RAIL_SOUTH");
      await processStep(state, southRail, options);

      const probeSouth = CHRONOLOGY_STEPS.find((step) => step.id === "PROBE_SOUTH");
      await processStep(state, probeSouth, options);

      applySpreadRecognition(state);
      resolveChronologyDisposition(state);
      resolveAlignment(state);

      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);

      applyRepeatSignature(state, state.reportObject);

      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);
      state.fullPacketText = composePacketText(state.reportObject);
      state.compactSummary = composeCompactSummary(state.reportObject);

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        chronologyHubActive: true,
        eightWayProbeBridgeActive: false,
        verdict: clonePlain(lastVerdict),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_NORTH_CHRONOLOGY_HUB_TOP_LEVEL_ERROR";
      state.calibrationHoldReason = bounded(error && error.message ? error.message : error, 1000);
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.chronologyCompletionStatus = "NORTH_CHRONOLOGY_HUB_TOP_LEVEL_ERROR";
      state.zoneOfInflictionOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.zoneOfInflictionFile = FILE;
      state.zoneOfInflictionClass = "NORTH_TOP_LEVEL_ERROR";
      state.zoneOfInflictionReason = state.calibrationHoldReason;
      state.recommendedNextOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_NORTH_CHRONOLOGY_HUB_TOP_LEVEL_ERROR_BEFORE_CHILD_RENEWAL";
      addNote(state, `NORTH_CHRONOLOGY_HUB_TOP_LEVEL_ERROR:${state.calibrationHoldReason}`);

      resolveAlignment(state);

      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);
      applyRepeatSignature(state, state.reportObject);
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
    return clonePlain(lastReport || buildReportObject(lastState || makeState()));
  }

  function getNorthVerdict() {
    return clonePlain(lastVerdict || buildNorthVerdict(lastState || makeState()));
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    const state = lastState || makeState();
    return composePacketText(buildReportObject(state));
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    const state = lastState || makeState();
    return composeCompactSummary(buildReportObject(state));
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getReceiptLight() {
    const state = lastState || makeState();

    return {
      parentRole: "NORTH_CHRONOLOGY_HUB_STANDARD",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV8Contract: LINEAGE_V8_CONTRACT,
      lineageV8Receipt: LINEAGE_V8_RECEIPT,
      lineageV7Contract: LINEAGE_V7_CONTRACT,
      baselineV6Contract: BASELINE_V6_CONTRACT,
      foundationV5Contract: FOUNDATION_V5_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      chronologyHubActive: true,
      northIsHubOnly: true,
      northOwnsChronology: true,
      northOwnsChildEvidence: false,
      northOwnsProbeEvidence: false,
      eightWayProbeBridgeActive: false,
      eightFileChronologyActive: true,
      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,

      chronologyCompletionStatus: state.chronologyCompletionStatus,
      firstChronologyFailureOwner: state.firstChronologyFailureOwner,
      firstChronologyFailureFile: state.firstChronologyFailureFile,
      firstChronologyFailureClass: state.firstChronologyFailureClass,
      firstChronologyFailureReason: state.firstChronologyFailureReason,

      zoneOfInflictionOwner: state.zoneOfInflictionOwner,
      zoneOfInflictionFile: state.zoneOfInflictionFile,
      zoneOfInflictionClass: state.zoneOfInflictionClass,
      zoneOfInflictionReason: state.zoneOfInflictionReason,

      potentialRepeatSignature: state.potentialRepeatSignature,
      receiptSignature: state.receiptSignature,
      previousReceiptSignature: state.previousReceiptSignature,
      previousReceiptTimestamp: state.previousReceiptTimestamp,

      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getNorthVerdictApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getStateApiAvailable: true,

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

      htmlFile: HTML_FILE,
      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      canvasFile: CANVAS_FILE,

      railNorthFile: FILE,
      railEastFile: RAIL_EAST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
      railWestFile: RAIL_WEST_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeWestFile: PROBE_WEST_FILE,
      probeSouthFile: PROBE_SOUTH_FILE,

      expectedHtmlContract: EXPECTED_HTML_CONTRACT,
      expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      chronology: clonePlain((lastState || makeState()).chronology),
      northVerdict: clonePlain(lastVerdict || buildNorthVerdict(lastState || makeState())),
      reportObject: clonePlain(lastReport || buildReportObject(lastState || makeState())),

      supportsChronologyHubStandard: true,
      supportsEightFileChronology: true,
      supportsBridgeDemotionToHub: true,
      supportsChildBoundaryPreservation: true,
      supportsProbeBoundaryPreservation: true,
      supportsRepeatSignatureDetection: true,
      supportsExistingDiagnosticRouteIntegration: true,
      supportsNorthOnlyReceiverCall: true,
      supportsZoneOfInflictionFromChronology: true,

      ...NO_CLAIMS
    };
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastVerdict = clonePlain(
      state.northVerdict && Object.keys(state.northVerdict).length
        ? state.northVerdict
        : buildNorthVerdict(state)
    );
    lastReport = clonePlain(
      state.reportObject && Object.keys(state.reportObject).length
        ? state.reportObject
        : buildReportObject(state)
    );
    lastPacketText = state.fullPacketText || composePacketText(lastReport);
    lastCompactSummary = state.compactSummary || composeCompactSummary(lastReport);

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticRail = api;
    root.HEARTH.parallelDiagnosticRail = api;
    root.HEARTH.diagnosticNorth = api;
    root.HEARTH.diagnosticRailNorth = api;
    root.HEARTH.diagnosticNorthChronologyHub = api;

    root.DEXTER_LAB.hearthDiagnosticRail = api;
    root.DEXTER_LAB.hearthDiagnosticNorth = api;
    root.DEXTER_LAB.hearthDiagnosticNorthChronologyHub = api;

    root.HEARTH_DIAGNOSTIC_RAIL = api;
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL = api;
    root.HEARTH_DIAGNOSTIC_NORTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH = api;
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB = api;

    root.HEARTH_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_REPORT = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_VERDICT = clonePlain(lastVerdict);

    root.HEARTH_DIAGNOSTIC_RAIL_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_PACKET_TEXT = lastPacketText;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV8Contract: LINEAGE_V8_CONTRACT,
    lineageV8Receipt: LINEAGE_V8_RECEIPT,
    lineageV7Contract: LINEAGE_V7_CONTRACT,
    baselineV6Contract: BASELINE_V6_CONTRACT,
    foundationV5Contract: FOUNDATION_V5_CONTRACT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    chronologyHubActive: true,
    northIsHubOnly: true,
    northOwnsChronology: true,
    northOwnsChildEvidence: false,
    northOwnsProbeEvidence: false,
    eightWayProbeBridgeActive: false,
    eightFileChronologyActive: true,
    diagnosticRouteHtmlRenewalRequired: false,
    receiverStillCallsNorthOnly: true,

    railNorthFile: FILE,
    railEastFile: RAIL_EAST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    railWestFile: RAIL_WEST_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,
    chronologySteps: CHRONOLOGY_STEPS,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

    runDiagnostic,
    getReport,
    getNorthVerdict,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getReceiptLight,
    getState,

    supportsChronologyHubStandard: true,
    supportsEightFileChronology: true,
    supportsBridgeDemotionToHub: true,
    supportsChildBoundaryPreservation: true,
    supportsProbeBoundaryPreservation: true,
    supportsRepeatSignatureDetection: true,
    supportsExistingDiagnosticRouteIntegration: true,
    supportsNorthOnlyReceiverCall: true,
    supportsZoneOfInflictionFromChronology: true,

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
