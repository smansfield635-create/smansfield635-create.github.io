// /assets/hearth/hearth.diagnostic.probe.east.js
// HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_BRIDGE_TNT_v1
// Full-file addition.
// Diagnostic Probe East only.
// Purpose:
// - Add a probe-layer bridge above the already-integrated EAST diagnostic rail.
// - Consume /assets/hearth/hearth.diagnostic.east.js through its public API only.
// - Avoid renewing or mutating the origin EAST diagnostic rail.
// - Translate EAST served-source evidence into probe evidence for the eight-way diagnostic bridge.
// - Preserve NORTH as final coordination/adjudication authority.
// - Preserve EAST as served-source evidence authority.
// - Preserve WEST as rendered-target / Canvas-expression observatory authority.
// - Preserve SOUTH as output/meaning-preservation authority.
// - Preserve no repair, no production mutation, no cache mutation, no runtime restart,
//   no Canvas release, no Macro West release, no F13 claim, no F21 claim, no ready text,
//   no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - origin EAST implementation
// - dynamic loading
// - rendered-target probing
// - final primary-case selection
// - final recommendation selection
// - diagnostic UI
// - production mutation
// - cache repair
// - Hearth repair
// - runtime restart
// - Canvas drawing
// - Canvas release
// - Macro West release
// - Lab runtime authority
// - bishop internals
// - control-file implementation
// - touch/drag/motion execution
// - terrain/material/hydrology truth
// - expression repair

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_BRIDGE_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_BRIDGE_RECEIPT_v1";
  const VERSION = "2026-06-05.hearth-diagnostic-probe-east-served-source-bridge-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";

  const SOURCE_EAST_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const SOURCE_EAST_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_RECEIPT_v1";
  const SOURCE_EAST_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_TNT_v8";
  const SOURCE_EAST_IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT_RECEIPT_v8";

  const NORTH_PROBE_EXPECTED_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const WEST_PROBE_EXPECTED_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const SOUTH_PROBE_EXPECTED_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";

  const WEST_STANDARD_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_WEST_CANVAS_EXPRESSION_RENDERED_RANGE_OBSERVATORY_TNT_v7";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedByProbe: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    readyTextClaimedByProbe: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false
  });

  const STATUS = Object.freeze({
    READY: "READY",
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    HELD: "HELD",
    FAILED: "FAILED"
  });

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NONE: "NONE",
    NOT_FOUND: "NOT_FOUND",
    UNREADABLE: "UNREADABLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
    SOURCE_EAST_NOT_OBSERVED: "SOURCE_EAST_NOT_OBSERVED",
    SOURCE_EAST_API_MISSING: "SOURCE_EAST_API_MISSING",
    SOURCE_EAST_EVIDENCE_MISSING: "SOURCE_EAST_EVIDENCE_MISSING",
    SOURCE_EAST_RUN_NOT_REQUESTED: "SOURCE_EAST_RUN_NOT_REQUESTED",
    BRIDGE_HELD: "BRIDGE_HELD",
    BRIDGE_PARTIAL: "BRIDGE_PARTIAL",
    BRIDGE_COMPLETE: "BRIDGE_COMPLETE"
  });

  const EAST_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH.diagnosticRailEast",
    "HEARTH.diagnosticEast",
    "HEARTH.diagnosticEastCanvasExpressionSourceFootprintAlignment",
    "HEARTH.diagnosticEastCurrentServedSpreadBishopCanvasSourceFootprint",
    "HEARTH.diagnosticEastLabCanvasBridgeSourceFootprint",
    "DEXTER_LAB.hearthDiagnosticRailEast",
    "DEXTER_LAB.hearthDiagnosticEast",
    "DEXTER_LAB.hearthDiagnosticEastCanvasExpressionSourceFootprintAlignment",
    "DEXTER_LAB.hearthDiagnosticEastCurrentServedSpreadBishopCanvasSourceFootprint",
    "DEXTER_LAB.hearthDiagnosticEastLabCanvasBridgeSourceFootprint",
    "HEARTH_DIAGNOSTIC_RAIL_EAST",
    "HEARTH_DIAGNOSTIC_EAST",
    "HEARTH_DIAGNOSTIC_EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_ALIGNMENT",
    "HEARTH_DIAGNOSTIC_EAST_CURRENT_SERVED_SPREAD_BISHOP_CANVAS_SOURCE_FOOTPRINT",
    "HEARTH_DIAGNOSTIC_EAST_LAB_CANVAS_BRIDGE_SOURCE_FOOTPRINT"
  ]);

  const EAST_EVIDENCE_ALIASES = Object.freeze([
    "HEARTH.diagnosticRailEastEvidence",
    "HEARTH.diagnosticEastEvidence",
    "HEARTH_DIAGNOSTIC_RAIL_EAST_EVIDENCE",
    "HEARTH_DIAGNOSTIC_EAST_EVIDENCE"
  ]);

  const EAST_RECEIPT_ALIASES = Object.freeze([
    "HEARTH.diagnosticRailEastReceipt",
    "HEARTH.diagnosticEastReceipt",
    "HEARTH_DIAGNOSTIC_RAIL_EAST_RECEIPT",
    "HEARTH_DIAGNOSTIC_EAST_RECEIPT"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastState = null;
  let lastEvidence = null;
  let lastReceipt = null;
  let lastPacketText = "";

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

  function bounded(value, limit = 5000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function boolText(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
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

  function readPath(path) {
    try {
      const parts = safeString(path).split(".");
      let cursor = root;

      for (const part of parts) {
        if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
        cursor = cursor[part];
      }

      return cursor || null;
    } catch (_error) {
      return null;
    }
  }

  function findFirst(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && isObject(value)) return { path, value };
    }

    return { path: "NONE", value: null };
  }

  function readField(source, key, fallback = FALLBACK.UNKNOWN) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const value = source[key];
      return value === undefined || value === null || value === "" ? fallback : value;
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        const value = source[candidate];
        return value === undefined || value === null || value === "" ? fallback : value;
      }
    }

    return fallback;
  }

  function textField(source, key, fallback = FALLBACK.UNKNOWN) {
    return bounded(readField(source, key, fallback), 8000) || fallback;
  }

  function line(key, value) {
    if (value === undefined || value === null || value === "") return `${key}=`;
    if (isObject(value) || Array.isArray(value)) {
      try {
        return `${key}=${JSON.stringify(value)}`;
      } catch (_error) {
        return `${key}=${bounded(value)}`;
      }
    }
    return `${key}=${bounded(value, 12000)}`;
  }

  function addNote(state, note) {
    const clean = bounded(note, 1600);
    if (!clean) return;
    if (!state.notes.includes(clean)) state.notes.push(clean);
  }

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getEastReceipt",
      "getReceiptLight",
      "getReceipt",
      "getState",
      "getEastState",
      "getStatus",
      "getReport"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.implementationContract) {
      return authority;
    }

    return null;
  }

  function readAuthorityState(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = ["getEastState", "getState"];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.state)) return authority.state;
    return null;
  }

  function findPublishedEvidence() {
    const found = findFirst(EAST_EVIDENCE_ALIASES);
    if (found.value) return found;

    const receiptFound = findFirst(EAST_RECEIPT_ALIASES);
    if (receiptFound.value) return receiptFound;

    return { path: "NONE", value: null };
  }

  function normalizeSourceEastReceipt(receipt) {
    const r = isObject(receipt) ? receipt : {};

    return {
      contract: safeString(firstDefined(
        r.contract,
        r.CONTRACT,
        r.eastContract,
        r.EAST_CONTRACT
      ), FALLBACK.UNKNOWN),

      receipt: safeString(firstDefined(
        r.receipt,
        r.RECEIPT,
        r.eastReceipt,
        r.EAST_RECEIPT
      ), FALLBACK.UNKNOWN),

      implementationContract: safeString(firstDefined(
        r.implementationContract,
        r.EAST_ALIGNMENT_CONTRACT,
        r.EAST_IMPLEMENTATION_CONTRACT
      ), FALLBACK.UNKNOWN),

      implementationReceipt: safeString(firstDefined(
        r.implementationReceipt,
        r.EAST_ALIGNMENT_RECEIPT,
        r.EAST_IMPLEMENTATION_RECEIPT
      ), FALLBACK.UNKNOWN)
    };
  }

  function normalizeEastEvidence(rawEvidence, state) {
    const evidence = isObject(rawEvidence) ? rawEvidence : {};

    const normalized = {
      EAST_SOURCE_READ_STATUS: textField(evidence, "EAST_SOURCE_READ_STATUS"),
      EAST_SOURCE_READ_COMPLETE: textField(evidence, "EAST_SOURCE_READ_COMPLETE"),

      DIAGNOSTIC_TARGET_ACCESS_STATUS: textField(evidence, "DIAGNOSTIC_TARGET_ACCESS_STATUS"),
      DIAGNOSTIC_TARGET_ACCESS_ERROR: textField(evidence, "DIAGNOSTIC_TARGET_ACCESS_ERROR"),

      EXPECTED_HTML_CONTRACT: textField(evidence, "EXPECTED_HTML_CONTRACT"),
      EXPECTED_INDEX_JS_CONTRACT: textField(evidence, "EXPECTED_INDEX_JS_CONTRACT"),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: textField(evidence, "EXPECTED_ROUTE_CONDUCTOR_CONTRACT"),

      SERVED_HTML_CONTRACT: textField(evidence, "SERVED_HTML_CONTRACT"),
      SERVED_INDEX_JS_CONTRACT: textField(evidence, "SERVED_INDEX_JS_CONTRACT"),
      SERVED_ROUTE_CONDUCTOR_CONTRACT: textField(evidence, "SERVED_ROUTE_CONDUCTOR_CONTRACT"),

      INDEX_SCRIPT_SRC: textField(evidence, "INDEX_SCRIPT_SRC"),
      ROUTE_CONDUCTOR_SCRIPT_SRC: textField(evidence, "ROUTE_CONDUCTOR_SCRIPT_SRC"),
      ROUTE_CONDUCTOR_AUTHORITY_CONTRACT: textField(evidence, "ROUTE_CONDUCTOR_AUTHORITY_CONTRACT"),
      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: textField(evidence, "ROUTE_CONDUCTOR_AUTHORITY_SOURCE"),

      HTML_CONTRACT_RECOGNIZED: textField(evidence, "HTML_CONTRACT_RECOGNIZED"),
      INDEX_CONTRACT_RECOGNIZED: textField(evidence, "INDEX_CONTRACT_RECOGNIZED"),
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: textField(evidence, "ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED"),
      PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: textField(evidence, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED"),
      ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5: textField(evidence, "ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5"),
      EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED: textField(evidence, "EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED"),

      CACHE_OR_SERVED_CONTRACT_MISMATCH: textField(evidence, "CACHE_OR_SERVED_CONTRACT_MISMATCH"),
      CASE_5_SUPPORT: textField(evidence, "CASE_5_SUPPORT"),

      EAST_TARGET_ALIGNMENT_CONTRACT: textField(evidence, "EAST_TARGET_ALIGNMENT_CONTRACT"),
      EAST_CANVAS_EXPRESSION_SOURCE_ALIGNMENT_STATUS: textField(evidence, "EAST_CANVAS_EXPRESSION_SOURCE_ALIGNMENT_STATUS"),
      EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_STATUS: textField(evidence, "EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_STATUS"),
      EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE: textField(evidence, "EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE"),
      EAST_EXPECTED_WEST_IMPLEMENTATION_CONTRACT: textField(evidence, "EAST_EXPECTED_WEST_IMPLEMENTATION_CONTRACT"),
      WEST_STANDARD_IMPLEMENTATION_CONTRACT: textField(evidence, "WEST_STANDARD_IMPLEMENTATION_CONTRACT"),

      EXPECTED_CONTROL_FILE: textField(evidence, "EXPECTED_CONTROL_FILE"),
      EXPECTED_CONTROL_CONTRACT: textField(evidence, "EXPECTED_CONTROL_CONTRACT"),
      CONTROL_FILE: textField(evidence, "CONTROL_FILE"),
      CONTROL_FILE_EXPECTED: textField(evidence, "CONTROL_FILE_EXPECTED"),
      CONTROL_FILE_STATUS: textField(evidence, "CONTROL_FILE_STATUS"),
      CONTROL_FILE_LOADED: textField(evidence, "CONTROL_FILE_LOADED"),
      CONTROL_GLOBAL_PRESENT: textField(evidence, "CONTROL_GLOBAL_PRESENT"),
      CONTROL_RECEIPT_PRESENT: textField(evidence, "CONTROL_RECEIPT_PRESENT"),
      CONTROL_ABSENCE_IS_FAILURE: textField(evidence, "CONTROL_ABSENCE_IS_FAILURE"),
      CONTROL_ABSENCE_IS_CASE_5: textField(evidence, "CONTROL_ABSENCE_IS_CASE_5"),
      CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET: textField(evidence, "CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET"),
      CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH: textField(evidence, "CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH"),
      CONTROL_HANDSHAKE_STATUS: textField(evidence, "CONTROL_HANDSHAKE_STATUS"),
      HEARTH_JS_CONTROL_HANDSHAKE_STATUS: textField(evidence, "HEARTH_JS_CONTROL_HANDSHAKE_STATUS"),
      HEARTH_JS_LOADS_OR_RECOGNIZES_CONTROL_FILE: textField(evidence, "HEARTH_JS_LOADS_OR_RECOGNIZES_CONTROL_FILE"),
      MOTION_TOUCH_STATUS: textField(evidence, "MOTION_TOUCH_STATUS"),
      DRAG_STATUS: textField(evidence, "DRAG_STATUS"),
      VIEW_CONTROL_STATUS: textField(evidence, "VIEW_CONTROL_STATUS"),
      VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS: textField(evidence, "VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS"),

      LAB_CANVAS_SHARED_LANGUAGE_STATUS: textField(evidence, "LAB_CANVAS_SHARED_LANGUAGE_STATUS"),
      LAB_TWO_CYCLE_LANGUAGE_RECOGNIZED: textField(evidence, "LAB_TWO_CYCLE_LANGUAGE_RECOGNIZED"),
      MACRO_WEST_BRIDGE_STATUS: textField(evidence, "MACRO_WEST_BRIDGE_STATUS"),
      CANVAS_AUTHORITY_STATUS: textField(evidence, "CANVAS_AUTHORITY_STATUS"),
      CANVAS_LOCAL_STATION_STATUS: textField(evidence, "CANVAS_LOCAL_STATION_STATUS"),
      CANVAS_FOUR_WAY_HANDOFF_STATUS: textField(evidence, "CANVAS_FOUR_WAY_HANDOFF_STATUS"),
      BISHOP_HUB_BRIDGE_STATUS: textField(evidence, "BISHOP_HUB_BRIDGE_STATUS"),
      MODERN_FINGER_VOCABULARY_ACTIVE: textField(evidence, "MODERN_FINGER_VOCABULARY_ACTIVE"),
      SURFACE_POINTER_FINGER_VOCABULARY_ACTIVE: textField(evidence, "SURFACE_POINTER_FINGER_VOCABULARY_ACTIVE"),

      EAST_SECONDARY_EVIDENCE_NOTES: textField(evidence, "EAST_SECONDARY_EVIDENCE_NOTES", FALLBACK.NONE)
    };

    const hasRequiredShape = Boolean(
      normalized.EAST_SOURCE_READ_STATUS !== FALLBACK.UNKNOWN &&
      normalized.CACHE_OR_SERVED_CONTRACT_MISMATCH !== FALLBACK.UNKNOWN &&
      normalized.CASE_5_SUPPORT !== FALLBACK.UNKNOWN
    );

    const westCompatible = normalized.EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE === "true";
    const expectedWest = normalized.EAST_EXPECTED_WEST_IMPLEMENTATION_CONTRACT === WEST_STANDARD_IMPLEMENTATION_CONTRACT;
    const currentSpread = normalized.EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED === "true";
    const controlBoundaryClean =
      normalized.CONTROL_ABSENCE_IS_CASE_5 === "false" &&
      normalized.CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET === "false";

    normalized.PROBE_EAST_EVIDENCE_SHAPE_VALID = boolText(hasRequiredShape, "false");
    normalized.PROBE_EAST_WEST_STANDARD_COMPATIBLE = boolText(westCompatible || expectedWest, "false");
    normalized.PROBE_EAST_CURRENT_SPREAD_RECOGNIZED = boolText(currentSpread, "false");
    normalized.PROBE_EAST_CONTROL_BOUNDARY_CLEAN = boolText(controlBoundaryClean, "false");

    normalized.PROBE_EAST_BRIDGE_CLASS = hasRequiredShape
      ? westCompatible || expectedWest
        ? currentSpread
          ? "EAST_SOURCE_BRIDGE_COMPLETE_CURRENT_SPREAD_AND_WEST_STANDARD"
          : "EAST_SOURCE_BRIDGE_COMPLETE_WEST_STANDARD_CURRENT_SPREAD_PARTIAL"
        : "EAST_SOURCE_BRIDGE_PARTIAL_WEST_STANDARD_NOT_CONFIRMED"
      : "EAST_SOURCE_BRIDGE_HELD_EVIDENCE_SHAPE_INCOMPLETE";

    if (hasRequiredShape) addNote(state, "PROBE_EAST_SOURCE_EVIDENCE_SHAPE_VALID");
    else addNote(state, "PROBE_EAST_SOURCE_EVIDENCE_SHAPE_INCOMPLETE");

    if (westCompatible || expectedWest) addNote(state, "PROBE_EAST_CONFIRMS_WEST_STANDARD_COMPATIBLE_SOURCE_FOOTPRINT");
    else addNote(state, "PROBE_EAST_WEST_STANDARD_COMPATIBILITY_NOT_CONFIRMED");

    if (currentSpread) addNote(state, "PROBE_EAST_CONFIRMS_CURRENT_SPREAD_RECOGNITION");
    if (controlBoundaryClean) addNote(state, "PROBE_EAST_CONFIRMS_CONTROL_ABSENCE_NOT_VISIBLE_PLANET_FAILURE");

    return normalized;
  }

  function makeState() {
    return {
      probeStatus: STATUS.READY,
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      sourceEastFile: EAST_FILE,
      sourceEastExpectedContract: SOURCE_EAST_CONTRACT,
      sourceEastExpectedReceipt: SOURCE_EAST_RECEIPT,
      sourceEastExpectedImplementationContract: SOURCE_EAST_IMPLEMENTATION_CONTRACT,
      sourceEastExpectedImplementationReceipt: SOURCE_EAST_IMPLEMENTATION_RECEIPT,

      northProbeExpectedFile: NORTH_PROBE_EXPECTED_FILE,
      westProbeExpectedFile: WEST_PROBE_EXPECTED_FILE,
      southProbeExpectedFile: SOUTH_PROBE_EXPECTED_FILE,

      eastAuthorityObserved: false,
      eastAuthoritySource: "NONE",
      eastContract: FALLBACK.UNKNOWN,
      eastReceipt: FALLBACK.UNKNOWN,
      eastImplementationContract: FALLBACK.UNKNOWN,
      eastImplementationReceipt: FALLBACK.UNKNOWN,

      eastRunApiAvailable: false,
      eastReceiptApiAvailable: false,
      eastStateApiAvailable: false,
      eastPublicApiSufficient: false,

      eastPublishedEvidenceObserved: false,
      eastPublishedEvidenceSource: "NONE",

      runRequested: false,
      runAttempted: false,
      runAcceptedBySourceEast: false,
      runStatus: FALLBACK.SOURCE_EAST_RUN_NOT_REQUESTED,
      runError: "",

      sourceEvidenceObserved: false,
      sourceEvidenceShapeValid: "false",
      probeBridgeClass: FALLBACK.BRIDGE_HELD,

      normalizedEvidence: {},
      sourceReceipt: {},
      sourceState: {},

      recommendedNextOwner: "PROBE_NORTH_COORDINATION",
      recommendedNextFile: NORTH_PROBE_EXPECTED_FILE,
      recommendedNextAction: "FEED_PROBE_EAST_EVIDENCE_TO_PROBE_NORTH_EIGHT_WAY_COORDINATOR",

      notes: [],
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function inspectSourceEast(state) {
    const found = findFirst(EAST_AUTHORITY_ALIASES);
    const authority = found.value;
    const receipt = readAuthorityReceipt(authority);
    const sourceState = readAuthorityState(authority);
    const receiptFields = normalizeSourceEastReceipt(receipt || {});
    const publishedEvidence = findPublishedEvidence();

    state.eastAuthorityObserved = Boolean(authority);
    state.eastAuthoritySource = found.path;

    state.sourceReceipt = clonePlain(receipt || {});
    state.sourceState = clonePlain(sourceState || {});

    state.eastContract = receiptFields.contract;
    state.eastReceipt = receiptFields.receipt;
    state.eastImplementationContract = receiptFields.implementationContract;
    state.eastImplementationReceipt = receiptFields.implementationReceipt;

    state.eastRunApiAvailable = Boolean(authority && isFunction(authority.runEastSourceRead));
    state.eastReceiptApiAvailable = Boolean(authority && isFunction(authority.getEastReceipt));
    state.eastStateApiAvailable = Boolean(authority && isFunction(authority.getEastState));
    state.eastPublicApiSufficient = Boolean(
      state.eastAuthorityObserved &&
      state.eastRunApiAvailable &&
      state.eastReceiptApiAvailable &&
      state.eastStateApiAvailable
    );

    state.eastPublishedEvidenceObserved = Boolean(publishedEvidence.value);
    state.eastPublishedEvidenceSource = publishedEvidence.path;

    if (state.eastAuthorityObserved) addNote(state, `PROBE_EAST_AUTHORITY_OBSERVED:${state.eastAuthoritySource}`);
    else addNote(state, "PROBE_EAST_AUTHORITY_NOT_OBSERVED");

    if (state.eastPublicApiSufficient) addNote(state, "PROBE_EAST_PUBLIC_API_SUFFICIENT");
    else addNote(state, "PROBE_EAST_PUBLIC_API_INCOMPLETE_OR_MISSING");

    if (state.eastPublishedEvidenceObserved) addNote(state, `PROBE_EAST_PUBLISHED_EVIDENCE_OBSERVED:${state.eastPublishedEvidenceSource}`);

    return {
      authority,
      receipt,
      sourceState,
      publishedEvidence: publishedEvidence.value
    };
  }

  async function runSourceEastIfAllowed(source, state, options) {
    const authority = source.authority;

    state.runRequested = options.runSourceEast !== false;

    if (!state.runRequested) {
      state.runStatus = FALLBACK.SOURCE_EAST_RUN_NOT_REQUESTED;
      addNote(state, "PROBE_EAST_SOURCE_RUN_NOT_REQUESTED");
      return null;
    }

    if (!authority || !isFunction(authority.runEastSourceRead)) {
      state.runStatus = FALLBACK.SOURCE_EAST_API_MISSING;
      addNote(state, "PROBE_EAST_SOURCE_RUN_API_MISSING");
      return null;
    }

    state.runAttempted = true;
    state.runStatus = STATUS.RUNNING;

    try {
      const runOptions = {
        northProbeContract: CONTRACT,
        probeEastContract: CONTRACT,
        sourceEastFile: EAST_FILE,
        targetRoute: TARGET_ROUTE,
        diagnosticRoute: DIAGNOSTIC_ROUTE,
        westStandardImplementationContract: WEST_STANDARD_IMPLEMENTATION_CONTRACT
      };

      if (options.targetDocument) runOptions.targetDocument = options.targetDocument;
      if (options.targetWindow) runOptions.targetWindow = options.targetWindow;
      if (options.frameElement) runOptions.frameElement = options.frameElement;

      const result = await Promise.resolve(authority.runEastSourceRead(runOptions));

      state.runAcceptedBySourceEast = Boolean(result && result.ok !== false);
      state.runStatus = state.runAcceptedBySourceEast ? STATUS.COMPLETE : STATUS.PARTIAL;

      addNote(state, state.runAcceptedBySourceEast
        ? "PROBE_EAST_SOURCE_RUN_COMPLETED_THROUGH_PUBLIC_API"
        : "PROBE_EAST_SOURCE_RUN_RETURNED_PARTIAL_OR_FALSE_OK"
      );

      return isObject(result) ? result : null;
    } catch (error) {
      state.runAcceptedBySourceEast = false;
      state.runStatus = STATUS.FAILED;
      state.runError = bounded(error && error.message ? error.message : error, 1200);
      addNote(state, `PROBE_EAST_SOURCE_RUN_ERROR:${state.runError}`);
      return null;
    }
  }

  function selectRawEvidence(source, runResult) {
    if (isObject(runResult && runResult.evidence)) return runResult.evidence;
    if (isObject(source.publishedEvidence)) return source.publishedEvidence;

    const refreshedPublished = findPublishedEvidence();
    if (isObject(refreshedPublished.value)) return refreshedPublished.value;

    if (isObject(source.sourceState && source.sourceState.lastEvidencePacket)) return source.sourceState.lastEvidencePacket;
    if (isObject(source.sourceState && source.sourceState.evidence)) return source.sourceState.evidence;

    return null;
  }

  function finalizeStateFromEvidence(state, rawEvidence) {
    state.sourceEvidenceObserved = Boolean(rawEvidence);
    state.normalizedEvidence = rawEvidence ? normalizeEastEvidence(rawEvidence, state) : {};

    if (!rawEvidence) {
      state.sourceEvidenceShapeValid = "false";
      state.probeBridgeClass = FALLBACK.SOURCE_EAST_EVIDENCE_MISSING;
      state.probeStatus = state.eastAuthorityObserved ? STATUS.PARTIAL : STATUS.HELD;
      state.recommendedNextOwner = "PROBE_EAST_SOURCE_EVIDENCE";
      state.recommendedNextFile = EAST_FILE;
      state.recommendedNextAction = "VERIFY_EAST_PUBLIC_EVIDENCE_PUBLICATION_WITHOUT_RENEWING_EAST";
      addNote(state, "PROBE_EAST_SOURCE_EVIDENCE_MISSING");
      return;
    }

    state.sourceEvidenceShapeValid = state.normalizedEvidence.PROBE_EAST_EVIDENCE_SHAPE_VALID;
    state.probeBridgeClass = state.normalizedEvidence.PROBE_EAST_BRIDGE_CLASS;

    const complete = (
      state.sourceEvidenceShapeValid === "true" &&
      state.normalizedEvidence.PROBE_EAST_WEST_STANDARD_COMPATIBLE === "true"
    );

    state.probeStatus = complete ? STATUS.COMPLETE : STATUS.PARTIAL;

    state.recommendedNextOwner = "PROBE_NORTH_COORDINATION";
    state.recommendedNextFile = NORTH_PROBE_EXPECTED_FILE;
    state.recommendedNextAction = complete
      ? "PROBE_NORTH_CAN_CONSUME_EAST_PROBE_AS_SOURCE_SIDE_COMPLETE"
      : "PROBE_NORTH_CAN_CONSUME_EAST_PROBE_AS_PARTIAL_SOURCE_SIDE_EVIDENCE";

    addNote(state, complete
      ? "PROBE_EAST_BRIDGE_READY_FOR_PROBE_NORTH"
      : "PROBE_EAST_BRIDGE_PARTIAL_BUT_READABLE_BY_PROBE_NORTH"
    );
  }

  function makeEvidence(state) {
    const e = state.normalizedEvidence || {};

    return {
      PROBE_NAME: "HEARTH_DIAGNOSTIC_PROBE_EAST",
      PROBE_CONTRACT: CONTRACT,
      PROBE_RECEIPT: RECEIPT,
      PROBE_VERSION: VERSION,
      PROBE_FILE: FILE,
      PROBE_ROLE: "EAST_PROBE_SERVED_SOURCE_BRIDGE",
      PROBE_STATUS: state.probeStatus,
      PROBE_BRIDGE_CLASS: state.probeBridgeClass,
      PROBE_UPDATED_AT: state.updatedAt,

      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,

      SOURCE_EAST_FILE: EAST_FILE,
      SOURCE_EAST_EXPECTED_CONTRACT: SOURCE_EAST_CONTRACT,
      SOURCE_EAST_EXPECTED_RECEIPT: SOURCE_EAST_RECEIPT,
      SOURCE_EAST_EXPECTED_IMPLEMENTATION_CONTRACT: SOURCE_EAST_IMPLEMENTATION_CONTRACT,
      SOURCE_EAST_EXPECTED_IMPLEMENTATION_RECEIPT: SOURCE_EAST_IMPLEMENTATION_RECEIPT,

      EAST_AUTHORITY_OBSERVED: state.eastAuthorityObserved,
      EAST_AUTHORITY_SOURCE: state.eastAuthoritySource,
      EAST_CONTRACT: state.eastContract,
      EAST_RECEIPT: state.eastReceipt,
      EAST_IMPLEMENTATION_CONTRACT: state.eastImplementationContract,
      EAST_IMPLEMENTATION_RECEIPT: state.eastImplementationReceipt,

      EAST_RUN_API_AVAILABLE: state.eastRunApiAvailable,
      EAST_RECEIPT_API_AVAILABLE: state.eastReceiptApiAvailable,
      EAST_STATE_API_AVAILABLE: state.eastStateApiAvailable,
      EAST_PUBLIC_API_SUFFICIENT: state.eastPublicApiSufficient,

      EAST_PUBLISHED_EVIDENCE_OBSERVED: state.eastPublishedEvidenceObserved,
      EAST_PUBLISHED_EVIDENCE_SOURCE: state.eastPublishedEvidenceSource,

      EAST_RUN_REQUESTED: state.runRequested,
      EAST_RUN_ATTEMPTED: state.runAttempted,
      EAST_RUN_ACCEPTED_BY_SOURCE_EAST: state.runAcceptedBySourceEast,
      EAST_RUN_STATUS: state.runStatus,
      EAST_RUN_ERROR: state.runError,

      SOURCE_EVIDENCE_OBSERVED: state.sourceEvidenceObserved,
      SOURCE_EVIDENCE_SHAPE_VALID: state.sourceEvidenceShapeValid,

      EAST_SOURCE_READ_STATUS: e.EAST_SOURCE_READ_STATUS || FALLBACK.UNKNOWN,
      EAST_SOURCE_READ_COMPLETE: e.EAST_SOURCE_READ_COMPLETE || FALLBACK.UNKNOWN,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: e.DIAGNOSTIC_TARGET_ACCESS_STATUS || FALLBACK.UNKNOWN,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: e.DIAGNOSTIC_TARGET_ACCESS_ERROR || FALLBACK.UNKNOWN,

      EXPECTED_HTML_CONTRACT: e.EXPECTED_HTML_CONTRACT || FALLBACK.UNKNOWN,
      EXPECTED_INDEX_JS_CONTRACT: e.EXPECTED_INDEX_JS_CONTRACT || FALLBACK.UNKNOWN,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: e.EXPECTED_ROUTE_CONDUCTOR_CONTRACT || FALLBACK.UNKNOWN,

      SERVED_HTML_CONTRACT: e.SERVED_HTML_CONTRACT || FALLBACK.UNKNOWN,
      SERVED_INDEX_JS_CONTRACT: e.SERVED_INDEX_JS_CONTRACT || FALLBACK.UNKNOWN,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: e.SERVED_ROUTE_CONDUCTOR_CONTRACT || FALLBACK.UNKNOWN,

      INDEX_SCRIPT_SRC: e.INDEX_SCRIPT_SRC || FALLBACK.UNKNOWN,
      ROUTE_CONDUCTOR_SCRIPT_SRC: e.ROUTE_CONDUCTOR_SCRIPT_SRC || FALLBACK.UNKNOWN,
      ROUTE_CONDUCTOR_AUTHORITY_CONTRACT: e.ROUTE_CONDUCTOR_AUTHORITY_CONTRACT || FALLBACK.UNKNOWN,
      ROUTE_CONDUCTOR_AUTHORITY_SOURCE: e.ROUTE_CONDUCTOR_AUTHORITY_SOURCE || FALLBACK.UNKNOWN,

      HTML_CONTRACT_RECOGNIZED: e.HTML_CONTRACT_RECOGNIZED || FALLBACK.UNKNOWN,
      INDEX_CONTRACT_RECOGNIZED: e.INDEX_CONTRACT_RECOGNIZED || FALLBACK.UNKNOWN,
      ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: e.ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED || FALLBACK.UNKNOWN,
      PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: e.PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED || FALLBACK.UNKNOWN,
      ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5:
        e.ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5 || FALLBACK.UNKNOWN,
      EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED:
        e.EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED || FALLBACK.UNKNOWN,

      CACHE_OR_SERVED_CONTRACT_MISMATCH: e.CACHE_OR_SERVED_CONTRACT_MISMATCH || FALLBACK.UNKNOWN,
      CASE_5_SUPPORT: e.CASE_5_SUPPORT || FALLBACK.UNKNOWN,

      EAST_TARGET_ALIGNMENT_CONTRACT: e.EAST_TARGET_ALIGNMENT_CONTRACT || SOURCE_EAST_IMPLEMENTATION_CONTRACT,
      EAST_CANVAS_EXPRESSION_SOURCE_ALIGNMENT_STATUS:
        e.EAST_CANVAS_EXPRESSION_SOURCE_ALIGNMENT_STATUS || FALLBACK.UNKNOWN,
      EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_STATUS:
        e.EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_STATUS || FALLBACK.UNKNOWN,
      EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE:
        e.EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE || FALLBACK.UNKNOWN,
      EAST_EXPECTED_WEST_IMPLEMENTATION_CONTRACT:
        e.EAST_EXPECTED_WEST_IMPLEMENTATION_CONTRACT || WEST_STANDARD_IMPLEMENTATION_CONTRACT,
      WEST_STANDARD_IMPLEMENTATION_CONTRACT:
        e.WEST_STANDARD_IMPLEMENTATION_CONTRACT || WEST_STANDARD_IMPLEMENTATION_CONTRACT,

      PROBE_EAST_EVIDENCE_SHAPE_VALID: e.PROBE_EAST_EVIDENCE_SHAPE_VALID || "false",
      PROBE_EAST_WEST_STANDARD_COMPATIBLE: e.PROBE_EAST_WEST_STANDARD_COMPATIBLE || "false",
      PROBE_EAST_CURRENT_SPREAD_RECOGNIZED: e.PROBE_EAST_CURRENT_SPREAD_RECOGNIZED || "false",
      PROBE_EAST_CONTROL_BOUNDARY_CLEAN: e.PROBE_EAST_CONTROL_BOUNDARY_CLEAN || "false",

      EXPECTED_CONTROL_FILE: e.EXPECTED_CONTROL_FILE || CONTROL_FILE,
      EXPECTED_CONTROL_CONTRACT: e.EXPECTED_CONTROL_CONTRACT || FALLBACK.UNKNOWN,
      CONTROL_FILE: e.CONTROL_FILE || CONTROL_FILE,
      CONTROL_FILE_EXPECTED: e.CONTROL_FILE_EXPECTED || FALLBACK.UNKNOWN,
      CONTROL_FILE_STATUS: e.CONTROL_FILE_STATUS || FALLBACK.UNKNOWN,
      CONTROL_FILE_LOADED: e.CONTROL_FILE_LOADED || FALLBACK.UNKNOWN,
      CONTROL_GLOBAL_PRESENT: e.CONTROL_GLOBAL_PRESENT || FALLBACK.UNKNOWN,
      CONTROL_RECEIPT_PRESENT: e.CONTROL_RECEIPT_PRESENT || FALLBACK.UNKNOWN,
      CONTROL_ABSENCE_IS_FAILURE: e.CONTROL_ABSENCE_IS_FAILURE || FALLBACK.UNKNOWN,
      CONTROL_ABSENCE_IS_CASE_5: e.CONTROL_ABSENCE_IS_CASE_5 || FALLBACK.UNKNOWN,
      CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET: e.CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET || FALLBACK.UNKNOWN,
      CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH: e.CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH || FALLBACK.UNKNOWN,
      CONTROL_HANDSHAKE_STATUS: e.CONTROL_HANDSHAKE_STATUS || FALLBACK.UNKNOWN,
      HEARTH_JS_CONTROL_HANDSHAKE_STATUS: e.HEARTH_JS_CONTROL_HANDSHAKE_STATUS || FALLBACK.UNKNOWN,
      HEARTH_JS_LOADS_OR_RECOGNIZES_CONTROL_FILE:
        e.HEARTH_JS_LOADS_OR_RECOGNIZES_CONTROL_FILE || FALLBACK.UNKNOWN,
      MOTION_TOUCH_STATUS: e.MOTION_TOUCH_STATUS || FALLBACK.UNKNOWN,
      DRAG_STATUS: e.DRAG_STATUS || FALLBACK.UNKNOWN,
      VIEW_CONTROL_STATUS: e.VIEW_CONTROL_STATUS || FALLBACK.UNKNOWN,
      VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS:
        e.VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS || FALLBACK.UNKNOWN,

      LAB_CANVAS_SHARED_LANGUAGE_STATUS: e.LAB_CANVAS_SHARED_LANGUAGE_STATUS || FALLBACK.UNKNOWN,
      LAB_TWO_CYCLE_LANGUAGE_RECOGNIZED: e.LAB_TWO_CYCLE_LANGUAGE_RECOGNIZED || FALLBACK.UNKNOWN,
      MACRO_WEST_BRIDGE_STATUS: e.MACRO_WEST_BRIDGE_STATUS || FALLBACK.UNKNOWN,
      CANVAS_AUTHORITY_STATUS: e.CANVAS_AUTHORITY_STATUS || FALLBACK.UNKNOWN,
      CANVAS_LOCAL_STATION_STATUS: e.CANVAS_LOCAL_STATION_STATUS || FALLBACK.UNKNOWN,
      CANVAS_FOUR_WAY_HANDOFF_STATUS: e.CANVAS_FOUR_WAY_HANDOFF_STATUS || FALLBACK.UNKNOWN,
      BISHOP_HUB_BRIDGE_STATUS: e.BISHOP_HUB_BRIDGE_STATUS || FALLBACK.UNKNOWN,
      MODERN_FINGER_VOCABULARY_ACTIVE: e.MODERN_FINGER_VOCABULARY_ACTIVE || FALLBACK.UNKNOWN,
      SURFACE_POINTER_FINGER_VOCABULARY_ACTIVE:
        e.SURFACE_POINTER_FINGER_VOCABULARY_ACTIVE || FALLBACK.UNKNOWN,

      EAST_SECONDARY_EVIDENCE_NOTES: e.EAST_SECONDARY_EVIDENCE_NOTES || FALLBACK.NONE,
      PROBE_EAST_NOTES: state.notes.join(" | ") || FALLBACK.NONE,

      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      NORTH_PROBE_EXPECTED_FILE: NORTH_PROBE_EXPECTED_FILE,
      WEST_PROBE_EXPECTED_FILE: WEST_PROBE_EXPECTED_FILE,
      SOUTH_PROBE_EXPECTED_FILE: SOUTH_PROBE_EXPECTED_FILE,

      PROBE_OWNS_ORIGIN_EAST: false,
      PROBE_MUTATES_ORIGIN_EAST: false,
      PROBE_DYNAMIC_LOADS_EAST: false,
      PROBE_REPAIRS_HEARTH: false,
      PROBE_MUTATES_PRODUCTION: false,
      PROBE_FINAL_CASE_AUTHORITY: false,
      PROBE_FINAL_RECOMMENDATION_AUTHORITY: false,
      PROBE_RENDERED_TARGET_AUTHORITY: false,
      PROBE_SERVED_SOURCE_BRIDGE_AUTHORITY: true,

      ...NO_CLAIMS
    };
  }

  function makeReceipt(state) {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: "diagnostic-probe-east-served-source-bridge",
      sourceEastFile: EAST_FILE,
      sourceEastExpectedContract: SOURCE_EAST_CONTRACT,
      sourceEastExpectedReceipt: SOURCE_EAST_RECEIPT,
      sourceEastExpectedImplementationContract: SOURCE_EAST_IMPLEMENTATION_CONTRACT,
      sourceEastExpectedImplementationReceipt: SOURCE_EAST_IMPLEMENTATION_RECEIPT,

      probeStatus: state.probeStatus,
      probeBridgeClass: state.probeBridgeClass,

      eastAuthorityObserved: state.eastAuthorityObserved,
      eastAuthoritySource: state.eastAuthoritySource,
      eastContract: state.eastContract,
      eastReceipt: state.eastReceipt,
      eastImplementationContract: state.eastImplementationContract,
      eastImplementationReceipt: state.eastImplementationReceipt,

      eastRunApiAvailable: state.eastRunApiAvailable,
      eastReceiptApiAvailable: state.eastReceiptApiAvailable,
      eastStateApiAvailable: state.eastStateApiAvailable,
      eastPublicApiSufficient: state.eastPublicApiSufficient,

      eastPublishedEvidenceObserved: state.eastPublishedEvidenceObserved,
      eastPublishedEvidenceSource: state.eastPublishedEvidenceSource,

      runRequested: state.runRequested,
      runAttempted: state.runAttempted,
      runAcceptedBySourceEast: state.runAcceptedBySourceEast,
      runStatus: state.runStatus,
      runError: state.runError,

      sourceEvidenceObserved: state.sourceEvidenceObserved,
      sourceEvidenceShapeValid: state.sourceEvidenceShapeValid,

      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,

      northProbeExpectedFile: NORTH_PROBE_EXPECTED_FILE,
      westProbeExpectedFile: WEST_PROBE_EXPECTED_FILE,
      southProbeExpectedFile: SOUTH_PROBE_EXPECTED_FILE,

      runProbeEastApiAvailable: true,
      getProbeEastReceiptApiAvailable: true,
      getProbeEastEvidenceApiAvailable: true,
      getProbeEastStateApiAvailable: true,
      getProbeEastPacketTextApiAvailable: true,

      consumesSourceEastPublicApiOnly: true,
      dynamicLoadingOwned: false,
      originEastRenewalRequired: false,

      ownsOriginEast: false,
      mutatesOriginEast: false,
      ownsFinalPrimaryCase: false,
      ownsFinalRecommendation: false,
      ownsRenderedTargetProbe: false,
      ownsDiagnosticUi: false,
      ownsProductionMutation: false,
      ownsCacheRepair: false,
      ownsHearthRepair: false,
      ownsRuntimeRestart: false,
      ownsCanvasRelease: false,
      ownsMacroWestRelease: false,
      ownsLabRuntimeAuthority: false,
      ownsBishopInternals: false,
      ownsControlImplementation: false,
      ownsMotionTouchExecution: false,

      ...NO_CLAIMS,

      updatedAt: state.updatedAt || nowIso()
    };
  }

  function composePacketText(evidence) {
    const order = [
      "PROBE_NAME",
      "PROBE_CONTRACT",
      "PROBE_RECEIPT",
      "PROBE_VERSION",
      "PROBE_FILE",
      "PROBE_ROLE",
      "PROBE_STATUS",
      "PROBE_BRIDGE_CLASS",
      "SOURCE_EAST_FILE",
      "SOURCE_EAST_EXPECTED_CONTRACT",
      "SOURCE_EAST_EXPECTED_IMPLEMENTATION_CONTRACT",
      "EAST_AUTHORITY_OBSERVED",
      "EAST_AUTHORITY_SOURCE",
      "EAST_CONTRACT",
      "EAST_RECEIPT",
      "EAST_IMPLEMENTATION_CONTRACT",
      "EAST_RUN_API_AVAILABLE",
      "EAST_PUBLIC_API_SUFFICIENT",
      "EAST_RUN_STATUS",
      "SOURCE_EVIDENCE_OBSERVED",
      "SOURCE_EVIDENCE_SHAPE_VALID",
      "EAST_SOURCE_READ_STATUS",
      "DIAGNOSTIC_TARGET_ACCESS_STATUS",
      "SERVED_HTML_CONTRACT",
      "SERVED_INDEX_JS_CONTRACT",
      "SERVED_ROUTE_CONDUCTOR_CONTRACT",
      "ROUTE_CONDUCTOR_AUTHORITY_CONTRACT",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "CASE_5_SUPPORT",
      "EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED",
      "EAST_CANVAS_EXPRESSION_SOURCE_FOOTPRINT_STATUS",
      "EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE",
      "EAST_EXPECTED_WEST_IMPLEMENTATION_CONTRACT",
      "CONTROL_FILE_STATUS",
      "CONTROL_ABSENCE_IS_CASE_5",
      "CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET",
      "MOTION_TOUCH_STATUS",
      "DRAG_STATUS",
      "VIEW_CONTROL_STATUS",
      "LAB_CANVAS_SHARED_LANGUAGE_STATUS",
      "MACRO_WEST_BRIDGE_STATUS",
      "CANVAS_AUTHORITY_STATUS",
      "CANVAS_LOCAL_STATION_STATUS",
      "CANVAS_FOUR_WAY_HANDOFF_STATUS",
      "BISHOP_HUB_BRIDGE_STATUS",
      "MODERN_FINGER_VOCABULARY_ACTIVE",
      "SURFACE_POINTER_FINGER_VOCABULARY_ACTIVE",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "PROBE_OWNS_ORIGIN_EAST",
      "PROBE_MUTATES_ORIGIN_EAST",
      "PROBE_DYNAMIC_LOADS_EAST",
      "PROBE_FINAL_CASE_AUTHORITY",
      "PROBE_RENDERED_TARGET_AUTHORITY",
      "f13Claimed",
      "f21EligibleForNorth",
      "f21ClaimedByDiagnosticRail",
      "readyTextAllowed",
      "visualPassClaimed",
      "generatedImage",
      "graphicBox",
      "webGL",
      "PROBE_EAST_NOTES"
    ];

    const seen = new Set();
    const keys = [];

    order.forEach((key) => {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    });

    Object.keys(evidence || {}).forEach((key) => {
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    });

    return keys.map((key) => line(key, evidence[key])).join("\n");
  }

  async function runProbeEast(options = {}) {
    const state = makeState();
    state.probeStatus = STATUS.RUNNING;
    state.updatedAt = nowIso();

    const source = inspectSourceEast(state);
    const runResult = await runSourceEastIfAllowed(source, state, options);
    const rawEvidence = selectRawEvidence(source, runResult);

    finalizeStateFromEvidence(state, rawEvidence);

    state.updatedAt = nowIso();
    publish(state);

    return {
      ok: state.probeStatus !== STATUS.FAILED && state.probeStatus !== STATUS.HELD,
      contract: CONTRACT,
      receipt: RECEIPT,
      evidence: clonePlain(lastEvidence),
      receiptObject: clonePlain(lastReceipt),
      packetText: lastPacketText,
      state: clonePlain(lastState)
    };
  }

  function getProbeEastEvidence() {
    return clonePlain(lastEvidence || makeEvidence(makeState()));
  }

  function getProbeEastReceipt() {
    return clonePlain(lastReceipt || makeReceipt(makeState()));
  }

  function getProbeEastState() {
    return clonePlain(lastState || makeState());
  }

  function getProbeEastPacketText() {
    return lastPacketText || composePacketText(makeEvidence(makeState()));
  }

  function getStatusText() {
    const e = getProbeEastEvidence();

    return [
      line("PROBE_CONTRACT", CONTRACT),
      line("PROBE_STATUS", e.PROBE_STATUS),
      line("PROBE_BRIDGE_CLASS", e.PROBE_BRIDGE_CLASS),
      line("EAST_AUTHORITY_OBSERVED", e.EAST_AUTHORITY_OBSERVED),
      line("EAST_PUBLIC_API_SUFFICIENT", e.EAST_PUBLIC_API_SUFFICIENT),
      line("SOURCE_EVIDENCE_OBSERVED", e.SOURCE_EVIDENCE_OBSERVED),
      line("SOURCE_EVIDENCE_SHAPE_VALID", e.SOURCE_EVIDENCE_SHAPE_VALID),
      line("EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE", e.EAST_CANVAS_EXPRESSION_WEST_STANDARD_COMPATIBLE),
      line("CACHE_OR_SERVED_CONTRACT_MISMATCH", e.CACHE_OR_SERVED_CONTRACT_MISMATCH),
      line("CASE_5_SUPPORT", e.CASE_5_SUPPORT),
      line("RECOMMENDED_NEXT_FILE", e.RECOMMENDED_NEXT_FILE)
    ].join("\n");
  }

  function receiveNorthProbeRequest(packet = {}, options = {}) {
    const runSourceEast = packet.runSourceEast !== false && options.runSourceEast !== false;

    return runProbeEast({
      ...options,
      runSourceEast,
      targetDocument: options.targetDocument,
      targetWindow: options.targetWindow,
      frameElement: options.frameElement
    });
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastEvidence = makeEvidence(state);
    lastReceipt = makeReceipt(state);
    lastPacketText = composePacketText(lastEvidence);

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeEast = api;
    root.HEARTH.diagnosticRailProbeEast = api;
    root.HEARTH.probeEast = api;
    root.HEARTH.diagnosticProbeEastReceipt = clonePlain(lastReceipt);
    root.HEARTH.diagnosticRailProbeEastReceipt = clonePlain(lastReceipt);
    root.HEARTH.diagnosticProbeEastEvidence = clonePlain(lastEvidence);
    root.HEARTH.diagnosticRailProbeEastEvidence = clonePlain(lastEvidence);

    root.DEXTER_LAB.hearthDiagnosticProbeEast = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeEast = api;
    root.DEXTER_LAB.hearthProbeEast = api;

    root.HEARTH_DIAGNOSTIC_PROBE_EAST = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_EAST = api;
    root.HEARTH_PROBE_EAST = api;

    root.HEARTH_DIAGNOSTIC_PROBE_EAST_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_EAST_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_PROBE_EAST_RECEIPT = clonePlain(lastReceipt);

    root.HEARTH_DIAGNOSTIC_PROBE_EAST_EVIDENCE = clonePlain(lastEvidence);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_EAST_EVIDENCE = clonePlain(lastEvidence);
    root.HEARTH_PROBE_EAST_EVIDENCE = clonePlain(lastEvidence);

    root.HEARTH_DIAGNOSTIC_PROBE_EAST_PACKET_TEXT = lastPacketText;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    sourceEastFile: EAST_FILE,
    sourceEastExpectedContract: SOURCE_EAST_CONTRACT,
    sourceEastExpectedReceipt: SOURCE_EAST_RECEIPT,
    sourceEastExpectedImplementationContract: SOURCE_EAST_IMPLEMENTATION_CONTRACT,
    sourceEastExpectedImplementationReceipt: SOURCE_EAST_IMPLEMENTATION_RECEIPT,

    northProbeExpectedFile: NORTH_PROBE_EXPECTED_FILE,
    westProbeExpectedFile: WEST_PROBE_EXPECTED_FILE,
    southProbeExpectedFile: SOUTH_PROBE_EXPECTED_FILE,

    canvasFile: CANVAS_FILE,
    controlFile: CONTROL_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    indexFile: INDEX_FILE,
    westStandardImplementationContract: WEST_STANDARD_IMPLEMENTATION_CONTRACT,

    runProbeEast,
    runEastProbe: runProbeEast,
    run: runProbeEast,
    inspect: runProbeEast,

    receiveNorthProbeRequest,
    consumeNorthProbeRequest: receiveNorthProbeRequest,

    getProbeEastEvidence,
    getEvidence: getProbeEastEvidence,
    getProbeEastReceipt,
    getReceipt: getProbeEastReceipt,
    getReceiptLight: getProbeEastReceipt,
    getProbeEastState,
    getState: getProbeEastState,
    getProbeEastPacketText,
    getPacketText: getProbeEastPacketText,
    getStatusText,

    supportsProbeEastServedSourceBridge: true,
    supportsEightWayDiagnosticBridge: true,
    supportsOriginEastNoRenewal: true,
    supportsSourceEastPublicApiOnly: true,
    supportsNorthProbeConsumption: true,
    supportsPublishedEvidenceTranslation: true,
    supportsWestStandardCompatibilityMirroring: true,
    supportsControlBoundaryMirroring: true,
    supportsCase5EvidenceMirroring: true,

    ownsServedSourceProbeBridge: true,
    ownsOriginEast: false,
    ownsDynamicLoading: false,
    ownsRenderedTargetProbe: false,
    ownsFinalPrimaryCase: false,
    ownsFinalRecommendation: false,
    ownsDiagnosticUi: false,
    ownsProductionMutation: false,
    ownsCacheRepair: false,
    ownsHearthRepair: false,
    ownsRuntimeRestart: false,
    ownsCanvasDrawing: false,
    ownsCanvasRelease: false,
    ownsMacroWestRelease: false,
    ownsLabRuntimeAuthority: false,
    ownsBishopInternals: false,
    ownsControlImplementation: false,
    ownsMotionTouchExecution: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsExpressionRepair: false,

    ...NO_CLAIMS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
