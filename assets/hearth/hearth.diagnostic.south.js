// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10
// Full-file replacement.
// Diagnostic rail SOUTH / F34 / Step 8 pair-side packet-output carrier only.
// Purpose:
// - Preserve SOUTH as Step 8 / F34 packet-output authority.
// - Preserve composeSouthReport(...) as the primary South callable surface.
// - Preserve North packet meaning without reinterpreting or repairing it.
// - Publish a clean handoff envelope to the physical Probe South file.
// - Keep Probe South truth inspection in /assets/hearth/hearth.diagnostic.probe.south.js.
// - Allow the probe file to use an auxiliary tenth file without making that file a nine-step chronology member.
// - Preserve the nine-step diagnostic chronology as North-owned.
// - Preserve asymmetry: South outputs the envelope; Probe South owns the truth read.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no final visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - diagnostic North chronology
// - diagnostic East source evidence
// - diagnostic West rendered evidence
// - Probe South truth inspection
// - auxiliary tenth file inspection
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - terrain/material/hydrology truth
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_TNT_v10";
  const SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_RECEIPT_v10";

  const SOUTH_PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_TNT_v9";
  const SOUTH_PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_RECEIPT_v9";

  const SOUTH_LINEAGE_V8_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8";
  const SOUTH_LINEAGE_V8_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v8";

  const SOUTH_LINEAGE_V7_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const SOUTH_BASELINE_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const SOUTH_BASELINE_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  const PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const PROBE_SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";

  const VERSION =
    "2026-06-06.hearth-diagnostic-south-pair-side-f34-step8-handoff-v10";

  const SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v2";

  const NORTH_CURRENT_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const NORTH_CURRENT_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";

  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const LINEAGE_V9_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const LINEAGE_V8_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const LINEAGE_V7_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_TNT_v7";
  const BASELINE_V6_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_BISHOP_QUEEN_ACCEPTANCE_SCHEMA_ORCHESTRATOR_TNT_v6";
  const FOUNDATION_V5_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_TNT_v5";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = SOUTH_FILE;

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_CANVAS_SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";

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

  const EXPECTED_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const EXPECTED_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";
  const EXPECTED_SOUTH_CONTRACT = SOUTH_CONTRACT;

  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT = PROBE_SOUTH_CONTRACT;

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedBySouth: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    readyTextClaimedBySouth: false,
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
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_CLAIMED_BY_SOUTH: false,
    F21_SUBMITTED_TO_NORTH: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_CLAIMED_BY_SOUTH: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const SOUTH_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      step: "STEP_8",
      fibonacciStage: "F34",
      alias: "HEARTH.diagnosticSouth",
      layer: "HEARTH",
      intent: "south-operational-primary",
      authority: "packet-output-carrier"
    }),
    Object.freeze({
      order: 2,
      step: "STEP_8",
      fibonacciStage: "F34",
      alias: "HEARTH.diagnosticRailSouth",
      layer: "HEARTH",
      intent: "south-rail-explicit",
      authority: "packet-output-carrier"
    }),
    Object.freeze({
      order: 3,
      step: "STEP_8",
      fibonacciStage: "F34",
      alias: "HEARTH_DIAGNOSTIC_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-south",
      authority: "packet-output-carrier"
    }),
    Object.freeze({
      order: 4,
      step: "STEP_8",
      fibonacciStage: "F34",
      alias: "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-south",
      authority: "packet-output-carrier"
    }),
    Object.freeze({
      order: 5,
      step: "STEP_8",
      fibonacciStage: "F34",
      alias: "DEXTER_LAB.hearthDiagnosticSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south",
      authority: "packet-output-carrier"
    }),
    Object.freeze({
      order: 6,
      step: "STEP_8",
      fibonacciStage: "F34",
      alias: "DEXTER_LAB.hearthDiagnosticRailSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-south",
      authority: "packet-output-carrier"
    })
  ]);

  const HANDOFF_SEQUENCE = Object.freeze([
    Object.freeze({
      order: 8,
      id: "RAIL_SOUTH",
      fibonacciStage: "F34",
      file: SOUTH_FILE,
      owner: "DIAGNOSTIC_RAIL_SOUTH",
      role: "packet-output-carrier",
      contract: SOUTH_CONTRACT,
      ownsTruthInspection: false
    }),
    Object.freeze({
      order: 9,
      id: "PROBE_SOUTH",
      fibonacciStage: "F55",
      file: PROBE_SOUTH_FILE,
      owner: "DIAGNOSTIC_PROBE_SOUTH",
      role: "packet-meaning-and-downstream-truth-read",
      contract: PROBE_SOUTH_CONTRACT,
      ownsTruthInspection: true
    }),
    Object.freeze({
      order: 10,
      id: "AUXILIARY_TENTH_FILE",
      fibonacciStage: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      file: "DECLARED_BY_PROBE_SOUTH",
      owner: "DIAGNOSTIC_PROBE_SOUTH_AUXILIARY_READ",
      role: "optional-deep-read-instrument",
      contract: "DECLARED_BY_PROBE_SOUTH",
      ownsTruthInspection: false,
      chronologyMember: false
    })
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const southApi = {};

  let lastSouthState = null;
  let lastSouthReport = null;
  let lastSouthPacketText = "";
  let lastSouthCompactSummary = "";

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
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

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value
        .map((entry) => {
          if (isObject(entry)) {
            try {
              return JSON.stringify(entry);
            } catch (_error) {
              return bounded(entry, 1200);
            }
          }
          return bounded(entry, 1200);
        })
        .filter(Boolean)
        .join(" | ");

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

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
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

  function aliasChronologyText(list) {
    return (list || [])
      .map((entry) => {
        return [
          `${entry.order}.${entry.alias}`,
          `step:${entry.step}`,
          `fib:${entry.fibonacciStage}`,
          `layer:${entry.layer}`,
          `intent:${entry.intent}`,
          `authority:${entry.authority}`
        ].join(" ");
      })
      .join(" | ");
  }

  function handoffSequenceText(list) {
    return (list || [])
      .map((entry) => {
        return [
          `${entry.order}.${entry.id}`,
          `fib:${entry.fibonacciStage}`,
          `file:${entry.file}`,
          `owner:${entry.owner}`,
          `role:${entry.role}`,
          `truth:${entry.ownsTruthInspection}`,
          `chronologyMember:${entry.chronologyMember !== false}`
        ].join(" ");
      })
      .join(" | ");
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology
      .map((entry) => {
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
    if (Array.isArray(input && input.CHRONOLOGY_SEQUENCE)) return clonePlain(input.CHRONOLOGY_SEQUENCE);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) {
      return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    }
    if (Array.isArray(currentReport && currentReport.chronology)) return clonePlain(currentReport.chronology);
    return [];
  }

  function baseSouthState() {
    return {
      role: "DIAGNOSTIC_RAIL_SOUTH_F34_STEP8_PAIR_SIDE_PACKET_OUTPUT_HANDOFF",
      contract: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      previousContract: SOUTH_PREVIOUS_CONTRACT,
      previousReceipt: SOUTH_PREVIOUS_RECEIPT,
      lineageV8Contract: SOUTH_LINEAGE_V8_CONTRACT,
      lineageV8Receipt: SOUTH_LINEAGE_V8_RECEIPT,
      lineageV7Contract: SOUTH_LINEAGE_V7_CONTRACT,
      baselineContract: SOUTH_BASELINE_CONTRACT,
      baselineReceipt: SOUTH_BASELINE_RECEIPT,
      version: VERSION,
      file: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      chronologyStep: 8,
      fibonacciStage: "F34",
      southPairSide: true,
      southOutputAuthority: "PACKET_OUTPUT_ONLY",
      probeSouthPhysicalFileExpected: true,
      probeSouthFile: PROBE_SOUTH_FILE,
      probeSouthContract: PROBE_SOUTH_CONTRACT,
      southEmbedsProbeTruth: false,
      southPublishesProbeSouthAlias: false,
      southMutatesProbeSouth: false,

      nineStepChronologyPreserved: true,
      auxiliaryTenthFileAllowed: true,
      auxiliaryTenthFileChronologyMember: false,
      auxiliaryTenthFileOwnedBySouth: false,
      auxiliaryTenthFileDeclaredByProbeSouth: true,

      handoffSequence: clonePlain(HANDOFF_SEQUENCE),
      aliasChronology: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      outputStatus: "READY",
      handoffStatus: "READY",
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function buildSharedFields(input, currentReport, chronology) {
    return {
      PACKET_NAME: firstKnown(currentReport.PACKET_NAME, input.PACKET_NAME, PACKET_NAME),
      TARGET_ROUTE: firstKnown(currentReport.TARGET_ROUTE, input.TARGET_ROUTE, TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: firstKnown(currentReport.DIAGNOSTIC_ROUTE, input.DIAGNOSTIC_ROUTE, DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: firstKnown(
        currentReport.DIAGNOSTIC_TIMESTAMP,
        input.DIAGNOSTIC_TIMESTAMP,
        input.diagnosticTimestamp,
        nowIso()
      ),

      NORTH_CONTRACT: firstKnown(
        input.northContract,
        currentReport.NORTH_CONTRACT,
        NORTH_CURRENT_CONTRACT
      ),
      NORTH_RECEIPT: firstKnown(
        input.northReceipt,
        currentReport.NORTH_RECEIPT,
        NORTH_CURRENT_RECEIPT
      ),
      PREVIOUS_NORTH_CONTRACT: firstKnown(
        currentReport.PREVIOUS_NORTH_CONTRACT,
        input.previousNorthContract,
        PREVIOUS_NORTH_CONTRACT
      ),
      PREVIOUS_NORTH_RECEIPT: firstKnown(
        currentReport.PREVIOUS_NORTH_RECEIPT,
        PREVIOUS_NORTH_RECEIPT
      ),
      LINEAGE_V9_NORTH_CONTRACT: firstKnown(
        currentReport.LINEAGE_V9_NORTH_CONTRACT,
        LINEAGE_V9_NORTH_CONTRACT
      ),
      LINEAGE_V8_NORTH_CONTRACT: firstKnown(
        currentReport.LINEAGE_V8_NORTH_CONTRACT,
        LINEAGE_V8_NORTH_CONTRACT
      ),
      LINEAGE_V7_NORTH_CONTRACT: firstKnown(
        currentReport.LINEAGE_V7_NORTH_CONTRACT,
        LINEAGE_V7_NORTH_CONTRACT
      ),
      BASELINE_V6_NORTH_CONTRACT: firstKnown(
        currentReport.BASELINE_V6_NORTH_CONTRACT,
        BASELINE_V6_NORTH_CONTRACT
      ),
      FOUNDATION_V5_NORTH_CONTRACT: firstKnown(
        currentReport.FOUNDATION_V5_NORTH_CONTRACT,
        FOUNDATION_V5_NORTH_CONTRACT
      ),

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(
        getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", input.chronologyHubActive),
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

      EXPECTED_HTML_CONTRACT: firstKnown(
        currentReport.EXPECTED_HTML_CONTRACT,
        EXPECTED_HTML_CONTRACT
      ),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(
        currentReport.EXPECTED_INDEX_JS_CONTRACT,
        EXPECTED_INDEX_JS_CONTRACT
      ),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(
        currentReport.EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        EXPECTED_ROUTE_CONDUCTOR_CONTRACT
      ),
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT: firstKnown(
        currentReport.EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
        EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT
      ),
      EXPECTED_CONTROL_CONTRACT: firstKnown(
        currentReport.EXPECTED_CONTROL_CONTRACT,
        EXPECTED_CONTROL_CONTRACT
      ),
      EXPECTED_CANVAS_CONTRACT: firstKnown(
        currentReport.EXPECTED_CANVAS_CONTRACT,
        EXPECTED_CANVAS_CONTRACT
      ),
      EXPECTED_EAST_CONTRACT: firstKnown(
        currentReport.EXPECTED_EAST_CONTRACT,
        EXPECTED_EAST_CONTRACT
      ),
      EXPECTED_WEST_CONTRACT: firstKnown(
        currentReport.EXPECTED_WEST_CONTRACT,
        EXPECTED_WEST_CONTRACT
      ),
      EXPECTED_SOUTH_CONTRACT: firstKnown(
        currentReport.EXPECTED_SOUTH_CONTRACT,
        EXPECTED_SOUTH_CONTRACT
      ),
      EXPECTED_PROBE_NORTH_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_NORTH_CONTRACT,
        EXPECTED_PROBE_NORTH_CONTRACT
      ),
      EXPECTED_PROBE_EAST_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_EAST_CONTRACT,
        EXPECTED_PROBE_EAST_CONTRACT
      ),
      EXPECTED_PROBE_WEST_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_WEST_CONTRACT,
        EXPECTED_PROBE_WEST_CONTRACT
      ),
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
        EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT
      ),
      EXPECTED_PROBE_SOUTH_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_SOUTH_CONTRACT,
        EXPECTED_PROBE_SOUTH_CONTRACT
      ),

      CHRONOLOGY_SEQUENCE: chronology,
      CHRONOLOGY_SEQUENCE_JSON: chronology,
      CHRONOLOGY_SEQUENCE_TEXT: firstKnown(
        currentReport.CHRONOLOGY_SEQUENCE_TEXT,
        chronologyText(chronology)
      )
    };
  }

  function buildSouthReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);
    const shared = buildSharedFields(input, currentReport, chronology);

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "SOUTH_V10_PAIR_SIDE_PACKET_OUTPUT_HANDOFF_ACTIVE",
      "SOUTH_F34_STEP8_AUTHORITY_PRESERVED",
      "SOUTH_OUTPUTS_PACKET_AND_HANDOFF_ENVELOPE_ONLY",
      "SOUTH_DOES_NOT_EMBED_PROBE_SOUTH_TRUTH_READ",
      "PHYSICAL_PROBE_SOUTH_FILE_REMAINS_STEP9_F55_TRUTH_CELL",
      "AUXILIARY_TENTH_FILE_ALLOWED_ONLY_AS_PROBE_SOUTH_READ_INSTRUMENT",
      "AUXILIARY_TENTH_FILE_NOT_A_NINE_STEP_CHRONOLOGY_MEMBER",
      "NINE_STEP_CHRONOLOGY_PRESERVED",
      "SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "SOUTH_DOES_NOT_DRAW_CANVAS",
      "SOUTH_DOES_NOT_RESTART_RUNTIME",
      "SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "SOUTH_DOES_NOT_CLAIM_READY_OR_VISUAL_PASS"
    );

    const report = {
      ...currentReport,
      ...shared,

      SOUTH_STATUS: "COMPLETE",
      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: SOUTH_CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: SOUTH_RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: SOUTH_PREVIOUS_CONTRACT,
      SOUTH_PREVIOUS_IMPLEMENTATION_RECEIPT: SOUTH_PREVIOUS_RECEIPT,
      SOUTH_LINEAGE_V8_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V8_CONTRACT,
      SOUTH_LINEAGE_V8_IMPLEMENTATION_RECEIPT: SOUTH_LINEAGE_V8_RECEIPT,
      SOUTH_LINEAGE_V7_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V7_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: SOUTH_BASELINE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_RECEIPT: SOUTH_BASELINE_RECEIPT,
      SOUTH_VERSION: VERSION,
      SOUTH_FILE,

      SOUTH_CHRONOLOGY_STEP: "8",
      SOUTH_FIBONACCI_STAGE: "F34",
      SOUTH_PAIR_SIDE: "true",
      SOUTH_OUTPUT_COMPLETE: "true",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_OUTPUT_VALID: "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: "true",
      SOUTH_MEANING_PRESERVED: "true",
      SOUTH_PACKET_OUTPUT_AUTHORITY: "PACKET_OUTPUT_ONLY",
      SOUTH_TRUTH_INSPECTION_AUTHORITY: "false",
      SOUTH_CANVAS_DRAWING_AUTHORITY: "false",
      SOUTH_PRODUCTION_MUTATION_AUTHORITY: "false",

      SOUTH_HANDOFF_STATUS: "PROBE_SOUTH_PHYSICAL_FILE_HANDOFF_READY",
      SOUTH_HANDOFF_SEQUENCE: clonePlain(HANDOFF_SEQUENCE),
      SOUTH_HANDOFF_SEQUENCE_TEXT: handoffSequenceText(HANDOFF_SEQUENCE),
      SOUTH_HANDOFF_TO_PROBE_SOUTH_FILE: PROBE_SOUTH_FILE,
      SOUTH_HANDOFF_TO_PROBE_SOUTH_CONTRACT: PROBE_SOUTH_CONTRACT,
      SOUTH_HANDOFF_TO_PROBE_SOUTH_RECEIPT: PROBE_SOUTH_RECEIPT,
      SOUTH_HANDOFF_REQUIRES_PHYSICAL_PROBE_SOUTH_FILE: "true",

      PROBE_SOUTH_GATE: "STEP_9",
      PROBE_SOUTH_FIBONACCI_STAGE: "F55",
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_EXPECTED_CONTRACT: PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_EXPECTED_RECEIPT: PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_TRUTH_READ_OWNER: "DIAGNOSTIC_PROBE_SOUTH",
      PROBE_SOUTH_TRUTH_READ_OWNED_BY_SOUTH: "false",
      PROBE_SOUTH_ALIAS_PUBLISHED_BY_SOUTH: "false",
      PROBE_SOUTH_EMBEDDED_IN_SOUTH: "false",
      PROBE_SOUTH_MUTATED_BY_SOUTH: "false",

      BISHOP_SURFACE_POINTER_READ_OWNER: "DIAGNOSTIC_PROBE_SOUTH",
      BISHOP_SURFACE_POINTER_READ_OWNED_BY_SOUTH: "false",
      BISHOP_SURFACE_POINTER_READ_ALLOWED_IN_SOUTH: "false",
      SURFACE_FINGER_TRUTH_READ_OWNER: "DIAGNOSTIC_PROBE_SOUTH",
      SURFACE_FINGER_TRUTH_READ_OWNED_BY_SOUTH: "false",
      HEX_SURFACE_BRIDGE_READ_OWNER: "DIAGNOSTIC_PROBE_SOUTH",
      HEX_SURFACE_BRIDGE_READ_OWNED_BY_SOUTH: "false",
      INSPECT_FILE_READ_OWNER: "DIAGNOSTIC_PROBE_SOUTH",
      INSPECT_FILE_READ_OWNED_BY_SOUTH: "false",

      AUXILIARY_TENTH_FILE_POLICY: "ALLOWED_AS_PROBE_SOUTH_AUXILIARY_READ_ONLY",
      AUXILIARY_TENTH_FILE_STATUS: "DECLARED_BY_PROBE_SOUTH_NOT_BY_SOUTH",
      AUXILIARY_TENTH_FILE_CHRONOLOGY_MEMBER: "false",
      AUXILIARY_TENTH_FILE_OWNED_BY_SOUTH: "false",
      AUXILIARY_TENTH_FILE_READ_BY_PROBE_SOUTH: "true",
      AUXILIARY_TENTH_FILE_MUTATES_NINE_CYCLE: "false",
      AUXILIARY_TENTH_FILE_REPLACES_PROBE_SOUTH: "false",

      NINE_STEP_CHRONOLOGY_PRESERVED: "true",
      SOUTH_DOES_NOT_EXTEND_CHRONOLOGY: "true",
      SOUTH_DOES_NOT_RENUMBER_PROBE_SOUTH: "true",
      SOUTH_DOES_NOT_PROMOTE_TENTH_FILE_TO_STEP9: "true",

      SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      SOUTH_ALIAS_CHRONOLOGY: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),
      SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticSouth",
      SOUTH_RAIL_ALIAS: "HEARTH.diagnosticRailSouth",
      SOUTH_GLOBAL_ALIAS: "HEARTH_DIAGNOSTIC_SOUTH",
      SOUTH_GLOBAL_RAIL_ALIAS: "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      SOUTH_LAB_ALIAS: "DEXTER_LAB.hearthDiagnosticSouth",
      SOUTH_LAB_RAIL_ALIAS: "DEXTER_LAB.hearthDiagnosticRailSouth",

      SOUTH_CALLABLE_METHODS:
        "composeSouthReport | runSouth | composeReport | inspect | runDiagnostic",
      SOUTH_PRIMARY_CALLABLE_METHOD: "composeSouthReport",
      SOUTH_CHRONOLOGY_STANDARD_COMPATIBLE: "true",
      SOUTH_NORTH_V11_COMPATIBLE: "true",
      SOUTH_NORTH_V10_COMPATIBLE: "true",

      DIAGNOSTIC_UI_AUTHORITY: "false",
      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      MACRO_WEST_RELEASE_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORITY: "false",
      ROUTE_CONDUCTOR_IMPLEMENTATION_AUTHORITY: "false",
      CONTROL_IMPLEMENTATION_AUTHORITY: "false",
      TERRAIN_TRUTH_AUTHORITY: "false",
      HYDROLOGY_TRUTH_AUTHORITY: "false",
      MATERIAL_TRUTH_AUTHORITY: "false",
      ELEVATION_TRUTH_AUTHORITY: "false",
      MOUNTAIN_TRUTH_AUTHORITY: "false",
      BIOME_TRUTH_AUTHORITY: "false",
      ATMOSPHERE_TRUTH_AUTHORITY: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      NORTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      SOUTH_SECONDARY_OUTPUT_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const packetText = composePacketText(report, orderedSouthFields(report));
    const compactSummary = composeSouthCompactSummary(report);

    return {
      ok: true,
      contract: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      implementationContract: SOUTH_CONTRACT,
      implementationReceipt: SOUTH_RECEIPT,
      previousImplementationContract: SOUTH_PREVIOUS_CONTRACT,
      lineageV8ImplementationContract: SOUTH_LINEAGE_V8_CONTRACT,
      baselineImplementationContract: SOUTH_BASELINE_CONTRACT,

      SOUTH_STATUS: "COMPLETE",
      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_OUTPUT_COMPLETE: "true",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_OUTPUT_VALID: "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: "true",
      SOUTH_MEANING_PRESERVED: "true",
      SOUTH_HANDOFF_STATUS: "PROBE_SOUTH_PHYSICAL_FILE_HANDOFF_READY",
      SOUTH_PAIR_SIDE: "true",

      PROBE_SOUTH_FILE,
      PROBE_SOUTH_EXPECTED_CONTRACT: PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_TRUTH_READ_OWNER: "DIAGNOSTIC_PROBE_SOUTH",
      PROBE_SOUTH_EMBEDDED_IN_SOUTH: "false",

      AUXILIARY_TENTH_FILE_POLICY: "ALLOWED_AS_PROBE_SOUTH_AUXILIARY_READ_ONLY",
      AUXILIARY_TENTH_FILE_CHRONOLOGY_MEMBER: "false",
      NINE_STEP_CHRONOLOGY_PRESERVED: "true",

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        SOUTH_STATUS: "COMPLETE",
        SOUTH_CONTRACT,
        SOUTH_RECEIPT,
        SOUTH_OUTPUT_STATUS: "COMPLETE",
        SOUTH_HANDOFF_STATUS: "PROBE_SOUTH_PHYSICAL_FILE_HANDOFF_READY",
        SOUTH_MEANING_PRESERVED: "true",
        PROBE_SOUTH_FILE,
        REPORT_OBJECT: report
      },
      packetText,
      compactSummary,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedSouthFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "PREVIOUS_NORTH_RECEIPT",
      "LINEAGE_V9_NORTH_CONTRACT",
      "LINEAGE_V8_NORTH_CONTRACT",
      "LINEAGE_V7_NORTH_CONTRACT",
      "BASELINE_V6_NORTH_CONTRACT",
      "FOUNDATION_V5_NORTH_CONTRACT",

      "SOUTH_STATUS",
      "SOUTH_CONTRACT",
      "SOUTH_RECEIPT",
      "SOUTH_IMPLEMENTATION_CONTRACT",
      "SOUTH_IMPLEMENTATION_RECEIPT",
      "SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT",
      "SOUTH_PREVIOUS_IMPLEMENTATION_RECEIPT",
      "SOUTH_LINEAGE_V8_IMPLEMENTATION_CONTRACT",
      "SOUTH_LINEAGE_V8_IMPLEMENTATION_RECEIPT",
      "SOUTH_VERSION",
      "SOUTH_FILE",
      "SOUTH_CHRONOLOGY_STEP",
      "SOUTH_FIBONACCI_STAGE",
      "SOUTH_PAIR_SIDE",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_MEANING_PRESERVED",
      "SOUTH_PACKET_OUTPUT_AUTHORITY",
      "SOUTH_TRUTH_INSPECTION_AUTHORITY",

      "SOUTH_HANDOFF_STATUS",
      "SOUTH_HANDOFF_SEQUENCE_TEXT",
      "SOUTH_HANDOFF_TO_PROBE_SOUTH_FILE",
      "SOUTH_HANDOFF_TO_PROBE_SOUTH_CONTRACT",
      "SOUTH_HANDOFF_REQUIRES_PHYSICAL_PROBE_SOUTH_FILE",

      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_FIBONACCI_STAGE",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_EXPECTED_CONTRACT",
      "PROBE_SOUTH_EXPECTED_RECEIPT",
      "PROBE_SOUTH_TRUTH_READ_OWNER",
      "PROBE_SOUTH_TRUTH_READ_OWNED_BY_SOUTH",
      "PROBE_SOUTH_ALIAS_PUBLISHED_BY_SOUTH",
      "PROBE_SOUTH_EMBEDDED_IN_SOUTH",
      "PROBE_SOUTH_MUTATED_BY_SOUTH",

      "BISHOP_SURFACE_POINTER_READ_OWNER",
      "BISHOP_SURFACE_POINTER_READ_OWNED_BY_SOUTH",
      "SURFACE_FINGER_TRUTH_READ_OWNER",
      "SURFACE_FINGER_TRUTH_READ_OWNED_BY_SOUTH",
      "HEX_SURFACE_BRIDGE_READ_OWNER",
      "HEX_SURFACE_BRIDGE_READ_OWNED_BY_SOUTH",
      "INSPECT_FILE_READ_OWNER",
      "INSPECT_FILE_READ_OWNED_BY_SOUTH",

      "AUXILIARY_TENTH_FILE_POLICY",
      "AUXILIARY_TENTH_FILE_STATUS",
      "AUXILIARY_TENTH_FILE_CHRONOLOGY_MEMBER",
      "AUXILIARY_TENTH_FILE_OWNED_BY_SOUTH",
      "AUXILIARY_TENTH_FILE_READ_BY_PROBE_SOUTH",
      "AUXILIARY_TENTH_FILE_MUTATES_NINE_CYCLE",
      "AUXILIARY_TENTH_FILE_REPLACES_PROBE_SOUTH",

      "NINE_STEP_CHRONOLOGY_PRESERVED",
      "SOUTH_DOES_NOT_EXTEND_CHRONOLOGY",
      "SOUTH_DOES_NOT_RENUMBER_PROBE_SOUTH",
      "SOUTH_DOES_NOT_PROMOTE_TENTH_FILE_TO_STEP9",

      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "NINE_STEP_CHRONOLOGY_ACTIVE",
      "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",

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
      "EXPECTED_EAST_CONTRACT",
      "EXPECTED_WEST_CONTRACT",
      "EXPECTED_SOUTH_CONTRACT",
      "EXPECTED_PROBE_NORTH_CONTRACT",
      "EXPECTED_PROBE_EAST_CONTRACT",
      "EXPECTED_PROBE_WEST_CONTRACT",
      "EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT",
      "EXPECTED_PROBE_SOUTH_CONTRACT",

      "CHRONOLOGY_SEQUENCE",
      "CHRONOLOGY_SEQUENCE_JSON",
      "CHRONOLOGY_SEQUENCE_TEXT",

      "CHRONOLOGY_COMPLETION_STATUS",
      "FIRST_CHRONOLOGY_FAILURE_OWNER",
      "FIRST_CHRONOLOGY_FAILURE_FILE",
      "FIRST_CHRONOLOGY_FAILURE_CLASS",
      "FIRST_CHRONOLOGY_FAILURE_REASON",
      "ZONE_OF_INFLICTION_OWNER",
      "ZONE_OF_INFLICTION_FILE",
      "ZONE_OF_INFLICTION_CLASS",
      "ZONE_OF_INFLICTION_REASON",

      "SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "SOUTH_ALIAS_CHRONOLOGY_TEXT",
      "SOUTH_PRIMARY_CALLABLE_METHOD",
      "SOUTH_CALLABLE_METHODS",

      "DIAGNOSTIC_UI_AUTHORITY",
      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORITY",
      "FINAL_VISUAL_PASS_AUTHORITY",

      "SECONDARY_EVIDENCE_NOTES",
      "NORTH_SECONDARY_EVIDENCE_NOTES",
      "SOUTH_SECONDARY_OUTPUT_NOTES",

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

  function composeSouthCompactSummary(report) {
    return [
      line("SOUTH_CONTRACT", getRaw(report, "SOUTH_CONTRACT", SOUTH_CONTRACT)),
      line("SOUTH_OUTPUT_STATUS", getRaw(report, "SOUTH_OUTPUT_STATUS", "UNKNOWN")),
      line("SOUTH_MEANING_PRESERVED", getRaw(report, "SOUTH_MEANING_PRESERVED", "UNKNOWN")),
      line("SOUTH_HANDOFF_STATUS", getRaw(report, "SOUTH_HANDOFF_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_FILE", getRaw(report, "PROBE_SOUTH_FILE", PROBE_SOUTH_FILE)),
      line("PROBE_SOUTH_EMBEDDED_IN_SOUTH", getRaw(report, "PROBE_SOUTH_EMBEDDED_IN_SOUTH", "false")),
      line("AUXILIARY_TENTH_FILE_CHRONOLOGY_MEMBER", getRaw(report, "AUXILIARY_TENTH_FILE_CHRONOLOGY_MEMBER", "false")),
      line("NINE_STEP_CHRONOLOGY_PRESERVED", getRaw(report, "NINE_STEP_CHRONOLOGY_PRESERVED", "true"))
    ].join("\n");
  }

  function publishSouthResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    lastSouthReport = report;
    lastSouthPacketText =
      result && result.packetText
        ? result.packetText
        : composePacketText(report, orderedSouthFields(report));
    lastSouthCompactSummary =
      result && result.compactSummary
        ? result.compactSummary
        : composeSouthCompactSummary(report);

    lastSouthState = {
      ...baseSouthState(),
      outputStatus: "COMPLETE",
      handoffStatus: "PROBE_SOUTH_PHYSICAL_FILE_HANDOFF_READY",
      reportObject: clonePlain(report),
      packetText: lastSouthPacketText,
      compactSummary: lastSouthCompactSummary,
      updatedAt: nowIso()
    };

    publishAllAliases();
  }

  function composeSouthReport(input = {}) {
    const result = buildSouthReport(input);
    publishSouthResult(result);
    return result;
  }

  function runSouth(input = {}) {
    return composeSouthReport(input);
  }

  function composeReport(input = {}) {
    return composeSouthReport(input);
  }

  function inspect(input = {}) {
    return composeSouthReport(input);
  }

  function runDiagnostic(input = {}) {
    return composeSouthReport(input);
  }

  function getReport() {
    if (lastSouthReport) return clonePlain(lastSouthReport);

    const result = buildSouthReport({
      northContract: NORTH_CURRENT_CONTRACT,
      northReceipt: NORTH_CURRENT_RECEIPT,
      chronologyHubActive: true,
      currentReport: {}
    });

    publishSouthResult(result);
    return clonePlain(lastSouthReport);
  }

  function getPacketText() {
    if (lastSouthPacketText) return lastSouthPacketText;
    getReport();
    return lastSouthPacketText;
  }

  function getCompactSummary() {
    if (lastSouthCompactSummary) return lastSouthCompactSummary;
    getReport();
    return lastSouthCompactSummary;
  }

  function getState() {
    return clonePlain(lastSouthState || baseSouthState());
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_RAIL_SOUTH_F34_STEP8_PAIR_SIDE_PACKET_OUTPUT_HANDOFF",
      contract: SOUTH_CONTRACT,
      CONTRACT: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      RECEIPT: SOUTH_RECEIPT,
      previousContract: SOUTH_PREVIOUS_CONTRACT,
      previousReceipt: SOUTH_PREVIOUS_RECEIPT,
      lineageV8Contract: SOUTH_LINEAGE_V8_CONTRACT,
      lineageV8Receipt: SOUTH_LINEAGE_V8_RECEIPT,
      lineageV7Contract: SOUTH_LINEAGE_V7_CONTRACT,
      baselineContract: SOUTH_BASELINE_CONTRACT,
      baselineReceipt: SOUTH_BASELINE_RECEIPT,
      version: VERSION,
      file: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      chronologyStep: 8,
      fibonacciStage: "F34",
      southPairSide: true,
      packetOutputAuthority: true,
      truthInspectionAuthority: false,
      canvasDrawingAuthority: false,
      productionMutationAuthority: false,

      probeSouthPhysicalFileExpected: true,
      probeSouthFile: PROBE_SOUTH_FILE,
      probeSouthContract: PROBE_SOUTH_CONTRACT,
      probeSouthReceipt: PROBE_SOUTH_RECEIPT,
      probeSouthEmbeddedInSouth: false,
      probeSouthAliasPublishedBySouth: false,
      probeSouthMutatedBySouth: false,

      auxiliaryTenthFileAllowed: true,
      auxiliaryTenthFileChronologyMember: false,
      auxiliaryTenthFileOwnedBySouth: false,
      auxiliaryTenthFileDeclaredByProbeSouth: true,
      nineStepChronologyPreserved: true,

      primaryCallableMethod: "composeSouthReport",
      composeSouthReportApiAvailable: true,
      runSouthApiAvailable: true,
      composeReportApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      handoffSequence: clonePlain(HANDOFF_SEQUENCE),
      handoffSequenceText: handoffSequenceText(HANDOFF_SEQUENCE),
      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),

      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      routeConductorImplementationAuthority: false,
      controlImplementationAuthority: false,
      terrainTruthAuthority: false,
      hydrologyTruthAuthority: false,
      materialTruthAuthority: false,
      elevationTruthAuthority: false,
      mountainTruthAuthority: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: SOUTH_CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: SOUTH_RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: SOUTH_PREVIOUS_CONTRACT,
      SOUTH_PREVIOUS_IMPLEMENTATION_RECEIPT: SOUTH_PREVIOUS_RECEIPT,
      SOUTH_LINEAGE_V8_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V8_CONTRACT,
      SOUTH_LINEAGE_V8_IMPLEMENTATION_RECEIPT: SOUTH_LINEAGE_V8_RECEIPT,
      SOUTH_LINEAGE_V7_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V7_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: SOUTH_BASELINE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_RECEIPT: SOUTH_BASELINE_RECEIPT,

      PACKET_NAME,
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
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      reportObject: clonePlain(lastSouthReport || {}),
      state: clonePlain(lastSouthState || baseSouthState()),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAllAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticSouth = southApi;
    root.HEARTH.diagnosticRailSouth = southApi;
    root.HEARTH.diagnosticSouthRail = southApi;
    root.HEARTH.southDiagnosticRail = southApi;
    root.HEARTH.southDiagnostic = southApi;
    root.HEARTH.diagnosticSouthPairSide = southApi;
    root.HEARTH.diagnosticSouthHandoff = southApi;

    root.HEARTH_DIAGNOSTIC_SOUTH = southApi;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = southApi;
    root.HEARTH_DIAGNOSTIC_SOUTH_RAIL = southApi;
    root.HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE = southApi;
    root.HEARTH_DIAGNOSTIC_SOUTH_HANDOFF = southApi;

    root.DEXTER_LAB.hearthDiagnosticSouth = southApi;
    root.DEXTER_LAB.hearthDiagnosticRailSouth = southApi;
    root.DEXTER_LAB.hearthDiagnosticSouthRail = southApi;
    root.DEXTER_LAB.hearthSouthDiagnosticRail = southApi;
    root.DEXTER_LAB.hearthDiagnosticSouthPairSide = southApi;
    root.DEXTER_LAB.hearthDiagnosticSouthHandoff = southApi;

    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PAIR_SIDE_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_HANDOFF_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_SOUTH_REPORT = clonePlain(lastSouthReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT = clonePlain(lastSouthReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PACKET_TEXT = lastSouthPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_PACKET_TEXT = lastSouthPacketText || "";

    root.HEARTH_DIAGNOSTIC_SOUTH_HANDOFF_ENVELOPE = {
      contract: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      file: SOUTH_FILE,
      chronologyStep: 8,
      fibonacciStage: "F34",
      probeSouthFile: PROBE_SOUTH_FILE,
      probeSouthContract: PROBE_SOUTH_CONTRACT,
      probeSouthReceipt: PROBE_SOUTH_RECEIPT,
      probeSouthEmbeddedInSouth: false,
      auxiliaryTenthFileChronologyMember: false,
      nineStepChronologyPreserved: true,
      handoffSequence: clonePlain(HANDOFF_SEQUENCE),
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  Object.assign(southApi, {
    contract: SOUTH_CONTRACT,
    CONTRACT: SOUTH_CONTRACT,
    receipt: SOUTH_RECEIPT,
    RECEIPT: SOUTH_RECEIPT,
    previousContract: SOUTH_PREVIOUS_CONTRACT,
    previousReceipt: SOUTH_PREVIOUS_RECEIPT,
    lineageV8Contract: SOUTH_LINEAGE_V8_CONTRACT,
    lineageV8Receipt: SOUTH_LINEAGE_V8_RECEIPT,
    lineageV7Contract: SOUTH_LINEAGE_V7_CONTRACT,
    baselineContract: SOUTH_BASELINE_CONTRACT,
    baselineReceipt: SOUTH_BASELINE_RECEIPT,
    version: VERSION,

    file: SOUTH_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    chronologyStep: 8,
    fibonacciStage: "F34",
    southPairSide: true,
    southOutputAuthority: "PACKET_OUTPUT_ONLY",
    southTruthInspectionAuthority: false,
    southChronologyStandardCompatible: true,
    northV11Compatible: true,
    northV10Compatible: true,

    probeSouthPhysicalFileExpected: true,
    probeSouthFile: PROBE_SOUTH_FILE,
    probeSouthContract: PROBE_SOUTH_CONTRACT,
    probeSouthReceipt: PROBE_SOUTH_RECEIPT,
    probeSouthEmbeddedInSouth: false,
    probeSouthAliasPublishedBySouth: false,
    probeSouthMutatedBySouth: false,

    auxiliaryTenthFileAllowed: true,
    auxiliaryTenthFileChronologyMember: false,
    auxiliaryTenthFileOwnedBySouth: false,
    auxiliaryTenthFileDeclaredByProbeSouth: true,
    nineStepChronologyPreserved: true,

    aliasChronology: SOUTH_ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),
    handoffSequence: HANDOFF_SEQUENCE,
    handoffSequenceText: handoffSequenceText(HANDOFF_SEQUENCE),

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
    expectedEastContract: EXPECTED_EAST_CONTRACT,
    expectedWestContract: EXPECTED_WEST_CONTRACT,
    expectedSouthContract: EXPECTED_SOUTH_CONTRACT,
    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

    composeSouthReport,
    runSouth,
    composeReport,
    inspect,
    runDiagnostic,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,

    composeSouthReportApiAvailable: true,
    runSouthApiAvailable: true,
    composeReportApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

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
    elevationTruthAuthority: false,
    mountainTruthAuthority: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  lastSouthState = baseSouthState();
  publishAllAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = southApi;
  }
})();
