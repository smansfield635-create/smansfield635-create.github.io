// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1
// Full-file replacement.
// Diagnostic rail SOUTH child only.
// Internal implementation renewal:
// HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6
// Purpose:
// - Preserve SOUTH external child contract required by NORTH.
// - Conform SOUTH output to NORTH v5 lab/canvas bridge schema.
// - Preserve NORTH-selected PRIMARY_CASE, calibration fields, recommendation fields, NEWS fields, Fibonacci fields, and no-claim boundaries.
// - Print planetary-control lifecycle fields as formal report fields, not only secondary notes.
// - Preserve future control-file footprint as expected-not-yet-built when NORTH/EAST declare that posture.
// - Preserve JS integration funnel: index.js -> hearth.js -> hearth.controls.js -> canvas.
// - Preserve diagnostic lab/canvas bridge language as report-output only.
// - Preserve bishop-lane, bishop pointer-finger, queen handshake, and four-way canvas handoff fields as report-output only.
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
// - control-file implementation
// - lab-table implementation
// - canvas implementation
// - bishop-lane implementation

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  const IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6";
  const IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_RECEIPT_v6";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_LAB_CANVAS_BRIDGE_REPORT_CONFORMANCE_TNT_v5";
  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PLANETARY_CONTROL_LIFECYCLE_REPORT_CONFORMANCE_TNT_v4";
  const BASELINE_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

  const NORTH_ANCHOR_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_TNT_v5";
  const NORTH_ANCHOR_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_RECEIPT_v5";
  const PREVIOUS_NORTH_ANCHOR_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ORCHESTRATOR_TNT_v4";
  const PREVIOUS_NORTH_ANCHOR_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ORCHESTRATOR_RECEIPT_v4";

  const VERSION =
    "2026-06-04.hearth-diagnostic-south-bishop-queen-canvas-report-conformance-v6";

  const FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const REPORT_PACKET = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v1";

  const EXPECTED_CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const EXPECTED_CONTROL_CONTRACT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";

  const EXPECTED_ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const COMPAT_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_NEWS_FIBONACCI_VISIBLE_GLOBE_PROOF_SYNCHRONIZATION_TNT_v9_6";
  const LINEAGE_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_EXPRESSION_HUB_VISIBLE_GLOBE_PROOF_INGESTION_TNT_v9_5";
  const PRIOR_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_CANVAS_LOCAL_STATION_BRIDGE_ALIGNMENT_TNT_v9_4";

  const EXPECTED_INDEX_FILE = "/showroom/globe/hearth/index.js";
  const EXPECTED_INDEX_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const JS_INTEGRATION_FUNNEL = [
    EXPECTED_INDEX_FILE,
    EXPECTED_ROUTE_CONDUCTOR_FILE,
    EXPECTED_CONTROL_FILE,
    EXPECTED_CANVAS_FILE
  ].join(" -> ");

  const CONTROL_FUNNEL_OWNER = EXPECTED_ROUTE_CONDUCTOR_FILE;

  const FALLBACK = Object.freeze({
    UNKNOWN: "UNKNOWN",
    NOT_FOUND: "NOT_FOUND",
    BLOCKED: "BLOCKED",
    UNREADABLE: "UNREADABLE",
    INACCESSIBLE: "INACCESSIBLE",
    NOT_APPLICABLE: "NOT_APPLICABLE",
    INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
    EXPECTED_NOT_YET_BUILT: "EXPECTED_NOT_YET_BUILT",
    EXPECTED_NOT_YET_WIRED: "EXPECTED_NOT_YET_WIRED",
    WAITING_CONTROL_FILE: "WAITING_CONTROL_FILE",
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
    "NORTH_SECONDARY_EVIDENCE_NOTES",

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
    "SOUTH_IMPLEMENTATION_CONTRACT",

    "CURRENT_EXPECTED_HTML_CONTRACT",
    "CURRENT_EXPECTED_INDEX_JS_CONTRACT",
    "CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
    "COMPAT_ROUTE_CONDUCTOR_CONTRACT",
    "PRIOR_ROUTE_CONDUCTOR_CONTRACT",
    "PRIMARY_ROUTE_CONDUCTOR_CONTRACT_RECOGNIZED",
    "ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5",
    "ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED",
    "ROUTE_CONDUCTOR_V9_6_PRIMARY_NOT_TREATED_AS_CASE_5",
    "ROUTE_CONDUCTOR_V9_6_COMPATIBILITY_ACCEPTED",
    "ROUTE_CONDUCTOR_V9_5_PRIMARY_NOT_TREATED_AS_CASE_5",
    "ROUTE_CONDUCTOR_V9_5_COMPATIBILITY_ACCEPTED",
    "ROUTE_CONDUCTOR_V9_5_LINEAGE_ACCEPTED",
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

  const NORTH_PLANETARY_LIFECYCLE_FIELDS = Object.freeze([
    "PLANETARY_CONTROL_SCHEMA_ACTIVE",
    "PLANETARY_CONTROL_SCHEMA_CONTRACT",
    "PLANETARY_CONTROL_SCHEMA_RECEIPT",
    "FRONTEND_PLANETARY_OBSERVER_BASIS_EXPECTED",
    "FRONTEND_PLANETARY_OBSERVER_STATUS",
    "PLANETARY_FUNCTION_DIAGNOSTIC_BASIS",
    "PLANETARY_BUILD_OBSERVER_STATUS",

    "CONTROL_FILE",
    "CONTROL_FILE_EXPECTED",
    "CONTROL_FILE_STATUS",
    "CONTROL_FILE_LOADED",
    "CONTROL_GLOBAL_PRESENT",
    "CONTROL_RECEIPT_PRESENT",
    "CONTROL_ABSENCE_IS_FAILURE",
    "CONTROL_ABSENCE_IS_CASE_5",
    "CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET",
    "CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH",

    "CONTROL_HANDSHAKE_EXPECTED",
    "CONTROL_HANDSHAKE_STATUS",
    "HEARTH_JS_CONTROL_FUNNEL_EXPECTED",
    "HEARTH_JS_CONTROL_FUNNEL_FILE",
    "HEARTH_JS_CONTROL_HANDSHAKE_STATUS",
    "HEARTH_JS_LOADS_OR_RECOGNIZES_CONTROL_FILE",

    "MOTION_TOUCH_EXPECTED",
    "MOTION_TOUCH_STATUS",
    "DRAG_STATUS",
    "VIEW_CONTROL_STATUS",
    "VISIBLE_PLANET_ALLOWED_WITHOUT_CONTROLS",
    "STATIC_PLANET_STATUS",
    "PLANETARY_CONTROL_NEXT_CONFORMING_FILE",
    "PLANETARY_CONTROL_NEXT_CONFORMING_ACTION"
  ]);

  const PLANETARY_CONTROL_REPORT_FIELDS = Object.freeze([
    "PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE",
    "PLANETARY_CONTROL_FOOTPRINT_STATUS",
    "PLANETARY_CONTROL_DIAGNOSTIC_STATUS",
    "PLANETARY_CONTROL_GATE_STATUS",

    "EXPECTED_CONTROL_FILE",
    "EXPECTED_CONTROL_CONTRACT",
    "CONTROL_FILE_PRESENT",
    "CONTROL_FILE_SRC",
    "CONTROL_FILE_CONTRACT",
    "CONTROL_FILE_RECEIPT",
    "CONTROL_FILE_AUTHORITY_SOURCE",

    "CONTROL_FILE_EXPECTED_NOT_YET_BUILT",
    "CONTROL_FILE_ABSENCE_EXPECTED",
    "CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5",
    "CONTROL_FILE_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET",

    "CONTROL_FILE_HANDSHAKE_STATUS",
    "CONTROL_FILE_HANDSHAKE_REQUIRED",
    "CONTROL_FILE_HANDSHAKE_TARGET",
    "CONTROL_FILE_HANDSHAKE_FUNNEL_OWNER",

    "JS_INTEGRATION_FUNNEL",
    "JS_INDEX_FILE",
    "JS_INDEX_CONTRACT",
    "JS_ROUTE_CONDUCTOR_FILE",
    "JS_ROUTE_CONDUCTOR_CONTRACT",
    "JS_CONTROL_FILE",
    "JS_CONTROL_CONTRACT",
    "JS_CANVAS_FILE",

    "ROUTE_CONDUCTOR_CONTROL_INTEGRATION_STATUS",
    "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REQUIRED",
    "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_TARGET",
    "ROUTE_CONDUCTOR_CONTROL_FUNNEL_OWNER",

    "PLANETARY_VIEW_CONTROL_STATUS",
    "PLANETARY_VIEW_TOUCH_STATUS",
    "PLANETARY_VIEW_DRAG_STATUS",
    "PLANETARY_VIEW_MOTION_STATUS",
    "PLANETARY_VIEW_ZOOM_STATUS",
    "PLANETARY_VIEW_INPUT_STATUS",

    "PLANETARY_FILES_TRACK_STATUS",
    "PLANETARY_FINGERS_TRACK_STATUS",
    "PLANETARY_CANVAS_TRACK_STATUS",
    "PLANETARY_VIEW_TRACK_STATUS",

    "PLANETARY_CONTROL_RECOMMENDED_NEXT_FILE",
    "PLANETARY_CONTROL_RECOMMENDED_NEXT_ACTION"
  ]);

  const RENDERED_PROOF_EXTENSION_FIELDS = Object.freeze([
    "NAMESPACE_RENDERED_PROOF_CANDIDATES_FOUND",
    "NAMESPACE_RENDERED_PROOF_CANDIDATE_PATHS",
    "NAMESPACE_RENDERED_PROOF_CANDIDATE_SELECTED",
    "NAMESPACE_RENDERED_PROOF_CANDIDATE_SCORE",

    "ROUTE_CONDUCTOR_AUTHORITY_SOURCE",
    "ROUTE_CONDUCTOR_CONTRACT",
    "ROUTE_CONDUCTOR_RECEIPT",
    "ROUTE_CONDUCTOR_V9_9_DETECTED",
    "ROUTE_CONDUCTOR_V9_6_DETECTED",
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

  const LAB_CANVAS_BRIDGE_FIELDS = Object.freeze([
    "LAB_BRIDGE_SCHEMA_ACTIVE",
    "LAB_BRIDGE_STATUS",
    "LAB_AUTHORITY_SOURCE",
    "LAB_TABLE_AUTHORITY_SOURCE",
    "LAB_TABLE_CONTRACT",
    "LAB_TABLE_RECEIPT",
    "LAB_TABLE_NEWS_STATUS",
    "LAB_TABLE_FIBONACCI_STATUS",
    "LAB_TABLE_CYCLE_STATUS",
    "LAB_TABLE_GATE_STATUS",

    "DIAGNOSTIC_LAB_MIRROR_STATUS",
    "DIAGNOSTIC_LAB_GAUGE_STATUS",
    "DIAGNOSTIC_GAUGE_BRIDGE_STATUS",
    "DIAGNOSTIC_GAUGE_AUTHORITY_SOURCE",

    "CANVAS_AUTHORITY_SOURCE",
    "CANVAS_AUTHORITY_CONTRACT",
    "CANVAS_AUTHORITY_RECEIPT",
    "CANVAS_AUTHORITY_BRIDGE_STATUS",
    "CANVAS_OUTPUT_CARRIER_STATUS",
    "CANVAS_HANDOFF_STATUS",
    "CANVAS_HANDOFF_TARGET",
    "CANVAS_HANDOFF_RECEIPT",

    "LAB_TO_CANVAS_BRIDGE_STATUS",
    "LAB_TO_CANVAS_SHARED_LANGUAGE_STATUS",
    "LAB_TO_CANVAS_TRANSLATION_STATUS",
    "LAB_CANVAS_AUTHORITY_BOUNDARY_STATUS",
    "LAB_CANVAS_BRIDGE_NOT_AUTHORITY",
    "LAB_CANVAS_BRIDGE_OUTPUT_ONLY"
  ]);

  const BISHOP_BRIDGE_FIELDS = Object.freeze([
    "BISHOP_BRIDGE_SCHEMA_ACTIVE",
    "BISHOP_BRIDGE_STATUS",
    "BISHOP_AUTHORITY_SOURCE",
    "BISHOP_LANE_STATUS",
    "BISHOP_LANE_COUNT",
    "BISHOP_LANE_EXPECTED_COUNT",
    "BISHOP_LANE_SHARED_LANGUAGE_STATUS",

    "BISHOP_NORTH_LANE_STATUS",
    "BISHOP_EAST_LANE_STATUS",
    "BISHOP_SOUTH_LANE_STATUS",
    "BISHOP_WEST_LANE_STATUS",

    "BISHOP_NORTH_AUTHORITY_SOURCE",
    "BISHOP_EAST_AUTHORITY_SOURCE",
    "BISHOP_SOUTH_AUTHORITY_SOURCE",
    "BISHOP_WEST_AUTHORITY_SOURCE",

    "BISHOP_NORTH_RECEIPT_STATUS",
    "BISHOP_EAST_RECEIPT_STATUS",
    "BISHOP_SOUTH_RECEIPT_STATUS",
    "BISHOP_WEST_RECEIPT_STATUS",

    "BISHOP_SUBJECT_FILE_INDEX_STATUS",
    "BISHOP_CHILD_FILE_INDEX_STATUS",
    "BISHOP_READS_SUBJECT_FILES",
    "BISHOP_READS_CHILD_FILES",
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
    "CANVAS_HANDOFF_NORTH_SOURCE",
    "CANVAS_HANDOFF_EAST_SOURCE",
    "CANVAS_HANDOFF_SOUTH_SOURCE",
    "CANVAS_HANDOFF_WEST_SOURCE",
    "CANVAS_HANDOFF_AGGREGATE_STATUS",
    "SECOND_CYCLE_CANVAS_HANDOFF_PRESERVED",
    "TWO_CYCLE_PREMISE_PRESERVED",
    "CYCLE_1_ROUTE_STATUS",
    "CYCLE_2_ROUTE_STATUS",
    "CYCLE_2_CANVAS_HANDOFF_STATUS"
  ]);

  const BISHOP_QUEEN_CANVAS_REPORT_FIELDS = Object.freeze([
    "BISHOP_QUEEN_CANVAS_SCHEMA_ACTIVE",
    "BISHOP_QUEEN_CANVAS_RECOGNITION_STATUS",
    "BISHOP_QUEEN_CANVAS_FUNNEL_STATUS",
    "BISHOP_QUEEN_CANVAS_AUTHORITY_SOURCE",

    "QUEEN_HANDSHAKE_STATUS",
    "QUEEN_HANDSHAKE_ACCEPTED",
    "QUEEN_VISIBLE_GLOBE_PROOF_READY",
    "QUEEN_CANVAS_RECOGNITION_STATUS",

    "BISHOP_AUTHORITY_STATUS",
    "BISHOP_POINTER_FINGER_LANGUAGE_ACTIVE",
    "BISHOP_POINTER_FINGER_AUTHORITY_STATUS",
    "BISHOP_CHILD_FILE_KNOWLEDGE_BOUNDARY",
    "BISHOP_HUBS_OPAQUE_TO_DIAGNOSTIC",

    "CANVAS_RECEIVER_BISHOP_AUTHORITY_STATUS",
    "CANVAS_RECEIVER_VISIBLE_PROOF_STATUS",
    "CANVAS_RECEIVER_RECOGNITION_FUNNEL_STATUS",

    "ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5",
    "ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED",
    "ROUTE_CONDUCTOR_V9_6_COMPATIBILITY_ACCEPTED",
    "ROUTE_CONDUCTOR_V9_5_LINEAGE_ACCEPTED",
    "ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED"
  ]);

  const SOUTH_SCHEMA_FIELDS = Object.freeze([
    "SOUTH_IMPLEMENTATION_CONTRACT",
    "SOUTH_IMPLEMENTATION_RECEIPT",
    "SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT",
    "SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT",
    "SOUTH_BASELINE_IMPLEMENTATION_CONTRACT",
    "SOUTH_ANCHOR_NORTH_CONTRACT",
    "SOUTH_ANCHOR_NORTH_RECEIPT",
    "SOUTH_PREVIOUS_ANCHOR_NORTH_CONTRACT",
    "SOUTH_PREVIOUS_ANCHOR_NORTH_RECEIPT",
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
    ...NORTH_PLANETARY_LIFECYCLE_FIELDS,
    ...PLANETARY_CONTROL_REPORT_FIELDS,
    ...RENDERED_PROOF_EXTENSION_FIELDS,
    ...LAB_CANVAS_BRIDGE_FIELDS,
    ...BISHOP_BRIDGE_FIELDS,
    ...FOUR_WAY_CANVAS_HANDOFF_FIELDS,
    ...BISHOP_QUEEN_CANVAS_REPORT_FIELDS,
    ...SOUTH_SCHEMA_FIELDS,
    ...NO_CLAIM_FIELDS,
    ...UPPER_NO_CLAIM_FIELDS
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
        return bounded(JSON.stringify(value), 16000) || fallback;
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

  function isKnown(value) {
    return !(
      value === undefined ||
      value === null ||
      value === "" ||
      value === FALLBACK.UNKNOWN ||
      value === FALLBACK.NOT_FOUND ||
      value === FALLBACK.UNREADABLE ||
      value === FALLBACK.INACCESSIBLE
    );
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function boolText(value) {
    return value ? "true" : "false";
  }

  function textIsTrue(value) {
    return value === true || value === "true" || value === "TRUE" || value === 1 || value === "1";
  }

  function textIsFalse(value) {
    return value === false || value === "false" || value === "FALSE" || value === 0 || value === "0";
  }

  function addOutputNote(state, note) {
    const clean = bounded(note, 1400);
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
      return value.map((entry) => bounded(entry, 1200)).filter(Boolean);
    }

    return safeString(value)
      .split("|")
      .map((entry) => bounded(entry, 1200))
      .filter(Boolean)
      .filter((entry) => entry !== FALLBACK.NONE);
  }

  function suppressImportedNote(entry) {
    const text = safeString(entry);
    return (
      text.startsWith("NEWS_ALIGNMENT_FIRST_FAILED_STAGE:") ||
      text.startsWith("FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE:")
    );
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

    const verdict =
      getRawValue(input, "NORTH_VERDICT", null) ||
      (options && isObject(options.northVerdict) ? options.northVerdict : null);

    if (isObject(verdict) && Array.isArray(verdict.notes)) {
      sources.push(verdict.notes);
    }

    for (const source of sources) {
      for (const entry of normalizeNoteInput(source)) {
        if (suppressImportedNote(entry)) continue;

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

  function notesContain(report, phrase) {
    const text = [
      getValue(report, "SECONDARY_EVIDENCE_NOTES", ""),
      getValue(report, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(report, "EAST_SECONDARY_EVIDENCE_NOTES", ""),
      getValue(report, "WEST_SECONDARY_EVIDENCE_NOTES", "")
    ].join(" | ");

    return text.includes(phrase);
  }

  function inferBooleanText(report, field, trueNotes, falseNotes, fallback = FALLBACK.UNKNOWN) {
    const explicit = getValue(report, field, "");
    if (textIsTrue(explicit)) return "true";
    if (textIsFalse(explicit)) return "false";

    for (const note of trueNotes || []) {
      if (notesContain(report, note)) return "true";
    }

    for (const note of falseNotes || []) {
      if (notesContain(report, note)) return "false";
    }

    return fallback;
  }

  function makeState() {
    return {
      southStatus: STATUS.READY,
      southContract: CONTRACT,
      southReceipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
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

  function controlPresentFromReport(report) {
    const present = getValue(report, "CONTROL_FILE_PRESENT", "");
    if (textIsTrue(present)) return "true";
    if (textIsFalse(present)) return "false";

    const loaded = getValue(report, "CONTROL_FILE_LOADED", "");
    const global = getValue(report, "CONTROL_GLOBAL_PRESENT", "");
    const receipt = getValue(report, "CONTROL_RECEIPT_PRESENT", "");
    const status = getValue(report, "CONTROL_FILE_STATUS", "");

    if (textIsTrue(loaded) || textIsTrue(global) || textIsTrue(receipt)) return "true";

    if (
      status === FALLBACK.EXPECTED_NOT_YET_BUILT ||
      status === "EXPECTED_NOT_YET_BUILT" ||
      status === FALLBACK.WAITING_CONTROL_FILE ||
      notesContain(report, "NORTH_CONTROL_ABSENCE_ADMITTED_AS_EXPECTED_NOT_YET_BUILT") ||
      notesContain(report, "EAST_CONTROL_FILE_EXPECTED_NOT_YET_BUILT")
    ) {
      return "false";
    }

    return FALLBACK.UNKNOWN;
  }

  function projectPlanetaryControlFields(report, state) {
    const northSchemaActive = inferBooleanText(
      report,
      "PLANETARY_CONTROL_SCHEMA_ACTIVE",
      ["NORTH_PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE"],
      [],
      "true"
    );

    const controlStatus = getValue(report, "CONTROL_FILE_STATUS", FALLBACK.UNKNOWN);

    const controlExpectedNotYetBuilt = inferBooleanText(
      report,
      "CONTROL_FILE_EXPECTED_NOT_YET_BUILT",
      [
        "NORTH_CONTROL_ABSENCE_ADMITTED_AS_EXPECTED_NOT_YET_BUILT",
        "EAST_CONTROL_FILE_EXPECTED_NOT_YET_BUILT"
      ],
      [],
      controlStatus === FALLBACK.EXPECTED_NOT_YET_BUILT ? "true" : FALLBACK.UNKNOWN
    );

    const controlAbsenceExpected = inferBooleanText(
      report,
      "CONTROL_FILE_ABSENCE_EXPECTED",
      [
        "NORTH_CONTROL_ABSENCE_ADMITTED_AS_EXPECTED_NOT_YET_BUILT",
        "EAST_CONTROL_FILE_EXPECTED_NOT_YET_BUILT"
      ],
      [],
      controlExpectedNotYetBuilt
    );

    const controlAbsenceNotCase5 = inferBooleanText(
      report,
      "CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5",
      [
        "NORTH_CONTROL_ABSENCE_NOT_TREATED_AS_CASE_5",
        "EAST_CONTROL_ABSENCE_NOT_TREATED_AS_CASE_5"
      ],
      [],
      textIsFalse(getValue(report, "CONTROL_ABSENCE_IS_CASE_5", "")) ? "true" : FALLBACK.UNKNOWN
    );

    const controlBlocksMotionTouchNotVisible = inferBooleanText(
      report,
      "CONTROL_FILE_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET",
      [
        "NORTH_CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET",
        "EAST_CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET"
      ],
      [],
      textIsTrue(getValue(report, "CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH", "")) &&
      textIsFalse(getValue(report, "CONTROL_ABSENCE_BLOCKS_VISIBLE_PLANET", ""))
        ? "true"
        : FALLBACK.UNKNOWN
    );

    const controlFilePresent = controlPresentFromReport(report);

    report.PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE = getValue(
      report,
      "PLANETARY_CONTROL_LIFECYCLE_SCHEMA_ACTIVE",
      northSchemaActive
    );

    report.PLANETARY_CONTROL_SCHEMA_ACTIVE = getValue(
      report,
      "PLANETARY_CONTROL_SCHEMA_ACTIVE",
      northSchemaActive
    );

    report.PLANETARY_CONTROL_SCHEMA_CONTRACT = getValue(
      report,
      "PLANETARY_CONTROL_SCHEMA_CONTRACT",
      NORTH_ANCHOR_CONTRACT
    );

    report.PLANETARY_CONTROL_SCHEMA_RECEIPT = getValue(
      report,
      "PLANETARY_CONTROL_SCHEMA_RECEIPT",
      NORTH_ANCHOR_RECEIPT
    );

    report.PLANETARY_CONTROL_FOOTPRINT_STATUS = getValue(
      report,
      "PLANETARY_CONTROL_FOOTPRINT_STATUS",
      controlExpectedNotYetBuilt === "true"
        ? "FOOTPRINT_ESTABLISHED_EXPECTED_NOT_BUILT"
        : FALLBACK.UNKNOWN
    );

    report.PLANETARY_CONTROL_DIAGNOSTIC_STATUS = getValue(
      report,
      "PLANETARY_CONTROL_DIAGNOSTIC_STATUS",
      controlExpectedNotYetBuilt === "true"
        ? "CONTROL_DIAGNOSTIC_FOOTPRINT_ACTIVE"
        : FALLBACK.UNKNOWN
    );

    report.PLANETARY_CONTROL_GATE_STATUS = getValue(
      report,
      "PLANETARY_CONTROL_GATE_STATUS",
      controlExpectedNotYetBuilt === "true"
        ? "CONTROL_GATE_EXPECTED_WAITING_HANDSHAKE"
        : FALLBACK.UNKNOWN
    );

    report.EXPECTED_CONTROL_FILE = getValue(report, "EXPECTED_CONTROL_FILE", EXPECTED_CONTROL_FILE);
    report.EXPECTED_CONTROL_CONTRACT = getValue(report, "EXPECTED_CONTROL_CONTRACT", EXPECTED_CONTROL_CONTRACT);
    report.CONTROL_FILE = getValue(report, "CONTROL_FILE", EXPECTED_CONTROL_FILE);
    report.CONTROL_FILE_EXPECTED = getValue(report, "CONTROL_FILE_EXPECTED", "true");
    report.CONTROL_FILE_PRESENT = controlFilePresent;

    report.CONTROL_FILE_SRC = getValue(
      report,
      "CONTROL_FILE_SRC",
      controlFilePresent === "false" ? FALLBACK.NOT_FOUND : FALLBACK.UNKNOWN
    );

    report.CONTROL_FILE_CONTRACT = getValue(
      report,
      "CONTROL_FILE_CONTRACT",
      controlFilePresent === "false" ? FALLBACK.EXPECTED_NOT_YET_BUILT : FALLBACK.UNKNOWN
    );

    report.CONTROL_FILE_RECEIPT = getValue(
      report,
      "CONTROL_FILE_RECEIPT",
      controlFilePresent === "false" ? FALLBACK.EXPECTED_NOT_YET_BUILT : FALLBACK.UNKNOWN
    );

    report.CONTROL_FILE_AUTHORITY_SOURCE = getValue(
      report,
      "CONTROL_FILE_AUTHORITY_SOURCE",
      controlFilePresent === "false" ? FALLBACK.NOT_FOUND : FALLBACK.UNKNOWN
    );

    report.CONTROL_FILE_EXPECTED_NOT_YET_BUILT = controlExpectedNotYetBuilt;
    report.CONTROL_FILE_ABSENCE_EXPECTED = controlAbsenceExpected;
    report.CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5 = controlAbsenceNotCase5;
    report.CONTROL_FILE_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET = controlBlocksMotionTouchNotVisible;

    report.CONTROL_FILE_HANDSHAKE_STATUS = getValue(
      report,
      "CONTROL_FILE_HANDSHAKE_STATUS",
      getValue(report, "CONTROL_HANDSHAKE_STATUS",
        controlFilePresent === "false" ? FALLBACK.WAITING_CONTROL_FILE : FALLBACK.UNKNOWN
      )
    );

    report.CONTROL_FILE_HANDSHAKE_REQUIRED = getValue(
      report,
      "CONTROL_FILE_HANDSHAKE_REQUIRED",
      getValue(report, "CONTROL_HANDSHAKE_EXPECTED", "true")
    );

    report.CONTROL_FILE_HANDSHAKE_TARGET = getValue(
      report,
      "CONTROL_FILE_HANDSHAKE_TARGET",
      EXPECTED_ROUTE_CONDUCTOR_FILE
    );

    report.CONTROL_FILE_HANDSHAKE_FUNNEL_OWNER = getValue(
      report,
      "CONTROL_FILE_HANDSHAKE_FUNNEL_OWNER",
      CONTROL_FUNNEL_OWNER
    );

    report.JS_INTEGRATION_FUNNEL = getValue(report, "JS_INTEGRATION_FUNNEL", JS_INTEGRATION_FUNNEL);
    report.JS_INDEX_FILE = getValue(report, "JS_INDEX_FILE", EXPECTED_INDEX_FILE);
    report.JS_INDEX_CONTRACT = getValue(report, "JS_INDEX_CONTRACT", EXPECTED_INDEX_CONTRACT);
    report.JS_ROUTE_CONDUCTOR_FILE = getValue(report, "JS_ROUTE_CONDUCTOR_FILE", EXPECTED_ROUTE_CONDUCTOR_FILE);
    report.JS_ROUTE_CONDUCTOR_CONTRACT = getValue(
      report,
      "JS_ROUTE_CONDUCTOR_CONTRACT",
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT
    );
    report.JS_CONTROL_FILE = getValue(report, "JS_CONTROL_FILE", EXPECTED_CONTROL_FILE);
    report.JS_CONTROL_CONTRACT = getValue(report, "JS_CONTROL_CONTRACT", EXPECTED_CONTROL_CONTRACT);
    report.JS_CANVAS_FILE = getValue(report, "JS_CANVAS_FILE", EXPECTED_CANVAS_FILE);

    report.ROUTE_CONDUCTOR_CONTROL_INTEGRATION_STATUS = getValue(
      report,
      "ROUTE_CONDUCTOR_CONTROL_INTEGRATION_STATUS",
      getValue(report, "HEARTH_JS_CONTROL_HANDSHAKE_STATUS",
        controlFilePresent === "false" ? "ROUTE_CONDUCTOR_WAITING_CONTROL_HANDSHAKE" : FALLBACK.UNKNOWN
      )
    );

    report.ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REQUIRED = getValue(
      report,
      "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_REQUIRED",
      "true"
    );

    report.ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_TARGET = getValue(
      report,
      "ROUTE_CONDUCTOR_CONTROL_HANDSHAKE_TARGET",
      EXPECTED_CONTROL_FILE
    );

    report.ROUTE_CONDUCTOR_CONTROL_FUNNEL_OWNER = getValue(
      report,
      "ROUTE_CONDUCTOR_CONTROL_FUNNEL_OWNER",
      CONTROL_FUNNEL_OWNER
    );

    report.PLANETARY_VIEW_CONTROL_STATUS = getValue(
      report,
      "PLANETARY_VIEW_CONTROL_STATUS",
      getValue(report, "VIEW_CONTROL_STATUS",
        controlFilePresent === "false" ? FALLBACK.WAITING_CONTROL_FILE : FALLBACK.UNKNOWN
      )
    );

    report.PLANETARY_VIEW_TOUCH_STATUS = getValue(
      report,
      "PLANETARY_VIEW_TOUCH_STATUS",
      controlFilePresent === "false"
        ? "BLOCKED_BY_EXPECTED_CONTROL_ABSENCE"
        : FALLBACK.UNKNOWN
    );

    report.PLANETARY_VIEW_DRAG_STATUS = getValue(
      report,
      "PLANETARY_VIEW_DRAG_STATUS",
      getValue(report, "DRAG_STATUS",
        controlFilePresent === "false" ? "BLOCKED_BY_EXPECTED_CONTROL_ABSENCE" : FALLBACK.UNKNOWN
      )
    );

    report.PLANETARY_VIEW_MOTION_STATUS = getValue(
      report,
      "PLANETARY_VIEW_MOTION_STATUS",
      getValue(report, "MOTION_TOUCH_STATUS",
        controlFilePresent === "false" ? "BLOCKED_BY_EXPECTED_CONTROL_ABSENCE" : FALLBACK.UNKNOWN
      )
    );

    report.PLANETARY_VIEW_ZOOM_STATUS = getValue(
      report,
      "PLANETARY_VIEW_ZOOM_STATUS",
      controlFilePresent === "false" ? FALLBACK.WAITING_CONTROL_FILE : FALLBACK.UNKNOWN
    );

    report.PLANETARY_VIEW_INPUT_STATUS = getValue(
      report,
      "PLANETARY_VIEW_INPUT_STATUS",
      controlFilePresent === "false" ? FALLBACK.WAITING_CONTROL_FILE : FALLBACK.UNKNOWN
    );

    report.PLANETARY_FILES_TRACK_STATUS = getValue(
      report,
      "PLANETARY_FILES_TRACK_STATUS",
      "TRACK_READY_FOR_PLANETARY_FILE_FOOTPRINTS"
    );

    report.PLANETARY_FINGERS_TRACK_STATUS = getValue(
      report,
      "PLANETARY_FINGERS_TRACK_STATUS",
      "TRACK_READY_FOR_FINGER_FILE_FOOTPRINTS"
    );

    report.PLANETARY_CANVAS_TRACK_STATUS = getValue(
      report,
      "PLANETARY_CANVAS_TRACK_STATUS",
      "TRACK_READY_FOR_CANVAS_FOOTPRINTS"
    );

    report.PLANETARY_VIEW_TRACK_STATUS = getValue(
      report,
      "PLANETARY_VIEW_TRACK_STATUS",
      controlFilePresent === "false" ? "VISIBLE_PLANET_PRESENT_VIEW_CONTROLS_WAITING" : FALLBACK.UNKNOWN
    );

    report.PLANETARY_CONTROL_RECOMMENDED_NEXT_FILE = getValue(
      report,
      "PLANETARY_CONTROL_RECOMMENDED_NEXT_FILE",
      getValue(report, "PLANETARY_CONTROL_NEXT_CONFORMING_FILE", EXPECTED_CONTROL_FILE)
    );

    report.PLANETARY_CONTROL_RECOMMENDED_NEXT_ACTION = getValue(
      report,
      "PLANETARY_CONTROL_RECOMMENDED_NEXT_ACTION",
      getValue(
        report,
        "PLANETARY_CONTROL_NEXT_CONFORMING_ACTION",
        "BUILD_CONTROL_FILE_HANDSHAKE_AFTER_DIAGNOSTIC_TRACK_FORMALIZES_CONTROL_FOOTPRINT"
      )
    );

    if (controlExpectedNotYetBuilt === "true") {
      addOutputNote(state, "SOUTH_FORMALIZED_PLANETARY_CONTROL_FOOTPRINT_FIELDS");
    }

    if (controlAbsenceNotCase5 === "true") {
      addOutputNote(state, "SOUTH_CONFIRMED_CONTROL_ABSENCE_NOT_CASE_5");
    }

    if (controlBlocksMotionTouchNotVisible === "true") {
      addOutputNote(state, "SOUTH_CONFIRMED_CONTROL_ABSENCE_BLOCKS_MOTION_TOUCH_NOT_VISIBLE_PLANET");
    }
  }

  function projectLabCanvasBridgeFields(report, state) {
    report.LAB_BRIDGE_SCHEMA_ACTIVE = getValue(report, "LAB_BRIDGE_SCHEMA_ACTIVE", "true");
    report.LAB_BRIDGE_STATUS = getValue(report, "LAB_BRIDGE_STATUS", "REPORT_OUTPUT_ONLY");
    report.DIAGNOSTIC_LAB_MIRROR_STATUS = getValue(
      report,
      "DIAGNOSTIC_LAB_MIRROR_STATUS",
      "DIAGNOSTIC_REPORT_MIRRORS_LAB_CANVAS_BRIDGE_LANGUAGE"
    );

    report.LAB_TO_CANVAS_SHARED_LANGUAGE_STATUS = getValue(
      report,
      "LAB_TO_CANVAS_SHARED_LANGUAGE_STATUS",
      "SHARED_LANGUAGE_PRESERVED_AS_REPORT_FIELDS"
    );

    report.LAB_CANVAS_AUTHORITY_BOUNDARY_STATUS = getValue(
      report,
      "LAB_CANVAS_AUTHORITY_BOUNDARY_STATUS",
      "SOUTH_REPORTS_ONLY_DOES_NOT_AUTHORIZE_LAB_OR_CANVAS"
    );

    report.LAB_CANVAS_BRIDGE_NOT_AUTHORITY = getValue(
      report,
      "LAB_CANVAS_BRIDGE_NOT_AUTHORITY",
      "true"
    );

    report.LAB_CANVAS_BRIDGE_OUTPUT_ONLY = getValue(
      report,
      "LAB_CANVAS_BRIDGE_OUTPUT_ONLY",
      "true"
    );

    report.BISHOP_BRIDGE_SCHEMA_ACTIVE = getValue(report, "BISHOP_BRIDGE_SCHEMA_ACTIVE", "true");
    report.BISHOP_BRIDGE_STATUS = getValue(
      report,
      "BISHOP_BRIDGE_STATUS",
      "REPORT_OUTPUT_ONLY"
    );

    report.BISHOP_LANE_EXPECTED_COUNT = getValue(report, "BISHOP_LANE_EXPECTED_COUNT", "4");
    report.WEST_TRUSTS_BISHOP_HUBS_ONLY = getValue(
      report,
      "WEST_TRUSTS_BISHOP_HUBS_ONLY",
      "true"
    );

    report.BISHOP_WEST_AUTHORITY_BOUNDARY_PRESERVED = getValue(
      report,
      "BISHOP_WEST_AUTHORITY_BOUNDARY_PRESERVED",
      "true"
    );

    report.FOUR_WAY_CANVAS_HANDOFF_SCHEMA_ACTIVE = getValue(
      report,
      "FOUR_WAY_CANVAS_HANDOFF_SCHEMA_ACTIVE",
      "true"
    );

    report.TWO_CYCLE_PREMISE_PRESERVED = getValue(
      report,
      "TWO_CYCLE_PREMISE_PRESERVED",
      "true"
    );

    report.SECOND_CYCLE_CANVAS_HANDOFF_PRESERVED = getValue(
      report,
      "SECOND_CYCLE_CANVAS_HANDOFF_PRESERVED",
      "true"
    );

    report.FOUR_WAY_CANVAS_HANDOFF_STATUS = getValue(
      report,
      "FOUR_WAY_CANVAS_HANDOFF_STATUS",
      getValue(report, "CANVAS_HANDOFF_STATUS", "REPORT_OUTPUT_WAITING_WEST_OR_NORTH_EVIDENCE")
    );

    addOutputNote(state, "SOUTH_PRESERVED_LAB_CANVAS_BRIDGE_REPORT_LANGUAGE");
    addOutputNote(state, "SOUTH_PRESERVED_BISHOP_BRIDGE_REPORT_LANGUAGE");
    addOutputNote(state, "SOUTH_PRESERVED_TWO_CYCLE_AND_FOUR_WAY_CANVAS_HANDOFF_FIELDS");
  }

  function projectBishopQueenCanvasFields(report, state) {
    const servedRoute = getValue(report, "SERVED_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);
    const renderedRoute = getValue(report, "ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);

    const v99Recognized =
      servedRoute === EXPECTED_ROUTE_CONDUCTOR_CONTRACT ||
      renderedRoute === EXPECTED_ROUTE_CONDUCTOR_CONTRACT ||
      notesContain(report, "ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNIZED") ||
      notesContain(report, "VISIBLE_GLOBE_PROOF_READY_QUEEN_HANDSHAKE_ACCEPTED") ||
      notesContain(report, "WAITING_CARDINAL_WEST_BISHOP_AUTHORITY") ||
      notesContain(report, "WAITING_CANVAS_RECEIVER_BISHOP_AUTHORITY_OR_VISIBLE_PROOF");

    const queenAccepted =
      notesContain(report, "VISIBLE_GLOBE_PROOF_READY_QUEEN_HANDSHAKE_ACCEPTED") ||
      getValue(report, "QUEEN_HANDSHAKE_ACCEPTED", FALLBACK.UNKNOWN) === "true";

    report.BISHOP_QUEEN_CANVAS_SCHEMA_ACTIVE = getValue(
      report,
      "BISHOP_QUEEN_CANVAS_SCHEMA_ACTIVE",
      "true"
    );

    report.BISHOP_QUEEN_CANVAS_RECOGNITION_STATUS = getValue(
      report,
      "BISHOP_QUEEN_CANVAS_RECOGNITION_STATUS",
      v99Recognized ? "RECOGNIZED" : FALLBACK.UNKNOWN
    );

    report.BISHOP_QUEEN_CANVAS_FUNNEL_STATUS = getValue(
      report,
      "BISHOP_QUEEN_CANVAS_FUNNEL_STATUS",
      v99Recognized ? "FUNNEL_RECOGNIZED" : FALLBACK.UNKNOWN
    );

    report.BISHOP_QUEEN_CANVAS_AUTHORITY_SOURCE = getValue(
      report,
      "BISHOP_QUEEN_CANVAS_AUTHORITY_SOURCE",
      v99Recognized ? EXPECTED_ROUTE_CONDUCTOR_FILE : FALLBACK.UNKNOWN
    );

    report.QUEEN_HANDSHAKE_STATUS = getValue(
      report,
      "QUEEN_HANDSHAKE_STATUS",
      queenAccepted ? "QUEEN_HANDSHAKE_ACCEPTED" : FALLBACK.UNKNOWN
    );

    report.QUEEN_HANDSHAKE_ACCEPTED = getValue(
      report,
      "QUEEN_HANDSHAKE_ACCEPTED",
      queenAccepted ? "true" : FALLBACK.UNKNOWN
    );

    report.QUEEN_VISIBLE_GLOBE_PROOF_READY = getValue(
      report,
      "QUEEN_VISIBLE_GLOBE_PROOF_READY",
      getValue(report, "VISIBLE_PLANET_PROOF_READY", FALLBACK.UNKNOWN)
    );

    report.QUEEN_CANVAS_RECOGNITION_STATUS = getValue(
      report,
      "QUEEN_CANVAS_RECOGNITION_STATUS",
      v99Recognized ? "QUEEN_RECOGNIZES_CANVAS_RECEIVER" : FALLBACK.UNKNOWN
    );

    report.BISHOP_AUTHORITY_STATUS = getValue(
      report,
      "BISHOP_AUTHORITY_STATUS",
      notesContain(report, "WAITING_CARDINAL_WEST_BISHOP_AUTHORITY")
        ? "WAITING_CARDINAL_WEST_BISHOP_AUTHORITY"
        : FALLBACK.UNKNOWN
    );

    report.BISHOP_POINTER_FINGER_LANGUAGE_ACTIVE = getValue(
      report,
      "BISHOP_POINTER_FINGER_LANGUAGE_ACTIVE",
      "true"
    );

    report.BISHOP_POINTER_FINGER_AUTHORITY_STATUS = getValue(
      report,
      "BISHOP_POINTER_FINGER_AUTHORITY_STATUS",
      "BISHOP_STATUS_ADMITTED_AS_POINTER_FINGER_LANGUAGE"
    );

    report.BISHOP_CHILD_FILE_KNOWLEDGE_BOUNDARY = getValue(
      report,
      "BISHOP_CHILD_FILE_KNOWLEDGE_BOUNDARY",
      "OWNED_BY_BISHOPS_NOT_DIAGNOSTIC_SOUTH"
    );

    report.BISHOP_HUBS_OPAQUE_TO_DIAGNOSTIC = getValue(
      report,
      "BISHOP_HUBS_OPAQUE_TO_DIAGNOSTIC",
      "true"
    );

    report.CANVAS_RECEIVER_BISHOP_AUTHORITY_STATUS = getValue(
      report,
      "CANVAS_RECEIVER_BISHOP_AUTHORITY_STATUS",
      notesContain(report, "WAITING_CANVAS_RECEIVER_BISHOP_AUTHORITY_OR_VISIBLE_PROOF")
        ? "WAITING_CANVAS_RECEIVER_BISHOP_AUTHORITY_OR_VISIBLE_PROOF"
        : FALLBACK.UNKNOWN
    );

    report.CANVAS_RECEIVER_VISIBLE_PROOF_STATUS = getValue(
      report,
      "CANVAS_RECEIVER_VISIBLE_PROOF_STATUS",
      getValue(report, "VISIBLE_PLANET_PROOF_READY", FALLBACK.UNKNOWN)
    );

    report.CANVAS_RECEIVER_RECOGNITION_FUNNEL_STATUS = getValue(
      report,
      "CANVAS_RECEIVER_RECOGNITION_FUNNEL_STATUS",
      v99Recognized ? "CANVAS_RECEIVER_FUNNEL_RECOGNIZED" : FALLBACK.UNKNOWN
    );

    report.ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5 = getValue(
      report,
      "ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5",
      v99Recognized ? "true" : FALLBACK.UNKNOWN
    );

    report.ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED = getValue(
      report,
      "ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED",
      v99Recognized ? "true" : FALLBACK.UNKNOWN
    );

    report.ROUTE_CONDUCTOR_V9_6_COMPATIBILITY_ACCEPTED = getValue(
      report,
      "ROUTE_CONDUCTOR_V9_6_COMPATIBILITY_ACCEPTED",
      servedRoute === COMPAT_ROUTE_CONDUCTOR_CONTRACT ||
      renderedRoute === COMPAT_ROUTE_CONDUCTOR_CONTRACT
        ? "true"
        : FALLBACK.UNKNOWN
    );

    report.ROUTE_CONDUCTOR_V9_5_LINEAGE_ACCEPTED = getValue(
      report,
      "ROUTE_CONDUCTOR_V9_5_LINEAGE_ACCEPTED",
      servedRoute === LINEAGE_ROUTE_CONDUCTOR_CONTRACT ||
      renderedRoute === LINEAGE_ROUTE_CONDUCTOR_CONTRACT
        ? "true"
        : FALLBACK.UNKNOWN
    );

    report.ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED = getValue(
      report,
      "ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED",
      servedRoute === PRIOR_ROUTE_CONDUCTOR_CONTRACT ||
      renderedRoute === PRIOR_ROUTE_CONDUCTOR_CONTRACT
        ? "true"
        : getValue(report, "ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED", FALLBACK.UNKNOWN)
    );

    addOutputNote(state, "SOUTH_PRESERVED_BISHOP_QUEEN_CANVAS_REPORT_LANGUAGE");
  }

  function preserveNewsFibonacciFields(report, source) {
    const newsFields = [
      "NEWS_ALIGNMENT_PROTOCOL",
      "NEWS_ALIGNMENT_STATUS",
      "NEWS_ALIGNMENT_SCORE",
      "NEWS_ALIGNMENT_FIRST_FAILED_STAGE"
    ];

    const fibFields = [
      "FIBONACCI_SYNCHRONIZATION_PROTOCOL",
      "FIBONACCI_SYNCHRONIZATION_STATUS",
      "FIBONACCI_SYNCHRONIZATION_SCORE",
      "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE"
    ];

    for (const field of [...newsFields, ...fibFields]) {
      const incoming = getValue(source, field, FALLBACK.UNKNOWN);

      if (isKnown(incoming)) {
        report[field] = incoming;
      }
    }

    report.NEWS_ALIGNMENT_PROTOCOL = getValue(
      report,
      "NEWS_ALIGNMENT_PROTOCOL",
      "NORTH_START -> LAB_AUTHORITY_READ -> EAST_SOURCE -> WEST_RENDERED -> MACRO_WEST_BRIDGE_READ -> CANVAS_LOCAL_STATION_READ -> NORTH_ADJUDICATION -> SOUTH_OUTPUT -> NORTH_VERIFY"
    );

    report.NEWS_ALIGNMENT_STATUS = getValue(
      report,
      "NEWS_ALIGNMENT_STATUS",
      FALLBACK.UNKNOWN
    );

    report.NEWS_ALIGNMENT_SCORE = getValue(
      report,
      "NEWS_ALIGNMENT_SCORE",
      FALLBACK.UNKNOWN
    );

    report.NEWS_ALIGNMENT_FIRST_FAILED_STAGE = getValue(
      report,
      "NEWS_ALIGNMENT_FIRST_FAILED_STAGE",
      FALLBACK.UNKNOWN
    );

    report.FIBONACCI_SYNCHRONIZATION_PROTOCOL = getValue(
      report,
      "FIBONACCI_SYNCHRONIZATION_PROTOCOL",
      "F1 target context -> F2 child validation -> F3 EAST source evidence -> F5 WEST rendered evidence -> F8 NORTH adjudication -> F13 SOUTH packet output and Macro West bridge visibility -> F21 no-claim receiver boundary"
    );

    report.FIBONACCI_SYNCHRONIZATION_STATUS = getValue(
      report,
      "FIBONACCI_SYNCHRONIZATION_STATUS",
      FALLBACK.UNKNOWN
    );

    report.FIBONACCI_SYNCHRONIZATION_SCORE = getValue(
      report,
      "FIBONACCI_SYNCHRONIZATION_SCORE",
      FALLBACK.UNKNOWN
    );

    report.FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE = getValue(
      report,
      "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE",
      FALLBACK.UNKNOWN
    );
  }

  function updateNorthVerdictProjection(report, options, meaningPreserved) {
    const incomingVerdict =
      getRawValue(report, "NORTH_VERDICT", null) ||
      (options && isObject(options.northVerdict) ? options.northVerdict : null);

    const verdict = isObject(incomingVerdict) ? clonePlain(incomingVerdict) : {};

    verdict.schema = verdict.schema || "HEARTH_DIAGNOSTIC_NORTH_LAB_CANVAS_BISHOP_QUEEN_VERDICT_SCHEMA_v5";
    verdict.northContract = verdict.northContract || getValue(report, "NORTH_CONTRACT", NORTH_ANCHOR_CONTRACT);
    verdict.northReceipt = verdict.northReceipt || getValue(report, "NORTH_RECEIPT", NORTH_ANCHOR_RECEIPT);
    verdict.previousNorthContract = verdict.previousNorthContract || getValue(report, "PREVIOUS_NORTH_CONTRACT", PREVIOUS_NORTH_ANCHOR_CONTRACT);
    verdict.targetRoute = verdict.targetRoute || getValue(report, "TARGET_ROUTE", TARGET_ROUTE);
    verdict.diagnosticRoute = verdict.diagnosticRoute || getValue(report, "DIAGNOSTIC_ROUTE", DIAGNOSTIC_ROUTE);
    verdict.diagnosticTimestamp = verdict.diagnosticTimestamp || getValue(report, "DIAGNOSTIC_TIMESTAMP", nowIso());

    verdict.primaryCase = verdict.primaryCase || getValue(report, "PRIMARY_CASE", FALLBACK.UNKNOWN);
    verdict.calibrationStatus = verdict.calibrationStatus || getValue(report, "CALIBRATION_STATUS", FALLBACK.UNKNOWN);
    verdict.calibrationHoldReason = verdict.calibrationHoldReason || getValue(report, "CALIBRATION_HOLD_REASON", FALLBACK.UNKNOWN);
    verdict.diagnosticRailClean = verdict.diagnosticRailClean || getValue(report, "DIAGNOSTIC_RAIL_CLEAN", FALLBACK.UNKNOWN);
    verdict.calibrationPointReached = verdict.calibrationPointReached || getValue(report, "CALIBRATION_POINT_REACHED", FALLBACK.UNKNOWN);

    verdict.recommendedNextOwner = verdict.recommendedNextOwner || getValue(report, "RECOMMENDED_NEXT_OWNER", FALLBACK.UNKNOWN);
    verdict.recommendedNextFile = verdict.recommendedNextFile || getValue(report, "RECOMMENDED_NEXT_FILE", FALLBACK.UNKNOWN);
    verdict.recommendedNextAction = verdict.recommendedNextAction || getValue(report, "RECOMMENDED_NEXT_ACTION", FALLBACK.UNKNOWN);

    verdict.bishopQueenCanvasConformance = {
      southContract: CONTRACT,
      southReceipt: RECEIPT,
      southImplementationContract: IMPLEMENTATION_CONTRACT,
      southImplementationReceipt: IMPLEMENTATION_RECEIPT,
      bishopQueenCanvasSchemaActive: getValue(report, "BISHOP_QUEEN_CANVAS_SCHEMA_ACTIVE", "true"),
      bishopPointerFingerLanguageActive: getValue(report, "BISHOP_POINTER_FINGER_LANGUAGE_ACTIVE", "true"),
      queenHandshakeStatus: getValue(report, "QUEEN_HANDSHAKE_STATUS", FALLBACK.UNKNOWN),
      routeConductorV99Recognized: getValue(report, "ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED", FALLBACK.UNKNOWN),
      packetFormattingAuthority: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false
    };

    verdict.southOutputConformance = {
      southContract: CONTRACT,
      southReceipt: RECEIPT,
      southImplementationContract: IMPLEMENTATION_CONTRACT,
      southImplementationReceipt: IMPLEMENTATION_RECEIPT,
      southOutputValid: CHILD_VALIDATION.VALID,
      southMeaningPreserved: boolText(Boolean(meaningPreserved)),
      packetFormattingAuthority: true,
      finalPrimaryCaseAuthority: false,
      finalRecommendationAuthority: false,
      diagnosticUiAuthority: false,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      macroWestReleaseAuthorized: false
    };

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
    report.PREVIOUS_NORTH_CONTRACT = getValue(source, "PREVIOUS_NORTH_CONTRACT", PREVIOUS_NORTH_ANCHOR_CONTRACT);
    report.BASELINE_NORTH_CONTRACT = getValue(source, "BASELINE_NORTH_CONTRACT", PREVIOUS_NORTH_ANCHOR_CONTRACT);

    report.SOUTH_IMPLEMENTATION_CONTRACT = IMPLEMENTATION_CONTRACT;
    report.SOUTH_IMPLEMENTATION_RECEIPT = IMPLEMENTATION_RECEIPT;
    report.SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT = PREVIOUS_IMPLEMENTATION_CONTRACT;
    report.SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT = LINEAGE_IMPLEMENTATION_CONTRACT;
    report.SOUTH_BASELINE_IMPLEMENTATION_CONTRACT = BASELINE_IMPLEMENTATION_CONTRACT;
    report.SOUTH_ANCHOR_NORTH_CONTRACT = NORTH_ANCHOR_CONTRACT;
    report.SOUTH_ANCHOR_NORTH_RECEIPT = NORTH_ANCHOR_RECEIPT;
    report.SOUTH_PREVIOUS_ANCHOR_NORTH_CONTRACT = PREVIOUS_NORTH_ANCHOR_CONTRACT;
    report.SOUTH_PREVIOUS_ANCHOR_NORTH_RECEIPT = PREVIOUS_NORTH_ANCHOR_RECEIPT;

    report.CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT = getValue(
      source,
      "CURRENT_EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT
    );

    report.COMPAT_ROUTE_CONDUCTOR_CONTRACT = getValue(
      source,
      "COMPAT_ROUTE_CONDUCTOR_CONTRACT",
      COMPAT_ROUTE_CONDUCTOR_CONTRACT
    );

    report.PRIOR_ROUTE_CONDUCTOR_CONTRACT = getValue(
      source,
      "PRIOR_ROUTE_CONDUCTOR_CONTRACT",
      PRIOR_ROUTE_CONDUCTOR_CONTRACT
    );

    const servedRoute = getValue(report, "SERVED_ROUTE_CONDUCTOR_CONTRACT", FALLBACK.UNKNOWN);

    if (servedRoute === EXPECTED_ROUTE_CONDUCTOR_CONTRACT) {
      report.ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5 = getValue(
        report,
        "ROUTE_CONDUCTOR_V9_9_PRIMARY_NOT_TREATED_AS_CASE_5",
        "true"
      );
      report.ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED = getValue(
        report,
        "ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED",
        "true"
      );
    }

    if (servedRoute === COMPAT_ROUTE_CONDUCTOR_CONTRACT) {
      report.ROUTE_CONDUCTOR_V9_6_COMPATIBILITY_ACCEPTED = getValue(
        report,
        "ROUTE_CONDUCTOR_V9_6_COMPATIBILITY_ACCEPTED",
        "true"
      );
    }

    if (servedRoute === LINEAGE_ROUTE_CONDUCTOR_CONTRACT) {
      report.ROUTE_CONDUCTOR_V9_5_LINEAGE_ACCEPTED = getValue(
        report,
        "ROUTE_CONDUCTOR_V9_5_LINEAGE_ACCEPTED",
        "true"
      );
    }

    if (servedRoute === PRIOR_ROUTE_CONDUCTOR_CONTRACT) {
      report.ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED = getValue(
        report,
        "ROUTE_CONDUCTOR_V9_4_LINEAGE_ACCEPTED",
        "true"
      );
    }

    for (const field of NO_CLAIM_FIELDS) {
      report[field] = "false";
    }

    for (const field of UPPER_NO_CLAIM_FIELDS) {
      report[field] = "false";
    }

    report.SECONDARY_EVIDENCE_NOTES = serializeEvidenceNotes(source, state, options || {});
    report.NORTH_SECONDARY_EVIDENCE_NOTES = getValue(
      source,
      "NORTH_SECONDARY_EVIDENCE_NOTES",
      report.SECONDARY_EVIDENCE_NOTES
    );

    projectPlanetaryControlFields(report, state);
    projectLabCanvasBridgeFields(report, state);
    projectBishopQueenCanvasFields(report, state);
    preserveNewsFibonacciFields(report, source);

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
    report.SOUTH_RECEIPT_VALID = CHILD_VALIDATION.VALID;
    report.SOUTH_MEANING_PRESERVED = boolText(meaningPreserved);
    report.SOUTH_OUTPUT_SCHEMA_VALID = "true";
    report.SOUTH_PACKET_TEXT_SOURCE =
      "SOUTH_PACKET_FORMATTING_FROM_NORTH_LAB_CANVAS_BISHOP_QUEEN_SCHEMA";
    report.SOUTH_SCHEMA_CONFORMANCE_STATUS = hasMeaning
      ? "SOUTH_SCHEMA_CONFORMANCE_COMPLETE"
      : "SOUTH_SCHEMA_CONFORMANCE_PARTIAL";
    report.SOUTH_SCHEMA_CONFORMANCE_REASON = hasMeaning
      ? "NORTH_MEANING_FIELDS_PRESENT_AND_PASSED_THROUGH"
      : "NORTH_MEANING_FIELDS_INCOMPLETE";

    report.SOUTH_SECONDARY_OUTPUT_NOTES = state.southSecondaryOutputNotes.length
      ? state.southSecondaryOutputNotes.join(" | ")
      : FALLBACK.NONE;

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
      "ROUTE_CONDUCTOR_V9_9_BISHOP_QUEEN_CANVAS_RECOGNIZED",
      "BISHOP_QUEEN_CANVAS_RECOGNITION_STATUS",
      "QUEEN_HANDSHAKE_STATUS",
      "BISHOP_POINTER_FINGER_LANGUAGE_ACTIVE",
      "CACHE_OR_SERVED_CONTRACT_MISMATCH",
      "PLANETARY_CONTROL_FOOTPRINT_STATUS",
      "CONTROL_FILE_STATUS",
      "CONTROL_FILE_PRESENT",
      "CONTROL_FILE_EXPECTED_NOT_YET_BUILT",
      "CONTROL_FILE_ABSENCE_NOT_TREATED_AS_CASE_5",
      "CONTROL_FILE_HANDSHAKE_STATUS",
      "PLANETARY_VIEW_CONTROL_STATUS",
      "LAB_BRIDGE_STATUS",
      "BISHOP_BRIDGE_STATUS",
      "FOUR_WAY_CANVAS_HANDOFF_STATUS",
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
      "RECOMMENDED_NEXT_ACTION",
      "PLANETARY_CONTROL_RECOMMENDED_NEXT_FILE",
      "PLANETARY_CONTROL_RECOMMENDED_NEXT_ACTION"
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
      SOUTH_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: BASELINE_IMPLEMENTATION_CONTRACT,
      SOUTH_ANCHOR_NORTH_CONTRACT: NORTH_ANCHOR_CONTRACT,
      SOUTH_ANCHOR_NORTH_RECEIPT: NORTH_ANCHOR_RECEIPT,
      SOUTH_PREVIOUS_ANCHOR_NORTH_CONTRACT: PREVIOUS_NORTH_ANCHOR_CONTRACT,
      SOUTH_PREVIOUS_ANCHOR_NORTH_RECEIPT: PREVIOUS_NORTH_ANCHOR_RECEIPT,

      SOUTH_OUTPUT_COMPLETE: state.southOutputComplete,
      SOUTH_OUTPUT_STATUS: state.southOutputStatus,
      SOUTH_OUTPUT_VALID: CHILD_VALIDATION.VALID,
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
        lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
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

      const fallbackReport = {
        PACKET_NAME: REPORT_PACKET,
        TARGET_ROUTE,
        DIAGNOSTIC_ROUTE,
        DIAGNOSTIC_TIMESTAMP: nowIso(),
        NORTH_CONTRACT: NORTH_ANCHOR_CONTRACT,
        NORTH_RECEIPT: NORTH_ANCHOR_RECEIPT,
        PRIMARY_CASE: FALLBACK.UNKNOWN,
        CALIBRATION_STATUS: FALLBACK.UNKNOWN,
        CALIBRATION_HOLD_REASON: "SOUTH_COMPOSE_ERROR",
        DIAGNOSTIC_RAIL_CLEAN: "false",
        CALIBRATION_POINT_REACHED: "false",
        RECOMMENDED_NEXT_OWNER: FALLBACK.INSUFFICIENT_EVIDENCE,
        RECOMMENDED_NEXT_FILE: "HOLD_FOR_TEACHER_REVIEW",
        RECOMMENDED_NEXT_ACTION: "REVIEW_SOUTH_PACKET_OUTPUT_CONFORMANCE",
        SOUTH_OUTPUT_STATUS: STATUS.FAILED,
        SOUTH_OUTPUT_COMPLETE: "false",
        SOUTH_OUTPUT_VALID: CHILD_VALIDATION.UNREADABLE,
        SOUTH_OUTPUT_SCHEMA_VALID: "false",
        SOUTH_MEANING_PRESERVED: "false",
        SOUTH_SCHEMA_CONFORMANCE_STATUS: "SOUTH_SCHEMA_CONFORMANCE_FAILED",
        SOUTH_SCHEMA_CONFORMANCE_REASON: "SOUTH_COMPOSE_ERROR",
        SOUTH_PACKET_TEXT_SOURCE: "SOUTH_ERROR_FALLBACK_PACKET",
        SOUTH_SECONDARY_OUTPUT_NOTES: state.southSecondaryOutputNotes.join(" | ") || FALLBACK.NONE,
        f13Claimed: "false",
        f21EligibleForNorth: "false",
        f21ClaimedByDiagnosticRail: "false",
        readyTextAllowed: "false",
        readyTextClaimedByDiagnosticRail: "false",
        visualPassClaimed: "false",
        generatedImage: "false",
        graphicBox: "false",
        webGL: "false"
      };

      state.reportObject = fallbackReport;
      state.compactSummary = composeCompactSummary(fallbackReport);
      state.fullPacketText = Object.keys(fallbackReport).map((key) => line(key, fallbackReport[key])).join("\n");
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
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
      anchorNorthContract: NORTH_ANCHOR_CONTRACT,
      anchorNorthReceipt: NORTH_ANCHOR_RECEIPT,
      previousAnchorNorthContract: PREVIOUS_NORTH_ANCHOR_CONTRACT,
      previousAnchorNorthReceipt: PREVIOUS_NORTH_ANCHOR_RECEIPT,
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
      controlFileImplementationAuthority: false,
      labTableImplementationAuthority: false,
      bishopLaneImplementationAuthority: false,
      canvasImplementationAuthority: false,

      composeSouthReportApiAvailable: true,
      composeCompactSummaryApiAvailable: true,
      getSouthReceiptApiAvailable: true,
      getSouthStateApiAvailable: true,

      externalContractPreservedForNorthValidation: true,
      northV5LabCanvasBridgeConformanceOwned: true,
      northV4PlanetaryControlLifecycleConformancePreserved: true,
      northV3AnchorSchemaBackwardReferencePreserved: true,
      labCanvasBridgeReportConformanceOwned: true,
      bishopBridgeReportConformanceOwned: true,
      bishopQueenCanvasReportConformanceOwned: true,
      bishopPointerFingerLanguageReportConformanceOwned: true,
      fourWayCanvasHandoffReportConformanceOwned: true,

      fullPacketTextOwned: true,
      compactSummaryOwned: true,
      reportObjectOwned: true,
      outputObjectShapeOwned: true,
      secondaryEvidenceSerializationOwned: true,
      packetSafeFallbackNormalizationOwned: true,
      southOutputNotesRemainSeparate: true,

      planetaryControlFormalFieldsOwned: true,
      planetaryControlFootprintPrintoutOwned: true,
      controlAbsenceExpectedPrintoutOwned: true,
      controlAbsenceNotCase5PrintoutOwned: true,
      jsIntegrationFunnelPrintoutOwned: true,
      routeConductorControlHandshakePrintoutOwned: true,
      planetaryViewStatusPrintoutOwned: true,

      expectedControlFile: EXPECTED_CONTROL_FILE,
      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedRouteConductorFile: EXPECTED_ROUTE_CONDUCTOR_FILE,
      expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
      lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
      priorRouteConductorContract: PRIOR_ROUTE_CONDUCTOR_CONTRACT,
      expectedIndexFile: EXPECTED_INDEX_FILE,
      expectedIndexContract: EXPECTED_INDEX_CONTRACT,
      expectedCanvasFile: EXPECTED_CANVAS_FILE,
      jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,
      controlFunnelOwner: CONTROL_FUNNEL_OWNER,

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
    lastReport = clonePlain(state.reportObject || {});

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.diagnosticSouth = api;
    root.HEARTH.diagnosticRailSouth = api;
    root.HEARTH.diagnosticSouthReceipt = getSouthReceipt();
    root.HEARTH.diagnosticRailSouthReceipt = getSouthReceipt();
    root.HEARTH.diagnosticSouthOutput = clonePlain(lastOutput);
    root.HEARTH.diagnosticRailSouthOutput = clonePlain(lastOutput);
    root.HEARTH.diagnosticSouthReport = clonePlain(lastReport);
    root.HEARTH.diagnosticRailSouthReport = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_OUTPUT = clonePlain(lastOutput);
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_OUTPUT = clonePlain(lastOutput);
    root.HEARTH_DIAGNOSTIC_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT = clonePlain(lastReport);
  }

  const api = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    baselineImplementationContract: BASELINE_IMPLEMENTATION_CONTRACT,
    anchorNorthContract: NORTH_ANCHOR_CONTRACT,
    anchorNorthReceipt: NORTH_ANCHOR_RECEIPT,
    previousAnchorNorthContract: PREVIOUS_NORTH_ANCHOR_CONTRACT,
    previousAnchorNorthReceipt: PREVIOUS_NORTH_ANCHOR_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    expectedControlFile: EXPECTED_CONTROL_FILE,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedRouteConductorFile: EXPECTED_ROUTE_CONDUCTOR_FILE,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    compatRouteConductorContract: COMPAT_ROUTE_CONDUCTOR_CONTRACT,
    lineageRouteConductorContract: LINEAGE_ROUTE_CONDUCTOR_CONTRACT,
    priorRouteConductorContract: PRIOR_ROUTE_CONDUCTOR_CONTRACT,
    expectedIndexFile: EXPECTED_INDEX_FILE,
    expectedIndexContract: EXPECTED_INDEX_CONTRACT,
    expectedCanvasFile: EXPECTED_CANVAS_FILE,
    jsIntegrationFunnel: JS_INTEGRATION_FUNNEL,
    controlFunnelOwner: CONTROL_FUNNEL_OWNER,

    composeSouthReport,
    composeCompactSummary,
    getSouthReceipt,
    getSouthState,

    supportsNorthAnchorSchemaConformance: true,
    supportsNorthV5LabCanvasBridgeSerialization: true,
    supportsNorthV4PlanetaryControlLifecycleSerialization: true,
    supportsNorthV3VerdictBackwardReference: true,
    supportsSouthOutputValidClosureProjection: true,
    supportsNewsAlignmentPacketPreservation: true,
    supportsFibonacciSynchronizationPacketPreservation: true,
    supportsReportObjectShapeForNorthValidation: true,
    supportsFullPacketTextForNorthValidation: true,
    supportsCompactSummaryForNorthValidation: true,
    supportsMeaningPreservationAudit: true,
    supportsPlanetaryControlFormalFields: true,
    supportsControlFileExpectedNotBuiltFootprint: true,
    supportsControlAbsenceNotCase5Footprint: true,
    supportsJsIntegrationFunnelPrintout: true,
    supportsRouteConductorControlHandshakePrintout: true,
    supportsPlanetaryViewTrackPrintout: true,
    supportsLabCanvasBridgeReportConformance: true,
    supportsBishopBridgeReportConformance: true,
    supportsBishopQueenCanvasReportConformance: true,
    supportsBishopPointerFingerLanguage: true,
    supportsQueenHandshakeReportConformance: true,
    supportsFourWayCanvasHandoffReportConformance: true,
    supportsTwoCyclePremisePreservation: true,

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
    controlFileImplementationAuthority: false,
    labTableImplementationAuthority: false,
    bishopLaneImplementationAuthority: false,
    canvasImplementationAuthority: false,

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
