// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1
// Full-file replacement.
// Diagnostic rail SOUTH child only.
// Purpose:
// - Provide report-output / packet-expression support for the Hearth diagnostic rail.
// - Receive final diagnostic meaning from NORTH.
// - Normalize packet-safe fields without inventing evidence.
// - Compose compact summary and full packet text.
// - Preserve SOUTH output notes separately from diagnostic evidence notes unless NORTH explicitly merges them.
// - Preserve no F13, no F21, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
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

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";
  const VERSION = "2026-06-02.hearth-diagnostic-rail-south-report-packet-output-v1";

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
    "SECONDARY_EVIDENCE_NOTES",
    "RECOMMENDED_NEXT_OWNER",
    "RECOMMENDED_NEXT_FILE",
    "RECOMMENDED_NEXT_ACTION"
  ]);

  const OPTIONAL_TRACE_FIELDS = Object.freeze([
    "EAST_SOURCE_READ_STATUS",
    "WEST_RENDERED_READ_STATUS",
    "CASE_1_SUPPORT",
    "CASE_2_SUPPORT",
    "CASE_3_SUPPORT",
    "CASE_4_SUPPORT",
    "CASE_5_SUPPORT",
    "CASE_6_SUPPORT",
    "CASE_7_SUPPORT"
  ]);

  const NO_CLAIM_FIELDS = Object.freeze([
    "f21EligibleForNorth",
    "f21ClaimedByDiagnosticRail",
    "readyTextAllowed",
    "readyTextClaimedByDiagnosticRail",
    "visualPassClaimed",
    "generatedImage",
    "graphicBox",
    "webGL"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;

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

  function safeTrim(value, fallback = "") {
    return safeString(value, fallback).replace(/\s+/g, " ").trim();
  }

  function bounded(value, limit = 4000) {
    return safeString(value).replace(/\n/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);
  }

  function packetValue(value, fallback = FALLBACK.UNKNOWN) {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value.map((entry) => bounded(entry, 1000)).filter(Boolean).join(" | ");
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

  function addOutputNote(state, note) {
    const clean = bounded(note, 1000);
    if (!clean) return;
    if (!state.southSecondaryOutputNotes.includes(clean)) {
      state.southSecondaryOutputNotes.push(clean);
    }
  }

  function normalizeNoteInput(value) {
    if (value === undefined || value === null || value === "" || value === FALLBACK.UNKNOWN) return [];

    if (Array.isArray(value)) {
      return value.map((entry) => bounded(entry, 1000)).filter(Boolean);
    }

    const text = safeString(value);
    if (!text || text === FALLBACK.NONE) return [];

    return text
      .split("|")
      .map((entry) => bounded(entry, 1000))
      .filter(Boolean);
  }

  function serializeEvidenceNotes(input, state, options) {
    const notes = [];
    const seen = new Set();

    const sources = [
      getValue(input, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(input, "EAST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(input, "WEST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(input, "NORTH_SECONDARY_EVIDENCE_NOTES", "")
    ];

    for (const source of sources) {
      const entries = normalizeNoteInput(source);
      for (const entry of entries) {
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

      southOutputComplete: "false",
      southOutputStatus: FALLBACK.UNKNOWN,
      southSecondaryOutputNotes: [],

      reportObject: {},
      compactSummary: "",
      fullPacketText: "",

      updatedAt: nowIso(),

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

  function normalizeReportObject(input, state, options) {
    const source = isObject(input) ? input : {};
    const report = {};

    if (!isObject(input)) {
      addOutputNote(state, "SOUTH_INPUT_NOT_OBJECT");
    }

    for (const field of REQUIRED_PACKET_FIELDS) {
      report[field] = getValue(source, field, FALLBACK.UNKNOWN);
    }

    report.PACKET_NAME = report.PACKET_NAME === FALLBACK.UNKNOWN ? REPORT_PACKET : report.PACKET_NAME;
    report.TARGET_ROUTE = report.TARGET_ROUTE === FALLBACK.UNKNOWN ? TARGET_ROUTE : report.TARGET_ROUTE;
    report.DIAGNOSTIC_ROUTE = report.DIAGNOSTIC_ROUTE === FALLBACK.UNKNOWN ? DIAGNOSTIC_ROUTE : report.DIAGNOSTIC_ROUTE;

    const suppliedTimestamp = getValue(source, "DIAGNOSTIC_TIMESTAMP", "");
    if (suppliedTimestamp) {
      report.DIAGNOSTIC_TIMESTAMP = suppliedTimestamp;
    } else {
      report.DIAGNOSTIC_TIMESTAMP = nowIso() || FALLBACK.UNKNOWN;
      addOutputNote(state, "SOUTH_TIMESTAMP_SUBSTITUTED");
    }

    report.PRIMARY_CASE = getValue(source, "PRIMARY_CASE", FALLBACK.UNKNOWN);
    report.RECOMMENDED_NEXT_OWNER = getValue(source, "RECOMMENDED_NEXT_OWNER", FALLBACK.UNKNOWN);
    report.RECOMMENDED_NEXT_FILE = getValue(source, "RECOMMENDED_NEXT_FILE", FALLBACK.UNKNOWN);
    report.RECOMMENDED_NEXT_ACTION = getValue(source, "RECOMMENDED_NEXT_ACTION", FALLBACK.UNKNOWN);

    report.SECONDARY_EVIDENCE_NOTES = serializeEvidenceNotes(source, state, options || {});

    for (const field of OPTIONAL_TRACE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(source, field)) {
        report[field] = getValue(source, field, FALLBACK.UNKNOWN);
      }
    }

    if (options && options.includeNoClaimFieldsInPacket === true) {
      report.f21EligibleForNorth = "false";
      report.f21ClaimedByDiagnosticRail = "false";
      report.readyTextAllowed = "false";
      report.readyTextClaimedByDiagnosticRail = "false";
      report.visualPassClaimed = "false";
      report.generatedImage = "false";
      report.graphicBox = "false";
      report.webGL = "false";
    }

    return report;
  }

  function determineOutputStatus(input, report, state) {
    if (!isObject(input)) return STATUS.PARTIAL;

    const requiredMeaningFields = [
      "PRIMARY_CASE",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION"
    ];

    const missingMeaning = requiredMeaningFields.some((field) => {
      const value = report[field];
      return value === FALLBACK.UNKNOWN || value === "" || value === undefined || value === null;
    });

    if (missingMeaning) {
      addOutputNote(state, "SOUTH_INPUT_FINAL_MEANING_PARTIAL");
      return STATUS.PARTIAL;
    }

    const requiredAccessFields = [
      "DIAGNOSTIC_TARGET_ACCESS_STATUS",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "SHOW_RECEIPT_BUTTON_EXISTS",
      "SHOW_RECEIPT_TARGET_IS_BUTTON",
      "RUNTIME_RELEASE_IS_LOCK"
    ];

    const partialAccess = requiredAccessFields.some((field) => {
      const value = report[field];
      return value === FALLBACK.UNKNOWN || value === FALLBACK.PARTIAL || value === FALLBACK.UNREADABLE || value === FALLBACK.INACCESSIBLE;
    });

    if (partialAccess) {
      addOutputNote(state, "SOUTH_INPUT_EVIDENCE_PARTIAL");
      return STATUS.PARTIAL;
    }

    return STATUS.COMPLETE;
  }

  function line(key, value) {
    return `${normalizeKey(key)}=${packetValue(value)}`;
  }

  function composeFullPacketText(report, options) {
    const lines = [];

    for (const field of REQUIRED_PACKET_FIELDS) {
      lines.push(line(field, report[field]));
    }

    if (options && options.includeOptionalTraceFields === true) {
      for (const field of OPTIONAL_TRACE_FIELDS) {
        if (Object.prototype.hasOwnProperty.call(report, field)) {
          lines.push(line(field, report[field]));
        }
      }
    }

    if (options && options.includeNoClaimFieldsInPacket === true) {
      for (const field of NO_CLAIM_FIELDS) {
        lines.push(line(field, "false"));
      }
    }

    return lines.join("\n");
  }

  function composeCompactSummary(input) {
    const source = isObject(input) ? input : {};

    const fields = [
      "TARGET_ROUTE",
      "DIAGNOSTIC_TARGET_ACCESS_STATUS",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "SHOW_RECEIPT_BUTTON_EXISTS",
      "SHOW_RECEIPT_TARGET_IS_BUTTON",
      "RUNTIME_RELEASE_IS_LOCK",
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
      SOUTH_OUTPUT_COMPLETE: state.southOutputComplete,
      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
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
      const fullPacketText = composeFullPacketText(report, options);
      const compactSummary = composeCompactSummary(report);

      state.reportObject = report;
      state.compactSummary = compactSummary;
      state.fullPacketText = fullPacketText;
      state.southOutputStatus = outputStatus;
      state.southOutputComplete = outputStatus === STATUS.COMPLETE ? "true" : "false";
      state.southStatus = outputStatus === STATUS.COMPLETE ? STATUS.COMPLETE : STATUS.PARTIAL;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        output: clonePlain(makeOutputObject(state)),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.southStatus = STATUS.FAILED;
      state.southOutputStatus = STATUS.FAILED;
      state.southOutputComplete = "false";
      addOutputNote(state, `SOUTH_COMPOSE_ERROR:${bounded(error && error.message ? error.message : error, 800)}`);

      const fallbackReport = normalizeReportObject({}, state, options || {});
      state.reportObject = fallbackReport;
      state.compactSummary = composeCompactSummary(fallbackReport);
      state.fullPacketText = composeFullPacketText(fallbackReport, options || {});
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: bounded(error && error.message ? error.message : error, 1000),
        output: clonePlain(makeOutputObject(state)),
        state: clonePlain(lastState)
      };
    }
  }

  function getSouthReceipt() {
    return {
      childRole: "SOUTH_REPORT_PACKET_OUTPUT",
      contract: CONTRACT,
      receipt: RECEIPT,
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

      fullPacketTextOwned: true,
      compactSummaryOwned: true,
      secondaryEvidenceSerializationOwned: true,
      packetSafeFallbackNormalizationOwned: true,
      southOutputNotesRemainSeparate: true,

      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      lastSouthStatus: lastReport ? lastReport.SOUTH_STATUS : STATUS.READY,
      lastSouthOutputStatus: lastReport ? lastReport.SOUTH_OUTPUT_STATUS : FALLBACK.UNKNOWN,
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

    root.HEARTH_DIAGNOSTIC_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getSouthReceipt();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    composeSouthReport,
    composeCompactSummary,
    getSouthReceipt,
    getSouthState,

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
