// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic probe SOUTH child only.
// Purpose:
// - Serve North v10 chronology hub as the eighth diagnostic file.
// - Preserve PROBE_SOUTH as diagnostic-only packet-meaning and South-rail-composition probe.
// - Confirm whether the South rail is visible, aliased, callable, and returning packet output.
// - Confirm whether South output preserves North chronology meaning fields.
// - Confirm whether current diagnostic chronology is complete through step 8.
// - Distinguish diagnostic chronology failure from production visible-globe expression bottleneck.
// - Return chronology-standard fields North can print without diagnostic HTML renewal.
// - Preserve receiver rule: diagnostic receiver still calls NORTH only.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - diagnostic UI shell
// - North chronology hub
// - East rail
// - West rail
// - South rail packet authority
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - Macro West release
// - Lab runtime authority
// - Queen/control implementation
// - terrain/material/hydrology truth
// - final visual pass
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

  const NORTH_V10_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const NORTH_V10_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";
  const NORTH_V9_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_SOUTH_FILE = FILE;

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
  const EXPECTED_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const EXPECTED_SOUTH_EXTERNAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";

  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT = CONTRACT;

  const REQUIRED_MEANING_FIELDS = Object.freeze([
    "PACKET_NAME",
    "TARGET_ROUTE",
    "DIAGNOSTIC_ROUTE",
    "DIAGNOSTIC_TIMESTAMP",
    "NORTH_CONTRACT",
    "NORTH_RECEIPT",
    "PREVIOUS_NORTH_CONTRACT",
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
    "PRIMARY_CASE",
    "CALIBRATION_STATUS",
    "CALIBRATION_HOLD_REASON",
    "DIAGNOSTIC_RAIL_CLEAN",
    "CALIBRATION_POINT_REACHED",
    "RECOMMENDED_NEXT_OWNER",
    "RECOMMENDED_NEXT_FILE",
    "RECOMMENDED_NEXT_ACTION"
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

  const SOUTH_RAIL_ALIAS_PATHS = Object.freeze([
    "HEARTH.diagnosticSouth",
    "HEARTH.diagnosticRailSouth",
    "HEARTH.diagnosticSouthChronologyStandard",
    "HEARTH.diagnosticRailSouthChronologyStandard",
    "HEARTH_DIAGNOSTIC_SOUTH",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
    "HEARTH_DIAGNOSTIC_SOUTH_CHRONOLOGY_STANDARD",
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_CHRONOLOGY_STANDARD",
    "DEXTER_LAB.hearthDiagnosticSouth",
    "DEXTER_LAB.hearthDiagnosticRailSouth",
    "DEXTER_LAB.hearthDiagnosticSouthChronologyStandard",
    "DEXTER_LAB.hearthDiagnosticRailSouthChronologyStandard"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;

  let lastState = null;
  let lastReport = null;
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
      const joined = value.map((entry) => {
        if (isObject(entry)) {
          try {
            return JSON.stringify(entry);
          } catch (_error) {
            return String(entry);
          }
        }
        return bounded(entry, 1200);
      }).filter(Boolean).join(" | ");
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

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
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

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
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
      "getReceiptLight",
      "getReceipt",
      "getSouthReceipt",
      "getProbeSouthReceipt",
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
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

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
        if (!clean || clean === "none") continue;
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

  function chronologyToText(chronology) {
    if (!Array.isArray(chronology)) return "NONE";

    return chronology.map((step) => {
      if (!isObject(step)) return bounded(step, 1200);

      return [
        `${step.order || "?"}.${step.id || "UNKNOWN"}`,
        `file:${step.file || "UNKNOWN"}`,
        `load:${step.loadStatus || "UNKNOWN"}`,
        `observed:${boolText(step.observed, "UNKNOWN")}`,
        `call:${step.callStatus || "UNKNOWN"}`,
        `status:${step.status || "UNKNOWN"}`
      ].join(" ");
    }).join(" | ");
  }

  function findChronologyStep(chronology, id) {
    if (!Array.isArray(chronology)) return null;

    const wanted = safeString(id).toUpperCase();

    for (const step of chronology) {
      if (!isObject(step)) continue;
      if (safeString(step.id).toUpperCase() === wanted) return step;
      if (safeString(step.owner).toUpperCase() === wanted) return step;
    }

    return null;
  }

  function collectOutputKeys(value) {
    if (!isObject(value)) return "NONE";
    return Object.keys(value).slice(0, 160).join(",") || "NONE";
  }

  function requiredMeaningStatus(report) {
    const missing = [];

    for (const field of REQUIRED_MEANING_FIELDS) {
      const value = getRaw(report, field, undefined);
      if (value === undefined || value === null || value === "") missing.push(field);
    }

    return {
      complete: missing.length === 0,
      missing,
      count: REQUIRED_MEANING_FIELDS.length,
      present: REQUIRED_MEANING_FIELDS.length - missing.length
    };
  }

  function noClaimViolationStatus(report) {
    const violations = [];

    for (const key of Object.keys(NO_CLAIMS)) {
      const value = getRaw(report, key, false);
      if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") {
        violations.push(key);
      }
    }

    for (const key of Object.keys(UPPER_NO_CLAIMS)) {
      const value = getRaw(report, key, false);
      if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") {
        violations.push(key);
      }
    }

    return {
      clean: violations.length === 0,
      violations
    };
  }

  function discoverSouthRail() {
    const found = findFirstPath(SOUTH_RAIL_ALIAS_PATHS);
    const receipt = getReceiptFromAuthority(found.value) || {};

    return {
      observed: Boolean(found.value),
      sourcePath: found.path,
      authority: found.value,
      receipt,
      contract: packetValue(
        receipt.implementationContract ||
          receipt.SOUTH_IMPLEMENTATION_CONTRACT ||
          receipt.contract ||
          receipt.CONTRACT ||
          (found.value && found.value.implementationContract) ||
          (found.value && found.value.contract),
        "UNKNOWN"
      ),
      externalContract: packetValue(
        receipt.contract ||
          receipt.CONTRACT ||
          (found.value && found.value.contract),
        "UNKNOWN"
      ),
      receiptName: packetValue(
        receipt.implementationReceipt ||
          receipt.SOUTH_IMPLEMENTATION_RECEIPT ||
          receipt.receipt ||
          receipt.RECEIPT ||
          (found.value && found.value.receipt),
        "UNKNOWN"
      ),
      composeApiAvailable: Boolean(found.value && isFunction(found.value.composeSouthReport))
    };
  }

  function makeState() {
    return {
      packetName: REPORT_PACKET,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      diagnosticTimestamp: nowIso(),

      probeSouthStatus: "READY",
      probeSouthContract: CONTRACT,
      probeSouthReceipt: RECEIPT,
      probeSouthVersion: VERSION,
      probeSouthFile: FILE,

      parentNorthContract: NORTH_V10_CONTRACT,
      parentNorthReceipt: NORTH_V10_RECEIPT,
      previousNorthContract: NORTH_V9_CONTRACT,

      northChronologyHubActive: true,
      northIsHubOnly: true,
      eightWayProbeBridgeActive: false,
      eightFileChronologyActive: true,
      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,

      southRailObservedByProbe: false,
      southRailSourcePathByProbe: "NONE",
      southRailContractByProbe: "UNKNOWN",
      southRailExternalContract: EXPECTED_SOUTH_EXTERNAL_CONTRACT,
      southRailReceiptByProbe: "UNKNOWN",
      southRailComposeApiAvailable: false,

      currentReportObservedByProbe: false,
      chronologyObservedByProbe: false,
      chronologySequenceTextByProbe: "NONE",
      chronologySequenceJsonByProbe: "[]",
      chronologyStepSouthRailStatusByProbe: "UNKNOWN",
      chronologyStepProbeSouthStatusByProbe: "SELF_RUNNING",

      packetMeaningRequiredFieldCount: REQUIRED_MEANING_FIELDS.length,
      packetMeaningPresentFieldCount: 0,
      packetMeaningMissingFieldCount: REQUIRED_MEANING_FIELDS.length,
      packetMeaningMissingFields: "UNKNOWN",
      packetMeaningPreserved: false,
      packetMeaningStatus: "UNKNOWN",

      noClaimBoundaryClean: true,
      noClaimViolations: "NONE",

      diagnosticChronologyCompleteThroughSouthProbe: false,
      diagnosticChronologyFailureOwnerByProbe: "UNKNOWN",
      diagnosticChronologyFailureFileByProbe: "UNKNOWN",
      diagnosticChronologyFailureClassByProbe: "UNKNOWN",
      diagnosticChronologyFailureReasonByProbe: "UNKNOWN",

      productionVisibleGlobeDispositionByProbe: "UNKNOWN",
      productionZoneCandidateByProbe: "UNKNOWN",
      productionZoneFileByProbe: "UNKNOWN",
      productionZoneClassByProbe: "UNKNOWN",
      productionZoneReasonByProbe: "UNKNOWN",

      recommendedNextOwnerByProbe: "UNKNOWN",
      recommendedNextFileByProbe: "UNKNOWN",
      recommendedNextActionByProbe: "UNKNOWN",

      notes: [
        "PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_ACTIVE",
        "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
        "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
        "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21"
      ],

      report: {},
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };
  }

  function inferProductionDisposition(state, report) {
    const proofReady = getValue(report, "RENDERED_PLANET_PROOF_READY", "UNKNOWN");
    const visibleReady = getValue(report, "VISIBLE_PLANET_PROOF_READY", "UNKNOWN");
    const expressionStatus = getValue(report, "CANVAS_EXPRESSION_PROOF_STATUS", "UNKNOWN");
    const bottleneck = getValue(report, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", "UNKNOWN");
    const surfaceReady = getValue(report, "CANVAS_EXPRESSION_SURFACE_READY", "UNKNOWN");
    const richnessReady = getValue(report, "CANVAS_EXPRESSION_RICHNESS_READY", "UNKNOWN");
    const domSurfaceReady = getValue(report, "DOM_EXPRESSION_SURFACE_PROOF_READY", "UNKNOWN");
    const currentCanvasParent = getValue(report, "CURRENT_CANVAS_PARENT_CONTRACT", "UNKNOWN");
    const currentCanvasRecognized = getValue(report, "CURRENT_CANVAS_PARENT_RECOGNIZED", "UNKNOWN");

    const expressionBottleneck =
      expressionStatus === "HANDSHAKE_PENDING" ||
      surfaceReady === "false" ||
      richnessReady === "false" ||
      domSurfaceReady === "false" ||
      bottleneck !== "UNKNOWN";

    if (expressionBottleneck) {
      state.productionVisibleGlobeDispositionByProbe =
        "VISIBLE_ROUTE_PROOF_PRESENT_BUT_CANVAS_EXPRESSION_SURFACE_NOT_PROVEN";
      state.productionZoneCandidateByProbe = "CANVAS_EXPRESSION_SURFACE";
      state.productionZoneFileByProbe = "/assets/hearth/hearth.canvas.js";
      state.productionZoneClassByProbe = bottleneck !== "UNKNOWN"
        ? bottleneck
        : "CANVAS_EXPRESSION_SURFACE_NOT_PROVEN";
      state.productionZoneReasonByProbe =
        "Rendered stage or route proof exists, but canvas expression surface, richness, parent contract, or DOM surface proof remains unresolved.";
      addNote(state, "PROBE_SOUTH_PRODUCTION_DISPOSITION_CANVAS_EXPRESSION_SURFACE_NOT_PROVEN");
      return;
    }

    if (proofReady === "true" && visibleReady === "true") {
      state.productionVisibleGlobeDispositionByProbe =
        "VISIBLE_PLANET_PROOF_PRESENT_NO_PRODUCTION_REPAIR_SELECTED_BY_PROBE_SOUTH";
      state.productionZoneCandidateByProbe = "NONE_SELECTED_BY_PROBE_SOUTH";
      state.productionZoneFileByProbe = "NONE";
      state.productionZoneClassByProbe = "NO_PRODUCTION_ZONE_SELECTED_BY_PACKET_MEANING_PROBE";
      state.productionZoneReasonByProbe =
        "Probe South confirms packet meaning only; North remains final disposition authority.";
      addNote(state, "PROBE_SOUTH_NO_PRODUCTION_ZONE_SELECTED_VISIBLE_PROOF_PRESENT");
      return;
    }

    state.productionVisibleGlobeDispositionByProbe =
      "INSUFFICIENT_VISIBLE_GLOBE_EVIDENCE_FOR_PROBE_SOUTH_PRODUCTION_DISPOSITION";
    state.productionZoneCandidateByProbe = "NORTH_OR_WEST_REVIEW_REQUIRED";
    state.productionZoneFileByProbe = getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN");
    state.productionZoneClassByProbe = "INSUFFICIENT_EVIDENCE";
    state.productionZoneReasonByProbe =
      `Probe South packet meaning inspection saw proofReady=${proofReady}, visibleReady=${visibleReady}, expressionStatus=${expressionStatus}, canvasParent=${currentCanvasParent}, canvasParentRecognized=${currentCanvasRecognized}.`;
  }

  function inferChronologyFailure(state, chronology, report) {
    const failed = Array.isArray(chronology)
      ? chronology.find((step) => isObject(step) && step.status && step.status !== "COMPLETE")
      : null;

    if (failed) {
      state.diagnosticChronologyCompleteThroughSouthProbe = false;
      state.diagnosticChronologyFailureOwnerByProbe = packetValue(failed.owner, "UNKNOWN");
      state.diagnosticChronologyFailureFileByProbe = packetValue(failed.file, "UNKNOWN");
      state.diagnosticChronologyFailureClassByProbe = packetValue(failed.status, "UNKNOWN");
      state.diagnosticChronologyFailureReasonByProbe =
        packetValue(failed.callError && failed.callError !== "NONE"
          ? failed.callError
          : failed.loadStatus || failed.callStatus || "CHRONOLOGY_STEP_NOT_COMPLETE");
      addNote(state, `PROBE_SOUTH_CHRONOLOGY_FAILURE_CONFIRMED:${state.diagnosticChronologyFailureOwnerByProbe}`);
      return;
    }

    const owner = getValue(report, "FIRST_CHRONOLOGY_FAILURE_OWNER", "UNKNOWN");
    const file = getValue(report, "FIRST_CHRONOLOGY_FAILURE_FILE", "UNKNOWN");
    const klass = getValue(report, "FIRST_CHRONOLOGY_FAILURE_CLASS", "UNKNOWN");
    const reason = getValue(report, "FIRST_CHRONOLOGY_FAILURE_REASON", "UNKNOWN");

    if (owner !== "UNKNOWN" && owner !== "NONE") {
      state.diagnosticChronologyCompleteThroughSouthProbe = false;
      state.diagnosticChronologyFailureOwnerByProbe = owner;
      state.diagnosticChronologyFailureFileByProbe = file;
      state.diagnosticChronologyFailureClassByProbe = klass;
      state.diagnosticChronologyFailureReasonByProbe = reason;
      addNote(state, `PROBE_SOUTH_CURRENT_REPORT_FAILURE_CONFIRMED:${owner}`);
      return;
    }

    state.diagnosticChronologyCompleteThroughSouthProbe = true;
    state.diagnosticChronologyFailureOwnerByProbe = "NONE";
    state.diagnosticChronologyFailureFileByProbe = "NONE";
    state.diagnosticChronologyFailureClassByProbe = "NONE";
    state.diagnosticChronologyFailureReasonByProbe = "NONE";
    addNote(state, "PROBE_SOUTH_CHRONOLOGY_COMPLETE_THROUGH_STEP_8");
  }

  function resolveRecommendation(state) {
    if (!state.southRailObservedByProbe) {
      state.recommendedNextOwnerByProbe = "DIAGNOSTIC_RAIL_SOUTH";
      state.recommendedNextFileByProbe = RAIL_SOUTH_FILE;
      state.recommendedNextActionByProbe =
        "RESTORE_OR_RENEW_SOUTH_RAIL_ALIASES_SO_NORTH_CHRONOLOGY_CAN_OBSERVE_PACKET_OUTPUT_AUTHORITY";
      return;
    }

    if (!state.southRailComposeApiAvailable) {
      state.recommendedNextOwnerByProbe = "DIAGNOSTIC_RAIL_SOUTH";
      state.recommendedNextFileByProbe = RAIL_SOUTH_FILE;
      state.recommendedNextActionByProbe =
        "RENEW_SOUTH_RAIL_TO_EXPOSE_COMPOSE_SOUTH_REPORT_FOR_NORTH_V10_CHRONOLOGY";
      return;
    }

    if (!state.packetMeaningPreserved) {
      state.recommendedNextOwnerByProbe = "DIAGNOSTIC_RAIL_SOUTH";
      state.recommendedNextFileByProbe = RAIL_SOUTH_FILE;
      state.recommendedNextActionByProbe =
        "RENEW_SOUTH_RAIL_PACKET_OUTPUT_TO_PRESERVE_REQUIRED_NORTH_CHRONOLOGY_MEANING_FIELDS";
      return;
    }

    if (!state.diagnosticChronologyCompleteThroughSouthProbe) {
      state.recommendedNextOwnerByProbe = state.diagnosticChronologyFailureOwnerByProbe;
      state.recommendedNextFileByProbe = state.diagnosticChronologyFailureFileByProbe;
      state.recommendedNextActionByProbe =
        "CLEAR_FIRST_DIAGNOSTIC_CHRONOLOGY_FAILURE_AND_RERUN_NORTH_V10";
      return;
    }

    if (state.productionZoneCandidateByProbe === "CANVAS_EXPRESSION_SURFACE") {
      state.recommendedNextOwnerByProbe = "CANVAS_EXPRESSION_CARRIER_REVIEW";
      state.recommendedNextFileByProbe = "/assets/hearth/hearth.canvas.js";
      state.recommendedNextActionByProbe =
        "REVIEW_CANVAS_EXPRESSION_SURFACE_PARENT_CONTRACT_AND_PIXEL_OR_DOM_SURFACE_PROOF_WITHOUT_MUTATING_DIAGNOSTIC_RAIL";
      return;
    }

    state.recommendedNextOwnerByProbe = "NORTH_FINAL_DISPOSITION";
    state.recommendedNextFileByProbe = RAIL_NORTH_FILE;
    state.recommendedNextActionByProbe =
      "ALLOW_NORTH_TO_SELECT_NEXT_OWNER_AFTER_COMPLETE_CHRONOLOGY_AND_PROBE_SOUTH_MEANING_CONFIRMATION";
  }

  function buildReport(state, payload) {
    const report = isObject(payload && payload.currentReport) ? payload.currentReport : {};
    const chronology = Array.isArray(payload && payload.chronology) ? payload.chronology : [];

    return {
      PACKET_NAME: REPORT_PACKET,
      TARGET_ROUTE: getValue(payload, "targetRoute", TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: getValue(payload, "diagnosticRoute", DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: state.diagnosticTimestamp,

      PROBE_SOUTH_STATUS: state.probeSouthStatus,
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE: FILE,

      PARENT_NORTH_CONTRACT: getValue(payload, "northContract", NORTH_V10_CONTRACT),
      PARENT_NORTH_RECEIPT: getValue(payload, "northReceipt", NORTH_V10_RECEIPT),
      PREVIOUS_NORTH_CONTRACT: getValue(payload, "previousNorthContract", NORTH_V9_CONTRACT),

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

      EXPECTED_HTML_CONTRACT: getValue(payload, "expectedHtmlContract", EXPECTED_HTML_CONTRACT),
      EXPECTED_INDEX_JS_CONTRACT: getValue(payload, "expectedIndexJsContract", EXPECTED_INDEX_JS_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: getValue(payload, "expectedRouteConductorContract", EXPECTED_ROUTE_CONDUCTOR_CONTRACT),
      EXPECTED_CONTROL_CONTRACT: getValue(payload, "expectedControlContract", EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: getValue(payload, "expectedCanvasContract", EXPECTED_CANVAS_CONTRACT),
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_SOUTH_RAIL_CONTRACT: EXPECTED_SOUTH_CONTRACT,
      SOUTH_RAIL_EXTERNAL_CONTRACT: state.southRailExternalContract,
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      PROBE_SOUTH_RUN_COMPLETE: "true",
      PROBE_SOUTH_RUN_STATUS: "COMPLETE",

      SOUTH_RAIL_OBSERVED_BY_PROBE: boolText(state.southRailObservedByProbe, "false"),
      SOUTH_RAIL_SOURCE_PATH_BY_PROBE: state.southRailSourcePathByProbe,
      SOUTH_RAIL_CONTRACT_BY_PROBE: state.southRailContractByProbe,
      SOUTH_RAIL_EXTERNAL_CONTRACT_BY_PROBE: state.southRailExternalContract,
      SOUTH_RAIL_RECEIPT_BY_PROBE: state.southRailReceiptByProbe,
      SOUTH_RAIL_COMPOSE_API_AVAILABLE_BY_PROBE: boolText(state.southRailComposeApiAvailable, "false"),

      CURRENT_REPORT_OBSERVED_BY_PROBE: boolText(state.currentReportObservedByProbe, "false"),
      CHRONOLOGY_OBSERVED_BY_PROBE: boolText(state.chronologyObservedByProbe, "false"),
      CHRONOLOGY_SEQUENCE_TEXT_BY_PROBE: state.chronologySequenceTextByProbe,
      CHRONOLOGY_SEQUENCE_JSON_BY_PROBE: state.chronologySequenceJsonByProbe,
      CHRONOLOGY_STEP_SOUTH_RAIL_STATUS_BY_PROBE: state.chronologyStepSouthRailStatusByProbe,
      CHRONOLOGY_STEP_PROBE_SOUTH_STATUS_BY_PROBE: state.chronologyStepProbeSouthStatusByProbe,

      PACKET_MEANING_REQUIRED_FIELD_COUNT: state.packetMeaningRequiredFieldCount,
      PACKET_MEANING_PRESENT_FIELD_COUNT: state.packetMeaningPresentFieldCount,
      PACKET_MEANING_MISSING_FIELD_COUNT: state.packetMeaningMissingFieldCount,
      PACKET_MEANING_MISSING_FIELDS: state.packetMeaningMissingFields,
      PACKET_MEANING_PRESERVED: boolText(state.packetMeaningPreserved, "false"),
      PACKET_MEANING_STATUS: state.packetMeaningStatus,

      NO_CLAIM_BOUNDARY_CLEAN_BY_PROBE: boolText(state.noClaimBoundaryClean, "false"),
      NO_CLAIM_VIOLATIONS_BY_PROBE: state.noClaimViolations,

      DIAGNOSTIC_CHRONOLOGY_COMPLETE_THROUGH_PROBE_SOUTH: boolText(state.diagnosticChronologyCompleteThroughSouthProbe, "false"),
      DIAGNOSTIC_CHRONOLOGY_FAILURE_OWNER_BY_PROBE: state.diagnosticChronologyFailureOwnerByProbe,
      DIAGNOSTIC_CHRONOLOGY_FAILURE_FILE_BY_PROBE: state.diagnosticChronologyFailureFileByProbe,
      DIAGNOSTIC_CHRONOLOGY_FAILURE_CLASS_BY_PROBE: state.diagnosticChronologyFailureClassByProbe,
      DIAGNOSTIC_CHRONOLOGY_FAILURE_REASON_BY_PROBE: state.diagnosticChronologyFailureReasonByProbe,

      PRODUCTION_VISIBLE_GLOBE_DISPOSITION_BY_PROBE: state.productionVisibleGlobeDispositionByProbe,
      PRODUCTION_ZONE_CANDIDATE_BY_PROBE: state.productionZoneCandidateByProbe,
      PRODUCTION_ZONE_FILE_BY_PROBE: state.productionZoneFileByProbe,
      PRODUCTION_ZONE_CLASS_BY_PROBE: state.productionZoneClassByProbe,
      PRODUCTION_ZONE_REASON_BY_PROBE: state.productionZoneReasonByProbe,

      CURRENT_REPORT_PRIMARY_CASE_BY_PROBE: getValue(report, "PRIMARY_CASE", "UNKNOWN"),
      CURRENT_REPORT_CALIBRATION_STATUS_BY_PROBE: getValue(report, "CALIBRATION_STATUS", "UNKNOWN"),
      CURRENT_REPORT_CALIBRATION_HOLD_REASON_BY_PROBE: getValue(report, "CALIBRATION_HOLD_REASON", "UNKNOWN"),
      CURRENT_REPORT_RECOMMENDED_NEXT_OWNER_BY_PROBE: getValue(report, "RECOMMENDED_NEXT_OWNER", "UNKNOWN"),
      CURRENT_REPORT_RECOMMENDED_NEXT_FILE_BY_PROBE: getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN"),
      CURRENT_REPORT_RECOMMENDED_NEXT_ACTION_BY_PROBE: getValue(report, "RECOMMENDED_NEXT_ACTION", "UNKNOWN"),

      RENDERED_PLANET_PROOF_READY_BY_PROBE: getValue(report, "RENDERED_PLANET_PROOF_READY", "UNKNOWN"),
      VISIBLE_PLANET_PROOF_READY_BY_PROBE: getValue(report, "VISIBLE_PLANET_PROOF_READY", "UNKNOWN"),
      VISIBLE_PLANET_PROOF_SOURCE_BY_PROBE: getValue(report, "VISIBLE_PLANET_PROOF_SOURCE", "UNKNOWN"),
      CANVAS_EXPRESSION_PROOF_STATUS_BY_PROBE: getValue(report, "CANVAS_EXPRESSION_PROOF_STATUS", "UNKNOWN"),
      CANVAS_EXPRESSION_BOTTLENECK_CLASS_BY_PROBE: getValue(report, "CANVAS_EXPRESSION_BOTTLENECK_CLASS", "UNKNOWN"),
      CANVAS_EXPRESSION_SURFACE_READY_BY_PROBE: getValue(report, "CANVAS_EXPRESSION_SURFACE_READY", "UNKNOWN"),
      CANVAS_EXPRESSION_RICHNESS_READY_BY_PROBE: getValue(report, "CANVAS_EXPRESSION_RICHNESS_READY", "UNKNOWN"),
      DOM_EXPRESSION_SURFACE_PROOF_READY_BY_PROBE: getValue(report, "DOM_EXPRESSION_SURFACE_PROOF_READY", "UNKNOWN"),
      CURRENT_CANVAS_PARENT_CONTRACT_BY_PROBE: getValue(report, "CURRENT_CANVAS_PARENT_CONTRACT", "UNKNOWN"),
      CURRENT_CANVAS_PARENT_RECOGNIZED_BY_PROBE: getValue(report, "CURRENT_CANVAS_PARENT_RECOGNIZED", "UNKNOWN"),

      RECOMMENDED_NEXT_OWNER_BY_PROBE: state.recommendedNextOwnerByProbe,
      RECOMMENDED_NEXT_FILE_BY_PROBE: state.recommendedNextFileByProbe,
      RECOMMENDED_NEXT_ACTION_BY_PROBE: state.recommendedNextActionByProbe,

      PROBE_SOUTH_NOTES: state.notes.join(" | "),
      PROBE_SOUTH_OUTPUT_KEYS: collectOutputKeys(report),
      PROBE_SOUTH_CHRONOLOGY_INPUT_COUNT: Array.isArray(chronology) ? chronology.length : 0,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeFullPacketText(report) {
    const preferred = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_FILE",
      "PARENT_NORTH_CONTRACT",
      "PARENT_NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "EIGHT_WAY_PROBE_BRIDGE_ACTIVE",
      "EIGHT_FILE_CHRONOLOGY_ACTIVE",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",
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
      "EXPECTED_SOUTH_RAIL_CONTRACT",
      "SOUTH_RAIL_EXTERNAL_CONTRACT",
      "EXPECTED_PROBE_NORTH_CONTRACT",
      "EXPECTED_PROBE_EAST_CONTRACT",
      "EXPECTED_PROBE_WEST_CONTRACT",
      "EXPECTED_PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "SOUTH_RAIL_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_SOURCE_PATH_BY_PROBE",
      "SOUTH_RAIL_CONTRACT_BY_PROBE",
      "SOUTH_RAIL_EXTERNAL_CONTRACT_BY_PROBE",
      "SOUTH_RAIL_RECEIPT_BY_PROBE",
      "SOUTH_RAIL_COMPOSE_API_AVAILABLE_BY_PROBE",
      "CURRENT_REPORT_OBSERVED_BY_PROBE",
      "CHRONOLOGY_OBSERVED_BY_PROBE",
      "CHRONOLOGY_SEQUENCE_TEXT_BY_PROBE",
      "CHRONOLOGY_SEQUENCE_JSON_BY_PROBE",
      "CHRONOLOGY_STEP_SOUTH_RAIL_STATUS_BY_PROBE",
      "CHRONOLOGY_STEP_PROBE_SOUTH_STATUS_BY_PROBE",
      "PACKET_MEANING_REQUIRED_FIELD_COUNT",
      "PACKET_MEANING_PRESENT_FIELD_COUNT",
      "PACKET_MEANING_MISSING_FIELD_COUNT",
      "PACKET_MEANING_MISSING_FIELDS",
      "PACKET_MEANING_PRESERVED",
      "PACKET_MEANING_STATUS",
      "NO_CLAIM_BOUNDARY_CLEAN_BY_PROBE",
      "NO_CLAIM_VIOLATIONS_BY_PROBE",
      "DIAGNOSTIC_CHRONOLOGY_COMPLETE_THROUGH_PROBE_SOUTH",
      "DIAGNOSTIC_CHRONOLOGY_FAILURE_OWNER_BY_PROBE",
      "DIAGNOSTIC_CHRONOLOGY_FAILURE_FILE_BY_PROBE",
      "DIAGNOSTIC_CHRONOLOGY_FAILURE_CLASS_BY_PROBE",
      "DIAGNOSTIC_CHRONOLOGY_FAILURE_REASON_BY_PROBE",
      "PRODUCTION_VISIBLE_GLOBE_DISPOSITION_BY_PROBE",
      "PRODUCTION_ZONE_CANDIDATE_BY_PROBE",
      "PRODUCTION_ZONE_FILE_BY_PROBE",
      "PRODUCTION_ZONE_CLASS_BY_PROBE",
      "PRODUCTION_ZONE_REASON_BY_PROBE",
      "CURRENT_REPORT_PRIMARY_CASE_BY_PROBE",
      "CURRENT_REPORT_CALIBRATION_STATUS_BY_PROBE",
      "CURRENT_REPORT_CALIBRATION_HOLD_REASON_BY_PROBE",
      "CURRENT_REPORT_RECOMMENDED_NEXT_OWNER_BY_PROBE",
      "CURRENT_REPORT_RECOMMENDED_NEXT_FILE_BY_PROBE",
      "CURRENT_REPORT_RECOMMENDED_NEXT_ACTION_BY_PROBE",
      "RENDERED_PLANET_PROOF_READY_BY_PROBE",
      "VISIBLE_PLANET_PROOF_READY_BY_PROBE",
      "VISIBLE_PLANET_PROOF_SOURCE_BY_PROBE",
      "CANVAS_EXPRESSION_PROOF_STATUS_BY_PROBE",
      "CANVAS_EXPRESSION_BOTTLENECK_CLASS_BY_PROBE",
      "CANVAS_EXPRESSION_SURFACE_READY_BY_PROBE",
      "CANVAS_EXPRESSION_RICHNESS_READY_BY_PROBE",
      "DOM_EXPRESSION_SURFACE_PROOF_READY_BY_PROBE",
      "CURRENT_CANVAS_PARENT_CONTRACT_BY_PROBE",
      "CURRENT_CANVAS_PARENT_RECOGNIZED_BY_PROBE",
      "RECOMMENDED_NEXT_OWNER_BY_PROBE",
      "RECOMMENDED_NEXT_FILE_BY_PROBE",
      "RECOMMENDED_NEXT_ACTION_BY_PROBE",
      "PROBE_SOUTH_NOTES",
      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const fields = [];

    for (const field of preferred.concat(Object.keys(report || {}))) {
      if (seen.has(field)) continue;
      seen.add(field);
      fields.push(field);
    }

    return fields.map((field) => line(field, getRaw(report, field, "UNKNOWN"))).join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_STATUS", getValue(report, "PROBE_SOUTH_STATUS", "UNKNOWN")),
      line("SOUTH_RAIL_OBSERVED_BY_PROBE", getValue(report, "SOUTH_RAIL_OBSERVED_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_SOURCE_PATH_BY_PROBE", getValue(report, "SOUTH_RAIL_SOURCE_PATH_BY_PROBE", "UNKNOWN")),
      line("SOUTH_RAIL_COMPOSE_API_AVAILABLE_BY_PROBE", getValue(report, "SOUTH_RAIL_COMPOSE_API_AVAILABLE_BY_PROBE", "UNKNOWN")),
      line("PACKET_MEANING_PRESERVED", getValue(report, "PACKET_MEANING_PRESERVED", "UNKNOWN")),
      line("DIAGNOSTIC_CHRONOLOGY_COMPLETE_THROUGH_PROBE_SOUTH", getValue(report, "DIAGNOSTIC_CHRONOLOGY_COMPLETE_THROUGH_PROBE_SOUTH", "UNKNOWN")),
      line("PRODUCTION_VISIBLE_GLOBE_DISPOSITION_BY_PROBE", getValue(report, "PRODUCTION_VISIBLE_GLOBE_DISPOSITION_BY_PROBE", "UNKNOWN")),
      line("PRODUCTION_ZONE_FILE_BY_PROBE", getValue(report, "PRODUCTION_ZONE_FILE_BY_PROBE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_OWNER_BY_PROBE", getValue(report, "RECOMMENDED_NEXT_OWNER_BY_PROBE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE_BY_PROBE", getValue(report, "RECOMMENDED_NEXT_FILE_BY_PROBE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_ACTION_BY_PROBE", getValue(report, "RECOMMENDED_NEXT_ACTION_BY_PROBE", "UNKNOWN"))
    ].join("\n");
  }

  function runProbeSouth(payload = {}) {
    const state = makeState();

    try {
      const currentReport = isObject(payload.currentReport) ? payload.currentReport : {};
      const chronology = Array.isArray(payload.chronology) ? payload.chronology : [];

      state.parentNorthContract = getValue(payload, "northContract", NORTH_V10_CONTRACT);
      state.parentNorthReceipt = getValue(payload, "northReceipt", NORTH_V10_RECEIPT);
      state.previousNorthContract = getValue(payload, "previousNorthContract", NORTH_V9_CONTRACT);

      state.currentReportObservedByProbe = Object.keys(currentReport).length > 0;
      state.chronologyObservedByProbe = chronology.length > 0;
      state.chronologySequenceTextByProbe = chronologyToText(chronology);

      try {
        state.chronologySequenceJsonByProbe = JSON.stringify(chronology);
      } catch (_error) {
        state.chronologySequenceJsonByProbe = "UNSERIALIZABLE_CHRONOLOGY";
      }

      if (state.currentReportObservedByProbe) addNote(state, "PROBE_SOUTH_CURRENT_NORTH_REPORT_OBSERVED");
      if (state.chronologyObservedByProbe) addNote(state, "PROBE_SOUTH_CHRONOLOGY_ARRAY_OBSERVED");

      const southRail = discoverSouthRail();

      state.southRailObservedByProbe = southRail.observed;
      state.southRailSourcePathByProbe = southRail.sourcePath;
      state.southRailContractByProbe = southRail.contract;
      state.southRailExternalContract = southRail.externalContract;
      state.southRailReceiptByProbe = southRail.receiptName;
      state.southRailComposeApiAvailable = southRail.composeApiAvailable;

      if (southRail.observed) addNote(state, `PROBE_SOUTH_OBSERVED_SOUTH_RAIL:${southRail.sourcePath}`);
      else addNote(state, "PROBE_SOUTH_DID_NOT_OBSERVE_SOUTH_RAIL");

      if (southRail.composeApiAvailable) addNote(state, "PROBE_SOUTH_CONFIRMED_SOUTH_RAIL_COMPOSE_API");
      else addNote(state, "PROBE_SOUTH_SOUTH_RAIL_COMPOSE_API_NOT_CONFIRMED");

      const southRailStep = findChronologyStep(chronology, "RAIL_SOUTH");
      const probeSouthStep = findChronologyStep(chronology, "PROBE_SOUTH");

      state.chronologyStepSouthRailStatusByProbe = southRailStep
        ? packetValue(southRailStep.status, "UNKNOWN")
        : "NOT_PRESENT_IN_CHRONOLOGY_INPUT";

      state.chronologyStepProbeSouthStatusByProbe = probeSouthStep
        ? packetValue(probeSouthStep.status, "SELF_RUNNING")
        : "SELF_RUNNING_NOT_YET_IN_INPUT_CHRONOLOGY";

      if (southRailStep) addNote(state, `PROBE_SOUTH_RAIL_SOUTH_CHRONOLOGY_STEP_OBSERVED:${state.chronologyStepSouthRailStatusByProbe}`);

      const meaning = requiredMeaningStatus(currentReport);

      state.packetMeaningPresentFieldCount = meaning.present;
      state.packetMeaningMissingFieldCount = meaning.missing.length;
      state.packetMeaningMissingFields = meaning.missing.length ? meaning.missing.join(",") : "NONE";

      const noClaims = noClaimViolationStatus(currentReport);

      state.noClaimBoundaryClean = noClaims.clean;
      state.noClaimViolations = noClaims.violations.length ? noClaims.violations.join(",") : "NONE";

      state.packetMeaningPreserved =
        meaning.complete &&
        noClaims.clean &&
        state.currentReportObservedByProbe;

      state.packetMeaningStatus = state.packetMeaningPreserved
        ? "PACKET_MEANING_PRESERVED"
        : "PACKET_MEANING_INCOMPLETE_OR_BOUNDARY_VIOLATED";

      if (state.packetMeaningPreserved) addNote(state, "PROBE_SOUTH_CONFIRMED_PACKET_MEANING_PRESERVED");
      else addNote(state, `PROBE_SOUTH_PACKET_MEANING_GAP:${state.packetMeaningMissingFields}`);

      if (noClaims.clean) addNote(state, "PROBE_SOUTH_CONFIRMED_NO_CLAIM_BOUNDARY_CLEAN");
      else addNote(state, `PROBE_SOUTH_NO_CLAIM_BOUNDARY_VIOLATION:${state.noClaimViolations}`);

      inferChronologyFailure(state, chronology, currentReport);
      inferProductionDisposition(state, currentReport);
      resolveRecommendation(state);

      state.probeSouthStatus = "COMPLETE";
      state.updatedAt = nowIso();

      const report = buildReport(state, payload);

      state.report = clonePlain(report);
      publish(state);

      return {
        ...report,
        REPORT_OBJECT: clonePlain(report),
        FULL_PACKET_TEXT: composeFullPacketText(report),
        COMPACT_SUMMARY: composeCompactSummary(report),
        PROBE_SOUTH_OUTPUT_STATUS: "COMPLETE",
        ok: true,
        contract: CONTRACT,
        receipt: RECEIPT,
        state: clonePlain(state)
      };
    } catch (error) {
      state.probeSouthStatus = "FAILED";
      addNote(state, `PROBE_SOUTH_ERROR:${bounded(error && error.message ? error.message : error, 1000)}`);
      state.recommendedNextOwnerByProbe = "DIAGNOSTIC_PROBE_SOUTH";
      state.recommendedNextFileByProbe = FILE;
      state.recommendedNextActionByProbe =
        "REVIEW_PROBE_SOUTH_RUNTIME_ERROR_BEFORE_CONTINUING_CHRONOLOGY";
      state.updatedAt = nowIso();

      const report = buildReport(state, payload || {});
      report.PROBE_SOUTH_RUN_COMPLETE = "false";
      report.PROBE_SOUTH_RUN_STATUS = "FAILED";
      report.PROBE_SOUTH_ERROR = bounded(error && error.message ? error.message : error, 1000);

      state.report = clonePlain(report);
      publish(state);

      return {
        ...report,
        REPORT_OBJECT: clonePlain(report),
        FULL_PACKET_TEXT: composeFullPacketText(report),
        COMPACT_SUMMARY: composeCompactSummary(report),
        PROBE_SOUTH_OUTPUT_STATUS: "FAILED",
        ok: false,
        contract: CONTRACT,
        receipt: RECEIPT,
        error: report.PROBE_SOUTH_ERROR,
        state: clonePlain(state)
      };
    }
  }

  function getReport() {
    return clonePlain(lastReport || buildReport(makeState(), {}));
  }

  function getState() {
    return clonePlain(lastState || makeState());
  }

  function getProbeSouthReceipt() {
    const state = lastState || makeState();

    return {
      childRole: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      reportPacket: REPORT_PACKET,

      parentNorthContract: NORTH_V10_CONTRACT,
      parentNorthReceipt: NORTH_V10_RECEIPT,
      previousNorthContract: NORTH_V9_CONTRACT,

      northChronologyHubActive: true,
      northIsHubOnly: true,
      eightWayProbeBridgeActive: false,
      eightFileChronologyActive: true,
      diagnosticRouteHtmlRenewalRequired: false,
      receiverStillCallsNorthOnly: true,

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
      expectedSouthExternalContract: EXPECTED_SOUTH_EXTERNAL_CONTRACT,
      expectedProbeNorthContract: EXPECTED_PROBE_NORTH_CONTRACT,
      expectedProbeEastContract: EXPECTED_PROBE_EAST_CONTRACT,
      expectedProbeWestContract: EXPECTED_PROBE_WEST_CONTRACT,
      expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

      southRailObservedByProbe: state.southRailObservedByProbe,
      southRailSourcePathByProbe: state.southRailSourcePathByProbe,
      southRailContractByProbe: state.southRailContractByProbe,
      southRailComposeApiAvailable: state.southRailComposeApiAvailable,

      currentReportObservedByProbe: state.currentReportObservedByProbe,
      chronologyObservedByProbe: state.chronologyObservedByProbe,
      packetMeaningPreserved: state.packetMeaningPreserved,
      packetMeaningStatus: state.packetMeaningStatus,
      diagnosticChronologyCompleteThroughSouthProbe: state.diagnosticChronologyCompleteThroughSouthProbe,
      productionVisibleGlobeDispositionByProbe: state.productionVisibleGlobeDispositionByProbe,
      productionZoneCandidateByProbe: state.productionZoneCandidateByProbe,
      productionZoneFileByProbe: state.productionZoneFileByProbe,

      runProbeSouthApiAvailable: true,
      getReportApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getProbeSouthReceiptApiAvailable: true,

      diagnosticOnly: true,
      packetMeaningProbeOnly: true,
      southRailImplementationAuthority: false,
      southRailPacketAuthority: false,
      northChronologyAuthority: false,
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

      supportsNorthV10ChronologyHub: true,
      supportsChronologyStepEight: true,
      supportsSouthRailAliasInspection: true,
      supportsSouthRailComposeApiInspection: true,
      supportsPacketMeaningPreservationAudit: true,
      supportsNoClaimBoundaryAudit: true,
      supportsProductionDispositionSeparation: true,
      supportsDiagnosticHtmlNoRenewal: true,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return getProbeSouthReceipt();
  }

  function getCompactSummary() {
    const report = getReport();
    return composeCompactSummary(report);
  }

  function getPacketText() {
    const report = getReport();
    return composeFullPacketText(report);
  }

  function publish(state) {
    lastState = clonePlain(state);
    lastReport = clonePlain(state.report && Object.keys(state.report).length
      ? state.report
      : buildReport(state, {}));

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

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getProbeSouthReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getProbeSouthReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getProbeSouthReceipt();

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = composeFullPacketText(lastReport);
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

    parentNorthContract: NORTH_V10_CONTRACT,
    parentNorthReceipt: NORTH_V10_RECEIPT,
    previousNorthContract: NORTH_V9_CONTRACT,

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
    expectedSouthExternalContract: EXPECTED_SOUTH_EXTERNAL_CONTRACT,
    expectedProbeNorthContract: EXPECTED_PROBE_NORTH_CONTRACT,
    expectedProbeEastContract: EXPECTED_PROBE_EAST_CONTRACT,
    expectedProbeWestContract: EXPECTED_PROBE_WEST_CONTRACT,
    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

    runProbeSouth,
    getReport,
    getState,
    getReceipt,
    getProbeSouthReceipt,
    getCompactSummary,
    getPacketText,

    diagnosticOnly: true,
    packetMeaningProbeOnly: true,
    northChronologyHubActive: true,
    northIsHubOnly: true,
    eightWayProbeBridgeActive: false,
    eightFileChronologyActive: true,
    diagnosticRouteHtmlRenewalRequired: false,
    receiverStillCallsNorthOnly: true,

    southRailImplementationAuthority: false,
    southRailPacketAuthority: false,
    northChronologyAuthority: false,
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

    supportsNorthV10ChronologyHub: true,
    supportsChronologyStepEight: true,
    supportsSouthRailAliasInspection: true,
    supportsSouthRailComposeApiInspection: true,
    supportsPacketMeaningPreservationAudit: true,
    supportsNoClaimBoundaryAudit: true,
    supportsProductionDispositionSeparation: true,
    supportsDiagnosticHtmlNoRenewal: true,

    ...NO_CLAIMS
  });

  publish(makeState());

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
