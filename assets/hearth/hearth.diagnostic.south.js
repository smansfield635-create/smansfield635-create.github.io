// /assets/hearth/hearth.diagnostic.south.js
// HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_TNT_v9
// Full-file replacement.
// Diagnostic rail SOUTH packet-output authority + embedded Probe South return surface.
// Purpose:
// - Preserve SOUTH as packet-output authority.
// - Preserve composeSouthReport(...) as the primary South callable surface.
// - Preserve embedded Probe South return/checkmark surface.
// - Add read-only Surface Pointer Bishop / Finger Stretch / Hex Surface bridge inspection.
// - Let South and Probe South report whether the downstream expression chain is usable before Canvas is renewed.
// - Separate these cases:
//   1. Surface Pointer Bishop not observed.
//   2. Surface Pointer Bishop observed but not sample-ready.
//   3. Inspect/finger stretch not ready.
//   4. Hex Surface not observed or not wired.
//   5. Surface sample is usable, leaving Canvas draw path as the remaining likely failure.
// - Do not mutate production Hearth files.
// - Do not draw canvas.
// - Do not restart runtime.
// - Do not claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_TNT_v9";
  const SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_RECEIPT_v9";

  const SOUTH_PREVIOUS_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v8";
  const SOUTH_PREVIOUS_RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_RECEIPT_v8";

  const SOUTH_LINEAGE_V7_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_PRIORITY_CONTROL_QUEEN_PACKET_CONFORMANCE_TNT_v7";
  const SOUTH_LINEAGE_V6_CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_QUEEN_CANVAS_REPORT_CONFORMANCE_TNT_v6";
  const SOUTH_BASELINE_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_TNT_v1";
  const SOUTH_BASELINE_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT_PACKET_OUTPUT_RECEIPT_v1";

  // Keep the public Probe South contract stable for North compatibility.
  const PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";
  const PROBE_SOUTH_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_RECEIPT_v1";
  const PROBE_SOUTH_IMPLEMENTATION_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_TNT_v2";
  const PROBE_SOUTH_IMPLEMENTATION_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_RECEIPT_v2";

  const VERSION =
    "2026-06-06.hearth-diagnostic-south-surface-pointer-bishop-return-read-v9";

  const SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME = "HEARTH_PARALLEL_DIAGNOSTIC_RAIL_RESULT_PACKET_v2";

  const RAIL_NORTH_FILE = "/assets/hearth/hearth.diagnostic.rail.js";
  const RAIL_EAST_FILE = "/assets/hearth/hearth.diagnostic.east.js";
  const RAIL_WEST_FILE = "/assets/hearth/hearth.diagnostic.west.js";
  const RAIL_SOUTH_FILE = SOUTH_FILE;

  const PROBE_NORTH_FILE = "/assets/hearth/hearth.diagnostic.probe.north.js";
  const PROBE_EAST_FILE = "/assets/hearth/hearth.diagnostic.probe.east.js";
  const PROBE_WEST_FILE = "/assets/hearth/hearth.diagnostic.probe.west.js";
  const PROBE_CANVAS_SURFACE_TRUTH_FILE =
    "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

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

  const EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";

  const NORTH_V11_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_TNT_v11";
  const NORTH_V11_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CANVAS_SURFACE_TRUTH_CHRONOLOGY_HUB_RECEIPT_v11";
  const NORTH_V10_CONTRACT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_TNT_v10";
  const NORTH_V10_RECEIPT =
    "HEARTH_DIAGNOSTIC_RAIL_NORTH_CHRONOLOGY_HUB_STANDARD_RECEIPT_v10";

  const SURFACE_EXPECTED_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_TNT_v5";
  const INSPECT_EXPECTED_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_TNT_v1";
  const HEX_SURFACE_EXPECTED_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByDiagnosticRail: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    terrainTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    elevationTruthClaimed: false,
    compositeTruthClaimed: false,
    finalCompositeTruthClaimed: false,
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

  const SOUTH_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      gate: "GATE_7",
      alias: "HEARTH.diagnosticSouth",
      layer: "HEARTH",
      intent: "south-operational-primary",
      authority: "packet-output"
    }),
    Object.freeze({
      order: 2,
      gate: "GATE_7",
      alias: "HEARTH.diagnosticRailSouth",
      layer: "HEARTH",
      intent: "south-rail-explicit",
      authority: "packet-output"
    }),
    Object.freeze({
      order: 3,
      gate: "GATE_7",
      alias: "HEARTH_DIAGNOSTIC_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-south",
      authority: "packet-output"
    }),
    Object.freeze({
      order: 4,
      gate: "GATE_7",
      alias: "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-south",
      authority: "packet-output"
    }),
    Object.freeze({
      order: 5,
      gate: "GATE_7",
      alias: "DEXTER_LAB.hearthDiagnosticSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-south",
      authority: "packet-output"
    }),
    Object.freeze({
      order: 6,
      gate: "GATE_7",
      alias: "DEXTER_LAB.hearthDiagnosticRailSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-south",
      authority: "packet-output"
    })
  ]);

  const PROBE_ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      gate: "GATE_8",
      alias: "HEARTH.diagnosticProbeSouth",
      layer: "HEARTH",
      intent: "probe-south-primary-return-check",
      authority: "return-surface"
    }),
    Object.freeze({
      order: 2,
      gate: "GATE_8",
      alias: "HEARTH.diagnosticRailProbeSouth",
      layer: "HEARTH",
      intent: "probe-south-rail-return-check",
      authority: "return-surface"
    }),
    Object.freeze({
      order: 3,
      gate: "GATE_8",
      alias: "HEARTH.diagnosticSouthProbe",
      layer: "HEARTH",
      intent: "south-probe-funnel-check",
      authority: "return-surface"
    }),
    Object.freeze({
      order: 4,
      gate: "GATE_8",
      alias: "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-probe-south",
      authority: "return-surface"
    }),
    Object.freeze({
      order: 5,
      gate: "GATE_8",
      alias: "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      layer: "GLOBAL",
      intent: "legacy-global-rail-probe-south",
      authority: "return-surface"
    }),
    Object.freeze({
      order: 6,
      gate: "GATE_8",
      alias: "DEXTER_LAB.hearthDiagnosticProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-probe-south",
      authority: "return-surface"
    }),
    Object.freeze({
      order: 7,
      gate: "GATE_8",
      alias: "DEXTER_LAB.hearthDiagnosticRailProbeSouth",
      layer: "DEXTER_LAB",
      intent: "lab-visible-rail-probe-south",
      authority: "return-surface"
    })
  ]);

  const SURFACE_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH.canvasFingerSurfacePointer",
    "HEARTH.canvasPointerFinger",
    "HEARTH.canvasFingerSurfaceInternalExternalSocket",
    "HEARTH.canvasBishopSurface",
    "HEARTH.canvasSurfaceBishop",
    "HEARTH.canvasBishopSurfacePointer",
    "HEARTH.canvasPointerBishop",
    "HEARTH.canvasBishopSurfaceInternalExternalSocket",
    "HEARTH.surfaceExpressionAuthority",
    "HEARTH.hearthSurfaceExpressionAuthority",
    "HEARTH.hexSurfaceExpressionAuthority",
    "HEARTH.canvasFingerSurfaceHexExpressionSocket",
    "HEARTH.canvasSurfacePointerBishopHexExpressionSocket",
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_CANVAS_BISHOP_SURFACE",
    "HEARTH_CANVAS_SURFACE_BISHOP",
    "HEARTH_CANVAS_BISHOP_SURFACE_POINTER",
    "HEARTH_CANVAS_POINTER_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
    "HEARTH_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_HEX_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasSurfaceFinger",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointer",
    "DEXTER_LAB.hearthCanvasPointerFinger",
    "DEXTER_LAB.hearthCanvasBishopSurface",
    "DEXTER_LAB.hearthCanvasSurfaceBishop",
    "DEXTER_LAB.hearthCanvasBishopSurfacePointer",
    "DEXTER_LAB.hearthCanvasPointerBishop",
    "DEXTER_LAB.hearthSurfaceExpressionAuthority",
    "DEXTER_LAB.hearthHexSurfaceExpressionAuthority",
    "DEXTER_LAB.hearthCanvasFingerSurfaceHexExpressionSocket",
    "DEXTER_LAB.hearthCanvasSurfacePointerBishopHexExpressionSocket"
  ]);

  const INSPECT_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasInspectFinger",
    "HEARTH.canvasFingerStretchInspection",
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_INSPECT_FINGER",
    "HEARTH_CANVAS_FINGER_STRETCH_INSPECTION",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasInspectFinger"
  ]);

  const HEX_SURFACE_SOURCE_NAMES = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfacePlanetaryViewControlRenderer",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_PLANETARY_VIEW_CONTROL_RENDERER",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfacePlanetaryViewControlRenderer"
  ]);

  const SURFACE_SAMPLE_METHODS = Object.freeze([
    "sampleHexSurfaceExpression",
    "sampleSurfaceExpression",
    "getRenderableSurfaceExpression",
    "getSurfaceExpressionAt",
    "receiveHexSurfaceExpressionRequest",
    "sample"
  ]);

  const HEX_SURFACE_INTAKE_METHODS = Object.freeze([
    "receiveSurfaceExpressionAuthority",
    "receiveSurfacePointerBishopExpressionAuthority",
    "receiveSurfacePointerBishopPacket",
    "receiveSurfaceExpressionPacket",
    "receiveExpressionPacket",
    "receiveBishopPacket"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;

  const southApi = {};
  const probeSouthApi = {};

  let lastSouthState = null;
  let lastSouthReport = null;
  let lastSouthPacketText = "";
  let lastSouthCompactSummary = "";

  let lastProbeState = null;
  let lastProbeReport = null;
  let lastProbePacketText = "";
  let lastProbeCompactSummary = "";

  const localEvents = [];
  const localErrors = [];

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
    }
  }

  function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "SOUTH_DIAGNOSTIC_EVENT"),
      detail: clonePlain(detail)
    };
    localEvents.push(item);
    trimArray(localEvents, 120);
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "SOUTH_DIAGNOSTIC_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };
    localErrors.push(item);
    trimArray(localErrors, 80);
    return item;
  }

  function packetValue(value, fallback = "UNKNOWN") {
    if (value === undefined || value === null || value === "") return fallback;

    if (Array.isArray(value)) {
      const joined = value
        .map((entry) => {
          if (isObject(entry) || Array.isArray(entry)) {
            try {
              return JSON.stringify(entry);
            } catch (_error) {
              return bounded(entry, 1200);
            }
          }
          return bounded(entry, 1200);
        })
        .filter(Boolean)
        .join(" | ");
      return joined || fallback;
    }

    if (isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 22000) || fallback;
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
      const text = bounded(value, 4000);
      if (!text) continue;
      if (text === "UNKNOWN" || text === "NONE" || text === "NOT_FOUND") continue;
      if (text === "UNREADABLE" || text === "INACCESSIBLE") continue;
      return text;
    }
    return "UNKNOWN";
  }

  function boolValue(value, fallback = false) {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return true;
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return false;
    return fallback;
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
        const clean = bounded(raw, 1400);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function aliasChronologyText(list) {
    return list.map((entry) => {
      return [
        `${entry.order}.${entry.alias}`,
        `gate:${entry.gate}`,
        `layer:${entry.layer}`,
        `intent:${entry.intent}`,
        `authority:${entry.authority}`
      ].join(" ");
    }).join(" | ");
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

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function findSource(sourceNames) {
    for (const sourceName of sourceNames || []) {
      const source = readPath(sourceName);
      if (source && (isObject(source) || isFunction(source))) {
        return {
          source,
          sourceName
        };
      }
    }

    return {
      source: null,
      sourceName: "NONE"
    };
  }

  function safeInvoke(source, method, args = [], detail = {}) {
    if (!source || !isFunction(source[method])) return null;

    try {
      return source[method](...args);
    } catch (error) {
      recordError("SOUTH_DIAGNOSTIC_SAFE_INVOKE_FAILED", error, {
        method,
        detail: clonePlain(detail)
      });
      return null;
    }
  }

  function readGenericReceipt(source) {
    if (!source || (!isObject(source) && !isFunction(source))) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "read",
      "getState",
      "getReport",
      "getStatus"
    ];

    for (const method of methods) {
      const value = safeInvoke(source, method);
      if (isObject(value)) return value;
    }

    if (isObject(source.receiptPacket)) return source.receiptPacket;
    if (isObject(source.receipt)) return source.receipt;

    if (source.contract || source.CONTRACT || source.receipt || source.RECEIPT || source.file) {
      return source;
    }

    return null;
  }

  function readKnownPacket(source, methods, keys, receipt) {
    if (!source || !isObject(source)) return null;

    for (const method of methods || []) {
      const value = safeInvoke(source, method);
      if (isObject(value)) return value;
    }

    for (const key of keys || []) {
      if (receipt && isObject(receipt[key])) return receipt[key];
      if (isObject(source[key])) return source[key];
    }

    return null;
  }

  function contractOf(...sources) {
    for (const source of sources) {
      if (!isObject(source)) continue;
      const value = firstKnown(
        source.contract,
        source.CONTRACT,
        source.currentContract,
        source.sourceContract,
        source.canvasContract,
        source.hexSurfaceContract,
        source.implementationContract,
        source.SURFACE_POINTER_BISHOP_CONTRACT
      );
      if (value !== "UNKNOWN") return value;
    }
    return "UNKNOWN";
  }

  function receiptOf(...sources) {
    for (const source of sources) {
      if (!isObject(source)) continue;
      const value = firstKnown(
        source.receipt,
        source.RECEIPT,
        source.currentReceipt,
        source.sourceReceipt,
        source.canvasReceipt,
        source.hexSurfaceReceipt,
        source.implementationReceipt
      );
      if (value !== "UNKNOWN") return value;
    }
    return "UNKNOWN";
  }

  function hasForbiddenClaims(...sources) {
    const merged = {};

    for (const source of sources) {
      if (isObject(source)) Object.assign(merged, source);
    }

    return Boolean(
      merged.f13Claimed === true ||
      merged.f13EligibleForCanvas === true ||
      merged.f13ClaimedByCanvasParent === true ||
      merged.f13ClaimedByDiagnosticRail === true ||
      merged.f21Claimed === true ||
      merged.f21EligibleForNorth === true ||
      merged.f21SubmittedToNorth === true ||
      merged.f21EligibilitySubmittedToNorth === true ||
      merged.f21ClaimedByDiagnosticRail === true ||
      merged.readyTextClaimed === true ||
      merged.readyTextAllowed === true ||
      merged.completionLatched === true ||
      merged.finalCompletionLatched === true ||
      merged.degradedCompletionLatched === true ||
      merged.terrainTruthClaimed === true ||
      merged.hydrologyTruthClaimed === true ||
      merged.materialTruthClaimed === true ||
      merged.elevationTruthClaimed === true ||
      merged.compositeTruthClaimed === true ||
      merged.finalCompositeTruthClaimed === true ||
      merged.visualPassClaimed === true ||
      merged.finalVisualPassClaimed === true ||
      merged.generatedImage === true ||
      merged.graphicBox === true ||
      merged.webGL === true ||
      merged.webgl === true
    );
  }

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) return clonePlain(input.output.REPORT_OBJECT);
    if (isObject(input)) return clonePlain(input);
    return {};
  }

  function extractChronology(input, currentReport) {
    if (Array.isArray(input && input.chronology)) return clonePlain(input.chronology);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    if (Array.isArray(currentReport && currentReport.chronology)) return clonePlain(currentReport.chronology);
    return [];
  }

  function findChronologyEntry(chronology, id) {
    if (!Array.isArray(chronology)) return null;
    return chronology.find((entry) => isObject(entry) && entry.id === id) || null;
  }

  function findAvailableMethod(source, methods) {
    if (!source) return "NONE";

    for (const method of methods || []) {
      if (isFunction(source[method])) return method;
    }

    return "NONE";
  }

  function sampleSurfacePointer(source, method) {
    if (!source || method === "NONE") {
      return {
        attempted: false,
        returned: false,
        ok: false,
        error: "NO_SURFACE_SAMPLE_METHOD"
      };
    }

    const samplePacket = {
      sourceFile: SOUTH_FILE,
      consumerFile: PROBE_SOUTH_FILE,
      diagnosticRequest: true,
      diagnosticRequestType: "SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ",
      cellId: "SOUTH_PROBE_SYNTHETIC_CENTER_CELL",
      hexId: "SOUTH_PROBE_SYNTHETIC_CENTER_HEX",
      stateId: 121,
      stateClass: "diagnostic-synthetic-center",
      q: 0,
      r: 0,
      s: 0,
      u: 0.5,
      v: 0.5,
      lon: 0,
      lat: 0,
      coord: {
        u: 0.5,
        v: 0.5,
        lon: 0,
        lat: 0
      },
      ...NO_CLAIMS
    };

    try {
      const value = source[method](samplePacket, {
        sourceName: "DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ",
        sourceFile: SOUTH_FILE,
        consumerFile: PROBE_SOUTH_FILE
      });

      return {
        attempted: true,
        returned: isObject(value),
        ok: Boolean(isObject(value) && value.ok !== false && value.rejected !== true),
        error: "NONE",
        packet: clonePlain(value)
      };
    } catch (error) {
      recordError("SOUTH_SURFACE_POINTER_SAMPLE_FAILED", error, { method });

      return {
        attempted: true,
        returned: false,
        ok: false,
        error: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function buildSurfacePointerRead() {
    const found = findSource(SURFACE_SOURCE_NAMES);
    const source = found.source;
    const receipt = source ? readGenericReceipt(source) : null;
    const packet = source
      ? readKnownPacket(
          source,
          ["getPointerBishopPacket", "getSurfacePacket", "getBishopPacket", "getPointerFingerPacket"],
          ["pointerBishopPacket", "surfacePacket", "bishopPacket", "pointerFingerPacket", "packet"],
          receipt
        )
      : null;

    const method = findAvailableMethod(source, SURFACE_SAMPLE_METHODS);
    const sample = source ? sampleSurfacePointer(source, method) : {
      attempted: false,
      returned: false,
      ok: false,
      error: "SURFACE_POINTER_BISHOP_NOT_OBSERVED"
    };

    const samplePacket = isObject(sample.packet) ? sample.packet : {};
    const noFalseClaims = !hasForbiddenClaims(receipt, packet, samplePacket);

    const read = {
      observed: Boolean(source),
      sourcePath: found.sourceName,
      file: firstKnown(
        getRaw(receipt, "file"),
        getRaw(packet, "file"),
        source && source.file,
        SURFACE_FILE
      ),
      expectedContract: SURFACE_EXPECTED_CONTRACT,
      contract: contractOf(receipt, packet, source),
      receipt: receiptOf(receipt, packet, source),

      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      packetReady: Boolean(
        boolValue(getRaw(receipt, "surfacePacketReady"), false) ||
        boolValue(getRaw(packet, "surfacePacketReady"), false) ||
        boolValue(getRaw(receipt, "pointerBishopPacketReady"), false) ||
        boolValue(getRaw(packet, "pointerBishopPacketReady"), false) ||
        isObject(packet)
      ),

      pointerBishopActive: Boolean(
        boolValue(getRaw(receipt, "pointerBishopActive"), false) ||
        boolValue(getRaw(packet, "pointerBishopActive"), false) ||
        boolValue(source && source.supportsSurfacePointerBishop, false)
      ),
      hexExpressionSocketActive: Boolean(
        boolValue(getRaw(receipt, "hexExpressionSocketActive"), false) ||
        boolValue(getRaw(packet, "hexExpressionSocketActive"), false) ||
        boolValue(source && source.supportsHexExpressionSocket, false)
      ),
      hexSurfaceExpressionAuthority: Boolean(
        boolValue(getRaw(receipt, "hexSurfaceExpressionAuthority"), false) ||
        boolValue(getRaw(packet, "hexSurfaceExpressionAuthority"), false) ||
        boolValue(source && source.supportsHexSurfaceExpressionAuthority, false)
      ),

      sampleMethod: method,
      sampleMethodAvailable: method !== "NONE",
      sampleAttempted: sample.attempted,
      sampleReturned: sample.returned,
      sampleOk: sample.ok,
      sampleError: sample.error,

      sampleMaterialClass: firstKnown(
        getRaw(samplePacket, "materialClass"),
        getRaw(samplePacket, "materialFamily"),
        "UNKNOWN"
      ),
      sampleIsLand: boolText(getRaw(samplePacket, "isLand"), "UNKNOWN"),
      sampleIsWater: boolText(getRaw(samplePacket, "isWater"), "UNKNOWN"),
      sampleLandPresence: getValue(samplePacket, "landPresence", "UNKNOWN"),
      sampleWaterPresence: getValue(samplePacket, "waterPresence", "UNKNOWN"),
      sampleElevation: getValue(samplePacket, "elevation", "UNKNOWN"),
      sampleRgb: getRaw(samplePacket, "rgb", getRaw(samplePacket, "color", "UNKNOWN")),
      sampleRenderableByHexSurface: boolText(getRaw(samplePacket, "renderableByHexSurface"), "UNKNOWN"),
      sampleProjectionRequired: boolText(getRaw(samplePacket, "projectionRequired"), "UNKNOWN"),

      hexExpressionRequestCount: getValue(receipt, "hexExpressionRequestCount", "UNKNOWN"),
      hexExpressionServedCount: getValue(receipt, "hexExpressionServedCount", "UNKNOWN"),
      hexExpressionRejectedCount: getValue(receipt, "hexExpressionRejectedCount", "UNKNOWN"),
      latestHexExpressionAt: getValue(receipt, "latestHexExpressionAt", "UNKNOWN"),
      latestHexExpressionCellId: getValue(receipt, "latestHexExpressionCellId", "UNKNOWN"),
      latestHexExpressionMaterialClass: getValue(receipt, "latestHexExpressionMaterialClass", "UNKNOWN"),

      hexSurfaceHandshakeAttempted: boolText(getRaw(receipt, "hexSurfaceHandshakeAttempted"), "UNKNOWN"),
      hexSurfaceHandshakeAccepted: boolText(getRaw(receipt, "hexSurfaceHandshakeAccepted"), "UNKNOWN"),
      hexSurfaceHandshakeMethod: getValue(receipt, "hexSurfaceHandshakeMethod", "UNKNOWN"),
      hexSurfaceObservedBySurface: boolText(getRaw(receipt, "hexSurfaceObserved"), "UNKNOWN"),
      hexSurfaceContractBySurface: getValue(receipt, "hexSurfaceContract", "UNKNOWN"),

      noFalseClaims,
      forbiddenClaimDetected: !noFalseClaims,
      receiptSnapshot: clonePlain(receipt),
      packetSnapshot: clonePlain(packet),
      sampleSnapshot: clonePlain(samplePacket)
    };

    read.ready = Boolean(
      read.observed &&
      read.packetReady &&
      read.pointerBishopActive &&
      read.hexExpressionSocketActive &&
      read.sampleMethodAvailable &&
      read.sampleReturned &&
      read.sampleOk &&
      read.noFalseClaims
    );

    return read;
  }

  function buildInspectFingerRead() {
    const found = findSource(INSPECT_SOURCE_NAMES);
    const source = found.source;
    const receipt = source ? readGenericReceipt(source) : null;
    const packet = source
      ? readKnownPacket(
          source,
          ["getInspectionPacket", "buildInspectionPacket", "getInspectionSummary"],
          ["inspectionPacket", "packet", "inspectionSummary"],
          receipt
        )
      : null;

    const noFalseClaims = !hasForbiddenClaims(receipt, packet);

    const read = {
      observed: Boolean(source),
      sourcePath: found.sourceName,
      file: firstKnown(getRaw(receipt, "file"), getRaw(packet, "file"), INSPECT_FILE),
      expectedContract: INSPECT_EXPECTED_CONTRACT,
      contract: contractOf(receipt, packet, source),
      receipt: receiptOf(receipt, packet, source),

      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),

      boundaryReady: boolText(firstKnown(getRaw(receipt, "boundaryReady"), getRaw(packet, "boundaryReady")), "UNKNOWN"),
      massReady: boolText(firstKnown(getRaw(receipt, "massReady"), getRaw(packet, "massReady")), "UNKNOWN"),
      surfaceReady: boolText(firstKnown(getRaw(receipt, "surfaceReady"), getRaw(packet, "surfaceReady")), "UNKNOWN"),
      lightReady: boolText(firstKnown(getRaw(receipt, "lightReady"), getRaw(packet, "lightReady")), "UNKNOWN"),
      allFingerReady: boolText(firstKnown(getRaw(receipt, "allFingerReady"), getRaw(packet, "allFingerReady")), "UNKNOWN"),
      baseCanvasGlobeEvidenceReady: boolText(firstKnown(getRaw(receipt, "baseCanvasGlobeEvidenceReady"), getRaw(packet, "baseCanvasGlobeEvidenceReady")), "UNKNOWN"),
      firstFailedCoordinate: firstKnown(
        getRaw(receipt, "firstFailedCoordinate"),
        getRaw(packet, "firstFailedCoordinate"),
        "UNKNOWN"
      ),
      recommendedNextFile: firstKnown(
        getRaw(receipt, "recommendedNextFile"),
        getRaw(packet, "recommendedNextFile"),
        "UNKNOWN"
      ),
      postgameStatus: firstKnown(
        getRaw(receipt, "postgameStatus"),
        getRaw(packet, "postgameStatus"),
        "UNKNOWN"
      ),

      noFalseClaims,
      forbiddenClaimDetected: !noFalseClaims,
      receiptSnapshot: clonePlain(receipt),
      packetSnapshot: clonePlain(packet)
    };

    read.ready = Boolean(
      read.observed &&
      read.receiptObserved &&
      read.packetObserved &&
      noFalseClaims &&
      (
        read.allFingerReady === "true" ||
        read.surfaceReady === "true" ||
        read.baseCanvasGlobeEvidenceReady === "true"
      )
    );

    return read;
  }

  function buildHexSurfaceRead() {
    const found = findSource(HEX_SURFACE_SOURCE_NAMES);
    const source = found.source;
    const receipt = source ? readGenericReceipt(source) : null;

    const intakeMethods = HEX_SURFACE_INTAKE_METHODS.filter((method) => source && isFunction(source[method]));
    const drawMethods = ["drawPairFrame", "drawInteractiveFrame", "drawFrame", "render", "draw"].filter((method) => {
      return source && isFunction(source[method]);
    });

    const noFalseClaims = !hasForbiddenClaims(receipt);

    const read = {
      observed: Boolean(source),
      sourcePath: found.sourceName,
      file: firstKnown(getRaw(receipt, "file"), HEX_SURFACE_FILE),
      expectedContract: HEX_SURFACE_EXPECTED_CONTRACT,
      contract: contractOf(receipt, source),
      receipt: receiptOf(receipt, source),

      receiptObserved: Boolean(receipt),
      recognized: Boolean(
        firstKnown(contractOf(receipt, source), "").includes("HEARTH_HEX_SURFACE") ||
        contractOf(receipt, source) === HEX_SURFACE_EXPECTED_CONTRACT
      ),
      intakeMethodsAvailable: intakeMethods.length,
      intakeMethodList: intakeMethods,
      drawMethodsAvailable: drawMethods.length,
      drawMethodList: drawMethods,

      surfaceAuthorityObserved: boolText(
        firstKnown(
          getRaw(receipt, "surfaceExpressionAuthorityObserved"),
          getRaw(receipt, "surfaceExpressionAuthorityAccepted"),
          getRaw(receipt, "surfaceAuthorityAccepted"),
          getRaw(receipt, "hexSurfaceExpressionAuthority")
        ),
        "UNKNOWN"
      ),
      expressionConsumerReady: boolText(
        firstKnown(
          getRaw(receipt, "expressionConsumerReady"),
          getRaw(receipt, "surfaceExpressionConsumerReady"),
          getRaw(receipt, "hexSurfaceExpressionReady")
        ),
        "UNKNOWN"
      ),
      latestDrawStatus: firstKnown(
        getRaw(receipt, "latestDrawStatus"),
        getRaw(receipt, "drawStatus"),
        getRaw(receipt, "renderStatus"),
        "UNKNOWN"
      ),

      noFalseClaims,
      forbiddenClaimDetected: !noFalseClaims,
      receiptSnapshot: clonePlain(receipt)
    };

    read.ready = Boolean(
      read.observed &&
      read.recognized &&
      read.noFalseClaims &&
      (read.intakeMethodsAvailable > 0 || read.drawMethodsAvailable > 0)
    );

    return read;
  }

  function resolveBridgeRead(surfaceRead, inspectRead, hexRead, currentReport) {
    const canvasPixelStatus = firstKnown(
      getRaw(currentReport, "CANVAS_PIXEL_SAMPLE_STATUS"),
      getRaw(currentReport, "CANVAS_TRUTH_FAILURE_REASON"),
      "UNKNOWN"
    );
    const canvasPixelVisible = firstKnown(
      getRaw(currentReport, "CANVAS_PIXEL_VISIBLE"),
      getRaw(currentReport, "CANVAS_PIXEL_NONEMPTY"),
      "UNKNOWN"
    );

    let status = "UNKNOWN";
    let firstFailedCoordinate = "UNKNOWN";
    let recommendedOwner = "UNKNOWN";
    let recommendedFile = "UNKNOWN";
    let recommendedAction = "UNKNOWN";
    let canvasDrawPathCandidate = false;
    let upstreamExpressionCandidate = false;

    if (!surfaceRead.observed) {
      status = "SURFACE_POINTER_BISHOP_NOT_OBSERVED";
      firstFailedCoordinate = "SURFACE_POINTER_BISHOP_OBSERVED";
      recommendedOwner = "SURFACE_POINTER_BISHOP";
      recommendedFile = SURFACE_FILE;
      recommendedAction = "VERIFY_SURFACE_POINTER_BISHOP_FILE_LOAD_AND_ALIAS_PUBLICATION";
      upstreamExpressionCandidate = true;
    } else if (!surfaceRead.sampleMethodAvailable) {
      status = "SURFACE_POINTER_BISHOP_SAMPLE_METHOD_NOT_AVAILABLE";
      firstFailedCoordinate = "SURFACE_POINTER_BISHOP_SAMPLE_METHOD";
      recommendedOwner = "SURFACE_POINTER_BISHOP";
      recommendedFile = SURFACE_FILE;
      recommendedAction = "VERIFY_SURFACE_EXPRESSION_SOCKET_API";
      upstreamExpressionCandidate = true;
    } else if (!surfaceRead.sampleReturned || !surfaceRead.sampleOk) {
      status = "SURFACE_POINTER_BISHOP_SAMPLE_NOT_USABLE";
      firstFailedCoordinate = "SURFACE_POINTER_BISHOP_SAMPLE_RETURN";
      recommendedOwner = "SURFACE_POINTER_BISHOP";
      recommendedFile = SURFACE_FILE;
      recommendedAction = "VERIFY_SURFACE_SAMPLE_RETURNS_RENDERABLE_EXPRESSION_PACKET";
      upstreamExpressionCandidate = true;
    } else if (inspectRead.observed && inspectRead.allFingerReady === "false") {
      status = "INSPECT_FINGER_STRETCH_NOT_READY";
      firstFailedCoordinate = firstKnown(inspectRead.firstFailedCoordinate, "INSPECT_FINGER_STRETCH_READY");
      recommendedOwner = "CANVAS_FINGER_INSPECT";
      recommendedFile = firstKnown(inspectRead.recommendedNextFile, INSPECT_FILE);
      recommendedAction = "FOLLOW_INSPECT_FINGER_FIRST_FAILED_COORDINATE";
      upstreamExpressionCandidate = true;
    } else if (!hexRead.observed) {
      status = "HEX_SURFACE_NOT_OBSERVED";
      firstFailedCoordinate = "HEX_SURFACE_OBSERVED";
      recommendedOwner = "HEX_SURFACE";
      recommendedFile = HEX_SURFACE_FILE;
      recommendedAction = "VERIFY_HEX_SURFACE_LOAD_AND_SURFACE_AUTHORITY_HANDSHAKE";
      upstreamExpressionCandidate = true;
    } else if (!hexRead.ready && surfaceRead.hexSurfaceHandshakeAccepted !== "true") {
      status = "HEX_SURFACE_OR_SURFACE_HANDSHAKE_NOT_PROVEN";
      firstFailedCoordinate = "HEX_SURFACE_SURFACE_AUTHORITY_HANDSHAKE";
      recommendedOwner = "HEX_SURFACE_OR_SURFACE_POINTER_BISHOP";
      recommendedFile = HEX_SURFACE_FILE;
      recommendedAction = "VERIFY_HEX_SURFACE_CONSUMES_SURFACE_POINTER_BISHOP_EXPRESSION_AUTHORITY";
      upstreamExpressionCandidate = true;
    } else {
      status = "SURFACE_POINTER_BISHOP_SAMPLE_USABLE_CANVAS_DRAW_PATH_REMAINS_PRIMARY_CANDIDATE";
      firstFailedCoordinate = canvasPixelStatus === "PIXEL_SAMPLE_BLANK" || canvasPixelVisible === "false"
        ? "CANVAS_PIXEL_VISIBLE"
        : "CANVAS_DRAW_PATH_UNCONFIRMED";
      recommendedOwner = "CANVAS_DRAWING_OR_EXPRESSION_ADAPTER";
      recommendedFile = CANVAS_FILE;
      recommendedAction = "VERIFY_CANVAS_DRAW_PATH_EXECUTES_AND_WRITES_VISIBLE_PIXELS";
      canvasDrawPathCandidate = true;
    }

    return {
      bridgeStatus: status,
      firstFailedCoordinate,
      recommendedOwner,
      recommendedFile,
      recommendedAction,
      canvasDrawPathCandidate,
      upstreamExpressionCandidate,
      canvasPixelStatus,
      canvasPixelVisible,
      surfacePointerBishopReady: surfaceRead.ready,
      inspectFingerReady: inspectRead.ready,
      hexSurfaceReady: hexRead.ready,
      noFalseClaims: Boolean(surfaceRead.noFalseClaims && inspectRead.noFalseClaims && hexRead.noFalseClaims)
    };
  }

  function buildDownstreamExpressionRead(currentReport = {}) {
    const surfaceRead = buildSurfacePointerRead();
    const inspectRead = buildInspectFingerRead();
    const hexRead = buildHexSurfaceRead();
    const bridgeRead = resolveBridgeRead(surfaceRead, inspectRead, hexRead, currentReport);

    return {
      readType: "SOUTH_SURFACE_POINTER_BISHOP_DOWNSTREAM_EXPRESSION_READ",
      timestamp: nowIso(),
      contract: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      file: SOUTH_FILE,
      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      runtimeRestartAuthorized: false,
      diagnosticReadOnly: true,

      surfacePointerBishop: surfaceRead,
      inspectFinger: inspectRead,
      hexSurface: hexRead,
      bridge: bridgeRead,

      ...NO_CLAIMS
    };
  }

  function buildSharedFields(input, currentReport, chronology) {
    return {
      PACKET_NAME: firstKnown(currentReport.PACKET_NAME, PACKET_NAME),
      TARGET_ROUTE: firstKnown(currentReport.TARGET_ROUTE, TARGET_ROUTE),
      DIAGNOSTIC_ROUTE: firstKnown(currentReport.DIAGNOSTIC_ROUTE, DIAGNOSTIC_ROUTE),
      DIAGNOSTIC_TIMESTAMP: firstKnown(currentReport.DIAGNOSTIC_TIMESTAMP, input.diagnosticTimestamp, nowIso()),

      NORTH_CONTRACT: firstKnown(input.northContract, currentReport.NORTH_CONTRACT, NORTH_V11_CONTRACT),
      NORTH_RECEIPT: firstKnown(input.northReceipt, currentReport.NORTH_RECEIPT, NORTH_V11_RECEIPT),
      PREVIOUS_NORTH_CONTRACT: firstKnown(currentReport.PREVIOUS_NORTH_CONTRACT, NORTH_V10_CONTRACT),
      PREVIOUS_NORTH_RECEIPT: firstKnown(currentReport.PREVIOUS_NORTH_RECEIPT, NORTH_V10_RECEIPT),

      NORTH_CHRONOLOGY_HUB_ACTIVE: boolText(getRaw(currentReport, "NORTH_CHRONOLOGY_HUB_ACTIVE", true), "true"),
      NORTH_IS_HUB_ONLY: boolText(getRaw(currentReport, "NORTH_IS_HUB_ONLY", true), "true"),
      NINE_STEP_CHRONOLOGY_ACTIVE: boolText(getRaw(currentReport, "NINE_STEP_CHRONOLOGY_ACTIVE", true), "true"),
      CANVAS_SURFACE_TRUTH_PROBE_EXPECTED: boolText(getRaw(currentReport, "CANVAS_SURFACE_TRUTH_PROBE_EXPECTED", true), "true"),
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
      EXPECTED_ROUTE_CONDUCTOR_CONTRACT: firstKnown(currentReport.EXPECTED_ROUTE_CONDUCTOR_CONTRACT, EXPECTED_ROUTE_CONDUCTOR_CONTRACT),
      EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT: firstKnown(currentReport.EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT, EXPECTED_ROUTE_CONDUCTOR_LINEAGE_CONTRACT),
      EXPECTED_CONTROL_CONTRACT: firstKnown(currentReport.EXPECTED_CONTROL_CONTRACT, EXPECTED_CONTROL_CONTRACT),
      EXPECTED_CANVAS_CONTRACT: firstKnown(currentReport.EXPECTED_CANVAS_CONTRACT, EXPECTED_CANVAS_CONTRACT),
      EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT: firstKnown(
        currentReport.EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT,
        EXPECTED_PROBE_CANVAS_SURFACE_TRUTH_CONTRACT
      ),

      CHRONOLOGY_SEQUENCE: clonePlain(chronology),
      CHRONOLOGY_SEQUENCE_TEXT: firstKnown(currentReport.CHRONOLOGY_SEQUENCE_TEXT, chronologyText(chronology))
    };
  }

  function buildSouthReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);
    const shared = buildSharedFields(input, currentReport, chronology);
    const downstreamRead = buildDownstreamExpressionRead(currentReport);
    const bridge = downstreamRead.bridge;
    const surface = downstreamRead.surfacePointerBishop;
    const inspect = downstreamRead.inspectFinger;
    const hex = downstreamRead.hexSurface;

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "SOUTH_V9_SURFACE_POINTER_BISHOP_RETURN_READ_ACTIVE",
      "SOUTH_GATE_7_PACKET_OUTPUT_AUTHORITY_PRESERVED",
      "SOUTH_GATE_8_PROBE_RETURN_SURFACE_PRESERVED",
      "SOUTH_READS_SURFACE_POINTER_BISHOP_WITHOUT_PRODUCTION_MUTATION",
      "SOUTH_READS_INSPECT_FINGER_WITHOUT_RENEWING_PRIOR_FINGERS",
      "SOUTH_READS_HEX_SURFACE_WITHOUT_DRAWING_CANVAS",
      `SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS:${bridge.bridgeStatus}`,
      `SOUTH_DOWNSTREAM_RECOMMENDED_FILE:${bridge.recommendedFile}`,
      "SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "SOUTH_DOES_NOT_CLAIM_READY_OR_VISUAL_PASS"
    );

    const report = {
      ...currentReport,
      ...shared,

      SOUTH_STATUS: "COMPLETE",
      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: SOUTH_CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: SOUTH_RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: SOUTH_PREVIOUS_CONTRACT,
      SOUTH_PREVIOUS_IMPLEMENTATION_RECEIPT: SOUTH_PREVIOUS_RECEIPT,
      SOUTH_LINEAGE_V7_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V7_CONTRACT,
      SOUTH_LINEAGE_V6_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V6_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: SOUTH_BASELINE_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_RECEIPT: SOUTH_BASELINE_RECEIPT,
      SOUTH_VERSION: VERSION,
      SOUTH_FILE,

      SOUTH_GATE: "GATE_7",
      SOUTH_OUTPUT_COMPLETE: "true",
      SOUTH_OUTPUT_STATUS: "COMPLETE",
      SOUTH_OUTPUT_VALID: "VALID",
      SOUTH_OUTPUT_SCHEMA_VALID: "true",
      SOUTH_MEANING_PRESERVED: "true",
      SOUTH_FUNNEL_STATUS: "GATE_7_OUTPUT_AND_GATE_8_SURFACE_POINTER_RETURN_READ_PUBLISHED",
      SOUTH_PACKET_TEXT_SOURCE: "SOUTH_PACKET_FORMATTING_FROM_NORTH_V11_CHRONOLOGY_HUB_REPORT",
      SOUTH_PRIMARY_CALLABLE_METHOD: "composeSouthReport",

      PROBE_SOUTH_GATE: "GATE_8",
      PROBE_SOUTH_ROUTER_STATUS: "PUBLISHED_FROM_SOUTH_RAIL",
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "false",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: "true",
      PROBE_SOUTH_RETURN_SURFACE_PRESERVED: "true",
      PROBE_SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PRIMARY_CALLABLE_METHOD: "runProbeSouth",

      SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      SOUTH_ALIAS_CHRONOLOGY: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_SOUTH_ALIAS_CHRONOLOGY: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

      SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_ACTIVE: "true",
      SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_SCOPE: "READ_ONLY_NAMESPACE_AND_SAMPLE_PROOF",
      SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ: clonePlain(downstreamRead),

      SURFACE_POINTER_BISHOP_OBSERVED: boolText(surface.observed, "false"),
      SURFACE_POINTER_BISHOP_SOURCE_PATH: surface.sourcePath,
      SURFACE_POINTER_BISHOP_FILE: surface.file,
      SURFACE_POINTER_BISHOP_EXPECTED_CONTRACT: surface.expectedContract,
      SURFACE_POINTER_BISHOP_CONTRACT: surface.contract,
      SURFACE_POINTER_BISHOP_RECEIPT: surface.receipt,
      SURFACE_POINTER_BISHOP_RECEIPT_OBSERVED: boolText(surface.receiptObserved, "false"),
      SURFACE_POINTER_BISHOP_PACKET_OBSERVED: boolText(surface.packetObserved, "false"),
      SURFACE_POINTER_BISHOP_PACKET_READY: boolText(surface.packetReady, "false"),
      SURFACE_POINTER_BISHOP_ACTIVE: boolText(surface.pointerBishopActive, "false"),
      SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_ACTIVE: boolText(surface.hexExpressionSocketActive, "false"),
      SURFACE_POINTER_BISHOP_HEX_SURFACE_EXPRESSION_AUTHORITY: boolText(surface.hexSurfaceExpressionAuthority, "false"),
      SURFACE_POINTER_BISHOP_SAMPLE_METHOD: surface.sampleMethod,
      SURFACE_POINTER_BISHOP_SAMPLE_METHOD_AVAILABLE: boolText(surface.sampleMethodAvailable, "false"),
      SURFACE_POINTER_BISHOP_SAMPLE_ATTEMPTED: boolText(surface.sampleAttempted, "false"),
      SURFACE_POINTER_BISHOP_SAMPLE_RETURNED: boolText(surface.sampleReturned, "false"),
      SURFACE_POINTER_BISHOP_SAMPLE_OK: boolText(surface.sampleOk, "false"),
      SURFACE_POINTER_BISHOP_SAMPLE_ERROR: surface.sampleError,
      SURFACE_POINTER_BISHOP_SAMPLE_MATERIAL_CLASS: surface.sampleMaterialClass,
      SURFACE_POINTER_BISHOP_SAMPLE_IS_LAND: surface.sampleIsLand,
      SURFACE_POINTER_BISHOP_SAMPLE_IS_WATER: surface.sampleIsWater,
      SURFACE_POINTER_BISHOP_SAMPLE_LAND_PRESENCE: surface.sampleLandPresence,
      SURFACE_POINTER_BISHOP_SAMPLE_WATER_PRESENCE: surface.sampleWaterPresence,
      SURFACE_POINTER_BISHOP_SAMPLE_ELEVATION: surface.sampleElevation,
      SURFACE_POINTER_BISHOP_SAMPLE_RGB: surface.sampleRgb,
      SURFACE_POINTER_BISHOP_SAMPLE_RENDERABLE_BY_HEX_SURFACE: surface.sampleRenderableByHexSurface,
      SURFACE_POINTER_BISHOP_HEX_EXPRESSION_REQUEST_COUNT: surface.hexExpressionRequestCount,
      SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SERVED_COUNT: surface.hexExpressionServedCount,
      SURFACE_POINTER_BISHOP_HEX_EXPRESSION_REJECTED_COUNT: surface.hexExpressionRejectedCount,
      SURFACE_POINTER_BISHOP_HEX_HANDSHAKE_ATTEMPTED: surface.hexSurfaceHandshakeAttempted,
      SURFACE_POINTER_BISHOP_HEX_HANDSHAKE_ACCEPTED: surface.hexSurfaceHandshakeAccepted,
      SURFACE_POINTER_BISHOP_HEX_HANDSHAKE_METHOD: surface.hexSurfaceHandshakeMethod,
      SURFACE_POINTER_BISHOP_READY_FOR_DOWNSTREAM: boolText(surface.ready, "false"),

      INSPECT_FINGER_OBSERVED: boolText(inspect.observed, "false"),
      INSPECT_FINGER_SOURCE_PATH: inspect.sourcePath,
      INSPECT_FINGER_CONTRACT: inspect.contract,
      INSPECT_FINGER_RECEIPT: inspect.receipt,
      INSPECT_FINGER_PACKET_OBSERVED: boolText(inspect.packetObserved, "false"),
      INSPECT_FINGER_BOUNDARY_READY: inspect.boundaryReady,
      INSPECT_FINGER_MASS_READY: inspect.massReady,
      INSPECT_FINGER_SURFACE_READY: inspect.surfaceReady,
      INSPECT_FINGER_LIGHT_READY: inspect.lightReady,
      INSPECT_FINGER_ALL_READY: inspect.allFingerReady,
      INSPECT_FINGER_BASE_CANVAS_GLOBE_EVIDENCE_READY: inspect.baseCanvasGlobeEvidenceReady,
      INSPECT_FINGER_FIRST_FAILED_COORDINATE: inspect.firstFailedCoordinate,
      INSPECT_FINGER_RECOMMENDED_NEXT_FILE: inspect.recommendedNextFile,
      INSPECT_FINGER_POSTGAME_STATUS: inspect.postgameStatus,
      INSPECT_FINGER_READY_FOR_DOWNSTREAM: boolText(inspect.ready, "false"),

      HEX_SURFACE_OBSERVED: boolText(hex.observed, "false"),
      HEX_SURFACE_SOURCE_PATH: hex.sourcePath,
      HEX_SURFACE_CONTRACT: hex.contract,
      HEX_SURFACE_RECEIPT: hex.receipt,
      HEX_SURFACE_RECOGNIZED: boolText(hex.recognized, "false"),
      HEX_SURFACE_INTAKE_METHODS_AVAILABLE: String(hex.intakeMethodsAvailable),
      HEX_SURFACE_INTAKE_METHOD_LIST: hex.intakeMethodList,
      HEX_SURFACE_DRAW_METHODS_AVAILABLE: String(hex.drawMethodsAvailable),
      HEX_SURFACE_DRAW_METHOD_LIST: hex.drawMethodList,
      HEX_SURFACE_SURFACE_AUTHORITY_OBSERVED: hex.surfaceAuthorityObserved,
      HEX_SURFACE_EXPRESSION_CONSUMER_READY: hex.expressionConsumerReady,
      HEX_SURFACE_READY_FOR_DOWNSTREAM: boolText(hex.ready, "false"),

      DOWNSTREAM_EXPRESSION_BRIDGE_STATUS: bridge.bridgeStatus,
      DOWNSTREAM_EXPRESSION_FIRST_FAILED_COORDINATE: bridge.firstFailedCoordinate,
      DOWNSTREAM_EXPRESSION_RECOMMENDED_OWNER: bridge.recommendedOwner,
      DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE: bridge.recommendedFile,
      DOWNSTREAM_EXPRESSION_RECOMMENDED_ACTION: bridge.recommendedAction,
      DOWNSTREAM_EXPRESSION_CANVAS_DRAW_PATH_CANDIDATE: boolText(bridge.canvasDrawPathCandidate, "false"),
      DOWNSTREAM_EXPRESSION_UPSTREAM_EXPRESSION_CANDIDATE: boolText(bridge.upstreamExpressionCandidate, "false"),
      DOWNSTREAM_EXPRESSION_CANVAS_PIXEL_STATUS: bridge.canvasPixelStatus,
      DOWNSTREAM_EXPRESSION_CANVAS_PIXEL_VISIBLE: bridge.canvasPixelVisible,
      DOWNSTREAM_EXPRESSION_NO_FALSE_CLAIMS: boolText(bridge.noFalseClaims, "false"),

      SOUTH_OUTPUT_AUTHORITY: "PACKET_OUTPUT_ONLY",
      SOUTH_OWNS_NORTH_CHRONOLOGY: "false",
      SOUTH_OWNS_EAST_EVIDENCE: "false",
      SOUTH_OWNS_WEST_EVIDENCE: "false",
      SOUTH_OWNS_CANVAS_DRAWING: "false",
      SOUTH_OWNS_PRODUCTION_REPAIR: "false",

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      NORTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      SOUTH_SECONDARY_OUTPUT_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const packetText = composePacketText(report, orderedSouthFields(report));
    const compactSummary = composeSouthCompactSummary(report);

    const result = {
      ok: true,
      ...report,

      contract: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      implementationContract: SOUTH_CONTRACT,
      implementationReceipt: SOUTH_RECEIPT,
      previousImplementationContract: SOUTH_PREVIOUS_CONTRACT,

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        SOUTH_STATUS: "COMPLETE",
        SOUTH_CONTRACT,
        SOUTH_RECEIPT,
        SOUTH_OUTPUT_STATUS: "COMPLETE",
        SOUTH_MEANING_PRESERVED: "true",
        SOUTH_FUNNEL_STATUS: report.SOUTH_FUNNEL_STATUS,
        DOWNSTREAM_EXPRESSION_BRIDGE_STATUS: bridge.bridgeStatus,
        DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE: bridge.recommendedFile,
        REPORT_OBJECT: report
      },
      packetText,
      compactSummary,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    publishSouthResult(result);
    return result;
  }

  function buildProbeSouthReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);
    const shared = buildSharedFields(input, currentReport, chronology);
    const downstreamRead = buildDownstreamExpressionRead(currentReport);
    const bridge = downstreamRead.bridge;

    const southEntry = findChronologyEntry(chronology, "RAIL_SOUTH");
    const southComplete = Boolean(southEntry && southEntry.status === "COMPLETE");
    const southObserved = Boolean(southEntry && southEntry.observed === true);
    const southReturned = Boolean(southEntry && southEntry.callStatus === "CALL_RETURNED");
    const southMethod = southEntry ? firstKnown(southEntry.callMethod, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY";
    const packetMeaningPreserved = Boolean(southComplete && southObserved && southReturned);

    const probeStatus = packetMeaningPreserved
      ? "COMPLETE"
      : "COMPLETE_WITH_DIAGNOSTIC_WARNINGS";

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "PROBE_SOUTH_GATE_8_RETURN_SURFACE_ACTIVE",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_ACTIVE",
      `PROBE_SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS:${bridge.bridgeStatus}`,
      `PROBE_SOUTH_RECOMMENDED_FILE:${bridge.recommendedFile}`,
      "PROBE_SOUTH_DOES_NOT_MUTATE_PRODUCTION",
      "PROBE_SOUTH_DOES_NOT_DRAW_CANVAS",
      "PROBE_SOUTH_DOES_NOT_CLAIM_F13_OR_F21",
      "PROBE_SOUTH_DOES_NOT_CLAIM_READY_OR_VISUAL_PASS"
    );

    const report = {
      ...shared,

      PROBE_SOUTH_STATUS: probeStatus,
      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_VERSION: VERSION,
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_CARRIER_FILE: SOUTH_FILE,

      PROBE_SOUTH_GATE: "GATE_8",
      PROBE_SOUTH_ROLE: "RETURN_CHECKMARK_SURFACE_WITH_SURFACE_POINTER_BISHOP_READ",
      PROBE_SOUTH_AUTHORITY: "PASSAGE_CONFIRMATION_AND_READ_ONLY_DOWNSTREAM_EXPRESSION_INSPECTION",
      PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY: "false",
      PROBE_SOUTH_DECLARED_FILE_PATH_RETAINED: "true",
      PROBE_SOUTH_PUBLISHED_BY_SOUTH_RAIL: "true",

      PROBE_SOUTH_RUN_COMPLETE: true,
      PROBE_SOUTH_RUN_STATUS: probeStatus,
      PROBE_SOUTH_PACKET_MEANING_PRESERVED: boolText(packetMeaningPreserved, "false"),
      PROBE_SOUTH_RETURN_TO_NORTH_STATUS: packetMeaningPreserved
        ? "RETURN_SURFACE_COMPLETE"
        : "RETURN_SURFACE_ACTIVE_WITH_GATE7_WARNING",
      PROBE_SOUTH_CHECKMARK_STATUS: packetMeaningPreserved
        ? "CHECKMARK_PASS"
        : "CHECKMARK_ACTIVE_GATE7_NOT_FULLY_CONFIRMED",

      SOUTH_GATE_CONFIRMED_BY_PROBE: boolText(packetMeaningPreserved, "false"),
      SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE: boolText(Boolean(southEntry), "false"),
      SOUTH_RAIL_OBSERVED_BY_PROBE: boolText(southObserved, "false"),
      SOUTH_RAIL_CALL_RETURNED_BY_PROBE: boolText(southReturned, "false"),
      SOUTH_RAIL_CALL_METHOD_BY_PROBE: southMethod,
      SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE: southEntry ? firstKnown(southEntry.status, "UNKNOWN") : "NOT_PRESENT_IN_PARENT_CHRONOLOGY",

      PROBE_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_ACTIVE: "true",
      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_READ: clonePlain(downstreamRead),

      PROBE_SOUTH_SURFACE_POINTER_BISHOP_OBSERVED: boolText(downstreamRead.surfacePointerBishop.observed, "false"),
      PROBE_SOUTH_SURFACE_POINTER_BISHOP_SOURCE_PATH: downstreamRead.surfacePointerBishop.sourcePath,
      PROBE_SOUTH_SURFACE_POINTER_BISHOP_CONTRACT: downstreamRead.surfacePointerBishop.contract,
      PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_METHOD: downstreamRead.surfacePointerBishop.sampleMethod,
      PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_RETURNED: boolText(downstreamRead.surfacePointerBishop.sampleReturned, "false"),
      PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_OK: boolText(downstreamRead.surfacePointerBishop.sampleOk, "false"),
      PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_MATERIAL_CLASS: downstreamRead.surfacePointerBishop.sampleMaterialClass,
      PROBE_SOUTH_SURFACE_POINTER_BISHOP_READY: boolText(downstreamRead.surfacePointerBishop.ready, "false"),

      PROBE_SOUTH_INSPECT_FINGER_OBSERVED: boolText(downstreamRead.inspectFinger.observed, "false"),
      PROBE_SOUTH_INSPECT_FINGER_ALL_READY: downstreamRead.inspectFinger.allFingerReady,
      PROBE_SOUTH_INSPECT_FINGER_SURFACE_READY: downstreamRead.inspectFinger.surfaceReady,
      PROBE_SOUTH_INSPECT_FINGER_FIRST_FAILED_COORDINATE: downstreamRead.inspectFinger.firstFailedCoordinate,

      PROBE_SOUTH_HEX_SURFACE_OBSERVED: boolText(downstreamRead.hexSurface.observed, "false"),
      PROBE_SOUTH_HEX_SURFACE_CONTRACT: downstreamRead.hexSurface.contract,
      PROBE_SOUTH_HEX_SURFACE_READY: boolText(downstreamRead.hexSurface.ready, "false"),

      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS: bridge.bridgeStatus,
      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_FIRST_FAILED_COORDINATE: bridge.firstFailedCoordinate,
      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_OWNER: bridge.recommendedOwner,
      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE: bridge.recommendedFile,
      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_ACTION: bridge.recommendedAction,
      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_CANVAS_DRAW_PATH_CANDIDATE: boolText(bridge.canvasDrawPathCandidate, "false"),
      PROBE_SOUTH_DOWNSTREAM_EXPRESSION_UPSTREAM_EXPRESSION_CANDIDATE: boolText(bridge.upstreamExpressionCandidate, "false"),

      SOUTH_FUNNEL_STATUS: packetMeaningPreserved
        ? "CLOSED_LOOP_RETURN_CONFIRMED_WITH_SURFACE_POINTER_READ"
        : "RETURN_SURFACE_ACTIVE_SOUTH_GATE_NOT_CONFIRMED",
      SOUTH_PROBE_CONTACT_SURFACE_PRESERVED: "true",

      PROBE_SOUTH_ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      PROBE_SOUTH_ALIAS_CHRONOLOGY: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),
      PROBE_SOUTH_PRIMARY_ALIAS: "HEARTH.diagnosticProbeSouth",
      PROBE_SOUTH_PRIMARY_CALLABLE_METHOD: "runProbeSouth",
      PROBE_SOUTH_CALLABLE_METHODS:
        "runProbeSouth | inspectPacketMeaning | inspectPacketComposition | runProbe | inspect | runDiagnostic",
      PROBE_SOUTH_NORTH_V11_COMPATIBLE: "true",
      PROBE_SOUTH_NORTH_V10_COMPATIBLE: "true",

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    const packetText = composePacketText(report, orderedProbeFields(report));
    const compactSummary = composeProbeCompactSummary(report);

    const result = {
      ok: true,
      ...report,

      contract: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      implementationContract: PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      implementationReceipt: PROBE_SOUTH_IMPLEMENTATION_RECEIPT,

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        PROBE_SOUTH_STATUS: probeStatus,
        PROBE_SOUTH_CONTRACT,
        PROBE_SOUTH_RECEIPT,
        PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
        PROBE_SOUTH_RUN_STATUS: probeStatus,
        PROBE_SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS: bridge.bridgeStatus,
        PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE: bridge.recommendedFile,
        REPORT_OBJECT: report
      },
      packetText,
      compactSummary,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    publishProbeResult(result);
    return result;
  }

  function orderedFieldsFromPriority(report, priority) {
    const seen = new Set();
    const out = [];

    for (const field of priority.concat(Object.keys(report || {}))) {
      if (seen.has(field)) continue;
      seen.add(field);
      out.push(field);
    }

    return out;
  }

  function orderedSouthFields(report) {
    return orderedFieldsFromPriority(report, [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",
      "PREVIOUS_NORTH_CONTRACT",
      "PREVIOUS_NORTH_RECEIPT",

      "SOUTH_STATUS",
      "SOUTH_CONTRACT",
      "SOUTH_RECEIPT",
      "SOUTH_IMPLEMENTATION_CONTRACT",
      "SOUTH_IMPLEMENTATION_RECEIPT",
      "SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT",
      "SOUTH_VERSION",
      "SOUTH_FILE",
      "SOUTH_GATE",
      "SOUTH_OUTPUT_COMPLETE",
      "SOUTH_OUTPUT_STATUS",
      "SOUTH_MEANING_PRESERVED",
      "SOUTH_FUNNEL_STATUS",

      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROUTER_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_IMPLEMENTATION_CONTRACT",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY",

      "SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_ACTIVE",
      "SURFACE_POINTER_BISHOP_OBSERVED",
      "SURFACE_POINTER_BISHOP_SOURCE_PATH",
      "SURFACE_POINTER_BISHOP_CONTRACT",
      "SURFACE_POINTER_BISHOP_RECEIPT",
      "SURFACE_POINTER_BISHOP_PACKET_READY",
      "SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_ACTIVE",
      "SURFACE_POINTER_BISHOP_SAMPLE_METHOD",
      "SURFACE_POINTER_BISHOP_SAMPLE_RETURNED",
      "SURFACE_POINTER_BISHOP_SAMPLE_OK",
      "SURFACE_POINTER_BISHOP_SAMPLE_MATERIAL_CLASS",
      "SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SERVED_COUNT",
      "SURFACE_POINTER_BISHOP_HEX_HANDSHAKE_ACCEPTED",
      "SURFACE_POINTER_BISHOP_READY_FOR_DOWNSTREAM",

      "INSPECT_FINGER_OBSERVED",
      "INSPECT_FINGER_CONTRACT",
      "INSPECT_FINGER_SURFACE_READY",
      "INSPECT_FINGER_ALL_READY",
      "INSPECT_FINGER_FIRST_FAILED_COORDINATE",

      "HEX_SURFACE_OBSERVED",
      "HEX_SURFACE_CONTRACT",
      "HEX_SURFACE_RECOGNIZED",
      "HEX_SURFACE_INTAKE_METHODS_AVAILABLE",
      "HEX_SURFACE_READY_FOR_DOWNSTREAM",

      "DOWNSTREAM_EXPRESSION_BRIDGE_STATUS",
      "DOWNSTREAM_EXPRESSION_FIRST_FAILED_COORDINATE",
      "DOWNSTREAM_EXPRESSION_RECOMMENDED_OWNER",
      "DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE",
      "DOWNSTREAM_EXPRESSION_RECOMMENDED_ACTION",
      "DOWNSTREAM_EXPRESSION_CANVAS_DRAW_PATH_CANDIDATE",
      "DOWNSTREAM_EXPRESSION_UPSTREAM_EXPRESSION_CANDIDATE",
      "DOWNSTREAM_EXPRESSION_CANVAS_PIXEL_STATUS",
      "DOWNSTREAM_EXPRESSION_CANVAS_PIXEL_VISIBLE",

      "CHRONOLOGY_SEQUENCE_TEXT",
      "RAIL_NORTH_FILE",
      "RAIL_EAST_FILE",
      "RAIL_WEST_FILE",
      "RAIL_SOUTH_FILE",
      "PROBE_NORTH_FILE",
      "PROBE_EAST_FILE",
      "PROBE_WEST_FILE",
      "PROBE_CANVAS_SURFACE_TRUTH_FILE",
      "PROBE_SOUTH_FILE",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",

      "SECONDARY_EVIDENCE_NOTES",
      "SOUTH_SECONDARY_OUTPUT_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ]);
  }

  function orderedProbeFields(report) {
    return orderedFieldsFromPriority(report, [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "NORTH_CONTRACT",
      "NORTH_RECEIPT",

      "PROBE_SOUTH_STATUS",
      "PROBE_SOUTH_CONTRACT",
      "PROBE_SOUTH_RECEIPT",
      "PROBE_SOUTH_IMPLEMENTATION_CONTRACT",
      "PROBE_SOUTH_IMPLEMENTATION_RECEIPT",
      "PROBE_SOUTH_VERSION",
      "PROBE_SOUTH_FILE",
      "PROBE_SOUTH_CARRIER_FILE",
      "PROBE_SOUTH_GATE",
      "PROBE_SOUTH_ROLE",
      "PROBE_SOUTH_AUTHORITY",
      "PROBE_SOUTH_OPERATIONAL_FILE_DEPENDENCY",
      "PROBE_SOUTH_RUN_COMPLETE",
      "PROBE_SOUTH_RUN_STATUS",
      "PROBE_SOUTH_RETURN_TO_NORTH_STATUS",

      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_RETURN_READ_ACTIVE",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_OBSERVED",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_SOURCE_PATH",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_CONTRACT",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_METHOD",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_RETURNED",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_OK",
      "PROBE_SOUTH_SURFACE_POINTER_BISHOP_READY",

      "PROBE_SOUTH_INSPECT_FINGER_OBSERVED",
      "PROBE_SOUTH_INSPECT_FINGER_ALL_READY",
      "PROBE_SOUTH_INSPECT_FINGER_FIRST_FAILED_COORDINATE",

      "PROBE_SOUTH_HEX_SURFACE_OBSERVED",
      "PROBE_SOUTH_HEX_SURFACE_CONTRACT",
      "PROBE_SOUTH_HEX_SURFACE_READY",

      "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS",
      "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_FIRST_FAILED_COORDINATE",
      "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_OWNER",
      "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE",
      "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_ACTION",
      "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_CANVAS_DRAW_PATH_CANDIDATE",
      "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_UPSTREAM_EXPRESSION_CANDIDATE",

      "SOUTH_GATE_CONFIRMED_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_ENTRY_OBSERVED_BY_PROBE",
      "SOUTH_RAIL_CALL_RETURNED_BY_PROBE",
      "SOUTH_RAIL_CALL_METHOD_BY_PROBE",
      "SOUTH_RAIL_CHRONOLOGY_STATUS_BY_PROBE",

      "CHRONOLOGY_SEQUENCE_TEXT",
      "SECONDARY_EVIDENCE_NOTES",
      "PROBE_SOUTH_SECONDARY_EVIDENCE_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ]);
  }

  function composePacketText(report, fields) {
    return (fields || Object.keys(report || {}))
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeSouthCompactSummary(report) {
    return [
      line("SOUTH_CONTRACT", getValue(report, "SOUTH_CONTRACT", SOUTH_CONTRACT)),
      line("SOUTH_OUTPUT_STATUS", getValue(report, "SOUTH_OUTPUT_STATUS", "UNKNOWN")),
      line("SURFACE_POINTER_BISHOP_OBSERVED", getValue(report, "SURFACE_POINTER_BISHOP_OBSERVED", "UNKNOWN")),
      line("SURFACE_POINTER_BISHOP_SAMPLE_OK", getValue(report, "SURFACE_POINTER_BISHOP_SAMPLE_OK", "UNKNOWN")),
      line("INSPECT_FINGER_ALL_READY", getValue(report, "INSPECT_FINGER_ALL_READY", "UNKNOWN")),
      line("HEX_SURFACE_OBSERVED", getValue(report, "HEX_SURFACE_OBSERVED", "UNKNOWN")),
      line("DOWNSTREAM_EXPRESSION_BRIDGE_STATUS", getValue(report, "DOWNSTREAM_EXPRESSION_BRIDGE_STATUS", "UNKNOWN")),
      line("DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE", getValue(report, "DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE", "UNKNOWN"))
    ].join("\n");
  }

  function composeProbeCompactSummary(report) {
    return [
      line("PROBE_SOUTH_CONTRACT", getValue(report, "PROBE_SOUTH_CONTRACT", PROBE_SOUTH_CONTRACT)),
      line("PROBE_SOUTH_IMPLEMENTATION_CONTRACT", getValue(report, "PROBE_SOUTH_IMPLEMENTATION_CONTRACT", PROBE_SOUTH_IMPLEMENTATION_CONTRACT)),
      line("PROBE_SOUTH_RUN_STATUS", getValue(report, "PROBE_SOUTH_RUN_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_OK", getValue(report, "PROBE_SOUTH_SURFACE_POINTER_BISHOP_SAMPLE_OK", "UNKNOWN")),
      line("PROBE_SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS", getValue(report, "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS", "UNKNOWN")),
      line("PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE", getValue(report, "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE", "UNKNOWN"))
    ].join("\n");
  }

  function baseSouthState() {
    return {
      role: "DIAGNOSTIC_RAIL_SOUTH_PACKET_OUTPUT_WITH_SURFACE_POINTER_BISHOP_RETURN_READ",
      contract: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      previousContract: SOUTH_PREVIOUS_CONTRACT,
      previousReceipt: SOUTH_PREVIOUS_RECEIPT,
      version: VERSION,
      file: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      southGate: "GATE_7",
      probeSouthGate: "GATE_8",
      outputStatus: "READY",
      surfacePointerBishopReturnReadActive: true,
      diagnosticReadOnly: true,
      canvasDrawingAuthorized: false,
      productionMutationAuthorized: false,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function baseProbeState() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_RETURN_CHECKMARK_SURFACE_WITH_SURFACE_POINTER_BISHOP_READ",
      contract: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      implementationContract: PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      implementationReceipt: PROBE_SOUTH_IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: PROBE_SOUTH_FILE,
      carrierFile: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      gate: "GATE_8",
      outputStatus: "READY",
      surfacePointerBishopReturnReadActive: true,
      operationalFileDependency: false,
      publishedBySouthRail: true,
      diagnosticReadOnly: true,
      canvasDrawingAuthorized: false,
      productionMutationAuthorized: false,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function publishSouthResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    lastSouthReport = report;
    lastSouthPacketText = result && result.packetText ? result.packetText : composePacketText(report, orderedSouthFields(report));
    lastSouthCompactSummary = result && result.compactSummary ? result.compactSummary : composeSouthCompactSummary(report);
    lastSouthState = {
      ...baseSouthState(),
      outputStatus: "COMPLETE",
      bridgeStatus: getValue(report, "DOWNSTREAM_EXPRESSION_BRIDGE_STATUS", "UNKNOWN"),
      recommendedFile: getValue(report, "DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE", "UNKNOWN"),
      reportObject: clonePlain(report),
      packetText: lastSouthPacketText,
      compactSummary: lastSouthCompactSummary,
      updatedAt: nowIso()
    };

    publishAllAliases();
  }

  function publishProbeResult(result) {
    const report = isObject(result && result.REPORT_OBJECT)
      ? clonePlain(result.REPORT_OBJECT)
      : isObject(result && result.report)
        ? clonePlain(result.report)
        : {};

    lastProbeReport = report;
    lastProbePacketText = result && result.packetText ? result.packetText : composePacketText(report, orderedProbeFields(report));
    lastProbeCompactSummary = result && result.compactSummary ? result.compactSummary : composeProbeCompactSummary(report);
    lastProbeState = {
      ...baseProbeState(),
      outputStatus: getValue(report, "PROBE_SOUTH_RUN_STATUS", "COMPLETE"),
      bridgeStatus: getValue(report, "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_BRIDGE_STATUS", "UNKNOWN"),
      recommendedFile: getValue(report, "PROBE_SOUTH_DOWNSTREAM_EXPRESSION_RECOMMENDED_FILE", "UNKNOWN"),
      reportObject: clonePlain(report),
      packetText: lastProbePacketText,
      compactSummary: lastProbeCompactSummary,
      updatedAt: nowIso()
    };

    publishAllAliases();
  }

  function composeSouthReport(input = {}) {
    return buildSouthReport(input);
  }

  function runSouth(input = {}) {
    return composeSouthReport(input);
  }

  function composeReport(input = {}) {
    return composeSouthReport(input);
  }

  function inspect(input = {}) {
    return composeSouthReport(input);
  }

  function runDiagnostic(input = {}) {
    return composeSouthReport(input);
  }

  function runProbeSouth(input = {}) {
    return buildProbeSouthReport(input);
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

  function inspectDownstreamExpression(input = {}) {
    const currentReport = extractCurrentReport(input);
    return buildDownstreamExpressionRead(currentReport);
  }

  function getSouthReport() {
    if (lastSouthReport) return clonePlain(lastSouthReport);

    composeSouthReport({
      northContract: NORTH_V11_CONTRACT,
      northReceipt: NORTH_V11_RECEIPT,
      currentReport: {}
    });

    return clonePlain(lastSouthReport || {});
  }

  function getProbeReport() {
    if (lastProbeReport) return clonePlain(lastProbeReport);

    runProbeSouth({
      northContract: NORTH_V11_CONTRACT,
      northReceipt: NORTH_V11_RECEIPT,
      currentReport: {},
      chronology: []
    });

    return clonePlain(lastProbeReport || {});
  }

  function getSouthPacketText() {
    if (lastSouthPacketText) return lastSouthPacketText;
    getSouthReport();
    return lastSouthPacketText;
  }

  function getProbePacketText() {
    if (lastProbePacketText) return lastProbePacketText;
    getProbeReport();
    return lastProbePacketText;
  }

  function getSouthCompactSummary() {
    if (lastSouthCompactSummary) return lastSouthCompactSummary;
    getSouthReport();
    return lastSouthCompactSummary;
  }

  function getProbeCompactSummary() {
    if (lastProbeCompactSummary) return lastProbeCompactSummary;
    getProbeReport();
    return lastProbeCompactSummary;
  }

  function getSouthState() {
    return clonePlain(lastSouthState || baseSouthState());
  }

  function getProbeState() {
    return clonePlain(lastProbeState || baseProbeState());
  }

  function getSouthReceiptLight() {
    return {
      role: "DIAGNOSTIC_RAIL_SOUTH_PACKET_OUTPUT_WITH_SURFACE_POINTER_BISHOP_RETURN_READ",
      contract: SOUTH_CONTRACT,
      CONTRACT: SOUTH_CONTRACT,
      receipt: SOUTH_RECEIPT,
      RECEIPT: SOUTH_RECEIPT,
      previousContract: SOUTH_PREVIOUS_CONTRACT,
      previousReceipt: SOUTH_PREVIOUS_RECEIPT,
      version: VERSION,
      file: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      gate7Role: "SOUTH_PACKET_OUTPUT",
      gate8PublishedByThisFile: true,
      probeSouthReturnSurfacePublished: true,
      surfacePointerBishopReturnReadActive: true,
      separateProbeSouthFileRequiredForNorthObservation: false,
      probeSouthDeclaredFilePath: PROBE_SOUTH_FILE,

      primaryCallableMethod: "composeSouthReport",
      composeSouthReportApiAvailable: true,
      runSouthApiAvailable: true,
      composeReportApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      inspectDownstreamExpressionApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(SOUTH_ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),

      diagnosticReadOnly: true,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      canvasDrawingAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getProbeReceiptLight() {
    return {
      role: "DIAGNOSTIC_PROBE_SOUTH_RETURN_CHECKMARK_SURFACE_WITH_SURFACE_POINTER_BISHOP_READ",
      contract: PROBE_SOUTH_CONTRACT,
      CONTRACT: PROBE_SOUTH_CONTRACT,
      receipt: PROBE_SOUTH_RECEIPT,
      RECEIPT: PROBE_SOUTH_RECEIPT,
      implementationContract: PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      implementationReceipt: PROBE_SOUTH_IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: PROBE_SOUTH_FILE,
      carrierFile: SOUTH_FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      gate8Role: "PROBE_SOUTH_RETURN_SURFACE",
      publishedBySouthRail: true,
      operationalFileDependency: false,
      declaredFilePathRetained: true,
      surfacePointerBishopReturnReadActive: true,
      northV11Compatible: true,
      northV10Compatible: true,

      primaryCallableMethod: "runProbeSouth",
      runProbeSouthApiAvailable: true,
      inspectPacketMeaningApiAvailable: true,
      inspectPacketCompositionApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      inspectDownstreamExpressionApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(PROBE_ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

      diagnosticReadOnly: true,
      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      runtimeRestartAuthorized: false,
      canvasReleaseAuthorized: false,
      canvasDrawingAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getSouthReceipt() {
    return {
      ...getSouthReceiptLight(),

      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_IMPLEMENTATION_CONTRACT: SOUTH_CONTRACT,
      SOUTH_IMPLEMENTATION_RECEIPT: SOUTH_RECEIPT,
      SOUTH_PREVIOUS_IMPLEMENTATION_CONTRACT: SOUTH_PREVIOUS_CONTRACT,
      SOUTH_LINEAGE_V7_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V7_CONTRACT,
      SOUTH_LINEAGE_V6_IMPLEMENTATION_CONTRACT: SOUTH_LINEAGE_V6_CONTRACT,
      SOUTH_BASELINE_IMPLEMENTATION_CONTRACT: SOUTH_BASELINE_CONTRACT,

      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_FILE,

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

      SURFACE_FILE,
      INSPECT_FILE,
      HEX_SURFACE_FILE,
      CANVAS_FILE,

      reportObject: clonePlain(lastSouthReport || {}),
      state: clonePlain(lastSouthState || baseSouthState()),
      localEvents: clonePlain(localEvents),
      errors: clonePlain(localErrors),

      ...UPPER_NO_CLAIMS
    };
  }

  function getProbeReceipt() {
    return {
      ...getProbeReceiptLight(),

      PROBE_SOUTH_CONTRACT,
      PROBE_SOUTH_RECEIPT,
      PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      PROBE_SOUTH_IMPLEMENTATION_RECEIPT,
      PROBE_SOUTH_FILE,
      PROBE_SOUTH_CARRIER_FILE: SOUTH_FILE,

      SOUTH_CONTRACT,
      SOUTH_RECEIPT,
      SOUTH_FILE,

      SURFACE_FILE,
      INSPECT_FILE,
      HEX_SURFACE_FILE,
      CANVAS_FILE,

      reportObject: clonePlain(lastProbeReport || {}),
      state: clonePlain(lastProbeState || baseProbeState()),
      localEvents: clonePlain(localEvents),
      errors: clonePlain(localErrors),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAllAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticSouth = southApi;
    root.HEARTH.diagnosticRailSouth = southApi;
    root.HEARTH.diagnosticSouthRail = southApi;
    root.HEARTH.southDiagnosticRail = southApi;
    root.HEARTH.southDiagnostic = southApi;

    root.HEARTH_DIAGNOSTIC_SOUTH = southApi;
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH = southApi;
    root.HEARTH_DIAGNOSTIC_SOUTH_RAIL = southApi;

    root.DEXTER_LAB.hearthDiagnosticSouth = southApi;
    root.DEXTER_LAB.hearthDiagnosticRailSouth = southApi;
    root.DEXTER_LAB.hearthDiagnosticSouthRail = southApi;
    root.DEXTER_LAB.hearthSouthDiagnosticRail = southApi;

    root.HEARTH.diagnosticProbeSouth = probeSouthApi;
    root.HEARTH.diagnosticRailProbeSouth = probeSouthApi;
    root.HEARTH.diagnosticSouthProbe = probeSouthApi;

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH = probeSouthApi;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH = probeSouthApi;
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE = probeSouthApi;

    root.DEXTER_LAB.hearthDiagnosticProbeSouth = probeSouthApi;
    root.DEXTER_LAB.hearthDiagnosticRailProbeSouth = probeSouthApi;
    root.DEXTER_LAB.hearthDiagnosticSouthProbe = probeSouthApi;

    root.HEARTH_DIAGNOSTIC_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_RECEIPT = getSouthReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_REPORT = clonePlain(lastSouthReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_REPORT = clonePlain(lastSouthReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PACKET_TEXT = lastSouthPacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_SOUTH_PACKET_TEXT = lastSouthPacketText || "";

    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_RECEIPT = getProbeReceipt();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_RECEIPT = getProbeReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_RECEIPT = getProbeReceipt();
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_REPORT = clonePlain(lastProbeReport || {});
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_REPORT = clonePlain(lastProbeReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_PROBE_REPORT = clonePlain(lastProbeReport || {});
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_TEXT = lastProbePacketText || "";
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH_PACKET_TEXT = lastProbePacketText || "";

    return true;
  }

  Object.assign(southApi, {
    contract: SOUTH_CONTRACT,
    CONTRACT: SOUTH_CONTRACT,
    receipt: SOUTH_RECEIPT,
    RECEIPT: SOUTH_RECEIPT,
    previousContract: SOUTH_PREVIOUS_CONTRACT,
    previousReceipt: SOUTH_PREVIOUS_RECEIPT,
    version: VERSION,

    file: SOUTH_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    southOutputAuthority: "PACKET_OUTPUT_ONLY",
    southMeaningPreservationAuthority: true,
    southChronologyStandardCompatible: true,
    northV11Compatible: true,
    northV10Compatible: true,
    gate7Role: "SOUTH_PACKET_OUTPUT",
    gate8ProbeSouthPublishedByThisFile: true,
    separateProbeSouthFileRequiredForNorthObservation: false,
    surfacePointerBishopReturnReadActive: true,

    aliasChronology: SOUTH_ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(SOUTH_ALIAS_CHRONOLOGY),
    probeAliasChronology: PROBE_ALIAS_CHRONOLOGY,
    probeAliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

    composeSouthReport,
    runSouth,
    composeReport,
    inspect,
    runDiagnostic,
    inspectDownstreamExpression,
    getReport: getSouthReport,
    getPacketText: getSouthPacketText,
    getCompactSummary: getSouthCompactSummary,
    getState: getSouthState,
    getReceipt: getSouthReceipt,
    getReceiptLight: getSouthReceiptLight,

    composeSouthReportApiAvailable: true,
    runSouthApiAvailable: true,
    composeReportApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    inspectDownstreamExpressionApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    diagnosticReadOnly: true,
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,

    ...NO_CLAIMS
  });

  Object.assign(probeSouthApi, {
    contract: PROBE_SOUTH_CONTRACT,
    CONTRACT: PROBE_SOUTH_CONTRACT,
    receipt: PROBE_SOUTH_RECEIPT,
    RECEIPT: PROBE_SOUTH_RECEIPT,
    implementationContract: PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
    implementationReceipt: PROBE_SOUTH_IMPLEMENTATION_RECEIPT,
    version: VERSION,

    file: PROBE_SOUTH_FILE,
    carrierFile: SOUTH_FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    packetName: PACKET_NAME,

    gate8Role: "PROBE_SOUTH_RETURN_CHECKMARK_SURFACE_WITH_SURFACE_POINTER_BISHOP_READ",
    authority: "PASSAGE_CONFIRMATION_AND_READ_ONLY_DOWNSTREAM_EXPRESSION_INSPECTION",
    publishedBySouthRail: true,
    operationalFileDependency: false,
    declaredFilePathRetained: true,
    northV11Compatible: true,
    northV10Compatible: true,
    surfacePointerBishopReturnReadActive: true,

    aliasChronology: PROBE_ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(PROBE_ALIAS_CHRONOLOGY),

    runProbeSouth,
    inspectPacketMeaning,
    inspectPacketComposition,
    runProbe,
    inspect: runProbeSouth,
    runDiagnostic: runProbeSouth,
    inspectDownstreamExpression,
    getReport: getProbeReport,
    getPacketText: getProbePacketText,
    getCompactSummary: getProbeCompactSummary,
    getState: getProbeState,
    getReceipt: getProbeReceipt,
    getReceiptLight: getProbeReceiptLight,

    runProbeSouthApiAvailable: true,
    inspectPacketMeaningApiAvailable: true,
    inspectPacketCompositionApiAvailable: true,
    runProbeApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    inspectDownstreamExpressionApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    diagnosticReadOnly: true,
    productionMutationAuthorized: false,
    hearthRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    canvasReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,

    ...NO_CLAIMS
  });

  try {
    lastSouthState = baseSouthState();
    lastProbeState = baseProbeState();

    publishAllAliases();

    record("SOUTH_V9_SURFACE_POINTER_BISHOP_RETURN_READ_BOOTED", {
      southContract: SOUTH_CONTRACT,
      probeSouthContract: PROBE_SOUTH_CONTRACT,
      probeSouthImplementationContract: PROBE_SOUTH_IMPLEMENTATION_CONTRACT,
      surfaceFile: SURFACE_FILE,
      inspectFile: INSPECT_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      canvasFile: CANVAS_FILE
    });
  } catch (error) {
    recordError("SOUTH_V9_INITIALIZATION_FAILED", error);

    try {
      publishAllAliases();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      south: southApi,
      probeSouth: probeSouthApi
    };
  }
})();
