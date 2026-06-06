// /assets/hearth/hearth.canvas.finger.inspect.js
// HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_TNT_v1
// Internal controlled renewal:
// HEARTH_CANVAS_FINGER_INSPECT_STRETCH_MANAGER_HEX_SURFACE_PROOF_TNT_v1_1
// Full-file replacement.
// Canvas Finger 5 / Inspect / Finger Stretch Manager / Hex Surface Bridge Proof.
// Purpose:
// - Preserve the public v1 Inspect Finger contract, receipt, packet, aliases, and Canvas Hub expectations.
// - Renew Inspect into the downstream finger-stretch manager/proof layer.
// - Inspect Boundary, Mass, Surface, Light, and Hex Surface bridge availability without renewing those files.
// - Prove whether the downstream expression set is coherent before Canvas is blamed for blank pixels.
// - Prove whether Surface is observed, packet-ready, expression-socket-ready, and being sampled by Hex Surface.
// - Prove whether Hex Surface is observed, pointer-finger transmission is active, and Inspect receives Hex transmission packets.
// - Receive Hex Surface pointer-finger transmission packets through public APIs only.
// - Produce unified inspection packet for Canvas Expression Hub, diagnostics, route receipts, and Hex Surface bridge analysis.
// - Keep this file as an expansion/inspection/proof file only.
// - Do not mutate HTML, index.js, route conductor, diagnostic rail, Canvas parent, Hex Surface, or prior finger files.
// - Do not draw canvas.
// - Do not create terrain, hydrology, material, elevation, mountain, atmosphere, composite, or final planet truth.
// - Do not claim F13, F21, ready text, completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_v1";
  const PACKET = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_PACKET_v1";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_MANAGER_HEX_SURFACE_PROOF_TNT_v1_1";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_MANAGER_HEX_SURFACE_PROOF_RECEIPT_v1_1";

  const PREVIOUS_PUBLIC_CONTRACT = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_TNT_v1";
  const PREVIOUS_PUBLIC_RECEIPT = "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_v1";

  const VERSION =
    "2026-06-06.hearth-canvas-finger-inspect-stretch-manager-hex-surface-proof-v1-1";

  const FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";
  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const FINGER_NAME = "inspect";
  const FINGER_ROLE = "finger-stretch-manager-hex-surface-proof";
  const FINGER_ORDER = 5;
  const FINGER_STRETCH_TOTAL = 5;

  const HEX_SURFACE_REQUIRED_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";

  const HEX_SURFACE_INTERNAL_EXPECTED_CONTRACT =
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_TNT_v4_3";

  const FINGER_SEQUENCE = Object.freeze([
    Object.freeze({
      order: 1,
      name: "boundary",
      file: BOUNDARY_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_BOUNDARY",
      role: "base globe containment, visible body edge, boundary envelope"
    }),
    Object.freeze({
      order: 2,
      name: "mass",
      file: MASS_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_MASS",
      role: "physical body mass, broad body structure, early land/body support"
    }),
    Object.freeze({
      order: 3,
      name: "surface",
      file: SURFACE_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_SURFACE",
      role: "pointer finger / surface pointer bishop / hex expression socket"
    }),
    Object.freeze({
      order: 4,
      name: "light",
      file: LIGHT_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_LIGHT",
      role: "visibility, light, chamber realism, atmosphere-edge readability"
    }),
    Object.freeze({
      order: 5,
      name: "inspect",
      file: FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_INSPECT",
      role: "finger-stretch manager, proof layer, hex bridge observer"
    })
  ]);

  const BRIDGE_SEQUENCE = Object.freeze([
    Object.freeze({
      order: 1,
      name: "hex-authority",
      file: HEX_AUTHORITY_FILE,
      expectedContractHint: "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      role: "hex pixel/state handshake authority"
    }),
    Object.freeze({
      order: 2,
      name: "hex-surface",
      file: HEX_SURFACE_FILE,
      expectedContractHint: "HEARTH_HEX_SURFACE",
      role: "hex surface gate, projection adapter, pointer-finger transmission"
    }),
    Object.freeze({
      order: 3,
      name: "surface-expression-socket",
      file: SURFACE_FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_SURFACE",
      role: "surface expression provider consumed by hex surface"
    }),
    Object.freeze({
      order: 4,
      name: "inspect-receiver",
      file: FILE,
      expectedContractHint: "HEARTH_CANVAS_FINGER_INSPECT",
      role: "receives public hex surface transmission packet"
    })
  ]);

  const HUB_SOURCE_NAMES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasHub",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasFingerManager",
    "HEARTH.canvasBishopManager",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_FINGER_MANAGER",
    "HEARTH_CANVAS_BISHOP_MANAGER",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasFingerManager",
    "DEXTER_LAB.hearthCanvasBishopManager"
  ]);

  const HUB_INTAKE_METHODS = Object.freeze([
    "receiveInspectFingerPacket",
    "receiveFingerStretchInspectionPacket",
    "receiveFingerPacket",
    "receiveCanvasFingerPacket",
    "receiveExpressionPacket",
    "receiveChildPacket",
    "registerCanvasFinger",
    "registerExpressionFinger"
  ]);

  const FINGER_SOURCE_NAMES = Object.freeze({
    boundary: Object.freeze([
      "HEARTH.canvasFingerBoundary",
      "HEARTH.canvasBoundaryFinger",
      "HEARTH.canvasBishopBoundary",
      "HEARTH.canvasBoundaryBishop",
      "HEARTH_CANVAS_FINGER_BOUNDARY",
      "HEARTH_CANVAS_BOUNDARY_FINGER",
      "HEARTH_CANVAS_BISHOP_BOUNDARY",
      "HEARTH_CANVAS_BOUNDARY_BISHOP",
      "DEXTER_LAB.hearthCanvasFingerBoundary",
      "DEXTER_LAB.hearthCanvasBoundaryFinger",
      "DEXTER_LAB.hearthCanvasBishopBoundary",
      "DEXTER_LAB.hearthCanvasBoundaryBishop"
    ]),
    mass: Object.freeze([
      "HEARTH.canvasFingerMass",
      "HEARTH.canvasMassFinger",
      "HEARTH.canvasBishopMass",
      "HEARTH.canvasMassBishop",
      "HEARTH_CANVAS_FINGER_MASS",
      "HEARTH_CANVAS_MASS_FINGER",
      "HEARTH_CANVAS_BISHOP_MASS",
      "HEARTH_CANVAS_MASS_BISHOP",
      "DEXTER_LAB.hearthCanvasFingerMass",
      "DEXTER_LAB.hearthCanvasMassFinger",
      "DEXTER_LAB.hearthCanvasBishopMass",
      "DEXTER_LAB.hearthCanvasMassBishop"
    ]),
    surface: Object.freeze([
      "HEARTH.canvasFingerSurface",
      "HEARTH.canvasSurfaceFinger",
      "HEARTH.canvasPointerFinger",
      "HEARTH.canvasFingerSurfacePointer",
      "HEARTH.canvasBishopSurface",
      "HEARTH.canvasSurfaceBishop",
      "HEARTH.canvasPointerBishop",
      "HEARTH.surfaceExpressionAuthority",
      "HEARTH.hexSurfaceExpressionAuthority",
      "HEARTH.canvasFingerSurfaceHexExpressionSocket",
      "HEARTH.canvasSurfacePointerBishopHexExpressionSocket",
      "HEARTH_CANVAS_FINGER_SURFACE",
      "HEARTH_CANVAS_SURFACE_FINGER",
      "HEARTH_CANVAS_POINTER_FINGER",
      "HEARTH_CANVAS_FINGER_SURFACE_POINTER",
      "HEARTH_CANVAS_BISHOP_SURFACE",
      "HEARTH_CANVAS_SURFACE_BISHOP",
      "HEARTH_CANVAS_POINTER_BISHOP",
      "HEARTH_SURFACE_EXPRESSION_AUTHORITY",
      "HEARTH_HEX_SURFACE_EXPRESSION_AUTHORITY",
      "HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_SOCKET",
      "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
      "DEXTER_LAB.hearthCanvasFingerSurface",
      "DEXTER_LAB.hearthCanvasSurfaceFinger",
      "DEXTER_LAB.hearthCanvasPointerFinger",
      "DEXTER_LAB.hearthCanvasFingerSurfacePointer",
      "DEXTER_LAB.hearthCanvasBishopSurface",
      "DEXTER_LAB.hearthCanvasSurfaceBishop",
      "DEXTER_LAB.hearthCanvasPointerBishop",
      "DEXTER_LAB.hearthSurfaceExpressionAuthority",
      "DEXTER_LAB.hearthHexSurfaceExpressionAuthority",
      "DEXTER_LAB.hearthCanvasFingerSurfaceHexExpressionSocket",
      "DEXTER_LAB.hearthCanvasSurfacePointerBishopHexExpressionSocket"
    ]),
    light: Object.freeze([
      "HEARTH.canvasFingerLight",
      "HEARTH.canvasLightFinger",
      "HEARTH.canvasBishopLight",
      "HEARTH.canvasLightBishop",
      "HEARTH_CANVAS_FINGER_LIGHT",
      "HEARTH_CANVAS_LIGHT_FINGER",
      "HEARTH_CANVAS_BISHOP_LIGHT",
      "HEARTH_CANVAS_LIGHT_BISHOP",
      "DEXTER_LAB.hearthCanvasFingerLight",
      "DEXTER_LAB.hearthCanvasLightFinger",
      "DEXTER_LAB.hearthCanvasBishopLight",
      "DEXTER_LAB.hearthCanvasLightBishop"
    ])
  });

  const HEX_SURFACE_SOURCE_NAMES = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexPairSurface",
    "HEARTH.hexPairRenderer",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_PAIR_SURFACE",
    "HEARTH_HEX_PAIR_RENDERER",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexPairSurface",
    "DEXTER_LAB.hearthHexPairRenderer"
  ]);

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f13ClaimedByInspectFinger: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    f21ClaimedByInspectFinger: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextClaimed: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    readyTextClaimedByInspectFinger: false,
    terrainTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    elevationTruthClaimed: false,
    mountainTruthClaimed: false,
    biomeTruthClaimed: false,
    atmosphereTruthClaimed: false,
    compositeTruthClaimed: false,
    finalCompositeTruthClaimed: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const api = {};

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousPublicContract: PREVIOUS_PUBLIC_CONTRACT,
    previousPublicReceipt: PREVIOUS_PUBLIC_RECEIPT,
    version: VERSION,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    surfaceFile: SURFACE_FILE,
    lightFile: LIGHT_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    inspectFingerLoaded: true,
    inspectFingerActive: true,
    inspectionOnly: true,
    expressionFileOnly: true,
    fingerStretchManagerActive: true,
    hexSurfaceBridgeProofActive: true,
    priorFingerMutationBlocked: true,
    upstreamRenewalRequired: false,

    boundaryObserved: false,
    boundaryReceiptObserved: false,
    boundaryPacketObserved: false,
    boundaryReady: false,
    boundaryNoFalseClaims: true,

    massObserved: false,
    massReceiptObserved: false,
    massPacketObserved: false,
    massReady: false,
    massNoFalseClaims: true,

    surfaceObserved: false,
    surfaceReceiptObserved: false,
    surfacePacketObserved: false,
    surfaceReady: false,
    surfaceNoFalseClaims: true,
    surfaceExpressionSocketObserved: false,
    surfaceExpressionSocketReady: false,
    surfaceHexExpressionCountsObserved: false,
    surfaceHexExpressionRequestCount: 0,
    surfaceHexExpressionServedCount: 0,
    surfaceHexExpressionRejectedCount: 0,
    surfaceLatestHexExpressionRequestSource: "NONE",
    surfaceLatestHexExpressionAt: "",
    surfaceLatestHexExpressionCellId: "NONE",
    surfaceLatestHexExpressionMaterialClass: "NONE",
    surfaceSampledByHexSurface: false,
    surfaceSampledByHexSurfaceStatus: "NOT_PROVEN",

    lightObserved: false,
    lightReceiptObserved: false,
    lightPacketObserved: false,
    lightReady: false,
    lightNoFalseClaims: true,

    allFingerSourcesObserved: false,
    allFingerReceiptsObserved: false,
    allFingerPacketsObserved: false,
    allFingerReady: false,

    hexSurfaceObserved: false,
    hexSurfaceReceiptObserved: false,
    hexSurfaceRecognized: false,
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceReceipt: "UNKNOWN",
    hexSurfaceSupportsPointerFingerTransmission: false,
    hexSurfaceGateActive: false,
    hexSurfaceTransmissionActive: false,
    hexSurfaceAcceptedPacketCount: 0,
    hexSurfaceTransmissionCount: 0,
    hexSurfaceDeliveryCount: 0,
    hexSurfacePointerFingerObservedCount: 0,
    hexSurfacePointerFingerActiveCount: 0,
    hexSurfacePointerFingerInspectObserved: false,
    hexSurfacePointerFingerInspectActive: false,
    hexSurfaceTransmissionStatus: "UNKNOWN",
    hexSurfaceTransmissionMethod: "UNKNOWN",
    hexSurfaceTransmissionReason: "UNKNOWN",
    hexSurfaceLastTransmissionObserved: false,
    hexSurfaceLastTransmissionPacketType: "NONE",
    hexSurfaceLastTransmissionAt: "",
    hexSurfaceBridgeReady: false,
    hexSurfaceBridgeFailureReason: "NOT_INSPECTED",

    hexTransmissionReceivedByInspect: false,
    hexTransmissionReceivedCount: 0,
    hexTransmissionAcceptedCount: 0,
    hexTransmissionRejectedCount: 0,
    latestHexTransmissionAt: "",
    latestHexTransmissionPacketType: "NONE",
    latestHexTransmissionSourceFile: "NONE",
    latestHexTransmissionReason: "NONE",
    lastHexSurfaceTransmissionPacket: null,

    downstreamExpressionSetReady: false,
    downstreamExpressionSetStatus: "NOT_INSPECTED",
    downstreamExpressionSetFailureReason: "NOT_INSPECTED",

    baseCanvasGlobeEvidenceReady: false,
    baseCanvasGlobeExpandable: false,
    baseCanvasVisualizationExpected: false,
    canvasNextIfPixelsRemainBlank: false,
    canvasNotYetBlamed: true,
    downstreamTroubleshootingExpected: false,

    hubDetected: false,
    hubSourceName: "NONE",
    hubRegistrationAttempted: false,
    hubRegistrationAccepted: false,
    hubRegistrationMethod: "NONE",
    hubRegistrationHeldReason: "NOT_ATTEMPTED",
    hubRegistrationError: "",

    firstFailedCoordinate: "INSPECT_FINGER_NOT_BOOTED",
    recommendedNextFile: FILE,
    recommendedNextRenewalTarget: FILE,
    recommendedNextAction: "BOOT_INSPECT_FINGER",
    postgameStatus: "INSPECT_FINGER_WAITING_BOOT",

    inspectionSummary: null,
    inspectionPacket: null,
    downstreamExpressionSetPacket: null,

    boundary: null,
    mass: null,
    surface: null,
    light: null,
    hexSurface: null,
    surfaceHexExpression: null,

    lastRegistrationResponse: null,
    localEvents: [],
    errors: [],

    booted: false,
    mounted: false,

    ...FINAL_FALSE
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

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function firstDefined(...values) {
    for (const value of values) {
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return undefined;
  }

  function firstNonEmpty(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text) return text;
    }
    return "";
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trimArray(array, max) {
    if (Array.isArray(array) && array.length > max) {
      array.splice(0, array.length - max);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "INSPECT_FINGER_EVENT"),
      detail: clonePlain(detail)
    };

    state.localEvents.push(item);
    trimArray(state.localEvents, 160);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "INSPECT_FINGER_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimArray(state.errors, 100);
    state.updatedAt = item.at;
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

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function findSource(sourceNames) {
    for (const sourceName of sourceNames || []) {
      const candidate = readPath(sourceName);
      if (candidate && (isObject(candidate) || isFunction(candidate))) {
        return { source: candidate, sourceName };
      }
    }

    return { source: null, sourceName: "NONE" };
  }

  function safeInvoke(source, methodName, args = []) {
    if (!source || !isFunction(source[methodName])) return null;

    try {
      return source[methodName](...args);
    } catch (error) {
      recordError("INSPECT_SAFE_INVOKE_FAILED", error, { methodName });
      return null;
    }
  }

  function readField(source, keys, fallback = "") {
    const s = isObject(source) ? source : {};

    for (const key of keys) {
      if (s[key] !== undefined && s[key] !== null && s[key] !== "") return s[key];

      const lower = key.toLowerCase();
      for (const candidate of Object.keys(s)) {
        if (candidate.toLowerCase() === lower) {
          const value = s[candidate];
          if (value !== undefined && value !== null && value !== "") return value;
        }
      }
    }

    return fallback;
  }

  function readGenericReceipt(source) {
    if (!source || !isObject(source)) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "read",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      const value = safeInvoke(source, method, method === "getReceiptLight" ? [false] : []);
      if (isObject(value)) return value;
    }

    if (isObject(source.receiptPacket)) return source.receiptPacket;
    if (isObject(source.receipt)) return source.receipt;
    if (isObject(source.status)) return source.status;

    if (source.contract || source.CONTRACT || source.receipt || source.RECEIPT || source.file) {
      return source;
    }

    return null;
  }

  function contractOf(candidate) {
    if (!isObject(candidate)) return "";

    return firstNonEmpty(
      readField(candidate, [
        "currentCanvasParentContract",
        "canvasContract",
        "contract",
        "CONTRACT",
        "currentContract",
        "sourceContract",
        "hexSurfaceContract",
        "internalImplementationContract"
      ], ""),
      candidate.contract,
      candidate.CONTRACT
    );
  }

  function receiptOf(candidate) {
    if (!isObject(candidate)) return "";

    return firstNonEmpty(
      readField(candidate, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "receipt",
        "RECEIPT",
        "currentReceipt",
        "sourceReceipt",
        "hexSurfaceReceipt",
        "internalImplementationReceipt"
      ], ""),
      candidate.receipt,
      candidate.RECEIPT
    );
  }

  function fileOf(candidate) {
    if (!isObject(candidate)) return "";

    return firstNonEmpty(
      readField(candidate, [
        "file",
        "FILE",
        "sourceFile",
        "targetFile",
        "hexSurfaceFile",
        "surfaceFile"
      ], ""),
      candidate.file,
      candidate.FILE
    );
  }

  function readFingerPacket(kind, source, receipt) {
    if (!source || !isObject(source)) return null;

    const methodMap = {
      boundary: [
        "getBoundaryPacket",
        "getBishopPacket",
        "getFingerPacket",
        "getPacket",
        "buildBoundaryPacket"
      ],
      mass: [
        "getMassPacket",
        "getBishopPacket",
        "getFingerPacket",
        "getPacket",
        "buildMassPacket"
      ],
      surface: [
        "getSurfacePacket",
        "getPointerFingerPacket",
        "getPointerBishopPacket",
        "getBishopPacket",
        "getFingerPacket",
        "getPacket",
        "buildSurfacePacket"
      ],
      light: [
        "getLightPacket",
        "getBishopPacket",
        "getFingerPacket",
        "getPacket",
        "buildLightPacket"
      ]
    };

    for (const method of methodMap[kind] || []) {
      const value = safeInvoke(source, method);
      if (isObject(value)) return value;
    }

    const packetKeys = {
      boundary: ["boundaryPacket", "bishopPacket", "fingerPacket", "packet"],
      mass: ["massPacket", "bishopPacket", "fingerPacket", "packet"],
      surface: ["surfacePacket", "pointerFingerPacket", "pointerBishopPacket", "bishopPacket", "fingerPacket", "packet"],
      light: ["lightPacket", "bishopPacket", "fingerPacket", "packet"]
    };

    for (const key of packetKeys[kind] || []) {
      if (receipt && isObject(receipt[key])) return receipt[key];
      if (isObject(source[key])) return source[key];
    }

    return null;
  }

  function hasNoFalseClaims(receipt, packet) {
    const merged = Object.assign({}, isObject(receipt) ? receipt : {}, isObject(packet) ? packet : {});

    return !(
      merged.f13Claimed === true ||
      merged.f13EligibleForCanvas === true ||
      merged.f13ClaimedByCanvasParent === true ||
      merged.f13ClaimedByInspectFinger === true ||
      merged.f21Claimed === true ||
      merged.f21EligibleForNorth === true ||
      merged.f21SubmittedToNorth === true ||
      merged.f21EligibilitySubmittedToNorth === true ||
      merged.f21ClaimedByInspectFinger === true ||
      merged.completionLatched === true ||
      merged.finalCompletionLatched === true ||
      merged.degradedCompletionLatched === true ||
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

  function inferFingerReady(kind, source, receipt, packet) {
    if (!source) return false;
    if (!hasNoFalseClaims(receipt, packet)) return false;

    if (kind === "boundary") {
      return Boolean(
        safeBool(receipt && receipt.boundaryPacketReady, false) ||
        safeBool(receipt && receipt.boundaryModelReady, false) ||
        safeBool(receipt && receipt.visibleBoundaryAvailable, false) ||
        safeBool(receipt && receipt.boundaryFingerActive, false) ||
        safeBool(packet && packet.boundaryPacketReady, false) ||
        safeBool(packet && packet.boundaryModelReady, false) ||
        safeBool(packet && packet.visibleBoundaryAvailable, false) ||
        isObject(packet)
      );
    }

    if (kind === "mass") {
      return Boolean(
        safeBool(receipt && receipt.massPacketReady, false) ||
        safeBool(receipt && receipt.massModelReady, false) ||
        safeBool(receipt && receipt.visibleMassContributionAvailable, false) ||
        safeBool(receipt && receipt.massFingerActive, false) ||
        safeBool(packet && packet.massPacketReady, false) ||
        safeBool(packet && packet.massModelReady, false) ||
        safeBool(packet && packet.visibleMassContributionAvailable, false) ||
        isObject(packet)
      );
    }

    if (kind === "surface") {
      return Boolean(
        safeBool(receipt && receipt.surfacePacketReady, false) ||
        safeBool(receipt && receipt.surfaceModelReady, false) ||
        safeBool(receipt && receipt.visibleSurfaceContributionAvailable, false) ||
        safeBool(receipt && receipt.visibleContributionAvailable, false) ||
        safeBool(receipt && receipt.surfaceExpressionReady, false) ||
        safeBool(receipt && receipt.hexSurfaceExpressionReady, false) ||
        safeBool(receipt && receipt.sampleHexSurfaceExpressionReady, false) ||
        safeBool(receipt && receipt.sampleHexSurfaceExpressionAvailable, false) ||
        safeBool(packet && packet.surfacePacketReady, false) ||
        safeBool(packet && packet.surfaceModelReady, false) ||
        safeBool(packet && packet.visibleSurfaceContributionAvailable, false) ||
        safeBool(packet && packet.hexExpressionSocketActive, false) ||
        isObject(packet)
      );
    }

    if (kind === "light") {
      return Boolean(
        safeBool(receipt && receipt.lightPacketReady, false) ||
        safeBool(receipt && receipt.lightModelReady, false) ||
        safeBool(receipt && receipt.visibleContributionAvailable, false) ||
        safeBool(receipt && receipt.fourChannelVisibilityActive, false) ||
        safeBool(receipt && receipt.lightFingerActive, false) ||
        safeBool(packet && packet.lightPacketReady, false) ||
        safeBool(packet && packet.lightModelReady, false) ||
        safeBool(packet && packet.visibleContributionAvailable, false) ||
        safeBool(packet && packet.fourChannelVisibilityActive, false) ||
        isObject(packet)
      );
    }

    return false;
  }

  function inspectFinger(kind) {
    const found = findSource(FINGER_SOURCE_NAMES[kind] || []);
    const receipt = found.source ? readGenericReceipt(found.source) : null;
    const packet = found.source ? readFingerPacket(kind, found.source, receipt) : null;
    const noFalseClaims = hasNoFalseClaims(receipt, packet);
    const ready = inferFingerReady(kind, found.source, receipt, packet);

    return {
      kind,
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(receipt),
      packetObserved: Boolean(packet),
      ready,
      contract: contractOf(receipt) || contractOf(packet) || contractOf(found.source) || "UNKNOWN",
      receiptName: receiptOf(receipt) || receiptOf(packet) || receiptOf(found.source) || "UNKNOWN",
      file: fileOf(receipt) || fileOf(packet) || "",
      noFalseClaims,
      receipt: clonePlain(receipt),
      packet: clonePlain(packet),
      ...FINAL_FALSE
    };
  }

  function inspectSurfaceHexExpression(surfaceInspection) {
    const source = surfaceInspection && surfaceInspection.sourceName
      ? readPath(surfaceInspection.sourceName)
      : null;

    const receipt = surfaceInspection && isObject(surfaceInspection.receipt)
      ? surfaceInspection.receipt
      : null;

    const packet = surfaceInspection && isObject(surfaceInspection.packet)
      ? surfaceInspection.packet
      : null;

    const methodNames = [
      "sampleHexSurfaceExpression",
      "sampleSurfaceExpression",
      "getRenderableSurfaceExpression",
      "getSurfaceExpressionAt",
      "receiveHexSurfaceExpressionRequest",
      "sample"
    ];

    const availableMethods = [];

    if (source && isObject(source)) {
      for (const methodName of methodNames) {
        if (isFunction(source[methodName])) availableMethods.push(methodName);
      }
    }

    const requestCount = safeNumber(firstDefined(
      receipt && receipt.hexExpressionRequestCount,
      packet && packet.hexExpressionRequestCount,
      receipt && receipt.hexExpressionReceipt && receipt.hexExpressionReceipt.hexExpressionRequestCount
    ), 0);

    const servedCount = safeNumber(firstDefined(
      receipt && receipt.hexExpressionServedCount,
      packet && packet.hexExpressionServedCount,
      receipt && receipt.hexExpressionReceipt && receipt.hexExpressionReceipt.hexExpressionServedCount
    ), 0);

    const rejectedCount = safeNumber(firstDefined(
      receipt && receipt.hexExpressionRejectedCount,
      packet && packet.hexExpressionRejectedCount,
      receipt && receipt.hexExpressionReceipt && receipt.hexExpressionReceipt.hexExpressionRejectedCount
    ), 0);

    const latestSource = firstNonEmpty(
      receipt && receipt.latestHexExpressionRequestSource,
      packet && packet.latestHexExpressionRequestSource,
      receipt && receipt.hexExpressionReceipt && receipt.hexExpressionReceipt.latestHexExpressionRequestSource,
      "NONE"
    );

    const latestAt = firstNonEmpty(
      receipt && receipt.latestHexExpressionAt,
      packet && packet.latestHexExpressionAt,
      receipt && receipt.hexExpressionReceipt && receipt.hexExpressionReceipt.latestHexExpressionAt,
      ""
    );

    const latestCell = firstNonEmpty(
      receipt && receipt.latestHexExpressionCellId,
      packet && packet.latestHexExpressionCellId,
      receipt && receipt.hexExpressionReceipt && receipt.hexExpressionReceipt.latestHexExpressionCellId,
      "NONE"
    );

    const latestMaterialClass = firstNonEmpty(
      receipt && receipt.latestHexExpressionMaterialClass,
      packet && packet.latestHexExpressionMaterialClass,
      receipt && receipt.hexExpressionReceipt && receipt.hexExpressionReceipt.latestHexExpressionMaterialClass,
      "NONE"
    );

    const socketReady = Boolean(
      availableMethods.length > 0 &&
      (
        safeBool(receipt && receipt.hexExpressionSocketActive, false) ||
        safeBool(packet && packet.hexExpressionSocketActive, false) ||
        safeBool(receipt && receipt.sampleHexSurfaceExpressionAvailable, false) ||
        safeBool(packet && packet.sampleHexSurfaceExpressionAvailable, false) ||
        safeBool(receipt && receipt.sampleHexSurfaceExpressionReady, false) ||
        safeBool(receipt && receipt.hexSurfaceExpressionReady, false) ||
        surfaceInspection.ready
      )
    );

    const sampledByHexSurface = Boolean(
      /HEX_SURFACE/i.test(latestSource) ||
      /hearth\.hex\.surface/i.test(latestSource) ||
      /hex-surface/i.test(latestSource)
    );

    let sampledStatus = "NOT_PROVEN";

    if (sampledByHexSurface) {
      sampledStatus = "PROVEN_BY_SURFACE_LATEST_HEX_EXPRESSION_REQUEST_SOURCE";
    } else if (servedCount > 0 && state.hexSurfaceTransmissionCount > 0) {
      sampledStatus = "INFERRED_BY_SURFACE_COUNTERS_AND_HEX_TRANSMISSION_COUNT";
    } else if (servedCount > 0) {
      sampledStatus = "SERVED_COUNT_PRESENT_BUT_HEX_SOURCE_NOT_PROVEN";
    } else if (socketReady) {
      sampledStatus = "SOCKET_READY_BUT_NO_SERVED_SAMPLE_COUNT";
    }

    return {
      surfaceObserved: surfaceInspection.observed,
      surfaceReady: surfaceInspection.ready,
      expressionSocketObserved: availableMethods.length > 0,
      expressionSocketReady: socketReady,
      availableMethods,
      countsObserved: Boolean(requestCount || servedCount || rejectedCount || latestSource !== "NONE"),
      requestCount,
      servedCount,
      rejectedCount,
      latestRequestSource: latestSource,
      latestAt,
      latestCellId: latestCell,
      latestMaterialClass,
      sampledByHexSurface,
      sampledByHexSurfaceStatus: sampledStatus,
      directInspectSampleAttempted: false,
      directInspectSampleSuppressedByDefault: true,
      reason: "PASSIVE_COUNTER_AND_METHOD_INSPECTION_ONLY_TO_AVOID_MASKING_HEX_SAMPLE_SOURCE",
      ...FINAL_FALSE
    };
  }

  function findHexSurface() {
    const found = findSource(HEX_SURFACE_SOURCE_NAMES);
    const receipt = found.source ? readGenericReceipt(found.source) : null;
    const contract = contractOf(receipt) || contractOf(found.source) || "UNKNOWN";
    const receiptName = receiptOf(receipt) || receiptOf(found.source) || "UNKNOWN";

    const recognized = Boolean(
      contract === HEX_SURFACE_REQUIRED_CONTRACT ||
      contract === HEX_SURFACE_INTERNAL_EXPECTED_CONTRACT ||
      safeString(contract).includes("HEARTH_HEX_SURFACE")
    );

    return {
      source: found.source,
      sourceName: found.sourceName,
      receipt,
      contract,
      receiptName,
      recognized
    };
  }

  function readGlobalLastTransmission() {
    return (
      root.HEARTH_HEX_SURFACE_LAST_TRANSMISSION_PACKET ||
      root.HEARTH_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_PACKET ||
      root.HEARTH_POINTER_FINGER_TRANSMISSION_PACKET ||
      root.HEARTH_CANVAS_FINGER_TRANSMISSION_PACKET ||
      (root.HEARTH && (
        root.HEARTH.hexSurfaceLastTransmissionPacket ||
        root.HEARTH.hexSurfacePointerFingerTransmissionPacket ||
        root.HEARTH.pointerFingerTransmissionPacket ||
        root.HEARTH.canvasFingerTransmissionPacket
      )) ||
      (root.DEXTER_LAB && (
        root.DEXTER_LAB.hearthHexSurfaceLastTransmissionPacket ||
        root.DEXTER_LAB.hearthHexSurfacePointerFingerTransmissionPacket ||
        root.DEXTER_LAB.hearthPointerFingerTransmissionPacket
      )) ||
      null
    );
  }

  function inspectHexSurfaceBridge() {
    const found = findHexSurface();
    const receipt = isObject(found.receipt) ? found.receipt : {};
    const lastTransmission = (
      receipt.lastPointerFingerTransmissionPacket ||
      receipt.lastTransmissionPacket ||
      receipt.pointerFingerTransmissionPacket ||
      readGlobalLastTransmission()
    );

    const supportsPointerFingerTransmission = Boolean(
      safeBool(receipt.supportsPointerFingerTransmission, false) ||
      safeBool(receipt.pointerFingerTransmissionActive, false) ||
      safeBool(receipt.hexSurfaceGateActive, false) ||
      found.source && isFunction(found.source.deliverPointerFingerTransmission)
    );

    const gateActive = Boolean(
      safeBool(receipt.hexSurfaceGateActive, false) ||
      safeBool(receipt.canvasGateReceiverActive, false)
    );

    const transmissionActive = Boolean(
      safeBool(receipt.pointerFingerTransmissionActive, false) ||
      supportsPointerFingerTransmission
    );

    const acceptedPacketCount = safeNumber(receipt.acceptedPacketCount, 0);
    const transmissionCount = safeNumber(receipt.transmissionCount, 0);
    const deliveryCount = safeNumber(receipt.deliveryCount, 0);
    const observedCount = safeNumber(receipt.pointerFingerObservedCount, 0);
    const activeCount = safeNumber(receipt.pointerFingerActiveCount, 0);

    const inspectObserved = safeBool(receipt.pointerFingerInspectObserved, false) ||
      Boolean(root.HEARTH_CANVAS_FINGER_INSPECT || root.HEARTH_CANVAS_INSPECT_FINGER);

    const inspectActive = safeBool(receipt.pointerFingerInspectActive, false) ||
      state.hexTransmissionReceivedByInspect ||
      Boolean(api.receiveHexSurfaceTransmissionPacket);

    const status = firstNonEmpty(receipt.pointerFingerTransmissionStatus, "UNKNOWN");
    const method = firstNonEmpty(receipt.pointerFingerTransmissionMethod, "UNKNOWN");
    const reason = firstNonEmpty(receipt.pointerFingerTransmissionReason, "UNKNOWN");

    let bridgeReady = false;
    let failureReason = "HEX_SURFACE_NOT_OBSERVED";

    if (!found.source) {
      bridgeReady = false;
      failureReason = "HEX_SURFACE_NOT_OBSERVED";
    } else if (!found.recognized) {
      bridgeReady = false;
      failureReason = "HEX_SURFACE_CONTRACT_NOT_RECOGNIZED";
    } else if (!supportsPointerFingerTransmission) {
      bridgeReady = false;
      failureReason = "HEX_SURFACE_POINTER_FINGER_TRANSMISSION_NOT_SUPPORTED";
    } else if (!transmissionActive) {
      bridgeReady = false;
      failureReason = "HEX_SURFACE_TRANSMISSION_NOT_ACTIVE";
    } else if (!inspectObserved) {
      bridgeReady = false;
      failureReason = "INSPECT_ALIAS_NOT_OBSERVED_BY_HEX_SURFACE";
    } else if (!lastTransmission && transmissionCount === 0) {
      bridgeReady = false;
      failureReason = "NO_HEX_SURFACE_TRANSMISSION_PACKET_OBSERVED";
    } else {
      bridgeReady = true;
      failureReason = "NONE";
    }

    return {
      observed: Boolean(found.source),
      sourceName: found.sourceName,
      receiptObserved: Boolean(found.receipt),
      recognized: found.recognized,
      contract: found.contract,
      receiptName: found.receiptName,
      supportsPointerFingerTransmission,
      gateActive,
      transmissionActive,
      acceptedPacketCount,
      transmissionCount,
      deliveryCount,
      pointerFingerObservedCount: observedCount,
      pointerFingerActiveCount: activeCount,
      pointerFingerInspectObserved: inspectObserved,
      pointerFingerInspectActive: inspectActive,
      transmissionStatus: status,
      transmissionMethod: method,
      transmissionReason: reason,
      lastTransmissionObserved: Boolean(lastTransmission),
      lastTransmissionPacketType: safeString(lastTransmission && lastTransmission.packetType, "NONE"),
      lastTransmissionAt: safeString(
        (lastTransmission && (lastTransmission.composedAt || lastTransmission.updatedAt || lastTransmission.timestamp)) || "",
        ""
      ),
      bridgeReady,
      bridgeFailureReason: failureReason,
      receipt: clonePlain(found.receipt),
      lastTransmissionPacket: clonePlain(lastTransmission),
      ...FINAL_FALSE
    };
  }

  function updateFingerState(summary) {
    state.boundaryObserved = summary.boundary.observed;
    state.boundaryReceiptObserved = summary.boundary.receiptObserved;
    state.boundaryPacketObserved = summary.boundary.packetObserved;
    state.boundaryReady = summary.boundary.ready;
    state.boundaryNoFalseClaims = summary.boundary.noFalseClaims;

    state.massObserved = summary.mass.observed;
    state.massReceiptObserved = summary.mass.receiptObserved;
    state.massPacketObserved = summary.mass.packetObserved;
    state.massReady = summary.mass.ready;
    state.massNoFalseClaims = summary.mass.noFalseClaims;

    state.surfaceObserved = summary.surface.observed;
    state.surfaceReceiptObserved = summary.surface.receiptObserved;
    state.surfacePacketObserved = summary.surface.packetObserved;
    state.surfaceReady = summary.surface.ready;
    state.surfaceNoFalseClaims = summary.surface.noFalseClaims;

    state.lightObserved = summary.light.observed;
    state.lightReceiptObserved = summary.light.receiptObserved;
    state.lightPacketObserved = summary.light.packetObserved;
    state.lightReady = summary.light.ready;
    state.lightNoFalseClaims = summary.light.noFalseClaims;

    state.surfaceExpressionSocketObserved = summary.surfaceHexExpression.expressionSocketObserved;
    state.surfaceExpressionSocketReady = summary.surfaceHexExpression.expressionSocketReady;
    state.surfaceHexExpressionCountsObserved = summary.surfaceHexExpression.countsObserved;
    state.surfaceHexExpressionRequestCount = summary.surfaceHexExpression.requestCount;
    state.surfaceHexExpressionServedCount = summary.surfaceHexExpression.servedCount;
    state.surfaceHexExpressionRejectedCount = summary.surfaceHexExpression.rejectedCount;
    state.surfaceLatestHexExpressionRequestSource = summary.surfaceHexExpression.latestRequestSource;
    state.surfaceLatestHexExpressionAt = summary.surfaceHexExpression.latestAt;
    state.surfaceLatestHexExpressionCellId = summary.surfaceHexExpression.latestCellId;
    state.surfaceLatestHexExpressionMaterialClass = summary.surfaceHexExpression.latestMaterialClass;
    state.surfaceSampledByHexSurface = summary.surfaceHexExpression.sampledByHexSurface;
    state.surfaceSampledByHexSurfaceStatus = summary.surfaceHexExpression.sampledByHexSurfaceStatus;

    state.hexSurfaceObserved = summary.hexSurface.observed;
    state.hexSurfaceReceiptObserved = summary.hexSurface.receiptObserved;
    state.hexSurfaceRecognized = summary.hexSurface.recognized;
    state.hexSurfaceContract = summary.hexSurface.contract;
    state.hexSurfaceReceipt = summary.hexSurface.receiptName;
    state.hexSurfaceSupportsPointerFingerTransmission = summary.hexSurface.supportsPointerFingerTransmission;
    state.hexSurfaceGateActive = summary.hexSurface.gateActive;
    state.hexSurfaceTransmissionActive = summary.hexSurface.transmissionActive;
    state.hexSurfaceAcceptedPacketCount = summary.hexSurface.acceptedPacketCount;
    state.hexSurfaceTransmissionCount = summary.hexSurface.transmissionCount;
    state.hexSurfaceDeliveryCount = summary.hexSurface.deliveryCount;
    state.hexSurfacePointerFingerObservedCount = summary.hexSurface.pointerFingerObservedCount;
    state.hexSurfacePointerFingerActiveCount = summary.hexSurface.pointerFingerActiveCount;
    state.hexSurfacePointerFingerInspectObserved = summary.hexSurface.pointerFingerInspectObserved;
    state.hexSurfacePointerFingerInspectActive = summary.hexSurface.pointerFingerInspectActive;
    state.hexSurfaceTransmissionStatus = summary.hexSurface.transmissionStatus;
    state.hexSurfaceTransmissionMethod = summary.hexSurface.transmissionMethod;
    state.hexSurfaceTransmissionReason = summary.hexSurface.transmissionReason;
    state.hexSurfaceLastTransmissionObserved = summary.hexSurface.lastTransmissionObserved;
    state.hexSurfaceLastTransmissionPacketType = summary.hexSurface.lastTransmissionPacketType;
    state.hexSurfaceLastTransmissionAt = summary.hexSurface.lastTransmissionAt;
    state.hexSurfaceBridgeReady = summary.hexSurface.bridgeReady;
    state.hexSurfaceBridgeFailureReason = summary.hexSurface.bridgeFailureReason;

    state.allFingerSourcesObserved = Boolean(
      state.boundaryObserved &&
      state.massObserved &&
      state.surfaceObserved &&
      state.lightObserved
    );

    state.allFingerReceiptsObserved = Boolean(
      state.boundaryReceiptObserved &&
      state.massReceiptObserved &&
      state.surfaceReceiptObserved &&
      state.lightReceiptObserved
    );

    state.allFingerPacketsObserved = Boolean(
      state.boundaryPacketObserved &&
      state.massPacketObserved &&
      state.surfacePacketObserved &&
      state.lightPacketObserved
    );

    state.allFingerReady = Boolean(
      state.boundaryReady &&
      state.massReady &&
      state.surfaceReady &&
      state.lightReady
    );

    state.downstreamExpressionSetReady = Boolean(
      state.allFingerReady &&
      state.surfaceExpressionSocketReady &&
      state.hexSurfaceBridgeReady
    );

    if (state.downstreamExpressionSetReady) {
      state.downstreamExpressionSetStatus = "DOWNSTREAM_EXPRESSION_SET_READY";
      state.downstreamExpressionSetFailureReason = "NONE";
    } else if (!state.allFingerReady) {
      state.downstreamExpressionSetStatus = "DOWNSTREAM_EXPRESSION_SET_NOT_READY";
      state.downstreamExpressionSetFailureReason = "ONE_OR_MORE_FINGERS_NOT_READY";
    } else if (!state.surfaceExpressionSocketReady) {
      state.downstreamExpressionSetStatus = "DOWNSTREAM_EXPRESSION_SET_NOT_READY";
      state.downstreamExpressionSetFailureReason = "SURFACE_HEX_EXPRESSION_SOCKET_NOT_READY";
    } else if (!state.hexSurfaceBridgeReady) {
      state.downstreamExpressionSetStatus = "DOWNSTREAM_EXPRESSION_SET_NOT_READY";
      state.downstreamExpressionSetFailureReason = state.hexSurfaceBridgeFailureReason;
    } else {
      state.downstreamExpressionSetStatus = "DOWNSTREAM_EXPRESSION_SET_NOT_READY";
      state.downstreamExpressionSetFailureReason = "UNKNOWN";
    }

    state.baseCanvasGlobeEvidenceReady = Boolean(state.allFingerReady);
    state.baseCanvasGlobeExpandable = Boolean(state.downstreamExpressionSetReady);
    state.baseCanvasVisualizationExpected = Boolean(state.downstreamExpressionSetReady);
    state.downstreamTroubleshootingExpected = !state.downstreamExpressionSetReady;
    state.canvasNextIfPixelsRemainBlank = Boolean(
      state.downstreamExpressionSetReady &&
      state.surfaceExpressionSocketReady &&
      (
        state.surfaceSampledByHexSurface ||
        state.hexTransmissionReceivedByInspect ||
        state.hexSurfaceTransmissionCount > 0
      )
    );

    state.canvasNotYetBlamed = !state.canvasNextIfPixelsRemainBlank;

    state.boundary = clonePlain(summary.boundary);
    state.mass = clonePlain(summary.mass);
    state.surface = clonePlain(summary.surface);
    state.light = clonePlain(summary.light);
    state.hexSurface = clonePlain(summary.hexSurface);
    state.surfaceHexExpression = clonePlain(summary.surfaceHexExpression);

    resolvePostgame();
  }

  function resolvePostgame() {
    let firstFailed = "NONE_DOWNSTREAM_EXPRESSION_SET_READY";
    let nextFile = PARENT_HUB_FILE;
    let nextAction = "IF_PIXELS_REMAIN_BLANK_AUDIT_CANVAS_DRAW_PATH";
    let status = "INSPECT_FINGER_DOWNSTREAM_EXPRESSION_SET_READY_CANVAS_NEXT_IF_PIXEL_BLANK";

    if (!state.boundaryObserved) {
      firstFailed = "WAITING_BOUNDARY_FINGER_SOURCE";
      nextFile = BOUNDARY_FILE;
      nextAction = "VERIFY_BOUNDARY_FINGER_ALIAS_PUBLICATION";
      status = "INSPECT_WAITING_BOUNDARY_SOURCE";
    } else if (!state.boundaryReady) {
      firstFailed = "WAITING_BOUNDARY_FINGER_READY";
      nextFile = BOUNDARY_FILE;
      nextAction = "RENEW_OR_VERIFY_BOUNDARY_PACKET_READINESS";
      status = "INSPECT_WAITING_BOUNDARY_READY";
    } else if (!state.massObserved) {
      firstFailed = "WAITING_MASS_FINGER_SOURCE";
      nextFile = MASS_FILE;
      nextAction = "VERIFY_MASS_FINGER_ALIAS_PUBLICATION";
      status = "INSPECT_WAITING_MASS_SOURCE";
    } else if (!state.massReady) {
      firstFailed = "WAITING_MASS_FINGER_READY";
      nextFile = MASS_FILE;
      nextAction = "RENEW_OR_VERIFY_MASS_PACKET_READINESS";
      status = "INSPECT_WAITING_MASS_READY";
    } else if (!state.surfaceObserved) {
      firstFailed = "WAITING_SURFACE_FINGER_SOURCE";
      nextFile = SURFACE_FILE;
      nextAction = "VERIFY_SURFACE_POINTER_BISHOP_ALIAS_PUBLICATION";
      status = "INSPECT_WAITING_SURFACE_SOURCE";
    } else if (!state.surfaceReady) {
      firstFailed = "WAITING_SURFACE_FINGER_READY";
      nextFile = SURFACE_FILE;
      nextAction = "RENEW_OR_VERIFY_SURFACE_PACKET_READINESS";
      status = "INSPECT_WAITING_SURFACE_READY";
    } else if (!state.surfaceExpressionSocketReady) {
      firstFailed = "WAITING_SURFACE_HEX_EXPRESSION_SOCKET_READY";
      nextFile = SURFACE_FILE;
      nextAction = "VERIFY_SURFACE_SAMPLE_HEX_SURFACE_EXPRESSION_API";
      status = "INSPECT_WAITING_SURFACE_HEX_EXPRESSION_SOCKET_READY";
    } else if (!state.lightObserved) {
      firstFailed = "WAITING_LIGHT_FINGER_SOURCE";
      nextFile = LIGHT_FILE;
      nextAction = "VERIFY_LIGHT_FINGER_ALIAS_PUBLICATION";
      status = "INSPECT_WAITING_LIGHT_SOURCE";
    } else if (!state.lightReady) {
      firstFailed = "WAITING_LIGHT_FINGER_READY";
      nextFile = LIGHT_FILE;
      nextAction = "RENEW_OR_VERIFY_LIGHT_PACKET_READINESS";
      status = "INSPECT_WAITING_LIGHT_READY";
    } else if (!state.hexSurfaceObserved) {
      firstFailed = "WAITING_HEX_SURFACE_SOURCE";
      nextFile = HEX_SURFACE_FILE;
      nextAction = "VERIFY_HEX_SURFACE_ALIAS_PUBLICATION";
      status = "INSPECT_WAITING_HEX_SURFACE_SOURCE";
    } else if (!state.hexSurfaceRecognized) {
      firstFailed = "WAITING_HEX_SURFACE_RECOGNIZED_CONTRACT";
      nextFile = HEX_SURFACE_FILE;
      nextAction = "VERIFY_HEX_SURFACE_CONTRACT_COMPATIBILITY";
      status = "INSPECT_WAITING_HEX_SURFACE_RECOGNIZED_CONTRACT";
    } else if (!state.hexSurfaceTransmissionActive) {
      firstFailed = "WAITING_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_ACTIVE";
      nextFile = HEX_SURFACE_FILE;
      nextAction = "VERIFY_HEX_SURFACE_POINTER_FINGER_TRANSMISSION";
      status = "INSPECT_WAITING_HEX_SURFACE_TRANSMISSION_ACTIVE";
    } else if (!state.hexSurfaceLastTransmissionObserved && state.hexSurfaceTransmissionCount === 0) {
      firstFailed = "WAITING_HEX_SURFACE_TRANSMISSION_PACKET";
      nextFile = HEX_SURFACE_FILE;
      nextAction = "SEND_CANVAS_HEX_GATE_PACKET_TO_HEX_SURFACE";
      status = "INSPECT_WAITING_HEX_SURFACE_TRANSMISSION_PACKET";
    } else if (!state.hexTransmissionReceivedByInspect && !state.hexSurfacePointerFingerInspectActive) {
      firstFailed = "WAITING_HEX_SURFACE_TO_INSPECT_DELIVERY";
      nextFile = HEX_SURFACE_FILE;
      nextAction = "VERIFY_HEX_SURFACE_DELIVERS_TO_INSPECT_RECEIVER_ALIAS";
      status = "INSPECT_WAITING_HEX_SURFACE_TO_INSPECT_DELIVERY";
    } else if (!state.surfaceSampledByHexSurface && state.surfaceHexExpressionServedCount === 0) {
      firstFailed = "WAITING_HEX_SURFACE_SURFACE_SAMPLE";
      nextFile = HEX_SURFACE_FILE;
      nextAction = "VERIFY_HEX_SURFACE_CONSUMES_SURFACE_EXPRESSION_SOCKET";
      status = "INSPECT_WAITING_HEX_SURFACE_SURFACE_SAMPLE";
    } else if (!state.hubDetected) {
      firstFailed = "WAITING_CANVAS_HUB_SOURCE";
      nextFile = PARENT_HUB_FILE;
      nextAction = "VERIFY_CANVAS_HUB_ALIAS_PUBLICATION";
      status = "INSPECT_READY_BUT_WAITING_CANVAS_HUB_SOURCE";
    } else if (state.hubRegistrationAttempted && !state.hubRegistrationAccepted) {
      firstFailed = "WAITING_CANVAS_HUB_INSPECT_PACKET_ACCEPTANCE";
      nextFile = PARENT_HUB_FILE;
      nextAction = "VERIFY_CANVAS_HUB_ACCEPTS_INSPECT_PACKET";
      status = "INSPECT_READY_BUT_WAITING_CANVAS_HUB_ACCEPTANCE";
    }

    state.firstFailedCoordinate = firstFailed;
    state.recommendedNextFile = nextFile;
    state.recommendedNextRenewalTarget = nextFile;
    state.recommendedNextAction = nextAction;
    state.postgameStatus = status;

    return {
      firstFailedCoordinate: firstFailed,
      recommendedNextFile: nextFile,
      recommendedNextRenewalTarget: nextFile,
      recommendedNextAction: nextAction,
      postgameStatus: status
    };
  }

  function inspectStretch() {
    const boundary = inspectFinger("boundary");
    const mass = inspectFinger("mass");
    const surface = inspectFinger("surface");
    const light = inspectFinger("light");
    const hexSurface = inspectHexSurfaceBridge();
    const surfaceHexExpression = inspectSurfaceHexExpression(surface);

    const summary = {
      timestamp: nowIso(),
      packetType: "HEARTH_CANVAS_FINGER_STRETCH_MANAGER_INSPECTION_SUMMARY",
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      bridgeSequence: clonePlain(BRIDGE_SEQUENCE),

      boundary,
      mass,
      surface,
      light,
      hexSurface,
      surfaceHexExpression,

      hexTransmissionReceivedByInspect: state.hexTransmissionReceivedByInspect,
      hexTransmissionReceivedCount: state.hexTransmissionReceivedCount,
      hexTransmissionAcceptedCount: state.hexTransmissionAcceptedCount,
      hexTransmissionRejectedCount: state.hexTransmissionRejectedCount,
      latestHexTransmissionAt: state.latestHexTransmissionAt,
      latestHexTransmissionPacketType: state.latestHexTransmissionPacketType,
      latestHexTransmissionSourceFile: state.latestHexTransmissionSourceFile,

      inspectionOnly: true,
      expressionFileOnly: true,
      fingerStretchManagerActive: true,
      hexSurfaceBridgeProofActive: true,
      priorFingerMutationBlocked: true,
      upstreamRenewalRequired: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      productionMutationAuthorized: false,
      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    updateFingerState(summary);

    summary.allFingerSourcesObserved = state.allFingerSourcesObserved;
    summary.allFingerReceiptsObserved = state.allFingerReceiptsObserved;
    summary.allFingerPacketsObserved = state.allFingerPacketsObserved;
    summary.allFingerReady = state.allFingerReady;

    summary.surfaceExpressionSocketObserved = state.surfaceExpressionSocketObserved;
    summary.surfaceExpressionSocketReady = state.surfaceExpressionSocketReady;
    summary.surfaceHexExpressionCountsObserved = state.surfaceHexExpressionCountsObserved;
    summary.surfaceHexExpressionRequestCount = state.surfaceHexExpressionRequestCount;
    summary.surfaceHexExpressionServedCount = state.surfaceHexExpressionServedCount;
    summary.surfaceHexExpressionRejectedCount = state.surfaceHexExpressionRejectedCount;
    summary.surfaceLatestHexExpressionRequestSource = state.surfaceLatestHexExpressionRequestSource;
    summary.surfaceSampledByHexSurface = state.surfaceSampledByHexSurface;
    summary.surfaceSampledByHexSurfaceStatus = state.surfaceSampledByHexSurfaceStatus;

    summary.hexSurfaceBridgeReady = state.hexSurfaceBridgeReady;
    summary.hexSurfaceBridgeFailureReason = state.hexSurfaceBridgeFailureReason;
    summary.downstreamExpressionSetReady = state.downstreamExpressionSetReady;
    summary.downstreamExpressionSetStatus = state.downstreamExpressionSetStatus;
    summary.downstreamExpressionSetFailureReason = state.downstreamExpressionSetFailureReason;

    summary.baseCanvasGlobeEvidenceReady = state.baseCanvasGlobeEvidenceReady;
    summary.baseCanvasGlobeExpandable = state.baseCanvasGlobeExpandable;
    summary.baseCanvasVisualizationExpected = state.baseCanvasVisualizationExpected;
    summary.canvasNextIfPixelsRemainBlank = state.canvasNextIfPixelsRemainBlank;
    summary.canvasNotYetBlamed = state.canvasNotYetBlamed;
    summary.downstreamTroubleshootingExpected = state.downstreamTroubleshootingExpected;

    summary.firstFailedCoordinate = state.firstFailedCoordinate;
    summary.recommendedNextFile = state.recommendedNextFile;
    summary.recommendedNextRenewalTarget = state.recommendedNextRenewalTarget;
    summary.recommendedNextAction = state.recommendedNextAction;
    summary.postgameStatus = state.postgameStatus;

    state.inspectionSummary = clonePlain(summary);
    state.updatedAt = summary.timestamp;

    return summary;
  }

  function buildDownstreamExpressionSetPacket() {
    const packet = {
      packetType: "HEARTH_CANVAS_FINGER_DOWNSTREAM_EXPRESSION_SET_PACKET",
      packetName: "HEARTH_CANVAS_FINGER_DOWNSTREAM_EXPRESSION_SET_PACKET_v1_1",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      surfaceFile: SURFACE_FILE,
      lightFile: LIGHT_FILE,
      inspectFile: FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      allFingerSourcesObserved: state.allFingerSourcesObserved,
      allFingerReceiptsObserved: state.allFingerReceiptsObserved,
      allFingerPacketsObserved: state.allFingerPacketsObserved,
      allFingerReady: state.allFingerReady,

      boundaryReady: state.boundaryReady,
      massReady: state.massReady,
      surfaceReady: state.surfaceReady,
      lightReady: state.lightReady,

      surfaceExpressionSocketObserved: state.surfaceExpressionSocketObserved,
      surfaceExpressionSocketReady: state.surfaceExpressionSocketReady,
      surfaceHexExpressionCountsObserved: state.surfaceHexExpressionCountsObserved,
      surfaceHexExpressionRequestCount: state.surfaceHexExpressionRequestCount,
      surfaceHexExpressionServedCount: state.surfaceHexExpressionServedCount,
      surfaceHexExpressionRejectedCount: state.surfaceHexExpressionRejectedCount,
      surfaceLatestHexExpressionRequestSource: state.surfaceLatestHexExpressionRequestSource,
      surfaceSampledByHexSurface: state.surfaceSampledByHexSurface,
      surfaceSampledByHexSurfaceStatus: state.surfaceSampledByHexSurfaceStatus,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceRecognized: state.hexSurfaceRecognized,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceTransmissionActive: state.hexSurfaceTransmissionActive,
      hexSurfaceTransmissionCount: state.hexSurfaceTransmissionCount,
      hexSurfaceDeliveryCount: state.hexSurfaceDeliveryCount,
      hexSurfaceLastTransmissionObserved: state.hexSurfaceLastTransmissionObserved,
      hexSurfaceBridgeReady: state.hexSurfaceBridgeReady,
      hexSurfaceBridgeFailureReason: state.hexSurfaceBridgeFailureReason,

      hexTransmissionReceivedByInspect: state.hexTransmissionReceivedByInspect,
      hexTransmissionReceivedCount: state.hexTransmissionReceivedCount,
      hexTransmissionAcceptedCount: state.hexTransmissionAcceptedCount,

      downstreamExpressionSetReady: state.downstreamExpressionSetReady,
      downstreamExpressionSetStatus: state.downstreamExpressionSetStatus,
      downstreamExpressionSetFailureReason: state.downstreamExpressionSetFailureReason,

      canvasNextIfPixelsRemainBlank: state.canvasNextIfPixelsRemainBlank,
      canvasNotYetBlamed: state.canvasNotYetBlamed,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      proofLayerOnly: true,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.downstreamExpressionSetPacket = clonePlain(packet);
    return packet;
  }

  function buildInspectionPacket() {
    const summary = inspectStretch();
    const downstreamExpressionSetPacket = buildDownstreamExpressionSetPacket();

    const packet = {
      packetType: "HEARTH_CANVAS_FINGER_INSPECT_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousPublicContract: PREVIOUS_PUBLIC_CONTRACT,
      previousPublicReceipt: PREVIOUS_PUBLIC_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      bridgeSequence: clonePlain(BRIDGE_SEQUENCE),

      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      surfaceFile: SURFACE_FILE,
      lightFile: LIGHT_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      boundaryObserved: state.boundaryObserved,
      boundaryReceiptObserved: state.boundaryReceiptObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryReady: state.boundaryReady,
      boundaryNoFalseClaims: state.boundaryNoFalseClaims,

      massObserved: state.massObserved,
      massReceiptObserved: state.massReceiptObserved,
      massPacketObserved: state.massPacketObserved,
      massReady: state.massReady,
      massNoFalseClaims: state.massNoFalseClaims,

      surfaceObserved: state.surfaceObserved,
      surfaceReceiptObserved: state.surfaceReceiptObserved,
      surfacePacketObserved: state.surfacePacketObserved,
      surfaceReady: state.surfaceReady,
      surfaceNoFalseClaims: state.surfaceNoFalseClaims,
      surfaceExpressionSocketObserved: state.surfaceExpressionSocketObserved,
      surfaceExpressionSocketReady: state.surfaceExpressionSocketReady,
      surfaceHexExpressionRequestCount: state.surfaceHexExpressionRequestCount,
      surfaceHexExpressionServedCount: state.surfaceHexExpressionServedCount,
      surfaceHexExpressionRejectedCount: state.surfaceHexExpressionRejectedCount,
      surfaceLatestHexExpressionRequestSource: state.surfaceLatestHexExpressionRequestSource,
      surfaceSampledByHexSurface: state.surfaceSampledByHexSurface,
      surfaceSampledByHexSurfaceStatus: state.surfaceSampledByHexSurfaceStatus,

      lightObserved: state.lightObserved,
      lightReceiptObserved: state.lightReceiptObserved,
      lightPacketObserved: state.lightPacketObserved,
      lightReady: state.lightReady,
      lightNoFalseClaims: state.lightNoFalseClaims,

      allFingerSourcesObserved: state.allFingerSourcesObserved,
      allFingerReceiptsObserved: state.allFingerReceiptsObserved,
      allFingerPacketsObserved: state.allFingerPacketsObserved,
      allFingerReady: state.allFingerReady,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceReceiptObserved: state.hexSurfaceReceiptObserved,
      hexSurfaceRecognized: state.hexSurfaceRecognized,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceGateActive: state.hexSurfaceGateActive,
      hexSurfaceTransmissionActive: state.hexSurfaceTransmissionActive,
      hexSurfaceTransmissionCount: state.hexSurfaceTransmissionCount,
      hexSurfaceDeliveryCount: state.hexSurfaceDeliveryCount,
      hexSurfacePointerFingerObservedCount: state.hexSurfacePointerFingerObservedCount,
      hexSurfacePointerFingerActiveCount: state.hexSurfacePointerFingerActiveCount,
      hexSurfacePointerFingerInspectObserved: state.hexSurfacePointerFingerInspectObserved,
      hexSurfacePointerFingerInspectActive: state.hexSurfacePointerFingerInspectActive,
      hexSurfaceLastTransmissionObserved: state.hexSurfaceLastTransmissionObserved,
      hexSurfaceLastTransmissionPacketType: state.hexSurfaceLastTransmissionPacketType,
      hexSurfaceBridgeReady: state.hexSurfaceBridgeReady,
      hexSurfaceBridgeFailureReason: state.hexSurfaceBridgeFailureReason,

      hexTransmissionReceivedByInspect: state.hexTransmissionReceivedByInspect,
      hexTransmissionReceivedCount: state.hexTransmissionReceivedCount,
      hexTransmissionAcceptedCount: state.hexTransmissionAcceptedCount,
      hexTransmissionRejectedCount: state.hexTransmissionRejectedCount,
      latestHexTransmissionAt: state.latestHexTransmissionAt,
      latestHexTransmissionPacketType: state.latestHexTransmissionPacketType,
      latestHexTransmissionSourceFile: state.latestHexTransmissionSourceFile,

      downstreamExpressionSetReady: state.downstreamExpressionSetReady,
      downstreamExpressionSetStatus: state.downstreamExpressionSetStatus,
      downstreamExpressionSetFailureReason: state.downstreamExpressionSetFailureReason,
      downstreamExpressionSetPacket: clonePlain(downstreamExpressionSetPacket),

      baseCanvasGlobeEvidenceReady: state.baseCanvasGlobeEvidenceReady,
      baseCanvasGlobeExpandable: state.baseCanvasGlobeExpandable,
      baseCanvasVisualizationExpected: state.baseCanvasVisualizationExpected,
      canvasNextIfPixelsRemainBlank: state.canvasNextIfPixelsRemainBlank,
      canvasNotYetBlamed: state.canvasNotYetBlamed,
      downstreamTroubleshootingExpected: state.downstreamTroubleshootingExpected,

      inspectionSummary: clonePlain(summary),

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      inspectionOnly: true,
      expressionFileOnly: true,
      fingerStretchManagerActive: true,
      hexSurfaceBridgeProofActive: true,
      priorFingerMutationBlocked: true,
      upstreamRenewalRequired: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      productionMutationAuthorized: false,
      noClaimsPreserved: true,

      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.inspectionPacket = clonePlain(packet);
    return packet;
  }

  function packetHasForbiddenClaim(packet) {
    return !hasNoFalseClaims(packet, null);
  }

  function recordHexSurfaceTransmission(packet = {}, options = {}) {
    state.hexTransmissionReceivedCount += 1;

    const p = isObject(packet) ? packet : {};
    const forbidden = packetHasForbiddenClaim(p);

    if (forbidden) {
      state.hexTransmissionRejectedCount += 1;
      state.latestHexTransmissionReason = "REJECTED_FORBIDDEN_FINAL_CLAIM";
    } else {
      state.hexTransmissionAcceptedCount += 1;
      state.hexTransmissionReceivedByInspect = true;
      state.latestHexTransmissionReason = "ACCEPTED_HEX_SURFACE_TRANSMISSION";
      state.lastHexSurfaceTransmissionPacket = clonePlain(p);
    }

    state.latestHexTransmissionAt = nowIso();
    state.latestHexTransmissionPacketType = safeString(p.packetType || p.type || "UNKNOWN_PACKET");
    state.latestHexTransmissionSourceFile = safeString(p.sourceFile || p.hexSurfaceFile || options.sourceFile || "UNKNOWN");

    record(forbidden ? "INSPECT_REJECTED_HEX_SURFACE_TRANSMISSION" : "INSPECT_ACCEPTED_HEX_SURFACE_TRANSMISSION", {
      packetType: state.latestHexTransmissionPacketType,
      sourceFile: state.latestHexTransmissionSourceFile,
      reason: state.latestHexTransmissionReason
    });

    inspectStretch();
    buildDownstreamExpressionSetPacket();
    updateDataset();

    return {
      ok: !forbidden,
      accepted: !forbidden,
      rejected: forbidden,
      reason: state.latestHexTransmissionReason,
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      receiver: "inspect-finger-hex-surface-transmission",
      hexTransmissionReceivedByInspect: state.hexTransmissionReceivedByInspect,
      hexTransmissionReceivedCount: state.hexTransmissionReceivedCount,
      hexTransmissionAcceptedCount: state.hexTransmissionAcceptedCount,
      hexTransmissionRejectedCount: state.hexTransmissionRejectedCount,
      downstreamExpressionSetReady: state.downstreamExpressionSetReady,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,
      ...FINAL_FALSE
    };
  }

  function receiveHexSurfaceTransmissionPacket(packet = {}, options = {}) {
    return recordHexSurfaceTransmission(packet, {
      ...options,
      method: "receiveHexSurfaceTransmissionPacket"
    });
  }

  function consumeHexSurfaceTransmissionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "consumeHexSurfaceTransmissionPacket"
    });
  }

  function receivePointerFingerTransmissionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "receivePointerFingerTransmissionPacket"
    });
  }

  function consumePointerFingerTransmissionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "consumePointerFingerTransmissionPacket"
    });
  }

  function receiveCanvasFingerPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "receiveCanvasFingerPacket"
    });
  }

  function consumeCanvasFingerPacket(packet = {}, options = {}) {
    return receiveCanvasFingerPacket(packet, {
      ...options,
      method: "consumeCanvasFingerPacket"
    });
  }

  function receiveHexGatePacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "receiveHexGatePacket"
    });
  }

  function consumeHexGatePacket(packet = {}, options = {}) {
    return receiveHexGatePacket(packet, {
      ...options,
      method: "consumeHexGatePacket"
    });
  }

  function acceptHexGatePacket(packet = {}, options = {}) {
    return receiveHexGatePacket(packet, {
      ...options,
      method: "acceptHexGatePacket"
    });
  }

  function receiveFramePacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "receiveFramePacket"
    });
  }

  function consumeFramePacket(packet = {}, options = {}) {
    return receiveFramePacket(packet, {
      ...options,
      method: "consumeFramePacket"
    });
  }

  function receiveInspectPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "receiveInspectPacket"
    });
  }

  function receiveSurfacePacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "receiveSurfacePacket"
    });
  }

  function receive(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      method: "receive"
    });
  }

  function findCanvasHub() {
    for (const sourceName of HUB_SOURCE_NAMES) {
      const candidate = readPath(sourceName);
      if (candidate && isObject(candidate)) {
        return {
          hub: candidate,
          sourceName
        };
      }
    }

    return {
      hub: null,
      sourceName: "NONE"
    };
  }

  function registerWithCanvasHub() {
    const packet = buildInspectionPacket();
    const found = findCanvasHub();

    state.hubDetected = Boolean(found.hub);
    state.hubSourceName = found.sourceName;
    state.hubRegistrationAttempted = true;
    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationError = "";

    if (!found.hub) {
      state.hubRegistrationHeldReason = "CANVAS_HUB_NOT_FOUND";
      resolvePostgame();

      record("INSPECT_FINGER_HUB_NOT_FOUND", {
        attemptedSources: clonePlain(HUB_SOURCE_NAMES)
      });

      buildInspectionPacket();
      return false;
    }

    for (const method of HUB_INTAKE_METHODS) {
      if (!isFunction(found.hub[method])) continue;

      try {
        const response = found.hub[method](clonePlain(packet));

        state.hubRegistrationAccepted = response !== false;
        state.hubRegistrationMethod = method;
        state.hubRegistrationHeldReason = state.hubRegistrationAccepted
          ? "NONE"
          : "CANVAS_HUB_REJECTED_INSPECT_PACKET";
        state.lastRegistrationResponse = clonePlain(response);

        if (state.hubRegistrationAccepted) {
          state.firstFailedCoordinate = state.downstreamExpressionSetReady
            ? "NONE_DOWNSTREAM_EXPRESSION_SET_REGISTERED"
            : state.firstFailedCoordinate;
          state.recommendedNextFile = state.downstreamExpressionSetReady ? PARENT_HUB_FILE : state.recommendedNextFile;
          state.recommendedNextRenewalTarget = state.downstreamExpressionSetReady ? PARENT_HUB_FILE : state.recommendedNextRenewalTarget;
          state.recommendedNextAction = state.downstreamExpressionSetReady
            ? "IF_PIXELS_REMAIN_BLANK_AUDIT_CANVAS_DRAW_PATH"
            : state.recommendedNextAction;
          state.postgameStatus = state.downstreamExpressionSetReady
            ? "INSPECT_REGISTERED_DOWNSTREAM_EXPRESSION_SET_READY"
            : state.postgameStatus;
        } else {
          resolvePostgame();
        }

        record("INSPECT_FINGER_HUB_REGISTRATION_ATTEMPT_COMPLETE", {
          hubSourceName: found.sourceName,
          method,
          accepted: state.hubRegistrationAccepted
        });

        buildInspectionPacket();
        return state.hubRegistrationAccepted;
      } catch (error) {
        state.hubRegistrationError = error && error.message ? String(error.message) : String(error);
        recordError("INSPECT_FINGER_HUB_REGISTRATION_METHOD_FAILED", error, {
          hubSourceName: found.sourceName,
          method
        });
      }
    }

    state.hubRegistrationAccepted = false;
    state.hubRegistrationMethod = "NONE";
    state.hubRegistrationHeldReason = "CANVAS_HUB_INTAKE_NOT_FOUND";
    resolvePostgame();

    record("INSPECT_FINGER_HUB_INTAKE_NOT_FOUND", {
      hubSourceName: found.sourceName,
      attemptedMethods: clonePlain(HUB_INTAKE_METHODS)
    });

    buildInspectionPacket();
    return false;
  }

  function getInspectionSummary(options = {}) {
    if (options.refresh === true || !state.inspectionSummary) return clonePlain(inspectStretch());
    return clonePlain(state.inspectionSummary);
  }

  function getInspectionPacket(options = {}) {
    if (options.refresh === true || !state.inspectionPacket) return clonePlain(buildInspectionPacket());
    return clonePlain(state.inspectionPacket);
  }

  function getDownstreamExpressionSetPacket(options = {}) {
    if (options.refresh === true || !state.downstreamExpressionSetPacket) {
      inspectStretch();
      return clonePlain(buildDownstreamExpressionSetPacket());
    }

    return clonePlain(state.downstreamExpressionSetPacket);
  }

  function getState() {
    return clonePlain(state);
  }

  function read() {
    return getReceiptLight();
  }

  function getReceiptLight() {
    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousPublicContract: PREVIOUS_PUBLIC_CONTRACT,
      previousPublicReceipt: PREVIOUS_PUBLIC_RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,

      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      surfaceFile: SURFACE_FILE,
      lightFile: LIGHT_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      inspectFingerLoaded: state.inspectFingerLoaded,
      inspectFingerActive: state.inspectFingerActive,
      inspectionOnly: state.inspectionOnly,
      expressionFileOnly: state.expressionFileOnly,
      fingerStretchManagerActive: state.fingerStretchManagerActive,
      hexSurfaceBridgeProofActive: state.hexSurfaceBridgeProofActive,
      priorFingerMutationBlocked: state.priorFingerMutationBlocked,
      upstreamRenewalRequired: state.upstreamRenewalRequired,

      boundaryObserved: state.boundaryObserved,
      boundaryReceiptObserved: state.boundaryReceiptObserved,
      boundaryPacketObserved: state.boundaryPacketObserved,
      boundaryReady: state.boundaryReady,
      boundaryNoFalseClaims: state.boundaryNoFalseClaims,

      massObserved: state.massObserved,
      massReceiptObserved: state.massReceiptObserved,
      massPacketObserved: state.massPacketObserved,
      massReady: state.massReady,
      massNoFalseClaims: state.massNoFalseClaims,

      surfaceObserved: state.surfaceObserved,
      surfaceReceiptObserved: state.surfaceReceiptObserved,
      surfacePacketObserved: state.surfacePacketObserved,
      surfaceReady: state.surfaceReady,
      surfaceNoFalseClaims: state.surfaceNoFalseClaims,
      surfaceExpressionSocketObserved: state.surfaceExpressionSocketObserved,
      surfaceExpressionSocketReady: state.surfaceExpressionSocketReady,
      surfaceHexExpressionCountsObserved: state.surfaceHexExpressionCountsObserved,
      surfaceHexExpressionRequestCount: state.surfaceHexExpressionRequestCount,
      surfaceHexExpressionServedCount: state.surfaceHexExpressionServedCount,
      surfaceHexExpressionRejectedCount: state.surfaceHexExpressionRejectedCount,
      surfaceLatestHexExpressionRequestSource: state.surfaceLatestHexExpressionRequestSource,
      surfaceLatestHexExpressionAt: state.surfaceLatestHexExpressionAt,
      surfaceLatestHexExpressionCellId: state.surfaceLatestHexExpressionCellId,
      surfaceLatestHexExpressionMaterialClass: state.surfaceLatestHexExpressionMaterialClass,
      surfaceSampledByHexSurface: state.surfaceSampledByHexSurface,
      surfaceSampledByHexSurfaceStatus: state.surfaceSampledByHexSurfaceStatus,

      lightObserved: state.lightObserved,
      lightReceiptObserved: state.lightReceiptObserved,
      lightPacketObserved: state.lightPacketObserved,
      lightReady: state.lightReady,
      lightNoFalseClaims: state.lightNoFalseClaims,

      allFingerSourcesObserved: state.allFingerSourcesObserved,
      allFingerReceiptsObserved: state.allFingerReceiptsObserved,
      allFingerPacketsObserved: state.allFingerPacketsObserved,
      allFingerReady: state.allFingerReady,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceReceiptObserved: state.hexSurfaceReceiptObserved,
      hexSurfaceRecognized: state.hexSurfaceRecognized,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceSupportsPointerFingerTransmission: state.hexSurfaceSupportsPointerFingerTransmission,
      hexSurfaceGateActive: state.hexSurfaceGateActive,
      hexSurfaceTransmissionActive: state.hexSurfaceTransmissionActive,
      hexSurfaceAcceptedPacketCount: state.hexSurfaceAcceptedPacketCount,
      hexSurfaceTransmissionCount: state.hexSurfaceTransmissionCount,
      hexSurfaceDeliveryCount: state.hexSurfaceDeliveryCount,
      hexSurfacePointerFingerObservedCount: state.hexSurfacePointerFingerObservedCount,
      hexSurfacePointerFingerActiveCount: state.hexSurfacePointerFingerActiveCount,
      hexSurfacePointerFingerInspectObserved: state.hexSurfacePointerFingerInspectObserved,
      hexSurfacePointerFingerInspectActive: state.hexSurfacePointerFingerInspectActive,
      hexSurfaceTransmissionStatus: state.hexSurfaceTransmissionStatus,
      hexSurfaceTransmissionMethod: state.hexSurfaceTransmissionMethod,
      hexSurfaceTransmissionReason: state.hexSurfaceTransmissionReason,
      hexSurfaceLastTransmissionObserved: state.hexSurfaceLastTransmissionObserved,
      hexSurfaceLastTransmissionPacketType: state.hexSurfaceLastTransmissionPacketType,
      hexSurfaceLastTransmissionAt: state.hexSurfaceLastTransmissionAt,
      hexSurfaceBridgeReady: state.hexSurfaceBridgeReady,
      hexSurfaceBridgeFailureReason: state.hexSurfaceBridgeFailureReason,

      hexTransmissionReceivedByInspect: state.hexTransmissionReceivedByInspect,
      hexTransmissionReceivedCount: state.hexTransmissionReceivedCount,
      hexTransmissionAcceptedCount: state.hexTransmissionAcceptedCount,
      hexTransmissionRejectedCount: state.hexTransmissionRejectedCount,
      latestHexTransmissionAt: state.latestHexTransmissionAt,
      latestHexTransmissionPacketType: state.latestHexTransmissionPacketType,
      latestHexTransmissionSourceFile: state.latestHexTransmissionSourceFile,
      latestHexTransmissionReason: state.latestHexTransmissionReason,

      downstreamExpressionSetReady: state.downstreamExpressionSetReady,
      downstreamExpressionSetStatus: state.downstreamExpressionSetStatus,
      downstreamExpressionSetFailureReason: state.downstreamExpressionSetFailureReason,

      baseCanvasGlobeEvidenceReady: state.baseCanvasGlobeEvidenceReady,
      baseCanvasGlobeExpandable: state.baseCanvasGlobeExpandable,
      baseCanvasVisualizationExpected: state.baseCanvasVisualizationExpected,
      canvasNextIfPixelsRemainBlank: state.canvasNextIfPixelsRemainBlank,
      canvasNotYetBlamed: state.canvasNotYetBlamed,
      downstreamTroubleshootingExpected: state.downstreamTroubleshootingExpected,

      hubDetected: state.hubDetected,
      hubSourceName: state.hubSourceName,
      hubRegistrationAttempted: state.hubRegistrationAttempted,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      hubRegistrationMethod: state.hubRegistrationMethod,
      hubRegistrationHeldReason: state.hubRegistrationHeldReason,
      hubRegistrationError: state.hubRegistrationError,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      supportsHexSurfaceTransmissionReceiver: true,
      supportsPointerFingerTransmissionReceiver: true,
      supportsDownstreamExpressionSetPacket: true,
      supportsSurfaceHexExpressionProof: true,
      supportsFingerStretchManager: true,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      currentReceipt: true,
      fingerSequence: clonePlain(FINGER_SEQUENCE),
      bridgeSequence: clonePlain(BRIDGE_SEQUENCE),
      hubSourceNames: clonePlain(HUB_SOURCE_NAMES),
      hubIntakeMethods: clonePlain(HUB_INTAKE_METHODS),
      sourceNames: clonePlain(FINGER_SOURCE_NAMES),
      hexSurfaceSourceNames: clonePlain(HEX_SURFACE_SOURCE_NAMES),
      inspectionSummary: clonePlain(state.inspectionSummary),
      inspectionPacket: clonePlain(state.inspectionPacket),
      downstreamExpressionSetPacket: clonePlain(state.downstreamExpressionSetPacket),
      boundary: clonePlain(state.boundary),
      mass: clonePlain(state.mass),
      surface: clonePlain(state.surface),
      light: clonePlain(state.light),
      hexSurface: clonePlain(state.hexSurface),
      surfaceHexExpression: clonePlain(state.surfaceHexExpression),
      lastHexSurfaceTransmissionPacket: clonePlain(state.lastHexSurfaceTransmissionPacket),
      lastRegistrationResponse: clonePlain(state.lastRegistrationResponse),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_INSPECT_STRETCH_MANAGER_HEX_SURFACE_PROOF_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("internalImplementationContract", r.internalImplementationContract),
      line("internalImplementationReceipt", r.internalImplementationReceipt),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("diagnosticRoute", r.diagnosticRoute),
      line("parentHubFile", r.parentHubFile),
      "",
      "FINGER",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("fingerStretchTotal", r.fingerStretchTotal),
      line("inspectionOnly", r.inspectionOnly),
      line("expressionFileOnly", r.expressionFileOnly),
      line("fingerStretchManagerActive", r.fingerStretchManagerActive),
      line("hexSurfaceBridgeProofActive", r.hexSurfaceBridgeProofActive),
      line("priorFingerMutationBlocked", r.priorFingerMutationBlocked),
      line("upstreamRenewalRequired", r.upstreamRenewalRequired),
      "",
      "BOUNDARY",
      line("boundaryObserved", r.boundaryObserved),
      line("boundaryReceiptObserved", r.boundaryReceiptObserved),
      line("boundaryPacketObserved", r.boundaryPacketObserved),
      line("boundaryReady", r.boundaryReady),
      line("boundaryNoFalseClaims", r.boundaryNoFalseClaims),
      "",
      "MASS",
      line("massObserved", r.massObserved),
      line("massReceiptObserved", r.massReceiptObserved),
      line("massPacketObserved", r.massPacketObserved),
      line("massReady", r.massReady),
      line("massNoFalseClaims", r.massNoFalseClaims),
      "",
      "SURFACE",
      line("surfaceObserved", r.surfaceObserved),
      line("surfaceReceiptObserved", r.surfaceReceiptObserved),
      line("surfacePacketObserved", r.surfacePacketObserved),
      line("surfaceReady", r.surfaceReady),
      line("surfaceNoFalseClaims", r.surfaceNoFalseClaims),
      line("surfaceExpressionSocketObserved", r.surfaceExpressionSocketObserved),
      line("surfaceExpressionSocketReady", r.surfaceExpressionSocketReady),
      line("surfaceHexExpressionRequestCount", r.surfaceHexExpressionRequestCount),
      line("surfaceHexExpressionServedCount", r.surfaceHexExpressionServedCount),
      line("surfaceHexExpressionRejectedCount", r.surfaceHexExpressionRejectedCount),
      line("surfaceLatestHexExpressionRequestSource", r.surfaceLatestHexExpressionRequestSource),
      line("surfaceSampledByHexSurface", r.surfaceSampledByHexSurface),
      line("surfaceSampledByHexSurfaceStatus", r.surfaceSampledByHexSurfaceStatus),
      "",
      "LIGHT",
      line("lightObserved", r.lightObserved),
      line("lightReceiptObserved", r.lightReceiptObserved),
      line("lightPacketObserved", r.lightPacketObserved),
      line("lightReady", r.lightReady),
      line("lightNoFalseClaims", r.lightNoFalseClaims),
      "",
      "HEX_SURFACE_BRIDGE",
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceReceiptObserved", r.hexSurfaceReceiptObserved),
      line("hexSurfaceRecognized", r.hexSurfaceRecognized),
      line("hexSurfaceContract", r.hexSurfaceContract),
      line("hexSurfaceGateActive", r.hexSurfaceGateActive),
      line("hexSurfaceTransmissionActive", r.hexSurfaceTransmissionActive),
      line("hexSurfaceAcceptedPacketCount", r.hexSurfaceAcceptedPacketCount),
      line("hexSurfaceTransmissionCount", r.hexSurfaceTransmissionCount),
      line("hexSurfaceDeliveryCount", r.hexSurfaceDeliveryCount),
      line("hexSurfacePointerFingerObservedCount", r.hexSurfacePointerFingerObservedCount),
      line("hexSurfacePointerFingerActiveCount", r.hexSurfacePointerFingerActiveCount),
      line("hexSurfacePointerFingerInspectObserved", r.hexSurfacePointerFingerInspectObserved),
      line("hexSurfacePointerFingerInspectActive", r.hexSurfacePointerFingerInspectActive),
      line("hexSurfaceLastTransmissionObserved", r.hexSurfaceLastTransmissionObserved),
      line("hexSurfaceBridgeReady", r.hexSurfaceBridgeReady),
      line("hexSurfaceBridgeFailureReason", r.hexSurfaceBridgeFailureReason),
      "",
      "INSPECT_TRANSMISSION_RECEIVER",
      line("hexTransmissionReceivedByInspect", r.hexTransmissionReceivedByInspect),
      line("hexTransmissionReceivedCount", r.hexTransmissionReceivedCount),
      line("hexTransmissionAcceptedCount", r.hexTransmissionAcceptedCount),
      line("hexTransmissionRejectedCount", r.hexTransmissionRejectedCount),
      line("latestHexTransmissionPacketType", r.latestHexTransmissionPacketType),
      line("latestHexTransmissionSourceFile", r.latestHexTransmissionSourceFile),
      "",
      "DOWNSTREAM_EXPRESSION_SET",
      line("allFingerSourcesObserved", r.allFingerSourcesObserved),
      line("allFingerReceiptsObserved", r.allFingerReceiptsObserved),
      line("allFingerPacketsObserved", r.allFingerPacketsObserved),
      line("allFingerReady", r.allFingerReady),
      line("downstreamExpressionSetReady", r.downstreamExpressionSetReady),
      line("downstreamExpressionSetStatus", r.downstreamExpressionSetStatus),
      line("downstreamExpressionSetFailureReason", r.downstreamExpressionSetFailureReason),
      line("baseCanvasGlobeEvidenceReady", r.baseCanvasGlobeEvidenceReady),
      line("baseCanvasGlobeExpandable", r.baseCanvasGlobeExpandable),
      line("baseCanvasVisualizationExpected", r.baseCanvasVisualizationExpected),
      line("canvasNextIfPixelsRemainBlank", r.canvasNextIfPixelsRemainBlank),
      line("canvasNotYetBlamed", r.canvasNotYetBlamed),
      "",
      "HUB_REGISTRATION",
      line("hubDetected", r.hubDetected),
      line("hubSourceName", r.hubSourceName),
      line("hubRegistrationAttempted", r.hubRegistrationAttempted),
      line("hubRegistrationAccepted", r.hubRegistrationAccepted),
      line("hubRegistrationMethod", r.hubRegistrationMethod),
      line("hubRegistrationHeldReason", r.hubRegistrationHeldReason),
      line("hubRegistrationError", r.hubRegistrationError),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextRenewalTarget", r.recommendedNextRenewalTarget),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("noClaimsPreserved", r.noClaimsPreserved),
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("terrainTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("mountainTruthClaimed", false),
      line("biomeTruthClaimed", false),
      line("atmosphereTruthClaimed", false),
      line("compositeTruthClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerInspectLoaded", "true");
    setDataset("hearthCanvasFingerInspectContract", CONTRACT);
    setDataset("hearthCanvasFingerInspectReceipt", RECEIPT);
    setDataset("hearthCanvasFingerInspectInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasFingerInspectInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasFingerInspectVersion", VERSION);
    setDataset("hearthCanvasFingerInspectFile", FILE);
    setDataset("hearthCanvasFingerInspectActive", String(state.inspectFingerActive));
    setDataset("hearthCanvasFingerInspectOnly", String(state.inspectionOnly));
    setDataset("hearthCanvasFingerInspectFingerStretchManagerActive", String(state.fingerStretchManagerActive));
    setDataset("hearthCanvasFingerInspectHexSurfaceBridgeProofActive", String(state.hexSurfaceBridgeProofActive));
    setDataset("hearthCanvasFingerInspectPriorFingerMutationBlocked", String(state.priorFingerMutationBlocked));
    setDataset("hearthCanvasFingerInspectUpstreamRenewalRequired", String(state.upstreamRenewalRequired));

    setDataset("hearthCanvasFingerInspectBoundaryObserved", String(state.boundaryObserved));
    setDataset("hearthCanvasFingerInspectBoundaryReceiptObserved", String(state.boundaryReceiptObserved));
    setDataset("hearthCanvasFingerInspectBoundaryPacketObserved", String(state.boundaryPacketObserved));
    setDataset("hearthCanvasFingerInspectBoundaryReady", String(state.boundaryReady));

    setDataset("hearthCanvasFingerInspectMassObserved", String(state.massObserved));
    setDataset("hearthCanvasFingerInspectMassReceiptObserved", String(state.massReceiptObserved));
    setDataset("hearthCanvasFingerInspectMassPacketObserved", String(state.massPacketObserved));
    setDataset("hearthCanvasFingerInspectMassReady", String(state.massReady));

    setDataset("hearthCanvasFingerInspectSurfaceObserved", String(state.surfaceObserved));
    setDataset("hearthCanvasFingerInspectSurfaceReceiptObserved", String(state.surfaceReceiptObserved));
    setDataset("hearthCanvasFingerInspectSurfacePacketObserved", String(state.surfacePacketObserved));
    setDataset("hearthCanvasFingerInspectSurfaceReady", String(state.surfaceReady));
    setDataset("hearthCanvasFingerInspectSurfaceExpressionSocketObserved", String(state.surfaceExpressionSocketObserved));
    setDataset("hearthCanvasFingerInspectSurfaceExpressionSocketReady", String(state.surfaceExpressionSocketReady));
    setDataset("hearthCanvasFingerInspectSurfaceHexExpressionRequestCount", String(state.surfaceHexExpressionRequestCount));
    setDataset("hearthCanvasFingerInspectSurfaceHexExpressionServedCount", String(state.surfaceHexExpressionServedCount));
    setDataset("hearthCanvasFingerInspectSurfaceHexExpressionRejectedCount", String(state.surfaceHexExpressionRejectedCount));
    setDataset("hearthCanvasFingerInspectSurfaceLatestHexExpressionRequestSource", state.surfaceLatestHexExpressionRequestSource);
    setDataset("hearthCanvasFingerInspectSurfaceSampledByHexSurface", String(state.surfaceSampledByHexSurface));
    setDataset("hearthCanvasFingerInspectSurfaceSampledByHexSurfaceStatus", state.surfaceSampledByHexSurfaceStatus);

    setDataset("hearthCanvasFingerInspectLightObserved", String(state.lightObserved));
    setDataset("hearthCanvasFingerInspectLightReceiptObserved", String(state.lightReceiptObserved));
    setDataset("hearthCanvasFingerInspectLightPacketObserved", String(state.lightPacketObserved));
    setDataset("hearthCanvasFingerInspectLightReady", String(state.lightReady));

    setDataset("hearthCanvasFingerInspectAllSourcesObserved", String(state.allFingerSourcesObserved));
    setDataset("hearthCanvasFingerInspectAllReceiptsObserved", String(state.allFingerReceiptsObserved));
    setDataset("hearthCanvasFingerInspectAllPacketsObserved", String(state.allFingerPacketsObserved));
    setDataset("hearthCanvasFingerInspectAllReady", String(state.allFingerReady));

    setDataset("hearthCanvasFingerInspectHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthCanvasFingerInspectHexSurfaceReceiptObserved", String(state.hexSurfaceReceiptObserved));
    setDataset("hearthCanvasFingerInspectHexSurfaceRecognized", String(state.hexSurfaceRecognized));
    setDataset("hearthCanvasFingerInspectHexSurfaceContract", state.hexSurfaceContract);
    setDataset("hearthCanvasFingerInspectHexSurfaceGateActive", String(state.hexSurfaceGateActive));
    setDataset("hearthCanvasFingerInspectHexSurfaceTransmissionActive", String(state.hexSurfaceTransmissionActive));
    setDataset("hearthCanvasFingerInspectHexSurfaceTransmissionCount", String(state.hexSurfaceTransmissionCount));
    setDataset("hearthCanvasFingerInspectHexSurfaceDeliveryCount", String(state.hexSurfaceDeliveryCount));
    setDataset("hearthCanvasFingerInspectHexSurfacePointerFingerObservedCount", String(state.hexSurfacePointerFingerObservedCount));
    setDataset("hearthCanvasFingerInspectHexSurfacePointerFingerActiveCount", String(state.hexSurfacePointerFingerActiveCount));
    setDataset("hearthCanvasFingerInspectHexSurfacePointerFingerInspectObserved", String(state.hexSurfacePointerFingerInspectObserved));
    setDataset("hearthCanvasFingerInspectHexSurfacePointerFingerInspectActive", String(state.hexSurfacePointerFingerInspectActive));
    setDataset("hearthCanvasFingerInspectHexSurfaceLastTransmissionObserved", String(state.hexSurfaceLastTransmissionObserved));
    setDataset("hearthCanvasFingerInspectHexSurfaceBridgeReady", String(state.hexSurfaceBridgeReady));
    setDataset("hearthCanvasFingerInspectHexSurfaceBridgeFailureReason", state.hexSurfaceBridgeFailureReason);

    setDataset("hearthCanvasFingerInspectHexTransmissionReceivedByInspect", String(state.hexTransmissionReceivedByInspect));
    setDataset("hearthCanvasFingerInspectHexTransmissionReceivedCount", String(state.hexTransmissionReceivedCount));
    setDataset("hearthCanvasFingerInspectHexTransmissionAcceptedCount", String(state.hexTransmissionAcceptedCount));
    setDataset("hearthCanvasFingerInspectHexTransmissionRejectedCount", String(state.hexTransmissionRejectedCount));
    setDataset("hearthCanvasFingerInspectLatestHexTransmissionPacketType", state.latestHexTransmissionPacketType);
    setDataset("hearthCanvasFingerInspectLatestHexTransmissionSourceFile", state.latestHexTransmissionSourceFile);

    setDataset("hearthCanvasFingerInspectDownstreamExpressionSetReady", String(state.downstreamExpressionSetReady));
    setDataset("hearthCanvasFingerInspectDownstreamExpressionSetStatus", state.downstreamExpressionSetStatus);
    setDataset("hearthCanvasFingerInspectDownstreamExpressionSetFailureReason", state.downstreamExpressionSetFailureReason);
    setDataset("hearthCanvasFingerInspectBaseCanvasGlobeEvidenceReady", String(state.baseCanvasGlobeEvidenceReady));
    setDataset("hearthCanvasFingerInspectBaseCanvasGlobeExpandable", String(state.baseCanvasGlobeExpandable));
    setDataset("hearthCanvasFingerInspectBaseCanvasVisualizationExpected", String(state.baseCanvasVisualizationExpected));
    setDataset("hearthCanvasFingerInspectCanvasNextIfPixelsRemainBlank", String(state.canvasNextIfPixelsRemainBlank));
    setDataset("hearthCanvasFingerInspectCanvasNotYetBlamed", String(state.canvasNotYetBlamed));
    setDataset("hearthCanvasFingerInspectDownstreamTroubleshootingExpected", String(state.downstreamTroubleshootingExpected));

    setDataset("hearthCanvasFingerInspectHubDetected", String(state.hubDetected));
    setDataset("hearthCanvasFingerInspectHubSourceName", state.hubSourceName);
    setDataset("hearthCanvasFingerInspectHubRegistrationAttempted", String(state.hubRegistrationAttempted));
    setDataset("hearthCanvasFingerInspectHubRegistrationAccepted", String(state.hubRegistrationAccepted));
    setDataset("hearthCanvasFingerInspectHubRegistrationMethod", state.hubRegistrationMethod);
    setDataset("hearthCanvasFingerInspectHubRegistrationHeldReason", state.hubRegistrationHeldReason);

    setDataset("hearthCanvasFingerInspectFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerInspectRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerInspectRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasFingerInspectPostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerInspectNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerInspectF13Claimed", "false");
    setDataset("hearthCanvasFingerInspectF21Claimed", "false");
    setDataset("hearthCanvasFingerInspectReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerInspectTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectMountainTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectBiomeTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectAtmosphereTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectCompositeTruthClaimed", "false");
    setDataset("hearthCanvasFingerInspectVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerInspectGeneratedImage", "false");
    setDataset("hearthCanvasFingerInspectGraphicBox", "false");
    setDataset("hearthCanvasFingerInspectWebGL", "false");
    setDataset("hearthCanvasFingerInspectWebgl", "false");

    return true;
  }

  function publishGlobals() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    hearth.canvasFingerInspect = api;
    hearth.canvasInspectFinger = api;
    hearth.canvasFingerStretchInspect = api;
    hearth.canvasFingerStretchManager = api;
    hearth.canvasFingerInspectStretchManager = api;
    hearth.canvasFingerInspectHexSurfaceProof = api;
    hearth.canvasInspectFingerHexSurfaceProof = api;

    hearth.canvasFingerInspectReceipt = getReceiptLight();
    hearth.canvasFingerInspectPacket = getInspectionPacket();
    hearth.canvasFingerStretchInspection = getInspectionSummary();
    hearth.canvasFingerDownstreamExpressionSetPacket = getDownstreamExpressionSetPacket();

    lab.hearthCanvasFingerInspect = api;
    lab.hearthCanvasInspectFinger = api;
    lab.hearthCanvasFingerStretchInspect = api;
    lab.hearthCanvasFingerStretchManager = api;
    lab.hearthCanvasFingerInspectStretchManager = api;
    lab.hearthCanvasFingerInspectHexSurfaceProof = api;
    lab.hearthCanvasInspectFingerHexSurfaceProof = api;

    lab.hearthCanvasFingerInspectReceipt = getReceiptLight();
    lab.hearthCanvasFingerInspectPacket = getInspectionPacket();
    lab.hearthCanvasFingerStretchInspection = getInspectionSummary();
    lab.hearthCanvasFingerDownstreamExpressionSetPacket = getDownstreamExpressionSetPacket();

    root.HEARTH_CANVAS_FINGER_INSPECT = api;
    root.HEARTH_CANVAS_INSPECT_FINGER = api;
    root.HEARTH_CANVAS_FINGER_STRETCH_INSPECT = api;
    root.HEARTH_CANVAS_FINGER_STRETCH_MANAGER = api;
    root.HEARTH_CANVAS_FINGER_INSPECT_STRETCH_MANAGER = api;
    root.HEARTH_CANVAS_FINGER_INSPECT_HEX_SURFACE_PROOF = api;
    root.HEARTH_CANVAS_INSPECT_FINGER_HEX_SURFACE_PROOF = api;

    root.HEARTH_CANVAS_FINGER_INSPECT_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_STRETCH_RECEIPT_v1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_STRETCH_MANAGER_HEX_SURFACE_PROOF_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_STRETCH_MANAGER_HEX_SURFACE_PROOF_RECEIPT_v1_1 = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_PACKET = getInspectionPacket();
    root.HEARTH_CANVAS_FINGER_STRETCH_INSPECTION = getInspectionSummary();
    root.HEARTH_CANVAS_FINGER_DOWNSTREAM_EXPRESSION_SET_PACKET = getDownstreamExpressionSetPacket();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot() {
    state.timestamp = nowIso();

    inspectStretch();
    buildInspectionPacket();
    updateDataset();
    publishGlobals();

    registerWithCanvasHub();

    updateDataset();
    publishGlobals();

    state.booted = true;
    state.mounted = true;

    record("INSPECT_FINGER_STRETCH_MANAGER_HEX_SURFACE_PROOF_BOOT_COMPLETE", {
      boundaryReady: state.boundaryReady,
      massReady: state.massReady,
      surfaceReady: state.surfaceReady,
      surfaceExpressionSocketReady: state.surfaceExpressionSocketReady,
      surfaceSampledByHexSurface: state.surfaceSampledByHexSurface,
      lightReady: state.lightReady,
      allFingerReady: state.allFingerReady,
      hexSurfaceBridgeReady: state.hexSurfaceBridgeReady,
      hexTransmissionReceivedByInspect: state.hexTransmissionReceivedByInspect,
      downstreamExpressionSetReady: state.downstreamExpressionSetReady,
      canvasNextIfPixelsRemainBlank: state.canvasNextIfPixelsRemainBlank,
      hubDetected: state.hubDetected,
      hubRegistrationAccepted: state.hubRegistrationAccepted,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction
    });

    return getReceipt();
  }

  function init() {
    return boot();
  }

  function start() {
    return boot();
  }

  function mount() {
    return boot();
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PACKET,
    INTERNAL_IMPLEMENTATION_CONTRACT,
    INTERNAL_IMPLEMENTATION_RECEIPT,
    PREVIOUS_PUBLIC_CONTRACT,
    PREVIOUS_PUBLIC_RECEIPT,
    VERSION,
    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    BOUNDARY_FILE,
    MASS_FILE,
    SURFACE_FILE,
    LIGHT_FILE,
    HEX_SURFACE_FILE,
    HEX_AUTHORITY_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousPublicContract: PREVIOUS_PUBLIC_CONTRACT,
    previousPublicReceipt: PREVIOUS_PUBLIC_RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    surfaceFile: SURFACE_FILE,
    lightFile: LIGHT_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,
    fingerSequence: FINGER_SEQUENCE,
    bridgeSequence: BRIDGE_SEQUENCE,

    boot,
    init,
    start,
    mount,

    inspectFinger,
    inspectStretch,
    inspectSurfaceHexExpression,
    inspectHexSurfaceBridge,
    buildInspectionPacket,
    buildDownstreamExpressionSetPacket,
    getInspectionPacket,
    getInspectionSummary,
    getDownstreamExpressionSetPacket,
    registerWithCanvasHub,
    findCanvasHub,
    findHexSurface,

    receiveHexSurfaceTransmissionPacket,
    consumeHexSurfaceTransmissionPacket,
    receivePointerFingerTransmissionPacket,
    consumePointerFingerTransmissionPacket,
    receiveCanvasFingerPacket,
    consumeCanvasFingerPacket,
    receiveHexGatePacket,
    consumeHexGatePacket,
    acceptHexGatePacket,
    receiveFramePacket,
    consumeFramePacket,
    receiveInspectPacket,
    receiveSurfacePacket,
    receive,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,

    supportsCanvasFingerInspect: true,
    supportsFingerStretchInspection: true,
    supportsFingerStretchManager: true,
    supportsBoundaryFingerInspection: true,
    supportsMassFingerInspection: true,
    supportsSurfaceFingerInspection: true,
    supportsLightFingerInspection: true,
    supportsHexSurfaceBridgeInspection: true,
    supportsSurfaceHexExpressionProof: true,
    supportsHexSurfaceTransmissionReceiver: true,
    supportsPointerFingerTransmissionReceiver: true,
    supportsDownstreamExpressionSetPacket: true,
    supportsCanvasHubRegistration: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsInspectFingerIdentity: true,
    ownsFingerStretchInspectionPacket: true,
    ownsFingerStretchManagerProof: true,
    ownsDownstreamExpressionSetProof: true,
    ownsPriorFingerTruth: false,
    ownsBoundaryFinger: false,
    ownsMassFinger: false,
    ownsSurfaceFinger: false,
    ownsLightFinger: false,
    ownsHexSurface: false,
    ownsHexSurfaceProjection: false,
    ownsCanvasHub: false,
    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsMountainTruth: false,
    ownsAtmosphereTruth: false,
    ownsCompositeTruth: false,
    ownsFinalVisualPassClaim: false,

    inspectionOnly: true,
    expressionFileOnly: true,
    priorFingerMutationBlocked: true,
    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    inspectStretch();
    buildInspectionPacket();
    updateDataset();
    publishGlobals();

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
    recordError("INSPECT_FINGER_STRETCH_MANAGER_HEX_SURFACE_PROOF_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
