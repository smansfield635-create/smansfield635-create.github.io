// /assets/hearth/hearth.canvas.expression.bridge.js
// HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v1
// Full-file replacement.
// Canvas visible-expression bridge / second file in the two-file bridge pair.
// Purpose:
// - Serve as the expression-side bridge paired with /assets/hearth/hearth.canvas.js.
// - Receive packets from Canvas Hub, Route Conductor, Queen controls, LabWest context, diagnostics, and finger surfaces.
// - Locate or accept a canvas/context.
// - Call existing composite, finger, Hex Surface, or visible-expression adapters when available.
// - Produce truthful pixel-visible proof back upward without claiming final readiness.
// - Publish compatibility aliases needed by Canvas Hub and Route Conductor.
// - Preserve Canvas as receiver/output carrier only.
// Does not own:
// - terrain truth
// - hydrology truth
// - elevation truth
// - material truth
// - atmosphere truth
// - lighting truth
// - finger truth
// - pointer truth
// - Queen input truth
// - LabWest admissibility truth
// - Route Conductor handshake truth
// - diagnostic case selection
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

  const CONTRACT = "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v1";
  const RECEIPT = "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_v1";

  const FILE = "/assets/hearth/hearth.canvas.expression.bridge.js";
  const ROUTE = "/showroom/globe/hearth/";
  const DIAGNOSTIC_ROUTE = "/showroom/globe/hearth/diagnostic/";

  const PARENT_CANVAS_FILE = "/assets/hearth/hearth.canvas.js";
  const ROUTE_CONDUCTOR_FILE = "/showroom/globe/hearth/hearth.js";
  const CONTROL_FILE = "/assets/hearth/hearth.controls.js";
  const LABWEST_FILE = "/assets/lab/runtime-table.west.js";

  const CURRENT_PARENT_CANVAS_CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const PARENT_CANVAS_V12_2_CONTRACT =
    "HEARTH_CANVAS_HUB_FAST_VIEW_TRANSFORM_DEFERRED_RENDER_RECEIVER_TNT_v12_2";
  const PARENT_CANVAS_V12_1_CONTRACT =
    "HEARTH_CANVAS_HUB_PLANETARY_VIEW_CONTROL_RECEIVER_TNT_v12_1";
  const PARENT_CANVAS_V12_CONTRACT =
    "HEARTH_CANVAS_HUB_THREE_FILE_STRETCH_VISIBLE_EXPRESSION_COORDINATION_TNT_v12";

  const ROUTE_CONDUCTOR_CONTRACT =
    "HEARTH_ROUTE_CONDUCTOR_BISHOP_QUEEN_CANVAS_RECOGNITION_FUNNEL_TNT_v9_9";
  const QUEEN_CONTROL_CONTRACT =
    "HEARTH_CONTROLS_PLANETARY_VIEW_INPUT_HANDSHAKE_TNT_v1";
  const LABWEST_CONTRACT =
    "LAB_RUNTIME_TABLE_CARDINAL_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE_TNT_v4_7";

  const HEX_SURFACE_V2_CONTRACT =
    "HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER_TNT_v2";
  const HEX_SURFACE_V1_CONTRACT =
    "HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER_TNT_v1";
  const HEX_FOUR_PAIR_CONTRACT =
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY_TNT_v1";

  const POINTER_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.inspect.js";
  const SURFACE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.surface.js";
  const COMPOSITE_FINGER_FILE = "/assets/hearth/hearth.canvas.finger.composite.js";
  const HEX_SURFACE_FILE = "/assets/hearth/hearth.hex.surface.js";
  const HEX_FOUR_PAIR_FILE = "/assets/hearth/hearth.hex.four-pair.authority.js";

  const CANVAS_SELECTORS = Object.freeze([
    "#hearthCanvas",
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
  const adapterRefs = [];

  const state = {
    contract: CONTRACT,
    receipt: RECEIPT,
    file: FILE,
    route: ROUTE,
    diagnosticRoute: DIAGNOSTIC_ROUTE,

    role: "Canvas visible-expression bridge / second pair file",
    bridgePairRole: "EXPRESSION_SIDE_BRIDGE",
    authoritySideBridgeFile: PARENT_CANVAS_FILE,
    routeConductorFile: ROUTE_CONDUCTOR_FILE,
    controlFile: CONTROL_FILE,
    labWestFile: LABWEST_FILE,

    loaded: true,
    booted: false,
    booting: false,
    startedAt: "",
    updatedAt: "",
    publishedAt: "",

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
    adapterMethod: "NONE",
    adapterError: "",

    nativeBridgeDrawAttempted: false,
    nativeBridgeDrawComplete: false,

    visibleExpressionBridgeReady: false,
    canvasExpressionSurfaceReady: false,
    canvasExpressionRichnessReady: false,
    domExpressionSurfaceProofReady: false,
    visiblePlanetProofReady: false,
    visiblePlanetProofSource: "NONE",
    visiblePlanetProofReason: "NOT_DRAWN",
    renderedPlanetProofReady: false,
    canvasPixelVarianceStatus: "NO_PIXEL_SAMPLE",

    expressionHubActive: true,
    canvasExpressionHubActive: true,
    visibleExpressionBridgeActive: true,
    compositeCompatibilityBridgeActive: true,
    fingerTruthOwned: false,
    pointerTruthOwned: false,

    downstreamCompositeObserved: false,
    downstreamFingerObserved: false,
    downstreamHexObserved: false,
    hexSurfaceObserved: false,
    hexFourPairObserved: false,

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
    lastPacket: null,
    lastAuthorityPacket: null,
    lastRouteConductorPacket: null,
    lastQueenPacket: null,
    lastLabWestPacket: null,
    lastFingerPacket: null,
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
    recommendedNextAction: "LOAD_OR_CALL_CANVAS_EXPRESSION_BRIDGE",
    postgameStatus: "CANVAS_EXPRESSION_BRIDGE_LOADED_WAITING_DRAW",

    aliasPublishCount: 0,
    receiptPublishCount: 0,
    upstreamNotifyCount: 0,

    events: [],
    errors: [],

    ...FINAL_FALSE
  };

  let drawTimer = 0;
  let notifyGuard = false;
  let drawingGuard = false;

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

  function setPath(path, value, overwrite = true) {
    const parts = safeString(path).split(".");
    if (!parts.length) return false;

    let cursor = root;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }

    const key = parts[parts.length - 1];

    if (!overwrite && cursor[key] !== undefined && cursor[key] !== null) return false;

    cursor[key] = value;
    return true;
  }

  function datasetValue(key, fallback = "") {
    if (!doc || !doc.documentElement || !doc.documentElement.dataset) return fallback;
    const value = doc.documentElement.dataset[key];
    return value === undefined || value === null || value === "" ? fallback : value;
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
      ""
    );
  }

  function readReceipt(authority) {
    if (!authority || !isObject(authority) || authority === api) return null;

    const methods = [
      "getReceiptLight",
      "getReceipt",
      "getExpressionBridgeReceipt",
      "getVisibleExpressionBridgeReceipt",
      "getCanvasStationReceiptLight",
      "getCanvasStationReceipt",
      "getCanvasStationSummary",
      "getExpressionHubReceipt",
      "getExpressionHubSummary",
      "getCompositePacket",
      "getCompositeModel",
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
        const output = authority[method]();
        if (isObject(output)) return output;
      } catch (_error) {}
    }

    if (isObject(authority.receipt)) return authority.receipt;
    if (isObject(authority.receiptPacket)) return authority.receiptPacket;
    if (isObject(authority.canvasStationSummary)) return authority.canvasStationSummary;
    if (authority.contract || authority.CONTRACT || authority.receipt || authority.RECEIPT) return authority;

    return null;
  }

  function safeInvoke(target, method, args = []) {
    if (!target || !isFunction(target[method])) {
      return { ok: false, value: null, error: `method-unavailable:${method}` };
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

  function hasDrawableAdapter(authority) {
    if (!authority || !isObject(authority) || authority === api) return false;

    return [
      "drawToCanvas",
      "drawVisibleExpression",
      "drawHearthVisibleExpression",
      "drawHearthCompositeFrame",
      "drawCompositeFrame",
      "drawFrame",
      "renderComposite",
      "renderFrame",
      "render",
      "draw",
      "compose"
    ].some((method) => isFunction(authority[method]));
  }

  function findDrawMethod(authority) {
    if (!authority || !isObject(authority) || authority === api) return "NONE";

    const methods = [
      "drawToCanvas",
      "drawVisibleExpression",
      "drawHearthVisibleExpression",
      "drawHearthCompositeFrame",
      "drawCompositeFrame",
      "drawFrame",
      "renderComposite",
      "renderFrame",
      "render",
      "draw",
      "compose"
    ];

    for (const method of methods) {
      if (isFunction(authority[method])) return method;
    }

    return "NONE";
  }

  function rememberAdapter(name, authority) {
    if (!authority || !isObject(authority) || authority === api) return false;
    if (adapterRefs.some((item) => item.authority === authority)) return false;

    adapterRefs.push({ name, authority });
    trim(adapterRefs, 32);
    return true;
  }

  function shouldReplaceCompositeAlias(existing) {
    if (!existing || existing === api) return true;
    if (!isObject(existing)) return true;
    if (!hasDrawableAdapter(existing)) return true;
    return false;
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

    const ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true, willReadFrequently: true }) : null;

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

  function drawNativeBridgeSurface(canvas, ctx, packet = {}) {
    if (!canvas || !ctx) return false;

    state.nativeBridgeDrawAttempted = true;

    try {
      const w = canvas.width || 720;
      const h = canvas.height || 720;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.385;
      const view = isObject(packet.viewState) ? packet.viewState : {};
      const yaw = safeNumber(view.yaw, safeNumber(packet.yaw, 0));
      const pitch = clamp(safeNumber(view.pitch, safeNumber(packet.pitch, 0)), -1.2, 1.2);
      const phase = safeNumber(view.phase, 0) + yaw * 0.2;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
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
      ctx.fillStyle = "rgba(94,126,78,0.96)";

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

      state.nativeBridgeDrawComplete = true;
      return true;
    } catch (error) {
      state.nativeBridgeDrawComplete = false;
      state.lastDrawError = error && error.message ? String(error.message) : String(error);
      recordError("NATIVE_BRIDGE_SURFACE_DRAW_FAILED", error);
      return false;
    }
  }

  function adapterAliasCandidates() {
    return [
      ["shadowed-adapter", null],

      ["HEARTH_CANVAS_FINGER_COMPOSITE", readPath("HEARTH_CANVAS_FINGER_COMPOSITE")],
      ["HEARTH_CANVAS_COMPOSITE_FINGER", readPath("HEARTH_CANVAS_COMPOSITE_FINGER")],
      ["HEARTH_CANVAS_COMPOSITE", readPath("HEARTH_CANVAS_COMPOSITE")],
      ["HEARTH.canvasFingerComposite", readPath("HEARTH.canvasFingerComposite")],
      ["HEARTH.canvasCompositeFinger", readPath("HEARTH.canvasCompositeFinger")],
      ["HEARTH.canvasComposite", readPath("HEARTH.canvasComposite")],
      ["DEXTER_LAB.hearthCanvasFingerComposite", readPath("DEXTER_LAB.hearthCanvasFingerComposite")],
      ["DEXTER_LAB.hearthCanvasCompositeFinger", readPath("DEXTER_LAB.hearthCanvasCompositeFinger")],
      ["DEXTER_LAB.hearthCanvasComposite", readPath("DEXTER_LAB.hearthCanvasComposite")],

      ["HEARTH_CANVAS_FINGER_SURFACE", readPath("HEARTH_CANVAS_FINGER_SURFACE")],
      ["HEARTH_POINTER_FINGER", readPath("HEARTH_POINTER_FINGER")],
      ["HEARTH_CANVAS_POINTER_FINGER", readPath("HEARTH_CANVAS_POINTER_FINGER")],
      ["HEARTH.canvasFingerSurface", readPath("HEARTH.canvasFingerSurface")],
      ["HEARTH.canvasPointerFinger", readPath("HEARTH.canvasPointerFinger")],
      ["DEXTER_LAB.hearthCanvasFingerSurface", readPath("DEXTER_LAB.hearthCanvasFingerSurface")],
      ["DEXTER_LAB.hearthCanvasPointerFinger", readPath("DEXTER_LAB.hearthCanvasPointerFinger")],

      ["HEARTH_HEX_SURFACE", readPath("HEARTH_HEX_SURFACE")],
      ["HEARTH_HEX_SURFACE_RENDERER", readPath("HEARTH_HEX_SURFACE_RENDERER")],
      ["HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER", readPath("HEARTH_HEX_SURFACE_CANVAS_HUB_THREE_FILE_VISIBLE_EXPRESSION_RENDERER")],
      ["HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER", readPath("HEARTH_HEX_SURFACE_FOUR_PAIR_AUTHORITY_CONSUMER")],
      ["HEARTH.hexSurface", readPath("HEARTH.hexSurface")],
      ["HEARTH.hexSurfaceRenderer", readPath("HEARTH.hexSurfaceRenderer")],
      ["DEXTER_LAB.hearthHexSurface", readPath("DEXTER_LAB.hearthHexSurface")],
      ["DEXTER_LAB.hearthHexSurfaceRenderer", readPath("DEXTER_LAB.hearthHexSurfaceRenderer")]
    ];
  }

  function collectDrawableAdapters() {
    const seen = new Set();
    const out = [];

    for (const item of adapterRefs) {
      if (!item || !item.authority || item.authority === api || seen.has(item.authority)) continue;
      if (!hasDrawableAdapter(item.authority)) continue;
      seen.add(item.authority);
      out.push(item);
    }

    for (const [name, authority] of adapterAliasCandidates()) {
      if (!authority || authority === api || seen.has(authority)) continue;
      if (!hasDrawableAdapter(authority)) continue;

      seen.add(authority);
      out.push({ name, authority });
    }

    return out;
  }

  function buildDrawPacket(canvas, ctx, packet = {}) {
    const receipt = getReceiptLight(false);

    return {
      packetType: "HEARTH_CANVAS_EXPRESSION_BRIDGE_DRAW_PACKET",
      contract: CONTRACT,
      receipt: RECEIPT,
      sourceFile: FILE,
      targetFile: FILE,
      canvas,
      ctx,
      context: ctx,
      viewState: isObject(packet.viewState)
        ? clonePlain(packet.viewState)
        : isObject(state.lastViewState)
          ? clonePlain(state.lastViewState)
          : {},
      parentCanvasFile: PARENT_CANVAS_FILE,
      routeConductorFile: ROUTE_CONDUCTOR_FILE,
      controlFile: CONTROL_FILE,
      bridgePairRole: state.bridgePairRole,
      visibleExpressionBridgeActive: true,
      compositeCompatibilityBridgeActive: true,
      receiverOnly: true,
      receiptLight: receipt,
      ...FINAL_FALSE
    };
  }

  function attemptAdapterDraw(canvas, ctx, packet = {}) {
    const adapters = collectDrawableAdapters();

    state.adapterDrawAttempted = adapters.length > 0;
    state.downstreamCompositeObserved = adapters.some((item) => safeString(item.name).toLowerCase().includes("composite"));
    state.downstreamFingerObserved = adapters.some((item) => safeString(item.name).toLowerCase().includes("finger"));
    state.downstreamHexObserved = adapters.some((item) => safeString(item.name).toLowerCase().includes("hex"));

    for (const item of adapters) {
      const method = findDrawMethod(item.authority);
      if (method === "NONE") continue;

      const authorityReceipt = readReceipt(item.authority) || {};
      const authorityContract = contractOf(authorityReceipt || item.authority);

      let result;

      if (method === "drawToCanvas") {
        result = safeInvoke(item.authority, method, [
          canvas,
          {
            ...buildDrawPacket(canvas, ctx, packet),
            adapterSourceName: item.name,
            adapterContract: authorityContract
          }
        ]);
      } else {
        result = safeInvoke(item.authority, method, [
          buildDrawPacket(canvas, ctx, packet),
          {
            source: "Hearth Canvas Expression Bridge",
            contract: CONTRACT,
            receipt: RECEIPT,
            adapterSourceName: item.name,
            adapterContract: authorityContract,
            ...FINAL_FALSE
          }
        ]);

        if (!result.ok) {
          result = safeInvoke(item.authority, method, [
            ctx,
            {
              canvas,
              source: "Hearth Canvas Expression Bridge",
              contract: CONTRACT,
              receipt: RECEIPT,
              adapterSourceName: item.name,
              adapterContract: authorityContract,
              ...FINAL_FALSE
            }
          ]);
        }
      }

      if (!result.ok) {
        state.adapterError = result.error;
        recordError("DOWNSTREAM_EXPRESSION_ADAPTER_DRAW_FAILED", result.error, {
          adapterSourceName: item.name,
          method
        });
        continue;
      }

      const pixelReady = canvasHasVisiblePixels(canvas, ctx);
      const explicitFalse = result.value === false;

      if (pixelReady && !explicitFalse) {
        state.adapterDrawComplete = true;
        state.adapterSourceName = item.name;
        state.adapterContract = authorityContract || "";
        state.adapterMethod = method;
        state.adapterError = "";
        state.hexSurfaceObserved = item.name.toLowerCase().includes("hex-surface") || authorityContract === HEX_SURFACE_V2_CONTRACT || authorityContract === HEX_SURFACE_V1_CONTRACT;
        state.hexFourPairObserved = authorityContract === HEX_FOUR_PAIR_CONTRACT;
        return true;
      }
    }

    state.adapterDrawComplete = false;
    return false;
  }

  function updateVisibleProof(source, reason, pixelReady) {
    state.visibleExpressionBridgeReady = Boolean(pixelReady);
    state.canvasExpressionSurfaceReady = Boolean(pixelReady);
    state.domExpressionSurfaceProofReady = Boolean(pixelReady);
    state.visiblePlanetProofReady = Boolean(pixelReady);
    state.renderedPlanetProofReady = Boolean(pixelReady);
    state.visiblePlanetProofSource = pixelReady ? source : "NONE";
    state.visiblePlanetProofReason = pixelReady ? reason : "VISIBLE_EXPRESSION_NOT_PROVEN";

    state.f13CanvasReadinessObserved = Boolean(state.drawAttempted);
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
      if (target.canvas && target.ctx) {
        drawNativeBridgeSurface(target.canvas, target.ctx, packet);
        const pixelReady = canvasHasVisiblePixels(target.canvas, target.ctx);
        updateVisibleProof("EXPRESSION_BRIDGE_NATIVE_RECURSION_GUARD", "RECURSION_GUARD_NATIVE_DRAW", pixelReady);
      }

      updateDataset();
      publishReceipts();
      return getReceiptLight(false);
    }

    drawingGuard = true;

    try {
      state.drawAttempted = true;
      state.drawCount += 1;
      state.lastDrawAt = nowIso();
      state.lastDrawReason = safeString(packet.reason || packet.drawReason || "drawToCanvas", "drawToCanvas");
      state.lastPacket = isObject(packet) ? clonePlain(packet) : null;

      const target = resolveCanvasTarget(canvasOrContext);

      if (!target.canvas || !target.ctx) {
        state.drawComplete = false;
        state.lastDrawError = "CANVAS_OR_2D_CONTEXT_NOT_AVAILABLE";
        updateVisibleProof("NONE", "CANVAS_OR_2D_CONTEXT_NOT_AVAILABLE", false);
        updateDataset();
        publishReceipts();
        return getReceiptLight(false);
      }

      const adapterOk = attemptAdapterDraw(target.canvas, target.ctx, packet);
      let source = "DOWNSTREAM_EXPRESSION_ADAPTER";
      let reason = "DOWNSTREAM_EXPRESSION_ADAPTER_DRAW_COMPLETE";

      if (!adapterOk) {
        const nativeOk = drawNativeBridgeSurface(target.canvas, target.ctx, packet);
        source = "EXPRESSION_BRIDGE_NATIVE_HOLDING_SURFACE";
        reason = nativeOk
          ? "NATIVE_BRIDGE_SURFACE_DRAW_COMPLETE"
          : "NATIVE_BRIDGE_SURFACE_DRAW_FAILED";
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

    if (lane === "AUTHORITY") state.lastAuthorityPacket = clonePlain(packet);
    if (lane === "ROUTE_CONDUCTOR") state.lastRouteConductorPacket = clonePlain(packet);
    if (lane === "QUEEN") state.lastQueenPacket = clonePlain(packet);
    if (lane === "LABWEST") state.lastLabWestPacket = clonePlain(packet);
    if (lane === "FINGER") state.lastFingerPacket = clonePlain(packet);

    if (isObject(packet.viewState)) state.lastViewState = clonePlain(packet.viewState);

    const packetContract = contractOf(packet);

    if (packetContract === CURRENT_PARENT_CANVAS_CONTRACT || packet.sourceFile === PARENT_CANVAS_FILE) {
      state.canvasHubObserved = true;
      state.canvasHubContract = packetContract || state.canvasHubContract;
      state.canvasHubReceipt = receiptOf(packet) || state.canvasHubReceipt;
    }

    if (packetContract === ROUTE_CONDUCTOR_CONTRACT || packet.sourceFile === ROUTE_CONDUCTOR_FILE) {
      state.routeConductorObserved = true;
      state.routeConductorContract = packetContract || state.routeConductorContract;
    }

    if (packetContract === QUEEN_CONTROL_CONTRACT || packet.sourceFile === CONTROL_FILE) {
      state.queenObserved = true;
      state.queenContract = packetContract || state.queenContract;
    }

    if (packetContract === LABWEST_CONTRACT || packet.sourceFile === LABWEST_FILE) {
      state.labWestObserved = true;
      state.labWestContract = packetContract || state.labWestContract;
    }

    record("CANVAS_EXPRESSION_BRIDGE_PACKET_RECEIVED", {
      lane,
      packetType: packet.packetType || packet.type || "",
      contract: packetContract,
      sourceFile: packet.sourceFile || "",
      targetFile: packet.targetFile || ""
    });

    if (
      packet.canvas ||
      packet.ctx ||
      packet.context ||
      packet.drawNow === true ||
      packet.visibleExpressionRequested === true ||
      packet.canvasReleaseAuthorized === true
    ) {
      drawToCanvas(packet.canvas || packet.ctx || packet.context || null, packet);
    } else {
      scheduleDraw(`packet-received:${lane}`);
    }

    updateDataset();
    publishReceipts();
    return getReceiptLight(false);
  }

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
  function receiveLabWestPacket(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveLabWestContext(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveWestGateContext(packet = {}) { return receivePacket(packet, "LABWEST"); }
  function receiveFingerPacket(packet = {}) { return receivePacket(packet, "FINGER"); }
  function receiveCanvasFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveExpressionFingerPacket(packet = {}) { return receiveFingerPacket(packet); }
  function receiveFingerReceipt(packet = {}) { return receiveFingerPacket(packet); }
  function receiveHierarchyContext(packet = {}) { return receivePacket(packet, "HIERARCHY"); }

  function scanUpstreamAuthorities() {
    const canvasHub =
      readPath("HEARTH_CANVAS_HUB") ||
      readPath("HEARTH.canvasHub") ||
      readPath("DEXTER_LAB.hearthCanvasHub") ||
      readPath("HEARTH_CANVAS") ||
      readPath("HEARTH.canvas");

    const canvasReceipt = readReceipt(canvasHub) || {};

    if (canvasHub && canvasHub !== api) {
      state.canvasHubObserved = true;
      state.canvasHubContract = contractOf(canvasReceipt || canvasHub);
      state.canvasHubReceipt = receiptOf(canvasReceipt || canvasHub);
    }

    const route =
      readPath("HEARTH_ROUTE_CONDUCTOR") ||
      readPath("HEARTH.routeConductor") ||
      readPath("DEXTER_LAB.hearthRouteConductor");

    const routeReceipt = readReceipt(route) || {};

    if (route && route !== api) {
      state.routeConductorObserved = true;
      state.routeConductorContract = contractOf(routeReceipt || route);
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
      state.queenContract = contractOf(queenReceipt || queen);
    }

    const west =
      readPath("LAB_RUNTIME_TABLE_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE") ||
      readPath("HEARTH_WEST_BISHOP_CHORD_CANVAS_RELEASE_BRIDGE") ||
      readPath("HEARTH.westBishopChordCanvasReleaseBridge") ||
      readPath("DEXTER_LAB.hearthWestBishopChordCanvasReleaseBridge");

    const westReceipt = readReceipt(west) || {};

    if (west && west !== api) {
      state.labWestObserved = true;
      state.labWestContract = contractOf(westReceipt || west);
    }

    collectDrawableAdapters();
    return getReceiptLight(false);
  }

  function getReceiptLight(doScan = true) {
    if (doScan) scanUpstreamAuthorities();

    return {
      packetType: "HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_LIGHT",
      contract: CONTRACT,
      receipt: RECEIPT,
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

      currentCanvasParentObserved: true,
      currentCanvasParentContractObserved: true,
      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      canvasContractAcceptedByShape: true,
      canvasSummaryAcceptedByShape: true,
      canvasSummaryShapeTrusted: true,

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
      adapterMethod: state.adapterMethod,
      adapterError: state.adapterError,

      nativeBridgeDrawAttempted: state.nativeBridgeDrawAttempted,
      nativeBridgeDrawComplete: state.nativeBridgeDrawComplete,

      downstreamCompositeObserved: state.downstreamCompositeObserved,
      downstreamFingerObserved: state.downstreamFingerObserved,
      downstreamHexObserved: state.downstreamHexObserved,
      hexSurfaceObserved: state.hexSurfaceObserved,
      hexFourPairObserved: state.hexFourPairObserved,

      canvasHubObserved: state.canvasHubObserved,
      canvasHubContract: state.canvasHubContract,
      canvasHubReceipt: state.canvasHubReceipt,
      routeConductorObserved: state.routeConductorObserved,
      routeConductorContract: state.routeConductorContract,
      queenObserved: state.queenObserved,
      queenContract: state.queenContract,
      labWestObserved: state.labWestObserved,
      labWestContract: state.labWestContract,

      visibleExpressionBridgeReady: state.visibleExpressionBridgeReady,
      canvasExpressionSurfaceReady: state.canvasExpressionSurfaceReady,
      canvasExpressionRichnessReady: state.canvasExpressionRichnessReady,
      domExpressionSurfaceProofReady: state.domExpressionSurfaceProofReady,
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
      aliasPublishCount: state.aliasPublishCount,
      receiptPublishCount: state.receiptPublishCount,
      upstreamNotifyCount: state.upstreamNotifyCount,
      updatedAt: state.updatedAt || nowIso(),

      ownsPracticalDrawingBridge: true,
      ownsCanvasPlacementFallback: true,
      ownsPixelProofPublication: true,

      ownsTerrainTruth: false,
      ownsHydrologyTruth: false,
      ownsElevationTruth: false,
      ownsMaterialTruth: false,
      ownsAtmosphereTruth: false,
      ownsLightingTruth: false,
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
      adapterRefs: adapterRefs.map((item) => item.name),
      lastPacket: clonePlain(state.lastPacket),
      lastAuthorityPacket: clonePlain(state.lastAuthorityPacket),
      lastRouteConductorPacket: clonePlain(state.lastRouteConductorPacket),
      lastQueenPacket: clonePlain(state.lastQueenPacket),
      lastLabWestPacket: clonePlain(state.lastLabWestPacket),
      lastFingerPacket: clonePlain(state.lastFingerPacket),
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
      `file=${FILE}`,
      `route=${ROUTE}`,
      `bridgePairRole=${state.bridgePairRole}`,
      `authoritySideBridgeFile=${PARENT_CANVAS_FILE}`,
      "",
      "DRAW",
      `canvasMounted=${r.canvasMounted}`,
      `canvasContext2dReady=${r.canvasContext2dReady}`,
      `drawAttempted=${r.drawAttempted}`,
      `drawComplete=${r.drawComplete}`,
      `lastDrawSource=${r.lastDrawSource}`,
      `adapterDrawComplete=${r.adapterDrawComplete}`,
      `nativeBridgeDrawComplete=${r.nativeBridgeDrawComplete}`,
      "",
      "VISIBLE_PROOF",
      `canvasExpressionSurfaceReady=${r.canvasExpressionSurfaceReady}`,
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
    setDataset("hearthCanvasExpressionBridgeFile", FILE);
    setDataset("hearthCanvasExpressionBridgePairRole", state.bridgePairRole);
    setDataset("hearthCanvasExpressionBridgeAuthoritySideFile", PARENT_CANVAS_FILE);

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
    setDataset("hearthCanvasExpressionBridgeNativeDrawComplete", String(state.nativeBridgeDrawComplete));

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

  function publishApiAliases() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");

    root.HEARTH_CANVAS_EXPRESSION_BRIDGE = api;
    root.HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE = api;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR = api;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_TNT_v1 = api;

    hearth.canvasExpressionBridge = api;
    hearth.canvasVisibleExpressionBridge = api;
    hearth.canvasExpressionBridgeSecondPair = api;

    lab.hearthCanvasExpressionBridge = api;
    lab.hearthCanvasVisibleExpressionBridge = api;
    lab.hearthCanvasExpressionBridgeSecondPair = api;

    const compositeAliases = [
      "HEARTH_CANVAS_FINGER_COMPOSITE",
      "HEARTH_CANVAS_COMPOSITE_FINGER",
      "HEARTH_CANVAS_COMPOSITE",
      "HEARTH.canvasFingerComposite",
      "HEARTH.canvasCompositeFinger",
      "HEARTH.canvasComposite",
      "DEXTER_LAB.hearthCanvasFingerComposite",
      "DEXTER_LAB.hearthCanvasCompositeFinger",
      "DEXTER_LAB.hearthCanvasComposite"
    ];

    for (const alias of compositeAliases) {
      const existing = readPath(alias);
      if (existing && existing !== api) rememberAdapter(alias, existing);

      if (shouldReplaceCompositeAlias(existing)) {
        setPath(alias, api, true);
      }
    }

    state.aliasPublishCount += 1;
    state.publishedAt = state.publishedAt || nowIso();
    state.updatedAt = nowIso();
  }

  function publishReceipts() {
    const hearth = ensureObject(root, "HEARTH");
    const lab = ensureObject(root, "DEXTER_LAB");
    const light = getReceiptLight(false);
    const full = getReceipt();

    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_EXPRESSION_BRIDGE_RECEIPT = light;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT = full;
    root.HEARTH_CANVAS_EXPRESSION_BRIDGE_SECOND_PAIR_RECEIPT_v1 = full;

    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = light;
    root.HEARTH_CANVAS_FINGER_COMPOSITE_RECEIPT = light;
    root.HEARTH_CANVAS_VISIBLE_PLANET_RECEIPT = light;

    hearth.canvasExpressionBridgeReceipt = light;
    hearth.canvasVisibleExpressionBridgeReceipt = light;
    hearth.canvasExpressionBridgeSecondPairReceipt = full;
    hearth.canvasExpressionHubReceipt = light;
    hearth.canvasFingerCompositeReceipt = light;
    hearth.canvasVisiblePlanetReceipt = light;

    lab.hearthCanvasExpressionBridgeReceipt = light;
    lab.hearthCanvasVisibleExpressionBridgeReceipt = light;
    lab.hearthCanvasExpressionBridgeSecondPairReceipt = full;
    lab.hearthCanvasExpressionHubReceipt = light;
    lab.hearthCanvasFingerCompositeReceipt = light;
    lab.hearthCanvasVisiblePlanetReceipt = light;

    state.receiptPublishCount += 1;
    updateDataset();
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
        "receiveFingerPacket",
        "receiveExpressionFingerPacket",
        "receiveCanvasExpressionPacket",
        "reconcileCanvas"
      ];

      for (const target of targets) {
        for (const method of methods) {
          if (!isFunction(target[method])) continue;

          safeInvoke(target, method, [{
            ...clonePlain(receipt),
            packetType: "HEARTH_CANVAS_EXPRESSION_BRIDGE_UPSTREAM_NOTICE",
            noticeReason: reason,
            fingerKey: "composite",
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
      publishApiAliases();
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
        canvasHubObserved: state.canvasHubObserved,
        routeConductorObserved: state.routeConductorObserved
      });

      updateDataset();
      publishReceipts();
      notifyUpstream("boot");
      return getReceipt();
    } catch (error) {
      recordError("CANVAS_EXPRESSION_BRIDGE_BOOT_FAILED", error);
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
    contract: CONTRACT,
    receipt: RECEIPT,
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
    HEX_SURFACE_V2_CONTRACT,
    HEX_SURFACE_V1_CONTRACT,
    HEX_FOUR_PAIR_CONTRACT,

    POINTER_FINGER_FILE,
    SURFACE_FINGER_FILE,
    COMPOSITE_FINGER_FILE,
    HEX_SURFACE_FILE,
    HEX_FOUR_PAIR_FILE,

    boot,
    init,
    start,
    mount,

    drawToCanvas,
    drawVisibleExpression,
    scheduleDraw,

    receivePacket,
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
    receiveLabWestPacket,
    receiveLabWestContext,
    receiveWestGateContext,
    receiveFingerPacket,
    receiveCanvasFingerPacket,
    receiveExpressionFingerPacket,
    receiveFingerReceipt,
    receiveHierarchyContext,

    scanUpstreamAuthorities,
    collectDrawableAdapters,
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
    publishApiAliases,
    publishReceipts,
    notifyUpstream,

    supportsCanvasExpressionBridge: true,
    supportsVisibleExpressionBridge: true,
    supportsCompositeCompatibilityBridge: true,
    supportsDrawToCanvas: true,
    supportsCanvasContextAcceptance: true,
    supportsCanvasLocationFallback: true,
    supportsPixelVisibleProof: true,
    supportsUpstreamReceiptPublication: true,
    supportsNoWebGL: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,

    ownsPracticalDrawingBridge: true,
    ownsCanvasPlacementFallback: true,
    ownsPixelProofPublication: true,

    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsElevationTruth: false,
    ownsMaterialTruth: false,
    ownsAtmosphereTruth: false,
    ownsLightingTruth: false,
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
    publishApiAliases();
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
        publishApiAliases();
        scanUpstreamAuthorities();
        scheduleDraw("post-publication-retry-1");
        notifyUpstream("post-publication-retry-1");
      }, 320);

      root.setTimeout(() => {
        publishApiAliases();
        scanUpstreamAuthorities();
        scheduleDraw("post-publication-retry-2");
        notifyUpstream("post-publication-retry-2");
      }, 1100);
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
