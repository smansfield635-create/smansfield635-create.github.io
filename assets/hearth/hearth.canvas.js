// /assets/hearth/hearth.canvas.js
// HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3
// Internal renewal:
// HEARTH_CANVAS_HUB_DOM_SURFACE_BINDING_FAST_VIEW_RECEIVER_TNT_v12_5
// Full-file replacement.
// Canvas hub / visible DOM canvas surface receiver only.
// Purpose:
// - Preserve the public Canvas Hub contract expected by North.
// - Create or bind the real DOM canvas surface expected by the F21 Canvas surface-truth probe.
// - Bind the canvas into the existing Hearth mount without renewing the whole planet engine.
// - Publish the accepted Canvas Hub namespace aliases.
// - Provide a fast visible initial carrier until downstream expression packets are available.
// - Prefer downstream expression authority if a child file exposes a lawful draw/render adapter.
// - Preserve controls, route conductor, terrain, hydrology, material, elevation, and runtime boundaries.
// - Preserve no ready text, no final visual pass, no generated image, no GraphicBox, no WebGL.
// Does not own:
// - terrain truth
// - hydrology truth
// - material truth
// - elevation truth
// - route conductor implementation
// - controls implementation
// - diagnostic rail implementation
// - final readiness
// - visual pass

(() => {
  "use strict";

  const CONTRACT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_TNT_v12_3";
  const RECEIPT =
    "HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT_v12_3";

  const INTERNAL_RENEWAL_CONTRACT =
    "HEARTH_CANVAS_HUB_DOM_SURFACE_BINDING_FAST_VIEW_RECEIVER_TNT_v12_5";
  const INTERNAL_RENEWAL_RECEIPT =
    "HEARTH_CANVAS_HUB_DOM_SURFACE_BINDING_FAST_VIEW_RECEIVER_RECEIPT_v12_5";

  const VERSION =
    "2026-06-07.hearth-canvas-hub-dom-surface-binding-fast-view-receiver-v12-5";

  const FILE = "/assets/hearth/hearth.canvas.js";
  const TARGET_ROUTE = "/showroom/globe/hearth/";
  const CANVAS_ID = "hearthCanvas";

  const NO_CLAIMS = Object.freeze({
    f13Claimed: false,
    f21EligibleForNorth: false,
    f21ClaimedByCanvas: false,
    f21ClaimedByDiagnosticRail: false,
    readyTextAllowed: false,
    readyTextClaimed: false,
    readyTextClaimedByCanvas: false,
    readyTextClaimedByDiagnosticRail: false,
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
    F21_CLAIMED_BY_CANVAS: false,
    F21_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    READY_TEXT_ALLOWED: false,
    READY_TEXT_CLAIMED: false,
    READY_TEXT_CLAIMED_BY_CANVAS: false,
    READY_TEXT_CLAIMED_BY_DIAGNOSTIC_RAIL: false,
    VISUAL_PASS_CLAIMED: false,
    FINAL_VISUAL_PASS_CLAIMED: false,
    GENERATED_IMAGE: false,
    GRAPHIC_BOX: false,
    WEBGL: false
  });

  const MOUNT_SELECTORS = Object.freeze([
    "#hearthCanvasMount",
    "[data-hearth-canvas-mount]",
    "[data-hearth-visible-planet-mount]",
    "[data-hearth-planet-mount]",
    "[data-hearth-full-planet-visibility-mount]",
    "#hearthGlobeStage",
    "[data-hearth-globe-stage]",
    "[data-hearth-planet-stage]",
    "main",
    "body"
  ]);

  const CANVAS_SELECTORS = Object.freeze([
    `#${CANVAS_ID}`,
    "canvas[data-hearth-expression-surface='true']",
    "canvas[data-hearth-visible-canvas='true']",
    "canvas[data-hearth-canvas-hub='true']",
    "canvas[data-hearth-base-globe-canvas='true']",
    "canvas[data-hearth-planet-canvas='true']",
    "canvas[data-hearth-canvas='true']",
    "canvas[data-hearth-canvas-texture='true']"
  ]);

  const DOWNSTREAM_PATHS = Object.freeze([
    "HEARTH.hexSurface",
    "HEARTH.hearthHexSurface",
    "HEARTH.canvasHexSurface",
    "HEARTH.hearthCanvasHexSurface",
    "HEARTH_HEX_SURFACE",
    "HEARTH.hexFourPairAuthority",
    "HEARTH.hearthHexFourPairAuthority",
    "HEARTH.hexFourPairPixelHandshakeAuthority",
    "HEARTH_HEX_FOUR_PAIR_PIXEL_HANDSHAKE_AUTHORITY",
    "HEARTH.surface",
    "HEARTH.hearthSurface",
    "HEARTH.surfacePacket",
    "HEARTH.expressionSurface",
    "HEARTH.canvasExpressionSurface",
    "DEXTER_LAB.hearthHexSurface",
    "DEXTER_LAB.hearthHexFourPairAuthority",
    "DEXTER_LAB.hearthSurface",
    "DEXTER_LAB.hearthExpressionSurface"
  ]);

  const DOWNSTREAM_DRAW_METHODS = Object.freeze([
    "drawToCanvas",
    "renderToCanvas",
    "paintToCanvas",
    "drawCanvas",
    "renderCanvas",
    "paintCanvas",
    "draw",
    "render",
    "paint"
  ]);

  const root = typeof window !== "undefined" ? window : globalThis;
  const api = {};

  let state = {
    mounted: false,
    started: false,
    canvas: null,
    context: null,
    mount: null,
    mountSelector: "NONE",
    canvasSelector: "NONE",
    mountFound: false,
    canvasCreated: false,
    canvasAdopted: false,
    canvasInMount: false,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasRectWidth: 0,
    canvasRectHeight: 0,
    canvasRectNonzero: false,
    context2dReady: false,
    pixelVisible: false,
    pixelSampleStatus: "NOT_RUN",
    renderCount: 0,
    lastRenderAt: "NONE",
    lastMountAt: "NONE",
    lastError: "NONE",
    downstreamExpressionObserved: false,
    downstreamExpressionPath: "NONE",
    downstreamExpressionMethod: "NONE",
    downstreamExpressionStatus: "NOT_USED",
    visibleCarrierStatus: "INITIAL_CARRIER_PENDING_DOWNSTREAM_EXPRESSION",
    sourceStatus: "DOM_SURFACE_BINDING_FAST_VIEW_RECEIVER",
    view: {
      yaw: -0.32,
      pitch: 0.14,
      scale: 1
    }
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
    return String(value);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function bounded(value, limit = 4000) {
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

  function readPath(path) {
    const parts = safeString(path).split(".");
    let cursor = root;

    for (const part of parts) {
      if (!cursor || cursor[part] === undefined || cursor[part] === null) return null;
      cursor = cursor[part];
    }

    return cursor || null;
  }

  function q(doc, selector) {
    if (!doc || !isFunction(doc.querySelector)) return null;

    try {
      return doc.querySelector(selector);
    } catch (_error) {
      return null;
    }
  }

  function firstElement(doc, selectors) {
    for (const selector of selectors) {
      const element = q(doc, selector);
      if (element) return { element, selector };
    }

    return { element: null, selector: "NONE" };
  }

  function getRect(element) {
    if (!element || !isFunction(element.getBoundingClientRect)) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }

    try {
      const rect = element.getBoundingClientRect();
      return {
        width: safeNumber(rect.width, 0),
        height: safeNumber(rect.height, 0),
        left: safeNumber(rect.left, 0),
        top: safeNumber(rect.top, 0),
        right: safeNumber(rect.right, 0),
        bottom: safeNumber(rect.bottom, 0)
      };
    } catch (_error) {
      return { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 };
    }
  }

  function containsOrEquals(parent, child) {
    if (!parent || !child) return false;
    if (parent === child) return true;

    try {
      return Boolean(parent.contains(child));
    } catch (_error) {
      return false;
    }
  }

  function findDocument(input = {}) {
    if (input.targetDocument) return input.targetDocument;
    if (input.document) return input.document;
    return root.document || null;
  }

  function findWindow(input = {}) {
    if (input.targetWindow) return input.targetWindow;
    if (input.window) return input.window;
    const doc = findDocument(input);
    return (doc && doc.defaultView) || root;
  }

  function markMount(mount) {
    if (!mount || !isObject(mount.dataset)) return;

    mount.dataset.hearthCanvasMount = "true";
    mount.dataset.hearthCanvasMountContract = CONTRACT;
    mount.dataset.hearthCanvasMountReceipt = RECEIPT;
    mount.dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
  }

  function styleMount(mount) {
    if (!mount || !mount.style) return;

    try {
      const computed = root.getComputedStyle ? root.getComputedStyle(mount) : null;

      if (computed && computed.position === "static") {
        mount.style.position = "relative";
      }

      if (!mount.style.minHeight) mount.style.minHeight = "320px";
      if (!mount.style.display) mount.style.display = "grid";
      if (!mount.style.placeItems) mount.style.placeItems = "center";
      if (!mount.style.overflow) mount.style.overflow = "visible";
    } catch (_error) {}
  }

  function markCanvas(canvas) {
    if (!canvas) return;

    if (!canvas.id) canvas.id = CANVAS_ID;

    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Hearth visible planet canvas surface");

    if (canvas.dataset) {
      canvas.dataset.hearthExpressionSurface = "true";
      canvas.dataset.hearthVisibleCanvas = "true";
      canvas.dataset.hearthCanvasHub = "true";
      canvas.dataset.hearthBaseGlobeCanvas = "true";
      canvas.dataset.hearthPlanetCanvas = "true";
      canvas.dataset.hearthCanvas = "true";
      canvas.dataset.hearthCanvasTexture = "true";
      canvas.dataset.hearthCanvasContract = CONTRACT;
      canvas.dataset.hearthCanvasReceipt = RECEIPT;
      canvas.dataset.hearthCanvasInternalRenewalContract = INTERNAL_RENEWAL_CONTRACT;
      canvas.dataset.hearthCanvasInternalRenewalReceipt = INTERNAL_RENEWAL_RECEIPT;
      canvas.dataset.generatedImage = "false";
      canvas.dataset.graphicBox = "false";
      canvas.dataset.webgl = "false";
      canvas.dataset.visualPassClaimed = "false";
      canvas.dataset.readyTextClaimed = "false";
      canvas.dataset.productionMutationAuthorized = "false";
    }

    try {
      canvas.style.display = "block";
      canvas.style.width = "min(92vw, 760px)";
      canvas.style.height = "min(92vw, 760px)";
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "76vh";
      canvas.style.aspectRatio = "1 / 1";
      canvas.style.margin = "0 auto";
      canvas.style.position = "relative";
      canvas.style.zIndex = "2";
      canvas.style.touchAction = "none";
      canvas.style.pointerEvents = "auto";
      canvas.style.background = "transparent";
      canvas.style.border = "0";
      canvas.style.outline = "0";
    } catch (_error) {}
  }

  function ensureMount(doc) {
    const result = firstElement(doc, MOUNT_SELECTORS);
    const mount = result.element;

    if (mount) {
      markMount(mount);
      styleMount(mount);
      state.mountFound = true;
      state.mountSelector = result.selector;
      return mount;
    }

    state.mountFound = false;
    state.mountSelector = "NONE";
    return null;
  }

  function ensureCanvas(doc, mount) {
    let result = firstElement(doc, CANVAS_SELECTORS);
    let canvas = result.element;

    if (!canvas) {
      canvas = doc.createElement("canvas");
      canvas.id = CANVAS_ID;
      state.canvasCreated = true;
      result = { element: canvas, selector: `#${CANVAS_ID}` };
    } else {
      state.canvasCreated = false;
    }

    markCanvas(canvas);

    if (mount && !containsOrEquals(mount, canvas)) {
      try {
        mount.appendChild(canvas);
        state.canvasAdopted = true;
      } catch (error) {
        state.lastError = `CANVAS_APPEND_FAILED:${bounded(error && error.message ? error.message : error, 800)}`;
      }
    } else {
      state.canvasAdopted = false;
    }

    state.canvasSelector = result.selector;
    state.canvasInMount = Boolean(mount && containsOrEquals(mount, canvas));

    return canvas;
  }

  function resizeCanvas(targetWindow, canvas, mount) {
    if (!canvas) return false;

    const dpr = Math.max(1, Math.min(3, safeNumber(targetWindow.devicePixelRatio, 1)));
    const canvasRect = getRect(canvas);
    const mountRect = getRect(mount);

    let cssWidth = canvasRect.width || mountRect.width || 720;
    let cssHeight = canvasRect.height || mountRect.height || cssWidth;

    cssWidth = Math.max(320, Math.min(1200, cssWidth));
    cssHeight = Math.max(320, Math.min(1200, cssHeight));

    const targetWidth = Math.max(1, Math.round(cssWidth * dpr));
    const targetHeight = Math.max(1, Math.round(cssHeight * dpr));

    if (canvas.width !== targetWidth) canvas.width = targetWidth;
    if (canvas.height !== targetHeight) canvas.height = targetHeight;

    state.canvasWidth = canvas.width;
    state.canvasHeight = canvas.height;
    state.canvasRectWidth = cssWidth;
    state.canvasRectHeight = cssHeight;
    state.canvasRectNonzero = cssWidth > 0 && cssHeight > 0;

    if (canvas.dataset) {
      canvas.dataset.hearthCanvasWidth = String(canvas.width);
      canvas.dataset.hearthCanvasHeight = String(canvas.height);
      canvas.dataset.hearthCanvasRectNonzero = String(state.canvasRectNonzero);
      canvas.dataset.hearthCanvasMounted = "true";
    }

    return true;
  }

  function get2d(canvas) {
    if (!canvas || !isFunction(canvas.getContext)) return null;

    try {
      return canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    } catch (error) {
      state.lastError = `CONTEXT_2D_ERROR:${bounded(error && error.message ? error.message : error, 800)}`;
      return null;
    }
  }

  function sampleVisiblePixels(canvas, ctx) {
    if (!canvas || !ctx || !isFunction(ctx.getImageData)) {
      state.pixelSampleStatus = "PIXEL_SAMPLE_UNAVAILABLE";
      state.pixelVisible = false;
      return false;
    }

    try {
      const width = canvas.width;
      const height = canvas.height;
      const size = Math.max(4, Math.min(16, Math.floor(Math.min(width, height) / 40)));
      const points = [
        [0.5, 0.5],
        [0.35, 0.5],
        [0.65, 0.5],
        [0.5, 0.35],
        [0.5, 0.65]
      ];

      let visible = 0;
      let alpha = 0;

      for (const [px, py] of points) {
        const x = Math.max(0, Math.min(width - size, Math.floor(width * px - size / 2)));
        const y = Math.max(0, Math.min(height - size, Math.floor(height * py - size / 2)));
        const data = ctx.getImageData(x, y, size, size).data;

        for (let index = 0; index < data.length; index += 4) {
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a > 0) alpha += 1;
          if (a > 0 && (r > 4 || g > 4 || b > 4)) visible += 1;
        }
      }

      state.pixelVisible = visible > 0;
      state.pixelSampleStatus = state.pixelVisible
        ? "PIXEL_SAMPLE_VISIBLE"
        : alpha > 0
          ? "PIXEL_SAMPLE_ALPHA_ONLY"
          : "PIXEL_SAMPLE_BLANK";

      return state.pixelVisible;
    } catch (error) {
      state.pixelVisible = false;
      state.pixelSampleStatus = `PIXEL_SAMPLE_UNREADABLE:${bounded(error && error.message ? error.message : error, 800)}`;
      return false;
    }
  }

  function projectPoint(lon, lat, view, width, height, radius) {
    const yaw = safeNumber(view.yaw, 0);
    const pitch = safeNumber(view.pitch, 0);

    const lambda = lon + yaw;
    const phi = lat;

    const cosPhi = Math.cos(phi);
    let x = cosPhi * Math.sin(lambda);
    let y = Math.sin(phi);
    let z = cosPhi * Math.cos(lambda);

    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);

    const y2 = y * cp - z * sp;
    const z2 = y * sp + z * cp;

    return {
      x: width / 2 + x * radius,
      y: height / 2 - y2 * radius,
      z: z2,
      visible: z2 > -0.08
    };
  }

  function drawPoly(ctx, points, view, width, height, radius) {
    const projected = points.map(([lonDeg, latDeg]) => {
      return projectPoint(
        (lonDeg * Math.PI) / 180,
        (latDeg * Math.PI) / 180,
        view,
        width,
        height,
        radius
      );
    });

    const visibleCount = projected.filter((p) => p.visible).length;
    if (!visibleCount) return;

    ctx.beginPath();

    projected.forEach((p, index) => {
      if (index === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawInitialCarrier(ctx, canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) * 0.42 * safeNumber(state.view.scale, 1);

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    const ocean = ctx.createRadialGradient(
      cx - radius * 0.28,
      cy - radius * 0.36,
      radius * 0.12,
      cx,
      cy,
      radius
    );
    ocean.addColorStop(0, "rgba(62, 139, 184, 1)");
    ocean.addColorStop(0.58, "rgba(22, 83, 132, 1)");
    ocean.addColorStop(1, "rgba(6, 30, 61, 1)");

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = ocean;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    ctx.lineWidth = Math.max(1.2, width / 520);
    ctx.strokeStyle = "rgba(18, 47, 50, 0.72)";
    ctx.fillStyle = "rgba(118, 132, 77, 0.96)";

    const landBodies = [
      [[-155, 58], [-130, 70], [-92, 58], [-72, 36], [-88, 18], [-118, 20], [-148, 36]],
      [[-82, 14], [-55, 8], [-38, -18], [-52, -55], [-75, -44], [-84, -10]],
      [[-24, 38], [10, 56], [45, 44], [38, 20], [12, 8], [-18, 18]],
      [[8, 32], [46, 30], [58, 5], [44, -34], [14, -36], [-8, -4]],
      [[46, 52], [92, 60], [138, 46], [150, 16], [122, -2], [78, 10], [48, 28]],
      [[76, 8], [104, 12], [116, -8], [102, -28], [78, -20], [68, -2]],
      [[112, -16], [150, -18], [158, -38], [126, -46], [106, -34]],
      [[-178, -60], [-90, -70], [0, -66], [88, -72], [178, -62], [160, -82], [-160, -82]]
    ];

    landBodies.forEach((poly) => drawPoly(ctx, poly, state.view, width, height, radius));

    ctx.strokeStyle = "rgba(201, 194, 132, 0.28)";
    ctx.lineWidth = Math.max(0.8, width / 900);

    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lon = -180; lon <= 180; lon += 6) {
        const p = projectPoint((lon * Math.PI) / 180, (lat * Math.PI) / 180, state.view, width, height, radius);
        if (!p.visible) continue;
        if (lon === -180) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(205, 226, 232, 0.65)";
    ctx.lineWidth = Math.max(1.5, width / 480);
    ctx.stroke();

    const rim = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.06);
    rim.addColorStop(0, "rgba(255, 255, 255, 0)");
    rim.addColorStop(0.78, "rgba(255, 255, 255, 0)");
    rim.addColorStop(1, "rgba(178, 222, 232, 0.42)");

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.04, 0, Math.PI * 2);
    ctx.fillStyle = rim;
    ctx.fill();

    state.downstreamExpressionObserved = false;
    state.downstreamExpressionPath = "NONE";
    state.downstreamExpressionMethod = "NONE";
    state.downstreamExpressionStatus = "INITIAL_VISIBLE_CARRIER_DRAWN";
    state.visibleCarrierStatus = "INITIAL_VISIBLE_CARRIER_ACTIVE";
  }

  function tryDownstreamRender(ctx, canvas) {
    for (const path of DOWNSTREAM_PATHS) {
      const authority = readPath(path);
      if (!authority || !isObject(authority) || authority === api) continue;

      for (const method of DOWNSTREAM_DRAW_METHODS) {
        if (!isFunction(authority[method])) continue;

        try {
          const result = authority[method]({
            canvas,
            ctx,
            context: ctx,
            width: canvas.width,
            height: canvas.height,
            contract: CONTRACT,
            receipt: RECEIPT,
            view: clonePlain(state.view),
            canvasHub: api,
            noClaims: clonePlain(NO_CLAIMS)
          });

          if (result !== false) {
            state.downstreamExpressionObserved = true;
            state.downstreamExpressionPath = path;
            state.downstreamExpressionMethod = method;
            state.downstreamExpressionStatus = "DOWNSTREAM_EXPRESSION_RENDER_RETURNED";
            state.visibleCarrierStatus = "DOWNSTREAM_EXPRESSION_RENDER_ATTEMPTED";
            return true;
          }
        } catch (error) {
          state.lastError = `DOWNSTREAM_RENDER_ERROR:${path}.${method}:${bounded(error && error.message ? error.message : error, 900)}`;
        }
      }
    }

    return false;
  }

  function render() {
    const canvas = state.canvas;
    const ctx = state.context;

    if (!canvas || !ctx) return getReceiptLight();

    try {
      resizeCanvas(root, canvas, state.mount);

      const usedDownstream = tryDownstreamRender(ctx, canvas);
      if (!usedDownstream) drawInitialCarrier(ctx, canvas);

      state.renderCount += 1;
      state.lastRenderAt = nowIso();

      sampleVisiblePixels(canvas, ctx);
      publish();

      return getReceiptLight();
    } catch (error) {
      state.lastError = `RENDER_ERROR:${bounded(error && error.message ? error.message : error, 900)}`;
      publish();
      return getReceiptLight();
    }
  }

  function mount(input = {}) {
    const targetDocument = findDocument(input);
    const targetWindow = findWindow(input);

    if (!targetDocument) {
      state.mounted = false;
      state.lastError = "DOCUMENT_UNAVAILABLE";
      publish();
      return getReceiptLight();
    }

    const mountElement = input.mount || input.mountElement || ensureMount(targetDocument);
    const canvas = input.canvas || ensureCanvas(targetDocument, mountElement);

    if (!canvas) {
      state.mounted = false;
      state.lastError = "CANVAS_UNAVAILABLE";
      publish();
      return getReceiptLight();
    }

    const ctx = get2d(canvas);

    state.canvas = canvas;
    state.context = ctx;
    state.mount = mountElement || null;
    state.context2dReady = Boolean(ctx);
    state.mounted = Boolean(canvas && ctx);
    state.lastMountAt = nowIso();

    resizeCanvas(targetWindow, canvas, mountElement);

    if (state.mounted) render();

    try {
      targetWindow.dispatchEvent(
        new CustomEvent("hearth:canvas-ready", {
          detail: getReceiptLight()
        })
      );
    } catch (_error) {}

    publish();
    return getReceiptLight();
  }

  function boot(input = {}) {
    return mount(input);
  }

  function init(input = {}) {
    return mount(input);
  }

  function start(input = {}) {
    state.started = true;
    const receipt = mount(input);
    render();
    return receipt;
  }

  function create(input = {}) {
    return mount(input);
  }

  function redraw() {
    return render();
  }

  function draw() {
    return render();
  }

  function receiveSurfacePacket(packet = {}) {
    state.sourceStatus = "SURFACE_PACKET_RECEIVED";
    state.lastReceivedSurfacePacket = clonePlain(packet);
    return render();
  }

  function receiveExpressionPacket(packet = {}) {
    state.sourceStatus = "EXPRESSION_PACKET_RECEIVED";
    state.lastReceivedExpressionPacket = clonePlain(packet);
    return render();
  }

  function ingest(packet = {}) {
    return receiveExpressionPacket(packet);
  }

  function receive(packet = {}) {
    return receiveExpressionPacket(packet);
  }

  function setView(nextView = {}) {
    if (isObject(nextView)) {
      state.view = {
        yaw: safeNumber(nextView.yaw, state.view.yaw),
        pitch: safeNumber(nextView.pitch, state.view.pitch),
        scale: safeNumber(nextView.scale, state.view.scale)
      };
    }

    return render();
  }

  function getCanvas() {
    return state.canvas || null;
  }

  function getContext() {
    return state.context || null;
  }

  function getState() {
    const copy = clonePlain(state);
    delete copy.canvas;
    delete copy.context;
    delete copy.mount;
    return copy;
  }

  function getReport() {
    return {
      PACKET_NAME: "HEARTH_CANVAS_HUB_DOM_SURFACE_BINDING_FAST_VIEW_RECEIVER_REPORT_v1",
      CONTRACT,
      RECEIPT,
      INTERNAL_RENEWAL_CONTRACT,
      INTERNAL_RENEWAL_RECEIPT,
      VERSION,
      FILE,
      TARGET_ROUTE,

      CANVAS_HUB_STATUS: state.mounted
        ? "CANVAS_DOM_SURFACE_BOUND_AND_RENDERED"
        : "CANVAS_DOM_SURFACE_NOT_BOUND",
      CANVAS_HUB_PUBLIC_CONTRACT_PRESERVED: true,
      CANVAS_HUB_INTERNAL_RENEWAL_ACTIVE: true,

      CANVAS_ELEMENT_FOUND: Boolean(state.canvas),
      CANVAS_SELECTOR: state.canvasSelector,
      CANVAS_MOUNT_FOUND: state.mountFound,
      CANVAS_MOUNT_SELECTOR: state.mountSelector,
      CANVAS_IN_MOUNT: state.canvasInMount,
      CANVAS_CREATED_BY_HUB: state.canvasCreated,
      CANVAS_ADOPTED_BY_HUB: state.canvasAdopted,

      CANVAS_WIDTH_ATTRIBUTE: state.canvasWidth,
      CANVAS_HEIGHT_ATTRIBUTE: state.canvasHeight,
      CANVAS_INTERNAL_SIZE_NONZERO: state.canvasWidth > 0 && state.canvasHeight > 0,
      CANVAS_RECT_WIDTH: state.canvasRectWidth,
      CANVAS_RECT_HEIGHT: state.canvasRectHeight,
      CANVAS_RECT_NONZERO: state.canvasRectNonzero,
      CANVAS_CONTEXT_2D_READY: state.context2dReady,
      CANVAS_PIXEL_SAMPLE_STATUS: state.pixelSampleStatus,
      CANVAS_PIXEL_VISIBLE: state.pixelVisible,

      CURRENT_CANVAS_PARENT_CONTRACT: CONTRACT,
      CURRENT_CANVAS_PARENT_RECEIPT: RECEIPT,
      CURRENT_CANVAS_PARENT_RECOGNIZED: true,
      CANVAS_NAMESPACE_PRESENT: true,
      CANVAS_NAMESPACE_MATCHES_DOM_SURFACE: Boolean(
        state.canvas &&
          state.canvas.dataset &&
          state.canvas.dataset.hearthCanvasContract === CONTRACT &&
          state.canvasWidth > 0 &&
          state.canvasHeight > 0
      ),

      DOWNSTREAM_EXPRESSION_OBSERVED: state.downstreamExpressionObserved,
      DOWNSTREAM_EXPRESSION_PATH: state.downstreamExpressionPath,
      DOWNSTREAM_EXPRESSION_METHOD: state.downstreamExpressionMethod,
      DOWNSTREAM_EXPRESSION_STATUS: state.downstreamExpressionStatus,
      VISIBLE_CARRIER_STATUS: state.visibleCarrierStatus,
      SOURCE_STATUS: state.sourceStatus,

      RENDER_COUNT: state.renderCount,
      LAST_RENDER_AT: state.lastRenderAt,
      LAST_MOUNT_AT: state.lastMountAt,
      LAST_ERROR: state.lastError,

      PRODUCTION_MUTATION_AUTHORIZED: false,
      ROUTE_REPAIR_AUTHORIZED: false,
      CONTROL_MUTATION_AUTHORIZED: false,
      RUNTIME_RESTART_AUTHORIZED: false,
      TERRAIN_TRUTH_AUTHORITY: false,
      HYDROLOGY_TRUTH_AUTHORITY: false,
      MATERIAL_TRUTH_AUTHORITY: false,
      ELEVATION_TRUTH_AUTHORITY: false,

      generatedImage: false,
      graphicBox: false,
      webGL: false,
      webgl: false,

      ...NO_CLAIMS,
      ...UPPER_NO_CLAIMS
    };
  }

  function getReceiptLight() {
    return {
      contract: CONTRACT,
      receipt: RECEIPT,
      internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
      internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
      version: VERSION,
      file: FILE,
      targetRoute: TARGET_ROUTE,

      canvasHubActive: true,
      domCanvasSurfaceBindingActive: true,
      fastViewReceiverActive: true,
      publicContractPreserved: true,

      currentCanvasParentContract: CONTRACT,
      currentCanvasParentReceipt: RECEIPT,
      currentCanvasParentRecognized: true,

      canvasElementFound: Boolean(state.canvas),
      canvasSelector: state.canvasSelector,
      canvasMountFound: state.mountFound,
      canvasMountSelector: state.mountSelector,
      canvasInMount: state.canvasInMount,
      canvasCreatedByHub: state.canvasCreated,
      canvasAdoptedByHub: state.canvasAdopted,
      canvasRectNonzero: state.canvasRectNonzero,
      canvasContext2dReady: state.context2dReady,
      canvasPixelSampleStatus: state.pixelSampleStatus,
      canvasPixelVisible: state.pixelVisible,
      canvasNamespacePresent: true,
      canvasNamespaceMatchesDomSurface: Boolean(
        state.canvas &&
          state.canvas.dataset &&
          state.canvas.dataset.hearthCanvasContract === CONTRACT &&
          state.canvasWidth > 0 &&
          state.canvasHeight > 0
      ),

      downstreamExpressionObserved: state.downstreamExpressionObserved,
      downstreamExpressionPath: state.downstreamExpressionPath,
      downstreamExpressionMethod: state.downstreamExpressionMethod,
      downstreamExpressionStatus: state.downstreamExpressionStatus,
      visibleCarrierStatus: state.visibleCarrierStatus,

      mounted: state.mounted,
      started: state.started,
      renderCount: state.renderCount,
      lastRenderAt: state.lastRenderAt,
      lastMountAt: state.lastMountAt,
      lastError: state.lastError,

      bootApiAvailable: true,
      initApiAvailable: true,
      startApiAvailable: true,
      mountApiAvailable: true,
      createApiAvailable: true,
      renderApiAvailable: true,
      drawApiAvailable: true,
      redrawApiAvailable: true,
      receiveApiAvailable: true,
      ingestApiAvailable: true,
      receiveSurfacePacketApiAvailable: true,
      receiveExpressionPacketApiAvailable: true,
      setViewApiAvailable: true,
      getCanvasApiAvailable: true,
      getContextApiAvailable: true,
      getReportApiAvailable: true,
      getReceiptApiAvailable: true,
      getReceiptLightApiAvailable: true,
      getStateApiAvailable: true,

      diagnosticOnly: false,
      canvasDrawingAuthority: true,
      canvasCreationAuthority: true,
      canvasRepairAuthority: false,
      routeRepairAuthorized: false,
      controlMutationAuthorized: false,
      runtimeRestartAuthorized: false,
      terrainTruthAuthority: false,
      hydrologyTruthAuthority: false,
      materialTruthAuthority: false,
      elevationTruthAuthority: false,

      ...NO_CLAIMS
    };
  }

  function getReceipt() {
    return {
      ...getReceiptLight(),
      report: getReport(),
      state: getState(),
      acceptedDiagnosticCanvasSelectors: CANVAS_SELECTORS.slice(),
      acceptedMountSelectors: MOUNT_SELECTORS.slice(),
      downstreamExpressionPaths: DOWNSTREAM_PATHS.slice(),
      downstreamDrawMethods: DOWNSTREAM_DRAW_METHODS.slice(),
      supportsDomCanvasSurfaceBinding: true,
      supportsFastInitialVisibleCarrier: true,
      supportsDownstreamExpressionAdapter: true,
      supports2dContextOnly: true,
      supportsNoWebgl: true,
      supportsNoGeneratedImage: true,
      supportsNoGraphicBox: true,
      supportsNoFinalVisualPassClaim: true
    };
  }

  function publish() {
    root.HEARTH = root.HEARTH || {};
    root.DEXTER_LAB = root.DEXTER_LAB || {};

    root.HEARTH.canvasHubCompositeFirstFastViewDeferredHexReceiver = api;
    root.HEARTH.canvasHub = api;
    root.HEARTH.canvas = api;
    root.HEARTH.canvasExpressionHub = api;
    root.HEARTH.hearthCanvasHub = api;
    root.HEARTH.visiblePlanetCanvasHub = api;

    root.DEXTER_LAB.hearthCanvasHub = api;
    root.DEXTER_LAB.hearthCanvas = api;
    root.DEXTER_LAB.hearthCanvasExpressionHub = api;
    root.DEXTER_LAB.hearthVisiblePlanetCanvasHub = api;

    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER = api;
    root.HEARTH_CANVAS_HUB = api;
    root.HEARTH_CANVAS = api;
    root.HEARTH_CANVAS_EXPRESSION_HUB = api;
    root.HEARTH_VISIBLE_PLANET_CANVAS_HUB = api;

    root.HEARTH_CANVAS_HUB_COMPOSITE_FIRST_FAST_VIEW_DEFERRED_HEX_RENDER_RECEIVER_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_HUB_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_RECEIPT = getReceiptLight();
    root.HEARTH_CANVAS_EXPRESSION_HUB_RECEIPT = getReceiptLight();

    root.HEARTH_CANVAS_HUB_REPORT = getReport();
    root.HEARTH_CANVAS_REPORT = getReport();

    return true;
  }

  Object.assign(api, {
    CONTRACT,
    RECEIPT,
    contract: CONTRACT,
    receipt: RECEIPT,
    internalRenewalContract: INTERNAL_RENEWAL_CONTRACT,
    internalRenewalReceipt: INTERNAL_RENEWAL_RECEIPT,
    version: VERSION,
    file: FILE,
    targetRoute: TARGET_ROUTE,

    canvasHubActive: true,
    domCanvasSurfaceBindingActive: true,
    fastViewReceiverActive: true,
    publicContractPreserved: true,

    boot,
    init,
    start,
    mount,
    create,
    render,
    draw,
    redraw,
    receive,
    ingest,
    receiveSurfacePacket,
    receiveExpressionPacket,
    setView,
    getCanvas,
    getContext,
    getState,
    getReport,
    getReceiptLight,
    getReceipt,

    ownsCanvasDrawing: true,
    ownsCanvasCreation: true,
    ownsCanvasRepair: false,
    ownsRouteRepair: false,
    ownsControlMutation: false,
    ownsRuntimeRestart: false,
    ownsTerrainTruth: false,
    ownsHydrologyTruth: false,
    ownsMaterialTruth: false,
    ownsElevationTruth: false,
    ownsReadyText: false,
    ownsVisualPass: false,
    ownsGeneratedImage: false,
    ownsGraphicBox: false,
    ownsWebGL: false,

    supportsDomCanvasSurfaceBinding: true,
    supportsFastInitialVisibleCarrier: true,
    supportsDownstreamExpressionAdapter: true,
    supports2dContextOnly: true,
    supportsNoWebgl: true,
    supportsNoGeneratedImage: true,
    supportsNoGraphicBox: true,
    supportsNoFinalVisualPassClaim: true,

    canvasSelectors: CANVAS_SELECTORS,
    mountSelectors: MOUNT_SELECTORS,

    ...NO_CLAIMS
  });

  publish();

  function scheduleBoot() {
    const doc = root.document || null;
    if (!doc) return;

    const run = () => {
      try {
        mount({ targetDocument: doc, targetWindow: root });
      } catch (error) {
        state.lastError = `AUTO_BOOT_ERROR:${bounded(error && error.message ? error.message : error, 900)}`;
        publish();
      }
    };

    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }

    try {
      root.addEventListener("resize", () => {
        render();
      }, { passive: true });
    } catch (_error) {}
  }

  scheduleBoot();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
