// /assets/hearth/hearth.canvas.finger.surface.js
// HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_TNT_v5
// Internal controlled renewal:
// HEARTH_CANVAS_FINGER_SURFACE_HEX_AUTHORITY_TUPLE_BINDING_TNT_v5_2
// Full-file replacement.
//
// Canvas Finger 3 / Surface / Pointer Finger / Surface Pointer Bishop / Hex Expression Socket only.
//
// Purpose:
// - Preserve the public v5 Surface Pointer Bishop contract.
// - Preserve the v5_1 simplified Hex socket bridge.
// - Repair the map-math alignment gap by binding Surface expression sampling to the
//   canonical Hex Four-Pair Authority tuple whenever that authority is available.
// - Establish the lawful math path:
//     input coord -> Hex Authority sample/read/getCell -> canonical tuple -> Surface expression.
// - Keep local coordinate fallback available only as explicit receipt-visible fallback.
// - Preserve legacy Surface/Finger/Bishop aliases required by Canvas, Hex Surface, and diagnostics.
// - Do not manage Boundary, Mass, Light, Inspect, Composite, route conductor, diagnostic rail,
//   or Canvas lifecycle.
// - Do not draw Canvas, mount DOM, boot Canvas Hub, mutate Hex Authority, or claim visual pass.
// - Do not claim terrain truth, hydrology truth, material truth, elevation truth, composite truth,
//   F13, F21, ready text, completion latch, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_TNT_v5";
  const RECEIPT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT_v5";
  const PACKET =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_PACKET_v5";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_AUTHORITY_TUPLE_BINDING_TNT_v5_2";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_AUTHORITY_TUPLE_BINDING_RECEIPT_v5_2";

  const PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_SIMPLIFIED_HEX_SOCKET_BRIDGE_TNT_v5_1";
  const PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_SIMPLIFIED_HEX_SOCKET_BRIDGE_RECEIPT_v5_1";

  const PREVIOUS_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_TNT_v5";
  const PREVIOUS_RECEIPT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT_v5";

  const LINEAGE_V4_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v4";
  const LINEAGE_V3_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_INTERNAL_EXTERNAL_EXPRESSION_SOCKET_TNT_v3";
  const LINEAGE_V2_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_FINGER_EXTERNAL_EXPRESSION_SOCKET_TNT_v2";
  const BASELINE_CONTRACT =
    "HEARTH_CANVAS_FINGER_SURFACE_FIRST_MATERIAL_DIFFERENTIATION_TNT_v1";

  const VERSION =
    "2026-06-07.hearth-canvas-finger-surface-hex-authority-tuple-binding-v5-2";

  const FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const PARENT_HUB_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const MASS_FILE = "/assets/hearth/hearth.canvas.finger.mass.js";
  const LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const COMPOSITE_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";

  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const FINGER_NAME = "surface";
  const FINGER_ROLE = "pointer-finger-surface-expression-socket";
  const FINGER_ORDER = 3;
  const FINGER_STRETCH_TOTAL = 5;

  const BISHOP_NAME = "surface";
  const BISHOP_TITLE = "Surface Pointer Bishop";
  const BISHOP_ROLE = "surface-pointer-bishop-hex-expression-socket";
  const BISHOP_RANK = "non-cardinal-bishop";
  const BISHOP_ADDRESS = "surface.pointer";
  const BISHOP_DIRECTION = "POINTER";
  const BISHOP_CARDINAL_DISPOSITION = "NON_CARDINAL_POINTER";

  const TRANSMISSION_PACKET =
    "HEARTH_SURFACE_POINTER_BISHOP_HEX_TRANSMISSION_ACK_PACKET_v5_2";

  const EXPRESSION_PACKET =
    "HEARTH_SURFACE_POINTER_BISHOP_RENDERABLE_EXPRESSION_PACKET_v5_2";

  const DEG = Math.PI / 180;

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByCanvasParent: false,
    f13ClaimedBySurfacePointerBishop: false,
    f21Claimed: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21EligibilitySubmittedToNorth: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextClaimed: false,
    readyTextAllowed: false,
    readyTextClaimedByCanvasParent: false,
    terrainTruthClaimed: false,
    hydrologyTruthClaimed: false,
    materialTruthClaimed: false,
    elevationTruthClaimed: false,
    compositeTruthClaimed: false,
    finalCompositeTruthClaimed: false,
    biomeTruthClaimed: false,
    settlementTruthClaimed: false,
    expressionComplete: false,
    finalVisualPassClaimed: false,
    visualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const HEX_AUTHORITY_ALIAS_PATHS = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_HANDSHAKE_AUTHORITY",
    "HEARTH_HEXGRID_AUTHORITY",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthHexAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority"
  ]);

  const SURFACE_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_CANVAS_POINTER_BISHOP",
    "HEARTH_CANVAS_BISHOP_SURFACE",
    "HEARTH_CANVAS_SURFACE_BISHOP",
    "HEARTH_CANVAS_BISHOP_SURFACE_POINTER",
    "HEARTH_CANVAS_SURFACE_POINTER_BISHOP",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP",
    "HEARTH_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_HEX_SURFACE_EXPRESSION_AUTHORITY",
    "HEARTH_CANVAS_FINGER_SURFACE_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",
    "HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET",

    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.pointerFingerSurface",
    "HEARTH.canvasFingerSurfacePointer",
    "HEARTH.canvasPointerFinger",
    "HEARTH.canvasPointerBishop",
    "HEARTH.canvasBishopSurface",
    "HEARTH.canvasSurfaceBishop",
    "HEARTH.canvasBishopSurfacePointer",
    "HEARTH.canvasSurfacePointerBishop",
    "HEARTH.canvasFingerSurfacePointerBishop",
    "HEARTH.surfaceExpressionAuthority",
    "HEARTH.hexSurfaceExpressionAuthority",
    "HEARTH.canvasFingerSurfaceHexExpressionSocket",
    "HEARTH.canvasSurfacePointerBishopHexExpressionSocket",
    "HEARTH.canvasFingerSurfacePointerBishopHexExpressionSocket",

    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasSurfaceFinger",
    "DEXTER_LAB.hearthCanvasPointerFingerSurface",
    "DEXTER_LAB.hearthPointerFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointer",
    "DEXTER_LAB.hearthCanvasPointerFinger",
    "DEXTER_LAB.hearthCanvasPointerBishop",
    "DEXTER_LAB.hearthCanvasBishopSurface",
    "DEXTER_LAB.hearthCanvasSurfaceBishop",
    "DEXTER_LAB.hearthCanvasBishopSurfacePointer",
    "DEXTER_LAB.hearthCanvasSurfacePointerBishop",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointerBishop",
    "DEXTER_LAB.hearthSurfaceExpressionAuthority",
    "DEXTER_LAB.hearthHexSurfaceExpressionAuthority",
    "DEXTER_LAB.hearthCanvasFingerSurfaceHexExpressionSocket",
    "DEXTER_LAB.hearthCanvasSurfacePointerBishopHexExpressionSocket",
    "DEXTER_LAB.hearthCanvasFingerSurfacePointerBishopHexExpressionSocket"
  ]);

  const BODY_MASS_HINTS = Object.freeze([
    Object.freeze({ key: "north-crown-mass", lat: 76, lon: -24, rx: 42, ry: 13, angle: -10 }),
    Object.freeze({ key: "equatorial-great-mass", lat: 1, lon: -8, rx: 64, ry: 28, angle: -8 }),
    Object.freeze({ key: "northwest-temperate-mass", lat: 44, lon: -104, rx: 32, ry: 17, angle: 28 }),
    Object.freeze({ key: "northeast-broken-shelf-mass", lat: 34, lon: 104, rx: 34, ry: 16, angle: -24 }),
    Object.freeze({ key: "southeast-warm-mass", lat: -24, lon: 142, rx: 38, ry: 20, angle: 18 }),
    Object.freeze({ key: "southwest-ridge-mass", lat: -38, lon: -122, rx: 36, ry: 18, angle: -30 }),
    Object.freeze({ key: "south-transitional-mass", lat: -59, lon: 36, rx: 40, ry: 14, angle: 9 })
  ]);

  const COLOR = Object.freeze({
    abyss: Object.freeze([2, 10, 28, 255]),
    deep: Object.freeze([4, 28, 70, 255]),
    ocean: Object.freeze([8, 68, 122, 255]),
    shelf: Object.freeze([30, 128, 146, 255]),
    foam: Object.freeze([104, 176, 170, 255]),
    landLow: Object.freeze([86, 116, 70, 255]),
    landWarm: Object.freeze([144, 132, 78, 255]),
    landWet: Object.freeze([36, 104, 66, 255]),
    ridge: Object.freeze([92, 88, 78, 255]),
    granite: Object.freeze([138, 132, 118, 255]),
    cliff: Object.freeze([42, 50, 60, 255]),
    snow: Object.freeze([218, 230, 228, 255]),
    copper: Object.freeze([158, 92, 60, 255])
  });

  const state = {
    timestamp: "",
    updatedAt: "",
    publishedAt: "",

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV4Contract: LINEAGE_V4_CONTRACT,
    lineageV3Contract: LINEAGE_V3_CONTRACT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    lightFile: LIGHT_FILE,
    inspectFile: INSPECT_FILE,
    compositeFile: COMPOSITE_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    bishopName: BISHOP_NAME,
    bishopTitle: BISHOP_TITLE,
    bishopRole: BISHOP_ROLE,
    bishopRank: BISHOP_RANK,
    bishopAddress: BISHOP_ADDRESS,
    bishopDirection: BISHOP_DIRECTION,
    bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

    surfaceFingerLoaded: true,
    surfaceFingerActive: true,
    pointerFingerSurfaceActive: true,
    pointerBishopActive: true,
    nonCardinalBishopLanguageActive: true,
    legacyFingerCompatibilityActive: true,

    simplifiedBridgeActive: true,
    hexExpressionSocketActive: true,
    hexTransmissionReceiverActive: true,
    renderableSurfaceExpressionProviderActive: true,

    hexAuthorityTupleBindingActive: true,
    hexAuthorityObserved: false,
    hexAuthoritySource: "NONE",
    hexAuthorityContract: "UNKNOWN",
    hexAuthorityReceipt: "UNKNOWN",
    hexAuthorityRecognized: false,
    hexAuthoritySampleMethodUsed: "NONE",
    canonicalTupleResolved: false,
    canonicalTupleSource: "NONE",
    canonicalTupleCellId: "NONE",
    canonicalTupleStateId: "UNKNOWN",
    canonicalTupleRow: "UNKNOWN",
    canonicalTupleColumn: "UNKNOWN",
    localCoordFallbackUsed: false,
    localCoordFallbackReason: "NONE",
    surfaceExpressionCoordSource: "NONE",
    mapAlignmentStatus: "WAITING_SAMPLE",
    mapAlignmentDetail: "WAITING_HEX_SURFACE_TRANSMISSION_OR_SAMPLE_REQUEST",
    inputCellClaimStatus: "NO_INPUT_CELL_CLAIM",
    lastInputCellId: "NONE",
    lastResolvedCellId: "NONE",
    lastTupleBindingAt: "",

    inspectOwnsFingerStretchManagement: true,
    surfaceOwnsFingerStretchManagement: false,
    surfaceOwnsOtherFingerInspection: false,
    surfaceOwnsBoundaryFinger: false,
    surfaceOwnsMassFinger: false,
    surfaceOwnsLightFinger: false,
    surfaceOwnsInspectFinger: false,
    surfaceOwnsCompositeFinger: false,

    canvasDrawingDelegatedToHexSurface: true,
    hexSurfaceProjectionDelegated: true,
    directCanvasDrawingSuppressed: true,
    canvasLifecycleCallsSuppressed: true,
    domMutationSuppressed: true,

    surfaceModelReady: true,
    surfacePacketReady: true,
    pointerFingerPacketReady: true,
    pointerBishopPacketReady: true,
    sampleHexSurfaceExpressionReady: true,
    sampleSurfaceExpressionReady: true,
    renderableSurfaceExpressionReady: true,

    receivedTransmissionCount: 0,
    acceptedTransmissionCount: 0,
    rejectedTransmissionCount: 0,
    expressionRequestCount: 0,
    expressionServedCount: 0,
    expressionRejectedCount: 0,
    hexAuthorityTupleRequestCount: 0,
    hexAuthorityTupleResolvedCount: 0,
    localCoordFallbackCount: 0,
    inputCellVarianceCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,

    latestTransmissionAt: "",
    latestTransmissionSource: "NONE",
    latestTransmissionStatus: "WAITING_HEX_SURFACE_TRANSMISSION",
    latestTransmissionReason: "WAITING_HEX_SURFACE_TRANSMISSION",
    latestExpressionAt: "",
    latestExpressionSource: "NONE",
    latestExpressionCellId: "NONE",
    latestExpressionMaterialClass: "NONE",
    latestExpressionLandPresence: 0,
    latestExpressionWaterPresence: 0,

    firstFailedCoordinate: "WAITING_HEX_SURFACE_TRANSMISSION_OR_SAMPLE_REQUEST",
    recommendedNextFile: HEX_SURFACE_FILE,
    recommendedNextRenewalTarget: HEX_SURFACE_FILE,
    postgameStatus: "SURFACE_POINTER_BISHOP_HEX_AUTHORITY_TUPLE_BINDING_READY",

    lastTransmissionPacket: null,
    lastTransmissionAckPacket: null,
    lastRejectedPacket: null,
    lastRejectionReason: "",
    lastSurfaceExpression: null,
    lastCanonicalTuple: null,
    lastTupleBinding: null,
    surfacePacket: null,
    pointerFingerPacket: null,
    pointerBishopPacket: null,

    expressionLedger: [],
    transmissionLedger: [],
    tupleBindingLedger: [],
    localEvents: [],
    errors: [],

    booted: false,
    mounted: false,

    ...FINAL_FALSE
  };

  const api = {};

  function nowIso() {
    try {
      return new Date().toISOString();
    } catch (_error) {
      return String(Date.now());
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

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function finiteNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
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

  function firstText(...values) {
    for (const value of values) {
      const text = safeString(value).trim();
      if (text && text !== "UNKNOWN" && text !== "NONE" && text !== "NOT_FOUND") return text;
    }
    return "";
  }

  function firstFinite(...values) {
    for (const value of values) {
      const n = finiteNumber(value);
      if (n !== null) return n;
    }
    return null;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clamp01(value) {
    return clamp(value, 0, 1);
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
  }

  function mixColor(a, b, t) {
    const k = clamp01(t);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k)),
      Math.round(lerp(a[3] === undefined ? 255 : a[3], b[3] === undefined ? 255 : b[3], k))
    ];
  }

  function multiplyColor(color, amount) {
    const k = clamp(amount, 0, 2);
    return [
      clamp(Math.round(color[0] * k), 0, 255),
      clamp(Math.round(color[1] * k), 0, 255),
      clamp(Math.round(color[2] * k), 0, 255),
      color[3] === undefined ? 255 : color[3]
    ];
  }

  function wrap01(value) {
    const n = safeNumber(value, 0);
    return ((n % 1) + 1) % 1;
  }

  function wrapDeg(value) {
    const n = safeNumber(value, 0);
    return ((((n + 180) % 360) + 360) % 360) - 180;
  }

  function degDistance(a, b) {
    return wrapDeg(safeNumber(a, 0) - safeNumber(b, 0));
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp01((value - edge0) / Math.max(0.000001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function hash2(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function valueNoise(x, y, seed) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;

    const a = hash2(ix, iy, seed);
    const b = hash2(ix + 1, iy, seed);
    const c = hash2(ix, iy + 1, seed);
    const d = hash2(ix + 1, iy + 1, seed);

    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
  }

  function fbm(x, y, seed, octaves) {
    let total = 0;
    let amplitude = 0.54;
    let frequency = 1;
    let norm = 0;

    for (let i = 0; i < octaves; i += 1) {
      total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
      norm += amplitude;
      amplitude *= 0.5;
      frequency *= 2.03;
    }

    return total / Math.max(0.000001, norm);
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
      event: safeString(event, "SURFACE_POINTER_BISHOP_EVENT"),
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
      code: safeString(code, "SURFACE_POINTER_BISHOP_ERROR"),
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
      if (!part) continue;
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).split(".");
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

  function firstGlobal(names) {
    for (const name of names || []) {
      const value = readPath(name);
      if (value && (isObject(value) || isFunction(value))) return { name, value };
    }

    return { name: "NONE", value: null };
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function readField(source, keys, fallback = "") {
    const s = isObject(source) || isFunction(source) ? source : {};

    for (const key of keys) {
      if (s[key] !== undefined && s[key] !== null && s[key] !== "") return s[key];

      const lower = key.toLowerCase();
      try {
        for (const candidate of Object.keys(s)) {
          if (candidate.toLowerCase() === lower) {
            const value = s[candidate];
            if (value !== undefined && value !== null && value !== "") return value;
          }
        }
      } catch (_error) {}
    }

    return fallback;
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority)) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) {
      return authority;
    }

    return null;
  }

  function contractOf(value) {
    return firstText(
      readField(value, [
        "hexAuthorityContract",
        "hexContract",
        "contract",
        "CONTRACT",
        "sourceContract",
        "currentContract"
      ], ""),
      value && value.contract,
      value && value.CONTRACT
    );
  }

  function receiptOf(value) {
    return firstText(
      readField(value, [
        "hexAuthorityReceipt",
        "hexReceipt",
        "receipt",
        "RECEIPT",
        "sourceReceipt",
        "currentReceipt"
      ], ""),
      value && value.receipt,
      value && value.RECEIPT
    );
  }

  function hexAuthorityContractRecognized(contract) {
    const text = safeString(contract);
    return (
      text === EXPECTED_HEX_AUTHORITY_CONTRACT ||
      text.includes("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY")
    );
  }

  function readHexAuthority() {
    const found = firstGlobal(HEX_AUTHORITY_ALIAS_PATHS);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = doc && doc.documentElement && doc.documentElement.dataset
      ? doc.documentElement.dataset
      : {};

    const contract = firstText(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthHexAuthorityContract,
      ds.hearthHexFourPairAuthorityContract,
      ds.hearthHexFourPairPixelHandshakeAuthorityContract
    );

    const receiptName = firstText(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthHexAuthorityReceipt,
      ds.hearthHexFourPairAuthorityReceipt,
      ds.hearthHexFourPairPixelHandshakeAuthorityReceipt
    );

    const observed = Boolean(found.value);
    const recognized = hexAuthorityContractRecognized(contract);

    state.hexAuthorityObserved = observed;
    state.hexAuthoritySource = found.name;
    state.hexAuthorityContract = contract || "UNKNOWN";
    state.hexAuthorityReceipt = receiptName || "UNKNOWN";
    state.hexAuthorityRecognized = recognized;

    return {
      observed,
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN",
      recognized
    };
  }

  function hasForbiddenClaim(packet) {
    const p = isObject(packet) ? packet : {};

    return Boolean(
      p.f13Claimed === true ||
      p.f13EligibleForCanvas === true ||
      p.f13ClaimedByCanvasParent === true ||
      p.f13ClaimedBySurfacePointerBishop === true ||
      p.f21Claimed === true ||
      p.f21EligibleForNorth === true ||
      p.f21SubmittedToNorth === true ||
      p.f21EligibilitySubmittedToNorth === true ||
      p.completionLatched === true ||
      p.finalCompletionLatched === true ||
      p.degradedCompletionLatched === true ||
      p.readyTextClaimed === true ||
      p.readyTextAllowed === true ||
      p.readyTextClaimedByCanvasParent === true ||
      p.terrainTruthClaimed === true ||
      p.hydrologyTruthClaimed === true ||
      p.materialTruthClaimed === true ||
      p.elevationTruthClaimed === true ||
      p.compositeTruthClaimed === true ||
      p.finalCompositeTruthClaimed === true ||
      p.biomeTruthClaimed === true ||
      p.settlementTruthClaimed === true ||
      p.expressionComplete === true ||
      p.finalVisualPassClaimed === true ||
      p.visualPassClaimed === true ||
      p.generatedImage === true ||
      p.graphicBox === true ||
      p.webGL === true ||
      p.webgl === true
    );
  }

  function transmissionLooksLawful(packet) {
    if (!isObject(packet)) return false;
    if (hasForbiddenClaim(packet)) return false;

    const packetType = safeString(packet.packetType || packet.type || "").toUpperCase();
    const sourceFile = safeString(packet.sourceFile || packet.fromFile || "").toLowerCase();
    const sourceAuthority = safeString(packet.sourceAuthority || packet.sourceRole || packet.authority || "").toLowerCase();

    return Boolean(
      packetType.includes("HEX") ||
      packetType.includes("POINTER_FINGER") ||
      packetType.includes("SURFACE") ||
      packetType.includes("TRANSMISSION") ||
      sourceFile.endsWith("/hearth.hex.surface.js") ||
      sourceAuthority.includes("hex-surface") ||
      sourceAuthority.includes("hex surface") ||
      safeBool(packet.pointerFingerTransmissionAuthorized, false) ||
      safeBool(packet.hexSurfaceGateComplete, false)
    );
  }

  function parseCellAddress(value) {
    const text = safeString(value).trim();
    if (!text) return null;

    const match = text.match(/R(\d{1,3})_C(\d{1,3})/i);
    if (!match) return null;

    return {
      row: safeNumber(match[1], 0),
      column: safeNumber(match[2], 0),
      cellId: text
    };
  }

  function extractCellClaim(input = {}) {
    const p = isObject(input) ? input : {};
    const nested = [
      p,
      isObject(p.coord) ? p.coord : null,
      isObject(p.hexPacket) ? p.hexPacket : null,
      isObject(p.cell) ? p.cell : null,
      isObject(p.sourceCell) ? p.sourceCell : null,
      isObject(p.canonicalTuple) ? p.canonicalTuple : null,
      isObject(p.originalPacket) ? p.originalPacket : null,
      isObject(p.hexFramePacket) ? p.hexFramePacket : null,
      isObject(p.hexFramePacket && p.hexFramePacket.originalPacket) ? p.hexFramePacket.originalPacket : null
    ].filter(Boolean);

    let cellId = "";
    let hexId = "";
    let row = null;
    let column = null;
    let stateId = null;

    for (const item of nested) {
      cellId = cellId || firstText(item.cellId, item.hexId, item.id);
      hexId = hexId || firstText(item.hexId, item.cellId, item.id);
      row = row === null ? firstFinite(item.row, item.hexRow, item.rIndex) : row;
      column = column === null ? firstFinite(item.column, item.col, item.hexColumn, item.cIndex) : column;
      stateId = stateId === null ? firstFinite(item.stateId, item.state, item.stateIndex) : stateId;
    }

    const parsed = parseCellAddress(cellId || hexId);
    if (parsed) {
      row = row === null ? parsed.row : row;
      column = column === null ? parsed.column : column;
      cellId = cellId || parsed.cellId;
      hexId = hexId || parsed.cellId;
    }

    return {
      hasClaim: Boolean(cellId || hexId || row !== null || column !== null || stateId !== null),
      cellId: cellId || "NONE",
      hexId: hexId || cellId || "NONE",
      row,
      column,
      stateId
    };
  }

  function extractCoordinateCandidate(input = {}) {
    const p = isObject(input) ? input : {};
    const claim = extractCellClaim(p);

    const candidates = [
      p,
      isObject(p.coord) ? p.coord : null,
      isObject(p.coordinate) ? p.coordinate : null,
      isObject(p.location) ? p.location : null,
      isObject(p.hexPacket) ? p.hexPacket : null,
      isObject(p.cell) ? p.cell : null,
      isObject(p.sourceCell) ? p.sourceCell : null,
      isObject(p.canonicalTuple) ? p.canonicalTuple : null,
      isObject(p.originalPacket) ? p.originalPacket : null,
      isObject(p.hexFramePacket) ? p.hexFramePacket : null,
      isObject(p.hexFramePacket && p.hexFramePacket.originalPacket) ? p.hexFramePacket.originalPacket : null,
      isObject(p.viewState) ? p.viewState : null,
      isObject(p.projectionState) ? p.projectionState : null
    ].filter(Boolean);

    let u = null;
    let v = null;
    let lon = null;
    let lat = null;
    let x = null;
    let y = null;
    let z = null;

    for (const item of candidates) {
      u = u === null ? firstFinite(item.u, item.sourceU, item.normalizedX) : u;
      v = v === null ? firstFinite(item.v, item.sourceV, item.normalizedY) : v;
      lon = lon === null ? firstFinite(item.lon, item.longitude, item.sourceLon, item.lonDegrees) : lon;
      lat = lat === null ? firstFinite(item.lat, item.latitude, item.sourceLat, item.latDegrees) : lat;
      x = x === null ? firstFinite(item.x, item.sourceX) : x;
      y = y === null ? firstFinite(item.y, item.sourceY) : y;
      z = z === null ? firstFinite(item.z, item.sourceZ) : z;
    }

    if ((u === null || v === null) && lon !== null && lat !== null) {
      u = wrap01((lon + 180) / 360);
      v = clamp01((90 - lat) / 180);
    }

    if ((lon === null || lat === null) && u !== null && v !== null) {
      lon = wrapDeg(wrap01(u) * 360 - 180);
      lat = 90 - clamp01(v) * 180;
    }

    const candidate = {
      u,
      v,
      lon,
      lat,
      longitude: lon,
      latitude: lat,
      x,
      y,
      z,
      row: claim.row,
      column: claim.column,
      cellId: claim.cellId !== "NONE" ? claim.cellId : undefined,
      hexId: claim.hexId !== "NONE" ? claim.hexId : undefined,
      stateId: claim.stateId,
      inputCellClaim: claim
    };

    return candidate;
  }

  function localNormalizeCoord(input = {}) {
    const candidate = extractCoordinateCandidate(input);
    let u = candidate.u;
    let v = candidate.v;
    let lon = candidate.lon;
    let lat = candidate.lat;

    if ((u === null || v === null) && candidate.x !== null && candidate.y !== null) {
      u = clamp01(candidate.x);
      v = clamp01(candidate.y);
      lon = wrapDeg(u * 360 - 180);
      lat = 90 - v * 180;
    }

    if ((u === null || v === null) && candidate.inputCellClaim.hasClaim) {
      const seedText = safeString(
        candidate.inputCellClaim.cellId !== "NONE"
          ? candidate.inputCellClaim.cellId
          : candidate.inputCellClaim.stateId !== null
            ? candidate.inputCellClaim.stateId
            : "0"
      );

      let seed = 0;
      for (let i = 0; i < seedText.length; i += 1) seed += seedText.charCodeAt(i) * (i + 1);

      u = wrap01((seed * 0.61803398875) % 1);
      v = clamp01((seed * 0.41421356237) % 1);
      lon = wrapDeg(u * 360 - 180);
      lat = 90 - v * 180;
    }

    u = wrap01(u === null ? 0.5 : u);
    v = clamp01(v === null ? 0.5 : v);
    lon = wrapDeg(lon === null ? u * 360 - 180 : lon);
    lat = clamp(lat === null ? 90 - v * 180 : lat, -90, 90);

    return {
      u,
      v,
      lon,
      lat,
      lonDegrees: lon,
      latDegrees: lat,
      x: candidate.x,
      y: candidate.y,
      z: candidate.z
    };
  }

  function tupleFromHexResult(result, methodName, authorityInfo, request = {}) {
    if (!isObject(result)) return null;
    if (result.ok === false || result.rejected === true) return null;

    const resultCoord = isObject(result.coord) ? result.coord : {};
    const sourceCoord = isObject(result.sourceCoord) ? result.sourceCoord : {};
    const inputClaim = extractCellClaim(request);

    let u = firstFinite(result.u, result.sourceU, resultCoord.u, sourceCoord.u);
    let v = firstFinite(result.v, result.sourceV, resultCoord.v, sourceCoord.v);
    let lon = firstFinite(result.lon, result.sourceLon, result.longitude, resultCoord.lon, sourceCoord.lon);
    let lat = firstFinite(result.lat, result.sourceLat, result.latitude, resultCoord.lat, sourceCoord.lat);

    if ((u === null || v === null) && lon !== null && lat !== null) {
      u = wrap01((lon + 180) / 360);
      v = clamp01((90 - lat) / 180);
    }

    if ((lon === null || lat === null) && u !== null && v !== null) {
      lon = wrapDeg(wrap01(u) * 360 - 180);
      lat = 90 - clamp01(v) * 180;
    }

    const cellId = firstText(result.cellId, result.hexId, result.id, result.centerCellId);
    const hexId = firstText(result.hexId, result.cellId, result.id, result.centerCellId);
    let row = firstFinite(result.row, result.hexRow);
    let column = firstFinite(result.column, result.col, result.hexColumn);
    const stateId = firstFinite(result.stateId, result.centerStateId, result.state);
    const q = firstFinite(result.q);
    const r = firstFinite(result.r);
    const s = firstFinite(result.s);
    const parsed = parseCellAddress(cellId || hexId);

    if (parsed) {
      row = row === null ? parsed.row : row;
      column = column === null ? parsed.column : column;
    }

    const resolved = Boolean(
      u !== null &&
      v !== null &&
      lon !== null &&
      lat !== null &&
      (cellId || hexId || (row !== null && column !== null))
    );

    if (!resolved) return null;

    return {
      tupleSource: "HEX_AUTHORITY",
      tupleMethod: methodName,
      authoritySource: authorityInfo.name,
      authorityContract: authorityInfo.contract,
      authorityReceipt: authorityInfo.receiptName,
      authorityRecognized: authorityInfo.recognized,
      contract: firstText(result.contract, result.CONTRACT, authorityInfo.contract),
      receipt: firstText(result.receipt, result.RECEIPT, authorityInfo.receiptName),
      cellId: cellId || (parsed ? parsed.cellId : "UNKNOWN"),
      hexId: hexId || cellId || (parsed ? parsed.cellId : "UNKNOWN"),
      row: row === null ? "UNKNOWN" : row,
      column: column === null ? "UNKNOWN" : column,
      q: q === null ? "UNKNOWN" : q,
      r: r === null ? "UNKNOWN" : r,
      s: s === null ? "UNKNOWN" : s,
      stateId: stateId === null ? "UNKNOWN" : stateId,
      stateClass: firstText(result.stateClass),
      parity: firstText(result.parity),
      edgeRole: firstText(result.edgeRole),
      gridColumns: firstFinite(result.gridColumns),
      gridRows: firstFinite(result.gridRows),
      gridMode: firstText(result.gridMode),
      u: wrap01(u),
      v: clamp01(v),
      lon: wrapDeg(lon),
      lat: clamp(lat, -90, 90),
      lonDegrees: wrapDeg(lon),
      latDegrees: clamp(lat, -90, 90),
      x: firstFinite(result.x, result.sourceX),
      y: firstFinite(result.y, result.sourceY),
      z: firstFinite(result.z, result.sourceZ),
      fourPairObserved: Boolean(result.fourPair || result.fourPairSet),
      fourPairSet: clonePlain(result.fourPair || result.fourPairSet || null),
      north: clonePlain(result.north || (result.fourPair && result.fourPair.north) || null),
      south: clonePlain(result.south || (result.fourPair && result.fourPair.south) || null),
      east: clonePlain(result.east || (result.fourPair && result.fourPair.east) || null),
      west: clonePlain(result.west || (result.fourPair && result.fourPair.west) || null),
      inputCellClaim: clonePlain(inputClaim),
      rawHexResult: clonePlain(result)
    };
  }

  function buildHexAuthorityCallInputs(input = {}) {
    const candidate = extractCoordinateCandidate(input);
    const claim = candidate.inputCellClaim || extractCellClaim(input);
    const out = [];

    const base = {};

    if (candidate.u !== null && candidate.v !== null) {
      base.u = wrap01(candidate.u);
      base.v = clamp01(candidate.v);
    }

    if (candidate.lon !== null && candidate.lat !== null) {
      base.lon = wrapDeg(candidate.lon);
      base.lat = clamp(candidate.lat, -90, 90);
      base.longitude = base.lon;
      base.latitude = base.lat;
    }

    if (candidate.x !== null && candidate.y !== null && candidate.z !== null) {
      base.x = candidate.x;
      base.y = candidate.y;
      base.z = candidate.z;
    }

    if (claim.row !== null && claim.column !== null) {
      out.push({
        mode: "cell",
        row: claim.row,
        column: claim.column,
        cellId: claim.cellId !== "NONE" ? claim.cellId : undefined,
        hexId: claim.hexId !== "NONE" ? claim.hexId : undefined
      });

      out.push({
        row: claim.row,
        column: claim.column,
        cellId: claim.cellId !== "NONE" ? claim.cellId : undefined,
        hexId: claim.hexId !== "NONE" ? claim.hexId : undefined
      });
    }

    if (Object.keys(base).length) {
      out.push(base);
      out.push({ mode: "four-pair", ...base });
    }

    if (claim.cellId !== "NONE" || claim.hexId !== "NONE" || claim.stateId !== null) {
      out.push({
        cellId: claim.cellId !== "NONE" ? claim.cellId : undefined,
        hexId: claim.hexId !== "NONE" ? claim.hexId : undefined,
        stateId: claim.stateId
      });
    }

    out.push({ u: 0.5, v: 0.5, fallbackProbe: true });

    return out;
  }

  function callHexAuthorityMethod(authority, methodName, callInput) {
    if (!authority || !isFunction(authority[methodName])) return null;

    try {
      if (methodName === "getCell" || methodName === "getNeighbors" || methodName === "getFourPairSet") {
        return authority[methodName](callInput);
      }

      if (methodName === "read" && callInput && callInput.mode) {
        return authority[methodName](callInput);
      }

      return authority[methodName](callInput);
    } catch (error) {
      recordError("SURFACE_POINTER_BISHOP_HEX_AUTHORITY_CALL_FAILED", error, {
        methodName,
        callInput
      });
      return null;
    }
  }

  function resolveFromHexAuthority(input = {}) {
    state.hexAuthorityTupleRequestCount += 1;

    const authorityInfo = readHexAuthority();

    if (!authorityInfo.observed || !authorityInfo.authority) {
      return {
        resolved: false,
        reason: "HEX_AUTHORITY_UNAVAILABLE",
        authorityInfo,
        tuple: null,
        method: "NONE"
      };
    }

    if (!authorityInfo.recognized) {
      return {
        resolved: false,
        reason: "HEX_AUTHORITY_CONTRACT_NOT_RECOGNIZED",
        authorityInfo,
        tuple: null,
        method: "NONE"
      };
    }

    const callInputs = buildHexAuthorityCallInputs(input);
    const methods = ["sample", "read", "getCell"];

    for (const callInput of callInputs) {
      for (const method of methods) {
        const result = callHexAuthorityMethod(authorityInfo.authority, method, callInput);
        const tuple = tupleFromHexResult(result, method, authorityInfo, input);

        if (tuple) {
          state.hexAuthorityTupleResolvedCount += 1;

          return {
            resolved: true,
            reason: "HEX_AUTHORITY_CANONICAL_TUPLE_RESOLVED",
            authorityInfo,
            tuple,
            method
          };
        }
      }
    }

    return {
      resolved: false,
      reason: "HEX_AUTHORITY_RETURNED_NO_USABLE_TUPLE",
      authorityInfo,
      tuple: null,
      method: "NONE"
    };
  }

  function localFallbackTuple(input = {}, reason = "LOCAL_FALLBACK_REQUIRED") {
    const coord = localNormalizeCoord(input);
    const claim = extractCellClaim(input);

    return {
      tupleSource: "LOCAL_FALLBACK",
      tupleMethod: "LOCAL_NORMALIZE_COORD",
      authoritySource: "NONE",
      authorityContract: "UNKNOWN",
      authorityReceipt: "UNKNOWN",
      authorityRecognized: false,
      contract: CONTRACT,
      receipt: RECEIPT,
      cellId: claim.cellId !== "NONE" ? claim.cellId : "LOCAL_FALLBACK_CELL_UNKNOWN",
      hexId: claim.hexId !== "NONE" ? claim.hexId : claim.cellId !== "NONE" ? claim.cellId : "LOCAL_FALLBACK_HEX_UNKNOWN",
      row: claim.row === null ? "UNKNOWN" : claim.row,
      column: claim.column === null ? "UNKNOWN" : claim.column,
      q: "UNKNOWN",
      r: "UNKNOWN",
      s: "UNKNOWN",
      stateId: claim.stateId === null ? "UNKNOWN" : claim.stateId,
      stateClass: claim.stateId === null ? "UNKNOWN" : `state-${String(claim.stateId).padStart(3, "0")}`,
      parity: "UNKNOWN",
      edgeRole: "LOCAL_FALLBACK",
      gridColumns: "UNKNOWN",
      gridRows: "UNKNOWN",
      gridMode: "LOCAL_FALLBACK_NOT_CANONICAL_HEX_GRID",
      u: coord.u,
      v: coord.v,
      lon: coord.lon,
      lat: coord.lat,
      lonDegrees: coord.lon,
      latDegrees: coord.lat,
      x: coord.x,
      y: coord.y,
      z: coord.z,
      fourPairObserved: false,
      fourPairSet: null,
      north: null,
      south: null,
      east: null,
      west: null,
      inputCellClaim: clonePlain(claim),
      localFallbackReason: reason,
      rawHexResult: null
    };
  }

  function compareInputClaimToTuple(claim, tuple) {
    if (!claim || !claim.hasClaim || !tuple) {
      return {
        status: "NO_INPUT_CELL_CLAIM",
        detail: "NO_CELL_ROW_COLUMN_OR_STATE_CLAIM_SUPPLIED",
        matched: "UNKNOWN"
      };
    }

    const issues = [];

    if (claim.cellId !== "NONE" && tuple.cellId !== "UNKNOWN" && claim.cellId !== tuple.cellId) {
      issues.push(`CELL_ID:${claim.cellId}>${tuple.cellId}`);
    }

    if (claim.row !== null && tuple.row !== "UNKNOWN" && Number(claim.row) !== Number(tuple.row)) {
      issues.push(`ROW:${claim.row}>${tuple.row}`);
    }

    if (claim.column !== null && tuple.column !== "UNKNOWN" && Number(claim.column) !== Number(tuple.column)) {
      issues.push(`COLUMN:${claim.column}>${tuple.column}`);
    }

    if (claim.stateId !== null && tuple.stateId !== "UNKNOWN" && Number(claim.stateId) !== Number(tuple.stateId)) {
      issues.push(`STATE:${claim.stateId}>${tuple.stateId}`);
    }

    if (issues.length) {
      return {
        status: "INPUT_CELL_VARIANCE_DETECTED",
        detail: issues.join("|"),
        matched: false
      };
    }

    return {
      status: "INPUT_CELL_CLAIM_MATCHED_CANONICAL_TUPLE",
      detail: "INPUT_CELL_CLAIM_ALIGNED_WITH_HEX_AUTHORITY_TUPLE",
      matched: true
    };
  }

  function resolveCanonicalTuple(input = {}, options = {}) {
    const hexResolution = resolveFromHexAuthority(input);
    const claim = extractCellClaim(input);

    let tuple = hexResolution.tuple;
    let tupleSource = "HEX_AUTHORITY";
    let localFallbackUsed = false;
    let localFallbackReason = "NONE";
    let mapAlignmentStatus = "BOUND_TO_HEX_AUTHORITY";
    let mapAlignmentDetail = "CANONICAL_HEX_AUTHORITY_TUPLE_RESOLVED";

    if (!hexResolution.resolved || !tuple) {
      tuple = localFallbackTuple(input, hexResolution.reason);
      tupleSource = "LOCAL_FALLBACK";
      localFallbackUsed = true;
      localFallbackReason = hexResolution.reason;
      mapAlignmentStatus = hexResolution.authorityInfo && hexResolution.authorityInfo.observed
        ? "FALLBACK_LOCAL_COORD_USED_AFTER_HEX_AUTHORITY_MISS"
        : "HEX_AUTHORITY_UNAVAILABLE_LOCAL_COORD_FALLBACK_USED";
      mapAlignmentDetail = hexResolution.reason;
      state.localCoordFallbackCount += 1;
    }

    const claimComparison = compareInputClaimToTuple(claim, tuple);

    if (claimComparison.status === "INPUT_CELL_VARIANCE_DETECTED") {
      state.inputCellVarianceCount += 1;
      mapAlignmentStatus = tupleSource === "HEX_AUTHORITY"
        ? "BOUND_TO_HEX_AUTHORITY_WITH_INPUT_VARIANCE"
        : "LOCAL_FALLBACK_WITH_INPUT_VARIANCE";
      mapAlignmentDetail = claimComparison.detail;
    }

    const coord = {
      u: wrap01(tuple.u),
      v: clamp01(tuple.v),
      lon: wrapDeg(tuple.lon),
      lat: clamp(tuple.lat, -90, 90),
      lonDegrees: wrapDeg(tuple.lon),
      latDegrees: clamp(tuple.lat, -90, 90),
      x: tuple.x,
      y: tuple.y,
      z: tuple.z
    };

    const binding = {
      bindingPacketType: "HEARTH_SURFACE_POINTER_BISHOP_HEX_AUTHORITY_TUPLE_BINDING_PACKET_v5_2",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

      hexAuthorityTupleBindingActive: true,
      hexAuthorityObserved: hexResolution.authorityInfo ? hexResolution.authorityInfo.observed : false,
      hexAuthoritySource: hexResolution.authorityInfo ? hexResolution.authorityInfo.name : "NONE",
      hexAuthorityContract: hexResolution.authorityInfo ? hexResolution.authorityInfo.contract : "UNKNOWN",
      hexAuthorityReceipt: hexResolution.authorityInfo ? hexResolution.authorityInfo.receiptName : "UNKNOWN",
      hexAuthorityRecognized: hexResolution.authorityInfo ? hexResolution.authorityInfo.recognized : false,
      hexAuthoritySampleMethodUsed: hexResolution.method || "NONE",

      canonicalTupleResolved: tupleSource === "HEX_AUTHORITY",
      canonicalTupleSource: tupleSource,
      canonicalTuple: clonePlain(tuple),
      canonicalTupleCellId: tuple.cellId,
      canonicalTupleHexId: tuple.hexId,
      canonicalTupleStateId: tuple.stateId,
      canonicalTupleRow: tuple.row,
      canonicalTupleColumn: tuple.column,
      canonicalTupleQ: tuple.q,
      canonicalTupleR: tuple.r,
      canonicalTupleS: tuple.s,
      canonicalTupleFourPairObserved: Boolean(tuple.fourPairObserved),

      coord,
      surfaceExpressionCoordSource: tupleSource === "HEX_AUTHORITY"
        ? "CANONICAL_HEX_TUPLE"
        : "LOCAL_FALLBACK_COORD",

      localCoordFallbackUsed,
      localCoordFallbackReason,

      inputCellClaim: clonePlain(claim),
      inputCellClaimStatus: claimComparison.status,
      inputCellClaimDetail: claimComparison.detail,
      inputCellClaimMatched: claimComparison.matched,

      mapAlignmentStatus,
      mapAlignmentDetail,

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      hexAuthorityMutationAuthorized: false,
      runtimeRestartAuthorized: false,

      ...FINAL_FALSE,
      resolvedAt: nowIso()
    };

    state.hexAuthoritySampleMethodUsed = binding.hexAuthoritySampleMethodUsed;
    state.canonicalTupleResolved = binding.canonicalTupleResolved;
    state.canonicalTupleSource = binding.canonicalTupleSource;
    state.canonicalTupleCellId = binding.canonicalTupleCellId;
    state.canonicalTupleStateId = binding.canonicalTupleStateId;
    state.canonicalTupleRow = binding.canonicalTupleRow;
    state.canonicalTupleColumn = binding.canonicalTupleColumn;
    state.localCoordFallbackUsed = binding.localCoordFallbackUsed;
    state.localCoordFallbackReason = binding.localCoordFallbackReason;
    state.surfaceExpressionCoordSource = binding.surfaceExpressionCoordSource;
    state.mapAlignmentStatus = binding.mapAlignmentStatus;
    state.mapAlignmentDetail = binding.mapAlignmentDetail;
    state.inputCellClaimStatus = binding.inputCellClaimStatus;
    state.lastInputCellId = claim.cellId;
    state.lastResolvedCellId = binding.canonicalTupleCellId;
    state.lastTupleBindingAt = binding.resolvedAt;
    state.lastCanonicalTuple = clonePlain(tuple);
    state.lastTupleBinding = clonePlain(binding);

    state.tupleBindingLedger.push({
      at: binding.resolvedAt,
      source: binding.canonicalTupleSource,
      method: binding.hexAuthoritySampleMethodUsed,
      cellId: binding.canonicalTupleCellId,
      row: binding.canonicalTupleRow,
      column: binding.canonicalTupleColumn,
      stateId: binding.canonicalTupleStateId,
      fallback: binding.localCoordFallbackUsed,
      fallbackReason: binding.localCoordFallbackReason,
      inputCellClaimStatus: binding.inputCellClaimStatus,
      mapAlignmentStatus: binding.mapAlignmentStatus,
      ...FINAL_FALSE
    });
    trimArray(state.tupleBindingLedger, 160);

    return binding;
  }

  function bodyFieldAt(coord) {
    let best = {
      field: -999,
      massKey: "ocean-body",
      ridge: 0,
      basin: 0,
      mineral: 0
    };

    for (let i = 0; i < BODY_MASS_HINTS.length; i += 1) {
      const mass = BODY_MASS_HINTS[i];
      const dx = degDistance(coord.lon, mass.lon) * Math.cos(mass.lat * DEG);
      const dy = coord.lat - mass.lat;
      const ca = Math.cos(mass.angle * DEG);
      const sa = Math.sin(mass.angle * DEG);
      const x = dx * ca - dy * sa;
      const y = dx * sa + dy * ca;
      const nx = x / mass.rx;
      const ny = y / mass.ry;
      const theta = Math.atan2(ny, nx);
      const dist = Math.sqrt(nx * nx + ny * ny);

      const angularBreak =
        Math.sin(theta * (5 + i) + i * 0.71) * 0.055 +
        Math.sin(theta * (9 + i) - i * 0.43) * 0.038;

      const fracture =
        (fbm(coord.u * 18 + i * 3.1, coord.v * 12 - i * 2.4, 710 + i * 53, 4) - 0.5) * 0.22;

      const bayCut =
        smoothstep(0.58, 0.92, fbm(coord.u * 36 - i * 2.7, coord.v * 26 + i * 4.2, 910 + i * 79, 3)) * 0.11;

      const field = 1 - dist + angularBreak + fracture - bayCut;

      if (field > best.field) {
        best = {
          field,
          massKey: mass.key,
          ridge: smoothstep(0.44, 0.91, fbm(coord.u * 12 + i, coord.v * 15 - i, 1200 + i * 41, 5)),
          basin: smoothstep(0.10, 0.38, 1 - fbm(coord.u * 12 + i, coord.v * 15 - i, 1300 + i * 41, 5)),
          mineral: smoothstep(0.62, 0.96, fbm(coord.u * 44 + i * 2, coord.v * 41 - i * 3, 1500 + i * 83, 3))
        };
      }
    }

    return best;
  }

  function composeMaterialClass(expression) {
    if (expression.isWater) {
      if (expression.shelf > 0.55) return "shallow-shelf-water";
      if (expression.deep > 0.78) return "deep-ocean-basin";
      return "ocean-body";
    }

    if (expression.cold > 0.72 && expression.relief > 0.48) return "cold-highland";
    if (expression.relief > 0.72) return "ridge-and-cliff";
    if (expression.arid > 0.64) return "dry-rock-soil";
    if (expression.wet > 0.58) return "wet-weathered-ground";
    return "weathered-land-body";
  }

  function composeColor(expression) {
    const grain = clamp01(expression.grain);
    const relief = clamp01(expression.relief);
    const coast = clamp01(expression.coast);
    const mineral = clamp01(expression.mineral);
    const cold = clamp01(expression.cold);
    const arid = clamp01(expression.arid);
    const wet = clamp01(expression.wet);
    const shelf = clamp01(expression.shelf);
    const deep = clamp01(expression.deep);
    const basin = clamp01(expression.basin);

    let color;

    if (expression.isLand) {
      color = COLOR.landLow.slice();
      color = mixColor(color, COLOR.landWarm, arid * 0.42);
      color = mixColor(color, COLOR.landWet, wet * 0.38);
      color = mixColor(color, COLOR.ridge, relief * 0.34);
      color = mixColor(color, COLOR.granite, relief * relief * 0.30);
      color = mixColor(color, COLOR.cliff, clamp01(relief * coast) * 0.24);
      color = mixColor(color, COLOR.snow, cold * relief * 0.48);
      color = mixColor(color, COLOR.copper, mineral * 0.08);
    } else {
      color = COLOR.ocean.slice();
      color = mixColor(color, COLOR.deep, deep * 0.55);
      color = mixColor(color, COLOR.abyss, deep * deep * 0.36);
      color = mixColor(color, COLOR.shelf, shelf * 0.58);
      color = mixColor(color, COLOR.foam, shelf * coast * 0.16);
    }

    const micro =
      (grain - 0.5) * 0.31 +
      (relief - 0.5) * (expression.isLand ? 0.18 : 0.04) -
      basin * (expression.isLand ? 0.07 : 0.02);

    return multiplyColor(color, clamp(1 + micro, 0.72, 1.28));
  }

  function sampleSurfaceExpression(input = {}, options = {}) {
    const request = isObject(input) ? input : {};
    state.expressionRequestCount += 1;

    if (hasForbiddenClaim(request)) {
      state.expressionRejectedCount += 1;
      state.updatedAt = nowIso();

      return {
        ok: false,
        rejected: true,
        rejectedReason: "FORBIDDEN_CLAIM_REJECTED_BY_SURFACE_POINTER_BISHOP",
        contract: CONTRACT,
        receipt: RECEIPT,
        packetType: EXPRESSION_PACKET,
        file: FILE,
        sourceFile: FILE,
        consumerFile: HEX_SURFACE_FILE,
        surfaceExpressionAuthority: true,
        hexAuthorityTupleBindingActive: true,
        canonicalTupleResolved: false,
        canonicalTupleSource: "NONE",
        mapAlignmentStatus: "REJECTED_FORBIDDEN_CLAIM",
        ...FINAL_FALSE
      };
    }

    const binding = resolveCanonicalTuple(request, options);
    const coord = binding.coord;
    const tuple = binding.canonicalTuple;
    const body = bodyFieldAt(coord);

    const stateSeed = tuple && tuple.stateId !== "UNKNOWN" ? safeNumber(tuple.stateId, 0) : safeNumber(request.stateId, 0);

    const grain =
      fbm(
        coord.u * 32 + stateSeed * 0.031,
        coord.v * 24 - stateSeed * 0.027,
        2200,
        4
      );

    const field = body.field + (grain - 0.5) * 0.08;
    const isLand = field > 0.02;
    const coast = smoothstep(0, 0.88, 1 - clamp(Math.abs(field) * 16, 0, 1));
    const latAbs = Math.abs(coord.lat) / 90;

    const shelf = !isLand ? smoothstep(-0.24, 0.04, field) * (0.45 + grain * 0.35) : 0;
    const deep = !isLand ? clamp01(1 - shelf * 0.72) : 0;
    const cold = smoothstep(0.68, 0.98, latAbs);
    const relief = isLand ? clamp01(body.ridge * 0.72 + grain * 0.24) : 0;
    const arid = isLand ? smoothstep(0.62, 0.88, fbm(coord.u * 7, coord.v * 5, 2500, 3)) * (1 - cold * 0.4) : 0;
    const wet = isLand ? smoothstep(0.50, 0.86, fbm(coord.u * 9 + 8, coord.v * 8 - 4, 2600, 3)) * (1 - arid * 0.45) : 0;
    const mineral = clamp01(body.mineral);
    const basin = clamp01(body.basin);
    const elevationExpression = isLand
      ? clamp01(0.42 + relief * 0.42 - coast * 0.10)
      : clamp(-0.18 + shelf * 0.20 - deep * 0.28, -1, 0.2);

    const landPresence = isLand ? clamp01(0.5 + field * 0.55) : clamp01(0.5 + field * 0.15);
    const waterPresence = clamp01(1 - landPresence);

    const expressionBase = {
      ok: true,
      rejected: false,
      packetType: EXPRESSION_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      route: ROUTE,

      sourceFile: FILE,
      sourceContract: CONTRACT,
      sourceReceipt: RECEIPT,
      sourceAuthority: "SURFACE_POINTER_BISHOP",
      sourceRole: "renderable-surface-expression-socket",
      consumerFile: HEX_SURFACE_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      surfaceExpressionAuthority: true,
      hexExpressionSocketActive: true,
      renderableByHexSurface: true,
      projectionRequired: true,
      canvasDrawRequiredDownstream: true,
      projectionOwner: HEX_SURFACE_FILE,
      canvasDrawingOwner: HEX_SURFACE_FILE,
      directCanvasDrawingSuppressed: true,

      hexAuthorityTupleBindingActive: true,
      hexAuthorityObserved: binding.hexAuthorityObserved,
      hexAuthoritySource: binding.hexAuthoritySource,
      hexAuthorityContract: binding.hexAuthorityContract,
      hexAuthorityReceipt: binding.hexAuthorityReceipt,
      hexAuthorityRecognized: binding.hexAuthorityRecognized,
      hexAuthoritySampleMethodUsed: binding.hexAuthoritySampleMethodUsed,

      canonicalTupleResolved: binding.canonicalTupleResolved,
      canonicalTupleSource: binding.canonicalTupleSource,
      canonicalTuple: clonePlain(binding.canonicalTuple),
      canonicalTupleCellId: binding.canonicalTupleCellId,
      canonicalTupleHexId: binding.canonicalTupleHexId,
      canonicalTupleStateId: binding.canonicalTupleStateId,
      canonicalTupleRow: binding.canonicalTupleRow,
      canonicalTupleColumn: binding.canonicalTupleColumn,
      canonicalTupleQ: binding.canonicalTupleQ,
      canonicalTupleR: binding.canonicalTupleR,
      canonicalTupleS: binding.canonicalTupleS,
      canonicalTupleFourPairObserved: binding.canonicalTupleFourPairObserved,

      localCoordFallbackUsed: binding.localCoordFallbackUsed,
      localCoordFallbackReason: binding.localCoordFallbackReason,
      surfaceExpressionCoordSource: binding.surfaceExpressionCoordSource,
      mapAlignmentStatus: binding.mapAlignmentStatus,
      mapAlignmentDetail: binding.mapAlignmentDetail,
      inputCellClaimStatus: binding.inputCellClaimStatus,
      inputCellClaimDetail: binding.inputCellClaimDetail,
      inputCellClaimMatched: binding.inputCellClaimMatched,

      coord,
      hexPacket: {
        cellId: binding.canonicalTupleCellId,
        hexId: binding.canonicalTupleHexId,
        stateId: binding.canonicalTupleStateId,
        row: binding.canonicalTupleRow,
        column: binding.canonicalTupleColumn,
        q: binding.canonicalTupleQ,
        r: binding.canonicalTupleR,
        s: binding.canonicalTupleS
      },

      isLand,
      isWater: !isLand,
      landPresence,
      waterPresence,
      field,
      massKey: body.massKey,
      coast,
      relief,
      ridge: body.ridge,
      basin,
      shelf,
      deep,
      cold,
      arid,
      wet,
      mineral,
      grain,
      elevationExpression,

      terrainTruthClaimed: false,
      hydrologyTruthClaimed: false,
      materialTruthClaimed: false,
      elevationTruthClaimed: false,
      compositeTruthClaimed: false,

      ...FINAL_FALSE
    };

    const color = composeColor(expressionBase);
    const materialClass = composeMaterialClass(expressionBase);

    const expression = {
      ...expressionBase,
      rgb: color,
      rgba: color,
      color,
      materialClass,
      materialFamily: materialClass,
      expressionReady: true,
      sampledAt: nowIso()
    };

    state.expressionServedCount += 1;
    state.latestExpressionAt = expression.sampledAt;
    state.latestExpressionSource = safeString(
      request.sourceFile || request.consumerFile || options.sourceName || "HEX_SURFACE_SAMPLE_REQUEST"
    );
    state.latestExpressionCellId = expression.hexPacket.cellId;
    state.latestExpressionMaterialClass = materialClass;
    state.latestExpressionLandPresence = landPresence;
    state.latestExpressionWaterPresence = waterPresence;
    state.lastSurfaceExpression = clonePlain(expression);

    state.firstFailedCoordinate = binding.localCoordFallbackUsed
      ? "HEX_AUTHORITY_TUPLE_FALLBACK_USED"
      : binding.inputCellClaimStatus === "INPUT_CELL_VARIANCE_DETECTED"
        ? "INPUT_CELL_VARIANCE_DETECTED"
        : "NONE_SURFACE_EXPRESSION_BOUND_TO_HEX_AUTHORITY_TUPLE";

    state.recommendedNextFile = binding.localCoordFallbackUsed || binding.inputCellClaimStatus === "INPUT_CELL_VARIANCE_DETECTED"
      ? HEX_AUTHORITY_FILE
      : HEX_SURFACE_FILE;

    state.recommendedNextRenewalTarget = state.recommendedNextFile;

    state.postgameStatus = binding.localCoordFallbackUsed
      ? "SURFACE_POINTER_BISHOP_EXPRESSION_SERVED_WITH_LOCAL_FALLBACK"
      : binding.inputCellClaimStatus === "INPUT_CELL_VARIANCE_DETECTED"
        ? "SURFACE_POINTER_BISHOP_EXPRESSION_SERVED_WITH_INPUT_CELL_VARIANCE"
        : "SURFACE_POINTER_BISHOP_EXPRESSION_SERVED_BOUND_TO_HEX_AUTHORITY_TUPLE";

    state.expressionLedger.push({
      at: expression.sampledAt,
      cellId: expression.hexPacket.cellId,
      hexId: expression.hexPacket.hexId,
      stateId: expression.hexPacket.stateId,
      row: expression.hexPacket.row,
      column: expression.hexPacket.column,
      q: expression.hexPacket.q,
      r: expression.hexPacket.r,
      s: expression.hexPacket.s,
      u: coord.u,
      v: coord.v,
      lon: coord.lon,
      lat: coord.lat,
      isLand,
      materialClass,
      landPresence,
      waterPresence,
      tupleSource: binding.canonicalTupleSource,
      tupleMethod: binding.hexAuthoritySampleMethodUsed,
      localCoordFallbackUsed: binding.localCoordFallbackUsed,
      mapAlignmentStatus: binding.mapAlignmentStatus,
      inputCellClaimStatus: binding.inputCellClaimStatus,
      source: state.latestExpressionSource,
      ...FINAL_FALSE
    });
    trimArray(state.expressionLedger, 160);

    updateDataset();
    publishReceiptAliases();

    return expression;
  }

  function sampleHexSurfaceExpression(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, {
      ...options,
      sourceName: options.sourceName || "HEX_SURFACE_EXPRESSION_REQUEST"
    });
  }

  function getRenderableSurfaceExpression(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, options);
  }

  function getSurfaceExpressionAt(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, options);
  }

  function receiveHexSurfaceExpressionRequest(packet = {}, options = {}) {
    return sampleHexSurfaceExpression(packet, options);
  }

  function sample(packet = {}, options = {}) {
    return sampleSurfaceExpression(packet, options);
  }

  function buildSurfaceModel() {
    return {
      modelType: "HEARTH_SURFACE_POINTER_BISHOP_HEX_AUTHORITY_TUPLE_BINDING_MODEL",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      route: ROUTE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      surfaceBridgeRole: "HEX_FACING_SURFACE_EXPRESSION_SOCKET_ONLY",
      simplifiedBridgeActive: true,
      hexExpressionSocketActive: true,
      renderableSurfaceExpressionProviderActive: true,

      hexAuthorityTupleBindingActive: true,
      expectedHexAuthorityFile: HEX_AUTHORITY_FILE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      controllingMathPath:
        "input coord -> Hex Authority sample/read/getCell -> canonical tuple -> Surface expression",
      fallbackPolicy:
        "LOCAL_COORD_FALLBACK_ALLOWED_ONLY_WHEN_HEX_AUTHORITY_TUPLE_IS_UNAVAILABLE_AND_MUST_BE_RECEIPT_VISIBLE",

      bodyMassHints: clonePlain(BODY_MASS_HINTS),
      coordinateSpace: "canonical-hex-authority-tuple-u-v-lon-lat",
      sampleMethods: [
        "sampleHexSurfaceExpression",
        "sampleSurfaceExpression",
        "getRenderableSurfaceExpression",
        "getSurfaceExpressionAt",
        "receiveHexSurfaceExpressionRequest"
      ],

      inspectOwnsFingerStretchManagement: true,
      surfaceOwnsFingerStretchManagement: false,
      surfaceOwnsOtherFingerInspection: false,

      projectionOwner: HEX_SURFACE_FILE,
      canvasDrawingOwner: HEX_SURFACE_FILE,
      directCanvasDrawingSuppressed: true,

      terrainTruthClaimed: false,
      hydrologyTruthClaimed: false,
      materialTruthClaimed: false,
      elevationTruthClaimed: false,
      compositeTruthClaimed: false,
      finalVisualPassClaimed: false,
      ...FINAL_FALSE
    };
  }

  function buildSurfacePacket() {
    const packet = {
      packetType: "HEARTH_CANVAS_FINGER_SURFACE_HEX_AUTHORITY_TUPLE_BINDING_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV4Contract: LINEAGE_V4_CONTRACT,
      lineageV3Contract: LINEAGE_V3_CONTRACT,
      lineageV2Contract: LINEAGE_V2_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      lightFile: LIGHT_FILE,
      inspectFile: INSPECT_FILE,
      compositeFile: COMPOSITE_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      surfaceFingerLoaded: true,
      surfaceFingerActive: true,
      pointerFingerSurfaceActive: true,
      pointerBishopActive: true,
      nonCardinalBishopLanguageActive: true,
      legacyFingerCompatibilityActive: true,

      simplifiedBridgeActive: true,
      hexExpressionSocketActive: true,
      hexTransmissionReceiverActive: true,
      renderableSurfaceExpressionProviderActive: true,
      surfaceModelReady: true,
      surfacePacketReady: true,
      pointerFingerPacketReady: true,
      pointerBishopPacketReady: true,

      hexAuthorityTupleBindingActive: true,
      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      hexAuthoritySampleMethodUsed: state.hexAuthoritySampleMethodUsed,
      canonicalTupleResolved: state.canonicalTupleResolved,
      canonicalTupleSource: state.canonicalTupleSource,
      canonicalTupleCellId: state.canonicalTupleCellId,
      localCoordFallbackUsed: state.localCoordFallbackUsed,
      localCoordFallbackReason: state.localCoordFallbackReason,
      surfaceExpressionCoordSource: state.surfaceExpressionCoordSource,
      mapAlignmentStatus: state.mapAlignmentStatus,
      mapAlignmentDetail: state.mapAlignmentDetail,
      inputCellClaimStatus: state.inputCellClaimStatus,

      sampleHexSurfaceExpressionAvailable: true,
      sampleSurfaceExpressionAvailable: true,
      getRenderableSurfaceExpressionAvailable: true,
      getSurfaceExpressionAtAvailable: true,
      receiveHexSurfaceExpressionRequestAvailable: true,

      receiveHexSurfaceTransmissionPacketAvailable: true,
      consumeHexSurfaceTransmissionPacketAvailable: true,
      receivePointerFingerTransmissionPacketAvailable: true,
      consumePointerFingerTransmissionPacketAvailable: true,
      receiveCanvasFingerPacketAvailable: true,
      receiveCanvasBishopPacketAvailable: true,

      surfaceModel: buildSurfaceModel(),

      inspectOwnsFingerStretchManagement: true,
      surfaceOwnsFingerStretchManagement: false,
      surfaceOwnsOtherFingerInspection: false,
      surfaceOwnsBoundaryFinger: false,
      surfaceOwnsMassFinger: false,
      surfaceOwnsLightFinger: false,
      surfaceOwnsInspectFinger: false,
      surfaceOwnsCompositeFinger: false,

      projectionOwner: HEX_SURFACE_FILE,
      canvasDrawingOwner: HEX_SURFACE_FILE,
      canvasDrawingDelegatedToHexSurface: true,
      hexSurfaceProjectionDelegated: true,
      directCanvasDrawingSuppressed: true,
      canvasLifecycleCallsSuppressed: true,
      domMutationSuppressed: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.surfacePacket = clonePlain(packet);
    state.surfacePacketReady = true;
    return packet;
  }

  function buildPointerFingerPacket() {
    const packet = {
      packetType: "HEARTH_CANVAS_POINTER_FINGER_SURFACE_COMPATIBILITY_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      route: ROUTE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      pointerFingerSurfaceActive: true,
      legacyFingerCompatibilityActive: true,

      bishopName: BISHOP_NAME,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,

      surfacePacket: buildSurfacePacket(),
      sampleHexSurfaceExpressionAvailable: true,
      receiveHexSurfaceTransmissionPacketAvailable: true,
      hexAuthorityTupleBindingActive: true,

      inspectOwnsFingerStretchManagement: true,
      surfaceOwnsFingerStretchManagement: false,
      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.pointerFingerPacket = clonePlain(packet);
    state.pointerFingerPacketReady = true;
    return packet;
  }

  function buildPointerBishopPacket() {
    const packet = {
      packetType: "HEARTH_CANVAS_SURFACE_POINTER_BISHOP_HEX_AUTHORITY_TUPLE_BINDING_PACKET",
      packetName: PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      route: ROUTE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      legacyFingerName: FINGER_NAME,
      legacyFingerRole: FINGER_ROLE,
      legacyFingerOrder: FINGER_ORDER,
      legacyFingerCompatibilityActive: true,

      simplifiedBridgeActive: true,
      hexExpressionSocketActive: true,
      renderableSurfaceExpressionProviderActive: true,
      hexAuthorityTupleBindingActive: true,
      surfacePacket: buildSurfacePacket(),

      sampleHexSurfaceExpressionAvailable: true,
      receiveHexSurfaceTransmissionPacketAvailable: true,

      inspectOwnsFingerStretchManagement: true,
      surfaceOwnsFingerStretchManagement: false,
      noClaimsPreserved: true,
      ...FINAL_FALSE,
      updatedAt: nowIso()
    };

    state.pointerBishopPacket = clonePlain(packet);
    state.pointerBishopPacketReady = true;
    return packet;
  }

  function getSurfacePacket(options = {}) {
    if (!state.surfacePacket || options.rebuild === true) return buildSurfacePacket();
    return clonePlain(state.surfacePacket);
  }

  function getPointerFingerPacket(options = {}) {
    if (!state.pointerFingerPacket || options.rebuild === true) return buildPointerFingerPacket();
    return clonePlain(state.pointerFingerPacket);
  }

  function getPointerBishopPacket(options = {}) {
    if (!state.pointerBishopPacket || options.rebuild === true) return buildPointerBishopPacket();
    return clonePlain(state.pointerBishopPacket);
  }

  function getBishopPacket(options = {}) {
    return getPointerBishopPacket(options);
  }

  function acknowledgeTransmission(packet, receiverName) {
    const samplePreview = sampleSurfaceExpression(
      {
        sourceFile: FILE,
        consumerFile: HEX_SURFACE_FILE,
        cellId: "SURFACE_POINTER_BISHOP_PREVIEW",
        u: 0.5,
        v: 0.5
      },
      { sourceName: receiverName || "HEX_SURFACE_TRANSMISSION_PREVIEW" }
    );

    const ack = {
      packetType: TRANSMISSION_PACKET,
      accepted: true,
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
      file: FILE,
      route: ROUTE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,

      receiver: receiverName || "receiveHexSurfaceTransmissionPacket",
      receivedSourcePacketType: safeString(packet.packetType || packet.type || "UNKNOWN"),
      receivedSourceFile: safeString(packet.sourceFile || packet.fromFile || "UNKNOWN"),
      receivedAt: nowIso(),

      surfaceExpressionReady: true,
      sampleHexSurfaceExpressionAvailable: true,
      renderableSurfaceExpressionProviderActive: true,
      surfacePacketReady: true,
      pointerFingerPacketReady: true,
      pointerBishopPacketReady: true,

      hexAuthorityTupleBindingActive: true,
      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      hexAuthoritySampleMethodUsed: state.hexAuthoritySampleMethodUsed,
      canonicalTupleResolved: state.canonicalTupleResolved,
      canonicalTupleSource: state.canonicalTupleSource,
      localCoordFallbackUsed: state.localCoordFallbackUsed,
      surfaceExpressionCoordSource: state.surfaceExpressionCoordSource,
      mapAlignmentStatus: state.mapAlignmentStatus,

      samplePreview,
      surfacePacket: getSurfacePacket({ rebuild: true }),

      inspectOwnsFingerStretchManagement: true,
      surfaceOwnsFingerStretchManagement: false,
      canvasDrawingDelegatedToHexSurface: true,
      directCanvasDrawingSuppressed: true,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };

    state.lastTransmissionAckPacket = clonePlain(ack);
    return ack;
  }

  function receiveHexSurfaceTransmissionPacket(packet = {}, options = {}) {
    state.receivedTransmissionCount += 1;

    if (!transmissionLooksLawful(packet)) {
      state.rejectedTransmissionCount += 1;
      state.lastRejectedPacket = clonePlain(packet);
      state.lastRejectionReason = hasForbiddenClaim(packet)
        ? "FORBIDDEN_CLAIM_REJECTED_BY_SURFACE_POINTER_BISHOP"
        : "TRANSMISSION_NOT_RECOGNIZED_AS_HEX_SURFACE_PACKET";
      state.latestTransmissionStatus = "REJECTED";
      state.latestTransmissionReason = state.lastRejectionReason;
      state.firstFailedCoordinate = state.lastRejectionReason;
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.postgameStatus = "SURFACE_POINTER_BISHOP_REJECTED_TRANSMISSION";

      record("SURFACE_POINTER_BISHOP_REJECTED_HEX_TRANSMISSION", {
        reason: state.lastRejectionReason,
        packetType: packet && packet.packetType
      });

      updateDataset();
      publishReceiptAliases();

      return {
        accepted: false,
        ok: false,
        rejected: true,
        reason: state.lastRejectionReason,
        contract: CONTRACT,
        receipt: RECEIPT,
        file: FILE,
        hexAuthorityTupleBindingActive: true,
        ...FINAL_FALSE
      };
    }

    state.acceptedTransmissionCount += 1;
    state.lastTransmissionPacket = clonePlain(packet);
    state.latestTransmissionAt = nowIso();
    state.latestTransmissionSource = safeString(packet.sourceFile || packet.sourceAuthority || "HEX_SURFACE");
    state.latestTransmissionStatus = "ACCEPTED";
    state.latestTransmissionReason = "HEX_SURFACE_TRANSMISSION_ACCEPTED_BY_SURFACE_POINTER_BISHOP";
    state.firstFailedCoordinate = "NONE_HEX_SURFACE_TRANSMISSION_ACCEPTED";
    state.recommendedNextFile = HEX_SURFACE_FILE;
    state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
    state.postgameStatus = "SURFACE_POINTER_BISHOP_HEX_SOCKET_ACTIVE_TRANSMISSION_ACCEPTED";

    const ack = acknowledgeTransmission(packet, options.receiver || "receiveHexSurfaceTransmissionPacket");

    state.transmissionLedger.push({
      at: state.latestTransmissionAt,
      receiver: options.receiver || "receiveHexSurfaceTransmissionPacket",
      packetType: safeString(packet.packetType || packet.type || "UNKNOWN"),
      sourceFile: safeString(packet.sourceFile || packet.fromFile || "UNKNOWN"),
      accepted: true,
      surfaceExpressionReady: true,
      hexAuthorityTupleBindingActive: true,
      mapAlignmentStatus: state.mapAlignmentStatus,
      ...FINAL_FALSE
    });
    trimArray(state.transmissionLedger, 120);

    record("SURFACE_POINTER_BISHOP_ACCEPTED_HEX_TRANSMISSION", {
      receiver: options.receiver || "receiveHexSurfaceTransmissionPacket",
      sourcePacketType: packet.packetType || "UNKNOWN",
      sourceFile: packet.sourceFile || "UNKNOWN",
      mapAlignmentStatus: state.mapAlignmentStatus,
      tupleSource: state.canonicalTupleSource
    });

    updateDataset();
    publishGlobals();

    return ack;
  }

  function consumeHexSurfaceTransmissionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "consumeHexSurfaceTransmissionPacket"
    });
  }

  function receivePointerFingerTransmissionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "receivePointerFingerTransmissionPacket"
    });
  }

  function consumePointerFingerTransmissionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "consumePointerFingerTransmissionPacket"
    });
  }

  function receiveCanvasFingerPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "receiveCanvasFingerPacket"
    });
  }

  function consumeCanvasFingerPacket(packet = {}, options = {}) {
    return receiveCanvasFingerPacket(packet, {
      ...options,
      receiver: "consumeCanvasFingerPacket"
    });
  }

  function receiveCanvasBishopPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "receiveCanvasBishopPacket"
    });
  }

  function receiveSurfacePacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "receiveSurfacePacket"
    });
  }

  function receiveSurfaceExpressionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "receiveSurfaceExpressionPacket"
    });
  }

  function acceptTransmissionPacket(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "acceptTransmissionPacket"
    });
  }

  function receive(packet = {}, options = {}) {
    return receiveHexSurfaceTransmissionPacket(packet, {
      ...options,
      receiver: "receive"
    });
  }

  function drawToCanvas() {
    return {
      drawn: false,
      ok: false,
      reason: "SURFACE_POINTER_BISHOP_DOES_NOT_DRAW_CANVAS_HEX_SURFACE_OWNS_PROJECTION_AND_CANVAS_DRAWING",
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      projectionOwner: HEX_SURFACE_FILE,
      canvasDrawingOwner: HEX_SURFACE_FILE,
      directCanvasDrawingSuppressed: true,
      hexAuthorityTupleBindingActive: true,
      ...FINAL_FALSE
    };
  }

  function getState() {
    return clonePlain(state);
  }

  function read() {
    return getReceiptLight();
  }

  function getReceiptLight() {
    readHexAuthority();

    return {
      timestamp: state.timestamp || nowIso(),
      contract: CONTRACT,
      receipt: RECEIPT,
      packet: PACKET,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      lineageV4Contract: LINEAGE_V4_CONTRACT,
      lineageV3Contract: LINEAGE_V3_CONTRACT,
      lineageV2Contract: LINEAGE_V2_CONTRACT,
      baselineContract: BASELINE_CONTRACT,
      version: VERSION,

      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      parentHubFile: PARENT_HUB_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
      boundaryFile: BOUNDARY_FILE,
      massFile: MASS_FILE,
      lightFile: LIGHT_FILE,
      inspectFile: INSPECT_FILE,
      compositeFile: COMPOSITE_FILE,

      fingerName: FINGER_NAME,
      fingerRole: FINGER_ROLE,
      fingerOrder: FINGER_ORDER,
      fingerStretchTotal: FINGER_STRETCH_TOTAL,

      bishopName: BISHOP_NAME,
      bishopTitle: BISHOP_TITLE,
      bishopRole: BISHOP_ROLE,
      bishopRank: BISHOP_RANK,
      bishopAddress: BISHOP_ADDRESS,
      bishopDirection: BISHOP_DIRECTION,
      bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

      surfaceFingerLoaded: state.surfaceFingerLoaded,
      surfaceFingerActive: state.surfaceFingerActive,
      pointerFingerSurfaceActive: state.pointerFingerSurfaceActive,
      pointerBishopActive: state.pointerBishopActive,
      nonCardinalBishopLanguageActive: state.nonCardinalBishopLanguageActive,
      legacyFingerCompatibilityActive: state.legacyFingerCompatibilityActive,

      simplifiedBridgeActive: state.simplifiedBridgeActive,
      hexExpressionSocketActive: state.hexExpressionSocketActive,
      hexTransmissionReceiverActive: state.hexTransmissionReceiverActive,
      renderableSurfaceExpressionProviderActive: state.renderableSurfaceExpressionProviderActive,

      hexAuthorityTupleBindingActive: true,
      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityReceipt: state.hexAuthorityReceipt,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      hexAuthoritySampleMethodUsed: state.hexAuthoritySampleMethodUsed,
      canonicalTupleResolved: state.canonicalTupleResolved,
      canonicalTupleSource: state.canonicalTupleSource,
      canonicalTupleCellId: state.canonicalTupleCellId,
      canonicalTupleStateId: state.canonicalTupleStateId,
      canonicalTupleRow: state.canonicalTupleRow,
      canonicalTupleColumn: state.canonicalTupleColumn,
      localCoordFallbackUsed: state.localCoordFallbackUsed,
      localCoordFallbackReason: state.localCoordFallbackReason,
      surfaceExpressionCoordSource: state.surfaceExpressionCoordSource,
      mapAlignmentStatus: state.mapAlignmentStatus,
      mapAlignmentDetail: state.mapAlignmentDetail,
      inputCellClaimStatus: state.inputCellClaimStatus,
      lastInputCellId: state.lastInputCellId,
      lastResolvedCellId: state.lastResolvedCellId,
      lastTupleBindingAt: state.lastTupleBindingAt,

      inspectOwnsFingerStretchManagement: true,
      surfaceOwnsFingerStretchManagement: false,
      surfaceOwnsOtherFingerInspection: false,
      surfaceOwnsBoundaryFinger: false,
      surfaceOwnsMassFinger: false,
      surfaceOwnsLightFinger: false,
      surfaceOwnsInspectFinger: false,
      surfaceOwnsCompositeFinger: false,

      canvasDrawingDelegatedToHexSurface: true,
      hexSurfaceProjectionDelegated: true,
      directCanvasDrawingSuppressed: true,
      canvasLifecycleCallsSuppressed: true,
      domMutationSuppressed: true,

      surfaceModelReady: state.surfaceModelReady,
      surfacePacketReady: state.surfacePacketReady,
      pointerFingerPacketReady: state.pointerFingerPacketReady,
      pointerBishopPacketReady: state.pointerBishopPacketReady,
      sampleHexSurfaceExpressionReady: state.sampleHexSurfaceExpressionReady,
      sampleSurfaceExpressionReady: state.sampleSurfaceExpressionReady,
      renderableSurfaceExpressionReady: state.renderableSurfaceExpressionReady,

      sampleHexSurfaceExpressionAvailable: true,
      sampleSurfaceExpressionAvailable: true,
      getRenderableSurfaceExpressionAvailable: true,
      getSurfaceExpressionAtAvailable: true,
      receiveHexSurfaceExpressionRequestAvailable: true,
      resolveCanonicalTupleAvailable: true,

      receiveHexSurfaceTransmissionPacketAvailable: true,
      consumeHexSurfaceTransmissionPacketAvailable: true,
      receivePointerFingerTransmissionPacketAvailable: true,
      consumePointerFingerTransmissionPacketAvailable: true,
      receiveCanvasFingerPacketAvailable: true,
      receiveCanvasBishopPacketAvailable: true,

      receivedTransmissionCount: state.receivedTransmissionCount,
      acceptedTransmissionCount: state.acceptedTransmissionCount,
      rejectedTransmissionCount: state.rejectedTransmissionCount,
      expressionRequestCount: state.expressionRequestCount,
      expressionServedCount: state.expressionServedCount,
      expressionRejectedCount: state.expressionRejectedCount,
      hexAuthorityTupleRequestCount: state.hexAuthorityTupleRequestCount,
      hexAuthorityTupleResolvedCount: state.hexAuthorityTupleResolvedCount,
      localCoordFallbackCount: state.localCoordFallbackCount,
      inputCellVarianceCount: state.inputCellVarianceCount,

      latestTransmissionAt: state.latestTransmissionAt,
      latestTransmissionSource: state.latestTransmissionSource,
      latestTransmissionStatus: state.latestTransmissionStatus,
      latestTransmissionReason: state.latestTransmissionReason,
      latestExpressionAt: state.latestExpressionAt,
      latestExpressionSource: state.latestExpressionSource,
      latestExpressionCellId: state.latestExpressionCellId,
      latestExpressionMaterialClass: state.latestExpressionMaterialClass,
      latestExpressionLandPresence: state.latestExpressionLandPresence,
      latestExpressionWaterPresence: state.latestExpressionWaterPresence,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextRenewalTarget: state.recommendedNextRenewalTarget,
      postgameStatus: state.postgameStatus,

      booted: state.booted,
      mounted: state.mounted,

      noClaimsPreserved: true,
      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      currentReceipt: true,
      surfaceModel: buildSurfaceModel(),
      surfacePacket: clonePlain(state.surfacePacket || buildSurfacePacket()),
      pointerFingerPacket: clonePlain(state.pointerFingerPacket || buildPointerFingerPacket()),
      pointerBishopPacket: clonePlain(state.pointerBishopPacket || buildPointerBishopPacket()),
      lastTransmissionPacket: clonePlain(state.lastTransmissionPacket),
      lastTransmissionAckPacket: clonePlain(state.lastTransmissionAckPacket),
      lastRejectedPacket: clonePlain(state.lastRejectedPacket),
      lastSurfaceExpression: clonePlain(state.lastSurfaceExpression),
      lastCanonicalTuple: clonePlain(state.lastCanonicalTuple),
      lastTupleBinding: clonePlain(state.lastTupleBinding),
      expressionLedger: clonePlain(state.expressionLedger),
      transmissionLedger: clonePlain(state.transmissionLedger),
      tupleBindingLedger: clonePlain(state.tupleBindingLedger),
      aliasPaths: clonePlain(SURFACE_ALIAS_PATHS),
      hexAuthorityAliasPaths: clonePlain(HEX_AUTHORITY_ALIAS_PATHS),
      bodyMassHints: clonePlain(BODY_MASS_HINTS),
      localEvents: clonePlain(state.localEvents),
      errors: clonePlain(state.errors),
      updatedAt: state.updatedAt || nowIso()
    };
  }

  function getReceiptText() {
    const r = getReceiptLight();

    return [
      "HEARTH_CANVAS_FINGER_SURFACE_HEX_AUTHORITY_TUPLE_BINDING_RECEIPT",
      "",
      line("timestamp", r.timestamp),
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("packet", r.packet),
      line("internalImplementationContract", r.internalImplementationContract),
      line("internalImplementationReceipt", r.internalImplementationReceipt),
      line("previousInternalImplementationContract", r.previousInternalImplementationContract),
      line("previousContract", r.previousContract),
      line("lineageV4Contract", r.lineageV4Contract),
      line("lineageV3Contract", r.lineageV3Contract),
      line("lineageV2Contract", r.lineageV2Contract),
      line("baselineContract", r.baselineContract),
      line("version", r.version),
      line("file", r.file),
      line("route", r.route),
      line("hexSurfaceFile", r.hexSurfaceFile),
      line("hexAuthorityFile", r.hexAuthorityFile),
      "",
      "IDENTITY",
      line("fingerName", r.fingerName),
      line("fingerRole", r.fingerRole),
      line("fingerOrder", r.fingerOrder),
      line("bishopName", r.bishopName),
      line("bishopTitle", r.bishopTitle),
      line("bishopRole", r.bishopRole),
      line("bishopRank", r.bishopRank),
      line("bishopAddress", r.bishopAddress),
      line("bishopDirection", r.bishopDirection),
      line("bishopCardinalDisposition", r.bishopCardinalDisposition),
      "",
      "HEX_AUTHORITY_TUPLE_BINDING",
      line("hexAuthorityTupleBindingActive", r.hexAuthorityTupleBindingActive),
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexAuthoritySource", r.hexAuthoritySource),
      line("hexAuthorityContract", r.hexAuthorityContract),
      line("hexAuthorityRecognized", r.hexAuthorityRecognized),
      line("hexAuthoritySampleMethodUsed", r.hexAuthoritySampleMethodUsed),
      line("canonicalTupleResolved", r.canonicalTupleResolved),
      line("canonicalTupleSource", r.canonicalTupleSource),
      line("canonicalTupleCellId", r.canonicalTupleCellId),
      line("canonicalTupleStateId", r.canonicalTupleStateId),
      line("canonicalTupleRow", r.canonicalTupleRow),
      line("canonicalTupleColumn", r.canonicalTupleColumn),
      line("localCoordFallbackUsed", r.localCoordFallbackUsed),
      line("localCoordFallbackReason", r.localCoordFallbackReason),
      line("surfaceExpressionCoordSource", r.surfaceExpressionCoordSource),
      line("mapAlignmentStatus", r.mapAlignmentStatus),
      line("mapAlignmentDetail", r.mapAlignmentDetail),
      line("inputCellClaimStatus", r.inputCellClaimStatus),
      "",
      "HEX_SOCKET",
      line("simplifiedBridgeActive", r.simplifiedBridgeActive),
      line("hexExpressionSocketActive", r.hexExpressionSocketActive),
      line("hexTransmissionReceiverActive", r.hexTransmissionReceiverActive),
      line("renderableSurfaceExpressionProviderActive", r.renderableSurfaceExpressionProviderActive),
      line("sampleHexSurfaceExpressionAvailable", r.sampleHexSurfaceExpressionAvailable),
      line("receiveHexSurfaceTransmissionPacketAvailable", r.receiveHexSurfaceTransmissionPacketAvailable),
      "",
      "BOUNDARIES",
      line("inspectOwnsFingerStretchManagement", r.inspectOwnsFingerStretchManagement),
      line("surfaceOwnsFingerStretchManagement", r.surfaceOwnsFingerStretchManagement),
      line("surfaceOwnsBoundaryFinger", r.surfaceOwnsBoundaryFinger),
      line("surfaceOwnsMassFinger", r.surfaceOwnsMassFinger),
      line("surfaceOwnsLightFinger", r.surfaceOwnsLightFinger),
      line("surfaceOwnsInspectFinger", r.surfaceOwnsInspectFinger),
      line("surfaceOwnsCompositeFinger", r.surfaceOwnsCompositeFinger),
      line("canvasDrawingDelegatedToHexSurface", r.canvasDrawingDelegatedToHexSurface),
      line("directCanvasDrawingSuppressed", r.directCanvasDrawingSuppressed),
      "",
      "COUNTS",
      line("receivedTransmissionCount", r.receivedTransmissionCount),
      line("acceptedTransmissionCount", r.acceptedTransmissionCount),
      line("rejectedTransmissionCount", r.rejectedTransmissionCount),
      line("expressionRequestCount", r.expressionRequestCount),
      line("expressionServedCount", r.expressionServedCount),
      line("expressionRejectedCount", r.expressionRejectedCount),
      line("hexAuthorityTupleRequestCount", r.hexAuthorityTupleRequestCount),
      line("hexAuthorityTupleResolvedCount", r.hexAuthorityTupleResolvedCount),
      line("localCoordFallbackCount", r.localCoordFallbackCount),
      line("inputCellVarianceCount", r.inputCellVarianceCount),
      "",
      "NEXT",
      line("latestTransmissionStatus", r.latestTransmissionStatus),
      line("latestTransmissionReason", r.latestTransmissionReason),
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("noClaimsPreserved", true),
      line("f13Claimed", false),
      line("f21Claimed", false),
      line("readyTextClaimed", false),
      line("completionLatched", false),
      line("terrainTruthClaimed", false),
      line("hydrologyTruthClaimed", false),
      line("materialTruthClaimed", false),
      line("elevationTruthClaimed", false),
      line("compositeTruthClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false)
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasFingerSurfaceLoaded", "true");
    setDataset("hearthCanvasFingerSurfaceContract", CONTRACT);
    setDataset("hearthCanvasFingerSurfaceReceipt", RECEIPT);
    setDataset("hearthCanvasFingerSurfaceInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasFingerSurfaceInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasFingerSurfacePreviousInternalImplementationContract", PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasFingerSurfaceVersion", VERSION);
    setDataset("hearthCanvasFingerSurfaceFile", FILE);

    setDataset("hearthCanvasFingerSurfaceActive", String(state.surfaceFingerActive));
    setDataset("hearthCanvasPointerFingerSurfaceActive", String(state.pointerFingerSurfaceActive));
    setDataset("hearthCanvasPointerBishopActive", String(state.pointerBishopActive));
    setDataset("hearthCanvasFingerSurfaceBishopName", BISHOP_NAME);
    setDataset("hearthCanvasFingerSurfaceBishopRole", BISHOP_ROLE);
    setDataset("hearthCanvasFingerSurfaceBishopRank", BISHOP_RANK);
    setDataset("hearthCanvasFingerSurfaceBishopAddress", BISHOP_ADDRESS);
    setDataset("hearthCanvasFingerSurfaceBishopDirection", BISHOP_DIRECTION);
    setDataset("hearthCanvasFingerSurfaceBishopCardinalDisposition", BISHOP_CARDINAL_DISPOSITION);

    setDataset("hearthCanvasFingerSurfaceSimplifiedBridgeActive", String(state.simplifiedBridgeActive));
    setDataset("hearthCanvasFingerSurfaceHexExpressionSocketActive", String(state.hexExpressionSocketActive));
    setDataset("hearthCanvasFingerSurfaceHexTransmissionReceiverActive", String(state.hexTransmissionReceiverActive));
    setDataset("hearthCanvasFingerSurfaceRenderableSurfaceExpressionProviderActive", String(state.renderableSurfaceExpressionProviderActive));

    setDataset("hearthCanvasFingerSurfaceHexAuthorityTupleBindingActive", "true");
    setDataset("hearthCanvasFingerSurfaceHexAuthorityObserved", String(state.hexAuthorityObserved));
    setDataset("hearthCanvasFingerSurfaceHexAuthoritySource", state.hexAuthoritySource);
    setDataset("hearthCanvasFingerSurfaceHexAuthorityContract", state.hexAuthorityContract);
    setDataset("hearthCanvasFingerSurfaceHexAuthorityRecognized", String(state.hexAuthorityRecognized));
    setDataset("hearthCanvasFingerSurfaceHexAuthoritySampleMethodUsed", state.hexAuthoritySampleMethodUsed);
    setDataset("hearthCanvasFingerSurfaceCanonicalTupleResolved", String(state.canonicalTupleResolved));
    setDataset("hearthCanvasFingerSurfaceCanonicalTupleSource", state.canonicalTupleSource);
    setDataset("hearthCanvasFingerSurfaceCanonicalTupleCellId", state.canonicalTupleCellId);
    setDataset("hearthCanvasFingerSurfaceCanonicalTupleStateId", String(state.canonicalTupleStateId));
    setDataset("hearthCanvasFingerSurfaceCanonicalTupleRow", String(state.canonicalTupleRow));
    setDataset("hearthCanvasFingerSurfaceCanonicalTupleColumn", String(state.canonicalTupleColumn));
    setDataset("hearthCanvasFingerSurfaceLocalCoordFallbackUsed", String(state.localCoordFallbackUsed));
    setDataset("hearthCanvasFingerSurfaceLocalCoordFallbackReason", state.localCoordFallbackReason);
    setDataset("hearthCanvasFingerSurfaceExpressionCoordSource", state.surfaceExpressionCoordSource);
    setDataset("hearthCanvasFingerSurfaceMapAlignmentStatus", state.mapAlignmentStatus);
    setDataset("hearthCanvasFingerSurfaceMapAlignmentDetail", state.mapAlignmentDetail);
    setDataset("hearthCanvasFingerSurfaceInputCellClaimStatus", state.inputCellClaimStatus);

    setDataset("hearthCanvasFingerSurfaceSampleHexSurfaceExpressionReady", String(state.sampleHexSurfaceExpressionReady));
    setDataset("hearthCanvasFingerSurfaceSampleSurfaceExpressionReady", String(state.sampleSurfaceExpressionReady));
    setDataset("hearthCanvasFingerSurfaceRenderableSurfaceExpressionReady", String(state.renderableSurfaceExpressionReady));

    setDataset("hearthCanvasFingerSurfaceReceivedTransmissionCount", String(state.receivedTransmissionCount));
    setDataset("hearthCanvasFingerSurfaceAcceptedTransmissionCount", String(state.acceptedTransmissionCount));
    setDataset("hearthCanvasFingerSurfaceRejectedTransmissionCount", String(state.rejectedTransmissionCount));
    setDataset("hearthCanvasFingerSurfaceExpressionRequestCount", String(state.expressionRequestCount));
    setDataset("hearthCanvasFingerSurfaceExpressionServedCount", String(state.expressionServedCount));
    setDataset("hearthCanvasFingerSurfaceExpressionRejectedCount", String(state.expressionRejectedCount));
    setDataset("hearthCanvasFingerSurfaceHexAuthorityTupleRequestCount", String(state.hexAuthorityTupleRequestCount));
    setDataset("hearthCanvasFingerSurfaceHexAuthorityTupleResolvedCount", String(state.hexAuthorityTupleResolvedCount));
    setDataset("hearthCanvasFingerSurfaceLocalCoordFallbackCount", String(state.localCoordFallbackCount));
    setDataset("hearthCanvasFingerSurfaceInputCellVarianceCount", String(state.inputCellVarianceCount));

    setDataset("hearthCanvasFingerSurfaceLatestTransmissionStatus", state.latestTransmissionStatus);
    setDataset("hearthCanvasFingerSurfaceLatestTransmissionReason", state.latestTransmissionReason);
    setDataset("hearthCanvasFingerSurfaceLatestExpressionCellId", state.latestExpressionCellId);
    setDataset("hearthCanvasFingerSurfaceLatestExpressionMaterialClass", state.latestExpressionMaterialClass);
    setDataset("hearthCanvasFingerSurfaceLatestExpressionLandPresence", String(state.latestExpressionLandPresence));
    setDataset("hearthCanvasFingerSurfaceLatestExpressionWaterPresence", String(state.latestExpressionWaterPresence));

    setDataset("hearthCanvasFingerSurfaceInspectOwnsFingerStretchManagement", "true");
    setDataset("hearthCanvasFingerSurfaceOwnsFingerStretchManagement", "false");
    setDataset("hearthCanvasFingerSurfaceOwnsBoundaryFinger", "false");
    setDataset("hearthCanvasFingerSurfaceOwnsMassFinger", "false");
    setDataset("hearthCanvasFingerSurfaceOwnsLightFinger", "false");
    setDataset("hearthCanvasFingerSurfaceOwnsInspectFinger", "false");
    setDataset("hearthCanvasFingerSurfaceOwnsCompositeFinger", "false");
    setDataset("hearthCanvasFingerSurfaceCanvasDrawingDelegatedToHexSurface", "true");
    setDataset("hearthCanvasFingerSurfaceDirectCanvasDrawingSuppressed", "true");

    setDataset("hearthCanvasFingerSurfaceFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasFingerSurfaceRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasFingerSurfaceRecommendedNextRenewalTarget", state.recommendedNextRenewalTarget);
    setDataset("hearthCanvasFingerSurfacePostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasFingerSurfaceNoClaimsPreserved", "true");
    setDataset("hearthCanvasFingerSurfaceF13Claimed", "false");
    setDataset("hearthCanvasFingerSurfaceF21Claimed", "false");
    setDataset("hearthCanvasFingerSurfaceReadyTextClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceCompletionLatched", "false");
    setDataset("hearthCanvasFingerSurfaceTerrainTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceHydrologyTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceMaterialTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceElevationTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceCompositeTruthClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceVisualPassClaimed", "false");
    setDataset("hearthCanvasFingerSurfaceGeneratedImage", "false");
    setDataset("hearthCanvasFingerSurfaceGraphicBox", "false");
    setDataset("hearthCanvasFingerSurfaceWebGL", "false");

    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    return true;
  }

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of SURFACE_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();
    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight();

    root.HEARTH_CANVAS_FINGER_SURFACE_RECEIPT = receipt;
    root.HEARTH_CANVAS_POINTER_FINGER_SURFACE_RECEIPT = receipt;
    root.HEARTH_POINTER_FINGER_SURFACE_RECEIPT = receipt;
    root.HEARTH_CANVAS_POINTER_BISHOP_RECEIPT = receipt;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT = receipt;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_HEX_EXPRESSION_SOCKET_RECEIPT_v5 = receipt;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_SIMPLIFIED_HEX_SOCKET_BRIDGE_RECEIPT = receipt;
    root.HEARTH_CANVAS_FINGER_SURFACE_POINTER_BISHOP_SIMPLIFIED_HEX_SOCKET_BRIDGE_RECEIPT_v5_1 = receipt;
    root.HEARTH_CANVAS_FINGER_SURFACE_HEX_AUTHORITY_TUPLE_BINDING_RECEIPT = receipt;
    root.HEARTH_CANVAS_FINGER_SURFACE_HEX_AUTHORITY_TUPLE_BINDING_RECEIPT_v5_2 = receipt;

    root.HEARTH_CANVAS_FINGER_SURFACE_PACKET = getSurfacePacket();
    root.HEARTH_CANVAS_POINTER_FINGER_SURFACE_PACKET = getPointerFingerPacket();
    root.HEARTH_CANVAS_POINTER_BISHOP_PACKET = getPointerBishopPacket();

    hearth.canvasFingerSurfaceReceipt = receipt;
    hearth.canvasPointerFingerSurfaceReceipt = receipt;
    hearth.pointerFingerSurfaceReceipt = receipt;
    hearth.canvasPointerBishopReceipt = receipt;
    hearth.canvasFingerSurfacePointerBishopHexExpressionSocketReceipt = receipt;
    hearth.canvasFingerSurfaceSimplifiedHexSocketBridgeReceipt = receipt;
    hearth.canvasFingerSurfaceHexAuthorityTupleBindingReceipt = receipt;

    hearth.canvasFingerSurfacePacket = getSurfacePacket();
    hearth.canvasPointerFingerSurfacePacket = getPointerFingerPacket();
    hearth.canvasPointerBishopPacket = getPointerBishopPacket();

    lab.hearthCanvasFingerSurfaceReceipt = receipt;
    lab.hearthCanvasPointerFingerSurfaceReceipt = receipt;
    lab.hearthPointerFingerSurfaceReceipt = receipt;
    lab.hearthCanvasPointerBishopReceipt = receipt;
    lab.hearthCanvasFingerSurfacePointerBishopHexExpressionSocketReceipt = receipt;
    lab.hearthCanvasFingerSurfaceSimplifiedHexSocketBridgeReceipt = receipt;
    lab.hearthCanvasFingerSurfaceHexAuthorityTupleBindingReceipt = receipt;

    lab.hearthCanvasFingerSurfacePacket = getSurfacePacket();
    lab.hearthCanvasPointerFingerSurfacePacket = getPointerFingerPacket();
    lab.hearthCanvasPointerBishopPacket = getPointerBishopPacket();

    state.receiptPublishCount += 1;
    return true;
  }

  function publishGlobals() {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();

    return api;
  }

  function boot() {
    state.timestamp = state.timestamp || nowIso();

    readHexAuthority();
    buildSurfacePacket();
    buildPointerFingerPacket();
    buildPointerBishopPacket();

    state.booted = true;
    state.mounted = true;
    state.surfaceModelReady = true;
    state.surfacePacketReady = true;
    state.pointerFingerPacketReady = true;
    state.pointerBishopPacketReady = true;
    state.firstFailedCoordinate = "WAITING_HEX_SURFACE_TRANSMISSION_OR_SAMPLE_REQUEST";
    state.recommendedNextFile = HEX_SURFACE_FILE;
    state.recommendedNextRenewalTarget = HEX_SURFACE_FILE;
    state.postgameStatus = "SURFACE_POINTER_BISHOP_HEX_AUTHORITY_TUPLE_BINDING_BOOTED_READY";

    updateDataset();
    publishGlobals();

    record("SURFACE_POINTER_BISHOP_HEX_AUTHORITY_TUPLE_BINDING_BOOT_COMPLETE", {
      contract: CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
      aliasCount: SURFACE_ALIAS_PATHS.length,
      receiveHexSurfaceTransmissionPacketAvailable: true,
      sampleHexSurfaceExpressionAvailable: true,
      resolveCanonicalTupleAvailable: true,
      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      inspectOwnsFingerStretchManagement: true,
      surfaceOwnsFingerStretchManagement: false,
      visualPassClaimed: false
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
    PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    LINEAGE_V4_CONTRACT,
    LINEAGE_V3_CONTRACT,
    LINEAGE_V2_CONTRACT,
    BASELINE_CONTRACT,
    VERSION,

    FILE,
    ROUTE,
    DIAGNOSTIC_ROUTE,
    PARENT_HUB_FILE,
    HEX_SURFACE_FILE,
    HEX_AUTHORITY_FILE,
    BOUNDARY_FILE,
    MASS_FILE,
    LIGHT_FILE,
    INSPECT_FILE,
    COMPOSITE_FILE,

    contract: CONTRACT,
    receipt: RECEIPT,
    packet: PACKET,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousInternalImplementationContract: PREVIOUS_INTERNAL_IMPLEMENTATION_CONTRACT,
    previousInternalImplementationReceipt: PREVIOUS_INTERNAL_IMPLEMENTATION_RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    lineageV4Contract: LINEAGE_V4_CONTRACT,
    lineageV3Contract: LINEAGE_V3_CONTRACT,
    lineageV2Contract: LINEAGE_V2_CONTRACT,
    baselineContract: BASELINE_CONTRACT,
    version: VERSION,

    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,
    parentHubFile: PARENT_HUB_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    boundaryFile: BOUNDARY_FILE,
    massFile: MASS_FILE,
    lightFile: LIGHT_FILE,
    inspectFile: INSPECT_FILE,
    compositeFile: COMPOSITE_FILE,

    fingerName: FINGER_NAME,
    fingerRole: FINGER_ROLE,
    fingerOrder: FINGER_ORDER,
    fingerStretchTotal: FINGER_STRETCH_TOTAL,

    bishopName: BISHOP_NAME,
    bishopTitle: BISHOP_TITLE,
    bishopRole: BISHOP_ROLE,
    bishopRank: BISHOP_RANK,
    bishopAddress: BISHOP_ADDRESS,
    bishopDirection: BISHOP_DIRECTION,
    bishopCardinalDisposition: BISHOP_CARDINAL_DISPOSITION,

    boot,
    init,
    start,
    mount,

    readHexAuthority,
    resolveCanonicalTuple,

    receiveHexSurfaceTransmissionPacket,
    consumeHexSurfaceTransmissionPacket,
    receivePointerFingerTransmissionPacket,
    consumePointerFingerTransmissionPacket,
    receiveCanvasFingerPacket,
    consumeCanvasFingerPacket,
    receiveCanvasBishopPacket,
    receiveSurfacePacket,
    receiveSurfaceExpressionPacket,
    acceptTransmissionPacket,
    receive,

    sample,
    sampleSurfaceExpression,
    sampleHexSurfaceExpression,
    getRenderableSurfaceExpression,
    getSurfaceExpressionAt,
    receiveHexSurfaceExpressionRequest,

    drawToCanvas,

    buildSurfaceModel,
    buildSurfacePacket,
    buildPointerFingerPacket,
    buildPointerBishopPacket,
    getSurfacePacket,
    getPointerFingerPacket,
    getPointerBishopPacket,
    getBishopPacket,

    getState,
    read,
    getReceipt,
    getReceiptLight,
    getReceiptText,

    updateDataset,
    publishGlobals,
    publishAliasPaths,
    publishReceiptAliases,

    supportsCanvasFingerSurface: true,
    supportsPointerFingerSurface: true,
    supportsPointerFingerSocket: true,
    supportsSurfacePointerBishop: true,
    supportsNonCardinalBishopLanguage: true,
    supportsLegacyFingerCompatibility: true,
    supportsSimplifiedHexSocketBridge: true,
    supportsHexAuthorityTupleBinding: true,
    supportsHexSurfaceTransmissionPacket: true,
    supportsPointerFingerTransmissionPacket: true,
    supportsSampleHexSurfaceExpression: true,
    supportsRenderableSurfaceExpression: true,
    supportsReceiptText: true,
    supportsNoFinalClaims: true,

    ownsSurfaceFingerIdentity: true,
    ownsPointerFingerSurfaceIdentity: true,
    ownsSurfacePointerBishopIdentity: true,
    ownsHexExpressionSocket: true,
    ownsRenderableSurfaceExpressionProvider: true,
    ownsSurfaceExpressionPacket: true,
    ownsPointerBishopPacket: true,
    ownsHexAuthorityTupleBindingConsumer: true,

    ownsFingerStretchManagement: false,
    ownsBoundaryFinger: false,
    ownsMassFinger: false,
    ownsLightFinger: false,
    ownsInspectFinger: false,
    ownsCompositeFinger: false,
    ownsCanvasHub: false,
    ownsHexSurfaceProjection: false,
    ownsHexAuthorityTruth: false,
    ownsCanvasDrawing: false,
    ownsCanvasMounting: false,
    ownsCanvasLifecycle: false,
    ownsRouteConductor: false,
    ownsDiagnosticRail: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsCompositeTruth: false,
    ownsFinalVisualPassClaim: false,

    inspectOwnsFingerStretchManagement: true,
    surfaceOwnsFingerStretchManagement: false,
    simplifiedBridgeActive: true,
    hexExpressionSocketActive: true,
    hexTransmissionReceiverActive: true,
    renderableSurfaceExpressionProviderActive: true,
    hexAuthorityTupleBindingActive: true,
    canvasDrawingDelegatedToHexSurface: true,
    directCanvasDrawingSuppressed: true,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    state.timestamp = nowIso();

    readHexAuthority();
    buildSurfacePacket();
    buildPointerFingerPacket();
    buildPointerBishopPacket();
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
    recordError("SURFACE_POINTER_BISHOP_HEX_AUTHORITY_TUPLE_BINDING_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishGlobals();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
