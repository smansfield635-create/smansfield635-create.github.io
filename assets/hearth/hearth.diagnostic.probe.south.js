// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic Probe South / F55 packet-meaning + auxiliary canvas finger inspect reader only.
// Purpose:
// - Preserve Probe South as the ninth chronology cell.
// - Preserve the expected North v11 contract and receipt.
// - Preserve the nine-step chronology without adding a tenth chronology step.
// - Read the auxiliary tenth inspection surface when available:
//   /assets/hearth/hearth.canvas.finger.inspect.js
// - Call the auxiliary canvas finger inspect API when available.
// - Return auxiliary under-hood canvas/finger/draw-path evidence through F55.
// - Keep the auxiliary file asymmetric: consumed by Probe South, not promoted into chronology.
// - Preserve no production mutation, no canvas repair, no route repair, no runtime restart.
// - Preserve no F13 claim, no F21 claim, no ready text, no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - North chronology
// - South packet-output rail
// - Canvas drawing
// - Canvas repair
// - Route conductor repair
// - Controls mutation
// - Terrain/hydrology/material truth
// - Final visual pass

(() => {
  "use strict";

  const PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const PROBE_SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";

  const VERSION =
    "2026-06-06.probe-south-f55-auxiliary-canvas-finger-inspect-reader-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CANVAS_FINGER_INSPECT_FILE =
    "/assets/hearth/hearth.canvas.finger.inspect.js";

  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v2";

  const NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";
  const PREVIOUS_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PREVIOUS_NORTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const LINEAGE_V9_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const LINEAGE_V8_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const LINEAGE_V7_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_TNT_v7";
  const BASELINE_V6_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_BISHOP_QUEEN_ACCEPTANCE_SCHEMA_ORCHESTRATOR_TNT_v6";
  const FOUNDATION_V5_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_TNT_v5";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = SOUTH_FILE;

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_CANVAS_SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const PROBE_SOUTH_FILE = FILE;

  const EXPECTED_HTML_CONTRACT =
    "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT =
    "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT =
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
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8";
  const EXPECTED_PROBE_NORTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_NORTH_FILE_COMPOSITION_ZONE_COORDINATOR_TNT_v1";
  const EXPECTED_PROBE_EAST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_EAST_SERVED_SOURCE_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_WEST_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_WEST_RENDERED_TARGET_FILE_COMPOSITION_TNT_v1";
  const EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT = PROBE_SOUTH_CONTRACT;

  const EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_AUXILIARY_SURFACE_TNT_v1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByProbe: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_PROBE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastReport = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastState = null;

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
        return bounded(JSON.stringify(value), 20000) || fallback;
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

  function firstKnown(...values) {
    for (const value of values) {
      const text = bounded(value, 8000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }
    return "UNKNOWN";
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === "none") continue;
      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1600);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }
    if (isObject(input)) return clonePlain(input);
    return {};
  }

  function extractChronology(input, currentReport) {
    if (Array.isArray(input && input.chronology)) return clonePlain(input.chronology);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) {
      return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    }
    if (typeof currentReport.CHRONOLOGY_SEQUENCE_JSON === "string") {
      try {
        const parsed = JSON.parse(currentReport.CHRONOLOGY_SEQUENCE_JSON);
        if (Array.isArray(parsed)) return parsed;
      } catch (_error) {
        return [];
      }
    }
    return [];
  }

  function chronologyText(chronology) {
    if (!Array.isArray(chronology)) return "UNKNOWN";

    return chronology.map((entry) => {
      return [
        `${entry.order || "?"}.${entry.id || "UNKNOWN"}`,
        `fib:${entry.fibonacciStage || "UNKNOWN"}`,
        `file:${entry.file || "UNKNOWN"}`,
        `load:${entry.loadStatus || "UNKNOWN"}`,
        `observed:${entry.observed}`,
        `call:${entry.callStatus || "UNKNOWN"}`,
        `status:${entry.status || "UNKNOWN"}`
      ].join(" ");
    }).join(" | ");
  }

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function getByPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!part) continue;
      if (!cursor || typeof cursor !== "object") return undefined;
      cursor = cursor[part];
    }

    return cursor;
  }

  function outputKeys(value) {
    if (!isObject(value)) return "NONE";
    return Object.keys(value).join(",") || "NONE";
  }

  function extractResultReport(result) {
    if (isObject(result && result.REPORT_OBJECT)) return clonePlain(result.REPORT_OBJECT);
    if (isObject(result && result.report)) return clonePlain(result.report);
    if (isObject(result && result.evidence)) return clonePlain(result.evidence);
    if (isObject(result && result.output) && isObject(result.output.REPORT_OBJECT)) {
      return clonePlain(result.output.REPORT_OBJECT);
    }
    if (isObject(result && result.output)) return clonePlain(result.output);
    if (isObject(result)) return clonePlain(result);
    return {};
  }

  const CANVAS_FINGER_INSPECT_ALIASES = Object.freeze([
    Object.freeze({
      order: 1,
      alias: "HEARTH.canvasFingerInspect",
      layer: "HEARTH",
      intent: "primary-auxiliary-canvas-finger-inspect"
    }),
    Object.freeze({
      order: 2,
      alias: "HEARTH.hearthCanvasFingerInspect",
      layer: "HEARTH",
      intent: "explicit-hearth-auxiliary-canvas-finger-inspect"
    }),
    Object.freeze({
      order: 3,
      alias: "HEARTH.canvasFingerInspector",
      layer: "HEARTH",
      intent: "inspector-language-compatibility"
    }),
    Object.freeze({
      order: 4,
      alias: "HEARTH_CANVAS_FINGER_INSPECT",
      layer: "GLOBAL",
      intent: "legacy-global-auxiliary-canvas-finger-inspect"
    }),
    Object.freeze({
      order: 5,
      alias: "HEARTH_CANVAS_FINGER_INSPECTOR",
      layer: "GLOBAL",
      intent: "legacy-global-inspector-language-compatibility"
    }),
    Object.freeze({
      order: 6,
      alias: "DEXTER_LAB.hearthCanvasFingerInspect",
      layer: "DEXTER_LAB",
      intent: "lab-visible-auxiliary-canvas-finger-inspect"
    }),
    Object.freeze({
      order: 7,
      alias: "DEXTER_LAB.hearthCanvasFingerInspector",
      layer: "DEXTER_LAB",
      intent: "lab-visible-inspector-language-compatibility"
    })
  ]);

  function aliasChronologyText(list) {
    return list.map((entry) => {
      return [
        `${entry.order}.${entry.alias}`,
        `layer:${entry.layer}`,
        `intent:${entry.intent}`
      ].join(" ");
    }).join(" | ");
  }

  function resolveCanvasFingerInspectApi() {
    for (const entry of CANVAS_FINGER_INSPECT_ALIASES) {
      const candidate = getByPath(entry.alias);
      if (candidate && typeof candidate === "object") {
        return {
          observed: true,
          api: candidate,
          sourcePath: entry.alias,
          aliasOrder: entry.order,
          aliasIntent: entry.intent
        };
      }
    }

    return {
      observed: false,
      api: null,
      sourcePath: "NONE",
      aliasOrder: 0,
      aliasIntent: "NONE"
    };
  }

  function requestAsyncScriptLoadOnce(src) {
    if (!root.document || !root.document.createElement || !root.document.head) {
      return "ASYNC_SCRIPT_LOAD_UNAVAILABLE_NO_DOCUMENT";
    }

    const existing = Array.prototype.slice.call(root.document.querySelectorAll("script[src]"))
      .some((script) => safeString(script.getAttribute("src")).indexOf(src) >= 0);

    if (existing) return "ASYNC_SCRIPT_TAG_ALREADY_PRESENT";

    try {
      const script = root.document.createElement("script");
      script.src = `${src}?v=${encodeURIComponent(EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT)}`;
      script.async = false;
      script.defer = false;
      script.setAttribute("data-hearth-diagnostic-auxiliary-load", "probe-south-f55");
      root.document.head.appendChild(script);
      return "ASYNC_SCRIPT_LOAD_REQUESTED_NOT_AVAILABLE_FOR_CURRENT_CALL";
    } catch (error) {
      return `ASYNC_SCRIPT_LOAD_REQUEST_FAILED:${bounded(error && error.message, 800)}`;
    }
  }

  function attemptSynchronousCanvasFingerInspectLoad() {
    const before = resolveCanvasFingerInspectApi();
    if (before.observed) {
      return {
        attempted: false,
        status: "ALREADY_OBSERVED",
        reason: "AUXILIARY_CANVAS_FINGER_INSPECT_ALIAS_PRESENT_BEFORE_LOAD",
        asyncFallbackStatus: "NOT_NEEDED"
      };
    }

    if (typeof root.XMLHttpRequest !== "function") {
      return {
        attempted: false,
        status: "SYNC_SCRIPT_LOAD_UNAVAILABLE",
        reason: "XMLHTTPREQUEST_UNAVAILABLE",
        asyncFallbackStatus: requestAsyncScriptLoadOnce(CANVAS_FINGER_INSPECT_FILE)
      };
    }

    try {
      const request = new root.XMLHttpRequest();
      request.open("GET", `${CANVAS_FINGER_INSPECT_FILE}?v=${encodeURIComponent(EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT)}`, false);
      request.send(null);

      const ok = request.status === 0 || (request.status >= 200 && request.status < 300);
      const source = request.responseText || "";

      if (!ok || !source) {
        return {
          attempted: true,
          status: "SYNC_SCRIPT_LOAD_FAILED",
          reason: `HTTP_STATUS_${request.status || "UNKNOWN"}_OR_EMPTY_SOURCE`,
          asyncFallbackStatus: requestAsyncScriptLoadOnce(CANVAS_FINGER_INSPECT_FILE)
        };
      }

      try {
        (0, eval)(`${source}\n//# sourceURL=${CANVAS_FINGER_INSPECT_FILE}`);
      } catch (evalError) {
        return {
          attempted: true,
          status: "SYNC_SCRIPT_EVAL_FAILED",
          reason: bounded(evalError && evalError.message, 1200),
          asyncFallbackStatus: requestAsyncScriptLoadOnce(CANVAS_FINGER_INSPECT_FILE)
        };
      }

      const after = resolveCanvasFingerInspectApi();

      return {
        attempted: true,
        status: after.observed
          ? "SYNC_SCRIPT_LOAD_COMPLETE"
          : "SYNC_SCRIPT_LOADED_BUT_ALIAS_NOT_OBSERVED",
        reason: after.observed
          ? "AUXILIARY_CANVAS_FINGER_INSPECT_ALIAS_OBSERVED_AFTER_SYNC_LOAD"
          : "SOURCE_EVALUATED_WITHOUT_EXPECTED_ALIAS",
        asyncFallbackStatus: "NOT_NEEDED"
      };
    } catch (error) {
      return {
        attempted: true,
        status: "SYNC_SCRIPT_LOAD_ERROR",
        reason: bounded(error && error.message, 1200),
        asyncFallbackStatus: requestAsyncScriptLoadOnce(CANVAS_FINGER_INSPECT_FILE)
      };
    }
  }

  function selectCallableMethod(auxApi) {
    if (!auxApi || typeof auxApi !== "object") {
      return { methodName: "NONE", method: null };
    }

    const names = [
      "runCanvasFingerInspect",
      "inspectCanvasFinger",
      "runFingerInspect",
      "inspectFinger",
      "runDiagnostic",
      "inspect",
      "getReport"
    ];

    for (const name of names) {
      if (typeof auxApi[name] === "function") {
        return { methodName: name, method: auxApi[name] };
      }
    }

    return { methodName: "NONE", method: null };
  }

  function inspectCanvasFinger(input, currentReport, chronology) {
    const load = attemptSynchronousCanvasFingerInspectLoad();
    const resolved = resolveCanvasFingerInspectApi();
    const callable = selectCallableMethod(resolved.api);

    if (!resolved.observed || !callable.method) {
      return {
        load,
        resolved,
        callAttempted: false,
        callStatus: resolved.observed
          ? "NOT_CALLED_NO_COMPATIBLE_METHOD"
          : "NOT_CALLED_AUXILIARY_NOT_OBSERVED",
        callError: "NONE",
        methodName: callable.methodName,
        result: {},
        report: {}
      };
    }

    try {
      const payload = {
        parentProbeSouthContract: PROBE_SOUTH_CONTRACT,
        parentProbeSouthReceipt: PROBE_SOUTH_RECEIPT,
        parentProbeSouthFile: FILE,
        parentNorthContract: firstKnown(currentReport.NORTH_CONTRACT, NORTH_CONTRACT),
        targetRoute: TARGET_ROUTE,
        diagnosticRoute: DIAGNOSTIC_ROUTE,
        canvasFile: CANVAS_FILE,
        canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
        auxiliaryTenthFileIsNotChronologyStep: true,
        productionMutationAuthorized: false,
        canvasDrawingAuthorized: false,
        canvasRepairAuthorized: false,
        runtimeRestartAuthorized: false,
        currentReport: clonePlain(currentReport),
        chronology: clonePlain(chronology),
        input: clonePlain(input || {})
      };

      const result = callable.methodName === "getReport"
        ? callable.method()
        : callable.method(payload);

      const report = extractResultReport(result);

      return {
        load,
        resolved,
        callAttempted: true,
        callStatus: "CALL_RETURNED",
        callError: "NONE",
        methodName: callable.methodName,
        result,
        report
      };
    } catch (error) {
      return {
        load,
        resolved,
        callAttempted: true,
        callStatus: "CALL_ERROR",
        callError: bounded(error && error.message, 1600),
        methodName: callable.methodName,
        result: {},
        report: {}
      };
    }
  }

  function buildSharedFields(input, currentReport, chronology) {
    return {
      PACKET_NAME: firstKnown(currentReport.PACKET_NAME, PACKET_NAME),
      TARGET_ROUTE: firstKnown(currentReport.TARGET_ROUTE, TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: firstKnown(currentReport.DIAGNOSTIC_ROUTE, DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: firstKnown(currentReport.DIAGNOSTIC_TIMESTAMP, input.diagnosticTimestamp, nowIso()),

      NORTH_CONTRACT: firstKnown(input.northContract, currentReport.NORTH_CONTRACT, NORTH_CONTRACT),
      NORTH_RECEIPT: firstKnown(input.northReceipt, currentReport.NORTH_RECEIPT, NORTH_RECEIPT),
      PREVIOUS_NORTH_CONTRACT: firstKnown(currentReport.PREVIOUS_NORTH_CONTRACT, PREVIOUS_NORTH_CONTRACT),
      PREVIOUS_NORTH_RECEIPT: firstKnown(currentReport.PREVIOUS_NORTH_RECEIPT, PREVIOUS_NORTH_RECEIPT),
      LINEAGE_V9_NORTH_CONTRACT: firstKnown(currentReport.LINEAGE_V9_NORTH_CONTRACT, LINEAGE_V9_NORTH_CONTRACT),
      LINEAGE_V8_NORTH_CONTRACT: firstKnown(currentReport.LINEAGE_V8_NORTH_CONTRACT, LINEAGE_V8_NORTH_CONTRACT),
      LINEAGE_V7_NORTH_CONTRACT: firstKnown(currentReport.LINEAGE_V7_NORTH_CONTRACT, LINEAGE_V7_NORTH_CONTRACT),
      BASELINE_V6_NORTH_CONTRACT: firstKnown(currentReport.BASELINE_V6_NORTH_CONTRACT, BASELINE_V6_NORTH_CONTRACT),
      FOUNDATION_V5_NORTH_CONTRACT: firstKnown(currentReport.FOUNDATION_V5_NORTH_CONTRACT, FOUNDATION_V5_NORTH_CONTRACT),

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", true), "true"),
      NORTH_IS_HUB_ONLY: boolText(getRaw(currentReport, "NORTH_IS_HUB_ONLY", true), "true"),
      NINE_STEP_CHRONOLOGY_ACTIVE: boolText(getRaw(currentReport, "NINE_STEP_CHRONOLOGY_ACTIVE", true), "true"),
      CANVAS_SURFACE_TRUTH_PROBE_EXPECTED: boolText(
        getRaw(currentReport, "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED", true),
        "true"
      ),
      EIGHT_WAY_PROBE_BRIDGE_ACTIVE: boolText(getRaw(currentReport, "EIGHT_WAY_PROBE_BRIDGE_ACTIVE", true), "true"),
      EIGHT_FILE_CHRONOLOGY_ACTIVE: boolText(getRaw(currentReport, "EIGHT_FILE_CHRONOLOGY_ACTIVE", true), "true"),
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: boolText(
        getRaw(currentReport, "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED", false),
        "false"
      ),
      RECEIVER_STILL_CALLS_NORTH_ONLY: boolText(getRaw(currentReport, "RECEIVER_STILL_CALLS_NORTH_ONLY", true), "true"),

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_CANVAS_SURFACE_TRUTH_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT: firstKnown(currentReport.EXPECTED_HTML_CONTRACT, EXPECTED_HTML_CONTRACT),
      EXPECTED_INDEX_JS_CONTRACT: firstKnown(currentReport.EXPECTED_INDEX_JS_CONTRACT, EXPECTED_INDEX_JS_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(
        currentReport.EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
        EXPECTED_ROUTE_CONDUCTOR_CONTRACT
      ),
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT: firstKnown(
        currentReport.EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
        EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT
      ),
      EXPECTED_CONTROL_CONTRACT: firstKnown(currentReport.EXPECTED_CONTROL_CONTRACT, EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: firstKnown(currentReport.EXPECTED_CANVAS_CONTRACT, EXPECTED_CANVAS_CONTRACT),
      EXPECTED_EAST_CONTRACT: firstKnown(currentReport.EXPECTED_EAST_CONTRACT, EXPECTED_EAST_CONTRACT),
      EXPECTED_WEST_CONTRACT: firstKnown(currentReport.EXPECTED_WEST_CONTRACT, EXPECTED_WEST_CONTRACT),
      EXPECTED_SOUTH_CONTRACT: firstKnown(currentReport.EXPECTED_SOUTH_CONTRACT, EXPECTED_SOUTH_CONTRACT),
      EXPECTED_PROBE_NORTH_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_NORTH_CONTRACT, EXPECTED_PROBE_NORTH_CONTRACT),
      EXPECTED_PROBE_EAST_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_EAST_CONTRACT, EXPECTED_PROBE_EAST_CONTRACT),
      EXPECTED_PROBE_WEST_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_WEST_CONTRACT, EXPECTED_PROBE_WEST_CONTRACT),
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
        EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT
      ),
      EXPECTED_PROBE_SOUTH_CONTRACT: firstKnown(currentReport.EXPECTED_PROBE_SOUTH_CONTRACT, EXPECTED_PROBE_SOUTH_CONTRACT),

      CHRONOLOGY_SEQUENCE: chronology,
      CHRONOLOGY_SEQUENCE_JSON: (() => {
        try {
          return JSON.stringify(chronology);
        } catch (_error) {
          return "[]";
        }
      })(),
      CHRONOLOGY_SEQUENCE_TEXT: firstKnown(currentReport.CHRONOLOGY_SEQUENCE_TEXT, chronologyText(chronology))
    };
  }

  function buildProbeSouthReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);
    const shared = buildSharedFields(input, currentReport, chronology);

    const southEntry = findChronologyEntry(chronology, "RAIL_SOUTH");
    const canvasSurfaceEntry = findChronologyEntry(chronology, "PROBE_CANVAS_SURFACE_TRUTH");

    const southObserved = Boolean(southEntry && southEntry.observed === true);
    const southReturned = Boolean(southEntry && southEntry.callStatus === "CALL_RETURNED");
    const southComplete = Boolean(southEntry && southEntry.status === "COMPLETE");
    const packetMeaningPreserved = southObserved && southReturned && southComplete;

    const canvasSurfaceReturned = Boolean(
      canvasSurfaceEntry &&
      canvasSurfaceEntry.observed === true &&
      canvasSurfaceEntry.callStatus === "CALL_RETURNED"
    );

    const canvasPixelBlank = (
      getValue(currentReport, "CANVAS_PIXEL_SAMPLE_STATUS", "") === "PIXEL_SAMPLE_BLANK" ||
      getValue(currentReport, "CANVAS_PIXEL_VARIANCE_STATUS", "") === "PIXEL_EMPTY_OR_TRANSPARENT" ||
      getValue(currentReport, "ZONE_OF_INFLICTION_CLASS", "") === "CANVAS_PIXEL_SAMPLE_NOT_VISIBLE"
    );

    const aux = inspectCanvasFinger(input, currentReport, chronology);
    const auxReport = aux.report || {};
    const auxReturned = aux.callStatus === "CALL_RETURNED";

    const auxContract = firstKnown(
      aux.resolved && aux.resolved.api && aux.resolved.api.contract,
      aux.resolved && aux.resolved.api && aux.resolved.api.CONTRACT,
      auxReport.CONTRACT,
      auxReport.contract,
      auxReport.CANVAS_FINGER_INSPECT_CONTRACT,
      EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT
    );

    const auxReceipt = firstKnown(
      aux.resolved && aux.resolved.api && aux.resolved.api.receipt,
      aux.resolved && aux.resolved.api && aux.resolved.api.RECEIPT,
      auxReport.RECEIPT,
      auxReport.receipt,
      auxReport.CANVAS_FINGER_INSPECT_RECEIPT,
      "UNKNOWN"
    );

    const auxStatus = auxReturned
      ? firstKnown(auxReport.CANVAS_FINGER_INSPECT_STATUS, auxReport.STATUS, "CALL_RETURNED")
      : aux.resolved.observed
        ? "OBSERVED_NOT_RETURNED"
        : "NOT_OBSERVED";

    const recommendedOwner = auxReturned
      ? firstKnown(
          auxReport.RECOMMENDED_NEXT_OWNER,
          auxReport.CANVAS_FINGER_INSPECT_RECOMMENDED_OWNER,
          currentReport.CANVAS_TRUTH_RECOMMENDED_OWNER,
          currentReport.RECOMMENDED_NEXT_OWNER,
          "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER"
        )
      : "DIAGNOSTIC_AUXILIARY_CANVAS_FINGER_INSPECT";

    const recommendedFile = auxReturned
      ? firstKnown(
          auxReport.RECOMMENDED_NEXT_FILE,
          auxReport.CANVAS_FINGER_INSPECT_RECOMMENDED_FILE,
          currentReport.CANVAS_TRUTH_RECOMMENDED_FILE,
          currentReport.RECOMMENDED_NEXT_FILE,
          CANVAS_FILE
        )
      : CANVAS_FINGER_INSPECT_FILE;

    const recommendedAction = auxReturned
      ? firstKnown(
          auxReport.RECOMMENDED_NEXT_ACTION,
          auxReport.CANVAS_FINGER_INSPECT_RECOMMENDED_ACTION,
          currentReport.CANVAS_TRUTH_RECOMMENDED_ACTION,
          currentReport.RECOMMENDED_NEXT_ACTION,
          "AUDIT_CANVAS_DRAW_PATH_AND_DOWNSTREAM_EXPRESSION_ADAPTER"
        )
      : "ENSURE_AUXILIARY_CANVAS_FINGER_INSPECT_FILE_IS_SERVED_AND_ALIASED";

    const diagnosticInstrumentStatus = auxReturned
      ? "UNDER_HOOD_CANVAS_FINGER_INSPECT_RETURNED"
      : "UNDER_HOOD_PROBE_LAYER_INCOMPLETE";

    const canvasExpressionInstrumentationStatus = auxReturned
      ? "CANVAS_FINGER_INSPECT_RETURNED_DEEPER_CANVAS_ADAPTER_EVIDENCE"
      : "CANVAS_EXPRESSION_INSTRUMENTATION_INCOMPLETE";

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "PROBE_SOUTH_PHYSICAL_F55_FILE_ACTIVE",
      "PROBE_SOUTH_PRESERVES_NINE_STEP_CHRONOLOGY",
      "PROBE_SOUTH_CONSUMES_AUXILIARY_TENTH_FILE_WITHOUT_PROMOTING_IT_TO_CHRONOLOGY",
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_REPAIR_CANVAS",
      "PROBE_SOUTH_DOES_NOT_RESTART_RUNTIME",
      "PROBE_SOUTH_DOES_NOT_CLAIM_READY_OR_VISUAL_PASS",
      packetMeaningPreserved
        ? "PROBE_SOUTH_CONFIRMED_SOUTH_RAIL_PACKET_RETURN_TO_NORTH"
        : "PROBE_SOUTH_SOUTH_RAIL_PACKET_RETURN_NOT_FULLY_CONFIRMED",
      canvasSurfaceReturned
        ? "PROBE_SOUTH_CONFIRMED_CANVAS_SURFACE_TRUTH_PROBE_RETURNED_BEFORE_SOUTH"
        : "PROBE_SOUTH_CANVAS_SURFACE_TRUTH_PARENT_ENTRY_NOT_FULLY_CONFIRMED",
      canvasPixelBlank
        ? "PROBE_SOUTH_PARENT_CANVAS_PIXEL_SAMPLE_BLANK_OBSERVED"
        : "PROBE_SOUTH_PARENT_CANVAS_PIXEL_SAMPLE_NOT_BLANK_OR_NOT_REPORTED",
      auxReturned
        ? "PROBE_SOUTH_AUXILIARY_CANVAS_FINGER_INSPECT_RETURNED"
        : `PROBE_SOUTH_AUXILIARY_CANVAS_FINGER_INSPECT_NOT_RETURNED:${aux.callStatus}`
    );

    const report = {
      ...shared,

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE: FILE,
      PROBE_SOUTH_CARRIER_FILE: SOUTH_FILE,

      PROBE_SOUTH_CHRONOLOGY_ORDER: "9",
      PROBE_SOUTH_FIBONACCI_STAGE: "F55",
      PROBE_SOUTH_GATE: "GATE_9_PROBE_TRUTH",
      PROBE_SOUTH_ROLE: "PACKET_MEANING_FILE_COMPOSITION_PROBE",
      PROBE_SOUTH_AUTHORITY: "PACKET_MEANING_AND_AUXILIARY_INSPECTION_RETURN_ONLY",
      PROBE_SOUTH_SOURCE_PATH: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PHYSICAL_FILE_OBSERVED: "true",
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "true",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: "true",
      PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL: "false",
      PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE: "true",

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: "COMPLETE",
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: boolText(packetMeaningPreserved, "false"),
      PROBE_SOUTH_MEANING_STATUS: packetMeaningPreserved
        ? "SOUTH_PACKET_OUTPUT_CONFIRMED_AND_AUXILIARY_CANVAS_FINGER_INSPECT_ATTEMPTED"
        : "PROBE_SOUTH_RETURNED_WITH_SOUTH_PACKET_CONFIRMATION_WARNING",
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: "RETURN_SURFACE_COMPLETE",
      PROBE_SOUTH_CHECKMARK_STATUS: packetMeaningPreserved
        ? "CHECKMARK_PASS"
        : "CHECKMARK_ACTIVE_WITH_SOUTH_GATE_WARNING",

      SOUTH_GATE_CONFIRMED_BY_PROBE: boolText(packetMeaningPreserved, "false"),
      SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE: boolText(Boolean(southEntry), "false"),
      SOUTH_RAIL_OBSERVED_BY_PROBE: boolText(southObserved, "false"),
      SOUTH_RAIL_CALL_RETURNED_BY_PROBE: boolText(southReturned, "false"),
      SOUTH_RAIL_CALL_METHOD_BY_PROBE: southEntry ? firstKnown(southEntry.callMethod, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY",
      SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE: southEntry ? firstKnown(southEntry.status, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY",

      CANVAS_SURFACE_TRUTH_PROBE_ENTRY_OBSERVED_BY_PROBE: boolText(Boolean(canvasSurfaceEntry), "false"),
      CANVAS_SURFACE_TRUTH_PROBE_RETURNED_BY_PROBE: boolText(canvasSurfaceReturned, "false"),
      CANVAS_SURFACE_TRUTH_PARENT_PIXEL_SAMPLE_STATUS: firstKnown(currentReport.CANVAS_PIXEL_SAMPLE_STATUS, "UNKNOWN"),
      CANVAS_SURFACE_TRUTH_PARENT_PIXEL_VISIBLE: firstKnown(currentReport.CANVAS_PIXEL_VISIBLE, "UNKNOWN"),
      CANVAS_SURFACE_TRUTH_PARENT_VARIANCE_STATUS: firstKnown(currentReport.CANVAS_PIXEL_VARIANCE_STATUS, "UNKNOWN"),
      CANVAS_SURFACE_TRUTH_PARENT_FAILURE_CLASS: firstKnown(
        currentReport.CANVAS_TRUTH_FAILURE_CLASS,
        currentReport.ZONE_OF_INFLICTION_CLASS,
        "UNKNOWN"
      ),
      CANVAS_SURFACE_TRUTH_PARENT_FAILURE_REASON: firstKnown(
        currentReport.CANVAS_TRUTH_FAILURE_REASON,
        currentReport.ZONE_OF_INFLICTION_REASON,
        "UNKNOWN"
      ),

      AUXILIARY_TENTH_FILE_IS_CHRONOLOGY_STEP: "false",
      AUXILIARY_TENTH_FILE_CONSUMED_BY_PROBE_SOUTH: "true",
      AUXILIARY_TENTH_FILE_ALLOWED_TO_CHANGE_DIAGNOSTIC_MEANING: "true",
      AUXILIARY_TENTH_FILE_ALLOWED_TO_CHANGE_CHRONOLOGY_ORDER: "false",

      CANVAS_FINGER_INSPECT_FILE,
      CANVAS_FINGER_INSPECT_EXPECTED_CONTRACT: EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT,
      CANVAS_FINGER_INSPECT_ALIAS_CHRONOLOGY: clonePlain(CANVAS_FINGER_INSPECT_ALIASES),
      CANVAS_FINGER_INSPECT_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(CANVAS_FINGER_INSPECT_ALIASES),
      CANVAS_FINGER_INSPECT_LOAD_ATTEMPTED: boolText(aux.load && aux.load.attempted, "false"),
      CANVAS_FINGER_INSPECT_LOAD_STATUS: firstKnown(aux.load && aux.load.status, "UNKNOWN"),
      CANVAS_FINGER_INSPECT_LOAD_REASON: firstKnown(aux.load && aux.load.reason, "UNKNOWN"),
      CANVAS_FINGER_INSPECT_ASYNC_FALLBACK_STATUS: firstKnown(aux.load && aux.load.asyncFallbackStatus, "UNKNOWN"),
      CANVAS_FINGER_INSPECT_OBSERVED: boolText(aux.resolved && aux.resolved.observed, "false"),
      CANVAS_FINGER_INSPECT_SOURCE_PATH: firstKnown(aux.resolved && aux.resolved.sourcePath, "NONE"),
      CANVAS_FINGER_INSPECT_ALIAS_ORDER: String((aux.resolved && aux.resolved.aliasOrder) || 0),
      CANVAS_FINGER_INSPECT_CALL_ATTEMPTED: boolText(aux.callAttempted, "false"),
      CANVAS_FINGER_INSPECT_CALL_METHOD: firstKnown(aux.methodName, "NONE"),
      CANVAS_FINGER_INSPECT_CALL_STATUS: aux.callStatus,
      CANVAS_FINGER_INSPECT_CALL_ERROR: firstKnown(aux.callError, "NONE"),
      CANVAS_FINGER_INSPECT_STATUS: auxStatus,
      CANVAS_FINGER_INSPECT_CONTRACT: auxContract,
      CANVAS_FINGER_INSPECT_RECEIPT: auxReceipt,
      CANVAS_FINGER_INSPECT_OUTPUT_KEYS: outputKeys(auxReport),
      CANVAS_FINGER_INSPECT_REPORT_SNAPSHOT: bounded(JSON.stringify(auxReport || {}), 20000),

      CANVAS_FINGER_INSPECT_CANVAS_FILE: firstKnown(auxReport.CANVAS_FILE, auxReport.canvasFile, CANVAS_FILE),
      CANVAS_FINGER_INSPECT_CANVAS_PARENT_CONTRACT: firstKnown(
        auxReport.CURRENT_CANVAS_PARENT_CONTRACT,
        auxReport.CANVAS_PARENT_CONTRACT,
        currentReport.CURRENT_CANVAS_PARENT_CONTRACT,
        "UNKNOWN"
      ),
      CANVAS_FINGER_INSPECT_CANVAS_PARENT_RECOGNIZED: firstKnown(
        auxReport.CURRENT_CANVAS_PARENT_RECOGNIZED,
        auxReport.CANVAS_PARENT_RECOGNIZED,
        currentReport.CURRENT_CANVAS_PARENT_RECOGNIZED,
        "UNKNOWN"
      ),
      CANVAS_FINGER_INSPECT_DRAW_PATH_STATUS: firstKnown(
        auxReport.CANVAS_DRAW_PATH_STATUS,
        auxReport.DRAW_PATH_STATUS,
        auxReport.VISIBLE_DRAW_PATH_STATUS,
        "UNKNOWN"
      ),
      CANVAS_FINGER_INSPECT_DOWNSTREAM_ADAPTER_STATUS: firstKnown(
        auxReport.DOWNSTREAM_EXPRESSION_ADAPTER_STATUS,
        auxReport.CANVAS_EXPRESSION_ADAPTER_STATUS,
        auxReport.CANVAS_FINGER_ADAPTER_STATUS,
        "UNKNOWN"
      ),
      CANVAS_FINGER_INSPECT_RENDERER_STATUS: firstKnown(
        auxReport.HEX_SURFACE_RENDERER_STATUS,
        auxReport.SURFACE_RENDERER_STATUS,
        auxReport.CANVAS_RENDERER_STATUS,
        "UNKNOWN"
      ),
      CANVAS_FINGER_INSPECT_PIXEL_WRITE_STATUS: firstKnown(
        auxReport.CANVAS_PIXEL_WRITE_STATUS,
        auxReport.PIXEL_WRITE_STATUS,
        auxReport.VISIBLE_PIXEL_WRITE_STATUS,
        currentReport.CANVAS_PIXEL_SAMPLE_STATUS,
        "UNKNOWN"
      ),

      DIAGNOSTIC_INSTRUMENT_STATUS: diagnosticInstrumentStatus,
      FILE_COMPOSITION_STATUS: auxReturned
        ? "SOURCE_COMPOSITION_REACHES_CANVAS_FILE_AND_AUXILIARY_CANVAS_FINGER_INSPECT"
        : "SOURCE_COMPOSITION_REACHES_CANVAS_FILE_OR_AUTHORITY",
      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS: canvasExpressionInstrumentationStatus,

      PRIMARY_CASE: canvasPixelBlank ? "CANVAS_SURFACE_TRUTH_FAILURE" : "CANVAS_SURFACE_TRUTH_NOT_PRIMARY_FAILURE",
      CALIBRATION_STATUS: canvasPixelBlank
        ? "CALIBRATION_HOLD_CANVAS_SURFACE_TRUTH"
        : "CALIBRATION_HOLD_PROBE_SOUTH_PACKET_MEANING",
      CALIBRATION_HOLD_REASON: canvasPixelBlank
        ? "PIXEL_SAMPLE_BLANK"
        : "PROBE_SOUTH_PACKET_MEANING_RETURNED_WITHOUT_PIXEL_BLANK_PARENT_SIGNAL",

      RECOMMENDED_NEXT_OWNER: recommendedOwner,
      RECOMMENDED_NEXT_FILE: recommendedFile,
      RECOMMENDED_NEXT_ACTION: recommendedAction,

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      MACRO_WEST_RELEASE_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORITY: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_REPAIR_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      ROUTE_CONDUCTOR_IMPLEMENTATION_AUTHORITY: "false",
      CONTROL_IMPLEMENTATION_AUTHORITY: "false",
      TERRAIN_TRUTH_AUTHORITY: "false",
      HYDROLOGY_TRUTH_AUTHORITY: "false",
      MATERIAL_TRUTH_AUTHORITY: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const packetText = composePacketText(report, orderedFields(report));
    const compactSummary = composeCompactSummary(report);

    return {
      ok: true,
      contract: PROBE_SOUTH_CONTRACT,
      CONTRACT: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      RECEIPT: PROBE_SOUTH_RECEIPT,
      implementationContract: PROBE_SOUTH_CONTRACT,
      implementationReceipt: PROBE_SOUTH_RECEIPT,

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: "COMPLETE",
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: report.PROBE_SOUTH_PACKET_MEANING_PRESERVED,
      PROBE_SOUTH_MEANING_STATUS: report.PROBE_SOUTH_MEANING_STATUS,
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: report.PROBE_SOUTH_RETURN_TO_NORTH_STATUS,

      CANVAS_FINGER_INSPECT_FILE,
      CANVAS_FINGER_INSPECT_STATUS: report.CANVAS_FINGER_INSPECT_STATUS,
      CANVAS_FINGER_INSPECT_OBSERVED: report.CANVAS_FINGER_INSPECT_OBSERVED,
      CANVAS_FINGER_INSPECT_CALL_STATUS: report.CANVAS_FINGER_INSPECT_CALL_STATUS,
      CANVAS_FINGER_INSPECT_OUTPUT_KEYS: report.CANVAS_FINGER_INSPECT_OUTPUT_KEYS,

      DIAGNOSTIC_INSTRUMENT_STATUS: report.DIAGNOSTIC_INSTRUMENT_STATUS,
      FILE_COMPOSITION_STATUS: report.FILE_COMPOSITION_STATUS,
      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS: report.CANVAS_EXPRESSION_INSTRUMENTATION_STATUS,
      RECOMMENDED_NEXT_OWNER: report.RECOMMENDED_NEXT_OWNER,
      RECOMMENDED_NEXT_FILE: report.RECOMMENDED_NEXT_FILE,
      RECOMMENDED_NEXT_ACTION: report.RECOMMENDED_NEXT_ACTION,

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        PROBE_SOUTH_STATUS: "COMPLETE",
        PROBE_SOUTH_CONTRACT,
        PROBE_SOUTH_RECEIPT,
        PROBE_SOUTH_RUN_STATUS: "COMPLETE",
        PROBE_SOUTH_MEANING_STATUS: report.PROBE_SOUTH_MEANING_STATUS,
        CANVAS_FINGER_INSPECT_STATUS: report.CANVAS_FINGER_INSPECT_STATUS,
        CANVAS_FINGER_INSPECT_CALL_STATUS: report.CANVAS_FINGER_INSPECT_CALL_STATUS,
        REPORT_OBJECT: report
      },
      packetText,
      compactSummary,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",

      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "PREVIOUS_NORTH_RECEIPT",
      "LINEAGE_V9_NORTH_CONTRACT",
      "LINEAGE_V8_NORTH_CONTRACT",
      "LINEAGE_V7_NORTH_CONTRACT",
      "BASELINE_V6_NORTH_CONTRACT",
      "FOUNDATION_V5_NORTH_CONTRACT",

      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "NINE_STEP_CHRONOLOGY_ACTIVE",
      "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED",
      "DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",

      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_IMPLEMENTATION_CONTRACT",
      "PROBE_SOUTH_IMPLEMENTATION_RECEIPT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_CARRIER_FILE",
      "PROBE_SOUTH_CHRONOLOGY_ORDER",
      "PROBE_SOUTH_FIBONACCI_STAGE",
      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROLE",
      "PROBE_SOUTH_AUTHORITY",
      "PROBE_SOUTH_SOURCE_PATH",
      "PROBE_SOUTH_PHYSICAL_FILE_OBSERVED",
      "PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE",
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_PACKET_MEANING_PRESERVED",
      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_RETURN_TO_NORTH_STATUS",
      "PROBE_SOUTH_CHECKMARK_STATUS",

      "SOUTH_GATE_CONFIRMED_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_CALL_RETURNED_BY_PROBE",
      "SOUTH_RAIL_CALL_METHOD_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE",

      "CANVAS_SURFACE_TRUTH_PROBE_ENTRY_OBSERVED_BY_PROBE",
      "CANVAS_SURFACE_TRUTH_PROBE_RETURNED_BY_PROBE",
      "CANVAS_SURFACE_TRUTH_PARENT_PIXEL_SAMPLE_STATUS",
      "CANVAS_SURFACE_TRUTH_PARENT_PIXEL_VISIBLE",
      "CANVAS_SURFACE_TRUTH_PARENT_VARIANCE_STATUS",
      "CANVAS_SURFACE_TRUTH_PARENT_FAILURE_CLASS",
      "CANVAS_SURFACE_TRUTH_PARENT_FAILURE_REASON",

      "AUXILIARY_TENTH_FILE_IS_CHRONOLOGY_STEP",
      "AUXILIARY_TENTH_FILE_CONSUMED_BY_PROBE_SOUTH",
      "AUXILIARY_TENTH_FILE_ALLOWED_TO_CHANGE_DIAGNOSTIC_MEANING",
      "AUXILIARY_TENTH_FILE_ALLOWED_TO_CHANGE_CHRONOLOGY_ORDER",

      "CANVAS_FINGER_INSPECT_FILE",
      "CANVAS_FINGER_INSPECT_EXPECTED_CONTRACT",
      "CANVAS_FINGER_INSPECT_LOAD_ATTEMPTED",
      "CANVAS_FINGER_INSPECT_LOAD_STATUS",
      "CANVAS_FINGER_INSPECT_LOAD_REASON",
      "CANVAS_FINGER_INSPECT_ASYNC_FALLBACK_STATUS",
      "CANVAS_FINGER_INSPECT_OBSERVED",
      "CANVAS_FINGER_INSPECT_SOURCE_PATH",
      "CANVAS_FINGER_INSPECT_CALL_ATTEMPTED",
      "CANVAS_FINGER_INSPECT_CALL_METHOD",
      "CANVAS_FINGER_INSPECT_CALL_STATUS",
      "CANVAS_FINGER_INSPECT_CALL_ERROR",
      "CANVAS_FINGER_INSPECT_STATUS",
      "CANVAS_FINGER_INSPECT_CONTRACT",
      "CANVAS_FINGER_INSPECT_RECEIPT",
      "CANVAS_FINGER_INSPECT_OUTPUT_KEYS",
      "CANVAS_FINGER_INSPECT_CANVAS_PARENT_CONTRACT",
      "CANVAS_FINGER_INSPECT_CANVAS_PARENT_RECOGNIZED",
      "CANVAS_FINGER_INSPECT_DRAW_PATH_STATUS",
      "CANVAS_FINGER_INSPECT_DOWNSTREAM_ADAPTER_STATUS",
      "CANVAS_FINGER_INSPECT_RENDERER_STATUS",
      "CANVAS_FINGER_INSPECT_PIXEL_WRITE_STATUS",

      "DIAGNOSTIC_INSTRUMENT_STATUS",
      "FILE_COMPOSITION_STATUS",
      "CANVAS_EXPRESSION_INSTRUMENTATION_STATUS",
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",

      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",

      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_WEST_FILE",
      "RAIL_SOUTH_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_WEST_FILE",
      "PROBE_CANVAS_SURFACE_TRUTH_FILE",
      "PROBE_SOUTH_FILE",

      "EXPECTED_HTML_CONTRACT",
      "EXPECTED_INDEX_JS_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_CONTRACT",
      "EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT",
      "EXPECTED_CONTROL_CONTRACT",
      "EXPECTED_CANVAS_CONTRACT",
      "EXPECTED_EAST_CONTRACT",
      "EXPECTED_WEST_CONTRACT",
      "EXPECTED_SOUTH_CONTRACT",
      "EXPECTED_PROBE_NORTH_CONTRACT",
      "EXPECTED_PROBE_EAST_CONTRACT",
      "EXPECTED_PROBE_WEST_CONTRACT",
      "EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT",
      "EXPECTED_PROBE_SOUTH_CONTRACT",

      "CHRONOLOGY_SEQUENCE_TEXT",
      "CHRONOLOGY_SEQUENCE_JSON",

      "SECONDARY_EVIDENCE_NOTES",
      "PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

    for (const field of priority.concat(Object.keys(report || {}))) {
      if (seen.has(field)) continue;
      seen.add(field);
      out.push(field);
    }

    return out;
  }

  function composePacketText(report, fields) {
    return (fields || Object.keys(report || {}))
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_CONTRACT", getValue(report, "PROBE_SOUTH_CONTRACT", PROBE_SOUTH_CONTRACT)),
      line("PROBE_SOUTH_RUN_STATUS", getValue(report, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_PACKET_MEANING_PRESERVED", getValue(report, "PROBE_SOUTH_PACKET_MEANING_PRESERVED", "UNKNOWN")),
      line("CANVAS_FINGER_INSPECT_STATUS", getValue(report, "CANVAS_FINGER_INSPECT_STATUS", "UNKNOWN")),
      line("CANVAS_FINGER_INSPECT_CALL_STATUS", getValue(report, "CANVAS_FINGER_INSPECT_CALL_STATUS", "UNKNOWN")),
      line("DIAGNOSTIC_INSTRUMENT_STATUS", getValue(report, "DIAGNOSTIC_INSTRUMENT_STATUS", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN"))
    ].join("\n");
  }

  function publishResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    lastReport = report;
    lastPacketText = result && result.packetText ? result.packetText : composePacketText(report, orderedFields(report));
    lastCompactSummary = result && result.compactSummary ? result.compactSummary : composeCompactSummary(report);

    lastState = {
      role: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_WITH_AUXILIARY_CANVAS_FINGER_INSPECT",
      contract: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      auxiliaryTenthFileIsChronologyStep: false,
      canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
      canvasFingerInspectStatus: getValue(report, "CANVAS_FINGER_INSPECT_STATUS", "UNKNOWN"),
      outputStatus: "COMPLETE",
      reportObject: clonePlain(report),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };

    publishAliases();
  }

  function runProbeSouth(input = {}) {
    const result = buildProbeSouthReport(input);
    publishResult(result);
    return result;
  }

  function inspectPacketMeaning(input = {}) {
    return runProbeSouth(input);
  }

  function inspectPacketComposition(input = {}) {
    return runProbeSouth(input);
  }

  function runProbe(input = {}) {
    return runProbeSouth(input);
  }

  function inspect(input = {}) {
    return runProbeSouth(input);
  }

  function runDiagnostic(input = {}) {
    return runProbeSouth(input);
  }

  function getReport() {
    if (lastReport) return clonePlain(lastReport);

    const result = buildProbeSouthReport({
      northContract: NORTH_CONTRACT,
      northReceipt: NORTH_RECEIPT,
      currentReport: {},
      chronology: []
    });

    publishResult(result);
    return clonePlain(lastReport);
  }

  function getPacketText() {
    if (lastPacketText) return lastPacketText;
    getReport();
    return lastPacketText;
  }

  function getCompactSummary() {
    if (lastCompactSummary) return lastCompactSummary;
    getReport();
    return lastCompactSummary;
  }

  function getState() {
    return clonePlain(lastState || {
      role: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_WITH_AUXILIARY_CANVAS_FINGER_INSPECT",
      contract: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      auxiliaryTenthFileIsChronologyStep: false,
      canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
      outputStatus: "READY",
      updatedAt: nowIso(),
      ...NO_CLAIMS
    });
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_PROBE",
      contract: PROBE_SOUTH_CONTRACT,
      CONTRACT: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      RECEIPT: PROBE_SOUTH_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      chronologyOrder: 9,
      fibonacciStage: "F55",
      gate: "GATE_9_PROBE_TRUTH",
      physicalFileObserved: true,
      publishedAsPhysicalFile: true,

      auxiliaryTenthFileIsChronologyStep: false,
      auxiliaryTenthFileConsumedByProbeSouth: true,
      canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
      expectedCanvasFingerInspectContract: EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT,
      canvasFingerInspectAliasChronology: clonePlain(CANVAS_FINGER_INSPECT_ALIASES),
      canvasFingerInspectAliasChronologyText: aliasChronologyText(CANVAS_FINGER_INSPECT_ALIASES),

      primaryCallableMethod: "runProbeSouth",
      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_FILE: FILE,
      SOUTH_FILE,
      CANVAS_FILE,
      CANVAS_FINGER_INSPECT_FILE,

      PACKET_NAME,
      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_CANVAS_SURFACE_TRUTH_FILE,
      PROBE_SOUTH_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_EAST_CONTRACT,
      EXPECTED_WEST_CONTRACT,
      EXPECTED_SOUTH_CONTRACT,
      EXPECTED_PROBE_NORTH_CONTRACT,
      EXPECTED_PROBE_EAST_CONTRACT,
      EXPECTED_PROBE_WEST_CONTRACT,
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,
      EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT,

      reportObject: clonePlain(lastReport || {}),
      state: getState(),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;
    root.HEARTH.probeSouth = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getReceipt();

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastReport || {});

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_PACKET_TEXT = lastPacketText || "";
  }

  Object.assign(api, {
    contract: PROBE_SOUTH_CONTRACT,
    CONTRACT: PROBE_SOUTH_CONTRACT,
    receipt: PROBE_SOUTH_RECEIPT,
    RECEIPT: PROBE_SOUTH_RECEIPT,
    version: VERSION,

    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    chronologyOrder: 9,
    fibonacciStage: "F55",
    gate: "GATE_9_PROBE_TRUTH",
    role: "PACKET_MEANING_FILE_COMPOSITION_PROBE",
    authority: "PACKET_MEANING_AND_AUXILIARY_INSPECTION_RETURN_ONLY",

    physicalFileObserved: true,
    publishedAsPhysicalFile: true,
    auxiliaryTenthFileIsChronologyStep: false,
    auxiliaryTenthFileConsumedByProbeSouth: true,
    canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
    expectedCanvasFingerInspectContract: EXPECTED_CANVAS_FINGER_INSPECT_CONTRACT,
    canvasFingerInspectAliasChronology: CANVAS_FINGER_INSPECT_ALIASES,
    canvasFingerInspectAliasChronologyText: aliasChronologyText(CANVAS_FINGER_INSPECT_ALIASES),

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeCanvasSurfaceTruthFile: PROBE_CANVAS_SURFACE_TRUTH_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    expectedHtmlContract: EXPECTED_HTML_CONTRACT,
    expectedIndexJsContract: EXPECTED_INDEX_JS_CONTRACT,
    expectedRouteConductorContract: EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
    expectedRouteConductorLineageContract: EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    runProbe,
    inspect,
    runDiagnostic,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,

    runProbeSouthApiAvailable: true,
    inspectPacketMeaningApiAvailable: true,
    inspectPacketCompositionApiAvailable: true,
    runProbeApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    macroWestReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasDrawingAuthority: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    routeConductorImplementationAuthority: false,
    controlImplementationAuthority: false,
    terrainTruthAuthority: false,
    hydrologyTruthAuthority: false,
    materialTruthAuthority: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  lastState = {
    role: "DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_WITH_AUXILIARY_CANVAS_FINGER_INSPECT",
    contract: PROBE_SOUTH_CONTRACT,
    receipt: PROBE_SOUTH_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    chronologyOrder: 9,
    fibonacciStage: "F55",
    auxiliaryTenthFileIsChronologyStep: false,
    canvasFingerInspectFile: CANVAS_FINGER_INSPECT_FILE,
    outputStatus: "READY",
    updatedAt: nowIso(),
    ...NO_CLAIMS
  };

  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
