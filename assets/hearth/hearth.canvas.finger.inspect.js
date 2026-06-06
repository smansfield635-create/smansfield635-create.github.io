// /assets/hearth/hearth.canvas.finger.inspect.js
// HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1
// Internal controlled renewal:
// HEARTH_CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_TNT_v2
// Full-file replacement.
// Canvas Finger Inspect / Hex Surface pointer-receiver proof layer only.
// Purpose:
// - Preserve the public v1 inspect contract expected by South / Probe South / diagnostic adapters.
// - Add the public receiver surface Hex Surface expects for the inspect lane.
// - Receive Hex Surface pointer-finger transmission packets without becoming the pointer finger itself.
// - Distinguish:
//   1. Canvas surface exists but pixel sample is blank.
//   2. Hex Surface gate did not deliver to any pointer/finger receiver.
//   3. Hex Surface delivered to this inspect receiver but downstream draw pixels remain blank.
//   4. Pointer receiver aliases/methods are missing.
// - Preserve Hex Surface as the gate to pointer/finger transmission.
// - Preserve Canvas as receiver/output carrier.
// - Preserve this file as auxiliary read-only inspection/receipt surface, not a nine-step chronology owner.
// - Preserve no production mutation, no canvas drawing, no canvas repair, no route repair,
//   no runtime restart, no F13 claim, no F21 claim, no ready text, no final visual pass,
//   no generated image, no GraphicBox, and no WebGL.
// Does not own:
// - diagnostic North chronology
// - diagnostic South packet output
// - production route repair
// - Canvas drawing
// - Canvas release
// - Hex Surface truth
// - Pointer Finger truth
// - terrain/material/hydrology/elevation truth
// - final visual pass
// - F21 latch

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};

  const CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_TNT_v1";
  const RECEIPT =
    "HEARTH_CANVAS_FINGER_INSPECT_DOWNSTREAM_EXPRESSION_PROOF_RECEIPT_v1";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_TNT_v2";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_RECEIPT_v2";

  const VERSION =
    "2026-06-06.hearth-canvas-finger-inspect-hex-surface-pointer-receiver-proof-v2";

  const FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const FOUR_PAIR_AUTHORITY_FILE =
    "/assets/hearth/hearth.hex.four-pair.authority.js";
  const SURFACE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const BOUNDARY_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const LIGHT_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByInspect: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByDiagnosticRail: false,
    f21ClaimedByInspect: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByDiagnosticRail: false,
    completionLatched: false,
    finalCompletionLatched: false,
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
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    F21_SUBMITTED_TO_NORTH: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const SAFE_GETTERS = Object.freeze([
    "getReceipt",
    "getReceiptLight",
    "getState",
    "getReport",
    "getSummary",
    "getPacketText",
    "getReceiptText",
    "getStatusText",
    "getHexSurfaceReceipt",
    "getCanvasStationReceipt",
    "getVisiblePlanetReceipt"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHexGatePointerFingerTransmissionReceiver",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasAuthority",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_HEX_GATE_POINTER_FINGER_TRANSMISSION_RECEIVER"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION"
  ]);

  const FOUR_PAIR_ALIASES = Object.freeze([
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.pixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_PIXEL_HANDSHAKE_AUTHORITY"
  ]);

  const POINTER_RECEIVER_ALIAS_PATHS = Object.freeze([
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerInspector",
    "HEARTH.canvasFingerExpressionInspect",
    "HEARTH.diagnosticCanvasFingerInspect",
    "HEARTH.hearthCanvasFingerInspect",

    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerReceiver",
    "HEARTH.hexGatePointerFingerInspectReceiver",
    "HEARTH.hexSurfacePointerFingerReceiver",

    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerInspector",
    "DEXTER_LAB.hearthDiagnosticCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerReceiver",
    "DEXTER_LAB.hearthHexSurfacePointerFingerReceiver",

    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_INSPECTOR",
    "HEARTH_DIAGNOSTIC_CANVAS_FINGER_INSPECT",

    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_SURFACE_POINTER_FINGER_RECEIVER",
    "HEARTH_HEX_GATE_POINTER_FINGER_INSPECT_RECEIVER"
  ]);

  const FINGER_ALIAS_GROUPS = Object.freeze({
    boundary: Object.freeze([
      "HEARTH.canvasFingerBoundary",
      "HEARTH.canvasBoundaryFinger",
      "HEARTH.boundaryFinger",
      "HEARTH.pointerFingerBoundary",
      "DEXTER_LAB.hearthCanvasFingerBoundary",
      "DEXTER_LAB.hearthPointerFingerBoundary",
      "HEARTH_CANVAS_FINGER_BOUNDARY",
      "HEARTH_CANVAS_POINTER_FINGER_BOUNDARY",
      "HEARTH_POINTER_FINGER_BOUNDARY"
    ]),
    surface: Object.freeze([
      "HEARTH.canvasFingerSurface",
      "HEARTH.canvasSurfaceFinger",
      "HEARTH.surfaceFinger",
      "HEARTH.pointerFingerSurface",
      "DEXTER_LAB.hearthCanvasFingerSurface",
      "DEXTER_LAB.hearthPointerFingerSurface",
      "HEARTH_CANVAS_FINGER_SURFACE",
      "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
      "HEARTH_POINTER_FINGER_SURFACE"
    ]),
    inspect: POINTER_RECEIVER_ALIAS_PATHS,
    light: Object.freeze([
      "HEARTH.canvasFingerLight",
      "HEARTH.canvasLightFinger",
      "HEARTH.lightFinger",
      "HEARTH.pointerFingerLight",
      "DEXTER_LAB.hearthCanvasFingerLight",
      "DEXTER_LAB.hearthPointerFingerLight",
      "HEARTH_CANVAS_FINGER_LIGHT",
      "HEARTH_CANVAS_POINTER_FINGER_LIGHT",
      "HEARTH_POINTER_FINGER_LIGHT"
    ])
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    auxiliaryLayerOnly: true,
    chronologyOwner: false,
    nineCycleMutation: false,
    readableBySouthProbe: true,

    pointerFingerItself: false,
    pointerReceiverSurface: true,
    pointerReceiverFile: FILE,
    pointerFingerTruthOwned: false,
    hexSurfaceGateExpected: true,
    hexSurfaceGateRespected: true,

    receiverMethodCount: 0,
    receivedHexSurfaceTransmissionCount: 0,
    receivedPointerFingerTransmissionCount: 0,
    receivedCanvasFingerPacketCount: 0,
    receivedFramePacketCount: 0,
    lastReceiveMethod: "NONE",
    lastReceivedAt: "",
    lastReceivedPacketType: "NONE",
    lastReceivedPacket: null,
    lastReceivedPacketSummary: null,

    lastReport: null,
    lastPacketText: "",
    lastCompactSummary: "",
    lastState: null,

    updatedAt: "",
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

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function bounded(value, limit = 2400) {
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
      const joined = value
        .map((entry) => packetValue(entry, ""))
        .filter(Boolean)
        .join(" | ");
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
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_FINGER_INSPECT_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 120);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_FINGER_INSPECT_ERROR"),
      message: bounded(error && error.message ? error.message : error, 1200),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 80);
    state.updatedAt = item.at;
    return item;
  }

  function safeKeys(value) {
    try {
      if (isObject(value) || isFunction(value)) return Object.keys(value);
    } catch (_error) {}
    return [];
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
        "canvasContract",
        "currentCanvasParentContract",
        "hexSurfaceContract",
        "hexAuthorityContract",
        "sourceContract",
        "implementationContract",
        "internalImplementationContract",
        "internalRenewalContract"
      ]),
      "UNKNOWN"
    );
  }

  function receiptOf(value) {
    return firstKnown(
      readField(value, [
        "receipt",
        "RECEIPT",
        "canvasReceipt",
        "currentCanvasParentReceipt",
        "hexSurfaceReceipt",
        "hexAuthorityReceipt",
        "sourceReceipt",
        "implementationReceipt",
        "internalImplementationReceipt",
        "internalRenewalReceipt"
      ]),
      "UNKNOWN"
    );
  }

  function readAuthorityReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return null;

    for (const getter of SAFE_GETTERS) {
      if (!isFunction(authority[getter])) continue;

      try {
        const output = getter === "getReceiptLight" ? authority[getter](false) : authority[getter]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function summarizeAuthority(path, value) {
    const receipt = readAuthorityReceipt(value) || {};
    const keys = safeKeys(value);
    const methods = keys.filter((key) => isFunction(value[key]));

    return {
      observed: Boolean(value),
      path: path || "NONE",
      contract: contractOf(receipt) || contractOf(value),
      receipt: receiptOf(receipt) || receiptOf(value),
      keyCount: keys.length,
      methodCount: methods.length,
      methods: methods.slice(0, 40),
      getterAvailableCount: SAFE_GETTERS.filter((getter) => isFunction(value && value[getter])).length
    };
  }

  function inspectAliasGroup(paths) {
    const found = firstGlobal(paths);
    if (!found.value) {
      return {
        observed: false,
        path: "NONE",
        contract: "UNKNOWN",
        receipt: "UNKNOWN",
        keyCount: 0,
        methodCount: 0,
        methods: [],
        getterAvailableCount: 0
      };
    }

    return summarizeAuthority(found.path, found.value);
  }

  function queryFirst(selectors) {
    if (!doc || !doc.querySelector) return null;

    for (const selector of selectors) {
      try {
        const node = doc.querySelector(selector);
        if (node) return { selector, node };
      } catch (_error) {}
    }

    return null;
  }

  function inspectCanvasDom() {
    const found = queryFirst([
      "canvas[data-hearth-visible-canvas='true']",
      "#hearthCanvasMount canvas",
      "canvas[data-hearth-canvas-hub='true']",
      "canvas[data-hearth-canvas='true']",
      "canvas[data-hearth-canvas-texture='true']",
      "canvas"
    ]);

    if (!found) {
      return {
        canvasElementFound: false,
        canvasSelector: "NONE",
        canvasRectNonzero: false,
        canvasComputedVisible: false,
        canvasViewportIntersecting: false,
        canvasContext2dReady: false,
        canvasPixelSampleStatus: "CANVAS_NOT_FOUND",
        canvasPixelVisible: false,
        canvasSampleCount: 0,
        canvasVisiblePixelCount: 0,
        canvasAlphaPixelCount: 0,
        canvasUniqueColorCount: 0,
        canvasPixelSampleReason: "NO_CANVAS_ELEMENT"
      };
    }

    const canvas = found.node;
    let rect = null;
    let style = null;

    try {
      rect = canvas.getBoundingClientRect();
    } catch (_error) {
      rect = null;
    }

    try {
      style = root.getComputedStyle ? root.getComputedStyle(canvas) : null;
    } catch (_error) {
      style = null;
    }

    const rectWidth = safeNumber(rect && rect.width, 0);
    const rectHeight = safeNumber(rect && rect.height, 0);
    const rectNonzero = rectWidth > 0 && rectHeight > 0;

    const computedVisible =
      rectNonzero &&
      (!style ||
        (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.visibility !== "collapse" &&
          safeNumber(style.opacity, 1) > 0
        ));

    const viewportWidth = safeNumber(root.innerWidth, 0);
    const viewportHeight = safeNumber(root.innerHeight, 0);

    const intersecting =
      rectNonzero &&
      viewportWidth > 0 &&
      viewportHeight > 0 &&
      rect.left < viewportWidth &&
      rect.right > 0 &&
      rect.top < viewportHeight &&
      rect.bottom > 0;

    const contextProbe = getCanvas2dContext(canvas);
    const pixelSample = inspectCanvasPixels(canvas, contextProbe.context);

    return {
      canvasElementFound: true,
      canvasSelector: found.selector,
      canvasTag: safeString(canvas.tagName, "CANVAS"),
      canvasId: canvas.id || "NONE",
      canvasClass: safeString(canvas.className || "NONE"),
      canvasDatasetContract: canvas.dataset ? firstKnown(canvas.dataset.hearthCanvasContract, canvas.dataset.contract, "UNKNOWN") : "UNKNOWN",
      canvasDatasetReceipt: canvas.dataset ? firstKnown(canvas.dataset.hearthCanvasReceipt, canvas.dataset.receipt, "UNKNOWN") : "UNKNOWN",
      canvasWidthAttribute: safeNumber(canvas.width, 0),
      canvasHeightAttribute: safeNumber(canvas.height, 0),
      canvasRectLeft: safeNumber(rect && rect.left, 0),
      canvasRectTop: safeNumber(rect && rect.top, 0),
      canvasRectWidth: rectWidth,
      canvasRectHeight: rectHeight,
      canvasRectNonzero: rectNonzero,
      canvasComputedVisible: computedVisible,
      canvasComputedDisplay: style ? safeString(style.display, "UNKNOWN") : "UNKNOWN",
      canvasComputedVisibility: style ? safeString(style.visibility, "UNKNOWN") : "UNKNOWN",
      canvasComputedOpacity: style ? safeString(style.opacity, "UNKNOWN") : "UNKNOWN",
      canvasComputedPointerEvents: style ? safeString(style.pointerEvents, "UNKNOWN") : "UNKNOWN",
      canvasViewportIntersecting: intersecting,
      canvasContext2dReady: contextProbe.ready,
      canvasContext2dStatus: contextProbe.status,
      canvasPixelSampleStatus: pixelSample.status,
      canvasPixelVisible: pixelSample.visible,
      canvasSampleCount: pixelSample.sampleCount,
      canvasVisiblePixelCount: pixelSample.visiblePixelCount,
      canvasAlphaPixelCount: pixelSample.alphaPixelCount,
      canvasUniqueColorCount: pixelSample.uniqueColorCount,
      canvasPixelSampleReason: pixelSample.reason
    };
  }

  function getCanvas2dContext(canvas) {
    if (!canvas || !canvas.getContext) {
      return {
        ready: false,
        status: "CANVAS_CONTEXT_2D_NOT_AVAILABLE",
        context: null
      };
    }

    try {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context) {
        return {
          ready: true,
          status: "CANVAS_CONTEXT_2D_READY",
          context
        };
      }
    } catch (_error) {
      try {
        const context = canvas.getContext("2d");
        if (context) {
          return {
            ready: true,
            status: "CANVAS_CONTEXT_2D_READY_FALLBACK",
            context
          };
        }
      } catch (error) {
        return {
          ready: false,
          status: `CANVAS_CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 600)}`,
          context: null
        };
      }
    }

    return {
      ready: false,
      status: "CANVAS_CONTEXT_2D_NULL",
      context: null
    };
  }

  function inspectCanvasPixels(canvas, context) {
    if (!canvas || !context) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        reason: "NO_CANVAS_CONTEXT"
      };
    }

    const width = safeNumber(canvas.width, 0);
    const height = safeNumber(canvas.height, 0);

    if (width <= 0 || height <= 0) {
      return {
        status: "PIXEL_SAMPLE_UNREADABLE",
        visible: false,
        sampleCount: 0,
        visiblePixelCount: 0,
        alphaPixelCount: 0,
        uniqueColorCount: 0,
        reason: "CANVAS_DIMENSIONS_ZERO"
      };
    }

    const points = buildSamplePoints(width, height);
    let sampleCount = 0;
    let alphaPixelCount = 0;
    let visiblePixelCount = 0;
    const unique = new Set();

    try {
      for (const point of points) {
        const x = Math.max(0, Math.min(width - 1, Math.round(point.x)));
        const y = Math.max(0, Math.min(height - 1, Math.round(point.y)));
        const data = context.getImageData(x, y, 1, 1).data;

        sampleCount += 1;

        const r = data[0] || 0;
        const g = data[1] || 0;
        const b = data[2] || 0;
        const a = data[3] || 0;

        if (a > 0) alphaPixelCount += 1;
        if (a > 0 && (r > 4 || g > 4 || b > 4)) visiblePixelCount += 1;

        unique.add(`${r},${g},${b},${a}`);
      }
    } catch (error) {
      return {
        status: "PIXEL_SAMPLE_ERROR",
        visible: false,
        sampleCount,
        visiblePixelCount,
        alphaPixelCount,
        uniqueColorCount: unique.size,
        reason: bounded(error && error.message ? error.message : error, 1000)
      };
    }

    const visible = visiblePixelCount > 0;

    return {
      status: visible
        ? "PIXEL_SAMPLE_VISIBLE"
        : alphaPixelCount > 0
          ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
          : "PIXEL_SAMPLE_BLANK",
      visible,
      sampleCount,
      visiblePixelCount,
      alphaPixelCount,
      uniqueColorCount: unique.size,
      reason: visible
        ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
        : alphaPixelCount > 0
          ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
          : "NO_VISIBLE_NON_BLANK_PIXELS_IN_SAMPLE_GRID"
    };
  }

  function buildSamplePoints(width, height) {
    const xs = [0.18, 0.32, 0.5, 0.68, 0.82];
    const ys = [0.18, 0.32, 0.5, 0.68, 0.82];
    const points = [];

    for (const y of ys) {
      for (const x of xs) {
        points.push({
          x: width * x,
          y: height * y
        });
      }
    }

    return points;
  }

  function summarizePacket(packet) {
    const p = isObject(packet) ? packet : {};

    return {
      packetType: firstKnown(p.packetType, p.type, "UNKNOWN"),
      sourceFile: firstKnown(p.sourceFile, p.fromFile, "UNKNOWN"),
      sourceAuthority: firstKnown(p.sourceAuthority, p.sourceRole, p.role, "UNKNOWN"),
      destinationFile: firstKnown(p.destinationFile, p.targetFile, p.handoffTo, "UNKNOWN"),
      contract: firstKnown(p.contract, p.CONTRACT, p.sourceContract, "UNKNOWN"),
      receipt: firstKnown(p.receipt, p.RECEIPT, p.sourceReceipt, "UNKNOWN"),
      composedAt: firstKnown(p.composedAt, p.updatedAt, p.timestamp, "UNKNOWN"),
      hasViewState: Boolean(isObject(p.viewState)),
      hasProjectionState: Boolean(isObject(p.projectionState)),
      hasHexFramePacket: Boolean(isObject(p.hexFramePacket)),
      keyCount: safeKeys(p).length,
      sampleKeys: safeKeys(p).slice(0, 32)
    };
  }

  function receivePacket(packet, method) {
    if (!isObject(packet)) {
      recordError("HEARTH_CANVAS_FINGER_INSPECT_REJECTED_NON_OBJECT_PACKET", "PACKET_NOT_OBJECT", {
        method
      });
      return getReceiptLight(false);
    }

    const summary = summarizePacket(packet);
    state.lastReceiveMethod = method;
    state.lastReceivedAt = nowIso();
    state.lastReceivedPacketType = summary.packetType;
    state.lastReceivedPacket = clonePlain(packet);
    state.lastReceivedPacketSummary = clonePlain(summary);

    if (/HEX|SURFACE|TRANSMISSION/i.test(method) || /HEX|SURFACE|TRANSMISSION/i.test(summary.packetType)) {
      state.receivedHexSurfaceTransmissionCount += 1;
    }

    if (/POINTER/i.test(method) || /POINTER/i.test(summary.packetType)) {
      state.receivedPointerFingerTransmissionCount += 1;
    }

    if (/FINGER/i.test(method) || /FINGER/i.test(summary.packetType)) {
      state.receivedCanvasFingerPacketCount += 1;
    }

    if (/FRAME/i.test(method) || /FRAME/i.test(summary.packetType)) {
      state.receivedFramePacketCount += 1;
    }

    record("HEARTH_CANVAS_FINGER_INSPECT_RECEIVED_PACKET", {
      method,
      packetType: summary.packetType,
      sourceFile: summary.sourceFile,
      sourceAuthority: summary.sourceAuthority
    });

    const report = buildReport({
      diagnosticTimestamp: nowIso(),
      reason: `RECEIVE_PACKET:${method}`
    });

    publishReport(report);

    return {
      ...getReceiptLight(false),
      accepted: true,
      receiver: method,
      packetSummary: summary,
      report
    };
  }

  function receiveHexSurfaceTransmissionPacket(packet) {
    return receivePacket(packet, "receiveHexSurfaceTransmissionPacket");
  }

  function consumeHexSurfaceTransmissionPacket(packet) {
    return receivePacket(packet, "consumeHexSurfaceTransmissionPacket");
  }

  function receivePointerFingerTransmissionPacket(packet) {
    return receivePacket(packet, "receivePointerFingerTransmissionPacket");
  }

  function consumePointerFingerTransmissionPacket(packet) {
    return receivePacket(packet, "consumePointerFingerTransmissionPacket");
  }

  function receiveCanvasFingerPacket(packet) {
    return receivePacket(packet, "receiveCanvasFingerPacket");
  }

  function consumeCanvasFingerPacket(packet) {
    return receivePacket(packet, "consumeCanvasFingerPacket");
  }

  function receiveHexGatePacket(packet) {
    return receivePacket(packet, "receiveHexGatePacket");
  }

  function consumeHexGatePacket(packet) {
    return receivePacket(packet, "consumeHexGatePacket");
  }

  function receiveFramePacket(packet) {
    return receivePacket(packet, "receiveFramePacket");
  }

  function consumeFramePacket(packet) {
    return receivePacket(packet, "consumeFramePacket");
  }

  function receiveInspectPacket(packet) {
    return receivePacket(packet, "receiveInspectPacket");
  }

  function acceptHexGatePacket(packet) {
    return receivePacket(packet, "acceptHexGatePacket");
  }

  function acceptTransmissionPacket(packet) {
    return receivePacket(packet, "acceptTransmissionPacket");
  }

  function receive(packet) {
    return receivePacket(packet, "receive");
  }

  function inspectExpressionSurfaceDom() {
    const found = queryFirst([
      "[data-hearth-expression-surface='true']",
      "[data-hearth-surface-expression='true']",
      ".hearth-expression-surface",
      ".hearth-surface-expression",
      "#hearthExpressionSurface",
      "#hearthSurfaceExpression"
    ]);

    if (!found) {
      return {
        expressionSurfaceElementFound: false,
        expressionSurfaceSelector: "NONE",
        expressionSurfaceRectNonzero: false,
        expressionSurfaceVisible: false
      };
    }

    let rect = null;
    let style = null;

    try {
      rect = found.node.getBoundingClientRect();
    } catch (_error) {
      rect = null;
    }

    try {
      style = root.getComputedStyle ? root.getComputedStyle(found.node) : null;
    } catch (_error) {
      style = null;
    }

    const width = safeNumber(rect && rect.width, 0);
    const height = safeNumber(rect && rect.height, 0);
    const rectNonzero = width > 0 && height > 0;

    return {
      expressionSurfaceElementFound: true,
      expressionSurfaceSelector: found.selector,
      expressionSurfaceTag: found.node.tagName || "UNKNOWN",
      expressionSurfaceId: found.node.id || "NONE",
      expressionSurfaceClass: safeString(found.node.className || "NONE"),
      expressionSurfaceRectWidth: width,
      expressionSurfaceRectHeight: height,
      expressionSurfaceRectNonzero: rectNonzero,
      expressionSurfaceVisible:
        rectNonzero &&
        (!style ||
          (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            safeNumber(style.opacity, 1) > 0
          ))
    };
  }

  function deriveChokePoint(data) {
    const canvasPixelsVisible = Boolean(data.canvasDom.canvasPixelVisible);
    const canvasSurfaceOk = Boolean(
      data.canvasDom.canvasElementFound &&
      data.canvasDom.canvasRectNonzero &&
      data.canvasDom.canvasComputedVisible &&
      data.canvasDom.canvasContext2dReady
    );

    const hexObserved = Boolean(data.hexSurface.observed);
    const hexMethods = data.hexSurface.methods || [];
    const hexGateReceiverReady = hexMethods.some((method) =>
      /receiveCanvasHexGatePacket|consumeCanvasHexGatePacket|acceptCanvasHexGatePacket|drawInteractiveFrame|drawPairFrame|receiveInteractiveFramePacket/i.test(method)
    );

    const inspectReceiverReady = Boolean(data.inspectReceiver.methodCount > 0);
    const receivedByInspect = state.receivedHexSurfaceTransmissionCount > 0 || state.receivedPointerFingerTransmissionCount > 0;
    const pointerObservedCount = data.fingers.filter((entry) => entry.observed).length;
    const pointerActiveCount = data.fingers.filter((entry) => entry.methodCount > 0).length;

    if (canvasPixelsVisible) {
      return {
        status: "VISIBLE_PIXEL_PROOF_PRESENT",
        class: "NO_PIXEL_CHOKE_POINT_OBSERVED",
        coordinate: "NONE",
        owner: "NONE",
        file: "NONE",
        action: "NO_PIXEL_REPAIR_RECOMMENDED_FROM_INSPECT"
      };
    }

    if (!canvasSurfaceOk) {
      return {
        status: "CANVAS_SURFACE_NOT_PROVEN",
        class: "CANVAS_DOM_OR_CONTEXT_SURFACE_INCOMPLETE",
        coordinate: "CANVAS_SURFACE",
        owner: "CANVAS_SURFACE_BINDING",
        file: CANVAS_FILE,
        action: "REPAIR_CANVAS_SURFACE_BINDING_BEFORE_DOWNSTREAM_PACKET_AUDIT"
      };
    }

    if (!hexObserved) {
      return {
        status: "HEX_SURFACE_GATE_NOT_OBSERVED",
        class: "HEX_SURFACE_GATE_MISSING",
        coordinate: "HEX_SURFACE_GATE",
        owner: "HEX_SURFACE_GATE",
        file: HEX_SURFACE_FILE,
        action: "LOAD_OR_PUBLISH_HEX_SURFACE_GATE_ALIASES"
      };
    }

    if (!hexGateReceiverReady) {
      return {
        status: "HEX_SURFACE_GATE_NOT_RECEIVER_READY",
        class: "HEX_SURFACE_PUBLIC_GATE_METHODS_MISSING",
        coordinate: "HEX_SURFACE_GATE_METHODS",
        owner: "HEX_SURFACE_GATE",
        file: HEX_SURFACE_FILE,
        action: "CONFIRM_HEX_SURFACE_PUBLIC_CANVAS_GATE_RECEIVER_METHODS"
      };
    }

    if (!inspectReceiverReady) {
      return {
        status: "POINTER_INSPECT_RECEIVER_NOT_READY",
        class: "INSPECT_RECEIVER_METHODS_MISSING",
        coordinate: "POINTER_INSPECT_RECEIVER_METHODS",
        owner: "CANVAS_FINGER_INSPECT_RECEIVER",
        file: FILE,
        action: "PUBLISH_POINTER_INSPECT_RECEIVER_ALIASES_AND_METHODS"
      };
    }

    if (!receivedByInspect) {
      return {
        status: "HEX_GATE_DID_NOT_REACH_INSPECT_RECEIVER",
        class: "HEX_SURFACE_TO_POINTER_RECEIVER_DELIVERY_NOT_OBSERVED",
        coordinate: "HEX_TO_POINTER_RECEIVER_TRANSMISSION",
        owner: "HEX_SURFACE_GATE_OR_ALIAS_ALIGNMENT",
        file: HEX_SURFACE_FILE,
        action: "VERIFY_HEX_SURFACE_DELIVERS_TO_POINTER_INSPECT_RECEIVER_ALIAS"
      };
    }

    if (receivedByInspect && !canvasPixelsVisible) {
      return {
        status: "DOWNSTREAM_PACKET_RECEIVED_PIXEL_BLANK",
        class: "CANVAS_DRAW_PATH_OR_FINAL_EXPRESSION_ADAPTER_BLANK",
        coordinate: "CANVAS_PIXEL_VISIBLE_AFTER_HEX_GATE_RECEIPT",
        owner: "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
        file: CANVAS_FILE,
        action: "AUDIT_CANVAS_DRAW_PATH_AFTER_CONFIRMED_HEX_SURFACE_POINTER_RECEIVER_DELIVERY"
      };
    }

    if (pointerObservedCount === 0) {
      return {
        status: "POINTER_FINGER_SET_NOT_OBSERVED",
        class: "POINTER_FINGER_PUBLIC_ALIASES_MISSING",
        coordinate: "POINTER_FINGER_ALIASES",
        owner: "POINTER_FINGER_PUBLIC_RECEIVER_SET",
        file: FILE,
        action: "CONFIRM_PUBLIC_POINTER_FINGER_RECEIVER_ALIASES"
      };
    }

    if (pointerActiveCount === 0) {
      return {
        status: "POINTER_FINGER_SET_OBSERVED_NOT_ACTIVE",
        class: "POINTER_FINGER_PUBLIC_RECEIVER_METHODS_MISSING",
        coordinate: "POINTER_FINGER_RECEIVER_METHODS",
        owner: "POINTER_FINGER_PUBLIC_RECEIVER_SET",
        file: FILE,
        action: "CONFIRM_PUBLIC_POINTER_FINGER_RECEIVER_METHODS"
      };
    }

    return {
      status: "DOWNSTREAM_EXPRESSION_PARTIAL_PIXEL_BLANK",
      class: "CANVAS_DRAW_PATH_OR_EXPRESSION_ADAPTER_PARTIAL",
      coordinate: "DOWNSTREAM_EXPRESSION_TO_CANVAS_PIXEL",
      owner: "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER",
      file: CANVAS_FILE,
      action: "AUDIT_FINAL_EXPRESSION_WRITE_TO_CANVAS_PIXELS"
    };
  }

  function buildReport(input = {}) {
    const diagnosticTimestamp = firstKnown(input.diagnosticTimestamp, nowIso());

    const canvas = inspectAliasGroup(CANVAS_ALIASES);
    const hexSurface = inspectAliasGroup(HEX_SURFACE_ALIASES);
    const fourPair = inspectAliasGroup(FOUR_PAIR_ALIASES);
    const inspectReceiver = inspectAliasGroup(POINTER_RECEIVER_ALIAS_PATHS);

    const fingers = [
      { id: "BOUNDARY", file: BOUNDARY_FINGER_FILE, ...inspectAliasGroup(FINGER_ALIAS_GROUPS.boundary) },
      { id: "SURFACE", file: SURFACE_FINGER_FILE, ...inspectAliasGroup(FINGER_ALIAS_GROUPS.surface) },
      { id: "INSPECT", file: FILE, ...inspectReceiver },
      { id: "LIGHT", file: LIGHT_FINGER_FILE, ...inspectAliasGroup(FINGER_ALIAS_GROUPS.light) }
    ];

    const canvasDom = inspectCanvasDom();
    const expressionDom = inspectExpressionSurfaceDom();

    const choke = deriveChokePoint({
      canvas,
      hexSurface,
      fourPair,
      inspectReceiver,
      fingers,
      canvasDom,
      expressionDom
    });

    const pointerObservedCount = fingers.filter((entry) => entry.observed).length;
    const pointerActiveCount = fingers.filter((entry) => entry.methodCount > 0).length;

    const notes = [
      "CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_ACTIVE",
      "THIS_FILE_IS_POINTER_RECEIVER_INSPECT_SURFACE_NOT_POINTER_FINGER_ITSELF",
      "HEX_SURFACE_REMAINS_GATE_TO_POINTER_FINGER_TRANSMISSION",
      "INSPECT_FILE_NOW_PUBLISHES_HEX_SURFACE_EXPECTED_RECEIVER_METHODS",
      "NO_PRODUCTION_MUTATION",
      "NO_CANVAS_DRAWING",
      "NO_CANVAS_CREATION",
      "NO_CANVAS_REPAIR",
      "NO_ROUTE_REPAIR",
      "NO_RUNTIME_RESTART",
      "NO_F13_OR_F21_CLAIM",
      `CANVAS_PIXEL_SAMPLE_STATUS:${canvasDom.canvasPixelSampleStatus}`,
      `CANVAS_PIXEL_VISIBLE:${canvasDom.canvasPixelVisible}`,
      `HEX_SURFACE_OBSERVED:${hexSurface.observed}`,
      `HEX_SURFACE_METHOD_COUNT:${hexSurface.methodCount}`,
      `INSPECT_RECEIVER_METHOD_COUNT:${inspectReceiver.methodCount}`,
      `RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT:${state.receivedHexSurfaceTransmissionCount}`,
      `RECEIVED_POINTER_FINGER_TRANSMISSION_COUNT:${state.receivedPointerFingerTransmissionCount}`,
      `CHOKE_CLASS:${choke.class}`
    ];

    const report = {
      PACKET_NAME: "HEARTH_CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_PACKET_v2",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,
      DIAGNOSTIC_ROUTE,
      DIAGNOSTIC_TIMESTAMP: diagnosticTimestamp,

      CANVAS_FILE,
      HEX_SURFACE_FILE,
      FOUR_PAIR_AUTHORITY_FILE,
      SURFACE_FINGER_FILE,
      BOUNDARY_FINGER_FILE,
      LIGHT_FINGER_FILE,

      EXPECTED_CANVAS_CONTRACT,
      EXPECTED_HEX_SURFACE_CONTRACT,
      EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT,

      CANVAS_FINGER_INSPECT_STATUS: "COMPLETE",
      CANVAS_FINGER_INSPECT_ROLE:
        "AUXILIARY_HEX_SURFACE_POINTER_RECEIVER_PROOF_LAYER",
      CANVAS_FINGER_INSPECT_AUTHORITY:
        "READ_ONLY_INSPECTION_AND_PACKET_RECEIPT_SURFACE_ONLY",
      CANVAS_FINGER_INSPECT_CHRONOLOGY_OWNER: "false",
      CANVAS_FINGER_INSPECT_NINE_CYCLE_MUTATION: "false",
      CANVAS_FINGER_INSPECT_CAN_BE_READ_BY_SOUTH_PROBE: "true",

      POINTER_FINGER_ITSELF: "false",
      POINTER_RECEIVER_SURFACE: "true",
      POINTER_RECEIVER_FILE: FILE,
      POINTER_FINGER_TRUTH_OWNED: "false",
      HEX_SURFACE_GATE_EXPECTED: "true",
      HEX_SURFACE_GATE_RESPECTED: "true",

      PRODUCTION_MUTATION_AUTHORIZED: "false",
      CANVAS_DRAWING_AUTHORIZED: "false",
      CANVAS_CREATION_AUTHORIZED: "false",
      CANVAS_REPAIR_AUTHORIZED: "false",
      ROUTE_REPAIR_AUTHORIZED: "false",
      CONTROL_MUTATION_AUTHORIZED: "false",
      RUNTIME_RESTART_AUTHORIZED: "false",
      FINAL_VISUAL_PASS_AUTHORITY: "false",

      RECEIVER_METHOD_COUNT: String(state.receiverMethodCount),
      RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT: String(state.receivedHexSurfaceTransmissionCount),
      RECEIVED_POINTER_FINGER_TRANSMISSION_COUNT: String(state.receivedPointerFingerTransmissionCount),
      RECEIVED_CANVAS_FINGER_PACKET_COUNT: String(state.receivedCanvasFingerPacketCount),
      RECEIVED_FRAME_PACKET_COUNT: String(state.receivedFramePacketCount),
      LAST_RECEIVE_METHOD: state.lastReceiveMethod,
      LAST_RECEIVED_AT: state.lastReceivedAt || "NONE",
      LAST_RECEIVED_PACKET_TYPE: state.lastReceivedPacketType,
      LAST_RECEIVED_PACKET_SUMMARY: clonePlain(state.lastReceivedPacketSummary || {}),

      CANVAS_AUTHORITY_OBSERVED: boolText(canvas.observed, "false"),
      CANVAS_AUTHORITY_SOURCE_PATH: canvas.path,
      CANVAS_AUTHORITY_CONTRACT: canvas.contract,
      CANVAS_AUTHORITY_RECEIPT: canvas.receipt,
      CANVAS_AUTHORITY_METHOD_COUNT: String(canvas.methodCount),

      HEX_SURFACE_OBSERVED: boolText(hexSurface.observed, "false"),
      HEX_SURFACE_SOURCE_PATH: hexSurface.path,
      HEX_SURFACE_CONTRACT: hexSurface.contract,
      HEX_SURFACE_RECEIPT: hexSurface.receipt,
      HEX_SURFACE_METHOD_COUNT: String(hexSurface.methodCount),
      HEX_SURFACE_METHODS: hexSurface.methods,

      FOUR_PAIR_AUTHORITY_OBSERVED: boolText(fourPair.observed, "false"),
      FOUR_PAIR_AUTHORITY_SOURCE_PATH: fourPair.path,
      FOUR_PAIR_AUTHORITY_CONTRACT: fourPair.contract,
      FOUR_PAIR_AUTHORITY_RECEIPT: fourPair.receipt,
      FOUR_PAIR_AUTHORITY_METHOD_COUNT: String(fourPair.methodCount),

      POINTER_RECEIVER_OBSERVED: boolText(inspectReceiver.observed, "false"),
      POINTER_RECEIVER_SOURCE_PATH: inspectReceiver.path,
      POINTER_RECEIVER_CONTRACT: inspectReceiver.contract,
      POINTER_RECEIVER_RECEIPT: inspectReceiver.receipt,
      POINTER_RECEIVER_METHOD_COUNT: String(inspectReceiver.methodCount),
      POINTER_RECEIVER_METHODS: inspectReceiver.methods,

      POINTER_FINGER_OBSERVED_COUNT: String(pointerObservedCount),
      POINTER_FINGER_ACTIVE_COUNT: String(pointerActiveCount),
      POINTER_FINGER_RECEIVER_SET: clonePlain(fingers),

      EXPRESSION_SURFACE_ELEMENT_FOUND: boolText(expressionDom.expressionSurfaceElementFound, "false"),
      EXPRESSION_SURFACE_SELECTOR: expressionDom.expressionSurfaceSelector,
      EXPRESSION_SURFACE_RECT_NONZERO: boolText(expressionDom.expressionSurfaceRectNonzero, "false"),
      EXPRESSION_SURFACE_VISIBLE: boolText(expressionDom.expressionSurfaceVisible, "false"),

      CANVAS_ELEMENT_FOUND: boolText(canvasDom.canvasElementFound, "false"),
      CANVAS_SELECTOR: canvasDom.canvasSelector,
      CANVAS_DATASET_CONTRACT: canvasDom.canvasDatasetContract || "UNKNOWN",
      CANVAS_DATASET_RECEIPT: canvasDom.canvasDatasetReceipt || "UNKNOWN",
      CANVAS_RECT_NONZERO: boolText(canvasDom.canvasRectNonzero, "false"),
      CANVAS_COMPUTED_VISIBLE: boolText(canvasDom.canvasComputedVisible, "false"),
      CANVAS_VIEWPORT_INTERSECTING: boolText(canvasDom.canvasViewportIntersecting, "false"),
      CANVAS_CONTEXT_2D_READY: boolText(canvasDom.canvasContext2dReady, "false"),
      CANVAS_CONTEXT_2D_STATUS: canvasDom.canvasContext2dStatus || "UNKNOWN",
      CANVAS_PIXEL_SAMPLE_STATUS: canvasDom.canvasPixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: boolText(canvasDom.canvasPixelVisible, "false"),
      CANVAS_PIXEL_SAMPLE_COUNT: String(canvasDom.canvasSampleCount || 0),
      CANVAS_VISIBLE_PIXEL_COUNT: String(canvasDom.canvasVisiblePixelCount || 0),
      CANVAS_ALPHA_PIXEL_COUNT: String(canvasDom.canvasAlphaPixelCount || 0),
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: String(canvasDom.canvasUniqueColorCount || 0),
      CANVAS_PIXEL_SAMPLE_REASON: canvasDom.canvasPixelSampleReason,

      DOWNSTREAM_EXPRESSION_SET_STATUS: choke.status,
      DOWNSTREAM_EXPRESSION_VERDICT_CLASS: choke.class,
      DOWNSTREAM_CHOKE_COORDINATE: choke.coordinate,
      DOWNSTREAM_RECOMMENDED_OWNER: choke.owner,
      DOWNSTREAM_RECOMMENDED_FILE: choke.file,
      DOWNSTREAM_RECOMMENDED_ACTION: choke.action,

      CANVAS_DOM_INSPECTION: clonePlain(canvasDom),
      EXPRESSION_SURFACE_DOM_INSPECTION: clonePlain(expressionDom),

      SECONDARY_EVIDENCE_NOTES: notes.join(" | "),

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };

    return report;
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
      "DIAGNOSTIC_TIMESTAMP",

      "CANVAS_FINGER_INSPECT_STATUS",
      "CANVAS_FINGER_INSPECT_ROLE",
      "CANVAS_FINGER_INSPECT_AUTHORITY",
      "CANVAS_FINGER_INSPECT_CHRONOLOGY_OWNER",
      "CANVAS_FINGER_INSPECT_NINE_CYCLE_MUTATION",
      "CANVAS_FINGER_INSPECT_CAN_BE_READ_BY_SOUTH_PROBE",

      "POINTER_FINGER_ITSELF",
      "POINTER_RECEIVER_SURFACE",
      "POINTER_RECEIVER_FILE",
      "POINTER_FINGER_TRUTH_OWNED",
      "HEX_SURFACE_GATE_EXPECTED",
      "HEX_SURFACE_GATE_RESPECTED",

      "PRODUCTION_MUTATION_AUTHORIZED",
      "CANVAS_DRAWING_AUTHORIZED",
      "CANVAS_CREATION_AUTHORIZED",
      "CANVAS_REPAIR_AUTHORIZED",
      "ROUTE_REPAIR_AUTHORIZED",
      "CONTROL_MUTATION_AUTHORIZED",
      "RUNTIME_RESTART_AUTHORIZED",
      "FINAL_VISUAL_PASS_AUTHORITY",

      "RECEIVER_METHOD_COUNT",
      "RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT",
      "RECEIVED_POINTER_FINGER_TRANSMISSION_COUNT",
      "RECEIVED_CANVAS_FINGER_PACKET_COUNT",
      "RECEIVED_FRAME_PACKET_COUNT",
      "LAST_RECEIVE_METHOD",
      "LAST_RECEIVED_AT",
      "LAST_RECEIVED_PACKET_TYPE",
      "LAST_RECEIVED_PACKET_SUMMARY",

      "CANVAS_AUTHORITY_OBSERVED",
      "CANVAS_AUTHORITY_SOURCE_PATH",
      "CANVAS_AUTHORITY_CONTRACT",
      "CANVAS_AUTHORITY_RECEIPT",
      "CANVAS_AUTHORITY_METHOD_COUNT",

      "HEX_SURFACE_OBSERVED",
      "HEX_SURFACE_SOURCE_PATH",
      "HEX_SURFACE_CONTRACT",
      "HEX_SURFACE_RECEIPT",
      "HEX_SURFACE_METHOD_COUNT",
      "HEX_SURFACE_METHODS",

      "FOUR_PAIR_AUTHORITY_OBSERVED",
      "FOUR_PAIR_AUTHORITY_SOURCE_PATH",
      "FOUR_PAIR_AUTHORITY_CONTRACT",
      "FOUR_PAIR_AUTHORITY_RECEIPT",
      "FOUR_PAIR_AUTHORITY_METHOD_COUNT",

      "POINTER_RECEIVER_OBSERVED",
      "POINTER_RECEIVER_SOURCE_PATH",
      "POINTER_RECEIVER_CONTRACT",
      "POINTER_RECEIVER_RECEIPT",
      "POINTER_RECEIVER_METHOD_COUNT",
      "POINTER_RECEIVER_METHODS",

      "POINTER_FINGER_OBSERVED_COUNT",
      "POINTER_FINGER_ACTIVE_COUNT",

      "EXPRESSION_SURFACE_ELEMENT_FOUND",
      "EXPRESSION_SURFACE_SELECTOR",
      "EXPRESSION_SURFACE_RECT_NONZERO",
      "EXPRESSION_SURFACE_VISIBLE",

      "CANVAS_ELEMENT_FOUND",
      "CANVAS_SELECTOR",
      "CANVAS_DATASET_CONTRACT",
      "CANVAS_DATASET_RECEIPT",
      "CANVAS_RECT_NONZERO",
      "CANVAS_COMPUTED_VISIBLE",
      "CANVAS_VIEWPORT_INTERSECTING",
      "CANVAS_CONTEXT_2D_READY",
      "CANVAS_CONTEXT_2D_STATUS",
      "CANVAS_PIXEL_SAMPLE_STATUS",
      "CANVAS_PIXEL_VISIBLE",
      "CANVAS_PIXEL_SAMPLE_COUNT",
      "CANVAS_VISIBLE_PIXEL_COUNT",
      "CANVAS_ALPHA_PIXEL_COUNT",
      "CANVAS_PIXEL_UNIQUE_COLOR_COUNT",
      "CANVAS_PIXEL_SAMPLE_REASON",

      "DOWNSTREAM_EXPRESSION_SET_STATUS",
      "DOWNSTREAM_EXPRESSION_VERDICT_CLASS",
      "DOWNSTREAM_CHOKE_COORDINATE",
      "DOWNSTREAM_RECOMMENDED_OWNER",
      "DOWNSTREAM_RECOMMENDED_FILE",
      "DOWNSTREAM_RECOMMENDED_ACTION",

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
      line("INTERNAL_RENEWAL_CONTRACT", INTERNAL_RENEWAL_CONTRACT),
      line("CANVAS_FINGER_INSPECT_STATUS", report.CANVAS_FINGER_INSPECT_STATUS),
      line("POINTER_FINGER_ITSELF", report.POINTER_FINGER_ITSELF),
      line("POINTER_RECEIVER_SURFACE", report.POINTER_RECEIVER_SURFACE),
      line("HEX_SURFACE_GATE_RESPECTED", report.HEX_SURFACE_GATE_RESPECTED),
      line("RECEIVER_METHOD_COUNT", report.RECEIVER_METHOD_COUNT),
      line("RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT", report.RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT),
      line("HEX_SURFACE_OBSERVED", report.HEX_SURFACE_OBSERVED),
      line("POINTER_RECEIVER_OBSERVED", report.POINTER_RECEIVER_OBSERVED),
      line("POINTER_RECEIVER_METHOD_COUNT", report.POINTER_RECEIVER_METHOD_COUNT),
      line("CANVAS_PIXEL_SAMPLE_STATUS", report.CANVAS_PIXEL_SAMPLE_STATUS),
      line("CANVAS_PIXEL_VISIBLE", report.CANVAS_PIXEL_VISIBLE),
      line("DOWNSTREAM_EXPRESSION_VERDICT_CLASS", report.DOWNSTREAM_EXPRESSION_VERDICT_CLASS),
      line("DOWNSTREAM_CHOKE_COORDINATE", report.DOWNSTREAM_CHOKE_COORDINATE),
      line("DOWNSTREAM_RECOMMENDED_FILE", report.DOWNSTREAM_RECOMMENDED_FILE),
      line("DOWNSTREAM_RECOMMENDED_ACTION", report.DOWNSTREAM_RECOMMENDED_ACTION)
    ].join("\n");
  }

  function publishReport(report) {
    state.lastReport = clonePlain(report);
    state.lastPacketText = composePacketText(report);
    state.lastCompactSummary = composeCompactSummary(report);
    state.lastState = {
      role: "CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_LAYER",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      pointerFingerItself: false,
      pointerReceiverSurface: true,
      hexSurfaceGateRespected: true,
      status: report.CANVAS_FINGER_INSPECT_STATUS,
      downstreamExpressionSetStatus: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
      downstreamExpressionVerdictClass: report.DOWNSTREAM_EXPRESSION_VERDICT_CLASS,
      downstreamChokeCoordinate: report.DOWNSTREAM_CHOKE_COORDINATE,
      downstreamRecommendedFile: report.DOWNSTREAM_RECOMMENDED_FILE,
      canvasPixelSampleStatus: report.CANVAS_PIXEL_SAMPLE_STATUS,
      canvasPixelVisible: report.CANVAS_PIXEL_VISIBLE,
      receivedHexSurfaceTransmissionCount: state.receivedHexSurfaceTransmissionCount,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };

    publishAllAliases();
  }

  function runCanvasFingerInspect(input = {}) {
    const report = buildReport(input);
    publishReport(report);

    return {
      ok: true,
      contract: CONTRACT,
      receipt: RECEIPT,
      implementationContract: CONTRACT,
      implementationReceipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,

      CANVAS_FINGER_INSPECT_STATUS: report.CANVAS_FINGER_INSPECT_STATUS,
      POINTER_FINGER_ITSELF: report.POINTER_FINGER_ITSELF,
      POINTER_RECEIVER_SURFACE: report.POINTER_RECEIVER_SURFACE,
      HEX_SURFACE_GATE_RESPECTED: report.HEX_SURFACE_GATE_RESPECTED,

      DOWNSTREAM_EXPRESSION_SET_STATUS: report.DOWNSTREAM_EXPRESSION_SET_STATUS,
      DOWNSTREAM_EXPRESSION_VERDICT_CLASS: report.DOWNSTREAM_EXPRESSION_VERDICT_CLASS,
      DOWNSTREAM_CHOKE_COORDINATE: report.DOWNSTREAM_CHOKE_COORDINATE,
      DOWNSTREAM_RECOMMENDED_OWNER: report.DOWNSTREAM_RECOMMENDED_OWNER,
      DOWNSTREAM_RECOMMENDED_FILE: report.DOWNSTREAM_RECOMMENDED_FILE,
      DOWNSTREAM_RECOMMENDED_ACTION: report.DOWNSTREAM_RECOMMENDED_ACTION,

      CANVAS_PIXEL_SAMPLE_STATUS: report.CANVAS_PIXEL_SAMPLE_STATUS,
      CANVAS_PIXEL_VISIBLE: report.CANVAS_PIXEL_VISIBLE,
      RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT: report.RECEIVED_HEX_SURFACE_TRANSMISSION_COUNT,

      evidence: report,
      REPORT_OBJECT: report,
      report,
      packetText: state.lastPacketText,
      compactSummary: state.lastCompactSummary,
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function runInspect(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function inspect(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function runDiagnostic(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function probe(input = {}) {
    return runCanvasFingerInspect(input);
  }

  function getReport(options = {}) {
    if (options && options.refresh === false && state.lastReport) {
      return clonePlain(state.lastReport);
    }

    const result = runCanvasFingerInspect({
      diagnosticTimestamp: nowIso(),
      reason: "GET_REPORT_REFRESH"
    });

    return clonePlain(result.report);
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

  function baseState() {
    return {
      role: "CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_LAYER",
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,
      pointerFingerItself: false,
      pointerReceiverSurface: true,
      hexSurfaceGateRespected: true,
      status: "READY",
      downstreamExpressionSetStatus: "NOT_RUN",
      downstreamExpressionVerdictClass: "NOT_RUN",
      downstreamChokeCoordinate: "NOT_RUN",
      downstreamRecommendedFile: "UNKNOWN",
      canvasPixelSampleStatus: "NOT_RUN",
      canvasPixelVisible: "UNKNOWN",
      receivedHexSurfaceTransmissionCount: state.receivedHexSurfaceTransmissionCount,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getState() {
    return clonePlain(state.lastState || baseState());
  }

  function getReceiptLight() {
    return {
      role: "CANVAS_FINGER_INSPECT_HEX_SURFACE_POINTER_RECEIVER_PROOF_LAYER",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasFile: CANVAS_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      fourPairAuthorityFile: FOUR_PAIR_AUTHORITY_FILE,
      surfaceFingerFile: SURFACE_FINGER_FILE,
      boundaryFingerFile: BOUNDARY_FINGER_FILE,
      lightFingerFile: LIGHT_FINGER_FILE,

      expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedFourPairAuthorityContract: EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT,

      primaryCallableMethod: "runCanvasFingerInspect",
      runCanvasFingerInspectApiAvailable: true,
      runInspectApiAvailable: true,
      inspectApiAvailable: true,
      runDiagnosticApiAvailable: true,
      probeApiAvailable: true,
      getReportApiAvailable: true,
      getPacketTextApiAvailable: true,
      getCompactSummaryApiAvailable: true,
      getStateApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,

      receiveHexSurfaceTransmissionPacketApiAvailable: true,
      consumeHexSurfaceTransmissionPacketApiAvailable: true,
      receivePointerFingerTransmissionPacketApiAvailable: true,
      consumePointerFingerTransmissionPacketApiAvailable: true,
      receiveCanvasFingerPacketApiAvailable: true,
      consumeCanvasFingerPacketApiAvailable: true,
      receiveHexGatePacketApiAvailable: true,
      consumeHexGatePacketApiAvailable: true,
      receiveFramePacketApiAvailable: true,
      consumeFramePacketApiAvailable: true,
      receiveInspectPacketApiAvailable: true,
      acceptHexGatePacketApiAvailable: true,
      acceptTransmissionPacketApiAvailable: true,
      receiveApiAvailable: true,

      auxiliaryLayerOnly: true,
      chronologyOwner: false,
      nineCycleMutation: false,
      readableBySouthProbe: true,

      pointerFingerItself: false,
      pointerReceiverSurface: true,
      pointerReceiverFile: FILE,
      pointerFingerTruthOwned: false,
      hexSurfaceGateExpected: true,
      hexSurfaceGateRespected: true,

      receiverMethodCount: state.receiverMethodCount,
      receivedHexSurfaceTransmissionCount: state.receivedHexSurfaceTransmissionCount,
      receivedPointerFingerTransmissionCount: state.receivedPointerFingerTransmissionCount,
      receivedCanvasFingerPacketCount: state.receivedCanvasFingerPacketCount,
      receivedFramePacketCount: state.receivedFramePacketCount,
      lastReceiveMethod: state.lastReceiveMethod,
      lastReceivedAt: state.lastReceivedAt || "NONE",
      lastReceivedPacketType: state.lastReceivedPacketType,

      productionMutationAuthorized: false,
      canvasDrawingAuthorized: false,
      canvasCreationAuthorized: false,
      canvasRepairAuthorized: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      finalVisualPassAuthority: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      CANVAS_FINGER_INSPECT_CONTRACT: CONTRACT,
      CANVAS_FINGER_INSPECT_RECEIPT: RECEIPT,
      CANVAS_FINGER_INSPECT_INTERNAL_RENEWAL_CONTRACT: INTERNAL_RENEWAL_CONTRACT,
      CANVAS_FINGER_INSPECT_INTERNAL_RENEWAL_RECEIPT: INTERNAL_RENEWAL_RECEIPT,
      CANVAS_FINGER_INSPECT_FILE: FILE,
      reportObject: clonePlain(state.lastReport || {}),
      state: clonePlain(state.lastState || baseState()),
      lastReceivedPacketSummary: clonePlain(state.lastReceivedPacketSummary || {}),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      ...UPPER_NO_CLAIMS
    };
  }

  function publishAllAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    for (const path of POINTER_RECEIVER_ALIAS_PATHS) {
      setPath(path, api);
    }

    root.HEARTH_CANVAS_FINGER_INSPECT_RECEIPT = getReceipt();
    root.HEARTH_CANVAS_FINGER_INSPECT_REPORT = clonePlain(state.lastReport || {});
    root.HEARTH_CANVAS_FINGER_INSPECT_PACKET_TEXT = state.lastPacketText || "";
    root.HEARTH_CANVAS_FINGER_INSPECT_COMPACT_SUMMARY =
      state.lastCompactSummary || "";

    root.HEARTH_POINTER_FINGER_RECEIVER_RECEIPT = getReceipt();
    root.HEARTH_POINTER_FINGER_INSPECT_RECEIPT = getReceipt();
    root.HEARTH_HEX_SURFACE_POINTER_FINGER_RECEIVER_RECEIPT = getReceipt();

    root.HEARTH.pointerFingerReceiverReceipt = getReceipt();
    root.HEARTH.pointerFingerInspectReceipt = getReceipt();
    root.HEARTH.hexSurfacePointerFingerReceiverReceipt = getReceipt();

    root.DEXTER_LAB.hearthPointerFingerReceiverReceipt = getReceipt();
    root.DEXTER_LAB.hearthPointerFingerInspectReceipt = getReceipt();

    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    canvasFile: CANVAS_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    fourPairAuthorityFile: FOUR_PAIR_AUTHORITY_FILE,
    surfaceFingerFile: SURFACE_FINGER_FILE,
    boundaryFingerFile: BOUNDARY_FINGER_FILE,
    lightFingerFile: LIGHT_FINGER_FILE,

    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedFourPairAuthorityContract: EXPECTED_FOUR_PAIR_AUTHORITY_CONTRACT,

    primaryCallableMethod: "runCanvasFingerInspect",

    runCanvasFingerInspect,
    runInspect,
    inspect,
    runDiagnostic,
    probe,
    getReport,
    getPacketText,
    getCompactSummary,
    getState,
    getReceipt,
    getReceiptLight,

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
    receiveInspectPacket,
    acceptHexGatePacket,
    acceptTransmissionPacket,
    receive,

    inspectCanvasDom,
    inspectExpressionSurfaceDom,
    publishAllAliases,

    runCanvasFingerInspectApiAvailable: true,
    runInspectApiAvailable: true,
    inspectApiAvailable: true,
    runDiagnosticApiAvailable: true,
    probeApiAvailable: true,
    getReportApiAvailable: true,
    getPacketTextApiAvailable: true,
    getCompactSummaryApiAvailable: true,
    getStateApiAvailable: true,
    getReceiptApiAvailable: true,
    getReceiptLightApiAvailable: true,

    receiveHexSurfaceTransmissionPacketApiAvailable: true,
    consumeHexSurfaceTransmissionPacketApiAvailable: true,
    receivePointerFingerTransmissionPacketApiAvailable: true,
    consumePointerFingerTransmissionPacketApiAvailable: true,
    receiveCanvasFingerPacketApiAvailable: true,
    consumeCanvasFingerPacketApiAvailable: true,
    receiveHexGatePacketApiAvailable: true,
    consumeHexGatePacketApiAvailable: true,
    receiveFramePacketApiAvailable: true,
    consumeFramePacketApiAvailable: true,
    receiveInspectPacketApiAvailable: true,
    acceptHexGatePacketApiAvailable: true,
    acceptTransmissionPacketApiAvailable: true,
    receiveApiAvailable: true,

    auxiliaryLayerOnly: true,
    chronologyOwner: false,
    nineCycleMutation: false,
    readableBySouthProbe: true,

    pointerFingerItself: false,
    pointerReceiverSurface: true,
    pointerReceiverFile: FILE,
    pointerFingerTruthOwned: false,
    hexSurfaceGateExpected: true,
    hexSurfaceGateRespected: true,

    productionMutationAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    canvasRepairAuthorized: false,
    routeRepairAuthorized: false,
    controlMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    finalVisualPassAuthority: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  state.receiverMethodCount = [
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
    "receiveInspectPacket",
    "acceptHexGatePacket",
    "acceptTransmissionPacket",
    "receive"
  ].filter((method) => isFunction(api[method])).length;

  state.lastState = baseState();
  publishAllAliases();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
