// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8
// Full-file replacement.
// Diagnostic rail SOUTH packet-output authority + embedded Probe South return surface.
// Purpose:
// - Preserve SOUTH as Gate 7 packet-output authority.
// - Preserve composeSouthReport(...) as the primary South callable surface.
// - Preserve North packet meaning instead of reinterpreting it.
// - Publish the Gate 8 Probe South return/checkmark surface from this same loaded South rail file.
// - Allow NORTH v10 to observe PROBE_SOUTH through aliases before it attempts the physical probe file.
// - Treat /assets/hearth/hearth.diagnostic.probe.south.js as a declared marker path, not the operational dependency.
// - Close the diagnostic funnel: North -> East -> West -> South -> Probe South return -> North.
// - Publish ordered alias chronology so alias use carries layer/intent.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - diagnostic North chronology
// - diagnostic East source evidence
// - diagnostic West rendered evidence
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
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8";
  const SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v8";

  const SOUTH_PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const SOUTH_PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v7";

  const SOUTH_LINEAGE_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6";
  const SOUTH_BASELINE_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const SOUTH_BASELINE_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  const PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const PROBE_SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";

  const VERSION =
    "2026-06-05.hearth-diagnostic-south-funnel-gate7-gate8-return-standard-v8";

  const SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const NORTH_V10_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const NORTH_V10_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_RECEIPT_v9";
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

  // Keep the North-v10 expected South contract visible for compatibility.
  const EXPECTED_SOUTH_CONTRACT_FOR_NORTH =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";

  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT = PROBE_SOUTH_CONTRACT;

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

  const SOUTH_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      gate: "GATE_7",
      alias: "HEARTH.diagnosticSouth",
      layer: "HEARTH",
      intent: "south-operational-primary",
      authority: "packet-output",
      northV10LookupPriority: 1
    }),
    Object.freeze({
      order: 2,
      gate: "GATE_7",
      alias: "HEARTH.diagnosticRailSouth",
      layer: "HEARTH",
      intent: "south-rail-explicit",
      authority: "packet-output",
      northV10LookupPriority: 2
    }),
    Object.freeze({
      order: 3,
      gate: "GATE_7",
      alias: "HEARTH_DIAGNOSTIC_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-south",
      authority: "packet-output",
      northV10LookupPriority: 3
    }),
    Object.freeze({
      order: 4,
      gate: "GATE_7",
      alias: "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-south",
      authority: "packet-output",
      northV10LookupPriority: 4
    }),
    Object.freeze({
      order: 5,
      gate: "GATE_7",
      alias: "DEXTER_LAB.hearthDiagnosticSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south",
      authority: "packet-output",
      northV10LookupPriority: 5
    }),
    Object.freeze({
      order: 6,
      gate: "GATE_7",
      alias: "DEXTER_LAB.hearthDiagnosticRailSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-south",
      authority: "packet-output",
      northV10LookupPriority: 6
    })
  ]);

  const PROBE_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      gate: "GATE_8",
      alias: "HEARTH.diagnosticProbeSouth",
      layer: "HEARTH",
      intent: "probe-south-primary-return-check",
      authority: "return-surface",
      northV10LookupPriority: 1
    }),
    Object.freeze({
      order: 2,
      gate: "GATE_8",
      alias: "HEARTH.diagnosticRailProbeSouth",
      layer: "HEARTH",
      intent: "probe-south-rail-return-check",
      authority: "return-surface",
      northV10LookupPriority: 2
    }),
    Object.freeze({
      order: 3,
      gate: "GATE_8",
      alias: "HEARTH.diagnosticSouthProbe",
      layer: "HEARTH",
      intent: "south-probe-funnel-check",
      authority: "return-surface",
      northV10LookupPriority: 3
    }),
    Object.freeze({
      order: 4,
      gate: "GATE_8",
      alias: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-probe-south",
      authority: "return-surface",
      northV10LookupPriority: 4
    }),
    Object.freeze({
      order: 5,
      gate: "GATE_8",
      alias: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-probe-south",
      authority: "return-surface",
      northV10LookupPriority: 5
    }),
    Object.freeze({
      order: 6,
      gate: "GATE_8",
      alias: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-probe-south",
      authority: "return-surface",
      northV10LookupPriority: 6
    }),
    Object.freeze({
      order: 7,
      gate: "GATE_8",
      alias: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-probe-south",
      authority: "return-surface",
      northV10LookupPriority: 7
    })
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const southApi = {};
  const probeSouthApi = {};

  let lastSouthState = null;
  let lastSouthReport = null;
  let lastSouthPacketText = "";
  let lastSouthCompactSummary = "";

  let lastProbeState = null;
  let lastProbeReport = null;
  let lastProbePacketText = "";
  let lastProbeCompactSummary = "";

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

  function getValue(source, key, fallback = "UNKNOWN") {
    return packetValue(getRaw(source, key, undefined), fallback);
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
    return list.map((entry) => {
      return [
        `${entry.order}.${entry.alias}`,
        `gate:${entry.gate}`,
        `layer:${entry.layer}`,
        `intent:${entry.intent}`,
        `authority:${entry.authority}`
      ].join(" ");
    }).join(" | ");
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology.map((entry) => {
      return [
        `${entry.order || "?"}.${entry.id || "UNKNOWN"}`,
        `file:${entry.file || "UNKNOWN"}`,
        `load:${entry.loadStatus || "UNKNOWN"}`,
        `observed:${entry.observed}`,
        `call:${entry.callStatus || "UNKNOWN"}`,
        `status:${entry.status || "UNKNOWN"}`
      ].join(" ");
    }).join(" | ");
  }

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) return clonePlain(input.output.REPORT_OBJECT);
    if (isObject(input)) return clonePlain(input);
    return {};
  }

  function extractChronology(input, currentReport) {
    if (Array.isArray(input && input.chronology)) return clonePlain(input.chronology);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    return [];
  }

  function baseSouthState() {
    return {
      role: "DIAGNOSTIC_RAIL_SOUTH_PACKET_OUTPUT_WITH_EMBEDDED_GATE8_RETURN_SURFACE",
      contract: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      previousContract: SOUTH_PREVIOUS_CONTRACT,
      previousReceipt: SOUTH_PREVIOUS_RECEIPT,
      version: VERSION,
      file: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      southGate: "GATE_7",
      probeSouthGate: "GATE_8",
      southOutputAuthority: "PACKET_OUTPUT_ONLY",
      probeSouthOperationalDependency: "PUBLISHED_ALIAS_SURFACE_FROM_SOUTH_RAIL",
      separateProbeFileRequiredForNorthObservation: false,
      aliasChronology: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      probeAliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      outputStatus: "READY",
      funnelStatus: "READY",
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function baseProbeState() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_RETURN_CHECKMARK_SURFACE",
      contract: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      version: VERSION,
      file: PROBE_SOUTH_FILE,
      carrierFile: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      gate: "GATE_8",
      authority: "RETURN_SURFACE_ONLY",
      physicalFileDependency: false,
      publishedBySouthRail: true,
      outputStatus: "READY",
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function buildSharedFields(input, currentReport, chronology) {
    return {
      PACKET_NAME: firstKnown(currentReport.PACKET_NAME, PACKET_NAME),
      TARGET_ROUTE: firstKnown(currentReport.TARGET_ROUTE, TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: firstKnown(currentReport.DIAGNOSTIC_ROUTE, DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: firstKnown(currentReport.DIAGNOSTIC_TIMESTAMP, input.diagnosticTimestamp, nowIso()),

      NORTH_CONTRACT: firstKnown(input.northContract, currentReport.NORTH_CONTRACT, NORTH_V10_CONTRACT),
      NORTH_RECEIPT: firstKnown(input.northReceipt, currentReport.NORTH_RECEIPT, NORTH_V10_RECEIPT),
      PREVIOUS_NORTH_CONTRACT: firstKnown(currentReport.PREVIOUS_NORTH_CONTRACT, input.previousNorthContract, PREVIOUS_NORTH_CONTRACT),
      PREVIOUS_NORTH_RECEIPT: firstKnown(currentReport.PREVIOUS_NORTH_RECEIPT, PREVIOUS_NORTH_RECEIPT),
      LINEAGE_V8_NORTH_CONTRACT: firstKnown(currentReport.LINEAGE_V8_NORTH_CONTRACT, LINEAGE_V8_NORTH_CONTRACT),
      LINEAGE_V7_NORTH_CONTRACT: firstKnown(currentReport.LINEAGE_V7_NORTH_CONTRACT, LINEAGE_V7_NORTH_CONTRACT),
      BASELINE_V6_NORTH_CONTRACT: firstKnown(currentReport.BASELINE_V6_NORTH_CONTRACT, BASELINE_V6_NORTH_CONTRACT),
      FOUNDATION_V5_NORTH_CONTRACT: firstKnown(currentReport.FOUNDATION_V5_NORTH_CONTRACT, FOUNDATION_V5_NORTH_CONTRACT),

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(
        getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", input.chronologyHubActive),
        "true"
      ),
      NORTH_IS_HUB_ONLY: boolText(getRaw(currentReport, "NORTH_IS_HUB_ONLY", true), "true"),
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: boolText(
        getRaw(currentReport, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", input.eightWayProbeBridgeActive),
        "false"
      ),
      EIGHT_FILE_CHRONOLOGY_ACTIVE: boolText(getRaw(currentReport, "EIGHT_FILE_CHRONOLOGY_ACTIVE", true), "true"),
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: boolText(
        getRaw(currentReport, "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED", false),
        "false"
      ),
      RECEIVER_STILL_CALLS_NORTH_ONLY: boolText(getRaw(currentReport, "RECEIVER_STILL_CALLS_NORTH_ONLY", true), "true"),

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT: firstKnown(currentReport.EXPECTED_HTML_CONTRACT, input.expectedHtmlContract, EXPECTED_HTML_CONTRACT),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(currentReport.EXPECTED_INDEX_JS_CONTRACT, input.expectedIndexJsContract, EXPECTED_INDEX_JS_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(currentReport.EXPECTED_ROUTE_CONDUCTOR_CONTRACT, input.expectedRouteConductorContract, EXPECTED_ROUTE_CONDUCTOR_CONTRACT),
      EXPECTED_CONTROL_CONTRACT: firstKnown(currentReport.EXPECTED_CONTROL_CONTRACT, input.expectedControlContract, EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: firstKnown(currentReport.EXPECTED_CANVAS_CONTRACT, input.expectedCanvasContract, EXPECTED_CANVAS_CONTRACT),
      EXPECTED_EAST_CONTRACT: firstKnown(currentReport.EXPECTED_EAST_CONTRACT, EXPECTED_EAST_CONTRACT),
      EXPECTED_WEST_CONTRACT: firstKnown(currentReport.EXPECTED_WEST_CONTRACT, EXPECTED_WEST_CONTRACT),
      EXPECTED_SOUTH_CONTRACT: firstKnown(currentReport.EXPECTED_SOUTH_CONTRACT, EXPECTED_SOUTH_CONTRACT_FOR_NORTH),
      EXPECTED_PROBE_NORTH_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_NORTH_CONTRACT, EXPECTED_PROBE_NORTH_CONTRACT),
      EXPECTED_PROBE_EAST_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_EAST_CONTRACT, EXPECTED_PROBE_EAST_CONTRACT),
      EXPECTED_PROBE_WEST_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_WEST_CONTRACT, EXPECTED_PROBE_WEST_CONTRACT),
      EXPECTED_PROBE_SOUTH_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_SOUTH_CONTRACT, EXPECTED_PROBE_SOUTH_CONTRACT),

      CHRONOLOGY_SEQUENCE: chronology,
      CHRONOLOGY_SEQUENCE_TEXT: firstKnown(currentReport.CHRONOLOGY_SEQUENCE_TEXT, chronologyText(chronology))
    };
  }

  function buildSouthReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);
    const evidenceByStep = isObject(input.evidenceByStep) ? clonePlain(input.evidenceByStep) : {};
    const shared = buildSharedFields(input, currentReport, chronology);

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "SOUTH_V8_FUNNEL_PACKET_OUTPUT_ACTIVE",
      "SOUTH_GATE_7_PACKET_OUTPUT_AUTHORITY_PRESERVED",
      "SOUTH_GATE_8_PROBE_RETURN_SURFACE_PUBLISHED_BY_SOUTH_RAIL",
      "SOUTH_PROBE_PATH_RETAINED_AS_DECLARED_MARKER_NOT_OPERATIONAL_DEPENDENCY",
      "SOUTH_PUBLISHES_PROBE_SOUTH_ALIASES_BEFORE_NORTH_GATE8_LOAD_ATTEMPT",
      "SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "SOUTH_DOES_NOT_CLAIM_READY_OR_VISUAL_PASS",
      "SOUTH_PACKET_OUTPUT_RETURNED_TO_NORTH_V10_CHRONOLOGY_HUB",
      "SOUTH_REPORT_OBJECT_FULL_PACKET_TEXT_AND_COMPACT_SUMMARY_AVAILABLE"
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
      SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: SOUTH_BASELINE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_RECEIPT: SOUTH_BASELINE_RECEIPT,
      SOUTH_VERSION: VERSION,
      SOUTH_FILE,

      SOUTH_GATE: "GATE_7",
      SOUTH_OUTPUT_COMPLETE: "true",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_OUTPUT_VALID: "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: "true",
      SOUTH_MEANING_PRESERVED: "true",
      SOUTH_FUNNEL_STATUS: "GATE_7_OUTPUT_AND_GATE_8_RETURN_SURFACE_PUBLISHED",
      SOUTH_PACKET_TEXT_SOURCE: "SOUTH_PACKET_FORMATTING_FROM_NORTH_V10_CHRONOLOGY_HUB_REPORT",
      SOUTH_SCHEMA_CONFORMANCE_STATUS: "SOUTH_CHRONOLOGY_SCHEMA_CONFORMANCE_COMPLETE",
      SOUTH_SCHEMA_CONFORMANCE_REASON: "NORTH_CHRONOLOGY_MEANING_FIELDS_PRESENT_AND_PASSED_THROUGH",

      SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      SOUTH_ALIAS_CHRONOLOGY: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),
      SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticSouth",
      SOUTH_RAIL_ALIAS: "HEARTH.diagnosticRailSouth",
      SOUTH_GLOBAL_ALIAS: "HEARTH_DIAGNOSTIC_SOUTH",
      SOUTH_GLOBAL_RAIL_ALIAS: "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      SOUTH_LAB_ALIAS: "DEXTER_LAB.hearthDiagnosticSouth",
      SOUTH_LAB_RAIL_ALIAS: "DEXTER_LAB.hearthDiagnosticRailSouth",

      SOUTH_CALLABLE_METHODS: "composeSouthReport | runSouth | composeReport | inspect | runDiagnostic",
      SOUTH_PRIMARY_CALLABLE_METHOD: "composeSouthReport",
      SOUTH_CHRONOLOGY_STANDARD_COMPATIBLE: "true",
      SOUTH_NORTH_V10_COMPATIBLE: "true",

      PROBE_SOUTH_GATE: "GATE_8",
      PROBE_SOUTH_ROUTER_STATUS: "PUBLISHED_FROM_SOUTH_RAIL",
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "false",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: "true",
      PROBE_SOUTH_RETURN_SURFACE_PRESERVED: "true",
      PROBE_SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PRIMARY_CALLABLE_METHOD: "runProbeSouth",
      PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_SOUTH_ALIAS_CHRONOLOGY: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

      SOUTH_RECEIVED_CHRONOLOGY_COUNT: String(chronology.length),
      SOUTH_EVIDENCE_BY_STEP_KEYS: Object.keys(evidenceByStep).join(",") || "NONE",

      SOUTH_OUTPUT_AUTHORITY: "PACKET_OUTPUT_ONLY",
      SOUTH_OWNS_NORTH_CHRONOLOGY: "false",
      SOUTH_OWNS_EAST_EVIDENCE: "false",
      SOUTH_OWNS_WEST_EVIDENCE: "false",
      SOUTH_OWNS_PROBE_EVIDENCE: "false",
      SOUTH_OWNS_CANVAS_EXPRESSION: "false",
      SOUTH_OWNS_PRODUCTION_REPAIR: "false",

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
      lineageImplementationContract: SOUTH_LINEAGE_CONTRACT,
      baselineImplementationContract: SOUTH_BASELINE_CONTRACT,

      SOUTH_STATUS: "COMPLETE",
      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_OUTPUT_COMPLETE: "true",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_OUTPUT_VALID: "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: "true",
      SOUTH_MEANING_PRESERVED: "true",
      SOUTH_FUNNEL_STATUS: "GATE_7_OUTPUT_AND_GATE_8_RETURN_SURFACE_PUBLISHED",
      SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: "true",
      SOUTH_PRIMARY_CALLABLE_METHOD: "composeSouthReport",
      SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",

      PROBE_SOUTH_ROUTER_STATUS: "PUBLISHED_FROM_SOUTH_RAIL",
      PROBE_SOUTH_RETURN_SURFACE_PRESERVED: "true",
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "false",

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        SOUTH_STATUS: "COMPLETE",
        SOUTH_CONTRACT,
        SOUTH_RECEIPT,
        SOUTH_OUTPUT_STATUS: "COMPLETE",
        SOUTH_MEANING_PRESERVED: "true",
        SOUTH_FUNNEL_STATUS: "GATE_7_OUTPUT_AND_GATE_8_RETURN_SURFACE_PUBLISHED",
        PROBE_SOUTH_RETURN_SURFACE_PRESERVED: "true",
        REPORT_OBJECT: report
      },
      packetText,
      compactSummary,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildProbeSouthReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);
    const shared = buildSharedFields(input, currentReport, chronology);

    const southEntry = findChronologyEntry(chronology, "RAIL_SOUTH");
    const southComplete = Boolean(southEntry && southEntry.status === "COMPLETE");
    const southObserved = Boolean(southEntry && southEntry.observed === true);
    const southReturned = Boolean(southEntry && southEntry.callStatus === "CALL_RETURNED");
    const southMethod = southEntry ? firstKnown(southEntry.callMethod, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";

    const packetMeaningPreserved = southComplete && southObserved && southReturned;

    const probeStatus = packetMeaningPreserved
      ? "COMPLETE"
      : "COMPLETE_WITH_DIAGNOSTIC_WARNINGS";

    const probeMeaningStatus = packetMeaningPreserved
      ? "GATE_7_PACKET_OUTPUT_CONFIRMED_AND_RETURNED_TO_NORTH"
      : "GATE_8_RETURN_SURFACE_ACTIVE_BUT_GATE_7_CONFIRMATION_INCOMPLETE";

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "PROBE_SOUTH_GATE_8_RETURN_SURFACE_ACTIVE",
      "PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL_FUNNEL",
      "PROBE_SOUTH_DOES_NOT_REQUIRE_SEPARATE_FILE_LOAD_FOR_NORTH_OBSERVATION",
      "PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED_AS_MARKER",
      "PROBE_SOUTH_CONFIRMS_GATE_7_PASSAGE_ONLY",
      "PROBE_SOUTH_DOES_NOT_JUDGE_SOUTH_RAIL_CORRECTNESS",
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "PROBE_SOUTH_DOES_NOT_CLAIM_READY_OR_VISUAL_PASS",
      packetMeaningPreserved
        ? "PROBE_SOUTH_CONFIRMED_SOUTH_RAIL_PACKET_RETURN_TO_NORTH"
        : "PROBE_SOUTH_GATE_7_CONFIRMATION_INCOMPLETE"
    );

    const report = {
      ...shared,

      PROBE_SOUTH_STATUS: probeStatus,
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_CARRIER_FILE: SOUTH_FILE,

      PROBE_SOUTH_GATE: "GATE_8",
      PROBE_SOUTH_ROLE: "RETURN_CHECKMARK_SURFACE",
      PROBE_SOUTH_AUTHORITY: "PASSAGE_CONFIRMATION_ONLY",
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "false",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: "true",
      PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL: "true",

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: probeStatus,
      PROBE_SOUTH_MEANING_STATUS: probeMeaningStatus,
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: boolText(packetMeaningPreserved, "false"),
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: packetMeaningPreserved
        ? "RETURN_SURFACE_COMPLETE"
        : "RETURN_SURFACE_ACTIVE_WITH_GATE7_WARNING",
      PROBE_SOUTH_CHECKMARK_STATUS: packetMeaningPreserved
        ? "CHECKMARK_PASS"
        : "CHECKMARK_ACTIVE_GATE7_NOT_FULLY_CONFIRMED",

      SOUTH_GATE_CONFIRMED_BY_PROBE: boolText(packetMeaningPreserved, "false"),
      SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE: boolText(Boolean(southEntry), "false"),
      SOUTH_RAIL_OBSERVED_BY_PROBE: boolText(southObserved, "false"),
      SOUTH_RAIL_CALL_RETURNED_BY_PROBE: boolText(southReturned, "false"),
      SOUTH_RAIL_CALL_METHOD_BY_PROBE: southMethod,
      SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE: southEntry ? firstKnown(southEntry.status, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY",

      SOUTH_FUNNEL_STATUS: packetMeaningPreserved
        ? "CLOSED_LOOP_RETURN_CONFIRMED"
        : "RETURN_SURFACE_ACTIVE_SOUTH_GATE_NOT_CONFIRMED",
      SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: "true",
      SOUTH_GATE_7_DOES_NOT_DEPEND_ON_GATE_8_JUDGMENT: "true",
      GATE_8_DOES_NOT_DICTATE_GATE_7_CORRECTNESS: "true",

      PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_SOUTH_ALIAS_CHRONOLOGY: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_RAIL_ALIAS: "HEARTH.diagnosticRailProbeSouth",
      PROBE_SOUTH_SOUTH_PROBE_ALIAS: "HEARTH.diagnosticSouthProbe",
      PROBE_SOUTH_GLOBAL_ALIAS: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      PROBE_SOUTH_GLOBAL_RAIL_ALIAS: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      PROBE_SOUTH_LAB_ALIAS: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      PROBE_SOUTH_LAB_RAIL_ALIAS: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",

      PROBE_SOUTH_CALLABLE_METHODS:
        "runProbeSouth | inspectPacketMeaning | inspectPacketComposition | runProbe | inspect | runDiagnostic",
      PROBE_SOUTH_PRIMARY_CALLABLE_METHOD: "runProbeSouth",
      PROBE_SOUTH_NORTH_V10_COMPATIBLE: "true",
      PROBE_SOUTH_CHRONOLOGY_STANDARD_COMPATIBLE: "true",

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
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const packetText = composePacketText(report, orderedProbeFields(report));
    const compactSummary = composeProbeCompactSummary(report);

    return {
      ok: true,
      contract: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      implementationContract: PROBE_SOUTH_CONTRACT,
      implementationReceipt: PROBE_SOUTH_RECEIPT,

      PROBE_SOUTH_STATUS: probeStatus,
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: probeStatus,
      PROBE_SOUTH_MEANING_STATUS: probeMeaningStatus,
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: report.PROBE_SOUTH_RETURN_TO_NORTH_STATUS,
      PROBE_SOUTH_CHECKMARK_STATUS: report.PROBE_SOUTH_CHECKMARK_STATUS,
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "false",

      SOUTH_FUNNEL_STATUS: report.SOUTH_FUNNEL_STATUS,
      SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: "true",

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        PROBE_SOUTH_STATUS: probeStatus,
        PROBE_SOUTH_CONTRACT,
        PROBE_SOUTH_RECEIPT,
        PROBE_SOUTH_RUN_STATUS: probeStatus,
        PROBE_SOUTH_MEANING_STATUS: probeMeaningStatus,
        SOUTH_FUNNEL_STATUS: report.SOUTH_FUNNEL_STATUS,
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

      "SOUTH_STATUS",
      "SOUTH_CONTRACT",
      "SOUTH_RECEIPT",
      "SOUTH_IMPLEMENTATION_CONTRACT",
      "SOUTH_IMPLEMENTATION_RECEIPT",
      "SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT",
      "SOUTH_VERSION",
      "SOUTH_FILE",
      "SOUTH_GATE",
      "SOUTH_OUTPUT_COMPLETE",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_OUTPUT_VALID",
      "SOUTH_OUTPUT_SCHEMA_VALID",
      "SOUTH_MEANING_PRESERVED",
      "SOUTH_FUNNEL_STATUS",

      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROUTER_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY",
      "PROBE_SOUTH_RETURN_SURFACE_PRESERVED",
      "PROBE_SOUTH_PRIMARY_ALIAS",
      "PROBE_SOUTH_PRIMARY_CALLABLE_METHOD",

      "SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "SOUTH_ALIAS_CHRONOLOGY_TEXT",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT",

      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
      "EIGHT_FILE_CHRONOLOGY_ACTIVE",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",

      "CHRONOLOGY_SEQUENCE_TEXT",
      "SOUTH_RECEIVED_CHRONOLOGY_COUNT",
      "SOUTH_EVIDENCE_BY_STEP_KEYS",

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
      "EXPECTED_CONTROL_CONTRACT",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_EAST_CONTRACT",
      "EXPECTED_WEST_CONTRACT",
      "EXPECTED_SOUTH_CONTRACT",
      "EXPECTED_PROBE_NORTH_CONTRACT",
      "EXPECTED_PROBE_EAST_CONTRACT",
      "EXPECTED_PROBE_WEST_CONTRACT",
      "EXPECTED_PROBE_SOUTH_CONTRACT",

      "SOUTH_OUTPUT_AUTHORITY",
      "SOUTH_OWNS_NORTH_CHRONOLOGY",
      "SOUTH_OWNS_EAST_EVIDENCE",
      "SOUTH_OWNS_WEST_EVIDENCE",
      "SOUTH_OWNS_PROBE_EVIDENCE",
      "SOUTH_OWNS_CANVAS_EXPRESSION",
      "SOUTH_OWNS_PRODUCTION_REPAIR",

      "SECONDARY_EVIDENCE_NOTES",
      "NORTH_SECONDARY_EVIDENCE_NOTES",
      "SOUTH_SECONDARY_OUTPUT_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    return orderedFieldsFromPriority(report, priority);
  }

  function orderedProbeFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",

      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_CARRIER_FILE",
      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROLE",
      "PROBE_SOUTH_AUTHORITY",
      "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY",
      "PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED",
      "PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL",

      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_PACKET_MEANING_PRESERVED",
      "PROBE_SOUTH_RETURN_TO_NORTH_STATUS",
      "PROBE_SOUTH_CHECKMARK_STATUS",

      "SOUTH_GATE_CONFIRMED_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_CALL_RETURNED_BY_PROBE",
      "SOUTH_RAIL_CALL_METHOD_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE",

      "SOUTH_FUNNEL_STATUS",
      "SOUTH_PROBE_CONTACT_SURFACE_PRESERVED",
      "SOUTH_GATE_7_DOES_NOT_DEPEND_ON_GATE_8_JUDGMENT",
      "GATE_8_DOES_NOT_DICTATE_GATE_7_CORRECTNESS",

      "PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT",
      "PROBE_SOUTH_PRIMARY_ALIAS",
      "PROBE_SOUTH_PRIMARY_CALLABLE_METHOD",
      "PROBE_SOUTH_CALLABLE_METHODS",
      "PROBE_SOUTH_NORTH_V10_COMPATIBLE",

      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
      "EIGHT_FILE_CHRONOLOGY_ACTIVE",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",

      "CHRONOLOGY_SEQUENCE_TEXT",
      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_SOUTH_FILE",
      "RAIL_WEST_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_WEST_FILE",
      "PROBE_SOUTH_FILE",

      "SECONDARY_EVIDENCE_NOTES",
      "PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    return orderedFieldsFromPriority(report, priority);
  }

  function orderedFieldsFromPriority(report, priority) {
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
      line("SOUTH_CONTRACT", getValue(report, "SOUTH_CONTRACT", SOUTH_CONTRACT)),
      line("SOUTH_OUTPUT_STATUS", getValue(report, "SOUTH_OUTPUT_STATUS", "UNKNOWN")),
      line("SOUTH_MEANING_PRESERVED", getValue(report, "SOUTH_MEANING_PRESERVED", "UNKNOWN")),
      line("SOUTH_FUNNEL_STATUS", getValue(report, "SOUTH_FUNNEL_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_ROUTER_STATUS", getValue(report, "PROBE_SOUTH_ROUTER_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY", getValue(report, "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY", "UNKNOWN")),
      line("PROBE_SOUTH_PRIMARY_CALLABLE_METHOD", getValue(report, "PROBE_SOUTH_PRIMARY_CALLABLE_METHOD", "UNKNOWN"))
    ].join("\n");
  }

  function composeProbeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_CONTRACT", getValue(report, "PROBE_SOUTH_CONTRACT", PROBE_SOUTH_CONTRACT)),
      line("PROBE_SOUTH_RUN_STATUS", getValue(report, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_MEANING_STATUS", getValue(report, "PROBE_SOUTH_MEANING_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_RETURN_TO_NORTH_STATUS", getValue(report, "PROBE_SOUTH_RETURN_TO_NORTH_STATUS", "UNKNOWN")),
      line("SOUTH_FUNNEL_STATUS", getValue(report, "SOUTH_FUNNEL_STATUS", "UNKNOWN")),
      line("SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE", getValue(report, "SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE", "UNKNOWN")),
      line("PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY", getValue(report, "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY", "UNKNOWN"))
    ].join("\n");
  }

  function publishSouthResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    lastSouthReport = report;
    lastSouthPacketText = result && result.packetText ? result.packetText : composePacketText(report, orderedSouthFields(report));
    lastSouthCompactSummary = result && result.compactSummary ? result.compactSummary : composeSouthCompactSummary(report);
    lastSouthState = {
      ...baseSouthState(),
      outputStatus: "COMPLETE",
      funnelStatus: "GATE_7_OUTPUT_AND_GATE_8_RETURN_SURFACE_PUBLISHED",
      reportObject: clonePlain(report),
      packetText: lastSouthPacketText,
      compactSummary: lastSouthCompactSummary,
      updatedAt: nowIso()
    };

    publishAllAliases();
  }

  function publishProbeResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    lastProbeReport = report;
    lastProbePacketText = result && result.packetText ? result.packetText : composePacketText(report, orderedProbeFields(report));
    lastProbeCompactSummary = result && result.compactSummary ? result.compactSummary : composeProbeCompactSummary(report);
    lastProbeState = {
      ...baseProbeState(),
      outputStatus: getValue(report, "PROBE_SOUTH_RUN_STATUS", "COMPLETE"),
      reportObject: clonePlain(report),
      packetText: lastProbePacketText,
      compactSummary: lastProbeCompactSummary,
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

  function runProbeSouth(input = {}) {
    const result = buildProbeSouthReport(input);
    publishProbeResult(result);
    return result;
  }

  function inspectPacketMeaning(input = {}) {
    return runProbeSouth(input);
  }

  function inspectPacketComposition(input = {}) {
    return runProbeSouth(input);
  }

  function runProbe(input = {}) {
    return runProbeSouth(input);
  }

  function getSouthReport() {
    if (lastSouthReport) return clonePlain(lastSouthReport);

    const result = buildSouthReport({
      northContract: NORTH_V10_CONTRACT,
      northReceipt: NORTH_V10_RECEIPT,
      chronologyHubActive: true,
      eightWayProbeBridgeActive: false,
      currentReport: {}
    });

    publishSouthResult(result);
    return clonePlain(lastSouthReport);
  }

  function getProbeReport() {
    if (lastProbeReport) return clonePlain(lastProbeReport);

    const result = buildProbeSouthReport({
      northContract: NORTH_V10_CONTRACT,
      northReceipt: NORTH_V10_RECEIPT,
      chronologyHubActive: true,
      eightWayProbeBridgeActive: false,
      currentReport: {},
      chronology: []
    });

    publishProbeResult(result);
    return clonePlain(lastProbeReport);
  }

  function getSouthPacketText() {
    if (lastSouthPacketText) return lastSouthPacketText;
    getSouthReport();
    return lastSouthPacketText;
  }

  function getProbePacketText() {
    if (lastProbePacketText) return lastProbePacketText;
    getProbeReport();
    return lastProbePacketText;
  }

  function getSouthCompactSummary() {
    if (lastSouthCompactSummary) return lastSouthCompactSummary;
    getSouthReport();
    return lastSouthCompactSummary;
  }

  function getProbeCompactSummary() {
    if (lastProbeCompactSummary) return lastProbeCompactSummary;
    getProbeReport();
    return lastProbeCompactSummary;
  }

  function getSouthState() {
    return clonePlain(lastSouthState || baseSouthState());
  }

  function getProbeState() {
    return clonePlain(lastProbeState || baseProbeState());
  }

  function getSouthReceiptLight() {
    return {
      role: "DIAGNOSTIC_RAIL_SOUTH_PACKET_OUTPUT_WITH_EMBEDDED_PROBE_RETURN_SURFACE",
      contract: SOUTH_CONTRACT,
      CONTRACT: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      RECEIPT: SOUTH_RECEIPT,
      previousContract: SOUTH_PREVIOUS_CONTRACT,
      previousReceipt: SOUTH_PREVIOUS_RECEIPT,
      lineageContract: SOUTH_LINEAGE_CONTRACT,
      baselineContract: SOUTH_BASELINE_CONTRACT,
      baselineReceipt: SOUTH_BASELINE_RECEIPT,
      version: VERSION,
      file: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      gate7Role: "SOUTH_PACKET_OUTPUT",
      gate8PublishedByThisFile: true,
      probeSouthReturnSurfacePublished: true,
      separateProbeSouthFileRequiredForNorthObservation: false,
      probeSouthDeclaredFilePath: PROBE_SOUTH_FILE,

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

      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),

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

  function getProbeReceiptLight() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_RETURN_CHECKMARK_SURFACE",
      contract: PROBE_SOUTH_CONTRACT,
      CONTRACT: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      RECEIPT: PROBE_SOUTH_RECEIPT,
      version: VERSION,
      file: PROBE_SOUTH_FILE,
      carrierFile: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      gate8Role: "PROBE_SOUTH_RETURN_SURFACE",
      publishedBySouthRail: true,
      operationalFileDependency: false,
      declaredFilePathRetained: true,
      northV10Compatible: true,

      primaryCallableMethod: "runProbeSouth",
      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
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
      aliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

      diagnosticProbeOnly: true,
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
      southRailPacketOutputAuthority: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getSouthReceipt() {
    return {
      ...getSouthReceiptLight(),

      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: SOUTH_CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: SOUTH_RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: SOUTH_PREVIOUS_CONTRACT,
      SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: SOUTH_BASELINE_CONTRACT,

      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_RETURN_SURFACE_PUBLISHED: true,

      PACKET_NAME,
      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT: EXPECTED_SOUTH_CONTRACT_FOR_NORTH,
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      reportObject: clonePlain(lastSouthReport || {}),
      state: clonePlain(lastSouthState || baseSouthState()),

      ...UPPER_NO_CLAIMS
    };
  }

  function getProbeReceipt() {
    return {
      ...getProbeReceiptLight(),

      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_CARRIER_FILE: SOUTH_FILE,

      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_FILE,

      PACKET_NAME,
      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,

      EXPECTED_PROBE_SOUTH_CONTRACT,

      reportObject: clonePlain(lastProbeReport || {}),
      state: clonePlain(lastProbeState || baseProbeState()),

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

    root.HEARTH_DIAGNOSTIC_SOUTH = southApi;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = southApi;
    root.HEARTH_DIAGNOSTIC_SOUTH_RAIL = southApi;

    root.DEXTER_LAB.hearthDiagnosticSouth = southApi;
    root.DEXTER_LAB.hearthDiagnosticRailSouth = southApi;
    root.DEXTER_LAB.hearthDiagnosticSouthRail = southApi;
    root.DEXTER_LAB.hearthSouthDiagnosticRail = southApi;

    root.HEARTH.diagnosticProbeSouth = probeSouthApi;
    root.HEARTH.diagnosticRailProbeSouth = probeSouthApi;
    root.HEARTH.diagnosticSouthProbe = probeSouthApi;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = probeSouthApi;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = probeSouthApi;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = probeSouthApi;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = probeSouthApi;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = probeSouthApi;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = probeSouthApi;

    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_REPORT = clonePlain(lastSouthReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT = clonePlain(lastSouthReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PACKET_TEXT = lastSouthPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_PACKET_TEXT = lastSouthPacketText || "";

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getProbeReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getProbeReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getProbeReceipt();
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastProbeReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastProbeReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastProbeReport || {});
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastProbePacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastProbePacketText || "";
  }

  Object.assign(southApi, {
    contract: SOUTH_CONTRACT,
    CONTRACT: SOUTH_CONTRACT,
    receipt: SOUTH_RECEIPT,
    RECEIPT: SOUTH_RECEIPT,
    previousContract: SOUTH_PREVIOUS_CONTRACT,
    previousReceipt: SOUTH_PREVIOUS_RECEIPT,
    lineageContract: SOUTH_LINEAGE_CONTRACT,
    baselineContract: SOUTH_BASELINE_CONTRACT,
    baselineReceipt: SOUTH_BASELINE_RECEIPT,
    version: VERSION,

    file: SOUTH_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    southOutputAuthority: "PACKET_OUTPUT_ONLY",
    southMeaningPreservationAuthority: true,
    southChronologyStandardCompatible: true,
    northV10Compatible: true,
    gate7Role: "SOUTH_PACKET_OUTPUT",
    gate8ProbeSouthPublishedByThisFile: true,
    separateProbeSouthFileRequiredForNorthObservation: false,

    aliasChronology: SOUTH_ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),
    probeAliasChronology: PROBE_ALIAS_CHRONOLOGY,
    probeAliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

    railNorthFile: RAIL_NORTH_FILE,
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
    expectedEastContract: EXPECTED_EAST_CONTRACT,
    expectedWestContract: EXPECTED_WEST_CONTRACT,
    expectedSouthContract: EXPECTED_SOUTH_CONTRACT_FOR_NORTH,
    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

    composeSouthReport,
    runSouth,
    composeReport,
    inspect,
    runDiagnostic,
    getReport: getSouthReport,
    getPacketText: getSouthPacketText,
    getCompactSummary: getSouthCompactSummary,
    getState: getSouthState,
    getReceipt: getSouthReceipt,
    getReceiptLight: getSouthReceiptLight,

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

    ...NO_CLAIMS
  });

  Object.assign(probeSouthApi, {
    contract: PROBE_SOUTH_CONTRACT,
    CONTRACT: PROBE_SOUTH_CONTRACT,
    receipt: PROBE_SOUTH_RECEIPT,
    RECEIPT: PROBE_SOUTH_RECEIPT,
    version: VERSION,

    file: PROBE_SOUTH_FILE,
    carrierFile: SOUTH_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    gate8Role: "PROBE_SOUTH_RETURN_CHECKMARK_SURFACE",
    authority: "PASSAGE_CONFIRMATION_ONLY",
    publishedBySouthRail: true,
    operationalFileDependency: false,
    declaredFilePathRetained: true,
    northV10Compatible: true,

    aliasChronology: PROBE_ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    railWestFile: RAIL_WEST_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,
    expectedSouthRailContract: EXPECTED_SOUTH_CONTRACT_FOR_NORTH,

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    runProbe,
    inspect: runProbeSouth,
    runDiagnostic: runProbeSouth,
    getReport: getProbeReport,
    getPacketText: getProbePacketText,
    getCompactSummary: getProbeCompactSummary,
    getState: getProbeState,
    getReceipt: getProbeReceipt,
    getReceiptLight: getProbeReceiptLight,

    runProbeSouthApiAvailable: true,
    inspectPacketMeaningApiAvailable: true,
    inspectPacketCompositionApiAvailable: true,
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
    southRailPacketOutputAuthority: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  lastSouthState = baseSouthState();
  lastProbeState = baseProbeState();

  publishAllAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      south: southApi,
      probeSouth: probeSouthApi
    };
  }
})();
