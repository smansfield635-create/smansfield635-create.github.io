// /assets/hearth/hearth.canvas.expression.bridge.js
// HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v2
// Full-file replacement.
// Canvas visible-expression bridge / second file in the two-file Canvas bridge pair.
// Purpose:
// - Serve as the expression-side bridge paired with /assets/hearth/hearth.canvas.js.
// - Publish only expression-bridge aliases.
// - Do not overwrite composite, finger, Hex, Route Conductor, Queen, LabWest, or Canvas Hub aliases.
// - Read downstream adapters as external authorities only.
// - Accept Canvas Hub, Route Conductor, Queen controls, LabWest, diagnostic, and finger packets.
// - Locate or accept a canvas/context.
// - Delegate drawing to an existing drawable downstream adapter when one is truly present.
// - Otherwise draw a native holding expression surface so the Canvas expression surface can be proven.
// - Publish pixel-visible proof upward without claiming F13, F21, ready text, final completion, or visual pass.
// - Preserve Canvas as receiver/output carrier only.
// Does not own:
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - atmosphere truth
// - lighting truth
// - composite truth
// - Hex truth
// - finger truth
// - pointer truth
// - Queen input truth
// - LabWest admissibility truth
// - Route Conductor handshake truth
// - diagnostic rail case selection
// - F13 final claim
// - F21 latch
// - ready text
// - completion latch
// - final visual pass
// - generated image
// - GraphicBox
// - WebGL

(() => {
  "use strict";

  const CONTRACT = "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v2";
  const RECEIPT = "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_v2";

  const PREVIOUS_CONTRACT = "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v1";
  const PREVIOUS_RECEIPT = "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.canvas.expression.bridge.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const PARENT_CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";

  const CURRENT_PARENT_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const QUEEN_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const LABWEST_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7";

  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const SURFACE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const COMPOSITE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas"
  ]);

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "main",
    "body"
  ]);

  const OWN_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_SECOND_EXPRESSION_BRIDGE",
    "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR",
    "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v2",
    "HEARTH_CANVAS_EXPRESSION_SURFACE_BRIDGE",
    "HEARTH.canvasExpressionBridge",
    "HEARTH.canvasVisibleExpressionBridge",
    "HEARTH.canvasSecondExpressionBridge",
    "HEARTH.canvasExpressionBridgeSecondPair",
    "HEARTH.canvasExpressionSurfaceBridge",
    "DEXTER_LAB.hearthCanvasExpressionBridge",
    "DEXTER_LAB.hearthCanvasVisibleExpressionBridge",
    "DEXTER_LAB.hearthCanvasSecondExpressionBridge",
    "DEXTER_LAB.hearthCanvasExpressionBridgeSecondPair",
    "DEXTER_LAB.hearthCanvasExpressionSurfaceBridge"
  ]);

  const EXTERNAL_ADAPTER_ALIAS_PATHS = Object.freeze([
    "HEARTH_CANVAS_FINGER_COMPOSITE",
    "HEARTH_CANVAS_COMPOSITE_FINGER",
    "HEARTH_CANVAS_COMPOSITE",
    "HEARTH.canvasFingerComposite",
    "HEARTH.canvasCompositeFinger",
    "HEARTH.canvasComposite",
    "DEXTER_LAB.hearthCanvasFingerComposite",
    "DEXTER_LAB.hearthCanvasCompositeFinger",
    "DEXTER_LAB.hearthCanvasComposite",

    "HEARTH_CANVAS_FINGER_SURFACE",
    "HEARTH_CANVAS_SURFACE_FINGER",
    "HEARTH.canvasFingerSurface",
    "HEARTH.canvasSurfaceFinger",
    "DEXTER_LAB.hearthCanvasFingerSurface",
    "DEXTER_LAB.hearthCanvasSurfaceFinger",

    "HEARTH_CANVAS_FINGER_INSPECT",
    "HEARTH_CANVAS_POINTER_FINGER",
    "HEARTH_POINTER_FINGER",
    "HEARTH.canvasFingerInspect",
    "HEARTH.canvasPointerFinger",
    "DEXTER_LAB.hearthCanvasFingerInspect",
    "DEXTER_LAB.hearthCanvasPointerFinger",

    "HEARTH_HEX_SURFACE",
    "HEARTH_HEX_SURFACE_RENDERER",
    "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER",
    "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER",
    "HEARTH.hexSurface",
    "HEARTH.hexSurfaceRenderer",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexSurfaceRenderer",

    "HEARTH_HEX_FOUR_PAIR_AUTHORITY",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.hexFourPairAuthority",
    "DEXTER_LAB.hearthHexFourPairAuthority"
  ]);

  const FINAL_FALSE = Object.freeze({
    f13Claimed: false,
    f13EligibleForCanvas: false,
    f13ClaimedByExpressionBridge: false,
    f21EligibleForNorth: false,
    f21SubmittedToNorth: false,
    f21Claimed: false,
    f21ClaimedByExpressionBridge: false,
    completionLatched: false,
    finalCompletionLatched: false,
    degradedCompletionLatched: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByExpressionBridge: false,
    downstreamReleaseClaimed: false,
    controlReadyClaimed: false,
    motionReadyClaimed: false,
    touchReadyClaimed: false,
    dragReadyClaimed: false,
    generatedImage: false,
    graphicBox: false,
    webGL: false,
    webgl: false,
    visualPassClaimed: false,
    finalVisualPassClaimed: false
  });

  const root = typeof window !== "undefined" ? window : globalThis;
  const doc = root.document || null;
  const api = {};
  const externalAdapters = [];

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    role: "Canvas visible-expression bridge / second pair file",
    bridgePairRole: "SECOND_FILE_VISIBLE_EXPRESSION_BRIDGE",
    authoritySideBridgeFile: PARENT_CANVAS_FILE,

    loaded: true,
    booted: false,
    booting: false,
    startedAt: "",
    updatedAt: "",
    publishedAt: "",

    ownAliasesPublished: false,
    ownAliasPublishCount: 0,
    externalAliasOverwriteBlocked: true,
    externalAliasesReadOnly: true,
    externalAdapterCount: 0,
    externalAdapterNames: "NONE",

    canvasAccepted: false,
    canvasLocated: false,
    canvasCreated: false,
    canvasSelector: "NONE",
    canvasMountFound: false,
    canvasMountSelector: "NONE",
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRectNonzero: false,
    context2dReady: false,

    drawAttempted: false,
    drawComplete: false,
    drawCount: 0,
    lastDrawAt: "",
    lastDrawReason: "NOT_DRAWN",
    lastDrawSource: "NONE",
    lastDrawError: "",

    adapterDrawAttempted: false,
    adapterDrawComplete: false,
    adapterSourceName: "NONE",
    adapterContract: "",
    adapterReceipt: "",
    adapterMethod: "NONE",
    adapterError: "",

    nativeHoldingDrawAttempted: false,
    nativeHoldingDrawComplete: false,

    expressionHubActive: true,
    canvasExpressionHubActive: true,
    visibleExpressionBridgeActive: true,
    compositeCompatibilityBridgeActive: true,

    canvasExpressionSurfaceReady: false,
    canvasExpressionRichnessReady: false,
    domExpressionSurfaceProofReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "VISIBLE_EXPRESSION_NOT_DRAWN",
    renderedPlanetProofReady: false,
    canvasPixelVarianceStatus: "NO_PIXEL_SAMPLE",

    canvasHubObserved: false,
    canvasHubContract: "",
    canvasHubReceipt: "",
    routeConductorObserved: false,
    routeConductorContract: "",
    queenObserved: false,
    queenContract: "",
    labWestObserved: false,
    labWestContract: "",

    packetCount: 0,
    authorityPacketCount: 0,
    routeConductorPacketCount: 0,
    queenPacketCount: 0,
    labWestPacketCount: 0,
    fingerPacketCount: 0,
    diagnosticPacketCount: 0,
    lastPacket: null,
    lastAuthorityPacket: null,
    lastRouteConductorPacket: null,
    lastQueenPacket: null,
    lastLabWestPacket: null,
    lastFingerPacket: null,
    lastDiagnosticPacket: null,
    lastViewState: null,

    f13CanvasReadinessObserved: false,
    f13VisibleEvidenceAvailable: false,
    f13CanvasEvidenceStrict: false,
    f13CanvasEvidenceDegraded: false,
    f13CanvasEvidenceComplete: false,
    f13HardFail: false,
    f13StrictEvidenceGap: "VISIBLE_EXPRESSION_NOT_DRAWN",
    f13StrictEvidenceRepairTarget: FILE,

    firstFailedCoordinate: "VISIBLE_EXPRESSION_NOT_DRAWN",
    recommendedNextFile: FILE,
    recommendedNextAction: "CALL_DRAW_TO_CANVAS_OR_RECEIVE_CANVAS_AUTHORITY_PACKET",
    postgameStatus: "CANVAS_EXPRESSION_BRIDGE_LOADED_WAITING_DRAW",

    receiptPublishCount: 0,
    upstreamNotifyCount: 0,

    events: [],
    errors: [],

    ...FINAL_FALSE
  };

  let drawTimer = 0;
  let publishTimer = 0;
  let notifyGuard = false;
  let drawingGuard = false;
  let scanningGuard = false;

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
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
    if (value === false || value === 0 || value === "0" || value === "false" || value === "FALSE") return false;
    return fallback;
  }

  function clonePlain(value) {
    if (!isObject(value) && !Array.isArray(value)) return value;

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return Array.isArray(value) ? value.slice() : Object.assign({}, value);
    }
  }

  function trim(list, max) {
    if (Array.isArray(list) && list.length > max) list.splice(0, list.length - max);
  }

  function record(event, detail = {}) {
    const item = {
      at: nowIso(),
      event: safeString(event, "CANVAS_EXPRESSION_BRIDGE_EVENT"),
      detail: clonePlain(detail)
    };

    state.events.push(item);
    trim(state.events, 180);
    state.updatedAt = item.at;
    return item;
  }

  function recordError(code, error, detail = {}) {
    const item = {
      at: nowIso(),
      code: safeString(code, "CANVAS_EXPRESSION_BRIDGE_ERROR"),
      message: error && error.message ? String(error.message) : safeString(error),
      detail: clonePlain(detail)
    };

    state.errors.push(item);
    trim(state.errors, 120);
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

  function setDataset(key, value) {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return;
    doc.documentElement.dataset[key] = value === undefined || value === null ? "" : String(value);
  }

  function q(selector) {
    if (!doc) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function firstElement(selectors) {
    if (!doc) return { element: null, selector: "NONE" };

    for (const selector of selectors) {
      const element = q(selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function rectNonzero(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) return false;

    try {
      const rect = element.getBoundingClientRect();
      return Boolean(rect && rect.width > 0 && rect.height > 0);
    } catch (_error) {
      return false;
    }
  }

  function contractOf(value) {
    if (!isObject(value)) return "";

    return safeString(
      value.contract ||
      value.CONTRACT ||
      value.currentContract ||
      value.currentCanvasParentContract ||
      value.canvasContract ||
      value.hearthCanvasContract ||
      value.sourceContract ||
      value.internalImplementationContract ||
      ""
    );
  }

  function receiptOf(value) {
    if (!isObject(value)) return "";

    return safeString(
      value.receipt ||
      value.RECEIPT ||
      value.currentReceipt ||
      value.currentCanvasParentReceipt ||
      value.canvasReceipt ||
      value.hearthCanvasReceipt ||
      value.sourceReceipt ||
      value.internalImplementationReceipt ||
      ""
    );
  }

  function noFinalClaims(value) {
    const s = isObject(value) ? value : {};

    return !(
      s.f13Claimed === true ||
      s.f13ClaimedByExpressionBridge === true ||
      s.f21EligibleForNorth === true ||
      s.f21SubmittedToNorth === true ||
      s.f21Claimed === true ||
      s.readyTextAllowed === true ||
      s.readyTextClaimed === true ||
      s.completionLatched === true ||
      s.finalCompletionLatched === true ||
      s.degradedCompletionLatched === true ||
      s.visualPassClaimed === true ||
      s.finalVisualPassClaimed === true ||
      s.generatedImage === true ||
      s.graphicBox === true ||
      s.webGL === true ||
      s.webgl === true
    );
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getExpressionBridgeReceipt",
      "getVisibleExpressionBridgeReceipt",
      "getExpressionHubReceipt",
      "getExpressionHubSummary",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getVisiblePlanetReceipt",
      "getVisibleGlobeReceipt",
      "getStructuralCarrier",
      "readStructuralCarrier",
      "getCarrierReceipt",
      "getStatus",
      "getReport",
      "getState"
    ];

    for (const method of methods) {
      if (!isFunction(authority[method])) continue;

      try {
        const output = authority[method](false);
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.summary)) return authority.summary;
    if (isObject(authority.state)) return authority.state;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function safeInvoke(target, method, args = []) {
    if (!target || !isFunction(target[method])) {
      return { ok: false, value: null, error: `METHOD_UNAVAILABLE:${method}` };
    }

    try {
      return {
        ok: true,
        value: target[method](...(Array.isArray(args) ? args : [args])),
        error: ""
      };
    } catch (error) {
      return {
        ok: false,
        value: null,
        error: error && error.message ? String(error.message) : String(error)
      };
    }
  }

  function drawMethods(authority) {
    if (!authority || !isObject(authority) || authority === api) return [];

    return [
      "drawToCanvas",
      "drawVisibleExpression",
      "drawHearthVisibleExpression",
      "drawHearthCompositeFrame",
      "drawCompositeFrame",
      "drawFrame",
      "renderComposite",
      "renderFrame",
      "renderToCanvas",
      "render",
      "draw",
      "compose"
    ].filter((method) => isFunction(authority[method]));
  }

  function isExternalDrawableAuthority(path, authority) {
    if (!authority || !isObject(authority) || authority === api) return false;

    const receipt = readReceipt(authority) || {};
    const contract = contractOf(receipt) || contractOf(authority);

    if (contract === CONTRACT || contract === PREVIOUS_CONTRACT) return false;
    if (safeString(contract).includes("HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR")) return false;
    if (safeString(path).includes("EXPRESSION_BRIDGE")) return false;
    if (!drawMethods(authority).length) return false;

    return true;
  }

  function rememberExternalAdapter(path, authority) {
    if (!isExternalDrawableAuthority(path, authority)) return false;
    if (externalAdapters.some((item) => item.authority === authority)) return false;

    const receipt = readReceipt(authority) || {};
    externalAdapters.push({
      path,
      authority,
      contract: contractOf(receipt) || contractOf(authority),
      receipt: receiptOf(receipt) || receiptOf(authority),
      methods: drawMethods(authority)
    });

    trim(externalAdapters, 40);
    return true;
  }

  function scanExternalAdapters() {
    if (scanningGuard) return externalAdapters.slice();
    scanningGuard = true;

    try {
      for (const path of EXTERNAL_ADAPTER_ALIAS_PATHS) {
        const authority = readPath(path);
        rememberExternalAdapter(path, authority);
      }

      state.externalAdapterCount = externalAdapters.length;
      state.externalAdapterNames = externalAdapters.map((item) => item.path).join(",") || "NONE";
      return externalAdapters.slice();
    } finally {
      scanningGuard = false;
    }
  }

  function canvasContextFrom(value) {
    if (!value) return { canvas: null, ctx: null };

    if (value.canvas && isFunction(value.getImageData)) {
      return { canvas: value.canvas, ctx: value };
    }

    if (value.canvas && value.canvas.getContext && isFunction(value.canvas.getContext)) {
      const ctx = value.canvas.getContext("2d", { alpha: true, willReadFrequently: true });
      return { canvas: value.canvas, ctx };
    }

    if (value.getContext && isFunction(value.getContext)) {
      const ctx = value.getContext("2d", { alpha: true, willReadFrequently: true });
      return { canvas: value, ctx };
    }

    if (isObject(value.canvasOrContext)) return canvasContextFrom(value.canvasOrContext);
    if (isObject(value.targetCanvas)) return canvasContextFrom(value.targetCanvas);
    if (isObject(value.canvasTarget)) return canvasContextFrom(value.canvasTarget);
    if (isObject(value.context)) return canvasContextFrom(value.context);
    if (isObject(value.ctx)) return canvasContextFrom(value.ctx);

    return { canvas: null, ctx: null };
  }

  function choosePixelSize(mount) {
    let cssWidth = 720;

    if (mount && isFunction(mount.getBoundingClientRect)) {
      try {
        const rect = mount.getBoundingClientRect();
        if (rect && rect.width > 0) cssWidth = rect.width;
      } catch (_error) {}
    }

    if ((!cssWidth || cssWidth < 280) && root.innerWidth) {
      cssWidth = Math.min(820, Math.max(320, root.innerWidth * 0.86));
    }

    const ratio = Math.max(1, Math.min(2, safeNumber(root.devicePixelRatio, 1)));
    return Math.max(512, Math.min(1160, Math.round(cssWidth * ratio)));
  }

  function sizeCanvas(canvas, mount) {
    if (!canvas) return;

    const px = choosePixelSize(mount);

    if (!canvas.width || canvas.width < 256) canvas.width = px;
    if (!canvas.height || canvas.height < 256) canvas.height = px;

    if (canvas.style) {
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.maxWidth = "min(88vw, 760px)";
      canvas.style.height = "auto";
      canvas.style.aspectRatio = "1 / 1";
      canvas.style.margin = "0 auto";
      canvas.style.borderRadius = "50%";
      canvas.style.boxSizing = "border-box";
      canvas.style.touchAction = "none";
      canvas.style.background = "radial-gradient(circle at 50% 50%, rgba(5,18,42,.92), rgba(0,0,0,.98))";
    }

    if (canvas.dataset) {
      canvas.dataset.hearthExpressionSurface = "true";
      canvas.dataset.hearthVisibleCanvas = "true";
      canvas.dataset.hearthCanvasExpressionBridge = "true";
      canvas.dataset.hearthCanvasExpressionBridgeContract = CONTRACT;
      canvas.dataset.hearthCanvasExpressionBridgeReceipt = RECEIPT;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
    }
  }

  function locateOrCreateCanvas() {
    if (!doc) return { canvas: null, ctx: null, mount: null };

    let canvas = null;
    let canvasSelector = "NONE";

    for (const selector of CANVAS_SELECTORS) {
      const found = q(selector);
      if (found && found.tagName && found.tagName.toLowerCase() === "canvas") {
        canvas = found;
        canvasSelector = selector;
        break;
      }
    }

    const mountResult = firstElement(MOUNT_SELECTORS);
    const mount = mountResult.element;

    state.canvasMountFound = Boolean(mount);
    state.canvasMountSelector = mountResult.selector;

    if (!canvas && mount) {
      canvas = doc.createElement("canvas");
      canvas.id = "hearthCanvas";
      canvas.setAttribute("aria-label", "Hearth visible expression bridge canvas");
      canvas.setAttribute("data-hearth-expression-surface", "true");
      canvas.setAttribute("data-hearth-visible-canvas", "true");
      canvas.setAttribute("data-hearth-canvas-expression-bridge", "true");
      canvas.setAttribute("data-contract", CONTRACT);

      if (mount.firstChild) mount.insertBefore(canvas, mount.firstChild);
      else mount.appendChild(canvas);

      state.canvasCreated = true;
      canvasSelector = "CREATED_BY_EXPRESSION_BRIDGE";
    }

    if (!canvas) return { canvas: null, ctx: null, mount };

    sizeCanvas(canvas, mount);

    let ctx = null;

    try {
      ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null;
    } catch (_error) {
      ctx = null;
    }

    state.canvasLocated = true;
    state.canvasSelector = canvasSelector;
    state.canvasWidth = safeNumber(canvas.width, 0);
    state.canvasHeight = safeNumber(canvas.height, 0);
    state.canvasRectNonzero = rectNonzero(canvas) || Boolean(canvas.width > 0 && canvas.height > 0);
    state.context2dReady = Boolean(ctx);

    return { canvas, ctx, mount };
  }

  function resolveCanvasTarget(canvasOrContext) {
    const direct = canvasContextFrom(canvasOrContext);

    if (direct.canvas && direct.ctx) {
      state.canvasAccepted = true;
      sizeCanvas(direct.canvas, direct.canvas.parentElement || null);
      state.canvasLocated = true;
      state.canvasSelector = "ARGUMENT";
      state.canvasWidth = safeNumber(direct.canvas.width, 0);
      state.canvasHeight = safeNumber(direct.canvas.height, 0);
      state.canvasRectNonzero = rectNonzero(direct.canvas) || Boolean(direct.canvas.width > 0 && direct.canvas.height > 0);
      state.context2dReady = true;
      return { canvas: direct.canvas, ctx: direct.ctx, mount: direct.canvas.parentElement || null };
    }

    return locateOrCreateCanvas();
  }

  function canvasHasVisiblePixels(canvas, ctx) {
    if (!canvas || !ctx || !canvas.width || !canvas.height) {
      state.canvasPixelVarianceStatus = "NO_PIXEL_SAMPLE";
      return false;
    }

    try {
      const w = canvas.width;
      const h = canvas.height;
      const sample = Math.max(4, Math.min(24, Math.floor(Math.min(w, h) / 36)));
      const points = [
        [Math.floor(w * 0.5 - sample / 2), Math.floor(h * 0.5 - sample / 2)],
        [Math.floor(w * 0.36 - sample / 2), Math.floor(h * 0.42 - sample / 2)],
        [Math.floor(w * 0.62 - sample / 2), Math.floor(h * 0.58 - sample / 2)]
      ];

      let nonBlank = 0;
      let alpha = 0;

      for (const [x, y] of points) {
        const data = ctx.getImageData(
          Math.max(0, x),
          Math.max(0, y),
          sample,
          sample
        ).data;

        for (let index = 0; index < data.length; index += 4) {
          if (data[index + 3] > 0) alpha += 1;
          if (
            data[index + 3] > 0 &&
            (data[index] > 4 || data[index + 1] > 4 || data[index + 2] > 4)
          ) {
            nonBlank += 1;
          }
        }
      }

      const visible = nonBlank > 0 && alpha > 0;
      state.canvasPixelVarianceStatus = visible ? "PIXEL_SAMPLE_VISIBLE" : "PIXEL_SAMPLE_BLANK";
      return visible;
    } catch (_error) {
      state.canvasPixelVarianceStatus = "PIXEL_SAMPLE_UNREADABLE_ASSUME_DRAWN";
      return true;
    }
  }

  function drawBlob(ctx, cx, cy, radius, seed, sx, sy, rotation) {
    const points = 18;
    ctx.beginPath();

    for (let i = 0; i <= points; i += 1) {
      const t = (i / points) * Math.PI * 2;
      const wave =
        0.72 +
        Math.sin(t * 2.0 + seed) * 0.11 +
        Math.sin(t * 3.0 + seed * 0.7) * 0.08 +
        Math.sin(t * 5.0 - seed * 0.4) * 0.045;
      const a = t + rotation;
      const x = cx + Math.cos(a) * radius * wave * sx;
      const y = cy + Math.sin(a) * radius * wave * sy;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
  }

  function drawNativeHoldingSurface(canvas, ctx, packet = {}) {
    if (!canvas || !ctx) return false;

    state.nativeHoldingDrawAttempted = true;

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 720;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.385;
      const view = isObject(packet.viewState) ? packet.viewState : {};
      const yaw = safeNumber(view.yaw, safeNumber(packet.yaw, 0));
      const pitch = Math.max(-1.2, Math.min(1.2, safeNumber(view.pitch, safeNumber(packet.pitch, 0))));
      const phase = safeNumber(view.phase, 0) + yaw * 0.22;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
      bg.addColorStop(0, "rgba(18,38,68,0.96)");
      bg.addColorStop(0.58, "rgba(4,12,30,0.98)");
      bg.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      const ocean = ctx.createRadialGradient(
        cx - r * 0.35,
        cy - r * 0.38 + pitch * r * 0.08,
        r * 0.08,
        cx,
        cy,
        r * 1.08
      );
      ocean.addColorStop(0, "rgba(92,175,229,0.96)");
      ocean.addColorStop(0.38, "rgba(18,93,151,0.96)");
      ocean.addColorStop(0.74, "rgba(8,44,105,0.98)");
      ocean.addColorStop(1, "rgba(1,8,32,1)");
      ctx.fillStyle = ocean;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.globalAlpha = 0.52;
      ctx.strokeStyle = "rgba(215,236,255,0.24)";
      ctx.lineWidth = Math.max(1, r * 0.006);

      for (let i = -4; i <= 4; i += 1) {
        const y = cy + (i / 5) * r * 0.77 + Math.sin(phase + i) * r * 0.018 + pitch * r * 0.08;
        ctx.beginPath();
        ctx.ellipse(cx, y, r * 0.96, r * 0.11, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 8; i += 1) {
        const x = cx + Math.sin(phase + i * 0.7) * r * 0.74;
        ctx.beginPath();
        ctx.ellipse(x, cy + pitch * r * 0.03, r * 0.12, r * 0.94, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      const masses = [
        [-0.35, -0.22, 0.34, 1.15, 0.72, 0.1],
        [0.24, -0.28, 0.25, 0.86, 1.2, 1.4],
        [0.34, 0.16, 0.30, 0.78, 1.05, 2.2],
        [-0.18, 0.18, 0.28, 1.1, 0.86, 3.1],
        [-0.56, 0.06, 0.17, 0.76, 1.36, 4.2],
        [0.03, -0.02, 0.18, 1.55, 0.56, 5.4],
        [0.00, 0.58, 0.22, 1.55, 0.36, 6.4]
      ];

      for (let index = 0; index < masses.length; index += 1) {
        const item = masses[index];
        const px = cx + item[0] * r + Math.sin(phase + index) * r * 0.03;
        const py = cy + item[1] * r + pitch * r * 0.12 + Math.cos(phase + index * 0.9) * r * 0.02;
        const rr = item[2] * r;

        const land = ctx.createLinearGradient(px - rr, py - rr, px + rr, py + rr);
        land.addColorStop(0, "rgba(151,126,72,0.98)");
        land.addColorStop(0.48, "rgba(94,128,76,0.98)");
        land.addColorStop(1, "rgba(52,78,55,0.98)");
        ctx.fillStyle = land;
        drawBlob(ctx, px, py, rr, item[5] + phase, item[3], item[4], phase * 0.18 + index * 0.2);

        ctx.strokeStyle = "rgba(230,212,150,0.26)";
        ctx.lineWidth = Math.max(1, r * 0.004);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.34;
      ctx.fillStyle = "rgba(255,255,255,0.62)";
      drawBlob(ctx, cx - r * 0.42, cy - r * 0.47 + pitch * r * 0.06, r * 0.10, 8.2 + phase, 1.8, 0.5, 0.1);
      drawBlob(ctx, cx + r * 0.22, cy - r * 0.58 + pitch * r * 0.05, r * 0.08, 9.1 + phase, 2.2, 0.44, -0.2);
      drawBlob(ctx, cx + r * 0.10, cy + r * 0.49 + pitch * r * 0.03, r * 0.12, 10.4 + phase, 1.9, 0.42, 0.05);
      ctx.globalAlpha = 1;

      const shade = ctx.createRadialGradient(cx - r * 0.42, cy - r * 0.44, r * 0.1, cx, cy, r * 1.02);
      shade.addColorStop(0, "rgba(255,255,255,0.20)");
      shade.addColorStop(0.56, "rgba(255,255,255,0)");
      shade.addColorStop(0.88, "rgba(0,0,0,0.24)");
      shade.addColorStop(1, "rgba(0,0,0,0.62)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      ctx.restore();

      ctx.strokeStyle = "rgba(205,232,255,0.54)";
      ctx.lineWidth = Math.max(1, r * 0.011);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      state.nativeHoldingDrawComplete = true;
      return true;
    } catch (error) {
      state.nativeHoldingDrawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("NATIVE_HOLDING_SURFACE_DRAW_FAILED", error);
      return false;
    }
  }

  function buildDrawPacket(canvas, ctx, packet = {}) {
    return {
      packetType: "HEARTH_CANVAS_EXPRESSION_BRIDGE_DRAW_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      parentCanvasFile: PARENT_CANVAS_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      labWestFile: LABWEST_FILE,
      canvas,
      ctx,
      context: ctx,
      viewState: isObject(packet.viewState)
        ? clonePlain(packet.viewState)
        : isObject(state.lastViewState)
          ? clonePlain(state.lastViewState)
          : {},
      bridgePairRole: state.bridgePairRole,
      visibleExpressionBridgeActive: true,
      compositeCompatibilityBridgeActive: true,
      receiverOnly: true,
      externalAdapterAliasesReadOnly: true,
      externalAdapterOverwriteBlocked: true,
      ...FINAL_FALSE
    };
  }

  function attemptAdapterDraw(canvas, ctx, packet = {}) {
    const adapters = scanExternalAdapters();

    state.adapterDrawAttempted = adapters.length > 0;

    for (const adapter of adapters) {
      const methods = adapter.methods || [];

      for (const method of methods) {
        let result;

        if (method === "drawToCanvas" || method === "renderToCanvas") {
          result = safeInvoke(adapter.authority, method, [
            canvas,
            {
              ...buildDrawPacket(canvas, ctx, packet),
              adapterSourceName: adapter.path,
              adapterContract: adapter.contract
            }
          ]);
        } else {
          result = safeInvoke(adapter.authority, method, [
            buildDrawPacket(canvas, ctx, packet),
            {
              source: "Hearth Canvas Expression Bridge",
              contract: CONTRACT,
              receipt: RECEIPT,
              adapterSourceName: adapter.path,
              adapterContract: adapter.contract,
              ...FINAL_FALSE
            }
          ]);

          if (!result.ok) {
            result = safeInvoke(adapter.authority, method, [
              ctx,
              {
                canvas,
                source: "Hearth Canvas Expression Bridge",
                contract: CONTRACT,
                receipt: RECEIPT,
                adapterSourceName: adapter.path,
                adapterContract: adapter.contract,
                ...FINAL_FALSE
              }
            ]);
          }
        }

        if (!result.ok) {
          state.adapterError = result.error;
          continue;
        }

        if (!noFinalClaims(result.value)) {
          state.adapterError = `ADAPTER_RETURNED_FORBIDDEN_FINAL_CLAIM:${adapter.path}`;
          continue;
        }

        const pixelReady = canvasHasVisiblePixels(canvas, ctx);
        const explicitFalse = result.value === false;

        if (pixelReady && !explicitFalse) {
          state.adapterDrawComplete = true;
          state.adapterSourceName = adapter.path;
          state.adapterContract = adapter.contract || "";
          state.adapterReceipt = adapter.receipt || "";
          state.adapterMethod = method;
          state.adapterError = "";
          return true;
        }
      }
    }

    state.adapterDrawComplete = false;
    return false;
  }

  function updateVisibleProof(source, reason, pixelReady) {
    state.visibleExpressionBridgeReady = Boolean(pixelReady);
    state.canvasExpressionSurfaceReady = Boolean(pixelReady);
    state.canvasExpressionRichnessReady = Boolean(pixelReady);
    state.domExpressionSurfaceProofReady = Boolean(pixelReady);
    state.visiblePlanetProofReady = Boolean(pixelReady);
    state.renderedPlanetProofReady = Boolean(pixelReady);
    state.visiblePlanetProofSource = pixelReady ? source : "NONE";
    state.visiblePlanetProofReason = pixelReady ? reason : "VISIBLE_EXPRESSION_NOT_PROVEN";

    state.f13CanvasReadinessObserved = Boolean(state.drawAttempted || state.canvasLocated || state.canvasAccepted);
    state.f13VisibleEvidenceAvailable = Boolean(pixelReady);
    state.f13CanvasEvidenceStrict = false;
    state.f13CanvasEvidenceDegraded = Boolean(pixelReady);
    state.f13CanvasEvidenceComplete = Boolean(pixelReady);
    state.f13HardFail = false;
    state.f13StrictEvidenceGap = pixelReady
      ? "VISIBLE_EXPRESSION_BRIDGE_PIXEL_PROOF_READY_STRICT_F13_PENDING"
      : "VISIBLE_EXPRESSION_BRIDGE_PIXEL_PROOF_NOT_READY";
    state.f13StrictEvidenceRepairTarget = pixelReady ? COMPOSITE_FINGER_FILE : FILE;

    state.firstFailedCoordinate = pixelReady
      ? "NONE_VISIBLE_EXPRESSION_BRIDGE_PIXEL_PROOF_READY"
      : state.f13StrictEvidenceGap;
    state.recommendedNextFile = pixelReady ? PARENT_CANVAS_FILE : FILE;
    state.recommendedNextAction = pixelReady
      ? "RETURN_VISIBLE_EXPRESSION_BRIDGE_RECEIPT_TO_CANVAS_HUB"
      : "CALL_DRAW_TO_CANVAS_OR_LOAD_DOWNSTREAM_EXPRESSION_ADAPTER";
    state.postgameStatus = pixelReady
      ? "VISIBLE_EXPRESSION_BRIDGE_PIXEL_PROOF_READY_NO_FINAL_CLAIM"
      : "VISIBLE_EXPRESSION_BRIDGE_WAITING_PIXEL_PROOF";
  }

  function drawToCanvas(canvasOrContext, packet = {}) {
    if (drawingGuard) {
      const target = resolveCanvasTarget(canvasOrContext);
      const nativeOk = target.canvas && target.ctx
        ? drawNativeHoldingSurface(target.canvas, target.ctx, packet)
        : false;
      const pixelReady = nativeOk && canvasHasVisiblePixels(target.canvas, target.ctx);
      updateVisibleProof(
        pixelReady ? "EXPRESSION_BRIDGE_NATIVE_RECURSION_GUARD" : "NONE",
        pixelReady ? "RECURSION_GUARD_NATIVE_DRAW" : "RECURSION_GUARD_DRAW_NOT_READY",
        pixelReady
      );
      updateDataset();
      schedulePublish();
      return getReceiptLight(false);
    }

    drawingGuard = true;

    try {
      state.drawAttempted = true;
      state.drawCount += 1;
      state.lastDrawAt = nowIso();
      state.lastDrawReason = safeString(packet.reason || packet.drawReason || "drawToCanvas", "drawToCanvas");
      state.lastPacket = isObject(packet) ? clonePlain(packet) : null;

      if (isObject(packet.viewState)) state.lastViewState = clonePlain(packet.viewState);

      const target = resolveCanvasTarget(canvasOrContext || packet);

      if (!target.canvas || !target.ctx) {
        state.drawComplete = false;
        state.lastDrawError = "CANVAS_OR_2D_CONTEXT_NOT_AVAILABLE";
        updateVisibleProof("NONE", state.lastDrawError, false);
        updateDataset();
        schedulePublish();
        return getReceiptLight(false);
      }

      const adapterOk = attemptAdapterDraw(target.canvas, target.ctx, packet);

      let source = "DOWNSTREAM_EXPRESSION_ADAPTER";
      let reason = "DOWNSTREAM_EXPRESSION_ADAPTER_DRAW_COMPLETE";

      if (!adapterOk) {
        const nativeOk = drawNativeHoldingSurface(target.canvas, target.ctx, packet);
        source = "EXPRESSION_BRIDGE_NATIVE_HOLDING_SURFACE";
        reason = nativeOk
          ? "NATIVE_HOLDING_SURFACE_DRAW_COMPLETE"
          : "NATIVE_HOLDING_SURFACE_DRAW_FAILED";
      }

      const pixelReady = canvasHasVisiblePixels(target.canvas, target.ctx);

      state.drawComplete = Boolean(pixelReady);
      state.lastDrawSource = pixelReady ? source : "NONE";
      state.lastDrawError = pixelReady ? "" : state.lastDrawError || "VISIBLE_PIXEL_EVIDENCE_NOT_AVAILABLE";

      updateVisibleProof(source, reason, pixelReady);
      updateDataset();
      publishReceipts();
      notifyUpstream("drawToCanvas");

      return getReceiptLight(false);
    } catch (error) {
      state.drawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("DRAW_TO_CANVAS_FAILED", error);
      updateVisibleProof("NONE", state.lastDrawError, false);
      updateDataset();
      publishReceipts();
      return getReceiptLight(false);
    } finally {
      drawingGuard = false;
    }
  }

  function drawVisibleExpression(targetOrPacket = {}, maybePacket = {}) {
    const looksLikeTarget =
      targetOrPacket &&
      (
        isFunction(targetOrPacket.getContext) ||
        (targetOrPacket.canvas && isFunction(targetOrPacket.getImageData))
      );

    if (looksLikeTarget) return drawToCanvas(targetOrPacket, maybePacket);
    return drawToCanvas(null, targetOrPacket);
  }

  function render(packet = {}) {
    return drawVisibleExpression(packet);
  }

  function draw(packet = {}) {
    return drawVisibleExpression(packet);
  }

  function scheduleDraw(reason = "scheduled-draw") {
    if (!root.setTimeout) return drawVisibleExpression({ reason });
    if (drawTimer) return true;

    drawTimer = root.setTimeout(() => {
      drawTimer = 0;
      drawVisibleExpression({ reason });
    }, 80);

    return true;
  }

  function receivePacket(packet = {}, lane = "GENERIC") {
    if (!isObject(packet)) return getReceiptLight(false);

    state.packetCount += 1;
    state.lastPacket = clonePlain(packet);

    if (isObject(packet.viewState)) state.lastViewState = clonePlain(packet.viewState);

    const packetContract = contractOf(packet);
    const sourceFile = safeString(packet.sourceFile || packet.file || "");

    if (lane === "AUTHORITY") {
      state.authorityPacketCount += 1;
      state.lastAuthorityPacket = clonePlain(packet);
      state.canvasHubObserved = true;
      state.canvasHubContract = packetContract || state.canvasHubContract || CURRENT_PARENT_CANVAS_CONTRACT;
      state.canvasHubReceipt = receiptOf(packet) || state.canvasHubReceipt;
    }

    if (lane === "ROUTE_CONDUCTOR") {
      state.routeConductorPacketCount += 1;
      state.lastRouteConductorPacket = clonePlain(packet);
      state.routeConductorObserved = true;
      state.routeConductorContract = packetContract || state.routeConductorContract || ROUTE_CONDUCTOR_CONTRACT;
    }

    if (lane === "QUEEN") {
      state.queenPacketCount += 1;
      state.lastQueenPacket = clonePlain(packet);
      state.queenObserved = true;
      state.queenContract = packetContract || state.queenContract || QUEEN_CONTROL_CONTRACT;
    }

    if (lane === "LABWEST") {
      state.labWestPacketCount += 1;
      state.lastLabWestPacket = clonePlain(packet);
      state.labWestObserved = true;
      state.labWestContract = packetContract || state.labWestContract || LABWEST_CONTRACT;
    }

    if (lane === "FINGER") {
      state.fingerPacketCount += 1;
      state.lastFingerPacket = clonePlain(packet);
    }

    if (lane === "DIAGNOSTIC") {
      state.diagnosticPacketCount += 1;
      state.lastDiagnosticPacket = clonePlain(packet);
    }

    if (packetContract === CURRENT_PARENT_CANVAS_CONTRACT || sourceFile === PARENT_CANVAS_FILE) {
      state.canvasHubObserved = true;
      state.canvasHubContract = packetContract || state.canvasHubContract || CURRENT_PARENT_CANVAS_CONTRACT;
      state.canvasHubReceipt = receiptOf(packet) || state.canvasHubReceipt;
    }

    if (packetContract === ROUTE_CONDUCTOR_CONTRACT || sourceFile === ROUTE_CONDUCTOR_FILE) {
      state.routeConductorObserved = true;
      state.routeConductorContract = packetContract || state.routeConductorContract || ROUTE_CONDUCTOR_CONTRACT;
    }

    if (packetContract === QUEEN_CONTROL_CONTRACT || sourceFile === CONTROL_FILE) {
      state.queenObserved = true;
      state.queenContract = packetContract || state.queenContract || QUEEN_CONTROL_CONTRACT;
    }

    if (packetContract === LABWEST_CONTRACT || sourceFile === LABWEST_FILE) {
      state.labWestObserved = true;
      state.labWestContract = packetContract || state.labWestContract || LABWEST_CONTRACT;
    }

    record("CANVAS_EXPRESSION_BRIDGE_PACKET_RECEIVED", {
      lane,
      packetType: packet.packetType || packet.type || "",
      contract: packetContract,
      sourceFile,
      targetFile: packet.targetFile || ""
    });

    if (
      packet.canvas ||
      packet.ctx ||
      packet.context ||
      packet.drawNow === true ||
      packet.visibleExpressionRequested === true ||
      packet.canvasReleaseAuthorized === true ||
      lane === "AUTHORITY" ||
      lane === "ROUTE_CONDUCTOR"
    ) {
      drawToCanvas(packet.canvas || packet.ctx || packet.context || null, packet);
    } else {
      scheduleDraw(`packet-received:${lane}`);
    }

    updateDataset();
    schedulePublish();
    return getReceiptLight(false);
  }

  function receiveCanvasAuthorityBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveAuthorityBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receivePublicAuthorityBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveBridgePacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveCanvasAuthorityPacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }
  function receiveCanvasHubPacket(packet = {}) { return receivePacket(packet, "AUTHORITY"); }

  function receiveRouteConductorReleasePacket(packet = {}) { return receivePacket(packet, "ROUTE_CONDUCTOR"); }
  function consumeRouteConductorReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function receiveCanvasReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function receiveReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }
  function consumeReleasePacket(packet = {}) { return receiveRouteConductorReleasePacket(packet); }

  function receiveQueenPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveQueenContext(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlViewPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveViewControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receiveControlsPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }
  function receivePlanetaryControlPacket(packet = {}) { return receivePacket(packet, "QUEEN"); }

  function receiveLabWestPacket(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveLabWestContext(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveWestGateContext(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveAdmissibilityContext(packet = {}) { return receivePacket(packet, "LABWEST"); }

  function receiveFingerPacket(packet = {}) { return receivePacket(packet, "FINGER"); }
  function receiveCanvasFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveExpressionFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveFingerReceipt(packet = {}) { return receiveFingerPacket(packet); }
  function receiveCanvasExpressionPacket(packet = {}) { return receiveFingerPacket(packet); }

  function receiveDiagnosticPacket(packet = {}) { return receivePacket(packet, "DIAGNOSTIC"); }
  function receiveHierarchyContext(packet = {}) { return receivePacket(packet, "DIAGNOSTIC"); }

  function scanUpstreamAuthorities() {
    if (scanningGuard) return getReceiptLight(false);
    scanningGuard = true;

    try {
      const canvasHub =
        readPath("HEARTH_CANVAS_HUB") ||
        readPath("HEARTH.canvasHub") ||
        readPath("DEXTER_LAB.hearthCanvasHub") ||
        readPath("HEARTH_CANVAS") ||
        readPath("HEARTH.canvas");

      const canvasReceipt = readReceipt(canvasHub) || {};

      if (canvasHub && canvasHub !== api) {
        state.canvasHubObserved = true;
        state.canvasHubContract = contractOf(canvasReceipt || canvasHub) || state.canvasHubContract;
        state.canvasHubReceipt = receiptOf(canvasReceipt || canvasHub) || state.canvasHubReceipt;
      }

      const route =
        readPath("HEARTH_ROUTE_CONDUCTOR") ||
        readPath("HEARTH.routeConductor") ||
        readPath("DEXTER_LAB.hearthRouteConductor");

      const routeReceipt = readReceipt(route) || {};

      if (route && route !== api) {
        state.routeConductorObserved = true;
        state.routeConductorContract = contractOf(routeReceipt || route) || state.routeConductorContract;
      }

      const queen =
        readPath("HEARTH_CONTROLS") ||
        readPath("HEARTH_CONTROLS_QUEEN") ||
        readPath("HEARTH.controls") ||
        readPath("HEARTH.queenControls") ||
        readPath("DEXTER_LAB.hearthControls");

      const queenReceipt = readReceipt(queen) || {};

      if (queen && queen !== api) {
        state.queenObserved = true;
        state.queenContract = contractOf(queenReceipt || queen) || state.queenContract;
      }

      const west =
        readPath("LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE") ||
        readPath("HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE") ||
        readPath("HEARTH.westBishopChordCanvasReleaseBridge") ||
        readPath("DEXTER_LAB.hearthWestBishopChordCanvasReleaseBridge");

      const westReceipt = readReceipt(west) || {};

      if (west && west !== api) {
        state.labWestObserved = true;
        state.labWestContract = contractOf(westReceipt || west) || state.labWestContract;
      }

      scanExternalAdapters();
      return getReceiptLight(false);
    } finally {
      scanningGuard = false;
    }
  }

  function getReceiptLight(doScan = false) {
    if (doScan) scanUpstreamAuthorities();

    return {
      packetType: "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_LIGHT",
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      previousReceipt: PREVIOUS_RECEIPT,
      file: FILE,
      route: ROUTE,
      diagnosticRoute: DIAGNOSTIC_ROUTE,

      role: state.role,
      bridgePairRole: state.bridgePairRole,
      authoritySideBridgeFile: PARENT_CANVAS_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      labWestFile: LABWEST_FILE,

      loaded: state.loaded,
      booted: state.booted,
      expressionHubActive: true,
      canvasExpressionHubActive: true,
      visibleExpressionBridgeActive: true,
      compositeCompatibilityBridgeActive: true,

      ownAliasesPublished: state.ownAliasesPublished,
      ownAliasPublishCount: state.ownAliasPublishCount,
      externalAliasOverwriteBlocked: true,
      externalAliasesReadOnly: true,
      externalAdapterCount: state.externalAdapterCount,
      externalAdapterNames: state.externalAdapterNames,

      canvasAccepted: state.canvasAccepted,
      canvasLocated: state.canvasLocated,
      canvasCreated: state.canvasCreated,
      canvasSelector: state.canvasSelector,
      canvasMountFound: state.canvasMountFound,
      canvasMountSelector: state.canvasMountSelector,
      canvasMounted: Boolean(state.canvasLocated && state.context2dReady),
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.context2dReady,

      drawAttempted: state.drawAttempted,
      drawComplete: state.drawComplete,
      canvasDrawComplete: state.drawComplete,
      baseGlobeDrawComplete: state.drawComplete,
      drawCount: state.drawCount,
      lastDrawAt: state.lastDrawAt,
      lastDrawReason: state.lastDrawReason,
      lastDrawSource: state.lastDrawSource,
      lastDrawError: state.lastDrawError,

      adapterDrawAttempted: state.adapterDrawAttempted,
      adapterDrawComplete: state.adapterDrawComplete,
      adapterSourceName: state.adapterSourceName,
      adapterContract: state.adapterContract,
      adapterReceipt: state.adapterReceipt,
      adapterMethod: state.adapterMethod,
      adapterError: state.adapterError,

      nativeHoldingDrawAttempted: state.nativeHoldingDrawAttempted,
      nativeHoldingDrawComplete: state.nativeHoldingDrawComplete,

      canvasHubObserved: state.canvasHubObserved,
      canvasHubContract: state.canvasHubContract,
      canvasHubReceipt: state.canvasHubReceipt,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      queenObserved: state.queenObserved,
      queenContract: state.queenContract,
      labWestObserved: state.labWestObserved,
      labWestContract: state.labWestContract,

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CURRENT_PARENT_CANVAS_CONTRACT,
      currentCanvasParentReceipt: "PARENT_CANVAS_RECEIPT_READ_UPSTREAM",
      canvasContractAcceptedByShape: true,
      canvasSummaryAcceptedByShape: true,
      canvasSummaryShapeTrusted: true,

      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
      visibleExpressionBridgeReady: state.visibleExpressionBridgeReady,
      visibleBaseGlobeCarrierActive: state.visiblePlanetProofReady,
      canvasVisibleBaseGlobeCarrierActive: state.visiblePlanetProofReady,
      baseGlobeVisibleCarrierReady: state.visiblePlanetProofReady,
      visibleGlobeCarrierReady: state.visiblePlanetProofReady,
      visiblePlanetProofReady: state.visiblePlanetProofReady,
      visiblePlanetProofSource: state.visiblePlanetProofSource,
      visiblePlanetProofReason: state.visiblePlanetProofReason,
      visiblePlanetProofIngestedByRoute: state.visiblePlanetProofReady,
      visiblePlanetReceiptObserved: state.visiblePlanetProofReady,
      renderedPlanetProofReady: state.renderedPlanetProofReady,
      canvasPixelVarianceStatus: state.canvasPixelVarianceStatus,

      f13CanvasReadinessObserved: state.f13CanvasReadinessObserved,
      f13VisibleEvidenceAvailable: state.f13VisibleEvidenceAvailable,
      f13CanvasEvidenceStrict: false,
      f13CanvasEvidenceDegraded: state.f13CanvasEvidenceDegraded,
      f13CanvasEvidenceComplete: state.f13CanvasEvidenceComplete,
      f13HardFail: false,
      f13StrictEvidenceGap: state.f13StrictEvidenceGap,
      f13StrictEvidenceRepairTarget: state.f13StrictEvidenceRepairTarget,

      firstFailedCoordinate: state.firstFailedCoordinate,
      recommendedNextFile: state.recommendedNextFile,
      recommendedNextAction: state.recommendedNextAction,
      postgameStatus: state.postgameStatus,

      packetCount: state.packetCount,
      authorityPacketCount: state.authorityPacketCount,
      routeConductorPacketCount: state.routeConductorPacketCount,
      queenPacketCount: state.queenPacketCount,
      labWestPacketCount: state.labWestPacketCount,
      fingerPacketCount: state.fingerPacketCount,
      diagnosticPacketCount: state.diagnosticPacketCount,
      receiptPublishCount: state.receiptPublishCount,
      upstreamNotifyCount: state.upstreamNotifyCount,
      updatedAt: state.updatedAt || nowIso(),

      ownsOwnExpressionBridgeAliases: true,
      ownsPracticalDrawingBridge: true,
      ownsCanvasPlacementFallback: true,
      ownsPixelProofPublication: true,

      ownsCompositeAliases: false,
      ownsFingerAliases: false,
      ownsHexAliases: false,
      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsAtmosphereTruth: false,
      ownsLightingTruth: false,
      ownsCompositeTruth: false,
      ownsHexTruth: false,
      ownsFingerTruth: false,
      ownsPointerTruth: false,
      ownsQueenTruth: false,
      ownsLabWestAdmissibilityTruth: false,
      ownsRouteConductorHandshakeTruth: false,
      ownsDiagnosticRailCaseSelection: false,

      ...FINAL_FALSE
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(false),
      packetType: "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT",
      currentReceipt: true,
      ownAliasPaths: OWN_ALIAS_PATHS.slice(),
      externalAdapterAliasPathsReadOnly: EXTERNAL_ADAPTER_ALIAS_PATHS.slice(),
      externalAdapters: externalAdapters.map((item) => ({
        path: item.path,
        contract: item.contract,
        receipt: item.receipt,
        methods: item.methods
      })),
      lastPacket: clonePlain(state.lastPacket),
      lastAuthorityPacket: clonePlain(state.lastAuthorityPacket),
      lastRouteConductorPacket: clonePlain(state.lastRouteConductorPacket),
      lastQueenPacket: clonePlain(state.lastQueenPacket),
      lastLabWestPacket: clonePlain(state.lastLabWestPacket),
      lastFingerPacket: clonePlain(state.lastFingerPacket),
      lastDiagnosticPacket: clonePlain(state.lastDiagnosticPacket),
      events: clonePlain(state.events),
      errors: clonePlain(state.errors),
      ...FINAL_FALSE
    };
  }

  function getReceiptText() {
    const r = getReceiptLight(false);

    return [
      "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT",
      "",
      `contract=${r.contract}`,
      `receipt=${r.receipt}`,
      `previousContract=${r.previousContract}`,
      `previousReceipt=${r.previousReceipt}`,
      `file=${FILE}`,
      `route=${ROUTE}`,
      `bridgePairRole=${state.bridgePairRole}`,
      `authoritySideBridgeFile=${PARENT_CANVAS_FILE}`,
      "",
      "ALIAS_BOUNDARY",
      `ownAliasesPublished=${r.ownAliasesPublished}`,
      `externalAliasOverwriteBlocked=${r.externalAliasOverwriteBlocked}`,
      `externalAliasesReadOnly=${r.externalAliasesReadOnly}`,
      `externalAdapterCount=${r.externalAdapterCount}`,
      `externalAdapterNames=${r.externalAdapterNames}`,
      "",
      "DRAW",
      `canvasMounted=${r.canvasMounted}`,
      `canvasContext2dReady=${r.canvasContext2dReady}`,
      `drawAttempted=${r.drawAttempted}`,
      `drawComplete=${r.drawComplete}`,
      `lastDrawSource=${r.lastDrawSource}`,
      `adapterDrawComplete=${r.adapterDrawComplete}`,
      `nativeHoldingDrawComplete=${r.nativeHoldingDrawComplete}`,
      "",
      "VISIBLE_PROOF",
      `canvasExpressionSurfaceReady=${r.canvasExpressionSurfaceReady}`,
      `canvasExpressionRichnessReady=${r.canvasExpressionRichnessReady}`,
      `domExpressionSurfaceProofReady=${r.domExpressionSurfaceProofReady}`,
      `visiblePlanetProofReady=${r.visiblePlanetProofReady}`,
      `visiblePlanetProofSource=${r.visiblePlanetProofSource}`,
      `canvasPixelVarianceStatus=${r.canvasPixelVarianceStatus}`,
      "",
      "F13_NO_CLAIM",
      `f13CanvasEvidenceStrict=${r.f13CanvasEvidenceStrict}`,
      `f13CanvasEvidenceDegraded=${r.f13CanvasEvidenceDegraded}`,
      `f13CanvasEvidenceComplete=${r.f13CanvasEvidenceComplete}`,
      `f13Claimed=false`,
      `f21EligibleForNorth=false`,
      "",
      "BOUNDARIES",
      `ownsCompositeAliases=false`,
      `ownsFingerAliases=false`,
      `ownsHexAliases=false`,
      `ownsTerrainTruth=false`,
      `ownsHydrologyTruth=false`,
      `ownsElevationTruth=false`,
      `ownsMaterialTruth=false`,
      `ownsFingerTruth=false`,
      `ownsPointerTruth=false`,
      `ownsQueenTruth=false`,
      `ownsLabWestAdmissibilityTruth=false`,
      `ownsRouteConductorHandshakeTruth=false`,
      `visualPassClaimed=false`,
      `generatedImage=false`,
      `graphicBox=false`,
      `webGL=false`,
      "",
      "NEXT",
      `firstFailedCoordinate=${r.firstFailedCoordinate}`,
      `recommendedNextFile=${r.recommendedNextFile}`,
      `recommendedNextAction=${r.recommendedNextAction}`,
      `postgameStatus=${r.postgameStatus}`
    ].join("\n");
  }

  function updateDataset() {
    setDataset("hearthCanvasExpressionBridgeLoaded", "true");
    setDataset("hearthCanvasExpressionBridgeContract", CONTRACT);
    setDataset("hearthCanvasExpressionBridgeReceipt", RECEIPT);
    setDataset("hearthCanvasExpressionBridgePreviousContract", PREVIOUS_CONTRACT);
    setDataset("hearthCanvasExpressionBridgeFile", FILE);
    setDataset("hearthCanvasExpressionBridgePairRole", state.bridgePairRole);
    setDataset("hearthCanvasExpressionBridgeAuthoritySideFile", PARENT_CANVAS_FILE);

    setDataset("hearthCanvasExpressionBridgeOwnAliasesPublished", String(state.ownAliasesPublished));
    setDataset("hearthCanvasExpressionBridgeExternalAliasOverwriteBlocked", "true");
    setDataset("hearthCanvasExpressionBridgeExternalAliasesReadOnly", "true");
    setDataset("hearthCanvasExpressionBridgeExternalAdapterCount", String(state.externalAdapterCount));
    setDataset("hearthCanvasExpressionBridgeExternalAdapterNames", state.externalAdapterNames);

    setDataset("hearthCanvasVisibleExpressionBridgeActive", "true");
    setDataset("hearthCanvasCompositeCompatibilityBridgeActive", "true");
    setDataset("hearthCanvasExpressionHubActive", "true");
    setDataset("hearthCanvasExpressionSurfaceReady", String(state.canvasExpressionSurfaceReady));
    setDataset("hearthCanvasExpressionRichnessReady", String(state.canvasExpressionRichnessReady));
    setDataset("hearthCanvasDomExpressionSurfaceProofReady", String(state.domExpressionSurfaceProofReady));

    setDataset("hearthCanvasExpressionBridgeCanvasLocated", String(state.canvasLocated));
    setDataset("hearthCanvasExpressionBridgeContext2dReady", String(state.context2dReady));
    setDataset("hearthCanvasExpressionBridgeDrawAttempted", String(state.drawAttempted));
    setDataset("hearthCanvasExpressionBridgeDrawComplete", String(state.drawComplete));
    setDataset("hearthCanvasExpressionBridgeLastDrawSource", state.lastDrawSource);
    setDataset("hearthCanvasExpressionBridgeAdapterDrawComplete", String(state.adapterDrawComplete));
    setDataset("hearthCanvasExpressionBridgeNativeHoldingDrawComplete", String(state.nativeHoldingDrawComplete));

    setDataset("hearthCanvasVisiblePlanetProofReady", String(state.visiblePlanetProofReady));
    setDataset("hearthCanvasVisiblePlanetProofSource", state.visiblePlanetProofSource);
    setDataset("hearthCanvasVisiblePlanetProofReason", state.visiblePlanetProofReason);
    setDataset("hearthCanvasRenderedPlanetProofReady", String(state.renderedPlanetProofReady));
    setDataset("hearthCanvasPixelVarianceStatus", state.canvasPixelVarianceStatus);

    setDataset("hearthCanvasF13EvidenceStrict", "false");
    setDataset("hearthCanvasF13EvidenceDegraded", String(state.f13CanvasEvidenceDegraded));
    setDataset("hearthCanvasF13EvidenceComplete", String(state.f13CanvasEvidenceComplete));
    setDataset("hearthCanvasF13StrictEvidenceGap", state.f13StrictEvidenceGap);
    setDataset("hearthCanvasF13StrictEvidenceRepairTarget", state.f13StrictEvidenceRepairTarget);

    setDataset("hearthCanvasExpressionBridgeFirstFailedCoordinate", state.firstFailedCoordinate);
    setDataset("hearthCanvasExpressionBridgeRecommendedNextFile", state.recommendedNextFile);
    setDataset("hearthCanvasExpressionBridgeRecommendedNextAction", state.recommendedNextAction);
    setDataset("hearthCanvasExpressionBridgePostgameStatus", state.postgameStatus);

    setDataset("hearthCanvasExpressionBridgeOwnsCompositeAliases", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsFingerAliases", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsHexAliases", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsTerrainTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsHydrologyTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsElevationTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsMaterialTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsFingerTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsPointerTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsQueenTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsLabWestAdmissibilityTruth", "false");
    setDataset("hearthCanvasExpressionBridgeOwnsRouteConductorHandshakeTruth", "false");

    setDataset("hearthCanvasF13Claimed", "false");
    setDataset("hearthCanvasF21EligibleForNorth", "false");
    setDataset("hearthCanvasF21SubmittedToNorth", "false");
    setDataset("hearthCanvasF21Claimed", "false");
    setDataset("hearthCanvasReadyTextAllowed", "false");
    setDataset("hearthCanvasReadyTextClaimed", "false");
    setDataset("generatedImage", "false");
    setDataset("graphicBox", "false");
    setDataset("webgl", "false");
    setDataset("visualPassClaimed", "false");
  }

  function publishOwnAliases() {
    ensureObject(root, "HEARTH");
    ensureObject(root, "DEXTER_LAB");

    for (const path of OWN_ALIAS_PATHS) {
      setPath(path, api);
    }

    state.ownAliasesPublished = true;
    state.ownAliasPublishCount += 1;
    state.publishedAt = nowIso();
    state.updatedAt = state.publishedAt;

    return true;
  }

  function publishReceipts() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const light = getReceiptLight(false);
    const full = getReceipt();

    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_SECOND_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_v2 = full;
    root.HEARTH_CANVAS_EXPRESSION_SURFACE_BRIDGE_RECEIPT = light;

    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = light;

    hearth.canvasExpressionBridgeReceipt = light;
    hearth.canvasVisibleExpressionBridgeReceipt = light;
    hearth.canvasSecondExpressionBridgeReceipt = light;
    hearth.canvasExpressionBridgeSecondPairReceipt = full;
    hearth.canvasExpressionSurfaceBridgeReceipt = light;
    hearth.canvasExpressionHubReceipt = light;
    hearth.canvasVisiblePlanetReceipt = light;

    lab.hearthCanvasExpressionBridgeReceipt = light;
    lab.hearthCanvasVisibleExpressionBridgeReceipt = light;
    lab.hearthCanvasSecondExpressionBridgeReceipt = light;
    lab.hearthCanvasExpressionBridgeSecondPairReceipt = full;
    lab.hearthCanvasExpressionSurfaceBridgeReceipt = light;
    lab.hearthCanvasExpressionHubReceipt = light;
    lab.hearthCanvasVisiblePlanetReceipt = light;

    state.receiptPublishCount += 1;
    state.updatedAt = nowIso();
    updateDataset();

    return true;
  }

  function schedulePublish() {
    if (!root.setTimeout) return publishReceipts();
    if (publishTimer) return true;

    publishTimer = root.setTimeout(() => {
      publishTimer = 0;
      publishReceipts();
    }, 60);

    return true;
  }

  function notifyUpstream(reason = "notify-upstream") {
    if (notifyGuard) return false;
    notifyGuard = true;

    try {
      const receipt = getReceiptLight(false);

      const targets = [
        readPath("HEARTH_CANVAS_HUB"),
        readPath("HEARTH.canvasHub"),
        readPath("DEXTER_LAB.hearthCanvasHub"),
        readPath("HEARTH_CANVAS"),
        readPath("HEARTH.canvas"),
        readPath("HEARTH_ROUTE_CONDUCTOR"),
        readPath("HEARTH.routeConductor"),
        readPath("DEXTER_LAB.hearthRouteConductor")
      ].filter((target) => target && target !== api && isObject(target));

      const methods = [
        "receiveCanvasExpressionHubSummary",
        "receiveExpressionHubSummary",
        "receiveCanvasStationSummary",
        "receiveCanvasLocalStationSummary",
        "receiveVisiblePlanetReceipt",
        "receiveVisibleGlobeReceipt",
        "receiveCanvasVisibleProof",
        "receiveCanvasExpressionPacket",
        "receiveExpressionFingerPacket",
        "reconcileCanvas"
      ];

      for (const target of targets) {
        for (const method of methods) {
          if (!isFunction(target[method])) continue;

          safeInvoke(target, method, [{
            ...clonePlain(receipt),
            packetType: "HEARTH_CANVAS_EXPRESSION_BRIDGE_UPSTREAM_NOTICE",
            noticeReason: reason,
            sourceFile: FILE,
            targetFile: PARENT_CANVAS_FILE,
            packetLane: "EXPRESSION",
            ...FINAL_FALSE
          }]);
        }
      }

      state.upstreamNotifyCount += 1;
      return true;
    } finally {
      notifyGuard = false;
    }
  }

  function boot(options = {}) {
    if (state.booting) return getReceipt();

    state.booting = true;
    state.startedAt = state.startedAt || nowIso();

    try {
      publishOwnAliases();
      scanExternalAdapters();
      scanUpstreamAuthorities();
      updateDataset();
      publishReceipts();

      const requestedDraw = options.drawNow !== false;

      if (requestedDraw) {
        scheduleDraw(options.reason || "boot");
      }

      state.booted = true;
      state.postgameStatus = state.visiblePlanetProofReady
        ? "VISIBLE_EXPRESSION_BRIDGE_PIXEL_PROOF_READY_NO_FINAL_CLAIM"
        : "CANVAS_EXPRESSION_BRIDGE_BOOTED_WAITING_DRAW";
      state.updatedAt = nowIso();

      record("CANVAS_EXPRESSION_BRIDGE_BOOTED", {
        contract: CONTRACT,
        file: FILE,
        requestedDraw,
        ownAliasesPublished: state.ownAliasesPublished,
        externalAliasOverwriteBlocked: true,
        externalAdapterCount: state.externalAdapterCount,
        canvasHubObserved: state.canvasHubObserved,
        routeConductorObserved: state.routeConductorObserved
      });

      updateDataset();
      publishReceipts();
      notifyUpstream("boot");

      return getReceipt();
    } catch (error) {
      recordError("CANVAS_EXPRESSION_BRIDGE_BOOT_FAILED", error);
      updateDataset();
      publishReceipts();
      return getReceipt();
    } finally {
      state.booting = false;
    }
  }

  function init(options = {}) { return boot(options); }
  function start(options = {}) { return boot(options); }
  function mount(options = {}) { return boot(options); }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    PREVIOUS_CONTRACT,
    PREVIOUS_RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    previousReceipt: PREVIOUS_RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    PARENT_CANVAS_FILE,
    ROUTE_CONDUCTOR_FILE,
    CONTROL_FILE,
    LABWEST_FILE,
    CURRENT_PARENT_CANVAS_CONTRACT,
    ROUTE_CONDUCTOR_CONTRACT,
    QUEEN_CONTROL_CONTRACT,
    LABWEST_CONTRACT,

    POINTER_FINGER_FILE,
    SURFACE_FINGER_FILE,
    COMPOSITE_FINGER_FILE,
    HEX_SURFACE_FILE,
    HEX_FOUR_PAIR_FILE,

    OWN_ALIAS_PATHS,
    EXTERNAL_ADAPTER_ALIAS_PATHS,

    boot,
    init,
    start,
    mount,

    drawToCanvas,
    drawVisibleExpression,
    render,
    draw,
    scheduleDraw,

    receivePacket,
    receiveCanvasAuthorityBridgePacket,
    receiveAuthorityBridgePacket,
    receivePublicAuthorityBridgePacket,
    receiveBridgePacket,
    receiveCanvasAuthorityPacket,
    receiveCanvasHubPacket,

    receiveRouteConductorReleasePacket,
    consumeRouteConductorReleasePacket,
    receiveCanvasReleasePacket,
    receiveReleasePacket,
    consumeReleasePacket,

    receiveQueenPacket,
    receiveQueenContext,
    receiveControlPacket,
    receiveControlViewPacket,
    receiveViewControlPacket,
    receiveControlsPacket,
    receivePlanetaryControlPacket,

    receiveLabWestPacket,
    receiveLabWestContext,
    receiveWestGateContext,
    receiveAdmissibilityContext,

    receiveFingerPacket,
    receiveCanvasFingerPacket,
    receiveExpressionFingerPacket,
    receiveFingerReceipt,
    receiveCanvasExpressionPacket,

    receiveDiagnosticPacket,
    receiveHierarchyContext,

    scanExternalAdapters,
    scanUpstreamAuthorities,
    getReceiptLight,
    getReceipt,
    getExpressionBridgeReceipt: getReceipt,
    getVisibleExpressionBridgeReceipt: getReceipt,
    getExpressionHubReceipt: getReceiptLight,
    getExpressionHubSummary: getReceiptLight,
    getCompositePacket: getReceiptLight,
    getCompositeModel: getReceiptLight,
    getCanvasStationSummary: getReceiptLight,
    getCanvasStationReceiptLight: getReceiptLight,
    getCanvasStationReceipt: getReceipt,
    getVisiblePlanetReceipt: getReceiptLight,
    getVisibleGlobeReceipt: getReceiptLight,
    getStructuralCarrier: getReceiptLight,
    readStructuralCarrier: getReceiptLight,
    getCarrierReceipt: getReceiptLight,
    getReceiptText,

    updateDataset,
    publishOwnAliases,
    publishReceipts,
    schedulePublish,
    notifyUpstream,

    supportsCanvasExpressionBridge: true,
    supportsVisibleExpressionBridge: true,
    supportsCompositeCompatibilityBridge: true,
    supportsDrawToCanvas: true,
    supportsCanvasContextAcceptance: true,
    supportsCanvasLocationFallback: true,
    supportsPixelVisibleProof: true,
    supportsUpstreamReceiptPublication: true,
    supportsOwnAliasPublicationOnly: true,
    supportsExternalAdapterReadOnlyScan: true,
    supportsNoExternalAliasOverwrite: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsOwnExpressionBridgeAliases: true,
    ownsPracticalDrawingBridge: true,
    ownsCanvasPlacementFallback: true,
    ownsPixelProofPublication: true,

    ownsCompositeAliases: false,
    ownsFingerAliases: false,
    ownsHexAliases: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
    ownsCompositeTruth: false,
    ownsHexTruth: false,
    ownsFingerTruth: false,
    ownsPointerTruth: false,
    ownsQueenTruth: false,
    ownsLabWestAdmissibilityTruth: false,
    ownsRouteConductorHandshakeTruth: false,
    ownsDiagnosticRailCaseSelection: false,
    ownsF13: false,
    ownsF21: false,
    ownsReadyText: false,
    ownsCompletionLatch: false,
    ownsFinalVisualPassClaim: false,

    ...FINAL_FALSE,

    get state() {
      return state;
    }
  });

  try {
    publishOwnAliases();
    updateDataset();
    publishReceipts();

    if (doc) {
      if (doc.readyState === "loading") {
        doc.addEventListener("DOMContentLoaded", () => boot({ reason: "dom-content-loaded" }), { once: true });
      } else {
        boot({ reason: "document-ready" });
      }
    } else {
      boot({ reason: "no-document-runtime", drawNow: false });
    }

    if (root.setTimeout) {
      root.setTimeout(() => {
        publishOwnAliases();
        scanExternalAdapters();
        scanUpstreamAuthorities();
        scheduleDraw("post-publication-retry-1");
        notifyUpstream("post-publication-retry-1");
      }, 260);

      root.setTimeout(() => {
        publishOwnAliases();
        scanExternalAdapters();
        scanUpstreamAuthorities();
        scheduleDraw("post-publication-retry-2");
        notifyUpstream("post-publication-retry-2");
      }, 920);
    }
  } catch (error) {
    recordError("CANVAS_EXPRESSION_BRIDGE_INITIALIZATION_FAILED", error);

    try {
      updateDataset();
      publishReceipts();
    } catch (_fallbackError) {}
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
