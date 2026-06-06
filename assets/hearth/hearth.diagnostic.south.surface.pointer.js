// /assets/hearth/hearth.diagnostic.south.surface.pointer.js
// HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_CELL_TNT_v1
// Full-file replacement.
// Diagnostic South auxiliary tenth-cell / Surface Pointer Bishop read.
// Purpose:
// - Add a tenth auxiliary diagnostic cell without disturbing the nine-step chronology.
// - Let South / Probe South read inside the Surface, Inspect, Hex Surface, Pointer, Bishop, and Canvas parent handoff.
// - Distinguish “Canvas receives usable downstream expression but does not paint” from “downstream expression is not reaching Canvas.”
// - Publish a compact diagnostic packet that South v9+ and Probe South can consume by alias.
// - Preserve asymmetry: this file is not North, not South rail, not Probe South, and not Canvas.
// - Do not mutate production, repair Canvas, restart runtime, draw pixels, claim F13, claim F21, claim ready text, or claim final visual pass.

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_CELL_TNT_v1";
  const RECEIPT =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_CELL_RECEIPT_v1";
  const PACKET =
    "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_PACKET_v1";

  const FILE = "/assets/hearth/hearth.diagnostic.south.surface.pointer.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const SURFACE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const INSPECT_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const SOUTH_FILE = "/assets/hearth/hearth.diagnostic.south.js";
  const PROBE_SOUTH_FILE = "/assets/hearth/hearth.diagnostic.probe.south.js";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByDiagnosticRail: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByDiagnosticRail: false,
    f21SubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    canvasDrawingAuthorized: false,
    productionMutationAuthorized: false,
    routeRepairAuthorized: false,
    runtimeRestartAuthorized: false,
    controlMutationAuthorized: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const SOURCE_GROUPS = Object.freeze({
    surfaceFinger: Object.freeze([
      "HEARTH.canvasFingerSurface",
      "HEARTH.canvasSurfaceFinger",
      "HEARTH_CANVAS_FINGER_SURFACE",
      "HEARTH_CANVAS_SURFACE_FINGER"
    ]),
    inspectFinger: Object.freeze([
      "HEARTH.canvasFingerInspect",
      "HEARTH.canvasInspectFinger",
      "HEARTH_CANVAS_FINGER_INSPECT",
      "HEARTH_CANVAS_INSPECT_FINGER"
    ]),
    hexSurface: Object.freeze([
      "HEARTH.hexSurface",
      "HEARTH.hexSurfaceRenderer",
      "HEARTH.hearthHexSurface",
      "HEARTH_HEX_SURFACE",
      "HEARTH_HEX_SURFACE_RENDERER",
      "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER"
    ]),
    pointerTransmission: Object.freeze([
      "HEARTH.canvasFingerPointer",
      "HEARTH.canvasPointerFinger",
      "HEARTH.pointerFinger",
      "HEARTH.hexGatePointerFingerTransmission",
      "HEARTH.routeConductorHexGatePointerFingerTransmission",
      "HEARTH_CANVAS_FINGER_POINTER",
      "HEARTH_CANVAS_POINTER_FINGER",
      "HEARTH_HEX_GATE_POINTER_FINGER_TRANSMISSION",
      "DEXTER_LAB.hearthRouteConductorHexGatePointerFingerTransmission"
    ]),
    bishopFunnel: Object.freeze([
      "HEARTH.routeConductorBishopQueenCanvasRecognitionFunnel",
      "HEARTH.bishopQueenCanvasRecognitionFunnel",
      "HEARTH_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL",
      "DEXTER_LAB.hearthRouteConductorBishopQueenCanvasRecognitionFunnel"
    ]),
    canvasParent: Object.freeze([
      "HEARTH.canvas",
      "HEARTH.canvasParent",
      "HEARTH.canvasExpressionHub",
      "HEARTH_CANVAS",
      "HEARTH_CANVAS_PARENT",
      "HEARTH_CANVAS_EXPRESSION_HUB"
    ]),
    south: Object.freeze([
      "HEARTH.diagnosticSouth",
      "HEARTH.diagnosticRailSouth",
      "HEARTH_DIAGNOSTIC_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_SOUTH",
      "DEXTER_LAB.hearthDiagnosticSouth",
      "DEXTER_LAB.hearthDiagnosticRailSouth"
    ]),
    probeSouth: Object.freeze([
      "HEARTH.diagnosticProbeSouth",
      "HEARTH.diagnosticRailProbeSouth",
      "HEARTH.diagnosticSouthProbe",
      "HEARTH_DIAGNOSTIC_PROBE_SOUTH",
      "HEARTH_DIAGNOSTIC_RAIL_PROBE_SOUTH",
      "DEXTER_LAB.hearthDiagnosticProbeSouth",
      "DEXTER_LAB.hearthDiagnosticRailProbeSouth"
    ])
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    active: true,
    tenthCell: true,
    auxiliaryCellOnly: true,
    nineStepChronologyMutationBlocked: true,
    productionMutationAuthorized: false,

    surfaceFingerObserved: false,
    surfaceFingerSourceName: "NONE",
    surfaceReceiptObserved: false,
    surfacePacketObserved: false,
    surfaceReady: false,

    inspectFingerObserved: false,
    inspectFingerSourceName: "NONE",
    inspectReceiptObserved: false,
    inspectPacketObserved: false,
    inspectSurfaceObserved: false,
    inspectSurfaceReady: false,
    inspectAllFingerReady: false,

    hexSurfaceObserved: false,
    hexSurfaceSourceName: "NONE",
    hexReceiptObserved: false,
    hexPacketObserved: false,
    hexReady: false,
    hexSurfaceConsumesSurface: false,

    pointerTransmissionObserved: false,
    pointerTransmissionSourceName: "NONE",
    pointerReceiptObserved: false,
    pointerPacketObserved: false,
    pointerReady: false,
    pointerSurfaceDelivered: false,
    pointerHexDelivered: false,

    bishopFunnelObserved: false,
    bishopFunnelSourceName: "NONE",
    bishopReceiptObserved: false,
    bishopPacketObserved: false,
    bishopReady: false,
    bishopSurfaceRecognized: false,

    canvasParentObserved: false,
    canvasParentSourceName: "NONE",
    canvasReceiptObserved: false,
    canvasPacketObserved: false,
    canvasParentReady: false,
    canvasAcceptsExpressionPacket: false,
    canvasSurfaceExpressionReceived: false,

    downstreamExpressionSetObserved: false,
    downstreamExpressionSetReady: false,
    downstreamExpressionPacketUsable: false,
    canvasShouldHaveDrawablePacket: false,

    firstFailedCoordinate: "NOT_RUN",
    recommendedNextOwner: "UNKNOWN",
    recommendedNextFile: FILE,
    recommendedNextAction: "RUN_SURFACE_POINTER_BISHOP_CELL",
    ruling: "NOT_RUN",

    lastReport: null,
    lastPacket: null,
    lastPacketText: "",
    errors: [],
    events: [],

    ...NO_CLAIMS
  };

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

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      return Object.assign({}, value);
    }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1") return true;
    if (value === false || value === 0 || value === "0") return false;

    const text = safeString(value).toLowerCase();
    if (text === "true" || text === "yes" || text === "ready" || text === "complete") return true;
    if (text === "false" || text === "no" || text === "none" || text === "missing") return false;

    return fallback;
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimArray(state.events, 100);
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 60);
    return item;
  }

  function ensureObject(parent, key) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    return parent[key];
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

  function findSource(names) {
    for (const sourceName of names || []) {
      const source = readPath(sourceName);
      if (source && (isObject(source) || isFunction(source))) {
        return { source, sourceName };
      }
    }

    return { source: null, sourceName: "NONE" };
  }

  function callSafe(source, method, args = []) {
    if (!source || !isFunction(source[method])) return null;

    try {
      return source[method](...args);
    } catch (error) {
      recordError("CALL_FAILED", error, { method });
      return null;
    }
  }

  function readReceipt(source) {
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
      const value = callSafe(source, method);
      if (isObject(value)) return value;
    }

    if (isObject(source.receiptPacket)) return source.receiptPacket;
    if (isObject(source.receipt)) return source.receipt;
    if (isObject(source.state)) return source.state;

    if (source.contract || source.CONTRACT || source.receipt || source.RECEIPT || source.file) {
      return source;
    }

    return null;
  }

  function readPacket(source, preferredMethods, preferredKeys, receipt) {
    if (!source || (!isObject(source) && !isFunction(source))) return null;

    for (const method of preferredMethods || []) {
      const value = callSafe(source, method);
      if (isObject(value)) return value;
    }

    for (const key of preferredKeys || []) {
      if (receipt && isObject(receipt[key])) return receipt[key];
      if (isObject(source[key])) return source[key];
    }

    return null;
  }

  function mergedHasTrue(receipt, packet, keys) {
    for (const key of keys || []) {
      if (safeBool(receipt && receipt[key], false)) return true;
      if (safeBool(packet && packet[key], false)) return true;
    }

    return false;
  }

  function noFalseClaims(receipt, packet) {
    const merged = Object.assign(
      {},
      isObject(receipt) ? receipt : {},
      isObject(packet) ? packet : {}
    );

    return !(
      merged.f13Claimed === true ||
      merged.f21Claimed === true ||
      merged.f21EligibleForNorth === true ||
      merged.readyTextClaimed === true ||
      merged.readyTextAllowed === true ||
      merged.visualPassClaimed === true ||
      merged.finalVisualPassClaimed === true ||
      merged.generatedImage === true ||
      merged.graphicBox === true ||
      merged.webGL === true ||
      merged.webgl === true
    );
  }

  function inspectSurfaceFinger() {
    const found = findSource(SOURCE_GROUPS.surfaceFinger);
    const receipt = found.source ? readReceipt(found.source) : null;
    const packet = found.source
      ? readPacket(
          found.source,
          ["getSurfacePacket", "getPacket", "buildSurfacePacket", "getExpressionPacket"],
          ["surfacePacket", "expressionPacket", "packet"],
          receipt
        )
      : null;

    const ready = Boolean(
      found.source &&
      noFalseClaims(receipt, packet) &&
      (
        isObject(packet) ||
        mergedHasTrue(receipt, packet, [
          "surfaceReady",
          "surfacePacketReady",
          "surfaceModelReady",
          "visibleSurfaceContributionAvailable",
          "expressionPacketReady",
          "surfaceExpressionReady"
        ])
      )
    );

    return {
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      contract: safeString((receipt && (receipt.contract || receipt.CONTRACT)) || ""),
      receiptName: safeString((receipt && (receipt.receipt || receipt.RECEIPT)) || ""),
      file: safeString((receipt && receipt.file) || SURFACE_FINGER_FILE),
      noFalseClaims: noFalseClaims(receipt, packet),
      receipt: clonePlain(receipt),
      packet: clonePlain(packet)
    };
  }

  function inspectInspectFinger() {
    const found = findSource(SOURCE_GROUPS.inspectFinger);
    const receipt = found.source ? readReceipt(found.source) : null;
    const packet = found.source
      ? readPacket(
          found.source,
          ["getInspectionPacket", "buildInspectionPacket", "getPacket"],
          ["inspectionPacket", "packet"],
          receipt
        )
      : null;

    const surfaceObserved = Boolean(
      mergedHasTrue(receipt, packet, [
        "surfaceObserved",
        "surfaceReceiptObserved",
        "surfacePacketObserved"
      ])
    );

    const surfaceReady = Boolean(
      mergedHasTrue(receipt, packet, [
        "surfaceReady",
        "baseCanvasGlobeEvidenceReady",
        "baseCanvasGlobeExpandable"
      ])
    );

    const allFingerReady = Boolean(
      mergedHasTrue(receipt, packet, [
        "allFingerReady",
        "baseCanvasGlobeEvidenceReady"
      ])
    );

    const ready = Boolean(found.source && noFalseClaims(receipt, packet) && (isObject(packet) || surfaceReady || allFingerReady));

    return {
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      surfaceObserved,
      surfaceReady,
      allFingerReady,
      contract: safeString((receipt && (receipt.contract || receipt.CONTRACT)) || ""),
      receiptName: safeString((receipt && (receipt.receipt || receipt.RECEIPT)) || ""),
      file: safeString((receipt && receipt.file) || INSPECT_FINGER_FILE),
      noFalseClaims: noFalseClaims(receipt, packet),
      receipt: clonePlain(receipt),
      packet: clonePlain(packet)
    };
  }

  function inspectHexSurface() {
    const found = findSource(SOURCE_GROUPS.hexSurface);
    const receipt = found.source ? readReceipt(found.source) : null;
    const packet = found.source
      ? readPacket(
          found.source,
          ["getPacket", "getSurfacePacket", "getHexSurfacePacket", "readPacket"],
          ["hexSurfacePacket", "surfacePacket", "packet"],
          receipt
        )
      : null;

    const consumesSurface = Boolean(
      mergedHasTrue(receipt, packet, [
        "surfaceFingerObserved",
        "surfaceFingerReady",
        "surfacePacketObserved",
        "surfacePacketReady",
        "hexConsumesSurface",
        "surfaceConsumed",
        "surfacePacketConsumed",
        "fingerSurfaceConsumed"
      ])
    );

    const ready = Boolean(
      found.source &&
      noFalseClaims(receipt, packet) &&
      (
        isObject(packet) ||
        consumesSurface ||
        mergedHasTrue(receipt, packet, [
          "hexSurfaceReady",
          "surfaceReady",
          "rendererReady",
          "pairRendererReady",
          "drawPairFrameAvailable",
          "drawInteractiveFrameAvailable"
        ])
      )
    );

    return {
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      consumesSurface,
      contract: safeString((receipt && (receipt.contract || receipt.CONTRACT)) || ""),
      receiptName: safeString((receipt && (receipt.receipt || receipt.RECEIPT)) || ""),
      file: safeString((receipt && receipt.file) || HEX_SURFACE_FILE),
      noFalseClaims: noFalseClaims(receipt, packet),
      receipt: clonePlain(receipt),
      packet: clonePlain(packet)
    };
  }

  function inspectPointerTransmission() {
    const found = findSource(SOURCE_GROUPS.pointerTransmission);
    const receipt = found.source ? readReceipt(found.source) : null;
    const packet = found.source
      ? readPacket(
          found.source,
          ["getTransmissionPacket", "getPointerPacket", "getPacket", "read"],
          ["transmissionPacket", "pointerPacket", "packet"],
          receipt
        )
      : null;

    const surfaceDelivered = Boolean(
      mergedHasTrue(receipt, packet, [
        "surfaceDelivered",
        "surfacePacketDelivered",
        "surfaceFingerDelivered",
        "fingerSurfaceDelivered",
        "pointerSurfaceDelivered"
      ])
    );

    const hexDelivered = Boolean(
      mergedHasTrue(receipt, packet, [
        "hexDelivered",
        "hexSurfaceDelivered",
        "hexPacketDelivered",
        "pointerHexDelivered"
      ])
    );

    const ready = Boolean(
      found.source &&
      noFalseClaims(receipt, packet) &&
      (
        isObject(packet) ||
        surfaceDelivered ||
        hexDelivered ||
        mergedHasTrue(receipt, packet, [
          "pointerReady",
          "transmissionReady",
          "fingerTransmissionReady",
          "hexGatePointerReady"
        ])
      )
    );

    return {
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      surfaceDelivered,
      hexDelivered,
      contract: safeString((receipt && (receipt.contract || receipt.CONTRACT)) || ""),
      receiptName: safeString((receipt && (receipt.receipt || receipt.RECEIPT)) || ""),
      file: ROUTE_CONDUCTOR_FILE,
      noFalseClaims: noFalseClaims(receipt, packet),
      receipt: clonePlain(receipt),
      packet: clonePlain(packet)
    };
  }

  function inspectBishopFunnel() {
    const found = findSource(SOURCE_GROUPS.bishopFunnel);
    const receipt = found.source ? readReceipt(found.source) : null;
    const packet = found.source
      ? readPacket(
          found.source,
          ["getPacket", "getReport", "read", "getState"],
          ["recognitionPacket", "bishopPacket", "packet"],
          receipt
        )
      : null;

    const surfaceRecognized = Boolean(
      mergedHasTrue(receipt, packet, [
        "surfaceRecognized",
        "canvasExpressionSurfaceReady",
        "canvasExpressionSurfaceObserved",
        "surfaceFingerObserved",
        "surfaceFingerReady",
        "bishopSurfaceRecognized"
      ])
    );

    const ready = Boolean(
      found.source &&
      noFalseClaims(receipt, packet) &&
      (
        isObject(packet) ||
        surfaceRecognized ||
        mergedHasTrue(receipt, packet, [
          "bishopFunnelReady",
          "recognitionFunnelReady",
          "canvasRecognitionReady",
          "canvasExpressionProofActive"
        ])
      )
    );

    return {
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      surfaceRecognized,
      contract: safeString((receipt && (receipt.contract || receipt.CONTRACT)) || ""),
      receiptName: safeString((receipt && (receipt.receipt || receipt.RECEIPT)) || ""),
      file: ROUTE_CONDUCTOR_FILE,
      noFalseClaims: noFalseClaims(receipt, packet),
      receipt: clonePlain(receipt),
      packet: clonePlain(packet)
    };
  }

  function inspectCanvasParent() {
    const found = findSource(SOURCE_GROUPS.canvasParent);
    const receipt = found.source ? readReceipt(found.source) : null;
    const packet = found.source
      ? readPacket(
          found.source,
          ["getPacket", "getCanvasPacket", "getReport", "read"],
          ["canvasPacket", "expressionPacket", "packet"],
          receipt
        )
      : null;

    const acceptsExpressionPacket = Boolean(
      found.source &&
      (
        isFunction(found.source.receiveExpressionPacket) ||
        isFunction(found.source.receiveChildPacket) ||
        isFunction(found.source.receiveFingerPacket) ||
        isFunction(found.source.receiveCanvasFingerPacket) ||
        isFunction(found.source.registerExpressionFinger) ||
        isFunction(found.source.drawPairFrame) ||
        isFunction(found.source.drawInteractiveFrame)
      )
    );

    const surfaceExpressionReceived = Boolean(
      mergedHasTrue(receipt, packet, [
        "surfaceExpressionReceived",
        "surfacePacketReceived",
        "canvasSurfaceReady",
        "canvasExpressionSurfaceReady",
        "surfaceReady",
        "fingerSurfaceReceived"
      ])
    );

    const ready = Boolean(
      found.source &&
      noFalseClaims(receipt, packet) &&
      (
        acceptsExpressionPacket ||
        surfaceExpressionReceived ||
        isObject(packet) ||
        mergedHasTrue(receipt, packet, [
          "canvasReady",
          "canvasParentReady",
          "expressionHubReady"
        ])
      )
    );

    return {
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      acceptsExpressionPacket,
      surfaceExpressionReceived,
      contract: safeString((receipt && (receipt.contract || receipt.CONTRACT)) || ""),
      receiptName: safeString((receipt && (receipt.receipt || receipt.RECEIPT)) || ""),
      file: safeString((receipt && receipt.file) || CANVAS_FILE),
      noFalseClaims: noFalseClaims(receipt, packet),
      receipt: clonePlain(receipt),
      packet: clonePlain(packet)
    };
  }

  function resolveRuling() {
    if (!state.surfaceFingerObserved) {
      return fail("SURFACE_FINGER_NOT_OBSERVED", "CANVAS_FINGER_SURFACE", SURFACE_FINGER_FILE, "VERIFY_SURFACE_FINGER_LOAD_AND_ALIAS_PUBLICATION");
    }

    if (!state.surfaceReady) {
      return fail("SURFACE_FINGER_NOT_READY", "CANVAS_FINGER_SURFACE", SURFACE_FINGER_FILE, "VERIFY_SURFACE_PACKET_READY");
    }

    if (!state.inspectFingerObserved) {
      return fail("INSPECT_FINGER_NOT_OBSERVED", "CANVAS_FINGER_INSPECT", INSPECT_FINGER_FILE, "LOAD_OR_RENEW_INSPECT_FINGER");
    }

    if (!state.inspectSurfaceObserved || !state.inspectSurfaceReady) {
      return fail("INSPECT_FINGER_DOES_NOT_CONFIRM_SURFACE", "CANVAS_FINGER_INSPECT", INSPECT_FINGER_FILE, "RENEW_INSPECT_TO_CONSUME_SURFACE_FINGER");
    }

    if (!state.hexSurfaceObserved) {
      return fail("HEX_SURFACE_NOT_OBSERVED", "HEX_SURFACE", HEX_SURFACE_FILE, "VERIFY_HEX_SURFACE_LOAD_AND_ALIAS_PUBLICATION");
    }

    if (!state.hexReady || !state.hexSurfaceConsumesSurface) {
      return fail("HEX_SURFACE_NOT_CONSUMING_SURFACE", "HEX_SURFACE", HEX_SURFACE_FILE, "RENEW_HEX_SURFACE_TO_CONSUME_SURFACE_PACKET");
    }

    if (!state.pointerTransmissionObserved) {
      return fail("POINTER_TRANSMISSION_NOT_OBSERVED", "ROUTE_CONDUCTOR_POINTER", ROUTE_CONDUCTOR_FILE, "VERIFY_POINTER_FINGER_TRANSMISSION_ALIAS");
    }

    if (!state.pointerReady || !state.pointerSurfaceDelivered) {
      return fail("POINTER_TRANSMISSION_NOT_DELIVERING_SURFACE", "ROUTE_CONDUCTOR_POINTER", ROUTE_CONDUCTOR_FILE, "RENEW_POINTER_TRANSMISSION_TO_DELIVER_SURFACE");
    }

    if (!state.bishopFunnelObserved) {
      return fail("BISHOP_FUNNEL_NOT_OBSERVED", "ROUTE_CONDUCTOR_BISHOP", ROUTE_CONDUCTOR_FILE, "VERIFY_BISHOP_RECOGNITION_FUNNEL_ALIAS");
    }

    if (!state.bishopReady || !state.bishopSurfaceRecognized) {
      return fail("BISHOP_FUNNEL_NOT_RECOGNIZING_SURFACE", "ROUTE_CONDUCTOR_BISHOP", ROUTE_CONDUCTOR_FILE, "RENEW_BISHOP_FUNNEL_TO_RECOGNIZE_SURFACE_POINTER");
    }

    if (!state.canvasParentObserved) {
      return fail("CANVAS_PARENT_NOT_OBSERVED", "CANVAS_PARENT", CANVAS_FILE, "VERIFY_CANVAS_PARENT_ALIAS");
    }

    if (!state.canvasAcceptsExpressionPacket) {
      return fail("CANVAS_PARENT_NO_EXPRESSION_INTAKE", "CANVAS_PARENT", CANVAS_FILE, "AUDIT_CANVAS_EXPRESSION_INTAKE_METHODS");
    }

    state.firstFailedCoordinate = "NONE_DOWNSTREAM_EXPRESSION_SET_READY";
    state.recommendedNextOwner = "CANVAS_DRAWING_OR_EXPRESSION_ADAPTER";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "VERIFY_CANVAS_DRAW_PATH_EXECUTES_AND_WRITES_VISIBLE_PIXELS";
    state.ruling = "DOWNSTREAM_EXPRESSION_READY_CANVAS_PIXEL_FAILURE_REMAINS";

    return state.ruling;
  }

  function fail(coordinate, owner, file, action) {
    state.firstFailedCoordinate = coordinate;
    state.recommendedNextOwner = owner;
    state.recommendedNextFile = file;
    state.recommendedNextAction = action;
    state.ruling = `DOWNSTREAM_EXPRESSION_HOLD_${coordinate}`;
    return state.ruling;
  }

  function runSurfacePointerBishopRead(input = {}) {
    const surface = inspectSurfaceFinger();
    const inspect = inspectInspectFinger();
    const hex = inspectHexSurface();
    const pointer = inspectPointerTransmission();
    const bishop = inspectBishopFunnel();
    const canvas = inspectCanvasParent();

    state.surfaceFingerObserved = surface.observed;
    state.surfaceFingerSourceName = surface.sourceName;
    state.surfaceReceiptObserved = surface.receiptObserved;
    state.surfacePacketObserved = surface.packetObserved;
    state.surfaceReady = surface.ready;

    state.inspectFingerObserved = inspect.observed;
    state.inspectFingerSourceName = inspect.sourceName;
    state.inspectReceiptObserved = inspect.receiptObserved;
    state.inspectPacketObserved = inspect.packetObserved;
    state.inspectSurfaceObserved = inspect.surfaceObserved;
    state.inspectSurfaceReady = inspect.surfaceReady;
    state.inspectAllFingerReady = inspect.allFingerReady;

    state.hexSurfaceObserved = hex.observed;
    state.hexSurfaceSourceName = hex.sourceName;
    state.hexReceiptObserved = hex.receiptObserved;
    state.hexPacketObserved = hex.packetObserved;
    state.hexReady = hex.ready;
    state.hexSurfaceConsumesSurface = hex.consumesSurface;

    state.pointerTransmissionObserved = pointer.observed;
    state.pointerTransmissionSourceName = pointer.sourceName;
    state.pointerReceiptObserved = pointer.receiptObserved;
    state.pointerPacketObserved = pointer.packetObserved;
    state.pointerReady = pointer.ready;
    state.pointerSurfaceDelivered = pointer.surfaceDelivered;
    state.pointerHexDelivered = pointer.hexDelivered;

    state.bishopFunnelObserved = bishop.observed;
    state.bishopFunnelSourceName = bishop.sourceName;
    state.bishopReceiptObserved = bishop.receiptObserved;
    state.bishopPacketObserved = bishop.packetObserved;
    state.bishopReady = bishop.ready;
    state.bishopSurfaceRecognized = bishop.surfaceRecognized;

    state.canvasParentObserved = canvas.observed;
    state.canvasParentSourceName = canvas.sourceName;
    state.canvasReceiptObserved = canvas.receiptObserved;
    state.canvasPacketObserved = canvas.packetObserved;
    state.canvasParentReady = canvas.ready;
    state.canvasAcceptsExpressionPacket = canvas.acceptsExpressionPacket;
    state.canvasSurfaceExpressionReceived = canvas.surfaceExpressionReceived;

    state.downstreamExpressionSetObserved = Boolean(
      state.surfaceFingerObserved &&
      state.inspectFingerObserved &&
      state.hexSurfaceObserved &&
      state.pointerTransmissionObserved &&
      state.bishopFunnelObserved &&
      state.canvasParentObserved
    );

    state.downstreamExpressionSetReady = Boolean(
      state.surfaceReady &&
      state.inspectSurfaceReady &&
      state.hexReady &&
      state.hexSurfaceConsumesSurface &&
      state.pointerReady &&
      state.pointerSurfaceDelivered &&
      state.bishopReady &&
      state.bishopSurfaceRecognized &&
      state.canvasParentReady
    );

    state.downstreamExpressionPacketUsable = Boolean(
      state.downstreamExpressionSetReady &&
      state.canvasAcceptsExpressionPacket
    );

    state.canvasShouldHaveDrawablePacket = Boolean(state.downstreamExpressionPacketUsable);

    resolveRuling();

    const report = {
      PACKET_NAME: "HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP_RESULT_PACKET_v1",
      CONTRACT,
      RECEIPT,
      PACKET,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: nowIso(),

      SOUTH_FILE,
      PROBE_SOUTH_FILE,
      CANVAS_FILE,
      SURFACE_FINGER_FILE,
      INSPECT_FINGER_FILE,
      HEX_SURFACE_FILE,
      ROUTE_CONDUCTOR_FILE,

      AUXILIARY_TENTH_CELL: true,
      NINE_STEP_CHRONOLOGY_MUTATION_BLOCKED: true,
      SOUTH_RAIL_AUTHORITY: false,
      PROBE_SOUTH_AUTHORITY: false,
      CANVAS_DRAWING_AUTHORITY: false,
      PRODUCTION_MUTATION_AUTHORIZED: false,

      SURFACE_FINGER_OBSERVED: state.surfaceFingerObserved,
      SURFACE_FINGER_SOURCE_NAME: state.surfaceFingerSourceName,
      SURFACE_RECEIPT_OBSERVED: state.surfaceReceiptObserved,
      SURFACE_PACKET_OBSERVED: state.surfacePacketObserved,
      SURFACE_READY: state.surfaceReady,

      INSPECT_FINGER_OBSERVED: state.inspectFingerObserved,
      INSPECT_FINGER_SOURCE_NAME: state.inspectFingerSourceName,
      INSPECT_RECEIPT_OBSERVED: state.inspectReceiptObserved,
      INSPECT_PACKET_OBSERVED: state.inspectPacketObserved,
      INSPECT_SURFACE_OBSERVED: state.inspectSurfaceObserved,
      INSPECT_SURFACE_READY: state.inspectSurfaceReady,
      INSPECT_ALL_FINGER_READY: state.inspectAllFingerReady,

      HEX_SURFACE_OBSERVED: state.hexSurfaceObserved,
      HEX_SURFACE_SOURCE_NAME: state.hexSurfaceSourceName,
      HEX_RECEIPT_OBSERVED: state.hexReceiptObserved,
      HEX_PACKET_OBSERVED: state.hexPacketObserved,
      HEX_READY: state.hexReady,
      HEX_SURFACE_CONSUMES_SURFACE: state.hexSurfaceConsumesSurface,

      POINTER_TRANSMISSION_OBSERVED: state.pointerTransmissionObserved,
      POINTER_TRANSMISSION_SOURCE_NAME: state.pointerTransmissionSourceName,
      POINTER_RECEIPT_OBSERVED: state.pointerReceiptObserved,
      POINTER_PACKET_OBSERVED: state.pointerPacketObserved,
      POINTER_READY: state.pointerReady,
      POINTER_SURFACE_DELIVERED: state.pointerSurfaceDelivered,
      POINTER_HEX_DELIVERED: state.pointerHexDelivered,

      BISHOP_FUNNEL_OBSERVED: state.bishopFunnelObserved,
      BISHOP_FUNNEL_SOURCE_NAME: state.bishopFunnelSourceName,
      BISHOP_RECEIPT_OBSERVED: state.bishopReceiptObserved,
      BISHOP_PACKET_OBSERVED: state.bishopPacketObserved,
      BISHOP_READY: state.bishopReady,
      BISHOP_SURFACE_RECOGNIZED: state.bishopSurfaceRecognized,

      CANVAS_PARENT_OBSERVED: state.canvasParentObserved,
      CANVAS_PARENT_SOURCE_NAME: state.canvasParentSourceName,
      CANVAS_RECEIPT_OBSERVED: state.canvasReceiptObserved,
      CANVAS_PACKET_OBSERVED: state.canvasPacketObserved,
      CANVAS_PARENT_READY: state.canvasParentReady,
      CANVAS_ACCEPTS_EXPRESSION_PACKET: state.canvasAcceptsExpressionPacket,
      CANVAS_SURFACE_EXPRESSION_RECEIVED: state.canvasSurfaceExpressionReceived,

      DOWNSTREAM_EXPRESSION_SET_OBSERVED: state.downstreamExpressionSetObserved,
      DOWNSTREAM_EXPRESSION_SET_READY: state.downstreamExpressionSetReady,
      DOWNSTREAM_EXPRESSION_PACKET_USABLE: state.downstreamExpressionPacketUsable,
      CANVAS_SHOULD_HAVE_DRAWABLE_PACKET: state.canvasShouldHaveDrawablePacket,

      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      RULING: state.ruling,

      SURFACE_DETAIL: surface,
      INSPECT_DETAIL: inspect,
      HEX_DETAIL: hex,
      POINTER_DETAIL: pointer,
      BISHOP_DETAIL: bishop,
      CANVAS_DETAIL: canvas,

      INPUT_KEYS: Object.keys(input || {}).join(",") || "NONE",

      ...NO_CLAIMS
    };

    const packet = {
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      auxiliaryTenthCell: true,
      nineStepChronologyMutationBlocked: true,

      surfaceFingerObserved: state.surfaceFingerObserved,
      surfaceReady: state.surfaceReady,
      inspectFingerObserved: state.inspectFingerObserved,
      inspectSurfaceReady: state.inspectSurfaceReady,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexReady: state.hexReady,
      hexSurfaceConsumesSurface: state.hexSurfaceConsumesSurface,
      pointerTransmissionObserved: state.pointerTransmissionObserved,
      pointerReady: state.pointerReady,
      pointerSurfaceDelivered: state.pointerSurfaceDelivered,
      bishopFunnelObserved: state.bishopFunnelObserved,
      bishopReady: state.bishopReady,
      bishopSurfaceRecognized: state.bishopSurfaceRecognized,
      canvasParentObserved: state.canvasParentObserved,
      canvasAcceptsExpressionPacket: state.canvasAcceptsExpressionPacket,

      downstreamExpressionSetObserved: state.downstreamExpressionSetObserved,
      downstreamExpressionSetReady: state.downstreamExpressionSetReady,
      downstreamExpressionPacketUsable: state.downstreamExpressionPacketUsable,
      canvasShouldHaveDrawablePacket: state.canvasShouldHaveDrawablePacket,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      ruling: state.ruling,

      report,
      updatedAt: nowIso(),

      ...NO_CLAIMS
    };

    state.lastReport = clonePlain(report);
    state.lastPacket = clonePlain(packet);
    state.lastPacketText = packetText(report);

    record("SURFACE_POINTER_BISHOP_READ_COMPLETE", {
      ruling: state.ruling,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile
    });

    updateDataset();
    publishGlobals();

    return clonePlain(report);
  }

  function packetText(report) {
    const keys = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "FILE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",

      "AUXILIARY_TENTH_CELL",
      "NINE_STEP_CHRONOLOGY_MUTATION_BLOCKED",
      "SOUTH_RAIL_AUTHORITY",
      "PROBE_SOUTH_AUTHORITY",
      "CANVAS_DRAWING_AUTHORITY",
      "PRODUCTION_MUTATION_AUTHORIZED",

      "SURFACE_FINGER_OBSERVED",
      "SURFACE_FINGER_SOURCE_NAME",
      "SURFACE_RECEIPT_OBSERVED",
      "SURFACE_PACKET_OBSERVED",
      "SURFACE_READY",

      "INSPECT_FINGER_OBSERVED",
      "INSPECT_FINGER_SOURCE_NAME",
      "INSPECT_SURFACE_OBSERVED",
      "INSPECT_SURFACE_READY",
      "INSPECT_ALL_FINGER_READY",

      "HEX_SURFACE_OBSERVED",
      "HEX_SURFACE_SOURCE_NAME",
      "HEX_READY",
      "HEX_SURFACE_CONSUMES_SURFACE",

      "POINTER_TRANSMISSION_OBSERVED",
      "POINTER_TRANSMISSION_SOURCE_NAME",
      "POINTER_READY",
      "POINTER_SURFACE_DELIVERED",
      "POINTER_HEX_DELIVERED",

      "BISHOP_FUNNEL_OBSERVED",
      "BISHOP_FUNNEL_SOURCE_NAME",
      "BISHOP_READY",
      "BISHOP_SURFACE_RECOGNIZED",

      "CANVAS_PARENT_OBSERVED",
      "CANVAS_PARENT_SOURCE_NAME",
      "CANVAS_PARENT_READY",
      "CANVAS_ACCEPTS_EXPRESSION_PACKET",
      "CANVAS_SURFACE_EXPRESSION_RECEIVED",

      "DOWNSTREAM_EXPRESSION_SET_OBSERVED",
      "DOWNSTREAM_EXPRESSION_SET_READY",
      "DOWNSTREAM_EXPRESSION_PACKET_USABLE",
      "CANVAS_SHOULD_HAVE_DRAWABLE_PACKET",

      "FIRST_FAILED_COORDINATE",
      "RECOMMENDED_NEXT_OWNER",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "RULING",

      "f13Claimed",
      "f21EligibleForNorth",
      "f21ClaimedByDiagnosticRail",
      "readyTextAllowed",
      "readyTextClaimed",
      "visualPassClaimed",
      "generatedImage",
      "graphicBox",
      "webGL"
    ];

    return keys.map((key) => `${key}=${formatValue(report && report[key])}`).join("\n");
  }

  function formatValue(value) {
    if (value === undefined || value === null) return "";
    if (isObject(value) || Array.isArray(value)) {
      try {
        return JSON.stringify(value).slice(0, 12000);
      } catch (_error) {
        return String(value).slice(0, 12000);
      }
    }

    return String(value).replace(/\n/g, " ").slice(0, 12000);
  }

  function getReport(input = {}) {
    if (!state.lastReport) return runSurfacePointerBishopRead(input);
    return clonePlain(state.lastReport);
  }

  function getPacket(input = {}) {
    if (!state.lastPacket) runSurfacePointerBishopRead(input);
    return clonePlain(state.lastPacket);
  }

  function getPacketText() {
    if (!state.lastPacketText) runSurfacePointerBishopRead();
    return state.lastPacketText;
  }

  function getState() {
    return clonePlain(state);
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      packet: PACKET,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      loaded: state.loaded,
      active: state.active,
      auxiliaryTenthCell: state.tenthCell,
      nineStepChronologyMutationBlocked: state.nineStepChronologyMutationBlocked,
      productionMutationAuthorized: false,

      surfaceFingerObserved: state.surfaceFingerObserved,
      surfaceReady: state.surfaceReady,
      inspectFingerObserved: state.inspectFingerObserved,
      inspectSurfaceReady: state.inspectSurfaceReady,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexReady: state.hexReady,
      hexSurfaceConsumesSurface: state.hexSurfaceConsumesSurface,
      pointerTransmissionObserved: state.pointerTransmissionObserved,
      pointerReady: state.pointerReady,
      pointerSurfaceDelivered: state.pointerSurfaceDelivered,
      bishopFunnelObserved: state.bishopFunnelObserved,
      bishopReady: state.bishopReady,
      bishopSurfaceRecognized: state.bishopSurfaceRecognized,
      canvasParentObserved: state.canvasParentObserved,
      canvasParentReady: state.canvasParentReady,
      canvasAcceptsExpressionPacket: state.canvasAcceptsExpressionPacket,

      downstreamExpressionSetObserved: state.downstreamExpressionSetObserved,
      downstreamExpressionSetReady: state.downstreamExpressionSetReady,
      downstreamExpressionPacketUsable: state.downstreamExpressionPacketUsable,
      canvasShouldHaveDrawablePacket: state.canvasShouldHaveDrawablePacket,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      ruling: state.ruling,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      currentReceipt: true,
      sourceGroups: clonePlain(SOURCE_GROUPS),
      report: clonePlain(state.lastReport),
      packetObject: clonePlain(state.lastPacket),
      packetText: state.lastPacketText,
      errors: clonePlain(state.errors),
      events: clonePlain(state.events)
    };
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function updateDataset() {
    setDataset("hearthDiagnosticSouthSurfacePointerLoaded", "true");
    setDataset("hearthDiagnosticSouthSurfacePointerContract", CONTRACT);
    setDataset("hearthDiagnosticSouthSurfacePointerReceipt", RECEIPT);
    setDataset("hearthDiagnosticSouthSurfacePointerFile", FILE);
    setDataset("hearthDiagnosticSouthSurfacePointerAuxiliaryTenthCell", "true");
    setDataset("hearthDiagnosticSouthSurfacePointerNineStepMutationBlocked", "true");

    setDataset("hearthDiagnosticSouthSurfacePointerSurfaceObserved", state.surfaceFingerObserved);
    setDataset("hearthDiagnosticSouthSurfacePointerSurfaceReady", state.surfaceReady);
    setDataset("hearthDiagnosticSouthSurfacePointerInspectObserved", state.inspectFingerObserved);
    setDataset("hearthDiagnosticSouthSurfacePointerInspectSurfaceReady", state.inspectSurfaceReady);
    setDataset("hearthDiagnosticSouthSurfacePointerHexObserved", state.hexSurfaceObserved);
    setDataset("hearthDiagnosticSouthSurfacePointerHexReady", state.hexReady);
    setDataset("hearthDiagnosticSouthSurfacePointerHexConsumesSurface", state.hexSurfaceConsumesSurface);
    setDataset("hearthDiagnosticSouthSurfacePointerPointerObserved", state.pointerTransmissionObserved);
    setDataset("hearthDiagnosticSouthSurfacePointerPointerReady", state.pointerReady);
    setDataset("hearthDiagnosticSouthSurfacePointerPointerSurfaceDelivered", state.pointerSurfaceDelivered);
    setDataset("hearthDiagnosticSouthSurfacePointerBishopObserved", state.bishopFunnelObserved);
    setDataset("hearthDiagnosticSouthSurfacePointerBishopReady", state.bishopReady);
    setDataset("hearthDiagnosticSouthSurfacePointerBishopSurfaceRecognized", state.bishopSurfaceRecognized);
    setDataset("hearthDiagnosticSouthSurfacePointerCanvasParentObserved", state.canvasParentObserved);
    setDataset("hearthDiagnosticSouthSurfacePointerCanvasAcceptsExpressionPacket", state.canvasAcceptsExpressionPacket);
    setDataset("hearthDiagnosticSouthSurfacePointerDownstreamReady", state.downstreamExpressionSetReady);
    setDataset("hearthDiagnosticSouthSurfacePointerFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthDiagnosticSouthSurfacePointerRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthDiagnosticSouthSurfacePointerRuling", state.ruling);

    setDataset("hearthDiagnosticSouthSurfacePointerF13Claimed", "false");
    setDataset("hearthDiagnosticSouthSurfacePointerF21EligibleForNorth", "false");
    setDataset("hearthDiagnosticSouthSurfacePointerVisualPassClaimed", "false");
    setDataset("hearthDiagnosticSouthSurfacePointerGeneratedImage", "false");
    setDataset("hearthDiagnosticSouthSurfacePointerGraphicBox", "false");
    setDataset("hearthDiagnosticSouthSurfacePointerWebGL", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.diagnosticSouthSurfacePointer = api;
    hearth.diagnosticSouthSurfacePointerBishop = api;
    hearth.diagnosticProbeSouthSurfacePointer = api;
    hearth.diagnosticTenthSurfacePointerCell = api;

    lab.hearthDiagnosticSouthSurfacePointer = api;
    lab.hearthDiagnosticSouthSurfacePointerBishop = api;
    lab.hearthDiagnosticProbeSouthSurfacePointer = api;
    lab.hearthDiagnosticTenthSurfacePointerCell = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER = api;
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_BISHOP = api;
    root.HEARTH_DIAGNOSTIC_PROBE_SOUTH_SURFACE_POINTER = api;
    root.HEARTH_DIAGNOSTIC_TENTH_SURFACE_POINTER_CELL = api;

    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_RECEIPT = getReceipt();
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_PACKET = getPacket();
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_REPORT = clonePlain(state.lastReport || {});
    root.HEARTH_DIAGNOSTIC_SOUTH_SURFACE_POINTER_PACKET_TEXT = state.lastPacketText || "";

    return api;
  }

  function boot() {
    try {
      runSurfacePointerBishopRead();
    } catch (error) {
      recordError("BOOT_READ_FAILED", error);
    }

    updateDataset();
    publishGlobals();

    return getReceipt();
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PACKET,
    FILE,
    TARGET_ROUTE,
    DIAGNOSTIC_ROUTE,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    canvasFile: CANVAS_FILE,
    surfaceFingerFile: SURFACE_FINGER_FILE,
    inspectFingerFile: INSPECT_FINGER_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    southFile: SOUTH_FILE,
    probeSouthFile: PROBE_SOUTH_FILE,

    boot,
    init: boot,
    start: boot,
    mount: boot,

    runSurfacePointerBishopRead,
    runDiagnostic: runSurfacePointerBishopRead,
    inspect: runSurfacePointerBishopRead,
    read: getReceiptLight,

    inspectSurfaceFinger,
    inspectInspectFinger,
    inspectHexSurface,
    inspectPointerTransmission,
    inspectBishopFunnel,
    inspectCanvasParent,

    getReport,
    getPacket,
    getPacketText,
    getState,
    getReceipt,
    getReceiptLight,
    updateDataset,
    publishGlobals,

    supportsSouthSurfacePointerRead: true,
    supportsAuxiliaryTenthCell: true,
    supportsNineStepChronologyPreservation: true,
    supportsSurfaceFingerInspection: true,
    supportsInspectFingerInspection: true,
    supportsHexSurfaceInspection: true,
    supportsPointerTransmissionInspection: true,
    supportsBishopFunnelInspection: true,
    supportsCanvasParentInspection: true,

    ownsNorthRail: false,
    ownsSouthRail: false,
    ownsProbeSouth: false,
    ownsCanvas: false,
    ownsCanvasDrawing: false,
    ownsRouteRepair: false,
    ownsProductionMutation: false,
    ownsFinalVisualPass: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    updateDataset();
    publishGlobals();

    if (doc && doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
    } else {
      boot();
    }
  } catch (error) {
    recordError("INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
