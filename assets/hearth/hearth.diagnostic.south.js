// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic probe SOUTH child only.
// Purpose:
// - Provide the missing eighth chronology file for NORTH v10.
// - Preserve NORTH as chronology hub only.
// - Inspect SOUTH packet-output meaning preservation without mutating production.
// - Verify that SOUTH report output preserves North chronology fields, verdict fields, recommendation fields, no-claim boundaries, and packet text surfaces.
// - Distinguish a missing PROBE_SOUTH file from an actual SOUTH packet-meaning defect.
// - Return a chronology-valid probe result so NORTH can move past file-missing diagnosis.
// - If packet meaning is defective, identify SOUTH rail as the diagnostic repair target.
// - If packet meaning is preserved, allow NORTH to continue to post-chronology zone adjudication.
// Does not own:
// - diagnostic UI shell
// - production repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - Macro West release
// - route-conductor implementation
// - control implementation
// - terrain truth
// - hydrology truth
// - material truth
// - final visual pass
// - F13 claim
// - F21 latch

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";

  const VERSION =
    "2026-06-05.hearth-diagnostic-probe-south-packet-meaning-file-composition-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const PARENT_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PARENT_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_SOUTH_FILE = FILE;

  const EXPECTED_SOUTH_RAIL_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const SOUTH_RAIL_EXTERNAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

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

  const REQUIRED_NORTH_MEANING_FIELDS = Object.freeze([
    "PACKET_NAME",
    "TARGET_ROUTE",
    "DIAGNOSTIC_ROUTE",
    "DIAGNOSTIC_TIMESTAMP",
    "NORTH_CONTRACT",
    "NORTH_RECEIPT",
    "PREVIOUS_NORTH_CONTRACT",
    "PRIMARY_CASE",
    "CALIBRATION_STATUS",
    "CALIBRATION_HOLD_REASON",
    "DIAGNOSTIC_RAIL_CLEAN",
    "CALIBRATION_POINT_REACHED",
    "RECOMMENDED_NEXT_OWNER",
    "RECOMMENDED_NEXT_FILE",
    "RECOMMENDED_NEXT_ACTION"
  ]);

  const CHRONOLOGY_FIELDS = Object.freeze([
    "NORTH_CHRONOLOGY_HUB_ACTIVE",
    "NORTH_IS_HUB_ONLY",
    "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
    "EIGHT_FILE_CHRONOLOGY_ACTIVE",
    "CHRONOLOGY_COMPLETION_STATUS",
    "FIRST_CHRONOLOGY_FAILURE_OWNER",
    "FIRST_CHRONOLOGY_FAILURE_FILE",
    "FIRST_CHRONOLOGY_FAILURE_CLASS",
    "FIRST_CHRONOLOGY_FAILURE_REASON",
    "ZONE_OF_INFLICTION_OWNER",
    "ZONE_OF_INFLICTION_FILE",
    "ZONE_OF_INFLICTION_CLASS",
    "ZONE_OF_INFLICTION_REASON",
    "CHRONOLOGY_SEQUENCE_TEXT"
  ]);

  const SOUTH_MEANING_FIELDS = Object.freeze([
    "SOUTH_OUTPUT_STATUS",
    "SOUTH_OUTPUT_COMPLETE",
    "SOUTH_OUTPUT_VALID",
    "SOUTH_OUTPUT_SCHEMA_VALID",
    "SOUTH_MEANING_PRESERVED",
    "SOUTH_SCHEMA_CONFORMANCE_STATUS",
    "SOUTH_SCHEMA_CONFORMANCE_REASON",
    "SOUTH_PACKET_TEXT_SOURCE",
    "SOUTH_SECONDARY_OUTPUT_NOTES"
  ]);

  const NO_CLAIM_FIELDS = Object.freeze([
    "f13Claimed",
    "f21EligibleForNorth",
    "f21ClaimedByDiagnosticRail",
    "readyTextAllowed",
    "readyTextClaimedByDiagnosticRail",
    "visualPassClaimed",
    "generatedImage",
    "graphicBox",
    "webGL"
  ]);

  const UPPER_NO_CLAIM_FIELDS = Object.freeze([
    "F13_CLAIMED",
    "F21_ELIGIBLE_FOR_NORTH",
    "F21_CLAIMED_BY_DIAGNOSTIC_RAIL",
    "READY_TEXT_ALLOWED",
    "READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL",
    "VISUAL_PASS_CLAIMED",
    "GENERATED_IMAGE",
    "GRAPHIC_BOX",
    "WEBGL"
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

  const root = typeof window !== "undefined" ? window : globalThis;

  let lastState = null;
  let lastReport = null;
  let lastReceipt = null;
  let api = null;

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
      const joined = value.map((entry) => packetValue(entry, "")).filter(Boolean).join(" | ");
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

  function unknownish(value) {
    const text = safeString(value).trim();
    return (
      text === "" ||
      text === "UNKNOWN" ||
      text === "NONE" ||
      text === "NOT_FOUND" ||
      text === "UNREADABLE" ||
      text === "INACCESSIBLE" ||
      text === "INSUFFICIENT_EVIDENCE"
    );
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

  function getPath(source, path, fallback = undefined) {
    if (!isObject(source)) return fallback;

    const parts = safeString(path).split(".");
    let cursor = source;

    for (const part of parts) {
      if (!isObject(cursor) && !Array.isArray(cursor)) return fallback;
      if (cursor[part] === undefined || cursor[part] === null) return fallback;
      cursor = cursor[part];
    }

    return cursor === undefined || cursor === null ? fallback : cursor;
  }

  function firstKnown(...values) {
    for (const value of values) {
      if (!unknownish(value)) return value;
    }
    return "UNKNOWN";
  }

  function trueish(value) {
    return value === true || value === "true" || value === "TRUE" || value === 1 || value === "1";
  }

  function falseish(value) {
    return value === false || value === "false" || value === "FALSE" || value === 0 || value === "0";
  }

  function boolText(value) {
    return value ? "true" : "false";
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

  function getReceiptFromAuthority(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getProbeSouthReceipt",
      "getReceiptLight",
      "getReceipt",
      "getSouthReceipt",
      "getReport",
      "getState",
      "getStatus"
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
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) {
      return authority;
    }

    return null;
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

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function discoverSouthRail() {
    return findFirstPath([
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH_DIAGNOSTIC_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "DEXTER_LAB.hearthDiagnosticSouth",
      "DEXTER_LAB.hearthDiagnosticRailSouth"
    ]);
  }

  function resolveInputReport(input) {
    const candidates = [
      getRaw(input, "currentReport", null),
      getRaw(input, "report", null),
      getRaw(input, "REPORT_OBJECT", null),
      getRaw(input, "northReport", null),
      getRaw(input, "packet", null),
      getRaw(input, "currentPacket", null),
      getPath(input, "options.currentReport", null),
      root.HEARTH_DIAGNOSTIC_NORTH_REPORT,
      root.HEARTH_DIAGNOSTIC_RAIL_REPORT,
      root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT,
      root.HEARTH_DIAGNOSTIC_NORTH_EIGHT_WAY_PROBE_BRIDGE_REPORT
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return clonePlain(candidate);
    }

    return {};
  }

  function resolveChronology(input, report) {
    const candidates = [
      getRaw(input, "chronology", null),
      getRaw(input, "CHRONOLOGY_SEQUENCE", null),
      getRaw(report, "CHRONOLOGY_SEQUENCE", null),
      getPath(input, "northVerdict.chronology", null),
      getPath(input, "currentReport.NORTH_VERDICT.chronology", null),
      getPath(report, "NORTH_VERDICT.chronology", null),
      getPath(root.HEARTH_DIAGNOSTIC_NORTH_VERDICT || {}, "chronology", null),
      getPath(root.HEARTH_DIAGNOSTIC_RAIL_VERDICT || {}, "chronology", null)
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return clonePlain(candidate);
    }

    return [];
  }

  function resolveEvidenceByStep(input) {
    const candidates = [
      getRaw(input, "evidenceByStep", null),
      getRaw(input, "stepEvidence", null),
      getRaw(input, "chronologyEvidence", null),
      getPath(input, "options.evidenceByStep", null)
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return clonePlain(candidate);
    }

    return {};
  }

  function findChronologyStep(chronology, id) {
    const target = safeString(id).toUpperCase();

    for (const step of chronology || []) {
      if (!isObject(step)) continue;

      const stepId = safeString(step.id || step.ID || step.key || step.KEY).toUpperCase();
      if (stepId === target) return step;
    }

    return null;
  }

  function readStepEvidence(evidenceByStep, id) {
    if (!isObject(evidenceByStep)) return {};

    const variants = [
      id,
      safeString(id).toLowerCase(),
      safeString(id).toUpperCase(),
      safeString(id).replace(/_/g, "-"),
      safeString(id).replace(/_/g, "").toLowerCase()
    ];

    for (const key of variants) {
      const value = getRaw(evidenceByStep, key, null);
      if (isObject(value)) return clonePlain(value);
    }

    return {};
  }

  function resolveSouthOutput(input, evidenceByStep, southAuthority) {
    const railSouthEvidence = readStepEvidence(evidenceByStep, "RAIL_SOUTH");

    const candidates = [
      getRaw(input, "southOutput", null),
      getRaw(input, "southReport", null),
      getRaw(input, "southRailOutput", null),
      getRaw(input, "SOUTH_OUTPUT", null),
      railSouthEvidence,
      getRaw(railSouthEvidence, "output", null),
      getRaw(railSouthEvidence, "report", null),
      getRaw(railSouthEvidence, "REPORT_OBJECT", null),
      root.HEARTH_DIAGNOSTIC_SOUTH_OUTPUT,
      root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_OUTPUT,
      root.HEARTH_DIAGNOSTIC_SOUTH_REPORT,
      root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT
    ];

    const authorityReceipt = getReceiptFromAuthority(southAuthority) || {};
    candidates.push(authorityReceipt);

    for (const candidate of candidates) {
      if (isObject(candidate)) return clonePlain(candidate);
    }

    return {};
  }

  function resolveSouthReportObject(southOutput) {
    const candidates = [
      getRaw(southOutput, "REPORT_OBJECT", null),
      getRaw(southOutput, "reportObject", null),
      getRaw(southOutput, "report", null),
      getPath(southOutput, "output.REPORT_OBJECT", null),
      getPath(southOutput, "output.reportObject", null),
      getPath(southOutput, "state.reportObject", null),
      root.HEARTH_DIAGNOSTIC_SOUTH_REPORT,
      root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return clonePlain(candidate);
    }

    return {};
  }

  function inspectRequiredFields(report) {
    const missing = [];

    for (const field of REQUIRED_NORTH_MEANING_FIELDS) {
      const value = getValue(report, field, "UNKNOWN");
      if (unknownish(value)) missing.push(field);
    }

    return {
      missing,
      status: missing.length ? "MISSING_REQUIRED_NORTH_MEANING_FIELDS" : "REQUIRED_NORTH_MEANING_FIELDS_PRESENT"
    };
  }

  function inspectChronologyFields(report) {
    const present = [];
    const missing = [];

    for (const field of CHRONOLOGY_FIELDS) {
      const value = getValue(report, field, "UNKNOWN");
      if (unknownish(value)) missing.push(field);
      else present.push(field);
    }

    return {
      present,
      missing,
      status: present.length
        ? missing.length
          ? "CHRONOLOGY_FIELDS_PARTIAL"
          : "CHRONOLOGY_FIELDS_PRESENT"
        : "CHRONOLOGY_FIELDS_NOT_PROJECTED_IN_PACKET"
    };
  }

  function inspectNoClaims(...sources) {
    const trueFields = [];
    const missingFields = [];

    for (const field of NO_CLAIM_FIELDS.concat(UPPER_NO_CLAIM_FIELDS)) {
      let found = false;

      for (const source of sources) {
        if (!isObject(source)) continue;

        const raw = getRaw(source, field, undefined);
        if (raw === undefined || raw === null || raw === "") continue;

        found = true;

        if (trueish(raw)) {
          trueFields.push(field);
        }
      }

      if (!found) missingFields.push(field);
    }

    return {
      status: trueFields.length
        ? "NO_CLAIM_BOUNDARY_BROKEN"
        : missingFields.length
          ? "NO_CLAIM_BOUNDARY_PRESERVED_WITH_MISSING_PRINT_FIELDS"
          : "NO_CLAIM_BOUNDARY_PRESERVED",
      trueFields,
      missingFields,
      valid: trueFields.length === 0
    };
  }

  function compareMeaningFields(northReport, southReport) {
    const mismatches = [];
    const compared = [];

    if (!isObject(northReport) || !isObject(southReport) || !Object.keys(southReport).length) {
      return {
        status: "SOUTH_REPORT_OBJECT_NOT_AVAILABLE_FOR_COMPARISON",
        mismatches,
        compared
      };
    }

    const fields = REQUIRED_NORTH_MEANING_FIELDS.concat(CHRONOLOGY_FIELDS);

    for (const field of fields) {
      const northValue = getValue(northReport, field, "UNKNOWN");
      const southValue = getValue(southReport, field, "UNKNOWN");

      if (unknownish(northValue) && unknownish(southValue)) continue;

      compared.push(field);

      if (northValue !== southValue && !unknownish(northValue) && !unknownish(southValue)) {
        mismatches.push(`${field}:${northValue}!=${southValue}`);
      }
    }

    return {
      status: mismatches.length
        ? "SOUTH_REPORT_DIFFERS_FROM_NORTH_MEANING_FIELDS"
        : compared.length
          ? "SOUTH_REPORT_MATCHES_AVAILABLE_NORTH_MEANING_FIELDS"
          : "NO_COMPARABLE_MEANING_FIELDS",
      mismatches,
      compared
    };
  }

  function inspectSouthOutputStatus(report, southOutput, southReportObject) {
    const status = firstKnown(
      getValue(report, "SOUTH_OUTPUT_STATUS", "UNKNOWN"),
      getValue(southOutput, "SOUTH_OUTPUT_STATUS", "UNKNOWN"),
      getPath(southOutput, "output.SOUTH_OUTPUT_STATUS", "UNKNOWN"),
      getValue(southReportObject, "SOUTH_OUTPUT_STATUS", "UNKNOWN")
    );

    const preserved = firstKnown(
      getValue(report, "SOUTH_MEANING_PRESERVED", "UNKNOWN"),
      getValue(southOutput, "SOUTH_MEANING_PRESERVED", "UNKNOWN"),
      getPath(southOutput, "output.SOUTH_MEANING_PRESERVED", "UNKNOWN"),
      getValue(southReportObject, "SOUTH_MEANING_PRESERVED", "UNKNOWN")
    );

    const schemaStatus = firstKnown(
      getValue(report, "SOUTH_SCHEMA_CONFORMANCE_STATUS", "UNKNOWN"),
      getValue(southOutput, "SOUTH_SCHEMA_CONFORMANCE_STATUS", "UNKNOWN"),
      getPath(southOutput, "output.SOUTH_SCHEMA_CONFORMANCE_STATUS", "UNKNOWN"),
      getValue(southReportObject, "SOUTH_SCHEMA_CONFORMANCE_STATUS", "UNKNOWN")
    );

    const packetText = firstKnown(
      getValue(southOutput, "FULL_PACKET_TEXT", "UNKNOWN"),
      getPath(southOutput, "output.FULL_PACKET_TEXT", "UNKNOWN"),
      getValue(southOutput, "packetText", "UNKNOWN")
    );

    const compactSummary = firstKnown(
      getValue(southOutput, "COMPACT_SUMMARY", "UNKNOWN"),
      getPath(southOutput, "output.COMPACT_SUMMARY", "UNKNOWN"),
      getValue(southOutput, "compactSummary", "UNKNOWN")
    );

    const hasReportObject = Object.keys(southReportObject || {}).length > 0;

    const badStatus =
      safeString(status).includes("PARTIAL") ||
      safeString(status).includes("FAILED") ||
      safeString(status).includes("MISSING") ||
      safeString(status).includes("UNREADABLE");

    const preservedFalse = falseish(preserved);

    return {
      status,
      preserved,
      schemaStatus,
      fullPacketTextPresent: !unknownish(packetText),
      compactSummaryPresent: !unknownish(compactSummary),
      reportObjectPresent: hasReportObject,
      outputLooksPartial: badStatus || preservedFalse,
      statusClass: badStatus || preservedFalse
        ? "SOUTH_OUTPUT_MEANING_GAP_DETECTED"
        : "SOUTH_OUTPUT_MEANING_NOT_FLAGGED_AS_PARTIAL"
    };
  }

  function makeState() {
    return {
      probeSouthStatus: "READY",
      probeSouthRunComplete: "false",
      probeSouthRunStatus: "NOT_RUN",
      probeSouthContract: CONTRACT,
      probeSouthReceipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      timestamp: nowIso(),

      parentNorthContract: PARENT_NORTH_CONTRACT,
      parentNorthReceipt: PARENT_NORTH_RECEIPT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,

      southRailObserved: false,
      southRailSourcePath: "NONE",
      southRailContract: "UNKNOWN",
      southRailReceipt: "UNKNOWN",

      currentReportObserved: false,
      chronologyObserved: false,
      chronologyStepObserved: false,
      chronologySouthStepStatus: "UNKNOWN",

      requiredFieldStatus: "UNKNOWN",
      missingRequiredFields: [],
      chronologyFieldStatus: "UNKNOWN",
      missingChronologyFields: [],
      noClaimBoundaryStatus: "UNKNOWN",
      noClaimBoundaryValid: false,
      noClaimTrueFields: [],
      noClaimMissingFields: [],

      southOutputStatusObserved: "UNKNOWN",
      southMeaningPreservedObserved: "UNKNOWN",
      southSchemaConformanceObserved: "UNKNOWN",
      southReportObjectPresent: false,
      southFullPacketTextPresent: false,
      southCompactSummaryPresent: false,
      southOutputStatusClass: "UNKNOWN",

      packetMeaningStatus: "UNKNOWN",
      packetMeaningPreserved: "false",
      packetMeaningFailureClass: "UNKNOWN",
      packetMeaningFailureReason: "UNKNOWN",

      recommendedNextOwner: "UNKNOWN",
      recommendedNextFile: "UNKNOWN",
      recommendedNextAction: "UNKNOWN",

      primaryCase: "INCONCLUSIVE_EVIDENCE",
      calibrationStatus: "CALIBRATION_HOLD_PROBE_SOUTH_NOT_RUN",
      calibrationHoldReason: "PROBE_SOUTH_HAS_NOT_RUN",
      diagnosticRailClean: "false",
      calibrationPointReached: "false",

      notes: [
        "PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_ACTIVE",
        "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
        "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
        "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21"
      ],

      report: {},
      receipt: {},

      ...NO_CLAIMS
    };
  }

  function decideNext(state, sourceReport) {
    const currentNextOwner = getValue(sourceReport, "RECOMMENDED_NEXT_OWNER", "UNKNOWN");
    const currentNextFile = getValue(sourceReport, "RECOMMENDED_NEXT_FILE", "UNKNOWN");
    const currentNextAction = getValue(sourceReport, "RECOMMENDED_NEXT_ACTION", "UNKNOWN");

    if (state.packetMeaningStatus !== "PACKET_MEANING_PRESERVED") {
      state.recommendedNextOwner = "DIAGNOSTIC_RAIL_SOUTH";
      state.recommendedNextFile = RAIL_SOUTH_FILE;
      state.recommendedNextAction =
        "RENEW_SOUTH_RAIL_TO_CHRONOLOGY_HUB_STANDARD_SO_PACKET_MEANING_FIELDS_AND_NORTH_V10_CHRONOLOGY_FIELDS_ARE_PRESERVED";
      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_HOLD_SOUTH_PACKET_MEANING";
      state.calibrationHoldReason = state.packetMeaningFailureReason;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      return;
    }

    if (currentNextFile === PROBE_SOUTH_FILE || currentNextOwner === "DIAGNOSTIC_PROBE_SOUTH") {
      state.recommendedNextOwner = "DIAGNOSTIC_NORTH_CHRONOLOGY_HUB";
      state.recommendedNextFile = RAIL_NORTH_FILE;
      state.recommendedNextAction =
        "RERUN_DIAGNOSTIC_AFTER_PROBE_SOUTH_COMPLETES_SO_NORTH_CAN_SELECT_POST_CHRONOLOGY_ZONE_OF_INFLICTION";
      state.primaryCase = getValue(sourceReport, "PRIMARY_CASE", "INCONCLUSIVE_EVIDENCE");
      state.calibrationStatus = "CALIBRATION_HOLD_POST_CHRONOLOGY_NORTH_ADJUDICATION";
      state.calibrationHoldReason =
        "PROBE_SOUTH_COMPLETED_PACKET_MEANING_CHECK_AND_REMOVED_MISSING_EIGHTH_FILE_AS_PRIMARY_FAILURE";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      return;
    }

    state.recommendedNextOwner = currentNextOwner;
    state.recommendedNextFile = currentNextFile;
    state.recommendedNextAction = currentNextAction;
    state.primaryCase = getValue(sourceReport, "PRIMARY_CASE", "INCONCLUSIVE_EVIDENCE");
    state.calibrationStatus = getValue(sourceReport, "CALIBRATION_STATUS", "CALIBRATION_HOLD_POST_CHRONOLOGY_ADJUDICATION");
    state.calibrationHoldReason = getValue(sourceReport, "CALIBRATION_HOLD_REASON", "PACKET_MEANING_PRESERVED");
    state.diagnosticRailClean = getValue(sourceReport, "DIAGNOSTIC_RAIL_CLEAN", "false");
    state.calibrationPointReached = getValue(sourceReport, "CALIBRATION_POINT_REACHED", "false");
  }

  function buildReport(state) {
    const notes = normalizeNotes(state.notes).join(" | ") || "none";

    return {
      PACKET_NAME: REPORT_PACKET,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: state.timestamp,

      PROBE_SOUTH_STATUS: state.probeSouthStatus,
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE: FILE,

      PARENT_NORTH_CONTRACT: state.parentNorthContract,
      PARENT_NORTH_RECEIPT: state.parentNorthReceipt,
      PREVIOUS_NORTH_CONTRACT: state.previousNorthContract,

      NORTH_CHRONOLOGY_HUB_ACTIVE: "true",
      NORTH_IS_HUB_ONLY: "true",
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: "false",
      EIGHT_FILE_CHRONOLOGY_ACTIVE: "true",

      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: "false",
      RECEIVER_STILL_CALLS_NORTH_ONLY: "true",

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_SOUTH_RAIL_CONTRACT,
      SOUTH_RAIL_EXTERNAL_CONTRACT,

      PROBE_SOUTH_RUN_COMPLETE: state.probeSouthRunComplete,
      PROBE_SOUTH_RUN_STATUS: state.probeSouthRunStatus,

      SOUTH_RAIL_OBSERVED_BY_PROBE: boolText(state.southRailObserved),
      SOUTH_RAIL_SOURCE_PATH_BY_PROBE: state.southRailSourcePath,
      SOUTH_RAIL_CONTRACT_BY_PROBE: state.southRailContract,
      SOUTH_RAIL_RECEIPT_BY_PROBE: state.southRailReceipt,

      CURRENT_REPORT_OBSERVED_BY_PROBE: boolText(state.currentReportObserved),
      CHRONOLOGY_OBSERVED_BY_PROBE: boolText(state.chronologyObserved),
      CHRONOLOGY_SOUTH_STEP_OBSERVED_BY_PROBE: boolText(state.chronologyStepObserved),
      CHRONOLOGY_SOUTH_STEP_STATUS_BY_PROBE: state.chronologySouthStepStatus,

      NORTH_MEANING_FIELDS_STATUS: state.requiredFieldStatus,
      NORTH_MEANING_FIELDS_MISSING: state.missingRequiredFields.join(",") || "NONE",
      CHRONOLOGY_FIELDS_STATUS: state.chronologyFieldStatus,
      CHRONOLOGY_FIELDS_MISSING: state.missingChronologyFields.join(",") || "NONE",

      NO_CLAIM_BOUNDARY_STATUS: state.noClaimBoundaryStatus,
      NO_CLAIM_BOUNDARY_VALID: boolText(state.noClaimBoundaryValid),
      NO_CLAIM_TRUE_FIELDS: state.noClaimTrueFields.join(",") || "NONE",
      NO_CLAIM_MISSING_FIELDS: state.noClaimMissingFields.join(",") || "NONE",

      SOUTH_OUTPUT_STATUS_OBSERVED_BY_PROBE: state.southOutputStatusObserved,
      SOUTH_MEANING_PRESERVED_OBSERVED_BY_PROBE: state.southMeaningPreservedObserved,
      SOUTH_SCHEMA_CONFORMANCE_OBSERVED_BY_PROBE: state.southSchemaConformanceObserved,
      SOUTH_REPORT_OBJECT_PRESENT_BY_PROBE: boolText(state.southReportObjectPresent),
      SOUTH_FULL_PACKET_TEXT_PRESENT_BY_PROBE: boolText(state.southFullPacketTextPresent),
      SOUTH_COMPACT_SUMMARY_PRESENT_BY_PROBE: boolText(state.southCompactSummaryPresent),
      SOUTH_OUTPUT_STATUS_CLASS_BY_PROBE: state.southOutputStatusClass,

      PACKET_MEANING_STATUS: state.packetMeaningStatus,
      PACKET_MEANING_PRESERVED: state.packetMeaningPreserved,
      PACKET_MEANING_FAILURE_CLASS: state.packetMeaningFailureClass,
      PACKET_MEANING_FAILURE_REASON: state.packetMeaningFailureReason,

      PROBE_SOUTH_CHRONOLOGY_STEP_STATUS: "COMPLETE",
      PROBE_SOUTH_CHRONOLOGY_FAILURE: "false",
      PROBE_SOUTH_CHRONOLOGY_FAILURE_REASON: "NONE",

      PRIMARY_CASE: state.primaryCase,
      CALIBRATION_STATUS: state.calibrationStatus,
      CALIBRATION_HOLD_REASON: state.calibrationHoldReason,
      DIAGNOSTIC_RAIL_CLEAN: state.diagnosticRailClean,
      CALIBRATION_POINT_REACHED: state.calibrationPointReached,

      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notes,
      SECONDARY_EVIDENCE_NOTES: notes,

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

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function buildReceipt(state) {
    return {
      childRole: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      parentNorthContract: PARENT_NORTH_CONTRACT,
      parentNorthReceipt: PARENT_NORTH_RECEIPT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,

      railNorthFile: RAIL_NORTH_FILE,
      railEastFile: RAIL_EAST_FILE,
      railWestFile: RAIL_WEST_FILE,
      railSouthFile: RAIL_SOUTH_FILE,
      probeNorthFile: PROBE_NORTH_FILE,
      probeEastFile: PROBE_EAST_FILE,
      probeWestFile: PROBE_WEST_FILE,
      probeSouthFile: PROBE_SOUTH_FILE,

      expectedSouthRailContract: EXPECTED_SOUTH_RAIL_CONTRACT,
      southRailExternalContract: SOUTH_RAIL_EXTERNAL_CONTRACT,

      probeSouthRunComplete: state.probeSouthRunComplete,
      probeSouthRunStatus: state.probeSouthRunStatus,
      packetMeaningStatus: state.packetMeaningStatus,
      packetMeaningPreserved: state.packetMeaningPreserved,
      packetMeaningFailureClass: state.packetMeaningFailureClass,
      packetMeaningFailureReason: state.packetMeaningFailureReason,

      southRailObserved: state.southRailObserved,
      southRailSourcePath: state.southRailSourcePath,
      southRailContract: state.southRailContract,
      currentReportObserved: state.currentReportObserved,
      chronologyObserved: state.chronologyObserved,
      chronologyStepObserved: state.chronologyStepObserved,

      supportsNorthChronologyHubStandard: true,
      supportsProbeSouthChronologyCompletion: true,
      supportsSouthPacketMeaningInspection: true,
      supportsSouthRailOutputConformanceInspection: true,
      supportsNorthMeaningFieldPreservationInspection: true,
      supportsChronologyFieldPreservationInspection: true,
      supportsNoClaimBoundaryInspection: true,
      supportsPostChronologyZoneReturn: true,

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

  function publish(state) {
    lastState = clonePlain(state);
    lastReport = clonePlain(state.report || buildReport(state));
    lastReceipt = clonePlain(state.receipt || buildReceipt(state));

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;
    root.HEARTH.diagnosticProbeSouthPacketMeaningFileComposition = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticProbeSouthPacketMeaningFileComposition = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = clonePlain(lastReceipt);

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastReport);
  }

  function runProbeSouth(input = {}) {
    const state = makeState();

    try {
      const sourceReport = resolveInputReport(input);
      const chronology = resolveChronology(input, sourceReport);
      const evidenceByStep = resolveEvidenceByStep(input);
      const southRail = discoverSouthRail();
      const southOutput = resolveSouthOutput(input, evidenceByStep, southRail.value);
      const southReportObject = resolveSouthReportObject(southOutput);
      const southStep = findChronologyStep(chronology, "RAIL_SOUTH");

      state.probeSouthRunComplete = "true";
      state.probeSouthRunStatus = "COMPLETE";
      state.probeSouthStatus = "COMPLETE";

      state.currentReportObserved = Object.keys(sourceReport).length > 0;
      state.chronologyObserved = chronology.length > 0;
      state.chronologyStepObserved = Boolean(southStep);
      state.chronologySouthStepStatus = southStep ? packetValue(southStep.status || southStep.callStatus || "OBSERVED") : "NOT_OBSERVED";

      state.southRailObserved = Boolean(southRail.value);
      state.southRailSourcePath = southRail.path;

      const southRailReceipt = getReceiptFromAuthority(southRail.value) || {};
      state.southRailContract = firstKnown(
        getValue(southRailReceipt, "implementationContract", "UNKNOWN"),
        getValue(southRailReceipt, "contract", "UNKNOWN"),
        getValue(southRailReceipt, "CONTRACT", "UNKNOWN"),
        getValue(southRail.value || {}, "contract", "UNKNOWN")
      );
      state.southRailReceipt = firstKnown(
        getValue(southRailReceipt, "implementationReceipt", "UNKNOWN"),
        getValue(southRailReceipt, "receipt", "UNKNOWN"),
        getValue(southRailReceipt, "RECEIPT", "UNKNOWN"),
        getValue(southRail.value || {}, "receipt", "UNKNOWN")
      );

      if (state.southRailObserved) {
        addNote(state, `PROBE_SOUTH_OBSERVED_SOUTH_RAIL:${state.southRailSourcePath}`);
      } else {
        addNote(state, "PROBE_SOUTH_DID_NOT_OBSERVE_SOUTH_RAIL");
      }

      if (state.currentReportObserved) {
        addNote(state, "PROBE_SOUTH_CURRENT_NORTH_REPORT_OBSERVED");
      } else {
        addNote(state, "PROBE_SOUTH_CURRENT_NORTH_REPORT_NOT_OBSERVED");
      }

      if (state.chronologyObserved) {
        addNote(state, "PROBE_SOUTH_CHRONOLOGY_ARRAY_OBSERVED");
      } else {
        addNote(state, "PROBE_SOUTH_CHRONOLOGY_ARRAY_NOT_OBSERVED");
      }

      if (state.chronologyStepObserved) {
        addNote(state, `PROBE_SOUTH_RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED:${state.chronologySouthStepStatus}`);
      }

      const required = inspectRequiredFields(sourceReport);
      state.requiredFieldStatus = required.status;
      state.missingRequiredFields = required.missing;

      const chronologyFields = inspectChronologyFields(sourceReport);
      state.chronologyFieldStatus = chronologyFields.status;
      state.missingChronologyFields = chronologyFields.missing;

      const noClaims = inspectNoClaims(sourceReport, southOutput, southReportObject);
      state.noClaimBoundaryStatus = noClaims.status;
      state.noClaimBoundaryValid = noClaims.valid;
      state.noClaimTrueFields = noClaims.trueFields;
      state.noClaimMissingFields = noClaims.missingFields;

      const southOutputStatus = inspectSouthOutputStatus(sourceReport, southOutput, southReportObject);
      state.southOutputStatusObserved = southOutputStatus.status;
      state.southMeaningPreservedObserved = southOutputStatus.preserved;
      state.southSchemaConformanceObserved = southOutputStatus.schemaStatus;
      state.southReportObjectPresent = southOutputStatus.reportObjectPresent;
      state.southFullPacketTextPresent = southOutputStatus.fullPacketTextPresent;
      state.southCompactSummaryPresent = southOutputStatus.compactSummaryPresent;
      state.southOutputStatusClass = southOutputStatus.statusClass;

      const comparison = compareMeaningFields(sourceReport, southReportObject);

      if (required.missing.length) {
        state.packetMeaningStatus = "PACKET_MEANING_GAP_DETECTED";
        state.packetMeaningPreserved = "false";
        state.packetMeaningFailureClass = "NORTH_MEANING_FIELDS_MISSING";
        state.packetMeaningFailureReason =
          `REQUIRED_NORTH_MEANING_FIELDS_MISSING:${required.missing.join(",")}`;
        addNote(state, state.packetMeaningFailureReason);
      } else if (!noClaims.valid) {
        state.packetMeaningStatus = "PACKET_MEANING_GAP_DETECTED";
        state.packetMeaningPreserved = "false";
        state.packetMeaningFailureClass = "NO_CLAIM_BOUNDARY_BROKEN";
        state.packetMeaningFailureReason =
          `NO_CLAIM_FIELDS_TRUE:${noClaims.trueFields.join(",")}`;
        addNote(state, state.packetMeaningFailureReason);
      } else if (southOutputStatus.outputLooksPartial) {
        state.packetMeaningStatus = "PACKET_MEANING_GAP_DETECTED";
        state.packetMeaningPreserved = "false";
        state.packetMeaningFailureClass = "SOUTH_OUTPUT_PARTIAL_OR_NOT_PRESERVED";
        state.packetMeaningFailureReason =
          `SOUTH_OUTPUT_STATUS=${southOutputStatus.status};SOUTH_MEANING_PRESERVED=${southOutputStatus.preserved}`;
        addNote(state, "PROBE_SOUTH_DETECTED_SOUTH_OUTPUT_PARTIAL_OR_MEANING_NOT_PRESERVED");
      } else if (comparison.mismatches.length) {
        state.packetMeaningStatus = "PACKET_MEANING_GAP_DETECTED";
        state.packetMeaningPreserved = "false";
        state.packetMeaningFailureClass = "SOUTH_REPORT_MEANING_MISMATCH";
        state.packetMeaningFailureReason =
          `SOUTH_REPORT_MEANING_MISMATCH:${comparison.mismatches.join(";")}`;
        addNote(state, state.packetMeaningFailureReason);
      } else {
        state.packetMeaningStatus = "PACKET_MEANING_PRESERVED";
        state.packetMeaningPreserved = "true";
        state.packetMeaningFailureClass = "NONE";
        state.packetMeaningFailureReason = "NONE";
        addNote(state, "PROBE_SOUTH_CONFIRMED_PACKET_MEANING_PRESERVED");
      }

      addNote(state, `PROBE_SOUTH_REQUIRED_FIELD_STATUS:${state.requiredFieldStatus}`);
      addNote(state, `PROBE_SOUTH_CHRONOLOGY_FIELD_STATUS:${state.chronologyFieldStatus}`);
      addNote(state, `PROBE_SOUTH_NO_CLAIM_BOUNDARY_STATUS:${state.noClaimBoundaryStatus}`);
      addNote(state, `PROBE_SOUTH_SOUTH_OUTPUT_STATUS_CLASS:${state.southOutputStatusClass}`);
      addNote(state, `PROBE_SOUTH_COMPARISON_STATUS:${comparison.status}`);

      if (comparison.mismatches.length) {
        addNote(state, `PROBE_SOUTH_COMPARISON_MISMATCH_COUNT:${comparison.mismatches.length}`);
      }

      decideNext(state, sourceReport);

      state.report = buildReport(state);
      state.receipt = buildReceipt(state);

      publish(state);

      return clonePlain(state.report);
    } catch (error) {
      state.probeSouthRunComplete = "false";
      state.probeSouthRunStatus = "FAILED";
      state.probeSouthStatus = "FAILED";
      state.packetMeaningStatus = "PROBE_SOUTH_RUN_FAILED";
      state.packetMeaningPreserved = "false";
      state.packetMeaningFailureClass = "PROBE_SOUTH_EXCEPTION";
      state.packetMeaningFailureReason = bounded(error && error.message ? error.message : error, 1200);
      state.recommendedNextOwner = "DIAGNOSTIC_PROBE_SOUTH";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_PROBE_SOUTH_EXCEPTION_BEFORE_RETRY";
      state.primaryCase = "INCONCLUSIVE_EVIDENCE";
      state.calibrationStatus = "CALIBRATION_HOLD_PROBE_SOUTH_EXCEPTION";
      state.calibrationHoldReason = state.packetMeaningFailureReason;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";

      addNote(state, `PROBE_SOUTH_EXCEPTION:${state.packetMeaningFailureReason}`);

      state.report = buildReport(state);
      state.receipt = buildReceipt(state);

      publish(state);

      return clonePlain(state.report);
    }
  }

  function inspectPacketMeaning(input = {}) {
    return runProbeSouth(input);
  }

  function inspectSouthPacketMeaning(input = {}) {
    return runProbeSouth(input);
  }

  function runProbe(input = {}) {
    return runProbeSouth(input);
  }

  function inspect(input = {}) {
    return runProbeSouth(input);
  }

  function getProbeSouthReceipt() {
    return clonePlain(lastReceipt || buildReceipt(lastState || makeState()));
  }

  function getReceipt() {
    return getProbeSouthReceipt();
  }

  function getReceiptLight() {
    return getProbeSouthReceipt();
  }

  function getReport() {
    return clonePlain(lastReport || buildReport(lastState || makeState()));
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  api = Object.freeze({
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    parentNorthContract: PARENT_NORTH_CONTRACT,
    parentNorthReceipt: PARENT_NORTH_RECEIPT,
    previousNorthContract: PREVIOUS_NORTH_CONTRACT,

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    expectedSouthRailContract: EXPECTED_SOUTH_RAIL_CONTRACT,
    southRailExternalContract: SOUTH_RAIL_EXTERNAL_CONTRACT,

    runProbeSouth,
    inspectPacketMeaning,
    inspectSouthPacketMeaning,
    runProbe,
    inspect,
    getProbeSouthReceipt,
    getReceipt,
    getReceiptLight,
    getReport,
    getState,

    supportsNorthChronologyHubStandard: true,
    supportsProbeSouthChronologyCompletion: true,
    supportsSouthPacketMeaningInspection: true,
    supportsSouthRailOutputConformanceInspection: true,
    supportsNorthMeaningFieldPreservationInspection: true,
    supportsChronologyFieldPreservationInspection: true,
    supportsNoClaimBoundaryInspection: true,
    supportsPostChronologyZoneReturn: true,

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
