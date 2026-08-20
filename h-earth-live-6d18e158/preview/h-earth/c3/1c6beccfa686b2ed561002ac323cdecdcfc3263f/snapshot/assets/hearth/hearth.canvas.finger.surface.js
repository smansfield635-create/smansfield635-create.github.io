// /assets/hearth/hearth.canvas.finger.surface.js
// HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4
// Internal controlled renewal:
// HEARTH_CANVAS_FINGER_SURFACE_HEX_CANONICAL_MAP_TUPLE_RECEIVER_BISHOP_GATE_TNT_v4_1
// Full-file replacement.
// Canvas Finger Surface / Pointer Surface Bishop Gate only.
//
// Purpose:
// - Publish the primary Pointer Surface Bishop endpoint expected by Hex Surface.
// - Receive Hex Surface canonical-map-tuple pointer-finger transmission packets.
// - Preserve Hex Surface as upstream canonical tuple gate.
// - Preserve Inspect as downstream child proof / inspection receiver, not primary endpoint.
// - Preserve Canvas as receiver/output carrier.
// - Preserve canonical map tuple fields exactly as supplied by Hex Surface.
// - Do not synthesize, guess, remap, or derive coordinates.
// - Do not draw, create, mount, repair, release, restart, or claim visual pass.
// - Forward a surface-proof packet to Inspect only through Inspect public APIs when available.
// - Publish receipts/reports for North, South, West, and probe adapters.
//
// Does not own:
// - Hex Surface truth
// - Hex Four-Pair Authority truth
// - Canvas drawing
// - Canvas lifecycle
// - Canvas release
// - Controls
// - diagnostic North chronology
// - diagnostic South packet output
// - terrain / hydrology / material / elevation truth
// - final visual pass
// - F13 / F21 latch

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const RECEIPT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_RECEIPT_v4";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_CANONICAL_MAP_TUPLE_RECEIVER_BISHOP_GATE_TNT_v4_1";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_CANONICAL_MAP_TUPLE_RECEIVER_BISHOP_GATE_RECEIPT_v4_1";

  const VERSION =
    "2026-06-08.hearth-canvas-finger-surface-hex-canonical-map-tuple-receiver-bishop-gate-v4-1";

  const FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const POINTER_FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const POINTER_FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE =
    "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_BINDING_POINTER_TRANSMISSION_TNT_v4_4";
  const EXPECTED_INSPECT_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";

  const HEX_POINTER_TRANSMISSION_PACKET =
    "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_POINTER_FINGER_TRANSMISSION_PACKET_v4_4";
  const SURFACE_PROOF_PACKET =
    "HEARTH_CANVAS_FINGER_SURFACE_BISHOP_CANONICAL_MAP_TUPLE_PROOF_PACKET_v4_1";
  const SURFACE_TO_INSPECT_PACKET =
    "HEARTH_CANVAS_FINGER_SURFACE_BISHOP_TO_INSPECT_CHILD_PROOF_PACKET_v4_1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedBySurface: false,
    f13ClaimedByPointerSurface: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedBySurface: false,
    f21ClaimedByPointerSurface: false,
    f21ClaimedByDiagnosticRail: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedBySurface: false,
    readyTextClaimedByDiagnosticRail: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    downstreamReleaseClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
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
    F21_CLAIMED: false,
    F21_CLAIMED_BY_SURFACE: false,
    F21_CLAIMED_BY_POINTER_SURFACE: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_SUBMITTED_TO_NORTH: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_SURFACE: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const SURFACE_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH_SURFACE_FINGER",
    "HEARTH_POINTER_SURFACE_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET",

    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH.surfaceFinger",
    "HEARTH.pointerFingerSurface",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerSurfaceBishop",
    "HEARTH.canvasFingerSurfaceBishop",
    "HEARTH.canvasFingerSurfacePointerBishop",
    "HEARTH.canvasFingerSurfacePointerBishopInternalExternalExpressionSocket",

    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthPointerFingerSurface",
    "DEXTER_LAB.hearthSurfaceFinger",
    "DEXTER_LAB.hearthPointerSurfaceBishop",
    "DEXTER_LAB.hearthCanvasFingerSurfaceBishop",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointerBishop"
  ]);

  const HEX_SURFACE_ALIAS_PATHS = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE_BINDING_POINTER_TRANSMISSION",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexSurfaceCanonicalMapTupleBindingPointerTransmission",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceCanonicalMapTupleBindingPointerTransmission"
  ]);

  const INSPECT_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_SURFACE_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_GATE_POINTER_FINGER_INSPECT_RECEIVER",

    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspector",
    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerReceiver",
    "HEARTH.hexSurfacePointerFingerReceiver",
    "HEARTH.hexGatePointerFingerInspectReceiver",

    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerReceiver",
    "DEXTER_LAB.hearthHexSurfacePointerFingerReceiver"
  ]);

  const RECEIVER_METHODS = Object.freeze([
    "receiveHexSurfaceTransmissionPacket",
    "consumeHexSurfaceTransmissionPacket",
    "receivePointerFingerTransmissionPacket",
    "consumePointerFingerTransmissionPacket",
    "receiveCanvasFingerPacket",
    "consumeCanvasFingerPacket",
    "receiveHexGatePacket",
    "consumeHexGatePacket",
    "receiveFramePacket",
    "consumeFramePacket",
    "receiveSurfacePacket",
    "consumeSurfacePacket",
    "receiveBoundaryPacket",
    "receiveInspectPacket",
    "receiveLightPacket",
    "acceptHexGatePacket",
    "acceptTransmissionPacket",
    "receive"
  ]);

  const INSPECT_FORWARD_METHODS = Object.freeze([
    "receiveSurfacePacket",
    "consumeSurfacePacket",
    "receiveHexSurfaceTransmissionPacket",
    "consumeHexSurfaceTransmissionPacket",
    "receivePointerFingerTransmissionPacket",
    "consumePointerFingerTransmissionPacket",
    "receiveCanvasFingerPacket",
    "consumeCanvasFingerPacket",
    "receiveInspectPacket",
    "acceptTransmissionPacket",
    "receive"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",

    role: "POINTER_SURFACE_BISHOP_GATE_PRIMARY_CANONICAL_MAP_TUPLE_ENDPOINT",
    pointerSurfaceBishopGateActive: true,
    primaryPointerSurfaceEndpoint: true,
    inspectIsChildProofReceiver: true,
    inspectIsPrimaryEndpoint: false,
    hexSurfaceIsUpstreamGate: true,
    canvasIsOutputCarrier: true,

    receiverMethodCount: 0,
    receivedPacketCount: 0,
    acceptedPacketCount: 0,
    rejectedPacketCount: 0,
    rejectedNonObjectCount: 0,
    rejectedForbiddenClaimCount: 0,
    rejectedNonHexSourceCount: 0,
    rejectedMissingCanonicalTupleCount: 0,

    canonicalMapTupleReceivedCount: 0,
    surfaceExpressionRequestReceivedCount: 0,
    inspectForwardAttemptCount: 0,
    inspectForwardDeliveredCount: 0,
    inspectForwardSkippedCount: 0,

    hexSurfaceObserved: false,
    hexSurfaceSource: "NONE",
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceReceipt: "UNKNOWN",
    hexSurfaceRecognized: false,

    inspectChildObserved: false,
    inspectChildSource: "NONE",
    inspectChildContract: "UNKNOWN",
    inspectChildReceipt: "UNKNOWN",
    inspectChildMethod: "NONE",

    lastReceiveMethod: "NONE",
    lastReceivedAt: "",
    lastReceivedPacketType: "NONE",
    lastReceivedSourceFile: "NONE",
    lastReceivedSourceAuthority: "NONE",
    lastReceivedContract: "UNKNOWN",
    lastAcceptedAt: "",
    lastRejectedAt: "",
    lastRejectReason: "NONE",

    lastCanonicalMapTuple: null,
    lastSurfaceExpressionRequest: null,
    lastSurfaceProofPacket: null,
    lastInspectForwardPacket: null,
    lastInspectForwardStatus: "NOT_ATTEMPTED",
    lastInspectForwardMethod: "NONE",

    latestMapBindingStatus: "WAITING_HEX_SURFACE_PACKET",
    latestMapBindingSource: "NONE",
    latestMapBindingReason: "WAITING_HEX_SURFACE_PACKET",
    latestMapCellId: "NONE",
    latestMapStateId: "NONE",
    latestMapRow: "NONE",
    latestMapColumn: "NONE",
    latestMapU: "NONE",
    latestMapV: "NONE",
    latestMapLon: "NONE",
    latestMapLat: "NONE",

    firstFailedCoordinate: "WAITING_HEX_SURFACE_PACKET",
    recommendedNextFile: HEX_SURFACE_FILE,
    recommendedNextAction: "SEND_HEX_SURFACE_CANONICAL_MAP_TUPLE_POINTER_TRANSMISSION_PACKET",
    postgameStatus: "SURFACE_BISHOP_GATE_LOADED_WAITING_HEX_SURFACE_PACKET",

    lastReport: null,
    lastPacketText: "",
    lastCompactSummary: "",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

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
    try {
      return String(value);
    } catch (_error) {
      return fallback;
    }
  }

  function bounded(value, limit = 4000) {
    return safeString(value)
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, limit);
  }

  function safeKeys(value) {
    try {
      if (isObject(value) || isFunction(value)) return Object.keys(value);
    } catch (_error) {}
    return [];
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
        return JSON.stringify(value).slice(0, limit) || fallback;
      } catch (_error) {
        return bounded(value, Math.min(limit, 4000)) || fallback;
      }
    }

    return bounded(value, Math.min(limit, 4000)) || fallback;
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

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) {
      list.splice(0, list.length - max);
    }
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_FINGER_SURFACE_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 160);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_FINGER_SURFACE_ERROR"),
      message: bounded(error && error.message ? error.message : error, 1600),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 120);
    state.updatedAt = item.at;
    return item;
  }

  function readPath(path) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    let cursor = root;

    for (const part of parts) {
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).replace(/^window\./, "").split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!part) continue;
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && (isObject(value) || isFunction(value))) {
        return { path, value };
      }
    }

    return { path: "NONE", value: null };
  }

  function readField(source, keys, fallback = "") {
    const obj = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== "") return obj[key];

      const lower = key.toLowerCase();
      for (const candidate of safeKeys(obj)) {
        if (candidate.toLowerCase() === lower) {
          const value = obj[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function contractOf(value) {
    return firstKnown(
      readField(value, [
        "contract",
        "CONTRACT",
        "surfaceContract",
        "pointerSurfaceContract",
        "hexSurfaceContract",
        "canvasFingerSurfaceContract",
        "implementationContract",
        "internalImplementationContract",
        "internalRenewalContract",
        "sourceContract"
      ], ""),
      value && value.contract,
      value && value.CONTRACT
    );
  }

  function receiptOf(value) {
    return firstKnown(
      readField(value, [
        "receipt",
        "RECEIPT",
        "surfaceReceipt",
        "pointerSurfaceReceipt",
        "hexSurfaceReceipt",
        "canvasFingerSurfaceReceipt",
        "implementationReceipt",
        "internalImplementationReceipt",
        "internalRenewalReceipt",
        "sourceReceipt"
      ], ""),
      value && value.receipt,
      value && value.RECEIPT
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    if (authority === api) {
      return {
        contract: CONTRACT,
        receipt: RECEIPT,
        internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
        internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT
      };
    }

    const getters = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getSummary",
      "getHexSurfaceReceipt",
      "getFingerReceipt",
      "getPointerFingerReceipt",
      "getSurfaceFingerReceipt",
      "getCanvasFingerSurfaceReceipt"
    ];

    for (const getter of getters) {
      if (!isFunction(authority[getter])) continue;

      try {
        const output = getter === "getReceiptLight" ? authority[getter](false) : authority[getter]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.report)) return authority.report;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function summarizeAuthority(paths) {
    const found = firstGlobal(paths);
    const receipt = readAuthorityReceipt(found.value) || {};
    const contract = firstKnown(contractOf(receipt), contractOf(found.value));
    const receiptName = firstKnown(receiptOf(receipt), receiptOf(found.value));
    const methods = safeKeys(found.value).filter((key) => isFunction(found.value && found.value[key]));

    return {
      observed: Boolean(found.value),
      path: found.path,
      value: found.value,
      contract,
      receipt: receiptName,
      methodCount: methods.length,
      methods: methods.slice(0, 80)
    };
  }

  function hexSurfaceRecognized(contract) {
    const text = safeString(contract);
    return Boolean(
      text === EXPECTED_HEX_SURFACE_CONTRACT ||
      text === EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE ||
      text.includes("HEARTH_HEX_SURFACE")
    );
  }

  function inspectRecognized(contract) {
    const text = safeString(contract);
    return Boolean(
      text === EXPECTED_INSPECT_CONTRACT ||
      text.includes("HEARTH_CANVAS_FINGER_INSPECT")
    );
  }

  function refreshUpstreamAndChildAuthorities() {
    const hex = summarizeAuthority(HEX_SURFACE_ALIAS_PATHS);
    const inspect = summarizeAuthority(INSPECT_ALIAS_PATHS);

    state.hexSurfaceObserved = hex.observed;
    state.hexSurfaceSource = hex.path;
    state.hexSurfaceContract = hex.contract;
    state.hexSurfaceReceipt = hex.receipt;
    state.hexSurfaceRecognized = hexSurfaceRecognized(hex.contract);

    state.inspectChildObserved = inspect.observed;
    state.inspectChildSource = inspect.path;
    state.inspectChildContract = inspect.contract;
    state.inspectChildReceipt = inspect.receipt;
    state.inspectChildMethod = resolveFirstMethod(inspect.value, INSPECT_FORWARD_METHODS) || "NONE";

    return { hex, inspect };
  }

  function resolveFirstMethod(authority, methods) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

    for (const method of methods || []) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function hasForbiddenClaims(packet) {
    const p = isObject(packet) ? packet : {};

    return Boolean(
      p.f13Claimed === true ||
      p.f13CanvasClaimed === true ||
      p.f13ClaimedBySurface === true ||
      p.f13ClaimedByPointerSurface === true ||
      p.f21EligibleForNorth === true ||
      p.f21Claimed === true ||
      p.f21ClaimedBySurface === true ||
      p.f21ClaimedByPointerSurface === true ||
      p.f21ClaimedByDiagnosticRail === true ||
      p.f21SubmittedToNorth === true ||
      p.readyTextAllowed === true ||
      p.readyTextClaimed === true ||
      p.readyTextClaimedBySurface === true ||
      p.motionReadyClaimed === true ||
      p.touchReadyClaimed === true ||
      p.dragReadyClaimed === true ||
      p.downstreamReleaseClaimed === true ||
      p.completionLatched === true ||
      p.finalCompletionLatched === true ||
      p.degradedCompletionLatched === true ||
      p.visualPassClaimed === true ||
      p.finalVisualPassClaimed === true ||
      p.generatedImage === true ||
      p.graphicBox === true ||
      p.webGL === true ||
      p.webgl === true
    );
  }

  function packetLooksHexSurfaceSource(packet) {
    const p = isObject(packet) ? packet : {};
    const packetType = safeString(p.packetType || p.type || "");
    const sourceFile = safeString(p.sourceFile || p.fromFile || "");
    const sourceAuthority = safeString(p.sourceAuthority || p.sourceRole || p.role || p.authority || "");
    const contract = safeString(p.contract || p.CONTRACT || p.hexSurfaceContract || p.sourceContract || "");

    return Boolean(
      packetType === HEX_POINTER_TRANSMISSION_PACKET ||
      packetType.includes("HEARTH_HEX_SURFACE") ||
      sourceFile === HEX_SURFACE_FILE ||
      sourceFile.endsWith("/hearth.hex.surface.js") ||
      sourceAuthority.includes("HEARTH_HEX_SURFACE") ||
      sourceAuthority.toLowerCase().includes("hex-surface") ||
      contract === EXPECTED_HEX_SURFACE_CONTRACT ||
      contract === EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE ||
      contract.includes("HEARTH_HEX_SURFACE")
    );
  }

  function getCanonicalTupleCandidate(packet) {
    if (!isObject(packet)) return null;

    const candidates = [
      packet.canonicalMapTuple,
      packet.mapTuple,
      packet.hexMapTuple,
      packet.surfaceExpressionRequest && packet.surfaceExpressionRequest.canonicalMapTuple,
      packet.surfaceExpressionRequest && packet.surfaceExpressionRequest.mapTuple,
      packet.hexFramePacket && packet.hexFramePacket.canonicalMapTuple,
      packet.hexFramePacket && packet.hexFramePacket.mapTuple,
      packet.originalPacket && packet.originalPacket.canonicalMapTuple,
      packet.originalPacket && packet.originalPacket.mapTuple
    ];

    for (const candidate of candidates) {
      if (isCanonicalTupleObject(candidate)) {
        return {
          source: "CANONICAL_MAP_TUPLE_OBJECT",
          tuple: clonePlain(candidate)
        };
      }
    }

    if (hasTopLevelTupleFields(packet)) {
      return {
        source: "TOP_LEVEL_CANONICAL_MAP_FIELDS",
        tuple: extractTopLevelTuple(packet)
      };
    }

    return null;
  }

  function isCanonicalTupleObject(value) {
    if (!isObject(value)) return false;

    return Boolean(
      value.u !== undefined ||
      value.v !== undefined ||
      value.lon !== undefined ||
      value.lat !== undefined ||
      value.x !== undefined ||
      value.y !== undefined ||
      value.z !== undefined ||
      value.cellId !== undefined ||
      value.hexId !== undefined ||
      value.stateId !== undefined ||
      value.row !== undefined ||
      value.column !== undefined ||
      value.q !== undefined ||
      value.r !== undefined ||
      value.s !== undefined ||
      value.fourPair !== undefined ||
      value.fourPairSet !== undefined ||
      value.north !== undefined ||
      value.south !== undefined ||
      value.east !== undefined ||
      value.west !== undefined
    );
  }

  function hasTopLevelTupleFields(packet) {
    if (!isObject(packet)) return false;

    return Boolean(
      packet.u !== undefined ||
      packet.v !== undefined ||
      packet.lon !== undefined ||
      packet.lat !== undefined ||
      packet.x !== undefined ||
      packet.y !== undefined ||
      packet.z !== undefined ||
      packet.cellId !== undefined ||
      packet.hexId !== undefined ||
      packet.stateId !== undefined ||
      packet.row !== undefined ||
      packet.column !== undefined ||
      packet.q !== undefined ||
      packet.r !== undefined ||
      packet.s !== undefined ||
      packet.fourPair !== undefined ||
      packet.fourPairSet !== undefined ||
      packet.north !== undefined ||
      packet.south !== undefined ||
      packet.east !== undefined ||
      packet.west !== undefined
    );
  }

  function extractTopLevelTuple(packet) {
    const keys = [
      "u", "v", "lon", "lat", "x", "y", "z",
      "cellId", "hexId", "row", "column", "q", "r", "s",
      "stateId", "stateClass", "parity", "edgeRole",
      "gridColumns", "gridRows", "gridMode",
      "fourPair", "fourPairSet",
      "north", "south", "east", "west",
      "northSouthPair", "eastWestPair",
      "everyPixelHasNorthSouthEastWest",
      "everyPixelHasFourPairSet",
      "bodyBound", "surfaceBound",
      "floatsAboveBody", "allowedToFloat",
      "mapBindingStatus", "mapBindingSource", "mapBindingReason", "mapInputSource"
    ];

    const tuple = {
      tupleType: "HEARTH_HEX_SURFACE_CANONICAL_MAP_TUPLE",
      tupleSource: "TOP_LEVEL_CANONICAL_MAP_FIELDS_NO_DERIVATION"
    };

    for (const key of keys) {
      if (packet[key] !== undefined) tuple[key] = clonePlain(packet[key]);
    }

    return tuple;
  }

  function tupleField(tuple, key, fallback = "NONE") {
    if (!isObject(tuple)) return fallback;
    const value = tuple[key];
    if (value === undefined || value === null || value === "") return fallback;
    return safeString(value, fallback);
  }

  function updateTupleState(tuple, tupleSource) {
    state.lastCanonicalMapTuple = clonePlain(tuple);

    state.latestMapBindingStatus = firstKnown(tuple.mapBindingStatus, "CANONICAL_MAP_TUPLE_RECEIVED_BY_SURFACE_BISHOP");
    state.latestMapBindingSource = firstKnown(tuple.mapBindingSource, tupleSource, "HEX_SURFACE_TRANSMISSION");
    state.latestMapBindingReason = firstKnown(tuple.mapBindingReason, "CANONICAL_MAP_TUPLE_ACCEPTED_WITHOUT_DERIVATION");

    state.latestMapCellId = tupleField(tuple, "cellId");
    state.latestMapStateId = tupleField(tuple, "stateId");
    state.latestMapRow = tupleField(tuple, "row");
    state.latestMapColumn = tupleField(tuple, "column");
    state.latestMapU = tupleField(tuple, "u");
    state.latestMapV = tupleField(tuple, "v");
    state.latestMapLon = tupleField(tuple, "lon");
    state.latestMapLat = tupleField(tuple, "lat");
  }

  function validatePacket(packet, options = {}) {
    if (!isObject(packet)) {
      return {
        accepted: false,
        reason: "PACKET_NOT_OBJECT",
        tupleInfo: null
      };
    }

    if (hasForbiddenClaims(packet)) {
      return {
        accepted: false,
        reason: "PACKET_CONTAINS_FORBIDDEN_FINAL_OR_READY_CLAIM",
        tupleInfo: null
      };
    }

    if (!packetLooksHexSurfaceSource(packet) && options.allowDirect !== true) {
      return {
        accepted: false,
        reason: "PACKET_SOURCE_NOT_HEX_SURFACE",
        tupleInfo: null
      };
    }

    const tupleInfo = getCanonicalTupleCandidate(packet);

    if (!tupleInfo || !isCanonicalTupleObject(tupleInfo.tuple)) {
      return {
        accepted: false,
        reason: "CANONICAL_MAP_TUPLE_MISSING",
        tupleInfo: null
      };
    }

    return {
      accepted: true,
      reason: "SURFACE_BISHOP_ACCEPTED_HEX_CANONICAL_MAP_TUPLE_PACKET",
      tupleInfo
    };
  }

  function composeSurfaceProofPacket(packet, tupleInfo, method) {
    const tuple = tupleInfo && tupleInfo.tuple ? tupleInfo.tuple : {};
    const sourcePacketType = safeString(packet && (packet.packetType || packet.type), "UNKNOWN");

    return {
      packetType: SURFACE_PROOF_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
      sourceRole: "pointer-surface-bishop-primary-canonical-map-tuple-endpoint",
      receivedBy: method || "UNKNOWN",
      receivedSourcePacketType: sourcePacketType,
      receivedSourceFile: firstKnown(packet && packet.sourceFile, "UNKNOWN"),
      receivedSourceAuthority: firstKnown(packet && packet.sourceAuthority, packet && packet.sourceRole, "UNKNOWN"),
      receivedSourceContract: firstKnown(packet && packet.contract, packet && packet.CONTRACT, packet && packet.sourceContract, "UNKNOWN"),

      route: ROUTE,
      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      pointerSurfaceBishopGateActive: true,
      primaryPointerSurfaceEndpoint: true,
      inspectIsChildProofReceiver: true,
      inspectIsPrimaryEndpoint: false,
      hexSurfaceIsUpstreamGate: true,
      canvasIsOutputCarrier: true,

      canonicalMapTupleReceived: true,
      canonicalMapTupleSource: tupleInfo.source,
      canonicalMapTuplePreservedWithoutDerivation: true,
      canonicalMapTuple: clonePlain(tuple),
      mapTuple: clonePlain(tuple),

      u: tuple.u,
      v: tuple.v,
      lon: tuple.lon,
      lat: tuple.lat,
      x: tuple.x,
      y: tuple.y,
      z: tuple.z,
      cellId: tuple.cellId,
      hexId: tuple.hexId,
      row: tuple.row,
      column: tuple.column,
      q: tuple.q,
      r: tuple.r,
      s: tuple.s,
      stateId: tuple.stateId,
      stateClass: tuple.stateClass,

      fourPair: clonePlain(tuple.fourPair),
      fourPairSet: clonePlain(tuple.fourPairSet),
      north: clonePlain(tuple.north),
      south: clonePlain(tuple.south),
      east: clonePlain(tuple.east),
      west: clonePlain(tuple.west),
      northSouthPair: clonePlain(tuple.northSouthPair),
      eastWestPair: clonePlain(tuple.eastWestPair),

      surfaceExpressionRequest: clonePlain(packet && packet.surfaceExpressionRequest ? packet.surfaceExpressionRequest : {}),
      viewState: clonePlain(packet && packet.viewState ? packet.viewState : {}),
      projectionState: clonePlain(packet && packet.projectionState ? packet.projectionState : {}),

      originalHexSurfacePacket: clonePlain(packet),
      composedAt: nowIso(),

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS
    };
  }

  function composeInspectForwardPacket(surfaceProofPacket) {
    return {
      packetType: SURFACE_TO_INSPECT_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
      sourceRole: "surface-bishop-child-proof-forwarder",
      destinationFile: POINTER_FINGER_INSPECT_FILE,
      destinationRole: "inspect-child-proof-receiver",

      pointerSurfaceBishopGateActive: true,
      inspectIsChildProofReceiver: true,
      inspectIsPrimaryEndpoint: false,
      canonicalMapTuplePreservedWithoutDerivation: true,

      surfaceProofPacket: clonePlain(surfaceProofPacket),
      canonicalMapTuple: clonePlain(surfaceProofPacket.canonicalMapTuple || {}),
      mapTuple: clonePlain(surfaceProofPacket.mapTuple || {}),
      surfaceExpressionRequest: clonePlain(surfaceProofPacket.surfaceExpressionRequest || {}),
      viewState: clonePlain(surfaceProofPacket.viewState || {}),
      projectionState: clonePlain(surfaceProofPacket.projectionState || {}),

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function forwardToInspect(surfaceProofPacket) {
    const authorities = refreshUpstreamAndChildAuthorities();
    const inspect = authorities.inspect;

    state.inspectForwardAttemptCount += 1;

    if (!inspect.value) {
      state.inspectForwardSkippedCount += 1;
      state.lastInspectForwardStatus = "INSPECT_CHILD_NOT_OBSERVED_FORWARD_SKIPPED";
      state.lastInspectForwardMethod = "NONE";

      return {
        delivered: false,
        method: "NONE",
        status: state.lastInspectForwardStatus,
        reason: "INSPECT_CHILD_AUTHORITY_NOT_OBSERVED"
      };
    }

    const method = resolveFirstMethod(inspect.value, INSPECT_FORWARD_METHODS);

    if (!method) {
      state.inspectForwardSkippedCount += 1;
      state.lastInspectForwardStatus = "INSPECT_CHILD_RECEIVER_METHOD_MISSING_FORWARD_SKIPPED";
      state.lastInspectForwardMethod = "NONE";

      return {
        delivered: false,
        method: "NONE",
        status: state.lastInspectForwardStatus,
        reason: "INSPECT_CHILD_PUBLIC_RECEIVER_METHOD_MISSING"
      };
    }

    const forwardPacket = composeInspectForwardPacket(surfaceProofPacket);
    state.lastInspectForwardPacket = clonePlain(forwardPacket);

    try {
      const result = inspect.value[method](clonePlain(forwardPacket));

      state.inspectForwardDeliveredCount += 1;
      state.lastInspectForwardStatus = "INSPECT_CHILD_PROOF_FORWARD_DELIVERED";
      state.lastInspectForwardMethod = method;

      if (result && isFunction(result.then)) {
        result.catch((error) => {
          recordError("HEARTH_CANVAS_FINGER_SURFACE_INSPECT_ASYNC_FORWARD_FAILED", error, { method });
        });
      }

      return {
        delivered: true,
        method,
        status: state.lastInspectForwardStatus,
        reason: "SURFACE_PROOF_PACKET_DELIVERED_TO_INSPECT_CHILD_PUBLIC_API",
        resultObserved: isObject(result)
      };
    } catch (error) {
      recordError("HEARTH_CANVAS_FINGER_SURFACE_INSPECT_FORWARD_FAILED", error, { method });

      state.lastInspectForwardStatus = "INSPECT_CHILD_PROOF_FORWARD_THROWN";
      state.lastInspectForwardMethod = method;

      return {
        delivered: false,
        method,
        status: state.lastInspectForwardStatus,
        reason: "INSPECT_CHILD_PUBLIC_RECEIVER_THROWN"
      };
    }
  }

  function rejectPacket(packet, reason, method) {
    state.rejectedPacketCount += 1;
    state.lastRejectedAt = nowIso();
    state.lastRejectReason = reason;
    state.lastReceiveMethod = method || "UNKNOWN";
    state.lastReceivedPacketType = isObject(packet) ? safeString(packet.packetType || packet.type || "UNKNOWN") : "NON_OBJECT";
    state.firstFailedCoordinate = reason;
    state.recommendedNextFile =
      reason === "PACKET_SOURCE_NOT_HEX_SURFACE" ? HEX_SURFACE_FILE :
      reason === "CANONICAL_MAP_TUPLE_MISSING" ? HEX_SURFACE_FILE :
      FILE;
    state.recommendedNextAction =
      reason === "PACKET_SOURCE_NOT_HEX_SURFACE"
        ? "SEND_PACKET_FROM_HEX_SURFACE_PUBLIC_TRANSMISSION_API"
        : reason === "CANONICAL_MAP_TUPLE_MISSING"
          ? "CONFIRM_HEX_SURFACE_EXPOSES_CANONICAL_MAP_TUPLE_TOP_LEVEL_AND_OBJECT_FIELDS"
          : "REVIEW_SURFACE_BISHOP_PACKET_REJECTION";
    state.postgameStatus = "SURFACE_BISHOP_PACKET_REJECTED";

    if (reason === "PACKET_NOT_OBJECT") state.rejectedNonObjectCount += 1;
    if (reason === "PACKET_CONTAINS_FORBIDDEN_FINAL_OR_READY_CLAIM") state.rejectedForbiddenClaimCount += 1;
    if (reason === "PACKET_SOURCE_NOT_HEX_SURFACE") state.rejectedNonHexSourceCount += 1;
    if (reason === "CANONICAL_MAP_TUPLE_MISSING") state.rejectedMissingCanonicalTupleCount += 1;

    record("HEARTH_CANVAS_FINGER_SURFACE_PACKET_REJECTED", {
      method,
      reason,
      packetType: state.lastReceivedPacketType
    });

    publishReport(buildReport({ reason: `REJECT:${reason}` }));

    return {
      ok: false,
      accepted: false,
      contract: CONTRACT,
      receipt: RECEIPT,
      rejectReason: reason,
      method: method || "UNKNOWN",
      report: clonePlain(state.lastReport || {}),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function acceptSurfacePacket(packet, method, options = {}) {
    state.receivedPacketCount += 1;
    state.lastReceiveMethod = method || "UNKNOWN";
    state.lastReceivedAt = nowIso();
    state.lastReceivedPacketType = safeString(packet.packetType || packet.type || "UNKNOWN");
    state.lastReceivedSourceFile = firstKnown(packet.sourceFile, packet.fromFile, "UNKNOWN");
    state.lastReceivedSourceAuthority = firstKnown(packet.sourceAuthority, packet.sourceRole, packet.role, "UNKNOWN");
    state.lastReceivedContract = firstKnown(packet.contract, packet.CONTRACT, packet.sourceContract, "UNKNOWN");

    const validation = validatePacket(packet, options);

    if (!validation.accepted) {
      return rejectPacket(packet, validation.reason, method);
    }

    const tupleInfo = validation.tupleInfo;
    const tuple = tupleInfo.tuple;

    state.acceptedPacketCount += 1;
    state.canonicalMapTupleReceivedCount += 1;
    state.lastAcceptedAt = nowIso();

    if (isObject(packet.surfaceExpressionRequest)) {
      state.surfaceExpressionRequestReceivedCount += 1;
      state.lastSurfaceExpressionRequest = clonePlain(packet.surfaceExpressionRequest);
    }

    updateTupleState(tuple, tupleInfo.source);

    const proofPacket = composeSurfaceProofPacket(packet, tupleInfo, method);
    const inspectForward = forwardToInspect(proofPacket);

    state.lastSurfaceProofPacket = clonePlain(proofPacket);
    state.firstFailedCoordinate = "NONE_SURFACE_BISHOP_ACCEPTED_CANONICAL_MAP_TUPLE";
    state.recommendedNextFile = inspectForward.delivered ? POINTER_FINGER_INSPECT_FILE : POINTER_FINGER_INSPECT_FILE;
    state.recommendedNextAction = inspectForward.delivered
      ? "REVIEW_INSPECT_CHILD_PROOF_AND_CANVAS_PIXEL_WRITE_PATH_WITHOUT_VISUAL_PASS_CLAIM"
      : "CONFIRM_INSPECT_CHILD_PUBLIC_RECEIVER_OR_CONTINUE_SURFACE_BISHOP_PACKET_AUDIT";
    state.postgameStatus = inspectForward.delivered
      ? "SURFACE_BISHOP_ACCEPTED_CANONICAL_MAP_TUPLE_AND_FORWARDED_CHILD_PROOF_TO_INSPECT"
      : "SURFACE_BISHOP_ACCEPTED_CANONICAL_MAP_TUPLE_INSPECT_CHILD_FORWARD_NOT_CONFIRMED";

    record("HEARTH_CANVAS_FINGER_SURFACE_ACCEPTED_HEX_CANONICAL_MAP_TUPLE", {
      method,
      packetType: state.lastReceivedPacketType,
      tupleSource: tupleInfo.source,
      cellId: state.latestMapCellId,
      stateId: state.latestMapStateId,
      inspectForwardStatus: inspectForward.status
    });

    const report = buildReport({ reason: `ACCEPT:${method}` });
    publishReport(report);

    return {
      ok: true,
      accepted: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      method,
      surfaceProofPacket: clonePlain(proofPacket),
      canonicalMapTuple: clonePlain(tuple),
      inspectForward: clonePlain(inspectForward),
      report: clonePlain(report),
      packetText: state.lastPacketText,
      compactSummary: state.lastCompactSummary,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function receivePacket(packet, method, options = {}) {
    try {
      if (!isObject(packet)) {
        state.receivedPacketCount += 1;
        return rejectPacket(packet, "PACKET_NOT_OBJECT", method);
      }

      return acceptSurfacePacket(packet, method, options);
    } catch (error) {
      recordError("HEARTH_CANVAS_FINGER_SURFACE_RECEIVE_PACKET_TOP_LEVEL_ERROR", error, { method });

      return rejectPacket(
        packet,
        `SURFACE_BISHOP_RECEIVE_ERROR:${bounded(error && error.message ? error.message : error, 800)}`,
        method
      );
    }
  }

  function receiveHexSurfaceTransmissionPacket(packet, options = {}) {
    return receivePacket(packet, "receiveHexSurfaceTransmissionPacket", options);
  }

  function consumeHexSurfaceTransmissionPacket(packet, options = {}) {
    return receivePacket(packet, "consumeHexSurfaceTransmissionPacket", options);
  }

  function receivePointerFingerTransmissionPacket(packet, options = {}) {
    return receivePacket(packet, "receivePointerFingerTransmissionPacket", options);
  }

  function consumePointerFingerTransmissionPacket(packet, options = {}) {
    return receivePacket(packet, "consumePointerFingerTransmissionPacket", options);
  }

  function receiveCanvasFingerPacket(packet, options = {}) {
    return receivePacket(packet, "receiveCanvasFingerPacket", options);
  }

  function consumeCanvasFingerPacket(packet, options = {}) {
    return receivePacket(packet, "consumeCanvasFingerPacket", options);
  }

  function receiveHexGatePacket(packet, options = {}) {
    return receivePacket(packet, "receiveHexGatePacket", options);
  }

  function consumeHexGatePacket(packet, options = {}) {
    return receivePacket(packet, "consumeHexGatePacket", options);
  }

  function receiveFramePacket(packet, options = {}) {
    return receivePacket(packet, "receiveFramePacket", options);
  }

  function consumeFramePacket(packet, options = {}) {
    return receivePacket(packet, "consumeFramePacket", options);
  }

  function receiveSurfacePacket(packet, options = {}) {
    return receivePacket(packet, "receiveSurfacePacket", options);
  }

  function consumeSurfacePacket(packet, options = {}) {
    return receivePacket(packet, "consumeSurfacePacket", options);
  }

  function receiveBoundaryPacket(packet, options = {}) {
    return receivePacket(packet, "receiveBoundaryPacket", options);
  }

  function receiveInspectPacket(packet, options = {}) {
    return receivePacket(packet, "receiveInspectPacket", options);
  }

  function receiveLightPacket(packet, options = {}) {
    return receivePacket(packet, "receiveLightPacket", options);
  }

  function acceptHexGatePacket(packet, options = {}) {
    return receivePacket(packet, "acceptHexGatePacket", options);
  }

  function acceptTransmissionPacket(packet, options = {}) {
    return receivePacket(packet, "acceptTransmissionPacket", options);
  }

  function receive(packet, options = {}) {
    return receivePacket(packet, "receive", options);
  }

  function composeDiagnosticFields() {
    refreshUpstreamAndChildAuthorities();

    return {
      POINTER_SURFACE_FILE: FILE,
      POINTER_SURFACE_BISHOP_FILE: FILE,
      POINTER_SURFACE_BISHOP_CONTRACT: CONTRACT,
      POINTER_SURFACE_BISHOP_RECEIPT: RECEIPT,
      POINTER_SURFACE_BISHOP_INTERNAL_IMPLEMENTATION_CONTRACT: INTERNAL_IMPLEMENTATION_CONTRACT,
      POINTER_SURFACE_BISHOP_INTERNAL_IMPLEMENTATION_RECEIPT: INTERNAL_IMPLEMENTATION_RECEIPT,

      POINTER_SURFACE_BISHOP_OBSERVED: "true",
      POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT: "true",
      POINTER_SURFACE_BISHOP_SCRIPT_PRESENT: "true",
      POINTER_SURFACE_BISHOP_RECOGNIZED: "true",
      POINTER_SURFACE_BISHOP_STATUS: state.acceptedPacketCount > 0
        ? "ACCEPTED_HEX_CANONICAL_MAP_TUPLE"
        : "READY_WAITING_HEX_SURFACE_PACKET",

      SURFACE_FINGER_STATUS: state.postgameStatus,
      SURFACE_FINGER_ROLE: "BISHOP_GATE_PRIMARY_POINTER_SURFACE_ENDPOINT",
      SURFACE_FINGER_AUTHORITY: "CANONICAL_MAP_TUPLE_RECEIPT_AND_SURFACE_PROOF_ONLY",
      SURFACE_FINGER_IS_PRIMARY_POINTER_ENDPOINT: "true",
      SURFACE_FINGER_IS_INSPECT: "false",
      INSPECT_FILE_DEMOTED_TO_CHILD_PROOF_RECEIVER: "true",
      HEX_SURFACE_IS_UPSTREAM_GATE: "true",
      CANVAS_IS_OUTPUT_CARRIER: "true",

      RECEIVER_METHOD_COUNT: String(state.receiverMethodCount),
      RECEIVED_PACKET_COUNT: String(state.receivedPacketCount),
      ACCEPTED_PACKET_COUNT: String(state.acceptedPacketCount),
      REJECTED_PACKET_COUNT: String(state.rejectedPacketCount),

      HEX_SURFACE_OBSERVED: String(state.hexSurfaceObserved),
      HEX_SURFACE_SOURCE: state.hexSurfaceSource,
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract,
      HEX_SURFACE_RECEIPT: state.hexSurfaceReceipt,
      HEX_SURFACE_RECOGNIZED: String(state.hexSurfaceRecognized),

      INSPECT_CHILD_OBSERVED: String(state.inspectChildObserved),
      INSPECT_CHILD_SOURCE: state.inspectChildSource,
      INSPECT_CHILD_CONTRACT: state.inspectChildContract,
      INSPECT_CHILD_RECEIPT: state.inspectChildReceipt,
      INSPECT_CHILD_METHOD: state.inspectChildMethod,

      HEX_SURFACE_PACKET_RECEIVED: String(state.acceptedPacketCount > 0),
      CANONICAL_MAP_TUPLE_RECEIVED: String(state.canonicalMapTupleReceivedCount > 0),
      SURFACE_EXPRESSION_REQUEST_RECEIVED: String(state.surfaceExpressionRequestReceivedCount > 0),
      CANONICAL_MAP_TUPLE_PRESERVED_WITHOUT_DERIVATION: String(state.canonicalMapTupleReceivedCount > 0),

      LAST_RECEIVE_METHOD: state.lastReceiveMethod,
      LAST_RECEIVED_AT: state.lastReceivedAt || "NONE",
      LAST_RECEIVED_PACKET_TYPE: state.lastReceivedPacketType,
      LAST_RECEIVED_SOURCE_FILE: state.lastReceivedSourceFile,
      LAST_RECEIVED_SOURCE_AUTHORITY: state.lastReceivedSourceAuthority,
      LAST_RECEIVED_CONTRACT: state.lastReceivedContract,
      LAST_REJECT_REASON: state.lastRejectReason,

      LATEST_MAP_BINDING_STATUS: state.latestMapBindingStatus,
      LATEST_MAP_BINDING_SOURCE: state.latestMapBindingSource,
      LATEST_MAP_BINDING_REASON: state.latestMapBindingReason,
      LAST_CELL_ID: state.latestMapCellId,
      LAST_STATE_ID: state.latestMapStateId,
      LAST_ROW: state.latestMapRow,
      LAST_COLUMN: state.latestMapColumn,
      LAST_U: state.latestMapU,
      LAST_V: state.latestMapV,
      LAST_LON: state.latestMapLon,
      LAST_LAT: state.latestMapLat,

      INSPECT_FORWARD_ATTEMPT_COUNT: String(state.inspectForwardAttemptCount),
      INSPECT_FORWARD_DELIVERED_COUNT: String(state.inspectForwardDeliveredCount),
      INSPECT_FORWARD_SKIPPED_COUNT: String(state.inspectForwardSkippedCount),
      INSPECT_CHILD_FORWARD_STATUS: state.lastInspectForwardStatus,
      INSPECT_CHILD_FORWARD_METHOD: state.lastInspectForwardMethod,

      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      POSTGAME_STATUS: state.postgameStatus,

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_REPAIR_AUTHORIZED: "false",
      CANVAS_RELEASE_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      f13Claimed: "false",
      f21EligibleForNorth: "false",
      f21Claimed: "false",
      f21ClaimedBySurface: "false",
      readyTextAllowed: "false",
      readyTextClaimed: "false",
      visualPassClaimed: "false",
      finalVisualPassClaimed: "false",
      generatedImage: "false",
      graphicBox: "false",
      webGL: "false",
      webgl: "false"
    };
  }

  function buildReport(input = {}) {
    const fields = composeDiagnosticFields();
    const notes = [
      "SURFACE_FINGER_BISHOP_GATE_ACTIVE",
      "PRIMARY_POINTER_SURFACE_ENDPOINT_PUBLISHED",
      "HEX_SURFACE_REMAINS_UPSTREAM_CANONICAL_MAP_TUPLE_GATE",
      "INSPECT_FILE_IS_CHILD_PROOF_RECEIVER_NOT_PRIMARY_ENDPOINT",
      "CANONICAL_MAP_TUPLE_PRESERVED_WITHOUT_DERIVATION",
      "NO_BASELINE_MAPPING_USED",
      "NO_COORDINATE_SYNTHESIS",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_CREATION",
      "NO_CANVAS_REPAIR",
      "NO_CANVAS_RELEASE",
      "NO_ROUTE_REPAIR",
      "NO_CONTROL_MUTATION",
      "NO_RUNTIME_RESTART",
      "NO_FINAL_VISUAL_PASS_CLAIM",
      `HEX_SURFACE_OBSERVED:${state.hexSurfaceObserved}`,
      `INSPECT_CHILD_OBSERVED:${state.inspectChildObserved}`,
      `ACCEPTED_PACKET_COUNT:${state.acceptedPacketCount}`,
      `CANONICAL_MAP_TUPLE_RECEIVED_COUNT:${state.canonicalMapTupleReceivedCount}`,
      `INSPECT_FORWARD_STATUS:${state.lastInspectForwardStatus}`
    ];

    return {
      PACKET_NAME: "HEARTH_CANVAS_FINGER_SURFACE_BISHOP_GATE_REPORT_PACKET_v4_1",
      CONTRACT,
      RECEIPT,
      INTERNAL_IMPLEMENTATION_CONTRACT,
      INTERNAL_IMPLEMENTATION_RECEIPT,
      VERSION,
      FILE,
      ROUTE,
      TARGET_ROUTE: ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: firstKnown(input.diagnosticTimestamp, nowIso()),
      REPORT_REASON: firstKnown(input.reason, "SURFACE_BISHOP_REPORT"),

      CANVAS_FILE,
      HEX_SURFACE_FILE,
      HEX_AUTHORITY_FILE,
      POINTER_FINGER_BOUNDARY_FILE,
      POINTER_FINGER_INSPECT_FILE,
      POINTER_FINGER_LIGHT_FILE,

      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE,
      EXPECTED_INSPECT_CONTRACT,

      ...fields,

      LAST_CANONICAL_MAP_TUPLE: clonePlain(state.lastCanonicalMapTuple || {}),
      LAST_SURFACE_EXPRESSION_REQUEST: clonePlain(state.lastSurfaceExpressionRequest || {}),
      LAST_SURFACE_PROOF_PACKET: clonePlain(state.lastSurfaceProofPacket || {}),
      LAST_INSPECT_FORWARD_PACKET: clonePlain(state.lastInspectForwardPacket || {}),
      EVENTS: clonePlain(state.events.slice(-20)),
      ERRORS: clonePlain(state.errors.slice(-20)),

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function orderedFields(report) {
    const priority = [
      "PACKET_NAME",
      "CONTRACT",
      "RECEIPT",
      "INTERNAL_IMPLEMENTATION_CONTRACT",
      "INTERNAL_IMPLEMENTATION_RECEIPT",
      "VERSION",
      "FILE",
      "ROUTE",
      "TARGET_ROUTE",
      "DIAGNOSTIC_ROUTE",
      "DIAGNOSTIC_TIMESTAMP",
      "REPORT_REASON",

      "POINTER_SURFACE_BISHOP_OBSERVED",
      "POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT",
      "POINTER_SURFACE_BISHOP_SCRIPT_PRESENT",
      "POINTER_SURFACE_BISHOP_CONTRACT",
      "POINTER_SURFACE_BISHOP_RECOGNIZED",
      "POINTER_SURFACE_BISHOP_STATUS",

      "SURFACE_FINGER_STATUS",
      "SURFACE_FINGER_ROLE",
      "SURFACE_FINGER_AUTHORITY",
      "SURFACE_FINGER_IS_PRIMARY_POINTER_ENDPOINT",
      "SURFACE_FINGER_IS_INSPECT",
      "INSPECT_FILE_DEMOTED_TO_CHILD_PROOF_RECEIVER",
      "HEX_SURFACE_IS_UPSTREAM_GATE",
      "CANVAS_IS_OUTPUT_CARRIER",

      "RECEIVER_METHOD_COUNT",
      "RECEIVED_PACKET_COUNT",
      "ACCEPTED_PACKET_COUNT",
      "REJECTED_PACKET_COUNT",

      "HEX_SURFACE_OBSERVED",
      "HEX_SURFACE_SOURCE",
      "HEX_SURFACE_CONTRACT",
      "HEX_SURFACE_RECOGNIZED",

      "INSPECT_CHILD_OBSERVED",
      "INSPECT_CHILD_SOURCE",
      "INSPECT_CHILD_CONTRACT",
      "INSPECT_CHILD_METHOD",

      "HEX_SURFACE_PACKET_RECEIVED",
      "CANONICAL_MAP_TUPLE_RECEIVED",
      "SURFACE_EXPRESSION_REQUEST_RECEIVED",
      "CANONICAL_MAP_TUPLE_PRESERVED_WITHOUT_DERIVATION",

      "LAST_RECEIVE_METHOD",
      "LAST_RECEIVED_AT",
      "LAST_RECEIVED_PACKET_TYPE",
      "LAST_RECEIVED_SOURCE_FILE",
      "LAST_RECEIVED_SOURCE_AUTHORITY",
      "LAST_REJECT_REASON",

      "LATEST_MAP_BINDING_STATUS",
      "LATEST_MAP_BINDING_SOURCE",
      "LATEST_MAP_BINDING_REASON",
      "LAST_CELL_ID",
      "LAST_STATE_ID",
      "LAST_ROW",
      "LAST_COLUMN",
      "LAST_U",
      "LAST_V",
      "LAST_LON",
      "LAST_LAT",

      "INSPECT_FORWARD_ATTEMPT_COUNT",
      "INSPECT_FORWARD_DELIVERED_COUNT",
      "INSPECT_FORWARD_SKIPPED_COUNT",
      "INSPECT_CHILD_FORWARD_STATUS",
      "INSPECT_CHILD_FORWARD_METHOD",

      "FIRST_FAILED_COORDINATE",
      "RECOMMENDED_NEXT_FILE",
      "RECOMMENDED_NEXT_ACTION",
      "POSTGAME_STATUS",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "CANVAS_RELEASE_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "FINAL_VISUAL_PASS_AUTHORITY",

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
      .map((field) => line(field, report[field]))
      .join("\n");
  }

  function composeCompactSummary(report) {
    return [
      line("CONTRACT", CONTRACT),
      line("INTERNAL_IMPLEMENTATION_CONTRACT", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT", report.POINTER_SURFACE_BISHOP_AUTHORITY_PRESENT),
      line("POINTER_SURFACE_BISHOP_CONTRACT", report.POINTER_SURFACE_BISHOP_CONTRACT),
      line("SURFACE_FINGER_ROLE", report.SURFACE_FINGER_ROLE),
      line("HEX_SURFACE_PACKET_RECEIVED", report.HEX_SURFACE_PACKET_RECEIVED),
      line("CANONICAL_MAP_TUPLE_RECEIVED", report.CANONICAL_MAP_TUPLE_RECEIVED),
      line("LAST_CELL_ID", report.LAST_CELL_ID),
      line("LAST_STATE_ID", report.LAST_STATE_ID),
      line("INSPECT_CHILD_FORWARD_STATUS", report.INSPECT_CHILD_FORWARD_STATUS),
      line("RECOMMENDED_NEXT_FILE", report.RECOMMENDED_NEXT_FILE),
      line("RECOMMENDED_NEXT_ACTION", report.RECOMMENDED_NEXT_ACTION),
      line("VISUAL_PASS_CLAIMED", false)
    ].join("\n");
  }

  function publishReport(report) {
    state.lastReport = clonePlain(report);
    state.lastPacketText = composePacketText(report);
    state.lastCompactSummary = composeCompactSummary(report);

    publishAliases();
    publishReceiptAliases();
    updateDataset();

    return true;
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const ds = doc.documentElement.dataset;

    ds.hearthCanvasFingerSurfaceLoaded = "true";
    ds.hearthCanvasFingerSurfacePresent = "true";
    ds.hearthCanvasFingerSurfaceContract = CONTRACT;
    ds.hearthCanvasFingerSurfaceReceipt = RECEIPT;
    ds.hearthCanvasFingerSurfaceInternalImplementationContract = INTERNAL_IMPLEMENTATION_CONTRACT;
    ds.hearthCanvasFingerSurfaceInternalImplementationReceipt = INTERNAL_IMPLEMENTATION_RECEIPT;
    ds.hearthPointerSurfaceBishopActive = "true";
    ds.hearthPointerSurfaceBishopFile = FILE;
    ds.hearthPointerSurfaceBishopContract = CONTRACT;
    ds.hearthPointerSurfaceBishopAuthorityPresent = "true";
    ds.hearthPointerSurfaceBishopRecognized = "true";
    ds.hearthPointerInspectIsChildProofReceiver = "true";
    ds.hearthPointerInspectIsPrimaryEndpoint = "false";
    ds.hearthSurfaceFingerReceivedPacketCount = String(state.receivedPacketCount);
    ds.hearthSurfaceFingerAcceptedPacketCount = String(state.acceptedPacketCount);
    ds.hearthSurfaceFingerCanonicalTupleReceivedCount = String(state.canonicalMapTupleReceivedCount);
    ds.hearthSurfaceFingerInspectForwardStatus = state.lastInspectForwardStatus;
    ds.hearthSurfaceFingerLatestMapCellId = state.latestMapCellId;
    ds.hearthSurfaceFingerLatestMapStateId = state.latestMapStateId;
    ds.hearthSurfaceFingerPostgameStatus = state.postgameStatus;
    ds.hearthSurfaceFingerVisualPassClaimed = "false";
    ds.generatedImage = "false";
    ds.graphicBox = "false";
    ds.webgl = "false";
    ds.visualPassClaimed = "false";

    return true;
  }

  function publishAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    for (const path of SURFACE_ALIAS_PATHS) {
      setPath(path, api);
    }

    return true;
  }

  function publishReceiptAliases() {
    const report = state.lastReport || buildReport({ reason: "RECEIPT_ALIAS_PUBLISH" });
    const receipt = getReceiptLight(false);

    root.HEARTH_CANVAS_FINGER_SURFACE_RECEIPT = receipt;
    root.HEARTH_CANVAS_POINTER_FINGER_SURFACE_RECEIPT = receipt;
    root.HEARTH_POINTER_FINGER_SURFACE_RECEIPT = receipt;
    root.HEARTH_POINTER_SURFACE_BISHOP_RECEIPT = receipt;
    root.HEARTH_CANVAS_FINGER_SURFACE_REPORT = clonePlain(report);
    root.HEARTH_POINTER_SURFACE_BISHOP_REPORT = clonePlain(report);
    root.HEARTH_CANVAS_FINGER_SURFACE_PACKET_TEXT = state.lastPacketText || composePacketText(report);
    root.HEARTH_POINTER_SURFACE_BISHOP_PACKET_TEXT = state.lastPacketText || composePacketText(report);

    root.HEARTH.pointerSurfaceBishopReceipt = receipt;
    root.HEARTH.canvasFingerSurfaceReceipt = receipt;
    root.HEARTH.pointerFingerSurfaceReceipt = receipt;
    root.HEARTH.pointerSurfaceBishopReport = clonePlain(report);
    root.HEARTH.canvasFingerSurfaceReport = clonePlain(report);

    root.DEXTER_LAB.hearthPointerSurfaceBishopReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasFingerSurfaceReceipt = receipt;
    root.DEXTER_LAB.hearthPointerFingerSurfaceReceipt = receipt;
    root.DEXTER_LAB.hearthPointerSurfaceBishopReport = clonePlain(report);

    return true;
  }

  function getReceiptLight(refresh = false) {
    if (refresh) refreshUpstreamAndChildAuthorities();

    return {
      role: "POINTER_SURFACE_BISHOP_GATE_PRIMARY_CANONICAL_MAP_TUPLE_ENDPOINT",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      targetRoute: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedHexSurfaceRenewalCandidate: EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE,
      expectedInspectContract: EXPECTED_INSPECT_CONTRACT,

      loaded: true,
      booted: state.booted,
      disposed: state.disposed,

      pointerSurfaceBishopGateActive: true,
      primaryPointerSurfaceEndpoint: true,
      pointerFingerSurface: true,
      pointerFingerItself: true,
      inspectIsChildProofReceiver: true,
      inspectIsPrimaryEndpoint: false,
      hexSurfaceIsUpstreamGate: true,
      canvasIsOutputCarrier: true,

      receiverMethodCount: state.receiverMethodCount,
      receiverMethods: RECEIVER_METHODS.slice(),

      receivedPacketCount: state.receivedPacketCount,
      acceptedPacketCount: state.acceptedPacketCount,
      rejectedPacketCount: state.rejectedPacketCount,
      canonicalMapTupleReceivedCount: state.canonicalMapTupleReceivedCount,
      surfaceExpressionRequestReceivedCount: state.surfaceExpressionRequestReceivedCount,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceRecognized: state.hexSurfaceRecognized,

      inspectChildObserved: state.inspectChildObserved,
      inspectChildSource: state.inspectChildSource,
      inspectChildContract: state.inspectChildContract,
      inspectChildReceipt: state.inspectChildReceipt,
      inspectChildMethod: state.inspectChildMethod,
      inspectForwardAttemptCount: state.inspectForwardAttemptCount,
      inspectForwardDeliveredCount: state.inspectForwardDeliveredCount,
      inspectForwardSkippedCount: state.inspectForwardSkippedCount,
      lastInspectForwardStatus: state.lastInspectForwardStatus,
      lastInspectForwardMethod: state.lastInspectForwardMethod,

      lastReceiveMethod: state.lastReceiveMethod,
      lastReceivedAt: state.lastReceivedAt || "NONE",
      lastReceivedPacketType: state.lastReceivedPacketType,
      lastReceivedSourceFile: state.lastReceivedSourceFile,
      lastReceivedSourceAuthority: state.lastReceivedSourceAuthority,
      lastReceivedContract: state.lastReceivedContract,
      lastRejectReason: state.lastRejectReason,

      latestMapBindingStatus: state.latestMapBindingStatus,
      latestMapBindingSource: state.latestMapBindingSource,
      latestMapBindingReason: state.latestMapBindingReason,
      latestMapCellId: state.latestMapCellId,
      latestMapStateId: state.latestMapStateId,
      latestMapRow: state.latestMapRow,
      latestMapColumn: state.latestMapColumn,
      latestMapU: state.latestMapU,
      latestMapV: state.latestMapV,
      latestMapLon: state.latestMapLon,
      latestMapLat: state.latestMapLat,
      lastCanonicalMapTuple: clonePlain(state.lastCanonicalMapTuple || {}),

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      canvasReleaseAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      finalVisualPassAuthority: false,

      ownsSurfaceBishopGate: true,
      ownsSurfaceReceiptPublication: true,
      ownsCanonicalMapTupleReceipt: true,
      ownsInspectChildProofForwarding: true,

      ownsCanvasDrawing: false,
      ownsCanvasCreation: false,
      ownsCanvasLifecycle: false,
      ownsCanvasRelease: false,
      ownsHexSurfaceTruth: false,
      ownsHexAuthorityTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      CANVAS_FINGER_SURFACE_CONTRACT: CONTRACT,
      CANVAS_FINGER_SURFACE_RECEIPT: RECEIPT,
      POINTER_SURFACE_BISHOP_CONTRACT: CONTRACT,
      POINTER_SURFACE_BISHOP_RECEIPT: RECEIPT,
      reportObject: clonePlain(state.lastReport || buildReport({ reason: "GET_RECEIPT_REPORT" })),
      lastSurfaceProofPacket: clonePlain(state.lastSurfaceProofPacket || {}),
      lastInspectForwardPacket: clonePlain(state.lastInspectForwardPacket || {}),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      ...UPPER_NO_CLAIMS
    };
  }

  function getReport(options = {}) {
    if (options && options.refresh === false && state.lastReport) {
      return clonePlain(state.lastReport);
    }

    const report = buildReport({ reason: "GET_REPORT_REFRESH" });
    publishReport(report);
    return clonePlain(report);
  }

  function getPacketText(options = {}) {
    if (options && options.refresh === false && state.lastPacketText) return state.lastPacketText;
    getReport();
    return state.lastPacketText;
  }

  function getCompactSummary(options = {}) {
    if (options && options.refresh === false && state.lastCompactSummary) return state.lastCompactSummary;
    getReport();
    return state.lastCompactSummary;
  }

  function getState() {
    return {
      ...clonePlain(state),
      diagnosticFields: composeDiagnosticFields(),
      ...NO_CLAIMS
    };
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("pointerSurfaceBishopGateActive", r.pointerSurfaceBishopGateActive),
      line("primaryPointerSurfaceEndpoint", r.primaryPointerSurfaceEndpoint),
      line("inspectIsChildProofReceiver", r.inspectIsChildProofReceiver),
      line("hexSurfaceIsUpstreamGate", r.hexSurfaceIsUpstreamGate),
      line("receiverMethodCount", r.receiverMethodCount),
      line("acceptedPacketCount", r.acceptedPacketCount),
      line("canonicalMapTupleReceivedCount", r.canonicalMapTupleReceivedCount),
      line("latestMapBindingStatus", r.latestMapBindingStatus),
      line("latestMapCellId", r.latestMapCellId),
      line("latestMapStateId", r.latestMapStateId),
      line("lastInspectForwardStatus", r.lastInspectForwardStatus),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function refresh() {
    refreshUpstreamAndChildAuthorities();
    publishReport(buildReport({ reason: "REFRESH" }));
    return getReceiptLight(false);
  }

  function boot() {
    if (state.booted) return getReceipt();

    state.booted = true;
    state.startedAt = nowIso();
    state.updatedAt = state.startedAt;

    refreshUpstreamAndChildAuthorities();
    publishAliases();
    updateDataset();

    state.postgameStatus = "SURFACE_BISHOP_GATE_BOOTED_WAITING_HEX_SURFACE_PACKET";

    record("HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_BOOTED", {
      contract: CONTRACT,
      file: FILE,
      receiverMethodCount: state.receiverMethodCount,
      hexSurfaceObserved: state.hexSurfaceObserved,
      inspectChildObserved: state.inspectChildObserved,
      visualPassClaimed: false
    });

    publishReport(buildReport({ reason: "BOOT" }));
    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.postgameStatus = "SURFACE_BISHOP_GATE_DISPOSED";
    state.recommendedNextAction = "REBOOT_SURFACE_BISHOP_GATE_IF_HEX_TRANSMISSION_REQUIRED";

    record("HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_DISPOSED", { reason });
    publishReport(buildReport({ reason: "DISPOSE" }));

    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    targetRoute: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    canvasFile: CANVAS_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerSurfaceFile: FILE,
    pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
    pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
    pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedHexSurfaceRenewalCandidate: EXPECTED_HEX_SURFACE_RENEWAL_CANDIDATE,
    expectedInspectContract: EXPECTED_INSPECT_CONTRACT,

    hexPointerTransmissionPacket: HEX_POINTER_TRANSMISSION_PACKET,
    surfaceProofPacket: SURFACE_PROOF_PACKET,
    surfaceToInspectPacket: SURFACE_TO_INSPECT_PACKET,

    boot,
    start: boot,
    init: boot,
    run: boot,
    refresh,
    dispose,

    receiveHexSurfaceTransmissionPacket,
    consumeHexSurfaceTransmissionPacket,
    receivePointerFingerTransmissionPacket,
    consumePointerFingerTransmissionPacket,
    receiveCanvasFingerPacket,
    consumeCanvasFingerPacket,
    receiveHexGatePacket,
    consumeHexGatePacket,
    receiveFramePacket,
    consumeFramePacket,
    receiveSurfacePacket,
    consumeSurfacePacket,
    receiveBoundaryPacket,
    receiveInspectPacket,
    receiveLightPacket,
    acceptHexGatePacket,
    acceptTransmissionPacket,
    receive,

    validatePacket,
    packetLooksHexSurfaceSource,
    getCanonicalTupleCandidate,
    composeSurfaceProofPacket,
    composeInspectForwardPacket,
    forwardToInspect,
    refreshUpstreamAndChildAuthorities,

    getReceipt,
    getReceiptLight,
    getFingerReceipt: getReceiptLight,
    getPointerFingerReceipt: getReceiptLight,
    getSurfaceFingerReceipt: getReceiptLight,
    getCanvasFingerSurfaceReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getStatusText,
    composeDiagnosticFields,
    publishAliases,
    publishReceiptAliases,
    updateDataset,

    pointerSurfaceBishopGateActive: true,
    primaryPointerSurfaceEndpoint: true,
    pointerFingerSurface: true,
    inspectIsChildProofReceiver: true,
    inspectIsPrimaryEndpoint: false,
    hexSurfaceIsUpstreamGate: true,
    canvasIsOutputCarrier: true,
    canonicalMapTuplePreservedWithoutDerivation: true,
    baselineMappingUsed: false,
    coordinateSynthesisAllowed: false,

    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasReleaseAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    finalVisualPassAuthority: false,

    ownsSurfaceBishopGate: true,
    ownsSurfaceReceiptPublication: true,
    ownsCanonicalMapTupleReceipt: true,
    ownsInspectChildProofForwarding: true,

    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasLifecycle: false,
    ownsCanvasRelease: false,
    ownsHexSurfaceTruth: false,
    ownsHexAuthorityTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  state.receiverMethodCount = RECEIVER_METHODS.filter((method) => isFunction(api[method])).length;

  try {
    publishAliases();
    updateDataset();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot(), { once: true });
      } else {
        boot();
      }
    } else {
      boot();
    }
  } catch (error) {
    recordError("HEARTH_CANVAS_FINGER_SURFACE_INITIALIZATION_FAILED", error);

    try {
      publishAliases();
      publishReceiptAliases();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
