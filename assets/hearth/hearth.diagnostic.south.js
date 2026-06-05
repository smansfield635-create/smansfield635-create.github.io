// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7
// Full-file replacement.
// Diagnostic rail SOUTH child only.
// Internal implementation renewal:
// HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT_CONFORMANCE_TNT_v8
// Purpose:
// - Make SOUTH observable by NORTH v10 chronology hub.
// - Preserve SOUTH as packet-output authority only.
// - Publish all standard SOUTH aliases expected by the chronology hub.
// - Preserve legacy SOUTH report-output contract fields for older NORTH readers.
// - Preserve current v7 priority-control / queen packet conformance identity for NORTH v10.
// - Compose North-valid report objects without mutating production Hearth files.
// - Preserve NORTH-selected chronology, recommendation, calibration, NEWS, Fibonacci, and no-claim boundaries.
// - Correct stale self-absence projection when SOUTH is executing and returning.
// - Keep SOUTH as output/report lane only; no served-source read, no rendered-target read, no UI mutation, no repair.
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
// - F13 claim
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v7";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT_CONFORMANCE_TNT_v8";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT_CONFORMANCE_RECEIPT_v8";

  const LEGACY_EXTERNAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const LEGACY_EXTERNAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v7";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_LAB_CANVAS_BRIDGE_REPORT_CONFORMANCE_TNT_v5";

  const NORTH_CURRENT_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const NORTH_CURRENT_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const NORTH_PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";

  const VERSION =
    "2026-06-05.hearth-diagnostic-south-chronology-standard-packet-output-conformance-v8";

  const FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = FILE;

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

  const root = typeof window !== "undefined" ? window : globalThis;

  let api = null;
  let lastState = null;
  let lastReport = null;
  let lastOutput = null;
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

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((entry) => bounded(entry, 1400)).filter(Boolean).join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 30000) || fallback;
      } catch (_error) {
        return bounded(String(value), 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function getValue(source, key, fallback = "UNKNOWN") {
    return packetValue(getRaw(source, key, undefined), fallback);
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
        if (!clean || clean === "none" || clean === "UNKNOWN") continue;
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

  function hasMeaningField(report, field) {
    const value = getValue(report, field, "");
    return Boolean(value && value !== "UNKNOWN" && value !== "NOT_FOUND");
  }

  function extractCurrentReport(input) {
    if (!isObject(input)) return {};

    const candidates = [
      input.currentReport,
      input.report,
      input.REPORT_OBJECT,
      input.northReport,
      input.currentNorthReport,
      input
    ];

    for (const candidate of candidates) {
      if (!isObject(candidate)) continue;

      if (
        hasMeaningField(candidate, "PACKET_NAME") ||
        hasMeaningField(candidate, "NORTH_CONTRACT") ||
        hasMeaningField(candidate, "TARGET_ROUTE") ||
        hasMeaningField(candidate, "PRIMARY_CASE") ||
        hasMeaningField(candidate, "CALIBRATION_STATUS")
      ) {
        return clonePlain(candidate);
      }
    }

    return clonePlain(input);
  }

  function extractChronology(input, currentReport) {
    const chronology =
      getRaw(input, "chronology", null) ||
      getRaw(input, "CHRONOLOGY_SEQUENCE", null) ||
      getRaw(currentReport, "chronology", null) ||
      getRaw(currentReport, "CHRONOLOGY_SEQUENCE", null) ||
      [];

    return Array.isArray(chronology) ? clonePlain(chronology) : [];
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology) || !chronology.length) return "NONE";

    return chronology.map((step, index) => {
      if (!isObject(step)) return `${index + 1}.UNKNOWN_STEP`;

      const order = getValue(step, "order", index + 1);
      const id = getValue(step, "id", "UNKNOWN");
      const file = getValue(step, "file", "UNKNOWN");
      const load = getValue(step, "loadStatus", "UNKNOWN");
      const observed = getValue(step, "observed", "UNKNOWN");
      const call = getValue(step, "callStatus", "UNKNOWN");
      const status = getValue(step, "status", "UNKNOWN");

      return `${order}.${id} file:${file} load:${load} observed:${observed} call:${call} status:${status}`;
    }).join(" | ");
  }

  function findChronologyStep(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    const upper = safeString(id).toUpperCase();

    for (const step of chronology) {
      if (!isObject(step)) continue;
      if (safeString(step.id).toUpperCase() === upper) return step;
    }

    return null;
  }

  function makeState(input = {}, options = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      legacyExternalContract: LEGACY_EXTERNAL_CONTRACT,
      legacyExternalReceipt: LEGACY_EXTERNAL_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      northCurrentContract: getValue(input, "northContract", getValue(currentReport, "NORTH_CONTRACT", NORTH_CURRENT_CONTRACT)),
      northCurrentReceipt: getValue(input, "northReceipt", getValue(currentReport, "NORTH_RECEIPT", NORTH_CURRENT_RECEIPT)),
      northPreviousContract: getValue(input, "previousNorthContract", getValue(currentReport, "PREVIOUS_NORTH_CONTRACT", NORTH_PREVIOUS_CONTRACT)),
      version: VERSION,
      file: FILE,
      targetRoute: getValue(currentReport, "TARGET_ROUTE", TARGET_ROUTE),
      diagnosticRoute: getValue(currentReport, "DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE),
      diagnosticTimestamp: getValue(currentReport, "DIAGNOSTIC_TIMESTAMP", nowIso()),

      chronologyHubActive: boolText(getRaw(input, "chronologyHubActive", getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", true)), "true"),
      northIsHubOnly: boolText(getRaw(input, "northIsHubOnly", getRaw(currentReport, "NORTH_IS_HUB_ONLY", true)), "true"),
      eightWayProbeBridgeActive: boolText(getRaw(input, "eightWayProbeBridgeActive", getRaw(currentReport, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", false)), "false"),
      eightFileChronologyActive: boolText(getRaw(input, "eightFileChronologyActive", getRaw(currentReport, "EIGHT_FILE_CHRONOLOGY_ACTIVE", true)), "true"),

      currentReport,
      chronology,
      railSouthChronologyStep: findChronologyStep(chronology, "RAIL_SOUTH"),
      probeSouthChronologyStep: findChronologyStep(chronology, "PROBE_SOUTH"),

      southStatus: "READY",
      southOutputComplete: "false",
      southOutputStatus: "UNKNOWN",
      southMeaningPreserved: "UNKNOWN",
      southSchemaValid: "false",
      southChronologyConformanceStatus: "UNKNOWN",
      southRailObservedBySouth: true,
      southAliasPublishStatus: "READY_TO_PUBLISH_STANDARD_ALIASES",
      southCorrectedStaleSelfAbsence: "false",

      reportObject: {},
      outputObject: {},
      packetText: "",
      compactSummary: "",

      notes: [
        "SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT_ACTIVE",
        "SOUTH_RAIL_IS_PACKET_OUTPUT_ONLY",
        "SOUTH_PUBLISHES_STANDARD_CHRONOLOGY_ALIASES",
        "SOUTH_DOES_NOT_MUTATE_PRODUCTION",
        "SOUTH_DOES_NOT_CLAIM_F13_OR_F21"
      ],

      options: clonePlain(options || {}),
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function northMeaningPreserved(source, report) {
    const fields = [
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",
      "DIAGNOSTIC_RAIL_CLEAN",
      "CALIBRATION_POINT_REACHED",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION"
    ];

    for (const field of fields) {
      const sourceValue = getValue(source, field, "UNKNOWN");
      const reportValue = getValue(report, field, "UNKNOWN");

      if (sourceValue !== "UNKNOWN" && sourceValue !== reportValue) return false;
    }

    return true;
  }

  function requiredNorthFieldsPresent(report) {
    const fields = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",
      "DIAGNOSTIC_RAIL_CLEAN",
      "CALIBRATION_POINT_REACHED",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION"
    ];

    return fields.every((field) => hasMeaningField(report, field));
  }

  function buildSouthVerdict(state, report) {
    const railSouthStep = state.railSouthChronologyStep || {};
    const probeSouthStep = state.probeSouthChronologyStep || {};

    return {
      schema: "HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT_VERDICT_SCHEMA_v8",
      southContract: CONTRACT,
      southReceipt: RECEIPT,
      southImplementationContract: IMPLEMENTATION_CONTRACT,
      southImplementationReceipt: IMPLEMENTATION_RECEIPT,
      southLegacyExternalContract: LEGACY_EXTERNAL_CONTRACT,
      southLegacyExternalReceipt: LEGACY_EXTERNAL_RECEIPT,
      northContract: state.northCurrentContract,
      northReceipt: state.northCurrentReceipt,
      previousNorthContract: state.northPreviousContract,
      targetRoute: state.targetRoute,
      diagnosticRoute: state.diagnosticRoute,
      diagnosticTimestamp: state.diagnosticTimestamp,

      chronologyConformance: {
        chronologyHubActive: state.chronologyHubActive,
        northIsHubOnly: state.northIsHubOnly,
        eightWayProbeBridgeActive: state.eightWayProbeBridgeActive,
        eightFileChronologyActive: state.eightFileChronologyActive,
        southRailObservedBySouth: true,
        southRailChronologyStepObserved: Boolean(state.railSouthChronologyStep),
        southRailChronologyStepStatus: getValue(railSouthStep, "status", "UNKNOWN"),
        southRailChronologyCallStatus: getValue(railSouthStep, "callStatus", "UNKNOWN"),
        probeSouthChronologyStepObserved: Boolean(state.probeSouthChronologyStep),
        probeSouthChronologyStepStatus: getValue(probeSouthStep, "status", "UNKNOWN")
      },

      packetOutput: {
        southOutputComplete: state.southOutputComplete,
        southOutputStatus: state.southOutputStatus,
        southMeaningPreserved: state.southMeaningPreserved,
        southSchemaValid: state.southSchemaValid,
        reportObjectPresent: isObject(report),
        fullPacketTextPresent: Boolean(state.packetText),
        compactSummaryPresent: Boolean(state.compactSummary)
      },

      aliasPublication: {
        hearthDiagnosticSouth: true,
        hearthDiagnosticRailSouth: true,
        dexterLabHearthDiagnosticSouth: true,
        globalDiagnosticSouth: true,
        globalDiagnosticRailSouth: true,
        status: state.southAliasPublishStatus
      },

      authorityBoundaries: {
        packetFormattingAuthority: true,
        finalPrimaryCaseAuthority: false,
        finalRecommendationAuthority: false,
        diagnosticUiAuthority: false,
        servedSourceAuthority: false,
        renderedTargetAuthority: false,
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

      notes: normalizeNotes(state.notes),

      ...NO_CLAIMS
    };
  }

  function applySouthFields(state, report) {
    report.PACKET_NAME = getValue(report, "PACKET_NAME", REPORT_PACKET);
    report.TARGET_ROUTE = getValue(report, "TARGET_ROUTE", TARGET_ROUTE);
    report.DIAGNOSTIC_ROUTE = getValue(report, "DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE);
    report.DIAGNOSTIC_TIMESTAMP = getValue(report, "DIAGNOSTIC_TIMESTAMP", state.diagnosticTimestamp);

    report.SOUTH_CHRONOLOGY_STANDARD_ACTIVE = "true";
    report.SOUTH_RAIL_OBSERVED_BY_SOUTH = "true";
    report.SOUTH_RAIL_SOURCE_PATH_BY_SOUTH = "HEARTH.diagnosticSouth";
    report.SOUTH_RAIL_FILE = FILE;

    report.SOUTH_CONTRACT = CONTRACT;
    report.SOUTH_RECEIPT = RECEIPT;
    report.SOUTH_IMPLEMENTATION_CONTRACT = IMPLEMENTATION_CONTRACT;
    report.SOUTH_IMPLEMENTATION_RECEIPT = IMPLEMENTATION_RECEIPT;
    report.SOUTH_LEGACY_EXTERNAL_CONTRACT = LEGACY_EXTERNAL_CONTRACT;
    report.SOUTH_LEGACY_EXTERNAL_RECEIPT = LEGACY_EXTERNAL_RECEIPT;
    report.SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT = PREVIOUS_IMPLEMENTATION_CONTRACT;
    report.SOUTH_PREVIOUS_IMPLEMENTATION_RECEIPT = PREVIOUS_IMPLEMENTATION_RECEIPT;
    report.SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT = LINEAGE_IMPLEMENTATION_CONTRACT;
    report.SOUTH_BASELINE_IMPLEMENTATION_CONTRACT = BASELINE_IMPLEMENTATION_CONTRACT;

    report.SOUTH_EXPECTED_BY_NORTH_CONTRACT = EXPECTED_SOUTH_CONTRACT;
    report.SOUTH_EXPECTED_BY_NORTH_MATCHED = "true";

    report.NORTH_CHRONOLOGY_HUB_ACTIVE = getValue(report, "NORTH_CHRONOLOGY_HUB_ACTIVE", state.chronologyHubActive);
    report.NORTH_IS_HUB_ONLY = getValue(report, "NORTH_IS_HUB_ONLY", state.northIsHubOnly);
    report.EIGHT_WAY_PROBE_BRIDGE_ACTIVE = getValue(report, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", state.eightWayProbeBridgeActive);
    report.EIGHT_FILE_CHRONOLOGY_ACTIVE = getValue(report, "EIGHT_FILE_CHRONOLOGY_ACTIVE", state.eightFileChronologyActive);

    report.DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED = getValue(report, "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED", "false");
    report.RECEIVER_STILL_CALLS_NORTH_ONLY = getValue(report, "RECEIVER_STILL_CALLS_NORTH_ONLY", "true");

    report.RAIL_NORTH_FILE = getValue(report, "RAIL_NORTH_FILE", RAIL_NORTH_FILE);
    report.RAIL_EAST_FILE = getValue(report, "RAIL_EAST_FILE", RAIL_EAST_FILE);
    report.RAIL_WEST_FILE = getValue(report, "RAIL_WEST_FILE", RAIL_WEST_FILE);
    report.RAIL_SOUTH_FILE = getValue(report, "RAIL_SOUTH_FILE", RAIL_SOUTH_FILE);

    report.PROBE_NORTH_FILE = getValue(report, "PROBE_NORTH_FILE", PROBE_NORTH_FILE);
    report.PROBE_EAST_FILE = getValue(report, "PROBE_EAST_FILE", PROBE_EAST_FILE);
    report.PROBE_WEST_FILE = getValue(report, "PROBE_WEST_FILE", PROBE_WEST_FILE);
    report.PROBE_SOUTH_FILE = getValue(report, "PROBE_SOUTH_FILE", PROBE_SOUTH_FILE);

    report.EXPECTED_HTML_CONTRACT = getValue(report, "EXPECTED_HTML_CONTRACT", EXPECTED_HTML_CONTRACT);
    report.EXPECTED_INDEX_JS_CONTRACT = getValue(report, "EXPECTED_INDEX_JS_CONTRACT", EXPECTED_INDEX_JS_CONTRACT);
    report.EXPECTED_ROUTE_CONDUCTOR_CONTRACT = getValue(report, "EXPECTED_ROUTE_CONDUCTOR_CONTRACT", EXPECTED_ROUTE_CONDUCTOR_CONTRACT);
    report.EXPECTED_CONTROL_CONTRACT = getValue(report, "EXPECTED_CONTROL_CONTRACT", EXPECTED_CONTROL_CONTRACT);
    report.EXPECTED_CANVAS_CONTRACT = getValue(report, "EXPECTED_CANVAS_CONTRACT", EXPECTED_CANVAS_CONTRACT);
    report.EXPECTED_EAST_CONTRACT = getValue(report, "EXPECTED_EAST_CONTRACT", EXPECTED_EAST_CONTRACT);
    report.EXPECTED_WEST_CONTRACT = getValue(report, "EXPECTED_WEST_CONTRACT", EXPECTED_WEST_CONTRACT);
    report.EXPECTED_SOUTH_CONTRACT = getValue(report, "EXPECTED_SOUTH_CONTRACT", EXPECTED_SOUTH_CONTRACT);
    report.EXPECTED_PROBE_NORTH_CONTRACT = getValue(report, "EXPECTED_PROBE_NORTH_CONTRACT", EXPECTED_PROBE_NORTH_CONTRACT);
    report.EXPECTED_PROBE_EAST_CONTRACT = getValue(report, "EXPECTED_PROBE_EAST_CONTRACT", EXPECTED_PROBE_EAST_CONTRACT);
    report.EXPECTED_PROBE_WEST_CONTRACT = getValue(report, "EXPECTED_PROBE_WEST_CONTRACT", EXPECTED_PROBE_WEST_CONTRACT);
    report.EXPECTED_PROBE_SOUTH_CONTRACT = getValue(report, "EXPECTED_PROBE_SOUTH_CONTRACT", EXPECTED_PROBE_SOUTH_CONTRACT);

    if (getValue(report, "FIRST_CHRONOLOGY_FAILURE_OWNER", "") === "DIAGNOSTIC_RAIL_SOUTH") {
      report.SOUTH_CORRECTED_STALE_SELF_ABSENCE = "true";
      report.SOUTH_STALE_SELF_ABSENCE_REASON =
        "SOUTH_IS_EXECUTING_AND_RETURNING_PACKET_OUTPUT_TO_NORTH";
      state.southCorrectedStaleSelfAbsence = "true";
      addNote(state, "SOUTH_CORRECTED_STALE_SELF_ABSENCE_ON_RETURN");
    } else {
      report.SOUTH_CORRECTED_STALE_SELF_ABSENCE = "false";
    }

    report.SOUTH_ALIAS_PUBLISH_STATUS = "ALL_STANDARD_SOUTH_ALIASES_PUBLISHED";
    report.SOUTH_CHRONOLOGY_CONFORMANCE_STATUS =
      "SOUTH_CHRONOLOGY_PACKET_OUTPUT_CONFORMANCE_COMPLETE";
    report.SOUTH_PACKET_OUTPUT_AUTHORITY = "true";
    report.SOUTH_PACKET_FORMATTING_AUTHORITY = "true";
    report.SOUTH_FINAL_PRIMARY_CASE_AUTHORITY = "false";
    report.SOUTH_FINAL_RECOMMENDATION_AUTHORITY = "false";
    report.SOUTH_DIAGNOSTIC_UI_AUTHORITY = "false";
    report.SOUTH_PRODUCTION_MUTATION_AUTHORIZED = "false";
    report.SOUTH_HEARTH_REPAIR_AUTHORIZED = "false";
    report.SOUTH_RUNTIME_RESTART_AUTHORIZED = "false";
    report.SOUTH_CANVAS_RELEASE_AUTHORIZED = "false";
    report.SOUTH_MACRO_WEST_RELEASE_AUTHORIZED = "false";
    report.SOUTH_CANVAS_DRAWING_AUTHORITY = "false";
    report.SOUTH_CONTROL_IMPLEMENTATION_AUTHORITY = "false";
    report.SOUTH_TERRAIN_TRUTH_AUTHORITY = "false";
    report.SOUTH_HYDROLOGY_TRUTH_AUTHORITY = "false";
    report.SOUTH_MATERIAL_TRUTH_AUTHORITY = "false";

    for (const [key, value] of Object.entries(NO_CLAIMS)) report[key] = String(value);
    for (const [key, value] of Object.entries(UPPER_NO_CLAIMS)) report[key] = String(value);

    const currentNotes = normalizeNotes(
      getValue(report, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(report, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      state.notes
    );

    report.SECONDARY_EVIDENCE_NOTES = currentNotes.join(" | ") || "none";
    report.NORTH_SECONDARY_EVIDENCE_NOTES = report.SECONDARY_EVIDENCE_NOTES;

    return report;
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

      "SOUTH_CHRONOLOGY_STANDARD_ACTIVE",
      "SOUTH_RAIL_OBSERVED_BY_SOUTH",
      "SOUTH_RAIL_SOURCE_PATH_BY_SOUTH",
      "SOUTH_RAIL_FILE",
      "SOUTH_CONTRACT",
      "SOUTH_RECEIPT",
      "SOUTH_IMPLEMENTATION_CONTRACT",
      "SOUTH_IMPLEMENTATION_RECEIPT",
      "SOUTH_LEGACY_EXTERNAL_CONTRACT",
      "SOUTH_LEGACY_EXTERNAL_RECEIPT",
      "SOUTH_EXPECTED_BY_NORTH_CONTRACT",
      "SOUTH_EXPECTED_BY_NORTH_MATCHED",
      "SOUTH_ALIAS_PUBLISH_STATUS",
      "SOUTH_CHRONOLOGY_CONFORMANCE_STATUS",
      "SOUTH_CORRECTED_STALE_SELF_ABSENCE",
      "SOUTH_STALE_SELF_ABSENCE_REASON",

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

      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_WEST_FILE",
      "RAIL_SOUTH_FILE",
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

      "CONTROL_FILE",
      "CONTROL_FILE_STATUS",
      "CONTROL_FILE_LOADED",
      "CONTROL_GLOBAL_PRESENT",
      "CONTROL_RECEIPT_PRESENT",
      "CONTROL_HANDSHAKE_STATUS",
      "MOTION_TOUCH_STATUS",
      "DRAG_STATUS",
      "VIEW_CONTROL_STATUS",
      "VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS",

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

      "SOUTH_OUTPUT_COMPLETE",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_OUTPUT_VALID",
      "SOUTH_OUTPUT_SCHEMA_VALID",
      "SOUTH_MEANING_PRESERVED",
      "SOUTH_SCHEMA_CONFORMANCE_STATUS",
      "SOUTH_SCHEMA_CONFORMANCE_REASON",
      "SOUTH_PACKET_TEXT_SOURCE",

      "SECONDARY_EVIDENCE_NOTES",
      "NORTH_SECONDARY_EVIDENCE_NOTES",
      "SOUTH_SECONDARY_OUTPUT_NOTES",
      "SOUTH_VERDICT",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

    for (const key of priority.concat(Object.keys(report || {}))) {
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(key);
    }

    return out;
  }

  function composePacketText(report) {
    return orderedFields(report)
      .map((key) => line(key, getRaw(report, key, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("SOUTH_CONTRACT", getValue(report, "SOUTH_CONTRACT", CONTRACT)),
      line("SOUTH_IMPLEMENTATION_CONTRACT", getValue(report, "SOUTH_IMPLEMENTATION_CONTRACT", IMPLEMENTATION_CONTRACT)),
      line("SOUTH_RAIL_OBSERVED_BY_SOUTH", getValue(report, "SOUTH_RAIL_OBSERVED_BY_SOUTH", "true")),
      line("SOUTH_ALIAS_PUBLISH_STATUS", getValue(report, "SOUTH_ALIAS_PUBLISH_STATUS", "UNKNOWN")),
      line("SOUTH_CHRONOLOGY_CONFORMANCE_STATUS", getValue(report, "SOUTH_CHRONOLOGY_CONFORMANCE_STATUS", "UNKNOWN")),
      line("SOUTH_CORRECTED_STALE_SELF_ABSENCE", getValue(report, "SOUTH_CORRECTED_STALE_SELF_ABSENCE", "false")),
      line("SOUTH_OUTPUT_STATUS", getValue(report, "SOUTH_OUTPUT_STATUS", "UNKNOWN")),
      line("SOUTH_MEANING_PRESERVED", getValue(report, "SOUTH_MEANING_PRESERVED", "UNKNOWN")),
      line("PRIMARY_CASE", getValue(report, "PRIMARY_CASE", "UNKNOWN")),
      line("CALIBRATION_STATUS", getValue(report, "CALIBRATION_STATUS", "UNKNOWN")),
      line("RECOMMENDED_NEXT_OWNER", getValue(report, "RECOMMENDED_NEXT_OWNER", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_ACTION", getValue(report, "RECOMMENDED_NEXT_ACTION", "UNKNOWN"))
    ].join("\n");
  }

  function composeSouthReport(input = {}, options = {}) {
    const state = makeState(input, options);

    try {
      const sourceReport = clonePlain(state.currentReport || {});
      let report = clonePlain(sourceReport);

      report = applySouthFields(state, report);

      const northFieldsPresent = requiredNorthFieldsPresent(report);
      const meaningPreserved = northMeaningPreserved(sourceReport, report);

      state.southOutputComplete = northFieldsPresent ? "true" : "false";
      state.southOutputStatus = northFieldsPresent ? "COMPLETE" : "PARTIAL";
      state.southMeaningPreserved = meaningPreserved ? "true" : "false";
      state.southSchemaValid = "true";
      state.southChronologyConformanceStatus =
        "SOUTH_CHRONOLOGY_PACKET_OUTPUT_CONFORMANCE_COMPLETE";
      state.southAliasPublishStatus = "ALL_STANDARD_SOUTH_ALIASES_PUBLISHED";

      if (!northFieldsPresent) {
        addNote(state, "SOUTH_INPUT_NORTH_MEANING_FIELDS_INCOMPLETE");
      }

      if (!meaningPreserved) {
        addNote(state, "SOUTH_INPUT_NORTH_MEANING_FIELDS_NOT_PRESERVED");
      }

      report.SOUTH_OUTPUT_COMPLETE = state.southOutputComplete;
      report.SOUTH_OUTPUT_STATUS = state.southOutputStatus;
      report.SOUTH_OUTPUT_VALID = "VALID";
      report.SOUTH_OUTPUT_SCHEMA_VALID = state.southSchemaValid;
      report.SOUTH_MEANING_PRESERVED = state.southMeaningPreserved;
      report.SOUTH_SCHEMA_CONFORMANCE_STATUS = state.southChronologyConformanceStatus;
      report.SOUTH_SCHEMA_CONFORMANCE_REASON = northFieldsPresent
        ? "NORTH_MEANING_FIELDS_PRESENT_AND_PASSED_THROUGH"
        : "NORTH_MEANING_FIELDS_INCOMPLETE";
      report.SOUTH_PACKET_TEXT_SOURCE =
        "SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT_FORMATTER";

      addNote(state, "SOUTH_PACKET_OUTPUT_RETURNED_TO_NORTH_V10_CHRONOLOGY_HUB");
      addNote(state, "SOUTH_REPORT_OBJECT_FULL_PACKET_TEXT_AND_COMPACT_SUMMARY_AVAILABLE");

      report.SOUTH_SECONDARY_OUTPUT_NOTES = normalizeNotes(state.notes).join(" | ") || "none";

      state.reportObject = clonePlain(report);
      state.packetText = composePacketText(report);
      state.compactSummary = composeCompactSummary(report);

      report.SOUTH_VERDICT = buildSouthVerdict(state, report);

      state.reportObject = clonePlain(report);
      state.packetText = composePacketText(report);
      state.compactSummary = composeCompactSummary(report);
      state.southStatus = state.southOutputStatus;

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        legacyExternalContract: LEGACY_EXTERNAL_CONTRACT,
        legacyExternalReceipt: LEGACY_EXTERNAL_RECEIPT,

        SOUTH_STATUS: state.southStatus,
        SOUTH_CONTRACT: CONTRACT,
        SOUTH_RECEIPT: RECEIPT,
        SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
        SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
        SOUTH_LEGACY_EXTERNAL_CONTRACT: LEGACY_EXTERNAL_CONTRACT,
        SOUTH_LEGACY_EXTERNAL_RECEIPT: LEGACY_EXTERNAL_RECEIPT,
        SOUTH_OUTPUT_COMPLETE: state.southOutputComplete,
        SOUTH_OUTPUT_STATUS: state.southOutputStatus,
        SOUTH_OUTPUT_VALID: "VALID",
        SOUTH_OUTPUT_SCHEMA_VALID: state.southSchemaValid,
        SOUTH_MEANING_PRESERVED: state.southMeaningPreserved,
        SOUTH_CHRONOLOGY_CONFORMANCE_STATUS: state.southChronologyConformanceStatus,
        SOUTH_ALIAS_PUBLISH_STATUS: state.southAliasPublishStatus,

        REPORT_OBJECT: clonePlain(lastReport),
        FULL_PACKET_TEXT: lastPacketText,
        COMPACT_SUMMARY: lastCompactSummary,
        SOUTH_VERDICT: clonePlain(getSouthVerdict()),
        SOUTH_SECONDARY_OUTPUT_NOTES: normalizeNotes(state.notes).join(" | ") || "none",

        ...NO_CLAIMS
      };
    } catch (error) {
      state.southStatus = "FAILED";
      state.southOutputComplete = "false";
      state.southOutputStatus = "FAILED";
      state.southMeaningPreserved = "false";
      state.southSchemaValid = "false";
      state.southChronologyConformanceStatus = "SOUTH_CHRONOLOGY_PACKET_OUTPUT_FAILED";

      addNote(state, `SOUTH_COMPOSE_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);

      const fallbackReport = applySouthFields(state, {
        PACKET_NAME: REPORT_PACKET,
        TARGET_ROUTE,
        DIAGNOSTIC_ROUTE,
        DIAGNOSTIC_TIMESTAMP: nowIso(),
        NORTH_CONTRACT: state.northCurrentContract,
        NORTH_RECEIPT: state.northCurrentReceipt,
        PREVIOUS_NORTH_CONTRACT: state.northPreviousContract,
        PRIMARY_CASE: "INCONCLUSIVE_EVIDENCE",
        CALIBRATION_STATUS: "CALIBRATION_HOLD_SOUTH_PACKET_OUTPUT_ERROR",
        CALIBRATION_HOLD_REASON: "SOUTH_COMPOSE_ERROR",
        DIAGNOSTIC_RAIL_CLEAN: "false",
        CALIBRATION_POINT_REACHED: "false",
        RECOMMENDED_NEXT_OWNER: "DIAGNOSTIC_RAIL_SOUTH",
        RECOMMENDED_NEXT_FILE: FILE,
        RECOMMENDED_NEXT_ACTION: "REVIEW_SOUTH_CHRONOLOGY_PACKET_OUTPUT_ERROR"
      });

      fallbackReport.SOUTH_OUTPUT_COMPLETE = "false";
      fallbackReport.SOUTH_OUTPUT_STATUS = "FAILED";
      fallbackReport.SOUTH_OUTPUT_VALID = "UNREADABLE";
      fallbackReport.SOUTH_OUTPUT_SCHEMA_VALID = "false";
      fallbackReport.SOUTH_MEANING_PRESERVED = "false";
      fallbackReport.SOUTH_SCHEMA_CONFORMANCE_STATUS =
        "SOUTH_CHRONOLOGY_PACKET_OUTPUT_FAILED";
      fallbackReport.SOUTH_SCHEMA_CONFORMANCE_REASON = "SOUTH_COMPOSE_ERROR";
      fallbackReport.SOUTH_PACKET_TEXT_SOURCE = "SOUTH_ERROR_FALLBACK_PACKET";
      fallbackReport.SOUTH_SECONDARY_OUTPUT_NOTES = normalizeNotes(state.notes).join(" | ") || "none";

      state.reportObject = clonePlain(fallbackReport);
      state.packetText = composePacketText(fallbackReport);
      state.compactSummary = composeCompactSummary(fallbackReport);

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: bounded(error && error.message ? error.message : error, 1000),
        REPORT_OBJECT: clonePlain(lastReport),
        FULL_PACKET_TEXT: lastPacketText,
        COMPACT_SUMMARY: lastCompactSummary,
        SOUTH_VERDICT: clonePlain(getSouthVerdict()),
        ...NO_CLAIMS
      };
    }
  }

  function getSouthVerdict() {
    const state = lastState || makeState();
    const report = lastReport || state.reportObject || {};
    return buildSouthVerdict(state, report);
  }

  function getReport() {
    return clonePlain(lastReport || makeState().reportObject || {});
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    const report = getReport();
    return composePacketText(report);
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    const report = getReport();
    return composeCompactSummary(report);
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getReceiptLight() {
    const state = lastState || makeState();

    return {
      childRole: "SOUTH_CHRONOLOGY_STANDARD_PACKET_OUTPUT",
      role: "packet-output",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      legacyExternalContract: LEGACY_EXTERNAL_CONTRACT,
      legacyExternalReceipt: LEGACY_EXTERNAL_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      northCurrentContract: NORTH_CURRENT_CONTRACT,
      northCurrentReceipt: NORTH_CURRENT_RECEIPT,
      northPreviousContract: NORTH_PREVIOUS_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      southChronologyStandardActive: true,
      southRailObservedBySouth: true,
      southExpectedByNorthContract: EXPECTED_SOUTH_CONTRACT,
      southExpectedByNorthMatched: true,
      southAliasPublishStatus: "ALL_STANDARD_SOUTH_ALIASES_PUBLISHED",
      lastSouthStatus: state.southStatus,
      lastSouthOutputComplete: state.southOutputComplete,
      lastSouthOutputStatus: state.southOutputStatus,
      lastSouthMeaningPreserved: state.southMeaningPreserved,
      lastSouthSchemaValid: state.southSchemaValid,
      lastSouthChronologyConformanceStatus: state.southChronologyConformanceStatus,

      composeSouthReportApiAvailable: true,
      getSouthReceiptApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getSouthVerdictApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,

      packetFormattingAuthority: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      diagnosticUiAuthority: false,
      servedSourceAuthority: false,
      renderedTargetAuthority: false,
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

      railNorthFile: RAIL_NORTH_FILE,
      railEastFile: RAIL_EAST_FILE,
      railWestFile: RAIL_WEST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
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

      standardAliasesPublished: [
        "HEARTH.diagnosticSouth",
        "HEARTH.diagnosticRailSouth",
        "HEARTH.diagnosticSouthChronologyStandard",
        "HEARTH.diagnosticSouthPriorityControlQueenPacketConformance",
        "DEXTER_LAB.hearthDiagnosticSouth",
        "DEXTER_LAB.hearthDiagnosticRailSouth",
        "HEARTH_DIAGNOSTIC_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
        "HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD",
        "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE"
      ],

      southVerdict: clonePlain(getSouthVerdict()),
      reportObject: clonePlain(lastReport || {}),
      compactSummary: lastCompactSummary || "",
      fullPacketTextAvailable: Boolean(lastPacketText),

      supportsNorthV10ChronologyHub: true,
      supportsSouthChronologyObservation: true,
      supportsStandardAliasPublication: true,
      supportsLegacyV1ReceiptFields: true,
      supportsPriorityControlQueenV7Identity: true,
      supportsPacketOutputOnlyBoundary: true,
      supportsStaleSelfAbsenceCorrection: true,
      supportsNoClaimBoundary: true,

      ...NO_CLAIMS
    };
  }

  function makeOutputObject(state) {
    return {
      SOUTH_STATUS: state.southStatus,
      SOUTH_CONTRACT: CONTRACT,
      SOUTH_RECEIPT: RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      SOUTH_LEGACY_EXTERNAL_CONTRACT: LEGACY_EXTERNAL_CONTRACT,
      SOUTH_LEGACY_EXTERNAL_RECEIPT: LEGACY_EXTERNAL_RECEIPT,
      SOUTH_OUTPUT_COMPLETE: state.southOutputComplete,
      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
      SOUTH_OUTPUT_VALID: state.southOutputStatus === "FAILED" ? "UNREADABLE" : "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: state.southSchemaValid,
      SOUTH_MEANING_PRESERVED: state.southMeaningPreserved,
      SOUTH_CHRONOLOGY_CONFORMANCE_STATUS: state.southChronologyConformanceStatus,
      SOUTH_ALIAS_PUBLISH_STATUS: state.southAliasPublishStatus,
      REPORT_OBJECT: clonePlain(state.reportObject || {}),
      FULL_PACKET_TEXT: state.packetText || "",
      COMPACT_SUMMARY: state.compactSummary || "",
      SOUTH_VERDICT: buildSouthVerdict(state, state.reportObject || {}),
      ...NO_CLAIMS
    };
  }

  function publish(state) {
    const nextState = clonePlain(state || makeState());

    if (!nextState.reportObject || !Object.keys(nextState.reportObject).length) {
      const initialReport = applySouthFields(nextState, {
        PACKET_NAME: REPORT_PACKET,
        TARGET_ROUTE,
        DIAGNOSTIC_ROUTE,
        DIAGNOSTIC_TIMESTAMP: nowIso(),
        NORTH_CONTRACT: NORTH_CURRENT_CONTRACT,
        NORTH_RECEIPT: NORTH_CURRENT_RECEIPT,
        PREVIOUS_NORTH_CONTRACT: NORTH_PREVIOUS_CONTRACT,
        PRIMARY_CASE: "INITIALIZED",
        CALIBRATION_STATUS: "SOUTH_RAIL_READY_FOR_NORTH_CHRONOLOGY_CALL",
        CALIBRATION_HOLD_REASON: "NONE",
        DIAGNOSTIC_RAIL_CLEAN: "false",
        CALIBRATION_POINT_REACHED: "false",
        RECOMMENDED_NEXT_OWNER: "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB",
        RECOMMENDED_NEXT_FILE: RAIL_NORTH_FILE,
        RECOMMENDED_NEXT_ACTION: "RUN_DIAGNOSTIC_TO_CHRONOLOGIZE_SOUTH_RAIL"
      });

      initialReport.SOUTH_OUTPUT_COMPLETE = "false";
      initialReport.SOUTH_OUTPUT_STATUS = "READY";
      initialReport.SOUTH_OUTPUT_VALID = "VALID";
      initialReport.SOUTH_OUTPUT_SCHEMA_VALID = "true";
      initialReport.SOUTH_MEANING_PRESERVED = "UNKNOWN";
      initialReport.SOUTH_SCHEMA_CONFORMANCE_STATUS = "SOUTH_READY_AWAITING_NORTH_PACKET";
      initialReport.SOUTH_SCHEMA_CONFORMANCE_REASON = "INITIAL_PUBLICATION_ONLY";
      initialReport.SOUTH_PACKET_TEXT_SOURCE = "SOUTH_INITIAL_READY_PACKET";

      nextState.reportObject = initialReport;
      nextState.packetText = composePacketText(initialReport);
      nextState.compactSummary = composeCompactSummary(initialReport);
      nextState.southStatus = "READY";
      nextState.southOutputStatus = "READY";
      nextState.southSchemaValid = "true";
      nextState.southAliasPublishStatus = "ALL_STANDARD_SOUTH_ALIASES_PUBLISHED";
    }

    nextState.southAliasPublishStatus = "ALL_STANDARD_SOUTH_ALIASES_PUBLISHED";

    lastState = clonePlain(nextState);
    lastReport = clonePlain(nextState.reportObject || {});
    lastPacketText = nextState.packetText || composePacketText(lastReport);
    lastCompactSummary = nextState.compactSummary || composeCompactSummary(lastReport);
    lastOutput = makeOutputObject(nextState);

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticSouth = api;
    root.HEARTH.diagnosticRailSouth = api;
    root.HEARTH.diagnosticSouthChronologyStandard = api;
    root.HEARTH.diagnosticSouthPriorityControlQueenPacketConformance = api;
    root.HEARTH.diagnosticSouthReportPacketOutput = api;

    root.DEXTER_LAB.hearthDiagnosticSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthChronologyStandard = api;
    root.DEXTER_LAB.hearthDiagnosticSouthPriorityControlQueenPacketConformance = api;

    root.HEARTH_DIAGNOSTIC_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_REPORT_PACKET_OUTPUT = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_SOUTH_OUTPUT = clonePlain(lastOutput);
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_OUTPUT = clonePlain(lastOutput);
    root.HEARTH_DIAGNOSTIC_SOUTH_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_PACKET_TEXT = lastPacketText;

    root.HEARTH.diagnosticSouthReceipt = getReceipt();
    root.HEARTH.diagnosticRailSouthReceipt = getReceipt();
    root.HEARTH.diagnosticSouthReport = clonePlain(lastReport);
    root.HEARTH.diagnosticRailSouthReport = clonePlain(lastReport);
    root.HEARTH.diagnosticSouthOutput = clonePlain(lastOutput);
    root.HEARTH.diagnosticRailSouthOutput = clonePlain(lastOutput);
  }

  api = {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    legacyExternalContract: LEGACY_EXTERNAL_CONTRACT,
    legacyExternalReceipt: LEGACY_EXTERNAL_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    northCurrentContract: NORTH_CURRENT_CONTRACT,
    northCurrentReceipt: NORTH_CURRENT_RECEIPT,
    northPreviousContract: NORTH_PREVIOUS_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
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
    getSouthReceipt: getReceipt,
    getReceipt,
    getReceiptLight,
    getSouthVerdict,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,

    supportsNorthV10ChronologyHub: true,
    supportsSouthChronologyObservation: true,
    supportsStandardAliasPublication: true,
    supportsLegacyV1ReceiptFields: true,
    supportsPriorityControlQueenV7Identity: true,
    supportsPacketOutputOnlyBoundary: true,
    supportsStaleSelfAbsenceCorrection: true,
    supportsNoClaimBoundary: true,

    packetFormattingAuthority: true,
    finalPrimaryCaseAuthority: false,
    finalRecommendationAuthority: false,
    diagnosticUiAuthority: false,
    servedSourceAuthority: false,
    renderedTargetAuthority: false,
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
  };

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
