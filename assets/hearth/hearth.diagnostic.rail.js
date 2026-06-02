// /assets/hearth/hearth.diagnostic.rail.js
// HEARTH_DIAGNOSTIC_RAIL_NORTH_PARENT_ORCHESTRATOR_TNT_v1
// Full-file replacement.
// Diagnostic rail NORTH parent only.
// Purpose:
// - Orchestrate the Hearth parallel diagnostic rail.
// - Consume already-loaded EAST, WEST, and SOUTH diagnostic child APIs.
// - Validate child receipts and evidence packets.
// - Select exactly one final PRIMARY_CASE by evidence.
// - Select final non-authorizing recommendation fields.
// - Hand normalized evidence to SOUTH for report output.
// - Verify SOUTH preserves NORTH-selected final meaning.
// - Publish route-facing public API for the future diagnostic route receiver.
// - Preserve protected production files as read-only observation targets.
// - Preserve no F13, no F21, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - dynamic child loading
// - detailed served-source parsing
// - detailed rendered-target probing
// - packet formatting except emergency fallback when SOUTH is unavailable or rejected
// - diagnostic UI
// - Hearth repair
// - production mutation
// - runtime restart
// - Canvas release
// - Macro West release

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_PARENT_ORCHESTRATOR_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_PARENT_ORCHESTRATOR_RECEIPT_v1";
  const VERSION = "2026-06-02.hearth-diagnostic-rail-north-parent-orchestrator-v1-refined";

  const FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const CHILD_LOADING_MODE = "CONSUME_ALREADY_LOADED_CHILD_GLOBALS";
  const ROUTE_RECEIVER_MUST_LOAD_CHILDREN_BEFORE_RUN = true;
  const NORTH_DYNAMIC_CHILD_LOADING_OWNED = false;

  const EAST_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const WEST_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const SOUTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

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
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE",
    PARTIAL: "PARTIAL",
    FAILED: "FAILED",
    FALLBACK: "FALLBACK"
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

  const CASES = Object.freeze({
    CASE_1: "CASE_1_HIT_TEST_FAILS_OVERLAY_OR_LAYERING",
    CASE_2: "CASE_2_HIT_TEST_PASSES_HANDLER_NOT_ATTACHED",
    CASE_3: "CASE_3_HIT_TEST_PASSES_GLOBAL_SUPPRESSION",
    CASE_4: "CASE_4_RECEIPT_PANEL_OR_TEXT_NODE_MISSING",
    CASE_5: "CASE_5_SERVED_CACHE_MISMATCH",
    CASE_6: "CASE_6_RUNTIME_RELEASE_LOCK",
    CASE_7: "CASE_7_DIAGNOSTIC_TARGET_UNAVAILABLE",
    INCONCLUSIVE: "INCONCLUSIVE_EVIDENCE"
  });

  const SUPPORT_TRUE = "true";
  const SUPPORT_FALSE = "false";

  const REQUIRED_REPORT_FIELDS = Object.freeze([
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

  const root = typeof window !== "undefined" ? window : globalThis;

  let lastState = null;
  let lastReport = null;
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

  function getValue(source, key, fallback = FALLBACK.UNKNOWN) {
    if (!isObject(source)) return fallback;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      return packetValue(source[key], fallback);
    }

    const lower = key.toLowerCase();

    for (const candidate of Object.keys(source)) {
      if (candidate.toLowerCase() === lower) {
        return packetValue(source[candidate], fallback);
      }
    }

    return fallback;
  }

  function addNote(state, note) {
    const clean = bounded(note, 1000);
    if (!clean) return;
    if (!state.northSecondaryEvidenceNotes.includes(clean)) {
      state.northSecondaryEvidenceNotes.push(clean);
    }
  }

  function normalizeNotes(...sources) {
    const notes = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === FALLBACK.NONE) continue;

      const values = Array.isArray(source)
        ? source
        : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1000);
        if (!clean || clean === FALLBACK.NONE) continue;
        if (!seen.has(clean)) {
          seen.add(clean);
          notes.push(clean);
        }
      }
    }

    return notes;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function findChild(candidates) {
    for (const path of candidates) {
      const found = readPath(root, path);
      if (found && isObject(found)) return found;
    }
    return null;
  }

  function makeState() {
    return {
      northStatus: STATUS.READY,
      northContract: CONTRACT,
      northReceipt: RECEIPT,
      diagnosticRunStatus: STATUS.READY,
      diagnosticTimestamp: nowIso(),

      childLoadingMode: CHILD_LOADING_MODE,
      routeReceiverMustLoadChildrenBeforeRun: ROUTE_RECEIVER_MUST_LOAD_CHILDREN_BEFORE_RUN,
      northDynamicChildLoadingOwned: NORTH_DYNAMIC_CHILD_LOADING_OWNED,

      childEastStatus: FALLBACK.UNKNOWN,
      childWestStatus: FALLBACK.UNKNOWN,
      childSouthStatus: FALLBACK.UNKNOWN,

      eastReceiptValid: CHILD_VALIDATION.MISSING,
      westReceiptValid: CHILD_VALIDATION.MISSING,
      southReceiptValid: CHILD_VALIDATION.MISSING,

      eastEvidenceValid: CHILD_VALIDATION.MISSING,
      westEvidenceValid: CHILD_VALIDATION.MISSING,
      southOutputValid: CHILD_VALIDATION.MISSING,

      eastSourceReadStatus: FALLBACK.UNKNOWN,
      westRenderedReadStatus: FALLBACK.UNKNOWN,
      southOutputStatus: FALLBACK.UNKNOWN,

      diagnosticTargetAccessStatus: FALLBACK.UNKNOWN,
      diagnosticTargetAccessError: FALLBACK.UNKNOWN,

      expectedHtmlContract: FALLBACK.UNKNOWN,
      expectedIndexJsContract: FALLBACK.UNKNOWN,
      expectedRouteConductorContract: FALLBACK.UNKNOWN,

      servedHtmlContract: FALLBACK.UNKNOWN,
      servedIndexJsContract: FALLBACK.UNKNOWN,
      servedRouteConductorContract: FALLBACK.UNKNOWN,
      indexScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,
      cacheOrServedContractMismatch: FALLBACK.UNKNOWN,

      currentVisibleHearthStatus: FALLBACK.UNKNOWN,

      showReceiptSelectorMatched: FALLBACK.UNKNOWN,
      showReceiptButtonExists: FALLBACK.UNKNOWN,
      showReceiptHitTestTarget: FALLBACK.UNKNOWN,
      showReceiptHitTestTargetSelector: FALLBACK.UNKNOWN,
      showReceiptHitTestTargetTag: FALLBACK.UNKNOWN,
      showReceiptTargetIsButton: FALLBACK.UNKNOWN,
      targetPointerEvents: FALLBACK.UNKNOWN,

      receiptPanelExists: FALLBACK.UNKNOWN,
      receiptTextNodeExists: FALLBACK.UNKNOWN,
      receiptPanelStateBeforeAction: FALLBACK.UNKNOWN,
      receiptPanelStateAfterAction: FALLBACK.UNKNOWN,
      showReceiptActionResult: FALLBACK.UNKNOWN,

      ancestorBlockerFound: FALLBACK.UNKNOWN,
      ancestorBlockerDetail: FALLBACK.UNKNOWN,
      overlayAboveControl: FALLBACK.UNKNOWN,
      overlayOwner: FALLBACK.UNKNOWN,

      globalEventSuppressionFound: FALLBACK.UNKNOWN,
      likelySuppressionOwner: FALLBACK.UNKNOWN,
      indexSuppressesVisibleControls: FALLBACK.UNKNOWN,

      runtimeReleaseState: FALLBACK.UNKNOWN,
      runtimeReleaseIsLock: FALLBACK.UNKNOWN,

      case1Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case2Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case3Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case4Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case5Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case6Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case7Support: FALLBACK.INSUFFICIENT_EVIDENCE,

      primaryCase: CASES.INCONCLUSIVE,
      secondaryEvidenceNotes: FALLBACK.NONE,
      northSecondaryEvidenceNotes: [],
      recommendedNextOwner: FALLBACK.INSUFFICIENT_EVIDENCE,
      recommendedNextFile: "HOLD_FOR_TEACHER_REVIEW",
      recommendedNextAction: "COLLECT_ADDITIONAL_RENDERED_TARGET_EVIDENCE",

      fullPacketText: "",
      compactSummary: "",
      reportObject: {},

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

  function getReceiptFromChild(child, receiptMethod) {
    try {
      if (!child || !isObject(child)) return null;
      if (receiptMethod && isFunction(child[receiptMethod])) return child[receiptMethod]();
      if (isFunction(child.getReceipt)) return child.getReceipt();
      if (isObject(child.receiptObject)) return child.receiptObject;
      if (isObject(child.receipt)) return child.receipt;
      return null;
    } catch (_error) {
      return null;
    }
  }

  function validateFalse(receipt, keys) {
    for (const key of keys) {
      if (receipt[key] !== false) return false;
    }
    return true;
  }

  function validateEastChild(child) {
    if (!child) return { status: CHILD_VALIDATION.MISSING, receipt: null };

    if (!isFunction(child.runEastSourceRead) || !isFunction(child.getEastReceipt) || !isFunction(child.getEastState)) {
      return { status: CHILD_VALIDATION.INVALID_API, receipt: null };
    }

    const receipt = getReceiptFromChild(child, "getEastReceipt");
    if (!receipt) return { status: CHILD_VALIDATION.UNREADABLE, receipt: null };

    if (receipt.contract !== EAST_CONTRACT) return { status: CHILD_VALIDATION.INVALID_CONTRACT, receipt };
    if (receipt.childRole !== "EAST_SERVED_SOURCE_EVIDENCE") return { status: CHILD_VALIDATION.INVALID_ROLE, receipt };

    const authorityOk = (
      receipt.servesNorth === true &&
      receipt.finalPrimaryCaseAuthority === false &&
      receipt.finalRecommendationAuthority === false &&
      receipt.renderedTargetAuthority === false &&
      receipt.syntheticActivationAuthority === false &&
      receipt.productionMutationAuthorized === false &&
      receipt.cacheRepairAuthorized === false &&
      receipt.hearthRepairAuthorized === false &&
      receipt.case5EvidenceSupportOnly === true &&
      validateFalse(receipt, [
        "f21EligibleForNorth",
        "f21ClaimedByDiagnosticRail",
        "readyTextAllowed",
        "readyTextClaimedByDiagnosticRail",
        "visualPassClaimed",
        "generatedImage",
        "graphicBox",
        "webGL"
      ])
    );

    if (!authorityOk) return { status: CHILD_VALIDATION.INVALID_AUTHORITY_BOUNDARY, receipt };

    return { status: CHILD_VALIDATION.VALID, receipt };
  }

  function validateWestChild(child) {
    if (!child) return { status: CHILD_VALIDATION.MISSING, receipt: null };

    if (!isFunction(child.runWestRenderedRead) || !isFunction(child.getWestReceipt) || !isFunction(child.getWestState)) {
      return { status: CHILD_VALIDATION.INVALID_API, receipt: null };
    }

    const receipt = getReceiptFromChild(child, "getWestReceipt");
    if (!receipt) return { status: CHILD_VALIDATION.UNREADABLE, receipt: null };

    if (receipt.contract !== WEST_CONTRACT) return { status: CHILD_VALIDATION.INVALID_CONTRACT, receipt };
    if (receipt.childRole !== "WEST_RENDERED_TARGET_AUTHORITY_PROBE") return { status: CHILD_VALIDATION.INVALID_ROLE, receipt };

    const authorityOk = (
      receipt.servesNorth === true &&
      receipt.finalPrimaryCaseAuthority === false &&
      receipt.finalRecommendationAuthority === false &&
      receipt.servedSourceAuthority === false &&
      receipt.case5Authority === false &&
      receipt.packetFormattingAuthority === false &&
      receipt.diagnosticUiAuthority === false &&
      receipt.productionMutationAuthorized === false &&
      receipt.hearthRepairAuthorized === false &&
      receipt.runtimeRestartAuthorized === false &&
      receipt.canvasReleaseAuthorized === false &&
      receipt.macroWestReleaseAuthorized === false &&
      receipt.syntheticActivationRepairAuthority === false &&
      validateFalse(receipt, [
        "f21EligibleForNorth",
        "f21ClaimedByDiagnosticRail",
        "readyTextAllowed",
        "readyTextClaimedByDiagnosticRail",
        "visualPassClaimed",
        "generatedImage",
        "graphicBox",
        "webGL"
      ])
    );

    if (!authorityOk) return { status: CHILD_VALIDATION.INVALID_AUTHORITY_BOUNDARY, receipt };

    return { status: CHILD_VALIDATION.VALID, receipt };
  }

  function validateSouthChild(child) {
    if (!child) return { status: CHILD_VALIDATION.MISSING, receipt: null };

    if (!isFunction(child.composeSouthReport) || !isFunction(child.composeCompactSummary) || !isFunction(child.getSouthReceipt) || !isFunction(child.getSouthState)) {
      return { status: CHILD_VALIDATION.INVALID_API, receipt: null };
    }

    const receipt = getReceiptFromChild(child, "getSouthReceipt");
    if (!receipt) return { status: CHILD_VALIDATION.UNREADABLE, receipt: null };

    if (receipt.contract !== SOUTH_CONTRACT) return { status: CHILD_VALIDATION.INVALID_CONTRACT, receipt };
    if (receipt.childRole !== "SOUTH_REPORT_PACKET_OUTPUT") return { status: CHILD_VALIDATION.INVALID_ROLE, receipt };

    const authorityOk = (
      receipt.servesNorth === true &&
      receipt.finalPrimaryCaseAuthority === false &&
      receipt.finalRecommendationAuthority === false &&
      receipt.servedSourceAuthority === false &&
      receipt.renderedTargetAuthority === false &&
      receipt.case5Authority === false &&
      receipt.packetFormattingAuthority === true &&
      receipt.diagnosticUiAuthority === false &&
      receipt.productionMutationAuthorized === false &&
      receipt.hearthRepairAuthorized === false &&
      receipt.runtimeRestartAuthorized === false &&
      receipt.canvasReleaseAuthorized === false &&
      receipt.macroWestReleaseAuthorized === false &&
      validateFalse(receipt, [
        "f21EligibleForNorth",
        "f21ClaimedByDiagnosticRail",
        "readyTextAllowed",
        "readyTextClaimedByDiagnosticRail",
        "visualPassClaimed",
        "generatedImage",
        "graphicBox",
        "webGL"
      ])
    );

    if (!authorityOk) return { status: CHILD_VALIDATION.INVALID_AUTHORITY_BOUNDARY, receipt };

    return { status: CHILD_VALIDATION.VALID, receipt };
  }

  function discoverChildren() {
    return {
      east: findChild([
        "HEARTH.diagnosticEast",
        "HEARTH.diagnosticRailEast",
        "HEARTH_DIAGNOSTIC_EAST",
        "HEARTH_DIAGNOSTIC_RAIL_EAST"
      ]),

      west: findChild([
        "HEARTH.diagnosticWest",
        "HEARTH.diagnosticRailWest",
        "HEARTH_DIAGNOSTIC_WEST",
        "HEARTH_DIAGNOSTIC_RAIL_WEST"
      ]),

      south: findChild([
        "HEARTH.diagnosticSouth",
        "HEARTH.diagnosticRailSouth",
        "HEARTH_DIAGNOSTIC_SOUTH",
        "HEARTH_DIAGNOSTIC_RAIL_SOUTH"
      ])
    };
  }

  function getEvidencePayload(result, key) {
    if (!result || !isObject(result)) return null;
    if (isObject(result[key])) return result[key];
    if (isObject(result.evidence)) return result.evidence;
    if (isObject(result.output)) return result.output;
    return null;
  }

  function validateEastEvidence(evidence) {
    if (!isObject(evidence)) return CHILD_VALIDATION.MISSING;

    const required = [
      "EAST_SOURCE_READ_STATUS",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "CASE_5_SUPPORT"
    ];

    return required.every((field) => Object.prototype.hasOwnProperty.call(evidence, field))
      ? CHILD_VALIDATION.VALID
      : CHILD_VALIDATION.UNREADABLE;
  }

  function validateWestEvidence(evidence) {
    if (!isObject(evidence)) return CHILD_VALIDATION.MISSING;

    const required = [
      "WEST_RENDERED_READ_STATUS",
      "DIAGNOSTIC_TARGET_ACCESS_STATUS",
      "CASE_1_SUPPORT",
      "CASE_2_SUPPORT",
      "CASE_3_SUPPORT",
      "CASE_4_SUPPORT",
      "CASE_6_SUPPORT",
      "CASE_7_SUPPORT"
    ];

    return required.every((field) => Object.prototype.hasOwnProperty.call(evidence, field))
      ? CHILD_VALIDATION.VALID
      : CHILD_VALIDATION.UNREADABLE;
  }

  function validateSouthOutput(output) {
    if (!isObject(output)) return CHILD_VALIDATION.MISSING;
    if (!output.FULL_PACKET_TEXT || !output.COMPACT_SUMMARY || !output.SOUTH_OUTPUT_STATUS) return CHILD_VALIDATION.UNREADABLE;
    return CHILD_VALIDATION.VALID;
  }

  function southPreservesNorthMeaning(output, state) {
    const report = isObject(output && output.REPORT_OBJECT) ? output.REPORT_OBJECT : null;

    if (!report) return false;

    return (
      getValue(report, "PRIMARY_CASE", FALLBACK.UNKNOWN) === state.primaryCase &&
      getValue(report, "RECOMMENDED_NEXT_OWNER", FALLBACK.UNKNOWN) === state.recommendedNextOwner &&
      getValue(report, "RECOMMENDED_NEXT_FILE", FALLBACK.UNKNOWN) === state.recommendedNextFile &&
      getValue(report, "RECOMMENDED_NEXT_ACTION", FALLBACK.UNKNOWN) === state.recommendedNextAction
    );
  }

  function fillUnknownEast(state) {
    state.eastSourceReadStatus = FALLBACK.UNKNOWN;
    state.expectedHtmlContract = FALLBACK.UNKNOWN;
    state.expectedIndexJsContract = FALLBACK.UNKNOWN;
    state.expectedRouteConductorContract = FALLBACK.UNKNOWN;
    state.servedHtmlContract = FALLBACK.UNKNOWN;
    state.servedIndexJsContract = FALLBACK.UNKNOWN;
    state.servedRouteConductorContract = FALLBACK.UNKNOWN;
    state.indexScriptSrc = FALLBACK.UNKNOWN;
    state.routeConductorScriptSrc = FALLBACK.UNKNOWN;
    state.cacheOrServedContractMismatch = FALLBACK.UNKNOWN;
    state.case5Support = FALLBACK.INSUFFICIENT_EVIDENCE;
  }

  function fillUnknownWest(state) {
    state.westRenderedReadStatus = FALLBACK.UNKNOWN;
    state.diagnosticTargetAccessStatus = FALLBACK.UNKNOWN;
    state.diagnosticTargetAccessError = FALLBACK.UNKNOWN;
    state.currentVisibleHearthStatus = FALLBACK.UNKNOWN;
    state.showReceiptSelectorMatched = FALLBACK.UNKNOWN;
    state.showReceiptButtonExists = FALLBACK.UNKNOWN;
    state.showReceiptHitTestTarget = FALLBACK.UNKNOWN;
    state.showReceiptHitTestTargetSelector = FALLBACK.UNKNOWN;
    state.showReceiptHitTestTargetTag = FALLBACK.UNKNOWN;
    state.showReceiptTargetIsButton = FALLBACK.UNKNOWN;
    state.targetPointerEvents = FALLBACK.UNKNOWN;
    state.receiptPanelExists = FALLBACK.UNKNOWN;
    state.receiptTextNodeExists = FALLBACK.UNKNOWN;
    state.receiptPanelStateBeforeAction = FALLBACK.UNKNOWN;
    state.receiptPanelStateAfterAction = FALLBACK.UNKNOWN;
    state.showReceiptActionResult = FALLBACK.UNKNOWN;
    state.ancestorBlockerFound = FALLBACK.UNKNOWN;
    state.ancestorBlockerDetail = FALLBACK.UNKNOWN;
    state.overlayAboveControl = FALLBACK.UNKNOWN;
    state.overlayOwner = FALLBACK.UNKNOWN;
    state.globalEventSuppressionFound = FALLBACK.UNKNOWN;
    state.likelySuppressionOwner = FALLBACK.UNKNOWN;
    state.indexSuppressesVisibleControls = FALLBACK.UNKNOWN;
    state.runtimeReleaseState = FALLBACK.UNKNOWN;
    state.runtimeReleaseIsLock = FALLBACK.UNKNOWN;
    state.case1Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case2Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case3Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case4Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case6Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case7Support = FALLBACK.INSUFFICIENT_EVIDENCE;
  }

  function aggregateEast(state, evidence) {
    state.childEastStatus = getValue(evidence, "EAST_STATUS", FALLBACK.UNKNOWN);
    state.eastSourceReadStatus = getValue(evidence, "EAST_SOURCE_READ_STATUS", FALLBACK.UNKNOWN);
    state.expectedHtmlContract = getValue(evidence, "EXPECTED_HTML_CONTRACT", FALLBACK.UNKNOWN);
    state.expectedIndexJsContract = getValue(evidence, "EXPECTED_INDEX_JS_CONTRACT", FALLBACK.UNKNOWN);
    state.expectedRouteConductorContract = getValue(evidence, "EXPECTED_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);
    state.servedHtmlContract = getValue(evidence, "SERVED_HTML_CONTRACT", FALLBACK.UNKNOWN);
    state.servedIndexJsContract = getValue(evidence, "SERVED_INDEX_JS_CONTRACT", FALLBACK.UNKNOWN);
    state.servedRouteConductorContract = getValue(evidence, "SERVED_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);
    state.indexScriptSrc = getValue(evidence, "INDEX_SCRIPT_SRC", FALLBACK.UNKNOWN);
    state.routeConductorScriptSrc = getValue(evidence, "ROUTE_CONDUCTOR_SCRIPT_SRC", FALLBACK.UNKNOWN);
    state.cacheOrServedContractMismatch = getValue(evidence, "CACHE_OR_SERVED_CONTRACT_MISMATCH", FALLBACK.UNKNOWN);
    state.case5Support = getValue(evidence, "CASE_5_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);

    const notes = getValue(evidence, "EAST_SECONDARY_EVIDENCE_NOTES", "");
    for (const note of normalizeNotes(notes)) addNote(state, note);
  }

  function aggregateWest(state, evidence) {
    state.childWestStatus = getValue(evidence, "WEST_STATUS", FALLBACK.UNKNOWN);
    state.westRenderedReadStatus = getValue(evidence, "WEST_RENDERED_READ_STATUS", FALLBACK.UNKNOWN);
    state.diagnosticTargetAccessStatus = getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_STATUS", FALLBACK.UNKNOWN);
    state.diagnosticTargetAccessError = getValue(evidence, "DIAGNOSTIC_TARGET_ACCESS_ERROR", FALLBACK.UNKNOWN);
    state.currentVisibleHearthStatus = getValue(evidence, "CURRENT_VISIBLE_HEARTH_STATUS", FALLBACK.UNKNOWN);
    state.showReceiptSelectorMatched = getValue(evidence, "SHOW_RECEIPT_SELECTOR_MATCHED", FALLBACK.UNKNOWN);
    state.showReceiptButtonExists = getValue(evidence, "SHOW_RECEIPT_BUTTON_EXISTS", FALLBACK.UNKNOWN);
    state.showReceiptHitTestTarget = getValue(evidence, "SHOW_RECEIPT_HIT_TEST_TARGET", FALLBACK.UNKNOWN);
    state.showReceiptHitTestTargetSelector = getValue(evidence, "SHOW_RECEIPT_HIT_TEST_TARGET_SELECTOR", FALLBACK.UNKNOWN);
    state.showReceiptHitTestTargetTag = getValue(evidence, "SHOW_RECEIPT_HIT_TEST_TARGET_TAG", FALLBACK.UNKNOWN);
    state.showReceiptTargetIsButton = getValue(evidence, "SHOW_RECEIPT_TARGET_IS_BUTTON", FALLBACK.UNKNOWN);
    state.targetPointerEvents = getValue(evidence, "TARGET_POINTER_EVENTS", FALLBACK.UNKNOWN);
    state.receiptPanelExists = getValue(evidence, "RECEIPT_PANEL_EXISTS", FALLBACK.UNKNOWN);
    state.receiptTextNodeExists = getValue(evidence, "RECEIPT_TEXT_NODE_EXISTS", FALLBACK.UNKNOWN);
    state.receiptPanelStateBeforeAction = getValue(evidence, "RECEIPT_PANEL_STATE_BEFORE_ACTION", FALLBACK.UNKNOWN);
    state.receiptPanelStateAfterAction = getValue(evidence, "RECEIPT_PANEL_STATE_AFTER_ACTION", FALLBACK.UNKNOWN);
    state.showReceiptActionResult = getValue(evidence, "SHOW_RECEIPT_ACTION_RESULT", FALLBACK.UNKNOWN);
    state.ancestorBlockerFound = getValue(evidence, "ANCESTOR_BLOCKER_FOUND", FALLBACK.UNKNOWN);
    state.ancestorBlockerDetail = getValue(evidence, "ANCESTOR_BLOCKER_DETAIL", FALLBACK.UNKNOWN);
    state.overlayAboveControl = getValue(evidence, "OVERLAY_ABOVE_CONTROL", FALLBACK.UNKNOWN);
    state.overlayOwner = getValue(evidence, "OVERLAY_OWNER", FALLBACK.UNKNOWN);
    state.globalEventSuppressionFound = getValue(evidence, "GLOBAL_EVENT_SUPPRESSION_FOUND", FALLBACK.UNKNOWN);
    state.likelySuppressionOwner = getValue(evidence, "LIKELY_SUPPRESSION_OWNER", FALLBACK.UNKNOWN);
    state.indexSuppressesVisibleControls = getValue(evidence, "INDEX_SUPPRESSES_VISIBLE_CONTROLS", FALLBACK.UNKNOWN);
    state.runtimeReleaseState = getValue(evidence, "RUNTIME_RELEASE_STATE", FALLBACK.UNKNOWN);
    state.runtimeReleaseIsLock = getValue(evidence, "RUNTIME_RELEASE_IS_LOCK", FALLBACK.UNKNOWN);
    state.case1Support = getValue(evidence, "CASE_1_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case2Support = getValue(evidence, "CASE_2_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case3Support = getValue(evidence, "CASE_3_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case4Support = getValue(evidence, "CASE_4_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case6Support = getValue(evidence, "CASE_6_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case7Support = getValue(evidence, "CASE_7_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);

    const notes = getValue(evidence, "WEST_SECONDARY_EVIDENCE_NOTES", "");
    for (const note of normalizeNotes(notes)) addNote(state, note);
  }

  function selectPrimaryCase(state) {
    if (state.case5Support === SUPPORT_TRUE || state.cacheOrServedContractMismatch === SUPPORT_TRUE) {
      state.primaryCase = CASES.CASE_5;
      return;
    }

    if (state.case7Support === SUPPORT_TRUE) {
      state.primaryCase = CASES.CASE_7;
      return;
    }

    if (state.case4Support === SUPPORT_TRUE) {
      state.primaryCase = CASES.CASE_4;
      return;
    }

    if (state.case1Support === SUPPORT_TRUE) {
      state.primaryCase = CASES.CASE_1;
      return;
    }

    if (state.case3Support === SUPPORT_TRUE) {
      state.primaryCase = CASES.CASE_3;
      return;
    }

    if (state.case6Support === SUPPORT_TRUE || state.runtimeReleaseIsLock === SUPPORT_TRUE) {
      state.primaryCase = CASES.CASE_6;
      return;
    }

    if (state.case2Support === SUPPORT_TRUE || state.showReceiptActionResult === "ACTION_DID_NOT_CHANGE_PANEL_OR_TEXT") {
      state.primaryCase = CASES.CASE_2;
      return;
    }

    state.primaryCase = CASES.INCONCLUSIVE;
  }

  function selectRecommendation(state) {
    switch (state.primaryCase) {
      case CASES.CASE_5:
        state.recommendedNextOwner = "deployment/cache";
        state.recommendedNextFile = "none";
        state.recommendedNextAction = "CORRECT_SERVED_CONTRACT_OR_CACHE_BEFORE_TNT";
        break;

      case CASES.CASE_7:
        state.recommendedNextOwner = "DIAGNOSTIC_ACCESS_BLOCKED";
        state.recommendedNextFile = "HOLD_FOR_TEACHER_REVIEW";
        state.recommendedNextAction = "RESOLVE_RENDERED_TARGET_ACCESS_OR_ROUTE_FRAME_POLICY_BEFORE_REPAIR_SELECTION";
        break;

      case CASES.CASE_4:
        state.recommendedNextOwner = "HTML_LAYER_OR_DOM_OWNER";
        state.recommendedNextFile = "REVIEW_RECOMMENDED_ONLY_NOT_AUTHORIZED";
        state.recommendedNextAction = "REVIEW_MISSING_SHOW_RECEIPT_OR_RECEIPT_NODE_STRUCTURE_ONLY_NOT_AUTHORIZED";
        break;

      case CASES.CASE_1:
        state.recommendedNextOwner = "LAYER_OR_OVERLAY_OWNER";
        state.recommendedNextFile = "REVIEW_RECOMMENDED_ONLY_NOT_AUTHORIZED";
        state.recommendedNextAction = "REVIEW_BLOCKING_LAYER_OR_HIT_TEST_OWNER_ONLY_NOT_AUTHORIZED";
        break;

      case CASES.CASE_3:
        state.recommendedNextOwner = "ROUTE_CONDUCTOR_OR_INDEX_SUPPRESSION_OWNER";
        state.recommendedNextFile = "REVIEW_RECOMMENDED_ONLY_NOT_AUTHORIZED";
        state.recommendedNextAction = "REVIEW_GLOBAL_SUPPRESSION_OWNER_ONLY_NOT_AUTHORIZED";
        break;

      case CASES.CASE_6:
        state.recommendedNextOwner = "RUNTIME_QUEUE_OWNER";
        state.recommendedNextFile = "REVIEW_RECOMMENDED_ONLY_NOT_AUTHORIZED";
        state.recommendedNextAction = "REVIEW_RUNTIME_RELEASE_LOCK_OWNER_ONLY_NOT_AUTHORIZED";
        break;

      case CASES.CASE_2:
        state.recommendedNextOwner = "INDEX_CONTROL_EXECUTION_OWNER";
        state.recommendedNextFile = "REVIEW_RECOMMENDED_ONLY_NOT_AUTHORIZED";
        state.recommendedNextAction = "REVIEW_SHOW_RECEIPT_HANDLER_EXECUTION_ONLY_NOT_AUTHORIZED";
        break;

      case CASES.INCONCLUSIVE:
      default:
        state.recommendedNextOwner = FALLBACK.INSUFFICIENT_EVIDENCE;
        state.recommendedNextFile = "HOLD_FOR_TEACHER_REVIEW";
        state.recommendedNextAction = "COLLECT_ADDITIONAL_RENDERED_TARGET_EVIDENCE";
        break;
    }
  }

  function allChildrenMissing(state) {
    return (
      state.eastReceiptValid !== CHILD_VALIDATION.VALID &&
      state.westReceiptValid !== CHILD_VALIDATION.VALID &&
      state.southReceiptValid !== CHILD_VALIDATION.VALID
    );
  }

  function applyAllChildrenMissingRecommendation(state) {
    state.primaryCase = CASES.INCONCLUSIVE;
    state.recommendedNextOwner = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.recommendedNextFile = "HOLD_FOR_TEACHER_REVIEW";
    state.recommendedNextAction = "LOAD_DIAGNOSTIC_CHILDREN_BEFORE_REPAIR_SELECTION";
  }

  function buildSouthHandoff(state, options) {
    const notes = normalizeNotes(
      state.secondaryEvidenceNotes,
      state.northSecondaryEvidenceNotes
    ).join(" | ") || FALLBACK.NONE;

    return {
      PACKET_NAME: REPORT_PACKET,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: state.diagnosticTimestamp,

      DIAGNOSTIC_TARGET_ACCESS_STATUS: state.diagnosticTargetAccessStatus,
      DIAGNOSTIC_TARGET_ACCESS_ERROR: state.diagnosticTargetAccessError,

      EXPECTED_HTML_CONTRACT: state.expectedHtmlContract,
      EXPECTED_INDEX_JS_CONTRACT: state.expectedIndexJsContract,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.expectedRouteConductorContract,

      SERVED_HTML_CONTRACT: state.servedHtmlContract,
      SERVED_INDEX_JS_CONTRACT: state.servedIndexJsContract,
      SERVED_ROUTE_CONDUCTOR_CONTRACT: state.servedRouteConductorContract,
      INDEX_SCRIPT_SRC: state.indexScriptSrc,
      ROUTE_CONDUCTOR_SCRIPT_SRC: state.routeConductorScriptSrc,
      CACHE_OR_SERVED_CONTRACT_MISMATCH: state.cacheOrServedContractMismatch,

      CURRENT_VISIBLE_HEARTH_STATUS: state.currentVisibleHearthStatus,

      SHOW_RECEIPT_SELECTOR_MATCHED: state.showReceiptSelectorMatched,
      SHOW_RECEIPT_BUTTON_EXISTS: state.showReceiptButtonExists,
      SHOW_RECEIPT_HIT_TEST_TARGET: state.showReceiptHitTestTarget,
      SHOW_RECEIPT_HIT_TEST_TARGET_SELECTOR: state.showReceiptHitTestTargetSelector,
      SHOW_RECEIPT_HIT_TEST_TARGET_TAG: state.showReceiptHitTestTargetTag,
      SHOW_RECEIPT_TARGET_IS_BUTTON: state.showReceiptTargetIsButton,
      TARGET_POINTER_EVENTS: state.targetPointerEvents,

      RECEIPT_PANEL_EXISTS: state.receiptPanelExists,
      RECEIPT_TEXT_NODE_EXISTS: state.receiptTextNodeExists,
      RECEIPT_PANEL_STATE_BEFORE_ACTION: state.receiptPanelStateBeforeAction,
      RECEIPT_PANEL_STATE_AFTER_ACTION: state.receiptPanelStateAfterAction,
      SHOW_RECEIPT_ACTION_RESULT: state.showReceiptActionResult,

      ANCESTOR_BLOCKER_FOUND: state.ancestorBlockerFound,
      ANCESTOR_BLOCKER_DETAIL: state.ancestorBlockerDetail,
      OVERLAY_ABOVE_CONTROL: state.overlayAboveControl,
      OVERLAY_OWNER: state.overlayOwner,

      GLOBAL_EVENT_SUPPRESSION_FOUND: state.globalEventSuppressionFound,
      LIKELY_SUPPRESSION_OWNER: state.likelySuppressionOwner,
      INDEX_SUPPRESSES_VISIBLE_CONTROLS: state.indexSuppressesVisibleControls,

      RUNTIME_RELEASE_STATE: state.runtimeReleaseState,
      RUNTIME_RELEASE_IS_LOCK: state.runtimeReleaseIsLock,

      PRIMARY_CASE: state.primaryCase,
      SECONDARY_EVIDENCE_NOTES: notes,
      NORTH_SECONDARY_EVIDENCE_NOTES: state.northSecondaryEvidenceNotes.join(" | ") || FALLBACK.NONE,

      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,
      WEST_RENDERED_READ_STATUS: state.westRenderedReadStatus,
      CASE_1_SUPPORT: state.case1Support,
      CASE_2_SUPPORT: state.case2Support,
      CASE_3_SUPPORT: state.case3Support,
      CASE_4_SUPPORT: state.case4Support,
      CASE_5_SUPPORT: state.case5Support,
      CASE_6_SUPPORT: state.case6Support,
      CASE_7_SUPPORT: state.case7Support,

      includeNoClaimFieldsInPacket: Boolean(options && options.includeNoClaimFieldsInPacket)
    };
  }

  function composeFallbackPacket(report, options) {
    const lines = [];

    for (const field of REQUIRED_REPORT_FIELDS) {
      lines.push(line(field, getValue(report, field, FALLBACK.UNKNOWN)));
    }

    if (options && options.includeOptionalTraceFields === true) {
      for (const field of [
        "EAST_SOURCE_READ_STATUS",
        "WEST_RENDERED_READ_STATUS",
        "CASE_1_SUPPORT",
        "CASE_2_SUPPORT",
        "CASE_3_SUPPORT",
        "CASE_4_SUPPORT",
        "CASE_5_SUPPORT",
        "CASE_6_SUPPORT",
        "CASE_7_SUPPORT"
      ]) {
        lines.push(line(field, getValue(report, field, FALLBACK.UNKNOWN)));
      }
    }

    if (options && options.includeNoClaimFieldsInPacket === true) {
      lines.push(line("f21EligibleForNorth", "false"));
      lines.push(line("f21ClaimedByDiagnosticRail", "false"));
      lines.push(line("readyTextAllowed", "false"));
      lines.push(line("readyTextClaimedByDiagnosticRail", "false"));
      lines.push(line("visualPassClaimed", "false"));
      lines.push(line("generatedImage", "false"));
      lines.push(line("graphicBox", "false"));
      lines.push(line("webGL", "false"));
    }

    return lines.join("\n");
  }

  function composeFallbackSummary(report) {
    return [
      line("TARGET_ROUTE", getValue(report, "TARGET_ROUTE", TARGET_ROUTE)),
      line("DIAGNOSTIC_TARGET_ACCESS_STATUS", getValue(report, "DIAGNOSTIC_TARGET_ACCESS_STATUS", FALLBACK.UNKNOWN)),
      line("CACHE_OR_SERVED_CONTRACT_MISMATCH", getValue(report, "CACHE_OR_SERVED_CONTRACT_MISMATCH", FALLBACK.UNKNOWN)),
      line("SHOW_RECEIPT_BUTTON_EXISTS", getValue(report, "SHOW_RECEIPT_BUTTON_EXISTS", FALLBACK.UNKNOWN)),
      line("SHOW_RECEIPT_TARGET_IS_BUTTON", getValue(report, "SHOW_RECEIPT_TARGET_IS_BUTTON", FALLBACK.UNKNOWN)),
      line("RUNTIME_RELEASE_IS_LOCK", getValue(report, "RUNTIME_RELEASE_IS_LOCK", FALLBACK.UNKNOWN)),
      line("PRIMARY_CASE", getValue(report, "PRIMARY_CASE", FALLBACK.UNKNOWN)),
      line("RECOMMENDED_NEXT_OWNER", getValue(report, "RECOMMENDED_NEXT_OWNER", FALLBACK.UNKNOWN)),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", FALLBACK.UNKNOWN)),
      line("RECOMMENDED_NEXT_ACTION", getValue(report, "RECOMMENDED_NEXT_ACTION", FALLBACK.UNKNOWN))
    ].join("\n");
  }

  function diagnosticComplete(state) {
    return (
      state.eastReceiptValid === CHILD_VALIDATION.VALID &&
      state.westReceiptValid === CHILD_VALIDATION.VALID &&
      state.southReceiptValid === CHILD_VALIDATION.VALID &&
      state.eastEvidenceValid === CHILD_VALIDATION.VALID &&
      state.westEvidenceValid === CHILD_VALIDATION.VALID &&
      state.southOutputValid === CHILD_VALIDATION.VALID
    );
  }

  async function runDiagnostic(options = {}) {
    const state = makeState();
    state.northStatus = STATUS.RUNNING;
    state.diagnosticRunStatus = STATUS.RUNNING;
    state.diagnosticTimestamp = nowIso();
    state.updatedAt = nowIso();

    try {
      const children = discoverChildren();

      const eastValidation = validateEastChild(children.east);
      const westValidation = validateWestChild(children.west);
      const southValidation = validateSouthChild(children.south);

      state.eastReceiptValid = eastValidation.status;
      state.westReceiptValid = westValidation.status;
      state.southReceiptValid = southValidation.status;

      if (eastValidation.status !== CHILD_VALIDATION.VALID) {
        addNote(state, `EAST_CHILD_MISSING_OR_INVALID:${eastValidation.status}`);
        fillUnknownEast(state);
      }

      if (westValidation.status !== CHILD_VALIDATION.VALID) {
        addNote(state, `WEST_CHILD_MISSING_OR_INVALID:${westValidation.status}`);
        fillUnknownWest(state);
      }

      if (eastValidation.status === CHILD_VALIDATION.VALID) {
        try {
          const eastResult = await children.east.runEastSourceRead();
          const eastEvidence = getEvidencePayload(eastResult, "evidence");
          state.eastEvidenceValid = validateEastEvidence(eastEvidence);

          if (state.eastEvidenceValid === CHILD_VALIDATION.VALID) {
            aggregateEast(state, eastEvidence);
          } else {
            addNote(state, `EAST_EVIDENCE_INVALID:${state.eastEvidenceValid}`);
            fillUnknownEast(state);
          }
        } catch (error) {
          state.eastEvidenceValid = CHILD_VALIDATION.UNREADABLE;
          addNote(state, `EAST_CHILD_RUN_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
          fillUnknownEast(state);
        }
      }

      const sourceMismatchControlling = state.case5Support === SUPPORT_TRUE || state.cacheOrServedContractMismatch === SUPPORT_TRUE;

      if (westValidation.status === CHILD_VALIDATION.VALID) {
        try {
          const westOptions = {
            sourceMismatchControlling,
            allowSyntheticActivation: Boolean(options.allowSyntheticActivation),
            northPermitsSyntheticActivation: Boolean(options.northPermitsSyntheticActivation),
            syntheticActivationPermittedByNorth: Boolean(options.syntheticActivationPermittedByNorth)
          };

          if (options.targetDocument) westOptions.targetDocument = options.targetDocument;
          if (options.targetWindow) westOptions.targetWindow = options.targetWindow;
          if (options.frameElement) westOptions.frameElement = options.frameElement;

          const westResult = await children.west.runWestRenderedRead(westOptions);
          const westEvidence = getEvidencePayload(westResult, "evidence");
          state.westEvidenceValid = validateWestEvidence(westEvidence);

          if (state.westEvidenceValid === CHILD_VALIDATION.VALID) {
            aggregateWest(state, westEvidence);
          } else {
            addNote(state, `WEST_EVIDENCE_INVALID:${state.westEvidenceValid}`);
            fillUnknownWest(state);
          }
        } catch (error) {
          state.westEvidenceValid = CHILD_VALIDATION.UNREADABLE;
          addNote(state, `WEST_CHILD_RUN_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
          fillUnknownWest(state);
        }
      }

      selectPrimaryCase(state);
      selectRecommendation(state);

      if (allChildrenMissing(state)) {
        addNote(state, "ALL_DIAGNOSTIC_CHILDREN_MISSING_OR_INVALID");
        applyAllChildrenMissingRecommendation(state);
      }

      state.secondaryEvidenceNotes = normalizeNotes(state.northSecondaryEvidenceNotes).join(" | ") || FALLBACK.NONE;

      let southHandoff = buildSouthHandoff(state, options);

      if (southValidation.status === CHILD_VALIDATION.VALID) {
        try {
          const southResult = children.south.composeSouthReport(southHandoff, {
            includeOptionalTraceFields: Boolean(options.includeOptionalTraceFields),
            includeNoClaimFieldsInPacket: Boolean(options.includeNoClaimFieldsInPacket),
            mergeSouthOutputNotesIntoEvidenceNotes: Boolean(options.mergeSouthOutputNotesIntoEvidenceNotes)
          });

          const southOutput = getEvidencePayload(southResult, "output");
          const southOutputShapeStatus = validateSouthOutput(southOutput);
          const southMeaningPreserved = southOutputShapeStatus === CHILD_VALIDATION.VALID && southPreservesNorthMeaning(southOutput, state);

          if (southOutputShapeStatus === CHILD_VALIDATION.VALID && southMeaningPreserved) {
            state.southOutputValid = CHILD_VALIDATION.VALID;
            state.childSouthStatus = getValue(southOutput, "SOUTH_STATUS", FALLBACK.UNKNOWN);
            state.southOutputStatus = getValue(southOutput, "SOUTH_OUTPUT_STATUS", FALLBACK.UNKNOWN);
            state.reportObject = isObject(southOutput.REPORT_OBJECT) ? clonePlain(southOutput.REPORT_OBJECT) : clonePlain(southHandoff);
            state.fullPacketText = getValue(southOutput, "FULL_PACKET_TEXT", "");
            state.compactSummary = getValue(southOutput, "COMPACT_SUMMARY", "");
          } else {
            state.southOutputValid = southOutputShapeStatus === CHILD_VALIDATION.VALID
              ? CHILD_VALIDATION.INVALID_AUTHORITY_BOUNDARY
              : southOutputShapeStatus;

            if (!southMeaningPreserved && southOutputShapeStatus === CHILD_VALIDATION.VALID) {
              addNote(state, "SOUTH_OUTPUT_REJECTED_MEANING_OVERRIDE_ATTEMPT");
            } else {
              addNote(state, `SOUTH_OUTPUT_INVALID:${state.southOutputValid}`);
            }
          }
        } catch (error) {
          state.southOutputValid = CHILD_VALIDATION.UNREADABLE;
          addNote(state, `SOUTH_CHILD_RUN_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
        }
      } else {
        addNote(state, `SOUTH_CHILD_MISSING_OR_INVALID:${southValidation.status}`);
      }

      if (state.southOutputValid !== CHILD_VALIDATION.VALID) {
        state.southOutputStatus = STATUS.FALLBACK;
        addNote(state, "NORTH_EMERGENCY_FALLBACK_PACKET_COMPOSED");
        southHandoff = buildSouthHandoff(state, options);
        state.reportObject = clonePlain(southHandoff);
        state.fullPacketText = composeFallbackPacket(southHandoff, options);
        state.compactSummary = composeFallbackSummary(southHandoff);
      }

      state.diagnosticRunStatus = diagnosticComplete(state) ? STATUS.COMPLETE : STATUS.PARTIAL;
      state.northStatus = state.diagnosticRunStatus;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.northStatus = STATUS.FAILED;
      state.diagnosticRunStatus = STATUS.FAILED;
      state.primaryCase = CASES.INCONCLUSIVE;
      state.recommendedNextOwner = FALLBACK.INSUFFICIENT_EVIDENCE;
      state.recommendedNextFile = "HOLD_FOR_TEACHER_REVIEW";
      state.recommendedNextAction = "COLLECT_ADDITIONAL_RENDERED_TARGET_EVIDENCE";
      addNote(state, `NORTH_TOP_LEVEL_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
      addNote(state, "NORTH_EMERGENCY_FALLBACK_PACKET_COMPOSED");

      const fallback = buildSouthHandoff(state, options);
      state.reportObject = clonePlain(fallback);
      state.fullPacketText = composeFallbackPacket(fallback, options);
      state.compactSummary = composeFallbackSummary(fallback);
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: bounded(error && error.message ? error.message : error, 1000),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState)
      };
    }
  }

  function getReport() {
    return clonePlain(lastReport || buildSouthHandoff(makeState(), {}));
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    const state = makeState();
    const report = buildSouthHandoff(state, {});
    return composeFallbackPacket(report, {});
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    const state = makeState();
    const report = buildSouthHandoff(state, {});
    return composeFallbackSummary(report);
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getReceipt() {
    const state = lastState || makeState();

    return {
      parentRole: "NORTH_PARENT_ORCHESTRATOR",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      childLoadingMode: CHILD_LOADING_MODE,
      routeReceiverMustLoadChildrenBeforeRun: ROUTE_RECEIVER_MUST_LOAD_CHILDREN_BEFORE_RUN,
      northDynamicChildLoadingOwned: NORTH_DYNAMIC_CHILD_LOADING_OWNED,

      servesRouteReceiver: true,

      eastChildConsumed: state.eastReceiptValid === CHILD_VALIDATION.VALID,
      westChildConsumed: state.westReceiptValid === CHILD_VALIDATION.VALID,
      southChildConsumed: state.southReceiptValid === CHILD_VALIDATION.VALID,

      eastReceiptValid: state.eastReceiptValid,
      westReceiptValid: state.westReceiptValid,
      southReceiptValid: state.southReceiptValid,
      eastEvidenceValid: state.eastEvidenceValid,
      westEvidenceValid: state.westEvidenceValid,
      southOutputValid: state.southOutputValid,

      finalPrimaryCaseAuthority: true,
      finalRecommendationAuthority: true,
      servedSourceParsingAuthority: false,
      renderedTargetProbeAuthority: false,
      packetFormattingAuthority: false,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false,

      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getStateApiAvailable: true,

      routeReceiverShouldCallNorthOnly: true,

      f21EligibleForNorth: false,
      f21ClaimedByDiagnosticRail: false,
      readyTextAllowed: false,
      readyTextClaimedByDiagnosticRail: false,
      visualPassClaimed: false,
      generatedImage: false,
      graphicBox: false,
      webGL: false,

      lastNorthStatus: state.northStatus,
      lastDiagnosticRunStatus: state.diagnosticRunStatus,
      lastPrimaryCase: state.primaryCase,
      lastRecommendedNextOwner: state.recommendedNextOwner,
      lastRecommendedNextFile: state.recommendedNextFile,
      lastRecommendedNextAction: state.recommendedNextAction,
      updatedAt: nowIso()
    };
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastReport = clonePlain(state.reportObject && Object.keys(state.reportObject).length ? state.reportObject : buildSouthHandoff(state, {}));
    lastPacketText = state.fullPacketText || composeFallbackPacket(lastReport, {});
    lastCompactSummary = state.compactSummary || composeFallbackSummary(lastReport);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticRail = api;
    root.HEARTH.parallelDiagnosticRail = api;

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthDiagnosticRail = api;

    root.HEARTH_DIAGNOSTIC_RAIL = api;
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL = api;

    root.HEARTH_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    childLoadingMode: CHILD_LOADING_MODE,
    routeReceiverMustLoadChildrenBeforeRun: ROUTE_RECEIVER_MUST_LOAD_CHILDREN_BEFORE_RUN,
    northDynamicChildLoadingOwned: NORTH_DYNAMIC_CHILD_LOADING_OWNED,

    runDiagnostic,
    getReport,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getState,

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
