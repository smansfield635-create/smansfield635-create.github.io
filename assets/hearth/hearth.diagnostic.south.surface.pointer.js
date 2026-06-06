// /assets/hearth/hearth.diagnostic.south.surface.pointer.js
// HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1
// Full-file creation.
// Diagnostic South Surface Pointer sidecar only.
// Purpose:
// - Add an asymmetric tenth diagnostic sidecar without changing the nine-cycle chronology.
// - Give Probe South a read-only surface pointer/bishop/finger/hex inspection surface when this file is loaded.
// - Inspect whether the downstream expression set is observable before Canvas is blamed directly.
// - Separate these cases:
//   1. Boundary/Mass/Surface/Light/Hex bridge are observable and coherent, but Canvas pixels remain blank.
//   2. Surface/finger/hex transmission is missing or degraded before Canvas draw.
//   3. Bishop/Queen recognition exists but downstream packet transmission is not proven.
// - Publish stable aliases for Probe South consumption.
// - Preserve South rail and Probe South ownership boundaries.
// Does not own:
// - diagnostic rail chronology
// - South packet output
// - Probe South packet meaning
// - production repair
// - route conductor mutation
// - Canvas drawing
// - Canvas creation
// - Canvas release
// - controls
// - runtime restart
// - terrain/material/hydrology truth
// - final visual pass
// - F13/F21/F55 claim

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ_RECEIPT_v1";

  const VERSION =
    "2026-06-06.hearth-diagnostic-south-surface-pointer-bishop-sidecar-read-v1";

  const FILE = "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PACKET_NAME =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_PACKET_v1";

  const SOUTH_RAIL_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const EXPECTED_PROBE_SOUTH_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_SOUTH_PACKET_MEANING_FILE_COMPOSITION_TNT_v1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    f55ClaimedBySidecar: false,
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
    F55_CLAIMED_BY_SIDECAR: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let lastReport = null;
  let lastPacketText = "";
  let lastCompactSummary = "";

  const ALIAS_CHRONOLOGY = Object.freeze([
    Object.freeze({
      order: 1,
      alias: "HEARTH.diagnosticSouthSurfacePointer",
      layer: "HEARTH",
      role: "primary-sidecar-surface",
      authority: "read-only-sidecar"
    }),
    Object.freeze({
      order: 2,
      alias: "HEARTH.diagnosticSurfacePointerSouth",
      layer: "HEARTH",
      role: "south-oriented-surface-pointer",
      authority: "read-only-sidecar"
    }),
    Object.freeze({
      order: 3,
      alias: "HEARTH.diagnosticSouthBishopSurfacePointer",
      layer: "HEARTH",
      role: "bishop-surface-pointer-read",
      authority: "read-only-sidecar"
    }),
    Object.freeze({
      order: 4,
      alias: "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
      layer: "GLOBAL",
      role: "legacy-global-sidecar",
      authority: "read-only-sidecar"
    }),
    Object.freeze({
      order: 5,
      alias: "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER",
      layer: "GLOBAL",
      role: "legacy-global-bishop-sidecar",
      authority: "read-only-sidecar"
    }),
    Object.freeze({
      order: 6,
      alias: "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer",
      layer: "DEXTER_LAB",
      role: "lab-visible-sidecar",
      authority: "read-only-sidecar"
    }),
    Object.freeze({
      order: 7,
      alias: "DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer",
      layer: "DEXTER_LAB",
      role: "lab-visible-bishop-sidecar",
      authority: "read-only-sidecar"
    })
  ]);

  const KNOWN_PATHS = Object.freeze({
    bishopQueenFunnel: Object.freeze([
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.bishopQueenCanvasRecognitionFunnel",
      "HEARTH_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL"
    ]),
    fingerInspect: Object.freeze([
      "HEARTH.canvasFingerInspect",
      "HEARTH.hearthCanvasFingerInspect",
      "HEARTH.diagnosticCanvasFingerInspect",
      "DEXTER_LAB.hearthCanvasFingerInspect",
      "DEXTER_LAB.hearthDiagnosticCanvasFingerInspect",
      "HEARTH_CANVAS_FINGER_INSPECT",
      "HEARTH_CANVAS_FINGER_INSPECT_RECEIPT"
    ]),
    hexSurface: Object.freeze([
      "HEARTH.hexSurface",
      "HEARTH.hearthHexSurface",
      "HEARTH.canvasHexSurface",
      "HEARTH.hearthCanvasHexSurface",
      "DEXTER_LAB.hearthHexSurface",
      "HEARTH_HEX_SURFACE",
      "HEARTH_HEX_SURFACE_RECEIPT"
    ]),
    fourPairAuthority: Object.freeze([
      "HEARTH.hexFourPairAuthority",
      "HEARTH.hearthHexFourPairAuthority",
      "HEARTH.fourPairAuthority",
      "HEARTH.hexFourPairPixelHandshakeAuthority",
      "DEXTER_LAB.hearthHexFourPairAuthority",
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_RECEIPT"
    ]),
    canvasHub: Object.freeze([
      "HEARTH.canvas",
      "HEARTH.hearthCanvas",
      "HEARTH.canvasHub",
      "HEARTH.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasHub",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_RECEIPT"
    ]),
    surfacePacket: Object.freeze([
      "HEARTH.surface",
      "HEARTH.hearthSurface",
      "HEARTH.surfacePacket",
      "HEARTH.expressionSurface",
      "HEARTH.canvasExpressionSurface",
      "DEXTER_LAB.hearthSurface",
      "DEXTER_LAB.hearthExpressionSurface",
      "HEARTH_SURFACE",
      "HEARTH_SURFACE_PACKET"
    ])
  });

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
      const out = value
        .map((entry) => {
          if (isObject(entry)) {
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
      return out || fallback;
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

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
    return fallback;
  }

  function numberText(value, fallback = "UNKNOWN") {
    const n = Number(value);
    if (Number.isFinite(n)) return String(n);
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
        `layer:${entry.layer}`,
        `role:${entry.role}`,
        `authority:${entry.authority}`
      ].join(" ");
    }).join(" | ");
  }

  function resolvePath(path) {
    if (!path || typeof path !== "string") {
      return { found: false, value: undefined, error: "INVALID_PATH" };
    }

    try {
      const parts = path.split(".");
      let cursor = root;

      for (const part of parts) {
        if (!cursor || !(part in cursor)) {
          return { found: false, value: undefined, error: "MISSING_SEGMENT:" + part };
        }
        cursor = cursor[part];
      }

      return { found: cursor !== undefined && cursor !== null, value: cursor, error: "NONE" };
    } catch (error) {
      return { found: false, value: undefined, error: bounded(error && error.message, 1000) || "PATH_ERROR" };
    }
  }

  function contractOf(value) {
    if (!isObject(value)) return "UNKNOWN";
    return firstKnown(
      value.CONTRACT,
      value.contract,
      value.CANVAS_CONTRACT,
      value.canvasContract,
      value.HEX_CONTRACT,
      value.hexContract,
      value.SURFACE_CONTRACT,
      value.surfaceContract,
      value.IMPLEMENTATION_CONTRACT,
      value.implementationContract
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "UNKNOWN";
    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.CANVAS_RECEIPT,
      value.canvasReceipt,
      value.HEX_RECEIPT,
      value.hexReceipt,
      value.SURFACE_RECEIPT,
      value.surfaceReceipt,
      value.IMPLEMENTATION_RECEIPT,
      value.implementationReceipt
    );
  }

  function methodListOf(value) {
    if (!isObject(value)) return [];
    return Object.keys(value)
      .filter((key) => {
        try {
          return typeof value[key] === "function";
        } catch (_error) {
          return false;
        }
      })
      .sort();
  }

  function primitiveSnapshot(value) {
    if (!isObject(value)) return {};

    const out = {};
    const keys = Object.keys(value).slice(0, 160);

    for (const key of keys) {
      let entry;
      try {
        entry = value[key];
      } catch (_error) {
        continue;
      }

      if (
        entry === undefined ||
        entry === null ||
        typeof entry === "function" ||
        (typeof entry === "object" && !Array.isArray(entry))
      ) {
        continue;
      }

      if (Array.isArray(entry)) {
        out[key] = entry.length <= 24 ? clonePlain(entry) : `ARRAY_LENGTH_${entry.length}`;
        continue;
      }

      out[key] = entry;
    }

    return out;
  }

  function safeGetterSnapshot(value) {
    const out = {};

    if (!isObject(value)) return out;

    const getters = [
      "getReceiptLight",
      "getReceipt",
      "getState",
      "getReport",
      "getCompactSummary"
    ];

    for (const method of getters) {
      if (typeof value[method] !== "function") continue;

      try {
        const result = value[method]();
        if (isObject(result)) {
          out[method] = primitiveSnapshot(result);
        } else {
          out[method] = bounded(result, 2000);
        }
      } catch (error) {
        out[method + "Error"] = bounded(error && error.message, 1000) || "CALL_ERROR";
      }
    }

    return out;
  }

  function inspectPathGroup(groupName, paths) {
    const candidates = [];

    for (const path of paths || []) {
      const resolved = resolvePath(path);
      const value = resolved.value;
      const observed = Boolean(resolved.found && value);

      const candidate = {
        group: groupName,
        path,
        observed,
        error: resolved.error || "NONE",
        type: observed ? typeof value : "undefined",
        contract: observed ? contractOf(value) : "UNKNOWN",
        receipt: observed ? receiptOf(value) : "UNKNOWN",
        methods: observed ? methodListOf(value) : [],
        primitiveSnapshot: observed ? primitiveSnapshot(value) : {},
        getterSnapshot: observed ? safeGetterSnapshot(value) : {}
      };

      candidates.push(candidate);
    }

    const selected =
      candidates.find((candidate) => candidate.observed && candidate.contract !== "UNKNOWN") ||
      candidates.find((candidate) => candidate.observed) ||
      null;

    return {
      group: groupName,
      observed: Boolean(selected),
      selectedPath: selected ? selected.path : "NONE",
      selectedContract: selected ? selected.contract : "UNKNOWN",
      selectedReceipt: selected ? selected.receipt : "UNKNOWN",
      selectedMethods: selected ? selected.methods : [],
      candidates
    };
  }

  function scanNamespace(namespaceName, objectRef, includePattern) {
    const out = [];

    if (!isObject(objectRef)) return out;

    let keys = [];
    try {
      keys = Object.keys(objectRef);
    } catch (_error) {
      return out;
    }

    for (const key of keys.slice(0, 500)) {
      const lower = key.toLowerCase();

      if (!includePattern.test(lower)) continue;

      let value;
      try {
        value = objectRef[key];
      } catch (_error) {
        continue;
      }

      const observed = value !== undefined && value !== null;
      out.push({
        namespace: namespaceName,
        key,
        path: `${namespaceName}.${key}`,
        observed,
        type: observed ? typeof value : "undefined",
        contract: isObject(value) ? contractOf(value) : "UNKNOWN",
        receipt: isObject(value) ? receiptOf(value) : "UNKNOWN",
        methodCount: isObject(value) ? methodListOf(value).length : 0
      });

      if (out.length >= 120) break;
    }

    return out;
  }

  function collectNamespaceCandidates() {
    const includePattern = /(hearth|canvas|finger|surface|hex|bishop|queen|boundary|mass|light|pointer)/i;

    const direct = scanNamespace("window", root, includePattern);
    const hearth = scanNamespace("HEARTH", root.HEARTH, includePattern);
    const lab = scanNamespace("DEXTER_LAB", root.DEXTER_LAB, includePattern);

    return direct.concat(hearth, lab).slice(0, 240);
  }

  function truthyField(...values) {
    for (const value of values) {
      if (value === true) return true;
      if (value === "true" || value === "TRUE") return true;
      if (value === 1 || value === "1") return true;
      if (typeof value === "string" && /ready|active|complete|observed|available|present|valid/i.test(value)) {
        return true;
      }
    }
    return false;
  }

  function fieldFromSnapshots(group, names) {
    const all = [];

    if (!group || !Array.isArray(group.candidates)) return undefined;

    for (const candidate of group.candidates) {
      if (!candidate || !candidate.observed) continue;

      all.push(candidate.primitiveSnapshot || {});

      const getter = candidate.getterSnapshot || {};
      for (const value of Object.values(getter)) {
        if (isObject(value)) all.push(value);
      }
    }

    for (const snapshot of all) {
      for (const name of names) {
        const value = getRaw(snapshot, name, undefined);
        if (value !== undefined && value !== null && value !== "") return value;
      }
    }

    return undefined;
  }

  function readinessFromGroup(group) {
    if (!group || !group.observed) return false;
    if (group.selectedContract !== "UNKNOWN") return true;
    if (Array.isArray(group.selectedMethods) && group.selectedMethods.length > 0) return true;
    return true;
  }

  function summarizeFingerReadiness(groups) {
    const finger = groups.fingerInspect;
    const bishop = groups.bishopQueenFunnel;
    const surface = groups.surfacePacket;
    const hex = groups.hexSurface;
    const fourPair = groups.fourPairAuthority;

    const boundaryValue = fieldFromSnapshots(finger, [
      "BOUNDARY_READY",
      "boundaryReady",
      "boundaryObserved",
      "BOUNDARY_OBSERVED",
      "BOUNDARY_FINGER_READY",
      "boundaryFingerReady"
    ]);

    const massValue = fieldFromSnapshots(finger, [
      "MASS_READY",
      "massReady",
      "massObserved",
      "MASS_OBSERVED",
      "MASS_FINGER_READY",
      "massFingerReady"
    ]);

    const surfaceValue = fieldFromSnapshots(finger, [
      "SURFACE_READY",
      "surfaceReady",
      "surfaceObserved",
      "SURFACE_OBSERVED",
      "SURFACE_FINGER_READY",
      "surfaceFingerReady"
    ]);

    const lightValue = fieldFromSnapshots(finger, [
      "LIGHT_READY",
      "lightReady",
      "lightObserved",
      "LIGHT_OBSERVED",
      "LIGHT_FINGER_READY",
      "lightFingerReady"
    ]);

    const expressionSampleCount = firstKnown(
      numberText(fieldFromSnapshots(finger, [
        "EXPRESSION_SAMPLE_COUNT",
        "expressionSampleCount",
        "sampleCount",
        "SAMPLE_COUNT"
      ])),
      numberText(fieldFromSnapshots(hex, [
        "EXPRESSION_SAMPLE_COUNT",
        "expressionSampleCount",
        "sampleCount",
        "SAMPLE_COUNT"
      ])),
      "UNKNOWN"
    );

    const hexTransmissionValue = fieldFromSnapshots(hex, [
      "HEX_TRANSMISSION_READY",
      "hexTransmissionReady",
      "transmissionReady",
      "TRANSMISSION_READY",
      "SURFACE_PACKET_CONSUMED",
      "surfacePacketConsumed"
    ]);

    const fourPairValue = fieldFromSnapshots(fourPair, [
      "HANDSHAKE_VALID",
      "handshakeValid",
      "AUTHORITY_READY",
      "authorityReady",
      "ATLAS_READY",
      "atlasReady"
    ]);

    const boundaryReady = truthyField(boundaryValue) || readinessFromGroup(finger);
    const massReady = truthyField(massValue) || readinessFromGroup(finger);
    const surfaceReady = truthyField(surfaceValue) || readinessFromGroup(surface) || readinessFromGroup(finger);
    const lightReady = truthyField(lightValue) || readinessFromGroup(finger);
    const hexReady = truthyField(hexTransmissionValue) || readinessFromGroup(hex);
    const fourPairReady = truthyField(fourPairValue) || readinessFromGroup(fourPair);
    const bishopReady = readinessFromGroup(bishop);

    const complete =
      bishopReady &&
      boundaryReady &&
      massReady &&
      surfaceReady &&
      lightReady &&
      hexReady &&
      fourPairReady;

    const partial =
      bishopReady ||
      boundaryReady ||
      massReady ||
      surfaceReady ||
      lightReady ||
      hexReady ||
      fourPairReady;

    let status = "DOWNSTREAM_EXPRESSION_SET_NOT_OBSERVED";
    if (complete) status = "DOWNSTREAM_EXPRESSION_SET_OBSERVED_AND_COHERENT";
    else if (partial) status = "DOWNSTREAM_EXPRESSION_SET_PARTIAL_OR_DEGRADED";

    return {
      status,

      bishopReady,
      boundaryReady,
      massReady,
      surfaceReady,
      lightReady,
      hexSurfaceReady: hexReady,
      fourPairAuthorityReady: fourPairReady,

      boundaryRaw: packetValue(boundaryValue, "UNKNOWN"),
      massRaw: packetValue(massValue, "UNKNOWN"),
      surfaceRaw: packetValue(surfaceValue, "UNKNOWN"),
      lightRaw: packetValue(lightValue, "UNKNOWN"),
      hexTransmissionRaw: packetValue(hexTransmissionValue, "UNKNOWN"),
      fourPairRaw: packetValue(fourPairValue, "UNKNOWN"),
      expressionSampleCount
    };
  }

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }
    return {};
  }

  function extractChronology(input, currentReport) {
    if (Array.isArray(input && input.chronology)) return clonePlain(input.chronology);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) {
      return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    }
    if (Array.isArray(currentReport && currentReport.chronology)) {
      return clonePlain(currentReport.chronology);
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

  function buildReport(input = {}) {
    const currentReport = extractCurrentReport(input);
    const chronology = extractChronology(input, currentReport);

    const groups = {
      bishopQueenFunnel: inspectPathGroup("bishopQueenFunnel", KNOWN_PATHS.bishopQueenFunnel),
      fingerInspect: inspectPathGroup("fingerInspect", KNOWN_PATHS.fingerInspect),
      hexSurface: inspectPathGroup("hexSurface", KNOWN_PATHS.hexSurface),
      fourPairAuthority: inspectPathGroup("fourPairAuthority", KNOWN_PATHS.fourPairAuthority),
      canvasHub: inspectPathGroup("canvasHub", KNOWN_PATHS.canvasHub),
      surfacePacket: inspectPathGroup("surfacePacket", KNOWN_PATHS.surfacePacket)
    };

    const readiness = summarizeFingerReadiness(groups);
    const namespaceCandidates = collectNamespaceCandidates();

    const canvasPixelStatus = firstKnown(
      currentReport.CANVAS_PIXEL_SAMPLE_STATUS,
      currentReport.canvasPixelSampleStatus,
      getRaw(currentReport.canvasSurfaceTruth || {}, "canvasPixelSampleStatus", undefined),
      "UNKNOWN"
    );

    const canvasPixelVisible = firstKnown(
      currentReport.CANVAS_PIXEL_VISIBLE,
      currentReport.canvasPixelVisible,
      getRaw(currentReport.canvasSurfaceTruth || {}, "canvasPixelVisible", undefined),
      "UNKNOWN"
    );

    const canvasBlank =
      canvasPixelStatus === "PIXEL_SAMPLE_BLANK" ||
      canvasPixelStatus === "PIXEL_EMPTY_OR_TRANSPARENT" ||
      boolText(canvasPixelVisible, "UNKNOWN") === "false";

    let interpretation = "SURFACE_POINTER_READ_INCONCLUSIVE";
    let recommendedOwner = "DIAGNOSTIC_OR_EXPRESSION_ADAPTER";
    let recommendedFile = FINGER_INSPECT_FILE;
    let recommendedAction = "REVIEW_SURFACE_POINTER_SIDECAR_FIELDS";

    if (readiness.status === "DOWNSTREAM_EXPRESSION_SET_OBSERVED_AND_COHERENT" && canvasBlank) {
      interpretation = "DOWNSTREAM_EXPRESSION_READY_BUT_CANVAS_PIXELS_BLANK";
      recommendedOwner = "CANVAS_DRAWING_OR_EXPRESSION_ADAPTER";
      recommendedFile = CANVAS_FILE;
      recommendedAction = "VERIFY_CANVAS_DRAW_PATH_EXECUTES_AND_WRITES_VISIBLE_PIXELS";
    } else if (readiness.status === "DOWNSTREAM_EXPRESSION_SET_PARTIAL_OR_DEGRADED") {
      interpretation = "DOWNSTREAM_EXPRESSION_PARTIAL_BEFORE_CANVAS_DRAW";
      recommendedOwner = "DOWNSTREAM_EXPRESSION_ADAPTER";
      recommendedFile = FINGER_INSPECT_FILE;
      recommendedAction = "AUDIT_FINGER_SURFACE_HEX_TRANSMISSION_BEFORE_CANVAS_RENEWAL";
    } else if (!groups.bishopQueenFunnel.observed) {
      interpretation = "BISHOP_QUEEN_POINTER_NOT_OBSERVED";
      recommendedOwner = "ROUTE_CONDUCTOR_OR_PROBE_SOUTH_SIDELOAD";
      recommendedFile = PROBE_SOUTH_FILE;
      recommendedAction = "ENSURE_PROBE_SOUTH_LOADS_OR_CAN_SEE_SURFACE_POINTER_SIDECAR";
    } else if (!groups.hexSurface.observed && !groups.surfacePacket.observed) {
      interpretation = "BISHOP_PRESENT_BUT_SURFACE_HEX_BRIDGE_NOT_OBSERVED";
      recommendedOwner = "SURFACE_POINTER_OR_HEX_BRIDGE";
      recommendedFile = HEX_SURFACE_FILE;
      recommendedAction = "VERIFY_SURFACE_PACKET_AND_HEX_SURFACE_BRIDGE_PUBLIC_ALIASES";
    }

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "SOUTH_SURFACE_POINTER_SIDECAR_ACTIVE",
      "SOUTH_SURFACE_POINTER_IS_TENTH_DIAGNOSTIC_SIDECAR_NOT_NINTH_CYCLE_REPLACEMENT",
      "SOUTH_SURFACE_POINTER_READ_ONLY_NO_PRODUCTION_MUTATION",
      "SOUTH_SURFACE_POINTER_DOES_NOT_DRAW_CANVAS",
      "SOUTH_SURFACE_POINTER_DOES_NOT_RESTART_RUNTIME",
      "SOUTH_SURFACE_POINTER_DOES_NOT_CLAIM_F13_F21_F55_OR_VISUAL_PASS",
      "SOUTH_SURFACE_POINTER_INSPECTS_BISHOP_SURFACE_FINGER_HEX_SET",
      interpretation
    );

    const report = {
      PACKET_NAME,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: firstKnown(
        currentReport.DIAGNOSTIC_TIMESTAMP,
        input.diagnosticTimestamp,
        nowIso()
      ),

      CONTRACT,
      RECEIPT,
      VERSION,
      FILE,

      SOUTH_SURFACE_POINTER_STATUS: "COMPLETE",
      SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
      SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
      SOUTH_SURFACE_POINTER_VERSION: VERSION,
      SOUTH_SURFACE_POINTER_FILE: FILE,
      SOUTH_SURFACE_POINTER_ROLE: "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR",
      SOUTH_SURFACE_POINTER_AUTHORITY: "READ_ONLY_DOWNSTREAM_EXPRESSION_SET_INSPECTION",
      SOUTH_SURFACE_POINTER_CHRONOLOGY_POSITION: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      SOUTH_SURFACE_POINTER_IS_NINTH_CYCLE: "false",
      SOUTH_SURFACE_POINTER_REPLACES_PROBE_SOUTH: "false",
      SOUTH_SURFACE_POINTER_REPLACES_SOUTH_RAIL: "false",
      SOUTH_SURFACE_POINTER_OPERATIONAL_DEPENDENCY_FOR_NORTH: "false",
      SOUTH_SURFACE_POINTER_CONSUMER: PROBE_SOUTH_FILE,

      SOUTH_RAIL_FILE,
      PROBE_SOUTH_FILE,
      CANVAS_FILE,
      FINGER_INSPECT_FILE,
      HEX_SURFACE_FILE,
      HEX_FOUR_PAIR_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      ALIAS_CHRONOLOGY_STATUS: "COMPLETE",
      ALIAS_CHRONOLOGY: clonePlain(ALIAS_CHRONOLOGY),
      ALIAS_CHRONOLOGY_TEXT: aliasChronologyText(ALIAS_CHRONOLOGY),
      PRIMARY_ALIAS: "HEARTH.diagnosticSouthSurfacePointer",
      PRIMARY_CALLABLE: "runSouthSurfacePointerRead",
      CALLABLE_METHODS:
        "runSouthSurfacePointerRead | inspectSouthSurfacePointer | inspectSurfacePointer | runProbeSidecar | inspect | runDiagnostic | getReport | getPacketText | getCompactSummary | getState | getReceipt | getReceiptLight",

      CHRONOLOGY_SEQUENCE: chronology,
      CHRONOLOGY_SEQUENCE_TEXT: firstKnown(
        currentReport.CHRONOLOGY_SEQUENCE_TEXT,
        chronologyText(chronology)
      ),

      BISHOP_QUEEN_FUNNEL_OBSERVED: boolText(groups.bishopQueenFunnel.observed, "false"),
      BISHOP_QUEEN_FUNNEL_SELECTED_PATH: groups.bishopQueenFunnel.selectedPath,
      BISHOP_QUEEN_FUNNEL_CONTRACT: groups.bishopQueenFunnel.selectedContract,
      BISHOP_QUEEN_FUNNEL_RECEIPT: groups.bishopQueenFunnel.selectedReceipt,

      FINGER_INSPECT_OBSERVED: boolText(groups.fingerInspect.observed, "false"),
      FINGER_INSPECT_SELECTED_PATH: groups.fingerInspect.selectedPath,
      FINGER_INSPECT_CONTRACT: groups.fingerInspect.selectedContract,
      FINGER_INSPECT_RECEIPT: groups.fingerInspect.selectedReceipt,

      SURFACE_PACKET_OBSERVED: boolText(groups.surfacePacket.observed, "false"),
      SURFACE_PACKET_SELECTED_PATH: groups.surfacePacket.selectedPath,
      SURFACE_PACKET_CONTRACT: groups.surfacePacket.selectedContract,
      SURFACE_PACKET_RECEIPT: groups.surfacePacket.selectedReceipt,

      HEX_SURFACE_OBSERVED: boolText(groups.hexSurface.observed, "false"),
      HEX_SURFACE_SELECTED_PATH: groups.hexSurface.selectedPath,
      HEX_SURFACE_CONTRACT: groups.hexSurface.selectedContract,
      HEX_SURFACE_RECEIPT: groups.hexSurface.selectedReceipt,

      HEX_FOUR_PAIR_AUTHORITY_OBSERVED: boolText(groups.fourPairAuthority.observed, "false"),
      HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH: groups.fourPairAuthority.selectedPath,
      HEX_FOUR_PAIR_AUTHORITY_CONTRACT: groups.fourPairAuthority.selectedContract,
      HEX_FOUR_PAIR_AUTHORITY_RECEIPT: groups.fourPairAuthority.selectedReceipt,

      CANVAS_HUB_OBSERVED_BY_SIDECAR: boolText(groups.canvasHub.observed, "false"),
      CANVAS_HUB_SELECTED_PATH_BY_SIDECAR: groups.canvasHub.selectedPath,
      CANVAS_HUB_CONTRACT_BY_SIDECAR: groups.canvasHub.selectedContract,
      CANVAS_HUB_RECEIPT_BY_SIDECAR: groups.canvasHub.selectedReceipt,

      BOUNDARY_FINGER_READY: boolText(readiness.boundaryReady, "false"),
      MASS_FINGER_READY: boolText(readiness.massReady, "false"),
      SURFACE_FINGER_READY: boolText(readiness.surfaceReady, "false"),
      LIGHT_FINGER_READY: boolText(readiness.lightReady, "false"),
      HEX_SURFACE_BRIDGE_READY: boolText(readiness.hexSurfaceReady, "false"),
      HEX_FOUR_PAIR_AUTHORITY_READY: boolText(readiness.fourPairAuthorityReady, "false"),

      BOUNDARY_FINGER_RAW: readiness.boundaryRaw,
      MASS_FINGER_RAW: readiness.massRaw,
      SURFACE_FINGER_RAW: readiness.surfaceRaw,
      LIGHT_FINGER_RAW: readiness.lightRaw,
      HEX_TRANSMISSION_RAW: readiness.hexTransmissionRaw,
      HEX_FOUR_PAIR_RAW: readiness.fourPairRaw,
      EXPRESSION_SAMPLE_COUNT: readiness.expressionSampleCount,

      DOWNSTREAM_EXPRESSION_SET_STATUS: readiness.status,
      DOWNSTREAM_EXPRESSION_SET_COMPLETE: boolText(
        readiness.status === "DOWNSTREAM_EXPRESSION_SET_OBSERVED_AND_COHERENT",
        "false"
      ),
      DOWNSTREAM_EXPRESSION_SET_PARTIAL: boolText(
        readiness.status === "DOWNSTREAM_EXPRESSION_SET_PARTIAL_OR_DEGRADED",
        "false"
      ),

      CANVAS_PIXEL_SAMPLE_STATUS_SEEN_BY_SIDECAR: canvasPixelStatus,
      CANVAS_PIXEL_VISIBLE_SEEN_BY_SIDECAR: canvasPixelVisible,
      CANVAS_PIXEL_BLANK_SEEN_BY_SIDECAR: boolText(canvasBlank, "UNKNOWN"),

      SURFACE_POINTER_INTERPRETATION: interpretation,
      SURFACE_POINTER_RECOMMENDED_OWNER: recommendedOwner,
      SURFACE_POINTER_RECOMMENDED_FILE: recommendedFile,
      SURFACE_POINTER_RECOMMENDED_ACTION: recommendedAction,

      KNOWN_PATH_GROUPS: clonePlain(groups),
      NAMESPACE_SURFACE_POINTER_CANDIDATE_COUNT: String(namespaceCandidates.length),
      NAMESPACE_SURFACE_POINTER_CANDIDATES: namespaceCandidates,

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      HEARTH_REPAIR_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      ROUTE_CONDUCTOR_MUTATION_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_REPAIR_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      SOUTH_SURFACE_POINTER_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    return report;
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",

      "CONTRACT",
      "RECEIPT",
      "VERSION",
      "FILE",

      "SOUTH_SURFACE_POINTER_STATUS",
      "SOUTH_SURFACE_POINTER_CONTRACT",
      "SOUTH_SURFACE_POINTER_RECEIPT",
      "SOUTH_SURFACE_POINTER_VERSION",
      "SOUTH_SURFACE_POINTER_FILE",
      "SOUTH_SURFACE_POINTER_ROLE",
      "SOUTH_SURFACE_POINTER_AUTHORITY",
      "SOUTH_SURFACE_POINTER_CHRONOLOGY_POSITION",
      "SOUTH_SURFACE_POINTER_IS_NINTH_CYCLE",
      "SOUTH_SURFACE_POINTER_REPLACES_PROBE_SOUTH",
      "SOUTH_SURFACE_POINTER_REPLACES_SOUTH_RAIL",
      "SOUTH_SURFACE_POINTER_OPERATIONAL_DEPENDENCY_FOR_NORTH",
      "SOUTH_SURFACE_POINTER_CONSUMER",

      "PRIMARY_ALIAS",
      "PRIMARY_CALLABLE",
      "ALIAS_CHRONOLOGY_STATUS",
      "ALIAS_CHRONOLOGY_TEXT",

      "BISHOP_QUEEN_FUNNEL_OBSERVED",
      "BISHOP_QUEEN_FUNNEL_SELECTED_PATH",
      "BISHOP_QUEEN_FUNNEL_CONTRACT",
      "BISHOP_QUEEN_FUNNEL_RECEIPT",

      "FINGER_INSPECT_OBSERVED",
      "FINGER_INSPECT_SELECTED_PATH",
      "FINGER_INSPECT_CONTRACT",
      "FINGER_INSPECT_RECEIPT",

      "SURFACE_PACKET_OBSERVED",
      "SURFACE_PACKET_SELECTED_PATH",
      "SURFACE_PACKET_CONTRACT",
      "SURFACE_PACKET_RECEIPT",

      "HEX_SURFACE_OBSERVED",
      "HEX_SURFACE_SELECTED_PATH",
      "HEX_SURFACE_CONTRACT",
      "HEX_SURFACE_RECEIPT",

      "HEX_FOUR_PAIR_AUTHORITY_OBSERVED",
      "HEX_FOUR_PAIR_AUTHORITY_SELECTED_PATH",
      "HEX_FOUR_PAIR_AUTHORITY_CONTRACT",
      "HEX_FOUR_PAIR_AUTHORITY_RECEIPT",

      "CANVAS_HUB_OBSERVED_BY_SIDECAR",
      "CANVAS_HUB_SELECTED_PATH_BY_SIDECAR",
      "CANVAS_HUB_CONTRACT_BY_SIDECAR",

      "BOUNDARY_FINGER_READY",
      "MASS_FINGER_READY",
      "SURFACE_FINGER_READY",
      "LIGHT_FINGER_READY",
      "HEX_SURFACE_BRIDGE_READY",
      "HEX_FOUR_PAIR_AUTHORITY_READY",

      "EXPRESSION_SAMPLE_COUNT",
      "DOWNSTREAM_EXPRESSION_SET_STATUS",
      "DOWNSTREAM_EXPRESSION_SET_COMPLETE",
      "DOWNSTREAM_EXPRESSION_SET_PARTIAL",

      "CANVAS_PIXEL_SAMPLE_STATUS_SEEN_BY_SIDECAR",
      "CANVAS_PIXEL_VISIBLE_SEEN_BY_SIDECAR",
      "CANVAS_PIXEL_BLANK_SEEN_BY_SIDECAR",

      "SURFACE_POINTER_INTERPRETATION",
      "SURFACE_POINTER_RECOMMENDED_OWNER",
      "SURFACE_POINTER_RECOMMENDED_FILE",
      "SURFACE_POINTER_RECOMMENDED_ACTION",

      "SOUTH_RAIL_FILE",
      "PROBE_SOUTH_FILE",
      "CANVAS_FILE",
      "FINGER_INSPECT_FILE",
      "HEX_SURFACE_FILE",
      "HEX_FOUR_PAIR_FILE",

      "CHRONOLOGY_SEQUENCE_TEXT",
      "NAMESPACE_SURFACE_POINTER_CANDIDATE_COUNT",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "HEARTH_REPAIR_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "ROUTE_CONDUCTOR_MUTATION_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "FINAL_VISUAL_PASS_AUTHORITY",

      "SECONDARY_EVIDENCE_NOTES",
      "SOUTH_SURFACE_POINTER_NOTES",

      ...Object.keys(NO_CLAIMS),
      ...Object.keys(UPPER_NO_CLAIMS)
    ];

    const seen = new Set();
    const out = [];

    for (const key of priority.concat(Object.keys(report || {}))) {
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(key);
    }

    return out;
  }

  function composePacketText(report) {
    return orderedFields(report)
      .map((key) => line(key, getRaw(report, key, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("SOUTH_SURFACE_POINTER_CONTRACT", getRaw(report, "SOUTH_SURFACE_POINTER_CONTRACT", CONTRACT)),
      line("SOUTH_SURFACE_POINTER_STATUS", getRaw(report, "SOUTH_SURFACE_POINTER_STATUS", "UNKNOWN")),
      line("BISHOP_QUEEN_FUNNEL_OBSERVED", getRaw(report, "BISHOP_QUEEN_FUNNEL_OBSERVED", "UNKNOWN")),
      line("FINGER_INSPECT_OBSERVED", getRaw(report, "FINGER_INSPECT_OBSERVED", "UNKNOWN")),
      line("SURFACE_PACKET_OBSERVED", getRaw(report, "SURFACE_PACKET_OBSERVED", "UNKNOWN")),
      line("HEX_SURFACE_OBSERVED", getRaw(report, "HEX_SURFACE_OBSERVED", "UNKNOWN")),
      line("DOWNSTREAM_EXPRESSION_SET_STATUS", getRaw(report, "DOWNSTREAM_EXPRESSION_SET_STATUS", "UNKNOWN")),
      line("SURFACE_POINTER_INTERPRETATION", getRaw(report, "SURFACE_POINTER_INTERPRETATION", "UNKNOWN")),
      line("SURFACE_POINTER_RECOMMENDED_FILE", getRaw(report, "SURFACE_POINTER_RECOMMENDED_FILE", "UNKNOWN"))
    ].join("\n");
  }

  function publishReport(report) {
    lastReport = clonePlain(report);
    lastPacketText = composePacketText(report);
    lastCompactSummary = composeCompactSummary(report);
    publishAliases();
  }

  function runSouthSurfacePointerRead(input = {}) {
    const report = buildReport(input);
    publishReport(report);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: CONTRACT,
      implementationReceipt: RECEIPT,

      SOUTH_SURFACE_POINTER_STATUS: "COMPLETE",
      SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
      SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
      SOUTH_SURFACE_POINTER_ROLE: "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR",
      SOUTH_SURFACE_POINTER_CHRONOLOGY_POSITION: "OUTSIDE_NINE_STEP_CHRONOLOGY",

      BISHOP_QUEEN_FUNNEL_OBSERVED: report.BISHOP_QUEEN_FUNNEL_OBSERVED,
      FINGER_INSPECT_OBSERVED: report.FINGER_INSPECT_OBSERVED,
      SURFACE_PACKET_OBSERVED: report.SURFACE_PACKET_OBSERVED,
      HEX_SURFACE_OBSERVED: report.HEX_SURFACE_OBSERVED,
      HEX_FOUR_PAIR_AUTHORITY_OBSERVED: report.HEX_FOUR_PAIR_AUTHORITY_OBSERVED,

      DOWNSTREAM_EXPRESSION_SET_STATUS: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
      SURFACE_POINTER_INTERPRETATION: report.SURFACE_POINTER_INTERPRETATION,
      SURFACE_POINTER_RECOMMENDED_OWNER: report.SURFACE_POINTER_RECOMMENDED_OWNER,
      SURFACE_POINTER_RECOMMENDED_FILE: report.SURFACE_POINTER_RECOMMENDED_FILE,
      SURFACE_POINTER_RECOMMENDED_ACTION: report.SURFACE_POINTER_RECOMMENDED_ACTION,

      evidence: report,
      REPORT_OBJECT: report,
      report,
      output: {
        SOUTH_SURFACE_POINTER_STATUS: "COMPLETE",
        SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
        SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
        DOWNSTREAM_EXPRESSION_SET_STATUS: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
        SURFACE_POINTER_INTERPRETATION: report.SURFACE_POINTER_INTERPRETATION,
        SURFACE_POINTER_RECOMMENDED_FILE: report.SURFACE_POINTER_RECOMMENDED_FILE,
        REPORT_OBJECT: report
      },
      packetText: lastPacketText,
      compactSummary: lastCompactSummary,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function inspectSouthSurfacePointer(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function inspectSurfacePointer(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function runProbeSidecar(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function inspect(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function runDiagnostic(input = {}) {
    return runSouthSurfacePointerRead(input);
  }

  function getReport() {
    if (!lastReport) {
      publishReport(buildReport({}));
    }
    return clonePlain(lastReport);
  }

  function getPacketText() {
    if (!lastPacketText) getReport();
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) getReport();
    return lastCompactSummary;
  }

  function getState() {
    const report = getReport();

    return {
      role: "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR",
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      status: getRaw(report, "SOUTH_SURFACE_POINTER_STATUS", "UNKNOWN"),
      chronologyPosition: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      consumer: PROBE_SOUTH_FILE,

      downstreamExpressionSetStatus: getRaw(report, "DOWNSTREAM_EXPRESSION_SET_STATUS", "UNKNOWN"),
      surfacePointerInterpretation: getRaw(report, "SURFACE_POINTER_INTERPRETATION", "UNKNOWN"),
      recommendedOwner: getRaw(report, "SURFACE_POINTER_RECOMMENDED_OWNER", "UNKNOWN"),
      recommendedFile: getRaw(report, "SURFACE_POINTER_RECOMMENDED_FILE", "UNKNOWN"),
      recommendedAction: getRaw(report, "SURFACE_POINTER_RECOMMENDED_ACTION", "UNKNOWN"),

      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return {
      role: "DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_SIDECAR_READ",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      chronologyPosition: "OUTSIDE_NINE_STEP_CHRONOLOGY",
      asymmetricTenthDiagnosticSidecar: true,
      replacesSouthRail: false,
      replacesProbeSouth: false,
      operationalDependencyForNorth: false,
      consumer: PROBE_SOUTH_FILE,

      primaryCallable: "runSouthSurfacePointerRead",
      runSouthSurfacePointerReadApiAvailable: true,
      inspectSouthSurfacePointerApiAvailable: true,
      inspectSurfacePointerApiAvailable: true,
      runProbeSidecarApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      aliasChronologyStatus: "COMPLETE",
      aliasChronology: clonePlain(ALIAS_CHRONOLOGY),
      aliasChronologyText: aliasChronologyText(ALIAS_CHRONOLOGY),

      productionMutationAuthorized: false,
      hearthRepairAuthorized: false,
      routeRepairAuthorized: false,
      routeConductorMutationAuthorized: false,
      controlMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      canvasReleaseAuthorized: false,
      runtimeRestartAuthorized: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),

      SOUTH_SURFACE_POINTER_CONTRACT: CONTRACT,
      SOUTH_SURFACE_POINTER_RECEIPT: RECEIPT,
      SOUTH_SURFACE_POINTER_VERSION: VERSION,
      SOUTH_SURFACE_POINTER_FILE: FILE,

      SOUTH_RAIL_FILE,
      PROBE_SOUTH_FILE,
      CANVAS_FILE,
      FINGER_INSPECT_FILE,
      HEX_SURFACE_FILE,
      HEX_FOUR_PAIR_FILE,
      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_PROBE_SOUTH_CONTRACT,

      reportObject: clonePlain(lastReport || {}),
      state: getState(),

      ...UPPER_NO_CLAIMS
    };
  }

  function publishAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticSouthSurfacePointer = api;
    root.HEARTH.diagnosticSurfacePointerSouth = api;
    root.HEARTH.diagnosticSouthBishopSurfacePointer = api;
    root.HEARTH.diagnosticBishopSurfacePointerSouth = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER = api;
    root.HEARTH_DIAGNOSTIC_SURFACE_POINTER_SOUTH = api;

    root.DEXTER_LAB.hearthDiagnosticSouthSurfacePointer = api;
    root.DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer = api;
    root.DEXTER_LAB.hearthDiagnosticSurfacePointerSouth = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_PACKET_TEXT = lastPacketText || "";
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
    packetName: PACKET_NAME,

    role: "ASYMMETRIC_TENTH_DIAGNOSTIC_SIDECAR",
    authority: "READ_ONLY_DOWNSTREAM_EXPRESSION_SET_INSPECTION",
    chronologyPosition: "OUTSIDE_NINE_STEP_CHRONOLOGY",
    replacesSouthRail: false,
    replacesProbeSouth: false,
    operationalDependencyForNorth: false,
    consumer: PROBE_SOUTH_FILE,

    southRailFile: SOUTH_RAIL_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,
    canvasFile: CANVAS_FILE,
    fingerInspectFile: FINGER_INSPECT_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexFourPairFile: HEX_FOUR_PAIR_FILE,

    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedProbeSouthContract: EXPECTED_PROBE_SOUTH_CONTRACT,

    aliasChronology: ALIAS_CHRONOLOGY,
    aliasChronologyText: aliasChronologyText(ALIAS_CHRONOLOGY),

    knownPaths: KNOWN_PATHS,

    runSouthSurfacePointerRead,
    inspectSouthSurfacePointer,
    inspectSurfacePointer,
    runProbeSidecar,
    inspect,
    runDiagnostic,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,

    runSouthSurfacePointerReadApiAvailable: true,
    inspectSouthSurfacePointerApiAvailable: true,
    inspectSurfacePointerApiAvailable: true,
    runProbeSidecarApiAvailable: true,
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
    routeRepairAuthorized: false,
    routeConductorMutationAuthorized: false,
    controlMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    runtimeRestartAuthorized: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS
  });

  publishReport(buildReport({}));
  publishAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
