// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic Probe South / F55 ninth-cycle probe-truth cell only.
// Purpose:
// - Exist as the physical file North v11 expects at /assets/hearth/hearth.diagnostic.probe.south.js.
// - Publish HEARTH.diagnosticProbeSouth before North calls runProbeSouth.
// - Preserve the existing nine-step chronology: North -> Probe North -> East -> Probe East -> West -> Probe West -> Canvas Surface Truth -> South -> Probe South.
// - Treat South as the F34 packet-output authority.
// - Treat this file as the F55 probe-truth / packet-meaning confirmation cell.
// - Confirm whether South was observed, called, and returned packet-output meaning.
// - Optionally read the extra tenth/asymmetric South-pair or Surface Pointer Bishop inspection cell if it is present.
// - Return detailed evidence without mutating production, restarting runtime, drawing Canvas, claiming F13/F21, or claiming visual pass.
// Does not own:
// - diagnostic North chronology
// - diagnostic South packet output
// - Canvas drawing
// - Canvas repair
// - production route repair
// - runtime restart
// - controls
// - terrain/material/hydrology truth
// - final visual pass

(() => {
  "use strict";

  const PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const PROBE_SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";

  const VERSION =
    "2026-06-06.hearth-diagnostic-probe-south-physical-f55-probe-truth-cell-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v2";

  const NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";
  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = SOUTH_FILE;

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_CANVAS_SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const PROBE_SOUTH_FILE = FILE;

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
  const EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";

  const ACCEPTED_SOUTH_CONTRACTS = Object.freeze([
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_TNT_v9",
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8",
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7",
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1"
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
    webGL: false,
    webgl: false
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
  const api = {};

  let lastReport = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastState = null;

  const PRIMARY_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      alias: "HEARTH.diagnosticProbeSouth",
      layer: "HEARTH",
      role: "physical-probe-south-primary",
      authority: "probe-truth-packet-meaning"
    }),
    Object.freeze({
      order: 2,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      alias: "HEARTH.diagnosticRailProbeSouth",
      layer: "HEARTH",
      role: "physical-probe-south-rail-compatible",
      authority: "probe-truth-packet-meaning"
    }),
    Object.freeze({
      order: 3,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      alias: "HEARTH.diagnosticSouthProbe",
      layer: "HEARTH",
      role: "south-probe-compatible",
      authority: "probe-truth-packet-meaning"
    }),
    Object.freeze({
      order: 4,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      alias: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      layer: "GLOBAL",
      role: "legacy-global-probe-south",
      authority: "probe-truth-packet-meaning"
    }),
    Object.freeze({
      order: 5,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      alias: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      layer: "GLOBAL",
      role: "legacy-global-rail-probe-south",
      authority: "probe-truth-packet-meaning"
    }),
    Object.freeze({
      order: 6,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      alias: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      layer: "DEXTER_LAB",
      role: "lab-visible-probe-south",
      authority: "probe-truth-packet-meaning"
    })
  ]);

  const SOUTH_ALIAS_CANDIDATES = Object.freeze([
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.diagnosticSouthRail",
    "HEARTH.southDiagnostic",
    "HEARTH.southDiagnosticRail",
    "HEARTH_DIAGNOSTIC_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_RAIL",
    "DEXTER_LAB.hearthDiagnosticSouth",
    "DEXTER_LAB.hearthDiagnosticRailSouth",
    "DEXTER_LAB.hearthDiagnosticSouthRail",
    "DEXTER_LAB.hearthSouthDiagnosticRail"
  ]);

  const OPTIONAL_TENTH_CELL_ALIAS_CANDIDATES = Object.freeze([
    "HEARTH.diagnosticSouthPairSide",
    "HEARTH.diagnosticSouthPairCell",
    "HEARTH.diagnosticSouthPairInspect",
    "HEARTH.diagnosticSouthSurfacePointerBishop",
    "HEARTH.diagnosticSurfacePointerBishopSouth",
    "HEARTH.diagnosticProbeSouthSurfacePointerBishop",
    "HEARTH.southSurfacePointerBishopInspect",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspector",
    "HEARTH.canvasFingerProof",
    "HEARTH.hearthCanvasFingerInspect",
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE",
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_CELL",
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP",
    "HEARTH_DIAGNOSTIC_SURFACE_POINTER_BISHOP_SOUTH",
    "DEXTER_LAB.hearthDiagnosticSouthPairSide",
    "DEXTER_LAB.hearthDiagnosticSouthSurfacePointerBishop",
    "DEXTER_LAB.hearthCanvasFingerInspect"
  ]);

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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function compact(value, limit = 4000) {
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
      const joined = value
        .map((entry) => {
          if (isObject(entry)) {
            try {
              return JSON.stringify(entry);
            } catch (_error) {
              return compact(entry, 1600);
            }
          }
          return compact(entry, 1600);
        })
        .filter(Boolean)
        .join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return compact(JSON.stringify(value), 24000) || fallback;
      } catch (_error) {
        return compact(value, 4000) || fallback;
      }
    }

    return compact(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null ? fallback : value;
    }

    const lower = String(key).toLowerCase();
    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null ? fallback : value;
      }
    }

    return fallback;
  }

  function firstKnown(...values) {
    for (const value of values) {
      const text = compact(value, 4000);
      if (!text) continue;
      if (text === "UNKNOWN") continue;
      if (text === "NONE") continue;
      if (text === "NOT_FOUND") continue;
      if (text === "UNREADABLE") continue;
      if (text === "INACCESSIBLE") continue;
      return text;
    }
    return "UNKNOWN";
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function truthy(value) {
    return value === true || value === "true" || value === "TRUE" || value === 1 || value === "1";
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "") continue;
      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = compact(raw, 1200);
        if (!clean) continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function pathRead(path) {
    const parts = safeString(path).split(".");
    let value = root;

    for (const part of parts) {
      if (!part) continue;
      if (value && Object.prototype.hasOwnProperty.call(value, part)) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  function aliasChronologyText(list) {
    return (list || [])
      .map((entry) => {
        return [
          `${entry.order}.${entry.alias}`,
          `order:${entry.chronologyOrder}`,
          `fib:${entry.fibonacciStage}`,
          `layer:${entry.layer}`,
          `role:${entry.role}`,
          `authority:${entry.authority}`
        ].join(" ");
      })
      .join(" | ");
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology
      .map((entry) => {
        if (!isObject(entry)) return "UNKNOWN_ENTRY";
        return [
          `${entry.order || "?"}.${entry.id || "UNKNOWN"}`,
          `fib:${entry.fibonacciStage || "UNKNOWN"}`,
          `file:${entry.file || "UNKNOWN"}`,
          `load:${entry.loadStatus || "UNKNOWN"}`,
          `observed:${entry.observed}`,
          `call:${entry.callStatus || "UNKNOWN"}`,
          `status:${entry.status || "UNKNOWN"}`
        ].join(" ");
      })
      .join(" | ");
  }

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }
    if (isObject(input)) return clonePlain(input);
    return {};
  }

  function extractChronology(input, currentReport) {
    if (Array.isArray(input && input.chronology)) return clonePlain(input.chronology);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) {
      return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    }
    if (Array.isArray(currentReport && currentReport.chronology)) {
      return clonePlain(currentReport.chronology);
    }
    return [];
  }

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function outputKeysContain(entry, key) {
    const keys = safeString(entry && entry.outputKeys);
    return keys.split(",").map((item) => item.trim()).includes(key);
  }

  function methodList(apiObject) {
    if (!isObject(apiObject)) return [];
    return Object.keys(apiObject)
      .filter((key) => typeof apiObject[key] === "function")
      .sort();
  }

  function readApiReport(apiObject) {
    if (!isObject(apiObject)) return {};

    const safeMethods = [
      "getReport",
      "getReceipt",
      "getReceiptLight",
      "getState"
    ];

    for (const method of safeMethods) {
      if (typeof apiObject[method] !== "function") continue;
      try {
        const value = apiObject[method]();
        if (isObject(value)) return clonePlain(value);
      } catch (_error) {
        continue;
      }
    }

    return {};
  }

  function discoverFirstApi(aliasList) {
    for (const alias of aliasList) {
      const value = pathRead(alias);
      if (isObject(value)) {
        return {
          observed: true,
          alias,
          api: value,
          contract: firstKnown(value.contract, value.CONTRACT, "UNKNOWN"),
          receipt: firstKnown(value.receipt, value.RECEIPT, "UNKNOWN"),
          methods: methodList(value)
        };
      }
    }

    return {
      observed: false,
      alias: "NONE",
      api: null,
      contract: "UNKNOWN",
      receipt: "UNKNOWN",
      methods: []
    };
  }

  function acceptedSouthContract(contract) {
    const text = compact(contract, 4000);
    return ACCEPTED_SOUTH_CONTRACTS.includes(text);
  }

  function findKeyByFragments(source, fragments) {
    if (!isObject(source)) return "UNKNOWN";
    const keys = Object.keys(source);

    for (const key of keys) {
      const upper = key.toUpperCase();
      let allFound = true;
      for (const fragment of fragments) {
        if (!upper.includes(String(fragment).toUpperCase())) {
          allFound = false;
          break;
        }
      }
      if (allFound) return packetValue(source[key], "UNKNOWN");
    }

    return "UNKNOWN";
  }

  function inspectOptionalTenthCell() {
    const found = discoverFirstApi(OPTIONAL_TENTH_CELL_ALIAS_CANDIDATES);
    const report = found.observed ? readApiReport(found.api) : {};
    const contract = firstKnown(found.contract, getRaw(report, "contract"), getRaw(report, "CONTRACT"));
    const receipt = firstKnown(found.receipt, getRaw(report, "receipt"), getRaw(report, "RECEIPT"));

    const boundaryStatus = firstKnown(
      getRaw(report, "BOUNDARY_STATUS"),
      getRaw(report, "BOUNDARY_READY"),
      getRaw(report, "FINGER_BOUNDARY_STATUS"),
      findKeyByFragments(report, ["BOUNDARY", "STATUS"]),
      findKeyByFragments(report, ["BOUNDARY", "READY"])
    );

    const massStatus = firstKnown(
      getRaw(report, "MASS_STATUS"),
      getRaw(report, "MASS_READY"),
      getRaw(report, "FINGER_MASS_STATUS"),
      findKeyByFragments(report, ["MASS", "STATUS"]),
      findKeyByFragments(report, ["MASS", "READY"])
    );

    const surfaceStatus = firstKnown(
      getRaw(report, "SURFACE_STATUS"),
      getRaw(report, "SURFACE_READY"),
      getRaw(report, "FINGER_SURFACE_STATUS"),
      findKeyByFragments(report, ["SURFACE", "STATUS"]),
      findKeyByFragments(report, ["SURFACE", "READY"])
    );

    const lightStatus = firstKnown(
      getRaw(report, "LIGHT_STATUS"),
      getRaw(report, "LIGHT_READY"),
      getRaw(report, "FINGER_LIGHT_STATUS"),
      findKeyByFragments(report, ["LIGHT", "STATUS"]),
      findKeyByFragments(report, ["LIGHT", "READY"])
    );

    const hexStatus = firstKnown(
      getRaw(report, "HEX_SURFACE_STATUS"),
      getRaw(report, "HEX_SURFACE_READY"),
      getRaw(report, "HEX_TRANSMISSION_STATUS"),
      getRaw(report, "SURFACE_POINTER_BISHOP_HEX_STATUS"),
      findKeyByFragments(report, ["HEX", "SURFACE", "STATUS"]),
      findKeyByFragments(report, ["HEX", "TRANSMISSION"]),
      findKeyByFragments(report, ["POINTER", "BISHOP"])
    );

    const sampleStatus = firstKnown(
      getRaw(report, "EXPRESSION_SAMPLE_STATUS"),
      getRaw(report, "SURFACE_SAMPLE_STATUS"),
      getRaw(report, "SAMPLE_STATUS"),
      findKeyByFragments(report, ["SAMPLE", "STATUS"])
    );

    const recognized = found.observed
      ? "OPTIONAL_TENTH_CELL_OBSERVED"
      : "OPTIONAL_TENTH_CELL_NOT_OBSERVED_NON_BLOCKING";

    return {
      observed: found.observed,
      alias: found.alias,
      contract,
      receipt,
      methods: found.methods.join(",") || "NONE",
      reportKeys: Object.keys(report).join(",") || "NONE",
      status: recognized,
      boundaryStatus,
      massStatus,
      surfaceStatus,
      lightStatus,
      hexStatus,
      sampleStatus,
      report
    };
  }

  function buildBaseState() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_F55_PHYSICAL_PROBE_TRUTH_CELL",
      contract: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      physicalFileObserved: true,
      sourcePath: "HEARTH.diagnosticProbeSouth",
      primaryCallableMethod: "runProbeSouth",
      productionMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasReleaseAuthorized: false,
      routeRepairAuthorized: false,
      finalVisualPassAuthority: false,
      aliasChronology: clonePlain(PRIMARY_ALIAS_CHRONOLOGY),
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function buildSharedFields(input, currentReport, chronology) {
    return {
      PACKET_NAME: firstKnown(currentReport.PACKET_NAME, PACKET_NAME),
      TARGET_ROUTE: firstKnown(currentReport.TARGET_ROUTE, TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: firstKnown(currentReport.DIAGNOSTIC_ROUTE, DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: firstKnown(
        currentReport.DIAGNOSTIC_TIMESTAMP,
        input && input.diagnosticTimestamp,
        nowIso()
      ),

      NORTH_CONTRACT: firstKnown(currentReport.NORTH_CONTRACT, input && input.northContract, NORTH_CONTRACT),
      NORTH_RECEIPT: firstKnown(currentReport.NORTH_RECEIPT, input && input.northReceipt, NORTH_RECEIPT),
      PREVIOUS_NORTH_CONTRACT: firstKnown(
        currentReport.PREVIOUS_NORTH_CONTRACT,
        input && input.previousNorthContract,
        PREVIOUS_NORTH_CONTRACT
      ),
      PREVIOUS_NORTH_RECEIPT: firstKnown(
        currentReport.PREVIOUS_NORTH_RECEIPT,
        input && input.previousNorthReceipt,
        PREVIOUS_NORTH_RECEIPT
      ),

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(
        getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", true),
        "true"
      ),
      NORTH_IS_HUB_ONLY: boolText(
        getRaw(currentReport, "NORTH_IS_HUB_ONLY", true),
        "true"
      ),
      NINE_STEP_CHRONOLOGY_ACTIVE: boolText(
        getRaw(currentReport, "NINE_STEP_CHRONOLOGY_ACTIVE", true),
        "true"
      ),
      CANVAS_SURFACE_TRUTH_PROBE_EXPECTED: boolText(
        getRaw(currentReport, "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED", true),
        "true"
      ),
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: boolText(
        getRaw(currentReport, "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED", false),
        "false"
      ),
      RECEIVER_STILL_CALLS_NORTH_ONLY: boolText(
        getRaw(currentReport, "RECEIVER_STILL_CALLS_NORTH_ONLY", true),
        "true"
      ),

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_CANVAS_SURFACE_TRUTH_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT: firstKnown(currentReport.EXPECTED_HTML_CONTRACT, EXPECTED_HTML_CONTRACT),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(currentReport.EXPECTED_INDEX_JS_CONTRACT, EXPECTED_INDEX_JS_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(
        currentReport.EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        EXPECTED_ROUTE_CONDUCTOR_CONTRACT
      ),
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT: firstKnown(
        currentReport.EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
        EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT
      ),
      EXPECTED_CONTROL_CONTRACT: firstKnown(currentReport.EXPECTED_CONTROL_CONTRACT, EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: firstKnown(currentReport.EXPECTED_CANVAS_CONTRACT, EXPECTED_CANVAS_CONTRACT),
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
        EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT
      ),
      EXPECTED_PROBE_SOUTH_CONTRACT: PROBE_SOUTH_CONTRACT,

      CHRONOLOGY_SEQUENCE: chronology,
      CHRONOLOGY_SEQUENCE_TEXT: firstKnown(
        currentReport.CHRONOLOGY_SEQUENCE_TEXT,
        chronologyText(chronology)
      )
    };
  }

  function buildProbeSouthReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);
    const shared = buildSharedFields(input, currentReport, chronology);

    const southEntry = findChronologyEntry(chronology, "RAIL_SOUTH");
    const southChronologyEntryObserved = Boolean(southEntry);
    const southObserved = Boolean(southEntry && southEntry.observed === true);
    const southCallReturned = Boolean(southEntry && southEntry.callStatus === "CALL_RETURNED");
    const southStatusComplete = Boolean(southEntry && southEntry.status === "COMPLETE");
    const southCallMethod = firstKnown(southEntry && southEntry.callMethod, "UNKNOWN");
    const southEntryContract = firstKnown(southEntry && southEntry.contract, "UNKNOWN");
    const southEntryReceipt = firstKnown(southEntry && southEntry.receipt, "UNKNOWN");
    const southEntryContractRecognized = acceptedSouthContract(southEntryContract);

    const southApiDiscovery = discoverFirstApi(SOUTH_ALIAS_CANDIDATES);
    const southApiReport = southApiDiscovery.observed ? readApiReport(southApiDiscovery.api) : {};
    const southApiContract = firstKnown(
      southApiDiscovery.contract,
      getRaw(southApiReport, "SOUTH_CONTRACT"),
      getRaw(southApiReport, "contract"),
      getRaw(southApiReport, "CONTRACT")
    );
    const southApiReceipt = firstKnown(
      southApiDiscovery.receipt,
      getRaw(southApiReport, "SOUTH_RECEIPT"),
      getRaw(southApiReport, "receipt"),
      getRaw(southApiReport, "RECEIPT")
    );
    const southApiContractRecognized = acceptedSouthContract(southApiContract);

    const southPacketOutputKeysPresent = Boolean(
      southEntry &&
        outputKeysContain(southEntry, "PACKET_NAME") &&
        outputKeysContain(southEntry, "CHRONOLOGY_SEQUENCE") &&
        outputKeysContain(southEntry, "ZONE_OF_INFLICTION_FILE")
    );

    const southMeaningPreserved =
      southChronologyEntryObserved &&
      southObserved &&
      southCallReturned &&
      southStatusComplete &&
      (southEntryContractRecognized || southApiContractRecognized);

    const optionalTenth = inspectOptionalTenthCell();

    const probeRunStatus = southMeaningPreserved
      ? "COMPLETE"
      : "COMPLETE_WITH_SOUTH_MEANING_WARNING";

    const packetMeaningStatus = southMeaningPreserved
      ? "SOUTH_PACKET_OUTPUT_OBSERVED_AND_MEANING_PRESERVED"
      : "PROBE_SOUTH_ACTIVE_BUT_SOUTH_PACKET_MEANING_NOT_FULLY_PROVEN";

    const returnStatus = southMeaningPreserved
      ? "F55_PROBE_TRUTH_RETURN_COMPLETE"
      : "F55_PROBE_TRUTH_RETURN_ACTIVE_WITH_WARNING";

    const checkmarkStatus = southMeaningPreserved
      ? "CHECKMARK_PASS"
      : "CHECKMARK_WARNING";

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "PROBE_SOUTH_PHYSICAL_FILE_OBSERVED",
      "PROBE_SOUTH_F55_NINTH_CYCLE_TRUTH_CELL_ACTIVE",
      "PROBE_SOUTH_PRIMARY_ALIAS_PUBLISHED:HEARTH.diagnosticProbeSouth",
      "PROBE_SOUTH_RUN_METHOD_AVAILABLE:runProbeSouth",
      "PROBE_SOUTH_CONFIRMS_SOUTH_PACKET_MEANING_ONLY",
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_DRAW_CANVAS",
      "PROBE_SOUTH_DOES_NOT_RESTART_RUNTIME",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "PROBE_SOUTH_DOES_NOT_CLAIM_VISUAL_PASS",
      southMeaningPreserved
        ? "PROBE_SOUTH_CONFIRMED_SOUTH_PACKET_OUTPUT_MEANING"
        : "PROBE_SOUTH_SOUTH_PACKET_OUTPUT_MEANING_WARNING",
      optionalTenth.observed
        ? `PROBE_SOUTH_OPTIONAL_TENTH_CELL_OBSERVED:${optionalTenth.alias}`
        : "PROBE_SOUTH_OPTIONAL_TENTH_CELL_NOT_OBSERVED_NON_BLOCKING"
    );

    const report = {
      ...shared,

      PROBE_SOUTH_STATUS: probeRunStatus,
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE: FILE,
      PROBE_SOUTH_CARRIER_FILE: FILE,

      PROBE_SOUTH_CHRONOLOGY_ORDER: "9",
      PROBE_SOUTH_FIBONACCI_STAGE: "F55",
      PROBE_SOUTH_GATE: "GATE_9_PROBE_TRUTH",
      PROBE_SOUTH_ROLE: "PHYSICAL_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION",
      PROBE_SOUTH_AUTHORITY: "PROBE_TRUTH_PACKET_MEANING_ONLY",
      PROBE_SOUTH_SOURCE_PATH: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PHYSICAL_FILE_OBSERVED: "true",
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "true",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: "true",
      PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL: "false",
      PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE: "true",

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: probeRunStatus,
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: boolText(southMeaningPreserved, "false"),
      PROBE_SOUTH_MEANING_STATUS: packetMeaningStatus,
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: returnStatus,
      PROBE_SOUTH_CHECKMARK_STATUS: checkmarkStatus,

      SOUTH_GATE_CONFIRMED_BY_PROBE: boolText(southMeaningPreserved, "false"),
      SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE: boolText(southChronologyEntryObserved, "false"),
      SOUTH_RAIL_OBSERVED_BY_PROBE: boolText(southObserved, "false"),
      SOUTH_RAIL_CALL_RETURNED_BY_PROBE: boolText(southCallReturned, "false"),
      SOUTH_RAIL_STATUS_COMPLETE_BY_PROBE: boolText(southStatusComplete, "false"),
      SOUTH_RAIL_CALL_METHOD_BY_PROBE: southCallMethod,
      SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE: firstKnown(southEntry && southEntry.status, "UNKNOWN"),
      SOUTH_RAIL_LOAD_STATUS_BY_PROBE: firstKnown(southEntry && southEntry.loadStatus, "UNKNOWN"),
      SOUTH_RAIL_CONTRACT_BY_PROBE: southEntryContract,
      SOUTH_RAIL_RECEIPT_BY_PROBE: southEntryReceipt,
      SOUTH_RAIL_CONTRACT_RECOGNIZED_BY_PROBE: boolText(southEntryContractRecognized, "false"),
      SOUTH_RAIL_PACKET_OUTPUT_KEYS_PRESENT_BY_PROBE: boolText(southPacketOutputKeysPresent, "false"),

      SOUTH_API_ALIAS_OBSERVED_BY_PROBE: boolText(southApiDiscovery.observed, "false"),
      SOUTH_API_ALIAS_BY_PROBE: southApiDiscovery.alias,
      SOUTH_API_CONTRACT_BY_PROBE: southApiContract,
      SOUTH_API_RECEIPT_BY_PROBE: southApiReceipt,
      SOUTH_API_CONTRACT_RECOGNIZED_BY_PROBE: boolText(southApiContractRecognized, "false"),
      SOUTH_API_METHODS_BY_PROBE: southApiDiscovery.methods.join(",") || "NONE",
      SOUTH_API_REPORT_KEYS_BY_PROBE: Object.keys(southApiReport).join(",") || "NONE",

      SOUTH_ACCEPTED_CONTRACTS_BY_PROBE: ACCEPTED_SOUTH_CONTRACTS.join(" | "),
      SOUTH_PACKET_OUTPUT_AUTHORITY_PRESERVED: "true",
      SOUTH_PROBE_DOES_NOT_REWRITE_SOUTH: "true",
      SOUTH_PROBE_DOES_NOT_ASSUME_CANVAS_FAILURE: "true",

      OPTIONAL_TENTH_CELL_OBSERVED_BY_PROBE: boolText(optionalTenth.observed, "false"),
      OPTIONAL_TENTH_CELL_ALIAS_BY_PROBE: optionalTenth.alias,
      OPTIONAL_TENTH_CELL_CONTRACT_BY_PROBE: optionalTenth.contract,
      OPTIONAL_TENTH_CELL_RECEIPT_BY_PROBE: optionalTenth.receipt,
      OPTIONAL_TENTH_CELL_METHODS_BY_PROBE: optionalTenth.methods,
      OPTIONAL_TENTH_CELL_STATUS_BY_PROBE: optionalTenth.status,
      OPTIONAL_TENTH_CELL_REPORT_KEYS_BY_PROBE: optionalTenth.reportKeys,

      SURFACE_POINTER_BISHOP_BOUNDARY_STATUS_BY_PROBE: optionalTenth.boundaryStatus,
      SURFACE_POINTER_BISHOP_MASS_STATUS_BY_PROBE: optionalTenth.massStatus,
      SURFACE_POINTER_BISHOP_SURFACE_STATUS_BY_PROBE: optionalTenth.surfaceStatus,
      SURFACE_POINTER_BISHOP_LIGHT_STATUS_BY_PROBE: optionalTenth.lightStatus,
      SURFACE_POINTER_BISHOP_HEX_STATUS_BY_PROBE: optionalTenth.hexStatus,
      SURFACE_POINTER_BISHOP_SAMPLE_STATUS_BY_PROBE: optionalTenth.sampleStatus,

      PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_SOUTH_ALIAS_CHRONOLOGY: clonePlain(PRIMARY_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(PRIMARY_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_RAIL_ALIAS: "HEARTH.diagnosticRailProbeSouth",
      PROBE_SOUTH_SOUTH_PROBE_ALIAS: "HEARTH.diagnosticSouthProbe",
      PROBE_SOUTH_GLOBAL_ALIAS: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      PROBE_SOUTH_GLOBAL_RAIL_ALIAS: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      PROBE_SOUTH_LAB_ALIAS: "DEXTER_LAB.hearthDiagnosticProbeSouth",

      PROBE_SOUTH_CALLABLE_METHODS:
        "runProbeSouth | inspectPacketMeaning | inspectPacketComposition | inspectSouthMeaning | runProbe | inspect | runDiagnostic | getReport | getPacketText | getCompactSummary | getState | getReceipt | getReceiptLight",
      PROBE_SOUTH_PRIMARY_CALLABLE_METHOD: "runProbeSouth",
      PROBE_SOUTH_NORTH_V11_COMPATIBLE: "true",
      PROBE_SOUTH_NINE_STEP_CHRONOLOGY_COMPATIBLE: "true",
      PROBE_SOUTH_ASYMMETRIC_TENTH_CELL_COMPATIBLE: "true",
      PROBE_SOUTH_TENTH_CELL_REQUIRED_FOR_NINE_STEP_PASS: "false",

      DIAGNOSTIC_UI_AUTHORITY: "false",
      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORITY: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      ROUTE_CONDUCTOR_IMPLEMENTATION_AUTHORITY: "false",
      CONTROL_IMPLEMENTATION_AUTHORITY: "false",
      TERRAIN_TRUTH_AUTHORITY: "false",
      HYDROLOGY_TRUTH_AUTHORITY: "false",
      MATERIAL_TRUTH_AUTHORITY: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const packetText = composePacketText(report, orderedFields(report));
    const compactSummary = composeCompactSummary(report);

    return {
      ok: true,
      contract: PROBE_SOUTH_CONTRACT,
      CONTRACT: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      RECEIPT: PROBE_SOUTH_RECEIPT,
      implementationContract: PROBE_SOUTH_CONTRACT,
      implementationReceipt: PROBE_SOUTH_RECEIPT,

      PROBE_SOUTH_STATUS: probeRunStatus,
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: probeRunStatus,
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: boolText(southMeaningPreserved, "false"),
      PROBE_SOUTH_MEANING_STATUS: packetMeaningStatus,
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: returnStatus,
      PROBE_SOUTH_CHECKMARK_STATUS: checkmarkStatus,
      PROBE_SOUTH_PHYSICAL_FILE_OBSERVED: "true",

      SOUTH_GATE_CONFIRMED_BY_PROBE: boolText(southMeaningPreserved, "false"),
      SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE: boolText(southChronologyEntryObserved, "false"),
      SOUTH_RAIL_CALL_RETURNED_BY_PROBE: boolText(southCallReturned, "false"),
      OPTIONAL_TENTH_CELL_OBSERVED_BY_PROBE: boolText(optionalTenth.observed, "false"),

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        PROBE_SOUTH_STATUS: probeRunStatus,
        PROBE_SOUTH_CONTRACT,
        PROBE_SOUTH_RECEIPT,
        PROBE_SOUTH_RUN_STATUS: probeRunStatus,
        PROBE_SOUTH_MEANING_STATUS: packetMeaningStatus,
        PROBE_SOUTH_RETURN_TO_NORTH_STATUS: returnStatus,
        SOUTH_GATE_CONFIRMED_BY_PROBE: boolText(southMeaningPreserved, "false"),
        OPTIONAL_TENTH_CELL_OBSERVED_BY_PROBE: boolText(optionalTenth.observed, "false"),
        REPORT_OBJECT: report
      },
      packetText,
      compactSummary,

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
      "PREVIOUS_NORTH_RECEIPT",
      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "NINE_STEP_CHRONOLOGY_ACTIVE",
      "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",

      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_IMPLEMENTATION_CONTRACT",
      "PROBE_SOUTH_IMPLEMENTATION_RECEIPT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_CARRIER_FILE",
      "PROBE_SOUTH_CHRONOLOGY_ORDER",
      "PROBE_SOUTH_FIBONACCI_STAGE",
      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROLE",
      "PROBE_SOUTH_AUTHORITY",
      "PROBE_SOUTH_SOURCE_PATH",
      "PROBE_SOUTH_PHYSICAL_FILE_OBSERVED",
      "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY",
      "PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL",
      "PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE",

      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_PACKET_MEANING_PRESERVED",
      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_RETURN_TO_NORTH_STATUS",
      "PROBE_SOUTH_CHECKMARK_STATUS",

      "SOUTH_GATE_CONFIRMED_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_CALL_RETURNED_BY_PROBE",
      "SOUTH_RAIL_STATUS_COMPLETE_BY_PROBE",
      "SOUTH_RAIL_CALL_METHOD_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE",
      "SOUTH_RAIL_LOAD_STATUS_BY_PROBE",
      "SOUTH_RAIL_CONTRACT_BY_PROBE",
      "SOUTH_RAIL_RECEIPT_BY_PROBE",
      "SOUTH_RAIL_CONTRACT_RECOGNIZED_BY_PROBE",
      "SOUTH_RAIL_PACKET_OUTPUT_KEYS_PRESENT_BY_PROBE",

      "SOUTH_API_ALIAS_OBSERVED_BY_PROBE",
      "SOUTH_API_ALIAS_BY_PROBE",
      "SOUTH_API_CONTRACT_BY_PROBE",
      "SOUTH_API_RECEIPT_BY_PROBE",
      "SOUTH_API_CONTRACT_RECOGNIZED_BY_PROBE",
      "SOUTH_API_METHODS_BY_PROBE",
      "SOUTH_API_REPORT_KEYS_BY_PROBE",

      "OPTIONAL_TENTH_CELL_OBSERVED_BY_PROBE",
      "OPTIONAL_TENTH_CELL_ALIAS_BY_PROBE",
      "OPTIONAL_TENTH_CELL_CONTRACT_BY_PROBE",
      "OPTIONAL_TENTH_CELL_RECEIPT_BY_PROBE",
      "OPTIONAL_TENTH_CELL_STATUS_BY_PROBE",
      "SURFACE_POINTER_BISHOP_BOUNDARY_STATUS_BY_PROBE",
      "SURFACE_POINTER_BISHOP_MASS_STATUS_BY_PROBE",
      "SURFACE_POINTER_BISHOP_SURFACE_STATUS_BY_PROBE",
      "SURFACE_POINTER_BISHOP_LIGHT_STATUS_BY_PROBE",
      "SURFACE_POINTER_BISHOP_HEX_STATUS_BY_PROBE",
      "SURFACE_POINTER_BISHOP_SAMPLE_STATUS_BY_PROBE",

      "PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT",
      "PROBE_SOUTH_PRIMARY_ALIAS",
      "PROBE_SOUTH_CALLABLE_METHODS",
      "PROBE_SOUTH_PRIMARY_CALLABLE_METHOD",
      "PROBE_SOUTH_NORTH_V11_COMPATIBLE",
      "PROBE_SOUTH_NINE_STEP_CHRONOLOGY_COMPATIBLE",
      "PROBE_SOUTH_ASYMMETRIC_TENTH_CELL_COMPATIBLE",
      "PROBE_SOUTH_TENTH_CELL_REQUIRED_FOR_NINE_STEP_PASS",

      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_WEST_FILE",
      "RAIL_SOUTH_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_WEST_FILE",
      "PROBE_CANVAS_SURFACE_TRUTH_FILE",
      "PROBE_SOUTH_FILE",

      "EXPECTED_HTML_CONTRACT",
      "EXPECTED_INDEX_JS_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT",
      "EXPECTED_CONTROL_CONTRACT",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT",
      "EXPECTED_PROBE_SOUTH_CONTRACT",

      "CHRONOLOGY_SEQUENCE_TEXT",
      "CHRONOLOGY_SEQUENCE",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "FINAL_VISUAL_PASS_AUTHORITY",

      "SECONDARY_EVIDENCE_NOTES",
      "PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES",

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

  function composePacketText(report, fields) {
    return (fields || Object.keys(report || {}))
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_CONTRACT", getRaw(report, "PROBE_SOUTH_CONTRACT", PROBE_SOUTH_CONTRACT)),
      line("PROBE_SOUTH_RUN_STATUS", getRaw(report, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_MEANING_STATUS", getRaw(report, "PROBE_SOUTH_MEANING_STATUS", "UNKNOWN")),
      line("SOUTH_GATE_CONFIRMED_BY_PROBE", getRaw(report, "SOUTH_GATE_CONFIRMED_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_CONTRACT_BY_PROBE", getRaw(report, "SOUTH_RAIL_CONTRACT_BY_PROBE", "UNKNOWN")),
      line("OPTIONAL_TENTH_CELL_OBSERVED_BY_PROBE", getRaw(report, "OPTIONAL_TENTH_CELL_OBSERVED_BY_PROBE", "UNKNOWN")),
      line("PROBE_SOUTH_PHYSICAL_FILE_OBSERVED", getRaw(report, "PROBE_SOUTH_PHYSICAL_FILE_OBSERVED", "true"))
    ].join("\n");
  }

  function publishResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    lastReport = report;
    lastPacketText = result && result.packetText
      ? result.packetText
      : composePacketText(report, orderedFields(report));
    lastCompactSummary = result && result.compactSummary
      ? result.compactSummary
      : composeCompactSummary(report);

    lastState = {
      ...buildBaseState(),
      runStatus: getRaw(report, "PROBE_SOUTH_RUN_STATUS", "READY"),
      meaningStatus: getRaw(report, "PROBE_SOUTH_MEANING_STATUS", "READY"),
      southGateConfirmed: truthy(getRaw(report, "SOUTH_GATE_CONFIRMED_BY_PROBE", false)),
      optionalTenthCellObserved: truthy(getRaw(report, "OPTIONAL_TENTH_CELL_OBSERVED_BY_PROBE", false)),
      reportObject: clonePlain(report),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      updatedAt: nowIso()
    };

    publishAliases();
  }

  function runProbeSouth(input = {}) {
    const result = buildProbeSouthReport(input);
    publishResult(result);
    return result;
  }

  function inspectPacketMeaning(input = {}) {
    return runProbeSouth(input);
  }

  function inspectPacketComposition(input = {}) {
    return runProbeSouth(input);
  }

  function inspectSouthMeaning(input = {}) {
    return runProbeSouth(input);
  }

  function runProbe(input = {}) {
    return runProbeSouth(input);
  }

  function inspect(input = {}) {
    return runProbeSouth(input);
  }

  function runDiagnostic(input = {}) {
    return runProbeSouth(input);
  }

  function getReport() {
    if (lastReport) return clonePlain(lastReport);

    const result = buildProbeSouthReport({
      northContract: NORTH_CONTRACT,
      northReceipt: NORTH_RECEIPT,
      currentReport: {},
      chronology: []
    });

    publishResult(result);
    return clonePlain(lastReport);
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    getReport();
    return lastPacketText;
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    getReport();
    return lastCompactSummary;
  }

  function getState() {
    return clonePlain(lastState || buildBaseState());
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_F55_PHYSICAL_PROBE_TRUTH_CELL",
      contract: PROBE_SOUTH_CONTRACT,
      CONTRACT: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      RECEIPT: PROBE_SOUTH_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      chronologyOrder: 9,
      fibonacciStage: "F55",
      sourcePath: "HEARTH.diagnosticProbeSouth",
      physicalFileObserved: true,
      primaryCallableMethod: "runProbeSouth",

      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      inspectSouthMeaningApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(PRIMARY_ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(PRIMARY_ALIAS_CHRONOLOGY),

      diagnosticProbeOnly: true,
      nineStepChronologyCompatible: true,
      asymmetricTenthCellCompatible: true,
      tenthCellRequiredForNineStepPass: false,

      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      canvasDrawingAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE: FILE,
      PROBE_SOUTH_CHRONOLOGY_ORDER: "9",
      PROBE_SOUTH_FIBONACCI_STAGE: "F55",
      PROBE_SOUTH_SOURCE_PATH: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PHYSICAL_FILE_OBSERVED: "true",

      PACKET_NAME,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      NORTH_CONTRACT,
      NORTH_RECEIPT,
      PREVIOUS_NORTH_CONTRACT,
      PREVIOUS_NORTH_RECEIPT,

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_CANVAS_SURFACE_TRUTH_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT: PROBE_SOUTH_CONTRACT,

      acceptedSouthContracts: ACCEPTED_SOUTH_CONTRACTS.slice(),
      reportObject: clonePlain(lastReport || {}),
      state: clonePlain(lastState || buildBaseState()),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;
    root.HEARTH.probeSouthDiagnostic = api;
    root.HEARTH.southProbeDiagnostic = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastReport || {});

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_PACKET_TEXT = lastPacketText || "";
  }

  Object.assign(api, {
    contract: PROBE_SOUTH_CONTRACT,
    CONTRACT: PROBE_SOUTH_CONTRACT,
    receipt: PROBE_SOUTH_RECEIPT,
    RECEIPT: PROBE_SOUTH_RECEIPT,
    implementationContract: PROBE_SOUTH_CONTRACT,
    implementationReceipt: PROBE_SOUTH_RECEIPT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    chronologyOrder: 9,
    fibonacciStage: "F55",
    gate: "GATE_9_PROBE_TRUTH",
    sourcePath: "HEARTH.diagnosticProbeSouth",
    physicalFileObserved: true,
    primaryCallableMethod: "runProbeSouth",

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeCanvasSurfaceTruthFile: PROBE_CANVAS_SURFACE_TRUTH_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedRouteConductorLineageContract: EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedProbeCanvasSurfaceTruthContract: EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
    expectedProbeSouthContract: PROBE_SOUTH_CONTRACT,

    acceptedSouthContracts: ACCEPTED_SOUTH_CONTRACTS,
    southAliasCandidates: SOUTH_ALIAS_CANDIDATES,
    optionalTenthCellAliasCandidates: OPTIONAL_TENTH_CELL_ALIAS_CANDIDATES,

    aliasChronology: PRIMARY_ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(PRIMARY_ALIAS_CHRONOLOGY),

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    inspectSouthMeaning,
    runProbe,
    inspect,
    runDiagnostic,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,

    runProbeSouthApiAvailable: true,
    inspectPacketMeaningApiAvailable: true,
    inspectPacketCompositionApiAvailable: true,
    inspectSouthMeaningApiAvailable: true,
    runProbeApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    diagnosticProbeOnly: true,
    packetMeaningAuthorityOnly: true,
    nineStepChronologyCompatible: true,
    asymmetricTenthCellCompatible: true,
    tenthCellRequiredForNineStepPass: false,

    diagnosticUiAuthority: false,
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    routeConductorImplementationAuthority: false,
    controlImplementationAuthority: false,
    terrainTruthAuthority: false,
    hydrologyTruthAuthority: false,
    materialTruthAuthority: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  lastState = buildBaseState();
  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
