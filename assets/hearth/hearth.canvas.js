// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal controlled renewal:
// HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4
// Full-file replacement.
// Canvas Hub / live visible 2D surface identity unification only.
// Purpose:
// - Preserve the public v12_3 Canvas Hub contract expected by route, diagnostics, controls, Hex Surface, and receipts.
// - Renew the internal implementation so the visible canvas and expression canvas resolve to the same live 2D output surface.
// - Ensure every Hearth canvas candidate inside the Hearth mount carries visible nonblank 2D pixels.
// - Mark the same rendered surface with both data-hearth-visible-canvas="true" and data-hearth-expression-surface="true".
// - Keep Canvas as receiver/output carrier only.
// - Receive route/control/view packets and render a live 2D carrier surface without claiming terrain, hydrology, elevation, material, or final visual truth.
// - Forward lawful Canvas Hex Gate packets to /assets/hearth/hearth.hex.surface.js through public APIs only.
// - Preserve controls as the input authority and Hex Surface as the Hex gate toward downstream pointer/finger instruments.
// - Do not mutate HTML contract, route conductor ownership, control ownership, diagnostic chronology, source truth, or North readiness.
// - Do not claim F13, F21, ready text, final completion, final visual pass, generated image, GraphicBox, or WebGL.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const PUBLIC_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const PUBLIC_RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_TNT_v12_4";
  const INTERNAL_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_v12_4";

  const PREVIOUS_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const PREVIOUS_IMPLEMENTATION_RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIPT_v12_3";

  const LINEAGE_IMPLEMENTATION_CONTRACT =
    "HEARTH_CANVAS_HUB_RAF_SPHERE_ROTATION_PAIR_RECEIVER_TNT_v12_3_2";

  const VERSION =
    "2026-06-06.hearth-canvas-live-surface-identity-unified-visible-2d-output-v12-4";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const INDEX_FILE = "/showroom/globe/hearth/index.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const POINTER_FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const POINTER_FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const POINTER_FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const POINTER_FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const EXPECTED_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const EXPECTED_HEX_SURFACE_CONTRACT =
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER_TNT_v4";
  const EXPECTED_HEX_AUTHORITY_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const CANVAS_HEX_GATE_PACKET =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_CANVAS_HEX_GATE_PACKET_v12_4";
  const CANVAS_VIEW_PACKET =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_VIEW_PACKET_v12_4";
  const CANVAS_RENDER_PACKET =
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_VISIBLE_2D_RENDER_PACKET_v12_4";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByCanvas: false,
    f13EligibleForCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21ClaimedByDiagnosticRail: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    controlReadyClaimed: false,
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
    F13_CANVAS_CLAIMED: false,
    F21_ELIGIBLE_FOR_NORTH: false,
    F21_CLAIMED: false,
    F21_CLAIMED_BY_CANVAS: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_AUTHORITY",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_GATE_POINTER_FINGER_TRANSMISSION",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "HEARTH.hexSurfaceAuthority",
    "HEARTH.hexSurfaceInteractiveSpherePairRenderer",
    "HEARTH.hexSurfaceCanvasGatePointerFingerTransmission",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurfaceAuthority",
    "DEXTER_LAB.hearthHexSurfaceInteractiveSpherePairRenderer",
    "DEXTER_LAB.hearthHexSurfaceCanvasGatePointerFingerTransmission"
  ]);

  const CONTROL_ALIASES = Object.freeze([
    "HEARTH_CONTROLS",
    "HEARTH_PLANETARY_CONTROLS",
    "HEARTH_CONTROL_AUTHORITY",
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE",
    "HEARTH.controls",
    "HEARTH.planetaryControls",
    "HEARTH.controlAuthority",
    "HEARTH.controlsPlanetaryViewInputHandshake",
    "DEXTER_LAB.hearthControls",
    "DEXTER_LAB.hearthPlanetaryControls"
  ]);

  const CANVAS_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_LOCAL_STATION",
    "HEARTH_CANVAS_EXPRESSION_HUB",
    "HEARTH_CANVAS_VISIBLE_PLANET",
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER",
    "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasLocalStation",
    "HEARTH.canvasExpressionHub",
    "HEARTH.canvasVisiblePlanet",
    "HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver",
    "HEARTH.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutput",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasParent",
    "DEXTER_LAB.hearthCanvasAuthority",
    "DEXTER_LAB.hearthCanvasExpressionHub",
    "DEXTER_LAB.hearthCanvasVisiblePlanet",
    "DEXTER_LAB.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiver",
    "DEXTER_LAB.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutput"
  ]);

  const state = {
    contract: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    booted: false,
    booting: false,
    mounted: false,
    started: false,
    disposed: false,

    mountSelector: "#hearthCanvasMount",
    stageSelector: "#hearthGlobeStage",
    primaryCanvasSelector: "NONE",
    primaryCanvasId: "NONE",
    surfaceIdentityUnified: false,
    visibleCanvasAttributeApplied: false,
    expressionSurfaceAttributeApplied: false,

    canvasElementFound: false,
    canvasElementCount: 0,
    canvasCreatedByCanvasHub: false,
    canvasContext2dReady: false,
    canvasRectNonzero: false,
    canvasComputedVisible: false,
    canvasViewportIntersecting: false,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasCssWidth: 0,
    canvasCssHeight: 0,
    devicePixelRatio: 1,

    drawLoopActive: false,
    rafId: 0,
    frameCount: 0,
    drawCount: 0,
    receivePacketCount: 0,
    acceptedPacketCount: 0,
    rejectedPacketCount: 0,
    controlPacketCount: 0,
    viewPacketCount: 0,
    hexGatePacketCount: 0,
    hexGateDeliveryCount: 0,
    surfaceUnificationCount: 0,
    resizeCount: 0,
    receiptPublishCount: 0,
    aliasPublishCount: 0,
    eventCount: 0,
    errorCount: 0,

    viewState: {
      yaw: 0.48,
      pitch: -0.08,
      zoom: 1,
      phase: 0,
      minPitch: -1.25,
      maxPitch: 1.25,
      minZoom: 0.55,
      maxZoom: 2.4
    },

    lastPacketType: "NONE",
    lastPacketSource: "NONE",
    lastInputType: "NONE",
    lastRejectedReason: "",
    lastValidationStatus: "WAITING_PACKET",
    lastDrawReason: "NOT_DRAWN",
    lastDrawAt: "",
    lastMountedAt: "",
    startedAt: "",
    updatedAt: "",
    latestEvent: "HEARTH_CANVAS_HUB_V12_4_LOADED",

    pixelSampleStatus: "NOT_SAMPLED",
    pixelVisible: false,
    visiblePixelCount: 0,
    alphaPixelCount: 0,
    uniqueColorCount: 0,
    pixelSampleReason: "NOT_SAMPLED",

    hexSurfaceObserved: false,
    hexSurfaceSource: "NONE",
    hexSurfaceContract: "UNKNOWN",
    hexSurfaceReceipt: "UNKNOWN",
    hexSurfaceReceiverMethod: "NONE",
    hexSurfaceDeliveryStatus: "WAITING_CANVAS_HEX_GATE_PACKET",

    controlObserved: false,
    controlSource: "NONE",
    controlContract: "UNKNOWN",
    controlReceipt: "UNKNOWN",

    postgameStatus: "CANVAS_HUB_LOADED_WAITING_BOOT",
    firstFailedCoordinate: "WAITING_BOOT",
    recommendedNextOwner: "CANVAS_HUB",
    recommendedNextFile: FILE,
    recommendedNextAction: "BOOT_CANVAS_HUB_AND_DRAW_VISIBLE_2D_SURFACE",

    events: [],
    errors: [],
    surfaces: [],

    ...NO_CLAIMS
  };

  const api = {};

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
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, safeNumber(value, min)));
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

  function line(key, value) {
    return `${key}=${value === undefined || value === null ? "" : String(value)}`;
  }

  function trimLog(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "HEARTH_CANVAS_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trimLog(state.events, 180);
    state.eventCount = state.events.length;
    state.latestEvent = item.event;
    state.updatedAt = item.at;

    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "HEARTH_CANVAS_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trimLog(state.errors, 120);
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
      if (value && (isObject(value) || isFunction(value))) return { name, value };
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
    if (!authority || (!isObject(authority) && !isFunction(authority)) || authority === api) return null;

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
    if (isObject(authority.hexSurfaceReceipt)) return authority.hexSurfaceReceipt;
    if (isObject(authority.pointerFingerReceipt)) return authority.pointerFingerReceipt;

    if (
      authority.contract ||
      authority.CONTRACT ||
      authority.receipt ||
      authority.RECEIPT ||
      authority.version
    ) {
      return authority;
    }

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
    state.controlSource = found.name;
    state.controlContract = contract || "UNKNOWN";
    state.controlReceipt = receiptName || "UNKNOWN";

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN"
    };
  }

  function readHexSurfaceAuthority() {
    const found = firstGlobal(HEX_SURFACE_ALIASES);
    const receipt = readAuthorityReceipt(found.value) || {};
    const ds = dataset();

    const contract = firstNonEmpty(
      contractOf(receipt),
      found.value && found.value.contract,
      found.value && found.value.CONTRACT,
      ds.hearthHexSurfaceContract,
      ds.hearthHexSurfaceRendererContract
    );

    const receiptName = firstNonEmpty(
      receiptOf(receipt),
      found.value && found.value.receipt,
      found.value && found.value.RECEIPT,
      ds.hearthHexSurfaceReceipt,
      ds.hearthHexSurfaceRendererReceipt
    );

    state.hexSurfaceObserved = Boolean(found.value || contract);
    state.hexSurfaceSource = found.name;
    state.hexSurfaceContract = contract || "UNKNOWN";
    state.hexSurfaceReceipt = receiptName || "UNKNOWN";
    state.hexSurfaceReceiverMethod = resolveHexSurfaceReceiver(found.value) || "NONE";

    return {
      name: found.name,
      authority: found.value,
      receipt,
      contract: contract || "UNKNOWN",
      receiptName: receiptName || "UNKNOWN",
      method: state.hexSurfaceReceiverMethod
    };
  }

  function resolveHexSurfaceReceiver(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return "";

    const methods = [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "consumeCanvasViewPacket",
      "receiveInteractiveFramePacket",
      "drawInteractiveFrame",
      "drawPairFrame",
      "receivePlanetaryViewControlPacket",
      "receiveViewControlPacket"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "";
  }

  function safeQuery(selector, base = doc) {
    if (!base || !isFunction(base.querySelector)) return null;

    try {
      return base.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function safeQueryAll(selector, base = doc) {
    if (!base || !isFunction(base.querySelectorAll)) return [];

    try {
      return Array.from(base.querySelectorAll(selector));
    } catch (_error) {
      return [];
    }
  }

  function isCanvas(node) {
    return Boolean(node && safeString(node.tagName).toLowerCase() === "canvas");
  }

  function uniqueNodes(nodes) {
    const seen = new Set();
    const out = [];

    for (const node of nodes || []) {
      if (!node || seen.has(node)) continue;
      seen.add(node);
      out.push(node);
    }

    return out;
  }

  function getMount() {
    if (!doc) return null;

    return (
      safeQuery("#hearthCanvasMount") ||
      safeQuery("[data-hearth-canvas-mount='true']") ||
      safeQuery("[data-hearth-visible-planet-mount='true']") ||
      safeQuery("[data-hearth-planet-engine-mount='true']")
    );
  }

  function getStage() {
    if (!doc) return null;

    return (
      safeQuery("#hearthGlobeStage") ||
      safeQuery("[data-hearth-globe-stage='true']") ||
      safeQuery("[data-hearth-planet-engine-stage='true']")
    );
  }

  function collectCanvasCandidates() {
    const mount = getMount();
    const candidates = [];

    if (mount) {
      candidates.push(...safeQueryAll("canvas", mount));
    }

    candidates.push(...safeQueryAll("canvas[data-hearth-visible-canvas='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-expression-surface='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-canvas='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-canvas-texture='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-planet-canvas='true']"));
    candidates.push(...safeQueryAll("canvas[data-hearth-canvas-hub='true']"));

    return uniqueNodes(candidates).filter(isCanvas);
  }

  function createCanvasInMount() {
    const mount = getMount();
    if (!mount || !doc || !isFunction(doc.createElement)) return null;

    const canvas = doc.createElement("canvas");
    canvas.id = "hearthVisibleExpressionCanvas";
    canvas.setAttribute("aria-label", "Hearth visible 2D expression canvas");
    mount.appendChild(canvas);

    state.canvasCreatedByCanvasHub = true;

    record("HEARTH_CANVAS_SURFACE_CREATED_IN_EXISTING_MOUNT", {
      mountSelector: "#hearthCanvasMount",
      canvasId: canvas.id,
      htmlContractMutated: false
    });

    return canvas;
  }

  function markCanvasIdentity(canvas, index = 0) {
    if (!canvas || !canvas.dataset) return;

    canvas.dataset.hearthVisibleCanvas = "true";
    canvas.dataset.hearthExpressionSurface = "true";
    canvas.dataset.hearthCanvas = "true";
    canvas.dataset.hearthCanvasHub = "true";
    canvas.dataset.hearthCanvasTexture = "true";
    canvas.dataset.hearthPlanetCanvas = "true";
    canvas.dataset.hearthCanvasContract = PUBLIC_CONTRACT;
    canvas.dataset.hearthCanvasReceipt = PUBLIC_RECEIPT;
    canvas.dataset.hearthCanvasInternalImplementationContract = INTERNAL_IMPLEMENTATION_CONTRACT;
    canvas.dataset.hearthCanvasInternalImplementationReceipt = INTERNAL_IMPLEMENTATION_RECEIPT;
    canvas.dataset.hearthCanvasSurfaceIdentityUnified = "true";
    canvas.dataset.hearthCanvasVisible2dOutputActive = "true";
    canvas.dataset.hearthCanvasGeneratedImage = "false";
    canvas.dataset.generatedImage = "false";
    canvas.dataset.graphicBox = "false";
    canvas.dataset.webgl = "false";
    canvas.dataset.visualPassClaimed = "false";
    canvas.dataset.hearthCanvasSurfaceIndex = String(index);

    if (!canvas.id) {
      canvas.id = index === 0 ? "hearthVisibleExpressionCanvas" : `hearthVisibleExpressionCanvas${index + 1}`;
    }

    try {
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-texture", "true");
      canvas.setAttribute("data-hearth-planet-canvas", "true");
      canvas.setAttribute("data-generated-image", "false");
      canvas.setAttribute("data-graphic-box", "false");
      canvas.setAttribute("data-webgl", "false");
      canvas.setAttribute("data-visual-pass-claimed", "false");
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Hearth live 2D planet carrier surface");
    } catch (_error) {}

    state.visibleCanvasAttributeApplied = true;
    state.expressionSurfaceAttributeApplied = true;
  }

  function applyCanvasStyle(canvas, cssSize) {
    if (!canvas || !canvas.style) return;

    const sizeText = `${Math.max(1, Math.round(cssSize))}px`;

    try {
      canvas.style.setProperty("display", "block", "important");
      canvas.style.setProperty("box-sizing", "border-box", "important");
      canvas.style.setProperty("width", sizeText, "important");
      canvas.style.setProperty("height", sizeText, "important");
      canvas.style.setProperty("min-width", "238px", "important");
      canvas.style.setProperty("min-height", "238px", "important");
      canvas.style.setProperty("max-width", "100%", "important");
      canvas.style.setProperty("max-height", "calc(100svh - 144px)", "important");
      canvas.style.setProperty("aspect-ratio", "1 / 1", "important");
      canvas.style.setProperty("object-fit", "contain", "important");
      canvas.style.setProperty("margin", "auto", "important");
      canvas.style.setProperty("border-radius", "50%", "important");
      canvas.style.setProperty("opacity", "1", "important");
      canvas.style.setProperty("visibility", "visible", "important");
      canvas.style.setProperty("pointer-events", "auto", "important");
      canvas.style.setProperty("touch-action", "none", "important");
      canvas.style.setProperty("user-select", "none", "important");
      canvas.style.setProperty("-webkit-user-select", "none", "important");
      canvas.style.setProperty("background", "transparent", "important");
    } catch (_error) {}
  }

  function measureAvailableSize(canvas) {
    const mount = getMount();
    const stage = getStage();
    const viewportW = root.innerWidth || 720;
    const viewportH = root.innerHeight || 720;

    let mountRect = null;
    let stageRect = null;
    let canvasRect = null;

    try {
      mountRect = mount && isFunction(mount.getBoundingClientRect) ? mount.getBoundingClientRect() : null;
    } catch (_error) {
      mountRect = null;
    }

    try {
      stageRect = stage && isFunction(stage.getBoundingClientRect) ? stage.getBoundingClientRect() : null;
    } catch (_error) {
      stageRect = null;
    }

    try {
      canvasRect = canvas && isFunction(canvas.getBoundingClientRect) ? canvas.getBoundingClientRect() : null;
    } catch (_error) {
      canvasRect = null;
    }

    const canvasRectSize = canvasRect ? Math.min(canvasRect.width || 0, canvasRect.height || 0) : 0;
    const mountSize = mountRect ? Math.min(mountRect.width || 0, mountRect.height || 0) : 0;
    const stageSize = stageRect ? Math.min(stageRect.width || 0, stageRect.height || 0) : 0;
    const viewportSize = Math.min(viewportW, viewportH);

    const candidate = firstDefined(
      canvasRectSize > 32 ? canvasRectSize : undefined,
      mountSize > 32 ? mountSize : undefined,
      stageSize > 32 ? Math.max(238, stageSize - 112) : undefined,
      Math.max(238, Math.min(860, viewportSize * 0.78))
    );

    return clamp(candidate, 238, Math.min(920, Math.max(238, viewportSize * 0.92)));
  }

  function prepareCanvas(canvas, index = 0) {
    if (!canvas || !isCanvas(canvas)) return null;

    markCanvasIdentity(canvas, index);

    const cssSize = measureAvailableSize(canvas);
    applyCanvasStyle(canvas, cssSize);

    const dpr = clamp(root.devicePixelRatio || 1, 1, 2);
    const width = Math.max(238, Math.round(cssSize * dpr));
    const height = width;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      state.resizeCount += 1;
    }

    let ctx = null;
    let ctxStatus = "CANVAS_CONTEXT_2D_NOT_READY";

    try {
      ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      ctxStatus = ctx ? "CANVAS_CONTEXT_2D_READY" : "CANVAS_CONTEXT_2D_NULL";
    } catch (_error) {
      try {
        ctx = canvas.getContext("2d");
        ctxStatus = ctx ? "CANVAS_CONTEXT_2D_READY_FALLBACK" : "CANVAS_CONTEXT_2D_NULL";
      } catch (error) {
        recordError("HEARTH_CANVAS_CONTEXT_2D_FAILED", error, { canvasId: canvas.id || "NONE" });
        ctx = null;
        ctxStatus = "CANVAS_CONTEXT_2D_ERROR";
      }
    }

    return {
      canvas,
      ctx,
      ctxStatus,
      cssSize,
      width,
      height,
      dpr,
      id: canvas.id || "NONE",
      selector: canvas.dataset && canvas.dataset.hearthExpressionSurface === "true"
        ? "canvas[data-hearth-expression-surface='true']"
        : "canvas[data-hearth-visible-canvas='true']"
    };
  }

  function unifySurfaceIdentity(reason = "surface-unification") {
    let canvases = collectCanvasCandidates();

    if (!canvases.length) {
      const created = createCanvasInMount();
      if (created) canvases = [created];
    }

    const prepared = canvases
      .map((canvas, index) => prepareCanvas(canvas, index))
      .filter((entry) => entry && entry.canvas && entry.ctx);

    state.surfaces = prepared.map((entry, index) => ({
      index,
      id: entry.id,
      selector: entry.selector,
      width: entry.width,
      height: entry.height,
      cssSize: entry.cssSize,
      ctxStatus: entry.ctxStatus,
      visibleCanvas: true,
      expressionSurface: true
    }));

    state.canvasElementFound = prepared.length > 0;
    state.canvasElementCount = prepared.length;
    state.canvasContext2dReady = prepared.length > 0;
    state.surfaceIdentityUnified = prepared.length > 0;
    state.canvasWidth = prepared[0] ? prepared[0].width : 0;
    state.canvasHeight = prepared[0] ? prepared[0].height : 0;
    state.canvasCssWidth = prepared[0] ? prepared[0].cssSize : 0;
    state.canvasCssHeight = prepared[0] ? prepared[0].cssSize : 0;
    state.devicePixelRatio = prepared[0] ? prepared[0].dpr : 1;
    state.primaryCanvasId = prepared[0] ? prepared[0].id : "NONE";
    state.primaryCanvasSelector = prepared[0] ? "canvas[data-hearth-expression-surface='true']" : "NONE";
    state.surfaceUnificationCount += 1;

    inspectPrimaryCanvasGeometry(prepared[0] ? prepared[0].canvas : null);

    if (!prepared.length) {
      state.firstFailedCoordinate = "CANVAS_SURFACE_NOT_AVAILABLE";
      state.recommendedNextOwner = "HTML_MOUNT_OR_ROUTE_CONDUCTOR";
      state.recommendedNextFile = ROUTE;
      state.recommendedNextAction = "VERIFY_HEARTH_CANVAS_MOUNT_EXISTS_BEFORE_CANVAS_BOOT";
      state.postgameStatus = "CANVAS_HUB_NO_RENDERABLE_SURFACE";
    }

    record("HEARTH_CANVAS_SURFACE_IDENTITY_UNIFIED", {
      reason,
      canvasElementCount: prepared.length,
      primaryCanvasId: state.primaryCanvasId,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied
    });

    return prepared;
  }

  function inspectPrimaryCanvasGeometry(canvas) {
    if (!canvas) {
      state.canvasRectNonzero = false;
      state.canvasComputedVisible = false;
      state.canvasViewportIntersecting = false;
      return;
    }

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

    const width = rect ? Number(rect.width || 0) : 0;
    const height = rect ? Number(rect.height || 0) : 0;
    const rectNonzero = width > 0 && height > 0;

    state.canvasRectNonzero = rectNonzero;
    state.canvasComputedVisible =
      rectNonzero &&
      (!style ||
        (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || 1) !== 0
        ));

    state.canvasViewportIntersecting =
      rectNonzero &&
      rect.left < (root.innerWidth || 0) &&
      rect.right > 0 &&
      rect.top < (root.innerHeight || 0) &&
      rect.bottom > 0;
  }

  function applyViewPacket(packet = {}, options = {}) {
    const source = isObject(packet.viewState) ? packet.viewState : packet;
    const current = state.viewState;

    const incomingYaw = firstDefined(source.yaw, packet.yaw);
    const incomingPitch = firstDefined(source.pitch, packet.pitch);
    const incomingZoom = firstDefined(source.zoom, packet.zoom);
    const incomingPhase = firstDefined(source.phase, packet.phase);

    const deltaYaw = safeNumber(firstDefined(packet.deltaYaw, source.deltaYaw), 0);
    const deltaPitch = safeNumber(firstDefined(packet.deltaPitch, source.deltaPitch), 0);
    const deltaZoom = safeNumber(firstDefined(packet.deltaZoom, source.deltaZoom), 0);

    const yaw = incomingYaw !== undefined
      ? safeNumber(incomingYaw, current.yaw)
      : current.yaw + deltaYaw;

    const pitch = incomingPitch !== undefined
      ? safeNumber(incomingPitch, current.pitch)
      : current.pitch + deltaPitch;

    const zoom = incomingZoom !== undefined
      ? safeNumber(incomingZoom, current.zoom)
      : current.zoom + deltaZoom;

    const phase = incomingPhase !== undefined
      ? safeNumber(incomingPhase, current.phase)
      : current.phase;

    state.viewState = {
      yaw,
      pitch: clamp(pitch, -1.25, 1.25),
      zoom: clamp(zoom, 0.55, 2.4),
      phase,
      minPitch: safeNumber(source.minPitch, current.minPitch),
      maxPitch: safeNumber(source.maxPitch, current.maxPitch),
      minZoom: safeNumber(source.minZoom, current.minZoom),
      maxZoom: safeNumber(source.maxZoom, current.maxZoom)
    };

    state.lastInputType = safeString(packet.inputType || options.inputType || "view-packet");
    state.lastPacketType = safeString(packet.packetType || packet.type || CANVAS_VIEW_PACKET);
    state.lastPacketSource = safeString(
      packet.sourceFile ||
      packet.fromFile ||
      packet.sourceAuthority ||
      packet.sourceRole ||
      options.source ||
      "UNKNOWN"
    );

    return clonePlain(state.viewState);
  }

  function validateIncomingPacket(packet, options = {}) {
    if (packet === undefined || packet === null) {
      return { accepted: true, reason: "EMPTY_PACKET_ACCEPTED_AS_DRAW_REQUEST" };
    }

    if (!isObject(packet)) {
      return { accepted: false, reason: "PACKET_NOT_OBJECT" };
    }

    if (
      packet.f13Claimed === true ||
      packet.f13CanvasClaimed === true ||
      packet.f13ClaimedByCanvas === true ||
      packet.f21EligibleForNorth === true ||
      packet.f21Claimed === true ||
      packet.f21ClaimedByCanvas === true ||
      packet.f21SubmittedToNorth === true ||
      packet.readyTextClaimed === true ||
      packet.visualPassClaimed === true ||
      packet.finalVisualPassClaimed === true ||
      packet.generatedImage === true ||
      packet.graphicBox === true ||
      packet.webGL === true ||
      packet.webgl === true
    ) {
      return { accepted: false, reason: "PACKET_CONTAINS_FORBIDDEN_FINAL_CLAIM" };
    }

    if (packet.canvasDrawingAuthorized === false && options.allowDrawingRequest !== true) {
      return { accepted: false, reason: "PACKET_EXPLICITLY_DENIES_CANVAS_DRAWING" };
    }

    return { accepted: true, reason: "PACKET_ACCEPTED_BY_CANVAS_HUB" };
  }

  function receivePacket(packet = {}, options = {}) {
    state.receivePacketCount += 1;

    const validation = validateIncomingPacket(packet, options);
    if (!validation.accepted) {
      state.rejectedPacketCount += 1;
      state.lastRejectedReason = validation.reason;
      state.lastValidationStatus = "REJECTED";
      state.firstFailedCoordinate = validation.reason;
      state.recommendedNextOwner = "UPSTREAM_PACKET_AUTHORITY";
      state.recommendedNextFile = safeString(packet && packet.sourceFile, CONTROL_FILE);
      state.recommendedNextAction = "SEND_CANVAS_PACKET_WITHOUT_FORBIDDEN_FINAL_CLAIMS";
      state.postgameStatus = "CANVAS_PACKET_REJECTED";

      record("HEARTH_CANVAS_PACKET_REJECTED", {
        reason: validation.reason,
        packetType: packet && packet.packetType
      });

      updateDataset();
      publishReceiptAliases();

      return getReceiptLight(false);
    }

    state.acceptedPacketCount += 1;
    state.lastRejectedReason = "";
    state.lastValidationStatus = "ACCEPTED";

    applyViewPacket(packet || {}, options);

    if (options.controlPacket === true) state.controlPacketCount += 1;
    if (options.viewPacket === true) state.viewPacketCount += 1;

    drawFrame(options.reason || "receive-packet");
    sendHexGatePacket("receive-packet");

    updateDataset();
    publishReceiptAliases();

    return {
      ...getReceiptLight(false),
      renderPacket: composeRenderPacket("receive-packet"),
      hexGatePacket: composeCanvasHexGatePacket("receive-packet")
    };
  }

  function drawFrame(reason = "draw-frame") {
    const prepared = unifySurfaceIdentity(reason);

    if (!prepared.length) {
      updateDataset();
      publishReceiptAliases();
      return getReceiptLight(false);
    }

    for (const surface of prepared) {
      drawVisibleSurface(surface.ctx, surface.width, surface.height, reason);
    }

    state.frameCount += 1;
    state.drawCount += prepared.length;
    state.lastDrawReason = reason;
    state.lastDrawAt = nowIso();
    state.updatedAt = state.lastDrawAt;

    inspectPixelSample(prepared[0].canvas, prepared[0].ctx);

    state.firstFailedCoordinate = state.pixelVisible ? "NONE" : "CANVAS_PIXEL_VISIBLE";
    state.recommendedNextOwner = state.pixelVisible ? "TEACHER_REVIEW" : "CANVAS_DRAWING_OR_DOWNSTREAM_EXPRESSION_ADAPTER";
    state.recommendedNextFile = state.pixelVisible ? FILE : FILE;
    state.recommendedNextAction = state.pixelVisible
      ? "REVIEW_CANVAS_SURFACE_TRUTH_CONFIRMED_WITHOUT_READY_OR_VISUAL_PASS_CLAIM"
      : "VERIFY_CANVAS_DRAW_PATH_WRITES_VISIBLE_2D_PIXELS";
    state.postgameStatus = state.pixelVisible
      ? "CANVAS_SURFACE_TRUTH_VISIBLE_2D_PIXEL_OUTPUT_CONFIRMED_NO_FINAL_CLAIM"
      : "CANVAS_SURFACE_DRAW_ATTEMPTED_PIXEL_SAMPLE_NOT_VISIBLE";

    updateDataset();
    publishRenderGlobals(reason);
    publishReceiptAliases();

    return getReceiptLight(false);
  }

  function drawVisibleSurface(ctx, width, height, reason) {
    if (!ctx || width <= 0 || height <= 0) return;

    const w = width;
    const h = height;
    const cx = w / 2;
    const cy = h / 2;
    const min = Math.min(w, h);
    const view = state.viewState;
    const zoom = clamp(view.zoom, 0.55, 2.4);
    const radius = min * 0.43 * clamp(zoom, 0.72, 1.12);

    if (isFunction(ctx.resetTransform)) {
      try {
        ctx.resetTransform();
      } catch (_error) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(cx * 0.55, cy * 0.36, min * 0.05, cx, cy, min * 0.72);
    bg.addColorStop(0, "rgba(16,45,78,1)");
    bg.addColorStop(0.42, "rgba(4,12,29,1)");
    bg.addColorStop(1, "rgba(1,4,12,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    drawStarField(ctx, w, h, state.frameCount);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.42, radius * 0.08, cx, cy, radius);
    ocean.addColorStop(0, "rgba(87,184,221,1)");
    ocean.addColorStop(0.32, "rgba(23,91,151,1)");
    ocean.addColorStop(0.70, "rgba(8,42,93,1)");
    ocean.addColorStop(1, "rgba(2,16,46,1)");
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    drawLatitudeLongitudeBands(ctx, cx, cy, radius, view);
    drawContinents(ctx, cx, cy, radius, view);
    drawAncientCoastTraces(ctx, cx, cy, radius, view);

    const shade = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    shade.addColorStop(0, "rgba(255,255,255,.18)");
    shade.addColorStop(0.38, "rgba(255,255,255,.02)");
    shade.addColorStop(0.66, "rgba(0,0,0,.10)");
    shade.addColorStop(1, "rgba(0,0,0,.42)");
    ctx.fillStyle = shade;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.restore();

    drawAtmosphere(ctx, cx, cy, radius);
    drawReceiptNeedle(ctx, cx, cy, radius, reason);

    ctx.fillStyle = "rgba(243,201,111,.92)";
    ctx.font = `${Math.max(10, Math.round(min * 0.018))}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HEARTH", cx, cy + radius + Math.max(14, min * 0.034));

    state.viewState.phase += 0.003;
  }

  function drawStarField(ctx, w, h, frame) {
    ctx.save();
    ctx.globalAlpha = 0.42;

    const count = 70;
    for (let i = 0; i < count; i += 1) {
      const x = pseudo(i * 17.13) * w;
      const y = pseudo(i * 31.71) * h;
      const flicker = 0.28 + 0.22 * Math.sin((frame + i * 3) * 0.035);
      const r = 0.55 + pseudo(i * 7.91) * 1.4;

      ctx.fillStyle = `rgba(210,238,255,${flicker})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawLatitudeLongitudeBands(ctx, cx, cy, radius, view) {
    ctx.save();
    ctx.lineWidth = Math.max(0.8, radius * 0.004);
    ctx.strokeStyle = "rgba(210,238,255,.11)";

    for (let i = -3; i <= 3; i += 1) {
      const y = cy + (i / 4) * radius * 0.72 + Math.sin(view.phase + i) * radius * 0.015;
      const rx = radius * Math.sqrt(Math.max(0.04, 1 - Math.pow((y - cy) / radius, 2)));

      ctx.beginPath();
      ctx.ellipse(cx, y, rx, radius * 0.055, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 8; i += 1) {
      const angle = (Math.PI * 2 * i) / 8 + view.yaw * 0.22;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * Math.abs(Math.cos(angle)), radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawContinents(ctx, cx, cy, radius, view) {
    const continents = [
      { lon: -2.72, lat: 0.56, sx: 0.48, sy: 0.34, twist: 0.3 },
      { lon: -1.88, lat: -0.10, sx: 0.42, sy: 0.58, twist: -0.7 },
      { lon: -0.92, lat: 0.38, sx: 0.55, sy: 0.36, twist: 0.9 },
      { lon: -0.06, lat: -0.38, sx: 0.50, sy: 0.40, twist: -0.2 },
      { lon: 0.78, lat: 0.17, sx: 0.62, sy: 0.33, twist: 0.5 },
      { lon: 1.62, lat: -0.44, sx: 0.38, sy: 0.44, twist: 1.1 },
      { lon: 2.48, lat: 0.04, sx: 0.52, sy: 0.34, twist: -0.4 }
    ];

    for (let i = 0; i < continents.length; i += 1) {
      drawProjectedBlob(ctx, cx, cy, radius, view, continents[i], i);
    }
  }

  function drawProjectedBlob(ctx, cx, cy, radius, view, blob, index) {
    const points = [];
    const steps = 36;

    for (let i = 0; i < steps; i += 1) {
      const t = (Math.PI * 2 * i) / steps;
      const rough =
        1 +
        0.16 * Math.sin(t * 3 + index) +
        0.10 * Math.sin(t * 7 + index * 1.7) +
        0.06 * Math.sin(t * 11 + index * 2.3);

      const lonOffset =
        Math.cos(t + blob.twist) * blob.sx * rough +
        Math.sin(t * 2 + index) * 0.055;

      const latOffset =
        Math.sin(t) * blob.sy * rough +
        Math.cos(t * 3 + index) * 0.040;

      const p = projectSphere(blob.lon + lonOffset, blob.lat + latOffset, view, cx, cy, radius);

      if (p.visible) points.push(p);
    }

    if (points.length < 6) return;

    ctx.save();

    const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    const land = ctx.createRadialGradient(avgX - radius * 0.08, avgY - radius * 0.10, radius * 0.02, avgX, avgY, radius * 0.42);
    land.addColorStop(0, "rgba(190,158,89,.96)");
    land.addColorStop(0.38, "rgba(104,137,82,.96)");
    land.addColorStop(0.72, "rgba(64,104,68,.95)");
    land.addColorStop(1, "rgba(43,76,56,.92)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const current = points[i];
      const mx = (prev.x + current.x) / 2;
      const my = (prev.y + current.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
    }

    ctx.closePath();
    ctx.fillStyle = land;
    ctx.fill();

    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.strokeStyle = "rgba(255,231,162,.28)";
    ctx.stroke();

    ctx.globalAlpha = 0.22;
    ctx.lineWidth = Math.max(0.7, radius * 0.003);
    ctx.strokeStyle = "rgba(5,20,31,.70)";
    for (let r = 0; r < 3; r += 1) {
      ctx.beginPath();
      for (let i = 0; i < points.length; i += 3) {
        const p = points[(i + r) % points.length];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawAncientCoastTraces(ctx, cx, cy, radius, view) {
    ctx.save();
    ctx.lineWidth = Math.max(0.8, radius * 0.0045);
    ctx.strokeStyle = "rgba(243,201,111,.18)";
    ctx.globalAlpha = 0.72;

    const channels = [
      { lon: -2.2, lat: 0.16, len: 0.74, curve: 0.30 },
      { lon: -0.4, lat: 0.06, len: 0.62, curve: -0.24 },
      { lon: 1.25, lat: -0.12, len: 0.68, curve: 0.22 },
      { lon: 2.55, lat: 0.36, len: 0.54, curve: -0.18 }
    ];

    for (let i = 0; i < channels.length; i += 1) {
      const c = channels[i];
      const pts = [];

      for (let step = 0; step < 12; step += 1) {
        const k = step / 11 - 0.5;
        const p = projectSphere(
          c.lon + k * c.len,
          c.lat + Math.sin(k * Math.PI * 2 + i) * c.curve * 0.22,
          view,
          cx,
          cy,
          radius
        );

        if (p.visible) pts.push(p);
      }

      if (pts.length < 3) continue;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let p = 1; p < pts.length; p += 1) {
        ctx.lineTo(pts[p].x, pts[p].y);
      }

      ctx.stroke();
    }

    ctx.restore();
  }

  function drawAtmosphere(ctx, cx, cy, radius) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.005, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(2, radius * 0.022);
    ctx.strokeStyle = "rgba(127,220,255,.24)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.035, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(1, radius * 0.010);
    ctx.strokeStyle = "rgba(255,231,162,.12)";
    ctx.stroke();

    const glow = ctx.createRadialGradient(cx, cy, radius * 0.92, cx, cy, radius * 1.24);
    glow.addColorStop(0, "rgba(127,220,255,0)");
    glow.addColorStop(0.68, "rgba(127,220,255,.10)");
    glow.addColorStop(1, "rgba(127,220,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawReceiptNeedle(ctx, cx, cy, radius, reason) {
    ctx.save();

    const angle = state.viewState.phase * 0.75 + state.viewState.yaw * 0.22;
    const x1 = cx + Math.cos(angle) * radius * 0.76;
    const y1 = cy + Math.sin(angle) * radius * 0.76;
    const x2 = cx + Math.cos(angle) * radius * 0.94;
    const y2 = cy + Math.sin(angle) * radius * 0.94;

    ctx.lineWidth = Math.max(1, radius * 0.006);
    ctx.strokeStyle = "rgba(255,231,162,.34)";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,231,162,.72)";
    ctx.beginPath();
    ctx.arc(x2, y2, Math.max(1.8, radius * 0.010), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    if (reason === "boot" || reason === "mount") {
      ctx.save();
      ctx.fillStyle = "rgba(232,241,255,.72)";
      ctx.font = `${Math.max(9, Math.round(radius * 0.040))}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Mirrorland · Unknown Location", cx, cy - radius - Math.max(12, radius * 0.11));
      ctx.restore();
    }
  }

  function projectSphere(lon, lat, view, cx, cy, radius) {
    const lambda = lon + view.yaw + view.phase * 0.12;
    const phi = clamp(lat + view.pitch * 0.22, -1.42, 1.42);

    const cosPhi = Math.cos(phi);
    const x0 = cosPhi * Math.sin(lambda);
    const y0 = Math.sin(phi);
    const z0 = cosPhi * Math.cos(lambda);

    const pitch = view.pitch * 0.45;
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const y = y0 * cp - z0 * sp;
    const z = y0 * sp + z0 * cp;

    return {
      x: cx + x0 * radius,
      y: cy - y * radius,
      z,
      visible: z > -0.08
    };
  }

  function pseudo(n) {
    const x = Math.sin(n * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  function inspectPixelSample(canvas, ctx) {
    if (!canvas || !ctx) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_UNREADABLE";
      state.pixelVisible = false;
      state.visiblePixelCount = 0;
      state.alphaPixelCount = 0;
      state.uniqueColorCount = 0;
      state.pixelSampleReason = "NO_CANVAS_CONTEXT";
      return;
    }

    const width = Number(canvas.width || 0);
    const height = Number(canvas.height || 0);

    if (width <= 0 || height <= 0) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_UNREADABLE";
      state.pixelVisible = false;
      state.visiblePixelCount = 0;
      state.alphaPixelCount = 0;
      state.uniqueColorCount = 0;
      state.pixelSampleReason = "CANVAS_DIMENSIONS_ZERO";
      return;
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
        const data = ctx.getImageData(x, y, 1, 1).data;

        sampleCount += 1;

        const r = data[0] || 0;
        const g = data[1] || 0;
        const b = data[2] || 0;
        const a = data[3] || 0;

        if (a > 0) alphaPixelCount += 1;
        if (a > 0 && (r > 0 || g > 0 || b > 0)) visiblePixelCount += 1;

        unique.add(`${r},${g},${b},${a}`);
      }
    } catch (error) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_ERROR";
      state.pixelVisible = false;
      state.visiblePixelCount = visiblePixelCount;
      state.alphaPixelCount = alphaPixelCount;
      state.uniqueColorCount = unique.size;
      state.pixelSampleReason = error && error.message ? String(error.message) : safeString(error);
      return;
    }

    state.visiblePixelCount = visiblePixelCount;
    state.alphaPixelCount = alphaPixelCount;
    state.uniqueColorCount = unique.size;
    state.pixelVisible = visiblePixelCount > 0;
    state.pixelSampleStatus = state.pixelVisible
      ? "PIXEL_SAMPLE_VISIBLE"
      : alphaPixelCount > 0
        ? "PIXEL_SAMPLE_ALPHA_ONLY_OR_BLACK"
        : "PIXEL_SAMPLE_BLANK";
    state.pixelSampleReason = state.pixelVisible
      ? "VISIBLE_NON_BLANK_PIXELS_FOUND"
      : alphaPixelCount > 0
        ? "ALPHA_PRESENT_WITH_NO_NON_BLACK_VISIBLE_RGB_SAMPLE"
        : "NO_VISIBLE_NON_BLANK_PIXELS_IN_SAMPLE_GRID";
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

  function composeRenderPacket(reason = "render-packet") {
    return {
      packetType: CANVAS_RENDER_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-receiver-output-carrier",
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      reason,
      viewState: clonePlain(state.viewState),

      surfaceIdentityUnified: state.surfaceIdentityUnified,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied,
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasSelector: state.primaryCanvasSelector,
      canvasId: state.primaryCanvasId,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasContext2dReady: state.canvasContext2dReady,

      pixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
      visiblePixelCount: state.visiblePixelCount,
      alphaPixelCount: state.alphaPixelCount,
      uniqueColorCount: state.uniqueColorCount,
      pixelSampleReason: state.pixelSampleReason,

      canvasDrawingPerformedByCanvasHub: true,
      canvasDrawingOwnsSourceTruth: false,
      terrainTruthOwned: false,
      hydrologyTruthOwned: false,
      elevationTruthOwned: false,
      materialTruthOwned: false,
      finalVisualPassAuthority: false,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function composeCanvasHexGatePacket(reason = "canvas-hex-gate") {
    readHexSurfaceAuthority();
    readControlAuthority();

    return {
      packetType: CANVAS_HEX_GATE_PACKET,
      contract: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,

      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_HUB",
      sourceRole: "canvas-output-carrier-to-hex-surface-gate",
      destinationFile: HEX_SURFACE_FILE,
      handoffTo: "HEARTH_HEX_SURFACE",
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      canvasFile: FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      canvasHexGateAuthorized: true,
      hexSurfaceGateAuthorized: true,
      pointerFingerTransmissionAuthorized: true,

      viewState: clonePlain(state.viewState),
      renderPacket: composeRenderPacket(reason),

      surfaceIdentityUnified: state.surfaceIdentityUnified,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied,
      canvasPixelVisible: state.pixelVisible,
      canvasPixelSampleStatus: state.pixelSampleStatus,

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceReceiverMethod: state.hexSurfaceReceiverMethod,

      controlObserved: state.controlObserved,
      controlSource: state.controlSource,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,

      canvasOwnsHexSurfaceTruth: false,
      canvasOwnsPointerFingerTruth: false,
      canvasOwnsTerrainTruth: false,
      canvasOwnsHydrologyTruth: false,
      canvasOwnsElevationTruth: false,
      canvasOwnsMaterialTruth: false,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function sendHexGatePacket(reason = "hex-gate") {
    const hex = readHexSurfaceAuthority();
    const packet = composeCanvasHexGatePacket(reason);

    state.hexGatePacketCount += 1;

    if (!hex.authority || !hex.method || !isFunction(hex.authority[hex.method])) {
      state.hexSurfaceDeliveryStatus = "HEX_SURFACE_PUBLIC_RECEIVER_NOT_AVAILABLE";
      publishHexGateGlobals(packet);

      return {
        delivered: false,
        method: "NONE",
        reason: "HEX_SURFACE_PUBLIC_RECEIVER_NOT_AVAILABLE",
        packet
      };
    }

    try {
      const result = hex.authority[hex.method](clonePlain(packet), {
        source: "HEARTH_CANVAS_HUB",
        reason
      });

      state.hexGateDeliveryCount += 1;
      state.hexSurfaceDeliveryStatus = "CANVAS_HEX_GATE_PACKET_DELIVERED";

      if (result && isFunction(result.then)) {
        result.catch((error) => {
          recordError("HEARTH_CANVAS_HEX_SURFACE_ASYNC_DELIVERY_FAILED", error, {
            method: hex.method
          });
        });
      }

      publishHexGateGlobals(packet);

      record("HEARTH_CANVAS_HEX_GATE_PACKET_DELIVERED", {
        method: hex.method,
        reason,
        hexSurfaceSource: hex.name,
        pixelVisible: state.pixelVisible
      });

      return {
        delivered: true,
        method: hex.method,
        reason: "HEX_SURFACE_PUBLIC_RECEIVER_CALLED",
        resultObserved: isObject(result),
        packet
      };
    } catch (error) {
      state.hexSurfaceDeliveryStatus = "CANVAS_HEX_GATE_PACKET_DELIVERY_ERROR";
      recordError("HEARTH_CANVAS_HEX_SURFACE_DELIVERY_FAILED", error, {
        method: hex.method
      });

      publishHexGateGlobals(packet);

      return {
        delivered: false,
        method: hex.method,
        reason: "HEX_SURFACE_PUBLIC_RECEIVER_THROWN",
        packet
      };
    }
  }

  function publishHexGateGlobals(packet) {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const cloned = clonePlain(packet);

    root.HEARTH_CANVAS_HEX_GATE_PACKET = cloned;
    root.HEARTH_CANVAS_LAST_HEX_GATE_PACKET = cloned;
    root.HEARTH_CANVAS_LIVE_SURFACE_IDENTITY_HEX_GATE_PACKET = cloned;

    hearth.canvasHexGatePacket = cloned;
    hearth.canvasLastHexGatePacket = cloned;
    hearth.canvasLiveSurfaceIdentityHexGatePacket = cloned;

    lab.hearthCanvasHexGatePacket = cloned;
    lab.hearthCanvasLastHexGatePacket = cloned;
    lab.hearthCanvasLiveSurfaceIdentityHexGatePacket = cloned;

    try {
      if (doc && isFunction(doc.dispatchEvent) && typeof root.CustomEvent === "function") {
        doc.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: cloned }));
      }

      if (isFunction(root.dispatchEvent) && typeof root.CustomEvent === "function") {
        root.dispatchEvent(new root.CustomEvent("hearth:canvas-hex-gate-packet", { detail: cloned }));
      }
    } catch (_error) {}
  }

  function publishRenderGlobals(reason = "render") {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const packet = composeRenderPacket(reason);

    root.HEARTH_CANVAS_RENDER_PACKET = clonePlain(packet);
    root.HEARTH_CANVAS_VISIBLE_2D_RENDER_PACKET = clonePlain(packet);
    root.HEARTH_CANVAS_LIVE_SURFACE_IDENTITY_RENDER_PACKET = clonePlain(packet);
    root.HEARTH_VISIBLE_PLANET_PROOF = clonePlain(packet);

    hearth.canvasRenderPacket = clonePlain(packet);
    hearth.canvasVisible2dRenderPacket = clonePlain(packet);
    hearth.canvasLiveSurfaceIdentityRenderPacket = clonePlain(packet);
    hearth.visiblePlanetProof = clonePlain(packet);

    lab.hearthCanvasRenderPacket = clonePlain(packet);
    lab.hearthCanvasVisible2dRenderPacket = clonePlain(packet);
    lab.hearthCanvasLiveSurfaceIdentityRenderPacket = clonePlain(packet);
    lab.hearthVisiblePlanetProof = clonePlain(packet);

    return packet;
  }

  function startLoop(reason = "start-loop") {
    if (state.drawLoopActive || state.disposed) return getReceiptLight(false);

    state.drawLoopActive = true;
    state.started = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_HUB_DRAW_LOOP_ACTIVE_NO_FINAL_CLAIM";

    record("HEARTH_CANVAS_DRAW_LOOP_STARTED", { reason });

    tick();

    return getReceiptLight(false);
  }

  function stopLoop(reason = "stop-loop") {
    state.drawLoopActive = false;

    if (state.rafId) {
      try {
        if (isFunction(root.cancelAnimationFrame)) root.cancelAnimationFrame(state.rafId);
        else clearTimeout(state.rafId);
      } catch (_error) {}
    }

    state.rafId = 0;

    record("HEARTH_CANVAS_DRAW_LOOP_STOPPED", { reason });

    return getReceiptLight(false);
  }

  function tick() {
    if (!state.drawLoopActive || state.disposed) return;

    drawFrame("raf-visible-2d-output");

    const schedule = isFunction(root.requestAnimationFrame)
      ? root.requestAnimationFrame.bind(root)
      : (fn) => root.setTimeout(fn, 33);

    state.rafId = schedule(tick);
  }

  function mount(options = {}) {
    state.lastMountedAt = nowIso();

    const prepared = unifySurfaceIdentity(options.reason || "mount");
    state.mounted = prepared.length > 0;

    if (state.mounted) {
      drawFrame("mount");
      state.postgameStatus = state.pixelVisible
        ? "CANVAS_HUB_MOUNTED_VISIBLE_2D_OUTPUT_ACTIVE"
        : "CANVAS_HUB_MOUNTED_PIXEL_SAMPLE_NOT_VISIBLE";
    }

    updateDataset();
    publishGlobals("mount");

    return getReceiptLight(false);
  }

  function boot(options = {}) {
    if (state.booted && !options.force) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();
    state.postgameStatus = "CANVAS_HUB_BOOTING_LIVE_SURFACE_IDENTITY_V12_4";

    record("HEARTH_CANVAS_HUB_BOOT_START", {
      contract: PUBLIC_CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT
    });

    publishGlobals("boot-early");
    mount({ reason: "boot" });
    drawFrame("boot");
    sendHexGatePacket("boot");

    state.booted = true;
    state.booting = false;

    startLoop("boot");

    record("HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_BOOTED", {
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      surfaceIdentityUnified: state.surfaceIdentityUnified,
      pixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
      visualPassClaimed: false
    });

    updateDataset();
    publishGlobals("boot-complete");

    return getReceipt();
  }

  function refresh(reason = "refresh") {
    readControlAuthority();
    readHexSurfaceAuthority();
    unifySurfaceIdentity(reason);
    drawFrame(reason);
    updateDataset();
    publishGlobals(reason);

    return getReceiptLight(false);
  }

  function dispose(reason = "manual-dispose") {
    stopLoop("dispose");
    state.disposed = true;
    state.postgameStatus = "CANVAS_HUB_DISPOSED";
    state.recommendedNextAction = "REBOOT_CANVAS_HUB_IF_VISIBLE_SURFACE_REQUIRED";

    record("HEARTH_CANVAS_HUB_DISPOSED", { reason });
    updateDataset();
    publishGlobals("dispose");

    return getReceipt();
  }

  function receiveCanvasHexGatePacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveCanvasHexGatePacket",
      viewPacket: true,
      reason: "receiveCanvasHexGatePacket"
    });
  }

  function consumeCanvasHexGatePacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      source: "consumeCanvasHexGatePacket"
    });
  }

  function acceptCanvasHexGatePacket(packet, options = {}) {
    return receiveCanvasHexGatePacket(packet, {
      ...options,
      source: "acceptCanvasHexGatePacket"
    });
  }

  function receiveCanvasViewPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveCanvasViewPacket",
      viewPacket: true,
      reason: "receiveCanvasViewPacket"
    });
  }

  function consumeCanvasViewPacket(packet, options = {}) {
    return receiveCanvasViewPacket(packet, {
      ...options,
      source: "consumeCanvasViewPacket"
    });
  }

  function receivePlanetaryViewControlPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receivePlanetaryViewControlPacket",
      controlPacket: true,
      viewPacket: true,
      inputType: "planetary-view-control",
      reason: "receivePlanetaryViewControlPacket"
    });
  }

  function consumePlanetaryViewControlPacket(packet, options = {}) {
    return receivePlanetaryViewControlPacket(packet, {
      ...options,
      source: "consumePlanetaryViewControlPacket"
    });
  }

  function receiveViewControlPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveViewControlPacket",
      controlPacket: true,
      viewPacket: true,
      inputType: "view-control",
      reason: "receiveViewControlPacket"
    });
  }

  function consumeViewControlPacket(packet, options = {}) {
    return receiveViewControlPacket(packet, {
      ...options,
      source: "consumeViewControlPacket"
    });
  }

  function receiveControlPacket(packet, options = {}) {
    return receivePacket(packet, {
      ...options,
      source: "receiveControlPacket",
      controlPacket: true,
      viewPacket: true,
      inputType: "control-packet",
      reason: "receiveControlPacket"
    });
  }

  function acceptControlPacket(packet, options = {}) {
    return receiveControlPacket(packet, {
      ...options,
      source: "acceptControlPacket"
    });
  }

  function drawInteractiveFrame(packet, options = {}) {
    return receivePacket(packet || {}, {
      ...options,
      source: "drawInteractiveFrame",
      viewPacket: true,
      reason: "drawInteractiveFrame"
    });
  }

  function drawPairFrame(packet, options = {}) {
    return receivePacket(packet || {}, {
      ...options,
      source: "drawPairFrame",
      viewPacket: true,
      reason: "drawPairFrame"
    });
  }

  function renderFrame(packet, options = {}) {
    if (isObject(packet)) applyViewPacket(packet, options);
    return drawFrame(options.reason || "renderFrame");
  }

  function requestFrame(packet, options = {}) {
    return renderFrame(packet, {
      ...options,
      reason: "requestFrame"
    });
  }

  function updateDataset() {
    setDataset("hearthCanvasLoaded", "true");
    setDataset("hearthCanvasPresent", String(state.canvasElementFound));
    setDataset("hearthCanvasContract", PUBLIC_CONTRACT);
    setDataset("hearthCanvasReceipt", PUBLIC_RECEIPT);
    setDataset("hearthCanvasParentContract", PUBLIC_CONTRACT);
    setDataset("hearthCanvasParentReceipt", PUBLIC_RECEIPT);
    setDataset("hearthCanvasCurrentParentContract", PUBLIC_CONTRACT);
    setDataset("hearthCanvasCurrentParentReceipt", PUBLIC_RECEIPT);
    setDataset("hearthSouthCurrentCanvasParentContract", PUBLIC_CONTRACT);
    setDataset("hearthSouthCurrentCanvasParentReceipt", PUBLIC_RECEIPT);
    setDataset("hearthCanvasInternalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasInternalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT);
    setDataset("hearthCanvasPreviousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT);
    setDataset("hearthCanvasVersion", VERSION);

    setDataset("hearthCanvasFile", FILE);
    setDataset("hearthCanvasRoute", ROUTE);
    setDataset("hearthCanvasMountSelector", state.mountSelector);
    setDataset("hearthCanvasStageSelector", state.stageSelector);
    setDataset("hearthCanvasSelector", state.primaryCanvasSelector);
    setDataset("hearthCanvasPrimaryCanvasId", state.primaryCanvasId);

    setDataset("hearthCanvasSurfaceIdentityUnified", String(state.surfaceIdentityUnified));
    setDataset("hearthCanvasVisibleCanvasAttributeApplied", String(state.visibleCanvasAttributeApplied));
    setDataset("hearthCanvasExpressionSurfaceAttributeApplied", String(state.expressionSurfaceAttributeApplied));
    setDataset("hearthCanvasVisible2dOutputActive", String(state.pixelVisible));
    setDataset("hearthCanvasElementFound", String(state.canvasElementFound));
    setDataset("hearthCanvasElementCount", String(state.canvasElementCount));
    setDataset("hearthCanvasContext2dReady", String(state.canvasContext2dReady));
    setDataset("hearthCanvasRectNonzero", String(state.canvasRectNonzero));
    setDataset("hearthCanvasComputedVisible", String(state.canvasComputedVisible));
    setDataset("hearthCanvasViewportIntersecting", String(state.canvasViewportIntersecting));

    setDataset("hearthCanvasPixelSampleStatus", state.pixelSampleStatus);
    setDataset("hearthCanvasPixelVisible", String(state.pixelVisible));
    setDataset("hearthCanvasVisiblePixelCount", String(state.visiblePixelCount));
    setDataset("hearthCanvasAlphaPixelCount", String(state.alphaPixelCount));
    setDataset("hearthCanvasUniqueColorCount", String(state.uniqueColorCount));
    setDataset("hearthCanvasPixelSampleReason", state.pixelSampleReason);

    setDataset("hearthCanvasDrawLoopActive", String(state.drawLoopActive));
    setDataset("hearthCanvasFrameCount", String(state.frameCount));
    setDataset("hearthCanvasDrawCount", String(state.drawCount));
    setDataset("hearthCanvasLastDrawReason", state.lastDrawReason);

    setDataset("hearthCanvasHexSurfaceObserved", String(state.hexSurfaceObserved));
    setDataset("hearthCanvasHexSurfaceSource", state.hexSurfaceSource);
    setDataset("hearthCanvasHexSurfaceContract", state.hexSurfaceContract);
    setDataset("hearthCanvasHexSurfaceReceiverMethod", state.hexSurfaceReceiverMethod);
    setDataset("hearthCanvasHexSurfaceDeliveryStatus", state.hexSurfaceDeliveryStatus);

    setDataset("hearthCanvasControlObserved", String(state.controlObserved));
    setDataset("hearthCanvasControlSource", state.controlSource);
    setDataset("hearthCanvasControlContract", state.controlContract);

    setDataset("hearthCanvasPostgameStatus", state.postgameStatus);
    setDataset("hearthCanvasFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasRecommendedNextOwner", state.recommendedNextOwner);
    setDataset("hearthCanvasRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasRecommendedNextAction", state.recommendedNextAction);

    setDataset("hearthCanvasOwnsSourceTruth", "false");
    setDataset("hearthCanvasOwnsTerrainTruth", "false");
    setDataset("hearthCanvasOwnsHydrologyTruth", "false");
    setDataset("hearthCanvasOwnsElevationTruth", "false");
    setDataset("hearthCanvasOwnsMaterialTruth", "false");
    setDataset("hearthCanvasOwnsHexSurfaceTruth", "false");
    setDataset("hearthCanvasOwnsPointerFingerTruth", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("hearthCanvasVisualPassClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function composeDiagnosticFields() {
    return {
      CANVAS_FILE: FILE,
      CANVAS_CONTRACT: PUBLIC_CONTRACT,
      CANVAS_RECEIPT: PUBLIC_RECEIPT,
      CANVAS_INTERNAL_IMPLEMENTATION_CONTRACT: INTERNAL_IMPLEMENTATION_CONTRACT,
      CANVAS_INTERNAL_IMPLEMENTATION_RECEIPT: INTERNAL_IMPLEMENTATION_RECEIPT,
      CANVAS_PREVIOUS_IMPLEMENTATION_CONTRACT: PREVIOUS_IMPLEMENTATION_CONTRACT,
      CANVAS_LINEAGE_IMPLEMENTATION_CONTRACT: LINEAGE_IMPLEMENTATION_CONTRACT,
      CANVAS_VERSION: VERSION,

      CANVAS_HUB_ACTIVE: "true",
      LIVE_SURFACE_IDENTITY_UNIFICATION_ACTIVE: "true",
      VISIBLE_2D_OUTPUT_ACTIVE: String(state.pixelVisible),
      SURFACE_IDENTITY_UNIFIED: String(state.surfaceIdentityUnified),
      VISIBLE_CANVAS_ATTRIBUTE_APPLIED: String(state.visibleCanvasAttributeApplied),
      EXPRESSION_SURFACE_ATTRIBUTE_APPLIED: String(state.expressionSurfaceAttributeApplied),

      CANVAS_ELEMENT_FOUND: String(state.canvasElementFound),
      CANVAS_ELEMENT_COUNT: String(state.canvasElementCount),
      CANVAS_SELECTOR: state.primaryCanvasSelector,
      CANVAS_ID: state.primaryCanvasId,
      CANVAS_CONTEXT_2D_READY: String(state.canvasContext2dReady),
      CANVAS_RECT_NONZERO: String(state.canvasRectNonzero),
      CANVAS_COMPUTED_VISIBLE: String(state.canvasComputedVisible),
      CANVAS_VIEWPORT_INTERSECTING: String(state.canvasViewportIntersecting),
      CANVAS_WIDTH: String(state.canvasWidth),
      CANVAS_HEIGHT: String(state.canvasHeight),

      CANVAS_PIXEL_SAMPLE_STATUS: state.pixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: String(state.pixelVisible),
      CANVAS_VISIBLE_PIXEL_COUNT: String(state.visiblePixelCount),
      CANVAS_ALPHA_PIXEL_COUNT: String(state.alphaPixelCount),
      CANVAS_PIXEL_UNIQUE_COLOR_COUNT: String(state.uniqueColorCount),
      CANVAS_PIXEL_SAMPLE_REASON: state.pixelSampleReason,

      DRAW_LOOP_ACTIVE: String(state.drawLoopActive),
      FRAME_COUNT: String(state.frameCount),
      DRAW_COUNT: String(state.drawCount),
      RECEIVE_PACKET_COUNT: String(state.receivePacketCount),
      ACCEPTED_PACKET_COUNT: String(state.acceptedPacketCount),
      REJECTED_PACKET_COUNT: String(state.rejectedPacketCount),
      CONTROL_PACKET_COUNT: String(state.controlPacketCount),
      VIEW_PACKET_COUNT: String(state.viewPacketCount),

      HEX_SURFACE_OBSERVED: String(state.hexSurfaceObserved),
      HEX_SURFACE_SOURCE: state.hexSurfaceSource,
      HEX_SURFACE_CONTRACT: state.hexSurfaceContract,
      HEX_SURFACE_RECEIVER_METHOD: state.hexSurfaceReceiverMethod,
      HEX_SURFACE_DELIVERY_STATUS: state.hexSurfaceDeliveryStatus,
      HEX_GATE_PACKET_COUNT: String(state.hexGatePacketCount),
      HEX_GATE_DELIVERY_COUNT: String(state.hexGateDeliveryCount),

      CONTROL_OBSERVED: String(state.controlObserved),
      CONTROL_SOURCE: state.controlSource,
      CONTROL_CONTRACT: state.controlContract,

      FIRST_FAILED_COORDINATE: state.firstFailedCoordinate,
      RECOMMENDED_NEXT_OWNER: state.recommendedNextOwner,
      RECOMMENDED_NEXT_FILE: state.recommendedNextFile,
      RECOMMENDED_NEXT_ACTION: state.recommendedNextAction,
      POSTGAME_STATUS: state.postgameStatus,

      CANVAS_OWNS_SOURCE_TRUTH: "false",
      CANVAS_OWNS_TERRAIN_TRUTH: "false",
      CANVAS_OWNS_HYDROLOGY_TRUTH: "false",
      CANVAS_OWNS_ELEVATION_TRUTH: "false",
      CANVAS_OWNS_MATERIAL_TRUTH: "false",
      CANVAS_OWNS_HEX_SURFACE_TRUTH: "false",
      CANVAS_OWNS_POINTER_FINGER_TRUTH: "false",
      CANVAS_OWNS_FINAL_VISUAL_PASS: "false",

      f13Claimed: "false",
      f21EligibleForNorth: "false",
      f21ClaimedByCanvas: "false",
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

  function composeReceiptLight(doRefresh = false) {
    if (doRefresh) {
      readControlAuthority();
      readHexSurfaceAuthority();
      inspectPrimaryCanvasGeometry(collectCanvasCandidates()[0] || null);
    }

    const diagnosticFields = composeDiagnosticFields();

    return {
      packetType: "HEARTH_CANVAS_HUB_RECEIPT_PACKET",
      canvasReceiptPacketType: "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT_PACKET_v12_4",
      contract: PUBLIC_CONTRACT,
      CONTRACT: PUBLIC_CONTRACT,
      receipt: PUBLIC_RECEIPT,
      RECEIPT: PUBLIC_RECEIPT,
      canvasContract: PUBLIC_CONTRACT,
      canvasReceipt: PUBLIC_RECEIPT,
      currentCanvasParentContract: PUBLIC_CONTRACT,
      currentCanvasParentReceipt: PUBLIC_RECEIPT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
      previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
      previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
      lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
      version: VERSION,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      indexFile: INDEX_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,
      hexAuthorityFile: HEX_AUTHORITY_FILE,
      pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
      pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
      pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
      pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

      expectedControlContract: EXPECTED_CONTROL_CONTRACT,
      expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
      expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

      role: "canvas-receiver-output-carrier-live-visible-2d-surface",

      loaded: true,
      booted: state.booted,
      mounted: state.mounted,
      started: state.started,
      disposed: state.disposed,

      canvasHubActive: true,
      canvasReceiverActive: true,
      canvasOutputCarrierActive: true,
      liveSurfaceIdentityUnificationActive: true,
      visible2dOutputActive: state.pixelVisible,
      canvasSurfaceTruthProbeCompatible: true,

      surfaceIdentityUnified: state.surfaceIdentityUnified,
      visibleCanvasAttributeApplied: state.visibleCanvasAttributeApplied,
      expressionSurfaceAttributeApplied: state.expressionSurfaceAttributeApplied,
      canvasElementFound: state.canvasElementFound,
      canvasElementCount: state.canvasElementCount,
      canvasCreatedByCanvasHub: state.canvasCreatedByCanvasHub,
      canvasSelector: state.primaryCanvasSelector,
      canvasId: state.primaryCanvasId,
      canvasContext2dReady: state.canvasContext2dReady,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasComputedVisible: state.canvasComputedVisible,
      canvasViewportIntersecting: state.canvasViewportIntersecting,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasCssWidth: state.canvasCssWidth,
      canvasCssHeight: state.canvasCssHeight,
      devicePixelRatio: state.devicePixelRatio,

      pixelSampleStatus: state.pixelSampleStatus,
      canvasPixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
      canvasPixelVisible: state.pixelVisible,
      visiblePixelCount: state.visiblePixelCount,
      alphaPixelCount: state.alphaPixelCount,
      uniqueColorCount: state.uniqueColorCount,
      pixelSampleReason: state.pixelSampleReason,

      drawLoopActive: state.drawLoopActive,
      frameCount: state.frameCount,
      drawCount: state.drawCount,
      receivePacketCount: state.receivePacketCount,
      acceptedPacketCount: state.acceptedPacketCount,
      rejectedPacketCount: state.rejectedPacketCount,
      controlPacketCount: state.controlPacketCount,
      viewPacketCount: state.viewPacketCount,
      hexGatePacketCount: state.hexGatePacketCount,
      hexGateDeliveryCount: state.hexGateDeliveryCount,
      surfaceUnificationCount: state.surfaceUnificationCount,
      resizeCount: state.resizeCount,
      receiptPublishCount: state.receiptPublishCount,
      aliasPublishCount: state.aliasPublishCount,
      eventCount: state.events.length,
      errorCount: state.errors.length,

      viewState: clonePlain(state.viewState),
      surfaces: clonePlain(state.surfaces),

      hexSurfaceObserved: state.hexSurfaceObserved,
      hexSurfaceSource: state.hexSurfaceSource,
      hexSurfaceContract: state.hexSurfaceContract,
      hexSurfaceReceipt: state.hexSurfaceReceipt,
      hexSurfaceReceiverMethod: state.hexSurfaceReceiverMethod,
      hexSurfaceDeliveryStatus: state.hexSurfaceDeliveryStatus,

      controlObserved: state.controlObserved,
      controlSource: state.controlSource,
      controlContract: state.controlContract,
      controlReceipt: state.controlReceipt,

      supportsBoot: true,
      supportsStart: true,
      supportsInit: true,
      supportsMount: true,
      supportsRefresh: true,
      supportsRenderFrame: true,
      supportsRequestFrame: true,
      supportsDrawInteractiveFrame: true,
      supportsDrawPairFrame: true,
      supportsCanvasViewPacket: true,
      supportsControlPacket: true,
      supportsPlanetaryViewControlPacket: true,
      supportsCanvasHexGatePacket: true,
      supportsHexSurfaceGateForwarding: true,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextOwner: state.recommendedNextOwner,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      diagnosticFields: clonePlain(diagnosticFields),
      ...diagnosticFields,

      ownsCanvasDrawing: true,
      ownsCanvasCreationInsideExistingMount: true,
      ownsCanvasMountHtml: false,
      ownsHtml: false,
      ownsRouteConductor: false,
      ownsControls: false,
      ownsControlHandshakeTruth: false,
      ownsSourceTruth: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsHexAuthorityTruth: false,
      ownsHexSurfaceTruth: false,
      ownsPointerFingerTruth: false,
      ownsNorthF21Latch: false,
      ownsReadyText: false,
      ownsFinalVisualPassClaim: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceiptLight(doRefresh = false) {
    return composeReceiptLight(doRefresh);
  }

  function getReceipt() {
    return {
      ...composeReceiptLight(false),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      startedAt: state.startedAt,
      lastMountedAt: state.lastMountedAt,
      lastDrawAt: state.lastDrawAt,
      updatedAt: nowIso(),
      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function composeReceiptText(receipt = getReceiptLight(false)) {
    const r = isObject(receipt) ? receipt : getReceiptLight(false);

    return [
      "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT",
      "",
      "HEADER",
      line("contract", PUBLIC_CONTRACT),
      line("receipt", PUBLIC_RECEIPT),
      line("internalImplementationContract", INTERNAL_IMPLEMENTATION_CONTRACT),
      line("internalImplementationReceipt", INTERNAL_IMPLEMENTATION_RECEIPT),
      line("previousImplementationContract", PREVIOUS_IMPLEMENTATION_CONTRACT),
      line("previousImplementationReceipt", PREVIOUS_IMPLEMENTATION_RECEIPT),
      line("version", VERSION),
      line("file", FILE),
      line("route", ROUTE),
      "",
      "SURFACE",
      line("surfaceIdentityUnified", r.surfaceIdentityUnified),
      line("visibleCanvasAttributeApplied", r.visibleCanvasAttributeApplied),
      line("expressionSurfaceAttributeApplied", r.expressionSurfaceAttributeApplied),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasElementCount", r.canvasElementCount),
      line("canvasSelector", r.canvasSelector),
      line("canvasId", r.canvasId),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasRectNonzero", r.canvasRectNonzero),
      line("canvasComputedVisible", r.canvasComputedVisible),
      line("canvasViewportIntersecting", r.canvasViewportIntersecting),
      "",
      "PIXELS",
      line("pixelSampleStatus", r.pixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("visiblePixelCount", r.visiblePixelCount),
      line("alphaPixelCount", r.alphaPixelCount),
      line("uniqueColorCount", r.uniqueColorCount),
      line("pixelSampleReason", r.pixelSampleReason),
      "",
      "GATE",
      line("hexSurfaceObserved", r.hexSurfaceObserved),
      line("hexSurfaceSource", r.hexSurfaceSource),
      line("hexSurfaceContract", r.hexSurfaceContract),
      line("hexSurfaceReceiverMethod", r.hexSurfaceReceiverMethod),
      line("hexSurfaceDeliveryStatus", r.hexSurfaceDeliveryStatus),
      line("hexGatePacketCount", r.hexGatePacketCount),
      line("hexGateDeliveryCount", r.hexGateDeliveryCount),
      "",
      "COUNTS",
      line("frameCount", r.frameCount),
      line("drawCount", r.drawCount),
      line("receivePacketCount", r.receivePacketCount),
      line("acceptedPacketCount", r.acceptedPacketCount),
      line("rejectedPacketCount", r.rejectedPacketCount),
      line("controlPacketCount", r.controlPacketCount),
      line("viewPacketCount", r.viewPacketCount),
      "",
      "NEXT",
      line("firstFailedCoordinate", r.firstFailedCoordinate),
      line("recommendedNextOwner", r.recommendedNextOwner),
      line("recommendedNextFile", r.recommendedNextFile),
      line("recommendedNextAction", r.recommendedNextAction),
      line("postgameStatus", r.postgameStatus),
      "",
      "NO_CLAIMS",
      line("f13Claimed", false),
      line("f21EligibleForNorth", false),
      line("f21ClaimedByCanvas", false),
      line("readyTextAllowed", false),
      line("readyTextClaimed", false),
      line("visualPassClaimed", false),
      line("finalVisualPassClaimed", false),
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
      "HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_STATUS",
      line("contract", r.contract),
      line("receipt", r.receipt),
      line("internalImplementationContract", r.internalImplementationContract),
      line("surfaceIdentityUnified", r.surfaceIdentityUnified),
      line("canvasElementFound", r.canvasElementFound),
      line("canvasSelector", r.canvasSelector),
      line("canvasContext2dReady", r.canvasContext2dReady),
      line("canvasPixelSampleStatus", r.pixelSampleStatus),
      line("canvasPixelVisible", r.canvasPixelVisible),
      line("drawLoopActive", r.drawLoopActive),
      line("frameCount", r.frameCount),
      line("hexSurfaceDeliveryStatus", r.hexSurfaceDeliveryStatus),
      line("recommendedNextAction", r.recommendedNextAction),
      line("visualPassClaimed", false),
      line("updatedAt", r.updatedAt)
    ].join("\n");
  }

  function getState() {
    return {
      ...clonePlain(state),
      diagnosticFields: composeDiagnosticFields(),
      ...NO_CLAIMS
    };
  }

  function publishAliasPaths() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of CANVAS_ALIAS_PATHS) setPath(path, api);

    state.aliasPublishCount += 1;
    state.updatedAt = nowIso();

    return true;
  }

  function publishReceiptAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const receipt = getReceiptLight(false);

    state.receiptPublishCount += 1;

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_RECEIPT = receipt;
    root.HEARTH_CANVAS_PARENT_RECEIPT = receipt;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = receipt;
    root.HEARTH_CANVAS_HUB_LIVE_SURFACE_IDENTITY_UNIFIED_VISIBLE_2D_OUTPUT_RECEIPT = receipt;
    root.HEARTH_CANVAS_DIAGNOSTIC_FIELDS = clonePlain(receipt.diagnosticFields);

    hearth.canvasReceipt = receipt;
    hearth.canvasHubReceipt = receipt;
    hearth.canvasParentReceipt = receipt;
    hearth.canvasVisiblePlanetReceipt = receipt;
    hearth.canvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    hearth.canvasHubLiveSurfaceIdentityUnifiedVisible2dOutputReceipt = receipt;
    hearth.canvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

    lab.hearthCanvasReceipt = receipt;
    lab.hearthCanvasHubReceipt = receipt;
    lab.hearthCanvasParentReceipt = receipt;
    lab.hearthCanvasVisiblePlanetReceipt = receipt;
    lab.hearthCanvasHubCompositeFirstFastViewDeferredHexReceiverReceipt = receipt;
    lab.hearthCanvasHubLiveSurfaceIdentityUnifiedVisible2dOutputReceipt = receipt;
    lab.hearthCanvasDiagnosticFields = clonePlain(receipt.diagnosticFields);

    return true;
  }

  function publishGlobals(reason = "publish-globals") {
    publishAliasPaths();
    updateDataset();
    publishReceiptAliases();

    record("HEARTH_CANVAS_GLOBALS_PUBLISHED", {
      reason,
      contract: PUBLIC_CONTRACT,
      internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
      canvasElementFound: state.canvasElementFound,
      surfaceIdentityUnified: state.surfaceIdentityUnified,
      pixelSampleStatus: state.pixelSampleStatus,
      pixelVisible: state.pixelVisible,
      visualPassClaimed: false
    });

    return true;
  }

  Object.assign(api, {
    contract: PUBLIC_CONTRACT,
    CONTRACT: PUBLIC_CONTRACT,
    receipt: PUBLIC_RECEIPT,
    RECEIPT: PUBLIC_RECEIPT,
    canvasContract: PUBLIC_CONTRACT,
    canvasReceipt: PUBLIC_RECEIPT,
    currentCanvasParentContract: PUBLIC_CONTRACT,
    currentCanvasParentReceipt: PUBLIC_RECEIPT,
    internalImplementationContract: INTERNAL_IMPLEMENTATION_CONTRACT,
    internalImplementationReceipt: INTERNAL_IMPLEMENTATION_RECEIPT,
    previousImplementationContract: PREVIOUS_IMPLEMENTATION_CONTRACT,
    previousImplementationReceipt: PREVIOUS_IMPLEMENTATION_RECEIPT,
    lineageImplementationContract: LINEAGE_IMPLEMENTATION_CONTRACT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    indexFile: INDEX_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    pointerFingerSurfaceFile: POINTER_FINGER_SURFACE_FILE,
    pointerFingerBoundaryFile: POINTER_FINGER_BOUNDARY_FILE,
    pointerFingerInspectFile: POINTER_FINGER_INSPECT_FILE,
    pointerFingerLightFile: POINTER_FINGER_LIGHT_FILE,

    expectedControlContract: EXPECTED_CONTROL_CONTRACT,
    expectedHexSurfaceContract: EXPECTED_HEX_SURFACE_CONTRACT,
    expectedHexAuthorityContract: EXPECTED_HEX_AUTHORITY_CONTRACT,

    canvasHexGatePacket: CANVAS_HEX_GATE_PACKET,
    canvasViewPacket: CANVAS_VIEW_PACKET,
    canvasRenderPacket: CANVAS_RENDER_PACKET,

    boot,
    start: boot,
    init: boot,
    run: boot,
    mount,
    refresh,
    dispose,
    startLoop,
    stopLoop,

    receivePacket,
    receiveCanvasHexGatePacket,
    consumeCanvasHexGatePacket,
    acceptCanvasHexGatePacket,
    receiveCanvasViewPacket,
    consumeCanvasViewPacket,
    receivePlanetaryViewControlPacket,
    consumePlanetaryViewControlPacket,
    receiveViewControlPacket,
    consumeViewControlPacket,
    receiveControlPacket,
    acceptControlPacket,

    drawInteractiveFrame,
    drawPairFrame,
    renderFrame,
    requestFrame,
    drawFrame,

    unifySurfaceIdentity,
    collectCanvasCandidates,
    composeRenderPacket,
    composeCanvasHexGatePacket,
    sendHexGatePacket,
    readControlAuthority,
    readHexSurfaceAuthority,

    getReceipt,
    getReceiptLight,
    getCanvasStationReceipt: getReceiptLight,
    getCanvasStationSummary: getReceiptLight,
    getVisiblePlanetReceipt: getReceiptLight,
    getCanvasParentReceipt: getReceiptLight,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getSummary: getReceiptLight,
    getReceiptText,
    getStatusText,
    getState,
    composeReceiptText,
    composeDiagnosticFields,

    publishGlobals,
    publishAliasPaths,
    publishReceiptAliases,
    updateDataset,

    supportsBoot: true,
    supportsStart: true,
    supportsInit: true,
    supportsMount: true,
    supportsRefresh: true,
    supportsRenderFrame: true,
    supportsRequestFrame: true,
    supportsDrawInteractiveFrame: true,
    supportsDrawPairFrame: true,
    supportsCanvasViewPacket: true,
    supportsControlPacket: true,
    supportsPlanetaryViewControlPacket: true,
    supportsCanvasHexGatePacket: true,
    supportsHexSurfaceGateForwarding: true,

    canvasHubActive: true,
    canvasReceiverActive: true,
    canvasOutputCarrierActive: true,
    liveSurfaceIdentityUnificationActive: true,

    ownsCanvasDrawing: true,
    ownsCanvasCreationInsideExistingMount: true,
    ownsCanvasMountHtml: false,
    ownsHtml: false,
    ownsRouteConductor: false,
    ownsControls: false,
    ownsControlHandshakeTruth: false,
    ownsSourceTruth: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsHexAuthorityTruth: false,
    ownsHexSurfaceTruth: false,
    ownsPointerFingerTruth: false,
    ownsNorthF21Latch: false,
    ownsReadyText: false,
    ownsFinalVisualPassClaim: false,

    ...NO_CLAIMS,
    ...UPPER_NO_CLAIMS,

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
    recordError("HEARTH_CANVAS_HUB_V12_4_INITIALIZATION_FAILED", error);

    try {
      publishGlobals("initialization-fallback-publication");
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
