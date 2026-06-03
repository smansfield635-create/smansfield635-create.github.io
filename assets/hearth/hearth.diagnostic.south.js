// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1
// Full-file replacement.
// Diagnostic rail SOUTH child only.
// Internal implementation renewal:
// HEARTH_DIAGNOSTIC_SOUTH_NORTH_ANCHOR_MEANING_PRESERVATION_TNT_v2
// Purpose:
// - Preserve SOUTH parent-visible report-output contract.
// - Receive final diagnostic meaning from NORTH.
// - Preserve NORTH-selected PRIMARY_CASE, CALIBRATION_STATUS, calibration hold/release fields, and recommendations exactly.
// - Accept NORTH v3 anchor-schema fields, WEST rendered-proof namespace fields, EAST current-spread fields, NEWS Alignment fields, and Fibonacci Synchronization fields.
// - Normalize packet-safe fields without inventing evidence.
// - Compose compact summary and full packet text.
// - Preserve SOUTH output notes separately from diagnostic evidence notes unless NORTH explicitly merges them.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - served-source evidence collection
// - rendered-target evidence collection
// - hit-test inspection
// - pointer-events inspection
// - overlay inspection
// - runtime release inspection
// - synthetic activation
// - final PRIMARY_CASE selection
// - calibration decision
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

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_NORTH_ANCHOR_MEANING_PRESERVATION_TNT_v2";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_NORTH_ANCHOR_MEANING_PRESERVATION_RECEIPT_v2";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

  const VERSION =
    "2026-06-03.hearth-diagnostic-south-north-anchor-meaning-preservation-v2";

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

  const CORE_PACKET_FIELDS = Object.freeze([
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
    "RUNTIME_RELEASE_IS_LOCK"
  ]);

  const NORTH_MEANING_FIELDS = Object.freeze([
    "PRIMARY_CASE",
    "CALIBRATION_STATUS",
    "CALIBRATION_HOLD_REASON",
    "DIAGNOSTIC_RAIL_CLEAN",
    "CALIBRATION_POINT_REACHED",
    "SECONDARY_EVIDENCE_NOTES",
    "NORTH_SECONDARY_EVIDENCE_NOTES",
    "RECOMMENDED_NEXT_OWNER",
    "RECOMMENDED_NEXT_FILE",
    "RECOMMENDED_NEXT_ACTION"
  ]);

  const CONTRACT_TRACE_FIELDS = Object.freeze([
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
    "EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED"
  ]);

  const WEST_RENDERED_PROOF_FIELDS = Object.freeze([
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
    "ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET",

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
    "CANVAS_ELEMENT_FOUND",
    "CANVAS_RECT",
    "CANVAS_RECT_NONZERO",
    "CANVAS_ATTRIBUTE_WIDTH",
    "CANVAS_ATTRIBUTE_HEIGHT",
    "CANVAS_DRAW_EVIDENCE_PRESENT",
    "DOM_VISIBLE_PLANET_PROOF_READY",
    "STAGE_MOUNT_DOM_PROOF_READY",

    "RENDERED_PLANET_PROOF_INSPECTED",
    "RENDERED_PLANET_PROOF_READY",
    "RENDERED_PLANET_PROOF_FULLY_INSPECTED",
    "WEST_RENDERED_PROOF_SPREAD_COMPLETE",
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
    "POSTGAME_STATUS",

    "FLOATING_ANCHOR_HIT_TEST_NON_CONTROLLING"
  ]);

  const ALIGNMENT_FIELDS = Object.freeze([
    "NEWS_ALIGNMENT_PROTOCOL",
    "NEWS_ALIGNMENT_STATUS",
    "NEWS_ALIGNMENT_SCORE",
    "NEWS_ALIGNMENT_FIRST_FAILED_STAGE",

    "FIBONACCI_SYNCHRONIZATION_PROTOCOL",
    "FIBONACCI_SYNCHRONIZATION_STATUS",
    "FIBONACCI_SYNCHRONIZATION_SCORE",
    "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE"
  ]);

  const CHILD_STATUS_FIELDS = Object.freeze([
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

  const NO_CLAIM_FIELD_VALUES = Object.freeze({
    f13Claimed: "false",
    f21EligibleForNorth: "false",
    f21ClaimedByDiagnosticRail: "false",
    readyTextAllowed: "false",
    readyTextClaimedByDiagnosticRail: "false",
    visualPassClaimed: "false",
    generatedImage: "false",
    graphicBox: "false",
    webGL: "false"
  });

  const INTERNAL_OPTION_FIELDS = Object.freeze([
    "includeOptionalTraceFields",
    "includeNoClaimFieldsInPacket",
    "mergeSouthOutputNotesIntoEvidenceNotes"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastReport = null;

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
      const joined = value
        .map((entry) => bounded(entry, 1000))
        .filter(Boolean)
        .join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 4000) || fallback;
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

  function normalizeKey(key) {
    return safeString(key).trim();
  }

  function getValue(input, key, fallback = FALLBACK.UNKNOWN) {
    if (!isObject(input)) return fallback;

    if (Object.prototype.hasOwnProperty.call(input, key)) {
      return packetValue(input[key], fallback);
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(input)) {
      if (candidate.toLowerCase() === lower) {
        return packetValue(input[candidate], fallback);
      }
    }

    return fallback;
  }

  function hasValue(input, key) {
    if (!isObject(input)) return false;

    if (Object.prototype.hasOwnProperty.call(input, key)) {
      return input[key] !== undefined && input[key] !== null && input[key] !== "";
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(input)) {
      if (candidate.toLowerCase() === lower) {
        return input[candidate] !== undefined && input[candidate] !== null && input[candidate] !== "";
      }
    }

    return false;
  }

  function line(key, value) {
    return `${normalizeKey(key)}=${packetValue(value)}`;
  }

  function addOutputNote(state, note) {
    const clean = bounded(note, 1000);
    if (!clean) return;

    if (!state.southSecondaryOutputNotes.includes(clean)) {
      state.southSecondaryOutputNotes.push(clean);
    }
  }

  function normalizeNoteInput(value) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === FALLBACK.UNKNOWN ||
      value === FALLBACK.NONE
    ) {
      return [];
    }

    if (Array.isArray(value)) {
      return value.map((entry) => bounded(entry, 1000)).filter(Boolean);
    }

    return safeString(value)
      .split("|")
      .map((entry) => bounded(entry, 1000))
      .filter(Boolean);
  }

  function pushUnique(list, value) {
    const clean = bounded(value, 1000);
    if (!clean || clean === FALLBACK.NONE) return;
    if (!list.includes(clean)) list.push(clean);
  }

  function serializeEvidenceNotes(input, state, options) {
    const notes = [];

    const sources = [
      getValue(input, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(input, "EAST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(input, "WEST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(input, "NORTH_SECONDARY_EVIDENCE_NOTES", "")
    ];

    for (const source of sources) {
      for (const entry of normalizeNoteInput(source)) pushUnique(notes, entry);
    }

    if (options && options.mergeSouthOutputNotesIntoEvidenceNotes === true) {
      for (const entry of state.southSecondaryOutputNotes) pushUnique(notes, entry);
    }

    return notes.length ? notes.join(" | ") : FALLBACK.NONE;
  }

  function orderedFields(options) {
    const fields = [];

    for (const field of CORE_PACKET_FIELDS) pushUnique(fields, field);
    for (const field of NORTH_MEANING_FIELDS) pushUnique(fields, field);

    if (!options || options.includeOptionalTraceFields !== false) {
      for (const field of CONTRACT_TRACE_FIELDS) pushUnique(fields, field);
      for (const field of WEST_RENDERED_PROOF_FIELDS) pushUnique(fields, field);
      for (const field of ALIGNMENT_FIELDS) pushUnique(fields, field);
      for (const field of CHILD_STATUS_FIELDS) pushUnique(fields, field);
    }

    if (options && options.includeNoClaimFieldsInPacket === true) {
      for (const field of Object.keys(NO_CLAIM_FIELD_VALUES)) pushUnique(fields, field);
    }

    return fields;
  }

  function copySourceFieldsFirst(source, report) {
    if (!isObject(source)) return;

    for (const key of Object.keys(source)) {
      if (INTERNAL_OPTION_FIELDS.includes(key)) continue;
      report[key] = packetValue(source[key], FALLBACK.UNKNOWN);
    }
  }

  function ensureField(report, source, field, fallback = FALLBACK.UNKNOWN) {
    if (report[field] === undefined || report[field] === null || report[field] === "") {
      report[field] = getValue(source, field, fallback);
    }
  }

  function makeState() {
    return {
      southStatus: STATUS.READY,
      southContract: CONTRACT,
      southReceipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,

      southOutputComplete: "false",
      southOutputStatus: FALLBACK.UNKNOWN,
      southMeaningPreservationStatus: FALLBACK.UNKNOWN,
      southPacketFieldCount: 0,
      southSecondaryOutputNotes: [],

      reportObject: {},
      compactSummary: "",
      fullPacketText: "",

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

  function normalizeReportObject(input, state, options = {}) {
    const source = isObject(input) ? input : {};
    const report = {};

    if (!isObject(input)) addOutputNote(state, "SOUTH_INPUT_NOT_OBJECT");

    copySourceFieldsFirst(source, report);

    ensureField(report, source, "PACKET_NAME", REPORT_PACKET);
    ensureField(report, source, "TARGET_ROUTE", TARGET_ROUTE);
    ensureField(report, source, "DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE);

    if (!hasValue(source, "DIAGNOSTIC_TIMESTAMP")) {
      report.DIAGNOSTIC_TIMESTAMP = nowIso() || FALLBACK.UNKNOWN;
      addOutputNote(state, "SOUTH_TIMESTAMP_SUBSTITUTED");
    } else {
      report.DIAGNOSTIC_TIMESTAMP = getValue(source, "DIAGNOSTIC_TIMESTAMP", FALLBACK.UNKNOWN);
    }

    for (const field of CORE_PACKET_FIELDS) {
      ensureField(report, source, field, FALLBACK.UNKNOWN);
    }

    for (const field of NORTH_MEANING_FIELDS) {
      ensureField(report, source, field, FALLBACK.UNKNOWN);
    }

    if (!options || options.includeOptionalTraceFields !== false) {
      for (const field of CONTRACT_TRACE_FIELDS) ensureField(report, source, field, FALLBACK.UNKNOWN);
      for (const field of WEST_RENDERED_PROOF_FIELDS) ensureField(report, source, field, FALLBACK.UNKNOWN);
      for (const field of ALIGNMENT_FIELDS) ensureField(report, source, field, FALLBACK.UNKNOWN);
      for (const field of CHILD_STATUS_FIELDS) ensureField(report, source, field, FALLBACK.UNKNOWN);
    }

    report.SECONDARY_EVIDENCE_NOTES = serializeEvidenceNotes(source, state, options);

    if (options && options.includeNoClaimFieldsInPacket === true) {
      for (const [field, value] of Object.entries(NO_CLAIM_FIELD_VALUES)) {
        report[field] = value;
      }
    }

    return report;
  }

  function requiredMeaningComplete(report) {
    const required = [
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",
      "DIAGNOSTIC_RAIL_CLEAN",
      "CALIBRATION_POINT_REACHED",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION"
    ];

    return required.every((field) => {
      const value = report[field];
      return value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== FALLBACK.UNKNOWN;
    });
  }

  function determineOutputStatus(input, report, state) {
    if (!isObject(input)) {
      addOutputNote(state, "SOUTH_INPUT_OBJECT_REQUIRED_FOR_COMPLETE_OUTPUT");
      return STATUS.PARTIAL;
    }

    if (!requiredMeaningComplete(report)) {
      addOutputNote(state, "SOUTH_INPUT_FINAL_MEANING_PARTIAL");
      return STATUS.PARTIAL;
    }

    state.southMeaningPreservationStatus = "PRESERVED_NORTH_ANCHOR_MEANING";
    addOutputNote(state, "SOUTH_PRESERVED_NORTH_PRIMARY_CASE_CALIBRATION_AND_RECOMMENDATION");

    return STATUS.COMPLETE;
  }

  function composeFullPacketText(report, options = {}) {
    const lines = [];
    const used = new Set();

    for (const field of orderedFields(options)) {
      lines.push(line(field, report[field]));
      used.add(field);
    }

    if (!options || options.includeOptionalTraceFields !== false) {
      const extras = Object.keys(report)
        .filter((field) => !used.has(field))
        .filter((field) => !INTERNAL_OPTION_FIELDS.includes(field))
        .sort();

      for (const field of extras) {
        lines.push(line(field, report[field]));
        used.add(field);
      }
    }

    return lines.join("\n");
  }

  function composeCompactSummary(input = {}) {
    const source = isObject(input) ? input : {};

    const fields = [
      "TARGET_ROUTE",
      "SERVED_ROUTE_CONDUCTOR_CONTRACT",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_POINT_REACHED",
      "DIAGNOSTIC_RAIL_CLEAN",
      "WEST_RENDERED_READ_STATUS",
      "WEST_RENDERED_PROOF_SPREAD_COMPLETE",
      "RENDERED_PLANET_PROOF_FULLY_INSPECTED",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_MEANING_PRESERVED",
      "NEWS_ALIGNMENT_STATUS",
      "FIBONACCI_SYNCHRONIZATION_STATUS",
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
      SOUTH_OUTPUT_COMPLETE: state.southOutputComplete,
      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
      SOUTH_MEANING_PRESERVATION_STATUS: state.southMeaningPreservationStatus,
      SOUTH_PACKET_FIELD_COUNT: state.southPacketFieldCount,
      REPORT_OBJECT: clonePlain(state.reportObject),
      COMPACT_SUMMARY: state.compactSummary,
      FULL_PACKET_TEXT: state.fullPacketText,
      SOUTH_SECONDARY_OUTPUT_NOTES: state.southSecondaryOutputNotes.length
        ? state.southSecondaryOutputNotes.join(" | ")
        : FALLBACK.NONE
    };
  }

  function composeSouthReport(input = {}, options = {}) {
    const state = makeState();

    try {
      const report = normalizeReportObject(input, state, options);
      const outputStatus = determineOutputStatus(input, report, state);

      report.SOUTH_OUTPUT_STATUS = outputStatus;
      report.SOUTH_MEANING_PRESERVED = outputStatus === STATUS.COMPLETE ? "true" : "false";
      report.SOUTH_IMPLEMENTATION_CONTRACT = IMPLEMENTATION_CONTRACT;
      report.SOUTH_IMPLEMENTATION_RECEIPT = IMPLEMENTATION_RECEIPT;

      const fullPacketText = composeFullPacketText(report, options);
      const compactSummary = composeCompactSummary(report);

      state.reportObject = report;
      state.compactSummary = compactSummary;
      state.fullPacketText = fullPacketText;
      state.southPacketFieldCount = Object.keys(report).length;
      state.southOutputStatus = outputStatus;
      state.southOutputComplete = outputStatus === STATUS.COMPLETE ? "true" : "false";
      state.southStatus = outputStatus === STATUS.COMPLETE ? STATUS.COMPLETE : STATUS.PARTIAL;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        output: clonePlain(makeOutputObject(state)),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.southStatus = STATUS.FAILED;
      state.southOutputStatus = STATUS.FAILED;
      state.southOutputComplete = "false";
      state.southMeaningPreservationStatus = "FAILED";
      addOutputNote(state, `SOUTH_COMPOSE_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);

      const fallbackReport = normalizeReportObject({}, state, options || {});
      fallbackReport.SOUTH_OUTPUT_STATUS = STATUS.FAILED;
      fallbackReport.SOUTH_MEANING_PRESERVED = "false";
      fallbackReport.SOUTH_IMPLEMENTATION_CONTRACT = IMPLEMENTATION_CONTRACT;
      fallbackReport.SOUTH_IMPLEMENTATION_RECEIPT = IMPLEMENTATION_RECEIPT;

      state.reportObject = fallbackReport;
      state.compactSummary = composeCompactSummary(fallbackReport);
      state.fullPacketText = composeFullPacketText(fallbackReport, options || {});
      state.southPacketFieldCount = Object.keys(fallbackReport).length;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        implementationContract: IMPLEMENTATION_CONTRACT,
        implementationReceipt: IMPLEMENTATION_RECEIPT,
        error: bounded(error && error.message ? error.message : error, 1000),
        output: clonePlain(makeOutputObject(state)),
        state: clonePlain(lastState)
      };
    }
  }

  function getSouthReceipt() {
    const state = lastState || makeState();
    const output = lastReport || makeOutputObject(state);

    return {
      childRole: "SOUTH_REPORT_PACKET_OUTPUT",
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      servesNorth: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      calibrationDecisionAuthority: false,
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

      fullPacketTextOwned: true,
      compactSummaryOwned: true,
      secondaryEvidenceSerializationOwned: true,
      packetSafeFallbackNormalizationOwned: true,
      northAnchorMeaningPreservationOwned: true,
      calibrationFieldsPreserved: true,
      newsAlignmentFieldsPreserved: true,
      fibonacciSynchronizationFieldsPreserved: true,
      westRenderedProofFieldsPreserved: true,
      eastCurrentSpreadFieldsPreserved: true,
      southOutputNotesRemainSeparate: true,

      f13Claimed: false,
      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      lastSouthStatus: output.SOUTH_STATUS || STATUS.READY,
      lastSouthOutputStatus: output.SOUTH_OUTPUT_STATUS || FALLBACK.UNKNOWN,
      lastSouthOutputComplete: output.SOUTH_OUTPUT_COMPLETE || "false",
      lastSouthMeaningPreservationStatus: output.SOUTH_MEANING_PRESERVATION_STATUS || FALLBACK.UNKNOWN,
      updatedAt: nowIso()
    };
  }

  function getSouthState() {
    return clonePlain(lastState || makeState());
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastReport = makeOutputObject(state);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticSouth = api;
    root.HEARTH.diagnosticRailSouth = api;
    root.HEARTH.diagnosticSouthReceipt = getSouthReceipt();
    root.HEARTH.diagnosticRailSouthReceipt = getSouthReceipt();
    root.HEARTH.diagnosticSouthOutput = clonePlain(lastReport);
    root.HEARTH.diagnosticRailSouthOutput = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_OUTPUT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_OUTPUT = clonePlain(lastReport);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    composeSouthReport,
    composeCompactSummary,
    getSouthReceipt,
    getSouthState,

    supportsNorthAnchorMeaningPreservation: true,
    supportsCalibrationFieldPreservation: true,
    supportsNewsAlignmentFieldPreservation: true,
    supportsFibonacciSynchronizationFieldPreservation: true,
    supportsWestRenderedProofFieldPreservation: true,
    supportsEastCurrentSpreadFieldPreservation: true,

    finalPrimaryCaseAuthority: false,
    finalRecommendationAuthority: false,
    calibrationDecisionAuthority: false,
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
