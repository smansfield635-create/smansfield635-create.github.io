// /assets/hearth/hearth.diagnostic.rail.js
// HEARTH_DIAGNOSTIC_RAIL_NORTH_ANCHOR_SCHEMA_ORCHESTRATOR_TNT_v3
// Full-file replacement.
// Diagnostic rail NORTH parent only.
// Purpose:
// - Establish NORTH as the diagnostic anchor and canonical verdict schema.
// - Consume already-loaded EAST, WEST, and SOUTH diagnostic child APIs.
// - Validate child receipts and authority boundaries.
// - Normalize child evidence into one NORTH-owned diagnostic schema.
// - Accept EAST current-spread intelligence, including Route Conductor v9.5 as lawful current spread.
// - Preserve WEST rendered-target observability fields without collapsing them into generic inconclusive evidence.
// - Select exactly one PRIMARY_CASE by evidence.
// - Add a non-case calibration layer for current-spread proof gaps.
// - Run NEWS Alignment Protocol.
// - Run Fibonacci Synchronization audit.
// - Select final non-authorizing recommendation fields.
// - Hand normalized NORTH verdict to SOUTH for report output when SOUTH is valid.
// - Verify SOUTH preserves NORTH-selected final meaning.
// - Publish route-facing public API for the diagnostic route receiver.
// - Preserve protected production files as read-only observation targets.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - dynamic child loading
// - detailed served-source parsing
// - detailed rendered-target probing
// - diagnostic UI
// - Hearth repair
// - production mutation
// - runtime restart
// - Canvas release
// - Macro West release

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_ANCHOR_SCHEMA_ORCHESTRATOR_TNT_v3";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_ANCHOR_SCHEMA_ORCHESTRATOR_RECEIPT_v3";
  const PREVIOUS_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_CURRENT_SPREAD_CALIBRATION_ORCHESTRATOR_TNT_v2_1";
  const PREVIOUS_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_CURRENT_SPREAD_CALIBRATION_ORCHESTRATOR_RECEIPT_v2_1";
  const BASELINE_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_PARENT_ORCHESTRATOR_TNT_v1";
  const BASELINE_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_PARENT_ORCHESTRATOR_RECEIPT_v1";
  const VERSION = "2026-06-03.hearth-diagnostic-rail-north-anchor-schema-orchestrator-v3";

  const FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const CHILD_LOADING_MODE = "CONSUME_ALREADY_LOADED_CHILD_GLOBALS";
  const ROUTE_RECEIVER_MUST_LOAD_CHILDREN_BEFORE_RUN = true;
  const NORTH_DYNAMIC_CHILD_LOADING_OWNED = false;

  const EAST_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_EAST_SERVED_SOURCE_EVIDENCE_TNT_v1";
  const EAST_CURRENT_ALIGNMENT_CONTRACT = "HEARTH_DIAGNOSTIC_EAST_HEARTH_INDEX_CONTEXT_CURRENT_SPREAD_ALIGNMENT_TNT_v3";

  const WEST_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_WEST_RENDERED_TARGET_AUTHORITY_PROBE_TNT_v1";
  const WEST_CURRENT_IMPLEMENTATION_CONTRACT = "HEARTH_DIAGNOSTIC_WEST_HIT_TEST_OBSERVABILITY_REFINEMENT_TNT_v1";

  const SOUTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

  const CURRENT_HTML_CONTRACT = "HEARTH_HTML_PLANET_ENGINE_TEMPLATE_DEVELOPMENT_RECEIPT_TARGET_RESTORATION_TNT_v2_6";
  const CURRENT_INDEX_JS_CONTRACT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const CURRENT_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const PRIOR_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

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

  const CALIBRATION = Object.freeze({
    CLEAN: "CALIBRATION_CLEAN",
    HOLD_RENDERED_PLANET_PROOF_SPREAD_INCOMPLETE: "CALIBRATION_HOLD_RENDERED_PLANET_PROOF_SPREAD_INCOMPLETE",
    HOLD_CHILD_ALIGNMENT_INCOMPLETE: "CALIBRATION_HOLD_CHILD_ALIGNMENT_INCOMPLETE",
    HOLD_SOUTH_OUTPUT_INCOMPLETE: "CALIBRATION_HOLD_SOUTH_OUTPUT_INCOMPLETE",
    HOLD_NORTH_MEANING_NOT_PRESERVED_BY_SOUTH: "CALIBRATION_HOLD_NORTH_MEANING_NOT_PRESERVED_BY_SOUTH",
    NOT_APPLICABLE_CASE_CONTROLS: "CALIBRATION_NOT_APPLICABLE_PRIMARY_CASE_CONTROLS",
    INSUFFICIENT_EVIDENCE: "CALIBRATION_INSUFFICIENT_EVIDENCE"
  });

  const SUPPORT_TRUE = "true";
  const SUPPORT_FALSE = "false";
  const SUPPORT_HELD = "HELD";

  const NEWS_STAGES = Object.freeze([
    "NORTH_START",
    "EAST_SOURCE",
    "WEST_RENDERED",
    "NORTH_ADJUDICATION",
    "SOUTH_OUTPUT",
    "NORTH_VERIFY"
  ]);

  const FIBONACCI_STAGES = Object.freeze([
    { key: "F1", label: "target context" },
    { key: "F2", label: "child validation" },
    { key: "F3", label: "EAST source evidence" },
    { key: "F5", label: "WEST rendered evidence" },
    { key: "F8", label: "NORTH adjudication" },
    { key: "F13", label: "SOUTH packet output" },
    { key: "F21", label: "no-claim receiver boundary" }
  ]);

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
    "CALIBRATION_STATUS",
    "CALIBRATION_HOLD_REASON",
    "DIAGNOSTIC_RAIL_CLEAN",
    "CALIBRATION_POINT_REACHED",
    "SECONDARY_EVIDENCE_NOTES",
    "RECOMMENDED_NEXT_OWNER",
    "RECOMMENDED_NEXT_FILE",
    "RECOMMENDED_NEXT_ACTION"
  ]);

  const OPTIONAL_TRACE_FIELDS = Object.freeze([
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

  const NO_CLAIM_FIELDS = Object.freeze({
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

  const root = typeof window !== "undefined" ? window : globalThis;

  let lastState = null;
  let lastVerdict = null;
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
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
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

  function asBoolString(value, fallback = FALLBACK.UNKNOWN) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    if (value === FALLBACK.HELD || value === SUPPORT_HELD) return SUPPORT_HELD;
    return fallback;
  }

  function isSupportTrue(value) {
    return value === SUPPORT_TRUE || value === true || value === "TRUE" || value === 1 || value === "1";
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function addNote(state, note) {
    const clean = bounded(note, 1200);
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
        const clean = bounded(raw, 1200);
        if (!clean || clean === FALLBACK.NONE) continue;

        if (!seen.has(clean)) {
          seen.add(clean);
          notes.push(clean);
        }
      }
    }

    return notes;
  }

  function noteContains(state, phrase) {
    return state.northSecondaryEvidenceNotes.join(" | ").includes(phrase);
  }

  function findChild(candidates) {
    for (const path of candidates) {
      const found = readPath(root, path);
      if (found && isObject(found)) return found;
    }

    return null;
  }

  function getReceiptFromChild(child, method) {
    try {
      if (!child || !isObject(child)) return null;
      if (method && isFunction(child[method])) return child[method]();
      if (isFunction(child.getReceipt)) return child.getReceipt();
      if (isObject(child.receiptObject)) return child.receiptObject;
      if (isObject(child.receipt)) return child.receipt;
      return null;
    } catch (_error) {
      return null;
    }
  }

  function validateNoTrueClaims(receipt, keys) {
    if (!isObject(receipt)) return false;

    for (const key of keys) {
      if (receipt[key] === true) return false;
    }

    return true;
  }

  function makeState() {
    return {
      northStatus: STATUS.READY,
      northContract: CONTRACT,
      northReceipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
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
      southMeaningPreserved: FALLBACK.UNKNOWN,

      eastAlignmentContract: FALLBACK.UNKNOWN,
      westImplementationContract: FALLBACK.UNKNOWN,

      eastSourceReadStatus: FALLBACK.UNKNOWN,
      westRenderedReadStatus: FALLBACK.UNKNOWN,
      southOutputStatus: FALLBACK.UNKNOWN,

      diagnosticTargetAccessStatus: FALLBACK.UNKNOWN,
      diagnosticTargetAccessError: FALLBACK.UNKNOWN,

      expectedHtmlContract: FALLBACK.UNKNOWN,
      expectedIndexJsContract: FALLBACK.UNKNOWN,
      expectedRouteConductorContract: FALLBACK.UNKNOWN,

      currentExpectedHtmlContract: CURRENT_HTML_CONTRACT,
      currentExpectedIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
      currentExpectedRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,

      servedHtmlContract: FALLBACK.UNKNOWN,
      servedIndexJsContract: FALLBACK.UNKNOWN,
      servedRouteConductorContract: FALLBACK.UNKNOWN,
      indexScriptSrc: FALLBACK.UNKNOWN,
      routeConductorScriptSrc: FALLBACK.UNKNOWN,
      cacheOrServedContractMismatch: FALLBACK.UNKNOWN,

      primaryRouteConductorContractRecognized: FALLBACK.UNKNOWN,
      routeConductorV95PrimaryNotTreatedAsCase5: FALLBACK.UNKNOWN,
      routeConductorV94LineageAccepted: FALLBACK.UNKNOWN,
      eastCurrentSpreadAlignmentRecognized: FALLBACK.UNKNOWN,

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

      showReceiptRect: FALLBACK.UNKNOWN,
      showReceiptCenterPoint: FALLBACK.UNKNOWN,
      targetViewportWidth: FALLBACK.UNKNOWN,
      targetViewportHeight: FALLBACK.UNKNOWN,
      centerPointInViewport: FALLBACK.UNKNOWN,
      elementFromPointAvailable: FALLBACK.UNKNOWN,
      elementFromPointResult: FALLBACK.UNKNOWN,
      buttonPointerEvents: FALLBACK.UNKNOWN,
      hitTestUnreadableReason: FALLBACK.UNKNOWN,
      frameRect: FALLBACK.UNKNOWN,
      frameVisibleToDiagnosticRoute: FALLBACK.UNKNOWN,

      canvasElementFound: FALLBACK.UNKNOWN,
      routeConductorContractReadableInRenderedTarget: FALLBACK.UNKNOWN,
      renderedPlanetProofFullyInspected: FALLBACK.UNKNOWN,
      westRenderedProofSpreadComplete: FALLBACK.UNKNOWN,
      floatingAnchorHitTestNonControlling: FALLBACK.UNKNOWN,

      case1Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case2Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case3Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case4Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case5Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case6Support: FALLBACK.INSUFFICIENT_EVIDENCE,
      case7Support: FALLBACK.INSUFFICIENT_EVIDENCE,

      primaryCase: CASES.INCONCLUSIVE,

      calibrationStatus: CALIBRATION.INSUFFICIENT_EVIDENCE,
      calibrationHoldReason: FALLBACK.UNKNOWN,
      diagnosticRailClean: "false",
      calibrationPointReached: "false",

      secondaryEvidenceNotes: FALLBACK.NONE,
      northSecondaryEvidenceNotes: [],

      recommendedNextOwner: FALLBACK.INSUFFICIENT_EVIDENCE,
      recommendedNextFile: "HOLD_FOR_TEACHER_REVIEW",
      recommendedNextAction: "COLLECT_ADDITIONAL_RENDERED_TARGET_EVIDENCE",

      newsAlignmentProtocol: NEWS_STAGES.join(" -> "),
      newsAlignmentStatus: FALLBACK.UNKNOWN,
      newsAlignmentScore: 0,
      newsAlignmentFirstFailedStage: FALLBACK.UNKNOWN,

      fibonacciSynchronizationProtocol: FIBONACCI_STAGES.map((stage) => `${stage.key} ${stage.label}`).join(" -> "),
      fibonacciSynchronizationStatus: FALLBACK.UNKNOWN,
      fibonacciSynchronizationScore: 0,
      fibonacciSynchronizationFirstFailedStage: FALLBACK.UNKNOWN,

      northVerdict: {},
      reportObject: {},
      fullPacketText: "",
      compactSummary: "",

      ...NO_CLAIM_FIELDS,

      updatedAt: nowIso()
    };
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
      validateNoTrueClaims(receipt, [
        "f13Claimed",
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
      validateNoTrueClaims(receipt, [
        "f13Claimed",
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
      validateNoTrueClaims(receipt, [
        "f13Claimed",
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
    state.primaryRouteConductorContractRecognized = FALLBACK.UNKNOWN;
    state.routeConductorV95PrimaryNotTreatedAsCase5 = FALLBACK.UNKNOWN;
    state.routeConductorV94LineageAccepted = FALLBACK.UNKNOWN;
    state.eastCurrentSpreadAlignmentRecognized = FALLBACK.UNKNOWN;
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
    state.showReceiptRect = FALLBACK.UNKNOWN;
    state.showReceiptCenterPoint = FALLBACK.UNKNOWN;
    state.targetViewportWidth = FALLBACK.UNKNOWN;
    state.targetViewportHeight = FALLBACK.UNKNOWN;
    state.centerPointInViewport = FALLBACK.UNKNOWN;
    state.elementFromPointAvailable = FALLBACK.UNKNOWN;
    state.elementFromPointResult = FALLBACK.UNKNOWN;
    state.buttonPointerEvents = FALLBACK.UNKNOWN;
    state.hitTestUnreadableReason = FALLBACK.UNKNOWN;
    state.frameRect = FALLBACK.UNKNOWN;
    state.frameVisibleToDiagnosticRoute = FALLBACK.UNKNOWN;
    state.canvasElementFound = FALLBACK.UNKNOWN;
    state.routeConductorContractReadableInRenderedTarget = FALLBACK.UNKNOWN;
    state.renderedPlanetProofFullyInspected = FALLBACK.UNKNOWN;
    state.westRenderedProofSpreadComplete = FALLBACK.UNKNOWN;
    state.floatingAnchorHitTestNonControlling = FALLBACK.UNKNOWN;
    state.case1Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case2Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case3Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case4Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case6Support = FALLBACK.INSUFFICIENT_EVIDENCE;
    state.case7Support = FALLBACK.INSUFFICIENT_EVIDENCE;
  }

  function aggregateEast(state, evidence) {
    state.childEastStatus = getValue(evidence, "EAST_STATUS", FALLBACK.UNKNOWN);
    state.eastAlignmentContract = getValue(evidence, "EAST_ALIGNMENT_CONTRACT", getValue(evidence, "ALIGNMENT_CONTRACT", FALLBACK.UNKNOWN));
    state.eastSourceReadStatus = getValue(evidence, "EAST_SOURCE_READ_STATUS", FALLBACK.UNKNOWN);

    state.expectedHtmlContract = getValue(evidence, "EXPECTED_HTML_CONTRACT", FALLBACK.UNKNOWN);
    state.expectedIndexJsContract = getValue(evidence, "EXPECTED_INDEX_JS_CONTRACT", FALLBACK.UNKNOWN);
    state.expectedRouteConductorContract = getValue(evidence, "EXPECTED_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);

    state.currentExpectedHtmlContract = getValue(evidence, "CURRENT_EXPECTED_HTML_CONTRACT", CURRENT_HTML_CONTRACT);
    state.currentExpectedIndexJsContract = getValue(evidence, "CURRENT_EXPECTED_INDEX_JS_CONTRACT", CURRENT_INDEX_JS_CONTRACT);
    state.currentExpectedRouteConductorContract = CURRENT_ROUTE_CONDUCTOR_CONTRACT;

    state.servedHtmlContract = getValue(evidence, "SERVED_HTML_CONTRACT", FALLBACK.UNKNOWN);
    state.servedIndexJsContract = getValue(evidence, "SERVED_INDEX_JS_CONTRACT", FALLBACK.UNKNOWN);
    state.servedRouteConductorContract = getValue(evidence, "SERVED_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);
    state.indexScriptSrc = getValue(evidence, "INDEX_SCRIPT_SRC", FALLBACK.UNKNOWN);
    state.routeConductorScriptSrc = getValue(evidence, "ROUTE_CONDUCTOR_SCRIPT_SRC", FALLBACK.UNKNOWN);
    state.cacheOrServedContractMismatch = getValue(evidence, "CACHE_OR_SERVED_CONTRACT_MISMATCH", FALLBACK.UNKNOWN);
    state.case5Support = getValue(evidence, "CASE_5_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);

    for (const note of normalizeNotes(getValue(evidence, "EAST_SECONDARY_EVIDENCE_NOTES", ""))) {
      addNote(state, note);
    }

    const v95Served = state.servedRouteConductorContract === CURRENT_ROUTE_CONDUCTOR_CONTRACT;
    const v94Served = state.servedRouteConductorContract === PRIOR_ROUTE_CONDUCTOR_CONTRACT;

    const eastV3 =
      state.eastAlignmentContract === EAST_CURRENT_ALIGNMENT_CONTRACT ||
      noteContains(state, "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5") ||
      noteContains(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED");

    state.primaryRouteConductorContractRecognized = asBoolString(
      v95Served ||
      noteContains(state, "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED") ||
      noteContains(state, "CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED")
    );

    state.routeConductorV95PrimaryNotTreatedAsCase5 = asBoolString(
      v95Served ||
      noteContains(state, "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5")
    );

    state.routeConductorV94LineageAccepted = asBoolString(
      v94Served ||
      noteContains(state, "ACCEPTED_ROUTE_CONDUCTOR_CONTRACT_LINEAGE_RECOGNIZED") ||
      noteContains(state, "ROUTE_CONDUCTOR_SOURCE_FETCH_FALLBACK_DIRECT_FILE_MATCHED_NO_FALSE_CASE_5")
    );

    state.eastCurrentSpreadAlignmentRecognized = asBoolString(
      eastV3 ||
      state.primaryRouteConductorContractRecognized === "true" ||
      state.routeConductorV95PrimaryNotTreatedAsCase5 === "true"
    );

    if (state.routeConductorV95PrimaryNotTreatedAsCase5 === "true") {
      addNote(state, "NORTH_ACCEPTED_EAST_V3_ROUTE_CONDUCTOR_V9_5_AS_CURRENT_SPREAD");
    }

    if (state.routeConductorV94LineageAccepted === "true" && state.routeConductorV95PrimaryNotTreatedAsCase5 !== "true") {
      addNote(state, "NORTH_ACCEPTED_ROUTE_CONDUCTOR_V9_4_AS_LINEAGE_OR_TRANSITION_STATE");
    }
  }

  function aggregateWest(state, evidence) {
    state.childWestStatus = getValue(evidence, "WEST_STATUS", FALLBACK.UNKNOWN);
    state.westImplementationContract = getValue(evidence, "WEST_IMPLEMENTATION_CONTRACT", getValue(evidence, "IMPLEMENTATION_CONTRACT", FALLBACK.UNKNOWN));
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

    state.showReceiptRect = getValue(evidence, "SHOW_RECEIPT_RECT", FALLBACK.UNKNOWN);
    state.showReceiptCenterPoint = getValue(evidence, "SHOW_RECEIPT_CENTER_POINT", FALLBACK.UNKNOWN);
    state.targetViewportWidth = getValue(evidence, "TARGET_VIEWPORT_WIDTH", FALLBACK.UNKNOWN);
    state.targetViewportHeight = getValue(evidence, "TARGET_VIEWPORT_HEIGHT", FALLBACK.UNKNOWN);
    state.centerPointInViewport = getValue(evidence, "CENTER_POINT_IN_VIEWPORT", FALLBACK.UNKNOWN);
    state.elementFromPointAvailable = getValue(evidence, "ELEMENT_FROM_POINT_AVAILABLE", FALLBACK.UNKNOWN);
    state.elementFromPointResult = getValue(evidence, "ELEMENT_FROM_POINT_RESULT", FALLBACK.UNKNOWN);
    state.buttonPointerEvents = getValue(evidence, "BUTTON_POINTER_EVENTS", FALLBACK.UNKNOWN);
    state.hitTestUnreadableReason = getValue(evidence, "HIT_TEST_UNREADABLE_REASON", FALLBACK.UNKNOWN);
    state.frameRect = getValue(evidence, "FRAME_RECT", FALLBACK.UNKNOWN);
    state.frameVisibleToDiagnosticRoute = getValue(evidence, "FRAME_VISIBLE_TO_DIAGNOSTIC_ROUTE", FALLBACK.UNKNOWN);

    state.case1Support = getValue(evidence, "CASE_1_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case2Support = getValue(evidence, "CASE_2_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case3Support = getValue(evidence, "CASE_3_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case4Support = getValue(evidence, "CASE_4_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case6Support = getValue(evidence, "CASE_6_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);
    state.case7Support = getValue(evidence, "CASE_7_SUPPORT", FALLBACK.INSUFFICIENT_EVIDENCE);

    for (const note of normalizeNotes(getValue(evidence, "WEST_SECONDARY_EVIDENCE_NOTES", ""))) {
      addNote(state, note);
    }

    const notesText = state.northSecondaryEvidenceNotes.join(" | ");

    state.floatingAnchorHitTestNonControlling = asBoolString(
      notesText.includes("BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT_NON_CONTROLLING_FLOATING_ANCHOR_OR_SCROLL_POSITION") ||
      notesText.includes("HIT_TEST_TARGET_UNREADABLE_NON_CONTROLLING:BUTTON_CENTER_POINT_OUTSIDE_VIEWPORT")
    );

    state.canvasElementFound = notesText.includes("CANVAS_ELEMENT_NOT_FOUND")
      ? "false"
      : notesText.includes("CANVAS_ELEMENT_FOUND")
        ? "true"
        : FALLBACK.UNKNOWN;

    state.routeConductorContractReadableInRenderedTarget = notesText.includes("ROUTE_CONDUCTOR_CONTRACT_UNREADABLE_IN_RENDERED_TARGET")
      ? "false"
      : notesText.includes("ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET")
        ? "true"
        : FALLBACK.UNKNOWN;

    state.renderedPlanetProofFullyInspected = notesText.includes("RENDERED_PLANET_PROOF_NOT_FULLY_INSPECTED")
      ? "false"
      : notesText.includes("RENDERED_PLANET_PROOF_FULLY_INSPECTED")
        ? "true"
        : FALLBACK.UNKNOWN;

    state.westRenderedProofSpreadComplete = notesText.includes("WEST_RENDERED_READ_PARTIAL_PLANET_PROOF_SPREAD_INCOMPLETE")
      ? "false"
      : state.westRenderedReadStatus === FALLBACK.COMPLETE
        ? "true"
        : FALLBACK.UNKNOWN;

    if (state.floatingAnchorHitTestNonControlling === "true") {
      addNote(state, "NORTH_TREATED_FLOATING_ANCHOR_HIT_TEST_AS_NON_CONTROLLING");
    }

    if (state.canvasElementFound === "false" || state.renderedPlanetProofFullyInspected === "false") {
      addNote(state, "NORTH_PRESERVED_WEST_RENDERED_PLANET_PROOF_SPREAD_GAP");
    }
  }

  function selectPrimaryCase(state) {
    if (isSupportTrue(state.case5Support) || isSupportTrue(state.cacheOrServedContractMismatch)) {
      state.primaryCase = CASES.CASE_5;
      return;
    }

    if (isSupportTrue(state.case7Support)) {
      state.primaryCase = CASES.CASE_7;
      return;
    }

    if (isSupportTrue(state.case4Support)) {
      state.primaryCase = CASES.CASE_4;
      return;
    }

    if (isSupportTrue(state.case1Support)) {
      state.primaryCase = CASES.CASE_1;
      return;
    }

    if (isSupportTrue(state.case3Support)) {
      state.primaryCase = CASES.CASE_3;
      return;
    }

    if (isSupportTrue(state.case6Support) || isSupportTrue(state.runtimeReleaseIsLock)) {
      state.primaryCase = CASES.CASE_6;
      return;
    }

    if (isSupportTrue(state.case2Support) || state.showReceiptActionResult === "ACTION_DID_NOT_CHANGE_PANEL_OR_TEXT") {
      state.primaryCase = CASES.CASE_2;
      return;
    }

    state.primaryCase = CASES.INCONCLUSIVE;
  }

  function materialCasesAreFalse(state) {
    return (
      state.case1Support === SUPPORT_FALSE &&
      state.case4Support === SUPPORT_FALSE &&
      state.case5Support === SUPPORT_FALSE &&
      state.case6Support === SUPPORT_FALSE &&
      state.case7Support === SUPPORT_FALSE &&
      state.cacheOrServedContractMismatch === SUPPORT_FALSE &&
      state.runtimeReleaseIsLock === SUPPORT_FALSE
    );
  }

  function onlySyntheticHeld(state) {
    return (
      (
        state.case2Support === SUPPORT_HELD ||
        state.case2Support === FALLBACK.HELD ||
        state.case2Support === FALLBACK.UNKNOWN ||
        state.case2Support === FALLBACK.INSUFFICIENT_EVIDENCE
      ) &&
      (
        state.case3Support === SUPPORT_HELD ||
        state.case3Support === FALLBACK.HELD ||
        state.case3Support === FALLBACK.UNKNOWN ||
        state.case3Support === FALLBACK.INSUFFICIENT_EVIDENCE
      ) &&
      state.showReceiptActionResult === FALLBACK.HELD
    );
  }

  function renderedProofSpreadIncomplete(state) {
    return (
      state.westRenderedReadStatus === FALLBACK.PARTIAL &&
      (
        state.canvasElementFound === "false" ||
        state.routeConductorContractReadableInRenderedTarget === "false" ||
        state.renderedPlanetProofFullyInspected === "false" ||
        state.westRenderedProofSpreadComplete === "false" ||
        noteContains(state, "WEST_RENDERED_READ_PARTIAL_PLANET_PROOF_SPREAD_INCOMPLETE")
      )
    );
  }

  function applyCalibrationLayer(state, includeSouth) {
    const eastValid = state.eastReceiptValid === CHILD_VALIDATION.VALID && state.eastEvidenceValid === CHILD_VALIDATION.VALID;
    const westValid = state.westReceiptValid === CHILD_VALIDATION.VALID && state.westEvidenceValid === CHILD_VALIDATION.VALID;
    const southValid = state.southReceiptValid === CHILD_VALIDATION.VALID && state.southOutputValid === CHILD_VALIDATION.VALID;

    if (state.primaryCase !== CASES.INCONCLUSIVE) {
      state.calibrationStatus = CALIBRATION.NOT_APPLICABLE_CASE_CONTROLS;
      state.calibrationHoldReason = `PRIMARY_CASE_CONTROLS:${state.primaryCase}`;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      return;
    }

    if (!eastValid || !westValid) {
      state.calibrationStatus = CALIBRATION.HOLD_CHILD_ALIGNMENT_INCOMPLETE;
      state.calibrationHoldReason = `EAST=${state.eastEvidenceValid};WEST=${state.westEvidenceValid}`;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      return;
    }

    if (materialCasesAreFalse(state) && renderedProofSpreadIncomplete(state)) {
      state.calibrationStatus = CALIBRATION.HOLD_RENDERED_PLANET_PROOF_SPREAD_INCOMPLETE;
      state.calibrationHoldReason = "CACHE_CONTROL_AND_RUNTIME_CASES_FALSE_RENDERED_PLANET_PROOF_SPREAD_INCOMPLETE";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      addNote(state, "NORTH_SELECTED_CALIBRATION_HOLD_RENDERED_PLANET_PROOF_SPREAD_INCOMPLETE");
      return;
    }

    if (includeSouth && !southValid) {
      state.calibrationStatus = CALIBRATION.HOLD_SOUTH_OUTPUT_INCOMPLETE;
      state.calibrationHoldReason = `SOUTH=${state.southOutputValid}`;
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      return;
    }

    if (includeSouth && state.southMeaningPreserved === "false") {
      state.calibrationStatus = CALIBRATION.HOLD_NORTH_MEANING_NOT_PRESERVED_BY_SOUTH;
      state.calibrationHoldReason = "SOUTH_OUTPUT_DID_NOT_PRESERVE_NORTH_SELECTED_MEANING";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      return;
    }

    if (materialCasesAreFalse(state) && onlySyntheticHeld(state)) {
      state.calibrationStatus = CALIBRATION.CLEAN;
      state.calibrationHoldReason = FALLBACK.NONE;
      state.diagnosticRailClean = "true";
      state.calibrationPointReached = "true";
      return;
    }

    state.calibrationStatus = CALIBRATION.INSUFFICIENT_EVIDENCE;
    state.calibrationHoldReason = "NORTH_REQUIRES_ADDITIONAL_RENDERED_TARGET_EVIDENCE";
    state.diagnosticRailClean = "false";
    state.calibrationPointReached = "false";
  }

  function selectRecommendation(state) {
    if (state.calibrationStatus === CALIBRATION.HOLD_RENDERED_PLANET_PROOF_SPREAD_INCOMPLETE) {
      state.recommendedNextOwner = "DIAGNOSTIC_RENDERED_PROOF_SPREAD";
      state.recommendedNextFile = "/assets/hearth/hearth.diagnostic.west.js";
      state.recommendedNextAction = "RENEW_WEST_RENDERED_TARGET_PROOF_SPREAD_TO_INSPECT_VISIBLE_PLANET_CANVAS_AND_ROUTE_CONDUCTOR_RUNTIME_PROOF";
      return;
    }

    if (state.calibrationStatus === CALIBRATION.HOLD_CHILD_ALIGNMENT_INCOMPLETE) {
      state.recommendedNextOwner = "DIAGNOSTIC_CHILD_ALIGNMENT";
      state.recommendedNextFile = "HOLD_FOR_TEACHER_REVIEW";
      state.recommendedNextAction = "VERIFY_EAST_WEST_CHILD_CONTRACTS_AND_EVIDENCE_BEFORE_REPAIR_SELECTION";
      return;
    }

    if (state.calibrationStatus === CALIBRATION.HOLD_SOUTH_OUTPUT_INCOMPLETE) {
      state.recommendedNextOwner = "DIAGNOSTIC_SOUTH_OUTPUT";
      state.recommendedNextFile = "/assets/hearth/hearth.diagnostic.south.js";
      state.recommendedNextAction = "RENEW_SOUTH_REPORT_PACKET_OUTPUT_TO_ACCEPT_NORTH_ANCHOR_SCHEMA_FIELDS";
      return;
    }

    if (state.calibrationStatus === CALIBRATION.HOLD_NORTH_MEANING_NOT_PRESERVED_BY_SOUTH) {
      state.recommendedNextOwner = "DIAGNOSTIC_SOUTH_OUTPUT";
      state.recommendedNextFile = "/assets/hearth/hearth.diagnostic.south.js";
      state.recommendedNextAction = "RENEW_SOUTH_TO_PRESERVE_NORTH_SELECTED_PRIMARY_CASE_CALIBRATION_AND_RECOMMENDATION_FIELDS";
      return;
    }

    if (state.calibrationStatus === CALIBRATION.CLEAN) {
      state.recommendedNextOwner = "NEXT_TASK_READY";
      state.recommendedNextFile = "NONE";
      state.recommendedNextAction = "DIAGNOSTIC_RAIL_CALIBRATION_POINT_REACHED";
      return;
    }

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

  function resolveNewsAlignment(state) {
    const stages = [
      { name: "NORTH_START", passed: true },
      {
        name: "EAST_SOURCE",
        passed: state.eastReceiptValid === CHILD_VALIDATION.VALID && state.eastEvidenceValid === CHILD_VALIDATION.VALID
      },
      {
        name: "WEST_RENDERED",
        passed: state.westReceiptValid === CHILD_VALIDATION.VALID && state.westEvidenceValid === CHILD_VALIDATION.VALID
      },
      { name: "NORTH_ADJUDICATION", passed: Boolean(state.primaryCase) },
      {
        name: "SOUTH_OUTPUT",
        passed: state.southReceiptValid === CHILD_VALIDATION.VALID && state.southOutputValid === CHILD_VALIDATION.VALID
      },
      {
        name: "NORTH_VERIFY",
        passed: state.southOutputValid === CHILD_VALIDATION.VALID || state.southOutputStatus === STATUS.FALLBACK
      }
    ];

    const passed = stages.filter((stage) => stage.passed).length;
    const firstFailed = stages.find((stage) => !stage.passed);

    state.newsAlignmentScore = Math.round((passed / stages.length) * 100);
    state.newsAlignmentFirstFailedStage = firstFailed ? firstFailed.name : "NONE";
    state.newsAlignmentStatus = firstFailed ? "NEWS_ALIGNMENT_PARTIAL" : "NEWS_ALIGNMENT_COMPLETE";

    if (firstFailed) addNote(state, `NEWS_ALIGNMENT_FIRST_FAILED_STAGE:${firstFailed.name}`);
  }

  function resolveFibonacciSynchronization(state) {
    const stages = [
      {
        key: "F1",
        passed: state.diagnosticTargetAccessStatus !== FALLBACK.UNKNOWN || state.expectedHtmlContract !== FALLBACK.UNKNOWN
      },
      {
        key: "F2",
        passed: state.eastReceiptValid === CHILD_VALIDATION.VALID && state.westReceiptValid === CHILD_VALIDATION.VALID
      },
      { key: "F3", passed: state.eastEvidenceValid === CHILD_VALIDATION.VALID },
      { key: "F5", passed: state.westEvidenceValid === CHILD_VALIDATION.VALID },
      { key: "F8", passed: Boolean(state.primaryCase) },
      {
        key: "F13",
        passed: state.southOutputValid === CHILD_VALIDATION.VALID || state.southOutputStatus === STATUS.FALLBACK
      },
      {
        key: "F21",
        passed: state.f21EligibleForNorth === false && state.f21ClaimedByDiagnosticRail === false
      }
    ];

    const passed = stages.filter((stage) => stage.passed).length;
    const firstFailed = stages.find((stage) => !stage.passed);

    state.fibonacciSynchronizationScore = Math.round((passed / stages.length) * 100);
    state.fibonacciSynchronizationFirstFailedStage = firstFailed ? firstFailed.key : "NONE";
    state.fibonacciSynchronizationStatus = firstFailed ? "FIBONACCI_SYNCHRONIZATION_PARTIAL" : "FIBONACCI_SYNCHRONIZATION_COMPLETE";

    if (firstFailed) addNote(state, `FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE:${firstFailed.key}`);
  }

  function buildNorthVerdict(state) {
    const notes = normalizeNotes(state.secondaryEvidenceNotes, state.northSecondaryEvidenceNotes);

    return {
      schema: "HEARTH_DIAGNOSTIC_NORTH_ANCHOR_VERDICT_SCHEMA_v3",
      northContract: CONTRACT,
      northReceipt: RECEIPT,
      previousNorthContract: PREVIOUS_CONTRACT,
      baselineNorthContract: BASELINE_CONTRACT,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: state.diagnosticTimestamp,

      primaryCase: state.primaryCase,
      calibrationStatus: state.calibrationStatus,
      calibrationHoldReason: state.calibrationHoldReason,
      diagnosticRailClean: state.diagnosticRailClean,
      calibrationPointReached: state.calibrationPointReached,

      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,

      childValidation: {
        eastReceiptValid: state.eastReceiptValid,
        westReceiptValid: state.westReceiptValid,
        southReceiptValid: state.southReceiptValid,
        eastEvidenceValid: state.eastEvidenceValid,
        westEvidenceValid: state.westEvidenceValid,
        southOutputValid: state.southOutputValid,
        southMeaningPreserved: state.southMeaningPreserved
      },

      currentSpread: {
        expectedHtmlContract: state.expectedHtmlContract,
        expectedIndexJsContract: state.expectedIndexJsContract,
        expectedRouteConductorContract: state.expectedRouteConductorContract,
        servedHtmlContract: state.servedHtmlContract,
        servedIndexJsContract: state.servedIndexJsContract,
        servedRouteConductorContract: state.servedRouteConductorContract,
        currentExpectedHtmlContract: state.currentExpectedHtmlContract,
        currentExpectedIndexJsContract: state.currentExpectedIndexJsContract,
        currentExpectedRouteConductorContract: state.currentExpectedRouteConductorContract,
        primaryRouteConductorContractRecognized: state.primaryRouteConductorContractRecognized,
        routeConductorV95PrimaryNotTreatedAsCase5: state.routeConductorV95PrimaryNotTreatedAsCase5,
        routeConductorV94LineageAccepted: state.routeConductorV94LineageAccepted,
        eastCurrentSpreadAlignmentRecognized: state.eastCurrentSpreadAlignmentRecognized
      },

      renderedProof: {
        diagnosticTargetAccessStatus: state.diagnosticTargetAccessStatus,
        currentVisibleHearthStatus: state.currentVisibleHearthStatus,
        showReceiptButtonExists: state.showReceiptButtonExists,
        showReceiptTargetIsButton: state.showReceiptTargetIsButton,
        targetPointerEvents: state.targetPointerEvents,
        receiptPanelExists: state.receiptPanelExists,
        receiptTextNodeExists: state.receiptTextNodeExists,
        runtimeReleaseIsLock: state.runtimeReleaseIsLock,
        canvasElementFound: state.canvasElementFound,
        routeConductorContractReadableInRenderedTarget: state.routeConductorContractReadableInRenderedTarget,
        renderedPlanetProofFullyInspected: state.renderedPlanetProofFullyInspected,
        westRenderedProofSpreadComplete: state.westRenderedProofSpreadComplete,
        floatingAnchorHitTestNonControlling: state.floatingAnchorHitTestNonControlling
      },

      caseSupport: {
        case1Support: state.case1Support,
        case2Support: state.case2Support,
        case3Support: state.case3Support,
        case4Support: state.case4Support,
        case5Support: state.case5Support,
        case6Support: state.case6Support,
        case7Support: state.case7Support
      },

      newsAlignment: {
        protocol: state.newsAlignmentProtocol,
        status: state.newsAlignmentStatus,
        score: state.newsAlignmentScore,
        firstFailedStage: state.newsAlignmentFirstFailedStage
      },

      fibonacciSynchronization: {
        protocol: state.fibonacciSynchronizationProtocol,
        status: state.fibonacciSynchronizationStatus,
        score: state.fibonacciSynchronizationScore,
        firstFailedStage: state.fibonacciSynchronizationFirstFailedStage
      },

      notes,
      ...NO_CLAIM_FIELDS
    };
  }

  function buildReportObject(state) {
    const notes = normalizeNotes(state.secondaryEvidenceNotes, state.northSecondaryEvidenceNotes).join(" | ") || FALLBACK.NONE;

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
      CALIBRATION_STATUS: state.calibrationStatus,
      CALIBRATION_HOLD_REASON: state.calibrationHoldReason,
      DIAGNOSTIC_RAIL_CLEAN: state.diagnosticRailClean,
      CALIBRATION_POINT_REACHED: state.calibrationPointReached,

      SECONDARY_EVIDENCE_NOTES: notes,
      NORTH_SECONDARY_EVIDENCE_NOTES: state.northSecondaryEvidenceNotes.join(" | ") || FALLBACK.NONE,

      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,

      NORTH_CONTRACT: CONTRACT,
      NORTH_RECEIPT: RECEIPT,
      PREVIOUS_NORTH_CONTRACT: PREVIOUS_CONTRACT,
      BASELINE_NORTH_CONTRACT: BASELINE_CONTRACT,

      EAST_ALIGNMENT_CONTRACT: state.eastAlignmentContract,
      WEST_IMPLEMENTATION_CONTRACT: state.westImplementationContract,

      CURRENT_EXPECTED_HTML_CONTRACT: state.currentExpectedHtmlContract,
      CURRENT_EXPECTED_INDEX_JS_CONTRACT: state.currentExpectedIndexJsContract,
      CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT: state.currentExpectedRouteConductorContract,

      PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED: state.primaryRouteConductorContractRecognized,
      ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5: state.routeConductorV95PrimaryNotTreatedAsCase5,
      ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED: state.routeConductorV94LineageAccepted,
      EAST_CURRENT_SPREAD_ALIGNMENT_RECOGNIZED: state.eastCurrentSpreadAlignmentRecognized,

      SHOW_RECEIPT_RECT: state.showReceiptRect,
      SHOW_RECEIPT_CENTER_POINT: state.showReceiptCenterPoint,
      TARGET_VIEWPORT_WIDTH: state.targetViewportWidth,
      TARGET_VIEWPORT_HEIGHT: state.targetViewportHeight,
      CENTER_POINT_IN_VIEWPORT: state.centerPointInViewport,
      ELEMENT_FROM_POINT_AVAILABLE: state.elementFromPointAvailable,
      ELEMENT_FROM_POINT_RESULT: state.elementFromPointResult,
      BUTTON_POINTER_EVENTS: state.buttonPointerEvents,
      HIT_TEST_UNREADABLE_REASON: state.hitTestUnreadableReason,
      FRAME_RECT: state.frameRect,
      FRAME_VISIBLE_TO_DIAGNOSTIC_ROUTE: state.frameVisibleToDiagnosticRoute,

      CANVAS_ELEMENT_FOUND: state.canvasElementFound,
      ROUTE_CONDUCTOR_CONTRACT_READABLE_IN_RENDERED_TARGET: state.routeConductorContractReadableInRenderedTarget,
      RENDERED_PLANET_PROOF_FULLY_INSPECTED: state.renderedPlanetProofFullyInspected,
      WEST_RENDERED_PROOF_SPREAD_COMPLETE: state.westRenderedProofSpreadComplete,
      FLOATING_ANCHOR_HIT_TEST_NON_CONTROLLING: state.floatingAnchorHitTestNonControlling,

      NEWS_ALIGNMENT_PROTOCOL: state.newsAlignmentProtocol,
      NEWS_ALIGNMENT_STATUS: state.newsAlignmentStatus,
      NEWS_ALIGNMENT_SCORE: state.newsAlignmentScore,
      NEWS_ALIGNMENT_FIRST_FAILED_STAGE: state.newsAlignmentFirstFailedStage,

      FIBONACCI_SYNCHRONIZATION_PROTOCOL: state.fibonacciSynchronizationProtocol,
      FIBONACCI_SYNCHRONIZATION_STATUS: state.fibonacciSynchronizationStatus,
      FIBONACCI_SYNCHRONIZATION_SCORE: state.fibonacciSynchronizationScore,
      FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: state.fibonacciSynchronizationFirstFailedStage,

      EAST_SOURCE_READ_STATUS: state.eastSourceReadStatus,
      WEST_RENDERED_READ_STATUS: state.westRenderedReadStatus,
      SOUTH_OUTPUT_STATUS: state.southOutputStatus,

      EAST_RECEIPT_VALID: state.eastReceiptValid,
      WEST_RECEIPT_VALID: state.westReceiptValid,
      SOUTH_RECEIPT_VALID: state.southReceiptValid,
      EAST_EVIDENCE_VALID: state.eastEvidenceValid,
      WEST_EVIDENCE_VALID: state.westEvidenceValid,
      SOUTH_OUTPUT_VALID: state.southOutputValid,
      SOUTH_MEANING_PRESERVED: state.southMeaningPreserved,

      CASE_1_SUPPORT: state.case1Support,
      CASE_2_SUPPORT: state.case2Support,
      CASE_3_SUPPORT: state.case3Support,
      CASE_4_SUPPORT: state.case4Support,
      CASE_5_SUPPORT: state.case5Support,
      CASE_6_SUPPORT: state.case6Support,
      CASE_7_SUPPORT: state.case7Support,

      NORTH_VERDICT: clonePlain(state.northVerdict),

      ...NO_CLAIM_FIELDS
    };
  }

  function composePacketText(report, options = {}) {
    const lines = [];

    for (const field of REQUIRED_REPORT_FIELDS) {
      lines.push(line(field, getValue(report, field, FALLBACK.UNKNOWN)));
    }

    if (options.includeOptionalTraceFields !== false) {
      for (const field of OPTIONAL_TRACE_FIELDS) {
        lines.push(line(field, getValue(report, field, FALLBACK.UNKNOWN)));
      }
    }

    if (options.includeNorthVerdict === true) {
      lines.push(line("NORTH_VERDICT", getValue(report, "NORTH_VERDICT", FALLBACK.UNKNOWN)));
    }

    if (options.includeNoClaimFieldsInPacket === true) {
      for (const key of Object.keys(NO_CLAIM_FIELDS)) {
        lines.push(line(key, "false"));
      }
    }

    return lines.join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("TARGET_ROUTE", getValue(report, "TARGET_ROUTE", TARGET_ROUTE)),
      line("SERVED_ROUTE_CONDUCTOR_CONTRACT", getValue(report, "SERVED_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN)),
      line("CACHE_OR_SERVED_CONTRACT_MISMATCH", getValue(report, "CACHE_OR_SERVED_CONTRACT_MISMATCH", FALLBACK.UNKNOWN)),
      line("CASE_1_SUPPORT", getValue(report, "CASE_1_SUPPORT", FALLBACK.UNKNOWN)),
      line("CASE_4_SUPPORT", getValue(report, "CASE_4_SUPPORT", FALLBACK.UNKNOWN)),
      line("CASE_5_SUPPORT", getValue(report, "CASE_5_SUPPORT", FALLBACK.UNKNOWN)),
      line("CASE_6_SUPPORT", getValue(report, "CASE_6_SUPPORT", FALLBACK.UNKNOWN)),
      line("CASE_7_SUPPORT", getValue(report, "CASE_7_SUPPORT", FALLBACK.UNKNOWN)),
      line("WEST_RENDERED_READ_STATUS", getValue(report, "WEST_RENDERED_READ_STATUS", FALLBACK.UNKNOWN)),
      line("CALIBRATION_STATUS", getValue(report, "CALIBRATION_STATUS", FALLBACK.UNKNOWN)),
      line("CALIBRATION_POINT_REACHED", getValue(report, "CALIBRATION_POINT_REACHED", FALLBACK.UNKNOWN)),
      line("PRIMARY_CASE", getValue(report, "PRIMARY_CASE", FALLBACK.UNKNOWN)),
      line("RECOMMENDED_NEXT_OWNER", getValue(report, "RECOMMENDED_NEXT_OWNER", FALLBACK.UNKNOWN)),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", FALLBACK.UNKNOWN)),
      line("RECOMMENDED_NEXT_ACTION", getValue(report, "RECOMMENDED_NEXT_ACTION", FALLBACK.UNKNOWN))
    ].join("\n");
  }

  function southPreservesNorthMeaning(output, state) {
    const report = isObject(output && output.REPORT_OBJECT) ? output.REPORT_OBJECT : null;
    if (!report) return false;

    return (
      getValue(report, "PRIMARY_CASE", FALLBACK.UNKNOWN) === state.primaryCase &&
      getValue(report, "CALIBRATION_STATUS", FALLBACK.UNKNOWN) === state.calibrationStatus &&
      getValue(report, "CALIBRATION_HOLD_REASON", FALLBACK.UNKNOWN) === state.calibrationHoldReason &&
      getValue(report, "DIAGNOSTIC_RAIL_CLEAN", FALLBACK.UNKNOWN) === state.diagnosticRailClean &&
      getValue(report, "CALIBRATION_POINT_REACHED", FALLBACK.UNKNOWN) === state.calibrationPointReached &&
      getValue(report, "RECOMMENDED_NEXT_OWNER", FALLBACK.UNKNOWN) === state.recommendedNextOwner &&
      getValue(report, "RECOMMENDED_NEXT_FILE", FALLBACK.UNKNOWN) === state.recommendedNextFile &&
      getValue(report, "RECOMMENDED_NEXT_ACTION", FALLBACK.UNKNOWN) === state.recommendedNextAction
    );
  }

  function mergeNorthFieldsIntoSouthReport(southReport, northReport) {
    const merged = isObject(southReport) ? clonePlain(southReport) : {};
    const source = isObject(northReport) ? northReport : {};

    for (const field of [...REQUIRED_REPORT_FIELDS, ...OPTIONAL_TRACE_FIELDS, "NORTH_VERDICT"]) {
      if (merged[field] === undefined || merged[field] === null || merged[field] === "") {
        merged[field] = source[field];
      }
    }

    return merged;
  }

  function diagnosticComplete(state) {
    return (
      state.eastReceiptValid === CHILD_VALIDATION.VALID &&
      state.westReceiptValid === CHILD_VALIDATION.VALID &&
      state.southReceiptValid === CHILD_VALIDATION.VALID &&
      state.eastEvidenceValid === CHILD_VALIDATION.VALID &&
      state.westEvidenceValid === CHILD_VALIDATION.VALID &&
      state.southOutputValid === CHILD_VALIDATION.VALID &&
      state.southMeaningPreserved === "true" &&
      state.calibrationPointReached === "true" &&
      state.newsAlignmentStatus === "NEWS_ALIGNMENT_COMPLETE" &&
      state.fibonacciSynchronizationStatus === "FIBONACCI_SYNCHRONIZATION_COMPLETE"
    );
  }

  async function runSouthIfAvailable(children, state, options) {
    if (state.southReceiptValid !== CHILD_VALIDATION.VALID || !children.south) {
      state.southOutputValid = state.southReceiptValid === CHILD_VALIDATION.VALID
        ? CHILD_VALIDATION.MISSING
        : state.southReceiptValid;
      state.southOutputStatus = STATUS.FALLBACK;
      state.southMeaningPreserved = "false";
      addNote(state, `SOUTH_CHILD_MISSING_OR_INVALID:${state.southReceiptValid}`);
      return null;
    }

    const northReport = buildReportObject(state);

    try {
      const southResult = await Promise.resolve(children.south.composeSouthReport(northReport, {
        includeOptionalTraceFields: options.includeOptionalTraceFields !== false,
        includeNoClaimFieldsInPacket: Boolean(options.includeNoClaimFieldsInPacket),
        mergeSouthOutputNotesIntoEvidenceNotes: Boolean(options.mergeSouthOutputNotesIntoEvidenceNotes),
        northVerdict: clonePlain(state.northVerdict)
      }));

      const output = getEvidencePayload(southResult, "output");
      const outputStatus = validateSouthOutput(output);

      state.southOutputValid = outputStatus;

      if (outputStatus === CHILD_VALIDATION.VALID) {
        state.childSouthStatus = getValue(output, "SOUTH_STATUS", FALLBACK.UNKNOWN);
        state.southOutputStatus = getValue(output, "SOUTH_OUTPUT_STATUS", FALLBACK.UNKNOWN);
        state.southMeaningPreserved = southPreservesNorthMeaning(output, state) ? "true" : "false";

        if (state.southMeaningPreserved === "true") {
          const southReport = isObject(output.REPORT_OBJECT) ? output.REPORT_OBJECT : {};
          const mergedReport = mergeNorthFieldsIntoSouthReport(southReport, northReport);

          state.reportObject = clonePlain(mergedReport);
          state.fullPacketText = output.FULL_PACKET_TEXT || composePacketText(mergedReport, options);
          state.compactSummary = output.COMPACT_SUMMARY || composeCompactSummary(mergedReport);
          return output;
        }

        addNote(state, "SOUTH_OUTPUT_REJECTED_MEANING_OVERRIDE_ATTEMPT");
        return output;
      }

      state.southOutputStatus = STATUS.FALLBACK;
      state.southMeaningPreserved = "false";
      addNote(state, `SOUTH_OUTPUT_INVALID:${outputStatus}`);
      return output;
    } catch (error) {
      state.southOutputValid = CHILD_VALIDATION.UNREADABLE;
      state.southOutputStatus = STATUS.FALLBACK;
      state.southMeaningPreserved = "false";
      addNote(state, `SOUTH_CHILD_RUN_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
      return null;
    }
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
          const eastResult = await Promise.resolve(children.east.runEastSourceRead());
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

      const sourceMismatchControlling =
        isSupportTrue(state.case5Support) ||
        isSupportTrue(state.cacheOrServedContractMismatch);

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

          const westResult = await Promise.resolve(children.west.runWestRenderedRead(westOptions));
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
      applyCalibrationLayer(state, false);
      selectRecommendation(state);
      resolveNewsAlignment(state);
      resolveFibonacciSynchronization(state);

      state.northVerdict = buildNorthVerdict(state);

      await runSouthIfAvailable(children, state, options);

      applyCalibrationLayer(state, true);
      selectRecommendation(state);
      resolveNewsAlignment(state);
      resolveFibonacciSynchronization(state);

      state.northVerdict = buildNorthVerdict(state);

      if (state.southOutputValid !== CHILD_VALIDATION.VALID || state.southMeaningPreserved !== "true") {
        const fallbackReport = buildReportObject(state);
        state.reportObject = clonePlain(fallbackReport);
        state.fullPacketText = composePacketText(fallbackReport, options);
        state.compactSummary = composeCompactSummary(fallbackReport);
        state.southOutputStatus = state.southOutputStatus || STATUS.FALLBACK;
        addNote(state, "NORTH_ANCHOR_SCHEMA_FALLBACK_PACKET_COMPOSED");
      } else {
        const merged = mergeNorthFieldsIntoSouthReport(state.reportObject, buildReportObject(state));
        state.reportObject = clonePlain(merged);
        state.fullPacketText = state.fullPacketText || composePacketText(merged, options);
        state.compactSummary = state.compactSummary || composeCompactSummary(merged);
      }

      state.secondaryEvidenceNotes = normalizeNotes(state.northSecondaryEvidenceNotes).join(" | ") || FALLBACK.NONE;
      state.diagnosticRunStatus = diagnosticComplete(state) ? STATUS.COMPLETE : STATUS.PARTIAL;
      state.northStatus = state.diagnosticRunStatus;
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        previousReceipt: PREVIOUS_RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        baselineReceipt: BASELINE_RECEIPT,
        verdict: clonePlain(lastVerdict),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState)
      };
    } catch (error) {
      state.northStatus = STATUS.FAILED;
      state.diagnosticRunStatus = STATUS.FAILED;
      state.primaryCase = CASES.INCONCLUSIVE;
      state.calibrationStatus = CALIBRATION.INSUFFICIENT_EVIDENCE;
      state.calibrationHoldReason = "NORTH_TOP_LEVEL_ERROR";
      state.diagnosticRailClean = "false";
      state.calibrationPointReached = "false";
      state.recommendedNextOwner = FALLBACK.INSUFFICIENT_EVIDENCE;
      state.recommendedNextFile = "HOLD_FOR_TEACHER_REVIEW";
      state.recommendedNextAction = "COLLECT_ADDITIONAL_RENDERED_TARGET_EVIDENCE";
      addNote(state, `NORTH_TOP_LEVEL_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
      addNote(state, "NORTH_ANCHOR_SCHEMA_FALLBACK_PACKET_COMPOSED");

      resolveNewsAlignment(state);
      resolveFibonacciSynchronization(state);

      state.northVerdict = buildNorthVerdict(state);
      state.reportObject = buildReportObject(state);
      state.fullPacketText = composePacketText(state.reportObject, options);
      state.compactSummary = composeCompactSummary(state.reportObject);
      state.updatedAt = nowIso();

      publish(state);

      return {
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        previousReceipt: PREVIOUS_RECEIPT,
        baselineContract: BASELINE_CONTRACT,
        baselineReceipt: BASELINE_RECEIPT,
        error: bounded(error && error.message ? error.message : error, 1000),
        verdict: clonePlain(lastVerdict),
        report: clonePlain(lastReport),
        packetText: lastPacketText,
        compactSummary: lastCompactSummary,
        state: clonePlain(lastState)
      };
    }
  }

  function getReport() {
    return clonePlain(lastReport || buildReportObject(makeState()));
  }

  function getNorthVerdict() {
    return clonePlain(lastVerdict || buildNorthVerdict(makeState()));
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;

    const state = makeState();
    const report = buildReportObject(state);
    return composePacketText(report, {});
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;

    const state = makeState();
    const report = buildReportObject(state);
    return composeCompactSummary(report);
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getReceipt() {
    const state = lastState || makeState();

    return {
      parentRole: "NORTH_ANCHOR_SCHEMA_ORCHESTRATOR",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      baselineContract: BASELINE_CONTRACT,
      baselineReceipt: BASELINE_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      childLoadingMode: CHILD_LOADING_MODE,
      routeReceiverMustLoadChildrenBeforeRun: ROUTE_RECEIVER_MUST_LOAD_CHILDREN_BEFORE_RUN,
      northDynamicChildLoadingOwned: NORTH_DYNAMIC_CHILD_LOADING_OWNED,

      servesRouteReceiver: true,
      northIsDiagnosticAnchor: true,
      northOwnsCanonicalVerdictSchema: true,

      eastChildConsumed: state.eastReceiptValid === CHILD_VALIDATION.VALID,
      westChildConsumed: state.westReceiptValid === CHILD_VALIDATION.VALID,
      southChildConsumed: state.southReceiptValid === CHILD_VALIDATION.VALID,

      eastReceiptValid: state.eastReceiptValid,
      westReceiptValid: state.westReceiptValid,
      southReceiptValid: state.southReceiptValid,
      eastEvidenceValid: state.eastEvidenceValid,
      westEvidenceValid: state.westEvidenceValid,
      southOutputValid: state.southOutputValid,
      southMeaningPreserved: state.southMeaningPreserved,

      eastCurrentSpreadAlignmentRecognized: state.eastCurrentSpreadAlignmentRecognized,
      routeConductorV95PrimaryNotTreatedAsCase5: state.routeConductorV95PrimaryNotTreatedAsCase5,
      westRenderedProofSpreadComplete: state.westRenderedProofSpreadComplete,

      primaryCase: state.primaryCase,
      calibrationStatus: state.calibrationStatus,
      calibrationHoldReason: state.calibrationHoldReason,
      diagnosticRailClean: state.diagnosticRailClean,
      calibrationPointReached: state.calibrationPointReached,

      newsAlignmentStatus: state.newsAlignmentStatus,
      newsAlignmentScore: state.newsAlignmentScore,
      newsAlignmentFirstFailedStage: state.newsAlignmentFirstFailedStage,

      fibonacciSynchronizationStatus: state.fibonacciSynchronizationStatus,
      fibonacciSynchronizationScore: state.fibonacciSynchronizationScore,
      fibonacciSynchronizationFirstFailedStage: state.fibonacciSynchronizationFirstFailedStage,

      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,

      finalPrimaryCaseAuthority: true,
      finalRecommendationAuthority: true,
      calibrationLayerAuthority: true,
      canonicalVerdictSchemaAuthority: true,
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
      getNorthVerdictApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getStateApiAvailable: true,

      routeReceiverShouldCallNorthOnly: true,

      ...NO_CLAIM_FIELDS,

      lastNorthStatus: state.northStatus,
      lastDiagnosticRunStatus: state.diagnosticRunStatus,
      lastPrimaryCase: state.primaryCase,
      lastCalibrationStatus: state.calibrationStatus,
      updatedAt: nowIso()
    };
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastVerdict = clonePlain(
      state.northVerdict && Object.keys(state.northVerdict).length
        ? state.northVerdict
        : buildNorthVerdict(state)
    );
    lastReport = clonePlain(
      state.reportObject && Object.keys(state.reportObject).length
        ? state.reportObject
        : buildReportObject(state)
    );
    lastPacketText = state.fullPacketText || composePacketText(lastReport, {});
    lastCompactSummary = state.compactSummary || composeCompactSummary(lastReport);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticRail = api;
    root.HEARTH.parallelDiagnosticRail = api;
    root.HEARTH.diagnosticNorth = api;
    root.HEARTH.diagnosticRailNorth = api;
    root.HEARTH.diagnosticNorthAnchor = api;

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthDiagnosticRail = api;
    root.DEXTER_LAB.hearthDiagnosticNorth = api;
    root.DEXTER_LAB.hearthDiagnosticNorthAnchor = api;

    root.HEARTH_DIAGNOSTIC_RAIL = api;
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL = api;
    root.HEARTH_DIAGNOSTIC_NORTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH = api;
    root.HEARTH_DIAGNOSTIC_NORTH_ANCHOR = api;

    root.HEARTH_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_NORTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_NORTH_ANCHOR_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_VERDICT = clonePlain(lastVerdict);
    root.HEARTH_DIAGNOSTIC_NORTH_VERDICT = clonePlain(lastVerdict);

    root.HEARTH_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
    root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT = clonePlain(lastReport);
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    baselineContract: BASELINE_CONTRACT,
    baselineReceipt: BASELINE_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    childLoadingMode: CHILD_LOADING_MODE,
    routeReceiverMustLoadChildrenBeforeRun: ROUTE_RECEIVER_MUST_LOAD_CHILDREN_BEFORE_RUN,
    northDynamicChildLoadingOwned: NORTH_DYNAMIC_CHILD_LOADING_OWNED,

    currentHtmlContract: CURRENT_HTML_CONTRACT,
    currentIndexJsContract: CURRENT_INDEX_JS_CONTRACT,
    currentRouteConductorContract: CURRENT_ROUTE_CONDUCTOR_CONTRACT,
    priorRouteConductorContract: PRIOR_ROUTE_CONDUCTOR_CONTRACT,

    eastContract: EAST_CONTRACT,
    eastCurrentAlignmentContract: EAST_CURRENT_ALIGNMENT_CONTRACT,
    westContract: WEST_CONTRACT,
    westCurrentImplementationContract: WEST_CURRENT_IMPLEMENTATION_CONTRACT,
    southContract: SOUTH_CONTRACT,

    runDiagnostic,
    getReport,
    getNorthVerdict,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getState,

    supportsNorthAnchorSchema: true,
    supportsCurrentSpreadCalibration: true,
    supportsEastV3CurrentSpreadIntelligence: true,
    supportsRouteConductorV95AsCurrentSpread: true,
    supportsWestRenderedObservabilityFields: true,
    supportsCalibrationStatusLayer: true,
    supportsNewsAlignmentAudit: true,
    supportsFibonacciSynchronizationAudit: true,
    supportsSouthMeaningPreservationAudit: true,

    finalPrimaryCaseAuthority: true,
    finalRecommendationAuthority: true,
    calibrationLayerAuthority: true,
    canonicalVerdictSchemaAuthority: true,

    servedSourceParsingAuthority: false,
    renderedTargetProbeAuthority: false,
    packetFormattingAuthority: false,
    diagnosticUiAuthority: false,
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,

    ...NO_CLAIM_FIELDS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
