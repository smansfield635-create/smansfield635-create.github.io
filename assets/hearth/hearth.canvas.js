// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_BISHOP_CHAPEL_ONE_FUNCTIONAL_BRIDGE_STANDARD_TNT_v13
// Full-file replacement.
// CanvasJS Bishop / Chapel 1 parent / functional bridge standard only.

(() => {
  "use strict";

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;

  const CONTRACT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_FUNCTIONAL_BRIDGE_STANDARD_TNT_v13";
  const RECEIPT = "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_FUNCTIONAL_BRIDGE_STANDARD_RECEIPT_v13";
  const PUBLIC_CANVAS_STANDARD =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE = "/showroom/globe/hearth/";

  const HAND_GEOMETRY_FILE = "/assets/hearth/hearth.canvas.hand.geometry.js";
  const HAND_CONTEXT_FILE = "/assets/hearth/hearth.canvas.hand.context.js";
  const HAND_PAINT_FILE = "/assets/hearth/hearth.canvas.hand.paint.js";
  const HAND_VIEW_FILE = "/assets/hearth/hearth.canvas.hand.view.js";
  const HAND_INSPECT_FILE = "/assets/hearth/hearth.canvas.hand.inspect.js";

  const HEX_AUTHORITY_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";

  const FINGER_SURFACE_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const FINGER_BOUNDARY_FILE = "/assets/hearth/hearth.canvas.finger.boundary.js";
  const FINGER_INSPECT_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const FINGER_LIGHT_FILE = "/assets/hearth/hearth.canvas.finger.light.js";

  const CANONICAL = Object.freeze({
    mount: "#hearthCanvasMount",
    frame: "#hearthCanvasRectLockFrame",
    canvas: "#hearthVisibleCanvas",
    chain: "#hearthCanvasMount > #hearthCanvasRectLockFrame > #hearthVisibleCanvas"
  });

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f13CanvasClaimed: false,
    f13ClaimedByCanvas: false,
    f21EligibleForNorth: false,
    f21Claimed: false,
    f21ClaimedByCanvas: false,
    f21SubmittedToNorth: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    completionLatched: false,
    finalCompletionLatched: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false
  });

  const ALIASES = Object.freeze([
    "HEARTH_CANVAS",
    "HEARTH_CANVAS_HUB",
    "HEARTH_CANVAS_PARENT",
    "HEARTH_CANVAS_AUTHORITY",
    "HEARTH_CANVAS_BISHOP",
    "HEARTH_CANVAS_CHAPEL_ONE_BISHOP",
    "HEARTH.canvas",
    "HEARTH.canvasHub",
    "HEARTH.canvasParent",
    "HEARTH.canvasAuthority",
    "HEARTH.canvasBishop",
    "HEARTH.chapelOneBishop",
    "DEXTER_LAB.hearthCanvas",
    "DEXTER_LAB.hearthCanvasHub",
    "DEXTER_LAB.hearthCanvasBishop",
    "DEXTER_LAB.hearthChapelOneBishop"
  ]);

  const HAND_ALIASES = Object.freeze({
    geometry: ["HEARTH.canvasHandGeometry", "HEARTH_CANVAS_HAND_GEOMETRY", "DEXTER_LAB.hearthCanvasHandGeometry"],
    context: ["HEARTH.canvasHandContext", "HEARTH_CANVAS_HAND_CONTEXT", "DEXTER_LAB.hearthCanvasHandContext"],
    paint: ["HEARTH.canvasHandPaint", "HEARTH_CANVAS_HAND_PAINT", "DEXTER_LAB.hearthCanvasHandPaint"],
    view: ["HEARTH.canvasHandView", "HEARTH_CANVAS_HAND_VIEW", "DEXTER_LAB.hearthCanvasHandView"],
    inspect: ["HEARTH.canvasHandInspect", "HEARTH_CANVAS_HAND_INSPECT", "DEXTER_LAB.hearthCanvasHandInspect"]
  });

  const BRIDGE_ALIASES = Object.freeze({
    hexAuthority: [
      "HEARTH.hexFourPairAuthority",
      "HEARTH.hexAuthority",
      "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
      "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
      "DEXTER_LAB.hearthHexFourPairAuthority"
    ],
    hexSurface: [
      "HEARTH.hexSurface",
      "HEARTH_HEX_SURFACE",
      "HEARTH_HEX_SURFACE_RENDERER",
      "HEARTH_HEX_SURFACE_INTERACTIVE_SPHERE_PAIR_RENDERER",
      "DEXTER_LAB.hearthHexSurface"
    ]
  });

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    publicCanvasStandard: PUBLIC_CANVAS_STANDARD,
    file: FILE,
    route: ROUTE,

    chapelOneBishop: true,
    chapelOneCongregation: "hands",
    bishopRole: "CHAPEL_ONE_PARENT_GATE_AND_FUNCTIONAL_BRIDGE_STANDARD",

    loaded: true,
    booted: false,
    disposed: false,

    ownsBishopAggregation: true,
    ownsCanvasToHexBridgePacket: true,
    ownsChapelOneMeasurementStandard: true,

    ownsDomMountRepair: false,
    ownsGeometryTruth: false,
    ownsContextTruth: false,
    ownsPaintTruth: false,
    ownsViewInputAuthority: false,
    ownsControls: false,
    ownsHexAuthorityTruth: false,
    ownsHexSurfaceTruth: false,
    ownsChapelTwoFingers: false,
    ownsFinalVisualPassClaim: false,

    handGeometryObserved: false,
    handContextObserved: false,
    handPaintObserved: false,
    handViewObserved: false,
    handInspectObserved: false,

    hexAuthorityBridgeObserved: false,
    hexSurfaceBridgeObserved: false,
    chapel2FingerObservedStatus: "NOT_MEASURED",

    lastBridgePacket: null,
    lastBridgeDelivery: null,
    lastViewPacket: null,

    bridgePacketCount: 0,
    bridgeDeliveryAttemptCount: 0,
    bridgeDeliverySuccessCount: 0,
    bridgeDeliveryHeldCount: 0,
    receivedPacketCount: 0,

    componentStatus: "LOADED_WAITING_BOOT",
    firstFailedCoordinate: "NOT_MEASURED",
    recommendedNextFile: HAND_GEOMETRY_FILE,
    recommendedNextAction: "BOOT_BISHOP_AND_MEASURE_CHAPEL_ONE_HAND_CONGREGATION",
    postgameStatus: "BISHOP_LOADED_WAITING_MEASUREMENT",

    updatedAt: "",
    events: [],
    errors: [],

    ...NO_CLAIMS
  };

  const api = {};

  function nowIso() {
    try { return new Date().toISOString(); } catch (_e) { return ""; }
  }

  function isObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function isFunction(value) {
    return typeof value === "function";
  }

  function clone(value) {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (_e) {
      if (Array.isArray(value)) return value.slice();
      if (isObject(value)) return { ...value };
      return value;
    }
  }

  function safeString(value, fallback = "") {
    if (value === undefined || value === null) return fallback;
    try { return String(value); } catch (_e) { return fallback; }
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function setPath(path, value) {
    const parts = safeString(path).split(".").filter(Boolean);
    if (!parts.length) return false;
    let cursor = root;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = value;
    return true;
  }

  function readPath(path) {
    const parts = safeString(path).split(".").filter(Boolean);
    let cursor = root;
    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }
    return cursor || null;
  }

  function firstGlobal(paths) {
    for (const path of paths || []) {
      const value = readPath(path);
      if (value && (isObject(value) || isFunction(value))) return { path, value };
    }
    return { path: "NONE", value: null };
  }

  function record(event, detail = {}) {
    const item = { at: nowIso(), event: safeString(event), detail: clone(detail) };
    state.events.push(item);
    if (state.events.length > 120) state.events.splice(0, state.events.length - 120);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code),
      message: safeString(error && error.message ? error.message : error),
      detail: clone(detail)
    };
    state.errors.push(item);
    if (state.errors.length > 80) state.errors.splice(0, state.errors.length - 80);
    state.updatedAt = item.at;
    return item;
  }

  function readReceipt(authority) {
    if (!authority || (!isObject(authority) && !isFunction(authority))) return {};
    const methods = ["getReceiptLight", "getReceipt", "getStatus", "getState", "getReport"];
    for (const method of methods) {
      if (!isFunction(authority[method])) continue;
      try {
        const out = method === "getReceiptLight" ? authority[method](false) : authority[method]();
        if (isObject(out)) return out;
      } catch (_e) {}
    }
    if (isObject(authority.receipt)) return authority.receipt;
    if (authority.contract || authority.receipt) return authority;
    return {};
  }

  function summarizeAuthority(paths, expectedFile) {
    const found = firstGlobal(paths);
    const receipt = readReceipt(found.value);
    return {
      observed: Boolean(found.value),
      path: found.path,
      file: expectedFile,
      contract: safeString(receipt.contract || found.value?.contract || "UNKNOWN"),
      receipt: safeString(receipt.receipt || found.value?.receipt || "UNKNOWN"),
      componentStatus: safeString(
        receipt.componentStatus ||
        receipt.postgameStatus ||
        receipt.status ||
        (found.value ? "OBSERVED" : "NOT_OBSERVED")
      ),
      firstFailedCoordinate: safeString(receipt.firstFailedCoordinate || "UNKNOWN"),
      recommendedNextFile: safeString(receipt.recommendedNextFile || expectedFile),
      recommendedNextAction: safeString(receipt.recommendedNextAction || "NONE")
    };
  }

  function measureCanonicalDom() {
    if (!doc) {
      return { domAvailable: false, chainValid: false, firstFailedCoordinate: "DOCUMENT_NOT_AVAILABLE" };
    }

    const mount = doc.querySelector(CANONICAL.mount);
    const frame = doc.querySelector(CANONICAL.frame);
    const canvas = doc.querySelector(CANONICAL.canvas);

    const rect = (node) => {
      if (!node || !node.getBoundingClientRect) return { width: 0, height: 0, nonzero: false };
      const r = node.getBoundingClientRect();
      const width = safeNumber(r.width, 0);
      const height = safeNumber(r.height, 0);
      return { width, height, nonzero: width > 0 && height > 0 };
    };

    const mountRect = rect(mount);
    const frameRect = rect(frame);
    const canvasRect = rect(canvas);

    let firstFailedCoordinate = "NONE";
    if (!mount) firstFailedCoordinate = "CANONICAL_MOUNT_NOT_FOUND";
    else if (!mountRect.nonzero) firstFailedCoordinate = "CANONICAL_MOUNT_RECT_ZERO";
    else if (!frame) firstFailedCoordinate = "CANONICAL_FRAME_NOT_FOUND";
    else if (!frameRect.nonzero) firstFailedCoordinate = "CANONICAL_FRAME_RECT_ZERO";
    else if (!canvas) firstFailedCoordinate = "CANONICAL_CANVAS_NOT_FOUND";
    else if (!canvasRect.nonzero) firstFailedCoordinate = "CANONICAL_CANVAS_RECT_ZERO";
    else if (!mount.contains(canvas) || !frame.contains(canvas)) firstFailedCoordinate = "CANONICAL_CHAIN_INVALID";

    return {
      domAvailable: true,
      mountFound: Boolean(mount),
      frameFound: Boolean(frame),
      canvasFound: Boolean(canvas),
      mountRectNonzero: mountRect.nonzero,
      frameRectNonzero: frameRect.nonzero,
      canvasRectNonzero: canvasRect.nonzero,
      chainValid: firstFailedCoordinate === "NONE",
      firstFailedCoordinate
    };
  }

  function refreshComponents() {
    const handGeometry = summarizeAuthority(HAND_ALIASES.geometry, HAND_GEOMETRY_FILE);
    const handContext = summarizeAuthority(HAND_ALIASES.context, HAND_CONTEXT_FILE);
    const handPaint = summarizeAuthority(HAND_ALIASES.paint, HAND_PAINT_FILE);
    const handView = summarizeAuthority(HAND_ALIASES.view, HAND_VIEW_FILE);
    const handInspect = summarizeAuthority(HAND_ALIASES.inspect, HAND_INSPECT_FILE);

    const hexAuthority = summarizeAuthority(BRIDGE_ALIASES.hexAuthority, HEX_AUTHORITY_FILE);
    const hexSurface = summarizeAuthority(BRIDGE_ALIASES.hexSurface, HEX_SURFACE_FILE);

    state.handGeometryObserved = handGeometry.observed;
    state.handContextObserved = handContext.observed;
    state.handPaintObserved = handPaint.observed;
    state.handViewObserved = handView.observed;
    state.handInspectObserved = handInspect.observed;
    state.hexAuthorityBridgeObserved = hexAuthority.observed;
    state.hexSurfaceBridgeObserved = hexSurface.observed;

    return {
      handGeometry,
      handContext,
      handPaint,
      handView,
      handInspect,
      hexAuthority,
      hexSurface
    };
  }

  function deriveStatus(parts, dom) {
    if (!dom.chainValid && !parts.handGeometry.observed) {
      return {
        componentStatus: "HELD_GEOMETRY_HAND_REQUIRED",
        firstFailedCoordinate: dom.firstFailedCoordinate,
        recommendedNextFile: HAND_GEOMETRY_FILE,
        recommendedNextAction: "CRAFT_OR_LOAD_CHAPEL_ONE_HAND_GEOMETRY_FILE"
      };
    }

    if (!parts.handContext.observed) {
      return {
        componentStatus: "HELD_CONTEXT_HAND_REQUIRED",
        firstFailedCoordinate: "HAND_CONTEXT_NOT_OBSERVED",
        recommendedNextFile: HAND_CONTEXT_FILE,
        recommendedNextAction: "CRAFT_OR_LOAD_CHAPEL_ONE_HAND_CONTEXT_FILE"
      };
    }

    if (!parts.handView.observed) {
      return {
        componentStatus: "HELD_VIEW_HAND_REQUIRED",
        firstFailedCoordinate: "HAND_VIEW_NOT_OBSERVED",
        recommendedNextFile: HAND_VIEW_FILE,
        recommendedNextAction: "CRAFT_OR_LOAD_CHAPEL_ONE_HAND_VIEW_FILE"
      };
    }

    if (!parts.handPaint.observed) {
      return {
        componentStatus: "HELD_PAINT_HAND_REQUIRED",
        firstFailedCoordinate: "HAND_PAINT_NOT_OBSERVED",
        recommendedNextFile: HAND_PAINT_FILE,
        recommendedNextAction: "CRAFT_OR_LOAD_CHAPEL_ONE_HAND_PAINT_FILE"
      };
    }

    if (!parts.handInspect.observed) {
      return {
        componentStatus: "HELD_INSPECT_HAND_REQUIRED",
        firstFailedCoordinate: "HAND_INSPECT_NOT_OBSERVED",
        recommendedNextFile: HAND_INSPECT_FILE,
        recommendedNextAction: "CRAFT_OR_LOAD_CHAPEL_ONE_HAND_INSPECT_FILE"
      };
    }

    if (!parts.hexAuthority.observed) {
      return {
        componentStatus: "HELD_HEX_AUTHORITY_BRIDGE_REQUIRED",
        firstFailedCoordinate: "HEX_AUTHORITY_BRIDGE_NOT_OBSERVED",
        recommendedNextFile: HEX_AUTHORITY_FILE,
        recommendedNextAction: "LOAD_OR_RENEW_HEX_AUTHORITY_CONGRESSIONAL_BRIDGE"
      };
    }

    if (!parts.hexSurface.observed) {
      return {
        componentStatus: "HELD_HEX_SURFACE_BRIDGE_GATE_REQUIRED",
        firstFailedCoordinate: "HEX_SURFACE_BRIDGE_GATE_NOT_OBSERVED",
        recommendedNextFile: HEX_SURFACE_FILE,
        recommendedNextAction: "LOAD_OR_RENEW_HEX_SURFACE_BRIDGE_GATE"
      };
    }

    return {
      componentStatus: "BISHOP_READY_FOR_CANVAS_TO_HEX_BRIDGE_PACKET",
      firstFailedCoordinate: "NONE",
      recommendedNextFile: HEX_SURFACE_FILE,
      recommendedNextAction: "SEND_LAWFUL_CANVAS_TO_HEX_BRIDGE_PACKET"
    };
  }

  function composeBridgePacket(sourcePacket = {}, options = {}) {
    const parts = refreshComponents();
    const dom = measureCanonicalDom();

    state.bridgePacketCount += 1;

    const packet = {
      packetType: "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_TO_HEX_BRIDGE_PACKET_v13",
      contract: CONTRACT,
      receipt: RECEIPT,
      publicCanvasStandard: PUBLIC_CANVAS_STANDARD,
      sourceFile: FILE,
      sourceAuthority: "HEARTH_CANVAS_BISHOP",
      sourceRole: "CHAPEL_ONE_PARENT_GATE_AND_FUNCTIONAL_BRIDGE_STANDARD",
      destinationFile: HEX_SURFACE_FILE,
      handoffTo: "HEARTH_HEX_SURFACE",

      route: ROUTE,
      canonicalDom: dom,
      canonicalSelectors: CANONICAL,

      chapelOneBishop: true,
      chapelOneCongregation: "hands",
      chapelTwoCongregation: "fingers",
      congressionalBridgeFile: HEX_AUTHORITY_FILE,
      hexSurfaceBridgeGateFile: HEX_SURFACE_FILE,

      handGeometryObserved: state.handGeometryObserved,
      handContextObserved: state.handContextObserved,
      handPaintObserved: state.handPaintObserved,
      handViewObserved: state.handViewObserved,
      handInspectObserved: state.handInspectObserved,

      componentReceipts: clone(parts),

      viewState: clone(sourcePacket.viewState || options.viewState || {}),
      sourcePacket: clone(sourcePacket),

      canvasHexGateAuthorized: true,
      hexSurfaceGateAuthorized: true,
      pointerFingerTransmissionAuthorized: true,
      canvasLifecycleCallAuthorized: false,
      canvasCreationAuthorized: false,
      canvasDrawingClaimedByBishop: false,
      finalVisualPassAuthority: false,

      composedAt: nowIso(),
      ...NO_CLAIMS
    };

    state.lastBridgePacket = clone(packet);
    publishBridgePacket(packet);
    return packet;
  }

  function deliverToHexSurface(packet) {
    state.bridgeDeliveryAttemptCount += 1;

    const found = firstGlobal(BRIDGE_ALIASES.hexSurface);
    const surface = found.value;

    const methods = [
      "receiveCanvasHexGatePacket",
      "consumeCanvasHexGatePacket",
      "acceptCanvasHexGatePacket",
      "receiveCanvasViewPacket",
      "receiveInteractiveFramePacket",
      "receive"
    ];

    if (!surface) {
      state.bridgeDeliveryHeldCount += 1;
      state.lastBridgeDelivery = {
        delivered: false,
        status: "HEX_SURFACE_NOT_OBSERVED",
        method: "NONE",
        target: HEX_SURFACE_FILE,
        at: nowIso()
      };
      return clone(state.lastBridgeDelivery);
    }

    for (const method of methods) {
      if (!isFunction(surface[method])) continue;

      try {
        const result = surface[method](clone(packet), {
          source: "HEARTH_CANVAS_BISHOP",
          callerFile: FILE,
          bishopBridgeStandard: true,
          noCanvasLifecycleCall: true,
          noFinalVisualPassClaim: true
        });

        state.bridgeDeliverySuccessCount += 1;
        state.lastBridgeDelivery = {
          delivered: true,
          status: "DELIVERED_TO_HEX_SURFACE_BRIDGE_GATE",
          method,
          target: found.path,
          resultObserved: isObject(result),
          at: nowIso()
        };
        return clone(state.lastBridgeDelivery);
      } catch (error) {
        recordError("HEARTH_CANVAS_BISHOP_HEX_SURFACE_DELIVERY_FAILED", error, { method });
      }
    }

    state.bridgeDeliveryHeldCount += 1;
    state.lastBridgeDelivery = {
      delivered: false,
      status: "HEX_SURFACE_PUBLIC_RECEIVER_METHOD_MISSING",
      method: "NONE",
      target: found.path,
      at: nowIso()
    };
    return clone(state.lastBridgeDelivery);
  }

  function receivePacket(packet = {}, options = {}) {
    state.receivedPacketCount += 1;
    state.lastViewPacket = clone(packet);

    const bridgePacket = composeBridgePacket(packet, options);
    const delivery = options.deliver === false
      ? { delivered: false, status: "DELIVERY_SUPPRESSED_BY_CALLER", at: nowIso() }
      : deliverToHexSurface(bridgePacket);

    publishGlobals("receive-packet");

    return {
      ...getReceiptLight(false),
      accepted: true,
      bridgePacket,
      delivery,
      ...NO_CLAIMS
    };
  }

  function publishBridgePacket(packet) {
    root.HEARTH_CANVAS_BISHOP_LAST_BRIDGE_PACKET = clone(packet);
    root.HEARTH_CANVAS_TO_HEX_BRIDGE_PACKET = clone(packet);

    root.HEARTH = root.HEARTH || {};
    root.HEARTH.canvasBishopLastBridgePacket = clone(packet);
    root.HEARTH.canvasToHexBridgePacket = clone(packet);

    root.DEXTER_LAB = root.DEXTER_LAB || {};
    root.DEXTER_LAB.hearthCanvasBishopLastBridgePacket = clone(packet);
  }

  function updateDataset() {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return false;
    const d = doc.documentElement.dataset;

    d.hearthCanvasLoaded = "true";
    d.hearthCanvasPresent = "true";
    d.hearthCanvasContract = CONTRACT;
    d.hearthCanvasReceipt = RECEIPT;
    d.hearthCanvasPublicStandard = PUBLIC_CANVAS_STANDARD;
    d.hearthCanvasFile = FILE;

    d.hearthCanvasBishop = "true";
    d.hearthChapelOneBishop = "true";
    d.hearthChapelOneCongregation = "hands";

    d.hearthCanvasHandGeometryObserved = String(state.handGeometryObserved);
    d.hearthCanvasHandContextObserved = String(state.handContextObserved);
    d.hearthCanvasHandPaintObserved = String(state.handPaintObserved);
    d.hearthCanvasHandViewObserved = String(state.handViewObserved);
    d.hearthCanvasHandInspectObserved = String(state.handInspectObserved);

    d.hearthCanvasHexAuthorityBridgeObserved = String(state.hexAuthorityBridgeObserved);
    d.hearthCanvasHexSurfaceBridgeObserved = String(state.hexSurfaceBridgeObserved);

    d.hearthCanvasComponentStatus = state.componentStatus;
    d.hearthCanvasFirstFailedCoordinate = state.firstFailedCoordinate;
    d.hearthCanvasRecommendedNextFile = state.recommendedNextFile;
    d.hearthCanvasRecommendedNextAction = state.recommendedNextAction;
    d.hearthCanvasPostgameStatus = state.postgameStatus;

    d.hearthCanvasF13Claimed = "false";
    d.hearthCanvasF21Claimed = "false";
    d.hearthCanvasReadyTextClaimed = "false";
    d.hearthCanvasVisualPassClaimed = "false";
    d.generatedImage = "false";
    d.graphicBox = "false";
    d.webgl = "false";

    return true;
  }

  function publishGlobals(reason = "publish") {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    for (const alias of ALIASES) setPath(alias, api);

    const receipt = getReceiptLight(false);

    root.HEARTH_CANVAS_RECEIPT = receipt;
    root.HEARTH_CANVAS_BISHOP_RECEIPT = receipt;
    root.HEARTH_CANVAS_CHAPEL_ONE_BISHOP_RECEIPT = receipt;

    root.HEARTH.canvasReceipt = receipt;
    root.HEARTH.canvasBishopReceipt = receipt;
    root.HEARTH.chapelOneBishopReceipt = receipt;

    root.DEXTER_LAB.hearthCanvasReceipt = receipt;
    root.DEXTER_LAB.hearthCanvasBishopReceipt = receipt;

    updateDataset();
    record("HEARTH_CANVAS_BISHOP_GLOBALS_PUBLISHED", { reason });
    return true;
  }

  function refresh() {
    const parts = refreshComponents();
    const dom = measureCanonicalDom();
    const verdict = deriveStatus(parts, dom);

    state.componentStatus = verdict.componentStatus;
    state.firstFailedCoordinate = verdict.firstFailedCoordinate;
    state.recommendedNextFile = verdict.recommendedNextFile;
    state.recommendedNextAction = verdict.recommendedNextAction;
    state.postgameStatus = verdict.componentStatus;

    updateDataset();
    return getReceiptLight(false);
  }

  function boot() {
    state.booted = true;
    state.updatedAt = nowIso();
    refresh();
    publishGlobals("boot");
    return getReceipt();
  }

  function dispose(reason = "manual-dispose") {
    state.disposed = true;
    state.componentStatus = "DISPOSED";
    state.postgameStatus = "BISHOP_DISPOSED";
    record("HEARTH_CANVAS_BISHOP_DISPOSED", { reason });
    publishGlobals("dispose");
    return getReceipt();
  }

  function getReceiptLight(doRefresh = false) {
    if (doRefresh) refresh();

    const parts = refreshComponents();
    const dom = measureCanonicalDom();

    return {
      packetType: "HEARTH_CANVAS_BISHOP_CHAPEL_ONE_FUNCTIONAL_BRIDGE_STANDARD_RECEIPT_PACKET_v13",
      contract: CONTRACT,
      CONTRACT,
      receipt: RECEIPT,
      RECEIPT,
      publicCanvasStandard: PUBLIC_CANVAS_STANDARD,
      file: FILE,
      route: ROUTE,

      chapelOneBishop: true,
      chapelOneCongregation: "hands",
      bishopRole: state.bishopRole,

      canonicalSelectors: CANONICAL,
      canonicalDom: dom,

      handGeometryFile: HAND_GEOMETRY_FILE,
      handContextFile: HAND_CONTEXT_FILE,
      handPaintFile: HAND_PAINT_FILE,
      handViewFile: HAND_VIEW_FILE,
      handInspectFile: HAND_INSPECT_FILE,

      hexAuthorityFile: HEX_AUTHORITY_FILE,
      hexSurfaceFile: HEX_SURFACE_FILE,

      fingerSurfaceFile: FINGER_SURFACE_FILE,
      fingerBoundaryFile: FINGER_BOUNDARY_FILE,
      fingerInspectFile: FINGER_INSPECT_FILE,
      fingerLightFile: FINGER_LIGHT_FILE,

      handGeometryObserved: state.handGeometryObserved,
      handContextObserved: state.handContextObserved,
      handPaintObserved: state.handPaintObserved,
      handViewObserved: state.handViewObserved,
      handInspectObserved: state.handInspectObserved,

      hexAuthorityBridgeObserved: state.hexAuthorityBridgeObserved,
      hexSurfaceBridgeObserved: state.hexSurfaceBridgeObserved,
      chapel2FingerObservedStatus: state.chapel2FingerObservedStatus,

      componentReceipts: clone(parts),

      componentStatus: state.componentStatus,
      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      bridgePacketCount: state.bridgePacketCount,
      bridgeDeliveryAttemptCount: state.bridgeDeliveryAttemptCount,
      bridgeDeliverySuccessCount: state.bridgeDeliverySuccessCount,
      bridgeDeliveryHeldCount: state.bridgeDeliveryHeldCount,
      receivedPacketCount: state.receivedPacketCount,
      lastBridgeDelivery: clone(state.lastBridgeDelivery),

      ownsBishopAggregation: true,
      ownsCanvasToHexBridgePacket: true,
      ownsChapelOneMeasurementStandard: true,
      ownsDomMountRepair: false,
      ownsGeometryTruth: false,
      ownsContextTruth: false,
      ownsPaintTruth: false,
      ownsViewInputAuthority: false,
      ownsControls: false,
      ownsHexAuthorityTruth: false,
      ownsHexSurfaceTruth: false,
      ownsChapelTwoFingers: false,

      ...NO_CLAIMS,
      updatedAt: nowIso()
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      state: clone(state),
      events: clone(state.events),
      errors: clone(state.errors),
      lastBridgePacket: clone(state.lastBridgePacket),
      lastViewPacket: clone(state.lastViewPacket),
      ...NO_CLAIMS
    };
  }

  Object.assign(api, {
    contract: CONTRACT,
    CONTRACT,
    receipt: RECEIPT,
    RECEIPT,
    publicCanvasStandard: PUBLIC_CANVAS_STANDARD,
    file: FILE,
    route: ROUTE,

    boot,
    init: boot,
    start: boot,
    run: boot,
    refresh,
    dispose,

    composeBridgePacket,
    deliverToHexSurface,
    receivePacket,
    receive: receivePacket,

    receiveRouteConductorCanvasTransactionPacket: receivePacket,
    consumeRouteConductorCanvasTransactionPacket: receivePacket,
    acceptRouteConductorCanvasTransactionPacket: receivePacket,
    receiveCanvasHandoffPacket: receivePacket,
    receiveGovernedSourcePacket: receivePacket,
    receivePresentationPacket: receivePacket,
    receiveViewControlPacket: receivePacket,
    consumeViewControlPacket: receivePacket,
    receivePlanetaryViewControlPacket: receivePacket,
    consumePlanetaryViewControlPacket: receivePacket,

    getReceiptLight,
    getReceipt,
    getStatus: getReceiptLight,
    getReport: getReceipt,
    getState: () => clone(state),

    publishGlobals,
    updateDataset,
    measureCanonicalDom,
    refreshComponents,

    chapelOneBishop: true,
    chapelOneCongregation: "hands",
    ownsBishopAggregation: true,
    ownsCanvasToHexBridgePacket: true,
    ownsChapelOneMeasurementStandard: true,
    ownsControls: false,
    ownsHexAuthorityTruth: false,
    ownsHexSurfaceTruth: false,
    ownsChapelTwoFingers: false,

    ...NO_CLAIMS,

    get state() {
      return state;
    }
  });

  try {
    publishGlobals("initial-publication");
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
    recordError("HEARTH_CANVAS_BISHOP_INITIALIZATION_FAILED", error);
    try { publishGlobals("initialization-fallback"); } catch (_e) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
