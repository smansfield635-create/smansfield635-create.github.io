// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7
// Full-file replacement.
// Diagnostic rail SOUTH packet-output authority only.
// Purpose:
// - Restore SOUTH observability under NORTH v10 chronology hub.
// - Publish NORTH v10 South aliases immediately at parse time.
// - Provide composeSouthReport(...) as the primary callable surface NORTH expects.
// - Preserve North packet meaning instead of reinterpreting it.
// - Act as the South funnel / packet-output authority.
// - Preserve contact surface for the South probe without delegating South authority to the probe.
// - Preserve ordered alias chronology so alias use carries layer/intent.
// - Preserve no production mutation, no Hearth repair, no runtime restart, no Canvas release.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - diagnostic North chronology
// - diagnostic East source evidence
// - diagnostic West rendered evidence
// - diagnostic probe evidence
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - terrain/material/hydrology truth
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v7";

  const PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6";
  const PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_RECEIPT_v6";

  const LINEAGE_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_LAB_CANVAS_BRIDGE_REPORT_CONFORMANCE_TNT_v5";
  const BASELINE_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const BASELINE_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  const VERSION =
    "2026-06-05.hearth-diagnostic-south-funnel-packet-output-north-v10-compatible-v7";

  const FILE = "/assets/hearth/hearth.diagnostic.south.js";
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
  const RAIL_SOUTH_FILE = FILE;
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

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
  const EXPECTED_SOUTH_CONTRACT = CONTRACT;

  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";

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

  const ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      alias: "HEARTH.diagnosticSouth",
      layer: "HEARTH",
      intent: "south-operational-primary",
      authority: "packet-output",
      northV10LookupPriority: 1
    }),
    Object.freeze({
      order: 2,
      alias: "HEARTH.diagnosticRailSouth",
      layer: "HEARTH",
      intent: "south-rail-explicit",
      authority: "packet-output",
      northV10LookupPriority: 2
    }),
    Object.freeze({
      order: 3,
      alias: "HEARTH_DIAGNOSTIC_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-south",
      authority: "packet-output",
      northV10LookupPriority: 3
    }),
    Object.freeze({
      order: 4,
      alias: "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-south",
      authority: "packet-output",
      northV10LookupPriority: 4
    }),
    Object.freeze({
      order: 5,
      alias: "DEXTER_LAB.hearthDiagnosticSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south",
      authority: "packet-output",
      northV10LookupPriority: 5
    }),
    Object.freeze({
      order: 6,
      alias: "DEXTER_LAB.hearthDiagnosticRailSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-south",
      authority: "packet-output",
      northV10LookupPriority: 6
    }),
    Object.freeze({
      order: 7,
      alias: "HEARTH.diagnosticSouthRail",
      layer: "HEARTH",
      intent: "south-rail-inverted-probe-compatibility",
      authority: "packet-output",
      northV10LookupPriority: "compat"
    }),
    Object.freeze({
      order: 8,
      alias: "HEARTH.southDiagnosticRail",
      layer: "HEARTH",
      intent: "south-rail-semantic-probe-compatibility",
      authority: "packet-output",
      northV10LookupPriority: "compat"
    }),
    Object.freeze({
      order: 9,
      alias: "HEARTH.southDiagnostic",
      layer: "HEARTH",
      intent: "south-diagnostic-semantic-probe-compatibility",
      authority: "packet-output",
      northV10LookupPriority: "compat"
    }),
    Object.freeze({
      order: 10,
      alias: "HEARTH_DIAGNOSTIC_SOUTH_RAIL",
      layer: "GLOBAL",
      intent: "legacy-global-south-rail-inverted",
      authority: "packet-output",
      northV10LookupPriority: "compat"
    }),
    Object.freeze({
      order: 11,
      alias: "DEXTER_LAB.hearthDiagnosticSouthRail",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south-rail-inverted",
      authority: "packet-output",
      northV10LookupPriority: "compat"
    }),
    Object.freeze({
      order: 12,
      alias: "DEXTER_LAB.hearthSouthDiagnosticRail",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south-semantic-rail",
      authority: "packet-output",
      northV10LookupPriority: "compat"
    })
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  root.HEARTH = root.HEARTH || {};
  root.DEXTER_LAB = root.DEXTER_LAB || {};

  root.HEARTH.diagnosticSouth = api;
  root.HEARTH.diagnosticRailSouth = api;
  root.HEARTH.diagnosticSouthRail = api;
  root.HEARTH.southDiagnosticRail = api;
  root.HEARTH.southDiagnostic = api;

  root.HEARTH_DIAGNOSTIC_SOUTH = api;
  root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;
  root.HEARTH_DIAGNOSTIC_SOUTH_RAIL = api;

  root.DEXTER_LAB.hearthDiagnosticSouth = api;
  root.DEXTER_LAB.hearthDiagnosticRailSouth = api;
  root.DEXTER_LAB.hearthDiagnosticSouthRail = api;
  root.DEXTER_LAB.hearthSouthDiagnosticRail = api;

  let lastState = null;
  let lastReport = null;
  let lastEvidence = null;
  let lastPacketText = "";
  let lastCompactSummary = "";

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
        return bounded(JSON.stringify(value), 24000) || fallback;
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

  function aliasChronologyText() {
    return ALIAS_CHRONOLOGY.map((entry) => {
      return [
        `${entry.order}.${entry.alias}`,
        `layer:${entry.layer}`,
        `intent:${entry.intent}`,
        `authority:${entry.authority}`
      ].join(" ");
    }).join(" | ");
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology.map((entry) => {
      if (!isObject(entry)) return bounded(entry, 1200);

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

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }
    return {};
  }

  function makeBaseState() {
    return {
      southStatus: "READY",
      southContract: CONTRACT,
      southReceipt: RECEIPT,
      southVersion: VERSION,
      southFile: FILE,
      southOutputAuthority: "PACKET_OUTPUT_ONLY",
      southMeaningPreservationAuthority: true,
      southChronologyStandardCompatible: true,
      northV10Compatible: true,
      probeSouthBridgePreserved: true,
      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(),
      callableMethods: [
        "composeSouthReport",
        "runSouth",
        "composeReport",
        "inspect",
        "runDiagnostic",
        "getReport",
        "getPacketText",
        "getCompactSummary",
        "getState",
        "getReceipt",
        "getReceiptLight"
      ],
      outputComplete: false,
      outputStatus: "READY",
      outputValid: "UNKNOWN",
      meaningPreserved: "UNKNOWN",
      lastUpdatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function buildNotes(currentReport, input) {
    return normalizeNotes(
      getRaw(currentReport, "SECONDARY_EVIDENCE_NOTES", ""),
      getRaw(currentReport, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      "SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT_ACTIVE",
      "SOUTH_RAIL_IS_PACKET_OUTPUT_ONLY",
      "SOUTH_FUNNEL_PATH_ACTIVE",
      "SOUTH_PUBLISHES_NORTH_V10_REQUIRED_ALIASES_AT_PARSE_TIME",
      "SOUTH_PUBLISHES_PROBE_COMPATIBILITY_ALIASES_AT_PARSE_TIME",
      "SOUTH_PRIMARY_CALLABLE_METHOD_AVAILABLE:composeSouthReport",
      "SOUTH_PRESERVES_PARENT_PACKET_MEANING",
      "SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "SOUTH_DOES_NOT_REPAIR_HEARTH",
      "SOUTH_DOES_NOT_RESTART_RUNTIME",
      "SOUTH_DOES_NOT_RELEASE_CANVAS",
      "SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "SOUTH_DOES_NOT_CLAIM_READY_TEXT_OR_VISUAL_PASS",
      "SOUTH_OUTPUT_RETURNED_TO_NORTH_V10_CHRONOLOGY_HUB",
      "SOUTH_PROBE_CONTACT_SURFACE_PRESERVED",
      input && input.chronology ? "SOUTH_RECEIVED_PARENT_CHRONOLOGY_ARRAY" : "SOUTH_PARENT_CHRONOLOGY_ARRAY_NOT_REQUIRED_FOR_ALIAS_OBSERVATION"
    );
  }

  function buildSouthPacket(input = {}) {
    const currentReport = extractCurrentReport(input);

    const chronology = Array.isArray(input.chronology)
      ? clonePlain(input.chronology)
      : Array.isArray(getRaw(currentReport, "CHRONOLOGY_SEQUENCE", null))
        ? clonePlain(getRaw(currentReport, "CHRONOLOGY_SEQUENCE", []))
        : [];

    const evidenceByStep = isObject(input.evidenceByStep)
      ? clonePlain(input.evidenceByStep)
      : {};

    const northContract = firstKnown(
      input.northContract,
      getRaw(currentReport, "NORTH_CONTRACT", ""),
      NORTH_V10_CONTRACT
    );

    const northReceipt = firstKnown(
      input.northReceipt,
      getRaw(currentReport, "NORTH_RECEIPT", ""),
      NORTH_V10_RECEIPT
    );

    const timestamp = firstKnown(
      getRaw(currentReport, "DIAGNOSTIC_TIMESTAMP", ""),
      input.diagnosticTimestamp,
      nowIso()
    );

    const notes = buildNotes(currentReport, input);
    const notesText = notes.join(" | ");

    const parentChronologyText = firstKnown(
      getRaw(currentReport, "CHRONOLOGY_SEQUENCE_TEXT", ""),
      chronologyText(chronology)
    );

    const report = {
      ...currentReport,

      PACKET_NAME: firstKnown(getRaw(currentReport, "PACKET_NAME", ""), PACKET_NAME),
      TARGET_ROUTE: firstKnown(getRaw(currentReport, "TARGET_ROUTE", ""), TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: firstKnown(getRaw(currentReport, "DIAGNOSTIC_ROUTE", ""), DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: timestamp,

      NORTH_CONTRACT: northContract,
      NORTH_RECEIPT: northReceipt,
      PREVIOUS_NORTH_CONTRACT: firstKnown(
        getRaw(currentReport, "PREVIOUS_NORTH_CONTRACT", ""),
        input.previousNorthContract,
        PREVIOUS_NORTH_CONTRACT
      ),
      PREVIOUS_NORTH_RECEIPT: firstKnown(
        getRaw(currentReport, "PREVIOUS_NORTH_RECEIPT", ""),
        PREVIOUS_NORTH_RECEIPT
      ),
      LINEAGE_V8_NORTH_CONTRACT: firstKnown(
        getRaw(currentReport, "LINEAGE_V8_NORTH_CONTRACT", ""),
        LINEAGE_V8_NORTH_CONTRACT
      ),
      LINEAGE_V7_NORTH_CONTRACT: firstKnown(
        getRaw(currentReport, "LINEAGE_V7_NORTH_CONTRACT", ""),
        LINEAGE_V7_NORTH_CONTRACT
      ),
      BASELINE_V6_NORTH_CONTRACT: firstKnown(
        getRaw(currentReport, "BASELINE_V6_NORTH_CONTRACT", ""),
        BASELINE_V6_NORTH_CONTRACT
      ),
      FOUNDATION_V5_NORTH_CONTRACT: firstKnown(
        getRaw(currentReport, "FOUNDATION_V5_NORTH_CONTRACT", ""),
        FOUNDATION_V5_NORTH_CONTRACT
      ),

      SOUTH_STATUS: "COMPLETE",
      SOUTH_CONTRACT: CONTRACT,
      SOUTH_RECEIPT: RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_CONTRACT,
      SOUTH_PREVIOUS_IMPLEMENTATION_RECEIPT: PREVIOUS_RECEIPT,
      SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_RECEIPT: BASELINE_RECEIPT,
      SOUTH_VERSION: VERSION,
      SOUTH_FILE: FILE,

      SOUTH_OUTPUT_COMPLETE: "true",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_OUTPUT_VALID: "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: "true",
      SOUTH_MEANING_PRESERVED: "true",
      SOUTH_PACKET_TEXT_SOURCE: "SOUTH_PACKET_FORMATTING_FROM_NORTH_V10_CHRONOLOGY_HUB_REPORT",
      SOUTH_SCHEMA_CONFORMANCE_STATUS: "SOUTH_CHRONOLOGY_SCHEMA_CONFORMANCE_COMPLETE",
      SOUTH_SCHEMA_CONFORMANCE_REASON: "NORTH_CHRONOLOGY_MEANING_FIELDS_PASSED_THROUGH_WITH_SOUTH_PACKET_OUTPUT_FIELDS_ATTACHED",

      SOUTH_FUNNEL_STATUS: "ACTIVE",
      SOUTH_FUNNEL_ROLE: "PACKET_OUTPUT_FUNNEL",
      SOUTH_FUNNEL_EXPLANATION: "SOUTH_RAIL_RECEIVES_PARENT_CHRONOLOGY_AND_RETURNS_PACKET_OUTPUT_WITHOUT_REINTERPRETING_CHILD_EVIDENCE",
      SOUTH_PROBE_RELATIONSHIP: "PROBE_SOUTH_IS_GATE_8_CHECKMARK_AND_DOES_NOT_OWN_SOUTH_RAIL_OUTPUT",
      SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: "true",

      SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      SOUTH_ALIAS_CHRONOLOGY: clonePlain(ALIAS_CHRONOLOGY),
      SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(),
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

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(
        getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", input.chronologyHubActive),
        "true"
      ),
      NORTH_IS_HUB_ONLY: boolText(
        getRaw(currentReport, "NORTH_IS_HUB_ONLY", true),
        "true"
      ),
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: boolText(
        getRaw(currentReport, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", input.eightWayProbeBridgeActive),
        "false"
      ),
      EIGHT_FILE_CHRONOLOGY_ACTIVE: boolText(
        getRaw(currentReport, "EIGHT_FILE_CHRONOLOGY_ACTIVE", true),
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
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_HTML_CONTRACT", ""), EXPECTED_HTML_CONTRACT),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_INDEX_JS_CONTRACT", ""), EXPECTED_INDEX_JS_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_ROUTE_CONDUCTOR_CONTRACT", ""), EXPECTED_ROUTE_CONDUCTOR_CONTRACT),
      EXPECTED_CONTROL_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_CONTROL_CONTRACT", ""), EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_CANVAS_CONTRACT", ""), EXPECTED_CANVAS_CONTRACT),
      EXPECTED_EAST_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_EAST_CONTRACT", ""), EXPECTED_EAST_CONTRACT),
      EXPECTED_WEST_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_WEST_CONTRACT", ""), EXPECTED_WEST_CONTRACT),
      EXPECTED_SOUTH_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_SOUTH_CONTRACT", ""), EXPECTED_SOUTH_CONTRACT),
      EXPECTED_PROBE_NORTH_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_PROBE_NORTH_CONTRACT", ""), EXPECTED_PROBE_NORTH_CONTRACT),
      EXPECTED_PROBE_EAST_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_PROBE_EAST_CONTRACT", ""), EXPECTED_PROBE_EAST_CONTRACT),
      EXPECTED_PROBE_WEST_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_PROBE_WEST_CONTRACT", ""), EXPECTED_PROBE_WEST_CONTRACT),
      EXPECTED_PROBE_SOUTH_CONTRACT: firstKnown(getRaw(currentReport, "EXPECTED_PROBE_SOUTH_CONTRACT", ""), EXPECTED_PROBE_SOUTH_CONTRACT),

      CHRONOLOGY_SEQUENCE: chronology,
      CHRONOLOGY_SEQUENCE_TEXT: parentChronologyText,
      SOUTH_RECEIVED_CHRONOLOGY_COUNT: String(chronology.length),
      SOUTH_EVIDENCE_BY_STEP_KEYS: Object.keys(evidenceByStep).join(",") || "NONE",

      SOUTH_OUTPUT_AUTHORITY: "PACKET_OUTPUT_ONLY",
      SOUTH_OWNS_NORTH_CHRONOLOGY: "false",
      SOUTH_OWNS_EAST_EVIDENCE: "false",
      SOUTH_OWNS_WEST_EVIDENCE: "false",
      SOUTH_OWNS_PROBE_EVIDENCE: "false",
      SOUTH_OWNS_CANVAS_EXPRESSION: "false",
      SOUTH_OWNS_PRODUCTION_REPAIR: "false",
      SOUTH_OWNS_SOUTH_PROBE: "false",

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

      SECONDARY_EVIDENCE_NOTES: notesText,
      NORTH_SECONDARY_EVIDENCE_NOTES: notesText,
      SOUTH_SECONDARY_OUTPUT_NOTES: notesText,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const evidence = {
      PACKET_NAME: report.PACKET_NAME,
      TARGET_ROUTE: report.TARGET_ROUTE,
      DIAGNOSTIC_ROUTE: report.DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: report.DIAGNOSTIC_TIMESTAMP,

      SOUTH_STATUS: report.SOUTH_STATUS,
      SOUTH_CONTRACT: report.SOUTH_CONTRACT,
      SOUTH_RECEIPT: report.SOUTH_RECEIPT,
      SOUTH_OUTPUT_COMPLETE: report.SOUTH_OUTPUT_COMPLETE,
      SOUTH_OUTPUT_STATUS: report.SOUTH_OUTPUT_STATUS,
      SOUTH_OUTPUT_VALID: report.SOUTH_OUTPUT_VALID,
      SOUTH_OUTPUT_SCHEMA_VALID: report.SOUTH_OUTPUT_SCHEMA_VALID,
      SOUTH_MEANING_PRESERVED: report.SOUTH_MEANING_PRESERVED,
      SOUTH_FUNNEL_STATUS: report.SOUTH_FUNNEL_STATUS,
      SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: report.SOUTH_PROBE_CONTACT_SURFACE_PRESERVED,
      SOUTH_PRIMARY_CALLABLE_METHOD: report.SOUTH_PRIMARY_CALLABLE_METHOD,
      SOUTH_ALIAS_CHRONOLOGY_STATUS: report.SOUTH_ALIAS_CHRONOLOGY_STATUS,

      NORTH_CONTRACT: report.NORTH_CONTRACT,
      NORTH_RECEIPT: report.NORTH_RECEIPT,
      NORTH_CHRONOLOGY_HUB_ACTIVE: report.NORTH_CHRONOLOGY_HUB_ACTIVE,
      NORTH_IS_HUB_ONLY: report.NORTH_IS_HUB_ONLY,
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: report.EIGHT_WAY_PROBE_BRIDGE_ACTIVE,
      EIGHT_FILE_CHRONOLOGY_ACTIVE: report.EIGHT_FILE_CHRONOLOGY_ACTIVE,
      RECEIVER_STILL_CALLS_NORTH_ONLY: report.RECEIVER_STILL_CALLS_NORTH_ONLY,

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_SOUTH_FILE,
      RAIL_WEST_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_SOUTH_FILE,

      SECONDARY_EVIDENCE_NOTES: notesText,
      NORTH_SECONDARY_EVIDENCE_NOTES: notesText,
      SOUTH_SECONDARY_OUTPUT_NOTES: notesText,

      ...report
    };

    const packetText = composePacketText(report);
    const compactSummary = composeCompactSummary(report);

    return {
      ok: true,
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      implementationContract: CONTRACT,
      implementationReceipt: RECEIPT,
      previousImplementationContract: PREVIOUS_CONTRACT,
      previousImplementationReceipt: PREVIOUS_RECEIPT,
      lineageImplementationContract: LINEAGE_CONTRACT,
      baselineImplementationContract: BASELINE_CONTRACT,
      baselineImplementationReceipt: BASELINE_RECEIPT,

      SOUTH_STATUS: "COMPLETE",
      SOUTH_CONTRACT: CONTRACT,
      SOUTH_RECEIPT: RECEIPT,
      SOUTH_OUTPUT_COMPLETE: "true",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_OUTPUT_VALID: "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: "true",
      SOUTH_MEANING_PRESERVED: "true",
      SOUTH_FUNNEL_STATUS: "ACTIVE",
      SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: "true",
      SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      SOUTH_PRIMARY_CALLABLE_METHOD: "composeSouthReport",

      evidence,
      REPORT_OBJECT: report,
      report,
      output: {
        SOUTH_STATUS: "COMPLETE",
        SOUTH_CONTRACT: CONTRACT,
        SOUTH_RECEIPT: RECEIPT,
        SOUTH_OUTPUT_STATUS: "COMPLETE",
        SOUTH_MEANING_PRESERVED: "true",
        SOUTH_FUNNEL_STATUS: "ACTIVE",
        SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: "true",
        REPORT_OBJECT: report,
        evidence
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
      "SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT",
      "SOUTH_BASELINE_IMPLEMENTATION_CONTRACT",
      "SOUTH_BASELINE_IMPLEMENTATION_RECEIPT",
      "SOUTH_VERSION",
      "SOUTH_FILE",

      "SOUTH_OUTPUT_COMPLETE",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_OUTPUT_VALID",
      "SOUTH_OUTPUT_SCHEMA_VALID",
      "SOUTH_MEANING_PRESERVED",
      "SOUTH_PACKET_TEXT_SOURCE",
      "SOUTH_SCHEMA_CONFORMANCE_STATUS",
      "SOUTH_SCHEMA_CONFORMANCE_REASON",

      "SOUTH_FUNNEL_STATUS",
      "SOUTH_FUNNEL_ROLE",
      "SOUTH_FUNNEL_EXPLANATION",
      "SOUTH_PROBE_RELATIONSHIP",
      "SOUTH_PROBE_CONTACT_SURFACE_PRESERVED",

      "SOUTH_ALIAS_CHRONOLOGY_STATUS",
      "SOUTH_ALIAS_CHRONOLOGY_TEXT",
      "SOUTH_PRIMARY_ALIAS",
      "SOUTH_RAIL_ALIAS",
      "SOUTH_GLOBAL_ALIAS",
      "SOUTH_GLOBAL_RAIL_ALIAS",
      "SOUTH_LAB_ALIAS",
      "SOUTH_LAB_RAIL_ALIAS",
      "SOUTH_CALLABLE_METHODS",
      "SOUTH_PRIMARY_CALLABLE_METHOD",
      "SOUTH_CHRONOLOGY_STANDARD_COMPATIBLE",
      "SOUTH_NORTH_V10_COMPATIBLE",

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
      "SOUTH_OWNS_SOUTH_PROBE",

      "DIAGNOSTIC_UI_AUTHORITY",
      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "MACRO_WEST_RELEASE_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORITY",
      "ROUTE_CONDUCTOR_IMPLEMENTATION_AUTHORITY",
      "CONTROL_IMPLEMENTATION_AUTHORITY",
      "TERRAIN_TRUTH_AUTHORITY",
      "HYDROLOGY_TRUTH_AUTHORITY",
      "MATERIAL_TRUTH_AUTHORITY",
      "FINAL_VISUAL_PASS_AUTHORITY",

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

  function composePacketText(report) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("SOUTH_CONTRACT", getValue(report, "SOUTH_CONTRACT", CONTRACT)),
      line("SOUTH_OUTPUT_STATUS", getValue(report, "SOUTH_OUTPUT_STATUS", "UNKNOWN")),
      line("SOUTH_MEANING_PRESERVED", getValue(report, "SOUTH_MEANING_PRESERVED", "UNKNOWN")),
      line("SOUTH_FUNNEL_STATUS", getValue(report, "SOUTH_FUNNEL_STATUS", "UNKNOWN")),
      line("SOUTH_PROBE_CONTACT_SURFACE_PRESERVED", getValue(report, "SOUTH_PROBE_CONTACT_SURFACE_PRESERVED", "UNKNOWN")),
      line("SOUTH_ALIAS_CHRONOLOGY_STATUS", getValue(report, "SOUTH_ALIAS_CHRONOLOGY_STATUS", "UNKNOWN")),
      line("SOUTH_PRIMARY_CALLABLE_METHOD", getValue(report, "SOUTH_PRIMARY_CALLABLE_METHOD", "UNKNOWN")),
      line("NORTH_CHRONOLOGY_HUB_ACTIVE", getValue(report, "NORTH_CHRONOLOGY_HUB_ACTIVE", "UNKNOWN")),
      line("CHRONOLOGY_COMPLETION_STATUS", getValue(report, "CHRONOLOGY_COMPLETION_STATUS", "UNKNOWN")),
      line("ZONE_OF_INFLICTION_FILE", getValue(report, "ZONE_OF_INFLICTION_FILE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN"))
    ].join("\n");
  }

  function publishResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    const evidence = isObject(result && result.evidence)
      ? clonePlain(result.evidence)
      : clonePlain(report);

    lastReport = report;
    lastEvidence = evidence;
    lastPacketText = result && result.packetText ? result.packetText : composePacketText(report);
    lastCompactSummary = result && result.compactSummary ? result.compactSummary : composeCompactSummary(report);

    lastState = {
      ...makeBaseState(),
      southStatus: "COMPLETE",
      outputComplete: true,
      outputStatus: "COMPLETE",
      outputValid: "VALID",
      meaningPreserved: "true",
      reportObject: clonePlain(report),
      evidence: clonePlain(evidence),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      lastUpdatedAt: nowIso()
    };

    publishAliasesAndReceipts();
  }

  function composeSouthReport(input = {}) {
    const result = buildSouthPacket(input);
    publishResult(result);
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
    if (lastReport) return clonePlain(lastReport);

    const result = buildSouthPacket({
      northContract: NORTH_V10_CONTRACT,
      northReceipt: NORTH_V10_RECEIPT,
      chronologyHubActive: true,
      eightWayProbeBridgeActive: false,
      currentReport: {}
    });

    publishResult(result);
    return clonePlain(lastReport);
  }

  function getEvidence() {
    if (lastEvidence) return clonePlain(lastEvidence);
    getReport();
    return clonePlain(lastEvidence || lastReport || {});
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
    return clonePlain(lastState || makeBaseState());
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_RAIL_SOUTH_PACKET_OUTPUT_FUNNEL",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageContract: LINEAGE_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      southStatus: lastState && lastState.southStatus ? lastState.southStatus : "READY",
      southOutputAuthority: "PACKET_OUTPUT_ONLY",
      southFunnelStatus: "ACTIVE",
      southMeaningPreservationAuthority: true,
      southChronologyStandardCompatible: true,
      northV10Compatible: true,
      probeSouthBridgePreserved: true,

      primaryCallableMethod: "composeSouthReport",
      composeSouthReportApiAvailable: true,
      runSouthApiAvailable: true,
      composeReportApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getEvidenceApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(),

      publishesHearthDiagnosticSouth: true,
      publishesHearthDiagnosticRailSouth: true,
      publishesGlobalDiagnosticSouth: true,
      publishesGlobalDiagnosticRailSouth: true,
      publishesDexterLabDiagnosticSouth: true,
      publishesDexterLabDiagnosticRailSouth: true,
      publishesProbeCompatibilityAliases: true,

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
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      SOUTH_CONTRACT: CONTRACT,
      SOUTH_RECEIPT: RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_CONTRACT,
      SOUTH_PREVIOUS_IMPLEMENTATION_RECEIPT: PREVIOUS_RECEIPT,
      SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_RECEIPT: BASELINE_RECEIPT,

      PACKET_NAME,
      NORTH_V10_CONTRACT,
      NORTH_V10_RECEIPT,

      RAIL_NORTH_FILE,
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

      reportObject: clonePlain(lastReport || {}),
      evidence: clonePlain(lastEvidence || {}),
      state: clonePlain(lastState || makeBaseState()),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAliasesAndReceipts() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticSouth = api;
    root.HEARTH.diagnosticRailSouth = api;
    root.HEARTH.diagnosticSouthRail = api;
    root.HEARTH.southDiagnosticRail = api;
    root.HEARTH.southDiagnostic = api;

    root.HEARTH_DIAGNOSTIC_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_RAIL = api;

    root.DEXTER_LAB.hearthDiagnosticSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthRail = api;
    root.DEXTER_LAB.hearthSouthDiagnosticRail = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_RAIL_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_RAIL_REPORT = clonePlain(lastReport || {});

    root.HEARTH_DIAGNOSTIC_SOUTH_EVIDENCE = clonePlain(lastEvidence || {});
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_EVIDENCE = clonePlain(lastEvidence || {});

    root.HEARTH_DIAGNOSTIC_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_COMPACT_SUMMARY = lastCompactSummary || "";
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_COMPACT_SUMMARY = lastCompactSummary || "";
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageContract: LINEAGE_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    southOutputAuthority: "PACKET_OUTPUT_ONLY",
    southFunnelStatus: "ACTIVE",
    southMeaningPreservationAuthority: true,
    southChronologyStandardCompatible: true,
    northV10Compatible: true,
    probeSouthBridgePreserved: true,

    aliasChronology: ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(),

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
    expectedSouthContract: EXPECTED_SOUTH_CONTRACT,
    expectedProbeNorthContract: EXPECTED_PROBE_NORTH_CONTRACT,
    expectedProbeEastContract: EXPECTED_PROBE_EAST_CONTRACT,
    expectedProbeWestContract: EXPECTED_PROBE_WEST_CONTRACT,
    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

    composeSouthReport,
    runSouth,
    composeReport,
    inspect,
    runDiagnostic,
    getReport,
    getEvidence,
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
    getEvidenceApiAvailable: true,
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
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  lastState = makeBaseState();
  publishAliasesAndReceipts();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
