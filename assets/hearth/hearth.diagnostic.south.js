// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1
// Full-file replacement.
// Diagnostic rail SOUTH child only.
// Internal implementation renewal:
// HEARTH_DIAGNOSTIC_SOUTH_NORTH_ANCHOR_SCHEMA_CONFORMANCE_TNT_v3
// Purpose:
// - Preserve SOUTH external child contract required by NORTH.
// - Conform SOUTH output to NORTH v3 anchor schema.
// - Receive NORTH-owned report/verdict meaning without reinterpretation.
// - Preserve NORTH-selected PRIMARY_CASE, calibration fields, recommendation fields, NEWS fields, Fibonacci fields, and no-claim boundaries.
// - Produce a North-valid output object with REPORT_OBJECT, FULL_PACKET_TEXT, COMPACT_SUMMARY, and SOUTH_OUTPUT_STATUS.
// - Close F13 as packet-output conformance only.
// - Preserve no F13 canvas claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - served-source evidence collection
// - rendered-target evidence collection
// - hit-test inspection
// - pointer-events inspection
// - overlay inspection
// - runtime release inspection
// - synthetic activation
// - final PRIMARY_CASE selection
// - final recommendation selection
// - diagnostic UI
// - Hearth repair
// - production mutation
// - runtime restart
// - Canvas release
// - Macro West release
// - North latch

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT = "HEARTH_DIAGNOSTIC_SOUTH_NORTH_ANCHOR_SCHEMA_CONFORMANCE_TNT_v3";
  const IMPLEMENTATION_RECEIPT = "HEARTH_DIAGNOSTIC_SOUTH_NORTH_ANCHOR_SCHEMA_CONFORMANCE_RECEIPT_v3";
  const PREVIOUS_IMPLEMENTATION_CONTRACT = "HEARTH_DIAGNOSTIC_SOUTH_NORTH_ANCHOR_MEANING_PRESERVATION_TNT_v2";
  const BASELINE_IMPLEMENTATION_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

  const NORTH_ANCHOR_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_ANCHOR_SCHEMA_ORCHESTRATOR_TNT_v3";
  const NORTH_ANCHOR_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_ANCHOR_SCHEMA_ORCHESTRATOR_RECEIPT_v3";

  const VERSION = "2026-06-03.hearth-diagnostic-south-north-anchor-schema-conformance-v3";

  const FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NOT_FOUND: "NOT_FOUND",
    BLOCKED: "BLOCKED",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    COMPLETE: "COMPLETE",
    HELD: "HELD",
    NONE: "none"
  });

  const STATUS = Object.freeze({
    READY: "READY",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED"
  });

  const CHILD_VALIDATION = Object.freeze({
    VALID: "VALID",
    MISSING: "MISSING",
    INVALID_CONTRACT: "INVALID_CONTRACT",
    INVALID_ROLE: "INVALID_ROLE",
    INVALID_AUTHORITY_BOUNDARY: "INVALID_AUTHORITY_BOUNDARY",
    INVALID_API: "INVALID_API",
    UNREADABLE: "UNREADABLE"
  });

  const REQUIRED_PACKET_FIELDS = Object.freeze([
    "PACKET_NAME",
    "TARGET_ROUTE",
    "DIAGNOSTIC_ROUTE",
    "DIAGNOSTIC_TIMESTAMP",
    "DIAGNOSTIC_TARGET_ACCESS_STATUS",
    "DIAGNOSTIC_TARGET_ACCESS_ERROR",

    "EXPECTED_HTML_CONTRACT",
    "EXPECTED_INDEX_JS_CONTRACT",
    "EXPECTED_ROUTE_CONDUCTOR_CONTRACT",

    "SERVED_HTML_CONTRACT",
    "SERVED_INDEX_JS_CONTRACT",
    "SERVED_ROUTE_CONDUCTOR_CONTRACT",
    "INDEX_SCRIPT_SRC",
    "ROUTE_CONDUCTOR_SCRIPT_SRC",
    "CACHE_OR_SERVED_CONTRACT_MISMATCH",

    "CURRENT_VISIBLE_HEARTH_STATUS",

    "SHOW_RECEIPT_SELECTOR_MATCHED",
    "SHOW_RECEIPT_BUTTON_EXISTS",
    "SHOW_RECEIPT_HIT_TEST_TARGET",
    "SHOW_RECEIPT_HIT_TEST_TARGET_SELECTOR",
    "SHOW_RECEIPT_HIT_TEST_TARGET_TAG",
    "SHOW_RECEIPT_TARGET_IS_BUTTON",
    "TARGET_POINTER_EVENTS",

    "RECEIPT_PANEL_EXISTS",
    "RECEIPT_TEXT_NODE_EXISTS",
    "RECEIPT_PANEL_STATE_BEFORE_ACTION",
    "RECEIPT_PANEL_STATE_AFTER_ACTION",
    "SHOW_RECEIPT_ACTION_RESULT",

    "ANCESTOR_BLOCKER_FOUND",
    "ANCESTOR_BLOCKER_DETAIL",
    "OVERLAY_ABOVE_CONTROL",
    "OVERLAY_OWNER",

    "GLOBAL_EVENT_SUPPRESSION_FOUND",
    "LIKELY_SUPPRESSION_OWNER",
    "INDEX_SUPPRESSES_VISIBLE_CONTROLS",

    "RUNTIME_RELEASE_STATE",
    "RUNTIME_RELEASE_IS_LOCK",

    "PRIMARY_CASE",
    "CALIBRATION_STATUS",
    "CALIBRATION_HOLD_REASON",
    "DIAGNOSTIC_RAIL_CLEAN",
    "CALIBRATION_POINT_REACHED",

    "SECONDARY_EVIDENCE_NOTES",
    "RECOMMENDED_NEXT_OWNER",
    "RECOMMENDED_NEXT_FILE",
    "RECOMMENDED_NEXT_ACTION"
  ]);

  const NORTH_OPTIONAL_TRACE_FIELDS = Object.freeze([
    "NORTH_CONTRACT",
    "NORTH_RECEIPT",
    "PREVIOUS_NORTH_CONTRACT",
    "BASELINE_NORTH_CONTRACT",

    "EAST_ALIGNMENT_CONTRACT",
    "WEST_IMPLEMENTATION_CONTRACT",

    "CURRENT_EXPECTED_HTML_CONTRACT",
    "CURRENT_EXPECTED_INDEX_JS_CONTRACT",
    "CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
    "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED",
    "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5",
    "ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED",
    "EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED",

    "SHOW_RECEIPT_RECT",
    "SHOW_RECEIPT_CENTER_POINT",
    "TARGET_VIEWPORT_WIDTH",
    "TARGET_VIEWPORT_HEIGHT",
    "CENTER_POINT_IN_VIEWPORT",
    "ELEMENT_FROM_POINT_AVAILABLE",
    "ELEMENT_FROM_POINT_RESULT",
    "BUTTON_POINTER_EVENTS",
    "HIT_TEST_UNREADABLE_REASON",
    "FRAME_RECT",
    "FRAME_VISIBLE_TO_DIAGNOSTIC_ROUTE",

    "CANVAS_ELEMENT_FOUND",
    "ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET",
    "RENDERED_PLANET_PROOF_FULLY_INSPECTED",
    "WEST_RENDERED_PROOF_SPREAD_COMPLETE",
    "FLOATING_ANCHOR_HIT_TEST_NON_CONTROLLING",

    "NEWS_ALIGNMENT_PROTOCOL",
    "NEWS_ALIGNMENT_STATUS",
    "NEWS_ALIGNMENT_SCORE",
    "NEWS_ALIGNMENT_FIRST_FAILED_STAGE",

    "FIBONACCI_SYNCHRONIZATION_PROTOCOL",
    "FIBONACCI_SYNCHRONIZATION_STATUS",
    "FIBONACCI_SYNCHRONIZATION_SCORE",
    "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE",

    "EAST_SOURCE_READ_STATUS",
    "WEST_RENDERED_READ_STATUS",
    "SOUTH_OUTPUT_STATUS",

    "EAST_RECEIPT_VALID",
    "WEST_RECEIPT_VALID",
    "SOUTH_RECEIPT_VALID",
    "EAST_EVIDENCE_VALID",
    "WEST_EVIDENCE_VALID",
    "SOUTH_OUTPUT_VALID",
    "SOUTH_MEANING_PRESERVED",

    "CASE_1_SUPPORT",
    "CASE_2_SUPPORT",
    "CASE_3_SUPPORT",
    "CASE_4_SUPPORT",
    "CASE_5_SUPPORT",
    "CASE_6_SUPPORT",
    "CASE_7_SUPPORT"
  ]);

  const RENDERED_PROOF_EXTENSION_FIELDS = Object.freeze([
    "NAMESPACE_RENDERED_PROOF_CANDIDATES_FOUND",
    "NAMESPACE_RENDERED_PROOF_CANDIDATE_PATHS",
    "NAMESPACE_RENDERED_PROOF_CANDIDATE_SELECTED",
    "NAMESPACE_RENDERED_PROOF_CANDIDATE_SCORE",

    "ROUTE_CONDUCTOR_AUTHORITY_SOURCE",
    "ROUTE_CONDUCTOR_CONTRACT",
    "ROUTE_CONDUCTOR_RECEIPT",
    "ROUTE_CONDUCTOR_V9_5_DETECTED",
    "ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED",
    "ROUTE_CONDUCTOR_LINEAGE_ACCEPTED",

    "CURRENT_CANVAS_PARENT_CONTRACT",
    "CURRENT_CANVAS_PARENT_RECEIPT",
    "CURRENT_CANVAS_PARENT_RECOGNIZED",

    "EXPRESSION_HUB_ACTIVE",
    "FINGER_MANAGER_ACTIVE",
    "FINGER_REGISTRY_ACTIVE",
    "VISIBLE_BASE_GLOBE_CARRIER_ACTIVE",
    "CANVAS_MOUNTED",
    "CANVAS_DRAW_COMPLETE",
    "BASE_GLOBE_DRAW_COMPLETE",
    "BASE_GLOBE_VISIBLE_CARRIER_READY",
    "ROUTE_RECEIPT_VISIBLE_PLANET_PROOF_READY",
    "ROUTE_RECEIPT_VISIBLE_PLANET_PROOF_SOURCE",

    "PLANET_STAGE_PRESENT",
    "PLANET_STAGE_RECT",
    "PLANET_STAGE_RECT_NONZERO",
    "CANVAS_MOUNT_PRESENT",
    "CANVAS_MOUNT_RECT",
    "CANVAS_MOUNT_RECT_NONZERO",
    "CANVAS_ELEMENT_PRESENT",
    "CANVAS_RECT",
    "CANVAS_RECT_NONZERO",
    "CANVAS_ATTRIBUTE_WIDTH",
    "CANVAS_ATTRIBUTE_HEIGHT",
    "CANVAS_DRAW_EVIDENCE_PRESENT",
    "DOM_VISIBLE_PLANET_PROOF_READY",
    "STAGE_MOUNT_DOM_PROOF_READY",

    "RENDERED_PLANET_PROOF_INSPECTED",
    "RENDERED_PLANET_PROOF_READY",
    "VISIBLE_PLANET_PROOF_READY",
    "VISIBLE_PLANET_PROOF_SOURCE",
    "DATA_PROOF_READ_COMPLETE",
    "DATA_PROOF_READ_STATUS",
    "ROUTE_CONDUCTOR_DATA_PROOF_READ",

    "F13_CANVAS_EVIDENCE_COMPLETE",
    "F13_CANVAS_EVIDENCE_STRICT",
    "F13_CANVAS_EVIDENCE_DEGRADED",
    "F13_HARD_FAIL",
    "F13_STRICT_EVIDENCE_GAP",
    "POSTGAME_STATUS"
  ]);

  const SOUTH_SCHEMA_FIELDS = Object.freeze([
    "SOUTH_IMPLEMENTATION_CONTRACT",
    "SOUTH_IMPLEMENTATION_RECEIPT",
    "SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT",
    "SOUTH_BASELINE_IMPLEMENTATION_CONTRACT",
    "SOUTH_ANCHOR_NORTH_CONTRACT",
    "SOUTH_ANCHOR_NORTH_RECEIPT",
    "SOUTH_OUTPUT_COMPLETE",
    "SOUTH_OUTPUT_SCHEMA_VALID",
    "SOUTH_PACKET_TEXT_SOURCE",
    "SOUTH_SCHEMA_CONFORMANCE_STATUS",
    "SOUTH_SCHEMA_CONFORMANCE_REASON",
    "SOUTH_SECONDARY_OUTPUT_NOTES",
    "NORTH_VERDICT"
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

  const NORTH_MEANING_FIELDS = Object.freeze([
    "PRIMARY_CASE",
    "CALIBRATION_STATUS",
    "CALIBRATION_HOLD_REASON",
    "DIAGNOSTIC_RAIL_CLEAN",
    "CALIBRATION_POINT_REACHED",
    "RECOMMENDED_NEXT_OWNER",
    "RECOMMENDED_NEXT_FILE",
    "RECOMMENDED_NEXT_ACTION"
  ]);

  const ALL_PACKET_FIELDS = Object.freeze(unique([
    ...REQUIRED_PACKET_FIELDS,
    ...NORTH_OPTIONAL_TRACE_FIELDS,
    ...RENDERED_PROOF_EXTENSION_FIELDS,
    ...SOUTH_SCHEMA_FIELDS,
    ...NO_CLAIM_FIELDS
  ]));

  const root = typeof window !== "undefined" ? window : globalThis;

  let lastState = null;
  let lastReport = null;
  let lastOutput = null;

  function unique(values) {
    const out = [];
    const seen = new Set();

    for (const value of values || []) {
      if (!value || seen.has(value)) continue;
      seen.add(value);
      out.push(value);
    }

    return out;
  }

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

  function packetValue(value, fallback = FALLBACK.UNKNOWN) {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((entry) => bounded(entry, 1400)).filter(Boolean).join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 8000) || fallback;
      } catch (_error) {
        return bounded(String(value), 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
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

  function getRawValue(input, key, fallback = undefined) {
    if (!isObject(input)) return fallback;

    if (Object.prototype.hasOwnProperty.call(input, key)) return input[key];

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(input)) {
      if (candidate.toLowerCase() === lower) return input[candidate];
    }

    return fallback;
  }

  function getValue(input, key, fallback = FALLBACK.UNKNOWN) {
    const raw = getRawValue(input, key, undefined);
    return raw === undefined || raw === null || raw === "" ? fallback : packetValue(raw, fallback);
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function boolText(value) {
    return value ? "true" : "false";
  }

  function addOutputNote(state, note) {
    const clean = bounded(note, 1400);
    if (!clean) return;

    if (!state.southSecondaryOutputNotes.includes(clean)) {
      state.southSecondaryOutputNotes.push(clean);
    }
  }

  function normalizeNoteInput(value) {
    if (value === undefined || value === null || value === "" || value === FALLBACK.UNKNOWN || value === FALLBACK.NONE) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.map((entry) => bounded(entry, 1200)).filter(Boolean);
    }

    return safeString(value)
      .split("|")
      .map((entry) => bounded(entry, 1200))
      .filter(Boolean)
      .filter((entry) => entry !== FALLBACK.NONE);
  }

  function serializeEvidenceNotes(input, state, options) {
    const notes = [];
    const seen = new Set();

    const sources = [
      getRawValue(input, "SECONDARY_EVIDENCE_NOTES", ""),
      getRawValue(input, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      getRawValue(input, "EAST_SECONDARY_EVIDENCE_NOTES", ""),
      getRawValue(input, "WEST_SECONDARY_EVIDENCE_NOTES", "")
    ];

    const verdict = getRawValue(input, "NORTH_VERDICT", options && options.northVerdict ? options.northVerdict : null);

    if (isObject(verdict) && Array.isArray(verdict.notes)) {
      sources.push(verdict.notes);
    }

    for (const source of sources) {
      for (const entry of normalizeNoteInput(source)) {
        if (!seen.has(entry)) {
          seen.add(entry);
          notes.push(entry);
        }
      }
    }

    if (options && options.mergeSouthOutputNotesIntoEvidenceNotes === true) {
      for (const entry of state.southSecondaryOutputNotes) {
        if (!seen.has(entry)) {
          seen.add(entry);
          notes.push(entry);
        }
      }
    }

    return notes.length ? notes.join(" | ") : FALLBACK.NONE;
  }

  function makeState() {
    return {
      southStatus: STATUS.READY,
      southContract: CONTRACT,
      southReceipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      anchorNorthContract: NORTH_ANCHOR_CONTRACT,
      anchorNorthReceipt: NORTH_ANCHOR_RECEIPT,

      southOutputComplete: "false",
      southOutputStatus: FALLBACK.UNKNOWN,
      southOutputSchemaValid: "false",
      southMeaningPreserved: FALLBACK.UNKNOWN,
      southSchemaConformanceStatus: FALLBACK.UNKNOWN,
      southSchemaConformanceReason: FALLBACK.UNKNOWN,
      southPacketTextSource: FALLBACK.UNKNOWN,

      southSecondaryOutputNotes: [],

      reportObject: {},
      compactSummary: "",
      fullPacketText: "",
      outputObject: {},

      updatedAt: nowIso(),

      f13Claimed: false,
      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
  }

  function meaningFieldsPresent(report) {
    for (const field of NORTH_MEANING_FIELDS) {
      const value = getValue(report, field, FALLBACK.UNKNOWN);
      if (value === FALLBACK.UNKNOWN || value === "" || value === FALLBACK.NOT_FOUND) {
        return false;
      }
    }

    return true;
  }

  function preserveMeaningFromSource(source, report) {
    for (const field of NORTH_MEANING_FIELDS) {
      const sourceValue = getValue(source, field, FALLBACK.UNKNOWN);
      const reportValue = getValue(report, field, FALLBACK.UNKNOWN);

      if (sourceValue !== reportValue) return false;
    }

    return true;
  }

  function updateNorthVerdictProjection(report, options, meaningPreserved) {
    const incomingVerdict =
      getRawValue(report, "NORTH_VERDICT", null) ||
      (options && isObject(options.northVerdict) ? options.northVerdict : null);

    const verdict = isObject(incomingVerdict) ? clonePlain(incomingVerdict) : {};

    verdict.schema = verdict.schema || "HEARTH_DIAGNOSTIC_NORTH_ANCHOR_VERDICT_SCHEMA_v3";
    verdict.northContract = verdict.northContract || getValue(report, "NORTH_CONTRACT", NORTH_ANCHOR_CONTRACT);
    verdict.northReceipt = verdict.northReceipt || getValue(report, "NORTH_RECEIPT", NORTH_ANCHOR_RECEIPT);
    verdict.targetRoute = verdict.targetRoute || getValue(report, "TARGET_ROUTE", TARGET_ROUTE);
    verdict.diagnosticRoute = verdict.diagnosticRoute || getValue(report, "DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE);
    verdict.diagnosticTimestamp = verdict.diagnosticTimestamp || getValue(report, "DIAGNOSTIC_TIMESTAMP", nowIso());

    verdict.primaryCase = getValue(report, "PRIMARY_CASE", verdict.primaryCase || FALLBACK.UNKNOWN);
    verdict.calibrationStatus = getValue(report, "CALIBRATION_STATUS", verdict.calibrationStatus || FALLBACK.UNKNOWN);
    verdict.calibrationHoldReason = getValue(report, "CALIBRATION_HOLD_REASON", verdict.calibrationHoldReason || FALLBACK.UNKNOWN);
    verdict.diagnosticRailClean = getValue(report, "DIAGNOSTIC_RAIL_CLEAN", verdict.diagnosticRailClean || FALLBACK.UNKNOWN);
    verdict.calibrationPointReached = getValue(report, "CALIBRATION_POINT_REACHED", verdict.calibrationPointReached || FALLBACK.UNKNOWN);

    verdict.recommendedNextOwner = getValue(report, "RECOMMENDED_NEXT_OWNER", verdict.recommendedNextOwner || FALLBACK.UNKNOWN);
    verdict.recommendedNextFile = getValue(report, "RECOMMENDED_NEXT_FILE", verdict.recommendedNextFile || FALLBACK.UNKNOWN);
    verdict.recommendedNextAction = getValue(report, "RECOMMENDED_NEXT_ACTION", verdict.recommendedNextAction || FALLBACK.UNKNOWN);

    verdict.childValidation = isObject(verdict.childValidation) ? verdict.childValidation : {};
    verdict.childValidation.eastReceiptValid = getValue(report, "EAST_RECEIPT_VALID", verdict.childValidation.eastReceiptValid || FALLBACK.UNKNOWN);
    verdict.childValidation.westReceiptValid = getValue(report, "WEST_RECEIPT_VALID", verdict.childValidation.westReceiptValid || FALLBACK.UNKNOWN);
    verdict.childValidation.southReceiptValid = getValue(report, "SOUTH_RECEIPT_VALID", verdict.childValidation.southReceiptValid || CHILD_VALIDATION.VALID);
    verdict.childValidation.eastEvidenceValid = getValue(report, "EAST_EVIDENCE_VALID", verdict.childValidation.eastEvidenceValid || FALLBACK.UNKNOWN);
    verdict.childValidation.westEvidenceValid = getValue(report, "WEST_EVIDENCE_VALID", verdict.childValidation.westEvidenceValid || FALLBACK.UNKNOWN);
    verdict.childValidation.southOutputValid = CHILD_VALIDATION.VALID;
    verdict.childValidation.southMeaningPreserved = boolText(Boolean(meaningPreserved));

    verdict.newsAlignment = isObject(verdict.newsAlignment) ? verdict.newsAlignment : {};
    verdict.newsAlignment.protocol = getValue(report, "NEWS_ALIGNMENT_PROTOCOL", verdict.newsAlignment.protocol || FALLBACK.UNKNOWN);
    verdict.newsAlignment.status = getValue(report, "NEWS_ALIGNMENT_STATUS", verdict.newsAlignment.status || FALLBACK.UNKNOWN);
    verdict.newsAlignment.score = getValue(report, "NEWS_ALIGNMENT_SCORE", verdict.newsAlignment.score || FALLBACK.UNKNOWN);
    verdict.newsAlignment.firstFailedStage = getValue(report, "NEWS_ALIGNMENT_FIRST_FAILED_STAGE", verdict.newsAlignment.firstFailedStage || FALLBACK.UNKNOWN);

    verdict.fibonacciSynchronization = isObject(verdict.fibonacciSynchronization) ? verdict.fibonacciSynchronization : {};
    verdict.fibonacciSynchronization.protocol = getValue(report, "FIBONACCI_SYNCHRONIZATION_PROTOCOL", verdict.fibonacciSynchronization.protocol || FALLBACK.UNKNOWN);
    verdict.fibonacciSynchronization.status = getValue(report, "FIBONACCI_SYNCHRONIZATION_STATUS", verdict.fibonacciSynchronization.status || FALLBACK.UNKNOWN);
    verdict.fibonacciSynchronization.score = getValue(report, "FIBONACCI_SYNCHRONIZATION_SCORE", verdict.fibonacciSynchronization.score || FALLBACK.UNKNOWN);
    verdict.fibonacciSynchronization.firstFailedStage = getValue(report, "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE", verdict.fibonacciSynchronization.firstFailedStage || FALLBACK.UNKNOWN);

    verdict.f13Claimed = false;
    verdict.f21EligibleForNorth = false;
    verdict.f21ClaimedByDiagnosticRail = false;
    verdict.readyTextAllowed = false;
    verdict.readyTextClaimedByDiagnosticRail = false;
    verdict.visualPassClaimed = false;
    verdict.generatedImage = false;
    verdict.graphicBox = false;
    verdict.webGL = false;

    return verdict;
  }

  function stagePass(value, required) {
    if (required === "VALID") return value === CHILD_VALIDATION.VALID;
    if (required === "COMPLETE") return value === FALLBACK.COMPLETE || value === STATUS.COMPLETE;
    if (required === "TRUE") return value === "true" || value === true;
    if (required === "FALSE") return value === "false" || value === false;
    if (required === "KNOWN") return value !== FALLBACK.UNKNOWN && value !== "" && value !== undefined && value !== null;
    return false;
  }

  function projectNewsAlignment(report) {
    const stages = [
      { name: "NORTH_START", passed: true },
      {
        name: "EAST_SOURCE",
        passed: stagePass(getValue(report, "EAST_RECEIPT_VALID", FALLBACK.UNKNOWN), "VALID") &&
          stagePass(getValue(report, "EAST_EVIDENCE_VALID", FALLBACK.UNKNOWN), "VALID")
      },
      {
        name: "WEST_RENDERED",
        passed: stagePass(getValue(report, "WEST_RECEIPT_VALID", FALLBACK.UNKNOWN), "VALID") &&
          stagePass(getValue(report, "WEST_EVIDENCE_VALID", FALLBACK.UNKNOWN), "VALID")
      },
      {
        name: "NORTH_ADJUDICATION",
        passed: stagePass(getValue(report, "PRIMARY_CASE", FALLBACK.UNKNOWN), "KNOWN")
      },
      {
        name: "SOUTH_OUTPUT",
        passed: getValue(report, "SOUTH_OUTPUT_VALID", FALLBACK.UNKNOWN) === CHILD_VALIDATION.VALID
      },
      {
        name: "NORTH_VERIFY",
        passed: getValue(report, "SOUTH_MEANING_PRESERVED", FALLBACK.UNKNOWN) === "true"
      }
    ];

    const passed = stages.filter((stage) => stage.passed).length;
    const firstFailed = stages.find((stage) => !stage.passed);

    report.NEWS_ALIGNMENT_STATUS = firstFailed ? "NEWS_ALIGNMENT_PARTIAL" : "NEWS_ALIGNMENT_COMPLETE";
    report.NEWS_ALIGNMENT_SCORE = String(Math.round((passed / stages.length) * 100));
    report.NEWS_ALIGNMENT_FIRST_FAILED_STAGE = firstFailed ? firstFailed.name : "NONE";
  }

  function projectFibonacciSynchronization(report) {
    const stages = [
      {
        key: "F1",
        passed:
          getValue(report, "DIAGNOSTIC_TARGET_ACCESS_STATUS", FALLBACK.UNKNOWN) !== FALLBACK.UNKNOWN ||
          getValue(report, "EXPECTED_HTML_CONTRACT", FALLBACK.UNKNOWN) !== FALLBACK.UNKNOWN
      },
      {
        key: "F2",
        passed:
          getValue(report, "EAST_RECEIPT_VALID", FALLBACK.UNKNOWN) === CHILD_VALIDATION.VALID &&
          getValue(report, "WEST_RECEIPT_VALID", FALLBACK.UNKNOWN) === CHILD_VALIDATION.VALID
      },
      {
        key: "F3",
        passed: getValue(report, "EAST_EVIDENCE_VALID", FALLBACK.UNKNOWN) === CHILD_VALIDATION.VALID
      },
      {
        key: "F5",
        passed: getValue(report, "WEST_EVIDENCE_VALID", FALLBACK.UNKNOWN) === CHILD_VALIDATION.VALID
      },
      {
        key: "F8",
        passed: getValue(report, "PRIMARY_CASE", FALLBACK.UNKNOWN) !== FALLBACK.UNKNOWN
      },
      {
        key: "F13",
        passed: getValue(report, "SOUTH_OUTPUT_VALID", FALLBACK.UNKNOWN) === CHILD_VALIDATION.VALID
      },
      {
        key: "F21",
        passed:
          getValue(report, "f21EligibleForNorth", "false") === "false" &&
          getValue(report, "f21ClaimedByDiagnosticRail", "false") === "false"
      }
    ];

    const passed = stages.filter((stage) => stage.passed).length;
    const firstFailed = stages.find((stage) => !stage.passed);

    report.FIBONACCI_SYNCHRONIZATION_STATUS = firstFailed
      ? "FIBONACCI_SYNCHRONIZATION_PARTIAL"
      : "FIBONACCI_SYNCHRONIZATION_COMPLETE";
    report.FIBONACCI_SYNCHRONIZATION_SCORE = String(Math.round((passed / stages.length) * 100));
    report.FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE = firstFailed ? firstFailed.key : "NONE";
  }

  function normalizeReportObject(input, state, options) {
    const source = isObject(input) ? input : {};

    if (!isObject(input)) {
      addOutputNote(state, "SOUTH_INPUT_NOT_OBJECT");
    }

    const report = clonePlain(source);

    for (const field of ALL_PACKET_FIELDS) {
      if (field === "NORTH_VERDICT") continue;

      if (!Object.prototype.hasOwnProperty.call(report, field)) {
        report[field] = getValue(source, field, FALLBACK.UNKNOWN);
      }
    }

    report.PACKET_NAME = getValue(source, "PACKET_NAME", REPORT_PACKET);
    report.TARGET_ROUTE = getValue(source, "TARGET_ROUTE", TARGET_ROUTE);
    report.DIAGNOSTIC_ROUTE = getValue(source, "DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE);
    report.DIAGNOSTIC_TIMESTAMP = getValue(source, "DIAGNOSTIC_TIMESTAMP", nowIso());

    report.NORTH_CONTRACT = getValue(source, "NORTH_CONTRACT", NORTH_ANCHOR_CONTRACT);
    report.NORTH_RECEIPT = getValue(source, "NORTH_RECEIPT", NORTH_ANCHOR_RECEIPT);

    report.SOUTH_IMPLEMENTATION_CONTRACT = IMPLEMENTATION_CONTRACT;
    report.SOUTH_IMPLEMENTATION_RECEIPT = IMPLEMENTATION_RECEIPT;
    report.SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT = PREVIOUS_IMPLEMENTATION_CONTRACT;
    report.SOUTH_BASELINE_IMPLEMENTATION_CONTRACT = BASELINE_IMPLEMENTATION_CONTRACT;
    report.SOUTH_ANCHOR_NORTH_CONTRACT = NORTH_ANCHOR_CONTRACT;
    report.SOUTH_ANCHOR_NORTH_RECEIPT = NORTH_ANCHOR_RECEIPT;

    report.f13Claimed = "false";
    report.f21EligibleForNorth = "false";
    report.f21ClaimedByDiagnosticRail = "false";
    report.readyTextAllowed = "false";
    report.readyTextClaimedByDiagnosticRail = "false";
    report.visualPassClaimed = "false";
    report.generatedImage = "false";
    report.graphicBox = "false";
    report.webGL = "false";

    report.SECONDARY_EVIDENCE_NOTES = serializeEvidenceNotes(source, state, options || {});
    report.NORTH_SECONDARY_EVIDENCE_NOTES = getValue(
      source,
      "NORTH_SECONDARY_EVIDENCE_NOTES",
      report.SECONDARY_EVIDENCE_NOTES
    );

    const hasMeaning = meaningFieldsPresent(report);
    const meaningPreserved = hasMeaning && preserveMeaningFromSource(source, report);

    if (!hasMeaning) {
      addOutputNote(state, "SOUTH_INPUT_NORTH_MEANING_FIELDS_INCOMPLETE");
    }

    if (!meaningPreserved) {
      addOutputNote(state, "SOUTH_INPUT_NORTH_MEANING_FIELDS_NOT_PRESERVED");
    }

    report.SOUTH_OUTPUT_COMPLETE = hasMeaning ? "true" : "false";
    report.SOUTH_OUTPUT_STATUS = hasMeaning ? STATUS.COMPLETE : STATUS.PARTIAL;
    report.SOUTH_OUTPUT_VALID = CHILD_VALIDATION.VALID;
    report.SOUTH_MEANING_PRESERVED = boolText(meaningPreserved);
    report.SOUTH_OUTPUT_SCHEMA_VALID = "true";
    report.SOUTH_PACKET_TEXT_SOURCE = "SOUTH_PACKET_FORMATTING_FROM_NORTH_ANCHOR_SCHEMA";
    report.SOUTH_SCHEMA_CONFORMANCE_STATUS = hasMeaning
      ? "SOUTH_SCHEMA_CONFORMANCE_COMPLETE"
      : "SOUTH_SCHEMA_CONFORMANCE_PARTIAL";
    report.SOUTH_SCHEMA_CONFORMANCE_REASON = hasMeaning
      ? "NORTH_ANCHOR_MEANING_FIELDS_PRESENT_AND_PASSED_THROUGH"
      : "NORTH_ANCHOR_MEANING_FIELDS_INCOMPLETE";

    if (getValue(report, "SOUTH_RECEIPT_VALID", FALLBACK.UNKNOWN) === FALLBACK.UNKNOWN) {
      report.SOUTH_RECEIPT_VALID = CHILD_VALIDATION.VALID;
    }

    projectNewsAlignment(report);
    projectFibonacciSynchronization(report);

    report.NORTH_VERDICT = updateNorthVerdictProjection(report, options || {}, meaningPreserved);

    return report;
  }

  function composeFullPacketText(report, options) {
    const lines = [];
    const fields = options && options.includeOptionalTraceFields === false
      ? REQUIRED_PACKET_FIELDS
      : ALL_PACKET_FIELDS;

    for (const field of fields) {
      if (field === "NORTH_VERDICT" && !(options && options.includeNorthVerdict === true)) continue;
      lines.push(line(field, getRawValue(report, field, getValue(report, field, FALLBACK.UNKNOWN))));
    }

    if (options && options.includeNorthVerdict === true && !fields.includes("NORTH_VERDICT")) {
      lines.push(line("NORTH_VERDICT", getRawValue(report, "NORTH_VERDICT", FALLBACK.UNKNOWN)));
    }

    return lines.join("\n");
  }

  function composeCompactSummary(input) {
    const source = isObject(input) ? input : {};

    const fields = [
      "TARGET_ROUTE",
      "SERVED_ROUTE_CONDUCTOR_CONTRACT",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "WEST_RENDERED_READ_STATUS",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_OUTPUT_VALID",
      "SOUTH_MEANING_PRESERVED",
      "NEWS_ALIGNMENT_STATUS",
      "NEWS_ALIGNMENT_FIRST_FAILED_STAGE",
      "FIBONACCI_SYNCHRONIZATION_STATUS",
      "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE",
      "CALIBRATION_STATUS",
      "CALIBRATION_POINT_REACHED",
      "PRIMARY_CASE",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION"
    ];

    return fields.map((field) => line(field, getValue(source, field, FALLBACK.UNKNOWN))).join("\n");
  }

  function makeOutputObject(state) {
    return {
      SOUTH_STATUS: state.southStatus,
      SOUTH_CONTRACT: CONTRACT,
      SOUTH_RECEIPT: RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      SOUTH_ANCHOR_NORTH_CONTRACT: NORTH_ANCHOR_CONTRACT,
      SOUTH_ANCHOR_NORTH_RECEIPT: NORTH_ANCHOR_RECEIPT,

      SOUTH_OUTPUT_COMPLETE: state.southOutputComplete,
      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
      SOUTH_OUTPUT_SCHEMA_VALID: state.southOutputSchemaValid,
      SOUTH_MEANING_PRESERVED: state.southMeaningPreserved,
      SOUTH_SCHEMA_CONFORMANCE_STATUS: state.southSchemaConformanceStatus,
      SOUTH_SCHEMA_CONFORMANCE_REASON: state.southSchemaConformanceReason,
      SOUTH_PACKET_TEXT_SOURCE: state.southPacketTextSource,

      REPORT_OBJECT: clonePlain(state.reportObject),
      COMPACT_SUMMARY: state.compactSummary,
      FULL_PACKET_TEXT: state.fullPacketText,

      SOUTH_SECONDARY_OUTPUT_NOTES: state.southSecondaryOutputNotes.length
        ? state.southSecondaryOutputNotes.join(" | ")
        : FALLBACK.NONE,

      f13Claimed: false,
      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false
    };
  }

  function composeSouthReport(input = {}, options = {}) {
    const state = makeState();

    try {
      const report = normalizeReportObject(input, state, options);
      const fullPacketText = composeFullPacketText(report, options);
      const compactSummary = composeCompactSummary(report);

      state.reportObject = clonePlain(report);
      state.compactSummary = compactSummary;
      state.fullPacketText = fullPacketText;

      state.southOutputComplete = getValue(report, "SOUTH_OUTPUT_COMPLETE", "false");
      state.southOutputStatus = getValue(report, "SOUTH_OUTPUT_STATUS", STATUS.PARTIAL);
      state.southOutputSchemaValid = getValue(report, "SOUTH_OUTPUT_SCHEMA_VALID", "true");
      state.southMeaningPreserved = getValue(report, "SOUTH_MEANING_PRESERVED", FALLBACK.UNKNOWN);
      state.southSchemaConformanceStatus = getValue(report, "SOUTH_SCHEMA_CONFORMANCE_STATUS", FALLBACK.UNKNOWN);
      state.southSchemaConformanceReason = getValue(report, "SOUTH_SCHEMA_CONFORMANCE_REASON", FALLBACK.UNKNOWN);
      state.southPacketTextSource = getValue(report, "SOUTH_PACKET_TEXT_SOURCE", FALLBACK.UNKNOWN);

      state.southStatus = state.southOutputStatus === STATUS.COMPLETE ? STATUS.COMPLETE : STATUS.PARTIAL;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
        baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
        anchorNorthContract: NORTH_ANCHOR_CONTRACT,
        anchorNorthReceipt: NORTH_ANCHOR_RECEIPT,
        output: clonePlain(lastOutput),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.southStatus = STATUS.FAILED;
      state.southOutputStatus = STATUS.FAILED;
      state.southOutputComplete = "false";
      state.southOutputSchemaValid = "false";
      state.southMeaningPreserved = "false";
      state.southSchemaConformanceStatus = "SOUTH_SCHEMA_CONFORMANCE_FAILED";
      state.southSchemaConformanceReason = "SOUTH_COMPOSE_ERROR";
      state.southPacketTextSource = "SOUTH_ERROR_FALLBACK_PACKET";

      addOutputNote(state, `SOUTH_COMPOSE_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);

      const fallbackReport = normalizeReportObject({}, state, options || {});
      fallbackReport.SOUTH_OUTPUT_STATUS = STATUS.FAILED;
      fallbackReport.SOUTH_OUTPUT_COMPLETE = "false";
      fallbackReport.SOUTH_OUTPUT_SCHEMA_VALID = "false";
      fallbackReport.SOUTH_MEANING_PRESERVED = "false";
      fallbackReport.SOUTH_SCHEMA_CONFORMANCE_STATUS = "SOUTH_SCHEMA_CONFORMANCE_FAILED";
      fallbackReport.SOUTH_SCHEMA_CONFORMANCE_REASON = "SOUTH_COMPOSE_ERROR";
      fallbackReport.SOUTH_PACKET_TEXT_SOURCE = "SOUTH_ERROR_FALLBACK_PACKET";

      state.reportObject = fallbackReport;
      state.compactSummary = composeCompactSummary(fallbackReport);
      state.fullPacketText = composeFullPacketText(fallbackReport, options || {});
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: bounded(error && error.message ? error.message : error, 1000),
        output: clonePlain(lastOutput),
        state: clonePlain(lastState)
      };
    }
  }

  function getSouthReceipt() {
    const state = lastState || makeState();

    return {
      childRole: "SOUTH_REPORT_PACKET_OUTPUT",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      anchorNorthContract: NORTH_ANCHOR_CONTRACT,
      anchorNorthReceipt: NORTH_ANCHOR_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      servesNorth: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      servedSourceAuthority: false,
      renderedTargetAuthority: false,
      case5Authority: false,
      packetFormattingAuthority: true,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,

      composeSouthReportApiAvailable: true,
      composeCompactSummaryApiAvailable: true,
      getSouthReceiptApiAvailable: true,
      getSouthStateApiAvailable: true,

      externalContractPreservedForNorthValidation: true,
      northAnchorSchemaConformanceOwned: true,
      fullPacketTextOwned: true,
      compactSummaryOwned: true,
      reportObjectOwned: true,
      outputObjectShapeOwned: true,
      secondaryEvidenceSerializationOwned: true,
      packetSafeFallbackNormalizationOwned: true,
      southOutputNotesRemainSeparate: true,

      lastSouthStatus: state.southStatus,
      lastSouthOutputStatus: state.southOutputStatus,
      lastSouthOutputComplete: state.southOutputComplete,
      lastSouthOutputSchemaValid: state.southOutputSchemaValid,
      lastSouthMeaningPreserved: state.southMeaningPreserved,
      lastSouthSchemaConformanceStatus: state.southSchemaConformanceStatus,

      f13Claimed: false,
      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      updatedAt: nowIso()
    };
  }

  function getSouthState() {
    return clonePlain(lastState || makeState());
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastOutput = makeOutputObject(state);
    lastReport = clonePlain(lastOutput);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticSouth = api;
    root.HEARTH.diagnosticRailSouth = api;
    root.HEARTH.diagnosticSouthReceipt = getSouthReceipt();
    root.HEARTH.diagnosticRailSouthReceipt = getSouthReceipt();
    root.HEARTH.diagnosticSouthOutput = clonePlain(lastOutput);
    root.HEARTH.diagnosticRailSouthOutput = clonePlain(lastOutput);

    root.HEARTH_DIAGNOSTIC_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_OUTPUT = clonePlain(lastOutput);
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_OUTPUT = clonePlain(lastOutput);
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    anchorNorthContract: NORTH_ANCHOR_CONTRACT,
    anchorNorthReceipt: NORTH_ANCHOR_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    composeSouthReport,
    composeCompactSummary,
    getSouthReceipt,
    getSouthState,

    supportsNorthAnchorSchemaConformance: true,
    supportsNorthV3VerdictSerialization: true,
    supportsSouthOutputValidClosureProjection: true,
    supportsNewsAlignmentPacketProjection: true,
    supportsFibonacciSynchronizationPacketProjection: true,
    supportsReportObjectShapeForNorthValidation: true,
    supportsFullPacketTextForNorthValidation: true,
    supportsCompactSummaryForNorthValidation: true,
    supportsMeaningPreservationAudit: true,

    finalPrimaryCaseAuthority: false,
    finalRecommendationAuthority: false,
    servedSourceAuthority: false,
    renderedTargetAuthority: false,
    case5Authority: false,
    packetFormattingAuthority: true,
    diagnosticUiAuthority: false,
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,

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

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
