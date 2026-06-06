// /assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1
// Internal renewal:
// HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_EXPANSION_TNT_v1_1
// Full-file replacement.
// Diagnostic-only Canvas surface truth / receipt hub probe.
// Purpose:
// - Preserve the existing NORTH-facing Canvas surface truth probe contract.
// - Keep NORTH wiring stable while expanding this probe into the downstream receipt hub.
// - Inspect rendered Hearth Canvas surface truth.
// - Receive/ingest Probe South packet meaning when Probe South sends it here.
// - Split returned evidence into four compact receipt lanes:
//   1. LAB_CARDINAL_RECEIPT_BUNDLE: North/East/South/West lab/runtime/engine receipts.
//   2. DIAGNOSTIC_TRACK_RECEIPT: diagnostic rail/probe chronology and alignment.
//   3. CANVAS_BISHOP_RECEIPT: canvas/bishop/route-conductor expression alignment.
//   4. FINGER_FILE_RECEIPT: surface pointer, finger inspect, hex surface, four-pair files.
// - Publish compact packet text so the diagnostic receipt button has a small readable return surface.
// - Preserve no production mutation, no drawing, no repair, no route mutation,
//   no control mutation, no runtime restart, no F13, no F21, no ready text,
//   no visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - Canvas drawing
// - Canvas creation
// - Canvas repair
// - route conductor implementation
// - controls implementation
// - terrain/material/hydrology/elevation truth
// - diagnostic UI shell
// - final readiness or visual pass

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_EXPANSION_TNT_v1_1";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_EXPANSION_RECEIPT_v1_1";

  const VERSION =
    "2026-06-06.hearth-diagnostic-probe-canvas-surface-truth-receipt-hub-v1-1";

  const FILE = "/assets/hearth/hearth.diagnostic.probe.canvas.surface.truth.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";
  const SOUTH_SURFACE_POINTER_FILE =
    "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_INTERNALIZED_EXPRESSION_SURFACE_PROOF_RECEIVER_TNT_v12_4",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6"
  ]);

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    f55ClaimedByTruthHub: false,
    readyTextAllowed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const UPPER_NO_CLAIMS = Object.freeze({
    F13_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F55_CLAIMED_BY_TRUTH_HUB: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']",
    "canvas"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "[data-hearth-full-planet-visibility-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "main",
    "body"
  ]);

  const PATHS = Object.freeze({
    labNorth: Object.freeze([
      "LAB_RUNTIME_TABLE_NORTH",
      "LAB_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND_RUNTIME_TABLE",
      "HEARTH_NORTH_COMMAND",
      "HEARTH.northCentralTrainStation",
      "HEARTH.northCommandRuntimeTable",
      "DEXTER_LAB.runtimeTable",
      "DEXTER_LAB.cardinalRuntimeTableNorth",
      "DEXTER_LAB.northCentralTrainStation"
    ]),
    labEast: Object.freeze([
      "LAB_RUNTIME_TABLE_EAST",
      "RUNTIME_TABLE_EAST",
      "HEARTH_EAST_IGNITION",
      "HEARTH.eastIgnition",
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "DEXTER_LAB.runtimeTableEast",
      "DEXTER_LAB.cardinalRuntimeTableEast",
      "DEXTER_LAB.hearthDiagnosticEast"
    ]),
    labSouth: Object.freeze([
      "LAB_RUNTIME_TABLE_SOUTH",
      "RUNTIME_TABLE_SOUTH",
      "HEARTH_SOUTH_OUTPUT",
      "HEARTH.southOutput",
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "DEXTER_LAB.runtimeTableSouth",
      "DEXTER_LAB.cardinalRuntimeTableSouth",
      "DEXTER_LAB.hearthDiagnosticSouth"
    ]),
    labWest: Object.freeze([
      "LAB_RUNTIME_TABLE_WEST",
      "RUNTIME_TABLE_WEST",
      "LAB_CYCLE_AWARE_ADMISSIBILITY_CLUTCH_WEST",
      "HEARTH_WEST_CYCLE_AWARE_ADMISSIBILITY_CLUTCH",
      "HEARTH.runtimeTableWest",
      "HEARTH.westAdmissibility",
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "DEXTER_LAB.runtimeTableWest",
      "DEXTER_LAB.cardinalRuntimeTableWest",
      "DEXTER_LAB.hearthDiagnosticWest"
    ]),
    diagnosticNorth: Object.freeze([
      "HEARTH.diagnosticRail",
      "HEARTH.parallelDiagnosticRail",
      "HEARTH.diagnosticNorth",
      "HEARTH.diagnosticRailNorth",
      "HEARTH.diagnosticNorthCanvasSurfaceTruthChronologyHub",
      "HEARTH_DIAGNOSTIC_RAIL",
      "HEARTH_DIAGNOSTIC_NORTH",
      "HEARTH_DIAGNOSTIC_RAIL_NORTH",
      "DEXTER_LAB.hearthDiagnosticRail",
      "DEXTER_LAB.hearthDiagnosticNorth"
    ]),
    diagnosticEast: Object.freeze([
      "HEARTH.diagnosticEast",
      "HEARTH.diagnosticRailEast",
      "HEARTH_DIAGNOSTIC_EAST",
      "HEARTH_DIAGNOSTIC_RAIL_EAST",
      "DEXTER_LAB.hearthDiagnosticEast",
      "DEXTER_LAB.hearthDiagnosticRailEast"
    ]),
    diagnosticWest: Object.freeze([
      "HEARTH.diagnosticWest",
      "HEARTH.diagnosticRailWest",
      "HEARTH_DIAGNOSTIC_WEST",
      "HEARTH_DIAGNOSTIC_RAIL_WEST",
      "DEXTER_LAB.hearthDiagnosticWest",
      "DEXTER_LAB.hearthDiagnosticRailWest"
    ]),
    diagnosticSouth: Object.freeze([
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH_DIAGNOSTIC_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "DEXTER_LAB.hearthDiagnosticSouth",
      "DEXTER_LAB.hearthDiagnosticRailSouth"
    ]),
    diagnosticProbeSouth: Object.freeze([
      "HEARTH.diagnosticProbeSouth",
      "HEARTH.diagnosticRailProbeSouth",
      "HEARTH.diagnosticSouthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      "DEXTER_LAB.hearthDiagnosticProbeSouth",
      "DEXTER_LAB.hearthDiagnosticRailProbeSouth"
    ]),
    canvasHub: Object.freeze([
      "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
      "HEARTH_CANVAS_HUB",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_EXPRESSION_HUB",
      "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
      "HEARTH.canvasHub",
      "HEARTH.canvas",
      "HEARTH.canvasExpressionHub",
      "DEXTER_LAB.hearthCanvasHub",
      "DEXTER_LAB.hearthCanvas",
      "DEXTER_LAB.hearthCanvasExpressionHub"
    ]),
    bishopQueen: Object.freeze([
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.hearthRouteConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.bishopQueenCanvasRecognitionFunnel",
      "HEARTH_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL"
    ]),
    routeConductor: Object.freeze([
      "HEARTH_ROUTE_CONDUCTOR",
      "HEARTH.routeConductor",
      "HEARTH.routeConductorShowtimeNewsFibonacciQueenCanvasSync",
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "DEXTER_LAB.hearthRouteConductor",
      "DEXTER_LAB.hearthRouteConductorShowtimeNewsFibonacciQueenCanvasSync",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
    ]),
    southSurfacePointer: Object.freeze([
      "HEARTH.diagnosticSouthSurfacePointer",
      "HEARTH.diagnosticSurfacePointerSouth",
      "HEARTH.diagnosticSouthBishopSurfacePointer",
      "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER",
      "HEARTH_DIAGNOSTIC_SOUTH_BISHOP_SURFACE_POINTER",
      "DEXTER_LAB.hearthDiagnosticSouthSurfacePointer",
      "DEXTER_LAB.hearthDiagnosticSouthBishopSurfacePointer"
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

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};
  let lastReport = null;
  let lastReceipt = null;
  let lastPacketText = "";
  let lastCompactSummary = "";
  let lastSouthProbeEnvelope = null;

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

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
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

    if (Array.isArray(value) || isObject(value)) {
      try {
        return bounded(JSON.stringify(value), 16000) || fallback;
      } catch (_error) {
        return bounded(value, 4000) || fallback;
      }
    }

    return bounded(value, 4000) || fallback;
  }

  function line(key, value) {
    return `${key}=${packetValue(value)}`;
  }

  function boolText(value, fallback = "UNKNOWN") {
    if (value === true || value === "true" || value === "TRUE" || value === 1 || value === "1") return "true";
    if (value === false || value === "false" || value === "FALSE" || value === 0 || value === "0") return "false";
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

  function readPath(base, path) {
    const parts = safeString(path).split(".");
    let cursor = base || root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function getReceiptFromAuthority(authority) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getReport",
      "getState",
      "getStatus",
      "getCompactSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getExpressionHubReceipt",
      "getVisiblePlanetReceipt",
      "getCarrierReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.report)) return authority.report;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function contractOf(value) {
    if (!isObject(value)) return "UNKNOWN";

    return firstKnown(
      value.CONTRACT,
      value.contract,
      value.IMPLEMENTATION_CONTRACT,
      value.implementationContract,
      value.currentCanvasParentContract,
      value.canvasContract,
      value.hearthCanvasContract,
      value.SOUTH_CONTRACT,
      value.SOUTH_SURFACE_POINTER_CONTRACT,
      value.PROBE_SOUTH_CONTRACT,
      value.EAST_CONTRACT,
      value.WEST_CONTRACT,
      value.NORTH_CONTRACT,
      value.HEX_CONTRACT,
      value.SURFACE_CONTRACT
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "UNKNOWN";

    return firstKnown(
      value.RECEIPT,
      value.receipt,
      value.IMPLEMENTATION_RECEIPT,
      value.implementationReceipt,
      value.currentCanvasParentReceipt,
      value.canvasReceipt,
      value.hearthCanvasReceipt,
      value.SOUTH_RECEIPT,
      value.SOUTH_SURFACE_POINTER_RECEIPT,
      value.PROBE_SOUTH_RECEIPT,
      value.EAST_RECEIPT,
      value.WEST_RECEIPT,
      value.NORTH_RECEIPT,
      value.HEX_RECEIPT,
      value.SURFACE_RECEIPT
    );
  }

  function primitiveSnapshot(value) {
    if (!isObject(value)) return {};

    const out = {};
    const keys = Object.keys(value).slice(0, 96);

    for (const key of keys) {
      let item;
      try {
        item = value[key];
      } catch (_error) {
        continue;
      }

      if (
        item === undefined ||
        item === null ||
        typeof item === "function" ||
        (typeof item === "object" && !Array.isArray(item))
      ) {
        continue;
      }

      if (Array.isArray(item)) {
        out[key] = item.length <= 16 ? clonePlain(item) : `ARRAY_LENGTH_${item.length}`;
        continue;
      }

      out[key] = item;
    }

    return out;
  }

  function selectAuthority(name, paths, targetWindow) {
    const scopes = [
      { name: "TARGET_WINDOW", base: targetWindow || null },
      { name: "DIAGNOSTIC_WINDOW", base: root }
    ];

    const candidates = [];

    for (const scope of scopes) {
      if (!scope.base) continue;

      for (const path of paths || []) {
        const authority = readPath(scope.base, path);
        if (!authority) continue;

        const receipt = getReceiptFromAuthority(authority) || {};
        const contract = firstKnown(contractOf(receipt), contractOf(authority));
        const receiptName = firstKnown(receiptOf(receipt), receiptOf(authority));
        const methods = isObject(authority)
          ? Object.keys(authority).filter((key) => isFunction(authority[key])).sort().slice(0, 24)
          : [];

        candidates.push({
          name,
          scope: scope.name,
          path,
          observed: true,
          contract,
          receipt: receiptName,
          methodCount: methods.length,
          methods,
          primitiveSnapshot: primitiveSnapshot(receipt),
          authority
        });
      }
    }

    const selected =
      candidates.find((candidate) => candidate.contract !== "UNKNOWN") ||
      candidates[0] ||
      null;

    return {
      name,
      observed: Boolean(selected),
      scope: selected ? selected.scope : "NONE",
      path: selected ? selected.path : "NONE",
      contract: selected ? selected.contract : "UNKNOWN",
      receipt: selected ? selected.receipt : "UNKNOWN",
      methodCount: selected ? selected.methodCount : 0,
      methods: selected ? selected.methods : [],
      primitiveSnapshot: selected ? selected.primitiveSnapshot : {},
      candidates: candidates.map((candidate) => ({
        scope: candidate.scope,
        path: candidate.path,
        contract: candidate.contract,
        receipt: candidate.receipt,
        methodCount: candidate.methodCount
      })),
      authority: selected ? selected.authority : null
    };
  }

  function extractCurrentReport(input) {
    if (isObject(input && input.currentReport)) return clonePlain(input.currentReport);
    if (isObject(input && input.report)) return clonePlain(input.report);
    if (isObject(input && input.REPORT_OBJECT)) return clonePlain(input.REPORT_OBJECT);
    if (isObject(input && input.output) && isObject(input.output.REPORT_OBJECT)) {
      return clonePlain(input.output.REPORT_OBJECT);
    }
    if (isObject(lastSouthProbeEnvelope && lastSouthProbeEnvelope.report)) {
      return clonePlain(lastSouthProbeEnvelope.report);
    }
    return {};
  }

  function extractChronology(input, currentReport) {
    if (Array.isArray(input && input.chronology)) return clonePlain(input.chronology);
    if (Array.isArray(input && input.CHRONOLOGY_SEQUENCE)) return clonePlain(input.CHRONOLOGY_SEQUENCE);
    if (Array.isArray(currentReport && currentReport.CHRONOLOGY_SEQUENCE)) {
      return clonePlain(currentReport.CHRONOLOGY_SEQUENCE);
    }
    if (Array.isArray(currentReport && currentReport.chronology)) return clonePlain(currentReport.chronology);
    return [];
  }

  function normalizeNotes(...sources) {
    const out = [];
    const seen = new Set();

    for (const source of sources) {
      if (source === undefined || source === null || source === "" || source === "none") continue;

      const values = Array.isArray(source) ? source : safeString(source).split("|");

      for (const raw of values) {
        const clean = bounded(raw, 1200);
        if (!clean || clean === "none") continue;
        if (seen.has(clean)) continue;
        seen.add(clean);
        out.push(clean);
      }
    }

    return out;
  }

  function getTargetContext(payload = {}) {
    const ownDocument = root.document || null;

    let targetWindow = null;
    let targetDocument = null;
    let targetSource = "UNKNOWN";

    if (payload.targetWindow && payload.targetDocument) {
      targetWindow = payload.targetWindow;
      targetDocument = payload.targetDocument;
      targetSource = "PAYLOAD_TARGET_WINDOW_DOCUMENT";
    } else if (payload.targetWindow && payload.targetWindow.document) {
      targetWindow = payload.targetWindow;
      targetDocument = payload.targetWindow.document;
      targetSource = "PAYLOAD_TARGET_WINDOW";
    } else if (payload.targetDocument) {
      targetWindow = payload.targetDocument.defaultView || root;
      targetDocument = payload.targetDocument;
      targetSource = "PAYLOAD_TARGET_DOCUMENT";
    }

    if (!targetDocument && payload.frameElement) {
      try {
        const frameWindow = payload.frameElement.contentWindow;
        const frameDocument = payload.frameElement.contentDocument || (frameWindow && frameWindow.document);
        if (frameWindow && frameDocument) {
          targetWindow = frameWindow;
          targetDocument = frameDocument;
          targetSource = "PAYLOAD_FRAME_ELEMENT";
        }
      } catch (_error) {}
    }

    if (!targetDocument && ownDocument) {
      try {
        const frame = Array.from(ownDocument.querySelectorAll("iframe")).find((candidate) => {
          const src = safeString(candidate.getAttribute("src"));
          return src.includes(TARGET_ROUTE) || src === TARGET_ROUTE;
        });

        if (frame) {
          const frameWindow = frame.contentWindow;
          const frameDocument = frame.contentDocument || (frameWindow && frameWindow.document);
          if (frameWindow && frameDocument) {
            targetWindow = frameWindow;
            targetDocument = frameDocument;
            targetSource = "DISCOVERED_TARGET_IFRAME";
          }
        }
      } catch (_error) {}
    }

    if (!targetDocument && ownDocument) {
      targetWindow = root;
      targetDocument = ownDocument;
      targetSource = "CURRENT_DOCUMENT_FALLBACK";
    }

    return {
      targetWindow,
      targetDocument,
      targetSource,
      targetAvailable: Boolean(targetWindow && targetDocument)
    };
  }

  function q(doc, selector) {
    if (!doc || !isFunction(doc.querySelector)) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function firstElement(doc, selectors) {
    for (const selector of selectors) {
      const element = q(doc, selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();
      return {
        left: safeNumber(rect.left),
        top: safeNumber(rect.top),
        right: safeNumber(rect.right),
        bottom: safeNumber(rect.bottom),
        width: safeNumber(rect.width),
        height: safeNumber(rect.height)
      };
    } catch (_error) {
      return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    }
  }

  function rectNonzero(rect) {
    return Boolean(rect && rect.width > 0 && rect.height > 0);
  }

  function viewportIntersecting(targetWindow, rect) {
    if (!targetWindow || !rectNonzero(rect)) return false;

    const viewportWidth = safeNumber(targetWindow.innerWidth, 0);
    const viewportHeight = safeNumber(targetWindow.innerHeight, 0);

    if (!viewportWidth || !viewportHeight) return false;

    return !(
      rect.right <= 0 ||
      rect.bottom <= 0 ||
      rect.left >= viewportWidth ||
      rect.top >= viewportHeight
    );
  }

  function cssSummary(targetWindow, element) {
    if (!targetWindow || !element || !isFunction(targetWindow.getComputedStyle)) {
      return {
        visible: false,
        display: "UNKNOWN",
        visibility: "UNKNOWN",
        opacity: "UNKNOWN",
        position: "UNKNOWN",
        zIndex: "UNKNOWN",
        pointerEvents: "UNKNOWN"
      };
    }

    try {
      const style = targetWindow.getComputedStyle(element);
      const display = safeString(style.display, "UNKNOWN");
      const visibility = safeString(style.visibility, "UNKNOWN");
      const opacity = safeString(style.opacity, "UNKNOWN");
      const pointerEvents = safeString(style.pointerEvents, "UNKNOWN");

      return {
        visible: Boolean(
          display !== "none" &&
          visibility !== "hidden" &&
          visibility !== "collapse" &&
          safeNumber(opacity, 1) > 0 &&
          pointerEvents !== "none"
        ),
        display,
        visibility,
        opacity,
        position: safeString(style.position, "UNKNOWN"),
        zIndex: safeString(style.zIndex, "UNKNOWN"),
        pointerEvents
      };
    } catch (_error) {
      return {
        visible: false,
        display: "UNREADABLE",
        visibility: "UNREADABLE",
        opacity: "UNREADABLE",
        position: "UNREADABLE",
        zIndex: "UNREADABLE",
        pointerEvents: "UNREADABLE"
      };
    }
  }

  function containsOrEquals(parent, child) {
    if (!parent || !child) return false;
    if (parent === child) return true;

    try {
      return Boolean(parent.contains(child));
    } catch (_error) {
      return false;
    }
  }

  function elementDescriptor(element) {
    if (!element) return "NONE";

    const tag = safeString(element.tagName, "UNKNOWN").toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    let classes = "";

    try {
      classes = element.classList && element.classList.length
        ? `.${Array.from(element.classList).slice(0, 4).join(".")}`
        : "";
    } catch (_error) {}

    return `${tag}${id}${classes}` || "UNKNOWN_ELEMENT";
  }

  function inspectLayerBlock(targetWindow, targetDocument, canvas, rect) {
    if (!targetDocument || !canvas || !rectNonzero(rect) || !isFunction(targetDocument.elementFromPoint)) {
      return {
        blocked: false,
        blocker: "UNREADABLE",
        hitTarget: "UNREADABLE",
        hitWithinCanvas: false
      };
    }

    const viewportWidth = safeNumber(targetWindow && targetWindow.innerWidth, 0);
    const viewportHeight = safeNumber(targetWindow && targetWindow.innerHeight, 0);

    if (viewportWidth <= 0 || viewportHeight <= 0) {
      return {
        blocked: false,
        blocker: "VIEWPORT_UNREADABLE",
        hitTarget: "VIEWPORT_UNREADABLE",
        hitWithinCanvas: false
      };
    }

    const points = [
      [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5],
      [rect.left + rect.width * 0.33, rect.top + rect.height * 0.33],
      [rect.left + rect.width * 0.67, rect.top + rect.height * 0.67]
    ];

    const hits = [];

    for (const [rawX, rawY] of points) {
      const x = Math.max(0, Math.min(viewportWidth - 1, rawX));
      const y = Math.max(0, Math.min(viewportHeight - 1, rawY));

      try {
        const hit = targetDocument.elementFromPoint(x, y);
        if (hit) hits.push(hit);
      } catch (_error) {}
    }

    if (!hits.length) {
      return {
        blocked: false,
        blocker: "NO_HIT_TARGET",
        hitTarget: "NO_HIT_TARGET",
        hitWithinCanvas: false
      };
    }

    const firstHit = hits[0];
    const canvasHit = hits.some((hit) => containsOrEquals(canvas, hit) || containsOrEquals(hit, canvas));
    const firstBlocker = hits.find((hit) => !containsOrEquals(canvas, hit) && !containsOrEquals(hit, canvas));

    return {
      blocked: Boolean(!canvasHit && firstBlocker),
      blocker: firstBlocker ? elementDescriptor(firstBlocker) : "NONE",
      hitTarget: elementDescriptor(firstHit),
      hitWithinCanvas: canvasHit
    };
  }

  function getCanvas2d(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) {
      return { ready: false, ctx: null, status: "CANVAS_GET_CONTEXT_UNAVAILABLE" };
    }

    try {
      const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      return {
        ready: Boolean(ctx),
        ctx,
        status: ctx ? "CONTEXT_2D_READY" : "CONTEXT_2D_NULL"
      };
    } catch (error) {
      return {
        ready: false,
        ctx: null,
        status: `CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 500)}`
      };
    }
  }

  function samplePixels(canvas, ctx) {
    if (!canvas || !ctx) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: "CANVAS_OR_CONTEXT_UNAVAILABLE"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0 || !isFunction(ctx.getImageData)) {
      return {
        status: "NO_PIXEL_SAMPLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: "CANVAS_INTERNAL_SIZE_OR_GET_IMAGE_DATA_UNAVAILABLE"
      };
    }

    try {
      const sampleSize = Math.max(4, Math.min(24, Math.floor(Math.min(width, height) / 28)));
      const points = [
        [0.5, 0.5],
        [0.35, 0.35],
        [0.65, 0.35],
        [0.35, 0.65],
        [0.65, 0.65]
      ];

      let sampleCount = 0;
      let alphaPixelCount = 0;
      let visiblePixelCount = 0;

      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(width - sampleSize, Math.floor(width * px - sampleSize / 2)));
        const y = Math.max(0, Math.min(height - sampleSize, Math.floor(height * py - sampleSize / 2)));
        const data = ctx.getImageData(x, y, sampleSize, sampleSize).data;

        sampleCount += data.length / 4;

        for (let index = 0; index < data.length; index += 4) {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const alpha = data[index + 3];

          if (alpha > 0) alphaPixelCount += 1;
          if (alpha > 0 && (red > 4 || green > 4 || blue > 4)) visiblePixelCount += 1;
        }
      }

      const visible = visiblePixelCount > 0;

      return {
        status: visible
          ? "PIXEL_SAMPLE_VISIBLE"
          : alphaPixelCount > 0
            ? "PIXEL_SAMPLE_ALPHA_ONLY"
            : "PIXEL_SAMPLE_BLANK",
        visible,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        reason: visible ? "VISIBLE_NON_BLANK_PIXELS_FOUND" : "NO_VISIBLE_NON_BLANK_PIXELS_FOUND"
      };
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        reason: bounded(error && error.message ? error.message : error, 900)
      };
    }
  }

  function namespaceMatchesDomSurface(namespaceInfo, canvas) {
    if (!namespaceInfo || !namespaceInfo.observed || !canvas) return false;

    const contractConsistent =
      ACCEPTED_CANVAS_CONTRACTS.includes(namespaceInfo.contract) ||
      (canvas.dataset &&
        ACCEPTED_CANVAS_CONTRACTS.includes(
          firstKnown(
            canvas.dataset.hearthCanvasContract,
            canvas.dataset.contract,
            canvas.dataset.hearthCanvasInternalRenewalContract
          )
        ));

    const sizeConsistent =
      safeNumber(canvas.width, 0) > 0 &&
      safeNumber(canvas.height, 0) > 0;

    return Boolean(contractConsistent && sizeConsistent);
  }

  function resolveFailure(report) {
    const checks = [
      ["CANVAS_ELEMENT_FOUND", report.CANVAS_ELEMENT_FOUND !== true, "CANVAS_ELEMENT_NOT_FOUND", "NO_CANVAS_ELEMENT_MATCHED_EXPECTED_SELECTORS", "CANVAS_EXPRESSION_SURFACE", CANVAS_FILE, "VERIFY_CANVAS_FILE_CREATES_OR_MOUNTS_A_REAL_CANVAS_SURFACE"],
      ["CANVAS_MOUNT_FOUND", report.CANVAS_MOUNT_FOUND !== true, "CANVAS_MOUNT_NOT_FOUND", "NO_EXPECTED_HEARTH_CANVAS_MOUNT_FOUND", "HTML_SHELL_OR_STAGE_MARKUP", "/showroom/globe/hearth/index.html", "RESTORE_EXPECTED_CANVAS_MOUNT_SELECTOR_OR_STAGE_MARKUP"],
      ["CANVAS_IN_MOUNT", report.CANVAS_IN_MOUNT !== true, "CANVAS_OUTSIDE_EXPECTED_MOUNT", "CANVAS_EXISTS_BUT_IS_NOT_CONTAINED_BY_EXPECTED_HEARTH_MOUNT", "CANVAS_PLACEMENT_OR_HTML_MOUNT_ALIGNMENT", CANVAS_FILE, "ALIGN_CANVAS_PLACEMENT_WITH_HEARTH_CANVAS_MOUNT"],
      ["CANVAS_RECT_NONZERO", report.CANVAS_RECT_NONZERO !== true, "CANVAS_ZERO_RECT", "CANVAS_ELEMENT_EXISTS_BUT_BOUNDING_RECT_IS_ZERO", "CSS_LAYOUT_OR_CANVAS_PLACEMENT", CANVAS_FILE, "VERIFY_CANVAS_STYLE_SIZE_AND_PARENT_LAYOUT"],
      ["CANVAS_COMPUTED_VISIBLE", report.CANVAS_COMPUTED_VISIBLE !== true, "CANVAS_COMPUTED_STYLE_HIDDEN", "CANVAS_COMPUTED_STYLE_IS_NOT_VISIBLE", "CSS_LAYOUT_OR_VISIBILITY_RULE", "/showroom/globe/hearth/index.html", "AUDIT_COMPUTED_STYLE_DISPLAY_VISIBILITY_OPACITY_POINTER_EVENTS"],
      ["CANVAS_VIEWPORT_INTERSECTING", report.CANVAS_VIEWPORT_INTERSECTING !== true, "CANVAS_OUTSIDE_VIEWPORT", "CANVAS_HAS_GEOMETRY_BUT_DOES_NOT_INTERSECT_VIEWPORT", "CSS_LAYOUT_OR_SCROLL_POSITION", "/showroom/globe/hearth/index.html", "AUDIT_STAGE_PLACEMENT_SCROLL_AND_VIEWPORT_INTERSECTION"],
      ["CANVAS_CONTEXT_2D_READY", report.CANVAS_CONTEXT_2D_READY !== true, "CANVAS_CONTEXT_2D_NOT_READY", "CANVAS_DOES_NOT_EXPOSE_A_2D_CONTEXT", "CANVAS_EXPRESSION_SURFACE", CANVAS_FILE, "VERIFY_CANVAS_ELEMENT_IS_A_STANDARD_2D_CANVAS"],
      ["CANVAS_PIXEL_VISIBLE", report.CANVAS_PIXEL_VISIBLE !== true, "CANVAS_PIXEL_SAMPLE_NOT_VISIBLE", report.CANVAS_PIXEL_SAMPLE_STATUS || "CANVAS_PIXEL_VISIBLE_FALSE", "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER", CANVAS_FILE, "AUDIT_CANVAS_DRAW_PATH_AND_DOWNSTREAM_EXPRESSION_ADAPTER"],
      ["CANVAS_LAYER_BLOCKED", report.CANVAS_LAYER_BLOCKED === true, "CANVAS_LAYER_OBSTRUCTED", "CANVAS_IS_PRESENT_BUT_ELEMENT_FROM_POINT_HIT_TEST_INDICATES_OVERLAY_BLOCKAGE", "CSS_LAYERING_OR_OVERLAY", "/showroom/globe/hearth/index.html", "AUDIT_Z_INDEX_POINTER_LAYER_AND_OVERLAY_ELEMENTS"],
      ["CANVAS_NAMESPACE_PRESENT", report.CANVAS_NAMESPACE_PRESENT !== true, "CANVAS_NAMESPACE_NOT_PRESENT", "DOM_CANVAS_EXISTS_BUT_CANVAS_AUTHORITY_NAMESPACE_NOT_FOUND", "CANVAS_ALIAS_PUBLICATION", CANVAS_FILE, "VERIFY_CANVAS_FILE_PUBLISHES_EXPECTED_GLOBAL_ALIASES"],
      ["CANVAS_PARENT_CONTRACT_RECOGNIZED", report.CANVAS_PARENT_CONTRACT_RECOGNIZED !== true, "CANVAS_PARENT_CONTRACT_UNRECOGNIZED", "CANVAS_NAMESPACE_EXISTS_BUT_CONTRACT_IS_NOT_IN_ACCEPTED_CANVAS_LINEAGE", "CANVAS_CONTRACT_PUBLICATION", CANVAS_FILE, "VERIFY_CANVAS_PARENT_CONTRACT_AND_ACCEPTED_LINEAGE"],
      ["CANVAS_NAMESPACE_MATCHES_DOM_SURFACE", report.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE !== true, "CANVAS_NAMESPACE_DOM_MISMATCH", "CANVAS_NAMESPACE_RECEIPT_DOES_NOT_MATCH_THE_DOM_CANVAS_SURFACE", "CANVAS_RECEIPT_PUBLICATION", CANVAS_FILE, "ALIGN_CANVAS_RECEIPT_WITH_DOM_SURFACE_PROOF"]
    ];

    const failed = checks.find((entry) => entry[1]);

    if (!failed) {
      return {
        coordinate: "NONE",
        failureClass: "CANVAS_SURFACE_TRUTH_PROVEN_NO_FINAL_CLAIM",
        reason: "DOM_CANVAS_NAMESPACE_PIXEL_AND_LAYER_PROOF_PASSED",
        owner: "NONE",
        file: "NONE",
        action: "RETURN_CANVAS_SURFACE_TRUTH_TO_NORTH_FOR_NEXT_STANDARD_CHECK"
      };
    }

    return {
      coordinate: failed[0],
      failureClass: failed[2],
      reason: failed[3],
      owner: failed[4],
      file: failed[5],
      action: failed[6]
    };
  }

  function inspectCanvas(targetWindow, targetDocument, contextSource) {
    const report = {
      TARGET_CONTEXT_STATUS: targetDocument && targetWindow
        ? "TARGET_CONTEXT_AVAILABLE"
        : "TARGET_CONTEXT_UNAVAILABLE",
      TARGET_CONTEXT_SOURCE: contextSource || "UNKNOWN",

      CANVAS_ELEMENT_FOUND: false,
      CANVAS_SELECTOR: "NONE",
      CANVAS_TAG: "NONE",
      CANVAS_ID: "NONE",
      CANVAS_CLASS: "NONE",
      CANVAS_DATASET_CONTRACT: "UNKNOWN",
      CANVAS_DATASET_RECEIPT: "UNKNOWN",

      CANVAS_MOUNT_FOUND: false,
      CANVAS_MOUNT_SELECTOR: "NONE",
      CANVAS_MOUNT_DESCRIPTOR: "NONE",
      CANVAS_IN_MOUNT: false,

      CANVAS_WIDTH_ATTRIBUTE: 0,
      CANVAS_HEIGHT_ATTRIBUTE: 0,
      CANVAS_RECT_LEFT: 0,
      CANVAS_RECT_TOP: 0,
      CANVAS_RECT_WIDTH: 0,
      CANVAS_RECT_HEIGHT: 0,
      CANVAS_RECT_NONZERO: false,

      CANVAS_COMPUTED_VISIBLE: false,
      CANVAS_COMPUTED_DISPLAY: "UNKNOWN",
      CANVAS_COMPUTED_VISIBILITY: "UNKNOWN",
      CANVAS_COMPUTED_OPACITY: "UNKNOWN",
      CANVAS_COMPUTED_POSITION: "UNKNOWN",
      CANVAS_COMPUTED_Z_INDEX: "UNKNOWN",
      CANVAS_COMPUTED_POINTER_EVENTS: "UNKNOWN",

      CANVAS_VIEWPORT_WIDTH: 0,
      CANVAS_VIEWPORT_HEIGHT: 0,
      CANVAS_VIEWPORT_INTERSECTING: false,

      CANVAS_CONTEXT_2D_READY: false,
      CANVAS_CONTEXT_2D_STATUS: "NOT_ATTEMPTED",

      CANVAS_PIXEL_SAMPLE_STATUS: "NO_PIXEL_SAMPLE",
      CANVAS_PIXEL_VISIBLE: false,
      CANVAS_PIXEL_SAMPLE_COUNT: 0,
      CANVAS_VISIBLE_PIXEL_COUNT: 0,
      CANVAS_ALPHA_PIXEL_COUNT: 0,
      CANVAS_PIXEL_SAMPLE_REASON: "NOT_RUN",

      CANVAS_LAYER_BLOCKED: false,
      CANVAS_LAYER_BLOCKER: "UNKNOWN",
      CANVAS_LAYER_HIT_TARGET: "UNKNOWN",
      CANVAS_LAYER_HIT_WITHIN_CANVAS: false,

      CANVAS_NAMESPACE_PRESENT: false,
      CANVAS_NAMESPACE_PATH: "NONE",
      CANVAS_NAMESPACE_CONTRACT: "UNKNOWN",
      CANVAS_NAMESPACE_RECEIPT: "UNKNOWN",
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: false,
      CANVAS_PARENT_CONTRACT_RECOGNIZED: false
    };

    if (!targetWindow || !targetDocument) {
      const failure = {
        coordinate: "TARGET_CONTEXT_STATUS",
        failureClass: "TARGET_CONTEXT_UNAVAILABLE",
        reason: "TARGET_DOCUMENT_OR_WINDOW_UNAVAILABLE",
        owner: "DIAGNOSTIC_TARGET_ACCESS",
        file: FILE,
        action: "PROVIDE_TARGET_DOCUMENT_OR_TARGET_WINDOW_TO_CANVAS_SURFACE_TRUTH_PROBE"
      };
      return { ...report, failure };
    }

    const canvasResult = firstElement(targetDocument, CANVAS_SELECTORS);
    const mountResult = firstElement(targetDocument, MOUNT_SELECTORS);
    const canvas = canvasResult.element;
    const mount = mountResult.element;
    const canvasNamespace = selectAuthority("canvasHub", PATHS.canvasHub, targetWindow);

    report.CANVAS_NAMESPACE_PRESENT = canvasNamespace.observed;
    report.CANVAS_NAMESPACE_PATH = canvasNamespace.path;
    report.CANVAS_NAMESPACE_CONTRACT = canvasNamespace.contract;
    report.CANVAS_NAMESPACE_RECEIPT = canvasNamespace.receipt;
    report.CANVAS_PARENT_CONTRACT_RECOGNIZED =
      ACCEPTED_CANVAS_CONTRACTS.includes(canvasNamespace.contract);

    report.CANVAS_ELEMENT_FOUND = Boolean(canvas);
    report.CANVAS_SELECTOR = canvasResult.selector;
    report.CANVAS_TAG = canvas ? safeString(canvas.tagName, "UNKNOWN").toLowerCase() : "NONE";
    report.CANVAS_ID = canvas && canvas.id ? canvas.id : "NONE";

    try {
      report.CANVAS_CLASS = canvas && canvas.className ? safeString(canvas.className) : "NONE";
    } catch (_error) {
      report.CANVAS_CLASS = "UNREADABLE";
    }

    if (canvas && canvas.dataset) {
      report.CANVAS_DATASET_CONTRACT = firstKnown(
        canvas.dataset.hearthCanvasContract,
        canvas.dataset.contract,
        canvas.dataset.hearthCanvasInternalRenewalContract
      );
      report.CANVAS_DATASET_RECEIPT = firstKnown(
        canvas.dataset.hearthCanvasReceipt,
        canvas.dataset.receipt,
        canvas.dataset.hearthCanvasExpressionBridgeReceipt
      );
    }

    report.CANVAS_MOUNT_FOUND = Boolean(mount);
    report.CANVAS_MOUNT_SELECTOR = mountResult.selector;
    report.CANVAS_MOUNT_DESCRIPTOR = elementDescriptor(mount);
    report.CANVAS_IN_MOUNT = Boolean(canvas && mount && containsOrEquals(mount, canvas));

    if (canvas) {
      const rect = getRect(canvas);
      const css = cssSummary(targetWindow, canvas);
      const ctx = getCanvas2d(canvas);
      const pixels = samplePixels(canvas, ctx.ctx);
      const layer = inspectLayerBlock(targetWindow, targetDocument, canvas, rect);

      report.CANVAS_WIDTH_ATTRIBUTE = safeNumber(canvas.width, 0);
      report.CANVAS_HEIGHT_ATTRIBUTE = safeNumber(canvas.height, 0);
      report.CANVAS_RECT_LEFT = rect.left;
      report.CANVAS_RECT_TOP = rect.top;
      report.CANVAS_RECT_WIDTH = rect.width;
      report.CANVAS_RECT_HEIGHT = rect.height;
      report.CANVAS_RECT_NONZERO = rectNonzero(rect);

      report.CANVAS_COMPUTED_VISIBLE = css.visible;
      report.CANVAS_COMPUTED_DISPLAY = css.display;
      report.CANVAS_COMPUTED_VISIBILITY = css.visibility;
      report.CANVAS_COMPUTED_OPACITY = css.opacity;
      report.CANVAS_COMPUTED_POSITION = css.position;
      report.CANVAS_COMPUTED_Z_INDEX = css.zIndex;
      report.CANVAS_COMPUTED_POINTER_EVENTS = css.pointerEvents;

      report.CANVAS_VIEWPORT_WIDTH = safeNumber(targetWindow.innerWidth, 0);
      report.CANVAS_VIEWPORT_HEIGHT = safeNumber(targetWindow.innerHeight, 0);
      report.CANVAS_VIEWPORT_INTERSECTING = viewportIntersecting(targetWindow, rect);

      report.CANVAS_CONTEXT_2D_READY = ctx.ready;
      report.CANVAS_CONTEXT_2D_STATUS = ctx.status;

      report.CANVAS_PIXEL_SAMPLE_STATUS = pixels.status;
      report.CANVAS_PIXEL_VISIBLE = pixels.visible;
      report.CANVAS_PIXEL_SAMPLE_COUNT = pixels.sampleCount;
      report.CANVAS_VISIBLE_PIXEL_COUNT = pixels.visiblePixelCount;
      report.CANVAS_ALPHA_PIXEL_COUNT = pixels.alphaPixelCount;
      report.CANVAS_PIXEL_SAMPLE_REASON = pixels.reason;

      report.CANVAS_LAYER_BLOCKED = layer.blocked;
      report.CANVAS_LAYER_BLOCKER = layer.blocker;
      report.CANVAS_LAYER_HIT_TARGET = layer.hitTarget;
      report.CANVAS_LAYER_HIT_WITHIN_CANVAS = layer.hitWithinCanvas;

      report.CANVAS_NAMESPACE_MATCHES_DOM_SURFACE = namespaceMatchesDomSurface(canvasNamespace, canvas);
    }

    return { ...report, failure: resolveFailure(report) };
  }

  function collectLabCardinalReceiptBundle(targetWindow, currentReport) {
    const north = selectAuthority("north", PATHS.labNorth, targetWindow);
    const east = selectAuthority("east", PATHS.labEast, targetWindow);
    const south = selectAuthority("south", PATHS.labSouth, targetWindow);
    const west = selectAuthority("west", PATHS.labWest, targetWindow);

    if (currentReport.NORTH_CONTRACT && north.contract === "UNKNOWN") north.contract = currentReport.NORTH_CONTRACT;
    if (currentReport.EAST_CONTRACT && east.contract === "UNKNOWN") east.contract = currentReport.EAST_CONTRACT;
    if (currentReport.SOUTH_CONTRACT && south.contract === "UNKNOWN") south.contract = currentReport.SOUTH_CONTRACT;
    if (currentReport.WEST_CONTRACT && west.contract === "UNKNOWN") west.contract = currentReport.WEST_CONTRACT;

    const observedCount = [north, east, south, west].filter((item) => item.observed || item.contract !== "UNKNOWN").length;

    return {
      receiptName: "LAB_CARDINAL_RECEIPT_BUNDLE",
      status: observedCount === 4
        ? "LAB_CARDINAL_RECEIPT_BUNDLE_COMPLETE"
        : observedCount > 0
          ? "LAB_CARDINAL_RECEIPT_BUNDLE_PARTIAL"
          : "LAB_CARDINAL_RECEIPT_BUNDLE_NOT_OBSERVED",
      observedCount,
      expectedCount: 4,
      north: compactAuthority(north),
      east: compactAuthority(east),
      south: compactAuthority(south),
      west: compactAuthority(west)
    };
  }

  function compactAuthority(item) {
    return {
      observed: Boolean(item && item.observed),
      scope: item ? item.scope : "NONE",
      path: item ? item.path : "NONE",
      contract: item ? item.contract : "UNKNOWN",
      receipt: item ? item.receipt : "UNKNOWN",
      methodCount: item ? item.methodCount : 0
    };
  }

  function collectDiagnosticTrackReceipt(targetWindow, currentReport, chronology) {
    const north = selectAuthority("diagnosticNorth", PATHS.diagnosticNorth, targetWindow);
    const east = selectAuthority("diagnosticEast", PATHS.diagnosticEast, targetWindow);
    const west = selectAuthority("diagnosticWest", PATHS.diagnosticWest, targetWindow);
    const south = selectAuthority("diagnosticSouth", PATHS.diagnosticSouth, targetWindow);
    const probeSouth = selectAuthority("diagnosticProbeSouth", PATHS.diagnosticProbeSouth, targetWindow);

    const entries = Array.isArray(chronology) ? chronology : [];
    const completeCount = entries.filter((entry) => entry && entry.status === "COMPLETE").length;
    const firstFailure =
      entries.find((entry) => entry && entry.status && entry.status !== "COMPLETE") || null;

    return {
      receiptName: "DIAGNOSTIC_TRACK_RECEIPT",
      status: entries.length && completeCount === entries.length
        ? "DIAGNOSTIC_TRACK_RECEIPT_COMPLETE"
        : entries.length
          ? "DIAGNOSTIC_TRACK_RECEIPT_PARTIAL"
          : "DIAGNOSTIC_TRACK_RECEIPT_FROM_ALIASES_ONLY",
      chronologyObserved: entries.length > 0,
      chronologyStepCount: entries.length,
      chronologyCompleteCount: completeCount,
      firstFailedStage: firstFailure
        ? `${firstFailure.fibonacciStage || "UNKNOWN"}:${firstFailure.id || "UNKNOWN"}`
        : "NONE",
      north: compactAuthority(north),
      east: compactAuthority(east),
      west: compactAuthority(west),
      south: compactAuthority(south),
      probeSouth: compactAuthority(probeSouth),
      diagnosticTrackNewsAlignmentStatus: firstKnown(
        currentReport.DIAGNOSTIC_TRACK_NEWS_ALIGNMENT_STATUS,
        currentReport.NEWS_ALIGNMENT_STATUS
      ),
      diagnosticTrackFibonacciSynchronizationStatus: firstKnown(
        currentReport.DIAGNOSTIC_TRACK_FIBONACCI_SYNCHRONIZATION_STATUS,
        currentReport.FIBONACCI_SYNCHRONIZATION_STATUS
      )
    };
  }

  function collectCanvasBishopReceipt(targetWindow, canvasReport, currentReport) {
    const canvasHub = selectAuthority("canvasHub", PATHS.canvasHub, targetWindow);
    const bishopQueen = selectAuthority("bishopQueen", PATHS.bishopQueen, targetWindow);
    const routeConductor = selectAuthority("routeConductor", PATHS.routeConductor, targetWindow);

    const bishopReady =
      bishopQueen.observed ||
      /BISHOP_QUEEN/i.test(packetValue(currentReport.SECONDARY_EVIDENCE_NOTES, ""));

    const canvasReady =
      canvasReport.CANVAS_ELEMENT_FOUND === true &&
      canvasReport.CANVAS_RECT_NONZERO === true &&
      canvasReport.CANVAS_CONTEXT_2D_READY === true &&
      canvasReport.CANVAS_NAMESPACE_PRESENT === true;

    return {
      receiptName: "CANVAS_BISHOP_RECEIPT",
      status: canvasReady && bishopReady
        ? "CANVAS_BISHOP_RECEIPT_COMPLETE"
        : canvasReady || bishopReady
          ? "CANVAS_BISHOP_RECEIPT_PARTIAL"
          : "CANVAS_BISHOP_RECEIPT_NOT_OBSERVED",
      canvasReady,
      bishopReady,
      pixelVisible: canvasReport.CANVAS_PIXEL_VISIBLE === true,
      canvasPixelSampleStatus: canvasReport.CANVAS_PIXEL_SAMPLE_STATUS,
      canvasTruthFailureClass: canvasReport.CANVAS_TRUTH_FAILURE_CLASS || "UNKNOWN",
      canvasHub: compactAuthority(canvasHub),
      bishopQueen: compactAuthority(bishopQueen),
      routeConductor: compactAuthority(routeConductor),
      currentCanvasParentContract: firstKnown(
        currentReport.CURRENT_CANVAS_PARENT_CONTRACT,
        canvasReport.CANVAS_NAMESPACE_CONTRACT,
        canvasHub.contract
      ),
      currentCanvasParentRecognized: boolText(
        canvasReport.CANVAS_PARENT_CONTRACT_RECOGNIZED === true ||
          currentReport.CURRENT_CANVAS_PARENT_RECOGNIZED === true ||
          currentReport.CURRENT_CANVAS_PARENT_RECOGNIZED === "true",
        "false"
      )
    };
  }

  function callSidecarIfAvailable(authority, payload) {
    if (!authority || !isObject(authority)) return null;

    const methods = [
      "runSouthSurfacePointerRead",
      "inspectSouthSurfacePointer",
      "inspectSurfacePointer",
      "runProbeSidecar",
      "inspect",
      "runDiagnostic",
      "getReport"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output =
          method === "getReport"
            ? authority[method]()
            : authority[method](payload);
        if (isObject(output)) {
          if (isObject(output.evidence)) return output.evidence;
          if (isObject(output.REPORT_OBJECT)) return output.REPORT_OBJECT;
          if (isObject(output.report)) return output.report;
          return output;
        }
      } catch (_error) {}
    }

    return null;
  }

  function collectFingerFileReceipt(targetWindow, currentReport, chronology, payload) {
    const surfacePointer = selectAuthority("southSurfacePointer", PATHS.southSurfacePointer, targetWindow);
    const fingerInspect = selectAuthority("fingerInspect", PATHS.fingerInspect, targetWindow);
    const hexSurface = selectAuthority("hexSurface", PATHS.hexSurface, targetWindow);
    const fourPairAuthority = selectAuthority("fourPairAuthority", PATHS.fourPairAuthority, targetWindow);
    const surfacePacket = selectAuthority("surfacePacket", PATHS.surfacePacket, targetWindow);

    const sidecarReport = callSidecarIfAvailable(surfacePointer.authority, {
      currentReport,
      chronology,
      fromCanvasTruthHub: true,
      southProbeEnvelope: clonePlain(lastSouthProbeEnvelope || payload.southProbeReceipt || {})
    }) || {};

    const southEnvelopePresent =
      Boolean(lastSouthProbeEnvelope) ||
      Boolean(payload.southProbeReceipt) ||
      Boolean(payload.probeSouthReceipt) ||
      Boolean(getRaw(currentReport, "PROBE_SOUTH_RETURN_PACKET_READY", false)) ||
      Boolean(getRaw(currentReport, "RECEIPT_RETURN_MECHANISM_STATUS", ""));

    const boundaryReady = truthyAny(
      sidecarReport.BOUNDARY_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "BOUNDARY_READY", undefined),
      fingerInspect.observed
    );
    const massReady = truthyAny(
      sidecarReport.MASS_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "MASS_READY", undefined),
      fingerInspect.observed
    );
    const surfaceReady = truthyAny(
      sidecarReport.SURFACE_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "SURFACE_READY", undefined),
      surfacePacket.observed
    );
    const lightReady = truthyAny(
      sidecarReport.LIGHT_FINGER_READY,
      getRaw(fingerInspect.primitiveSnapshot, "LIGHT_READY", undefined),
      fingerInspect.observed
    );
    const hexReady = truthyAny(
      sidecarReport.HEX_SURFACE_BRIDGE_READY,
      hexSurface.observed
    );
    const fourPairReady = truthyAny(
      sidecarReport.HEX_FOUR_PAIR_AUTHORITY_READY,
      fourPairAuthority.observed
    );

    const readyCount = [
      boundaryReady,
      massReady,
      surfaceReady,
      lightReady,
      hexReady,
      fourPairReady
    ].filter(Boolean).length;

    return {
      receiptName: "FINGER_FILE_RECEIPT",
      status: readyCount >= 6
        ? "FINGER_FILE_RECEIPT_COMPLETE"
        : readyCount > 0 || surfacePointer.observed || southEnvelopePresent
          ? "FINGER_FILE_RECEIPT_PARTIAL"
          : "FINGER_FILE_RECEIPT_NOT_OBSERVED",
      southProbeToTruthHubTransferStatus: southEnvelopePresent
        ? "PROBE_SOUTH_DATA_RECEIVED_OR_AVAILABLE"
        : "PROBE_SOUTH_DIRECT_DATA_NOT_PRESENT_ALIAS_READ_ATTEMPTED",
      surfacePointer: compactAuthority(surfacePointer),
      fingerInspect: compactAuthority(fingerInspect),
      hexSurface: compactAuthority(hexSurface),
      fourPairAuthority: compactAuthority(fourPairAuthority),
      surfacePacket: compactAuthority(surfacePacket),
      boundaryFingerReady: boolText(boundaryReady, "false"),
      massFingerReady: boolText(massReady, "false"),
      surfaceFingerReady: boolText(surfaceReady, "false"),
      lightFingerReady: boolText(lightReady, "false"),
      hexSurfaceBridgeReady: boolText(hexReady, "false"),
      hexFourPairAuthorityReady: boolText(fourPairReady, "false"),
      readyCount,
      expectedReadyCount: 6,
      sidecarInterpretation: firstKnown(
        sidecarReport.SURFACE_POINTER_INTERPRETATION,
        sidecarReport.DOWNSTREAM_EXPRESSION_SET_STATUS
      ),
      sidecarRecommendedFile: firstKnown(
        sidecarReport.SURFACE_POINTER_RECOMMENDED_FILE,
        "UNKNOWN"
      )
    };
  }

  function truthyAny(...values) {
    return values.some((value) => {
      if (value === true || value === 1 || value === "1") return true;
      if (typeof value === "string" && /true|ready|active|complete|observed|present|valid/i.test(value)) return true;
      return false;
    });
  }

  function buildHubStatus(lab, diagnostic, canvasBishop, finger) {
    const lanes = [lab, diagnostic, canvasBishop, finger];
    const complete = lanes.filter((lane) => /COMPLETE$/.test(lane.status)).length;
    const partial = lanes.filter((lane) => /PARTIAL$/.test(lane.status)).length;

    if (complete === lanes.length) return "TRUTH_HUB_RECEIPT_BUNDLE_COMPLETE";
    if (complete || partial) return "TRUTH_HUB_RECEIPT_BUNDLE_PARTIAL";
    return "TRUTH_HUB_RECEIPT_BUNDLE_NOT_OBSERVED";
  }

  function inspectCanvasSurfaceTruth(payload = {}) {
    const startedAt = nowIso();
    const currentReport = extractCurrentReport(payload);
    const chronology = extractChronology(payload, currentReport);
    const context = getTargetContext(payload);

    const canvasProbe = inspectCanvas(
      context.targetWindow,
      context.targetDocument,
      context.targetSource
    );

    const failure = canvasProbe.failure || resolveFailure(canvasProbe);

    const canvasReport = {
      ...canvasProbe,
      CANVAS_TRUTH_STATUS:
        failure.coordinate === "NONE"
          ? "CANVAS_SURFACE_TRUTH_PROVEN_NO_FINAL_CLAIM"
          : "CANVAS_SURFACE_TRUTH_FAILED_AT_COORDINATE",
      CANVAS_TRUTH_FIRST_FAILED_COORDINATE: failure.coordinate,
      CANVAS_TRUTH_FAILURE_CLASS: failure.failureClass,
      CANVAS_TRUTH_FAILURE_REASON: failure.reason,
      CANVAS_TRUTH_RECOMMENDED_OWNER: failure.owner,
      CANVAS_TRUTH_RECOMMENDED_FILE: failure.file,
      CANVAS_TRUTH_RECOMMENDED_ACTION: failure.action
    };

    delete canvasReport.failure;

    const labBundle = collectLabCardinalReceiptBundle(context.targetWindow, currentReport);
    const diagnosticTrackReceipt = collectDiagnosticTrackReceipt(context.targetWindow, currentReport, chronology);
    const canvasBishopReceipt = collectCanvasBishopReceipt(context.targetWindow, canvasReport, currentReport);
    const fingerFileReceipt = collectFingerFileReceipt(
      context.targetWindow,
      currentReport,
      chronology,
      payload
    );

    const truthHubStatus = buildHubStatus(
      labBundle,
      diagnosticTrackReceipt,
      canvasBishopReceipt,
      fingerFileReceipt
    );

    const notes = normalizeNotes(
      currentReport.SECONDARY_EVIDENCE_NOTES,
      currentReport.NORTH_SECONDARY_EVIDENCE_NOTES,
      "CANVAS_SURFACE_TRUTH_RECEIPT_HUB_ACTIVE",
      "TRUTH_HUB_RETURNS_FOUR_COMPACT_RECEIPT_LANES",
      "LAB_CARDINAL_RECEIPT_BUNDLE_INCLUDED",
      "DIAGNOSTIC_TRACK_RECEIPT_INCLUDED",
      "CANVAS_BISHOP_RECEIPT_INCLUDED",
      "FINGER_FILE_RECEIPT_INCLUDED",
      "TRUTH_HUB_DOES_NOT_DRAW_CANVAS",
      "TRUTH_HUB_DOES_NOT_MUTATE_PRODUCTION",
      `CANVAS_TRUTH_FAILURE_CLASS:${canvasReport.CANVAS_TRUTH_FAILURE_CLASS}`,
      `TRUTH_HUB_STATUS:${truthHubStatus}`
    );

    const report = {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_PACKET_v1",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      CANVAS_FILE,
      EXPECTED_CANVAS_CONTRACT,
      DIAGNOSTIC_TIMESTAMP: startedAt,

      CANVAS_SURFACE_TRUTH_PROBE_STATUS: "CALL_RETURNED",
      CANVAS_SURFACE_TRUTH_AVAILABLE: boolText(context.targetAvailable, "false"),
      TRUTH_HUB_ACTIVE: "true",
      TRUTH_HUB_STATUS: truthHubStatus,
      TRUTH_HUB_RECEIPT_LANE_COUNT: "4",
      TRUTH_HUB_RECEIPT_ROUTES:
        "LAB_CARDINAL_RECEIPT_BUNDLE | DIAGNOSTIC_TRACK_RECEIPT | CANVAS_BISHOP_RECEIPT | FINGER_FILE_RECEIPT",
      TRUTH_HUB_PACKET_TEXT_SAFE: "true",
      RECEIPT_RETURN_MECHANISM_STATUS: "TRUTH_HUB_COMPACT_RECEIPT_RETURN_READY",
      DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY: "true",
      NORTH_READABLE_RECEIPT_SURFACE_READY: "true",

      PRODUCTION_MUTATION_AUTHORIZED: false,
      CANVAS_DRAWING_AUTHORIZED: false,
      CANVAS_CREATION_AUTHORIZED: false,
      CANVAS_REPAIR_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,

      ...canvasReport,

      LAB_CARDINAL_RECEIPT_BUNDLE_STATUS: labBundle.status,
      LAB_CARDINAL_RECEIPT_BUNDLE: labBundle,

      DIAGNOSTIC_TRACK_RECEIPT_STATUS: diagnosticTrackReceipt.status,
      DIAGNOSTIC_TRACK_RECEIPT: diagnosticTrackReceipt,

      CANVAS_BISHOP_RECEIPT_STATUS: canvasBishopReceipt.status,
      CANVAS_BISHOP_RECEIPT: canvasBishopReceipt,

      FINGER_FILE_RECEIPT_STATUS: fingerFileReceipt.status,
      FINGER_FILE_RECEIPT: fingerFileReceipt,

      PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS:
        fingerFileReceipt.southProbeToTruthHubTransferStatus,

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),
      CANVAS_SURFACE_TRUTH_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    lastReport = clonePlain(report);
    lastReceipt = buildReceipt(report);
    lastPacketText = composePacketText(report);
    lastCompactSummary = composeCompactSummary(report);

    publish();

    return clonePlain(report);
  }

  function buildReceipt(report = lastReport || {}) {
    const r = report || {};

    return {
      packetType: "HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_PACKET_v1",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      canvasFile: CANVAS_FILE,
      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

      diagnosticOnly: true,
      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,

      truthHubActive: true,
      truthHubStatus: getRaw(r, "TRUTH_HUB_STATUS", "UNKNOWN"),
      receiptLaneCount: 4,
      receiptRoutes: [
        "LAB_CARDINAL_RECEIPT_BUNDLE",
        "DIAGNOSTIC_TRACK_RECEIPT",
        "CANVAS_BISHOP_RECEIPT",
        "FINGER_FILE_RECEIPT"
      ],

      canvasElementFound: getRaw(r, "CANVAS_ELEMENT_FOUND", false),
      canvasRectNonzero: getRaw(r, "CANVAS_RECT_NONZERO", false),
      canvasComputedVisible: getRaw(r, "CANVAS_COMPUTED_VISIBLE", false),
      canvasViewportIntersecting: getRaw(r, "CANVAS_VIEWPORT_INTERSECTING", false),
      canvasContext2dReady: getRaw(r, "CANVAS_CONTEXT_2D_READY", false),
      canvasPixelSampleStatus: getRaw(r, "CANVAS_PIXEL_SAMPLE_STATUS", "NO_PIXEL_SAMPLE"),
      canvasPixelVisible: getRaw(r, "CANVAS_PIXEL_VISIBLE", false),
      canvasLayerBlocked: getRaw(r, "CANVAS_LAYER_BLOCKED", false),
      canvasNamespacePresent: getRaw(r, "CANVAS_NAMESPACE_PRESENT", false),
      canvasParentContractRecognized: getRaw(r, "CANVAS_PARENT_CONTRACT_RECOGNIZED", false),

      canvasTruthStatus: getRaw(r, "CANVAS_TRUTH_STATUS", "CANVAS_TRUTH_NOT_RUN"),
      canvasTruthFirstFailedCoordinate: getRaw(r, "CANVAS_TRUTH_FIRST_FAILED_COORDINATE", "UNKNOWN"),
      canvasTruthFailureClass: getRaw(r, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN"),
      canvasTruthFailureReason: getRaw(r, "CANVAS_TRUTH_FAILURE_REASON", "UNKNOWN"),
      canvasTruthRecommendedOwner: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_OWNER", "UNKNOWN"),
      canvasTruthRecommendedFile: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN"),
      canvasTruthRecommendedAction: getRaw(r, "CANVAS_TRUTH_RECOMMENDED_ACTION", "UNKNOWN"),

      labCardinalReceiptBundleStatus: getRaw(r, "LAB_CARDINAL_RECEIPT_BUNDLE_STATUS", "UNKNOWN"),
      diagnosticTrackReceiptStatus: getRaw(r, "DIAGNOSTIC_TRACK_RECEIPT_STATUS", "UNKNOWN"),
      canvasBishopReceiptStatus: getRaw(r, "CANVAS_BISHOP_RECEIPT_STATUS", "UNKNOWN"),
      fingerFileReceiptStatus: getRaw(r, "FINGER_FILE_RECEIPT_STATUS", "UNKNOWN"),
      probeSouthToTruthHubTransferStatus: getRaw(r, "PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS", "UNKNOWN"),

      receiptReturnMechanismStatus: getRaw(r, "RECEIPT_RETURN_MECHANISM_STATUS", "UNKNOWN"),
      diagnosticUiReadableReceiptSurfaceReady: getRaw(r, "DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY", "UNKNOWN"),
      northReadableReceiptSurfaceReady: getRaw(r, "NORTH_READABLE_RECEIPT_SURFACE_READY", "UNKNOWN"),

      runProbeCanvasSurfaceTruthApiAvailable: true,
      runCanvasSurfaceTruthApiAvailable: true,
      receiveSouthProbeReceiptApiAvailable: true,
      receiveProbeSouthReceiptApiAvailable: true,
      runProbeApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      getReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,

      ...NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_RENEWAL_CONTRACT",
      "INTERNAL_RENEWAL_RECEIPT",
      "VERSION",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "CANVAS_FILE",
      "EXPECTED_CANVAS_CONTRACT",
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_SURFACE_TRUTH_PROBE_STATUS",
      "CANVAS_SURFACE_TRUTH_AVAILABLE",
      "TRUTH_HUB_ACTIVE",
      "TRUTH_HUB_STATUS",
      "TRUTH_HUB_RECEIPT_LANE_COUNT",
      "TRUTH_HUB_RECEIPT_ROUTES",
      "TRUTH_HUB_PACKET_TEXT_SAFE",
      "RECEIPT_RETURN_MECHANISM_STATUS",
      "DIAGNOSTIC_UI_READABLE_RECEIPT_SURFACE_READY",
      "NORTH_READABLE_RECEIPT_SURFACE_READY",

      "TARGET_CONTEXT_STATUS",
      "TARGET_CONTEXT_SOURCE",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_MOUNT_FOUND",
      "CANVAS_MOUNT_SELECTOR",
      "CANVAS_IN_MOUNT",
      "CANVAS_RECT_NONZERO",
      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_LAYER_BLOCKED",
      "CANVAS_LAYER_BLOCKER",
      "CANVAS_NAMESPACE_PRESENT",
      "CANVAS_NAMESPACE_PATH",
      "CANVAS_NAMESPACE_CONTRACT",
      "CANVAS_NAMESPACE_RECEIPT",
      "CANVAS_NAMESPACE_MATCHES_DOM_SURFACE",
      "CANVAS_PARENT_CONTRACT_RECOGNIZED",

      "CANVAS_TRUTH_STATUS",
      "CANVAS_TRUTH_FIRST_FAILED_COORDINATE",
      "CANVAS_TRUTH_FAILURE_CLASS",
      "CANVAS_TRUTH_FAILURE_REASON",
      "CANVAS_TRUTH_RECOMMENDED_OWNER",
      "CANVAS_TRUTH_RECOMMENDED_FILE",
      "CANVAS_TRUTH_RECOMMENDED_ACTION",

      "LAB_CARDINAL_RECEIPT_BUNDLE_STATUS",
      "DIAGNOSTIC_TRACK_RECEIPT_STATUS",
      "CANVAS_BISHOP_RECEIPT_STATUS",
      "FINGER_FILE_RECEIPT_STATUS",
      "PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS",

      "LAB_CARDINAL_RECEIPT_BUNDLE",
      "DIAGNOSTIC_TRACK_RECEIPT",
      "CANVAS_BISHOP_RECEIPT",
      "FINGER_FILE_RECEIPT",

      "SECONDARY_EVIDENCE_NOTES",
      "CANVAS_SURFACE_TRUTH_NOTES",

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

  function composePacketText(report = lastReport || {}) {
    return orderedFields(report)
      .map((field) => line(field, getRaw(report, field, "UNKNOWN")))
      .join("\n");
  }

  function composeCompactSummary(report = lastReport || {}) {
    return [
      line("CONTRACT", getRaw(report, "CONTRACT", CONTRACT)),
      line("INTERNAL_RENEWAL_CONTRACT", getRaw(report, "INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT)),
      line("TRUTH_HUB_STATUS", getRaw(report, "TRUTH_HUB_STATUS", "UNKNOWN")),
      line("RECEIPT_RETURN_MECHANISM_STATUS", getRaw(report, "RECEIPT_RETURN_MECHANISM_STATUS", "UNKNOWN")),
      line("LAB_CARDINAL_RECEIPT_BUNDLE_STATUS", getRaw(report, "LAB_CARDINAL_RECEIPT_BUNDLE_STATUS", "UNKNOWN")),
      line("DIAGNOSTIC_TRACK_RECEIPT_STATUS", getRaw(report, "DIAGNOSTIC_TRACK_RECEIPT_STATUS", "UNKNOWN")),
      line("CANVAS_BISHOP_RECEIPT_STATUS", getRaw(report, "CANVAS_BISHOP_RECEIPT_STATUS", "UNKNOWN")),
      line("FINGER_FILE_RECEIPT_STATUS", getRaw(report, "FINGER_FILE_RECEIPT_STATUS", "UNKNOWN")),
      line("CANVAS_TRUTH_FAILURE_CLASS", getRaw(report, "CANVAS_TRUTH_FAILURE_CLASS", "UNKNOWN")),
      line("CANVAS_TRUTH_RECOMMENDED_FILE", getRaw(report, "CANVAS_TRUTH_RECOMMENDED_FILE", "UNKNOWN")),
      line("PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS", getRaw(report, "PROBE_SOUTH_TO_TRUTH_HUB_TRANSFER_STATUS", "UNKNOWN"))
    ].join("\n");
  }

  function receiveSouthProbeReceipt(input = {}) {
    lastSouthProbeEnvelope = clonePlain({
      receivedAt: nowIso(),
      source: "PROBE_SOUTH_TO_CANVAS_SURFACE_TRUTH_HUB",
      report: extractCurrentReport(input),
      raw: input
    });

    const report = inspectCanvasSurfaceTruth({
      currentReport: lastSouthProbeEnvelope.report,
      southProbeReceipt: lastSouthProbeEnvelope.raw,
      chronology: input.chronology || getRaw(input, "CHRONOLOGY_SEQUENCE", [])
    });

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      received: true,
      report,
      packetText: getPacketText(),
      compactSummary: getCompactSummary(),
      ...NO_CLAIMS
    };
  }

  function receiveProbeSouthReceipt(input = {}) {
    return receiveSouthProbeReceipt(input);
  }

  function ingestSouthProbeReceipt(input = {}) {
    return receiveSouthProbeReceipt(input);
  }

  function runProbeCanvasSurfaceTruth(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runCanvasSurfaceTruth(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runProbe(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function inspect(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function runDiagnostic(payload = {}) {
    return inspectCanvasSurfaceTruth(payload);
  }

  function getReport() {
    return clonePlain(lastReport || inspectCanvasSurfaceTruth({}));
  }

  function getReceiptLight() {
    return clonePlain(lastReceipt || buildReceipt(lastReport || {}));
  }

  function getReceipt() {
    const report = lastReport || inspectCanvasSurfaceTruth({});

    return {
      ...getReceiptLight(),
      report: clonePlain(report),
      labCardinalReceiptBundle: clonePlain(getRaw(report, "LAB_CARDINAL_RECEIPT_BUNDLE", {})),
      diagnosticTrackReceipt: clonePlain(getRaw(report, "DIAGNOSTIC_TRACK_RECEIPT", {})),
      canvasBishopReceipt: clonePlain(getRaw(report, "CANVAS_BISHOP_RECEIPT", {})),
      fingerFileReceipt: clonePlain(getRaw(report, "FINGER_FILE_RECEIPT", {})),
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
      canvasSelectors: CANVAS_SELECTORS.slice(),
      mountSelectors: MOUNT_SELECTORS.slice(),
      supportsCanvasElementProbe: true,
      supportsCanvasMountProbe: true,
      supportsCanvasRectProbe: true,
      supportsComputedVisibilityProbe: true,
      supportsViewportIntersectionProbe: true,
      supportsContext2dProbe: true,
      supportsPixelSampleProbe: true,
      supportsLayerObstructionProbe: true,
      supportsNamespaceDomMatchProbe: true,
      supportsCoordinateSpecificFailure: true,
      supportsFourLaneReceiptHub: true,
      supportsProbeSouthReceiptIngestion: true,
      ...NO_CLAIMS
    };
  }

  function getPacketText() {
    if (!lastPacketText) lastPacketText = composePacketText(lastReport || inspectCanvasSurfaceTruth({}));
    return lastPacketText;
  }

  function getCompactSummary() {
    if (!lastCompactSummary) lastCompactSummary = composeCompactSummary(lastReport || inspectCanvasSurfaceTruth({}));
    return lastCompactSummary;
  }

  function publish() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.diagnosticProbeCanvasSurfaceTruth = api;
    root.HEARTH.diagnosticCanvasSurfaceTruthProbe = api;
    root.HEARTH.diagnosticProbeCanvasTruth = api;
    root.HEARTH.diagnosticCanvasTruthProbe = api;
    root.HEARTH.diagnosticRailProbeCanvasSurfaceTruth = api;
    root.HEARTH.diagnosticCanvasSurfaceTruthReceiptHub = api;
    root.HEARTH.diagnosticTruthHub = api;

    root.DEXTER_LAB.hearthDiagnosticProbeCanvasSurfaceTruth = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasTruthProbe = api;
    root.DEXTER_LAB.hearthDiagnosticRailProbeCanvasSurfaceTruth = api;
    root.DEXTER_LAB.hearthDiagnosticCanvasSurfaceTruthReceiptHub = api;
    root.DEXTER_LAB.hearthDiagnosticTruthHub = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE = api;
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH = api;
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB = api;
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB = api;

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_RAIL_PROBE_CANVAS_SURFACE_TRUTH_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_RECEIPT = getReceiptLight();
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_RECEIPT = getReceiptLight();

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_PROBE_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_REPORT = clonePlain(lastReport || {});
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_REPORT = clonePlain(lastReport || {});

    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_LAB_CARDINAL_RECEIPT =
      clonePlain(getRaw(lastReport || {}, "LAB_CARDINAL_RECEIPT_BUNDLE", {}));
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_DIAGNOSTIC_TRACK_RECEIPT =
      clonePlain(getRaw(lastReport || {}, "DIAGNOSTIC_TRACK_RECEIPT", {}));
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_CANVAS_BISHOP_RECEIPT =
      clonePlain(getRaw(lastReport || {}, "CANVAS_BISHOP_RECEIPT", {}));
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_FINGER_FILE_RECEIPT =
      clonePlain(getRaw(lastReport || {}, "FINGER_FILE_RECEIPT", {}));

    root.HEARTH_DIAGNOSTIC_PROBE_CANVAS_SURFACE_TRUTH_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_CANVAS_SURFACE_TRUTH_RECEIPT_HUB_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_PACKET_TEXT = lastPacketText || "";
    root.HEARTH_DIAGNOSTIC_TRUTH_HUB_COMPACT_SUMMARY = lastCompactSummary || "";

    return true;
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    canvasFile: CANVAS_FILE,
    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,

    diagnosticOnly: true,
    receiptHubActive: true,
    fourLaneReceiptHubActive: true,
    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,

    runProbeCanvasSurfaceTruth,
    runCanvasSurfaceTruth,
    runProbe,
    inspect,
    runDiagnostic,
    receiveSouthProbeReceipt,
    receiveProbeSouthReceipt,
    ingestSouthProbeReceipt,

    getReport,
    getReceiptLight,
    getReceipt,
    getPacketText,
    getCompactSummary,

    canvasSelectors: CANVAS_SELECTORS,
    mountSelectors: MOUNT_SELECTORS,
    acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS,

    supportsCanvasElementProbe: true,
    supportsCanvasMountProbe: true,
    supportsCanvasRectProbe: true,
    supportsComputedVisibilityProbe: true,
    supportsViewportIntersectionProbe: true,
    supportsContext2dProbe: true,
    supportsPixelSampleProbe: true,
    supportsLayerObstructionProbe: true,
    supportsNamespaceDomMatchProbe: true,
    supportsCoordinateSpecificFailure: true,
    supportsFourLaneReceiptHub: true,
    supportsLabCardinalReceiptBundle: true,
    supportsDiagnosticTrackReceipt: true,
    supportsCanvasBishopReceipt: true,
    supportsFingerFileReceipt: true,
    supportsProbeSouthReceiptIngestion: true,
    supportsCompactPacketText: true,

    ownsDiagnosticProbeOnly: true,
    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasRepair: false,
    ownsRouteRepair: false,
    ownsControlMutation: false,
    ownsRuntimeRestart: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsVisualPass: false,

    ...NO_CLAIMS
  });

  lastReceipt = buildReceipt({});
  publish();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
