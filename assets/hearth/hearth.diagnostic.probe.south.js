// /assets/hearth/hearth.diagnostic.probe.south.js
// HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1
// Full-file replacement.
// Diagnostic probe SOUTH only.
// Purpose:
// - Preserve PROBE_SOUTH as the final diagnostic-only packet-meaning probe in the NORTH chronology.
// - Return a North-readable receipt packet, report object, packet text, and compact summary.
// - Preserve the nine-step chronology introduced by NORTH v11.
// - Inspect SOUTH packet output and the Canvas surface-truth handoff read-only.
// - Include read-only inspection of SOUTH/finger-extension surfaces without making optional finger extensions block receipt return.
// - Restore the diagnostic receipt return surface without mutating production, Canvas, controls, runtime, terrain, hydrology, or materials.
// Does not own:
// - diagnostic UI shell
// - production route repair
// - Hearth runtime restart
// - Canvas drawing
// - Canvas release
// - Macro West release
// - Lab runtime authority
// - Queen/control implementation
// - finger implementation
// - terrain/material/hydrology truth
// - final visual pass
// - F13 claim
// - F21 latch

(() => {
  "use strict";

  const CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";
  const IMPLEMENTATION_CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_IMPL_TNT_v1_1";
  const IMPLEMENTATION_RECEIPT = "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_IMPL_RECEIPT_v1_1";

  const VERSION = "2026-06-06.hearth-diagnostic-probe-south-packet-meaning-file-composition-v1-1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const NORTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const NORTH_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";
  const PREVIOUS_NORTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const PREVIOUS_NORTH_RECEIPT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";
  const LINEAGE_V9_NORTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_EIGHT_WAY_PROBE_BRIDGE_ORCHESTRATOR_TNT_v9";
  const LINEAGE_V8_NORTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_EXPRESSION_WEST_STANDARD_ORCHESTRATOR_TNT_v8";
  const LINEAGE_V7_NORTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_POST_SOUTH_NEWS_FIBONACCI_ALIGNMENT_ORCHESTRATOR_TNT_v7";
  const BASELINE_V6_NORTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_BISHOP_QUEEN_ACCEPTANCE_SCHEMA_ORCHESTRATOR_TNT_v6";
  const FOUNDATION_V5_NORTH_CONTRACT = "HEARTH_DIAGNOSTIC_RAIL_NORTH_LAB_CANVAS_BRIDGE_SCHEMA_ORCHESTRATOR_TNT_v5";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_CANVAS_SURFACE_TRUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const PROBE_SOUTH_FILE = FILE;

  const HTML_FILE = "/showroom/globe/hearth/index.html";
  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";

  const EXPECTED_HTML_CONTRACT = "HEARTH_HTML_ROUTE_CONDUCTOR_OWNS_CONTROL_HANDSHAKE_SHELL_TNT_v5_1";
  const EXPECTED_INDEX_JS_CONTRACT = "HEARTH_INDEX_JS_FRONTEND_BUTTON_AUTHORITY_RESET_TNT_v5_4";
  const EXPECTED_ROUTE_CONDUCTOR_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_SHOWTIME_NEWS_FIBONACCI_QUEEN_CANVAS_SYNC_TNT_v10";
  const EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT = "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const EXPECTED_CONTROL_CONTRACT = "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_CANVAS_CONTRACT = "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT = "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const EXPECTED_PROBE_SOUTH_CONTRACT = CONTRACT;

  const REPORT_PACKET = "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_PACKET_v1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
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
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
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
  let lastReceipt = null;
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

  function clonePlain(value) {
    if (value === undefined || value === null) return value;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function packetValue(value, fallback = "UNKNOWN", limit = 20000) {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value) || isObject(value)) {
      try {
        const text = JSON.stringify(value);
        return text ? text.slice(0, limit) : fallback;
      } catch (_error) {
        return bounded(value, limit) || fallback;
      }
    }

    return bounded(value, limit) || fallback;
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
      const text = bounded(value, 5000);
      if (!text) continue;
      if (["UNKNOWN", "NONE", "NOT_FOUND", "UNREADABLE", "INACCESSIBLE"].includes(text)) continue;
      return text;
    }

    return "UNKNOWN";
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function textIsTrue(value) {
    return boolText(value, "false") === "true";
  }

  function textIsFalse(value) {
    return boolText(value, "UNKNOWN") === "false";
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "") continue;
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
    for (const path of paths || []) {
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
      "getReport",
      "getState",
      "getStatus",
      "getProbeReceipt",
      "getSouthReceipt"
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
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function getReportFromAuthority(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = ["getReport", "getState", "getReceipt", "getReceiptLight"];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.REPORT_OBJECT)) return authority.REPORT_OBJECT;
    return null;
  }

  function parseMaybeJson(value) {
    if (Array.isArray(value) || isObject(value)) return value;

    const text = safeString(value).trim();
    if (!text) return null;
    if (!text.startsWith("[") && !text.startsWith("{")) return null;

    try {
      return JSON.parse(text);
    } catch (_error) {
      return null;
    }
  }

  function extractCurrentReport(input) {
    const candidates = [
      getRaw(input, "currentReport", null),
      getRaw(input, "report", null),
      getRaw(input, "REPORT_OBJECT", null),
      root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_REPORT,
      root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_REPORT,
      root.HEARTH_DIAGNOSTIC_NORTH_REPORT,
      root.HEARTH_DIAGNOSTIC_RAIL_REPORT,
      root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_REPORT
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return clonePlain(candidate);
    }

    return {};
  }

  function extractCurrentVerdict(input) {
    const candidates = [
      getRaw(input, "northVerdict", null),
      getRaw(input, "verdict", null),
      root.HEARTH_DIAGNOSTIC_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_VERDICT,
      root.HEARTH_DIAGNOSTIC_NORTH_CHRONOLOGY_HUB_VERDICT,
      root.HEARTH_DIAGNOSTIC_NORTH_VERDICT,
      root.HEARTH_DIAGNOSTIC_RAIL_VERDICT,
      root.HEARTH_PARALLEL_DIAGNOSTIC_RAIL_VERDICT
    ];

    for (const candidate of candidates) {
      if (isObject(candidate)) return clonePlain(candidate);
    }

    return {};
  }

  function extractChronology(input, currentReport, currentVerdict) {
    const candidates = [
      getRaw(input, "chronology", null),
      getRaw(currentReport, "CHRONOLOGY_SEQUENCE", null),
      getRaw(currentReport, "CHRONOLOGY_SEQUENCE_JSON", null),
      getRaw(currentVerdict, "chronology", null)
    ];

    for (const candidate of candidates) {
      const parsed = parseMaybeJson(candidate);
      if (Array.isArray(parsed)) return parsed.map((entry) => clonePlain(entry));
      if (Array.isArray(candidate)) return candidate.map((entry) => clonePlain(entry));
    }

    return [];
  }

  function chronologyText(chronology) {
    return (chronology || []).map((entry) => {
      return [
        `${getValue(entry, "order", "?")}.${getValue(entry, "id", "UNKNOWN_STEP")}`,
        `fib:${getValue(entry, "fibonacciStage", "UNKNOWN")}`,
        `file:${getValue(entry, "file", "UNKNOWN")}`,
        `load:${getValue(entry, "loadStatus", "UNKNOWN")}`,
        `observed:${getValue(entry, "observed", "UNKNOWN")}`,
        `call:${getValue(entry, "callStatus", "UNKNOWN")}`,
        `status:${getValue(entry, "status", "UNKNOWN")}`
      ].join(" ");
    }).join(" | ");
  }

  function inspectSouthRail() {
    const found = findFirstPath([
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH_DIAGNOSTIC_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "DEXTER_LAB.hearthDiagnosticSouth",
      "DEXTER_LAB.hearthDiagnosticRailSouth"
    ]);

    const receipt = getReceiptFromAuthority(found.value) || {};
    const report = getReportFromAuthority(found.value) || {};

    return {
      observed: Boolean(found.value),
      sourcePath: found.path,
      contract: firstKnown(
        getRaw(receipt, "contract", ""),
        getRaw(receipt, "CONTRACT", ""),
        getRaw(report, "SOUTH_CONTRACT", ""),
        getRaw(report, "contract", "")
      ),
      receipt: firstKnown(
        getRaw(receipt, "receipt", ""),
        getRaw(receipt, "RECEIPT", ""),
        getRaw(report, "SOUTH_RECEIPT", ""),
        getRaw(report, "receipt", "")
      ),
      outputStatus: firstKnown(
        getRaw(report, "SOUTH_OUTPUT_STATUS", ""),
        getRaw(report, "southOutputStatus", ""),
        getRaw(receipt, "southOutputStatus", ""),
        found.value ? "OBSERVED" : "UNKNOWN"
      ),
      meaningPreserved: firstKnown(
        getRaw(report, "SOUTH_MEANING_PRESERVED", ""),
        getRaw(report, "southMeaningPreserved", ""),
        getRaw(receipt, "southMeaningPreserved", ""),
        "UNKNOWN"
      ),
      report
    };
  }

  function inspectCanvasSurfaceTruth(input, currentReport) {
    const probe = findFirstPath([
      "HEARTH.diagnosticProbeCanvasSurfaceTruth",
      "HEARTH.diagnosticCanvasSurfaceTruthProbe",
      "HEARTH.diagnosticRailProbeCanvasSurfaceTruth",
      "HEARTH.canvasSurfaceTruthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH",
      "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH",
      "DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth",
      "DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe",
      "DEXTER_LAB.hearthCanvasSurfaceTruthProbe"
    ]);

    const probeReport = getReportFromAuthority(probe.value) || {};
    const probeReceipt = getReceiptFromAuthority(probe.value) || {};
    const inputEvidence = isObject(getRaw(input, "evidenceByStep", null))
      ? getRaw(getRaw(input, "evidenceByStep", {}), "PROBE_CANVAS_SURFACE_TRUTH", {})
      : {};

    const source = Object.assign({}, probeReceipt, probeReport, inputEvidence, currentReport);

    return {
      probeObserved: Boolean(probe.value),
      probeSourcePath: probe.path,
      probeContract: firstKnown(
        getRaw(source, "CANVAS_SURFACE_TRUTH_PROBE_CONTRACT", ""),
        getRaw(source, "EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT", ""),
        getRaw(probeReceipt, "contract", ""),
        getRaw(probeReceipt, "CONTRACT", ""),
        EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT
      ),
      probeStatus: firstKnown(
        getRaw(source, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", ""),
        getRaw(source, "PROBE_CANVAS_SURFACE_TRUTH_STATUS", ""),
        probe.value ? "OBSERVED" : "UNKNOWN"
      ),
      available: firstKnown(getRaw(source, "CANVAS_SURFACE_TRUTH_AVAILABLE", ""), probe.value ? "true" : "UNKNOWN"),
      canvasElementFound: firstKnown(getRaw(source, "CANVAS_ELEMENT_FOUND", ""), "UNKNOWN"),
      canvasSelector: firstKnown(getRaw(source, "CANVAS_SELECTOR", ""), "UNKNOWN"),
      canvasMountFound: firstKnown(getRaw(source, "CANVAS_MOUNT_FOUND", ""), "UNKNOWN"),
      canvasMountSelector: firstKnown(getRaw(source, "CANVAS_MOUNT_SELECTOR", ""), "UNKNOWN"),
      canvasInMount: firstKnown(getRaw(source, "CANVAS_IN_MOUNT", ""), "UNKNOWN"),
      canvasRectNonzero: firstKnown(getRaw(source, "CANVAS_RECT_NONZERO", ""), "UNKNOWN"),
      canvasComputedVisible: firstKnown(getRaw(source, "CANVAS_COMPUTED_VISIBLE", ""), "UNKNOWN"),
      canvasViewportIntersecting: firstKnown(getRaw(source, "CANVAS_VIEWPORT_INTERSECTING", ""), "UNKNOWN"),
      canvasContext2dReady: firstKnown(getRaw(source, "CANVAS_CONTEXT_2D_READY", ""), "UNKNOWN"),
      canvasPixelSampleStatus: firstKnown(getRaw(source, "CANVAS_PIXEL_SAMPLE_STATUS", ""), "UNKNOWN"),
      canvasPixelVisible: firstKnown(getRaw(source, "CANVAS_PIXEL_VISIBLE", ""), "UNKNOWN"),
      canvasLayerBlocked: firstKnown(getRaw(source, "CANVAS_LAYER_BLOCKED", ""), "UNKNOWN"),
      canvasLayerBlocker: firstKnown(getRaw(source, "CANVAS_LAYER_BLOCKER", ""), "UNKNOWN"),
      canvasNamespacePresent: firstKnown(getRaw(source, "CANVAS_NAMESPACE_PRESENT", ""), "UNKNOWN"),
      canvasNamespaceMatchesDomSurface: firstKnown(getRaw(source, "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE", ""), "UNKNOWN"),
      canvasParentContractRecognized: firstKnown(getRaw(source, "CANVAS_PARENT_CONTRACT_RECOGNIZED", ""), "UNKNOWN"),
      firstFailedCoordinate: firstKnown(getRaw(source, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", ""), "UNKNOWN"),
      failureClass: firstKnown(getRaw(source, "CANVAS_TRUTH_FAILURE_CLASS", ""), "UNKNOWN"),
      failureReason: firstKnown(getRaw(source, "CANVAS_TRUTH_FAILURE_REASON", ""), "UNKNOWN"),
      recommendedOwner: firstKnown(getRaw(source, "CANVAS_TRUTH_RECOMMENDED_OWNER", ""), "UNKNOWN"),
      recommendedFile: firstKnown(getRaw(source, "CANVAS_TRUTH_RECOMMENDED_FILE", ""), "UNKNOWN"),
      recommendedAction: firstKnown(getRaw(source, "CANVAS_TRUTH_RECOMMENDED_ACTION", ""), "UNKNOWN")
    };
  }

  function describeAuthority(path, value) {
    const receipt = getReceiptFromAuthority(value) || {};
    const report = getReportFromAuthority(value) || {};
    const merged = Object.assign({}, receipt, report, isObject(value) ? value : {});
    const name = path.split(".").pop() || path;

    const status = firstKnown(
      getRaw(merged, "status", ""),
      getRaw(merged, "STATUS", ""),
      getRaw(merged, "fingerStatus", ""),
      getRaw(merged, "FINGER_STATUS", ""),
      getRaw(merged, "expressionStatus", ""),
      getRaw(merged, "CANVAS_FINGER_EXPRESSION_STATUS", ""),
      "OBSERVED"
    );

    const activeRaw = firstKnown(
      getRaw(merged, "active", ""),
      getRaw(merged, "ACTIVE", ""),
      getRaw(merged, "ready", ""),
      getRaw(merged, "READY", ""),
      getRaw(merged, "loaded", ""),
      getRaw(merged, "LOADED", ""),
      "UNKNOWN"
    );

    const activeByStatus = /ACTIVE|READY|COMPLETE|LOADED|OBSERVED/i.test(status);
    const active = textIsTrue(activeRaw) || (activeRaw === "UNKNOWN" && activeByStatus);

    return {
      path,
      name,
      observed: true,
      active,
      status,
      contract: firstKnown(
        getRaw(merged, "contract", ""),
        getRaw(merged, "CONTRACT", ""),
        getRaw(merged, "fingerContract", ""),
        getRaw(merged, "FINGER_CONTRACT", ""),
        "UNKNOWN"
      ),
      receipt: firstKnown(
        getRaw(merged, "receipt", ""),
        getRaw(merged, "RECEIPT", ""),
        getRaw(merged, "fingerReceipt", ""),
        getRaw(merged, "FINGER_RECEIPT", ""),
        "UNKNOWN"
      ),
      boundaryLike: /boundary/i.test(path + " " + name),
      massLike: /mass/i.test(path + " " + name),
      surfaceLike: /surface/i.test(path + " " + name),
      pointerLike: /pointer/i.test(path + " " + name),
      lightLike: /light/i.test(path + " " + name),
      hexLike: /hex/i.test(path + " " + name),
      canvasLike: /canvas/i.test(path + " " + name)
    };
  }

  function inspectFingerExtensions() {
    const candidatePaths = [
      "HEARTH.southFingerExtensions",
      "HEARTH.diagnosticSouthFingerExtensions",
      "HEARTH.diagnosticSouthFingerExtensionReceipt",
      "HEARTH.canvasFingerExtensions",
      "HEARTH.canvasFingers",
      "HEARTH.canvasFingerExpression",
      "HEARTH.canvasFingerExpressionProof",
      "HEARTH.fingerExtensions",
      "HEARTH.fingerExtensionHub",
      "HEARTH.boundaryFinger",
      "HEARTH.massFinger",
      "HEARTH.surfaceFinger",
      "HEARTH.pointerFinger",
      "HEARTH.lightFinger",
      "HEARTH.hexFingerExtensions",
      "HEARTH.hexFourPairFingerExtensions",
      "DEXTER_LAB.hearthSouthFingerExtensions",
      "DEXTER_LAB.hearthDiagnosticSouthFingerExtensions",
      "DEXTER_LAB.hearthCanvasFingerExtensions",
      "DEXTER_LAB.hearthCanvasFingers",
      "DEXTER_LAB.hearthCanvasFingerExpression",
      "DEXTER_LAB.hearthFingerExtensions",
      "DEXTER_LAB.hearthBoundaryFinger",
      "DEXTER_LAB.hearthMassFinger",
      "DEXTER_LAB.hearthSurfaceFinger",
      "DEXTER_LAB.hearthPointerFinger",
      "DEXTER_LAB.hearthLightFinger",
      "HEARTH_SOUTH_FINGER_EXTENSIONS",
      "HEARTH_DIAGNOSTIC_SOUTH_FINGER_EXTENSIONS",
      "HEARTH_CANVAS_FINGER_EXTENSIONS",
      "HEARTH_CANVAS_FINGER_EXPRESSION",
      "HEARTH_FINGER_EXTENSIONS",
      "HEARTH_BOUNDARY_FINGER",
      "HEARTH_MASS_FINGER",
      "HEARTH_SURFACE_FINGER",
      "HEARTH_POINTER_FINGER",
      "HEARTH_LIGHT_FINGER"
    ];

    const seenPaths = new Set();
    const descriptors = [];

    function add(path, value) {
      if (!path || seenPaths.has(path) || !value) return;
      seenPaths.add(path);
      descriptors.push(describeAuthority(path, value));
    }

    for (const path of candidatePaths) {
      add(path, readPath(path));
    }

    const dynamicSources = [
      { prefix: "HEARTH", object: root.HEARTH },
      { prefix: "DEXTER_LAB", object: root.DEXTER_LAB },
      { prefix: "ROOT", object: root }
    ];

    for (const source of dynamicSources) {
      if (!isObject(source.object)) continue;

      let keys = [];
      try {
        keys = Object.keys(source.object).slice(0, 800);
      } catch (_error) {
        keys = [];
      }

      for (const key of keys) {
        const full = source.prefix === "ROOT" ? key : `${source.prefix}.${key}`;
        if (seenPaths.has(full)) continue;

        const hearthScoped = source.prefix !== "ROOT" || /^HEARTH_|^hearth/i.test(key);
        const looksLikeFinger = /(finger|boundary|mass|surface|pointer|light)/i.test(key);
        if (!hearthScoped || !looksLikeFinger) continue;

        const value = source.object[key];
        if (!value || !(isObject(value) || isFunction(value))) continue;

        add(full, value);
        if (descriptors.length >= 60) break;
      }

      if (descriptors.length >= 60) break;
    }

    const active = descriptors.filter((entry) => entry.active);
    const hasBoundary = descriptors.some((entry) => entry.boundaryLike);
    const hasMass = descriptors.some((entry) => entry.massLike);
    const hasSurface = descriptors.some((entry) => entry.surfaceLike);
    const hasPointer = descriptors.some((entry) => entry.pointerLike);
    const hasLight = descriptors.some((entry) => entry.lightLike);
    const hasHex = descriptors.some((entry) => entry.hexLike);
    const hasCanvas = descriptors.some((entry) => entry.canvasLike);

    return {
      inspectionStatus: descriptors.length
        ? "FINGER_EXTENSIONS_OBSERVED_READ_ONLY"
        : "FINGER_EXTENSIONS_NOT_OBSERVED_NON_BLOCKING",
      observedCount: descriptors.length,
      activeCount: active.length,
      requiredForReceipt: false,
      missingBlocksReceipt: false,
      boundaryPresent: hasBoundary,
      massPresent: hasMass,
      surfacePresent: hasSurface,
      pointerPresent: hasPointer,
      lightPresent: hasLight,
      hexPresent: hasHex,
      canvasPresent: hasCanvas,
      descriptors,
      notes: descriptors.length
        ? [`FINGER_EXTENSION_READ_ONLY_INSPECTION_COUNT:${descriptors.length}`]
        : ["FINGER_EXTENSION_READ_ONLY_INSPECTION_NONE_OBSERVED_NON_BLOCKING"]
    };
  }

  function deriveCanvasSurfaceDisposition(canvasTruth) {
    if (
      textIsTrue(canvasTruth.canvasElementFound) &&
      textIsTrue(canvasTruth.canvasRectNonzero) &&
      textIsTrue(canvasTruth.canvasComputedVisible) &&
      textIsTrue(canvasTruth.canvasViewportIntersecting) &&
      textIsTrue(canvasTruth.canvasContext2dReady) &&
      textIsTrue(canvasTruth.canvasPixelVisible) &&
      !textIsTrue(canvasTruth.canvasLayerBlocked)
    ) {
      return {
        className: "CANVAS_SURFACE_TRUTH_CONFIRMED",
        reason: "CANVAS_DOM_SURFACE_CONTEXT_VISIBILITY_AND_PIXEL_SAMPLE_CONFIRMED",
        owner: "NONE",
        file: "NONE",
        action: "NO_DIAGNOSTIC_PROBE_SOUTH_REPAIR_REQUIRED"
      };
    }

    if (textIsFalse(canvasTruth.canvasPixelVisible)) {
      return {
        className: "CANVAS_PIXEL_SAMPLE_NOT_VISIBLE",
        reason: firstKnown(canvasTruth.canvasPixelSampleStatus, "CANVAS_PIXEL_VISIBLE_FALSE"),
        owner: "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        file: CANVAS_FILE,
        action: "AUDIT_CANVAS_DRAW_PATH_AND_DOWNSTREAM_EXPRESSION_ADAPTER"
      };
    }

    if (canvasTruth.failureClass !== "UNKNOWN") {
      return {
        className: canvasTruth.failureClass,
        reason: firstKnown(canvasTruth.failureReason, "CANVAS_SURFACE_TRUTH_FAILURE_REPORTED_BY_PROBE"),
        owner: firstKnown(canvasTruth.recommendedOwner, "CANVAS_SURFACE_TRUTH_PROBE"),
        file: firstKnown(canvasTruth.recommendedFile, CANVAS_FILE),
        action: firstKnown(canvasTruth.recommendedAction, "AUDIT_CANVAS_SURFACE_TRUTH_FAILURE")
      };
    }

    return {
      className: "CANVAS_SURFACE_TRUTH_INHERITED_FROM_NORTH",
      reason: "PROBE_SOUTH_PRESERVED_NORTH_CANVAS_SURFACE_TRUTH_MEANING_WITHOUT_RECLASSIFICATION",
      owner: "NORTH_VERDICT_OR_CANVAS_SURFACE_TRUTH_PROBE",
      file: PROBE_CANVAS_SURFACE_TRUTH_FILE,
      action: "READ_NORTH_VERDICT_FOR_CANVAS_SURFACE_TRUTH_CLASS"
    };
  }

  function buildReport(input = {}) {
    const timestamp = nowIso();
    const currentReport = extractCurrentReport(input);
    const currentVerdict = extractCurrentVerdict(input);
    const chronology = extractChronology(input, currentReport, currentVerdict);
    const southRail = inspectSouthRail();
    const canvasTruth = inspectCanvasSurfaceTruth(input, currentReport);
    const finger = inspectFingerExtensions();
    const canvasDisposition = deriveCanvasSurfaceDisposition(canvasTruth);

    const completeChronologyCount = chronology.filter((entry) => {
      return getValue(entry, "status", "UNKNOWN") === "COMPLETE";
    }).length;

    const nineStepObserved = chronology.length >= 9;
    const allObservedChronologyReturned = nineStepObserved && completeChronologyCount >= 9;
    const probeSouthChronologyEntry = chronology.find((entry) => getValue(entry, "id", "") === "PROBE_SOUTH") || null;

    const notes = normalizeNotes(
      getRaw(currentReport, "SECONDARY_EVIDENCE_NOTES", ""),
      getRaw(currentReport, "NORTH_SECONDARY_EVIDENCE_NOTES", ""),
      finger.notes,
      [
        "PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_ACTIVE",
        "PROBE_SOUTH_RECEIPT_RETURN_SURFACE_READY",
        "PROBE_SOUTH_IS_DIAGNOSTIC_ONLY",
        "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
        "PROBE_SOUTH_DOES_NOT_DRAW_CANVAS",
        "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
        "PROBE_SOUTH_DOES_NOT_CLAIM_READY_TEXT_OR_VISUAL_PASS",
        "SOUTH_FINGER_EXTENSIONS_INSPECTED_READ_ONLY_OPTIONAL_NON_BLOCKING"
      ]
    );

    const chronologyCompletionStatus = allObservedChronologyReturned
      ? firstKnown(getRaw(currentReport, "CHRONOLOGY_COMPLETION_STATUS", ""), "CHRONOLOGY_COMPLETE_PROBE_SOUTH_RETURN_READY")
      : "CHRONOLOGY_READABLE_BUT_NOT_FULLY_COMPLETE_AT_PROBE_SOUTH";

    const report = {
      PACKET_NAME: REPORT_PACKET,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: timestamp,

      PROBE_SOUTH_STATUS: "COMPLETE",
      PROBE_SOUTH_CONTRACT: CONTRACT,
      PROBE_SOUTH_RECEIPT: RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT: IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT: IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_CARRIER_FILE: FILE,
      PROBE_SOUTH_CHRONOLOGY_ORDER: 9,
      PROBE_SOUTH_FIBONACCI_STAGE: "F55",
      PROBE_SOUTH_GATE: "FINAL_PACKET_MEANING_RETURN_TO_NORTH",
      PROBE_SOUTH_ROLE: "packet-meaning-file-composition-probe",
      PROBE_SOUTH_AUTHORITY: "DIAGNOSTIC_PROBE_SOUTH_ONLY",
      PROBE_SOUTH_SOURCE_PATH: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PHYSICAL_FILE_OBSERVED: true,
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "PHYSICAL_FILE_AND_PUBLIC_API_AVAILABLE",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: true,
      PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL: false,
      PROBE_SOUTH_PUBLISHED_AS_PHYSICAL_FILE: true,
      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: "CALL_RETURNED",
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: true,
      PROBE_SOUTH_MEANING_STATUS: "PACKET_MEANING_PRESERVED_WITH_CANVAS_TRUTH_AND_FINGER_EXTENSION_INSPECTION",
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: "RETURN_PACKET_READY",
      PROBE_SOUTH_RETURN_PACKET_READY: true,

      RECEIPT_RETURN_MECHANISM_STATUS: "RESTORED_PACKET_SURFACE_READY",
      DIAGNOSTIC_RECEIPT_RETURN_STATUS: "REPORT_OBJECT_PACKET_TEXT_COMPACT_SUMMARY_AND_RECEIPT_AVAILABLE",
      RETURN_REPORT_OBJECT_AVAILABLE: true,
      RETURN_PACKET_TEXT_AVAILABLE: true,
      RETURN_COMPACT_SUMMARY_AVAILABLE: true,
      RETURN_RECEIPT_OBJECT_AVAILABLE: true,
      NORTH_READABLE_RECEIPT_SURFACE_READY: true,
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: true,

      NORTH_CONTRACT: firstKnown(getRaw(input, "northContract", ""), getRaw(currentReport, "NORTH_CONTRACT", ""), NORTH_CONTRACT),
      NORTH_RECEIPT: firstKnown(getRaw(input, "northReceipt", ""), getRaw(currentReport, "NORTH_RECEIPT", ""), NORTH_RECEIPT),
      PREVIOUS_NORTH_CONTRACT: firstKnown(getRaw(input, "previousNorthContract", ""), getRaw(currentReport, "PREVIOUS_NORTH_CONTRACT", ""), PREVIOUS_NORTH_CONTRACT),
      PREVIOUS_NORTH_RECEIPT,
      LINEAGE_V9_NORTH_CONTRACT,
      LINEAGE_V8_NORTH_CONTRACT,
      LINEAGE_V7_NORTH_CONTRACT,
      BASELINE_V6_NORTH_CONTRACT,
      FOUNDATION_V5_NORTH_CONTRACT,

      NORTH_CHRONOLOGY_HUB_ACTIVE: true,
      NORTH_IS_HUB_ONLY: true,
      NINE_STEP_CHRONOLOGY_ACTIVE: true,
      CANVAS_SURFACE_TRUTH_PROBE_EXPECTED: true,
      DIAGNOSTIC_ROUTE_HTML_RENEWAL_REQUIRED: false,
      RECEIVER_STILL_CALLS_NORTH_ONLY: true,

      RAIL_NORTH_FILE,
      RAIL_EAST_FILE,
      RAIL_WEST_FILE,
      RAIL_SOUTH_FILE,
      PROBE_NORTH_FILE,
      PROBE_EAST_FILE,
      PROBE_WEST_FILE,
      PROBE_CANVAS_SURFACE_TRUTH_FILE,
      PROBE_SOUTH_FILE,

      HTML_FILE,
      INDEX_FILE,
      ROUTE_CONDUCTOR_FILE,
      CONTROL_FILE,
      CANVAS_FILE,

      EXPECTED_HTML_CONTRACT,
      EXPECTED_INDEX_JS_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT,
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT,
      EXPECTED_CONTROL_CONTRACT,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      CHRONOLOGY_SEQUENCE: clonePlain(chronology),
      CHRONOLOGY_SEQUENCE_JSON: clonePlain(chronology),
      CHRONOLOGY_SEQUENCE_TEXT: chronologyText(chronology),
      CHRONOLOGY_STEP_COUNT_OBSERVED: chronology.length,
      CHRONOLOGY_STEP_COUNT_COMPLETE: completeChronologyCount,
      CHRONOLOGY_NINE_STEP_OBSERVED: nineStepObserved,
      CHRONOLOGY_PROBE_SOUTH_ENTRY_OBSERVED: Boolean(probeSouthChronologyEntry),
      CHRONOLOGY_COMPLETION_STATUS: chronologyCompletionStatus,
      FIRST_CHRONOLOGY_FAILURE_OWNER: firstKnown(getRaw(currentReport, "FIRST_CHRONOLOGY_FAILURE_OWNER", ""), allObservedChronologyReturned ? "NONE" : "UNKNOWN"),
      FIRST_CHRONOLOGY_FAILURE_FILE: firstKnown(getRaw(currentReport, "FIRST_CHRONOLOGY_FAILURE_FILE", ""), allObservedChronologyReturned ? "NONE" : "UNKNOWN"),
      FIRST_CHRONOLOGY_FAILURE_CLASS: firstKnown(getRaw(currentReport, "FIRST_CHRONOLOGY_FAILURE_CLASS", ""), allObservedChronologyReturned ? "NONE" : "UNKNOWN"),
      FIRST_CHRONOLOGY_FAILURE_REASON: firstKnown(getRaw(currentReport, "FIRST_CHRONOLOGY_FAILURE_REASON", ""), allObservedChronologyReturned ? "ALL_OBSERVED_CHRONOLOGY_STEPS_RETURNED_OR_WERE_READABLE" : "CHRONOLOGY_NOT_FULLY_OBSERVED_BY_PROBE_SOUTH"),

      SOUTH_RAIL_OBSERVED: southRail.observed,
      SOUTH_RAIL_SOURCE_PATH: southRail.sourcePath,
      SOUTH_RAIL_CONTRACT: southRail.contract,
      SOUTH_RAIL_RECEIPT: southRail.receipt,
      SOUTH_OUTPUT_STATUS: firstKnown(southRail.outputStatus, getRaw(currentReport, "SOUTH_OUTPUT_STATUS", ""), "COMPLETE"),
      SOUTH_MEANING_PRESERVED: firstKnown(southRail.meaningPreserved, getRaw(currentReport, "SOUTH_MEANING_PRESERVED", ""), "true"),

      CANVAS_SURFACE_TRUTH_PROBE_FILE: PROBE_CANVAS_SURFACE_TRUTH_FILE,
      CANVAS_SURFACE_TRUTH_PROBE_CONTRACT: canvasTruth.probeContract,
      CANVAS_SURFACE_TRUTH_PROBE_OBSERVED_BY_PROBE_SOUTH: canvasTruth.probeObserved,
      CANVAS_SURFACE_TRUTH_PROBE_SOURCE_PATH: canvasTruth.probeSourcePath,
      CANVAS_SURFACE_TRUTH_PROBE_STATUS: canvasTruth.probeStatus,
      CANVAS_SURFACE_TRUTH_AVAILABLE: canvasTruth.available,
      CANVAS_ELEMENT_FOUND: canvasTruth.canvasElementFound,
      CANVAS_SELECTOR: canvasTruth.canvasSelector,
      CANVAS_MOUNT_FOUND: canvasTruth.canvasMountFound,
      CANVAS_MOUNT_SELECTOR: canvasTruth.canvasMountSelector,
      CANVAS_IN_MOUNT: canvasTruth.canvasInMount,
      CANVAS_RECT_NONZERO: canvasTruth.canvasRectNonzero,
      CANVAS_COMPUTED_VISIBLE: canvasTruth.canvasComputedVisible,
      CANVAS_VIEWPORT_INTERSECTING: canvasTruth.canvasViewportIntersecting,
      CANVAS_CONTEXT_2D_READY: canvasTruth.canvasContext2dReady,
      CANVAS_PIXEL_SAMPLE_STATUS: canvasTruth.canvasPixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: canvasTruth.canvasPixelVisible,
      CANVAS_LAYER_BLOCKED: canvasTruth.canvasLayerBlocked,
      CANVAS_LAYER_BLOCKER: canvasTruth.canvasLayerBlocker,
      CANVAS_NAMESPACE_PRESENT: canvasTruth.canvasNamespacePresent,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: canvasTruth.canvasNamespaceMatchesDomSurface,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: canvasTruth.canvasParentContractRecognized,
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: firstKnown(canvasTruth.firstFailedCoordinate, textIsFalse(canvasTruth.canvasPixelVisible) ? "CANVAS_PIXEL_VISIBLE" : "UNKNOWN"),
      CANVAS_TRUTH_FAILURE_CLASS: canvasDisposition.className,
      CANVAS_TRUTH_FAILURE_REASON: canvasDisposition.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: canvasDisposition.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: canvasDisposition.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: canvasDisposition.action,

      SOUTH_FINGER_EXTENSION_INSPECTION_STATUS: finger.inspectionStatus,
      SOUTH_FINGER_EXTENSION_OBSERVED_COUNT: finger.observedCount,
      SOUTH_FINGER_EXTENSION_ACTIVE_COUNT: finger.activeCount,
      SOUTH_FINGER_EXTENSION_REQUIRED_FOR_RECEIPT: finger.requiredForReceipt,
      SOUTH_FINGER_EXTENSION_MISSING_BLOCKS_RECEIPT: finger.missingBlocksReceipt,
      SOUTH_FINGER_EXTENSION_BOUNDARY_PRESENT: finger.boundaryPresent,
      SOUTH_FINGER_EXTENSION_MASS_PRESENT: finger.massPresent,
      SOUTH_FINGER_EXTENSION_SURFACE_PRESENT: finger.surfacePresent,
      SOUTH_FINGER_EXTENSION_POINTER_PRESENT: finger.pointerPresent,
      SOUTH_FINGER_EXTENSION_LIGHT_PRESENT: finger.lightPresent,
      SOUTH_FINGER_EXTENSION_HEX_PRESENT: finger.hexPresent,
      SOUTH_FINGER_EXTENSION_CANVAS_PRESENT: finger.canvasPresent,
      SOUTH_FINGER_EXTENSION_DESCRIPTORS: clonePlain(finger.descriptors),

      FILE_COMPOSITION_STATUS: "SOURCE_COMPOSITION_REACHES_PROBE_SOUTH_PACKET_MEANING_AND_RETURN_SURFACE",
      DIAGNOSTIC_INSTRUMENT_STATUS: "NINE_STEP_PROBE_BRIDGE_PRESENT_WITH_PROBE_SOUTH_RETURN_SURFACE",
      CANVAS_EXPRESSION_INSTRUMENTATION_STATUS: firstKnown(getRaw(currentReport, "CANVAS_EXPRESSION_INSTRUMENTATION_STATUS", ""), "PRESERVED_FROM_NORTH_OR_CANVAS_SURFACE_TRUTH_PROBE"),

      PRIMARY_CASE: firstKnown(getRaw(currentReport, "PRIMARY_CASE", ""), canvasDisposition.className === "CANVAS_SURFACE_TRUTH_CONFIRMED" ? "PROBE_SOUTH_RECEIPT_RETURN_READY" : "CANVAS_SURFACE_TRUTH_FAILURE_PRESERVED_BY_PROBE_SOUTH"),
      CALIBRATION_STATUS: firstKnown(getRaw(currentReport, "CALIBRATION_STATUS", ""), canvasDisposition.className === "CANVAS_SURFACE_TRUTH_CONFIRMED" ? "CALIBRATION_TRACK_COMPLETE" : "CALIBRATION_HOLD_CANVAS_SURFACE_TRUTH"),
      CALIBRATION_HOLD_REASON: firstKnown(getRaw(currentReport, "CALIBRATION_HOLD_REASON", ""), canvasDisposition.reason),
      DIAGNOSTIC_CHRONOLOGY_CLEAN: firstKnown(getRaw(currentReport, "DIAGNOSTIC_CHRONOLOGY_CLEAN", ""), allObservedChronologyReturned ? "true" : "false"),
      DIAGNOSTIC_RAIL_CLEAN: firstKnown(getRaw(currentReport, "DIAGNOSTIC_RAIL_CLEAN", ""), canvasDisposition.className === "CANVAS_SURFACE_TRUTH_CONFIRMED" ? "true" : "false"),
      CALIBRATION_POINT_REACHED: firstKnown(getRaw(currentReport, "CALIBRATION_POINT_REACHED", ""), canvasDisposition.className === "CANVAS_SURFACE_TRUTH_CONFIRMED" ? "true" : "false"),

      ZONE_OF_INFLICTION_OWNER: firstKnown(getRaw(currentReport, "ZONE_OF_INFLICTION_OWNER", ""), canvasDisposition.owner),
      ZONE_OF_INFLICTION_FILE: firstKnown(getRaw(currentReport, "ZONE_OF_INFLICTION_FILE", ""), canvasDisposition.file),
      ZONE_OF_INFLICTION_CLASS: firstKnown(getRaw(currentReport, "ZONE_OF_INFLICTION_CLASS", ""), canvasDisposition.className),
      ZONE_OF_INFLICTION_REASON: firstKnown(getRaw(currentReport, "ZONE_OF_INFLICTION_REASON", ""), canvasDisposition.reason),

      RECOMMENDED_NEXT_OWNER: firstKnown(getRaw(currentReport, "RECOMMENDED_NEXT_OWNER", ""), canvasDisposition.owner),
      RECOMMENDED_NEXT_FILE: firstKnown(getRaw(currentReport, "RECOMMENDED_NEXT_FILE", ""), canvasDisposition.file),
      RECOMMENDED_NEXT_ACTION: firstKnown(getRaw(currentReport, "RECOMMENDED_NEXT_ACTION", ""), canvasDisposition.action),

      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_STATUS: firstKnown(getRaw(currentReport, "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_STATUS", ""), allObservedChronologyReturned ? "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_COMPLETE" : "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_PARTIAL"),
      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_SCORE: firstKnown(getRaw(currentReport, "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_SCORE", ""), allObservedChronologyReturned ? "100" : String(Math.round((completeChronologyCount / 9) * 100))),
      DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_FIRST_FAILED_STAGE: firstKnown(getRaw(currentReport, "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_FIRST_FAILED_STAGE", ""), allObservedChronologyReturned ? "NONE" : "PROBE_SOUTH_INPUT_CHRONOLOGY_INCOMPLETE"),
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_STATUS: firstKnown(getRaw(currentReport, "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_STATUS", ""), allObservedChronologyReturned ? "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_COMPLETE" : "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_PARTIAL"),
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_SCORE: firstKnown(getRaw(currentReport, "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_SCORE", ""), allObservedChronologyReturned ? "100" : String(Math.round((completeChronologyCount / 9) * 100))),
      DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: firstKnown(getRaw(currentReport, "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE", ""), allObservedChronologyReturned ? "NONE" : "F55:PROBE_SOUTH_INPUT_CHRONOLOGY_INCOMPLETE"),

      NEWS_ALIGNMENT_STATUS: firstKnown(getRaw(currentReport, "NEWS_ALIGNMENT_STATUS", ""), allObservedChronologyReturned ? "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_COMPLETE" : "DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_PARTIAL"),
      NEWS_ALIGNMENT_SCORE: firstKnown(getRaw(currentReport, "NEWS_ALIGNMENT_SCORE", ""), allObservedChronologyReturned ? "100" : String(Math.round((completeChronologyCount / 9) * 100))),
      NEWS_ALIGNMENT_FIRST_FAILED_STAGE: firstKnown(getRaw(currentReport, "NEWS_ALIGNMENT_FIRST_FAILED_STAGE", ""), allObservedChronologyReturned ? "NONE" : "PROBE_SOUTH_INPUT_CHRONOLOGY_INCOMPLETE"),
      FIBONACCI_SYNCHRONIZATION_STATUS: firstKnown(getRaw(currentReport, "FIBONACCI_SYNCHRONIZATION_STATUS", ""), allObservedChronologyReturned ? "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_COMPLETE" : "DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_PARTIAL"),
      FIBONACCI_SYNCHRONIZATION_SCORE: firstKnown(getRaw(currentReport, "FIBONACCI_SYNCHRONIZATION_SCORE", ""), allObservedChronologyReturned ? "100" : String(Math.round((completeChronologyCount / 9) * 100))),
      FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: firstKnown(getRaw(currentReport, "FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE", ""), allObservedChronologyReturned ? "NONE" : "F55:PROBE_SOUTH_INPUT_CHRONOLOGY_INCOMPLETE"),

      CANVAS_STANDARD_NEWS_ALIGNMENT_STATUS: firstKnown(getRaw(currentReport, "CANVAS_STANDARD_NEWS_ALIGNMENT_STATUS", ""), "PRESERVED_FROM_NORTH"),
      CANVAS_STANDARD_NEWS_ALIGNMENT_SCORE: firstKnown(getRaw(currentReport, "CANVAS_STANDARD_NEWS_ALIGNMENT_SCORE", ""), "UNKNOWN"),
      CANVAS_STANDARD_NEWS_ALIGNMENT_FIRST_FAILED_STAGE: firstKnown(getRaw(currentReport, "CANVAS_STANDARD_NEWS_ALIGNMENT_FIRST_FAILED_STAGE", ""), "UNKNOWN"),
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_STATUS: firstKnown(getRaw(currentReport, "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_STATUS", ""), "PRESERVED_FROM_NORTH"),
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_SCORE: firstKnown(getRaw(currentReport, "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_SCORE", ""), "UNKNOWN"),
      CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE: firstKnown(getRaw(currentReport, "CANVAS_STANDARD_FIBONACCI_SYNCHRONIZATION_FIRST_FAILED_STAGE", ""), "UNKNOWN"),

      SECONDARY_EVIDENCE_NOTES: notes.join(" | ") || "none",
      PROBE_SOUTH_NOTES: notes.join(" | ") || "none",

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    report.PROBE_SOUTH_PACKET_TEXT_READY = true;
    report.PROBE_SOUTH_COMPACT_SUMMARY_READY = true;
    report.PROBE_SOUTH_REPORT_OBJECT_READY = true;
    report.PROBE_SOUTH_RECEIPT_OBJECT_READY = true;

    return report;
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_IMPLEMENTATION_CONTRACT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_CARRIER_FILE",
      "PROBE_SOUTH_CHRONOLOGY_ORDER",
      "PROBE_SOUTH_FIBONACCI_STAGE",
      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROLE",
      "PROBE_SOUTH_AUTHORITY",
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_PACKET_MEANING_PRESERVED",
      "PROBE_SOUTH_MEANING_STATUS",
      "PROBE_SOUTH_RETURN_TO_NORTH_STATUS",
      "RECEIPT_RETURN_MECHANISM_STATUS",
      "DIAGNOSTIC_RECEIPT_RETURN_STATUS",
      "RETURN_REPORT_OBJECT_AVAILABLE",
      "RETURN_PACKET_TEXT_AVAILABLE",
      "RETURN_COMPACT_SUMMARY_AVAILABLE",
      "RETURN_RECEIPT_OBJECT_AVAILABLE",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "NORTH_CHRONOLOGY_HUB_ACTIVE",
      "NORTH_IS_HUB_ONLY",
      "NINE_STEP_CHRONOLOGY_ACTIVE",
      "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED",
      "RECEIVER_STILL_CALLS_NORTH_ONLY",
      "CHRONOLOGY_COMPLETION_STATUS",
      "CHRONOLOGY_STEP_COUNT_OBSERVED",
      "CHRONOLOGY_STEP_COUNT_COMPLETE",
      "CHRONOLOGY_NINE_STEP_OBSERVED",
      "CHRONOLOGY_PROBE_SOUTH_ENTRY_OBSERVED",
      "CHRONOLOGY_SEQUENCE_TEXT",
      "CHRONOLOGY_SEQUENCE_JSON",
      "SOUTH_RAIL_OBSERVED",
      "SOUTH_RAIL_SOURCE_PATH",
      "SOUTH_RAIL_CONTRACT",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_MEANING_PRESERVED",
      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_SURFACE_TRUTH_AVAILABLE",
      "CANVAS_ELEMENT_FOUND",
      "CANVAS_RECT_NONZERO",
      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_LAYER_BLOCKED",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",
      "SOUTH_FINGER_EXTENSION_INSPECTION_STATUS",
      "SOUTH_FINGER_EXTENSION_OBSERVED_COUNT",
      "SOUTH_FINGER_EXTENSION_ACTIVE_COUNT",
      "SOUTH_FINGER_EXTENSION_REQUIRED_FOR_RECEIPT",
      "SOUTH_FINGER_EXTENSION_MISSING_BLOCKS_RECEIPT",
      "SOUTH_FINGER_EXTENSION_BOUNDARY_PRESENT",
      "SOUTH_FINGER_EXTENSION_MASS_PRESENT",
      "SOUTH_FINGER_EXTENSION_SURFACE_PRESENT",
      "SOUTH_FINGER_EXTENSION_POINTER_PRESENT",
      "SOUTH_FINGER_EXTENSION_LIGHT_PRESENT",
      "SOUTH_FINGER_EXTENSION_DESCRIPTORS",
      "FILE_COMPOSITION_STATUS",
      "DIAGNOSTIC_INSTRUMENT_STATUS",
      "PRIMARY_CASE",
      "CALIBRATION_STATUS",
      "CALIBRATION_HOLD_REASON",
      "DIAGNOSTIC_CHRONOLOGY_CLEAN",
      "DIAGNOSTIC_RAIL_CLEAN",
      "CALIBRATION_POINT_REACHED",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "SECONDARY_EVIDENCE_NOTES",
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

  function composePacketText(report) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_CONTRACT", getValue(report, "PROBE_SOUTH_CONTRACT", CONTRACT)),
      line("PROBE_SOUTH_RETURN_TO_NORTH_STATUS", getValue(report, "PROBE_SOUTH_RETURN_TO_NORTH_STATUS", "UNKNOWN")),
      line("RECEIPT_RETURN_MECHANISM_STATUS", getValue(report, "RECEIPT_RETURN_MECHANISM_STATUS", "UNKNOWN")),
      line("CHRONOLOGY_COMPLETION_STATUS", getValue(report, "CHRONOLOGY_COMPLETION_STATUS", "UNKNOWN")),
      line("CANVAS_SURFACE_TRUTH_PROBE_STATUS", getValue(report, "CANVAS_SURFACE_TRUTH_PROBE_STATUS", "UNKNOWN")),
      line("CANVAS_PIXEL_VISIBLE", getValue(report, "CANVAS_PIXEL_VISIBLE", "UNKNOWN")),
      line("SOUTH_FINGER_EXTENSION_INSPECTION_STATUS", getValue(report, "SOUTH_FINGER_EXTENSION_INSPECTION_STATUS", "UNKNOWN")),
      line("SOUTH_FINGER_EXTENSION_OBSERVED_COUNT", getValue(report, "SOUTH_FINGER_EXTENSION_OBSERVED_COUNT", "UNKNOWN")),
      line("RECOMMENDED_NEXT_FILE", getValue(report, "RECOMMENDED_NEXT_FILE", "UNKNOWN")),
      line("RECOMMENDED_NEXT_ACTION", getValue(report, "RECOMMENDED_NEXT_ACTION", "UNKNOWN"))
    ].join("\n");
  }

  function simpleHash(text) {
    let hash = 2166136261;

    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    return `h${(hash >>> 0).toString(16)}`;
  }

  function applySignature(report) {
    const clone = clonePlain(report || {});
    delete clone.DIAGNOSTIC_TIMESTAMP;
    delete clone.RECEIPT_SIGNATURE;
    delete clone.PREVIOUS_RECEIPT_SIGNATURE;
    delete clone.PREVIOUS_RECEIPT_TIMESTAMP;
    delete clone.POTENTIAL_REPEAT_SIGNATURE;

    const material = JSON.stringify(clone);
    const signature = simpleHash(material);
    const key = "HEARTH_DIAGNOSTIC_PROBE_SOUTH_LAST_SIGNATURE";

    report.RECEIPT_SIGNATURE = signature;
    report.REPEAT_SIGNATURE_BASIS = "PROBE_SOUTH_REPORT_WITH_TIMESTAMP_AND_SIGNATURE_FIELDS_REMOVED";

    try {
      const previousRaw = root.localStorage && root.localStorage.getItem(key);
      const previous = previousRaw ? JSON.parse(previousRaw) : null;

      report.PREVIOUS_RECEIPT_SIGNATURE = previous && previous.signature ? previous.signature : "NONE";
      report.PREVIOUS_RECEIPT_TIMESTAMP = previous && previous.timestamp ? previous.timestamp : "NONE";
      report.POTENTIAL_REPEAT_SIGNATURE = Boolean(previous && previous.signature === signature && previous.timestamp !== report.DIAGNOSTIC_TIMESTAMP);

      if (root.localStorage) {
        root.localStorage.setItem(key, JSON.stringify({
          signature,
          timestamp: report.DIAGNOSTIC_TIMESTAMP,
          contract: CONTRACT,
          returnStatus: report.PROBE_SOUTH_RETURN_TO_NORTH_STATUS
        }));
      }
    } catch (_error) {
      report.PREVIOUS_RECEIPT_SIGNATURE = "LOCAL_STORAGE_UNREADABLE";
      report.PREVIOUS_RECEIPT_TIMESTAMP = "LOCAL_STORAGE_UNREADABLE";
      report.POTENTIAL_REPEAT_SIGNATURE = false;
    }

    return report;
  }

  function buildReceipt(report) {
    const source = report || lastReport || buildReport({});

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      packetName: REPORT_PACKET,

      parentNorthContract: NORTH_CONTRACT,
      parentNorthReceipt: NORTH_RECEIPT,
      previousNorthContract: PREVIOUS_NORTH_CONTRACT,
      previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,

      chronologyOrder: 9,
      fibonacciStage: "F55",
      role: "packet-meaning-file-composition-probe",
      authority: "DIAGNOSTIC_PROBE_SOUTH_ONLY",

      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getStateApiAvailable: true,

      receiptReturnMechanismStatus: getValue(source, "RECEIPT_RETURN_MECHANISM_STATUS", "RESTORED_PACKET_SURFACE_READY"),
      probeSouthReturnToNorthStatus: getValue(source, "PROBE_SOUTH_RETURN_TO_NORTH_STATUS", "RETURN_PACKET_READY"),
      returnReportObjectAvailable: true,
      returnPacketTextAvailable: true,
      returnCompactSummaryAvailable: true,
      returnReceiptObjectAvailable: true,

      southFingerExtensionInspectionStatus: getValue(source, "SOUTH_FINGER_EXTENSION_INSPECTION_STATUS", "UNKNOWN"),
      southFingerExtensionObservedCount: getValue(source, "SOUTH_FINGER_EXTENSION_OBSERVED_COUNT", "UNKNOWN"),
      southFingerExtensionActiveCount: getValue(source, "SOUTH_FINGER_EXTENSION_ACTIVE_COUNT", "UNKNOWN"),
      southFingerExtensionRequiredForReceipt: false,
      southFingerExtensionMissingBlocksReceipt: false,

      reportObjectReady: true,
      packetTextReady: true,
      compactSummaryReady: true,
      physicalFileObserved: true,
      declaredFilePathRetained: true,

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

      reportObject: clonePlain(source),
      packetText: lastPacketText || composePacketText(source),
      compactSummary: lastCompactSummary || composeCompactSummary(source),

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function publish(report) {
    lastReport = clonePlain(report || buildReport({}));
    lastPacketText = composePacketText(lastReport);
    lastCompactSummary = composeCompactSummary(lastReport);
    lastReceipt = buildReceipt(lastReport);
    lastState = {
      contract: CONTRACT,
      receipt: RECEIPT,
      report: clonePlain(lastReport),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      receiptObject: clonePlain(lastReceipt),
      updatedAt: nowIso()
    };

    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeSouth = api;
    root.HEARTH.diagnosticRailProbeSouth = api;
    root.HEARTH.diagnosticSouthProbe = api;
    root.HEARTH.probeSouthPacketMeaningFileComposition = api;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = api;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = api;
    root.DEXTER_LAB.hearthProbeSouthPacketMeaningFileComposition = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION = api;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = clonePlain(lastReceipt);
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT = clonePlain(lastReceipt);

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastReport);
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_REPORT = clonePlain(lastReport);

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_PACKET_TEXT = lastPacketText;
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_COMPACT_SUMMARY = lastCompactSummary;

    return lastState;
  }

  function runProbeSouth(input = {}) {
    const report = applySignature(buildReport(input));
    publish(report);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      report: clonePlain(lastReport),
      REPORT_OBJECT: clonePlain(lastReport),
      evidence: clonePlain(lastReport),
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,
      receiptObject: clonePlain(lastReceipt),
      state: clonePlain(lastState),
      ...clonePlain(lastReport)
    };
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
    if (!lastReport) publish(applySignature(buildReport({})));
    return clonePlain(lastReport);
  }

  function getPacketText() {
    if (!lastPacketText) publish(applySignature(buildReport({})));
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) publish(applySignature(buildReport({})));
    return lastCompactSummary;
  }

  function getReceiptLight() {
    const report = lastReport || applySignature(buildReport({}));

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: IMPLEMENTATION_CONTRACT,
      implementationReceipt: IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      chronologyOrder: 9,
      fibonacciStage: "F55",
      role: "packet-meaning-file-composition-probe",
      runProbeSouthApiAvailable: true,
      returnReportObjectAvailable: true,
      returnPacketTextAvailable: true,
      returnCompactSummaryAvailable: true,
      returnReceiptObjectAvailable: true,
      receiptReturnMechanismStatus: getValue(report, "RECEIPT_RETURN_MECHANISM_STATUS", "RESTORED_PACKET_SURFACE_READY"),
      probeSouthReturnToNorthStatus: getValue(report, "PROBE_SOUTH_RETURN_TO_NORTH_STATUS", "RETURN_PACKET_READY"),
      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    if (!lastReceipt) publish(applySignature(buildReport({})));
    return clonePlain(lastReceipt);
  }

  function getState() {
    if (!lastState) publish(applySignature(buildReport({})));
    return clonePlain(lastState);
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    implementationContract: IMPLEMENTATION_CONTRACT,
    implementationReceipt: IMPLEMENTATION_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    reportPacket: REPORT_PACKET,

    parentNorthContract: NORTH_CONTRACT,
    parentNorthReceipt: NORTH_RECEIPT,
    previousNorthContract: PREVIOUS_NORTH_CONTRACT,
    previousNorthReceipt: PREVIOUS_NORTH_RECEIPT,

    chronologyOrder: 9,
    fibonacciStage: "F55",
    gate: "FINAL_PACKET_MEANING_RETURN_TO_NORTH",
    role: "packet-meaning-file-composition-probe",
    authority: "DIAGNOSTIC_PROBE_SOUTH_ONLY",

    railNorthFile: RAIL_NORTH_FILE,
    railEastFile: RAIL_EAST_FILE,
    railWestFile: RAIL_WEST_FILE,
    railSouthFile: RAIL_SOUTH_FILE,
    probeNorthFile: PROBE_NORTH_FILE,
    probeEastFile: PROBE_EAST_FILE,
    probeWestFile: PROBE_WEST_FILE,
    probeCanvasSurfaceTruthFile: PROBE_CANVAS_SURFACE_TRUTH_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    runProbe,
    inspect,
    runDiagnostic,
    getReport,
    getPacketText,
    getCompactSummary,
    getReceipt,
    getReceiptLight,
    getState,

    supportsNorthReadableReceiptReturn: true,
    supportsPacketTextReturn: true,
    supportsCompactSummaryReturn: true,
    supportsReportObjectReturn: true,
    supportsReceiptObjectReturn: true,
    supportsNineStepChronology: true,
    supportsCanvasSurfaceTruthProbe: true,
    supportsSouthFingerExtensionReadOnlyInspection: true,
    southFingerExtensionsRequiredForReceipt: false,
    southFingerExtensionMissingBlocksReceipt: false,

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

    ...NO_CLAIMS
  });

  publish(applySignature(buildReport({})));

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
