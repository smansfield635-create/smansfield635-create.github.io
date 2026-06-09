// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HANDS_BRIDGE_STANDARD_TNT_v1
// Full-file replacement.
// Canvas Bishop / Chapel One authority only.
// Owns mount identity, canvas discovery, Bishop receipt, hand congregation registry,
// and bridge-readiness publication.
// Does not own hand geometry math, 3D context internals, paint expression,
// view controls, Hex truth, Finger truth, runtime restart, F13, F21,
// ready text, final visual pass, generated image, GraphicBox, or WebGL claim.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HANDS_BRIDGE_STANDARD_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_HANDS_BRIDGE_STANDARD_RECEIPT_v1";
  const VERSION = "2026-06-09.hearth-canvas-bishop-chapel-one-hands-bridge-standard-v1";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const HAND_GEOMETRY_FILE = "/assets/hearth/hearth.canvas.hand.geometry.js";
  const HAND_CONTEXT_FILE = "/assets/hearth/hearth.canvas.hand.context.js";
  const HAND_PAINT_FILE = "/assets/hearth/hearth.canvas.hand.paint.js";
  const HAND_VIEW_FILE = "/assets/hearth/hearth.canvas.hand.view.js";
  const HAND_INSPECT_FILE = "/assets/hearth/hearth.canvas.hand.inspect.js";

  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  const NO_CLAIMS = Object.freeze({
    productionMutationAuthorized: false,
    canvasRepairAuthorized: false,
    canvasBuildAuthorized: false,
    canvasReleaseAuthorized: false,
    canvasDrawingAuthorized: false,
    canvasCreationAuthorized: false,
    controlsMutationAuthorized: false,
    runtimeRestartAuthorized: false,
    routeRepairAuthorized: false,
    f13Claimed: false,
    f13CanvasClaimed: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount='true']",
    "[data-hearth-showroom-surface='true']",
    "[data-hearth-visible-surface='true']",
    "[data-hearth-dom-surface='true']",
    "[data-hearth-canvas-stage='true']",
    ".hearth-canvas-mount",
    ".hearth-canvas-stage",
    ".canvas-mount"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthVisibleCanvas",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-planet='hearth']",
    "#hearthCanvas",
    "#hearth-canvas",
    "canvas"
  ]);

  const HAND_ALIASES = Object.freeze({
    geometry: Object.freeze([
      "HEARTH.canvasHandGeometry",
      "HEARTH_CANVAS_HAND_GEOMETRY",
      "DEXTER_LAB.hearthCanvasHandGeometry"
    ]),
    context: Object.freeze([
      "HEARTH.canvasHandContext",
      "HEARTH_CANVAS_HAND_CONTEXT",
      "DEXTER_LAB.hearthCanvasHandContext"
    ]),
    paint: Object.freeze([
      "HEARTH.canvasHandPaint",
      "HEARTH_CANVAS_HAND_PAINT",
      "DEXTER_LAB.hearthCanvasHandPaint"
    ]),
    view: Object.freeze([
      "HEARTH.canvasHandView",
      "HEARTH_CANVAS_HAND_VIEW",
      "DEXTER_LAB.hearthCanvasHandView"
    ]),
    inspect: Object.freeze([
      "HEARTH.canvasHandInspect",
      "HEARTH_CANVAS_HAND_INSPECT",
      "DEXTER_LAB.hearthCanvasHandInspect"
    ])
  });

  const HEX_AUTHORITY_ALIASES = Object.freeze([
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hexAuthority",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "DEXTER_LAB.hearthHexFourPairAuthority"
  ]);

  const HEX_SURFACE_ALIASES = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
    "DEXTER_LAB.hearthHexSurface"
  ]);

  const CANVAS_BISHOP_ALIASES = Object.freeze([
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasBishop",
    "HEARTH.chapelOneBishop",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasBishop",
    "DEXTER_LAB.hearthChapelOneBishop",
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_BISHOP",
    "HEARTH_CANVAS_CHAPEL_ONE_BISHOP"
  ]);

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    loaded: true,
    chapelOneBishop: true,
    chapelOneCongregation: "hands",
    bishopAuthority: "mount-identity-and-congregation-coordination-only",

    mountObserved: false,
    mountSelector: "NONE",
    mountDescriptor: "NONE",
    mountRectNonzero: false,
    mountRect: null,

    canvasObserved: false,
    canvasSelector: "NONE",
    canvasDescriptor: "NONE",
    canvasRectNonzero: false,
    canvasRect: null,

    handGeometryObserved: false,
    handContextObserved: false,
    handPaintObserved: false,
    handViewObserved: false,
    handInspectObserved: false,
    handObservedCount: 0,

    hexAuthorityBridgeObserved: false,
    hexSurfaceBridgeObserved: false,

    componentStatus: "BISHOP_LOADED_WAITING_MEASUREMENT",
    firstFailedCoordinate: "WAITING_MEASUREMENT",
    recommendedNextFile: HAND_GEOMETRY_FILE,
    recommendedNextAction: "MEASURE_CANVAS_BISHOP",

    updatedAt: "",

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

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function readPath(path) {
    const parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function setPath(path, value) {
    const parts = safeString(path).replace(/^window\./, "").split(".").filter(Boolean);
    if (!parts.length) return false;

    let cursor = root;
    for (let i = 0; i < parts.length - 1; i += 1) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== "object") cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }

    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && (isObject(value) || isFunction(value))) {
        return { found: true, path, value };
      }
    }

    return { found: false, path: "NONE", value: null };
  }

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};

    const methods = ["getReceiptLight", "getReceipt", "getStatus", "getState", "getReport"];
    for (const method of methods) {
      if (!isFunction(authority[method])) continue;
      try {
        const out = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(out)) return out;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt) return authority;

    return {};
  }

  function queryFirst(selectors, scope) {
    const target = scope || doc;
    if (!target || !isFunction(target.querySelector)) return { selector: "NONE", node: null };

    for (const selector of selectors || []) {
      try {
        const node = target.querySelector(selector);
        if (node) return { selector, node };
      } catch (_error) {}
    }

    return { selector: "NONE", node: null };
  }

  function rectOf(node) {
    if (!node || !isFunction(node.getBoundingClientRect)) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }

    try {
      const rect = node.getBoundingClientRect();
      return {
        width: Number(rect.width) || 0,
        height: Number(rect.height) || 0,
        left: Number(rect.left) || 0,
        top: Number(rect.top) || 0,
        right: Number(rect.right) || 0,
        bottom: Number(rect.bottom) || 0
      };
    } catch (_error) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }
  }

  function descriptor(node) {
    if (!node) return "NONE";

    let tag = "unknown";
    let id = "";
    let cls = "";

    try {
      tag = safeString(node.tagName || "unknown").toLowerCase();
    } catch (_error) {}

    try {
      id = node.id ? "#" + node.id : "";
    } catch (_error) {}

    try {
      cls = typeof node.className === "string" && node.className
        ? "." + node.className.trim().replace(/\s+/g, ".")
        : "";
    } catch (_error) {}

    return `${tag}${id}${cls}`;
  }

  function findMountAndCanvas() {
    const mountResult = queryFirst(MOUNT_SELECTORS);
    let canvasResult = { selector: "NONE", node: null };

    if (mountResult.node) {
      canvasResult = queryFirst(CANVAS_SELECTORS, mountResult.node);
    }

    if (!canvasResult.node) {
      canvasResult = queryFirst(CANVAS_SELECTORS);
    }

    const mountRect = rectOf(mountResult.node);
    const canvasRect = rectOf(canvasResult.node);

    return {
      mount: {
        observed: Boolean(mountResult.node),
        selector: mountResult.selector,
        descriptor: descriptor(mountResult.node),
        rect: mountRect,
        rectNonzero: mountRect.width > 0 && mountRect.height > 0
      },
      canvas: {
        observed: Boolean(canvasResult.node),
        selector: canvasResult.selector,
        descriptor: descriptor(canvasResult.node),
        rect: canvasRect,
        rectNonzero: canvasRect.width > 0 && canvasRect.height > 0,
        width: canvasResult.node ? Number(canvasResult.node.width) || 0 : 0,
        height: canvasResult.node ? Number(canvasResult.node.height) || 0 : 0
      }
    };
  }

  function readHand(key) {
    const aliases = HAND_ALIASES[key] || [];
    const found = firstGlobal(aliases);
    const receipt = readReceipt(found.value);

    return {
      key,
      found: found.found,
      aliasPath: found.path,
      contract: safeString(receipt.contract || receipt.CONTRACT || (found.value && found.value.contract) || "UNKNOWN"),
      receipt: safeString(receipt.receipt || receipt.RECEIPT || (found.value && found.value.receipt) || "UNKNOWN"),
      componentStatus: safeString(receipt.componentStatus || receipt.status || (found.found ? "OBSERVED" : "NOT_OBSERVED")),
      firstFailedCoordinate: safeString(receipt.firstFailedCoordinate || "UNKNOWN")
    };
  }

  function readBridge(paths, file) {
    const found = firstGlobal(paths);
    const receipt = readReceipt(found.value);

    return {
      found: found.found,
      aliasPath: found.path,
      file,
      contract: safeString(receipt.contract || receipt.CONTRACT || (found.value && found.value.contract) || "UNKNOWN"),
      receipt: safeString(receipt.receipt || receipt.RECEIPT || (found.value && found.value.receipt) || "UNKNOWN"),
      componentStatus: safeString(receipt.componentStatus || receipt.status || (found.found ? "OBSERVED" : "NOT_OBSERVED"))
    };
  }

  function measure() {
    const surface = findMountAndCanvas();

    const hands = {
      geometry: readHand("geometry"),
      context: readHand("context"),
      paint: readHand("paint"),
      view: readHand("view"),
      inspect: readHand("inspect")
    };

    const handObservedCount = Object.keys(hands).filter((key) => hands[key].found).length;
    const hexAuthority = readBridge(HEX_AUTHORITY_ALIASES, HEX_AUTHORITY_FILE);
    const hexSurface = readBridge(HEX_SURFACE_ALIASES, HEX_SURFACE_FILE);

    state.mountObserved = surface.mount.observed;
    state.mountSelector = surface.mount.selector;
    state.mountDescriptor = surface.mount.descriptor;
    state.mountRectNonzero = surface.mount.rectNonzero;
    state.mountRect = surface.mount.rect;

    state.canvasObserved = surface.canvas.observed;
    state.canvasSelector = surface.canvas.selector;
    state.canvasDescriptor = surface.canvas.descriptor;
    state.canvasRectNonzero = surface.canvas.rectNonzero;
    state.canvasRect = surface.canvas.rect;

    state.handGeometryObserved = hands.geometry.found;
    state.handContextObserved = hands.context.found;
    state.handPaintObserved = hands.paint.found;
    state.handViewObserved = hands.view.found;
    state.handInspectObserved = hands.inspect.found;
    state.handObservedCount = handObservedCount;

    state.hexAuthorityBridgeObserved = hexAuthority.found;
    state.hexSurfaceBridgeObserved = hexSurface.found;

    if (!surface.mount.observed) {
      state.componentStatus = "HELD_CANONICAL_MOUNT_NOT_OBSERVED";
      state.firstFailedCoordinate = "CANONICAL_MOUNT_EXISTS";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_ROUTE_HTML_EXPOSES_HEARTH_CANVAS_MOUNT";
    } else if (!surface.mount.rectNonzero) {
      state.componentStatus = "HELD_CANONICAL_MOUNT_RECT_ZERO";
      state.firstFailedCoordinate = "CANONICAL_MOUNT_RECT_NONZERO";
      state.recommendedNextFile = HAND_GEOMETRY_FILE;
      state.recommendedNextAction = "CRAFT_OR_RUN_GEOMETRY_HAND_RECT_SETTLE_PROOF";
    } else if (!surface.canvas.observed) {
      state.componentStatus = "HELD_CANONICAL_CANVAS_NOT_OBSERVED";
      state.firstFailedCoordinate = "CANONICAL_CANVAS_EXISTS";
      state.recommendedNextFile = FILE;
      state.recommendedNextAction = "CONFIRM_BISHOP_CAN_DISCOVER_EXISTING_CANVAS";
    } else if (!surface.canvas.rectNonzero) {
      state.componentStatus = "HELD_CANONICAL_CANVAS_RECT_ZERO";
      state.firstFailedCoordinate = "CANONICAL_CANVAS_RECT_NONZERO";
      state.recommendedNextFile = HAND_GEOMETRY_FILE;
      state.recommendedNextAction = "CRAFT_OR_RUN_GEOMETRY_HAND_CANVAS_RECT_SETTLE_PROOF";
    } else if (!hands.geometry.found) {
      state.componentStatus = "BISHOP_PRESENT_WAITING_GEOMETRY_HAND";
      state.firstFailedCoordinate = "HAND_GEOMETRY_PRESENT";
      state.recommendedNextFile = HAND_GEOMETRY_FILE;
      state.recommendedNextAction = "CRAFT_CHAPEL_ONE_GEOMETRY_HAND";
    } else if (!hands.context.found) {
      state.componentStatus = "BISHOP_PRESENT_WAITING_CONTEXT_HAND";
      state.firstFailedCoordinate = "HAND_CONTEXT_PRESENT";
      state.recommendedNextFile = HAND_CONTEXT_FILE;
      state.recommendedNextAction = "CRAFT_CHAPEL_ONE_CONTEXT_HAND";
    } else if (!hands.paint.found) {
      state.componentStatus = "BISHOP_PRESENT_WAITING_PAINT_HAND";
      state.firstFailedCoordinate = "HAND_PAINT_PRESENT";
      state.recommendedNextFile = HAND_PAINT_FILE;
      state.recommendedNextAction = "CRAFT_CHAPEL_ONE_PAINT_HAND";
    } else if (!hands.view.found) {
      state.componentStatus = "BISHOP_PRESENT_WAITING_VIEW_HAND";
      state.firstFailedCoordinate = "HAND_VIEW_PRESENT";
      state.recommendedNextFile = HAND_VIEW_FILE;
      state.recommendedNextAction = "CRAFT_CHAPEL_ONE_VIEW_HAND";
    } else if (!hands.inspect.found) {
      state.componentStatus = "BISHOP_PRESENT_WAITING_INSPECT_HAND";
      state.firstFailedCoordinate = "HAND_INSPECT_PRESENT";
      state.recommendedNextFile = HAND_INSPECT_FILE;
      state.recommendedNextAction = "CRAFT_CHAPEL_ONE_INSPECT_HAND";
    } else if (!hexAuthority.found) {
      state.componentStatus = "CHAPEL_ONE_HANDS_PRESENT_WAITING_HEX_AUTHORITY_BRIDGE";
      state.firstFailedCoordinate = "HEX_AUTHORITY_BRIDGE_PRESENT";
      state.recommendedNextFile = HEX_AUTHORITY_FILE;
      state.recommendedNextAction = "LOAD_OR_RENEW_HEX_AUTHORITY_CONGRESSIONAL_BRIDGE";
    } else if (!hexSurface.found) {
      state.componentStatus = "CHAPEL_ONE_HANDS_PRESENT_WAITING_HEX_SURFACE_BRIDGE_GATE";
      state.firstFailedCoordinate = "HEX_SURFACE_BRIDGE_GATE_PRESENT";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "LOAD_OR_RENEW_HEX_SURFACE_BRIDGE_GATE";
    } else {
      state.componentStatus = "CANVAS_BISHOP_CHAPEL_ONE_READY_FOR_BRIDGE_HANDOFF";
      state.firstFailedCoordinate = "NONE";
      state.recommendedNextFile = HEX_SURFACE_FILE;
      state.recommendedNextAction = "SEND_CANVAS_BISHOP_HANDOFF_TO_HEX_SURFACE_BRIDGE_GATE";
    }

    state.updatedAt = nowIso();

    updateDataset();
    publishAliases();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      version: VERSION,
      file: FILE,
      route: ROUTE,

      chapelOneBishop: true,
      chapelOneCongregation: "hands",
      canvasBishopPresent: true,

      componentStatus: state.componentStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,

      mountObserved: state.mountObserved,
      mountSelector: state.mountSelector,
      mountDescriptor: state.mountDescriptor,
      mountRectNonzero: state.mountRectNonzero,
      mountRect: clone(state.mountRect),

      canvasObserved: state.canvasObserved,
      canvasSelector: state.canvasSelector,
      canvasDescriptor: state.canvasDescriptor,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasRect: clone(state.canvasRect),

      handGeometryObserved: state.handGeometryObserved,
      handContextObserved: state.handContextObserved,
      handPaintObserved: state.handPaintObserved,
      handViewObserved: state.handViewObserved,
      handInspectObserved: state.handInspectObserved,
      handObservedCount: state.handObservedCount,
      hands,

      hexAuthorityBridgeObserved: state.hexAuthorityBridgeObserved,
      hexSurfaceBridgeObserved: state.hexSurfaceBridgeObserved,
      hexAuthority,
      hexSurface,

      ownsMountIdentity: true,
      ownsMountCreation: false,
      ownsCanvasCreation: false,
      ownsCanvasDrawing: false,
      ownsGeometryHand: false,
      ownsContextHand: false,
      ownsPaintHand: false,
      ownsViewHand: false,
      ownsInspectHand: false,
      ownsHexAuthorityTruth: false,
      ownsHexSurfaceTruth: false,

      updatedAt: state.updatedAt,
      ...NO_CLAIMS
    };
  }

  function receiveHandReceipt(packet = {}) {
    const p = isObject(packet) ? packet : {};
    const role = safeString(p.handRole || p.role || p.component || "").toLowerCase();

    if (role.includes("geometry")) state.handGeometryObserved = true;
    if (role.includes("context")) state.handContextObserved = true;
    if (role.includes("paint")) state.handPaintObserved = true;
    if (role.includes("view")) state.handViewObserved = true;
    if (role.includes("inspect")) state.handInspectObserved = true;

    return measure();
  }

  function receiveViewStatePacket(packet = {}) {
    root.HEARTH = root.HEARTH || {};
    root.HEARTH.canvasBishopLastViewStatePacket = clone(packet);
    return measure();
  }

  function composeBridgeHandoffPacket(extra = {}) {
    const receipt = measure();

    return {
      packetType: "HEARTH_CANVAS_BISHOP_TO_HEX_BRIDGE_HANDOFF_PACKET_v1",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_BISHOP",
      targetFile: HEX_SURFACE_FILE,
      destinationFile: HEX_SURFACE_FILE,

      chapelOneBishop: true,
      chapelOneCongregation: "hands",
      canvasBishopPresent: true,

      mountObserved: receipt.mountObserved,
      mountRectNonzero: receipt.mountRectNonzero,
      canvasObserved: receipt.canvasObserved,
      canvasRectNonzero: receipt.canvasRectNonzero,

      handGeometryObserved: receipt.handGeometryObserved,
      handContextObserved: receipt.handContextObserved,
      handPaintObserved: receipt.handPaintObserved,
      handViewObserved: receipt.handViewObserved,
      handInspectObserved: receipt.handInspectObserved,
      handObservedCount: receipt.handObservedCount,

      hexAuthorityBridgeObserved: receipt.hexAuthorityBridgeObserved,
      hexSurfaceBridgeObserved: receipt.hexSurfaceBridgeObserved,

      componentStatus: receipt.componentStatus,
      firstFailedCoordinate: receipt.firstFailedCoordinate,
      recommendedNextFile: receipt.recommendedNextFile,
      recommendedNextAction: receipt.recommendedNextAction,

      detail: clone(extra),
      composedAt: nowIso(),
      ...NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return measure();
  }

  function getReceipt() {
    return {
      ...measure(),
      state: clone(state)
    };
  }

  function getStatus() {
    const r = measure();

    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      canvasBishopPresent: true,
      chapelOneBishop: true,
      chapelOneCongregation: "hands",
      componentStatus: r.componentStatus,
      firstFailedCoordinate: r.firstFailedCoordinate,
      recommendedNextFile: r.recommendedNextFile,
      recommendedNextAction: r.recommendedNextAction,
      mountObserved: r.mountObserved,
      mountRectNonzero: r.mountRectNonzero,
      canvasObserved: r.canvasObserved,
      canvasRectNonzero: r.canvasRectNonzero,
      handObservedCount: r.handObservedCount,
      hexAuthorityBridgeObserved: r.hexAuthorityBridgeObserved,
      hexSurfaceBridgeObserved: r.hexSurfaceBridgeObserved,
      updatedAt: r.updatedAt,
      ...NO_CLAIMS
    };
  }

  function getState() {
    measure();
    return clone(state);
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;

    const ds = doc.documentElement.dataset;

    ds.hearthCanvasLoaded = "true";
    ds.hearthCanvasContract = CONTRACT;
    ds.hearthCanvasReceipt = RECEIPT;
    ds.hearthCanvasVersion = VERSION;
    ds.hearthCanvasFile = FILE;

    ds.hearthCanvasBishopPresent = "true";
    ds.hearthChapelOneBishop = "true";
    ds.hearthChapelOneCongregation = "hands";

    ds.hearthCanvasComponentStatus = state.componentStatus;
    ds.hearthCanvasFirstFailedCoordinate = state.firstFailedCoordinate;
    ds.hearthCanvasRecommendedNextFile = state.recommendedNextFile;
    ds.hearthCanvasRecommendedNextAction = state.recommendedNextAction;

    ds.hearthCanvasMountObserved = String(state.mountObserved);
    ds.hearthCanvasMountSelector = state.mountSelector;
    ds.hearthCanvasMountRectNonzero = String(state.mountRectNonzero);

    ds.hearthCanvasCanvasObserved = String(state.canvasObserved);
    ds.hearthCanvasCanvasSelector = state.canvasSelector;
    ds.hearthCanvasCanvasRectNonzero = String(state.canvasRectNonzero);

    ds.hearthCanvasHandGeometryObserved = String(state.handGeometryObserved);
    ds.hearthCanvasHandContextObserved = String(state.handContextObserved);
    ds.hearthCanvasHandPaintObserved = String(state.handPaintObserved);
    ds.hearthCanvasHandViewObserved = String(state.handViewObserved);
    ds.hearthCanvasHandInspectObserved = String(state.handInspectObserved);
    ds.hearthCanvasHandObservedCount = String(state.handObservedCount);

    ds.hearthCanvasHexAuthorityBridgeObserved = String(state.hexAuthorityBridgeObserved);
    ds.hearthCanvasHexSurfaceBridgeObserved = String(state.hexSurfaceBridgeObserved);

    ds.productionMutationAuthorized = "false";
    ds.canvasRepairAuthorized = "false";
    ds.canvasBuildAuthorized = "false";
    ds.canvasReleaseAuthorized = "false";
    ds.runtimeRestartAuthorized = "false";
    ds.readyTextClaimed = "false";
    ds.f13Claimed = "false";
    ds.f21Claimed = "false";
    ds.visualPassClaimed = "false";
    ds.generatedImage = "false";
    ds.graphicBox = "false";
    ds.webgl = "false";

    return true;
  }

  function publishAliases() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    for (const path of CANVAS_BISHOP_ALIASES) {
      setPath(path, api);
    }

    const light = {
      contract: CONTRACT,
      receipt: RECEIPT,
      file: FILE,
      canvasBishopPresent: true,
      chapelOneBishop: true,
      chapelOneCongregation: "hands",
      componentStatus: state.componentStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      handGeometryObserved: state.handGeometryObserved,
      handContextObserved: state.handContextObserved,
      handPaintObserved: state.handPaintObserved,
      handViewObserved: state.handViewObserved,
      handInspectObserved: state.handInspectObserved,
      hexAuthorityBridgeObserved: state.hexAuthorityBridgeObserved,
      hexSurfaceBridgeObserved: state.hexSurfaceBridgeObserved,
      updatedAt: state.updatedAt,
      ...NO_CLAIMS
    };

    root.HEARTH_CANVAS_BISHOP_RECEIPT = light;
    root.HEARTH_CANVAS_RECEIPT = light;
    root.HEARTH.chapelOneBishopReceipt = light;
    root.HEARTH.canvasBishopReceipt = light;
    root.DEXTER_LAB.hearthCanvasBishopReceipt = light;

    root.__HEARTH_CANVAS_BISHOP_PRESENT__ = true;
    root.__HEARTH_CANVAS_BISHOP_CONTRACT__ = CONTRACT;
    root.__HEARTH_CANVAS_BISHOP_RECEIPT__ = RECEIPT;

    return true;
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    version: VERSION,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    chapelOneBishop: true,
    chapelOneCongregation: "hands",
    canvasBishopPresent: true,

    handGeometryFile: HAND_GEOMETRY_FILE,
    handContextFile: HAND_CONTEXT_FILE,
    handPaintFile: HAND_PAINT_FILE,
    handViewFile: HAND_VIEW_FILE,
    handInspectFile: HAND_INSPECT_FILE,
    hexAuthorityFile: HEX_AUTHORITY_FILE,
    hexSurfaceFile: HEX_SURFACE_FILE,

    measure,
    run: measure,
    runDiagnostic: measure,
    inspect: measure,
    read: measure,
    getReceiptLight,
    getReceipt,
    getStatus,
    getState,

    receiveHandReceipt,
    receiveViewStatePacket,
    composeBridgeHandoffPacket,
    updateDataset,
    publishAliases,

    ownsMountIdentity: true,
    ownsMountDiscovery: true,
    ownsBishopReceiptPublication: true,
    ownsHandCongregationRegistry: true,
    ownsBridgeHandoffPacketComposition: true,

    ownsMountCreation: false,
    ownsCanvasCreation: false,
    ownsCanvasDrawing: false,
    ownsHandGeometryMath: false,
    ownsContextInternals: false,
    ownsPaintExpression: false,
    ownsViewControls: false,
    ownsHexAuthorityTruth: false,
    ownsHexSurfaceTruth: false,
    ownsFingerTruth: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    measure();
  } catch (_error) {
    state.componentStatus = "BISHOP_LOADED_MEASUREMENT_ERROR";
    state.firstFailedCoordinate = "BISHOP_MEASUREMENT_EXECUTION";
    state.recommendedNextFile = FILE;
    state.recommendedNextAction = "RERUN_CANVAS_BISHOP_MEASUREMENT";
    state.updatedAt = nowIso();
    updateDataset();
    publishAliases();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
