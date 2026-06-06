// /assets/hearth/hearth.hex.surface.js
// HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4
// Internal controlled renewal:
// HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_TNT_v4_3
// Full-file replacement.
// Hex Surface / Canvas Hex Gate / Pointer Finger transmission authority only.
// Purpose:
// - Preserve the public v4 Hex Surface Renderer contract expected by Canvas, Controls, diagnostics, and route receipts.
// - Receive Canvas Hex Gate packets from /assets/hearth/hearth.canvas.js.
// - Validate Canvas/Controls view packets before admitting them through the Hex Surface gate.
// - Consume HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1 when available.
// - Preserve paired interactive sphere renderer methods:
//   1. drawPairFrame(packet, options)
//   2. drawInteractiveFrame(packet, options)
//   3. receiveInteractiveFramePacket(packet, options)
// - Expose Canvas-facing Hex Gate receiver methods:
//   1. receiveCanvasHexGatePacket(packet, options)
//   2. consumeCanvasHexGatePacket(packet, options)
//   3. acceptCanvasHexGatePacket(packet, options)
//   4. receiveCanvasViewPacket(packet, options)
//   5. consumeCanvasViewPacket(packet, options)
// - Forward lawful Hex-gated packets toward the Pointer Finger surface/boundary/inspect/light authorities through public APIs only.
// - Preserve Canvas as receiver/output carrier.
// - Preserve Pointer Finger files as downstream expression instruments.
// - Do not dig into Canvas bishops, diagnostic bishops, finger internals, or terrain/material/hydrology/elevation truth.
// - Do not create Canvas, mount Canvas, boot Canvas, call Canvas lifecycle, or claim final visual pass.
// - Do not create terrain truth, hydrology truth, elevation truth, material truth, Hex authority truth,
//   Canvas drawing authority, Pointer Finger truth, F13 claim, F21 claim, ready text,
//   completion latch, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const RECEIPT = "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT_v4";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_TNT_v4_3";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT_v4_3";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_HEX_SURFACE_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_HEX_SURFACE_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_RECEIPT_v4_2";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";

  const VERSION =
    "2026-06-06.hearth-hex-surface-canvas-gate-pointer-finger-transmission-v4-3";

  const FILE = "/assets/hearth/hearth.hex.surface.js";
  const ROUTE = "/showroom/globe/hearth/";
  const CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const POINTER_FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const POINTER_FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const EXPECTED_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const ACCEPTED_CANVAS_CONTRACTS = Object.freeze([
    EXPECTED_CANVAS_CONTRACT,
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_TNT_v12_4",
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3_1",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2",
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1",
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12",
    "HEARTH_CANVAS_EXPRESSION_HUB_VISIBLE_BASE_GLOBE_CARRIER_TNT_v11_7",
    "HEARTH_CANVAS_EXPRESSION_HUB_FINGER_MANAGER_TNT_v11_6",
    "HEARTH_CANVAS_LOCAL_STATION_ROUTE_CONDUCTOR_V9_4_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_5",
    "HEARTH_CANVAS_LOCAL_STATION_DIAGNOSTIC_BRIDGE_ALIGNMENT_TNT_v11_4",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_3",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_2",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11_1",
    "HEARTH_CANVAS_LOCAL_STATION_CHILD_DISTRIBUTION_SWITCHBOARD_TNT_v11"
  ]);

  const ACCEPTED_CONTROL_CONTRACTS = Object.freeze([
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1",
    "HEARTH_CONTROLS_VERTICAL_POLARITY_SMOOTH_CANVAS_HEX_PAIR_ALIGNMENT_TNT_v4_2",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4_1",
    "HEARTH_CONTROLS_SMOOTH_POINTER_DELTA_CANVAS_FRAME_ALIGNMENT_TNT_v4"
  ]);

  const HEX_SURFACE_PACKET = "HEARTH_HEX_SURFACE_CANVAS_GATE_PACKET_v4_3";
  const POINTER_FINGER_PACKET = "HEARTH_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_PACKET_v4_3";
  const INTERACTIVE_FRAME_PACKET = "HEARTH_HEX_SURFACE_INTERACTIVE_FRAME_PACKET_v4_3";
  const PAIR_FRAME_PACKET = "HEARTH_HEX_SURFACE_PAIR_FRAME_PACKET_v4_3";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByHexSurface: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByHexSurface: false,
    f21ClaimedByDiagnosticRail: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
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

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairPixelHandshakeAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority"
  ]);

  const CANVAS_ALIASES = Object.freeze([
    "HEARTH_CANVAS_HUB_HEX_SURFACE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER",
    "HEARTH_CANVAS_HUB_RAF_FAST_INTERACTIVE_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER",
    "HEARTH_CANVAS_PLANETARY_VIEW_CONTROL_RECEIVER",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH.canvasHubHexSurfacePointerFingerTransmission",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubRafSphereRotationPairReceiver",
    "HEARTH.canvasHubRafFastInteractiveDeferredHexRenderReceiver",
    "HEARTH.canvasHubFastViewTransformDeferredRenderReceiver",
    "HEARTH.canvasPlanetaryViewControlReceiver",
    "HEARTH.canvasHub",
    "HEARTH.canvas",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubHexSurfacePointerFingerTransmission",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet"
  ]);

  const CONTROL_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH_CONTROLS_QUEEN",
    "HEARTH_QUEEN_CONTROLS",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "HEARTH.controlsQueen",
    "HEARTH.queenControls",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls",
    "DEXTER_LAB.hearthQueenControls"
  ]);

  const POINTER_FINGER_ALIASES = Object.freeze([
    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_FINGER_BOUNDARY",
    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_FINGER_LIGHT",
    "HEARTH_CANVAS_POINTER_FINGER_SURFACE",
    "HEARTH_CANVAS_POINTER_FINGER_BOUNDARY",
    "HEARTH_CANVAS_POINTER_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER_LIGHT",
    "HEARTH_POINTER_FINGER_SURFACE",
    "HEARTH_POINTER_FINGER_BOUNDARY",
    "HEARTH_POINTER_FINGER_INSPECT",
    "HEARTH_POINTER_FINGER_LIGHT",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasFingerBoundary",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasFingerLight",
    "HEARTH.canvasPointerFingerSurface",
    "HEARTH.canvasPointerFingerBoundary",
    "HEARTH.canvasPointerFingerInspect",
    "HEARTH.canvasPointerFingerLight",
    "HEARTH.pointerFingerSurface",
    "HEARTH.pointerFingerBoundary",
    "HEARTH.pointerFingerInspect",
    "HEARTH.pointerFingerLight",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasFingerBoundary",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasFingerLight",
    "DEXTER_LAB.hearthPointerFingerSurface",
    "DEXTER_LAB.hearthPointerFingerBoundary",
    "DEXTER_LAB.hearthPointerFingerInspect",
    "DEXTER_LAB.hearthPointerFingerLight"
  ]);

  const HEX_SURFACE_ALIAS_PATHS = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH_HEX_PAIR_SURFACE",
    "HEARTH_HEX_PAIR_RENDERER",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "HEARTH.hexPairSurface",
    "HEARTH.hexPairRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexPairSurface",
    "DEXTER_LAB.hearthHexPairRenderer"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    canvasFile: CANVAS_FILE,
    controlFile: CONTROL_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
    pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
    pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
    pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    disposed: false,
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_HEX_SURFACE_V4_3_LOADED",

    hexSurfaceGateActive: true,
    canvasGateReceiverActive: true,
    pointerFingerTransmissionActive: true,
    pairedInteractiveSphereRendererActive: true,
    canvasLifecycleCallsSuppressed: true,
    controlsLifecycleCallsSuppressed: true,
    fingerInternalsNotInspected: true,
    packetPhasePreservedFromControls: true,
    packetPhaseFixedAtZeroWhenAbsent: true,

    hexAuthorityObserved: false,
    hexAuthoritySource: "NONE",
    hexAuthorityContract: "UNKNOWN",
    hexAuthorityReceipt: "UNKNOWN",
    hexAuthorityRecognized: false,

    canvasObserved: false,
    canvasAuthoritySource: "NONE",
    canvasContract: "UNKNOWN",
    canvasReceipt: "UNKNOWN",
    canvasContractRecognized: false,

    controlObserved: false,
    controlAuthoritySource: "NONE",
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",
    controlContractRecognized: false,

    pointerFingerObservedCount: 0,
    pointerFingerActiveCount: 0,
    pointerFingerSurfaceObserved: false,
    pointerFingerBoundaryObserved: false,
    pointerFingerInspectObserved: false,
    pointerFingerLightObserved: false,
    pointerFingerSurfaceSource: "NONE",
    pointerFingerBoundarySource: "NONE",
    pointerFingerInspectSource: "NONE",
    pointerFingerLightSource: "NONE",
    pointerFingerTransmissionStatus: "WAITING_CANVAS_HEX_GATE_PACKET",
    pointerFingerTransmissionMethod: "NONE",
    pointerFingerTransmissionReason: "WAITING_CANVAS_HEX_GATE_PACKET",

    lastCanvasHexGatePacket: null,
    lastInteractiveFramePacket: null,
    lastPairFramePacket: null,
    lastPointerFingerTransmissionPacket: null,
    lastRejectedPacket: null,
    lastRejectionReason: "",
    lastValidationStatus: "WAITING_PACKET",

    receivedPacketCount: 0,
    acceptedPacketCount: 0,
    rejectedPacketCount: 0,
    interactiveFrameCount: 0,
    pairFrameCount: 0,
    transmissionCount: 0,
    deliveryCount: 0,
    aliasPublishCount: 0,
    receiptPublishCount: 0,
    eventCount: 0,
    errorCount: 0,

    firstFailedCoordinate: "WAITING_CANVAS_HEX_GATE_PACKET",
    recommendedNextFile: CANVAS_FILE,
    recommendedNextAction: "SEND_CANVAS_HEX_GATE_PACKET_TO_HEX_SURFACE",
    postgameStatus: "HEX_SURFACE_LOADED_WAITING_CANVAS_GATE",

    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  const api = {};
  let bootPromise = null;

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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_HEX_SURFACE_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 160);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_HEX_SURFACE_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 100);
    state.errorCount = state.errors.length;
    state.latestEvent = item.code;
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

  function setPath(path, value) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(names) {
    for (const name of names || []) {
      const value = readPath(name);
      if (value && isObject(value)) return { name, value };
    }

    return { name: "NONE", value: null };
  }

  function dataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return {};
    return doc.documentElement.dataset;
  }

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
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

  function readAuthorityReceipt(authority) {
    if (!authority || !isObject(authority) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getStatus",
      "getReport",
      "getState",
      "getSummary",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getControlReceipt",
      "getControlSummary",
      "getHexReceipt",
      "getHexAuthorityReceipt",
      "getHexSurfaceReceipt",
      "getFingerReceipt",
      "getPointerFingerReceipt"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const result = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(result)) return result;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.hexReceipt)) return authority.hexReceipt;
    if (isObject(authority.hexAuthorityReceipt)) return authority.hexAuthorityReceipt;
    if (isObject(authority.hexSurfaceReceipt)) return authority.hexSurfaceReceipt;
    if (isObject(authority.pointerFingerReceipt)) return authority.pointerFingerReceipt;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT || authority.version) return authority;

    return null;
  }

  function contractOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentContract",
        "canvasContract",
        "controlContract",
        "controlsContract",
        "hexAuthorityContract",
        "hexContract",
        "hexSurfaceContract",
        "contract",
        "CONTRACT",
        "sourceContract"
      ], ""),
      value && value.contract,
      value && value.CONTRACT
    );
  }

  function receiptOf(value) {
    return firstNonEmpty(
      readField(value, [
        "currentCanvasParentReceipt",
        "canvasReceipt",
        "controlReceipt",
        "controlsReceipt",
        "hexAuthorityReceipt",
        "hexReceipt",
        "hexSurfaceReceipt",
        "receipt",
        "RECEIPT",
        "sourceReceipt"
      ], ""),
      value && value.receipt,
      value && value.RECEIPT
    );
  }

  function canvasContractRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_CANVAS_CONTRACTS.includes(text) || text.includes("HEARTH_CANVAS");
  }

  function controlContractRecognized(contract) {
    const text = safeString(contract);
    return ACCEPTED_CONTROL_CONTRACTS.includes(text) || text.includes("HEARTH_CONTROLS");
  }

  function hexAuthorityContractRecognized(contract) {
    return safeString(contract) === EXPECTED_HEX_AUTHORITY_CONTRACT ||
      safeString(contract).includes("HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY");
  }

  function readHexAuthority() {
    const found = firstGlobal(HEX_AUTHORITY_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthHexAuthorityContract,
      ds.hearthHexFourPairAuthorityContract,
      ds.hearthHexFourPairPixelHandshakeAuthorityContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthHexAuthorityReceipt,
      ds.hearthHexFourPairAuthorityReceipt,
      ds.hearthHexFourPairPixelHandshakeAuthorityReceipt
    );

    state.hexAuthorityObserved = Boolean(found.value || contract);
    state.hexAuthoritySource = found.name;
    state.hexAuthorityContract = contract || "UNKNOWN";
    state.hexAuthorityReceipt = receiptName || "UNKNOWN";
    state.hexAuthorityRecognized = hexAuthorityContractRecognized(contract);

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN",
      recognized: state.hexAuthorityRecognized
    };
  }

  function readCanvasAuthority() {
    const found = firstGlobal(CANVAS_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthCanvasContract,
      ds.hearthSouthCurrentCanvasParentContract,
      ds.hearthCanvasParentContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthCanvasReceipt,
      ds.hearthSouthCurrentCanvasParentReceipt
    );

    state.canvasObserved = Boolean(found.value || contract);
    state.canvasAuthoritySource = found.name;
    state.canvasContract = contract || "UNKNOWN";
    state.canvasReceipt = receiptName || "UNKNOWN";
    state.canvasContractRecognized = canvasContractRecognized(contract);

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN",
      recognized: state.canvasContractRecognized
    };
  }

  function readControlAuthority() {
    const found = firstGlobal(CONTROL_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthControlsContract,
      ds.hearthControlContract,
      ds.hearthSouthControlFileContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthControlsReceipt,
      ds.hearthControlReceipt,
      ds.hearthSouthControlFileReceipt
    );

    state.controlObserved = Boolean(found.value || contract);
    state.controlAuthoritySource = found.name;
    state.controlContract = contract || "UNKNOWN";
    state.controlReceipt = receiptName || "UNKNOWN";
    state.controlContractRecognized = controlContractRecognized(contract);

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN",
      recognized: state.controlContractRecognized
    };
  }

  function splitFingerAliasGroups() {
    return {
      surface: POINTER_FINGER_ALIASES.filter((name) => /SURFACE|Surface|surface/.test(name)),
      boundary: POINTER_FINGER_ALIASES.filter((name) => /BOUNDARY|Boundary|boundary/.test(name)),
      inspect: POINTER_FINGER_ALIASES.filter((name) => /INSPECT|Inspect|inspect/.test(name)),
      light: POINTER_FINGER_ALIASES.filter((name) => /LIGHT|Light|light/.test(name))
    };
  }

  function readPointerFingerAuthorities() {
    const groups = splitFingerAliasGroups();

    const surface = firstGlobal(groups.surface);
    const boundary = firstGlobal(groups.boundary);
    const inspect = firstGlobal(groups.inspect);
    const light = firstGlobal(groups.light);

    const authorities = [
      { key: "surface", file: POINTER_FINGER_SURFACE_FILE, found: surface },
      { key: "boundary", file: POINTER_FINGER_BOUNDARY_FILE, found: boundary },
      { key: "inspect", file: POINTER_FINGER_INSPECT_FILE, found: inspect },
      { key: "light", file: POINTER_FINGER_LIGHT_FILE, found: light }
    ];

    let observedCount = 0;
    let activeCount = 0;

    for (const item of authorities) {
      const observed = Boolean(item.found.value);
      const method = resolvePointerFingerMethod(item.found.value);
      const active = Boolean(observed && method);

      observedCount += observed ? 1 : 0;
      activeCount += active ? 1 : 0;

      item.observed = observed;
      item.active = active;
      item.method = method || "NONE";
      item.receipt = readAuthorityReceipt(item.found.value) || {};
      item.contract = contractOf(item.receipt) || (item.found.value && item.found.value.contract) || "UNKNOWN";
      item.receiptName = receiptOf(item.receipt) || (item.found.value && item.found.value.receipt) || "UNKNOWN";
    }

    state.pointerFingerObservedCount = observedCount;
    state.pointerFingerActiveCount = activeCount;

    state.pointerFingerSurfaceObserved = surface.value ? true : false;
    state.pointerFingerBoundaryObserved = boundary.value ? true : false;
    state.pointerFingerInspectObserved = inspect.value ? true : false;
    state.pointerFingerLightObserved = light.value ? true : false;

    state.pointerFingerSurfaceSource = surface.name;
    state.pointerFingerBoundarySource = boundary.name;
    state.pointerFingerInspectSource = inspect.name;
    state.pointerFingerLightSource = light.name;

    return authorities;
  }

  function resolvePointerFingerMethod(authority) {
    if (!authority || !isObject(authority)) return "";

    const methods = [
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
      "receiveBoundaryPacket",
      "receiveInspectPacket",
      "receiveLightPacket",
      "acceptHexGatePacket",
      "acceptTransmissionPacket",
      "receive"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function hasNoForbiddenClaims(packet) {
    const p = isObject(packet) ? packet : {};

    return !(
      p.f13Claimed === true ||
      p.f13CanvasClaimed === true ||
      p.f13ClaimedByHexSurface === true ||
      p.f21EligibleForNorth === true ||
      p.f21Claimed === true ||
      p.f21ClaimedByHexSurface === true ||
      p.f21ClaimedByDiagnosticRail === true ||
      p.f21SubmittedToNorth === true ||
      p.readyTextAllowed === true ||
      p.readyTextClaimed === true ||
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

  function packetSourceIsCanvasOrControl(packet) {
    if (!isObject(packet)) return false;

    const sourceFile = safeString(packet.sourceFile || packet.fromFile || "");
    const sourceRole = safeString(packet.sourceRole || packet.role || packet.sourceAuthority || packet.authority || "");
    const contract = safeString(firstDefined(
      packet.canvasContract,
      packet.currentCanvasParentContract,
      packet.controlContract,
      packet.controlsContract,
      packet.sourceContract,
      packet.contract,
      packet.CONTRACT
    ), "");

    return Boolean(
      sourceFile === CANVAS_FILE ||
      sourceFile.endsWith("/assets/hearth/hearth.canvas.js") ||
      sourceFile === CONTROL_FILE ||
      sourceFile.endsWith("/assets/hearth/hearth.controls.js") ||
      sourceRole.includes("canvas") ||
      sourceRole.includes("CANVAS") ||
      sourceRole.includes("control") ||
      sourceRole.includes("CONTROL") ||
      canvasContractRecognized(contract) ||
      controlContractRecognized(contract)
    );
  }

  function packetTargetsHexSurface(packet) {
    if (!isObject(packet)) return false;

    const packetType = safeString(packet.packetType || packet.type || "");
    const handoffTo = safeString(packet.handoffTo || packet.destination || packet.target || "");
    const targetFile = safeString(firstDefined(
      packet.targetFile,
      packet.destinationFile,
      packet.hexSurfaceFile,
      packet.targetHexSurfaceFile,
      packet.surfaceFile
    ), "");

    return Boolean(
      packetType.includes("HEX") ||
      packetType.includes("SURFACE") ||
      packetType.includes("FRAME") ||
      packetType.includes("VIEW") ||
      handoffTo.toUpperCase().includes("HEX") ||
      handoffTo.toUpperCase().includes("SURFACE") ||
      targetFile === FILE ||
      targetFile.endsWith("/hearth.hex.surface.js") ||
      safeBool(packet.hexSurfaceGateAuthorized, false) ||
      safeBool(packet.canvasHexGateAuthorized, false) ||
      safeBool(packet.pointerFingerTransmissionAuthorized, false)
    );
  }

  function validateIncomingPacket(packet, options = {}) {
    if (!isObject(packet)) {
      return { accepted: false, reason: "PACKET_NOT_OBJECT" };
    }

    if (!hasNoForbiddenClaims(packet)) {
      return { accepted: false, reason: "PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM" };
    }

    if (!packetSourceIsCanvasOrControl(packet) && options.allowDirect !== true) {
      return { accepted: false, reason: "PACKET_SOURCE_NOT_CANVAS_OR_CONTROLS" };
    }

    if (!packetTargetsHexSurface(packet) && options.allowDirect !== true) {
      return { accepted: false, reason: "PACKET_DOES_NOT_TARGET_HEX_SURFACE_GATE" };
    }

    if (
      packet.hexSurfaceGateAuthorized === false ||
      packet.canvasHexGateAuthorized === false ||
      packet.pointerFingerTransmissionAuthorized === false ||
      packet.hexGateAdmissionAuthorized === false
    ) {
      return { accepted: false, reason: "PACKET_EXPLICITLY_DENIES_HEX_GATE_OR_POINTER_TRANSMISSION" };
    }

    return { accepted: true, reason: "PACKET_ACCEPTED_BY_HEX_SURFACE_GATE" };
  }

  function normalizeViewState(packet = {}) {
    const source = isObject(packet.viewState) ? packet.viewState : packet;

    const yaw = safeNumber(firstDefined(source.yaw, packet.yaw), 0);
    const pitch = clamp(safeNumber(firstDefined(source.pitch, packet.pitch), 0), -1.25, 1.25);
    const zoom = clamp(safeNumber(firstDefined(source.zoom, packet.zoom), 1), 0.55, 2.4);
    const phase = safeNumber(firstDefined(source.phase, packet.phase), 0);

    return {
      yaw,
      pitch,
      zoom,
      phase,
      minPitch: safeNumber(source.minPitch, -1.25),
      maxPitch: safeNumber(source.maxPitch, 1.25),
      minZoom: safeNumber(source.minZoom, 0.55),
      maxZoom: safeNumber(source.maxZoom, 2.4)
    };
  }

  function composeHexFramePacket(packet = {}, options = {}) {
    const viewState = normalizeViewState(packet);
    const hexAuthority = readHexAuthority();
    const canvas = readCanvasAuthority();
    const control = readControlAuthority();

    const sourcePacketType = safeString(packet.packetType || packet.type || "UNKNOWN_PACKET");

    return {
      packetType: options.pairFrame === true ? PAIR_FRAME_PACKET : INTERACTIVE_FRAME_PACKET,
      hexSurfacePacketType: HEX_SURFACE_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_HEX_SURFACE",
      sourceRole: "hex-surface-canvas-gate-pointer-finger-transmission-authority",
      receivedSourcePacketType: sourcePacketType,

      route: ROUTE,
      canvasFile: CANVAS_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      canvasAuthoritySource: canvas.name,
      canvasContract: canvas.contract,
      canvasContractRecognized: canvas.recognized,
      controlAuthoritySource: control.name,
      controlContract: control.contract,
      controlContractRecognized: control.recognized,
      hexAuthorityObserved: hexAuthority.authority ? true : false,
      hexAuthoritySource: hexAuthority.name,
      hexAuthorityContract: hexAuthority.contract,
      hexAuthorityRecognized: hexAuthority.recognized,

      viewState,
      yaw: viewState.yaw,
      pitch: viewState.pitch,
      zoom: viewState.zoom,
      phase: viewState.phase,

      deltaYaw: safeNumber(packet.deltaYaw, 0),
      deltaPitch: safeNumber(packet.deltaPitch, 0),
      deltaZoom: safeNumber(packet.deltaZoom, 0),
      rawDx: packet.rawDx !== undefined ? safeNumber(packet.rawDx, 0) : undefined,
      rawDy: packet.rawDy !== undefined ? safeNumber(packet.rawDy, 0) : undefined,
      rawWheelY: packet.rawWheelY !== undefined ? safeNumber(packet.rawWheelY, 0) : undefined,
      inputType: safeString(packet.inputType || options.inputType || "hex-surface-frame"),

      projectionState: {
        renderer: "paired-interactive-sphere",
        gate: "hex-surface",
        yaw: viewState.yaw,
        pitch: viewState.pitch,
        zoom: viewState.zoom,
        phase: viewState.phase,
        horizontalPolarityPreserved: safeBool(packet.horizontalDragPolarityPreserved, true),
        verticalDragPolarityCorrected: safeBool(packet.verticalDragPolarityCorrected, true),
        pointerRightTurnsGlobeRight: safeBool(packet.pointerRightTurnsGlobeRight, true),
        pointerUpTurnsGlobeUp: safeBool(packet.pointerUpTurnsGlobeUp, true),
        pointerDownTurnsGlobeDown: safeBool(packet.pointerDownTurnsGlobeDown, true),
        canvasMustNotCounterInvertVertical: true,
        hexSurfaceReceivesCorrectedProjectionState: true
      },

      hexGate: {
        admitted: true,
        sourceValidated: true,
        forbiddenClaimsRejected: true,
        canvasLifecycleCallsSuppressed: true,
        fingerInternalsNotInspected: true,
        hexAuthorityTruthNotCreatedHere: true,
        pointerFingerTruthNotCreatedHere: true
      },

      pairedRenderer: {
        drawPairFrameSupported: true,
        drawInteractiveFrameSupported: true,
        receiveInteractiveFramePacketSupported: true,
        canvasDrawingOwnedByHexSurface: false,
        canvasDrawingOwnedByCanvas: true,
        canvasCreationOwnedByHexSurface: false
      },

      composedAt: nowIso(),
      originalPacket: clonePlain(packet),
      ...NO_CLAIMS
    };
  }

  function composePointerFingerTransmissionPacket(framePacket = {}, options = {}) {
    const fingers = readPointerFingerAuthorities();

    return {
      packetType: POINTER_FINGER_PACKET,
      contract: CONTRACT,
      receipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_HEX_SURFACE",
      sourceRole: "hex-surface-gate-to-pointer-finger-transmission",
      destinationFile: "POINTER_FINGER_PUBLIC_AUTHORITIES",
      handoffTo: "POINTER_FINGER_SURFACE_BOUNDARY_INSPECT_LIGHT",

      route: ROUTE,
      canvasFile: CANVAS_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      pointerFingerTransmissionAuthorized: true,
      pointerFingerObservedCount: state.pointerFingerObservedCount,
      pointerFingerActiveCount: state.pointerFingerActiveCount,
      pointerFingerAuthorities: fingers.map((item) => ({
        key: item.key,
        file: item.file,
        source: item.found.name,
        observed: item.observed,
        active: item.active,
        method: item.method,
        contract: item.contract,
        receipt: item.receiptName
      })),

      viewState: clonePlain(framePacket.viewState || normalizeViewState(framePacket)),
      projectionState: clonePlain(framePacket.projectionState || {}),
      hexFramePacket: clonePlain(framePacket),
      options: clonePlain(options),

      surfaceFingerExpected: true,
      boundaryFingerExpected: true,
      inspectFingerExpected: true,
      lightFingerExpected: true,

      canvasExpressionWithoutCanvasBishopMutation: true,
      hexSurfaceGateComplete: true,
      pointerFingerTruthNotClaimed: true,
      fingerInternalsNotInspected: true,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function deliverPointerFingerTransmission(transmissionPacket) {
    const fingers = readPointerFingerAuthorities();
    let delivered = 0;
    const deliveryResults = [];

    for (const finger of fingers) {
      if (!finger.found.value || !finger.method || !isFunction(finger.found.value[finger.method])) {
        deliveryResults.push({
          key: finger.key,
          delivered: false,
          method: "NONE",
          reason: finger.observed ? "PUBLIC_POINTER_FINGER_RECEIVER_MISSING" : "POINTER_FINGER_AUTHORITY_NOT_OBSERVED"
        });
        continue;
      }

      try {
        const result = finger.found.value[finger.method](clonePlain(transmissionPacket));
        delivered += 1;

        deliveryResults.push({
          key: finger.key,
          delivered: true,
          method: finger.method,
          reason: "POINTER_FINGER_PUBLIC_RECEIVER_CALLED",
          resultObserved: isObject(result)
        });

        if (result && isFunction(result.then)) {
          result.catch((error) => {
            recordError("HEARTH_HEX_SURFACE_POINTER_FINGER_ASYNC_RECEIVER_FAILED", error, {
              key: finger.key,
              method: finger.method
            });
          });
        }
      } catch (error) {
        recordError("HEARTH_HEX_SURFACE_POINTER_FINGER_RECEIVER_FAILED", error, {
          key: finger.key,
          method: finger.method
        });

        deliveryResults.push({
          key: finger.key,
          delivered: false,
          method: finger.method,
          reason: "POINTER_FINGER_PUBLIC_RECEIVER_THROWN"
        });
      }
    }

    state.deliveryCount += delivered;
    state.pointerFingerTransmissionStatus = delivered > 0
      ? "POINTER_FINGER_TRANSMISSION_DELIVERED"
      : "POINTER_FINGER_TRANSMISSION_PUBLISHED_WAITING_FINGER_RECEIVERS";
    state.pointerFingerTransmissionMethod = delivered > 0
      ? "PUBLIC_POINTER_FINGER_RECEIVERS"
      : "GLOBAL_PACKET_PUBLICATION";
    state.pointerFingerTransmissionReason = delivered > 0
      ? "ONE_OR_MORE_POINTER_FINGER_PUBLIC_RECEIVERS_CALLED"
      : "NO_POINTER_FINGER_PUBLIC_RECEIVER_AVAILABLE";

    publishTransmissionGlobals(transmissionPacket);
    broadcastHexSurfaceEvent(transmissionPacket);

    return {
      delivered: delivered > 0,
      deliveredCount: delivered,
      deliveryResults,
      status: state.pointerFingerTransmissionStatus,
      method: state.pointerFingerTransmissionMethod,
      reason: state.pointerFingerTransmissionReason
    };
  }

  function rejectPacket(packet, reason) {
    state.rejectedPacketCount += 1;
    state.lastRejectedPacket = clonePlain(packet || null);
    state.lastRejectionReason = reason;
    state.lastValidationStatus = "REJECTED";
    state.firstFailedCoordinate = reason || "HEX_SURFACE_PACKET_REJECTED";
    state.recommendedNextFile = CANVAS_FILE;
    state.recommendedNextAction = "SEND_LAWFUL_CANVAS_HEX_GATE_PACKET";
    state.postgameStatus = "HEX_SURFACE_PACKET_REJECTED";

    record("HEARTH_HEX_SURFACE_PACKET_REJECTED", {
      reason,
      sourcePacketType: packet && packet.packetType
    });

    updateDataset();
    publishGlobals("packet-rejected");

    return getReceiptLight(false);
  }

  function acceptPacket(packet, options = {}) {
    state.receivedPacketCount += 1;

    const validation = validateIncomingPacket(packet, options);

    if (!validation.accepted) {
      return rejectPacket(packet, validation.reason);
    }

    state.acceptedPacketCount += 1;
    state.lastValidationStatus = "ACCEPTED";
    state.lastRejectionReason = "";

    const framePacket = composeHexFramePacket(packet, options);
    const transmissionPacket = composePointerFingerTransmissionPacket(framePacket, options);
    const delivery = deliverPointerFingerTransmission(transmissionPacket);

    state.lastCanvasHexGatePacket = clonePlain(packet);
    state.lastInteractiveFramePacket = clonePlain(framePacket);
    state.lastPointerFingerTransmissionPacket = clonePlain(transmissionPacket);

    state.transmissionCount += 1;
    state.firstFailedCoordinate = delivery.delivered
      ? "NONE_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_DELIVERED"
      : "POINTER_FINGER_PUBLIC_RECEIVERS_WAITING";
    state.recommendedNextFile = delivery.delivered ? POINTER_FINGER_INSPECT_FILE : POINTER_FINGER_SURFACE_FILE;
    state.recommendedNextAction = delivery.delivered
      ? "OBSERVE_POINTER_FINGER_SURFACE_BOUNDARY_INSPECT_LIGHT_RESPONSE"
      : "PUBLISH_POINTER_FINGER_PUBLIC_RECEIVERS_OR_VERIFY_ALIAS_FRONT";
    state.postgameStatus = delivery.delivered
      ? "HEX_SURFACE_GATE_ACCEPTED_AND_POINTER_FINGER_TRANSMISSION_DELIVERED"
      : "HEX_SURFACE_GATE_ACCEPTED_PACKET_PUBLISHED_WAITING_POINTER_FINGER_RECEIVERS";

    record("HEARTH_HEX_SURFACE_GATE_PACKET_ACCEPTED", {
      sourcePacketType: packet.packetType || "UNKNOWN",
      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      pointerFingerObservedCount: state.pointerFingerObservedCount,
      pointerFingerActiveCount: state.pointerFingerActiveCount,
      deliveryStatus: delivery.status,
      deliveryMethod: delivery.method
    });

    updateDataset();
    publishGlobals("packet-accepted");

    return {
      ...getReceiptLight(false),
      framePacket: clonePlain(framePacket),
      transmissionPacket: clonePlain(transmissionPacket),
      delivery: clonePlain(delivery)
    };
  }

  function receiveCanvasHexGatePacket(packet, options = {}) {
    return acceptPacket(packet, {
      ...options,
      receiver: "receiveCanvasHexGatePacket"
    });
  }

  function consumeCanvasHexGatePacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "consumeCanvasHexGatePacket"
    });
  }

  function acceptCanvasHexGatePacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "acceptCanvasHexGatePacket"
    });
  }

  function receiveCanvasViewPacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "receiveCanvasViewPacket"
    });
  }

  function consumeCanvasViewPacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "consumeCanvasViewPacket"
    });
  }

  function receiveInteractiveFramePacket(packet, options = {}) {
    state.interactiveFrameCount += 1;
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "receiveInteractiveFramePacket",
      inputType: "interactive-frame"
    });
  }

  function drawInteractiveFrame(packet, options = {}) {
    state.interactiveFrameCount += 1;

    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "drawInteractiveFrame",
      inputType: "interactive-frame",
      drawCallAcceptedAsPacketCompositionOnly: true,
      canvasDrawingAuthorityNotAssumed: true
    });
  }

  function drawPairFrame(packet, options = {}) {
    state.pairFrameCount += 1;

    const receipt = receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "drawPairFrame",
      pairFrame: true,
      inputType: "pair-frame",
      drawCallAcceptedAsPacketCompositionOnly: true,
      canvasDrawingAuthorityNotAssumed: true
    });

    state.lastPairFramePacket = clonePlain(state.lastInteractiveFramePacket);

    return receipt;
  }

  function receivePlanetaryViewControlPacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "receivePlanetaryViewControlPacket",
      inputType: "planetary-view-control"
    });
  }

  function consumePlanetaryViewControlPacket(packet, options = {}) {
    return receivePlanetaryViewControlPacket(packet, {
      ...options,
      receiver: "consumePlanetaryViewControlPacket"
    });
  }

  function receiveViewControlPacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      receiver: "receiveViewControlPacket",
      inputType: "view-control"
    });
  }

  function consumeViewControlPacket(packet, options = {}) {
    return receiveViewControlPacket(packet, {
      ...options,
      receiver: "consumeViewControlPacket"
    });
  }

  function publishTransmissionGlobals(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    const cloned = clonePlain(packet);

    root.HEARTH_HEX_SURFACE_LAST_TRANSMISSION_PACKET = cloned;
    root.HEARTH_HEX_SURFACE_POINTER_FINGER_TRANSMISSION_PACKET = cloned;
    root.HEARTH_POINTER_FINGER_TRANSMISSION_PACKET = cloned;
    root.HEARTH_CANVAS_FINGER_TRANSMISSION_PACKET = cloned;

    hearth.hexSurfaceLastTransmissionPacket = cloned;
    hearth.hexSurfacePointerFingerTransmissionPacket = cloned;
    hearth.pointerFingerTransmissionPacket = cloned;
    hearth.canvasFingerTransmissionPacket = cloned;

    lab.hearthHexSurfaceLastTransmissionPacket = cloned;
    lab.hearthHexSurfacePointerFingerTransmissionPacket = cloned;
    lab.hearthPointerFingerTransmissionPacket = cloned;
  }

  function broadcastHexSurfaceEvent(packet) {
    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:hex-surface-transmission", { detail: clonePlain(packet) }));
        doc.dispatchEvent(new root.CustomEvent("hearth:pointer-finger-transmission", { detail: clonePlain(packet) }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:hex-surface-transmission", { detail: clonePlain(packet) }));
        root.dispatchEvent(new root.CustomEvent("hearth:pointer-finger-transmission", { detail: clonePlain(packet) }));
      }
    } catch (_error) {}
  }

  function composeDiagnosticFields() {
    return {
      HEX_SURFACE_FILE: FILE,
      HEX_SURFACE_CONTRACT: CONTRACT,
      HEX_SURFACE_RECEIPT: RECEIPT,
      HEX_SURFACE_INTERNAL_IMPLEMENTATION_CONTRACT: INTERNAL_IMPLEMENTATION_CONTRACT,
      HEX_SURFACE_GATE_ACTIVE: "true",
      CANVAS_GATE_RECEIVER_ACTIVE: "true",
      POINTER_FINGER_TRANSMISSION_ACTIVE: "true",
      PAIRED_INTERACTIVE_SPHERE_RENDERER_ACTIVE: "true",

      EXPECTED_CANVAS_FILE: CANVAS_FILE,
      EXPECTED_CANVAS_CONTRACT: EXPECTED_CANVAS_CONTRACT,
      EXPECTED_HEX_AUTHORITY_FILE: HEX_AUTHORITY_FILE,
      EXPECTED_HEX_AUTHORITY_CONTRACT: EXPECTED_HEX_AUTHORITY_CONTRACT,

      HEX_AUTHORITY_OBSERVED: String(state.hexAuthorityObserved),
      HEX_AUTHORITY_SOURCE: state.hexAuthoritySource,
      HEX_AUTHORITY_CONTRACT: state.hexAuthorityContract,
      HEX_AUTHORITY_RECOGNIZED: String(state.hexAuthorityRecognized),

      CANVAS_OBSERVED: String(state.canvasObserved),
      CANVAS_AUTHORITY_SOURCE: state.canvasAuthoritySource,
      CANVAS_CONTRACT: state.canvasContract,
      CANVAS_CONTRACT_RECOGNIZED: String(state.canvasContractRecognized),

      CONTROL_OBSERVED: String(state.controlObserved),
      CONTROL_AUTHORITY_SOURCE: state.controlAuthoritySource,
      CONTROL_CONTRACT: state.controlContract,
      CONTROL_CONTRACT_RECOGNIZED: String(state.controlContractRecognized),

      POINTER_FINGER_SURFACE_FILE: POINTER_FINGER_SURFACE_FILE,
      POINTER_FINGER_BOUNDARY_FILE: POINTER_FINGER_BOUNDARY_FILE,
      POINTER_FINGER_INSPECT_FILE: POINTER_FINGER_INSPECT_FILE,
      POINTER_FINGER_LIGHT_FILE: POINTER_FINGER_LIGHT_FILE,
      POINTER_FINGER_OBSERVED_COUNT: String(state.pointerFingerObservedCount),
      POINTER_FINGER_ACTIVE_COUNT: String(state.pointerFingerActiveCount),
      POINTER_FINGER_SURFACE_OBSERVED: String(state.pointerFingerSurfaceObserved),
      POINTER_FINGER_BOUNDARY_OBSERVED: String(state.pointerFingerBoundaryObserved),
      POINTER_FINGER_INSPECT_OBSERVED: String(state.pointerFingerInspectObserved),
      POINTER_FINGER_LIGHT_OBSERVED: String(state.pointerFingerLightObserved),
      POINTER_FINGER_TRANSMISSION_STATUS: state.pointerFingerTransmissionStatus,
      POINTER_FINGER_TRANSMISSION_METHOD: state.pointerFingerTransmissionMethod,
      POINTER_FINGER_TRANSMISSION_REASON: state.pointerFingerTransmissionReason,

      RECEIVED_PACKET_COUNT: String(state.receivedPacketCount),
      ACCEPTED_PACKET_COUNT: String(state.acceptedPacketCount),
      REJECTED_PACKET_COUNT: String(state.rejectedPacketCount),
      INTERACTIVE_FRAME_COUNT: String(state.interactiveFrameCount),
      PAIR_FRAME_COUNT: String(state.pairFrameCount),
      TRANSMISSION_COUNT: String(state.transmissionCount),
      DELIVERY_COUNT: String(state.deliveryCount),

      LAST_VALIDATION_STATUS: state.lastValidationStatus,
      LAST_REJECTION_REASON: state.lastRejectionReason,
      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      POSTGAME_STATUS: state.postgameStatus,

      CANVAS_LIFECYCLE_CALLS_SUPPRESSED: "true",
      CONTROLS_LIFECYCLE_CALLS_SUPPRESSED: "true",
      FINGER_INTERNALS_NOT_INSPECTED: "true",
      CANVAS_DRAWING_AUTHORIZED_BY_HEX_SURFACE: "false",
      CANVAS_CREATION_AUTHORIZED_BY_HEX_SURFACE: "false",
      TERRAIN_TRUTH_OWNED: "false",
      HYDROLOGY_TRUTH_OWNED: "false",
      ELEVATION_TRUTH_OWNED: "false",
      MATERIAL_TRUTH_OWNED: "false",
      POINTER_FINGER_TRUTH_OWNED: "false",

      f13Claimed: "false",
      f21EligibleForNorth: "false",
      f21ClaimedByHexSurface: "false",
      readyTextAllowed: "false",
      readyTextClaimed: "false",
      visualPassClaimed: "false",
      generatedImage: "false",
      graphicBox: "false",
      webGL: "false",
      webgl: "false"
    };
  }

  function composeReceiptLight() {
    readHexAuthority();
    readCanvasAuthority();
    readControlAuthority();
    readPointerFingerAuthorities();

    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT",
      hexSurfacePacketType: "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT",
      contract: CONTRACT,
      receipt: RECEIPT,
      hexSurfaceContract: CONTRACT,
      hexSurfaceReceipt: RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      canvasFile: CANVAS_FILE,
      controlFile: CONTROL_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: "hex-surface-canvas-gate-pointer-finger-transmission-authority",

      loaded: true,
      booted: state.booted,
      disposed: state.disposed,

      hexSurfaceGateActive: true,
      canvasGateReceiverActive: true,
      pointerFingerTransmissionActive: true,
      pairedInteractiveSphereRendererActive: true,
      canvasLifecycleCallsSuppressed: true,
      controlsLifecycleCallsSuppressed: true,
      fingerInternalsNotInspected: true,
      packetPhasePreservedFromControls: true,
      packetPhaseFixedAtZeroWhenAbsent: true,

      hexAuthorityObserved: state.hexAuthorityObserved,
      hexAuthoritySource: state.hexAuthoritySource,
      hexAuthorityContract: state.hexAuthorityContract,
      hexAuthorityReceipt: state.hexAuthorityReceipt,
      hexAuthorityRecognized: state.hexAuthorityRecognized,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

      canvasObserved: state.canvasObserved,
      canvasAuthoritySource: state.canvasAuthoritySource,
      canvasContract: state.canvasContract,
      canvasReceipt: state.canvasReceipt,
      canvasContractRecognized: state.canvasContractRecognized,
      acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),

      controlObserved: state.controlObserved,
      controlAuthoritySource: state.controlAuthoritySource,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,
      controlContractRecognized: state.controlContractRecognized,
      acceptedControlContracts: ACCEPTED_CONTROL_CONTRACTS.slice(),

      pointerFingerObservedCount: state.pointerFingerObservedCount,
      pointerFingerActiveCount: state.pointerFingerActiveCount,
      pointerFingerSurfaceObserved: state.pointerFingerSurfaceObserved,
      pointerFingerBoundaryObserved: state.pointerFingerBoundaryObserved,
      pointerFingerInspectObserved: state.pointerFingerInspectObserved,
      pointerFingerLightObserved: state.pointerFingerLightObserved,
      pointerFingerSurfaceSource: state.pointerFingerSurfaceSource,
      pointerFingerBoundarySource: state.pointerFingerBoundarySource,
      pointerFingerInspectSource: state.pointerFingerInspectSource,
      pointerFingerLightSource: state.pointerFingerLightSource,
      pointerFingerTransmissionStatus: state.pointerFingerTransmissionStatus,
      pointerFingerTransmissionMethod: state.pointerFingerTransmissionMethod,
      pointerFingerTransmissionReason: state.pointerFingerTransmissionReason,

      supportsCanvasHexGatePacket: true,
      supportsCanvasViewPacket: true,
      supportsInteractiveFramePacket: true,
      supportsDrawInteractiveFrame: true,
      supportsDrawPairFrame: true,
      supportsPointerFingerTransmission: true,
      supportsSurfaceBoundaryInspectLightFingerPath: true,
      supportsHexFourPairAuthorityConsumption: true,

      receivedPacketCount: state.receivedPacketCount,
      acceptedPacketCount: state.acceptedPacketCount,
      rejectedPacketCount: state.rejectedPacketCount,
      interactiveFrameCount: state.interactiveFrameCount,
      pairFrameCount: state.pairFrameCount,
      transmissionCount: state.transmissionCount,
      deliveryCount: state.deliveryCount,
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      eventCount: state.events.length,
      errorCount: state.errors.length,

      lastValidationStatus: state.lastValidationStatus,
      lastRejectionReason: state.lastRejectionReason,
      lastCanvasHexGatePacket: clonePlain(state.lastCanvasHexGatePacket),
      lastInteractiveFramePacket: clonePlain(state.lastInteractiveFramePacket),
      lastPairFramePacket: clonePlain(state.lastPairFramePacket),
      lastPointerFingerTransmissionPacket: clonePlain(state.lastPointerFingerTransmissionPacket),

      diagnosticFields: clonePlain(diagnosticFields),
      ...diagnosticFields,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      ownsHexSurfaceGate: true,
      ownsHexSurfaceReceiptPublication: true,
      ownsPairedInteractiveSpherePacketComposition: true,
      ownsPointerFingerTransmissionPacketComposition: true,

      ownsCanvasDrawing: false,
      ownsCanvasCreation: false,
      ownsCanvasLifecycle: false,
      ownsCanvasExpressionTruth: false,
      ownsCanvasFingerTruth: false,
      ownsPointerFingerTruth: false,
      ownsHexAuthorityTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsNorthF21Latch: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) refresh();
    return composeReceiptLight();
  }

  function getReceipt() {
    return {
      ...composeReceiptLight(),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      updatedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT",
      "",
      "HEADER",
      line("contract", CONTRACT),
      line("receipt", RECEIPT),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("previousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT),
      line("previousImplementationReceipt", PREVIOUS_IMPLEMENTATION_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      line("canvasFile", CANVAS_FILE),
      line("controlFile", CONTROL_FILE),
      line("hexAuthorityFile", HEX_AUTHORITY_FILE),
      "",
      "GATE",
      line("hexSurfaceGateActive", r.hexSurfaceGateActive),
      line("canvasGateReceiverActive", r.canvasGateReceiverActive),
      line("pointerFingerTransmissionActive", r.pointerFingerTransmissionActive),
      line("pairedInteractiveSphereRendererActive", r.pairedInteractiveSphereRendererActive),
      line("canvasLifecycleCallsSuppressed", true),
      line("fingerInternalsNotInspected", true),
      "",
      "HEX_AUTHORITY",
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexAuthoritySource", r.hexAuthoritySource),
      line("hexAuthorityContract", r.hexAuthorityContract),
      line("hexAuthorityRecognized", r.hexAuthorityRecognized),
      line("expectedHexAuthorityContract", EXPECTED_HEX_AUTHORITY_CONTRACT),
      "",
      "CANVAS",
      line("canvasObserved", r.canvasObserved),
      line("canvasAuthoritySource", r.canvasAuthoritySource),
      line("canvasContract", r.canvasContract),
      line("canvasContractRecognized", r.canvasContractRecognized),
      "",
      "CONTROLS",
      line("controlObserved", r.controlObserved),
      line("controlAuthoritySource", r.controlAuthoritySource),
      line("controlContract", r.controlContract),
      line("controlContractRecognized", r.controlContractRecognized),
      "",
      "POINTER_FINGER",
      line("pointerFingerSurfaceFile", POINTER_FINGER_SURFACE_FILE),
      line("pointerFingerBoundaryFile", POINTER_FINGER_BOUNDARY_FILE),
      line("pointerFingerInspectFile", POINTER_FINGER_INSPECT_FILE),
      line("pointerFingerLightFile", POINTER_FINGER_LIGHT_FILE),
      line("pointerFingerObservedCount", r.pointerFingerObservedCount),
      line("pointerFingerActiveCount", r.pointerFingerActiveCount),
      line("pointerFingerSurfaceObserved", r.pointerFingerSurfaceObserved),
      line("pointerFingerBoundaryObserved", r.pointerFingerBoundaryObserved),
      line("pointerFingerInspectObserved", r.pointerFingerInspectObserved),
      line("pointerFingerLightObserved", r.pointerFingerLightObserved),
      line("pointerFingerTransmissionStatus", r.pointerFingerTransmissionStatus),
      line("pointerFingerTransmissionMethod", r.pointerFingerTransmissionMethod),
      line("pointerFingerTransmissionReason", r.pointerFingerTransmissionReason),
      "",
      "COUNTS",
      line("receivedPacketCount", r.receivedPacketCount),
      line("acceptedPacketCount", r.acceptedPacketCount),
      line("rejectedPacketCount", r.rejectedPacketCount),
      line("interactiveFrameCount", r.interactiveFrameCount),
      line("pairFrameCount", r.pairFrameCount),
      line("transmissionCount", r.transmissionCount),
      line("deliveryCount", r.deliveryCount),
      "",
      "NEXT",
      line("lastValidationStatus", r.lastValidationStatus),
      line("lastRejectionReason", r.lastRejectionReason),
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByHexSurface", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("generatedImage", false),
      line("graphicBox", false),
      line("webGL", false),
      line("webgl", false),
      "",
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getReceiptText() {
    return composeReceiptText(getReceiptLight(false));
  }

  function getStatusText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("hexSurfaceGateActive", r.hexSurfaceGateActive),
      line("hexAuthorityObserved", r.hexAuthorityObserved),
      line("hexAuthorityRecognized", r.hexAuthorityRecognized),
      line("canvasObserved", r.canvasObserved),
      line("canvasContractRecognized", r.canvasContractRecognized),
      line("pointerFingerObservedCount", r.pointerFingerObservedCount),
      line("pointerFingerActiveCount", r.pointerFingerActiveCount),
      line("pointerFingerTransmissionStatus", r.pointerFingerTransmissionStatus),
      line("lastValidationStatus", r.lastValidationStatus),
      line("acceptedPacketCount", r.acceptedPacketCount),
      line("transmissionCount", r.transmissionCount),
      line("deliveryCount", r.deliveryCount),
      line("recommendedNextFile", r.recommendedNextFile),
      line("postgameStatus", r.postgameStatus),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      diagnosticFields: composeDiagnosticFields()
    };
  }

  function refresh() {
    readHexAuthority();
    readCanvasAuthority();
    readControlAuthority();
    readPointerFingerAuthorities();

    if (state.acceptedPacketCount === 0 && state.rejectedPacketCount === 0) {
      state.firstFailedCoordinate = "WAITING_CANVAS_HEX_GATE_PACKET";
      state.recommendedNextFile = CANVAS_FILE;
      state.recommendedNextAction = "SEND_CANVAS_HEX_GATE_PACKET_TO_HEX_SURFACE";
      state.postgameStatus = "HEX_SURFACE_READY_WAITING_CANVAS_GATE_PACKET";
    }

    updateDataset();
    publishGlobals("refresh");

    return getReceiptLight(false);
  }

  function updateDataset() {
    const fields = composeDiagnosticFields();

    setDataset("hearthHexSurfaceLoaded", "true");
    setDataset("hearthHexSurfacePresent", "true");
    setDataset("hearthHexSurfaceContract", CONTRACT);
    setDataset("hearthHexSurfaceReceipt", RECEIPT);
    setDataset("hearthHexSurfaceInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthHexSurfaceInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthHexSurfaceVersion", VERSION);

    setDataset("hearthHexSurfaceGateActive", "true");
    setDataset("hearthCanvasHexGateReceiverActive", "true");
    setDataset("hearthPointerFingerTransmissionActive", "true");
    setDataset("hearthPairedInteractiveSphereRendererActive", "true");

    setDataset("hearthHexSurfaceCanvasFile", CANVAS_FILE);
    setDataset("hearthHexSurfaceControlFile", CONTROL_FILE);
    setDataset("hearthHexSurfaceHexAuthorityFile", HEX_AUTHORITY_FILE);
    setDataset("hearthHexSurfaceExpectedHexAuthorityContract", EXPECTED_HEX_AUTHORITY_CONTRACT);

    setDataset("hearthHexSurfaceHexAuthorityObserved", String(state.hexAuthorityObserved));
    setDataset("hearthHexSurfaceHexAuthoritySource", state.hexAuthoritySource);
    setDataset("hearthHexSurfaceHexAuthorityContract", state.hexAuthorityContract);
    setDataset("hearthHexSurfaceHexAuthorityRecognized", String(state.hexAuthorityRecognized));

    setDataset("hearthHexSurfaceCanvasObserved", String(state.canvasObserved));
    setDataset("hearthHexSurfaceCanvasAuthoritySource", state.canvasAuthoritySource);
    setDataset("hearthHexSurfaceCanvasContract", state.canvasContract);
    setDataset("hearthHexSurfaceCanvasContractRecognized", String(state.canvasContractRecognized));

    setDataset("hearthHexSurfaceControlObserved", String(state.controlObserved));
    setDataset("hearthHexSurfaceControlAuthoritySource", state.controlAuthoritySource);
    setDataset("hearthHexSurfaceControlContract", state.controlContract);
    setDataset("hearthHexSurfaceControlContractRecognized", String(state.controlContractRecognized));

    setDataset("hearthHexSurfacePointerFingerSurfaceFile", POINTER_FINGER_SURFACE_FILE);
    setDataset("hearthHexSurfacePointerFingerBoundaryFile", POINTER_FINGER_BOUNDARY_FILE);
    setDataset("hearthHexSurfacePointerFingerInspectFile", POINTER_FINGER_INSPECT_FILE);
    setDataset("hearthHexSurfacePointerFingerLightFile", POINTER_FINGER_LIGHT_FILE);
    setDataset("hearthHexSurfacePointerFingerObservedCount", String(state.pointerFingerObservedCount));
    setDataset("hearthHexSurfacePointerFingerActiveCount", String(state.pointerFingerActiveCount));
    setDataset("hearthHexSurfacePointerFingerTransmissionStatus", state.pointerFingerTransmissionStatus);
    setDataset("hearthHexSurfacePointerFingerTransmissionMethod", state.pointerFingerTransmissionMethod);
    setDataset("hearthHexSurfacePointerFingerTransmissionReason", state.pointerFingerTransmissionReason);

    setDataset("hearthHexSurfaceReceivedPacketCount", String(state.receivedPacketCount));
    setDataset("hearthHexSurfaceAcceptedPacketCount", String(state.acceptedPacketCount));
    setDataset("hearthHexSurfaceRejectedPacketCount", String(state.rejectedPacketCount));
    setDataset("hearthHexSurfaceInteractiveFrameCount", String(state.interactiveFrameCount));
    setDataset("hearthHexSurfacePairFrameCount", String(state.pairFrameCount));
    setDataset("hearthHexSurfaceTransmissionCount", String(state.transmissionCount));
    setDataset("hearthHexSurfaceDeliveryCount", String(state.deliveryCount));

    setDataset("hearthHexSurfaceFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthHexSurfaceRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthHexSurfaceRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthHexSurfacePostgameStatus", state.postgameStatus);

    setDataset("hearthHexSurfaceCanvasLifecycleCallsSuppressed", "true");
    setDataset("hearthHexSurfaceFingerInternalsNotInspected", "true");
    setDataset("hearthHexSurfaceOwnsCanvasDrawing", "false");
    setDataset("hearthHexSurfaceOwnsCanvasCreation", "false");
    setDataset("hearthHexSurfaceOwnsPointerFingerTruth", "false");

    setDataset("hearthHexSurfaceF13Claimed", "false");
    setDataset("hearthHexSurfaceF21EligibleForNorth", "false");
    setDataset("hearthHexSurfaceF21Claimed", "false");
    setDataset("hearthHexSurfaceReadyTextAllowed", "false");
    setDataset("hearthHexSurfaceReadyTextClaimed", "false");
    setDataset("hearthHexSurfaceVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");

    root.HEARTH_HEX_SURFACE_DIAGNOSTIC_FIELDS = clonePlain(fields);
    if (root.HEARTH && typeof root.HEARTH === "object") {
      root.HEARTH.hexSurfaceDiagnosticFields = clonePlain(fields);
    }
  }

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of HEX_SURFACE_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();

    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_HEX_SURFACE_RECEIPT = receipt;
    root.HEARTH_HEX_SURFACE_RENDERER_RECEIPT = receipt;
    root.HEARTH_HEX_SURFACE_AUTHORITY_RECEIPT = receipt;
    root.HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_RECEIPT = receipt;
    root.HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT = receipt;
    root.HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_RECEIPT_v4_3 = receipt;

    hearth.hexSurfaceReceipt = receipt;
    hearth.hexSurfaceRendererReceipt = receipt;
    hearth.hexSurfaceAuthorityReceipt = receipt;
    hearth.hexSurfaceInteractiveSpherePairRendererReceipt = receipt;
    hearth.hexSurfaceCanvasGatePointerFingerTransmissionReceipt = receipt;

    lab.hearthHexSurfaceReceipt = receipt;
    lab.hearthHexSurfaceRendererReceipt = receipt;
    lab.hearthHexSurfaceAuthorityReceipt = receipt;
    lab.hearthHexSurfaceInteractiveSpherePairRendererReceipt = receipt;
    lab.hearthHexSurfaceCanvasGatePointerFingerTransmissionReceipt = receipt;

    root.HEARTH_HEX_SURFACE_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);
    hearth.hexSurfaceDiagnosticFields = clonePlain(receipt.diagnosticFields);

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    if (reason !== "packet-frame") {
      record("HEARTH_HEX_SURFACE_GLOBALS_PUBLISHED", {
        reason,
        contract: CONTRACT,
        internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
        hexAuthorityObserved: state.hexAuthorityObserved,
        hexAuthorityRecognized: state.hexAuthorityRecognized,
        canvasObserved: state.canvasObserved,
        pointerFingerObservedCount: state.pointerFingerObservedCount,
        pointerFingerActiveCount: state.pointerFingerActiveCount,
        acceptedPacketCount: state.acceptedPacketCount,
        transmissionCount: state.transmissionCount,
        visualPassClaimed: false
      });
    }

    return true;
  }

  function boot() {
    if (bootPromise) return bootPromise;

    bootPromise = Promise.resolve().then(() => {
      if (state.booted || state.booting) return getReceipt();

      state.booting = true;
      state.startedAt = nowIso();
      state.updatedAt = state.startedAt;
      state.postgameStatus = "HEX_SURFACE_BOOTING_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_V4_3";

      publishGlobals("boot-early");
      refresh();

      state.booted = true;
      state.booting = false;

      record("HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION_V4_3_BOOTED", {
        contract: CONTRACT,
        file: FILE,
        hexAuthorityObserved: state.hexAuthorityObserved,
        hexAuthorityRecognized: state.hexAuthorityRecognized,
        canvasObserved: state.canvasObserved,
        pointerFingerObservedCount: state.pointerFingerObservedCount,
        pointerFingerActiveCount: state.pointerFingerActiveCount,
        canvasLifecycleCallsSuppressed: true,
        fingerInternalsNotInspected: true,
        visualPassClaimed: false
      });

      publishGlobals("boot-complete");

      return getReceipt();
    });

    return bootPromise;
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.postgameStatus = "HEX_SURFACE_DISPOSED";
    state.recommendedNextAction = "REBOOT_HEX_SURFACE_IF_TRANSMISSION_REQUIRED";

    record("HEARTH_HEX_SURFACE_DISPOSED", { reason });
    updateDataset();
    publishGlobals("dispose");

    return getReceipt();
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    canvasFile: CANVAS_FILE,
    controlFile: CONTROL_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
    pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
    pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
    pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    expectedCanvasContract: EXPECTED_CANVAS_CONTRACT,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,
    acceptedCanvasContracts: ACCEPTED_CANVAS_CONTRACTS.slice(),
    acceptedControlContracts: ACCEPTED_CONTROL_CONTRACTS.slice(),

    hexSurfacePacket: HEX_SURFACE_PACKET,
    pointerFingerPacket: POINTER_FINGER_PACKET,
    interactiveFramePacket: INTERACTIVE_FRAME_PACKET,
    pairFramePacket: PAIR_FRAME_PACKET,

    boot,
    start: boot,
    init: boot,
    run: boot,
    refresh,
    dispose,

    readHexAuthority,
    readCanvasAuthority,
    readControlAuthority,
    readPointerFingerAuthorities,

    receiveCanvasHexGatePacket,
    consumeCanvasHexGatePacket,
    acceptCanvasHexGatePacket,
    receiveCanvasViewPacket,
    consumeCanvasViewPacket,
    receiveInteractiveFramePacket,
    drawInteractiveFrame,
    drawPairFrame,

    receivePlanetaryViewControlPacket,
    consumePlanetaryViewControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,

    composeHexFramePacket,
    composePointerFingerTransmissionPacket,
    deliverPointerFingerTransmission,
    validateIncomingPacket,
    normalizeViewState,

    getReceipt,
    getReceiptLight,
    getHexSurfaceReceipt: getReceiptLight,
    getHexReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getReceiptText,
    getStatusText,
    getState,
    composeReceiptText,
    composeDiagnosticFields,

    publishGlobals,
    publishAliasPaths,
    publishReceiptAliases,
    publishTransmissionGlobals,
    updateDataset,

    supportsCanvasHexGatePacket: true,
    supportsCanvasViewPacket: true,
    supportsInteractiveFramePacket: true,
    supportsDrawInteractiveFrame: true,
    supportsDrawPairFrame: true,
    supportsPointerFingerTransmission: true,
    supportsSurfaceBoundaryInspectLightFingerPath: true,
    supportsHexFourPairAuthorityConsumption: true,

    hexSurfaceGateActive: true,
    canvasGateReceiverActive: true,
    pointerFingerTransmissionActive: true,
    pairedInteractiveSphereRendererActive: true,
    canvasLifecycleCallsSuppressed: true,
    controlsLifecycleCallsSuppressed: true,
    fingerInternalsNotInspected: true,
    packetPhasePreservedFromControls: true,
    packetPhaseFixedAtZeroWhenAbsent: true,

    ownsHexSurfaceGate: true,
    ownsHexSurfaceReceiptPublication: true,
    ownsPairedInteractiveSpherePacketComposition: true,
    ownsPointerFingerTransmissionPacketComposition: true,

    ownsCanvasDrawing: false,
    ownsCanvasCreation: false,
    ownsCanvasLifecycle: false,
    ownsCanvasExpressionTruth: false,
    ownsCanvasFingerTruth: false,
    ownsPointerFingerTruth: false,
    ownsHexAuthorityTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    publishGlobals("immediate-publication");

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
    recordError("HEARTH_HEX_SURFACE_V4_3_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
