// /assets/hearth/hearth.probe.south.js
// HEARTH_PROBE_SOUTH_DIAGNOSTIC_RAIL_PACKET_CONFORMANCE_TNT_v1
// Full-file addition.
// Probe SOUTH only.
// Purpose:
// - Inspect the already-loaded SOUTH diagnostic rail child without renewing it.
// - Verify that /assets/hearth/hearth.diagnostic.south.js is present, readable, and exporting the expected SOUTH API.
// - Verify SOUTH packet-output conformance:
//   - REPORT_OBJECT
//   - FULL_PACKET_TEXT
//   - COMPACT_SUMMARY
//   - SOUTH_OUTPUT_STATUS
// - Verify that SOUTH preserves NORTH-selected meaning fields.
// - Verify that SOUTH does not claim F13/F21/readiness/visual-pass authority.
// - Verify that SOUTH projects control, queen, bishop, lab/canvas, four-way canvas handoff, and JS funnel fields without overwriting priority evidence.
// - Publish probe evidence for a future NORTH probe/parent without mutating the diagnostic rail.
// Does not own:
// - SOUTH renewal
// - NORTH adjudication
// - EAST served-source evidence
// - WEST rendered-target evidence
// - diagnostic UI
// - production mutation
// - repair
// - runtime restart
// - Canvas release
// - Macro West release
// - synthetic activation
// - F13 canvas claim
// - F21 claim

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_PROBE_SOUTH_DIAGNOSTIC_RAIL_PACKET_CONFORMANCE_TNT_v1";
  const RECEIPT =
    "HEARTH_PROBE_SOUTH_DIAGNOSTIC_RAIL_PACKET_CONFORMANCE_RECEIPT_v1";

  const VERSION =
    "2026-06-05.hearth-probe-south-diagnostic-rail-packet-conformance-v1";

  const FILE = "/assets/hearth/hearth.probe.south.js";
  const TARGET_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const EXPECTED_SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  const EXPECTED_SOUTH_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const EXPECTED_SOUTH_IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v7";

  const PREVIOUS_SOUTH_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6";
  const LINEAGE_SOUTH_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_LAB_CANVAS_BRIDGE_REPORT_CONFORMANCE_TNT_v5";
  const BASELINE_SOUTH_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

  const EXPECTED_CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";

  const EXPECTED_INDEX_FILE = "/showroom/globe/hearth/index.js";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";

  const EXPECTED_ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";

  const EXPECTED_CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const EXPECTED_JS_FUNNEL = [
    EXPECTED_INDEX_FILE,
    EXPECTED_ROUTE_CONDUCTOR_FILE,
    EXPECTED_CONTROL_FILE,
    EXPECTED_CANVAS_FILE
  ].join(" -> ");

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NONE: "none",
    NOT_FOUND: "NOT_FOUND",
    MISSING: "MISSING",
    PRESENT: "PRESENT",
    UNREADABLE: "UNREADABLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
    VALID: "VALID",
    INVALID: "INVALID",
    PARTIAL: "PARTIAL",
    COMPLETE: "COMPLETE",
    PASS: "PASS",
    FAIL: "FAIL",
    HELD: "HELD",
    READY: "READY",
    ACTIVE: "ACTIVE",
    HANDSHAKE_VALID: "HANDSHAKE_VALID",
    HANDSHAKE_PENDING: "HANDSHAKE_PENDING",
    EXPECTED_NOT_YET_BUILT: "EXPECTED_NOT_YET_BUILT",
    EXPECTED_NOT_YET_WIRED: "EXPECTED_NOT_YET_WIRED"
  });

  const PROBE_STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    CLEAN: "SOUTH_PROBE_CLEAN",
    HOLD: "SOUTH_PROBE_HOLD",
    PARTIAL: "SOUTH_PROBE_PARTIAL",
    FAILED: "SOUTH_PROBE_FAILED"
  });

  const SOUTH_AUTHORITY_PATHS = Object.freeze([
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.diagnosticSouthPriorityControlQueenPacketConformance",
    "DEXTER_LAB.hearthDiagnosticSouth",
    "DEXTER_LAB.hearthDiagnosticRailSouth",
    "DEXTER_LAB.hearthDiagnosticSouthPriorityControlQueenPacketConformance",
    "HEARTH_DIAGNOSTIC_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE"
  ]);

  const SOUTH_OUTPUT_PATHS = Object.freeze([
    "HEARTH.diagnosticSouthOutput",
    "HEARTH.diagnosticRailSouthOutput",
    "HEARTH_DIAGNOSTIC_SOUTH_OUTPUT",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_OUTPUT"
  ]);

  const SOUTH_REPORT_PATHS = Object.freeze([
    "HEARTH.diagnosticSouthReport",
    "HEARTH.diagnosticRailSouthReport",
    "HEARTH_DIAGNOSTIC_SOUTH_REPORT",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT"
  ]);

  const REQUIRED_API = Object.freeze([
    "composeSouthReport",
    "composeCompactSummary",
    "getSouthReceipt",
    "getSouthState"
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

  const VERDICT_FIELD_MAP = Object.freeze({
    PRIMARY_CASE: "primaryCase",
    CALIBRATION_STATUS: "calibrationStatus",
    CALIBRATION_HOLD_REASON: "calibrationHoldReason",
    DIAGNOSTIC_RAIL_CLEAN: "diagnosticRailClean",
    CALIBRATION_POINT_REACHED: "calibrationPointReached",
    RECOMMENDED_NEXT_OWNER: "recommendedNextOwner",
    RECOMMENDED_NEXT_FILE: "recommendedNextFile",
    RECOMMENDED_NEXT_ACTION: "recommendedNextAction"
  });

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

  const OUTPUT_REQUIRED_FIELDS = Object.freeze([
    "REPORT_OBJECT",
    "FULL_PACKET_TEXT",
    "COMPACT_SUMMARY",
    "SOUTH_OUTPUT_STATUS"
  ]);

  const REPORT_CORE_FIELDS = Object.freeze([
    "PACKET_NAME",
    "TARGET_ROUTE",
    "DIAGNOSTIC_ROUTE",
    "DIAGNOSTIC_TIMESTAMP",
    "SOUTH_IMPLEMENTATION_CONTRACT",
    "SOUTH_IMPLEMENTATION_RECEIPT",
    "SOUTH_OUTPUT_STATUS",
    "SOUTH_OUTPUT_VALID",
    "SOUTH_MEANING_PRESERVED"
  ]);

  const PLANETARY_CONTROL_FIELDS = Object.freeze([
    "PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE",
    "PLANETARY_CONTROL_FOOTPRINT_STATUS",
    "PLANETARY_CONTROL_DIAGNOSTIC_STATUS",
    "PLANETARY_CONTROL_GATE_STATUS",
    "EXPECTED_CONTROL_FILE",
    "EXPECTED_CONTROL_CONTRACT",
    "CONTROL_FILE_PRESENT",
    "CONTROL_FILE_STATUS",
    "CONTROL_FILE_HANDSHAKE_STATUS",
    "CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5",
    "CONTROL_FILE_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET",
    "PLANETARY_VIEW_CONTROL_STATUS",
    "PLANETARY_VIEW_TOUCH_STATUS",
    "PLANETARY_VIEW_DRAG_STATUS",
    "PLANETARY_VIEW_MOTION_STATUS",
    "PLANETARY_VIEW_INPUT_STATUS"
  ]);

  const JS_FUNNEL_FIELDS = Object.freeze([
    "JS_INTEGRATION_FUNNEL",
    "JS_INDEX_FILE",
    "JS_INDEX_CONTRACT",
    "JS_ROUTE_CONDUCTOR_FILE",
    "JS_ROUTE_CONDUCTOR_CONTRACT",
    "JS_CONTROL_FILE",
    "JS_CONTROL_CONTRACT",
    "JS_CANVAS_FILE"
  ]);

  const LAB_CANVAS_BRIDGE_FIELDS = Object.freeze([
    "LAB_BRIDGE_SCHEMA_ACTIVE",
    "LAB_BRIDGE_STATUS",
    "DIAGNOSTIC_LAB_MIRROR_STATUS",
    "LAB_TO_CANVAS_SHARED_LANGUAGE_STATUS",
    "LAB_CANVAS_AUTHORITY_BOUNDARY_STATUS",
    "LAB_CANVAS_BRIDGE_NOT_AUTHORITY",
    "LAB_CANVAS_BRIDGE_OUTPUT_ONLY"
  ]);

  const BISHOP_BRIDGE_FIELDS = Object.freeze([
    "BISHOP_BRIDGE_SCHEMA_ACTIVE",
    "BISHOP_BRIDGE_STATUS",
    "BISHOP_LANE_EXPECTED_COUNT",
    "WEST_TRUSTS_BISHOP_HUBS_ONLY",
    "BISHOP_WEST_AUTHORITY_BOUNDARY_PRESERVED"
  ]);

  const FOUR_WAY_CANVAS_HANDOFF_FIELDS = Object.freeze([
    "FOUR_WAY_CANVAS_HANDOFF_SCHEMA_ACTIVE",
    "FOUR_WAY_CANVAS_HANDOFF_STATUS",
    "CANVAS_HANDOFF_NORTH_STATUS",
    "CANVAS_HANDOFF_EAST_STATUS",
    "CANVAS_HANDOFF_SOUTH_STATUS",
    "CANVAS_HANDOFF_WEST_STATUS",
    "SECOND_CYCLE_CANVAS_HANDOFF_PRESERVED",
    "TWO_CYCLE_PREMISE_PRESERVED"
  ]);

  const BISHOP_QUEEN_FIELDS = Object.freeze([
    "BISHOP_QUEEN_CANVAS_SCHEMA_ACTIVE",
    "BISHOP_QUEEN_CANVAS_RECOGNITION_STATUS",
    "BISHOP_QUEEN_CANVAS_FUNNEL_STATUS",
    "BISHOP_QUEEN_CANVAS_AUTHORITY_SOURCE",
    "QUEEN_HANDSHAKE_STATUS",
    "QUEEN_HANDSHAKE_ACCEPTED",
    "QUEEN_VISIBLE_GLOBE_PROOF_READY",
    "QUEEN_CANVAS_RECOGNITION_STATUS",
    "BISHOP_POINTER_FINGER_LANGUAGE_ACTIVE",
    "BISHOP_POINTER_FINGER_AUTHORITY_STATUS",
    "BISHOP_CHILD_FILE_KNOWLEDGE_BOUNDARY",
    "BISHOP_HUBS_OPAQUE_TO_DIAGNOSTIC",
    "CANVAS_RECEIVER_RECOGNITION_FUNNEL_STATUS",
    "SOUTH_PRIORITY_CONTROL_EVIDENCE_STATUS",
    "SOUTH_PRIORITY_QUEEN_EVIDENCE_STATUS",
    "SOUTH_PRIORITY_DERELICT_FIX_STATUS"
  ]);

  const FORMAL_GROUPS = Object.freeze({
    REPORT_CORE_FIELDS,
    PLANETARY_CONTROL_FIELDS,
    JS_FUNNEL_FIELDS,
    LAB_CANVAS_BRIDGE_FIELDS,
    BISHOP_BRIDGE_FIELDS,
    FOUR_WAY_CANVAS_HANDOFF_FIELDS,
    BISHOP_QUEEN_FIELDS
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastEvidence = null;

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

  function bounded(value, limit = 6000) {
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

  function readPath(base, path) {
    try {
      const parts = safeString(path).split(".");
      let cursor = base;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function getRaw(source, key, fallback = undefined) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      return source[key] === undefined || source[key] === null ? fallback : source[key];
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

  function getValue(source, key, fallback = FALLBACK.UNKNOWN) {
    const raw = getRaw(source, key, undefined);
    if (raw === undefined || raw === null || raw === "") return fallback;

    if (isObject(raw)) {
      try {
        return JSON.stringify(raw);
      } catch (_error) {
        return fallback;
      }
    }

    return bounded(raw, 6000) || fallback;
  }

  function unknownish(value) {
    const text = safeString(value).trim();

    return (
      text === "" ||
      text === FALLBACK.UNKNOWN ||
      text === FALLBACK.NOT_FOUND ||
      text === FALLBACK.MISSING ||
      text === FALLBACK.UNREADABLE ||
      text === FALLBACK.INSUFFICIENT_EVIDENCE
    );
  }

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function isFalseLike(value) {
    return (
      value === false ||
      value === "false" ||
      value === "FALSE" ||
      value === 0 ||
      value === "0"
    );
  }

  function isTrueLike(value) {
    return (
      value === true ||
      value === "true" ||
      value === "TRUE" ||
      value === 1 ||
      value === "1"
    );
  }

  function valueReady(value) {
    const text = safeString(value).toUpperCase();

    return (
      text === "TRUE" ||
      text === "READY" ||
      text === "ACTIVE" ||
      text === "VALID" ||
      text === "COMPLETE" ||
      text.includes("READY") ||
      text.includes("ACTIVE") ||
      text.includes("VALID") ||
      text.includes("COMPLETE") ||
      text.includes("HANDSHAKE_VALID")
    );
  }

  function valueBadClaim(value) {
    if (value === undefined || value === null || value === "") return false;
    if (isTrueLike(value)) return true;
    const text = safeString(value).toUpperCase();
    return text === "TRUE" || text === "CLAIMED" || text === "ALLOWED";
  }

  function fieldPresent(source, key) {
    const raw = getRaw(source, key, undefined);
    return raw !== undefined && raw !== null && raw !== "";
  }

  function countPresent(source, fields) {
    let count = 0;

    for (const field of fields || []) {
      if (fieldPresent(source, field)) count += 1;
    }

    return count;
  }

  function groupStatus(source, fields) {
    const total = fields.length;
    const present = countPresent(source, fields);

    if (present === total) return { present, total, status: FALLBACK.VALID };
    if (present > 0) return { present, total, status: FALLBACK.PARTIAL };
    return { present, total, status: FALLBACK.MISSING };
  }

  function addNote(state, note) {
    const clean = bounded(note, 1800);
    if (!clean) return;
    if (!state.notes.includes(clean)) state.notes.push(clean);
  }

  function callReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getSouthReceipt",
      "getReceiptLight",
      "getReceipt",
      "getState",
      "getSouthState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptObject)) return authority.receiptObject;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function findObjectByPaths(paths) {
    for (const path of paths || []) {
      const value = readPath(root, path);
      if (value && isObject(value)) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function readSouthState(authority) {
    if (!authority || !isObject(authority) || !isFunction(authority.getSouthState)) return null;

    try {
      const state = authority.getSouthState();
      return isObject(state) ? state : null;
    } catch (_error) {
      return null;
    }
  }

  function resolveSouthSurface(options, state) {
    const authorityFound = findObjectByPaths(SOUTH_AUTHORITY_PATHS);
    const authority = authorityFound.value;
    const receipt = callReceipt(authority) || {};
    const southState = readSouthState(authority) || {};

    state.southAuthorityObserved = Boolean(authority);
    state.southAuthoritySource = authorityFound.path;
    state.southReceiptObserved = Boolean(receipt && Object.keys(receipt).length);
    state.southStateObserved = Boolean(southState && Object.keys(southState).length);

    state.southContract = getValue(receipt, "contract", getValue(authority || {}, "contract", FALLBACK.UNKNOWN));
    state.southReceipt = getValue(receipt, "receipt", getValue(authority || {}, "receipt", FALLBACK.UNKNOWN));
    state.southImplementationContract = getValue(receipt, "implementationContract", FALLBACK.UNKNOWN);
    state.southImplementationReceipt = getValue(receipt, "implementationReceipt", FALLBACK.UNKNOWN);

    for (const method of REQUIRED_API) {
      state.apiAvailability[method] = Boolean(authority && isFunction(authority[method]));
    }

    const optionOutput = isObject(options && options.outputObject) ? options.outputObject : null;
    const optionReport = isObject(options && options.reportObject) ? options.reportObject : null;

    const globalOutput = findObjectByPaths(SOUTH_OUTPUT_PATHS);
    const globalReport = findObjectByPaths(SOUTH_REPORT_PATHS);

    let output = optionOutput || globalOutput.value || null;
    let outputSource = optionOutput ? "options.outputObject" : globalOutput.path;

    if (!output && isObject(southState.outputObject)) {
      output = southState.outputObject;
      outputSource = "getSouthState.outputObject";
    }

    if (!output && isObject(southState.output)) {
      output = southState.output;
      outputSource = "getSouthState.output";
    }

    let report = optionReport || null;
    let reportSource = optionReport ? "options.reportObject" : "NONE";

    if (!report && output && isObject(output.REPORT_OBJECT)) {
      report = output.REPORT_OBJECT;
      reportSource = `${outputSource}.REPORT_OBJECT`;
    }

    if (!report && globalReport.value) {
      report = globalReport.value;
      reportSource = globalReport.path;
    }

    if (!report && isObject(southState.reportObject)) {
      report = southState.reportObject;
      reportSource = "getSouthState.reportObject";
    }

    return {
      authority,
      receipt,
      southState,
      output,
      outputSource,
      report,
      reportSource
    };
  }

  function validateAuthority(state) {
    if (!state.southAuthorityObserved) {
      state.authorityStatus = FALLBACK.MISSING;
      addNote(state, "SOUTH_AUTHORITY_NOT_OBSERVED");
      return;
    }

    const contractOk = state.southContract === EXPECTED_SOUTH_CONTRACT;
    const implementationOk = state.southImplementationContract === EXPECTED_SOUTH_IMPLEMENTATION_CONTRACT;
    const implementationLineageOk = [
      EXPECTED_SOUTH_IMPLEMENTATION_CONTRACT,
      PREVIOUS_SOUTH_IMPLEMENTATION_CONTRACT,
      LINEAGE_SOUTH_IMPLEMENTATION_CONTRACT,
      BASELINE_SOUTH_IMPLEMENTATION_CONTRACT
    ].includes(state.southImplementationContract);

    state.southContractRecognized = boolText(contractOk, "false");
    state.southImplementationRecognized = boolText(implementationOk || implementationLineageOk, "false");

    const apiMissing = REQUIRED_API.filter((method) => state.apiAvailability[method] !== true);
    state.apiMissing = apiMissing;

    if (!contractOk) addNote(state, `SOUTH_CONTRACT_UNRECOGNIZED:${state.southContract}`);
    if (!implementationOk && implementationLineageOk) addNote(state, `SOUTH_IMPLEMENTATION_LINEAGE_ACCEPTED:${state.southImplementationContract}`);
    if (!implementationLineageOk) addNote(state, `SOUTH_IMPLEMENTATION_UNRECOGNIZED:${state.southImplementationContract}`);
    if (apiMissing.length) addNote(state, `SOUTH_API_MISSING:${apiMissing.join(",")}`);

    state.authorityStatus = contractOk && implementationLineageOk && apiMissing.length === 0
      ? FALLBACK.VALID
      : FALLBACK.PARTIAL;
  }

  function validateOutputShape(surface, state) {
    const output = surface.output || {};
    const report = surface.report || {};

    state.outputObserved = isObject(surface.output);
    state.outputSource = surface.outputSource;
    state.reportObserved = isObject(surface.report);
    state.reportSource = surface.reportSource;

    state.fullPacketTextPresent = typeof output.FULL_PACKET_TEXT === "string" && output.FULL_PACKET_TEXT.trim().length > 0;
    state.compactSummaryPresent = typeof output.COMPACT_SUMMARY === "string" && output.COMPACT_SUMMARY.trim().length > 0;
    state.reportObjectPresent = isObject(output.REPORT_OBJECT) || isObject(surface.report);

    state.outputRequiredPresentCount = countPresent(output, OUTPUT_REQUIRED_FIELDS);
    state.outputRequiredTotal = OUTPUT_REQUIRED_FIELDS.length;

    state.southOutputStatus = getValue(output, "SOUTH_OUTPUT_STATUS", getValue(report, "SOUTH_OUTPUT_STATUS", FALLBACK.UNKNOWN));
    state.southOutputValid = getValue(output, "SOUTH_OUTPUT_VALID", getValue(report, "SOUTH_OUTPUT_VALID", FALLBACK.UNKNOWN));
    state.southMeaningPreserved = getValue(output, "SOUTH_MEANING_PRESERVED", getValue(report, "SOUTH_MEANING_PRESERVED", FALLBACK.UNKNOWN));
    state.southOutputSchemaValid = getValue(output, "SOUTH_OUTPUT_SCHEMA_VALID", getValue(report, "SOUTH_OUTPUT_SCHEMA_VALID", FALLBACK.UNKNOWN));

    const outputShapeOk = Boolean(
      state.outputObserved &&
      state.reportObjectPresent &&
      state.fullPacketTextPresent &&
      state.compactSummaryPresent &&
      !unknownish(state.southOutputStatus)
    );

    state.outputShapeStatus = outputShapeOk ? FALLBACK.VALID : FALLBACK.PARTIAL;

    if (!state.outputObserved) addNote(state, "SOUTH_OUTPUT_OBJECT_NOT_OBSERVED");
    if (!state.reportObjectPresent) addNote(state, "SOUTH_REPORT_OBJECT_NOT_OBSERVED");
    if (!state.fullPacketTextPresent) addNote(state, "SOUTH_FULL_PACKET_TEXT_MISSING");
    if (!state.compactSummaryPresent) addNote(state, "SOUTH_COMPACT_SUMMARY_MISSING");
  }

  function validateMeaning(surface, state) {
    const report = surface.report || {};
    const verdict = isObject(getRaw(report, "NORTH_VERDICT", null)) ? getRaw(report, "NORTH_VERDICT", null) : null;

    const missing = [];
    const verdictMismatch = [];

    for (const field of NORTH_MEANING_FIELDS) {
      const reportValue = getValue(report, field, FALLBACK.UNKNOWN);

      if (unknownish(reportValue)) {
        missing.push(field);
        continue;
      }

      if (verdict) {
        const verdictKey = VERDICT_FIELD_MAP[field];
        const verdictValue = getValue(verdict, verdictKey, FALLBACK.UNKNOWN);

        if (!unknownish(verdictValue) && reportValue !== verdictValue) {
          verdictMismatch.push(`${field}:report=${reportValue};verdict=${verdictValue}`);
        }
      }
    }

    state.meaningFieldsMissing = missing;
    state.meaningVerdictMismatch = verdictMismatch;
    state.northVerdictObserved = Boolean(verdict);

    const explicitSouthMeaning = getValue(report, "SOUTH_MEANING_PRESERVED", state.southMeaningPreserved);

    state.meaningFieldsPresent = boolText(missing.length === 0, "false");
    state.meaningVerdictAligned = verdict ? boolText(verdictMismatch.length === 0, "false") : FALLBACK.UNKNOWN;
    state.meaningPreservationField = explicitSouthMeaning;

    state.meaningStatus = missing.length === 0 && verdictMismatch.length === 0
      ? FALLBACK.VALID
      : FALLBACK.INVALID;

    if (missing.length) addNote(state, `SOUTH_NORTH_MEANING_FIELDS_MISSING:${missing.join(",")}`);
    if (verdictMismatch.length) addNote(state, `SOUTH_NORTH_VERDICT_MISMATCH:${verdictMismatch.join(" | ")}`);
    if (explicitSouthMeaning === "false") addNote(state, "SOUTH_REPORT_DECLARED_MEANING_NOT_PRESERVED");
  }

  function validateNoClaim(surface, state) {
    const sources = [
      { name: "receipt", value: surface.receipt || {} },
      { name: "southState", value: surface.southState || {} },
      { name: "output", value: surface.output || {} },
      { name: "report", value: surface.report || {} }
    ];

    const reportVerdict = getRaw(surface.report || {}, "NORTH_VERDICT", null);
    if (isObject(reportVerdict)) {
      sources.push({ name: "northVerdict", value: reportVerdict });
    }

    const violations = [];

    for (const source of sources) {
      for (const field of NO_CLAIM_FIELDS) {
        const raw = getRaw(source.value, field, undefined);
        if (valueBadClaim(raw)) violations.push(`${source.name}.${field}=${safeString(raw)}`);
      }

      for (const field of UPPER_NO_CLAIM_FIELDS) {
        const raw = getRaw(source.value, field, undefined);
        if (valueBadClaim(raw)) violations.push(`${source.name}.${field}=${safeString(raw)}`);
      }
    }

    state.noClaimViolations = violations;
    state.noClaimStatus = violations.length === 0 ? FALLBACK.VALID : FALLBACK.INVALID;

    if (violations.length) addNote(state, `SOUTH_NO_CLAIM_BOUNDARY_VIOLATION:${violations.join(" | ")}`);
    else addNote(state, "SOUTH_NO_CLAIM_BOUNDARY_PASSED");
  }

  function validateControlProjection(surface, state) {
    const report = surface.report || {};

    const controlFile = getValue(report, "EXPECTED_CONTROL_FILE", getValue(report, "CONTROL_FILE", FALLBACK.UNKNOWN));
    const controlContract = getValue(report, "EXPECTED_CONTROL_CONTRACT", getValue(report, "CONTROL_FILE_CONTRACT", FALLBACK.UNKNOWN));
    const present = getValue(report, "CONTROL_FILE_PRESENT", FALLBACK.UNKNOWN);
    const status = getValue(report, "CONTROL_FILE_STATUS", FALLBACK.UNKNOWN);
    const handshake = getValue(report, "CONTROL_FILE_HANDSHAKE_STATUS", getValue(report, "CONTROL_HANDSHAKE_STATUS", FALLBACK.UNKNOWN));
    const absenceNotCase5 = getValue(report, "CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5", getValue(report, "CONTROL_ABSENCE_IS_CASE_5", FALLBACK.UNKNOWN));
    const motion = getValue(report, "MOTION_TOUCH_STATUS", FALLBACK.UNKNOWN);
    const drag = getValue(report, "DRAG_STATUS", FALLBACK.UNKNOWN);
    const view = getValue(report, "VIEW_CONTROL_STATUS", FALLBACK.UNKNOWN);

    const expectedFileOk = controlFile === EXPECTED_CONTROL_FILE || controlFile === FALLBACK.UNKNOWN;
    const expectedContractOk = controlContract === EXPECTED_CONTROL_CONTRACT || controlContract === FALLBACK.UNKNOWN || controlContract === FALLBACK.EXPECTED_NOT_YET_BUILT;

    const presentReady = isTrueLike(present) && valueReady(status);
    const statusReady = valueReady(status) || valueReady(handshake) || valueReady(motion) || valueReady(drag) || valueReady(view);
    const absenceExpected = status === FALLBACK.EXPECTED_NOT_YET_BUILT || status === FALLBACK.EXPECTED_NOT_YET_WIRED;
    const notCase5Ok =
      absenceNotCase5 === "true" ||
      absenceNotCase5 === "false" ||
      getValue(report, "CONTROL_ABSENCE_IS_CASE_5", "false") === "false";

    state.controlProjectionDetails = {
      controlFile,
      controlContract,
      present,
      status,
      handshake,
      motion,
      drag,
      view,
      absenceNotCase5
    };

    state.controlProjectionStatus = expectedFileOk && expectedContractOk && notCase5Ok && (presentReady || statusReady || absenceExpected || !unknownish(status))
      ? FALLBACK.VALID
      : FALLBACK.PARTIAL;

    if (!expectedFileOk) addNote(state, `SOUTH_CONTROL_FILE_TARGET_MISMATCH:${controlFile}`);
    if (!expectedContractOk) addNote(state, `SOUTH_CONTROL_CONTRACT_TARGET_MISMATCH:${controlContract}`);
    if (!notCase5Ok) addNote(state, "SOUTH_CONTROL_ABSENCE_CASE5_BOUNDARY_UNCLEAR");
    if (presentReady || statusReady) addNote(state, "SOUTH_CONTROL_READY_PROJECTION_PRESENT");
    if (absenceExpected) addNote(state, "SOUTH_CONTROL_EXPECTED_ABSENCE_PROJECTION_PRESENT");
  }

  function validateQueenProjection(surface, state) {
    const report = surface.report || {};

    const schema = getValue(report, "BISHOP_QUEEN_CANVAS_SCHEMA_ACTIVE", FALLBACK.UNKNOWN);
    const recognition = getValue(report, "BISHOP_QUEEN_CANVAS_RECOGNITION_STATUS", FALLBACK.UNKNOWN);
    const funnel = getValue(report, "BISHOP_QUEEN_CANVAS_FUNNEL_STATUS", FALLBACK.UNKNOWN);
    const queenStatus = getValue(report, "QUEEN_HANDSHAKE_STATUS", FALLBACK.UNKNOWN);
    const queenAccepted = getValue(report, "QUEEN_HANDSHAKE_ACCEPTED", FALLBACK.UNKNOWN);
    const visibleReady = getValue(report, "QUEEN_VISIBLE_GLOBE_PROOF_READY", FALLBACK.UNKNOWN);
    const receiverStatus = getValue(report, "CANVAS_RECEIVER_RECOGNITION_FUNNEL_STATUS", FALLBACK.UNKNOWN);
    const priorityQueen = getValue(report, "SOUTH_PRIORITY_QUEEN_EVIDENCE_STATUS", FALLBACK.UNKNOWN);
    const derelictFix = getValue(report, "SOUTH_PRIORITY_DERELICT_FIX_STATUS", FALLBACK.UNKNOWN);

    const routeRecognized =
      valueReady(schema) ||
      /RECOGNIZED|FUNNEL/i.test(recognition) ||
      /RECOGNIZED|FUNNEL/i.test(funnel) ||
      /RECOGNIZED|FUNNEL/i.test(receiverStatus);

    const queenProjected =
      /QUEEN|HANDSHAKE|VISIBLE|PROOF|RECOGNITION/i.test(queenStatus) ||
      isTrueLike(queenAccepted) ||
      valueReady(visibleReady) ||
      /QUEEN|PROJECTED|PRESENT|INSUFFICIENT/i.test(priorityQueen);

    state.queenProjectionDetails = {
      schema,
      recognition,
      funnel,
      queenStatus,
      queenAccepted,
      visibleReady,
      receiverStatus,
      priorityQueen,
      derelictFix
    };

    state.queenProjectionStatus = routeRecognized || queenProjected
      ? FALLBACK.VALID
      : FALLBACK.PARTIAL;

    if (routeRecognized) addNote(state, "SOUTH_BISHOP_QUEEN_CANVAS_RECOGNITION_PROJECTED");
    if (queenProjected) addNote(state, "SOUTH_QUEEN_HANDSHAKE_FIELD_PROJECTED");
    if (unknownish(derelictFix)) addNote(state, "SOUTH_PRIORITY_DERELICT_FIX_STATUS_NOT_OBSERVED");
  }

  function validateJsFunnel(surface, state) {
    const report = surface.report || {};

    const funnel = getValue(report, "JS_INTEGRATION_FUNNEL", FALLBACK.UNKNOWN);
    const indexFile = getValue(report, "JS_INDEX_FILE", FALLBACK.UNKNOWN);
    const indexContract = getValue(report, "JS_INDEX_CONTRACT", FALLBACK.UNKNOWN);
    const routeFile = getValue(report, "JS_ROUTE_CONDUCTOR_FILE", FALLBACK.UNKNOWN);
    const routeContract = getValue(report, "JS_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);
    const controlFile = getValue(report, "JS_CONTROL_FILE", FALLBACK.UNKNOWN);
    const controlContract = getValue(report, "JS_CONTROL_CONTRACT", FALLBACK.UNKNOWN);
    const canvasFile = getValue(report, "JS_CANVAS_FILE", FALLBACK.UNKNOWN);

    const funnelOk =
      funnel === EXPECTED_JS_FUNNEL ||
      (
        funnel.includes(EXPECTED_INDEX_FILE) &&
        funnel.includes(EXPECTED_ROUTE_CONDUCTOR_FILE) &&
        funnel.includes(EXPECTED_CONTROL_FILE) &&
        funnel.includes(EXPECTED_CANVAS_FILE)
      );

    const componentsOk =
      (indexFile === EXPECTED_INDEX_FILE || unknownish(indexFile)) &&
      (indexContract === EXPECTED_INDEX_CONTRACT || unknownish(indexContract)) &&
      (routeFile === EXPECTED_ROUTE_CONDUCTOR_FILE || unknownish(routeFile)) &&
      (routeContract === EXPECTED_ROUTE_CONDUCTOR_CONTRACT || unknownish(routeContract)) &&
      (controlFile === EXPECTED_CONTROL_FILE || unknownish(controlFile)) &&
      (controlContract === EXPECTED_CONTROL_CONTRACT || unknownish(controlContract)) &&
      (canvasFile === EXPECTED_CANVAS_FILE || unknownish(canvasFile));

    state.jsFunnelStatus = funnelOk && componentsOk ? FALLBACK.VALID : FALLBACK.PARTIAL;

    if (!funnelOk) addNote(state, `SOUTH_JS_FUNNEL_NOT_FULLY_OBSERVED:${funnel}`);
    if (!componentsOk) addNote(state, "SOUTH_JS_FUNNEL_COMPONENT_FIELD_MISMATCH");
  }

  function validateFormalFields(surface, state) {
    const report = surface.report || {};
    const result = {};

    for (const groupName of Object.keys(FORMAL_GROUPS)) {
      result[groupName] = groupStatus(report, FORMAL_GROUPS[groupName]);
    }

    state.formalFieldGroups = result;

    const failedGroups = Object.keys(result).filter((groupName) => result[groupName].status === FALLBACK.MISSING);
    const partialGroups = Object.keys(result).filter((groupName) => result[groupName].status === FALLBACK.PARTIAL);

    state.formalFieldMissingGroups = failedGroups;
    state.formalFieldPartialGroups = partialGroups;
    state.formalFieldStatus = failedGroups.length === 0
      ? partialGroups.length === 0
        ? FALLBACK.VALID
        : FALLBACK.PARTIAL
      : FALLBACK.INVALID;

    if (failedGroups.length) addNote(state, `SOUTH_FORMAL_FIELD_GROUPS_MISSING:${failedGroups.join(",")}`);
    if (partialGroups.length) addNote(state, `SOUTH_FORMAL_FIELD_GROUPS_PARTIAL:${partialGroups.join(",")}`);
  }

  function selectProbeVerdict(state) {
    const hardFailures = [];

    if (!state.southAuthorityObserved) hardFailures.push("SOUTH_AUTHORITY_MISSING");
    if (state.authorityStatus === FALLBACK.INVALID) hardFailures.push("SOUTH_AUTHORITY_INVALID");
    if (state.outputShapeStatus !== FALLBACK.VALID) hardFailures.push("SOUTH_OUTPUT_SHAPE_INCOMPLETE");
    if (state.meaningStatus !== FALLBACK.VALID) hardFailures.push("SOUTH_MEANING_PRESERVATION_FAILED");
    if (state.noClaimStatus !== FALLBACK.VALID) hardFailures.push("SOUTH_NO_CLAIM_BOUNDARY_FAILED");
    if (state.formalFieldStatus === FALLBACK.INVALID) hardFailures.push("SOUTH_FORMAL_FIELD_GROUPS_MISSING");

    const partials = [];

    if (state.authorityStatus === FALLBACK.PARTIAL) partials.push("SOUTH_AUTHORITY_PARTIAL");
    if (state.controlProjectionStatus !== FALLBACK.VALID) partials.push("SOUTH_CONTROL_PROJECTION_PARTIAL");
    if (state.queenProjectionStatus !== FALLBACK.VALID) partials.push("SOUTH_QUEEN_PROJECTION_PARTIAL");
    if (state.jsFunnelStatus !== FALLBACK.VALID) partials.push("SOUTH_JS_FUNNEL_PARTIAL");
    if (state.formalFieldStatus === FALLBACK.PARTIAL) partials.push("SOUTH_FORMAL_FIELD_GROUPS_PARTIAL");

    state.hardFailures = hardFailures;
    state.partialFindings = partials;

    if (hardFailures.length) {
      state.probeStatus = PROBE_STATUS.HOLD;
      state.southProbeClean = "false";
      state.southProbeVerdict = "SOUTH_PROBE_HOLD_ORIGIN_FILE_REVIEW_REQUIRED";
      state.zoneOfInfliction = "SOUTH_DIAGNOSTIC_PACKET_OUTPUT_CONFORMANCE";
      state.recommendedNextFile = TARGET_FILE;
      state.recommendedNextAction =
        "REVIEW_SOUTH_DIAGNOSTIC_OUTPUT_CONFORMANCE_WITHOUT_RENEWING_PARENT_RAIL";
      return;
    }

    if (partials.length) {
      state.probeStatus = PROBE_STATUS.PARTIAL;
      state.southProbeClean = "false";
      state.southProbeVerdict = "SOUTH_PROBE_PARTIAL_EVIDENCE_PRESENT_BUT_NOT_FULLY_CLOSED";
      state.zoneOfInfliction = "SOUTH_DIAGNOSTIC_PROJECTION_FIELD_COVERAGE";
      state.recommendedNextFile = TARGET_FILE;
      state.recommendedNextAction =
        "INSPECT_SOUTH_PROJECTION_FIELD_COVERAGE_BEFORE_ANY_RENEWAL";
      return;
    }

    state.probeStatus = PROBE_STATUS.CLEAN;
    state.southProbeClean = "true";
    state.southProbeVerdict = "SOUTH_PROBE_CLEAN_NO_ORIGIN_RENEWAL_REQUIRED";
    state.zoneOfInfliction = "NONE";
    state.recommendedNextFile = "NONE";
    state.recommendedNextAction =
      "SOUTH_PROBE_CLOSED_READY_FOR_NORTH_PROBE_AGGREGATION";
  }

  function makeState() {
    return {
      probeStatus: PROBE_STATUS.READY,
      probeContract: CONTRACT,
      probeReceipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetFile: TARGET_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      timestamp: nowIso(),

      southAuthorityObserved: false,
      southAuthoritySource: "NONE",
      southReceiptObserved: false,
      southStateObserved: false,
      southContract: FALLBACK.UNKNOWN,
      southReceipt: FALLBACK.UNKNOWN,
      southImplementationContract: FALLBACK.UNKNOWN,
      southImplementationReceipt: FALLBACK.UNKNOWN,
      southContractRecognized: FALLBACK.UNKNOWN,
      southImplementationRecognized: FALLBACK.UNKNOWN,

      apiAvailability: {},
      apiMissing: [],
      authorityStatus: FALLBACK.UNKNOWN,

      outputObserved: false,
      outputSource: "NONE",
      reportObserved: false,
      reportSource: "NONE",
      reportObjectPresent: false,
      fullPacketTextPresent: false,
      compactSummaryPresent: false,
      outputRequiredPresentCount: 0,
      outputRequiredTotal: OUTPUT_REQUIRED_FIELDS.length,
      outputShapeStatus: FALLBACK.UNKNOWN,

      southOutputStatus: FALLBACK.UNKNOWN,
      southOutputValid: FALLBACK.UNKNOWN,
      southMeaningPreserved: FALLBACK.UNKNOWN,
      southOutputSchemaValid: FALLBACK.UNKNOWN,

      meaningFieldsMissing: [],
      meaningVerdictMismatch: [],
      northVerdictObserved: false,
      meaningFieldsPresent: FALLBACK.UNKNOWN,
      meaningVerdictAligned: FALLBACK.UNKNOWN,
      meaningPreservationField: FALLBACK.UNKNOWN,
      meaningStatus: FALLBACK.UNKNOWN,

      noClaimViolations: [],
      noClaimStatus: FALLBACK.UNKNOWN,

      controlProjectionStatus: FALLBACK.UNKNOWN,
      controlProjectionDetails: {},
      queenProjectionStatus: FALLBACK.UNKNOWN,
      queenProjectionDetails: {},
      jsFunnelStatus: FALLBACK.UNKNOWN,
      formalFieldGroups: {},
      formalFieldMissingGroups: [],
      formalFieldPartialGroups: [],
      formalFieldStatus: FALLBACK.UNKNOWN,

      hardFailures: [],
      partialFindings: [],
      southProbeClean: "false",
      southProbeVerdict: FALLBACK.UNKNOWN,
      zoneOfInfliction: FALLBACK.UNKNOWN,
      recommendedNextFile: "HOLD",
      recommendedNextAction: "RUN_SOUTH_PROBE",

      notes: [],

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

  function makeEvidence(state) {
    return {
      SOUTH_PROBE_STATUS: state.probeStatus,
      SOUTH_PROBE_CONTRACT: CONTRACT,
      SOUTH_PROBE_RECEIPT: RECEIPT,
      SOUTH_PROBE_VERSION: VERSION,
      SOUTH_PROBE_FILE: FILE,
      SOUTH_PROBE_TARGET_FILE: TARGET_FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      SOUTH_PROBE_TIMESTAMP: state.timestamp,

      SOUTH_AUTHORITY_OBSERVED: boolText(state.southAuthorityObserved),
      SOUTH_AUTHORITY_SOURCE: state.southAuthoritySource,
      SOUTH_RECEIPT_OBSERVED: boolText(state.southReceiptObserved),
      SOUTH_STATE_OBSERVED: boolText(state.southStateObserved),
      SOUTH_CONTRACT: state.southContract,
      SOUTH_RECEIPT: state.southReceipt,
      SOUTH_IMPLEMENTATION_CONTRACT: state.southImplementationContract,
      SOUTH_IMPLEMENTATION_RECEIPT: state.southImplementationReceipt,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_SOUTH_RECEIPT,
      EXPECTED_SOUTH_IMPLEMENTATION_CONTRACT,
      EXPECTED_SOUTH_IMPLEMENTATION_RECEIPT,
      SOUTH_CONTRACT_RECOGNIZED: state.southContractRecognized,
      SOUTH_IMPLEMENTATION_RECOGNIZED: state.southImplementationRecognized,

      SOUTH_API_COMPOSE_REPORT_AVAILABLE: boolText(state.apiAvailability.composeSouthReport === true),
      SOUTH_API_COMPOSE_COMPACT_SUMMARY_AVAILABLE: boolText(state.apiAvailability.composeCompactSummary === true),
      SOUTH_API_GET_RECEIPT_AVAILABLE: boolText(state.apiAvailability.getSouthReceipt === true),
      SOUTH_API_GET_STATE_AVAILABLE: boolText(state.apiAvailability.getSouthState === true),
      SOUTH_API_MISSING: state.apiMissing.length ? state.apiMissing.join(",") : FALLBACK.NONE,
      SOUTH_AUTHORITY_STATUS: state.authorityStatus,

      SOUTH_OUTPUT_OBSERVED: boolText(state.outputObserved),
      SOUTH_OUTPUT_SOURCE: state.outputSource,
      SOUTH_REPORT_OBSERVED: boolText(state.reportObserved),
      SOUTH_REPORT_SOURCE: state.reportSource,
      SOUTH_REPORT_OBJECT_PRESENT: boolText(state.reportObjectPresent),
      SOUTH_FULL_PACKET_TEXT_PRESENT: boolText(state.fullPacketTextPresent),
      SOUTH_COMPACT_SUMMARY_PRESENT: boolText(state.compactSummaryPresent),
      SOUTH_OUTPUT_REQUIRED_PRESENT_COUNT: String(state.outputRequiredPresentCount),
      SOUTH_OUTPUT_REQUIRED_TOTAL: String(state.outputRequiredTotal),
      SOUTH_OUTPUT_SHAPE_STATUS: state.outputShapeStatus,

      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
      SOUTH_OUTPUT_VALID: state.southOutputValid,
      SOUTH_MEANING_PRESERVED: state.southMeaningPreserved,
      SOUTH_OUTPUT_SCHEMA_VALID: state.southOutputSchemaValid,

      SOUTH_NORTH_MEANING_FIELDS_PRESENT: state.meaningFieldsPresent,
      SOUTH_NORTH_MEANING_FIELDS_MISSING: state.meaningFieldsMissing.length ? state.meaningFieldsMissing.join(",") : FALLBACK.NONE,
      SOUTH_NORTH_VERDICT_OBSERVED: boolText(state.northVerdictObserved),
      SOUTH_NORTH_VERDICT_ALIGNED: state.meaningVerdictAligned,
      SOUTH_NORTH_VERDICT_MISMATCH: state.meaningVerdictMismatch.length ? state.meaningVerdictMismatch.join(" | ") : FALLBACK.NONE,
      SOUTH_MEANING_PRESERVATION_FIELD: state.meaningPreservationField,
      SOUTH_MEANING_STATUS: state.meaningStatus,

      SOUTH_NO_CLAIM_STATUS: state.noClaimStatus,
      SOUTH_NO_CLAIM_VIOLATIONS: state.noClaimViolations.length ? state.noClaimViolations.join(" | ") : FALLBACK.NONE,

      SOUTH_CONTROL_PROJECTION_STATUS: state.controlProjectionStatus,
      SOUTH_CONTROL_PROJECTION_DETAILS: clonePlain(state.controlProjectionDetails),

      SOUTH_QUEEN_PROJECTION_STATUS: state.queenProjectionStatus,
      SOUTH_QUEEN_PROJECTION_DETAILS: clonePlain(state.queenProjectionDetails),

      SOUTH_JS_FUNNEL_STATUS: state.jsFunnelStatus,
      EXPECTED_JS_INTEGRATION_FUNNEL: EXPECTED_JS_FUNNEL,
      EXPECTED_INDEX_FILE,
      EXPECTED_INDEX_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_FILE,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_CONTROL_FILE,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_FILE,

      SOUTH_FORMAL_FIELD_STATUS: state.formalFieldStatus,
      SOUTH_FORMAL_FIELD_GROUPS: clonePlain(state.formalFieldGroups),
      SOUTH_FORMAL_FIELD_MISSING_GROUPS: state.formalFieldMissingGroups.length ? state.formalFieldMissingGroups.join(",") : FALLBACK.NONE,
      SOUTH_FORMAL_FIELD_PARTIAL_GROUPS: state.formalFieldPartialGroups.length ? state.formalFieldPartialGroups.join(",") : FALLBACK.NONE,

      SOUTH_PROBE_CLEAN: state.southProbeClean,
      SOUTH_PROBE_VERDICT: state.southProbeVerdict,
      SOUTH_PROBE_HARD_FAILURES: state.hardFailures.length ? state.hardFailures.join(" | ") : FALLBACK.NONE,
      SOUTH_PROBE_PARTIAL_FINDINGS: state.partialFindings.length ? state.partialFindings.join(" | ") : FALLBACK.NONE,
      SOUTH_PROBE_ZONE_OF_INFLICTION: state.zoneOfInfliction,
      SOUTH_PROBE_RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      SOUTH_PROBE_RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      SOUTH_PROBE_NOT_ORIGIN_RENEWAL: "true",
      SOUTH_PROBE_READ_ONLY: "true",
      SOUTH_PROBE_MUTATES_DIAGNOSTIC_RAIL: "false",
      SOUTH_PROBE_MUTATES_PRODUCTION: "false",
      SOUTH_PROBE_RUNS_SYNTHETIC_ACTIVATION: "false",
      SOUTH_PROBE_CALLS_COMPOSE_SOUTH_REPORT_BY_DEFAULT: "false",

      SOUTH_PROBE_NOTES: state.notes.length ? state.notes.join(" | ") : FALLBACK.NONE,

      f13Claimed: false,
      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      F13_CLAIMED: false,
      F21_ELIGIBLE_FOR_NORTH: false,
      F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      READY_TEXT_ALLOWED: false,
      READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
      VISUAL_PASS_CLAIMED: false,
      GENERATED_IMAGE: false,
      GRAPHIC_BOX: false,
      WEBGL: false
    };
  }

  function runSouthProbe(options = {}) {
    const state = makeState();
    state.probeStatus = PROBE_STATUS.RUNNING;
    state.timestamp = nowIso();

    try {
      addNote(state, "SOUTH_PROBE_STARTED_READ_ONLY");
      addNote(state, "SOUTH_PROBE_DOES_NOT_RENEW_ORIGIN_FILE");

      const surface = resolveSouthSurface(options, state);

      validateAuthority(state);
      validateOutputShape(surface, state);
      validateMeaning(surface, state);
      validateNoClaim(surface, state);
      validateControlProjection(surface, state);
      validateQueenProjection(surface, state);
      validateJsFunnel(surface, state);
      validateFormalFields(surface, state);
      selectProbeVerdict(state);

      publish(state);

      return {
        ok: state.probeStatus === PROBE_STATUS.CLEAN || state.probeStatus === PROBE_STATUS.PARTIAL,
        contract: CONTRACT,
        receipt: RECEIPT,
        evidence: clonePlain(lastEvidence),
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.probeStatus = PROBE_STATUS.FAILED;
      state.southProbeClean = "false";
      state.southProbeVerdict = "SOUTH_PROBE_FAILED_TOP_LEVEL_ERROR";
      state.zoneOfInfliction = "SOUTH_PROBE_SELF_ERROR";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "REVIEW_SOUTH_PROBE_IMPLEMENTATION";
      addNote(state, `SOUTH_PROBE_TOP_LEVEL_ERROR:${bounded(error && error.message ? error.message : error, 1200)}`);

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: bounded(error && error.message ? error.message : error, 1200),
        evidence: clonePlain(lastEvidence),
        state: clonePlain(lastState)
      };
    }
  }

  function getSouthProbeEvidence() {
    return clonePlain(lastEvidence || makeEvidence(makeState()));
  }

  function getSouthProbeState() {
    return clonePlain(lastState || makeState());
  }

  function getSouthProbeReceipt() {
    const state = lastState || makeState();

    return {
      probeRole: "SOUTH_DIAGNOSTIC_RAIL_PACKET_CONFORMANCE_PROBE",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetFile: TARGET_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      expectedSouthContract: EXPECTED_SOUTH_CONTRACT,
      expectedSouthReceipt: EXPECTED_SOUTH_RECEIPT,
      expectedSouthImplementationContract: EXPECTED_SOUTH_IMPLEMENTATION_CONTRACT,
      expectedSouthImplementationReceipt: EXPECTED_SOUTH_IMPLEMENTATION_RECEIPT,
      previousSouthImplementationContract: PREVIOUS_SOUTH_IMPLEMENTATION_CONTRACT,
      lineageSouthImplementationContract: LINEAGE_SOUTH_IMPLEMENTATION_CONTRACT,
      baselineSouthImplementationContract: BASELINE_SOUTH_IMPLEMENTATION_CONTRACT,

      expectedIndexFile: EXPECTED_INDEX_FILE,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedRouteConductorFile: EXPECTED_ROUTE_CONDUCTOR_FILE,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      expectedControlFile: EXPECTED_CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedCanvasFile: EXPECTED_CANVAS_FILE,
      expectedJsIntegrationFunnel: EXPECTED_JS_FUNNEL,

      requiredApi: REQUIRED_API.slice(),
      northMeaningFields: NORTH_MEANING_FIELDS.slice(),
      outputRequiredFields: OUTPUT_REQUIRED_FIELDS.slice(),
      reportCoreFields: REPORT_CORE_FIELDS.slice(),
      noClaimFields: NO_CLAIM_FIELDS.slice(),
      upperNoClaimFields: UPPER_NO_CLAIM_FIELDS.slice(),
      formalGroups: clonePlain(FORMAL_GROUPS),

      runSouthProbeApiAvailable: true,
      getSouthProbeEvidenceApiAvailable: true,
      getSouthProbeStateApiAvailable: true,
      getSouthProbeReceiptApiAvailable: true,

      probeOnly: true,
      readOnly: true,
      originRenewalAuthorized: false,
      diagnosticRailMutationAuthorized: false,
      productionMutationAuthorized: false,
      repairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,
      syntheticActivationAuthorized: false,

      ownsSouthRenewal: false,
      ownsNorthAdjudication: false,
      ownsEastEvidence: false,
      ownsWestEvidence: false,
      ownsDiagnosticUi: false,
      ownsPacketInspection: true,
      ownsSouthOutputConformanceProbe: true,
      ownsNoClaimBoundaryProbe: true,
      ownsNorthMeaningPreservationProbe: true,
      ownsControlProjectionProbe: true,
      ownsQueenProjectionProbe: true,
      ownsFormalFieldCoverageProbe: true,

      f13Claimed: false,
      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      lastProbeStatus: state.probeStatus,
      lastSouthProbeClean: state.southProbeClean,
      lastSouthProbeVerdict: state.southProbeVerdict,
      lastZoneOfInfliction: state.zoneOfInfliction,
      updatedAt: nowIso()
    };
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastEvidence = makeEvidence(state);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.probeSouth = api;
    root.HEARTH.probeRailSouth = api;
    root.HEARTH.southProbe = api;
    root.HEARTH.diagnosticSouthProbe = api;
    root.HEARTH.diagnosticRailSouthProbe = api;
    root.HEARTH.probeSouthEvidence = clonePlain(lastEvidence);
    root.HEARTH.probeRailSouthEvidence = clonePlain(lastEvidence);
    root.HEARTH.diagnosticSouthProbeEvidence = clonePlain(lastEvidence);

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthProbeSouth = api;
    root.DEXTER_LAB.hearthProbeRailSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;

    root.HEARTH_PROBE_SOUTH = api;
    root.HEARTH_PROBE_RAIL_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_PROBE = api;

    root.HEARTH_PROBE_SOUTH_RECEIPT = getSouthProbeReceipt();
    root.HEARTH_PROBE_RAIL_SOUTH_RECEIPT = getSouthProbeReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getSouthProbeReceipt();

    root.HEARTH_PROBE_SOUTH_EVIDENCE = clonePlain(lastEvidence);
    root.HEARTH_PROBE_RAIL_SOUTH_EVIDENCE = clonePlain(lastEvidence);
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_EVIDENCE = clonePlain(lastEvidence);
  }

  Object.assign(api, {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetFile: TARGET_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    expectedSouthContract: EXPECTED_SOUTH_CONTRACT,
    expectedSouthReceipt: EXPECTED_SOUTH_RECEIPT,
    expectedSouthImplementationContract: EXPECTED_SOUTH_IMPLEMENTATION_CONTRACT,
    expectedSouthImplementationReceipt: EXPECTED_SOUTH_IMPLEMENTATION_RECEIPT,
    previousSouthImplementationContract: PREVIOUS_SOUTH_IMPLEMENTATION_CONTRACT,
    lineageSouthImplementationContract: LINEAGE_SOUTH_IMPLEMENTATION_CONTRACT,
    baselineSouthImplementationContract: BASELINE_SOUTH_IMPLEMENTATION_CONTRACT,

    expectedIndexFile: EXPECTED_INDEX_FILE,
    expectedIndexContract: EXPECTED_INDEX_CONTRACT,
    expectedRouteConductorFile: EXPECTED_ROUTE_CONDUCTOR_FILE,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedControlFile: EXPECTED_CONTROL_FILE,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedCanvasFile: EXPECTED_CANVAS_FILE,
    expectedJsIntegrationFunnel: EXPECTED_JS_FUNNEL,

    southAuthorityPaths: SOUTH_AUTHORITY_PATHS.slice(),
    southOutputPaths: SOUTH_OUTPUT_PATHS.slice(),
    southReportPaths: SOUTH_REPORT_PATHS.slice(),
    requiredApi: REQUIRED_API.slice(),
    northMeaningFields: NORTH_MEANING_FIELDS.slice(),
    outputRequiredFields: OUTPUT_REQUIRED_FIELDS.slice(),
    formalGroups: clonePlain(FORMAL_GROUPS),

    runSouthProbe,
    getSouthProbeEvidence,
    getSouthProbeState,
    getSouthProbeReceipt,

    supportsSouthAuthorityProbe: true,
    supportsSouthApiProbe: true,
    supportsSouthOutputShapeProbe: true,
    supportsReportObjectProbe: true,
    supportsFullPacketTextProbe: true,
    supportsCompactSummaryProbe: true,
    supportsNorthMeaningPreservationProbe: true,
    supportsNorthVerdictAlignmentProbe: true,
    supportsNoClaimBoundaryProbe: true,
    supportsControlProjectionProbe: true,
    supportsQueenProjectionProbe: true,
    supportsJsFunnelProbe: true,
    supportsLabCanvasBridgeFieldProbe: true,
    supportsBishopBridgeFieldProbe: true,
    supportsFourWayCanvasHandoffFieldProbe: true,
    supportsBishopQueenCanvasFieldProbe: true,
    supportsFormalFieldCoverageProbe: true,

    probeOnly: true,
    readOnly: true,
    originRenewalAuthorized: false,
    diagnosticRailMutationAuthorized: false,
    productionMutationAuthorized: false,
    repairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    syntheticActivationAuthorized: false,

    ownsSouthRenewal: false,
    ownsNorthAdjudication: false,
    ownsEastEvidence: false,
    ownsWestEvidence: false,
    ownsDiagnosticUi: false,
    ownsPacketInspection: true,

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
